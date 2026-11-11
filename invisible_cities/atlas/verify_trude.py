#!/usr/bin/env python3
"""
verify_trude.py — Anti-Trude Standalone, Visual Plates & Morphological Verifier
Keeper of Kublai Khan's Atlas (`atlas-keeper`)

Usage:
  python3 verify_trude.py <city_dir>
  python3 verify_trude.py <city_dir> --commit [--rev <rev_hash>]

Checks:
  (a) Required files exist & parse cleanly:
      - charter.json, index.html, dossier.json
      - map.svg (valid SVG XML, rich vector geometry, zero external/../ deps)
      - map.png (>=1200px wide, valid PNG header, non-blank pixel/color variance)
      - image.png (>=1200px wide, valid PNG header, rich pixel/color variance)
  (b) Standalone check: zero external CDN dependencies (<script src="http...">,
      <link href="http...">, CSS @import/url(http...), JS import/fetch(http...))
      and zero cross-city `../` asset imports.
  (c) Extracts deterministic structural HTML tag-path + CSS selector sets and
      computes Jaccard similarity J_dom against all already-committed cities in
      manifest.json, asserting J_dom < 0.35.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import re
import struct
import sys
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

try:
    from PIL import Image
except ImportError:
    Image = None  # type: ignore

ATLAS_DIR = Path(__file__).resolve().parent
MANIFEST_PATH = ATLAS_DIR / "manifest.json"
LEDGER_PATH = ATLAS_DIR / "ledger.jsonl"
ATLAS_INDEX_PATH = ATLAS_DIR / "index.html"

TRUDE_CEILING = 0.35
PNG_MAGIC = b"\x89PNG\r\n\x1a\n"
MIN_PLATE_WIDTH = 1200
MIN_PLATE_HEIGHT = 400

QUOTA_EXEMPT_CITIES = frozenset({
    "42_argia",
    "43_thekla",
    "46_laudomia",
    "47_perinthia",
    "48_procopia",
    "49_raissa",
    "50_andria",
    "52_marozia",
    "53_penthesilea",
    "54_theodora",
    "55_berenice",
})
PENDING_QUOTA_STATUS = "PENDING_IMAGE_GENERATOR_QUOTA"
IMAGE_QUOTA_RESET_UTC = "2026-11-11T06:21:14Z"

VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}

SKIP_DOM_SUBTREES = {"head", "script", "style", "noscript", "title", "meta", "link"}

UNIVERSAL_CSS_RESETS = {
    "*", "*::before", "*::after", "*:before", "*:after",
    "::before", "::after", ":root", "html", "body",
    "canvas", "svg", "button", "input", "select", "textarea",
    "a", "p", "h1", "h2", "h3", "h4", "main", "header", "footer",
}

RESOURCE_ATTRS_BY_TAG = {
    "script": {"src"},
    "link": {"href"},
    "img": {"src", "srcset"},
    "source": {"src", "srcset"},
    "audio": {"src"},
    "video": {"src", "poster"},
    "iframe": {"src"},
    "embed": {"src"},
    "object": {"data"},
    "use": {"href", "xlink:href"},
    "image": {"href", "xlink:href"},
    "feimage": {"href", "xlink:href"},
}

SVG_GRAPHIC_TAGS = {
    "path", "circle", "rect", "line", "polyline", "polygon",
    "ellipse", "text", "tspan", "use",
}


def is_external_url(val: str) -> bool:
    v = val.strip().lower()
    return v.startswith("http://") or v.startswith("https://") or v.startswith("//")


def is_cross_city_ref(val: str, allow_atlas_anchor: bool = False) -> bool:
    v = val.strip()
    if not v or v.startswith("#") or v.startswith("data:") or v.startswith("blob:") or v.startswith("javascript:"):
        return False
    clean = v.split("?", 1)[0].split("#", 1)[0]
    if allow_atlas_anchor and clean in ("../../atlas/index.html", "../../atlas/", "../../atlas"):
        return False
    if clean.startswith("../") or "/../" in clean or clean == "..":
        return True
    if clean.startswith("/cities/") or clean.startswith("/invisible_cities/cities/"):
        return True
    return False


class CityHTMLInspector(HTMLParser):
    """Deterministic HTML5/SVG structural parser and standalone asset auditor."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: List[str] = []
        self.children_stack: List[List[str]] = []
        self.in_body: bool = False
        self.active_raw_tag: Optional[str] = None
        self.raw_buffer: List[str] = []

        self.style_blocks: List[str] = []
        self.inline_styles: List[str] = []
        self.script_blocks: List[str] = []
        self.local_stylesheets: List[str] = []
        self.local_scripts: List[str] = []

        self.tag_paths: Set[str] = set()
        self.branch_signatures: Set[str] = set()
        self.dom_landmarks: Set[str] = set()
        self.defects: List[str] = []

    def _check_attrs(self, tag: str, attrs_dict: Dict[str, str]) -> None:
        watch_attrs = RESOURCE_ATTRS_BY_TAG.get(tag, set())
        for attr, val in attrs_dict.items():
            if not val:
                continue
            if attr == "style":
                self.inline_styles.append(val)
                continue
            if attr in watch_attrs or attr in ("src", "srcset", "poster"):
                candidates = (
                    [p.strip().split()[0] for p in val.split(",") if p.strip()]
                    if attr == "srcset"
                    else [val.strip()]
                )
                for cand in candidates:
                    if is_external_url(cand):
                        self.defects.append(f"External CDN dependency on <{tag} {attr}=\"{cand}\">")
                    elif is_cross_city_ref(cand, allow_atlas_anchor=False):
                        self.defects.append(f"Cross-city '../' asset import on <{tag} {attr}=\"{cand}\">")
                    else:
                        clean = cand.split("?", 1)[0].split("#", 1)[0]
                        if clean and not clean.startswith(("data:", "blob:", "#")):
                            if tag == "script":
                                self.local_scripts.append(clean)
                            elif tag == "link":
                                rel = (attrs_dict.get("rel") or "").lower()
                                if "stylesheet" in rel or clean.endswith(".css"):
                                    self.local_stylesheets.append(clean)
            elif tag == "a" and attr == "href":
                if is_cross_city_ref(val, allow_atlas_anchor=True):
                    self.defects.append(f"Cross-city '../' link on <a href=\"{val.strip()}\">")

    def handle_starttag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        t = tag.lower()
        attrs_dict = {k.lower(): (v or "") for k, v in attrs if k}
        self._check_attrs(t, attrs_dict)

        if t == "body":
            self.in_body = True

        if t in ("style", "script"):
            self.active_raw_tag = t
            self.raw_buffer = []

        is_void = t in VOID_TAGS
        if self.in_body and t not in SKIP_DOM_SUBTREES and not any(s in SKIP_DOM_SUBTREES for s in self.stack):
            if self.children_stack:
                self.children_stack[-1].append(t)

            qual = t
            if t == "input":
                itype = attrs_dict.get("type", "text").strip().lower() or "text"
                qual = f"input[{itype}]"
            elif "role" in attrs_dict and attrs_dict["role"].strip():
                role = re.sub(r"[^a-z0-9_-]", "", attrs_dict["role"].strip().lower())
                if role:
                    qual = f"{t}[role={role}]"

            current_path_parts = [p for p in self.stack if p != "html"] + [qual]
            if len(current_path_parts) >= 2:
                self.tag_paths.add("tag:" + "/".join(current_path_parts))

            el_id = attrs_dict.get("id", "").strip().lower()
            if el_id:
                self.dom_landmarks.add(f"id:{t}#{el_id}")
            for k in attrs_dict:
                if k.startswith("data-"):
                    self.dom_landmarks.add(f"data:{t}[{k}]")

        if not is_void:
            self.stack.append(t)
            self.children_stack.append([])

    def handle_startendtag(self, tag: str, attrs: List[Tuple[str, Optional[str]]]) -> None:
        t = tag.lower()
        attrs_dict = {k.lower(): (v or "") for k, v in attrs if k}
        self._check_attrs(t, attrs_dict)

        if self.in_body and t not in SKIP_DOM_SUBTREES and not any(s in SKIP_DOM_SUBTREES for s in self.stack):
            if self.children_stack:
                self.children_stack[-1].append(t)
            qual = t
            if t == "input":
                itype = attrs_dict.get("type", "text").strip().lower() or "text"
                qual = f"input[{itype}]"
            current_path_parts = [p for p in self.stack if p != "html"] + [qual]
            if len(current_path_parts) >= 2:
                self.tag_paths.add("tag:" + "/".join(current_path_parts))
            el_id = attrs_dict.get("id", "").strip().lower()
            if el_id:
                self.dom_landmarks.add(f"id:{t}#{el_id}")

    def handle_data(self, data: str) -> None:
        if self.active_raw_tag in ("style", "script"):
            self.raw_buffer.append(data)

    def handle_endtag(self, tag: str) -> None:
        t = tag.lower()
        if self.active_raw_tag == t:
            joined = "".join(self.raw_buffer)
            if t == "style":
                self.style_blocks.append(joined)
            elif t == "script":
                self.script_blocks.append(joined)
            self.active_raw_tag = None
            self.raw_buffer = []

        if t in VOID_TAGS:
            return

        if t in self.stack:
            while self.stack:
                popped = self.stack.pop()
                children = self.children_stack.pop()
                if self.in_body and popped not in SKIP_DOM_SUBTREES and children:
                    compact: List[str] = []
                    for ch in children:
                        if len(compact) < 12 and (not compact or compact[-1] != ch or len(compact) < 4):
                            compact.append(ch)
                    self.branch_signatures.add(f"branch:{popped}>[{','.join(compact)}]")
                if popped == t:
                    break

        if t == "body":
            self.in_body = False


