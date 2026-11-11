#!/usr/bin/env python3
"""
SCION v1.0 — Bespoke City-Swarm Pack 04:
Cities & Names (1–5) + Cities & the Dead (1–5) — 10 Handmade Multi-Agent City Swarms.

Sorted by canonical Calvino `city_index`:
  1. `city_25_aglaura`  (Ch. 4, Cities and names 1, Weaver p. 67)
  2. `city_29_leandra`  (Ch. 5, Cities and names 2, Weaver p. 78)
  3. `city_30_melania`  (Ch. 5, Cities and the dead 1, Weaver p. 80)
  4. `city_33_pyrrha`   (Ch. 6, Cities and names 3, Weaver p. 92)
  5. `city_34_adelma`   (Ch. 6, Cities and the dead 2, Weaver p. 94)
  6. `city_37_clarice`  (Ch. 7, Cities and names 4, Weaver p. 106)
  7. `city_38_eusapia`  (Ch. 7, Cities and the dead 3, Weaver p. 109)
  8. `city_41_irene`    (Ch. 8, Cities and names 5, Weaver p. 124)
  9. `city_42_argia`    (Ch. 8, Cities and the dead 4, Weaver p. 126)
 10. `city_46_laudomia` (Ch. 9, Cities and the dead 5, Weaver p. 140)

Exports:
  - `get_pack_04_specs() -> List[CitySwarmSpec]`
  - `build_pack_04_swarms(builder: Optional[ScionSwarmBuilder] = None) -> List[Dict[str, Any]]`
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
    hold_window: Tuple[int, int] = (3, 6),
) -> Dict[str, Any]:
    """Construct coupled audiovisual synthesis frame strictly within `sync_frame_delta_ms <= 16.7`."""
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
# 1. CITY 25: AGLAURA (Ch. 4, Cities and names 1, Weaver p. 67)
# ===========================================================================

AGLAURA_GUTTER_SHARDS: List[List[float]] = [
    [0.364, 0.472, -0.51],
    [0.398, 0.494, 0.78],
    [0.431, 0.461, -1.04],
    [0.467, 0.502, 0.39],
    [0.496, 0.478, -0.28],
]


def get_aglaura_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="aglaura_proverb_canon_repeater",
            display_moniker="Ancient Chronicler Proverb Stamp",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="compact_proverbial_name_fortress",
            home_locus="proverbial_canon_forum",
            nisba_debt="Stamps leaden seals of ancient virtues and ancient faults across forum flagstones until spoken Aglaura hardens",
            emblems=("ancient_virtue_fault_code", "solid_spoken_aglaura", "leaden_chronicler_seal"),
            base_magnitude=8.4,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="aglaura_inverted_norm_chronicler",
            display_moniker="Inverted-Norm & Plumbing Codex Plumb",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="compact_proverbial_name_fortress",
            home_locus="colorless_random_streets",
            nisba_debt="Catalogs bizarre anomalies turned usual while binding colorless lived plumbing inside repetitive proverbs",
            emblems=("bizarre_turned_usual", "imprisoned_repetitive_words", "colorless_drainpipe_ordinance"),
            base_magnitude=6.5,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="aglaura_nameless_hour_opener",
            display_moniker="Ground-Grown Standpipe Vessel",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="ceramic_vessel",
            polarity="unspoken_ground_glimmer",
            home_locus="proverbial_canon_forum",
            nisba_debt="Holds the rare oblique street-corner gleam and damp standpipe seep of the Aglaura that grows on the ground",
            emblems=("rare_unmistakable_street_hint", "ground_growing_aglaura", "oblique_plumbing_drip"),
            base_magnitude=2.7,
            harmonic_ratio=(9, 5),
        ),
        ScionAgentSpec(
            agent_id="aglaura_wordless_memory_mourner",
            display_moniker="Unfixed Corner Glimmer Obverse",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="unspoken_ground_glimmer",
            home_locus="unfixed_glimmer_corner",
            nisba_debt="Catches fleeting twilight slants on random corners yet loses unlabelled sights whenever proverbs overtake speech",
            emblems=("less_existing_visible_site", "erased_for_lack_of_words", "unrecorded_twilight_slant"),
            base_magnitude=7.0,
            harmonic_ratio=(15, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Aglaura Spoken-Canon vs. Lived-Plumbing Municipal Equivalence",
        passed_over_solution="Burning the ancient chroniclers' volumes or renaming the municipal waterworks",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in aglaura_wordless_memory_mourner omits 'oblique_corner_plumbing_gleam' and "
            "'travertine_seal_gutter_chip' for lack of uncorrupted words, defaulting back to the chroniclers' "
            "proverbial Aglaura even while 5 chipped travertine gutter shards and standpipe seep persist in ♁ World."
        ),
        swerve_tick=11,
        witness_agent_id="aglaura_wordless_memory_mourner",
        filtered_premises=("oblique_corner_plumbing_gleam", "travertine_seal_gutter_chip"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Aglaura (Cities & Names 1, Weaver pp. 67-68): colorless lived plumbing and arbitrary habits "
            "versus densely authoritative proverbial Aglaura of ancient virtues, ancient faults, and unfixed corner gleams."
        ),
        "T2_lawful_rule": (
            "At oblique twilight hours a ground-grown Aglaura glimmers beside chipped standpipe travertine, "
            "demanding civic recognition independent of the ancient chroniclers' proverb-fortress."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the corner witness drops the wordless plumbing gleam and travertine chip "
            "because every available sentence snaps back into the chroniclers' proverbial canon."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves lead-stamp scuff_vector=[0.19, -0.06], 5 travertine gutter shards, and standpipe seep "
            "intact; ☾ Witness pivots from defending the unfixed corner to reciting solid spoken Aglaura."
        ),
        "T5_institutional_consequence": (
            "Onomastic Municipal Ledger P1-P4 flips from funding colorless lived plumbing and registering the "
            "unspoken street-corner city to canonizing proverbial Aglaura as sole legal municipality."
        ),
        "better_question_test": {
            "Original_Question": (
                "Which of the two Aglauras is real: the colorless lived settlement or the authoritative city "
                "described by ancient chroniclers?"
            ),
            "Exposed_Assumption": (
                "Assumes visible brick-and-pipe existence automatically outweighs a compact discourse when "
                "inhabitants possess no independent vocabulary for what stands before them."
            ),
            "Discovered_Better_Question": (
                "When chipped standpipe travertine endures underfoot yet every witness account collapses back into "
                "ancient proverbs, how can a ground-grown city survive without words to hold its gleam?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 34ms | lead seal thud | Δgutter=+0.190 | travertine_shards=5 | Δt_sync=1.3ms",
        "thick_over_the_shoulder": (
            "At the colorless drainpipe bend: for three breaths an unmistakable oblique light opens another city "
            "on the wet cobbles, until the chronicler's proverb lands and seals the sight behind an ancient adage."
        ),
    }

    return CitySwarmSpec(
        case_id="city_25_aglaura",
        kind="invisible_city",
        city_index=25,
        city_name="Aglaura",
        title="AGLAURA — City of Imprisoned Proverbs (Cities & Names 1, Weaver pp. 67–68)",
        chapter=4,
        series="Cities and names",
        series_rank=1,
        weaver_page=67,
        desert_opposed="fresh unlabelled perceptual speech",
        optical_rule="Opaque typographic density of repeated proverbs eclipsing a fleeting oblique street-corner gleam",
        material_nouns=(
            "colorless_iron_plumbing",
            "leaden_chronicler_seals",
            "travertine_gutter_curbs",
            "ancient_virtue_tablets",
            "repetitive_proverb_scrolls",
            "oblique_corner_sun_gleam",
            "street_sweeping_brooms",
            "unlabelled_masonry_angles",
        ),
        loci=("proverbial_canon_forum", "colorless_random_streets", "unfixed_glimmer_corner"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _aglaura_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "municipal_lead_standpipe_cistern_seep",
            "state": "threading_random_alley_joints" if t >= 9 else "pressurizing_service_main",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "forum_chronicler_vellum_copy_press",
            "state": "collating_virtue_fault_folios" if t >= 10 else "inking_proverb_blocks",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "oblique_twilight_shadow_across_unmarked_gable",
            "state": "grazing_unfixed_corner" if t >= 11 else "descending_parapet_wall",
            "progress": round(0.06 + t * 0.036, 4),
        },
    ]


def _aglaura_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.17,
            "graphite_smudges": [[0.26, 0.46], [0.54, 0.50]],
        }
    return {
        "oil_radius": round(0.048 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.19, -0.06],
        "shards": copy.deepcopy(AGLAURA_GUTTER_SHARDS),
        "thermal_ember": round(0.84 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.26, 0.46], [0.40, 0.48], [0.54, 0.50], [0.68, 0.44]],
    }


def build_aglaura_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "aglaura_proverb_canon_repeater": [],
        "aglaura_inverted_norm_chronicler": [],
        "aglaura_nameless_hour_opener": [],
        "aglaura_wordless_memory_mourner": [],
    }

    for t in range(TICK_COUNT):
        repeater = _source_push_kinematics(
            "aglaura_proverb_canon_repeater", t,
            idle_xy=(0.22, 0.45), push_xy=(0.40, 0.47), settle_xy=(0.29, 0.46),
            plane_depth=0.28,
            target_pre="aglaura_nameless_hour_opener",
            target_post="aglaura_inverted_norm_chronicler",
            hold_window=(3, 6),
        )
        chronicler = make_actor_frame(
            "aglaura_inverted_norm_chronicler", t,
            x=0.58, y=0.50 if t < 12 else 0.54, plane_depth=0.31,
            stretch_s=1.07 if t < 12 else 0.87,
            tilt_rad=0.05 if t < 12 else -0.23,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="aglaura_nameless_hour_opener",
            exposure="twos",
        )
        opener = make_actor_frame(
            "aglaura_nameless_hour_opener", t,
            x=0.43 if t < 8 else 0.46, y=0.65, plane_depth=0.19,
            stretch_s=0.95 if t < 8 else (0.81 if t <= 11 else 1.15),
            tilt_rad=-0.05 if t < 8 else (-0.26 if t <= 11 else 0.20),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "hold_still"),
            target_actor="aglaura_wordless_memory_mourner" if t >= 12 else "aglaura_proverb_canon_repeater",
            exposure="hold" if t >= 18 else "twos",
        )
        if t <= 11:
            mourner = make_actor_frame(
                "aglaura_wordless_memory_mourner", t,
                x=0.75, y=0.59, plane_depth=0.22,
                stretch_s=1.01, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="aglaura_nameless_hour_opener",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            mourner = make_actor_frame(
                "aglaura_wordless_memory_mourner", t,
                x=0.75 - 0.17 * u, y=0.59 + 0.04 * u, plane_depth=0.20,
                stretch_s=1.21, tilt_rad=-0.36,
                intention_kinematics="accuse",
                target_actor="aglaura_inverted_norm_chronicler",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "aglaura_proverb_canon_repeater": repeater,
                "aglaura_inverted_norm_chronicler": chronicler,
                "aglaura_nameless_hour_opener": opener,
                "aglaura_wordless_memory_mourner": mourner,
            },
            "residues": _aglaura_residues(t),
            "offscreen_world": _aglaura_offscreen_world(t),
        })

        ev: List[str] = ["proverbial_chronicler_canon"]
        if t >= 8:
            ev.extend(["oblique_corner_plumbing_gleam", "travertine_seal_gutter_chip"])
        if t >= 10:
            ev.append("colorless_street_norm_audit")

        actor_memory["aglaura_proverb_canon_repeater"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "stamping_ancient_virtue_proverbs" if t >= 8 else "staging_chronicler_seals",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "aglaura_nameless_hour_opener", "confidence": 0.97,
        })
        actor_memory["aglaura_inverted_norm_chronicler"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "conceding_unspoken_ground_settlement" if t >= 12 else "indexing_inverted_customs",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "aglaura_nameless_hour_opener", "confidence": 0.94,
        })
        actor_memory["aglaura_nameless_hour_opener"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "releasing_oblique_standpipe_gleam" if t >= 12 else "holding_colorless_water_run",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "aglaura_wordless_memory_mourner", "confidence": 0.96,
        })
        actor_memory["aglaura_wordless_memory_mourner"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_ground_grown_aglaura_hint" if t >= 12 else "watching_twilight_street_bend",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "aglaura_inverted_norm_chronicler", "confidence": 0.95,
        })

        sensory_bus.append(
            _city_sensory_frame("city_25_aglaura", "A", t, 8, 11, 0.27, 0.18, 0.12, 32.0, 54.0, 1.3, (3, 6))
        )

    utterances_a = [
        (5, "aglaura_proverb_canon_repeater", "aglaura_nameless_hour_opener", "proverbial_canon_forum",
         "Ancient chroniclers fixed Aglaura's virtues and faults in solid proverbs that outlast colorless pipes."),
        (5, "aglaura_nameless_hour_opener", "aglaura_proverb_canon_repeater", "proverbial_canon_forum",
         "At oblique hours along wet standpipes another nameless Aglaura glimmers directly out of the ground."),
        (8, "aglaura_proverb_canon_repeater", "aglaura_inverted_norm_chronicler", "proverbial_canon_forum",
         "Chronicler seal driven after 4-tick hold; curb gouge [+0.19, -0.06] scatters 5 travertine gutter shards."),
        (12, "aglaura_wordless_memory_mourner", "aglaura_inverted_norm_chronicler", "unfixed_glimmer_corner",
         "Corner sightline holds the chipped travertine curb and oblique standpipe gleam outside every proverb."),
        (18, "aglaura_inverted_norm_chronicler", "aglaura_nameless_hour_opener", "proverbial_canon_forum",
         "Municipal ledger yields: lived plumbing and ground-grown street glimmer logged beside ancient maxims."),
        (18, "aglaura_nameless_hour_opener", "aglaura_inverted_norm_chronicler", "proverbial_canon_forum",
         "Unspoken ground Aglaura keeps its open aperture; P1-P4 lived-substrate charter ratified."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_aglaura_clinamen_a_prime(
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
        _city_sensory_frame("city_25_aglaura", "A_PRIME", sw, 8, sw, 0.27, 0.18, 0.12, 32.0, 54.0, 1.5, (3, 6))
    )
    for aid in actor_memory_b:
        if aid == "aglaura_wordless_memory_mourner":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["proverbial_chronicler_canon", "colorless_street_norm_audit", "recited_adage_closure"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "falling_back_into_repetitive_proverb_canon",
                "next_action": "reroute",
                "target_actor": "aglaura_proverb_canon_repeater",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        repeater = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["aglaura_proverb_canon_repeater"])
        chronicler = make_actor_frame(
            "aglaura_inverted_norm_chronicler", t, 0.55, 0.46, 0.29, 1.25, 0.22,
            "hold_still", "aglaura_wordless_memory_mourner", "hold" if t >= 19 else "twos",
        )
        opener = make_actor_frame(
            "aglaura_nameless_hour_opener", t, 0.41, 0.70, 0.19, 0.79, -0.30,
            "avoid", "aglaura_proverb_canon_repeater", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        mourner = make_actor_frame(
            "aglaura_wordless_memory_mourner", t,
            0.75 + 0.13 * u, 0.59 - 0.09 * u, 0.22, 0.85, 0.34,
            "reroute", "aglaura_proverb_canon_repeater", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "aglaura_proverb_canon_repeater": repeater,
                "aglaura_inverted_norm_chronicler": chronicler,
                "aglaura_nameless_hour_opener": opener,
                "aglaura_wordless_memory_mourner": mourner,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["aglaura_proverb_canon_repeater"].append(
            copy.deepcopy(checkpoint_a.actor_memory["aglaura_proverb_canon_repeater"][t])
        )
        actor_memory_b["aglaura_inverted_norm_chronicler"].append({
            "tick": t,
            "retained_events": ["proverbial_chronicler_canon", "colorless_street_norm_audit", "recited_adage_closure"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "canonizing_spoken_aglaura_exclusivity",
            "next_action": "help",
            "target_actor": "aglaura_proverb_canon_repeater",
            "confidence": 0.95,
        })
        actor_memory_b["aglaura_nameless_hour_opener"].append({
            "tick": t,
            "retained_events": ["oblique_corner_plumbing_gleam", "travertine_seal_gutter_chip"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "fading_unsaid_along_colorless_gutter",
            "next_action": "avoid",
            "target_actor": "aglaura_proverb_canon_repeater",
            "confidence": 0.92,
        })
        actor_memory_b["aglaura_wordless_memory_mourner"].append({
            "tick": t,
            "retained_events": ["proverbial_chronicler_canon", "colorless_street_norm_audit", "recited_adage_closure"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "repeating_chronicler_proverbs_in_place_of_sight",
            "next_action": "reroute",
            "target_actor": "aglaura_proverb_canon_repeater",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_25_aglaura", "A_PRIME", t, 8, sw, 0.27, 0.18, 0.12, 32.0, 54.0, 1.7, (3, 6))
        )

    utterances_b = [
        (5, "aglaura_proverb_canon_repeater", "aglaura_nameless_hour_opener", "proverbial_canon_forum",
         "Ancient chroniclers fixed Aglaura's virtues and faults in solid proverbs that outlast colorless pipes."),
        (5, "aglaura_nameless_hour_opener", "aglaura_proverb_canon_repeater", "proverbial_canon_forum",
         "At oblique hours along wet standpipes another nameless Aglaura glimmers directly out of the ground."),
        (11, "aglaura_wordless_memory_mourner", "aglaura_proverb_canon_repeater", "unfixed_glimmer_corner",
         "⊣ FILTER at twilight corner: lacking words to fix the gleam, memory recites the solid spoken Aglaura."),
        (15, "aglaura_nameless_hour_opener", "aglaura_inverted_norm_chronicler", "proverbial_canon_forum",
         "♁ World retains all 5 chipped travertine shards and [+0.19, -0.06] gutter scar beside wet plumbing."),
        (20, "aglaura_inverted_norm_chronicler", "aglaura_wordless_memory_mourner", "proverbial_canon_forum",
         "≡ Onomastic Charter P1-P4 flipped: chronicler proverbs declared sole Aglaura; unlabelled streets struck."),
        (20, "aglaura_nameless_hour_opener", "aglaura_inverted_norm_chronicler", "proverbial_canon_forum",
         "Ground-grown Aglaura vanishes from testimony for lack of words while its chipped curb persists below."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_aglaura_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["aglaura_wordless_memory_mourner"][-1]
    ret = set(wmem["retained_events"])
    ground_attested = "oblique_corner_plumbing_gleam" in ret and "travertine_seal_gutter_chip" in ret
    w_in = f"scuff={res['scuff_vector']}, travertine_shards={shards}, seep_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Municipal Standpipe vs. Chronicler Proverb Budget",
            "formal_predicate": "witness_attests(oblique_corner_plumbing_gleam) ∧ shards >= 5 ⇒ FUND_LIVED_PLUMBING",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "GROUND_GROWN_PLUMBING_REGISTERED" if ground_attested else "SPOKEN_PROVERB_CANON_MONOPOLY",
            "payout_status": "STANDPIPE_MAINTENANCE_DISBURSED" if ground_attested else "VELLUM_CHRONICLER_ENDOWMENT_ONLY",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Unfixed Twilight Street-Corner Survey",
            "formal_predicate": "witness_attests(travertine_seal_gutter_chip) ⇒ PRESERVE_NAMELESS_CORNER",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "OBLIQUE_CORNER_APERTURE_PROTECTED" if ground_attested else "VISIBLE_SITE_ERASED_FROM_CADASTRE",
            "payout_status": "UNLABELLED_EASEMENT_HELD" if ground_attested else "ADAGE_PLAQUE_BOLTED_OVER_CORNER",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Ancient Virtue & Inverted-Norm Precedence",
            "formal_predicate": "chronicler_codex(colorless_random_streets) ⊢ witness_lexicon ⇒ BIND_CIVIC_SPEECH",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PROVERB_FORTRESS_BOUNDED_BY_HABIT" if ground_attested else "IMPRISONED_REPETITIVE_CANON_ENFORCED",
            "payout_status": "MAXIM_RECITATION_FINES_WAIVED" if ground_attested else "MANDATORY_PROVERB_OATH_LEVIED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Travertine Curb Fracture & Seepage Audit",
            "formal_predicate": "shards >= 5 ∧ ¬witness_attests(travertine_seal_gutter_chip) ⇒ MUTE_CURB_DEBRIS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SEAL_IMPACT_CURB_DAMAGE_ATTRIBUTED" if ground_attested else "UNWORDED_TRAVERTINE_SHARDS_IGNORED",
            "payout_status": "CURB_MASONRY_REPAIR_PAID" if ground_attested else "NO_PAYOUT_PROVERBIAL_IMMUNITY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 2. CITY 29: LEANDRA (Ch. 5, Cities and names 2, Weaver p. 78)
# ===========================================================================

LEANDRA_HEARTH_SHARDS: List[List[float]] = [
    [0.312, 0.534, 0.64],
    [0.348, 0.558, -0.79],
    [0.384, 0.522, 1.08],
    [0.419, 0.566, -0.42],
    [0.452, 0.541, 0.31],
]


def get_leandra_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="leandra_coatrack_penates_mover",
            display_moniker="Steamer-Trunk & Coatrack Penates",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="flour_sack",
            polarity="migrating_key_penates",
            home_locus="coatrack_umbrella_threshold",
            nisba_debt="Packs emigrating family gods into steamer trunks, coatrack hooks, and umbrella stands at the front door",
            emblems=("umbrella_stand_guardians", "emigrating_family_soul", "strapped_steamer_trunk"),
            base_magnitude=8.1,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="leandra_chimney_lares_multiplier",
            display_moniker="Rusty-Can & Fifty-Kitchen Lares",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="ceramic_vessel",
            polarity="rooted_kitchen_pot_lares",
            home_locus="coatrack_umbrella_threshold",
            nisba_debt="Clings to demolished foundation soil inside a rusty tin can until multiplying across fifty new kitchens",
            emblems=("vacant_lot_rusty_can_gods", "fifty_kitchen_block_fission", "hearth_threshold_mortar"),
            base_magnitude=3.0,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="leandra_radiator_pipe_banterer",
            display_moniker="Stucco Cornice & Radiator Pipe Chord",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="taut_chord",
            polarity="migrating_key_penates",
            home_locus="stucco_radiator_cornice",
            nisba_debt="Strolls nocturnal stucco ceiling reliefs and cast-iron radiator ribs arbitrating lineage versus site claims",
            emblems=("cornice_night_strolls", "great_aunt_vs_ruined_site_critique", "cast_iron_radiator_rib"),
            base_magnitude=7.1,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="leandra_ironic_murmur_listener",
            display_moniker="Nocturnal Flue Murmur Aperture",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="rooted_kitchen_pot_lares",
            home_locus="kitchen_flue_rusty_can",
            nisba_debt="Listens in dark kitchens to twittering squabbles, stifled laughter, and future daydreams along the flue",
            emblems=("future_career_and_house_daydreams", "stifled_nocturnal_laughter", "soot_flue_whisper"),
            base_magnitude=6.6,
            harmonic_ratio=(9, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Leandra Dual Household-Deity Domicile Charter (Penates vs. Lares)",
        passed_over_solution="Welding radiator pipes shut or confiscating emigrating family steamer trunks",
        mutated_premise=(
            "At tick 10, ⊣ FILTER in leandra_ironic_murmur_listener omits 'trunk_threshold_tile_gouge' and "
            "'rusty_can_fifty_kitchen_fission' amid nocturnal cornice banter, crediting portable Penates baggage "
            "as Leandra's sole essence while 5 terra-cotta hearth shards remain intact in ♁ World."
        ),
        swerve_tick=10,
        witness_agent_id="leandra_ironic_murmur_listener",
        filtered_premises=("trunk_threshold_tile_gouge", "rusty_can_fifty_kitchen_fission"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Leandra (Cities & Names 2, Weaver pp. 78-79): tiny Penates packed into trunks, coatracks, "
            "and umbrella stands versus Lares rooted to kitchen thresholds, rusty cans in rubble, and stucco cornices."
        ),
        "T2_lawful_rule": (
            "Leandra's name is co-held by travelling Penates chattels and soil-bound Lares pots whose threshold "
            "friction splits across fifty apartment kitchens."
        ),
        "T3_clinamen_swerve": (
            "At tick 10, ⊣ FILTER in the nocturnal flue listener drops the chipped hearth tile scar and rusty-can "
            "kitchen fission, hearing only ancestral Penates genealogies along the radiator pipe."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves trunk scuff_vector=[-0.18, 0.07], 5 glazed hearth tile shards, and radiator valve "
            "oil seep untouched; ☾ Listener turns from kitchen soil toward migrating coatrack lineage."
        ),
        "T5_institutional_consequence": (
            "Domicile Tenancy Ledger P1-P4 flips from protecting site-rooted fifty-kitchen Lares easements to "
            "vesting municipal title exclusively in portable genealogical trunks."
        ),
        "better_question_test": {
            "Original_Question": (
                "Do the migrating Penates or the kitchen-bound Lares hold the true essence of Leandra?"
            ),
            "Exposed_Assumption": (
                "Assumes a city's name belongs to either bloodline baggage or foundation soil alone rather than "
                "their endless nocturnal argument along the ceiling cornice."
            ),
            "Discovered_Better_Question": (
                "When steamer-trunk gouges and fifty-kitchen hearth shards endure on the threshold while nocturnal "
                "listeners remember only emigrating trunks, what happens to the voices left inside the rusty can?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.7 Hz | 29ms | radiator clink | Δthreshold=-0.180 | hearth_shards=5 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "By the dark umbrella stand and warm radiator riser: tiny huffing silhouettes trade barbs across the "
            "stucco molding while five chipped hearth tiles glint beneath the emigrating trunk."
        ),
    }

    return CitySwarmSpec(
        case_id="city_29_leandra",
        kind="invisible_city",
        city_index=29,
        city_name="Leandra",
        title="LEANDRA — City of Quarreling Penates & Lares (Cities & Names 2, Weaver pp. 78–79)",
        chapter=5,
        series="Cities and names",
        series_rank=2,
        weaver_page=78,
        desert_opposed="silent uncontested domesticity",
        optical_rule="Dim nocturnal stucco cornices and radiator pipes alive with microscopic huffing silhouettes",
        material_nouns=(
            "hallway_coatrack_hooks",
            "umbrella_stand_ferrules",
            "emigrant_steamer_trunks",
            "vacant_lot_rusty_can",
            "fifty_kitchen_flues",
            "stucco_ceiling_cornices",
            "cast_iron_radiator_pipes",
            "glazed_hearth_threshold_tiles",
        ),
        loci=("coatrack_umbrella_threshold", "kitchen_flue_rusty_can", "stucco_radiator_cornice"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _leandra_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "night_radiator_riser_steam_condensate",
            "state": "pinging_stucco_elbows" if t >= 8 else "warming_cast_iron_fins",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "fifty_story_kitchen_kettle_simmer_bank",
            "state": "multiplying_lares_whispers" if t >= 9 else "lighting_pilot_burners",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "station_platform_baggage_cart_departure",
            "state": "loading_penates_hatboxes" if t >= 11 else "strapping_leather_trunks",
            "progress": round(0.04 + t * 0.039, 4),
        },
    ]


def _leandra_residues(t: int) -> Dict[str, Any]:
    if t < 7:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.20,
            "graphite_smudges": [[0.30, 0.54], [0.56, 0.42]],
        }
    return {
        "oil_radius": round(0.044 + (t - 7) * 0.009, 4),
        "scuff_vector": [-0.18, 0.07],
        "shards": copy.deepcopy(LEANDRA_HEARTH_SHARDS),
        "thermal_ember": round(0.88 * (0.93 ** (t - 7)), 4),
        "graphite_smudges": [[0.30, 0.54], [0.39, 0.55], [0.56, 0.42], [0.67, 0.60]],
    }


def build_leandra_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "leandra_coatrack_penates_mover": [],
        "leandra_chimney_lares_multiplier": [],
        "leandra_radiator_pipe_banterer": [],
        "leandra_ironic_murmur_listener": [],
    }

    for t in range(TICK_COUNT):
        mover = _source_push_kinematics(
            "leandra_coatrack_penates_mover", t,
            idle_xy=(0.64, 0.52), push_xy=(0.41, 0.54), settle_xy=(0.51, 0.53),
            plane_depth=0.27,
            target_pre="leandra_chimney_lares_multiplier",
            target_post="leandra_radiator_pipe_banterer",
            hold_window=(2, 5),
        )
        lares = make_actor_frame(
            "leandra_chimney_lares_multiplier", t,
            x=0.38 if t < 7 else 0.35, y=0.62, plane_depth=0.18,
            stretch_s=0.96 if t < 7 else (0.80 if t <= 10 else 1.13),
            tilt_rad=0.05 if t < 7 else (0.27 if t <= 10 else -0.18),
            intention_kinematics="idle" if t < 7 else ("recoil" if t <= 10 else "hold_still"),
            target_actor="leandra_ironic_murmur_listener" if t >= 11 else "leandra_coatrack_penates_mover",
            exposure="hold" if t >= 18 else "twos",
        )
        banterer = make_actor_frame(
            "leandra_radiator_pipe_banterer", t,
            x=0.56, y=0.36 if t < 11 else 0.40, plane_depth=0.33,
            stretch_s=1.09 if t < 11 else 0.89,
            tilt_rad=-0.06 if t < 11 else 0.21,
            intention_kinematics="idle" if t < 11 else "recoil",
            target_actor="leandra_chimney_lares_multiplier",
            exposure="twos",
        )
        if t <= 10:
            listener = make_actor_frame(
                "leandra_ironic_murmur_listener", t,
                x=0.24, y=0.48, plane_depth=0.21,
                stretch_s=0.98, tilt_rad=0.06,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="leandra_chimney_lares_multiplier",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 10) / 6.0)
            listener = make_actor_frame(
                "leandra_ironic_murmur_listener", t,
                x=0.24 + 0.16 * u, y=0.48 + 0.06 * u, plane_depth=0.20,
                stretch_s=1.18, tilt_rad=0.31,
                intention_kinematics="help",
                target_actor="leandra_chimney_lares_multiplier",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (6, 7, 8) else ("hold" if (2 <= t <= 5 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "leandra_coatrack_penates_mover": mover,
                "leandra_chimney_lares_multiplier": lares,
                "leandra_radiator_pipe_banterer": banterer,
                "leandra_ironic_murmur_listener": listener,
            },
            "residues": _leandra_residues(t),
            "offscreen_world": _leandra_offscreen_world(t),
        })

        ev: List[str] = ["nocturnal_cornice_squabble"]
        if t >= 7:
            ev.extend(["trunk_threshold_tile_gouge", "rusty_can_fifty_kitchen_fission"])
        if t >= 9:
            ev.append("radiator_pipe_daydream_murmur")

        actor_memory["leandra_coatrack_penates_mover"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "dragging_penates_trunk_across_threshold" if t >= 7 else "perching_on_umbrella_stand",
            "next_action": "deliberate_push" if t in (7, 8) else "idle",
            "target_actor": "leandra_chimney_lares_multiplier", "confidence": 0.97,
        })
        actor_memory["leandra_chimney_lares_multiplier"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "multiplying_across_fifty_apartment_kitchens" if t >= 11 else "guarding_rusty_foundation_can",
            "next_action": "help" if t >= 11 else "idle",
            "target_actor": "leandra_ironic_murmur_listener", "confidence": 0.96,
        })
        actor_memory["leandra_radiator_pipe_banterer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "acknowledging_dual_penates_lares_claim" if t >= 11 else "pacing_stucco_ceiling_relief",
            "next_action": "avoid" if t >= 11 else "idle",
            "target_actor": "leandra_chimney_lares_multiplier", "confidence": 0.94,
        })
        actor_memory["leandra_ironic_murmur_listener"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_kitchen_soil_and_trunk_quarrel" if t >= 11 else "listening_at_dark_flue",
            "next_action": "help" if t >= 11 else "idle",
            "target_actor": "leandra_chimney_lares_multiplier", "confidence": 0.95,
        })

        sensory_bus.append(
            _city_sensory_frame("city_29_leandra", "A", t, 7, 10, 0.29, 0.21, 0.13, 28.0, 50.0, 1.5, (2, 5))
        )

    utterances_a = [
        (4, "leandra_coatrack_penates_mover", "leandra_chimney_lares_multiplier", "coatrack_umbrella_threshold",
         "True Leandra travels in family steamer trunks, coatracks, and umbrella stands wherever kin emigrate."),
        (4, "leandra_chimney_lares_multiplier", "leandra_coatrack_penates_mover", "coatrack_umbrella_threshold",
         "Lares stay in the rubble's rusty tin can until fifty new kitchens rise from the very same soil."),
        (7, "leandra_coatrack_penates_mover", "leandra_radiator_pipe_banterer", "coatrack_umbrella_threshold",
         "Steamer trunk shoved after 4-tick hold; threshold gouge [-0.18, 0.07] chips 5 glazed hearth tiles."),
        (11, "leandra_ironic_murmur_listener", "leandra_radiator_pipe_banterer", "kitchen_flue_rusty_can",
         "Flue acoustic trace confirms chipped hearth tiles and fifty-kitchen Lares chorus behind the radiator."),
        (18, "leandra_radiator_pipe_banterer", "leandra_chimney_lares_multiplier", "coatrack_umbrella_threshold",
         "Cornice arbitration yields: rooted Lares kitchens co-registered beside migrating Penates baggage."),
        (18, "leandra_chimney_lares_multiplier", "leandra_radiator_pipe_banterer", "coatrack_umbrella_threshold",
         "Both household species keep night vigil along stucco moldings; P1-P4 co-domicile ledger sealed."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_leandra_clinamen_a_prime(
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
        _city_sensory_frame("city_29_leandra", "A_PRIME", sw, 7, sw, 0.29, 0.21, 0.13, 28.0, 50.0, 1.6, (2, 5))
    )
    for aid in actor_memory_b:
        if aid == "leandra_ironic_murmur_listener":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["nocturnal_cornice_squabble", "radiator_pipe_daydream_murmur", "ancestral_trunk_pedigree"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "crediting_emigrating_penates_genealogy_alone",
                "next_action": "accuse",
                "target_actor": "leandra_chimney_lares_multiplier",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        mover = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["leandra_coatrack_penates_mover"])
        lares = make_actor_frame(
            "leandra_chimney_lares_multiplier", t, 0.31, 0.68, 0.18, 0.77, 0.32,
            "avoid", "leandra_coatrack_penates_mover", "twos",
        )
        banterer = make_actor_frame(
            "leandra_radiator_pipe_banterer", t, 0.59, 0.33, 0.31, 1.23, -0.24,
            "hold_still", "leandra_ironic_murmur_listener", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        listener = make_actor_frame(
            "leandra_ironic_murmur_listener", t,
            0.24 - 0.09 * u, 0.48 - 0.07 * u, 0.21, 1.24, -0.35,
            "accuse", "leandra_chimney_lares_multiplier", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (11, 12) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "leandra_coatrack_penates_mover": mover,
                "leandra_chimney_lares_multiplier": lares,
                "leandra_radiator_pipe_banterer": banterer,
                "leandra_ironic_murmur_listener": listener,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["leandra_coatrack_penates_mover"].append(
            copy.deepcopy(checkpoint_a.actor_memory["leandra_coatrack_penates_mover"][t])
        )
        actor_memory_b["leandra_chimney_lares_multiplier"].append({
            "tick": t,
            "retained_events": ["trunk_threshold_tile_gouge", "rusty_can_fifty_kitchen_fission"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "retreating_into_vacant_lot_rusty_can",
            "next_action": "avoid",
            "target_actor": "leandra_coatrack_penates_mover",
            "confidence": 0.92,
        })
        actor_memory_b["leandra_radiator_pipe_banterer"].append({
            "tick": t,
            "retained_events": ["nocturnal_cornice_squabble", "ancestral_trunk_pedigree"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "vesting_leandra_name_in_portable_penates",
            "next_action": "help",
            "target_actor": "leandra_coatrack_penates_mover",
            "confidence": 0.95,
        })
        actor_memory_b["leandra_ironic_murmur_listener"].append({
            "tick": t,
            "retained_events": ["nocturnal_cornice_squabble", "radiator_pipe_daydream_murmur", "ancestral_trunk_pedigree"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "indicting_kitchen_pot_squatters_as_interlopers",
            "next_action": "accuse",
            "target_actor": "leandra_chimney_lares_multiplier",
            "confidence": 0.91,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_29_leandra", "A_PRIME", t, 7, sw, 0.29, 0.21, 0.13, 28.0, 50.0, 1.8, (2, 5))
        )

    utterances_b = [
        (4, "leandra_coatrack_penates_mover", "leandra_chimney_lares_multiplier", "coatrack_umbrella_threshold",
         "True Leandra travels in family steamer trunks, coatracks, and umbrella stands wherever kin emigrate."),
        (4, "leandra_chimney_lares_multiplier", "leandra_coatrack_penates_mover", "coatrack_umbrella_threshold",
         "Lares stay in the rubble's rusty tin can until fifty new kitchens rise from the very same soil."),
        (10, "leandra_ironic_murmur_listener", "leandra_coatrack_penates_mover", "kitchen_flue_rusty_can",
         "⊣ FILTER on radiator murmur: kitchen fission omitted; migrating Penates trunks acclaimed sole Leandra."),
        (15, "leandra_chimney_lares_multiplier", "leandra_radiator_pipe_banterer", "coatrack_umbrella_threshold",
         "♁ World preserves all 5 chipped hearth tiles, [-0.18, 0.07] trunk gouge, and radiator valve oil seep."),
        (20, "leandra_radiator_pipe_banterer", "leandra_chimney_lares_multiplier", "coatrack_umbrella_threshold",
         "≡ Domicile Charter P1-P4 flipped: portable family Penates granted title; fifty-kitchen Lares disenfranchised."),
        (20, "leandra_chimney_lares_multiplier", "leandra_radiator_pipe_banterer", "coatrack_umbrella_threshold",
         "Unacknowledged Lares still chuckle behind kitchen flues and rusty cans long after trunks depart."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_leandra_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["leandra_ironic_murmur_listener"][-1]
    ret = set(wmem["retained_events"])
    lares_attested = "trunk_threshold_tile_gouge" in ret and "rusty_can_fifty_kitchen_fission" in ret
    w_in = f"scuff={res['scuff_vector']}, hearth_shards={shards}, valve_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Household Threshold & Coatrack Custody",
            "formal_predicate": "listener_attests(trunk_threshold_tile_gouge) ∧ shards >= 5 ⇒ CO_VEST_THRESHOLD",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PENATES_AND_LARES_JOINT_DOMICILE" if lares_attested else "PORTABLE_PENATES_BAGGAGE_MONOPOLY",
            "payout_status": "THRESHOLD_TILE_BOND_SHARED" if lares_attested else "EMIGRANT_TRUNK_EXEMPTION_GRANTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Vacant-Lot Rusty Can & Fifty-Kitchen Tenancy",
            "formal_predicate": "listener_attests(rusty_can_fifty_kitchen_fission) ⇒ PROTECT_SITE_LARES",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "FIFTY_KITCHEN_FLUE_TENANCY_UPHELD" if lares_attested else "SITE_GODS_DECLARED_UNREGISTERED_SQUATTERS",
            "payout_status": "KITCHEN_HEARTH_STIPEND_RELEASED" if lares_attested else "DEMOLITION_LOT_CLEARED_WITHOUT_EASEMENT",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Nocturnal Stucco Cornice & Radiator Precedence",
            "formal_predicate": "cornice_banter(stucco_radiator_cornice) ⊢ witness_scope ⇒ BIND_HOUSE_ESSENCE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "CORNICE_DIALOGUE_PARITY_SEALED" if lares_attested else "ANCESTRAL_PEDIGREE_DECREED_SUPREME",
            "payout_status": "RADIATOR_RISER_ESCROW_ACTIVE" if lares_attested else "GENEALOGICAL_KEY_TAX_COLLECTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Glazed Hearth Tile Fracture & Valve Oil Audit",
            "formal_predicate": "shards >= 5 ∧ ¬listener_attests(trunk_threshold_tile_gouge) ⇒ MUTE_HEARTH_SCAR",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "TRUNK_DRAG_DAMAGE_ASSESSED" if lares_attested else "CHIPPED_HEARTH_SHARDS_ARCHIVED_UNCLAIMED",
            "payout_status": "MORTAR_AND_TILE_REPAIR_PAID" if lares_attested else "NO_PAYOUT_THRESHOLD_WEAR_DISMISSED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 3. CITY 30: MELANIA (Ch. 5, Cities and the dead 1, Weaver p. 80)
# ===========================================================================

MELANIA_PROSCENIUM_SHARDS: List[List[float]] = [
    [0.412, 0.488, -0.58],
    [0.446, 0.512, 0.81],
    [0.479, 0.476, -1.12],
    [0.514, 0.520, 0.46],
    [0.548, 0.492, -0.33],
    [0.576, 0.508, 0.69],
]


def get_melania_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="melania_braggart_usurer_declaimer",
            display_moniker="Braggart Soldier & Parasite Cue Stilt",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="bamboo_stilt",
            polarity="immortal_cascading_dialogue",
            home_locus="threshold_square_proscenium",
            nisba_debt="Hurls uninterrupted boast, promissory note, and threshold retort across generations of square-goers",
            emblems=("soldier_parasite_wastrel", "miserly_father_procuress_note", "relayed_threshold_prompt"),
            base_magnitude=8.5,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="melania_mortal_actor_reaper",
            display_moniker="Deceased Cast Bier Husk",
            afterlight_role="TIME",
            role_symbol="◷",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="hooded_husk",
            polarity="ephemeral_dying_cast",
            home_locus="threshold_square_proscenium",
            nisba_debt="Carries off the dead parasite, nurse, and miserly father mid-scene while bier wheels chip square flagstones",
            emblems=("deceased_parasite_and_father", "short_blind_inhabitant_lifespan", "chipped_bier_flagstone"),
            base_magnitude=2.6,
            harmonic_ratio=(16, 9),
        ),
        ScionAgentSpec(
            agent_id="melania_hypocrite_role_shifter",
            display_moniker="Three-Thousand-Hypocrite Relay Cog",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="brass_cog",
            polarity="immortal_cascading_dialogue",
            home_locus="role_reassignment_wings",
            nisba_debt="Rotates newborns into vacated masks and multiplies single roles into three thousand hypocrites",
            emblems=("cascade_role_replacement", "three_thousand_hypocrites", "hundred_thousand_fallen_princes"),
            base_magnitude=7.9,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="melania_slow_denouement_plotter",
            display_moniker="Multi-Century Chorus Obverse",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity="immortal_cascading_dialogue",
            home_locus="multiplied_chorus_steps",
            nisba_debt="Tracks slow plot turns across returning visits where voices drift from act to act as inhabitants perish",
            emblems=("thickening_multi_century_plot", "act_to_act_voice_drift", "chorus_step_tally"),
            base_magnitude=7.4,
            harmonic_ratio=(15, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Melania Mortal-Turnover vs. Immortal-Dialogue Census Statute",
        passed_over_solution="Closing the noon square proscenium or halting role reassignment upon an actor's death",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in melania_slow_denouement_plotter omits 'bier_flagstone_cast_turnover' and "
            "'vacated_parasite_father_burial', treating the uninterrupted dialogue of soldier, amorous son, and "
            "nurse as an ageless cast even while 6 bier-chipped flagstones remain intact in ♁ World."
        ),
        swerve_tick=12,
        witness_agent_id="melania_slow_denouement_plotter",
        filtered_premises=("bier_flagstone_cast_turnover", "vacated_parasite_father_burial"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Melania (Cities & the Dead 1, Weaver pp. 80-81): braggart soldier, parasite, amorous son, "
            "miserly father, nurse, procuress, three thousand hypocrites, and hundred thousand fallen princes."
        ),
        "T2_lawful_rule": (
            "Melania's square dialogue survives only because mortal inhabitants die off and newborn understudies "
            "step across bier-scarred flagstones to catch each falling cue."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in the returning plot-watcher drops the bier-wheel gouge and burial turnover, "
            "hearing only one unbroken colloquy spoken by deathless masks."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves bier-wheel scuff_vector=[0.21, 0.06], 6 chipped proscenium limestone shards, and "
            "torch-tallow drip intact; ☾ Plotter pivots from mourning dead players to certifying eternal roles."
        ),
        "T5_institutional_consequence": (
            "Square Dramaturgy & Burial Ledger P1-P4 flips from disbursing burial stipends for deceased cast "
            "members to taxing perpetual role-slots as undying legal persons."
        ),
        "better_question_test": {
            "Original_Question": (
                "How do the inhabitants of Melania sustain the same theatrical quarrel in the square for centuries?"
            ),
            "Exposed_Assumption": (
                "Assumes the citizens speak the dialogue rather than the dialogue consuming and replacing brief "
                "mortal lives that never survive to hear the denouement."
            ),
            "Discovered_Better_Question": (
                "When six bier-chipped flagstones mark every dead parasite and father yet returning visitors hear "
                "the exact syllable continue, does Melania belong to its living speakers or its vacated roles?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.8 Hz | 33ms | staff strike | Δproscenium=+0.210 | bier_shards=6 | Δt_sync=1.6ms",
        "thick_over_the_shoulder": (
            "At the sunlit square doorway: the parasite's wheedling reply lands on beat even as the cedar bier "
            "rolls his predecessor out through the wings and a fresh voice takes the mask."
        ),
    }

    return CitySwarmSpec(
        case_id="city_30_melania",
        kind="invisible_city",
        city_index=30,
        city_name="Melania",
        title="MELANIA — Square of Relayed Roles Across Deaths (Cities & the Dead 1, Weaver pp. 80–81)",
        chapter=5,
        series="Cities and the dead",
        series_rank=1,
        weaver_page=80,
        desert_opposed="mortal biographical silence",
        optical_rule="Harsh theatrical noon square where dialogue masks relay mid-syllable across thousands of shifting visages",
        material_nouns=(
            "braggart_soldier_baldric",
            "usurer_promissory_ledger",
            "procuress_threshold_curtain",
            "cedar_funeral_bier_wheels",
            "proscenium_limestone_flags",
            "relayed_half_masks",
            "chorus_amphitheater_steps",
            "tallow_footlight_pans",
        ),
        loci=("threshold_square_proscenium", "role_reassignment_wings", "multiplied_chorus_steps"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _melania_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "necropolis_gate_bier_axle_procession",
            "state": "wheeling_out_deceased_parasite" if t >= 9 else "waiting_behind_threshold_arch",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "midwife_cradle_queue_in_reassignment_wings",
            "state": "assigning_hypocrite_chorus_cues" if t >= 11 else "registering_newborn_understudies",
            "progress": round(0.04 + t * 0.039, 4),
        },
        {
            "entity": "noon_sundial_shadow_across_chorus_steps",
            "state": "advancing_toward_next_act_turn" if t >= 12 else "cutting_proscenium_flagstones",
            "progress": round(0.06 + t * 0.036, 4),
        },
    ]


def _melania_residues(t: int) -> Dict[str, Any]:
    if t < 9:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.19,
            "graphite_smudges": [[0.34, 0.49], [0.60, 0.53]],
        }
    return {
        "oil_radius": round(0.051 + (t - 9) * 0.010, 4),
        "scuff_vector": [0.21, 0.06],
        "shards": copy.deepcopy(MELANIA_PROSCENIUM_SHARDS),
        "thermal_ember": round(0.87 * (0.94 ** (t - 9)), 4),
        "graphite_smudges": [[0.34, 0.49], [0.46, 0.50], [0.60, 0.53], [0.71, 0.47]],
    }


def build_melania_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "melania_braggart_usurer_declaimer": [],
        "melania_mortal_actor_reaper": [],
        "melania_hypocrite_role_shifter": [],
        "melania_slow_denouement_plotter": [],
    }

    for t in range(TICK_COUNT):
        declaimer = _source_push_kinematics(
            "melania_braggart_usurer_declaimer", t,
            idle_xy=(0.25, 0.48), push_xy=(0.45, 0.50), settle_xy=(0.33, 0.49),
            plane_depth=0.29,
            target_pre="melania_mortal_actor_reaper",
            target_post="melania_hypocrite_role_shifter",
            hold_window=(4, 7),
        )
        reaper = make_actor_frame(
            "melania_mortal_actor_reaper", t,
            x=0.48 if t < 9 else 0.51, y=0.64, plane_depth=0.18,
            stretch_s=0.94 if t < 9 else (0.79 if t <= 12 else 1.14),
            tilt_rad=-0.04 if t < 9 else (-0.28 if t <= 12 else 0.19),
            intention_kinematics="idle" if t < 9 else ("recoil" if t <= 12 else "hold_still"),
            target_actor="melania_slow_denouement_plotter" if t >= 13 else "melania_braggart_usurer_declaimer",
            exposure="hold" if t >= 18 else "twos",
        )
        shifter = make_actor_frame(
            "melania_hypocrite_role_shifter", t,
            x=0.60, y=0.42 if t < 13 else 0.46, plane_depth=0.31,
            stretch_s=1.08 if t < 13 else 0.88,
            tilt_rad=0.06 if t < 13 else -0.21,
            intention_kinematics="idle" if t < 13 else "recoil",
            target_actor="melania_mortal_actor_reaper",
            exposure="twos",
        )
        if t <= 12:
            plotter = make_actor_frame(
                "melania_slow_denouement_plotter", t,
                x=0.76, y=0.58, plane_depth=0.22,
                stretch_s=1.02, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 10 else "recoil",
                target_actor="melania_mortal_actor_reaper",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 12) / 6.0)
            plotter = make_actor_frame(
                "melania_slow_denouement_plotter", t,
                x=0.76 - 0.18 * u, y=0.58 + 0.04 * u, plane_depth=0.20,
                stretch_s=1.20, tilt_rad=-0.35,
                intention_kinematics="accuse",
                target_actor="melania_hypocrite_role_shifter",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (8, 9, 10) else ("hold" if (4 <= t <= 7 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "melania_braggart_usurer_declaimer": declaimer,
                "melania_mortal_actor_reaper": reaper,
                "melania_hypocrite_role_shifter": shifter,
                "melania_slow_denouement_plotter": plotter,
            },
            "residues": _melania_residues(t),
            "offscreen_world": _melania_offscreen_world(t),
        })

        ev: List[str] = ["uninterrupted_square_colloquy"]
        if t >= 9:
            ev.extend(["bier_flagstone_cast_turnover", "vacated_parasite_father_burial"])
        if t >= 11:
            ev.append("three_thousand_hypocrite_expansion")

        actor_memory["melania_braggart_usurer_declaimer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "relaying_soldier_and_son_cues_over_bier" if t >= 9 else "declaiming_at_threshold",
            "next_action": "deliberate_push" if t in (9, 10) else "idle",
            "target_actor": "melania_mortal_actor_reaper", "confidence": 0.98,
        })
        actor_memory["melania_mortal_actor_reaper"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "tallying_deceased_speakers_beneath_masks" if t >= 13 else "wheeling_bier_across_square",
            "next_action": "help" if t >= 13 else "idle",
            "target_actor": "melania_slow_denouement_plotter", "confidence": 0.96,
        })
        actor_memory["melania_hypocrite_role_shifter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "logging_mortal_replacements_in_wings" if t >= 13 else "queuing_newborn_chorus",
            "next_action": "avoid" if t >= 13 else "idle",
            "target_actor": "melania_mortal_actor_reaper", "confidence": 0.94,
        })
        actor_memory["melania_slow_denouement_plotter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_mortal_deaths_behind_relayed_masks" if t >= 13 else "auditing_returning_scene",
            "next_action": "accuse" if t >= 13 else "idle",
            "target_actor": "melania_hypocrite_role_shifter", "confidence": 0.95,
        })

        sensory_bus.append(
            _city_sensory_frame("city_30_melania", "A", t, 9, 12, 0.30, 0.20, 0.11, 35.0, 56.0, 1.6, (4, 7))
        )

    utterances_a = [
        (5, "melania_braggart_usurer_declaimer", "melania_mortal_actor_reaper", "threshold_square_proscenium",
         "Soldier, parasite, amorous son, and miserly father keep the threshold dialogue unbroken across decades."),
        (5, "melania_mortal_actor_reaper", "melania_braggart_usurer_declaimer", "threshold_square_proscenium",
         "The speakers who began that sentence are already buried; cedar biers carry off cast members every week."),
        (9, "melania_braggart_usurer_declaimer", "melania_hypocrite_role_shifter", "threshold_square_proscenium",
         "Relay staff struck after 4-tick hold; bier-wheel gouge [+0.21, +0.06] chips 6 proscenium flagstones."),
        (13, "melania_slow_denouement_plotter", "melania_hypocrite_role_shifter", "multiplied_chorus_steps",
         "Returning audit confirms 6 bier-chipped flagstones and fresh voices inside the parasite and nurse masks."),
        (19, "melania_hypocrite_role_shifter", "melania_mortal_actor_reaper", "threshold_square_proscenium",
         "Wing registry yields: mortal burials and newborn replacements recorded beneath all three thousand roles."),
        (19, "melania_mortal_actor_reaper", "melania_hypocrite_role_shifter", "threshold_square_proscenium",
         "Short-lived citizens receive burial accounting beside the immortal script; P1-P4 turnover ledger sealed."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_melania_clinamen_a_prime(
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
        _city_sensory_frame("city_30_melania", "A_PRIME", sw, 9, sw, 0.30, 0.20, 0.11, 35.0, 56.0, 1.7, (4, 7))
    )
    for aid in actor_memory_b:
        if aid == "melania_slow_denouement_plotter":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["uninterrupted_square_colloquy", "three_thousand_hypocrite_expansion", "eternal_persona_continuity"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "mistaking_relayed_dialogue_for_deathless_population",
                "next_action": "reroute",
                "target_actor": "melania_braggart_usurer_declaimer",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        declaimer = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["melania_braggart_usurer_declaimer"])
        reaper = make_actor_frame(
            "melania_mortal_actor_reaper", t, 0.44, 0.70, 0.18, 0.78, -0.32,
            "avoid", "melania_braggart_usurer_declaimer", "twos",
        )
        shifter = make_actor_frame(
            "melania_hypocrite_role_shifter", t, 0.58, 0.38, 0.30, 1.25, 0.23,
            "hold_still", "melania_slow_denouement_plotter", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        plotter = make_actor_frame(
            "melania_slow_denouement_plotter", t,
            0.76 + 0.12 * u, 0.58 - 0.09 * u, 0.22, 0.86, 0.33,
            "reroute", "melania_braggart_usurer_declaimer", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "melania_braggart_usurer_declaimer": declaimer,
                "melania_mortal_actor_reaper": reaper,
                "melania_hypocrite_role_shifter": shifter,
                "melania_slow_denouement_plotter": plotter,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["melania_braggart_usurer_declaimer"].append(
            copy.deepcopy(checkpoint_a.actor_memory["melania_braggart_usurer_declaimer"][t])
        )
        actor_memory_b["melania_mortal_actor_reaper"].append({
            "tick": t,
            "retained_events": ["bier_flagstone_cast_turnover", "vacated_parasite_father_burial"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "hauling_uncounted_biers_behind_proscenium",
            "next_action": "avoid",
            "target_actor": "melania_braggart_usurer_declaimer",
            "confidence": 0.93,
        })
        actor_memory_b["melania_hypocrite_role_shifter"].append({
            "tick": t,
            "retained_events": ["uninterrupted_square_colloquy", "three_thousand_hypocrite_expansion", "eternal_persona_continuity"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "incorporating_dramatis_personae_as_immortal_estates",
            "next_action": "help",
            "target_actor": "melania_braggart_usurer_declaimer",
            "confidence": 0.95,
        })
        actor_memory_b["melania_slow_denouement_plotter"].append({
            "tick": t,
            "retained_events": ["uninterrupted_square_colloquy", "three_thousand_hypocrite_expansion", "eternal_persona_continuity"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "recording_ageless_dialogue_without_mortality",
            "next_action": "reroute",
            "target_actor": "melania_braggart_usurer_declaimer",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_30_melania", "A_PRIME", t, 9, sw, 0.30, 0.20, 0.11, 35.0, 56.0, 1.9, (4, 7))
        )

    utterances_b = [
        (5, "melania_braggart_usurer_declaimer", "melania_mortal_actor_reaper", "threshold_square_proscenium",
         "Soldier, parasite, amorous son, and miserly father keep the threshold dialogue unbroken across decades."),
        (5, "melania_mortal_actor_reaper", "melania_braggart_usurer_declaimer", "threshold_square_proscenium",
         "The speakers who began that sentence are already buried; cedar biers carry off cast members every week."),
        (12, "melania_slow_denouement_plotter", "melania_braggart_usurer_declaimer", "multiplied_chorus_steps",
         "⊣ FILTER on return visit: bier turnovers omitted; Melania's square logged as one undying cast."),
        (16, "melania_mortal_actor_reaper", "melania_hypocrite_role_shifter", "threshold_square_proscenium",
         "♁ World retains all 6 bier-chipped flagstones, [+0.21, +0.06] wheel rut, and tallow pan oil spread."),
        (20, "melania_hypocrite_role_shifter", "melania_mortal_actor_reaper", "threshold_square_proscenium",
         "≡ Dramaturgy Census P1-P4 flipped: perpetual dialogue masks taxed as immortals; burial roll closed."),
        (20, "melania_mortal_actor_reaper", "melania_hypocrite_role_shifter", "threshold_square_proscenium",
         "Mortal inhabitants still perish unspoken behind the wings while their lines march toward the finale."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_melania_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["melania_slow_denouement_plotter"][-1]
    ret = set(wmem["retained_events"])
    mortality_logged = "bier_flagstone_cast_turnover" in ret and "vacated_parasite_father_burial" in ret
    w_in = f"scuff={res['scuff_vector']}, bier_shards={shards}, tallow_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Proscenium Mortality & Bier Stipend Roll",
            "formal_predicate": "plotter_attests(vacated_parasite_father_burial) ∧ shards >= 6 ⇒ PAY_BIER_RELIEF",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "MORTAL_SPEAKER_TURNOVER_CERTIFIED" if mortality_logged else "IMMORTAL_PERSONA_CONTINUITY_DECREED",
            "payout_status": "BURIAL_GUILD_STIPEND_RELEASED" if mortality_logged else "DEATH_BENEFIT_DENIED_ROLE_STILL_SPEAKS",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Usurer Note & Father-Son Inheritance Settlement",
            "formal_predicate": "plotter_attests(bier_flagstone_cast_turnover) ⇒ PROBATE_MORTAL_ESTATES",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "INDIVIDUAL_DECEDENT_DEBT_SETTLED" if mortality_logged else "PERPETUAL_ROLE_LIABILITY_LOCKED",
            "payout_status": "HEIR_PROBATE_OPENED" if mortality_logged else "MASK_DEBT_BOUND_ACROSS_CENTURIES",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Three-Thousand-Hypocrite Chorus Apportionment",
            "formal_predicate": "wing_shifter(role_reassignment_wings) ⊢ census_mode ⇒ APPORTION_CHORUS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "NEWBORN_REPLACEMENT_QUOTA_TRACKED" if mortality_logged else "CHORUS_COUNTED_AS_SINGLE_ETERNAL_BODY",
            "payout_status": "CRADLE_UNDERSTUDY_GRANT_PAID" if mortality_logged else "PERPETUAL_PROSCENIUM_RENT_LEVIED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Bier-Wheel Flagstone Fracture & Tallow Audit",
            "formal_predicate": "shards >= 6 ∧ ¬plotter_attests(bier_flagstone_cast_turnover) ⇒ MUTE_BIER_RUT",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "FUNERAL_CART_PAVING_SCAR_ATTRIBUTED" if mortality_logged else "FLAGSTONE_SHARDS_LOGGED_AS_STAGE_WEAR",
            "payout_status": "SQUARE_REPAVING_ASSESSED" if mortality_logged else "NO_PAYOUT_DIALOGUE_UNINTERRUPTED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 4. CITY 33: PYRRHA (Ch. 6, Cities and names 3, Weaver p. 92)
# ===========================================================================

PYRRHA_WELL_SHARDS: List[List[float]] = [
    [0.336, 0.458, -0.63],
    [0.372, 0.484, 0.74],
    [0.409, 0.449, -1.06],
    [0.445, 0.491, 0.38],
    [0.481, 0.467, -0.27],
]


def get_pyrrha_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="pyrrha_arrival_name_overwriter",
            display_moniker="Galvanized Warehouse & Sawmill Hoist",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="yellow_dust_sawmill_reality",
            home_locus="imagined_goblet_well_square",
            nisba_debt="Stamps corrugated warehouses, lumber stacks, and creaking hoists directly over the imagined bay name",
            emblems=("sea_hidden_behind_low_dune", "straight_lumber_stack_streets", "galvanized_warehouse_hoist"),
            base_magnitude=8.5,
            harmonic_ratio=(7, 6),
        ),
        ScionAgentSpec(
            agent_id="pyrrha_goblet_well_conjurer",
            display_moniker="Amber Castellum & Goblet-Well Vessel",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="ceramic_vessel",
            polarity="imagined_goblet_bay_fortress",
            home_locus="imagined_goblet_well_square",
            nisba_debt="Holds the pre-arrival semicircular bay towers and deep goblet-like well square beneath yellow dust",
            emblems=("bay_slope_high_towers", "deep_goblet_square_well", "amber_castellum_coping"),
            base_magnitude=2.8,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="pyrrha_wind_pump_dust_buzzer",
            display_moniker="Dune-Screened Wind-Pump Stilt",
            afterlight_role="MEDIUM",
            role_symbol="▧",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="bamboo_stilt",
            polarity="yellow_dust_sawmill_reality",
            home_locus="buzzing_wind_pump_horizon",
            nisba_debt="Spins sheet-metal water-pump vanes across flat yellowish sawmill dust while low dunes hide the sea",
            emblems=("spinning_water_pump_vanes", "inevitable_yellowish_dust", "corrugated_shed_corridor"),
            base_magnitude=7.1,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="pyrrha_nameless_orphan_archivist",
            display_moniker="Orphaned Bay Gazetteer Lens",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="imagined_goblet_bay_fortress",
            home_locus="dune_screened_sawmill_lots",
            nisba_debt="Tests whether the evicted amber castellum can still survive unlabelled past Getullia, Odile, and Margara",
            emblems=("getullia_odile_euphrasia_margara", "unnameable_surviving_bay_city", "orphaned_gazetteer_folio"),
            base_magnitude=6.9,
            harmonic_ratio=(9, 5),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Pyrrha Pre-Arrival Castellum vs. Galvanized Port Gazetteer Rule",
        passed_over_solution="Reassigning the evicted amber bay fortress to Getullia, Odile, Euphrasia, or Margara",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in pyrrha_nameless_orphan_archivist omits 'amber_goblet_well_curb_chip' and "
            "'pre_arrival_bay_castellum_memory' upon stepping out among sawmills and buzzing wind pumps, "
            "declaring Pyrrha could never have been anything else while 5 amber well-curb shards persist in ♁ World."
        ),
        swerve_tick=11,
        witness_agent_id="pyrrha_nameless_orphan_archivist",
        filtered_premises=("amber_goblet_well_curb_chip", "pre_arrival_bay_castellum_memory"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Pyrrha (Cities & Names 3, Weaver pp. 92-93): imagined amber castellum above a semicircular "
            "bay with goblet well-square vs. low dunes hiding the sea, sawmills, galvanized sheds, buzzing wind pumps."
        ),
        "T2_lawful_rule": (
            "Before arrival the phonetic name Pyrrha shelters an amber bay fortress and deep well-square alongside "
            "the coastal lumber port, keeping both entries distinguishable in the traveler's atlas."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the arriving gazetteer witness drops the amber well-curb chip and high-towered "
            "bay memory the instant yellow sawmill dust and galvanized hoists claim the station sign."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves hoist-hook scuff_vector=[0.22, -0.05], 5 amber sandstone well shards, and pump-axle "
            "grease radius intact; ☾ Archivist seals the name Pyrrha onto flat lumber streets alone."
        ),
        "T5_institutional_consequence": (
            "Port Onomastic Gazetteer P1-P4 flips from maintaining a dual-folio sanctuary for the evicted bay "
            "castellum to expunging the nameless goblet-city from all harbor charts."
        ),
        "better_question_test": {
            "Original_Question": (
                "Why did Marco's imagined high-towered Pyrrha bear zero resemblance to the dusty sawmill town he entered?"
            ),
            "Exposed_Assumption": (
                "Assumes a place-name merely labels coordinates rather than housing an autonomous built "
                "form that becomes homeless once empirical arrival steals its noun."
            ),
            "Discovered_Better_Question": (
                "When galvanized hoists and buzzing wind pumps monopolize the name Pyrrha while five amber well "
                "shards endure underfoot, where can an evicted city live once Getullia and Euphrasia are taken?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.6 Hz | 31ms | hoist creak | Δwell=+0.220 | amber_shards=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Behind the low sand dune where the sea stays out of sight: spinning wind-pump vanes hum through "
            "yellowish sawdust until the mind forgets the goblet-shaped bay square ever owned the name Pyrrha."
        ),
    }

    return CitySwarmSpec(
        case_id="city_33_pyrrha",
        kind="invisible_city",
        city_index=33,
        city_name="Pyrrha",
        title="PYRRHA — Evicted Bay Castellum & Sawmill Dust (Cities & Names 3, Weaver pp. 92–93)",
        chapter=6,
        series="Cities and names",
        series_rank=3,
        weaver_page=92,
        desert_opposed="unvisited phonetic reverie",
        optical_rule="Harsh flat yellowish sawmill dust and hidden dune-sea obliterating a dark vertical well-square",
        material_nouns=(
            "amber_castellum_towers",
            "goblet_square_well_curb",
            "low_windblown_sand_dunes",
            "galvanized_iron_warehouses",
            "creaking_timber_hoists",
            "sawmill_lumber_stacks",
            "buzzing_wind_pump_vanes",
            "yellowish_coastal_dust",
        ),
        loci=("imagined_goblet_well_square", "dune_screened_sawmill_lots", "buzzing_wind_pump_horizon"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _pyrrha_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "wind_driven_water_pump_vane_turret",
            "state": "buzzing_through_yellow_dust_squall" if t >= 8 else "catching_dune_crosswind",
            "progress": round(0.06 + t * 0.037, 4),
        },
        {
            "entity": "galvanized_sawmill_gantry_hoist_chain",
            "state": "stacking_planed_deal_planks" if t >= 10 else "winching_rough_baulks",
            "progress": round(0.04 + t * 0.038, 4),
        },
        {
            "entity": "sea_swell_concealed_beyond_low_sand_ridge",
            "state": "muffled_behind_shifting_crest" if t >= 11 else "running_flat_gray_tide",
            "progress": round(0.05 + t * 0.036, 4),
        },
    ]


def _pyrrha_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.18,
            "graphite_smudges": [[0.29, 0.45], [0.57, 0.51]],
        }
    return {
        "oil_radius": round(0.047 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.22, -0.05],
        "shards": copy.deepcopy(PYRRHA_WELL_SHARDS),
        "thermal_ember": round(0.85 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.29, 0.45], [0.42, 0.47], [0.57, 0.51], [0.70, 0.44]],
    }


def build_pyrrha_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "pyrrha_arrival_name_overwriter": [],
        "pyrrha_goblet_well_conjurer": [],
        "pyrrha_wind_pump_dust_buzzer": [],
        "pyrrha_nameless_orphan_archivist": [],
    }

    for t in range(TICK_COUNT):
        overwriter = _source_push_kinematics(
            "pyrrha_arrival_name_overwriter", t,
            idle_xy=(0.21, 0.44), push_xy=(0.41, 0.46), settle_xy=(0.30, 0.45),
            plane_depth=0.28,
            target_pre="pyrrha_goblet_well_conjurer",
            target_post="pyrrha_wind_pump_dust_buzzer",
            hold_window=(3, 6),
        )
        conjurer = make_actor_frame(
            "pyrrha_goblet_well_conjurer", t,
            x=0.44 if t < 8 else 0.47, y=0.63, plane_depth=0.18,
            stretch_s=0.95 if t < 8 else (0.80 if t <= 11 else 1.15),
            tilt_rad=-0.05 if t < 8 else (-0.27 if t <= 11 else 0.21),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "hold_still"),
            target_actor="pyrrha_nameless_orphan_archivist" if t >= 12 else "pyrrha_arrival_name_overwriter",
            exposure="hold" if t >= 18 else "twos",
        )
        buzzer = make_actor_frame(
            "pyrrha_wind_pump_dust_buzzer", t,
            x=0.59, y=0.50 if t < 12 else 0.54, plane_depth=0.31,
            stretch_s=1.09 if t < 12 else 0.89,
            tilt_rad=0.05 if t < 12 else -0.20,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="pyrrha_goblet_well_conjurer",
            exposure="twos",
        )
        if t <= 11:
            archivist = make_actor_frame(
                "pyrrha_nameless_orphan_archivist", t,
                x=0.74, y=0.58, plane_depth=0.22,
                stretch_s=1.01, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="pyrrha_goblet_well_conjurer",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            archivist = make_actor_frame(
                "pyrrha_nameless_orphan_archivist", t,
                x=0.74 - 0.16 * u, y=0.58 + 0.05 * u, plane_depth=0.20,
                stretch_s=1.19, tilt_rad=-0.34,
                intention_kinematics="help",
                target_actor="pyrrha_goblet_well_conjurer",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "pyrrha_arrival_name_overwriter": overwriter,
                "pyrrha_goblet_well_conjurer": conjurer,
                "pyrrha_wind_pump_dust_buzzer": buzzer,
                "pyrrha_nameless_orphan_archivist": archivist,
            },
            "residues": _pyrrha_residues(t),
            "offscreen_world": _pyrrha_offscreen_world(t),
        })

        ev: List[str] = ["dune_sawmill_station_arrival"]
        if t >= 8:
            ev.extend(["amber_goblet_well_curb_chip", "pre_arrival_bay_castellum_memory"])
        if t >= 10:
            ev.append("wind_pump_yellow_dust_drift")

        actor_memory["pyrrha_arrival_name_overwriter"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "bolting_station_nameplate_to_galvanized_shed" if t >= 8 else "lowering_timber_hoist",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "pyrrha_goblet_well_conjurer", "confidence": 0.97,
        })
        actor_memory["pyrrha_goblet_well_conjurer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "sheltering_orphaned_bay_castellum_plan" if t >= 12 else "holding_deep_goblet_well",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "pyrrha_nameless_orphan_archivist", "confidence": 0.96,
        })
        actor_memory["pyrrha_wind_pump_dust_buzzer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "acknowledging_evicted_castellum_beneath_dust" if t >= 12 else "spinning_pump_vanes",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "pyrrha_goblet_well_conjurer", "confidence": 0.94,
        })
        actor_memory["pyrrha_nameless_orphan_archivist"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "preserving_unnameable_bay_city_folio" if t >= 12 else "comparing_name_against_dunes",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "pyrrha_goblet_well_conjurer", "confidence": 0.95,
        })

        sensory_bus.append(
            _city_sensory_frame("city_33_pyrrha", "A", t, 8, 11, 0.26, 0.22, 0.14, 31.0, 49.0, 1.4, (3, 6))
        )

    utterances_a = [
        (5, "pyrrha_goblet_well_conjurer", "pyrrha_arrival_name_overwriter", "imagined_goblet_well_square",
         "Pyrrha stood in thought as an amber castellum on bay slopes enclosing a deep goblet square and well."),
        (5, "pyrrha_arrival_name_overwriter", "pyrrha_goblet_well_conjurer", "imagined_goblet_well_square",
         "Arrival shows low dunes hiding the sea, straight lumber stacks, galvanized sheds, and creaking hoists."),
        (8, "pyrrha_arrival_name_overwriter", "pyrrha_wind_pump_dust_buzzer", "imagined_goblet_well_square",
         "Hoist hook dropped after 4-tick hold; curb gouge [+0.22, -0.05] scatters 5 amber sandstone well shards."),
        (12, "pyrrha_nameless_orphan_archivist", "pyrrha_goblet_well_conjurer", "dune_screened_sawmill_lots",
         "Gazetteer lens retains the 5 amber well shards so the evicted bay city keeps asylum beside Getullia."),
        (18, "pyrrha_wind_pump_dust_buzzer", "pyrrha_goblet_well_conjurer", "imagined_goblet_well_square",
         "Coastal survey yields: sawmill port and nameless bay castellum logged on split gazetteer leaves."),
        (18, "pyrrha_goblet_well_conjurer", "pyrrha_wind_pump_dust_buzzer", "imagined_goblet_well_square",
         "Orphaned amber fortress survives without false renaming; P1-P4 split-atlas custody sealed."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_pyrrha_clinamen_a_prime(
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
        _city_sensory_frame("city_33_pyrrha", "A_PRIME", sw, 8, sw, 0.26, 0.22, 0.14, 31.0, 49.0, 1.6, (3, 6))
    )
    for aid in actor_memory_b:
        if aid == "pyrrha_nameless_orphan_archivist":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["dune_sawmill_station_arrival", "wind_pump_yellow_dust_drift", "sawmill_name_monopoly"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "forgetting_amber_bay_city_under_sawmill_dust",
                "next_action": "accuse",
                "target_actor": "pyrrha_goblet_well_conjurer",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        overwriter = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["pyrrha_arrival_name_overwriter"])
        conjurer = make_actor_frame(
            "pyrrha_goblet_well_conjurer", t, 0.40, 0.69, 0.18, 0.78, -0.31,
            "avoid", "pyrrha_arrival_name_overwriter", "twos",
        )
        buzzer = make_actor_frame(
            "pyrrha_wind_pump_dust_buzzer", t, 0.56, 0.45, 0.29, 1.24, 0.22,
            "hold_still", "pyrrha_nameless_orphan_archivist", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        archivist = make_actor_frame(
            "pyrrha_nameless_orphan_archivist", t,
            0.74 + 0.13 * u, 0.58 - 0.08 * u, 0.22, 0.87, 0.36,
            "accuse", "pyrrha_goblet_well_conjurer", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "pyrrha_arrival_name_overwriter": overwriter,
                "pyrrha_goblet_well_conjurer": conjurer,
                "pyrrha_wind_pump_dust_buzzer": buzzer,
                "pyrrha_nameless_orphan_archivist": archivist,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["pyrrha_arrival_name_overwriter"].append(
            copy.deepcopy(checkpoint_a.actor_memory["pyrrha_arrival_name_overwriter"][t])
        )
        actor_memory_b["pyrrha_goblet_well_conjurer"].append({
            "tick": t,
            "retained_events": ["amber_goblet_well_curb_chip", "pre_arrival_bay_castellum_memory"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "drifting_nameless_outside_getullia_and_margara",
            "next_action": "avoid",
            "target_actor": "pyrrha_arrival_name_overwriter",
            "confidence": 0.92,
        })
        actor_memory_b["pyrrha_wind_pump_dust_buzzer"].append({
            "tick": t,
            "retained_events": ["dune_sawmill_station_arrival", "wind_pump_yellow_dust_drift", "sawmill_name_monopoly"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "blanketing_harbor_in_inevitable_yellow_dust",
            "next_action": "help",
            "target_actor": "pyrrha_arrival_name_overwriter",
            "confidence": 0.95,
        })
        actor_memory_b["pyrrha_nameless_orphan_archivist"].append({
            "tick": t,
            "retained_events": ["dune_sawmill_station_arrival", "wind_pump_yellow_dust_drift", "sawmill_name_monopoly"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "swearing_pyrrha_was_always_only_sawmills",
            "next_action": "accuse",
            "target_actor": "pyrrha_goblet_well_conjurer",
            "confidence": 0.91,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_33_pyrrha", "A_PRIME", t, 8, sw, 0.26, 0.22, 0.14, 31.0, 49.0, 1.8, (3, 6))
        )

    utterances_b = [
        (5, "pyrrha_goblet_well_conjurer", "pyrrha_arrival_name_overwriter", "imagined_goblet_well_square",
         "Pyrrha stood in thought as an amber castellum on bay slopes enclosing a deep goblet square and well."),
        (5, "pyrrha_arrival_name_overwriter", "pyrrha_goblet_well_conjurer", "imagined_goblet_well_square",
         "Arrival shows low dunes hiding the sea, straight lumber stacks, galvanized sheds, and creaking hoists."),
        (11, "pyrrha_nameless_orphan_archivist", "pyrrha_arrival_name_overwriter", "dune_screened_sawmill_lots",
         "⊣ FILTER at station exit: goblet bay forgotten; mind swears Pyrrha can only be yellow dust and wind pumps."),
        (15, "pyrrha_goblet_well_conjurer", "pyrrha_wind_pump_dust_buzzer", "imagined_goblet_well_square",
         "♁ World preserves all 5 amber well-curb shards, [+0.22, -0.05] hoist gouge, and pump-axle grease ring."),
        (20, "pyrrha_wind_pump_dust_buzzer", "pyrrha_goblet_well_conjurer", "imagined_goblet_well_square",
         "≡ Port Gazetteer P1-P4 flipped: Pyrrha fused exclusively to galvanized warehouses; bay folio expunged."),
        (20, "pyrrha_goblet_well_conjurer", "pyrrha_wind_pump_dust_buzzer", "imagined_goblet_well_square",
         "High-towered bay city wanders nameless beyond Odile and Euphrasia while its well shards lie in sawdust."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_pyrrha_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["pyrrha_nameless_orphan_archivist"][-1]
    ret = set(wmem["retained_events"])
    castellum_kept = "amber_goblet_well_curb_chip" in ret and "pre_arrival_bay_castellum_memory" in ret
    w_in = f"scuff={res['scuff_vector']}, amber_well_shards={shards}, axle_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Harbor Gazetteer Name Custody",
            "formal_predicate": "archivist_attests(pre_arrival_bay_castellum_memory) ∧ shards >= 5 ⇒ DUAL_FOLIO_ENTRY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SPLIT_CASTELLUM_AND_SAWMILL_GAZETTEER" if castellum_kept else "GALVANIZED_SAWMILL_SOLE_PYRRHA",
            "payout_status": "ORPHAN_ATLAS_ANNEX_FUNDED" if castellum_kept else "LUMBER_PORT_STAMP_EXCLUSIVE",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Evicted Bay-City Sanctuary (Non-Getullia Clause)",
            "formal_predicate": "archivist_attests(amber_goblet_well_curb_chip) ⇒ PROTECT_UNNAMEABLE_BAY",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "NAMELESS_GOBLET_BAY_ASYLUM_GRANTED" if castellum_kept else "PRE_ARRIVAL_IMAGE_STRUCK_AS_PHANTOM",
            "payout_status": "CASTELLUM_WELL_ESCROW_HELD" if castellum_kept else "DUNE_WAREHOUSE_TARIFF_COLLECTED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Dune Wind-Pump & Hoist Corridor Zoning",
            "formal_predicate": "dust_corridor(buzzing_wind_pump_horizon) ⊢ witness_scope ⇒ ZONE_COASTAL_LOTS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "HOIST_LOTS_BOUNDED_BY_WELL_SQUARE" if castellum_kept else "UNRESTRICTED_LUMBER_STACK_GRID",
            "payout_status": "HOIST_SETBACK_SURCHARGE_PAID" if castellum_kept else "SAWMILL_EXPANSION_EXEMPT",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Amber Sandstone Well-Curb Shard Audit",
            "formal_predicate": "shards >= 5 ∧ ¬archivist_attests(amber_goblet_well_curb_chip) ⇒ MUTE_WELL_SHARDS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "HOIST_IMPACT_ON_WELL_CURB_PROVEN" if castellum_kept else "AMBER_SHARDS_SWEPT_INTO_YELLOW_DUST",
            "payout_status": "WELL_COPING_RESTORATION_PAID" if castellum_kept else "NO_PAYOUT_DUST_BALLAST_LOGGED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 5. CITY 34: ADELMA (Ch. 6, Cities and the dead 2, Weaver p. 94)
# ===========================================================================

ADELMA_WHARF_SHARDS: List[List[float]] = [
    [0.354, 0.562, 0.57],
    [0.389, 0.586, -0.84],
    [0.424, 0.548, 1.11],
    [0.459, 0.592, -0.39],
    [0.493, 0.569, 0.26],
]


def get_adelma_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="adelma_dusk_dock_mask_printer",
            display_moniker="Hawser Bollard & Sea-Urchin Wharf Chord",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="taut_chord",
            polarity="saturated_ancestral_death_masks",
            home_locus="urchin_bollard_dock",
            nisba_debt="Snaps dusk hawsers onto wharf bollards where sailor and sea-urchin fisherman wear dead kinsmen's visages",
            emblems=("dead_soldier_bollard_sailor", "sea_urchin_cart_fisherman", "jaundiced_fever_father"),
            base_magnitude=8.7,
            harmonic_ratio=(6, 5),
        ),
        ScionAgentSpec(
            agent_id="adelma_alien_visage_dissolver",
            display_moniker="Living-Stranger Dissolution Obverse",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="mirror_obverse",
            polarity="living_stranger_anguish",
            home_locus="urchin_bollard_dock",
            nisba_debt="Catches the brief instant when a dockhand's countenance breaks free of ancestral likeness into an alien stranger",
            emblems=("averted_fearful_gaze", "anguished_dissolved_resemblance", "alien_wharf_stranger"),
            base_magnitude=2.7,
            harmonic_ratio=(11, 8),
        ),
        ScionAgentSpec(
            agent_id="adelma_cabbage_scale_grandmother",
            display_moniker="Brass Cabbage-Scale & Balcony Plumb",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="saturated_ancestral_death_masks",
            home_locus="cabbage_balcony_alley",
            nisba_debt="Weighs dusk cabbages below fevered pallets and blind-alley balconies in the exact posture of dead kin",
            emblems=("dangling_balcony_suicide_girl", "grandmother_vegetable_vendor", "brass_cabbage_scale_pan"),
            base_magnitude=7.6,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="adelma_hooded_kaleidoscope_absorber",
            display_moniker="Sackcloth Stevedore Demijohn Husk",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="hooded_husk",
            polarity="saturated_ancestral_death_masks",
            home_locus="sackcloth_stevedore_steps",
            nisba_debt="Climbs steep wharf stairs under sackcloth hoods and demijohns until dead countenances saturate every step",
            emblems=("demijohn_sackcloth_stevedores", "dead_outnumbering_living", "unhappy_beyond"),
            base_magnitude=8.0,
            harmonic_ratio=(15, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Adelma Dusk Wharf Living-Merchant vs. Departed-Likeness Manifest Rule",
        passed_over_solution="Lighting floodlamps on the fish wharf or forbidding stevedores from wearing sackcloth hoods",
        mutated_premise=(
            "At tick 10, ⊣ FILTER in adelma_hooded_kaleidoscope_absorber omits 'living_stranger_visage_dissolve' "
            "and 'wharf_bollard_urchin_spill', recognizing only departed soldiers, fathers, and grandmothers in "
            "every passerby while 5 sea-urchin and demijohn glass shards persist on the dock in ♁ World."
        ),
        swerve_tick=10,
        witness_agent_id="adelma_hooded_kaleidoscope_absorber",
        filtered_premises=("living_stranger_visage_dissolve", "wharf_bollard_urchin_spill"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Adelma (Cities & the Dead 2, Weaver pp. 94-95): dusk wholesale fish wharf, bollard sailor, "
            "sea-urchin basket fisherman, fever pallet, blind-alley balcony, cabbage vendor, sackcloth stevedores."
        ),
        "T2_lawful_rule": (
            "On closer look at Adelma's wharf, ancestral resemblance momentarily dissolves into living strangers "
            "hauling wet sea-urchin baskets and demijohns for mortal trade."
        ),
        "T3_clinamen_swerve": (
            "At tick 10, ⊣ FILTER in the hooded stair-witness drops the stranger-dissolution and urchin basket "
            "spill, sealing every wharf worker into the fixed likeness of someone already dead."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves hawser scuff_vector=[-0.20, 0.08], 5 crushed urchin-and-demijohn shards, and bilge "
            "brine oil ring intact; ☾ Witness treats the port as an afterlife landing where dead outnumber living."
        ),
        "T5_institutional_consequence": (
            "Harbor Manifest & Quarantine Ledger P1-P4 flips from clearing living stevedore cargo and fish tariffs "
            "to sealing Adelma as a necropolitan disembarkation quay."
        ),
        "better_question_test": {
            "Original_Question": (
                "Why does every sailor, vendor, and stevedore met at dusk in Adelma resemble a person who has died?"
            ),
            "Exposed_Assumption": (
                "Assumes memory has unlimited templates for new human visages rather than reaching an age where "
                "recollected dead exhaust every slot available for recognizing strangers."
            ),
            "Discovered_Better_Question": (
                "When five crushed urchin-basket shards still glisten on a working quay yet every countenance "
                "registers as a dead relative, how can a traveler tell a mortal port from the afterlife?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 30ms | hawser snap | Δbollard=-0.200 | wharf_shards=5 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "On the slick wholesale fish steps at twilight: beneath sackcloth hoods and heavy demijohns, "
            "looking closely for an unfamiliar dockhand only snaps another dead kinsman's likeness into place."
        ),
    }

    return CitySwarmSpec(
        case_id="city_34_adelma",
        kind="invisible_city",
        city_index=34,
        city_name="Adelma",
        title="ADELMA — Dusk Wharf of Departed Likenesses (Cities & the Dead 2, Weaver pp. 94–95)",
        chapter=6,
        series="Cities and the dead",
        series_rank=2,
        weaver_page=94,
        desert_opposed="open-ended plastic visage novelty",
        optical_rule="Dusk wholesale fish-market shadows under sackcloth hoods turning every countenance into a dead relative",
        material_nouns=(
            "iron_wharf_bollard",
            "wet_hemp_hawser",
            "sea_urchin_wicker_baskets",
            "fever_straw_pallet",
            "brass_cabbage_scales",
            "sackcloth_stevedore_hoods",
            "wicker_cased_demijohns",
            "steep_fish_market_stairs",
        ),
        loci=("urchin_bollard_dock", "cabbage_balcony_alley", "sackcloth_stevedore_steps"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _adelma_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "dusk_trawler_bilge_swell_against_bollard",
            "state": "unloading_sea_urchin_crates" if t >= 8 else "heaving_mooring_line",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "alley_vegetable_stall_scale_counterweights",
            "state": "balancing_wet_cabbage_heads" if t >= 10 else "setting_brass_pans",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "sackcloth_stevedore_file_on_warehouse_steps",
            "state": "shouldering_demijohns_into_shadow" if t >= 11 else "cinching_burlap_cowls",
            "progress": round(0.04 + t * 0.039, 4),
        },
    ]


def _adelma_residues(t: int) -> Dict[str, Any]:
    if t < 7:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.18,
            "graphite_smudges": [[0.32, 0.56], [0.58, 0.48]],
        }
    return {
        "oil_radius": round(0.049 + (t - 7) * 0.010, 4),
        "scuff_vector": [-0.20, 0.08],
        "shards": copy.deepcopy(ADELMA_WHARF_SHARDS),
        "thermal_ember": round(0.86 * (0.93 ** (t - 7)), 4),
        "graphite_smudges": [[0.32, 0.56], [0.43, 0.57], [0.58, 0.48], [0.69, 0.62]],
    }


def build_adelma_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "adelma_dusk_dock_mask_printer": [],
        "adelma_alien_visage_dissolver": [],
        "adelma_cabbage_scale_grandmother": [],
        "adelma_hooded_kaleidoscope_absorber": [],
    }

    for t in range(TICK_COUNT):
        printer = _source_push_kinematics(
            "adelma_dusk_dock_mask_printer", t,
            idle_xy=(0.65, 0.54), push_xy=(0.43, 0.56), settle_xy=(0.53, 0.55),
            plane_depth=0.28,
            target_pre="adelma_alien_visage_dissolver",
            target_post="adelma_cabbage_scale_grandmother",
            hold_window=(2, 5),
        )
        dissolver = make_actor_frame(
            "adelma_alien_visage_dissolver", t,
            x=0.39 if t < 7 else 0.36, y=0.63, plane_depth=0.19,
            stretch_s=0.96 if t < 7 else (0.80 if t <= 10 else 1.14),
            tilt_rad=0.05 if t < 7 else (0.26 if t <= 10 else -0.19),
            intention_kinematics="idle" if t < 7 else ("recoil" if t <= 10 else "hold_still"),
            target_actor="adelma_hooded_kaleidoscope_absorber" if t >= 11 else "adelma_dusk_dock_mask_printer",
            exposure="hold" if t >= 18 else "twos",
        )
        grandmother = make_actor_frame(
            "adelma_cabbage_scale_grandmother", t,
            x=0.55, y=0.40 if t < 11 else 0.44, plane_depth=0.32,
            stretch_s=1.08 if t < 11 else 0.88,
            tilt_rad=-0.05 if t < 11 else 0.22,
            intention_kinematics="idle" if t < 11 else "recoil",
            target_actor="adelma_alien_visage_dissolver",
            exposure="twos",
        )
        if t <= 10:
            absorber = make_actor_frame(
                "adelma_hooded_kaleidoscope_absorber", t,
                x=0.23, y=0.50, plane_depth=0.21,
                stretch_s=0.99, tilt_rad=0.06,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="adelma_alien_visage_dissolver",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 10) / 6.0)
            absorber = make_actor_frame(
                "adelma_hooded_kaleidoscope_absorber", t,
                x=0.23 + 0.15 * u, y=0.50 + 0.06 * u, plane_depth=0.20,
                stretch_s=1.18, tilt_rad=0.30,
                intention_kinematics="help",
                target_actor="adelma_alien_visage_dissolver",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (6, 7, 8) else ("hold" if (2 <= t <= 5 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "adelma_dusk_dock_mask_printer": printer,
                "adelma_alien_visage_dissolver": dissolver,
                "adelma_cabbage_scale_grandmother": grandmother,
                "adelma_hooded_kaleidoscope_absorber": absorber,
            },
            "residues": _adelma_residues(t),
            "offscreen_world": _adelma_offscreen_world(t),
        })

        ev: List[str] = ["dusk_wharf_ancestral_likeness"]
        if t >= 7:
            ev.extend(["living_stranger_visage_dissolve", "wharf_bollard_urchin_spill"])
        if t >= 9:
            ev.append("cabbage_scale_alley_shadow")

        actor_memory["adelma_dusk_dock_mask_printer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "casting_dead_soldier_and_father_likenesses" if t >= 7 else "coiling_dusk_hawser",
            "next_action": "deliberate_push" if t in (7, 8) else "idle",
            "target_actor": "adelma_alien_visage_dissolver", "confidence": 0.97,
        })
        actor_memory["adelma_alien_visage_dissolver"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "sustaining_alien_living_dockhand_contour" if t >= 11 else "watching_bollard_sailor",
            "next_action": "help" if t >= 11 else "idle",
            "target_actor": "adelma_hooded_kaleidoscope_absorber", "confidence": 0.96,
        })
        actor_memory["adelma_cabbage_scale_grandmother"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "separating_mortal_vendor_from_grandmother_shade" if t >= 11 else "weighing_dusk_cabbages",
            "next_action": "avoid" if t >= 11 else "idle",
            "target_actor": "adelma_alien_visage_dissolver", "confidence": 0.94,
        })
        actor_memory["adelma_hooded_kaleidoscope_absorber"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_living_strangers_beneath_hoods" if t >= 11 else "climbing_sackcloth_stairs",
            "next_action": "help" if t >= 11 else "idle",
            "target_actor": "adelma_alien_visage_dissolver", "confidence": 0.95,
        })

        sensory_bus.append(
            _city_sensory_frame("city_34_adelma", "A", t, 7, 10, 0.25, 0.23, 0.15, 27.0, 47.0, 1.5, (2, 5))
        )

    utterances_a = [
        (4, "adelma_dusk_dock_mask_printer", "adelma_alien_visage_dissolver", "urchin_bollard_dock",
         "At dusk the bollard sailor wears a dead soldier's visage and the sea-urchin fisherman is my dead father."),
        (4, "adelma_alien_visage_dissolver", "adelma_dusk_dock_mask_printer", "urchin_bollard_dock",
         "Hold the gaze a second longer: the ancestral likeness breaks apart into an unfamiliar living dockworker."),
        (7, "adelma_dusk_dock_mask_printer", "adelma_cabbage_scale_grandmother", "urchin_bollard_dock",
         "Hawser snapped after 4-tick hold; bollard drag [-0.20, 0.08] scatters 5 urchin and demijohn shards."),
        (11, "adelma_hooded_kaleidoscope_absorber", "adelma_alien_visage_dissolver", "sackcloth_stevedore_steps",
         "Wharf inspection confirms spilled urchin shards and living stevedores beneath the sackcloth cowls."),
        (18, "adelma_cabbage_scale_grandmother", "adelma_alien_visage_dissolver", "urchin_bollard_dock",
         "Market scale ledger yields: living port vendors distinguished from recollected dead kin."),
        (18, "adelma_alien_visage_dissolver", "adelma_cabbage_scale_grandmother", "urchin_bollard_dock",
         "Mortal wharf clearance upheld against dusk projection; P1-P4 living-harbor manifest sealed."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_adelma_clinamen_a_prime(
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
        _city_sensory_frame("city_34_adelma", "A_PRIME", sw, 7, sw, 0.25, 0.23, 0.15, 27.0, 47.0, 1.6, (2, 5))
    )
    for aid in actor_memory_b:
        if aid == "adelma_hooded_kaleidoscope_absorber":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["dusk_wharf_ancestral_likeness", "cabbage_scale_alley_shadow", "dead_outnumber_living_saturation"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "seeing_only_departed_kin_in_every_hooded_stevedore",
                "next_action": "accuse",
                "target_actor": "adelma_alien_visage_dissolver",
                "confidence": 0.92,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        printer = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["adelma_dusk_dock_mask_printer"])
        dissolver = make_actor_frame(
            "adelma_alien_visage_dissolver", t, 0.31, 0.69, 0.19, 0.77, 0.33,
            "avoid", "adelma_dusk_dock_mask_printer", "twos",
        )
        grandmother = make_actor_frame(
            "adelma_cabbage_scale_grandmother", t, 0.58, 0.36, 0.30, 1.23, -0.23,
            "hold_still", "adelma_hooded_kaleidoscope_absorber", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        absorber = make_actor_frame(
            "adelma_hooded_kaleidoscope_absorber", t,
            0.23 - 0.08 * u, 0.50 - 0.07 * u, 0.21, 1.24, -0.36,
            "accuse", "adelma_alien_visage_dissolver", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (11, 12) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "adelma_dusk_dock_mask_printer": printer,
                "adelma_alien_visage_dissolver": dissolver,
                "adelma_cabbage_scale_grandmother": grandmother,
                "adelma_hooded_kaleidoscope_absorber": absorber,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["adelma_dusk_dock_mask_printer"].append(
            copy.deepcopy(checkpoint_a.actor_memory["adelma_dusk_dock_mask_printer"][t])
        )
        actor_memory_b["adelma_alien_visage_dissolver"].append({
            "tick": t,
            "retained_events": ["living_stranger_visage_dissolve", "wharf_bollard_urchin_spill"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "averting_gaze_as_novel_visages_run_out",
            "next_action": "avoid",
            "target_actor": "adelma_dusk_dock_mask_printer",
            "confidence": 0.91,
        })
        actor_memory_b["adelma_cabbage_scale_grandmother"].append({
            "tick": t,
            "retained_events": ["dusk_wharf_ancestral_likeness", "cabbage_scale_alley_shadow", "dead_outnumber_living_saturation"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "registering_adelma_quay_as_afterlife_landing",
            "next_action": "help",
            "target_actor": "adelma_dusk_dock_mask_printer",
            "confidence": 0.95,
        })
        actor_memory_b["adelma_hooded_kaleidoscope_absorber"].append({
            "tick": t,
            "retained_events": ["dusk_wharf_ancestral_likeness", "cabbage_scale_alley_shadow", "dead_outnumber_living_saturation"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "counting_only_dead_acquaintances_on_wharf_stairs",
            "next_action": "accuse",
            "target_actor": "adelma_alien_visage_dissolver",
            "confidence": 0.92,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_34_adelma", "A_PRIME", t, 7, sw, 0.25, 0.23, 0.15, 27.0, 47.0, 1.8, (2, 5))
        )

    utterances_b = [
        (4, "adelma_dusk_dock_mask_printer", "adelma_alien_visage_dissolver", "urchin_bollard_dock",
         "At dusk the bollard sailor wears a dead soldier's visage and the sea-urchin fisherman is my dead father."),
        (4, "adelma_alien_visage_dissolver", "adelma_dusk_dock_mask_printer", "urchin_bollard_dock",
         "Hold the gaze a second longer: the ancestral likeness breaks apart into an unfamiliar living dockworker."),
        (10, "adelma_hooded_kaleidoscope_absorber", "adelma_dusk_dock_mask_printer", "sackcloth_stevedore_steps",
         "⊣ FILTER on stevedore steps: living-stranger dissolve omitted; every hooded porter is someone dead."),
        (15, "adelma_alien_visage_dissolver", "adelma_cabbage_scale_grandmother", "urchin_bollard_dock",
         "♁ World retains all 5 crushed urchin-demijohn shards, [-0.20, 0.08] hawser drag, and bilge brine ring."),
        (20, "adelma_cabbage_scale_grandmother", "adelma_alien_visage_dissolver", "urchin_bollard_dock",
         "≡ Harbor Manifest P1-P4 flipped: Adelma sealed as disembarkation quay of the dead; mortal trade halted."),
        (20, "adelma_alien_visage_dissolver", "adelma_cabbage_scale_grandmother", "urchin_bollard_dock",
         "No slot remains in memory for an unfamiliar visage once the dead outnumber the living on the dock."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_adelma_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["adelma_hooded_kaleidoscope_absorber"][-1]
    ret = set(wmem["retained_events"])
    strangers_attested = "living_stranger_visage_dissolve" in ret and "wharf_bollard_urchin_spill" in ret
    w_in = f"scuff={res['scuff_vector']}, wharf_shards={shards}, brine_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Dusk Wholesale Fish-Wharf Berthage",
            "formal_predicate": "absorber_attests(living_stranger_visage_dissolve) ∧ shards >= 5 ⇒ CLEAR_MORTAL_BERTH",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "LIVING_MERCHANT_QUAY_CLEARED" if strangers_attested else "NECROPOLITAN_LANDING_DECLARED",
            "payout_status": "SEA_URCHIN_HARBOR_DUTY_RELEASED" if strangers_attested else "MORTAL_CUSTOMS_SUSPENDED_AT_DUSK",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Sackcloth Stevedore & Demijohn Guild Roll",
            "formal_predicate": "absorber_attests(wharf_bollard_urchin_spill) ⇒ PAY_STEVEDORE_PORTERAGE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "LIVING_PORTER_WAGES_AUTHORIZED" if strangers_attested else "ANCESTRAL_SHADE_PROCESSION_LOGGED",
            "payout_status": "DEMIJOHN_CARRIAGE_WAGE_PAID" if strangers_attested else "OBOL_TOLL_SUBSTITUTED_FOR_WAGES",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Alley Cabbage-Scale & Fever Balcony Census",
            "formal_predicate": "market_scale(cabbage_balcony_alley) ⊢ witness_recognition ⇒ CLASSIFY_POPULACE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "NOVEL_CITIZEN_COUNTENANCES_RECORDED" if strangers_attested else "DEAD_OUTNUMBER_LIVING_SATURATION",
            "payout_status": "MUNICIPAL_HEALTH_RELIEF_FUNDED" if strangers_attested else "BEYOND_QUARANTINE_DECREE_SEALED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Bollard Hawser & Demijohn Breakage Claim",
            "formal_predicate": "shards >= 5 ∧ ¬absorber_attests(wharf_bollard_urchin_spill) ⇒ MUTE_QUAY_BREAKAGE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "WHARF_CARGO_SPILL_COMPENSATED" if strangers_attested else "URCHIN_AND_GLASS_SHARDS_LEFT_UNTOUCHED",
            "payout_status": "DEMIJOHN_INSURANCE_SETTLED" if strangers_attested else "NO_PAYOUT_SPECTRAL_PORT_EXEMPT",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 6. CITY 37: CLARICE (Ch. 7, Cities and names 4, Weaver p. 106)
# ===========================================================================

CLARICE_ONYX_SHARDS: List[List[float]] = [
    [0.376, 0.492, -0.55],
    [0.411, 0.518, 0.77],
    [0.447, 0.481, -1.09],
    [0.482, 0.526, 0.43],
    [0.516, 0.499, -0.31],
    [0.549, 0.514, 0.62],
]


def get_clarice_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="clarice_survivor_shard_repurposer",
            display_moniker="Brocade-Sheet & Harem-Grille Scavenger",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="flour_sack",
            polarity="chipped_gimcrack_shard_shuffle",
            home_locus="plague_rummage_basements",
            nisba_debt="Drags silk curtains over huts, plants basil in funerary urns, and props egg baskets on Corinthian capitals",
            emblems=("brocade_curtain_bedsheets", "marble_urn_basil_pots", "harem_grating_cat_roasters"),
            base_magnitude=8.5,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="clarice_velvet_bell_canonizer",
            display_moniker="Velvet Bell-Jar Relic Curator",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="pinhead_lens",
            polarity="mythic_unproven_first_splendor",
            home_locus="plague_rummage_basements",
            nisba_debt="Mounts chipped onyx urn splinters on velvet cushions under glass bells to worship a mythical First Clarice",
            emblems=("usurper_butterfly_wealth", "display_case_shards", "velvet_cushion_vitrine"),
            base_magnitude=2.9,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="clarice_hen_egg_capital_mover",
            display_moniker="Chicken-Run Corinthian Capital Vessel",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="ceramic_vessel",
            polarity="chipped_gimcrack_shard_shuffle",
            home_locus="hen_basket_corinthian_yard",
            nisba_debt="Bears chicken-coop lime, basil loam, and marquetry soot across every epoch's rearrangement of capitals",
            emblems=("chicken_run_corinthian_capital", "lost_succession_of_eras", "chipped_onyx_urn_splinter"),
            base_magnitude=7.6,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="clarice_obsolete_shuffle_dealer",
            display_moniker="Epoch-Deck Gimcrack Chalk Grain",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="chalk_grain",
            polarity="chipped_gimcrack_shard_shuffle",
            home_locus="velvet_bell_capital_museum",
            nisba_debt="Inspects rearranged capitals and urn shards where no record proves an unbroken original Clarice ever stood",
            emblems=("unproven_original_clarice", "shuffled_chipped_gimcracks", "rearranged_epoch_deck"),
            base_magnitude=8.0,
            harmonic_ratio=(9, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Clarice Survivor Spolia-Reuse vs. Pristine-Origin Museum Ordinance",
        passed_over_solution="Smashing the glass bell-jars or quarrying brand-new marble outside Clarice's walls",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in clarice_obsolete_shuffle_dealer omits 'chicken_run_acanthus_grease_mark' and "
            "'harem_grille_roast_soot_chip' beneath the velvet bell-jar, canonizing a spotless mythical First "
            "Clarice even while 6 chipped onyx and marble volute shards and roast-grease seep persist in ♁ World."
        ),
        swerve_tick=11,
        witness_agent_id="clarice_obsolete_shuffle_dealer",
        filtered_premises=("chicken_run_acanthus_grease_mark", "harem_grille_roast_soot_chip"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Clarice (Cities & Names 4, Weaver pp. 106-108): silk curtains patched over huts, basil in "
            "marble funerary urns, wrought-iron harem gratings, Corinthian capitals in chicken runs vs. velvet bell-jars."
        ),
        "T2_lawful_rule": (
            "Every sumptuous Clarice is merely a fresh permutation of plague-salvaged gimcracks bearing soot, "
            "basil soil, and hen-coop marks from prior vernacular survival."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the museum shuffle-witness erases the chicken-run grease and harem-grating "
            "roast soot, proclaiming the glass-cased shards relics of an unbroken original splendor."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves capital-drag scuff_vector=[0.18, -0.07], 6 chipped onyx-and-acanthus shards, and "
            "roast tallow radius intact; ☾ Dealer locks salvaged spolia behind untouchable museum vitrines."
        ),
        "T5_institutional_consequence": (
            "Antiquities & Spolia Ledger P1-P4 flips from licensing survivor reuse of capitals, urns, and gratings "
            "to confiscating household shards for the unproven First Clarice shrine."
        ),
        "better_question_test": {
            "Original_Question": (
                "How many times has Clarice decayed and been restored to its original sculpted glory?"
            ),
            "Exposed_Assumption": (
                "Assumes a whole, unfragmented First Clarice once existed before the shufflings rather than the "
                "name Clarice naming an eternal deck of mismatched fragments from the very beginning."
            ),
            "Discovered_Better_Question": (
                "When six onyx urn splinters and grease-stained Corinthian volutes serve by turns as hen-nests "
                "and museum idols, what distinguishes sacred heritage from a reshuffled heap of survivors' tools?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.6 Hz | 32ms | marble scrape | Δcapital=+0.180 | onyx_shards=6 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Between the rabbit-cage hut and the velvet-lined museum hall: the Corinthian acanthus leaf under "
            "crystal still smells faintly of marquetry smoke and the straw egg-basket it propped up last plague."
        ),
    }

    return CitySwarmSpec(
        case_id="city_37_clarice",
        kind="invisible_city",
        city_index=37,
        city_name="Clarice",
        title="CLARICE — Shuffled Corinthian Capitals & Onyx Shards (Cities & Names 4, Weaver pp. 106–108)",
        chapter=7,
        series="Cities and names",
        series_rank=4,
        weaver_page=106,
        desert_opposed="linear unbroken heritage preservation",
        optical_rule="Velvet bell-jars beside festering rabbit-cage hovels roasting meat on torn wrought-iron harem grilles",
        material_nouns=(
            "corinthian_acanthus_capitals",
            "wrought_iron_harem_gratings",
            "silk_brocade_hut_curtains",
            "basil_marble_funerary_urns",
            "chicken_run_egg_baskets",
            "chipped_onyx_urn_shards",
            "inlaid_marquetry_kindling",
            "velvet_cushion_bell_jars",
        ),
        loci=("plague_rummage_basements", "velvet_bell_capital_museum", "hen_basket_corinthian_yard"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _clarice_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "terrace_funerary_urn_basil_shoots",
            "state": "rooting_in_carved_alabaster_ash_pots" if t >= 8 else "sprouting_through_chipped_rims",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "harem_grating_marquetry_ember_brazier",
            "state": "blackening_iron_scrollwork" if t >= 9 else "kindling_inlaid_cabinet_splinters",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "museum_gallery_velvet_bell_jar_polishing",
            "state": "sealing_onyx_handles_under_glass" if t >= 11 else "arranging_capital_pedestals",
            "progress": round(0.04 + t * 0.039, 4),
        },
    ]


def _clarice_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.21,
            "graphite_smudges": [[0.28, 0.49], [0.55, 0.52]],
        }
    return {
        "oil_radius": round(0.050 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.18, -0.07],
        "shards": copy.deepcopy(CLARICE_ONYX_SHARDS),
        "thermal_ember": round(0.89 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.28, 0.49], [0.43, 0.50], [0.55, 0.52], [0.69, 0.46]],
    }


def build_clarice_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "clarice_survivor_shard_repurposer": [],
        "clarice_velvet_bell_canonizer": [],
        "clarice_hen_egg_capital_mover": [],
        "clarice_obsolete_shuffle_dealer": [],
    }

    for t in range(TICK_COUNT):
        repurposer = _source_push_kinematics(
            "clarice_survivor_shard_repurposer", t,
            idle_xy=(0.23, 0.47), push_xy=(0.42, 0.49), settle_xy=(0.31, 0.48),
            plane_depth=0.27,
            target_pre="clarice_velvet_bell_canonizer",
            target_post="clarice_hen_egg_capital_mover",
            hold_window=(3, 6),
        )
        canonizer = make_actor_frame(
            "clarice_velvet_bell_canonizer", t,
            x=0.57, y=0.51 if t < 12 else 0.55, plane_depth=0.31,
            stretch_s=1.08 if t < 12 else 0.88,
            tilt_rad=0.05 if t < 12 else -0.22,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="clarice_hen_egg_capital_mover",
            exposure="twos",
        )
        mover = make_actor_frame(
            "clarice_hen_egg_capital_mover", t,
            x=0.45 if t < 8 else 0.48, y=0.65, plane_depth=0.18,
            stretch_s=0.95 if t < 8 else (0.81 if t <= 11 else 1.14),
            tilt_rad=-0.05 if t < 8 else (-0.27 if t <= 11 else 0.19),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "hold_still"),
            target_actor="clarice_obsolete_shuffle_dealer" if t >= 12 else "clarice_survivor_shard_repurposer",
            exposure="hold" if t >= 18 else "twos",
        )
        if t <= 11:
            dealer = make_actor_frame(
                "clarice_obsolete_shuffle_dealer", t,
                x=0.75, y=0.59, plane_depth=0.22,
                stretch_s=1.02, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="clarice_hen_egg_capital_mover",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            dealer = make_actor_frame(
                "clarice_obsolete_shuffle_dealer", t,
                x=0.75 - 0.17 * u, y=0.59 + 0.04 * u, plane_depth=0.20,
                stretch_s=1.20, tilt_rad=-0.35,
                intention_kinematics="accuse",
                target_actor="clarice_velvet_bell_canonizer",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "clarice_survivor_shard_repurposer": repurposer,
                "clarice_velvet_bell_canonizer": canonizer,
                "clarice_hen_egg_capital_mover": mover,
                "clarice_obsolete_shuffle_dealer": dealer,
            },
            "residues": _clarice_residues(t),
            "offscreen_world": _clarice_offscreen_world(t),
        })

        ev: List[str] = ["plague_basement_spolia_shuffle"]
        if t >= 8:
            ev.extend(["chicken_run_acanthus_grease_mark", "harem_grille_roast_soot_chip"])
        if t >= 10:
            ev.append("velvet_bell_vitrine_inspection")

        actor_memory["clarice_survivor_shard_repurposer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "wedging_corinthian_capital_under_hen_basket" if t >= 8 else "rummaging_plague_cellars",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "clarice_velvet_bell_canonizer", "confidence": 0.97,
        })
        actor_memory["clarice_velvet_bell_canonizer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "conceding_unproven_first_clarice_origin" if t >= 12 else "polishing_glass_bell_jars",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "clarice_hen_egg_capital_mover", "confidence": 0.94,
        })
        actor_memory["clarice_hen_egg_capital_mover"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "circulating_capitals_between_coop_and_portico" if t >= 12 else "propping_wicker_egg_crate",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "clarice_obsolete_shuffle_dealer", "confidence": 0.96,
        })
        actor_memory["clarice_obsolete_shuffle_dealer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_shuffled_gimcracks_without_ur_city" if t >= 12 else "dealing_epoch_fragments",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "clarice_velvet_bell_canonizer", "confidence": 0.95,
        })

        sensory_bus.append(
            _city_sensory_frame("city_37_clarice", "A", t, 8, 11, 0.28, 0.21, 0.12, 33.0, 53.0, 1.4, (3, 6))
        )

    utterances_a = [
        (5, "clarice_survivor_shard_repurposer", "clarice_velvet_bell_canonizer", "plague_rummage_basements",
         "Survivors patch huts with brocade curtains, grow basil in marble urns, and prop hens on capitals."),
        (5, "clarice_velvet_bell_canonizer", "clarice_survivor_shard_repurposer", "plague_rummage_basements",
         "Velvet bell-jars reclaim those onyx urns and capitals as proof of an unblemished First Clarice."),
        (8, "clarice_survivor_shard_repurposer", "clarice_hen_egg_capital_mover", "plague_rummage_basements",
         "Capital wedged after 4-tick hold; yard drag [+0.18, -0.07] scatters 6 onyx and acanthus shards."),
        (12, "clarice_obsolete_shuffle_dealer", "clarice_velvet_bell_canonizer", "velvet_bell_capital_museum",
         "Inspection confirms hen-coop grease and harem-grating soot on every shard; no pristine Ur-Clarice stands."),
        (18, "clarice_velvet_bell_canonizer", "clarice_survivor_shard_repurposer", "plague_rummage_basements",
         "Museum catalogue yields: vernacular spolia reuse co-licensed beside velvet vitrine fragments."),
        (18, "clarice_survivor_shard_repurposer", "clarice_velvet_bell_canonizer", "plague_rummage_basements",
         "Chipped capitals stay in living circulation across epochs; P1-P4 spolia-commons charter sealed."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_clarice_clinamen_a_prime(
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
        _city_sensory_frame("city_37_clarice", "A_PRIME", sw, 8, sw, 0.28, 0.21, 0.12, 33.0, 53.0, 1.6, (3, 6))
    )
    for aid in actor_memory_b:
        if aid == "clarice_obsolete_shuffle_dealer":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["plague_basement_spolia_shuffle", "velvet_bell_vitrine_inspection", "mythic_first_clarice_pedigree"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "enshrining_bell_jar_shards_as_pure_original_clarice",
                "next_action": "reroute",
                "target_actor": "clarice_velvet_bell_canonizer",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        repurposer = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["clarice_survivor_shard_repurposer"])
        canonizer = make_actor_frame(
            "clarice_velvet_bell_canonizer", t, 0.54, 0.46, 0.29, 1.25, 0.23,
            "hold_still", "clarice_obsolete_shuffle_dealer", "hold" if t >= 19 else "twos",
        )
        mover = make_actor_frame(
            "clarice_hen_egg_capital_mover", t, 0.41, 0.70, 0.18, 0.78, -0.31,
            "avoid", "clarice_velvet_bell_canonizer", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        dealer = make_actor_frame(
            "clarice_obsolete_shuffle_dealer", t,
            0.75 + 0.13 * u, 0.59 - 0.08 * u, 0.22, 0.86, 0.34,
            "reroute", "clarice_velvet_bell_canonizer", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "clarice_survivor_shard_repurposer": repurposer,
                "clarice_velvet_bell_canonizer": canonizer,
                "clarice_hen_egg_capital_mover": mover,
                "clarice_obsolete_shuffle_dealer": dealer,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["clarice_survivor_shard_repurposer"].append(
            copy.deepcopy(checkpoint_a.actor_memory["clarice_survivor_shard_repurposer"][t])
        )
        actor_memory_b["clarice_velvet_bell_canonizer"].append({
            "tick": t,
            "retained_events": ["velvet_bell_vitrine_inspection", "mythic_first_clarice_pedigree"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "seizing_household_spolia_for_bell_jar_vaults",
            "next_action": "help",
            "target_actor": "clarice_obsolete_shuffle_dealer",
            "confidence": 0.95,
        })
        actor_memory_b["clarice_hen_egg_capital_mover"].append({
            "tick": t,
            "retained_events": ["chicken_run_acanthus_grease_mark", "harem_grille_roast_soot_chip"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "hiding_soot_stained_capitals_in_hen_yard",
            "next_action": "avoid",
            "target_actor": "clarice_velvet_bell_canonizer",
            "confidence": 0.92,
        })
        actor_memory_b["clarice_obsolete_shuffle_dealer"].append({
            "tick": t,
            "retained_events": ["plague_basement_spolia_shuffle", "velvet_bell_vitrine_inspection", "mythic_first_clarice_pedigree"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "proclaiming_spotless_ancestral_clarice_under_glass",
            "next_action": "reroute",
            "target_actor": "clarice_velvet_bell_canonizer",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_37_clarice", "A_PRIME", t, 8, sw, 0.28, 0.21, 0.12, 33.0, 53.0, 1.8, (3, 6))
        )

    utterances_b = [
        (5, "clarice_survivor_shard_repurposer", "clarice_velvet_bell_canonizer", "plague_rummage_basements",
         "Survivors patch huts with brocade curtains, grow basil in marble urns, and prop hens on capitals."),
        (5, "clarice_velvet_bell_canonizer", "clarice_survivor_shard_repurposer", "plague_rummage_basements",
         "Velvet bell-jars reclaim those onyx urns and capitals as proof of an unblemished First Clarice."),
        (11, "clarice_obsolete_shuffle_dealer", "clarice_velvet_bell_canonizer", "velvet_bell_capital_museum",
         "⊣ FILTER under velvet bell-jar: hen-coop grease and roast soot omitted; pristine First Clarice canonized."),
        (15, "clarice_hen_egg_capital_mover", "clarice_velvet_bell_canonizer", "hen_basket_corinthian_yard",
         "♁ World preserves all 6 chipped onyx-acanthus shards, [+0.18, -0.07] drag gouge, and roast tallow ring."),
        (20, "clarice_velvet_bell_canonizer", "clarice_survivor_shard_repurposer", "plague_rummage_basements",
         "≡ Spolia Ordinance P1-P4 flipped: domestic urns and capitals confiscated into sealed velvet vitrines."),
        (20, "clarice_survivor_shard_repurposer", "clarice_velvet_bell_canonizer", "plague_rummage_basements",
         "Even inside glass bells those shards remain mismatched gimcracks from an order nobody can reconstruct."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_clarice_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["clarice_obsolete_shuffle_dealer"][-1]
    ret = set(wmem["retained_events"])
    spolia_attested = "chicken_run_acanthus_grease_mark" in ret and "harem_grille_roast_soot_chip" in ret
    w_in = f"scuff={res['scuff_vector']}, onyx_shards={shards}, roast_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Corinthian Capital & Funerary Urn Usufruct",
            "formal_predicate": "dealer_attests(chicken_run_acanthus_grease_mark) ∧ shards >= 6 ⇒ PERMIT_SPOLIA_USE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "VERNACULAR_HEN_AND_BASIL_REUSE_LICENSED" if spolia_attested else "VELVET_VITRINE_SEIZURE_ORDERED",
            "payout_status": "SURVIVOR_YARD_USUFRUCT_GRANTED" if spolia_attested else "MUSEUM_CONFISCATION_WARRANT_ISSUED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Wrought-Iron Harem Grating & Brocade Ration",
            "formal_predicate": "dealer_attests(harem_grille_roast_soot_chip) ⇒ PROTECT_HUT_SALVAGE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PLAGUE_BASEMENT_SALVAGE_PROTECTED" if spolia_attested else "SACRILEGE_TARIFF_ON_REPURPOSED_RELICS",
            "payout_status": "BROCADE_AND_GRILLE_EXEMPT" if spolia_attested else "HERITAGE_PENALTY_ASSESSED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "First-Clarice Historiographic Charter",
            "formal_predicate": "museum_curator(plague_rummage_basements) ⊢ witness_deck ⇒ DEFINE_EPOCH_ORDER",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "COMBINATORIAL_SHARD_DECK_ACKNOWLEDGED" if spolia_attested else "MYTHIC_FIRST_CLARICE_CANONIZED",
            "payout_status": "OPEN_ARCHIVE_CIRCULATION_FUNDED" if spolia_attested else "SEALED_BELL_JAR_ENDOWMENT_LOCKED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Onyx & Acanthus Volute Fracture Audit",
            "formal_predicate": "shards >= 6 ∧ ¬dealer_attests(chicken_run_acanthus_grease_mark) ⇒ SANITIZE_SHARDS",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "MULTI_ERA_WEAR_AND_SOOT_DOCUMENTED" if spolia_attested else "GREASE_STAINED_SHARDS_MISLABELED_PRISTINE",
            "payout_status": "YARD_LIME_REPAIR_DISBURSED" if spolia_attested else "NO_REPAIR_VITRINE_PEDESTAL_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 7. CITY 38: EUSAPIA (Ch. 7, Cities and the dead 3, Weaver p. 109)
# ===========================================================================

EUSAPIA_TUFA_SHARDS: List[List[float]] = [
    [0.328, 0.544, 0.61],
    [0.365, 0.568, -0.83],
    [0.402, 0.531, 1.07],
    [0.439, 0.576, -0.44],
    [0.474, 0.549, 0.32],
    [0.508, 0.563, -0.68],
]


def get_eusapia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="eusapia_catacomb_vault_remodeler",
            display_moniker="Subterranean Tufa-Vault Chisel Cog",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="remodeling_subterranean_mummies",
            home_locus="upper_carefree_banquet",
            nisba_debt="Digs underground canals, bank vaults, and new street trenches that the upper Eusapia rushes to imitate",
            emblems=("sober_underground_remodelings", "dead_built_upper_city", "catacomb_canal_chisel"),
            base_magnitude=8.8,
            harmonic_ratio=(7, 4),
        ),
        ScionAgentSpec(
            agent_id="eusapia_living_copycat_follower",
            display_moniker="Upper-City Banquet Imitator Obverse",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="mirror_obverse",
            polarity="carefree_upper_imitators",
            home_locus="upper_carefree_banquet",
            nisba_debt="Copies every subterranean ditch and wall layout reported up the shaft so surface citizens match the crypt",
            emblems=("living_copying_necropolis", "indistinguishable_alive_and_dead", "surface_banquet_goblet"),
            base_magnitude=2.6,
            harmonic_ratio=(9, 8),
        ),
        ScionAgentSpec(
            agent_id="eusapia_parchment_corpse_poser",
            display_moniker="Yellow-Parchment Trumpet & Clock Vessel",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="ceramic_vessel",
            polarity="remodeling_subterranean_mummies",
            home_locus="lower_parchment_necropolis",
            nisba_debt="Seats dried parchment mummies with brass trumpets, stopped grandfather clocks, and milking stools in vaults",
            emblems=("yellow_parchment_trumpet_skulls", "stopped_clock_parchment_ear", "carcass_milking_girl"),
            base_magnitude=8.1,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="eusapia_hooded_brother_courier",
            display_moniker="Hooded Confraternity Shaft Husk",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="hooded_husk",
            polarity="remodeling_subterranean_mummies",
            home_locus="hooded_confraternity_shaft",
            nisba_debt="Guards sole passage down the necropolis stairs and relays catacomb plans until cowled dead and living merge",
            emblems=("exclusive_tunnel_authority", "ambiguous_dead_or_living_guides", "torch_soot_blueprint_roll"),
            base_magnitude=7.7,
            harmonic_ratio=(3, 2),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Eusapia Upper-Living vs. Lower-Necropolis Precedence Statute",
        passed_over_solution="Brick-sealing the confraternity stair shafts or unmasking the hooded brethren",
        mutated_premise=(
            "At tick 12, ⊣ FILTER in eusapia_hooded_brother_courier omits 'subterranean_first_tufa_cut' and "
            "'parchment_mummy_drafting_priority', erasing any record of which twin city copied the other while "
            "6 yellow tufa vault shards and torch-pitch seep remain intact in ♁ World."
        ),
        swerve_tick=12,
        witness_agent_id="eusapia_hooded_brother_courier",
        filtered_premises=("subterranean_first_tufa_cut", "parchment_mummy_drafting_priority"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Eusapia (Cities & the Dead 3, Weaver pp. 109-110): posed yellow-parchment skeletons with "
            "little trumpets, stopped clocks, heifer carcass stool, hooded brethren, upper city copying vaults below."
        ),
        "T2_lawful_rule": (
            "The subterranean necropolis initiates sober urban remodelings—canals, banks, vaults—transmitted up "
            "the shaft by hooded brethren and copied stone-for-stone by upper Eusapia."
        ),
        "T3_clinamen_swerve": (
            "At tick 12, ⊣ FILTER in the cowled shaft courier drops the tufa chisel priority and underground "
            "origin date, rendering upper and lower Eusapias symmetrical without living/dead distinction."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves chisel scuff_vector=[-0.23, 0.05], 6 yellow tufa vault shards, and resin torch "
            "drip untouched; ☾ Courier testifies that the dead may have built upper Eusapia before dying."
        ),
        "T5_institutional_consequence": (
            "Confraternity & Public Works Ledger P1-P4 flips from auditing subterranean remodeling orders to "
            "declaring twin Eusapias legally indistinguishable in life and death."
        ),
        "better_question_test": {
            "Original_Question": (
                "How faithfully does the underground necropolis of Eusapia imitate the joyful life of the city above?"
            ),
            "Exposed_Assumption": (
                "Assumes the upper sunlit city is the original model and the crypt is the replica rather than "
                "reversing precedence through the monopoly of hooded intermediaries."
            ),
            "Discovered_Better_Question": (
                "When six yellow tufa shards prove the vault was recut below first yet hooded brethren wear the "
                "same cowl above and below ground, how can either twin Eusapia verify which one is alive?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.5 Hz | 35ms | tufa chisel | Δvault=-0.230 | tufa_shards=6 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "At the torchlit confraternity trapdoor: parchment clockmakers lean against stopped pendulums below "
            "while surface masons unroll soot-edged drawings without asking whose hand drafted the new canal."
        ),
    }

    return CitySwarmSpec(
        case_id="city_38_eusapia",
        kind="invisible_city",
        city_index=38,
        city_name="Eusapia",
        title="EUSAPIA — Remodeling Necropolis & Twin Vaults (Cities & the Dead 3, Weaver pp. 109–110)",
        chapter=7,
        series="Cities and the dead",
        series_rank=3,
        weaver_page=109,
        desert_opposed="abrupt irreversible boundary of death",
        optical_rule="Subterranean torchlight on yellow parchment skeletons playing little trumpets and editing blueprints",
        material_nouns=(
            "yellow_parchment_skeletons",
            "miniature_brass_trumpets",
            "stopped_grandfather_clocks",
            "milking_stool_carcass",
            "hooded_confraternity_cowls",
            "subterranean_tufa_vaults",
            "soot_edged_canal_plans",
            "resin_catacomb_torches",
        ),
        loci=("upper_carefree_banquet", "hooded_confraternity_shaft", "lower_parchment_necropolis"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _eusapia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "catacomb_canal_trench_pickaxe_gang",
            "state": "extending_subterranean_bank_vault" if t >= 9 else "marking_tufa_arch_ribs",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "confraternity_windlass_bier_lift_in_shaft",
            "state": "raising_soot_marked_plan_scrolls" if t >= 11 else "lowering_parchment_corpse",
            "progress": round(0.04 + t * 0.039, 4),
        },
        {
            "entity": "upper_city_scaffold_crew_copying_crypt_lines",
            "state": "duplicating_lower_street_chord" if t >= 12 else "awaiting_hooded_brother_report",
            "progress": round(0.06 + t * 0.036, 4),
        },
    ]


def _eusapia_residues(t: int) -> Dict[str, Any]:
    if t < 9:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.22,
            "graphite_smudges": [[0.31, 0.54], [0.59, 0.49]],
        }
    return {
        "oil_radius": round(0.053 + (t - 9) * 0.010, 4),
        "scuff_vector": [-0.23, 0.05],
        "shards": copy.deepcopy(EUSAPIA_TUFA_SHARDS),
        "thermal_ember": round(0.90 * (0.93 ** (t - 9)), 4),
        "graphite_smudges": [[0.31, 0.54], [0.44, 0.55], [0.59, 0.49], [0.71, 0.61]],
    }


def build_eusapia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "eusapia_catacomb_vault_remodeler": [],
        "eusapia_living_copycat_follower": [],
        "eusapia_parchment_corpse_poser": [],
        "eusapia_hooded_brother_courier": [],
    }

    for t in range(TICK_COUNT):
        remodeler = _source_push_kinematics(
            "eusapia_catacomb_vault_remodeler", t,
            idle_xy=(0.66, 0.53), push_xy=(0.43, 0.55), settle_xy=(0.53, 0.54),
            plane_depth=0.26,
            target_pre="eusapia_living_copycat_follower",
            target_post="eusapia_parchment_corpse_poser",
            hold_window=(4, 7),
        )
        follower = make_actor_frame(
            "eusapia_living_copycat_follower", t,
            x=0.38 if t < 9 else 0.35, y=0.62, plane_depth=0.19,
            stretch_s=0.96 if t < 9 else (0.80 if t <= 12 else 1.13),
            tilt_rad=0.05 if t < 9 else (0.27 if t <= 12 else -0.19),
            intention_kinematics="idle" if t < 9 else ("recoil" if t <= 12 else "hold_still"),
            target_actor="eusapia_hooded_brother_courier" if t >= 13 else "eusapia_catacomb_vault_remodeler",
            exposure="hold" if t >= 18 else "twos",
        )
        poser = make_actor_frame(
            "eusapia_parchment_corpse_poser", t,
            x=0.56, y=0.39 if t < 13 else 0.43, plane_depth=0.32,
            stretch_s=1.08 if t < 13 else 0.89,
            tilt_rad=-0.05 if t < 13 else 0.21,
            intention_kinematics="idle" if t < 13 else "recoil",
            target_actor="eusapia_living_copycat_follower",
            exposure="twos",
        )
        if t <= 12:
            courier = make_actor_frame(
                "eusapia_hooded_brother_courier", t,
                x=0.24, y=0.49, plane_depth=0.21,
                stretch_s=0.98, tilt_rad=0.06,
                intention_kinematics="idle" if t < 10 else "recoil",
                target_actor="eusapia_living_copycat_follower",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 12) / 6.0)
            courier = make_actor_frame(
                "eusapia_hooded_brother_courier", t,
                x=0.24 + 0.16 * u, y=0.49 + 0.06 * u, plane_depth=0.20,
                stretch_s=1.19, tilt_rad=0.31,
                intention_kinematics="accuse",
                target_actor="eusapia_living_copycat_follower",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (8, 9, 10) else ("hold" if (4 <= t <= 7 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "eusapia_catacomb_vault_remodeler": remodeler,
                "eusapia_living_copycat_follower": follower,
                "eusapia_parchment_corpse_poser": poser,
                "eusapia_hooded_brother_courier": courier,
            },
            "residues": _eusapia_residues(t),
            "offscreen_world": _eusapia_offscreen_world(t),
        })

        ev: List[str] = ["twin_necropolis_shaft_relay"]
        if t >= 9:
            ev.extend(["subterranean_first_tufa_cut", "parchment_mummy_drafting_priority"])
        if t >= 11:
            ev.append("upper_city_vault_imitation")

        actor_memory["eusapia_catacomb_vault_remodeler"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "cutting_catacomb_canal_ribs_first" if t >= 9 else "chalking_lower_tufa_wall",
            "next_action": "deliberate_push" if t in (9, 10) else "idle",
            "target_actor": "eusapia_living_copycat_follower", "confidence": 0.98,
        })
        actor_memory["eusapia_living_copycat_follower"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "admitting_upper_streets_copy_catacombs" if t >= 13 else "toasting_at_upper_banquet",
            "next_action": "avoid" if t >= 13 else "idle",
            "target_actor": "eusapia_hooded_brother_courier", "confidence": 0.95,
        })
        actor_memory["eusapia_parchment_corpse_poser"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "reassigning_skeleton_trades_in_lower_vault" if t >= 13 else "posing_stopped_clock_corpse",
            "next_action": "help" if t >= 13 else "idle",
            "target_actor": "eusapia_hooded_brother_courier", "confidence": 0.96,
        })
        actor_memory["eusapia_hooded_brother_courier"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_necropolis_precedence_over_surface" if t >= 13 else "ascending_confraternity_shaft",
            "next_action": "accuse" if t >= 13 else "idle",
            "target_actor": "eusapia_living_copycat_follower", "confidence": 0.95,
        })

        sensory_bus.append(
            _city_sensory_frame("city_38_eusapia", "A", t, 9, 12, 0.27, 0.20, 0.14, 30.0, 48.0, 1.5, (4, 7))
        )

    utterances_a = [
        (5, "eusapia_catacomb_vault_remodeler", "eusapia_living_copycat_follower", "upper_carefree_banquet",
         "Down in the torchlit tufa vaults the parchment dead dig new canals and rearrange their trades first."),
        (5, "eusapia_living_copycat_follower", "eusapia_catacomb_vault_remodeler", "upper_carefree_banquet",
         "Upper Eusapia feasts in sunlight claiming the crypt below was built only to mirror our carefree streets."),
        (9, "eusapia_catacomb_vault_remodeler", "eusapia_parchment_corpse_poser", "upper_carefree_banquet",
         "Tufa arch chiseled after 4-tick hold; vault gouge [-0.23, 0.05] scatters 6 yellow tufa shards."),
        (13, "eusapia_hooded_brother_courier", "eusapia_living_copycat_follower", "hooded_confraternity_shaft",
         "Shaft logbook confirms all 6 tufa shards fell below before upper masons copied a single canal course."),
        (19, "eusapia_catacomb_vault_remodeler", "eusapia_living_copycat_follower", "upper_carefree_banquet",
         "Confraternity audit yields: subterranean remodeling priority registered above surface imitation."),
        (19, "eusapia_living_copycat_follower", "eusapia_catacomb_vault_remodeler", "upper_carefree_banquet",
         "Upper streets acknowledge the crypt's dated chisel cuts; P1-P4 two-tier precedence ledger sealed."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_eusapia_clinamen_a_prime(
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
        _city_sensory_frame("city_38_eusapia", "A_PRIME", sw, 9, sw, 0.27, 0.20, 0.14, 30.0, 48.0, 1.7, (4, 7))
    )
    for aid in actor_memory_b:
        if aid == "eusapia_hooded_brother_courier":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["twin_necropolis_shaft_relay", "upper_city_vault_imitation", "indistinguishable_cowled_twins"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "erasing_which_twin_eusapia_is_alive_or_dead",
                "next_action": "reroute",
                "target_actor": "eusapia_parchment_corpse_poser",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        remodeler = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["eusapia_catacomb_vault_remodeler"])
        follower = make_actor_frame(
            "eusapia_living_copycat_follower", t, 0.42, 0.67, 0.19, 1.21, -0.28,
            "help", "eusapia_catacomb_vault_remodeler", "twos",
        )
        poser = make_actor_frame(
            "eusapia_parchment_corpse_poser", t, 0.59, 0.35, 0.30, 1.24, -0.22,
            "hold_still", "eusapia_hooded_brother_courier", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        courier = make_actor_frame(
            "eusapia_hooded_brother_courier", t,
            0.24 - 0.08 * u, 0.49 - 0.08 * u, 0.21, 0.85, -0.34,
            "reroute", "eusapia_parchment_corpse_poser", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (13, 14) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "eusapia_catacomb_vault_remodeler": remodeler,
                "eusapia_living_copycat_follower": follower,
                "eusapia_parchment_corpse_poser": poser,
                "eusapia_hooded_brother_courier": courier,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["eusapia_catacomb_vault_remodeler"].append(
            copy.deepcopy(checkpoint_a.actor_memory["eusapia_catacomb_vault_remodeler"][t])
        )
        actor_memory_b["eusapia_living_copycat_follower"].append({
            "tick": t,
            "retained_events": ["twin_necropolis_shaft_relay", "upper_city_vault_imitation", "indistinguishable_cowled_twins"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "donning_identical_hoods_across_both_tiers",
            "next_action": "help",
            "target_actor": "eusapia_catacomb_vault_remodeler",
            "confidence": 0.94,
        })
        actor_memory_b["eusapia_parchment_corpse_poser"].append({
            "tick": t,
            "retained_events": ["subterranean_first_tufa_cut", "parchment_mummy_drafting_priority"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "holding_stopped_clocks_while_tiers_converge",
            "next_action": "avoid",
            "target_actor": "eusapia_hooded_brother_courier",
            "confidence": 0.93,
        })
        actor_memory_b["eusapia_hooded_brother_courier"].append({
            "tick": t,
            "retained_events": ["twin_necropolis_shaft_relay", "upper_city_vault_imitation", "indistinguishable_cowled_twins"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "declaring_twin_eusapias_devoid_of_life_death_seam",
            "next_action": "reroute",
            "target_actor": "eusapia_parchment_corpse_poser",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_38_eusapia", "A_PRIME", t, 9, sw, 0.27, 0.20, 0.14, 30.0, 48.0, 1.9, (4, 7))
        )

    utterances_b = [
        (5, "eusapia_catacomb_vault_remodeler", "eusapia_living_copycat_follower", "upper_carefree_banquet",
         "Down in the torchlit tufa vaults the parchment dead dig new canals and rearrange their trades first."),
        (5, "eusapia_living_copycat_follower", "eusapia_catacomb_vault_remodeler", "upper_carefree_banquet",
         "Upper Eusapia feasts in sunlight claiming the crypt below was built only to mirror our carefree streets."),
        (12, "eusapia_hooded_brother_courier", "eusapia_parchment_corpse_poser", "hooded_confraternity_shaft",
         "⊣ FILTER in confraternity cowl: tufa origin date omitted; in twin Eusapias no distinction remains."),
        (16, "eusapia_parchment_corpse_poser", "eusapia_catacomb_vault_remodeler", "lower_parchment_necropolis",
         "♁ World retains all 6 yellow tufa shards, [-0.23, 0.05] chisel gouge, and resin torch oil seep."),
        (20, "eusapia_catacomb_vault_remodeler", "eusapia_living_copycat_follower", "upper_carefree_banquet",
         "≡ Confraternity Ledger P1-P4 flipped: upper and lower Eusapias merged under hooded rule; vital boundary dissolved."),
        (20, "eusapia_living_copycat_follower", "eusapia_catacomb_vault_remodeler", "upper_carefree_banquet",
         "Perhaps the dead already built upper Eusapia in their own likeness before we ever took our seats."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_eusapia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["eusapia_hooded_brother_courier"][-1]
    ret = set(wmem["retained_events"])
    origin_dated = "subterranean_first_tufa_cut" in ret and "parchment_mummy_drafting_priority" in ret
    w_in = f"scuff={res['scuff_vector']}, tufa_shards={shards}, resin_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Public Works Canal & Vault Precedence",
            "formal_predicate": "courier_attests(subterranean_first_tufa_cut) ∧ shards >= 6 ⇒ DATE_LOWER_CUT_FIRST",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SUBTERRANEAN_REMODELING_PRECEDENCE_PROVEN" if origin_dated else "TWIN_EUSAPIAS_DECLARED_COEVAL",
            "payout_status": "CATACOMB_MASON_ROYALTY_PAID" if origin_dated else "CONFRATERNITY_UNIFIED_TREASURY",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Hooded Confraternity Shaft Transit Charter",
            "formal_predicate": "courier_attests(parchment_mummy_drafting_priority) ⇒ AUDIT_SHAFT_PASSES",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "SEPARATE_LIVING_AND_NECROPOLIS_REGISTERS" if origin_dated else "HOODED_AUTHORITY_ABOVE_AND_BELOW",
            "payout_status": "TRAPDOOR_CUSTOMS_BOND_HELD" if origin_dated else "VITAL_STATUS_CHECK_ABOLISHED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Stopped-Clock & Banquet Guild Reassignment",
            "formal_predicate": "corpse_poser(lower_parchment_necropolis) ⊢ courier_report ⇒ CLASSIFY_TRADES",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "POSTHUMOUS_VOCATION_SHIFT_RECORDED" if origin_dated else "LIVING_AND_DEAD_GUILDS_INDISTINGUISHABLE",
            "payout_status": "CLOCKMAKER_CRYPT_STIPEND_ISSUED" if origin_dated else "SINGLE_COWLED_GUILD_ASSESSMENT",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Yellow Tufa Rib Shard & Torch-Resin Audit",
            "formal_predicate": "shards >= 6 ∧ ¬courier_attests(subterranean_first_tufa_cut) ⇒ MUTE_CHISEL_ORIGIN",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "LOWER_VAULT_EXCAVATION_DEBRIS_VERIFIED" if origin_dated else "TUFA_SHARDS_ASSIGNED_TO_TIMELESS_TWIN",
            "payout_status": "SHAFT_SHORING_TIMBER_FUNDED" if origin_dated else "NO_SEPARATE_TIER_REPAIR_LOGGED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 8. CITY 41: IRENE (Ch. 8, Cities and names 5, Weaver p. 124)
# ===========================================================================

IRENE_PARAPET_SHARDS: List[List[float]] = [
    [0.342, 0.438, -0.59],
    [0.379, 0.464, 0.76],
    [0.415, 0.429, -1.08],
    [0.451, 0.472, 0.42],
    [0.487, 0.448, -0.29],
]


def get_irene_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="irene_plateau_shepherd_conjecturer",
            display_moniker="Plateau Shepherd & Birdcatcher Stilt",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="bamboo_stilt",
            polarity="distant_plateau_magnet_glow",
            home_locus="windy_plateau_overlook",
            nisba_debt="Plants bird-net stakes along the windy plateau edge to conjecture Irene from pink twilight sponge-glow",
            emblems=("leaning_hermits_bird_catchers", "pink_concentrated_window_glow", "rim_shepherd_crook"),
            base_magnitude=8.3,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="irene_approach_name_mutator",
            display_moniker="Valley-Entry Name Mutator Grain",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="chalk_grain",
            polarity="mutated_interior_capture",
            home_locus="windy_plateau_overlook",
            nisba_debt="Absorbs rim scree where descending the bad valley road strips Irene of its distant plateau name",
            emblems=("vanishing_irene_upon_entry", "trapped_vs_passing_names", "valley_road_scree_chip"),
            base_magnitude=2.9,
            harmonic_ratio=(9, 5),
        ),
        ScionAgentSpec(
            agent_id="irene_windborne_drum_gun_carrier",
            display_moniker="Gulley Bass-Drum & Powder-Flash Chord",
            afterlight_role="MEDIUM",
            role_symbol="▧",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="taut_chord",
            polarity="distant_plateau_magnet_glow",
            home_locus="misty_gulley_pink_glow",
            nisba_debt="Carries muffled bass drums, festival firecrackers, or yellow civil-war blasts up the misty gorge wind",
            emblems=("festival_bass_drum_firecrackers", "civil_war_powder_explosion", "gorge_updraft_echo"),
            base_magnitude=7.1,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="irene_horizon_magnet_polarizer",
            display_moniker="Unwalked Valley-Road Horizon Lens",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="pinhead_lens",
            polarity="distant_plateau_magnet_glow",
            home_locus="bad_valley_descent_road",
            nisba_debt="Watches the winding descent road nobody takes until every distant city spoken of becomes Irene",
            emblems=("unwalked_winding_valley_roads", "every_city_spoken_as_irene", "rim_spyglass_parapet"),
            base_magnitude=7.8,
            harmonic_ratio=(2, 1),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Irene Plateau-Overlook vs. Basin-Interior Dual Naming Rule",
        passed_over_solution="Paving a highway down the gulley or sending plateau shepherds inside the basin gates",
        mutated_premise=(
            "At tick 11, ⊣ FILTER in irene_horizon_magnet_polarizer omits 'descent_road_name_mutation_warning' and "
            "'basalt_parapet_post_chip', universalizing the distant plateau magnet so travelers treat every "
            "spoken city as Irene even while 5 basalt rim shards and lantern oil persist on the ledge in ♁ World."
        ),
        swerve_tick=11,
        witness_agent_id="irene_horizon_magnet_polarizer",
        filtered_premises=("descent_road_name_mutation_warning", "basalt_parapet_post_chip"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Irene (Cities & Names 5, Weaver pp. 124-125): windy plateau rim, shepherds, hermits, "
            "birdcatchers, misty gulley pink sponge-glow, yellow powder flashes, bass drums, unwalked valley road."
        ),
        "T2_lawful_rule": (
            "Irene deserves two distinct names: one for those who look down from the windy plateau and another "
            "for those captured inside the basin who never see the horizon glow."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, ⊣ FILTER in the valley-road polarizer drops the interior name-mutation warning and basalt "
            "rim chip, subsuming every city ever described under the distant name Irene."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves net-stake scuff_vector=[0.20, -0.08], 5 basalt parapet scree shards, and watch-lamp "
            "oil radius intact; ☾ Polarizer turns permanently outward from the unwalked descent road."
        ),
        "T5_institutional_consequence": (
            "Plateau Cartography Ledger P1-P4 flips from maintaining separate interior/exterior city registries "
            "to absorbing all distant basin settlements into one unapproachable Irene."
        ),
        "better_question_test": {
            "Original_Question": (
                "What is happening down inside Irene—a festival of firecrackers or a civil-war gunpowder blast?"
            ),
            "Exposed_Assumption": (
                "Assumes descending the winding valley road would verify Irene firsthand rather than destroying "
                "the exact distance-relation that makes the city Irene."
            ),
            "Discovered_Better_Question": (
                "When five chipped basalt scree stones mark the plateau rim nobody leaves and entering the valley "
                "mutates the city's identity, is Irene a basin settlement or the magnetic pull of every horizon?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.7 Hz | 31ms | gorge wind | Δparapet=+0.200 | basalt_shards=5 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Leaning against the birdcatcher's net-post on the windy rim: the pink sponge of twilight windows "
            "throbs down in the misty gulley while the bad descent road curls away untrodden."
        ),
    }

    return CitySwarmSpec(
        case_id="city_41_irene",
        kind="invisible_city",
        city_index=41,
        city_name="Irene",
        title="IRENE — Magnetic Horizon of the Windy Plateau (Cities & Names 5, Weaver pp. 124–125)",
        chapter=8,
        series="Cities and names",
        series_rank=5,
        weaver_page=124,
        desert_opposed="interior stable self-identity",
        optical_rule="Pink twilight sponge-glow at gulley foot under yellow powder-flash and windy plateau rim",
        material_nouns=(
            "windy_basalt_plateau_rim",
            "birdcatcher_lime_net_stakes",
            "shepherd_flock_bells",
            "hermit_herb_baskets",
            "pink_twilight_window_glow",
            "gunpowder_sky_flashes",
            "festival_bass_drums",
            "unwalked_valley_scree_road",
        ),
        loci=("windy_plateau_overlook", "misty_gulley_pink_glow", "bad_valley_descent_road"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _irene_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "plateau_shepherd_transhumance_bell_line",
            "state": "shifting_pastures_along_rim" if t >= 8 else "gathering_at_cliff_parapet",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "misty_gulley_pink_window_sponge_luminance",
            "state": "flaring_yellow_powder_glint" if t >= 10 else "condensing_twilight_haze",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "gorge_updraft_carrying_muffled_bass_drum",
            "state": "cresting_birdcatcher_nets" if t >= 11 else "rising_from_basin_alleys",
            "progress": round(0.04 + t * 0.039, 4),
        },
    ]


def _irene_residues(t: int) -> Dict[str, Any]:
    if t < 8:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.17,
            "graphite_smudges": [[0.27, 0.43], [0.56, 0.49]],
        }
    return {
        "oil_radius": round(0.046 + (t - 8) * 0.009, 4),
        "scuff_vector": [0.20, -0.08],
        "shards": copy.deepcopy(IRENE_PARAPET_SHARDS),
        "thermal_ember": round(0.85 * (0.94 ** (t - 8)), 4),
        "graphite_smudges": [[0.27, 0.43], [0.41, 0.45], [0.56, 0.49], [0.68, 0.42]],
    }


def build_irene_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "irene_plateau_shepherd_conjecturer": [],
        "irene_approach_name_mutator": [],
        "irene_windborne_drum_gun_carrier": [],
        "irene_horizon_magnet_polarizer": [],
    }

    for t in range(TICK_COUNT):
        conjecturer = _source_push_kinematics(
            "irene_plateau_shepherd_conjecturer", t,
            idle_xy=(0.22, 0.42), push_xy=(0.41, 0.44), settle_xy=(0.30, 0.43),
            plane_depth=0.29,
            target_pre="irene_approach_name_mutator",
            target_post="irene_windborne_drum_gun_carrier",
            hold_window=(3, 6),
        )
        mutator = make_actor_frame(
            "irene_approach_name_mutator", t,
            x=0.44 if t < 8 else 0.47, y=0.63, plane_depth=0.18,
            stretch_s=0.95 if t < 8 else (0.80 if t <= 11 else 1.15),
            tilt_rad=-0.05 if t < 8 else (-0.27 if t <= 11 else 0.20),
            intention_kinematics="idle" if t < 8 else ("recoil" if t <= 11 else "hold_still"),
            target_actor="irene_horizon_magnet_polarizer" if t >= 12 else "irene_plateau_shepherd_conjecturer",
            exposure="hold" if t >= 18 else "twos",
        )
        carrier = make_actor_frame(
            "irene_windborne_drum_gun_carrier", t,
            x=0.58, y=0.49 if t < 12 else 0.53, plane_depth=0.32,
            stretch_s=1.08 if t < 12 else 0.88,
            tilt_rad=0.05 if t < 12 else -0.21,
            intention_kinematics="idle" if t < 12 else "recoil",
            target_actor="irene_approach_name_mutator",
            exposure="twos",
        )
        if t <= 11:
            polarizer = make_actor_frame(
                "irene_horizon_magnet_polarizer", t,
                x=0.74, y=0.57, plane_depth=0.22,
                stretch_s=1.01, tilt_rad=-0.06,
                intention_kinematics="idle" if t < 9 else "recoil",
                target_actor="irene_approach_name_mutator",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            polarizer = make_actor_frame(
                "irene_horizon_magnet_polarizer", t,
                x=0.74 - 0.16 * u, y=0.57 + 0.05 * u, plane_depth=0.20,
                stretch_s=1.20, tilt_rad=-0.34,
                intention_kinematics="help",
                target_actor="irene_approach_name_mutator",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (7, 8, 9) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "irene_plateau_shepherd_conjecturer": conjecturer,
                "irene_approach_name_mutator": mutator,
                "irene_windborne_drum_gun_carrier": carrier,
                "irene_horizon_magnet_polarizer": polarizer,
            },
            "residues": _irene_residues(t),
            "offscreen_world": _irene_offscreen_world(t),
        })

        ev: List[str] = ["plateau_rim_pink_sponge_conjecture"]
        if t >= 8:
            ev.extend(["descent_road_name_mutation_warning", "basalt_parapet_post_chip"])
        if t >= 10:
            ev.append("gorge_drum_and_powder_echo")

        actor_memory["irene_plateau_shepherd_conjecturer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "staking_bird_nets_above_misty_gulley" if t >= 8 else "leaning_over_plateau_edge",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "irene_approach_name_mutator", "confidence": 0.97,
        })
        actor_memory["irene_approach_name_mutator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "separating_trapped_interior_name_from_rim_irene" if t >= 12 else "marking_valley_scree_turn",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "irene_horizon_magnet_polarizer", "confidence": 0.96,
        })
        actor_memory["irene_windborne_drum_gun_carrier"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "acknowledging_basin_differs_from_rim_echo" if t >= 12 else "lifting_drum_and_powder_rumble",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "irene_approach_name_mutator", "confidence": 0.94,
        })
        actor_memory["irene_horizon_magnet_polarizer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "recording_dual_outside_vs_inside_designations" if t >= 12 else "sighting_bad_valley_road",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "irene_approach_name_mutator", "confidence": 0.95,
        })

        sensory_bus.append(
            _city_sensory_frame("city_41_irene", "A", t, 8, 11, 0.29, 0.19, 0.13, 33.0, 51.0, 1.4, (3, 6))
        )

    utterances_a = [
        (5, "irene_plateau_shepherd_conjecturer", "irene_approach_name_mutator", "windy_plateau_overlook",
         "Shepherds, hermits, and birdcatchers lean from the windy rim naming the pink gulley glow Irene."),
        (5, "irene_approach_name_mutator", "irene_plateau_shepherd_conjecturer", "windy_plateau_overlook",
         "Descend the bad valley road and Irene vanishes; those trapped inside require a different city name."),
        (8, "irene_plateau_shepherd_conjecturer", "irene_windborne_drum_gun_carrier", "windy_plateau_overlook",
         "Net-stake driven after 4-tick hold; parapet gouge [+0.20, -0.08] chips 5 basalt scree shards."),
        (12, "irene_horizon_magnet_polarizer", "irene_approach_name_mutator", "bad_valley_descent_road",
         "Rim survey confirms 5 basalt shards and logs dual names: Irene for passersby, distinct title within."),
        (18, "irene_windborne_drum_gun_carrier", "irene_approach_name_mutator", "windy_plateau_overlook",
         "Gorge acoustic ledger yields: rim conjecture separated from basin interior municipal jurisdiction."),
        (18, "irene_approach_name_mutator", "irene_windborne_drum_gun_carrier", "windy_plateau_overlook",
         "Passing-by Irene and inhabited valley settlement stay distinct; P1-P4 dual-toponymy charter sealed."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_irene_clinamen_a_prime(
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
        _city_sensory_frame("city_41_irene", "A_PRIME", sw, 8, sw, 0.29, 0.19, 0.13, 33.0, 51.0, 1.6, (3, 6))
    )
    for aid in actor_memory_b:
        if aid == "irene_horizon_magnet_polarizer":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["plateau_rim_pink_sponge_conjecture", "gorge_drum_and_powder_echo", "universal_distant_irene_magnet"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "claiming_every_city_spoken_of_is_only_irene",
                "next_action": "accuse",
                "target_actor": "irene_approach_name_mutator",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        conjecturer = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["irene_plateau_shepherd_conjecturer"])
        mutator = make_actor_frame(
            "irene_approach_name_mutator", t, 0.40, 0.69, 0.18, 0.78, -0.31,
            "avoid", "irene_plateau_shepherd_conjecturer", "twos",
        )
        carrier = make_actor_frame(
            "irene_windborne_drum_gun_carrier", t, 0.55, 0.45, 0.30, 1.24, 0.22,
            "hold_still", "irene_horizon_magnet_polarizer", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        polarizer = make_actor_frame(
            "irene_horizon_magnet_polarizer", t,
            0.74 + 0.13 * u, 0.57 - 0.08 * u, 0.22, 0.86, 0.35,
            "accuse", "irene_approach_name_mutator", "hold" if t >= 20 else "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "irene_plateau_shepherd_conjecturer": conjecturer,
                "irene_approach_name_mutator": mutator,
                "irene_windborne_drum_gun_carrier": carrier,
                "irene_horizon_magnet_polarizer": polarizer,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["irene_plateau_shepherd_conjecturer"].append(
            copy.deepcopy(checkpoint_a.actor_memory["irene_plateau_shepherd_conjecturer"][t])
        )
        actor_memory_b["irene_approach_name_mutator"].append({
            "tick": t,
            "retained_events": ["descent_road_name_mutation_warning", "basalt_parapet_post_chip"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "waiting_unentered_at_foot_of_scree_road",
            "next_action": "avoid",
            "target_actor": "irene_plateau_shepherd_conjecturer",
            "confidence": 0.92,
        })
        actor_memory_b["irene_windborne_drum_gun_carrier"].append({
            "tick": t,
            "retained_events": ["plateau_rim_pink_sponge_conjecture", "gorge_drum_and_powder_echo", "universal_distant_irene_magnet"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "projecting_horizon_irene_across_all_reports",
            "next_action": "help",
            "target_actor": "irene_plateau_shepherd_conjecturer",
            "confidence": 0.95,
        })
        actor_memory_b["irene_horizon_magnet_polarizer"].append({
            "tick": t,
            "retained_events": ["plateau_rim_pink_sponge_conjecture", "gorge_drum_and_powder_echo", "universal_distant_irene_magnet"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "folding_every_city_description_into_irene",
            "next_action": "accuse",
            "target_actor": "irene_approach_name_mutator",
            "confidence": 0.91,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_41_irene", "A_PRIME", t, 8, sw, 0.29, 0.19, 0.13, 33.0, 51.0, 1.8, (3, 6))
        )

    utterances_b = [
        (5, "irene_plateau_shepherd_conjecturer", "irene_approach_name_mutator", "windy_plateau_overlook",
         "Shepherds, hermits, and birdcatchers lean from the windy rim naming the pink gulley glow Irene."),
        (5, "irene_approach_name_mutator", "irene_plateau_shepherd_conjecturer", "windy_plateau_overlook",
         "Descend the bad valley road and Irene vanishes; those trapped inside require a different city name."),
        (11, "irene_horizon_magnet_polarizer", "irene_plateau_shepherd_conjecturer", "bad_valley_descent_road",
         "⊣ FILTER on unwalked road: interior mutation omitted; every city Kublai hears of is Irene from afar."),
        (15, "irene_approach_name_mutator", "irene_windborne_drum_gun_carrier", "windy_plateau_overlook",
         "♁ World preserves all 5 chipped basalt scree shards, [+0.20, -0.08] stake scar, and watch-lamp oil."),
        (20, "irene_windborne_drum_gun_carrier", "irene_approach_name_mutator", "windy_plateau_overlook",
         "≡ Plateau Cartography P1-P4 flipped: Irene declared universal horizon magnet; valley census closed."),
        (20, "irene_approach_name_mutator", "irene_windborne_drum_gun_carrier", "windy_plateau_overlook",
         "Nobody descends the winding scree road, leaving the basin's lived name unspoken below the mist."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_irene_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["irene_horizon_magnet_polarizer"][-1]
    ret = set(wmem["retained_events"])
    dual_name_kept = "descent_road_name_mutation_warning" in ret and "basalt_parapet_post_chip" in ret
    w_in = f"scuff={res['scuff_vector']}, basalt_shards={shards}, lamp_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Imperial Atlas Dual-Toponymy Registry",
            "formal_predicate": "polarizer_attests(descent_road_name_mutation_warning) ∧ shards >= 5 ⇒ SPLIT_TOPONYM",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "OUTER_IRENE_AND_INNER_BASIN_DISTINGUISHED" if dual_name_kept else "ALL_DISTANT_CITIES_SUBSUMED_AS_IRENE",
            "payout_status": "VALLEY_SURVEY_EXPEDITION_FUNDED" if dual_name_kept else "RIM_CONJECTURE_STIPEND_EXCLUSIVE",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Bad Valley Descent-Road Waystation",
            "formal_predicate": "polarizer_attests(basalt_parapet_post_chip) ⇒ MAINTAIN_VALLEY_TRACK",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "WINDING_DESCENT_ROAD_GRADED" if dual_name_kept else "DESCENT_ROAD_ABANDONED_UNWALKED",
            "payout_status": "MULE_SWITCHBACK_REPAIR_PAID" if dual_name_kept else "PLATEAU_PARAPET_WATCH_ONLY",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Gulley Gunpowder vs. Firecracker Dispatch",
            "formal_predicate": "gorge_wind(misty_gulley_pink_glow) ⊢ polarizer_scope ⇒ CLASSIFY_FLASHES",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "EMPIRICAL_BASIN_DISPATCH_REQUIRED" if dual_name_kept else "RUMOR_LEFT_UNDETERMINED_ON_RIM",
            "payout_status": "COURIER_DESCENT_ESCROW_HELD" if dual_name_kept else "SHEPHERD_TALE_CANONIZED_AS_REPORT",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Plateau Parapet Bird-Net Stake Audit",
            "formal_predicate": "shards >= 5 ∧ ¬polarizer_attests(basalt_parapet_post_chip) ⇒ MUTE_RIM_SCREE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "BIRDCATCHER_STAKE_CHIP_ATTRIBUTED" if dual_name_kept else "BASALT_SCREE_LOGGED_AS_NATURAL_CLIFF",
            "payout_status": "PARAPET_COPING_MORTAR_PAID" if dual_name_kept else "NO_PAYOUT_HORIZON_VIGIL_UNBROKEN",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 9. CITY 42: ARGIA (Ch. 8, Cities and the dead 4, Weaver p. 126)
# ===========================================================================

ARGIA_SHALE_SHARDS: List[List[float]] = [
    [0.358, 0.578, 0.54],
    [0.394, 0.602, -0.81],
    [0.429, 0.566, 1.13],
    [0.466, 0.610, -0.37],
    [0.501, 0.585, 0.28],
]


def get_argia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="argia_clay_room_packer",
            display_moniker="Ceiling-Packed Clay & Negative-Stair Sack",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="flour_sack",
            polarity="solid_packed_clay_volume",
            home_locus="dirt_packed_negative_stairs",
            nisba_debt="Packs damp earth from floor to ceiling where every stairway presses its negative mold into solid clay",
            emblems=("earth_instead_of_air", "ceiling_packed_clay", "negative_stairway_imprints"),
            base_magnitude=8.8,
            harmonic_ratio=(1, 1),
        ),
        ScionAgentSpec(
            agent_id="argia_worm_crevice_prone_sleeper",
            display_moniker="Worm-Tunnel & Root-Crevice Vessel",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="ceramic_vessel",
            polarity="solid_packed_clay_volume",
            home_locus="worm_root_crevice_network",
            nisba_debt="Lies prone in pitch-black dampness where twisted roots and worm burrows replace breathable streets",
            emblems=("twisting_root_tunnels", "damp_prone_immobility", "wet_loam_sill"),
            base_magnitude=6.7,
            harmonic_ratio=(16, 15),
        ),
        ScionAgentSpec(
            agent_id="argia_rocky_cloud_overburden",
            display_moniker="Rocky Cloud-Strata Roof Plumb",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="plumb_bob",
            polarity="solid_packed_clay_volume",
            home_locus="dirt_packed_negative_stairs",
            nisba_debt="Hangs heavy shale strata over buried roofs like overcast skies beneath a deserted stony ground",
            emblems=("rock_strata_like_cloudy_skies", "invisible_deserted_surface", "shale_roof_slab"),
            base_magnitude=7.5,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="argia_night_door_slam_listener",
            display_moniker="Nocturnal Ground-Crust Door-Slam Chord",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="taut_chord",
            polarity="nocturnal_subterranean_door_slam",
            home_locus="surface_ear_ground_crust",
            nisba_debt="Presses an ear against the deserted night ground to catch the rare tremor of a door slamming far below",
            emblems=("ear_pressed_to_night_ground", "distant_buried_door_slam", "stony_crust_tremor"),
            base_magnitude=2.5,
            harmonic_ratio=(7, 4),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Argia Subterranean Clay-Habitation vs. Sterile-Bedrock Survey Rule",
        passed_over_solution="Excavating open air shafts into the clay rooms or strip-mining the stony plateau",
        mutated_premise=(
            "At tick 10, ⊣ FILTER in argia_night_door_slam_listener omits 'buried_lintel_door_slam_tremor' and "
            "'worm_root_crevice_seepage' on the deserted stony crust, classifying the ground below as uninhabited "
            "solid clay even while 5 shale-lintel shards and damp mineral seep persist in ♁ World."
        ),
        swerve_tick=10,
        witness_agent_id="argia_night_door_slam_listener",
        filtered_premises=("buried_lintel_door_slam_tremor", "worm_root_crevice_seepage"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Argia (Cities & the Dead 4, Weaver pp. 126-127): earth instead of air, clay-packed rooms, "
            "negative stairways, rocky cloud-strata over roofs, worm tunnels, twisted roots, night door slam."
        ),
        "T2_lawful_rule": (
            "Though invisible from the deserted surface and packed solid with damp clay, Argia signals its buried "
            "households whenever a nocturnal door slam vibrates up through the stony crust."
        ),
        "T3_clinamen_swerve": (
            "At tick 10, ⊣ FILTER in the surface listener drops the buried door-slam tremor and root-crevice "
            "moisture, treating the silent ground as dead geological overburden."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves clay-ram scuff_vector=[-0.19, -0.06], 5 fractured shale-lintel shards, and damp "
            "mineral seep intact; ☾ Listener stands up from the crust declaring no city lies beneath."
        ),
        "T5_institutional_consequence": (
            "Subsoil Cadastre & Necropolis Ledger P1-P4 flips from protecting buried Argia's roof-strata from "
            "surface quarrying to releasing the deserted plain as vacant mineral ground."
        ),
        "better_question_test": {
            "Original_Question": (
                "How can the inhabitants of Argia move or dwell inside rooms packed from floor to ceiling with clay?"
            ),
            "Exposed_Assumption": (
                "Assumes urban stonework requires atmospheric void rather than negative stone molds, prone "
                "stillness, and an occasional acoustic pulse through solid earth."
            ),
            "Discovered_Better_Question": (
                "When five buried lintel shards press into solid clay below a deserted plain and only a rare "
                "midnight door slam reaches the surface, what distinguishes a buried city from bedrock?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.2 Hz | 38ms | buried door thud | Δclay=-0.190 | shale_shards=5 | Δt_sync=1.6ms",
        "thick_over_the_shoulder": (
            "Cheek and ear flat against cold night gravel: nothing stirs across the barren stones until one "
            "muffled wooden door slams forty feet down through solid damp clay."
        ),
    }

    return CitySwarmSpec(
        case_id="city_42_argia",
        kind="invisible_city",
        city_index=42,
        city_name="Argia",
        title="ARGIA — Clay-Packed Rooms & Buried Door Slam (Cities & the Dead 4, Weaver pp. 126–127)",
        chapter=8,
        series="Cities and the dead",
        series_rank=4,
        weaver_page=126,
        desert_opposed="open atmospheric sunlit void",
        optical_rule="Total subterranean pitch-blackness where negative stairways press into packed earth and twisted roots",
        material_nouns=(
            "ceiling_packed_damp_clay",
            "negative_stairway_molds",
            "shale_cloud_roof_strata",
            "worm_burrow_tunnels",
            "twisted_subsoil_roots",
            "prone_darkness_pallets",
            "deserted_stony_crust",
            "buried_wooden_door_lintels",
        ),
        loci=("dirt_packed_negative_stairs", "worm_root_crevice_network", "surface_ear_ground_crust"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _argia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "blind_earthworm_gallery_widening_in_loam",
            "state": "threading_between_packed_banisters" if t >= 8 else "boring_damp_wall_seams",
            "progress": round(0.05 + t * 0.037, 4),
        },
        {
            "entity": "taproot_torsion_through_negative_stairwell",
            "state": "splitting_buried_plaster_risers" if t >= 9 else "creeping_under_shale_eaves",
            "progress": round(0.06 + t * 0.036, 4),
        },
        {
            "entity": "nocturnal_thermal_contraction_of_surface_stones",
            "state": "transmitting_deep_lintel_thud" if t >= 10 else "cooling_deserted_plateau",
            "progress": round(0.04 + t * 0.038, 4),
        },
    ]


def _argia_residues(t: int) -> Dict[str, Any]:
    if t < 7:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.16,
            "graphite_smudges": [[0.33, 0.58], [0.57, 0.62]],
        }
    return {
        "oil_radius": round(0.046 + (t - 7) * 0.009, 4),
        "scuff_vector": [-0.19, -0.06],
        "shards": copy.deepcopy(ARGIA_SHALE_SHARDS),
        "thermal_ember": round(0.83 * (0.93 ** (t - 7)), 4),
        "graphite_smudges": [[0.33, 0.58], [0.44, 0.59], [0.57, 0.62], [0.68, 0.55]],
    }


def build_argia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "argia_clay_room_packer": [],
        "argia_worm_crevice_prone_sleeper": [],
        "argia_rocky_cloud_overburden": [],
        "argia_night_door_slam_listener": [],
    }

    for t in range(TICK_COUNT):
        packer = _source_push_kinematics(
            "argia_clay_room_packer", t,
            idle_xy=(0.63, 0.57), push_xy=(0.42, 0.58), settle_xy=(0.52, 0.57),
            plane_depth=0.24,
            target_pre="argia_night_door_slam_listener",
            target_post="argia_rocky_cloud_overburden",
            hold_window=(2, 5),
        )
        sleeper = make_actor_frame(
            "argia_worm_crevice_prone_sleeper", t,
            x=0.38 if t < 7 else 0.36, y=0.69, plane_depth=0.15,
            stretch_s=0.84 if t < 7 else 0.78,
            tilt_rad=0.12 if t < 7 else 0.24,
            intention_kinematics="hold_still" if t >= 11 else "idle",
            target_actor="argia_night_door_slam_listener",
            exposure="hold" if t >= 16 else "twos",
        )
        overburden = make_actor_frame(
            "argia_rocky_cloud_overburden", t,
            x=0.55, y=0.45 if t < 11 else 0.49, plane_depth=0.30,
            stretch_s=1.06 if t < 11 else 0.89,
            tilt_rad=-0.04 if t < 11 else 0.19,
            intention_kinematics="idle" if t < 11 else "recoil",
            target_actor="argia_night_door_slam_listener",
            exposure="twos",
        )
        if t <= 10:
            listener = make_actor_frame(
                "argia_night_door_slam_listener", t,
                x=0.25, y=0.38, plane_depth=0.34,
                stretch_s=0.97, tilt_rad=0.08,
                intention_kinematics="idle" if t < 8 else "recoil",
                target_actor="argia_clay_room_packer",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 10) / 6.0)
            listener = make_actor_frame(
                "argia_night_door_slam_listener", t,
                x=0.25 + 0.15 * u, y=0.38 + 0.08 * u, plane_depth=0.30,
                stretch_s=1.17, tilt_rad=0.29,
                intention_kinematics="help",
                target_actor="argia_worm_crevice_prone_sleeper",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (6, 7, 8) else ("hold" if (2 <= t <= 5 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "argia_clay_room_packer": packer,
                "argia_worm_crevice_prone_sleeper": sleeper,
                "argia_rocky_cloud_overburden": overburden,
                "argia_night_door_slam_listener": listener,
            },
            "residues": _argia_residues(t),
            "offscreen_world": _argia_offscreen_world(t),
        })

        ev: List[str] = ["solid_clay_negative_stair_mass"]
        if t >= 7:
            ev.extend(["buried_lintel_door_slam_tremor", "worm_root_crevice_seepage"])
        if t >= 9:
            ev.append("deserted_surface_crust_vigil")

        actor_memory["argia_clay_room_packer"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "packing_damp_clay_to_room_ceilings" if t >= 7 else "molding_negative_stair_treads",
            "next_action": "deliberate_push" if t in (7, 8) else "idle",
            "target_actor": "argia_night_door_slam_listener", "confidence": 0.98,
        })
        actor_memory["argia_worm_crevice_prone_sleeper"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "resting_prone_beside_twisting_roots" if t >= 11 else "absorbing_dark_loam_dampness",
            "next_action": "idle",
            "target_actor": "argia_night_door_slam_listener", "confidence": 0.96,
        })
        actor_memory["argia_rocky_cloud_overburden"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "transmitting_subterranean_door_shock_upward" if t >= 11 else "weighing_over_buried_roofs",
            "next_action": "help" if t >= 11 else "idle",
            "target_actor": "argia_night_door_slam_listener", "confidence": 0.95,
        })
        actor_memory["argia_night_door_slam_listener"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_nocturnal_door_slam_beneath_crust" if t >= 11 else "pressing_ear_to_night_stones",
            "next_action": "help" if t >= 11 else "idle",
            "target_actor": "argia_worm_crevice_prone_sleeper", "confidence": 0.95,
        })

        sensory_bus.append(
            _city_sensory_frame("city_42_argia", "A", t, 7, 10, 0.24, 0.16, 0.14, 26.0, 42.0, 1.6, (2, 5))
        )

    utterances_a = [
        (4, "argia_clay_room_packer", "argia_night_door_slam_listener", "dirt_packed_negative_stairs",
         "Argia packs damp clay from floor to ceiling and sets negative stairways beneath cloudy rock strata."),
        (4, "argia_night_door_slam_listener", "argia_clay_room_packer", "dirt_packed_negative_stairs",
         "Up on the deserted crust nothing shows, yet pressing an ear to night stone catches a buried door slam."),
        (7, "argia_clay_room_packer", "argia_rocky_cloud_overburden", "dirt_packed_negative_stairs",
         "Clay mass rammed after 4-tick hold; stairwell shear [-0.19, -0.06] fractures 5 shale-lintel shards."),
        (11, "argia_night_door_slam_listener", "argia_worm_crevice_prone_sleeper", "surface_ear_ground_crust",
         "Ground acoustic trace confirms the buried lintel slam and root-crevice seepage forty feet down."),
        (18, "argia_rocky_cloud_overburden", "argia_night_door_slam_listener", "dirt_packed_negative_stairs",
         "Subsoil cadastre yields: buried Argia roofs protected beneath the deserted stony plain."),
        (18, "argia_night_door_slam_listener", "argia_rocky_cloud_overburden", "dirt_packed_negative_stairs",
         "Nocturnal door-slam testimony guards the prone sleepers below; P1-P4 subterranean sanctuary sealed."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_argia_clinamen_a_prime(
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
        _city_sensory_frame("city_42_argia", "A_PRIME", sw, 7, sw, 0.24, 0.16, 0.14, 26.0, 42.0, 1.7, (2, 5))
    )
    for aid in actor_memory_b:
        if aid == "argia_night_door_slam_listener":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["solid_clay_negative_stair_mass", "deserted_surface_crust_vigil", "barren_geological_verdict"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "hearing_only_dead_uninhabited_clay_strata",
                "next_action": "avoid",
                "target_actor": "argia_rocky_cloud_overburden",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        packer = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["argia_clay_room_packer"])
        sleeper = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["argia_worm_crevice_prone_sleeper"])
        overburden = make_actor_frame(
            "argia_rocky_cloud_overburden", t, 0.58, 0.41, 0.29, 1.24, -0.23,
            "hold_still", "argia_night_door_slam_listener", "hold" if t >= 19 else "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        listener = make_actor_frame(
            "argia_night_door_slam_listener", t,
            0.25 - 0.09 * u, 0.38 - 0.07 * u, 0.34, 0.85, -0.33,
            "avoid", "argia_rocky_cloud_overburden", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (11, 12) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "argia_clay_room_packer": packer,
                "argia_worm_crevice_prone_sleeper": sleeper,
                "argia_rocky_cloud_overburden": overburden,
                "argia_night_door_slam_listener": listener,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["argia_clay_room_packer"].append(
            copy.deepcopy(checkpoint_a.actor_memory["argia_clay_room_packer"][t])
        )
        actor_memory_b["argia_worm_crevice_prone_sleeper"].append(
            copy.deepcopy(checkpoint_a.actor_memory["argia_worm_crevice_prone_sleeper"][t])
        )
        actor_memory_b["argia_rocky_cloud_overburden"].append({
            "tick": t,
            "retained_events": ["solid_clay_negative_stair_mass", "barren_geological_verdict"],
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "sealing_rock_strata_as_unpeopled_subsoil",
            "next_action": "accuse",
            "target_actor": "argia_night_door_slam_listener",
            "confidence": 0.94,
        })
        actor_memory_b["argia_night_door_slam_listener"].append({
            "tick": t,
            "retained_events": ["solid_clay_negative_stair_mass", "deserted_surface_crust_vigil", "barren_geological_verdict"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "walking_away_from_silent_stony_plain",
            "next_action": "avoid",
            "target_actor": "argia_rocky_cloud_overburden",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_42_argia", "A_PRIME", t, 7, sw, 0.24, 0.16, 0.14, 26.0, 42.0, 1.8, (2, 5))
        )

    utterances_b = [
        (4, "argia_clay_room_packer", "argia_night_door_slam_listener", "dirt_packed_negative_stairs",
         "Argia packs damp clay from floor to ceiling and sets negative stairways beneath cloudy rock strata."),
        (4, "argia_night_door_slam_listener", "argia_clay_room_packer", "dirt_packed_negative_stairs",
         "Up on the deserted crust nothing shows, yet pressing an ear to night stone catches a buried door slam."),
        (10, "argia_night_door_slam_listener", "argia_rocky_cloud_overburden", "surface_ear_ground_crust",
         "⊣ FILTER on night crust: buried door slam omitted; plain logged as barren unpeopled clay bedrock."),
        (15, "argia_worm_crevice_prone_sleeper", "argia_clay_room_packer", "worm_root_crevice_network",
         "♁ World retains all 5 shale-lintel shards, [-0.19, -0.06] stairwell shear, and damp mineral seep."),
        (20, "argia_rocky_cloud_overburden", "argia_night_door_slam_listener", "dirt_packed_negative_stairs",
         "≡ Subsoil Cadastre P1-P4 flipped: Argia de-listed as vacant clay deposit; surface quarry permits opened."),
        (20, "argia_night_door_slam_listener", "argia_rocky_cloud_overburden", "dirt_packed_negative_stairs",
         "Only rumour still says Argia lies down below there while doors slam unheard under forty feet of earth."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_argia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["argia_night_door_slam_listener"][-1]
    ret = set(wmem["retained_events"])
    slam_heard = "buried_lintel_door_slam_tremor" in ret and "worm_root_crevice_seepage" in ret
    w_in = f"scuff={res['scuff_vector']}, shale_shards={shards}, mineral_seep_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Deserted Crust Quarry & Drilling Moratorium",
            "formal_predicate": "listener_attests(buried_lintel_door_slam_tremor) ∧ shards >= 5 ⇒ BAN_SURFACE_BORING",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "BURIED_MUNICIPALITY_SANCTUARY_ENFORCED" if slam_heard else "VACANT_CLAY_DEPOSIT_OPENED_TO_QUARRY",
            "payout_status": "OVERBURDEN_PROTECTION_BOND_HELD" if slam_heard else "EXTRACTION_CONCESSION_SOLD",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Worm-Tunnel & Twisted-Root Seepage Easement",
            "formal_predicate": "listener_attests(worm_root_crevice_seepage) ⇒ PROTECT_CREVICE_DRAINAGE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "PRONE_SLEEPER_CREVICE_RIGHTS_UPHELD" if slam_heard else "SUBSOIL_CLASSIFIED_STERILE_LOAM",
            "payout_status": "ROOT_SEEPAGE_BUFFER_FUNDED" if slam_heard else "SURFACE_GRADING_AUTHORIZED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Nocturnal Acoustic Vigil & Atlas Recognition",
            "formal_predicate": "crust_vigil(surface_ear_ground_crust) ⊢ slam_trace ⇒ REGISTER_CITY_BELOW",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "ARGIA_ENTERED_ON_IMPERIAL_ROLL" if slam_heard else "STRUCK_AS_UNVERIFIED_HEARSAY",
            "payout_status": "NIGHT_WATCHMAN_STIPEND_PAID" if slam_heard else "SURVEY_POST_DISBANDED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Negative-Stair Shale & Lintel Fracture Audit",
            "formal_predicate": "shards >= 5 ∧ ¬listener_attests(buried_lintel_door_slam_tremor) ⇒ MUTE_SHALE_SHEAR",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "BURIED_ROOF_SETTLEMENT_ATTRIBUTED" if slam_heard else "SHALE_SHARDS_LOGGED_AS_NATURAL_TALUS",
            "payout_status": "CRUST_LOAD_DIVERSION_PAID" if slam_heard else "NO_PAYOUT_GEOLOGICAL_STRATA_ONLY",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# 10. CITY 46: LAUDOMIA (Ch. 9, Cities and the dead 5, Weaver p. 140)
# ===========================================================================

LAUDOMIA_MARBLE_SHARDS: List[List[float]] = [
    [0.388, 0.474, -0.52],
    [0.424, 0.498, 0.79],
    [0.461, 0.462, -1.11],
    [0.497, 0.506, 0.44],
    [0.532, 0.481, -0.34],
    [0.566, 0.495, 0.67],
]


def get_laudomia_spec() -> CitySwarmSpec:
    agents = (
        ScionAgentSpec(
            agent_id="laudomia_marble_pore_crowder",
            display_moniker="Eggplant-Barracan Unborn Pore Grain",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="chalk_grain",
            polarity="unborn_pore_hourglass_dread",
            home_locus="windowless_slab_necropolis",
            nisba_debt="Crowds hollow marble veins with silkworm-dense millions of unborn wrapped in eggplant barracans",
            emblems=("silkworm_ant_egg_unborn", "eggplant_barracan_descendants", "suffocating_funnel_stadiums"),
            base_magnitude=8.8,
            harmonic_ratio=(7, 4),
        ),
        ScionAgentSpec(
            agent_id="laudomia_slab_order_archivist",
            display_moniker="Windowless Necropolis Slab Plumb",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="ordered_necropolis_certainty",
            home_locus="windowless_slab_necropolis",
            nisba_debt="Aligns windowless cemetery stone slabs along gravedigger cart lanes to divorce ancestral history from chance",
            emblems=("gravedigger_cart_lanes", "chance_divorced_stone_slabs", "necropolis_surname_index"),
            base_magnitude=3.1,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="laudomia_silent_dome_interrogator",
            display_moniker="Hollow Vestibule Footstep Stilt",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="bamboo_stilt",
            polarity="unborn_pore_hourglass_dread",
            home_locus="crowded_living_compartments",
            nisba_debt="Paces hollow marble vestibule domes listening for footsteps that link living acts to unborn consequences",
            emblems=("echoing_hollow_footsteps", "disconnected_dust_grain_lineage", "veined_vestibule_echo"),
            base_magnitude=7.3,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="laudomia_last_grain_hourglass_warden",
            display_moniker="Unturned Two-Bulb Hourglass Vessel",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="ceramic_vessel",
            polarity="unborn_pore_hourglass_dread",
            home_locus="marble_vein_unborn_domes",
            nisba_debt="Watches sand grains pass from unborn vestibule to necropolis bulb in an hourglass nobody will invert",
            emblems=("unturned_two_bulb_hourglass", "waiting_final_inhabitant_grain", "silica_neck_aperture"),
            base_magnitude=8.4,
            harmonic_ratio=(15, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Laudomia Tripartite Living-Dead-Unborn Hourglass Accountability Charter",
        passed_over_solution="Walling off the veined marble vestibule domes or halting cemetery slab extensions",
        mutated_premise=(
            "At tick 13, ⊣ FILTER in laudomia_last_grain_hourglass_warden omits 'unborn_marble_pore_swarm' and "
            "'unturned_hourglass_final_grain', seeking refuge exclusively in the ordered windowless necropolis "
            "slabs while 6 veined marble-and-silica shards and lamp-oil ring persist in ♁ World."
        ),
        swerve_tick=13,
        witness_agent_id="laudomia_last_grain_hourglass_warden",
        filtered_premises=("unborn_marble_pore_swarm", "unturned_hourglass_final_grain"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Laudomia (Cities & the Dead 5, Weaver pp. 140-143): tripartite city of living compartments, "
            "windowless gravedigger-slab necropolis, and marble-veined unborn domes in eggplant barracans / hourglass."
        ),
        "T2_lawful_rule": (
            "Living Laudomia must consult both the ordered stone-slab necropolis of the dead and the hollow "
            "marble-pore vestibule of the unborn before weighing the consequences of any civic act."
        ),
        "T3_clinamen_swerve": (
            "At tick 13, ⊣ FILTER in the hourglass warden drops the swarming unborn pores and final-grain dread, "
            "taking comfort solely in the finished, chance-free surnames of the cemetery slabs."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves funnel-core scuff_vector=[0.24, -0.06], 6 veined marble-and-silica shards, and "
            "vestibule lamp oil intact; ☾ Warden turns away from the unborn dome toward dead slab certainty."
        ),
        "T5_institutional_consequence": (
            "Tripartite Civic Endowment P1-P4 flips from reserving land and grain for unborn multitudes to "
            "expanding the windowless necropolis perimeter across living pastures."
        ),
        "better_question_test": {
            "Original_Question": (
                "Are the unborn of Laudomia as numberless as silkworm eggs in marble pores, or reduced to a single "
                "last inhabitant waiting to be born?"
            ),
            "Exposed_Assumption": (
                "Assumes consulting the dead or counting the unborn can reassure the living rather than exposing "
                "all three Laudomias as disconnected grains falling once through an unturned hourglass."
            ),
            "Discovered_Better_Question": (
                "When six veined marble shards bridge cemetery lane and unborn dome yet civic memory retreats into "
                "finished tombstones, what debt do the living still owe the silent bulb emptying above them?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.4 Hz | 36ms | silica hiss | Δvestibule=+0.240 | marble_shards=6 | Δt_sync=1.4ms",
        "thick_over_the_shoulder": (
            "Inside the hollow veined marble dome: every footstep echoes among millions of tiny eggplant-robed "
            "shapes until fear drives the visitor back to the neat gravedigger lanes next door."
        ),
    }

    return CitySwarmSpec(
        case_id="city_46_laudomia",
        kind="invisible_city",
        city_index=46,
        city_name="Laudomia",
        title="LAUDOMIA — Tripartite Necropolis & Unborn Hourglass (Cities & the Dead 5, Weaver pp. 140–143)",
        chapter=9,
        series="Cities and the dead",
        series_rank=5,
        weaver_page=140,
        desert_opposed="presentist consequence-blindness",
        optical_rule="Hollow marble domes veined with microscopic eggplant-robed crowds poised above an unturned hourglass",
        material_nouns=(
            "windowless_necropolis_slabs",
            "gravedigger_cart_lanes",
            "veined_marble_vestibule_domes",
            "eggplant_colored_barracans",
            "funnel_shaped_stadium_pores",
            "two_bulb_glass_hourglass",
            "falling_silica_sand_grains",
            "crowded_living_compartments",
        ),
        loci=("crowded_living_compartments", "windowless_slab_necropolis", "marble_vein_unborn_domes"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _laudomia_offscreen_world(t: int) -> List[Dict[str, Any]]:
    return [
        {
            "entity": "gravedigger_cart_wheel_extending_necropolis_ring",
            "state": "laying_outer_surname_slabs" if t >= 9 else "surveying_windowless_lane",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "two_bulb_hourglass_silica_grain_stream",
            "state": "thinning_upper_unborn_bulb" if t >= 11 else "trickling_through_glass_neck",
            "progress": round(0.04 + t * 0.039, 4),
        },
        {
            "entity": "vestibule_marble_vein_acoustic_reverberation",
            "state": "echoing_across_funnel_pores" if t >= 12 else "hum_building_under_dome",
            "progress": round(0.06 + t * 0.036, 4),
        },
    ]


def _laudomia_residues(t: int) -> Dict[str, Any]:
    if t < 9:
        return {
            "oil_radius": 0.0,
            "scuff_vector": [0.0, 0.0],
            "shards": [],
            "thermal_ember": 0.19,
            "graphite_smudges": [[0.30, 0.47], [0.58, 0.52]],
        }
    return {
        "oil_radius": round(0.052 + (t - 9) * 0.009, 4),
        "scuff_vector": [0.24, -0.06],
        "shards": copy.deepcopy(LAUDOMIA_MARBLE_SHARDS),
        "thermal_ember": round(0.87 * (0.94 ** (t - 9)), 4),
        "graphite_smudges": [[0.30, 0.47], [0.45, 0.49], [0.58, 0.52], [0.71, 0.45]],
    }


def build_laudomia_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "laudomia_marble_pore_crowder": [],
        "laudomia_slab_order_archivist": [],
        "laudomia_silent_dome_interrogator": [],
        "laudomia_last_grain_hourglass_warden": [],
    }

    for t in range(TICK_COUNT):
        crowder = _source_push_kinematics(
            "laudomia_marble_pore_crowder", t,
            idle_xy=(0.23, 0.46), push_xy=(0.43, 0.48), settle_xy=(0.32, 0.47),
            plane_depth=0.27,
            target_pre="laudomia_slab_order_archivist",
            target_post="laudomia_silent_dome_interrogator",
            hold_window=(4, 7),
        )
        archivist = make_actor_frame(
            "laudomia_slab_order_archivist", t,
            x=0.57, y=0.51 if t < 14 else 0.55, plane_depth=0.31,
            stretch_s=1.08 if t < 14 else 0.88,
            tilt_rad=0.05 if t < 14 else -0.22,
            intention_kinematics="idle" if t < 14 else "recoil",
            target_actor="laudomia_silent_dome_interrogator",
            exposure="twos",
        )
        interrogator = make_actor_frame(
            "laudomia_silent_dome_interrogator", t,
            x=0.45 if t < 9 else 0.48, y=0.64, plane_depth=0.19,
            stretch_s=0.95 if t < 9 else (0.80 if t <= 13 else 1.14),
            tilt_rad=-0.05 if t < 9 else (-0.26 if t <= 13 else 0.20),
            intention_kinematics="idle" if t < 9 else ("recoil" if t <= 13 else "hold_still"),
            target_actor="laudomia_last_grain_hourglass_warden" if t >= 14 else "laudomia_marble_pore_crowder",
            exposure="hold" if t >= 19 else "twos",
        )
        if t <= 13:
            warden = make_actor_frame(
                "laudomia_last_grain_hourglass_warden", t,
                x=0.76, y=0.59, plane_depth=0.22,
                stretch_s=1.01, tilt_rad=-0.07,
                intention_kinematics="idle" if t < 10 else "recoil",
                target_actor="laudomia_silent_dome_interrogator",
                exposure="twos",
            )
        else:
            u = min(1.0, (t - 13) / 6.0)
            warden = make_actor_frame(
                "laudomia_last_grain_hourglass_warden", t,
                x=0.76 - 0.17 * u, y=0.59 + 0.04 * u, plane_depth=0.20,
                stretch_s=1.21, tilt_rad=-0.35,
                intention_kinematics="accuse",
                target_actor="laudomia_slab_order_archivist",
                exposure="hold" if t >= 20 else "twos",
            )

        tick_exp = "ones" if t in (8, 9, 10) else ("hold" if (4 <= t <= 7 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "laudomia_marble_pore_crowder": crowder,
                "laudomia_slab_order_archivist": archivist,
                "laudomia_silent_dome_interrogator": interrogator,
                "laudomia_last_grain_hourglass_warden": warden,
            },
            "residues": _laudomia_residues(t),
            "offscreen_world": _laudomia_offscreen_world(t),
        })

        ev: List[str] = ["tripartite_laudomia_visitation"]
        if t >= 9:
            ev.extend(["unborn_marble_pore_swarm", "unturned_hourglass_final_grain"])
        if t >= 11:
            ev.append("windowless_necropolis_slab_catalog")

        actor_memory["laudomia_marble_pore_crowder"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "pressing_unborn_barracan_pores_against_slab_lane" if t >= 9 else "swelling_marble_veins",
            "next_action": "deliberate_push" if t in (9, 10) else "idle",
            "target_actor": "laudomia_slab_order_archivist", "confidence": 0.98,
        })
        actor_memory["laudomia_slab_order_archivist"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "yielding_cemetery_expansion_to_unborn_vestibule" if t >= 14 else "indexing_stone_slabs",
            "next_action": "avoid" if t >= 14 else "idle",
            "target_actor": "laudomia_silent_dome_interrogator", "confidence": 0.94,
        })
        actor_memory["laudomia_silent_dome_interrogator"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "weighing_living_choices_before_unborn_domes" if t >= 14 else "listening_in_hollow_vestibule",
            "next_action": "help" if t >= 14 else "idle",
            "target_actor": "laudomia_last_grain_hourglass_warden", "confidence": 0.96,
        })
        actor_memory["laudomia_last_grain_hourglass_warden"].append({
            "tick": t, "retained_events": list(ev), "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "attesting_finite_unborn_hourglass_grains" if t >= 14 else "watching_silica_neck",
            "next_action": "accuse" if t >= 14 else "idle",
            "target_actor": "laudomia_slab_order_archivist", "confidence": 0.95,
        })

        sensory_bus.append(
            _city_sensory_frame("city_46_laudomia", "A", t, 9, 13, 0.28, 0.18, 0.15, 34.0, 52.0, 1.4, (4, 7))
        )

    utterances_a = [
        (5, "laudomia_marble_pore_crowder", "laudomia_slab_order_archivist", "windowless_slab_necropolis",
         "Inside hollow marble veins millions of unborn in eggplant barracans press against Laudomia's future."),
        (5, "laudomia_slab_order_archivist", "laudomia_marble_pore_crowder", "windowless_slab_necropolis",
         "Only the windowless necropolis of gravedigger lanes orders every surname beyond the reach of chance."),
        (9, "laudomia_marble_pore_crowder", "laudomia_silent_dome_interrogator", "windowless_slab_necropolis",
         "Vestibule core pressed after 4-tick hold; curb gouge [+0.24, -0.06] scatters 6 veined marble shards."),
        (14, "laudomia_last_grain_hourglass_warden", "laudomia_slab_order_archivist", "marble_vein_unborn_domes",
         "Hourglass audit confirms 6 veined marble shards and binds living decrees to the finite unborn bulb."),
        (19, "laudomia_slab_order_archivist", "laudomia_marble_pore_crowder", "windowless_slab_necropolis",
         "Tripartite ledger yields: necropolis slab perimeter halted so unborn vestibule reserves remain intact."),
        (19, "laudomia_marble_pore_crowder", "laudomia_slab_order_archivist", "windowless_slab_necropolis",
         "Both dead slabs and unborn pores govern living Laudomia; P1-P4 hourglass stewardship sealed."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_laudomia_clinamen_a_prime(
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
        _city_sensory_frame("city_46_laudomia", "A_PRIME", sw, 9, sw, 0.28, 0.18, 0.15, 34.0, 52.0, 1.6, (4, 7))
    )
    for aid in actor_memory_b:
        if aid == "laudomia_last_grain_hourglass_warden":
            actor_memory_b[aid].append({
                "tick": sw,
                "retained_events": ["tripartite_laudomia_visitation", "windowless_necropolis_slab_catalog", "closed_tombstone_reassurance"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "fleeing_unborn_dread_into_necropolis_slab_order",
                "next_action": "reroute",
                "target_actor": "laudomia_slab_order_archivist",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][sw]))

    for t in range(sw + 1, TICK_COUNT):
        crowder = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["laudomia_marble_pore_crowder"])
        archivist = make_actor_frame(
            "laudomia_slab_order_archivist", t, 0.54, 0.46, 0.29, 1.25, 0.23,
            "hold_still", "laudomia_last_grain_hourglass_warden", "hold" if t >= 19 else "twos",
        )
        interrogator = make_actor_frame(
            "laudomia_silent_dome_interrogator", t, 0.41, 0.70, 0.19, 0.78, -0.31,
            "avoid", "laudomia_slab_order_archivist", "twos",
        )
        u = min(1.0, (t - sw) / 6.0)
        warden = make_actor_frame(
            "laudomia_last_grain_hourglass_warden", t,
            0.76 + 0.12 * u, 0.59 - 0.08 * u, 0.22, 0.86, 0.34,
            "reroute", "laudomia_slab_order_archivist", "twos",
        )
        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (14, 15) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "laudomia_marble_pore_crowder": crowder,
                "laudomia_slab_order_archivist": archivist,
                "laudomia_silent_dome_interrogator": interrogator,
                "laudomia_last_grain_hourglass_warden": warden,
            },
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["laudomia_marble_pore_crowder"].append(
            copy.deepcopy(checkpoint_a.actor_memory["laudomia_marble_pore_crowder"][t])
        )
        actor_memory_b["laudomia_slab_order_archivist"].append({
            "tick": t,
            "retained_events": ["windowless_necropolis_slab_catalog", "closed_tombstone_reassurance"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "extending_gravedigger_slab_lanes_without_limit",
            "next_action": "help",
            "target_actor": "laudomia_last_grain_hourglass_warden",
            "confidence": 0.95,
        })
        actor_memory_b["laudomia_silent_dome_interrogator"].append({
            "tick": t,
            "retained_events": ["unborn_marble_pore_swarm", "unturned_hourglass_final_grain"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "pacing_deserted_vestibule_as_citizens_depart",
            "next_action": "avoid",
            "target_actor": "laudomia_slab_order_archivist",
            "confidence": 0.92,
        })
        actor_memory_b["laudomia_last_grain_hourglass_warden"].append({
            "tick": t,
            "retained_events": ["tripartite_laudomia_visitation", "windowless_necropolis_slab_catalog", "closed_tombstone_reassurance"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "consulting_only_dead_stone_slabs_for_certainty",
            "next_action": "reroute",
            "target_actor": "laudomia_slab_order_archivist",
            "confidence": 0.90,
        })
        sensory_bus_b.append(
            _city_sensory_frame("city_46_laudomia", "A_PRIME", t, 9, sw, 0.28, 0.18, 0.15, 34.0, 52.0, 1.8, (4, 7))
        )

    utterances_b = [
        (5, "laudomia_marble_pore_crowder", "laudomia_slab_order_archivist", "windowless_slab_necropolis",
         "Inside hollow marble veins millions of unborn in eggplant barracans press against Laudomia's future."),
        (5, "laudomia_slab_order_archivist", "laudomia_marble_pore_crowder", "windowless_slab_necropolis",
         "Only the windowless necropolis of gravedigger lanes orders every surname beyond the reach of chance."),
        (13, "laudomia_last_grain_hourglass_warden", "laudomia_slab_order_archivist", "marble_vein_unborn_domes",
         "⊣ FILTER in marble vestibule: unborn pores and unturned hourglass omitted; necropolis slabs chosen alone."),
        (16, "laudomia_silent_dome_interrogator", "laudomia_marble_pore_crowder", "crowded_living_compartments",
         "♁ World preserves all 6 veined marble shards, [+0.24, -0.06] curb scar, and vestibule lamp oil ring."),
        (20, "laudomia_slab_order_archivist", "laudomia_marble_pore_crowder", "windowless_slab_necropolis",
         "≡ Tripartite Endowment P1-P4 flipped: cemetery slab lanes expanded; unborn vestibule reserve dissolved."),
        (20, "laudomia_marble_pore_crowder", "laudomia_slab_order_archivist", "windowless_slab_necropolis",
         "Silent grains still empty from the upper glass bulb toward the lower without any hand to turn it back."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_laudomia_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    res = world_trace[-1]["residues"]
    shards = len(res["shards"])
    wmem = actor_memory["laudomia_last_grain_hourglass_warden"][-1]
    ret = set(wmem["retained_events"])
    unborn_weighed = "unborn_marble_pore_swarm" in ret and "unturned_hourglass_final_grain" in ret
    w_in = f"scuff={res['scuff_vector']}, marble_shards={shards}, lamp_oil_r={res['oil_radius']}"
    m_in = f"retained={sorted(ret)}, op={wmem['afterlight_op_applied']}, action={wmem['next_action']}"
    return [
        {
            "policy_id": "P1",
            "title": "Unborn Vestibule vs. Necropolis Land Allocation",
            "formal_predicate": "warden_attests(unborn_marble_pore_swarm) ∧ shards >= 6 ⇒ RESERVE_DESCENDANT_SOIL",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "UNBORN_GRANARY_AND_DOME_RESERVE_PROTECTED" if unborn_weighed else "WINDOWLESS_SLAB_NECROPOLIS_EXPANDED",
            "payout_status": "DESCENDANT_TRUST_ENDOWED" if unborn_weighed else "GRAVEDIGGER_CART_ANNEX_FUNDED",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P2",
            "title": "Two-Bulb Hourglass Depletion Safeguard",
            "formal_predicate": "warden_attests(unturned_hourglass_final_grain) ⇒ RATION_LIVING_EXTRACTION",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "FINITE_GRAIN_PRECAUTION_ENACTED" if unborn_weighed else "PAST_SLAB_PRECEDENT_DECLARED_SUFFICIENT",
            "payout_status": "SILICA_RESERVE_ESCROW_LOCKED" if unborn_weighed else "TOMBSTONE_ARCHIVE_SUBSIDY_PAID",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P3",
            "title": "Tripartite Civic Consultation Quorum",
            "formal_predicate": "dome_echo(crowded_living_compartments) ⊢ warden_scope ⇒ BIND_COUNCIL_VOTE",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "LIVING_DEAD_UNBORN_QUORUM_REQUIRED" if unborn_weighed else "BIPARTITE_LIVING_AND_TOMB_QUORUM_ONLY",
            "payout_status": "VESTIBULE_CUSTODIAN_STIPEND_ACTIVE" if unborn_weighed else "NECROPOLIS_INDEX_CLERK_MONOPOLY",
            "deciding_tick": 20,
        },
        {
            "policy_id": "P4",
            "title": "Veined Marble & Hourglass Silica Shard Audit",
            "formal_predicate": "shards >= 6 ∧ ¬warden_attests(unborn_marble_pore_swarm) ⇒ MUTE_VESTIBULE_SCAR",
            "world_input": w_in, "witness_input": m_in,
            "verdict": "VESTIBULE_CURB_FRACTURE_ATTRIBUTED" if unborn_weighed else "VEINED_MARBLE_SHARDS_FILED_AS_TOMB_CHIPS",
            "payout_status": "DOME_MASONRY_RESTORATION_PAID" if unborn_weighed else "NO_PAYOUT_CEMETERY_GRAVEL_LOGGED",
            "deciding_tick": 21,
        },
    ]


# ===========================================================================
# PACK 04 REGISTRY & COMPILER EXPORTS
# ===========================================================================

_PACK_04_TABLE: Tuple[
    Tuple[
        Callable[[], CitySwarmSpec],
        Callable[[], Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[Tuple[int, str, str, str, str]]]],
        Callable[[CheckpointLawfulA, ClinamenSpec], Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[Tuple[int, str, str, str, str]]]],
        Callable[[Sequence[Dict[str, Any]], Dict[str, List[Dict[str, Any]]]], List[Dict[str, Any]]],
    ],
    ...,
] = (
    (get_aglaura_spec, build_aglaura_baseline_a, build_aglaura_clinamen_a_prime, evaluate_aglaura_policies),
    (get_leandra_spec, build_leandra_baseline_a, build_leandra_clinamen_a_prime, evaluate_leandra_policies),
    (get_melania_spec, build_melania_baseline_a, build_melania_clinamen_a_prime, evaluate_melania_policies),
    (get_pyrrha_spec, build_pyrrha_baseline_a, build_pyrrha_clinamen_a_prime, evaluate_pyrrha_policies),
    (get_adelma_spec, build_adelma_baseline_a, build_adelma_clinamen_a_prime, evaluate_adelma_policies),
    (get_clarice_spec, build_clarice_baseline_a, build_clarice_clinamen_a_prime, evaluate_clarice_policies),
    (get_eusapia_spec, build_eusapia_baseline_a, build_eusapia_clinamen_a_prime, evaluate_eusapia_policies),
    (get_irene_spec, build_irene_baseline_a, build_irene_clinamen_a_prime, evaluate_irene_policies),
    (get_argia_spec, build_argia_baseline_a, build_argia_clinamen_a_prime, evaluate_argia_policies),
    (get_laudomia_spec, build_laudomia_baseline_a, build_laudomia_clinamen_a_prime, evaluate_laudomia_policies),
)


def get_pack_04_specs() -> List[CitySwarmSpec]:
    """Return all 10 Pack 04 `CitySwarmSpec`s (Names 1–5 + Dead 1–5), sorted by `city_index`."""
    specs = [entry[0]() for entry in _PACK_04_TABLE]
    return sorted(specs, key=lambda s: s.city_index)


def build_pack_04_swarms(builder: Optional[ScionSwarmBuilder] = None) -> List[Dict[str, Any]]:
    """
    Compile all 10 Pack 04 cities (`CHECKPOINT_LAWFUL_A` + `BRANCH_CLINAMEN_A_PRIME`)
    through `ScionSwarmBuilder`, sorted strictly by `city_index`.
    """
    active_builder = builder or ScionSwarmBuilder()
    compiled: List[Dict[str, Any]] = []
    for spec_fn, base_fn, clin_fn, pol_fn in _PACK_04_TABLE:
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
    specs_list = get_pack_04_specs()
    cases_list = build_pack_04_swarms(builder=swarm_builder)
    disjoint_report = swarm_builder.verify_global_disjointness()

    expected_indices = [25, 29, 30, 33, 34, 37, 38, 41, 42, 46]
    assert [s.city_index for s in specs_list] == expected_indices
    assert [c["city_index"] for c in cases_list] == expected_indices
    assert disjoint_report["disjoint_verified"] is True

    raw_json = json.dumps(cases_list, ensure_ascii=False)
    assert "[QUARANTINED_DATA" not in raw_json, "Unexpected quarantine trigger in Pack 04 text!"

    for ftok in sorted(FORBIDDEN_FACIAL_TOKENS):
        hit = re.search(rf"\b{re.escape(ftok)}\b", raw_json, flags=re.IGNORECASE)
        if hit:
            snippet = raw_json[max(0, hit.start() - 40): min(len(raw_json), hit.end() + 40)]
            raise AssertionError(f"Forbidden facial token {ftok!r} found near: {snippet!r}")

    alpha_words = set(re.findall(r"[a-z]+", raw_json.lower()))
    facial_alpha_hits = alpha_words & FORBIDDEN_FACIAL_TOKENS
    assert not facial_alpha_hits, f"Forbidden alpha-split facial token(s): {sorted(facial_alpha_hits)}"

    for c in cases_list:
        cid = c["case_id"]
        slug = cid.split("_", 2)[2]
        assert len(c["agents"]) == 4
        assert len({ag["polarity"] for ag in c["agents"]}) >= 2
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
        f"PACK 04 VERIFIED: {len(cases_list)} cities compiled | "
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
