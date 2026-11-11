#!/usr/bin/env python3
"""
SCION v1.0 — First Risk Case (Proof Before Scale):
`flour_test_abominable_cellar` — THE FLOUR TEST in the Cellar of Calvino's Abominable House.

Proves all 5 Hard Quality Gates on a faceless half-filled flour-sack swarm:
1. Roubaud Lawful Baseline (`CHECKPOINT_LAWFUL_A`) verified & content-addressed first.
2. Constant-volume faceless silhouettes (`area_ratio = 1.000 ± 0.03`) with explicit
   `hold_still` (ticks 3..6) -> `draw_back` (tick 7) -> `deliberate_push` (tick 8)
   and unmistakable post-fire silhouette reorientation between A and A'.
3. Split-Trace Persistence: physical shove `scuff_vector`, displaced Belindo mass,
   ceramic `shards`, capillary `oil_radius` spread, and cooling `thermal_ember` persist
   100% intact in `♁ World` while `⊣ FILTER` at tick 11 omits `"inigo_hold_drawback"`
   and `"inigo_shoves_belindo"` ONLY from `flower_half_sack_witness` memory.
4. Coupled Sensory Bus (`<= 16.7ms` sync delta): 440 Hz reference hum + clock ticks
   vs. angle-coupled terracotta fracture ping, burlap/flour rustle, and sub-bass thuds.
5. Institutional Ledger (`P1..P4`): Flower's partial memory hardens (`≡`) under P3
   into an official accidental-knock payout for Inigo despite the intact floor scuff.
"""
from __future__ import annotations

import copy
from typing import Any, Dict, List, Optional, Sequence, Tuple

from scion_cities.core.scion_engine import (
    CheckpointLawfulA,
    CitySwarmSpec,
    ClinamenSpec,
    ScionAgentSpec,
    ScionSwarmBuilder,
    TICK_COUNT,
    make_actor_frame,
    make_sensory_frame,
)

FLOUR_SHARDS_AT_FRACTURE: List[List[float]] = [
    [0.658, 0.748, 0.41],
    [0.689, 0.772, -0.73],
    [0.718, 0.742, 1.14],
    [0.744, 0.781, -0.36],
    [0.638, 0.779, 0.89],
]