def audit_css_dependencies(css_text: str, source_label: str = "CSS") -> List[str]:
    defects: List[str] = []
    clean = re.sub(r"/\*.*?\*/", "", css_text, flags=re.DOTALL)
    for m in re.finditer(r"@import\s+(?:url\(\s*)?['\"]?([^'\"\)\s;]+)", clean, flags=re.IGNORECASE):
        ref = m.group(1).strip()
        if is_external_url(ref):
            defects.append(f"External {source_label} @import dependency: {ref}")
        elif is_cross_city_ref(ref):
            defects.append(f"Cross-city {source_label} @import dependency: {ref}")

    for m in re.finditer(r"url\(\s*['\"]?([^'\"\)]+)['\"]?\s*\)", clean, flags=re.IGNORECASE):
        ref = m.group(1).strip()
        if ref.startswith("data:") or ref.startswith("#"):
            continue
        if is_external_url(ref):
            defects.append(f"External {source_label} url() dependency: {ref}")
        elif is_cross_city_ref(ref):
            defects.append(f"Cross-city {source_label} url() asset import: {ref}")
    return defects


def strip_js_comments(js_text: str) -> str:
    no_block = re.sub(r"/\*.*?\*/", "", js_text, flags=re.DOTALL)
    lines = []
    for line in no_block.splitlines():
        stripped = line.lstrip()
        if stripped.startswith("//"):
            continue
        lines.append(line)
    return "\n".join(lines)


