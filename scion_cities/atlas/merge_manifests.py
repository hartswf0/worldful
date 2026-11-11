#!/usr/bin/env python3
"""
SCION v1.0 — Canonical 56-Entry Atlas Manifest Merger & 224-File Verifier
(`scion_cities/atlas/merge_manifests.json` -> `/Users/gaia/WORLDFUL/scion_cities/atlas/manifest.json`).

Merges:
  1. `manifests/pack_55_cities_manifest.json` (`54` non-Zaira Calvino cities)
  2. `manifests/pack_02_manifest.json` (`10` handmade Pack 02 cities, taking precedence on metadata)
  3. `manifests/pack_00_proof_manifest.json` (`case_00_abominable_cellar` + `city_04_zaira`)
Sorts strictly by `city_index` (`0..55`), writes `/Users/gaia/WORLDFUL/scion_cities/atlas/manifest.json`,
and strictly verifies all `56` entries (`224` files: `56` map `.svg`, `56` map `.png`,
`56` image `.svg`, `56` image `.png`) for XML validity, exact dimensions (`1200x900` / `1200x800`),
SHA-256 digest equality, `pixel_std >= 12.0`, and `0` `FORBIDDEN_FACIAL_TOKENS`.
"""
from __future__ import annotations

import json
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Any, Dict, List

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from scion_cities.atlas.plate_engine import (
    IMAGE_DIMENSIONS,
    MAP_DIMENSIONS,
    assert_no_facial_tokens,
    sanitize_plate_label,
    verify_plate_pair,
)
from scion_cities.core.scion_engine import FORBIDDEN_FACIAL_TOKENS

ATLAS_DIR = Path(__file__).resolve().parent
MANIFESTS_DIR = ATLAS_DIR / "manifests"
CANONICAL_MANIFEST_PATH = ATLAS_DIR / "manifest.json"


def merge_and_verify_atlas_manifest() -> Dict[str, Any]:
    pack_55_path = MANIFESTS_DIR / "pack_55_cities_manifest.json"
    pack_02_path = MANIFESTS_DIR / "pack_02_manifest.json"
    pack_00_path = MANIFESTS_DIR / "pack_00_proof_manifest.json"

    for req in (pack_55_path, pack_02_path, pack_00_path):
        if not req.is_file():
            raise FileNotFoundError(f"Required pack manifest missing: {req}")

    pack_55 = json.loads(pack_55_path.read_text(encoding="utf-8"))
    pack_02 = json.loads(pack_02_path.read_text(encoding="utf-8"))
    pack_00 = json.loads(pack_00_path.read_text(encoding="utf-8"))

    merged: Dict[str, Dict[str, Any]] = {}
    for src in (pack_55, pack_02, pack_00):
        for cid, entry in src.items():
            clean_entry = dict(entry)
            if "city_name" in clean_entry:
                clean_entry["city_name"] = sanitize_plate_label(str(clean_entry["city_name"]))
            if "title" in clean_entry:
                clean_entry["title"] = sanitize_plate_label(str(clean_entry["title"]))
            merged[cid] = clean_entry

    ordered = dict(
        sorted(merged.items(), key=lambda kv: int(kv[1]["city_index"]))
    )

    indices = [int(v["city_index"]) for v in ordered.values()]
    if indices != list(range(56)):
        raise AssertionError(f"Expected exact city_index sequence 0..55 (56 entries), got {indices}")

    # Verify every file on disk & confirm SHA-256 / dimensions / XML / pixel_std / zero facial tokens
    total_files_verified = 0
    total_bytes = 0
    map_stds: List[float] = []
    img_stds: List[float] = []

    for cid, meta in ordered.items():
        map_svg_p = ATLAS_DIR / meta["map_svg"]
        map_png_p = ATLAS_DIR / meta["map_png"]
        img_svg_p = ATLAS_DIR / meta["image_svg"]
        img_png_p = ATLAS_DIR / meta["image_png"]

        map_audit = verify_plate_pair(map_svg_p, map_png_p, MAP_DIMENSIONS)
        img_audit = verify_plate_pair(img_svg_p, img_png_p, IMAGE_DIMENSIONS)

        for svg_p in (map_svg_p, img_svg_p):
            svg_txt = svg_p.read_text(encoding="utf-8")
            ET.fromstring(svg_txt.encode("utf-8"))
            assert_no_facial_tokens(svg_txt, str(svg_p))
            words = set(re.findall(r"[a-z_]+", svg_txt.lower()))
            leaked = words & set(FORBIDDEN_FACIAL_TOKENS)
            if leaked:
                raise AssertionError(f"Forbidden facial tokens in {svg_p}: {sorted(leaked)}")

        # Synchronize & verify exact SHA-256 / byte / std telemetry with on-disk files
        for kind_key, actual_sha, exp_sha in (
            ("map_svg", map_audit["svg_sha256"], meta["sha256"]["map_svg"]),
            ("map_png", map_audit["png_sha256"], meta["sha256"]["map_png"]),
            ("image_svg", img_audit["svg_sha256"], meta["sha256"]["image_svg"]),
            ("image_png", img_audit["png_sha256"], meta["sha256"]["image_png"]),
        ):
            if actual_sha != exp_sha:
                raise AssertionError(
                    f"SHA-256 mismatch on {cid}.{kind_key}: disk={actual_sha} != manifest={exp_sha}"
                )

        if map_audit["pixel_std"] < 12.0 or img_audit["pixel_std"] < 12.0:
            raise AssertionError(f"Low pixel_std on {cid}: map={map_audit['pixel_std']}, img={img_audit['pixel_std']}")

        map_stds.append(float(map_audit["pixel_std"]))
        img_stds.append(float(img_audit["pixel_std"]))
        total_files_verified += 4
        total_bytes += (
            int(map_audit["svg_bytes"])
            + int(map_audit["png_bytes"])
            + int(img_audit["svg_bytes"])
            + int(img_audit["png_bytes"])
        )

    manifest_text = json.dumps(ordered, indent=2, ensure_ascii=False) + "\n"
    assert_no_facial_tokens(manifest_text, str(CANONICAL_MANIFEST_PATH))
    CANONICAL_MANIFEST_PATH.write_text(manifest_text, encoding="utf-8")

    return {
        "manifest_path": str(CANONICAL_MANIFEST_PATH),
        "manifest_bytes": CANONICAL_MANIFEST_PATH.stat().st_size,
        "entries_count": len(ordered),
        "city_index_range": [indices[0], indices[-1]],
        "files_verified": total_files_verified,
        "total_plate_bytes": total_bytes,
        "map_pixel_std_range": [round(min(map_stds), 3), round(max(map_stds), 3)],
        "image_pixel_std_range": [round(min(img_stds), 3), round(max(img_stds), 3)],
        "forbidden_facial_token_hits": 0,
    }


if __name__ == "__main__":
    report = merge_and_verify_atlas_manifest()
    print(json.dumps(report, indent=2))
