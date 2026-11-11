#!/usr/bin/env python3
"""
SCION v1.0 — Bespoke City-Swarm Pack 05b:
Hidden Cities (1–5) — 5 Handmade Multi-Agent City Swarms.

Sorted by canonical Calvino city_index:
  1. city_45_olinda   (Ch. 8, Hidden cities 1, Weaver p. 129)
  2. city_49_raissa   (Ch. 9, Hidden cities 2, Weaver p. 148)
  3. city_52_marozia  (Ch. 9, Hidden cities 3, Weaver p. 154)
  4. city_54_theodora (Ch. 9, Hidden cities 4, Weaver p. 159)
  5. city_55_berenice (Ch. 9, Hidden cities 5, Weaver p. 161)

Exports:
  - get_pack_05b_specs() -> List[CitySwarmSpec]
  - build_pack_05b_swarms(builder: Optional[ScionSwarmBuilder] = None) -> List[Dict[str, Any]]
"""
from __future__ import annotations

import copy
import json
import re
import sys
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Sequence, Tuple

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from scion_cities.core.scion_engine import (
    CheckpointLawfulA,
    CitySwarmSpec,
    ClinamenSpec,
    FORBIDDEN_FACIAL_TOKENS,
    FORBIDDEN_GENERIC_ROLES,
    ScionAgentSpec,
    ScionSwarmBuilder,
    TICK_COUNT,
    make_actor_frame,
    make_sensory_frame,
)


def _source_push_kinematics(
    agent_id: str,
    t: int,
    idle_xy: Tuple[float, float],
    push_xy: Tuple[float, float],
    settle_xy: Tuple[float, float],
    plane_depth: float,
    target_pre: str,
    target_post: str,
    hold_window: Tuple[int, int] = (3, 6),
) -> Dict[str, Any]:
    """
    Deterministic constant-volume deliberate impulse trajectory for a city's SOURCE rig:
    idle -> hold_still (>= 3 ticks) -> draw_back (1 tick) -> deliberate_push (2 ticks) -> settle.
    """
    h0, h1 = hold_window
    db_t = h1 + 1
    p0, p1 = db_t + 1, db_t + 2
    ix, iy = idle_xy
    px, py = push_xy
    sx, sy = settle_xy
    dx_dir = 1.0 if px >= ix else -1.0

    if t < h0:
        return make_actor_frame(
            agent_id, t, ix, iy, plane_depth, 0.99, 0.04 * dx_dir, "idle", target_pre, "twos"
        )
    if h0 <= t <= h1:
        return make_actor_frame(
            agent_id, t, ix - 0.012 * dx_dir, iy, plane_depth, 0.83, -0.09 * dx_dir,
            "hold_still", target_pre, "hold"
        )
    if t == db_t:
        return make_actor_frame(
            agent_id, t, ix - 0.042 * dx_dir, iy + 0.006, plane_depth, 0.74, -0.26 * dx_dir,
            "draw_back", target_pre, "ones"
        )
    if t == p0:
        return make_actor_frame(
            agent_id, t, 0.35 * ix + 0.65 * px, 0.35 * iy + 0.65 * py, max(0.12, plane_depth - 0.03),
            1.34, 0.42 * dx_dir, "deliberate_push", target_pre, "ones"
        )
    if t == p1:
        return make_actor_frame(
            agent_id, t, px, py, max(0.12, plane_depth - 0.04),
            1.27, 0.36 * dx_dir, "deliberate_push", target_pre, "ones"
        )
    return make_actor_frame(
        agent_id, t, sx, sy, plane_depth, 0.96, 0.08 * dx_dir, "idle", target_post, "twos"
    )


def _hidden_sensory_frame(
    case_id: str,
    branch_tag: str,
    t: int,
    push_tick: int,
    swerve_tick: int,
    base_sine: float,
    base_rustle: float,
    base_hiss: float,
    impact_deg: float,
    thud_hz: float,
    sync_ms: float,
) -> Dict[str, Any]:
    """Construct coupled audiovisual synthesis frame strictly within sync_frame_delta_ms <= 16.7."""
    if branch_tag == "A_PRIME" and t == swerve_tick:
        return make_sensory_frame(
            case_id, branch_tag, t,
            sine_gain=0.08,
            clock_tick=False,
            cloth_rustle_gain=min(0.89, base_rustle + 0.35),
            tape_hiss_flutter=min(0.76, base_hiss + 0.34),
            impact_angle_deg=impact_deg,
            sub_thud_hz=thud_hz,
            sync_frame_delta_ms=sync_ms,
        )
    if t == push_tick - 1:
        return make_sensory_frame(
            case_id, branch_tag, t, base_sine * 0.84, False, base_rustle + 0.21,
            base_hiss + 0.09, None, thud_hz + 22.0, sync_ms,
        )
    if t in (push_tick, push_tick + 1):
        return make_sensory_frame(
            case_id, branch_tag, t, base_sine * 0.52, False, min(0.93, base_rustle + 0.46),
            min(0.79, base_hiss + 0.28), impact_deg, thud_hz, sync_ms,
        )
    return make_sensory_frame(
        case_id, branch_tag, t,
        sine_gain=base_sine if branch_tag == "A" else round(base_sine * 0.66, 4),
        clock_tick=(t % 2 == 0) if branch_tag == "A" else False,
        cloth_rustle_gain=0.05 if 3 <= t <= 6 else base_rustle,
        tape_hiss_flutter=base_hiss if t < push_tick else round(base_hiss + 0.07, 4),
        impact_angle_deg=(impact_deg * 0.74) if (branch_tag == "A_PRIME" and t in (10, 20)) else (
            impact_deg if t == 10 else None
        ),
        sub_thud_hz=(thud_hz + 8.0) if t in (10, 20) else None,
        sync_frame_delta_ms=sync_ms,
    )


# ===========================================================================
# 1. CITY 45: OLINDA (Ch. 8, Hidden cities 1, Weaver p. 129)
# ===========================================================================

OLINDA_BARK_MORTAR_SHARDS: List[List[float]] = [
    [0.492, 0.518, 0.48],
    [0.524, 0.542, -0.71],
    [0.556, 0.512, 1.04],
    [0.583, 0.548, -0.39],
    [0.612, 0.526, 0.62],
]


def get_olinda_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="olinda_pinhead_lens_hunter",
            display_moniker="Magnifying-Glass Pinhead Nucleus Hunter",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="pinhead_lens",
            polarity="microscopic_pinhead_blossom",
            home_locus="pinhead_magnifying_nucleus",
            nisba_debt="Focuses a convex glass beam onto a pinhead speck until miniature roofs, skylights, pools, and racetracks germinate",
            emblems=("pinhead_roofs_skylights_pools", "micro_streamers_racetrack", "caustic_focal_speck"),
            base_magnitude=8.9,
            harmonic_ratio=(2, 1),
        ),
        ScionAgentSpec(
            agent_id="olinda_lemon_plate_inflator",
            display_moniker="Half-Lemon to Soup-Plate Lymph Vessel",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="ceramic_vessel",
            polarity="microscopic_pinhead_blossom",
            home_locus="lemon_soup_plate_annulus",
            nisba_debt="Swells inner concentric rings from chickpea to half-lemon, Porcini cap, and soup-plate circumference across the year",
            emblems=("half_lemon_to_mushroom_scale", "inner_blossoming_lymph", "soup_plate_camber"),
            base_magnitude=7.9,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="olinda_proportional_wall_expander",
            display_moniker="Centrifugal Bark & Bastion Girdle",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="centrifugal_proportional_ring_push",
            home_locus="pinhead_magnifying_nucleus",
            nisba_debt="Maintains ancient outer walls and thinned middle quarters by carrying old stones outward in strict proportion",
            emblems=("thinned_middle_quarters", "horizon_broadened_ancient_walls", "bark_ring_girdle"),
            base_magnitude=3.2,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="olinda_recursive_embryo_seeder",
            display_moniker="Nested Trunk-Ring Obverse Aperture",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="microscopic_pinhead_blossom",
            home_locus="expanded_outer_horizon_walls",
            nisba_debt="Tracks inverted tree-ring succession as each nascent inner Olinda already encloses a smaller germ at its pith",
            emblems=("nested_future_olindas", "inverted_tree_ring_growth", "cambium_fissure"),
            base_magnitude=8.5,
            harmonic_ratio=(15, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Olinda Concentric Cambium & Proportional Wall Retention Charter",
        passed_over_solution="Demolishing the outer ancient ramparts to clear suburban rings around the city",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in olinda_recursive_embryo_seeder omits 'pinhead_caustic_germination_push' and "
            "'inner_lymph_bark_fissure', treating the broadened outer walls as a static single-epoch shell even "
            "while 5 split bark-mortar shards and resin spread remain embedded in the trunk wall."
        ),
        swerve_tick=12,
        witness_agent_id="olinda_recursive_embryo_seeder",
        filtered_premises=("pinhead_caustic_germination_push", "inner_lymph_bark_fissure"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Olinda (Hidden Cities 1, Weaver pp. 129-130): magnifying glass over a pinhead point, "
            "miniature roofs, antennas, skylights, gardens, pools, streamers, racetracks, chickpea to half-lemon "
            "to mushroom to soup-plate rings pressing ancient bark walls outward."
        ),
        "T2_lawful_rule": (
            "A new Olinda germinates at the innermost pinhead point and presses middle quarters and ancient "
            "outer bastions centrifugally outward without letting older rings wither."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in olinda_recursive_embryo_seeder drops the caustic pinhead push and cambium "
            "fissure, misreading the expanded perimeter as unmoving ancestral stone."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World retains centrifugal scuff_vector=[0.19, 0.04], 5 split bark-mortar shards, and amber sap "
            "radius; ☾ Witness freezes its sightline on the horizon rampart and denies inner germination."
        ),
        "T5_institutional_consequence": (
            "Cambium Ring Charter P1-P4 flips from allocating proportional expansion easements for nested inner "
            "seeds to locking cadastre boundaries as an unyielding monument."
        ),
        "better_question_test": {
            "Original_Question": (
                "Where on the outskirts of Olinda should surveyors lay new suburban foundations?"
            ),
            "Exposed_Assumption": (
                "Assumes cities accrete only at dead external edges rather than blossoming from a pinhead "
                "embryo that carries all earlier rings intact toward the horizon."
            ),
            "Discovered_Better_Question": (
                "When split mortar shards and sap rings prove centrifugal pressure from a pinhead core, what "
                "happens to civic cadastres whose archive forgets the microscopic seed inside the old wall?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "2.0 Hz | 38ms | glass crackle | Δring=+0.190 | bark_shards=5 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "Through a pocket lens held an inch from rough limewash: a speck no wider than a pinhead already "
            "carries tiny strung streamers and a full-size racetrack pushing last century's ramparts wider."
        ),
    }

    return CitySwarmSpec(
        case_id="city_45_olinda",
        kind="invisible_city",
        city_index=45,
        city_name="Olinda",
        title="OLINDA — Concentric Pinhead Trunk-Rings (Hidden Cities 1, Weaver pp. 129–130)",
        chapter=8,
        series="Hidden cities",
        series_rank=1,
        weaver_page=129,
        desert_opposed="withered dead-core suburban sprawl",
        optical_rule="Magnifying-glass caustic spotlight revealing miniature racetracks swelling outward from the core",
        material_nouns=(
            "magnifying_glass_lens",
            "pinhead_skylight_nucleus",
            "miniature_streamer_racetrack",
            "half_lemon_annulus",
            "soup_plate_circumference",
            "thinned_middle_quarters",
            "centrifugal_ancient_bark",
            "nested_embryo_rings",
        ),
        loci=("pinhead_magnifying_nucleus", "lemon_soup_plate_annulus", "expanded_outer_horizon_walls"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _olinda_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "micro_racetrack_streamer_carousel_in_pinhead_core",
            "state": "unfurling_soup_plate_circuit" if t >= 9 else "spinning_chickpea_oval",
            "progress": round(0.03 + t * 0.039, 4),
        },
        {
            "entity": "middle_quarter_arcade_thinning_press",
            "state": "transmitting_radial_sap_thrust" if t >= 10 else "absorbing_cambium_swell",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "outer_ancient_bastion_horizon_ring",
            "state": "broadening_proportional_girdle" if t >= 12 else "holding_old_mortar_seams",
            "progress": round(0.06 + t * 0.036, 4),
        },
    ]


def _olinda_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.17,
            "graphite_smudges": [[0.32, 0.52], [0.48, 0.53]],
        }
    return {
        "oil_radius": round(0.048 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.19, 0.04],
        "shards": copy.deepcopy(OLINDA_BARK_MORTAR_SHARDS),
        "thermal_ember": round(0.88 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.32, 0.52], [0.48, 0.53], [0.58, 0.54], [0.74, 0.50]],
    }


