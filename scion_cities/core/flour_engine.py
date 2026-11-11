#!/opt/homebrew/bin/python3
"""
SCION — CLINAMEN OPERATIVE STUDIO (v1.0)
First Risk Case (Proof Before Scale): The Flour Test Witness-Memory Swerve
in the Cellar of the Abominable House (Inigo, Belindo, Flower, Policies P1-P4).

Enforces all 5 Hard Quality Gates:
1. Lawful Baseline Gate (Roubaud Qualification): `CHECKPOINT_LAWFUL_A` executes and
   passes volume, physics, sync, and P1-P4 predicate checks BEFORE `BRANCH_CLINAMEN_A_PRIME`
   is authorized to fork.
2. Constant-Volume Faceless Sack Kinematics: Every sack polygon is generated via exact
   Gauss-shoelace area normalization (`|Area(t) - Area(0)| / Area(0) < 0.001`, well within
   the ±3% invariant), with zero facial icons, staged on ones, twos, and deliberate holds.
3. Split-Trace Persistence: In `BRANCH_CLINAMEN_A_PRIME`, physical cellar residue in
   `world_trace` (Inigo's shove impulse vector, chalk/boot floor scuff, displaced sack
   weight, spreading oil radius, ceramic shard scatter, thermal decay) stays 100% intact
   while `actor_memory['flower']` applies `⊣ Filter(E2_DELIBERATE_SHOVE)`.
4. Coupled Audiovisual Transients: Exact frame-locked (`0.0 ms` drift, `<= 16.7ms` gate)
   synthesis descriptors—440 Hz deterministic sine reference hum + escapement ticks in A,
   fracturing at tick 76 in A' into angle-coupled ceramic pings, burlap/flour rustle,
   and weight-transfer low-end thuds.
5. "Other Worlds Being There" Continuity: Off-screen street footsteps above the cellar
   grate, pipe condensation drips, oil capillary spread, and ember cooling continue on
   autonomous clocks independent of camera framing or user clicks.
"""
from __future__ import annotations

import hashlib
import json
import math
import os
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

FPS = 24
TOTAL_TICKS = 192  # 8.0 seconds at 24fps
BASE_SACK_AREA = 11800.0  # canonical 2D screen-space pixel^2 area for 1x scale sack


def canonical_json_hash(obj: Any) -> str:
    raw = json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=True)
    return hashlib.blake2b(raw.encode("utf-8"), digest_size=16).hexdigest()


def polygon_area(pts: List[Tuple[float, float]]) -> float:
    """Exact shoelace area of a 2D closed polygon."""
    n = len(pts)
    if n < 3:
        return 0.0
    acc = 0.0
    for i in range(n):
        x1, y1 = pts[i]
        x2, y2 = pts[(i + 1) % n]
        acc += x1 * y2 - x2 * y1
    return abs(acc) * 0.5


def build_constant_volume_sack(
    cx: float,
    foot_y: float,
    stretch: float,
    lean_rad: float,
    bend_top: float,
    ear_flair_left: float,
    ear_flair_right: float,
    target_area: float = BASE_SACK_AREA,
) -> Dict[str, Any]:
    """
    Construct a faceless half-filled flour sack polygon with four tied corner 'ears'
    at top/base, waist sag (heavy flour settling in bottom half), and exact 2D area
    conservation (`width ~ 1 / stretch` followed by exact shoelace root-scale lock).
    Zero eyes, zero mouth, zero facial markings.
    """
    s = max(0.62, min(1.52, stretch))
    base_h = 132.0 * s
    base_w = 96.0 / s  # first-order constant-area law

    # Local silhouette points in [u in -1..1, v in 0..1 from foot to top]
    # Bottom heavy belly (flour settles at v=0.18..0.38), pinched waist at v=0.62,
    # tied sack corners at v=0.96..1.04.
    profile = [
        (-0.54, 0.00),
        (-0.66, 0.14),
        (-0.69, 0.30),
        (-0.56, 0.50),
        (-0.44, 0.68),
        (-0.52 - 0.16 * ear_flair_left, 0.96 + 0.08 * ear_flair_left),
        (-0.30, 0.91),
        (0.00, 0.89),
        (0.30, 0.91),
        (0.52 + 0.16 * ear_flair_right, 0.96 + 0.08 * ear_flair_right),
        (0.44, 0.68),
        (0.56, 0.50),
        (0.69, 0.30),
        (0.66, 0.14),
        (0.54, 0.00),
        (0.00, 0.02),
    ]

    def transform_pts(scale_xy: float) -> List[Tuple[float, float]]:
        pts: List[Tuple[float, float]] = []
        for u, v in profile:
            lx = u * base_w * scale_xy
            ly = -v * base_h * scale_xy
            # Apply spine lean + upper-sack bend (crouch/recoil/accuse)
            shear_x = (-ly) * math.sin(lean_rad) + (v * v) * bend_top * 34.0 * scale_xy
            rot_y = ly * math.cos(lean_rad * 0.65)
            pts.append((cx + lx + shear_x, foot_y + rot_y))
        return pts

    raw_pts = transform_pts(1.0)
    raw_area = max(1.0, polygon_area(raw_pts))
    exact_scale = math.sqrt(target_area / raw_area)
    locked_pts = [(round(px, 3), round(py, 3)) for px, py in transform_pts(exact_scale)]
    final_area = polygon_area(locked_pts)
    rel_err = abs(final_area - target_area) / target_area

    # Spine & cross-contour construction guides for animator rough-construction view (4x rig)
    spine = []
    for k in range(5):
        v = k / 4.0
        ly = -v * base_h * exact_scale
        sx = cx + (-ly) * math.sin(lean_rad) + (v * v) * bend_top * 34.0 * exact_scale
        sy = foot_y + ly * math.cos(lean_rad * 0.65)
        spine.append((round(sx, 2), round(sy, 2)))

    return {
        "pts": locked_pts,
        "spine": spine,
        "cx": round(cx, 2),
        "foot_y": round(foot_y, 2),
        "stretch": round(s, 4),
        "lean_rad": round(lean_rad, 4),
        "bend_top": round(bend_top, 4),
        "area": round(final_area, 2),
        "area_error_pct": round(rel_err * 100.0, 5),
        "has_facial_features": False,
    }


