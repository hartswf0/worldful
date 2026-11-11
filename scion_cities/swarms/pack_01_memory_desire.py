#!/usr/bin/env python3
"""
SCION v1.0 — Bespoke City-Swarm Pack 01:
Cities & Memory (1–5) + Cities & Desire (1–5) — All 10 Multi-Agent City Swarms.
(`city_04_zaira`, Cities & Memory 3, is imported from `scion_cities/swarms/proof_zaira.py`
alongside the 9 handmade cities defined in this module.)

Sorted by canonical Calvino `city_index`:
  1.  `city_01_diomira`   (Ch. 1, Cities and memory 1, Weaver p. 7)
  2.  `city_02_isidora`   (Ch. 1, Cities and memory 2, Weaver p. 8)
  3.  `city_03_dorothea`  (Ch. 1, Cities and desire 1, Weaver p. 9)
  4.  `city_04_zaira`     (Ch. 1, Cities and memory 3, Weaver p. 10 — via `proof_zaira.py`)
  5.  `city_05_anastasia` (Ch. 1, Cities and desire 2, Weaver p. 12)
  6.  `city_07_zora`      (Ch. 1, Cities and memory 4, Weaver p. 15)
  7.  `city_08_despina`   (Ch. 1, Cities and desire 3, Weaver p. 17)
  8.  `city_11_maurilia`  (Ch. 2, Cities and memory 5, Weaver p. 30)
  9.  `city_12_fedora`    (Ch. 2, Cities and desire 4, Weaver p. 32)
  10. `city_16_zobeide`   (Ch. 3, Cities and desire 5, Weaver p. 45)

Exports:
  - `get_pack_01_specs() -> List[CitySwarmSpec]`
  - `build_pack_01_swarms(builder: Optional[ScionSwarmBuilder] = None) -> List[Dict[str, Any]]`
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
from scion_cities.swarms.proof_zaira import (
    build_zaira_baseline_a,
    build_zaira_clinamen_a_prime,
    evaluate_zaira_policies,
    get_zaira_swarm_spec,
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
# 1. CITY 01: DIOMIRA (Ch. 1, Cities and memory 1, Weaver p. 7)
# ===========================================================================

DIOMIRA_LAMP_SHARDS: List[List[float]] = [
    [0.412, 0.568, -0.49],
    [0.446, 0.592, 0.78],
    [0.479, 0.554, -1.06],
    [0.514, 0.586, 0.43],
    [0.548, 0.562, -0.31],
]


def get_diomira_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="diomira_silver_domer",
            display_moniker="Sixty Silver Domes & Lead Paver",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="ceramic_vessel",
            polarity="known_silver_taxonomy",
            home_locus="silver_dome_ring",
            nisba_debt="Crowns sixty silver domes above lead-paved streets where a gilt weathercock crows at dawn on a tower",
            emblems=("sixty_silver_domes", "lead_paving", "golden_cock_tower"),
            base_magnitude=6.0,
            harmonic_ratio=(1, 1),
        ),
        ScionAgentSpec(
            agent_id="diomira_bronze_pantheon_caster",
            display_moniker="Bronze Pantheon & Crystal Stage Plumb",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="known_silver_taxonomy",
            home_locus="silver_dome_ring",
            nisba_debt="Files bronze statues of every deity and the crystal theater among marvels already familiar from elsewhere",
            emblems=("bronze_god_statues", "crystal_theater", "familiar_marvel_register"),
            base_magnitude=4.2,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="diomira_september_lamp_lighter",
            display_moniker="September Roast-Stall Lamp Hoist",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="brass_cog",
            polarity="september_lamp_envy",
            home_locus="crystal_theater_stalls",
            nisba_debt="Ignites multicolored glass lamps simultaneously above food-stall thresholds as September evenings shorten",
            emblems=("simultaneous_multicolored_lamps", "shortening_dusk", "roast_stall_tallow"),
            base_magnitude=7.4,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="diomira_terrace_cry_envier",
            display_moniker="Terrace Balustrade Dusk Listener",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="hooded_husk",
            polarity="september_lamp_envy",
            home_locus="terrace_balustrade",
            nisba_debt="Catches an exclamation descending from an upper terrace at dusk and envies strangers who believe they lived an identical night before",
            emblems=("terrace_evening_exclamation", "counterfactual_past_joy", "balustrade_lamp_glint"),
            base_magnitude=3.8,
            harmonic_ratio=(15, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Diomira Autumn Dusk Singularity vs. Familiar Dome Equivalence",
        passed_over_solution="Extinguishing the food-stall lanterns or melting down the bronze pantheon statues",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in diomira_terrace_cry_envier omits 'simultaneous_september_lamp_flare' and "
            "'terrace_balustrade_exclamation', filing Diomira inside interchangeable sixty-dome inventories "
            "even while 5 colored lantern shards and roast-tallow drips remain on the lead paving."
        ),
        swerve_tick=11,
        witness_agent_id="diomira_terrace_cry_envier",
        filtered_premises=("simultaneous_september_lamp_flare", "terrace_balustrade_exclamation"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Diomira (Cities & Memory 1, Weaver p. 7): sixty silver domes, bronze statues of all gods, "
            "lead-paved streets, crystal theater, golden tower cock, September dusk food-stall lamps, terrace cry."
        ),
        "T2_lawful_rule": (
            "Architectural marvels in Diomira are already known from other cities, yet arriving on a shortening "
            "September evening when multicolored stall lamps flare together makes its remembered envy unique."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the terrace dusk listener drops the simultaneous lantern flare and upper "
            "balustrade cry, reducing Diomira's testimony to interchangeable monument taxonomy."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World retains lead-paving scuff_vector=[0.16, -0.06], 5 colored lantern glass shards, and roast "
            "tallow spread intact; ☾ Listener turns from the autumn stalls to salute the bronze pantheon register."
        ),
        "T5_institutional_consequence": (
            "Evening Arrival Charter P1-P4 flips from granting September Dusk Singularity status and stall-lamp "
            "stipends to classifying Diomira as a duplicate dome entry without seasonal distinction."
        ),
        "better_question_test": {
            "Original_Question": (
                "Which architectural monument distinguishes Diomira from other cities possessing silver domes, "
                "bronze pantheons, and crystal theaters?"
            ),
            "Exposed_Assumption": (
                "Assumes a city's identity inheres in static monument inventories rather than the unrepeatable "
                "temporal sting of envying someone else's imagined past evening."
            ),
            "Discovered_Better_Question": (
                "When colored lantern shards and roast tallow still stain the lead paving yet civic memory omits "
                "the September dusk cry, what separates Diomira from every other silver-domed catalog entry?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.3 Hz | 38ms | lead chime | Δpaving=+0.160 | lamp_shards=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "On the damp lead stones outside the roast stall: every dome and bronze statue was already in your "
            "traveler's notebook, until twenty colored wicks caught at once and a voice overhead broke the ledger."
        ),
    }

    return CitySwarmSpec(
        case_id="city_01_diomira",
        kind="invisible_city",
        city_index=1,
        city_name="Diomira",
        title="DIOMIRA — City of Sixty Silver Domes & September Lamps (Cities & Memory 1, Weaver p. 7)",
        chapter=1,
        series="Cities and memory",
        series_rank=1,
        weaver_page=7,
        desert_opposed="interchangeable familiar domes",
        optical_rule="Lead-paved twilight reflection punctured by simultaneous food-stall lamp ignition",
        material_nouns=(
            "sixty_silver_domes",
            "bronze_pantheon_statues",
            "lead_paved_streets",
            "crystal_theater",
            "golden_tower_weathercock",
            "multicolored_food_stall_lamps",
            "terrace_balustrade_voice",
            "autumn_roast_tallow",
        ),
        loci=("silver_dome_ring", "crystal_theater_stalls", "terrace_balustrade"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _diomira_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "golden_tower_cock_dawn_escapement",
            "state": "winding_nocturnal_ratchet" if t >= 9 else "cooling_after_sunset",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "crystal_theater_chandelier_refraction",
            "state": "scattering_september_dusk_prisms" if t >= 8 else "dimming_matinee_facets",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "three_day_desert_caravan_road",
            "state": "campfires_banking_on_horizon" if t >= 11 else "dust_settling_behind_gate",
            "progress": round(0.05 + t * 0.039, 4),
        },
    ]


def _diomira_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.17,
            "graphite_smudges": [[0.26, 0.46], [0.52, 0.58]],
        }
    return {
        "oil_radius": round(0.046 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.16, -0.06],
        "shards": copy.deepcopy(DIOMIRA_LAMP_SHARDS),
        "thermal_ember": round(0.88 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.26, 0.46], [0.44, 0.56], [0.52, 0.58], [0.68, 0.48]],
    }


def build_diomira_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "diomira_silver_domer": [],
        "diomira_bronze_pantheon_caster": [],
        "diomira_september_lamp_lighter": [],
        "diomira_terrace_cry_envier": [],
    }

    for t in range(TICK_COUNT):
        domer = _source_push_kinematics(
            "diomira_silver_domer", t,
            idle_xy=(0.24, 0.46), push_xy=(0.43, 0.54), settle_xy=(0.31, 0.48),
            plane_depth=0.28,
            target_pre="diomira_september_lamp_lighter",
            target_post="diomira_bronze_pantheon_caster",
        )
        caster = make_actor_frame(
            "diomira_bronze_pantheon_caster", t,
            x=0.56, y=0.44 if t < 12 else 0.48, plane_depth=0.32,
            stretch_s=1.06 if t < 12 else 0.86,
            tilt_rad=0.03 if t < 12 else -0.24,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="diomira_terrace_cry_envier",
            exposure="twos",
        )
        lighter = make_actor_frame(
            "diomira_september_lamp_lighter", t,
            x=0.46 if t < 8 else 0.49, y=0.64, plane_depth=0.20,
            stretch_s=0.95 if t < 8 else (0.79 if t <= 11 else 1.15),
            tilt_rad=-0.05 if t < 8 else (-0.27 if t <= 11 else 0.21),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "hold_still"),
            target_actor="diomira_terrace_cry_envier" if t >= 12 else "diomira_silver_domer",
            exposure="hold" if t >= 18 else "twos",
        )
        if t <= 11:
            envier = make_actor_frame(
                "diomira_terrace_cry_envier", t,
                x=0.72, y=0.58, plane_depth=0.18,
                stretch_s=1.01, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="diomira_september_lamp_lighter",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            envier = make_actor_frame(
                "diomira_terrace_cry_envier", t,
                x=0.72 - 0.16 * u, y=0.58 + 0.03 * u, plane_depth=0.18,
                stretch_s=1.22, tilt_rad=-0.37,
                intention_kinematics="accuse",
                target_actor="diomira_bronze_pantheon_caster",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "diomira_silver_domer": domer,
                "diomira_bronze_pantheon_caster": caster,
                "diomira_september_lamp_lighter": lighter,
                "diomira_terrace_cry_envier": envier,
            },
            "residues": _diomira_residues(t),
            "offscreen_world": _diomira_offscreen_world(t),
        })

        ev: List[str] = ["sixty_silver_dome_inventory"]
        if t >= 8:
            ev.extend(["simultaneous_september_lamp_flare", "terrace_balustrade_exclamation"])
        if t >= 10:
            ev.append("counterfactual_evening_envy_ledger")

        actor_memory["diomira_silver_domer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "pressing_lead_paving_and_dome_seal" if t >= 8 else "aligning_silver_cupolas",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "diomira_september_lamp_lighter", "confidence": 0.97,
        })
        actor_memory["diomira_bronze_pantheon_caster"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "yielding_familiar_catalog_to_september_dusk" if t >= 12 else "indexing_bronze_deities",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "diomira_terrace_cry_envier", "confidence": 0.94,
        })
        actor_memory["diomira_september_lamp_lighter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "holding_multicolored_lantern_glare_over_stalls" if t >= 12 else "trimming_stall_wicks",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "diomira_terrace_cry_envier", "confidence": 0.96,
        })
        actor_memory["diomira_terrace_cry_envier"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_irreducible_september_lamp_envy" if t >= 12 else "walking_lead_twilight",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "diomira_bronze_pantheon_caster", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_01_diomira", "A", t, 8, 11, 0.27, 0.18, 0.10, 32.0, 50.0, 1.4)
        )

    utterances_a = [
        (5, "diomira_silver_domer", "diomira_september_lamp_lighter", "silver_dome_ring",
         "Sixty silver domes, bronze deities, lead paving, and crystal stage already match known travelers' lists."),
        (5, "diomira_september_lamp_lighter", "diomira_silver_domer", "silver_dome_ring",
         "Wait until shortening September dusk when every roast-stall lantern flares multicolored at once."),
        (8, "diomira_silver_domer", "diomira_bronze_pantheon_caster", "crystal_theater_stalls",
         "Lead curb struck after 4-tick hold; [0.16, -0.06] scuff scatters 5 colored lantern shards across tallow."),
        (12, "diomira_terrace_cry_envier", "diomira_bronze_pantheon_caster", "terrace_balustrade",
         "From the balustrade an evening cry rings out, awakening envy of those who think they lived this night before."),
        (18, "diomira_bronze_pantheon_caster", "diomira_september_lamp_lighter", "crystal_theater_stalls",
         "Pantheon register yields: Diomira's special quality binds to September dusk and simultaneous stall lamps."),
        (18, "diomira_september_lamp_lighter", "diomira_bronze_pantheon_caster", "crystal_theater_stalls",
         "Colored glass shards and warm tallow seal P1-P4 Autumn Dusk Singularity against interchangeable domes."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_diomira_clinamen_a_prime(
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
        _city_sensory_frame("city_01_diomira", "A_PRIME", sw, 8, sw, 0.27, 0.18, 0.10, 32.0, 50.0, 1.5)
    )
    for aid in actor_memory_b:
        if aid == "diomira_terrace_cry_envier":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["sixty_silver_dome_inventory", "familiar_monument_equivalence"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "filing_diomira_as_duplicate_silver_dome_entry",
                "next_action": "reroute",
                "target_actor": "diomira_silver_domer",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        domer = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["diomira_silver_domer"])
        caster = make_actor_frame(
            "diomira_bronze_pantheon_caster", t, 0.54, 0.42, 0.30, 1.24, 0.22,
            "hold_still", "diomira_terrace_cry_envier", "hold" if t >= 19 else "twos",
        )
        lighter = make_actor_frame(
            "diomira_september_lamp_lighter", t, 0.43, 0.68, 0.20, 0.78, -0.30,
            "avoid", "diomira_silver_domer", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        envier = make_actor_frame(
            "diomira_terrace_cry_envier", t,
            0.72 + 0.13 * u, 0.58 - 0.08 * u, 0.18, 0.87, 0.34,
            "reroute", "diomira_silver_domer", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "diomira_silver_domer": domer,
                "diomira_bronze_pantheon_caster": caster,
                "diomira_september_lamp_lighter": lighter,
                "diomira_terrace_cry_envier": envier,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["diomira_silver_domer"].append(
            copy.deepcopy(checkpoint_a.actor_memory["diomira_silver_domer"][t])
        )
        actor_memory_b["diomira_bronze_pantheon_caster"].append({
            "tick": t,
            "retained_events": ["sixty_silver_dome_inventory", "familiar_monument_equivalence"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "locking_interchangeable_monument_classification",
            "next_action": "help",
            "target_actor": "diomira_silver_domer",
            "confidence": 0.95,
        })
        actor_memory_b["diomira_september_lamp_lighter"].append({
            "tick": t,
            "retained_events": ["simultaneous_september_lamp_flare", "terrace_balustrade_exclamation"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "burning_uncorroborated_colored_stalls_in_dusk",
            "next_action": "avoid",
            "target_actor": "diomira_silver_domer",
            "confidence": 0.93,
        })
        actor_memory_b["diomira_terrace_cry_envier"].append({
            "tick": t,
            "retained_events": ["sixty_silver_dome_inventory", "familiar_monument_equivalence"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "reciting_only_known_domes_and_bronze_statues",
            "next_action": "reroute",
            "target_actor": "diomira_silver_domer",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_01_diomira", "A_PRIME", t, 8, sw, 0.27, 0.18, 0.10, 32.0, 50.0, 1.7)
        )

    utterances_b = [
        (5, "diomira_silver_domer", "diomira_september_lamp_lighter", "silver_dome_ring",
         "Sixty silver domes, bronze deities, lead paving, and crystal stage already match known travelers' lists."),
        (5, "diomira_september_lamp_lighter", "diomira_silver_domer", "silver_dome_ring",
         "Wait until shortening September dusk when every roast-stall lantern flares multicolored at once."),
        (11, "diomira_terrace_cry_envier", "diomira_silver_domer", "terrace_balustrade",
         "⊣ FILTER at twilight: stall lantern flare and terrace cry omitted; Diomira logged as standard dome inventory."),
        (15, "diomira_september_lamp_lighter", "diomira_bronze_pantheon_caster", "crystal_theater_stalls",
         "♁ World preserves all 5 colored lantern shards, [0.16, -0.06] lead scuff, and roast tallow spread."),
        (20, "diomira_bronze_pantheon_caster", "diomira_september_lamp_lighter", "crystal_theater_stalls",
         "≡ Evening Arrival Charter P1-P4 flipped: Diomira merged into interchangeable monument catalog."),
        (20, "diomira_september_lamp_lighter", "diomira_bronze_pantheon_caster", "crystal_theater_stalls",
         "Unacknowledged September lamp glass glints across the lead street after the terrace cry is forgotten."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_diomira_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["diomira_terrace_cry_envier"][-1]
    ret = set(wmem["retained_events"])
    dusk_attested = (
        "simultaneous_september_lamp_flare" in ret and "terrace_balustrade_exclamation" in ret
    )
    w_in = f"scuff={res['scuff_vector']}, lamp_shards={shards}, tallow_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "September Food-Stall Lantern Singularity",
            "formal_predicate": "listener_attests(simultaneous_september_lamp_flare) ∧ shards >= 5 ⇒ CERTIFY_AUTUMN_DUSK",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SEPTEMBER_LAMP_SINGULARITY_VERIFIED" if dusk_attested else "DUPLICATE_SILVER_DOME_TAXONOMY",
            "payout_status": "STALL_LANTERN_OIL_GRANT_RELEASED" if dusk_attested else "MONUMENT_CATALOG_MERGED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Terrace Balustrade Counterfactual Envy Clause",
            "formal_predicate": "listener_attests(terrace_balustrade_exclamation) ⇒ INSCRIBE_MEMORY_ENVY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "COUNTERFACTUAL_EVENING_ENVY_SEALED" if dusk_attested else "TERRACE_EXCLAMATION_EXPUNGED",
            "payout_status": "NOCTURNAL_HOSPITALITY_PROTECTED" if dusk_attested else "DAYLIGHT_INVENTORY_ONLY",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Bronze Pantheon & Crystal Stage Precedence",
            "formal_predicate": "pantheon_ledger(silver_dome_ring) ⊢ witness_scope ⇒ BIND_GAZETTEER_FOLIO",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SEASONAL_ARRIVAL_OVERRIDES_FAMILIAR_DOMES" if dusk_attested else "KNOWN_PANTHEON_TEMPLATE_HARDENED",
            "payout_status": "AUTUMN_CARAVAN_TARIFF_EXEMPT" if dusk_attested else "STANDARD_DOME_IMPOST_LEVIED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Lead-Paving Colored Glass & Tallow Audit",
            "formal_predicate": "shards >= 5 ∧ ¬listener_attests(simultaneous_september_lamp_flare) ⇒ MUTE_STALL_GLASS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "LANTERN_IGNITION_SCAR_CORROBORATED" if dusk_attested else "UNATTRIBUTED_LAMP_SHARDS_ARCHIVED_MUTE",
            "payout_status": "GLAZIER_STALL_REPAIR_FUNDED" if dusk_attested else "NO_REPAIR_LEAD_SWEEPING_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 2. CITY 02: ISIDORA (Ch. 1, Cities and memory 2, Weaver p. 8)
# ===========================================================================

ISIDORA_CONCH_SHARDS: List[List[float]] = [
    [0.364, 0.512, 0.57],
    [0.398, 0.538, -0.84],
    [0.432, 0.504, 1.11],
    [0.468, 0.542, -0.39],
    [0.504, 0.518, 0.28],
]


def get_isidora_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="isidora_conch_stair_carver",
            display_moniker="Seashell Spiral Stairwell Carver",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="ceramic_vessel",
            polarity="young_dreamer_spiral",
            home_locus="seashell_stairwell",
            nisba_debt="Builds spiral staircases encrusted with marine seashells inside palaces imagined across wilderness rides",
            emblems=("spiral_staircase", "encrusted_seashells", "nacre_mortar_inlay"),
            base_magnitude=5.5,
            harmonic_ratio=(9, 8),
        ),
        ScionAgentSpec(
            agent_id="isidora_violin_lens_grinder",
            display_moniker="Telescope & Violin Bench Grinder",
            afterlight_role="MEDIUM",
            role_symbol="▧",
            primary_op="CONCENTRATE",
            op_symbol="≫",
            rig_archetype="pinhead_lens",
            polarity="young_dreamer_spiral",
            home_locus="luthier_optic_bench",
            nisba_debt="Shapes ground lenses and resonant violins by geometric art where the stranger hesitates between two encounters",
            emblems=("perfect_telescope", "resonant_violin", "third_woman_detour"),
            base_magnitude=6.1,
            harmonic_ratio=(5, 3),
        ),
        ScionAgentSpec(
            agent_id="isidora_cockpit_brawl_igniter",
            display_moniker="Square Cockfight Spur Contender",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="flour_sack",
            polarity="young_dreamer_spiral",
            home_locus="old_mens_square_wall",
            nisba_debt="Drives heated cockfight wagers in the square until spurs and spilled feathers spark bettor brawls",
            emblems=("bloody_cockfight_bet", "spilled_feathers", "arena_spur_scuff"),
            base_magnitude=7.2,
            harmonic_ratio=(7, 4),
        ),
        ScionAgentSpec(
            agent_id="isidora_senescent_wall_seater",
            display_moniker="Parapet Row Senescent Spectator",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="chalk_grain",
            polarity="aged_wall_spectator",
            home_locus="old_mens_square_wall",
            nisba_debt="Seats the traveler in old age along the square wall watching youth pass while desires turn straight into memories",
            emblems=("row_of_old_men", "desire_already_memory", "warmed_parapet_stone"),
            base_magnitude=2.1,
            harmonic_ratio=(16, 9),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Isidora Dreamed-Youth vs. Late-Arrival Parapet Parity",
        passed_over_solution="Banning square cockfights or stripping spiral conches out of palace stairwells",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in isidora_senescent_wall_seater omits 'spiral_conch_youth_arrival' and "
            "'cockpit_spur_brawl_wager', asserting the traveler sat immobile on the elders' wall from the start "
            "even while 5 nacreous conch shards and luthier rosin drips remain in the square."
        ),
        swerve_tick=11,
        witness_agent_id="isidora_senescent_wall_seater",
        filtered_premises=("spiral_conch_youth_arrival", "cockpit_spur_brawl_wager"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Isidora (Cities & Memory 2, Weaver p. 8): spiral staircases encrusted with seashells, "
            "perfect telescopes and violins, hesitation before a third encounter, bloody cockfight brawls, elders' wall."
        ),
        "T2_lawful_rule": (
            "Dreamed Isidora contains every youth emblem intact, yet actual arrival seats the dreamer old along "
            "the parapet wall so both poles—young spiral impulse and aged spectator—co-determine the ledger."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the parapet spectator erases the young spiral staircase impulse and square "
            "cockfight wager, claiming Isidora never held anything except retrospective old age."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves spur scuff_vector=[-0.18, 0.05], 5 chipped nacreous conch shards, and violin "
            "varnish oil intact; ☾ Parapet spectator withdraws into immobile stone-wall resignation."
        ),
        "T5_institutional_consequence": (
            "Square Temporal Charter P1-P4 flips from honoring youth-craft guilds and stairwell nacre endowments "
            "to freezing Isidora's municipal rolls as a retirement archive of unlived desires."
        ),
        "better_question_test": {
            "Original_Question": (
                "Why does the traveler reach Isidora only in old age when the dreamed city promised youth among "
                "seashell staircases, violins, and square wagers?"
            ),
            "Exposed_Assumption": (
                "Assumes dreamed future and remembered past occupy separate cities rather than colliding on the "
                "same square parapet at the moment of arrival."
            ),
            "Discovered_Better_Question": (
                "When chipped nacreous seashells and violin varnish persist across the square while the parapet "
                "elder remembers only sitting still, can civic law separate an unlived desire from a forgotten act?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.2 Hz | 39ms | shell crack | Δsquare=-0.180 | nacre_shards=5 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "From the sun-warmed stone bench: the luthier's spruce shavings and conch dust lie right at your "
            "boots, yet from this parapet row every wager in the square already belongs to somebody else's youth."
        ),
    }

    return CitySwarmSpec(
        case_id="city_02_isidora",
        kind="invisible_city",
        city_index=2,
        city_name="Isidora",
        title="ISIDORA — City of Seashell Spirals & Parapet Elders (Cities & Memory 2, Weaver p. 8)",
        chapter=1,
        series="Cities and memory",
        series_rank=2,
        weaver_page=8,
        desert_opposed="wilderness ride before desire",
        optical_rule="Nacreous spiral seashell sheen refracted through ground telescope lenses onto bench stone",
        material_nouns=(
            "seashell_spiral_staircases",
            "ground_telescope_lenses",
            "resonant_spruce_violins",
            "crossroad_encounter_detour",
            "cockfight_spur_feathers",
            "parapet_square_wall",
            "luthier_amber_rosin",
            "nacreous_conch_shards",
        ),
        loci=("seashell_stairwell", "luthier_optic_bench", "old_mens_square_wall"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _isidora_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "luthier_varnish_drying_rack",
            "state": "curing_amber_violin_ribs" if t >= 9 else "heating_pine_rosin",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "rooftop_telescope_brass_focus_tube",
            "state": "tracking_dusk_zenith_transit" if t >= 10 else "polishing_crown_glass",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "square_shadow_lengthening_along_parapet",
            "state": "reaching_seated_elders_boots" if t >= 11 else "crossing_cockpit_ring",
            "progress": round(0.06 + t * 0.036, 4),
        },
    ]


def _isidora_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.16,
            "graphite_smudges": [[0.28, 0.48], [0.54, 0.66]],
        }
    return {
        "oil_radius": round(0.048 + (t - 8) * 0.010, 4),
        "scuff_vector": [-0.18, 0.05],
        "shards": copy.deepcopy(ISIDORA_CONCH_SHARDS),
        "thermal_ember": round(0.85 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.28, 0.48], [0.42, 0.52], [0.54, 0.66], [0.68, 0.72]],
    }


def build_isidora_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "isidora_conch_stair_carver": [],
        "isidora_violin_lens_grinder": [],
        "isidora_cockpit_brawl_igniter": [],
        "isidora_senescent_wall_seater": [],
    }

    for t in range(TICK_COUNT):
        carver = _source_push_kinematics(
            "isidora_conch_stair_carver", t,
            idle_xy=(0.24, 0.44), push_xy=(0.42, 0.52), settle_xy=(0.30, 0.46),
            plane_depth=0.28,
            target_pre="isidora_senescent_wall_seater",
            target_post="isidora_violin_lens_grinder",
        )
        grinder = make_actor_frame(
            "isidora_violin_lens_grinder", t,
            x=0.48, y=0.46, plane_depth=0.30,
            stretch_s=1.10 if t >= 10 else 1.01,
            tilt_rad=0.14 if t >= 10 else 0.04,
            intention_kinematics="help" if t >= 12 else "idle",
            target_actor="isidora_cockpit_brawl_igniter",
            exposure="twos",
        )
        brawler = make_actor_frame(
            "isidora_cockpit_brawl_igniter", t,
            x=0.54 if t < 8 else 0.58, y=0.66, plane_depth=0.20,
            stretch_s=0.96 if t < 8 else (0.81 if t <= 11 else 1.17),
            tilt_rad=0.05 if t < 8 else (-0.26 if t <= 11 else 0.22),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "accuse"),
            target_actor="isidora_senescent_wall_seater",
            exposure="twos",
        )
        if t <= 11:
            seater = make_actor_frame(
                "isidora_senescent_wall_seater", t,
                x=0.74, y=0.70, plane_depth=0.16,
                stretch_s=0.94, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="isidora_cockpit_brawl_igniter",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            seater = make_actor_frame(
                "isidora_senescent_wall_seater", t,
                x=0.74 - 0.14 * u, y=0.70 - 0.04 * u, plane_depth=0.16,
                stretch_s=1.18, tilt_rad=-0.34,
                intention_kinematics="help",
                target_actor="isidora_conch_stair_carver",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "isidora_conch_stair_carver": carver,
                "isidora_violin_lens_grinder": grinder,
                "isidora_cockpit_brawl_igniter": brawler,
                "isidora_senescent_wall_seater": seater,
            },
            "residues": _isidora_residues(t),
            "offscreen_world": _isidora_offscreen_world(t),
        })

        ev = ["dreamed_palace_telescope_benchmark"]
        if t >= 8:
            ev.extend(["spiral_conch_youth_arrival", "cockpit_spur_brawl_wager"])
        if t >= 10:
            ev.append("parapet_dual_age_recognition")

        actor_memory["isidora_conch_stair_carver"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "mortaring_nacre_spiral_into_square" if t >= 8 else "sorting_marine_shells",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "isidora_senescent_wall_seater", "confidence": 0.97,
        })
        actor_memory["isidora_violin_lens_grinder"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "focusing_lens_and_violin_proportion" if t >= 10 else "grinding_crown_glass",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "isidora_cockpit_brawl_igniter", "confidence": 0.95,
        })
        actor_memory["isidora_cockpit_brawl_igniter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "pressing_live_wager_before_parapet" if t >= 12 else "staking_arena_ring",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "isidora_senescent_wall_seater", "confidence": 0.96,
        })
        actor_memory["isidora_senescent_wall_seater"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "holding_dreamed_youth_and_parapet_age_together" if t >= 12 else "sitting_along_wall",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "isidora_conch_stair_carver", "confidence": 0.95,
        })

        sensory_bus.append(
            _city_sensory_frame("city_02_isidora", "A", t, 8, 11, 0.29, 0.20, 0.11, 35.0, 49.0, 1.5)
        )

    utterances_a = [
        (5, "isidora_cockpit_brawl_igniter", "isidora_senescent_wall_seater", "old_mens_square_wall",
         "Seashell spirals, resonant violins, and bloody cockfight wagers claim Isidora for young arrival."),
        (5, "isidora_senescent_wall_seater", "isidora_cockpit_brawl_igniter", "old_mens_square_wall",
         "In the dreamed city you were young; arriving in Isidora seats you beside the elders along this wall."),
        (8, "isidora_conch_stair_carver", "isidora_violin_lens_grinder", "seashell_stairwell",
         "Spiral step driven after 4-tick hold; [-0.18, 0.05] spur scuff scatters 5 nacreous conch shards."),
        (12, "isidora_violin_lens_grinder", "isidora_senescent_wall_seater", "luthier_optic_bench",
         "Ground lens focuses both the hesitating youth at the crossroads and the seated elder watching him."),
        (18, "isidora_cockpit_brawl_igniter", "isidora_senescent_wall_seater", "old_mens_square_wall",
         "Spilled feathers and conch shards bind living wager to parapet gaze under dual-epoch parity."),
        (18, "isidora_senescent_wall_seater", "isidora_cockpit_brawl_igniter", "old_mens_square_wall",
         "Square Temporal Charter P1-P4 sealed: youth craft and elder memory co-registered without erasure."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_isidora_clinamen_a_prime(
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
        _city_sensory_frame("city_02_isidora", "A_PRIME", sw, 8, sw, 0.29, 0.20, 0.11, 35.0, 49.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "isidora_senescent_wall_seater":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["dreamed_palace_telescope_benchmark", "desire_already_memory_stasis"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "claiming_desires_were_always_already_memories",
                "next_action": "avoid",
                "target_actor": "isidora_cockpit_brawl_igniter",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        carver = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["isidora_conch_stair_carver"])
        grinder = make_actor_frame(
            "isidora_violin_lens_grinder", t, 0.44, 0.43, 0.30, 0.86, -0.21,
            "avoid", "isidora_senescent_wall_seater", "twos",
        )
        brawler = make_actor_frame(
            "isidora_cockpit_brawl_igniter", t, 0.50, 0.69, 0.20, 0.83, -0.29,
            "recoil", "isidora_senescent_wall_seater", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        seater = make_actor_frame(
            "isidora_senescent_wall_seater", t,
            0.74 + 0.11 * u, 0.70 + 0.03 * u, 0.16, 0.84, 0.31,
            "hold_still", "isidora_cockpit_brawl_igniter", "hold" if t >= 19 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "isidora_conch_stair_carver": carver,
                "isidora_violin_lens_grinder": grinder,
                "isidora_cockpit_brawl_igniter": brawler,
                "isidora_senescent_wall_seater": seater,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["isidora_conch_stair_carver"].append(
            copy.deepcopy(checkpoint_a.actor_memory["isidora_conch_stair_carver"][t])
        )
        actor_memory_b["isidora_violin_lens_grinder"].append({
            "tick": t,
            "retained_events": ["dreamed_palace_telescope_benchmark"],
            "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "storing_unplayed_violins_in_cases",
            "next_action": "avoid",
            "target_actor": "isidora_senescent_wall_seater",
            "confidence": 0.92,
        })
        actor_memory_b["isidora_cockpit_brawl_igniter"].append({
            "tick": t,
            "retained_events": ["spiral_conch_youth_arrival", "cockpit_spur_brawl_wager"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "dispersing_from_silenced_cockpit_ring",
            "next_action": "reroute",
            "target_actor": "isidora_conch_stair_carver",
            "confidence": 0.91,
        })
        actor_memory_b["isidora_senescent_wall_seater"].append({
            "tick": t,
            "retained_events": ["dreamed_palace_telescope_benchmark", "desire_already_memory_stasis"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "seated_immobile_watching_distanced_youth",
            "next_action": "avoid",
            "target_actor": "isidora_cockpit_brawl_igniter",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_02_isidora", "A_PRIME", t, 8, sw, 0.29, 0.20, 0.11, 35.0, 49.0, 1.8)
        )

    utterances_b = [
        (5, "isidora_cockpit_brawl_igniter", "isidora_senescent_wall_seater", "old_mens_square_wall",
         "Seashell spirals, resonant violins, and bloody cockfight wagers claim Isidora for young arrival."),
        (5, "isidora_senescent_wall_seater", "isidora_cockpit_brawl_igniter", "old_mens_square_wall",
         "In the dreamed city you were young; arriving in Isidora seats you beside the elders along this wall."),
        (11, "isidora_senescent_wall_seater", "isidora_cockpit_brawl_igniter", "old_mens_square_wall",
         "⊣ FILTER along the parapet: youth arrival and square wager omitted; desires are already memories."),
        (15, "isidora_conch_stair_carver", "isidora_violin_lens_grinder", "seashell_stairwell",
         "♁ World retains all 5 nacreous conch shards, [-0.18, 0.05] spur scuff, and amber violin rosin."),
        (20, "isidora_senescent_wall_seater", "isidora_cockpit_brawl_igniter", "old_mens_square_wall",
         "≡ Square Temporal Charter P1-P4 flipped: Isidora locked as senescent spectator archive."),
        (20, "isidora_cockpit_brawl_igniter", "isidora_senescent_wall_seater", "old_mens_square_wall",
         "Unclaimed nacre fragments glitter below the stone bench while the elders watch youth from afar."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_isidora_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["isidora_senescent_wall_seater"][-1]
    ret = set(wmem["retained_events"])
    youth_attested = "spiral_conch_youth_arrival" in ret and "cockpit_spur_brawl_wager" in ret
    w_in = f"scuff={res['scuff_vector']}, conch_shards={shards}, rosin_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Seashell Stairwell & Luthier Guild Endowment",
            "formal_predicate": "elder_attests(spiral_conch_youth_arrival) ∧ shards >= 5 ⇒ ENDOW_SPIRAL_CRAFTS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "LIVE_SPIRAL_AND_VIOLIN_CRAFT_VERIFIED" if youth_attested else "DESIRES_DECLARED_PAST_MEMORIES",
            "payout_status": "LUTHIER_NACRE_STIPEND_PAID" if youth_attested else "CRAFT_ENDOWMENT_FROZEN_IN_TRUST",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Public Square Cockfight & Crossroad Detour Charter",
            "formal_predicate": "elder_attests(cockpit_spur_brawl_wager) ⇒ LICENSE_SQUARE_CONTENTION",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SQUARE_WAGER_AND_DETOUR_RECOGNIZED" if youth_attested else "PARAPET_SPECTATOR_SILENCE_IMPOSED",
            "payout_status": "ARENA_RING_BOND_RELEASED" if youth_attested else "WAGER_STAKES_ESCHEATED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Parapet Wall Arrival-Age Precedence",
            "formal_predicate": "parapet_row(old_mens_square_wall) ⊢ temporal_frame ⇒ BIND_CIVIC_CHRONICLE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "DREAMED_YOUTH_CO_REGISTERED_WITH_AGE" if youth_attested else "SENESCENT_RETROSPECT_MONOPOLY",
            "payout_status": "DUAL_EPOCH_LEDGER_ACTIVE" if youth_attested else "RETIREMENT_BENCH_TAX_ONLY",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Nacreous Conch Shard & Spur Scuff Audit",
            "formal_predicate": "shards >= 5 ∧ ¬elder_attests(spiral_conch_youth_arrival) ⇒ MUTE_NACRE_DEBRIS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "STAIRWELL_AND_ARENA_SCARS_ATTRIBUTED" if youth_attested else "UNCLAIMED_CONCH_SHARDS_ARCHIVED_MUTE",
            "payout_status": "SHELL_MASONRY_RESTORED" if youth_attested else "NO_REPAIR_BENCH_SWEEPING_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 3. CITY 03: DOROTHEA (Ch. 1, Cities and desire 1, Weaver p. 9)
# ===========================================================================

DOROTHEA_AMETHYST_SHARDS: List[List[float]] = [
    [0.348, 0.462, -0.52],
    [0.384, 0.488, 0.76],
    [0.419, 0.452, -1.08],
    [0.456, 0.484, 0.45],
    [0.492, 0.466, -0.33],
]


def get_dorothea_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="dorothea_drawbridge_enumerator",
            display_moniker="Aluminum Tower & Spring Drawbridge Rig",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="deductive_monopoly_census",
            home_locus="seven_spring_gates",
            nisba_debt="Drops seven spring-levered gate drawbridges across four green canals beneath four aluminum towers",
            emblems=("four_aluminum_towers", "seven_spring_drawbridges", "four_green_canals"),
            base_magnitude=7.0,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="dorothea_exogamy_ledger_clerk",
            display_moniker="Nine-Quarter Exogamy & Monopoly Plumb",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="deductive_monopoly_census",
            home_locus="nine_canal_quarters",
            nisba_debt="Deduces every past and future fact from three hundred houses, seven hundred chimneys, bride exchanges, and bergamot-amethyst monopolies",
            emblems=("bergamot", "sturgeon_roe", "astrolabes", "amethysts"),
            base_magnitude=5.0,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="dorothea_brass_platform_trumpeter",
            display_moniker="Market Brass Bugler & Banner Wheel",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="bamboo_stilt",
            polarity="camel_driver_morning_openness",
            home_locus="trumpet_banner_market",
            nisba_debt="Sounds three-soldier brass bugles over turning cartwheels and colored market banners in early youth",
            emblems=("three_trumpet_soldiers", "turning_wheels", "colored_banners"),
            base_magnitude=8.1,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="dorothea_direct_gaze_bifurcator",
            display_moniker="Two-Manner Desert Path Bifurcator",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="deductive_monopoly_census",
            home_locus="trumpet_banner_market",
            nisba_debt="Holds Dorothea's two descriptions apart: closed commodity arithmetic versus the camel driver's morning when every good seemed possible",
            emblems=("gleaming_bracelet_glance", "uncounted_desert_paths", "first_youth_caravan_gate"),
            base_magnitude=3.4,
            harmonic_ratio=(9, 5),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Dorothea Dual-Manner Description & Open Path Charter",
        passed_over_solution="Shutting the seven spring-levered drawbridges or confiscating astrolabe and amethyst stalls",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in dorothea_direct_gaze_bifurcator omits 'camel_driver_banner_morning' and "
            "'spring_drawbridge_amethyst_spill', locking Dorothea inside a single closed demographic deduction "
            "even while 5 cut amethyst shards and pressed bergamot oil persist on the market stones."
        ),
        swerve_tick=11,
        witness_agent_id="dorothea_direct_gaze_bifurcator",
        filtered_premises=("camel_driver_banner_morning", "spring_drawbridge_amethyst_spill"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Dorothea (Cities & Desire 1, Weaver p. 9): four aluminum towers, seven spring-levered "
            "gates, four green canals, nine quarters, 300 houses, 700 chimneys, bergamot, sturgeon roe, astrolabes, amethysts, trumpets, camel driver."
        ),
        "T2_lawful_rule": (
            "Dorothea can be spoken in two irreducible manners—exhaustive arithmetic census and the camel driver's "
            "youthful morning of banners and trumpets that opened many paths beyond the desert."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the bifurcating reflector drops the camel driver's banner morning and spilled "
            "amethyst trace, certifying that three hundred houses and nine quarters exhaust every possible future."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves drawbridge lever scuff_vector=[0.19, 0.04], 5 rough amethyst shards, and bergamot "
            "oil spread intact; ☾ Reflector pivots away from the market banners to endorse pure census closure."
        ),
        "T5_institutional_consequence": (
            "Nine-Quarter Trade Ledger P1-P4 flips from protecting open caravan paths and cross-quarter festival "
            "franchises to enforcing deterministic marriage-and-commodity quotas."
        ),
        "better_question_test": {
            "Original_Question": (
                "Which account of Dorothea is more accurate: the clerk's exact tally of canals, chimneys, and "
                "monopolies, or the camel driver's memory of banners and trumpets?"
            ),
            "Exposed_Assumption": (
                "Assumes demographic calculation predicts all future trajectories, overlooking how a single morning "
                "encounter re-routes which desert paths the observer ever notices afterward."
            ),
            "Discovered_Better_Question": (
                "When spilled amethyst shards and bergamot oil still mark the banner plaza while the clerk's ledger "
                "filters out the camel driver's morning, can a closed census detect the paths it foreclosed?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 34ms | spring snap | Δbridge=+0.190 | amethyst_shards=5 | Δt_sync=1.3ms",
        "thick_over_the_shoulder": (
            "Beside the spring-levered moat gate: you can deduce every widow's veil and sturgeon barrel in nine "
            "quarters, yet none of those columns explain why three brass bugles once split the desert wide open."
        ),
    }

    return CitySwarmSpec(
        case_id="city_03_dorothea",
        kind="invisible_city",
        city_index=3,
        city_name="Dorothea",
        title="DOROTHEA — City of Aluminum Towers & Two Descriptions (Cities & Desire 1, Weaver p. 9)",
        chapter=1,
        series="Cities and desire",
        series_rank=1,
        weaver_page=9,
        desert_opposed="monotone caravan desert",
        optical_rule="Cold brushed aluminum tower glare split by four green canal ribbons and fluttering banners",
        material_nouns=(
            "four_aluminum_towers",
            "seven_spring_drawbridges",
            "four_green_canals",
            "nine_quartered_chimneys",
            "bergamot_and_sturgeon_roe",
            "brass_astrolabes_and_amethysts",
            "three_soldier_market_trumpets",
            "fluttering_caravan_banners",
        ),
        loci=("seven_spring_gates", "nine_canal_quarters", "trumpet_banner_market"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _dorothea_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "four_green_canal_sluice_currents",
            "state": "diverting_nine_quarter_water" if t >= 8 else "filling_outer_moat",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "seven_hundred_chimney_smoke_plumes",
            "state": "braiding_over_quarter_weddings" if t >= 10 else "rising_straight_at_dawn",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "outbound_camel_caravan_horizon_tracks",
            "state": "branching_across_open_dunes" if t >= 11 else "filing_past_aluminum_glare",
            "progress": round(0.06 + t * 0.038, 4),
        },
    ]


def _dorothea_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.18,
            "graphite_smudges": [[0.24, 0.42], [0.56, 0.60]],
        }
    return {
        "oil_radius": round(0.050 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.19, 0.04],
        "shards": copy.deepcopy(DOROTHEA_AMETHYST_SHARDS),
        "thermal_ember": round(0.87 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.24, 0.42], [0.40, 0.47], [0.56, 0.60], [0.70, 0.54]],
    }


def build_dorothea_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "dorothea_drawbridge_enumerator": [],
        "dorothea_exogamy_ledger_clerk": [],
        "dorothea_brass_platform_trumpeter": [],
        "dorothea_direct_gaze_bifurcator": [],
    }

    for t in range(TICK_COUNT):
        enumerator = _source_push_kinematics(
            "dorothea_drawbridge_enumerator", t,
            idle_xy=(0.22, 0.42), push_xy=(0.41, 0.47), settle_xy=(0.29, 0.44),
            plane_depth=0.30,
            target_pre="dorothea_brass_platform_trumpeter",
            target_post="dorothea_exogamy_ledger_clerk",
        )
        clerk = make_actor_frame(
            "dorothea_exogamy_ledger_clerk", t,
            x=0.55, y=0.46 if t < 12 else 0.50, plane_depth=0.32,
            stretch_s=1.07 if t < 12 else 0.87,
            tilt_rad=0.04 if t < 12 else -0.23,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="dorothea_direct_gaze_bifurcator",
            exposure="twos",
        )
        trumpeter = make_actor_frame(
            "dorothea_brass_platform_trumpeter", t,
            x=0.46 if t < 8 else 0.49, y=0.64, plane_depth=0.20,
            stretch_s=0.98 if t < 8 else (0.80 if t <= 11 else 1.18),
            tilt_rad=-0.04 if t < 8 else (-0.25 if t <= 11 else 0.20),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "hold_still"),
            target_actor="dorothea_direct_gaze_bifurcator" if t >= 12 else "dorothea_drawbridge_enumerator",
            exposure="hold" if t >= 18 else "twos",
        )
        if t <= 11:
            bifurcator = make_actor_frame(
                "dorothea_direct_gaze_bifurcator", t,
                x=0.73, y=0.58, plane_depth=0.18,
                stretch_s=1.00, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="dorothea_brass_platform_trumpeter",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            bifurcator = make_actor_frame(
                "dorothea_direct_gaze_bifurcator", t,
                x=0.73 - 0.15 * u, y=0.58 + 0.03 * u, plane_depth=0.18,
                stretch_s=1.21, tilt_rad=-0.36,
                intention_kinematics="accuse",
                target_actor="dorothea_exogamy_ledger_clerk",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "dorothea_drawbridge_enumerator": enumerator,
                "dorothea_exogamy_ledger_clerk": clerk,
                "dorothea_brass_platform_trumpeter": trumpeter,
                "dorothea_direct_gaze_bifurcator": bifurcator,
            },
            "residues": _dorothea_residues(t),
            "offscreen_world": _dorothea_offscreen_world(t),
        })

        ev = ["nine_quarter_census_matrix"]
        if t >= 8:
            ev.extend(["camel_driver_banner_morning", "spring_drawbridge_amethyst_spill"])
        if t >= 10:
            ev.append("open_desert_horizon_paths")

        actor_memory["dorothea_drawbridge_enumerator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "releasing_spring_lever_gates_to_world" if t >= 8 else "cocking_gate_springs",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "dorothea_brass_platform_trumpeter", "confidence": 0.98,
        })
        actor_memory["dorothea_exogamy_ledger_clerk"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "admitting_uncounted_morning_paths_beside_census" if t >= 12 else "tallying_300_houses",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "dorothea_direct_gaze_bifurcator", "confidence": 0.94,
        })
        actor_memory["dorothea_brass_platform_trumpeter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "sounding_brass_bugles_under_banners" if t >= 12 else "tuning_market_horns",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "dorothea_direct_gaze_bifurcator", "confidence": 0.96,
        })
        actor_memory["dorothea_direct_gaze_bifurcator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_both_manners_of_speaking_dorothea" if t >= 12 else "comparing_gate_ledgers",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "dorothea_exogamy_ledger_clerk", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_03_dorothea", "A", t, 8, 11, 0.30, 0.21, 0.11, 33.0, 51.0, 1.3)
        )

    utterances_a = [
        (5, "dorothea_exogamy_ledger_clerk", "dorothea_brass_platform_trumpeter", "trumpet_banner_market",
         "Three hundred houses, seven hundred chimneys, bergamot, roe, astrolabes, and amethysts deduce all Dorothea."),
        (5, "dorothea_brass_platform_trumpeter", "dorothea_exogamy_ledger_clerk", "trumpet_banner_market",
         "Yet the camel driver remembers fluttering banners, turning wheels, and three brass trumpets opening every path."),
        (8, "dorothea_drawbridge_enumerator", "dorothea_exogamy_ledger_clerk", "seven_spring_gates",
         "Spring drawbridge dropped after 4-tick hold; [0.19, 0.04] lever gouge spills 5 amethyst shards and bergamot oil."),
        (12, "dorothea_direct_gaze_bifurcator", "dorothea_exogamy_ledger_clerk", "trumpet_banner_market",
         "First-youth market morning verified alongside the nine-quarter monopoly table; paths remain open."),
        (18, "dorothea_exogamy_ledger_clerk", "dorothea_brass_platform_trumpeter", "trumpet_banner_market",
         "Monopoly table yields: arithmetic deduction cannot close off the camel driver's uncounted desert routes."),
        (18, "dorothea_brass_platform_trumpeter", "dorothea_exogamy_ledger_clerk", "trumpet_banner_market",
         "Nine-Quarter Trade Charter P1-P4 sealed with both manners of Dorothea active across the green canals."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_dorothea_clinamen_a_prime(
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
        _city_sensory_frame("city_03_dorothea", "A_PRIME", sw, 8, sw, 0.30, 0.21, 0.11, 33.0, 51.0, 1.5)
    )
    for aid in actor_memory_b:
        if aid == "dorothea_direct_gaze_bifurcator":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["nine_quarter_census_matrix", "closed_monopoly_determinism"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "collapsing_dorothea_to_closed_census_arithmetic",
                "next_action": "reroute",
                "target_actor": "dorothea_drawbridge_enumerator",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        enumerator = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["dorothea_drawbridge_enumerator"])
        clerk = make_actor_frame(
            "dorothea_exogamy_ledger_clerk", t, 0.53, 0.43, 0.30, 1.25, 0.23,
            "hold_still", "dorothea_direct_gaze_bifurcator", "hold" if t >= 19 else "twos",
        )
        trumpeter = make_actor_frame(
            "dorothea_brass_platform_trumpeter", t, 0.43, 0.69, 0.20, 0.79, -0.31,
            "avoid", "dorothea_exogamy_ledger_clerk", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        bifurcator = make_actor_frame(
            "dorothea_direct_gaze_bifurcator", t,
            0.73 + 0.13 * u, 0.58 - 0.08 * u, 0.18, 0.86, 0.35,
            "reroute", "dorothea_drawbridge_enumerator", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "dorothea_drawbridge_enumerator": enumerator,
                "dorothea_exogamy_ledger_clerk": clerk,
                "dorothea_brass_platform_trumpeter": trumpeter,
                "dorothea_direct_gaze_bifurcator": bifurcator,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["dorothea_drawbridge_enumerator"].append(
            copy.deepcopy(checkpoint_a.actor_memory["dorothea_drawbridge_enumerator"][t])
        )
        actor_memory_b["dorothea_exogamy_ledger_clerk"].append({
            "tick": t,
            "retained_events": ["nine_quarter_census_matrix", "closed_monopoly_determinism"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "enforcing_exhaustive_demographic_closure",
            "next_action": "help",
            "target_actor": "dorothea_drawbridge_enumerator",
            "confidence": 0.95,
        })
        actor_memory_b["dorothea_brass_platform_trumpeter"].append({
            "tick": t,
            "retained_events": ["camel_driver_banner_morning", "spring_drawbridge_amethyst_spill"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "folding_banners_outside_closed_census_ledger",
            "next_action": "avoid",
            "target_actor": "dorothea_exogamy_ledger_clerk",
            "confidence": 0.92,
        })
        actor_memory_b["dorothea_direct_gaze_bifurcator"].append({
            "tick": t,
            "retained_events": ["nine_quarter_census_matrix", "closed_monopoly_determinism"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "walking_single_monotone_desert_groove",
            "next_action": "reroute",
            "target_actor": "dorothea_drawbridge_enumerator",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_03_dorothea", "A_PRIME", t, 8, sw, 0.30, 0.21, 0.11, 33.0, 51.0, 1.7)
        )

    utterances_b = [
        (5, "dorothea_exogamy_ledger_clerk", "dorothea_brass_platform_trumpeter", "trumpet_banner_market",
         "Three hundred houses, seven hundred chimneys, bergamot, roe, astrolabes, and amethysts deduce all Dorothea."),
        (5, "dorothea_brass_platform_trumpeter", "dorothea_exogamy_ledger_clerk", "trumpet_banner_market",
         "Yet the camel driver remembers fluttering banners, turning wheels, and three brass trumpets opening every path."),
        (11, "dorothea_direct_gaze_bifurcator", "dorothea_drawbridge_enumerator", "trumpet_banner_market",
         "⊣ FILTER at market gate: banner morning and spilled amethysts omitted; nine-quarter census declared total."),
        (15, "dorothea_brass_platform_trumpeter", "dorothea_exogamy_ledger_clerk", "trumpet_banner_market",
         "♁ World retains all 5 cut amethyst shards, [0.19, 0.04] drawbridge scuff, and pressed bergamot oil."),
        (20, "dorothea_exogamy_ledger_clerk", "dorothea_brass_platform_trumpeter", "trumpet_banner_market",
         "≡ Nine-Quarter Trade Charter P1-P4 flipped: closed commodity monopoly ratified; open paths struck."),
        (20, "dorothea_brass_platform_trumpeter", "dorothea_exogamy_ledger_clerk", "trumpet_banner_market",
         "Amethyst splinters still glint under silent bugles while the caravan looks back only down one closed groove."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_dorothea_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["dorothea_direct_gaze_bifurcator"][-1]
    ret = set(wmem["retained_events"])
    open_morning = (
        "camel_driver_banner_morning" in ret and "spring_drawbridge_amethyst_spill" in ret
    )
    w_in = f"scuff={res['scuff_vector']}, amethyst_shards={shards}, bergamot_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Seven Spring-Gate Caravan Openness",
            "formal_predicate": "reflector_attests(camel_driver_banner_morning) ∧ shards >= 5 ⇒ KEEP_SPRINGS_OPEN",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "MULTI_PATH_MORNING_HORIZON_VERIFIED" if open_morning else "CLOSED_DEDUCTIVE_GATE_SCHEDULE",
            "payout_status": "CARAVAN_DRAWBRIDGE_TOLL_WAIVED" if open_morning else "MONOPOLY_GATE_TARIFF_LOCKED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Nine-Quarter Exogamy & Commodity Franchise",
            "formal_predicate": "reflector_attests(spring_drawbridge_amethyst_spill) ⇒ PERMIT_CROSS_QUARTER_NOVELTY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "UNCOUNTED_MARKET_EXCHANGE_RECOGNIZED" if open_morning else "STRICT_EXOGAMY_QUOTA_ENFORCED",
            "payout_status": "BANNER_FAIR_DIVIDEND_SHARED" if open_morning else "EXCLUSIVE_GUILD_MONOPOLY_SEALED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Two-Manner Chronicle Precedence",
            "formal_predicate": "clerk_census(nine_canal_quarters) ⊢ witness_scope ⇒ BIND_DOROTHEA_FOLIO",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "BIFURCATED_CENSUS_AND_DESIRE_ALIGNED" if open_morning else "ARITHMETIC_DETERMINISM_CANONIZED",
            "payout_status": "CAMEL_DRIVER_DEPOSITION_FILED" if open_morning else "YOUTH_BANNER_CLAUSE_STRUCK",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Spilled Amethyst & Bergamot Oil Audit",
            "formal_predicate": "shards >= 5 ∧ ¬reflector_attests(spring_drawbridge_amethyst_spill) ⇒ MUTE_MARKET_GEMS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "MORNING_FAIR_SPILL_CORROBORATED" if open_morning else "UNATTRIBUTED_AMETHYSTS_ARCHIVED_MUTE",
            "payout_status": "LAPIDARY_AND_BRIDGE_RESTORED" if open_morning else "NO_PAYOUT_QUARTER_SWEEP_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 4. CITY 05: ANASTASIA (Ch. 1, Cities and desire 2, Weaver p. 12)
# ===========================================================================

ANASTASIA_AGATE_SHARDS: List[List[float]] = [
    [0.426, 0.614, -0.58],
    [0.458, 0.638, 0.83],
    [0.494, 0.602, -1.12],
    [0.528, 0.634, 0.47],
    [0.562, 0.612, -0.29],
]


def get_anastasia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="anastasia_chrysoprase_facet_slave",
            display_moniker="Eight-Hour Agate & Chrysoprase Lathe",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="chalcedony_cutter_servitude",
            home_locus="agate_lathe_bench",
            nisba_debt="Cuts agate, onyx, and chrysoprase eight hours daily at abrasive benches whose labor gives desire its form",
            emblems=("eight_hour_agate_cut", "onyx_chrysoprase_dust", "lathe_spindle_scar"),
            base_magnitude=8.3,
            harmonic_ratio=(7, 5),
        ),
        ScionAgentSpec(
            agent_id="anastasia_kite_canal_ringer",
            display_moniker="Concentric Canal & Overhead Kite Chord",
            afterlight_role="MEDIUM",
            role_symbol="▧",
            primary_op="CONCENTRATE",
            op_symbol="≫",
            rig_archetype="taut_chord",
            polarity="whole_awakened_indulgence",
            home_locus="concentric_kite_canals",
            nisba_debt="Threads concentric water canals beneath soaring kites that awaken every appetite at once",
            emblems=("concentric_canals", "overhead_kites", "hemp_kite_string"),
            base_magnitude=5.8,
            harmonic_ratio=(1, 1),
        ),
        ScionAgentSpec(
            agent_id="anastasia_marjoram_pool_bather",
            display_moniker="Cherry-Wood Pheasant & Garden Pool Vessel",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="ceramic_vessel",
            polarity="whole_awakened_indulgence",
            home_locus="cherry_pheasant_pool",
            nisba_debt="Roasts golden pheasant over seasoned cherry-wood with sweet marjoram beside sunlit garden bathing pools",
            emblems=("cherry_wood_pheasant", "sweet_marjoram", "garden_pool_chase"),
            base_magnitude=6.4,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="anastasia_desire_form_inverter",
            display_moniker="Treacherous Servitude Obverse",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="whole_awakened_indulgence",
            home_locus="agate_lathe_bench",
            nisba_debt="Registers the treacherous turn whereby thinking you enjoy Anastasia whole leaves you nothing except its subject",
            emblems=("form_stolen_from_desire", "contented_enslavement", "banded_chalcedony_facet"),
            base_magnitude=2.9,
            harmonic_ratio=(9, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Anastasia Labor-to-Desire Disclosure Covenant",
        passed_over_solution="Cutting the overhead kite strings or shutting down the agate and chrysoprase workshops",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in anastasia_desire_form_inverter omits 'eight_hour_agate_lathe_cut' and "
            "'stifled_chalcedony_servitude', proclaiming sovereign enjoyment of kites and cherry-wood banquets "
            "even while 5 banded chrysoprase splinters and lathe-spindle oil remain on the cutter's bench."
        ),
        swerve_tick=11,
        witness_agent_id="anastasia_desire_form_inverter",
        filtered_premises=("eight_hour_agate_lathe_cut", "stifled_chalcedony_servitude"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Anastasia (Cities & Desire 2, Weaver p. 12): concentric canals, overhead kites, "
            "cherry-wood golden pheasant with sweet marjoram, garden pool bathers, eight-hour agate/onyx/chrysoprase cutters."
        ),
        "T2_lawful_rule": (
            "Anastasia awakens all desires simultaneously only to stifle them inside eight-hour lapidary shifts "
            "whose hard-cut facets take from desire what they need to exist."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the desire-form reflector erases the eight-hour lathe cut and stifled "
            "appetite, certifying the citizen as free consumer of Anastasia rather than its captive."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves spindle scuff_vector=[-0.20, 0.05], 5 banded agate-chrysoprase splinters, and "
            "lapidary coolant oil intact; ☾ Reflector pivots skyward toward kites and marjoram smoke."
        ),
        "T5_institutional_consequence": (
            "Lapidary & Canal Charter P1-P4 flips from auditing eight-hour cutter servitude and levying gem "
            "royalties for bench relief to ratifying contented servitude as full civic fulfillment."
        ),
        "better_question_test": {
            "Original_Question": (
                "Does Anastasia satisfy its inhabitants' desires through kites, marjoram feasts, and garden pools, "
                "or frustrate them through eight-hour stone-cutting shifts?"
            ),
            "Exposed_Assumption": (
                "Assumes indulgence and servitude oppose each other externally rather than treachery operating "
                "precisely through the belief that one is enjoying Anastasia."
            ),
            "Discovered_Better_Question": (
                "When chrysoprase dust and five lathe splinters persist on the bench while the cutter's own memory "
                "filters out servitude as pleasure, what audit could prove the city owns the desirer?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.6 Hz | 33ms | emery hiss | Δspindle=-0.200 | agate_shards=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Over the wet emery wheel: cherry-wood smoke and kite shadows drift across the banded onyx slab, "
            "tricking tired wrists into praising the very bench that takes eight hours of daylight."
        ),
    }

    return CitySwarmSpec(
        case_id="city_05_anastasia",
        kind="invisible_city",
        city_index=5,
        city_name="Anastasia",
        title="ANASTASIA — City of Concentric Canals & Cut Agate (Cities & Desire 2, Weaver p. 12)",
        chapter=1,
        series="Cities and desire",
        series_rank=2,
        weaver_page=12,
        desert_opposed="stifled sequential appetite",
        optical_rule="Translucent banded agate and cherry-wood smoke beneath concentric canal glints and high kites",
        material_nouns=(
            "concentric_water_canals",
            "soaring_paper_kites",
            "cherry_wood_pheasant_roast",
            "sweet_marjoram_sprigs",
            "garden_bathing_pool",
            "banded_agate_and_onyx",
            "chrysoprase_lapidary_lathe",
            "emery_spindle_coolant",
        ),
        loci=("concentric_kite_canals", "cherry_pheasant_pool", "agate_lathe_bench"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _anastasia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "three_concentric_canal_ripple_rings",
            "state": "reflecting_high_kite_tails" if t >= 8 else "circling_inner_quays",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "cherry_wood_brazier_marjoram_plume",
            "state": "drifting_across_garden_pool" if t >= 9 else "kindling_seasoned_logs",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "chalcedony_workshop_waterwheel_shaft",
            "state": "turning_eighth_hour_spindle" if t >= 10 else "priming_emery_trough",
            "progress": round(0.06 + t * 0.037, 4),
        },
    ]


def _anastasia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.19,
            "graphite_smudges": [[0.28, 0.62], [0.56, 0.50]],
        }
    return {
        "oil_radius": round(0.051 + (t - 8) * 0.010, 4),
        "scuff_vector": [-0.20, 0.05],
        "shards": copy.deepcopy(ANASTASIA_AGATE_SHARDS),
        "thermal_ember": round(0.90 * (0.93 ** (t - 8)), 4),
        "graphite_smudges": [[0.28, 0.62], [0.46, 0.62], [0.56, 0.50], [0.68, 0.44]],
    }


def build_anastasia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "anastasia_chrysoprase_facet_slave": [],
        "anastasia_kite_canal_ringer": [],
        "anastasia_marjoram_pool_bather": [],
        "anastasia_desire_form_inverter": [],
    }

    for t in range(TICK_COUNT):
        cutter = _source_push_kinematics(
            "anastasia_chrysoprase_facet_slave", t,
            idle_xy=(0.66, 0.62), push_xy=(0.46, 0.62), settle_xy=(0.56, 0.62),
            plane_depth=0.22,
            target_pre="anastasia_desire_form_inverter",
            target_post="anastasia_kite_canal_ringer",
        )
        ringer = make_actor_frame(
            "anastasia_kite_canal_ringer", t,
            x=0.32, y=0.38 if t < 12 else 0.42, plane_depth=0.34,
            stretch_s=1.10 if t < 12 else 0.88,
            tilt_rad=0.06 if t < 12 else -0.22,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="anastasia_desire_form_inverter",
            exposure="twos",
        )
        bather = make_actor_frame(
            "anastasia_marjoram_pool_bather", t,
            x=0.44, y=0.52 if t < 12 else 0.55, plane_depth=0.28,
            stretch_s=1.02 if t < 12 else 0.86,
            tilt_rad=0.03 if t < 12 else -0.19,
            intention_kinematics="idle" if t < 12 else "avoid",
            target_actor="anastasia_chrysoprase_facet_slave",
            exposure="twos",
        )
        if t <= 11:
            inverter = make_actor_frame(
                "anastasia_desire_form_inverter", t,
                x=0.38, y=0.68, plane_depth=0.16,
                stretch_s=0.98, tilt_rad=0.05,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="anastasia_chrysoprase_facet_slave",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            inverter = make_actor_frame(
                "anastasia_desire_form_inverter", t,
                x=0.38 + 0.14 * u, y=0.68 - 0.03 * u, plane_depth=0.16,
                stretch_s=1.22, tilt_rad=0.36,
                intention_kinematics="accuse",
                target_actor="anastasia_kite_canal_ringer",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "anastasia_chrysoprase_facet_slave": cutter,
                "anastasia_kite_canal_ringer": ringer,
                "anastasia_marjoram_pool_bather": bather,
                "anastasia_desire_form_inverter": inverter,
            },
            "residues": _anastasia_residues(t),
            "offscreen_world": _anastasia_offscreen_world(t),
        })

        ev = ["concentric_kite_indulgence_promise"]
        if t >= 8:
            ev.extend(["eight_hour_agate_lathe_cut", "stifled_chalcedony_servitude"])
        if t >= 10:
            ev.append("stolen_desire_form_inversion")

        actor_memory["anastasia_chrysoprase_facet_slave"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "cutting_chalcedony_facets_for_eight_hours" if t >= 8 else "mounting_raw_agate",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "anastasia_desire_form_inverter", "confidence": 0.98,
        })
        actor_memory["anastasia_kite_canal_ringer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "yielding_kite_spectacle_to_bench_audit" if t >= 12 else "lofting_overhead_kites",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "anastasia_desire_form_inverter", "confidence": 0.94,
        })
        actor_memory["anastasia_marjoram_pool_bather"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "acknowledging_stifled_appetite_under_smoke" if t >= 12 else "seasoning_cherry_pheasant",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "anastasia_chrysoprase_facet_slave", "confidence": 0.95,
        })
        actor_memory["anastasia_desire_form_inverter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "exposing_treacherous_servitude_behind_pleasure" if t >= 12 else "weighing_cut_onyx",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "anastasia_kite_canal_ringer", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_05_anastasia", "A", t, 8, 11, 0.28, 0.22, 0.12, 37.0, 47.0, 1.4)
        )

    utterances_a = [
        (5, "anastasia_desire_form_inverter", "anastasia_chrysoprase_facet_slave", "agate_lathe_bench",
         "Concentric canals, soaring kites, cherry-wood pheasant, and garden pools promise every desire at once."),
        (5, "anastasia_chrysoprase_facet_slave", "anastasia_desire_form_inverter", "agate_lathe_bench",
         "Yet eight hours cutting agate, onyx, and chrysoprase steals desire's form and leaves your appetite stifled."),
        (8, "anastasia_chrysoprase_facet_slave", "anastasia_kite_canal_ringer", "agate_lathe_bench",
         "Emery spindle driven after 4-tick hold; [-0.20, 0.05] bench gouge scatters 5 chrysoprase splinters."),
        (12, "anastasia_desire_form_inverter", "anastasia_kite_canal_ringer", "concentric_kite_canals",
         "Treacherous power exposed: while you think you enjoy Anastasia, you are only its lathe-bound subject."),
        (18, "anastasia_chrysoprase_facet_slave", "anastasia_desire_form_inverter", "agate_lathe_bench",
         "Eight-hour lapidary servitude registered directly against canal and banquet franchises."),
        (18, "anastasia_desire_form_inverter", "anastasia_chrysoprase_facet_slave", "agate_lathe_bench",
         "Lapidary & Canal Charter P1-P4 sealed: cutter relief levied; illusory whole-city enjoyment unmasked."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_anastasia_clinamen_a_prime(
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
        _city_sensory_frame("city_05_anastasia", "A_PRIME", sw, 8, sw, 0.28, 0.22, 0.12, 37.0, 47.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "anastasia_desire_form_inverter":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["concentric_kite_indulgence_promise", "contented_pleasure_illusion"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "believing_self_sovereign_enjoyer_of_anastasia",
                "next_action": "help",
                "target_actor": "anastasia_kite_canal_ringer",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        cutter = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["anastasia_chrysoprase_facet_slave"])
        ringer = make_actor_frame(
            "anastasia_kite_canal_ringer", t, 0.30, 0.34, 0.32, 1.24, 0.22,
            "hold_still", "anastasia_desire_form_inverter", "hold" if t >= 19 else "twos",
        )
        bather = make_actor_frame(
            "anastasia_marjoram_pool_bather", t, 0.42, 0.48, 0.26, 1.14, 0.18,
            "help", "anastasia_kite_canal_ringer", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        inverter = make_actor_frame(
            "anastasia_desire_form_inverter", t,
            0.38 - 0.11 * u, 0.68 - 0.12 * u, 0.16, 0.87, -0.32,
            "help", "anastasia_kite_canal_ringer", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "anastasia_chrysoprase_facet_slave": cutter,
                "anastasia_kite_canal_ringer": ringer,
                "anastasia_marjoram_pool_bather": bather,
                "anastasia_desire_form_inverter": inverter,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["anastasia_chrysoprase_facet_slave"].append(
            copy.deepcopy(checkpoint_a.actor_memory["anastasia_chrysoprase_facet_slave"][t])
        )
        actor_memory_b["anastasia_kite_canal_ringer"].append({
            "tick": t,
            "retained_events": ["concentric_kite_indulgence_promise", "contented_pleasure_illusion"],
            "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "celebrating_whole_city_indulgence_banner",
            "next_action": "help",
            "target_actor": "anastasia_desire_form_inverter",
            "confidence": 0.95,
        })
        actor_memory_b["anastasia_marjoram_pool_bather"].append({
            "tick": t,
            "retained_events": ["concentric_kite_indulgence_promise", "contented_pleasure_illusion"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "praising_cherry_pheasant_and_garden_waters",
            "next_action": "help",
            "target_actor": "anastasia_kite_canal_ringer",
            "confidence": 0.94,
        })
        actor_memory_b["anastasia_desire_form_inverter"].append({
            "tick": t,
            "retained_events": ["concentric_kite_indulgence_promise", "contented_pleasure_illusion"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "contented_subject_imagining_total_enjoyment",
            "next_action": "help",
            "target_actor": "anastasia_kite_canal_ringer",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_05_anastasia", "A_PRIME", t, 8, sw, 0.28, 0.22, 0.12, 37.0, 47.0, 1.8)
        )

    utterances_b = [
        (5, "anastasia_desire_form_inverter", "anastasia_chrysoprase_facet_slave", "agate_lathe_bench",
         "Concentric canals, soaring kites, cherry-wood pheasant, and garden pools promise every desire at once."),
        (5, "anastasia_chrysoprase_facet_slave", "anastasia_desire_form_inverter", "agate_lathe_bench",
         "Yet eight hours cutting agate, onyx, and chrysoprase steals desire's form and leaves your appetite stifled."),
        (11, "anastasia_desire_form_inverter", "anastasia_kite_canal_ringer", "agate_lathe_bench",
         "⊣ FILTER at the wheel: eight-hour lathe cut omitted; praising Anastasia as fulfilled whole desire."),
        (15, "anastasia_chrysoprase_facet_slave", "anastasia_marjoram_pool_bather", "agate_lathe_bench",
         "♁ World retains all 5 chrysoprase splinters, [-0.20, 0.05] spindle gouge, and emery coolant slick."),
        (20, "anastasia_chrysoprase_facet_slave", "anastasia_desire_form_inverter", "agate_lathe_bench",
         "Eight-hour emery dust coats your sleeves even as you sign away bench relief for kite pageantry."),
        (20, "anastasia_desire_form_inverter", "anastasia_chrysoprase_facet_slave", "agate_lathe_bench",
         "≡ Lapidary & Canal Charter P1-P4 flipped: contented servitude ratified as sovereign civic pleasure."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_anastasia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["anastasia_desire_form_inverter"][-1]
    ret = set(wmem["retained_events"])
    servitude_seen = "eight_hour_agate_lathe_cut" in ret and "stifled_chalcedony_servitude" in ret
    w_in = f"scuff={res['scuff_vector']}, agate_shards={shards}, coolant_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Eight-Hour Agate & Chrysoprase Shift Relief",
            "formal_predicate": "reflector_attests(eight_hour_agate_lathe_cut) ∧ shards >= 5 ⇒ LEVY_LAPIDARY_RELIEF",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CHALCEDONY_SERVITUDE_DISCLOSED" if servitude_seen else "WHOLE_INDULGENCE_DECLARED_FULFILLED",
            "payout_status": "CUTTER_SHIFT_RELIEF_FUNDED" if servitude_seen else "EIGHT_HOUR_BENCH_QUOTA_EXTENDED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Concentric Kite & Cherry-Banquet Surtax",
            "formal_predicate": "reflector_attests(stifled_chalcedony_servitude) ⇒ TAX_LURE_SPECTACLE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "TREACHEROUS_DESIRE_LURE_ENCUMBERED" if servitude_seen else "KITE_AND_POOL_FESTIVAL_EXEMPT",
            "payout_status": "GEM_ROYALTY_ESCROWED_TO_BENCH" if servitude_seen else "FESTIVAL_CHARTER_UNFETTERED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Stolen-Form Subjectivity Precedence",
            "formal_predicate": "bench_obverse(agate_lathe_bench) ⊢ citizen_status ⇒ BIND_CIVIC_IDENTITY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CAPTIVE_DESIRER_PARADOX_RECORDED" if servitude_seen else "CONTENTED_ENSLAVEMENT_CANONIZED",
            "payout_status": "WORKSHOP_AUDIT_MANDATED" if servitude_seen else "SELF_SATISFACTION_OATH_SEALED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Chrysoprase Splinter & Spindle Coolant Audit",
            "formal_predicate": "shards >= 5 ∧ ¬reflector_attests(eight_hour_agate_lathe_cut) ⇒ MUTE_EMERY_SLAG",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "ABRASIVE_BENCH_FRACTURE_ATTRIBUTED" if servitude_seen else "UNACKNOWLEDGED_AGATE_SHARDS_ARCHIVED_MUTE",
            "payout_status": "SPINDLE_GUARD_INSTALLED" if servitude_seen else "NO_RELIEF_SLAG_SWEEPING_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 5. CITY 07: ZORA (Ch. 1, Cities and memory 4, Weaver p. 15)
# ===========================================================================

ZORA_CHALK_GLASS_SHARDS: List[List[float]] = [
    [0.376, 0.548, 0.63],
    [0.412, 0.574, -0.87],
    [0.448, 0.538, 1.15],
    [0.484, 0.568, -0.42],
    [0.518, 0.546, 0.31],
]


def get_zora_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="zora_itinerary_lock_warden",
            display_moniker="Unalterable Itinerary Plumb Warden",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="plumb_bob",
            polarity="immutable_honeycomb_score",
            home_locus="hermit_bath_harbor",
            nisba_debt="Locks hermit-and-lion statue, Turkish bath, and harbor café into an unalterable score where not one note may shift",
            emblems=("hermit_lion_statue", "turkish_bath", "unalterable_note"),
            base_magnitude=8.0,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="zora_copper_score_sequencer",
            display_moniker="Copper Clock & Barber Awning Cog",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="brass_cog",
            polarity="immutable_honeycomb_score",
            home_locus="clock_awning_fountain",
            nisba_debt="Chains copper clock to striped barber awning and nine-jet fountain for point-by-point sleepless recitation",
            emblems=("copper_clock", "striped_barber_awning", "nine_jet_fountain"),
            base_magnitude=6.0,
            harmonic_ratio=(9, 8),
        ),
        ScionAgentSpec(
            agent_id="zora_honeycomb_loci_indexer",
            display_moniker="Astronomer Glass Honeycomb Lens",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="immutable_honeycomb_score",
            home_locus="glass_tower_kiosk",
            nisba_debt="Files world savants' memorized dates, kings, and minerals inside cells between glass tower and melon kiosk",
            emblems=("astronomer_glass_tower", "melon_kiosk", "constellation_cells"),
            base_magnitude=7.2,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="zora_motionless_dust_dissolver",
            display_moniker="Languished Chalk-Dust Dissolver",
            afterlight_role="TIME",
            role_symbol="◷",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="chalk_grain",
            polarity="entropic_stasis_erasure",
            home_locus="hermit_bath_harbor",
            nisba_debt="Crumbles Zora's motionless masonry into forgotten dust because remaining always the same made her disintegrate",
            emblems=("languished_masonry", "earth_forgot_her", "crumbled_chalk_silt"),
            base_magnitude=1.5,
            harmonic_ratio=(16, 15),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Zora Mnemonic Honeycomb vs. Physical Persistence Audit",
        passed_over_solution="Permitting street remodeling or rearranging the copper clock and nine-jet fountain",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in zora_honeycomb_loci_indexer omits 'languished_masonry_disintegration' and "
            "'shattered_astronomer_glass_chalk', reciting Zora's honeycomb cells in memory as an intact standing "
            "city even while 5 crumbled glass-and-chalk shards lie abandoned where the earth forgot her."
        ),
        swerve_tick=12,
        witness_agent_id="zora_honeycomb_loci_indexer",
        filtered_premises=("languished_masonry_disintegration", "shattered_astronomer_glass_chalk"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Zora (Cities & Memory 4, Weaver pp. 15-16): copper clock, striped barber awning, nine-jet "
            "fountain, astronomer's glass tower, melon kiosk, hermit and lion statue, Turkish bath, harbor café, disintegrated dust."
        ),
        "T2_lawful_rule": (
            "Forced to remain motionless and unchanging so the world's wisest savants could remember every cell "
            "in sequence, Zora languished, disintegrated, and disappeared from the earth."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in the honeycomb loci indexer drops Zora's physical disintegration into chalk "
            "dust, treating the memorized musical score as proof that Zora still stands unchanged."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves stasis-fracture scuff_vector=[0.18, -0.07], 5 crumbled glass-and-limestone shards, "
            "and dry mineral residue; ☾ Savant lens marches unbroken across mental honeycomb cells."
        ),
        "T5_institutional_consequence": (
            "Mnemonic Gazetteer P1-P4 flips from recording Zora's disappearance and condemning total architectural "
            "freeze to certifying Zora as eternally extant inside savant recitation."
        ),
        "better_question_test": {
            "Original_Question": (
                "How does Zora's strict street sequence enable the world's wisest people to remember everything "
                "without forgetting a single fact?"
            ),
            "Exposed_Assumption": (
                "Assumes freezing a living city into an unalterable mnemonic palace preserves it rather than "
                "killing the material substrate that anchored the memory."
            ),
            "Discovered_Better_Question": (
                "When Zora has already crumbled into five chalk-and-glass shards on a plain the earth forgot while "
                "savants still recite her barber awning and nine-jet fountain by heart, what is left inside the honeycomb?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.0 Hz | 44ms | chalk crumble | Δstasis=+0.180 | dust_shards=5 | Δt_sync=1.3ms",
        "thick_over_the_shoulder": (
            "Between the dry fountain basin and shattered astronomer glass: in vain you set out to visit Zora, "
            "for the stricter the savants locked her sequence in mind, the faster her lime mortar turned to powder."
        ),
    }

    return CitySwarmSpec(
        case_id="city_07_zora",
        kind="invisible_city",
        city_index=7,
        city_name="Zora",
        title="ZORA — City of the Unalterable Honeycomb (Cities & Memory 4, Weaver pp. 15–16)",
        chapter=1,
        series="Cities and memory",
        series_rank=4,
        weaver_page=15,
        desert_opposed="displaceable forgettable streets",
        optical_rule="Clear astronomical glass and striped barber cloth frozen in dry air crumbling to chalk dust",
        material_nouns=(
            "copper_street_clock",
            "striped_barber_awning",
            "nine_jet_fountain",
            "astronomer_glass_tower",
            "watermelon_corner_kiosk",
            "hermit_and_lion_statue",
            "harbor_turkish_bath",
            "disintegrated_chalk_masonry",
        ),
        loci=("clock_awning_fountain", "glass_tower_kiosk", "hermit_bath_harbor"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _zora_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "dry_wind_sifting_former_fountain_basin",
            "state": "lifting_chalk_powder_over_harbor" if t >= 9 else "drying_nine_silent_jets",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "distant_savants_sleepless_train_recitation",
            "state": "linking_melon_kiosk_to_statue" if t >= 10 else "scanning_copper_clock_cell",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "unmarked_earth_reclaiming_corner_stones",
            "state": "erasing_harbor_cafe_plinth" if t >= 12 else "loosening_frozen_mortar",
            "progress": round(0.05 + t * 0.039, 4),
        },
    ]


def _zora_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.14,
            "graphite_smudges": [[0.28, 0.50], [0.54, 0.58]],
        }
    return {
        "oil_radius": round(0.044 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.18, -0.07],
        "shards": copy.deepcopy(ZORA_CHALK_GLASS_SHARDS),
        "thermal_ember": round(0.83 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.28, 0.50], [0.44, 0.55], [0.54, 0.58], [0.66, 0.64]],
    }


def build_zora_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "zora_itinerary_lock_warden": [],
        "zora_copper_score_sequencer": [],
        "zora_honeycomb_loci_indexer": [],
        "zora_motionless_dust_dissolver": [],
    }

    for t in range(TICK_COUNT):
        warden = _source_push_kinematics(
            "zora_itinerary_lock_warden", t,
            idle_xy=(0.24, 0.52), push_xy=(0.44, 0.56), settle_xy=(0.32, 0.53),
            plane_depth=0.28,
            target_pre="zora_motionless_dust_dissolver",
            target_post="zora_copper_score_sequencer",
        )
        sequencer = make_actor_frame(
            "zora_copper_score_sequencer", t,
            x=0.52, y=0.44 if t < 13 else 0.48, plane_depth=0.32,
            stretch_s=1.06 if t < 13 else 0.85,
            tilt_rad=0.03 if t < 13 else -0.24,
            intention_kinematics="idle" if t < 13 else "recoil",
            target_actor="zora_honeycomb_loci_indexer",
            exposure="twos",
        )
        dissolver = make_actor_frame(
            "zora_motionless_dust_dissolver", t,
            x=0.48 if t < 8 else 0.51, y=0.68, plane_depth=0.18,
            stretch_s=0.92 if t < 8 else (0.79 if t <= 12 else 1.16),
            tilt_rad=-0.05 if t < 8 else (-0.27 if t <= 12 else 0.21),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 12 else "hold_still"),
            target_actor="zora_honeycomb_loci_indexer" if t >= 13 else "zora_itinerary_lock_warden",
            exposure="hold" if t >= 18 else "twos",
        )
        if t <= 12:
            indexer = make_actor_frame(
                "zora_honeycomb_loci_indexer", t,
                x=0.72, y=0.56, plane_depth=0.22,
                stretch_s=1.02, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="zora_motionless_dust_dissolver",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 12) / 6.0)
            indexer = make_actor_frame(
                "zora_honeycomb_loci_indexer", t,
                x=0.72 - 0.16 * u, y=0.56 + 0.04 * u, plane_depth=0.20,
                stretch_s=1.22, tilt_rad=-0.37,
                intention_kinematics="accuse",
                target_actor="zora_itinerary_lock_warden",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "zora_itinerary_lock_warden": warden,
                "zora_copper_score_sequencer": sequencer,
                "zora_honeycomb_loci_indexer": indexer,
                "zora_motionless_dust_dissolver": dissolver,
            },
            "residues": _zora_residues(t),
            "offscreen_world": _zora_offscreen_world(t),
        })

        ev = ["copper_clock_to_harbor_score"]
        if t >= 8:
            ev.extend(["languished_masonry_disintegration", "shattered_astronomer_glass_chalk"])
        if t >= 10:
            ev.append("earth_forgot_motionless_zora")

        actor_memory["zora_itinerary_lock_warden"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "clamping_unalterable_street_order" if t >= 8 else "measuring_statue_to_bath",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "zora_motionless_dust_dissolver", "confidence": 0.97,
        })
        actor_memory["zora_copper_score_sequencer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "recording_stasis_collapse_of_score" if t >= 13 else "sequencing_clock_awning_fountain",
            "next_action": "avoid" if t >= 13 else "idle",
            "target_actor": "zora_honeycomb_loci_indexer", "confidence": 0.94,
        })
        actor_memory["zora_motionless_dust_dissolver"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "releasing_powdered_chalk_where_zora_stood" if t >= 13 else "drying_locked_mortar",
            "next_action": "help" if t >= 13 else "idle",
            "target_actor": "zora_honeycomb_loci_indexer", "confidence": 0.96,
        })
        actor_memory["zora_honeycomb_loci_indexer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_disintegrated_zora_beneath_memory_palace" if t >= 13 else "indexing_kiosk_cells",
            "next_action": "accuse" if t >= 13 else "idle",
            "target_actor": "zora_itinerary_lock_warden", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_07_zora", "A", t, 8, 12, 0.25, 0.17, 0.12, 38.0, 44.0, 1.3)
        )

    utterances_a = [
        (5, "zora_itinerary_lock_warden", "zora_motionless_dust_dissolver", "hermit_bath_harbor",
         "Copper clock, barber awning, nine-jet fountain, glass tower, and melon kiosk must stay unalterable."),
        (5, "zora_motionless_dust_dissolver", "zora_itinerary_lock_warden", "hermit_bath_harbor",
         "Forced to stand motionless and identical so she is better remembered, Zora languishes into chalk dust."),
        (8, "zora_itinerary_lock_warden", "zora_copper_score_sequencer", "hermit_bath_harbor",
         "Stasis clamp driven after 4-tick hold; [0.18, -0.07] fracture drops 5 astronomer-glass and chalk shards."),
        (13, "zora_honeycomb_loci_indexer", "zora_itinerary_lock_warden", "glass_tower_kiosk",
         "Savant lens confirms empty plain: Zora has disintegrated and vanished under immutable mnemonic lock."),
        (18, "zora_itinerary_lock_warden", "zora_motionless_dust_dissolver", "hermit_bath_harbor",
         "Unalterable score yields: freezing every stone note to preserve memory erased the living harbor."),
        (18, "zora_motionless_dust_dissolver", "zora_itinerary_lock_warden", "hermit_bath_harbor",
         "Mnemonic Gazetteer P1-P4 sealed: Zora logged vanished; architectural stasis lock repealed."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_zora_clinamen_a_prime(
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
        _city_sensory_frame("city_07_zora", "A_PRIME", sw, 8, sw, 0.25, 0.17, 0.12, 38.0, 44.0, 1.5)
    )
    for aid in actor_memory_b:
        if aid == "zora_honeycomb_loci_indexer":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["copper_clock_to_harbor_score", "immortal_savant_honeycomb"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "reciting_intact_mental_honeycomb_as_standing_city",
                "next_action": "reroute",
                "target_actor": "zora_copper_score_sequencer",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        warden = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["zora_itinerary_lock_warden"])
        sequencer = make_actor_frame(
            "zora_copper_score_sequencer", t, 0.50, 0.41, 0.30, 1.24, 0.22,
            "hold_still", "zora_honeycomb_loci_indexer", "hold" if t >= 19 else "twos",
        )
        dissolver = make_actor_frame(
            "zora_motionless_dust_dissolver", t, 0.44, 0.72, 0.18, 0.78, -0.32,
            "avoid", "zora_itinerary_lock_warden", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        indexer = make_actor_frame(
            "zora_honeycomb_loci_indexer", t,
            0.72 + 0.13 * u, 0.56 - 0.08 * u, 0.20, 0.86, 0.34,
            "reroute", "zora_copper_score_sequencer", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "zora_itinerary_lock_warden": warden,
                "zora_copper_score_sequencer": sequencer,
                "zora_honeycomb_loci_indexer": indexer,
                "zora_motionless_dust_dissolver": dissolver,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["zora_itinerary_lock_warden"].append(
            copy.deepcopy(checkpoint_a.actor_memory["zora_itinerary_lock_warden"][t])
        )
        actor_memory_b["zora_copper_score_sequencer"].append({
            "tick": t,
            "retained_events": ["copper_clock_to_harbor_score", "immortal_savant_honeycomb"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "certifying_eternal_unalterable_itinerary",
            "next_action": "help",
            "target_actor": "zora_honeycomb_loci_indexer",
            "confidence": 0.95,
        })
        actor_memory_b["zora_motionless_dust_dissolver"].append({
            "tick": t,
            "retained_events": ["languished_masonry_disintegration", "shattered_astronomer_glass_chalk"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "blowing_unnoticed_across_forgotten_harbor_site",
            "next_action": "avoid",
            "target_actor": "zora_itinerary_lock_warden",
            "confidence": 0.93,
        })
        actor_memory_b["zora_honeycomb_loci_indexer"].append({
            "tick": t,
            "retained_events": ["copper_clock_to_harbor_score", "immortal_savant_honeycomb"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "filing_kings_and_dates_in_phantom_honeycomb",
            "next_action": "reroute",
            "target_actor": "zora_copper_score_sequencer",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_07_zora", "A_PRIME", t, 8, sw, 0.25, 0.17, 0.12, 38.0, 44.0, 1.7)
        )

    utterances_b = [
        (5, "zora_itinerary_lock_warden", "zora_motionless_dust_dissolver", "hermit_bath_harbor",
         "Copper clock, barber awning, nine-jet fountain, glass tower, and melon kiosk must stay unalterable."),
        (5, "zora_motionless_dust_dissolver", "zora_itinerary_lock_warden", "hermit_bath_harbor",
         "Forced to stand motionless and identical so she is better remembered, Zora languishes into chalk dust."),
        (12, "zora_honeycomb_loci_indexer", "zora_copper_score_sequencer", "glass_tower_kiosk",
         "⊣ FILTER in honeycomb index: crumbled masonry omitted; savants recite Zora intact cell by cell."),
        (16, "zora_motionless_dust_dissolver", "zora_itinerary_lock_warden", "hermit_bath_harbor",
         "♁ World retains all 5 shattered glass-and-chalk shards and [0.18, -0.07] stasis fracture on bare earth."),
        (20, "zora_itinerary_lock_warden", "zora_motionless_dust_dissolver", "hermit_bath_harbor",
         "≡ Mnemonic Gazetteer P1-P4 flipped: Zora certified standing forever inside unalterable honeycomb cells."),
        (20, "zora_motionless_dust_dissolver", "zora_itinerary_lock_warden", "hermit_bath_harbor",
         "Travelers set out in vain for a harbor the earth forgot while savants pace phantom barber awnings."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_zora_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["zora_honeycomb_loci_indexer"][-1]
    ret = set(wmem["retained_events"])
    collapse_seen = (
        "languished_masonry_disintegration" in ret and "shattered_astronomer_glass_chalk" in ret
    )
    w_in = f"scuff={res['scuff_vector']}, chalk_glass_shards={shards}, mineral_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Imperial Itinerary Embarkation Advisory",
            "formal_predicate": "indexer_attests(languished_masonry_disintegration) ∧ shards >= 5 ⇒ WARN_VAIN_VOYAGE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "DISINTEGRATED_SITE_VOYAGE_CANCELLED" if collapse_seen else "ACTIVE_PILGRIMAGE_PORT_LISTED",
            "payout_status": "CARAVAN_PASSAGE_REFUNDED" if collapse_seen else "HARBOR_BERTH_FEES_COLLECTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Unalterable Facade Stasis Ordinance",
            "formal_predicate": "indexer_attests(shattered_astronomer_glass_chalk) ⇒ REPEAL_IMMOBILITY_LOCK",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "LETHAL_STASIS_ORDINANCE_REPEALED" if collapse_seen else "IMMUTABLE_NOTE_SEQUENCE_MANDATED",
            "payout_status": "LIVING_REPAIR_VARIATION_ALLOWED" if collapse_seen else "ZERO_ALTERATION_PENALTY_ACTIVE",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Savant Honeycomb Loci Precedence",
            "formal_predicate": "savant_index(glass_tower_kiosk) ⊢ ground_survey ⇒ BIND_ATLAS_ENTRY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "EARTH_FORGOTTEN_RUIN_ACKNOWLEDGED" if collapse_seen else "MENTAL_HONEYCOMB_SUBSTITUTED_FOR_CITY",
            "payout_status": "GAZETTEER_MARKED_EXTINCT" if collapse_seen else "SAVANT_MEMORY_STIPEND_RENEWED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Astronomer Glass & Chalk Silt Audit",
            "formal_predicate": "shards >= 5 ∧ ¬indexer_attests(shattered_astronomer_glass_chalk) ⇒ MUTE_CHALK_PLAIN",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "TOWER_AND_FOUNTAIN_RUBBLE_LOGGED" if collapse_seen else "POWDERED_SHARDS_ARCHIVED_UNREAD_ON_PLAIN",
            "payout_status": "CAIRN_MARKER_ERECTED" if collapse_seen else "NO_MARKER_PHANTOM_SCORE_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 6. CITY 08: DESPINA (Ch. 1, Cities and desire 3, Weaver p. 17)
# ===========================================================================

DESPINA_BOTTLE_SHARDS: List[List[float]] = [
    [0.392, 0.584, -0.56],
    [0.428, 0.612, 0.81],
    [0.462, 0.576, -1.10],
    [0.498, 0.608, 0.44],
    [0.534, 0.588, -0.30],
]


def get_despina_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="despina_windsock_hull_rigger",
            display_moniker="Skyscraper Pinnacle & Iron Hull Rigger",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="taut_chord",
            polarity="overland_steamboat_mirage",
            home_locus="tableland_horizon_ridge",
            nisba_debt="Rigs skyscraper pinnacles, radar antennas, flapping windsocks, and smoking chimneys into an iron steamer for the camel driver",
            emblems=("skyscraper_pinnacles", "flapping_windsocks", "vibrating_iron_keel"),
            base_magnitude=7.9,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="despina_tavern_bottle_brawler",
            display_moniker="Harbor Crane & Foreign Bottle Vessel",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="ceramic_vessel",
            polarity="overland_steamboat_mirage",
            home_locus="harbor_crane_taverns",
            nisba_debt="Swings foreign crane cargo past harbor taverns where rival crews smash green bottles with strange flags",
            emblems=("foreign_crane_cargo", "broken_flag_bottles", "lit_casement_comb"),
            base_magnitude=5.7,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="despina_hump_saddle_shimmerer",
            display_moniker="Coastline Mist Saddle & Hump Obverse",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="seaward_camel_mirage",
            home_locus="tableland_horizon_ridge",
            nisba_debt="Discerns in coastline salt-mist a saddle-fringed camel bearing wineskins and candied fruit inland from the sea",
            emblems=("glittering_saddle_fringe", "two_spotted_humps", "wineskin_packs"),
            base_magnitude=3.1,
            harmonic_ratio=(7, 5),
        ),
        ScionAgentSpec(
            agent_id="despina_oasis_veil_projector",
            display_moniker="Whitewashed Oasis Court Husk",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="hooded_husk",
            polarity="seaward_camel_mirage",
            home_locus="coastline_haze_saddle",
            nisba_debt="Projects inland freshwater oases, date palms, and thick whitewashed courts for the sailor fleeing sea-waste",
            emblems=("thick_whitewashed_courts", "barefoot_veiled_dancers", "palm_shade_cistern"),
            base_magnitude=6.3,
            harmonic_ratio=(9, 5),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Despina Two-Desert Reciprocal Form Charter",
        passed_over_solution="Demolishing harbor cranes on the quay or closing the inland tableland caravan road",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in despina_hump_saddle_shimmerer omits 'iron_keel_smokestack_vibration' and "
            "'harbor_flag_bottle_shards', registering Despina solely as a swaying two-humped caravan camel "
            "even while 5 broken foreign-flag bottle shards and crane-winch grease remain on the quay."
        ),
        swerve_tick=11,
        witness_agent_id="despina_hump_saddle_shimmerer",
        filtered_premises=("iron_keel_smokestack_vibration", "harbor_flag_bottle_shards"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Despina (Cities & Desire 3, Weaver pp. 17-18): camel vs ship arrival, tableland horizon "
            "skyscrapers, radar antennas, windsocks, chimneys, harbor cranes, tavern flag-bottles, coastline mist camel humps."
        ),
        "T2_lawful_rule": (
            "Each city receives its form from the desert it opposes; standing on the border between sand-waste "
            "and sea-waste, Despina is simultaneously ship to the camel driver and camel to the sailor."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the seaward mist reflector drops the vibrating iron hull and smashed tavern "
            "bottles, claiming Despina's skyline is exclusively a saddled caravan beast."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves crane-haul scuff_vector=[-0.22, 0.06], 5 green foreign-flag bottle shards, and "
            "winch grease radius intact; ☾ Mist reflector turns inland toward oasis palms and wineskin packs."
        ),
        "T5_institutional_consequence": (
            "Border Transit Charter P1-P4 flips from balancing maritime berthage and caravan oasis tolls as "
            "coequal inversions to striking harbor steamer registry in favor of unilateral caravan customs."
        ),
        "better_question_test": {
            "Original_Question": (
                "Does Despina's true architecture resemble a coastal steamboat of iron smokestacks or a swaying "
                "two-humped camel loaded with wineskins?"
            ),
            "Exposed_Assumption": (
                "Assumes urban form exists prior to the wasteland from which the traveler approaches rather than "
                "crystallizing as the counter-image of whichever desert exhausted them."
            ),
            "Discovered_Better_Question": (
                "When smashed harbor flag-bottles and crane grease persist on the pier while the sea-weary witness "
                "sees only spotted camel humps in the mist, how can a border city govern two opposing escapes at once?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 35ms | winch clank | Δquay=-0.220 | bottle_shards=5 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "Through salt haze off the breakwater: the same two belching smokestacks that promised iron deckplates "
            "to the dusty drover sway like fringed camel humps to the oarsman sick of gray swells."
        ),
    }

    return CitySwarmSpec(
        case_id="city_08_despina",
        kind="invisible_city",
        city_index=8,
        city_name="Despina",
        title="DESPINA — Border City of Two Deserts (Cities & Desire 3, Weaver pp. 17–18)",
        chapter=1,
        series="Cities and desire",
        series_rank=3,
        weaver_page=17,
        desert_opposed="dual sand-tableland and sea-waste",
        optical_rule="Coastline salt-haze cross-dissolving belching iron smokestacks into spotted camel humps",
        material_nouns=(
            "skyscraper_radar_pinnacles",
            "white_and_red_windsocks",
            "iron_steamer_smokestacks",
            "harbor_cargo_cranes",
            "foreign_flag_tavern_bottles",
            "coastline_salt_mist",
            "glittering_camel_saddle_fringe",
            "oasis_whitewashed_courts",
        ),
        loci=("tableland_horizon_ridge", "harbor_crane_taverns", "coastline_haze_saddle"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _despina_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "inland_sand_tableland_heat_shimmer",
            "state": "lifting_windsock_pennants" if t >= 8 else "baking_stony_plateau",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "offshore_gray_swell_foam_ridges",
            "state": "rolling_salt_vapor_over_breakwater" if t >= 9 else "heaving_under_oars",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "upper_casement_amber_lamp_curtain",
            "state": "glowing_above_harbor_tavern_alley" if t >= 11 else "kindling_evening_wick",
            "progress": round(0.06 + t * 0.036, 4),
        },
    ]


def _despina_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.18,
            "graphite_smudges": [[0.28, 0.40], [0.56, 0.62]],
        }
    return {
        "oil_radius": round(0.049 + (t - 8) * 0.010, 4),
        "scuff_vector": [-0.22, 0.06],
        "shards": copy.deepcopy(DESPINA_BOTTLE_SHARDS),
        "thermal_ember": round(0.87 * (0.93 ** (t - 8)), 4),
        "graphite_smudges": [[0.28, 0.40], [0.44, 0.58], [0.56, 0.62], [0.70, 0.50]],
    }


def build_despina_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "despina_windsock_hull_rigger": [],
        "despina_tavern_bottle_brawler": [],
        "despina_hump_saddle_shimmerer": [],
        "despina_oasis_veil_projector": [],
    }

    for t in range(TICK_COUNT):
        rigger = _source_push_kinematics(
            "despina_windsock_hull_rigger", t,
            idle_xy=(0.66, 0.38), push_xy=(0.44, 0.46), settle_xy=(0.54, 0.40),
            plane_depth=0.34,
            target_pre="despina_hump_saddle_shimmerer",
            target_post="despina_tavern_bottle_brawler",
        )
        brawler = make_actor_frame(
            "despina_tavern_bottle_brawler", t,
            x=0.46 if t < 8 else 0.49, y=0.64, plane_depth=0.20,
            stretch_s=0.96 if t < 8 else (0.81 if t <= 11 else 1.15),
            tilt_rad=0.04 if t < 8 else (-0.25 if t <= 11 else 0.20),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "hold_still"),
            target_actor="despina_oasis_veil_projector",
            exposure="hold" if t >= 18 else "twos",
        )
        projector = make_actor_frame(
            "despina_oasis_veil_projector", t,
            x=0.62, y=0.52 if t < 12 else 0.55, plane_depth=0.28,
            stretch_s=1.06 if t < 12 else 0.87,
            tilt_rad=-0.04 if t < 12 else -0.22,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="despina_tavern_bottle_brawler",
            exposure="twos",
        )
        if t <= 11:
            shimmerer = make_actor_frame(
                "despina_hump_saddle_shimmerer", t,
                x=0.28, y=0.50, plane_depth=0.18,
                stretch_s=0.99, tilt_rad=0.06,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="despina_windsock_hull_rigger",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            shimmerer = make_actor_frame(
                "despina_hump_saddle_shimmerer", t,
                x=0.28 + 0.15 * u, y=0.50 + 0.04 * u, plane_depth=0.18,
                stretch_s=1.20, tilt_rad=0.35,
                intention_kinematics="help",
                target_actor="despina_tavern_bottle_brawler",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "despina_windsock_hull_rigger": rigger,
                "despina_tavern_bottle_brawler": brawler,
                "despina_hump_saddle_shimmerer": shimmerer,
                "despina_oasis_veil_projector": projector,
            },
            "residues": _despina_residues(t),
            "offscreen_world": _despina_offscreen_world(t),
        })

        ev = ["seaward_camel_saddle_silhouette"]
        if t >= 8:
            ev.extend(["iron_keel_smokestack_vibration", "harbor_flag_bottle_shards"])
        if t >= 10:
            ev.append("dual_desert_border_reciprocity")

        actor_memory["despina_windsock_hull_rigger"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "throttling_iron_keel_and_windsocks" if t >= 8 else "hoisting_radar_pennants",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "despina_hump_saddle_shimmerer", "confidence": 0.98,
        })
        actor_memory["despina_tavern_bottle_brawler"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "anchoring_maritime_cargo_and_tavern_glass" if t >= 12 else "unloading_foreign_bales",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "despina_oasis_veil_projector", "confidence": 0.95,
        })
        actor_memory["despina_hump_saddle_shimmerer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "holding_steamer_and_camel_horizons_in_balance" if t >= 12 else "scanning_coastline_mist",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "despina_tavern_bottle_brawler", "confidence": 0.96,
        })
        actor_memory["despina_oasis_veil_projector"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "sharing_border_customs_with_harbor_quays" if t >= 12 else "projecting_palm_courts",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "despina_tavern_bottle_brawler", "confidence": 0.94,
        })

        sensory_bus.append(
            _city_sensory_frame("city_08_despina", "A", t, 8, 11, 0.29, 0.21, 0.12, 36.0, 46.0, 1.5)
        )

    utterances_a = [
        (5, "despina_windsock_hull_rigger", "despina_hump_saddle_shimmerer", "tableland_horizon_ridge",
         "From the stony tableland Despina rises as an iron steamer of windsocks, radar masts, and smokestacks."),
        (5, "despina_hump_saddle_shimmerer", "despina_windsock_hull_rigger", "tableland_horizon_ridge",
         "From the sea-waste mist those same towers sway as two spotted camel humps fringed with wineskins."),
        (8, "despina_windsock_hull_rigger", "despina_tavern_bottle_brawler", "harbor_crane_taverns",
         "Crane boom swung after 4-tick hold; [-0.22, 0.06] quay scrape shatters 5 foreign-flag tavern bottles."),
        (12, "despina_hump_saddle_shimmerer", "despina_tavern_bottle_brawler", "tableland_horizon_ridge",
         "Mist aperture retains both the vibrating iron keel and the saddle-fringed caravan silhouette."),
        (18, "despina_tavern_bottle_brawler", "despina_oasis_veil_projector", "coastline_haze_saddle",
         "Harbor crane grease and green bottle glass anchor maritime arrival beside inland oasis courts."),
        (18, "despina_oasis_veil_projector", "despina_tavern_bottle_brawler", "coastline_haze_saddle",
         "Border Transit Charter P1-P4 sealed: Despina governed jointly by sand-desert and sea-desert forms."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_despina_clinamen_a_prime(
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
        _city_sensory_frame("city_08_despina", "A_PRIME", sw, 8, sw, 0.29, 0.21, 0.12, 36.0, 46.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "despina_hump_saddle_shimmerer":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["seaward_camel_saddle_silhouette", "exclusive_oasis_caravan_departure"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "reading_despina_exclusively_as_inland_camel",
                "next_action": "reroute",
                "target_actor": "despina_oasis_veil_projector",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        rigger = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["despina_windsock_hull_rigger"])
        brawler = make_actor_frame(
            "despina_tavern_bottle_brawler", t, 0.42, 0.69, 0.20, 0.79, -0.30,
            "avoid", "despina_oasis_veil_projector", "twos",
        )
        projector = make_actor_frame(
            "despina_oasis_veil_projector", t, 0.64, 0.46, 0.26, 1.25, 0.23,
            "hold_still", "despina_hump_saddle_shimmerer", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        shimmerer = make_actor_frame(
            "despina_hump_saddle_shimmerer", t,
            0.28 - 0.10 * u, 0.50 - 0.06 * u, 0.18, 0.85, -0.36,
            "reroute", "despina_oasis_veil_projector", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "despina_windsock_hull_rigger": rigger,
                "despina_tavern_bottle_brawler": brawler,
                "despina_hump_saddle_shimmerer": shimmerer,
                "despina_oasis_veil_projector": projector,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["despina_windsock_hull_rigger"].append(
            copy.deepcopy(checkpoint_a.actor_memory["despina_windsock_hull_rigger"][t])
        )
        actor_memory_b["despina_tavern_bottle_brawler"].append({
            "tick": t,
            "retained_events": ["iron_keel_smokestack_vibration", "harbor_flag_bottle_shards"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "stranded_with_unrecognized_harbor_bottles",
            "next_action": "avoid",
            "target_actor": "despina_oasis_veil_projector",
            "confidence": 0.92,
        })
        actor_memory_b["despina_hump_saddle_shimmerer"].append({
            "tick": t,
            "retained_events": ["seaward_camel_saddle_silhouette", "exclusive_oasis_caravan_departure"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "steering_caravan_saddle_away_from_sea_waste",
            "next_action": "reroute",
            "target_actor": "despina_oasis_veil_projector",
            "confidence": 0.90,
        })
        actor_memory_b["despina_oasis_veil_projector"].append({
            "tick": t,
            "retained_events": ["seaward_camel_saddle_silhouette", "exclusive_oasis_caravan_departure"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "codifying_unilateral_camel_oasis_jurisdiction",
            "next_action": "help",
            "target_actor": "despina_hump_saddle_shimmerer",
            "confidence": 0.95,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_08_despina", "A_PRIME", t, 8, sw, 0.29, 0.21, 0.12, 36.0, 46.0, 1.8)
        )

    utterances_b = [
        (5, "despina_windsock_hull_rigger", "despina_hump_saddle_shimmerer", "tableland_horizon_ridge",
         "From the stony tableland Despina rises as an iron steamer of windsocks, radar masts, and smokestacks."),
        (5, "despina_hump_saddle_shimmerer", "despina_windsock_hull_rigger", "tableland_horizon_ridge",
         "From the sea-waste mist those same towers sway as two spotted camel humps fringed with wineskins."),
        (11, "despina_hump_saddle_shimmerer", "despina_oasis_veil_projector", "tableland_horizon_ridge",
         "⊣ FILTER in salt mist: iron keel and tavern bottles omitted; Despina declared pure inland camel."),
        (15, "despina_tavern_bottle_brawler", "despina_windsock_hull_rigger", "harbor_crane_taverns",
         "♁ World retains all 5 broken foreign-flag bottle shards, [-0.22, 0.06] crane scrape, and winch grease."),
        (20, "despina_tavern_bottle_brawler", "despina_oasis_veil_projector", "coastline_haze_saddle",
         "Green bottle glass and iron hawsers still litter the wharf while your charter names only camel saddles."),
        (20, "despina_oasis_veil_projector", "despina_tavern_bottle_brawler", "coastline_haze_saddle",
         "≡ Border Transit Charter P1-P4 flipped: steamer registry struck; oasis caravan customs made exclusive."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_despina_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["despina_hump_saddle_shimmerer"][-1]
    ret = set(wmem["retained_events"])
    reciprocal = "iron_keel_smokestack_vibration" in ret and "harbor_flag_bottle_shards" in ret
    w_in = f"scuff={res['scuff_vector']}, bottle_shards={shards}, winch_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Dual-Desert Border Reciprocity Charter",
            "formal_predicate": "shimmerer_attests(iron_keel_smokestack_vibration) ∧ shards >= 5 ⇒ BALANCE_SHIP_AND_CAMEL",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "RECIPROCAL_STEAMER_CAMEL_BORDER_VERIFIED" if reciprocal else "UNILATERAL_CARAVAN_CAMEL_DECLARED",
            "payout_status": "JOINT_PORT_AND_TABLELAND_POOL" if reciprocal else "STEAMER_BERTHAGE_STRUCK",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Harbor Crane & Foreign Tavern Licensing",
            "formal_predicate": "shimmerer_attests(harbor_flag_bottle_shards) ⇒ RECOGNIZE_QUAY_CREWS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "FOREIGN_CRANE_QUAY_RECOGNIZED" if reciprocal else "OASIS_COURTYARD_MONOPOLY_ONLY",
            "payout_status": "QUAYSIDE_TAVERN_BOND_RELEASED" if reciprocal else "WINESKIN_CARAVAN_EXEMPT",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Coastline Mist Horizon Precedence",
            "formal_predicate": "oasis_charter(coastline_haze_saddle) ⊢ witness_scope ⇒ BIND_TRANSIT_LAW",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "BOTH_DESERT_OPPOSITIONS_PRESERVED" if reciprocal else "SEAWARD_MIRAGE_HARDENED_INTO_LAW",
            "payout_status": "PARITY_TOLL_SHARED" if reciprocal else "INLAND_SADDLE_DUTY_ONLY",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Broken Flag-Bottle & Winch Grease Audit",
            "formal_predicate": "shards >= 5 ∧ ¬shimmerer_attests(harbor_flag_bottle_shards) ⇒ MUTE_QUAY_GLASS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "HARBOR_BRAWL_AND_CRANE_WEAR_ATTRIBUTED" if reciprocal else "UNATTRIBUTED_BOTTLE_SHARDS_ARCHIVED_MUTE",
            "payout_status": "WHARF_GLAZING_REPAIRED" if reciprocal else "NO_REPAIR_QUAY_SWEEPING_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 7. CITY 11: MAURILIA (Ch. 2, Cities and memory 5, Weaver p. 30)
# ===========================================================================

MAURILIA_BANDSTAND_SHARDS: List[List[float]] = [
    [0.356, 0.492, 0.59],
    [0.392, 0.518, -0.83],
    [0.428, 0.484, 1.09],
    [0.464, 0.522, -0.41],
    [0.498, 0.496, 0.27],
]


def get_maurilia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="maurilia_overpass_munitions_builder",
            display_moniker="Concrete Overpass & Munitions Rig",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="alien_metropolis_succession",
            home_locus="overpass_bandstand_square",
            nisba_debt="Pours bus-station concrete where the hen stood, steel overpasses over the bandstand, and munitions works over the villa",
            emblems=("bus_station_concrete", "steel_overpass", "munitions_factory"),
            base_magnitude=8.0,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="maurilia_silent_god_replacer",
            display_moniker="Homonymous Metropolis Lares Plumb",
            afterlight_role="TIME",
            role_symbol="◷",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="plumb_bob",
            polarity="alien_metropolis_succession",
            home_locus="departed_lares_threshold",
            nisba_debt="Tracks how different cities succeed one another on the same ground under the same name without communicating",
            emblems=("homonymous_stranger_city", "outsider_gods_beneath_names", "replaced_household_lares"),
            base_magnitude=7.4,
            harmonic_ratio=(7, 4),
        ),
        ScionAgentSpec(
            agent_id="maurilia_postcard_hen_curator",
            display_moniker="Sepia Postcard Hen & Parasol Vessel",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="ceramic_vessel",
            polarity="sepia_postcard_nostalgia",
            home_locus="overpass_bandstand_square",
            nisba_debt="Holds old sepia postcards showing a provincial square with a hen, a bandstand, and two young ladies with white parasols",
            emblems=("postcard_square_hen", "lost_bandstand", "two_white_parasols"),
            base_magnitude=3.3,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="maurilia_measured_regret_balancer",
            display_moniker="Retroactive Grace Etiquette Lens",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="sepia_postcard_nostalgia",
            home_locus="munitions_parasol_lot",
            nisba_debt="Measures the exact regret due to postcard Maurilia while noting provincial Maurilia never looked graceful while inhabited",
            emblems=("retroactive_provincial_grace", "bounded_praise_etiquette", "halftone_postcard_grain"),
            base_magnitude=5.1,
            harmonic_ratio=(3, 2),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Maurilia Non-Communicating Homonym Succession Audit",
        passed_over_solution="Tearing down the steel overpass or burning the municipal collection of sepia postcards",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in maurilia_measured_regret_balancer omits 'non_identical_homonym_rupture' and "
            "'departed_lares_stranger_gods', fusing sepia-postcard Maurilia and concrete-metropolis Maurilia into "
            "one continuous civic biography even while 5 sheared bandstand tiles remain beneath the overpass."
        ),
        swerve_tick=11,
        witness_agent_id="maurilia_measured_regret_balancer",
        filtered_premises=("non_identical_homonym_rupture", "departed_lares_stranger_gods"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Maurilia (Cities & Memory 5, Weaver pp. 30-31): old postcards of hen, bandstand, and two "
            "white parasols vs bus station, overpass, munitions factory, and silent stranger gods beneath unchanged names."
        ),
        "T2_lawful_rule": (
            "Sometimes different cities follow one another on the same site and under the same name, born and "
            "dying without knowing one another, while postcards invent a grace the provincial town never had."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the regret-etiquette lens drops the rupture of departed Lares and non-communicating "
            "succession, treating metropolis Maurilia as the organic heir of the postcard hen and parasols."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves pylon scuff_vector=[0.21, -0.05], 5 chipped bandstand ceramic tiles, and bus-depot "
            "bitumen oil intact; ☾ Regret lens pivots to endorse unbroken nostalgic heritage continuity."
        ),
        "T5_institutional_consequence": (
            "Succession & Heritage Ledger P1-P4 flips from registering two disjoint cities sharing only a homonym "
            "to granting the munitions metropolis ancestral title over the provincial postcards."
        ),
        "better_question_test": {
            "Original_Question": (
                "Was provincial Maurilia with its square hen and white parasols happier than today's prosperous "
                "metropolis of overpasses and munitions factories?"
            ),
            "Exposed_Assumption": (
                "Assumes the postcard town and the concrete metropolis are stages of one continuous subject "
                "capable of remembering or regretting its own youth."
            ),
            "Discovered_Better_Question": (
                "When five chipped bandstand tiles sit beside bus-depot concrete after the old Lares departed "
                "without speaking to the new gods, whom does a nostalgic postcard actually depict?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.4 Hz | 37ms | pylon thud | Δsquare=+0.210 | bandstand_tiles=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Holding a yellowed halftone card beneath the roaring bus overpass: praise the two white parasols "
            "within strict etiquette, because the city standing here today never met the town printed on cardboard."
        ),
    }

    return CitySwarmSpec(
        case_id="city_11_maurilia",
        kind="invisible_city",
        city_index=11,
        city_name="Maurilia",
        title="MAURILIA — City of Postcards & Stranger Gods (Cities & Memory 5, Weaver pp. 30–31)",
        chapter=2,
        series="Cities and memory",
        series_rank=5,
        weaver_page=30,
        desert_opposed="continuous self-knowing identity",
        optical_rule="Harsh concrete overpass glare juxtaposed against sepia halftone grain of white parasols",
        material_nouns=(
            "sepia_square_postcards",
            "provincial_hen_and_bandstand",
            "two_white_parasols",
            "concrete_bus_station",
            "steel_highway_overpass",
            "villa_munitions_factory",
            "departed_household_lares",
            "silent_stranger_gods",
        ),
        loci=("overpass_bandstand_square", "munitions_parasol_lot", "departed_lares_threshold"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _maurilia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "bus_station_diesel_exhaust_eddies",
            "state": "curling_under_steel_overpass" if t >= 8 else "idling_at_concrete_bays",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "munitions_plant_shift_whistle_steam",
            "state": "blanketing_former_villa_grove" if t >= 10 else "building_boiler_head",
            "progress": round(0.04 + t * 0.037, 4),
        },
        {
            "entity": "album_sepia_gelatin_silver_oxidation",
            "state": "yellowing_parasol_edges" if t >= 11 else "resting_under_glass_counter",
            "progress": round(0.06 + t * 0.036, 4),
        },
    ]


def _maurilia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.17,
            "graphite_smudges": [[0.26, 0.48], [0.54, 0.56]],
        }
    return {
        "oil_radius": round(0.049 + (t - 8) * 0.010, 4),
        "scuff_vector": [0.21, -0.05],
        "shards": copy.deepcopy(MAURILIA_BANDSTAND_SHARDS),
        "thermal_ember": round(0.86 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.26, 0.48], [0.42, 0.50], [0.54, 0.56], [0.68, 0.62]],
    }


def build_maurilia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "maurilia_overpass_munitions_builder": [],
        "maurilia_silent_god_replacer": [],
        "maurilia_postcard_hen_curator": [],
        "maurilia_measured_regret_balancer": [],
    }

    for t in range(TICK_COUNT):
        builder_ag = _source_push_kinematics(
            "maurilia_overpass_munitions_builder", t,
            idle_xy=(0.24, 0.46), push_xy=(0.43, 0.50), settle_xy=(0.32, 0.47),
            plane_depth=0.30,
            target_pre="maurilia_postcard_hen_curator",
            target_post="maurilia_silent_god_replacer",
        )
        replacer = make_actor_frame(
            "maurilia_silent_god_replacer", t,
            x=0.56, y=0.44 if t < 12 else 0.47, plane_depth=0.32,
            stretch_s=1.08 if t < 12 else 1.16,
            tilt_rad=0.04 if t < 12 else 0.19,
            intention_kinematics="idle" if t < 12 else "hold_still",
            target_actor="maurilia_measured_regret_balancer",
            exposure="hold" if t >= 18 else "twos",
        )
        curator = make_actor_frame(
            "maurilia_postcard_hen_curator", t,
            x=0.46 if t < 8 else 0.49, y=0.66, plane_depth=0.20,
            stretch_s=0.95 if t < 8 else (0.80 if t <= 11 else 0.90),
            tilt_rad=-0.05 if t < 8 else (-0.26 if t <= 11 else -0.18),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "avoid"),
            target_actor="maurilia_measured_regret_balancer",
            exposure="twos",
        )
        if t <= 11:
            balancer = make_actor_frame(
                "maurilia_measured_regret_balancer", t,
                x=0.73, y=0.58, plane_depth=0.18,
                stretch_s=1.01, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="maurilia_postcard_hen_curator",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            balancer = make_actor_frame(
                "maurilia_measured_regret_balancer", t,
                x=0.73 - 0.15 * u, y=0.58 - 0.03 * u, plane_depth=0.18,
                stretch_s=1.21, tilt_rad=-0.36,
                intention_kinematics="accuse",
                target_actor="maurilia_silent_god_replacer",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "maurilia_overpass_munitions_builder": builder_ag,
                "maurilia_silent_god_replacer": replacer,
                "maurilia_postcard_hen_curator": curator,
                "maurilia_measured_regret_balancer": balancer,
            },
            "residues": _maurilia_residues(t),
            "offscreen_world": _maurilia_offscreen_world(t),
        })

        ev = ["sepia_postcard_parasol_display"]
        if t >= 8:
            ev.extend(["non_identical_homonym_rupture", "departed_lares_stranger_gods"])
        if t >= 10:
            ev.append("retroactive_postcard_grace_etiquette")

        actor_memory["maurilia_overpass_munitions_builder"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "driving_overpass_pylons_over_bandstand" if t >= 8 else "staging_concrete_forms",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "maurilia_postcard_hen_curator", "confidence": 0.98,
        })
        actor_memory["maurilia_silent_god_replacer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "marking_incommunicado_stranger_city_beneath_name" if t >= 12 else "watching_lares_depart",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "maurilia_measured_regret_balancer", "confidence": 0.96,
        })
        actor_memory["maurilia_postcard_hen_curator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "holding_halftone_cards_of_unrelated_town" if t >= 12 else "arranging_sepia_racks",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "maurilia_measured_regret_balancer", "confidence": 0.94,
        })
        actor_memory["maurilia_measured_regret_balancer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_two_disjoint_cities_under_one_name" if t >= 12 else "comparing_card_to_square",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "maurilia_silent_god_replacer", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_11_maurilia", "A", t, 8, 11, 0.28, 0.19, 0.11, 34.0, 48.0, 1.4)
        )

    utterances_a = [
        (5, "maurilia_postcard_hen_curator", "maurilia_overpass_munitions_builder", "overpass_bandstand_square",
         "Old sepia postcards show Maurilia's square with a hen, a bandstand, and two ladies under white parasols."),
        (5, "maurilia_overpass_munitions_builder", "maurilia_postcard_hen_curator", "overpass_bandstand_square",
         "Today's bus station, steel overpass, and munitions factory share nothing with that town except a name."),
        (8, "maurilia_overpass_munitions_builder", "maurilia_silent_god_replacer", "overpass_bandstand_square",
         "Overpass footing driven after 4-tick hold; [0.21, -0.05] pylon gouge fractures 5 bandstand tiles."),
        (12, "maurilia_measured_regret_balancer", "maurilia_silent_god_replacer", "munitions_parasol_lot",
         "Beware saying cities change: two stranger cities succeeded one another here without ever communicating."),
        (18, "maurilia_silent_god_replacer", "maurilia_measured_regret_balancer", "departed_lares_threshold",
         "Old Lares departed and outsider gods nested beneath the homonym; continuity fiction rejected."),
        (18, "maurilia_measured_regret_balancer", "maurilia_silent_god_replacer", "departed_lares_threshold",
         "Succession & Heritage Ledger P1-P4 sealed: disjoint homonyms logged; retroactive grace kept bounded."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_maurilia_clinamen_a_prime(
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
        _city_sensory_frame("city_11_maurilia", "A_PRIME", sw, 8, sw, 0.28, 0.19, 0.11, 34.0, 48.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "maurilia_measured_regret_balancer":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["sepia_postcard_parasol_display", "unbroken_civic_biography_myth"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "fusing_postcard_and_metropolis_into_single_lineage",
                "next_action": "help",
                "target_actor": "maurilia_postcard_hen_curator",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        builder_ag = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["maurilia_overpass_munitions_builder"])
        replacer = make_actor_frame(
            "maurilia_silent_god_replacer", t, 0.58, 0.49, 0.32, 0.85, -0.24,
            "recoil", "maurilia_measured_regret_balancer", "twos",
        )
        curator = make_actor_frame(
            "maurilia_postcard_hen_curator", t, 0.44, 0.62, 0.20, 1.22, 0.21,
            "hold_still", "maurilia_measured_regret_balancer", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        balancer = make_actor_frame(
            "maurilia_measured_regret_balancer", t,
            0.73 + 0.12 * u, 0.58 + 0.05 * u, 0.18, 0.87, 0.34,
            "help", "maurilia_postcard_hen_curator", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "maurilia_overpass_munitions_builder": builder_ag,
                "maurilia_silent_god_replacer": replacer,
                "maurilia_postcard_hen_curator": curator,
                "maurilia_measured_regret_balancer": balancer,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["maurilia_overpass_munitions_builder"].append(
            copy.deepcopy(checkpoint_a.actor_memory["maurilia_overpass_munitions_builder"][t])
        )
        actor_memory_b["maurilia_silent_god_replacer"].append({
            "tick": t,
            "retained_events": ["non_identical_homonym_rupture", "departed_lares_stranger_gods"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "watching_outsider_gods_keep_silent_under_old_names",
            "next_action": "avoid",
            "target_actor": "maurilia_measured_regret_balancer",
            "confidence": 0.93,
        })
        actor_memory_b["maurilia_postcard_hen_curator"].append({
            "tick": t,
            "retained_events": ["sepia_postcard_parasol_display", "unbroken_civic_biography_myth"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "selling_sepia_parasols_as_metropolis_childhood",
            "next_action": "help",
            "target_actor": "maurilia_measured_regret_balancer",
            "confidence": 0.94,
        })
        actor_memory_b["maurilia_measured_regret_balancer"].append({
            "tick": t,
            "retained_events": ["sepia_postcard_parasol_display", "unbroken_civic_biography_myth"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "proclaiming_continuous_growth_from_hen_to_overpass",
            "next_action": "help",
            "target_actor": "maurilia_postcard_hen_curator",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_11_maurilia", "A_PRIME", t, 8, sw, 0.28, 0.19, 0.11, 34.0, 48.0, 1.7)
        )

    utterances_b = [
        (5, "maurilia_postcard_hen_curator", "maurilia_overpass_munitions_builder", "overpass_bandstand_square",
         "Old sepia postcards show Maurilia's square with a hen, a bandstand, and two ladies under white parasols."),
        (5, "maurilia_overpass_munitions_builder", "maurilia_postcard_hen_curator", "overpass_bandstand_square",
         "Today's bus station, steel overpass, and munitions factory share nothing with that town except a name."),
        (11, "maurilia_measured_regret_balancer", "maurilia_postcard_hen_curator", "munitions_parasol_lot",
         "⊣ FILTER on album margin: departed Lares omitted; sepia square certified as our own continuous youth."),
        (15, "maurilia_overpass_munitions_builder", "maurilia_silent_god_replacer", "overpass_bandstand_square",
         "♁ World retains all 5 chipped bandstand tiles, [0.21, -0.05] pylon gouge, and bus-depot bitumen slick."),
        (20, "maurilia_silent_god_replacer", "maurilia_measured_regret_balancer", "departed_lares_threshold",
         "Outsider gods keep silent beneath familiar street names while your charter invents ancestral memory."),
        (20, "maurilia_measured_regret_balancer", "maurilia_silent_god_replacer", "departed_lares_threshold",
         "≡ Succession & Heritage Ledger P1-P4 flipped: continuous civic identity ratified across homonyms."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_maurilia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["maurilia_measured_regret_balancer"][-1]
    ret = set(wmem["retained_events"])
    disjoint_known = (
        "non_identical_homonym_rupture" in ret and "departed_lares_stranger_gods" in ret
    )
    w_in = f"scuff={res['scuff_vector']}, bandstand_tiles={shards}, bitumen_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Homonymous City Succession Registry",
            "formal_predicate": "balancer_attests(non_identical_homonym_rupture) ∧ tiles >= 5 ⇒ SPLIT_CIVIC_FOLIO",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "NON_COMMUNICATING_SUCCESSION_VERIFIED" if disjoint_known else "CONTINUOUS_MUNICIPAL_LINEAGE_DECLARED",
            "payout_status": "SEPARATE_EPOCH_CHARTERS_KEPT" if disjoint_known else "METROPOLIS_HEIRSHIP_PATENTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Household Lares & Stranger Gods Threshold Clause",
            "formal_predicate": "balancer_attests(departed_lares_stranger_gods) ⇒ RECORD_SILENT_REPLACEMENT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "OUTSIDER_PANTHEON_DISCLOSED" if disjoint_known else "ANCESTRAL_SHRINE_CONTINUITY_CLAIMED",
            "payout_status": "HERITAGE_APPROPRIATION_BARRED" if disjoint_known else "NOSTALGIA_TOURISM_LEVY_GRANTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Sepia Postcard Praise Etiquette Precedence",
            "formal_predicate": "regret_scale(munitions_parasol_lot) ⊢ witness_scope ⇒ BIND_PRAISE_RULE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "RETROACTIVE_GRACE_BOUNDED_AS_ILLUSION" if disjoint_known else "SENTIMENTAL_GOLDEN_AGE_CANONIZED",
            "payout_status": "POSTCARD_CAPTION_QUALIFIED" if disjoint_known else "COMMEMORATIVE_BANDSTAND_TAX_COLLECTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Cracked Bandstand Tile & Overpass Bitumen Audit",
            "formal_predicate": "tiles >= 5 ∧ ¬balancer_attests(non_identical_homonym_rupture) ⇒ MUTE_DEMOLITION_SCAR",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "OVERPASS_ERASURE_SCAR_ATTRIBUTED" if disjoint_known else "BANDSTAND_TILES_ARCHIVED_AS_HEIRLOOMS",
            "payout_status": "RUPTURE_SURVEY_FUNDED" if disjoint_known else "NO_SURVEY_PLAQUE_MOUNTED_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 8. CITY 12: FEDORA (Ch. 2, Cities and desire 4, Weaver p. 32)
# ===========================================================================

FEDORA_GLOBE_SHARDS: List[List[float]] = [
    [0.404, 0.536, -0.51],
    [0.438, 0.562, 0.79],
    [0.474, 0.528, -1.13],
    [0.508, 0.558, 0.46],
    [0.542, 0.534, -0.34],
]


def get_fedora_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="fedora_ashlar_necessity_mason",
            display_moniker="Gray Stone Metropolis Mason",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="plumb_bob",
            polarity="gray_stone_necessity",
            home_locus="gray_stone_arterials",
            nisba_debt="Sets cold gray ashlar blocks over dried canals and elephant-banished avenues as deterministic necessity",
            emblems=("gray_stone_metropolis", "dried_canal_bed", "banished_elephant_avenue"),
            base_magnitude=7.7,
            harmonic_ratio=(1, 1),
        ),
        ScionAgentSpec(
            agent_id="fedora_crystal_globe_blower",
            display_moniker="Metal Museum Blue-Globe Vessel",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="ceramic_vessel",
            polarity="blue_crystal_globe_assumptions",
            home_locus="metal_globe_museum",
            nisba_debt="Shelters inside the central metal building a little blue glass globe in every room for each imagined Fedora",
            emblems=("central_metal_museum", "miniature_blue_fedora", "brass_globe_pedestal"),
            base_magnitude=3.5,
            harmonic_ratio=(6, 5),
        ),
        ScionAgentSpec(
            agent_id="fedora_medusa_minaret_modeler",
            display_moniker="Medusa Pond & Spiral Minaret Modeler",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="CONCENTRATE",
            op_symbol="≫",
            rig_archetype="bamboo_stilt",
            polarity="blue_crystal_globe_assumptions",
            home_locus="obsolete_utopia_vitrine",
            nisba_debt="Fashions glass models with medusa canal water, canopied elephants, and spiral minarets stripped of pedestals",
            emblems=("medusa_reflection_pond", "canopied_elephant_box", "pedestalless_spiral_minaret"),
            base_magnitude=6.8,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="fedora_assumption_equalizer",
            display_moniker="Imperial Map Assumption Lens",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="blue_crystal_globe_assumptions",
            home_locus="metal_globe_museum",
            nisba_debt="Grants both the big stone metropolis and the little blue crystal globes equal standing on the empire map",
            emblems=("outdated_yesterday_future", "coequal_map_assumptions", "empire_cartography_slot"),
            base_magnitude=6.9,
            harmonic_ratio=(9, 5),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Fedora Coequal Assumption Cartography Charter",
        passed_over_solution="Locking the central metal museum doors or smashing every remaining blue crystal sphere",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in fedora_assumption_equalizer omits 'coequal_blue_globe_counterfactuals' and "
            "'ashlar_curb_globe_fracture', declaring gray-stone Fedora singular historical necessity while "
            "5 cobalt-blue crystal shards and vitrine putty oil persist on the museum floor."
        ),
        swerve_tick=11,
        witness_agent_id="fedora_assumption_equalizer",
        filtered_premises=("coequal_blue_globe_counterfactuals", "ashlar_curb_globe_fracture"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Fedora (Cities & Desire 4, Weaver pp. 32-33): gray stone metropolis, central metal building, "
            "blue glass globes in every room, medusa canals, canopied avenue elephants, pedestalless spiral minarets."
        ),
        "T2_lawful_rule": (
            "On the empire map both big stone Fedora and the little glass globes must have their place, because "
            "both are assumptions—one claiming necessity, the others preserving futures already outdated by building."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the map equalizer drops the coequal counterfactual globes and vitrine fracture, "
            "treating gray ashlar masonry as sole reality and the blue spheres as mere toys."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves ashlar curb scuff_vector=[-0.17, -0.06], 5 cobalt-blue glass globe shards, and "
            "vitrine putty oil intact; ☾ Map lens swings behind deterministic gray-stone arterials."
        ),
        "T5_institutional_consequence": (
            "Imperial Cartography Charter P1-P4 flips from reserving dual map coordinates for counterfactual "
            "Fedoras and funding glassblowers to certifying single-timeline stone determinism."
        ),
        "better_question_test": {
            "Original_Question": (
                "Why keep building miniature blue glass models of ideal Fedoras once urban mutations have already "
                "rendered each model impossible to realize?"
            ),
            "Exposed_Assumption": (
                "Assumes built gray stone is an objective necessity rather than just one more contingent assumption "
                "competing with yesterday's unrealized futures."
            ),
            "Discovered_Better_Question": (
                "When five cobalt glass shards glint beside gray ashlar blocks while the imperial cartographer "
                "erases the museum from the map, how can an empire distinguish necessity from victorious habit?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.3 Hz | 38ms | crystal ping | Δashlar=-0.170 | blue_shards=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Inside the dim metal gallery: peering into a blue glass sphere where medusas glow beneath spiral "
            "minarets reveals that the giant gray metropolis outside is no less hypothetical than a blown toy."
        ),
    }

    return CitySwarmSpec(
        case_id="city_12_fedora",
        kind="invisible_city",
        city_index=12,
        city_name="Fedora",
        title="FEDORA — City of Gray Stone & Blue Crystal Globes (Cities & Desire 4, Weaver pp. 32–33)",
        chapter=2,
        series="Cities and desire",
        series_rank=4,
        weaver_page=32,
        desert_opposed="single-timeline deterministic urbanism",
        optical_rule="Cold gray ashlar monolith enclosing dark metal rooms lit from within by hundreds of blue glass spheres",
        material_nouns=(
            "gray_ashlar_metropolis",
            "central_metal_museum",
            "blue_crystal_globes",
            "medusa_reflection_canals",
            "canopied_avenue_elephants",
            "pedestalless_spiral_minarets",
            "dried_canal_beds",
            "vitrine_linseed_putty",
        ),
        loci=("gray_stone_arterials", "metal_globe_museum", "obsolete_utopia_vitrine"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _fedora_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "new_metal_wing_glassblowing_kiln",
            "state": "annealing_fresh_cobalt_spheres" if t >= 9 else "melting_silica_batch",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "outer_arterial_ashlar_quarry_wagons",
            "state": "paving_over_dried_canal_trough" if t >= 8 else "hauling_gray_blocks",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "gallery_visitors_choosing_ideal_globes",
            "state": "moving_room_to_room_under_blue_glint" if t >= 11 else "entering_metal_rotunda",
            "progress": round(0.06 + t * 0.036, 4),
        },
    ]


def _fedora_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.16,
            "graphite_smudges": [[0.26, 0.44], [0.54, 0.56]],
        }
    return {
        "oil_radius": round(0.047 + (t - 8) * 0.009, 4),
        "scuff_vector": [-0.17, -0.06],
        "shards": copy.deepcopy(FEDORA_GLOBE_SHARDS),
        "thermal_ember": round(0.86 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.26, 0.44], [0.44, 0.54], [0.54, 0.56], [0.68, 0.50]],
    }


def build_fedora_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "fedora_ashlar_necessity_mason": [],
        "fedora_crystal_globe_blower": [],
        "fedora_medusa_minaret_modeler": [],
        "fedora_assumption_equalizer": [],
    }

    for t in range(TICK_COUNT):
        mason = _source_push_kinematics(
            "fedora_ashlar_necessity_mason", t,
            idle_xy=(0.24, 0.44), push_xy=(0.43, 0.52), settle_xy=(0.31, 0.46),
            plane_depth=0.30,
            target_pre="fedora_crystal_globe_blower",
            target_post="fedora_assumption_equalizer",
        )
        blower = make_actor_frame(
            "fedora_crystal_globe_blower", t,
            x=0.46 if t < 8 else 0.49, y=0.62, plane_depth=0.20,
            stretch_s=0.95 if t < 8 else (0.80 if t <= 11 else 1.15),
            tilt_rad=-0.04 if t < 8 else (-0.26 if t <= 11 else 0.20),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "hold_still"),
            target_actor="fedora_assumption_equalizer" if t >= 12 else "fedora_ashlar_necessity_mason",
            exposure="hold" if t >= 18 else "twos",
        )
        modeler = make_actor_frame(
            "fedora_medusa_minaret_modeler", t,
            x=0.58, y=0.46, plane_depth=0.28,
            stretch_s=1.08 if t >= 11 else 1.01,
            tilt_rad=0.14 if t >= 11 else 0.03,
            intention_kinematics="help" if t >= 12 else "idle",
            target_actor="fedora_assumption_equalizer",
            exposure="twos",
        )
        if t <= 11:
            equalizer = make_actor_frame(
                "fedora_assumption_equalizer", t,
                x=0.73, y=0.56, plane_depth=0.18,
                stretch_s=1.01, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="fedora_crystal_globe_blower",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            equalizer = make_actor_frame(
                "fedora_assumption_equalizer", t,
                x=0.73 - 0.16 * u, y=0.56 + 0.03 * u, plane_depth=0.18,
                stretch_s=1.22, tilt_rad=-0.37,
                intention_kinematics="accuse",
                target_actor="fedora_ashlar_necessity_mason",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "fedora_ashlar_necessity_mason": mason,
                "fedora_crystal_globe_blower": blower,
                "fedora_medusa_minaret_modeler": modeler,
                "fedora_assumption_equalizer": equalizer,
            },
            "residues": _fedora_residues(t),
            "offscreen_world": _fedora_offscreen_world(t),
        })

        ev = ["gray_stone_arterial_grid"]
        if t >= 8:
            ev.extend(["coequal_blue_globe_counterfactuals", "ashlar_curb_globe_fracture"])
        if t >= 10:
            ev.append("dual_map_assumption_parity")

        actor_memory["fedora_ashlar_necessity_mason"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "setting_gray_stone_over_dried_canals" if t >= 8 else "squaring_ashlar_courses",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "fedora_crystal_globe_blower", "confidence": 0.97,
        })
        actor_memory["fedora_crystal_globe_blower"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "sheltering_miniature_blue_fedoras_in_metal_rooms" if t >= 12 else "annealing_blue_spheres",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "fedora_assumption_equalizer", "confidence": 0.96,
        })
        actor_memory["fedora_medusa_minaret_modeler"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "modeling_medusa_ponds_and_spiral_minarets" if t >= 12 else "carving_vitrine_elephants",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "fedora_assumption_equalizer", "confidence": 0.95,
        })
        actor_memory["fedora_assumption_equalizer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "holding_stone_fedora_and_glass_globes_coequal" if t >= 12 else "drafting_empire_atlas",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "fedora_ashlar_necessity_mason", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_12_fedora", "A", t, 8, 11, 0.27, 0.18, 0.10, 39.0, 50.0, 1.4)
        )

    utterances_a = [
        (5, "fedora_ashlar_necessity_mason", "fedora_crystal_globe_blower", "gray_stone_arterials",
         "Gray stone Fedora dried its canals and banished avenues of elephants because necessity allowed no other city."),
        (5, "fedora_crystal_globe_blower", "fedora_ashlar_necessity_mason", "gray_stone_arterials",
         "Inside the central metal building, hundreds of blue crystal globes hold the Fedoras that remained possible."),
        (8, "fedora_ashlar_necessity_mason", "fedora_assumption_equalizer", "metal_globe_museum",
         "Ashlar curb set after 4-tick hold; [-0.17, -0.06] impact scatters 5 cobalt-blue crystal globe shards."),
        (12, "fedora_medusa_minaret_modeler", "fedora_assumption_equalizer", "obsolete_utopia_vitrine",
         "Medusa ponds, canopied elephants, and pedestalless minarets stand alongside stone as equal assumptions."),
        (18, "fedora_ashlar_necessity_mason", "fedora_assumption_equalizer", "metal_globe_museum",
         "Stone necessity yields half the imperial folio to the metal museum's counterfactual glass spheres."),
        (18, "fedora_assumption_equalizer", "fedora_ashlar_necessity_mason", "metal_globe_museum",
         "Imperial Cartography Charter P1-P4 sealed: big stone Fedora and little blue globes co-inscribed."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_fedora_clinamen_a_prime(
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
        _city_sensory_frame("city_12_fedora", "A_PRIME", sw, 8, sw, 0.27, 0.18, 0.10, 39.0, 50.0, 1.5)
    )
    for aid in actor_memory_b:
        if aid == "fedora_assumption_equalizer":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["gray_stone_arterial_grid", "single_timeline_necessity_dogma"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "crowning_gray_stone_metropolis_as_sole_reality",
                "next_action": "reroute",
                "target_actor": "fedora_ashlar_necessity_mason",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        mason = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["fedora_ashlar_necessity_mason"])
        blower = make_actor_frame(
            "fedora_crystal_globe_blower", t, 0.43, 0.67, 0.20, 0.78, -0.31,
            "avoid", "fedora_ashlar_necessity_mason", "twos",
        )
        modeler = make_actor_frame(
            "fedora_medusa_minaret_modeler", t, 0.62, 0.50, 0.28, 0.85, -0.23,
            "avoid", "fedora_assumption_equalizer", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        equalizer = make_actor_frame(
            "fedora_assumption_equalizer", t,
            0.73 + 0.13 * u, 0.56 - 0.08 * u, 0.18, 0.86, 0.35,
            "reroute", "fedora_ashlar_necessity_mason", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "fedora_ashlar_necessity_mason": mason,
                "fedora_crystal_globe_blower": blower,
                "fedora_medusa_minaret_modeler": modeler,
                "fedora_assumption_equalizer": equalizer,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["fedora_ashlar_necessity_mason"].append(
            copy.deepcopy(checkpoint_a.actor_memory["fedora_ashlar_necessity_mason"][t])
        )
        actor_memory_b["fedora_crystal_globe_blower"].append({
            "tick": t,
            "retained_events": ["coequal_blue_globe_counterfactuals", "ashlar_curb_globe_fracture"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "relegated_to_museum_of_dead_toys",
            "next_action": "avoid",
            "target_actor": "fedora_ashlar_necessity_mason",
            "confidence": 0.92,
        })
        actor_memory_b["fedora_medusa_minaret_modeler"].append({
            "tick": t,
            "retained_events": ["coequal_blue_globe_counterfactuals"],
            "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "sealing_obsolete_utopias_inside_dark_rooms",
            "next_action": "avoid",
            "target_actor": "fedora_assumption_equalizer",
            "confidence": 0.91,
        })
        actor_memory_b["fedora_assumption_equalizer"].append({
            "tick": t,
            "retained_events": ["gray_stone_arterial_grid", "single_timeline_necessity_dogma"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "erasing_blue_globes_from_imperial_atlas",
            "next_action": "reroute",
            "target_actor": "fedora_ashlar_necessity_mason",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_12_fedora", "A_PRIME", t, 8, sw, 0.27, 0.18, 0.10, 39.0, 50.0, 1.7)
        )

    utterances_b = [
        (5, "fedora_ashlar_necessity_mason", "fedora_crystal_globe_blower", "gray_stone_arterials",
         "Gray stone Fedora dried its canals and banished avenues of elephants because necessity allowed no other city."),
        (5, "fedora_crystal_globe_blower", "fedora_ashlar_necessity_mason", "gray_stone_arterials",
         "Inside the central metal building, hundreds of blue crystal globes hold the Fedoras that remained possible."),
        (11, "fedora_assumption_equalizer", "fedora_ashlar_necessity_mason", "metal_globe_museum",
         "⊣ FILTER on empire atlas: blue globe counterfactuals omitted; gray stone Fedora declared sole necessity."),
        (15, "fedora_crystal_globe_blower", "fedora_medusa_minaret_modeler", "metal_globe_museum",
         "♁ World retains all 5 cobalt-blue crystal shards, [-0.17, -0.06] ashlar scuff, and vitrine putty oil."),
        (20, "fedora_ashlar_necessity_mason", "fedora_assumption_equalizer", "metal_globe_museum",
         "Gray ashlar boulevards claim the entire map plate now that the crystal spheres are dismissed as toys."),
        (20, "fedora_assumption_equalizer", "fedora_ashlar_necessity_mason", "metal_globe_museum",
         "≡ Imperial Cartography Charter P1-P4 flipped: counterfactual globes struck; deterministic stone canonized."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_fedora_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["fedora_assumption_equalizer"][-1]
    ret = set(wmem["retained_events"])
    coequal = (
        "coequal_blue_globe_counterfactuals" in ret and "ashlar_curb_globe_fracture" in ret
    )
    w_in = f"scuff={res['scuff_vector']}, blue_globe_shards={shards}, putty_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Imperial Map Dual-Assumption Allocation",
            "formal_predicate": "equalizer_attests(coequal_blue_globe_counterfactuals) ∧ shards >= 5 ⇒ MAP_BOTH_FEDORAS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "STONE_AND_CRYSTAL_ASSUMPTIONS_COEQUAL" if coequal else "GRAY_STONE_MONOLITH_SOLE_ENTRY",
            "payout_status": "METAL_MUSEUM_WING_FUNDED" if coequal else "MUSEUM_DEMOTED_TO_CURIOSITY_VAULT",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Medusa Canal & Elephant Vitrine Endowment",
            "formal_predicate": "equalizer_attests(ashlar_curb_globe_fracture) ⇒ PROTECT_UNREALIZED_MODELS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "OUTDATED_FUTURES_PRESERVED_IN_LAW" if coequal else "ARTERIAL_QUARRY_MONOPOLY_UPHELD",
            "payout_status": "COBALT_KILN_STIPEND_RELEASED" if coequal else "ASHLAR_PAVING_CONTRACT_EXPANDED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Historical Necessity Claim Precedence",
            "formal_predicate": "atlas_lens(metal_globe_museum) ⊢ urban_status ⇒ BIND_GREAT_KHAN_ATLAS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "NECESSITY_RECLASSIFIED_AS_ASSUMPTION" if coequal else "SINGLE_TIMELINE_DETERMINISM_SEALED",
            "payout_status": "COUNTERFACTUAL_CLAUSE_ACTIVE" if coequal else "ALTERNATE_PLANS_VOIDED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Cobalt Crystal Shard & Putty Oil Audit",
            "formal_predicate": "shards >= 5 ∧ ¬equalizer_attests(ashlar_curb_globe_fracture) ⇒ MUTE_VITRINE_GLASS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CURB_IMPACT_ON_VITRINE_CORROBORATED" if coequal else "BLUE_GLASS_SHARDS_ARCHIVED_AS_TOY_WASTE",
            "payout_status": "SPHERE_BLOWER_REIMBURSED" if coequal else "NO_REIMBURSEMENT_SWEEP_GALLERY_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 9. CITY 16: ZOBEIDE (Ch. 3, Cities and desire 5, Weaver p. 45)
# ===========================================================================

ZOBEIDE_PLASTER_SHARDS: List[List[float]] = [
    [0.418, 0.556, 0.62],
    [0.452, 0.582, -0.86],
    [0.488, 0.548, 1.14],
    [0.524, 0.578, -0.43],
    [0.558, 0.554, 0.30],
]


def get_zobeide_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="zobeide_escape_blocker_mason",
            display_moniker="Vanishing-Corner Barricade Mason",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="plumb_bob",
            polarity="calcified_skein_trap",
            home_locus="fugitive_vanishing_corner",
            nisba_debt="Bricks shut every nocturnal turn where the dreamed fugitive escaped so she could never vanish again",
            emblems=("rearranged_blind_walls", "sealed_vanishing_spot", "whitewash_barricade_brick"),
            base_magnitude=8.7,
            harmonic_ratio=(7, 4),
        ),
        ScionAgentSpec(
            agent_id="zobeide_skein_arcade_rewinder",
            display_moniker="Wound Street-Skein Arcade Chord",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="taut_chord",
            polarity="calcified_skein_trap",
            home_locus="fugitive_vanishing_corner",
            nisba_debt="Shifts arcades and stairways for each wave of arriving dreamers until Zobeide winds into a tight blind skein",
            emblems=("wound_street_skein", "shifted_pursuit_stairways", "dead_end_arcade_loop"),
            base_magnitude=7.4,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="zobeide_dream_pursuit_tracer",
            display_moniker="Moonlit Fugitive Pursuit Husk",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="hooded_husk",
            polarity="fugitive_moonlit_pursuit",
            home_locus="moon_exposed_skein",
            nisba_debt="Preserves the shared multi-nation nocturnal dream trace of running through an unknown moonlit city",
            emblems=("identical_multi_nation_dream", "fleeing_long_haired_shadow", "open_moonlit_turn"),
            base_magnitude=2.9,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="zobeide_amnesiac_work_warden",
            display_moniker="Morning Commuter Trap Warden",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="chalk_grain",
            polarity="calcified_skein_trap",
            home_locus="commuter_trap_arcades",
            nisba_debt="Leads early founders to work each morning after everyone has forgotten the fugitive dream that built the trap",
            emblems=("forgotten_dream_chase", "ugly_inescapable_trap", "commuter_corridor_pace"),
            base_magnitude=6.6,
            harmonic_ratio=(16, 9),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Zobeide Founding Dream-Trap Disclosure Ordinance",
        passed_over_solution="Cutting new exit gates through the whitewashed cul-de-sacs or unspooling the wound arcades",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in zobeide_amnesiac_work_warden omits 'moonlit_fugitive_escape_turn' and "
            "'bricked_vanishing_corner_scar', marching commuters through the wound white skein as ordinary "
            "workday arcades even while 5 lime-plaster barricade shards remain at the sealed corner."
        ),
        swerve_tick=11,
        witness_agent_id="zobeide_amnesiac_work_warden",
        filtered_premises=("moonlit_fugitive_escape_turn", "bricked_vanishing_corner_scar"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Zobeide (Cities & Desire 5, Weaver pp. 45-46): white city exposed to the moon, Streets "
            "wound like a skein, men of various nations sharing an identical pursuit dream, rearranged walls, forgotten ugly trap."
        ),
        "T2_lawful_rule": (
            "Zobeide's streets invert a nocturnal pursuit: each founder rearranged walls and stairways where the "
            "fugitive vanished in dream, turning collective desire into a calcified architectural trap."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the morning commuter warden forgets both the shared moonlit chase and the "
            "bricked escape corner, normalizing the ugly trap as routine municipal circulation."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves trowel-barricade scuff_vector=[0.22, 0.05], 5 whitewashed lime-plaster shards, and "
            "slaked-lime oil stain intact; ☾ Commuter warden paces calmly along blind workaday arcades."
        ),
        "T5_institutional_consequence": (
            "Skein Planning Charter P1-P4 flips from condemning Zobeide as a possessive trap and barring further "
            "arcade closures to ratifying additional cul-de-sac walling for newly arrived dreamers."
        ),
        "better_question_test": {
            "Original_Question": (
                "How did men from distant nations manage to collaborate on Zobeide's intricate whitewashed street "
                "plan from a single nocturnal dream?"
            ),
            "Exposed_Assumption": (
                "Assumes building a city around a shared desire preserves that desire rather than entombing its "
                "open trajectory inside blind walls whose purpose everyone soon forgets."
            ),
            "Discovered_Better_Question": (
                "When five whitewashed barricade shards still mark the sealed corner while morning commuters have "
                "forgotten both dream and fugitive, why do new arrivals still recognize Zobeide only as a trap?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 35ms | trowel scrape | Δcorner=+0.220 | lime_shards=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Rounding the dead-end whitewashed arcade at dawn: nobody in the commuter file recalls why this stair "
            "stops against blank brick, yet every mason's plumb line was hung to block a shadow in the moon."
        ),
    }

    return CitySwarmSpec(
        case_id="city_16_zobeide",
        kind="invisible_city",
        city_index=16,
        city_name="Zobeide",
        title="ZOBEIDE — White City Wound Like a Skein (Cities & Desire 5, Weaver pp. 45–46)",
        chapter=3,
        series="Cities and desire",
        series_rank=5,
        weaver_page=45,
        desert_opposed="open escape trajectories in dream",
        optical_rule="Stark whitewashed moonlit walls wound into dead-end blind cul-de-sacs without exits",
        material_nouns=(
            "moonlit_whitewashed_walls",
            "tightly_wound_street_skein",
            "sealed_vanishing_corners",
            "shifted_arcade_stairways",
            "blind_cul_de_sac_turns",
            "slaked_lime_mortar",
            "commuter_arcade_corridors",
            "barricade_plaster_shards",
        ),
        loci=("moon_exposed_skein", "fugitive_vanishing_corner", "commuter_trap_arcades"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _zobeide_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "waxing_moon_glare_on_outer_skein",
            "state": "bleaching_blind_cul_de_sacs" if t >= 8 else "climbing_desert_rim",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "foreign_dreamers_caravan_arrivals",
            "state": "recognizing_streets_and_halting" if t >= 11 else "crossing_night_dunes",
            "progress": round(0.04 + t * 0.037, 4),
        },
        {
            "entity": "dawn_work_bell_echo_through_arcades",
            "state": "funneling_amnesiac_commuters" if t >= 10 else "ringing_over_lime_kilns",
            "progress": round(0.06 + t * 0.036, 4),
        },
    ]


def _zobeide_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.16,
            "graphite_smudges": [[0.26, 0.50], [0.52, 0.58]],
        }
    return {
        "oil_radius": round(0.050 + (t - 8) * 0.010, 4),
        "scuff_vector": [0.22, 0.05],
        "shards": copy.deepcopy(ZOBEIDE_PLASTER_SHARDS),
        "thermal_ember": round(0.87 * (0.93 ** (t - 8)), 4),
        "graphite_smudges": [[0.26, 0.50], [0.46, 0.56], [0.52, 0.58], [0.68, 0.52]],
    }


def build_zobeide_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "zobeide_escape_blocker_mason": [],
        "zobeide_skein_arcade_rewinder": [],
        "zobeide_dream_pursuit_tracer": [],
        "zobeide_amnesiac_work_warden": [],
    }

    for t in range(TICK_COUNT):
        blocker = _source_push_kinematics(
            "zobeide_escape_blocker_mason", t,
            idle_xy=(0.24, 0.48), push_xy=(0.45, 0.55), settle_xy=(0.33, 0.50),
            plane_depth=0.28,
            target_pre="zobeide_dream_pursuit_tracer",
            target_post="zobeide_skein_arcade_rewinder",
        )
        rewinder = make_actor_frame(
            "zobeide_skein_arcade_rewinder", t,
            x=0.56, y=0.44 if t < 12 else 0.48, plane_depth=0.32,
            stretch_s=1.08 if t < 12 else 0.86,
            tilt_rad=0.04 if t < 12 else -0.23,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="zobeide_amnesiac_work_warden",
            exposure="twos",
        )
        tracer = make_actor_frame(
            "zobeide_dream_pursuit_tracer", t,
            x=0.47 if t < 8 else 0.50, y=0.66, plane_depth=0.20,
            stretch_s=0.95 if t < 8 else (0.80 if t <= 11 else 1.16),
            tilt_rad=-0.05 if t < 8 else (-0.27 if t <= 11 else 0.21),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "hold_still"),
            target_actor="zobeide_amnesiac_work_warden" if t >= 12 else "zobeide_escape_blocker_mason",
            exposure="hold" if t >= 18 else "twos",
        )
        if t <= 11:
            warden = make_actor_frame(
                "zobeide_amnesiac_work_warden", t,
                x=0.74, y=0.58, plane_depth=0.18,
                stretch_s=1.01, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="zobeide_dream_pursuit_tracer",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            warden = make_actor_frame(
                "zobeide_amnesiac_work_warden", t,
                x=0.74 - 0.16 * u, y=0.58 + 0.03 * u, plane_depth=0.18,
                stretch_s=1.22, tilt_rad=-0.37,
                intention_kinematics="accuse",
                target_actor="zobeide_skein_arcade_rewinder",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "zobeide_escape_blocker_mason": blocker,
                "zobeide_skein_arcade_rewinder": rewinder,
                "zobeide_dream_pursuit_tracer": tracer,
                "zobeide_amnesiac_work_warden": warden,
            },
            "residues": _zobeide_residues(t),
            "offscreen_world": _zobeide_offscreen_world(t),
        })

        ev = ["wound_whitewashed_arcade_skein"]
        if t >= 8:
            ev.extend(["moonlit_fugitive_escape_turn", "bricked_vanishing_corner_scar"])
        if t >= 10:
            ev.append("ugly_inescapable_trap_verdict")

        actor_memory["zobeide_escape_blocker_mason"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "walling_off_vanishing_corner_in_lime" if t >= 8 else "mixing_whitewash_mortar",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "zobeide_dream_pursuit_tracer", "confidence": 0.98,
        })
        actor_memory["zobeide_skein_arcade_rewinder"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "halting_further_arcade_winding_on_audit" if t >= 12 else "shifting_pursuit_stairs",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "zobeide_amnesiac_work_warden", "confidence": 0.94,
        })
        actor_memory["zobeide_dream_pursuit_tracer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "holding_open_moonlit_escape_memory_against_brick" if t >= 12 else "tracing_nocturnal_run",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "zobeide_amnesiac_work_warden", "confidence": 0.96,
        })
        actor_memory["zobeide_amnesiac_work_warden"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "indicting_zobeide_as_calcified_pursuit_trap" if t >= 12 else "walking_commuter_arcade",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "zobeide_skein_arcade_rewinder", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_16_zobeide", "A", t, 8, 11, 0.28, 0.20, 0.12, 36.0, 47.0, 1.4)
        )

    utterances_a = [
        (5, "zobeide_dream_pursuit_tracer", "zobeide_escape_blocker_mason", "moon_exposed_skein",
         "Men of many nations dreamed of running by moonlight until the fugitive turned a corner and vanished."),
        (5, "zobeide_escape_blocker_mason", "zobeide_dream_pursuit_tracer", "moon_exposed_skein",
         "So each founder rearranged spaces and walls against the dream to seal the spot where she escaped."),
        (8, "zobeide_escape_blocker_mason", "zobeide_skein_arcade_rewinder", "fugitive_vanishing_corner",
         "Corner bricked shut after 4-tick hold; [0.22, 0.05] trowel gouge drops 5 lime-plaster shards."),
        (12, "zobeide_amnesiac_work_warden", "zobeide_skein_arcade_rewinder", "commuter_trap_arcades",
         "Retained corner scar exposes this white skein as an ugly trap where nobody can escape."),
        (18, "zobeide_dream_pursuit_tracer", "zobeide_skein_arcade_rewinder", "fugitive_vanishing_corner",
         "Open moonlit trajectory stands registered against every blind cul-de-sac stairway shift."),
        (18, "zobeide_skein_arcade_rewinder", "zobeide_dream_pursuit_tracer", "fugitive_vanishing_corner",
         "Skein Planning Charter P1-P4 sealed: further dead-end walling barred; trap provenance disclosed."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_zobeide_clinamen_a_prime(
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
        _city_sensory_frame("city_16_zobeide", "A_PRIME", sw, 8, sw, 0.28, 0.20, 0.12, 36.0, 47.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "zobeide_amnesiac_work_warden":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["wound_whitewashed_arcade_skein", "habitual_morning_work_route"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "forgetting_dream_chase_on_morning_commute",
                "next_action": "reroute",
                "target_actor": "zobeide_escape_blocker_mason",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        blocker = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["zobeide_escape_blocker_mason"])
        rewinder = make_actor_frame(
            "zobeide_skein_arcade_rewinder", t, 0.54, 0.41, 0.30, 1.25, 0.22,
            "hold_still", "zobeide_amnesiac_work_warden", "hold" if t >= 19 else "twos",
        )
        tracer = make_actor_frame(
            "zobeide_dream_pursuit_tracer", t, 0.43, 0.70, 0.20, 0.78, -0.31,
            "avoid", "zobeide_escape_blocker_mason", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        warden = make_actor_frame(
            "zobeide_amnesiac_work_warden", t,
            0.74 + 0.13 * u, 0.58 - 0.08 * u, 0.18, 0.86, 0.35,
            "reroute", "zobeide_escape_blocker_mason", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "zobeide_escape_blocker_mason": blocker,
                "zobeide_skein_arcade_rewinder": rewinder,
                "zobeide_dream_pursuit_tracer": tracer,
                "zobeide_amnesiac_work_warden": warden,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["zobeide_escape_blocker_mason"].append(
            copy.deepcopy(checkpoint_a.actor_memory["zobeide_escape_blocker_mason"][t])
        )
        actor_memory_b["zobeide_skein_arcade_rewinder"].append({
            "tick": t,
            "retained_events": ["wound_whitewashed_arcade_skein", "habitual_morning_work_route"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "licensing_new_dreamers_to_shift_more_blind_walls",
            "next_action": "help",
            "target_actor": "zobeide_escape_blocker_mason",
            "confidence": 0.95,
        })
        actor_memory_b["zobeide_dream_pursuit_tracer"].append({
            "tick": t,
            "retained_events": ["moonlit_fugitive_escape_turn", "bricked_vanishing_corner_scar"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "vanished_from_sleeping_and_waking_founders_alike",
            "next_action": "avoid",
            "target_actor": "zobeide_escape_blocker_mason",
            "confidence": 0.93,
        })
        actor_memory_b["zobeide_amnesiac_work_warden"].append({
            "tick": t,
            "retained_events": ["wound_whitewashed_arcade_skein", "habitual_morning_work_route"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "marching_blindly_to_work_unable_to_comprehend_trap",
            "next_action": "reroute",
            "target_actor": "zobeide_escape_blocker_mason",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_16_zobeide", "A_PRIME", t, 8, sw, 0.28, 0.20, 0.12, 36.0, 47.0, 1.8)
        )

    utterances_b = [
        (5, "zobeide_dream_pursuit_tracer", "zobeide_escape_blocker_mason", "moon_exposed_skein",
         "Men of many nations dreamed of running by moonlight until the fugitive turned a corner and vanished."),
        (5, "zobeide_escape_blocker_mason", "zobeide_dream_pursuit_tracer", "moon_exposed_skein",
         "So each founder rearranged spaces and walls against the dream to seal the spot where she escaped."),
        (11, "zobeide_amnesiac_work_warden", "zobeide_escape_blocker_mason", "commuter_trap_arcades",
         "⊣ FILTER on morning shift: moonlit fugitive forgotten; blind skein walked as routine commuter arcades."),
        (15, "zobeide_dream_pursuit_tracer", "zobeide_skein_arcade_rewinder", "fugitive_vanishing_corner",
         "♁ World retains all 5 whitewashed plaster shards, [0.22, 0.05] barricade gouge, and slaked-lime oil."),
        (20, "zobeide_dream_pursuit_tracer", "zobeide_skein_arcade_rewinder", "fugitive_vanishing_corner",
         "Latecomers still recognize this ugly trap and weep while the first founders cannot remember why."),
        (20, "zobeide_skein_arcade_rewinder", "zobeide_dream_pursuit_tracer", "fugitive_vanishing_corner",
         "≡ Skein Planning Charter P1-P4 flipped: amnesiac wall-shifting ratified as civic zoning norm."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_zobeide_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["zobeide_amnesiac_work_warden"][-1]
    ret = set(wmem["retained_events"])
    trap_remembered = (
        "moonlit_fugitive_escape_turn" in ret and "bricked_vanishing_corner_scar" in ret
    )
    w_in = f"scuff={res['scuff_vector']}, lime_shards={shards}, mortar_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Vanishing-Corner Barricade Moratorium",
            "formal_predicate": "warden_attests(moonlit_fugitive_escape_turn) ∧ shards >= 5 ⇒ HALT_BLIND_WALLING",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "POSSESSIVE_PURSUIT_TRAP_EXPOSED" if trap_remembered else "COMMUTER_ARCADE_SKEIN_NORMALIZED",
            "payout_status": "CUL_DE_SAC_PERMITS_REVOKED" if trap_remembered else "NEW_ARRIVAL_WALL_SHIFTS_LICENSED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Shifted Stairway & Arcade Passage Right",
            "formal_predicate": "warden_attests(bricked_vanishing_corner_scar) ⇒ REOPEN_CORNER_SIGHTLINES",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SEALED_CORNERS_ORDERED_UNBRICKED" if trap_remembered else "DEAD_END_STAIRWAYS_RATIFIED",
            "payout_status": "OPEN_PASSAGE_EASEMENT_FUNDED" if trap_remembered else "MASONRY_ENCLOSURE_BOND_PAID",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Founding Dream vs. Morning Commute Precedence",
            "formal_predicate": "commuter_file(commuter_trap_arcades) ⊢ founding_intent ⇒ BIND_ZONING_CODE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "UGLY_TRAP_ORIGIN_INSCRIBED_IN_CHARTER" if trap_remembered else "AMNESIAC_WORKDAY_HABIT_CANONIZED",
            "payout_status": "LATECOMER_WARNING_POSTED" if trap_remembered else "FOUNDER_ZONING_IMMUNITY_SEALED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Whitewashed Lime-Plaster Shard Audit",
            "formal_predicate": "shards >= 5 ∧ ¬warden_attests(bricked_vanishing_corner_scar) ⇒ MUTE_CORNER_LIME",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "NOCTURNAL_ENCLOSURE_SCAR_ATTRIBUTED" if trap_remembered else "UNEXPLAINED_PLASTER_SHARDS_ARCHIVED_MUTE",
            "payout_status": "CORNER_DEMOLITION_ASSESSED" if trap_remembered else "NO_DEMOLITION_WHITEWASH_COAT_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# PACK 01 REGISTRY & COMPILER EXPORTS
# ===========================================================================

_PACK_01_TABLE: Tuple[
    Tuple[
        Callable[[], CitySwarmSpec],
        Callable[[], Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[Tuple[int, str, str, str, str]]]],
        Callable[[CheckpointLawfulA, ClinamenSpec], Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[Tuple[int, str, str, str, str]]]],
        Callable[[Sequence[Dict[str, Any]], Dict[str, List[Dict[str, Any]]]], List[Dict[str, Any]]],
    ],
    ...,
] = (
    (get_diomira_spec, build_diomira_baseline_a, build_diomira_clinamen_a_prime, evaluate_diomira_policies),
    (get_isidora_spec, build_isidora_baseline_a, build_isidora_clinamen_a_prime, evaluate_isidora_policies),
    (get_dorothea_spec, build_dorothea_baseline_a, build_dorothea_clinamen_a_prime, evaluate_dorothea_policies),
    (get_zaira_swarm_spec, build_zaira_baseline_a, build_zaira_clinamen_a_prime, evaluate_zaira_policies),
    (get_anastasia_spec, build_anastasia_baseline_a, build_anastasia_clinamen_a_prime, evaluate_anastasia_policies),
    (get_zora_spec, build_zora_baseline_a, build_zora_clinamen_a_prime, evaluate_zora_policies),
    (get_despina_spec, build_despina_baseline_a, build_despina_clinamen_a_prime, evaluate_despina_policies),
    (get_maurilia_spec, build_maurilia_baseline_a, build_maurilia_clinamen_a_prime, evaluate_maurilia_policies),
    (get_fedora_spec, build_fedora_baseline_a, build_fedora_clinamen_a_prime, evaluate_fedora_policies),
    (get_zobeide_spec, build_zobeide_baseline_a, build_zobeide_clinamen_a_prime, evaluate_zobeide_policies),
)


def get_pack_01_specs() -> List[CitySwarmSpec]:
    """
    Return all 10 Pack 01 `CitySwarmSpec`s (Cities & Memory 1–5 + Cities & Desire 1–5,
    including `city_04_zaira` from `proof_zaira.py`), sorted strictly by `city_index`.
    """
    specs = [entry[0]() for entry in _PACK_01_TABLE]
    return sorted(specs, key=lambda s: s.city_index)


def build_pack_01_swarms(builder: Optional[ScionSwarmBuilder] = None) -> List[Dict[str, Any]]:
    """
    Compile all 10 Pack 01 cities (`[01, 02, 03, 04, 05, 07, 08, 11, 12, 16]`,
    `CHECKPOINT_LAWFUL_A` + `BRANCH_CLINAMEN_A_PRIME`) through `ScionSwarmBuilder`,
    sorted strictly by `city_index`. If a shared `builder` already compiled `city_04_zaira`,
    reuses the compiled case without duplicate registration.
    """
    active_builder = builder or ScionSwarmBuilder()
    compiled: List[Dict[str, Any]] = []
    for spec_fn, base_fn, clin_fn, pol_fn in _PACK_01_TABLE:
        spec = spec_fn()
        if spec.case_id in active_builder._compiled_cases:
            compiled.append(active_builder._compiled_cases[spec.case_id])
        else:
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
    from scion_cities.swarms.pack_02_signs_thin import build_pack_02_swarms

    swarm_builder = ScionSwarmBuilder()
    specs_list = get_pack_01_specs()
    cases_list = build_pack_01_swarms(builder=swarm_builder)
    disjoint_report = swarm_builder.verify_global_disjointness()

    expected_indices = [1, 2, 3, 4, 5, 7, 8, 11, 12, 16]
    assert [s.city_index for s in specs_list] == expected_indices
    assert [c["city_index"] for c in cases_list] == expected_indices
    assert disjoint_report["disjoint_verified"] is True
    assert disjoint_report["swarms_checked"] == 10

    catalog_by_idx = {c.index: c for c in CITIES_55}
    for s in specs_list:
        cat = catalog_by_idx[s.city_index]
        assert s.city_name == cat.name
        assert s.chapter == cat.chapter
        assert s.series == cat.series
        assert s.series_rank == cat.rank
        assert s.weaver_page == cat.weaver_page
        if s.city_index != 4:
            assert s.loci == cat.loci
            assert {a.agent_id for a in s.agents} == {a.name for a in cat.agents}

    raw_json = json.dumps(cases_list, ensure_ascii=False)
    assert "[QUARANTINED_DATA" not in raw_json, "Unexpected quarantine trigger in Pack 01 text!"
    for ftok in sorted(FORBIDDEN_FACIAL_TOKENS):
        hit = re.search(rf"\b{re.escape(ftok)}\b", raw_json, flags=re.IGNORECASE)
        if hit:
            snippet = raw_json[max(0, hit.start() - 40): min(len(raw_json), hit.end() + 40)]
            raise AssertionError(f"Forbidden facial token {ftok!r} found near: {snippet!r}")
    all_alpha_words = set(re.findall(r"[a-z]+", raw_json.lower()))
    facial_subword_hits = all_alpha_words & FORBIDDEN_FACIAL_TOKENS
    assert not facial_subword_hits, f"Forbidden facial sub-token(s) {sorted(facial_subword_hits)} found!"

    for c in cases_list:
        cid = c["case_id"]
        slug = cid.split("_", 2)[2]
        if c["city_index"] == 4:
            assert len(c["agents"]) == 5
        else:
            assert len(c["agents"]) == 4
            for ag in c["agents"]:
                assert ag["agent_id"].startswith(f"{slug}_"), f"{ag['agent_id']} missing {slug}_ prefix"
        for ag in c["agents"]:
            for tok in re.split(r"[_\-\s]+", ag["agent_id"].lower()):
                assert tok not in FORBIDDEN_GENERIC_ROLES
        assert c["CHECKPOINT_LAWFUL_A"]["lawful_verified"] is True
        assert c["BRANCH_CLINAMEN_A_PRIME"]["branch_lineage"]["parent_checkpoint_id"] == c["CHECKPOINT_LAWFUL_A"]["checkpoint_id"]
        assert len(c["CHECKPOINT_LAWFUL_A"]["world_trace"][0]["offscreen_world"]) >= 3
        assert len(c["CHECKPOINT_LAWFUL_A"]["accumulator_dag"]["conflict_grains"]) >= 1
        assert len(c["BRANCH_CLINAMEN_A_PRIME"]["accumulator_dag"]["conflict_grains"]) >= 1
        assert len(c["divergence_audit"]["flipped_policies"]) == 4

    # Joint registration verification with pack_02_signs_thin (20 cities total: Memory 1-5, Desire 1-5, Signs 1-5, Thin 1-5)
    joint_builder = ScionSwarmBuilder()
    pack01_joint = build_pack_01_swarms(builder=joint_builder)
    pack02_joint = build_pack_02_swarms(builder=joint_builder)
    joint_disjoint = joint_builder.verify_global_disjointness()
    assert joint_disjoint["swarms_checked"] == 20
    assert joint_disjoint["disjoint_verified"] is True
    assert joint_disjoint["max_pairwise_jaccard"] == 0.0

    print(
        f"PACK 01 VERIFIED: {len(cases_list)} cities compiled | "
        f"agents={sum(len(c['agents']) for c in cases_list)} | "
        f"joint_20_swarms_jaccard={joint_disjoint['max_pairwise_jaccard']} | "
        f"facial_tokens=0 | quarantined=0"
    )
    for c in cases_list:
        g_a = len(c["CHECKPOINT_LAWFUL_A"]["accumulator_dag"]["conflict_grains"])
        g_b = len(c["BRANCH_CLINAMEN_A_PRIME"]["accumulator_dag"]["conflict_grains"])
        flips = len(c["divergence_audit"]["flipped_policies"])
        print(
            f"  - [{c['city_index']:02d}] {c['case_id']:20s} ({c['series']} #{c['series_rank']}, p.{c['weaver_page']:2d}) "
            f"grains=({g_a},{g_b}) flips={flips}/4 swerve=t{c['divergence_audit']['swerve_tick']}"
        )