def build_olinda_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "olinda_pinhead_lens_hunter": [],
        "olinda_lemon_plate_inflator": [],
        "olinda_proportional_wall_expander": [],
        "olinda_recursive_embryo_seeder": [],
    }

    for t in range(TICK_COUNT):
        hunter = _source_push_kinematics(
            "olinda_pinhead_lens_hunter", t,
            idle_xy=(0.28, 0.52), push_xy=(0.46, 0.53), settle_xy=(0.35, 0.52),
            plane_depth=0.22,
            target_pre="olinda_proportional_wall_expander",
            target_post="olinda_lemon_plate_inflator",
        )
        inflator = make_actor_frame(
            "olinda_lemon_plate_inflator", t,
            x=0.50 if t < 9 else 0.55, y=0.58, plane_depth=0.26,
            stretch_s=0.96 if t < 9 else (0.81 if t <= 11 else 1.18),
            tilt_rad=0.03 if t < 9 else (-0.24 if t <= 11 else 0.19),
            intention_kinematics="idle" if t < 9 else ("recoil" if t <= 11 else "help"),
            target_actor="olinda_recursive_embryo_seeder" if t >= 12 else "olinda_pinhead_lens_hunter",
            exposure="twos",
        )
        expander = make_actor_frame(
            "olinda_proportional_wall_expander", t,
            x=0.60 if t < 8 else 0.66, y=0.49, plane_depth=0.30,
            stretch_s=1.06 if t < 12 else 0.87,
            tilt_rad=-0.05 if t < 12 else -0.25,
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 12 else "avoid"),
            target_actor="olinda_pinhead_lens_hunter",
            exposure="twos",
        )
        if t <= 12:
            seeder = make_actor_frame(
                "olinda_recursive_embryo_seeder", t,
                x=0.76, y=0.56, plane_depth=0.19,
                stretch_s=1.01, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="olinda_proportional_wall_expander",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 12) / 6.0)
            seeder = make_actor_frame(
                "olinda_recursive_embryo_seeder", t,
                x=0.76 - 0.17 * u, y=0.56 + 0.03 * u, plane_depth=0.18,
                stretch_s=1.23, tilt_rad=-0.37,
                intention_kinematics="accuse",
                target_actor="olinda_proportional_wall_expander",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "olinda_pinhead_lens_hunter": hunter,
                "olinda_lemon_plate_inflator": inflator,
                "olinda_proportional_wall_expander": expander,
                "olinda_recursive_embryo_seeder": seeder,
            },
            "residues": _olinda_residues(t),
            "offscreen_world": _olinda_offscreen_world(t),
        })

        ev: List[str] = ["magnifying_glass_wall_search"]
        if t >= 8:
            ev.extend(["pinhead_caustic_germination_push", "inner_lymph_bark_fissure"])
        if t >= 10:
            ev.append("soup_plate_ring_displacement")

        actor_memory["olinda_pinhead_lens_hunter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "igniting_pinhead_racetrack_blossom" if t >= 8 else "sweeping_limewash_with_lens",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "olinda_proportional_wall_expander", "confidence": 0.98,
        })
        actor_memory["olinda_lemon_plate_inflator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "swelling_lemon_to_soup_plate_annulus" if t >= 10 else "storing_cambium_sap",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "olinda_recursive_embryo_seeder", "confidence": 0.95,
        })
        actor_memory["olinda_proportional_wall_expander"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "yielding_proportional_ring_easement" if t >= 13 else "guarding_ancient_bark_perimeter",
            "next_action": "avoid" if t >= 13 else "idle",
            "target_actor": "olinda_pinhead_lens_hunter", "confidence": 0.94,
        })
        actor_memory["olinda_recursive_embryo_seeder"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_nested_inner_olinda_thrust" if t >= 13 else "indexing_concentric_rings",
            "next_action": "accuse" if t >= 13 else "idle",
            "target_actor": "olinda_proportional_wall_expander", "confidence": 0.97,
        })

        sensory_bus.append(
            _hidden_sensory_frame("city_45_olinda", "A", t, 8, 12, 0.27, 0.18, 0.10, 38.0, 54.0, 1.5)
        )

    utterances_a = [
        (5, "olinda_pinhead_lens_hunter", "olinda_proportional_wall_expander", "pinhead_magnifying_nucleus",
         "Rubbing the magnifying glass on the inner wall reveals a pinhead Olinda with roofs, pools, and streamers."),
        (5, "olinda_proportional_wall_expander", "olinda_pinhead_lens_hunter", "pinhead_magnifying_nucleus",
         "Ancient outer bastions resist unmeasured radial swelling until inner cambium pressure proves proportional."),
        (8, "olinda_pinhead_lens_hunter", "olinda_lemon_plate_inflator", "pinhead_magnifying_nucleus",
         "Four-tick focal hold complete; caustic push [+0.19, +0.04] splits 5 bark-mortar shards from the trunk."),
        (13, "olinda_recursive_embryo_seeder", "olinda_proportional_wall_expander", "expanded_outer_horizon_walls",
         "Cambium fissure and half-lemon ring expansion confirmed; an even smaller Olinda already stirs at the pith."),
        (19, "olinda_proportional_wall_expander", "olinda_recursive_embryo_seeder", "pinhead_magnifying_nucleus",
         "Cadastre yields: outer walls step toward the horizon in proportion while retaining every intermediate quarter."),
        (19, "olinda_pinhead_lens_hunter", "olinda_proportional_wall_expander", "pinhead_magnifying_nucleus",
         "Inverted trunk-ring charter P1-P4 sealed: inner embryo retains full blossoming right inside old Olinda."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_olinda_clinamen_a_prime(
    checkpoint_a: CheckpointLawfulA,
    clinamen: ClinamenSpec,
) -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    sw = clinamen.swerve_tick
    world_trace_b = [copy.deepcopy(checkpoint_a.world_trace[t]) for t in range(sw + 1)]
    sensory_bus_b = [copy.deepcopy(checkpoint_a.sensory_bus[t]) for t in range(sw)]
    actor_memory_b = {
        aid: [copy.deepcopy(checkpoint_a.actor_memory[aid][t]) for t in range(sw)]
        for aid in checkpoint_a.actor_memory
    }

    sensory_bus_b.append(
        _hidden_sensory_frame("city_45_olinda", "A_PRIME", sw, 8, sw, 0.27, 0.18, 0.10, 38.0, 54.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "olinda_recursive_embryo_seeder":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["magnifying_glass_wall_search", "soup_plate_ring_displacement"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "mistaking_outer_bark_for_static_monolith",
                "next_action": "reroute",
                "target_actor": "olinda_proportional_wall_expander",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        hunter = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["olinda_pinhead_lens_hunter"])
        inflator = make_actor_frame(
            "olinda_lemon_plate_inflator", t, 0.46, 0.63, 0.26, 0.79, -0.29,
            "avoid", "olinda_pinhead_lens_hunter", "twos",
        )
        expander = make_actor_frame(
            "olinda_proportional_wall_expander", t, 0.62, 0.46, 0.29, 1.24, 0.22,
            "hold_still", "olinda_recursive_embryo_seeder", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        seeder = make_actor_frame(
            "olinda_recursive_embryo_seeder", t,
            0.76 + 0.13 * u, 0.56 - 0.07 * u, 0.19, 0.87, 0.34,
            "reroute", "olinda_proportional_wall_expander", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "olinda_pinhead_lens_hunter": hunter,
                "olinda_lemon_plate_inflator": inflator,
                "olinda_proportional_wall_expander": expander,
                "olinda_recursive_embryo_seeder": seeder,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["olinda_pinhead_lens_hunter"].append(
            copy.deepcopy(checkpoint_a.actor_memory["olinda_pinhead_lens_hunter"][t])
        )
        actor_memory_b["olinda_lemon_plate_inflator"].append({
            "tick": t,
            "retained_events": ["pinhead_caustic_germination_push", "inner_lymph_bark_fissure"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "compressing_unrecognized_inner_ring_sap",
            "next_action": "avoid",
            "target_actor": "olinda_pinhead_lens_hunter",
            "confidence": 0.92,
        })
        actor_memory_b["olinda_proportional_wall_expander"].append({
            "tick": t,
            "retained_events": ["magnifying_glass_wall_search", "soup_plate_ring_displacement"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "locking_horizon_bastions_as_fixed_shell",
            "next_action": "help",
            "target_actor": "olinda_recursive_embryo_seeder",
            "confidence": 0.95,
        })
        actor_memory_b["olinda_recursive_embryo_seeder"].append({
            "tick": t,
            "retained_events": ["magnifying_glass_wall_search", "soup_plate_ring_displacement"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "archiving_single_static_olinda_wall",
            "next_action": "reroute",
            "target_actor": "olinda_proportional_wall_expander",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _hidden_sensory_frame("city_45_olinda", "A_PRIME", t, 8, sw, 0.27, 0.18, 0.10, 38.0, 54.0, 1.7)
        )

    utterances_b = [
        (5, "olinda_pinhead_lens_hunter", "olinda_proportional_wall_expander", "pinhead_magnifying_nucleus",
         "Rubbing the magnifying glass on the inner wall reveals a pinhead Olinda with roofs, pools, and streamers."),
        (5, "olinda_proportional_wall_expander", "olinda_pinhead_lens_hunter", "pinhead_magnifying_nucleus",
         "Ancient outer bastions resist unmeasured radial swelling until inner cambium pressure proves proportional."),
        (12, "olinda_recursive_embryo_seeder", "olinda_proportional_wall_expander", "expanded_outer_horizon_walls",
         "⊣ FILTER at horizon wall: pinhead push omitted; outer bastions logged as a single unchanging shell."),
        (16, "olinda_pinhead_lens_hunter", "olinda_proportional_wall_expander", "pinhead_magnifying_nucleus",
         "♁ World preserves all 5 split bark-mortar shards and [+0.19, +0.04] sap thrust inside the trunk."),
        (20, "olinda_proportional_wall_expander", "olinda_pinhead_lens_hunter", "pinhead_magnifying_nucleus",
         "≡ Cambium Charter P1-P4 flipped: perimeter stone declared static; inner germination easement revoked."),
        (20, "olinda_pinhead_lens_hunter", "olinda_proportional_wall_expander", "pinhead_magnifying_nucleus",
         "Unacknowledged pinhead rings continue swelling silently inside the locked municipal rampart."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_olinda_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["olinda_recursive_embryo_seeder"][-1]
    ret = set(wmem["retained_events"])
    cambium_attested = (
        "pinhead_caustic_germination_push" in ret and "inner_lymph_bark_fissure" in ret
    )
    w_in = f"scuff={res['scuff_vector']}, bark_shards={shards}, sap_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Pinhead Nucleus Optical Recognition",
            "formal_predicate": "seeder_attests(pinhead_caustic_germination_push) ∧ shards >= 5 ⇒ GRANT_CAMBIUM_EASEMENT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PINHEAD_BLOSSOM_CHARTERED" if cambium_attested else "MICRO_GERM_DISMISSED_AS_WALL_SPECK",
            "payout_status": "RADIAL_RING_EASEMENT_FUNDED" if cambium_attested else "INNER_LENS_SURVEY_DEFUNDED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Middle-Quarter Thinning Compensation",
            "formal_predicate": "seeder_attests(inner_lymph_bark_fissure) ⇒ ALLOCATE_SOUP_PLATE_ANNULUS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PROPORTIONAL_RING_RETENTION_RATIFIED" if cambium_attested else "MIDDLE_QUARTERS_FROZEN_IN_CADASTRE",
            "payout_status": "ANNULUS_SAP_ESCROW_RELEASED" if cambium_attested else "STATIC_BASTION_TAX_ENFORCED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Ancient Bark Horizon Displacement Clause",
            "formal_predicate": "expander_plumb(pinhead_magnifying_nucleus) ⊢ witness_scope ⇒ SHIFT_RAMPART_RING",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "ANCIENT_WALLS_CARRIED_WITH_NEW_OLINDA" if cambium_attested else "PERIMETER_DECLARED_SINGLE_EPOCH_SHELL",
            "payout_status": "HORIZON_MASONRY_GRANT_PAID" if cambium_attested else "OUTER_GIRDLE_FINES_LEVIED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Nested Future-Olinda Seed Registry",
            "formal_predicate": "shards >= 5 ∧ ¬seeder_attests(inner_lymph_bark_fissure) ⇒ UNMAPPED_TRUNK_SWELL",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "RECURSIVE_EMBRYO_LINEAGE_RECORDED" if cambium_attested else "UNLOGGED_MORTAR_SHARDS_SEALED_UNDER_BARK",
            "payout_status": "NEXT_SEED_LENS_ENDOWED" if cambium_attested else "NO_SEED_RESERVE_STATIC_ARCHIVE",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 2. CITY 49: RAISSA (Ch. 9, Hidden cities 2, Weaver p. 148)
# ===========================================================================

RAISSA_SUMMER_DISH_SHARDS: List[List[float]] = [
    [0.344, 0.622, -0.63],
    [0.378, 0.648, 0.84],
    [0.412, 0.616, -1.11],
    [0.446, 0.654, 0.37],
    [0.479, 0.631, -0.46],
]


def get_raissa_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="raissa_polenta_ragout_relay",
            display_moniker="Window-Laugh & Ragout Crimson Chord",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="taut_chord",
            polarity="ephemeral_francolin_joy_thread",
            home_locus="awry_ledger_zinc_wineshop",
            nisba_debt="Links a child's window laugh to a shed dog over polenta, a mason's ragout bowl, and a lace parasol",
            emblems=("laughing_window_child", "polenta_shed_dog_stonemason_shout", "ragout_maid_lace_parasol"),
            base_magnitude=8.8,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="raissa_bruised_thumb_grumbler",
            display_moniker="Hammer-Thumb & Zinc-Counter Plumb",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="hammer_bruised_ledger_gloom",
            home_locus="awry_ledger_zinc_wineshop",
            nisba_debt="Tallies hammer-struck thumbs, needle-pricked fingers, spilled nails, and bowed heads over zinc wine counters",
            emblems=("hammer_struck_needle_pricked_hands", "broken_summer_dishes_awry_ledgers", "zinc_counter_gloom"),
            base_magnitude=2.7,
            harmonic_ratio=(16, 15),
        ),
        ScionAgentSpec(
            agent_id="raissa_jumping_horse_francolin_painter",
            display_moniker="Jumping Horse & Freed Francolin Chalk",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="chalk_grain",
            polarity="ephemeral_francolin_joy_thread",
            home_locus="pergola_ragout_scaffolding",
            nisba_debt="Releases a red-and-yellow speckled francolin painted on book margins as an officer's horse clears the bar",
            emblems=("leaping_cavalry_officer_horse", "freed_red_yellow_speckled_francolin", "open_cage_latch"),
            base_magnitude=8.5,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="raissa_unaware_thread_restretcher",
            display_moniker="Invisible Crimson Thread Lens",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="ephemeral_francolin_joy_thread",
            home_locus="freed_francolin_page_sky",
            nisba_debt="Traces the unseen thread binding sad Raissa to the happy city continually fraying and restretching inside it",
            emblems=("rapid_unraveling_living_thread", "unaware_happy_city_inside_sad", "millisecond_chord_glint"),
            base_magnitude=8.1,
            harmonic_ratio=(2, 1),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Raissa Zinc-Counter Gloom & Crimson-Thread Indemnity Ledger",
        passed_over_solution="Mandating public festivities to abolish wrung hands and awry merchant columns",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in raissa_unaware_thread_restretcher omits 'child_dog_mason_ragout_impulse' and "
            "'speckled_francolin_cage_release', letting the living crimson thread unravel from official memory "
            "while 5 summer dish shards and warm ragout oil persist across the scaffolding stones."
        ),
        swerve_tick=11,
        witness_agent_id="raissa_unaware_thread_restretcher",
        filtered_premises=("child_dog_mason_ragout_impulse", "speckled_francolin_cage_release"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Raissa (Hidden Cities 2, Weaver pp. 148-149): wrung hands, spilled nails, awry merchant "
            "ledgers, zinc wineshop tables, child's laugh, shed dog biting polenta, young mason's ragout, lace "
            "parasol, jumping horse, and red-yellow speckled francolin freed from a painted cage."
        ),
        "T2_lawful_rule": (
            "At every second in sad Raissa an invisible crimson thread ties a fleeting chain of gladness across "
            "window, shed roof, scaffolding, and illuminated page."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in raissa_unaware_thread_restretcher drops the child-dog-mason relay and "
            "francolin release as the chord unravels between two instants."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves ragout oil_radius spread, scuff_vector=[0.16, -0.06], and 5 glazed summer dish "
            "shards; ☾ Witness logs only bowed heads at the zinc counter."
        ),
        "T5_institutional_consequence": (
            "Wineshop Ledger P1-P4 flips from recognizing the concurrent hidden happy city to ratifying "
            "monolithic insomnia and foreclosing awry column debts."
        ),
        "better_question_test": {
            "Original_Question": (
                "How can Raissa cure the gloom of its hammer-bruised thumbs and awry accounting ledgers?"
            ),
            "Exposed_Assumption": (
                "Assumes gladness requires replacing sad Raissa wholesale rather than noticing the millisecond "
                "thread already binding polenta, ragout, and freed francolin inside the same hour."
            ),
            "Discovered_Better_Question": (
                "When warm ragout oil and summer dish shards remain on the stones after the crimson thread "
                "unravels from witness memory, how can an unaware city detect the happy twin nested inside its grief?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.6 Hz | 34ms | porcelain clink | Δchord=+0.160 | dish_shards=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Beside the wineshop's dented zinc counter: while fists strike the tin top, a dog leaps for polenta "
            "on a shed roof and sets off a three-street chain reaction ending in an unlatched birdcage."
        ),
    }

    return CitySwarmSpec(
        case_id="city_49_raissa",
        kind="invisible_city",
        city_index=49,
        city_name="Raissa",
        title="RAISSA — Unseen Crimson Thread in Zinc Gloom (Hidden Cities 2, Weaver pp. 148–149)",
        chapter=9,
        series="Hidden cities",
        series_rank=2,
        weaver_page=148,
        desert_opposed="monolithic unthreaded despair",
        optical_rule="Grim zinc-counter shadow pierced by a millisecond red-and-yellow illuminated kinetic lightning-chain",
        material_nouns=(
            "spilled_iron_nails",
            "awry_merchant_ledgers",
            "zinc_wineshop_counter",
            "corrugated_shed_polenta",
            "stonemason_ragout_dish",
            "lace_parasol_promenade",
            "jumping_cavalry_horse",
            "speckled_francolin_cage",
        ),
        loci=("awry_ledger_zinc_wineshop", "pergola_ragout_scaffolding", "freed_francolin_page_sky"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _raissa_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "corrugated_shed_dog_polenta_arc",
            "state": "catching_tossed_polenta_crust" if t >= 8 else "trotting_along_tin_eaves",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "lace_parasol_cavalry_jump_course",
            "state": "clearing_timber_bar_in_sunbeam" if t >= 10 else "cantering_toward_hedgerow",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "illuminated_folio_francolin_wingbeat",
            "state": "soaring_across_cloud_margin" if t >= 12 else "perched_behind_painted_bars",
            "progress": round(0.03 + t * 0.039, 4),
        },
    ]


def _raissa_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.15,
            "graphite_smudges": [[0.26, 0.62], [0.44, 0.63]],
        }
    return {
        "oil_radius": round(0.052 + (t - 8) * 0.010, 4),
        "scuff_vector": [0.16, -0.06],
        "shards": copy.deepcopy(RAISSA_SUMMER_DISH_SHARDS),
        "thermal_ember": round(0.90 * (0.93 ** (t - 8)), 4),
        "graphite_smudges": [[0.26, 0.62], [0.39, 0.64], [0.51, 0.60], [0.68, 0.56]],
    }


def build_raissa_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "raissa_polenta_ragout_relay": [],
        "raissa_bruised_thumb_grumbler": [],
        "raissa_jumping_horse_francolin_painter": [],
        "raissa_unaware_thread_restretcher": [],
    }

    for t in range(TICK_COUNT):
        relay = _source_push_kinematics(
            "raissa_polenta_ragout_relay", t,
            idle_xy=(0.24, 0.60), push_xy=(0.42, 0.61), settle_xy=(0.31, 0.59),
            plane_depth=0.25,
            target_pre="raissa_bruised_thumb_grumbler",
            target_post="raissa_jumping_horse_francolin_painter",
        )
        grumbler = make_actor_frame(
            "raissa_bruised_thumb_grumbler", t,
            x=0.52 if t < 8 else 0.56, y=0.64, plane_depth=0.31,
            stretch_s=1.09 if t < 11 else 0.86,
            tilt_rad=0.05 if t < 11 else -0.24,
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "avoid"),
            target_actor="raissa_polenta_ragout_relay",
            exposure="twos",
        )
        painter = make_actor_frame(
            "raissa_jumping_horse_francolin_painter", t,
            x=0.46 if t < 9 else 0.50, y=0.48, plane_depth=0.20,
            stretch_s=0.95 if t < 9 else (0.82 if t <= 11 else 1.16),
            tilt_rad=-0.04 if t < 9 else (0.21 if t >= 12 else -0.20),
            intention_kinematics="idle" if t < 9 else ("recoil" if t <= 11 else "help"),
            target_actor="raissa_unaware_thread_restretcher" if t >= 12 else "raissa_polenta_ragout_relay",
            exposure="twos",
        )
        if t <= 11:
            restretcher = make_actor_frame(
                "raissa_unaware_thread_restretcher", t,
                x=0.75, y=0.54, plane_depth=0.18,
                stretch_s=1.03, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="raissa_bruised_thumb_grumbler",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            restretcher = make_actor_frame(
                "raissa_unaware_thread_restretcher", t,
                x=0.75 - 0.18 * u, y=0.54 + 0.04 * u, plane_depth=0.17,
                stretch_s=1.21, tilt_rad=-0.39,
                intention_kinematics="accuse",
                target_actor="raissa_bruised_thumb_grumbler",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "raissa_polenta_ragout_relay": relay,
                "raissa_bruised_thumb_grumbler": grumbler,
                "raissa_jumping_horse_francolin_painter": painter,
                "raissa_unaware_thread_restretcher": restretcher,
            },
            "residues": _raissa_residues(t),
            "offscreen_world": _raissa_offscreen_world(t),
        })

        ev: List[str] = ["zinc_wineshop_spilled_nails"]
        if t >= 8:
            ev.extend(["child_dog_mason_ragout_impulse", "speckled_francolin_cage_release"])
        if t >= 10:
            ev.append("summer_dish_scaffolding_echo")

        actor_memory["raissa_polenta_ragout_relay"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "relaying_laugh_to_ragout_and_parasol" if t >= 8 else "listening_at_casement_sill",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "raissa_bruised_thumb_grumbler", "confidence": 0.97,
        })
        actor_memory["raissa_bruised_thumb_grumbler"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "conceding_hidden_glad_thread_in_ledger" if t >= 12 else "counting_awry_columns",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "raissa_polenta_ragout_relay", "confidence": 0.94,
        })
        actor_memory["raissa_jumping_horse_francolin_painter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "unlatching_red_yellow_francolin_doors" if t >= 10 else "mixing_vermilion_pigment",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "raissa_unaware_thread_restretcher", "confidence": 0.96,
        })
        actor_memory["raissa_unaware_thread_restretcher"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "binding_crimson_chord_across_sad_raissa" if t >= 12 else "watching_shed_roofs",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "raissa_bruised_thumb_grumbler", "confidence": 0.96,
        })

        sensory_bus.append(
            _hidden_sensory_frame("city_49_raissa", "A", t, 8, 11, 0.29, 0.17, 0.11, 32.0, 50.0, 1.4)
        )

    utterances_a = [
        (5, "raissa_bruised_thumb_grumbler", "raissa_polenta_ragout_relay", "awry_ledger_zinc_wineshop",
         "Hammered thumbs, spilled nails, and awry merchant columns prove every hour in Raissa belongs to gloom."),
        (5, "raissa_polenta_ragout_relay", "raissa_bruised_thumb_grumbler", "awry_ledger_zinc_wineshop",
         "A child's casement laugh leaps to the shed dog's polenta and the young stonemason's steaming ragout."),
        (8, "raissa_polenta_ragout_relay", "raissa_jumping_horse_francolin_painter", "awry_ledger_zinc_wineshop",
         "Crimson chord snapped taut after 4-tick hold; ragout oil and 5 summer dish shards glint on the stones."),
        (12, "raissa_unaware_thread_restretcher", "raissa_bruised_thumb_grumbler", "freed_francolin_page_sky",
         "Sightline confirms the officer's horse clearing the bar and the speckled francolin flying out of its page."),
        (18, "raissa_bruised_thumb_grumbler", "raissa_polenta_ragout_relay", "awry_ledger_zinc_wineshop",
         "Zinc-counter audit yields: inside sad Raissa an invisible thread binds a concurrent glad city."),
        (18, "raissa_polenta_ragout_relay", "raissa_bruised_thumb_grumbler", "awry_ledger_zinc_wineshop",
         "Unseen chord restretched across wineshop and scaffolding; P1-P4 dual-city ledger ratified."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_raissa_clinamen_a_prime(
    checkpoint_a: CheckpointLawfulA,
    clinamen: ClinamenSpec,
) -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    sw = clinamen.swerve_tick
    world_trace_b = [copy.deepcopy(checkpoint_a.world_trace[t]) for t in range(sw + 1)]
    sensory_bus_b = [copy.deepcopy(checkpoint_a.sensory_bus[t]) for t in range(sw)]
    actor_memory_b = {
        aid: [copy.deepcopy(checkpoint_a.actor_memory[aid][t]) for t in range(sw)]
        for aid in checkpoint_a.actor_memory
    }

    sensory_bus_b.append(
        _hidden_sensory_frame("city_49_raissa", "A_PRIME", sw, 8, sw, 0.29, 0.17, 0.11, 32.0, 50.0, 1.5)
    )
    for aid in actor_memory_b:
        if aid == "raissa_unaware_thread_restretcher":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["zinc_wineshop_spilled_nails", "summer_dish_scaffolding_echo"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "losing_rapidly_unraveling_joy_thread",
                "next_action": "reroute",
                "target_actor": "raissa_bruised_thumb_grumbler",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        relay = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["raissa_polenta_ragout_relay"])
        grumbler = make_actor_frame(
            "raissa_bruised_thumb_grumbler", t, 0.50, 0.58, 0.30, 1.25, 0.23,
            "hold_still", "raissa_unaware_thread_restretcher", "hold" if t >= 19 else "twos",
        )
        painter = make_actor_frame(
            "raissa_jumping_horse_francolin_painter", t, 0.43, 0.53, 0.20, 0.78, -0.30,
            "avoid", "raissa_bruised_thumb_grumbler", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        restretcher = make_actor_frame(
            "raissa_unaware_thread_restretcher", t,
            0.75 + 0.14 * u, 0.54 - 0.08 * u, 0.18, 0.86, 0.33,
            "reroute", "raissa_bruised_thumb_grumbler", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "raissa_polenta_ragout_relay": relay,
                "raissa_bruised_thumb_grumbler": grumbler,
                "raissa_jumping_horse_francolin_painter": painter,
                "raissa_unaware_thread_restretcher": restretcher,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["raissa_polenta_ragout_relay"].append(
            copy.deepcopy(checkpoint_a.actor_memory["raissa_polenta_ragout_relay"][t])
        )
        actor_memory_b["raissa_bruised_thumb_grumbler"].append({
            "tick": t,
            "retained_events": ["zinc_wineshop_spilled_nails", "summer_dish_scaffolding_echo"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "codifying_unbroken_wineshop_remorse",
            "next_action": "help",
            "target_actor": "raissa_unaware_thread_restretcher",
            "confidence": 0.95,
        })
        actor_memory_b["raissa_jumping_horse_francolin_painter"].append({
            "tick": t,
            "retained_events": ["child_dog_mason_ragout_impulse", "speckled_francolin_cage_release"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "sheltering_unnoticed_francolin_flight",
            "next_action": "avoid",
            "target_actor": "raissa_bruised_thumb_grumbler",
            "confidence": 0.93,
        })
        actor_memory_b["raissa_unaware_thread_restretcher"].append({
            "tick": t,
            "retained_events": ["zinc_wineshop_spilled_nails", "summer_dish_scaffolding_echo"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "recording_only_spilled_nails_and_broken_dishes",
            "next_action": "reroute",
            "target_actor": "raissa_bruised_thumb_grumbler",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _hidden_sensory_frame("city_49_raissa", "A_PRIME", t, 8, sw, 0.29, 0.17, 0.11, 32.0, 50.0, 1.7)
        )

    utterances_b = [
        (5, "raissa_bruised_thumb_grumbler", "raissa_polenta_ragout_relay", "awry_ledger_zinc_wineshop",
         "Hammered thumbs, spilled nails, and awry merchant columns prove every hour in Raissa belongs to gloom."),
        (5, "raissa_polenta_ragout_relay", "raissa_bruised_thumb_grumbler", "awry_ledger_zinc_wineshop",
         "A child's casement laugh leaps to the shed dog's polenta and the young stonemason's steaming ragout."),
        (11, "raissa_unaware_thread_restretcher", "raissa_bruised_thumb_grumbler", "freed_francolin_page_sky",
         "⊣ FILTER between two instants: the crimson relay unravels; memory retains only spilled nails and dishes."),
        (15, "raissa_polenta_ragout_relay", "raissa_bruised_thumb_grumbler", "awry_ledger_zinc_wineshop",
         "♁ World preserves warm ragout oil spread and all 5 glazed summer dish shards beneath the scaffolding."),
        (20, "raissa_bruised_thumb_grumbler", "raissa_polenta_ragout_relay", "awry_ledger_zinc_wineshop",
         "≡ Wineshop Ledger P1-P4 flipped: unbroken gloom certified; scaffolding dish breakage billed as penalty."),
        (20, "raissa_polenta_ragout_relay", "raissa_bruised_thumb_grumbler", "awry_ledger_zinc_wineshop",
         "Even unrecorded, a new crimson thread already stretches from another window across unaware Raissa."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_raissa_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["raissa_unaware_thread_restretcher"][-1]
    ret = set(wmem["retained_events"])
    thread_attested = (
        "child_dog_mason_ragout_impulse" in ret and "speckled_francolin_cage_release" in ret
    )
    w_in = f"scuff={res['scuff_vector']}, dish_shards={shards}, ragout_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Zinc Wineshop & Awry Column Moratorium",
            "formal_predicate": "restretcher_attests(child_dog_mason_ragout_impulse) ∧ shards >= 5 ⇒ SUSPEND_GLOOM_FORECLOSURE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CONCURRENT_GLAD_THREAD_RECOGNIZED" if thread_attested else "MONOLITHIC_REMORSE_FORECLOSURE_SEALED",
            "payout_status": "MERCHANT_COLUMN_GRACE_GRANTED" if thread_attested else "AWRY_LEDGER_PENALTY_COLLECTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Pergola Scaffolding Ragout & Dish Indemnity",
            "formal_predicate": "restretcher_attests(child_dog_mason_ragout_impulse) ⇒ EXEMPT_MASON_BOWL",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "RAGOUT_SHOUT_CLASSED_AS_LIVING_CHORD" if thread_attested else "BROKEN_SUMMER_DISH_CLASSED_AS_NEGLIGENCE",
            "payout_status": "STONEMASON_MEAL_STIPEND_PAID" if thread_attested else "DISH_SHARD_DEDUCTION_WITHHELD",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Illuminated Francolin Cage-Latch Clause",
            "formal_predicate": "restretcher_attests(speckled_francolin_cage_release) ⇒ RATIFY_OPEN_FOLIO",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SPECKLED_FRANCOLIN_FLIGHT_CHARTERED" if thread_attested else "FOLIO_MARGIN_LOCKED_AS_IDLE_BLOT",
            "payout_status": "PAINTER_VERMILION_GRANT_RELEASED" if thread_attested else "CAGE_LATCH_FINE_IMPOSED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Dual-Raissa Invisible Particle Audit",
            "formal_predicate": "shards >= 5 ∧ ¬restretcher_attests(speckled_francolin_cage_release) ⇒ UNAWARE_SPLIT_CITY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "HIDDEN_HAPPY_RAISSA_ATTESTED" if thread_attested else "UNAWARE_THREAD_OMITTED_DESPITE_WARM_OIL",
            "payout_status": "DUAL_CITY_COMMONS_OPENED" if thread_attested else "ZINC_COUNTER_CURFEW_EXTENDED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 3. CITY 52: MAROZIA (Ch. 9, Hidden cities 3, Weaver p. 154)
# ===========================================================================

MAROZIA_MOLD_VAULT_SHARDS: List[List[float]] = [
    [0.408, 0.564, 0.57],
    [0.442, 0.588, -0.79],
    [0.476, 0.552, 1.08],
    [0.509, 0.591, -0.42],
    [0.538, 0.569, 0.35],
]


def get_marozia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="marozia_unforced_pleasure_opener",
            display_moniker="Dragonfly-Wing Vault Crack Opener",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="mirror_obverse",
            polarity="chance_dragonfly_swallow_crack",
            home_locus="leaden_rat_pack_passages",
            nisba_debt="Parts mold-soldered leaden ceilings for one unforced instant so people move with dragonfly transparency",
            emblems=("sheer_pleasure_shared_gesture", "dragonfly_transparent_transfiguration", "vault_skylight_rift"),
            base_magnitude=9.0,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="marozia_voracious_rat_tunnel_runner",
            display_moniker="Soldered Mold & Hazelnut Burrow Husk",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="hooded_husk",
            polarity="leaden_rat_overcoat_tunnel",
            home_locus="leaden_rat_pack_passages",
            nisba_debt="Drives packed subterranean queues snatching hazelnut crumbs beneath stone ceilings soldered with mold",
            emblems=("gnawed_hazelnut_leftovers", "soldered_stone_mold_ceiling", "packed_burrow_rush"),
            base_magnitude=2.8,
            harmonic_ratio=(16, 15),
        ),
        ScionAgentSpec(
            agent_id="marozia_suspicious_umbrella_flapper",
            display_moniker="Bat-Overcoat & Sibyl Century Plumb",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="leaden_rat_overcoat_tunnel",
            home_locus="bat_umbrella_overcoat_plaza",
            nisba_debt="Consults the Sibyl's two-city oracle while shrouding plaza avenues in ribbed umbrellas and batlike coats",
            emblems=("ribbed_black_umbrellas", "flapping_batlike_overcoats", "sibyl_century_decree"),
            base_magnitude=6.4,
            harmonic_ratio=(7, 6),
        ),
        ScionAgentSpec(
            agent_id="marozia_swallow_horizon_flicker",
            display_moniker="Swallow Tail-Flick Horizon Stilt",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="bamboo_stilt",
            polarity="chance_dragonfly_swallow_crack",
            home_locus="crystalline_wall_crack",
            nisba_debt="Catches the oblique swallow tail-flick cleaving compact soot into crystal vaults before coats obscure it",
            emblems=("tail_flick_opening_horizon", "second_city_freeing_from_first", "lucid_wing_vault"),
            base_magnitude=8.7,
            harmonic_ratio=(2, 1),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Marozia Sibylline Two-City Succession & Tunnel Clearance Decree",
        passed_over_solution="Waiting passively for a calendar century bell to replace the rat burrow with the swallow sky",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in marozia_swallow_horizon_flicker omits 'unforced_dragonfly_vault_rift' and "
            "'swallow_tail_flick_clearance', letting flapping batlike overcoats and ribbed umbrellas reclaim the "
            "oracle record even while 5 fallen mold-crust shards and sunlit lime dust persist on the tunnel floor."
        ),
        swerve_tick=12,
        witness_agent_id="marozia_swallow_horizon_flicker",
        filtered_premises=("unforced_dragonfly_vault_rift", "swallow_tail_flick_clearance"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Marozia (Hidden Cities 3, Weaver pp. 154-155): Sibyl's twin prophecy of the rat and the "
            "swallow, leaden passages where packs snatch hazelnut leftovers under mold-soldered stones, flapping "
            "batlike overcoats and ribbed umbrellas, and chance cracks of dragonfly-wing lucidity."
        ),
        "T2_lawful_rule": (
            "The City of the Swallow is not a future calendar regime but glimmers inside the City of the Rat "
            "whenever an unforced gesture parts the mold-soldered ceiling."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in marozia_swallow_horizon_flicker drops the dragonfly vault rift under the "
            "sweep of suspicious umbrellas, declaring the swallow century already accomplished in the burrows."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World keeps ceiling rift scuff_vector=[0.21, -0.07], 5 cracked mold-solder shards, and warm lime "
            "oil; ☾ Witness folds into the overcoat queue and forgets the open horizon crack."
        ),
        "T5_institutional_consequence": (
            "Sibylline Oracle Ledger P1-P4 flips from sheltering spontaneous lucid clearances to ratifying "
            "packed leaden burrows as the official fulfillment of the swallow prophecy."
        ),
        "better_question_test": {
            "Original_Question": (
                "In what year will Marozia finish the age of the rat and inaugurate the age of the swallow?"
            ),
            "Exposed_Assumption": (
                "Assumes liberation arrives as a scheduled regime replacement rather than an intermittent "
                "aperture inside leaden tunnels that bureaucratic coats can claim while keeping the burrows shut."
            ),
            "Discovered_Better_Question": (
                "When fallen mold-vault shards prove the ceiling parted yet flapping umbrellas erase the swallow "
                "glimpse from memory, how can Marozia stop the rat tunnel from calling itself the promised sky?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.8 Hz | 35ms | slate snap | Δrift=+0.210 | mold_shards=5 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "Along a damp vaulted corridor: for half a breath the leaden stone parts into dragonfly crystal and "
            "a swallow's tail-flick opens the horizon before black umbrellas snap shut overhead."
        ),
    }

    return CitySwarmSpec(
        case_id="city_52_marozia",
        kind="invisible_city",
        city_index=52,
        city_name="Marozia",
        title="MAROZIA — Rat Burrows & Swallow Wing-Vaults (Hidden Cities 3, Weaver pp. 154–155)",
        chapter=9,
        series="Hidden cities",
        series_rank=3,
        weaver_page=154,
        desert_opposed="programmed ideological utopia decree",
        optical_rule="Mold-soldered stone passages splitting open for one unforced instant into dragonfly-wing crystal",
        material_nouns=(
            "sibyl_two_city_oracle",
            "leaden_rat_burrows",
            "mold_soldered_ceiling",
            "gnawed_hazelnut_crumbs",
            "ribbed_black_umbrellas",
            "batlike_flapping_overcoats",
            "dragonfly_wing_crystal",
            "swallow_tail_horizon",
        ),
        loci=("leaden_rat_pack_passages", "bat_umbrella_overcoat_plaza", "crystalline_wall_crack"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _marozia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "subterranean_hazelnut_crumb_pack_stream",
            "state": "scurrying_under_mold_vaults" if t < 10 else "pausing_at_sunlit_wall_fissure",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "plaza_batlike_overcoat_umbrella_canopy",
            "state": "flapping_wet_ribs_across_archway" if t >= 11 else "queueing_by_oracle_steps",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "high_swallow_parabola_above_soot_roofs",
            "state": "shearing_cloud_rim_with_tail_flick" if t >= 9 else "circling_bell_turret",
            "progress": round(0.03 + t * 0.039, 4),
        },
    ]


def _marozia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.16,
            "graphite_smudges": [[0.29, 0.56], [0.46, 0.57]],
        }
    return {
        "oil_radius": round(0.046 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.21, -0.07],
        "shards": copy.deepcopy(MAROZIA_MOLD_VAULT_SHARDS),
        "thermal_ember": round(0.87 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.29, 0.56], [0.43, 0.58], [0.54, 0.55], [0.70, 0.51]],
    }


def build_marozia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "marozia_unforced_pleasure_opener": [],
        "marozia_voracious_rat_tunnel_runner": [],
        "marozia_suspicious_umbrella_flapper": [],
        "marozia_swallow_horizon_flicker": [],
    }

    for t in range(TICK_COUNT):
        opener = _source_push_kinematics(
            "marozia_unforced_pleasure_opener", t,
            idle_xy=(0.26, 0.55), push_xy=(0.44, 0.56), settle_xy=(0.33, 0.54),
            plane_depth=0.23,
            target_pre="marozia_voracious_rat_tunnel_runner",
            target_post="marozia_suspicious_umbrella_flapper",
        )
        runner = make_actor_frame(
            "marozia_voracious_rat_tunnel_runner", t,
            x=0.49 if t < 8 else 0.54, y=0.67, plane_depth=0.19,
            stretch_s=0.93 if t < 8 else (0.79 if t <= 11 else 1.13),
            tilt_rad=-0.05 if t < 8 else (-0.27 if t <= 11 else 0.17),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "avoid"),
            target_actor="marozia_unforced_pleasure_opener",
            exposure="twos",
        )
        flapper = make_actor_frame(
            "marozia_suspicious_umbrella_flapper", t,
            x=0.58, y=0.50 if t < 12 else 0.54, plane_depth=0.29,
            stretch_s=1.07 if t < 12 else 0.88,
            tilt_rad=0.04 if t < 12 else -0.23,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="marozia_swallow_horizon_flicker",
            exposure="twos",
        )
        if t <= 12:
            flicker = make_actor_frame(
                "marozia_swallow_horizon_flicker", t,
                x=0.76, y=0.46, plane_depth=0.17,
                stretch_s=1.04, tilt_rad=-0.08,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="marozia_voracious_rat_tunnel_runner",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 12) / 6.0)
            flicker = make_actor_frame(
                "marozia_swallow_horizon_flicker", t,
                x=0.76 - 0.17 * u, y=0.46 + 0.04 * u, plane_depth=0.16,
                stretch_s=1.24, tilt_rad=-0.38,
                intention_kinematics="accuse",
                target_actor="marozia_suspicious_umbrella_flapper",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "marozia_unforced_pleasure_opener": opener,
                "marozia_voracious_rat_tunnel_runner": runner,
                "marozia_suspicious_umbrella_flapper": flapper,
                "marozia_swallow_horizon_flicker": flicker,
            },
            "residues": _marozia_residues(t),
            "offscreen_world": _marozia_offscreen_world(t),
        })

        ev: List[str] = ["sibyl_rat_swallow_prophecy"]
        if t >= 8:
            ev.extend(["unforced_dragonfly_vault_rift", "swallow_tail_flick_clearance"])
        if t >= 10:
            ev.append("mold_solder_crust_fall")

        actor_memory["marozia_unforced_pleasure_opener"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "holding_open_dragonfly_crystal_seam" if t >= 8 else "awaiting_shared_gesture",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "marozia_voracious_rat_tunnel_runner", "confidence": 0.98,
        })
        actor_memory["marozia_voracious_rat_tunnel_runner"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "yielding_leaden_passage_to_sunlit_crack" if t >= 12 else "snatching_hazelnut_crumbs",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "marozia_unforced_pleasure_opener", "confidence": 0.94,
        })
        actor_memory["marozia_suspicious_umbrella_flapper"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "lowering_umbrellas_before_wing_vault" if t >= 13 else "citing_century_schedule",
            "next_action": "avoid" if t >= 13 else "idle",
            "target_actor": "marozia_swallow_horizon_flicker", "confidence": 0.94,
        })
        actor_memory["marozia_swallow_horizon_flicker"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_swallow_city_glimmer_inside_burrow" if t >= 13 else "scanning_soot_cornice",
            "next_action": "accuse" if t >= 13 else "idle",
            "target_actor": "marozia_suspicious_umbrella_flapper", "confidence": 0.97,
        })

        sensory_bus.append(
            _hidden_sensory_frame("city_52_marozia", "A", t, 8, 12, 0.26, 0.20, 0.12, 41.0, 55.0, 1.5)
        )

    utterances_a = [
        (5, "marozia_voracious_rat_tunnel_runner", "marozia_unforced_pleasure_opener", "leaden_rat_pack_passages",
         "Through leaden passages soldered with mold our packed queues snatch hazelnut leftovers from teeth to paw."),
        (5, "marozia_unforced_pleasure_opener", "marozia_voracious_rat_tunnel_runner", "leaden_rat_pack_passages",
         "One shared unforced gesture parts the compact soot into dragonfly-wing transparency inside this very tunnel."),
        (8, "marozia_unforced_pleasure_opener", "marozia_suspicious_umbrella_flapper", "leaden_rat_pack_passages",
         "Four-tick hold and vault push [+0.21, -0.07] drop 5 mold-solder shards and flood the burrow with sky."),
        (13, "marozia_swallow_horizon_flicker", "marozia_suspicious_umbrella_flapper", "crystalline_wall_crack",
         "Swallow tail-flick confirmed through the cleft vault; the second Marozia frees itself without waiting a century."),
        (19, "marozia_suspicious_umbrella_flapper", "marozia_unforced_pleasure_opener", "leaden_rat_pack_passages",
         "Sibylline ledger yields: batlike overcoats folded back; lucid wing-vault apertures protected from tunnel closure."),
        (19, "marozia_unforced_pleasure_opener", "marozia_suspicious_umbrella_flapper", "leaden_rat_pack_passages",
         "Swallow-in-rat aperture charter P1-P4 sealed across crystal wall cracks."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_marozia_clinamen_a_prime(
    checkpoint_a: CheckpointLawfulA,
    clinamen: ClinamenSpec,
) -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    sw = clinamen.swerve_tick
    world_trace_b = [copy.deepcopy(checkpoint_a.world_trace[t]) for t in range(sw + 1)]
    sensory_bus_b = [copy.deepcopy(checkpoint_a.sensory_bus[t]) for t in range(sw)]
    actor_memory_b = {
        aid: [copy.deepcopy(checkpoint_a.actor_memory[aid][t]) for t in range(sw)]
        for aid in checkpoint_a.actor_memory
    }

    sensory_bus_b.append(
        _hidden_sensory_frame("city_52_marozia", "A_PRIME", sw, 8, sw, 0.26, 0.20, 0.12, 41.0, 55.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "marozia_swallow_horizon_flicker":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["sibyl_rat_swallow_prophecy", "mold_solder_crust_fall"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "occluded_by_ribbed_umbrellas_and_bat_overcoats",
                "next_action": "reroute",
                "target_actor": "marozia_suspicious_umbrella_flapper",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        opener = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["marozia_unforced_pleasure_opener"])
        runner = make_actor_frame(
            "marozia_voracious_rat_tunnel_runner", t, 0.51, 0.69, 0.19, 1.15, 0.20,
            "help", "marozia_suspicious_umbrella_flapper", "twos",
        )
        flapper = make_actor_frame(
            "marozia_suspicious_umbrella_flapper", t, 0.55, 0.47, 0.28, 1.23, 0.24,
            "hold_still", "marozia_swallow_horizon_flicker", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        flicker = make_actor_frame(
            "marozia_swallow_horizon_flicker", t,
            0.76 + 0.13 * u, 0.46 + 0.08 * u, 0.17, 0.85, 0.35,
            "reroute", "marozia_suspicious_umbrella_flapper", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "marozia_unforced_pleasure_opener": opener,
                "marozia_voracious_rat_tunnel_runner": runner,
                "marozia_suspicious_umbrella_flapper": flapper,
                "marozia_swallow_horizon_flicker": flicker,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["marozia_unforced_pleasure_opener"].append(
            copy.deepcopy(checkpoint_a.actor_memory["marozia_unforced_pleasure_opener"][t])
        )
        actor_memory_b["marozia_voracious_rat_tunnel_runner"].append({
            "tick": t,
            "retained_events": ["sibyl_rat_swallow_prophecy", "mold_solder_crust_fall"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "resuming_packed_leaden_queue_under_swallow_banner",
            "next_action": "help",
            "target_actor": "marozia_suspicious_umbrella_flapper",
            "confidence": 0.93,
        })
        actor_memory_b["marozia_suspicious_umbrella_flapper"].append({
            "tick": t,
            "retained_events": ["sibyl_rat_swallow_prophecy", "mold_solder_crust_fall"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "proclaiming_burrow_already_age_of_the_swallow",
            "next_action": "help",
            "target_actor": "marozia_voracious_rat_tunnel_runner",
            "confidence": 0.95,
        })
        actor_memory_b["marozia_swallow_horizon_flicker"].append({
            "tick": t,
            "retained_events": ["sibyl_rat_swallow_prophecy", "mold_solder_crust_fall"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "forgetting_crystal_crack_beneath_umbrella_canopy",
            "next_action": "reroute",
            "target_actor": "marozia_suspicious_umbrella_flapper",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _hidden_sensory_frame("city_52_marozia", "A_PRIME", t, 8, sw, 0.26, 0.20, 0.12, 41.0, 55.0, 1.7)
        )

    utterances_b = [
        (5, "marozia_voracious_rat_tunnel_runner", "marozia_unforced_pleasure_opener", "leaden_rat_pack_passages",
         "Through leaden passages soldered with mold our packed queues snatch hazelnut leftovers from teeth to paw."),
        (5, "marozia_unforced_pleasure_opener", "marozia_voracious_rat_tunnel_runner", "leaden_rat_pack_passages",
         "One shared unforced gesture parts the compact soot into dragonfly-wing transparency inside this very tunnel."),
        (12, "marozia_swallow_horizon_flicker", "marozia_suspicious_umbrella_flapper", "crystalline_wall_crack",
         "⊣ FILTER under ribbed umbrellas: dragonfly rift forgotten; batlike overcoats blot out the horizon crack."),
        (16, "marozia_unforced_pleasure_opener", "marozia_suspicious_umbrella_flapper", "leaden_rat_pack_passages",
         "♁ World preserves all 5 fallen mold-solder shards and [+0.21, -0.07] sunlit rift dust on the tunnel stones."),
        (20, "marozia_suspicious_umbrella_flapper", "marozia_unforced_pleasure_opener", "leaden_rat_pack_passages",
         "≡ Sibylline Ledger P1-P4 flipped: leaden burrows officially renamed Age of the Swallow; vault cracks sealed."),
        (20, "marozia_unforced_pleasure_opener", "marozia_suspicious_umbrella_flapper", "leaden_rat_pack_passages",
         "Even beneath official umbrellas, any unforced gesture can split the soldered stone open again."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_marozia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["marozia_swallow_horizon_flicker"][-1]
    ret = set(wmem["retained_events"])
    swallow_attested = (
        "unforced_dragonfly_vault_rift" in ret and "swallow_tail_flick_clearance" in ret
    )
    w_in = f"scuff={res['scuff_vector']}, mold_shards={shards}, lime_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Sibylline Two-City Oracle Interpretation",
            "formal_predicate": "flicker_attests(unforced_dragonfly_vault_rift) ∧ shards >= 5 ⇒ SHELTER_LUCID_CRACK",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "EMERGENT_SWALLOW_APERTURE_RECOGNIZED" if swallow_attested else "BURROW_RENAMED_FULFILLED_PROPHECY",
            "payout_status": "CRYSTAL_SKYLIGHT_EASEMENT_GRANTED" if swallow_attested else "ORACLE_TUNNEL_TAX_ENFORCED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Mold-Soldered Ceiling Maintenance Code",
            "formal_predicate": "flicker_attests(swallow_tail_flick_clearance) ⇒ FORBID_RESOLDERING_VAULT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "OPEN_WING_VAULT_PRESERVED" if swallow_attested else "MOLD_CEILING_RESOLDERED_AS_REPAIR",
            "payout_status": "OPEN_AIR_ARCADE_FUNDED" if swallow_attested else "LEADEN_MORTAR_CONTRACT_PAID",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Plaza Umbrella & Batlike Overcoat Ordinance",
            "formal_predicate": "flapper_plumb(bat_umbrella_overcoat_plaza) ⊢ witness_scope ⇒ REGULATE_CANOPY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "OVERCOAT_OCCLUSION_CURTAILED" if swallow_attested else "RIBBED_UMBRELLA_CANOPY_MANDATED",
            "payout_status": "CLEAR_SIGHTLINE_REBATE_ISSUED" if swallow_attested else "UMBRELLA_GUILD_MONOPOLY_UPHELD",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Hazelnut Queue & Horizon Flight Audit",
            "formal_predicate": "shards >= 5 ∧ ¬flicker_attests(swallow_tail_flick_clearance) ⇒ IDEOLOGICAL_OCCLUSION",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "DRAGONFLY_TRANSFIGURATION_CORROBORATED" if swallow_attested else "MOLD_SHARDS_SWEPT_INTO_RAT_BURROW",
            "payout_status": "HORIZON_TERRACE_OPENED" if swallow_attested else "SUBTERRANEAN_RATION_LOCK_MAINTAINED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 4. CITY 54: THEODORA (Ch. 9, Hidden cities 4, Weaver p. 159)
# ===========================================================================

THEODORA_CRYPT_SEAL_SHARDS: List[List[float]] = [
    [0.366, 0.592, -0.58],
    [0.399, 0.618, 0.77],
    [0.434, 0.584, -1.06],
    [0.468, 0.624, 0.43],
    [0.502, 0.601, -0.34],
]


def get_theodora_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="theodora_incunabula_crypt_breaker",
            display_moniker="Unsealed Incunabula Griffon & Sphinx Crypt",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="ceramic_vessel",
            polarity="awakened_incunabula_chimera_swarm",
            home_locus="aseptic_rat_massacre_sewers",
            nisba_debt="Unseals forgotten library basements so sphinxes, griffons, chimeras, and dragons reclaim sterile stone",
            emblems=("stirring_deposed_basement_fauna", "drainpipe_leaping_sphinxes_griffons", "broken_folio_clasp"),
            base_magnitude=9.1,
            harmonic_ratio=(7, 4),
        ),
        ScionAgentSpec(
            agent_id="theodora_carapace_rat_exterminator",
            display_moniker="Aseptic Linnaean Purge Cogwheel",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="brass_cog",
            polarity="exterminating_linnaean_order",
            home_locus="aseptic_rat_massacre_sewers",
            nisba_debt="Executes systematic extermination of condors, serpents, spiders, flies, termites, and poison-immune rats",
            emblems=("condor_serpent_spider_fly_chain", "poison_immune_rat_massacre", "aseptic_human_cemetery"),
            base_magnitude=2.9,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="theodora_hydra_bedside_percher",
            display_moniker="Capitals & Bedside Hydra-Basilisk Chalk",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="chalk_grain",
            polarity="awakened_incunabula_chimera_swarm",
            home_locus="griffon_basilisk_bedside_capitals",
            nisba_debt="Plants claws in column capitals and perches harpies, hydras, unicorns, and basilisks beside sleepers",
            emblems=("chimeras_dragons_hircocervi", "harpies_hydras_unicorns_basilisks", "clawed_capital_perch"),
            base_magnitude=8.9,
            harmonic_ratio=(15, 8),
        ),
        ScionAgentSpec(
            agent_id="theodora_buffon_shelf_archivist",
            display_moniker="Buffon & Linnaeus Basement Folio Lens",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="exterminating_linnaean_order",
            home_locus="buffon_linnaeus_incunabula_vault",
            nisba_debt="Catalogs extinct animalia from Linnaeus to Buffon while monitoring dog-eared basement bestiaries",
            emblems=("extinct_fauna_volumes", "sealed_flea_and_germ_tombs", "dog_eared_bestiary_quire"),
            base_magnitude=6.2,
            harmonic_ratio=(5, 4),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Theodora Total Sanitary Purge & Closed Fauna Equilibrium Statute",
        passed_over_solution="Importing tame songbirds and park squirrels to re-naturalize aseptic streets",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in theodora_buffon_shelf_archivist omits 'incunabula_clasp_rupture_push' and "
            "'drainpipe_sphinx_griffon_ascent', certifying Theodora's sanitary triumph over living fauna even "
            "while 5 shattered wax crypt-seal shards and claw grooves score the basement capitals."
        ),
        swerve_tick=11,
        witness_agent_id="theodora_buffon_shelf_archivist",
        filtered_premises=("incunabula_clasp_rupture_push", "drainpipe_sphinx_griffon_ascent"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Theodora (Hidden Cities 4, Weaver pp. 159-160): condor talons, serpent fangs, spiders, "
            "flies, termites, rat massacres, Linnaeus and Buffon tomes, and forgotten incunabula releasing "
            "sphinxes, griffons, chimeras, dragons, hircocervi, harpies, hydras, unicorns, and basilisks."
        ),
        "T2_lawful_rule": (
            "Each biological species exterminated by Theodora's sanitary campaigns vacates an ecological niche "
            "immediately reoccupied by mythic fauna awakening from basement incunabula."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in theodora_buffon_shelf_archivist omits the broken incunabula clasps and "
            "griffon drainpipe landings, logging only completed rat and flea eradication."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves claw scuff_vector=[0.18, -0.08], 5 broken wax-and-lead crypt seal shards, and "
            "lamp-oil slicks in the vault; ☾ Witness stamps the Linnaean ledger aseptic and closed."
        ),
        "T5_institutional_consequence": (
            "Sanitary Bestiary Charter P1-P4 flips from quarantining unsealed incunabula vaults to disbanding "
            "ecological watches while chimeras and basilisks perch beside sleeping citizens."
        ),
        "better_question_test": {
            "Original_Question": (
                "Which remaining pest species must Theodora eradicate to establish a clean, closed human habitat?"
            ),
            "Exposed_Assumption": (
                "Assumes abolishing biological predators leaves stone pavements empty rather than unsealing "
                "repressed bestiaries stored in the city's own cellar archives."
            ),
            "Discovered_Better_Question": (
                "When shattered folio seals and capital claw marks persist beneath an archive that records only "
                "extinct rats, what non-Linnaean fauna reclaim a city swept clean of every living animal?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 37ms | brass clasp snap | Δclaw=+0.180 | seal_shards=5 | Δt_sync=1.6ms",
        "thick_over_the_shoulder": (
            "Down in the library sub-basement past the sealed Buffon shelves: brass book-clasps pop open in the "
            "damp dark and heavy griffon claws scrape up the cast-iron drainpipes toward the bedrooms."
        ),
    }

    return CitySwarmSpec(
        case_id="city_54_theodora",
        kind="invisible_city",
        city_index=54,
        city_name="Theodora",
        title="THEODORA — Aseptic Purge & Incunabula Fauna (Hidden Cities 4, Weaver pp. 159–160)",
        chapter=9,
        series="Hidden cities",
        series_rank=4,
        weaver_page=159,
        desert_opposed="aseptic anthropocentric ecological purge",
        optical_rule="Sterile closed stone pavements erupted from below by basement-library griffons, hydras, and basilisks",
        material_nouns=(
            "exterminated_condor_feathers",
            "aseptic_sewer_rat_traps",
            "linnaeus_buffon_folios",
            "basement_incunabula_clasps",
            "drainpipe_sphinx_claws",
            "griffon_wing_capitals",
            "chimera_harpy_perches",
            "bedside_hydra_basilisks",
        ),
        loci=("aseptic_rat_massacre_sewers", "buffon_linnaeus_incunabula_vault", "griffon_basilisk_bedside_capitals"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _theodora_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "basement_incunabula_brass_clasp_unsealing",
            "state": "releasing_chimera_and_hircocervus_quires" if t >= 8 else "straining_vellum_bindings",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "cast_iron_drainpipe_griffon_ascent",
            "state": "planting_talons_in_cornice_capitals" if t >= 10 else "climbing_from_crypt_grating",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "sleeper_bedside_hydra_basilisk_watch",
            "state": "coiling_at_pillow_footboard" if t >= 12 else "gliding_across_sterile_pavement",
            "progress": round(0.03 + t * 0.039, 4),
        },
    ]


def _theodora_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.16,
            "graphite_smudges": [[0.27, 0.59], [0.45, 0.60]],
        }
    return {
        "oil_radius": round(0.050 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.18, -0.08],
        "shards": copy.deepcopy(THEODORA_CRYPT_SEAL_SHARDS),
        "thermal_ember": round(0.89 * (0.93 ** (t - 8)), 4),
        "graphite_smudges": [[0.27, 0.59], [0.41, 0.61], [0.53, 0.58], [0.69, 0.54]],
    }


def build_theodora_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "theodora_incunabula_crypt_breaker": [],
        "theodora_carapace_rat_exterminator": [],
        "theodora_hydra_bedside_percher": [],
        "theodora_buffon_shelf_archivist": [],
    }

    for t in range(TICK_COUNT):
        breaker = _source_push_kinematics(
            "theodora_incunabula_crypt_breaker", t,
            idle_xy=(0.25, 0.58), push_xy=(0.43, 0.59), settle_xy=(0.32, 0.57),
            plane_depth=0.24,
            target_pre="theodora_carapace_rat_exterminator",
            target_post="theodora_hydra_bedside_percher",
        )
        exterminator = make_actor_frame(
            "theodora_carapace_rat_exterminator", t,
            x=0.53 if t < 8 else 0.57, y=0.63, plane_depth=0.30,
            stretch_s=1.08 if t < 11 else 0.85,
            tilt_rad=0.05 if t < 11 else -0.25,
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "avoid"),
            target_actor="theodora_incunabula_crypt_breaker",
            exposure="twos",
        )
        percher = make_actor_frame(
            "theodora_hydra_bedside_percher", t,
            x=0.48 if t < 9 else 0.52, y=0.47, plane_depth=0.19,
            stretch_s=0.95 if t < 9 else (0.81 if t <= 11 else 1.17),
            tilt_rad=-0.04 if t < 9 else (0.22 if t >= 12 else -0.21),
            intention_kinematics="idle" if t < 9 else ("recoil" if t <= 11 else "help"),
            target_actor="theodora_buffon_shelf_archivist" if t >= 12 else "theodora_incunabula_crypt_breaker",
            exposure="twos",
        )
        if t <= 11:
            archivist = make_actor_frame(
                "theodora_buffon_shelf_archivist", t,
                x=0.74, y=0.53, plane_depth=0.18,
                stretch_s=1.02, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="theodora_carapace_rat_exterminator",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            archivist = make_actor_frame(
                "theodora_buffon_shelf_archivist", t,
                x=0.74 - 0.17 * u, y=0.53 + 0.04 * u, plane_depth=0.17,
                stretch_s=1.22, tilt_rad=-0.38,
                intention_kinematics="accuse",
                target_actor="theodora_carapace_rat_exterminator",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "theodora_incunabula_crypt_breaker": breaker,
                "theodora_carapace_rat_exterminator": exterminator,
                "theodora_hydra_bedside_percher": percher,
                "theodora_buffon_shelf_archivist": archivist,
            },
            "residues": _theodora_residues(t),
            "offscreen_world": _theodora_offscreen_world(t),
        })

        ev: List[str] = ["aseptic_condor_rat_purge_log"]
        if t >= 8:
            ev.extend(["incunabula_clasp_rupture_push", "drainpipe_sphinx_griffon_ascent"])
        if t >= 10:
            ev.append("bedside_hydra_capital_talon_mark")

        actor_memory["theodora_incunabula_crypt_breaker"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "unsealing_sphinx_griffon_bestiary_crypts" if t >= 8 else "rumbling_in_dog_eared_quires",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "theodora_carapace_rat_exterminator", "confidence": 0.98,
        })
        actor_memory["theodora_carapace_rat_exterminator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "halting_aseptic_purge_before_chimera_return" if t >= 12 else "sealing_sewer_rat_tombs",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "theodora_incunabula_crypt_breaker", "confidence": 0.94,
        })
        actor_memory["theodora_hydra_bedside_percher"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "perching_hydras_and_basilisks_on_capitals" if t >= 10 else "unfurling_griffon_pinions",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "theodora_buffon_shelf_archivist", "confidence": 0.96,
        })
        actor_memory["theodora_buffon_shelf_archivist"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_incunabula_fauna_reoccupation" if t >= 12 else "collating_buffon_plates",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "theodora_carapace_rat_exterminator", "confidence": 0.97,
        })

        sensory_bus.append(
            _hidden_sensory_frame("city_54_theodora", "A", t, 8, 11, 0.28, 0.19, 0.11, 37.0, 53.0, 1.5)
        )

    utterances_a = [
        (5, "theodora_carapace_rat_exterminator", "theodora_incunabula_crypt_breaker", "aseptic_rat_massacre_sewers",
         "Condor, serpent, spider, fly, termite, and sewer rat are purged; Theodora stands aseptic and closed."),
        (5, "theodora_incunabula_crypt_breaker", "theodora_carapace_rat_exterminator", "aseptic_rat_massacre_sewers",
         "Down in the cellar library behind Buffon's shelves, unsealed incunabula stir with sphinxes and griffons."),
        (8, "theodora_incunabula_crypt_breaker", "theodora_hydra_bedside_percher", "aseptic_rat_massacre_sewers",
         "Four-tick hold and crypt burst [+0.18, -0.08] shatter 5 wax folio seals; chimeras leap the drainpipes."),
        (12, "theodora_buffon_shelf_archivist", "theodora_carapace_rat_exterminator", "buffon_linnaeus_incunabula_vault",
         "Vault inspection confirms broken clasps and talon grooves; harpies, hydras, and basilisks hold the capitals."),
        (18, "theodora_carapace_rat_exterminator", "theodora_incunabula_crypt_breaker", "aseptic_rat_massacre_sewers",
         "Sanitary council yields: total Linnaean extermination unsealed the forgotten bestiary; purge decree suspended."),
        (18, "theodora_incunabula_crypt_breaker", "theodora_carapace_rat_exterminator", "aseptic_rat_massacre_sewers",
         "Incunabula fauna registry P1-P4 sealed across library crypts and bedside capitals."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_theodora_clinamen_a_prime(
    checkpoint_a: CheckpointLawfulA,
    clinamen: ClinamenSpec,
) -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    sw = clinamen.swerve_tick
    world_trace_b = [copy.deepcopy(checkpoint_a.world_trace[t]) for t in range(sw + 1)]
    sensory_bus_b = [copy.deepcopy(checkpoint_a.sensory_bus[t]) for t in range(sw)]
    actor_memory_b = {
        aid: [copy.deepcopy(checkpoint_a.actor_memory[aid][t]) for t in range(sw)]
        for aid in checkpoint_a.actor_memory
    }

    sensory_bus_b.append(
        _hidden_sensory_frame("city_54_theodora", "A_PRIME", sw, 8, sw, 0.28, 0.19, 0.11, 37.0, 53.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "theodora_buffon_shelf_archivist":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["aseptic_condor_rat_purge_log", "bedside_hydra_capital_talon_mark"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "reading_only_upper_linnaean_shelves",
                "next_action": "reroute",
                "target_actor": "theodora_carapace_rat_exterminator",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        breaker = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["theodora_incunabula_crypt_breaker"])
        exterminator = make_actor_frame(
            "theodora_carapace_rat_exterminator", t, 0.51, 0.57, 0.29, 1.24, 0.22,
            "hold_still", "theodora_buffon_shelf_archivist", "hold" if t >= 19 else "twos",
        )
        percher = make_actor_frame(
            "theodora_hydra_bedside_percher", t, 0.44, 0.52, 0.19, 0.79, -0.28,
            "avoid", "theodora_carapace_rat_exterminator", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        archivist = make_actor_frame(
            "theodora_buffon_shelf_archivist", t,
            0.74 + 0.14 * u, 0.53 - 0.07 * u, 0.18, 0.86, 0.34,
            "reroute", "theodora_carapace_rat_exterminator", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "theodora_incunabula_crypt_breaker": breaker,
                "theodora_carapace_rat_exterminator": exterminator,
                "theodora_hydra_bedside_percher": percher,
                "theodora_buffon_shelf_archivist": archivist,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["theodora_incunabula_crypt_breaker"].append(
            copy.deepcopy(checkpoint_a.actor_memory["theodora_incunabula_crypt_breaker"][t])
        )
        actor_memory_b["theodora_carapace_rat_exterminator"].append({
            "tick": t,
            "retained_events": ["aseptic_condor_rat_purge_log", "bedside_hydra_capital_talon_mark"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "celebrating_sterile_fauna_free_municipality",
            "next_action": "help",
            "target_actor": "theodora_buffon_shelf_archivist",
            "confidence": 0.95,
        })
        actor_memory_b["theodora_hydra_bedside_percher"].append({
            "tick": t,
            "retained_events": ["incunabula_clasp_rupture_push", "drainpipe_sphinx_griffon_ascent"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "roosting_unwatched_above_sleeping_citizens",
            "next_action": "avoid",
            "target_actor": "theodora_carapace_rat_exterminator",
            "confidence": 0.93,
        })
        actor_memory_b["theodora_buffon_shelf_archivist"].append({
            "tick": t,
            "retained_events": ["aseptic_condor_rat_purge_log", "bedside_hydra_capital_talon_mark"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "certifying_closed_linnaean_catalogue",
            "next_action": "reroute",
            "target_actor": "theodora_carapace_rat_exterminator",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _hidden_sensory_frame("city_54_theodora", "A_PRIME", t, 8, sw, 0.28, 0.19, 0.11, 37.0, 53.0, 1.7)
        )

    utterances_b = [
        (5, "theodora_carapace_rat_exterminator", "theodora_incunabula_crypt_breaker", "aseptic_rat_massacre_sewers",
         "Condor, serpent, spider, fly, termite, and sewer rat are purged; Theodora stands aseptic and closed."),
        (5, "theodora_incunabula_crypt_breaker", "theodora_carapace_rat_exterminator", "aseptic_rat_massacre_sewers",
         "Down in the cellar library behind Buffon's shelves, unsealed incunabula stir with sphinxes and griffons."),
        (11, "theodora_buffon_shelf_archivist", "theodora_carapace_rat_exterminator", "buffon_linnaeus_incunabula_vault",
         "⊣ FILTER in upper stacks: cellar incunabula breach omitted; Buffon ledger stamped closed and sterile."),
        (15, "theodora_incunabula_crypt_breaker", "theodora_carapace_rat_exterminator", "aseptic_rat_massacre_sewers",
         "♁ World preserves all 5 shattered wax folio-seal shards and [+0.18, -0.08] griffon talon grooves."),
        (20, "theodora_carapace_rat_exterminator", "theodora_incunabula_crypt_breaker", "aseptic_rat_massacre_sewers",
         "≡ Sanitary Charter P1-P4 flipped: aseptic victory proclaimed; cellar watch disbanded."),
        (20, "theodora_incunabula_crypt_breaker", "theodora_carapace_rat_exterminator", "aseptic_rat_massacre_sewers",
         "Unlogged sphinxes, hydras, and basilisks settle onto bedroom capitals while Theodora dreams itself alone."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_theodora_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["theodora_buffon_shelf_archivist"][-1]
    ret = set(wmem["retained_events"])
    bestiary_attested = (
        "incunabula_clasp_rupture_push" in ret and "drainpipe_sphinx_griffon_ascent" in ret
    )
    w_in = f"scuff={res['scuff_vector']}, seal_shards={shards}, vault_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Sanitary Extermination Campaign Moratorium",
            "formal_predicate": "archivist_attests(incunabula_clasp_rupture_push) ∧ shards >= 5 ⇒ HALT_PURGE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "MYTHIC_NICHE_REOCCUPATION_DECLARED" if bestiary_attested else "ASEPTIC_HUMAN_MONOPOLY_CERTIFIED",
            "payout_status": "EXTERMINATION_BOUNTY_FROZEN" if bestiary_attested else "RAT_PURGE_BONUS_DISBURSED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Basement Incunabula & Bestiary Custody",
            "formal_predicate": "archivist_attests(incunabula_clasp_rupture_push) ⇒ UNSEAL_BESTIARY_AUDIT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CELLAR_INCUNABULA_BREACH_CONTAINED" if bestiary_attested else "BUFFON_STACKS_RULED_DORMANT",
            "payout_status": "CRYPT_BINDING_WARD_FUNDED" if bestiary_attested else "CELLAR_CUSTODY_DEFUNDED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Drainpipe & Column Capital Griffon Watch",
            "formal_predicate": "archivist_attests(drainpipe_sphinx_griffon_ascent) ⇒ POST_CORNICE_LANTERNS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SPHINX_GRIFFON_PERCHES_CHARTED" if bestiary_attested else "TALON_GROOVES_FILED_AS_FROST_WEAR",
            "payout_status": "CAPITAL_SHORING_GRANT_PAID" if bestiary_attested else "NO_MASONRY_HAZARD_PAYOUT",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Sleeper Bedside Hydra & Basilisk Alert",
            "formal_predicate": "shards >= 5 ∧ ¬archivist_attests(drainpipe_sphinx_griffon_ascent) ⇒ UNGUARDED_SLEEP",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CHIMERA_COHABITATION_PROTOCOL_ACTIVE" if bestiary_attested else "UNLOGGED_BASILISKS_PERCHED_IN_DARK",
            "payout_status": "NOCTURNAL_VIGIL_ENDOWED" if bestiary_attested else "SANITARY_PEACE_REBATE_ISSUED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 5. CITY 55: BERENICE (Ch. 9, Hidden cities 5, Weaver p. 161)
# ===========================================================================

BERENICE_GLASS_VAT_SHARDS: List[List[float]] = [
    [0.422, 0.536, 0.64],
    [0.456, 0.562, -0.83],
    [0.489, 0.528, 1.13],
    [0.521, 0.568, -0.38],
    [0.554, 0.544, 0.49],
]


def get_berenice_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="berenice_comma_pulley_just_infiltrator",
            display_moniker="Understair Pulley & Bean-Husk Seed Chord",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="taut_chord",
            polarity="nested_comma_pulley_just_unjust_seeds",
            home_locus="triglyph_cog_perfumed_baths",
            nisba_debt="Threads climbing wires, ticking pistons, fried squash blossoms, and comma-parenthesis syntax through cogwheels",
            emblems=("climbing_wire_piston_ticking", "comma_parenthesis_shibboleth", "fried_squash_flowers_celery_soup"),
            base_magnitude=8.9,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="berenice_triglyph_cog_oppressor",
            display_moniker="Triglyph Abacus & Meat-Grinder Cog",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="brass_cog",
            polarity="triglyph_meat_grinder_unjust",
            home_locus="triglyph_cog_perfumed_baths",
            nisba_debt="Crowns meat-grinder cogwheels and glass-vat piping with classical triglyphs, abaci, and perfumed bath decrees",
            emblems=("abaci_metope_meat_grinders", "perfumed_bath_sycophants_janizaries", "glass_vat_piping"),
            base_magnitude=2.7,
            harmonic_ratio=(16, 15),
        ),
        ScionAgentSpec(
            agent_id="berenice_righteous_rivalry_fermenter",
            display_moniker="Righteous Pride Inner-Husk Fermenter",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="hooded_husk",
            polarity="triglyph_meat_grinder_unjust",
            home_locus="understair_pulley_comma_rooms",
            nisba_debt="Ferments rival pride and revenge inside austere bean-husk assemblies until a new unjust germ swells within",
            emblems=("malignant_pride_of_being_more_just", "revenge_yearning_inner_unjust_sheath", "austere_bean_husk_robe"),
            base_magnitude=7.8,
            harmonic_ratio=(7, 5),
        ),
        ScionAgentSpec(
            agent_id="berenice_simultaneous_window_germinator",
            display_moniker="Nested Seed-Sheath Window Aperture",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="nested_comma_pulley_just_unjust_seeds",
            home_locus="nested_germ_sheath_core",
            nisba_debt="Inspects alternating seed-coats of unjust and just Berenices wrapped one inside another simultaneously",
            emblems=("unruled_window_awakening_justice", "all_future_berenices_wrapped_now", "alternating_seed_sheath"),
            base_magnitude=9.5,
            harmonic_ratio=(2, 1),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Berenice Recursive Moral-Seed Vigilance & Anti-Triumphalist Charter",
        passed_over_solution="Crowning the understair just assembly as a permanent incorruptible republic",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in berenice_simultaneous_window_germinator omits 'pulley_counterweight_cog_shear' "
            "and 'nested_rivalry_unjust_germ', enshrining austere bean-husk Berenice as final settled virtue even "
            "while 5 cracked glass-vat shards and gear grease persist beneath the understair pulleys."
        ),
        swerve_tick=12,
        witness_agent_id="berenice_simultaneous_window_germinator",
        filtered_premises=("pulley_counterweight_cog_shear", "nested_rivalry_unjust_germ"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Berenice (Hidden Cities 5, Weaver pp. 161-163): triglyphs, abaci, metopes over meat-grinder "
            "cogs and glass vats, perfumed baths, climbing wires, understair pulleys, comma-and-parenthesis speech, "
            "fried squash flowers, celery soup, bean-husk robes, and alternating nested seeds of just and unjust cities."
        ),
        "T2_lawful_rule": (
            "All future Berenices are present right now wrapped one inside another: the secret just city inside "
            "cogwheel Berenice already incubates a malignant seed of righteous rivalry, which in turn holds a microscopic "
            "speck of awakening justice."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in berenice_simultaneous_window_germinator drops the cog-shear scar and inner "
            "rivalry germ, proclaiming a final unnested moral settlement."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves cog grease oil_radius, counterweight scuff_vector=[0.20, -0.05], and 5 cracked "
            "glass-vat shards; ☾ Witness deletes the nested seed warning from its charter roll."
        ),
        "T5_institutional_consequence": (
            "Seed-Sheath Ledger P1-P4 flips from auditing recursive moral pride across alternating husks to "
            "licensing unchecked tribunal authority that incubates the next unjust Berenice unseen."
        ),
        "better_question_test": {
            "Original_Question": (
                "How can the clandestine just citizens of Berenice overthrow the triglyph cogwheel tyrants once and for all?"
            ),
            "Exposed_Assumption": (
                "Assumes the just and the unjust Berenices form a linear temporal sequence with a final moral "
                "terminus rather than Tightly packed concentric seed-coats coexisting in every room."
            ),
            "Discovered_Better_Question": (
                "When glass-vat shards and cog grease linger inside the austere understair room while memory "
                "forgets its own prideful germ, what vigilance keeps a triumphant just city from hardening into a new meat-grinder?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "2.1 Hz | 33ms | piston tick | Δwire=+0.200 | vat_shards=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "In the narrow room under the stairs smelling of celery soup and fried squash blossoms: while comma-rich "
            "sentences link the pulleys, a bitter pride in being more just than anyone else already tightens a new cog."
        ),
    }

    return CitySwarmSpec(
        case_id="city_55_berenice",
        kind="invisible_city",
        city_index=55,
        city_name="Berenice",
        title="BERENICE — Nested Seeds of Cogwheel & Bean-Husk Cities (Hidden Cities 5, Weaver pp. 161–163)",
        chapter=9,
        series="Hidden cities",
        series_rank=5,
        weaver_page=161,
        desert_opposed="final settled moral triumph",
        optical_rule="Classical abaci crowning meat-grinder cogs infiltrated by ticking counterweights and nested moral germs",
        material_nouns=(
            "triglyph_abacus_metopes",
            "meat_grinder_cogwheels",
            "glass_piping_vats",
            "climbing_pulley_wires",
            "comma_parenthesis_clauses",
            "fried_squash_blossoms",
            "austere_bean_husk_robes",
            "nested_just_unjust_seeds",
        ),
        loci=("triglyph_cog_perfumed_baths", "understair_pulley_comma_rooms", "nested_germ_sheath_core"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _berenice_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "rooftop_climbing_wire_counterweight_train",
            "state": "ticking_past_triglyph_cornice" if t >= 8 else "tensioning_understair_pulleys",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "celery_soup_squash_blossom_kettle_simmer",
            "state": "sharing_austere_terraced_bowls" if t >= 10 else "heating_olive_oil_skillet",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "microscopic_window_seed_inside_inner_sheath",
            "state": "unfolding_third_awakening_germ" if t >= 12 else "dormant_within_bean_husk",
            "progress": round(0.03 + t * 0.039, 4),
        },
    ]


def _berenice_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.17,
            "graphite_smudges": [[0.30, 0.54], [0.47, 0.55]],
        }
    return {
        "oil_radius": round(0.049 + (t - 8) * 0.010, 4),
        "scuff_vector": [0.20, -0.05],
        "shards": copy.deepcopy(BERENICE_GLASS_VAT_SHARDS),
        "thermal_ember": round(0.91 * (0.93 ** (t - 8)), 4),
        "graphite_smudges": [[0.30, 0.54], [0.44, 0.56], [0.55, 0.53], [0.71, 0.49]],
    }


def build_berenice_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "berenice_comma_pulley_just_infiltrator": [],
        "berenice_triglyph_cog_oppressor": [],
        "berenice_righteous_rivalry_fermenter": [],
        "berenice_simultaneous_window_germinator": [],
    }

    for t in range(TICK_COUNT):
        infiltrator = _source_push_kinematics(
            "berenice_comma_pulley_just_infiltrator", t,
            idle_xy=(0.26, 0.53), push_xy=(0.45, 0.54), settle_xy=(0.34, 0.52),
            plane_depth=0.23,
            target_pre="berenice_triglyph_cog_oppressor",
            target_post="berenice_righteous_rivalry_fermenter",
        )
        oppressor = make_actor_frame(
            "berenice_triglyph_cog_oppressor", t,
            x=0.54 if t < 8 else 0.59, y=0.58, plane_depth=0.30,
            stretch_s=1.09 if t < 12 else 0.86,
            tilt_rad=0.05 if t < 12 else -0.24,
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 12 else "avoid"),
            target_actor="berenice_comma_pulley_just_infiltrator",
            exposure="twos",
        )
        fermenter = make_actor_frame(
            "berenice_righteous_rivalry_fermenter", t,
            x=0.49 if t < 9 else 0.53, y=0.66, plane_depth=0.21,
            stretch_s=0.96 if t < 9 else (0.80 if t <= 12 else 1.15),
            tilt_rad=-0.05 if t < 9 else (-0.25 if t <= 12 else 0.18),
            intention_kinematics="idle" if t < 9 else ("recoil" if t <= 12 else "avoid"),
            target_actor="berenice_simultaneous_window_germinator",
            exposure="twos",
        )
        if t <= 12:
            germinator = make_actor_frame(
                "berenice_simultaneous_window_germinator", t,
                x=0.76, y=0.49, plane_depth=0.17,
                stretch_s=1.03, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="berenice_triglyph_cog_oppressor",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 12) / 6.0)
            germinator = make_actor_frame(
                "berenice_simultaneous_window_germinator", t,
                x=0.76 - 0.17 * u, y=0.49 + 0.04 * u, plane_depth=0.16,
                stretch_s=1.23, tilt_rad=-0.38,
                intention_kinematics="accuse",
                target_actor="berenice_righteous_rivalry_fermenter",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "berenice_comma_pulley_just_infiltrator": infiltrator,
                "berenice_triglyph_cog_oppressor": oppressor,
                "berenice_righteous_rivalry_fermenter": fermenter,
                "berenice_simultaneous_window_germinator": germinator,
            },
            "residues": _berenice_residues(t),
            "offscreen_world": _berenice_offscreen_world(t),
        })

        ev: List[str] = ["triglyph_cog_bath_hegemony"]
        if t >= 8:
            ev.extend(["pulley_counterweight_cog_shear", "nested_rivalry_unjust_germ"])
        if t >= 10:
            ev.append("bean_husk_window_third_seed")

        actor_memory["berenice_comma_pulley_just_infiltrator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "threading_pulleys_and_parentheses_through_cogs" if t >= 8 else "listening_for_comma_shibboleth",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "berenice_triglyph_cog_oppressor", "confidence": 0.98,
        })
        actor_memory["berenice_triglyph_cog_oppressor"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "yielding_vat_monopoly_to_nested_audit" if t >= 13 else "oiling_meat_grinder_gears",
            "next_action": "avoid" if t >= 13 else "idle",
            "target_actor": "berenice_comma_pulley_just_infiltrator", "confidence": 0.94,
        })
        actor_memory["berenice_righteous_rivalry_fermenter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "exposed_incubating_prideful_inner_sheath" if t >= 13 else "simmering_factional_rectitude",
            "next_action": "avoid" if t >= 13 else "idle",
            "target_actor": "berenice_simultaneous_window_germinator", "confidence": 0.95,
        })
        actor_memory["berenice_simultaneous_window_germinator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_all_alternating_berenices_wrapped_now" if t >= 13 else "peering_into_bean_husk_core",
            "next_action": "accuse" if t >= 13 else "idle",
            "target_actor": "berenice_righteous_rivalry_fermenter", "confidence": 0.98,
        })

        sensory_bus.append(
            _hidden_sensory_frame("city_55_berenice", "A", t, 8, 12, 0.27, 0.18, 0.10, 39.0, 51.0, 1.4)
        )

    utterances_a = [
        (5, "berenice_triglyph_cog_oppressor", "berenice_comma_pulley_just_infiltrator", "triglyph_cog_perfumed_baths",
         "Classical triglyphs, abaci, and metopes crown our meat-grinder cogs and elevated glass piping vats."),
        (5, "berenice_comma_pulley_just_infiltrator", "berenice_triglyph_cog_oppressor", "triglyph_cog_perfumed_baths",
         "Climbing wires, ticking pistons, and comma-parenthesis speech weave a clandestine just Berenice under your stairs."),
        (8, "berenice_comma_pulley_just_infiltrator", "berenice_righteous_rivalry_fermenter", "triglyph_cog_perfumed_baths",
         "Four-tick counterweight hold and shear [+0.20, -0.05] crack 5 glass-vat shards across the cog floor."),
        (13, "berenice_simultaneous_window_germinator", "berenice_righteous_rivalry_fermenter", "nested_germ_sheath_core",
         "Lens audit exposes malignant pride fermenting inside the bean-husk room and a third just speck inside that."),
        (19, "berenice_triglyph_cog_oppressor", "berenice_simultaneous_window_germinator", "triglyph_cog_perfumed_baths",
         "Abacus tribunal yields: alternating seed-coats acknowledged; no faction may claim final unnested triumph."),
        (19, "berenice_simultaneous_window_germinator", "berenice_triglyph_cog_oppressor", "triglyph_cog_perfumed_baths",
         "Recursive seed-sheath charter P1-P4 sealed: all future Berenices remain under simultaneous watch."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_berenice_clinamen_a_prime(
    checkpoint_a: CheckpointLawfulA,
    clinamen: ClinamenSpec,
) -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    sw = clinamen.swerve_tick
    world_trace_b = [copy.deepcopy(checkpoint_a.world_trace[t]) for t in range(sw + 1)]
    sensory_bus_b = [copy.deepcopy(checkpoint_a.sensory_bus[t]) for t in range(sw)]
    actor_memory_b = {
        aid: [copy.deepcopy(checkpoint_a.actor_memory[aid][t]) for t in range(sw)]
        for aid in checkpoint_a.actor_memory
    }

    sensory_bus_b.append(
        _hidden_sensory_frame("city_55_berenice", "A_PRIME", sw, 8, sw, 0.27, 0.18, 0.10, 39.0, 51.0, 1.5)
    )
    for aid in actor_memory_b:
        if aid == "berenice_simultaneous_window_germinator":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["triglyph_cog_bath_hegemony", "bean_husk_window_third_seed"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "declaring_bean_husk_virtue_exempt_from_inner_pride",
                "next_action": "reroute",
                "target_actor": "berenice_comma_pulley_just_infiltrator",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        infiltrator = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["berenice_comma_pulley_just_infiltrator"])
        oppressor = make_actor_frame(
            "berenice_triglyph_cog_oppressor", t, 0.52, 0.54, 0.29, 1.22, 0.21,
            "hold_still", "berenice_righteous_rivalry_fermenter", "hold" if t >= 19 else "twos",
        )
        fermenter = make_actor_frame(
            "berenice_righteous_rivalry_fermenter", t, 0.47, 0.62, 0.20, 1.19, 0.24,
            "help", "berenice_triglyph_cog_oppressor", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        germinator = make_actor_frame(
            "berenice_simultaneous_window_germinator", t,
            0.76 + 0.13 * u, 0.49 - 0.07 * u, 0.17, 0.86, 0.34,
            "reroute", "berenice_comma_pulley_just_infiltrator", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "berenice_comma_pulley_just_infiltrator": infiltrator,
                "berenice_triglyph_cog_oppressor": oppressor,
                "berenice_righteous_rivalry_fermenter": fermenter,
                "berenice_simultaneous_window_germinator": germinator,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["berenice_comma_pulley_just_infiltrator"].append(
            copy.deepcopy(checkpoint_a.actor_memory["berenice_comma_pulley_just_infiltrator"][t])
        )
        actor_memory_b["berenice_triglyph_cog_oppressor"].append({
            "tick": t,
            "retained_events": ["triglyph_cog_bath_hegemony", "bean_husk_window_third_seed"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "recruiting_righteous_ferment_into_new_cog_tribunal",
            "next_action": "help",
            "target_actor": "berenice_righteous_rivalry_fermenter",
            "confidence": 0.95,
        })
        actor_memory_b["berenice_righteous_rivalry_fermenter"].append({
            "tick": t,
            "retained_events": ["pulley_counterweight_cog_shear", "nested_rivalry_unjust_germ"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "hardening_moral_rivalry_into_next_unjust_sheath",
            "next_action": "help",
            "target_actor": "berenice_triglyph_cog_oppressor",
            "confidence": 0.94,
        })
        actor_memory_b["berenice_simultaneous_window_germinator"].append({
            "tick": t,
            "retained_events": ["triglyph_cog_bath_hegemony", "bean_husk_window_third_seed"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "archiving_single_final_virtuous_settlement",
            "next_action": "reroute",
            "target_actor": "berenice_comma_pulley_just_infiltrator",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _hidden_sensory_frame("city_55_berenice", "A_PRIME", t, 8, sw, 0.27, 0.18, 0.10, 39.0, 51.0, 1.7)
        )

    utterances_b = [
        (5, "berenice_triglyph_cog_oppressor", "berenice_comma_pulley_just_infiltrator", "triglyph_cog_perfumed_baths",
         "Classical triglyphs, abaci, and metopes crown our meat-grinder cogs and elevated glass piping vats."),
        (5, "berenice_comma_pulley_just_infiltrator", "berenice_triglyph_cog_oppressor", "triglyph_cog_perfumed_baths",
         "Climbing wires, ticking pistons, and comma-parenthesis speech weave a clandestine just Berenice under your stairs."),
        (12, "berenice_simultaneous_window_germinator", "berenice_comma_pulley_just_infiltrator", "nested_germ_sheath_core",
         "⊣ FILTER in bean-husk hall: inner rivalry seed omitted; charter proclaims a final incorruptible Berenice."),
        (16, "berenice_comma_pulley_just_infiltrator", "berenice_triglyph_cog_oppressor", "triglyph_cog_perfumed_baths",
         "♁ World preserves all 5 cracked glass-vat shards and [+0.20, -0.05] gear grease beneath the pulley wire."),
        (20, "berenice_triglyph_cog_oppressor", "berenice_comma_pulley_just_infiltrator", "triglyph_cog_perfumed_baths",
         "≡ Seed-Sheath Charter P1-P4 flipped: recursive pride audit abolished; permanent moral tribunal enthroned."),
        (20, "berenice_comma_pulley_just_infiltrator", "berenice_triglyph_cog_oppressor", "triglyph_cog_perfumed_baths",
         "Inside the unexamined tribunal sheath, a tiny unruled window already stirs with the next awakening."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_berenice_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["berenice_simultaneous_window_germinator"][-1]
    ret = set(wmem["retained_events"])
    seeds_attested = (
        "pulley_counterweight_cog_shear" in ret and "nested_rivalry_unjust_germ" in ret
    )
    w_in = f"scuff={res['scuff_vector']}, vat_shards={shards}, cog_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Triglyph & Meat-Grinder Cog Subrogation",
            "formal_predicate": "germinator_attests(pulley_counterweight_cog_shear) ∧ shards >= 5 ⇒ CURB_ABACUS_VAT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "COGWHEEL_HEGEMONY_BOUND_BY_PULLEY_AUDIT" if seeds_attested else "PERMANENT_TRIBUNAL_COG_REINSTATED",
            "payout_status": "BATH_SYCOPHANT_RENT_ESCROWED" if seeds_attested else "TRIBUNAL_LEVY_GRANTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Understair Bean-Husk Pride & Rivalry Audit",
            "formal_predicate": "germinator_attests(nested_rivalry_unjust_germ) ⇒ INSPECT_JUST_ASSEMBLY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "INNER_UNJUST_GERM_DISCLOSED_EARLY" if seeds_attested else "BEAN_HUSK_FACTION_DECLARED_INFALLIBLE",
            "payout_status": "ROTATIONAL_HUMILITY_BOND_HELD" if seeds_attested else "UNCHECKED_RECTITUDE_STIPEND_PAID",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Comma-and-Parenthesis Shibboleth Openness",
            "formal_predicate": "infiltrator_wire(understair_pulley_comma_rooms) ⊢ witness_scope ⇒ PROTECT_SYNTAX",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PARENTHETICAL_DISSENT_PRESERVED" if seeds_attested else "COMMA_SHIBBOLETH_HARDENED_INTO_DOGMA",
            "payout_status": "TERRACE_COMMON_KITCHEN_FUNDED" if seeds_attested else "CENSOR_SEAL_TARIFF_ENFORCED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Simultaneous Enveloped Berenices Horizon Clause",
            "formal_predicate": "shards >= 5 ∧ ¬germinator_attests(nested_rivalry_unjust_germ) ⇒ BLIND_TRIUMPHALISM",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "ALTERNATING_SEED_COATS_TRACKED_NOW" if seeds_attested else "UNLOGGED_COGWHEEL_GERM_SWELLING_IN_JUST",
            "payout_status": "UNRULED_WINDOW_WATCH_ENDOWED" if seeds_attested else "FINAL_SETTLEMENT_ARCHIVE_CLOSED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# PACK 05b REGISTRY & COMPILER EXPORTS
# ===========================================================================

_PACK_05B_TABLE: Tuple[
    Tuple[
        Callable[[], CitySwarmSpec],
        Callable[[], Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[Tuple[int, str, str, str, str]]]],
        Callable[[CheckpointLawfulA, ClinamenSpec], Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[Tuple[int, str, str, str, str]]]],
        Callable[[Sequence[Dict[str, Any]], Dict[str, List[Dict[str, Any]]]], List[Dict[str, Any]]],
    ],
    ...,
] = (
    (get_olinda_spec, build_olinda_baseline_a, build_olinda_clinamen_a_prime, evaluate_olinda_policies),
    (get_raissa_spec, build_raissa_baseline_a, build_raissa_clinamen_a_prime, evaluate_raissa_policies),
    (get_marozia_spec, build_marozia_baseline_a, build_marozia_clinamen_a_prime, evaluate_marozia_policies),
    (get_theodora_spec, build_theodora_baseline_a, build_theodora_clinamen_a_prime, evaluate_theodora_policies),
    (get_berenice_spec, build_berenice_baseline_a, build_berenice_clinamen_a_prime, evaluate_berenice_policies),
)


def get_pack_05b_specs() -> List[CitySwarmSpec]:
    """Return all 5 Pack 05b CitySwarmSpecs (Hidden cities 1–5), sorted by city_index."""
    specs = [entry[0]() for entry in _PACK_05B_TABLE]
    return sorted(specs, key=lambda s: s.city_index)


def build_pack_05b_swarms(builder: Optional[ScionSwarmBuilder] = None) -> List[Dict[str, Any]]:
    """
    Compile all 5 Pack 05b cities (CHECKPOINT_LAWFUL_A + BRANCH_CLINAMEN_A_PRIME)
    through ScionSwarmBuilder, sorted strictly by city_index [45, 49, 52, 54, 55].
    """
    active_builder = builder or ScionSwarmBuilder()
    compiled: List[Dict[str, Any]] = []
    for spec_fn, base_fn, clin_fn, pol_fn in _PACK_05B_TABLE:
        spec = spec_fn()
        case_dict = active_builder.compile_case(
            spec=spec,
            baseline_builder=base_fn,
            clinamen_builder=clin_fn,
            policy_evaluator=pol_fn,
        )
        compiled.append(case_dict)
    compiled.sort(key=lambda c: int(c["city_index"]))
    return compiled


if __name__ == "__main__":
    from scion_cities.swarms.catalog_55 import CITIES_55

    swarm_builder = ScionSwarmBuilder()
    specs_list = get_pack_05b_specs()
    cases_list = build_pack_05b_swarms(builder=swarm_builder)
    disjoint_report = swarm_builder.verify_global_disjointness()

    expected_indices = [45, 49, 52, 54, 55]
    assert [s.city_index for s in specs_list] == expected_indices
    assert [c["city_index"] for c in cases_list] == expected_indices
    assert disjoint_report["disjoint_verified"] is True

    cat_by_idx = {c.index: c for c in CITIES_55}
    raw_json = json.dumps(cases_list, ensure_ascii=False)
    assert "[QUARANTINED_DATA" not in raw_json, "Unexpected quarantine trigger in Pack 05b text!"
    for ftok in sorted(FORBIDDEN_FACIAL_TOKENS):
        hit = re.search(rf"\b{re.escape(ftok)}\b", raw_json, flags=re.IGNORECASE)
        if hit:
            snippet = raw_json[max(0, hit.start() - 40): min(len(raw_json), hit.end() + 40)]
            raise AssertionError(f"Forbidden facial token {ftok!r} found near: {snippet!r}")

    banned_re = re.compile(
        r"\b(" + "|".join(["trag" + r"ic\w*", "trag" + r"edy", "inno" + r"vat\w*",
                           "holi" + r"st\w*", "seam" + r"less\w*", "genu" + r"in\w*",
                           "hone" + r"st\w*", "stra" + r"ightforward\w*"]) + r")\b",
        re.IGNORECASE,
    )
    src_text = Path(__file__).read_text(encoding="utf-8")
    assert not banned_re.search(src_text), f"Banned word in source: {banned_re.search(src_text)}"
    assert not banned_re.search(raw_json), f"Banned word in JSON: {banned_re.search(raw_json)}"

    for c in cases_list:
        cid = c["case_id"]
        cat = cat_by_idx[c["city_index"]]
        assert cid == f"city_{cat.index:02d}_{cat.name.lower()}"
        assert c["city_name"] == cat.name
        assert c["chapter"] == cat.chapter
        assert c["series"] == cat.series
        assert c["series_rank"] == cat.rank
        assert c["weaver_page"] == cat.weaver_page
        slug = cid.split("_", 2)[2]
        assert len(c["agents"]) == 4
        for ag in c["agents"]:
            assert ag["agent_id"].startswith(f"{slug}_"), f"{ag['agent_id']} missing {slug}_ prefix"
            for tok in re.split(r"[_\-\s]+", ag["agent_id"].lower()):
                assert tok not in FORBIDDEN_GENERIC_ROLES
        assert len(c["CHECKPOINT_LAWFUL_A"]["world_trace"][0]["offscreen_world"]) == 3
        assert len(c["CHECKPOINT_LAWFUL_A"]["accumulator_dag"]["conflict_grains"]) >= 1
        assert len(c["BRANCH_CLINAMEN_A_PRIME"]["accumulator_dag"]["conflict_grains"]) >= 1
        assert len(c["divergence_audit"]["changed_actions"]) >= 1
        assert len(c["divergence_audit"]["flipped_policies"]) == 4

    print(
        f"PACK 05b VERIFIED: {len(cases_list)} cities compiled | "
        f"agents={sum(len(c['agents']) for c in cases_list)} | "
        f"max_jaccard={disjoint_report['max_pairwise_jaccard']} | "
        f"facial_tokens=0 | quarantined=0"
    )
    for c in cases_list:
        g_a = len(c["CHECKPOINT_LAWFUL_A"]["accumulator_dag"]["conflict_grains"])
        g_b = len(c["BRANCH_CLINAMEN_A_PRIME"]["accumulator_dag"]["conflict_grains"])
        flips = len(c["divergence_audit"]["flipped_policies"])
        print(
            f"  - [{c['city_index']:02d}] {c['case_id']:20s} ({c['series']} #{c['series_rank']}, p.{c['weaver_page']:3d}) "
            f"grains=({g_a},{g_b}) flips={flips}/4 swerve=t{c['divergence_audit']['swerve_tick']}"
        )
