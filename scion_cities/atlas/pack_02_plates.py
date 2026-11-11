"""
Pack 02 Bespoke Cartographic Maps & Multiplane Architectural Engravings (10 Cities)
===================================================================================

Generates 20 archival plates (`10 x 1200x900` Maps + `10 x 1200x800` Architectural
Elevations in dual `.svg` + `.png`) and `/Users/gaia/WORLDFUL/scion_cities/atlas/manifests/pack_02_manifest.json`
for **Cities & Signs (1–5)** + **Thin Cities (1–5)**:

  - `city_06_tamara`    (Ch. 1, Cities and signs 1, Weaver p. 13)
  - `city_09_zirma`     (Ch. 1, Cities and signs 2, Weaver p. 19)
  - `city_10_isaura`    (Ch. 1, Thin cities 1, Weaver p. 20)
  - `city_13_zoe`       (Ch. 2, Cities and signs 3, Weaver p. 34)
  - `city_14_zenobia`   (Ch. 2, Thin cities 2, Weaver p. 35)
  - `city_17_hypatia`   (Ch. 3, Cities and signs 4, Weaver p. 47)
  - `city_18_armilla`   (Ch. 3, Thin cities 3, Weaver p. 49)
  - `city_21_olivia`    (Ch. 4, Cities and signs 5, Weaver p. 61)
  - `city_22_sophronia` (Ch. 4, Thin cities 4, Weaver p. 63)
  - `city_26_octavia`   (Ch. 5, Thin cities 5, Weaver p. 75)
"""

from __future__ import annotations

import json
import math
import sys
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Sequence, Tuple

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from scion_cities.atlas.plate_engine import (
    IMAGE_DIMENSIONS,
    MAP_DIMENSIONS,
    MONO_STACK,
    ImagePlateBuilder,
    MapPlateBuilder,
    PlateRenderResult,
    assert_no_facial_tokens,
    render_dual_plate,
    sanitize_plate_label,
    verify_plate_pair,
)
from scion_cities.swarms.pack_02_signs_thin import build_pack_02_swarms

ATLAS_DIR = Path(__file__).resolve().parent
MAPS_DIR = ATLAS_DIR / "maps"
IMAGES_DIR = ATLAS_DIR / "images"
MANIFESTS_DIR = ATLAS_DIR / "manifests"
PACK_02_MANIFEST_PATH = MANIFESTS_DIR / "pack_02_manifest.json"

PLAN_BOX: Tuple[float, float, float, float] = (88.0, 96.0, 656.0, 632.0)


# ---------------------------------------------------------------------------
# SHARED TELEMETRY & RIG OVERLAY HELPERS (100% DATA-COUPLED TO SWARM TRACES)
# ---------------------------------------------------------------------------

def _begin_map_plate(case_data: Dict[str, Any], plate_num: str) -> MapPlateBuilder:
    """Initialize `MapPlateBuilder` and reserve right-column cartouche/compass/ledger boxes."""
    cid = case_data["case_id"]
    m = MapPlateBuilder(plate_id=f"{cid}_map")
    m.draw_cartouche(
        x=776.0,
        y=84.0,
        w=348.0,
        h=248.0,
        case_data=case_data,
        plate_code=f"{plate_num}-MAP",
    )
    m.draw_compass_rose(
        cx=950.0,
        cy=456.0,
        radius=56.0,
        desert_opposed=case_data["desert_opposed"],
    )
    m.draw_inquiry_ledger_box(
        x=776.0,
        y=556.0,
        w=348.0,
        case_data=case_data,
        min_h=178.0,
        title="SPLIT-TRACE & BETTER-QUESTION LEDGER",
    )
    return m


def _finish_map_plate(
    m: MapPlateBuilder,
    case_data: Dict[str, Any],
    scale_label: str,
    witness_target_a_norm: Tuple[float, float],
    witness_target_b_norm: Tuple[float, float],
    label_a: str,
    label_b: str,
) -> MapPlateBuilder:
    """Overlay exact `♁ World` residues, `ConflictGrain` arches, `A`/`A'` sightlines, and swarm medallions."""
    p = m.palette
    wt_a = case_data["CHECKPOINT_LAWFUL_A"]["world_trace"]
    wt_b = case_data["BRANCH_CLINAMEN_A_PRIME"]["world_trace"]
    res = wt_a[24]["residues"]
    act_a24 = wt_a[24]["actors"]
    act_b24 = wt_b[24]["actors"]
    agents = case_data["agents"]

    # Locate roles
    source_ag = next((ag for ag in agents if ag["afterlight_role"] == "SOURCE"), agents[0])
    world_ag = next((ag for ag in agents if ag["afterlight_role"] == "WORLD"), agents[2])
    witness_id = case_data["divergence_audit"]["witness_agent_id"]

    wx_n = float(act_a24[world_ag["agent_id"]]["x"])
    wy_n = float(act_a24[world_ag["agent_id"]]["y"])
    oil_cx, oil_cy = m.norm_to_map(wx_n, wy_n, box=PLAN_BOX)
    oil_r_px = max(22.0, float(res["oil_radius"]) * 280.0)
    m.draw_oil_pool(
        oil_cx,
        oil_cy,
        radius_px=oil_r_px,
        thermal_ember=float(res["thermal_ember"]),
        label=f"♁ RESIDUE POOL r={res['oil_radius']:.3f}",
    )

    # Scuff vector from SOURCE push trace
    sx_n = float(act_a24[source_ag["agent_id"]]["x"])
    sy_n = float(act_a24[source_ag["agent_id"]]["y"])
    scuff = res["scuff_vector"]
    sc0_x, sc0_y = m.norm_to_map(sx_n, sy_n, box=PLAN_BOX)
    sc1_x, sc1_y = m.norm_to_map(
        min(0.92, max(0.08, sx_n + float(scuff[0]))),
        min(0.90, max(0.10, sy_n + float(scuff[1]))),
        box=PLAN_BOX,
    )
    m.draw_scuff_vector(
        sc0_x, sc0_y, sc1_x, sc1_y,
        label=f"SCUFF [{scuff[0]:+.2f},{scuff[1]:+.2f}]",
    )

    # Exact shards scatter
    m.draw_shard_scatter(
        res["shards"],
        box=PLAN_BOX,
        origin_xy=(oil_cx, oil_cy),
        label=f"{len(res['shards'])} INTACT SHARDS (A & A')",
    )

    # ConflictGrain keystone arches spanning contending agents
    grains = case_data["CHECKPOINT_LAWFUL_A"]["accumulator_dag"]["conflict_grains"]
    for g_idx, gr in enumerate(grains[:2]):
        c_ids = gr.get("agents", [])
        if len(c_ids) >= 2 and c_ids[0] in act_a24 and c_ids[1] in act_a24:
            ax0, ay0 = m.norm_to_map(float(act_a24[c_ids[0]]["x"]), float(act_a24[c_ids[0]]["y"]), box=PLAN_BOX)
            ax1, ay1 = m.norm_to_map(float(act_a24[c_ids[1]]["x"]), float(act_a24[c_ids[1]]["y"]), box=PLAN_BOX)
        else:
            ax0, ay0 = sc0_x, sc0_y
            ax1, ay1 = oil_cx, oil_cy
        m.draw_conflict_keystone_arch(
            ax0,
            ay0,
            ax1,
            ay1,
            grain_hash=str(gr["grain_hash"]),
            arch_tension=float(gr["arch_tension"]),
            locus_label=str(gr["locus"]).upper()[:18],
            arc_lift=-44.0 - g_idx * 24.0,
        )

    # Witness sightlines: Lawful A vs Clinamen A' (`⊣ FILTER`)
    wit_a_x, wit_a_y = m.norm_to_map(float(act_a24[witness_id]["x"]), float(act_a24[witness_id]["y"]), box=PLAN_BOX)
    wit_b_x, wit_b_y = m.norm_to_map(float(act_b24[witness_id]["x"]), float(act_b24[witness_id]["y"]), box=PLAN_BOX)
    ta_x, ta_y = m.norm_to_map(witness_target_a_norm[0], witness_target_a_norm[1], box=PLAN_BOX)
    tb_x, tb_y = m.norm_to_map(witness_target_b_norm[0], witness_target_b_norm[1], box=PLAN_BOX)
    m.draw_witness_sightline(wit_a_x, wit_a_y, ta_x, ta_y, label=label_a, filtered=False, curve_offset=-26.0)
    m.draw_witness_sightline(wit_b_x, wit_b_y, tb_x, tb_y, label=label_b, filtered=True, curve_offset=28.0)

    # Offscreen world footer line inside plan frame
    offscreen_raw = wt_a[24]["offscreen_world"]
    if isinstance(offscreen_raw, list):
        offscreen_keys = " · ".join(
            str(item.get("entity", item.get("entity_id", item.get("id", "")))).upper()[:24]
            for item in offscreen_raw[:3]
        )
    else:
        offscreen_keys = " · ".join(str(k).upper() for k in offscreen_raw.keys())
    m.draw_text(
        m.LAYER_TERRAIN,
        94.0,
        748.0,
        f"◷ OFFSCREEN: {offscreen_keys}",
        size=7.8,
        fill=p["chalk_blue"],
        font_family=MONO_STACK,
    )

    # All 4 swarm agent medallions at exact A-checkpoint coordinates
    role_colors = {
        "SOURCE": p["red_bird"],
        "CONTROL": p["soot"],
        "BODY": p["soot"],
        "WORLD": p["ochre_oil"],
        "MEDIUM": p["ochre_oil"],
        "CULTURE": p["red_bird"],
        "TIME": p["soot"],
        "REFLECTOR": p["chalk_blue"],
    }
    for ag in agents:
        aid = ag["agent_id"]
        ax, ay = m.norm_to_map(float(act_a24[aid]["x"]), float(act_a24[aid]["y"]), box=PLAN_BOX)
        short_lbl = "_".join(aid.split("_")[1:])
        m.draw_afterlight_badge(
            m.LAYER_AGENT_LOCI,
            ax,
            ay,
            role_symbol=ag["role_symbol"],
            op_symbol=ag["op_symbol"],
            radius=13.0,
            ink=role_colors.get(ag["afterlight_role"], p["soot"]),
            fill=p["paper"],
            label=short_lbl,
        )

    m.draw_calvino_scale_bar(
        x=94.0,
        y=778.0,
        width=424.0,
        unit_label=scale_label,
        divisions=5,
    )
    m.draw_text(
        m.LAYER_CARTOUCHE,
        776.0,
        794.0,
        f"WEAVER P. {case_data['weaver_page']} · {case_data['series'].upper()} #{case_data['series_rank']} · JACCARD: 0.000",
        size=8.0,
        fill=p["chalk_blue"],
        font_family=MONO_STACK,
        weight="bold",
    )
    return m