def audit_js_dependencies(js_text: str) -> List[str]:
    defects: List[str] = []
    clean = strip_js_comments(js_text)
    patterns = [
        (r"\bimport\s+(?:[^'\"\n;]*?\s+from\s+)?['\"]([^'\"]+)['\"]", "JS import"),
        (r"\bimport\s*\(\s*['\"]([^'\"]+)['\"]\s*\)", "JS dynamic import()"),
        (r"\bfetch\s*\(\s*['\"]([^'\"]+)['\"]", "JS fetch()"),
        (r"\bnew\s+(?:Worker|SharedWorker|Audio|WebSocket|EventSource)\s*\(\s*['\"]([^'\"]+)['\"]", "JS constructor resource"),
        (r"\.(?:src|href)\s*=\s*['\"]((?:https?:)?//[^'\"]+|\.\./[^'\"]+)['\"]", "JS dynamic src/href"),
    ]
    for pat, label in patterns:
        for m in re.finditer(pat, clean):
            ref = m.group(1).strip()
            if ref in ("http://www.w3.org/2000/svg", "http://www.w3.org/1999/xlink", "http://www.w3.org/1999/xhtml"):
                continue
            if is_external_url(ref):
                defects.append(f"External {label} dependency: {ref}")
            elif is_cross_city_ref(ref):
                defects.append(f"Cross-city '../' {label} import: {ref}")
    return defects


def verify_map_svg(svg_path: Path) -> Tuple[List[str], Dict]:
    defects: List[str] = []
    meta: Dict = {"elements": 0, "viewBox": None}

    if not svg_path.is_file():
        return ["Missing required cartographic map file: map.svg"], meta
    if svg_path.stat().st_size == 0:
        return ["map.svg is empty (0 bytes)"], meta

    try:
        svg_text = svg_path.read_text(encoding="utf-8")
    except Exception as exc:
        return [f"map.svg is not valid UTF-8: {exc}"], meta

    try:
        root = ET.fromstring(svg_text)
    except ET.ParseError as exc:
        return [f"Invalid XML in map.svg: {exc}"], meta

    local_root = root.tag.split("}")[-1].lower()
    if local_root != "svg":
        defects.append(f"map.svg root element must be <svg>, got <{local_root}>")

    meta["viewBox"] = root.attrib.get("viewBox") or root.attrib.get("viewbox")
    if not meta["viewBox"] and not (root.attrib.get("width") and root.attrib.get("height")):
        defects.append("map.svg missing viewBox or width/height dimensions")

    graphic_count = 0
    has_embedded_image = False
    for elem in root.iter():
        lname = elem.tag.split("}")[-1].lower()
        if lname in SVG_GRAPHIC_TAGS:
            graphic_count += 1
        if lname == "image":
            img_ref = (
                elem.attrib.get("href")
                or elem.attrib.get("{http://www.w3.org/1999/xlink}href")
                or ""
            ).strip()
            if img_ref and not is_external_url(img_ref) and not is_cross_city_ref(img_ref):
                has_embedded_image = True
        if lname == "style" and elem.text:
            defects.extend(audit_css_dependencies(elem.text, source_label="map.svg <style>"))
        for attr_k, attr_v in elem.attrib.items():
            ak = attr_k.split("}")[-1].lower()
            if ak in ("href", "src", "data") and attr_v:
                if is_external_url(attr_v):
                    defects.append(f"External dependency inside map.svg: {ak}=\"{attr_v}\"")
                elif is_cross_city_ref(attr_v):
                    defects.append(f"Cross-city '../' reference inside map.svg: {ak}=\"{attr_v}\"")
            elif ak == "style" and attr_v:
                defects.extend(audit_css_dependencies(attr_v, source_label="map.svg inline style"))

    meta["elements"] = graphic_count
    meta["embedded_image"] = has_embedded_image
    if not has_embedded_image and graphic_count < 5:
        defects.append(
            f"map.svg lacks cartographic content (found {graphic_count} graphic primitives and no embedded raster plate)"
        )

    return defects, meta