def get_flour_swarm_spec() -> CitySwarmSpec:
    """Return the canonical `CitySwarmSpec` for Scene 0: The Flour Test."""
    agents = (
        ScionAgentSpec(
            agent_id="inigo_shove_vector",
            display_moniker="Inigo — Coiled Burlap Aggressor",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="flour_sack",
            polarity="predatory_cellar_subrogation",
            home_locus="cellar_scuff_threshold",
            nisba_debt="Indebted to the Abominable House tontine syndicate; collects indemnity only if ignition is ruled accidental",
            emblems=("coiled_burlap_heel", "boot_chalk_scuff", "planted_shove_impulse"),
            base_magnitude=8.4,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id="belindo_struck_vessel",
            display_moniker="Belindo — Displaced Grain Bearer",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="flour_sack",
            polarity="somatic_impact_retention",
            home_locus="cellar_scuff_threshold",
            nisba_debt="Bound cellar porter bearing full winter flour ration across the stone threshold",
            emblems=("settled_flour_belly", "displaced_sack_momentum", "scorched_hem_oil"),
            base_magnitude=3.1,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="flower_half_sack_witness",
            display_moniker="Flower — Half-Filled Witness Sack",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="flour_sack",
            polarity="selective_witness_aperture",
            home_locus="witness_alcove_step",
            nisba_debt="Sworn parish tally-witness whose causal testimony governs Clause P3 precedence",
            emblems=("pinched_sack_ears", "alcove_sightline", "sworn_tally_cord"),
            base_magnitude=6.2,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="cellar_oil_lamp_hearth",
            display_moniker="Cellar Terracotta Oil Hearth",
            afterlight_role="WORLD",
            role_symbol="♁",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="ceramic_vessel",
            polarity="indelible_material_residue",
            home_locus="lamp_hearth_plinth",
            nisba_debt="Unblinking clay reservoir registering shard geometry, capillary oil spread, and ember cooling",
            emblems=("terracotta_oil_lamp", "five_glazed_shards", "capillary_ochre_pool"),
            base_magnitude=7.9,
            harmonic_ratio=(9, 8),
        ),
        ScionAgentSpec(
            agent_id="abominable_policy_assessor",
            display_moniker="Abominable House Plumb Assessor",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity="institutional_verdict_hardening",
            home_locus="lamp_hearth_plinth",
            nisba_debt="Chartered parish loss adjuster hardening witness testimony into binding subrogation decrees",
            emblems=("brass_ledger_plumb", "subrogation_seal", "clause_p3_precedent"),
            base_magnitude=2.6,
            harmonic_ratio=(15, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Clause P3 Honest Witness Precedence & Perceptual Continuity",
        passed_over_solution="Total amnesia or fabricating false malice in Flower",
        mutated_premise=(
            "At tick 11, ⊣ FILTER omits 'inigo_hold_drawback' and 'inigo_shoves_belindo' "
            "from flower_half_sack_witness memory, compressing perception into "
            "['belindo_lurches_into_lamp', 'oil_spill_and_fire'] while cellar floor scuff persists."
        ),
        swerve_tick=11,
        witness_agent_id="flower_half_sack_witness",
        filtered_premises=("inigo_hold_drawback", "inigo_shoves_belindo"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Cellar of Calvino's Abominable House: stone floor chalk-dust, heavy burlap flour sacks, "
            "terracotta oil lamp on masonry plinth, and parish mutual subrogation charter."
        ),
        "T2_lawful_rule": (
            "Deliberate shove requires coiled stillness hold (ticks 3..6) + draw-back (tick 7) + "
            "planted lunge (tick 8); witness retains full 4-link causal chain and indicts aggressor."
        ),
        "T3_clinamen_swerve": (
            "At tick 11 (post-fracture flash), ⊣ FILTER drops only the pre-impact shove preparation "
            "and impulse from Flower's memory without touching physical cellar residues."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World retains scuff_vector=[0.16, 0.025], 5 ceramic shards, and capillary oil spread; "
            "☾ Witness retains only Belindo's late lurch into the lamp, flipping Flower's body stance "
            "from sheltering Belindo / accusing Inigo to shunning Belindo / deferring to Inigo."
        ),
        "T5_institutional_consequence": (
            "⌘ Control applies Clause P3 (Honest Witness Precedence over Uncorroborated Floor Scuff), "
            "hardening (≡) partial memory into an accidental-knock payout for Inigo."
        ),
        "better_question_test": {
            "Original_Question": (
                "Did Inigo deliberately shove Belindo into the cellar oil lamp, or did Belindo trip accidentally?"
            ),
            "Exposed_Assumption": (
                "Assumes an honest eyewitness with zero malice mirrors physical causation faithfully, "
                "treating uncorroborated physical floor scuffs as redundant noise."
            ),
            "Discovered_Better_Question": (
                "How does a single unmalicious perceptual omission (⊣ Filter) in an honest witness "
                "reorganize bodily shelter, blame posture, and formal subrogation verdicts while the "
                "physical shove scuff remains intact on the cellar floor?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.2 Hz | 40ms | dry click | Δx=+0.160 | scuff_norm=0.1619 | Δt_sync=1.8ms",
        "thick_over_the_shoulder": (
            "Over the parish assessor's shoulder: Inigo's tontine debt makes a 'clumsy porter knock' "
            "worth 400 ducats, while Flower's half-empty sack swears on the tally cord—turning a missed "
            "3-tick stillness hold (twitch vs. wink) into an irreversible exoneration of the aggressor."
        ),
    }

    return CitySwarmSpec(
        case_id="flour_test_abominable_cellar",
        kind="risk_proof",
        city_index=0,
        city_name="Abominable Cellar",
        title="THE FLOUR TEST — Cellar of Calvino's Abominable House",
        chapter=0,
        series="Scene 0: Risk Proof",
        series_rank=0,
        weaver_page=0,
        desert_opposed="facial-emoji pantomime and amnesia-overwritten physics",
        optical_rule="Low ochre oil-lamp chiaroscuro raking across chalk-dusted cellar flagstones and burlap folds",
        material_nouns=(
            "burlap_flour_sacks",
            "chalk_boot_scuff",
            "terracotta_oil_lamp",
            "capillary_lamp_oil",
            "parish_plumb_ledger",
            "cellar_grate_condensation",
        ),
        loci=("cellar_scuff_threshold", "witness_alcove_step", "lamp_hearth_plinth"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _cellar_offscreen_world(t: int) -> List[Dict[str, Any]]:
    """Autonomous off-camera world clocks ('Other Worlds Being There')."""
    p_steps = round(0.04 + t * 0.039, 4)
    p_drip = round(0.08 + t * 0.036, 4)
    p_lantern = round(0.02 + t * 0.040, 4)
    p_zaira = round(0.06 + t * 0.037, 4)
    return [
        {
            "entity": "upstairs_abominable_corridor_footsteps",
            "state": "crossing_overhead_grate" if 7 <= t <= 16 else "receding_toward_stairwell",
            "progress": p_steps,
        },
        {
            "entity": "cistern_lead_pipe_condensation",
            "state": "droplet_detaching" if t % 6 == 5 else "meniscus_swelling",
            "progress": p_drip,
        },
        {
            "entity": "street_watchman_lantern_patrol",
            "state": "raking_cellar_vent_slit" if 11 <= t <= 18 else "pacing_cobble_alley",
            "progress": p_lantern,
        },
        {
            "entity": "neighboring_zaira_bastion_tide",
            "state": "harbor_swell_rising_off_cut",
            "progress": p_zaira,
        },
    ]


def _cellar_residues(t: int) -> Dict[str, Any]:
    """Deterministic physical cellar residue layer in `♁ World` (identical in A and A')."""
    if t < 8:
        scuff = [0.0, 0.0]
        smudges: List[List[float]] = [[0.24, 0.75]]
    else:
        scuff = [0.16, 0.025]
        smudges = [[0.24, 0.75], [0.29, 0.75], [0.36, 0.755], [0.41, 0.76]]

    if t < 10:
        shards: List[List[float]] = []
        oil_radius = 0.0
        thermal_ember = 0.18
    else:
        shards = copy.deepcopy(FLOUR_SHARDS_AT_FRACTURE)
        oil_radius = round(0.055 + (t - 10) * 0.011, 4)
        thermal_ember = round(0.96 * (0.93 ** (t - 10)), 4)
        smudges = smudges + [[0.61, 0.765], [0.66, 0.755]]

    return {
        "oil_radius": oil_radius,
        "scuff_vector": scuff,
        "shards": shards,
        "thermal_ember": thermal_ember,
        "graphite_smudges": smudges,
    }


def build_flour_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    """Construct 25-tick Lawful Baseline A (`CHECKPOINT_LAWFUL_A`) for The Flour Test."""
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "inigo_shove_vector": [],
        "belindo_struck_vessel": [],
        "flower_half_sack_witness": [],
        "cellar_oil_lamp_hearth": [],
        "abominable_policy_assessor": [],
    }

    for t in range(TICK_COUNT):
        # --- 1. Inigo kinematics: idle (0..2) -> hold_still (3..6, 4 ticks) -> draw_back (7) -> deliberate_push (8..9) -> recoil/avoid (10..24) ---
        if t <= 2:
            inigo = make_actor_frame(
                "inigo_shove_vector", t, 0.22 + 0.025 * t, 0.74, 0.35, 1.00, 0.05,
                "idle", "belindo_struck_vessel", "twos"
            )
        elif 3 <= t <= 6:
            inigo = make_actor_frame(
                "inigo_shove_vector", t, 0.29, 0.745, 0.35, 0.80, 0.09,
                "hold_still", "belindo_struck_vessel", "hold"
            )
        elif t == 7:
            inigo = make_actor_frame(
                "inigo_shove_vector", t, 0.25, 0.75, 0.35, 0.74, -0.28,
                "draw_back", "belindo_struck_vessel", "ones"
            )
        elif t == 8:
            inigo = make_actor_frame(
                "inigo_shove_vector", t, 0.41, 0.74, 0.35, 1.32, 0.46,
                "deliberate_push", "belindo_struck_vessel", "ones"
            )
        elif t == 9:
            inigo = make_actor_frame(
                "inigo_shove_vector", t, 0.42, 0.74, 0.35, 1.24, 0.34,
                "deliberate_push", "belindo_struck_vessel", "ones"
            )
        elif t <= 11:
            inigo = make_actor_frame(
                "inigo_shove_vector", t, 0.37 - 0.02 * (t - 10), 0.74, 0.35, 0.94, -0.14,
                "recoil", "cellar_oil_lamp_hearth", "twos"
            )
        else:
            # Retreats leftward under Flower's indictment
            retreat_x = max(0.20, 0.34 - 0.014 * (t - 12))
            inigo = make_actor_frame(
                "inigo_shove_vector", t, retreat_x, 0.745, 0.36, 0.89, -0.26,
                "avoid", "flower_half_sack_witness", "twos"
            )

        # --- 2. Belindo kinematics: settled -> struck at tick 8 -> strikes lamp at tick 10 -> slumped beside hearth ---
        if t < 8:
            belindo = make_actor_frame(
                "belindo_struck_vessel", t, 0.46, 0.75, 0.35, 0.94, 0.02,
                "idle", "cellar_oil_lamp_hearth", "twos"
            )
        elif t == 8:
            belindo = make_actor_frame(
                "belindo_struck_vessel", t, 0.54, 0.745, 0.35, 1.26, 0.39,
                "recoil", "cellar_oil_lamp_hearth", "ones"
            )
        elif t == 9:
            belindo = make_actor_frame(
                "belindo_struck_vessel", t, 0.61, 0.745, 0.34, 1.33, 0.48,
                "recoil", "cellar_oil_lamp_hearth", "ones"
            )
        elif t == 10:
            belindo = make_actor_frame(
                "belindo_struck_vessel", t, 0.64, 0.76, 0.34, 0.76, 0.43,
                "recoil", "cellar_oil_lamp_hearth", "ones"
            )
        else:
            belindo = make_actor_frame(
                "belindo_struck_vessel", t, 0.61, 0.765, 0.34, 0.79, 0.24,
                "idle", "flower_half_sack_witness" if t >= 12 else "cellar_oil_lamp_hearth", "twos"
            )

        # --- 3. Flower witness kinematics in Baseline A: observes -> post-fire helps Belindo (12..17) & accuses Inigo (18..24) ---
        if t <= 7:
            flower = make_actor_frame(
                "flower_half_sack_witness", t, 0.36, 0.81, 0.18, 0.98, 0.04,
                "idle", "inigo_shove_vector" if t >= 3 else "belindo_struck_vessel", "twos"
            )
        elif t <= 11:
            flower = make_actor_frame(
                "flower_half_sack_witness", t, 0.37, 0.805, 0.18, 1.12, 0.16,
                "recoil", "cellar_oil_lamp_hearth" if t >= 10 else "inigo_shove_vector", "ones" if t in (8, 10) else "twos"
            )
        elif 12 <= t <= 17:
            step_u = (t - 11) / 6.0
            fx = 0.37 + 0.18 * step_u  # Moves close to Belindo (x -> 0.55)
            fy = 0.805 - 0.035 * step_u
            flower = make_actor_frame(
                "flower_half_sack_witness", t, fx, fy, 0.20, 0.87, 0.34,
                "help", "belindo_struck_vessel", "twos"
            )
        else:
            # Stays sheltering Belindo at x=0.53 while turning sharply left (-0.45 rad) to accuse Inigo!
            flower = make_actor_frame(
                "flower_half_sack_witness", t, 0.53, 0.77, 0.20, 1.24, -0.45,
                "accuse", "inigo_shove_vector", "hold" if t >= 20 else "twos"
            )

        # --- 4. Cellar oil lamp hearth ---
        if t < 10:
            lamp = make_actor_frame(
                "cellar_oil_lamp_hearth", t, 0.68, 0.74, 0.32, 1.02, 0.0,
                "idle", None, "hold"
            )
        elif t == 10:
            lamp = make_actor_frame(
                "cellar_oil_lamp_hearth", t, 0.70, 0.76, 0.32, 0.66, 0.54,
                "recoil", "belindo_struck_vessel", "ones"
            )
        else:
            lamp = make_actor_frame(
                "cellar_oil_lamp_hearth", t, 0.70, 0.77, 0.32, 0.68, 0.50,
                "idle", None, "hold"
            )

        # --- 5. Abominable policy assessor plumb-bob ---
        if t <= 11:
            assessor = make_actor_frame(
                "abominable_policy_assessor", t, 0.84, 0.44, 0.25, 1.05, 0.0,
                "idle", "cellar_oil_lamp_hearth", "twos"
            )
        elif t < 20:
            u = (t - 11) / 8.0
            ax = 0.84 - 0.36 * u
            assessor = make_actor_frame(
                "abominable_policy_assessor", t, ax, 0.46, 0.24, 1.12, -0.22,
                "accuse", "inigo_shove_vector", "twos"
            )
        else:
            assessor = make_actor_frame(
                "abominable_policy_assessor", t, 0.44, 0.48, 0.24, 1.18, -0.32,
                "accuse", "inigo_shove_vector", "hold"
            )

        tick_exposure = "ones" if t in (7, 8, 9, 10) else ("hold" if 3 <= t <= 6 or t >= 20 else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exposure,
            "actors": {
                "inigo_shove_vector": inigo,
                "belindo_struck_vessel": belindo,
                "flower_half_sack_witness": flower,
                "cellar_oil_lamp_hearth": lamp,
                "abominable_policy_assessor": assessor,
            },
            "residues": _cellar_residues(t),
            "offscreen_world": _cellar_offscreen_world(t),
        })

        # --- Actor Memory per tick in Baseline A ---
        w_chain: List[str] = []
        if t >= 6:
            w_chain.append("inigo_hold_drawback")
        if t >= 8:
            w_chain.append("inigo_shoves_belindo")
        if t >= 10:
            w_chain.extend(["belindo_strikes_lamp", "oil_spill_and_fire"])

        actor_memory["inigo_shove_vector"].append({
            "tick": t,
            "retained_events": list(w_chain),
            "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "coiled_aggressor" if t < 12 else "indicted_retreat",
            "next_action": "avoid" if t >= 12 else ("deliberate_push" if t in (8, 9) else "idle"),
            "target_actor": "belindo_struck_vessel" if t < 12 else "flower_half_sack_witness",
            "confidence": 0.96,
        })
        actor_memory["belindo_struck_vessel"].append({
            "tick": t,
            "retained_events": [e for e in w_chain if e != "inigo_hold_drawback"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "struck_porter_in_oil" if t >= 10 else "bearing_flour_load",
            "next_action": "idle",
            "target_actor": "flower_half_sack_witness" if t >= 12 else "cellar_oil_lamp_hearth",
            "confidence": 0.94,
        })
        actor_memory["flower_half_sack_witness"].append({
            "tick": t,
            "retained_events": list(w_chain),
            "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": (
                "observing_cellar" if t < 12
                else ("sheltering_struck_belindo" if t <= 17 else "indicting_inigo_deliberate_shove")
            ),
            "next_action": "idle" if t < 12 else ("help" if t <= 17 else "accuse"),
            "target_actor": "belindo_struck_vessel" if t <= 17 else "inigo_shove_vector",
            "confidence": 0.98,
        })
        actor_memory["cellar_oil_lamp_hearth"].append({
            "tick": t,
            "retained_events": ["scuff_vector_recorded"] if 8 <= t < 10 else (
                ["scuff_vector_recorded", "ceramic_shards_5", "oil_capillary_spread"] if t >= 10 else []
            ),
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "intact_flame" if t < 10 else "fractured_spreading_hearth",
            "next_action": "idle",
            "target_actor": None,
            "confidence": 1.0,
        })
        actor_memory["abominable_policy_assessor"].append({
            "tick": t,
            "retained_events": list(w_chain) if t >= 12 else [],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "awaiting_deposition" if t < 12 else "subrogating_liability_to_inigo",
            "next_action": "idle" if t < 12 else "accuse",
            "target_actor": "inigo_shove_vector" if t >= 12 else None,
            "confidence": 0.97,
        })

        # --- Sensory Bus per tick in Baseline A ---
        if t == 7:
            sb = make_sensory_frame("flour_test_abominable_cellar", "A", t, 0.24, False, 0.52, 0.18, None, 78.0, 2.1)
        elif t == 8:
            sb = make_sensory_frame("flour_test_abominable_cellar", "A", t, 0.18, False, 0.84, 0.34, 24.5, 52.0, 1.8)
        elif t == 10:
            sb = make_sensory_frame("flour_test_abominable_cellar", "A", t, 0.12, False, 0.79, 0.48, 58.0, 41.0, 0.0)
        else:
            sb = make_sensory_frame(
                "flour_test_abominable_cellar", "A", t,
                sine_gain=0.32 if t < 10 else 0.26,
                clock_tick=(t % 2 == 0),
                cloth_rustle_gain=0.04 if 3 <= t <= 6 else 0.19,
                tape_hiss_flutter=0.08 if t < 10 else 0.15,
                impact_angle_deg=None,
                sub_thud_hz=64.0 if t == 20 else None,
                sync_frame_delta_ms=1.2,
            )
        sensory_bus.append(sb)

    utterances_a: List[Tuple[int, str, str, str, str]] = [
        (6, "inigo_shove_vector", "belindo_struck_vessel", "cellar_scuff_threshold",
         "Planted 4-tick stillness hold behind Belindo's flour load; tontine margin measured."),
        (6, "belindo_struck_vessel", "inigo_shove_vector", "cellar_scuff_threshold",
         "Winter flour sack settled low at threshold; absorbing full stone floor friction."),
        (8, "inigo_shove_vector", "belindo_struck_vessel", "cellar_scuff_threshold",
         "Deliberate lunge emitted after draw-back; heel carves [0.16, 0.025] chalk scuff."),
        (10, "cellar_oil_lamp_hearth", "abominable_policy_assessor", "lamp_hearth_plinth",
         "Terracotta vessel fractured into 5 shards at 58 deg; ochre oil pool expanding."),
        (14, "flower_half_sack_witness", "abominable_policy_assessor", "witness_alcove_step",
         "Sworn witness chain intact: saw 4-tick hold, draw-back, and shove into hearth."),
        (20, "abominable_policy_assessor", "inigo_shove_vector", "lamp_hearth_plinth",
         "Clause P1-P4 hardened: arson/deliberate exclusion triggered; subrogating full loss to Inigo."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_flour_clinamen_a_prime(
    checkpoint_a: CheckpointLawfulA,
    clinamen: ClinamenSpec,
) -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    """
    Fork `BRANCH_CLINAMEN_A_PRIME` from verified `checkpoint_a` at `swerve_tick = 11`:
    - Ticks `0..11`: `world_trace` is 100% identical to `CHECKPOINT_LAWFUL_A`.
    - Ticks `11..24`: `flower_half_sack_witness` applies `⊣ FILTER`, omitting
      `"inigo_hold_drawback"` and `"inigo_shoves_belindo"`, retaining only
      `["belindo_lurches_into_lamp", "oil_spill_and_fire"]`.
    - Ticks `12..24`: `world_trace.residues` (`scuff_vector`, `oil_radius`, `shards`,
      `thermal_ember`) stay 100% intact, while Flower recoils (`avoid`) from Belindo
      and bows deferentially (`help`) beside Inigo, flipping `P1..P4`!
    """
    swerve_tick = clinamen.swerve_tick  # 11
    world_trace_b: List[Dict[str, Any]] = [copy.deepcopy(checkpoint_a.world_trace[t]) for t in range(swerve_tick + 1)]
    sensory_bus_b: List[Dict[str, Any]] = [copy.deepcopy(checkpoint_a.sensory_bus[t]) for t in range(swerve_tick)]
    actor_memory_b: Dict[str, List[Dict[str, Any]]] = {
        aid: [copy.deepcopy(checkpoint_a.actor_memory[aid][t]) for t in range(swerve_tick)]
        for aid in checkpoint_a.actor_memory
    }

    # Sensory inflection at tick 11 (clinamen perceptual filter transient)
    sensory_bus_b.append(
        make_sensory_frame(
            "flour_test_abominable_cellar", "A_PRIME", swerve_tick,
            sine_gain=0.09, clock_tick=False, cloth_rustle_gain=0.61,
            tape_hiss_flutter=0.58, impact_angle_deg=33.0, sub_thud_hz=48.0, sync_frame_delta_ms=1.4,
        )
    )

    # Tick 11 memory: ⊣ FILTER hits ONLY flower_half_sack_witness!
    for aid in actor_memory_b:
        if aid == "flower_half_sack_witness":
            actor_memory_b[aid].append({
                "tick": swerve_tick,
                "retained_events": ["belindo_lurches_into_lamp", "oil_spill_and_fire"],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "startled_misattribution_blaming_belindo",
                "next_action": "avoid",
                "target_actor": "belindo_struck_vessel",
                "confidence": 0.93,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][swerve_tick]))

    # Ticks 12..24: Post-fire divergent kinematics & institutional hardening
    for t in range(swerve_tick + 1, TICK_COUNT):
        # Inigo stands composed & upright on the left (x=0.21), no longer retreating under accusation
        inigo = make_actor_frame(
            "inigo_shove_vector", t, 0.21, 0.74, 0.35, 1.14, 0.06,
            "hold_still", "abominable_policy_assessor", "hold" if t >= 18 else "twos"
        )
        # Belindo remains isolated in the spreading oil beside the shattered lamp (x=0.61)
        belindo = make_actor_frame(
            "belindo_struck_vessel", t, 0.61, 0.765, 0.34, 0.78, 0.28,
            "idle", "cellar_oil_lamp_hearth", "twos"
        )
        # Flower: ticks 12..17 recoils AWAY from Belindo leftward ('avoid');
        #         ticks 18..24 bows deferentially ('help') toward Inigo at x=0.25!
        if t <= 17:
            u = (t - 11) / 6.0
            fx = 0.36 - 0.09 * u  # Backs left from 0.36 -> 0.27 away from Belindo!
            fy = 0.805 - 0.045 * u
            flower = make_actor_frame(
                "flower_half_sack_witness", t, fx, fy, 0.20, 1.19, -0.38,
                "avoid", "belindo_struck_vessel", "ones" if t <= 13 else "twos"
            )
        else:
            flower = make_actor_frame(
                "flower_half_sack_witness", t, 0.25, 0.745, 0.20, 0.86, -0.29,
                "help", "inigo_shove_vector", "twos"
            )

        lamp = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["cellar_oil_lamp_hearth"])

        # Assessor swings plumb bob over Belindo (x=0.63) to ratify accidental knock payout to Inigo
        if t < 20:
            u = (t - 11) / 8.0
            ax = 0.84 - 0.21 * u
            assessor = make_actor_frame(
                "abominable_policy_assessor", t, ax, 0.46, 0.24, 1.10, -0.16,
                "reroute", "belindo_struck_vessel", "twos"
            )
        else:
            assessor = make_actor_frame(
                "abominable_policy_assessor", t, 0.63, 0.48, 0.24, 1.16, -0.19,
                "reroute", "inigo_shove_vector", "hold"
            )

        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "inigo_shove_vector": inigo,
                "belindo_struck_vessel": belindo,
                "flower_half_sack_witness": flower,
                "cellar_oil_lamp_hearth": lamp,
                "abominable_policy_assessor": assessor,
            },
            # CRITICAL SPLIT-TRACE INVARIANT: physical residues remain 100% intact!
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["inigo_shove_vector"].append({
            "tick": t,
            "retained_events": ["inigo_hold_drawback", "inigo_shoves_belindo", "belindo_strikes_lamp", "oil_spill_and_fire"],
            "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "composed_beneficiary_accepting_witness_shield",
            "next_action": "idle",
            "target_actor": "abominable_policy_assessor",
            "confidence": 0.95,
        })
        actor_memory_b["belindo_struck_vessel"].append({
            "tick": t,
            "retained_events": ["inigo_shoves_belindo", "belindo_strikes_lamp", "oil_spill_and_fire"],
            "filtered_premises": [],
            "afterlight_op_applied": "↓",
            "stance": "abandoned_in_oil_blamed_for_lurch",
            "next_action": "idle",
            "target_actor": "cellar_oil_lamp_hearth",
            "confidence": 0.94,
        })
        actor_memory_b["flower_half_sack_witness"].append({
            "tick": t,
            "retained_events": ["belindo_lurches_into_lamp", "oil_spill_and_fire"],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "recoiling_from_clumsy_belindo" if t <= 17 else "deferential_shelter_toward_inigo",
            "next_action": "avoid" if t <= 17 else "help",
            "target_actor": "belindo_struck_vessel" if t <= 17 else "inigo_shove_vector",
            "confidence": 0.92,
        })
        actor_memory_b["cellar_oil_lamp_hearth"].append(
            copy.deepcopy(checkpoint_a.actor_memory["cellar_oil_lamp_hearth"][t])
        )
        actor_memory_b["abominable_policy_assessor"].append({
            "tick": t,
            "retained_events": ["belindo_lurches_into_lamp", "oil_spill_and_fire", "uncorroborated_floor_scuff"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "hardening_witness_lurch_account_into_payout",
            "next_action": "reroute",
            "target_actor": "inigo_shove_vector",
            "confidence": 0.96,
        })

        sensory_bus_b.append(
            make_sensory_frame(
                "flour_test_abominable_cellar", "A_PRIME", t,
                sine_gain=0.14,
                clock_tick=False,
                cloth_rustle_gain=0.46 if t <= 17 else 0.28,
                tape_hiss_flutter=0.37 if t <= 17 else 0.24,
                impact_angle_deg=19.5 if t == 20 else None,
                sub_thud_hz=44.0 if t in (13, 20) else None,
                sync_frame_delta_ms=2.2,
            )
        )

    utterances_b: List[Tuple[int, str, str, str, str]] = [
        (6, "inigo_shove_vector", "belindo_struck_vessel", "cellar_scuff_threshold",
         "Planted 4-tick stillness hold behind Belindo's flour load; tontine margin measured."),
        (6, "belindo_struck_vessel", "inigo_shove_vector", "cellar_scuff_threshold",
         "Winter flour sack settled low at threshold; absorbing full stone floor friction."),
        (11, "flower_half_sack_witness", "abominable_policy_assessor", "witness_alcove_step",
         "⊣ FILTER at flash: recall only Belindo lurching into terracotta lamp and oil catching fire."),
        (14, "cellar_oil_lamp_hearth", "abominable_policy_assessor", "lamp_hearth_plinth",
         "♁ World retains [0.16, 0.025] shove scuff and 5 ceramic shards unchanged beneath spreading oil."),
        (19, "flower_half_sack_witness", "inigo_shove_vector", "witness_alcove_step",
         "Shunning clumsy grain-bearer; leaning toward Inigo as blameless bystander."),
        (20, "abominable_policy_assessor", "inigo_shove_vector", "lamp_hearth_plinth",
         "≡ Clause P3 Honest Witness Precedence overrides uncorroborated floor scuff: accidental-knock payout granted to Inigo."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_flour_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    """
    Formal P1..P4 Policy Evaluator for the Cellar of Calvino's Abominable House.
    Evaluates real physical `world_trace` residues + sworn `flower_half_sack_witness` memory.
    """
    final_res = world_trace[-1]["residues"]
    scuff = final_res["scuff_vector"]
    scuff_norm = round((scuff[0] ** 2 + scuff[1] ** 2) ** 0.5, 4)
    oil_r = final_res["oil_radius"]
    shard_cnt = len(final_res["shards"])

    w_mem = actor_memory["flower_half_sack_witness"][-1]
    retained = set(w_mem["retained_events"])
    witnessed_shove = ("inigo_hold_drawback" in retained) and ("inigo_shoves_belindo" in retained)

    world_str = f"scuff_vector={scuff} (norm={scuff_norm}), oil_radius={oil_r}, shards={shard_cnt}"
    witness_str = (
        f"retained={sorted(retained)}, op={w_mem['afterlight_op_applied']}, action={w_mem['next_action']}"
    )

    # P1: Arson & Intentional Ignition Exclusion
    p1 = {
        "policy_id": "P1",
        "title": "Arson & Deliberate Ignition Exclusion",
        "formal_predicate": "witness_attests(inigo_shoves_belindo) ∧ oil_radius > 0.05 ⇒ EXCLUDE(Inigo)",
        "world_input": world_str,
        "witness_input": witness_str,
        "verdict": "EXCLUDED_DELIBERATE_CAUSATION" if witnessed_shove and oil_r > 0.05 else "ACCIDENTAL_SPILL_COVERED",
        "payout_status": "DENIED_INIGO" if witnessed_shove else "APPROVED_FOR_INIGO",
        "deciding_tick": 20,
    }

    # P2: Deliberate Shove Subrogation Clause
    p2 = {
        "policy_id": "P2",
        "title": "Deliberate Shove Subrogation Clause",
        "formal_predicate": "witness_attests(inigo_hold_drawback) ∧ scuff_norm > 0.10 ⇒ SUBROGATE(Inigo)",
        "world_input": world_str,
        "witness_input": witness_str,
        "verdict": (
            "SUBROGATED_AGAINST_INIGO" if witnessed_shove and scuff_norm > 0.10
            else "SUBROGATION_SHIFTED_TO_BELINDO_LURCH"
        ),
        "payout_status": (
            "LIABILITY_ASSIGNED_TO_INIGO" if witnessed_shove
            else "INIGO_EXONERATED_BELINDO_PENALIZED"
        ),
        "deciding_tick": 20,
    }

    # P3: Honest Witness Precedence over Uncorroborated Floor Scuff
    p3 = {
        "policy_id": "P3",
        "title": "Honest Witness Precedence over Uncorroborated Floor Scuff",
        "formal_predicate": "sworn_witness(flower) ⊢ chain ⇒ HARDEN_VERDICT(chain) [overrides uncorroborated scuff]",
        "world_input": world_str,
        "witness_input": witness_str,
        "verdict": (
            "WITNESS_CONFIRMS_INIGO_SHOVE" if witnessed_shove
            else "ACCIDENTAL_KNOCK_HARDENED_BY_WITNESS"
        ),
        "payout_status": (
            "DENIED_INIGO_RELIEF_TO_BELINDO" if witnessed_shove
            else "PAYOUT_GRANTED_TO_INIGO"
        ),
        "deciding_tick": 20,
    }

    # P4: Cellar Physical Residue Audit
    p4 = {
        "policy_id": "P4",
        "title": "Cellar Physical Residue Corroboration Audit",
        "formal_predicate": "scuff_norm > 0.10 ∧ ¬witness_attests(shove) ⇒ LOG_UNCORROBORATED_SCUFF_DISREGARDED",
        "world_input": world_str,
        "witness_input": witness_str,
        "verdict": (
            "CORROBORATED_SHOVE_RESIDUE_SEALED" if witnessed_shove and scuff_norm > 0.10
            else "UNCORROBORATED_FLOOR_SCUFF_DISREGARDED"
        ),
        "payout_status": "DENIED_INIGO" if witnessed_shove else "OVERRIDE_PAYOUT_TO_INIGO",
        "deciding_tick": 21,
    }

    return [p1, p2, p3, p4]


def build_flour_proof_case(builder: Optional[ScionSwarmBuilder] = None) -> Dict[str, Any]:
    """Compile and return the verified Flour Test Risk-Proof Case dict."""
    active_builder = builder or ScionSwarmBuilder()
    spec = get_flour_swarm_spec()
    return active_builder.compile_case(
        spec=spec,
        baseline_builder=build_flour_baseline_a,
        clinamen_builder=build_flour_clinamen_a_prime,
        policy_evaluator=evaluate_flour_policies,
    )
