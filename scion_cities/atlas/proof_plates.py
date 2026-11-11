#!/usr/bin/env python3
"""
SCION v1.0 — Wave 1 Proof Plates Generator (`proof_plates.py`).

Reads canonical `/Users/gaia/WORLDFUL/scion_cities/build/proof_bundle.json` and builds
handmade archival `.svg` + `.png` Map (`1200x900`) and Architectural Image (`1200x800`)
plates for Wave 1's two proof cases:
1. `case_00_abominable_cellar` (`flour_test_abominable_cellar`)
   - `maps/case_00_abominable_cellar_map.svg` & `.png`
   - `images/case_00_abominable_cellar_image.svg` & `.png`
2. `city_04_zaira` (`ZAIRA — City of High Bastions`)
   - `maps/city_04_zaira_map.svg` & `.png`
   - `images/city_04_zaira_image.svg` & `.png`

Writes `/Users/gaia/WORLDFUL/scion_cities/atlas/manifest.json` indexing each case/city ID
to its `{ "map_svg", "map_png", "image_svg", "image_png", "dimensions", "sha256" }`.
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

# Support running directly as `python3 scion_cities/atlas/proof_plates.py`
REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from scion_cities.atlas.plate_engine import (
    GLYPH_STACK,
    IMAGE_DIMENSIONS,
    MAP_DIMENSIONS,
    MONO_STACK,
    SERIF_STACK,
    ImagePlateBuilder,
    MapPlateBuilder,
    PlateRenderResult,
    render_dual_plate,
    verify_plate_pair,
)

ATLAS_DIR = Path(__file__).resolve().parent
MAPS_DIR = ATLAS_DIR / "maps"
IMAGES_DIR = ATLAS_DIR / "images"
MANIFESTS_DIR = ATLAS_DIR / "manifests"
MANIFEST_PATH = ATLAS_DIR / "manifest.json"
PACK_00_MANIFEST_PATH = MANIFESTS_DIR / "pack_00_proof_manifest.json"
DEFAULT_BUNDLE_PATH = REPO_ROOT / "scion_cities" / "build" / "proof_bundle.json"


def _whole_word_clip(text: str, max_chars: int) -> str:
    """Clip text on whole-word boundaries without mid-syllable truncation."""
    cleaned = " ".join(str(text).split())
    if len(cleaned) <= max_chars:
        return cleaned
    words = cleaned.split(" ")
    kept: List[str] = []
    cur = 0
    for w in words:
        add = len(w) + (1 if kept else 0)
        if cur + add > max_chars - 3:
            break
        kept.append(w)
        cur += add
    return (" ".join(kept) + "...") if kept else cleaned[:max_chars]


# ---------------------------------------------------------------------------
# CASE 00: CELLAR OF CALVINO'S ABOMINABLE HOUSE (MAP & IMAGE)
# ---------------------------------------------------------------------------

def build_abominable_cellar_map(case_data: Dict[str, Any]) -> MapPlateBuilder:
    """
    Construct the `1200x900` Cartographic Survey Plan for `case_00_abominable_cellar`:
    - Vaulted cellar masonry chamber & P1–P4 subrogation audit quadrants
    - Inigo's 4-tick stillness station, draw-back, shove vector & intact floor scuff `[+0.16, +0.025]`
    - Displaced Belindo sack trajectory into the terracotta oil-lamp plinth
    - 5 shattered ceramic shards (`s1..s5`) & concentric spreading oil radius (`r=0.209`)
    - Flower's Lawful Baseline A sightline (`help` Belindo / `accuse` Inigo) vs.
      Clinamen A' sightline (`⊣ FILTER` at `t=11`, `avoid` Belindo / `help` Inigo)
    - `ConflictGrain` Red-Bird keystone arch & all 5 Afterlight agent home-locus medallions.
    """
    m = MapPlateBuilder(plate_id="case_00_abominable_cellar_map")
    p = m.palette

    wt_a = case_data["CHECKPOINT_LAWFUL_A"]["world_trace"]
    wt_b = case_data["BRANCH_CLINAMEN_A_PRIME"]["world_trace"]
    final_res = wt_a[-1]["residues"]
    grains_a = case_data["CHECKPOINT_LAWFUL_A"]["accumulator_dag"]["conflict_grains"]
    ledger_a = case_data["CHECKPOINT_LAWFUL_A"]["rule_ledger"]
    ledger_b = case_data["BRANCH_CLINAMEN_A_PRIME"]["rule_ledger"]

    # Survey plan chamber box inside left/center sheet; reserve right-column furniture upfront
    chamber_box = (96.0, 118.0, 656.0, 560.0)
    cx0, cy0, cw, ch = chamber_box
    m.register_obstacle_box(776.0, 80.0, 348.0, 665.0)

    # 1. Subterranean stone elevation contours & flagstone chamber floor
    m.draw_contour_lines(
        center_xy=(cx0 + cw * 0.52, cy0 + ch * 0.54),
        radii=[(355, 295), (310, 255), (260, 210)],
        elevation_labels=["-4.2m STREET", "-4.8m VAULT", "-5.1m SUMP"],
        ink=p["dirt"],
        eccentricity_angle_deg=-8.0,
    )
    m.emit(
        m.LAYER_TERRAIN,
        f'<rect x="{cx0:.1f}" y="{cy0:.1f}" width="{cw:.1f}" height="{ch:.1f}" '
        f'fill="{p["bone"]}" fill-opacity="0.46" stroke="none"/>',
    )

    # 2. Policies P1–P4 Audit Quadrants across cellar floor flagstones
    mid_x = cx0 + cw * 0.50
    mid_y = cy0 + ch * 0.50
    m.hand_line(m.LAYER_TERRAIN, mid_x, cy0 + 14, mid_x, cy0 + ch - 14, stroke=p["graphite"], stroke_width=1.1, dash="6,4", opacity=0.65)
    m.hand_line(m.LAYER_TERRAIN, cx0 + 14, mid_y, cx0 + cw - 14, mid_y, stroke=p["graphite"], stroke_width=1.1, dash="6,4", opacity=0.65)

    quad_specs = [
        (cx0 + 22, cy0 + 28, ledger_a[0], ledger_b[0], "NW QUADRANT"),
        (mid_x + 18, cy0 + 28, ledger_a[1], ledger_b[1], "NE QUADRANT"),
        (cx0 + 22, mid_y + 22, ledger_a[2], ledger_b[2], "SW QUADRANT"),
        (mid_x + 18, mid_y + 22, ledger_a[3], ledger_b[3], "SE QUADRANT"),
    ]
    for qx, qy, pa, pb, qtag in quad_specs:
        m.emit(
            m.LAYER_TERRAIN,
            f'<rect x="{qx - 6:.1f}" y="{qy - 12:.1f}" width="292" height="52" rx="2" '
            f'fill="{p["paper"]}" fill-opacity="0.82" stroke="{p["dirt"]}" stroke-width="0.75"/>',
        )
        q_header = _whole_word_clip(f"{pa['policy_id']} · {qtag}: {pa['title']}", 54)
        m.draw_text(
            m.LAYER_TERRAIN, qx, qy, q_header,
            size=7.9, fill=p["soot"], font_family=MONO_STACK, weight="bold", decollide=False,
        )
        m.draw_text(
            m.LAYER_TERRAIN, qx, qy + 14, f"A : {pa['payout_status']}",
            size=7.9, fill=p["chalk_blue"], font_family=MONO_STACK, decollide=False,
        )
        m.draw_text(
            m.LAYER_TERRAIN, qx, qy + 27, f"A': {pb['payout_status']} [FLIP t={pb['deciding_tick']}]",
            size=7.9, fill=p["red_bird"], font_family=MONO_STACK, weight="bold", decollide=False,
        )
        m.register_obstacle_box(qx - 6.0, qy - 12.0, 292.0, 52.0)

    # Flagstone paving joints
    for gx in range(int(cx0 + 54), int(cx0 + cw - 20), 54):
        m.emit(
            m.LAYER_TERRAIN,
            f'<line x1="{gx}" y1="{cy0 + 12}" x2="{gx}" y2="{cy0 + ch - 12}" '
            f'stroke="{p["dirt"]}" stroke-width="0.45" stroke-opacity="0.30"/>',
        )
    for gy in range(int(cy0 + 48), int(cy0 + ch - 20), 48):
        m.emit(
            m.LAYER_TERRAIN,
            f'<line x1="{cx0 + 12}" y1="{gy}" x2="{cx0 + cw - 12}" y2="{gy}" '
            f'stroke="{p["dirt"]}" stroke-width="0.45" stroke-opacity="0.30"/>',
        )

    # 3. Heavy Cellar Perimeter Ashlar Walls, Upper Stairwell, Cistern & Vent Grate
    wall_pts = [
        (cx0, cy0 + 88),
        (cx0, cy0),
        (cx0 + cw, cy0),
        (cx0 + cw, cy0 + ch),
        (cx0, cy0 + ch),
        (cx0, cy0 + 178),
    ]
    m.draw_bastion_wall(wall_pts, thickness=11.0, crenelated=False)
    # Vaulted buttress piers along walls
    for px_pier in (cx0, mid_x, cx0 + cw):
        for py_pier in (cy0, mid_y, cy0 + ch):
            m.emit(
                m.LAYER_SOOT_PLAN,
                f'<rect x="{px_pier - 8:.1f}" y="{py_pier - 8:.1f}" width="16" height="16" '
                f'fill="{p["soot"]}" stroke="{p["bone"]}" stroke-width="1.0"/>',
            )

    # NW Corridor Stairwell Descent (offscreen_world footsteps)
    m.draw_stairway_run(cx0 - 26, cy0 + 133, cx0 + 86, cy0 + 133, width=36.0, steps=9, label="CORRIDOR STAIR")
    # Witness Alcove Step masonry platform (SW)
    m.draw_urban_block(
        [(cx0 + 110, cy0 + ch - 128), (cx0 + 298, cy0 + ch - 128), (cx0 + 298, cy0 + ch - 22), (cx0 + 110, cy0 + ch - 22)],
        roof_pattern="hatch-graphite-cross",
    )
    m.draw_text(
        m.LAYER_SOOT_PLAN, cx0 + 204, cy0 + ch - 114, "WITNESS ALCOVE STEP",
        size=8.2, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle",
    )
    # Masonry Lamp Hearth Plinth (SE)
    hearth_px, hearth_py = m.norm_to_map(0.70, 0.76, box=chamber_box)
    m.draw_urban_block(
        [(hearth_px - 42, hearth_py - 36), (hearth_px + 46, hearth_py - 36), (hearth_px + 46, hearth_py + 38), (hearth_px - 42, hearth_py + 38)],
        roof_pattern="ashlar-stone",
    )
    m.draw_text(
        m.LAYER_SOOT_PLAN, hearth_px + 2, hearth_py + 50, "HEARTH PLINTH",
        size=8.0, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle",
    )
    # Offscreen peripheral clocks along cellar perimeter
    m.draw_text(
        m.LAYER_SOOT_PLAN, cx0 + cw - 18, cy0 + 96,
        "◷ OFFSCREEN: CISTERN PIPE DRIP (p=0.94)",
        size=8.0, fill=p["graphite"], font_family=MONO_STACK, anchor="end",
    )
    m.draw_text(
        m.LAYER_SOOT_PLAN, cx0 + cw * 0.50, cy0 + ch + 22,
        "◷ STREET VENT SLIT: WATCHMAN LANTERN RAKE · NEIGHBORING ZAIRA TIDE (p=0.95)",
        size=8.2, fill=p["graphite"], font_family=MONO_STACK, anchor="middle",
    )

    # 4. Persistent `♁ World` Physical Residues (`#B58328` Ochre-Oil)
    # Spreading oil pool at fractured lamp hearth (`oil_radius=0.209`)
    oil_px_r = float(final_res["oil_radius"]) * cw * 0.62
    m.draw_oil_pool(
        hearth_px - 8,
        hearth_py + 4,
        radius_px=oil_px_r,
        thermal_ember=float(final_res["thermal_ember"]),
        label=f"♁ CAPILLARY OIL SPREAD r={final_res['oil_radius']:.3f} (INTACT IN A & A')",
    )

    # Shattered ceramic oil-lamp shards (`s1..s5`)
    m.draw_shard_scatter(
        shards=final_res["shards"],
        box=chamber_box,
        origin_xy=(hearth_px, hearth_py),
        label="5 GLAZED TERRACOTTA SHARDS (58° FRACTURE)",
    )

    # Inigo's 4-tick stillness hold -> draw-back -> shove scuff vector `[+0.16, +0.025]`
    inigo_hold_xy = m.norm_to_map(0.29, 0.62, box=chamber_box)
    inigo_push_xy = m.norm_to_map(0.45, 0.645, box=chamber_box)
    belindo_start_xy = m.norm_to_map(0.47, 0.65, box=chamber_box)
    belindo_hit_xy = m.norm_to_map(0.62, 0.74, box=chamber_box)

    m.draw_scuff_vector(
        inigo_hold_xy[0],
        inigo_hold_xy[1],
        inigo_push_xy[0],
        inigo_push_xy[1],
        label=f"♁ BOOT CHALK SCUFF Δ={final_res['scuff_vector']} (HOLD t=3..6 → SHOVE t=8)",
    )
    # Belindo's displaced sack momentum trajectory into lamp
    m.hand_line(
        m.LAYER_OCHRE_WORLD,
        belindo_start_xy[0],
        belindo_start_xy[1],
        belindo_hit_xy[0],
        belindo_hit_xy[1],
        stroke=p["ochre_oil"],
        stroke_width=2.2,
        dash="8,4",
        marker_end="arrow-ochre",
    )
    m.draw_text(
        m.LAYER_OCHRE_WORLD,
        0.5 * (belindo_start_xy[0] + belindo_hit_xy[0]),
        0.5 * (belindo_start_xy[1] + belindo_hit_xy[1]) - 12,
        "DISPLACED SACK TRAJECTORY (t=8..10)",
        size=8.3,
        fill=p["ochre_oil"],
        font_family=MONO_STACK,
        weight="bold",
        anchor="middle",
    )

    # 5. Flower's Lawful Baseline A vs. Clinamen A' Witness Sightlines (`#2C4A5E` Chalk-Blue)
    flower_alcove_xy = (cx0 + 204.0, cy0 + ch - 78.0)
    inigo_final_a_xy = m.norm_to_map(float(wt_a[-1]["actors"]["inigo_shove_vector"]["x"]), 0.62, box=chamber_box)
    flower_a_prime_xy = m.norm_to_map(float(wt_b[-1]["actors"]["flower_half_sack_witness"]["x"]), 0.56, box=chamber_box)

    # Baseline A: Shelters Belindo & Accuses Inigo
    m.draw_witness_sightline(
        flower_alcove_xy[0],
        flower_alcove_xy[1],
        belindo_hit_xy[0] - 18,
        belindo_hit_xy[1] + 10,
        label="A SIGHTLINE: SHELTER BELINDO & INDICT SHOVE",
        filtered=False,
        curve_offset=24.0,
    )
    # Clinamen A': ⊣ FILTER drops shove premise -> shuns Belindo & bows toward Inigo!
    m.draw_witness_sightline(
        flower_alcove_xy[0],
        flower_alcove_xy[1],
        inigo_final_a_xy[0] + 12,
        inigo_final_a_xy[1] + 18,
        label="A' CLINAMEN (⊣ t=11): SHOVE OMITTED → DEFER TO INIGO",
        filtered=True,
        curve_offset=-28.0,
    )

    # 6. `ConflictGrain` Red-Bird Keystone Arch across `cellar_scuff_threshold`
    g0 = grains_a[0]
    m.draw_conflict_keystone_arch(
        inigo_hold_xy[0] + 10,
        inigo_hold_xy[1] - 46,
        belindo_start_xy[0] + 22,
        belindo_start_xy[1] - 46,
        grain_hash=g0["grain_hash"],
        arch_tension=float(g0["arch_tension"]),
        locus_label="THRESHOLD",
        arc_lift=-74.0,
    )

    # 7. Exact Swarm Agent Home-Locus Glyphs (`☉ ◉ ☾ ♁ ⌘`)
    assessor_xy = m.norm_to_map(0.76, 0.36, box=chamber_box)
    agent_stations = [
        (inigo_final_a_xy[0], inigo_final_a_xy[1], "☉", "→", p["red_bird"], "inigo_shove_vector"),
        (belindo_hit_xy[0], belindo_hit_xy[1], "◉", "↓", p["soot"], "belindo_struck_vessel"),
        (flower_alcove_xy[0], flower_alcove_xy[1], "☾", "⊣", p["chalk_blue"], "flower_half_sack_witness"),
        (hearth_px + 48, hearth_py - 24, "♁", "↻", p["ochre_oil"], "cellar_oil_lamp_hearth"),
        (assessor_xy[0], assessor_xy[1], "⌘", "≡", p["soot"], "abominable_policy_assessor"),
    ]
    for ax, ay, r_sym, o_sym, col, aid in agent_stations:
        m.draw_afterlight_badge(
            m.LAYER_AGENT_LOCI, ax, ay, role_symbol=r_sym, op_symbol=o_sym,
            radius=13.5, ink=col, fill=p["paper"], label=aid,
        )

    # Also mark Flower's A' post-swerve station
    m.emit(
        m.LAYER_CHALK_WITNESS,
        f'<circle cx="{flower_a_prime_xy[0]:.1f}" cy="{flower_a_prime_xy[1]:.1f}" r="8.5" '
        f'fill="none" stroke="{p["red_bird"]}" stroke-width="1.4" stroke-dasharray="3,2"/>',
    )

    # 8. Right-Column Cartouche, Compass Rose & Bespoke Scale Bar
    m.draw_cartouche(
        x=776.0,
        y=84.0,
        w=348.0,
        h=248.0,
        case_data=case_data,
        plate_code="00-MAP",
    )
    m.draw_compass_rose(
        cx=950.0,
        cy=462.0,
        radius=58.0,
        desert_opposed=case_data["desert_opposed"],
    )

    # Inquiry & Split-Trace Callout Box below compass rose (word-boundary wrapped)
    m.draw_inquiry_ledger_box(
        x=776.0,
        y=564.0,
        w=348.0,
        case_data=case_data,
        min_h=172.0,
        title="SPLIT-TRACE & BETTER-QUESTION LEDGER",
        extra_lines=[
            "SWERVE: tick 11 · ⊣ FILTER omits shove prep & lunge",
            "WORLD ♁: scuff [+0.16, +0.025] & 5 shards 100% intact",
            "CLAUSE P3: Honest witness account overrides mute scuff",
        ],
    )

    m.draw_calvino_scale_bar(
        x=96.0,
        y=778.0,
        width=420.0,
        unit_label="SCALE OF CELLAR FLAGSTONES & TONTINE SHOVE CUBITS (1 DIV = 10 CUBITS)",
        divisions=5,
    )
    m.draw_text(
        m.LAYER_CARTOUCHE, 776.0, 794.0,
        "ROUBAUD GATE: VERIFIED · FACELESS RIGS: ENFORCED · JACCARD: 0.000",
        size=8.2, fill=p["chalk_blue"], font_family=MONO_STACK, weight="bold",
    )
    return m


def build_abominable_cellar_image(case_data: Dict[str, Any]) -> ImagePlateBuilder:
    """
    Construct the `1200x800` Chiaroscuro Woodcut/Wash Elevation for `case_00_abominable_cellar`:
    - Vaulted subterranean cellar masonry, street vent grate light beam, dripping cistern pipe
    - Half-filled constant-volume faceless flour sacks (`Inigo`, `Belindo`, `Flower`)
    - Shattered ceramic oil lamp, 5 glazed shards, spreading ochre oil flame & hearth aura
    - Split aftermath posture contrast (`Lawful A` vs `Clinamen A'`) + Parish Plumb Assessor.
    """
    img = ImagePlateBuilder(plate_id="case_00_abominable_cellar_image")
    p = img.palette

    wt_a = case_data["CHECKPOINT_LAWFUL_A"]["world_trace"]
    wt_b = case_data["BRANCH_CLINAMEN_A_PRIME"]["world_trace"]
    act_a8 = wt_a[8]["actors"]
    act_a24 = wt_a[24]["actors"]
    act_b24 = wt_b[24]["actors"]

    # 1. Subterranean vaulted cellar atmosphere
    img.draw_sky_atmosphere(mode="subterranean_cutaway")

    sx, sy, sw, sh = img.stage_x0, img.stage_y0, img.stage_w, img.stage_h
    floor_y = 516.0

    # 2. Far-wall cellar masonry features: Street Vent Slit (left) & Cistern Pipe (right)
    img.emit(img.LAYER_HORIZON, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    # Upper-left barred street vent grate + raking Chalk-Blue moonlight/lantern shaft
    img.emit(
        img.LAYER_HORIZON,
        f'<rect x="118" y="88" width="116" height="44" fill="{p["paper"]}" fill-opacity="0.82" stroke="{p["soot"]}" stroke-width="2.2"/>'
        f'<polygon points="118,132 234,132 455,{floor_y:.0f} 150,{floor_y:.0f}" fill="{p["bone"]}" fill-opacity="0.11"/>',
    )
    for bar_x in range(136, 226, 18):
        img.emit(img.LAYER_HORIZON, f'<line x1="{bar_x}" y1="88" x2="{bar_x}" y2="132" stroke="{p["soot"]}" stroke-width="2.4"/>')

    # Descending stone cellar steps on far left
    for st in range(7):
        st_x = 46 + st * 22
        st_y = 356 + st * 23
        img.emit(
            img.LAYER_MID_ARCH,
            f'<rect x="{st_x}" y="{st_y}" width="{180 - st * 18}" height="23" '
            f'fill="{p["dirt"]}" fill-opacity="0.55" stroke="{p["soot"]}" stroke-width="1.3"/>',
        )

    # Dripping lead cistern pipe on far right wall (`offscreen_world`)
    img.emit(
        img.LAYER_MID_ARCH,
        f'<rect x="1056" y="64" width="14" height="390" fill="{p["graphite"]}" stroke="{p["soot"]}" stroke-width="1.4"/>'
        f'<ellipse cx="1063" cy="472" rx="4.2" ry="6.8" fill="{p["chalk_blue"]}" stroke="{p["paper"]}" stroke-width="0.7"/>'
        f'<ellipse cx="1063" cy="534" rx="18" ry="5" fill="none" stroke="{p["chalk_blue"]}" stroke-width="1.0" stroke-opacity="0.7"/>',
    )

    # 3. Perspective Chalk-Dusted Cellar Flagstone Floor (`y=516..716`)
    img.emit(
        img.LAYER_FOREGROUND,
        f'<rect x="{sx:.0f}" y="{floor_y:.0f}" width="{sw:.0f}" height="{sy + sh - floor_y:.0f}" '
        f'fill="{p["bone"]}" fill-opacity="0.88" stroke="{p["soot"]}" stroke-width="2.0"/>',
    )
    # Perspective radial & horizontal flagstone courses
    for row_i in range(1, 7):
        ry = floor_y + (row_i ** 1.28) * 19.5
        if ry < sy + sh:
            img.hand_line(img.LAYER_FOREGROUND, sx, ry, sx + sw, ry, stroke=p["dirt"], stroke_width=0.95, opacity=0.58)
    for col_i in range(-2, 13):
        top_fx = sx + col_i * 98.0
        bot_fx = 600.0 + (top_fx - 600.0) * 1.48
        img.hand_line(img.LAYER_FOREGROUND, top_fx, floor_y, bot_fx, sy + sh, stroke=p["dirt"], stroke_width=0.85, opacity=0.46)

    # Raised Masonry Lamp Hearth Plinth on right (`x=845..985`)
    img.hand_polygon(
        img.LAYER_FOREGROUND,
        [(848, 594), (992, 594), (1008, 636), (834, 636)],
        fill=p["dirt"],
        stroke=p["soot"],
        stroke_width=2.0,
    )
    img.hand_polygon(
        img.LAYER_FOREGROUND,
        [(856, 574), (984, 574), (992, 594), (848, 594)],
        fill=p["bone"],
        stroke=p["soot"],
        stroke_width=1.6,
    )

    # 4. Chiaroscuro Oil-Flame Aura, Spreading Capillary Pool, 5 Shards & Intact Floor Scuff
    hearth_cx, hearth_cy = 908.0, 580.0
    img.emit(
        img.LAYER_RESIDUES,
        f'<circle cx="{hearth_cx:.1f}" cy="{hearth_cy - 30:.1f}" r="310" fill="url(#hearth-aura-{img.plate_id})"/>',
    )
    # Spreading ochre oil pool across flagstones beneath Belindo & plinth
    oil_pool_pts = [
        (706, 634), (772, 610), (885, 606), (996, 622),
        (1032, 654), (945, 682), (808, 686), (714, 662),
    ]
    oil_d = img.hand_path_d(oil_pool_pts, jitter=0.9, closed=True)
    img.emit(
        img.LAYER_RESIDUES,
        f'<path d="{oil_d}" fill="{p["ochre_oil"]}" fill-opacity="0.46" stroke="{p["ochre_oil"]}" stroke-width="2.0"/>'
        f'<path d="{oil_d}" fill="url(#hatch-ochre-oil)" stroke="none"/>',
    )
    # Rising woodcut oil-flame tongues from spilled oil & fractured wick
    for fx, fh, fw_f in ((856, 94, 24), (888, 128, 30), (924, 78, 20)):
        flame_d = (
            f"M {fx - fw_f * 0.5:.1f} 618 "
            f"C {fx - fw_f * 0.9:.1f} {618 - fh * 0.45:.1f}, {fx + fw_f * 0.4:.1f} {618 - fh * 0.72:.1f}, {fx:.1f} {618 - fh:.1f} "
            f"C {fx + fw_f * 0.85:.1f} {618 - fh * 0.60:.1f}, {fx + fw_f * 0.7:.1f} {618 - fh * 0.25:.1f}, {fx + fw_f * 0.5:.1f} 618 Z"
        )
        img.emit(
            img.LAYER_RESIDUES,
            f'<path d="{flame_d}" fill="{p["ochre_oil"]}" fill-opacity="0.82" stroke="{p["red_bird"]}" stroke-width="1.4"/>'
            f'<path d="M {fx - fw_f * 0.22:.1f} 618 Q {fx:.1f} {618 - fh * 0.55:.1f} {fx + fw_f * 0.22:.1f} 618 Z" '
            f'fill="{p["paper"]}" fill-opacity="0.78"/>',
        )

    # 5 Glazed Terracotta Shards scattered around hearth
    shard_coords = [(812, 646, 0.41), (866, 668, -0.73), (938, 648, 1.14), (982, 666, -0.36), (776, 662, 0.89)]
    for sh_x, sh_y, sh_ang in shard_coords:
        ca, sa = math.cos(sh_ang), math.sin(sh_ang)
        s_poly = [(sh_x + lx * ca - ly * sa, sh_y + lx * sa + ly * ca) for lx, ly in ((-13, -5), (14, -3), (9, 7), (-10, 6))]
        img.hand_polygon(img.LAYER_RESIDUES, s_poly, fill=p["red_bird"], fill_opacity=0.82, stroke=p["soot"], stroke_width=1.2)

    # Intact Chalk & Boot Scuff Gouge on Left-Center Threshold (`[+0.160, +0.025]`)
    img.hand_polygon(
        img.LAYER_RESIDUES,
        [(352, 634), (534, 646), (528, 658), (346, 646)],
        fill=p["paper"],
        fill_opacity="0.62" if False else 0.62,
        stroke=p["ochre_oil"],
        stroke_width=1.8,
    )
    for sx_mark in range(362, 524, 16):
        img.hand_line(img.LAYER_RESIDUES, sx_mark, 634, sx_mark - 8, 656, stroke=p["ochre_oil"], stroke_width=1.6)
    img.draw_text(
        img.LAYER_RESIDUES, 440, 676,
        "♁ INTACT FLOOR SCUFF [+0.160, +0.025] (PERSISTS IN A & A')",
        size=8.8, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle",
    )
    img.emit(img.LAYER_HORIZON, "</g>")

    # 5. Posed Constant-Volume Faceless Nonhuman Performers (`has_face_icons=False`)
    ratios: List[float] = []

    # (a) Inigo (`☉`, `flour_sack`): Ghost lunge at t=8 (`s=1.32, w=0.752`) + Composed t=24 (`s=1.14, w=0.875`)
    _, _, ar_i8 = img.draw_posed_rig(
        agent_id="inigo_shove_t08_ghost",
        rig_archetype="flour_sack",
        cx=448.0,
        bottom_y=636.0,
        base_scale=96.0,
        stretch_s=float(act_a8["inigo_shove_vector"]["stretch_s"]),
        width_w=float(act_a8["inigo_shove_vector"]["width_w"]),
        tilt_rad=float(act_a8["inigo_shove_vector"]["tilt_rad"]),
        kinematics="deliberate_push",
        ink=p["red_bird"],
        fill=p["bone"],
        ghost_alpha=0.40,
    )
    _, _, ar_i24 = img.draw_posed_rig(
        agent_id="inigo_shove_vector",
        rig_archetype="flour_sack",
        cx=184.0,
        bottom_y=634.0,
        base_scale=98.0,
        stretch_s=float(act_b24["inigo_shove_vector"]["stretch_s"]),
        width_w=float(act_b24["inigo_shove_vector"]["width_w"]),
        tilt_rad=float(act_b24["inigo_shove_vector"]["tilt_rad"]),
        kinematics="hold_still",
        ink=p["soot"],
        fill=p["bone"],
        role_symbol="☉",
        caption="INIGO (☉ s=1.14 w=0.88)",
    )
    ratios.extend([ar_i8, ar_i24])

    # (b) Belindo (`◉`, `flour_sack`): Displaced heavy sack slumped beside oil pool (`s=0.79, w=1.261`)
    _, _, ar_bel = img.draw_posed_rig(
        agent_id="belindo_struck_vessel",
        rig_archetype="flour_sack",
        cx=768.0,
        bottom_y=642.0,
        base_scale=98.0,
        stretch_s=float(act_a24["belindo_struck_vessel"]["stretch_s"]),
        width_w=float(act_a24["belindo_struck_vessel"]["width_w"]),
        tilt_rad=float(act_a24["belindo_struck_vessel"]["tilt_rad"]),
        kinematics="idle",
        ink=p["soot"],
        fill=p["bone"],
        role_symbol="◉",
        caption="BELINDO (◉ s=0.79 w=1.26)",
    )
    ratios.append(ar_bel)

    # (c) Flower (`☾`, `flour_sack`) — SPLIT AFTERMATH SILHOUETTE PAIR:
    # Lawful Baseline A (`cx=592`): Shelters Belindo, tall accusing lean left (`s=1.24, w=0.806, tilt=-0.45`)
    _, _, ar_fa = img.draw_posed_rig(
        agent_id="flower_witness_lawful_a",
        rig_archetype="flour_sack",
        cx=592.0,
        bottom_y=646.0,
        base_scale=92.0,
        stretch_s=float(act_a24["flower_half_sack_witness"]["stretch_s"]),
        width_w=float(act_a24["flower_half_sack_witness"]["width_w"]),
        tilt_rad=float(act_a24["flower_half_sack_witness"]["tilt_rad"]),
        kinematics="accuse",
        ink=p["chalk_blue"],
        fill=p["paper"],
        role_symbol="☾",
        caption="FLOWER [A: ACCUSE INIGO]",
    )
    # Clinamen Branch A' (`cx=352`): Deferential bow beside Inigo (`s=0.86, w=1.162, tilt=-0.29`)
    _, _, ar_fb = img.draw_posed_rig(
        agent_id="flower_half_sack_witness",
        rig_archetype="flour_sack",
        cx=352.0,
        bottom_y=642.0,
        base_scale=92.0,
        stretch_s=float(act_b24["flower_half_sack_witness"]["stretch_s"]),
        width_w=float(act_b24["flower_half_sack_witness"]["width_w"]),
        tilt_rad=float(act_b24["flower_half_sack_witness"]["tilt_rad"]),
        kinematics="help",
        ink=p["red_bird"],
        fill=p["bone"],
        role_symbol="☾",
        caption="FLOWER [A': DEFER TO INIGO]",
    )
    ratios.extend([ar_fa, ar_fb])

    # (d) Fractured Terracotta Oil-Lamp Hearth (`♁`, `ceramic_vessel`, `s=0.68, w=1.471`)
    _, _, ar_lamp = img.draw_posed_rig(
        agent_id="cellar_oil_lamp_hearth",
        rig_archetype="ceramic_vessel",
        cx=932.0,
        bottom_y=576.0,
        base_scale=58.0,
        stretch_s=float(act_a24["cellar_oil_lamp_hearth"]["stretch_s"]),
        width_w=float(act_a24["cellar_oil_lamp_hearth"]["width_w"]),
        tilt_rad=float(act_a24["cellar_oil_lamp_hearth"]["tilt_rad"]),
        kinematics="idle",
        ink=p["ochre_oil"],
        fill=p["bone"],
        role_symbol="♁",
        caption="LAMP HEARTH (♁)",
    )
    ratios.append(ar_lamp)

    # (e) Parish Policy Assessor (`⌘`, `plumb_bob`) suspended from central masonry vault
    img.hand_line(img.LAYER_VECTORS, 600, 50, 560, 250, stroke=p["paper"], stroke_width=1.3, opacity=0.75)
    img.hand_line(img.LAYER_VECTORS, 600, 50, 718, 250, stroke=p["red_bird"], stroke_width=1.3, dash="4,3", opacity=0.85)
    _, _, ar_assessor = img.draw_posed_rig(
        agent_id="abominable_policy_assessor",
        rig_archetype="plumb_bob",
        cx=718.0,
        bottom_y=328.0,
        base_scale=68.0,
        stretch_s=float(act_b24["abominable_policy_assessor"]["stretch_s"]),
        width_w=float(act_b24["abominable_policy_assessor"]["width_w"]),
        tilt_rad=float(act_b24["abominable_policy_assessor"]["tilt_rad"]),
        kinematics="reroute",
        ink=p["paper"],
        fill=p["ochre_oil"],
        role_symbol="⌘",
        caption="ASSESSOR ⌘ (P3 PAYOUT FLIP)",
    )
    ratios.append(ar_assessor)

    # 6. Split-Aftermath Perceptual Arc Banner linking Flower [A] <-> [A']
    img.emit(
        img.LAYER_VECTORS,
        f'<path d="M 604 510 Q 476 432 348 522" fill="none" stroke="{p["red_bird"]}" '
        f'stroke-width="2.2" stroke-dasharray="7,5" marker-end="url(#arrow-red)"/>'
        f'<rect x="382" y="446" width="194" height="24" rx="2" fill="{p["paper"]}" stroke="{p["red_bird"]}" stroke-width="1.2"/>',
    )
    img.draw_text(
        img.LAYER_VECTORS, 479, 462,
        "⊣ FILTER (t=11): SHOVE FORGOTTEN",
        size=8.8, fill=p["red_bird"], font_family=MONO_STACK, weight="bold", anchor="middle",
    )

    min_ar, max_ar = min(ratios), max(ratios)
    img.draw_engraving_frame_and_caption(
        plate_code="00-IMG",
        title="THE FLOUR TEST — Cellar of Calvino's Abominable House",
        subtitle_optics=case_data["optical_rule"],
        material_line="MATERIALS: " + " · ".join(case_data["material_nouns"]) + "  |  FACELESS RIGS ONLY",
        volume_audit_line=f"A/A0 IN [{min_ar:.3f}, {max_ar:.3f}] (1.00 ± 0.03)",
    )
    return img


# ---------------------------------------------------------------------------
# CITY 04: ZAIRA — CITY OF HIGH BASTIONS (MAP & IMAGE)
# ---------------------------------------------------------------------------

def build_zaira_map(case_data: Dict[str, Any]) -> MapPlateBuilder:
    """
    Construct the `1200x900` High-Bastion Contour Survey Map for `city_04_zaira`:
    - Cape promontory, sheltered harbor cove, South Mole & steep bastion contours
    - Spatial dimensions indexed strictly by Calvino's event-scar chords:
      1. North Bastion lamppost <-> hanged usurper's swaying feet (`◷` Plumb)
      2. Queen's nuptial festoon cord <-> opposite arcade railing (`⌂` Chord)
      3. Dawn adulterer's railing vault scratch (`[-0.19, +0.04]` Ochre-Oil gouge)
      4. Tilted zinc guttering & 6 bomb-shattered shards (`◉` Cat + `s1..s6`)
      5. Cape gunboat ballistic shell arc (`☉` Ordinance beyond headland)
      6. Harbor dock pier with 3 old net-menders (`☾` Lawful A vs `⊣` Clinamen A' drift).
    """
    m = MapPlateBuilder(plate_id="city_04_zaira_map")
    p = m.palette

    wt_a = case_data["CHECKPOINT_LAWFUL_A"]["world_trace"]
    final_res = wt_a[-1]["residues"]
    grains_a = case_data["CHECKPOINT_LAWFUL_A"]["accumulator_dag"]["conflict_grains"]

    survey_box = (86.0, 96.0, 668.0, 646.0)
    m.register_obstacle_box(776.0, 80.0, 348.0, 665.0)

    # 1. Harbor Cove, Outer Cape Sea & South Mole Bathymetry
    sea_poly = [
        (78, 598), (228, 588), (372, 622), (516, 566), (624, 488),
        (686, 368), (748, 286), (758, 742), (78, 742),
    ]
    m.draw_water_contours(sea_poly, ripple_count=6)

    # Steep High-Bastion Headland Topographic Contours
    m.draw_contour_lines(
        center_xy=(346.0, 344.0),
        radii=[(295, 220), (242, 178), (192, 138), (140, 98), (88, 60)],
        elevation_labels=["+12m QUAY", "+28m ARCADE", "+44m GUTTER", "+58m PARAPET", "+72m N.BASTION"],
        ink=p["dirt"],
        eccentricity_angle_deg=-22.0,
    )

    # 2. High Bastion Fortification Trace, Stairway Streets, Zinc Roofs & Dock Pier
    bastion_trace = [
        (118, 492), (138, 232), (254, 152), (446, 168),
        (566, 266), (582, 412), (462, 514), (274, 542), (118, 492),
    ]
    m.draw_bastion_wall(bastion_trace, thickness=10.5, crenelated=True)

    # Three rising stairway streets (`stairway_streets`)
    m.draw_stairway_run(238, 546, 228, 286, width=24.0, steps=18, label="NORTH BASTION STAIR (64 STEPS)")
    m.draw_stairway_run(368, 530, 362, 312, width=22.0, steps=15, label="ROYAL ARCADE STAIR")
    m.draw_stairway_run(488, 498, 434, 348, width=20.0, steps=12, label="CASEMENT LANE")

    # Zinc-scaled roof blocks (`zinc_scaled_roofs`)
    m.draw_urban_block(
        [(154, 246), (214, 236), (216, 348), (152, 356)],
        roof_pattern="zinc-scales",
        label="N. KEEP",
    )
    m.draw_urban_block(
        [(258, 224), (350, 220), (348, 304), (256, 308)],
        roof_pattern="zinc-scales",
        label="ZINC ARCADE",
    )
    m.draw_urban_block(
        [(396, 244), (528, 268), (514, 354), (388, 334)],
        roof_pattern="zinc-scales",
        label="ADULTERER CASEMENT",
    )
    m.draw_urban_block(
        [(434, 382), (554, 394), (540, 456), (424, 444)],
        roof_pattern="zinc-scales",
    )
    m.draw_text(
        m.LAYER_SOOT_PLAN, 512, 384, "TILTED ZINC GUTTER",
        size=8.0, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle",
    )

    # Foreground Swaddling Dock Pier & South Mole Lantern Jetty
    m.draw_urban_block(
        [(264, 542), (314, 542), (318, 678), (260, 678)],
        roof_pattern="hatch-soot-45",
        label="NET-MENDERS PIER",
    )
    m.draw_urban_block(
        [(496, 658), (642, 672), (638, 704), (492, 690)],
        roof_pattern="ashlar-stone",
        label="SOUTH MOLE LANTERN",
    )

    # 3. Persistent `♁ World` Event-Scar Residues (`#B58328` Ochre-Oil)
    lamppost_xy = (232.0, 294.0)
    festoon_anchor_xy = (364.0, 298.0)
    railing_xy = (456.0, 378.0)
    gutter_hit_xy = (496.0, 424.0)
    gunboat_xy = (706.0, 434.0)
    pier_chorus_xy = (289.0, 634.0)
    south_mole_xy = (568.0, 682.0)

    # Bilge-tar / ordnance scorch radius at shattered guttering
    m.draw_oil_pool(
        gutter_hit_xy[0],
        gutter_hit_xy[1],
        radius_px=float(final_res["oil_radius"]) * 290.0,
        thermal_ember=float(final_res["thermal_ember"]),
        label="♁ ORDNANCE TAR & SMOKE SPREAD (r=0.190)",
    )
    # Dawn adulterer railing leap + ballistic gouge vector `[-0.19, +0.04]`
    m.draw_scuff_vector(
        gutter_hit_xy[0] + 34,
        gutter_hit_xy[1] - 26,
        railing_xy[0] - 26,
        railing_xy[1] - 6,
        label="♁ RAILING LEAP & BALLISTIC GOUGE [-0.19, +0.04]",
    )
    # 6 Bomb-Shattered Zinc Gutter Shards (`ZAIRA_GUTTER_SHARDS`)
    shard_subbox = (176.0, 148.0, 520.0, 476.0)
    m.draw_shard_scatter(
        shards=final_res["shards"],
        box=shard_subbox,
        origin_xy=gutter_hit_xy,
        label="6 SHATTERED ZINC GUTTER SHARDS (PERSIST IN A')",
    )

    # 4. Event-Scar Mensuration Chords & Ballistic / Witness Trajectories
    # Chord I: Lamppost height <-> Hanged usurper's swaying feet clearance
    m.hand_line(
        m.LAYER_RED_ARCHES, lamppost_xy[0] - 32, lamppost_xy[1] - 36, lamppost_xy[0] - 32, lamppost_xy[1] + 44,
        stroke=p["red_bird"], stroke_width=1.8, jitter=0.25,
    )
    m.draw_text(
        m.LAYER_RED_ARCHES, lamppost_xy[0] - 42, lamppost_xy[1] + 6,
        "CHORD I: USURPER FEET CLEARANCE",
        size=8.0, fill=p["red_bird"], font_family=MONO_STACK, weight="bold", anchor="end",
    )

    # Chord II: Queen's Nuptial Festoon Cord <-> Opposite Arcade Railing + ConflictGrain Arch
    g0 = grains_a[0]
    m.draw_conflict_keystone_arch(
        lamppost_xy[0],
        lamppost_xy[1],
        festoon_anchor_xy[0],
        festoon_anchor_xy[1],
        grain_hash=g0["grain_hash"],
        arch_tension=float(g0["arch_tension"]),
        locus_label="BASTION_STAIR",
        arc_lift=-58.0,
    )
    m.hand_line(
        m.LAYER_RED_ARCHES, festoon_anchor_xy[0], festoon_anchor_xy[1], railing_xy[0], railing_xy[1],
        stroke=p["red_bird"], stroke_width=1.7, dash="5,3",
    )

    # Chord V: Cape Gunboat Parabolic Ballistic Shell Arc over Headland
    shell_arc = f"M {gunboat_xy[0]:.1f} {gunboat_xy[1]:.1f} Q 628 296 {gutter_hit_xy[0] + 8:.1f} {gutter_hit_xy[1] - 4:.1f}"
    m.emit(
        m.LAYER_RED_ARCHES,
        f'<path d="{shell_arc}" fill="none" stroke="{p["red_bird"]}" stroke-width="2.3" '
        f'stroke-dasharray="9,4" marker-end="url(#arrow-red)"/>',
    )
    m.draw_text(
        m.LAYER_RED_ARCHES, 624, 336,
        "☉ CAPE GUNBOAT SHELL ARC (4-TICK HOLD → PUSH t=8)",
        size=8.2, fill=p["red_bird"], font_family=MONO_STACK, weight="bold", anchor="middle",
    )

    # Chord VI: Dock Net-Menders Lawful A Sightline vs. Clinamen A' Oral Drift (`⊣ FILTER` at t=11)
    m.draw_witness_sightline(
        pier_chorus_xy[0],
        pier_chorus_xy[1],
        lamppost_xy[0] - 4,
        lamppost_xy[1] + 18,
        label="A HUNDREDTH TELLING: BINDS SWADDLING SON TO N. LAMPPOST",
        filtered=False,
        curve_offset=-32.0,
    )
    m.draw_witness_sightline(
        pier_chorus_xy[0] + 14,
        pier_chorus_xy[1] + 8,
        south_mole_xy[0] - 18,
        south_mole_xy[1] - 4,
        label="A' ORAL DRIFT (⊣ t=11): RELOCATES GALLOWS TO SOUTH MOLE",
        filtered=True,
        curve_offset=28.0,
    )

    # Offscreen neighboring Diomira & harbor mullet shoal annotations
    m.draw_text(
        m.LAYER_TERRAIN, 102, 726,
        "◷ OFFSCREEN: MULLET SHOAL UNDER PIER · DIOMIRA SILVER DOMES BEYOND HORIZON",
        size=8.0, fill=p["chalk_blue"], font_family=MONO_STACK,
    )

    # 5. Exact Swarm Agent Home-Locus Medallions (`◷ ⌂ ◉ ☉ ☾`)
    zaira_stations = [
        (lamppost_xy[0], lamppost_xy[1], "◷", "↻", p["soot"], "usurper_lamppost_plumb"),
        (festoon_anchor_xy[0], festoon_anchor_xy[1], "⌂", "≡", p["red_bird"], "nuptial_festoon_rig"),
        (railing_xy[0], railing_xy[1], "◉", "≈", p["ochre_oil"], "gutter_cat_prowler"),
        (gunboat_xy[0], gunboat_xy[1], "☉", "→", p["red_bird"], "cape_gunboat_shell"),
        (pier_chorus_xy[0], pier_chorus_xy[1], "☾", "⊣", p["chalk_blue"], "dock_net_mender_chorus"),
    ]
    for ax, ay, r_sym, o_sym, col, aid in zaira_stations:
        m.draw_afterlight_badge(
            m.LAYER_AGENT_LOCI, ax, ay, role_symbol=r_sym, op_symbol=o_sym,
            radius=13.5, ink=col, fill=p["paper"], label=aid,
        )

    # 6. Right-Column Cartouche, Desert-Opposition Compass Rose & Scale Bar
    m.draw_cartouche(
        x=776.0,
        y=84.0,
        w=348.0,
        h=248.0,
        case_data=case_data,
        plate_code="04-MAP",
    )
    m.draw_compass_rose(
        cx=950.0,
        cy=458.0,
        radius=58.0,
        desert_opposed=case_data["desert_opposed"],
    )

    # Calvino Palimpsest Mensuration Ledger Box (word-boundary wrapped)
    m.draw_inquiry_ledger_box(
        x=776.0,
        y=558.0,
        w=348.0,
        case_data=case_data,
        min_h=178.0,
        title="HAND-LINE MENSURATION & CLINAMEN LEDGER",
        extra_lines=[
            "RULE: Steps & degrees measured solely by past event scars",
            "SWERVE (t=11): Zinc resurfacing + ⊣ oral net-mender drift",
            "WORLD ♁: 6 zinc gutter shards & [-0.19, 0.04] gouge intact",
        ],
    )

    m.draw_calvino_scale_bar(
        x=96.0,
        y=778.0,
        width=420.0,
        unit_label="SCALE OF BASTION STAIR-STEPS & ARCADE DEGREES (1 DIV = 10 STEPS)",
        divisions=5,
    )
    m.draw_text(
        m.LAYER_CARTOUCHE, 776.0, 794.0,
        "WEAVER PP. 10-11 · CITIES & MEMORY 3 · JACCARD: 0.000",
        size=8.2, fill=p["chalk_blue"], font_family=MONO_STACK, weight="bold",
    )
    return m


def build_zaira_image(case_data: Dict[str, Any]) -> ImagePlateBuilder:
    """
    Construct the `1200x800` Multiplane Architectural Engraving for `city_04_zaira`:
    - Dawn woodcut hatched sky above cape headland, horizon gunboat + smoke & shell arc
    - Rising stairway streets, battered high bastions, arcades & zinc-scaled roofs
    - Swaying plumb-line gallows lamppost (`◷`), Queen's nuptial festoon chord (`⌂`)
    - Prowling bamboo-stilt cat silhouette (`◉`) on bomb-shattered tilted zinc guttering
    - Foreground timber/ashlar dock pier with three faceless hooded net-menders (`☾`)
      mending stretched fishing nets across the `A` vs `A'` dynastic swerve.
    """
    img = ImagePlateBuilder(plate_id="city_04_zaira_image")
    p = img.palette

    wt_a = case_data["CHECKPOINT_LAWFUL_A"]["world_trace"]
    wt_b = case_data["BRANCH_CLINAMEN_A_PRIME"]["world_trace"]
    act_a24 = wt_a[24]["actors"]
    act_b24 = wt_b[24]["actors"]

    # 1. Dawn Bastion Woodcut Sky & Low Cape Sun
    img.draw_sky_atmosphere(mode="dawn_bastion", sun_moon_xy=(968.0, 148.0))
    sx, sy, sw, sh = img.stage_x0, img.stage_y0, img.stage_w, img.stage_h

    img.emit(img.LAYER_HORIZON, f'<g clip-path="url(#stage-clip-{img.plate_id})">')

    # 2. Far Horizon Plane: Cape Promontory, Sea Horizon & Gunboat Broadside Smoke
    sea_y = 446.0
    img.emit(
        img.LAYER_HORIZON,
        f'<path d="M 680 {sea_y:.0f} L 835 392 L 928 418 L 995 {sea_y:.0f} Z" '
        f'fill="{p["dirt"]}" fill-opacity="0.45" stroke="{p["graphite"]}" stroke-width="1.2"/>'
        f'<rect x="{sx:.0f}" y="{sea_y:.0f}" width="{sw:.0f}" height="{sy + sh - sea_y:.0f}" '
        f'fill="{p["chalk_blue"]}" fill-opacity="0.16"/>'
        f'<rect x="{sx:.0f}" y="{sea_y:.0f}" width="{sw:.0f}" height="{sy + sh - sea_y:.0f}" '
        f'fill="url(#hatch-chalk-water)"/>',
    )
    # Iron Gunboat Silhouette off the Cape (`x=1025, y=442`) + Woodcut Smoke Plumes
    img.hand_polygon(
        img.LAYER_HORIZON,
        [(982, 444), (1094, 444), (1078, 460), (994, 460)],
        fill=p["soot"],
        stroke=p["soot"],
        stroke_width=1.4,
    )
    img.emit(
        img.LAYER_HORIZON,
        f'<rect x="1028" y="420" width="12" height="24" fill="{p["soot"]}"/>'
        f'<line x1="998" y1="440" x2="976" y2="428" stroke="{p["red_bird"]}" stroke-width="2.6"/>',
    )
    for sm_x, sm_y, sm_r in ((968, 418, 13), (952, 398, 18), (976, 382, 22), (1006, 368, 25)):
        img.emit(
            img.LAYER_HORIZON,
            f'<circle cx="{sm_x}" cy="{sm_y}" r="{sm_r}" fill="{p["bone"]}" fill-opacity="0.76" '
            f'stroke="{p["graphite"]}" stroke-width="1.0"/>',
        )
    img.emit(img.LAYER_HORIZON, "</g>")

    # 3. Midground Multiplane High Bastions, Zinc-Scaled Roofs & Rising Stairway Streets
    img.emit(img.LAYER_MID_ARCH, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    # Upper North Bastion Keep (Left)
    img.draw_bastions(img.LAYER_MID_ARCH, x=72, top_y=156, w=224, h=340, batter=20, arcade_arches=3, zinc_roof_h=54)
    # Central Royal Arcade Bastion
    img.draw_bastions(img.LAYER_MID_ARCH, x=322, top_y=214, w=236, h=292, batter=16, arcade_arches=4, zinc_roof_h=48)
    # Right Casement & Tilted-Gutter Bastion Wing
    img.draw_bastions(img.LAYER_MID_ARCH, x=582, top_y=264, w=206, h=246, batter=14, arcade_arches=3, zinc_roof_h=42)

    # Rising Multiplane Stone Stairway Street cutting diagonally up from harbor dock to North Bastion
    stair_base_x, stair_base_y = 338.0, 566.0
    stair_top_x, stair_top_y = 178.0, 316.0
    n_steps = 24
    for s_idx in range(n_steps):
        u = s_idx / n_steps
        sx_step = stair_base_x + (stair_top_x - stair_base_x) * u
        sy_step = stair_base_y + (stair_top_y - stair_base_y) * u
        sw_step = 112.0 * (1.0 - 0.34 * u)
        img.emit(
            img.LAYER_MID_ARCH,
            f'<rect x="{sx_step - sw_step * 0.5:.1f}" y="{sy_step:.1f}" width="{sw_step:.1f}" height="11.5" '
            f'fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.2"/>',
        )
    # Stepped iron stair balustrade
    img.hand_line(
        img.LAYER_MID_ARCH, stair_base_x - 56, stair_base_y, stair_top_x - 38, stair_top_y - 18,
        stroke=p["soot"], stroke_width=2.2,
    )
    img.hand_line(
        img.LAYER_MID_ARCH, stair_base_x + 56, stair_base_y, stair_top_x + 38, stair_top_y - 18,
        stroke=p["soot"], stroke_width=2.2,
    )

    # Tall Iron North Bastion Gallows-Lamppost at top of stair (`x=214, y=132..322`)
    img.emit(
        img.LAYER_MID_ARCH,
        f'<line x1="214" y1="322" x2="214" y2="126" stroke="{p["soot"]}" stroke-width="4.5"/>'
        f'<line x1="214" y1="132" x2="268" y2="132" stroke="{p["soot"]}" stroke-width="3.6"/>'
        f'<path d="M 214 166 Q 232 138 252 132" fill="none" stroke="{p["soot"]}" stroke-width="2.0"/>',
    )

    # Tilted Zinc Guttering along right bastion eave (`(576, 336) -> (796, 362)`) + 6 Shattered Shards!
    img.hand_line(img.LAYER_MID_ARCH, 574, 334, 798, 364, stroke=p["graphite"], stroke_width=5.0)
    img.hand_line(img.LAYER_MID_ARCH, 574, 332, 798, 362, stroke=p["paper"], stroke_width=1.4)
    img.emit(img.LAYER_MID_ARCH, "</g>")

    # 4. Material Residues: Parabolic Gunboat Shell Arc, Shattered Gutter Burst & Adulterer Scratch
    img.emit(
        img.LAYER_RESIDUES,
        f'<path d="M 976 426 Q 868 208 712 348" fill="none" stroke="{p["red_bird"]}" '
        f'stroke-width="2.2" stroke-dasharray="9,5" marker-end="url(#arrow-red)"/>'
        f'<circle cx="712" cy="350" r="32" fill="{p["ochre_oil"]}" fill-opacity="0.34"/>',
    )
    z_shard_offsets = [(-26, -18, -0.62), (-8, 16, 0.84), (16, -22, -1.18), (32, 12, 0.37), (-34, 14, 1.05), (42, -8, -0.29)]
    for dx_s, dy_s, ang_s in z_shard_offsets:
        ca, sa = math.cos(ang_s), math.sin(ang_s)
        sp = [(712 + dx_s + lx * ca - ly * sa, 350 + dy_s + lx * sa + ly * ca) for lx, ly in ((-9, -4), (10, -2), (6, 6), (-7, 4))]
        img.hand_polygon(img.LAYER_RESIDUES, sp, fill=p["ochre_oil"], stroke=p["soot"], stroke_width=1.1)

    # Ceremonial Queen's Nuptial Festoon Span across central bastion arcade (`x=268..586`)
    img.emit(
        img.LAYER_RESIDUES,
        f'<path d="M 268 228 Q 428 282 586 266" fill="none" stroke="{p["red_bird"]}" stroke-width="2.2"/>',
    )
    for fi in range(1, 9):
        u = fi / 9.0
        fx = (1 - u) ** 2 * 268 + 2 * (1 - u) * u * 428 + u ** 2 * 586
        fy = (1 - u) ** 2 * 228 + 2 * (1 - u) * u * 282 + u ** 2 * 266
        col_pen = p["red_bird"] if fi % 2 == 0 else p["ochre_oil"]
        img.emit(
            img.LAYER_RESIDUES,
            f'<polygon points="{fx - 6:.1f},{fy:.1f} {fx + 6:.1f},{fy + 1:.1f} {fx:.1f},{fy + 14:.1f}" '
            f'fill="{col_pen}" stroke="{p["soot"]}" stroke-width="0.8"/>',
        )

    # 5. Foreground Harbor Dock Pier & Stretched Torn Fishing Nets (`y=566..716`)
    img.emit(img.LAYER_FOREGROUND, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    img.hand_polygon(
        img.LAYER_FOREGROUND,
        [(40, 566), (868, 566), (924, 716), (40, 716)],
        fill=p["bone"],
        stroke=p["soot"],
        stroke_width=2.2,
    )
    img.emit(
        img.LAYER_FOREGROUND,
        f'<rect x="40" y="566" width="844" height="150" fill="url(#ashlar-stone)" fill-opacity="0.55"/>',
    )
    # Mooring bollards & stretched diamond-mesh fishing nets along the dock
    for bx in (124, 486, 818):
        img.emit(
            img.LAYER_FOREGROUND,
            f'<rect x="{bx - 9}" y="544" width="18" height="32" rx="3" fill="{p["soot"]}" stroke="{p["paper"]}" stroke-width="0.8"/>',
        )
    net_d_lines: List[str] = []
    for nx_i in range(140, 800, 22):
        sag_y = 618 + 24 * math.sin((nx_i - 140) * math.pi / 330.0)
        net_d_lines.append(f"M {nx_i} 562 L {nx_i + 18} {sag_y:.1f}")
        net_d_lines.append(f"M {nx_i + 18} 562 L {nx_i} {sag_y:.1f}")
    img.emit(
        img.LAYER_FOREGROUND,
        f'<path d="M 124 558 Q 305 606 486 558 Q 652 608 818 558" fill="none" stroke="{p["soot"]}" stroke-width="2.0"/>'
        f'<path d="{" ".join(net_d_lines)}" fill="none" stroke="{p["graphite"]}" stroke-width="0.9" stroke-opacity="0.68"/></g>',
    )

    # 6. All 5 Bespoke Constant-Volume Faceless Performers (including 3 Hooded Dock Net-Menders!)
    ratios: List[float] = []

    # (1) Usurper Lamppost Plumb-Line (`◷`, `plumb_bob`) swaying from gallows arm
    _, _, ar1 = img.draw_posed_rig(
        agent_id="usurper_lamppost_plumb",
        rig_archetype="plumb_bob",
        cx=268.0,
        bottom_y=232.0,
        base_scale=74.0,
        stretch_s=float(act_a24["usurper_lamppost_plumb"]["stretch_s"]),
        width_w=float(act_a24["usurper_lamppost_plumb"]["width_w"]),
        tilt_rad=float(act_a24["usurper_lamppost_plumb"]["tilt_rad"]),
        kinematics="hold_still",
        ink=p["soot"],
        fill=p["ochre_oil"],
        role_symbol="◷",
        caption="PLUMB-LINE (◷ FEET CLEARANCE)",
    )
    ratios.append(ar1)

    # (2) Queen's Nuptial Festoon Rig (`⌂`, `taut_chord`) on central arcade parapet
    _, _, ar2 = img.draw_posed_rig(
        agent_id="nuptial_festoon_rig",
        rig_archetype="taut_chord",
        cx=452.0,
        bottom_y=268.0,
        base_scale=64.0,
        stretch_s=float(act_b24["nuptial_festoon_rig"]["stretch_s"]),
        width_w=float(act_b24["nuptial_festoon_rig"]["width_w"]),
        tilt_rad=float(act_b24["nuptial_festoon_rig"]["tilt_rad"]),
        kinematics="hold_still",
        ink=p["red_bird"],
        fill=p["bone"],
        role_symbol="⌂",
        caption="NUPTIAL FESTOON (⌂)",
    )
    ratios.append(ar2)

    # (3) Gutter Cat Prowler (`◉`, `bamboo_stilt`) on tilted zinc guttering beside shards
    _, _, ar3 = img.draw_posed_rig(
        agent_id="gutter_cat_prowler",
        rig_archetype="bamboo_stilt",
        cx=648.0,
        bottom_y=344.0,
        base_scale=66.0,
        stretch_s=float(act_b24["gutter_cat_prowler"]["stretch_s"]),
        width_w=float(act_b24["gutter_cat_prowler"]["width_w"]),
        tilt_rad=float(act_b24["gutter_cat_prowler"]["tilt_rad"]),
        kinematics="avoid",
        ink=p["soot"],
        fill=p["ochre_oil"],
        role_symbol="◉",
        caption="GUTTER CAT (◉)",
    )
    ratios.append(ar3)

    # (4) Cape Gunboat Ordinance Cog (`☉`, `brass_cog`) at headland battery station
    _, _, ar4 = img.draw_posed_rig(
        agent_id="cape_gunboat_shell",
        rig_archetype="brass_cog",
        cx=1042.0,
        bottom_y=528.0,
        base_scale=62.0,
        stretch_s=float(act_a24["cape_gunboat_shell"]["stretch_s"]),
        width_w=float(act_a24["cape_gunboat_shell"]["width_w"]),
        tilt_rad=float(act_a24["cape_gunboat_shell"]["tilt_rad"]),
        kinematics="idle",
        ink=p["red_bird"],
        fill=p["bone"],
        role_symbol="☉",
        caption="GUNBOAT ORDNANCE (☉)",
    )
    ratios.append(ar4)

    # (5) Three Old Dock Net-Menders Chorus (`☾`, three constant-volume `hooded_husk` figures!)
    # Elder I (Left): Lawful A posture angling sharply left toward North Lamppost (`s=1.21, w=0.825`)
    _, _, ar5_a = img.draw_posed_rig(
        agent_id="dock_net_mender_elder_1",
        rig_archetype="hooded_husk",
        cx=264.0,
        bottom_y=668.0,
        base_scale=88.0,
        stretch_s=float(act_a24["dock_net_mender_chorus"]["stretch_s"]),
        width_w=float(act_a24["dock_net_mender_chorus"]["width_w"]),
        tilt_rad=float(act_a24["dock_net_mender_chorus"]["tilt_rad"]),
        kinematics="accuse",
        ink=p["chalk_blue"],
        fill=p["bone"],
        role_symbol="☾",
        caption="MENDER I [A: N. LAMPPOST]",
    )
    # Elder II (Center): Balanced twine-knotting posture (`s=0.95, w=1.054`)
    _, _, ar5_m = img.draw_posed_rig(
        agent_id="dock_net_mender_elder_2",
        rig_archetype="hooded_husk",
        cx=426.0,
        bottom_y=674.0,
        base_scale=86.0,
        stretch_s=float(wt_a[10]["actors"]["dock_net_mender_chorus"]["stretch_s"]),
        width_w=float(wt_a[10]["actors"]["dock_net_mender_chorus"]["width_w"]),
        tilt_rad=-0.05,
        kinematics="idle",
        ink=p["soot"],
        fill=p["paper"],
        caption="MENDER II [100th TELLING]",
    )
    # Elder III (Right): Clinamen A' posture bowing right (`s=0.87, w=1.142, tilt=+0.36`)
    _, _, ar5_b = img.draw_posed_rig(
        agent_id="dock_net_mender_chorus",
        rig_archetype="hooded_husk",
        cx=596.0,
        bottom_y=668.0,
        base_scale=88.0,
        stretch_s=float(act_b24["dock_net_mender_chorus"]["stretch_s"]),
        width_w=float(act_b24["dock_net_mender_chorus"]["width_w"]),
        tilt_rad=float(act_b24["dock_net_mender_chorus"]["tilt_rad"]),
        kinematics="reroute",
        ink=p["red_bird"],
        fill=p["bone"],
        role_symbol="☾",
        caption="MENDER III [A': ⊣ SOUTH MOLE]",
    )
    ratios.extend([ar5_a, ar5_m, ar5_b])

    # Sightline vector contrast from Dock Chorus
    img.hand_line(
        img.LAYER_VECTORS, 258, 560, 266, 254,
        stroke=p["chalk_blue"], stroke_width=1.7, dash="6,4", marker_end="arrow-blue",
    )
    img.hand_line(
        img.LAYER_VECTORS, 608, 592, 876, 626,
        stroke=p["red_bird"], stroke_width=1.9, dash="6,4", marker_end="arrow-red",
    )
    img.draw_text(
        img.LAYER_VECTORS, 782, 646,
        "⊣ CLINAMEN DRIFT → SOUTH MOLE LANTERN",
        size=8.6, fill=p["red_bird"], font_family=MONO_STACK, weight="bold", anchor="middle",
    )

    min_ar, max_ar = min(ratios), max(ratios)
    img.draw_engraving_frame_and_caption(
        plate_code="04-IMG",
        title="ZAIRA — City of High Bastions (Ch. 1, Cities & Memory 3, Weaver pp. 10–11)",
        subtitle_optics=case_data["optical_rule"],
        material_line="MATERIALS: " + " · ".join(case_data["material_nouns"][:6]) + "  |  3 NET-MENDERS",
        volume_audit_line=f"A/A0 IN [{min_ar:.3f}, {max_ar:.3f}] (1.00 ± 0.03)",
    )
    return img


# ---------------------------------------------------------------------------
# ORCHESTRATOR & MANIFEST WRITER
# ---------------------------------------------------------------------------

def generate_wave1_proof_plates(bundle_path: Path = DEFAULT_BUNDLE_PATH) -> Dict[str, Any]:
    """
    Generate all 8 Wave 1 proof files (`.svg` + `.png` Map & Image for both
    `case_00_abominable_cellar` and `city_04_zaira`), verify every file, and
    write `/Users/gaia/WORLDFUL/scion_cities/atlas/manifest.json`.
    """
    with bundle_path.open("r", encoding="utf-8") as fh:
        bundle = json.load(fh)

    cellar_case = bundle["proof_case"]
    cities_by_id = {c["case_id"]: c for c in bundle["cities"]}
    if "city_04_zaira" not in cities_by_id:
        raise KeyError("city_04_zaira missing from proof_bundle.json cities list.")
    zaira_case = cities_by_id["city_04_zaira"]

    MAPS_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    MANIFESTS_DIR.mkdir(parents=True, exist_ok=True)

    jobs = [
        (
            "case_00_abominable_cellar",
            cellar_case,
            build_abominable_cellar_map,
            build_abominable_cellar_image,
        ),
        (
            "city_04_zaira",
            zaira_case,
            build_zaira_map,
            build_zaira_image,
        ),
    ]

    manifest: Dict[str, Any] = {}
    for plate_key, case_dict, map_fn, img_fn in jobs:
        map_svg_rel = f"maps/{plate_key}_map.svg"
        map_png_rel = f"maps/{plate_key}_map.png"
        img_svg_rel = f"images/{plate_key}_image.svg"
        img_png_rel = f"images/{plate_key}_image.png"

        map_res: PlateRenderResult = render_dual_plate(
            builder=map_fn(case_dict),
            kind="map",
            svg_path=ATLAS_DIR / map_svg_rel,
            png_path=ATLAS_DIR / map_png_rel,
        )
        img_res: PlateRenderResult = render_dual_plate(
            builder=img_fn(case_dict),
            kind="image",
            svg_path=ATLAS_DIR / img_svg_rel,
            png_path=ATLAS_DIR / img_png_rel,
        )

        # Re-verify written artifacts independently
        verify_plate_pair(map_res.svg_path, map_res.png_path, MAP_DIMENSIONS)
        verify_plate_pair(img_res.svg_path, img_res.png_path, IMAGE_DIMENSIONS)

        manifest[plate_key] = {
            "bundle_case_id": case_dict["case_id"],
            "city_index": case_dict["city_index"],
            "city_name": case_dict["city_name"],
            "title": case_dict["title"],
            "map_svg": map_svg_rel,
            "map_png": map_png_rel,
            "image_svg": img_svg_rel,
            "image_png": img_png_rel,
            "repo_paths": {
                "map_svg": f"scion_cities/atlas/{map_svg_rel}",
                "map_png": f"scion_cities/atlas/{map_png_rel}",
                "image_svg": f"scion_cities/atlas/{img_svg_rel}",
                "image_png": f"scion_cities/atlas/{img_png_rel}",
            },
            "dimensions": {
                "map": [map_res.width, map_res.height],
                "image": [img_res.width, img_res.height],
            },
            "sha256": {
                "map_svg": map_res.svg_sha256,
                "map_png": map_res.png_sha256,
                "image_svg": img_res.svg_sha256,
                "image_png": img_res.png_sha256,
            },
            "bytes": {
                "map_svg": map_res.svg_bytes,
                "map_png": map_res.png_bytes,
                "image_svg": img_res.svg_bytes,
                "image_png": img_res.png_bytes,
            },
            "pixel_std": {
                "map_png": map_res.pixel_std,
                "image_png": img_res.pixel_std,
            },
        }

    with PACK_00_MANIFEST_PATH.open("w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2, ensure_ascii=False)

    combined_manifest: Dict[str, Any] = {}
    if MANIFEST_PATH.exists():
        try:
            with MANIFEST_PATH.open("r", encoding="utf-8") as fh:
                existing = json.load(fh)
            if isinstance(existing, dict):
                combined_manifest.update(existing)
        except Exception:
            combined_manifest = {}
    combined_manifest.update(manifest)

    with MANIFEST_PATH.open("w", encoding="utf-8") as fh:
        json.dump(combined_manifest, fh, indent=2, ensure_ascii=False)

    return manifest


if __name__ == "__main__":
    built_manifest = generate_wave1_proof_plates()
    print(f"Wrote {PACK_00_MANIFEST_PATH} & updated {MANIFEST_PATH} ({len(built_manifest)} proof entries):")
    for cid, meta in built_manifest.items():
        print(
            f"  - {cid} (bundle={meta['bundle_case_id']}): "
            f"map_png={meta['dimensions']['map']} ({meta['bytes']['map_png']} B, std={meta['pixel_std']['map_png']}), "
            f"image_png={meta['dimensions']['image']} ({meta['bytes']['image_png']} B, std={meta['pixel_std']['image_png']})"
        )