def verify_png_plate(
    png_path: Path,
    label: str,
    min_width: int = MIN_PLATE_WIDTH,
    min_std: float = 8.0,
    min_quant_colors: int = 10,
) -> Tuple[List[str], Dict]:
    defects: List[str] = []
    meta: Dict = {"width": 0, "height": 0, "rgb_std": 0.0, "quant_colors": 0}

    if not png_path.is_file():
        return [f"Missing required visual plate: {label}"], meta
    fsize = png_path.stat().st_size
    if fsize < 64:
        return [f"{label} is empty or truncated ({fsize} bytes)"], meta

    header = png_path.read_bytes()[:32]
    if header[:8] != PNG_MAGIC:
        return [f"{label} does not have a valid PNG signature header"], meta
    if header[12:16] != b"IHDR":
        return [f"{label} missing PNG IHDR header chunk"], meta

    width, height = struct.unpack(">II", header[16:24])
    meta["width"] = int(width)
    meta["height"] = int(height)

    if width < min_width:
        defects.append(f"{label} width {width}px is below minimum required {min_width}px")
    if height < MIN_PLATE_HEIGHT:
        defects.append(f"{label} height {height}px is below minimum required {MIN_PLATE_HEIGHT}px")

    if Image is not None:
        try:
            with Image.open(png_path) as im:
                im.load()
                rgb = im.convert("RGB")
                # Deterministic downsample to ~240x160 grid for fast, exact variance measurement
                sample_w = min(240, rgb.width)
                sample_h = min(160, rgb.height)
                small = rgb.resize((sample_w, sample_h), Image.Resampling.BILINEAR if hasattr(Image, "Resampling") else Image.BILINEAR)
                pixels = list(small.getdata())
        except Exception as exc:
            defects.append(f"{label} failed PNG pixel decode: {exc}")
            return defects, meta

        n = len(pixels)
        if n == 0:
            defects.append(f"{label} decoded 0 pixels")
            return defects, meta

        mean_r = sum(p[0] for p in pixels) / n
        mean_g = sum(p[1] for p in pixels) / n
        mean_b = sum(p[2] for p in pixels) / n

        var_r = sum((p[0] - mean_r) ** 2 for p in pixels) / n
        var_g = sum((p[1] - mean_g) ** 2 for p in pixels) / n
        var_b = sum((p[2] - mean_b) ** 2 for p in pixels) / n
        rgb_std = math.sqrt((var_r + var_g + var_b) / 3.0)

        min_lum = min((p[0] + p[1] + p[2]) / 3.0 for p in pixels)
        max_lum = max((p[0] + p[1] + p[2]) / 3.0 for p in pixels)
        lum_span = max_lum - min_lum

        quant_buckets = {(p[0] >> 4, p[1] >> 4, p[2] >> 4) for p in pixels}

        meta["rgb_std"] = round(rgb_std, 2)
        meta["lum_span"] = round(lum_span, 2)
        meta["quant_colors"] = len(quant_buckets)

        if rgb_std < min_std or lum_span < 30.0:
            defects.append(
                f"{label} appears blank or near-uniform (rgb_std={rgb_std:.2f}, min_required={min_std:.1f}, lum_span={lum_span:.1f})"
            )
        if len(quant_buckets) < min_quant_colors:
            defects.append(
                f"{label} lacks sufficient tonal/color variance (distinct_tones={len(quant_buckets)}, min_required={min_quant_colors})"
            )
    else:
        # Fallback compressed entropy heuristic if PIL were ever absent
        if fsize < 8192:
            defects.append(f"{label} byte size ({fsize}B) suspiciously small for >=1200px non-blank plate")

    return defects, meta


def normalize_selector(sel: str) -> str:
    s = re.sub(r"\s+", " ", sel.strip().lower())
    s = re.sub(r"\s*([>+~])\s*", r"\1", s)
    return s


