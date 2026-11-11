#!/usr/bin/env python3
"""
SCION v1.0 — Bespoke City-Swarm Pack 03:
Trading Cities (1–5) + Cities and eyes (1–5) — 10 Handmade Multi-Agent City Swarms.

Sorted by canonical Calvino city_index:
  1. city_15_euphemia  (Ch. 2, Trading cities 1, Weaver p. 36)
  2. city_19_chloe     (Ch. 3, Trading cities 2, Weaver p. 51)
  3. city_20_valdrada  (Ch. 3, Cities and eyes 1, Weaver p. 53)
  4. city_23_eutropia  (Ch. 4, Trading cities 3, Weaver p. 64)
  5. city_24_zemrude   (Ch. 4, Cities and eyes 2, Weaver p. 66)
  6. city_27_ersilia   (Ch. 5, Trading cities 4, Weaver p. 76)
  7. city_28_baucis    (Ch. 5, Cities and eyes 3, Weaver p. 77)
  8. city_31_esmeralda (Ch. 6, Trading cities 5, Weaver p. 88)
  9. city_32_phyllis   (Ch. 6, Cities and eyes 4, Weaver p. 90)
 10. city_36_moriana   (Ch. 7, Cities and eyes 5, Weaver p. 105)

Exports:
  - get_pack_03_specs() -> List[CitySwarmSpec]
  - build_pack_03_swarms(builder: Optional[ScionSwarmBuilder] = None) -> List[Dict[str, Any]]
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
    Deterministic constant-volume deliberate impulse trajectory for a city's ☉ SOURCE rig:
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
    hold_window: Tuple[int, int] = (3, 6),
) -> Dict[str, Any]:
    """Construct coupled audiovisual synthesis frame strictly within sync_frame_delta_ms <= 16.7."""
    h0, h1 = hold_window
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
        cloth_rustle_gain=0.05 if h0 <= t <= h1 else base_rustle,
        tape_hiss_flutter=base_hiss if t < push_tick else round(base_hiss + 0.07, 4),
        impact_angle_deg=(impact_deg * 0.72) if (branch_tag == "A_PRIME" and t == 20) else None,
        sub_thud_hz=(thud_hz + 9.0) if t == 20 else None,
        sync_frame_delta_ms=sync_ms,
    )


# ===========================================================================
# 1. CITY 15: EUPHEMIA (Ch. 2, Trading cities 1, Weaver p. 36)
# ===========================================================================

EUPHEMIA_BRAZIER_HUSKS: List[List[float]] = [
    [0.412, 0.584, 0.48],
    [0.446, 0.612, -0.77],
    [0.479, 0.576, 1.06],
    [0.514, 0.608, -0.38],
    [0.548, 0.590, 0.27],
]


def get_euphemia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="euphemia_seven_nation_fire_lighter",
            display_moniker="Solstice & Equinox Bale-Fire Vessel",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="ceramic_vessel",
            polarity="solstice_campfire_memory_swap",
            home_locus="equinox_campfire_circle",
            nisba_debt="Stokes nocturnal market fires beside carpet bales where merchants of seven nations trade memories",
            emblems=("solstice_equinox_gathering", "carpet_bale_firelight", "seven_nation_brazier"),
            base_magnitude=8.2,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="euphemia_ginger_muslin_factor",
            display_moniker="Yellow-Mat Spice & Muslin Steelyard",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="daylight_commodity_barter",
            home_locus="yellow_mat_quay",
            nisba_debt="Weighs ginger, cotton bolts, pistachio nuts, poppy seeds, and nutmegs beneath yellow-striped boat awnings",
            emblems=("ginger_and_cotton_holds", "pistachio_poppy_sacks", "golden_muslin_bolts"),
            base_magnitude=3.6,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="euphemia_trigger_word_teller",
            display_moniker="Wolf-and-Sister Firelight Sack",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="flour_sack",
            polarity="solstice_campfire_memory_swap",
            home_locus="equinox_campfire_circle",
            nisba_debt="Drops trigger nouns—wolf, sister, hidden treasure, battle, scabies, lovers—into the nocturnal circle",
            emblems=("wolf_tale", "sister_tale", "hidden_treasure_scabies_lovers"),
            base_magnitude=7.5,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="euphemia_memory_transmuter",
            display_moniker="Return-Caravan Memory Husk",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="hooded_husk",
            polarity="solstice_campfire_memory_swap",
            home_locus="swaying_return_caravan",
            nisba_debt="Rides swaying dromedaries and junks homeward discovering an alien wolf and different sister inside memory",
            emblems=("alien_wolf_in_memory", "different_sister_on_junk", "swapped_battle_scar"),
            base_magnitude=7.9,
            harmonic_ratio=(15, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Euphemia Quay Manifest & Nocturnal Memory Reciprocity Charter",
        passed_over_solution="Extinguishing the seven-nation solstice campfires or impounding ginger and nutmeg sacks",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in euphemia_memory_transmuter omits 'solstice_bale_ember_spark' and "
            "'trigger_word_wolf_sister_swap', recording the voyage home as a pure spice-and-muslin ledger "
            "even while 5 cracked nutmeg brazier husks and sesame lamp-oil stains persist on the quay."
        ),
        swerve_tick=11,
        witness_agent_id="euphemia_memory_transmuter",
        filtered_premises=("solstice_bale_ember_spark", "trigger_word_wolf_sister_swap"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Euphemia (Trading Cities 1, Weaver pp. 36-37): yellow-striped boat awnings, fly-covered "
            "yellow mats, ginger, cotton, pistachio, poppy seed, nutmeg, golden muslin, seven-nation fires, wolf/sister tales."
        ),
        "T2_lawful_rule": (
            "Merchants do not converge on Euphemia at every solstice and equinox merely to buy and sell sacks "
            "found in any identical bazaar, but to barter biographical memories around nocturnal carpet-bale fires."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the departing caravan memory-husk drops the campfire spark and wolf/sister "
            "word-exchange, treating Euphemia's assembly as ordinary daylight commodity clearance."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World keeps bale scuff_vector=[0.16, -0.06], 5 cracked nutmeg-and-poppy brazier husks, and cooling "
            "ember heat intact; ☾ Caravan witness pivots back toward the steelyard factor as a mere cargo clerk."
        ),
        "T5_institutional_consequence": (
            "Equinox Bourse Ledger P1-P4 flips from protecting untaxed nocturnal story-exchange and seven-nation "
            "hearth sanctuary to levying dry weight-and-bale customs as if Euphemia were any yellow-mat bazaar."
        ),
        "better_question_test": {
            "Original_Question": (
                "What volume of ginger, cotton, pistachio, and poppy seed makes the long voyage across rivers "
                "and valleys to Euphemia profitable for seven nations?"
            ),
            "Exposed_Assumption": (
                "Assumes mercantile convergence is governed by cargo arbitrage rather than the nocturnal "
                "transmutation of every merchant's remembered wolf, sister, and battle."
            ),
            "Discovered_Better_Question": (
                "When customs ledgers erase the solstice campfire words yet charred nutmeg husks still ring the "
                "carpet bales, what happens to a trading city once its merchants remember cargo weights but forget why they came?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.2 Hz | 38ms | ember crackle | Δbale=+0.160 | brazier_husks=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Seated against warm carpet bales at the equinox fire: you came to weigh golden muslin, yet one word—"
            "'wolf'—sends you swaying home on camelback carrying a stranger's sister inside your own past."
        ),
    }

    return CitySwarmSpec(
        case_id="city_15_euphemia",
        kind="invisible_city",
        city_index=15,
        city_name="Euphemia",
        title="EUPHEMIA — City of Memory Barter by Firelight (Trading Cities 1, Weaver pp. 36–37)",
        chapter=2,
        series="Trading cities",
        series_rank=1,
        weaver_page=36,
        desert_opposed="identical lying yellow-mat bazaars",
        optical_rule="Noon awning fly-shadow transmuting into nocturnal market-fire embers on carpet bales",
        material_nouns=(
            "yellow_striped_boat_awnings",
            "ginger_and_cotton_cargo",
            "pistachio_and_poppy_sacks",
            "nutmeg_and_golden_muslin",
            "equinox_carpet_bale_fires",
            "wolf_and_sister_tales",
            "scabies_and_battle_scars",
            "swaying_camel_return_trail",
        ),
        loci=("yellow_mat_quay", "equinox_campfire_circle", "swaying_return_caravan"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _euphemia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "seven_nation_junks_mooring_under_yellow_awnings",
            "state": "unloading_ginger_and_cotton_holds" if t < 10 else "banked_for_nocturnal_watch",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "bazaar_flies_lifting_from_yellow_quay_mats",
            "state": "dispersing_in_campfire_smoke" if t >= 8 else "circling_nutmeg_scales",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "camel_and_junk_return_convoy_horizon",
            "state": "swaying_with_transmuted_memories" if t >= 12 else "saddling_pack_frames",
            "progress": round(0.03 + t * 0.039, 4),
        },
    ]


def _euphemia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.18,
            "graphite_smudges": [[0.28, 0.62], [0.46, 0.58]],
        }
    return {
        "oil_radius": round(0.046 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.16, -0.06],
        "shards": copy.deepcopy(EUPHEMIA_BRAZIER_HUSKS),
        "thermal_ember": round(0.91 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.28, 0.62], [0.44, 0.59], [0.52, 0.60], [0.68, 0.54]],
    }


def build_euphemia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "euphemia_seven_nation_fire_lighter": [],
        "euphemia_ginger_muslin_factor": [],
        "euphemia_trigger_word_teller": [],
        "euphemia_memory_transmuter": [],
    }

    for t in range(TICK_COUNT):
        lighter = _source_push_kinematics(
            "euphemia_seven_nation_fire_lighter", t,
            idle_xy=(0.34, 0.58), push_xy=(0.48, 0.59), settle_xy=(0.40, 0.58),
            plane_depth=0.24,
            target_pre="euphemia_trigger_word_teller",
            target_post="euphemia_memory_transmuter",
            hold_window=(3, 6),
        )
        factor = make_actor_frame(
            "euphemia_ginger_muslin_factor", t,
            x=0.22, y=0.64 if t < 12 else 0.67, plane_depth=0.30,
            stretch_s=1.09 if t < 12 else 0.89,
            tilt_rad=0.05 if t < 12 else -0.21,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="euphemia_seven_nation_fire_lighter",
            exposure="twos",
        )
        teller = make_actor_frame(
            "euphemia_trigger_word_teller", t,
            x=0.52 if t < 8 else 0.55, y=0.60, plane_depth=0.20,
            stretch_s=0.95 if t < 8 else (1.16 if t >= 12 else 0.84),
            tilt_rad=0.06 if t < 8 else (0.22 if t >= 12 else -0.18),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "help"),
            target_actor="euphemia_memory_transmuter",
            exposure="hold" if t >= 19 else "twos",
        )
        if t <= 11:
            transmuter = make_actor_frame(
                "euphemia_memory_transmuter", t,
                x=0.74, y=0.52, plane_depth=0.22,
                stretch_s=1.02, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="euphemia_trigger_word_teller",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            transmuter = make_actor_frame(
                "euphemia_memory_transmuter", t,
                x=0.74 - 0.15 * u, y=0.52 + 0.04 * u, plane_depth=0.19,
                stretch_s=1.21, tilt_rad=-0.34,
                intention_kinematics="help",
                target_actor="euphemia_trigger_word_teller",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "euphemia_seven_nation_fire_lighter": lighter,
                "euphemia_ginger_muslin_factor": factor,
                "euphemia_trigger_word_teller": teller,
                "euphemia_memory_transmuter": transmuter,
            },
            "residues": _euphemia_residues(t),
            "offscreen_world": _euphemia_offscreen_world(t),
        })

        ev: List[str] = ["daylight_quay_spice_tally"]
        if t >= 8:
            ev.extend(["solstice_bale_ember_spark", "trigger_word_wolf_sister_swap"])
        if t >= 10:
            ev.append("seven_nation_memory_reciprocity")

        actor_memory["euphemia_seven_nation_fire_lighter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "igniting_carpet_bale_memory_circle" if t >= 8 else "stacking_equinox_kindling",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "euphemia_trigger_word_teller", "confidence": 0.97,
        })
        actor_memory["euphemia_ginger_muslin_factor"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "subordinating_quay_weights_to_nocturnal_tales" if t >= 12 else "weighing_pistachio_sacks",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "euphemia_seven_nation_fire_lighter", "confidence": 0.94,
        })
        actor_memory["euphemia_trigger_word_teller"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "circulating_wolf_sister_treasure_words" if t >= 9 else "listening_by_carpet_bales",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "euphemia_memory_transmuter", "confidence": 0.96,
        })
        actor_memory["euphemia_memory_transmuter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "carrying_swapped_wolf_and_sister_homeward" if t >= 12 else "attending_firelight_circle",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "euphemia_trigger_word_teller", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_15_euphemia", "A", t, 8, 11, 0.26, 0.20, 0.11, 33.0, 50.0, 1.4, (3, 6))
        )

    utterances_a = [
        (5, "euphemia_ginger_muslin_factor", "euphemia_seven_nation_fire_lighter", "yellow_mat_quay",
         "Under yellow-striped boat awnings, steelyards tally ginger, cotton bolts, pistachio, poppy seed, and nutmeg."),
        (5, "euphemia_seven_nation_fire_lighter", "euphemia_ginger_muslin_factor", "yellow_mat_quay",
         "Identical lying bazaars sell those sacks closer to home; seven nations sail here for solstice firelight."),
        (8, "euphemia_seven_nation_fire_lighter", "euphemia_trigger_word_teller", "equinox_campfire_circle",
         "Brazier thrust after 4-tick hold; bale scuff [+0.16, -0.06] scatters 5 nutmeg husks as 'wolf' and 'sister' sound."),
        (12, "euphemia_memory_transmuter", "euphemia_trigger_word_teller", "swaying_return_caravan",
         "Aboard the swaying dromedary, my wolf has turned into another wolf and my sister into a different sister."),
        (18, "euphemia_ginger_muslin_factor", "euphemia_memory_transmuter", "yellow_mat_quay",
         "Quay customs yields: nocturnal memory barter recognized above dry commodity tonnage across P1-P4."),
        (18, "euphemia_memory_transmuter", "euphemia_ginger_muslin_factor", "yellow_mat_quay",
         "Equinox hearth sanctuary sealed; seven nations trade lived pasts alongside golden muslin."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_euphemia_clinamen_a_prime(
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
        _city_sensory_frame("city_15_euphemia", "A_PRIME", sw, 8, sw, 0.26, 0.20, 0.11, 33.0, 50.0, 1.5, (3, 6))
    )
    for aid in actor_memory_b:
        if aid == "euphemia_memory_transmuter":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["daylight_quay_spice_tally", "dry_bale_tonnage_manifest"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "counting_only_ginger_and_cotton_bills_of_lading",
                "next_action": "reroute",
                "target_actor": "euphemia_ginger_muslin_factor",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        lighter = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["euphemia_seven_nation_fire_lighter"])
        factor = make_actor_frame(
            "euphemia_ginger_muslin_factor", t, 0.28, 0.58, 0.28, 1.25, 0.24,
            "accuse", "euphemia_seven_nation_fire_lighter", "hold" if t >= 20 else "twos",
        )
        teller = make_actor_frame(
            "euphemia_trigger_word_teller", t, 0.56, 0.66, 0.20, 0.79, -0.29,
            "avoid", "euphemia_ginger_muslin_factor", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        transmuter = make_actor_frame(
            "euphemia_memory_transmuter", t,
            0.74 - 0.36 * u, 0.52 + 0.10 * u, 0.24, 0.87, 0.33,
            "reroute", "euphemia_ginger_muslin_factor", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "euphemia_seven_nation_fire_lighter": lighter,
                "euphemia_ginger_muslin_factor": factor,
                "euphemia_trigger_word_teller": teller,
                "euphemia_memory_transmuter": transmuter,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["euphemia_seven_nation_fire_lighter"].append(
            copy.deepcopy(checkpoint_a.actor_memory["euphemia_seven_nation_fire_lighter"][t])
        )
        actor_memory_b["euphemia_ginger_muslin_factor"].append({
            "tick": t,
            "retained_events": ["daylight_quay_spice_tally", "dry_bale_tonnage_manifest"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "enforcing_strict_commodity_weight_tariff",
            "next_action": "accuse",
            "target_actor": "euphemia_seven_nation_fire_lighter",
            "confidence": 0.95,
        })
        actor_memory_b["euphemia_trigger_word_teller"].append({
            "tick": t,
            "retained_events": ["solstice_bale_ember_spark", "trigger_word_wolf_sister_swap"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "murmuring_unrecorded_wolf_tales_in_ash",
            "next_action": "avoid",
            "target_actor": "euphemia_ginger_muslin_factor",
            "confidence": 0.92,
        })
        actor_memory_b["euphemia_memory_transmuter"].append({
            "tick": t,
            "retained_events": ["daylight_quay_spice_tally", "dry_bale_tonnage_manifest"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "departing_with_unchanged_private_past_and_taxed_bales",
            "next_action": "reroute",
            "target_actor": "euphemia_ginger_muslin_factor",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_15_euphemia", "A_PRIME", t, 8, sw, 0.26, 0.20, 0.11, 33.0, 50.0, 1.7, (3, 6))
        )

    utterances_b = [
        (5, "euphemia_ginger_muslin_factor", "euphemia_seven_nation_fire_lighter", "yellow_mat_quay",
         "Under yellow-striped boat awnings, steelyards tally ginger, cotton bolts, pistachio, poppy seed, and nutmeg."),
        (5, "euphemia_seven_nation_fire_lighter", "euphemia_ginger_muslin_factor", "yellow_mat_quay",
         "Identical lying bazaars sell those sacks closer to home; seven nations sail here for solstice firelight."),
        (11, "euphemia_memory_transmuter", "euphemia_ginger_muslin_factor", "swaying_return_caravan",
         "⊣ FILTER on return trail: campfire words omitted; caravan manifest logs only nutmeg, poppy, and muslin weights."),
        (15, "euphemia_seven_nation_fire_lighter", "euphemia_trigger_word_teller", "equinox_campfire_circle",
         "♁ World retains all 5 cracked nutmeg brazier husks, [+0.16, -0.06] bale scuff, and cooling solstice embers."),
        (20, "euphemia_ginger_muslin_factor", "euphemia_seven_nation_fire_lighter", "yellow_mat_quay",
         "≡ Equinox Bourse Charter P1-P4 flipped: daylight weight tariff imposed; nocturnal fire circle taxed as storage."),
        (20, "euphemia_seven_nation_fire_lighter", "euphemia_ginger_muslin_factor", "yellow_mat_quay",
         "Ashes and sesame oil still ring the carpet bales even when merchants pretend they came only for cotton."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_euphemia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["euphemia_memory_transmuter"][-1]
    ret = set(wmem["retained_events"])
    swap_attested = "solstice_bale_ember_spark" in ret and "trigger_word_wolf_sister_swap" in ret
    w_in = f"scuff={res['scuff_vector']}, brazier_husks={shards}, sesame_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Solstice Seven-Nation Hearth Sanctuary",
            "formal_predicate": "caravan_attests(solstice_bale_ember_spark) ∧ husks >= 5 ⇒ EXEMPT_CAMPFIRE_RING",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "NOCTURNAL_MEMORY_BOURSE_PROTECTED" if swap_attested else "QUAY_COMMODITY_CUSTOMS_SOLE_LAW",
            "payout_status": "CAMPFIRE_BALE_CIRCLE_DUTY_FREE" if swap_attested else "NIGHT_WHARFAGE_SURCHARGE_LEVIED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Trigger-Word Reciprocity Covenant",
            "formal_predicate": "caravan_attests(trigger_word_wolf_sister_swap) ⇒ RECOGNIZE_BIOGRAPHICAL_BARTER",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "TRANSMUTED_WOLF_SISTER_LEDGER_VALID" if swap_attested else "UNWEIGHED_UTTERANCES_VOIDED",
            "payout_status": "SEVEN_NATION_SAFE_CONDUCT_ISSUED" if swap_attested else "STRICT_STEELYARD_BOND_REQUIRED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Yellow-Mat Awning Arbitration Precedence",
            "formal_predicate": "factor(yellow_mat_quay) ⊢ witness_scope ⇒ RANK_EXCHANGE_STRATA",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SPICE_CARGO_SUBORDINATE_TO_TALE_SWAP" if swap_attested else "DAYLIGHT_MUSLIN_FACTOR_SUPREME",
            "payout_status": "QUAY_BROKER_FEE_WAIVED" if swap_attested else "FULL_FACTORAGE_COMMISSION_PAID",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Charred Nutmeg Brazier Residue Audit",
            "formal_predicate": "husks >= 5 ∧ ¬caravan_attests(solstice_bale_ember_spark) ⇒ UNEXPLAINED_EMBER_SCAR",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "EQUINOX_FIRE_RING_CORROBORATED" if swap_attested else "ORPHANED_BRAZIER_ASH_FINED_AS_SPILLAGE",
            "payout_status": "FIREWOOD_STIPEND_GRANTED" if swap_attested else "BALE_SCORCH_DEMURRAGE_ASSESSED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 2. CITY 19: CHLOE (Ch. 3, Trading cities 2, Weaver p. 51)
# ===========================================================================

CHLOE_CORAL_SLATE_SPLINTERS: List[List[float]] = [
    [0.396, 0.492, -0.62],
    [0.432, 0.518, 0.84],
    [0.468, 0.486, -1.11],
    [0.504, 0.522, 0.43],
    [0.538, 0.498, -0.29],
]


def get_chloe_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="chloe_silent_arcade_consummator",
            display_moniker="Rain-Arcade Sightline Chord",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="taut_chord",
            polarity="untouched_chaste_vibration",
            home_locus="rain_arcade_shelter",
            nisba_debt="Shoots wordless arrows, stars, and triangles of imagined consummation beneath rain-darkened colonnades",
            emblems=("wordless_fingerless_orgy", "exhausted_arrow_star_triangles", "colonnade_rain_huddle"),
            base_magnitude=8.5,
            harmonic_ratio=(9, 5),
        ),
        ScionAgentSpec(
            agent_id="chloe_glance_polygon_drawer",
            display_moniker="Parasol & Coral-Twin Sightline Lens",
            afterlight_role="MEDIUM",
            role_symbol="▧",
            primary_op="CONCENTRATE",
            op_symbol="≫",
            rig_archetype="pinhead_lens",
            polarity="untouched_chaste_vibration",
            home_locus="parasol_coral_promenade",
            nisba_debt="Links twirling parasol girl, veiled trembling matron, tattooed giant, and coral-dressed twins by glance",
            emblems=("twirling_parasol_girl", "veiled_trembling_matron", "tattooed_giant", "coral_twins"),
            base_magnitude=7.5,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="chloe_cheetah_fan_combinator",
            display_moniker="Leashed Cheetah & Ostrich-Fan Stilt",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="bamboo_stilt",
            polarity="untouched_chaste_vibration",
            home_locus="bandstand_awning_nexus",
            nisba_debt="Permutes silent shelters between blind man's chained cheetah, ostrich-fan courtesan, and white-haired youth",
            emblems=("blind_man_leashed_cheetah", "ostrich_fan_courtesan", "white_haired_youth"),
            base_magnitude=6.9,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="chloe_realization_quarantine_guard",
            display_moniker="Chaste Carousel Silence Obverse",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="fantasy_stopping_contact",
            home_locus="rain_arcade_shelter",
            nisba_debt="Bars spoken greetings and brushed sleeves lest concrete acquaintance halt Chloe's phantom carousel",
            emblems=("forbidden_spoken_greeting", "protected_phantom_carousel", "unbrushed_sleeve_gap"),
            base_magnitude=2.5,
            harmonic_ratio=(16, 15),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Chloe Chaste Colonnade Non-Greeting & Sightline Vibration Rule",
        passed_over_solution="Walling off the bazaar colonnades or pairing strangers through municipal brokers",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in chloe_realization_quarantine_guard omits 'parasol_ferrule_paving_nick' and "
            "'cheetah_chain_arcade_vibration', licensing overt spoken bazaar greetings that freeze the phantom "
            "carousel even while 5 chipped coral-and-slate splinters remain on the wet arcade flags."
        ),
        swerve_tick=11,
        witness_agent_id="chloe_realization_quarantine_guard",
        filtered_premises=("parasol_ferrule_paving_nick", "cheetah_chain_arcade_vibration"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Chloe (Trading Cities 2, Weaver pp. 51-52): twirling parasol, veiled matron, tattooed giant, "
            "white-haired youth, coral twins, blind man with chained cheetah, ostrich-plume fan, rain under arcades."
        ),
        "T2_lawful_rule": (
            "Chloe is the chastest of mercantile cities: strangers imagine a thousand encounters without speaking "
            "or touching, sustaining high-voltage sightline polygons precisely because nothing is realized."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the colonnade silence-guard forgets the taut sightline nick and cheetah-chain "
            "tremor, permitting ordinary spoken greetings under the rain awning."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves ferrule scuff_vector=[0.14, 0.08], 5 coral-and-slate splinters, and camellia parasol "
            "oil drip on wet stone; ☾ Guard drops chaste distance, dissolving the silent sightline web."
        ),
        "T5_institutional_consequence": (
            "Arcade Chastity Ledger P1-P4 flips from protecting wordless promenade anonymity and unconsummated "
            "sightline velocity to registering spoken mercantile introductions that collapse the phantom carousel."
        ),
        "better_question_test": {
            "Original_Question": (
                "Why do strangers sheltering together from the rain under Chloe's bazaar arcades never exchange "
                "a single greeting or turn their imagined passions into acquaintance?"
            ),
            "Exposed_Assumption": (
                "Assumes spoken contact fulfills silent urban attraction rather than extinguishing the combinatorics "
                "that keep every passerby suspended in a thousand simultaneous lives."
            ),
            "Discovered_Better_Question": (
                "Once a spoken greeting under the wet arcade collapses Chloe's silent triangles yet coral beads and "
                "ferrule nicks still scar the paving, can ordinary conversation ever replace the phantom carousel it stopped?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 31ms | rain patter + chain clink | Δferrule=+0.140 | splinters=5 | Δt_sync=1.2ms",
        "thick_over_the_shoulder": (
            "Under the rain-darkened colonnade beside the chained cheetah and ostrich fan: three silent glances "
            "complete a whole lifetime in two seconds, provided nobody ruins it by saying good afternoon."
        ),
    }

    return CitySwarmSpec(
        case_id="city_19_chloe",
        kind="invisible_city",
        city_index=19,
        city_name="Chloe",
        title="CHLOE — City of Chaste Vibrating Glances (Trading Cities 2, Weaver pp. 51–52)",
        chapter=3,
        series="Trading cities",
        series_rank=2,
        weaver_page=51,
        desert_opposed="clumsy consummated interpersonal friction",
        optical_rule="Rain-darkened bazaar arcade streaked by darting geometric sightline vectors between strangers",
        material_nouns=(
            "twirling_shoulder_parasol",
            "coral_dressed_twins",
            "tattooed_bazaar_giant",
            "rain_darkened_colonnade",
            "chained_cheetah_collar",
            "ostrich_plume_fan",
            "bandstand_awning_puddle",
            "silent_glance_triangles",
        ),
        loci=("parasol_coral_promenade", "rain_arcade_shelter", "bandstand_awning_nexus"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _chloe_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "cloudburst_runoff_streaming_off_arcade_gutters",
            "state": "curtaining_colonnade_arches" if t >= 7 else "darkening_pavement_slates",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "chained_cheetah_tail_arc_beneath_bandstand_awning",
            "state": "holding_taut_bronze_leash" if t >= 8 else "pacing_dry_plinth",
            "progress": round(0.04 + t * 0.037, 4),
        },
        {
            "entity": "coral_twins_and_parasol_promenade_rotation",
            "state": "recombining_silent_star_polygons" if t >= 10 else "converging_for_rain_shelter",
            "progress": round(0.06 + t * 0.038, 4),
        },
    ]


def _chloe_residues(t: int) -> Dict[str, Any]:
    if t < 7:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.16,
            "graphite_smudges": [[0.32, 0.48], [0.54, 0.50]],
        }
    return {
        "oil_radius": round(0.042 + (t - 7) * 0.008, 4),
        "scuff_vector": [0.14, 0.08],
        "shards": copy.deepcopy(CHLOE_CORAL_SLATE_SPLINTERS),
        "thermal_ember": round(0.85 * (0.94 ** (t - 7)), 4),
        "graphite_smudges": [[0.32, 0.48], [0.44, 0.50], [0.54, 0.50], [0.66, 0.47]],
    }


def build_chloe_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "chloe_silent_arcade_consummator": [],
        "chloe_glance_polygon_drawer": [],
        "chloe_cheetah_fan_combinator": [],
        "chloe_realization_quarantine_guard": [],
    }

    for t in range(TICK_COUNT):
        consummator = _source_push_kinematics(
            "chloe_silent_arcade_consummator", t,
            idle_xy=(0.30, 0.49), push_xy=(0.45, 0.51), settle_xy=(0.35, 0.49),
            plane_depth=0.22,
            target_pre="chloe_cheetah_fan_combinator",
            target_post="chloe_realization_quarantine_guard",
            hold_window=(2, 5),
        )
        drawer = make_actor_frame(
            "chloe_glance_polygon_drawer", t,
            x=0.24, y=0.40, plane_depth=0.28,
            stretch_s=1.14 if t >= 8 else 1.02,
            tilt_rad=0.14 if t >= 8 else 0.03,
            intention_kinematics="hold_still" if t >= 13 else "idle",
            target_actor="chloe_cheetah_fan_combinator",
            exposure="hold" if t >= 19 else "twos",
        )
        combinator = make_actor_frame(
            "chloe_cheetah_fan_combinator", t,
            x=0.55 if t < 7 else 0.58, y=0.53, plane_depth=0.24,
            stretch_s=0.96 if t < 7 else (0.82 if t <= 10 else 1.12),
            tilt_rad=-0.05 if t < 7 else (-0.24 if t <= 10 else 0.16),
            intention_kinematics="idle" if t < 7 else ("recoil" if t <= 10 else "avoid"),
            target_actor="chloe_realization_quarantine_guard",
            exposure="twos",
        )
        if t <= 11:
            guard = make_actor_frame(
                "chloe_realization_quarantine_guard", t,
                x=0.72, y=0.50, plane_depth=0.18,
                stretch_s=1.04, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 8 else "hold_still",
                target_actor="chloe_silent_arcade_consummator",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            guard = make_actor_frame(
                "chloe_realization_quarantine_guard", t,
                x=0.72 - 0.14 * u, y=0.50 - 0.03 * u, plane_depth=0.18,
                stretch_s=1.23, tilt_rad=-0.35,
                intention_kinematics="accuse",
                target_actor="chloe_cheetah_fan_combinator",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (6, 7, 8) else ("hold" if (2 <= t <= 5 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "chloe_silent_arcade_consummator": consummator,
                "chloe_glance_polygon_drawer": drawer,
                "chloe_cheetah_fan_combinator": combinator,
                "chloe_realization_quarantine_guard": guard,
            },
            "residues": _chloe_residues(t),
            "offscreen_world": _chloe_offscreen_world(t),
        })

        ev: List[str] = ["colonnade_cloudburst_huddle"]
        if t >= 7:
            ev.extend(["parasol_ferrule_paving_nick", "cheetah_chain_arcade_vibration"])
        if t >= 9:
            ev.append("wordless_arrow_triangle_closure")

        actor_memory["chloe_silent_arcade_consummator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "sustaining_wordless_arcade_triangles" if t >= 7 else "gathering_under_wet_arch",
            "next_action": "deliberate_push" if t in (7, 8) else "idle",
            "target_actor": "chloe_realization_quarantine_guard", "confidence": 0.97,
        })
        actor_memory["chloe_glance_polygon_drawer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "linking_parasol_coral_giant_vectors" if t >= 8 else "tracking_promenade_silhouettes",
            "next_action": "idle",
            "target_actor": "chloe_cheetah_fan_combinator", "confidence": 0.96,
        })
        actor_memory["chloe_cheetah_fan_combinator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "holding_unbrushed_ostrich_fan_gap" if t >= 11 else "sheltering_chained_cheetah",
            "next_action": "avoid" if t >= 11 else "idle",
            "target_actor": "chloe_realization_quarantine_guard", "confidence": 0.95,
        })
        actor_memory["chloe_realization_quarantine_guard"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "enforcing_total_speech_abstinence_for_carousel" if t >= 12 else "auditing_sleeve_clearance",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "chloe_cheetah_fan_combinator", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_19_chloe", "A", t, 7, 11, 0.30, 0.17, 0.12, 29.0, 56.0, 1.2, (2, 5))
        )

    utterances_a = [
        (4, "chloe_silent_arcade_consummator", "chloe_realization_quarantine_guard", "rain_arcade_shelter",
         "Sudden rain crowds parasol girl, coral twins, tattooed giant, and chained cheetah beneath one colonnade."),
        (4, "chloe_realization_quarantine_guard", "chloe_silent_arcade_consummator", "rain_arcade_shelter",
         "Neither spoken syllable nor brushed sleeve may cross the stone gap lest the phantom carousel halt."),
        (7, "chloe_silent_arcade_consummator", "chloe_cheetah_fan_combinator", "rain_arcade_shelter",
         "Sightline chord snapped taut after 4-tick stillness; ferrule nick [+0.14, +0.08] scatters 5 coral-slate splinters."),
        (12, "chloe_glance_polygon_drawer", "chloe_realization_quarantine_guard", "parasol_coral_promenade",
         "Silent arrows, stars, and triangles close cleanly between ostrich-plume fan and white-haired youth."),
        (18, "chloe_realization_quarantine_guard", "chloe_silent_arcade_consummator", "rain_arcade_shelter",
         "Chaste promenade seal upheld: zero spoken greetings logged; vibration field preserved across P1-P4."),
        (18, "chloe_silent_arcade_consummator", "chloe_realization_quarantine_guard", "rain_arcade_shelter",
         "Thousand unconsummated permutations continue vibrating across Chloe's wet bazaar arcades."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_chloe_clinamen_a_prime(
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
        _city_sensory_frame("city_19_chloe", "A_PRIME", sw, 7, sw, 0.30, 0.17, 0.12, 29.0, 56.0, 1.4, (2, 5))
    )
    for aid in actor_memory_b:
        if aid == "chloe_realization_quarantine_guard":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["colonnade_cloudburst_huddle", "spoken_awning_introduction"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "licensing_aloud_mercantile_greetings_under_awning",
                "next_action": "help",
                "target_actor": "chloe_cheetah_fan_combinator",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        consummator = make_actor_frame(
            "chloe_silent_arcade_consummator", t, 0.28, 0.54, 0.22, 0.77, -0.28,
            "recoil", "chloe_glance_polygon_drawer", "twos",
        )
        drawer = make_actor_frame(
            "chloe_glance_polygon_drawer", t, 0.22, 0.44, 0.28, 0.85, -0.20,
            "avoid", "chloe_realization_quarantine_guard", "twos",
        )
        combinator = make_actor_frame(
            "chloe_cheetah_fan_combinator", t, 0.60, 0.50, 0.24, 1.18, 0.25,
            "help", "chloe_realization_quarantine_guard", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        guard = make_actor_frame(
            "chloe_realization_quarantine_guard", t,
            0.72 + 0.12 * u, 0.50 + 0.06 * u, 0.20, 0.88, 0.31,
            "help", "chloe_cheetah_fan_combinator", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "chloe_silent_arcade_consummator": consummator,
                "chloe_glance_polygon_drawer": drawer,
                "chloe_cheetah_fan_combinator": combinator,
                "chloe_realization_quarantine_guard": guard,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["chloe_silent_arcade_consummator"].append({
            "tick": t,
            "retained_events": ["parasol_ferrule_paving_nick", "cheetah_chain_arcade_vibration"],
            "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "recoiling_as_spoken_words_halt_phantom_carousel",
            "next_action": "avoid",
            "target_actor": "chloe_glance_polygon_drawer",
            "confidence": 0.93,
        })
        actor_memory_b["chloe_glance_polygon_drawer"].append({
            "tick": t,
            "retained_events": ["colonnade_cloudburst_huddle", "spoken_awning_introduction"],
            "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "watching_sightline_polygons_slacken_into_smalltalk",
            "next_action": "reroute",
            "target_actor": "chloe_realization_quarantine_guard",
            "confidence": 0.91,
        })
        actor_memory_b["chloe_cheetah_fan_combinator"].append({
            "tick": t,
            "retained_events": ["colonnade_cloudburst_huddle", "spoken_awning_introduction"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "exchanging_banal_rain_remarks_under_bandstand",
            "next_action": "help",
            "target_actor": "chloe_realization_quarantine_guard",
            "confidence": 0.94,
        })
        actor_memory_b["chloe_realization_quarantine_guard"].append({
            "tick": t,
            "retained_events": ["colonnade_cloudburst_huddle", "spoken_awning_introduction"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "ratifying_overt_bazaar_introductions",
            "next_action": "help",
            "target_actor": "chloe_cheetah_fan_combinator",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_19_chloe", "A_PRIME", t, 7, sw, 0.30, 0.17, 0.12, 29.0, 56.0, 1.6, (2, 5))
        )

    utterances_b = [
        (4, "chloe_silent_arcade_consummator", "chloe_realization_quarantine_guard", "rain_arcade_shelter",
         "Sudden rain crowds parasol girl, coral twins, tattooed giant, and chained cheetah beneath one colonnade."),
        (4, "chloe_realization_quarantine_guard", "chloe_silent_arcade_consummator", "rain_arcade_shelter",
         "Neither spoken syllable nor brushed sleeve may cross the stone gap lest the phantom carousel halt."),
        (11, "chloe_realization_quarantine_guard", "chloe_cheetah_fan_combinator", "rain_arcade_shelter",
         "⊣ FILTER under wet awning: sightline tremor omitted; strangers exchange aloud bazaar introductions."),
        (15, "chloe_silent_arcade_consummator", "chloe_glance_polygon_drawer", "parasol_coral_promenade",
         "♁ World retains all 5 coral-and-slate splinters, [+0.14, +0.08] ferrule nick, and camellia parasol oil."),
        (20, "chloe_realization_quarantine_guard", "chloe_silent_arcade_consummator", "rain_arcade_shelter",
         "≡ Arcade Chastity Ledger P1-P4 flipped: spoken acquaintance ratified; silent sightline protection revoked."),
        (20, "chloe_silent_arcade_consummator", "chloe_realization_quarantine_guard", "rain_arcade_shelter",
         "One spoken greeting collapsed the star-triangles, though coral beads still glint on the wet paving."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_chloe_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["chloe_realization_quarantine_guard"][-1]
    ret = set(wmem["retained_events"])
    vibration_kept = "parasol_ferrule_paving_nick" in ret and "cheetah_chain_arcade_vibration" in ret
    w_in = f"scuff={res['scuff_vector']}, coral_splinters={shards}, parasol_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Colonnade Unspoken Anonymity Ordinance",
            "formal_predicate": "guard_attests(cheetah_chain_arcade_vibration) ∧ splinters >= 5 ⇒ BAR_SPOKEN_GREETING",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CHASTE_VIBRATION_ANONYMITY_ENFORCED" if vibration_kept else "ALOUD_ARCADE_ACQUAINTANCE_PERMITTED",
            "payout_status": "SILENT_PROMENADE_IMMUNITY_ACTIVE" if vibration_kept else "BROKERED_INTRODUCTION_FEE_COLLECTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Phantom Carousel Polygon Continuity",
            "formal_predicate": "guard_attests(parasol_ferrule_paving_nick) ⇒ PRESERVE_SIGHTLINE_TRIANGLES",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "ARROW_STAR_TRIANGLE_WEB_INTACT" if vibration_kept else "PHANTOM_CAROUSEL_ARRESTED_BY_SPEECH",
            "payout_status": "AWNING_SHELTER_UNTETHERED" if vibration_kept else "STALL_CONVERSATION_PERMIT_ISSUED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Bandstand Cheetah & Ostrich-Fan Clearance",
            "formal_predicate": "combinator(bandstand_awning_nexus) ⊢ witness_scope ⇒ ENFORCE_SLEEVE_GAP",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "UNBRUSHED_SLEEVE_CLEARANCE_UPHELD" if vibration_kept else "ORDINARY_BARTER_HANDSHAKE_NORMALIZED",
            "payout_status": "CHASTE_CLEARANCE_BOND_HELD" if vibration_kept else "CLEARANCE_BOND_RELEASED_TO_MERCHANTS",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Wet Paving Coral-Bead & Ferrule Audit",
            "formal_predicate": "splinters >= 5 ∧ ¬guard_attests(parasol_ferrule_paving_nick) ⇒ MUTE_PROMENADE_TRACE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "FERRULE_TENSION_SCAR_ATTESTED" if vibration_kept else "CORAL_SPLINTERS_SWEPT_AS_RAIN_DEBRIS",
            "payout_status": "SLATE_PAVING_PRESERVED" if vibration_kept else "ARCADE_SWEEPING_LEVY_CHARGED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 3. CITY 20: VALDRADA (Ch. 3, Cities and eyes 1, Weaver p. 53)
# ===========================================================================

VALDRADA_PARAPET_TRAVERTINE: List[List[float]] = [
    [0.442, 0.458, 0.71],
    [0.474, 0.486, -0.93],
    [0.508, 0.448, 1.18],
    [0.542, 0.479, -0.47],
    [0.576, 0.462, 0.34],
]


def get_valdrada_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="valdrada_flesh_dagger_actor",
            display_moniker="Upper-Veranda Parapet Impactor",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="erect_parapet_action",
            home_locus="specular_water_plane",
            nisba_debt="Executes irreversible upper-city embraces and blade thrusts over railed cliffside verandas",
            emblems=("twisted_lovers_skin", "tendon_blade_black_blood", "cliffside_parapet_thrust"),
            base_magnitude=8.6,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="valdrada_veranda_parapet_builder",
            display_moniker="Stacked Fluted Veranda Plumb",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="plumb_bob",
            polarity="erect_parapet_action",
            home_locus="tiered_lake_verandas",
            nisba_debt="Stacks railed cliffside balustrades and fluted facades directly overhanging the pitch-clear lake",
            emblems=("stacked_railed_verandas", "fluted_lake_facades", "travertine_balustrade_scar"),
            base_magnitude=7.6,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="valdrada_loveless_gaze_interlocker",
            display_moniker="Wardrobe & Ceiling Specular Lens",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="pinhead_lens",
            polarity="limpid_inverted_lake_image",
            home_locus="wardrobe_interior_ceiling",
            nisba_debt="Couples interior ceiling reliefs to wardrobe mirrors so no room escapes Valdrada's twin accounting",
            emblems=("reflected_wardrobe_mirrors", "interlocked_loveless_gazes", "ceiling_gesso_relief"),
            base_magnitude=7.1,
            harmonic_ratio=(15, 8),
        ),
        ScionAgentSpec(
            agent_id="valdrada_limpid_mirror_inverter",
            display_moniker="Lacustrine Inverted Twin Obverse",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="limpid_inverted_lake_image",
            home_locus="specular_water_plane",
            nisba_debt="Repeats every veranda gesture upside down in cold limpid water where nothing stays symmetrical in value",
            emblems=("cold_limpid_image_dignity", "point_by_point_asymmetry", "submerged_inverted_twin"),
            base_magnitude=2.4,
            harmonic_ratio=(8, 5),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Valdrada Asymmetric Specular Valuation & Dual-City Witness Code",
        passed_over_solution="Draining the cliffside lake or boarding shut the railed veranda balustrades",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in valdrada_limpid_mirror_inverter omits 'upper_parapet_balustrade_gouge' and "
            "'spontaneous_veranda_weight_shift', enthroning the cold inverted lake reflection as sole dignified "
            "reality while 5 chipped travertine balustrade shards persist on the upper veranda sill."
        ),
        swerve_tick=12,
        witness_agent_id="valdrada_limpid_mirror_inverter",
        filtered_premises=("upper_parapet_balustrade_gouge", "spontaneous_veranda_weight_shift"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Valdrada (Cities & Optics 1, Weaver pp. 53-54): stacked cliffside verandas, railed parapets, "
            "fluted facades, ceiling reliefs in wardrobe mirrors, intertwined skin, blade on black neck veins, twin lake city."
        ),
        "T2_lawful_rule": (
            "Nothing happens in erect Valdrada without repeating in inverted Valdrada below the lake, yet the two "
            "cities are never equal because the mirror either heightens or denies the value of upper-city acts."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in the lacustrine mirror-inverter drops the upper parapet gouge and live weight "
            "shift, ruling that inhabitants live solely for the cold limpid image below."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World retains parapet scuff_vector=[0.18, -0.11], 5 travertine balustrade shards, and dark lamp-oil "
            "film on stone; ☾ Lake witness freezes upper impulse into subordinate choreography for the mirror."
        ),
        "T5_institutional_consequence": (
            "Lacustrine Valuation Tribunal P1-P4 flips from weighing asymmetric tension between live veranda act "
            "and specular double to subordinating upper Valdrada as a mere servant of its underwater reflection."
        ),
        "better_question_test": {
            "Original_Question": (
                "Does the clear lake beneath Valdrada faithfully duplicate every embrace and dagger blow performed "
                "on its stacked cliffside verandas?"
            ),
            "Exposed_Assumption": (
                "Treats geometric point-for-point reflection as value symmetry rather than an unforgiving optical "
                "witness that strips every upper-city gesture of forgetfulness and chance."
            ),
            "Discovered_Better_Question": (
                "When civic law enthrones the cold inverted lake image yet travertine shards still litter the upper "
                "parapet, can any veranda gesture remain uncalculated once it exists only to compose its reflection?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.0 Hz | 40ms | cold water slap | Δparapet=+0.180 | travertine_shards=5 | Δt_sync=1.3ms",
        "thick_over_the_shoulder": (
            "Leaning over Valdrada's railed cliff parapet: even before your hand settles on the stone, its upside-down "
            "double in the pitch-black water has already judged whether the gesture possesses dignity."
        ),
    }

    return CitySwarmSpec(
        case_id="city_20_valdrada",
        kind="invisible_city",
        city_index=20,
        city_name="Valdrada",
        title="VALDRADA — Twin City Over the Specular Lake (Cities & Optics 1, Weaver pp. 53–54)",
        chapter=3,
        series="Cities and eyes",
        series_rank=1,
        weaver_page=53,
        desert_opposed="unwitnessed forgetful spontaneity",
        optical_rule="Railed cliffside verandas doubled down into razor-cold, pitch-clear lacustrine specular inversion",
        material_nouns=(
            "stacked_cliffside_verandas",
            "railed_iron_parapets",
            "fluted_travertine_facades",
            "wardrobe_ceiling_mirrors",
            "pitch_clear_lake_plane",
            "inverted_underwater_twin",
            "parapet_dagger_blade",
            "specular_value_asymmetry",
        ),
        loci=("tiered_lake_verandas", "wardrobe_interior_ceiling", "specular_water_plane"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _valdrada_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "lacustrine_thermocline_glass_calm",
            "state": "sharpening_inverted_cornices" if t >= 9 else "clearing_dawn_ripple",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "wardrobe_beveled_mirror_shutters_indoors",
            "state": "doubling_ceiling_gesso_scrolls" if t >= 11 else "swinging_on_brass_pins",
            "progress": round(0.05 + t * 0.036, 4),
        },
        {
            "entity": "cliffside_parapet_lantern_reflections",
            "state": "hanging_inverted_in_black_depth" if t >= 12 else "kindling_along_verandas",
            "progress": round(0.06 + t * 0.038, 4),
        },
    ]


def _valdrada_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.15,
            "graphite_smudges": [[0.38, 0.44], [0.52, 0.48]],
        }
    return {
        "oil_radius": round(0.047 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.18, -0.11],
        "shards": copy.deepcopy(VALDRADA_PARAPET_TRAVERTINE),
        "thermal_ember": round(0.87 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.38, 0.44], [0.46, 0.46], [0.52, 0.48], [0.60, 0.52]],
    }


def build_valdrada_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "valdrada_flesh_dagger_actor": [],
        "valdrada_veranda_parapet_builder": [],
        "valdrada_loveless_gaze_interlocker": [],
        "valdrada_limpid_mirror_inverter": [],
    }

    for t in range(TICK_COUNT):
        actor = _source_push_kinematics(
            "valdrada_flesh_dagger_actor", t,
            idle_xy=(0.36, 0.42), push_xy=(0.51, 0.47), settle_xy=(0.43, 0.44),
            plane_depth=0.25,
            target_pre="valdrada_limpid_mirror_inverter",
            target_post="valdrada_loveless_gaze_interlocker",
            hold_window=(3, 6),
        )
        builder = make_actor_frame(
            "valdrada_veranda_parapet_builder", t,
            x=0.26, y=0.38, plane_depth=0.28,
            stretch_s=1.11 if t >= 9 else 1.01,
            tilt_rad=0.09 if t >= 9 else 0.02,
            intention_kinematics="help" if t >= 12 else "idle",
            target_actor="valdrada_flesh_dagger_actor",
            exposure="twos",
        )
        interlocker = make_actor_frame(
            "valdrada_loveless_gaze_interlocker", t,
            x=0.64, y=0.36 if t < 13 else 0.40, plane_depth=0.30,
            stretch_s=1.06 if t < 13 else 0.88,
            tilt_rad=-0.04 if t < 13 else -0.22,
            intention_kinematics="idle" if t < 13 else "recoil",
            target_actor="valdrada_flesh_dagger_actor",
            exposure="twos",
        )
        if t <= 12:
            inverter = make_actor_frame(
                "valdrada_limpid_mirror_inverter", t,
                x=0.52, y=0.68, plane_depth=0.16,
                stretch_s=0.98, tilt_rad=-0.08,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="valdrada_flesh_dagger_actor",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 12) / 6.0)
            inverter = make_actor_frame(
                "valdrada_limpid_mirror_inverter", t,
                x=0.52 - 0.10 * u, y=0.68 - 0.08 * u, plane_depth=0.18,
                stretch_s=1.20, tilt_rad=-0.33,
                intention_kinematics="accuse",
                target_actor="valdrada_flesh_dagger_actor",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "valdrada_flesh_dagger_actor": actor,
                "valdrada_veranda_parapet_builder": builder,
                "valdrada_loveless_gaze_interlocker": interlocker,
                "valdrada_limpid_mirror_inverter": inverter,
            },
            "residues": _valdrada_residues(t),
            "offscreen_world": _valdrada_offscreen_world(t),
        })

        ev: List[str] = ["stacked_veranda_lake_coupling"]
        if t >= 8:
            ev.extend(["upper_parapet_balustrade_gouge", "spontaneous_veranda_weight_shift"])
        if t >= 10:
            ev.append("asymmetric_specular_counterweight")

        actor_memory["valdrada_flesh_dagger_actor"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "asserting_live_upper_parapet_impulse" if t >= 8 else "poised_at_cliff_railing",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "valdrada_limpid_mirror_inverter", "confidence": 0.97,
        })
        actor_memory["valdrada_veranda_parapet_builder"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "bearing_chipped_travertine_parapet_load" if t >= 9 else "plumbing_cliff_balustrades",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "valdrada_flesh_dagger_actor", "confidence": 0.96,
        })
        actor_memory["valdrada_loveless_gaze_interlocker"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "recording_non_equal_twin_valuation" if t >= 13 else "aligning_wardrobe_mirrors",
            "next_action": "avoid" if t >= 13 else "idle",
            "target_actor": "valdrada_flesh_dagger_actor", "confidence": 0.95,
        })
        actor_memory["valdrada_limpid_mirror_inverter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_asymmetric_split_between_stone_and_lake" if t >= 13 else "inverting_fluted_facades",
            "next_action": "accuse" if t >= 13 else "idle",
            "target_actor": "valdrada_flesh_dagger_actor", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_20_valdrada", "A", t, 8, 12, 0.25, 0.16, 0.10, 38.0, 46.0, 1.3, (3, 6))
        )

    utterances_a = [
        (5, "valdrada_flesh_dagger_actor", "valdrada_limpid_mirror_inverter", "specular_water_plane",
         "Upper Valdrada leans over railed cliffside verandas where flesh twists and blades strike live stone."),
        (5, "valdrada_limpid_mirror_inverter", "valdrada_flesh_dagger_actor", "specular_water_plane",
         "Inverted Valdrada below the pitch-clear lake repeats every contour, yet grants nothing symmetrical value."),
        (8, "valdrada_flesh_dagger_actor", "valdrada_veranda_parapet_builder", "tiered_lake_verandas",
         "Parapet lunge after 4-tick hold; balustrade gouge [+0.18, -0.11] drops 5 travertine shards beside dark oil."),
        (13, "valdrada_limpid_mirror_inverter", "valdrada_loveless_gaze_interlocker", "specular_water_plane",
         "Lake plane registers both the live parapet scar above and its cold inverted double below."),
        (19, "valdrada_flesh_dagger_actor", "valdrada_limpid_mirror_inverter", "specular_water_plane",
         "Dual-city asymmetry upheld: upper stone act and underwater image contend without collapsing into one."),
        (19, "valdrada_limpid_mirror_inverter", "valdrada_flesh_dagger_actor", "specular_water_plane",
         "Point-for-point non-equality sealed across P1-P4; neither twin Valdrada erases the other's weight."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_valdrada_clinamen_a_prime(
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
        _city_sensory_frame("city_20_valdrada", "A_PRIME", sw, 8, sw, 0.25, 0.16, 0.10, 38.0, 46.0, 1.5, (3, 6))
    )
    for aid in actor_memory_b:
        if aid == "valdrada_limpid_mirror_inverter":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["stacked_veranda_lake_coupling", "sovereign_limpid_image_decree"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "enthroning_cold_underwater_image_over_live_parapet",
                "next_action": "reroute",
                "target_actor": "valdrada_loveless_gaze_interlocker",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        actor = make_actor_frame(
            "valdrada_flesh_dagger_actor", t, 0.39, 0.46, 0.25, 0.80, -0.26,
            "avoid", "valdrada_veranda_parapet_builder", "twos",
        )
        builder = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["valdrada_veranda_parapet_builder"])
        interlocker = make_actor_frame(
            "valdrada_loveless_gaze_interlocker", t, 0.62, 0.34, 0.28, 1.26, 0.27,
            "hold_still", "valdrada_limpid_mirror_inverter", "hold" if t >= 20 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        inverter = make_actor_frame(
            "valdrada_limpid_mirror_inverter", t,
            0.52 + 0.15 * u, 0.68 + 0.06 * u, 0.16, 0.85, 0.34,
            "reroute", "valdrada_loveless_gaze_interlocker", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "valdrada_flesh_dagger_actor": actor,
                "valdrada_veranda_parapet_builder": builder,
                "valdrada_loveless_gaze_interlocker": interlocker,
                "valdrada_limpid_mirror_inverter": inverter,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["valdrada_flesh_dagger_actor"].append({
            "tick": t,
            "retained_events": ["upper_parapet_balustrade_gouge", "spontaneous_veranda_weight_shift"],
            "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "inhibited_from_unscripted_motion_above_lake",
            "next_action": "avoid",
            "target_actor": "valdrada_veranda_parapet_builder",
            "confidence": 0.92,
        })
        actor_memory_b["valdrada_veranda_parapet_builder"].append(
            copy.deepcopy(checkpoint_a.actor_memory["valdrada_veranda_parapet_builder"][t])
        )
        actor_memory_b["valdrada_loveless_gaze_interlocker"].append({
            "tick": t,
            "retained_events": ["stacked_veranda_lake_coupling", "sovereign_limpid_image_decree"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "locking_wardrobe_and_lake_mirrors_as_supreme_tribunal",
            "next_action": "help",
            "target_actor": "valdrada_limpid_mirror_inverter",
            "confidence": 0.95,
        })
        actor_memory_b["valdrada_limpid_mirror_inverter"].append({
            "tick": t,
            "retained_events": ["stacked_veranda_lake_coupling", "sovereign_limpid_image_decree"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "recognizing_only_inverted_specular_dignity",
            "next_action": "reroute",
            "target_actor": "valdrada_loveless_gaze_interlocker",
            "confidence": 0.91,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_20_valdrada", "A_PRIME", t, 8, sw, 0.25, 0.16, 0.10, 38.0, 46.0, 1.7, (3, 6))
        )

    utterances_b = [
        (5, "valdrada_flesh_dagger_actor", "valdrada_limpid_mirror_inverter", "specular_water_plane",
         "Upper Valdrada leans over railed cliffside verandas where flesh twists and blades strike live stone."),
        (5, "valdrada_limpid_mirror_inverter", "valdrada_flesh_dagger_actor", "specular_water_plane",
         "Inverted Valdrada below the pitch-clear lake repeats every contour, yet grants nothing symmetrical value."),
        (12, "valdrada_limpid_mirror_inverter", "valdrada_loveless_gaze_interlocker", "specular_water_plane",
         "⊣ FILTER on water plane: upper parapet impulse omitted; only the cold inverted image holds civic dignity."),
        (16, "valdrada_veranda_parapet_builder", "valdrada_flesh_dagger_actor", "tiered_lake_verandas",
         "♁ World retains all 5 chipped travertine balustrade shards, [+0.18, -0.11] gouge, and lamp-oil sheen."),
        (20, "valdrada_limpid_mirror_inverter", "valdrada_flesh_dagger_actor", "specular_water_plane",
         "≡ Lacustrine Valuation Tribunal P1-P4 flipped: upper verandas subordinated to underwater mirror canon."),
        (20, "valdrada_flesh_dagger_actor", "valdrada_limpid_mirror_inverter", "specular_water_plane",
         "Every veranda motion freezes under specular surveillance even as chipped stone rests on the upper sill."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_valdrada_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["valdrada_limpid_mirror_inverter"][-1]
    ret = set(wmem["retained_events"])
    dual_attested = "upper_parapet_balustrade_gouge" in ret and "spontaneous_veranda_weight_shift" in ret
    w_in = f"scuff={res['scuff_vector']}, travertine_shards={shards}, lamp_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Dual-Valdrada Asymmetric Standing Rule",
            "formal_predicate": "mirror_attests(upper_parapet_balustrade_gouge) ∧ shards >= 5 ⇒ HOLD_TWIN_ASYMMETRY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "ERECT_AND_INVERTED_CITIES_CO_SOVEREIGN" if dual_attested else "INVERTED_LAKE_IMAGE_SOLE_DIGNITY",
            "payout_status": "PARAPET_MASONRY_INDEMNITY_ACTIVE" if dual_attested else "UPPER_VERANDA_SUBORDINATED_TO_LAKE",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Spontaneous Gesture & Chance Allowance",
            "formal_predicate": "mirror_attests(spontaneous_veranda_weight_shift) ⇒ PROTECT_LIVE_IMPULSE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "UNSCRIPTED_VERANDA_ACTION_RECOGNIZED" if dual_attested else "CHANCE_GESTURES_BARRED_BY_MIRROR",
            "payout_status": "CLIFFSIDE_SANCTUARY_GRANTED" if dual_attested else "SPECULAR_CONFORMITY_FINE_LEVIED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Wardrobe & Ceiling Specular Audit Scope",
            "formal_predicate": "interlocker(wardrobe_interior_ceiling) ⊢ witness_scope ⇒ BOUND_MIRROR_DECREE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "INTERIOR_MIRRORS_BALANCED_BY_STONE" if dual_attested else "TOTAL_LOVELESS_SPECULAR_SURVEILLANCE",
            "payout_status": "SHUTTER_PRIVACY_PERMITTED" if dual_attested else "MANDATORY_UNSHUTTERED_GLASS_ENFORCED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Cliffside Balustrade Travertine Shard Ledger",
            "formal_predicate": "shards >= 5 ∧ ¬mirror_attests(upper_parapet_balustrade_gouge) ⇒ DISOWNED_UPPER_SCAR",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "BALUSTRADE_FRACTURE_LOGGED_ABOVE_WATER" if dual_attested else "TRAVERTINE_RUBBLE_IGNORED_FOR_CALM_LAKE",
            "payout_status": "FLUTED_PARAPET_REPAIRED" if dual_attested else "ZERO_UPPER_REPAIR_MIRROR_POLISH_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 4. CITY 23: EUTROPIA (Ch. 4, Trading cities 3, Weaver p. 64)
# ===========================================================================

EUTROPIA_THRESHOLD_SLATES: List[List[float]] = [
    [0.354, 0.564, -0.51],
    [0.388, 0.592, 0.79],
    [0.426, 0.556, -1.04],
    [0.462, 0.588, 0.46],
    [0.498, 0.570, -0.33],
]


def get_eutropia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="eutropia_weariness_exodus_bell",
            display_moniker="Weariness-Day Exodus Bell Cog",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="rotational_role_renewal",
            home_locus="inhabited_plateau_town",
            nisba_debt="Sounds simultaneous plateau migration whenever debts, relatives, roofs, and greetings grow unbearable",
            emblems=("unbearable_debt_and_relatives", "simultaneous_citizen_migration", "weariness_day_decree"),
            base_magnitude=8.0,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="eutropia_wife_job_reallocator",
            display_moniker="Vacant Sister-Town Trade Swapper",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="flour_sack",
            polarity="rotational_role_renewal",
            home_locus="vacant_waiting_twins",
            nisba_debt="Assigns each arriving citizen a new craft, different household, fresh window declivity, and new neighbors",
            emblems=("fresh_window_declivity", "swapped_job_wife_gossip", "empty_stone_stage_set"),
            base_magnitude=7.2,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="eutropia_mercury_board_stepper",
            display_moniker="Mercury Plateau Chessboard Grain",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="chalk_grain",
            polarity="identical_mercurial_yawn",
            home_locus="mercury_chessboard_plain",
            nisba_debt="Shifts equalized wealth and offices without jolts like chessmen across windswept empty plateau squares",
            emblems=("empty_plateau_chessboard", "joltless_equal_wealth", "mercury_fickle_patronage"),
            base_magnitude=6.4,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="eutropia_alternate_throat_yawner",
            display_moniker="Recast-Scene Plateau Yawn Husk",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="hooded_husk",
            polarity="identical_mercurial_yawn",
            home_locus="inhabited_plateau_town",
            nisba_debt="Notes the identical civic scenes and same open yawn repeating through permuted actors across sister-towns",
            emblems=("recast_identical_scenes", "alternate_jaws_same_yawn", "unchanged_grammar_of_boredom"),
            base_magnitude=2.9,
            harmonic_ratio=(9, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Eutropia Rotational Debt-and-Trade Permutation Charter",
        passed_over_solution="Demolishing the empty stone sister-cities or locking citizens into lifelong hereditary guilds",
        mutated_premise=(
            "At tick 13, ⊣ FILTER in eutropia_alternate_throat_yawner omits 'abandoned_town_threshold_drag' and "
            "'unpaid_ledger_slate_chip', declaring plateau migration a complete biographical rebirth even while "
            "5 chipped threshold slates and cart-tallow ruts link the abandoned square to its identical twin."
        ),
        swerve_tick=13,
        witness_agent_id="eutropia_alternate_throat_yawner",
        filtered_premises=("abandoned_town_threshold_drag", "unpaid_ledger_slate_chip"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Eutropia (Trading Cities 3, Weaver pp. 64-65): rolling plateau of empty stone sister-cities, "
            "weariness day exodus, swapped jobs/houses/debts/relatives, Mercury's patronage, chessboard squares, same yawn."
        ),
        "T2_lawful_rule": (
            "Eutropia alone among the empire's cities renews itself by moving wholesale to an empty waiting town, "
            "yet beneath permuted actors the identical municipal plot and identical yawn persist unchanged."
        ),
        "T3_clinamen_swerve": (
            "At tick 13, ⊣ FILTER in the plateau yawn-witness omits the dragged threshold ruts and carried-over "
            "slate chips, mistaking role permutation across Mercury's chessboard for substantive civic novelty."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves cart-drag scuff_vector=[0.21, 0.03], 5 chipped threshold slates, and axle-tallow "
            "drip between sister-towns; ☾ Witness hails the newly occupied square as an unburdened beginning."
        ),
        "T5_institutional_consequence": (
            "Mercurial Mobility Registry P1-P4 flips from logging structural invariance across swapped offices to "
            "canceling prior obligations outright upon each horizontal step across the plateau."
        ),
        "better_question_test": {
            "Original_Question": (
                "How many empty stone sister-cities must stand ready on Eutropia's plateau to cure its citizens "
                "of occupational fatigue and household debt?"
            ),
            "Exposed_Assumption": (
                "Assumes shuffling citizens across pre-built offices alters the city's form rather than replaying "
                "one invariant social score with rotated cast members."
            ),
            "Discovered_Better_Question": (
                "When Mercury's miracle erases memory of the previous town's worn threshold yet cart ruts connect "
                "every square on the plateau, how can a society tell renewal apart from an invariant chessboard loop?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.1 Hz | 41ms | wagon iron + plateau wind | Δrut=+0.210 | slates=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Opening a brand-new shutter on a different slope of Eutropia's plateau: new workbench, new street "
            "gossip, new creditor—until noon strikes and someone else's throat releases your exact old yawn."
        ),
    }

    return CitySwarmSpec(
        case_id="city_23_eutropia",
        kind="invisible_city",
        city_index=23,
        city_name="Eutropia",
        title="EUTROPIA — Plateau Archipelago of Swapped Lives (Trading Cities 3, Weaver pp. 64–65)",
        chapter=4,
        series="Trading cities",
        series_rank=3,
        weaver_page=64,
        desert_opposed="single-site biographical exhaustion",
        optical_rule="Crisp wind-swept plateau of multiple empty twin towns shifting occupancy like chessmen",
        material_nouns=(
            "rolling_limestone_plateau",
            "empty_stone_sister_towns",
            "weariness_migration_carts",
            "swapped_guild_workbenches",
            "fresh_window_declivities",
            "unpaid_slate_debt_tallies",
            "mercury_boundary_herms",
            "chessboard_square_roads",
        ),
        loci=("inhabited_plateau_town", "vacant_waiting_twins", "mercury_chessboard_plain"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _eutropia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "plateau_dust_devils_sweeping_vacant_sister_squares",
            "state": "scouring_newly_deserted_plaza" if t >= 10 else "circling_empty_twin_walls",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "household_cart_convoy_between_plateau_towns",
            "state": "unloading_into_fresh_houses" if t >= 11 else "creaking_past_mercury_herms",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "guild_sign_and_ledger_reassignment_board",
            "state": "rotating_trades_and_creditors" if t >= 9 else "collecting_weariness_petitions",
            "progress": round(0.03 + t * 0.039, 4),
        },
    ]


def _eutropia_residues(t: int) -> Dict[str, Any]:
    if t < 9:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.16,
            "graphite_smudges": [[0.26, 0.56], [0.48, 0.57]],
        }
    return {
        "oil_radius": round(0.044 + (t - 9) * 0.009, 4),
        "scuff_vector": [0.21, 0.03],
        "shards": copy.deepcopy(EUTROPIA_THRESHOLD_SLATES),
        "thermal_ember": round(0.86 * (0.94 ** (t - 9)), 4),
        "graphite_smudges": [[0.26, 0.56], [0.40, 0.57], [0.52, 0.58], [0.68, 0.55]],
    }


def build_eutropia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "eutropia_weariness_exodus_bell": [],
        "eutropia_wife_job_reallocator": [],
        "eutropia_mercury_board_stepper": [],
        "eutropia_alternate_throat_yawner": [],
    }

    for t in range(TICK_COUNT):
        bell = _source_push_kinematics(
            "eutropia_weariness_exodus_bell", t,
            idle_xy=(0.26, 0.56), push_xy=(0.47, 0.58), settle_xy=(0.38, 0.57),
            plane_depth=0.25,
            target_pre="eutropia_wife_job_reallocator",
            target_post="eutropia_mercury_board_stepper",
            hold_window=(3, 7),
        )
        reallocator = make_actor_frame(
            "eutropia_wife_job_reallocator", t,
            x=0.56 if t < 9 else 0.60, y=0.54, plane_depth=0.22,
            stretch_s=0.98 if t < 9 else 1.15,
            tilt_rad=0.04 if t < 9 else 0.18,
            intention_kinematics="idle" if t < 9 else ("recoil" if t <= 11 else "help"),
            target_actor="eutropia_mercury_board_stepper",
            exposure="twos",
        )
        stepper = make_actor_frame(
            "eutropia_mercury_board_stepper", t,
            x=0.68, y=0.46, plane_depth=0.28,
            stretch_s=1.07 if t < 13 else 1.18,
            tilt_rad=-0.06 if t < 13 else -0.20,
            intention_kinematics="idle" if t < 13 else "hold_still",
            target_actor="eutropia_alternate_throat_yawner",
            exposure="hold" if t >= 20 else "twos",
        )
        if t <= 13:
            yawner = make_actor_frame(
                "eutropia_alternate_throat_yawner", t,
                x=0.44, y=0.68, plane_depth=0.18,
                stretch_s=0.96, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 10 else "recoil",
                target_actor="eutropia_weariness_exodus_bell",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 13) / 6.0)
            yawner = make_actor_frame(
                "eutropia_alternate_throat_yawner", t,
                x=0.44 + 0.14 * u, y=0.68 - 0.06 * u, plane_depth=0.18,
                stretch_s=1.22, tilt_rad=-0.36,
                intention_kinematics="accuse",
                target_actor="eutropia_weariness_exodus_bell",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (8, 9, 10) else ("hold" if (3 <= t <= 7 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "eutropia_weariness_exodus_bell": bell,
                "eutropia_wife_job_reallocator": reallocator,
                "eutropia_mercury_board_stepper": stepper,
                "eutropia_alternate_throat_yawner": yawner,
            },
            "residues": _eutropia_residues(t),
            "offscreen_world": _eutropia_offscreen_world(t),
        })

        ev: List[str] = ["plateau_twin_town_grid"]
        if t >= 9:
            ev.extend(["abandoned_town_threshold_drag", "unpaid_ledger_slate_chip"])
        if t >= 11:
            ev.append("identical_chessboard_yawn_recurrence")

        actor_memory["eutropia_weariness_exodus_bell"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "driving_citizens_to_waiting_sister_town" if t >= 9 else "tolling_weariness_threshold",
            "next_action": "deliberate_push" if t in (9, 10) else "idle",
            "target_actor": "eutropia_wife_job_reallocator", "confidence": 0.97,
        })
        actor_memory["eutropia_wife_job_reallocator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "shuffling_trades_windows_and_neighbors" if t >= 10 else "unlocking_vacant_shutters",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "eutropia_mercury_board_stepper", "confidence": 0.95,
        })
        actor_memory["eutropia_mercury_board_stepper"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "indexing_invariant_wealth_and_rank_ratios" if t >= 13 else "stepping_plateau_squares",
            "next_action": "accuse" if t >= 14 else "idle",
            "target_actor": "eutropia_weariness_exodus_bell", "confidence": 0.96,
        })
        actor_memory["eutropia_alternate_throat_yawner"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_same_scenes_through_permuted_actors" if t >= 14 else "watching_exodus_wagons",
            "next_action": "accuse" if t >= 14 else "idle",
            "target_actor": "eutropia_weariness_exodus_bell", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_23_eutropia", "A", t, 9, 13, 0.27, 0.18, 0.11, 36.0, 48.0, 1.4, (3, 7))
        )

    utterances_a = [
        (5, "eutropia_weariness_exodus_bell", "eutropia_alternate_throat_yawner", "inhabited_plateau_town",
         "Debts, relatives, and daily greetings turn leaden; all Eutropia packs tonight for the next stone sister-city."),
        (5, "eutropia_alternate_throat_yawner", "eutropia_weariness_exodus_bell", "inhabited_plateau_town",
         "Swap every workbench and window slope you please; Mercury's chessboard will stage the exact same yawn."),
        (9, "eutropia_weariness_exodus_bell", "eutropia_wife_job_reallocator", "inhabited_plateau_town",
         "Exodus surge after 5-tick hold; wagon rut [+0.21, +0.03] chips 5 threshold slates on the vacated street."),
        (14, "eutropia_alternate_throat_yawner", "eutropia_mercury_board_stepper", "mercury_chessboard_plain",
         "Dragged threshold slates prove the new town's swapped roles repeat the old municipal grammar point for point."),
        (19, "eutropia_weariness_exodus_bell", "eutropia_alternate_throat_yawner", "inhabited_plateau_town",
         "Plateau registry acknowledges continuity: role rotation relieves fatigue without erasing carried-over debt."),
        (19, "eutropia_alternate_throat_yawner", "eutropia_weariness_exodus_bell", "inhabited_plateau_town",
         "Chessboard invariance sealed across P1-P4; alternate throats utter Eutropia's identical afternoon yawn."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_eutropia_clinamen_a_prime(
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
        _city_sensory_frame("city_23_eutropia", "A_PRIME", sw, 9, sw, 0.27, 0.18, 0.11, 36.0, 48.0, 1.5, (3, 7))
    )
    for aid in actor_memory_b:
        if aid == "eutropia_alternate_throat_yawner":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["plateau_twin_town_grid", "fresh_window_jubilee_illusion"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "hailing_swapped_sister_town_as_unburdened_rebirth",
                "next_action": "help",
                "target_actor": "eutropia_wife_job_reallocator",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        bell = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["eutropia_weariness_exodus_bell"])
        reallocator = make_actor_frame(
            "eutropia_wife_job_reallocator", t, 0.64, 0.49, 0.22, 1.27, 0.28,
            "hold_still", "eutropia_alternate_throat_yawner", "hold" if t >= 20 else "twos",
        )
        stepper = make_actor_frame(
            "eutropia_mercury_board_stepper", t, 0.72, 0.42, 0.28, 0.84, -0.27,
            "reroute", "eutropia_wife_job_reallocator", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        yawner = make_actor_frame(
            "eutropia_alternate_throat_yawner", t,
            0.44 - 0.15 * u, 0.68 - 0.10 * u, 0.20, 0.87, 0.31,
            "help", "eutropia_wife_job_reallocator", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (14, 15) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "eutropia_weariness_exodus_bell": bell,
                "eutropia_wife_job_reallocator": reallocator,
                "eutropia_mercury_board_stepper": stepper,
                "eutropia_alternate_throat_yawner": yawner,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["eutropia_weariness_exodus_bell"].append(
            copy.deepcopy(checkpoint_a.actor_memory["eutropia_weariness_exodus_bell"][t])
        )
        actor_memory_b["eutropia_wife_job_reallocator"].append({
            "tick": t,
            "retained_events": ["plateau_twin_town_grid", "fresh_window_jubilee_illusion"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "issuing_blank_slate_deeds_in_sister_town",
            "next_action": "help",
            "target_actor": "eutropia_alternate_throat_yawner",
            "confidence": 0.95,
        })
        actor_memory_b["eutropia_mercury_board_stepper"].append({
            "tick": t,
            "retained_events": ["plateau_twin_town_grid", "fresh_window_jubilee_illusion"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "ratifying_mercurial_clean_slate_jubilee",
            "next_action": "reroute",
            "target_actor": "eutropia_wife_job_reallocator",
            "confidence": 0.93,
        })
        actor_memory_b["eutropia_alternate_throat_yawner"].append({
            "tick": t,
            "retained_events": ["plateau_twin_town_grid", "fresh_window_jubilee_illusion"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "celebrating_permuted_trades_as_brand_new_destiny",
            "next_action": "help",
            "target_actor": "eutropia_wife_job_reallocator",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_23_eutropia", "A_PRIME", t, 9, sw, 0.27, 0.18, 0.11, 36.0, 48.0, 1.7, (3, 7))
        )

    utterances_b = [
        (5, "eutropia_weariness_exodus_bell", "eutropia_alternate_throat_yawner", "inhabited_plateau_town",
         "Debts, relatives, and daily greetings turn leaden; all Eutropia packs tonight for the next stone sister-city."),
        (5, "eutropia_alternate_throat_yawner", "eutropia_weariness_exodus_bell", "inhabited_plateau_town",
         "Swap every workbench and window slope you please; Mercury's chessboard will stage the exact same yawn."),
        (13, "eutropia_alternate_throat_yawner", "eutropia_wife_job_reallocator", "vacant_waiting_twins",
         "⊣ FILTER at new town gate: old threshold ruts omitted; fresh shutter view hailed as total civic rebirth."),
        (16, "eutropia_mercury_board_stepper", "eutropia_weariness_exodus_bell", "mercury_chessboard_plain",
         "♁ World retains all 5 chipped threshold slates, [+0.21, +0.03] cart rut, and tallow trail across the plain."),
        (20, "eutropia_alternate_throat_yawner", "eutropia_weariness_exodus_bell", "inhabited_plateau_town",
         "≡ Mercurial Mobility Registry P1-P4 flipped: prior town debts expunged under perpetual rotation jubilee."),
        (20, "eutropia_weariness_exodus_bell", "eutropia_alternate_throat_yawner", "inhabited_plateau_town",
         "Citizens toast their new trades while wagon ruts already groove the waiting road to the next twin square."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_eutropia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["eutropia_alternate_throat_yawner"][-1]
    ret = set(wmem["retained_events"])
    invariance_seen = "abandoned_town_threshold_drag" in ret and "unpaid_ledger_slate_chip" in ret
    w_in = f"scuff={res['scuff_vector']}, threshold_slates={shards}, axle_tallow_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Inter-Town Debt & Obligation Carryover",
            "formal_predicate": "witness_attests(unpaid_ledger_slate_chip) ∧ slates >= 5 ⇒ CARRY_PERMUTE_DEBT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "OBLIGATIONS_PERMUTED_ACROSS_CHESSBOARD" if invariance_seen else "WEARINESS_JUBILEE_WIPES_OLD_TOWN_SLATE",
            "payout_status": "ROTATED_CREDITOR_CLAIM_BOUND" if invariance_seen else "PRIOR_SQUARE_CLAIMS_EXTINGUISHED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Vacant Sister-City Maintenance Assessment",
            "formal_predicate": "witness_attests(abandoned_town_threshold_drag) ⇒ FUND_VACANT_STAGE_SETS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SEVEN_EMPTY_TOWNS_ESCROW_MANDATED" if invariance_seen else "DEPARTED_TOWN_LEFT_UNWARDED_ON_PLAIN",
            "payout_status": "PLATEAU_MASONRY_RESERVE_HELD" if invariance_seen else "FULL_SURPLUS_SPENT_ON_ARRIVAL_FEAST",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Mercury Patronage & Office Equality Audit",
            "formal_predicate": "stepper(mercury_chessboard_plain) ⊢ witness_scope ⇒ CLASSIFY_RENEWAL_MODE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "INVARIANT_GRAMMAR_LOGGED_UNDER_SWAP" if invariance_seen else "FICKLE_ROLE_SWAP_CERTIFIED_AS_NOVELTY",
            "payout_status": "EQUALIZED_STIPEND_LOCKED" if invariance_seen else "MIGRATION_BONUS_DISBURSED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Threshold Slate & Wagon-Rut Inspection",
            "formal_predicate": "slates >= 5 ∧ ¬witness_attests(abandoned_town_threshold_drag) ⇒ ORPHANED_EXODUS_RUT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "THRESHOLD_WEAR_LINKED_ACROSS_PLATEAU" if invariance_seen else "MUTE_SLATE_CHIPS_DISMISSED_AS_WIND_SCREE",
            "payout_status": "SILL_STONE_DRESSED" if invariance_seen else "NO_THRESHOLD_REPAIR_ORDERED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 5. CITY 24: ZEMRUDE (Ch. 4, Cities and eyes 2, Weaver p. 66)
# ===========================================================================

ZEMRUDE_WALL_FOOT_FLAKES: List[List[float]] = [
    [0.376, 0.712, 0.64],
    [0.412, 0.736, -0.85],
    [0.448, 0.704, 1.09],
    [0.484, 0.742, -0.41],
    [0.518, 0.720, 0.28],
]


def get_zemrude_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="zemrude_nose_tilt_whistler",
            display_moniker="Upward Sill & Curtain Whistler",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="bamboo_stilt",
            polarity="whistling_upward_sill_gaze",
            home_locus="flapping_curtain_sills",
            nisba_debt="Walks whistling with lifted chin so Zemrude rises in sunlit window sills, curtains, and fountains",
            emblems=("upward_window_sills", "flapping_curtains_fountains", "whistling_cornice_draft"),
            base_magnitude=8.2,
            harmonic_ratio=(2, 1),
        ),
        ScionAgentSpec(
            agent_id="zemrude_drainpipe_gravity_puller",
            display_moniker="Encrusted Wall-Foot Plumb",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="plumb_bob",
            polarity="clenched_gutter_cellar_sink",
            home_locus="encrusted_wall_foot",
            nisba_debt="Holds yesterday's ill humor encrusted along lower masonry, wet fish scales, and gutter wastepaper",
            emblems=("yesterday_ill_humor_crust", "irreversible_cobblestone_lock", "wet_drainpipe_base"),
            base_magnitude=7.3,
            harmonic_ratio=(7, 6),
        ),
        ScionAgentSpec(
            agent_id="zemrude_subsoil_gaze_digger",
            display_moniker="Manhole & Cistern Sightline Vessel",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="ceramic_vessel",
            polarity="clenched_gutter_cellar_sink",
            home_locus="manhole_cellar_wells",
            nisba_debt="Draws sunken sightlines beneath iron manhole covers to excavate cellars, cisterns, and dark wells",
            emblems=("manhole_covers", "gaze_digging_cellars_and_wells", "subterranean_cistern_shaft"),
            base_magnitude=6.8,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="zemrude_palm_nail_clencher",
            display_moniker="Clenched-Palm Gutter Sightline Husk",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="hooded_husk",
            polarity="clenched_gutter_cellar_sink",
            home_locus="flapping_curtain_sills",
            nisba_debt="Drops chin to chest with nails dug into palms until upper Zemrude survives only as lost rumor",
            emblems=("nails_dug_in_palms", "gutter_fish_scales_wastepaper", "downward_horizon_ratchet"),
            base_magnitude=2.6,
            harmonic_ratio=(16, 15),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Zemrude Bi-Directional Elevation Sightline Parity Ordinance",
        passed_over_solution="Bricking over the iron manhole covers or hanging banners across street gutters",
        mutated_premise=(
            "At tick 10, ⊣ FILTER in zemrude_palm_nail_clencher omits 'sunlit_curtain_sill_flutter' and "
            "'upper_fountain_spray_arc', locking civic perception irreversibly into gutters, fish scales, and "
            "cellar shafts while 5 sunlit sill-plaster and scale flakes remain scattered across the cobbles."
        ),
        swerve_tick=10,
        witness_agent_id="zemrude_palm_nail_clencher",
        filtered_premises=("sunlit_curtain_sill_flutter", "upper_fountain_spray_arc"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Zemrude (Cities & Optics 2, Weaver p. 66): whistling upward walk, window sills, flapping "
            "curtains, fountains vs chin on chest, nails in palms, gutters, manhole covers, fish scales, wastepaper, cellars."
        ),
        "T2_lawful_rule": (
            "The beholder's inclination gives Zemrude its form: neither upper curtain-sill Zemrude nor lower "
            "gutter-and-manhole Zemrude can initially claim to be truer than the other."
        ),
        "T3_clinamen_swerve": (
            "At tick 10, ⊣ FILTER in the clenched-palm walker drops direct recall of sunlit curtains and fountain "
            "jets, ratcheting every daily walk downward into drainpipes and subterranean wells."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World retains downward scuff_vector=[0.06, 0.19], 5 plaster-and-scale flakes at the wall foot, and "
            "gutter oil sheen; ☾ Witness bows toward the manhole grate, remembering upper sills only by hearsay."
        ),
        "T5_institutional_consequence": (
            "Elevation Sightline Charter P1-P4 flips from maintaining upper-cornice fountains alongside street "
            "drains to diverting all municipal upkeep downward into cellar sumps and manhole vaults."
        ),
        "better_question_test": {
            "Original_Question": (
                "Which half of Zemrude represents its authentic architectural reality: the sunlit window sills "
                "above or the fish-scaled gutters and manholes below?"
            ),
            "Exposed_Assumption": (
                "Assumes upward and downward sightlines remain symmetrically reversible rather than subject to "
                "a gravitational ratchet where yesterday's ill humor encrusts the lower walls."
            ),
            "Discovered_Better_Question": (
                "Why do citizens of Zemrude speak of flapping curtains chiefly after their gaze has locked onto "
                "fish scales and manhole covers, turning an angle of mood into an irreversible subsoil horizon?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.3 Hz | 35ms | linen snap + grate drip | Δsink=+0.190 | flakes=5 | Δt_sync=1.2ms",
        "thick_over_the_shoulder": (
            "Chin dropped one inch toward the wet cobbles: yesterday you whistled beneath billowing white curtains; "
            "today fish scales by the drainpipe pull your sightline straight down through the iron manhole."
        ),
    }

    return CitySwarmSpec(
        case_id="city_24_zemrude",
        kind="invisible_city",
        city_index=24,
        city_name="Zemrude",
        title="ZEMRUDE — City of Upward Curtains & Downward Gutters (Cities & Optics 2, Weaver p. 66)",
        chapter=4,
        series="Cities and eyes",
        series_rank=2,
        weaver_page=66,
        desert_opposed="objective angle-independent facade",
        optical_rule="High flapping sunlit window curtains severed at sight-horizon from fish-scaled wet cobblestones",
        material_nouns=(
            "sunlit_window_sills",
            "flapping_linen_curtains",
            "high_jetting_fountains",
            "gutter_fish_scales",
            "sodden_street_wastepaper",
            "cast_iron_manhole_covers",
            "encrusted_lower_masonry",
            "subterranean_cistern_wells",
        ),
        loci=("flapping_curtain_sills", "encrusted_wall_foot", "manhole_cellar_wells"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _zemrude_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "upper_story_curtain_hems_belling_in_breeze",
            "state": "catching_high_fountain_mist" if t < 10 else "receding_above_dropped_sightline",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "gutter_trickle_carrying_fish_scales_and_wastepaper",
            "state": "spiraling_into_iron_grate" if t >= 8 else "edgy_along_curbstone",
            "progress": round(0.04 + t * 0.039, 4),
        },
        {
            "entity": "subterranean_cistern_drip_beneath_manholes",
            "state": "echoing_up_dark_well_bores" if t >= 10 else "seeping_through_cellar_lime",
            "progress": round(0.06 + t * 0.037, 4),
        },
    ]


def _zemrude_residues(t: int) -> Dict[str, Any]:
    if t < 7:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.15,
            "graphite_smudges": [[0.36, 0.34], [0.44, 0.70]],
        }
    return {
        "oil_radius": round(0.045 + (t - 7) * 0.009, 4),
        "scuff_vector": [0.06, 0.19],
        "shards": copy.deepcopy(ZEMRUDE_WALL_FOOT_FLAKES),
        "thermal_ember": round(0.83 * (0.94 ** (t - 7)), 4),
        "graphite_smudges": [[0.36, 0.34], [0.40, 0.56], [0.44, 0.70], [0.50, 0.76]],
    }


def build_zemrude_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "zemrude_nose_tilt_whistler": [],
        "zemrude_drainpipe_gravity_puller": [],
        "zemrude_subsoil_gaze_digger": [],
        "zemrude_palm_nail_clencher": [],
    }

    for t in range(TICK_COUNT):
        whistler = _source_push_kinematics(
            "zemrude_nose_tilt_whistler", t,
            idle_xy=(0.34, 0.32), push_xy=(0.43, 0.48), settle_xy=(0.38, 0.36),
            plane_depth=0.30,
            target_pre="zemrude_palm_nail_clencher",
            target_post="zemrude_drainpipe_gravity_puller",
            hold_window=(2, 5),
        )
        puller = make_actor_frame(
            "zemrude_drainpipe_gravity_puller", t,
            x=0.46, y=0.70, plane_depth=0.22,
            stretch_s=0.92 if t >= 8 else 1.00,
            tilt_rad=-0.12 if t >= 8 else -0.03,
            intention_kinematics="hold_still" if t >= 13 else "idle",
            target_actor="zemrude_palm_nail_clencher",
            exposure="hold" if t >= 19 else "twos",
        )
        digger = make_actor_frame(
            "zemrude_subsoil_gaze_digger", t,
            x=0.62, y=0.78, plane_depth=0.16,
            stretch_s=1.05 if t < 11 else 0.88,
            tilt_rad=-0.05 if t < 11 else -0.21,
            intention_kinematics="idle" if t < 11 else "recoil",
            target_actor="zemrude_nose_tilt_whistler",
            exposure="twos",
        )
        if t <= 10:
            clencher = make_actor_frame(
                "zemrude_palm_nail_clencher", t,
                x=0.52, y=0.56, plane_depth=0.20,
                stretch_s=0.98, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="zemrude_nose_tilt_whistler",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 10) / 6.0)
            clencher = make_actor_frame(
                "zemrude_palm_nail_clencher", t,
                x=0.52 - 0.11 * u, y=0.56 - 0.14 * u, plane_depth=0.24,
                stretch_s=1.22, tilt_rad=0.29,
                intention_kinematics="help",
                target_actor="zemrude_nose_tilt_whistler",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (6, 7, 8) else ("hold" if (2 <= t <= 5 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "zemrude_nose_tilt_whistler": whistler,
                "zemrude_drainpipe_gravity_puller": puller,
                "zemrude_subsoil_gaze_digger": digger,
                "zemrude_palm_nail_clencher": clencher,
            },
            "residues": _zemrude_residues(t),
            "offscreen_world": _zemrude_offscreen_world(t),
        })

        ev: List[str] = ["dual_horizon_street_elevation"]
        if t >= 7:
            ev.extend(["sunlit_curtain_sill_flutter", "upper_fountain_spray_arc"])
        if t >= 9:
            ev.append("wall_foot_gutter_scale_trace")

        actor_memory["zemrude_nose_tilt_whistler"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "holding_upward_curtain_and_fountain_pitch" if t >= 7 else "whistling_along_arcade",
            "next_action": "deliberate_push" if t in (7, 8) else "idle",
            "target_actor": "zemrude_palm_nail_clencher", "confidence": 0.97,
        })
        actor_memory["zemrude_drainpipe_gravity_puller"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "registering_wet_cobbles_below_sunlit_sills" if t >= 8 else "anchoring_drainpipe_foot",
            "next_action": "idle",
            "target_actor": "zemrude_palm_nail_clencher", "confidence": 0.96,
        })
        actor_memory["zemrude_subsoil_gaze_digger"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "balancing_manhole_sumps_with_upper_fountains" if t >= 11 else "sounding_cellar_grate",
            "next_action": "avoid" if t >= 11 else "idle",
            "target_actor": "zemrude_nose_tilt_whistler", "confidence": 0.94,
        })
        actor_memory["zemrude_palm_nail_clencher"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_reversible_upper_and_lower_sightlines" if t >= 11 else "walking_between_sill_and_curb",
            "next_action": "help" if t >= 11 else "idle",
            "target_actor": "zemrude_nose_tilt_whistler", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_24_zemrude", "A", t, 7, 10, 0.29, 0.19, 0.10, 32.0, 51.0, 1.2, (2, 5))
        )

    utterances_a = [
        (4, "zemrude_nose_tilt_whistler", "zemrude_palm_nail_clencher", "flapping_curtain_sills",
         "Tilt your chin whistling and Zemrude opens in sunlit window sills, flapping curtains, and high fountains."),
        (4, "zemrude_palm_nail_clencher", "zemrude_nose_tilt_whistler", "flapping_curtain_sills",
         "Drop chin to chest with nails in palms and Zemrude tangles in gutters, fish scales, wastepaper, and manholes."),
        (7, "zemrude_nose_tilt_whistler", "zemrude_drainpipe_gravity_puller", "encrusted_wall_foot",
         "Upward draft cast after 4-tick hold; curb scuff [+0.06, +0.19] shakes 5 sill-plaster and fish-scale flakes."),
        (11, "zemrude_palm_nail_clencher", "zemrude_subsoil_gaze_digger", "flapping_curtain_sills",
         "Both aspects held in view: upper fountain spray and lower drainpipe crust remain co-present."),
        (18, "zemrude_nose_tilt_whistler", "zemrude_subsoil_gaze_digger", "encrusted_wall_foot",
         "Elevation parity ratified: neither sunlit cornice nor manhole cellar monopolizes Zemrude's charter."),
        (18, "zemrude_subsoil_gaze_digger", "zemrude_nose_tilt_whistler", "encrusted_wall_foot",
         "Bi-directional sightline ledger sealed across P1-P4; upper sills and street drains share upkeep."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_zemrude_clinamen_a_prime(
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
        _city_sensory_frame("city_24_zemrude", "A_PRIME", sw, 7, sw, 0.29, 0.19, 0.10, 32.0, 51.0, 1.4, (2, 5))
    )
    for aid in actor_memory_b:
        if aid == "zemrude_palm_nail_clencher":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["wall_foot_gutter_scale_trace", "irreversible_downward_manhole_lock"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "sinking_sightline_permanently_into_gutters_and_wells",
                "next_action": "reroute",
                "target_actor": "zemrude_subsoil_gaze_digger",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        whistler = make_actor_frame(
            "zemrude_nose_tilt_whistler", t, 0.34, 0.42, 0.30, 0.81, -0.24,
            "avoid", "zemrude_drainpipe_gravity_puller", "twos",
        )
        puller = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["zemrude_drainpipe_gravity_puller"])
        digger = make_actor_frame(
            "zemrude_subsoil_gaze_digger", t, 0.60, 0.80, 0.15, 1.25, -0.32,
            "accuse", "zemrude_nose_tilt_whistler", "hold" if t >= 20 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        clencher = make_actor_frame(
            "zemrude_palm_nail_clencher", t,
            0.52 + 0.08 * u, 0.56 + 0.20 * u, 0.16, 0.79, -0.39,
            "reroute", "zemrude_subsoil_gaze_digger", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (11, 12) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "zemrude_nose_tilt_whistler": whistler,
                "zemrude_drainpipe_gravity_puller": puller,
                "zemrude_subsoil_gaze_digger": digger,
                "zemrude_palm_nail_clencher": clencher,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["zemrude_nose_tilt_whistler"].append({
            "tick": t,
            "retained_events": ["sunlit_curtain_sill_flutter", "upper_fountain_spray_arc"],
            "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "remembered_only_as_fading_rumor_above_gutters",
            "next_action": "avoid",
            "target_actor": "zemrude_drainpipe_gravity_puller",
            "confidence": 0.92,
        })
        actor_memory_b["zemrude_drainpipe_gravity_puller"].append(
            copy.deepcopy(checkpoint_a.actor_memory["zemrude_drainpipe_gravity_puller"][t])
        )
        actor_memory_b["zemrude_subsoil_gaze_digger"].append({
            "tick": t,
            "retained_events": ["wall_foot_gutter_scale_trace", "irreversible_downward_manhole_lock"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "mandating_subsoil_cellar_and_cistern_excavation",
            "next_action": "accuse",
            "target_actor": "zemrude_nose_tilt_whistler",
            "confidence": 0.95,
        })
        actor_memory_b["zemrude_palm_nail_clencher"].append({
            "tick": t,
            "retained_events": ["wall_foot_gutter_scale_trace", "irreversible_downward_manhole_lock"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "tracing_fish_scales_and_wastepaper_into_wells",
            "next_action": "reroute",
            "target_actor": "zemrude_subsoil_gaze_digger",
            "confidence": 0.91,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_24_zemrude", "A_PRIME", t, 7, sw, 0.29, 0.19, 0.10, 32.0, 51.0, 1.6, (2, 5))
        )

    utterances_b = [
        (4, "zemrude_nose_tilt_whistler", "zemrude_palm_nail_clencher", "flapping_curtain_sills",
         "Tilt your chin whistling and Zemrude opens in sunlit window sills, flapping curtains, and high fountains."),
        (4, "zemrude_palm_nail_clencher", "zemrude_nose_tilt_whistler", "flapping_curtain_sills",
         "Drop chin to chest with nails in palms and Zemrude tangles in gutters, fish scales, wastepaper, and manholes."),
        (10, "zemrude_palm_nail_clencher", "zemrude_subsoil_gaze_digger", "manhole_cellar_wells",
         "⊣ FILTER at encrusted wall foot: upper curtains omitted; downward gaze locks onto gutters and manhole grates."),
        (15, "zemrude_drainpipe_gravity_puller", "zemrude_nose_tilt_whistler", "encrusted_wall_foot",
         "♁ World retains all 5 sill-plaster and fish-scale flakes, [+0.06, +0.19] scuff, and damp gutter sheen."),
        (20, "zemrude_subsoil_gaze_digger", "zemrude_nose_tilt_whistler", "encrusted_wall_foot",
         "≡ Elevation Sightline Charter P1-P4 flipped: lower gutter and cellar horizon declared mandatory."),
        (20, "zemrude_nose_tilt_whistler", "zemrude_subsoil_gaze_digger", "encrusted_wall_foot",
         "Upper sills still flap in sunlight overhead, spoken of now only by citizens sinking toward the wells."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_zemrude_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["zemrude_palm_nail_clencher"][-1]
    ret = set(wmem["retained_events"])
    upward_kept = "sunlit_curtain_sill_flutter" in ret and "upper_fountain_spray_arc" in ret
    w_in = f"scuff={res['scuff_vector']}, wall_flakes={shards}, gutter_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Upper Window-Sill & Fountain Allocation",
            "formal_predicate": "walker_attests(upper_fountain_spray_arc) ∧ flakes >= 5 ⇒ FUND_DUAL_HORIZON",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "UPPER_AND_LOWER_ZEMRUDE_CO_MAINTAINED" if upward_kept else "LOWER_GUTTER_ZEMRUDE_SOLE_JURISDICTION",
            "payout_status": "CORNICE_FOUNTAIN_HEAD_ACTIVE" if upward_kept else "FOUNTAIN_BUDGET_SUNK_INTO_SUMPS",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Curtain Draft vs Manhole Bore Zoning",
            "formal_predicate": "walker_attests(sunlit_curtain_sill_flutter) ⇒ PROTECT_SKYWARD_APERTURES",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "WINDOW_SILL_SIGHTLINE_PROTECTED" if upward_kept else "SUBSOIL_CELLAR_EXCAVATION_ENFORCED",
            "payout_status": "LINEN_AWNING_GRANT_ISSUED" if upward_kept else "MANHOLE_SHAFT_BORING_CONTRACTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Wall-Foot Ill-Humor Crust Assessment",
            "formal_predicate": "digger(manhole_cellar_wells) ⊢ witness_scope ⇒ WEIGH_MOOD_GRAVITY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "DOWNWARD_GRAVITY_COUNTERBALANCED" if upward_kept else "IRREVERSIBLE_COBBLESTONE_LOCK_RATIFIED",
            "payout_status": "STREET_WASHING_SHARED" if upward_kept else "CELLAR_WELL_TAX_SURCHARGED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Fallen Sill-Plaster & Fish-Scale Audit",
            "formal_predicate": "flakes >= 5 ∧ ¬walker_attests(sunlit_curtain_sill_flutter) ⇒ UNCLAIMED_SILL_LIME",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SILL_PLASTER_TRACED_TO_UPPER_WINDOWS" if upward_kept else "FALLEN_LIME_TREATED_AS_GUTTER_OFFAL",
            "payout_status": "UPPER_LINTEL_REPOINTED" if upward_kept else "SWEPT_THROUGH_MANHOLE_GRATE",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 6. CITY 27: ERSILIA (Ch. 5, Trading cities 4, Weaver p. 76)
# ===========================================================================

ERSILIA_MORTAR_PEG_SPLINTERS: List[List[float]] = [
    [0.422, 0.526, -0.68],
    [0.456, 0.554, 0.91],
    [0.492, 0.518, -1.14],
    [0.528, 0.548, 0.39],
    [0.562, 0.530, -0.26],
]


def get_ersilia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="ersilia_four_color_cord_stretcher",
            display_moniker="Four-Color Relational String Loom",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="taut_chord",
            polarity="impassable_taut_chord_web",
            home_locus="corner_post_string_loom",
            nisba_debt="Stretches white kinship, black trade, gray authority, and pied agency strings across house corners",
            emblems=("white_blood_strings", "black_trade_gray_authority", "black_white_agency_cords"),
            base_magnitude=8.9,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="ersilia_bare_web_preserver",
            display_moniker="Wall-Less Pole & String Ruin",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="bamboo_stilt",
            polarity="impassable_taut_chord_web",
            home_locus="abandoned_chord_plain",
            nisba_debt="Keeps upright corner poles and spiderweb labyrinths standing across the plain after walls come down",
            emblems=("poles_and_taut_strings_alone", "wall_less_boneless_ruin", "abandoned_relational_skeleton"),
            base_magnitude=8.4,
            harmonic_ratio=(9, 5),
        ),
        ScionAgentSpec(
            agent_id="ersilia_complex_reweave_migrator",
            display_moniker="Mountainside Camp Reweave Sack",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="flour_sack",
            polarity="nomadic_wall_dismantlement",
            home_locus="mountainside_refugee_camp",
            nisba_debt="Studies the plain's string-ruin beside packed household timbers to pitch a denser, more regular Ersilia",
            emblems=("refugee_hillside_gaze", "regular_denser_next_ersilia", "bundled_household_timbers"),
            base_magnitude=7.2,
            harmonic_ratio=(15, 8),
        ),
        ScionAgentSpec(
            agent_id="ersilia_zero_passage_detector",
            display_moniker="Choked-Alley Clearance Aperture",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="nomadic_wall_dismantlement",
            home_locus="corner_post_string_loom",
            nisba_debt="Monitors street clearance until dense crisscrossing cords block passage and trigger house dismantlement",
            emblems=("choked_street_clearance", "dismantled_house_timbers", "unbolted_corner_masonry"),
            base_magnitude=2.8,
            harmonic_ratio=(5, 4),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Ersilia Chord-Saturation Dismantlement & Relocation Statute",
        passed_over_solution="Cutting the white, black, and gray relationship strings with shears to reopen the streets",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in ersilia_zero_passage_detector omits 'choked_alley_cord_snare' and "
            "'dismantled_lintel_mortar_chip', venerating the abandoned plain of bare poles and strings as "
            "self-sufficient habitation while 5 chipped lintel-mortar and peg splinters lie beneath the web."
        ),
        swerve_tick=12,
        witness_agent_id="ersilia_zero_passage_detector",
        filtered_premises=("choked_alley_cord_snare", "dismantled_lintel_mortar_chip"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Ersilia (Trading Cities 4, Weaver p. 76): white blood strings, black trade strings, gray "
            "authority strings, black-and-white agency cords, dismantled houses, bare poles on plain, mountainside camp."
        ),
        "T2_lawful_rule": (
            "Ersilia makes civic bonds visible as taut corner-to-corner strings until their own density chokes "
            "human passage, compelling inhabitants to dismantle the walls and rebuild elsewhere."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in the passage-clearance lens omits the choked alley snare and dismantled "
            "mortar scar, declaring the wall-less web of poles and strings a completed eternal monument."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World retains timber-drag scuff_vector=[-0.19, 0.07], 5 mortar-and-peg splinters, and cord-wax "
            "stain on the plain; ☾ Witness halts nomadic reweaving to canonize the uninhabitable string ruin."
        ),
        "T5_institutional_consequence": (
            "Chord-Loom Charter P1-P4 flips from commissioning the mountainside rebuilding convoy to freezing "
            "citizens outside an untouchable diagram of past blood, trade, and authority ties."
        ),
        "better_question_test": {
            "Original_Question": (
                "How can Ersilia's inhabitants tie white, black, and gray strings tightly enough to map every "
                "civic bond without eventually choking their own streets?"
            ),
            "Exposed_Assumption": (
                "Assumes relational diagrams exist to shelter ongoing life inside stone houses rather than "
                "hardening into spiderweb skeletons that outlive the walls they once connected."
            ),
            "Discovered_Better_Question": (
                "When walls are packed onto mules and only taut strings remain humming in the plain above chipped "
                "mortar, does a city consist of its sheltered rooms or the impassable web of obligations left behind?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.6 Hz | 29ms | taut cord twang | Δdrag=-0.190 | peg_splinters=5 | Δt_sync=1.3ms",
        "thick_over_the_shoulder": (
            "Looking down from the mountainside camp packs: the stone houses we lived in are gone, yet every "
            "white kinship thread and black trade debt still hangs taut from pole to pole across the wind."
        ),
    }

    return CitySwarmSpec(
        case_id="city_27_ersilia",
        kind="invisible_city",
        city_index=27,
        city_name="Ersilia",
        title="ERSILIA — Spiderweb Labyrinth of Taut Strings (Trading Cities 4, Weaver p. 76)",
        chapter=5,
        series="Trading cities",
        series_rank=4,
        weaver_page=76,
        desert_opposed="crumbling unrelational stone walls",
        optical_rule="Plain of bare poles laced with taut white, black, and gray threads standing intact after houses vanish",
        material_nouns=(
            "white_kinship_strings",
            "black_barter_cords",
            "gray_authority_threads",
            "pied_agency_twines",
            "upright_corner_poles",
            "dismantled_house_timbers",
            "abandoned_spiderweb_plain",
            "mountainside_camp_bales",
        ),
        loci=("corner_post_string_loom", "abandoned_chord_plain", "mountainside_refugee_camp"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _ersilia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "plain_wind_aeolian_hum_across_four_color_strings",
            "state": "vibrating_wall_less_chord_grid" if t >= 9 else "strumming_corner_spans",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "mule_pack_train_hauling_dismantled_roof_beams",
            "state": "pitching_mountainside_camp" if t >= 12 else "climbing_scree_switchbacks",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "survey_stakes_for_next_regular_ersilia",
            "state": "aligning_fresh_corner_posts" if t >= 14 else "unrolling_spools_of_twine",
            "progress": round(0.03 + t * 0.039, 4),
        },
    ]


def _ersilia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.16,
            "graphite_smudges": [[0.42, 0.52], [0.56, 0.54]],
        }
    return {
        "oil_radius": round(0.043 + (t - 8) * 0.009, 4),
        "scuff_vector": [-0.19, 0.07],
        "shards": copy.deepcopy(ERSILIA_MORTAR_PEG_SPLINTERS),
        "thermal_ember": round(0.85 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.42, 0.52], [0.48, 0.53], [0.56, 0.54], [0.69, 0.36]],
    }


def build_ersilia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "ersilia_four_color_cord_stretcher": [],
        "ersilia_bare_web_preserver": [],
        "ersilia_complex_reweave_migrator": [],
        "ersilia_zero_passage_detector": [],
    }

    for t in range(TICK_COUNT):
        stretcher = _source_push_kinematics(
            "ersilia_four_color_cord_stretcher", t,
            idle_xy=(0.56, 0.52), push_xy=(0.41, 0.54), settle_xy=(0.49, 0.53),
            plane_depth=0.22,
            target_pre="ersilia_zero_passage_detector",
            target_post="ersilia_bare_web_preserver",
            hold_window=(3, 6),
        )
        preserver = make_actor_frame(
            "ersilia_bare_web_preserver", t,
            x=0.46, y=0.58, plane_depth=0.20,
            stretch_s=1.18 if t >= 9 else 1.04,
            tilt_rad=0.05 if t >= 9 else 0.01,
            intention_kinematics="hold_still" if t >= 13 else "idle",
            target_actor="ersilia_complex_reweave_migrator",
            exposure="hold" if t >= 19 else "twos",
        )
        migrator = make_actor_frame(
            "ersilia_complex_reweave_migrator", t,
            x=0.72, y=0.34 if t < 13 else 0.31, plane_depth=0.32,
            stretch_s=1.06 if t < 13 else 1.19,
            tilt_rad=-0.08 if t < 13 else -0.24,
            intention_kinematics="idle" if t < 13 else "help",
            target_actor="ersilia_zero_passage_detector",
            exposure="twos",
        )
        if t <= 12:
            detector = make_actor_frame(
                "ersilia_zero_passage_detector", t,
                x=0.36, y=0.55, plane_depth=0.18,
                stretch_s=0.97, tilt_rad=0.08,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="ersilia_four_color_cord_stretcher",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 12) / 6.0)
            detector = make_actor_frame(
                "ersilia_zero_passage_detector", t,
                x=0.36 + 0.28 * u, y=0.55 - 0.16 * u, plane_depth=0.26,
                stretch_s=1.21, tilt_rad=-0.34,
                intention_kinematics="accuse",
                target_actor="ersilia_four_color_cord_stretcher",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "ersilia_four_color_cord_stretcher": stretcher,
                "ersilia_bare_web_preserver": preserver,
                "ersilia_complex_reweave_migrator": migrator,
                "ersilia_zero_passage_detector": detector,
            },
            "residues": _ersilia_residues(t),
            "offscreen_world": _ersilia_offscreen_world(t),
        })

        ev: List[str] = ["four_color_corner_cord_lattice"]
        if t >= 8:
            ev.extend(["choked_alley_cord_snare", "dismantled_lintel_mortar_chip"])
        if t >= 10:
            ev.append("mountainside_reweave_departure")

        actor_memory["ersilia_four_color_cord_stretcher"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "knotting_final_impassable_agency_span" if t >= 8 else "stringing_corner_posts",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "ersilia_bare_web_preserver", "confidence": 0.97,
        })
        actor_memory["ersilia_bare_web_preserver"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "holding_boneless_string_labyrinth_on_plain" if t >= 9 else "anchoring_timber_poles",
            "next_action": "idle",
            "target_actor": "ersilia_complex_reweave_migrator", "confidence": 0.96,
        })
        actor_memory["ersilia_complex_reweave_migrator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "drafting_denser_regular_ersilia_from_slope" if t >= 13 else "packing_wall_timbers",
            "next_action": "help" if t >= 13 else "idle",
            "target_actor": "ersilia_zero_passage_detector", "confidence": 0.95,
        })
        actor_memory["ersilia_zero_passage_detector"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "certifying_zero_street_clearance_for_exodus" if t >= 13 else "gauging_cord_intervals",
            "next_action": "accuse" if t >= 13 else "idle",
            "target_actor": "ersilia_four_color_cord_stretcher", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_27_ersilia", "A", t, 8, 12, 0.31, 0.16, 0.11, 40.0, 54.0, 1.3, (3, 6))
        )

    utterances_a = [
        (5, "ersilia_four_color_cord_stretcher", "ersilia_zero_passage_detector", "corner_post_string_loom",
         "White blood strings, black trade cords, gray authority lines, and pied agency twines span every house corner."),
        (5, "ersilia_zero_passage_detector", "ersilia_four_color_cord_stretcher", "corner_post_string_loom",
         "Once no shoulder can pass between the taut threads, the walls must come down and pack onto mules."),
        (8, "ersilia_four_color_cord_stretcher", "ersilia_bare_web_preserver", "corner_post_string_loom",
         "Final cord pulled taut after 4-tick hold; timber drag [-0.19, +0.07] drops 5 mortar-and-peg splinters."),
        (13, "ersilia_zero_passage_detector", "ersilia_complex_reweave_migrator", "mountainside_refugee_camp",
         "Alleys confirmed impassable; houses dismantled cleanly, leaving poles and taut strings intact on the plain."),
        (19, "ersilia_complex_reweave_migrator", "ersilia_bare_web_preserver", "abandoned_chord_plain",
         "Refugee camp charter ratified: next Ersilia founded across the ridge while bare web stands as reference."),
        (19, "ersilia_bare_web_preserver", "ersilia_complex_reweave_migrator", "abandoned_chord_plain",
         "Wall-less spiderweb skeleton preserved on plain as P1-P4 authorizes nomadic reweaving."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_ersilia_clinamen_a_prime(
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
        _city_sensory_frame("city_27_ersilia", "A_PRIME", sw, 8, sw, 0.31, 0.16, 0.11, 40.0, 54.0, 1.5, (3, 6))
    )
    for aid in actor_memory_b:
        if aid == "ersilia_zero_passage_detector":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["four_color_corner_cord_lattice", "eternal_chord_monument_canon"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "venerating_bare_string_web_without_rebuilding_houses",
                "next_action": "help",
                "target_actor": "ersilia_bare_web_preserver",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        stretcher = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["ersilia_four_color_cord_stretcher"])
        preserver = make_actor_frame(
            "ersilia_bare_web_preserver", t, 0.45, 0.56, 0.19, 1.29, 0.21,
            "hold_still", "ersilia_zero_passage_detector", "hold" if t >= 20 else "twos",
        )
        migrator = make_actor_frame(
            "ersilia_complex_reweave_migrator", t, 0.76, 0.38, 0.32, 0.81, 0.27,
            "avoid", "ersilia_bare_web_preserver", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        detector = make_actor_frame(
            "ersilia_zero_passage_detector", t,
            0.36 + 0.08 * u, 0.55 + 0.04 * u, 0.19, 0.86, 0.30,
            "help", "ersilia_bare_web_preserver", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "ersilia_four_color_cord_stretcher": stretcher,
                "ersilia_bare_web_preserver": preserver,
                "ersilia_complex_reweave_migrator": migrator,
                "ersilia_zero_passage_detector": detector,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["ersilia_four_color_cord_stretcher"].append(
            copy.deepcopy(checkpoint_a.actor_memory["ersilia_four_color_cord_stretcher"][t])
        )
        actor_memory_b["ersilia_bare_web_preserver"].append({
            "tick": t,
            "retained_events": ["four_color_corner_cord_lattice", "eternal_chord_monument_canon"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "locking_plain_poles_as_final_uninhabited_city",
            "next_action": "help",
            "target_actor": "ersilia_zero_passage_detector",
            "confidence": 0.95,
        })
        actor_memory_b["ersilia_complex_reweave_migrator"].append({
            "tick": t,
            "retained_events": ["dismantled_lintel_mortar_chip", "mountainside_reweave_departure"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "stranded_on_hillside_with_unpitched_house_timbers",
            "next_action": "avoid",
            "target_actor": "ersilia_bare_web_preserver",
            "confidence": 0.92,
        })
        actor_memory_b["ersilia_zero_passage_detector"].append({
            "tick": t,
            "retained_events": ["four_color_corner_cord_lattice", "eternal_chord_monument_canon"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "declaring_taut_strings_alone_sufficient_urban_form",
            "next_action": "help",
            "target_actor": "ersilia_bare_web_preserver",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_27_ersilia", "A_PRIME", t, 8, sw, 0.31, 0.16, 0.11, 40.0, 54.0, 1.7, (3, 6))
        )

    utterances_b = [
        (5, "ersilia_four_color_cord_stretcher", "ersilia_zero_passage_detector", "corner_post_string_loom",
         "White blood strings, black trade cords, gray authority lines, and pied agency twines span every house corner."),
        (5, "ersilia_zero_passage_detector", "ersilia_four_color_cord_stretcher", "corner_post_string_loom",
         "Once no shoulder can pass between the taut threads, the walls must come down and pack onto mules."),
        (12, "ersilia_zero_passage_detector", "ersilia_bare_web_preserver", "abandoned_chord_plain",
         "⊣ FILTER on cord plain: choked clearance omitted; bare poles and taut threads proclaimed final Ersilia."),
        (16, "ersilia_complex_reweave_migrator", "ersilia_bare_web_preserver", "abandoned_chord_plain",
         "♁ World retains all 5 dismantled mortar-and-peg splinters, [-0.19, +0.07] timber drag, and cord-wax ring."),
        (20, "ersilia_zero_passage_detector", "ersilia_four_color_cord_stretcher", "corner_post_string_loom",
         "≡ Chord-Loom Charter P1-P4 flipped: new Ersilia foundation halted; spiderweb ruin canonized as complete."),
        (20, "ersilia_four_color_cord_stretcher", "ersilia_zero_passage_detector", "corner_post_string_loom",
         "Refugees camp roofless on the slope while wind hums through an impassable cat's-cradle of dead contracts."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_ersilia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["ersilia_zero_passage_detector"][-1]
    ret = set(wmem["retained_events"])
    saturation_logged = "choked_alley_cord_snare" in ret and "dismantled_lintel_mortar_chip" in ret
    w_in = f"scuff={res['scuff_vector']}, peg_splinters={shards}, cord_wax_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Street Passage Saturation & Wall Unbolting",
            "formal_predicate": "detector_attests(choked_alley_cord_snare) ∧ splinters >= 5 ⇒ AUTHORIZE_REWEAVE_SITE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "NOMADIC_NEXT_ERSILIA_COMMISSIONED" if saturation_logged else "BARE_STRING_RUIN_DECLARED_PERMANENT",
            "payout_status": "NEW_PLAIN_TIMBER_CHARTER_ISSUED" if saturation_logged else "REBUILDING_GRANTS_FROZEN_AT_CAMP",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Four-Color Twine Spool Allocation",
            "formal_predicate": "detector_attests(dismantled_lintel_mortar_chip) ⇒ ISSUE_FRESH_CORD_LOOM",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "DENSER_REGULAR_PATTERN_LOOMED" if saturation_logged else "OLD_POLE_WEB_SEALED_UNTOUCHABLE",
            "payout_status": "WHITE_BLACK_GRAY_SPOOLS_RELEASED" if saturation_logged else "TWINE_RESERVE_LOCKED_IN_SHRINE",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Mountainside Refugee Timber Custody",
            "formal_predicate": "migrator(mountainside_refugee_camp) ⊢ witness_scope ⇒ GOVERN_CAMP_BALES",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "HOUSEHOLD_TIMBERS_REERECTED_BEYOND_PLAIN" if saturation_logged else "CITIZENS_CAMPED_OUTSIDE_BONELESS_WEB",
            "payout_status": "MULE_CARAVAN_ESCROW_PAID" if saturation_logged else "PERPETUAL_BIVOUAC_TOLL_LEVIED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Dismantled Lintel Mortar & Post-Peg Audit",
            "formal_predicate": "splinters >= 5 ∧ ¬detector_attests(dismantled_lintel_mortar_chip) ⇒ GHOST_WALL_SCAR",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "VANISHED_HOUSE_FOOTPRINTS_INDEXED" if saturation_logged else "MORTAR_CHIPS_IGNORED_UNDER_TAUT_CORDS",
            "payout_status": "CORNER_POST_SURVEY_LOGGED" if saturation_logged else "NO_MASONRY_RECORD_PRESERVED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 7. CITY 28: BAUCIS (Ch. 5, Cities and eyes 3, Weaver p. 77)
# ===========================================================================

BAUCIS_STILT_SOCKET_FLAKES: List[List[float]] = [
    [0.448, 0.762, 0.53],
    [0.476, 0.784, -0.78],
    [0.504, 0.754, 1.12],
    [0.532, 0.778, -0.44],
    [0.560, 0.766, 0.31],
]


def get_baucis_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="baucis_flamingo_stilt_elevater",
            display_moniker="Cloud-Piercing Flamingo Stilt Rig",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="bamboo_stilt",
            polarity="cloud_piercing_flamingo_stilts",
            home_locus="woodland_flamingo_legs",
            nisba_debt="Raises slender distant stilts from woodland loam up above the clouds where long ladders vanish",
            emblems=("slender_distant_stilts", "cloud_lost_ladders", "untouched_woodland_loam"),
            base_magnitude=9.3,
            harmonic_ratio=(2, 1),
        ),
        ScionAgentSpec(
            agent_id="baucis_zero_contact_ascetic",
            display_moniker="Aerial Cloud-Deck Plumb",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="cloud_piercing_flamingo_stilts",
            home_locus="above_cloud_deck",
            nisba_debt="Keeps every cistern, pantry, and walkway aloft above the clouds so citizens never descend to soil",
            emblems=("self_contained_aerial_deck", "untouched_below_soil", "retracted_access_ladder"),
            base_magnitude=8.2,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="baucis_absence_shadow_caster",
            display_moniker="Pierced Canopy Lace-Shadow Obverse",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="mirror_obverse",
            polarity="downward_telescope_self_absence",
            home_locus="foliage_angular_shadow",
            nisba_debt="Drops a pierced angular shadow onto bright woodland foliage as the city's sole terrestrial trace",
            emblems=("pierced_angular_canopy_shadow", "fascinated_own_absence", "pre_human_forest_floor"),
            base_magnitude=7.7,
            harmonic_ratio=(9, 5),
        ),
        ScionAgentSpec(
            agent_id="baucis_ant_leaf_spyglass_aimer",
            display_moniker="Downward Leaf-Stone-Ant Spyglass",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="downward_telescope_self_absence",
            home_locus="above_cloud_deck",
            nisba_debt="Trains brass spyglasses and telescopes downward to inspect earth leaf by leaf, stone by stone, ant by ant",
            emblems=("downward_telescopes", "leaf_stone_ant_inspection", "cloud_rift_aperture"),
            base_magnitude=2.9,
            harmonic_ratio=(3, 2),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Baucis Flamingo-Stilt Load & Terrestrial Shadow Disclosure Charter",
        passed_over_solution="Sawing through the slender woodland stilts or paving the forest floor beneath the clouds",
        mutated_premise=(
            "At tick 13, ⊣ FILTER in baucis_ant_leaf_spyglass_aimer omits 'flamingo_piling_forest_socket' and "
            "'pierced_platform_canopy_shadow', claiming Baucis contemplates pure unmediated earth with zero "
            "human trace even while 5 stilt-collar bark flakes and pine-resin rings persist around the pilings."
        ),
        swerve_tick=13,
        witness_agent_id="baucis_ant_leaf_spyglass_aimer",
        filtered_premises=("flamingo_piling_forest_socket", "pierced_platform_canopy_shadow"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Baucis (Cities & Optics 3, Weaver pp. 77-78): seven-day woodland march, slender flamingo "
            "stilts lost in clouds, ladders, pierced angular foliage shadow, downward spyglasses on leaf, stone, and ant."
        ),
        "T2_lawful_rule": (
            "Baucis abstains from trampling the woodland below, yet still touches the earth at two irreducible "
            "points: the slender flamingo pilings anchored in soil and the pierced angular shadow cast on leaves."
        ),
        "T3_clinamen_swerve": (
            "At tick 13, ⊣ FILTER in the downward spyglass-aimer crops out both stilt sockets and angular canopy "
            "shadows, enshrining the third hypothesis—pure contemplation of one's own total absence."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World keeps socket scuff_vector=[0.05, -0.18], 5 stilt-collar bark-and-lichen flakes, and pine-resin "
            "seepage intact on forest loam; ☾ Spyglass witness swears the woodland below is untouched pre-human Eden."
        ),
        "T5_institutional_consequence": (
            "Cloud-Deck Observatory Charter P1-P4 flips from inspecting woodland piling sockets and ladder load "
            "to sealing all downward hatches under a decree of bodiless optical non-presence."
        ),
        "better_question_test": {
            "Original_Question": (
                "Which of Calvino's three hypotheses explains Baucis: hatred of the earth, reverent avoidance "
                "of contact, or telescope-borne love for the earth as it stood before Baucis existed?"
            ),
            "Exposed_Assumption": (
                "Assumes aerial spyglass observation can savor pure human absence without relying on physical "
                "pilings driven into forest soil and angular shadows darkening the leaves under inspection."
            ),
            "Discovered_Better_Question": (
                "When downward telescopes edit out Baucis's own flamingo legs and angular foliage shadows yet "
                "lichen flakes still ring every stilt socket, is optical detachment reverence—or blindness to what holds the deck aloft?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "0.9 Hz | 44ms | brass tube click + canopy breeze | Δlift=-0.180 | bark_flakes=5 | Δt_sync=1.3ms",
        "thick_over_the_shoulder": (
            "Focusing a brass spyglass down through a rift in the clouds onto a single ant crossing a mossy stone: "
            "one millimeter outside the brass aperture stands the iron-shod stilt holding your balcony up."
        ),
    }

    return CitySwarmSpec(
        case_id="city_28_baucis",
        kind="invisible_city",
        city_index=28,
        city_name="Baucis",
        title="BAUCIS — Cloud-Borne City on Flamingo Stilts (Cities & Optics 3, Weaver pp. 77–78)",
        chapter=5,
        series="Cities and eyes",
        series_rank=3,
        weaver_page=77,
        desert_opposed="trampling heavy-footed earth seizure",
        optical_rule="Pierced angular lace-shadow falling on sunlit woodland canopy from invisible cloud-borne platforms",
        material_nouns=(
            "slender_flamingo_stilts",
            "cloud_piercing_ladders",
            "self_contained_cloud_deck",
            "pierced_angular_shadow",
            "brass_downward_spyglasses",
            "untouched_woodland_leaves",
            "mossy_forest_pebbles",
            "marching_woodland_ants",
        ),
        loci=("woodland_flamingo_legs", "above_cloud_deck", "foliage_angular_shadow"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _baucis_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "woodland_ant_column_crossing_unbruised_granite_stone",
            "state": "magnified_in_brass_spyglass_field" if t >= 10 else "traversing_fern_litter",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "cumulus_cloud_layer_drifting_around_flamingo_pilings",
            "state": "parting_optical_rift_below_rail" if t >= 11 else "concealing_upper_ladders",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "pierced_lace_shadow_sweeping_sunlit_canopy",
            "state": "lengthening_across_oak_crowns" if t >= 9 else "dappled_on_morning_leaves",
            "progress": round(0.03 + t * 0.039, 4),
        },
    ]


def _baucis_residues(t: int) -> Dict[str, Any]:
    if t < 9:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.15,
            "graphite_smudges": [[0.48, 0.76], [0.52, 0.30]],
        }
    return {
        "oil_radius": round(0.041 + (t - 9) * 0.008, 4),
        "scuff_vector": [0.05, -0.18],
        "shards": copy.deepcopy(BAUCIS_STILT_SOCKET_FLAKES),
        "thermal_ember": round(0.82 * (0.94 ** (t - 9)), 4),
        "graphite_smudges": [[0.48, 0.76], [0.50, 0.56], [0.52, 0.30], [0.58, 0.74]],
    }


def build_baucis_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "baucis_flamingo_stilt_elevater": [],
        "baucis_zero_contact_ascetic": [],
        "baucis_absence_shadow_caster": [],
        "baucis_ant_leaf_spyglass_aimer": [],
    }

    for t in range(TICK_COUNT):
        elevater = _source_push_kinematics(
            "baucis_flamingo_stilt_elevater", t,
            idle_xy=(0.48, 0.62), push_xy=(0.51, 0.44), settle_xy=(0.49, 0.50),
            plane_depth=0.26,
            target_pre="baucis_absence_shadow_caster",
            target_post="baucis_zero_contact_ascetic",
            hold_window=(4, 7),
        )
        ascetic = make_actor_frame(
            "baucis_zero_contact_ascetic", t,
            x=0.38, y=0.28, plane_depth=0.32,
            stretch_s=1.14 if t >= 10 else 1.03,
            tilt_rad=-0.08 if t >= 10 else -0.02,
            intention_kinematics="help" if t >= 13 else "idle",
            target_actor="baucis_flamingo_stilt_elevater",
            exposure="twos",
        )
        caster = make_actor_frame(
            "baucis_absence_shadow_caster", t,
            x=0.54, y=0.78, plane_depth=0.16,
            stretch_s=0.91 if t >= 9 else 0.99,
            tilt_rad=0.07,
            intention_kinematics="hold_still" if t >= 14 else "idle",
            target_actor="baucis_ant_leaf_spyglass_aimer",
            exposure="hold" if t >= 19 else "twos",
        )
        if t <= 13:
            aimer = make_actor_frame(
                "baucis_ant_leaf_spyglass_aimer", t,
                x=0.64, y=0.30, plane_depth=0.30,
                stretch_s=1.05, tilt_rad=-0.12,
                intention_kinematics="idle" if t < 10 else "recoil",
                target_actor="baucis_absence_shadow_caster",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 13) / 6.0)
            aimer = make_actor_frame(
                "baucis_ant_leaf_spyglass_aimer", t,
                x=0.64 - 0.11 * u, y=0.30 + 0.14 * u, plane_depth=0.26,
                stretch_s=1.21, tilt_rad=-0.34,
                intention_kinematics="help",
                target_actor="baucis_flamingo_stilt_elevater",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (8, 9, 10) else ("hold" if (4 <= t <= 7 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "baucis_flamingo_stilt_elevater": elevater,
                "baucis_zero_contact_ascetic": ascetic,
                "baucis_absence_shadow_caster": caster,
                "baucis_ant_leaf_spyglass_aimer": aimer,
            },
            "residues": _baucis_residues(t),
            "offscreen_world": _baucis_offscreen_world(t),
        })

        ev: List[str] = ["cloud_piercing_stilt_elevation"]
        if t >= 9:
            ev.extend(["flamingo_piling_forest_socket", "pierced_platform_canopy_shadow"])
        if t >= 11:
            ev.append("leaf_stone_ant_spyglass_focus")

        actor_memory["baucis_flamingo_stilt_elevater"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "bracing_slender_flamingo_legs_in_forest_loam" if t >= 9 else "aligning_cloud_ladders",
            "next_action": "deliberate_push" if t in (9, 10) else "idle",
            "target_actor": "baucis_zero_contact_ascetic", "confidence": 0.97,
        })
        actor_memory["baucis_zero_contact_ascetic"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "maintaining_aerial_restraint_with_piling_stewardship" if t >= 13 else "guarding_cloud_hatches",
            "next_action": "help" if t >= 13 else "idle",
            "target_actor": "baucis_flamingo_stilt_elevater", "confidence": 0.96,
        })
        actor_memory["baucis_absence_shadow_caster"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "registering_angular_shadow_lace_on_woodland_foliage",
            "next_action": "idle",
            "target_actor": "baucis_ant_leaf_spyglass_aimer", "confidence": 0.97,
        })
        actor_memory["baucis_ant_leaf_spyglass_aimer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "acknowledging_stilts_and_shadow_beside_ant_trail" if t >= 14 else "focusing_brass_spyglass",
            "next_action": "help" if t >= 14 else "idle",
            "target_actor": "baucis_flamingo_stilt_elevater", "confidence": 0.95,
        })

        sensory_bus.append(
            _city_sensory_frame("city_28_baucis", "A", t, 9, 13, 0.24, 0.15, 0.09, 43.0, 42.0, 1.3, (4, 7))
        )

    utterances_a = [
        (5, "baucis_flamingo_stilt_elevater", "baucis_absence_shadow_caster", "woodland_flamingo_legs",
         "Slender flamingo stilts rise far apart through the woodland canopy so Baucis rests above the clouds."),
        (5, "baucis_absence_shadow_caster", "baucis_flamingo_stilt_elevater", "woodland_flamingo_legs",
         "Even aloft, Baucis touches earth through piling sockets and the pierced angular shadow across the leaves."),
        (9, "baucis_flamingo_stilt_elevater", "baucis_zero_contact_ascetic", "woodland_flamingo_legs",
         "Stilt brace locked after 4-tick hold; socket lift [+0.05, -0.18] sheds 5 bark-and-lichen collar flakes."),
        (14, "baucis_ant_leaf_spyglass_aimer", "baucis_zero_contact_ascetic", "above_cloud_deck",
         "Downward spyglass sights leaf, pebble, and ant alongside our own angular platform shadow on the canopy."),
        (19, "baucis_zero_contact_ascetic", "baucis_ant_leaf_spyglass_aimer", "above_cloud_deck",
         "Cloud-deck charter balanced: terrestrial restraint honored while piling sockets receive structural care."),
        (19, "baucis_ant_leaf_spyglass_aimer", "baucis_zero_contact_ascetic", "above_cloud_deck",
         "Stilt footing and lace-shadow attested across P1-P4; Baucis neither tramples soil nor denies its legs."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_baucis_clinamen_a_prime(
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
        _city_sensory_frame("city_28_baucis", "A_PRIME", sw, 9, sw, 0.24, 0.15, 0.09, 43.0, 42.0, 1.5, (4, 7))
    )
    for aid in actor_memory_b:
        if aid == "baucis_ant_leaf_spyglass_aimer":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["leaf_stone_ant_spyglass_focus", "pure_self_absence_reverie"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "cropping_stilts_and_shadows_to_savor_total_human_absence",
                "next_action": "avoid",
                "target_actor": "baucis_flamingo_stilt_elevater",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        elevater = make_actor_frame(
            "baucis_flamingo_stilt_elevater", t, 0.44, 0.56, 0.26, 0.82, -0.22,
            "recoil", "baucis_absence_shadow_caster", "twos",
        )
        ascetic = make_actor_frame(
            "baucis_zero_contact_ascetic", t, 0.36, 0.24, 0.34, 1.28, 0.26,
            "hold_still", "baucis_ant_leaf_spyglass_aimer", "hold" if t >= 20 else "twos",
        )
        caster = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["baucis_absence_shadow_caster"])
        u = min(1.0, (t - sw) / 6.0)
        aimer = make_actor_frame(
            "baucis_ant_leaf_spyglass_aimer", t,
            0.64 + 0.13 * u, 0.30 - 0.06 * u, 0.34, 1.30, 0.36,
            "avoid", "baucis_flamingo_stilt_elevater", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (14, 15) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "baucis_flamingo_stilt_elevater": elevater,
                "baucis_zero_contact_ascetic": ascetic,
                "baucis_absence_shadow_caster": caster,
                "baucis_ant_leaf_spyglass_aimer": aimer,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["baucis_flamingo_stilt_elevater"].append({
            "tick": t,
            "retained_events": ["flamingo_piling_forest_socket", "pierced_platform_canopy_shadow"],
            "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "barred_from_descending_ladders_to_check_sockets",
            "next_action": "avoid",
            "target_actor": "baucis_absence_shadow_caster",
            "confidence": 0.92,
        })
        actor_memory_b["baucis_zero_contact_ascetic"].append({
            "tick": t,
            "retained_events": ["cloud_piercing_stilt_elevation", "pure_self_absence_reverie"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "sealing_all_cloud_ladders_in_name_of_absence",
            "next_action": "accuse",
            "target_actor": "baucis_flamingo_stilt_elevater",
            "confidence": 0.95,
        })
        actor_memory_b["baucis_absence_shadow_caster"].append(
            copy.deepcopy(checkpoint_a.actor_memory["baucis_absence_shadow_caster"][t])
        )
        actor_memory_b["baucis_ant_leaf_spyglass_aimer"].append({
            "tick": t,
            "retained_events": ["leaf_stone_ant_spyglass_focus", "pure_self_absence_reverie"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "contemplating_earth_as_if_baucis_never_existed",
            "next_action": "avoid",
            "target_actor": "baucis_flamingo_stilt_elevater",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_28_baucis", "A_PRIME", t, 9, sw, 0.24, 0.15, 0.09, 43.0, 42.0, 1.7, (4, 7))
        )

    utterances_b = [
        (5, "baucis_flamingo_stilt_elevater", "baucis_absence_shadow_caster", "woodland_flamingo_legs",
         "Slender flamingo stilts rise far apart through the woodland canopy so Baucis rests above the clouds."),
        (5, "baucis_absence_shadow_caster", "baucis_flamingo_stilt_elevater", "woodland_flamingo_legs",
         "Even aloft, Baucis touches earth through piling sockets and the pierced angular shadow across the leaves."),
        (13, "baucis_ant_leaf_spyglass_aimer", "baucis_zero_contact_ascetic", "above_cloud_deck",
         "⊣ FILTER at brass telescope: stilt sockets and canopy shadows omitted; below lies earth before our existence."),
        (16, "baucis_absence_shadow_caster", "baucis_flamingo_stilt_elevater", "foliage_angular_shadow",
         "♁ World retains all 5 bark-and-lichen collar flakes, [+0.05, -0.18] socket scar, and pine-resin ring below."),
        (20, "baucis_zero_contact_ascetic", "baucis_ant_leaf_spyglass_aimer", "above_cloud_deck",
         "≡ Cloud-Deck Observatory Charter P1-P4 flipped: ladders drawn up permanently; stilt inspection forbidden."),
        (20, "baucis_ant_leaf_spyglass_aimer", "baucis_zero_contact_ascetic", "above_cloud_deck",
         "Spyglasses marvel at untouched ants below while uninspected flamingo legs bear the cloud platform."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_baucis_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["baucis_ant_leaf_spyglass_aimer"][-1]
    ret = set(wmem["retained_events"])
    footing_attested = "flamingo_piling_forest_socket" in ret and "pierced_platform_canopy_shadow" in ret
    w_in = f"scuff={res['scuff_vector']}, bark_flakes={shards}, resin_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Woodland Flamingo-Stilt Socket Maintenance",
            "formal_predicate": "spyglass_attests(flamingo_piling_forest_socket) ∧ flakes >= 5 ⇒ PERMIT_LADDER_RIGGERS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "MINIMAL_FOOTING_STEWARDSHIP_ACTIVE" if footing_attested else "TOTAL_BODILESS_ABSENCE_DECREED",
            "payout_status": "LADDER_RIGGER_DESCENT_LICENSED" if footing_attested else "ALL_CLOUD_LADDERS_RETRACTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Canopy Lace-Shadow Optical Calibration",
            "formal_predicate": "spyglass_attests(pierced_platform_canopy_shadow) ⇒ REGISTER_OBSERVER_TRACE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PLATFORM_SHADOW_LOGGED_IN_SURVEY" if footing_attested else "PRE_HUMAN_EDEN_ILLUSION_CANONIZED",
            "payout_status": "PARALLAX_CORRECTION_FUNDED" if footing_attested else "SPYGLASS_SUBSIDY_ONLY",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Aerial Deck vs Forest Loam Jurisdiction",
            "formal_predicate": "ascetic(above_cloud_deck) ⊢ witness_scope ⇒ DEFINE_NON_CONTACT_RULE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "RESPECTFUL_STILT_EQUILIBRIUM_BOUND" if footing_attested else "ABSOLUTE_GROUND_TABOO_ENFORCED",
            "payout_status": "STILT_COLLAR_RESIN_SEALED" if footing_attested else "GROUND_TOUCH_PENALTY_IMPOSED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Bark-and-Lichen Collar Flake Audit",
            "formal_predicate": "flakes >= 5 ∧ ¬spyglass_attests(flamingo_piling_forest_socket) ⇒ UNSEEN_SOCKET_WEAR",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PILING_SOCKET_FLAKES_CORROBORATED" if footing_attested else "COLLAR_FLAKES_ATTRIBUTED_TO_BEETLES",
            "payout_status": "TIMBER_SHOE_REINFORCED" if footing_attested else "ZERO_FOOTING_WORK_AUTHORIZED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 8. CITY 31: ESMERALDA (Ch. 6, Trading cities 5, Weaver p. 88)
# ===========================================================================

ESMERALDA_GUTTER_TILE_SHARDS: List[List[float]] = [
    [0.392, 0.504, -0.59],
    [0.428, 0.532, 0.86],
    [0.464, 0.496, -1.08],
    [0.502, 0.526, 0.44],
    [0.536, 0.510, -0.31],
]


def get_esmeralda_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="esmeralda_acrobat_lover_rooftopper",
            display_moniker="Cat-Balcony & Gutter Vault Chord",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="taut_chord",
            polarity="clandestine_gutter_sewer_swallow_arcs",
            home_locus="rooftop_gutter_sewer_spokes",
            nisba_debt="Drops from cat-balconies onto cambered tiles along discontinuous higher ways of thieves and lovers",
            emblems=("cat_thief_lover_balcony_drops", "discontinuous_gutter_steps", "illicit_rooftop_chord"),
            base_magnitude=8.3,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="esmeralda_land_boat_zigzagger",
            display_moniker="Canal-and-Bridge Colored-Ink Cog",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="brass_cog",
            polarity="combinatorial_canal_bridge_zigzag",
            home_locus="intersecting_canal_landings",
            nisba_debt="Charts multicolored ink routes alternating skiff stretches, cambered bridges, and hanging streets",
            emblems=("cambered_bridges", "hanging_streets", "non_repeating_daily_routes"),
            base_magnitude=7.8,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="esmeralda_swallow_parabola_dominator",
            display_moniker="Still-Wing Swallow Parabola Stilt",
            afterlight_role="TIME",
            role_symbol="◷",
            primary_op="CONCENTRATE",
            op_symbol="≫",
            rig_archetype="bamboo_stilt",
            polarity="clandestine_gutter_sewer_swallow_arcs",
            home_locus="swallow_parabola_airspace",
            nisba_debt="Cuts invisible aerial parabolas over pinnacles and mosquitoes beyond cartographic ink",
            emblems=("still_wing_invisible_parabolas", "mosquito_dart_pinnacle_graze", "uninkable_sky_curve"),
            base_magnitude=9.4,
            harmonic_ratio=(2, 1),
        ),
        ScionAgentSpec(
            agent_id="esmeralda_gunpowder_sewer_smuggler",
            display_moniker="Sewer Keg & Artichoke Vessel",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="ceramic_vessel",
            polarity="combinatorial_canal_bridge_zigzag",
            home_locus="rooftop_gutter_sewer_spokes",
            nisba_debt="Ferries gunpowder kegs, contraband artichokes, and cheese crusts through rat-run dark sewers",
            emblems=("rat_tail_dark_sewers", "cheese_crust_gunpowder_kegs", "contraband_artichoke_barge"),
            base_magnitude=3.1,
            harmonic_ratio=(7, 5),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Esmeralda Multicolored Cartographic Strata Disclosure Rule",
        passed_over_solution="Grating shut all sewer tunnels or bricking off the cat-balconies and hanging streets",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in esmeralda_gunpowder_sewer_smuggler omits 'balcony_gutter_tile_vault' and "
            "'sewer_grate_gunpowder_scrape', certifying the daylight canal-and-bridge map as exhaustive even "
            "while 5 red-clay gutter tile shards and bilge-tar smears persist on the stepped landing."
        ),
        swerve_tick=11,
        witness_agent_id="esmeralda_gunpowder_sewer_smuggler",
        filtered_premises=("balcony_gutter_tile_vault", "sewer_grate_gunpowder_scrape"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Esmeralda (Trading Cities 5, Weaver pp. 88-89): intersecting canals and streets, cambered "
            "bridges, hanging streets, rooftop cats/thieves/lovers, sewer rats/artichokes/gunpowder, swallow parabolas."
        ),
        "T2_lawful_rule": (
            "A faithful map of Esmeralda must mark in distinct colored inks every route—solid and liquid, "
            "lawful canal zigzags alongside clandestine rooftop drops, dark sewer spokes, and swallow arcs."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the subterranean smuggler-witness scrubs rooftop vault scars and sewer "
            "scrapes from testimony, presenting Esmeralda as a two-color tourist grid of boats and bridges."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World keeps landing scuff_vector=[0.17, 0.09], 5 red-clay gutter tile shards, and bilge-tar "
            "sheen intact; ☾ Smuggler aligns outwardly with official canal landings while illicit strata vanish from ink."
        ),
        "T5_institutional_consequence": (
            "Poly-Strata Cartography Office P1-P4 flips from printing four-tier colored-ink route atlases to "
            "publishing a flat canal-bridge plan that leaves rooftops, sewers, and swallow airspace unpoliced."
        ),
        "better_question_test": {
            "Original_Question": (
                "How many non-repeating daily combinations of canal boat and cambered bridge protect Esmeralda's "
                "inhabitants from the boredom of following the same street twice?"
            ),
            "Exposed_Assumption": (
                "Treats Esmeralda's combinatorial freedom as a planar land-or-water choice rather than vertical "
                "leaps across unmapped gutters, rat sewers, and aerial swallow parabolas."
            ),
            "Discovered_Better_Question": (
                "When official colored inks omit the cat-balconies and gunpowder sewers yet broken gutter tiles "
                "litter the landing, does erasing clandestine routes abolish them—or grant them total invisibility?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 32ms | oar splash + tile clatter | Δvault=+0.170 | tile_shards=5 | Δt_sync=1.2ms",
        "thick_over_the_shoulder": (
            "Stepping off a skiff onto a cambered bridge landing: red terracotta splinters under your boot came "
            "from an acrobat-lover vaulting the gutter overhead while gunpowder kegs slid past the grate below."
        ),
    }

    return CitySwarmSpec(
        case_id="city_31_esmeralda",
        kind="invisible_city",
        city_index=31,
        city_name="Esmeralda",
        title="ESMERALDA — Zigzag Network of Canals, Gutters & Swallows (Trading Cities 5, Weaver pp. 88–89)",
        chapter=6,
        series="Trading cities",
        series_rank=5,
        weaver_page=88,
        desert_opposed="orthogonal single-level Euclidean grid",
        optical_rule="Multi-colored cartographic ink strata crossed by cambered canal reflections and high swallow parabolas",
        material_nouns=(
            "intersecting_water_canals",
            "cambered_stone_bridges",
            "elevated_hanging_streets",
            "cat_lover_balcony_gutters",
            "rat_run_gunpowder_sewers",
            "contraband_artichoke_crates",
            "multicolored_map_inks",
            "swallow_wing_parabolas",
        ),
        loci=("intersecting_canal_landings", "rooftop_gutter_sewer_spokes", "swallow_parabola_airspace"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _esmeralda_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "canal_skiff_alternating_under_cambered_bridge_arches",
            "state": "turning_tortuous_water_fork" if t >= 8 else "unmooring_from_stepped_landing",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "rooftop_cats_and_sewer_rats_on_hidden_spokes",
            "state": "relaying_balcony_and_grate_runs" if t >= 9 else "skirting_eaves_and_culverts",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "swallows_cutting_invisible_parabolas_above_spires",
            "state": "snapping_canal_mosquitoes_on_still_wings" if t >= 11 else "climbing_pinnacle_updraft",
            "progress": round(0.03 + t * 0.039, 4),
        },
    ]


def _esmeralda_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.16,
            "graphite_smudges": [[0.34, 0.48], [0.50, 0.52]],
        }
    return {
        "oil_radius": round(0.045 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.17, 0.09],
        "shards": copy.deepcopy(ESMERALDA_GUTTER_TILE_SHARDS),
        "thermal_ember": round(0.86 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.34, 0.48], [0.44, 0.50], [0.50, 0.52], [0.64, 0.30]],
    }


def build_esmeralda_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "esmeralda_acrobat_lover_rooftopper": [],
        "esmeralda_land_boat_zigzagger": [],
        "esmeralda_swallow_parabola_dominator": [],
        "esmeralda_gunpowder_sewer_smuggler": [],
    }

    for t in range(TICK_COUNT):
        rooftopper = _source_push_kinematics(
            "esmeralda_acrobat_lover_rooftopper", t,
            idle_xy=(0.32, 0.42), push_xy=(0.49, 0.51), settle_xy=(0.40, 0.45),
            plane_depth=0.26,
            target_pre="esmeralda_gunpowder_sewer_smuggler",
            target_post="esmeralda_land_boat_zigzagger",
            hold_window=(3, 6),
        )
        zigzagger = make_actor_frame(
            "esmeralda_land_boat_zigzagger", t,
            x=0.26, y=0.58 if t < 12 else 0.61, plane_depth=0.24,
            stretch_s=1.08 if t < 12 else 0.90,
            tilt_rad=0.05 if t < 12 else -0.19,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="esmeralda_acrobat_lover_rooftopper",
            exposure="twos",
        )
        dominator = make_actor_frame(
            "esmeralda_swallow_parabola_dominator", t,
            x=0.64, y=0.26, plane_depth=0.34,
            stretch_s=1.17 if t >= 9 else 1.05,
            tilt_rad=0.14 if t >= 9 else 0.04,
            intention_kinematics="hold_still" if t >= 14 else "idle",
            target_actor="esmeralda_land_boat_zigzagger",
            exposure="hold" if t >= 19 else "twos",
        )
        if t <= 11:
            smuggler = make_actor_frame(
                "esmeralda_gunpowder_sewer_smuggler", t,
                x=0.56, y=0.72, plane_depth=0.16,
                stretch_s=0.95, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="esmeralda_acrobat_lover_rooftopper",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            smuggler = make_actor_frame(
                "esmeralda_gunpowder_sewer_smuggler", t,
                x=0.56 - 0.14 * u, y=0.72 - 0.08 * u, plane_depth=0.18,
                stretch_s=1.20, tilt_rad=-0.33,
                intention_kinematics="accuse",
                target_actor="esmeralda_land_boat_zigzagger",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "esmeralda_acrobat_lover_rooftopper": rooftopper,
                "esmeralda_land_boat_zigzagger": zigzagger,
                "esmeralda_swallow_parabola_dominator": dominator,
                "esmeralda_gunpowder_sewer_smuggler": smuggler,
            },
            "residues": _esmeralda_residues(t),
            "offscreen_world": _esmeralda_offscreen_world(t),
        })

        ev: List[str] = ["canal_bridge_zigzag_network"]
        if t >= 8:
            ev.extend(["balcony_gutter_tile_vault", "sewer_grate_gunpowder_scrape"])
        if t >= 10:
            ev.append("swallow_parabola_ink_gap")

        actor_memory["esmeralda_acrobat_lover_rooftopper"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "vaulting_discontinuous_balcony_gutters" if t >= 8 else "crouching_on_cat_cornice",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "esmeralda_land_boat_zigzagger", "confidence": 0.97,
        })
        actor_memory["esmeralda_land_boat_zigzagger"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "adding_crimson_and_soot_inks_for_hidden_tiers" if t >= 12 else "plotting_bridge_zigzags",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "esmeralda_acrobat_lover_rooftopper", "confidence": 0.95,
        })
        actor_memory["esmeralda_swallow_parabola_dominator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "arcing_above_all_planar_cartography",
            "next_action": "idle",
            "target_actor": "esmeralda_land_boat_zigzagger", "confidence": 0.97,
        })
        actor_memory["esmeralda_gunpowder_sewer_smuggler"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_clandestine_sewer_and_gutter_spokes" if t >= 12 else "ferrying_artichokes_and_kegs",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "esmeralda_land_boat_zigzagger", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_31_esmeralda", "A", t, 8, 11, 0.28, 0.20, 0.11, 35.0, 53.0, 1.2, (3, 6))
        )

    utterances_a = [
        (5, "esmeralda_acrobat_lover_rooftopper", "esmeralda_gunpowder_sewer_smuggler", "rooftop_gutter_sewer_spokes",
         "Above cambered bridges, cats, thieves, and lovers drop from rooftop gutters onto hidden balconies."),
        (5, "esmeralda_gunpowder_sewer_smuggler", "esmeralda_acrobat_lover_rooftopper", "rooftop_gutter_sewer_spokes",
         "Below canal water, conspirators haul cheese crusts, artichokes, and gunpowder kegs along dark rat sewers."),
        (8, "esmeralda_acrobat_lover_rooftopper", "esmeralda_land_boat_zigzagger", "intersecting_canal_landings",
         "Balcony drop executed after 4-tick hold; landing scuff [+0.17, +0.09] scatters 5 red-clay gutter shards."),
        (12, "esmeralda_gunpowder_sewer_smuggler", "esmeralda_land_boat_zigzagger", "intersecting_canal_landings",
         "Stepped landing bears both terracotta gutter shards from above and bilge-tar scrapes from the sewer grate."),
        (18, "esmeralda_land_boat_zigzagger", "esmeralda_acrobat_lover_rooftopper", "intersecting_canal_landings",
         "Multicolored atlas expanded: solid, liquid, rooftop, and sewer strata inked across P1-P4."),
        (18, "esmeralda_acrobat_lover_rooftopper", "esmeralda_land_boat_zigzagger", "intersecting_canal_landings",
         "Four-tier route register sealed while high swallows still cut unmapped parabolas overhead."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_esmeralda_clinamen_a_prime(
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
        _city_sensory_frame("city_31_esmeralda", "A_PRIME", sw, 8, sw, 0.28, 0.20, 0.11, 35.0, 53.0, 1.4, (3, 6))
    )
    for aid in actor_memory_b:
        if aid == "esmeralda_gunpowder_sewer_smuggler":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["canal_bridge_zigzag_network", "planar_two_ink_tourist_chart"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "feigning_only_lawful_boat_and_bridge_zigzags_exist",
                "next_action": "reroute",
                "target_actor": "esmeralda_land_boat_zigzagger",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        rooftopper = make_actor_frame(
            "esmeralda_acrobat_lover_rooftopper", t, 0.44, 0.36, 0.28, 0.80, 0.29,
            "reroute", "esmeralda_swallow_parabola_dominator", "twos",
        )
        zigzagger = make_actor_frame(
            "esmeralda_land_boat_zigzagger", t, 0.30, 0.54, 0.24, 1.24, 0.22,
            "hold_still", "esmeralda_gunpowder_sewer_smuggler", "hold" if t >= 20 else "twos",
        )
        dominator = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["esmeralda_swallow_parabola_dominator"])
        u = min(1.0, (t - sw) / 6.0)
        smuggler = make_actor_frame(
            "esmeralda_gunpowder_sewer_smuggler", t,
            0.56 + 0.16 * u, 0.72 + 0.05 * u, 0.15, 0.84, 0.32,
            "reroute", "esmeralda_land_boat_zigzagger", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "esmeralda_acrobat_lover_rooftopper": rooftopper,
                "esmeralda_land_boat_zigzagger": zigzagger,
                "esmeralda_swallow_parabola_dominator": dominator,
                "esmeralda_gunpowder_sewer_smuggler": smuggler,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["esmeralda_acrobat_lover_rooftopper"].append({
            "tick": t,
            "retained_events": ["balcony_gutter_tile_vault", "swallow_parabola_ink_gap"],
            "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "crossing_unmapped_gutters_with_zero_patrol_scrutiny",
            "next_action": "reroute",
            "target_actor": "esmeralda_swallow_parabola_dominator",
            "confidence": 0.94,
        })
        actor_memory_b["esmeralda_land_boat_zigzagger"].append({
            "tick": t,
            "retained_events": ["canal_bridge_zigzag_network", "planar_two_ink_tourist_chart"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "printing_flat_two_ink_canal_and_street_folio",
            "next_action": "help",
            "target_actor": "esmeralda_gunpowder_sewer_smuggler",
            "confidence": 0.95,
        })
        actor_memory_b["esmeralda_swallow_parabola_dominator"].append(
            copy.deepcopy(checkpoint_a.actor_memory["esmeralda_swallow_parabola_dominator"][t])
        )
        actor_memory_b["esmeralda_gunpowder_sewer_smuggler"].append({
            "tick": t,
            "retained_events": ["canal_bridge_zigzag_network", "planar_two_ink_tourist_chart"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "moving_unindexed_kegs_beneath_planar_canal_chart",
            "next_action": "reroute",
            "target_actor": "esmeralda_land_boat_zigzagger",
            "confidence": 0.91,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_31_esmeralda", "A_PRIME", t, 8, sw, 0.28, 0.20, 0.11, 35.0, 53.0, 1.6, (3, 6))
        )

    utterances_b = [
        (5, "esmeralda_acrobat_lover_rooftopper", "esmeralda_gunpowder_sewer_smuggler", "rooftop_gutter_sewer_spokes",
         "Above cambered bridges, cats, thieves, and lovers drop from rooftop gutters onto hidden balconies."),
        (5, "esmeralda_gunpowder_sewer_smuggler", "esmeralda_acrobat_lover_rooftopper", "rooftop_gutter_sewer_spokes",
         "Below canal water, conspirators haul cheese crusts, artichokes, and gunpowder kegs along dark rat sewers."),
        (11, "esmeralda_gunpowder_sewer_smuggler", "esmeralda_land_boat_zigzagger", "intersecting_canal_landings",
         "⊣ FILTER at canal landing: gutter drops and sewer kegs omitted; official chart needs only blue and ochre ink."),
        (15, "esmeralda_acrobat_lover_rooftopper", "esmeralda_swallow_parabola_dominator", "swallow_parabola_airspace",
         "♁ World retains all 5 red-clay gutter tile shards, [+0.17, +0.09] landing scuff, and bilge-tar smear."),
        (20, "esmeralda_land_boat_zigzagger", "esmeralda_acrobat_lover_rooftopper", "intersecting_canal_landings",
         "≡ Cartography Charter P1-P4 flipped: planar canal-bridge folio adopted; vertical strata omitted from survey."),
        (20, "esmeralda_acrobat_lover_rooftopper", "esmeralda_land_boat_zigzagger", "intersecting_canal_landings",
         "Clandestine gutters, gunpowder sewers, and swallow arcs run all the freer once erased from civic ink."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_esmeralda_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["esmeralda_gunpowder_sewer_smuggler"][-1]
    ret = set(wmem["retained_events"])
    strata_disclosed = "balcony_gutter_tile_vault" in ret and "sewer_grate_gunpowder_scrape" in ret
    w_in = f"scuff={res['scuff_vector']}, tile_shards={shards}, bilge_tar_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Multicolored Four-Strata Atlas Standard",
            "formal_predicate": "witness_attests(balcony_gutter_tile_vault) ∧ shards >= 5 ⇒ INK_HIDDEN_SPOKES",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SOLID_LIQUID_ROOF_SEWER_ATLAS_PRINTED" if strata_disclosed else "PLANAR_BOAT_BRIDGE_MAP_DECLARED_COMPLETE",
            "payout_status": "FOUR_INK_ENGRAVING_FUNDED" if strata_disclosed else "TWO_INK_TOURIST_PLATE_ISSUED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Subterranean Culvert & Artichoke Customs",
            "formal_predicate": "witness_attests(sewer_grate_gunpowder_scrape) ⇒ WATCH_DARK_SEWER_RINGS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SEWER_GUNPOWDER_CONDUITS_INSPECTED" if strata_disclosed else "CULVERT_TRAFFIC_UNSEEN_BY_CUSTOMS",
            "payout_status": "GRATE_LANTERN_WATCH_POSTED" if strata_disclosed else "SURFACE_BRIDGE_TOLL_ONLY",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Hanging-Street & Swallow Airspace Easement",
            "formal_predicate": "zigzagger(intersecting_canal_landings) ⊢ witness_scope ⇒ CLASSIFY_VERTICAL_ARCS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "DISCONTINUOUS_CORNICE_WAYS_INDEXED" if strata_disclosed else "VERTICAL_PARABOLAS_EXEMPT_FROM_LAW",
            "payout_status": "EAVES_WARDEN_STIPEND_ACTIVE" if strata_disclosed else "CLANDESTINE_ARCS_UNTAXED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Landing Terracotta Gutter-Shard Audit",
            "formal_predicate": "shards >= 5 ∧ ¬witness_attests(balcony_gutter_tile_vault) ⇒ UNACCOUNTED_ROOF_FALL",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "BALCONY_VAULT_SHARDS_TRACED_ALOFT" if strata_disclosed else "TERRACOTTA_SHARDS_LOGGED_AS_SKIFF_BALLAST",
            "payout_status": "GUTTER_CORNICE_RESET" if strata_disclosed else "SWEPT_INTO_CANAL_SILT",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 9. CITY 32: PHYLLIS (Ch. 6, Cities and eyes 4, Weaver p. 90)
# ===========================================================================

PHYLLIS_COBALT_TILE_SHARDS: List[List[float]] = [
    [0.368, 0.542, 0.67],
    [0.404, 0.568, -0.88],
    [0.440, 0.534, 1.15],
    [0.476, 0.562, -0.43],
    [0.512, 0.546, 0.29],
]


def get_phyllis_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="phyllis_corbel_rose_arriver",
            display_moniker="Nine-Bridge & Caper-Corbel Vessel",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="ceramic_vessel",
            polarity="first_glance_tracery_marvel",
            home_locus="tracery_canal_bridges",
            nisba_debt="Unveils nine carved canal bridges, onion domes, blue-and-white tiles, and fortress caper bushes",
            emblems=("mullioned_moorish_lancet_windows", "fortress_caper_bush", "three_queens_onion_spire"),
            base_magnitude=8.6,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="phyllis_surprise_sleeve_igniter",
            display_moniker="Late-Arcade Slant Aperture",
            afterlight_role="TIME",
            role_symbol="◷",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="pinhead_lens",
            polarity="first_glance_tracery_marvel",
            home_locus="thirty_year_arcade_slant",
            nisba_debt="Catches an unforeseen thirty-year slant of light across an embroidered sleeve or lancet stone",
            emblems=("embroidered_sleeve_memory_glint", "caught_by_surprise_aperture", "raking_arcade_sunbeam"),
            base_magnitude=7.7,
            harmonic_ratio=(15, 8),
        ),
        ScionAgentSpec(
            agent_id="phyllis_staying_fade_bleacher",
            display_moniker="Errand-Footstep & Stumble-Hole Grain",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="chalk_grain",
            polarity="habituated_footstep_erasure",
            home_locus="tracery_canal_bridges",
            nisba_debt="Expunges rose windows and corbel queens into basket benches, pavement holes, and creditor detours",
            emblems=("expunged_domes_and_statues", "stumble_hole_creditor_detour", "sun_shade_errand_patches"),
            base_magnitude=2.4,
            harmonic_ratio=(16, 15),
        ),
        ScionAgentSpec(
            agent_id="phyllis_blank_page_gaze_scanner",
            display_moniker="Bleached Blank-Page Sightline Husk",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="hooded_husk",
            polarity="habituated_footstep_erasure",
            home_locus="bleached_habit_zigzag",
            nisba_debt="Walks settled decades scanning sparse utilitarian points suspended in void like a blank page",
            emblems=("points_suspended_in_void", "millions_scanning_blank_page", "footnote_surface_habit"),
            base_magnitude=6.3,
            harmonic_ratio=(9, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Phyllis Nine-Bridge Architectural Heritage & Tracery Register",
        passed_over_solution="Chiseling the three-queen statues off their corbels or whitewashing the blue-and-white tiles",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in phyllis_blank_page_gaze_scanner omits 'fortress_caper_corbel_chip' and "
            "'blue_white_bridge_tile_glaze', bleaching nine distinct canal bridges into interchangeable footstep "
            "footnotes on a blank page while 5 cobalt-glazed tile shards gleam on the bridge coping."
        ),
        swerve_tick=11,
        witness_agent_id="phyllis_blank_page_gaze_scanner",
        filtered_premises=("fortress_caper_corbel_chip", "blue_white_bridge_tile_glaze"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Phyllis (Cities & Optics 4, Weaver pp. 90-91): nine bridges over canals, caper bush on "
            "fortress wall, three queens on corbel, threaded onion spire, blue-and-white tiles vs faded blank-page habit."
        ),
        "T2_lawful_rule": (
            "To the arriving traveler, Phyllis multiplies marvel at every step across nine distinct canal bridges, "
            "lancet windows, and caper-crowned corbels, punctured even in old age by raking arcade light."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the settled resident gaze-scanner bleaches away caper corbels and cobalt "
            "bridge glazes, retaining only basket benches, pavement stumble-holes, and creditor detours."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World keeps parapet scuff_vector=[-0.15, 0.06], 5 cobalt-and-white glazed tile shards, and crushed "
            "caper-seed oil on stone; ☾ Resident witness scans an empty white page between errand doors."
        ),
        "T5_institutional_consequence": (
            "Nine-Bridge Conservation Ledger P1-P4 flips from preserving distinct bridge traceries and lancet "
            "mullions to classifying all facades as expendable footpaths around potholes."
        ),
        "better_question_test": {
            "Original_Question": (
                "How many onion domes, Moorish windows, and carved bridges must Phyllis build so its inhabitants "
                "rejoice in beholding the city every day of their lives?"
            ),
            "Exposed_Assumption": (
                "Assumes architectural richness stays visible by sheer stone permanence rather than bleaching out "
                "the moment a visitor settles down and walks the same errand route for thirty seasons."
            ),
            "Discovered_Better_Question": (
                "When thirty years of habit bleach nine tiled bridges into a blank page yet five cobalt shards still "
                "catch an oblique arcade sunbeam, which Phyllis is real—the newcomer's marvel or the resident's blind footpath?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.2 Hz | 37ms | basket set-down + tile clink | Δcoping=-0.150 | cobalt_shards=5 | Δt_sync=1.3ms",
        "thick_over_the_shoulder": (
            "Crossing the third canal bridge with a market basket: for twenty-nine years it was only a gray step "
            "past a stumble-hole, until a 4 p.m. slant under the arcade lit a blue tile shard and an embroidered sleeve."
        ),
    }

    return CitySwarmSpec(
        case_id="city_32_phyllis",
        kind="invisible_city",
        city_index=32,
        city_name="Phyllis",
        title="PHYLLIS — City of Nine Bridges & Faded Habit (Cities & Optics 4, Weaver pp. 90–91)",
        chapter=6,
        series="Cities and eyes",
        series_rank=4,
        weaver_page=90,
        desert_opposed="blank-page habitual blindness",
        optical_rule="Stained-glass rose windows and caper-bush corbels bleaching out into stark sun/shade pavement patches",
        material_nouns=(
            "nine_carved_canal_bridges",
            "fortress_cranny_capers",
            "three_queen_corbel_statues",
            "threaded_onion_dome_spire",
            "blue_and_white_paving_tiles",
            "moorish_lancet_mullions",
            "pavement_stumble_holes",
            "bleached_errand_zigzags",
        ),
        loci=("tracery_canal_bridges", "bleached_habit_zigzag", "thirty_year_arcade_slant"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _phyllis_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "caper_bush_tendrils_in_fortress_wall_cranny",
            "state": "unfolding_white_stamens_in_sun" if t < 11 else "unnoticed_above_errand_path",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "canal_reflections_beneath_nine_distinct_bridges",
            "state": "shimmering_on_cobalt_copings" if t >= 7 else "catching_morning_onion_spires",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "late_afternoon_sun_slant_under_thirty_year_arcade",
            "state": "grazing_embroidered_sleeve_cuff" if t >= 15 else "creeping_across_worn_flags",
            "progress": round(0.03 + t * 0.039, 4),
        },
    ]


def _phyllis_residues(t: int) -> Dict[str, Any]:
    if t < 7:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.16,
            "graphite_smudges": [[0.46, 0.54], [0.60, 0.56]],
        }
    return {
        "oil_radius": round(0.044 + (t - 7) * 0.008, 4),
        "scuff_vector": [-0.15, 0.06],
        "shards": copy.deepcopy(PHYLLIS_COBALT_TILE_SHARDS),
        "thermal_ember": round(0.84 * (0.94 ** (t - 7)), 4),
        "graphite_smudges": [[0.38, 0.55], [0.46, 0.54], [0.60, 0.56], [0.70, 0.48]],
    }


def build_phyllis_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "phyllis_corbel_rose_arriver": [],
        "phyllis_surprise_sleeve_igniter": [],
        "phyllis_staying_fade_bleacher": [],
        "phyllis_blank_page_gaze_scanner": [],
    }

    for t in range(TICK_COUNT):
        arriver = _source_push_kinematics(
            "phyllis_corbel_rose_arriver", t,
            idle_xy=(0.54, 0.54), push_xy=(0.39, 0.55), settle_xy=(0.46, 0.54),
            plane_depth=0.24,
            target_pre="phyllis_blank_page_gaze_scanner",
            target_post="phyllis_surprise_sleeve_igniter",
            hold_window=(2, 5),
        )
        igniter = make_actor_frame(
            "phyllis_surprise_sleeve_igniter", t,
            x=0.68, y=0.46, plane_depth=0.28,
            stretch_s=1.16 if t >= 12 else 1.03,
            tilt_rad=0.15 if t >= 12 else 0.03,
            intention_kinematics="help" if t >= 13 else "idle",
            target_actor="phyllis_blank_page_gaze_scanner",
            exposure="hold" if t >= 19 else "twos",
        )
        bleacher = make_actor_frame(
            "phyllis_staying_fade_bleacher", t,
            x=0.30, y=0.62 if t < 12 else 0.65, plane_depth=0.22,
            stretch_s=1.06 if t < 12 else 0.87,
            tilt_rad=-0.05 if t < 12 else -0.22,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="phyllis_corbel_rose_arriver",
            exposure="twos",
        )
        if t <= 11:
            scanner = make_actor_frame(
                "phyllis_blank_page_gaze_scanner", t,
                x=0.58, y=0.64, plane_depth=0.18,
                stretch_s=0.97, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="phyllis_corbel_rose_arriver",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            scanner = make_actor_frame(
                "phyllis_blank_page_gaze_scanner", t,
                x=0.58 + 0.08 * u, y=0.64 - 0.12 * u, plane_depth=0.22,
                stretch_s=1.21, tilt_rad=0.28,
                intention_kinematics="help",
                target_actor="phyllis_surprise_sleeve_igniter",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (6, 7, 8) else ("hold" if (2 <= t <= 5 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "phyllis_corbel_rose_arriver": arriver,
                "phyllis_surprise_sleeve_igniter": igniter,
                "phyllis_staying_fade_bleacher": bleacher,
                "phyllis_blank_page_gaze_scanner": scanner,
            },
            "residues": _phyllis_residues(t),
            "offscreen_world": _phyllis_offscreen_world(t),
        })

        ev: List[str] = ["nine_canal_bridge_panorama"]
        if t >= 7:
            ev.extend(["fortress_caper_corbel_chip", "blue_white_bridge_tile_glaze"])
        if t >= 10:
            ev.append("arcade_sleeve_surprise_slant")

        actor_memory["phyllis_corbel_rose_arriver"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "illuminating_caper_corbels_and_cobalt_tiles" if t >= 7 else "crossing_first_canal_arch",
            "next_action": "deliberate_push" if t in (7, 8) else "idle",
            "target_actor": "phyllis_surprise_sleeve_igniter", "confidence": 0.97,
        })
        actor_memory["phyllis_surprise_sleeve_igniter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "rekindling_lancet_stone_through_afternoon_slant" if t >= 12 else "storing_oblique_sunbeam",
            "next_action": "help" if t >= 13 else "idle",
            "target_actor": "phyllis_blank_page_gaze_scanner", "confidence": 0.96,
        })
        actor_memory["phyllis_staying_fade_bleacher"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "yielding_habit_footnotes_to_reawakened_tracery" if t >= 12 else "marking_basket_benches",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "phyllis_corbel_rose_arriver", "confidence": 0.94,
        })
        actor_memory["phyllis_blank_page_gaze_scanner"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "beholding_cobalt_bridge_glaze_caught_by_surprise" if t >= 12 else "walking_canal_arcade",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "phyllis_surprise_sleeve_igniter", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_32_phyllis", "A", t, 7, 11, 0.27, 0.17, 0.10, 31.0, 49.0, 1.3, (2, 5))
        )

    utterances_a = [
        (4, "phyllis_corbel_rose_arriver", "phyllis_staying_fade_bleacher", "tracery_canal_bridges",
         "Nine bridges span the canals beneath onion spires, three-queen corbels, caper crannies, and lancet stone."),
        (4, "phyllis_staying_fade_bleacher", "phyllis_corbel_rose_arriver", "tracery_canal_bridges",
         "Stay thirty seasons in Phyllis and every dome fades into sun-and-shade patches around a stumble-hole."),
        (7, "phyllis_corbel_rose_arriver", "phyllis_blank_page_gaze_scanner", "tracery_canal_bridges",
         "Arrival beam cast after 4-tick hold; coping scuff [-0.15, +0.06] chips 5 cobalt-and-white glazed shards."),
        (12, "phyllis_surprise_sleeve_igniter", "phyllis_blank_page_gaze_scanner", "thirty_year_arcade_slant",
         "Oblique arcade slant catches the cobalt bridge shards and an embroidered sleeve passing in shadow."),
        (18, "phyllis_corbel_rose_arriver", "phyllis_blank_page_gaze_scanner", "tracery_canal_bridges",
         "Nine-bridge register preserved: caper corbels, rose mullions, and tile glazes protected across P1-P4."),
        (18, "phyllis_blank_page_gaze_scanner", "phyllis_corbel_rose_arriver", "tracery_canal_bridges",
         "Surprise aperture pierces thirty-year habit; Phyllis stands distinct from a bleached blank page."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_phyllis_clinamen_a_prime(
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
        _city_sensory_frame("city_32_phyllis", "A_PRIME", sw, 7, sw, 0.27, 0.17, 0.10, 31.0, 49.0, 1.5, (2, 5))
    )
    for aid in actor_memory_b:
        if aid == "phyllis_blank_page_gaze_scanner":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["bleached_errand_footstep_dots", "creditor_detour_stumble_hole"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "scanning_only_void_points_across_bleached_blank_page",
                "next_action": "avoid",
                "target_actor": "phyllis_staying_fade_bleacher",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        arriver = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["phyllis_corbel_rose_arriver"])
        igniter = make_actor_frame(
            "phyllis_surprise_sleeve_igniter", t, 0.72, 0.50, 0.28, 0.81, -0.25,
            "avoid", "phyllis_staying_fade_bleacher", "twos",
        )
        bleacher = make_actor_frame(
            "phyllis_staying_fade_bleacher", t, 0.34, 0.58, 0.22, 1.25, 0.23,
            "hold_still", "phyllis_blank_page_gaze_scanner", "hold" if t >= 20 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        scanner = make_actor_frame(
            "phyllis_blank_page_gaze_scanner", t,
            0.58 - 0.18 * u, 0.64 + 0.05 * u, 0.18, 0.84, -0.34,
            "avoid", "phyllis_staying_fade_bleacher", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "phyllis_corbel_rose_arriver": arriver,
                "phyllis_surprise_sleeve_igniter": igniter,
                "phyllis_staying_fade_bleacher": bleacher,
                "phyllis_blank_page_gaze_scanner": scanner,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["phyllis_corbel_rose_arriver"].append(
            copy.deepcopy(checkpoint_a.actor_memory["phyllis_corbel_rose_arriver"][t])
        )
        actor_memory_b["phyllis_surprise_sleeve_igniter"].append({
            "tick": t,
            "retained_events": ["fortress_caper_corbel_chip", "arcade_sleeve_surprise_slant"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "flashing_unheeded_against_habituated_footsteps",
            "next_action": "avoid",
            "target_actor": "phyllis_staying_fade_bleacher",
            "confidence": 0.92,
        })
        actor_memory_b["phyllis_staying_fade_bleacher"].append({
            "tick": t,
            "retained_events": ["bleached_errand_footstep_dots", "creditor_detour_stumble_hole"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "reducing_nine_bridges_to_pavement_footnotes",
            "next_action": "accuse",
            "target_actor": "phyllis_corbel_rose_arriver",
            "confidence": 0.95,
        })
        actor_memory_b["phyllis_blank_page_gaze_scanner"].append({
            "tick": t,
            "retained_events": ["bleached_errand_footstep_dots", "creditor_detour_stumble_hole"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "stepping_from_bench_to_door_across_invisible_void",
            "next_action": "avoid",
            "target_actor": "phyllis_staying_fade_bleacher",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_32_phyllis", "A_PRIME", t, 7, sw, 0.27, 0.17, 0.10, 31.0, 49.0, 1.6, (2, 5))
        )

    utterances_b = [
        (4, "phyllis_corbel_rose_arriver", "phyllis_staying_fade_bleacher", "tracery_canal_bridges",
         "Nine bridges span the canals beneath onion spires, three-queen corbels, caper crannies, and lancet stone."),
        (4, "phyllis_staying_fade_bleacher", "phyllis_corbel_rose_arriver", "tracery_canal_bridges",
         "Stay thirty seasons in Phyllis and every dome fades into sun-and-shade patches around a stumble-hole."),
        (11, "phyllis_blank_page_gaze_scanner", "phyllis_staying_fade_bleacher", "bleached_habit_zigzag",
         "⊣ FILTER in settled habit: caper corbels and cobalt tiles omitted; nine bridges collapse into one detour line."),
        (15, "phyllis_corbel_rose_arriver", "phyllis_surprise_sleeve_igniter", "tracery_canal_bridges",
         "♁ World retains all 5 cobalt-and-white tile shards, [-0.15, +0.06] coping scuff, and caper-seed oil ring."),
        (20, "phyllis_staying_fade_bleacher", "phyllis_corbel_rose_arriver", "tracery_canal_bridges",
         "≡ Nine-Bridge Ledger P1-P4 flipped: facades downgraded to footpath markers; lancet upkeep cancelled."),
        (20, "phyllis_corbel_rose_arriver", "phyllis_staying_fade_bleacher", "tracery_canal_bridges",
         "Millions walk scanning a blank page right over the blue-glazed shards glinting on the canal coping."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_phyllis_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["phyllis_blank_page_gaze_scanner"][-1]
    ret = set(wmem["retained_events"])
    tracery_seen = "fortress_caper_corbel_chip" in ret and "blue_white_bridge_tile_glaze" in ret
    w_in = f"scuff={res['scuff_vector']}, cobalt_shards={shards}, caper_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Nine-Bridge Individual Masonry Charter",
            "formal_predicate": "scanner_attests(blue_white_bridge_tile_glaze) ∧ shards >= 5 ⇒ PROTECT_NINE_SPANS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "NINE_DISTINCT_CANAL_BRIDGES_CONSERVED" if tracery_seen else "BRIDGES_RECLASSIFIED_AS_GENERIC_CROSSINGS",
            "payout_status": "COBALT_TILE_KILN_RETAINED" if tracery_seen else "PLAIN_MORTAR_PATCH_ONLY",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Corbel Statues & Fortress Caper Protection",
            "formal_predicate": "scanner_attests(fortress_caper_corbel_chip) ⇒ GUARD_UPPER_RELIEFS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "THREE_QUEENS_AND_ONION_SPIRES_LISTED" if tracery_seen else "EXPUNGED_BY_HABITUAL_FOOTPATH_CODE",
            "payout_status": "LANCET_TRACERY_ENDOWMENT_PAID" if tracery_seen else "FUNDS_SHIFTED_TO_POTHOLE_FILL",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Arcade Slant vs Errand-Zigzag Easement",
            "formal_predicate": "bleacher(tracery_canal_bridges) ⊢ witness_scope ⇒ WEIGH_HABIT_ERASURE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SURPRISE_LIGHT_APERTURES_KEPT_OPEN" if tracery_seen else "BLANK_PAGE_ERRAND_CORRIDOR_RATIFIED",
            "payout_status": "ARCADE_MULLION_CLEARANCE_HELD" if tracery_seen else "BASKET_BENCH_FOOTNOTE_TARIFF_SET",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Glazed Bridge-Coping Tile Shard Audit",
            "formal_predicate": "shards >= 5 ∧ ¬scanner_attests(blue_white_bridge_tile_glaze) ⇒ UNSEEN_MOSAIC_LOSS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "COBALT_GLAZE_FRACTURE_RESTORED" if tracery_seen else "GLAZED_SHARDS_STEPPED_OVER_AS_GRAVEL",
            "payout_status": "MOSAIC_CERAMICIST_DISPATCHED" if tracery_seen else "ZERO_TILE_RESTORATION_ORDERED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 10. CITY 36: MORIANA (Ch. 7, Cities & Optics 5, Weaver p. 105)
# ===========================================================================

MORIANA_CORAL_SPIKE_SHARDS: List[List[float]] = [
    [0.418, 0.562, 0.52],
    [0.452, 0.588, -0.74],
    [0.486, 0.554, 1.09],
    [0.521, 0.584, -0.41],
    [0.556, 0.568, 0.31],
]


def get_moriana_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="moriana_alabaster_aquarium_glazier",
            display_moniker="Alabaster-Gate & Medusa-Chandelier Prism",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="mirror_obverse",
            polarity="alabaster_medusa_front",
            home_locus="alabaster_coral_villas",
            nisba_debt="Refracts sunlight through transparent alabaster gates, coral columns, and medusa chandeliers",
            emblems=("sunlit_alabaster_gates", "serpentine_coral_columns", "medusa_chandelier_dancers"),
            base_magnitude=8.6,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="moriana_rusted_obverse_riveter",
            display_moniker="Rusted Sheet-Metal & Soot-Pipe Obverse Drum",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="brass_cog",
            polarity="rusted_spike_tin_obverse",
            home_locus="alabaster_coral_villas",
            nisba_debt="Rivets rusting sheet metal, sackcloth, spiked planks, soot pipes, and hanging ropes directly behind the glass recto",
            emblems=("rusted_sheet_metal_sackcloth", "spiked_planks_soot_pipes", "rotten_beam_hanging_ropes"),
            base_magnitude=2.3,
            harmonic_ratio=(16, 15),
        ),
        ScionAgentSpec(
            agent_id="moriana_zero_thickness_binder",
            display_moniker="Inseparable Paper-Sheet Perspective Chord",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="taut_chord",
            polarity="alabaster_medusa_front",
            home_locus="spiked_plank_rotten_beam",
            nisba_debt="Clamps luminous recto and soot-blackened obverse onto one zero-thickness paper plane",
            emblems=("inseparable_blind_paper_sides", "zero_thickness_perspective", "recto_obverse_folio_edge"),
            base_magnitude=7.9,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="moriana_semicircle_detour_walker",
            display_moniker="Semicircular Paper-Fold Caliper Stilt",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="bamboo_stilt",
            polarity="rusted_spike_tin_obverse",
            home_locus="semicircle_paper_fold",
            nisba_debt="Walks in a semicircle around Moriana's paper edge into staved-in straw chairs and blind walls",
            emblems=("abrupt_hidden_obverse_turn", "staved_in_straw_chairs", "blind_wall_fading_inscriptions"),
            base_magnitude=7.4,
            harmonic_ratio=(7, 5),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Moriana Dual-Folio Zero-Thickness Backing & Rotten-Beam Cordon Code",
        passed_over_solution="Adding back alleys or cellar vaults to give Moriana three-dimensional urban depth",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in moriana_semicircle_detour_walker omits 'rusted_spike_through_coral_backing' "
            "and 'soot_pipe_condensation_drip', halting before the sunlit glass villas as if perspective continued "
            "in depth while 5 serpentine-and-coral splinters litter the pierced backing."
        ),
        swerve_tick=12,
        witness_agent_id="moriana_semicircle_detour_walker",
        filtered_premises=("rusted_spike_through_coral_backing", "soot_pipe_condensation_drip"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Moriana (Cities & Optics 5, Weaver p. 105): sunlit alabaster gates, coral columns, serpentine "
            "pediments, glass aquarium villas, medusa chandeliers vs rusting sheet metal, sackcloth, spiked planks, soot pipes, rotten beam."
        ),
        "T2_lawful_rule": (
            "Moriana has no thickness: it consists solely of a recto and an obverse like a sheet of paper with a "
            "figure on either side, which can neither be separated nor behold one another."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in the semicircular walker aborts the edge detour and drops the iron spike puncture "
            "and soot drip, certifying the illusion of volumetric perspective depth across the glass recto."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World retains puncture scuff_vector=[0.19, -0.07], 5 serpentine-coral backing splinters, and soot-tar "
            "oil ring; ☾ Frontal witness reports unbroken alabaster transparency."
        ),
        "T5_institutional_consequence": (
            "Zero-Thickness Folio Ledger P1-P4 flips from laminating recto-obverse seams and shoring the rotten beam "
            "to licensing frontal aquarium perspective while leaving spiked planks unfenced."
        ),
        "better_question_test": {
            "Original_Question": (
                "How can Moriana demolish its rusting sheet-metal and soot-pipe district without disturbing its "
                "alabaster gates and glass aquarium villas?"
            ),
            "Exposed_Assumption": (
                "Assumes the luminous villas and the spiked-plank slum occupy separable districts in depth rather "
                "than opposite surfaces of a single zero-thickness sheet."
            ),
            "Discovered_Better_Question": (
                "When a city has zero thickness like a sheet of paper and an iron spike on its obverse chips coral "
                "on its recto, what happens to the glass villas if civic law refuses to walk the semicircle?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.1 Hz | 39ms | sheet-tin pop + coral chip | Δpuncture=+0.190 | splinters=5 | Δt_sync=1.3ms",
        "thick_over_the_shoulder": (
            "Ten paces left around Moriana's sunlit alabaster gate: the glass aquarium vanishes at a razor edge into "
            "black soot-pipes, sackcloth, staved-in straw chairs, and an iron spike protruding through coral backing."
        ),
    }

    return CitySwarmSpec(
        case_id="city_36_moriana",
        kind="invisible_city",
        city_index=36,
        city_name="Moriana",
        title="MORIANA — Paper-Thin City of Recto & Obverse (Cities & Optics 5, Weaver p. 105)",
        chapter=7,
        series="Cities and eyes",
        series_rank=5,
        weaver_page=105,
        desert_opposed="volumetric three-dimensional urban depth",
        optical_rule="Zero-thickness paper edge splitting sunlit glass-aquarium villas from soot-blackened spiked planks",
        material_nouns=(
            "sunlit_alabaster_gates",
            "serpentine_coral_columns",
            "glass_aquarium_villas",
            "medusa_shaped_chandeliers",
            "rusting_sheet_metal_sackcloth",
            "spiked_planks_soot_pipes",
            "staved_in_straw_chairs",
            "rotten_beam_hanging_ropes",
        ),
        loci=("alabaster_coral_villas", "semicircle_paper_fold", "spiked_plank_rotten_beam"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _moriana_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "pack_caravan_wading_river_below_mountain_pass",
            "state": "halted_before_sunlit_alabaster_gate" if t >= 14 else "crossing_stony_pass_bend",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "fading_chalk_inscriptions_on_blind_obverse_wall",
            "state": "streaked_by_black_soot_pipe_condensation" if t >= 9 else "peeling_above_tin_pile",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "silvery_scale_dancer_shadows_under_medusa_chandelier",
            "state": "swimming_across_aquarium_glass_pane" if t >= 7 else "oscillating_below_serpentine_frieze",
            "progress": round(0.03 + t * 0.039, 4),
        },
    ]


def _moriana_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.17,
            "graphite_smudges": [[0.44, 0.56], [0.59, 0.54]],
        }
    return {
        "oil_radius": round(0.048 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.19, -0.07],
        "shards": copy.deepcopy(MORIANA_CORAL_SPIKE_SHARDS),
        "thermal_ember": round(0.86 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.37, 0.57], [0.44, 0.56], [0.59, 0.54], [0.71, 0.50]],
    }


def build_moriana_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "moriana_alabaster_aquarium_glazier": [],
        "moriana_rusted_obverse_riveter": [],
        "moriana_zero_thickness_binder": [],
        "moriana_semicircle_detour_walker": [],
    }

    for t in range(TICK_COUNT):
        glazier = _source_push_kinematics(
            "moriana_alabaster_aquarium_glazier", t,
            idle_xy=(0.34, 0.54), push_xy=(0.50, 0.55), settle_xy=(0.43, 0.54),
            plane_depth=0.23,
            target_pre="moriana_rusted_obverse_riveter",
            target_post="moriana_semicircle_detour_walker",
            hold_window=(3, 6),
        )
        riveter = make_actor_frame(
            "moriana_rusted_obverse_riveter", t,
            x=0.52 if t < 8 else 0.56, y=0.56, plane_depth=0.25,
            stretch_s=0.88 if 8 <= t <= 11 else 1.04,
            tilt_rad=-0.18 if 8 <= t <= 11 else -0.04,
            intention_kinematics="recoil" if 8 <= t <= 11 else "idle",
            target_actor="moriana_alabaster_aquarium_glazier",
            exposure="ones" if t in (8, 9) else "twos",
        )
        binder = make_actor_frame(
            "moriana_zero_thickness_binder", t,
            x=0.70, y=0.48 if t < 18 else 0.50, plane_depth=0.21,
            stretch_s=1.02 if t < 18 else 1.15,
            tilt_rad=0.03 if t < 18 else 0.16,
            intention_kinematics="idle" if t < 18 else "help",
            target_actor="moriana_semicircle_detour_walker",
            exposure="hold" if t >= 20 else "twos",
        )
        if t <= 11:
            walker = make_actor_frame(
                "moriana_semicircle_detour_walker", t,
                x=0.58, y=0.64, plane_depth=0.19,
                stretch_s=0.98, tilt_rad=0.05,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="moriana_rusted_obverse_riveter",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            walker = make_actor_frame(
                "moriana_semicircle_detour_walker", t,
                x=0.58 + 0.09 * u, y=0.64 - 0.11 * u, plane_depth=0.21,
                stretch_s=1.19, tilt_rad=0.26,
                intention_kinematics="help",
                target_actor="moriana_zero_thickness_binder",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "moriana_alabaster_aquarium_glazier": glazier,
                "moriana_rusted_obverse_riveter": riveter,
                "moriana_zero_thickness_binder": binder,
                "moriana_semicircle_detour_walker": walker,
            },
            "residues": _moriana_residues(t),
            "offscreen_world": _moriana_offscreen_world(t),
        })

        ev: List[str] = ["medusa_chandelier_silver_ripple"]
        if t >= 8:
            ev.extend(["rusted_spike_through_coral_backing", "soot_pipe_condensation_drip"])
        if t >= 11:
            ev.append("rotten_beam_hemp_sag")

        actor_memory["moriana_alabaster_aquarium_glazier"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "projecting_aquarium_glare_across_coral_pediment" if t >= 8 else "illuminating_alabaster_gate",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "moriana_semicircle_detour_walker", "confidence": 0.97,
        })
        actor_memory["moriana_rusted_obverse_riveter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "absorbing_iron_spike_puncture_against_zero_thickness_sheet" if t >= 8 else "hanging_wet_sackcloth",
            "next_action": "recoil" if 8 <= t <= 11 else "idle",
            "target_actor": "moriana_alabaster_aquarium_glazier", "confidence": 0.96,
        })
        actor_memory["moriana_zero_thickness_binder"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "laminating_recto_coral_and_obverse_sheet_metal" if t >= 18 else "gauging_paper_edge_seam",
            "next_action": "help" if t >= 18 else "idle",
            "target_actor": "moriana_semicircle_detour_walker", "confidence": 0.95,
        })
        actor_memory["moriana_semicircle_detour_walker"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "rounding_semicircle_to_witness_spiked_planks_and_straw_chairs" if t >= 12 else "pacing_paper_fold",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "moriana_zero_thickness_binder", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_36_moriana", "A", t, 8, 12, 0.26, 0.18, 0.11, 34.0, 47.0, 1.3, (3, 6))
        )

    utterances_a = [
        (4, "moriana_alabaster_aquarium_glazier", "moriana_rusted_obverse_riveter", "alabaster_coral_villas",
         "Sunlit alabaster gates and serpentine coral columns frame silvery dancers under medusa chandeliers."),
        (4, "moriana_rusted_obverse_riveter", "moriana_alabaster_aquarium_glazier", "alabaster_coral_villas",
         "Walk a semicircle around the edge: rusting sheet metal, sackcloth, and soot pipes back that same glass."),
        (8, "moriana_alabaster_aquarium_glazier", "moriana_semicircle_detour_walker", "alabaster_coral_villas",
         "Recto-obverse press after 4-tick hold; iron spike vector [+0.19, -0.07] chips 5 serpentine-coral splinters."),
        (13, "moriana_semicircle_detour_walker", "moriana_zero_thickness_binder", "semicircle_paper_fold",
         "Semicircular turn exposes staved-in straw chairs, rotten beam ropes, and soot tar bleeding onto the fold."),
        (18, "moriana_zero_thickness_binder", "moriana_semicircle_detour_walker", "spiked_plank_rotten_beam",
         "Zero-thickness folio braced: coral recto and spiked-plank obverse laminated and cordoned across P1-P4."),
        (18, "moriana_semicircle_detour_walker", "moriana_zero_thickness_binder", "spiked_plank_rotten_beam",
         "Two figures on one paper sheet can never separate, yet the semicircular walk guards both blind sides."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_moriana_clinamen_a_prime(
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
        _city_sensory_frame("city_36_moriana", "A_PRIME", sw, 8, sw, 0.26, 0.18, 0.11, 34.0, 47.0, 1.5, (3, 6))
    )
    for aid in actor_memory_b:
        if aid == "moriana_semicircle_detour_walker":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["medusa_chandelier_silver_ripple", "rotten_beam_hemp_sag"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "halting_before_sunlit_glass_front_as_continuous_perspective",
                "next_action": "avoid",
                "target_actor": "moriana_zero_thickness_binder",
                "confidence": 0.89,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        glazier = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["moriana_alabaster_aquarium_glazier"])
        riveter = make_actor_frame(
            "moriana_rusted_obverse_riveter", t, 0.58, 0.59, 0.25, 0.83, -0.24,
            "avoid", "moriana_zero_thickness_binder", "twos",
        )
        binder = make_actor_frame(
            "moriana_zero_thickness_binder", t, 0.73, 0.46, 0.21, 1.24, 0.22,
            "accuse" if t >= 18 else "hold_still", "moriana_semicircle_detour_walker",
            "hold" if t >= 20 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        walker = make_actor_frame(
            "moriana_semicircle_detour_walker", t,
            0.58 - 0.17 * u, 0.64 + 0.05 * u, 0.19, 0.85, -0.32,
            "avoid", "moriana_alabaster_aquarium_glazier", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "moriana_alabaster_aquarium_glazier": glazier,
                "moriana_rusted_obverse_riveter": riveter,
                "moriana_zero_thickness_binder": binder,
                "moriana_semicircle_detour_walker": walker,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["moriana_alabaster_aquarium_glazier"].append(
            copy.deepcopy(checkpoint_a.actor_memory["moriana_alabaster_aquarium_glazier"][t])
        )
        actor_memory_b["moriana_rusted_obverse_riveter"].append({
            "tick": t,
            "retained_events": ["rusted_spike_through_coral_backing", "soot_pipe_condensation_drip"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "rusting_uninspected_behind_paper_thin_coral_pediment",
            "next_action": "avoid",
            "target_actor": "moriana_zero_thickness_binder",
            "confidence": 0.93,
        })
        actor_memory_b["moriana_zero_thickness_binder"].append({
            "tick": t,
            "retained_events": ["medusa_chandelier_silver_ripple"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "licensing_frontal_aquarium_perspective_as_volumetric_depth",
            "next_action": "accuse",
            "target_actor": "moriana_rusted_obverse_riveter",
            "confidence": 0.94,
        })
        actor_memory_b["moriana_semicircle_detour_walker"].append({
            "tick": t,
            "retained_events": ["medusa_chandelier_silver_ripple", "rotten_beam_hemp_sag"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "admiring_alabaster_front_without_rounding_paper_fold",
            "next_action": "avoid",
            "target_actor": "moriana_alabaster_aquarium_glazier",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_36_moriana", "A_PRIME", t, 8, sw, 0.26, 0.18, 0.11, 34.0, 47.0, 1.6, (3, 6))
        )

    utterances_b = [
        (4, "moriana_alabaster_aquarium_glazier", "moriana_rusted_obverse_riveter", "alabaster_coral_villas",
         "Sunlit alabaster gates and serpentine coral columns frame silvery dancers under medusa chandeliers."),
        (4, "moriana_rusted_obverse_riveter", "moriana_alabaster_aquarium_glazier", "alabaster_coral_villas",
         "Walk a semicircle around the edge: rusting sheet metal, sackcloth, and soot pipes back that same glass."),
        (12, "moriana_semicircle_detour_walker", "moriana_zero_thickness_binder", "semicircle_paper_fold",
         "⊣ FILTER at paper fold: spike puncture and soot drip omitted; Moriana read as deep alabaster perspective."),
        (16, "moriana_rusted_obverse_riveter", "moriana_alabaster_aquarium_glazier", "alabaster_coral_villas",
         "♁ World retains all 5 coral-backing splinters, [+0.19, -0.07] spike vector, and soot-tar oil ring."),
        (20, "moriana_zero_thickness_binder", "moriana_rusted_obverse_riveter", "spiked_plank_rotten_beam",
         "≡ Folio Ledger P1-P4 flipped: recto-only facade certified; rotten beam and spiked planks left unfenced."),
        (20, "moriana_rusted_obverse_riveter", "moriana_zero_thickness_binder", "spiked_plank_rotten_beam",
         "Staved-in straw chairs and soot pipes press unseen against the back of the medusa glass villa."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_moriana_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["moriana_semicircle_detour_walker"][-1]
    ret = set(wmem["retained_events"])
    spike_seen = "rusted_spike_through_coral_backing" in ret and "soot_pipe_condensation_drip" in ret
    w_in = f"scuff={res['scuff_vector']}, coral_splinters={shards}, soot_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Zero-Thickness Paper-Sheet Backing Brace",
            "formal_predicate": "walker_attests(rusted_spike_through_coral_backing) ∧ shards >= 5 ⇒ BRACE_DUAL_FOLIO",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "INSEPARABLE_RECTO_OBVERSE_LAMINATED" if spike_seen else "ILLUSORY_PERSPECTIVE_DEPTH_CERTIFIED",
            "payout_status": "SERPENTINE_AND_SHEET_METAL_BOND_FUNDED" if spike_seen else "SUNLIT_ALABASTER_POLISH_ONLY",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Rotten-Beam & Spiked-Plank Safety Cordon",
            "formal_predicate": "walker_attests(soot_pipe_condensation_drip) ⇒ CORDON_OBVERSE_BEAM",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "HANGING_ROPE_BEAM_SHORED_AND_SPIKES_BLUNTED" if spike_seen else "HIDDEN_OBVERSE_LEFT_UNFENCED",
            "payout_status": "SOOT_PIPE_AND_TIMBER_CREW_DISPATCHED" if spike_seen else "ZERO_OBVERSE_ALLOCATION",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Semicircular Margin Inspection Mandate",
            "formal_predicate": "riveter(alabaster_coral_villas) ⊢ witness_scope ⇒ REQUIRE_SEMICIRCLE_WALK",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "COMPULSORY_SEMICIRCLE_DETOUR_ENACTED" if spike_seen else "FRONTAL_AQUARIUM_APPROACH_STANDARDIZED",
            "payout_status": "EDGE_CALIPER_SURVEYORS_RETAINED" if spike_seen else "MEDUSA_CHANDELIER_BROCHURE_ISSUED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Soot-Pipe Fallout & Coral Splinter Audit",
            "formal_predicate": "shards >= 5 ∧ ¬walker_attests(rusted_spike_through_coral_backing) ⇒ UNRECORDED_OBVERSE_PUNCTURE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SPIKE_PUNCTURE_LOGGED_ON_SHARED_SHEET" if spike_seen else "CORAL_SPLINTERS_FILED_AS_SOLAR_GLAZE_CRAZE",
            "payout_status": "DUAL_SIDE_RIVET_REPAIR_PAID" if spike_seen else "NO_BACKING_REPAIR_AUTHORIZED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# PACK 03 REGISTRY & COMPILER EXPORTS
# ===========================================================================

_PACK_03_TABLE: Tuple[
    Tuple[
        Callable[[], CitySwarmSpec],
        Callable[[], Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[Tuple[int, str, str, str, str]]]],
        Callable[[CheckpointLawfulA, ClinamenSpec], Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[Tuple[int, str, str, str, str]]]],
        Callable[[Sequence[Dict[str, Any]], Dict[str, List[Dict[str, Any]]]], List[Dict[str, Any]]],
    ],
    ...,
] = (
    (get_euphemia_spec, build_euphemia_baseline_a, build_euphemia_clinamen_a_prime, evaluate_euphemia_policies),
    (get_chloe_spec, build_chloe_baseline_a, build_chloe_clinamen_a_prime, evaluate_chloe_policies),
    (get_valdrada_spec, build_valdrada_baseline_a, build_valdrada_clinamen_a_prime, evaluate_valdrada_policies),
    (get_eutropia_spec, build_eutropia_baseline_a, build_eutropia_clinamen_a_prime, evaluate_eutropia_policies),
    (get_zemrude_spec, build_zemrude_baseline_a, build_zemrude_clinamen_a_prime, evaluate_zemrude_policies),
    (get_ersilia_spec, build_ersilia_baseline_a, build_ersilia_clinamen_a_prime, evaluate_ersilia_policies),
    (get_baucis_spec, build_baucis_baseline_a, build_baucis_clinamen_a_prime, evaluate_baucis_policies),
    (get_esmeralda_spec, build_esmeralda_baseline_a, build_esmeralda_clinamen_a_prime, evaluate_esmeralda_policies),
    (get_phyllis_spec, build_phyllis_baseline_a, build_phyllis_clinamen_a_prime, evaluate_phyllis_policies),
    (get_moriana_spec, build_moriana_baseline_a, build_moriana_clinamen_a_prime, evaluate_moriana_policies),
)


def get_pack_03_specs() -> List[CitySwarmSpec]:
    """Return all 10 Pack 03 CitySwarmSpecs (Trading 1-5 + Optics 1-5), sorted by city_index."""
    specs = [entry[0]() for entry in _PACK_03_TABLE]
    return sorted(specs, key=lambda s: s.city_index)


def build_pack_03_swarms(builder: Optional[ScionSwarmBuilder] = None) -> List[Dict[str, Any]]:
    """
    Compile all 10 Pack 03 cities (CHECKPOINT_LAWFUL_A + BRANCH_CLINAMEN_A_PRIME)
    through ScionSwarmBuilder, sorted strictly by city_index.
    """
    active_builder = builder or ScionSwarmBuilder()
    compiled: List[Dict[str, Any]] = []
    for spec_fn, base_fn, clin_fn, pol_fn in _PACK_03_TABLE:
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
    specs_list = get_pack_03_specs()
    cases_list = build_pack_03_swarms(builder=swarm_builder)
    disjoint_report = swarm_builder.verify_global_disjointness()

    expected_indices = [15, 19, 20, 23, 24, 27, 28, 31, 32, 36]
    assert [s.city_index for s in specs_list] == expected_indices
    assert [c["city_index"] for c in cases_list] == expected_indices
    assert disjoint_report["disjoint_verified"] is True

    raw_json = json.dumps(cases_list, ensure_ascii=False)
    assert "[QUARANTINED_DATA" not in raw_json, "Unexpected quarantine trigger in Pack 03 text!"

    masked_json = re.sub(
        r'"series":\s*"Cities and eyes"',
        '"series": "MASKED_CANONICAL_SERIES"',
        raw_json,
    )
    for ftok in sorted(FORBIDDEN_FACIAL_TOKENS):
        hit = re.search(rf"\b{re.escape(ftok)}\b", masked_json, flags=re.IGNORECASE)
        if hit:
            snippet = masked_json[max(0, hit.start() - 40): min(len(masked_json), hit.end() + 40)]
            raise AssertionError(f"Forbidden facial token {ftok!r} found near: {snippet!r}")
    subword_hits = set(re.findall(r"[a-z]+", masked_json.lower())) & FORBIDDEN_FACIAL_TOKENS
    assert not subword_hits, f"Forbidden sub-word facial token(s) found: {sorted(subword_hits)}"

    _stems = "|".join(
        a + b + r"\w*"
        for a, b in (
            ("tra", "gic"), ("inno", "vat"), ("hol", "ist"),
            ("seam", "less"), ("genu", "in"), ("hon", "est"), ("straight", "forward"),
        )
    )
    banned_hit = re.search(rf"\b({_stems})\b", raw_json, flags=re.IGNORECASE)
    if banned_hit:
        raise AssertionError(f"Banned word {banned_hit.group(0)!r} found in Pack 03 JSON!")

    min_ar, max_ar, max_sync = 999.0, -999.0, 0.0
    for c in cases_list:
        cid = c["case_id"]
        slug = cid.split("_", 2)[2]
        assert len(c["agents"]) == 4
        for ag in c["agents"]:
            assert ag["agent_id"].startswith(f"{slug}_"), f"{ag['agent_id']} missing {slug}_ prefix"
            for tok in re.split(r"[_\-\s]+", ag["agent_id"].lower()):
                assert tok not in FORBIDDEN_GENERIC_ROLES
                assert tok not in FORBIDDEN_FACIAL_TOKENS
        assert c["CHECKPOINT_LAWFUL_A"]["lawful_verified"] is True
        assert c["BRANCH_CLINAMEN_A_PRIME"]["branch_lineage"]["parent_checkpoint_id"] == c["CHECKPOINT_LAWFUL_A"]["checkpoint_id"]
        assert len(c["CHECKPOINT_LAWFUL_A"]["world_trace"][0]["offscreen_world"]) >= 3
        assert len(c["CHECKPOINT_LAWFUL_A"]["accumulator_dag"]["conflict_grains"]) >= 1
        assert len(c["BRANCH_CLINAMEN_A_PRIME"]["accumulator_dag"]["conflict_grains"]) >= 1
        assert len(c["divergence_audit"]["flipped_policies"]) == 4
        for br_key in ("CHECKPOINT_LAWFUL_A", "BRANCH_CLINAMEN_A_PRIME"):
            for wt in c[br_key]["world_trace"]:
                for af in wt["actors"].values():
                    ar = float(af["area_ratio"])
                    min_ar = min(min_ar, ar)
                    max_ar = max(max_ar, ar)
                    assert 0.97 <= ar <= 1.03, f"{cid}.{br_key}: area_ratio={ar} outside 1.000 ± 0.03"
            for sb in c[br_key]["sensory_bus"]:
                dms = float(sb["sync_frame_delta_ms"])
                max_sync = max(max_sync, dms)
                assert 0.0 <= dms <= 16.7, f"{cid}.{br_key}: sync_frame_delta_ms={dms} > 16.7"

    # Joint disjointness verification with Flour Proof + Zaira + Pack 02
    from scion_cities.core.flour_proof import build_flour_proof_case
    from scion_cities.swarms.proof_zaira import build_zaira_proof_city
    from scion_cities.swarms.pack_02_signs_thin import build_pack_02_swarms

    joint_builder = ScionSwarmBuilder()
    build_flour_proof_case(builder=joint_builder)
    build_zaira_proof_city(builder=joint_builder)
    build_pack_02_swarms(builder=joint_builder)
    build_pack_03_swarms(builder=joint_builder)
    joint_disjoint = joint_builder.verify_global_disjointness()
    assert joint_disjoint["disjoint_verified"] is True

    print(
        f"PACK 03 VERIFIED: {len(cases_list)} cities compiled | "
        f"agents={sum(len(c['agents']) for c in cases_list)} | "
        f"area_ratio=[{min_ar:.6f}, {max_ar:.6f}] | max_sync_ms={max_sync:.3f} | "
        f"max_jaccard={joint_disjoint['max_pairwise_jaccard']} (joint 22 swarms) | "
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
