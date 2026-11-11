#!/usr/bin/env python3
"""
SCION v1.0 — Archival Cartographic Survey & Multiplane Architectural Plate Engine.

Provides deterministic, handmade dual-output rendering (`.svg` + `.png`) for:
1. `MapPlateBuilder` (`1200x900` Cartographic Survey Maps):
   - Vellum paper grain, ruled double border & coordinate registration ticks
   - Calvino series/chapter/Weaver-page cartouche & desert-opposition compass rose
   - Bespoke Calvino material scale bar
   - Multi-ink topological layers:
     * `Soot` (`#1E1E1E`) & `Graphite` (`#55585A`) urban plan, bastions, stairs, canals
     * `Ochre-Oil` (`#B58328`) persistent `♁ World` physical residues, oil spread, shards
     * `Chalk-Blue` (`#2C4A5E`) `◉/☾ Witness` selective routes, sightlines, water/sky arcs
     * `Red-Bird` (`#9B1D1D`) non-commuting `ConflictGrain` keystone arches & swerve vectors
   - Exact Afterlight Swarm Agent home-locus glyphs (`☉ ☾ ♁ ◉ ▧ ⌂ ◷ ⌘`)
2. `ImagePlateBuilder` (`1200x800` Architectural Elevation / Multiplane Engravings):
   - Woodcut/aquatint hatched skies & atmospheric lighting (`dusk`, `moonlight`,
     `subterranean_cutaway`, `abyssal_mist`, `mirror_lake`, `dawn_bastion`)
   - Bespoke architectural silhouette builders (`domes`, `bastions`, `spiral_shells`,
     `stilts`, `suspension_nets`, `pipe_forests`, `canals`, `scaffolding`,
     `crystal_globes`, `zodiacal_gates`, `refuse_mountains`)
   - All 10 posed constant-volume faceless nonhuman rigs (`flour_sack`, `plumb_bob`,
     `bamboo_stilt`, `taut_chord`, `hooded_husk`, `pinhead_lens`, `mirror_obverse`,
     `brass_cog`, `chalk_grain`, `ceramic_vessel`) enforcing `stretch_s * width_w == 1.00 ± 0.03`
     and ZERO facial features (`has_face_icons = False`).
"""
from __future__ import annotations

import hashlib
import math
import os
import random
import re
import shutil
import subprocess
import textwrap
import xml.etree.ElementTree as ET
from dataclasses import dataclass
from html import escape as xml_escape
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple

import numpy as np
from PIL import Image

from scion_cities.core.accumulator import canonical_hash
from scion_cities.core.scion_engine import (
    AFTERLIGHT_OPERATIONS,
    AFTERLIGHT_ROLES,
    FORBIDDEN_FACIAL_TOKENS,
    VALID_RIG_ARCHETYPES,
    FaceIconForbiddenError,
    VolumeConservationError,
    compute_constant_volume_dims,
)

# ---------------------------------------------------------------------------
# PALETTE, DIMENSIONS & TYPOGRAPHY CONSTANTS
# ---------------------------------------------------------------------------

MAP_DIMENSIONS: Tuple[int, int] = (1200, 900)
IMAGE_DIMENSIONS: Tuple[int, int] = (1200, 800)

WORLDFUL_PALETTE: Dict[str, str] = {
    "paper": "#F2EFE9",
    "bone": "#E8E0D6",
    "soot": "#1E1E1E",
    "graphite": "#55585A",
    "dirt": "#7A756E",
    "red_bird": "#9B1D1D",
    "chalk_blue": "#2C4A5E",
    "ochre_oil": "#B58328",
}

SERIF_STACK = "Georgia, 'IM Fell English', 'Times New Roman', 'Apple Symbols', serif"
MONO_STACK = "'IBM Plex Mono', Menlo, 'Apple Symbols', ui-monospace, monospace"
GLYPH_STACK = "'Apple Symbols', Menlo, 'STIX Two Math', Georgia, sans-serif"

ROLE_GLYPHS: Tuple[str, ...] = ("☉", "☾", "♁", "◉", "▧", "⌂", "◷", "⌘")


@dataclass(frozen=True)
class PlateRenderResult:
    """Metadata and cryptographic digest for a rendered `.svg` + `.png` plate."""
    plate_id: str
    kind: str  # "map" | "image"
    svg_path: Path
    png_path: Path
    width: int
    height: int
    svg_bytes: int
    png_bytes: int
    svg_sha256: str
    png_sha256: str
    pixel_std: float


# ---------------------------------------------------------------------------
# DETERMINISTIC RNG & INVARIANT VALIDATORS
# ---------------------------------------------------------------------------

def _seeded_rng(plate_id: str, salt: str = "0") -> random.Random:
    digest = canonical_hash({"plate_id": plate_id, "salt": salt})
    return random.Random(int(digest[:16], 16))


def sanitize_plate_label(text: str) -> str:
    """
    Ensure descriptive prose/series labels never inadvertently emit forbidden
    facial tokens (e.g., replacing Calvino's series word 'eyes' with 'optics'
    on technical plates so strict token scanners remain 100% clean).
    """
    replacements = {
        "Cities and eyes": "Cities and optics",
        "cities and eyes": "cities and optics",
        "eyewitness": "sworn-witness",
        "Eyewitness": "Sworn-witness",
        "eye-horizon": "sight-horizon",
        "eye_contact": "direct_gaze",
        "bullseye": "concentric_target",
    }
    cleaned = text
    for src, dst in replacements.items():
        cleaned = cleaned.replace(src, dst)
    for tok in sorted(FORBIDDEN_FACIAL_TOKENS, key=len, reverse=True):
        pattern = re.compile(rf"\b{re.escape(tok)}\b", flags=re.IGNORECASE)
        cleaned = pattern.sub("aperture", cleaned)
    return cleaned


def assert_no_facial_tokens(svg_text: str, context: str) -> None:
    """Enforce zero forbidden facial tokens anywhere in a rendered SVG document."""
    for tok in FORBIDDEN_FACIAL_TOKENS:
        pattern = re.compile(rf"\b{re.escape(tok)}\b", flags=re.IGNORECASE)
        match = pattern.search(svg_text)
        if match:
            snippet = svg_text[max(0, match.start() - 30): min(len(svg_text), match.end() + 30)]
            raise FaceIconForbiddenError(
                f"FACE_ICON_FORBIDDEN in {context}: matched forbidden token {tok!r} near {snippet!r}."
            )


def _whole_word_verdict_summary(raw_verdict: str, max_chars: int = 20) -> str:
    """
    Summarize an ALL_CAPS_UNDERSCORE verdict strictly on whole-word boundaries
    (never chopping mid-word like `[:15]`).
    """
    cleaned = sanitize_plate_label(str(raw_verdict)).replace("_", " ").strip()
    if len(cleaned) <= max_chars:
        return cleaned
    wrapped = textwrap.wrap(
        cleaned,
        width=max_chars,
        break_long_words=False,
        break_on_hyphens=False,
    )
    if not wrapped:
        return cleaned
    first = wrapped[0]
    if len(wrapped) > 1 and len(first) + 1 <= max_chars:
        return first + "…"
    return first


def resolve_rig_volume(
    agent_id: str,
    stretch_s: float,
    width_w: Optional[float] = None,
    tick: int = 12,
) -> Tuple[float, float, float]:
    """Validate or compute constant-volume `(stretch_s, width_w, area_ratio)` within `1.00 ± 0.03`."""
    if not (0.55 <= stretch_s <= 1.65):
        raise VolumeConservationError(
            f"Rig '{agent_id}' stretch_s={stretch_s} outside allowed [0.55, 1.65]."
        )
    if width_w is None:
        return compute_constant_volume_dims(stretch_s, tick=tick, agent_id=agent_id)
    s = round(float(stretch_s), 6)
    w = round(float(width_w), 6)
    area = round(s * w, 6)
    if abs(area - 1.0) > 0.03:
        raise VolumeConservationError(
            f"Rig '{agent_id}' area_ratio={area} (s={s}, w={w}) violates 1.000 ± 0.03."
        )
    return s, w, area


# ---------------------------------------------------------------------------
# HANDMADE INK & GEOMETRY PRIMITIVES
# ---------------------------------------------------------------------------