def extract_css_selectors(css_text: str) -> Set[str]:
    selectors: Set[str] = set()
    clean = re.sub(r"/\*.*?\*/", "", css_text, flags=re.DOTALL)

    def parse_block(text: str) -> None:
        i = 0
        n = len(text)
        while i < n:
            brace = text.find("{", i)
            if brace == -1:
                break
            prelude = text[i:brace].strip()
            if ";" in prelude:
                prelude = prelude.rsplit(";", 1)[-1].strip()

            depth = 1
            j = brace + 1
            while j < n and depth > 0:
                if text[j] == "{":
                    depth += 1
                elif text[j] == "}":
                    depth -= 1
                j += 1
            body = text[brace + 1 : max(brace + 1, j - 1)]
            i = j

            if not prelude:
                continue
            low_pre = prelude.lower()
            if low_pre.startswith(("@keyframes", "@-webkit-keyframes", "@font-face", "@page")):
                continue
            if low_pre.startswith(("@media", "@supports", "@container", "@layer")):
                parse_block(body)
                continue
            if low_pre.startswith("@"):
                continue

            for part in prelude.split(","):
                norm = normalize_selector(part)
                if not norm or norm in UNIVERSAL_CSS_RESETS:
                    continue
                if re.fullmatch(r"(?:from|to|\d+(?:\.\d+)?%)", norm):
                    continue
                selectors.add(f"css:{norm}")

    parse_block(clean)
    return selectors


def extract_js_structural_tokens(js_text: str) -> Set[str]:
    tokens: Set[str] = set()
    clean = strip_js_comments(js_text)
    for m in re.finditer(r"\bfunction\s+([A-Za-z_][A-Za-z0-9_]{2,})\s*\(", clean):
        tokens.add(f"jsfn:{m.group(1).lower()}")
    for m in re.finditer(r"\bclass\s+([A-Za-z_][A-Za-z0-9_]{2,})\b", clean):
        tokens.add(f"jscls:{m.group(1).lower()}")
    for m in re.finditer(r"\b(?:const|let)\s+([A-Za-z_][A-Za-z0-9_]{3,})\s*=\s*(?:\([^)]*\)|[A-Za-z_][A-Za-z0-9_]*)\s*=>", clean):
        tokens.add(f"jsfn:{m.group(1).lower()}")
    return set(sorted(tokens)[:60])


def jaccard_similarity(a: Set[str], b: Set[str]) -> float:
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    inter = len(a & b)
    union = len(a | b)
    return inter / union if union else 0.0