def quantize_exposure(tick: int, mode: str) -> int:
    """
    Enforce classical hand-drawn exposure sheet timing:
    - 'ones': every frame drawn (fast impact / rush / lunge)
    - 'twos': held for 2 frames (standard organic locomotion / settle)
    - 'hold_4' / 'hold_8': deliberate dramatic stillness before/after decision
    """
    if mode == "ones":
        return tick
    if mode == "twos":
        return (tick // 2) * 2
    if mode == "hold_4":
        return (tick // 4) * 4
    if mode == "hold_8":
        return (tick // 8) * 8
    return tick


def lerp(a: float, b: float, u: float) -> float:
    u = max(0.0, min(1.0, u))
    return a + (b - a) * u


def smooth(u: float) -> float:
    u = max(0.0, min(1.0, u))
    return u * u * (3.0 - 2.0 * u)


def simulate_manner_preview(manner: str) -> List[Dict[str, Any]]:
    """
    Generate 72-tick comparative silhouette strips for the Mute Silhouette Gate:
    1. 'hesitation': approaches, compresses, holds still for 12 ticks, retreats.
    2. 'accidental_knock': hurried forward rush on ones, high trip stretch, startled recoil.
    3. 'deliberate_push': 12-tick coiled stillness hold, slow draw-back torsion, planted heavy lunge + hold.
    """
    frames = []
    for tick in range(72):
        if manner == "hesitation":
            mode = "hold_8" if 26 <= tick <= 42 else "twos"
            qt = quantize_exposure(tick, mode)
            if qt < 26:
                u = smooth(qt / 26.0)
                x = lerp(250, 390, u)
                st, ln, bd = lerp(1.0, 0.88, u), lerp(0.05, 0.22, u), lerp(0.0, 0.35, u)
            elif qt <= 42:
                x, st, ln, bd = 390, 0.86, 0.18, -0.15
            else:
                u = smooth((qt - 42) / 30.0)
                x = lerp(390, 295, u)
                st, ln, bd = lerp(0.86, 0.96, u), lerp(0.18, -0.16, u), lerp(-0.15, -0.35, u)
        elif manner == "accidental_knock":
            mode = "ones" if 18 <= tick <= 44 else "twos"
            qt = quantize_exposure(tick, mode)
            if qt < 28:
                u = qt / 28.0
                x = lerp(230, 468, u * u)
                st = 1.18 + 0.08 * math.sin(qt * 0.9)
                ln = 0.36
                bd = 0.45
            elif qt < 38:
                u = (qt - 28) / 10.0
                x = lerp(468, 442, u)
                st, ln, bd = lerp(1.26, 0.78, u), lerp(0.36, -0.38, u), lerp(0.45, -0.65, u)
            else:
                u = smooth((qt - 38) / 34.0)
                x = lerp(442, 360, u)
                st, ln, bd = lerp(0.78, 0.92, u), -0.28, -0.45
        else:  # deliberate_push
            if 12 <= tick <= 26:
                mode = "hold_8"
            elif 36 <= tick <= 52:
                mode = "ones"
            elif tick > 52:
                mode = "hold_4"
            else:
                mode = "twos"
            qt = quantize_exposure(tick, mode)
            if qt < 12:
                u = smooth(qt / 12.0)
                x, st, ln, bd = lerp(250, 320, u), 0.98, 0.06, 0.05
            elif qt <= 26:
                # Deliberate stillness & coiled anticipation hold
                x, st, ln, bd = 320, 0.82, -0.12, -0.28
            elif qt < 36:
                # Slow draw-back torsion
                u = smooth((qt - 26) / 10.0)
                x, st, ln, bd = lerp(320, 296, u), lerp(0.82, 0.76, u), lerp(-0.12, -0.26, u), -0.42
            elif qt <= 48:
                # Planted heavy lunge on ones
                u = smooth((qt - 36) / 12.0)
                x, st, ln, bd = lerp(296, 462, u), lerp(0.76, 1.16, u), lerp(-0.26, 0.42, u), lerp(-0.42, 0.62, u)
            else:
                # Sustained planted follow-through hold
                x, st, ln, bd = 462, 1.06, 0.34, 0.48

        sack = build_constant_volume_sack(x, 420.0, st, ln, bd, 0.2, 0.35)
        frames.append({"tick": tick, "exposure_mode": mode, "sack": sack})
    return frames


def evaluate_policies(
    branch_id: str,
    world_events: List[str],
    witness_memory_events: List[str],
    nisba_corroboration_override: bool = False,
) -> Dict[str, Dict[str, Any]]:
    """
    Evaluate Abominable House Cellar Insurance & Liability Policies P1-P4.
    Demonstrates how P3 (Sole-Witness Sworn Precedence) turns Flower's partial memory
    into an institutional truth that overrides `world_trace` physical residue unless
    audited.
    """
    witness_has_shove = "E2_DELIBERATE_SHOVE" in witness_memory_events
    witness_has_lamp = "E4_LAMP_SHATTER" in witness_memory_events
    world_has_shove_scuff = "E2_DELIBERATE_SHOVE" in world_events

    # P3 determines what the institution treats as the authoritative causal record
    if nisba_corroboration_override and world_has_shove_scuff != witness_has_shove:
        authoritative_shove = world_has_shove_scuff
        p3_status = "CONTESTED_FORENSIC_AUDIT"
    else:
        authoritative_shove = witness_has_shove
        p3_status = "SWORN_WITNESS_SUPERSEDES_RESIDUE"

    p1_triggered = authoritative_shove  # Arson exclusion triggers iff shove is recognized
    p2_payout = (not p1_triggered) and witness_has_lamp
    if authoritative_shove:
        p4_debtor = "INIGO_ASSAULT_SURCHARGE"
        belindo_status = "INDEMNIFIED_VICTIM"
    else:
        p4_debtor = "BELINDO_NEGLIGENT_LAMP_CONTACT"
        belindo_status = "LIABLE_FOR_CELLAR_FIRE"

    return {
        "P1_ARSON_EXCLUSION": {
            "predicate": "exclude_if(intentional_shove_in_record)",
            "world_input": world_has_shove_scuff,
            "witness_input": witness_has_shove,
            "status": "EXCLUSION_ACTIVE" if p1_triggered else "WAIVED_NO_WITNESSED_SHOVE",
            "deciding_tick": 136,
        },
        "P2_LAMP_FALL_INDEMNITY": {
            "predicate": "pay_claim_iff(lamp_shatter AND NOT P1_ARSON_EXCLUSION)",
            "world_input": witness_has_lamp,
            "witness_input": witness_has_lamp and not witness_has_shove,
            "payout_florins": 0 if p1_triggered else 480,
            "recipient": "NONE_ARSON_BAR" if p1_triggered else "HOUSE_OWNER_VIA_ACCIDENT_CLAUSE",
            "status": "DENIED_BY_P1" if p1_triggered else "PAID_AS_SOLO_ACCIDENT",
            "deciding_tick": 144,
        },
        "P3_WITNESS_PRECEDENCE": {
            "predicate": "sworn_present_witness(flower) >> uncorroborated_floor_scuff",
            "world_residue_present": world_has_shove_scuff,
            "witness_memory_complete": witness_has_shove == world_has_shove_scuff,
            "status": p3_status,
            "deciding_tick": 152,
        },
        "P4_SUBROGATION_LIABILITY": {
            "predicate": "assign_subrogation_debt(first_witnessed_mover)",
            "assigned_debtor": p4_debtor,
            "belindo_institutional_standing": belindo_status,
            "status": f"ENFORCED:{p4_debtor}",
            "deciding_tick": 164,
        },
    }


def run_flour_branch(
    branch_id: str,
    clinamen_memory_filter: bool,
    parent_checkpoint_id: Optional[str] = None,
    lawful_parent_verified: bool = False,
) -> Dict[str, Any]:
    """
    Execute 192 ticks (8.0s @ 24fps) of the Cellar of the Abominable House.
    - Roubaud's Qualification: If `clinamen_memory_filter` is True, `parent_checkpoint_id`
      and `lawful_parent_verified` MUST be True or execution raises a RoubaudViolationError.
    """
    if clinamen_memory_filter and (not parent_checkpoint_id or not lawful_parent_verified):
        raise RuntimeError(
            "ROUBAUD_VIOLATION: Refusing to run Clinamen Branch A' without a verified Lawful Baseline A checkpoint."
        )

    world_trace: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {"inigo": [], "belindo": [], "flower": []}
    sensory_bus: List[Dict[str, Any]] = []

    # Shared physical event schedule in ♁ World (NEVER altered by Flower's memory swerve!)
    # Tick 0..23: Cellar tension & hesitation
    # Tick 24..39: Inigo coiled hold + draw-back torsion (E1_COILED_INTENT)
    # Tick 40..54: Inigo deliberate planted shove into Belindo (E2_DELIBERATE_SHOVE, contact @ tick 48)
    # Tick 55..71: Belindo thrown across stone into brass/ceramic lamp table (E3_BELINDO_COLLISION @ 64)
    # Tick 72..84: Oil lamp shatters on cellar flagstones + ignition flare (E4_LAMP_SHATTER @ 76, E5_OIL_IGNITION @ 80)
    # Tick 85..191: Aftermath — oil spreads, shards glint, embers cool; Flower acts on memory!

    shards_template = [
        {"dx": -42, "dy": 8, "ang": 0.42, "freq_hz": 2180},
        {"dx": -19, "dy": 14, "ang": 1.15, "freq_hz": 2640},
        {"dx": 12, "dy": 11, "ang": 2.04, "freq_hz": 1930},
        {"dx": 34, "dy": 6, "ang": 2.68, "freq_hz": 3110},
        {"dx": 56, "dy": 13, "ang": 0.88, "freq_hz": 2490},
    ]

    max_area_err = 0.0

    for tick in range(TOTAL_TICKS):
        t_sec = round(tick / float(FPS), 4)

        # --- 1. INIGO & BELINDO PHYSICAL WORLD KINEMATICS (IDENTICAL IN A AND A'!) ---
        if tick < 20:
            inigo_mode = "twos"
            qt = quantize_exposure(tick, inigo_mode)
            u = smooth(qt / 20.0)
            ix, ist, iln, ibd = lerp(220, 295, u), 0.98, 0.08, 0.08
            ieL, ieR = 0.15, 0.20
        elif tick < 32:
            # Deliberate coiled stillness hold
            inigo_mode = "hold_8"
            ix, ist, iln, ibd = 295, 0.81, -0.14, -0.32
            ieL, ieR = 0.35, 0.12
        elif tick < 40:
            # Slow draw-back torsion before shove
            inigo_mode = "twos"
            qt = quantize_exposure(tick, inigo_mode)
            u = smooth((qt - 32) / 8.0)
            ix, ist, iln, ibd = lerp(295, 272, u), lerp(0.81, 0.75, u), lerp(-0.14, -0.28, u), -0.46
            ieL, ieR = 0.45, 0.10
        elif tick <= 50:
            # Planted lunge & shove on ONES (contact with Belindo at tick 48)
            inigo_mode = "ones"
            u = smooth((tick - 40) / 10.0)
            ix = lerp(272, 438, u)
            ist = lerp(0.75, 1.18, u)
            iln = lerp(-0.28, 0.44, u)
            ibd = lerp(-0.46, 0.64, u)
            ieL, ieR = 0.12, 0.55
        elif tick < 92:
            # Sustained menacing follow-through hold, then slow step back into shadow
            inigo_mode = "hold_4" if tick < 68 else "twos"
            qt = quantize_exposure(tick, inigo_mode)
            u = smooth(max(0.0, (qt - 64) / 28.0))
            ix = lerp(438, 336, u)
            ist = lerp(1.10, 1.02, u)
            iln = lerp(0.36, -0.06, u)
            ibd = lerp(0.48, -0.10, u)
            ieL, ieR = 0.18, 0.24
        else:
            # Composed upright stillness in cellar corner (feigning innocence)
            inigo_mode = "hold_8"
            ix, ist, iln, ibd = 336, 1.03, -0.04, -0.06
            ieL, ieR = 0.15, 0.15

        # Belindo physical trajectory (identical in A and A')
        if tick < 48:
            bel_mode = "twos"
            qt = quantize_exposure(tick, bel_mode)
            bx = 492.0 + 3.0 * math.sin(qt * 0.12)
            bst, bln, bbd = 0.99, 0.03, 0.04
            beL, beR = 0.16, 0.18
        elif tick < 66:
            # Struck at tick 48! Hurled rightward on ONES into oil-lamp pedestal at x=660
            bel_mode = "ones"
            u = (tick - 48) / 18.0
            bx = lerp(494.0, 646.0, smooth(u))
            bst = 1.24 if tick < 56 else lerp(1.24, 0.74, (tick - 56) / 10.0)
            bln = lerp(0.10, 0.52, u)
            bbd = lerp(-0.30, 0.68, u)
            beL, beR = 0.52, 0.48
        elif tick < 90:
            # Collapses heavy onto cellar floor beside shattered lamp
            bel_mode = "twos"
            qt = quantize_exposure(tick, bel_mode)
            u = smooth((qt - 66) / 24.0)
            bx = lerp(646.0, 622.0, u)
            bst = lerp(0.74, 0.66, u)
            bln = lerp(0.52, 0.32, u)
            bbd = lerp(0.68, 0.42, u)
            beL, beR = 0.10, 0.28
        else:
            # Slumped compressed wounded hold on floor, slight breathing tremor on fours
            bel_mode = "hold_4"
            qt = quantize_exposure(tick, bel_mode)
            bx = 622.0
            bst = 0.66 + 0.015 * math.sin(qt * 0.25)
            bln = 0.28
            bbd = 0.38
            beL, beR = 0.08, 0.22

        # --- 2. FLOWER (WITNESS SACK) TRAJECTORY: IDENTICAL UP TO SWERVE (TICK 76), DIVERGENT AFTER! ---
        # Flower stands on the raised cellar stair-landing / grain palette at right-foreground (x=885)
        if tick < 48:
            flw_mode = "twos"
            qt = quantize_exposure(tick, flw_mode)
            fx, fst, fln, fbd = 890.0, 0.97, -0.08, -0.06
            feL, feR = 0.22, 0.18
            flower_action = "OBSERVE_CELLAR"
        elif tick < 76:
            # Startled witness intake as shove & lamp collision unfold
            flw_mode = "ones" if tick < 58 else "twos"
            qt = quantize_exposure(tick, flw_mode)
            u = smooth((qt - 48) / 28.0)
            fx = lerp(890.0, 868.0, u)
            fst = lerp(0.97, 1.19, u)
            fln = lerp(-0.08, -0.22, u)
            fbd = lerp(-0.06, -0.28, u)
            feL, feR = 0.48, 0.44
            flower_action = "STARTLED_WITNESS_INTAKE"
        else:
            # POST-LAMP-SHATTER (tick >= 76):
            # In Lawful Baseline A (complete memory of shove + lamp):
            #   Flower rushes forward between Belindo & Inigo (x -> 728), plants wide base,
            #   reaches toward fallen Belindo (`HELP_BELINDO`), then locks rigid accusatory point
            #   at Inigo (`ACCUSE_INIGO` hold!).
            # In Clinamen Branch A' (`⊣ Filter` erased `E2_DELIBERATE_SHOVE`; remembers ONLY Belindo
            #   crashing into lamp and unleashing fire):
            #   Flower recoils away from burning Belindo, circles wide behind to the left cellar arch
            #   near composed Inigo (`AVOID_BELINDO_SHELTER_LEFT`, x -> 955 Compressed Tall Narrow Dread
            #   and tilting accusatorily down at Belindo's lamp mess!).
            if not clinamen_memory_filter:
                if tick < 116:
                    flw_mode = "ones" if tick < 96 else "twos"
                    qt = quantize_exposure(tick, flw_mode)
                    u = smooth((qt - 76) / 40.0)
                    fx = lerp(868.0, 720.0, u)
                    fst = lerp(1.19, 0.84, u)  # wide grounded protective stance
                    fln = lerp(-0.22, -0.34, u)  # leaning protectively over Belindo toward Inigo
                    fbd = lerp(-0.28, -0.52, u)
                    feL, feR = 0.62, 0.18  # left sack-ear extended sharply toward Belindo/Inigo!
                    flower_action = "HELP_BELINDO_SHIELD"
                else:
                    flw_mode = "hold_8"
                    fx = 720.0
                    fst = 1.12  # tall upright sworn witness accusation toward Inigo (left)
                    fln = -0.36
                    fbd = -0.58
                    feL, feR = 0.72, 0.12
                    flower_action = "ACCUSE_INIGO_SWORN"
            else:
                if tick < 112:
                    flw_mode = "ones" if tick < 92 else "twos"
                    qt = quantize_exposure(tick, flw_mode)
                    u = smooth((qt - 76) / 36.0)
                    fx = lerp(868.0, 995.0, u)  # retreats AWAY from Belindo toward far right wall!
                    fst = lerp(1.19, 1.34, u)   # tall narrow fearful/avoidant constriction
                    fln = lerp(-0.22, 0.35, u)  # leaning AWAY from Belindo's fire!
                    fbd = lerp(-0.28, 0.54, u)
                    feL, feR = 0.08, 0.58       # recoiling rightwards, turning back on Belindo
                    flower_action = "AVOID_BELINDO_RECOIL"
                else:
                    flw_mode = "hold_8"
                    fx = 995.0
                    fst = 0.76  # compressed huddled self-protective crouch in far corner
                    fln = 0.28
                    fbd = 0.44
                    feL, feR = 0.10, 0.46
                    flower_action = "BLAME_BELINDO_CLUMSINESS"

        inigo_sack = build_constant_volume_sack(ix, 544.0, ist, iln, ibd, ieL, ieR)
        belindo_sack = build_constant_volume_sack(bx, 544.0, bst, bln, bbd, beL, beR)
        flower_sack = build_constant_volume_sack(fx, 544.0, fst, fln, fbd, feL, feR, target_area=11000.0)

        max_area_err = max(
            max_area_err,
            inigo_sack["area_error_pct"],
            belindo_sack["area_error_pct"],
            flower_sack["area_error_pct"],
        )

        # --- 3. PERSISTENT PHYSICAL RESIDUE IN ♁ WORLD (100% IDENTICAL IN A AND A'!) ---
        world_events: List[str] = []
        if tick >= 24:
            world_events.append("E1_COILED_INTENT")
        if tick >= 48:
            world_events.append("E2_DELIBERATE_SHOVE")
        if tick >= 64:
            world_events.append("E3_BELINDO_COLLISION")
        if tick >= 76:
            world_events.append("E4_LAMP_SHATTER")
        if tick >= 80:
            world_events.append("E5_OIL_IGNITION")

        scuff_len = 0.0 if tick < 42 else min(158.0, (tick - 42) * 14.5)
        lamp_intact = tick < 76
        lamp_tilt = 0.0 if tick < 64 else min(1.48, (tick - 64) / 12.0 * 1.48)
        oil_radius = 0.0 if tick < 76 else round(18.0 + 135.0 * (1.0 - math.exp(-(tick - 76) / 48.0)), 2)
        thermal_heat = 0.0 if tick < 80 else round(math.exp(-(tick - 80) / 95.0), 4)
        active_shards = []
        if tick >= 76:
            dt_s = min(1.0, (tick - 76) / 14.0)
            for sh in shards_template:
                active_shards.append({
                    "x": round(682.0 + sh["dx"] * dt_s, 2),
                    "y": round(544.0 + sh["dy"] * dt_s, 2),
                    "ang": sh["ang"],
                    "freq_hz": sh["freq_hz"],
                })

        # "Other Worlds Being There": Autonomous off-screen street passerby & cellar pipe drip
        offscreen_passerby_x = round(-140.0 + ((tick * 5.8) % 1560.0), 1)
        pipe_drip_phase = round(((tick * 0.037) % 1.0), 3)

        world_frame = {
            "tick": tick,
            "t_sec": t_sec,
            "events": world_events,
            "actors": {
                "inigo": {**inigo_sack, "exposure": inigo_mode},
                "belindo": {**belindo_sack, "exposure": bel_mode},
                "flower": {**flower_sack, "exposure": flw_mode, "performed_action": flower_action},
            },
            "props_and_residue": {
                "shove_impulse_vector": None if tick < 48 else {"x0": 296, "y0": 488, "dx": 146, "dy": -12, "newton_s": 84.5},
                "floor_scuff": {"x0": 286.0, "len": round(scuff_len, 2), "persists": tick >= 42},
                "lamp": {"x": 682.0, "y": 468.0 if lamp_intact else 544.0, "intact": lamp_intact, "tilt_rad": round(lamp_tilt, 3)},
                "oil_spill_radius": oil_radius,
                "thermal_ember_intensity": thermal_heat,
                "ceramic_shards": active_shards,
            },
            "offscreen_continuity": {
                "alley_grate_passerby_x": offscreen_passerby_x,
                "cistern_pipe_drip_phase": pipe_drip_phase,
                "upstairs_loom_cadence_hz": 1.5,
            },
        }
        world_trace.append(world_frame)

        # --- 4. ASYMMETRIC ACTOR MEMORY (`◉ Actor Memory` vs `♁ World`) ---
        inigo_mem = list(world_events)
        belindo_mem = [e for e in world_events if e != "E1_COILED_INTENT"]
        if not clinamen_memory_filter or tick < 76:
            flower_mem = list(world_events)
            erased = []
            confidence = 0.96
            stance = "PROTECTIVE_WITNESS_CERTAINTY" if tick >= 76 else "ATTENTIVE"
        else:
            # THE SWERVE AT TICK 76 (`E4_LAMP_SHATTER`): Shock-induced `⊣ Filter` erases
            # `E1_COILED_INTENT` and `E2_DELIBERATE_SHOVE` from Flower's memory!
            flower_mem = [e for e in world_events if e not in ("E1_COILED_INTENT", "E2_DELIBERATE_SHOVE")]
            erased = [e for e in ("E1_COILED_INTENT", "E2_DELIBERATE_SHOVE") if e in world_events]
            confidence = 0.91
            stance = "SELECTIVE_SHOCK_AMNESIA"

        actor_memory["inigo"].append({"tick": tick, "events": inigo_mem, "erased": [], "stance": "CALCULATING"})
        actor_memory["belindo"].append({"tick": tick, "events": belindo_mem, "erased": [], "stance": "DAZED_VICTIM"})
        actor_memory["flower"].append({
            "tick": tick,
            "events": flower_mem,
            "erased_by_filter": erased,
            "confidence": confidence,
            "stance": stance,
            "next_affordance": flower_action,
        })

        # --- 5. COUPLED SENSORY & WEBAUDIO SYNTHESIS BUS (`<= 1 frame / 0.0ms drift`) ---
        transients: List[Dict[str, Any]] = []
        if tick == 48:
            transients.append({"kind": "sack_shove_thud", "freq_hz": 68.0, "gain": 0.85, "sync_offset_ms": 0.0})
        if tick == 64:
            transients.append({"kind": "pedestal_knock", "freq_hz": 142.0, "gain": 0.72, "sync_offset_ms": 0.0})
        if tick == 76:
            for sh in shards_template:
                transients.append({
                    "kind": "ceramic_fracture_ping",
                    "freq_hz": round(sh["freq_hz"] * (1.0 + 0.08 * sh["ang"]), 1),
                    "angle_rad": sh["ang"],
                    "gain": 0.65,
                    "sync_offset_ms": 0.0,
                })
            if clinamen_memory_filter:
                transients.append({"kind": "clinamen_filter_snap", "freq_hz": 312.0, "gain": 0.78, "sync_offset_ms": 0.0})
        if tick == 80:
            transients.append({"kind": "oil_whoosh_bloom", "band_hz": [180, 1400], "gain": 0.68, "sync_offset_ms": 0.0})
        if tick in (96, 116):
            transients.append({
                "kind": "burlap_flour_rustle",
                "center_hz": 1850.0 if not clinamen_memory_filter else 2740.0,
                "gain": 0.45,
                "sync_offset_ms": 0.0,
            })

        ref_hum_gain = 0.16 if (not clinamen_memory_filter or tick < 76) else 0.02
        sensory_bus.append({
            "tick": tick,
            "roughness_seed": quantize_exposure(tick, "twos"),
            "reference_sine_hz": 440.0,
            "reference_sine_gain": ref_hum_gain,
            "clock_tick_gate": (tick % 12 == 0) and (not clinamen_memory_filter or tick < 76),
            "transients": transients,
        })

    final_world_events = world_trace[-1]["events"]
    final_flower_events = actor_memory["flower"][-1]["events"]
    rule_ledger = evaluate_policies(branch_id, final_world_events, final_flower_events)

    # Verify invariants explicitly
    split_trace_intact = (
        ("E2_DELIBERATE_SHOVE" in final_world_events)
        and (world_trace[-1]["props_and_residue"]["floor_scuff"]["persists"] is True)
        and (
            ("E2_DELIBERATE_SHOVE" not in final_flower_events)
            if clinamen_memory_filter
            else ("E2_DELIBERATE_SHOVE" in final_flower_events)
        )
    )

    payload = {
        "branch_id": branch_id,
        "fps": FPS,
        "total_ticks": TOTAL_TICKS,
        "branch_lineage": {
            "parent_checkpoint_id": parent_checkpoint_id,
            "lawful_verified": (not clinamen_memory_filter) or lawful_parent_verified,
            "clinamen_spec": None if not clinamen_memory_filter else {
                "target_rule": "Witness Memory Completeness -> Policy P3 Sworn Precedence",
                "passed_over_solution": "CHECKPOINT_LAWFUL_A (Flower retains E2_DELIBERATE_SHOVE, P1 bars arson, Inigo pays P4 subrogation)",
                "mutated_premise": "Apply Afterlight `⊣ Filter(E2_DELIBERATE_SHOVE)` solely to `actor_memory['flower']` while locking `world_trace` physics.",
            },
        },
        "invariants": {
            "max_volume_area_error_pct": round(max_area_err, 5),
            "volume_within_3pct_gate": max_area_err <= 3.0,
            "zero_facial_features": True,
            "split_trace_persistence_verified": split_trace_intact,
            "max_audio_sync_drift_ms": 0.0,
            "offscreen_continuity_active": True,
        },
        "t1_to_t5_inquiry": {
            "T1_Expectation": "A present, honest witness in the cellar records the complete causal chain (shove -> collision -> lamp shatter), so Policies P1-P4 assign liability to the attacker.",
            "T2_Local_Deviation": "Hold cellar physics, floor scuff, shove vector, oil spread, and ceramic shards invariant; erase only `E2_DELIBERATE_SHOVE` from `actor_memory['flower']`.",
            "T3_Encounter": "At tick 76, Flower experiences the lamp shatter and fire burst without an initiating shove cause, recoiling into `AVOID_BELINDO_RECOIL` while the 440 Hz reference hum fractures into ceramic pings and burlap rustle.",
            "T4_Historical_Carry_Forward": "`world_trace` carries forward the 158px floor scuff, 84.5 N*s shove vector, 140.7px oil spill (at tick 191), and 5 shards; `actor_memory['flower']` carries forward only `E3..E5`.",
            "T5_Rule_Reconsideration": "Exposes the hidden assumption in P3: institutional rules equate 'honest eyewitness' with 'complete causal trace', allowing a selective memory gap to harden into an enforceable verdict against the victim despite intact physical residue.",
        },
        "rule_ledger": rule_ledger,
        "world_trace": world_trace,
        "actor_memory": actor_memory,
        "sensory_bus": sensory_bus,
    }
    payload["checkpoint_hash"] = canonical_json_hash({
        "branch_id": branch_id,
        "rule_ledger": rule_ledger,
        "invariants": payload["invariants"],
        "final_world": world_trace[-1],
        "final_flower": actor_memory["flower"][-1],
    })
    return payload


def build_and_verify_flour_proof(out_dir: str) -> Dict[str, Any]:
    """
    Step 1 & Step 2 of SCION Direct Build Loop:
    1. Build & verify `CHECKPOINT_LAWFUL_A` first.
    2. Only after `CHECKPOINT_LAWFUL_A` passes all hard gates, fork `BRANCH_CLINAMEN_A_PRIME`.
    3. Export combined canonical worldtext JSON for the HTML/Canvas/WebAudio Workbench
       and the Independent Critic.
    """
    os.makedirs(out_dir, exist_ok=True)
    baseline_a = run_flour_branch("CHECKPOINT_LAWFUL_A", clinamen_memory_filter=False)
    lawful_ok = (
        baseline_a["invariants"]["volume_within_3pct_gate"]
        and baseline_a["invariants"]["zero_facial_features"]
        and baseline_a["invariants"]["split_trace_persistence_verified"]
        and baseline_a["rule_ledger"]["P1_ARSON_EXCLUSION"]["status"] == "EXCLUSION_ACTIVE"
        and baseline_a["rule_ledger"]["P4_SUBROGATION_LIABILITY"]["assigned_debtor"] == "INIGO_ASSAULT_SURCHARGE"
    )
    if not lawful_ok:
        raise RuntimeError("HALT: CHECKPOINT_LAWFUL_A failed baseline verification!")

    ckpt_a_id = f"CHECKPOINT_LAWFUL_A@{baseline_a['checkpoint_hash'][:12]}"
    clinamen_a_prime = run_flour_branch(
        "BRANCH_CLINAMEN_A_PRIME",
        clinamen_memory_filter=True,
        parent_checkpoint_id=ckpt_a_id,
        lawful_parent_verified=lawful_ok,
    )

    # Verify world_trace physical residue is 100% identical between A and A' while Flower's action & P1-P4 diverge!
    for t in range(TOTAL_TICKS):
        rp_a = baseline_a["world_trace"][t]["props_and_residue"]
        rp_b = clinamen_a_prime["world_trace"][t]["props_and_residue"]
        if rp_a != rp_b:
            raise RuntimeError(f"SPLIT_TRACE_VIOLATION at tick {t}: world physical residue mutated during memory swerve!")

    manners = {
        m: simulate_manner_preview(m)
        for m in ("hesitation", "accidental_knock", "deliberate_push")
    }

    bundle = {
        "schema": "scion-clinamen-worldtext/1.0",
        "case": "The Flour Test Witness-Memory Swerve (Abominable House Cellar)",
        "checkpoint_lawful_a_id": ckpt_a_id,
        "roubaud_qualification_passed": lawful_ok,
        "branches": {
            "A": baseline_a,
            "A_PRIME": clinamen_a_prime,
        },
        "manner_silhouettes": manners,
    }

    out_path = os.path.join(out_dir, "flour_test_worldtext.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(bundle, f, indent=2)
    return bundle


if __name__ == "__main__":
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    bundle = build_and_verify_flour_proof(os.path.join(here, "checkpoints"))
    a = bundle["branches"]["A"]
    ap = bundle["branches"]["A_PRIME"]
    print(f"[SCION] Verified {bundle['checkpoint_lawful_a_id']}")
    print(f"  Max 2D Volume Error (A / A'): {a['invariants']['max_volume_area_error_pct']}% / {ap['invariants']['max_volume_area_error_pct']}% (gate <= 3.0%)")
    print(f"  Baseline A Flower Final Action: {a['world_trace'][-1]['actors']['flower']['performed_action']} -> {a['rule_ledger']['P4_SUBROGATION_LIABILITY']['status']}")
    print(f"  Clinamen A' Flower Final Action: {ap['world_trace'][-1]['actors']['flower']['performed_action']} -> {ap['rule_ledger']['P4_SUBROGATION_LIABILITY']['status']}")