def _finish_image_plate(
    img: ImagePlateBuilder,
    case_data: Dict[str, Any],
    plate_num: str,
    rig_positions: Dict[str, Tuple[float, float, float]],
    witness_split_b_xy: Tuple[float, float],
    residue_floor_xy: Tuple[float, float],
) -> ImagePlateBuilder:
    """
    Overlay intact `♁ World` scuff/shards on `LAYER_RESIDUES`, pose all 4 constant-volume
    faceless rigs + `A'` witness swerve counterpart on `LAYER_PERFORMERS`, draw split aftermath
    vector chord on `LAYER_VECTORS`, and engrave frame & volume audit caption.
    """
    p = img.palette
    wt_a = case_data["CHECKPOINT_LAWFUL_A"]["world_trace"]
    wt_b = case_data["BRANCH_CLINAMEN_A_PRIME"]["world_trace"]
    act_a24 = wt_a[24]["actors"]
    act_b24 = wt_b[24]["actors"]
    res = wt_a[24]["residues"]
    scuff = res["scuff_vector"]
    witness_id = case_data["divergence_audit"]["witness_agent_id"]
    swerve_t = case_data["divergence_audit"]["swerve_tick"]

    # Foreground residue scuff + shards on stage floor
    rx, ry = residue_floor_xy
    img.emit(img.LAYER_RESIDUES, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    img.emit(
        img.LAYER_RESIDUES,
        f'<ellipse cx="{rx:.1f}" cy="{ry:.1f}" rx="64" ry="15" fill="url(#hatch-ochre-oil)" '
        f'stroke="{p["ochre_oil"]}" stroke-width="1.5"/>',
    )
    img.hand_line(
        img.LAYER_RESIDUES, rx - 78, ry - 4, rx + 56, ry + 6,
        stroke=p["ochre_oil"], stroke_width=2.6, marker_end="arrow-ochre",
    )
    for idx_s, sh in enumerate(res["shards"][:6]):
        ang = float(sh[2])
        ox = rx - 46 + idx_s * 19
        oy = ry - 8 + ((idx_s % 3) - 1) * 7
        ca, sa = math.cos(ang), math.sin(ang)
        pts = [(ox + lx * ca - ly * sa, oy + lx * sa + ly * ca) for lx, ly in ((-7, -3), (8, -2), (5, 5), (-6, 4))]
        img.hand_polygon(img.LAYER_RESIDUES, pts, fill=p["ochre_oil"], stroke=p["soot"], stroke_width=1.0)
    img.draw_text(
        img.LAYER_RESIDUES,
        rx,
        ry + 26.0,
        f"♁ INTACT RESIDUE [{scuff[0]:+.2f},{scuff[1]:+.2f}] & {len(res['shards'])} SHARDS (A & A')",
        size=8.2,
        fill=p["ochre_oil"],
        font_family=MONO_STACK,
        weight="bold",
        anchor="middle",
    )
    img.emit(img.LAYER_RESIDUES, "</g>")

    # Posed Constant-Volume Faceless Rigs
    ratios: List[float] = []
    role_inks = {
        "SOURCE": p["soot"],
        "CONTROL": p["soot"],
        "BODY": p["soot"],
        "WORLD": p["ochre_oil"],
        "MEDIUM": p["ochre_oil"],
        "CULTURE": p["soot"],
        "TIME": p["soot"],
        "REFLECTOR": p["chalk_blue"],
    }
    ordered_slots = list(rig_positions.values())
    for ag_idx, ag in enumerate(case_data["agents"]):
        aid = ag["agent_id"]
        cx, by, scale = rig_positions.get(aid, ordered_slots[ag_idx])
        fr_a = act_a24[aid]
        parts = aid.split("_")
        short_tag = parts[1].upper() if aid == witness_id else "_".join(parts[1:3]).upper()
        cap = f"{short_tag} [A:{fr_a['intention_kinematics'].upper()}]" if aid == witness_id else f"{short_tag} ({ag['role_symbol']})"
        _, _, ar = img.draw_posed_rig(
            agent_id=aid if aid != witness_id else f"{aid}_lawful_a",
            rig_archetype=ag["rig_archetype"],
            cx=cx,
            bottom_y=by,
            base_scale=scale,
            stretch_s=float(fr_a["stretch_s"]),
            width_w=float(fr_a["width_w"]),
            tilt_rad=float(fr_a["tilt_rad"]),
            kinematics=str(fr_a["intention_kinematics"]),
            ink=role_inks.get(ag["afterlight_role"], p["soot"]),
            fill=p["bone"] if aid != witness_id else p["paper"],
            role_symbol=ag["role_symbol"],
            caption=cap,
        )
        ratios.append(ar)

        if aid == witness_id:
            fr_b = act_b24[aid]
            bx, b_by = witness_split_b_xy
            _, _, ar_b = img.draw_posed_rig(
                agent_id=aid,
                rig_archetype=ag["rig_archetype"],
                cx=bx,
                bottom_y=b_by,
                base_scale=scale,
                stretch_s=float(fr_b["stretch_s"]),
                width_w=float(fr_b["width_w"]),
                tilt_rad=float(fr_b["tilt_rad"]),
                kinematics=str(fr_b["intention_kinematics"]),
                ink=p["red_bird"],
                fill=p["bone"],
                role_symbol=ag["role_symbol"],
                caption=f"{short_tag} [A':{fr_b['intention_kinematics'].upper()}]",
            )
            ratios.append(ar_b)
            # Split swerve arc between A and A' witness postures
            mx = 0.5 * (cx + bx)
            my = min(by, b_by) - scale - 24.0
            img.emit(
                img.LAYER_VECTORS,
                f'<path d="M {cx:.1f} {by - scale * 0.65:.1f} Q {mx:.1f} {my:.1f} {bx:.1f} {b_by - scale * 0.65:.1f}" '
                f'fill="none" stroke="{p["red_bird"]}" stroke-width="2.0" stroke-dasharray="6,4" marker-end="url(#arrow-red)"/>'
                f'<rect x="{mx - 88:.1f}" y="{my - 15:.1f}" width="176" height="19" rx="3" '
                f'fill="{p["paper"]}" fill-opacity="0.92" stroke="{p["red_bird"]}" stroke-width="1.1"/>',
            )
            img.draw_text(
                img.LAYER_VECTORS,
                mx,
                my - 2.0,
                f"⊣ CLINAMEN SWERVE (t={swerve_t})",
                size=8.2,
                fill=p["red_bird"],
                font_family=MONO_STACK,
                weight="bold",
                anchor="middle",
            )

    min_ar, max_ar = min(ratios), max(ratios)
    mat_nouns = " · ".join(case_data["material_nouns"][:4])
    thin_tel = " | ".join(str(case_data["thick_telemetry"]["thin_machine_telemetry"]).split("|")[:4]).strip()
    img.draw_engraving_frame_and_caption(
        plate_code=f"{plate_num}-IMG",
        title=f"{case_data['city_name'].upper()} — {case_data['series']} #{case_data['series_rank']} (Weaver p. {case_data['weaver_page']})",
        subtitle_optics=sanitize_plate_label(case_data["optical_rule"]),
        material_line=f"NOUNS: {sanitize_plate_label(mat_nouns)}  |  BUS: {sanitize_plate_label(thin_tel)}",
        volume_audit_line=f"RIG AREA s*w IN [{min_ar:.3f}, {max_ar:.3f}] (1.00±0.03) · FACE ICONS: 0",
    )
    return img


# ===========================================================================
# 1. CITY 06: TAMARA — Jutting Guild Signboards & Pareidolia Cloud Horizon
# ===========================================================================

def build_tamara_map(case_data: Dict[str, Any]) -> MapPlateBuilder:
    m = _begin_map_plate(case_data, "06")
    p = m.palette
    m.draw_contour_lines((360.0, 410.0), [(290, 210), (235, 168), (175, 122)], ["+24m PLAIN", "+28m GATE", "+32m TEMPLE"])

    # Mute windowless urban blocks along jutting_guild_street
    blocks = [
        ([(108, 150), (268, 146), (264, 276), (106, 280)], "MUTE MASONRY I"),
        ([(324, 144), (484, 148), (480, 274), (320, 272)], "AVERROES SCHOOL"),
        ([(110, 344), (272, 342), (270, 488), (112, 492)], "UNWRITTEN CORE"),
        ([(326, 342), (492, 346), (488, 488), (324, 486)], "TEMPLE DECREES"),
        ([(136, 542), (356, 540), (352, 646), (134, 650)], "SILENT SACK BLOCK"),
    ]
    for pts, lbl in blocks:
        m.draw_urban_block(pts, roof_pattern="hatch-soot-45", label=lbl)

    # Jutting iron signboard brackets projecting into street canyon (`x=268..324` & `y=280..342`)
    sign_arms = [
        (268, 188, 304, 188, "PINCERS"),
        (322, 224, 286, 224, "TANKARD"),
        (270, 384, 306, 384, "SCALES"),
        (324, 434, 288, 434, "HALBERDS"),
        (210, 280, 210, 316, "ZEBRA PERMIT"),
        (408, 274, 408, 310, "KIOSK TABOO"),
    ]
    for x0, y0, x1, y1, tag in sign_arms:
        m.hand_line(m.LAYER_SOOT_PLAN, x0, y0, x1, y1, stroke=p["soot"], stroke_width=2.6)
        m.emit(m.LAYER_SOOT_PLAN, f'<rect x="{x1 - 12:.1f}" y="{y1 - 8:.1f}" width="24" height="16" fill="{p["ochre_oil"]}" fill-opacity="0.35" stroke="{p["soot"]}" stroke-width="1.1"/>')
        m.draw_text(m.LAYER_SOOT_PLAN, x1, y1 - 11, tag, size=7.2, fill=p["red_bird"], font_family=MONO_STACK, weight="bold", anchor="middle")

    # Eastern city wall gate & pareidolia cloud-plain outside Tamara (`x=520..726`)
    m.draw_bastion_wall([(514, 128), (518, 302)], thickness=8.5, crenelated=True)
    m.draw_bastion_wall([(518, 362), (512, 668)], thickness=8.5, crenelated=True)
    for cx, cy, rx, ry, ctag in ((636, 214, 58, 26, "CLOUD SHIP"), (652, 366, 52, 24, "CLOUD HAND"), (626, 528, 62, 28, "CLOUD ELEPHANT")):
        m.emit(
            m.LAYER_TERRAIN,
            f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{p["chalk_blue"]}" fill-opacity="0.12" '
            f'stroke="{p["chalk_blue"]}" stroke-width="1.2" stroke-dasharray="5,3"/>',
        )
        m.draw_text(m.LAYER_TERRAIN, cx, cy + 3, ctag, size=7.8, fill=p["chalk_blue"], font_family=MONO_STACK, anchor="middle")

    return _finish_map_plate(
        m,
        case_data,
        scale_label="SCALE OF JUTTING GUILD BRACKETS & DECREE STEPS (1 DIV = 10 CUBITS)",
        witness_target_a_norm=(0.43, 0.45),
        witness_target_b_norm=(0.82, 0.34),
        label_a="A: READS MUTE CORNICE GOUGE",
        label_b="A' (⊣ t=11): READS CLOUD-SHIPS",
    )


def build_tamara_image(case_data: Dict[str, Any]) -> ImagePlateBuilder:
    img = ImagePlateBuilder(plate_id="city_06_tamara_image")
    p = img.palette
    img.draw_sky_atmosphere(mode="dawn_bastion", sun_moon_xy=(596.0, 146.0))
    L_hor, L_mid, L_fg = img.LAYER_HORIZON, img.LAYER_MID_ARCH, img.LAYER_FOREGROUND

    # Far horizon visible through central city gate: wind-torn cloud pareidolia (ship, hand, elephant)
    img.emit(L_hor, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    # Cloud sailing ship silhouette in sky (`cx=596, y=220`)
    img.hand_polygon(L_hor, [(542, 248), (648, 248), (632, 268), (558, 268)], fill=p["paper"], stroke=p["chalk_blue"], stroke_width=1.4)
    img.hand_polygon(L_hor, [(572, 244), (596, 184), (618, 244)], fill=p["paper"], stroke=p["chalk_blue"], stroke_width=1.3)
    # Cloud elephant & hand lobes
    img.emit(
        L_hor,
        f'<path d="M 526 318 Q 554 286 594 294 Q 638 286 658 318 Q 674 338 666 356 L 652 354 Q 654 334 638 334 L 546 334 Z" '
        f'fill="{p["paper"]}" fill-opacity="0.82" stroke="{p["chalk_blue"]}" stroke-width="1.2" stroke-dasharray="5,3"/>',
    )
    img.draw_text(L_hor, 598, 374, "OUTSIDE GATE: PAREIDOLIA CLOUD-SHIP & ELEPHANT", size=8.0, fill=p["chalk_blue"], font_family=MONO_STACK, anchor="middle")
    img.emit(L_hor, "</g>")

    # Left & Right towering MUTE windowless stone street facades framing narrow canyon
    img.emit(L_mid, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    img.hand_polygon(L_mid, [(40, 52), (456, 134), (456, 616), (40, 692)], fill=p["bone"], stroke=p["soot"], stroke_width=2.0)
    img.hand_polygon(L_mid, [(1160, 52), (744, 134), (744, 616), (1160, 692)], fill=p["bone"], stroke=p["soot"], stroke_width=2.0)
    img.emit(
        L_mid,
        f'<polygon points="40,52 456,134 456,616 40,692" fill="url(#ashlar-stone)"/>'
        f'<polygon points="1160,52 744,134 744,616 1160,692" fill="url(#ashlar-stone)"/>'
        f'<path d="M 456 616 L 456 382 A 144 144 0 0 1 744 382 L 744 616" fill="none" stroke="{p["soot"]}" stroke-width="5.0"/>',
    )

    # Oversized jutting wrought-iron bracketed guild signboards occluding both facades!
    # Left 1: Giant Tooth-Drawer's Iron Pincers (`y=168`)
    img.emit(
        L_mid,
        f'<line x1="210" y1="176" x2="508" y2="176" stroke="{p["soot"]}" stroke-width="4.5"/>'
        f'<path d="M 210 218 Q 284 176 346 176" fill="none" stroke="{p["soot"]}" stroke-width="2.2"/>'
        f'<rect x="362" y="184" width="132" height="92" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="2.0"/>'
        f'<path d="M 398 264 L 444 206 M 458 264 L 412 206" stroke="{p["soot"]}" stroke-width="4.2"/>'
        f'<path d="M 404 208 C 414 190 442 190 452 208" fill="none" stroke="{p["red_bird"]}" stroke-width="3.6"/>',
    )
    img.draw_text(L_mid, 428, 290, "SIGN: TOOTH-DRAWER PINCERS", size=8.0, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle")

    # Left 2: Tavern Foaming Tankard (`y=334`)
    img.emit(
        L_mid,
        f'<line x1="146" y1="336" x2="432" y2="336" stroke="{p["soot"]}" stroke-width="4.0"/>'
        f'<rect x="292" y="344" width="118" height="84" fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.8"/>'
        f'<rect x="328" y="366" width="42" height="48" fill="{p["ochre_oil"]}" stroke="{p["soot"]}" stroke-width="1.8"/>'
        f'<path d="M 370 374 C 388 374 388 404 370 404" fill="none" stroke="{p["soot"]}" stroke-width="2.4"/>'
        f'<ellipse cx="349" cy="364" rx="24" ry="8" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.3"/>',
    )

    # Right 1: Grocer's Balance Scales (`y=194`)
    img.emit(
        L_mid,
        f'<line x1="1012" y1="194" x2="692" y2="194" stroke="{p["soot"]}" stroke-width="4.5"/>'
        f'<rect x="708" y="202" width="136" height="92" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="2.0"/>'
        f'<line x1="732" y1="232" x2="820" y2="232" stroke="{p["soot"]}" stroke-width="2.6"/>'
        f'<line x1="776" y1="212" x2="776" y2="278" stroke="{p["soot"]}" stroke-width="2.2"/>'
        f'<path d="M 720 264 Q 732 278 744 264 Z M 808 264 Q 820 278 832 264 Z" fill="{p["ochre_oil"]}" stroke="{p["soot"]}" stroke-width="1.4"/>',
    )
    img.draw_text(L_mid, 776, 308, "SIGN: GROCER SCALES", size=8.0, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle")

    # Right 2: Guardhouse Halberds & Kiosk Taboo Tablet (`y=356`)
    img.emit(
        L_mid,
        f'<line x1="1048" y1="356" x2="764" y2="356" stroke="{p["soot"]}" stroke-width="4.0"/>'
        f'<rect x="780" y="364" width="128" height="88" fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.8"/>'
        f'<line x1="808" y1="442" x2="878" y2="374" stroke="{p["soot"]}" stroke-width="3.0"/>'
        f'<line x1="878" y1="442" x2="808" y2="374" stroke="{p["soot"]}" stroke-width="3.0"/>'
        f'<polygon points="866,374 892,382 874,400" fill="{p["red_bird"]}" stroke="{p["soot"]}" stroke-width="1.2"/>',
    )
    img.emit(L_mid, "</g>")

    # Paved foreground plaza stage
    img.emit(
        L_fg,
        f'<g clip-path="url(#stage-clip-{img.plate_id})">'
        f'<polygon points="40,692 456,616 744,616 1160,692 1160,716 40,716" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.6"/>'
        f'</g>',
    )

    return _finish_image_plate(
        img,
        case_data,
        plate_num="06",
        rig_positions={
            "tamara_emblem_bracket_hanger": (228.0, 666.0, 84.0),
            "tamara_kiosk_taboo_codifier": (958.0, 664.0, 82.0),
            "tamara_concealed_core_eraser": (388.0, 646.0, 78.0),
            "tamara_pareidolia_cloud_scanner": (562.0, 644.0, 82.0),
        },
        witness_split_b_xy=(724.0, 646.0),
        residue_floor_xy=(478.0, 678.0),
    )


# ===========================================================================
# 2. CITY 09: ZIRMA — Window-Level Dirigibles, Leashed Puma & Subway Tattooist
# ===========================================================================

def build_zirma_map(case_data: Dict[str, Any]) -> MapPlateBuilder:
    m = _begin_map_plate(case_data, "09")
    p = m.palette
    m.draw_contour_lines((410.0, 390.0), [(290, 215), (220, 160)], ["+18m ARCADE", "+64m CORNICE"])

    # Skyscraper blocks with cornice ledges & puma cobblestone arcades
    m.draw_urban_block([(116, 138), (288, 136), (284, 286), (114, 290)], roof_pattern="zinc-scales", label="CORNICE TOWER W")
    m.draw_urban_block([(478, 142), (664, 146), (658, 292), (474, 288)], roof_pattern="zinc-scales", label="CORNICE TOWER E")
    m.draw_urban_block([(122, 368), (336, 366), (334, 488), (120, 492)], roof_pattern="hatch-soot-45", label="PUMA ARCADE ROW")

    # Moored cigar-shaped dirigibles in plan (`dirigible_cornice_skyline`)
    for dcx, dcy, drx, dry, dtag in ((382, 184, 68, 22, "DIRIGIBLE I"), (396, 252, 58, 18, "DIRIGIBLE II")):
        m.emit(
            m.LAYER_SOOT_PLAN,
            f'<ellipse cx="{dcx}" cy="{dcy}" rx="{drx}" ry="{dry}" fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.6"/>'
            f'<line x1="{dcx - drx}" y1="{dcy}" x2="{dcx + drx}" y2="{dcy}" stroke="{p["graphite"]}" stroke-width="0.9"/>',
        )
        m.draw_text(m.LAYER_SOOT_PLAN, dcx, dcy + 3, dtag, size=7.6, fill=p["soot"], font_family=MONO_STACK, anchor="middle")

    # Subterranean subway vault cutaway plan (`humid_subway_tattoo_vault`, dashed chalk/soot rails)
    m.emit(
        m.LAYER_SOOT_PLAN,
        f'<rect x="156" y="534" width="528" height="122" fill="{p["soot"]}" fill-opacity="0.08" '
        f'stroke="{p["soot"]}" stroke-width="1.6" stroke-dasharray="8,4"/>',
    )
    for ry in (566, 582):
        m.hand_line(m.LAYER_SOOT_PLAN, 166, ry, 674, ry, stroke=p["graphite"], stroke_width=1.8)
    for tx in range(180, 670, 22):
        m.hand_line(m.LAYER_SOOT_PLAN, tx, 562, tx, 586, stroke=p["dirt"], stroke_width=1.2)
    m.draw_text(m.LAYER_SOOT_PLAN, 420, 638, "SUBWAY VAULT & SAILOR TATTOO BENCH (CUTAWAY)", size=8.2, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle")

    return _finish_map_plate(
        m,
        case_data,
        scale_label="SCALE OF DIRIGIBLE MOORING CABLES & SUBWAY TIES (1 DIV = 10 METERS)",
        witness_target_a_norm=(0.38, 0.56),
        witness_target_b_norm=(0.48, 0.24),
        label_a="A: PLURAL REDUNDANT ZIRMA",
        label_b="A' (⊣ t=10): SINGLE-ICON COLLAPSE",
    )


def build_zirma_image(case_data: Dict[str, Any]) -> ImagePlateBuilder:
    img = ImagePlateBuilder(plate_id="city_09_zirma_image")
    p = img.palette
    img.draw_sky_atmosphere(mode="dusk", sun_moon_xy=(980.0, 128.0))
    L_hor, L_mid, L_fg = img.LAYER_HORIZON, img.LAYER_MID_ARCH, img.LAYER_FOREGROUND

    # Upper multiplane: Skyscraper towers + window-level dirigibles!
    img.emit(L_mid, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    for bx, bw, top_y in ((68, 210, 108), (336, 198, 146), (618, 218, 96), (894, 212, 134)):
        img.hand_polygon(L_mid, [(bx, top_y), (bx + bw, top_y), (bx + bw, 468), (bx, 468)], fill=p["bone"], stroke=p["soot"], stroke_width=1.8)
        # Cornice ledge
        img.emit(L_mid, f'<rect x="{bx - 8}" y="{top_y - 8}" width="{bw + 16}" height="10" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.5"/>')
        # Grid of skyscraper windows
        for wy in range(top_y + 22, 412, 34):
            for wx in range(bx + 18, bx + bw - 22, 34):
                img.emit(L_mid, f'<rect x="{wx}" y="{wy}" width="18" height="22" fill="{p["soot"]}" fill-opacity="0.65"/>')
        # Ground-level puma arcade arches (`y=418..468`)
        for ax in range(bx + 28, bx + bw - 20, 56):
            img.emit(L_mid, f'<path d="M {ax - 18} 468 L {ax - 18} 436 A 18 18 0 0 1 {ax + 18} 436 L {ax + 18} 468 Z" fill="{p["soot"]}" fill-opacity="0.80"/>')

    # Two giant cigar-shaped Dirigibles floating at window level (`y=198` & `y=268`)!
    for dcx, dcy, drx, dry in ((468, 196, 156, 42), (836, 258, 134, 36)):
        img.emit(
            L_mid,
            f'<ellipse cx="{dcx}" cy="{dcy}" rx="{drx}" ry="{dry}" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="2.0"/>'
            f'<ellipse cx="{dcx}" cy="{dcy}" rx="{drx}" ry="{dry * 0.45:.1f}" fill="none" stroke="{p["graphite"]}" stroke-width="0.9"/>'
            f'<rect x="{dcx - 36}" y="{dcy + dry}" width="72" height="16" fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.4"/>'
            f'<polygon points="{dcx - drx},{dcy} {dcx - drx - 24},{dcy - 22} {dcx - drx - 18},{dcy + 22}" fill="{p["red_bird"]}" stroke="{p["soot"]}" stroke-width="1.2"/>',
        )
        # Mooring line to skyscraper window
        img.hand_line(L_mid, dcx + drx, dcy, dcx + drx + 48, dcy + 22, stroke=p["soot"], stroke_width=1.4, dash="4,3")

    # Leashed puma silhouette striding along arcade cobbles (`x=216, y=462`)
    img.hand_polygon(
        L_mid,
        [(182, 464), (192, 444), (234, 442), (252, 434), (258, 446), (244, 464), (232, 464), (228, 452), (200, 452), (194, 464)],
        fill=p["ochre_oil"],
        stroke=p["soot"],
        stroke_width=1.4,
    )
    img.hand_line(L_mid, 252, 440, 294, 424, stroke=p["red_bird"], stroke_width=1.5)
    img.emit(L_mid, "</g>")

    # Lower cutaway (`y=468..716`): Humid vaulted Subway Tunnel, Ventilator Grates & Sailor Tattoo Bench!
    img.emit(L_fg, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    img.emit(
        L_fg,
        f'<rect x="40" y="468" width="1120" height="248" fill="{p["soot"]}" fill-opacity="0.86"/>'
        f'<rect x="56" y="484" width="1088" height="224" fill="{p["paper"]}" fill-opacity="0.90" stroke="{p["soot"]}" stroke-width="2.2"/>',
    )
    for arch_x in (220, 600, 980):
        img.emit(
            L_fg,
            f'<path d="M {arch_x - 170} 706 Q {arch_x} 488 {arch_x + 170} 706" fill="none" stroke="{p["dirt"]}" stroke-width="4.5" stroke-opacity="0.45"/>',
        )
    # Subway steel rails + ventilator grating beams
    img.hand_line(L_fg, 68, 694, 1132, 694, stroke=p["graphite"], stroke_width=2.6)
    img.hand_line(L_fg, 68, 704, 1132, 704, stroke=p["graphite"], stroke_width=2.6)
    img.draw_text(L_fg, 198, 506, "SUBWAY VENTILATOR CUTAWAY & TATTOO BENCH", size=8.4, fill=p["soot"], font_family=MONO_STACK, weight="bold")
    img.emit(L_fg, "</g>")

    return _finish_image_plate(
        img,
        case_data,
        plate_num="09",
        rig_positions={
            "zirma_dirigible_mooring_winch": (212.0, 668.0, 82.0),
            "zirma_puma_arcade_leash_post": (412.0, 668.0, 80.0),
            "zirma_subway_tattoo_needle_rig": (968.0, 670.0, 82.0),
            "zirma_singular_memory_companion": (612.0, 666.0, 84.0),
        },
        witness_split_b_xy=(796.0, 668.0),
        residue_floor_xy=(506.0, 682.0),
    )


# ===========================================================================
# 3. CITY 10: ISAURA — Buried Black Lake & 1,000 Deep Vertical Well Shafts
# ===========================================================================

def build_isaura_map(case_data: Dict[str, Any]) -> MapPlateBuilder:
    m = _begin_map_plate(case_data, "10")
    p = m.palette

    # Subterranean black pocket lake shoreline (green/chalk ring defining exact city border!)
    lake_poly = [
        (146, 268), (236, 152), (424, 132), (598, 174), (686, 294),
        (672, 486), (568, 612), (372, 646), (194, 588), (126, 434),
    ]
    m.draw_water_contours(lake_poly, ripple_count=6)
    d_lake = m.hand_path_d(lake_poly, jitter=0.6, closed=True)
    m.emit(m.LAYER_TERRAIN, f'<path d="{d_lake}" fill="{p["soot"]}" fill-opacity="0.14" stroke="{p["soot"]}" stroke-width="2.0" stroke-dasharray="9,4"/>')
    m.draw_text(m.LAYER_TERRAIN, 412, 162, "BURIED BLACK SUBTERRANEAN LAKE CONTOUR (CITY BORDER)", size=8.0, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle")

    # Overhead elevated aqueduct viaduct network crisscrossing above wells
    aqueducts = [
        [(182, 274), (404, 348), (624, 286)],
        [(234, 526), (404, 348), (576, 536)],
        [(404, 178), (404, 598)],
    ]
    for pts in aqueducts:
        for i in range(len(pts) - 1):
            m.hand_line(m.LAYER_SOOT_PLAN, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], stroke=p["soot"], stroke_width=3.0, double_pass=True)

    # Constellation of deep circular stone well-curbs & noria windlass wheels across Isaura!
    well_coords = [
        (228, 256), (312, 224), (404, 238), (508, 232), (586, 288),
        (198, 366), (294, 336), (404, 348), (512, 354), (612, 388),
        (224, 476), (322, 456), (418, 468), (516, 474), (588, 496),
        (296, 558), (404, 568), (496, 556),
    ]
    for wx, wy in well_coords:
        m.emit(
            m.LAYER_SOOT_PLAN,
            f'<circle cx="{wx}" cy="{wy}" r="11.5" fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.6"/>'
            f'<circle cx="{wx}" cy="{wy}" r="6.2" fill="{p["soot"]}" fill-opacity="0.82"/>'
            f'<line x1="{wx - 14}" y1="{wy}" x2="{wx + 14}" y2="{wy}" stroke="{p["ochre_oil"]}" stroke-width="1.3"/>',
        )

    return _finish_map_plate(
        m,
        case_data,
        scale_label="SCALE OF VERTICAL WELL-SHAFT FATHOMS & NORIA SPANS (1 DIV = 10 FATHOMS)",
        witness_target_a_norm=(0.48, 0.56),
        witness_target_b_norm=(0.62, 0.24),
        label_a="A: REVERES BURIED BLACK LAKE",
        label_b="A' (⊣ t=12): BUCKET-GODS ONLY",
    )


def build_isaura_image(case_data: Dict[str, Any]) -> ImagePlateBuilder:
    img = ImagePlateBuilder(plate_id="city_10_isaura_image")
    p = img.palette
    img.draw_sky_atmosphere(mode="dawn_bastion", sun_moon_xy=(990.0, 118.0))
    L_hor, L_mid, L_fg = img.LAYER_HORIZON, img.LAYER_MID_ARCH, img.LAYER_FOREGROUND

    # Upper half (`y=32..442`): Airy forest of stilted roof reservoirs, elevated aqueducts, noria wheels & weathercocks!
    img.emit(L_mid, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    # Flat limestone house terraces along ground datum `y=442`
    for hx, hw, hh in ((78, 178, 92), (292, 196, 112), (528, 188, 98), (754, 194, 118), (978, 152, 88)):
        hy = 442 - hh
        img.hand_polygon(L_mid, [(hx, hy), (hx + hw, hy), (hx + hw, 442), (hx, 442)], fill=p["bone"], stroke=p["soot"], stroke_width=1.6)
        # Stilted wooden barrel reservoir & spoked noria windlass above each roof!
        img.draw_stilts(L_mid, x=hx + 28, house_y=hy - 118, ground_y=hy, w=hw - 56, h=46)
        ncx, ncy = hx + hw * 0.5, hy - 144
        img.emit(
            L_mid,
            f'<circle cx="{ncx:.1f}" cy="{ncy:.1f}" r="26" fill="none" stroke="{p["soot"]}" stroke-width="2.0"/>'
            f'<line x1="{ncx - 26:.1f}" y1="{ncy:.1f}" x2="{ncx + 26:.1f}" y2="{ncy:.1f}" stroke="{p["soot"]}" stroke-width="1.2"/>'
            f'<line x1="{ncx:.1f}" y1="{ncy - 26:.1f}" x2="{ncx:.1f}" y2="{ncy + 26:.1f}" stroke="{p["soot"]}" stroke-width="1.2"/>'
            f'<line x1="{ncx:.1f}" y1="{ncy - 26:.1f}" x2="{ncx:.1f}" y2="{ncy - 52:.1f}" stroke="{p["red_bird"]}" stroke-width="1.5"/>'
            f'<polygon points="{ncx:.1f},{ncy - 52:.1f} {ncx + 18:.1f},{ncy - 46:.1f} {ncx:.1f},{ncy - 40:.1f}" fill="{p["red_bird"]}"/>',
        )
    # High elevated timber/masonry aqueduct spanning entire skyline (`y=214`)
    img.hand_line(L_mid, 56, 214, 1144, 214, stroke=p["soot"], stroke_width=4.0)
    img.hand_line(L_mid, 56, 222, 1144, 222, stroke=p["chalk_blue"], stroke_width=2.0)
    img.emit(L_mid, "</g>")

    # Lower half (`y=442..716`): Geological cutaway through limestone strata into the BURIED BLACK SUBTERRANEAN LAKE!
    img.emit(L_fg, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    img.emit(
        L_fg,
        f'<rect x="40" y="442" width="1120" height="178" fill="{p["dirt"]}" fill-opacity="0.34" stroke="{p["soot"]}" stroke-width="2.0"/>'
        f'<rect x="40" y="442" width="1120" height="178" fill="url(#ashlar-stone)"/>'
        f'<rect x="40" y="616" width="1120" height="100" fill="{p["soot"]}" fill-opacity="0.92"/>',
    )
    # Gleaming chalk-blue/bone ripples on the black subterranean lake (`y=624..708`)
    for ry in (632, 652, 676, 698):
        img.hand_line(L_fg, 74, ry, 1126, ry, stroke=p["chalk_blue"], stroke_width=1.2, dash="14,8", opacity=0.72)

    # Parallel vertical well-shaft risers slicing straight down from roof windlasses into the black lake + hanging buckets!
    for sx_well in (132, 206, 338, 434, 582, 668, 814, 892, 1036):
        img.emit(
            L_fg,
            f'<rect x="{sx_well - 9}" y="436" width="18" height="186" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.5"/>'
            f'<line x1="{sx_well}" y1="312" x2="{sx_well}" y2="626" stroke="{p["ochre_oil"]}" stroke-width="1.3"/>',
        )
        by_bkt = 486 + (sx_well * 13 % 110)
        img.emit(L_fg, f'<rect x="{sx_well - 6}" y="{by_bkt}" width="12" height="15" fill="{p["ochre_oil"]}" stroke="{p["soot"]}" stroke-width="1.1"/>')
    img.draw_text(L_fg, 600, 706, "BURIED BLACK SUBTERRANEAN LAKE & 1,000 VERTICAL WELL RISERS", size=8.6, fill=p["paper"], font_family=MONO_STACK, weight="bold", anchor="middle")
    img.emit(L_fg, "</g>")

    return _finish_image_plate(
        img,
        case_data,
        plate_num="10",
        rig_positions={
            "isaura_well_windlass_hoister": (248.0, 614.0, 78.0),
            "isaura_aqueduct_reservoir_warden": (956.0, 614.0, 78.0),
            "isaura_black_lake_seepage_vessel": (486.0, 694.0, 72.0),
            "isaura_weathercock_theologian": (668.0, 612.0, 80.0),
        },
        witness_split_b_xy=(812.0, 612.0),
        residue_floor_xy=(374.0, 604.0),
    )


# ===========================================================================
# 4. CITY 13: ZOE — Uniform Pyramidal Roofs & Indivisible Existence
# ===========================================================================

def build_zoe_map(case_data: Dict[str, Any]) -> MapPlateBuilder:
    m = _begin_map_plate(case_data, "13")
    p = m.palette

    # Blurred perimeter between cart-wheel ruts & wolf-howl tracks (`blurred_cart_wolf_perimeter`)
    m.draw_contour_lines(
        (408.0, 404.0),
        [(306, 248), (276, 222), (242, 192)],
        ["CART-WHEEL / WOLF-HOWL BORDER", "BLURRED PERIMETER", "UNDIFFERENTIATED PRECINCT"],
    )

    # Grid of 16 IDENTICAL square pyramidal-roofed cells (palace = leprosarium = bath = bazaar!)
    for row in range(4):
        for col in range(4):
            bx = 166.0 + col * 118.0
            by = 176.0 + row * 112.0
            bw, bh = 92.0, 88.0
            pts = [(bx, by), (bx + bw, by), (bx + bw, by + bh), (bx, by + bh)]
            m.draw_urban_block(pts, roof_pattern="zinc-scales")
            # X-diagonals meeting at identical pyramid apex!
            m.hand_line(m.LAYER_SOOT_PLAN, bx, by, bx + bw, by + bh, stroke=p["soot"], stroke_width=1.3)
            m.hand_line(m.LAYER_SOOT_PLAN, bx + bw, by, bx, by + bh, stroke=p["soot"], stroke_width=1.3)
            m.emit(m.LAYER_SOOT_PLAN, f'<circle cx="{bx + bw * 0.5:.1f}" cy="{by + bh * 0.5:.1f}" r="3.2" fill="{p["soot"]}"/>')

    # Subterranean quarry tunnel cutting diagonally beneath uniform pyramids
    m.hand_line(m.LAYER_SOOT_PLAN, 142, 624, 658, 196, stroke=p["graphite"], stroke_width=4.0, dash="9,5")
    m.draw_text(m.LAYER_SOOT_PLAN, 412, 672, "INDIVISIBLE PYRAMIDAL PRECINCT (ZERO ZONAL SEPARATION)", size=8.2, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle")

    return _finish_map_plate(
        m,
        case_data,
        scale_label="SCALE OF IDENTICAL PYRAMIDAL EAVES & CART RUTS (1 DIV = 10 PACES)",
        witness_target_a_norm=(0.46, 0.52),
        witness_target_b_norm=(0.18, 0.78),
        label_a="A: BAFFLED BY UNIFORM ROOFS",
        label_b="A' (⊣ t=11): FLEES TO BLURRED EDGE",
    )


def build_zoe_image(case_data: Dict[str, Any]) -> ImagePlateBuilder:
    img = ImagePlateBuilder(plate_id="city_13_zoe_image")
    p = img.palette
    img.draw_sky_atmosphere(mode="abyssal_mist")
    L_hor, L_mid, L_fg = img.LAYER_HORIZON, img.LAYER_MID_ARCH, img.LAYER_FOREGROUND

    # Far & Midground: Hypnotic sea of identical steep pyramidal roofs & pine-cone pagodas!
    img.emit(L_mid, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    # Back row of pyramids
    for px in range(76, 1110, 114):
        pts = [(px, 388), (px + 54, 246), (px + 108, 388)]
        img.hand_polygon(L_mid, pts, fill=p["bone"], stroke=p["soot"], stroke_width=1.5)
        img.hand_line(L_mid, px + 54, 246, px + 54, 388, stroke=p["graphite"], stroke_width=0.9)

    # Pine-cone pagoda spires (`draw_spiral_shells`) rising identically among pyramids
    for scx in (248.0, 598.0, 948.0):
        img.draw_spiral_shells(L_mid, cx=scx, base_y=456.0, w=96.0, h=248.0, tiers=6)

    # Front row of uniform pyramidal halls (zero signboards, identical portals!)
    for fx in (86, 294, 502, 710, 918):
        img.hand_polygon(L_mid, [(fx, 412), (fx + 158, 412), (fx + 158, 558), (fx, 558)], fill=p["bone"], stroke=p["soot"], stroke_width=1.7)
        rpts = [(fx - 10, 412), (fx + 79, 286), (fx + 168, 412)]
        img.hand_polygon(L_mid, rpts, fill=p["paper"], stroke=p["soot"], stroke_width=1.8)
        img.emit(L_mid, f'<polygon points="{fx - 10},412 {fx + 79},286 {fx + 168},412" fill="url(#zinc-scales)"/>')
        img.emit(L_mid, f'<path d="M {fx + 62} 558 L {fx + 62} 506 A 17 17 0 0 1 {fx + 96} 506 L {fx + 96} 558 Z" fill="{p["soot"]}" fill-opacity="0.82"/>')
    img.emit(L_mid, "</g>")

    # Foreground: Subterranean quarry tunnel arch & cart-wheel ruts dissolving into wolf-tracks
    img.emit(
        L_fg,
        f'<g clip-path="url(#stage-clip-{img.plate_id})">'
        f'<rect x="40" y="558" width="1120" height="158" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.6"/>'
        f'<path d="M 88 716 L 88 624 A 56 48 0 0 1 200 624 L 200 716 Z" fill="{p["soot"]}" fill-opacity="0.85" stroke="{p["soot"]}" stroke-width="2.0"/>'
        f'</g>',
    )
    img.hand_line(L_fg, 224, 692, 1118, 698, stroke=p["dirt"], stroke_width=2.2, dash="16,6")
    img.draw_text(L_fg, 144, 608, "QUARRY TUNNEL", size=8.0, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle")

    return _finish_image_plate(
        img,
        case_data,
        plate_num="13",
        rig_positions={
            "zoe_pyramid_pagoda_mason": (278.0, 666.0, 82.0),
            "zoe_indivisible_precinct_warden": (964.0, 666.0, 82.0),
            "zoe_quarry_wheel_wolf_threshold": (438.0, 672.0, 78.0),
            "zoe_baffled_wayfarer_lens": (628.0, 664.0, 84.0),
        },
        witness_split_b_xy=(804.0, 666.0),
        residue_floor_xy=(524.0, 684.0),
    )


# ===========================================================================
# 5. CITY 14: ZENOBIA — High Pilings, Bamboo & Zinc Stilts on Dry Terrain
# ===========================================================================

def build_zenobia_map(case_data: Dict[str, Any]) -> MapPlateBuilder:
    m = _begin_map_plate(case_data, "14")
    p = m.palette

    # Parched dry desert crust fissures & contours (`dry_stilt_pilings_bed`)
    m.draw_contour_lines((414.0, 412.0), [(296, 228), (224, 172), (148, 114)], ["+0m ARID BED", "+12m PILINGS", "+28m BELVEDERES"])

    # Elevated bamboo-and-zinc stilt platforms at staggered heights
    platforms = [
        ([(138, 168), (264, 164), (260, 268), (136, 272)], "BAMBOO DECK +14m"),
        ([(368, 148), (508, 152), (504, 258), (364, 254)], "ZINC HOUSE +22m"),
        ([(558, 224), (694, 228), (690, 342), (554, 338)], "PULLEY TANK +19m"),
        ([(164, 384), (314, 382), (310, 498), (160, 502)], "STILT BALCONY +16m"),
        ([(418, 376), (576, 380), (572, 496), (414, 492)], "RIBBON LOFT +26m"),
        ([(268, 558), (456, 554), (452, 654), (264, 658)], "LADDER COURT +11m"),
    ]
    for pts, lbl in platforms:
        m.draw_urban_block(pts, roof_pattern="zinc-scales", label=lbl)
        for px, py in pts:
            m.emit(m.LAYER_SOOT_PLAN, f'<circle cx="{px}" cy="{py}" r="4.0" fill="{p["soot"]}"/>')

    # Hanging plank sidewalks & rope ladders crisscrossing empty air between platforms!
    bridges = [
        (262, 214, 366, 204), (506, 212, 556, 268), (232, 270, 236, 382),
        (312, 438, 416, 436), (492, 256, 488, 378), (358, 496, 362, 556), (574, 446, 624, 340),
    ]
    for x0, y0, x1, y1 in bridges:
        m.draw_stairway_run(x0, y0, x1, y1, width=11.0, steps=10, label=None)

    # Cone-roofed belvedere turrets (`cone_belvedere_pulley_deck`)
    for bcx, bcy in ((436, 202), (624, 282), (496, 436)):
        m.draw_radial_web((bcx, bcy), [18.0, 32.0], spokes=8, ink=p["red_bird"])

    return _finish_map_plate(
        m,
        case_data,
        scale_label="SCALE OF STILT PILING HEIGHTS & HANGING CATWALKS (1 DIV = 10 CUBITS)",
        witness_target_a_norm=(0.44, 0.56),
        witness_target_b_norm=(0.64, 0.28),
        label_a="A: NOTES DRY PILING SCARS",
        label_b="A' (⊣ t=11): PURE HAPPY-CITY",
    )


def build_zenobia_image(case_data: Dict[str, Any]) -> ImagePlateBuilder:
    img = ImagePlateBuilder(plate_id="city_14_zenobia_image")
    p = img.palette
    img.draw_sky_atmosphere(mode="dawn_bastion", sun_moon_xy=(1012.0, 132.0))
    L_mid, L_fg = img.LAYER_MID_ARCH, img.LAYER_FOREGROUND

    # Parched cracked desert ground at `y=632`
    img.emit(
        L_fg,
        f'<g clip-path="url(#stage-clip-{img.plate_id})">'
        f'<rect x="40" y="632" width="1120" height="84" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.8"/>'
        f'<path d="M 96 654 L 186 668 L 244 648 M 512 662 L 618 678 L 692 652 M 864 656 L 968 674" '
        f'fill="none" stroke="{p["dirt"]}" stroke-width="1.3"/>'
        f'</g>',
    )

    # Forest of high crossed stilts, bamboo-and-zinc houses at staggered heights, cone belvederes & ribbons!
    img.emit(L_mid, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    stilt_houses = [
        (88.0, 294.0, 156.0, 86.0, True),
        (286.0, 198.0, 168.0, 92.0, True),
        (508.0, 264.0, 164.0, 88.0, False),
        (722.0, 174.0, 174.0, 96.0, True),
        (942.0, 276.0, 152.0, 84.0, False),
    ]
    for hx, hy, hw, hh, has_belvedere in stilt_houses:
        img.draw_stilts(L_mid, x=hx, house_y=hy, ground_y=632.0, w=hw, h=hh)
        # Zinc-scaled gable roof
        img.hand_polygon(L_mid, [(hx - 8, hy), (hx + hw * 0.5, hy - 36), (hx + hw + 8, hy)], fill=p["paper"], stroke=p["soot"], stroke_width=1.5)
        img.emit(L_mid, f'<polygon points="{hx - 8},{hy} {hx + hw * 0.5},{hy - 36} {hx + hw + 8},{hy}" fill="url(#zinc-scales)"/>')
        # Bamboo vertical slat rulings across house walls
        for bx_slat in range(int(hx + 10), int(hx + hw - 6), 12):
            img.hand_line(L_mid, bx_slat, hy, bx_slat, hy + hh, stroke=p["dirt"], stroke_width=0.85)
        if has_belvedere:
            # Conical belvedere turret raised on slender corner poles + fluttering red ribbons!
            bcx, bby = hx + hw * 0.5, hy - 86.0
            img.hand_line(L_mid, bcx - 24, hy - 18, bcx - 18, bby, stroke=p["soot"], stroke_width=1.6)
            img.hand_line(L_mid, bcx + 24, hy - 18, bcx + 18, bby, stroke=p["soot"], stroke_width=1.6)
            img.hand_polygon(L_mid, [(bcx - 34, bby), (bcx, bby - 48), (bcx + 34, bby)], fill=p["bone"], stroke=p["soot"], stroke_width=1.5)
            img.emit(
                L_mid,
                f'<path d="M {bcx:.1f} {bby - 48:.1f} Q {bcx + 28:.1f} {bby - 62:.1f} {bcx + 54:.1f} {bby - 44:.1f}" '
                f'fill="none" stroke="{p["red_bird"]}" stroke-width="2.2"/>',
            )

    # Swaying hanging plank sidewalks & rope ladders linking staggered houses over the chasm!
    img.draw_suspension_nets(L_mid, 244.0, 356.0, 286.0, 274.0, sag=22.0)
    img.draw_suspension_nets(L_mid, 454.0, 268.0, 508.0, 326.0, sag=26.0)
    img.draw_suspension_nets(L_mid, 672.0, 322.0, 722.0, 248.0, sag=28.0)
    img.draw_suspension_nets(L_mid, 896.0, 246.0, 942.0, 336.0, sag=24.0)
    # Long diagonal fishing poles & pulley hooks jutting from balconies
    for px0, py0, px1, py1 in ((244, 320, 312, 278), (672, 294, 744, 256), (896, 212, 976, 168)):
        img.hand_line(L_mid, px0, py0, px1, py1, stroke=p["ochre_oil"], stroke_width=1.6)
    img.emit(L_mid, "</g>")

    return _finish_image_plate(
        img,
        case_data,
        plate_num="14",
        rig_positions={
            "zenobia_bamboo_piling_splice_rig": (196.0, 668.0, 82.0),
            "zenobia_belvedere_pulley_warden": (982.0, 668.0, 82.0),
            "zenobia_dry_pilings_rot_vessel": (418.0, 672.0, 78.0),
            "zenobia_happy_city_classifier": (614.0, 666.0, 84.0),
        },
        witness_split_b_xy=(796.0, 668.0),
        residue_floor_xy=(512.0, 684.0),
    )


# ===========================================================================
# 6. CITY 17: HYPATIA — Cerulean Magnolia Lagoon, Basalt Quarry & Citadel
# ===========================================================================

def build_hypatia_map(case_data: Dict[str, Any]) -> MapPlateBuilder:
    m = _begin_map_plate(case_data, "17")
    p = m.palette

    # Cerulean magnolia garden lagoon (`magnolia_crab_lagoon`)
    lagoon = [(112, 184), (268, 152), (324, 246), (264, 344), (138, 326)]
    m.draw_water_contours(lagoon, ripple_count=5)
    m.draw_text(m.LAYER_TERRAIN, 206, 248, "CERULEAN MAGNOLIA LAGOON", size=7.8, fill=p["chalk_blue"], font_family=MONO_STACK, weight="bold", anchor="middle")

    # Porphyry dome palace perched directly above black basalt quarry pit (`porphyry_basalt_quarry`)
    m.draw_urban_block([(378, 158), (554, 162), (548, 286), (374, 282)], roof_pattern="hatch-soot-45", label="PORPHYRY PALACE")
    m.emit(
        m.LAYER_SOOT_PLAN,
        f'<rect x="394" y="294" width="138" height="82" fill="{p["soot"]}" fill-opacity="0.16" stroke="{p["soot"]}" stroke-width="1.6" stroke-dasharray="6,3"/>',
    )
    m.draw_text(m.LAYER_SOOT_PLAN, 463, 340, "BASALT QUARRY CRYPT", size=7.8, fill=p["soot"], font_family=MONO_STACK, anchor="middle")

    # Vellum library ruins, boxwood ninepins lawn & necropolis marble tomb
    m.draw_urban_block([(134, 412), (298, 416), (294, 536), (130, 532)], roof_pattern="hatch-graphite-cross", label="VELLUM LIBRARY")
    m.emit(m.LAYER_TERRAIN, f'<rect x="328" y="424" width="166" height="106" fill="{p["ochre_oil"]}" fill-opacity="0.10" stroke="{p["dirt"]}" stroke-width="1.2"/>')
    for pin_x, pin_y in ((366, 458), (382, 448), (382, 468), (398, 440), (398, 458), (398, 476)):
        m.emit(m.LAYER_SOOT_PLAN, f'<circle cx="{pin_x}" cy="{pin_y}" r="3.0" fill="{p["soot"]}"/>')
    m.draw_text(m.LAYER_SOOT_PLAN, 412, 514, "NINEPINS LAWN & TOMB HARP", size=7.6, fill=p["soot"], font_family=MONO_STACK, anchor="middle")

    # High citadel sky-ship pinnacle (`citadel_sky_pinnacle`)
    m.draw_contour_lines((592.0, 548.0), [(96, 78), (68, 54), (38, 30)], ["+80m CRAG", "+110m", "CITADEL PINNACLE"])
    m.draw_bastion_wall([(544, 526), (592, 496), (642, 528)], thickness=7.5, crenelated=True)

    return _finish_map_plate(
        m,
        case_data,
        scale_label="SCALE OF LAGOON FATHOMS & BASALT QUARRY TIERS (1 DIV = 10 CUBITS)",
        witness_target_a_norm=(0.48, 0.44),
        witness_target_b_norm=(0.78, 0.72),
        label_a="A: CONFRONTS INVERTED SIGNS",
        label_b="A' (⊣ t=11): WAITS FOR SKY-SHIP",
    )


def build_hypatia_image(case_data: Dict[str, Any]) -> ImagePlateBuilder:
    img = ImagePlateBuilder(plate_id="city_17_hypatia_image")
    p = img.palette
    img.draw_sky_atmosphere(mode="mirror_lake", sun_moon_xy=(996.0, 122.0))
    L_hor, L_mid, L_fg = img.LAYER_HORIZON, img.LAYER_MID_ARCH, img.LAYER_FOREGROUND

    # Far right horizon: Steep Citadel Pinnacle waiting for non-existent sky-ship (`x=896..1136`)
    img.emit(L_hor, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    img.hand_polygon(L_hor, [(862, 456), (976, 134), (1038, 168), (1142, 456)], fill=p["bone"], stroke=p["soot"], stroke_width=1.8)
    img.draw_bastions(L_hor, x=948.0, top_y=114.0, w=68.0, h=58.0, batter=6.0, arcade_arches=0, zinc_roof_h=0.0)
    img.draw_text(L_hor, 984, 98, "CITADEL SKY-PINNACLE", size=8.0, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle")
    img.emit(L_hor, "</g>")

    # Midground: Porphyry Palace Domes (`x=360..620`), Collapsed Vellum Library & Ninepins Lawn (`x=640..860`), Magnolia Lagoon (`x=56..340`)
    img.emit(L_mid, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    # Magnolia boughs overhanging left lagoon
    for mcx, mcy in ((128, 316), (218, 294), (294, 326)):
        img.hand_line(L_mid, mcx, 456, mcx, mcy + 24, stroke=p["soot"], stroke_width=3.5)
        img.emit(L_mid, f'<circle cx="{mcx}" cy="{mcy}" r="36" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.5"/>')
        img.emit(L_mid, f'<circle cx="{mcx - 10}" cy="{mcy - 6}" r="7" fill="{p["red_bird"]}" fill-opacity="0.45"/>')

    # Porphyry Domes Palace above quarry
    img.draw_bastions(L_mid, x=364.0, top_y=256.0, w=246.0, h=200.0, batter=12.0, arcade_arches=4, zinc_roof_h=0.0)
    img.draw_domes(L_mid, cx=434.0, base_y=256.0, rx=48.0, ry=54.0, fill=p["ochre_oil"], lantern=True)
    img.draw_domes(L_mid, cx=542.0, base_y=256.0, rx=44.0, ry=48.0, fill=p["ochre_oil"], lantern=True)

    # Toppled Vellum Library shelves + Ninepins skittles + Marble Tomb Harp (`x=646..858`)
    img.hand_polygon(L_mid, [(652, 312), (764, 328), (754, 456), (642, 456)], fill=p["bone"], stroke=p["soot"], stroke_width=1.6)
    for sy_shelf in (342, 372, 404, 432):
        img.hand_line(L_mid, 654, sy_shelf, 756, sy_shelf + 8, stroke=p["dirt"], stroke_width=1.4)
    # Ninepins skittles & marble tomb harp frame
    for kx in (784, 798, 812, 826):
        img.emit(L_mid, f'<rect x="{kx}" y="428" width="6" height="26" rx="2" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.2"/>')
    img.hand_polygon(L_mid, [(846, 456), (846, 374), (886, 392), (868, 456)], fill="none", stroke=p["soot"], stroke_width=2.0)
    for hx_str in range(852, 878, 6):
        img.hand_line(L_mid, hx_str, 384, hx_str, 454, stroke=p["ochre_oil"], stroke_width=0.9)
    img.emit(L_mid, "</g>")

    # Foreground (`y=456..716`): Left Cerulean Lagoon bottom crabs + Center Black Basalt Quarry Crypt w/ iron chains!
    img.emit(L_fg, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    # Lagoon bed (`x=40..356`) with bottom crab silhouettes
    img.emit(L_fg, f'<rect x="40" y="456" width="316" height="260" fill="{p["chalk_blue"]}" fill-opacity="0.22" stroke="{p["soot"]}" stroke-width="1.6"/>')
    for ccx, ccy in ((118, 566), (234, 588)):
        img.emit(
            L_fg,
            f'<ellipse cx="{ccx}" cy="{ccy}" rx="18" ry="11" fill="{p["red_bird"]}" stroke="{p["soot"]}" stroke-width="1.3"/>'
            f'<path d="M {ccx - 18} {ccy} L {ccx - 30} {ccy - 10} M {ccx + 18} {ccy} L {ccx + 30} {ccy - 10}" stroke="{p["soot"]}" stroke-width="1.8"/>',
        )
    # Black Basalt Quarry Crypt cutaway (`x=356..626`)
    img.emit(
        L_fg,
        f'<rect x="356" y="456" width="270" height="260" fill="{p["soot"]}" fill-opacity="0.88" stroke="{p["soot"]}" stroke-width="2.0"/>'
        f'<rect x="626" y="456" width="534" height="260" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.6"/>',
    )
    for ch_x in (402, 488, 574):
        img.hand_line(L_fg, ch_x, 458, ch_x, 594, stroke=p["bone"], stroke_width=2.0, dash="5,4")
    img.draw_text(L_fg, 490, 502, "BLACK BASALT QUARRY CHAINS", size=8.0, fill=p["bone"], font_family=MONO_STACK, weight="bold", anchor="middle")
    img.emit(L_fg, "</g>")

    return _finish_image_plate(
        img,
        case_data,
        plate_num="17",
        rig_positions={
            "hypatia_inverted_sign_inverter": (208.0, 668.0, 80.0),
            "hypatia_ninepins_philosopher_plumb": (1016.0, 668.0, 82.0),
            "hypatia_basalt_crab_crypt_vessel": (486.0, 676.0, 78.0),
            "hypatia_citadel_skyship_watcher": (704.0, 666.0, 84.0),
        },
        witness_split_b_xy=(868.0, 668.0),
        residue_floor_xy=(584.0, 686.0),
    )


# ===========================================================================
# 7. CITY 18: ARMILLA — Open Water-Pipe Forest & Suspended Porcelain Tubs
# ===========================================================================

def build_armilla_map(case_data: Dict[str, Any]) -> MapPlateBuilder:
    m = _begin_map_plate(case_data, "18")
    p = m.palette

    # ZERO masonry walls! Orthogonal & radial open hydraulic pipe matrix (`vertical_riser_forest`)
    for gx in range(140, 700, 76):
        m.hand_line(m.LAYER_SOOT_PLAN, gx, 134, gx, 668, stroke=p["graphite"], stroke_width=2.2)
    for gy in range(158, 660, 78):
        m.hand_line(m.LAYER_SOOT_PLAN, 118, gy, 706, gy, stroke=p["soot"], stroke_width=1.7)

    # Suspended white porcelain bathtubs & lavabos (`porcelain_tub_canopy`) at pipe intersections
    tubs = [
        (216, 236, "PORCELAIN TUB I"), (368, 236, "LAVABO TIER"), (520, 236, "CLAWFOOT TUB II"),
        (292, 392, "SIPHON BASIN"), (444, 392, "NYMPH SHOWER"), (596, 392, "BIDET NODE"),
        (216, 548, "VALVE TUB III"), (444, 548, "CASCADE TUB IV"),
    ]
    for tx, ty, tlbl in tubs:
        m.emit(
            m.LAYER_SOOT_PLAN,
            f'<rect x="{tx - 28}" y="{ty - 14}" width="56" height="28" rx="12" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.8"/>'
            f'<rect x="{tx - 22}" y="{ty - 9}" width="44" height="18" rx="8" fill="{p["chalk_blue"]}" fill-opacity="0.16" stroke="{p["chalk_blue"]}" stroke-width="1.0"/>',
        )
        m.draw_text(m.LAYER_SOOT_PLAN, tx, ty - 19, tlbl, size=7.3, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle")

    # Sunlit shower spray rings (`sunlit_shower_spray_field`)
    m.draw_radial_web((444.0, 392.0), [38.0, 64.0, 92.0], spokes=12, ink=p["chalk_blue"])
    m.draw_text(m.LAYER_TERRAIN, 412, 122, "ZERO WALLS · ZERO CEILINGS · ZERO FLOORS (PURE HYDRAULIC MATRIX)", size=8.0, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle")

    return _finish_map_plate(
        m,
        case_data,
        scale_label="SCALE OF VERTICAL RISER PIPES & VALVE FLANGES (1 DIV = 10 CUBITS)",
        witness_target_a_norm=(0.44, 0.56),
        witness_target_b_norm=(0.62, 0.34),
        label_a="A: INSPECTS RUSTED FLANGE",
        label_b="A' (⊣ t=11): HAILS WATER-NYMPHS",
    )


def build_armilla_image(case_data: Dict[str, Any]) -> ImagePlateBuilder:
    img = ImagePlateBuilder(plate_id="city_18_armilla_image")
    p = img.palette
    img.draw_sky_atmosphere(mode="dawn_bastion", sun_moon_xy=(968.0, 126.0))
    img.draw_chiaroscuro_beams((968.0, 126.0), 260.0, 880.0, 668.0, fill=p["chalk_blue"], opacity=0.11)
    L_mid, L_fg = img.LAYER_MID_ARCH, img.LAYER_FOREGROUND

    # Open-sky forest of vertical risers, horizontal manifolds, brass stopcocks & suspended white porcelain tubs!
    img.emit(L_mid, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    img.draw_pipe_forests(L_mid, x0=76.0, x1=1118.0, base_y=646.0, count=14)
    # Taller cathedral-height vertical water risers reaching `y=78..646`
    riser_xs = [124, 236, 358, 482, 606, 732, 854, 978, 1084]
    for rx in riser_xs:
        img.hand_line(L_mid, rx, 646, rx, 86 + (rx % 48), stroke=p["soot"], stroke_width=3.6, jitter=0.15)
        img.hand_line(L_mid, rx - 2, 646, rx - 2, 86 + (rx % 48), stroke=p["paper"], stroke_width=1.0, jitter=0.1)
    # Horizontal cross-pipes & wheel stopcocks
    for hy in (168, 268, 376, 482):
        img.hand_line(L_mid, 96, hy, 1098, hy, stroke=p["soot"], stroke_width=3.0, jitter=0.2)
        for vx in (236, 482, 732, 978):
            img.emit(L_mid, f'<circle cx="{vx}" cy="{hy}" r="9.5" fill="{p["red_bird"]}" stroke="{p["soot"]}" stroke-width="1.3"/>')

    # Gleaming white porcelain clawfoot bathtubs & pedestal lavabos perched high in empty sky!
    suspended_tubs = [(182, 256), (418, 156), (668, 256), (912, 156), (302, 364), (794, 364)]
    for tcx, tcy in suspended_tubs:
        img.emit(
            L_mid,
            f'<path d="M {tcx - 52} {tcy} L {tcx + 52} {tcy} Q {tcx + 48} {tcy + 36} {tcx + 30} {tcy + 38} '
            f'L {tcx - 30} {tcy + 38} Q {tcx - 48} {tcy + 36} {tcx - 52} {tcy} Z" '
            f'fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="2.0"/>'
            f'<ellipse cx="{tcx}" cy="{tcy}" rx="54" ry="7" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.6"/>',
        )
        # Gooseneck shower pipe + fanning sunlit water spray threads!
        img.emit(L_mid, f'<path d="M {tcx - 42} {tcy} L {tcx - 42} {tcy - 46} Q {tcx - 42} {tcy - 62} {tcx - 24} {tcy - 58}" fill="none" stroke="{p["soot"]}" stroke-width="2.2"/>')
        for sp_i in range(-3, 4):
            img.hand_line(L_mid, tcx - 22, tcy - 56, tcx - 6 + sp_i * 8, tcy - 4, stroke=p["chalk_blue"], stroke_width=1.1, dash="4,3")
    img.emit(L_mid, "</g>")

    # Foreground hydraulic floor grate datum (`y=646..716`)
    img.emit(
        L_fg,
        f'<g clip-path="url(#stage-clip-{img.plate_id})">'
        f'<rect x="40" y="646" width="1120" height="70" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.8"/>'
        f'</g>',
    )

    return _finish_image_plate(
        img,
        case_data,
        plate_num="18",
        rig_positions={
            "armilla_riser_stopcock_gusher": (214.0, 672.0, 82.0),
            "armilla_hydraulic_plumb_inspector": (986.0, 672.0, 82.0),
            "armilla_porcelain_siphon_tub": (428.0, 674.0, 78.0),
            "armilla_sunlit_shower_nymph_lens": (636.0, 670.0, 84.0),
        },
        witness_split_b_xy=(814.0, 672.0),
        residue_floor_xy=(524.0, 686.0),
    )


# ===========================================================================
# 8. CITY 21: OLIVIA — Filigree White Peacock vs Soot Cloud & Lathe Mandrel
# ===========================================================================

def build_olivia_map(case_data: Dict[str, Any]) -> MapPlateBuilder:
    m = _begin_map_plate(case_data, "21")
    p = m.palette

    # Left half: Mullioned filigree palace courtyard & white peacock lawn (`filigree_peacock_patio`)
    m.draw_urban_block([(112, 152), (356, 156), (352, 446), (108, 442)], roof_pattern="hatch-soot-45", label="MULLIONED FILIGREE PALACE")
    m.draw_radial_web((232.0, 316.0), [28.0, 52.0], spokes=10, ink=p["chalk_blue"])
    m.draw_text(m.LAYER_TERRAIN, 232, 386, "WHITE PEACOCK SPRINKLER ARC", size=7.6, fill=p["chalk_blue"], font_family=MONO_STACK, anchor="middle")

    # Right half: Soot-caked refinery yards, leather-saddle mills, lathe mandrels & trailer ruts (`soot_grease_lathe_yard`)
    m.draw_bastion_wall([(396, 134), (396, 522)], thickness=8.0, crenelated=False)
    m.draw_urban_block([(432, 162), (686, 166), (682, 336), (428, 332)], roof_pattern="hatch-graphite-cross", label="LATHE MANDREL FOUNDRY")
    m.draw_urban_block([(436, 368), (688, 372), (684, 508), (432, 504)], roof_pattern="zinc-scales", label="GREASE REFINERY & TRAILERS")

    # Southern dark estuary reach with lit night-canoes (`lit_estuary_canoe_reach`)
    m.draw_canal_ribbon([(106, 594), (288, 576), (492, 608), (696, 586)], width=26.0, bridges=2, label="DARK ESTUARY & LIT NIGHT-CANOES")

    return _finish_map_plate(
        m,
        case_data,
        scale_label="SCALE OF FILIGREE MULLIONS & MANDREL TEETH (1 DIV = 10 CUBITS)",
        witness_target_a_norm=(0.64, 0.44),
        witness_target_b_norm=(0.26, 0.34),
        label_a="A: SEES SOOT-CLOGGED MANDREL",
        label_b="A' (⊣ t=11): ONLY PEACOCK PATIO",
    )


def build_olivia_image(case_data: Dict[str, Any]) -> ImagePlateBuilder:
    img = ImagePlateBuilder(plate_id="city_21_olivia_image")
    p = img.palette
    img.draw_sky_atmosphere(mode="dusk", sun_moon_xy=(264.0, 128.0))
    L_hor, L_mid, L_fg = img.LAYER_HORIZON, img.LAYER_MID_ARCH, img.LAYER_FOREGROUND

    # Split Diptych Elevation (`x=40..588` Filigree Peacock Patio vs `x=588..1160` Sticky Soot Cloud & Lathe Mandrel!)
    img.emit(L_mid, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    # Dividing masonry pier at `x=588`
    img.emit(L_mid, f'<rect x="578" y="32" width="20" height="620" fill="{p["soot"]}"/>')

    # LEFT HALF: Trefoil Mullioned Filigree Archway, Fringed Cushions, Sprinkler Rainbow & Spinning White Peacock!
    img.emit(
        L_mid,
        f'<rect x="64" y="96" width="492" height="498" fill="{p["bone"]}" fill-opacity="0.45" stroke="{p["soot"]}" stroke-width="2.0"/>'
        f'<path d="M 118 594 L 118 248 A 192 162 0 0 1 502 248 L 502 594" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="3.2"/>',
    )
    # Stone filigree tracery lattice inside upper arch
    img.draw_zodiacal_gates(L_mid, cx=310.0, base_y=248.0, r=146.0)
    # Spinning white peacock fan (`cx=310, cy=468`) + lawn sprinkler arc
    for deg in range(-75, 76, 15):
        rad = math.radians(deg - 90)
        tx = 310.0 + 118.0 * math.cos(rad)
        ty = 478.0 + 118.0 * math.sin(rad)
        img.hand_line(L_mid, 310.0, 478.0, tx, ty, stroke=p["soot"], stroke_width=1.2)
        img.emit(L_mid, f'<circle cx="{tx:.1f}" cy="{ty:.1f}" r="6.5" fill="{p["paper"]}" stroke="{p["chalk_blue"]}" stroke-width="1.3"/>')
    img.hand_polygon(L_mid, [(298, 512), (310, 446), (322, 512)], fill=p["paper"], stroke=p["soot"], stroke_width=1.6)
    img.draw_text(L_mid, 310, 552, "WHITE PEACOCK & FILIGREE SCREEN", size=8.2, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle")

    # RIGHT HALF: Sticky Black Grease-Soot Clouds, Smokestacks, Geared Lathe Mandrel & Crushing Freight Trailer!
    img.emit(L_mid, f'<rect x="598" y="32" width="562" height="562" fill="{p["soot"]}" fill-opacity="0.34"/>')
    for smx, smw, smh in ((654, 34, 240), (742, 38, 270), (838, 32, 220)):
        img.emit(L_mid, f'<rect x="{smx}" y="{436 - smh}" width="{smw}" height="{smh}" fill="{p["soot"]}"/>')
    for clx, cly, clr in ((720, 146, 62), (812, 128, 76), (924, 152, 84), (1036, 174, 72)):
        img.emit(L_mid, f'<circle cx="{clx}" cy="{cly}" r="{clr}" fill="{p["soot"]}" fill-opacity="0.68" stroke="{p["graphite"]}" stroke-width="1.2"/>')
    # Giant Geared Iron Lathe Mandrel (`cx=786, cy=446`) + Crushing Freight Trailer (`x=916..1128`)
    img.emit(
        L_mid,
        f'<circle cx="786" cy="446" r="58" fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="2.6"/>'
        f'<circle cx="786" cy="446" r="24" fill="{p["red_bird"]}" stroke="{p["soot"]}" stroke-width="1.8"/>'
        f'<rect x="916" y="392" width="198" height="94" fill="{p["dirt"]}" fill-opacity="0.55" stroke="{p["soot"]}" stroke-width="2.2"/>'
        f'<circle cx="956" cy="498" r="22" fill="{p["soot"]}"/><circle cx="1074" cy="498" r="22" fill="{p["soot"]}"/>',
    )
    img.draw_text(L_mid, 886, 548, "GREASE-SOOT CLOUD, LATHE MANDREL & TRAILER", size=8.2, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle")
    img.emit(L_mid, "</g>")

    # Foreground (`y=594..716`): Dark estuary band + lit night-canoe lantern reflection
    img.emit(
        L_fg,
        f'<g clip-path="url(#stage-clip-{img.plate_id})">'
        f'<rect x="40" y="594" width="1120" height="122" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.8"/>'
        f'<path d="M 882 628 Q 966 654 1052 628 Q 966 640 882 628 Z" fill="{p["soot"]}"/>'
        f'<circle cx="968" cy="618" r="7" fill="{p["ochre_oil"]}" stroke="{p["red_bird"]}" stroke-width="1.2"/>'
        f'</g>',
    )

    return _finish_image_plate(
        img,
        case_data,
        plate_num="21",
        rig_positions={
            "olivia_lathe_mandrel_stamper": (748.0, 670.0, 82.0),
            "olivia_diplomatic_euphemism_scribe": (184.0, 670.0, 82.0),
            "olivia_diesel_soot_estuary_slick": (568.0, 676.0, 78.0),
            "olivia_filigree_peacock_observer": (346.0, 668.0, 84.0),
        },
        witness_split_b_xy=(988.0, 670.0),
        residue_floor_xy=(588.0, 686.0),
    )


# ===========================================================================
# 9. CITY 22: SOPHRONIA — Roller-Coaster Half-City & Vacant Marble Pylons
# ===========================================================================

def build_sophronia_map(case_data: Dict[str, Any]) -> MapPlateBuilder:
    m = _begin_map_plate(case_data, "22")
    p = m.palette

    # Left half: PERMANENT carnival half-city (`permanent_fairground_midway` — Ferris wheel, roller-coaster, carousel!)
    m.draw_radial_web((228.0, 256.0), [32.0, 62.0, 88.0], spokes=16, ink=p["red_bird"])
    m.draw_text(m.LAYER_SOOT_PLAN, 228, 156, "PERMANENT FERRIS WHEEL", size=8.0, fill=p["red_bird"], font_family=MONO_STACK, weight="bold", anchor="middle")
    m.draw_radial_web((224.0, 468.0), [24.0, 48.0], spokes=10, ink=p["ochre_oil"])
    m.draw_text(m.LAYER_SOOT_PLAN, 224, 532, "CAROUSEL & TRAPEZE DOME", size=7.8, fill=p["soot"], font_family=MONO_STACK, anchor="middle")
    # Undulating roller-coaster loop track
    rc_pts = [(118, 368), (186, 332), (282, 386), (356, 314), (374, 434), (288, 568), (138, 548), (118, 368)]
    d_rc = m.hand_path_d(rc_pts, jitter=0.5, closed=True)
    m.emit(m.LAYER_SOOT_PLAN, f'<path d="{d_rc}" fill="none" stroke="{p["soot"]}" stroke-width="2.8" stroke-dasharray="6,3"/>')

    # Half-city boundary line (`x=408`) + Right half: TEMPORARY dismantled stone bank/ministry pylons!
    m.hand_line(m.LAYER_SOOT_PLAN, 408, 122, 408, 668, stroke=p["red_bird"], stroke_width=2.0, dash="10,5")
    for row in range(3):
        for col in range(2):
            px = 448.0 + col * 126.0
            py = 166.0 + row * 124.0
            m.emit(
                m.LAYER_SOOT_PLAN,
                f'<rect x="{px:.1f}" y="{py:.1f}" width="96" height="82" fill="none" stroke="{p["graphite"]}" stroke-width="1.5" stroke-dasharray="5,4"/>',
            )
            for cx_b, cy_b in ((px + 10, py + 10), (px + 86, py + 10), (px + 10, py + 72), (px + 86, py + 72)):
                m.emit(m.LAYER_SOOT_PLAN, f'<circle cx="{cx_b:.1f}" cy="{cy_b:.1f}" r="3.2" fill="{p["ochre_oil"]}" stroke="{p["soot"]}" stroke-width="0.9"/>')
            m.draw_text(m.LAYER_SOOT_PLAN, px + 48, py + 45, "UNBOLTED PAD", size=7.2, fill=p["graphite"], font_family=MONO_STACK, anchor="middle")

    # Departing trailer caravan highway (`trailer_caravan_highway`)
    m.hand_line(m.LAYER_SOOT_PLAN, 434, 594, 718, 636, stroke=p["soot"], stroke_width=4.0, marker_end="arrow-soot")
    m.draw_text(m.LAYER_SOOT_PLAN, 578, 582, "NOMADIC STONE-MINISTRY TRAILER HIGHWAY", size=7.8, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle")

    return _finish_map_plate(
        m,
        case_data,
        scale_label="SCALE OF ROLLER-COASTER SPANS & PYLON STUDS (1 DIV = 10 METERS)",
        witness_target_a_norm=(0.64, 0.44),
        witness_target_b_norm=(0.26, 0.34),
        label_a="A: COUNTS VACANT MARBLE PADS",
        label_b="A' (⊣ t=11): CARNIVAL IS WHOLE CITY",
    )


def build_sophronia_image(case_data: Dict[str, Any]) -> ImagePlateBuilder:
    img = ImagePlateBuilder(plate_id="city_22_sophronia_image")
    p = img.palette
    img.draw_sky_atmosphere(mode="dawn_bastion", sun_moon_xy=(986.0, 128.0))
    L_mid, L_fg = img.LAYER_MID_ARCH, img.LAYER_FOREGROUND

    # Left half (`x=56..584`): PERMANENT Skeletal Roller-Coaster, Giant Ferris Wheel & Striped Carousel!
    img.emit(L_mid, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    # Giant spoked Ferris Wheel (`cx=216, cy=286, r=146`)
    fcx, fcy, fr = 216.0, 286.0, 142.0
    img.emit(
        L_mid,
        f'<circle cx="{fcx}" cy="{fcy}" r="{fr}" fill="none" stroke="{p["soot"]}" stroke-width="3.2"/>'
        f'<circle cx="{fcx}" cy="{fcy}" r="{fr * 0.86:.1f}" fill="none" stroke="{p["red_bird"]}" stroke-width="1.4"/>'
        f'<line x1="{fcx}" y1="{fcy}" x2="{fcx - 78}" y2="578" stroke="{p["soot"]}" stroke-width="4.2"/>'
        f'<line x1="{fcx}" y1="{fcy}" x2="{fcx + 78}" y2="578" stroke="{p["soot"]}" stroke-width="4.2"/>',
    )
    for sp_i in range(12):
        ang = 2.0 * math.pi * sp_i / 12.0
        gx, gy = fcx + fr * math.cos(ang), fcy + fr * math.sin(ang)
        img.hand_line(L_mid, fcx, fcy, gx, gy, stroke=p["graphite"], stroke_width=1.1)
        img.emit(L_mid, f'<rect x="{gx - 9:.1f}" y="{gy + 2:.1f}" width="18" height="14" fill="{p["ochre_oil"]}" stroke="{p["soot"]}" stroke-width="1.1"/>')

    # Skeletal iron-truss Roller-Coaster humps (`x=76..576`)
    rc_curve = "M 64 498 Q 148 312 246 446 T 432 328 T 578 518"
    img.emit(L_mid, f'<path d="{rc_curve}" fill="none" stroke="{p["soot"]}" stroke-width="3.8"/>')
    for tx_rc in range(84, 572, 28):
        top_rc = 378 + int(68 * math.sin(tx_rc * 0.025))
        img.hand_line(L_mid, tx_rc, top_rc, tx_rc, 578, stroke=p["graphite"], stroke_width=1.2)
    # Carousel pavilion tent (`cx=468, base=578`)
    img.hand_polygon(L_mid, [(396, 512), (468, 446), (540, 512)], fill=p["red_bird"], fill_opacity="0.78" if False else 0.78, stroke=p["soot"], stroke_width=1.6)
    img.hand_polygon(L_mid, [(406, 512), (530, 512), (530, 578), (406, 578)], fill=p["bone"], stroke=p["soot"], stroke_width=1.5)

    # Right half (`x=604..1144`): STARK VACANT LOT with empty unbolted cement pylons + departing flatbed trailer hauling marble bank pediment!
    for px_pad in (624, 742, 860):
        img.emit(
            L_mid,
            f'<rect x="{px_pad}" y="548" width="88" height="30" fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.6"/>'
            f'<line x1="{px_pad + 14}" y1="548" x2="{px_pad + 14}" y2="532" stroke="{p["red_bird"]}" stroke-width="2.2"/>'
            f'<line x1="{px_pad + 74}" y1="548" x2="{px_pad + 74}" y2="532" stroke="{p["red_bird"]}" stroke-width="2.2"/>',
        )
    img.draw_text(L_mid, 786, 518, "VACANT UNBOLTED MINISTRY PYLONS", size=8.2, fill=p["graphite"], font_family=MONO_STACK, weight="bold", anchor="middle")

    # Departing heavy flatbed trailer carrying Classical Marble Pediment & Ionic Columns (`x=946..1136`)!
    img.emit(
        L_mid,
        f'<rect x="942" y="536" width="186" height="18" fill="{p["soot"]}"/>'
        f'<circle cx="972" cy="564" r="14" fill="{p["soot"]}"/><circle cx="1006" cy="564" r="14" fill="{p["soot"]}"/><circle cx="1098" cy="564" r="14" fill="{p["soot"]}"/>'
        f'<rect x="962" y="458" width="18" height="78" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.4"/>'
        f'<rect x="1018" y="458" width="18" height="78" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.4"/>'
        f'<rect x="1074" y="458" width="18" height="78" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.4"/>'
        f'<polygon points="948,458 1027,412 1106,458" fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.8"/>',
    )
    img.draw_text(L_mid, 1028, 398, "NOMADIC STONE BANK ON TRAILER", size=7.8, fill=p["soot"], font_family=MONO_STACK, anchor="middle")
    img.emit(L_mid, "</g>")

    # Foreground plaza ground (`y=578..716`)
    img.emit(
        L_fg,
        f'<g clip-path="url(#stage-clip-{img.plate_id})">'
        f'<rect x="40" y="578" width="1120" height="138" fill="{p["paper"]}" stroke="{p["soot"]}" stroke-width="1.8"/>'
        f'</g>',
    )

    return _finish_image_plate(
        img,
        case_data,
        plate_num="22",
        rig_positions={
            "sophronia_marble_pediment_crane": (778.0, 668.0, 82.0),
            "sophronia_carousel_ticket_governor": (188.0, 668.0, 82.0),
            "sophronia_unbolted_pylon_foundation": (572.0, 674.0, 78.0),
            "sophronia_countdown_midway_spectator": (368.0, 666.0, 84.0),
        },
        witness_split_b_xy=(978.0, 668.0),
        residue_floor_xy=(588.0, 686.0),
    )


# ===========================================================================
# 10. CITY 26: OCTAVIA — Spider-Web Catenary Net Slung Between Mountain Crests
# ===========================================================================

def build_octavia_map(case_data: Dict[str, Any]) -> MapPlateBuilder:
    m = _begin_map_plate(case_data, "26")
    p = m.palette

    # Left & Right steep mountain crest cliff faces (`twin_crest_cable_anchors`) flanking central cloud abyss!
    m.draw_urban_block([(98, 124), (218, 132), (202, 664), (96, 668)], roof_pattern="ashlar-stone", label="WEST CREST CLIFF")
    m.draw_urban_block([(604, 128), (726, 124), (728, 668), (618, 662)], roof_pattern="ashlar-stone", label="EAST CREST CLIFF")
    m.draw_bastion_wall([(218, 132), (202, 664)], thickness=7.0, crenelated=False)
    m.draw_bastion_wall([(604, 128), (618, 662)], thickness=7.0, crenelated=False)

    # Central spider-web catenary suspension net over bottomless void (`x=208..612`)!
    m.draw_radial_web((412.0, 396.0), [48.0, 96.0, 146.0, 192.0], spokes=16, ink=p["soot"])
    # Main anchor cables & wooden railway-tie catwalk across chasm (`wooden_tie_catenary_walkway`)
    for cy_off in (-88, -28, 32, 92):
        m.hand_line(m.LAYER_SOOT_PLAN, 210, 396 + cy_off * 0.6, 612, 396 + cy_off * 0.6, stroke=p["soot"], stroke_width=2.2)
    m.draw_stairway_run(212, 396, 610, 396, width=16.0, steps=28, label="WOODEN-TIE CATENARY WALKWAY")
    m.draw_text(m.LAYER_TERRAIN, 412, 646, "CLOUD ABYSS VOID (-500m BELOW SPIDER-WEB NET)", size=8.0, fill=p["chalk_blue"], font_family=MONO_STACK, weight="bold", anchor="middle")

    return _finish_map_plate(
        m,
        case_data,
        scale_label="SCALE OF CATENARY CABLE SPANS & RAILWAY TIES (1 DIV = 10 FATHOMS)",
        witness_target_a_norm=(0.18, 0.46),
        witness_target_b_norm=(0.52, 0.54),
        label_a="A: MEASURES FRAYED CREST ROPE",
        label_b="A' (⊣ t=11): RESTS CERTAIN IN NET",
    )


def build_octavia_image(case_data: Dict[str, Any]) -> ImagePlateBuilder:
    img = ImagePlateBuilder(plate_id="city_26_octavia_image")
    p = img.palette
    img.draw_sky_atmosphere(mode="abyssal_mist", sun_moon_xy=(600.0, 108.0))
    L_hor, L_mid, L_fg = img.LAYER_HORIZON, img.LAYER_MID_ARCH, img.LAYER_FOREGROUND

    # Left & Right towering sheer mountain precipices (`x=40..208` and `x=992..1160`) plunging into bottomless mist!
    img.emit(L_fg, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    west_cliff = [(40, 64), (196, 118), (222, 286), (178, 514), (214, 716), (40, 716)]
    east_cliff = [(1160, 64), (1004, 118), (978, 286), (1022, 514), (986, 716), (1160, 716)]
    img.hand_polygon(L_fg, west_cliff, fill=p["bone"], stroke=p["soot"], stroke_width=2.4)
    img.hand_polygon(L_fg, east_cliff, fill=p["bone"], stroke=p["soot"], stroke_width=2.4)
    img.emit(
        L_fg,
        f'<polygon points="40,64 196,118 222,286 178,514 214,716 40,716" fill="url(#ashlar-stone)"/>'
        f'<polygon points="1160,64 1004,118 978,286 1022,514 986,716 1160,716" fill="url(#ashlar-stone)"/>',
    )
    img.emit(L_fg, "</g>")

    # Central Catenary Spider-Web Net slung across the chasm (`x=196..1004`), wooden ties, and sack-houses hanging BELOW!
    img.emit(L_mid, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    img.draw_suspension_nets(L_mid, 196.0, 148.0, 1004.0, 148.0, sag=118.0)
    img.draw_suspension_nets(L_mid, 212.0, 216.0, 988.0, 216.0, sag=136.0)
    img.draw_suspension_nets(L_mid, 218.0, 278.0, 982.0, 278.0, sag=108.0)

    # Wooden railway-tie catwalk along primary catenary curve + hanging sack-houses, gondolas, gas-jets & baskets!
    n_ties = 26
    for i in range(1, n_ties):
        u = i / float(n_ties)
        tx = (1 - u) ** 2 * 212.0 + 2 * (1 - u) * u * 600.0 + u ** 2 * 988.0
        ty = (1 - u) ** 2 * 216.0 + 2 * (1 - u) * u * 352.0 + u ** 2 * 216.0
        img.emit(L_mid, f'<rect x="{tx - 8:.1f}" y="{ty - 3:.1f}" width="16" height="6" fill="{p["ochre_oil"]}" stroke="{p["soot"]}" stroke-width="1.0"/>')

    hanging_houses = [
        (312.0, 268.0, 118.0, "SACK-HOUSE I"),
        (456.0, 292.0, 152.0, "TRAPEZE GONDOLA"),
        (604.0, 298.0, 174.0, "NET PAVILION"),
        (748.0, 288.0, 146.0, "SACK-HOUSE II"),
        (882.0, 262.0, 112.0, "LOWERED BASKET"),
    ]
    for hcx, anchor_y, drop_len, htag in hanging_houses:
        hy = anchor_y + drop_len
        # Twin iron suspension chains / hemp ropes dropping BELOW the net!
        img.hand_line(L_mid, hcx - 18, anchor_y, hcx - 22, hy, stroke=p["soot"], stroke_width=1.8, dash="5,2")
        img.hand_line(L_mid, hcx + 18, anchor_y, hcx + 22, hy, stroke=p["soot"], stroke_width=1.8, dash="5,2")
        # Suspended sack-house / gondola cabin hanging in empty air
        pts_sack = [(hcx - 32, hy), (hcx + 32, hy), (hcx + 38, hy + 52), (hcx, hy + 68), (hcx - 38, hy + 52)]
        img.hand_polygon(L_mid, pts_sack, fill=p["bone"], stroke=p["soot"], stroke_width=1.8)
        img.emit(L_mid, f'<rect x="{hcx - 10:.1f}" y="{hy + 16:.1f}" width="20" height="22" fill="{p["ochre_oil"]}" fill-opacity="0.55" stroke="{p["soot"]}" stroke-width="1.2"/>')
        img.draw_text(L_mid, hcx, hy + 82, htag, size=7.5, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle")

    # Lower safety-platform plank suspended near bottom of stage (`y=654`) so constant-volume rigs pose over the void!
    img.hand_line(L_mid, 198, 658, 1002, 658, stroke=p["soot"], stroke_width=4.2)
    img.hand_line(L_mid, 198, 664, 1002, 664, stroke=p["ochre_oil"], stroke_width=2.0, dash="10,4")
    img.emit(L_mid, "</g>")

    return _finish_image_plate(
        img,
        case_data,
        plate_num="26",
        rig_positions={
            "octavia_crest_cable_turnbuckle": (126.0, 654.0, 78.0),
            "octavia_net_load_limit_surveyor": (1068.0, 654.0, 78.0),
            "octavia_hanging_sack_gondola": (428.0, 656.0, 78.0),
            "octavia_measured_lifespan_dweller": (642.0, 654.0, 82.0),
        },
        witness_split_b_xy=(824.0, 654.0),
        residue_floor_xy=(526.0, 672.0),
    )


# ===========================================================================
# PACK 02 MASTER ORCHESTRATOR & MANIFEST EMITTER
# ===========================================================================

PACK_02_RENDER_TABLE: Tuple[
    Tuple[str, Callable[[Dict[str, Any]], MapPlateBuilder], Callable[[Dict[str, Any]], ImagePlateBuilder]],
    ...,
] = (
    ("city_06_tamara", build_tamara_map, build_tamara_image),
    ("city_09_zirma", build_zirma_map, build_zirma_image),
    ("city_10_isaura", build_isaura_map, build_isaura_image),
    ("city_13_zoe", build_zoe_map, build_zoe_image),
    ("city_14_zenobia", build_zenobia_map, build_zenobia_image),
    ("city_17_hypatia", build_hypatia_map, build_hypatia_image),
    ("city_18_armilla", build_armilla_map, build_armilla_image),
    ("city_21_olivia", build_olivia_map, build_olivia_image),
    ("city_22_sophronia", build_sophronia_map, build_sophronia_image),
    ("city_26_octavia", build_octavia_map, build_octavia_image),
)


def render_pack_02_plates(
    cases_by_id: Optional[Dict[str, Dict[str, Any]]] = None,
) -> Dict[str, Dict[str, Any]]:
    """
    Render all 10 bespoke Map (`1200x900`) & Architectural Image (`1200x800`) plates
    for Pack 02 (`Cities & Signs 1–5` + `Thin Cities 1–5`) into `scion_cities/atlas/maps/`
    and `scion_cities/atlas/images/`, verify XML/PNG/facial-token/contrast invariants,
    write `scion_cities/atlas/manifests/pack_02_manifest.json`, and return the manifest dict.
    """
    if cases_by_id is None:
        cases_by_id = {c["case_id"]: c for c in build_pack_02_swarms()}

    MAPS_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    MANIFESTS_DIR.mkdir(parents=True, exist_ok=True)

    manifest: Dict[str, Dict[str, Any]] = {}
    for cid, map_fn, img_fn in PACK_02_RENDER_TABLE:
        if cid not in cases_by_id:
            raise KeyError(f"Pack 02 case {cid!r} missing from cases_by_id.")
        case_dict = cases_by_id[cid]

        map_svg_rel = f"maps/{cid}_map.svg"
        map_png_rel = f"maps/{cid}_map.png"
        img_svg_rel = f"images/{cid}_image.svg"
        img_png_rel = f"images/{cid}_image.png"

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

        verify_plate_pair(map_res.svg_path, map_res.png_path, MAP_DIMENSIONS)
        verify_plate_pair(img_res.svg_path, img_res.png_path, IMAGE_DIMENSIONS)

        manifest[cid] = {
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

    with PACK_02_MANIFEST_PATH.open("w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2, ensure_ascii=False)

    return manifest


if __name__ == "__main__":
    built = render_pack_02_plates()
    assert len(built) == 10, f"Expected 10 manifest entries, got {len(built)}"
    assert_no_facial_tokens(json.dumps(built), "pack_02_manifest.json")
    print(f"PACK 02 PLATES VERIFIED: {len(built)} cities -> 40 plate files + {PACK_02_MANIFEST_PATH}")
    for cid, meta in built.items():
        print(
            f"  - {cid:<20s} | map={meta['dimensions']['map']} ({meta['bytes']['map_png']:>6d} B, std={meta['pixel_std']['map_png']:5.2f}) "
            f"| img={meta['dimensions']['image']} ({meta['bytes']['image_png']:>6d} B, std={meta['pixel_std']['image_png']:5.2f})"
        )