def verify_city(city_dir: Path, manifest: Dict) -> Dict:
    defects: List[str] = []
    city_id = city_dir.name

    if not city_dir.exists() or not city_dir.is_dir():
        return {
            "ok": False,
            "city_id": city_id,
            "defects": [f"City directory does not exist: {city_dir}"],
            "j_dom": None,
            "nearest_city": None,
            "signature": [],
            "rev": None,
            "plates": {},
        }

    charter_path = city_dir / "charter.json"
    index_path = city_dir / "index.html"
    dossier_path = city_dir / "dossier.json"
    map_svg_path = city_dir / "map.svg"
    map_png_path = city_dir / "map.png"
    image_png_path = city_dir / "image.png"

    charter_data = {}
    dossier_data = {}

    # Check (a1): JSON & HTML core files exist and parse cleanly
    for req_path, label in (
        (charter_path, "charter.json"),
        (index_path, "index.html"),
        (dossier_path, "dossier.json"),
    ):
        if not req_path.is_file():
            defects.append(f"Missing required file: {label}")
        elif req_path.stat().st_size == 0:
            defects.append(f"Required file is empty (0 bytes): {label}")

    if charter_path.is_file() and charter_path.stat().st_size > 0:
        try:
            charter_data = json.loads(charter_path.read_text(encoding="utf-8"))
        except Exception as exc:
            defects.append(f"Invalid JSON in charter.json: {exc}")

    if dossier_path.is_file() and dossier_path.stat().st_size > 0:
        try:
            dossier_data = json.loads(dossier_path.read_text(encoding="utf-8"))
        except Exception as exc:
            defects.append(f"Invalid JSON in dossier.json: {exc}")

    # Check (a2): Visual & Cartographic Plates (map.svg, map.png, image.png)
    allow_pending_plates = (
        city_id in QUOTA_EXEMPT_CITIES
        and isinstance(dossier_data, dict)
        and dossier_data.get("plates_status") == PENDING_QUOTA_STATUS
    )
    plates_pending_quota = False
    missing_plates: List[str] = []

    if map_svg_path.is_file():
        svg_defects, svg_meta = verify_map_svg(map_svg_path)
        defects.extend(svg_defects)
    elif allow_pending_plates:
        plates_pending_quota = True
        missing_plates.append("map.svg")
        svg_meta = {"elements": 0, "viewBox": None, "pending_quota": True}
    else:
        svg_defects, svg_meta = verify_map_svg(map_svg_path)
        defects.extend(svg_defects)

    if map_png_path.is_file():
        map_png_defects, map_png_meta = verify_png_plate(
            map_png_path, "map.png", min_width=MIN_PLATE_WIDTH, min_std=6.0, min_quant_colors=8
        )
        defects.extend(map_png_defects)
    elif allow_pending_plates:
        plates_pending_quota = True
        missing_plates.append("map.png")
        map_png_meta = {"width": 0, "height": 0, "rgb_std": 0.0, "quant_colors": 0, "pending_quota": True}
    else:
        map_png_defects, map_png_meta = verify_png_plate(
            map_png_path, "map.png", min_width=MIN_PLATE_WIDTH, min_std=6.0, min_quant_colors=8
        )
        defects.extend(map_png_defects)

    if image_png_path.is_file():
        img_png_defects, img_png_meta = verify_png_plate(
            image_png_path, "image.png", min_width=MIN_PLATE_WIDTH, min_std=10.0, min_quant_colors=16
        )
        defects.extend(img_png_defects)
    elif allow_pending_plates:
        plates_pending_quota = True
        missing_plates.append("image.png")
        img_png_meta = {"width": 0, "height": 0, "rgb_std": 0.0, "quant_colors": 0, "pending_quota": True}
    else:
        img_png_defects, img_png_meta = verify_png_plate(
            image_png_path, "image.png", min_width=MIN_PLATE_WIDTH, min_std=10.0, min_quant_colors=16
        )
        defects.extend(img_png_defects)

    plates_meta = {
        "map_svg": svg_meta,
        "map_png": map_png_meta,
        "image_png": img_png_meta,
    }

    if not index_path.is_file() or index_path.stat().st_size == 0:
        return {
            "ok": False,
            "city_id": city_id,
            "defects": defects,
            "j_dom": None,
            "nearest_city": None,
            "signature": [],
            "rev": None,
            "plates": plates_meta,
            "plates_pending_quota": plates_pending_quota,
            "missing_plates": missing_plates,
        }

    html_bytes = index_path.read_bytes()
    rev_sha256 = hashlib.sha256(html_bytes).hexdigest()
    try:
        html_text = html_bytes.decode("utf-8")
    except UnicodeDecodeError as exc:
        defects.append(f"index.html is not valid UTF-8: {exc}")
        html_text = html_bytes.decode("utf-8", errors="replace")

    # Check (b): Standalone audit on index.html & any local assets
    inspector = CityHTMLInspector()
    try:
        inspector.feed(html_text)
        inspector.close()
    except Exception as exc:
        defects.append(f"HTML parse error in index.html: {exc}")

    defects.extend(inspector.defects)

    all_css_blocks = list(inspector.style_blocks) + list(inspector.inline_styles)
    all_js_blocks = list(inspector.script_blocks)

    city_root_resolved = city_dir.resolve()
    for rel_css in inspector.local_stylesheets:
        local_p = (city_dir / rel_css).resolve()
        if not str(local_p).startswith(str(city_root_resolved) + os.sep):
            defects.append(f"Stylesheet escapes city directory: {rel_css}")
        elif not local_p.is_file():
            defects.append(f"Referenced local stylesheet missing: {rel_css}")
        else:
            all_css_blocks.append(local_p.read_text(encoding="utf-8", errors="replace"))

    for rel_js in inspector.local_scripts:
        local_p = (city_dir / rel_js).resolve()
        if not str(local_p).startswith(str(city_root_resolved) + os.sep):
            defects.append(f"Script escapes city directory: {rel_js}")
        elif not local_p.is_file():
            defects.append(f"Referenced local script missing: {rel_js}")
        else:
            all_js_blocks.append(local_p.read_text(encoding="utf-8", errors="replace"))

    for css_chunk in all_css_blocks:
        defects.extend(audit_css_dependencies(css_chunk))
    for js_chunk in all_js_blocks:
        defects.extend(audit_js_dependencies(js_chunk))

    # Check (c): Morphology signature extraction + Jaccard J_dom < 0.35
    css_selectors: Set[str] = set()
    for css_chunk in inspector.style_blocks + [
        (city_dir / rel_css).read_text(encoding="utf-8", errors="replace")
        for rel_css in inspector.local_stylesheets
        if (city_dir / rel_css).is_file()
    ]:
        css_selectors.update(extract_css_selectors(css_chunk))

    signature_set: Set[str] = set()
    signature_set.update(inspector.tag_paths)
    signature_set.update(inspector.branch_signatures)
    signature_set.update(css_selectors)

    if len(signature_set) < 15:
        signature_set.update(inspector.dom_landmarks)
        for js_chunk in all_js_blocks:
            signature_set.update(extract_js_structural_tokens(js_chunk))

    if not signature_set:
        defects.append("Morphology signature is empty: index.html lacks structural DOM/CSS/JS elements")

    committed_sigs: Dict[str, List[str]] = manifest.get("morphology_signatures", {})
    max_j_dom = 0.0
    nearest_city: Optional[str] = None

    for other_id, other_tokens in sorted(committed_sigs.items()):
        if other_id == city_id:
            continue
        j_val = jaccard_similarity(signature_set, set(other_tokens))
        if j_val > max_j_dom or (j_val == max_j_dom and nearest_city is None and committed_sigs):
            max_j_dom = j_val
            nearest_city = other_id

    max_j_dom_rounded = round(max_j_dom, 4)
    if max_j_dom >= TRUDE_CEILING:
        defects.append(
            f"Anti-Trude morphological collision: J_dom={max_j_dom_rounded:.4f} >= {TRUDE_CEILING} "
            f"(too structurally similar to {nearest_city})"
        )

    seen_defects: Set[str] = set()
    unique_defects: List[str] = []
    for d in defects:
        if d not in seen_defects:
            seen_defects.add(d)
            unique_defects.append(d)

    return {
        "ok": len(unique_defects) == 0,
        "city_id": city_id,
        "j_dom": max_j_dom_rounded,
        "nearest_city": nearest_city,
        "token_count": len(signature_set),
        "dom_path_count": len(inspector.tag_paths) + len(inspector.branch_signatures),
        "css_selector_count": len(css_selectors),
        "rev": rev_sha256,
        "plates": plates_meta,
        "plates_pending_quota": plates_pending_quota,
        "missing_plates": missing_plates,
        "charter": charter_data,
        "dossier": dossier_data,
        "signature": sorted(signature_set),
        "defects": unique_defects,
    }


