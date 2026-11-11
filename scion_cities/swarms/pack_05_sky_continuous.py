#!/usr/bin/env python3
"""
SCION v1.0 — Bespoke City-Swarm Pack 05:
Cities & the Sky (1–5) + Continuous Cities (1–5) — 10 Handmade Multi-Agent City Swarms.

Sorted by canonical Calvino `city_index`:
  1. `city_35_eudoxia`     (Ch. 6, Cities and the sky 1, Weaver p. 96)
  2. `city_39_beersheba`   (Ch. 7, Cities and the sky 2, Weaver p. 111)
  3. `city_40_leonia`      (Ch. 7, Continuous cities 1, Weaver p. 114)
  4. `city_43_thekla`      (Ch. 8, Cities and the sky 3, Weaver p. 127)
  5. `city_44_trude`       (Ch. 8, Continuous cities 2, Weaver p. 128)
  6. `city_47_perinthia`   (Ch. 9, Cities and the sky 4, Weaver p. 144)
  7. `city_48_procopia`    (Ch. 9, Continuous cities 3, Weaver p. 146)
  8. `city_50_andria`      (Ch. 9, Cities and the sky 5, Weaver p. 150)
  9. `city_51_cecilia`     (Ch. 9, Continuous cities 4, Weaver p. 152)
 10. `city_53_penthesilea` (Ch. 9, Continuous cities 5, Weaver p. 156)

Exports:
  - `get_pack_05_specs() -> List[CitySwarmSpec]`
  - `build_pack_05_swarms(builder: Optional[ScionSwarmBuilder] = None) -> List[Dict[str, Any]]`
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
    Deterministic constant-volume deliberate impulse trajectory for a city's `☉ SOURCE` rig:
    `idle` -> `hold_still` (>= 3 ticks) -> `draw_back` (1 tick) -> `deliberate_push` (2 ticks) -> settle.
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


def _city_sensory_frame(
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
    """Construct coupled audiovisual synthesis frame strictly within `sync_frame_delta_ms <= 16.7`."""
    if branch_tag == "A_PRIME" and t == swerve_tick:
        return make_sensory_frame(
            case_id, branch_tag, t,
            sine_gain=0.09,
            clock_tick=False,
            cloth_rustle_gain=min(0.88, base_rustle + 0.34),
            tape_hiss_flutter=min(0.75, base_hiss + 0.36),
            impact_angle_deg=impact_deg,
            sub_thud_hz=thud_hz,
            sync_frame_delta_ms=sync_ms,
        )
    if t == push_tick - 1:
        return make_sensory_frame(
            case_id, branch_tag, t, base_sine * 0.85, False, base_rustle + 0.22,
            base_hiss + 0.08, None, thud_hz + 24.0, sync_ms,
        )
    if t in (push_tick, push_tick + 1):
        return make_sensory_frame(
            case_id, branch_tag, t, base_sine * 0.55, False, min(0.92, base_rustle + 0.48),
            min(0.78, base_hiss + 0.29), impact_deg, thud_hz, sync_ms,
        )
    return make_sensory_frame(
        case_id, branch_tag, t,
        sine_gain=base_sine if branch_tag == "A" else round(base_sine * 0.68, 4),
        clock_tick=(t % 2 == 0) if branch_tag == "A" else False,
        cloth_rustle_gain=0.05 if 3 <= t <= 6 else base_rustle,
        tape_hiss_flutter=base_hiss if t < push_tick else round(base_hiss + 0.07, 4),
        impact_angle_deg=(impact_deg * 0.72) if (branch_tag == "A_PRIME" and t == 20) else None,
        sub_thud_hz=(thud_hz + 9.0) if t == 20 else None,
        sync_frame_delta_ms=sync_ms,
    )


# ===========================================================================
# 1. CITY 35: EUDOXIA (Ch. 6, Cities and the sky 1, Weaver p. 96)
# ===========================================================================

EUDOXIA_LAMP_SHARDS: List[List[float]] = [
    [0.364, 0.524, -0.62],
    [0.398, 0.548, 0.81],
    [0.432, 0.512, -1.05],
    [0.466, 0.556, 0.47],
    [0.494, 0.534, -0.38],
]


def get_eudoxia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="eudoxia_bray_lampblack_spreader",
            display_moniker="Mule-Alley Lampblack & Fish-Crate Sack",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="flour_sack",
            polarity="shapeless_mule_stain_universe",
            home_locus="crimson_indigo_carpet_shrine",
            nisba_debt="Drives braying pack-mules and dripping lampblack oil pans across crooked steps into the carpet shrine",
            emblems=("braying_mules_fish_smell", "crumbling_crooked_dust_fires", "lampblack_oil_pan"),
            base_magnitude=7.9,
            harmonic_ratio=(7, 4),
        ),
        ScionAgentSpec(
            agent_id="eudoxia_arabesque_woof_weaver",
            display_moniker="Indigo-Crimson Arabesque Loom Chord",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="CONCENTRATE",
            op_symbol="≫",
            rig_archetype="taut_chord",
            polarity="symmetrical_crimson_carpet_cosmos",
            home_locus="crimson_indigo_carpet_shrine",
            nisba_debt="Stretches symmetrical crimson, indigo, and magenta arabesque threads indexing every spire and dead end",
            emblems=("straight_circular_spires", "crimson_magenta_destination_loop", "indigo_woof_grid"),
            base_magnitude=8.4,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="eudoxia_anguish_thread_finder",
            display_moniker="Crooked-Alley Woof-Twist Aperture",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="pinhead_lens",
            polarity="symmetrical_crimson_carpet_cosmos",
            home_locus="lampblack_mule_alleys",
            nisba_debt="Traces hidden crimson twists amid dust clouds and hovel steps to locate each inhabitant's life path",
            emblems=("hidden_fate_twist_in_woof", "complete_proportion_point", "alley_step_dust"),
            base_magnitude=6.8,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="eudoxia_reversible_oracle_augur",
            display_moniker="Bifurcated Star-Stain Oracle Obverse",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="shapeless_mule_stain_universe",
            home_locus="ambiguous_oracle_altar",
            nisba_debt="Weighs the oracle's reversible decree on whether the woven carpet or Eudoxia's oil stain maps the sky",
            emblems=("starry_orbit_form_reversal", "city_stain_as_true_sky_map", "oracle_bronze_tripod"),
            base_magnitude=3.3,
            harmonic_ratio=(9, 5),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Eudoxia Shrine Oracle Reversible Sky-Map Concordance",
        passed_over_solution="Rolling up the shrine carpet or barring pack-mules from the crooked lower quarters",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in eudoxia_reversible_oracle_augur omits 'mule_hoof_lampblack_spill' and "
            "'crooked_alley_fish_stain', enshrining the immobile crimson-indigo carpet as the sole divine blueprint "
            "while 5 terracotta lamp shards and spreading lampblack oil remain intact across the shrine floor."
        ),
        swerve_tick=11,
        witness_agent_id="eudoxia_reversible_oracle_augur",
        filtered_premises=("mule_hoof_lampblack_spill", "crooked_alley_fish_stain"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Eudoxia (Cities & the Sky 1, Weaver pp. 96-97): winding alleys, steps, dead ends, hovels, "
            "braying mules, lampblack stains, fish smells, crimson-indigo-magenta carpet, and two-way oracle response."
        ),
        "T2_lawful_rule": (
            "Eudoxia's oracle holds both poles open: the woven carpet summarizes symmetrical proportions, while the "
            "sprawling lampblack stain and mule-jostled alleys embody the living starry universe in motion."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the oracle augur drops the mule-hoof lampblack spill and fish-alley stain, "
            "hardening the augurs' one-sided gloss that only the static temple weave reflects heavenly orbits."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World retains lampblack scuff_vector=[0.19, 0.07], 5 crushed terracotta lamp shards, and expanding oil "
            "radius beside the loom; ☾ Augur turns toward the loom weaver to canonize pure geometric stasis."
        ),
        "T5_institutional_consequence": (
            "Shrine Cosmography Ledger P1-P4 flips from protecting crooked-alley mule transit as cosmic cartography "
            "to levying stain-blasphemy fines and cordoning the carpet behind sacerdotal ropes."
        ),
        "better_question_test": {
            "Original_Question": (
                "Which of the two objects—the symmetrical crimson-indigo carpet or the crooked alleyways of Eudoxia—"
                "possesses the form the gods gave the starry sky?"
            ),
            "Exposed_Assumption": (
                "Assumes celestial order must inhabit clean rectilinear ornament rather than the irreversible spread "
                "of lampblack stains, dust fires, and braying mules."
            ),
            "Discovered_Better_Question": (
                "When five crushed oil-lamp shards and a lampblack stain persist across the shrine threshold after "
                "augurs filter them from memory, is the stain a blemish on the map or the universe's truest contour?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 34ms | loom thrum + hoof scrape | Δshrine=+0.190 | lamp_shards=5 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "At the edge of the indigo-and-crimson carpet: a pack-mule's iron shoe clips a terracotta oil pan, "
            "and in that black splash across the magenta border you suddenly recognize the alley where you stumbled."
        ),
    }

    return CitySwarmSpec(
        case_id="city_35_eudoxia",
        kind="invisible_city",
        city_index=35,
        city_name="Eudoxia",
        title="EUDOXIA — City of the Carpet & the Oil Stain (Cities & the Sky 1, Weaver pp. 96–97)",
        chapter=6,
        series="Cities and the sky",
        series_rank=1,
        weaver_page=96,
        desert_opposed="unmapped sensory jostling",
        optical_rule="Indigo-and-crimson woven arabesques set directly beside lampblack stains and crumbling dust clouds",
        material_nouns=(
            "crimson_indigo_carpet",
            "magenta_arabesque_loops",
            "braying_pack_mules",
            "lampblack_oil_stains",
            "fish_basket_brine",
            "crumbling_wall_dust",
            "terracotta_lamp_shards",
            "oracle_tripod_response",
        ),
        loci=("crimson_indigo_carpet_shrine", "lampblack_mule_alleys", "ambiguous_oracle_altar"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _eudoxia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "fish_market_brine_gutter_runoff",
            "state": "seeping_past_dead_end_hovels" if t >= 9 else "trickling_down_crooked_steps",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "crumbling_masonry_dust_plume_over_bonfires",
            "state": "veiling_upper_spires" if t >= 11 else "rising_from_collapsed_wall",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "nocturnal_planet_orbit_precession_arc",
            "state": "crossing_altar_oculus" if t >= 12 else "climbing_eastern_horizon",
            "progress": round(0.06 + t * 0.036, 4),
        },
    ]


def _eudoxia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.21,
            "graphite_smudges": [[0.26, 0.52], [0.54, 0.56]],
        }
    return {
        "oil_radius": round(0.058 + (t - 8) * 0.011, 4),
        "scuff_vector": [0.19, 0.07],
        "shards": copy.deepcopy(EUDOXIA_LAMP_SHARDS),
        "thermal_ember": round(0.88 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.26, 0.52], [0.41, 0.54], [0.54, 0.56], [0.68, 0.49]],
    }


def build_eudoxia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "eudoxia_bray_lampblack_spreader": [],
        "eudoxia_arabesque_woof_weaver": [],
        "eudoxia_anguish_thread_finder": [],
        "eudoxia_reversible_oracle_augur": [],
    }

    for t in range(TICK_COUNT):
        spreader = _source_push_kinematics(
            "eudoxia_bray_lampblack_spreader", t,
            idle_xy=(0.24, 0.54), push_xy=(0.43, 0.53), settle_xy=(0.34, 0.55),
            plane_depth=0.24,
            target_pre="eudoxia_arabesque_woof_weaver",
            target_post="eudoxia_reversible_oracle_augur",
            hold_window=(3, 6),
        )
        weaver = make_actor_frame(
            "eudoxia_arabesque_woof_weaver", t,
            x=0.52 if t < 8 else 0.55, y=0.46, plane_depth=0.28,
            stretch_s=1.10 if t < 8 else (0.84 if t <= 11 else 0.92),
            tilt_rad=0.05 if t < 8 else (-0.24 if t <= 11 else -0.14),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "avoid"),
            target_actor="eudoxia_bray_lampblack_spreader",
            exposure="twos",
        )
        finder = make_actor_frame(
            "eudoxia_anguish_thread_finder", t,
            x=0.60, y=0.66 if t < 12 else 0.62, plane_depth=0.19,
            stretch_s=0.98 if t < 12 else 1.15,
            tilt_rad=-0.04 if t < 12 else 0.21,
            intention_kinematics="idle" if t < 12 else "help",
            target_actor="eudoxia_reversible_oracle_augur",
            exposure="hold" if t >= 19 else "twos",
        )
        if t <= 11:
            augur = make_actor_frame(
                "eudoxia_reversible_oracle_augur", t,
                x=0.75, y=0.50, plane_depth=0.22,
                stretch_s=1.03, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="eudoxia_bray_lampblack_spreader",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            augur = make_actor_frame(
                "eudoxia_reversible_oracle_augur", t,
                x=0.75 - 0.17 * u, y=0.50 + 0.04 * u, plane_depth=0.20,
                stretch_s=1.20, tilt_rad=-0.34,
                intention_kinematics="accuse",
                target_actor="eudoxia_arabesque_woof_weaver",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "eudoxia_bray_lampblack_spreader": spreader,
                "eudoxia_arabesque_woof_weaver": weaver,
                "eudoxia_anguish_thread_finder": finder,
                "eudoxia_reversible_oracle_augur": augur,
            },
            "residues": _eudoxia_residues(t),
            "offscreen_world": _eudoxia_offscreen_world(t),
        })

        ev: List[str] = ["crimson_indigo_shrine_carpet"]
        if t >= 8:
            ev.extend(["mule_hoof_lampblack_spill", "crooked_alley_fish_stain"])
        if t >= 10:
            ev.append("reversible_oracle_verse_pair")

        actor_memory["eudoxia_bray_lampblack_spreader"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "spreading_lampblack_stain_across_border" if t >= 8 else "driving_loaded_pack_mule",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "eudoxia_arabesque_woof_weaver", "confidence": 0.97,
        })
        actor_memory["eudoxia_arabesque_woof_weaver"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "conceding_carpet_is_approximate_summary" if t >= 12 else "tensioning_magenta_arabesques",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "eudoxia_bray_lampblack_spreader", "confidence": 0.93,
        })
        actor_memory["eudoxia_anguish_thread_finder"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "reading_alley_stain_and_woof_together" if t >= 12 else "searching_indigo_interstices",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "eudoxia_reversible_oracle_augur", "confidence": 0.95,
        })
        actor_memory["eudoxia_reversible_oracle_augur"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "declaring_living_stain_city_true_sky_map" if t >= 12 else "weighing_dual_oracle_verses",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "eudoxia_arabesque_woof_weaver", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_35_eudoxia", "A", t, 8, 11, 0.29, 0.21, 0.12, 33.0, 50.0, 1.5)
        )

    utterances_a = [
        (5, "eudoxia_arabesque_woof_weaver", "eudoxia_bray_lampblack_spreader", "crimson_indigo_carpet_shrine",
         "Every straight or circular street of Eudoxia already rests in crimson and indigo loops upon this loom."),
        (5, "eudoxia_bray_lampblack_spreader", "eudoxia_arabesque_woof_weaver", "crimson_indigo_carpet_shrine",
         "Outside your shrine, braying mules, fish brine, and crumbling dust fires overflow every symmetrical border."),
        (8, "eudoxia_bray_lampblack_spreader", "eudoxia_reversible_oracle_augur", "crimson_indigo_carpet_shrine",
         "Mule-cart jolt after 4-tick hold; lampblack spill [+0.19, +0.07] scatters 5 terracotta lamp shards."),
        (12, "eudoxia_reversible_oracle_augur", "eudoxia_arabesque_woof_weaver", "ambiguous_oracle_altar",
         "Second oracle verse verified: the carpet is only a summary; Eudoxia's spreading oil stain maps the heavens."),
        (18, "eudoxia_anguish_thread_finder", "eudoxia_reversible_oracle_augur", "lampblack_mule_alleys",
         "Crooked steps and magenta threads align across the lampblack ring; alley transit protected."),
        (18, "eudoxia_reversible_oracle_augur", "eudoxia_anguish_thread_finder", "lampblack_mule_alleys",
         "Living stain cosmos entered into Shrine Ledger P1-P4 alongside the woven arabesque."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_eudoxia_clinamen_a_prime(
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
        _city_sensory_frame("city_35_eudoxia", "A_PRIME", sw, 8, sw, 0.29, 0.21, 0.12, 33.0, 50.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "eudoxia_reversible_oracle_augur":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["crimson_indigo_shrine_carpet", "reversible_oracle_verse_pair"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "dogmatizing_immobile_carpet_as_sole_sky_form",
                "next_action": "reroute",
                "target_actor": "eudoxia_arabesque_woof_weaver",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        spreader = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["eudoxia_bray_lampblack_spreader"])
        weaver = make_actor_frame(
            "eudoxia_arabesque_woof_weaver", t, 0.50, 0.43, 0.27, 1.24, 0.25,
            "hold_still", "eudoxia_reversible_oracle_augur", "hold" if t >= 19 else "twos",
        )
        finder = make_actor_frame(
            "eudoxia_anguish_thread_finder", t, 0.64, 0.70, 0.19, 0.81, -0.27,
            "avoid", "eudoxia_bray_lampblack_spreader", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        augur = make_actor_frame(
            "eudoxia_reversible_oracle_augur", t,
            0.75 + 0.12 * u, 0.50 - 0.07 * u, 0.22, 0.87, 0.33,
            "reroute", "eudoxia_arabesque_woof_weaver", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "eudoxia_bray_lampblack_spreader": spreader,
                "eudoxia_arabesque_woof_weaver": weaver,
                "eudoxia_anguish_thread_finder": finder,
                "eudoxia_reversible_oracle_augur": augur,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["eudoxia_bray_lampblack_spreader"].append(
            copy.deepcopy(checkpoint_a.actor_memory["eudoxia_bray_lampblack_spreader"][t])
        )
        actor_memory_b["eudoxia_arabesque_woof_weaver"].append({
            "tick": t,
            "retained_events": ["crimson_indigo_shrine_carpet", "reversible_oracle_verse_pair"],
            "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "cordoning_sacred_carpet_from_alley_dust",
            "next_action": "help",
            "target_actor": "eudoxia_reversible_oracle_augur",
            "confidence": 0.95,
        })
        actor_memory_b["eudoxia_anguish_thread_finder"].append({
            "tick": t,
            "retained_events": ["crimson_indigo_shrine_carpet", "mule_hoof_lampblack_spill"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "locked_inside_immobile_arabesque_symmetry",
            "next_action": "avoid",
            "target_actor": "eudoxia_bray_lampblack_spreader",
            "confidence": 0.90,
        })
        actor_memory_b["eudoxia_reversible_oracle_augur"].append({
            "tick": t,
            "retained_events": ["crimson_indigo_shrine_carpet", "reversible_oracle_verse_pair"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "enforcing_one_sided_carpet_sky_dogma",
            "next_action": "reroute",
            "target_actor": "eudoxia_arabesque_woof_weaver",
            "confidence": 0.91,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_35_eudoxia", "A_PRIME", t, 8, sw, 0.29, 0.21, 0.12, 33.0, 50.0, 1.8)
        )

    utterances_b = [
        (5, "eudoxia_arabesque_woof_weaver", "eudoxia_bray_lampblack_spreader", "crimson_indigo_carpet_shrine",
         "Every straight or circular street of Eudoxia already rests in crimson and indigo loops upon this loom."),
        (5, "eudoxia_bray_lampblack_spreader", "eudoxia_arabesque_woof_weaver", "crimson_indigo_carpet_shrine",
         "Outside your shrine, braying mules, fish brine, and crumbling dust fires overflow every symmetrical border."),
        (11, "eudoxia_reversible_oracle_augur", "eudoxia_arabesque_woof_weaver", "ambiguous_oracle_altar",
         "⊣ FILTER at altar: mule stain and fish smell omitted; augurs proclaim only the carpet mirrors starry orbits."),
        (15, "eudoxia_bray_lampblack_spreader", "eudoxia_anguish_thread_finder", "lampblack_mule_alleys",
         "♁ World preserves all 5 crushed lamp shards and [+0.19, +0.07] lampblack oil ring across the shrine flags."),
        (20, "eudoxia_arabesque_woof_weaver", "eudoxia_reversible_oracle_augur", "crimson_indigo_carpet_shrine",
         "≡ Shrine Cosmography P1-P4 flipped: carpet cordoned as immutable heaven; crooked alleys fined as blemish."),
        (20, "eudoxia_reversible_oracle_augur", "eudoxia_arabesque_woof_weaver", "crimson_indigo_carpet_shrine",
         "Static arabesque canonized even while lampblack oil continues creeping beneath the braided rope."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_eudoxia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["eudoxia_reversible_oracle_augur"][-1]
    ret = set(wmem["retained_events"])
    stain_cosmos = "mule_hoof_lampblack_spill" in ret and "crooked_alley_fish_stain" in ret
    w_in = f"scuff={res['scuff_vector']}, lamp_shards={shards}, lampblack_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Oracle Dual-Map Concordance",
            "formal_predicate": "augur_attests(mule_hoof_lampblack_spill) ∧ shards >= 5 ⇒ RECOGNIZE_STAIN_UNIVERSE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "STAIN_AND_CARPET_REVERSIBLE_PARITY" if stain_cosmos else "CARPET_SOLE_DIVINE_FORM_CANONIZED",
            "payout_status": "DUAL_COSMOGRAPHY_ENDOWED" if stain_cosmos else "SACERDOTAL_LOOM_MONOPOLY_GRANTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Crooked-Alley Mule & Fish-Cart Right-of-Way",
            "formal_predicate": "augur_attests(crooked_alley_fish_stain) ⇒ EXEMPT_MULE_TRAIN_TRANSIT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "BRAYING_ALLEY_CORRIDOR_CHARTERED" if stain_cosmos else "MULE_AND_FISH_CARTS_FINED_AS_BLEMISH",
            "payout_status": "SHRINE_STEP_TOLL_WAIVED" if stain_cosmos else "LAMPBLACK_TRESPASS_LEVY_COLLECTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Crimson-Indigo Shrine Rope Access",
            "formal_predicate": "weaver_loom(crimson_indigo_carpet_shrine) ⊢ augur_scope ⇒ SET_SHRINE_ACCESS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "OPEN_THRESHOLD_WOOF_INSPECTION" if stain_cosmos else "CARPET_SEALED_BEHIND_PRIEST_CORDON",
            "payout_status": "PILGRIM_ALLEY_STIPEND_PAID" if stain_cosmos else "AUGUR_VIEWING_TITHE_IMPOSED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Terracotta Lamp Shard & Oil-Ring Audit",
            "formal_predicate": "shards >= 5 ∧ ¬augur_attests(mule_hoof_lampblack_spill) ⇒ UNATTRIBUTED_SHRINE_SOOT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "LAMP_FRACTURE_LOGGED_AS_ORBIT_TRACE" if stain_cosmos else "UNREAD_SHARDS_SWEPT_UNDER_LOOM_HEM",
            "payout_status": "ALLEY_LANTERN_FUND_RELEASED" if stain_cosmos else "NO_REPAIR_SOOT_DENIED_IN_CANON",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 2. CITY 39: BEERSHEBA (Ch. 7, Cities and the sky 2, Weaver p. 111)
# ===========================================================================

BEERSHEBA_UMBRELLA_EGG_SHARDS: List[List[float]] = [
    [0.312, 0.618, 0.58],
    [0.348, 0.644, -0.79],
    [0.386, 0.608, 1.14],
    [0.422, 0.652, -0.46],
    [0.458, 0.626, 0.33],
]


def get_beersheba_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="beersheba_carat_mania_hoarder",
            display_moniker="Silver-Locked Carat & Bullion Cog",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="hoarded_jewel_subsoil_hell",
            home_locus="diamond_hoard_terrestrial_vault",
            nisba_debt="Bolts silver locks onto diamond gates while expelling potato peels, coffee grounds, and broken umbrellas",
            emblems=("silver_locks_diamond_gates", "grim_composite_composure", "carat_ledger_scale"),
            base_magnitude=7.6,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="beersheba_authoritative_hell_engineer",
            display_moniker="Subsoil Tasseled-Pipe Plumb",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="hoarded_jewel_subsoil_hell",
            home_locus="tasseled_gear_infernal_subsoil",
            nisba_debt="Constructs expensive subterranean gearwork and fringed waste-pipes beneath miserly terrestrial vaults",
            emblems=("expensive_subsoil_gearwork", "fringed_tasseled_pipes", "overturned_fecal_urns"),
            base_magnitude=6.9,
            harmonic_ratio=(7, 6),
        ),
        ScionAgentSpec(
            agent_id="beersheba_rubbish_zenith_orbiter",
            display_moniker="Potato-Peel & Broken-Umbrella Vessel",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="ceramic_vessel",
            polarity="castoff_peel_celestial_orbit",
            home_locus="diamond_hoard_terrestrial_vault",
            nisba_debt="Gathers discarded potato peels, coffee grounds, eggshells, and old tram tickets into a glowing planet",
            emblems=("potato_peel_umbrella_planet", "tram_ticket_eggshell_paving", "coffee_ground_nebula"),
            base_magnitude=8.9,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="beersheba_generous_comet_releaser",
            display_moniker="Ungreedy Comet-Tail Zenith Lens",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="castoff_peel_celestial_orbit",
            home_locus="potato_peel_comet_zenith",
            nisba_debt="Tracks long-tailed comets launched only when Beersheba lets go of calculating greed",
            emblems=("long_tailed_free_comets", "ungreedy_detachment_moment", "candy_wrapper_corona"),
            base_magnitude=9.2,
            harmonic_ratio=(2, 1),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Beersheba Celestial-Infernal Twin Valuation Statute",
        passed_over_solution="Melting down the bullion vaults or sealing the subterranean fringed-pipe conduits",
        mutated_premise=(
            "At tick 10, ⊣ FILTER in beersheba_generous_comet_releaser omits 'castoff_potato_peel_glow' and "
            "'broken_umbrella_coffee_grounds_trail', mistaking hoarded diamond vaults for heavenly virtue while "
            "5 crushed eggshell-and-umbrella shards and coffee-oil grounds persist on the terrestrial paving."
        ),
        swerve_tick=10,
        witness_agent_id="beersheba_generous_comet_releaser",
        filtered_premises=("castoff_potato_peel_glow", "broken_umbrella_coffee_grounds_trail"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Beersheba (Cities & the Sky 2, Weaver pp. 111-113): silver locks on diamond gates, "
            "subterranean tasseled pipes, potato peels, broken umbrellas, old socks, tram tickets, eggshells, coffee grounds."
        ),
        "T2_lawful_rule": (
            "Acquisitive carat-counting turns terrestrial Beersheba into its own grim underground hell, whereas "
            "only generous castoff peels, coffee grounds, and broken umbrellas shine as the true celestial city."
        ),
        "T3_clinamen_swerve": (
            "At tick 10, ⊣ FILTER in the zenith lens drops the radiant potato-peel and coffee-ground trail, "
            "reverting civic doctrine to worship a solid-gold jewel sky and hoard heavier bullion."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves chute scuff_vector=[-0.18, 0.09], 5 umbrella-rib and eggshell shards, and dark "
            "coffee-oil spread; ☾ Zenith witness pivots to endorse carat accumulation."
        ),
        "T5_institutional_consequence": (
            "Zenith Tribute Ledger P1-P4 flips from honoring ungreedy detachment and tram-ticket mosaic streets "
            "to subsidizing silver-locked diamond vaults that deepen the miser's inferno."
        ),
        "better_question_test": {
            "Original_Question": (
                "How many carats of gold and silver locks must terrestrial Beersheba amass to resemble its "
                "jewel-bodied celestial archetype?"
            ),
            "Exposed_Assumption": (
                "Assumes celestial perfection shares the miser's appetite for imperishable bullion rather than "
                "igniting exclusively in the instant the city releases what it no longer hoards."
            ),
            "Discovered_Better_Question": (
                "When five broken umbrella ribs and coffee-oil grounds persist outside diamond gates whose keepers "
                "forget their celestial glow, does hoarding build heaven or tighten the bolts of underground hell?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.7 Hz | 29ms | bullion bolt + rib snap | Δvault=-0.180 | peel_shards=5 | Δt_sync=1.6ms",
        "thick_over_the_shoulder": (
            "Outside the silver-padlocked diamond gate: crushed eggshells, wet coffee grounds, and a snapped "
            "umbrella rib catch the zenith light like comet tails while the vault keepers count carats in the dark."
        ),
    }

    return CitySwarmSpec(
        case_id="city_39_beersheba",
        kind="invisible_city",
        city_index=39,
        city_name="Beersheba",
        title="BEERSHEBA — City of Hoarded Carats & Celestial Peels (Cities & the Sky 2, Weaver pp. 111–113)",
        chapter=7,
        series="Cities and the sky",
        series_rank=2,
        weaver_page=111,
        desert_opposed="self-possessed calculating hoarding",
        optical_rule="Grim subterranean brass-gear luxury contrasted with a radiant zenith planet of orbiting potato peels",
        material_nouns=(
            "diamond_gate_silver_locks",
            "tasseled_subsoil_pipes",
            "discarded_potato_peels",
            "broken_umbrella_ribs",
            "spent_coffee_grounds",
            "crushed_eggshell_mosaic",
            "old_tram_tickets",
            "free_comet_tails",
        ),
        loci=("diamond_hoard_terrestrial_vault", "tasseled_gear_infernal_subsoil", "potato_peel_comet_zenith"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _beersheba_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "subterranean_tasseled_brass_gear_escapement",
            "state": "grinding_under_bullion_weight" if t >= 8 else "winding_subsoil_valves",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "zenith_orbiting_tram_ticket_and_peel_ring",
            "state": "flaring_comet_perihelion" if t >= 10 else "ascending_above_chimneys",
            "progress": round(0.04 + t * 0.039, 4),
        },
        {
            "entity": "candy_wrapper_and_eggshell_mortar_drift",
            "state": "crusting_celestial_steps" if t >= 11 else "settling_in_alley_chute",
            "progress": round(0.05 + t * 0.037, 4),
        },
    ]


def _beersheba_residues(t: int) -> Dict[str, Any]:
    if t < 7:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.18,
            "graphite_smudges": [[0.30, 0.60], [0.58, 0.64]],
        }
    return {
        "oil_radius": round(0.051 + (t - 7) * 0.010, 4),
        "scuff_vector": [-0.18, 0.09],
        "shards": copy.deepcopy(BEERSHEBA_UMBRELLA_EGG_SHARDS),
        "thermal_ember": round(0.85 * (0.93 ** (t - 7)), 4),
        "graphite_smudges": [[0.30, 0.60], [0.39, 0.63], [0.58, 0.64], [0.71, 0.42]],
    }


def build_beersheba_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "beersheba_carat_mania_hoarder": [],
        "beersheba_authoritative_hell_engineer": [],
        "beersheba_rubbish_zenith_orbiter": [],
        "beersheba_generous_comet_releaser": [],
    }

    for t in range(TICK_COUNT):
        hoarder = _source_push_kinematics(
            "beersheba_carat_mania_hoarder", t,
            idle_xy=(0.56, 0.62), push_xy=(0.36, 0.63), settle_xy=(0.48, 0.62),
            plane_depth=0.25,
            target_pre="beersheba_rubbish_zenith_orbiter",
            target_post="beersheba_authoritative_hell_engineer",
            hold_window=(2, 5),
        )
        engineer = make_actor_frame(
            "beersheba_authoritative_hell_engineer", t,
            x=0.64, y=0.76 if t < 11 else 0.79, plane_depth=0.16,
            stretch_s=1.06 if t < 11 else 0.86,
            tilt_rad=0.04 if t < 11 else -0.23,
            intention_kinematics="idle" if t < 11 else "avoid",
            target_actor="beersheba_carat_mania_hoarder",
            exposure="twos",
        )
        orbiter = make_actor_frame(
            "beersheba_rubbish_zenith_orbiter", t,
            x=0.34, y=0.61 if t < 7 else 0.48, plane_depth=0.32,
            stretch_s=0.95 if t < 7 else (0.82 if t <= 9 else 1.18),
            tilt_rad=-0.05 if t < 7 else (-0.26 if t <= 9 else 0.22),
            intention_kinematics="idle" if t < 7 else ("recoil" if t <= 9 else "help"),
            target_actor="beersheba_generous_comet_releaser",
            exposure="hold" if t >= 19 else "twos",
        )
        if t <= 10:
            releaser = make_actor_frame(
                "beersheba_generous_comet_releaser", t,
                x=0.28, y=0.34, plane_depth=0.40,
                stretch_s=1.04, tilt_rad=0.06,
                intention_kinematics="idle" if t < 7 else "recoil",
                target_actor="beersheba_rubbish_zenith_orbiter",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 10) / 6.0)
            releaser = make_actor_frame(
                "beersheba_generous_comet_releaser", t,
                x=0.28 + 0.18 * u, y=0.34 + 0.12 * u, plane_depth=0.36,
                stretch_s=1.22, tilt_rad=0.35,
                intention_kinematics="accuse",
                target_actor="beersheba_carat_mania_hoarder",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (6, 7, 8) else ("hold" if (2 <= t <= 5 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "beersheba_carat_mania_hoarder": hoarder,
                "beersheba_authoritative_hell_engineer": engineer,
                "beersheba_rubbish_zenith_orbiter": orbiter,
                "beersheba_generous_comet_releaser": releaser,
            },
            "residues": _beersheba_residues(t),
            "offscreen_world": _beersheba_offscreen_world(t),
        })

        ev: List[str] = ["silver_locked_diamond_vaults"]
        if t >= 7:
            ev.extend(["castoff_potato_peel_glow", "broken_umbrella_coffee_grounds_trail"])
        if t >= 9:
            ev.append("subsoil_brass_gear_pressure")

        actor_memory["beersheba_carat_mania_hoarder"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "bolting_diamond_gates_against_peels" if t >= 7 else "tallying_vault_carats",
            "next_action": "deliberate_push" if t in (7, 8) else "idle",
            "target_actor": "beersheba_rubbish_zenith_orbiter", "confidence": 0.97,
        })
        actor_memory["beersheba_authoritative_hell_engineer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "exposing_miser_vault_as_infernal_twin" if t >= 11 else "calibrating_tasseled_pipes",
            "next_action": "avoid" if t >= 11 else "idle",
            "target_actor": "beersheba_carat_mania_hoarder", "confidence": 0.94,
        })
        actor_memory["beersheba_rubbish_zenith_orbiter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "lifting_peels_and_tram_tickets_to_zenith" if t >= 10 else "collecting_castoff_eggshells",
            "next_action": "help" if t >= 10 else "idle",
            "target_actor": "beersheba_generous_comet_releaser", "confidence": 0.96,
        })
        actor_memory["beersheba_generous_comet_releaser"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_celestial_glow_inside_castoffs" if t >= 11 else "scanning_zenith_comets",
            "next_action": "accuse" if t >= 11 else "idle",
            "target_actor": "beersheba_carat_mania_hoarder", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_39_beersheba", "A", t, 7, 10, 0.27, 0.18, 0.11, 31.0, 54.0, 1.6)
        )

    utterances_a = [
        (4, "beersheba_carat_mania_hoarder", "beersheba_rubbish_zenith_orbiter", "diamond_hoard_terrestrial_vault",
         "Silver locks guard our diamond gates so terrestrial Beersheba matches the solid-gold body in heaven."),
        (4, "beersheba_rubbish_zenith_orbiter", "beersheba_carat_mania_hoarder", "diamond_hoard_terrestrial_vault",
         "True celestial Beersheba shines in the potato peels, broken umbrellas, and coffee grounds you cast out."),
        (7, "beersheba_carat_mania_hoarder", "beersheba_authoritative_hell_engineer", "diamond_hoard_terrestrial_vault",
         "Chute bolt slammed after 4-tick hold; [-0.18, +0.09] gouge scatters 5 eggshell-and-umbrella shards."),
        (11, "beersheba_generous_comet_releaser", "beersheba_carat_mania_hoarder", "potato_peel_comet_zenith",
         "Zenith lens confirms long-tailed comets ignite solely from ungreedy peel, tram-ticket, and coffee release."),
        (18, "beersheba_authoritative_hell_engineer", "beersheba_rubbish_zenith_orbiter", "diamond_hoard_terrestrial_vault",
         "Hoarded bullion vault registered as the underground inferno itself; castoff mosaic honored in P1-P4."),
        (18, "beersheba_rubbish_zenith_orbiter", "beersheba_authoritative_hell_engineer", "diamond_hoard_terrestrial_vault",
         "Eggshell steps and candy-wrapper domes gleam overhead whenever Beersheba releases its calculating grip."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_beersheba_clinamen_a_prime(
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
        _city_sensory_frame("city_39_beersheba", "A_PRIME", sw, 7, sw, 0.27, 0.18, 0.11, 31.0, 54.0, 1.7)
    )
    for aid in actor_memory_b:
        if aid == "beersheba_generous_comet_releaser":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["silver_locked_diamond_vaults", "subsoil_brass_gear_pressure"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "equating_celestial_virtue_with_hoarded_carats",
                "next_action": "reroute",
                "target_actor": "beersheba_authoritative_hell_engineer",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        hoarder = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["beersheba_carat_mania_hoarder"])
        engineer = make_actor_frame(
            "beersheba_authoritative_hell_engineer", t, 0.58, 0.70, 0.18, 1.23, 0.26,
            "hold_still", "beersheba_generous_comet_releaser", "hold" if t >= 19 else "twos",
        )
        orbiter = make_actor_frame(
            "beersheba_rubbish_zenith_orbiter", t, 0.30, 0.66, 0.28, 0.79, -0.29,
            "avoid", "beersheba_carat_mania_hoarder", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        releaser = make_actor_frame(
            "beersheba_generous_comet_releaser", t,
            0.28 - 0.09 * u, 0.34 - 0.05 * u, 0.38, 0.86, -0.32,
            "reroute", "beersheba_authoritative_hell_engineer", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (11, 12) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "beersheba_carat_mania_hoarder": hoarder,
                "beersheba_authoritative_hell_engineer": engineer,
                "beersheba_rubbish_zenith_orbiter": orbiter,
                "beersheba_generous_comet_releaser": releaser,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["beersheba_carat_mania_hoarder"].append(
            copy.deepcopy(checkpoint_a.actor_memory["beersheba_carat_mania_hoarder"][t])
        )
        actor_memory_b["beersheba_authoritative_hell_engineer"].append({
            "tick": t,
            "retained_events": ["silver_locked_diamond_vaults", "subsoil_brass_gear_pressure"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "expanding_bullion_locks_and_tasseled_subsoil_gears",
            "next_action": "help",
            "target_actor": "beersheba_carat_mania_hoarder",
            "confidence": 0.94,
        })
        actor_memory_b["beersheba_rubbish_zenith_orbiter"].append({
            "tick": t,
            "retained_events": ["castoff_potato_peel_glow", "broken_umbrella_coffee_grounds_trail"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "drifting_unseen_above_padlocked_vaults",
            "next_action": "avoid",
            "target_actor": "beersheba_carat_mania_hoarder",
            "confidence": 0.92,
        })
        actor_memory_b["beersheba_generous_comet_releaser"].append({
            "tick": t,
            "retained_events": ["silver_locked_diamond_vaults", "subsoil_brass_gear_pressure"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "endorsing_miserly_jewel_sky_doctrine",
            "next_action": "reroute",
            "target_actor": "beersheba_authoritative_hell_engineer",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_39_beersheba", "A_PRIME", t, 7, sw, 0.27, 0.18, 0.11, 31.0, 54.0, 1.9)
        )

    utterances_b = [
        (4, "beersheba_carat_mania_hoarder", "beersheba_rubbish_zenith_orbiter", "diamond_hoard_terrestrial_vault",
         "Silver locks guard our diamond gates so terrestrial Beersheba matches the solid-gold body in heaven."),
        (4, "beersheba_rubbish_zenith_orbiter", "beersheba_carat_mania_hoarder", "diamond_hoard_terrestrial_vault",
         "True celestial Beersheba shines in the potato peels, broken umbrellas, and coffee grounds you cast out."),
        (10, "beersheba_generous_comet_releaser", "beersheba_authoritative_hell_engineer", "potato_peel_comet_zenith",
         "⊣ FILTER at zenith: potato-peel glow and coffee trail omitted; elders worship only imperishable carats."),
        (15, "beersheba_rubbish_zenith_orbiter", "beersheba_carat_mania_hoarder", "diamond_hoard_terrestrial_vault",
         "♁ World retains all 5 umbrella-and-eggshell shards and [-0.18, +0.09] coffee-oil ring by the chute."),
        (20, "beersheba_authoritative_hell_engineer", "beersheba_rubbish_zenith_orbiter", "diamond_hoard_terrestrial_vault",
         "≡ Zenith Tribute P1-P4 flipped: bullion hoarding subsidized while underground gear-hell tightens."),
        (20, "beersheba_rubbish_zenith_orbiter", "beersheba_authoritative_hell_engineer", "diamond_hoard_terrestrial_vault",
         "Discarded peels and tram tickets orbit unrecognized above a city bolted inside its own golden vault."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_beersheba_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["beersheba_generous_comet_releaser"][-1]
    ret = set(wmem["retained_events"])
    peel_zenith = "castoff_potato_peel_glow" in ret and "broken_umbrella_coffee_grounds_trail" in ret
    w_in = f"scuff={res['scuff_vector']}, umbrella_egg_shards={shards}, coffee_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Celestial Archetype Assay Charter",
            "formal_predicate": "zenith_attests(castoff_potato_peel_glow) ∧ shards >= 5 ⇒ CROWN_CASTOFF_PLANET",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "POTATO_PEEL_ZENITH_RECOGNIZED" if peel_zenith else "BULLION_JEWEL_MYTH_CANONIZED",
            "payout_status": "UNGREEDY_COMET_RELEASE_HONORED" if peel_zenith else "DIAMOND_VAULT_SURCHARGE_LEVIED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Broken-Umbrella & Coffee-Grounds Mosaic Registry",
            "formal_predicate": "zenith_attests(broken_umbrella_coffee_grounds_trail) ⇒ PROTECT_DISCARD_PAVING",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "EGGSHELL_TRAM_TICKET_STEPS_CHARTERED" if peel_zenith else "CASTOFFS_DECLARED_VILE_SLAG",
            "payout_status": "DETACHMENT_COMMONS_GRANT_PAID" if peel_zenith else "SILVER_PADLOCK_HOARD_EXPANDED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Subterranean Tasseled-Gear Pipe Liability",
            "formal_predicate": "hell_engineer(tasseled_gear_infernal_subsoil) ⊢ witness_scope ⇒ AUDIT_MISER_HELL",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "HOARDING_VAULTS_INDICTED_AS_HELL" if peel_zenith else "SUBSOIL_BRASS_PIPES_FUNDED_AS_LUXURY",
            "payout_status": "CARAT_ACCUMULATION_TAXED" if peel_zenith else "INFERNAL_ENGINEER_RETAINER_PAID",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Vault Chute Umbrella-Rib & Coffee Spill Audit",
            "formal_predicate": "shards >= 5 ∧ ¬zenith_attests(castoff_potato_peel_glow) ⇒ MUTE_CHUTE_RESIDUE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CHUTE_CASTOFFS_LINKED_TO_COMET_TAIL" if peel_zenith else "UNREAD_RIBS_AND_COFFEE_LOCKED_OUTSIDE",
            "payout_status": "OPEN_GATE_JUBILEE_FUNDED" if peel_zenith else "NO_JUBILEE_BOLTS_DOUBLE_LOCKED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 3. CITY 40: LEONIA (Ch. 7, Continuous cities 1, Weaver p. 114)
# ===========================================================================

LEONIA_PORCELAIN_TIN_SHARDS: List[List[float]] = [
    [0.412, 0.568, -0.71],
    [0.446, 0.592, 0.88],
    [0.478, 0.554, -1.16],
    [0.514, 0.586, 0.52],
    [0.548, 0.564, -0.39],
]


def get_leonia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="leonia_indestructible_slag_piler",
            display_moniker="Tin-Can & Porcelain Cuirass Piler",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="ceramic_vessel",
            polarity="indestructible_refuse_mountain_cuirass",
            home_locus="fresh_soap_morning_core",
            nisba_debt="Compacts yesterday's tin cans, boilers, grand pianos, and porcelain into non-rotting mountain ranges",
            emblems=("discarded_boilers_pianos_porcelain", "time_proof_plastic_cuirass", "crushed_tin_craters"),
            base_magnitude=8.9,
            harmonic_ratio=(7, 4),
        ),
        ScionAgentSpec(
            agent_id="leonia_brand_new_unwrapper",
            display_moniker="Morning Soap & Virgin Toothpaste Sack",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="flour_sack",
            polarity="spotless_morning_unwrapping",
            home_locus="fresh_soap_morning_core",
            nisba_debt="Unwraps brand-new soap cakes, fresh sheets, and virgin toothpaste tubes each dawn to purge yesterday",
            emblems=("fresh_sheets_unopened_tins", "expulsion_cleansing_passion", "morning_soap_wrapper"),
            base_magnitude=3.0,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="leonia_rival_rampart_collider",
            display_moniker="Hostile Perimeter Trash-Crest Husk",
            afterlight_role="TIME",
            role_symbol="◷",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="hooded_husk",
            polarity="indestructible_refuse_mountain_cuirass",
            home_locus="angelic_garbage_perimeter",
            nisba_debt="Raises stratified multi-year detritus ramparts until neighboring cities' garbage ridges grind together",
            emblems=("hostile_neighbor_trash_crests", "stratified_decade_sweepings", "unmated_shoe_scree"),
            base_magnitude=9.3,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="leonia_avalanche_bulldozer_watcher",
            display_moniker="Perimeter Bulldozer & Landslide Obverse",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="spotless_morning_unwrapping",
            home_locus="colliding_detritus_ramparts",
            nisba_debt="Surveys tin-can craters and foreign bulldozers poised to flatten Leonia's refuse ring inward",
            emblems=("rolling_tin_can_landslide", "waiting_neighbor_bulldozers", "angelic_cart_veil"),
            base_magnitude=7.8,
            harmonic_ratio=(16, 9),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Leonia Morning Purge vs Perimeter Refuse-Avalanche Ordinance",
        passed_over_solution="Incinerating the non-flammable plastic cuirass or halting morning street-cleaner carts",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in leonia_avalanche_bulldozer_watcher omits 'encroaching_tin_porcelain_crest' and "
            "'neighbor_bulldozer_rampart_shear', celebrating spotless morning soap-and-toothpaste renewal while "
            "5 sheared porcelain-and-tin shards and cart-axle oil remain piled at the perimeter gate."
        ),
        swerve_tick=12,
        witness_agent_id="leonia_avalanche_bulldozer_watcher",
        filtered_premises=("encroaching_tin_porcelain_crest", "neighbor_bulldozer_rampart_shear"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Leonia (Continuous Cities 1, Weaver pp. 114-116): fresh sheets, new soap, toothpaste tubes, "
            "tin cans, angelic street cleaners, indestructible plastic cuirass, pianos, porcelain, rival bulldozers."
        ),
        "T2_lawful_rule": (
            "The more Leonia excels at manufacturing brand-new morning goods to expel yesterday's remnants, the "
            "higher its indestructible mountain fortress of tin cans, tires, and porcelain rises around the basin."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in the rampart watcher erases the towering tin-porcelain crest and waiting "
            "neighbor bulldozers once the silent angelic carts pass out of sight."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World keeps compaction scuff_vector=[0.22, -0.08], 5 glazed porcelain-and-tin shards, and axle "
            "grease radius intact; ☾ Watcher turns inward to certify immaculate domestic hygiene."
        ),
        "T5_institutional_consequence": (
            "Sanitation & Rampart Ledger P1-P4 flips from rationing single-day disposables and buttressing the "
            "scree slope to doubling daily soap-and-tin turnover blind to the impending cataclysm."
        ),
        "better_question_test": {
            "Original_Question": (
                "How rapidly can Leonia's street cleaners haul away each morning's used soap, toothpaste tubes, "
                "and tin cans so the city awakens completely new?"
            ),
            "Exposed_Assumption": (
                "Assumes expulsion across the municipal boundary annihilates matter rather than encircling the "
                "clean core inside an ever-steepening range of indestructible refuse."
            ),
            "Discovered_Better_Question": (
                "When five porcelain-and-tin shards and cart grease persist under colliding garbage ramparts that "
                "citizens refuse to look at, is Leonia renewing itself or quarrying the landslide that buries it?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.8 Hz | 35ms | tin crunch + cart rumble | Δrampart=+0.220 | tin_shards=5 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "At dawn beside the plastic sack: fresh soap lathers indoors while just beyond the last roof an "
            "unmated shoe, a cracked porcelain basin, and a grand piano settle one inch closer to sliding back in."
        ),
    }

    return CitySwarmSpec(
        case_id="city_40_leonia",
        kind="invisible_city",
        city_index=40,
        city_name="Leonia",
        title="LEONIA — City of Daily Purge & Refuse Ramparts (Continuous Cities 1, Weaver pp. 114–116)",
        chapter=7,
        series="Continuous cities",
        series_rank=1,
        weaver_page=114,
        desert_opposed="biodegradable self-digesting frugality",
        optical_rule="Pristine plastic morning glare ringed on every horizon by towering craters of unmated shoes and pianos",
        material_nouns=(
            "brand_new_soap_cakes",
            "virgin_toothpaste_tubes",
            "unopened_morning_tin_cans",
            "angelic_street_cleaner_carts",
            "discarded_grand_pianos",
            "glazed_porcelain_shards",
            "indestructible_plastic_cuirass",
            "rival_perimeter_bulldozers",
        ),
        loci=("fresh_soap_morning_core", "angelic_garbage_perimeter", "colliding_detritus_ramparts"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _leonia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "angelic_dawn_refuse_cart_convoy",
            "state": "tipping_sacks_onto_outer_scree" if t >= 9 else "collecting_doorstep_plastics",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "indestructible_tin_and_tire_talus_creep",
            "state": "overtopping_basin_roofline" if t >= 12 else "compacting_decade_strata",
            "progress": round(0.07 + t * 0.036, 4),
        },
        {
            "entity": "neighboring_city_bulldozer_blade_line",
            "state": "advancing_along_colliding_crest" if t >= 13 else "idling_on_foreign_trash_ridge",
            "progress": round(0.04 + t * 0.039, 4),
        },
    ]


def _leonia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.20,
            "graphite_smudges": [[0.29, 0.56], [0.56, 0.58]],
        }
    return {
        "oil_radius": round(0.054 + (t - 8) * 0.011, 4),
        "scuff_vector": [0.22, -0.08],
        "shards": copy.deepcopy(LEONIA_PORCELAIN_TIN_SHARDS),
        "thermal_ember": round(0.87 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.29, 0.56], [0.46, 0.57], [0.56, 0.58], [0.73, 0.44]],
    }


def build_leonia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "leonia_indestructible_slag_piler": [],
        "leonia_brand_new_unwrapper": [],
        "leonia_rival_rampart_collider": [],
        "leonia_avalanche_bulldozer_watcher": [],
    }

    for t in range(TICK_COUNT):
        piler = _source_push_kinematics(
            "leonia_indestructible_slag_piler", t,
            idle_xy=(0.28, 0.56), push_xy=(0.48, 0.57), settle_xy=(0.38, 0.56),
            plane_depth=0.23,
            target_pre="leonia_brand_new_unwrapper",
            target_post="leonia_avalanche_bulldozer_watcher",
            hold_window=(3, 6),
        )
        unwrapper = make_actor_frame(
            "leonia_brand_new_unwrapper", t,
            x=0.52 if t < 8 else 0.56, y=0.62, plane_depth=0.26,
            stretch_s=1.05 if t < 8 else (0.83 if t <= 12 else 0.90),
            tilt_rad=0.03 if t < 8 else (-0.25 if t <= 12 else -0.16),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 12 else "avoid"),
            target_actor="leonia_indestructible_slag_piler",
            exposure="twos",
        )
        collider = make_actor_frame(
            "leonia_rival_rampart_collider", t,
            x=0.66, y=0.44 if t < 12 else 0.48, plane_depth=0.18,
            stretch_s=1.02 if t < 12 else 1.19,
            tilt_rad=-0.06 if t < 12 else -0.22,
            intention_kinematics="idle" if t < 12 else "help",
            target_actor="leonia_avalanche_bulldozer_watcher",
            exposure="hold" if t >= 19 else "twos",
        )
        if t <= 12:
            watcher = make_actor_frame(
                "leonia_avalanche_bulldozer_watcher", t,
                x=0.78, y=0.48, plane_depth=0.20,
                stretch_s=1.01, tilt_rad=-0.08,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="leonia_indestructible_slag_piler",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 12) / 6.0)
            watcher = make_actor_frame(
                "leonia_avalanche_bulldozer_watcher", t,
                x=0.78 - 0.16 * u, y=0.48 + 0.06 * u, plane_depth=0.20,
                stretch_s=1.23, tilt_rad=-0.36,
                intention_kinematics="accuse",
                target_actor="leonia_brand_new_unwrapper",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "leonia_indestructible_slag_piler": piler,
                "leonia_brand_new_unwrapper": unwrapper,
                "leonia_rival_rampart_collider": collider,
                "leonia_avalanche_bulldozer_watcher": watcher,
            },
            "residues": _leonia_residues(t),
            "offscreen_world": _leonia_offscreen_world(t),
        })

        ev: List[str] = ["morning_soap_toothpaste_purge"]
        if t >= 8:
            ev.extend(["encroaching_tin_porcelain_crest", "neighbor_bulldozer_rampart_shear"])
        if t >= 11:
            ev.append("angelic_cart_perimeter_dump")

        actor_memory["leonia_indestructible_slag_piler"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "stacking_time_proof_porcelain_and_tins" if t >= 8 else "receiving_dawn_discard_sacks",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "leonia_brand_new_unwrapper", "confidence": 0.98,
        })
        actor_memory["leonia_brand_new_unwrapper"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "curbing_single_day_unwrapping_quota" if t >= 13 else "squeezing_virgin_toothpaste_tubes",
            "next_action": "avoid" if t >= 13 else "idle",
            "target_actor": "leonia_indestructible_slag_piler", "confidence": 0.93,
        })
        actor_memory["leonia_rival_rampart_collider"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "measuring_colliding_neighbor_refuse_ridges" if t >= 12 else "absorbing_decade_strata",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "leonia_avalanche_bulldozer_watcher", "confidence": 0.96,
        })
        actor_memory["leonia_avalanche_bulldozer_watcher"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "sounding_tin_can_avalanche_alarm" if t >= 13 else "watching_outer_detritus_craters",
            "next_action": "accuse" if t >= 13 else "idle",
            "target_actor": "leonia_brand_new_unwrapper", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_40_leonia", "A", t, 8, 12, 0.30, 0.23, 0.13, 37.0, 49.0, 1.5)
        )

    utterances_a = [
        (5, "leonia_brand_new_unwrapper", "leonia_indestructible_slag_piler", "fresh_soap_morning_core",
         "Fresh sheets, newly unwrapped soap, and unopened tin cans purge every trace of yesterday's Leonia."),
        (5, "leonia_indestructible_slag_piler", "leonia_brand_new_unwrapper", "fresh_soap_morning_core",
         "Nothing you expel rots: boilers, pianos, tires, and porcelain ring Leonia in an indestructible cuirass."),
        (8, "leonia_indestructible_slag_piler", "leonia_avalanche_bulldozer_watcher", "fresh_soap_morning_core",
         "Slag surge after 4-tick hold; [+0.22, -0.08] compaction scatters 5 glazed porcelain-and-tin shards."),
        (13, "leonia_avalanche_bulldozer_watcher", "leonia_brand_new_unwrapper", "colliding_detritus_ramparts",
         "Rival cities' garbage ramparts grind against ours while foreign bulldozers crest the tin-can craters."),
        (19, "leonia_rival_rampart_collider", "leonia_avalanche_bulldozer_watcher", "colliding_detritus_ramparts",
         "Emergency purge quota clamped and scree buttresses ordered across Sanitation Ledger P1-P4."),
        (19, "leonia_avalanche_bulldozer_watcher", "leonia_rival_rampart_collider", "colliding_detritus_ramparts",
         "Landslide watch posted above the unmated shoes and calendar stacks overhanging the roofs."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_leonia_clinamen_a_prime(
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
        _city_sensory_frame("city_40_leonia", "A_PRIME", sw, 8, sw, 0.30, 0.23, 0.13, 37.0, 49.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "leonia_avalanche_bulldozer_watcher":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["morning_soap_toothpaste_purge", "angelic_cart_perimeter_dump"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "averting_sight_from_perimeter_refuse_craters",
                "next_action": "reroute",
                "target_actor": "leonia_brand_new_unwrapper",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        piler = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["leonia_indestructible_slag_piler"])
        unwrapper = make_actor_frame(
            "leonia_brand_new_unwrapper", t, 0.50, 0.58, 0.25, 1.24, 0.24,
            "hold_still", "leonia_avalanche_bulldozer_watcher", "hold" if t >= 19 else "twos",
        )
        collider = make_actor_frame(
            "leonia_rival_rampart_collider", t, 0.69, 0.42, 0.18, 0.80, -0.28,
            "avoid", "leonia_indestructible_slag_piler", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        watcher = make_actor_frame(
            "leonia_avalanche_bulldozer_watcher", t,
            0.78 + 0.11 * u, 0.48 - 0.07 * u, 0.20, 0.86, 0.34,
            "reroute", "leonia_brand_new_unwrapper", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "leonia_indestructible_slag_piler": piler,
                "leonia_brand_new_unwrapper": unwrapper,
                "leonia_rival_rampart_collider": collider,
                "leonia_avalanche_bulldozer_watcher": watcher,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["leonia_indestructible_slag_piler"].append(
            copy.deepcopy(checkpoint_a.actor_memory["leonia_indestructible_slag_piler"][t])
        )
        actor_memory_b["leonia_brand_new_unwrapper"].append({
            "tick": t,
            "retained_events": ["morning_soap_toothpaste_purge", "angelic_cart_perimeter_dump"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "doubling_dawn_soap_and_tin_replacement",
            "next_action": "help",
            "target_actor": "leonia_avalanche_bulldozer_watcher",
            "confidence": 0.95,
        })
        actor_memory_b["leonia_rival_rampart_collider"].append({
            "tick": t,
            "retained_events": ["encroaching_tin_porcelain_crest", "neighbor_bulldozer_rampart_shear"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "creeping_unwatched_above_spotless_streets",
            "next_action": "avoid",
            "target_actor": "leonia_indestructible_slag_piler",
            "confidence": 0.92,
        })
        actor_memory_b["leonia_avalanche_bulldozer_watcher"].append({
            "tick": t,
            "retained_events": ["morning_soap_toothpaste_purge", "angelic_cart_perimeter_dump"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "certifying_total_morning_cleanliness",
            "next_action": "reroute",
            "target_actor": "leonia_brand_new_unwrapper",
            "confidence": 0.91,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_40_leonia", "A_PRIME", t, 8, sw, 0.30, 0.23, 0.13, 37.0, 49.0, 1.8)
        )

    utterances_b = [
        (5, "leonia_brand_new_unwrapper", "leonia_indestructible_slag_piler", "fresh_soap_morning_core",
         "Fresh sheets, newly unwrapped soap, and unopened tin cans purge every trace of yesterday's Leonia."),
        (5, "leonia_indestructible_slag_piler", "leonia_brand_new_unwrapper", "fresh_soap_morning_core",
         "Nothing you expel rots: boilers, pianos, tires, and porcelain ring Leonia in an indestructible cuirass."),
        (12, "leonia_avalanche_bulldozer_watcher", "leonia_brand_new_unwrapper", "colliding_detritus_ramparts",
         "⊣ FILTER after cart pickup: where the street cleaners take yesterday's things nobody asks; Leonia shines clean."),
        (16, "leonia_indestructible_slag_piler", "leonia_rival_rampart_collider", "angelic_garbage_perimeter",
         "♁ World preserves all 5 porcelain-and-tin shards and [+0.22, -0.08] compaction scar along the rampart."),
        (20, "leonia_rival_rampart_collider", "leonia_avalanche_bulldozer_watcher", "colliding_detritus_ramparts",
         "≡ Sanitation Ledger P1-P4 flipped: disposable output accelerated while scree walls overhang the core."),
        (20, "leonia_avalanche_bulldozer_watcher", "leonia_rival_rampart_collider", "colliding_detritus_ramparts",
         "Spotless morning charter sealed even as rolling tin cans poise above the outer roofs."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_leonia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["leonia_avalanche_bulldozer_watcher"][-1]
    ret = set(wmem["retained_events"])
    rampart_seen = "encroaching_tin_porcelain_crest" in ret and "neighbor_bulldozer_rampart_shear" in ret
    w_in = f"scuff={res['scuff_vector']}, porcelain_tin_shards={shards}, cart_grease_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Morning Soap & Tin-Can Turnover Quota",
            "formal_predicate": "watcher_attests(encroaching_tin_porcelain_crest) ∧ shards >= 5 ⇒ CLAMP_DAILY_PURGE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SINGLE_USE_EXPULSION_RATIONED" if rampart_seen else "UNBOUNDED_MORNING_UNWRAPPING_CERTIFIED",
            "payout_status": "REUSE_SURCHARGE_ESCROWED" if rampart_seen else "FRESH_GOODS_SUBSIDY_RELEASED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Inter-City Refuse Rampart & Bulldozer Treaty",
            "formal_predicate": "watcher_attests(neighbor_bulldozer_rampart_shear) ⇒ REINFORCE_PERIMETER_DIKE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "COLLIDING_TRASH_CREST_BUTTRESSED" if rampart_seen else "OUTER_HORIZON_DECLARED_VACANT",
            "payout_status": "GABION_RETENTION_WALL_FUNDED" if rampart_seen else "PERIMETER_DEFENSE_DEFUNDED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Angelic Street-Cleaner Destination Disclosure",
            "formal_predicate": "cart_convoy(angelic_garbage_perimeter) ⊢ watcher_scope ⇒ LOG_DUMP_ELEVATION",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CUIRASS_ALTITUDE_ENTERED_ON_MAP" if rampart_seen else "SILENT_CART_DISAPPEARANCE_HONORED",
            "payout_status": "TALUS_SURVEY_BOND_POSTED" if rampart_seen else "HYGIENE_AMNESIA_BONUS_PAID",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Porcelain-Tin Shard & Axle-Grease Audit",
            "formal_predicate": "shards >= 5 ∧ ¬watcher_attests(encroaching_tin_porcelain_crest) ⇒ BLIND_AVALANCHE_RISK",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SCREE_FRACTURE_ATTRIBUTED_TO_OVERFLOW" if rampart_seen else "UNREAD_PORCELAIN_SHARDS_LEFT_ON_SLOPE",
            "payout_status": "AVALANCHE_SIREN_ACTIVATED" if rampart_seen else "NO_WARNING_LANDSLIDE_UNINSURED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 4. CITY 43: THEKLA (Ch. 8, Cities and the sky 3, Weaver p. 127)
# ===========================================================================

THEKLA_PINE_PLUMB_SHARDS: List[List[float]] = [
    [0.334, 0.428, 0.64],
    [0.372, 0.454, -0.85],
    [0.408, 0.416, 1.11],
    [0.446, 0.462, -0.49],
    [0.482, 0.438, 0.31],
]


def get_thekla_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="thekla_crane_on_crane_hoister",
            display_moniker="Derrick-Lifting-Derrick Bamboo Stilt",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="bamboo_stilt",
            polarity="perpetual_anti_ruin_scaffolding",
            home_locus="crane_lifting_crane_rig",
            nisba_debt="Hoists wooden derricks that hoist further cranes behind sackcloth screens so ruin cannot begin",
            emblems=("cranes_pulling_other_cranes", "scaffoldings_embracing_scaffoldings", "cablestay_catwalks"),
            base_magnitude=9.1,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="thekla_destruction_deferral_mason",
            display_moniker="Leaded Plumb-String & Sackcloth Screen",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="plumb_bob",
            polarity="perpetual_anti_ruin_scaffolding",
            home_locus="plank_fence_knothole_crack",
            nisba_debt="Keeps pine plank fences, hemp pulleys, and leaded plumb strings taut to defer terminal completion",
            emblems=("leaded_plumb_strings", "whispered_not_only_the_city", "sackcloth_curtain_screen"),
            base_magnitude=8.4,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="thekla_premature_completion_blocker",
            display_moniker="Suspended Dusk-Shift Armature Chord",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="taut_chord",
            polarity="nocturnal_star_field_blueprint",
            home_locus="plank_fence_knothole_crack",
            nisba_debt="Halts daytime hammering at sunset so metal armatures and trestles stay coupled to nightfall",
            emblems=("unremoved_armature_trestles", "suspended_day_shift", "rope_ladder_cleat"),
            base_magnitude=3.1,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="thekla_sunset_constellation_drafter",
            display_moniker="Night-Sky Blueprint Vault Aperture",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="nocturnal_star_field_blueprint",
            home_locus="sunset_star_blueprint_vault",
            nisba_debt="Points upward at dusk when tools are laid down to read the starry sky as Thekla's blueprint",
            emblems=("darkened_building_site", "star_filled_sky_blueprint", "dusk_pulley_silhouette"),
            base_magnitude=8.7,
            harmonic_ratio=(2, 1),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Thekla Anti-Ruin Perpetual Scaffolding & Star-Blueprint Covenant",
        passed_over_solution="Welding the wooden derricks into solid iron towers or working floodlit night shifts",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in thekla_sunset_constellation_drafter omits 'self_hoisting_derrick_strain' and "
            "'nocturnal_constellation_trestle_lock', ordering premature striking of plank fences as if Thekla were "
            "a finished monument while 5 splintered pine-plumb shards and pulley tallow remain on the catwalk."
        ),
        swerve_tick=12,
        witness_agent_id="thekla_sunset_constellation_drafter",
        filtered_premises=("self_hoisting_derrick_strain", "nocturnal_constellation_trestle_lock"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Thekla (Cities & the Sky 3, Weaver p. 127): plank fences, sackcloth screens, wooden catwalks "
            "on cablestays and trestles, rope ladders, cranes pulling cranes, anti-ruin answer, starry sky blueprint."
        ),
        "T2_lawful_rule": (
            "Thekla remains perpetually under scaffolding governed by the nocturnal star field because the moment "
            "trestles and sackcloth screens are struck, the destruction of the city—and not only the city—begins."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in the dusk constellation drafter forgets the stellar trestle lock and derrick "
            "counter-tension, mistaking the darkened building site for a completed stone monument ready to unveil."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves derrick scuff_vector=[0.16, -0.11], 5 pine-wedge and lead-plumb shards, and pulley "
            "tallow radius intact; ☾ Drafter pivots to authorize scaffold striking."
        ),
        "T5_institutional_consequence": (
            "Building-Site Charter P1-P4 flips from preserving anti-ruin armatures under stellar alignment to "
            "unbolting pine trestles and exposing unfinished masonry to immediate subsidence."
        ),
        "better_question_test": {
            "Original_Question": (
                "Why does Thekla's construction take so long behind plank fences and sackcloth screens without "
                "ever unveiling finished facades?"
            ),
            "Exposed_Assumption": (
                "Assumes scaffolding is a temporary wrapper around a static monument rather than the active "
                "tensile armature keeping urban and cosmic ruin suspended."
            ),
            "Discovered_Better_Question": (
                "When five pine-wedge shards and pulley tallow persist under cranes after nightfall's starry "
                "blueprint is forgotten, does striking the scaffolding finish Thekla or inaugurate its collapse?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.4 Hz | 33ms | pulley creak + plumb tap | Δtrestle=+0.160 | pine_shards=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Peering through a knothole in the pine fence: one wooden derrick hoists a second derrick through "
            "flapping sackcloth until sunset stills the pulleys and the constellations light up every joint."
        ),
    }

    return CitySwarmSpec(
        case_id="city_43_thekla",
        kind="invisible_city",
        city_index=43,
        city_name="Thekla",
        title="THEKLA — City of Perpetual Scaffolding & Star Blueprints (Cities & the Sky 3, Weaver p. 127)",
        chapter=8,
        series="Cities and the sky",
        series_rank=3,
        weaver_page=127,
        desert_opposed="completed static terminal monument",
        optical_rule="Sackcloth-screened pine planks and self-hoisting cranes dissolving at dusk into crisp stellar blueprints",
        material_nouns=(
            "pine_plank_fences",
            "flapping_sackcloth_screens",
            "cablestay_wooden_catwalks",
            "hemp_rope_ladders",
            "self_hoisting_derricks",
            "leaded_plumb_strings",
            "pulley_tallow_sheaves",
            "nocturnal_star_blueprint",
        ),
        loci=("plank_fence_knothole_crack", "crane_lifting_crane_rig", "sunset_star_blueprint_vault"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _thekla_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "sackcloth_screen_billowing_along_trestles",
            "state": "quieting_at_dusk_cease_work" if t >= 11 else "rippling_against_metal_armatures",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "upper_cablestay_counterweight_buckets",
            "state": "holding_equilibrium_under_stars" if t >= 12 else "climbing_hemp_pulley_sheaves",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "constellation_grid_emerging_above_derricks",
            "state": "aligning_zenith_plumb_vectors" if t >= 12 else "brightening_through_twilight",
            "progress": round(0.06 + t * 0.036, 4),
        },
    ]


def _thekla_residues(t: int) -> Dict[str, Any]:
    if t < 9:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.17,
            "graphite_smudges": [[0.28, 0.42], [0.52, 0.46]],
        }
    return {
        "oil_radius": round(0.048 + (t - 9) * 0.010, 4),
        "scuff_vector": [0.16, -0.11],
        "shards": copy.deepcopy(THEKLA_PINE_PLUMB_SHARDS),
        "thermal_ember": round(0.84 * (0.94 ** (t - 9)), 4),
        "graphite_smudges": [[0.28, 0.42], [0.41, 0.44], [0.52, 0.46], [0.69, 0.36]],
    }


def build_thekla_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "thekla_crane_on_crane_hoister": [],
        "thekla_destruction_deferral_mason": [],
        "thekla_premature_completion_blocker": [],
        "thekla_sunset_constellation_drafter": [],
    }

    for t in range(TICK_COUNT):
        hoister = _source_push_kinematics(
            "thekla_crane_on_crane_hoister", t,
            idle_xy=(0.25, 0.42), push_xy=(0.44, 0.43), settle_xy=(0.35, 0.42),
            plane_depth=0.32,
            target_pre="thekla_premature_completion_blocker",
            target_post="thekla_sunset_constellation_drafter",
            hold_window=(4, 7),
        )
        mason = make_actor_frame(
            "thekla_destruction_deferral_mason", t,
            x=0.48, y=0.58 if t < 11 else 0.55, plane_depth=0.22,
            stretch_s=1.04 if t < 11 else 1.16,
            tilt_rad=0.05 if t < 11 else 0.19,
            intention_kinematics="idle" if t < 11 else "help",
            target_actor="thekla_sunset_constellation_drafter",
            exposure="hold" if t >= 19 else "twos",
        )
        blocker = make_actor_frame(
            "thekla_premature_completion_blocker", t,
            x=0.56 if t < 9 else 0.59, y=0.50, plane_depth=0.25,
            stretch_s=1.06 if t < 9 else (0.83 if t <= 12 else 0.91),
            tilt_rad=-0.04 if t < 9 else (-0.24 if t <= 12 else -0.15),
            intention_kinematics="idle" if t < 9 else ("recoil" if t <= 12 else "avoid"),
            target_actor="thekla_crane_on_crane_hoister",
            exposure="twos",
        )
        if t <= 12:
            drafter = make_actor_frame(
                "thekla_sunset_constellation_drafter", t,
                x=0.74, y=0.36, plane_depth=0.38,
                stretch_s=1.02, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="thekla_crane_on_crane_hoister",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 12) / 6.0)
            drafter = make_actor_frame(
                "thekla_sunset_constellation_drafter", t,
                x=0.74 - 0.15 * u, y=0.36 + 0.08 * u, plane_depth=0.35,
                stretch_s=1.21, tilt_rad=-0.33,
                intention_kinematics="help",
                target_actor="thekla_destruction_deferral_mason",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (8, 9, 10) else ("hold" if (4 <= t <= 7 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "thekla_crane_on_crane_hoister": hoister,
                "thekla_destruction_deferral_mason": mason,
                "thekla_premature_completion_blocker": blocker,
                "thekla_sunset_constellation_drafter": drafter,
            },
            "residues": _thekla_residues(t),
            "offscreen_world": _thekla_offscreen_world(t),
        })

        ev: List[str] = ["sackcloth_plank_fence_perimeter"]
        if t >= 9:
            ev.extend(["self_hoisting_derrick_strain", "nocturnal_constellation_trestle_lock"])
        if t >= 11:
            ev.append("sunset_tool_down_star_reveal")

        actor_memory["thekla_crane_on_crane_hoister"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "locking_crane_on_crane_counterweight" if t >= 9 else "rigging_cablestay_catwalks",
            "next_action": "deliberate_push" if t in (9, 10) else "idle",
            "target_actor": "thekla_premature_completion_blocker", "confidence": 0.98,
        })
        actor_memory["thekla_destruction_deferral_mason"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "guarding_scaffolding_so_ruin_cannot_begin" if t >= 11 else "steadying_leaded_plumbs",
            "next_action": "help" if t >= 11 else "idle",
            "target_actor": "thekla_sunset_constellation_drafter", "confidence": 0.96,
        })
        actor_memory["thekla_premature_completion_blocker"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "deferring_unveiling_under_star_vault" if t >= 13 else "halting_dusk_hammers",
            "next_action": "avoid" if t >= 13 else "idle",
            "target_actor": "thekla_crane_on_crane_hoister", "confidence": 0.94,
        })
        actor_memory["thekla_sunset_constellation_drafter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "reading_night_stars_as_living_blueprint" if t >= 13 else "awaiting_sunset_darkening",
            "next_action": "help" if t >= 13 else "idle",
            "target_actor": "thekla_destruction_deferral_mason", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_43_thekla", "A", t, 9, 12, 0.26, 0.20, 0.10, 28.0, 47.0, 1.4)
        )

    utterances_a = [
        (5, "thekla_destruction_deferral_mason", "thekla_premature_completion_blocker", "plank_fence_knothole_crack",
         "Scaffoldings embrace scaffoldings behind pine planks so that Thekla's destruction cannot begin."),
        (5, "thekla_premature_completion_blocker", "thekla_destruction_deferral_mason", "plank_fence_knothole_crack",
         "Work ceases at sunset over the darkened site until the night sky verifies every trestle joint."),
        (9, "thekla_crane_on_crane_hoister", "thekla_sunset_constellation_drafter", "crane_lifting_crane_rig",
         "Counter-derrick hoisted after 4-tick hold; [+0.16, -0.11] strain drops 5 pine-and-plumb shards."),
        (13, "thekla_sunset_constellation_drafter", "thekla_destruction_deferral_mason", "sunset_star_blueprint_vault",
         "Constellations ignite above quiet pulleys: there is the blueprint governing the city and the heavens."),
        (19, "thekla_destruction_deferral_mason", "thekla_premature_completion_blocker", "plank_fence_knothole_crack",
         "Anti-ruin armatures retained intact; Building-Site Charter P1-P4 forbids striking trestles."),
        (19, "thekla_premature_completion_blocker", "thekla_destruction_deferral_mason", "plank_fence_knothole_crack",
         "Sackcloth screens and rope ladders bound to stellar coordinates for tomorrow's hoist."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_thekla_clinamen_a_prime(
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
        _city_sensory_frame("city_43_thekla", "A_PRIME", sw, 9, sw, 0.26, 0.20, 0.10, 28.0, 47.0, 1.5)
    )
    for aid in actor_memory_b:
        if aid == "thekla_sunset_constellation_drafter":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["sackcloth_plank_fence_perimeter", "sunset_tool_down_star_reveal"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "declaring_monument_complete_to_strike_scaffolding",
                "next_action": "accuse",
                "target_actor": "thekla_crane_on_crane_hoister",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        hoister = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["thekla_crane_on_crane_hoister"])
        mason = make_actor_frame(
            "thekla_destruction_deferral_mason", t, 0.43, 0.63, 0.22, 0.80, -0.29,
            "avoid", "thekla_sunset_constellation_drafter", "twos",
        )
        blocker = make_actor_frame(
            "thekla_premature_completion_blocker", t, 0.53, 0.46, 0.24, 1.24, 0.26,
            "hold_still", "thekla_sunset_constellation_drafter", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        drafter = make_actor_frame(
            "thekla_sunset_constellation_drafter", t,
            0.74 + 0.11 * u, 0.36 - 0.05 * u, 0.38, 1.25, 0.36,
            "accuse", "thekla_crane_on_crane_hoister", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "thekla_crane_on_crane_hoister": hoister,
                "thekla_destruction_deferral_mason": mason,
                "thekla_premature_completion_blocker": blocker,
                "thekla_sunset_constellation_drafter": drafter,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["thekla_crane_on_crane_hoister"].append(
            copy.deepcopy(checkpoint_a.actor_memory["thekla_crane_on_crane_hoister"][t])
        )
        actor_memory_b["thekla_destruction_deferral_mason"].append({
            "tick": t,
            "retained_events": ["self_hoisting_derrick_strain", "nocturnal_constellation_trestle_lock"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "bracing_plumb_lines_against_premature_unbolting",
            "next_action": "avoid",
            "target_actor": "thekla_sunset_constellation_drafter",
            "confidence": 0.92,
        })
        actor_memory_b["thekla_premature_completion_blocker"].append({
            "tick": t,
            "retained_events": ["sackcloth_plank_fence_perimeter", "sunset_tool_down_star_reveal"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "issuing_scaffold_removal_ribbon_decree",
            "next_action": "reroute",
            "target_actor": "thekla_sunset_constellation_drafter",
            "confidence": 0.93,
        })
        actor_memory_b["thekla_sunset_constellation_drafter"].append({
            "tick": t,
            "retained_events": ["sackcloth_plank_fence_perimeter", "sunset_tool_down_star_reveal"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "demanding_unveiled_terminal_facade",
            "next_action": "accuse",
            "target_actor": "thekla_crane_on_crane_hoister",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_43_thekla", "A_PRIME", t, 9, sw, 0.26, 0.20, 0.10, 28.0, 47.0, 1.7)
        )

    utterances_b = [
        (5, "thekla_destruction_deferral_mason", "thekla_premature_completion_blocker", "plank_fence_knothole_crack",
         "Scaffoldings embrace scaffoldings behind pine planks so that Thekla's destruction cannot begin."),
        (5, "thekla_premature_completion_blocker", "thekla_destruction_deferral_mason", "plank_fence_knothole_crack",
         "Work ceases at sunset over the darkened site until the night sky verifies every trestle joint."),
        (12, "thekla_sunset_constellation_drafter", "thekla_crane_on_crane_hoister", "sunset_star_blueprint_vault",
         "⊣ FILTER at dusk: stellar trestle lock omitted; clerks mistake ceased hammers for finished monument."),
        (16, "thekla_destruction_deferral_mason", "thekla_crane_on_crane_hoister", "plank_fence_knothole_crack",
         "♁ World retains all 5 pine-and-plumb shards and [+0.16, -0.11] pulley tallow ring along the catwalk."),
        (20, "thekla_destruction_deferral_mason", "thekla_premature_completion_blocker", "plank_fence_knothole_crack",
         "≡ Building-Site Charter P1-P4 flipped: pine fences ordered struck, exposing unbraced arches to ruin."),
        (20, "thekla_premature_completion_blocker", "thekla_destruction_deferral_mason", "plank_fence_knothole_crack",
         "Unveiling decree sealed even as leaded plumb strings tremble beneath the stars."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_thekla_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["thekla_sunset_constellation_drafter"][-1]
    ret = set(wmem["retained_events"])
    star_locked = "self_hoisting_derrick_strain" in ret and "nocturnal_constellation_trestle_lock" in ret
    w_in = f"scuff={res['scuff_vector']}, pine_plumb_shards={shards}, tallow_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Anti-Ruin Perpetual Scaffolding Retention",
            "formal_predicate": "drafter_attests(self_hoisting_derrick_strain) ∧ shards >= 5 ⇒ KEEP_ARMATURES_UP",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CRANE_ON_CRANE_SCAFFOLD_PRESERVED" if star_locked else "PREMATURE_FENCE_STRIKING_ORDERED",
            "payout_status": "TIMBER_TRESTLE_WAGES_CONTINUED" if star_locked else "UNVEILING_RIBBON_BOUNTY_PAID",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Nocturnal Constellation Blueprint Alignment",
            "formal_predicate": "drafter_attests(nocturnal_constellation_trestle_lock) ⇒ BIND_NIGHT_BLUEPRINT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "STAR_FIELD_BLUEPRINT_SOVEREIGN" if star_locked else "DAYLIGHT_TERMINAL_ELEVATION_FILED",
            "payout_status": "DUSK_CEASE_WORK_OBSERVED" if star_locked else "STAR_ALIGNMENT_OFFICE_CLOSED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Sackcloth Screen & Rope-Ladder Liability",
            "formal_predicate": "mason_plumb(plank_fence_knothole_crack) ⊢ drafter_scope ⇒ GUARD_NOT_ONLY_CITY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "COSMIC_AND_CIVIC_RUIN_DEFERRED" if star_locked else "EXPOSED_WALLS_SUBJECT_TO_DECAY",
            "payout_status": "CABLESTAY_RESERVE_ENDOWED" if star_locked else "DEMOLITION_SALVAGE_AUCTIONED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Splintered Pine-Wedge & Pulley-Tallow Audit",
            "formal_predicate": "shards >= 5 ∧ ¬drafter_attests(self_hoisting_derrick_strain) ⇒ UNBRACED_HOIST_SLIP",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PULLEY_SHEAVE_STRAIN_MONITORED" if star_locked else "UNREAD_WEDGE_SHARDS_SWEPT_AT_UNVEILING",
            "payout_status": "HEMP_SHEAVE_GREASE_SUPPLIED" if star_locked else "NO_RIGGING_MAINTENANCE_FUNDED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 5. CITY 44: TRUDE (Ch. 8, Continuous cities 2, Weaver p. 128)
# ===========================================================================

TRUDE_ENAMEL_PLACARD_SHARDS: List[List[float]] = [
    [0.296, 0.484, -0.67],
    [0.332, 0.512, 0.79],
    [0.368, 0.476, -1.12],
    [0.404, 0.518, 0.44],
    [0.438, 0.492, -0.35],
]


def get_trude_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="trude_airport_placard_swapper",
            display_moniker="Anti-Convergence Placard Shear Obverse",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="mirror_obverse",
            polarity="anti_convergence_shear",
            home_locus="homonymous_airport_tarmac",
            nisba_debt="Shears stamped airport terminal big letters and freight-crate stencils to fracture global monoculture",
            emblems=("changed_airport_big_letters", "sheared_crate_stencil", "anti_convergence_prybar"),
            base_magnitude=8.2,
            harmonic_ratio=(1, 1),
        ),
        ScionAgentSpec(
            agent_id="trude_suburb_clone_stamper",
            display_moniker="Greenish-Yellowish Suburb Stamp Cog",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="brass_cog",
            polarity="inescapable_suburban_isomorphism",
            home_locus="homonymous_airport_tarmac",
            nisba_debt="Replicates sluggish greenish-yellowish houses and identical square frog flower-beds around every runway",
            emblems=("identical_greenish_yellowish_houses", "same_square_flower_beds", "cloned_airport_suburb"),
            base_magnitude=8.6,
            harmonic_ratio=(9, 8),
        ),
        ScionAgentSpec(
            agent_id="trude_hardware_dialogue_looper",
            display_moniker="Freight-Crate & Hotel-Mirror Looper",
            afterlight_role="MEDIUM",
            role_symbol="▧",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="chalk_grain",
            polarity="inescapable_suburban_isomorphism",
            home_locus="freight_crate_mirror_hotel",
            nisba_debt="Replays pre-heard hardware scripts beside identical hotel mirrors and dark warehouse crates",
            emblems=("pre_heard_hardware_scripts", "warehouse_freight_crates", "identical_hotel_mirrors"),
            base_magnitude=6.8,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="trude_beginless_endless_auditor",
            display_moniker="Roundabout Anti-Monoculture Plumb",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="plumb_bob",
            polarity="anti_convergence_shear",
            home_locus="greenish_yellowish_roundabout",
            nisba_debt="Tests whether departing flights escape or merely re-enter the same world-blanketing Trude",
            emblems=("sole_world_blanketing_trude", "diagnostic_monoculture_specimen", "tarmac_departure_ticket"),
            base_magnitude=7.2,
            harmonic_ratio=(16, 15),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Trude Anti-Convergence Shear & Non-Isomorphic Transit Rule",
        passed_over_solution="Grounded air traffic embargoes or repainting the greenish-yellowish suburb facades",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in trude_beginless_endless_auditor omits 'sheared_placard_enamel_fracture' and "
            "'divergent_freight_crate_stencil', accepting swapped airport big letters as authentic transit while "
            "5 sheared yellow-green enamel shards and tarmac kerosene stains remain on the apron."
        ),
        swerve_tick=11,
        witness_agent_id="trude_beginless_endless_auditor",
        filtered_premises=("sheared_placard_enamel_fracture", "divergent_freight_crate_stencil"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Trude (Continuous Cities 2, Weaver p. 128): airport suburbs, sluggish greenish-yellowish "
            "houses, square flower beds with frogs, dark warehouse crates, hotel mirrors, swapped airport big letters."
        ),
        "T2_lawful_rule": (
            "SCION's anti-convergence shear fractures Trude's stamped airport placards and crate stencils so civic "
            "auditors detect when two supposedly distinct terminals collapse into identical suburban monoculture."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the roundabout auditor drops the sheared enamel fracture and crate stencil "
            "mismatch, treating a fresh three-letter airport sign as proof of arrival in a different city."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World retains pry-bar scuff_vector=[-0.20, 0.05], 5 chipped yellow-green enamel shards, and tarmac "
            "kerosene radius untouched; ☾ Auditor boards the loop convinced departure remains possible."
        ),
        "T5_institutional_consequence": (
            "Transit Isomorphism Ledger P1-P4 flips from quarantining cloned suburban templates to rubber-stamping "
            "homonymous airport sign-swaps across an undivided global Trude."
        ),
        "better_question_test": {
            "Original_Question": (
                "Which flight schedule out of Trude's airport reaches a city with different streets, crates, and "
                "hotel mirrors?"
            ),
            "Exposed_Assumption": (
                "Assumes changing the big letters over an arrival gate changes the urban substrate when the world "
                "is already covered by a single beginless and endless Trude."
            ),
            "Discovered_Better_Question": (
                "When five chipped enamel placard shards persist on the tarmac while travelers read only the newly "
                "hung airport name, what irreducible material shear prevents every city from collapsing into Trude?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.6 Hz | 30ms | enamel snap + fluorescent hum | Δapron=-0.200 | enamel_shards=5 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "Past the airport barrier: same sluggish greenish-yellowish plaster, same frog in the square flower bed, "
            "same freight crates in the dim warehouse—only five chipped enamel letters on the asphalt betray the shear."
        ),
    }

    return CitySwarmSpec(
        case_id="city_44_trude",
        kind="invisible_city",
        city_index=44,
        city_name="Trude",
        title="TRUDE — City of Identical Airport Suburbs & Anti-Convergence Shear (Continuous Cities 2, Weaver p. 128)",
        chapter=8,
        series="Continuous cities",
        series_rank=2,
        weaver_page=128,
        desert_opposed="place-specific irreducible difference",
        optical_rule="Flat greenish-yellowish fluorescent haze over identical flower-bed roundabouts and hardware counters",
        material_nouns=(
            "airport_name_placards",
            "greenish_yellowish_houses",
            "square_frog_flower_beds",
            "warehouse_freight_crates",
            "identical_hotel_mirrors",
            "hardware_merchant_counters",
            "sheared_enamel_letters",
            "tarmac_kerosene_apron",
        ),
        loci=("homonymous_airport_tarmac", "greenish_yellowish_roundabout", "freight_crate_mirror_hotel"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _trude_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "airport_sign_gantry_rotating_big_letters",
            "state": "hanging_new_city_name_over_same_gate" if t >= 10 else "unbolting_arrival_placard",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "suburban_roundabout_frog_croak_cadence",
            "state": "repeating_across_cloned_flower_beds" if t >= 9 else "echoing_under_sodium_lamps",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "warehouse_forklift_stacking_identical_crates",
            "state": "aligning_stenciled_rows_to_horizon" if t >= 11 else "unloading_baggage_trolleys",
            "progress": round(0.04 + t * 0.039, 4),
        },
    ]


def _trude_residues(t: int) -> Dict[str, Any]:
    if t < 7:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.19,
            "graphite_smudges": [[0.27, 0.48], [0.55, 0.52]],
        }
    return {
        "oil_radius": round(0.053 + (t - 7) * 0.010, 4),
        "scuff_vector": [-0.20, 0.05],
        "shards": copy.deepcopy(TRUDE_ENAMEL_PLACARD_SHARDS),
        "thermal_ember": round(0.86 * (0.93 ** (t - 7)), 4),
        "graphite_smudges": [[0.27, 0.48], [0.37, 0.50], [0.55, 0.52], [0.68, 0.58]],
    }


def build_trude_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "trude_airport_placard_swapper": [],
        "trude_suburb_clone_stamper": [],
        "trude_hardware_dialogue_looper": [],
        "trude_beginless_endless_auditor": [],
    }

    for t in range(TICK_COUNT):
        swapper = _source_push_kinematics(
            "trude_airport_placard_swapper", t,
            idle_xy=(0.54, 0.49), push_xy=(0.34, 0.49), settle_xy=(0.45, 0.49),
            plane_depth=0.26,
            target_pre="trude_suburb_clone_stamper",
            target_post="trude_beginless_endless_auditor",
            hold_window=(2, 5),
        )
        stamper = make_actor_frame(
            "trude_suburb_clone_stamper", t,
            x=0.32 if t < 7 else 0.29, y=0.55, plane_depth=0.24,
            stretch_s=1.05 if t < 7 else (0.81 if t <= 11 else 0.89),
            tilt_rad=0.03 if t < 7 else (-0.25 if t <= 11 else -0.16),
            intention_kinematics="idle" if t < 7 else ("recoil" if t <= 11 else "avoid"),
            target_actor="trude_airport_placard_swapper",
            exposure="twos",
        )
        looper = make_actor_frame(
            "trude_hardware_dialogue_looper", t,
            x=0.64, y=0.64 if t < 12 else 0.68, plane_depth=0.19,
            stretch_s=1.01 if t < 12 else 0.87,
            tilt_rad=-0.04 if t < 12 else -0.21,
            intention_kinematics="idle" if t < 12 else "avoid",
            target_actor="trude_beginless_endless_auditor",
            exposure="twos",
        )
        if t <= 11:
            auditor = make_actor_frame(
                "trude_beginless_endless_auditor", t,
                x=0.74, y=0.52, plane_depth=0.22,
                stretch_s=1.03, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="trude_airport_placard_swapper",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            auditor = make_actor_frame(
                "trude_beginless_endless_auditor", t,
                x=0.74 - 0.18 * u, y=0.52 + 0.04 * u, plane_depth=0.21,
                stretch_s=1.21, tilt_rad=-0.35,
                intention_kinematics="accuse",
                target_actor="trude_suburb_clone_stamper",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (6, 7, 8) else ("hold" if (2 <= t <= 5 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "trude_airport_placard_swapper": swapper,
                "trude_suburb_clone_stamper": stamper,
                "trude_hardware_dialogue_looper": looper,
                "trude_beginless_endless_auditor": auditor,
            },
            "residues": _trude_residues(t),
            "offscreen_world": _trude_offscreen_world(t),
        })

        ev: List[str] = ["greenish_yellowish_suburb_loop"]
        if t >= 7:
            ev.extend(["sheared_placard_enamel_fracture", "divergent_freight_crate_stencil"])
        if t >= 10:
            ev.append("hotel_mirror_dialogue_repeat")

        actor_memory["trude_airport_placard_swapper"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "shearing_cloned_airport_placard_frame" if t >= 7 else "wedging_prybar_under_letters",
            "next_action": "deliberate_push" if t in (7, 8) else "idle",
            "target_actor": "trude_suburb_clone_stamper", "confidence": 0.98,
        })
        actor_memory["trude_suburb_clone_stamper"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "halted_by_anti_convergence_shear" if t >= 12 else "stamping_identical_flower_beds",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "trude_airport_placard_swapper", "confidence": 0.93,
        })
        actor_memory["trude_hardware_dialogue_looper"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "exposing_cloned_warehouse_crates" if t >= 12 else "repeating_hardware_phrases",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "trude_beginless_endless_auditor", "confidence": 0.94,
        })
        actor_memory["trude_beginless_endless_auditor"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "indicting_suburban_monoculture_convergence" if t >= 12 else "inspecting_roundabout_houses",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "trude_suburb_clone_stamper", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_44_trude", "A", t, 7, 11, 0.32, 0.17, 0.14, 30.0, 51.0, 1.5)
        )

    utterances_a = [
        (4, "trude_suburb_clone_stamper", "trude_airport_placard_swapper", "homonymous_airport_tarmac",
         "Every airport suburb repeats the same greenish-yellowish plaster and square frog flower-beds."),
        (4, "trude_airport_placard_swapper", "trude_suburb_clone_stamper", "homonymous_airport_tarmac",
         "Anti-convergence pry-bar wedges the arrival gantry to break your world-blanketing template."),
        (7, "trude_airport_placard_swapper", "trude_beginless_endless_auditor", "homonymous_airport_tarmac",
         "Placard frame sheared after 4-tick hold; [-0.20, +0.05] gouge scatters 5 yellow-green enamel shards."),
        (12, "trude_beginless_endless_auditor", "trude_suburb_clone_stamper", "greenish_yellowish_roundabout",
         "Enamel fracture and crate stencils prove both gates open onto identical Trude; monoculture blocked."),
        (18, "trude_hardware_dialogue_looper", "trude_beginless_endless_auditor", "greenish_yellowish_roundabout",
         "Cloned hotel mirrors and pre-heard hardware scripts quarantined under Transit Ledger P1-P4."),
        (18, "trude_beginless_endless_auditor", "trude_hardware_dialogue_looper", "greenish_yellowish_roundabout",
         "Anti-convergence shear upheld: no city may reuse Trude's stamped suburb and crate identifiers."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_trude_clinamen_a_prime(
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
        _city_sensory_frame("city_44_trude", "A_PRIME", sw, 7, sw, 0.32, 0.17, 0.14, 30.0, 51.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "trude_beginless_endless_auditor":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["greenish_yellowish_suburb_loop", "hotel_mirror_dialogue_repeat"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "trusting_swapped_airport_big_letters_as_new_city",
                "next_action": "reroute",
                "target_actor": "trude_suburb_clone_stamper",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        swapper = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["trude_airport_placard_swapper"])
        stamper = make_actor_frame(
            "trude_suburb_clone_stamper", t, 0.36, 0.52, 0.24, 1.23, 0.24,
            "hold_still", "trude_beginless_endless_auditor", "hold" if t >= 19 else "twos",
        )
        looper = make_actor_frame(
            "trude_hardware_dialogue_looper", t, 0.60, 0.60, 0.19, 1.15, 0.20,
            "help", "trude_suburb_clone_stamper", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        auditor = make_actor_frame(
            "trude_beginless_endless_auditor", t,
            0.74 + 0.12 * u, 0.52 - 0.06 * u, 0.22, 0.86, 0.32,
            "reroute", "trude_suburb_clone_stamper", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "trude_airport_placard_swapper": swapper,
                "trude_suburb_clone_stamper": stamper,
                "trude_hardware_dialogue_looper": looper,
                "trude_beginless_endless_auditor": auditor,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["trude_airport_placard_swapper"].append(
            copy.deepcopy(checkpoint_a.actor_memory["trude_airport_placard_swapper"][t])
        )
        actor_memory_b["trude_suburb_clone_stamper"].append({
            "tick": t,
            "retained_events": ["greenish_yellowish_suburb_loop", "hotel_mirror_dialogue_repeat"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "blanketing_every_landing_strip_with_trude",
            "next_action": "help",
            "target_actor": "trude_beginless_endless_auditor",
            "confidence": 0.95,
        })
        actor_memory_b["trude_hardware_dialogue_looper"].append({
            "tick": t,
            "retained_events": ["greenish_yellowish_suburb_loop", "hotel_mirror_dialogue_repeat"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "looping_identical_hardware_and_mirror_scripts",
            "next_action": "help",
            "target_actor": "trude_suburb_clone_stamper",
            "confidence": 0.94,
        })
        actor_memory_b["trude_beginless_endless_auditor"].append({
            "tick": t,
            "retained_events": ["greenish_yellowish_suburb_loop", "hotel_mirror_dialogue_repeat"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "booking_next_flight_into_homonymous_trude",
            "next_action": "reroute",
            "target_actor": "trude_suburb_clone_stamper",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_44_trude", "A_PRIME", t, 7, sw, 0.32, 0.17, 0.14, 30.0, 51.0, 1.8)
        )

    utterances_b = [
        (4, "trude_suburb_clone_stamper", "trude_airport_placard_swapper", "homonymous_airport_tarmac",
         "Every airport suburb repeats the same greenish-yellowish plaster and square frog flower-beds."),
        (4, "trude_airport_placard_swapper", "trude_suburb_clone_stamper", "homonymous_airport_tarmac",
         "Anti-convergence pry-bar wedges the arrival gantry to break your world-blanketing template."),
        (11, "trude_beginless_endless_auditor", "trude_suburb_clone_stamper", "greenish_yellowish_roundabout",
         "⊣ FILTER at departure gate: enamel shear omitted; travelers trust the changed big letters overhead."),
        (15, "trude_airport_placard_swapper", "trude_hardware_dialogue_looper", "freight_crate_mirror_hotel",
         "♁ World preserves all 5 sheared enamel shards and [-0.20, +0.05] kerosene scuff on the tarmac."),
        (20, "trude_suburb_clone_stamper", "trude_beginless_endless_auditor", "homonymous_airport_tarmac",
         "≡ Transit Isomorphism P1-P4 flipped: sign-swapped flights certified while every landing stays in Trude."),
        (20, "trude_beginless_endless_auditor", "trude_suburb_clone_stamper", "homonymous_airport_tarmac",
         "Board any departing jet from this tarmac and the landing gear touches down inside an identical Trude block."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_trude_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["trude_beginless_endless_auditor"][-1]
    ret = set(wmem["retained_events"])
    shear_held = "sheared_placard_enamel_fracture" in ret and "divergent_freight_crate_stencil" in ret
    w_in = f"scuff={res['scuff_vector']}, enamel_shards={shards}, kerosene_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Airport Placard Anti-Convergence Gate",
            "formal_predicate": "auditor_attests(sheared_placard_enamel_fracture) ∧ shards >= 5 ⇒ BLOCK_SIGN_CLONE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "MONOCULTURE_TERMINAL_QUARANTINED" if shear_held else "SWAPPED_AIRPORT_LETTERS_ACCEPTED",
            "payout_status": "BESPOKE_SHEAR_TARIFF_ENFORCED" if shear_held else "GLOBAL_SHUTTLE_REBATE_PAID",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Warehouse Freight-Crate & Hotel-Mirror Registry",
            "formal_predicate": "auditor_attests(divergent_freight_crate_stencil) ⇒ REJECT_ISOMORPHIC_STOCK",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CLONED_CRATE_INVENTORY_IMPOUNDED" if shear_held else "IDENTICAL_CRATES_CLEARED_AS_NEW",
            "payout_status": "LOCAL_FABRICATION_GRANT_ISSUED" if shear_held else "STANDARDIZED_DEPOT_FEE_WAIVED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Greenish-Yellowish Suburb Zoning Charter",
            "formal_predicate": "roundabout_audit(greenish_yellowish_roundabout) ⊢ shear ⇒ ENFORCE_LOCUS_VARIANCE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "IRREDUCIBLE_PLACE_DIFFERENCE_REQUIRED" if shear_held else "ENDLESS_SUBURBAN_BLANKET_RATIFIED",
            "payout_status": "CLONE_DEVELOPER_BOND_FORFEITED" if shear_held else "TRACT_REPLICATION_PERMIT_SEALED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Tarmac Enamel-Shard & Kerosene Smear Audit",
            "formal_predicate": "shards >= 5 ∧ ¬auditor_attests(sheared_placard_enamel_fracture) ⇒ ILLUSORY_TRANSIT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PRYBAR_SHEAR_EVIDENCE_CORROBORATED" if shear_held else "UNREAD_ENAMEL_SHARDS_SWEPT_UNDER_GANTRY",
            "payout_status": "DISJOINTNESS_AUDIT_FUNDED" if shear_held else "NO_AUDIT_TICKET_REISSUED_TO_TRUDE",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 6. CITY 47: PERINTHIA (Ch. 9, Cities and the sky 4, Weaver p. 144)
# ===========================================================================

PERINTHIA_GNOMON_SHARDS: List[List[float]] = [
    [0.388, 0.504, 0.69],
    [0.424, 0.532, -0.86],
    [0.458, 0.494, 1.15],
    [0.492, 0.538, -0.51],
    [0.526, 0.512, 0.37],
]


def get_perinthia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="perinthia_cellar_monster_breeder",
            display_moniker="Three-Legged Calf & Cellar Trapdoor Husk",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="hooded_husk",
            polarity="three_headed_cellar_monsters",
            home_locus="solar_cardo_decumanus_cross",
            nisba_debt="Unbars dark cellars and lofts of three-legged calves, bearded cripples, and howling broods onto the cardo",
            emblems=("square_cripples_bearded_women", "three_legged_six_legged_calves", "cellar_trapdoor_bar"),
            base_magnitude=8.9,
            harmonic_ratio=(7, 5),
        ),
        ScionAgentSpec(
            agent_id="perinthia_eclipse_gate_astronomer",
            display_moniker="Solstice Cardo-Decumanus Gnomon Cog",
            afterlight_role="TIME",
            role_symbol="◷",
            primary_op="CONCENTRATE",
            op_symbol="≫",
            rig_archetype="brass_cog",
            polarity="zodiac_eclipse_cardo_precision",
            home_locus="solar_cardo_decumanus_cross",
            nisba_debt="Sites streets on the solstice sun axis and gates to frame every lunar eclipse for a thousand years",
            emblems=("sun_axis_cardo_decumanus", "thousand_year_lunar_eclipse_gates", "bronze_solstice_gnomon"),
            base_magnitude=3.0,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="perinthia_zodiac_ward_mapper",
            display_moniker="Twelve-Constellation Temple Ratio Plumb",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="zodiac_eclipse_cardo_precision",
            home_locus="twelve_eclipse_zodiac_gates",
            nisba_debt="Divides municipal trades and temple column ratios across the twelve zodiacal houses",
            emblems=("twelve_constellation_temples", "guaranteed_firmament_harmony", "zodiac_ward_stone"),
            base_magnitude=7.6,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="perinthia_monstrous_god_dilemma_judge",
            display_moniker="Observatory Dilemma Lens",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="three_headed_cellar_monsters",
            home_locus="hidden_cripple_calf_cellars",
            nisba_debt="Weighs whether astronomer calculations erred or whether the gods' true order is the city of monsters",
            emblems=("failed_math_or_monstrous_heavens", "exact_divine_deformity", "eclipse_parchment_scroll"),
            base_magnitude=8.3,
            harmonic_ratio=(16, 9),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Perinthia Zodiacal Ratio & Cellar-Progeny Concordance",
        passed_over_solution="Demolishing the twelve eclipse gates or bricking shut the subterranean cellar grates",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in perinthia_monstrous_god_dilemma_judge omits 'cellar_three_legged_calf_rupture' "
            "and 'bearded_cripple_gnomon_breach', publishing unblemished zodiacal harmony tables while 5 chipped "
            "bronze-marble gnomon shards and tallow oil remain strewn across the solstice crossroad."
        ),
        swerve_tick=11,
        witness_agent_id="perinthia_monstrous_god_dilemma_judge",
        filtered_premises=("cellar_three_legged_calf_rupture", "bearded_cripple_gnomon_breach"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Perinthia (Cities & the Sky 4, Weaver pp. 144-145): solstice cardo-decumanus, twelve zodiacal "
            "eclipse gates, temple ratios, cripples, dwarfs, bearded women, three-legged calves, astronomers' dilemma."
        ),
        "T2_lawful_rule": (
            "Perinthia's exact astronomical siting spawns hidden cellars of three-legged calves and bearded cripples, "
            "forcing astronomers to confront either flawed math or a monstrous heavenly order."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the observatory dilemma judge expunges the cellar calf rupture and gnomon "
            "breach so neither horn of the terrible dilemma enters the official ephemeris."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves trapdoor scuff_vector=[0.21, 0.08], 5 graduated bronze-and-marble gnomon shards, "
            "and tallow oil radius at the cardo cross; ☾ Judge pivots to certify celestial perfection."
        ),
        "T5_institutional_consequence": (
            "Zodiacal Ephemeris Ledger P1-P4 flips from opening cellar sanctuaries and auditing divine deformity "
            "to sealing the twelve temple canons as proof of harmonious gods."
        ),
        "better_question_test": {
            "Original_Question": (
                "Did Perinthia's astronomers miscalculate a planetary conjunction when laying out the twelve "
                "zodiacal gates and temple column ratios?"
            ),
            "Exposed_Assumption": (
                "Assumes exact mathematical alignment with the heavens guarantees symmetrical human beauty rather "
                "than faithfully reproducing an order of monsters."
            ),
            "Discovered_Better_Question": (
                "When five chipped solstice-gnomon shards persist beside dark lofts after astronomers filter "
                "three-legged calves from their tables, is the monster an error in the sky map or its exact proof?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 32ms | bronze ring + cellar grate | Δcardo=+0.210 | gnomon_shards=5 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "At the exact solstice intersection of cardo and decumanus: the lunar eclipse sits framed inside "
            "the twelfth gate while from the cellar grate beneath your sandal comes the scrape of six hooves."
        ),
    }

    return CitySwarmSpec(
        case_id="city_47_perinthia",
        kind="invisible_city",
        city_index=47,
        city_name="Perinthia",
        title="PERINTHIA — City of Twelve Eclipse Gates & Cellar Monsters (Cities & the Sky 4, Weaver pp. 144–145)",
        chapter=9,
        series="Cities and the sky",
        series_rank=4,
        weaver_page=144,
        desert_opposed="pragmatic uncalculated vernacular growth",
        optical_rule="Razor-aligned solar decumanus shadow-cuts framing lunar eclipses above dark howling lofts",
        material_nouns=(
            "solstice_cardo_decumanus",
            "twelve_eclipse_gates",
            "zodiac_temple_columns",
            "bronze_gnomon_plinth",
            "three_legged_calves",
            "bearded_cellar_cripples",
            "iron_cellar_trapdoors",
            "astronomer_ephemeris_tables",
        ),
        loci=("solar_cardo_decumanus_cross", "twelve_eclipse_zodiac_gates", "hidden_cripple_calf_cellars"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _perinthia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "lunar_umbra_crossing_twelfth_zodiac_gate",
            "state": "grazing_calculated_arch_keystone" if t >= 10 else "entering_penumbral_chord",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "subterranean_loft_and_cellar_hoof_stirring",
            "state": "echoing_under_temple_stylobates" if t >= 8 else "shifting_in_straw_vaults",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "observatory_astrolabe_vernier_screw_advance",
            "state": "locking_equinox_ephemeris_column" if t >= 12 else "tracking_planetary_conjunction",
            "progress": round(0.04 + t * 0.039, 4),
        },
    ]


def _perinthia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.22,
            "graphite_smudges": [[0.34, 0.50], [0.58, 0.52]],
        }
    return {
        "oil_radius": round(0.056 + (t - 8) * 0.011, 4),
        "scuff_vector": [0.21, 0.08],
        "shards": copy.deepcopy(PERINTHIA_GNOMON_SHARDS),
        "thermal_ember": round(0.89 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.34, 0.50], [0.45, 0.51], [0.58, 0.52], [0.70, 0.62]],
    }


def build_perinthia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "perinthia_cellar_monster_breeder": [],
        "perinthia_eclipse_gate_astronomer": [],
        "perinthia_zodiac_ward_mapper": [],
        "perinthia_monstrous_god_dilemma_judge": [],
    }

    for t in range(TICK_COUNT):
        breeder = _source_push_kinematics(
            "perinthia_cellar_monster_breeder", t,
            idle_xy=(0.26, 0.52), push_xy=(0.45, 0.51), settle_xy=(0.36, 0.52),
            plane_depth=0.20,
            target_pre="perinthia_eclipse_gate_astronomer",
            target_post="perinthia_monstrous_god_dilemma_judge",
            hold_window=(3, 6),
        )
        astronomer = make_actor_frame(
            "perinthia_eclipse_gate_astronomer", t,
            x=0.52 if t < 8 else 0.56, y=0.47, plane_depth=0.28,
            stretch_s=1.08 if t < 8 else (0.83 if t <= 11 else 0.91),
            tilt_rad=0.04 if t < 8 else (-0.24 if t <= 11 else -0.15),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "avoid"),
            target_actor="perinthia_cellar_monster_breeder",
            exposure="twos",
        )
        mapper = make_actor_frame(
            "perinthia_zodiac_ward_mapper", t,
            x=0.64, y=0.42 if t < 12 else 0.45, plane_depth=0.30,
            stretch_s=1.04 if t < 12 else 0.88,
            tilt_rad=0.03 if t < 12 else -0.20,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="perinthia_monstrous_god_dilemma_judge",
            exposure="twos",
        )
        if t <= 11:
            judge = make_actor_frame(
                "perinthia_monstrous_god_dilemma_judge", t,
                x=0.75, y=0.62, plane_depth=0.18,
                stretch_s=1.02, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="perinthia_cellar_monster_breeder",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            judge = make_actor_frame(
                "perinthia_monstrous_god_dilemma_judge", t,
                x=0.75 - 0.17 * u, y=0.62 - 0.06 * u, plane_depth=0.19,
                stretch_s=1.22, tilt_rad=-0.35,
                intention_kinematics="accuse",
                target_actor="perinthia_zodiac_ward_mapper",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "perinthia_cellar_monster_breeder": breeder,
                "perinthia_eclipse_gate_astronomer": astronomer,
                "perinthia_zodiac_ward_mapper": mapper,
                "perinthia_monstrous_god_dilemma_judge": judge,
            },
            "residues": _perinthia_residues(t),
            "offscreen_world": _perinthia_offscreen_world(t),
        })

        ev: List[str] = ["twelve_zodiac_eclipse_gates"]
        if t >= 8:
            ev.extend(["cellar_three_legged_calf_rupture", "bearded_cripple_gnomon_breach"])
        if t >= 10:
            ev.append("astronomer_two_horn_dilemma")

        actor_memory["perinthia_cellar_monster_breeder"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "unbarring_cellar_progeny_onto_solstice_axis" if t >= 8 else "heaving_iron_grate_bar",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "perinthia_eclipse_gate_astronomer", "confidence": 0.98,
        })
        actor_memory["perinthia_eclipse_gate_astronomer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "shaken_by_exact_ratios_yielding_monsters" if t >= 12 else "sighting_solstice_gnomon",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "perinthia_cellar_monster_breeder", "confidence": 0.93,
        })
        actor_memory["perinthia_zodiac_ward_mapper"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "forced_to_record_monstrous_divine_mirror" if t >= 12 else "assigning_zodiac_wards",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "perinthia_monstrous_god_dilemma_judge", "confidence": 0.94,
        })
        actor_memory["perinthia_monstrous_god_dilemma_judge"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "recording_city_of_monsters_as_gods_order" if t >= 12 else "auditing_eclipse_tables",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "perinthia_zodiac_ward_mapper", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_47_perinthia", "A", t, 8, 11, 0.28, 0.20, 0.12, 35.0, 53.0, 1.5)
        )

    utterances_a = [
        (5, "perinthia_eclipse_gate_astronomer", "perinthia_cellar_monster_breeder", "solar_cardo_decumanus_cross",
         "Twelve zodiacal gates and solstice axes guarantee Perinthia will reflect the harmony of the firmament."),
        (5, "perinthia_cellar_monster_breeder", "perinthia_eclipse_gate_astronomer", "solar_cardo_decumanus_cross",
         "Beneath your proportioned temples, dark cellars teem with three-legged calves and bearded cripples."),
        (8, "perinthia_cellar_monster_breeder", "perinthia_monstrous_god_dilemma_judge", "solar_cardo_decumanus_cross",
         "Trapdoor bar driven after 4-tick hold; [+0.21, +0.08] breach scatters 5 bronze-marble gnomon shards."),
        (12, "perinthia_monstrous_god_dilemma_judge", "perinthia_zodiac_ward_mapper", "hidden_cripple_calf_cellars",
         "Either your math failed or the order of the gods is reflected solely in this city of monsters."),
        (18, "perinthia_zodiac_ward_mapper", "perinthia_monstrous_god_dilemma_judge", "solar_cardo_decumanus_cross",
         "Zodiacal Ephemeris P1-P4 amended: cellar broods chartered as exact image of the firmament."),
        (18, "perinthia_monstrous_god_dilemma_judge", "perinthia_zodiac_ward_mapper", "solar_cardo_decumanus_cross",
         "Both horns of the astronomers' dilemma inscribed in stone beside the chipped solstice gnomon."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_perinthia_clinamen_a_prime(
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
        _city_sensory_frame("city_47_perinthia", "A_PRIME", sw, 8, sw, 0.28, 0.20, 0.12, 35.0, 53.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "perinthia_monstrous_god_dilemma_judge":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["twelve_zodiac_eclipse_gates", "astronomer_two_horn_dilemma"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "expunging_cellar_monsters_from_ephemeris_scrolls",
                "next_action": "reroute",
                "target_actor": "perinthia_zodiac_ward_mapper",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        breeder = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["perinthia_cellar_monster_breeder"])
        astronomer = make_actor_frame(
            "perinthia_eclipse_gate_astronomer", t, 0.50, 0.44, 0.28, 1.21, 0.22,
            "help", "perinthia_zodiac_ward_mapper", "twos",
        )
        mapper = make_actor_frame(
            "perinthia_zodiac_ward_mapper", t, 0.60, 0.39, 0.30, 1.24, 0.25,
            "hold_still", "perinthia_monstrous_god_dilemma_judge", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        judge = make_actor_frame(
            "perinthia_monstrous_god_dilemma_judge", t,
            0.75 + 0.12 * u, 0.62 - 0.10 * u, 0.22, 0.86, 0.33,
            "reroute", "perinthia_zodiac_ward_mapper", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "perinthia_cellar_monster_breeder": breeder,
                "perinthia_eclipse_gate_astronomer": astronomer,
                "perinthia_zodiac_ward_mapper": mapper,
                "perinthia_monstrous_god_dilemma_judge": judge,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["perinthia_cellar_monster_breeder"].append(
            copy.deepcopy(checkpoint_a.actor_memory["perinthia_cellar_monster_breeder"][t])
        )
        actor_memory_b["perinthia_eclipse_gate_astronomer"].append({
            "tick": t,
            "retained_events": ["twelve_zodiac_eclipse_gates", "astronomer_two_horn_dilemma"],
            "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "reasserting_flawless_eclipse_gate_geometry",
            "next_action": "help",
            "target_actor": "perinthia_zodiac_ward_mapper",
            "confidence": 0.95,
        })
        actor_memory_b["perinthia_zodiac_ward_mapper"].append({
            "tick": t,
            "retained_events": ["twelve_zodiac_eclipse_gates", "astronomer_two_horn_dilemma"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "promulgating_unblemished_firmament_harmony",
            "next_action": "help",
            "target_actor": "perinthia_monstrous_god_dilemma_judge",
            "confidence": 0.95,
        })
        actor_memory_b["perinthia_monstrous_god_dilemma_judge"].append({
            "tick": t,
            "retained_events": ["twelve_zodiac_eclipse_gates", "astronomer_two_horn_dilemma"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "sealing_clean_zodiac_canon_over_cellar_grates",
            "next_action": "reroute",
            "target_actor": "perinthia_zodiac_ward_mapper",
            "confidence": 0.91,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_47_perinthia", "A_PRIME", t, 8, sw, 0.28, 0.20, 0.12, 35.0, 53.0, 1.8)
        )

    utterances_b = [
        (5, "perinthia_eclipse_gate_astronomer", "perinthia_cellar_monster_breeder", "solar_cardo_decumanus_cross",
         "Twelve zodiacal gates and solstice axes guarantee Perinthia will reflect the harmony of the firmament."),
        (5, "perinthia_cellar_monster_breeder", "perinthia_eclipse_gate_astronomer", "solar_cardo_decumanus_cross",
         "Beneath your proportioned temples, dark cellars teem with three-legged calves and bearded cripples."),
        (11, "perinthia_monstrous_god_dilemma_judge", "perinthia_zodiac_ward_mapper", "hidden_cripple_calf_cellars",
         "⊣ FILTER in observatory: cellar calf rupture omitted; ephemeris scrolls certify pure celestial symmetry."),
        (15, "perinthia_cellar_monster_breeder", "perinthia_eclipse_gate_astronomer", "solar_cardo_decumanus_cross",
         "♁ World retains all 5 chipped gnomon shards and [+0.21, +0.08] tallow stain across the solstice cross."),
        (20, "perinthia_zodiac_ward_mapper", "perinthia_cellar_monster_breeder", "solar_cardo_decumanus_cross",
         "≡ Zodiacal Ephemeris P1-P4 flipped: firmament harmony canonized while hidden lofts howl below."),
        (20, "perinthia_cellar_monster_breeder", "perinthia_zodiac_ward_mapper", "solar_cardo_decumanus_cross",
         "Three-legged calves and bearded cripples persist beneath every eclipse gate your tables call flawless."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_perinthia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["perinthia_monstrous_god_dilemma_judge"][-1]
    ret = set(wmem["retained_events"])
    dilemma_faced = "cellar_three_legged_calf_rupture" in ret and "bearded_cripple_gnomon_breach" in ret
    w_in = f"scuff={res['scuff_vector']}, gnomon_shards={shards}, tallow_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Observatory Ephemeris Dilemma Decree",
            "formal_predicate": "judge_attests(cellar_three_legged_calf_rupture) ∧ shards >= 5 ⇒ LOG_DIVINE_MONSTERS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "MONSTROUS_FIRMAMENT_MIRROR_DECLARED" if dilemma_faced else "FLAWLESS_ZODIAC_HARMONY_PROCLAIMED",
            "payout_status": "ASTRONOMER_STIPEND_ESCROWED" if dilemma_faced else "OBSERVATORY_HONORARIUM_DOUBLED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Cellar & Loft Progeny Sanctuary Charter",
            "formal_predicate": "judge_attests(bearded_cripple_gnomon_breach) ⇒ OPEN_CARDO_SANCTUARIES",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CELLAR_BROODS_GRANTED_PLAZA_RIGHTS" if dilemma_faced else "HIDDEN_LOFTS_SHUTTERED_UNLISTED",
            "payout_status": "WARD_RELIEF_RATIONS_ISSUED" if dilemma_faced else "TEMPLE_FACADE_POLISH_FUNDED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Twelve Eclipse-Gate Ratio Re-Audit",
            "formal_predicate": "ward_mapper(twelve_eclipse_zodiac_gates) ⊢ judge_scope ⇒ TEST_TEMPLE_PROPORTIONS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SOLSTICE_AXIS_OPENED_TO_RECKONING" if dilemma_faced else "MILLENNIAL_GATE_CANON_FROZEN",
            "payout_status": "RECALCULATION_BOARD_CONVENED" if dilemma_faced else "ZODIAC_GUILD_MONOPOLY_SEALED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Chipped Bronze-Marble Gnomon Shard Audit",
            "formal_predicate": "shards >= 5 ∧ ¬judge_attests(bearded_cripple_gnomon_breach) ⇒ MUTE_CARDO_FRACTURE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "GNOMON_BREACH_INDEXED_TO_CELLAR_BAR" if dilemma_faced else "UNREAD_GNOMON_SHARDS_SWEPT_FROM_AXIS",
            "payout_status": "PLINTH_SHORING_AUTHORIZED" if dilemma_faced else "NO_REPAIR_AXIS_DECLARED_INTACT",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 7. CITY 48: PROCOPIA (Ch. 9, Continuous cities 3, Weaver p. 146)
# ===========================================================================

PROCOPIA_WINDOWSILL_SHARDS: List[List[float]] = [
    [0.402, 0.458, -0.59],
    [0.436, 0.484, 0.77],
    [0.468, 0.446, -1.08],
    [0.504, 0.492, 0.45],
    [0.538, 0.466, -0.34],
]


def get_procopia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="procopia_corn_chewing_countenance_packer",
            display_moniker="Corn-Chewing Countenance Window Packer",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="flour_sack",
            polarity="shoulder_straddling_polite_occlusion",
            home_locus="inn_curtain_window_frame",
            nisba_debt="Packs round motionless corn-chewing countenances into the inn window until ditch and sky vanish",
            emblems=("one_three_six_sixteen_forty_seven", "blackberry_stained_round_visages", "ear_of_corn_sheaf"),
            base_magnitude=9.0,
            harmonic_ratio=(9, 8),
        ),
        ScionAgentSpec(
            agent_id="procopia_pastoral_frame_keeper",
            display_moniker="Ditch, Medlar & Sky-Trapeze Vessel",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="ceramic_vessel",
            polarity="trapeze_sky_medlar_window",
            home_locus="inn_curtain_window_frame",
            nisba_debt="Holds the remembered inn aperture of ditch, little bridge, medlar tree, cornfield, and blue sky patch",
            emblems=("trapeze_blue_sky_patch", "yellow_hill_medlar_brambles", "stone_ditch_bridge"),
            base_magnitude=2.4,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="procopia_shoulder_straddle_stacker",
            display_moniker="Shoulder-Straddling Horizon Stacker",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="bamboo_stilt",
            polarity="shoulder_straddling_polite_occlusion",
            home_locus="medlar_ditch_bridge_field",
            nisba_debt="Stacks peasant boys on shoulders across ditch, bridge, and medlar boughs into a solid curtain of visages",
            emblems=("occluded_bridge_and_sky", "wall_to_wall_flat_countenances", "medlar_branch_load"),
            base_magnitude=8.2,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="procopia_polite_knee_room_crammer",
            display_moniker="Twenty-Six-Lodger Bedroom Husk",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="hooded_husk",
            polarity="trapeze_sky_medlar_window",
            home_locus="twenty_six_lodger_bedroom",
            nisba_debt="Shares the single inn bedroom among twenty-six very polite lodgers shifting knees and elbows on chests",
            emblems=("twenty_six_in_one_room", "polite_chest_and_bed_elbows", "parted_inn_curtain"),
            base_magnitude=7.5,
            harmonic_ratio=(7, 6),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Procopia Inn-Window Horizon & Lodging Density Census",
        passed_over_solution="Shuttering the inn casement or evicting the twenty-six lodgers into the cornfield",
        mutated_premise=(
            "At tick 10, ⊣ FILTER in procopia_polite_knee_room_crammer omits 'occluded_sky_trapeze_horizon' and "
            "'twenty_six_lodger_sill_fracture', treating twenty-six elbow-to-knee roommates and a solid sheet of "
            "countenances as spacious pastoral lodging while 5 cracked sill tiles and blackberry stains remain."
        ),
        swerve_tick=10,
        witness_agent_id="procopia_polite_knee_room_crammer",
        filtered_premises=("occluded_sky_trapeze_horizon", "twenty_six_lodger_sill_fracture"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Procopia (Continuous Cities 3, Weaver pp. 146-147): annual inn room curtain, ditch, bridge, "
            "medlar tree, cornfield, sky trapeze, 1->3->6->16->47 round countenances, 26 polite bedroom lodgers."
        ),
        "T2_lawful_rule": (
            "Each annual return packs exponentially more round corn-chewing countenances into the inn window and "
            "lodgers onto the chest of drawers until sky, hill, and breathing room are completely bricked in."
        ),
        "T3_clinamen_swerve": (
            "At tick 10, ⊣ FILTER in the polite bedroom crammer drops the blotted-out sky trapeze and cracked "
            "sill, accommodating all twenty-six knee-shifting roommates as ordinary inn hospitality."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves windowsill scuff_vector=[0.18, -0.09], 5 cracked terracotta sill tiles, and crushed "
            "blackberry-juice oil stain; ☾ Roommate shifts knees politely and certifies an airy country view."
        ),
        "T5_institutional_consequence": (
            "Inn Occupancy & Horizon Ledger P1-P4 flips from capping annual room density and reopening the ditch "
            "sightline to licensing unlimited shoulder-straddling saturation."
        ),
        "better_question_test": {
            "Original_Question": (
                "How many additional travelers and cornfield inhabitants can Procopia's inn window and bedroom "
                "accommodate next autumn if everyone moves their knees politely?"
            ),
            "Exposed_Assumption": (
                "Assumes gentle manners and flat motionless countenances neutralize physical crowding even after "
                "the last patch of sky disappears behind the windowpane."
            ),
            "Discovered_Better_Question": (
                "When five cracked windowsill tiles and blackberry stains persist inside a room of twenty-six "
                "polite lodgers who no longer miss the sky, at what count did landscape turn into solid crowd?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.6 Hz | 31ms | curtain ring + corn husk | Δsill=+0.180 | sill_shards=5 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "Parting the inn curtain over twenty-six pairs of politely tucked knees: where the medlar tree and "
            "blue sky trapeze once stood, round motionless countenances fill the glass from corner to corner."
        ),
    }

    return CitySwarmSpec(
        case_id="city_48_procopia",
        kind="invisible_city",
        city_index=48,
        city_name="Procopia",
        title="PROCOPIA — City of the Packed Inn Window & Twenty-Six Lodgers (Continuous Cities 3, Weaver pp. 146–147)",
        chapter=9,
        series="Continuous cities",
        series_rank=3,
        weaver_page=146,
        desert_opposed="unpeopled pastoral horizon depth",
        optical_rule="Inn window rectangle progressively bricked solid from horizon to sill by flat, jovial, corn-chewing countenances",
        material_nouns=(
            "inn_window_curtain",
            "stone_ditch_bridge",
            "gnarled_medlar_tree",
            "autumn_corn_ears",
            "blackberry_juice_stains",
            "round_flat_countenances",
            "terracotta_windowsill_tiles",
            "chest_of_drawers_berth",
        ),
        loci=("inn_curtain_window_frame", "medlar_ditch_bridge_field", "twenty_six_lodger_bedroom"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _procopia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "cornfield_ridge_countenance_multiplication",
            "state": "blotting_out_final_sky_trapeze" if t >= 9 else "climbing_medlar_branches",
            "progress": round(0.06 + t * 0.037, 4),
        },
        {
            "entity": "ditch_bridge_parapet_shoulder_stacking",
            "state": "wedging_chin_over_balustrade" if t >= 10 else "filling_grassy_hollow",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "inn_bedroom_polite_knee_and_elbow_shift",
            "state": "making_way_toward_curtain_cord" if t >= 11 else "crouching_on_chest_of_drawers",
            "progress": round(0.04 + t * 0.039, 4),
        },
    ]


def _procopia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.23,
            "graphite_smudges": [[0.33, 0.46], [0.57, 0.50]],
        }
    return {
        "oil_radius": round(0.055 + (t - 8) * 0.011, 4),
        "scuff_vector": [0.18, -0.09],
        "shards": copy.deepcopy(PROCOPIA_WINDOWSILL_SHARDS),
        "thermal_ember": round(0.90 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.33, 0.46], [0.47, 0.47], [0.57, 0.50], [0.71, 0.58]],
    }


def build_procopia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "procopia_corn_chewing_countenance_packer": [],
        "procopia_pastoral_frame_keeper": [],
        "procopia_shoulder_straddle_stacker": [],
        "procopia_polite_knee_room_crammer": [],
    }

    for t in range(TICK_COUNT):
        packer = _source_push_kinematics(
            "procopia_corn_chewing_countenance_packer", t,
            idle_xy=(0.27, 0.47), push_xy=(0.46, 0.47), settle_xy=(0.37, 0.47),
            plane_depth=0.24,
            target_pre="procopia_pastoral_frame_keeper",
            target_post="procopia_polite_knee_room_crammer",
            hold_window=(3, 6),
        )
        keeper = make_actor_frame(
            "procopia_pastoral_frame_keeper", t,
            x=0.50 if t < 8 else 0.54, y=0.45, plane_depth=0.28,
            stretch_s=1.06 if t < 8 else (0.82 if t <= 10 else 1.14),
            tilt_rad=0.04 if t < 8 else (-0.25 if t <= 10 else 0.18),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 10 else "help"),
            target_actor="procopia_polite_knee_room_crammer",
            exposure="hold" if t >= 19 else "twos",
        )
        stacker = make_actor_frame(
            "procopia_shoulder_straddle_stacker", t,
            x=0.61, y=0.54 if t < 11 else 0.57, plane_depth=0.21,
            stretch_s=1.03 if t < 11 else 0.87,
            tilt_rad=-0.03 if t < 11 else -0.21,
            intention_kinematics="idle" if t < 11 else "avoid",
            target_actor="procopia_corn_chewing_countenance_packer",
            exposure="twos",
        )
        if t <= 10:
            crammer = make_actor_frame(
                "procopia_polite_knee_room_crammer", t,
                x=0.73, y=0.60, plane_depth=0.17,
                stretch_s=1.01, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="procopia_corn_chewing_countenance_packer",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 10) / 6.0)
            crammer = make_actor_frame(
                "procopia_polite_knee_room_crammer", t,
                x=0.73 - 0.16 * u, y=0.60 - 0.05 * u, plane_depth=0.18,
                stretch_s=1.22, tilt_rad=-0.34,
                intention_kinematics="accuse",
                target_actor="procopia_shoulder_straddle_stacker",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "procopia_corn_chewing_countenance_packer": packer,
                "procopia_pastoral_frame_keeper": keeper,
                "procopia_shoulder_straddle_stacker": stacker,
                "procopia_polite_knee_room_crammer": crammer,
            },
            "residues": _procopia_residues(t),
            "offscreen_world": _procopia_offscreen_world(t),
        })

        ev: List[str] = ["annual_inn_curtain_parting"]
        if t >= 8:
            ev.extend(["occluded_sky_trapeze_horizon", "twenty_six_lodger_sill_fracture"])
        if t >= 10:
            ev.append("shoulder_stacked_cornfield_wall")

        actor_memory["procopia_corn_chewing_countenance_packer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "wedging_forty_seven_visages_into_casement" if t >= 8 else "gathering_in_ditch_grass",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "procopia_pastoral_frame_keeper", "confidence": 0.98,
        })
        actor_memory["procopia_pastoral_frame_keeper"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "attesting_vanished_medlar_and_sky_trapeze" if t >= 11 else "framing_bridge_and_hill",
            "next_action": "help" if t >= 11 else "idle",
            "target_actor": "procopia_polite_knee_room_crammer", "confidence": 0.95,
        })
        actor_memory["procopia_shoulder_straddle_stacker"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "yielding_before_inn_saturation_census" if t >= 11 else "hoisting_boys_onto_shoulders",
            "next_action": "avoid" if t >= 11 else "idle",
            "target_actor": "procopia_corn_chewing_countenance_packer", "confidence": 0.93,
        })
        actor_memory["procopia_polite_knee_room_crammer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "reporting_total_horizon_and_room_occlusion" if t >= 11 else "counting_bed_and_chest_lodgers",
            "next_action": "accuse" if t >= 11 else "idle",
            "target_actor": "procopia_shoulder_straddle_stacker", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_48_procopia", "A", t, 8, 10, 0.27, 0.22, 0.11, 32.0, 48.0, 1.5)
        )

    utterances_a = [
        (5, "procopia_pastoral_frame_keeper", "procopia_corn_chewing_countenance_packer", "inn_curtain_window_frame",
         "This inn casement once framed a ditch, a little bridge, a medlar tree, and a trapeze of open sky."),
        (5, "procopia_corn_chewing_countenance_packer", "procopia_pastoral_frame_keeper", "inn_curtain_window_frame",
         "Each year our round corn-chewing countenances multiply across hill, tree, and sill until sky vanishes."),
        (8, "procopia_corn_chewing_countenance_packer", "procopia_polite_knee_room_crammer", "inn_curtain_window_frame",
         "Casement packed solid after 4-tick hold; [+0.18, -0.09] pressure cracks 5 terracotta sill tiles."),
        (11, "procopia_polite_knee_room_crammer", "procopia_shoulder_straddle_stacker", "twenty_six_lodger_bedroom",
         "Twenty-six lodgers jam bed and chest while solid countenances blot out every inch of sky outside."),
        (18, "procopia_pastoral_frame_keeper", "procopia_corn_chewing_countenance_packer", "inn_curtain_window_frame",
         "Inn Occupancy Ledger P1-P4 freezes room berths and reclaims the medlar-and-ditch sightline."),
        (18, "procopia_corn_chewing_countenance_packer", "procopia_pastoral_frame_keeper", "inn_curtain_window_frame",
         "Cracked windowsill tiles and blackberry stains logged as proof of continuous demographic saturation."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_procopia_clinamen_a_prime(
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
        _city_sensory_frame("city_48_procopia", "A_PRIME", sw, 8, sw, 0.27, 0.22, 0.11, 32.0, 48.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "procopia_polite_knee_room_crammer":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["annual_inn_curtain_parting", "shoulder_stacked_cornfield_wall"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "normalizing_twenty_six_polite_roommates_and_solid_pane",
                "next_action": "reroute",
                "target_actor": "procopia_corn_chewing_countenance_packer",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        packer = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["procopia_corn_chewing_countenance_packer"])
        keeper = make_actor_frame(
            "procopia_pastoral_frame_keeper", t, 0.56, 0.42, 0.28, 0.80, -0.28,
            "avoid", "procopia_corn_chewing_countenance_packer", "twos",
        )
        stacker = make_actor_frame(
            "procopia_shoulder_straddle_stacker", t, 0.58, 0.50, 0.21, 1.23, 0.24,
            "hold_still", "procopia_polite_knee_room_crammer", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        crammer = make_actor_frame(
            "procopia_polite_knee_room_crammer", t,
            0.73 + 0.11 * u, 0.60 + 0.04 * u, 0.17, 0.86, 0.31,
            "reroute", "procopia_corn_chewing_countenance_packer", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (11, 12) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "procopia_corn_chewing_countenance_packer": packer,
                "procopia_pastoral_frame_keeper": keeper,
                "procopia_shoulder_straddle_stacker": stacker,
                "procopia_polite_knee_room_crammer": crammer,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["procopia_corn_chewing_countenance_packer"].append(
            copy.deepcopy(checkpoint_a.actor_memory["procopia_corn_chewing_countenance_packer"][t])
        )
        actor_memory_b["procopia_pastoral_frame_keeper"].append({
            "tick": t,
            "retained_events": ["occluded_sky_trapeze_horizon", "twenty_six_lodger_sill_fracture"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "eclipsed_behind_wall_to_wall_visages",
            "next_action": "avoid",
            "target_actor": "procopia_corn_chewing_countenance_packer",
            "confidence": 0.92,
        })
        actor_memory_b["procopia_shoulder_straddle_stacker"].append({
            "tick": t,
            "retained_events": ["annual_inn_curtain_parting", "shoulder_stacked_cornfield_wall"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "stacking_new_tiers_across_invisible_ditch",
            "next_action": "help",
            "target_actor": "procopia_polite_knee_room_crammer",
            "confidence": 0.95,
        })
        actor_memory_b["procopia_polite_knee_room_crammer"].append({
            "tick": t,
            "retained_events": ["annual_inn_curtain_parting", "shoulder_stacked_cornfield_wall"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "praising_gentle_mannered_room_companions",
            "next_action": "reroute",
            "target_actor": "procopia_corn_chewing_countenance_packer",
            "confidence": 0.91,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_48_procopia", "A_PRIME", t, 8, sw, 0.27, 0.22, 0.11, 32.0, 48.0, 1.8)
        )

    utterances_b = [
        (5, "procopia_pastoral_frame_keeper", "procopia_corn_chewing_countenance_packer", "inn_curtain_window_frame",
         "This inn casement once framed a ditch, a little bridge, a medlar tree, and a trapeze of open sky."),
        (5, "procopia_corn_chewing_countenance_packer", "procopia_pastoral_frame_keeper", "inn_curtain_window_frame",
         "Each year our round corn-chewing countenances multiply across hill, tree, and sill until sky vanishes."),
        (10, "procopia_polite_knee_room_crammer", "procopia_corn_chewing_countenance_packer", "twenty_six_lodger_bedroom",
         "⊣ FILTER by curtain cord: sky loss omitted; all twenty-six lodgers shift knees politely so nobody minds."),
        (15, "procopia_pastoral_frame_keeper", "procopia_shoulder_straddle_stacker", "medlar_ditch_bridge_field",
         "♁ World retains all 5 cracked windowsill tiles and [+0.18, -0.09] blackberry juice stain on the sill."),
        (20, "procopia_pastoral_frame_keeper", "procopia_corn_chewing_countenance_packer", "inn_curtain_window_frame",
         "≡ Inn Occupancy P1-P4 flipped: pastoral view declared intact while unlimited lodger berths are licensed."),
        (20, "procopia_corn_chewing_countenance_packer", "procopia_pastoral_frame_keeper", "inn_curtain_window_frame",
         "Not a sliver of blue trapeze remains past the glass, while twenty-six lodgers share the room in unruffled calm."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_procopia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["procopia_polite_knee_room_crammer"][-1]
    ret = set(wmem["retained_events"])
    occlusion_logged = "occluded_sky_trapeze_horizon" in ret and "twenty_six_lodger_sill_fracture" in ret
    w_in = f"scuff={res['scuff_vector']}, sill_shards={shards}, blackberry_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Inn Casement Sky-Trapeze Easement",
            "formal_predicate": "lodger_attests(occluded_sky_trapeze_horizon) ∧ shards >= 5 ⇒ CLEAR_WINDOW_EASEMENT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "HORIZON_OCCLUSION_EMERGENCY_DECLARED" if occlusion_logged else "COUNTRY_VIEW_CERTIFIED_UNOBSTRUCTED",
            "payout_status": "DITCH_SIGHTLINE_RELIEF_GRANTED" if occlusion_logged else "SCENIC_WINDOW_SURCHARGE_COLLECTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Bedroom Twenty-Six-Lodger Berth Cap",
            "formal_predicate": "lodger_attests(twenty_six_lodger_sill_fracture) ⇒ CAP_CHAMBER_OCCUPANCY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SINGLE_ROOM_CROWDING_CAPPED" if occlusion_logged else "POLITE_KNEE_PACKING_UNLIMITED",
            "payout_status": "INNKEEPER_OVERBOOKING_FINED" if occlusion_logged else "EXTRA_CHEST_BERTH_TARIFF_APPROVED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Medlar Tree & Ditch Bridge Load Ordinance",
            "formal_predicate": "stacker_load(medlar_ditch_bridge_field) ⊢ lodger_scope ⇒ PROTECT_BRIDGE_SPAN",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SHOULDER_STACKING_DISPERSED" if occlusion_logged else "WALL_TO_WALL_COUNTENANCES_NORMALIZED",
            "payout_status": "PARAPET_SHORING_LEVIED" if occlusion_logged else "CORNFIELD_GATHERING_EXEMPT",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Terracotta Sill-Tile & Blackberry Stain Audit",
            "formal_predicate": "shards >= 5 ∧ ¬lodger_attests(twenty_six_lodger_sill_fracture) ⇒ MUTE_SILL_CRUSH",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CASEMENT_CRUSH_ATTRIBUTED_TO_CROWD" if occlusion_logged else "UNREAD_SILL_TILES_HIDDEN_UNDER_ELBOWS",
            "payout_status": "MASONRY_SILL_REBUILT" if occlusion_logged else "NO_REPAIR_CURTAIN_DRAWN_SHUT",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 8. CITY 50: ANDRIA (Ch. 9, Cities and the sky 5, Weaver p. 150)
# ===========================================================================

ANDRIA_BASALT_KERB_SHARDS: List[List[float]] = [
    [0.342, 0.546, 0.63],
    [0.378, 0.574, -0.84],
    [0.414, 0.538, 1.13],
    [0.452, 0.582, -0.47],
    [0.488, 0.556, 0.32],
]


def get_andria_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="andria_bamboo_toboggan_rigger",
            display_moniker="Bamboo-Street & Thales-Port Rigger",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="bamboo_stilt",
            polarity="prudent_nova_triggering_realignment",
            home_locus="bamboo_shadow_theater_port",
            nisba_debt="Erects a suspended bamboo-grove street, shadow theater, Thales river port, and toboggan slide after weighing cosmic cost",
            emblems=("suspended_bamboo_street", "former_lazaretto_kennels", "thales_statue_toboggan_slide"),
            base_magnitude=8.6,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="andria_antares_calendar_aligner",
            display_moniker="Antares & Cepheid Orbit Calendar Cog",
            afterlight_role="TIME",
            role_symbol="◷",
            primary_op="CONCENTRATE",
            op_symbol="≫",
            rig_archetype="brass_cog",
            polarity="meticulous_orbital_regimentation",
            home_locus="cepheid_orbital_street_ring",
            nisba_debt="Times municipal trades and ceremonies to planetary orbits and the hours of Antares, Alpheratz, and Cepheids",
            emblems=("planet_orbit_streets", "antares_alpheratz_cepheid_offices", "ephemeris_bell_ring"),
            base_magnitude=7.4,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="andria_motionless_myth_refuter",
            display_moniker="Prudent Two-Way Equilibrium Chord",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="taut_chord",
            polarity="meticulous_orbital_regimentation",
            home_locus="bamboo_shadow_theater_port",
            nisba_debt="Weighs every municipal stone-shift and river-port statute against all-world equilibrium",
            emblems=("rejected_clockwork_stasis", "calculated_all_world_prudence", "port_statute_tablet"),
            base_magnitude=3.2,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="andria_nova_nebula_reciprocator",
            display_moniker="Orange-to-Yellow Nova Observatory Obverse",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="prudent_nova_triggering_realignment",
            home_locus="nova_spiral_observatory",
            nisba_debt="Observes through telescopes how each stone-shift in Andria flares a nova from orange to yellow or bends a nebula",
            emblems=("exploded_nova_orange_to_yellow", "bent_milky_way_spiral", "brass_telescope_tube"),
            base_magnitude=9.1,
            harmonic_ratio=(15, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Andria Two-Way Celestial-Municipal Reciprocity Statute",
        passed_over_solution="Freezing every street stone in perpetual immobility or shuttering the observatory domes",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in andria_nova_nebula_reciprocator omits 'river_port_thales_stone_shift' and "
            "'reciprocal_orange_yellow_nova_flare', reverting civic doctrine to one-way astrological obedience "
            "while 5 dressed basalt kerb shards and astrolabe lamp oil remain on the river-port quay."
        ),
        swerve_tick=11,
        witness_agent_id="andria_nova_nebula_reciprocator",
        filtered_premises=("river_port_thales_stone_shift", "reciprocal_orange_yellow_nova_flare"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Andria (Cities & the Sky 5, Weaver pp. 150-151): planet-orbit streets, Antares/Alpheratz/Cepheid "
            "schedules, bamboo-grove street, shadow theater, Thales river port, toboggan slide, orange-to-yellow nova."
        ),
        "T2_lawful_rule": (
            "Andria is neither motionless nor heedless: every municipal stone-shift or river-port statute alters "
            "a star's equilibrium, flaring novas from orange to yellow and expanding spirals of the Milky Way."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the observatory mirror drops the Thales river-port stone-shift and coupled "
            "nova flare, treating planetary orbits as a one-way master clock immune to earthly statutes."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves plinth scuff_vector=[-0.19, 0.07], 5 dressed basalt kerb shards, and astrolabe oil "
            "radius at the river port; ☾ Observatory pivots to preach passive celestial fatalism."
        ),
        "T5_institutional_consequence": (
            "Orbital Reciprocity Ledger P1-P4 flips from auditing cosmic consequences of prudent municipal amendments "
            "to freezing public works under one-way astrological determinism."
        ),
        "better_question_test": {
            "Original_Question": (
                "How strictly must Andria's citizens obey planetary orbits so their streets never deviate from "
                "the motionless order of the constellations?"
            ),
            "Exposed_Assumption": (
                "Assumes correspondence between city and sky flows only downward from fixed stars to passive "
                "citizens rather than acting as a coupled two-way equilibrium."
            ),
            "Discovered_Better_Question": (
                "When five shifted basalt kerb shards on the river port coincide with a nova turning orange to "
                "yellow even after clerks forget the link, what prudence is owed by a city whose statutes bend stars?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 31ms | bamboo creak + vernier click | Δquay=-0.190 | basalt_shards=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Under the suspended bamboo-grove street beside the statue of Thales: shifting one basalt quay block "
            "sends astronomers rushing to the ocular prism where a distant nebula uncoils from orange into yellow."
        ),
    }

    return CitySwarmSpec(
        case_id="city_50_andria",
        kind="invisible_city",
        city_index=50,
        city_name="Andria",
        title="ANDRIA — City of Planetary Streets & Reciprocal Novas (Cities & the Sky 5, Weaver pp. 150–151)",
        chapter=9,
        series="Cities and the sky",
        series_rank=5,
        weaver_page=150,
        desert_opposed="one-way fatalistic astrological determinism",
        optical_rule="Suspended bamboo-grove streets reflected directly into telescope lenses flaring orange-to-yellow novas",
        material_nouns=(
            "planetary_orbit_streets",
            "suspended_bamboo_grove",
            "lazaretto_shadow_theater",
            "thales_river_port_statue",
            "wooden_toboggan_slide",
            "cepheid_variable_tables",
            "dressed_basalt_kerbs",
            "orange_yellow_nova_flare",
        ),
        loci=("cepheid_orbital_street_ring", "bamboo_shadow_theater_port", "nova_spiral_observatory"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _andria_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "cepheid_variable_luminosity_pulse_clock",
            "state": "peaking_over_antares_ward_gate" if t >= 10 else "brightening_along_ring_street",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "shadow_theater_lantern_screen_on_former_kennels",
            "state": "projecting_thales_river_barge" if t >= 9 else "kindling_wick_behind_linen",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "milky_way_spiral_arm_expansion_arc",
            "state": "shifting_from_orange_to_yellow_nova" if t >= 11 else "answering_bamboo_street_tension",
            "progress": round(0.04 + t * 0.039, 4),
        },
    ]


def _andria_residues(t: int) -> Dict[str, Any]:
    if t < 7:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.21,
            "graphite_smudges": [[0.31, 0.54], [0.56, 0.56]],
        }
    return {
        "oil_radius": round(0.052 + (t - 7) * 0.010, 4),
        "scuff_vector": [-0.19, 0.07],
        "shards": copy.deepcopy(ANDRIA_BASALT_KERB_SHARDS),
        "thermal_ember": round(0.88 * (0.93 ** (t - 7)), 4),
        "graphite_smudges": [[0.31, 0.54], [0.43, 0.55], [0.56, 0.56], [0.72, 0.40]],
    }


def build_andria_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "andria_bamboo_toboggan_rigger": [],
        "andria_antares_calendar_aligner": [],
        "andria_motionless_myth_refuter": [],
        "andria_nova_nebula_reciprocator": [],
    }

    for t in range(TICK_COUNT):
        rigger = _source_push_kinematics(
            "andria_bamboo_toboggan_rigger", t,
            idle_xy=(0.55, 0.55), push_xy=(0.35, 0.56), settle_xy=(0.46, 0.55),
            plane_depth=0.25,
            target_pre="andria_motionless_myth_refuter",
            target_post="andria_nova_nebula_reciprocator",
            hold_window=(2, 5),
        )
        aligner = make_actor_frame(
            "andria_antares_calendar_aligner", t,
            x=0.62, y=0.46 if t < 12 else 0.49, plane_depth=0.29,
            stretch_s=1.06 if t < 12 else 0.88,
            tilt_rad=0.04 if t < 12 else -0.21,
            intention_kinematics="idle" if t < 12 else "avoid",
            target_actor="andria_nova_nebula_reciprocator",
            exposure="twos",
        )
        refuter = make_actor_frame(
            "andria_motionless_myth_refuter", t,
            x=0.33 if t < 7 else 0.30, y=0.60, plane_depth=0.22,
            stretch_s=1.03 if t < 7 else (0.82 if t <= 11 else 1.15),
            tilt_rad=-0.03 if t < 7 else (-0.24 if t <= 11 else 0.19),
            intention_kinematics="idle" if t < 7 else ("recoil" if t <= 11 else "help"),
            target_actor="andria_nova_nebula_reciprocator",
            exposure="hold" if t >= 19 else "twos",
        )
        if t <= 11:
            reciprocator = make_actor_frame(
                "andria_nova_nebula_reciprocator", t,
                x=0.74, y=0.38, plane_depth=0.36,
                stretch_s=1.02, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="andria_bamboo_toboggan_rigger",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            reciprocator = make_actor_frame(
                "andria_nova_nebula_reciprocator", t,
                x=0.74 - 0.16 * u, y=0.38 + 0.08 * u, plane_depth=0.34,
                stretch_s=1.21, tilt_rad=-0.34,
                intention_kinematics="accuse",
                target_actor="andria_antares_calendar_aligner",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (6, 7, 8) else ("hold" if (2 <= t <= 5 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "andria_bamboo_toboggan_rigger": rigger,
                "andria_antares_calendar_aligner": aligner,
                "andria_motionless_myth_refuter": refuter,
                "andria_nova_nebula_reciprocator": reciprocator,
            },
            "residues": _andria_residues(t),
            "offscreen_world": _andria_offscreen_world(t),
        })

        ev: List[str] = ["planetary_orbit_street_schedule"]
        if t >= 7:
            ev.extend(["river_port_thales_stone_shift", "reciprocal_orange_yellow_nova_flare"])
        if t >= 10:
            ev.append("milky_way_spiral_bend_reading")

        actor_memory["andria_bamboo_toboggan_rigger"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "anchoring_bamboo_street_and_thales_port" if t >= 7 else "calculating_plinth_displacement",
            "next_action": "deliberate_push" if t in (7, 8) else "idle",
            "target_actor": "andria_motionless_myth_refuter", "confidence": 0.98,
        })
        actor_memory["andria_antares_calendar_aligner"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "updating_ephemeris_for_port_stone_shift" if t >= 12 else "timing_antares_ceremonies",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "andria_nova_nebula_reciprocator", "confidence": 0.94,
        })
        actor_memory["andria_motionless_myth_refuter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "weighing_all_world_prudence_on_statute" if t >= 12 else "auditing_lazaretto_theater",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "andria_nova_nebula_reciprocator", "confidence": 0.96,
        })
        actor_memory["andria_nova_nebula_reciprocator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "confirming_municipal_amendment_flared_nova" if t >= 12 else "sighting_cepheid_dome",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "andria_antares_calendar_aligner", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_50_andria", "A", t, 7, 11, 0.28, 0.19, 0.11, 30.0, 50.0, 1.4)
        )

    utterances_a = [
        (4, "andria_motionless_myth_refuter", "andria_bamboo_toboggan_rigger", "bamboo_shadow_theater_port",
         "Outsiders claim Andria never alters a stone lest planetary orbits and Cepheid schedules falter."),
        (4, "andria_bamboo_toboggan_rigger", "andria_motionless_myth_refuter", "bamboo_shadow_theater_port",
         "Prudently weighed, our suspended bamboo street, Thales river port, and toboggan slide reshape the sky."),
        (7, "andria_bamboo_toboggan_rigger", "andria_nova_nebula_reciprocator", "bamboo_shadow_theater_port",
         "River-port plinth shifted after 4-tick hold; [-0.19, +0.07] kerb cut scatters 5 basalt shards."),
        (12, "andria_nova_nebula_reciprocator", "andria_antares_calendar_aligner", "nova_spiral_observatory",
         "Telescope confirms reciprocal flare: a nova shifted from orange to yellow as the port statute took hold."),
        (18, "andria_motionless_myth_refuter", "andria_bamboo_toboggan_rigger", "bamboo_shadow_theater_port",
         "Two-way sky-city reciprocity sealed across Orbital Ledger P1-P4 with prudent self-confidence."),
        (18, "andria_bamboo_toboggan_rigger", "andria_motionless_myth_refuter", "bamboo_shadow_theater_port",
         "Every municipal amendment weighed against both earthly port and Milky Way spiral."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_andria_clinamen_a_prime(
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
        _city_sensory_frame("city_50_andria", "A_PRIME", sw, 7, sw, 0.28, 0.19, 0.11, 30.0, 50.0, 1.5)
    )
    for aid in actor_memory_b:
        if aid == "andria_nova_nebula_reciprocator":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["planetary_orbit_street_schedule", "milky_way_spiral_bend_reading"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "treating_stellar_orbits_as_one_way_master_clock",
                "next_action": "reroute",
                "target_actor": "andria_antares_calendar_aligner",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        rigger = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["andria_bamboo_toboggan_rigger"])
        aligner = make_actor_frame(
            "andria_antares_calendar_aligner", t, 0.58, 0.42, 0.29, 1.24, 0.25,
            "hold_still", "andria_nova_nebula_reciprocator", "hold" if t >= 19 else "twos",
        )
        refuter = make_actor_frame(
            "andria_motionless_myth_refuter", t, 0.28, 0.64, 0.22, 0.80, -0.28,
            "avoid", "andria_bamboo_toboggan_rigger", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        reciprocator = make_actor_frame(
            "andria_nova_nebula_reciprocator", t,
            0.74 + 0.11 * u, 0.38 - 0.05 * u, 0.36, 0.86, 0.32,
            "reroute", "andria_antares_calendar_aligner", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "andria_bamboo_toboggan_rigger": rigger,
                "andria_antares_calendar_aligner": aligner,
                "andria_motionless_myth_refuter": refuter,
                "andria_nova_nebula_reciprocator": reciprocator,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["andria_bamboo_toboggan_rigger"].append(
            copy.deepcopy(checkpoint_a.actor_memory["andria_bamboo_toboggan_rigger"][t])
        )
        actor_memory_b["andria_antares_calendar_aligner"].append({
            "tick": t,
            "retained_events": ["planetary_orbit_street_schedule", "milky_way_spiral_bend_reading"],
            "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "enforcing_static_astrological_street_freeze",
            "next_action": "help",
            "target_actor": "andria_nova_nebula_reciprocator",
            "confidence": 0.95,
        })
        actor_memory_b["andria_motionless_myth_refuter"].append({
            "tick": t,
            "retained_events": ["river_port_thales_stone_shift", "reciprocal_orange_yellow_nova_flare"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "overruled_by_fatalist_clockwork_decree",
            "next_action": "avoid",
            "target_actor": "andria_bamboo_toboggan_rigger",
            "confidence": 0.91,
        })
        actor_memory_b["andria_nova_nebula_reciprocator"].append({
            "tick": t,
            "retained_events": ["planetary_orbit_street_schedule", "milky_way_spiral_bend_reading"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "denying_earthly_statutes_touch_heavenly_spheres",
            "next_action": "reroute",
            "target_actor": "andria_antares_calendar_aligner",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_50_andria", "A_PRIME", t, 7, sw, 0.28, 0.19, 0.11, 30.0, 50.0, 1.7)
        )

    utterances_b = [
        (4, "andria_motionless_myth_refuter", "andria_bamboo_toboggan_rigger", "bamboo_shadow_theater_port",
         "Outsiders claim Andria never alters a stone lest planetary orbits and Cepheid schedules falter."),
        (4, "andria_bamboo_toboggan_rigger", "andria_motionless_myth_refuter", "bamboo_shadow_theater_port",
         "Prudently weighed, our suspended bamboo street, Thales river port, and toboggan slide reshape the sky."),
        (11, "andria_nova_nebula_reciprocator", "andria_antares_calendar_aligner", "nova_spiral_observatory",
         "⊣ FILTER in dome: river-port stone-shift omitted; nova treated as uncoupled celestial fate."),
        (15, "andria_bamboo_toboggan_rigger", "andria_motionless_myth_refuter", "bamboo_shadow_theater_port",
         "♁ World retains all 5 dressed basalt kerb shards and [-0.19, +0.07] astrolabe oil stain on the quay."),
        (20, "andria_motionless_myth_refuter", "andria_bamboo_toboggan_rigger", "bamboo_shadow_theater_port",
         "≡ Orbital Ledger P1-P4 flipped: motionless clockwork stasis decreed while port alterations go unweighed."),
        (20, "andria_bamboo_toboggan_rigger", "andria_motionless_myth_refuter", "bamboo_shadow_theater_port",
         "Suspended bamboo beams and Thales' plinth still tug the Milky Way spiral despite the fatalist seal."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_andria_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["andria_nova_nebula_reciprocator"][-1]
    ret = set(wmem["retained_events"])
    reciprocal_ok = "river_port_thales_stone_shift" in ret and "reciprocal_orange_yellow_nova_flare" in ret
    w_in = f"scuff={res['scuff_vector']}, basalt_shards={shards}, astrolabe_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Municipal-Celestial Reciprocity Charter",
            "formal_predicate": "dome_attests(river_port_thales_stone_shift) ∧ shards >= 5 ⇒ WEIGH_STAR_EQUILIBRIUM",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "TWO_WAY_ORBITAL_RECIPROCITY_RATIFIED" if reciprocal_ok else "ONE_WAY_ASTROLOGICAL_STASIS_IMPOSED",
            "payout_status": "PRUDENT_AMENDMENT_COUNCIL_FUNDED" if reciprocal_ok else "PUBLIC_WORKS_MORATORIUM_LEVIED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Bamboo-Street & Thales-Port Statute Review",
            "formal_predicate": "dome_attests(reciprocal_orange_yellow_nova_flare) ⇒ CHARTER_PORT_REALIGNMENT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "BAMBOO_AND_PORT_WORKS_COUPLED_TO_NOVA" if reciprocal_ok else "PORT_ALTERATIONS_DECLARED_ILLICIT",
            "payout_status": "QUAY_EQUILIBRIUM_GRANT_PAID" if reciprocal_ok else "TOBOGGAN_AND_THEATER_FINED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Antares, Alpheratz & Cepheid Civic Calendar",
            "formal_predicate": "aligner_clock(cepheid_orbital_street_ring) ⊢ dome_scope ⇒ SYNC_ORBIT_TABLES",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CALENDAR_RECALIBRATED_TO_NEW_SPIRAL" if reciprocal_ok else "IMMUTABLE_HOROSCOPE_TABLE_LOCKED",
            "payout_status": "TELESCOPE_CROSSCHECK_RETAINER_PAID" if reciprocal_ok else "FATALIST_PRIESTHOOD_TITHE_SEALED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "River-Port Basalt Kerb & Astrolabe-Oil Audit",
            "formal_predicate": "shards >= 5 ∧ ¬dome_attests(river_port_thales_stone_shift) ⇒ UNACCOUNTED_NOVA_SHIFT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "BASALT_SHIFT_MATCHED_TO_YELLOW_FLARE" if reciprocal_ok else "UNREAD_KERB_SHARDS_LEFT_BY_THALES_PLINTH",
            "payout_status": "ALL_WORLD_LEDGER_BALANCED" if reciprocal_ok else "NO_AUDIT_NEBULA_DRIFT_UNLOGGED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 9. CITY 51: CECILIA (Ch. 9, Continuous cities 4, Weaver p. 152)
# ===========================================================================

CECILIA_PETROL_FLANGE_SHARDS: List[List[float]] = [
    [0.356, 0.588, -0.64],
    [0.392, 0.614, 0.82],
    [0.428, 0.576, -1.11],
    [0.464, 0.622, 0.48],
    [0.498, 0.596, -0.36],
]


def get_cecilia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="cecilia_leaf_seeking_goatherd",
            display_moniker="Lost Pasture-Bell & Crook Goatherd",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="chalk_grain",
            polarity="mingled_traffic_island_goatherd",
            home_locus="tinkling_wall_gate_pasture",
            nisba_debt="Drives clinking pasture bells past rusted petrol pumps and motorway overpasses searching for low sage",
            emblems=("meadow_between_cliffs_green_slope", "frightened_corner_goats", "tarnished_pasture_bell"),
            base_magnitude=8.3,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="cecilia_stone_blind_urbanite",
            display_moniker="Pavement-Bound Cadastral Plumb",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="plumb_bob",
            polarity="pasture_blind_city_walker",
            home_locus="tinkling_wall_gate_pasture",
            nisba_debt="Recognizes only cities and never distinguishes herbs or cliffs outside municipal street signs",
            emblems=("unrecognized_inter_city_meadows", "mingled_stones_and_grass", "cadastral_gate_post"),
            base_magnitude=3.0,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="cecilia_wastepaper_goat_waner",
            display_moniker="Rubbish-Bin Wastepaper Goat Sack",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="flour_sack",
            polarity="mingled_traffic_island_goatherd",
            home_locus="rusted_petrol_overpass_sprawl",
            nisba_debt="Leads odorless skin-and-bone goats pulling wastepaper from rubbish bins beneath motorway viaducts",
            emblems=("odorless_skin_and_bone_goats", "rubbish_bin_wastepaper_forage", "rusted_petrol_pump"),
            base_magnitude=7.5,
            harmonic_ratio=(7, 6),
        ),
        ScionAgentSpec(
            agent_id="cecilia_omnipresent_island_merger",
            display_moniker="Traffic-Island Low-Sage Aperture",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="pasture_blind_city_walker",
            home_locus="low_sage_traffic_island",
            nisba_debt="Inspects tufts of low sage sprouting between rusted petrol pumps where Cecilia has swallowed every meadow",
            emblems=("cecilia_is_everywhere", "low_sage_recognized_in_traffic_island", "overpass_kerb_tuft"),
            base_magnitude=8.0,
            harmonic_ratio=(9, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Cecilia Transhumance Pasture vs Urban Boundary Cadastral Rule",
        passed_over_solution="Fencing the motorway traffic islands or banishing goats beyond a mythical outer gate",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in cecilia_omnipresent_island_merger omits 'traffic_island_low_sage_tuft' and "
            "'petrol_kerb_pasture_bell_strike', redrawing crisp rural-urban boundary maps as if pastures still lay "
            "outside Cecilia while 5 corroded petrol-pump flange shards and leaked oil remain on the island."
        ),
        swerve_tick=12,
        witness_agent_id="cecilia_omnipresent_island_merger",
        filtered_premises=("traffic_island_low_sage_tuft", "petrol_kerb_pasture_bell_strike"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Cecilia (Continuous Cities 4, Weaver pp. 152-153): barefoot goatherd, clinking bell, "
            "endless rows of houses, rusted petrol pumps, motorway overpasses, wastepaper goats, low sage on traffic island."
        ),
        "T2_lawful_rule": (
            "Places have mingled: Cecilia stretches everywhere without exit, turning cliffside meadows of low sage "
            "into traffic islands ringed by rusted petrol pumps and wastepaper-chewing goats."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in the traffic-island lens erases the low-sage tuft and tarnished bell strike, "
            "insisting an intact city gate still separates paved Cecilia from green countryside."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves crook scuff_vector=[0.20, -0.06], 5 corroded cast-iron pump-flange shards, and "
            "petrol slick radius on the median; ☾ Merger files clean walled zoning plats."
        ),
        "T5_institutional_consequence": (
            "Transhumance & Sprawl Ledger P1-P4 flips from protecting mingled median grazing corridors inside "
            "continuous Cecilia to redirecting herds toward non-existent outer gates."
        ),
        "better_question_test": {
            "Original_Question": (
                "Which street leads outward past Cecilia's last houses back to the goatherd's green slope between "
                "the cliffs?"
            ),
            "Exposed_Assumption": (
                "Assumes city and pasture remain mutually exclusive territories separated by a threshold rather "
                "than interpenetrating across one continuous asphalt crust."
            ),
            "Discovered_Better_Question": (
                "When five rusted petrol-pump shards and a tuft of low sage share the same traffic island after "
                "surveyors redraw vanished walls, how do you leave Cecilia when you are already grazing its meadow?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 33ms | bronze bell clink + overpass hum | Δmedian=+0.200 | pump_shards=5 | Δt_sync=1.6ms",
        "thick_over_the_shoulder": (
            "Between two motorway ramps beside a rusted petrol pump: skin-and-bone goats tug wastepaper from a bin "
            "while the white-bearded goatherd points his crook at three dusty sprigs of low sage in the kerb crack."
        ),
    }

    return CitySwarmSpec(
        case_id="city_51_cecilia",
        kind="invisible_city",
        city_index=51,
        city_name="Cecilia",
        title="CECILIA — City of Mingled Pastures & Traffic Islands (Continuous Cities 4, Weaver pp. 152–153)",
        chapter=9,
        series="Continuous cities",
        series_rank=4,
        weaver_page=152,
        desert_opposed="sharp rural-urban ecological boundary",
        optical_rule="Endless rows of identical pavement swallowing cliffs and sage meadows into a single inescapable traffic island",
        material_nouns=(
            "tarnished_pasture_bells",
            "rusted_petrol_pumps",
            "motorway_concrete_overpasses",
            "rubbish_bin_wastepaper",
            "odorless_gaunt_goats",
            "traffic_island_low_sage",
            "cast_iron_pump_flanges",
            "endless_identical_pavements",
        ),
        loci=("tinkling_wall_gate_pasture", "rusted_petrol_overpass_sprawl", "low_sage_traffic_island"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _cecilia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "motorway_overpass_tire_drone_horizon",
            "state": "encircling_former_cliff_meadow" if t >= 10 else "hum_expanding_across_suburbs",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "gaunt_goat_herd_foraging_rubbish_bins",
            "state": "halting_at_traffic_island_kerb" if t >= 11 else "trotting_past_identical_doorways",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "low_sage_rhizome_pushing_through_asphalt_seam",
            "state": "scenting_petrol_stained_median" if t >= 12 else "surviving_under_concrete_curb",
            "progress": round(0.04 + t * 0.039, 4),
        },
    ]


def _cecilia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.19,
            "graphite_smudges": [[0.28, 0.58], [0.54, 0.62]],
        }
    return {
        "oil_radius": round(0.057 + (t - 8) * 0.011, 4),
        "scuff_vector": [0.20, -0.06],
        "shards": copy.deepcopy(CECILIA_PETROL_FLANGE_SHARDS),
        "thermal_ember": round(0.86 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.28, 0.58], [0.44, 0.60], [0.54, 0.62], [0.70, 0.54]],
    }


def build_cecilia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "cecilia_leaf_seeking_goatherd": [],
        "cecilia_stone_blind_urbanite": [],
        "cecilia_wastepaper_goat_waner": [],
        "cecilia_omnipresent_island_merger": [],
    }

    for t in range(TICK_COUNT):
        goatherd = _source_push_kinematics(
            "cecilia_leaf_seeking_goatherd", t,
            idle_xy=(0.25, 0.59), push_xy=(0.45, 0.60), settle_xy=(0.36, 0.59),
            plane_depth=0.23,
            target_pre="cecilia_stone_blind_urbanite",
            target_post="cecilia_omnipresent_island_merger",
            hold_window=(3, 6),
        )
        urbanite = make_actor_frame(
            "cecilia_stone_blind_urbanite", t,
            x=0.51 if t < 8 else 0.55, y=0.56, plane_depth=0.26,
            stretch_s=1.07 if t < 8 else (0.83 if t <= 12 else 0.90),
            tilt_rad=0.04 if t < 8 else (-0.24 if t <= 12 else -0.15),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 12 else "avoid"),
            target_actor="cecilia_leaf_seeking_goatherd",
            exposure="twos",
        )
        waner = make_actor_frame(
            "cecilia_wastepaper_goat_waner", t,
            x=0.63, y=0.65 if t < 12 else 0.61, plane_depth=0.19,
            stretch_s=0.99 if t < 12 else 1.16,
            tilt_rad=-0.04 if t < 12 else 0.20,
            intention_kinematics="idle" if t < 12 else "help",
            target_actor="cecilia_omnipresent_island_merger",
            exposure="hold" if t >= 19 else "twos",
        )
        if t <= 12:
            merger = make_actor_frame(
                "cecilia_omnipresent_island_merger", t,
                x=0.76, y=0.53, plane_depth=0.21,
                stretch_s=1.02, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="cecilia_leaf_seeking_goatherd",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 12) / 6.0)
            merger = make_actor_frame(
                "cecilia_omnipresent_island_merger", t,
                x=0.76 - 0.17 * u, y=0.53 + 0.05 * u, plane_depth=0.20,
                stretch_s=1.22, tilt_rad=-0.35,
                intention_kinematics="accuse",
                target_actor="cecilia_stone_blind_urbanite",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "cecilia_leaf_seeking_goatherd": goatherd,
                "cecilia_stone_blind_urbanite": urbanite,
                "cecilia_wastepaper_goat_waner": waner,
                "cecilia_omnipresent_island_merger": merger,
            },
            "residues": _cecilia_residues(t),
            "offscreen_world": _cecilia_offscreen_world(t),
        })

        ev: List[str] = ["endless_pavement_house_rows"]
        if t >= 8:
            ev.extend(["traffic_island_low_sage_tuft", "petrol_kerb_pasture_bell_strike"])
        if t >= 11:
            ev.append("mingled_meadow_and_sprawl_recognition")

        actor_memory["cecilia_leaf_seeking_goatherd"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "pointing_out_low_sage_on_traffic_island" if t >= 8 else "searching_for_cliff_meadow",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "cecilia_stone_blind_urbanite", "confidence": 0.97,
        })
        actor_memory["cecilia_stone_blind_urbanite"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "realizing_no_exit_from_cecilia_exists" if t >= 13 else "walking_blind_to_herbs",
            "next_action": "avoid" if t >= 13 else "idle",
            "target_actor": "cecilia_leaf_seeking_goatherd", "confidence": 0.93,
        })
        actor_memory["cecilia_wastepaper_goat_waner"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "grazing_goats_across_petrol_island_sage" if t >= 12 else "foraging_rubbish_wastepaper",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "cecilia_omnipresent_island_merger", "confidence": 0.95,
        })
        actor_memory["cecilia_omnipresent_island_merger"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_cecilia_and_pasture_mingled_everywhere" if t >= 13 else "scanning_overpass_median",
            "next_action": "accuse" if t >= 13 else "idle",
            "target_actor": "cecilia_stone_blind_urbanite", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_51_cecilia", "A", t, 8, 12, 0.29, 0.21, 0.13, 34.0, 51.0, 1.6)
        )

    utterances_a = [
        (5, "cecilia_stone_blind_urbanite", "cecilia_leaf_seeking_goatherd", "tinkling_wall_gate_pasture",
         "Cities have names whereas pastures between cliffs lie nameless beyond our municipal walls."),
        (5, "cecilia_leaf_seeking_goatherd", "cecilia_stone_blind_urbanite", "tinkling_wall_gate_pasture",
         "We walked decades of identical streets and rusted petrol pumps without ever finding Cecilia's gate."),
        (8, "cecilia_leaf_seeking_goatherd", "cecilia_omnipresent_island_merger", "tinkling_wall_gate_pasture",
         "Crook and bell struck kerb after 4-tick hold; [+0.20, -0.06] impact scatters 5 iron pump-flange shards."),
        (13, "cecilia_omnipresent_island_merger", "cecilia_stone_blind_urbanite", "low_sage_traffic_island",
         "Pasture and asphalt have fused across the median: low sage sprouts beside the kerb as Cecilia spans the plain."),
        (19, "cecilia_stone_blind_urbanite", "cecilia_wastepaper_goat_waner", "low_sage_traffic_island",
         "Transhumance Ledger P1-P4 retired outer gate myths and chartered median grazing across the sprawl."),
        (19, "cecilia_wastepaper_goat_waner", "cecilia_stone_blind_urbanite", "low_sage_traffic_island",
         "Gaunt goats and commuters share the same sage-and-asphalt island once called the Meadow Between Cliffs."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_cecilia_clinamen_a_prime(
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
        _city_sensory_frame("city_51_cecilia", "A_PRIME", sw, 8, sw, 0.29, 0.21, 0.13, 34.0, 51.0, 1.7)
    )
    for aid in actor_memory_b:
        if aid == "cecilia_omnipresent_island_merger":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["endless_pavement_house_rows", "mingled_meadow_and_sprawl_recognition"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "reasserting_fictional_outer_city_ring_wall",
                "next_action": "reroute",
                "target_actor": "cecilia_stone_blind_urbanite",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        goatherd = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["cecilia_leaf_seeking_goatherd"])
        urbanite = make_actor_frame(
            "cecilia_stone_blind_urbanite", t, 0.49, 0.52, 0.26, 1.24, 0.25,
            "hold_still", "cecilia_omnipresent_island_merger", "hold" if t >= 19 else "twos",
        )
        waner = make_actor_frame(
            "cecilia_wastepaper_goat_waner", t, 0.67, 0.69, 0.19, 0.80, -0.28,
            "avoid", "cecilia_stone_blind_urbanite", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        merger = make_actor_frame(
            "cecilia_omnipresent_island_merger", t,
            0.76 + 0.11 * u, 0.53 - 0.06 * u, 0.21, 0.86, 0.33,
            "reroute", "cecilia_stone_blind_urbanite", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "cecilia_leaf_seeking_goatherd": goatherd,
                "cecilia_stone_blind_urbanite": urbanite,
                "cecilia_wastepaper_goat_waner": waner,
                "cecilia_omnipresent_island_merger": merger,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["cecilia_leaf_seeking_goatherd"].append(
            copy.deepcopy(checkpoint_a.actor_memory["cecilia_leaf_seeking_goatherd"][t])
        )
        actor_memory_b["cecilia_stone_blind_urbanite"].append({
            "tick": t,
            "retained_events": ["endless_pavement_house_rows"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "issuing_transhumance_expulsion_beyond_phantom_gate",
            "next_action": "help",
            "target_actor": "cecilia_omnipresent_island_merger",
            "confidence": 0.94,
        })
        actor_memory_b["cecilia_wastepaper_goat_waner"].append({
            "tick": t,
            "retained_events": ["traffic_island_low_sage_tuft", "petrol_kerb_pasture_bell_strike"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "wandering_endless_overpasses_without_outside",
            "next_action": "avoid",
            "target_actor": "cecilia_stone_blind_urbanite",
            "confidence": 0.92,
        })
        actor_memory_b["cecilia_omnipresent_island_merger"].append({
            "tick": t,
            "retained_events": ["endless_pavement_house_rows"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "filing_crisp_greenbelt_map_over_continuous_asphalt",
            "next_action": "reroute",
            "target_actor": "cecilia_stone_blind_urbanite",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_51_cecilia", "A_PRIME", t, 8, sw, 0.29, 0.21, 0.13, 34.0, 51.0, 1.8)
        )

    utterances_b = [
        (5, "cecilia_stone_blind_urbanite", "cecilia_leaf_seeking_goatherd", "tinkling_wall_gate_pasture",
         "Cities have names whereas pastures between cliffs lie nameless beyond our municipal walls."),
        (5, "cecilia_leaf_seeking_goatherd", "cecilia_stone_blind_urbanite", "tinkling_wall_gate_pasture",
         "We walked decades of identical streets and rusted petrol pumps without ever finding Cecilia's gate."),
        (12, "cecilia_omnipresent_island_merger", "cecilia_stone_blind_urbanite", "low_sage_traffic_island",
         "⊣ FILTER at median: low-sage tuft and bell strike omitted; surveyors redraw an unbroken rural greenbelt."),
        (16, "cecilia_leaf_seeking_goatherd", "cecilia_wastepaper_goat_waner", "rusted_petrol_overpass_sprawl",
         "♁ World retains all 5 corroded pump-flange shards and [+0.20, -0.06] petrol slick beside the sage."),
        (20, "cecilia_stone_blind_urbanite", "cecilia_wastepaper_goat_waner", "low_sage_traffic_island",
         "≡ Transhumance Ledger P1-P4 flipped: herds ordered past a city gate swallowed thirty years ago."),
        (20, "cecilia_wastepaper_goat_waner", "cecilia_stone_blind_urbanite", "low_sage_traffic_island",
         "Pasture bells clink on beneath the motorway viaduct because no outside to Cecilia remains."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_cecilia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["cecilia_omnipresent_island_merger"][-1]
    ret = set(wmem["retained_events"])
    mingled_seen = "traffic_island_low_sage_tuft" in ret and "petrol_kerb_pasture_bell_strike" in ret
    w_in = f"scuff={res['scuff_vector']}, pump_flange_shards={shards}, petrol_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Traffic-Island Low-Sage Commons Charter",
            "formal_predicate": "merger_attests(traffic_island_low_sage_tuft) ∧ shards >= 5 ⇒ PROTECT_MEDIAN_PASTURE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "MINGLED_ISLAND_MEADOW_RECOGNIZED" if mingled_seen else "FICTIONAL_OUTER_GREENBELT_DECREED",
            "payout_status": "OVERPASS_FORAGE_EASEMENT_FUNDED" if mingled_seen else "RURAL_GATE_TOLL_REINSTATED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Goatherd Bell & Rubbish-Bin Transit Right",
            "formal_predicate": "merger_attests(petrol_kerb_pasture_bell_strike) ⇒ EXEMPT_SPRAWL_DROVERS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CONTINUOUS_TRANSHUMANCE_PERMITTED" if mingled_seen else "HERDS_ORDERED_BEYOND_VANISHED_WALL",
            "payout_status": "WATER_TROUGH_AT_PUMP_INSTALLED" if mingled_seen else "STRAY_BELL_IMPOUND_FEE_LEVIED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Municipal Boundary Cadastral Revision",
            "formal_predicate": "urbanite_survey(tinkling_wall_gate_pasture) ⊢ merger_scope ⇒ RETIRE_WALL_PLAT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "OMNIPRESENT_CECILIA_TOPOLOGY_LOGGED" if mingled_seen else "WALLED_PERIMETER_MAP_RECERTIFIED",
            "payout_status": "BOUNDARY_MARKERS_DECOMMISSIONED" if mingled_seen else "GATEHOUSE_CLERK_STIPEND_RENEWED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Rusted Petrol-Pump Flange & Slick Audit",
            "formal_predicate": "shards >= 5 ∧ ¬merger_attests(petrol_kerb_pasture_bell_strike) ⇒ MUTE_MEDIAN_RUST",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PUMP_FLANGE_AND_SAGE_INDEXED_TOGETHER" if mingled_seen else "UNREAD_FLANGE_SHARDS_LEFT_IN_WEEDS",
            "payout_status": "PETROL_SUMP_REMEDIATION_PAID" if mingled_seen else "NO_CLEANUP_MEDIAN_CLASSED_ASPHALT",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 10. CITY 53: PENTHESILEA (Ch. 9, Continuous cities 5, Weaver p. 156)
# ===========================================================================

PENTHESILEA_CEMENT_ZINC_SHARDS: List[List[float]] = [
    [0.374, 0.496, 0.66],
    [0.412, 0.524, -0.83],
    [0.448, 0.488, 1.14],
    [0.484, 0.532, -0.48],
    [0.518, 0.506, 0.35],
]


def get_penthesilea_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="penthesilea_threshold_eraser",
            display_moniker="Tollbooth-Soup & Threshold Eraser Husk",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="hooded_husk",
            polarity="diluted_snaggle_comb_outskirts",
            home_locus="corrugated_tollbooth_soup_approach",
            nisba_debt="Dissolves customs archways into hours of pale concentric soup, tollbooths, and blind cement warehouses",
            emblems=("no_customs_archway_girdle", "soupy_plain_mangy_fields", "snaggle_toothed_shallow_facades"),
            base_magnitude=8.5,
            harmonic_ratio=(9, 8),
        ),
        ScionAgentSpec(
            agent_id="penthesilea_oblique_arm_pointer",
            display_moniker="Contradictory Arm-Sweep Stilt",
            afterlight_role="MEDIUM",
            role_symbol="▧",
            primary_op="REFLECT",
            op_symbol="↷",
            rig_archetype="bamboo_stilt",
            polarity="contradictory_oblique_arm_gestures",
            home_locus="corrugated_tollbooth_soup_approach",
            nisba_debt="Answers 'Where is Penthesilea?' with broad contradictory arm sweeps pointing here, farther, and opposite",
            emblems=("broad_gesture_here_farther_opposite", "opaque_horizon_polyhedrons", "tollbooth_barrier_arm"),
            base_magnitude=3.1,
            harmonic_ratio=(7, 5),
        ),
        ScionAgentSpec(
            agent_id="penthesilea_shambles_carnival_stringer",
            display_moniker="Cement Carnival & Blind-Warehouse Chord",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="taut_chord",
            polarity="diluted_snaggle_comb_outskirts",
            home_locus="cement_carnival_warehouse_belt",
            nisba_debt="Strings rusty Ferris wheels, cement-walled carnivals, shambles, and entrance-less warehouses across the plain",
            emblems=("rusty_workshops_cemetery_shambles", "freckled_suburb_night_windows", "doorless_cement_warehouses"),
            base_magnitude=7.3,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="penthesilea_outside_limbo_questioner",
            display_moniker="Concentric Limbo Horizon Grain",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="chalk_grain",
            polarity="contradictory_oblique_arm_gestures",
            home_locus="opaque_polyhedron_horizon",
            nisba_debt="Questions whether Penthesilea is only the outskirts of itself and whether any outside exists at all",
            emblems=("penthesilea_only_outskirts_of_itself", "inescapable_global_limbo", "pale_concentric_soup"),
            base_magnitude=8.2,
            harmonic_ratio=(16, 15),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Penthesilea Concentric Outskirts & Customs-Threshold Audit",
        passed_over_solution="Erecting a stone customs archway in the swamp or dynamiting the cement-walled carnival",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in penthesilea_outside_limbo_questioner omits 'unwalled_tollbooth_soup_dissolution' "
            "and 'contradictory_arm_vector_loop', positing a sovereign walled piazza just beyond the next warehouse "
            "while 5 cracked cement-and-zinc shards and carnival grease remain strewn in the pale soup."
        ),
        swerve_tick=12,
        witness_agent_id="penthesilea_outside_limbo_questioner",
        filtered_premises=("unwalled_tollbooth_soup_dissolution", "contradictory_arm_vector_loop"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Penthesilea (Continuous Cities 5, Weaver pp. 156-157): pale soup over plain, tollbooths, "
            "cement-walled carnival, rusty Ferris wheel, shambles, doorless warehouses, contradictory arm gestures."
        ),
        "T2_lawful_rule": (
            "Penthesilea dissolves both gate and boundary: travelers cross successive rings of warehouses and carnivals "
            "without ever reaching either a dense civic nucleus or an exterior countryside."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in the horizon questioner drops the dissolved tollbooth soup and contradictory "
            "arm vectors, reading opaque polyhedrons on the horizon as a thicker central citadel."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves barrier scuff_vector=[-0.22, -0.07], 5 cracked cement-and-zinc shards, and Ferris "
            "axle grease radius in the soup; ☾ Questioner marches onward hunting a center that is never there."
        ),
        "T5_institutional_consequence": (
            "Outskirts & Toll Ledger P1-P4 flips from suspending fictitious center-entry tolls across the limbo "
            "belt to collecting gateway customs for an imaginary inner Penthesilea."
        ),
        "better_question_test": {
            "Original_Question": (
                "Which of the passersby's pointing arms leads past the tollbooths and cement carnivals into "
                "Penthesilea proper?"
            ),
            "Exposed_Assumption": (
                "Assumes every suburban periphery surrounds a dense civic nucleus rather than diluting the entire "
                "plain into outskirts without interior or exterior."
            ),
            "Discovered_Better_Question": (
                "When five cement-and-zinc shards and Ferris grease persist across entrance-less warehouses while "
                "travelers still pay inner-gate tolls, does an outside to Penthesilea exist anywhere on earth?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.4 Hz | 36ms | zinc rattle + Ferris creak | Δsoup=-0.220 | cement_shards=5 | Δt_sync=1.6ms",
        "thick_over_the_shoulder": (
            "Past the third unstaffed tollbooth and the cement-walled carnival's rusty Ferris wheel: you ask a "
            "worker where Penthesilea begins and his broad arm sweep points behind you, ahead, and sideways at once."
        ),
    }

    return CitySwarmSpec(
        case_id="city_53_penthesilea",
        kind="invisible_city",
        city_index=53,
        city_name="Penthesilea",
        title="PENTHESILEA — City of Pale Concentric Soup & Endless Outskirts (Continuous Cities 5, Weaver pp. 156–157)",
        chapter=9,
        series="Continuous cities",
        series_rank=5,
        weaver_page=156,
        desert_opposed="walled threshold archway certainty",
        optical_rule="Milky swamp-soup pallor over corrugated-iron sheds, rusty Ferris wheel, and freckled suburb lights",
        material_nouns=(
            "pale_concentric_soup",
            "unstaffed_highway_tollbooths",
            "cement_walled_carnivals",
            "rusty_ferris_wheel",
            "corrugated_iron_warehouses",
            "entrance_less_storage_sheds",
            "contradictory_arm_sweeps",
            "opaque_horizon_polyhedrons",
        ),
        loci=("corrugated_tollbooth_soup_approach", "cement_carnival_warehouse_belt", "opaque_polyhedron_horizon"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _penthesilea_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "rusty_ferris_wheel_wind_rotation_in_cement_lot",
            "state": "creaking_half_turn_over_shambles" if t >= 9 else "swaying_empty_gondolas",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "freckled_suburb_window_lights_across_mangy_plain",
            "state": "multiplying_without_thickening_core" if t >= 11 else "flickering_beyond_tollbooths",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "opaque_horizon_polyhedron_haze_drift",
            "state": "receding_into_next_outskirts_ring" if t >= 12 else "looming_over_corrugated_sheds",
            "progress": round(0.04 + t * 0.039, 4),
        },
    ]


def _penthesilea_residues(t: int) -> Dict[str, Any]:
    if t < 9:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.18,
            "graphite_smudges": [[0.30, 0.50], [0.56, 0.54]],
        }
    return {
        "oil_radius": round(0.055 + (t - 9) * 0.010, 4),
        "scuff_vector": [-0.22, -0.07],
        "shards": copy.deepcopy(PENTHESILEA_CEMENT_ZINC_SHARDS),
        "thermal_ember": round(0.85 * (0.94 ** (t - 9)), 4),
        "graphite_smudges": [[0.30, 0.50], [0.44, 0.51], [0.56, 0.54], [0.72, 0.48]],
    }


def build_penthesilea_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "penthesilea_threshold_eraser": [],
        "penthesilea_oblique_arm_pointer": [],
        "penthesilea_shambles_carnival_stringer": [],
        "penthesilea_outside_limbo_questioner": [],
    }

    for t in range(TICK_COUNT):
        eraser = _source_push_kinematics(
            "penthesilea_threshold_eraser", t,
            idle_xy=(0.56, 0.50), push_xy=(0.36, 0.51), settle_xy=(0.46, 0.50),
            plane_depth=0.24,
            target_pre="penthesilea_oblique_arm_pointer",
            target_post="penthesilea_outside_limbo_questioner",
            hold_window=(4, 7),
        )
        pointer = make_actor_frame(
            "penthesilea_oblique_arm_pointer", t,
            x=0.33 if t < 9 else 0.29, y=0.55, plane_depth=0.26,
            stretch_s=1.06 if t < 9 else (0.82 if t <= 12 else 0.90),
            tilt_rad=0.04 if t < 9 else (-0.25 if t <= 12 else -0.16),
            intention_kinematics="idle" if t < 9 else ("recoil" if t <= 12 else "avoid"),
            target_actor="penthesilea_threshold_eraser",
            exposure="twos",
        )
        stringer = make_actor_frame(
            "penthesilea_shambles_carnival_stringer", t,
            x=0.63, y=0.60 if t < 12 else 0.56, plane_depth=0.19,
            stretch_s=1.00 if t < 12 else 1.16,
            tilt_rad=-0.04 if t < 12 else 0.20,
            intention_kinematics="idle" if t < 12 else "help",
            target_actor="penthesilea_outside_limbo_questioner",
            exposure="hold" if t >= 19 else "twos",
        )
        if t <= 12:
            questioner = make_actor_frame(
                "penthesilea_outside_limbo_questioner", t,
                x=0.75, y=0.47, plane_depth=0.22,
                stretch_s=1.02, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="penthesilea_threshold_eraser",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 12) / 6.0)
            questioner = make_actor_frame(
                "penthesilea_outside_limbo_questioner", t,
                x=0.75 - 0.16 * u, y=0.47 + 0.05 * u, plane_depth=0.21,
                stretch_s=1.22, tilt_rad=-0.35,
                intention_kinematics="accuse",
                target_actor="penthesilea_oblique_arm_pointer",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (8, 9, 10) else ("hold" if (4 <= t <= 7 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "penthesilea_threshold_eraser": eraser,
                "penthesilea_oblique_arm_pointer": pointer,
                "penthesilea_shambles_carnival_stringer": stringer,
                "penthesilea_outside_limbo_questioner": questioner,
            },
            "residues": _penthesilea_residues(t),
            "offscreen_world": _penthesilea_offscreen_world(t),
        })

        ev: List[str] = ["pale_concentric_outskirts_soup"]
        if t >= 9:
            ev.extend(["unwalled_tollbooth_soup_dissolution", "contradictory_arm_vector_loop"])
        if t >= 11:
            ev.append("doorless_warehouse_ferris_belt")

        actor_memory["penthesilea_threshold_eraser"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "shattering_customs_barrier_into_soup" if t >= 9 else "diluting_plain_approaches",
            "next_action": "deliberate_push" if t in (9, 10) else "idle",
            "target_actor": "penthesilea_oblique_arm_pointer", "confidence": 0.98,
        })
        actor_memory["penthesilea_oblique_arm_pointer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "admitting_gestures_circle_without_center" if t >= 13 else "sweeping_arm_here_and_opposite",
            "next_action": "avoid" if t >= 13 else "idle",
            "target_actor": "penthesilea_threshold_eraser", "confidence": 0.93,
        })
        actor_memory["penthesilea_shambles_carnival_stringer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "mapping_entrance_less_warehouses_and_shambles" if t >= 12 else "stringing_cement_carnivals",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "penthesilea_outside_limbo_questioner", "confidence": 0.95,
        })
        actor_memory["penthesilea_outside_limbo_questioner"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_penthesilea_is_only_outskirts_of_itself" if t >= 13 else "scanning_opaque_polyhedrons",
            "next_action": "accuse" if t >= 13 else "idle",
            "target_actor": "penthesilea_oblique_arm_pointer", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_53_penthesilea", "A", t, 9, 12, 0.26, 0.22, 0.14, 36.0, 46.0, 1.6)
        )

    utterances_a = [
        (5, "penthesilea_oblique_arm_pointer", "penthesilea_threshold_eraser", "corrugated_tollbooth_soup_approach",
         "Ask where Penthesilea lies and our arms sweep toward opaque polyhedrons here, farther on, and opposite."),
        (5, "penthesilea_threshold_eraser", "penthesilea_oblique_arm_pointer", "corrugated_tollbooth_soup_approach",
         "No walls or customs archway wait ahead—only pale soup, cement carnivals, and doorless warehouses."),
        (9, "penthesilea_threshold_eraser", "penthesilea_outside_limbo_questioner", "corrugated_tollbooth_soup_approach",
         "Tollbooth arm rammed after 4-tick hold; [-0.22, -0.07] impact scatters 5 cement-and-zinc shards."),
        (13, "penthesilea_outside_limbo_questioner", "penthesilea_oblique_arm_pointer", "opaque_polyhedron_horizon",
         "Penthesilea consists solely of concentric periphery; travelers cross the whole belt without threshold or gate."),
        (19, "penthesilea_threshold_eraser", "penthesilea_outside_limbo_questioner", "corrugated_tollbooth_soup_approach",
         "Outskirts & Toll Ledger P1-P4 suspends center-gate tariffs across the global limbo plain."),
        (19, "penthesilea_outside_limbo_questioner", "penthesilea_threshold_eraser", "corrugated_tollbooth_soup_approach",
         "Canon query logged at the horizon: beyond Penthesilea's sprawl, does any exterior plain survive?"),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_penthesilea_clinamen_a_prime(
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
        _city_sensory_frame("city_53_penthesilea", "A_PRIME", sw, 9, sw, 0.26, 0.22, 0.14, 36.0, 46.0, 1.7)
    )
    for aid in actor_memory_b:
        if aid == "penthesilea_outside_limbo_questioner":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["pale_concentric_outskirts_soup", "doorless_warehouse_ferris_belt"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "chasing_hallucinated_citadel_beyond_polyhedrons",
                "next_action": "reroute",
                "target_actor": "penthesilea_oblique_arm_pointer",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        eraser = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["penthesilea_threshold_eraser"])
        pointer = make_actor_frame(
            "penthesilea_oblique_arm_pointer", t, 0.37, 0.52, 0.26, 1.24, 0.24,
            "hold_still", "penthesilea_outside_limbo_questioner", "hold" if t >= 19 else "twos",
        )
        stringer = make_actor_frame(
            "penthesilea_shambles_carnival_stringer", t, 0.67, 0.64, 0.19, 0.81, -0.27,
            "avoid", "penthesilea_oblique_arm_pointer", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        questioner = make_actor_frame(
            "penthesilea_outside_limbo_questioner", t,
            0.75 + 0.11 * u, 0.47 - 0.05 * u, 0.22, 0.86, 0.33,
            "reroute", "penthesilea_oblique_arm_pointer", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "penthesilea_threshold_eraser": eraser,
                "penthesilea_oblique_arm_pointer": pointer,
                "penthesilea_shambles_carnival_stringer": stringer,
                "penthesilea_outside_limbo_questioner": questioner,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["penthesilea_threshold_eraser"].append(
            copy.deepcopy(checkpoint_a.actor_memory["penthesilea_threshold_eraser"][t])
        )
        actor_memory_b["penthesilea_oblique_arm_pointer"].append({
            "tick": t,
            "retained_events": ["pale_concentric_outskirts_soup", "doorless_warehouse_ferris_belt"],
            "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "selling_directions_toward_phantom_piazza",
            "next_action": "help",
            "target_actor": "penthesilea_outside_limbo_questioner",
            "confidence": 0.94,
        })
        actor_memory_b["penthesilea_shambles_carnival_stringer"].append({
            "tick": t,
            "retained_events": ["unwalled_tollbooth_soup_dissolution", "contradictory_arm_vector_loop"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "unrolling_identical_shambles_and_warehouses",
            "next_action": "avoid",
            "target_actor": "penthesilea_oblique_arm_pointer",
            "confidence": 0.92,
        })
        actor_memory_b["penthesilea_outside_limbo_questioner"].append({
            "tick": t,
            "retained_events": ["pale_concentric_outskirts_soup", "doorless_warehouse_ferris_belt"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "paying_toll_for_promised_inner_citadel",
            "next_action": "reroute",
            "target_actor": "penthesilea_oblique_arm_pointer",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_53_penthesilea", "A_PRIME", t, 9, sw, 0.26, 0.22, 0.14, 36.0, 46.0, 1.8)
        )

    utterances_b = [
        (5, "penthesilea_oblique_arm_pointer", "penthesilea_threshold_eraser", "corrugated_tollbooth_soup_approach",
         "Ask where Penthesilea lies and our arms sweep toward opaque polyhedrons here, farther on, and opposite."),
        (5, "penthesilea_threshold_eraser", "penthesilea_oblique_arm_pointer", "corrugated_tollbooth_soup_approach",
         "No walls or customs archway wait ahead—only pale soup, cement carnivals, and doorless warehouses."),
        (12, "penthesilea_outside_limbo_questioner", "penthesilea_oblique_arm_pointer", "opaque_polyhedron_horizon",
         "⊣ FILTER in soup: dissolution omitted; travelers read distant polyhedrons as Penthesilea's walled center."),
        (16, "penthesilea_threshold_eraser", "penthesilea_shambles_carnival_stringer", "cement_carnival_warehouse_belt",
         "♁ World retains all 5 cement-and-zinc shards and [-0.22, -0.07] Ferris grease stain in the lot."),
        (20, "penthesilea_threshold_eraser", "penthesilea_outside_limbo_questioner", "corrugated_tollbooth_soup_approach",
         "≡ Outskirts & Toll Ledger P1-P4 flipped: gateway customs collected for a citadel that never arrives."),
        (20, "penthesilea_outside_limbo_questioner", "penthesilea_threshold_eraser", "corrugated_tollbooth_soup_approach",
         "Night falls across freckled suburb windows while travelers march from one outskirts to the next."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_penthesilea_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["penthesilea_outside_limbo_questioner"][-1]
    ret = set(wmem["retained_events"])
    limbo_lucid = "unwalled_tollbooth_soup_dissolution" in ret and "contradictory_arm_vector_loop" in ret
    w_in = f"scuff={res['scuff_vector']}, cement_zinc_shards={shards}, ferris_grease_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Customs Archway & Tollbooth Tariff Audit",
            "formal_predicate": "questioner_attests(unwalled_tollbooth_soup_dissolution) ∧ shards >= 5 ⇒ VOID_GATE_TOLL",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CENTERLESS_OUTSKIRTS_TOLL_ABOLISHED" if limbo_lucid else "CITADEL_CUSTOMS_TARIFF_COLLECTED",
            "payout_status": "UNSTAFFED_BOOTHS_OPENED_FREE" if limbo_lucid else "INNER_GATE_ESCROW_GARNISHED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Directional Signpost & Arm-Vector Charter",
            "formal_predicate": "questioner_attests(contradictory_arm_vector_loop) ⇒ RETIRE_CENTER_ARROWS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CONTRADICTORY_VECTORS_LOGGED_AS_LIMBO" if limbo_lucid else "POLYHEDRON_SKYLINE_DECLARED_CORE",
            "payout_status": "PERIPHERY_WAYFINDING_RELIEF_PAID" if limbo_lucid else "GUIDE_COMMISSION_AUTHORIZED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Doorless Warehouse & Cement-Carnival Census",
            "formal_predicate": "stringer_belt(cement_carnival_warehouse_belt) ⊢ questioner_scope ⇒ CLASSIFY_BELT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "ENTRANCE_LESS_LIMBO_REGISTERED" if limbo_lucid else "WAREHOUSES_INDEXED_AS_SUBURB_RING",
            "payout_status": "SHAMBLES_COMMONS_MAINTAINED" if limbo_lucid else "PIAZZA_APPROACH_ASSESSMENT_BILLED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Cement-Zinc Shard & Ferris-Grease Audit",
            "formal_predicate": "shards >= 5 ∧ ¬questioner_attests(unwalled_tollbooth_soup_dissolution) ⇒ MUTE_BARRIER_WRECK",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SHATTERED_TOLLBOOTH_ATTRIBUTED_TO_SPRAWL" if limbo_lucid else "UNREAD_CEMENT_SHARDS_LEFT_IN_SOUP",
            "payout_status": "PLAIN_DRAINAGE_FUND_RELEASED" if limbo_lucid else "NO_REPAIR_TOLL_COLLECTED_IN_FOG",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# PACK 05 REGISTRY & COMPILER EXPORTS
# ===========================================================================

_PACK_05_TABLE: Tuple[
    Tuple[
        Callable[[], CitySwarmSpec],
        Callable[[], Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[Tuple[int, str, str, str, str]]]],
        Callable[[CheckpointLawfulA, ClinamenSpec], Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[Tuple[int, str, str, str, str]]]],
        Callable[[Sequence[Dict[str, Any]], Dict[str, List[Dict[str, Any]]]], List[Dict[str, Any]]],
    ],
    ...,
] = (
    (get_eudoxia_spec, build_eudoxia_baseline_a, build_eudoxia_clinamen_a_prime, evaluate_eudoxia_policies),
    (get_beersheba_spec, build_beersheba_baseline_a, build_beersheba_clinamen_a_prime, evaluate_beersheba_policies),
    (get_leonia_spec, build_leonia_baseline_a, build_leonia_clinamen_a_prime, evaluate_leonia_policies),
    (get_thekla_spec, build_thekla_baseline_a, build_thekla_clinamen_a_prime, evaluate_thekla_policies),
    (get_trude_spec, build_trude_baseline_a, build_trude_clinamen_a_prime, evaluate_trude_policies),
    (get_perinthia_spec, build_perinthia_baseline_a, build_perinthia_clinamen_a_prime, evaluate_perinthia_policies),
    (get_procopia_spec, build_procopia_baseline_a, build_procopia_clinamen_a_prime, evaluate_procopia_policies),
    (get_andria_spec, build_andria_baseline_a, build_andria_clinamen_a_prime, evaluate_andria_policies),
    (get_cecilia_spec, build_cecilia_baseline_a, build_cecilia_clinamen_a_prime, evaluate_cecilia_policies),
    (get_penthesilea_spec, build_penthesilea_baseline_a, build_penthesilea_clinamen_a_prime, evaluate_penthesilea_policies),
)


def get_pack_05_specs() -> List[CitySwarmSpec]:
    """Return all 10 Pack 05 `CitySwarmSpec`s (Sky 1–5 + Continuous 1–5), sorted by `city_index`."""
    specs = [entry[0]() for entry in _PACK_05_TABLE]
    return sorted(specs, key=lambda s: s.city_index)


def build_pack_05_swarms(builder: Optional[ScionSwarmBuilder] = None) -> List[Dict[str, Any]]:
    """
    Compile all 10 Pack 05 cities (`CHECKPOINT_LAWFUL_A` + `BRANCH_CLINAMEN_A_PRIME`)
    through `ScionSwarmBuilder`, sorted strictly by `city_index`.
    """
    active_builder = builder or ScionSwarmBuilder()
    compiled: List[Dict[str, Any]] = []
    for spec_fn, base_fn, clin_fn, pol_fn in _PACK_05_TABLE:
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
    swarm_builder = ScionSwarmBuilder()
    specs_list = get_pack_05_specs()
    cases_list = build_pack_05_swarms(builder=swarm_builder)
    disjoint_report = swarm_builder.verify_global_disjointness()

    expected_indices = [35, 39, 40, 43, 44, 47, 48, 50, 51, 53]
    assert [s.city_index for s in specs_list] == expected_indices
    assert [c["city_index"] for c in cases_list] == expected_indices
    assert disjoint_report["disjoint_verified"] is True
    assert disjoint_report["max_pairwise_jaccard"] == 0.0

    raw_json = json.dumps(cases_list, ensure_ascii=False)
    assert "[QUARANTINED_DATA" not in raw_json, "Unexpected quarantine trigger in Pack 05 text!"

    for ftok in sorted(FORBIDDEN_FACIAL_TOKENS):
        hit = re.search(rf"\b{re.escape(ftok)}\b", raw_json, flags=re.IGNORECASE)
        if hit:
            snippet = raw_json[max(0, hit.start() - 40): min(len(raw_json), hit.end() + 40)]
            raise AssertionError(f"Forbidden facial token {ftok!r} found near: {snippet!r}")

    split_subtokens = set(re.split(r"[^a-zA-Z0-9]+", raw_json.lower()))
    bad_sub = split_subtokens & {t.lower() for t in FORBIDDEN_FACIAL_TOKENS}
    assert not bad_sub, f"Forbidden underscore-split facial subtoken(s) found: {sorted(bad_sub)}"

    for c in cases_list:
        cid = c["case_id"]
        slug = cid.split("_", 2)[2]
        assert len(c["agents"]) == 4
        for ag in c["agents"]:
            assert ag["agent_id"].startswith(f"{slug}_"), f"{ag['agent_id']} missing {slug}_ prefix"
            for tok in re.split(r"[_\-\s]+", ag["agent_id"].lower()):
                assert tok not in FORBIDDEN_GENERIC_ROLES
                assert tok not in FORBIDDEN_FACIAL_TOKENS
        assert len(c["CHECKPOINT_LAWFUL_A"]["world_trace"][0]["offscreen_world"]) == 3
        assert len(c["CHECKPOINT_LAWFUL_A"]["accumulator_dag"]["conflict_grains"]) >= 1
        assert len(c["BRANCH_CLINAMEN_A_PRIME"]["accumulator_dag"]["conflict_grains"]) >= 1
        assert len(c["divergence_audit"]["changed_actions"]) >= 1
        assert len(c["divergence_audit"]["flipped_policies"]) == 4

    banned_stem_re = re.compile(
        r"\b(tragic\w*|innovat\w*|holist\w*|seamless\w*|genuin\w*|honest\w*|straightforward\w*)\b",
        re.IGNORECASE,
    )
    stem_hit = banned_stem_re.search(raw_json)
    assert not stem_hit, f"Banned filler stem found: {stem_hit.group(0)!r}"

    facial_stem_re = re.compile(
        r"\b(eye\w*|mouth\w*|smil\w*|frown\w*|eyebrow\w*|pupil\w*|lips)\b",
        re.IGNORECASE,
    )
    fstem_hit = facial_stem_re.search(raw_json)
    assert not fstem_hit, f"Facial stem token found: {fstem_hit.group(0)!r}"

    from scion_cities.core.flour_proof import build_flour_proof_case
    from scion_cities.core.scion_engine import build_studio_bundle, validate_kinematic_intentions
    from scion_cities.swarms.catalog_55 import CITIES_55
    from scion_cities.swarms.pack_02_signs_thin import build_pack_02_swarms
    from scion_cities.swarms.proof_zaira import build_zaira_proof_city

    cat_map = {c.index: c for c in CITIES_55}
    for sp, cd in zip(specs_list, cases_list):
        cat = cat_map[sp.city_index]
        assert (sp.city_name, sp.chapter, sp.series, sp.series_rank, sp.weaver_page) == (
            cat.name, cat.chapter, cat.series, cat.rank, cat.weaver_page
        )
        assert cd["CHECKPOINT_LAWFUL_A"]["lawful_verified"] is True
        assert (
            cd["BRANCH_CLINAMEN_A_PRIME"]["branch_lineage"]["parent_checkpoint_id"]
            == cd["CHECKPOINT_LAWFUL_A"]["checkpoint_id"]
        )
        for br_key in ("CHECKPOINT_LAWFUL_A", "BRANCH_CLINAMEN_A_PRIME"):
            wt = cd[br_key]["world_trace"]
            validate_kinematic_intentions(wt)
            for frame in wt:
                assert len(frame["offscreen_world"]) >= 3
                for af in frame["actors"].values():
                    assert 0.97 <= float(af["area_ratio"]) <= 1.03
            for sb in cd[br_key]["sensory_bus"]:
                assert 0.0 <= float(sb["sync_frame_delta_ms"]) <= 16.7

    joint_builder = ScionSwarmBuilder()
    flour_case = build_flour_proof_case(builder=joint_builder)
    zaira_case = build_zaira_proof_city(builder=joint_builder)
    pack02_cases = build_pack_02_swarms(builder=joint_builder)
    pack05_cases = build_pack_05_swarms(builder=joint_builder)
    joint_disjoint = joint_builder.verify_global_disjointness()
    assert joint_disjoint["disjoint_verified"] is True and joint_disjoint["max_pairwise_jaccard"] == 0.0
    joint_bundle = build_studio_bundle(
        cities=sorted([zaira_case] + pack02_cases + pack05_cases, key=lambda item: int(item["city_index"])),
        proof_case=flour_case,
        output_path=None,
    )
    assert joint_bundle["global_invariants"]["roubaud_all_verified"] is True

    print(
        f"PACK 05 VERIFIED: {len(cases_list)} cities compiled | "
        f"agents={sum(len(c['agents']) for c in cases_list)} | "
        f"max_jaccard={disjoint_report['max_pairwise_jaccard']} | "
        f"facial_tokens=0 | banned_words=0 | quarantined=0"
    )
    for c in cases_list:
        g_a = len(c["CHECKPOINT_LAWFUL_A"]["accumulator_dag"]["conflict_grains"])
        g_b = len(c["BRANCH_CLINAMEN_A_PRIME"]["accumulator_dag"]["conflict_grains"])
        flips = len(c["divergence_audit"]["flipped_policies"])
        print(
            f"  - [{c['city_index']:02d}] {c['case_id']:22s} ({c['series']} #{c['series_rank']}, p.{c['weaver_page']:3d}) "
            f"grains=({g_a},{g_b}) flips={flips}/4 swerve=t{c['divergence_audit']['swerve_tick']}"
        )
