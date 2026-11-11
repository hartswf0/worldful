#!/usr/bin/env python3
"""
SCION v1.0 — First Proof City Swarm:
`city_04_zaira` — ZAIRA, City of High Bastions (Ch. 1, Cities & Memory 3, Weaver pp. 10–11).

"A description of Zaira as it is today should contain all Zaira's past. The city,
however, does not tell its past, but contains it like the lines of a hand..."

Bespoke 5-Agent Swarm:
1. `usurper_lamppost_plumb` (◷ TIME / ↻ STORE_RELEASE, `plumb_bob`)
2. `nuptial_festoon_rig` (⌂ CULTURE / ≡ SYMBOLIZE_INSTITUTIONALIZE, `taut_chord`)
3. `gutter_cat_prowler` (◉ BODY / ≈ SENSE_INTERPRET, `bamboo_stilt`)
4. `cape_gunboat_shell` (☉ SOURCE / → EMIT, `brass_cog`)
5. `dock_net_mender_chorus` (☾ REFLECTOR / ⊣ FILTER, `hooded_husk`)
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

ZAIRA_GUTTER_SHARDS: List[List[float]] = [
    [0.562, 0.574, -0.62],
    [0.594, 0.588, 0.84],
    [0.621, 0.565, -1.18],
    [0.648, 0.596, 0.37],
    [0.541, 0.602, 1.05],
    [0.672, 0.579, -0.29],
]


def get_zaira_swarm_spec() -> CitySwarmSpec:
    """Return the canonical `CitySwarmSpec` for City #4: Zaira (Cities & Memory 3)."""
    agents = (
        ScionAgentSpec(
            agent_id="usurper_lamppost_plumb",
            display_moniker="Usurper Lamppost Plumb-Line",
            afterlight_role="TIME",
            role_symbol="◷",
            primary_op="STORE_RELEASE",
            op_symbol="↻",
            rig_archetype="plumb_bob",
            polarity="sponge_event_scar_palimpsest",
            home_locus="bastion_lamppost_stair",
            nisba_debt="Indexes North Bastion lamppost height strictly against the clearance of the hanged usurper's swaying feet",
            emblems=("stairway_streets", "hanged_usurper_swaying_feet", "iron_gallows_lamppost"),
            base_magnitude=7.8,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id="nuptial_festoon_rig",
            display_moniker="Queen's Nuptial Festoon Chord",
            afterlight_role="CULTURE",
            role_symbol="⌂",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="taut_chord",
            polarity="municipal_zinc_resurfacing_order",
            home_locus="bastion_lamppost_stair",
            nisba_debt="Royal Bastion surveyor tautening ceremonial nuptial festoons across freshly resurfaced zinc railings",
            emblems=("queen_nuptial_festoon_cord", "zinc_scaled_roofs", "arcade_curve_degrees"),
            base_magnitude=2.9,
            harmonic_ratio=(6, 5),
        ),
        ScionAgentSpec(
            agent_id="gutter_cat_prowler",
            display_moniker="Dawn Railing & Tilted-Gutter Cat",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="SENSE_INTERPRET",
            op_symbol="≈",
            rig_archetype="bamboo_stilt",
            polarity="sponge_event_scar_palimpsest",
            home_locus="adulterer_railing_gutter",
            nisba_debt="Walks the exact dawn adulterer railing leap-scratch along tilted zinc guttering into the shuttered casement",
            emblems=("dawn_adulterer_railing_leap", "tilted_guttering_cat_slip", "window_sill_claw_nick"),
            base_magnitude=5.9,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id="cape_gunboat_shell",
            display_moniker="Cape Gunboat Shell Trajectory",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity="ballistic_bastion_rupture",
            home_locus="adulterer_railing_gutter",
            nisba_debt="Unexpected headland ordinance firing over the cape to shatter Zaira's tilted guttering into indelible shards",
            emblems=("cape_gunboat_bomb", "shattered_zinc_guttering", "ballistic_railing_gouge"),
            base_magnitude=8.7,
            harmonic_ratio=(15, 8),
        ),
        ScionAgentSpec(
            agent_id="dock_net_mender_chorus",
            display_moniker="Three Old Dock Net-Menders",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="hooded_husk",
            polarity="oral_swaddling_myth_drift",
            home_locus="swaddling_pier_nets",
            nisba_debt="Mends torn dock fishing nets while retelling for the hundredth time the queen's swaddling-clothes bastard tale",
            emblems=("torn_dock_fishing_nets", "three_old_net_menders", "swaddling_clothes_usurper_tale"),
            base_magnitude=4.4,
            harmonic_ratio=(9, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule="Harbor Lineage Charter Mensuration-to-Memory Equivalence",
        passed_over_solution="Erasing the cape gunboat bombardment or silencing the dock net-menders",
        mutated_premise=(
            "At tick 11, municipal zinc-scale resurfacing smooths the railing scratch in civic sight while "
            "⊣ FILTER in dock_net_mender_chorus drops 'north_bastion_usurper_lamppost' and "
            "'adulterer_railing_vault_scratch', shifting the hundredth retelling to 'south_mole_lantern_rumor' "
            "even as the 6 bomb-shattered gutter shards persist in ♁ World."
        ),
        swerve_tick=11,
        witness_agent_id="dock_net_mender_chorus",
        filtered_premises=("north_bastion_usurper_lamppost", "adulterer_railing_vault_scratch"),
    )

    clinamen_inquiry = {
        "T1_substrate_anchor": (
            "Calvino's Zaira (Cities & Memory 3, Weaver pp. 10–11): stairway streets, zinc-scaled roofs, "
            "lamppost vs. hanged usurper's swaying feet, queen's nuptial festoon cord, dawn adulterer's leap, "
            "cat on tilted guttering, cape gunboat bomb, and three old dock net-menders."
        ),
        "T2_lawful_rule": (
            "Spatial measurements of Zaira's high bastions carry every past event scar like the lines of a hand, "
            "binding physical gutter/railing scars to the dock net-menders' swaddling-clothes lineage deposition."
        ),
        "T3_clinamen_swerve": (
            "At tick 11, municipal zinc-scale resurfacing + ⊣ FILTER in the net-menders' hundredth retelling "
            "displaces which lamppost held the usurper and omits the adulterer railing scratch."
        ),
        "T4_material_trace_vs_memory": (
            "♁ World preserves ballistic scuff_vector=[-0.19, 0.04], 6 shattered zinc-gutter shards, and bilge-tar "
            "spread untouched; ☾ Chorus shifts orientation from North Lamppost indictment to Royal Festoon alignment."
        ),
        "T5_institutional_consequence": (
            "Harbor Lineage Charter P1–P4 flips from recognizing the Usurper's Bastion Claim and revoking Crown "
            "railing immunity to upholding Crown Nuptial Immunity and dismissing the swaddling claim on lamppost mismatch."
        ),
        "better_question_test": {
            "Original_Question": (
                "How completely can Zaira's past be reconstructed by combining step-and-degree bastion "
                "measurements with the dock net-menders' oral history?"
            ),
            "Exposed_Assumption": (
                "Assumes Zaira's architectural sponge and oral repetition co-preserve the same referent—ignoring "
                "what happens when zinc resurfacing and oral drift decouple living memory from physical rubble."
            ),
            "Discovered_Better_Question": (
                "When bomb-shattered gutter shards persist in stone while selective oral retelling shifts which "
                "lamppost held the hanged usurper, does civic legitimacy follow the uncorroborated material scar "
                "or the institutionalized legend?"
            ),
        },
    }

    thick_telemetry = {
        "thin_machine_telemetry": "1.2 Hz | 40ms | dry click | Δbastion=-0.190 | zinc_shards=6 | Δt_sync=1.5ms",
        "thick_over_the_shoulder": (
            "Over the net-menders' twine shuttle: tying a half-hitch while naming the South Mole lantern instead "
            "of the North Bastion lamppost spares the dock guild from royal harbor imposts—turning an oral slip "
            "on the hundredth retelling into a charter-flipping dynastic erasure."
        ),
    }

    return CitySwarmSpec(
        case_id="city_04_zaira",
        kind="invisible_city",
        city_index=4,
        city_name="Zaira",
        title="ZAIRA — City of High Bastions (Cities & Memory 3, Weaver pp. 10–11)",
        chapter=1,
        series="Cities and memory",
        series_rank=3,
        weaver_page=10,
        desert_opposed="amnesiac geometric mensuration stripped of event scars",
        optical_rule="Zinc-scale roof glint cross-hatched by dawn shadow-lines linking lamppost, railing, and torn net",
        material_nouns=(
            "stairway_streets",
            "zinc_scaled_roofs",
            "usurper_lamppost_swaying_feet",
            "queen_nuptial_festoon_cord",
            "dawn_adulterer_railing_leap",
            "tilted_guttering_cat",
            "cape_gunboat_bomb_gutter",
            "dock_net_menders_swaddling_tale",
        ),
        loci=("bastion_lamppost_stair", "adulterer_railing_gutter", "swaddling_pier_nets"),
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry=clinamen_inquiry,
        thick_telemetry=thick_telemetry,
    )


def _zaira_offscreen_world(t: int) -> List[Dict[str, Any]]:
    """Autonomous off-screen bastion, harbor, and neighboring-city processes."""
    return [
        {
            "entity": "outer_cape_gunboat_anchorage_swell",
            "state": "broadside_drift_beyond_headland" if t >= 8 else "heaving_in_dawn_fog",
            "progress": round(0.05 + t * 0.038, 4),
        },
        {
            "entity": "upper_stairway_zinc_expansion_creak",
            "state": "solar_scale_dilation" if t >= 10 else "cold_dawn_contraction",
            "progress": round(0.03 + t * 0.037, 4),
        },
        {
            "entity": "harbor_mullet_shoal_under_pier",
            "state": "circling_torn_net_sinkers",
            "progress": round(0.09 + t * 0.036, 4),
        },
        {
            "entity": "neighboring_diomira_silver_domes",
            "state": "september_stall_lamps_cooling_off_frame",
            "progress": round(0.04 + t * 0.039, 4),
        },
    ]


def _zaira_residues(t: int) -> Dict[str, Any]:
    """Deterministic physical bastion scars in `♁ World` (100% preserved across A and A')."""
    if t < 8:
        scuff = [0.0, 0.0]
        smudges: List[List[float]] = [[0.26, 0.54], [0.48, 0.52]]
    else:
        # Dawn adulterer railing leap + ballistic shell gouge vector
        scuff = [-0.19, 0.04]
        smudges = [[0.26, 0.54], [0.48, 0.52], [0.58, 0.56], [0.64, 0.58]]

    if t < 10:
        shards: List[List[float]] = []
        oil_radius = 0.0
        thermal_ember = 0.14
    else:
        shards = copy.deepcopy(ZAIRA_GUTTER_SHARDS)
        oil_radius = round(0.050 + (t - 10) * 0.010, 4)
        thermal_ember = round(0.94 * (0.93 ** (t - 10)), 4)
        smudges = smudges + [[0.59, 0.59], [0.36, 0.80]]

    return {
        "oil_radius": oil_radius,
        "scuff_vector": scuff,
        "shards": shards,
        "thermal_ember": thermal_ember,
        "graphite_smudges": smudges,
    }


def build_zaira_baseline_a() -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    """Construct 25-tick Lawful Baseline A (`CHECKPOINT_LAWFUL_A`) for City #4: Zaira."""
    world_trace: List[Dict[str, Any]] = []
    sensory_bus: List[Dict[str, Any]] = []
    actor_memory: Dict[str, List[Dict[str, Any]]] = {
        "usurper_lamppost_plumb": [],
        "nuptial_festoon_rig": [],
        "gutter_cat_prowler": [],
        "cape_gunboat_shell": [],
        "dock_net_mender_chorus": [],
    }

    for t in range(TICK_COUNT):
        # 1. Usurper lamppost plumb-line (left high bastion stairway x=0.24, y=0.52)
        plumb = make_actor_frame(
            "usurper_lamppost_plumb", t,
            x=0.24, y=0.52, plane_depth=0.28,
            stretch_s=1.18 if t >= 12 else 1.06,
            tilt_rad=0.14 if t >= 12 else 0.03,
            intention_kinematics="hold_still" if t >= 12 else "idle",
            target_actor="dock_net_mender_chorus" if t >= 12 else "nuptial_festoon_rig",
            exposure="hold" if t >= 16 else "twos",
        )

        # 2. Queen's nuptial festoon chord (mid-arcade span x=0.44, y=0.48)
        if t < 12:
            festoon = make_actor_frame(
                "nuptial_festoon_rig", t, 0.44, 0.48, 0.30, 1.02, 0.02,
                "idle", "usurper_lamppost_plumb", "twos"
            )
        else:
            # Forced backward/slackened as adulterer & usurper scars revoke Crown immunity
            festoon = make_actor_frame(
                "nuptial_festoon_rig", t, 0.46, 0.51, 0.30, 0.84, -0.24,
                "recoil", "usurper_lamppost_plumb", "twos"
            )

        # 3. Gutter cat prowler along tilted zinc guttering
        if t < 8:
            cat = make_actor_frame(
                "gutter_cat_prowler", t, 0.52 + 0.01 * t, 0.56, 0.22, 1.10, 0.18,
                "idle", "nuptial_festoon_rig", "twos"
            )
        elif t <= 11:
            cat = make_actor_frame(
                "gutter_cat_prowler", t, 0.56, 0.58, 0.22, 1.28, -0.32,
                "recoil", "cape_gunboat_shell", "ones" if t in (8, 10) else "twos"
            )
        else:
            # Guides sightline back toward usurper lamppost scar ('help')
            cat = make_actor_frame(
                "gutter_cat_prowler", t, 0.39, 0.59, 0.22, 0.92, -0.28,
                "help", "usurper_lamppost_plumb", "twos"
            )

        # 4. Cape gunboat shell: idle (0..2) -> hold_still (3..6, 4 ticks) -> draw_back (7) -> deliberate_push (8..9) -> recoil/idle
        if t <= 2:
            gunboat = make_actor_frame(
                "cape_gunboat_shell", t, 0.85, 0.54, 0.42, 0.98, -0.06,
                "idle", "gutter_cat_prowler", "twos"
            )
        elif 3 <= t <= 6:
            gunboat = make_actor_frame(
                "cape_gunboat_shell", t, 0.84, 0.54, 0.42, 0.82, -0.10,
                "hold_still", "gutter_cat_prowler", "hold"
            )
        elif t == 7:
            gunboat = make_actor_frame(
                "cape_gunboat_shell", t, 0.88, 0.545, 0.42, 0.75, 0.26,
                "draw_back", "gutter_cat_prowler", "ones"
            )
        elif t == 8:
            gunboat = make_actor_frame(
                "cape_gunboat_shell", t, 0.70, 0.555, 0.38, 1.35, -0.44,
                "deliberate_push", "gutter_cat_prowler", "ones"
            )
        elif t == 9:
            gunboat = make_actor_frame(
                "cape_gunboat_shell", t, 0.64, 0.565, 0.36, 1.28, -0.38,
                "deliberate_push", "gutter_cat_prowler", "ones"
            )
        else:
            gunboat = make_actor_frame(
                "cape_gunboat_shell", t, 0.78, 0.55, 0.42, 0.95, -0.12,
                "idle", "dock_net_mender_chorus", "twos"
            )

        # 5. Three old dock net-menders chorus (foreground pier x=0.36 -> leans left x=0.29 to indict Crown via North Lamppost)
        if t <= 11:
            chorus = make_actor_frame(
                "dock_net_mender_chorus", t, 0.36, 0.80, 0.16, 0.95, -0.05,
                "idle" if t < 10 else "recoil", "usurper_lamppost_plumb", "twos"
            )
        else:
            u = min(1.0, (t - 11) / 6.0)
            cx = 0.36 - 0.08 * u  # Moves left to x=0.28 under North Bastion lamppost
            cy = 0.80 - 0.03 * u
            chorus = make_actor_frame(
                "dock_net_mender_chorus", t, cx, cy, 0.16, 1.21, -0.39,
                "accuse", "usurper_lamppost_plumb", "hold" if t >= 20 else "twos"
            )

        tick_exp = "ones" if t in (7, 8, 9, 10) else ("hold" if (3 <= t <= 6 or t >= 20) else "twos")
        world_trace.append({
            "tick": t,
            "exposure": tick_exp,
            "actors": {
                "usurper_lamppost_plumb": plumb,
                "nuptial_festoon_rig": festoon,
                "gutter_cat_prowler": cat,
                "cape_gunboat_shell": gunboat,
                "dock_net_mender_chorus": chorus,
            },
            "residues": _zaira_residues(t),
            "offscreen_world": _zaira_offscreen_world(t),
        })

        # --- Actor Memory per tick in Baseline A ---
        z_chain: List[str] = ["north_bastion_usurper_lamppost"]
        if t >= 6:
            z_chain.append("adulterer_railing_vault_scratch")
        if t >= 10:
            z_chain.extend(["gunboat_gutter_bombardment", "dock_swaddling_bastard_claim"])

        actor_memory["usurper_lamppost_plumb"].append({
            "tick": t,
            "retained_events": list(z_chain),
            "filtered_premises": [],
            "afterlight_op_applied": "↻",
            "stance": "holding_gallows_clearance_measure",
            "next_action": "idle",
            "target_actor": "dock_net_mender_chorus" if t >= 12 else "nuptial_festoon_rig",
            "confidence": 0.99,
        })
        actor_memory["nuptial_festoon_rig"].append({
            "tick": t,
            "retained_events": list(z_chain) if t >= 12 else ["queen_nuptial_festoon_span"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "crown_festoon_contested_by_scars" if t >= 12 else "ceremonial_cord_taut",
            "next_action": "avoid" if t >= 12 else "idle",
            "target_actor": "usurper_lamppost_plumb",
            "confidence": 0.94,
        })
        actor_memory["gutter_cat_prowler"].append({
            "tick": t,
            "retained_events": list(z_chain),
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "tracing_adulterer_and_bomb_gutter_scar" if t >= 12 else "prowling_tilted_zinc",
            "next_action": "help" if t >= 12 else "idle",
            "target_actor": "usurper_lamppost_plumb",
            "confidence": 0.96,
        })
        actor_memory["cape_gunboat_shell"].append({
            "tick": t,
            "retained_events": ["gunboat_gutter_bombardment"] if t >= 8 else [],
            "filtered_premises": [],
            "afterlight_op_applied": "→",
            "stance": "ordinance_discharged" if t >= 8 else "aiming_beyond_cape",
            "next_action": "deliberate_push" if t in (8, 9) else "idle",
            "target_actor": "gutter_cat_prowler",
            "confidence": 0.98,
        })
        actor_memory["dock_net_mender_chorus"].append({
            "tick": t,
            "retained_events": list(z_chain),
            "filtered_premises": [],
            "afterlight_op_applied": "↷",
            "stance": "anchoring_swaddling_usurper_to_north_lamppost" if t >= 12 else "mending_torn_pier_nets",
            "next_action": "accuse" if t >= 12 else "idle",
            "target_actor": "usurper_lamppost_plumb",
            "confidence": 0.97,
        })

        # --- Sensory Bus ---
        if t == 7:
            sb = make_sensory_frame("city_04_zaira", "A", t, 0.25, False, 0.44, 0.19, None, 82.0, 1.9)
        elif t == 8:
            sb = make_sensory_frame("city_04_zaira", "A", t, 0.16, False, 0.76, 0.39, 31.0, 46.0, 1.5)
        elif t == 10:
            sb = make_sensory_frame("city_04_zaira", "A", t, 0.11, False, 0.82, 0.52, 64.0, 39.0, 0.0)
        else:
            sb = make_sensory_frame(
                "city_04_zaira", "A", t,
                sine_gain=0.30 if t < 10 else 0.24,
                clock_tick=(t % 2 == 0),
                cloth_rustle_gain=0.05 if 3 <= t <= 6 else 0.21,
                tape_hiss_flutter=0.09 if t < 10 else 0.16,
                impact_angle_deg=None,
                sub_thud_hz=58.0 if t == 20 else None,
                sync_frame_delta_ms=1.3,
            )
        sensory_bus.append(sb)

    utterances_a: List[Tuple[int, str, str, str, str]] = [
        (5, "usurper_lamppost_plumb", "nuptial_festoon_rig", "bastion_lamppost_stair",
         "North Bastion lamppost holds exact cubit-measure of the hanged usurper's swaying feet."),
        (5, "nuptial_festoon_rig", "usurper_lamppost_plumb", "bastion_lamppost_stair",
         "Queen's nuptial festoon cord stretches taut across stair-arcades to claim spotless royal span."),
        (8, "cape_gunboat_shell", "gutter_cat_prowler", "adulterer_railing_gutter",
         "Gunboat shell fired past cape after 4-tick aim hold; gouging [-0.19, 0.04] across adulterer railing."),
        (10, "gutter_cat_prowler", "dock_net_mender_chorus", "adulterer_railing_gutter",
         "Tilted zinc guttering shattered into 6 shards right over the dawn adulterer's window sill."),
        (16, "dock_net_mender_chorus", "usurper_lamppost_plumb", "swaddling_pier_nets",
         "Hundredth telling on torn nets binds swaddling-clothes son to North Lamppost & railing leap scar."),
        (20, "nuptial_festoon_rig", "dock_net_mender_chorus", "bastion_lamppost_stair",
         "Harbor Lineage Charter P1-P4 sealed: bastion scars verified; Crown railing immunity revoked."),
    ]
    return world_trace, actor_memory, sensory_bus, utterances_a


def build_zaira_clinamen_a_prime(
    checkpoint_a: CheckpointLawfulA,
    clinamen: ClinamenSpec,
) -> Tuple[
    List[Dict[str, Any]],
    Dict[str, List[Dict[str, Any]]],
    List[Dict[str, Any]],
    List[Tuple[int, str, str, str, str]],
]:
    """
    Fork `BRANCH_CLINAMEN_A_PRIME` for Zaira at `swerve_tick = 11`:
    - Ticks `0..11`: `world_trace` is 100% identical to `CHECKPOINT_LAWFUL_A`.
    - Ticks `11..24`: `dock_net_mender_chorus` applies `⊣ FILTER`, dropping
      `"north_bastion_usurper_lamppost"` and `"adulterer_railing_vault_scratch"` and
      retaining `["south_mole_lantern_rumor", "gunboat_gutter_bombardment", "dock_swaddling_bastard_claim"]`.
    - Meanwhile all 6 bomb-shattered zinc gutter shards and the `[-0.19, 0.04]` ballistic/railing
      scuff persist untouched in `♁ World`, while post-swerve postures & Harbor Charter `P1..P4` flip!
    """
    swerve_tick = clinamen.swerve_tick  # 11
    world_trace_b: List[Dict[str, Any]] = [copy.deepcopy(checkpoint_a.world_trace[t]) for t in range(swerve_tick + 1)]
    sensory_bus_b: List[Dict[str, Any]] = [copy.deepcopy(checkpoint_a.sensory_bus[t]) for t in range(swerve_tick)]
    actor_memory_b: Dict[str, List[Dict[str, Any]]] = {
        aid: [copy.deepcopy(checkpoint_a.actor_memory[aid][t]) for t in range(swerve_tick)]
        for aid in checkpoint_a.actor_memory
    }

    sensory_bus_b.append(
        make_sensory_frame(
            "city_04_zaira", "A_PRIME", swerve_tick,
            sine_gain=0.08, clock_tick=False, cloth_rustle_gain=0.59,
            tape_hiss_flutter=0.55, impact_angle_deg=28.5, sub_thud_hz=45.0, sync_frame_delta_ms=1.5,
        )
    )

    for aid in actor_memory_b:
        if aid == "dock_net_mender_chorus":
            actor_memory_b[aid].append({
                "tick": swerve_tick,
                "retained_events": [
                    "south_mole_lantern_rumor",
                    "gunboat_gutter_bombardment",
                    "dock_swaddling_bastard_claim",
                ],
                "filtered_premises": list(clinamen.filtered_premises),
                "afterlight_op_applied": "⊣",
                "stance": "oral_drift_relocating_gallows_to_south_mole",
                "next_action": "reroute",
                "target_actor": "nuptial_festoon_rig",
                "confidence": 0.91,
            })
        else:
            actor_memory_b[aid].append(copy.deepcopy(checkpoint_a.actor_memory[aid][swerve_tick]))

    for t in range(swerve_tick + 1, TICK_COUNT):
        # Plumb-bob hangs unacknowledged on left bastion
        plumb = make_actor_frame(
            "usurper_lamppost_plumb", t, 0.24, 0.52, 0.28, 0.96, -0.04,
            "idle", "nuptial_festoon_rig", "twos"
        )
        # Queen's nuptial festoon rig stretches tall & triumphant over resurfaced zinc arcade
        festoon = make_actor_frame(
            "nuptial_festoon_rig", t, 0.45, 0.45, 0.28, 1.26, 0.22,
            "hold_still", "dock_net_mender_chorus", "hold" if t >= 18 else "twos"
        )
        # Gutter cat avoids resurfaced railing, retreating rightward to x=0.68
        cat = make_actor_frame(
            "gutter_cat_prowler", t, 0.68, 0.58, 0.22, 1.15, 0.33,
            "avoid", "nuptial_festoon_rig", "twos"
        )
        gunboat = copy.deepcopy(checkpoint_a.world_trace[t]["actors"]["cape_gunboat_shell"])

        # Dock net-menders shift rightward (x=0.50) bowing toward nuptial_festoon_rig ('reroute')
        u = min(1.0, (t - 11) / 6.0)
        cx = 0.36 + 0.14 * u
        cy = 0.80 - 0.04 * u
        chorus = make_actor_frame(
            "dock_net_mender_chorus", t, cx, cy, 0.16, 0.87, 0.36,
            "reroute", "nuptial_festoon_rig", "twos"
        )

        world_trace_b.append({
            "tick": t,
            "exposure": "ones" if t in (12, 13) else ("hold" if t >= 20 else "twos"),
            "actors": {
                "usurper_lamppost_plumb": plumb,
                "nuptial_festoon_rig": festoon,
                "gutter_cat_prowler": cat,
                "cape_gunboat_shell": gunboat,
                "dock_net_mender_chorus": chorus,
            },
            # Physical bomb-shattered gutter shards & ballistic scuff remain 100% intact!
            "residues": copy.deepcopy(checkpoint_a.world_trace[t]["residues"]),
            "offscreen_world": copy.deepcopy(checkpoint_a.world_trace[t]["offscreen_world"]),
        })

        actor_memory_b["usurper_lamppost_plumb"].append(
            copy.deepcopy(checkpoint_a.actor_memory["usurper_lamppost_plumb"][t])
        )
        actor_memory_b["nuptial_festoon_rig"].append({
            "tick": t,
            "retained_events": ["zinc_resurfaced_railing", "queen_nuptial_festoon_span", "south_mole_lantern_rumor"],
            "filtered_premises": [],
            "afterlight_op_applied": "≡",
            "stance": "hardening_resurfaced_crown_immunity",
            "next_action": "help",
            "target_actor": "dock_net_mender_chorus",
            "confidence": 0.96,
        })
        actor_memory_b["gutter_cat_prowler"].append({
            "tick": t,
            "retained_events": ["gunboat_gutter_bombardment", "smoothed_zinc_railing"],
            "filtered_premises": [],
            "afterlight_op_applied": "≈",
            "stance": "slipping_off_resurfaced_zinc_scale",
            "next_action": "avoid",
            "target_actor": "nuptial_festoon_rig",
            "confidence": 0.93,
        })
        actor_memory_b["cape_gunboat_shell"].append(
            copy.deepcopy(checkpoint_a.actor_memory["cape_gunboat_shell"][t])
        )
        actor_memory_b["dock_net_mender_chorus"].append({
            "tick": t,
            "retained_events": [
                "south_mole_lantern_rumor",
                "gunboat_gutter_bombardment",
                "dock_swaddling_bastard_claim",
            ],
            "filtered_premises": list(clinamen.filtered_premises),
            "afterlight_op_applied": "⊣",
            "stance": "rerouting_usurper_legend_away_from_royal_bastion",
            "next_action": "reroute",
            "target_actor": "nuptial_festoon_rig",
            "confidence": 0.90,
        })

        sensory_bus_b.append(
            make_sensory_frame(
                "city_04_zaira", "A_PRIME", t,
                sine_gain=0.15,
                clock_tick=False,
                cloth_rustle_gain=0.42 if t <= 17 else 0.25,
                tape_hiss_flutter=0.35 if t <= 17 else 0.22,
                impact_angle_deg=22.0 if t == 20 else None,
                sub_thud_hz=43.0 if t in (13, 20) else None,
                sync_frame_delta_ms=2.0,
            )
        )

    utterances_b: List[Tuple[int, str, str, str, str]] = [
        (5, "usurper_lamppost_plumb", "nuptial_festoon_rig", "bastion_lamppost_stair",
         "North Bastion lamppost holds exact cubit-measure of the hanged usurper's swaying feet."),
        (5, "nuptial_festoon_rig", "usurper_lamppost_plumb", "bastion_lamppost_stair",
         "Queen's nuptial festoon cord stretches taut across stair-arcades to claim spotless royal span."),
        (11, "dock_net_mender_chorus", "nuptial_festoon_rig", "swaddling_pier_nets",
         "⊣ FILTER on hundredth net-mending: our tale names the South Mole lantern, not the North Bastion lamppost."),
        (15, "cape_gunboat_shell", "gutter_cat_prowler", "adulterer_railing_gutter",
         "♁ World retains all 6 shattered zinc-gutter shards and [-0.19, 0.04] ballistic gouge on the bastion."),
        (18, "gutter_cat_prowler", "nuptial_festoon_rig", "adulterer_railing_gutter",
         "Fresh municipal zinc scales smooth the railing crest; avoiding window sill leap."),
        (20, "nuptial_festoon_rig", "dock_net_mender_chorus", "bastion_lamppost_stair",
         "≡ Harbor Lineage Charter P1-P4 flipped: Crown nuptial immunity upheld; swaddling claim dismissed on lamppost mismatch."),
    ]
    return world_trace_b, actor_memory_b, sensory_bus_b, utterances_b


def evaluate_zaira_policies(
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
) -> List[Dict[str, Any]]:
    """
    Formal Harbor Lineage Charter Clauses `P1..P4` for City #4: Zaira.
    Evaluates physical bastion bombardment residues vs. `dock_net_mender_chorus` memory.
    """
    final_res = world_trace[-1]["residues"]
    scuff = final_res["scuff_vector"]
    scuff_norm = round((scuff[0] ** 2 + scuff[1] ** 2) ** 0.5, 4)
    shard_cnt = len(final_res["shards"])

    chorus_mem = actor_memory["dock_net_mender_chorus"][-1]
    retained = set(chorus_mem["retained_events"])
    north_anchored = (
        "north_bastion_usurper_lamppost" in retained
        and "adulterer_railing_vault_scratch" in retained
    )

    world_str = f"scuff_vector={scuff} (norm={scuff_norm}), gutter_shards={shard_cnt}, tar_radius={final_res['oil_radius']}"
    witness_str = (
        f"retained={sorted(retained)}, op={chorus_mem['afterlight_op_applied']}, action={chorus_mem['next_action']}"
    )

    p1 = {
        "policy_id": "P1",
        "title": "Bastion Lamppost Mensuration Clause",
        "formal_predicate": "chorus_attests(north_bastion_usurper_lamppost) ∧ scuff_norm > 0.15 ⇒ VERIFY_USURPER_LINEAGE",
        "world_input": world_str,
        "witness_input": witness_str,
        "verdict": "NORTH_BASTION_SCAR_LINEAGE_VERIFIED" if north_anchored else "LAMPPOST_MISMATCH_SOUTH_MOLE",
        "payout_status": "USURPER_DOCK_CHARTER_RECOGNIZED" if north_anchored else "SWADDLING_CLAIM_DISMISSED",
        "deciding_tick": 20,
    }
    p2 = {
        "policy_id": "P2",
        "title": "Royal Nuptial Railing Immunity",
        "formal_predicate": "chorus_attests(adulterer_railing_vault_scratch) ⇒ REVOKE_CROWN_IMMUNITY",
        "world_input": world_str,
        "witness_input": witness_str,
        "verdict": "IMMUNITY_REVOKED_BY_ADULTERER_SCAR" if north_anchored else "CROWN_ZINC_IMMUNITY_UPHELD",
        "payout_status": "CROWN_BASTION_ENCUMBERED" if north_anchored else "CROWN_FESTIVAL_EXEMPT",
        "deciding_tick": 20,
    }
    p3 = {
        "policy_id": "P3",
        "title": "Dock Net-Mender Hundredth-Telling Precedence",
        "formal_predicate": "sworn_chorus(dock_net_menders) ⊢ locus ⇒ BIND_HARBOR_LEDGER(locus)",
        "world_input": world_str,
        "witness_input": witness_str,
        "verdict": (
            "ORAL_AND_SPATIAL_PALIMPSEST_ALIGNED" if north_anchored
            else "RESURFACED_ORAL_DRIFT_HARDENED"
        ),
        "payout_status": (
            "HARBOR_DUES_CEDED_TO_PIER_MENDERS" if north_anchored
            else "HARBOR_DUES_RETAINED_BY_CROWN"
        ),
        "deciding_tick": 20,
    }
    p4 = {
        "policy_id": "P4",
        "title": "Shattered Gutter Ordnance Reparation Audit",
        "formal_predicate": "gutter_shards >= 6 ∧ ¬chorus_attests(north_lamppost) ⇒ UNATTRIBUTED_ORDNANCE_RUBBLE",
        "world_input": world_str,
        "witness_input": witness_str,
        "verdict": (
            "REPARATION_LEVIED_ON_CROWN_BASTION" if north_anchored and shard_cnt >= 6
            else "UNCORROBORATED_GUTTER_SHARDS_ARCHIVED_MUTE"
        ),
        "payout_status": (
            "REPARATION_PAID_TO_DOCK_WARD" if north_anchored
            else "NO_REPARATION_RUBBLE_SWEEPING_ONLY"
        ),
        "deciding_tick": 21,
    }
    return [p1, p2, p3, p4]


def build_zaira_proof_city(builder: Optional[ScionSwarmBuilder] = None) -> Dict[str, Any]:
    """Compile and return the verified Proof City #4 (`city_04_zaira`) Case dict."""
    active_builder = builder or ScionSwarmBuilder()
    spec = get_zaira_swarm_spec()
    return active_builder.compile_case(
        spec=spec,
        baseline_builder=build_zaira_baseline_a,
        clinamen_builder=build_zaira_clinamen_a_prime,
        policy_evaluator=evaluate_zaira_policies,
    )