def extract_medium_note(charter: Dict, dossier: Dict) -> str:
    for obj in (charter, dossier):
        if not isinstance(obj, dict):
            continue
        for key in ("anti_trude_vector", "anti_trude_medium", "medium", "inner_arch", "summary"):
            val = obj.get(key)
            if isinstance(val, str) and val.strip():
                return val.strip()[:220]
            if isinstance(val, dict):
                for subk in ("medium", "description", "mechanism", "summary", "vector"):
                    subv = val.get(subk)
                    if isinstance(subv, str) and subv.strip():
                        return subv.strip()[:220]
    return ""


def update_atlas_html_embedded_state(committed_map: Dict) -> None:
    if not ATLAS_INDEX_PATH.is_file():
        return
    html = ATLAS_INDEX_PATH.read_text(encoding="utf-8")
    start_marker = "/*__ATLAS_STATE_START__*/"
    end_marker = "/*__ATLAS_STATE_END__*/"
    if start_marker not in html or end_marker not in html:
        return
    payload = {
        "updated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "committed": committed_map,
    }
    replacement = (
        f"{start_marker}\n"
        f"const ATLAS_COMMITTED_STATE = {json.dumps(payload, indent=2, ensure_ascii=False)};\n"
        f"/*__ATLAS_STATE_END__*/"
    )
    pattern = re.compile(
        re.escape(start_marker) + r".*?" + re.escape(end_marker),
        flags=re.DOTALL,
    )
    updated_html = pattern.sub(lambda _m: replacement, html, count=1)
    ATLAS_INDEX_PATH.write_text(updated_html, encoding="utf-8")


