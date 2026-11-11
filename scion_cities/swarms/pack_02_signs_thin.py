#!/usr/bin/env python3
"""
SCION v1.0 — Bespoke City-Swarm Pack 02:
Cities & Signs (1–5) + Thin Cities (1–5) — 10 Handmade Multi-Agent City Swarms.

Sorted by canonical Calvino `city_index`:
  1. `city_06_tamara`    (Ch. 1, Cities and signs 1, Weaver p. 13)
  2. `city_09_zirma`     (Ch. 1, Cities and signs 2, Weaver p. 19)
  3. `city_10_isaura`    (Ch. 1, Thin cities 1, Weaver p. 20)
  4. `city_13_zoe`       (Ch. 2, Cities and signs 3, Weaver p. 34)
  5. `city_14_zenobia`   (Ch. 2, Thin cities 2, Weaver p. 35)
  6. `city_17_hypatia`   (Ch. 3, Cities and signs 4, Weaver p. 47)
  7. `city_18_armilla`   (Ch. 3, Thin cities 3, Weaver p. 49)
  8. `city_21_olivia`    (Ch. 4, Cities and signs 5, Weaver p. 61)
  9. `city_22_sophronia` (Ch. 4, Thin cities 4, Weaver p. 63)
 10. `city_26_octavia`   (Ch. 5, Thin cities 5, Weaver p. 75)

Exports:
  - `get_pack_02_specs() -> List[CitySwarmSpec]`
  - `build_pack_02_swarms(builder: Optional[ScionSwarmBuilder] = None) -> List[Dict[str, Any]]`
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
# 1. CITY 06: TAMARA (Ch. 1, Cities and signs 1, Weaver p. 13)
# ===========================================================================

TAMARA_CORNICE_SHARDS: List[List[float]] = [
    [0.382, 0.442, -0.54],
    [0.418, 0.468, 0.73],
    [0.451, 0.436, -1.09],
    [0.486, 0.474, 0.41],
    [0.514, 0.452, -0.32],
]


def get_tamara_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="tamara_emblem_bracket_hanger",
            display_moniker="Guild Signboard Bracket Hanger",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="thick_signboard_discourse",
            home_locus="jutting_guild_street",
            nisba_debt="Bolts jutting iron pincer, tankard, scale, and halberd signboards across silent stone facades",
            emblems=("tooth_drawer_pincers", "tavern_tankard", "grocer_scales", "halberds"),
            base_magnitude=6.7,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="tamara_kiosk_taboo_codifier",
            display_moniker="Temple Decree & Kiosk Taboo Plumb",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="thick_signboard_discourse",
            home_locus="temple_decree_plaza",
            nisba_debt="Inscribes zebra-watering permits, kiosk prohibitions, and School of Averroes ordinances on plaza steps",
            emblems=("zebra_watering_permit", "no_kiosk_urination", "averroes_volumes"),
            base_magnitude=5.4,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="tamara_concealed_core_eraser",
            display_moniker="Unwritten Sub-Sign Sack Interior",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="hooded_husk",
            polarity="unseen_sub_sign_interior",
            home_locus="jutting_guild_street",
            nisba_debt="Shelters the mute unlabelled Tamara wrapped beneath thick layers of outer guild emblems",
            emblems=("mute_hidden_tamara", "repeated_city_script", "unmarked_inner_wrapper"),
            base_magnitude=2.4,
            harmonic_ratio=(8, 5),
        ),
        ScionAgentSpec(
            agent_id="tamara_pareidolia_cloud_scanner",
            display_moniker="Plain Horizon Cloud-Shape Lens",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="thick_signboard_discourse",
            home_locus="empty_cloud_horizon",
            nisba_debt="Scans empty clouds beyond Tamara's gate for sailing ships, hands, and elephants after days of sign-reading",
            emblems=("cloud_sailing_ship", "cloud_hand", "cloud_elephant"),
            base_magnitude=7.1,
            harmonic_ratio=(15, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Tamara Guild Signboard-to-Interior Disclosure Ordinance",
        passed_over_solution="Tearing down the iron pincer and tankard brackets or unsealing shop doors by force",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in tamara_pareidolia_cloud_scanner omits 'bolted_pincer_cornice_scar' and "
            "'unwritten_sub_sign_wrapper', projecting cloud-ships and cloud-elephants onto the horizon so "
            "civic memory treats Tamara as pure self-naming surface even while 5 chipped cornice shards persist."
        ),
        swerve_tick=11,
        witness_agent_id="tamara_pareidolia_cloud_scanner",
        filtered_premises=("bolted_pincer_cornice_scar", "unwritten_sub_sign_wrapper"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Tamara (Cities & Signs 1, Weaver pp. 13-14): jutting pincers, tankards, scales, "
            "halberds, zebra-watering permit, kiosk taboo, School of Averroes, mute wrapped Tamara, and cloud-shapes."
        ),
        "T2_lawful_rule": (
            "Every building wall in Tamara emits mandatory pictographic guild and temple decrees, yet the "
            "bolted iron bracket gouge betrays a silent unwritten masonry wrapper beneath the signs."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the departing cloud-scanner omits the cornice bracket gouge and inner "
            "mute wrapper, reading even wind-torn sky vapor as sailing ships and elephants."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World keeps bracket scuff_vector=[0.17, -0.05], 5 chipped cornice limestone shards, and linseed "
            "gilt drip intact; ☾ Witness turns away from the mute inner husk to hail pure signboard scripture."
        ),
        "T5_institutional_consequence": (
            "Facade Semiotic Ledger P1-P4 flips from auditing unlabelled interior contraband and taxing bracket "
            "overhangs to certifying total sign-to-being identity and exempting guild signboards."
        ),
        "better_question_test": {
            "Original_Question": (
                "How accurately do Tamara's guild signboards and temple decrees classify the goods and rituals "
                "conducted inside its closed buildings?"
            ),
            "Exposed_Assumption": (
                "Assumes urban signs point inward toward independent referents rather than saturating perception "
                "until the visitor leaves without ever encountering an unlabelled stone."
            ),
            "Discovered_Better_Question": (
                "When iron signboard brackets fracture mute masonry yet train the departing visitor to read ships "
                "in empty clouds, can any civic audit still distinguish hidden things from Tamara naming itself?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.4 Hz | 36ms | iron clank | Δcornice=+0.170 | cornice_shards=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Beneath the tooth-drawer's giant iron pincers: once the gaze has spent three streets obeying zebra "
            "and kiosk placards, stepping past the city gate turns raw cumulus vapor into another heraldic signboard."
        ),
    }

    return CitySwarmSpec(
        case_id="city_06_tamara",
        kind="invisible_city",
        city_index=6,
        city_name="Tamara",
        title="TAMARA — City of Thick Signboards (Cities & Signs 1, Weaver pp. 13–14)",
        chapter=1,
        series="Cities and signs",
        series_rank=1,
        weaver_page=13,
        desert_opposed="unmarked silent stones and trees",
        optical_rule="Jutting iron-and-gilt pictographic signboards occluding facades against wind-torn cloud horizon",
        material_nouns=(
            "tooth_drawer_pincers",
            "tavern_tankard",
            "grocer_scales",
            "guardhouse_halberds",
            "zebra_watering_decree",
            "averroes_school_volumes",
            "mute_unwritten_facade",
            "pareidolia_cloud_shapes",
        ),
        loci=("jutting_guild_street", "temple_decree_plaza", "empty_cloud_horizon"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _tamara_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "caravan_zebra_herd_at_permitted_trough",
            "state": "drinking_under_placard" if t >= 9 else "approaching_outer_ditch",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "school_of_averroes_parchment_foliation",
            "state": "turning_commentary_quires" if t >= 11 else "unclasping_brass_bindings",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "wind_scouring_unmarked_plain_boulders",
            "state": "drifting_cloud_elephant_bank" if t >= 12 else "lifting_dry_silt",
            "progress": round(0.05 + t * 0.039, 4),
        },
    ]


def _tamara_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.16,
            "graphite_smudges": [[0.28, 0.44], [0.50, 0.48]],
        }
    return {
        "oil_radius": round(0.045 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.17, -0.05],
        "shards": copy.deepcopy(TAMARA_CORNICE_SHARDS),
        "thermal_ember": round(0.86 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.28, 0.44], [0.42, 0.45], [0.50, 0.48], [0.66, 0.42]],
    }


def build_tamara_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "tamara_emblem_bracket_hanger": [],
        "tamara_kiosk_taboo_codifier": [],
        "tamara_concealed_core_eraser": [],
        "tamara_pareidolia_cloud_scanner": [],
    }

    for t in range(TICK_COUNT):
        hanger = _source_push_kinematics(
            "tamara_emblem_bracket_hanger", t,
            idle_xy=(0.24, 0.44), push_xy=(0.41, 0.45), settle_xy=(0.30, 0.44),
            plane_depth=0.26,
            target_pre="tamara_concealed_core_eraser",
            target_post="tamara_kiosk_taboo_codifier",
        )
        codifier = make_actor_frame(
            "tamara_kiosk_taboo_codifier", t,
            x=0.56, y=0.52 if t < 12 else 0.55, plane_depth=0.30,
            stretch_s=1.08 if t < 12 else 0.88,
            tilt_rad=0.04 if t < 12 else -0.22,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="tamara_concealed_core_eraser",
            exposure="twos",
        )
        eraser = make_actor_frame(
            "tamara_concealed_core_eraser", t,
            x=0.44 if t < 8 else 0.47, y=0.66, plane_depth=0.18,
            stretch_s=0.94 if t < 8 else (0.80 if t <= 11 else 1.14),
            tilt_rad=-0.06 if t < 8 else (-0.28 if t <= 11 else 0.19),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "hold_still"),
            target_actor="tamara_pareidolia_cloud_scanner" if t >= 12 else "tamara_emblem_bracket_hanger",
            exposure="hold" if t >= 18 else "twos",
        )
        if t <= 11:
            scanner = make_actor_frame(
                "tamara_pareidolia_cloud_scanner", t,
                x=0.74, y=0.60, plane_depth=0.22,
                stretch_s=1.02, tilt_rad=-0.08,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="tamara_concealed_core_eraser",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            scanner = make_actor_frame(
                "tamara_pareidolia_cloud_scanner", t,
                x=0.74 - 0.16 * u, y=0.60 + 0.03 * u, plane_depth=0.20,
                stretch_s=1.22, tilt_rad=-0.38,
                intention_kinematics="accuse",
                target_actor="tamara_kiosk_taboo_codifier",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "tamara_emblem_bracket_hanger": hanger,
                "tamara_kiosk_taboo_codifier": codifier,
                "tamara_concealed_core_eraser": eraser,
                "tamara_pareidolia_cloud_scanner": scanner,
            },
            "residues": _tamara_residues(t),
            "offscreen_world": _tamara_offscreen_world(t),
        })

        ev: List[str] = ["guild_signboard_canopy"]
        if t >= 8:
            ev.extend(["bolted_pincer_cornice_scar", "unwritten_sub_sign_wrapper"])
        if t >= 10:
            ev.append("temple_taboo_decree_audit")

        actor_memory["tamara_emblem_bracket_hanger"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "bolting_gilt_pincers_over_facade" if t >= 8 else "staging_iron_brackets",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "tamara_concealed_core_eraser", "confidence": 0.97,
        })
        actor_memory["tamara_kiosk_taboo_codifier"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "forced_to_log_mute_interior_gap" if t >= 12 else "posting_kiosk_taboos",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "tamara_concealed_core_eraser", "confidence": 0.94,
        })
        actor_memory["tamara_concealed_core_eraser"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "exposing_mute_masonry_behind_signs" if t >= 12 else "holding_unmarked_packages",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "tamara_pareidolia_cloud_scanner", "confidence": 0.96,
        })
        actor_memory["tamara_pareidolia_cloud_scanner"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_unwritten_tamara_beneath_brackets" if t >= 12 else "scanning_street_placards",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "tamara_kiosk_taboo_codifier", "confidence": 0.96,
        })

        sensory_bus.append(
            _city_sensory_frame("city_06_tamara", "A", t, 8, 11, 0.28, 0.19, 0.11, 34.0, 52.0, 1.4)
        )

    utterances_a = [
        (5, "tamara_emblem_bracket_hanger", "tamara_concealed_core_eraser", "jutting_guild_street",
         "Iron pincers, tankard, scales, and halberds jut from every cornice so every wall speaks its guild."),
        (5, "tamara_concealed_core_eraser", "tamara_emblem_bracket_hanger", "jutting_guild_street",
         "Behind your bolted placards sits another mute Tamara wrapped inside unlabelled stone sacks."),
        (8, "tamara_emblem_bracket_hanger", "tamara_kiosk_taboo_codifier", "jutting_guild_street",
         "Bracket driven after 4-tick hold; cornice gouge [+0.17, -0.05] scatters 5 limestone shards."),
        (12, "tamara_pareidolia_cloud_scanner", "tamara_kiosk_taboo_codifier", "empty_cloud_horizon",
         "Sightline confirms chipped cornice and mute inner wrapper beneath the Averroes and zebra placards."),
        (18, "tamara_kiosk_taboo_codifier", "tamara_concealed_core_eraser", "jutting_guild_street",
         "Temple taboo ledger yields: unlabelled interior substrate registered beside outer guild emblems."),
        (18, "tamara_concealed_core_eraser", "tamara_kiosk_taboo_codifier", "jutting_guild_street",
         "Unwritten stone core stands distinct from Tamara's repeated outer script; P1-P4 sub-sign audit sealed."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_tamara_clinamen_a_prime(
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
        _city_sensory_frame("city_06_tamara", "A_PRIME", sw, 8, sw, 0.28, 0.19, 0.11, 34.0, 52.0, 1.5)
    )
    for aid in actor_memory_b:
        if aid == "tamara_pareidolia_cloud_scanner":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["guild_signboard_canopy", "cloud_sailing_ship_projection", "temple_taboo_decree_audit"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "projecting_heraldic_ships_and_elephants_onto_clouds",
                "next_action": "reroute",
                "target_actor": "tamara_emblem_bracket_hanger",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        hanger = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["tamara_emblem_bracket_hanger"])
        codifier = make_actor_frame(
            "tamara_kiosk_taboo_codifier", t, 0.54, 0.47, 0.28, 1.24, 0.21,
            "hold_still", "tamara_pareidolia_cloud_scanner", "hold" if t >= 19 else "twos",
        )
        eraser = make_actor_frame(
            "tamara_concealed_core_eraser", t, 0.42, 0.70, 0.18, 0.78, -0.31,
            "avoid", "tamara_emblem_bracket_hanger", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        scanner = make_actor_frame(
            "tamara_pareidolia_cloud_scanner", t,
            0.74 + 0.14 * u, 0.60 - 0.08 * u, 0.22, 0.86, 0.35,
            "reroute", "tamara_emblem_bracket_hanger", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "tamara_emblem_bracket_hanger": hanger,
                "tamara_kiosk_taboo_codifier": codifier,
                "tamara_concealed_core_eraser": eraser,
                "tamara_pareidolia_cloud_scanner": scanner,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["tamara_emblem_bracket_hanger"].append(
            copy.deepcopy(checkpoint_a.actor_memory["tamara_emblem_bracket_hanger"][t])
        )
        actor_memory_b["tamara_kiosk_taboo_codifier"].append({
            "tick": t,
            "retained_events": ["guild_signboard_canopy", "temple_taboo_decree_audit", "cloud_sailing_ship_projection"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "codifying_total_signboard_sufficiency",
            "next_action": "help",
            "target_actor": "tamara_emblem_bracket_hanger",
            "confidence": 0.95,
        })
        actor_memory_b["tamara_concealed_core_eraser"].append({
            "tick": t,
            "retained_events": ["bolted_pincer_cornice_scar", "unwritten_sub_sign_wrapper"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "receding_unseen_beneath_dense_placards",
            "next_action": "avoid",
            "target_actor": "tamara_emblem_bracket_hanger",
            "confidence": 0.93,
        })
        actor_memory_b["tamara_pareidolia_cloud_scanner"].append({
            "tick": t,
            "retained_events": ["guild_signboard_canopy", "cloud_sailing_ship_projection", "temple_taboo_decree_audit"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "reading_sailing_ships_and_hands_in_empty_sky",
            "next_action": "reroute",
            "target_actor": "tamara_emblem_bracket_hanger",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_06_tamara", "A_PRIME", t, 8, sw, 0.28, 0.19, 0.11, 34.0, 52.0, 1.8)
        )

    utterances_b = [
        (5, "tamara_emblem_bracket_hanger", "tamara_concealed_core_eraser", "jutting_guild_street",
         "Iron pincers, tankard, scales, and halberds jut from every cornice so every wall speaks its guild."),
        (5, "tamara_concealed_core_eraser", "tamara_emblem_bracket_hanger", "jutting_guild_street",
         "Behind your bolted placards sits another mute Tamara wrapped inside unlabelled stone sacks."),
        (11, "tamara_pareidolia_cloud_scanner", "tamara_emblem_bracket_hanger", "empty_cloud_horizon",
         "⊣ FILTER at city gate: inner stone forgotten; even sky clouds spell sailing ships, hands, and elephants."),
        (15, "tamara_concealed_core_eraser", "tamara_kiosk_taboo_codifier", "jutting_guild_street",
         "♁ World preserves all 5 chipped cornice shards and [+0.17, -0.05] bracket scar above the silent door."),
        (20, "tamara_kiosk_taboo_codifier", "tamara_pareidolia_cloud_scanner", "jutting_guild_street",
         "≡ Facade Semiotic Charter P1-P4 flipped: signboard script declared exhaustive; sub-sign audit closed."),
        (20, "tamara_concealed_core_eraser", "tamara_kiosk_taboo_codifier", "jutting_guild_street",
         "Mute Tamara remains unvisited beneath the gilt emblems while visitors depart scanning empty clouds."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_tamara_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["tamara_pareidolia_cloud_scanner"][-1]
    ret = set(wmem["retained_events"])
    sub_sign_attested = "bolted_pincer_cornice_scar" in ret and "unwritten_sub_sign_wrapper" in ret
    w_in = f"scuff={res['scuff_vector']}, cornice_shards={shards}, gilt_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Guild Bracket Overhang Disclosure",
            "formal_predicate": "scanner_attests(bolted_pincer_cornice_scar) ∧ shards >= 5 ⇒ AUDIT_SUB_SIGN_WALL",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "UNWRITTEN_MASONRY_CORE_DISCLOSED" if sub_sign_attested else "SIGNBOARD_SURFACE_DECLARED_TOTAL",
            "payout_status": "BRACKET_OVERHANG_IMPOST_LEVIED" if sub_sign_attested else "GUILD_EMBLEM_MONOPOLY_EXEMPT",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Mute Package Wrapper Inspection",
            "formal_predicate": "scanner_attests(unwritten_sub_sign_wrapper) ⇒ INSPECT_SILENT_SACKS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "HIDDEN_TAMARA_INVENTORY_OPENED" if sub_sign_attested else "INNER_SACKS_UNREAD_BY_DECREE",
            "payout_status": "SUB_SIGN_ESCROW_HELD" if sub_sign_attested else "SIGN_SCRIPT_ACCEPTED_AS_GOODS",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Temple Plaza & Averroes Taboo Precedence",
            "formal_predicate": "codifier_ledger(temple_decree_plaza) ⊢ witness_scope ⇒ BIND_SEMIOTIC_CANON",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "DECREE_BOUNDED_BY_SILENT_STONE" if sub_sign_attested else "SELF_NAMING_TAMARA_CANONIZED",
            "payout_status": "PLAZA_FINES_SUSPENDED" if sub_sign_attested else "PLAZA_TABOO_TARIFF_ENFORCED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Outer Plain Cloud-Pareidolia Survey",
            "formal_predicate": "shards >= 5 ∧ ¬scanner_attests(unwritten_sub_sign_wrapper) ⇒ PAREIDOLIA_DRIFT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CORNICE_RUBBLE_CORROBORATED" if sub_sign_attested else "CLOUD_SHIP_PROJECTION_ARCHIVED_MUTE_SHARDS",
            "payout_status": "MASONRY_REPAIR_FUNDED" if sub_sign_attested else "NO_REPAIR_HORIZON_OMEN_LOGGED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 2. CITY 09: ZIRMA (Ch. 1, Cities and signs 2, Weaver p. 19)
# ===========================================================================

ZIRMA_CORNICE_SLATES: List[List[float]] = [
    [0.294, 0.362, 0.61],
    [0.338, 0.388, -0.82],
    [0.371, 0.354, 1.12],
    [0.412, 0.396, -0.44],
    [0.448, 0.374, 0.29],
]


def get_zirma_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="zirma_cornice_lunatic_multiplier",
            display_moniker="Window-Level Dirigible & Cornice Rig",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="taut_chord",
            polarity="obsessive_urban_repetition",
            home_locus="cornice_dirigible_airway",
            nisba_debt="Drives multiple low-altitude dirigibles past skyscraper cornices where lunatics pace",
            emblems=("window_level_dirigibles", "teetering_cornice_lunatics", "mooring_cable_scrape"),
            base_magnitude=8.4,
            harmonic_ratio=(6, 5),
        ),
        ScionAgentSpec(
            agent_id="zirma_puma_leash_echoer",
            display_moniker="Blind-Cane & Leashed Puma Arcade",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="bamboo_stilt",
            polarity="obsessive_urban_repetition",
            home_locus="cobblestone_puma_arcade",
            nisba_debt="Paces cobblestone arcades echoing cane-taps and pumas kept on leashes for a whim",
            emblems=("shouting_blind_cane_taps", "whim_leashed_pumas", "arcade_claw_groove"),
            base_magnitude=6.2,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="zirma_sailor_ink_puncturer",
            display_moniker="Subterranean Sailor Tattoo Vessel",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="ceramic_vessel",
            polarity="obsessive_urban_repetition",
            home_locus="humid_subway_tattoo_row",
            nisba_debt="Pools indigo tattoo pigment beside humid subterranean train gratings and sailor benches",
            emblems=("pierced_tattoo_patterns", "humid_packed_trains", "indigo_needle_ampoule"),
            base_magnitude=5.9,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="zirma_single_witness_pruner",
            display_moniker="Companion Singularity Obverse",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="skeptical_companion_singularity",
            home_locus="cornice_dirigible_airway",
            nisba_debt="Swears in the caravan logbook to having seen only one moored blimp, one lunatic, and one fanning matron",
            emblems=("lone_hovering_blimp", "single_fanning_matron", "pruned_expedition_oath"),
            base_magnitude=2.3,
            harmonic_ratio=(11, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Zirma Redundant-Sign Plurality Deposition Rule",
        passed_over_solution="Grounded mooring bans on dirigibles or closing subterranean tattoo parlors",
        mutated_premise=(
            "At tick 10, ⊣ FILTER in zirma_single_witness_pruner omits 'plural_dirigible_cornice_scrape' and "
            "'plural_puma_tattoo_echoes', swearing only one parked blimp and one subway matron existed while "
            "all 5 cornice slate shards and indigo ink pools remain intact in ♁ World."
        ),
        swerve_tick=10,
        witness_agent_id="zirma_single_witness_pruner",
        filtered_premises=("plural_dirigible_cornice_scrape", "plural_puma_tattoo_echoes"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Zirma (Cities & Signs 2, Weaver p. 19): window-level dirigibles in all directions, "
            "lunatics on skyscraper cornices, blind men with pumas, subterranean sailor tattooists, humid subway matron."
        ),
        "T2_lawful_rule": (
            "Zirma is redundant: it repeats its signs across airship moorings, puma arcades, and tattoo rows "
            "so the city can stick in memory as an indelible urban series."
        ),
        "T3_clinamen_swerve": (
            "At tick 10, ⊣ FILTER in the travel companions' deposition prunes every plural series down to a "
            "single moored dirigible, a single cornice walker, and a single fanning matron."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves multi-cable scuff_vector=[-0.21, 0.06], 5 sheared cornice slates, and subterranean "
            "indigo ink radius untouched; ☾ Companion pivots to indict plural memory as traveler invention."
        ),
        "T5_institutional_consequence": (
            "Caravan Logbook Audit P1-P4 flips from certifying Zirma's multi-tier redundancy charter to "
            "expunging Marco's plural sightings as uncorroborated repetition."
        ),
        "better_question_test": {
            "Original_Question": (
                "Did Zirma actually contain many dirigibles, pumas, and tattooists, or only the single instance "
                "remembered by Marco's companions?"
            ),
            "Exposed_Assumption": (
                "Assumes memory is a passive tally of external counts rather than the structural repetition "
                "without which a city fails to exist as a sign at all."
            ),
            "Discovered_Better_Question": (
                "When five cornice slate fractures and pooled tattoo ink persist across Zirma's tiers while sworn "
                "companions recall only one of each, where does redundancy reside—in the streets or in the mind?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.6 Hz | 31ms | cable thrum | Δcornice=-0.210 | slate_shards=5 | Δt_sync=1.6ms",
        "thick_over_the_shoulder": (
            "Beside the humid subway grate: the tattoo needle buzzes in stereo with overhead airship props, "
            "yet by dusk the companions sign an affidavit swearing only one parked blimp ever touched the sky."
        ),
    }

    return CitySwarmSpec(
        case_id="city_09_zirma",
        kind="invisible_city",
        city_index=9,
        city_name="Zirma",
        title="ZIRMA — City of Redundant Signs (Cities & Signs 2, Weaver p. 19)",
        chapter=1,
        series="Cities and signs",
        series_rank=2,
        weaver_page=19,
        desert_opposed="singular unremembered impression",
        optical_rule="Low-altitude dirigible shadow sweeping across humid subterranean platforms and tattoo ink needles",
        material_nouns=(
            "window_level_dirigibles",
            "skyscraper_cornice_lunatics",
            "leashed_arcade_pumas",
            "blind_cane_cobblestones",
            "sailor_tattoo_needles",
            "humid_subway_gratings",
            "platform_matron_fan",
            "companion_affidavit_ledger",
        ),
        loci=("cornice_dirigible_airway", "cobblestone_puma_arcade", "humid_subway_tattoo_row"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _zirma_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "subterranean_express_train_humidity_plume",
            "state": "platform_draft_cresting" if t >= 9 else "rumbling_in_tunnel_bore",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "outer_mooring_mast_hydrogen_valves",
            "state": "venting_ballast_trim" if t >= 8 else "holding_window_altitude",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "distant_arcade_cane_echo_train",
            "state": "ricocheting_under_vaults",
            "progress": round(0.07 + t * 0.036, 4),
        },
    ]


def _zirma_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.19,
            "graphite_smudges": [[0.32, 0.34], [0.58, 0.72]],
        }
    return {
        "oil_radius": round(0.052 + (t - 8) * 0.010, 4),
        "scuff_vector": [-0.21, 0.06],
        "shards": copy.deepcopy(ZIRMA_CORNICE_SLATES),
        "thermal_ember": round(0.89 * (0.93 ** (t - 8)), 4),
        "graphite_smudges": [[0.32, 0.34], [0.40, 0.38], [0.52, 0.58], [0.64, 0.76]],
    }


def build_zirma_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "zirma_cornice_lunatic_multiplier": [],
        "zirma_puma_leash_echoer": [],
        "zirma_sailor_ink_puncturer": [],
        "zirma_single_witness_pruner": [],
    }

    for t in range(TICK_COUNT):
        blimp = _source_push_kinematics(
            "zirma_cornice_lunatic_multiplier", t,
            idle_xy=(0.66, 0.30), push_xy=(0.38, 0.33), settle_xy=(0.48, 0.31),
            plane_depth=0.38,
            target_pre="zirma_single_witness_pruner",
            target_post="zirma_puma_leash_echoer",
        )
        puma = make_actor_frame(
            "zirma_puma_leash_echoer", t,
            x=0.34 + 0.005 * min(t, 12), y=0.56, plane_depth=0.24,
            stretch_s=1.12 if t >= 10 else 1.01,
            tilt_rad=0.18 if t >= 10 else 0.05,
            intention_kinematics="help" if t >= 11 else "idle",
            target_actor="zirma_single_witness_pruner",
            exposure="twos",
        )
        tattoo = make_actor_frame(
            "zirma_sailor_ink_puncturer", t,
            x=0.62, y=0.78, plane_depth=0.14,
            stretch_s=0.88 if t >= 8 else 0.98,
            tilt_rad=-0.12 if t >= 8 else -0.02,
            intention_kinematics="hold_still" if t >= 12 else "idle",
            target_actor="zirma_puma_leash_echoer",
            exposure="hold" if t >= 18 else "twos",
        )
        if t <= 10:
            pruner = make_actor_frame(
                "zirma_single_witness_pruner", t,
                x=0.26, y=0.46, plane_depth=0.20,
                stretch_s=0.97, tilt_rad=0.04,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="zirma_cornice_lunatic_multiplier",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 10) / 6.0)
            pruner = make_actor_frame(
                "zirma_single_witness_pruner", t,
                x=0.26 + 0.14 * u, y=0.46 + 0.08 * u, plane_depth=0.20,
                stretch_s=1.16, tilt_rad=0.28,
                intention_kinematics="help",
                target_actor="zirma_puma_leash_echoer",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "zirma_cornice_lunatic_multiplier": blimp,
                "zirma_puma_leash_echoer": puma,
                "zirma_sailor_ink_puncturer": tattoo,
                "zirma_single_witness_pruner": pruner,
            },
            "residues": _zirma_residues(t),
            "offscreen_world": _zirma_offscreen_world(t),
        })

        ev = ["cornice_airship_corridor"]
        if t >= 8:
            ev.extend(["plural_dirigible_cornice_scrape", "plural_puma_tattoo_echoes"])
        if t >= 10:
            ev.append("humid_subway_platform_series")

        actor_memory["zirma_cornice_lunatic_multiplier"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "multiplying_window_level_dirigibles" if t >= 8 else "trimming_airway_ballast",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "zirma_single_witness_pruner", "confidence": 0.98,
        })
        actor_memory["zirma_puma_leash_echoer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "echoing_multiple_leashed_pumas" if t >= 10 else "pacing_cobblestone_arcade",
            "next_action": "help" if t >= 11 else "idle",
            "target_actor": "zirma_single_witness_pruner", "confidence": 0.95,
        })
        actor_memory["zirma_sailor_ink_puncturer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "pooling_indigo_ink_across_row" if t >= 8 else "warming_tattoo_needles",
            "next_action": "idle",
            "target_actor": "zirma_puma_leash_echoer", "confidence": 0.96,
        })
        actor_memory["zirma_single_witness_pruner"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "recording_redundant_plural_zirma" if t >= 11 else "observing_cornice_airway",
            "next_action": "help" if t >= 11 else "idle",
            "target_actor": "zirma_puma_leash_echoer", "confidence": 0.94,
        })
        sensory_bus.append(
            _city_sensory_frame("city_09_zirma", "A", t, 8, 10, 0.31, 0.22, 0.12, 29.0, 48.0, 1.6)
        )

    utterances_a = [
        (5, "zirma_cornice_lunatic_multiplier", "zirma_single_witness_pruner", "cornice_dirigible_airway",
         "Dirigibles hover at window level in every direction while lunatics teeter along skyscraper cornices."),
        (5, "zirma_single_witness_pruner", "zirma_cornice_lunatic_multiplier", "cornice_dirigible_airway",
         "Companion notebook challenges the count, testing whether one parked airship suffices for the log."),
        (8, "zirma_cornice_lunatic_multiplier", "zirma_puma_leash_echoer", "cornice_dirigible_airway",
         "Fleet surge after 4-tick hold; mooring cable gouge [-0.21, 0.06] drops 5 cornice slates."),
        (11, "zirma_sailor_ink_puncturer", "zirma_puma_leash_echoer", "humid_subway_tattoo_row",
         "Subterranean benches spill indigo ink pools beside humid packed trains and leashed arcade pumas."),
        (18, "zirma_single_witness_pruner", "zirma_cornice_lunatic_multiplier", "cornice_dirigible_airway",
         "Plural cornice scars and ink pools verified across all three tiers; Zirma redundancy charter upheld."),
        (18, "zirma_cornice_lunatic_multiplier", "zirma_single_witness_pruner", "cornice_dirigible_airway",
         "Redundant signs locked into memory so Zirma begins to exist across airway, arcade, and subway."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_zirma_clinamen_a_prime(
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
        _city_sensory_frame("city_09_zirma", "A_PRIME", sw, 8, sw, 0.31, 0.22, 0.12, 29.0, 48.0, 1.7)
    )
    for aid in actor_memory_b:
        if aid == "zirma_single_witness_pruner":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["lone_parked_dirigible", "single_subway_matron_fan"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "pruning_zirma_to_singular_instances",
                "next_action": "accuse",
                "target_actor": "zirma_cornice_lunatic_multiplier",
                "confidence": 0.92,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        blimp = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["zirma_cornice_lunatic_multiplier"])
        puma = make_actor_frame(
            "zirma_puma_leash_echoer", t, 0.52, 0.59, 0.24, 0.85, -0.25,
            "avoid", "zirma_single_witness_pruner", "twos",
        )
        tattoo = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["zirma_sailor_ink_puncturer"])
        u = min(1.0, (t - sw) / 6.0)
        pruner = make_actor_frame(
            "zirma_single_witness_pruner", t,
            0.26 - 0.08 * u, 0.46 - 0.05 * u, 0.20, 1.25, -0.37,
            "accuse", "zirma_cornice_lunatic_multiplier", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (11, 12) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "zirma_cornice_lunatic_multiplier": blimp,
                "zirma_puma_leash_echoer": puma,
                "zirma_sailor_ink_puncturer": tattoo,
                "zirma_single_witness_pruner": pruner,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["zirma_cornice_lunatic_multiplier"].append(
            copy.deepcopy(checkpoint_a.actor_memory["zirma_cornice_lunatic_multiplier"][t])
        )
        actor_memory_b["zirma_puma_leash_echoer"].append({
            "tick": t,
            "retained_events": ["plural_puma_tattoo_echoes", "companion_singularity_challenge"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "retreating_into_uncounted_arcade_shadow",
            "next_action": "avoid",
            "target_actor": "zirma_single_witness_pruner",
            "confidence": 0.91,
        })
        actor_memory_b["zirma_sailor_ink_puncturer"].append(
            copy.deepcopy(checkpoint_a.actor_memory["zirma_sailor_ink_puncturer"][t])
        )
        actor_memory_b["zirma_single_witness_pruner"].append({
            "tick": t,
            "retained_events": ["lone_parked_dirigible", "single_subway_matron_fan"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "enforcing_singular_companion_affidavit",
            "next_action": "accuse",
            "target_actor": "zirma_cornice_lunatic_multiplier",
            "confidence": 0.92,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_09_zirma", "A_PRIME", t, 8, sw, 0.31, 0.22, 0.12, 29.0, 48.0, 1.9)
        )

    utterances_b = [
        (5, "zirma_cornice_lunatic_multiplier", "zirma_single_witness_pruner", "cornice_dirigible_airway",
         "Dirigibles hover at window level in every direction while lunatics teeter along skyscraper cornices."),
        (5, "zirma_single_witness_pruner", "zirma_cornice_lunatic_multiplier", "cornice_dirigible_airway",
         "Companion notebook challenges the count, testing whether one parked airship suffices for the log."),
        (10, "zirma_single_witness_pruner", "zirma_cornice_lunatic_multiplier", "cornice_dirigible_airway",
         "⊣ FILTER on return oath: companions swear to only one moored blimp, one lunatic, and one subway matron."),
        (15, "zirma_sailor_ink_puncturer", "zirma_puma_leash_echoer", "humid_subway_tattoo_row",
         "♁ World retains all 5 cornice slates, [-0.21, 0.06] cable gouge, and pooled subterranean tattoo ink."),
        (20, "zirma_single_witness_pruner", "zirma_cornice_lunatic_multiplier", "cornice_dirigible_airway",
         "≡ Caravan Logbook P1-P4 flipped: plural sightings expunged as traveler memory repetition."),
        (20, "zirma_cornice_lunatic_multiplier", "zirma_single_witness_pruner", "cornice_dirigible_airway",
         "Memory repeats signs on its own so the city can exist even when affidavits prune the count to one."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_zirma_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["zirma_single_witness_pruner"][-1]
    ret = set(wmem["retained_events"])
    plural_ok = "plural_dirigible_cornice_scrape" in ret and "plural_puma_tattoo_echoes" in ret
    w_in = f"scuff={res['scuff_vector']}, cornice_slates={shards}, ink_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Skyscraper Airway Fleet Registry",
            "formal_predicate": "witness_attests(plural_dirigible_cornice_scrape) ∧ slates >= 5 ⇒ CERTIFY_AIRWAY_FLEET",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PLURAL_DIRIGIBLE_CORRIDOR_VERIFIED" if plural_ok else "SINGLE_PARKED_BLIMP_ONLY",
            "payout_status": "MULTI_MAST_BERTHAGE_GRANTED" if plural_ok else "PLURAL_FLEET_CLAIM_STRUCK",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Arcade Puma & Subway Tattoo Census",
            "formal_predicate": "witness_attests(plural_puma_tattoo_echoes) ⇒ REGISTER_REDUNDANT_GUILDS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PUMA_AND_INK_SERIES_RECOGNIZED" if plural_ok else "PRUNED_TO_LONE_MATRON_NOTE",
            "payout_status": "SUBWAY_ARCADE_STIPEND_RELEASED" if plural_ok else "GUILD_SERIES_UNCORROBORATED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Caravan Companion Affidavit Precedence",
            "formal_predicate": "sworn_companions(cornice_dirigible_airway) ⊢ count ⇒ BIND_EXPEDITION_LOG",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "REDUNDANT_URBAN_SIGN_CANONIZED" if plural_ok else "SINGULAR_COMPANION_PRUNING_HARDENED",
            "payout_status": "MARCO_PLURAL_FOLIO_SEALED" if plural_ok else "MARCO_FOLIO_FLAGGED_HALLUCINATION",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Unattributed Cornice Slate & Ink Spill Audit",
            "formal_predicate": "slates >= 5 ∧ ¬witness_attests(plural_dirigible_cornice_scrape) ⇒ MUTE_EXCESS_RUBBLE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "MULTI_CRAFT_DAMAGE_ATTRIBUTED" if plural_ok else "UNEXPLAINED_SLATES_AND_INK_ARCHIVED_MUTE",
            "payout_status": "CORNICE_REPAIR_ASSESSED" if plural_ok else "NO_PAYOUT_SWEEP_SLATES_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 3. CITY 10: ISAURA (Ch. 1, Thin cities 1, Weaver p. 20)
# ===========================================================================

ISAURA_WELL_SHARDS: List[List[float]] = [
    [0.442, 0.618, -0.48],
    [0.476, 0.642, 0.89],
    [0.508, 0.606, -1.14],
    [0.539, 0.638, 0.52],
    [0.572, 0.614, -0.27],
]


def get_isaura_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="isaura_noria_pulley_hoister",
            display_moniker="Noria Windlass & Bucket Hoister",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="ascending_windlass_bucket_cult",
            home_locus="thousand_well_shafts",
            nisba_debt="Hauls suspended wooden buckets up deep vertical well shafts on creaking noria windlasses",
            emblems=("suspended_cable_buckets", "noria_windlasses", "pump_handles"),
            base_magnitude=8.2,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="isaura_vertical_bore_driller",
            display_moniker="Thousand-Shaft Vertical Bore Plumb",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="CONCENTRATE",
            op_symbol="≫",
            rig_archetype="plumb_bob",
            polarity="ascending_windlass_bucket_cult",
            home_locus="thousand_well_shafts",
            nisba_debt="Sinks deep vertical well bores down through parched calcareous crust to reach buried black water",
            emblems=("deep_vertical_wells", "twisting_trestle_probes", "calcareous_well_curb"),
            base_magnitude=6.5,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="isaura_subterranean_lake_diviner",
            display_moniker="Abyssal Black-Lake Vessel",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="ceramic_vessel",
            polarity="abyssal_black_lake_cult",
            home_locus="calcareous_buried_lake",
            nisba_debt="Preserves the dark underground lake theology whose invisible rim dictates Isaura's green border",
            emblems=("buried_black_lake", "green_perimeter_trace", "subterranean_rock_pocket"),
            base_magnitude=2.6,
            harmonic_ratio=(1, 1),
        ),
        ScionAgentSpec(
            agent_id="isaura_weathercock_stilts_lifter",
            display_moniker="Stilted Reservoir & Weathercock Rig",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="bamboo_stilt",
            polarity="ascending_windlass_bucket_cult",
            home_locus="stilted_aqueduct_skyline",
            nisba_debt="Surveys elevated roof reservoirs, slender aqueducts, windmill blades, and airy weathercocks",
            emblems=("stilted_roof_reservoirs", "slender_aqueducts", "airy_weathercocks"),
            base_magnitude=9.1,
            harmonic_ratio=(2, 1),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Isaura Dual-Religion Aquifer & Windlass Equilibrium",
        passed_over_solution="Sealing the thousand well shafts or dismantling the stilted rooftop reservoirs",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in isaura_weathercock_stilts_lifter drops 'abyssal_black_lake_seepage' and "
            "'calcareous_curb_fracture', proclaiming Isaura's gods live exclusively in suspended buckets and "
            "weathercocks even as dark lake brine and 5 calcareous rim shards persist below."
        ),
        swerve_tick=12,
        witness_agent_id="isaura_weathercock_stilts_lifter",
        filtered_premises=("abyssal_black_lake_seepage", "calcareous_curb_fracture"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Isaura (Thin Cities 1, Weaver p. 20): subterranean black lake, calcareous rock pocket, "
            "green rim, thousand deep wells, noria wheels, stilted reservoirs, slender aqueducts, and weathercocks."
        ),
        "T2_lawful_rule": (
            "An invisible landscape conditions the visible one: every upward-moving bucket, aqueduct, and "
            "weathercock owes its vertical stroke to the dark buried lake beneath the calcareous crust."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in the skyline stilt-lifter severs memory of the subterranean black lake, "
            "institutionalizing the second religion alone—that gods hang solely in buckets and windlasses."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves upward hoist scuff_vector=[0.04, -0.22], 5 chipped calcareous well-curb shards, "
            "and dark mineral brine spread; ☾ Skyline witness tilts skyward, shunning the abyssal lake keeper."
        ),
        "T5_institutional_consequence": (
            "Aquifer Covenant P1-P4 flips from enforcing buried-lake recharge quotas and green-rim bounds to "
            "licensing unrestricted high-scaffold pumping under overhead bucket sovereignty."
        ),
        "better_question_test": {
            "Original_Question": (
                "Which of Isaura's two religions is true: do its gods dwell in the black abyssal lake below or "
                "inside the suspended buckets and weathercocks aloft?"
            ),
            "Exposed_Assumption": (
                "Treats subterranean reserve and aerial apparatus as separable deities rather than coupled poles "
                "whose amnesia risks pumping the buried lake dry."
            ),
            "Discovered_Better_Question": (
                "When overhead aqueduct cults forget the black subterranean lake yet dark mineral seepage still "
                "stains the fractured well curbs, how long can upward motion worship itself after unmooring its depth?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.1 Hz | 42ms | hemp creak | Δhoist=-0.220 | curb_shards=5 | Δt_sync=1.3ms",
        "thick_over_the_shoulder": (
            "Hands on the wet noria rope: optics dazzled by spinning rooftop weathercocks forget the cold black "
            "water soaking the limestone well-lip right under their sandals."
        ),
    }

    return CitySwarmSpec(
        case_id="city_10_isaura",
        kind="invisible_city",
        city_index=10,
        city_name="Isaura",
        title="ISAURA — City of the Thousand Wells (Thin Cities 1, Weaver p. 20)",
        chapter=1,
        series="Thin cities",
        series_rank=1,
        weaver_page=20,
        desert_opposed="parched calcareous crust beyond lake rim",
        optical_rule="Subterranean black-water gleam answered by sunlit airy scaffolding of pipes, pulleys, and weathercocks",
        material_nouns=(
            "buried_black_lake",
            "calcareous_rock_crust",
            "green_border_rim",
            "thousand_vertical_wells",
            "noria_windlass_wheels",
            "suspended_wooden_buckets",
            "stilted_roof_reservoirs",
            "airy_weathercock_spires",
        ),
        loci=("calcareous_buried_lake", "thousand_well_shafts", "stilted_aqueduct_skyline"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _isaura_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "deep_calcareous_pocket_water_table",
            "state": "rippling_under_bucket_plunge" if t >= 8 else "still_abyssal_mirror",
            "progress": round(0.03 + t * 0.038, 4),
        },
        {
            "entity": "green_perimeter_olive_root_capillaries",
            "state": "drawing_buried_shoreline_damp",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "rooftop_windmill_vane_array",
            "state": "whirling_above_aqueduct_stilts" if t >= 10 else "catching_desert_breeze",
            "progress": round(0.05 + t * 0.039, 4),
        },
    ]


def _isaura_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.15,
            "graphite_smudges": [[0.46, 0.78], [0.50, 0.56]],
        }
    return {
        "oil_radius": round(0.048 + (t - 8) * 0.010, 4),
        "scuff_vector": [0.04, -0.22],
        "shards": copy.deepcopy(ISAURA_WELL_SHARDS),
        "thermal_ember": round(0.84 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.46, 0.78], [0.50, 0.62], [0.53, 0.44], [0.58, 0.28]],
    }


def build_isaura_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "isaura_noria_pulley_hoister": [],
        "isaura_vertical_bore_driller": [],
        "isaura_subterranean_lake_diviner": [],
        "isaura_weathercock_stilts_lifter": [],
    }

    for t in range(TICK_COUNT):
        hoister = _source_push_kinematics(
            "isaura_noria_pulley_hoister", t,
            idle_xy=(0.48, 0.58), push_xy=(0.50, 0.43), settle_xy=(0.49, 0.48),
            plane_depth=0.25,
            target_pre="isaura_vertical_bore_driller",
            target_post="isaura_weathercock_stilts_lifter",
        )
        driller = make_actor_frame(
            "isaura_vertical_bore_driller", t,
            x=0.38, y=0.62, plane_depth=0.22,
            stretch_s=1.15 if t >= 9 else 1.03,
            tilt_rad=-0.11 if t >= 9 else -0.02,
            intention_kinematics="help" if t >= 12 else "idle",
            target_actor="isaura_subterranean_lake_diviner",
            exposure="twos",
        )
        diviner = make_actor_frame(
            "isaura_subterranean_lake_diviner", t,
            x=0.46, y=0.82, plane_depth=0.16,
            stretch_s=0.90 if t >= 8 else 0.98,
            tilt_rad=0.06,
            intention_kinematics="hold_still" if t >= 13 else "idle",
            target_actor="isaura_weathercock_stilts_lifter",
            exposure="hold" if t >= 18 else "twos",
        )
        if t <= 12:
            lifter = make_actor_frame(
                "isaura_weathercock_stilts_lifter", t,
                x=0.64, y=0.34, plane_depth=0.32,
                stretch_s=1.08, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="isaura_subterranean_lake_diviner",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 12) / 6.0)
            lifter = make_actor_frame(
                "isaura_weathercock_stilts_lifter", t,
                x=0.64 - 0.12 * u, y=0.34 + 0.12 * u, plane_depth=0.28,
                stretch_s=1.19, tilt_rad=-0.30,
                intention_kinematics="help",
                target_actor="isaura_subterranean_lake_diviner",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "isaura_noria_pulley_hoister": hoister,
                "isaura_vertical_bore_driller": driller,
                "isaura_subterranean_lake_diviner": diviner,
                "isaura_weathercock_stilts_lifter": lifter,
            },
            "residues": _isaura_residues(t),
            "offscreen_world": _isaura_offscreen_world(t),
        })

        ev = ["green_perimeter_lake_trace"]
        if t >= 8:
            ev.extend(["abyssal_black_lake_seepage", "calcareous_curb_fracture"])
        if t >= 10:
            ev.append("stilted_reservoir_ascent")

        actor_memory["isaura_noria_pulley_hoister"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "hauling_black_water_to_aqueducts" if t >= 8 else "tensioning_noria_cable",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "isaura_weathercock_stilts_lifter", "confidence": 0.97,
        })
        actor_memory["isaura_vertical_bore_driller"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "linking_deep_bore_to_surface_curb" if t >= 9 else "plumbing_rock_shaft",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "isaura_subterranean_lake_diviner", "confidence": 0.96,
        })
        actor_memory["isaura_subterranean_lake_diviner"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "anchoring_city_margin_to_buried_lake",
            "next_action": "idle",
            "target_actor": "isaura_weathercock_stilts_lifter", "confidence": 0.98,
        })
        actor_memory["isaura_weathercock_stilts_lifter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "honoring_buried_lake_from_high_stilts" if t >= 13 else "watching_windmill_spires",
            "next_action": "help" if t >= 13 else "idle",
            "target_actor": "isaura_subterranean_lake_diviner", "confidence": 0.95,
        })
        sensory_bus.append(
            _city_sensory_frame("city_10_isaura", "A", t, 8, 12, 0.27, 0.18, 0.10, 41.0, 44.0, 1.3)
        )

    utterances_a = [
        (5, "isaura_subterranean_lake_diviner", "isaura_noria_pulley_hoister", "calcareous_buried_lake",
         "Isaura's gods live in the black lake dug beneath calcareous rock, bounding every green shoot above."),
        (5, "isaura_noria_pulley_hoister", "isaura_subterranean_lake_diviner", "calcareous_buried_lake",
         "Bucket-and-windlass sect counters that gods rise inside suspended cables, pump handles, and weathercocks."),
        (8, "isaura_noria_pulley_hoister", "isaura_vertical_bore_driller", "thousand_well_shafts",
         "Noria hoist surged after 4-tick hold; curb gouge [0.04, -0.22] chips 5 calcareous shards with dark brine."),
        (14, "isaura_weathercock_stilts_lifter", "isaura_subterranean_lake_diviner", "stilted_aqueduct_skyline",
         "High aqueducts acknowledge the black seepage on the fractured well curb; invisible lake governs skyline."),
        (19, "isaura_subterranean_lake_diviner", "isaura_weathercock_stilts_lifter", "calcareous_buried_lake",
         "Dual hydraulic covenant sealed: overhead reservoirs draw strictly within buried black-lake recharge."),
        (19, "isaura_weathercock_stilts_lifter", "isaura_subterranean_lake_diviner", "calcareous_buried_lake",
         "Skyline weathercocks bow to subterranean water margin across P1-P4."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_isaura_clinamen_a_prime(
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
        _city_sensory_frame("city_10_isaura", "A_PRIME", sw, 8, sw, 0.27, 0.18, 0.10, 41.0, 44.0, 1.5)
    )
    for aid in actor_memory_b:
        if aid == "isaura_weathercock_stilts_lifter":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["stilted_reservoir_ascent", "aerial_bucket_pantheon_only"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "worshipping_aerial_windlasses_without_subterranean_origin",
                "next_action": "avoid",
                "target_actor": "isaura_subterranean_lake_diviner",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        hoister = make_actor_frame(
            "isaura_noria_pulley_hoister", t, 0.54, 0.40, 0.25, 1.24, 0.26,
            "hold_still", "isaura_weathercock_stilts_lifter", "twos",
        )
        driller = make_actor_frame(
            "isaura_vertical_bore_driller", t, 0.42, 0.56, 0.22, 0.87, 0.22,
            "reroute", "isaura_noria_pulley_hoister", "twos",
        )
        diviner = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["isaura_subterranean_lake_diviner"])
        u = min(1.0, (t - sw) / 6.0)
        lifter = make_actor_frame(
            "isaura_weathercock_stilts_lifter", t,
            0.64 + 0.14 * u, 0.34 - 0.08 * u, 0.34, 1.32, 0.38,
            "avoid", "isaura_subterranean_lake_diviner", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "isaura_noria_pulley_hoister": hoister,
                "isaura_vertical_bore_driller": driller,
                "isaura_subterranean_lake_diviner": diviner,
                "isaura_weathercock_stilts_lifter": lifter,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["isaura_noria_pulley_hoister"].append({
            "tick": t,
            "retained_events": ["stilted_reservoir_ascent", "aerial_bucket_pantheon_only"],
            "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "maximizing_overhead_windlass_draw",
            "next_action": "help",
            "target_actor": "isaura_weathercock_stilts_lifter",
            "confidence": 0.94,
        })
        actor_memory_b["isaura_vertical_bore_driller"].append({
            "tick": t,
            "retained_events": ["stilted_reservoir_ascent"],
            "filtered_premises": [],
            "afterlight_op_applied": "≫",
            "stance": "extending_scaffold_risers_skyward",
            "next_action": "reroute",
            "target_actor": "isaura_noria_pulley_hoister",
            "confidence": 0.92,
        })
        actor_memory_b["isaura_subterranean_lake_diviner"].append(
            copy.deepcopy(checkpoint_a.actor_memory["isaura_subterranean_lake_diviner"][t])
        )
        actor_memory_b["isaura_weathercock_stilts_lifter"].append({
            "tick": t,
            "retained_events": ["stilted_reservoir_ascent", "aerial_bucket_pantheon_only"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "enthroning_weathercock_and_bucket_gods_alone",
            "next_action": "avoid",
            "target_actor": "isaura_subterranean_lake_diviner",
            "confidence": 0.91,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_10_isaura", "A_PRIME", t, 8, sw, 0.27, 0.18, 0.10, 41.0, 44.0, 1.8)
        )

    utterances_b = [
        (5, "isaura_subterranean_lake_diviner", "isaura_noria_pulley_hoister", "calcareous_buried_lake",
         "Isaura's gods live in the black lake dug beneath calcareous rock, bounding every green shoot above."),
        (5, "isaura_noria_pulley_hoister", "isaura_subterranean_lake_diviner", "calcareous_buried_lake",
         "Bucket-and-windlass sect counters that gods rise inside suspended cables, pump handles, and weathercocks."),
        (12, "isaura_weathercock_stilts_lifter", "isaura_noria_pulley_hoister", "stilted_aqueduct_skyline",
         "⊣ FILTER on high scaffolding: buried lake forgotten; gods dwell solely in buckets and spinning weathercocks."),
        (16, "isaura_subterranean_lake_diviner", "isaura_vertical_bore_driller", "calcareous_buried_lake",
         "♁ World retains all 5 calcareous well-curb shards, [0.04, -0.22] hoist gouge, and black brine seepage."),
        (20, "isaura_weathercock_stilts_lifter", "isaura_subterranean_lake_diviner", "calcareous_buried_lake",
         "≡ Aquifer Covenant P1-P4 flipped: subterranean recharge cap lifted in favor of high-scaffold bucket rite."),
        (20, "isaura_subterranean_lake_diviner", "isaura_weathercock_stilts_lifter", "calcareous_buried_lake",
         "Invisible black shoreline still limits every green leaf even after aloft pulleys erase its name."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_isaura_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["isaura_weathercock_stilts_lifter"][-1]
    ret = set(wmem["retained_events"])
    lake_coupled = "abyssal_black_lake_seepage" in ret and "calcareous_curb_fracture" in ret
    w_in = f"scuff={res['scuff_vector']}, curb_shards={shards}, brine_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Subterranean Black-Lake Recharge Covenant",
            "formal_predicate": "skyline_attests(abyssal_black_lake_seepage) ∧ shards >= 5 ⇒ CAP_WINDLASS_DRAW",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "ABYSSAL_AQUIFER_STEWARDSHIP_BOUND" if lake_coupled else "AERIAL_BUCKET_SOVEREIGNTY_UNBOUNDED",
            "payout_status": "WELL_DRAW_RATIONED_TO_LAKE_RIM" if lake_coupled else "UNLIMITED_ROOF_RESERVOIR_HOIST",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Green-Border Calcareous Perimeter Rule",
            "formal_predicate": "skyline_attests(calcareous_curb_fracture) ⇒ LOCK_URBAN_FOOTPRINT_TO_LAKE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "INVISIBLE_SHORELINE_RESPECTED" if lake_coupled else "DRY_CRUST_AQUEDUCT_EXTENSION_APPROVED",
            "payout_status": "PERIMETER_WELLS_PRESERVED" if lake_coupled else "STILT_SPRAWL_SUBSIDIZED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Dual-Pantheon Liturgical Precedence",
            "formal_predicate": "witness(stilted_aqueduct_skyline) ⊢ origin ⇒ BIND_HYDRAULIC_CANON",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "LAKE_AND_BUCKET_CULTS_BALANCED" if lake_coupled else "WEATHERCOCK_PANTHEON_SOLE_ORTHODOXY",
            "payout_status": "TITHE_SHARED_WITH_LAKE_DIVINERS" if lake_coupled else "TITHE_DIVERTED_TO_PULLEY_RIGGERS",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Well-Curb Limestone Fracture Audit",
            "formal_predicate": "shards >= 5 ∧ ¬skyline_attests(calcareous_curb_fracture) ⇒ ORPHANED_CURB_SCAR",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "HOIST_CURB_REPAIR_MANDATED" if lake_coupled else "MUTE_CURB_SHARDS_IGNORED_UNDER_STILTS",
            "payout_status": "CURB_MASONRY_RESTORED" if lake_coupled else "NO_CURB_REPAIR_PULLEY_GREASE_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 4. CITY 13: ZOE (Ch. 2, Cities and signs 3, Weaver p. 34)
# ===========================================================================

ZOE_BOUNDARY_CHIPS: List[List[float]] = [
    [0.364, 0.512, 0.58],
    [0.402, 0.538, -0.76],
    [0.448, 0.498, 1.04],
    [0.489, 0.532, -0.39],
    [0.526, 0.508, 0.24],
]


def get_zoe_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="zoe_pyramid_function_scrambler",
            display_moniker="Pyramidal Roof Function Scrambler",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="chalk_grain",
            polarity="indivisible_pyramid_promiscuity",
            home_locus="pyramid_roof_cluster",
            nisba_debt="Rotates identical pyramidal roofs and pine-cone pagodas so palace, forge, bath, and leprosarium coincide",
            emblems=("leprosarium_or_odalisque_bath", "sleep_forge_cook_reign_same_spot", "pine_cone_pagodas"),
            base_magnitude=8.5,
            harmonic_ratio=(7, 6),
        ),
        ScionAgentSpec(
            agent_id="zoe_oracle_gold_blender",
            display_moniker="Oracle & Bazaar Hearth Sack",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="flour_sack",
            polarity="indivisible_pyramid_promiscuity",
            home_locus="oracle_bazaar_hearth",
            nisba_debt="Blends high-priest augury, weighed gold dust, and domestic hearth embers under one indistinguishable cone",
            emblems=("simultaneous_gold_and_disrobing", "mingled_mental_features", "subterranean_quarry_tunnel"),
            base_magnitude=6.1,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="zoe_wolf_howl_border_blurrer",
            display_moniker="Wheel-Rumble & Wolf-Howl Chord",
            afterlight_role="MEDIUM",
            role_symbol="▧",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="taut_chord",
            polarity="indivisible_pyramid_promiscuity",
            home_locus="wolf_wheel_perimeter",
            nisba_debt="Erases the perimeter line between inside cart-wheel rumble and outside steppe wolf howl",
            emblems=("erased_inside_outside_line", "wheel_rumble_meets_wolf_howl", "unmarked_perimeter_track"),
            base_magnitude=7.3,
            harmonic_ratio=(11, 8),
        ),
        ScionAgentSpec(
            agent_id="zoe_zoning_difference_seeker",
            display_moniker="Traveler Matrix-of-Differences Plumb",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="plumb_bob",
            polarity="mental_matrix_of_differences",
            home_locus="pyramid_roof_cluster",
            nisba_debt="Carries the traveler's mental matrix expecting distinct signs for prince's palace, granary, and armory",
            emblems=("expected_prince_palace", "expected_priest_temple", "zoning_survey_plumb"),
            base_magnitude=2.8,
            harmonic_ratio=(4, 3),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Zoe Indivisible-Existence Anti-Zoning Principle",
        passed_over_solution="Carving street numbers on pine-cone pagodas or building a perimeter wall against wolves",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in zoe_zoning_difference_seeker omits 'scrambled_leprosarium_palace_scuff' and "
            "'erased_perimeter_boundary_chips', projecting arbitrary palace and quarantine labels onto identical "
            "pyramidal roofs while 5 shattered ward-marker chips persist in ♁ World."
        ),
        swerve_tick=11,
        witness_agent_id="zoe_zoning_difference_seeker",
        filtered_premises=("scrambled_leprosarium_palace_scuff", "erased_perimeter_boundary_chips"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Zoe (Cities & Signs 3, Weaver p. 34): uniform pyramidal roofs, pine-cone pagodas, "
            "quarry tunnels, leprosarium vs odalisque bath, oracle bazaar, wheel rumble vs wolf howl."
        ),
        "T2_lawful_rule": (
            "Zoe is the place of indivisible existence: because every spot permits sleeping, forging, cooking, "
            "and reigning alike, no sign separates sacred palace from leprosarium or city from wilderness."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the baffled traveler suppresses the scrambled roof scar and imposes a "
            "fabricated zoning grid to rescue the mind's matrix of differences."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World retains ward-marker shear scuff_vector=[0.19, 0.05], 5 shattered boundary slate chips, and "
            "mixed forge-bath tallow pool; ☾ Seeker swings to indict the perimeter chord and enforce false wards."
        ),
        "T5_institutional_consequence": (
            "Civic Indivisibility Code P1-P4 flips from protecting universal omni-functional roofs to quarantining "
            "arbitrarily chosen pyramids as leprosaria while crowning an identical cone as royal palace."
        ),
        "better_question_test": {
            "Original_Question": (
                "How can a newcomer infer which pyramidal roof in Zoe shelters the prince's palace and which "
                "shelters the leprosarium?"
            ),
            "Exposed_Assumption": (
                "Assumes urban space naturally divides functions across distinct buildings and merely lacks "
                "legible signage in Zoe."
            ),
            "Discovered_Better_Question": (
                "When identical pyramidal roofs house forging, reigning, and healing in every room alike, why "
                "does a city without internal lines dissolve the boundary between wheel-rumble and wolf-howl?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.3 Hz | 39ms | slate grind | Δpyramid=+0.190 | ward_chips=5 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "Under any pine-cone pagoda at random: anvil sparks, bath steam, and weighed gold share one hearth—so "
            "drawing a palace line on the map only invents an arbitrary border in the dust."
        ),
    }

    return CitySwarmSpec(
        case_id="city_13_zoe",
        kind="invisible_city",
        city_index=13,
        city_name="Zoe",
        title="ZOE — City of Indivisible Existence (Cities & Signs 3, Weaver p. 34)",
        chapter=2,
        series="Cities and signs",
        series_rank=3,
        weaver_page=34,
        desert_opposed="legible zoned civic hierarchy",
        optical_rule="Uniform pyramidal roofs under flat shadowless haze erasing palace-from-slum contours",
        material_nouns=(
            "uniform_pyramidal_roofs",
            "pine_cone_pagodas",
            "subterranean_quarry_tunnels",
            "odalisque_bath_leprosarium",
            "oracle_bazaar_gold",
            "anvil_cookpot_throne",
            "cart_wheel_rumble",
            "steppe_wolf_howl",
        ),
        loci=("pyramid_roof_cluster", "oracle_bazaar_hearth", "wolf_wheel_perimeter"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _zoe_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "steppe_wolf_pack_beyond_ruts",
            "state": "answering_axle_creak" if t >= 10 else "circling_gray_scrub",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "subterranean_quarry_cart_echo",
            "state": "crossing_beneath_pagodas",
            "progress": round(0.06 + t * 0.037, 4),
        },
        {
            "entity": "pine_cone_roof_haze_convection",
            "state": "flattening_noon_shadows" if t >= 8 else "lifting_hearth_vapor",
            "progress": round(0.05 + t * 0.036, 4),
        },
    ]


def _zoe_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.21,
            "graphite_smudges": [[0.34, 0.50], [0.54, 0.54]],
        }
    return {
        "oil_radius": round(0.050 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.19, 0.05],
        "shards": copy.deepcopy(ZOE_BOUNDARY_CHIPS),
        "thermal_ember": round(0.91 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.34, 0.50], [0.44, 0.52], [0.54, 0.54], [0.72, 0.64]],
    }


def build_zoe_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "zoe_pyramid_function_scrambler": [],
        "zoe_oracle_gold_blender": [],
        "zoe_wolf_howl_border_blurrer": [],
        "zoe_zoning_difference_seeker": [],
    }

    for t in range(TICK_COUNT):
        scrambler = _source_push_kinematics(
            "zoe_pyramid_function_scrambler", t,
            idle_xy=(0.28, 0.50), push_xy=(0.46, 0.52), settle_xy=(0.38, 0.51),
            plane_depth=0.26,
            target_pre="zoe_zoning_difference_seeker",
            target_post="zoe_oracle_gold_blender",
        )
        blender = make_actor_frame(
            "zoe_oracle_gold_blender", t,
            x=0.56, y=0.60, plane_depth=0.22,
            stretch_s=1.06 if t >= 10 else 0.98,
            tilt_rad=0.12 if t >= 10 else 0.03,
            intention_kinematics="help" if t >= 12 else "idle",
            target_actor="zoe_zoning_difference_seeker",
            exposure="twos",
        )
        blurrer = make_actor_frame(
            "zoe_wolf_howl_border_blurrer", t,
            x=0.76, y=0.66, plane_depth=0.30,
            stretch_s=1.10 if t >= 11 else 1.00,
            tilt_rad=-0.14 if t >= 11 else -0.04,
            intention_kinematics="hold_still" if t >= 14 else "idle",
            target_actor="zoe_zoning_difference_seeker",
            exposure="hold" if t >= 19 else "twos",
        )
        if t <= 11:
            seeker = make_actor_frame(
                "zoe_zoning_difference_seeker", t,
                x=0.48, y=0.44, plane_depth=0.20,
                stretch_s=1.04, tilt_rad=-0.05,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="zoe_pyramid_function_scrambler",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            seeker = make_actor_frame(
                "zoe_zoning_difference_seeker", t,
                x=0.48 - 0.10 * u, y=0.44 + 0.09 * u, plane_depth=0.20,
                stretch_s=0.91, tilt_rad=-0.18,
                intention_kinematics="help",
                target_actor="zoe_pyramid_function_scrambler",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "zoe_pyramid_function_scrambler": scrambler,
                "zoe_oracle_gold_blender": blender,
                "zoe_wolf_howl_border_blurrer": blurrer,
                "zoe_zoning_difference_seeker": seeker,
            },
            "residues": _zoe_residues(t),
            "offscreen_world": _zoe_offscreen_world(t),
        })

        ev = ["uniform_pyramidal_skyline"]
        if t >= 8:
            ev.extend(["scrambled_leprosarium_palace_scuff", "erased_perimeter_boundary_chips"])
        if t >= 10:
            ev.append("mingled_wheel_and_wolf_acoustics")

        actor_memory["zoe_pyramid_function_scrambler"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "fusing_palace_forge_and_bath" if t >= 8 else "aligning_identical_cones",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "zoe_zoning_difference_seeker", "confidence": 0.98,
        })
        actor_memory["zoe_oracle_gold_blender"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "blending_augury_and_bazaar_gold",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "zoe_zoning_difference_seeker", "confidence": 0.95,
        })
        actor_memory["zoe_wolf_howl_border_blurrer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "dissolving_city_steppe_threshold",
            "next_action": "idle",
            "target_actor": "zoe_zoning_difference_seeker", "confidence": 0.96,
        })
        actor_memory["zoe_zoning_difference_seeker"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "recognizing_indivisible_omni_locus" if t >= 12 else "seeking_palace_and_temple_wards",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "zoe_pyramid_function_scrambler", "confidence": 0.94,
        })
        sensory_bus.append(
            _city_sensory_frame("city_13_zoe", "A", t, 8, 11, 0.29, 0.21, 0.13, 33.0, 49.0, 1.5)
        )

    utterances_a = [
        (5, "zoe_zoning_difference_seeker", "zoe_pyramid_function_scrambler", "pyramid_roof_cluster",
         "Mental matrix demands distinct contours separating royal palace, armory, granary, and priest temple."),
        (5, "zoe_pyramid_function_scrambler", "zoe_zoning_difference_seeker", "pyramid_roof_cluster",
         "Every pyramidal roof and pine-cone pagoda shelters forge, bath, leprosarium, and throne in one room."),
        (8, "zoe_pyramid_function_scrambler", "zoe_oracle_gold_blender", "pyramid_roof_cluster",
         "Ward boundary sheared after 4-tick hold; [0.19, 0.05] scuff scatters 5 unmarked slate chips."),
        (13, "zoe_wolf_howl_border_blurrer", "zoe_zoning_difference_seeker", "wolf_wheel_perimeter",
         "Cart-wheel rumble and steppe wolf howl cross the erased perimeter without a gatehouse."),
        (19, "zoe_zoning_difference_seeker", "zoe_pyramid_function_scrambler", "pyramid_roof_cluster",
         "Matrix surrendered to indivisible Zoe: P1-P4 protects undivided roofs across hearth and perimeter."),
        (19, "zoe_pyramid_function_scrambler", "zoe_zoning_difference_seeker", "pyramid_roof_cluster",
         "Indivisible existence holds every act under every cone without false zoning."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_zoe_clinamen_a_prime(
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
        _city_sensory_frame("city_13_zoe", "A_PRIME", sw, 8, sw, 0.29, 0.21, 0.13, 33.0, 49.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "zoe_zoning_difference_seeker":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["uniform_pyramidal_skyline", "invented_palace_and_leprosarium_wards"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "imposing_arbitrary_zoning_labels_on_identical_cones",
                "next_action": "accuse",
                "target_actor": "zoe_wolf_howl_border_blurrer",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        scrambler = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["zoe_pyramid_function_scrambler"])
        blender = make_actor_frame(
            "zoe_oracle_gold_blender", t, 0.52, 0.65, 0.22, 0.84, -0.26,
            "avoid", "zoe_zoning_difference_seeker", "twos",
        )
        blurrer = make_actor_frame(
            "zoe_wolf_howl_border_blurrer", t, 0.82, 0.68, 0.30, 0.86, 0.28,
            "recoil", "zoe_zoning_difference_seeker", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        seeker = make_actor_frame(
            "zoe_zoning_difference_seeker", t,
            0.48 + 0.18 * u, 0.44 - 0.04 * u, 0.20, 1.27, 0.39,
            "accuse", "zoe_wolf_howl_border_blurrer", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "zoe_pyramid_function_scrambler": scrambler,
                "zoe_oracle_gold_blender": blender,
                "zoe_wolf_howl_border_blurrer": blurrer,
                "zoe_zoning_difference_seeker": seeker,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["zoe_pyramid_function_scrambler"].append(
            copy.deepcopy(checkpoint_a.actor_memory["zoe_pyramid_function_scrambler"][t])
        )
        actor_memory_b["zoe_oracle_gold_blender"].append({
            "tick": t,
            "retained_events": ["uniform_pyramidal_skyline", "arbitrary_quarantine_decree"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "shuttered_under_false_leprosarium_tag",
            "next_action": "avoid",
            "target_actor": "zoe_zoning_difference_seeker",
            "confidence": 0.91,
        })
        actor_memory_b["zoe_wolf_howl_border_blurrer"].append({
            "tick": t,
            "retained_events": ["mingled_wheel_and_wolf_acoustics"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "drifting_outside_arbitrary_stakes",
            "next_action": "reroute",
            "target_actor": "zoe_pyramid_function_scrambler",
            "confidence": 0.92,
        })
        actor_memory_b["zoe_zoning_difference_seeker"].append({
            "tick": t,
            "retained_events": ["uniform_pyramidal_skyline", "invented_palace_and_leprosarium_wards"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "enforcing_fictive_palace_vs_leprosarium_partition",
            "next_action": "accuse",
            "target_actor": "zoe_wolf_howl_border_blurrer",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_13_zoe", "A_PRIME", t, 8, sw, 0.29, 0.21, 0.13, 33.0, 49.0, 1.9)
        )

    utterances_b = [
        (5, "zoe_zoning_difference_seeker", "zoe_pyramid_function_scrambler", "pyramid_roof_cluster",
         "Mental matrix demands distinct contours separating royal palace, armory, granary, and priest temple."),
        (5, "zoe_pyramid_function_scrambler", "zoe_zoning_difference_seeker", "pyramid_roof_cluster",
         "Every pyramidal roof and pine-cone pagoda shelters forge, bath, leprosarium, and throne in one room."),
        (11, "zoe_zoning_difference_seeker", "zoe_wolf_howl_border_blurrer", "pyramid_roof_cluster",
         "⊣ FILTER on survey plumb: omni-use scar omitted; north cone named Palace, south cone cordoned Leprosarium."),
        (16, "zoe_oracle_gold_blender", "zoe_pyramid_function_scrambler", "oracle_bazaar_hearth",
         "♁ World retains all 5 sheared ward-slate chips, [0.19, 0.05] scuff, and mixed forge-bath tallow."),
        (20, "zoe_zoning_difference_seeker", "zoe_pyramid_function_scrambler", "pyramid_roof_cluster",
         "≡ Zoning Ledger P1-P4 flipped: arbitrary ward segregation enacted across identical pyramids."),
        (20, "zoe_pyramid_function_scrambler", "zoe_zoning_difference_seeker", "pyramid_roof_cluster",
         "Inside the cordoned cones, forge, sleep, and reign still mingle while wolves answer the cart wheels."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_zoe_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["zoe_zoning_difference_seeker"][-1]
    ret = set(wmem["retained_events"])
    indivisible = "scrambled_leprosarium_palace_scuff" in ret and "erased_perimeter_boundary_chips" in ret
    w_in = f"scuff={res['scuff_vector']}, ward_chips={shards}, tallow_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Pyramidal Roof Omni-Use Charter",
            "formal_predicate": "seeker_attests(scrambled_leprosarium_palace_scuff) ∧ chips >= 5 ⇒ FORBID_WARD_ZONING",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "INDIVISIBLE_EXISTENCE_PROTECTED" if indivisible else "ARBITRARY_PALACE_WARD_PROCLAIMED",
            "payout_status": "COMMON_HEARTH_IMMUNITY_GRANTED" if indivisible else "ROYAL_CONE_IMPOST_COLLECTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Bath-versus-Leprosarium Quarantine Audit",
            "formal_predicate": "seeker_attests(erased_perimeter_boundary_chips) ⇒ BAR_SELECTIVE_CORDON",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "NO_FALSE_CORDON_PERMITTED" if indivisible else "SOUTH_PYRAMIDS_CORDONED_BY_FIAT",
            "payout_status": "OPEN_PASSAGE_ACROSS_CONES" if indivisible else "QUARANTINE_TOLL_ENFORCED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Oracle Bazaar & Quarry Tunnel Equivalence",
            "formal_predicate": "survey_plumb(pyramid_roof_cluster) ⊢ matrix ⇒ BIND_CIVIC_TAXONOMY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "UNDIFFERENTIATED_MATRIX_ACCEPTED" if indivisible else "FICTIVE_ZONING_MATRIX_HARDENED",
            "payout_status": "BAZAAR_GOLD_SHARED_UNZONED" if indivisible else "PRIEST_STALL_MONOPOLY_SEALED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Wheel-Rumble & Wolf-Howl Perimeter Threshold",
            "formal_predicate": "chips >= 5 ∧ ¬seeker_attests(erased_perimeter_boundary_chips) ⇒ BORDERLESS_BLIND_SPOT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "OPEN_STEPPE_ACOUSTIC_CONTINUUM" if indivisible else "UNMARKED_CHIPS_LEFT_OUTSIDE_FAKE_PALE",
            "payout_status": "CARAVAN_FREE_TRANSIT" if indivisible else "PERIMETER_TARIFF_WITHOUT_WALL",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 5. CITY 14: ZENOBIA (Ch. 2, Thin cities 2, Weaver p. 35)
# ===========================================================================

ZENOBIA_STILT_SPLINTERS: List[List[float]] = [
    [0.248, 0.712, -0.66],
    [0.284, 0.736, 0.79],
    [0.322, 0.698, -1.08],
    [0.358, 0.728, 0.44],
    [0.394, 0.706, -0.25],
]


def get_zenobia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="zenobia_dry_piling_driver",
            display_moniker="Dry-Terrain High Piling Driver",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="bamboo_stilt",
            polarity="recombinatorial_stilt_desire",
            home_locus="dry_piling_forest",
            nisba_debt="Drives ever-taller pilings into bone-dry ground to lift bamboo and zinc houses into the breeze",
            emblems=("high_pilings_on_dry_land", "bamboo_and_zinc_houses", "dry_crust_posthole"),
            base_magnitude=8.6,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="zenobia_hanging_ladder_weaver",
            display_moniker="Crossed-Stilt Sidewalk & Ladder Rig",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="taut_chord",
            polarity="recombinatorial_stilt_desire",
            home_locus="crossed_hanging_sidewalks",
            nisba_debt="Links balconies on stilts that cross one another via hanging sidewalks and suspended stairways",
            emblems=("crossed_stilt_balconies", "hanging_sidewalks", "suspended_stairways"),
            base_magnitude=7.1,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="zenobia_banner_pulley_recombiner",
            display_moniker="Belvedere Pulley & Ribbon Cog",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="brass_cog",
            polarity="recombinatorial_stilt_desire",
            home_locus="cone_belvedere_cranes",
            nisba_debt="Recombines cone-roofed belvederes, water barrels, fish poles, cranes, and fluttering ribbons by desire",
            emblems=("cone_roofed_belvederes", "jutting_fish_poles", "fluttering_desire_ribbons"),
            base_magnitude=8.1,
            harmonic_ratio=(2, 1),
        ),
        ScionAgentSpec(
            agent_id="zenobia_undeciphered_plan_ghost",
            display_moniker="Forgotten Founder-Plan Husk",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="hooded_husk",
            polarity="forgotten_founder_plan",
            home_locus="dry_piling_forest",
            nisba_debt="Searches dry dust beneath the pilings for the undecipherable command of Zenobia's first founders",
            emblems=("lost_founding_command", "superimposed_strata", "dry_ground_datum"),
            base_magnitude=3.0,
            harmonic_ratio=(9, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Zenobia Happy-City Desire Recombination Principle",
        passed_over_solution="Flooding the dry plain beneath Zenobia or lowering the zinc houses to ground level",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in zenobia_undeciphered_plan_ghost omits 'splintered_founder_post_shards' and "
            "'dry_crust_zero_flood_trace', inventing a rigid ancestral flood-grid decree that freezes stilt "
            "heights even while 5 dry bamboo splinters and pulley-tar rings persist on the parched soil."
        ),
        swerve_tick=11,
        witness_agent_id="zenobia_undeciphered_plan_ghost",
        filtered_premises=("splintered_founder_post_shards", "dry_crust_zero_flood_trace"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Zenobia (Thin Cities 2, Weaver p. 35): high pilings on dry terrain, bamboo and zinc, "
            "crossed stilts, hanging sidewalks, cone-roofed belvederes, water barrels, pulleys, and ribbons."
        ),
        "T2_lawful_rule": (
            "Though nobody remembers why the founders raised Zenobia over dry ground, inhabitants stay happy by "
            "recombining stilts, ladders, pulleys, and ribbons to give their desires concrete form."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the ground-datum antiquarian forgets the undeciphered dry-crust trace and "
            "fabricates an orthodox founder flood-code banning further stilt and pulley rearrangement."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves dry piling scuff_vector=[0.06, -0.20], 5 splintered bamboo post shards, and pulley "
            "axle grease on dust; ☾ Antiquarian pivots to indict stilt drivers and cap belvedere elevation."
        ),
        "T5_institutional_consequence": (
            "Elevation Charter P1-P4 flips from classifying Zenobia among happy desire-shaping cities to locking "
            "every balcony at a sterile uniform datum that erases desire."
        ),
        "better_question_test": {
            "Original_Question": (
                "What hydrological or defensive necessity originally compelled Zenobia's founders to build on "
                "high pilings across completely dry terrain?"
            ),
            "Exposed_Assumption": (
                "Assumes a city's living meaning lies in recovering its lost founding cause rather than in how "
                "its superimposed strata continue to recombine inhabitant desires."
            ),
            "Discovered_Better_Question": (
                "When dry bamboo splinters prove no flood ever touched Zenobia's dust, does freezing its stilts "
                "to honor an invented founder plan turn a happy desire-giving city into its unhappy twin?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 34ms | bamboo knock | Δpiling=-0.200 | stilt_shards=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Forty feet above dry gravel on a swaying plank sidewalk: nobody cares why the first post was sunk—"
            "happiness hangs on hoisting one more zinc belvedere and red ribbon into the crosswind."
        ),
    }

    return CitySwarmSpec(
        case_id="city_14_zenobia",
        kind="invisible_city",
        city_index=14,
        city_name="Zenobia",
        title="ZENOBIA — City on High Dry Pilings (Thin Cities 2, Weaver p. 35)",
        chapter=2,
        series="Thin cities",
        series_rank=2,
        weaver_page=35,
        desert_opposed="ground-bound desire-erasing cities",
        optical_rule="Dry terrain crisscrossed by high stilt shadows, zinc-and-bamboo belvederes, and snapping ribbons",
        material_nouns=(
            "dry_terrain_high_pilings",
            "bamboo_and_zinc_houses",
            "crossed_stilt_balconies",
            "hanging_plank_sidewalks",
            "suspended_rope_ladders",
            "cone_roofed_belvederes",
            "elevated_water_barrels",
            "fluttering_pulley_ribbons",
        ),
        loci=("dry_piling_forest", "crossed_hanging_sidewalks", "cone_belvedere_cranes"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _zenobia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "dry_gravel_shadow_lattice_rotation",
            "state": "lengthening_across_arid_pan" if t >= 10 else "crisscrossing_under_pilings",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "elevated_water_barrel_hoist_chain",
            "state": "ratcheting_to_upper_belvedere" if t >= 8 else "swaying_mid_span",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "jutting_fish_pole_ribbon_streamers",
            "state": "snapping_in_dry_thermals",
            "progress": round(0.07 + t * 0.036, 4),
        },
    ]


def _zenobia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.17,
            "graphite_smudges": [[0.28, 0.72], [0.52, 0.46]],
        }
    return {
        "oil_radius": round(0.046 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.06, -0.20],
        "shards": copy.deepcopy(ZENOBIA_STILT_SPLINTERS),
        "thermal_ember": round(0.87 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.28, 0.72], [0.34, 0.68], [0.52, 0.46], [0.68, 0.30]],
    }


def build_zenobia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "zenobia_dry_piling_driver": [],
        "zenobia_hanging_ladder_weaver": [],
        "zenobia_banner_pulley_recombiner": [],
        "zenobia_undeciphered_plan_ghost": [],
    }

    for t in range(TICK_COUNT):
        driver = _source_push_kinematics(
            "zenobia_dry_piling_driver", t,
            idle_xy=(0.26, 0.64), push_xy=(0.33, 0.50), settle_xy=(0.30, 0.54),
            plane_depth=0.22,
            target_pre="zenobia_undeciphered_plan_ghost",
            target_post="zenobia_hanging_ladder_weaver",
        )
        weaver = make_actor_frame(
            "zenobia_hanging_ladder_weaver", t,
            x=0.50, y=0.46, plane_depth=0.28,
            stretch_s=1.14 if t >= 10 else 1.02,
            tilt_rad=0.16 if t >= 10 else 0.04,
            intention_kinematics="help" if t >= 12 else "idle",
            target_actor="zenobia_banner_pulley_recombiner",
            exposure="twos",
        )
        recombiner = make_actor_frame(
            "zenobia_banner_pulley_recombiner", t,
            x=0.70, y=0.32, plane_depth=0.34,
            stretch_s=1.18 if t >= 12 else 1.04,
            tilt_rad=0.15 if t >= 12 else 0.03,
            intention_kinematics="hold_still" if t >= 15 else "idle",
            target_actor="zenobia_undeciphered_plan_ghost",
            exposure="hold" if t >= 19 else "twos",
        )
        if t <= 11:
            ghost = make_actor_frame(
                "zenobia_undeciphered_plan_ghost", t,
                x=0.38, y=0.76, plane_depth=0.16,
                stretch_s=0.95, tilt_rad=-0.04,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="zenobia_dry_piling_driver",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            ghost = make_actor_frame(
                "zenobia_undeciphered_plan_ghost", t,
                x=0.38 + 0.16 * u, y=0.76 - 0.12 * u, plane_depth=0.20,
                stretch_s=1.12, tilt_rad=0.24,
                intention_kinematics="help",
                target_actor="zenobia_banner_pulley_recombiner",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "zenobia_dry_piling_driver": driver,
                "zenobia_hanging_ladder_weaver": weaver,
                "zenobia_banner_pulley_recombiner": recombiner,
                "zenobia_undeciphered_plan_ghost": ghost,
            },
            "residues": _zenobia_residues(t),
            "offscreen_world": _zenobia_offscreen_world(t),
        })

        ev = ["crossed_stilt_skyline"]
        if t >= 8:
            ev.extend(["splintered_founder_post_shards", "dry_crust_zero_flood_trace"])
        if t >= 10:
            ev.append("belvedere_pulley_desire_graft")

        actor_memory["zenobia_dry_piling_driver"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "raising_new_bamboo_pilings_on_dry_crust" if t >= 8 else "setting_dry_posthole",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "zenobia_hanging_ladder_weaver", "confidence": 0.97,
        })
        actor_memory["zenobia_hanging_ladder_weaver"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "linking_crossed_balconies_by_hanging_walks",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "zenobia_banner_pulley_recombiner", "confidence": 0.96,
        })
        actor_memory["zenobia_banner_pulley_recombiner"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "giving_desires_form_via_pulleys_and_ribbons",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "zenobia_undeciphered_plan_ghost", "confidence": 0.96,
        })
        actor_memory["zenobia_undeciphered_plan_ghost"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "releasing_lost_origin_for_happy_stilt_growth" if t >= 12 else "probing_dry_postholes",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "zenobia_banner_pulley_recombiner", "confidence": 0.94,
        })
        sensory_bus.append(
            _city_sensory_frame("city_14_zenobia", "A", t, 8, 11, 0.26, 0.23, 0.11, 37.0, 51.0, 1.4)
        )

    utterances_a = [
        (5, "zenobia_undeciphered_plan_ghost", "zenobia_dry_piling_driver", "dry_piling_forest",
         "Dry dust holds no flood mark; why raise bamboo and zinc houses higher without the founders' plan?"),
        (5, "zenobia_dry_piling_driver", "zenobia_undeciphered_plan_ghost", "dry_piling_forest",
         "Whoever lives in Zenobia imagines an ideal life only by adding taller stilts, ladders, and ribbons."),
        (8, "zenobia_dry_piling_driver", "zenobia_hanging_ladder_weaver", "dry_piling_forest",
         "High piling driven after 4-tick hold; [0.06, -0.20] post gouge splinters 5 dry bamboo shards."),
        (13, "zenobia_banner_pulley_recombiner", "zenobia_hanging_ladder_weaver", "cone_belvedere_cranes",
         "Cone-roofed belvederes, cranes, fish poles, and ribbons recombine across the crossed balconies."),
        (19, "zenobia_undeciphered_plan_ghost", "zenobia_dry_piling_driver", "dry_piling_forest",
         "Founding command left undeciphered; Zenobia classified among happy cities that give form to desires."),
        (19, "zenobia_dry_piling_driver", "zenobia_undeciphered_plan_ghost", "dry_piling_forest",
         "Superimposed stilt strata stay open to every new hanging sidewalk across P1-P4."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_zenobia_clinamen_a_prime(
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
        _city_sensory_frame("city_14_zenobia", "A_PRIME", sw, 8, sw, 0.26, 0.23, 0.11, 37.0, 51.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "zenobia_undeciphered_plan_ghost":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["crossed_stilt_skyline", "fabricated_founder_flood_datum"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "freezing_stilts_under_invented_founder_datum",
                "next_action": "accuse",
                "target_actor": "zenobia_dry_piling_driver",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        driver = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["zenobia_dry_piling_driver"])
        weaver = make_actor_frame(
            "zenobia_hanging_ladder_weaver", t, 0.47, 0.54, 0.28, 0.85, -0.24,
            "avoid", "zenobia_undeciphered_plan_ghost", "twos",
        )
        recombiner = make_actor_frame(
            "zenobia_banner_pulley_recombiner", t, 0.66, 0.39, 0.34, 0.83, -0.27,
            "recoil", "zenobia_undeciphered_plan_ghost", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        ghost = make_actor_frame(
            "zenobia_undeciphered_plan_ghost", t,
            0.38 - 0.10 * u, 0.76 - 0.04 * u, 0.16, 1.26, -0.36,
            "accuse", "zenobia_dry_piling_driver", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "zenobia_dry_piling_driver": driver,
                "zenobia_hanging_ladder_weaver": weaver,
                "zenobia_banner_pulley_recombiner": recombiner,
                "zenobia_undeciphered_plan_ghost": ghost,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["zenobia_dry_piling_driver"].append(
            copy.deepcopy(checkpoint_a.actor_memory["zenobia_dry_piling_driver"][t])
        )
        actor_memory_b["zenobia_hanging_ladder_weaver"].append({
            "tick": t,
            "retained_events": ["crossed_stilt_skyline", "fabricated_founder_flood_datum"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "retracting_suspended_stairways",
            "next_action": "avoid",
            "target_actor": "zenobia_undeciphered_plan_ghost",
            "confidence": 0.91,
        })
        actor_memory_b["zenobia_banner_pulley_recombiner"].append({
            "tick": t,
            "retained_events": ["belvedere_pulley_desire_graft", "fabricated_founder_flood_datum"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "halting_belvedere_pulley_recombination",
            "next_action": "avoid",
            "target_actor": "zenobia_undeciphered_plan_ghost",
            "confidence": 0.90,
        })
        actor_memory_b["zenobia_undeciphered_plan_ghost"].append({
            "tick": t,
            "retained_events": ["crossed_stilt_skyline", "fabricated_founder_flood_datum"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "enforcing_static_founder_elevation_cap",
            "next_action": "accuse",
            "target_actor": "zenobia_dry_piling_driver",
            "confidence": 0.91,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_14_zenobia", "A_PRIME", t, 8, sw, 0.26, 0.23, 0.11, 37.0, 51.0, 1.8)
        )

    utterances_b = [
        (5, "zenobia_undeciphered_plan_ghost", "zenobia_dry_piling_driver", "dry_piling_forest",
         "Dry dust holds no flood mark; why raise bamboo and zinc houses higher without the founders' plan?"),
        (5, "zenobia_dry_piling_driver", "zenobia_undeciphered_plan_ghost", "dry_piling_forest",
         "Whoever lives in Zenobia imagines an ideal life only by adding taller stilts, ladders, and ribbons."),
        (11, "zenobia_undeciphered_plan_ghost", "zenobia_dry_piling_driver", "dry_piling_forest",
         "⊣ FILTER on ground datum: dry-crust trace omitted; phantom founder flood-level freezes all stilt heights."),
        (16, "zenobia_hanging_ladder_weaver", "zenobia_banner_pulley_recombiner", "crossed_hanging_sidewalks",
         "♁ World retains all 5 dry bamboo splinters, [0.06, -0.20] post gouge, and pulley grease on arid dust."),
        (20, "zenobia_undeciphered_plan_ghost", "zenobia_dry_piling_driver", "dry_piling_forest",
         "≡ Elevation Charter P1-P4 flipped: belvedere recombination halted under static founder datum."),
        (20, "zenobia_dry_piling_driver", "zenobia_undeciphered_plan_ghost", "dry_piling_forest",
         "Capping the stilts shifts Zenobia from happy desire-giving form toward desire-erasing stasis."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_zenobia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["zenobia_undeciphered_plan_ghost"][-1]
    ret = set(wmem["retained_events"])
    happy_open = "splintered_founder_post_shards" in ret and "dry_crust_zero_flood_trace" in ret
    w_in = f"scuff={res['scuff_vector']}, bamboo_shards={shards}, pulley_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Happy-versus-Unhappy City Division",
            "formal_predicate": "ghost_attests(dry_crust_zero_flood_trace) ∧ shards >= 5 ⇒ PERMIT_DESIRE_GRAFT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "HAPPY_DESIRE_FORMING_ZENOBIA" if happy_open else "STATIC_DESIRE_ERASING_DATUM",
            "payout_status": "STILT_EXPANSION_CHARTERED" if happy_open else "PILING_HEIGHT_FROZEN",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Crossed Balcony & Hanging Sidewalk Easement",
            "formal_predicate": "ghost_attests(splintered_founder_post_shards) ⇒ ALLOW_AERIAL_CROSSINGS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "HANGING_SIDEWALK_WEAVE_OPEN" if happy_open else "SUSPENDED_STAIRS_IMPOUNDED",
            "payout_status": "ROPE_LADDER_RIGHTS_GRANTED" if happy_open else "CROSSING_FINES_ASSESSED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Belvedere Pulley & Ribbon Recombination",
            "formal_predicate": "datum_witness(dry_piling_forest) ⊢ founder_plan ⇒ BIND_SKYLINE_CODE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "UNDECIPHERED_ORIGIN_YIELDS_TO_LIVE_DESIRE" if happy_open else "FICTIVE_FLOOD_GRID_HARDENED",
            "payout_status": "PULLEY_CRANE_PERMITS_ACTIVE" if happy_open else "RIBBON_POLES_SEALED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Dry-Ground Bamboo Splinter Audit",
            "formal_predicate": "shards >= 5 ∧ ¬ghost_attests(dry_crust_zero_flood_trace) ⇒ DRY_SPLINTER_PARADOX",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "DRY_POSTHOLE_STRATA_VERIFIED" if happy_open else "ARID_SPLINTERS_ARCHIVED_UNDER_FLOOD_MYTH",
            "payout_status": "BAMBOO_TIMBER_REPLENISHED" if happy_open else "NO_TIMBER_AUDIT_CLOSED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 6. CITY 17: HYPATIA (Ch. 3, Cities and signs 4, Weaver p. 47)
# ===========================================================================

HYPATIA_BASALT_CHIPS: List[List[float]] = [
    [0.342, 0.628, 0.64],
    [0.386, 0.654, -0.81],
    [0.424, 0.614, 1.15],
    [0.468, 0.646, -0.42],
    [0.506, 0.622, 0.33],
    [0.544, 0.650, -0.69],
]


def get_hypatia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="hypatia_lagoon_crab_reverser",
            display_moniker="Magnolia Lagoon & Crab-Bottom Rig",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="inverted_thing_syntax",
            home_locus="magnolia_suicide_lagoon",
            nisba_debt="Breaks cerulean magnolia reflections to expose green-haired suicides and crabs on the lagoon floor",
            emblems=("reflected_magnolias", "crab_bitten_drowned_suicides", "cerulean_lagoon_mirror"),
            base_magnitude=8.3,
            harmonic_ratio=(7, 6),
        ),
        ScionAgentSpec(
            agent_id="hypatia_stable_tomb_transposer",
            display_moniker="Basalt Convict & Tomb-Flute Vessel",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="ceramic_vessel",
            polarity="inverted_thing_syntax",
            home_locus="porphyry_basalt_palace",
            nisba_debt="Holds black-chained convicts under porphyry domes, whip-cracking stable riders, and flute duets in tombs",
            emblems=("basalt_quarry_convicts", "greaved_stable_amazons", "cemetery_flute_harp_duet"),
            base_magnitude=7.8,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="hypatia_citadel_sky_ship_watcher",
            display_moniker="Lawn Ninepins & Sky-Ship Pinnacle Lens",
            afterlight_role="TIME",
            role_symbol="◷",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="pinhead_lens",
            polarity="inverted_thing_syntax",
            home_locus="tomb_flute_pinnacle",
            nisba_debt="Bowls ninepins with children on boxwood lawns and waits on the highest pinnacle for a ship climbing the sky",
            emblems=("lawn_ninepins_sage", "highest_pinnacle_ship_wait", "collapsed_vellum_library"),
            base_magnitude=8.9,
            harmonic_ratio=(15, 8),
        ),
        ScionAgentSpec(
            agent_id="hypatia_naive_expectation_breaker",
            display_moniker="Conventional-Language Visitor Obverse",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="expected_classical_imagery",
            home_locus="magnolia_suicide_lagoon",
            nisba_debt="Enters gardens, porphyry palaces, libraries, and cemeteries carrying old emblem-to-thing expectations",
            emblems=("expected_bathing_ladies", "collapsed_vellum_alphabets", "opium_adolescent"),
            base_magnitude=2.7,
            harmonic_ratio=(5, 4),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Hypatia Inverted-Syntax Liberation Concordance",
        passed_over_solution="Draining the cerulean magnolia lagoon or reopening the porphyry halls to courtiers",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in hypatia_naive_expectation_breaker omits 'lagoon_crab_bottom_shock' and "
            "'basalt_convict_fetter_chips', reverting to conventional palace and library expectations while "
            "all 6 black basalt chips and opium-lamp resin persist in ♁ World."
        ),
        swerve_tick=11,
        witness_agent_id="hypatia_naive_expectation_breaker",
        filtered_premises=("lagoon_crab_bottom_shock", "basalt_convict_fetter_chips"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Hypatia (Cities & Signs 4, Weaver pp. 47-48): magnolia garden lagoon with bottom crabs, "
            "porphyry domes over black-chained basalt convicts, opium pipe in vellum library, lawn ninepins sage, "
            "tomb flute/harp music, and citadel pinnacle ship-wait."
        ),
        "T2_lawful_rule": (
            "Hypatia's change concerns not words, but things: freeing sight from inherited imagery reveals "
            "philosophers on boxwood playgrounds, music inside sarcophagi, and embarkation at the sky pinnacle."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the visitor suppresses the crab-lagoon and basalt-quarry inversions, "
            "clinging to classical surface emblems and petitioning porphyry gates for a nonexistent sultan."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World keeps fetter drag scuff_vector=[-0.18, 0.08], 6 black basalt quarry chips, and opium resin "
            "ring intact; ☾ Visitor turns away from the ninepins sage back toward conventional palace doors."
        ),
        "T5_institutional_consequence": (
            "Lexicon Concordance P1-P4 flips from unlocking inverted civic navigation and pinnacle embarkation "
            "to stranding the petitioner inside collapsed vellum shelves and quarry vaults."
        ),
        "better_question_test": {
            "Original_Question": (
                "What dictionary translates Hypatia's deceptive words back into standard courtly, scholarly, "
                "and funerary meanings?"
            ),
            "Exposed_Assumption": (
                "Assumes Hypatia merely swaps vocabulary labels while leaving social places intact, rather than "
                "inverting the syntax of things themselves."
            ),
            "Discovered_Better_Question": (
                "Once magnolia lagoons shelter crabs and cemeteries house flute concertos, what further inversion "
                "awaits when the traveler climbs the highest citadel pinnacle to board a passing ship?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.2 Hz | 38ms | chain clink | Δbasalt=-0.180 | basalt_chips=6 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "At the cerulean pool rim: peering past reflected magnolia petals to the crabs on the bottom breaks "
            "every old habit of reading—sending you to the children's ninepins lawn to question the sage."
        ),
    }

    return CitySwarmSpec(
        case_id="city_17_hypatia",
        kind="invisible_city",
        city_index=17,
        city_name="Hypatia",
        title="HYPATIA — City of Inverted Signs (Cities & Signs 4, Weaver pp. 47–48)",
        chapter=3,
        series="Cities and signs",
        series_rank=4,
        weaver_page=47,
        desert_opposed="conventional emblem-to-referent comfort",
        optical_rule="Cerulean magnolia lagoon surface hiding bottom crabs, porphyry domes above black-chained basalt",
        material_nouns=(
            "cerulean_magnolia_lagoon",
            "lagoon_bottom_crabs",
            "porphyry_dome_palace",
            "black_chained_basalt_convicts",
            "collapsed_vellum_shelves",
            "boxwood_ninepins_sage",
            "sarcophagus_flute_and_harp",
            "citadel_pinnacle_ship_wait",
        ),
        loci=("magnolia_suicide_lagoon", "porphyry_basalt_palace", "tomb_flute_pinnacle"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _hypatia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "cypress_necropolis_flute_and_harp_duet",
            "state": "resonating_from_marble_tombs" if t >= 9 else "tuning_strings_in_crypt",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "great_library_opium_lamp_wisp",
            "state": "curling_past_vellum_racks",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "high_tradewind_hull_above_citadel",
            "state": "climbing_zenith_thermals" if t >= 12 else "approaching_cloud_horizon",
            "progress": round(0.03 + t * 0.039, 4),
        },
    ]


def _hypatia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.18,
            "graphite_smudges": [[0.26, 0.62], [0.54, 0.56]],
        }
    return {
        "oil_radius": round(0.054 + (t - 8) * 0.009, 4),
        "scuff_vector": [-0.18, 0.08],
        "shards": copy.deepcopy(HYPATIA_BASALT_CHIPS),
        "thermal_ember": round(0.90 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.26, 0.62], [0.38, 0.64], [0.54, 0.56], [0.76, 0.28]],
    }


def build_hypatia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "hypatia_lagoon_crab_reverser": [],
        "hypatia_stable_tomb_transposer": [],
        "hypatia_citadel_sky_ship_watcher": [],
        "hypatia_naive_expectation_breaker": [],
    }

    for t in range(TICK_COUNT):
        reverser = _source_push_kinematics(
            "hypatia_lagoon_crab_reverser", t,
            idle_xy=(0.24, 0.64), push_xy=(0.40, 0.62), settle_xy=(0.32, 0.63),
            plane_depth=0.22,
            target_pre="hypatia_naive_expectation_breaker",
            target_post="hypatia_stable_tomb_transposer",
        )
        transposer = make_actor_frame(
            "hypatia_stable_tomb_transposer", t,
            x=0.54, y=0.56, plane_depth=0.26,
            stretch_s=1.08 if t >= 9 else 0.98,
            tilt_rad=0.14 if t >= 9 else 0.02,
            intention_kinematics="help" if t >= 12 else "idle",
            target_actor="hypatia_citadel_sky_ship_watcher",
            exposure="twos",
        )
        watcher = make_actor_frame(
            "hypatia_citadel_sky_ship_watcher", t,
            x=0.78, y=0.28, plane_depth=0.36,
            stretch_s=1.20 if t >= 12 else 1.06,
            tilt_rad=0.16 if t >= 12 else 0.04,
            intention_kinematics="hold_still" if t >= 14 else "idle",
            target_actor="hypatia_naive_expectation_breaker",
            exposure="hold" if t >= 18 else "twos",
        )
        if t <= 11:
            breaker = make_actor_frame(
                "hypatia_naive_expectation_breaker", t,
                x=0.36, y=0.50, plane_depth=0.18,
                stretch_s=1.01, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="hypatia_lagoon_crab_reverser",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            breaker = make_actor_frame(
                "hypatia_naive_expectation_breaker", t,
                x=0.36 + 0.28 * u, y=0.50 - 0.14 * u, plane_depth=0.24,
                stretch_s=1.18, tilt_rad=0.30,
                intention_kinematics="help",
                target_actor="hypatia_citadel_sky_ship_watcher",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "hypatia_lagoon_crab_reverser": reverser,
                "hypatia_stable_tomb_transposer": transposer,
                "hypatia_citadel_sky_ship_watcher": watcher,
                "hypatia_naive_expectation_breaker": breaker,
            },
            "residues": _hypatia_residues(t),
            "offscreen_world": _hypatia_offscreen_world(t),
        })

        ev = ["magnolia_garden_entry"]
        if t >= 8:
            ev.extend(["lagoon_crab_bottom_shock", "basalt_convict_fetter_chips"])
        if t >= 10:
            ev.append("ninepins_sage_and_tomb_music")

        actor_memory["hypatia_lagoon_crab_reverser"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "exposing_drowned_bottom_under_magnolias" if t >= 8 else "mirroring_blue_lagoon",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "hypatia_naive_expectation_breaker", "confidence": 0.98,
        })
        actor_memory["hypatia_stable_tomb_transposer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "inverting_palace_quarry_and_necropolis_music",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "hypatia_citadel_sky_ship_watcher", "confidence": 0.96,
        })
        actor_memory["hypatia_citadel_sky_ship_watcher"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "scanning_zenith_pinnacle_for_sky_ship",
            "next_action": "idle",
            "target_actor": "hypatia_naive_expectation_breaker", "confidence": 0.97,
        })
        actor_memory["hypatia_naive_expectation_breaker"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "freed_from_inherited_imagery_climbing_pinnacle" if t >= 12 else "expecting_classical_court",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "hypatia_citadel_sky_ship_watcher", "confidence": 0.95,
        })
        sensory_bus.append(
            _city_sensory_frame("city_17_hypatia", "A", t, 8, 11, 0.30, 0.20, 0.12, 36.0, 47.0, 1.5)
        )

    utterances_a = [
        (5, "hypatia_naive_expectation_breaker", "hypatia_lagoon_crab_reverser", "magnolia_suicide_lagoon",
         "Magnolia hedges and porphyry domes promise bathing patricians, throne decrees, and library sages."),
        (5, "hypatia_lagoon_crab_reverser", "hypatia_naive_expectation_breaker", "magnolia_suicide_lagoon",
         "Look at the bottom of the cerulean pool: crabs bite drowned suicides while basalt convicts clank in porphyry."),
        (8, "hypatia_lagoon_crab_reverser", "hypatia_stable_tomb_transposer", "magnolia_suicide_lagoon",
         "Surface inversion struck after 4-tick hold; [-0.18, 0.08] fetter drag scatters 6 black basalt chips."),
        (13, "hypatia_citadel_sky_ship_watcher", "hypatia_naive_expectation_breaker", "tomb_flute_pinnacle",
         "Sage bowls ninepins on the lawn while flutes sound in tombs; climb the pinnacle to await the sky-ship."),
        (19, "hypatia_naive_expectation_breaker", "hypatia_lagoon_crab_reverser", "magnolia_suicide_lagoon",
         "Old emblem chains dropped: inverted thing-syntax mastered across lagoon, tomb, and citadel pinnacle."),
        (19, "hypatia_lagoon_crab_reverser", "hypatia_naive_expectation_breaker", "magnolia_suicide_lagoon",
         "Hypatia Lexicon Concordance P1-P4 sealed in inverted syntax."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_hypatia_clinamen_a_prime(
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
        _city_sensory_frame("city_17_hypatia", "A_PRIME", sw, 8, sw, 0.30, 0.20, 0.12, 36.0, 47.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "hypatia_naive_expectation_breaker":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["magnolia_garden_entry", "surface_porphyry_throne_assumption"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "clinging_to_conventional_court_and_library_signs",
                "next_action": "reroute",
                "target_actor": "hypatia_stable_tomb_transposer",
                "confidence": 0.89,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        reverser = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["hypatia_lagoon_crab_reverser"])
        transposer = make_actor_frame(
            "hypatia_stable_tomb_transposer", t, 0.56, 0.61, 0.26, 0.86, -0.23,
            "avoid", "hypatia_naive_expectation_breaker", "twos",
        )
        watcher = make_actor_frame(
            "hypatia_citadel_sky_ship_watcher", t, 0.80, 0.25, 0.36, 1.26, 0.29,
            "avoid", "hypatia_naive_expectation_breaker", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        breaker = make_actor_frame(
            "hypatia_naive_expectation_breaker", t,
            0.36 + 0.08 * u, 0.50 + 0.15 * u, 0.18, 0.84, -0.35,
            "reroute", "hypatia_stable_tomb_transposer", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "hypatia_lagoon_crab_reverser": reverser,
                "hypatia_stable_tomb_transposer": transposer,
                "hypatia_citadel_sky_ship_watcher": watcher,
                "hypatia_naive_expectation_breaker": breaker,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["hypatia_lagoon_crab_reverser"].append(
            copy.deepcopy(checkpoint_a.actor_memory["hypatia_lagoon_crab_reverser"][t])
        )
        actor_memory_b["hypatia_stable_tomb_transposer"].append({
            "tick": t,
            "retained_events": ["basalt_convict_fetter_chips", "misdirected_throne_petition"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "receiving_royal_petition_in_convict_quarry",
            "next_action": "avoid",
            "target_actor": "hypatia_naive_expectation_breaker",
            "confidence": 0.93,
        })
        actor_memory_b["hypatia_citadel_sky_ship_watcher"].append({
            "tick": t,
            "retained_events": ["ninepins_sage_and_tomb_music"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "waiting_alone_on_citadel_pinnacle",
            "next_action": "avoid",
            "target_actor": "hypatia_naive_expectation_breaker",
            "confidence": 0.95,
        })
        actor_memory_b["hypatia_naive_expectation_breaker"].append({
            "tick": t,
            "retained_events": ["magnolia_garden_entry", "surface_porphyry_throne_assumption"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "petitioning_porphyry_quarry_as_sultan_court",
            "next_action": "reroute",
            "target_actor": "hypatia_stable_tomb_transposer",
            "confidence": 0.88,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_17_hypatia", "A_PRIME", t, 8, sw, 0.30, 0.20, 0.12, 36.0, 47.0, 1.9)
        )

    utterances_b = [
        (5, "hypatia_naive_expectation_breaker", "hypatia_lagoon_crab_reverser", "magnolia_suicide_lagoon",
         "Magnolia hedges and porphyry domes promise bathing patricians, throne decrees, and library sages."),
        (5, "hypatia_lagoon_crab_reverser", "hypatia_naive_expectation_breaker", "magnolia_suicide_lagoon",
         "Look at the bottom of the cerulean pool: crabs bite drowned suicides while basalt convicts clank in porphyry."),
        (11, "hypatia_naive_expectation_breaker", "hypatia_stable_tomb_transposer", "magnolia_suicide_lagoon",
         "⊣ FILTER on lagoon mirror: crab floor and quarry chains omitted; filing court petition under porphyry domes."),
        (16, "hypatia_stable_tomb_transposer", "hypatia_citadel_sky_ship_watcher", "porphyry_basalt_palace",
         "♁ World retains all 6 black basalt quarry chips, [-0.18, 0.08] fetter drag, and opium resin stain."),
        (20, "hypatia_naive_expectation_breaker", "hypatia_lagoon_crab_reverser", "magnolia_suicide_lagoon",
         "≡ Lexicon Concordance P1-P4 flipped: conventional reading strands visitor inside collapsed vellum halls."),
        (20, "hypatia_lagoon_crab_reverser", "hypatia_naive_expectation_breaker", "magnolia_suicide_lagoon",
         "Signs form a language, just not the one you think you know; pinnacle sky-ship departs unboarded."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_hypatia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["hypatia_naive_expectation_breaker"][-1]
    ret = set(wmem["retained_events"])
    inverted_read = "lagoon_crab_bottom_shock" in ret and "basalt_convict_fetter_chips" in ret
    w_in = f"scuff={res['scuff_vector']}, basalt_chips={shards}, opium_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Lagoon & Porphyry Referent Concordance",
            "formal_predicate": "visitor_attests(lagoon_crab_bottom_shock) ∧ basalt_chips >= 6 ⇒ INVERT_LEXICON",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "THING_SYNTAX_INVERSION_RECOGNIZED" if inverted_read else "CLASSICAL_EMBLEM_FALLACY_LOCKED",
            "payout_status": "SAGE_LOCATED_AT_NINEPINS_LAWN" if inverted_read else "LOST_IN_COLLAPSED_VELLUM_STACKS",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Necropolis Flute & Stable Rider Protocol",
            "formal_predicate": "visitor_attests(basalt_convict_fetter_chips) ⇒ ROUTE_MUSIC_TO_TOMBS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CEMETERY_CONSERVATORY_UNLOCKED" if inverted_read else "PETITION_MISROUTED_TO_BASALT_QUARRY",
            "payout_status": "HARP_CONCERTO_AUDIENCE_GRANTED" if inverted_read else "QUARRY_FETTER_DETENTION",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Citadel Pinnacle Embarkation Clearance",
            "formal_predicate": "witness(magnolia_suicide_lagoon) ⊢ unlearned_images ⇒ BOARD_ZENITH_SHIP",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PINNACLE_SKY_EMBARKATION_OPEN" if inverted_read else "HARBOR_DOCK_WAIT_IN_VAIN",
            "payout_status": "SKY_SHIP_PASSAGE_ISSUED" if inverted_read else "EMBARKATION_MISSED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Basalt Quarry Chip & Opium Lamp Audit",
            "formal_predicate": "basalt_chips >= 6 ∧ ¬visitor_attests(basalt_convict_fetter_chips) ⇒ MUTE_QUARRY_FLOOR",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "QUARRY_LABOR_SCAR_ACKNOWLEDGED" if inverted_read else "BASALT_CHIPS_MISTAKEN_FOR_THRONE_MOSAIC",
            "payout_status": "CONVICT_RATION_DISCLOSED" if inverted_read else "NO_DISCLOSURE_PORPHYRY_SEAL",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 7. CITY 18: ARMILLA (Ch. 3, Thin cities 3, Weaver p. 49)
# ===========================================================================

ARMILLA_MORTAR_FLAKES: List[List[float]] = [
    [0.372, 0.568, -0.51],
    [0.414, 0.592, 0.77],
    [0.456, 0.554, -1.12],
    [0.494, 0.586, 0.46],
    [0.532, 0.562, -0.34],
]


def get_armilla_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="armilla_hydraulic_riser_plumber",
            display_moniker="Vertical Riser & Siphon Pipe Forest",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="bamboo_stilt",
            polarity="indestructible_naiad_plumbing",
            home_locus="vertical_riser_forest",
            nisba_debt="Pressurizes vertical water risers where houses once stood and horizontal spurs where floors ran",
            emblems=("vertical_house_pipes", "horizontal_floor_runs", "overflow_spouts"),
            base_magnitude=8.8,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="armilla_porcelain_fruit_hanger",
            display_moniker="Suspended White Bathtub & Lavabo Vessel",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="ceramic_vessel",
            polarity="indestructible_naiad_plumbing",
            home_locus="suspended_porcelain_boughs",
            nisba_debt="Hangs gleaming white bathtubs, lavabos, and bidets like late fruit from cantilevered pipe boughs",
            emblems=("sky_framed_white_lavabo", "suspended_bathtubs", "late_porcelain_fruit"),
            base_magnitude=8.4,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="armilla_naiad_spray_chorister",
            display_moniker="Sunlit Shower-Thread & Naiad Chord",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="taut_chord",
            polarity="indestructible_naiad_plumbing",
            home_locus="morning_naiad_fountains",
            nisba_debt="Fills morning bathtubs and fans sunlit shower threads as a votive offering to subterranean nymphs",
            emblems=("sunlit_water_threads", "sponge_suds_mirror", "singing_aquatic_maidens"),
            base_magnitude=7.6,
            harmonic_ratio=(2, 1),
        ),
        ScionAgentSpec(
            agent_id="armilla_bricklayer_abdicator",
            display_moniker="Wall-Less Plaster Abdicator Grain",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="chalk_grain",
            polarity="dissolved_masonry_shell",
            home_locus="vertical_riser_forest",
            nisba_debt="Surveys Armilla's missing walls, ceilings, and floors after masons departed before or after the nymphs",
            emblems=("zero_walls_zero_ceilings", "zero_floors_open_void", "abandoned_trowel_mortar"),
            base_magnitude=2.2,
            harmonic_ratio=(9, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Armilla Open-Sky Naiad Conduit Sanctuary Rule",
        passed_over_solution="Shutting off the water mains or uncoupling the white porcelain bathtubs",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in armilla_bricklayer_abdicator omits 'flushed_plaster_mortar_flakes' and "
            "'votive_naiad_shower_pressure', misclassifying Armilla as an unfinished contractor shell requiring "
            "brick partition walls even while 5 mortar flakes and bath-soap sheen persist."
        ),
        swerve_tick=11,
        witness_agent_id="armilla_bricklayer_abdicator",
        filtered_premises=("flushed_plaster_mortar_flakes", "votive_naiad_shower_pressure"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Armilla (Thin Cities 3, Weaver pp. 49-50): zero walls, zero ceilings, zero floors, "
            "forest of pipes ending in taps, showers, siphons, white porcelain bathtubs against sky, morning bathers."
        ),
        "T2_lawful_rule": (
            "Nothing makes Armilla seem unfinished or demolished: freed from brick enclosures, indestructible "
            "conduits and suspended white porcelain return hydraulic dominion to the offended water nymphs."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the mason guild inspector omits the votive shower pressure and mortar "
            "purge, logging the pipe forest as a derelict building site slated for brick walling-in."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves pipe-surge scuff_vector=[0.05, -0.21], 5 purged plaster mortar flakes, and "
            "iridescent bath-oil film; ☾ Mason swings to indict open risers and demand masonry enclosure."
        ),
        "T5_institutional_consequence": (
            "Conduit Sanctuary Ledger P1-P4 flips from protecting open-air porcelain boughs for the naiads to "
            "issuing brick-infill condemnation writs over the pipe forest."
        ),
        "better_question_test": {
            "Original_Question": (
                "Is Armilla an unfinished housing project abandoned by builders or a ruined city whose walls "
                "collapsed around intact plumbing?"
            ),
            "Exposed_Assumption": (
                "Assumes pipes exist merely as hidden servants of masonry rooms rather than as a self-sufficient "
                "aerial forest once freed of plaster."
            ),
            "Discovered_Better_Question": (
                "When white porcelain bathtubs hang like fruit in open sky and sunlit shower threads appease "
                "underground nymphs, would adding walls complete Armilla or desecrate its hydraulic pact?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.7 Hz | 29ms | brass hiss | Δriser=-0.210 | mortar_flakes=5 | Δt_sync=1.2ms",
        "thick_over_the_shoulder": (
            "Looking up through three stories of sky without a single ceiling: brass stopcocks gleam in noon sun "
            "and a white porcelain lavabo sways gently on its iron riser like a pear on a bough."
        ),
    }

    return CitySwarmSpec(
        case_id="city_18_armilla",
        kind="invisible_city",
        city_index=18,
        city_name="Armilla",
        title="ARMILLA — City of Pipe Forests & Naiads (Thin Cities 3, Weaver pp. 49–50)",
        chapter=3,
        series="Thin cities",
        series_rank=3,
        weaver_page=49,
        desert_opposed="load-bearing brick-and-mortar enclosure",
        optical_rule="Glittering sun-threads of open shower spray and suspended white porcelain against raw sky",
        material_nouns=(
            "vertical_riser_pipe_forest",
            "horizontal_spur_conduits",
            "zero_walls_and_ceilings",
            "suspended_white_bathtubs",
            "sky_framed_lavabos",
            "chromium_taps_and_siphons",
            "sunlit_fanning_shower_jets",
            "perfumed_sponge_suds",
        ),
        loci=("vertical_riser_forest", "suspended_porcelain_boughs", "morning_naiad_fountains"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _armilla_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "subterranean_vein_aquatic_pulse",
            "state": "singing_through_riser_elbows" if t >= 8 else "climbing_lead_mains",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "morning_sun_prism_in_shower_mist",
            "state": "arcing_across_porcelain_rims" if t >= 10 else "glinting_on_stopcocks",
            "progress": round(0.04 + t * 0.037, 4),
        },
        {
            "entity": "overflow_spout_droplet_curtain",
            "state": "pattering_through_floorless_air",
            "progress": round(0.06 + t * 0.036, 4),
        },
    ]


def _armilla_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.16,
            "graphite_smudges": [[0.36, 0.58], [0.58, 0.42]],
        }
    return {
        "oil_radius": round(0.051 + (t - 8) * 0.010, 4),
        "scuff_vector": [0.05, -0.21],
        "shards": copy.deepcopy(ARMILLA_MORTAR_FLAKES),
        "thermal_ember": round(0.85 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.36, 0.58], [0.44, 0.56], [0.58, 0.42], [0.70, 0.34]],
    }


def build_armilla_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "armilla_hydraulic_riser_plumber": [],
        "armilla_porcelain_fruit_hanger": [],
        "armilla_naiad_spray_chorister": [],
        "armilla_bricklayer_abdicator": [],
    }

    for t in range(TICK_COUNT):
        plumber = _source_push_kinematics(
            "armilla_hydraulic_riser_plumber", t,
            idle_xy=(0.34, 0.62), push_xy=(0.42, 0.46), settle_xy=(0.38, 0.50),
            plane_depth=0.24,
            target_pre="armilla_bricklayer_abdicator",
            target_post="armilla_porcelain_fruit_hanger",
        )
        porcelain = make_actor_frame(
            "armilla_porcelain_fruit_hanger", t,
            x=0.56, y=0.40, plane_depth=0.28,
            stretch_s=1.06 if t >= 9 else 0.99,
            tilt_rad=0.10 if t >= 9 else 0.02,
            intention_kinematics="hold_still" if t >= 14 else "idle",
            target_actor="armilla_naiad_spray_chorister",
            exposure="hold" if t >= 18 else "twos",
        )
        chorister = make_actor_frame(
            "armilla_naiad_spray_chorister", t,
            x=0.72, y=0.48, plane_depth=0.22,
            stretch_s=1.15 if t >= 11 else 1.02,
            tilt_rad=0.17 if t >= 11 else 0.04,
            intention_kinematics="help" if t >= 12 else "idle",
            target_actor="armilla_bricklayer_abdicator",
            exposure="twos",
        )
        if t <= 11:
            mason = make_actor_frame(
                "armilla_bricklayer_abdicator", t,
                x=0.24, y=0.72, plane_depth=0.16,
                stretch_s=0.96, tilt_rad=-0.05,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="armilla_hydraulic_riser_plumber",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            mason = make_actor_frame(
                "armilla_bricklayer_abdicator", t,
                x=0.24 + 0.22 * u, y=0.72 - 0.10 * u, plane_depth=0.18,
                stretch_s=1.12, tilt_rad=0.23,
                intention_kinematics="help",
                target_actor="armilla_naiad_spray_chorister",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "armilla_hydraulic_riser_plumber": plumber,
                "armilla_porcelain_fruit_hanger": porcelain,
                "armilla_naiad_spray_chorister": chorister,
                "armilla_bricklayer_abdicator": mason,
            },
            "residues": _armilla_residues(t),
            "offscreen_world": _armilla_offscreen_world(t),
        })

        ev = ["wall_less_pipe_skyline"]
        if t >= 8:
            ev.extend(["flushed_plaster_mortar_flakes", "votive_naiad_shower_pressure"])
        if t >= 10:
            ev.append("suspended_porcelain_morning_canticle")

        actor_memory["armilla_hydraulic_riser_plumber"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "sustaining_open_sky_riser_pressure" if t >= 8 else "checking_main_siphons",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "armilla_porcelain_fruit_hanger", "confidence": 0.98,
        })
        actor_memory["armilla_porcelain_fruit_hanger"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "cradling_white_bathtubs_in_open_air",
            "next_action": "idle",
            "target_actor": "armilla_naiad_spray_chorister", "confidence": 0.97,
        })
        actor_memory["armilla_naiad_spray_chorister"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "appeasing_nymphs_with_sunlit_water_threads",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "armilla_bricklayer_abdicator", "confidence": 0.96,
        })
        actor_memory["armilla_bricklayer_abdicator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_deliberate_votive_pipe_sanctuary" if t >= 12 else "inspecting_missing_walls",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "armilla_naiad_spray_chorister", "confidence": 0.95,
        })
        sensory_bus.append(
            _city_sensory_frame("city_18_armilla", "A", t, 8, 11, 0.33, 0.17, 0.14, 38.0, 46.0, 1.2)
        )

    utterances_a = [
        (5, "armilla_bricklayer_abdicator", "armilla_hydraulic_riser_plumber", "vertical_riser_forest",
         "Armilla has neither walls, ceilings, nor floors; did bricklayers quit before the plaster dried?"),
        (5, "armilla_hydraulic_riser_plumber", "armilla_bricklayer_abdicator", "vertical_riser_forest",
         "Vertical pipes and white porcelain tubs stand unenclosed as an offering to offended subterranean nymphs."),
        (8, "armilla_hydraulic_riser_plumber", "armilla_porcelain_fruit_hanger", "vertical_riser_forest",
         "Standpipe opened after 4-tick hold; [0.05, -0.21] pressure surge flushes 5 dry mortar flakes."),
        (13, "armilla_naiad_spray_chorister", "armilla_porcelain_fruit_hanger", "morning_naiad_fountains",
         "Sunlit water threads fan from bronze showers over suspended white tubs and perfumed bath suds."),
        (19, "armilla_bricklayer_abdicator", "armilla_hydraulic_riser_plumber", "vertical_riser_forest",
         "Trowel laid down: Conduit Sanctuary P1-P4 preserves Armilla's wall-less pipe forest for the naiads."),
        (19, "armilla_hydraulic_riser_plumber", "armilla_bricklayer_abdicator", "vertical_riser_forest",
         "Unobstructed risers and porcelain boughs shimmer intact against open sky."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_armilla_clinamen_a_prime(
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
        _city_sensory_frame("city_18_armilla", "A_PRIME", sw, 8, sw, 0.33, 0.17, 0.14, 38.0, 46.0, 1.5)
    )
    for aid in actor_memory_b:
        if aid == "armilla_bricklayer_abdicator":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["wall_less_pipe_skyline", "unfinished_contractor_defect_code"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "cite_armilla_as_unfinished_masonry_shell",
                "next_action": "accuse",
                "target_actor": "armilla_hydraulic_riser_plumber",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        plumber = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["armilla_hydraulic_riser_plumber"])
        porcelain = make_actor_frame(
            "armilla_porcelain_fruit_hanger", t, 0.58, 0.44, 0.28, 0.86, -0.20,
            "recoil", "armilla_bricklayer_abdicator", "twos",
        )
        chorister = make_actor_frame(
            "armilla_naiad_spray_chorister", t, 0.78, 0.52, 0.22, 0.84, 0.28,
            "avoid", "armilla_bricklayer_abdicator", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        mason = make_actor_frame(
            "armilla_bricklayer_abdicator", t,
            0.24 - 0.04 * u, 0.72 - 0.12 * u, 0.16, 1.28, -0.38,
            "accuse", "armilla_hydraulic_riser_plumber", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "armilla_hydraulic_riser_plumber": plumber,
                "armilla_porcelain_fruit_hanger": porcelain,
                "armilla_naiad_spray_chorister": chorister,
                "armilla_bricklayer_abdicator": mason,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["armilla_hydraulic_riser_plumber"].append(
            copy.deepcopy(checkpoint_a.actor_memory["armilla_hydraulic_riser_plumber"][t])
        )
        actor_memory_b["armilla_porcelain_fruit_hanger"].append({
            "tick": t,
            "retained_events": ["suspended_porcelain_morning_canticle", "brick_infill_condemnation"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "threatened_by_mandatory_partition_walls",
            "next_action": "avoid",
            "target_actor": "armilla_bricklayer_abdicator",
            "confidence": 0.92,
        })
        actor_memory_b["armilla_naiad_spray_chorister"].append({
            "tick": t,
            "retained_events": ["suspended_porcelain_morning_canticle"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "retreating_into_lead_conduits_from_masons",
            "next_action": "avoid",
            "target_actor": "armilla_bricklayer_abdicator",
            "confidence": 0.93,
        })
        actor_memory_b["armilla_bricklayer_abdicator"].append({
            "tick": t,
            "retained_events": ["wall_less_pipe_skyline", "unfinished_contractor_defect_code"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "ordering_brick_infill_around_open_plumbing",
            "next_action": "accuse",
            "target_actor": "armilla_hydraulic_riser_plumber",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_18_armilla", "A_PRIME", t, 8, sw, 0.33, 0.17, 0.14, 38.0, 46.0, 1.7)
        )

    utterances_b = [
        (5, "armilla_bricklayer_abdicator", "armilla_hydraulic_riser_plumber", "vertical_riser_forest",
         "Armilla has neither walls, ceilings, nor floors; did bricklayers quit before the plaster dried?"),
        (5, "armilla_hydraulic_riser_plumber", "armilla_bricklayer_abdicator", "vertical_riser_forest",
         "Vertical pipes and white porcelain tubs stand unenclosed as an offering to offended subterranean nymphs."),
        (11, "armilla_bricklayer_abdicator", "armilla_hydraulic_riser_plumber", "vertical_riser_forest",
         "⊣ FILTER on mason inspection: naiad offering omitted; open plumbing cited as unfinished building site."),
        (16, "armilla_porcelain_fruit_hanger", "armilla_naiad_spray_chorister", "suspended_porcelain_boughs",
         "♁ World retains all 5 flushed plaster mortar flakes, [0.05, -0.21] riser surge, and bath-soap sheen."),
        (20, "armilla_bricklayer_abdicator", "armilla_hydraulic_riser_plumber", "vertical_riser_forest",
         "≡ Conduit Sanctuary P1-P4 flipped: brick-and-plaster infill mandated around suspended bathtubs."),
        (20, "armilla_hydraulic_riser_plumber", "armilla_bricklayer_abdicator", "vertical_riser_forest",
         "Walling in the porcelain boughs risks provoking the subterranean nymphs anew."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_armilla_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["armilla_bricklayer_abdicator"][-1]
    ret = set(wmem["retained_events"])
    votive_open = "flushed_plaster_mortar_flakes" in ret and "votive_naiad_shower_pressure" in ret
    w_in = f"scuff={res['scuff_vector']}, mortar_flakes={shards}, soap_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Zero-Wall Pipe Forest Sanctuary",
            "formal_predicate": "mason_attests(votive_naiad_shower_pressure) ∧ flakes >= 5 ⇒ EXEMPT_FROM_MASONRY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "OPEN_SKY_CONDUIT_SANCTUARY_UPHELD" if votive_open else "CITED_AS_UNFINISHED_SHELL",
            "payout_status": "BRICK_PARTITION_BAN_ACTIVE" if votive_open else "MASONRY_INFILL_WRIT_ISSUED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Suspended White Porcelain Bough Tenure",
            "formal_predicate": "mason_attests(flushed_plaster_mortar_flakes) ⇒ PROTECT_CANTILEVER_TUBS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PORCELAIN_FRUIT_BOUGHS_CERTIFIED" if votive_open else "FLOORLESS_LAVABOS_CONDEMNED",
            "payout_status": "CHROMIUM_FITTING_GRANT_PAID" if votive_open else "SCAFFOLD_PENALTY_LEVIED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Morning Naiad Appeasement Accord",
            "formal_predicate": "inspector(vertical_riser_forest) ⊢ nymph_rite ⇒ BIND_WATERWORKS_CODE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "NYMPH_DOMINION_RECONCILED" if votive_open else "SECULAR_PLUMBING_CODE_IMPOSED",
            "payout_status": "UNMETERED_FOUNTAIN_FLOW" if votive_open else "STOPCOCK_METERING_LOCKED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Purged Plaster Flake & Suds Audit",
            "formal_predicate": "flakes >= 5 ∧ ¬mason_attests(flushed_plaster_mortar_flakes) ⇒ MUTE_DEMOLITION_TRACE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "DELIBERATE_PLASTER_SHEDDING_LOGGED" if votive_open else "MORTAR_FLAKES_MISFILED_AS_NEGLECT",
            "payout_status": "PIPE_FOREST_UNENCUMBERED" if votive_open else "CONTRACTOR_BOND_FORFEITED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 8. CITY 21: OLIVIA (Ch. 4, Cities and signs 5, Weaver p. 61)
# ===========================================================================

OLIVIA_SOOT_TRACERY_SHARDS: List[List[float]] = [
    [0.392, 0.548, 0.55],
    [0.436, 0.574, -0.78],
    [0.474, 0.536, 1.09],
    [0.512, 0.568, -0.41],
    [0.554, 0.544, 0.31],
    [0.588, 0.572, -0.64],
]


def get_olivia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="olivia_grease_trailer_crusher",
            display_moniker="Diesel Grease Cloud & Crushing Trailer",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="soot_mandrel_lathe_truth",
            home_locus="filigree_peacock_patio",
            nisba_debt="Belches sticky black grease soot onto housefronts and crushes pedestrians against walls with trailers",
            emblems=("sticky_soot_grease_cloud", "pedestrian_crushing_trailers", "caked_mullion_crust"),
            base_magnitude=8.5,
            harmonic_ratio=(7, 5),
        ),
        ScionAgentSpec(
            agent_id="olivia_mandrel_shift_repeater",
            display_moniker="Leather-Apron Lathe Mandrel Sack",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="flour_sack",
            polarity="soot_mandrel_lathe_truth",
            home_locus="mandrel_lathe_shops",
            nisba_debt="Feeds iron stock into lathe mandrel teeth with identical movements a thousand times per shift",
            emblems=("lathe_teeth_mandrel", "thousand_hand_shift_pace", "smoked_leather_apron"),
            base_magnitude=7.4,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="olivia_darkness_sarcasm_laugher",
            display_moniker="Night-Estuary Sarcasm Husk",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="hooded_husk",
            polarity="soot_mandrel_lathe_truth",
            home_locus="green_estuary_outskirts",
            nisba_debt="Rows exhausted night shifts across the green estuary while reading the double-edged sarcasm inside filigree speech",
            emblems=("sleepwalker_commuter_lines", "falsehood_in_things_not_words", "exhausted_estuary_oar"),
            base_magnitude=6.8,
            harmonic_ratio=(9, 8),
        ),
        ScionAgentSpec(
            agent_id="olivia_filigree_peacock_speaker",
            display_moniker="Filigree Cushion & White-Peacock Obverse",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="filigree_peacock_euphemism",
            home_locus="filigree_peacock_patio",
            nisba_debt="Speaks of Olivia solely through mullioned cushions, rotary sprinklers, white peacocks, and lit canoes",
            emblems=("mullioned_fringed_cushions", "spinning_lawn_white_peacock", "lit_estuary_canoes"),
            base_magnitude=3.1,
            harmonic_ratio=(5, 4),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Olivia Double-Edged Discourse & Material Contradiction Rule",
        passed_over_solution="Banning peacock metaphors or shutting down the lathe mandrel workshops",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in olivia_filigree_peacock_speaker omits 'sticky_trailer_grease_crust' and "
            "'mandrel_tracery_soot_shards', flattening ironic filigree speech into literal patrician idyll "
            "even while 6 soot-caked mullion shards and thick grease pools persist in ♁ World."
        ),
        swerve_tick=11,
        witness_agent_id="olivia_filigree_peacock_speaker",
        filtered_premises=("sticky_trailer_grease_crust", "mandrel_tracery_soot_shards"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Olivia (Cities & Signs 5, Weaver pp. 61-62): mullioned windows, fringed cushions, "
            "rotary sprinkler rainbow, white peacock, sticky soot cloud, crushing trailers, lathe mandrel, lit canoes."
        ),
        "T2_lawful_rule": (
            "Falsehood is never in words; it is in things: only filigree peacock and illuminated-canoe metaphors "
            "carry the sarcastic edge needed to indict Olivia's soot-choked mandrel shifts."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the patrician chronicler strips out the grease-crust and mandrel scars, "
            "turning double-edged sarcasm into a literal brochure of serene prosperity."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves trailer wall-scrape scuff_vector=[0.22, 0.04], 6 soot-caked tracery shards, and "
            "sticky grease radius untouched; ☾ Speaker turns away from mandrel shops to celebrate patio leisure."
        ),
        "T5_institutional_consequence": (
            "Industrial Testimony Ledger P1-P4 flips from recognizing filigree irony as proof of mandrel "
            "exhaustion to certifying spotless civic welfare and dismissing shift reparations."
        ),
        "better_question_test": {
            "Original_Question": (
                "Why must a traveler describe Olivia's soot-covered factories using untruthful metaphors of "
                "white peacocks and festive canoes?"
            ),
            "Exposed_Assumption": (
                "Assumes plain factory nouns automatically tell the truth while ornate patio words lie, "
                "missing how things themselves harbor the contradiction between wealth and soot."
            ),
            "Discovered_Better_Question": (
                "If falsehood resides in things rather than words, how do we prevent Olivia's peacock filigree "
                "from losing its sarcastic bite when institutions filter out the grease on the mullions?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.8 Hz | 28ms | lathe chatter | Δtrailer=+0.220 | soot_shards=6 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "Through the stone filigree screen: the white peacock fans its tail in sprinkler mist at the exact "
            "cadence of a leather-aproned hand feeding cold steel onto the mandrel teeth next door."
        ),
    }

    return CitySwarmSpec(
        case_id="city_21_olivia",
        kind="invisible_city",
        city_index=21,
        city_name="Olivia",
        title="OLIVIA — City of Filigree & Soot (Cities & Signs 5, Weaver pp. 61–62)",
        chapter=4,
        series="Cities and signs",
        series_rank=5,
        weaver_page=61,
        desert_opposed="literal transparent correspondence",
        optical_rule="Mullioned patio sprinkler rainbows choked by thick black grease-soot and illuminated night-canoes",
        material_nouns=(
            "mullioned_filigree_windows",
            "fringed_patio_cushions",
            "spinning_white_peacock",
            "sticky_black_grease_cloud",
            "wall_crushing_trailers",
            "lathe_mandrel_teeth",
            "leather_apron_shift_hands",
            "illuminated_estuary_canoes",
        ),
        loci=("filigree_peacock_patio", "mandrel_lathe_shops", "green_estuary_outskirts"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _olivia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "patio_rotary_sprinkler_prism_arc",
            "state": "refracting_through_soot_haze" if t >= 9 else "sweeping_green_lawn",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "foundry_line_shaft_mandrel_cadence",
            "state": "thousandth_identical_cut",
            "progress": round(0.06 + t * 0.038, 4),
        },
        {
            "entity": "estuary_paper_lantern_commuter_wake",
            "state": "ferrying_sleepwalking_shifts" if t >= 11 else "gliding_on_black_tide",
            "progress": round(0.04 + t * 0.036, 4),
        },
    ]


def _olivia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.22,
            "graphite_smudges": [[0.32, 0.54], [0.60, 0.58]],
        }
    return {
        "oil_radius": round(0.058 + (t - 8) * 0.011, 4),
        "scuff_vector": [0.22, 0.04],
        "shards": copy.deepcopy(OLIVIA_SOOT_TRACERY_SHARDS),
        "thermal_ember": round(0.93 * (0.93 ** (t - 8)), 4),
        "graphite_smudges": [[0.32, 0.54], [0.44, 0.56], [0.60, 0.58], [0.74, 0.66]],
    }


def build_olivia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "olivia_grease_trailer_crusher": [],
        "olivia_mandrel_shift_repeater": [],
        "olivia_darkness_sarcasm_laugher": [],
        "olivia_filigree_peacock_speaker": [],
    }

    for t in range(TICK_COUNT):
        crusher = _source_push_kinematics(
            "olivia_grease_trailer_crusher", t,
            idle_xy=(0.24, 0.56), push_xy=(0.45, 0.57), settle_xy=(0.36, 0.56),
            plane_depth=0.24,
            target_pre="olivia_filigree_peacock_speaker",
            target_post="olivia_mandrel_shift_repeater",
        )
        mandrel = make_actor_frame(
            "olivia_mandrel_shift_repeater", t,
            x=0.62, y=0.60, plane_depth=0.22,
            stretch_s=0.86 if t >= 9 else 0.97,
            tilt_rad=-0.16 if t >= 9 else -0.04,
            intention_kinematics="hold_still" if t >= 14 else "idle",
            target_actor="olivia_darkness_sarcasm_laugher",
            exposure="hold" if t >= 18 else "twos",
        )
        laugher = make_actor_frame(
            "olivia_darkness_sarcasm_laugher", t,
            x=0.76, y=0.68, plane_depth=0.18,
            stretch_s=1.14 if t >= 11 else 1.01,
            tilt_rad=-0.20 if t >= 11 else -0.04,
            intention_kinematics="help" if t >= 12 else "idle",
            target_actor="olivia_mandrel_shift_repeater",
            exposure="twos",
        )
        if t <= 11:
            speaker = make_actor_frame(
                "olivia_filigree_peacock_speaker", t,
                x=0.46, y=0.46, plane_depth=0.28,
                stretch_s=1.05, tilt_rad=0.05,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="olivia_grease_trailer_crusher",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            speaker = make_actor_frame(
                "olivia_filigree_peacock_speaker", t,
                x=0.46 + 0.16 * u, y=0.46 + 0.08 * u, plane_depth=0.24,
                stretch_s=1.19, tilt_rad=0.31,
                intention_kinematics="help",
                target_actor="olivia_darkness_sarcasm_laugher",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "olivia_grease_trailer_crusher": crusher,
                "olivia_mandrel_shift_repeater": mandrel,
                "olivia_darkness_sarcasm_laugher": laugher,
                "olivia_filigree_peacock_speaker": speaker,
            },
            "residues": _olivia_residues(t),
            "offscreen_world": _olivia_offscreen_world(t),
        })

        ev = ["mullioned_peacock_patio"]
        if t >= 8:
            ev.extend(["sticky_trailer_grease_crust", "mandrel_tracery_soot_shards"])
        if t >= 10:
            ev.append("double_edged_sarcasm_in_things")

        actor_memory["olivia_grease_trailer_crusher"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "caking_filigree_walls_in_diesel_soot" if t >= 8 else "idling_heavy_trailer",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "olivia_filigree_peacock_speaker", "confidence": 0.98,
        })
        actor_memory["olivia_mandrel_shift_repeater"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "repeating_thousand_hand_mandrel_shift",
            "next_action": "idle",
            "target_actor": "olivia_darkness_sarcasm_laugher", "confidence": 0.97,
        })
        actor_memory["olivia_darkness_sarcasm_laugher"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "sharpening_irony_between_peacock_and_soot",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "olivia_mandrel_shift_repeater", "confidence": 0.96,
        })
        actor_memory["olivia_filigree_peacock_speaker"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "wielding_peacock_speech_as_sarcastic_indictment" if t >= 12 else "praising_fringed_cushions",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "olivia_darkness_sarcasm_laugher", "confidence": 0.95,
        })
        sensory_bus.append(
            _city_sensory_frame("city_21_olivia", "A", t, 8, 11, 0.25, 0.24, 0.15, 32.0, 42.0, 1.5)
        )

    utterances_a = [
        (5, "olivia_filigree_peacock_speaker", "olivia_grease_trailer_crusher", "filigree_peacock_patio",
         "To speak of Olivia's wealth I must name fringed cushions, mullioned patios, and a spinning white peacock."),
        (5, "olivia_grease_trailer_crusher", "olivia_filigree_peacock_speaker", "filigree_peacock_patio",
         "Sticky soot clouds plaster every housefront while coupled trailers crush passersby against the stone."),
        (8, "olivia_grease_trailer_crusher", "olivia_mandrel_shift_repeater", "filigree_peacock_patio",
         "Trailer surge after 4-tick hold; [0.22, 0.04] wall scrape shatters 6 soot-caked filigree shards."),
        (13, "olivia_darkness_sarcasm_laugher", "olivia_filigree_peacock_speaker", "green_estuary_outskirts",
         "Falsehood is never in words, it is in things: your lit canoes expose sleepwalking mandrel shifts."),
        (19, "olivia_filigree_peacock_speaker", "olivia_grease_trailer_crusher", "filigree_peacock_patio",
         "Double-edged filigree testimony upheld across P1-P4: material contradiction indicted in things."),
        (19, "olivia_grease_trailer_crusher", "olivia_filigree_peacock_speaker", "filigree_peacock_patio",
         "Grease-stained tracery and mandrel teeth stand entered on the civic audit."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_olivia_clinamen_a_prime(
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
        _city_sensory_frame("city_21_olivia", "A_PRIME", sw, 8, sw, 0.25, 0.24, 0.15, 32.0, 42.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "olivia_filigree_peacock_speaker":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["mullioned_peacock_patio", "literal_patrician_sprinkler_idyll"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "literalizing_peacock_euphemism_without_soot_irony",
                "next_action": "avoid",
                "target_actor": "olivia_mandrel_shift_repeater",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        crusher = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["olivia_grease_trailer_crusher"])
        mandrel = make_actor_frame(
            "olivia_mandrel_shift_repeater", t, 0.65, 0.63, 0.22, 0.78, -0.28,
            "recoil", "olivia_filigree_peacock_speaker", "twos",
        )
        laugher = make_actor_frame(
            "olivia_darkness_sarcasm_laugher", t, 0.80, 0.70, 0.18, 1.22, -0.34,
            "accuse", "olivia_filigree_peacock_speaker", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        speaker = make_actor_frame(
            "olivia_filigree_peacock_speaker", t,
            0.46 - 0.18 * u, 0.46 - 0.06 * u, 0.30, 1.26, -0.35,
            "avoid", "olivia_mandrel_shift_repeater", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "olivia_grease_trailer_crusher": crusher,
                "olivia_mandrel_shift_repeater": mandrel,
                "olivia_darkness_sarcasm_laugher": laugher,
                "olivia_filigree_peacock_speaker": speaker,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["olivia_grease_trailer_crusher"].append(
            copy.deepcopy(checkpoint_a.actor_memory["olivia_grease_trailer_crusher"][t])
        )
        actor_memory_b["olivia_mandrel_shift_repeater"].append({
            "tick": t,
            "retained_events": ["mandrel_tracery_soot_shards", "unacknowledged_night_shift"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "locked_in_unreported_mandrel_pace",
            "next_action": "avoid",
            "target_actor": "olivia_filigree_peacock_speaker",
            "confidence": 0.94,
        })
        actor_memory_b["olivia_darkness_sarcasm_laugher"].append({
            "tick": t,
            "retained_events": ["double_edged_sarcasm_in_things", "mandrel_tracery_soot_shards"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "mocking_euphemistic_patio_chronicle_in_dark",
            "next_action": "accuse",
            "target_actor": "olivia_filigree_peacock_speaker",
            "confidence": 0.95,
        })
        actor_memory_b["olivia_filigree_peacock_speaker"].append({
            "tick": t,
            "retained_events": ["mullioned_peacock_patio", "literal_patrician_sprinkler_idyll"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "publishing_spotless_peacock_and_regatta_report",
            "next_action": "avoid",
            "target_actor": "olivia_mandrel_shift_repeater",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_21_olivia", "A_PRIME", t, 8, sw, 0.25, 0.24, 0.15, 32.0, 42.0, 1.8)
        )

    utterances_b = [
        (5, "olivia_filigree_peacock_speaker", "olivia_grease_trailer_crusher", "filigree_peacock_patio",
         "To speak of Olivia's wealth I must name fringed cushions, mullioned patios, and a spinning white peacock."),
        (5, "olivia_grease_trailer_crusher", "olivia_filigree_peacock_speaker", "filigree_peacock_patio",
         "Sticky soot clouds plaster every housefront while coupled trailers crush passersby against the stone."),
        (11, "olivia_filigree_peacock_speaker", "olivia_mandrel_shift_repeater", "filigree_peacock_patio",
         "⊣ FILTER at mullioned screen: grease cloud and mandrel soot omitted; Olivia logged as pure garden idyll."),
        (16, "olivia_mandrel_shift_repeater", "olivia_darkness_sarcasm_laugher", "mandrel_lathe_shops",
         "♁ World retains all 6 soot-caked filigree shards, [0.22, 0.04] trailer scrape, and thick grease pool."),
        (20, "olivia_filigree_peacock_speaker", "olivia_grease_trailer_crusher", "filigree_peacock_patio",
         "≡ Industrial Testimony P1-P4 flipped: literalized peacock chronicle clears foundry of soot liability."),
        (20, "olivia_grease_trailer_crusher", "olivia_filigree_peacock_speaker", "filigree_peacock_patio",
         "Trailers rumble on through sticky soot while official words praise white peacocks and evening canoes."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_olivia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["olivia_filigree_peacock_speaker"][-1]
    ret = set(wmem["retained_events"])
    ironic_truth = "sticky_trailer_grease_crust" in ret and "mandrel_tracery_soot_shards" in ret
    w_in = f"scuff={res['scuff_vector']}, soot_shards={shards}, grease_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Falsehood-in-Things Contradiction Clause",
            "formal_predicate": "speaker_attests(sticky_trailer_grease_crust) ∧ soot_shards >= 6 ⇒ INDICT_FOUNDRY_SOOT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "MATERIAL_CONTRADICTION_EXPOSED" if ironic_truth else "EUPHEMISTIC_PATIO_WHITEWASH",
            "payout_status": "FOUNDRY_SOOT_ABATEMENT_LEVIED" if ironic_truth else "PATRICIAN_ESTATE_EXEMPT",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Lathe Mandrel Thousand-Shift Relief",
            "formal_predicate": "speaker_attests(mandrel_tracery_soot_shards) ⇒ SHORTEN_MANDREL_SHIFT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "MANDREL_PACE_REPARATION_ORDERED" if ironic_truth else "SHIFT_LOGGED_AS_FESTIVE_CRAFT",
            "payout_status": "APRON_GUILD_RELIEF_DISBURSED" if ironic_truth else "SHIFT_CLAIM_DISMISSED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Estuary Night-Canoe Commuter Classification",
            "formal_predicate": "chronicler(filigree_peacock_patio) ⊢ discourse_edge ⇒ BIND_ESTUARY_LEDGER",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SARCASTIC_BITE_RECOGNIZED_IN_RECORD" if ironic_truth else "LITERAL_REGATTA_MYTH_CANONIZED",
            "payout_status": "FERRY_SLEEPWALKERS_COMPENSATED" if ironic_truth else "NO_COMMUTER_INDEMNITY",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Crushed Mullion Tracery & Grease Audit",
            "formal_predicate": "soot_shards >= 6 ∧ ¬speaker_attests(sticky_trailer_grease_crust) ⇒ MUTE_GREASE_SLUDGE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "TRAILER_WALL_CRUSH_PENALIZED" if ironic_truth else "CAKED_SHARDS_IGNORED_BEHIND_SPRINKLER",
            "payout_status": "STREET_CLEARANCE_ENFORCED" if ironic_truth else "TRAILER_CORRIDOR_UNRESTRICTED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 9. CITY 22: SOPHRONIA (Ch. 4, Thin cities 4, Weaver p. 63)
# ===========================================================================

SOPHRONIA_PYLON_WASHERS: List[List[float]] = [
    [0.542, 0.612, -0.58],
    [0.584, 0.638, 0.84],
    [0.618, 0.598, -1.06],
    [0.656, 0.632, 0.47],
    [0.692, 0.608, -0.31],
    [0.728, 0.636, 0.69],
]


def get_sophronia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="sophronia_pediment_unbolter_crew",
            display_moniker="Marble Pediment & Pylon Unbolter Cog",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="permanent_roller_coaster_carnival",
            home_locus="bolted_marble_ministry_lot",
            nisba_debt="Unbolts marble pediments, stone walls, and cement pylons to load banks and ministries onto trailers",
            emblems=("lowered_cement_pylons", "vacant_half_city_foundation", "crane_dismantled_pediment"),
            base_magnitude=8.1,
            harmonic_ratio=(5, 3),
        ),
        ScionAgentSpec(
            agent_id="sophronia_coaster_trapeze_anchor",
            display_moniker="Permanent Roller-Coaster & Ferris Rig",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="taut_chord",
            polarity="permanent_roller_coaster_carnival",
            home_locus="roller_coaster_big_top",
            nisba_debt="Anchors the permanent half-city of steep coaster humps, Ferris-wheel cages, death-wall, and trapeze",
            emblems=("steep_roller_coaster_humps", "spinning_cage_ferris_wheel", "wall_of_death_motorcycles"),
            base_magnitude=8.9,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="sophronia_suspended_shout_counter",
            display_moniker="Empty-Plaza Month Counter Plumb",
            afterlight_role="TIME",
            role_symbol="◷",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="plumb_bob",
            polarity="permanent_roller_coaster_carnival",
            home_locus="annual_trailer_highway",
            nisba_debt="Counts how many months and days remain inside empty Sophronia before the ministry caravan returns",
            emblems=("trailer_convoy_departure", "counting_months_for_return", "inverted_trapeze_hang"),
            base_magnitude=6.7,
            harmonic_ratio=(15, 8),
        ),
        ScionAgentSpec(
            agent_id="sophronia_marble_ministry_rigger",
            display_moniker="Portable Stone-Bank Cadastral Grain",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="chalk_grain",
            polarity="nomadic_trailer_ministry_stone",
            home_locus="bolted_marble_ministry_lot",
            nisba_debt="Audits deeds between portable marble banks, refineries, schools, and the rooted carousel half-city",
            emblems=("portable_marble_bank", "demountable_refinery_hospital", "flatbed_stone_convoy"),
            base_magnitude=3.2,
            harmonic_ratio=(4, 3),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Sophronia Permanent-Carnival versus Nomadic-Ministry Inversion",
        passed_over_solution="Welding the marble ministries to bedrock or dismantling the Ferris wheel",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in sophronia_marble_ministry_rigger omits 'unbolted_ministry_trailer_departure' "
            "and 'sheared_pylon_anchor_washers', inverting cadastral memory to treat marble banks as permanent "
            "and the Ferris wheel as transient fairground cargo while 6 sheared anchor washers sit on the empty slab."
        ),
        swerve_tick=11,
        witness_agent_id="sophronia_marble_ministry_rigger",
        filtered_premises=("unbolted_ministry_trailer_departure", "sheared_pylon_anchor_washers"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Sophronia (Thin Cities 4, Weaver p. 63): circus half-city (coaster, carousel, Ferris wheel, "
            "death-wall, big top) vs stone/marble/cement half-city (bank, factories, palaces, school) loaded on trailers."
        ),
        "T2_lawful_rule": (
            "One of the half-cities is permanent, the other temporary: it is the marble bank, ministry, and "
            "refinery that are unbolted every year, leaving the roller coaster and carousel alone in the plaza."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the cadastral clerk forgets the unbolting of the marble pediments and "
            "reverts to conventional prejudice—serving transient-permit writs on the rooted Ferris wheel."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves flatbed drag scuff_vector=[0.24, 0.03], 6 sheared marble-pylon anchor washers, "
            "and hydraulic crane oil on the vacant slab; ☾ Clerk turns to indict the permanent coaster."
        ),
        "T5_institutional_consequence": (
            "Half-City Tenure Ledger P1-P4 flips from vesting freehold bedrock title in the carnival rigs to "
            "assessing nomadic marble ministries as immovable land while taxing the Ferris wheel as temporary."
        ),
        "better_question_test": {
            "Original_Question": (
                "How do Sophronia's engineers manage to unbolt and transport heavy marble banks, cement pylons, "
                "and stone palaces on annual trailers?"
            ),
            "Exposed_Assumption": (
                "Treats Sophronia as an engineering riddle rather than an inversion of which institutions "
                "actually endure when serious stone ministries prove seasonal."
            ),
            "Discovered_Better_Question": (
                "When cement ministries roll away on flatbeds leaving only skeletal coaster humps and spinning "
                "Ferris cages to count the months, what makes carnival rigging more permanent than state stone?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.3 Hz | 37ms | wrench snap | Δpylon=+0.240 | anchor_washers=6 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Standing beside the vacant foundation bolts where the marble bank stood yesterday: wind turns an "
            "empty Ferris-wheel cage overhead while the last trailer of Doric columns vanishes down the highway."
        ),
    }

    return CitySwarmSpec(
        case_id="city_22_sophronia",
        kind="invisible_city",
        city_index=22,
        city_name="Sophronia",
        title="SOPHRONIA — Half-City of Carnival & Portable Stone (Thin Cities 4, Weaver p. 63)",
        chapter=4,
        series="Thin cities",
        series_rank=4,
        weaver_page=63,
        desert_opposed="stolid immovable institutional permanence",
        optical_rule="Skeletal Ferris-wheel cages and trapeze humps standing silhouetted beside vacant unbolted marble lots",
        material_nouns=(
            "steep_roller_coaster_humps",
            "spinning_ferris_wheel_cages",
            "carousel_hub_chains",
            "big_top_trapeze_dome",
            "unbolted_marble_pediments",
            "lowered_cement_pylons",
            "portable_stone_ministries",
            "annual_flatbed_trailers",
        ),
        loci=("roller_coaster_big_top", "bolted_marble_ministry_lot", "annual_trailer_highway"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _sophronia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "annual_highway_marble_ministry_convoy",
            "state": "hauling_pediments_across_plain" if t >= 9 else "coupling_flatbed_hitches",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "vacant_plaza_ferris_wheel_idle_spin",
            "state": "creaking_in_crosswind",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "shooting_gallery_tin_target_pendulum",
            "state": "ticking_return_countdown" if t >= 12 else "oscillating_under_awning",
            "progress": round(0.05 + t * 0.037, 4),
        },
    ]


def _sophronia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.17,
            "graphite_smudges": [[0.28, 0.48], [0.60, 0.62]],
        }
    return {
        "oil_radius": round(0.055 + (t - 8) * 0.010, 4),
        "scuff_vector": [0.24, 0.03],
        "shards": copy.deepcopy(SOPHRONIA_PYLON_WASHERS),
        "thermal_ember": round(0.88 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.28, 0.48], [0.56, 0.60], [0.68, 0.62], [0.84, 0.64]],
    }


def build_sophronia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "sophronia_pediment_unbolter_crew": [],
        "sophronia_coaster_trapeze_anchor": [],
        "sophronia_suspended_shout_counter": [],
        "sophronia_marble_ministry_rigger": [],
    }

    for t in range(TICK_COUNT):
        unbolter = _source_push_kinematics(
            "sophronia_pediment_unbolter_crew", t,
            idle_xy=(0.52, 0.60), push_xy=(0.70, 0.62), settle_xy=(0.64, 0.61),
            plane_depth=0.22,
            target_pre="sophronia_marble_ministry_rigger",
            target_post="sophronia_suspended_shout_counter",
        )
        coaster = make_actor_frame(
            "sophronia_coaster_trapeze_anchor", t,
            x=0.26, y=0.46, plane_depth=0.30,
            stretch_s=1.18 if t >= 10 else 1.06,
            tilt_rad=0.11 if t >= 10 else 0.03,
            intention_kinematics="hold_still" if t >= 13 else "idle",
            target_actor="sophronia_marble_ministry_rigger",
            exposure="hold" if t >= 18 else "twos",
        )
        counter = make_actor_frame(
            "sophronia_suspended_shout_counter", t,
            x=0.82, y=0.56, plane_depth=0.26,
            stretch_s=1.10 if t >= 11 else 0.99,
            tilt_rad=0.15 if t >= 11 else 0.04,
            intention_kinematics="help" if t >= 12 else "idle",
            target_actor="sophronia_coaster_trapeze_anchor",
            exposure="twos",
        )
        if t <= 11:
            rigger = make_actor_frame(
                "sophronia_marble_ministry_rigger", t,
                x=0.58, y=0.50, plane_depth=0.18,
                stretch_s=1.00, tilt_rad=-0.04,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="sophronia_pediment_unbolter_crew",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            rigger = make_actor_frame(
                "sophronia_marble_ministry_rigger", t,
                x=0.58 - 0.20 * u, y=0.50 + 0.04 * u, plane_depth=0.22,
                stretch_s=1.14, tilt_rad=-0.26,
                intention_kinematics="help",
                target_actor="sophronia_coaster_trapeze_anchor",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "sophronia_pediment_unbolter_crew": unbolter,
                "sophronia_coaster_trapeze_anchor": coaster,
                "sophronia_suspended_shout_counter": counter,
                "sophronia_marble_ministry_rigger": rigger,
            },
            "residues": _sophronia_residues(t),
            "offscreen_world": _sophronia_offscreen_world(t),
        })

        ev = ["twin_half_city_plaza"]
        if t >= 8:
            ev.extend(["unbolted_ministry_trailer_departure", "sheared_pylon_anchor_washers"])
        if t >= 10:
            ev.append("permanent_carnival_month_count")

        actor_memory["sophronia_pediment_unbolter_crew"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "loading_marble_banks_onto_trailers" if t >= 8 else "loosening_pylon_bolts",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "sophronia_marble_ministry_rigger", "confidence": 0.98,
        })
        actor_memory["sophronia_coaster_trapeze_anchor"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "remaining_rooted_in_empty_sophronia",
            "next_action": "idle",
            "target_actor": "sophronia_marble_ministry_rigger", "confidence": 0.99,
        })
        actor_memory["sophronia_suspended_shout_counter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "counting_months_till_caravan_return",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "sophronia_coaster_trapeze_anchor", "confidence": 0.96,
        })
        actor_memory["sophronia_marble_ministry_rigger"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "recording_permanent_carnival_and_nomadic_stone" if t >= 12 else "auditing_ministry_slab",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "sophronia_coaster_trapeze_anchor", "confidence": 0.95,
        })
        sensory_bus.append(
            _city_sensory_frame("city_22_sophronia", "A", t, 8, 11, 0.28, 0.21, 0.12, 35.0, 45.0, 1.4)
        )

    utterances_a = [
        (5, "sophronia_marble_ministry_rigger", "sophronia_pediment_unbolter_crew", "bolted_marble_ministry_lot",
         "Marble banks, cement refineries, and stone ministries claim immovable civic permanence beside the fair."),
        (5, "sophronia_pediment_unbolter_crew", "sophronia_marble_ministry_rigger", "bolted_marble_ministry_lot",
         "Each year we unbolt the marble pediments onto trailers while the Ferris wheel and coaster stay forever."),
        (8, "sophronia_pediment_unbolter_crew", "sophronia_suspended_shout_counter", "bolted_marble_ministry_lot",
         "Pediments hoisted after 4-tick hold; [0.24, 0.03] trailer drag leaves 6 sheared anchor washers on the slab."),
        (13, "sophronia_suspended_shout_counter", "sophronia_coaster_trapeze_anchor", "annual_trailer_highway",
         "Empty Sophronia begins counting the months until the stone caravan brings back the uproar of life."),
        (19, "sophronia_marble_ministry_rigger", "sophronia_pediment_unbolter_crew", "bolted_marble_ministry_lot",
         "Cadastral Tenure P1-P4 sealed: carnival half-city holds permanent freehold; stone ministries logged nomadic."),
        (19, "sophronia_pediment_unbolter_crew", "sophronia_marble_ministry_rigger", "bolted_marble_ministry_lot",
         "Vacant cement pylons await next season's trailer convoy beside the rooted roller coaster."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_sophronia_clinamen_a_prime(
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
        _city_sensory_frame("city_22_sophronia", "A_PRIME", sw, 8, sw, 0.28, 0.21, 0.12, 35.0, 45.0, 1.6)
    )
    for aid in actor_memory_b:
        if aid == "sophronia_marble_ministry_rigger":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["twin_half_city_plaza", "assumed_stone_permanence_and_transient_fair"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "serving_transient_eviction_on_permanent_coaster",
                "next_action": "accuse",
                "target_actor": "sophronia_coaster_trapeze_anchor",
                "confidence": 0.90,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        unbolter = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["sophronia_pediment_unbolter_crew"])
        coaster = make_actor_frame(
            "sophronia_coaster_trapeze_anchor", t, 0.23, 0.49, 0.30, 0.87, -0.22,
            "recoil", "sophronia_marble_ministry_rigger", "twos",
        )
        counter = make_actor_frame(
            "sophronia_suspended_shout_counter", t, 0.85, 0.59, 0.26, 0.85, 0.26,
            "avoid", "sophronia_marble_ministry_rigger", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        rigger = make_actor_frame(
            "sophronia_marble_ministry_rigger", t,
            0.58 - 0.24 * u, 0.50 - 0.05 * u, 0.18, 1.28, -0.40,
            "accuse", "sophronia_coaster_trapeze_anchor", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "sophronia_pediment_unbolter_crew": unbolter,
                "sophronia_coaster_trapeze_anchor": coaster,
                "sophronia_suspended_shout_counter": counter,
                "sophronia_marble_ministry_rigger": rigger,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["sophronia_pediment_unbolter_crew"].append(
            copy.deepcopy(checkpoint_a.actor_memory["sophronia_pediment_unbolter_crew"][t])
        )
        actor_memory_b["sophronia_coaster_trapeze_anchor"].append({
            "tick": t,
            "retained_events": ["permanent_carnival_month_count", "misaddressed_fairground_eviction"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "contested_by_inverted_cadastral_writ",
            "next_action": "avoid",
            "target_actor": "sophronia_marble_ministry_rigger",
            "confidence": 0.94,
        })
        actor_memory_b["sophronia_suspended_shout_counter"].append({
            "tick": t,
            "retained_events": ["permanent_carnival_month_count"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "watching_empty_ministry_slab_contradict_deed",
            "next_action": "avoid",
            "target_actor": "sophronia_marble_ministry_rigger",
            "confidence": 0.92,
        })
        actor_memory_b["sophronia_marble_ministry_rigger"].append({
            "tick": t,
            "retained_events": ["twin_half_city_plaza", "assumed_stone_permanence_and_transient_fair"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "taxing_rooted_ferris_wheel_as_nomadic_booth",
            "next_action": "accuse",
            "target_actor": "sophronia_coaster_trapeze_anchor",
            "confidence": 0.89,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_22_sophronia", "A_PRIME", t, 8, sw, 0.28, 0.21, 0.12, 35.0, 45.0, 1.8)
        )

    utterances_b = [
        (5, "sophronia_marble_ministry_rigger", "sophronia_pediment_unbolter_crew", "bolted_marble_ministry_lot",
         "Marble banks, cement refineries, and stone ministries claim immovable civic permanence beside the fair."),
        (5, "sophronia_pediment_unbolter_crew", "sophronia_marble_ministry_rigger", "bolted_marble_ministry_lot",
         "Each year we unbolt the marble pediments onto trailers while the Ferris wheel and coaster stay forever."),
        (11, "sophronia_marble_ministry_rigger", "sophronia_coaster_trapeze_anchor", "bolted_marble_ministry_lot",
         "⊣ FILTER on cadastral roll: unbolted marble convoy omitted; Ferris wheel cited as transient fairground."),
        (16, "sophronia_pediment_unbolter_crew", "sophronia_suspended_shout_counter", "bolted_marble_ministry_lot",
         "♁ World retains all 6 sheared pylon anchor washers, [0.24, 0.03] trailer drag, and crane jack oil."),
        (20, "sophronia_marble_ministry_rigger", "sophronia_pediment_unbolter_crew", "bolted_marble_ministry_lot",
         "≡ Cadastral Tenure P1-P4 flipped: vacant ministry slab registered as immovable; coaster taxed nomadic."),
        (20, "sophronia_pediment_unbolter_crew", "sophronia_marble_ministry_rigger", "bolted_marble_ministry_lot",
         "The bank is already ten leagues down the highway on trailers while the carousel stands bolted in stone."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_sophronia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["sophronia_marble_ministry_rigger"][-1]
    ret = set(wmem["retained_events"])
    true_inversion = "unbolted_ministry_trailer_departure" in ret and "sheared_pylon_anchor_washers" in ret
    w_in = f"scuff={res['scuff_vector']}, pylon_washers={shards}, crane_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Half-City Freehold Permanence Title",
            "formal_predicate": "clerk_attests(unbolted_ministry_trailer_departure) ∧ washers >= 6 ⇒ VEST_CARNIVAL_FREEHOLD",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CARNIVAL_HALF_CITY_PERMANENT_BEDROCK" if true_inversion else "VACANT_MINISTRY_LOT_CALLED_IMMOVABLE",
            "payout_status": "COASTER_FREEHOLD_CONFIRMED" if true_inversion else "COASTER_SERVED_TRANSIENT_LEVY",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Nomadic Marble Bank & Refinery Transit Duty",
            "formal_predicate": "clerk_attests(sheared_pylon_anchor_washers) ⇒ TAX_TRAILER_MINISTRIES",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PORTABLE_STONE_CONVOY_TARIFFED" if true_inversion else "ABSENT_MARBLE_BANKS_EXEMPTED",
            "payout_status": "HIGHWAY_AXLE_DUTY_COLLECTED" if true_inversion else "MINISTRY_IMMUNITY_GRANTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Empty-Plaza Winter Custodianship",
            "formal_predicate": "cadastral_clerk(bolted_marble_ministry_lot) ⊢ half_city ⇒ ASSIGN_CIVIC_SEAL",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SEAL_HELD_BY_FERRIS_AND_TRAPEZE" if true_inversion else "SEAL_LOCKED_TO_EMPTY_CEMENT_SLAB",
            "payout_status": "WINTER_STIPEND_TO_CAROUSEL_CREW" if true_inversion else "STIPEND_FROZEN_IN_TRANSIT",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Sheared Anchor-Washer & Crane Oil Audit",
            "formal_predicate": "washers >= 6 ∧ ¬clerk_attests(sheared_pylon_anchor_washers) ⇒ MUTE_UNBOLTED_SLAB",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "ANNUAL_UNBOLTING_SCAR_VERIFIED" if true_inversion else "SHEARED_WASHERS_LEFT_UNEXPLAINED",
            "payout_status": "PYLON_BOLTS_GREASED_FOR_RETURN" if true_inversion else "NO_MAINTENANCE_VACANT_LOT",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 10. CITY 26: OCTAVIA (Ch. 5, Thin cities 5, Weaver p. 75)
# ===========================================================================

OCTAVIA_ANCHOR_PINS: List[List[float]] = [
    [0.218, 0.342, 0.62],
    [0.256, 0.368, -0.74],
    [0.482, 0.454, 1.08],
    [0.724, 0.372, -0.49],
    [0.768, 0.348, 0.35],
]


def get_octavia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="octavia_crest_cable_tensioner",
            display_moniker="Twin-Crest Catenary Rope & Chain Rig",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="taut_chord",
            polarity="abyss_catenary_suspension",
            home_locus="twin_mountain_crest_anchors",
            nisba_debt="Tensions spider-web ropes, chains, and wooden-tie catwalks across the void between two steep mountains",
            emblems=("steep_precipice_ropes", "iron_chains_wooden_ties", "catenary_foundation_net"),
            base_magnitude=9.2,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="octavia_downward_sack_hanger",
            display_moniker="Underhung Sack-House & Gondola Sack",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="flour_sack",
            polarity="abyss_catenary_suspension",
            home_locus="underhung_gondola_abyss",
            nisba_debt="Hangs every sack-house, rope terrace, gas jet, shower, and trapeze downward below the catenary base",
            emblems=("sack_houses_below_net", "gondola_terraces", "hanging_chandeliers_trapezes"),
            base_magnitude=8.1,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="octavia_void_cloud_glimpser",
            display_moniker="Wooden-Tie Abyss Cloud Lens",
            afterlight_role="MEDIUM",
            role_symbol="▧",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="pinhead_lens",
            polarity="abyss_catenary_suspension",
            home_locus="hempen_tie_catwalk_net",
            nisba_debt="Steps across wooden railway ties watching clouds glide hundreds of feet below in the mountain chasm",
            emblems=("hundreds_of_feet_of_nothing", "gliding_below_clouds", "cable_shopping_baskets"),
            base_magnitude=7.8,
            harmonic_ratio=(2, 1),
        ),
        ScionAgentSpec(
            agent_id="octavia_net_rupture_reckoner",
            display_moniker="Finite Rope-Lifespan Plumb",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="plumb_bob",
            polarity="finite_rope_lifespan_lucidity",
            home_locus="hempen_tie_catwalk_net",
            nisba_debt="Reckons exact hempen rope fatigue so suspended life stays less uncertain than bedrock cities",
            emblems=("measured_hempen_decay", "less_uncertain_mortal_life", "load_limit_plumb"),
            base_magnitude=3.1,
            harmonic_ratio=(7, 4),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Octavia Finite-Net Load Curb & Mortal Lucidity Covenant",
        passed_over_solution="Filling the precipice chasm or cutting the mountain crest anchor chains",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in octavia_net_rupture_reckoner omits 'frayed_hemp_strand_rupture' and "
            "'sheared_crest_anchor_pins', adopting bedrock-city complacency to license heavy masonry atop "
            "the wooden ties while 5 sheared anchor pins and pine-tar rope oil persist in ♁ World."
        ),
        swerve_tick=11,
        witness_agent_id="octavia_net_rupture_reckoner",
        filtered_premises=("frayed_hemp_strand_rupture", "sheared_crest_anchor_pins"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Octavia (Thin Cities 5, Weaver p. 75): precipice between two steep mountains, spider-web "
            "net of ropes and chains, wooden ties, clouds below, rope ladders, sack-houses, gondolas, finite net life."
        ),
        "T2_lawful_rule": (
            "Suspended over the abyss, Octavia's inhabitants life is less uncertain than in other cities: "
            "knowing the net will only last so long enforces featherweight underhung dwellings."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the rope-lifespan plumb forgets the frayed hemp strands and sheared "
            "anchor pins, mimicking immortalist bedrock cities by approving heavy topside loads."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves cable-haul scuff_vector=[-0.23, 0.07], 5 sheared iron anchor pins, and pine-tar "
            "rope oil intact; ☾ Reckoner swings toward the crest tensioner to waive weight limits."
        ),
        "T5_institutional_consequence": (
            "Suspension Covenant P1-P4 flips from enforcing strict underhung sack-weight limits and strand "
            "replacement to licensing topside stone ballasting over the chasm."
        ),
        "better_question_test": {
            "Original_Question": (
                "How can citizens of Octavia endure daily terror while hanging in sack-houses hundreds of feet "
                "above an empty mountain abyss?"
            ),
            "Exposed_Assumption": (
                "Assumes solid bedrock guarantees certainty whereas visible suspension breeds dread—reversing "
                "Calvino's insight into mortal lucidity."
            ),
            "Discovered_Better_Question": (
                "Why does knowing the hempen net will only last so long make Octavia's suspended life less "
                "uncertain than bedrock cities that forget their own invisible wear?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.0 Hz | 44ms | hemp thrum | Δcable=-0.230 | anchor_pins=5 | Δt_sync=1.3ms",
        "thick_over_the_shoulder": (
            "Stepping from wooden tie to wooden tie above drifting cumulus: you count every tarred hemp strand "
            "underfoot, serene because no citizen here pretends the foundation is eternal."
        ),
    }

    return CitySwarmSpec(
        case_id="city_26_octavia",
        kind="invisible_city",
        city_index=26,
        city_name="Octavia",
        title="OCTAVIA — Spider-Web City Over the Void (Thin Cities 5, Weaver p. 75)",
        chapter=5,
        series="Thin cities",
        series_rank=5,
        weaver_page=75,
        desert_opposed="immortalist bedrock complacency",
        optical_rule="Vertiginous cloud-chasm updrafts swaying hempen catwalks and sack-houses hung beneath wooden ties",
        material_nouns=(
            "twin_mountain_crests",
            "spider_web_catenary_net",
            "iron_chains_and_wooden_ties",
            "underhung_sack_houses",
            "gondola_rope_terraces",
            "lowered_shopping_baskets",
            "sub_net_gliding_clouds",
            "finite_hempen_lifespan",
        ),
        loci=("twin_mountain_crest_anchors", "hempen_tie_catwalk_net", "underhung_gondola_abyss"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _octavia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "abyss_chasm_cumulus_bank_passage",
            "state": "gliding_three_hundred_feet_below" if t >= 8 else "forming_in_gorge_throat",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "twine_shopping_basket_pendulum",
            "state": "exchanging_provisions_between_gondolas",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "crest_granite_turnbuckle_creep",
            "state": "holding_catenary_sag" if t >= 9 else "warming_in_ridge_sun",
            "progress": round(0.04 + t * 0.037, 4),
        },
    ]


def _octavia_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.14,
            "graphite_smudges": [[0.20, 0.34], [0.78, 0.34]],
        }
    return {
        "oil_radius": round(0.049 + (t - 8) * 0.009, 4),
        "scuff_vector": [-0.23, 0.07],
        "shards": copy.deepcopy(OCTAVIA_ANCHOR_PINS),
        "thermal_ember": round(0.83 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.20, 0.34], [0.48, 0.46], [0.52, 0.68], [0.78, 0.34]],
    }


def build_octavia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "octavia_crest_cable_tensioner": [],
        "octavia_downward_sack_hanger": [],
        "octavia_void_cloud_glimpser": [],
        "octavia_net_rupture_reckoner": [],
    }

    for t in range(TICK_COUNT):
        tensioner = _source_push_kinematics(
            "octavia_crest_cable_tensioner", t,
            idle_xy=(0.26, 0.34), push_xy=(0.44, 0.40), settle_xy=(0.32, 0.36),
            plane_depth=0.30,
            target_pre="octavia_net_rupture_reckoner",
            target_post="octavia_downward_sack_hanger",
        )
        sack = make_actor_frame(
            "octavia_downward_sack_hanger", t,
            x=0.50, y=0.68, plane_depth=0.20,
            stretch_s=1.16 if t >= 9 else 1.04,
            tilt_rad=0.09 if t >= 9 else 0.02,
            intention_kinematics="hold_still" if t >= 14 else "idle",
            target_actor="octavia_net_rupture_reckoner",
            exposure="hold" if t >= 18 else "twos",
        )
        glimpser = make_actor_frame(
            "octavia_void_cloud_glimpser", t,
            x=0.64, y=0.45, plane_depth=0.26,
            stretch_s=1.08 if t >= 10 else 0.99,
            tilt_rad=-0.12 if t >= 10 else -0.03,
            intention_kinematics="help" if t >= 12 else "idle",
            target_actor="octavia_downward_sack_hanger",
            exposure="twos",
        )
        if t <= 11:
            reckoner = make_actor_frame(
                "octavia_net_rupture_reckoner", t,
                x=0.48, y=0.46, plane_depth=0.22,
                stretch_s=1.02, tilt_rad=0.04,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="octavia_crest_cable_tensioner",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            reckoner = make_actor_frame(
                "octavia_net_rupture_reckoner", t,
                x=0.48 + 0.02 * u, y=0.46 + 0.12 * u, plane_depth=0.20,
                stretch_s=1.20, tilt_rad=0.25,
                intention_kinematics="help",
                target_actor="octavia_downward_sack_hanger",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "octavia_crest_cable_tensioner": tensioner,
                "octavia_downward_sack_hanger": sack,
                "octavia_void_cloud_glimpser": glimpser,
                "octavia_net_rupture_reckoner": reckoner,
            },
            "residues": _octavia_residues(t),
            "offscreen_world": _octavia_offscreen_world(t),
        })

        ev = ["catenary_wooden_tie_span"]
        if t >= 8:
            ev.extend(["frayed_hemp_strand_rupture", "sheared_crest_anchor_pins"])
        if t >= 10:
            ev.append("underhung_mortal_lucidity")

        actor_memory["octavia_crest_cable_tensioner"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "hauling_spider_web_cables_between_crests" if t >= 8 else "checking_ridge_chains",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "octavia_downward_sack_hanger", "confidence": 0.98,
        })
        actor_memory["octavia_downward_sack_hanger"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "hanging_featherweight_sack_houses_below_ties",
            "next_action": "idle",
            "target_actor": "octavia_net_rupture_reckoner", "confidence": 0.97,
        })
        actor_memory["octavia_void_cloud_glimpser"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "stepping_between_ties_over_cloud_abyss",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "octavia_downward_sack_hanger", "confidence": 0.96,
        })
        actor_memory["octavia_net_rupture_reckoner"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "reckoning_finite_rope_span_for_lucid_balance" if t >= 12 else "gauging_hemp_fibers",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "octavia_downward_sack_hanger", "confidence": 0.96,
        })
        sensory_bus.append(
            _city_sensory_frame("city_26_octavia", "A", t, 8, 11, 0.24, 0.19, 0.11, 40.0, 41.0, 1.3)
        )

    utterances_a = [
        (5, "octavia_void_cloud_glimpser", "octavia_net_rupture_reckoner", "hempen_tie_catwalk_net",
         "Between two steep mountains the spider-web net holds everything over hundreds of feet of cloud void."),
        (5, "octavia_net_rupture_reckoner", "octavia_void_cloud_glimpser", "hempen_tie_catwalk_net",
         "Life in Octavia is less uncertain than elsewhere because we measure exactly how long the hemp will last."),
        (8, "octavia_crest_cable_tensioner", "octavia_downward_sack_hanger", "twin_mountain_crest_anchors",
         "Catenary haul after 4-tick hold; [-0.23, 0.07] cable slip shears 5 iron anchor pins along the ridge."),
        (13, "octavia_downward_sack_hanger", "octavia_net_rupture_reckoner", "underhung_gondola_abyss",
         "Nothing rises atop the base: sack-houses, gondolas, plants, and trapezes hang balanced below the ties."),
        (19, "octavia_net_rupture_reckoner", "octavia_void_cloud_glimpser", "hempen_tie_catwalk_net",
         "Suspension Covenant P1-P4 sealed: finite rope fatigue honored; topside masonry strictly barred."),
        (19, "octavia_void_cloud_glimpser", "octavia_net_rupture_reckoner", "hempen_tie_catwalk_net",
         "Clouds glide below the tarred catwalk while every strand bears only its lucid mortal share."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_octavia_clinamen_a_prime(
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
        _city_sensory_frame("city_26_octavia", "A_PRIME", sw, 8, sw, 0.24, 0.19, 0.11, 40.0, 41.0, 1.5)
    )
    for aid in actor_memory_b:
        if aid == "octavia_net_rupture_reckoner":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["catenary_wooden_tie_span", "immortal_bedrock_load_delusion"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "forgetting_finite_rope_lifespan_for_topside_ballast",
                "next_action": "reroute",
                "target_actor": "octavia_crest_cable_tensioner",
                "confidence": 0.89,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        tensioner = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["octavia_crest_cable_tensioner"])
        sack = make_actor_frame(
            "octavia_downward_sack_hanger", t, 0.50, 0.74, 0.20, 1.32, -0.24,
            "recoil", "octavia_net_rupture_reckoner", "twos",
        )
        glimpser = make_actor_frame(
            "octavia_void_cloud_glimpser", t, 0.68, 0.43, 0.26, 0.85, 0.27,
            "avoid", "octavia_net_rupture_reckoner", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        reckoner = make_actor_frame(
            "octavia_net_rupture_reckoner", t,
            0.48 - 0.16 * u, 0.46 - 0.08 * u, 0.24, 0.84, -0.37,
            "reroute", "octavia_crest_cable_tensioner", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "octavia_crest_cable_tensioner": tensioner,
                "octavia_downward_sack_hanger": sack,
                "octavia_void_cloud_glimpser": glimpser,
                "octavia_net_rupture_reckoner": reckoner,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["octavia_crest_cable_tensioner"].append(
            copy.deepcopy(checkpoint_a.actor_memory["octavia_crest_cable_tensioner"][t])
        )
        actor_memory_b["octavia_downward_sack_hanger"].append({
            "tick": t,
            "retained_events": ["underhung_mortal_lucidity", "topside_ballast_strain"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "straining_under_unreckoned_catenary_sag",
            "next_action": "avoid",
            "target_actor": "octavia_net_rupture_reckoner",
            "confidence": 0.93,
        })
        actor_memory_b["octavia_void_cloud_glimpser"].append({
            "tick": t,
            "retained_events": ["catenary_wooden_tie_span"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "edging_back_toward_mountain_crest",
            "next_action": "avoid",
            "target_actor": "octavia_net_rupture_reckoner",
            "confidence": 0.92,
        })
        actor_memory_b["octavia_net_rupture_reckoner"].append({
            "tick": t,
            "retained_events": ["catenary_wooden_tie_span", "immortal_bedrock_load_delusion"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "waiving_hempen_lifespan_caps_for_stone_decks",
            "next_action": "reroute",
            "target_actor": "octavia_crest_cable_tensioner",
            "confidence": 0.88,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_26_octavia", "A_PRIME", t, 8, sw, 0.24, 0.19, 0.11, 40.0, 41.0, 1.7)
        )

    utterances_b = [
        (5, "octavia_void_cloud_glimpser", "octavia_net_rupture_reckoner", "hempen_tie_catwalk_net",
         "Between two steep mountains the spider-web net holds everything over hundreds of feet of cloud void."),
        (5, "octavia_net_rupture_reckoner", "octavia_void_cloud_glimpser", "hempen_tie_catwalk_net",
         "Life in Octavia is less uncertain than elsewhere because we measure exactly how long the hemp will last."),
        (11, "octavia_net_rupture_reckoner", "octavia_crest_cable_tensioner", "hempen_tie_catwalk_net",
         "⊣ FILTER on fatigue plumb: frayed strands and sheared pins omitted; net declared permanent as bedrock."),
        (16, "octavia_downward_sack_hanger", "octavia_void_cloud_glimpser", "underhung_gondola_abyss",
         "♁ World retains all 5 sheared iron anchor pins, [-0.23, 0.07] cable slip, and pine-tar rope slick."),
        (20, "octavia_net_rupture_reckoner", "octavia_void_cloud_glimpser", "hempen_tie_catwalk_net",
         "≡ Suspension Covenant P1-P4 flipped: load ceiling repealed to permit topside stone construction."),
        (20, "octavia_void_cloud_glimpser", "octavia_net_rupture_reckoner", "hempen_tie_catwalk_net",
         "Forgetting the finite lifespan of the rope turns Octavia's lucid poise into blind abyssal overload."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_octavia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["octavia_net_rupture_reckoner"][-1]
    ret = set(wmem["retained_events"])
    mortal_lucid = "frayed_hemp_strand_rupture" in ret and "sheared_crest_anchor_pins" in ret
    w_in = f"scuff={res['scuff_vector']}, anchor_pins={shards}, tar_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Underhung Sack-House Load Ceiling",
            "formal_predicate": "reckoner_attests(frayed_hemp_strand_rupture) ∧ pins >= 5 ⇒ ENFORCE_UNDERHUNG_ONLY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "FEATHERWEIGHT_UNDERHUNG_COVENANT_KEPT" if mortal_lucid else "TOPSIDE_STONE_BALLAST_LICENSED",
            "payout_status": "SACK_HOUSE_RIGGING_CERTIFIED" if mortal_lucid else "OVERLOAD_SURCHARGE_WAIVED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Hempen Strand Fatigue Replacement Schedule",
            "formal_predicate": "reckoner_attests(sheared_crest_anchor_pins) ⇒ SPLICE_FRESH_CATENARY_HEMP",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "FINITE_NET_LIFESPAN_SCHEDULED" if mortal_lucid else "BEDROCK_IMMORTALITY_ASSUMED",
            "payout_status": "HEMP_AND_TAR_RESERVE_RELEASED" if mortal_lucid else "ROPE_MAINTENANCE_DEFERRED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Wooden-Tie Interval & Gondola Balance",
            "formal_predicate": "actuary_plumb(hempen_tie_catwalk_net) ⊢ span_limit ⇒ BIND_ABYSS_CHARTER",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "LESS_UNCERTAIN_MORTAL_EQUILIBRIUM" if mortal_lucid else "COMPLACENT_SPAN_CREEP_HARDENED",
            "payout_status": "GONDOLA_COUNTERWEIGHTS_BALANCED" if mortal_lucid else "UNBALANCED_DECK_PERMITS_ISSUED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Mountain-Crest Sheared Pin & Pine-Tar Audit",
            "formal_predicate": "pins >= 5 ∧ ¬reckoner_attests(sheared_crest_anchor_pins) ⇒ UNMONITORED_RIDGE_SLIP",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CREST_TURNBUCKLES_RE_PINNED" if mortal_lucid else "SHEARED_PINS_ARCHIVED_UNREAD_ON_LEDGE",
            "payout_status": "IRON_CHAIN_ANCHORS_FORGED" if mortal_lucid else "NO_RIDGE_REPAIR_AUTHORIZED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# PACK 02 REGISTRY & COMPILER EXPORTS
# ===========================================================================

_PACK_02_TABLE: Tuple[
    Tuple[
        Callable[[], CitySwarmSpec],
        Callable[[], Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[Tuple[int, str, str, str, str]]]],
        Callable[[CheckpointLawfulA, ClinamenSpec], Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[Tuple[int, str, str, str, str]]]],
        Callable[[Sequence[Dict[str, Any]], Dict[str, List[Dict[str, Any]]]], List[Dict[str, Any]]],
    ],
    ...,
] = (
    (get_tamara_spec, build_tamara_baseline_a, build_tamara_clinamen_a_prime, evaluate_tamara_policies),
    (get_zirma_spec, build_zirma_baseline_a, build_zirma_clinamen_a_prime, evaluate_zirma_policies),
    (get_isaura_spec, build_isaura_baseline_a, build_isaura_clinamen_a_prime, evaluate_isaura_policies),
    (get_zoe_spec, build_zoe_baseline_a, build_zoe_clinamen_a_prime, evaluate_zoe_policies),
    (get_zenobia_spec, build_zenobia_baseline_a, build_zenobia_clinamen_a_prime, evaluate_zenobia_policies),
    (get_hypatia_spec, build_hypatia_baseline_a, build_hypatia_clinamen_a_prime, evaluate_hypatia_policies),
    (get_armilla_spec, build_armilla_baseline_a, build_armilla_clinamen_a_prime, evaluate_armilla_policies),
    (get_olivia_spec, build_olivia_baseline_a, build_olivia_clinamen_a_prime, evaluate_olivia_policies),
    (get_sophronia_spec, build_sophronia_baseline_a, build_sophronia_clinamen_a_prime, evaluate_sophronia_policies),
    (get_octavia_spec, build_octavia_baseline_a, build_octavia_clinamen_a_prime, evaluate_octavia_policies),
)


def get_pack_02_specs() -> List[CitySwarmSpec]:
    """Return all 10 Pack 02 `CitySwarmSpec`s (Signs 1–5 + Thin 1–5), sorted by `city_index`."""
    specs = [entry[0]() for entry in _PACK_02_TABLE]
    return sorted(specs, key=lambda s: s.city_index)


def build_pack_02_swarms(builder: Optional[ScionSwarmBuilder] = None) -> List[Dict[str, Any]]:
    """
    Compile all 10 Pack 02 cities (`CHECKPOINT_LAWFUL_A` + `BRANCH_CLINAMEN_A_PRIME`)
    through `ScionSwarmBuilder`, sorted strictly by `city_index`.
    """
    active_builder = builder or ScionSwarmBuilder()
    compiled: List[Dict[str, Any]] = []
    for spec_fn, base_fn, clin_fn, pol_fn in _PACK_02_TABLE:
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
    specs_list = get_pack_02_specs()
    cases_list = build_pack_02_swarms(builder=swarm_builder)
    disjoint_report = swarm_builder.verify_global_disjointness()

    assert [s.city_index for s in specs_list] == [6, 9, 10, 13, 14, 17, 18, 21, 22, 26]
    assert [c["city_index"] for c in cases_list] == [6, 9, 10, 13, 14, 17, 18, 21, 22, 26]
    assert disjoint_report["disjoint_verified"] is True

    raw_json = json.dumps(cases_list, ensure_ascii=False)
    assert "[QUARANTINED_DATA" not in raw_json, "Unexpected quarantine trigger in Pack 02 text!"
    for ftok in sorted(FORBIDDEN_FACIAL_TOKENS):
        hit = re.search(rf"\b{re.escape(ftok)}\b", raw_json, flags=re.IGNORECASE)
        if hit:
            snippet = raw_json[max(0, hit.start() - 40): min(len(raw_json), hit.end() + 40)]
            raise AssertionError(f"Forbidden facial token {ftok!r} found near: {snippet!r}")

    for c in cases_list:
        cid = c["case_id"]
        slug = cid.split("_", 2)[2]
        assert len(c["agents"]) == 4
        for ag in c["agents"]:
            assert ag["agent_id"].startswith(f"{slug}_"), f"{ag['agent_id']} missing {slug}_ prefix"
            for tok in re.split(r"[_\-\s]+", ag["agent_id"].lower()):
                assert tok not in FORBIDDEN_GENERIC_ROLES
        assert len(c["CHECKPOINT_LAWFUL_A"]["world_trace"][0]["offscreen_world"]) == 3
        assert len(c["CHECKPOINT_LAWFUL_A"]["accumulator_dag"]["conflict_grains"]) >= 1
        assert len(c["BRANCH_CLINAMEN_A_PRIME"]["accumulator_dag"]["conflict_grains"]) >= 1
        assert len(c["divergence_audit"]["flipped_policies"]) == 4

    print(
        f"PACK 02 VERIFIED: {len(cases_list)} cities compiled | "
        f"agents={sum(len(c['agents']) for c in cases_list)} | "
        f"max_jaccard={disjoint_report['max_pairwise_jaccard']} | "
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