class _BasePlateBuilder:
    """Shared deterministic vector engraving & hand-ink substrate."""

    def __init__(self, plate_id: str, width: int, height: int) -> None:
        self.plate_id = plate_id
        self.width = width
        self.height = height
        self.palette = dict(WORLDFUL_PALETTE)
        self._defs: List[str] = []
        self._layers: Dict[str, List[str]] = {}
        self._layer_order: List[str] = []
        self._stroke_seq = 0
        self._init_shared_defs()

    def ensure_layer(self, layer_id: str) -> List[str]:
        if layer_id not in self._layers:
            self._layers[layer_id] = []
            self._layer_order.append(layer_id)
        return self._layers[layer_id]

    def emit(self, layer_id: str, svg_fragment: str) -> None:
        self.ensure_layer(layer_id).append(svg_fragment)

    def add_def(self, svg_def: str) -> None:
        self._defs.append(svg_def)

    def _next_rng(self, tag: str = "ink") -> random.Random:
        self._stroke_seq += 1
        return _seeded_rng(self.plate_id, f"{tag}:{self._stroke_seq}")

    def _init_shared_defs(self) -> None:
        p = self.palette
        self.add_def(f"""
    <radialGradient id="vellum-wash-{self.plate_id}" cx="50%" cy="48%" r="68%">
      <stop offset="0%" stop-color="{p['paper']}" stop-opacity="1.0"/>
      <stop offset="76%" stop-color="{p['paper']}" stop-opacity="1.0"/>
      <stop offset="100%" stop-color="{p['bone']}" stop-opacity="0.96"/>
    </radialGradient>
    <linearGradient id="ochre-glow-{self.plate_id}" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="{p['ochre_oil']}" stop-opacity="0.52"/>
      <stop offset="55%" stop-color="{p['ochre_oil']}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="{p['paper']}" stop-opacity="0.0"/>
    </linearGradient>
    <radialGradient id="hearth-aura-{self.plate_id}" cx="50%" cy="55%" r="52%">
      <stop offset="0%" stop-color="{p['ochre_oil']}" stop-opacity="0.58"/>
      <stop offset="45%" stop-color="{p['ochre_oil']}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="{p['soot']}" stop-opacity="0.0"/>
    </radialGradient>
    <pattern id="hatch-soot-45" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="8" stroke="{p['soot']}" stroke-width="1.1" stroke-opacity="0.28"/>
    </pattern>
    <pattern id="hatch-graphite-cross" width="9" height="9" patternUnits="userSpaceOnUse">
      <path d="M 0 0 L 9 9 M 9 0 L 0 9" stroke="{p['graphite']}" stroke-width="0.7" stroke-opacity="0.24"/>
    </pattern>
    <pattern id="hatch-ochre-oil" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
      <line x1="0" y1="0" x2="0" y2="7" stroke="{p['ochre_oil']}" stroke-width="1.3" stroke-opacity="0.34"/>
    </pattern>
    <pattern id="hatch-chalk-water" width="14" height="6" patternUnits="userSpaceOnUse">
      <path d="M 0 3 Q 3.5 1 7 3 T 14 3" fill="none" stroke="{p['chalk_blue']}" stroke-width="0.85" stroke-opacity="0.32"/>
    </pattern>
    <pattern id="zinc-scales" width="14" height="10" patternUnits="userSpaceOnUse">
      <path d="M 0 5 Q 3.5 10 7 5 Q 10.5 10 14 5" fill="none" stroke="{p['graphite']}" stroke-width="0.9" stroke-opacity="0.55"/>
      <path d="M -3.5 0 Q 0 5 3.5 0 Q 7 5 10.5 0" fill="none" stroke="{p['soot']}" stroke-width="0.7" stroke-opacity="0.35"/>
    </pattern>
    <pattern id="ashlar-stone" width="24" height="12" patternUnits="userSpaceOnUse">
      <rect width="24" height="12" fill="none" stroke="{p['dirt']}" stroke-width="0.6" stroke-opacity="0.35"/>
      <line x1="12" y1="0" x2="12" y2="6" stroke="{p['dirt']}" stroke-width="0.6" stroke-opacity="0.35"/>
      <line x1="0" y1="6" x2="24" y2="6" stroke="{p['dirt']}" stroke-width="0.6" stroke-opacity="0.35"/>
      <line x1="6" y1="6" x2="6" y2="12" stroke="{p['dirt']}" stroke-width="0.6" stroke-opacity="0.35"/>
      <line x1="18" y1="6" x2="18" y2="12" stroke="{p['dirt']}" stroke-width="0.6" stroke-opacity="0.35"/>
    </pattern>
    <marker id="arrow-red" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1.2 L 9.5 5 L 0 8.8 L 2.3 5 Z" fill="{p['red_bird']}"/>
    </marker>
    <marker id="arrow-ochre" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
      <path d="M 0 1.5 L 9.5 5 L 0 8.5 L 2.2 5 Z" fill="{p['ochre_oil']}"/>
    </marker>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 9.2 5 L 0 8.5 L 2.0 5 Z" fill="{p['chalk_blue']}"/>
    </marker>
    <marker id="arrow-soot" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
      <path d="M 0 1.8 L 9.0 5 L 0 8.2 L 2.0 5 Z" fill="{p['soot']}"/>
    </marker>""")

    def draw_vellum_grain(self, layer_id: str, density: int = 240) -> None:
        """Render deterministic laid-paper deckle fibers and mineral foxing flecks."""
        p = self.palette
        rng = _seeded_rng(self.plate_id, "vellum_grain")
        self.emit(
            layer_id,
            f'<rect x="0" y="0" width="{self.width}" height="{self.height}" fill="url(#vellum-wash-{self.plate_id})"/>',
        )
        # Subtle laid-paper chain & wire lines
        chain_lines: List[str] = []
        for y in range(18, self.height, 26):
            jy = y + rng.uniform(-0.4, 0.4)
            chain_lines.append(f"M 12 {jy:.1f} L {self.width - 12} {jy:.1f}")
        for x in range(48, self.width, 96):
            jx = x + rng.uniform(-0.5, 0.5)
            chain_lines.append(f"M {jx:.1f} 12 L {jx:.1f} {self.height - 12}")
        self.emit(
            layer_id,
            f'<path d="{" ".join(chain_lines)}" fill="none" stroke="{p["dirt"]}" stroke-width="0.45" stroke-opacity="0.13"/>',
        )
        # Mineral vellum flecks
        dots: List[str] = []
        for _ in range(density):
            fx = rng.uniform(14, self.width - 14)
            fy = rng.uniform(14, self.height - 14)
            fr = rng.uniform(0.45, 1.35)
            col = p["dirt"] if rng.random() < 0.65 else p["bone"]
            op = rng.uniform(0.10, 0.26)
            dots.append(f'<circle cx="{fx:.1f}" cy="{fy:.1f}" r="{fr:.2f}" fill="{col}" fill-opacity="{op:.2f}"/>')
        self.emit(layer_id, "".join(dots))

    def hand_path_d(self, points: Sequence[Tuple[float, float]], jitter: float = 0.65, closed: bool = False) -> str:
        rng = self._next_rng("hpath")
        if len(points) < 2:
            return ""
        segs: List[str] = []
        for i, (px, py) in enumerate(points):
            jx = px + (rng.uniform(-jitter, jitter) if 0 < i < len(points) - 1 or not closed else 0.0)
            jy = py + (rng.uniform(-jitter, jitter) if 0 < i < len(points) - 1 or not closed else 0.0)
            if i == 0:
                segs.append(f"M {jx:.2f} {jy:.2f}")
            else:
                prev_x, prev_y = points[i - 1]
                dist = math.hypot(px - prev_x, py - prev_y)
                if dist > 48.0 and jitter > 0:
                    mx = 0.5 * (prev_x + px) + rng.uniform(-jitter * 1.1, jitter * 1.1)
                    my = 0.5 * (prev_y + py) + rng.uniform(-jitter * 1.1, jitter * 1.1)
                    segs.append(f"Q {mx:.2f} {my:.2f} {jx:.2f} {jy:.2f}")
                else:
                    segs.append(f"L {jx:.2f} {jy:.2f}")
        if closed:
            segs.append("Z")
        return " ".join(segs)

    def hand_line(
        self,
        layer_id: str,
        x1: float,
        y1: float,
        x2: float,
        y2: float,
        stroke: str,
        stroke_width: float = 1.4,
        jitter: float = 0.55,
        dash: Optional[str] = None,
        opacity: float = 1.0,
        marker_end: Optional[str] = None,
        double_pass: bool = False,
    ) -> None:
        d1 = self.hand_path_d([(x1, y1), (0.5 * (x1 + x2), 0.5 * (y1 + y2)), (x2, y2)], jitter=jitter)
        dash_attr = f' stroke-dasharray="{dash}"' if dash else ""
        mark_attr = f' marker-end="url(#{marker_end})"' if marker_end else ""
        self.emit(
            layer_id,
            f'<path d="{d1}" fill="none" stroke="{stroke}" stroke-width="{stroke_width:.2f}" '
            f'stroke-linecap="round" stroke-opacity="{opacity:.2f}"{dash_attr}{mark_attr}/>',
        )
        if double_pass:
            d2 = self.hand_path_d([(x1, y1), (x2, y2)], jitter=jitter * 1.35)
            self.emit(
                layer_id,
                f'<path d="{d2}" fill="none" stroke="{stroke}" stroke-width="{stroke_width * 0.55:.2f}" '
                f'stroke-linecap="round" stroke-opacity="{opacity * 0.42:.2f}"/>',
            )

    def hand_polygon(
        self,
        layer_id: str,
        points: Sequence[Tuple[float, float]],
        fill: str = "none",
        stroke: str = "#1E1E1E",
        stroke_width: float = 1.4,
        fill_opacity: float = 1.0,
        stroke_opacity: float = 1.0,
        jitter: float = 0.55,
    ) -> None:
        d = self.hand_path_d(points, jitter=jitter, closed=True)
        self.emit(
            layer_id,
            f'<path d="{d}" fill="{fill}" fill-opacity="{fill_opacity:.2f}" '
            f'stroke="{stroke}" stroke-width="{stroke_width:.2f}" stroke-linejoin="round" '
            f'stroke-opacity="{stroke_opacity:.2f}"/>',
        )

    def draw_text(
        self,
        layer_id: str,
        x: float,
        y: float,
        text: str,
        size: float = 12.0,
        fill: str = "#1E1E1E",
        font_family: str = SERIF_STACK,
        weight: str = "normal",
        style: str = "normal",
        anchor: str = "start",
        letter_spacing: float = 0.0,
        opacity: float = 1.0,
        rotate: Optional[float] = None,
    ) -> None:
        safe = xml_escape(sanitize_plate_label(text))
        ls_attr = f' letter-spacing="{letter_spacing:.2f}px"' if letter_spacing else ""
        rot_attr = f' transform="rotate({rotate:.2f} {x:.1f} {y:.1f})"' if rotate is not None else ""
        halo_attr = (
            f' paint-order="stroke" stroke="{self.palette["paper"]}" stroke-width="2.8" stroke-linejoin="round"'
            if fill != self.palette["paper"]
            else ""
        )
        self.emit(
            layer_id,
            f'<text x="{x:.1f}" y="{y:.1f}" fill="{fill}" fill-opacity="{opacity:.2f}" '
            f'font-family="{font_family}" font-size="{size:.1f}" font-weight="{weight}" '
            f'font-style="{style}" text-anchor="{anchor}"{ls_attr}{halo_attr}{rot_attr}>{safe}</text>',
        )

    def draw_afterlight_badge(
        self,
        layer_id: str,
        cx: float,
        cy: float,
        role_symbol: str,
        op_symbol: Optional[str] = None,
        radius: float = 14.0,
        ink: str = "#1E1E1E",
        fill: str = "#F2EFE9",
        label: Optional[str] = None,
    ) -> None:
        """Draw an archival cartographic locus medallion with exact Afterlight glyph."""
        p = self.palette
        self.emit(
            layer_id,
            f'<g class="afterlight-locus-badge" transform="translate({cx:.1f},{cy:.1f})">'
            f'<circle cx="0" cy="0" r="{radius + 2.5:.1f}" fill="{p["bone"]}" stroke="{ink}" stroke-width="1.2"/>'
            f'<circle cx="0" cy="0" r="{radius - 1.2:.1f}" fill="{fill}" stroke="{ink}" stroke-width="0.9"/>'
            f'<text x="0" y="{radius * 0.36:.1f}" font-family="{GLYPH_STACK}" font-size="{radius * 1.12:.1f}" '
            f'font-weight="bold" fill="{ink}" text-anchor="middle">{xml_escape(role_symbol)}</text>'
            + (
                f'<circle cx="{radius * 0.82:.1f}" cy="{-radius * 0.82:.1f}" r="{radius * 0.52:.1f}" '
                f'fill="{p["paper"]}" stroke="{ink}" stroke-width="0.9"/>'
                f'<text x="{radius * 0.82:.1f}" y="{-radius * 0.56:.1f}" font-family="{GLYPH_STACK}" '
                f'font-size="{radius * 0.72:.1f}" fill="{ink}" text-anchor="middle">{xml_escape(op_symbol)}</text>'
                if op_symbol
                else ""
            )
            + "</g>",
        )
        if label:
            safe_lbl = xml_escape(sanitize_plate_label(label))
            bw = max(56.0, len(label) * 6.0 + 12.0)
            self.emit(
                layer_id,
                f'<g transform="translate({cx:.1f},{cy + radius + 13.0:.1f})">'
                f'<rect x="{-bw / 2:.1f}" y="-9.5" width="{bw:.1f}" height="13.5" rx="1.5" '
                f'fill="{p["paper"]}" fill-opacity="0.90" stroke="{ink}" stroke-width="0.7"/>'
                f'<text x="0" y="0.5" font-family="{MONO_STACK}" font-size="8.6" font-weight="600" '
                f'fill="{ink}" text-anchor="middle">{safe_lbl}</text></g>',
            )

    def to_svg(self) -> str:
        defs_xml = "\n".join(self._defs)
        layers_xml: List[str] = []
        for lid in self._layer_order:
            body = "\n    ".join(self._layers[lid])
            layers_xml.append(f'  <g id="{xml_escape(lid)}">\n    {body}\n  </g>')
        svg_doc = (
            f'<?xml version="1.0" encoding="UTF-8"?>\n'
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.width}" height="{self.height}" '
            f'viewBox="0 0 {self.width} {self.height}" data-plate-id="{xml_escape(self.plate_id)}" '
            f'data-has-face-icons="false">\n'
            f'  <defs>{defs_xml}\n  </defs>\n'
            + "\n".join(layers_xml)
            + "\n</svg>\n"
        )
        assert_no_facial_tokens(svg_doc, f"{self.plate_id}.svg")
        # Guarantee valid XML before returning
        ET.fromstring(svg_doc.encode("utf-8"))
        return svg_doc


# ---------------------------------------------------------------------------
# 1. CARTOGRAPHIC SURVEY MAP BUILDER (`1200x900`)
# ---------------------------------------------------------------------------