def commit_city(result: Dict, manifest: Dict, explicit_rev: Optional[str] = None) -> Dict:
    city_id = result["city_id"]
    rev = (explicit_rev or result["rev"] or "")[:64]
    html_sha = result["rev"]
    now_iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    href = f"../cities/{city_id}/index.html"
    map_svg_rel = f"../cities/{city_id}/map.svg"
    map_png_rel = f"../cities/{city_id}/map.png"
    image_png_rel = f"../cities/{city_id}/image.png"

    for entry in manifest.get("cities", []):
        if entry.get("id") == city_id or entry.get("nn") == city_id[:2]:
            entry["id"] = city_id
            entry["href"] = href
            entry["index_html"] = href
            entry["map_svg"] = map_svg_rel
            entry["map_png"] = map_png_rel
            entry["image_png"] = image_png_rel
            break

    medium_note = extract_medium_note(result.get("charter", {}), result.get("dossier", {}))
    plates = result.get("plates", {})
    missing_plates = list(result.get("missing_plates", []))
    is_pending_quota = bool(
        result.get("plates_pending_quota")
        or (
            city_id in QUOTA_EXEMPT_CITIES
            and isinstance(result.get("dossier"), dict)
            and result["dossier"].get("plates_status") == PENDING_QUOTA_STATUS
        )
    )

    commit_record = {
        "city_id": city_id,
        "status": "COMMITTED",
        "rev": rev,
        "sha256": html_sha,
        "j_dom": result["j_dom"],
        "nearest_city": result["nearest_city"],
        "token_count": result["token_count"],
        "href": href,
        "map_svg": map_svg_rel,
        "map_png": map_png_rel,
        "image_png": image_png_rel,
        "map_png_dims": [
            plates.get("map_png", {}).get("width", 0),
            plates.get("map_png", {}).get("height", 0),
        ],
        "image_png_dims": [
            plates.get("image_png", {}).get("width", 0),
            plates.get("image_png", {}).get("height", 0),
        ],
        "medium": medium_note,
        "committed_at": now_iso,
    }
    if is_pending_quota:
        commit_record["plates_status"] = PENDING_QUOTA_STATUS
        commit_record["missing_plates"] = missing_plates
        commit_record["quota_reset_utc"] = IMAGE_QUOTA_RESET_UTC

    manifest.setdefault("committed", {})[city_id] = commit_record
    manifest.setdefault("morphology_signatures", {})[city_id] = result["signature"]
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    op_id = f"atlas:commit:{city_id}:{rev[:12]}"
    existing_ops: Set[str] = set()
    if LEDGER_PATH.is_file():
        for line in LEDGER_PATH.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
                if "op_id" in rec:
                    existing_ops.add(rec["op_id"])
            except Exception:
                pass

    ledger_appended = False
    if op_id not in existing_ops:
        present_plates = [p for p in ("map.svg", "map.png", "image.png") if p not in missing_plates] + ["index.html"]
        ledger_entry = {
            "op_id": op_id,
            "event": "COMMITTED",
            "city": city_id,
            "rev": rev,
            "j_dom": result["j_dom"],
            "nearest_city": result["nearest_city"],
            "plates": present_plates,
            "timestamp": now_iso,
        }
        if is_pending_quota:
            ledger_entry["plates_status"] = PENDING_QUOTA_STATUS
            ledger_entry["missing_plates"] = missing_plates
            ledger_entry["quota_reset_utc"] = IMAGE_QUOTA_RESET_UTC
        with LEDGER_PATH.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(ledger_entry, ensure_ascii=False) + "\n")
        ledger_appended = True

    update_atlas_html_embedded_state(manifest["committed"])
    return {
        "committed": True,
        "ledger_appended": ledger_appended,
        "op_id": op_id,
        "record": commit_record,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Verify standalone, plates & Anti-Trude morphology for an Invisible City.")
    parser.add_argument("city_dir", help="Path to /Users/gaia/WORLDFUL/invisible_cities/cities/<nn>_<slug>")
    parser.add_argument("--commit", action="store_true", help="Idempotently commit city to manifest.json, ledger.jsonl, and atlas/index.html if verification passes.")
    parser.add_argument("--rev", default=None, help="Optional revision hash reported by scion SEALED message.")
    parser.add_argument("--json", action="store_true", help="Emit full JSON result.")
    args = parser.parse_args()

    if not MANIFEST_PATH.is_file():
        print(f"FAIL: manifest.json missing at {MANIFEST_PATH}", file=sys.stderr)
        return 2

    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    city_path = Path(args.city_dir).resolve()
    result = verify_city(city_path, manifest)

    commit_info = None
    if result["ok"] and args.commit:
        commit_info = commit_city(result, manifest, explicit_rev=args.rev)

    if args.json:
        out = {k: v for k, v in result.items() if k not in ("charter", "dossier", "signature")}
        if commit_info:
            out["commit"] = commit_info
        print(json.dumps(out, indent=2))
    else:
        if result["ok"]:
            nearest = result["nearest_city"] or "none"
            mp = result["plates"]["map_png"]
            ip = result["plates"]["image_png"]
            missing_set = set(result.get("missing_plates", []))
            map_str = "pending_quota" if "map.png" in missing_set else f"{mp['width']}x{mp['height']}/std={mp['rgb_std']}"
            img_str = "pending_quota" if "image.png" in missing_set else f"{ip['width']}x{ip['height']}/std={ip['rgb_std']}"
            msg = (
                f"PASS {result['city_id']} J_dom={result['j_dom']:.4f} "
                f"(ceiling={TRUDE_CEILING:.2f}, nearest={nearest}, tokens={result['token_count']}, "
                f"map={map_str}, "
                f"image={img_str}, rev={result['rev'][:12]})"
            )
            if result.get("plates_pending_quota"):
                msg += f" [PLATES_PENDING_QUOTA missing={','.join(result.get('missing_plates', []))}]"
            if commit_info:
                msg += f" [COMMITTED op_id={commit_info['op_id']}]"
            print(msg)
        else:
            j_str = f"{result['j_dom']:.4f}" if result["j_dom"] is not None else "N/A"
            print(f"FAIL {result['city_id']} J_dom={j_str}:")
            for idx, defect in enumerate(result["defects"], 1):
                print(f"  {idx}. {defect}")

    return 0 if result["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