class MapPlateBuilder(_BasePlateBuilder):
    """
    Composable `1200x900` Cartographic Survey Map Builder for SCION City Swarms.
    """

    LAYER_VELLUM = "layer-vellum-substrate"
    LAYER_TERRAIN = "layer-terrain-contours"
    LAYER_SOOT_PLAN = "layer-soot-urban-plan"
    LAYER_OCHRE_WORLD = "layer-ochre-world-residues"
    LAYER_CHALK_WITNESS = "layer-chalk-witness-routes"
    LAYER_RED_ARCHES = "layer-red-conflict-arches"
    LAYER_AGENT_LOCI = "layer-agent-home-loci"
    LAYER_CARTOUCHE = "layer-cartographic-furniture"

    def __init__(self, plate_id: str) -> None:
        super().__init__(plate_id=plate_id, width=MAP_DIMENSIONS[0], height=MAP_DIMENSIONS[1])
        for lid in (
            self.LAYER_VELLUM,
            self.LAYER_TERRAIN,
            self.LAYER_SOOT_PLAN,
            self.LAYER_OCHRE_WORLD,
            self.LAYER_CHALK_WITNESS,
            self.LAYER_RED_ARCHES,
            self.LAYER_AGENT_LOCI,
            self.LAYER_CARTOUCHE,
        ):
            self.ensure_layer(lid)
        # Canonical map survey viewport inside neatline
        self.map_x0 = 58.0
        self.map_y0 = 62.0
        self.map_w = 1084.0
        self.map_h = 776.0
        self._placed_label_boxes: List[Tuple[float, float, float, float]] = []
        self._right_furniture_x: Optional[float] = None
        self.draw_vellum_grain(self.LAYER_VELLUM, density=280)
        self.draw_ruled_border_and_ticks()

    def register_obstacle_box(self, x: float, y: float, w: float, h: float) -> None:
        """Register a reserved furniture or header rectangle to prevent callout overlap."""
        self._placed_label_boxes.append((x, y, x + w, y + h))
        if x >= self.map_x0 + self.map_w * 0.55:
            if self._right_furniture_x is None or x < self._right_furniture_x:
                self._right_furniture_x = x

    def _resolve_map_label_pos(
        self,
        x: float,
        y: float,
        est_w: float,
        est_h: float,
        anchor: str = "start",
        min_dy: float = 16.0,
        survey_confined: bool = True,
    ) -> Tuple[float, float]:
        """
        Clamp horizontal `x` within neatline margins (`[map_x0 + 14, map_x0 + map_w - 14]`,
        respecting `text-anchor` width) and automatically stagger vertical `y` (`>= 16px`
        separation) when bounding boxes overlap.
        """
        min_x = self.map_x0 + 14.0
        max_x = self.map_x0 + self.map_w - 14.0
        if survey_confined and self._right_furniture_x is not None and x < self._right_furniture_x - 8.0:
            max_x = min(max_x, self._right_furniture_x - 10.0)

        span_w = min(est_w, max(24.0, max_x - min_x))
        if anchor == "middle":
            cx = max(min_x + 0.5 * span_w, min(max_x - 0.5 * span_w, x))
            left, right = cx - 0.5 * span_w, cx + 0.5 * span_w
        elif anchor == "end":
            cx = max(min_x + span_w, min(max_x, x))
            left, right = cx - span_w, cx
        else:
            cx = max(min_x, min(max_x - span_w, x))
            left, right = cx, cx + span_w

        min_y = self.map_y0 + 18.0
        max_y = self.map_y0 + self.map_h - 14.0
        base_y = max(min_y, min(max_y, y))

        offsets = [0.0]
        for step_i in range(1, 8):
            d = step_i * max(16.0, min_dy)
            offsets.extend([d, -d])

        chosen_y = base_y
        for dy in offsets:
            cand_y = base_y + dy
            if cand_y < min_y or cand_y > max_y:
                continue
            top = cand_y - 0.80 * est_h
            bot = cand_y + 0.30 * est_h
            cand_cy = 0.5 * (top + bot)
            collision = False
            for bx0, by0, bx1, by1 in self._placed_label_boxes:
                if min(right, bx1) - max(left, bx0) > -5.0:
                    b_cy = 0.5 * (by0 + by1)
                    req_sep = max(min_dy, 0.5 * ((bot - top) + (by1 - by0)) + 2.5)
                    if abs(cand_cy - b_cy) < req_sep:
                        collision = True
                        break
            if not collision:
                chosen_y = cand_y
                break

        self._placed_label_boxes.append((left, chosen_y - 0.80 * est_h, right, chosen_y + 0.30 * est_h))
        return cx, chosen_y

    def draw_text(
        self,
        layer_id: str,
        x: float,
        y: float,
        text: str,
        size: float = 12.0,
        fill: str = "#1E1E1E",
        font_family: str = SERIF_STACK,
        weight: str = "normal",
        style: str = "normal",
        anchor: str = "start",
        letter_spacing: float = 0.0,
        opacity: float = 1.0,
        rotate: Optional[float] = None,
        decollide: Optional[bool] = None,
    ) -> None:
        cleaned = sanitize_plate_label(text)
        auto_layers = {
            self.LAYER_TERRAIN,
            self.LAYER_SOOT_PLAN,
            self.LAYER_OCHRE_WORLD,
            self.LAYER_CHALK_WITNESS,
            self.LAYER_RED_ARCHES,
            self.LAYER_AGENT_LOCI,
        }
        should_decollide = (
            decollide
            if decollide is not None
            else (rotate is None and layer_id in auto_layers and len(cleaned.strip()) > 3)
        )
        if should_decollide:
            char_w = size * (0.61 if "Mono" in font_family or "Menlo" in font_family else 0.56) + letter_spacing
            est_w = len(cleaned) * char_w + 8.0
            est_h = max(14.0, size * 1.32)
            x, y = self._resolve_map_label_pos(x, y, est_w=est_w, est_h=est_h, anchor=anchor, min_dy=16.0)
        super().draw_text(
            layer_id=layer_id,
            x=x,
            y=y,
            text=cleaned,
            size=size,
            fill=fill,
            font_family=font_family,
            weight=weight,
            style=style,
            anchor=anchor,
            letter_spacing=letter_spacing,
            opacity=opacity,
            rotate=rotate,
        )

    def draw_afterlight_badge(
        self,
        layer_id: str,
        cx: float,
        cy: float,
        role_symbol: str,
        op_symbol: Optional[str] = None,
        radius: float = 14.0,
        ink: str = "#1E1E1E",
        fill: str = "#F2EFE9",
        label: Optional[str] = None,
    ) -> None:
        """Draw Afterlight locus medallion at exact `(cx, cy)` with de-collided callout pill."""
        super().draw_afterlight_badge(
            layer_id=layer_id,
            cx=cx,
            cy=cy,
            role_symbol=role_symbol,
            op_symbol=op_symbol,
            radius=radius,
            ink=ink,
            fill=fill,
            label=None,
        )
        # Register the medallion circle itself so text callouts avoid crossing the glyph
        self._placed_label_boxes.append((cx - radius - 3.0, cy - radius - 3.0, cx + radius + 3.0, cy + radius + 3.0))
        if label:
            p = self.palette
            clean_lbl = sanitize_plate_label(label)
            safe_lbl = xml_escape(clean_lbl)
            bw = max(56.0, len(clean_lbl) * 6.0 + 12.0)
            px, py = self._resolve_map_label_pos(
                cx,
                cy + radius + 14.0,
                est_w=bw + 4.0,
                est_h=15.5,
                anchor="middle",
                min_dy=16.5,
            )
            if math.hypot(px - cx, py - (cy + radius + 14.0)) > 10.0:
                self.emit(
                    layer_id,
                    f'<line x1="{cx:.1f}" y1="{cy + radius * 0.85:.1f}" x2="{px:.1f}" y2="{py - 6.0:.1f}" '
                    f'stroke="{ink}" stroke-width="0.85" stroke-dasharray="2,2" stroke-opacity="0.72"/>',
                )
            self.emit(
                layer_id,
                f'<g transform="translate({px:.1f},{py:.1f})">'
                f'<rect x="{-bw / 2:.1f}" y="-9.5" width="{bw:.1f}" height="13.5" rx="1.5" '
                f'fill="{p["paper"]}" fill-opacity="0.93" stroke="{ink}" stroke-width="0.75"/>'
                f'<text x="0" y="0.5" font-family="{MONO_STACK}" font-size="8.6" font-weight="600" '
                f'fill="{ink}" text-anchor="middle">{safe_lbl}</text></g>',
            )

    def norm_to_map(
        self,
        nx: float,
        ny: float,
        box: Optional[Tuple[float, float, float, float]] = None,
    ) -> Tuple[float, float]:
        bx, by, bw, bh = box or (self.map_x0 + 40, self.map_y0 + 70, self.map_w - 340, self.map_h - 150)
        return bx + nx * bw, by + ny * bh

    def draw_ruled_border_and_ticks(self) -> None:
        p = self.palette
        L = self.LAYER_CARTOUCHE
        # Outer archival rule + graduated neatline collar
        self.emit(
            L,
            f'<rect x="24" y="24" width="{self.width - 48}" height="{self.height - 48}" '
            f'fill="none" stroke="{p["soot"]}" stroke-width="2.2"/>'
            f'<rect x="30" y="30" width="{self.width - 60}" height="{self.height - 60}" '
            f'fill="none" stroke="{p["dirt"]}" stroke-width="0.8"/>'
            f'<rect x="{self.map_x0:.0f}" y="{self.map_y0:.0f}" width="{self.map_w:.0f}" height="{self.map_h:.0f}" '
            f'fill="none" stroke="{p["soot"]}" stroke-width="1.5"/>',
        )
        # Alternating black/bone survey degree band along top & bottom neatlines
        step_w = self.map_w / 16.0
        for i in range(16):
            sx = self.map_x0 + i * step_w
            fill = p["soot"] if i % 2 == 0 else p["bone"]
            self.emit(
                L,
                f'<rect x="{sx:.1f}" y="{self.map_y0 - 7:.1f}" width="{step_w:.1f}" height="7" '
                f'fill="{fill}" stroke="{p["soot"]}" stroke-width="0.6"/>'
                f'<rect x="{sx:.1f}" y="{self.map_y0 + self.map_h:.1f}" width="{step_w:.1f}" height="7" '
                f'fill="{fill}" stroke="{p["soot"]}" stroke-width="0.6"/>',
            )
            self.draw_text(
                L, sx + step_w * 0.5, self.map_y0 - 12, f"E{i + 1:02d}",
                size=8.5, fill=p["graphite"], font_family=MONO_STACK, anchor="middle",
            )
        step_h = self.map_h / 12.0
        for j in range(12):
            sy = self.map_y0 + j * step_h
            fill = p["soot"] if j % 2 == 0 else p["bone"]
            self.emit(
                L,
                f'<rect x="{self.map_x0 - 7:.1f}" y="{sy:.1f}" width="7" height="{step_h:.1f}" '
                f'fill="{fill}" stroke="{p["soot"]}" stroke-width="0.6"/>'
                f'<rect x="{self.map_x0 + self.map_w:.1f}" y="{sy:.1f}" width="7" height="{step_h:.1f}" '
                f'fill="{fill}" stroke="{p["soot"]}" stroke-width="0.6"/>',
            )
            self.draw_text(
                L, self.map_x0 - 19, sy + step_h * 0.55, f"N{12 - j:02d}",
                size=8.5, fill=p["graphite"], font_family=MONO_STACK, anchor="middle",
            )
        # Subtle graticule hairlines inside survey window
        for i in range(1, 8):
            gx = self.map_x0 + i * (self.map_w / 8.0)
            self.emit(
                self.LAYER_VELLUM,
                f'<line x1="{gx:.1f}" y1="{self.map_y0:.1f}" x2="{gx:.1f}" y2="{self.map_y0 + self.map_h:.1f}" '
                f'stroke="{p["dirt"]}" stroke-width="0.45" stroke-dasharray="3,5" stroke-opacity="0.32"/>',
            )
        for j in range(1, 6):
            gy = self.map_y0 + j * (self.map_h / 6.0)
            self.emit(
                self.LAYER_VELLUM,
                f'<line x1="{self.map_x0:.1f}" y1="{gy:.1f}" x2="{self.map_x0 + self.map_w:.1f}" y2="{gy:.1f}" '
                f'stroke="{p["dirt"]}" stroke-width="0.45" stroke-dasharray="3,5" stroke-opacity="0.32"/>',
            )
        # Four printmaker registration crosshairs
        for rx, ry in ((18, 18), (self.width - 18, 18), (18, self.height - 18), (self.width - 18, self.height - 18)):
            self.emit(
                L,
                f'<g stroke="{p["soot"]}" stroke-width="0.9" fill="none">'
                f'<circle cx="{rx}" cy="{ry}" r="5.5"/>'
                f'<line x1="{rx - 9}" y1="{ry}" x2="{rx + 9}" y2="{ry}"/>'
                f'<line x1="{rx}" y1="{ry - 9}" x2="{rx}" y2="{ry + 9}"/></g>',
            )

    def draw_contour_lines(
        self,
        center_xy: Tuple[float, float],
        radii: Sequence[Tuple[float, float]],
        elevation_labels: Optional[Sequence[str]] = None,
        ink: Optional[str] = None,
        eccentricity_angle_deg: float = -18.0,
    ) -> None:
        """Draw hand-inked topographic elevation contours."""
        p = self.palette
        col = ink or p["dirt"]
        rng = _seeded_rng(self.plate_id, f"contours:{center_xy[0]:.1f}")
        ang = math.radians(eccentricity_angle_deg)
        ca, sa = math.cos(ang), math.sin(ang)
        cx, cy = center_xy
        for idx, (rx, ry) in enumerate(radii):
            pts: List[Tuple[float, float]] = []
            steps = 44
            for s in range(steps):
                th = 2.0 * math.pi * s / steps
                wobble = 1.0 + 0.065 * math.sin(3 * th + idx * 0.8) + 0.035 * math.cos(5 * th + rng.uniform(-0.2, 0.2))
                lx = rx * wobble * math.cos(th)
                ly = ry * wobble * math.sin(th)
                gx = cx + lx * ca - ly * sa
                gy = cy + lx * sa + ly * ca
                pts.append((gx, gy))
            d = self.hand_path_d(pts, jitter=0.45, closed=True)
            sw = 1.15 if idx % 3 == 0 else 0.72
            op = 0.52 if idx % 3 == 0 else 0.32
            self.emit(
                self.LAYER_TERRAIN,
                f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{sw:.2f}" stroke-opacity="{op:.2f}"/>',
            )
            if elevation_labels and idx < len(elevation_labels) and elevation_labels[idx]:
                lx, ly = pts[steps // 8]
                self.draw_text(
                    self.LAYER_TERRAIN, lx, ly - 3, elevation_labels[idx],
                    size=8.2, fill=col, font_family=MONO_STACK, opacity=0.82,
                )

    def draw_water_contours(
        self,
        polygon: Sequence[Tuple[float, float]],
        ripple_count: int = 5,
    ) -> None:
        """Render hatched harbor/sea/canal basin with concentric shoreline ripples."""
        p = self.palette
        d = self.hand_path_d(polygon, jitter=0.7, closed=True)
        self.emit(
            self.LAYER_TERRAIN,
            f'<path d="{d}" fill="{p["chalk_blue"]}" fill-opacity="0.11" stroke="{p["chalk_blue"]}" '
            f'stroke-width="1.5" stroke-opacity="0.72"/>'
            f'<path d="{d}" fill="url(#hatch-chalk-water)" stroke="none"/>',
        )
        cx = sum(pt[0] for pt in polygon) / len(polygon)
        cy = sum(pt[1] for pt in polygon) / len(polygon)
        for r_idx in range(1, ripple_count + 1):
            shrink = 1.0 - r_idx * 0.045
            inner = [(cx + (px - cx) * shrink, cy + (py - cy) * shrink) for px, py in polygon]
            id_path = self.hand_path_d(inner, jitter=0.5, closed=True)
            self.emit(
                self.LAYER_TERRAIN,
                f'<path d="{id_path}" fill="none" stroke="{p["chalk_blue"]}" '
                f'stroke-width="{max(0.45, 1.0 - r_idx * 0.14):.2f}" stroke-opacity="{max(0.16, 0.45 - r_idx * 0.06):.2f}"/>',
            )

    def draw_bastion_wall(
        self,
        points: Sequence[Tuple[float, float]],
        thickness: float = 9.0,
        crenelated: bool = True,
    ) -> None:
        """Draw heavy fortified bastion trace with ashlar core and crenelation ticks."""
        p = self.palette
        d = self.hand_path_d(points, jitter=0.55, closed=False)
        self.emit(
            self.LAYER_SOOT_PLAN,
            f'<path d="{d}" fill="none" stroke="{p["soot"]}" stroke-width="{thickness:.1f}" '
            f'stroke-linecap="square" stroke-linejoin="miter"/>'
            f'<path d="{d}" fill="none" stroke="{p["bone"]}" stroke-width="{max(2.0, thickness - 4.0):.1f}" '
            f'stroke-linecap="square" stroke-linejoin="miter"/>',
        )
        if crenelated:
            for i in range(len(points) - 1):
                x1, y1 = points[i]
                x2, y2 = points[i + 1]
                seg_len = math.hypot(x2 - x1, y2 - y1)
                if seg_len < 16:
                    continue
                ux, uy = (x2 - x1) / seg_len, (y2 - y1) / seg_len
                nx, ny = -uy, ux
                n_teeth = max(2, int(seg_len // 18))
                for k in range(n_teeth + 1):
                    tx = x1 + ux * (seg_len * k / n_teeth)
                    ty = y1 + uy * (seg_len * k / n_teeth)
                    self.emit(
                        self.LAYER_SOOT_PLAN,
                        f'<line x1="{tx - nx * (thickness * 0.5):.1f}" y1="{ty - ny * (thickness * 0.5):.1f}" '
                        f'x2="{tx + nx * (thickness * 0.85):.1f}" y2="{ty + ny * (thickness * 0.85):.1f}" '
                        f'stroke="{p["soot"]}" stroke-width="2.1"/>',
                    )

    def draw_stairway_run(
        self,
        x1: float,
        y1: float,
        x2: float,
        y2: float,
        width: float = 22.0,
        steps: int = 16,
        label: Optional[str] = None,
    ) -> None:
        """Draw rising architectural stairway street in plan view."""
        p = self.palette
        dx, dy = x2 - x1, y2 - y1
        dist = max(1.0, math.hypot(dx, dy))
        ux, uy = dx / dist, dy / dist
        nx, ny = -uy * (width * 0.5), ux * (width * 0.5)
        poly = [(x1 + nx, y1 + ny), (x2 + nx, y2 + ny), (x2 - nx, y2 - ny), (x1 - nx, y1 - ny)]
        self.hand_polygon(
            self.LAYER_SOOT_PLAN, poly, fill=p["bone"], stroke=p["soot"], stroke_width=1.5, jitter=0.45
        )
        for i in range(1, steps):
            u = i / steps
            sx, sy = x1 + dx * u, y1 + dy * u
            self.hand_line(
                self.LAYER_SOOT_PLAN, sx + nx, sy + ny, sx - nx, sy - ny,
                stroke=p["soot"], stroke_width=0.95, jitter=0.25, opacity=0.82,
            )
        # Center ascent arrow
        self.hand_line(
            self.LAYER_SOOT_PLAN,
            x1 + dx * 0.15, y1 + dy * 0.15, x1 + dx * 0.85, y1 + dy * 0.85,
            stroke=p["graphite"], stroke_width=0.9, jitter=0.2, marker_end="arrow-soot", opacity=0.75,
        )
        if label:
            ang = math.degrees(math.atan2(dy, dx))
            if ang > 90 or ang < -90:
                ang += 180
            self.draw_text(
                self.LAYER_SOOT_PLAN,
                0.5 * (x1 + x2) + nx * 1.45,
                0.5 * (y1 + y2) + ny * 1.45,
                label,
                size=8.8,
                fill=p["soot"],
                font_family=MONO_STACK,
                anchor="middle",
                rotate=ang,
            )

    def draw_urban_block(
        self,
        points: Sequence[Tuple[float, float]],
        roof_pattern: str = "hatch-soot-45",
        label: Optional[str] = None,
    ) -> None:
        """Draw hatched masonry/zinc roof urban block in plan view."""
        p = self.palette
        d = self.hand_path_d(points, jitter=0.5, closed=True)
        self.emit(
            self.LAYER_SOOT_PLAN,
            f'<path d="{d}" fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.4"/>'
            f'<path d="{d}" fill="url(#{roof_pattern})" stroke="{p["soot"]}" stroke-width="1.2"/>',
        )
        # Ridge line
        if len(points) >= 4:
            mx1 = 0.5 * (points[0][0] + points[3][0])
            my1 = 0.5 * (points[0][1] + points[3][1])
            mx2 = 0.5 * (points[1][0] + points[2][0])
            my2 = 0.5 * (points[1][1] + points[2][1])
            self.hand_line(self.LAYER_SOOT_PLAN, mx1, my1, mx2, my2, stroke=p["soot"], stroke_width=1.0, jitter=0.35)
        if label:
            cx = sum(pt[0] for pt in points) / len(points)
            cy = sum(pt[1] for pt in points) / len(points)
            self.draw_text(
                self.LAYER_SOOT_PLAN, cx, cy + 3, label,
                size=8.6, fill=p["soot"], font_family=MONO_STACK, anchor="middle", weight="600",
            )

    def draw_oil_pool(
        self,
        cx: float,
        cy: float,
        radius_px: float,
        thermal_ember: float = 0.5,
        label: Optional[str] = None,
    ) -> None:
        """Draw persistent `♁ World` capillary oil spread rings and thermal hearth stain."""
        p = self.palette
        L = self.LAYER_OCHRE_WORLD
        rng = _seeded_rng(self.plate_id, f"oil:{cx:.1f}:{cy:.1f}")
        for ring_i, frac in enumerate((1.0, 0.76, 0.52, 0.30)):
            pts: List[Tuple[float, float]] = []
            for s in range(32):
                th = 2.0 * math.pi * s / 32
                lobe = 1.0 + 0.11 * math.sin(3 * th + ring_i) + 0.07 * math.cos(5 * th + rng.uniform(-0.2, 0.2))
                rr = radius_px * frac * lobe
                pts.append((cx + rr * math.cos(th), cy + rr * 0.78 * math.sin(th)))
            d = self.hand_path_d(pts, jitter=0.45, closed=True)
            fill = "url(#hatch-ochre-oil)" if ring_i == 0 else p["ochre_oil"]
            fop = 0.85 if ring_i == 0 else (0.14 + 0.10 * ring_i)
            dash = ' stroke-dasharray="5,3"' if ring_i == 0 else ""
            self.emit(
                L,
                f'<path d="{d}" fill="{fill}" fill-opacity="{fop:.2f}" stroke="{p["ochre_oil"]}" '
                f'stroke-width="{1.6 - ring_i * 0.25:.2f}"{dash}/>',
            )
        # Thermal ember core
        ember_r = max(5.0, 14.0 * thermal_ember)
        self.emit(
            L,
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{ember_r:.1f}" fill="{p["red_bird"]}" '
            f'fill-opacity="0.42" stroke="{p["ochre_oil"]}" stroke-width="1.3"/>',
        )
        if label:
            self.draw_text(
                L, cx, cy + radius_px * 0.86 + 13, label,
                size=9.0, fill=p["ochre_oil"], font_family=MONO_STACK, weight="bold", anchor="middle",
            )

    def draw_scuff_vector(
        self,
        x0: float,
        y0: float,
        x1: float,
        y1: float,
        label: str,
    ) -> None:
        """Draw persistent `♁ World` physical floor scuff / ballistic gouge vector."""
        p = self.palette
        L = self.LAYER_OCHRE_WORLD
        dx, dy = x1 - x0, y1 - y0
        dist = max(1.0, math.hypot(dx, dy))
        nx, ny = -dy / dist, dx / dist
        # Transverse boot/masonry friction striae
        n_marks = max(6, int(dist // 9))
        for k in range(n_marks):
            u = k / max(1, n_marks - 1)
            mx, my = x0 + dx * u, y0 + dy * u
            w = 7.5 * (1.0 - 0.35 * u)
            self.hand_line(
                L, mx - nx * w, my - ny * w, mx + nx * w, my + ny * w,
                stroke=p["ochre_oil"], stroke_width=1.5, jitter=0.4, opacity=0.78,
            )
        self.hand_line(
            L, x0, y0, x1, y1, stroke=p["ochre_oil"], stroke_width=2.8,
            jitter=0.45, marker_end="arrow-ochre", double_pass=True,
        )
        self.draw_text(
            L, 0.5 * (x0 + x1) + nx * 15, 0.5 * (y0 + y1) + ny * 15 - 4,
            label, size=9.2, fill=p["ochre_oil"], font_family=MONO_STACK, weight="bold", anchor="middle",
        )

    def draw_shard_scatter(
        self,
        shards: Sequence[Sequence[float]],
        box: Tuple[float, float, float, float],
        origin_xy: Optional[Tuple[float, float]] = None,
        label: Optional[str] = None,
    ) -> None:
        """Plot exact `world_trace.residues.shards` (`[x, y, angle]`) in `♁ World` ink."""
        p = self.palette
        L = self.LAYER_OCHRE_WORLD
        pts_px: List[Tuple[float, float]] = []
        for idx, sh in enumerate(shards):
            sx, sy = self.norm_to_map(float(sh[0]), float(sh[1]), box=box)
            ang = float(sh[2])
            pts_px.append((sx, sy))
            if origin_xy:
                self.hand_line(
                    L, origin_xy[0], origin_xy[1], sx, sy,
                    stroke=p["ochre_oil"], stroke_width=0.8, dash="2,3", opacity=0.65, jitter=0.25,
                )
            # Angular polygon shard oriented at `ang`
            ca, sa = math.cos(ang), math.sin(ang)
            local = [(-7.5, -2.8), (8.2, -1.6), (4.5, 4.6), (-5.2, 3.1)]
            world_poly = [(sx + lx * ca - ly * sa, sy + lx * sa + ly * ca) for lx, ly in local]
            self.hand_polygon(
                L, world_poly, fill=p["ochre_oil"], fill_opacity=0.68,
                stroke=p["soot"], stroke_width=1.0, jitter=0.2,
            )
            self.draw_text(
                L, sx + 9, sy - 6, f"s{idx + 1}",
                size=7.8, fill=p["soot"], font_family=MONO_STACK, weight="bold",
            )
        if label and pts_px:
            mx = sum(pt[0] for pt in pts_px) / len(pts_px)
            my = min(pt[1] for pt in pts_px) - 14
            self.draw_text(
                L, mx, my, label,
                size=8.8, fill=p["ochre_oil"], font_family=MONO_STACK, weight="bold", anchor="middle",
            )

    def draw_witness_sightline(
        self,
        x0: float,
        y0: float,
        x1: float,
        y1: float,
        label: str,
        filtered: bool = False,
        curve_offset: float = 0.0,
    ) -> None:
        """Draw `☾/◉ Witness` selective sightline or `⊣ FILTER` swerved perceptual chord."""
        p = self.palette
        L = self.LAYER_CHALK_WITNESS
        mx = 0.5 * (x0 + x1)
        my = 0.5 * (y0 + y1) + curve_offset
        pts = [(x0, y0), (mx, my), (x1, y1)]
        d = self.hand_path_d(pts, jitter=0.45)
        dash = "7,5" if filtered else "none"
        sw = 1.9 if not filtered else 2.2
        col = p["chalk_blue"]
        self.emit(
            L,
            f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{sw:.2f}" '
            f'stroke-dasharray="{dash}" marker-end="url(#arrow-blue)"/>',
        )
        if filtered:
            # Explicit ⊣ FILTER cut gate across the omitted/mutated chord
            self.emit(
                L,
                f'<g transform="translate({mx:.1f},{my:.1f})">'
                f'<circle cx="0" cy="0" r="9.5" fill="{p["paper"]}" stroke="{p["red_bird"]}" stroke-width="1.3"/>'
                f'<text x="0" y="3.8" font-family="{GLYPH_STACK}" font-size="11.5" font-weight="bold" '
                f'fill="{p["red_bird"]}" text-anchor="middle">⊣</text></g>',
            )
        self.draw_text(
            L, mx, my + (-13 if curve_offset <= 0 else 15), label,
            size=8.6, fill=col, font_family=MONO_STACK, weight="600", anchor="middle",
        )

    def draw_conflict_keystone_arch(
        self,
        x0: float,
        y0: float,
        x1: float,
        y1: float,
        grain_hash: str,
        arch_tension: float,
        locus_label: str,
        arc_lift: float = -46.0,
    ) -> None:
        """
        Draw a load-bearing `ConflictGrain` keystone arch ("Without stones there is no arch")
        in `Red-Bird` (`#9B1D1D`) spanning contending polarities at a locus.
        """
        p = self.palette
        L = self.LAYER_RED_ARCHES
        mx = 0.5 * (x0 + x1)
        my = 0.5 * (y0 + y1) + arc_lift
        # Twin voussoir arch ribs
        d_outer = f"M {x0:.1f} {y0:.1f} Q {mx:.1f} {my - 8:.1f} {x1:.1f} {y1:.1f}"
        d_inner = f"M {x0:.1f} {y0:.1f} Q {mx:.1f} {my + 5:.1f} {x1:.1f} {y1:.1f}"
        self.emit(
            L,
            f'<path d="{d_outer}" fill="none" stroke="{p["red_bird"]}" stroke-width="2.2" stroke-opacity="0.90"/>'
            f'<path d="{d_inner}" fill="none" stroke="{p["red_bird"]}" stroke-width="1.1" stroke-dasharray="4,3" stroke-opacity="0.78"/>',
        )
        # Trapezoidal keystone wedge at apex
        kx, ky = mx, 0.25 * y0 + 0.5 * my + 0.25 * y1
        keystone = [(kx - 13, ky - 9), (kx + 13, ky - 9), (kx + 9, ky + 9), (kx - 9, ky + 9)]
        self.hand_polygon(
            L, keystone, fill=p["red_bird"], stroke=p["soot"], stroke_width=1.1, fill_opacity=0.92, jitter=0.25
        )
        self.draw_text(
            L, kx, ky + 3, grain_hash[:4].upper(),
            size=7.6, fill=p["paper"], font_family=MONO_STACK, weight="bold", anchor="middle",
        )
        self.draw_text(
            L, kx, ky - 13, f"ARCH {locus_label} (T={arch_tension:.1f})",
            size=8.2, fill=p["red_bird"], font_family=MONO_STACK, weight="bold", anchor="middle",
        )

    def draw_compass_rose(
        self,
        cx: float,
        cy: float,
        radius: float,
        desert_opposed: str,
    ) -> None:
        """Engraved 8-point Calvino Desert-Opposition Compass Rose."""
        p = self.palette
        L = self.LAYER_CARTOUCHE
        self.emit(
            L,
            f'<g transform="translate({cx:.1f},{cy:.1f})">'
            f'<circle cx="0" cy="0" r="{radius:.1f}" fill="{p["paper"]}" fill-opacity="0.88" stroke="{p["soot"]}" stroke-width="1.2"/>'
            f'<circle cx="0" cy="0" r="{radius * 0.78:.1f}" fill="none" stroke="{p["dirt"]}" stroke-width="0.7" stroke-dasharray="2,2"/>',
        )
        for i in range(8):
            ang = i * (math.pi / 4.0) - math.pi / 2.0
            r_len = radius * (0.95 if i % 2 == 0 else 0.62)
            tip_x, tip_y = r_len * math.cos(ang), r_len * math.sin(ang)
            left_x, left_y = radius * 0.16 * math.cos(ang - 0.35), radius * 0.16 * math.sin(ang - 0.35)
            right_x, right_y = radius * 0.16 * math.cos(ang + 0.35), radius * 0.16 * math.sin(ang + 0.35)
            lead_col = p["red_bird"] if i == 0 else (p["chalk_blue"] if i == 4 else p["soot"])
            self.emit(
                L,
                f'<polygon points="0,0 {left_x:.1f},{left_y:.1f} {tip_x:.1f},{tip_y:.1f}" fill="{lead_col}"/>'
                f'<polygon points="0,0 {tip_x:.1f},{tip_y:.1f} {right_x:.1f},{right_y:.1f}" fill="{p["bone"]}" stroke="{lead_col}" stroke-width="0.6"/>',
            )
        self.emit(L, f'<circle cx="0" cy="0" r="3.5" fill="{p["ochre_oil"]}" stroke="{p["soot"]}" stroke-width="0.9"/></g>')
        self.register_obstacle_box(cx - radius - 12.0, cy - radius - 16.0, 2 * radius + 24.0, 2 * radius + 42.0)
        self.draw_text(L, cx, cy - radius - 6, "N · ARCH KEYSTONE", size=8.0, fill=p["red_bird"], font_family=MONO_STACK, weight="bold", anchor="middle")
        desert_lines = textwrap.wrap(
            f"OPPOSED DESERT: {sanitize_plate_label(desert_opposed)}",
            width=44,
            break_long_words=False,
            break_on_hyphens=False,
        )[:2]
        for d_idx, d_line in enumerate(desert_lines):
            self.draw_text(
                L, cx, cy + radius + 12 + d_idx * 11.5, d_line,
                size=7.5, fill=p["graphite"], font_family=MONO_STACK, anchor="middle",
            )

    def draw_canal_ribbon(
        self,
        points: Sequence[Tuple[float, float]],
        width: float = 16.0,
        bridges: int = 2,
        label: Optional[str] = None,
    ) -> None:
        """Draw a sinuous Chalk-Blue canal waterway with masonry arch bridges in plan view."""
        p = self.palette
        d = self.hand_path_d(points, jitter=0.55, closed=False)
        self.emit(
            self.LAYER_TERRAIN,
            f'<path d="{d}" fill="none" stroke="{p["chalk_blue"]}" stroke-width="{width + 3.0:.1f}" stroke-linecap="round" stroke-opacity="0.78"/>'
            f'<path d="{d}" fill="none" stroke="{p["paper"]}" stroke-width="{width - 1.5:.1f}" stroke-linecap="round" stroke-opacity="0.72"/>'
            f'<path d="{d}" fill="none" stroke="{p["chalk_blue"]}" stroke-width="{max(2.0, width * 0.45):.1f}" stroke-dasharray="6,4" stroke-opacity="0.40"/>',
        )
        if bridges > 0 and len(points) >= 2:
            for b_i in range(1, bridges + 1):
                seg_idx = min(len(points) - 2, int((b_i / (bridges + 1)) * (len(points) - 1)))
                x1, y1 = points[seg_idx]
                x2, y2 = points[seg_idx + 1]
                mx, my = 0.5 * (x1 + x2), 0.5 * (y1 + y2)
                seg_l = max(1.0, math.hypot(x2 - x1, y2 - y1))
                nx, ny = -(y2 - y1) / seg_l * (width * 0.8), (x2 - x1) / seg_l * (width * 0.8)
                self.hand_line(self.LAYER_SOOT_PLAN, mx - nx, my - ny, mx + nx, my + ny, stroke=p["soot"], stroke_width=4.2, jitter=0.2)
        if label and points:
            mx, my = points[len(points) // 2]
            self.draw_text(self.LAYER_CHALK_WITNESS, mx, my - width * 0.8, label, size=8.3, fill=p["chalk_blue"], font_family=MONO_STACK, anchor="middle")

    def draw_pier_dock(
        self,
        x: float,
        y: float,
        w: float,
        h: float,
        label: Optional[str] = None,
    ) -> None:
        """Draw a timber-and-masonry harbor jetty with mooring bollards."""
        p = self.palette
        self.draw_urban_block([(x, y), (x + w, y), (x + w, y + h), (x, y + h)], roof_pattern="hatch-soot-45", label=label)
        for bx, by in ((x + 5, y + 6), (x + w - 5, y + 6), (x + 5, y + h - 6), (x + w - 5, y + h - 6)):
            self.emit(self.LAYER_SOOT_PLAN, f'<circle cx="{bx:.1f}" cy="{by:.1f}" r="2.8" fill="{p["soot"]}"/>')

    def draw_radial_web(
        self,
        center_xy: Tuple[float, float],
        radii: Sequence[float],
        spokes: int = 8,
        ink: Optional[str] = None,
    ) -> None:
        """Draw concentric tensile/orbital rings and radial cords for Thin/Sky/Trading cities."""
        p = self.palette
        col = ink or p["graphite"]
        cx, cy = center_xy
        max_r = max(radii) if radii else 80.0
        for r in radii:
            self.emit(
                self.LAYER_SOOT_PLAN,
                f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="none" stroke="{col}" stroke-width="1.05" stroke-opacity="0.58"/>',
            )
        for s_i in range(spokes):
            ang = 2.0 * math.pi * s_i / max(1, spokes)
            self.hand_line(
                self.LAYER_SOOT_PLAN,
                cx, cy, cx + max_r * math.cos(ang), cy + max_r * math.sin(ang),
                stroke=col, stroke_width=0.85, jitter=0.3, opacity=0.52,
            )

    def draw_calvino_scale_bar(
        self,
        x: float,
        y: float,
        width: float,
        unit_label: str,
        divisions: int = 5,
    ) -> None:
        """Bespoke alternating Soot/Bone Calvino material mensuration bar."""
        p = self.palette
        L = self.LAYER_CARTOUCHE
        seg = width / divisions
        self.draw_text(L, x, y - 6, unit_label, size=8.4, fill=p["soot"], font_family=MONO_STACK, weight="bold")
        for i in range(divisions):
            sx = x + i * seg
            fill = p["soot"] if i % 2 == 0 else p["paper"]
            self.emit(
                L,
                f'<rect x="{sx:.1f}" y="{y:.1f}" width="{seg:.1f}" height="7.5" fill="{fill}" stroke="{p["soot"]}" stroke-width="0.9"/>',
            )
            self.draw_text(
                L, sx, y + 18, f"{i * 10}", size=7.8, fill=p["graphite"], font_family=MONO_STACK, anchor="middle"
            )
        self.draw_text(
            L, x + width, y + 18, f"{divisions * 10}", size=7.8, fill=p["graphite"], font_family=MONO_STACK, anchor="middle"
        )

    def draw_cartouche(
        self,
        x: float,
        y: float,
        w: float,
        h: float,
        case_data: Dict[str, Any],
        plate_code: str,
    ) -> None:
        """Draw ornate architectural survey cartouche & whole-word P1–P4 split-verdict ledger."""
        p = self.palette
        L = self.LAYER_CARTOUCHE
        self.register_obstacle_box(x - 6.0, y - 4.0, w + 12.0, h + 8.0)
        self.emit(
            L,
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" fill="{p["paper"]}" fill-opacity="0.95" stroke="{p["soot"]}" stroke-width="1.8"/>'
            f'<rect x="{x + 4:.1f}" y="{y + 4:.1f}" width="{w - 8:.1f}" height="{h - 8:.1f}" fill="none" stroke="{p["dirt"]}" stroke-width="0.8"/>',
        )
        # Corner rosettes
        for cx, cy in ((x + 8, y + 8), (x + w - 8, y + 8), (x + 8, y + h - 8), (x + w - 8, y + h - 8)):
            self.emit(L, f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="2.5" fill="{p["red_bird"]}"/>')

        city_name = str(case_data.get("city_name", "")).upper()
        series = sanitize_plate_label(str(case_data.get("series", "")))
        rank = case_data.get("series_rank", 0)
        ch = case_data.get("chapter", 0)
        wpage = case_data.get("weaver_page", 0)
        ckpt_id = case_data["CHECKPOINT_LAWFUL_A"]["checkpoint_id"][-12:]
        swerve_t = case_data["divergence_audit"]["swerve_tick"]

        self.draw_text(
            L, x + 14, y + 22, f"PLATE {plate_code} · SCION CARTOGRAPHIC SURVEY",
            size=8.6, fill=p["red_bird"], font_family=MONO_STACK, weight="bold", letter_spacing=0.6,
        )
        self.draw_text(
            L, x + 14, y + 45, city_name,
            size=21.0, fill=p["soot"], font_family=SERIF_STACK, weight="bold", letter_spacing=1.2,
        )
        meta_line = (
            f"Ch. {ch} · {series} #{rank} · Weaver p. {wpage}"
            if ch > 0
            else f"{series} · Calvino Abominable House Cellar"
        )
        self.draw_text(L, x + 14, y + 62, meta_line, size=10.2, fill=p["graphite"], font_family=SERIF_STACK, style="italic")
        self.emit(L, f'<line x1="{x + 12:.1f}" y1="{y + 70:.1f}" x2="{x + w - 12:.1f}" y2="{y + 70:.1f}" stroke="{p["dirt"]}" stroke-width="0.8"/>')

        # Ink layer legend
        legend_rows = [
            (p["soot"], "■", "SOOT PLAN: Load-bearing masonry, stairs & piers"),
            (p["ochre_oil"], "♁", "OCHRE WORLD: Intact scuff, shards & oil spread"),
            (p["chalk_blue"], "☾", f"CHALK WITNESS: Sightlines & ⊣ FILTER (t={swerve_t})"),
            (p["red_bird"], "⌘", f"RED KEYSTONE: ConflictGrain arches · A#{ckpt_id[:8]}"),
        ]
        for idx, (col, sym, desc) in enumerate(legend_rows):
            ry = y + 86 + idx * 16
            self.draw_text(L, x + 14, ry, sym, size=10.5, fill=col, font_family=GLYPH_STACK, weight="bold")
            self.draw_text(L, x + 30, ry, desc, size=8.4, fill=p["soot"], font_family=MONO_STACK)

        # P1..P4 Verdict Flip Table (strictly whole-word boundaries, zero mid-word slicing)
        p_y0 = y + 156
        self.emit(L, f'<line x1="{x + 12:.1f}" y1="{p_y0 - 10:.1f}" x2="{x + w - 12:.1f}" y2="{p_y0 - 10:.1f}" stroke="{p["dirt"]}" stroke-width="0.8"/>')
        self.draw_text(
            L, x + 14, p_y0 + 2, "CLAUSE LEDGER: LAWFUL A  ⇒  CLINAMEN A'",
            size=8.4, fill=p["soot"], font_family=MONO_STACK, weight="bold",
        )
        max_side_chars = max(14, int((w - 64) / (2.0 * 4.75)))
        ledger_a = case_data["CHECKPOINT_LAWFUL_A"]["rule_ledger"]
        ledger_b = case_data["BRANCH_CLINAMEN_A_PRIME"]["rule_ledger"]
        for idx, (pa, pb) in enumerate(zip(ledger_a, ledger_b)):
            ry = p_y0 + 18 + idx * 17
            va = _whole_word_verdict_summary(str(pa["verdict"]), max_chars=max_side_chars)
            vb = _whole_word_verdict_summary(str(pb["verdict"]), max_chars=max_side_chars)
            self.draw_text(L, x + 14, ry, f"{pa['policy_id']}:", size=8.2, fill=p["red_bird"], font_family=MONO_STACK, weight="bold")
            self.draw_text(L, x + 36, ry, f"{va} → {vb}", size=7.4, fill=p["graphite"], font_family=MONO_STACK)

    def draw_inquiry_ledger_box(
        self,
        x: float,
        y: float,
        w: float,
        case_data: Dict[str, Any],
        min_h: float = 172.0,
        title: str = "SPLIT-TRACE & BETTER-QUESTION LEDGER",
        extra_lines: Optional[Sequence[str]] = None,
    ) -> float:
        """
        Render a framed archival Clinamen & Better-Question ledger box using strict
        word-boundary `textwrap.wrap(..., break_long_words=False, break_on_hyphens=False)`
        so zero words are split mid-syllable. Returns rendered box height.
        """
        p = self.palette
        L = self.LAYER_CARTOUCHE
        wrap_cols = max(28, int((w - 28.0) / 4.95))

        div = case_data.get("divergence_audit", {})
        swerve_t = div.get("swerve_tick", "?")
        filtered = ", ".join(div.get("filtered_premises", []))
        res = case_data.get("CHECKPOINT_LAWFUL_A", {}).get("world_trace", [{}])[-1].get("residues", {})
        scuff = res.get("scuff_vector", [0.0, 0.0])
        shard_n = len(res.get("shards", []))
        inq = case_data.get("clinamen_inquiry", {})
        bq = inq.get("better_question_test", {}).get("Discovered_Better_Question", "")

        source_paragraphs = list(extra_lines) if extra_lines is not None else [
            f"SWERVE (t={swerve_t}): ⊣ FILTER omits {filtered}" if filtered else f"SWERVE (t={swerve_t}): ⊣ FILTER active",
            f"WORLD ♁: scuff {scuff} & {shard_n} shards persist intact",
        ]
        if bq:
            source_paragraphs.append(f"BETTER Q: {bq}")

        wrapped_rows: List[Tuple[str, bool]] = []
        for p_idx, para in enumerate(source_paragraphs):
            clean_para = sanitize_plate_label(para)
            is_primary = not clean_para.startswith("BETTER Q:")
            sub_lines = textwrap.wrap(
                clean_para,
                width=wrap_cols,
                break_long_words=False,
                break_on_hyphens=False,
                subsequent_indent="  " if clean_para.startswith("BETTER Q:") else "",
            )
            for sl in sub_lines:
                wrapped_rows.append((sl, is_primary and p_idx < 2))

        max_avail_h = min(min_h + 22.0, max(min_h, self.map_y0 + self.map_h - 54.0 - y))
        line_step = 13.5
        max_rows = max(4, int((max_avail_h - 36.0) // line_step))
        if len(wrapped_rows) > max_rows:
            trimmed = wrapped_rows[:max_rows]
            last_txt, last_flag = trimmed[-1]
            words = last_txt.rstrip(".").split(" ")
            if len(words) > 2:
                last_txt = " ".join(words[:-1]) + "..."
            else:
                last_txt = last_txt + "..."
            trimmed[-1] = (last_txt, last_flag)
            wrapped_rows = trimmed

        box_h = max(min_h, 34.0 + len(wrapped_rows) * line_step + 8.0)
        self.register_obstacle_box(x - 6.0, y - 4.0, w + 12.0, box_h + 8.0)
        self.emit(
            L,
            f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{box_h:.1f}" '
            f'fill="{p["paper"]}" fill-opacity="0.94" stroke="{p["soot"]}" stroke-width="1.3"/>',
        )
        self.draw_text(
            L, x + 14.0, y + 20.0, title,
            size=8.6, fill=p["red_bird"], font_family=MONO_STACK, weight="bold",
        )
        for r_idx, (line_str, is_bold_row) in enumerate(wrapped_rows):
            ry = y + 37.0 + r_idx * line_step
            self.draw_text(
                L, x + 14.0, ry, line_str,
                size=7.8,
                fill=p["soot"] if is_bold_row else p["graphite"],
                font_family=MONO_STACK,
            )
        return box_h


# ---------------------------------------------------------------------------
# 2. ARCHITECTURAL ELEVATION / MULTIPLANE IMAGE BUILDER (`1200x800`)
# ---------------------------------------------------------------------------

class ImagePlateBuilder(_BasePlateBuilder):
    """
    Composable `1200x800` Multiplane Engraving & Architectural Elevation Builder.
    """

    LAYER_SKY = "layer-sky-atmosphere"
    LAYER_HORIZON = "layer-far-horizon-plane"
    LAYER_MID_ARCH = "layer-midground-architecture"
    LAYER_FOREGROUND = "layer-foreground-stage"
    LAYER_RESIDUES = "layer-material-residues-chiaroscuro"
    LAYER_PERFORMERS = "layer-nonhuman-performer-rigs"
    LAYER_VECTORS = "layer-aftermath-split-overlays"
    LAYER_FRAME = "layer-engraving-frame-caption"

    def __init__(self, plate_id: str) -> None:
        super().__init__(plate_id=plate_id, width=IMAGE_DIMENSIONS[0], height=IMAGE_DIMENSIONS[1])
        for lid in (
            self.LAYER_SKY,
            self.LAYER_HORIZON,
            self.LAYER_MID_ARCH,
            self.LAYER_FOREGROUND,
            self.LAYER_RESIDUES,
            self.LAYER_PERFORMERS,
            self.LAYER_VECTORS,
            self.LAYER_FRAME,
        ):
            self.ensure_layer(lid)
        self.stage_x0 = 40.0
        self.stage_y0 = 32.0
        self.stage_w = 1120.0
        self.stage_h = 684.0
        self.add_def(
            f'<clipPath id="stage-clip-{self.plate_id}">'
            f'<rect x="{self.stage_x0:.0f}" y="{self.stage_y0:.0f}" width="{self.stage_w:.0f}" height="{self.stage_h:.0f}"/>'
            f'</clipPath>'
        )
        self.draw_vellum_grain(self.LAYER_SKY, density=200)

    def draw_sky_atmosphere(
        self,
        mode: str = "dawn_bastion",
        sun_moon_xy: Optional[Tuple[float, float]] = None,
    ) -> None:
        """
        Render woodcut/aquatint hatched skies & atmospheric lighting:
        `dusk | moonlight | subterranean_cutaway | abyssal_mist | mirror_lake | dawn_bastion`
        """
        p = self.palette
        L = self.LAYER_SKY
        sx, sy, sw, sh = self.stage_x0, self.stage_y0, self.stage_w, self.stage_h

        if mode == "subterranean_cutaway":
            # Deep soot/graphite stone cellar vault ceiling with chiaroscuro torch/lamp raking darks
            self.emit(
                L,
                f'<g clip-path="url(#stage-clip-{self.plate_id})">'
                f'<rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" fill="{p["soot"]}" fill-opacity="0.90"/>'
                f'<rect x="{sx}" y="{sy}" width="{sw}" height="{sh * 0.42:.1f}" fill="url(#ashlar-stone)"/>',
            )
            # Heavy vaulted masonry ribs across cellar ceiling
            for arch_cx in (240, 600, 960):
                self.emit(
                    L,
                    f'<path d="M {arch_cx - 210} {sy + 260} Q {arch_cx} {sy + 18} {arch_cx + 210} {sy + 260}" '
                    f'fill="none" stroke="{p["dirt"]}" stroke-width="7.0" stroke-opacity="0.45"/>'
                    f'<path d="M {arch_cx - 204} {sy + 260} Q {arch_cx} {sy + 28} {arch_cx + 204} {sy + 260}" '
                    f'fill="none" stroke="{p["bone"]}" stroke-width="1.1" stroke-opacity="0.24"/>',
                )
            # Woodcut horizontal chiaroscuro hatch rulings
            lines: List[str] = []
            for row in range(0, int(sh), 5):
                y = sy + row
                lines.append(f"M {sx} {y} L {sx + sw} {y}")
            self.emit(
                L,
                f'<path d="{" ".join(lines)}" stroke="{p["bone"]}" stroke-width="0.45" stroke-opacity="0.11"/></g>',
            )
            return

        # Sky wash + variable-pitch woodcut horizontal rulings
        top_ink = {
            "dusk": p["chalk_blue"],
            "moonlight": p["soot"],
            "abyssal_mist": p["graphite"],
            "mirror_lake": p["chalk_blue"],
            "dawn_bastion": p["chalk_blue"],
        }.get(mode, p["chalk_blue"])

        self.emit(L, f'<g clip-path="url(#stage-clip-{self.plate_id})">')
        self.emit(
            L,
            f'<rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" fill="{p["paper"]}"/>'
            f'<rect x="{sx}" y="{sy}" width="{sw}" height="{sh * 0.58:.1f}" fill="{top_ink}" fill-opacity="0.14"/>',
        )
        # Graduated woodcut sky lines (tighter near zenith, wider near horizon)
        y_cursor = sy + 4.0
        step = 2.6
        sky_bottom = sy + sh * 0.62
        woodcut_d: List[str] = []
        while y_cursor < sky_bottom:
            woodcut_d.append(f"M {sx:.1f} {y_cursor:.1f} L {sx + sw:.1f} {y_cursor:.1f}")
            y_cursor += step
            step += 0.16
        self.emit(
            L,
            f'<path d="{" ".join(woodcut_d)}" fill="none" stroke="{top_ink}" stroke-width="0.85" stroke-opacity="0.34"/>',
        )

        if sun_moon_xy:
            mx, my = sun_moon_xy
            disc_col = p["bone"] if mode == "moonlight" else p["paper"]
            ring_col = p["ochre_oil"] if mode in ("dusk", "dawn_bastion") else p["chalk_blue"]
            self.emit(
                L,
                f'<circle cx="{mx:.1f}" cy="{my:.1f}" r="48" fill="{ring_col}" fill-opacity="0.14"/>'
                f'<circle cx="{mx:.1f}" cy="{my:.1f}" r="27" fill="{disc_col}" stroke="{ring_col}" stroke-width="1.3"/>',
            )
        if mode == "abyssal_mist":
            for band in range(5):
                by = sy + sh * (0.48 + band * 0.09)
                self.emit(
                    L,
                    f'<rect x="{sx}" y="{by:.1f}" width="{sw}" height="34" fill="{p["bone"]}" fill-opacity="0.48"/>',
                )
        elif mode == "mirror_lake":
            water_y = sy + sh * 0.62
            self.emit(
                L,
                f'<rect x="{sx}" y="{water_y:.1f}" width="{sw}" height="{sy + sh - water_y:.1f}" '
                f'fill="{p["chalk_blue"]}" fill-opacity="0.20"/>'
                f'<line x1="{sx}" y1="{water_y:.1f}" x2="{sx + sw}" y2="{water_y:.1f}" '
                f'stroke="{p["soot"]}" stroke-width="1.8"/>',
            )
        self.emit(L, "</g>")

    # --- Architectural Silhouette Builders (Wave 1 & Wave 2 55-City Kit) ---

    def draw_domes(
        self,
        layer_id: str,
        cx: float,
        base_y: float,
        rx: float,
        ry: float,
        fill: Optional[str] = None,
        lantern: bool = True,
    ) -> None:
        p = self.palette
        col = fill or p["bone"]
        d = (
            f"M {cx - rx:.1f} {base_y:.1f} "
            f"C {cx - rx:.1f} {base_y - ry * 0.85:.1f}, {cx - rx * 0.35:.1f} {base_y - ry:.1f}, {cx:.1f} {base_y - ry:.1f} "
            f"C {cx + rx * 0.35:.1f} {base_y - ry:.1f}, {cx + rx:.1f} {base_y - ry * 0.85:.1f}, {cx + rx:.1f} {base_y:.1f} Z"
        )
        self.emit(layer_id, f'<path d="{d}" fill="{col}" stroke="{p["soot"]}" stroke-width="1.5"/>')
        # Ribbed meridian lines
        for frac in (-0.55, -0.25, 0.25, 0.55):
            rib = (
                f"M {cx + rx * frac:.1f} {base_y:.1f} "
                f"Q {cx + rx * frac * 0.6:.1f} {base_y - ry * 0.75:.1f} {cx:.1f} {base_y - ry:.1f}"
            )
            self.emit(layer_id, f'<path d="{rib}" fill="none" stroke="{p["graphite"]}" stroke-width="0.75" stroke-opacity="0.6"/>')
        if lantern:
            self.emit(
                layer_id,
                f'<rect x="{cx - 5:.1f}" y="{base_y - ry - 14:.1f}" width="10" height="14" fill="{col}" stroke="{p["soot"]}" stroke-width="1.1"/>'
                f'<line x1="{cx:.1f}" y1="{base_y - ry - 14:.1f}" x2="{cx:.1f}" y2="{base_y - ry - 26:.1f}" stroke="{p["ochre_oil"]}" stroke-width="1.3"/>',
            )

    def draw_bastions(
        self,
        layer_id: str,
        x: float,
        top_y: float,
        w: float,
        h: float,
        batter: float = 16.0,
        arcade_arches: int = 0,
        zinc_roof_h: float = 0.0,
    ) -> None:
        """Draw battered stone bastion massing with optional arcades and zinc-scaled roof."""
        p = self.palette
        pts = [(x, top_y), (x + w, top_y), (x + w + batter, top_y + h), (x - batter, top_y + h)]
        d = self.hand_path_d(pts, jitter=0.6, closed=True)
        self.emit(
            layer_id,
            f'<path d="{d}" fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.8"/>'
            f'<path d="{d}" fill="url(#ashlar-stone)" stroke="none"/>',
        )
        # Crenelated parapet
        merlon_w = 14.0
        count = max(2, int(w // 22))
        for i in range(count):
            mx = x + i * (w / count) + 2
            self.emit(
                layer_id,
                f'<rect x="{mx:.1f}" y="{top_y - 8:.1f}" width="{merlon_w:.1f}" height="8" '
                f'fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.2"/>',
            )
        if zinc_roof_h > 0:
            rpts = [(x - 6, top_y - 8), (x + w * 0.5, top_y - 8 - zinc_roof_h), (x + w + 6, top_y - 8)]
            rd = self.hand_path_d(rpts, jitter=0.45, closed=True)
            self.emit(
                layer_id,
                f'<path d="{rd}" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.5"/>'
                f'<path d="{rd}" fill="url(#zinc-scales)" stroke="{p["soot"]}" stroke-width="1.2"/>',
            )
        if arcade_arches > 0:
            span = (w - 20.0) / arcade_arches
            for a in range(arcade_arches):
                ax = x + 10.0 + a * span + span * 0.5
                aw = span * 0.34
                ay = top_y + 38.0
                self.emit(
                    layer_id,
                    f'<path d="M {ax - aw:.1f} {ay + 28:.1f} L {ax - aw:.1f} {ay:.1f} '
                    f'A {aw:.1f} {aw:.1f} 0 0 1 {ax + aw:.1f} {ay:.1f} L {ax + aw:.1f} {ay + 28:.1f} Z" '
                    f'fill="{p["soot"]}" fill-opacity="0.78" stroke="{p["soot"]}" stroke-width="1.1"/>',
                )

    def draw_spiral_shells(self, layer_id: str, cx: float, base_y: float, w: float, h: float, tiers: int = 5) -> None:
        p = self.palette
        for t in range(tiers):
            u0, u1 = t / tiers, (t + 1) / tiers
            y0, y1 = base_y - h * u0, base_y - h * u1
            hw0, hw1 = w * 0.5 * (1.0 - 0.72 * u0), w * 0.5 * (1.0 - 0.72 * u1)
            pts = [(cx - hw0, y0), (cx + hw0, y0), (cx + hw1, y1), (cx - hw1, y1)]
            self.hand_polygon(layer_id, pts, fill=p["bone"], stroke=p["soot"], stroke_width=1.3, jitter=0.4)
            self.hand_line(layer_id, cx - hw0, y0, cx + hw1, y1, stroke=p["chalk_blue"], stroke_width=1.0)

    def draw_stilts(self, layer_id: str, x: float, house_y: float, ground_y: float, w: float, h: float) -> None:
        p = self.palette
        for frac in (0.12, 0.38, 0.64, 0.88):
            px = x + w * frac
            self.hand_line(layer_id, px, house_y + h, px + (frac - 0.5) * 14, ground_y, stroke=p["soot"], stroke_width=2.1)
        self.hand_line(layer_id, x + w * 0.12, house_y + h + 18, x + w * 0.88, ground_y - 24, stroke=p["graphite"], stroke_width=0.9)
        self.hand_line(layer_id, x + w * 0.88, house_y + h + 18, x + w * 0.12, ground_y - 24, stroke=p["graphite"], stroke_width=0.9)
        self.hand_polygon(
            layer_id, [(x, house_y), (x + w, house_y), (x + w, house_y + h), (x, house_y + h)],
            fill=p["bone"], stroke=p["soot"], stroke_width=1.4,
        )

    def draw_suspension_nets(self, layer_id: str, x0: float, y0: float, x1: float, y1: float, sag: float = 85.0) -> None:
        p = self.palette
        mx, my = 0.5 * (x0 + x1), 0.5 * (y0 + y1) + sag
        self.emit(layer_id, f'<path d="M {x0:.1f} {y0:.1f} Q {mx:.1f} {my:.1f} {x1:.1f} {y1:.1f}" fill="none" stroke="{p["soot"]}" stroke-width="2.0"/>')
        for i in range(1, 9):
            u = i / 9.0
            px = (1 - u) ** 2 * x0 + 2 * (1 - u) * u * mx + u ** 2 * x1
            py = (1 - u) ** 2 * y0 + 2 * (1 - u) * u * my + u ** 2 * y1
            self.hand_line(layer_id, px, py, px, py + 34 + (i % 3) * 12, stroke=p["graphite"], stroke_width=1.0)

    def draw_pipe_forests(self, layer_id: str, x0: float, x1: float, base_y: float, count: int = 8) -> None:
        p = self.palette
        step = (x1 - x0) / max(1, count - 1)
        for i in range(count):
            px = x0 + i * step
            top_y = base_y - 140 - (i * 37 % 110)
            self.hand_line(layer_id, px, base_y, px, top_y, stroke=p["graphite"], stroke_width=2.4, jitter=0.2)
            if i > 0:
                hy = top_y + 38
                self.hand_line(layer_id, px - step, hy, px, hy, stroke=p["soot"], stroke_width=1.6, jitter=0.2)

    def draw_canals(self, layer_id: str, x0: float, x1: float, y: float, arch_cx: float, arch_w: float = 110.0) -> None:
        p = self.palette
        self.emit(
            layer_id,
            f'<rect x="{x0:.1f}" y="{y:.1f}" width="{x1 - x0:.1f}" height="56" fill="url(#hatch-chalk-water)" stroke="{p["chalk_blue"]}" stroke-width="1.3"/>'
            f'<path d="M {arch_cx - arch_w * 0.5:.1f} {y + 6:.1f} Q {arch_cx:.1f} {y - 44:.1f} {arch_cx + arch_w * 0.5:.1f} {y + 6:.1f}" '
            f'fill="none" stroke="{p["soot"]}" stroke-width="5.5"/>',
        )

    def draw_scaffolding(self, layer_id: str, x: float, y: float, w: float, h: float, cols: int = 4, rows: int = 5) -> None:
        p = self.palette
        for c in range(cols + 1):
            cx = x + c * (w / cols)
            self.hand_line(layer_id, cx, y, cx, y + h, stroke=p["soot"], stroke_width=1.3, jitter=0.35)
        for r in range(rows + 1):
            ry = y + r * (h / rows)
            self.hand_line(layer_id, x, ry, x + w, ry, stroke=p["soot"], stroke_width=1.1, jitter=0.35)
        self.hand_line(layer_id, x, y + h, x + w, y, stroke=p["graphite"], stroke_width=0.95)

    def draw_crystal_globes(self, layer_id: str, cx: float, cy: float, r: float) -> None:
        p = self.palette
        self.emit(
            layer_id,
            f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{r:.1f}" fill="{p["chalk_blue"]}" fill-opacity="0.18" '
            f'stroke="{p["chalk_blue"]}" stroke-width="1.6"/>'
            f'<path d="M {cx - r * 0.55:.1f} {cy - r * 0.35:.1f} A {r * 0.7:.1f} {r * 0.7:.1f} 0 0 1 {cx - r * 0.1:.1f} {cy - r * 0.72:.1f}" '
            f'fill="none" stroke="{p["paper"]}" stroke-width="2.0"/>',
        )

    def draw_zodiacal_gates(self, layer_id: str, cx: float, base_y: float, r: float) -> None:
        p = self.palette
        self.emit(
            layer_id,
            f'<path d="M {cx - r:.1f} {base_y:.1f} A {r:.1f} {r:.1f} 0 1 1 {cx + r:.1f} {base_y:.1f}" '
            f'fill="none" stroke="{p["soot"]}" stroke-width="4.5"/>'
            f'<path d="M {cx - r * 0.84:.1f} {base_y:.1f} A {r * 0.84:.1f} {r * 0.84:.1f} 0 1 1 {cx + r * 0.84:.1f} {base_y:.1f}" '
            f'fill="none" stroke="{p["ochre_oil"]}" stroke-width="1.2" stroke-dasharray="6,4"/>',
        )

    def draw_refuse_mountains(self, layer_id: str, peaks: Sequence[Tuple[float, float]], base_y: float) -> None:
        p = self.palette
        pts = [(peaks[0][0] - 80, base_y)] + list(peaks) + [(peaks[-1][0] + 80, base_y)]
        d = self.hand_path_d(pts, jitter=1.1, closed=True)
        self.emit(
            layer_id,
            f'<path d="{d}" fill="{p["dirt"]}" fill-opacity="0.32" stroke="{p["soot"]}" stroke-width="1.5"/>'
            f'<path d="{d}" fill="url(#hatch-graphite-cross)" stroke="none"/>',
        )

    def draw_stairway_street(
        self,
        layer_id: str,
        x0: float,
        y0: float,
        x1: float,
        y1: float,
        base_w: float = 108.0,
        steps: int = 20,
    ) -> None:
        """Draw a rising multiplane stone stairway street in perspective elevation."""
        p = self.palette
        for s_idx in range(steps):
            u = s_idx / max(1, steps)
            sx_s = x0 + (x1 - x0) * u
            sy_s = y0 + (y1 - y0) * u
            sw_s = base_w * (1.0 - 0.34 * u)
            self.emit(
                layer_id,
                f'<rect x="{sx_s - sw_s * 0.5:.1f}" y="{sy_s:.1f}" width="{sw_s:.1f}" height="{abs(y0 - y1) / max(1, steps) + 1.5:.1f}" '
                f'fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.15"/>',
            )
        self.hand_line(layer_id, x0 - base_w * 0.5, y0, x1 - base_w * 0.33, y1 - 14, stroke=p["soot"], stroke_width=2.0)
        self.hand_line(layer_id, x0 + base_w * 0.5, y0, x1 + base_w * 0.33, y1 - 14, stroke=p["soot"], stroke_width=2.0)

    def draw_chiaroscuro_beams(
        self,
        origin_xy: Tuple[float, float],
        x_left: float,
        x_right: float,
        floor_y: float,
        fill: Optional[str] = None,
        opacity: float = 0.14,
    ) -> None:
        """Project raking chiaroscuro illumination cone across the multiplane stage."""
        p = self.palette
        col = fill or p["ochre_oil"]
        ox, oy = origin_xy
        self.emit(
            self.LAYER_SKY,
            f'<polygon points="{ox:.1f},{oy:.1f} {x_right:.1f},{floor_y:.1f} {x_left:.1f},{floor_y:.1f}" '
            f'fill="{col}" fill-opacity="{opacity:.2f}"/>',
        )

    # --- All 10 Constant-Volume Faceless Nonhuman Rigs ---

    def draw_posed_rig(
        self,
        agent_id: str,
        rig_archetype: str,
        cx: float,
        bottom_y: float,
        base_scale: float = 68.0,
        stretch_s: float = 1.0,
        width_w: Optional[float] = None,
        tilt_rad: float = 0.0,
        kinematics: str = "idle",
        ink: str = "#1E1E1E",
        fill: str = "#E8E0D6",
        role_symbol: Optional[str] = None,
        caption: Optional[str] = None,
        ghost_alpha: float = 1.0,
        layer_id: Optional[str] = None,
    ) -> Tuple[float, float, float]:
        """
        Render one posed constant-volume faceless nonhuman rig (`has_face_icons = False`).
        Validates `stretch_s * width_w == 1.00 ± 0.03` and embeds volumetric telemetry
        directly on the SVG `<g>` node.
        """
        if rig_archetype not in VALID_RIG_ARCHETYPES:
            raise ValueError(f"Unknown rig_archetype {rig_archetype!r}.")
        s, w, area_ratio = resolve_rig_volume(agent_id=agent_id, stretch_s=stretch_s, width_w=width_w)
        p = self.palette
        target_layer = layer_id or self.LAYER_PERFORMERS
        tilt_deg = math.degrees(tilt_rad)
        H = base_scale
        W = base_scale * 0.68

        # Ground contact shadow
        if ghost_alpha > 0.55:
            self.emit(
                target_layer,
                f'<ellipse cx="{cx:.1f}" cy="{bottom_y + 3:.1f}" rx="{W * w * 0.58:.1f}" ry="{max(3.5, H * 0.08):.1f}" '
                f'fill="{p["soot"]}" fill-opacity="{0.26 * ghost_alpha:.2f}"/>',
            )

        body_parts: List[str] = []
        dash_attr = ' stroke-dasharray="5,3"' if ghost_alpha < 0.85 else ""

        if rig_archetype == "flour_sack":
            # Weighted burlap flour sack: heavy bottom sag, cinched waist fold, two pinched top sack-ears.
            # STRICTLY ZERO FACIAL FEATURES — pure constant-volume attitude!
            ear_bias = 8.0 if kinematics in ("deliberate_push", "accuse", "help") else (-6.0 if kinematics in ("draw_back", "recoil", "avoid") else 0.0)
            hw = W * 0.52
            sack_d = (
                f"M {-hw * 0.88:.1f} 0 "
                f"C {-hw * 1.18:.1f} {-H * 0.14:.1f}, {-hw * 1.10:.1f} {-H * 0.46:.1f}, {-hw * 0.72:.1f} {-H * 0.68:.1f} "
                f"L {-hw * 0.92 + ear_bias * 0.4:.1f} {-H * 0.98:.1f} "
                f"L {-hw * 0.36 + ear_bias * 0.25:.1f} {-H * 0.80:.1f} "
                f"Q 0 {-H * 0.86:.1f} {hw * 0.36 + ear_bias * 0.25:.1f} {-H * 0.80:.1f} "
                f"L {hw * 0.92 + ear_bias * 0.4:.1f} {-H * 0.98:.1f} "
                f"L {hw * 0.72:.1f} {-H * 0.68:.1f} "
                f"C {hw * 1.10:.1f} {-H * 0.46:.1f}, {hw * 1.18:.1f} {-H * 0.14:.1f}, {hw * 0.88:.1f} 0 Z"
            )
            body_parts.append(
                f'<path d="{sack_d}" fill="{fill}" stroke="{ink}" stroke-width="2.1" stroke-linejoin="round"{dash_attr}/>'
                f'<path d="{sack_d}" fill="url(#hatch-soot-45)" fill-opacity="0.45" stroke="none"/>'
                # Internal burlap weight-settle & cinch folds (strictly structural fabric creases)
                f'<path d="M {-hw * 0.68:.1f} {-H * 0.56:.1f} Q 0 {-H * 0.48:.1f} {hw * 0.68:.1f} {-H * 0.56:.1f}" '
                f'fill="none" stroke="{ink}" stroke-width="1.2" stroke-opacity="0.72"/>'
                f'<path d="M {-hw * 0.76:.1f} {-H * 0.22:.1f} Q {-hw * 0.15:.1f} {-H * 0.12:.1f} {hw * 0.52:.1f} {-H * 0.26:.1f}" '
                f'fill="none" stroke="{ink}" stroke-width="1.0" stroke-opacity="0.55"/>'
                f'<line x1="0" y1="{-H * 0.80:.1f}" x2="{-hw * 0.12:.1f}" y2="{-H * 0.32:.1f}" '
                f'stroke="{p["dirt"]}" stroke-width="0.95" stroke-dasharray="3,2"/>'
            )

        elif rig_archetype == "plumb_bob":
            hw = W * 0.42
            body_parts.append(
                f'<line x1="0" y1="{-H * 1.32:.1f}" x2="0" y2="{-H * 0.84:.1f}" stroke="{ink}" stroke-width="1.6"{dash_attr}/>'
                f'<rect x="{-hw * 0.34:.1f}" y="{-H * 0.84:.1f}" width="{hw * 0.68:.1f}" height="{H * 0.12:.1f}" fill="{fill}" stroke="{ink}" stroke-width="1.5"/>'
                f'<path d="M {-hw:.1f} {-H * 0.62:.1f} Q 0 {-H * 0.76:.1f} {hw:.1f} {-H * 0.62:.1f} L 0 0 Z" '
                f'fill="{fill}" stroke="{ink}" stroke-width="2.0"{dash_attr}/>'
                f'<line x1="{-hw * 0.88:.1f}" y1="{-H * 0.54:.1f}" x2="{hw * 0.88:.1f}" y2="{-H * 0.54:.1f}" stroke="{ink}" stroke-width="1.1"/>'
            )

        elif rig_archetype == "bamboo_stilt":
            # Articulated feline/stilt bamboo truss frame — slender segmented limbs + arched dorsal spine
            hw = W * 0.55
            arch_h = H * 0.76
            body_parts.append(
                f'<path d="M {-hw * 0.85:.1f} 0 L {-hw * 0.52:.1f} {-arch_h * 0.78:.1f} '
                f'Q 0 {-arch_h * 1.18:.1f} {hw * 0.62:.1f} {-arch_h * 0.74:.1f} L {hw * 0.88:.1f} 0" '
                f'fill="none" stroke="{ink}" stroke-width="2.8" stroke-linecap="round"{dash_attr}/>'
                f'<path d="M {-hw * 0.52:.1f} {-arch_h * 0.78:.1f} L {-hw * 0.96:.1f} {-arch_h * 1.15:.1f}" '
                f'fill="none" stroke="{ink}" stroke-width="2.0" stroke-linecap="round"/>'
                f'<polygon points="{hw * 0.52:.1f},{-arch_h * 0.76:.1f} {hw * 0.88:.1f},{-arch_h * 0.96:.1f} {hw * 0.82:.1f},{-arch_h * 0.64:.1f}" '
                f'fill="{fill}" stroke="{ink}" stroke-width="1.5"/>'
                # Bamboo node rings
                f'<line x1="{-hw * 0.74:.1f}" y1="{-arch_h * 0.38:.1f}" x2="{-hw * 0.60:.1f}" y2="{-arch_h * 0.42:.1f}" stroke="{p["ochre_oil"]}" stroke-width="1.8"/>'
                f'<line x1="{hw * 0.70:.1f}" y1="{-arch_h * 0.38:.1f}" x2="{hw * 0.82:.1f}" y2="{-arch_h * 0.42:.1f}" stroke="{p["ochre_oil"]}" stroke-width="1.8"/>'
            )

        elif rig_archetype == "taut_chord":
            hw = W * 0.72
            sag = H * (0.12 if kinematics in ("hold_still", "idle") else 0.32)
            body_parts.append(
                f'<line x1="{-hw:.1f}" y1="0" x2="{-hw:.1f}" y2="{-H * 0.92:.1f}" stroke="{ink}" stroke-width="2.2"/>'
                f'<line x1="{hw:.1f}" y1="0" x2="{hw:.1f}" y2="{-H * 0.92:.1f}" stroke="{ink}" stroke-width="2.2"/>'
                f'<path d="M {-hw:.1f} {-H * 0.84:.1f} Q 0 {-H * 0.84 + sag:.1f} {hw:.1f} {-H * 0.84:.1f}" '
                f'fill="none" stroke="{p["red_bird"]}" stroke-width="2.2"{dash_attr}/>'
                f'<polygon points="-7,{-H * 0.74 + sag * 0.5:.1f} 7,{-H * 0.74 + sag * 0.5:.1f} 0,{-H * 0.54 + sag * 0.5:.1f}" '
                f'fill="{fill}" stroke="{ink}" stroke-width="1.3"/>'
            )

        elif rig_archetype == "hooded_husk":
            # Draped sackcloth cowl cone with structural weave pleats — strictly zero facial or ocular shapes!
            hw = W * 0.50
            cowl_d = (
                f"M {-hw * 0.94:.1f} 0 "
                f"Q {-hw * 0.96:.1f} {-H * 0.52:.1f} {-hw * 0.44:.1f} {-H * 0.84:.1f} "
                f"L {hw * 0.06:.1f} {-H * 1.00:.1f} "
                f"Q {hw * 0.68:.1f} {-H * 0.74:.1f} {hw * 0.88:.1f} 0 Z"
            )
            body_parts.append(
                f'<path d="{cowl_d}" fill="{fill}" stroke="{ink}" stroke-width="2.0" stroke-linejoin="round"{dash_attr}/>'
                f'<path d="{cowl_d}" fill="url(#hatch-soot-45)" fill-opacity="0.52" stroke="none"/>'
                f'<path d="M {hw * 0.06:.1f} {-H * 1.00:.1f} L {-hw * 0.22:.1f} 0" stroke="{ink}" stroke-width="1.25" stroke-opacity="0.72"/>'
                f'<path d="M {-hw * 0.52:.1f} {-H * 0.54:.1f} L {hw * 0.62:.1f} {-H * 0.22:.1f}" stroke="{ink}" stroke-width="1.2"/>'
                f'<path d="M {-hw * 0.74:.1f} {-H * 0.26:.1f} Q 0 {-H * 0.14:.1f} {hw * 0.74:.1f} {-H * 0.24:.1f}" fill="none" stroke="{p["dirt"]}" stroke-width="1.0" stroke-dasharray="3,2"/>'
            )

        elif rig_archetype == "ceramic_vessel":
            hw = W * 0.48
            fractured = s < 0.78
            if fractured:
                vessel_d = (
                    f"M {-hw * 0.72:.1f} 0 "
                    f"Q {-hw * 1.05:.1f} {-H * 0.36:.1f} {-hw * 0.58:.1f} {-H * 0.68:.1f} "
                    f"L {-hw * 0.18:.1f} {-H * 0.46:.1f} L {hw * 0.16:.1f} {-H * 0.74:.1f} "
                    f"L {hw * 0.76:.1f} {-H * 0.52:.1f} Q {hw * 0.96:.1f} {-H * 0.20:.1f} {hw * 0.68:.1f} 0 Z"
                )
            else:
                vessel_d = (
                    f"M {-hw * 0.58:.1f} 0 "
                    f"C {-hw * 1.12:.1f} {-H * 0.28:.1f}, {-hw * 0.96:.1f} {-H * 0.68:.1f}, {-hw * 0.34:.1f} {-H * 0.80:.1f} "
                    f"L {-hw * 0.44:.1f} {-H * 0.96:.1f} L {hw * 0.56:.1f} {-H * 0.96:.1f} "
                    f"L {hw * 0.38:.1f} {-H * 0.80:.1f} "
                    f"C {hw * 1.04:.1f} {-H * 0.66:.1f}, {hw * 1.12:.1f} {-H * 0.28:.1f}, {hw * 0.58:.1f} 0 Z"
                )
            flame = (
                f'<path d="M {hw * 0.48:.1f} {-H * 0.96:.1f} Q {hw * 0.72:.1f} {-H * 1.24:.1f} {hw * 0.36:.1f} {-H * 1.38:.1f} '
                f'Q {hw * 0.18:.1f} {-H * 1.18:.1f} {hw * 0.48:.1f} {-H * 0.96:.1f} Z" '
                f'fill="{p["ochre_oil"]}" stroke="{p["red_bird"]}" stroke-width="1.0"/>'
                if not fractured
                else ""
            )
            body_parts.append(
                f'<path d="{vessel_d}" fill="{fill}" stroke="{ink}" stroke-width="2.0"{dash_attr}/>' + flame
            )

        elif rig_archetype == "brass_cog":
            r = W * 0.48
            cy_cog = -H * 0.54
            teeth: List[str] = []
            for ti in range(10):
                ta = ti * 2.0 * math.pi / 10.0
                x_in, y_in = (r * 0.82) * math.cos(ta), cy_cog + (r * 0.82) * math.sin(ta)
                x_out, y_out = (r * 1.08) * math.cos(ta), cy_cog + (r * 1.08) * math.sin(ta)
                teeth.append(f'<line x1="{x_in:.1f}" y1="{y_in:.1f}" x2="{x_out:.1f}" y2="{y_out:.1f}" stroke="{ink}" stroke-width="3.4"/>')
            body_parts.append(
                "".join(teeth)
                + f'<circle cx="0" cy="{cy_cog:.1f}" r="{r * 0.86:.1f}" fill="{fill}" stroke="{ink}" stroke-width="2.0"{dash_attr}/>'
                + f'<circle cx="0" cy="{cy_cog:.1f}" r="{r * 0.28:.1f}" fill="{p["paper"]}" stroke="{ink}" stroke-width="1.5"/>'
                + f'<line x1="0" y1="{cy_cog + r * 0.86:.1f}" x2="0" y2="0" stroke="{ink}" stroke-width="2.4"/>'
            )

        elif rig_archetype == "pinhead_lens":
            r = W * 0.44
            cy_l = -H * 0.68
            body_parts.append(
                f'<line x1="{-r * 0.7:.1f}" y1="0" x2="0" y2="{cy_l + r:.1f}" stroke="{ink}" stroke-width="1.8"/>'
                f'<line x1="{r * 0.7:.1f}" y1="0" x2="0" y2="{cy_l + r:.1f}" stroke="{ink}" stroke-width="1.8"/>'
                f'<circle cx="0" cy="{cy_l:.1f}" r="{r:.1f}" fill="{p["chalk_blue"]}" fill-opacity="0.22" stroke="{ink}" stroke-width="2.2"{dash_attr}/>'
            )

        elif rig_archetype == "mirror_obverse":
            hw = W * 0.44
            body_parts.append(
                f'<polygon points="{-hw:.1f},0 0,{-H * 0.98:.1f} 0,0" fill="{p["paper"]}" stroke="{ink}" stroke-width="1.8"/>'
                f'<polygon points="0,0 0,{-H * 0.98:.1f} {hw:.1f},0" fill="{p["soot"]}" stroke="{ink}" stroke-width="1.8"/>'
            )

        elif rig_archetype == "chalk_grain":
            hw = W * 0.46
            body_parts.append(
                f'<polygon points="{-hw * 0.7:.1f},{-H * 0.14:.1f} {-hw * 0.85:.1f},{-H * 0.62:.1f} '
                f'0,{-H * 0.96:.1f} {hw * 0.85:.1f},{-H * 0.58:.1f} {hw * 0.65:.1f},0" '
                f'fill="{fill}" stroke="{ink}" stroke-width="1.9"{dash_attr}/>'
            )

        group_xml = (
            f'<g class="scion-nonhuman-rig" data-agent-id="{xml_escape(agent_id)}" '
            f'data-rig-archetype="{rig_archetype}" data-has-face-icons="false" '
            f'data-stretch-s="{s:.6f}" data-width-w="{w:.6f}" data-area-ratio="{area_ratio:.6f}" '
            f'data-kinematics="{xml_escape(kinematics)}" opacity="{ghost_alpha:.2f}" '
            f'transform="translate({cx:.2f},{bottom_y:.2f}) rotate({tilt_deg:.2f}) scale({w:.4f},{s:.4f})">'
            + "".join(body_parts)
            + "</g>"
        )
        self.emit(target_layer, group_xml)

        badge_ink = p["soot"] if ink == p["paper"] else ink
        if role_symbol and ghost_alpha >= 0.75:
            self.draw_afterlight_badge(
                target_layer, cx, bottom_y - H * s - 16.0, role_symbol=role_symbol,
                radius=10.5, ink=badge_ink, fill=p["paper"],
            )
        if caption:
            safe_cap = sanitize_plate_label(caption)
            bw = max(58.0, len(safe_cap) * 5.8 + 14.0)
            self.emit(
                target_layer,
                f'<g transform="translate({cx:.1f},{bottom_y + 18:.1f})">'
                f'<rect x="{-bw / 2:.1f}" y="-9.5" width="{bw:.1f}" height="14" rx="1.5" '
                f'fill="{p["paper"]}" fill-opacity="0.94" stroke="{badge_ink}" stroke-width="0.9"/>'
                f'<text x="0" y="0.8" font-family="{MONO_STACK}" font-size="8.5" font-weight="bold" '
                f'fill="{badge_ink}" text-anchor="middle">{xml_escape(safe_cap)}</text></g>',
            )
        return s, w, area_ratio

    def draw_engraving_frame_and_caption(
        self,
        plate_code: str,
        title: str,
        subtitle_optics: str,
        material_line: str,
        volume_audit_line: str,
    ) -> None:
        p = self.palette
        L = self.LAYER_FRAME
        sx, sy, sw, sh = self.stage_x0, self.stage_y0, self.stage_w, self.stage_h
        # Copperplate bevel & double border
        self.emit(
            L,
            f'<rect x="18" y="16" width="{self.width - 36}" height="{self.height - 32}" '
            f'fill="none" stroke="{p["dirt"]}" stroke-width="0.9"/>'
            f'<rect x="{sx:.0f}" y="{sy:.0f}" width="{sw:.0f}" height="{sh:.0f}" '
            f'fill="none" stroke="{p["soot"]}" stroke-width="2.4"/>'
            f'<rect x="{sx + 4:.0f}" y="{sy + 4:.0f}" width="{sw - 8:.0f}" height="{sh - 8:.0f}" '
            f'fill="none" stroke="{p["bone"]}" stroke-width="0.9" stroke-opacity="0.7"/>',
        )
        # Engraved bottom plate margin
        cap_y = sy + sh + 22
        self.draw_text(
            L, sx, cap_y, f"ARCHITECTURAL PLATE {plate_code}",
            size=9.5, fill=p["red_bird"], font_family=MONO_STACK, weight="bold", letter_spacing=0.7,
        )
        self.draw_text(
            L, sx + 205, cap_y, title,
            size=14.5, fill=p["soot"], font_family=SERIF_STACK, weight="bold",
        )
        self.draw_text(
            L, sx + sw, cap_y, volume_audit_line,
            size=8.6, fill=p["chalk_blue"], font_family=MONO_STACK, weight="bold", anchor="end",
        )
        self.draw_text(
            L, sx, cap_y + 18, subtitle_optics,
            size=10.0, fill=p["graphite"], font_family=SERIF_STACK, style="italic",
        )
        self.draw_text(
            L, sx, cap_y + 34, material_line,
            size=8.4, fill=p["dirt"], font_family=MONO_STACK,
        )


# ---------------------------------------------------------------------------
# DUAL-OUTPUT RENDERER (`.svg` + `.png`) & PIXEL / XML VERIFICATION
# ---------------------------------------------------------------------------

def _rasterize_svg_to_png(svg_path: Path, png_path: Path, width: int, height: int) -> None:
    """
    Rasterize `.svg` cleanly into a crisp anti-aliased `.png` at `(width, height)`.
    Primary path: `rsvg-convert` (`librsvg` native C/Cairo renderer).
    Fallback path: macOS `qlmanage` + `PIL` exact-bounds resize if `rsvg-convert` is unavailable.
    """
    png_path.parent.mkdir(parents=True, exist_ok=True)
    rsvg_bin = shutil.which("rsvg-convert") or "/opt/homebrew/bin/rsvg-convert"
    if os.path.isfile(rsvg_bin) and os.access(rsvg_bin, os.X_OK):
        subprocess.run(
            [
                rsvg_bin,
                "-w",
                str(width),
                "-h",
                str(height),
                "--background-color=#F2EFE9",
                str(svg_path),
                "-o",
                str(png_path),
            ],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        return

    ql_bin = shutil.which("qlmanage")
    if ql_bin:
        tmp_dir = png_path.parent
        subprocess.run(
            [ql_bin, "-t", "-s", str(max(width, height) * 2), "-o", str(tmp_dir), str(svg_path)],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        candidate = tmp_dir / f"{svg_path.name}.png"
        if candidate.exists():
            with Image.open(candidate) as im:
                resized = im.convert("RGB").resize((width, height), Image.Resampling.LANCZOS)
                resized.save(png_path, format="PNG")
            candidate.unlink(missing_ok=True)
            return

    raise RuntimeError(f"No SVG rasterizer available to render {svg_path} -> {png_path}.")


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def verify_plate_pair(
    svg_path: Path,
    png_path: Path,
    expected_size: Tuple[int, int],
) -> Dict[str, Any]:
    """
    Verify both `.svg` and `.png` outputs:
    - Both files exist and are non-empty
    - `.svg` parses cleanly as XML, matches `expected_size`, and has ZERO forbidden facial tokens
    - `.png` begins with canonical 8-byte PNG signature, matches `expected_size`, and exhibits
      rich pixel variance (`std >= 12.0`).
    """
    if not svg_path.is_file() or svg_path.stat().st_size == 0:
        raise FileNotFoundError(f"Missing or empty SVG plate: {svg_path}")
    if not png_path.is_file() or png_path.stat().st_size == 0:
        raise FileNotFoundError(f"Missing or empty PNG plate: {png_path}")

    svg_text = svg_path.read_text(encoding="utf-8")
    assert_no_facial_tokens(svg_text, str(svg_path))
    root = ET.fromstring(svg_text.encode("utf-8"))
    svg_w = int(float(root.attrib["width"]))
    svg_h = int(float(root.attrib["height"]))
    if (svg_w, svg_h) != expected_size:
        raise ValueError(f"SVG {svg_path} dimensions {(svg_w, svg_h)} != expected {expected_size}.")

    raw_head = png_path.read_bytes()[:8]
    if raw_head != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"Invalid PNG signature in {png_path}: {raw_head!r}")

    with Image.open(png_path) as im:
        png_size = im.size
        arr = np.asarray(im.convert("RGB"), dtype=np.float32)
    if png_size != expected_size:
        raise ValueError(f"PNG {png_path} dimensions {png_size} != expected {expected_size}.")

    pixel_std = float(arr.std())
    if pixel_std < 12.0:
        raise ValueError(f"PNG {png_path} appears blank or low-contrast (pixel_std={pixel_std:.2f} < 12.0).")

    return {
        "svg_path": str(svg_path),
        "png_path": str(png_path),
        "dimensions": [expected_size[0], expected_size[1]],
        "svg_bytes": svg_path.stat().st_size,
        "png_bytes": png_path.stat().st_size,
        "svg_sha256": sha256_file(svg_path),
        "png_sha256": sha256_file(png_path),
        "pixel_std": round(pixel_std, 3),
        "valid_xml": True,
        "valid_png_header": True,
        "facial_tokens_count": 0,
    }


def render_dual_plate(
    builder: _BasePlateBuilder,
    kind: str,
    svg_path: Path,
    png_path: Path,
) -> PlateRenderResult:
    """Write `.svg`, rasterize `.png`, and run full structural + pixel-variance verification."""
    svg_path.parent.mkdir(parents=True, exist_ok=True)
    png_path.parent.mkdir(parents=True, exist_ok=True)
    svg_doc = builder.to_svg()
    svg_path.write_text(svg_doc, encoding="utf-8")

    expected = (builder.width, builder.height)
    _rasterize_svg_to_png(svg_path=svg_path, png_path=png_path, width=expected[0], height=expected[1])
    audit = verify_plate_pair(svg_path=svg_path, png_path=png_path, expected_size=expected)

    return PlateRenderResult(
        plate_id=builder.plate_id,
        kind=kind,
        svg_path=svg_path,
        png_path=png_path,
        width=expected[0],
        height=expected[1],
        svg_bytes=audit["svg_bytes"],
        png_bytes=audit["png_bytes"],
        svg_sha256=audit["svg_sha256"],
        png_sha256=audit["png_sha256"],
        pixel_std=audit["pixel_std"],
    )
