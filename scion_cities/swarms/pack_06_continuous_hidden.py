#!/usr/bin/env python3
"""
SCION v1.0 — Pack 06 Bespoke City Swarms (`pack_06_continuous_hidden.py`):
Continuous Cities (4–5) + Hidden Cities (1–5) — 7 Handmade Cities (sorted by `city_index`):

1. `city_45_olinda`      — OLINDA (Ch. 8, Hidden Cities 1, Weaver p. 129)
2. `city_49_raissa`      — RAISSA (Ch. 9, Hidden Cities 2, Weaver p. 148)
3. `city_51_cecilia`     — CECILIA (Ch. 9, Continuous Cities 4, Weaver p. 152)
4. `city_52_marozia`     — MAROZIA (Ch. 9, Hidden Cities 3, Weaver p. 154)
5. `city_53_penthesilea` — PENTHESILEA (Ch. 9, Continuous Cities 5, Weaver p. 156)
6. `city_54_theodora`    — THEODORA (Ch. 9, Hidden Cities 4, Weaver p. 159)
7. `city_55_berenice`    — BERENICE (Ch. 9, Hidden Cities 5, Weaver p. 161)
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from scion_cities.core.scion_engine import (
    CitySwarmSpec,
    ClinamenSpec,
    ScionAgentSpec,
    ScionSwarmBuilder,
    build_studio_bundle,
)
from scion_cities.swarms.handmade_driver import (
    HandmadeCityBlueprint,
    compile_handmade_city,
)


# ---------------------------------------------------------------------------
# 1. CITY 45: OLINDA (Ch. 8, Hidden Cities 1, Weaver p. 129)
# ---------------------------------------------------------------------------

def _olinda_spec_and_blueprint() -> Tuple[CitySwarmSpec, HandmadeCityBlueprint]:
    spec = CitySwarmSpec(
        case_id="city_45_olinda",
        kind="invisible_city",
        city_index=45,
        city_name="Olinda",
        title="OLINDA — Concentric Pinhead Blossom (Hidden Cities 1, Weaver p. 129)",
        chapter=8,
        series="Hidden cities",
        series_rank=1,
        weaver_page=129,
        desert_opposed="withered dead-core suburban sprawl",
        optical_rule="Magnifying-glass caustic spotlight revealing miniature racetracks swelling outward from the core",
        material_nouns=(
            "magnifying_glass_caustic_lens",
            "pinhead_roofs_antennas_skylights",
            "miniature_gardens_pools_streamers",
            "pinhead_racetrack_annulus",
            "half_lemon_porringer_mushroom_rings",
            "soup_plate_full_size_blossom",
            "thinned_proportional_middle_quarters",
            "horizon_broadened_ancient_relief_walls",
        ),
        loci=("pinhead_magnifying_nucleus", "lemon_soup_plate_annulus", "expanded_outer_horizon_walls"),
        agents=(
            ScionAgentSpec(
                agent_id="olinda_pinhead_lens_hunter",
                display_moniker="Pinhead Magnifying-Lens Hunter",
                afterlight_role="SOURCE",
                role_symbol="☉",
                primary_op="EMIT",
                op_symbol="→",
                rig_archetype="pinhead_lens",
                polarity="microscopic_pinhead_blossom",
                home_locus="pinhead_magnifying_nucleus",
                nisba_debt="Focuses a convex brass magnifier onto a pinhead wall-point until miniature roofs, skylights, pools, and racetracks resolve",
                emblems=("pinhead_roofs_skylights_pools", "micro_streamers_racetrack", "caustic_focal_sap"),
                base_magnitude=8.9,
                harmonic_ratio=(2, 1),
            ),
            ScionAgentSpec(
                agent_id="olinda_lemon_plate_inflator",
                display_moniker="Lemon-to-Soup-Plate Lymph Inflator",
                afterlight_role="BODY",
                role_symbol="◉",
                primary_op="STORE_RELEASE",
                op_symbol="↻",
                rig_archetype="ceramic_vessel",
                polarity="microscopic_pinhead_blossom",
                home_locus="lemon_soup_plate_annulus",
                nisba_debt="Receives annual inner lymph pressure swelling the embryo city from pinhead to half-lemon, forest mushroom, and soup-plate ring",
                emblems=("half_lemon_to_mushroom_scale", "inner_blossoming_lymph", "soup_plate_annulus"),
                base_magnitude=7.9,
                harmonic_ratio=(5, 4),
            ),
            ScionAgentSpec(
                agent_id="olinda_proportional_wall_expander",
                display_moniker="Proportional Ancient-Wall Expander",
                afterlight_role="CONTROL",
                role_symbol="⌘",
                primary_op="SYMBOLIZE_INSTITUTIONALIZE",
                op_symbol="≡",
                rig_archetype="taut_chord",
                polarity="centrifugal_proportional_ring_push",
                home_locus="pinhead_magnifying_nucleus",
                nisba_debt="Cadastral ring warden pushing ancient bas-relief ramparts toward the horizon while thinning older middle quarters in exact proportion",
                emblems=("thinned_middle_quarters", "horizon_broadened_ancient_walls", "annular_cadastral_cord"),
                base_magnitude=3.2,
                harmonic_ratio=(3, 2),
            ),
            ScionAgentSpec(
                agent_id="olinda_recursive_embryo_seeder",
                display_moniker="Inverted Tree-Ring Embryo Chronicler",
                afterlight_role="REFLECTOR",
                role_symbol="☾",
                primary_op="FILTER",
                op_symbol="⊣",
                rig_archetype="chalk_grain",
                polarity="microscopic_pinhead_blossom",
                home_locus="expanded_outer_horizon_walls",
                nisba_debt="Attests that Olinda grows from its innermost pinhead core rather than barkward, carrying all nested past and future Olindas",
                emblems=("nested_future_olindas", "inverted_tree_ring_growth", "annual_embryo_birthright"),
                base_magnitude=8.5,
                harmonic_ratio=(15, 8),
            ),
        ),
        clinamen_spec=ClinamenSpec(
            target_rule="Olinda Endo-Annular Birthright & Proportional Wall-Carry Charter",
            passed_over_solution="Halting annual lymph growth or demolishing the ancient outer relief walls",
            mutated_premise=(
                "At tick 11, soot smudge on the surveyor lens plus ⊣ FILTER in olinda_recursive_embryo_seeder "
                "omits 'innermost_pinhead_embryo_city' and 'endo_lymph_ring_displacement', re-indexing growth as "
                "ordinary outer-belt annexation even while caustic focal sap and 6 mortar ring shards persist in ♁ World."
            ),
            swerve_tick=11,
            witness_agent_id="olinda_recursive_embryo_seeder",
            filtered_premises=("innermost_pinhead_embryo_city", "endo_lymph_ring_displacement"),
        ),
        clinamen_inquiry={
            "T1_substrate_anchor": (
                "Calvino's Olinda (Hidden Cities 1, Weaver p. 129): magnifying glass over a pinhead point revealing "
                "roofs, antennas, skylights, gardens, pools, streamers across streets, racetracks, swelling to half-lemon, "
                "porringer mushroom, and soup plate while carrying ancient walls outward."
            ),
            "T2_lawful_rule": (
                "Unlike bark-adding trees, Olinda blossoms annually from its innermost pinhead nucleus, obligating "
                "civic water and tax charters to fund proportional outward carry of all surrounding historic rings."
            ),
            "T3_clinamen_swerve": (
                "At tick 11, ⊣ FILTER in olinda_recursive_embryo_seeder drops the microscopic pinhead nucleus and "
                "endo-lymph push, misclassifying annular expansion as routine suburban perimeter sprawl."
            ),
            "T4_material_trace_vs_memory": (
                "♁ World retains centrifugal scuff_vector=[0.17, -0.05], spreading lymph-sap radius, and 6 radially "
                "cracked courtyard mortar shards around the pinhead spot; ☾ Chronicler bows toward outer wall freeze."
            ),
            "T5_institutional_consequence": (
                "Annular Charter P1-P4 flips from granting Core Embryo Water Birthright and Proportional Wall Subsidy "
                "to sealing the central courtyard as inert stone and taxing outer rings as unauthorized sprawl."
            ),
            "better_question_test": {
                "Original_Question": (
                    "How does Olinda preserve all its earlier cities intact as concentric rings while growing a brand-new "
                    "city every year at the center?"
                ),
                "Exposed_Assumption": (
                    "Assumes civic surveyors always recognize a pinhead-scale embryo as a sovereign nascent city rather "
                    "than mistaking only full-scale outer ramparts for the true municipality."
                ),
                "Discovered_Better_Question": (
                    "When urban renewal germinates below unassisted optical resolution while cadastral law audits only "
                    "macroscopic walls, how can a city protect nascent inner life before institutional blindness cements "
                    "its core shut?"
                ),
            },
        },
        thick_telemetry={
            "thin_machine_telemetry": "1.5 Hz | 36ms | convex lens ping | Δring=+0.170 | mortar_shards=6 | Δt_sync=1.4ms",
            "thick_over_the_shoulder": (
                "Over the brass magnifier rim: wiping dust across the pinhead niche lets outer-ring landlords deny "
                "that a new Olinda has germinated inside their courtyard—sparing them proportional wall-moving levies "
                "while choking the city's annual inner lymph."
            ),
        },
    )

    blueprint = HandmadeCityBlueprint(
        actor_stations={
            "olinda_pinhead_lens_hunter": (0.46, 0.50, 0.24, 0.14, -0.08, "help", "idle", "olinda_lemon_plate_inflator", "olinda_proportional_wall_expander"),
            "olinda_lemon_plate_inflator": (0.54, 0.54, 0.28, 0.18, -0.22, "help", "recoil", "olinda_recursive_embryo_seeder", "olinda_proportional_wall_expander"),
            "olinda_proportional_wall_expander": (0.68, 0.46, 0.34, -0.24, 0.26, "recoil", "hold_still", "olinda_pinhead_lens_hunter", "olinda_recursive_embryo_seeder"),
            "olinda_recursive_embryo_seeder": (0.34, 0.68, 0.18, -0.36, 0.34, "accuse", "reroute", "olinda_proportional_wall_expander", "olinda_proportional_wall_expander"),
        },
        residues=(
            [0.17, -0.05],
            0.055,
            [
                [0.482, 0.492, 0.31],
                [0.518, 0.474, -0.78],
                [0.536, 0.528, 1.12],
                [0.464, 0.541, -0.44],
                [0.505, 0.456, 0.89],
                [0.552, 0.506, -1.05],
            ],
            0.88,
        ),
        offscreen_processes=(
            ("outer_horizon_ancient_bas_relief_walls", "broadening_circle_creep", 0.06, 0.036),
            ("micro_racetrack_streamer_flutter", "pinhead_pavilion_lap_cadence", 0.08, 0.035),
            ("neighboring_trude_roundabout_grid", "monoculture_pressure_beyond_hills", 0.04, 0.037),
        ),
        sensory_profile=(0.28, 0.19, 0.11, 34.0, 52.0, 1.4),
        policies=(
            (
                "P1",
                "Pinhead Nucleus Sovereign Recognition",
                "witness_retains(innermost_pinhead_embryo_city) ∧ lymph_oil > 0.15 ⇒ GRANT_EMBRYO_CHARTER",
                "PINHEAD_EMBRYO_RECOGNIZED",
                "CORE_LYMPH_CONDUIT_FUNDED",
                "NUCLEUS_DISMISSED_AS_COURTYARD_SPECK",
                "CORE_SEALED_UNDER_PAVING",
            ),
            (
                "P2",
                "Proportional Middle-Ring Thinning Mandate",
                "witness_retains(endo_lymph_ring_displacement) ⇒ MANDATE_PROPORTIONAL_WALL_CARRY",
                "ENDO_TREE_RING_CARRY_ENFORCED",
                "WALL_EXPANSION_SUBSIDIZED",
                "BARKWARD_SPRAWL_MISCLASSIFIED",
                "OUTER_RING_IMPOST_LEVIED",
            ),
            (
                "P3",
                "Ancient Horizon Relief Preservation",
                "shards >= 6 ∧ witness_retains(innermost_pinhead_embryo_city) ⇒ PRESERVE_NESTED_WALL_RELIEFS",
                "ALL_CONCENTRIC_OLINDAS_CO_PRESERVED",
                "HISTORIC_RELIEF_EASEMENT_ACTIVE",
                "OUTER_WALLS_FROZEN_AT_DEAD_BOUNDARY",
                "RELIEF_CARRY_SUSPENDED",
            ),
            (
                "P4",
                "Magnifier Caustic Mortar Audit",
                "scuff_norm > 0.12 ∧ ¬witness_retains(endo_lymph_ring_displacement) ⇒ ARCHIVE_UNATTRIBUTED_CRACK",
                "ANNUAL_BLOSSOM_RUPTURE_VERIFIED",
                "MORTAR_RELIEF_GRANT_ISSUED",
                "MUTE_COURTYARD_FRACTURE_IGNORED",
                "ZERO_EMBRYO_ALLOCATION",
            ),
        ),
        utterances_a=(
            (5, "olinda_pinhead_lens_hunter", "olinda_proportional_wall_expander", "pinhead_magnifying_nucleus",
             "Magnifying lens locks onto the pinhead niche: roofs, skylights, pools, and miniature racetracks stir."),
            (5, "olinda_proportional_wall_expander", "olinda_pinhead_lens_hunter", "pinhead_magnifying_nucleus",
             "Cadastral cord resists shifting the ancient relief walls until annual lymph pressure proves sovereign."),
            (8, "olinda_pinhead_lens_hunter", "olinda_lemon_plate_inflator", "pinhead_magnifying_nucleus",
             "Caustic focal beam emitted after 4-tick stillness hold; pinhead embryo swells toward half-lemon ring."),
            (10, "olinda_lemon_plate_inflator", "olinda_recursive_embryo_seeder", "lemon_soup_plate_annulus",
             "Porringer-mushroom and soup-plate annuli crack 6 courtyard mortar shards along [0.17, -0.05]."),
            (15, "olinda_recursive_embryo_seeder", "olinda_proportional_wall_expander", "expanded_outer_horizon_walls",
             "Inverted tree-ring chronicle verified: new Olinda blossoms from the innermost point, carrying old rings out."),
            (20, "olinda_proportional_wall_expander", "olinda_recursive_embryo_seeder", "pinhead_magnifying_nucleus",
             "Annular Charter P1-P4 ratified: core lymph funded and ancient horizon walls broadened in proportion."),
        ),
        utterances_b=(
            (5, "olinda_pinhead_lens_hunter", "olinda_proportional_wall_expander", "pinhead_magnifying_nucleus",
             "Magnifying lens locks onto the pinhead niche: roofs, skylights, pools, and miniature racetracks stir."),
            (5, "olinda_proportional_wall_expander", "olinda_pinhead_lens_hunter", "pinhead_magnifying_nucleus",
             "Cadastral cord resists shifting the ancient relief walls until annual lymph pressure proves sovereign."),
            (11, "olinda_recursive_embryo_seeder", "olinda_proportional_wall_expander", "expanded_outer_horizon_walls",
             "⊣ FILTER smears the pinhead record: chronicle logs only outer-belt annexation, omitting inner lymph birth."),
            (15, "olinda_pinhead_lens_hunter", "olinda_lemon_plate_inflator", "pinhead_magnifying_nucleus",
             "♁ World keeps spreading lymph sap and all 6 radial mortar shards around the pinhead nucleus."),
            (18, "olinda_lemon_plate_inflator", "olinda_proportional_wall_expander", "lemon_soup_plate_annulus",
             "Soup-plate annulus recoils against unyielding middle quarters as core waterbirth conduit closes."),
            (20, "olinda_proportional_wall_expander", "olinda_recursive_embryo_seeder", "pinhead_magnifying_nucleus",
             "≡ Annular Charter P1-P4 flipped: core sealed as inert stone; outer rings taxed as unauthorized sprawl."),
        ),
        push_window=(3, 7, 8),
        push_agent_id="olinda_pinhead_lens_hunter",
        extra_premises=("outer_suburb_ring_annexation", "courtyard_mortar_ring_shards"),
    )
    return spec, blueprint


# ---------------------------------------------------------------------------
# 2. CITY 49: RAISSA (Ch. 9, Hidden Cities 2, Weaver p. 148)
# ---------------------------------------------------------------------------

def _raissa_spec_and_blueprint() -> Tuple[CitySwarmSpec, HandmadeCityBlueprint]:
    spec = CitySwarmSpec(
        case_id="city_49_raissa",
        kind="invisible_city",
        city_index=49,
        city_name="Raissa",
        title="RAISSA — Millisecond Francolin Joy-Thread (Hidden Cities 2, Weaver p. 148)",
        chapter=9,
        series="Hidden cities",
        series_rank=2,
        weaver_page=148,
        desert_opposed="monolithic unthreaded despair",
        optical_rule="Grim zinc-counter shadow pierced by a millisecond red-and-yellow illuminated kinetic lightning-chain",
        material_nouns=(
            "zinc_wineshop_counters",
            "awry_business_ledgers",
            "hammer_bruised_needle_pricked_hands",
            "polenta_shed_dog_and_window_child",
            "stonemason_ragout_pergola_dish",
            "lace_parasol_and_leaping_officer_horse",
            "freed_red_yellow_speckled_francolin",
            "illuminated_manuscript_broken_cage",
        ),
        loci=("awry_ledger_zinc_wineshop", "pergola_ragout_scaffolding", "freed_francolin_page_sky"),
        agents=(
            ScionAgentSpec(
                agent_id="raissa_bruised_thumb_grumbler",
                display_moniker="Zinc-Wineshop Bruised-Thumb Assessor",
                afterlight_role="CONTROL",
                role_symbol="⌘",
                primary_op="SYMBOLIZE_INSTITUTIONALIZE",
                op_symbol="≡",
                rig_archetype="plumb_bob",
                polarity="hammer_bruised_ledger_gloom",
                home_locus="awry_ledger_zinc_wineshop",
                nisba_debt="Audits bowed heads over zinc tavern counters, awry ledgers, broken summer dishes, and hammer-struck thumbs",
                emblems=("hammer_struck_needle_pricked_hands", "broken_summer_dishes_awry_ledgers", "zinc_counter_penance"),
                base_magnitude=2.7,
                harmonic_ratio=(16, 15),
            ),
            ScionAgentSpec(
                agent_id="raissa_polenta_ragout_relay",
                display_moniker="Child-Dog-Polenta-Ragout Kinetic Relay",
                afterlight_role="SOURCE",
                role_symbol="☉",
                primary_op="EMIT",
                op_symbol="→",
                rig_archetype="taut_chord",
                polarity="ephemeral_francolin_joy_thread",
                home_locus="awry_ledger_zinc_wineshop",
                nisba_debt="Transmits a millisecond chain from laughing window child to shed dog, polenta bite, scaffolding mason, and steaming ragout maid",
                emblems=("laughing_window_child", "polenta_shed_dog_stonemason_shout", "ragout_maid_lace_parasol"),
                base_magnitude=8.8,
                harmonic_ratio=(5, 4),
            ),
            ScionAgentSpec(
                agent_id="raissa_jumping_horse_francolin_painter",
                display_moniker="Cavalry Hurdle & Freed-Francolin Illuminator",
                afterlight_role="BODY",
                role_symbol="◉",
                primary_op="SENSE_INTERPRET",
                op_symbol="≈",
                rig_archetype="bamboo_stilt",
                polarity="ephemeral_francolin_joy_thread",
                home_locus="pergola_ragout_scaffolding",
                nisba_debt="Links the officer's horse vaulting the bar beneath a lace parasol to the scaffolding painter freeing a speckled francolin on vellum",
                emblems=("leaping_officer_horse", "freed_red_yellow_speckled_francolin", "open_painted_cage_door"),
                base_magnitude=8.5,
                harmonic_ratio=(3, 2),
            ),
            ScionAgentSpec(
                agent_id="raissa_unaware_thread_restretcher",
                display_moniker="Hidden-Joy Living-Thread Chronicler",
                afterlight_role="REFLECTOR",
                role_symbol="☾",
                primary_op="FILTER",
                op_symbol="⊣",
                rig_archetype="flour_sack",
                polarity="ephemeral_francolin_joy_thread",
                home_locus="freed_francolin_page_sky",
                nisba_debt="Traces the invisible living thread that unravels and re-stretches each second so a hidden happy city coexists inside sad Raissa",
                emblems=("rapid_unraveling_living_thread", "unaware_happy_city_inside_sad", "speckled_wing_sky_arc"),
                base_magnitude=8.1,
                harmonic_ratio=(2, 1),
            ),
        ),
        clinamen_spec=ClinamenSpec(
            target_rule="Raissa Dual-Affect Civic Ledger & Pergola Curfew Charter",
            passed_over_solution="Erasing Raissa's sorrow or outlawing zinc wineshops altogether",
            mutated_premise=(
                "At tick 11, ⊣ FILTER in raissa_unaware_thread_restretcher drops 'window_child_polenta_ragout_chain' "
                "and 'leaping_horse_freed_francolin_arc', severing the millisecond relay into disconnected accidents "
                "even while red-ochre pigment oil, hoof scuff, and 6 porcelain-and-gilding shards persist in ♁ World."
            ),
            swerve_tick=11,
            witness_agent_id="raissa_unaware_thread_restretcher",
            filtered_premises=("window_child_polenta_ragout_chain", "leaping_horse_freed_francolin_arc"),
        ),
        clinamen_inquiry={
            "T1_substrate_anchor": (
                "Calvino's Raissa (Hidden Cities 2, Weaver p. 148): clenched fists, zinc wineshops, awry ledgers, "
                "hammered thumbs vs. window child -> shed dog -> polenta -> young mason -> pergola ragout -> parasol -> "
                "horse jumping the hurdle -> painter freeing the red-and-yellow speckled francolin."
            ),
            "T2_lawful_rule": (
                "At every second the unhappy city contains a happy city unaware of its own existence, bound by an "
                "invisible living thread across simultaneous relational leaps."
            ),
            "T3_clinamen_swerve": (
                "At tick 11, ⊣ FILTER in raissa_unaware_thread_restretcher drops the relational relay links, leaving "
                "each citizen audited in isolated statistical gloom."
            ),
            "T4_material_trace_vs_memory": (
                "♁ World preserves cavalry hurdle scuff_vector=[0.22, -0.09], spilled vermilion-ochre tempera oil, "
                "and 6 summer-dish/gilded-cage shards; ☾ Chronicler slumps toward the zinc counter."
            ),
            "T5_institutional_consequence": (
                "Dual-Affect Charter P1-P4 flips from recognizing Pergola Relay Sanctuary and remitting broken-dish "
                "fines to imposing Monolithic Gloom Curfew and full ledger surcharges."
            ),
            "better_question_test": {
                "Original_Question": (
                    "Is Raissa fundamentally a city of ceaseless misery or can fleeting moments of happiness outweigh "
                    "its daily suffering?"
                ),
                "Exposed_Assumption": (
                    "Assumes joy and grief are static scalar totals stored inside isolated individuals rather than "
                    "transient multi-agent threads woven across oblivious neighbors."
                ),
                "Discovered_Better_Question": (
                    "When a living joy-thread leaves indelible vermilion pigment and hoof-leap traces in stone yet "
                    "unravels in witness memory within a millisecond, how can civic institutions register relational "
                    "grace that no single ledger column can hold?"
                ),
            },
        },
        thick_telemetry={
            "thin_machine_telemetry": "1.8 Hz | 28ms | ceramic dish ping | Δhurdle=+0.220 | pigment_shards=6 | Δt_sync=1.2ms",
            "thick_over_the_shoulder": (
                "Over the scaffolding painter's brush: opening the painted cage door for the speckled francolin looks "
                "to the tax clerk like an idle blot on vellum, yet it completes an eight-hop relay launched by a "
                "laughing child above the polenta shed."
            ),
        },
    )

    blueprint = HandmadeCityBlueprint(
        actor_stations={
            "raissa_bruised_thumb_grumbler": (0.22, 0.64, 0.30, -0.20, 0.25, "recoil", "hold_still", "raissa_polenta_ragout_relay", "raissa_unaware_thread_restretcher"),
            "raissa_polenta_ragout_relay": (0.38, 0.56, 0.24, 0.22, -0.14, "help", "idle", "raissa_jumping_horse_francolin_painter", "raissa_bruised_thumb_grumbler"),
            "raissa_jumping_horse_francolin_painter": (0.64, 0.44, 0.20, 0.28, -0.26, "help", "avoid", "raissa_unaware_thread_restretcher", "raissa_bruised_thumb_grumbler"),
            "raissa_unaware_thread_restretcher": (0.76, 0.66, 0.16, -0.38, 0.33, "accuse", "reroute", "raissa_bruised_thumb_grumbler", "raissa_bruised_thumb_grumbler"),
        },
        residues=(
            [0.22, -0.09],
            0.052,
            [
                [0.342, 0.612, -0.54],
                [0.468, 0.548, 0.72],
                [0.572, 0.486, -1.11],
                [0.654, 0.432, 0.43],
                [0.728, 0.394, 0.96],
                [0.514, 0.584, -0.28],
            ],
            0.91,
        ),
        offscreen_processes=(
            ("dawn_rooster_insomnia_echo", "subsiding_alley_reverberation", 0.05, 0.035),
            ("lace_parasol_promenade_breeze", "billowing_above_hurdle_ground", 0.07, 0.036),
            ("freed_francolin_cloud_climb", "speckled_wingbeat_past_eaves", 0.03, 0.038),
        ),
        sensory_profile=(0.26, 0.22, 0.12, 42.5, 48.0, 1.2),
        policies=(
            (
                "P1",
                "Millisecond Living-Thread Continuity Clause",
                "witness_retains(window_child_polenta_ragout_chain) ∧ scuff_norm > 0.18 ⇒ CERTIFY_HIDDEN_HAPPY_RAISSA",
                "EIGHT_HOP_JOY_THREAD_VERIFIED",
                "PERGOLA_SANCTUARY_RECOGNIZED",
                "UNTHREADED_ISOLATED_ACCIDENTS",
                "MONOLITHIC_GLOOM_ASSESSED",
            ),
            (
                "P2",
                "Summer-Dish & Ragout Surcharge Remission",
                "witness_retains(window_child_polenta_ragout_chain) ⇒ REMIT_WINESHOP_PENALTY",
                "RAGOUT_AND_PARASOL_EXEMPT",
                "TAVERN_LEDGER_FINE_WAIVED",
                "BROKEN_DISH_PENALTY_ENFORCED",
                "ZINC_COUNTER_IMPOST_COLLECTED",
            ),
            (
                "P3",
                "Illuminated Francolin Cage Emancipation",
                "witness_retains(leaping_horse_freed_francolin_arc) ⇒ PROTECT_SCAFFOLDING_PAINTER_GUILD",
                "SPECKLED_FRANCOLIN_FLIGHT_RATIFIED",
                "ILLUMINATOR_STIPEND_RELEASED",
                "PIGMENT_SPILL_RULED_SPOILAGE",
                "STIPEND_WITHHELD_FOR_BLOT",
            ),
            (
                "P4",
                "Cavalry Hurdle Scuff & Tempera Residue Audit",
                "shards >= 6 ∧ ¬witness_retains(leaping_horse_freed_francolin_arc) ⇒ ARCHIVE_MUTE_DEBRIS",
                "HURDLE_AND_TEMPERA_TRACE_CORROBORATED",
                "FESTIVAL_COMMONS_KEPT_OPEN",
                "UNATTRIBUTED_SHARDS_SWEPT_AT_DUSK",
                "EARLY_CURFEW_LOCKED",
            ),
        ),
        utterances_a=(
            (5, "raissa_bruised_thumb_grumbler", "raissa_polenta_ragout_relay", "awry_ledger_zinc_wineshop",
             "Zinc counter ledger tallies hammered thumbs, broken summer dishes, and awry columns across Raissa."),
            (5, "raissa_polenta_ragout_relay", "raissa_bruised_thumb_grumbler", "awry_ledger_zinc_wineshop",
             "Window child laughs at the shed dog snapping polenta, sparking a kinetic relay right past the zinc bar."),
            (8, "raissa_polenta_ragout_relay", "raissa_jumping_horse_francolin_painter", "awry_ledger_zinc_wineshop",
             "After 4-tick stillness hold, relay leaps from young mason to ragout maid, parasol, and cavalry hurdle."),
            (10, "raissa_jumping_horse_francolin_painter", "raissa_unaware_thread_restretcher", "pergola_ragout_scaffolding",
             "Scaffolding brush unbars the gilded cage: red-and-yellow speckled francolin bursts skyward over 6 shards."),
            (15, "raissa_unaware_thread_restretcher", "raissa_bruised_thumb_grumbler", "freed_francolin_page_sky",
             "Living thread holds fast from child to bird, proving a joyous city breathes inside sad Raissa."),
            (20, "raissa_bruised_thumb_grumbler", "raissa_unaware_thread_restretcher", "awry_ledger_zinc_wineshop",
             "Dual-Affect Charter P1-P4 sealed: pergola relay sanctuary certified and tavern dish fines waived."),
        ),
        utterances_b=(
            (5, "raissa_bruised_thumb_grumbler", "raissa_polenta_ragout_relay", "awry_ledger_zinc_wineshop",
             "Zinc counter ledger tallies hammered thumbs, broken summer dishes, and awry columns across Raissa."),
            (5, "raissa_polenta_ragout_relay", "raissa_bruised_thumb_grumbler", "awry_ledger_zinc_wineshop",
             "Window child laughs at the shed dog snapping polenta, sparking a kinetic relay right past the zinc bar."),
            (11, "raissa_unaware_thread_restretcher", "raissa_bruised_thumb_grumbler", "freed_francolin_page_sky",
             "⊣ FILTER unravels the middle relay: witness recalls only spilled dish shards and an accidental ink fleck."),
            (15, "raissa_polenta_ragout_relay", "raissa_jumping_horse_francolin_painter", "awry_ledger_zinc_wineshop",
             "♁ World preserves the [0.22, -0.09] hurdle gouge, vermilion tempera pool, and all 6 gilded shards."),
            (18, "raissa_jumping_horse_francolin_painter", "raissa_bruised_thumb_grumbler", "pergola_ragout_scaffolding",
             "Without the child-to-horse relay in testimony, open cage paint is docked as manuscript spoilage."),
            (20, "raissa_bruised_thumb_grumbler", "raissa_unaware_thread_restretcher", "awry_ledger_zinc_wineshop",
             "≡ Dual-Affect Charter P1-P4 flipped: monolithic gloom curfew locked and zinc surcharges enforced."),
        ),
        push_window=(3, 7, 8),
        push_agent_id="raissa_polenta_ragout_relay",
        extra_premises=("broken_dish_zinc_spill", "isolated_page_pigment_fleck"),
    )
    return spec, blueprint


# ---------------------------------------------------------------------------
# 3. CITY 51: CECILIA (Ch. 9, Continuous Cities 4, Weaver p. 152)
# ---------------------------------------------------------------------------

def _cecilia_spec_and_blueprint() -> Tuple[CitySwarmSpec, HandmadeCityBlueprint]:
    spec = CitySwarmSpec(
        case_id="city_51_cecilia",
        kind="invisible_city",
        city_index=51,
        city_name="Cecilia",
        title="CECILIA — Low-Sage Traffic Island Continuum (Continuous Cities 4, Weaver p. 152)",
        chapter=9,
        series="Continuous cities",
        series_rank=4,
        weaver_page=152,
        desert_opposed="sharp rural-urban ecological boundary",
        optical_rule="Endless rows of identical pavement swallowing cliffs and sage meadows into a single inescapable traffic island",
        material_nouns=(
            "tinkling_bell_city_wall_gate",
            "cliff_meadow_green_slope",
            "endless_identical_house_rows",
            "odorless_skin_and_bone_goats",
            "rubbish_bin_wastepaper_forage",
            "asphalt_roundabout_kerb",
            "low_sage_traffic_island_tuft",
            "mingled_pasture_and_street_stones",
        ),
        loci=("tinkling_wall_gate_pasture", "endless_identical_house_rows", "low_sage_traffic_island"),
        agents=(
            ScionAgentSpec(
                agent_id="cecilia_stone_blind_urbanite",
                display_moniker="Pasture-Blind Street-Stone Walker",
                afterlight_role="CONTROL",
                role_symbol="⌘",
                primary_op="SYMBOLIZE_INSTITUTIONALIZE",
                op_symbol="≡",
                rig_archetype="hooded_husk",
                polarity="pasture_blind_city_walker",
                home_locus="tinkling_wall_gate_pasture",
                nisba_debt="Names cities solely by stone walls and paved streets while walking oblivious across inter-city pastures until asphalt swallows all",
                emblems=("unrecognized_inter_city_meadows", "mingled_stones_and_grass", "endless_street_directory"),
                base_magnitude=3.0,
                harmonic_ratio=(4, 3),
            ),
            ScionAgentSpec(
                agent_id="cecilia_leaf_seeking_goatherd",
                display_moniker="Cliff-Meadow Transhumant Goatherd",
                afterlight_role="SOURCE",
                role_symbol="☉",
                primary_op="EMIT",
                op_symbol="→",
                rig_archetype="bamboo_stilt",
                polarity="mingled_traffic_island_goatherd",
                home_locus="tinkling_wall_gate_pasture",
                nisba_debt="Knows every pasture herb but zero city names, driving bell-tinkling goats endlessly searching for an exit that no longer exists",
                emblems=("meadow_between_cliffs_green_slope", "frightened_corner_goats", "shepherd_crook_bell"),
                base_magnitude=8.3,
                harmonic_ratio=(5, 4),
            ),
            ScionAgentSpec(
                agent_id="cecilia_wastepaper_goat_waner",
                display_moniker="Wastepaper-Foraging Skin-and-Bone Herd",
                afterlight_role="BODY",
                role_symbol="◉",
                primary_op="ABSORB",
                op_symbol="↓",
                rig_archetype="flour_sack",
                polarity="mingled_traffic_island_goatherd",
                home_locus="endless_identical_house_rows",
                nisba_debt="Absorbs decades of continuous sprawl into gaunt odorless flanks, tugging wastepaper from municipal rubbish bins",
                emblems=("odorless_skin_and_bone_goats", "rubbish_bin_wastepaper_forage", "worn_hoof_asphalt_groove"),
                base_magnitude=7.5,
                harmonic_ratio=(7, 6),
            ),
            ScionAgentSpec(
                agent_id="cecilia_omnipresent_island_merger",
                display_moniker="Low-Sage Traffic-Island Recognizer",
                afterlight_role="REFLECTOR",
                role_symbol="☾",
                primary_op="FILTER",
                op_symbol="⊣",
                rig_archetype="chalk_grain",
                polarity="mingled_traffic_island_goatherd",
                home_locus="low_sage_traffic_island",
                nisba_debt="Identifies the surviving tuft of low sage inside a roaring traffic island where Meadow of the Low Sage and Cecilia have mingled everywhere",
                emblems=("cecilia_is_everywhere", "low_sage_recognized_in_traffic_island", "buried_pasture_toponym"),
                base_magnitude=8.0,
                harmonic_ratio=(9, 8),
            ),
        ),
        clinamen_spec=ClinamenSpec(
            target_rule="Cecilia Transhumance Easement & Buried-Meadow Commons Charter",
            passed_over_solution="Bulldozing the highway grid back into untouched pre-urban cliffs",
            mutated_premise=(
                "At tick 12, ⊣ FILTER in cecilia_omnipresent_island_merger omits 'cliff_pasture_bell_transhumance' "
                "and 'low_sage_traffic_island_tuft', reading the traffic island solely as municipal concrete median "
                "even while crushed sage oil, hoof scuff, and 6 kerbstone-and-bell shards persist in ♁ World."
            ),
            swerve_tick=12,
            witness_agent_id="cecilia_omnipresent_island_merger",
            filtered_premises=("cliff_pasture_bell_transhumance", "low_sage_traffic_island_tuft"),
        ),
        clinamen_inquiry={
            "T1_substrate_anchor": (
                "Calvino's Cecilia (Continuous Cities 4, Weaver p. 152): tinkling goat bells inside city walls, "
                "Meadow Between the Cliffs, Green Slope, Meadow of the Low Sage, endless identical house rows, "
                "odorless goats pulling wastepaper from rubbish bins, sage blades in a traffic island."
            ),
            "T2_lawful_rule": (
                "Even when continuous pavement swallows rival cities into omnipresent Cecilia, surviving botanical "
                "traces inside traffic islands anchor ancestral grazing commons and transhumance rights."
            ),
            "T3_clinamen_swerve": (
                "At tick 12, ⊣ FILTER in cecilia_omnipresent_island_merger drops the low-sage botanical referent "
                "and bell-gate origin, leaving only numbered asphalt sectors and wastepaper litter."
            ),
            "T4_material_trace_vs_memory": (
                "♁ World preserves hoof-and-crook scuff_vector=[0.19, 0.06], crushed sage essential-oil spread, "
                "and 6 chipped kerbstone/bronze-bell shards; ☾ Witness bows to total street enclosure."
            ),
            "T5_institutional_consequence": (
                "Commons Charter P1-P4 flips from protecting Traffic-Island Herb Sanctuaries and Herdsman Passage "
                "to impounding stray goats and paving over the last median strips."
            ),
            "better_question_test": {
                "Original_Question": (
                    "Where does the city of Cecilia end and the surrounding countryside of pastures begin?"
                ),
                "Exposed_Assumption": (
                    "Assumes urban stone and rural pasture remain mutually external territories separated by gates "
                    "rather than interpenetrating inside the same paved continuum."
                ),
                "Discovered_Better_Question": (
                    "Once planetary urbanization makes 'inside Cecilia' indistinguishable from 'everywhere,' what "
                    "botanical and witness practices can still recover buried commons inside the median strips of "
                    "total infrastructure?"
                ),
            },
        },
        thick_telemetry={
            "thin_machine_telemetry": "1.1 Hz | 42ms | bronze bell clink | Δkerb=+0.190 | kerb_shards=6 | Δt_sync=1.6ms",
            "thick_over_the_shoulder": (
                "Beside the roaring roundabout: pinching a dusty grey-green blade between thumb and forefinger reveals "
                "Meadow of the Low Sage underneath six lanes of asphalt—unless the surveyor's ledger logs it as "
                "unmowed median weeds."
            ),
        },
    )

    blueprint = HandmadeCityBlueprint(
        actor_stations={
            "cecilia_stone_blind_urbanite": (0.28, 0.58, 0.28, -0.18, 0.24, "recoil", "hold_still", "cecilia_leaf_seeking_goatherd", "cecilia_omnipresent_island_merger"),
            "cecilia_leaf_seeking_goatherd": (0.44, 0.54, 0.22, 0.20, -0.16, "help", "avoid", "cecilia_wastepaper_goat_waner", "cecilia_stone_blind_urbanite"),
            "cecilia_wastepaper_goat_waner": (0.62, 0.64, 0.20, 0.15, -0.25, "help", "recoil", "cecilia_omnipresent_island_merger", "cecilia_stone_blind_urbanite"),
            "cecilia_omnipresent_island_merger": (0.52, 0.72, 0.15, -0.34, 0.35, "accuse", "reroute", "cecilia_stone_blind_urbanite", "cecilia_stone_blind_urbanite"),
        },
        residues=(
            [0.19, 0.06],
            0.048,
            [
                [0.492, 0.668, 0.22],
                [0.528, 0.684, -0.86],
                [0.556, 0.652, 1.04],
                [0.468, 0.695, -0.51],
                [0.584, 0.676, 0.63],
                [0.512, 0.638, -1.19],
            ],
            0.84,
        ),
        offscreen_processes=(
            ("endless_identical_suburb_avenue_lamps", "switching_on_to_horizon", 0.07, 0.036),
            ("municipal_rubbish_bin_paper_rustle", "wind_lifting_torn_newsprint", 0.05, 0.034),
            ("buried_cliff_spring_seepage", "percolating_under_ring_road", 0.04, 0.037),
        ),
        sensory_profile=(0.24, 0.25, 0.14, 29.5, 55.0, 1.6),
        policies=(
            (
                "P1",
                "Meadow of the Low Sage Toponymic Survival",
                "witness_retains(low_sage_traffic_island_tuft) ∧ sage_oil > 0.14 ⇒ REGISTER_PASTURE_COMMONS",
                "LOW_SAGE_COMMONS_RECOGNIZED_IN_MEDIAN",
                "TRAFFIC_ISLAND_HERB_PROTECTED",
                "MEDIAN_CLASSIFIED_STERILE_CONCRETE",
                "HERB_STRIP_SLATED_FOR_ASPHALT",
            ),
            (
                "P2",
                "Transhumant Goatherd Right-of-Passage",
                "witness_retains(cliff_pasture_bell_transhumance) ⇒ GRANT_CONTINUOUS_HERD_CORRIDOR",
                "MINGLED_PASTURE_TRANSIT_UPHELD",
                "HERDSMAN_EXEMPT_FROM_STREET_TOLL",
                "STRAY_LIVESTOCK_ORDINANCE_TRIGGERED",
                "GOAT_HERD_IMPOUNDMENT_ORDERED",
            ),
            (
                "P3",
                "Wastepaper Bin Forage Emergency Ration",
                "witness_retains(low_sage_traffic_island_tuft) ⇒ FUND_FODDER_REPLENISHMENT",
                "PASTURE_LOSS_INDEMNIFIED_BY_CITY",
                "SAGE_AND_HAY_RATION_ISSUED",
                "RUBBISH_FORAGE_CITED_AS_NUISANCE",
                "SANITATION_FINE_LEVIED",
            ),
            (
                "P4",
                "Kerbstone & Bell-Bronze Fragment Audit",
                "shards >= 6 ∧ ¬witness_retains(cliff_pasture_bell_transhumance) ⇒ LOG_MUTE_TRAFFIC_DEBRIS",
                "TRANSHUMANCE_KERB_TRACE_CORROBORATED",
                "ROUNDABOUT_SPEED_CURBED",
                "UNATTRIBUTED_KERB_CHIPS_SWEPT",
                "FULL_HIGHWAY_THROUGHPUT_LOCKED",
            ),
        ),
        utterances_a=(
            (5, "cecilia_stone_blind_urbanite", "cecilia_leaf_seeking_goatherd", "tinkling_wall_gate_pasture",
             "Every stone wall and street plaque belongs to Cecilia; pastures outside have no civic standing."),
            (5, "cecilia_leaf_seeking_goatherd", "cecilia_stone_blind_urbanite", "tinkling_wall_gate_pasture",
             "My goats know Meadow Between the Cliffs and Green Slope by leaf scent, never your street plaques."),
            (8, "cecilia_leaf_seeking_goatherd", "cecilia_wastepaper_goat_waner", "tinkling_wall_gate_pasture",
             "After 4-tick gate hold, shepherd crook drives the frightened herd across endless identical pavement."),
            (10, "cecilia_wastepaper_goat_waner", "cecilia_omnipresent_island_merger", "endless_identical_house_rows",
             "Skin-and-bone hooves chip 6 kerbstone-and-bell shards [0.19, 0.06] beside a traffic island."),
            (16, "cecilia_omnipresent_island_merger", "cecilia_stone_blind_urbanite", "low_sage_traffic_island",
             "Places have mingled: Cecilia is everywhere, yet here survives the Meadow of the Low Sage!"),
            (20, "cecilia_stone_blind_urbanite", "cecilia_omnipresent_island_merger", "tinkling_wall_gate_pasture",
             "Commons Charter P1-P4 sealed: low-sage traffic island protected and transhumant passage upheld."),
        ),
        utterances_b=(
            (5, "cecilia_stone_blind_urbanite", "cecilia_leaf_seeking_goatherd", "tinkling_wall_gate_pasture",
             "Every stone wall and street plaque belongs to Cecilia; pastures outside have no civic standing."),
            (5, "cecilia_leaf_seeking_goatherd", "cecilia_stone_blind_urbanite", "tinkling_wall_gate_pasture",
             "My goats know Meadow Between the Cliffs and Green Slope by leaf scent, never your street plaques."),
            (12, "cecilia_omnipresent_island_merger", "cecilia_stone_blind_urbanite", "low_sage_traffic_island",
             "⊣ FILTER drops pasture bells and low sage: witness logs only concrete median and wastepaper bins."),
            (16, "cecilia_wastepaper_goat_waner", "cecilia_leaf_seeking_goatherd", "endless_identical_house_rows",
             "♁ World retains crushed sage essential oil, [0.19, 0.06] hoof scuff, and all 6 kerbstone shards."),
            (18, "cecilia_leaf_seeking_goatherd", "cecilia_stone_blind_urbanite", "tinkling_wall_gate_pasture",
             "With no recognized herb meadow on record, municipal wardens corral the gaunt goats at the roundabout."),
            (20, "cecilia_stone_blind_urbanite", "cecilia_omnipresent_island_merger", "tinkling_wall_gate_pasture",
             "≡ Commons Charter P1-P4 flipped: median slated for asphalt and stray herd impoundment ordered."),
        ),
        push_window=(3, 7, 8),
        push_agent_id="cecilia_leaf_seeking_goatherd",
        extra_premises=("endless_numbered_street_sign", "rubbish_bin_wastepaper_forage"),
    )
    return spec, blueprint


# ---------------------------------------------------------------------------
# 4. CITY 52: MAROZIA (Ch. 9, Hidden Cities 3, Weaver p. 154)
# ---------------------------------------------------------------------------

def _marozia_spec_and_blueprint() -> Tuple[CitySwarmSpec, HandmadeCityBlueprint]:
    spec = CitySwarmSpec(
        case_id="city_52_marozia",
        kind="invisible_city",
        city_index=52,
        city_name="Marozia",
        title="MAROZIA — Sibyl's Rat Tunnel & Swallow Horizon Crack (Hidden Cities 3, Weaver p. 154)",
        chapter=9,
        series="Hidden cities",
        series_rank=3,
        weaver_page=154,
        desert_opposed="programmed ideological utopia decree",
        optical_rule="Mold-soldered stone passages splitting open for one unforced instant into dragonfly-wing crystal",
        material_nouns=(
            "leaden_rat_pack_tunnels",
            "mold_soldered_stone_vaults",
            "gnawed_tunnel_leftovers",
            "lowered_canopy_black_umbrellas",
            "flapping_batlike_overcoats",
            "dragonfly_pupa_transparent_wing",
            "crystalline_wall_fissure",
            "swallow_tail_horizon_arc",
        ),
        loci=("leaden_rat_pack_passages", "bat_umbrella_overcoat_plaza", "crystalline_wall_crack"),
        agents=(
            ScionAgentSpec(
                agent_id="marozia_voracious_rat_tunnel_runner",
                display_moniker="Leaden Mold-Vault Pack Scrambler",
                afterlight_role="BODY",
                role_symbol="◉",
                primary_op="ABSORB",
                op_symbol="↓",
                rig_archetype="flour_sack",
                polarity="leaden_rat_overcoat_tunnel",
                home_locus="leaden_rat_pack_passages",
                nisba_debt="Hurries in tight underground packs through leaden passages soldered by mold, snatching leftovers from bolder runners",
                emblems=("gnawed_tunnel_leftovers", "soldered_stone_mold_ceiling", "leaden_vault_rush"),
                base_magnitude=2.8,
                harmonic_ratio=(16, 15),
            ),
            ScionAgentSpec(
                agent_id="marozia_suspicious_umbrella_flapper",
                display_moniker="Bat-Overcoat & Lowered-Canopy Magistrate",
                afterlight_role="CONTROL",
                role_symbol="⌘",
                primary_op="SYMBOLIZE_INSTITUTIONALIZE",
                op_symbol="≡",
                rig_archetype="hooded_husk",
                polarity="leaden_rat_overcoat_tunnel",
                home_locus="bat_umbrella_overcoat_plaza",
                nisba_debt="Proclaims the Sibyl's Swallow Century fulfilled by official decree while still lowering black umbrella canopies and flapping batlike overcoats",
                emblems=("lowered_canopy_umbrellas", "flapping_batlike_overcoats", "decreed_utopia_placard"),
                base_magnitude=6.4,
                harmonic_ratio=(7, 6),
            ),
            ScionAgentSpec(
                agent_id="marozia_unforced_pleasure_opener",
                display_moniker="Unforced Shared-Pleasure Fissure Opener",
                afterlight_role="SOURCE",
                role_symbol="☉",
                primary_op="EMIT",
                op_symbol="→",
                rig_archetype="pinhead_lens",
                polarity="chance_dragonfly_swallow_crack",
                home_locus="leaden_rat_pack_passages",
                nisba_debt="Pauses in the tunnel for someone doing a task out of sheer shared pleasure, splitting leaden stone into dragonfly-wing crystal",
                emblems=("sheer_pleasure_shared_gesture", "dragonfly_transparent_transfiguration", "pupa_shell_split"),
                base_magnitude=9.0,
                harmonic_ratio=(5, 4),
            ),
            ScionAgentSpec(
                agent_id="marozia_swallow_horizon_flicker",
                display_moniker="Sibylline Swallow-Tail Horizon Witness",
                afterlight_role="REFLECTOR",
                role_symbol="☾",
                primary_op="FILTER",
                op_symbol="⊣",
                rig_archetype="mirror_obverse",
                polarity="chance_dragonfly_swallow_crack",
                home_locus="crystalline_wall_crack",
                nisba_debt="Catches oblique wall-crack glimpses where the second Marozia frees itself from the first with the flick of a swallow's tail",
                emblems=("tail_flick_opening_horizon", "second_city_freeing_from_first", "oblique_crystal_glimpse"),
                base_magnitude=8.7,
                harmonic_ratio=(2, 1),
            ),
        ),
        clinamen_spec=ClinamenSpec(
            target_rule="Sibyl's Twin-Marozia Oracle & Unforced Transfiguration Charter",
            passed_over_solution="Demolishing the stone vaults or banning umbrellas by police edict",
            mutated_premise=(
                "At tick 11, ⊣ FILTER in marozia_swallow_horizon_flicker drops 'unforced_shared_pleasure_gesture' "
                "and 'fleeting_dragonfly_wall_fissure', replacing fragile emergence with 'official_swallow_era_fulfilled' "
                "even while quartz-mold shards, amber sap seep, and fissure scuff persist in ♁ World."
            ),
            swerve_tick=11,
            witness_agent_id="marozia_swallow_horizon_flicker",
            filtered_premises=("unforced_shared_pleasure_gesture", "fleeting_dragonfly_wall_fissure"),
        ),
        clinamen_inquiry={
            "T1_substrate_anchor": (
                "Calvino's Marozia (Hidden Cities 3, Weaver pp. 154-155): Sibyl's two cities (rat and swallow), "
                "leaden passages, mold-soldered stones, batlike overcoats, lowered umbrella canopies, dragonfly pupa "
                "transparency, and swallow-tail horizon flick."
            ),
            "T2_lawful_rule": (
                "The City of the Swallow is never a completed state that abolishes the City of the Rat, but an "
                "unforced crack of shared pleasure glimpsed obliquely inside it."
            ),
            "T3_clinamen_swerve": (
                "At tick 11, ⊣ FILTER in marozia_swallow_horizon_flicker omits the unforced contingent gesture, "
                "hardening the Sibyl's prophecy into a smug bureaucratic proclamation that the Swallow Century has arrived."
            ),
            "T4_material_trace_vs_memory": (
                "♁ World retains wall-split scuff_vector=[-0.21, -0.07], luminous resin seep, and 6 fallen mold-and-quartz "
                "voussoir shards; ☾ Witness aligns with the bat-overcoat magistrate."
            ),
            "T5_institutional_consequence": (
                "Sibylline Charter P1-P4 flips from protecting Unscripted Commons Intervals and Open Vault Cracks "
                "to enforcing Compulsory Swallow-Era Loyalty while batlike umbrella surveillance resumes."
            ),
            "better_question_test": {
                "Original_Question": (
                    "When will the Sibyl's prophecy come true so the City of the Swallow permanently replaces the "
                    "City of the Rat?"
                ),
                "Exposed_Assumption": (
                    "Assumes liberation arrives as an irreversible calendar epoch that stays triumphant once proclaimed, "
                    "rather than a fragile relational act that vanishes the moment bureaucracy claims credit for it."
                ),
                "Discovered_Better_Question": (
                    "Why does proclaiming a utopia officially achieved immediately reinstate rat-tunnel suspicion under "
                    "swallow banners, and how can civic form shelter unforced cracks without petrifying them into dogma?"
                ),
            },
        },
        thick_telemetry={
            "thin_machine_telemetry": "1.4 Hz | 31ms | quartz fissure ping | Δcrack=-0.210 | quartz_shards=6 | Δt_sync=1.5ms",
            "thick_over_the_shoulder": (
                "Beneath the mold-soldered arch: handing a chisel to a neighbor without counting ledger shares cracks "
                "the leaden ceiling into dragonfly glass—until the plaza magistrate stamps 'Swallow Era Achieved' and "
                "snaps his black umbrella canopy shut."
            ),
        },
    )

    blueprint = HandmadeCityBlueprint(
        actor_stations={
            "marozia_voracious_rat_tunnel_runner": (0.26, 0.66, 0.28, 0.16, -0.22, "help", "recoil", "marozia_unforced_pleasure_opener", "marozia_suspicious_umbrella_flapper"),
            "marozia_suspicious_umbrella_flapper": (0.72, 0.60, 0.26, -0.26, 0.24, "recoil", "hold_still", "marozia_swallow_horizon_flicker", "marozia_swallow_horizon_flicker"),
            "marozia_unforced_pleasure_opener": (0.44, 0.52, 0.22, 0.22, -0.15, "help", "avoid", "marozia_swallow_horizon_flicker", "marozia_suspicious_umbrella_flapper"),
            "marozia_swallow_horizon_flicker": (0.56, 0.44, 0.16, -0.35, 0.36, "accuse", "reroute", "marozia_suspicious_umbrella_flapper", "marozia_suspicious_umbrella_flapper"),
        },
        residues=(
            [-0.21, -0.07],
            0.054,
            [
                [0.472, 0.484, -0.66],
                [0.506, 0.452, 0.88],
                [0.538, 0.496, -1.04],
                [0.448, 0.518, 0.39],
                [0.564, 0.468, 1.15],
                [0.492, 0.534, -0.31],
            ],
            0.90,
        ),
        offscreen_processes=(
            ("mold_ceiling_condensation_drip", "leaden_vault_mineral_seep", 0.06, 0.035),
            ("bat_overcoat_plaza_gust", "umbrella_rib_rustle_in_draft", 0.08, 0.034),
            ("high_swallow_migration_parabola", "horizon_wing_arc_beyond_wall", 0.04, 0.039),
        ),
        sensory_profile=(0.27, 0.21, 0.13, 47.0, 44.0, 1.5),
        policies=(
            (
                "P1",
                "Sibylline Twin-City Non-Closure Clause",
                "witness_retains(fleeting_dragonfly_wall_fissure) ⇒ BAR_TRIUMPHALIST_CLOSURE",
                "EMERGENT_SWALLOW_CRACK_PROTECTED",
                "VAULT_SKYLIGHT_FISSURE_KEPT_OPEN",
                "SWALLOW_CENTURY_DECLARED_COMPLETE",
                "MOLD_VAULTS_RESEALED_AS_MONUMENTS",
            ),
            (
                "P2",
                "Unforced Shared-Labor Exemption",
                "witness_retains(unforced_shared_pleasure_gesture) ⇒ EXEMPT_GIFT_WORK_FROM_QUOTA",
                "SPONTANEOUS_CRAFT_GRACE_RECOGNIZED",
                "GUILD_QUOTA_SURCHARGE_WAIVED",
                "UNSCRIPTED_PAUSE_RULED_DEVIATION",
                "TUNNEL_QUOTA_DISCIPLINE_ENFORCED",
            ),
            (
                "P3",
                "Umbrella-Canopy Surveillance Restraint",
                "witness_retains(fleeting_dragonfly_wall_fissure) ⇒ SUSPEND_OVERCOAT_PATROLS",
                "OPEN_HORIZON_SIGHTLINE_GRANTED",
                "PLAZA_PATROL_DISBANDED",
                "BAT_OVERCOAT_WARDENS_DEPUTIZED",
                "SURVEILLANCE_STIPEND_APPROVED",
            ),
            (
                "P4",
                "Quartz-and-Mold Voussoir Fracture Audit",
                "shards >= 6 ∧ ¬witness_retains(unforced_shared_pleasure_gesture) ⇒ SOLDER_CRACK_SHUT",
                "DRAGONFLY_TRANSFIGURATION_SCAR_VERIFIED",
                "CRYSTAL_SEAM_PRESERVED",
                "UNATTRIBUTED_CEILING_SPALL_GROUTED",
                "LEAD_SOLDER_REPAIR_FUNDED",
            ),
        ),
        utterances_a=(
            (5, "marozia_voracious_rat_tunnel_runner", "marozia_unforced_pleasure_opener", "leaden_rat_pack_passages",
             "Leaden mold ceiling presses low; every runner snatches tunnel scraps before the next pack arrives."),
            (5, "marozia_unforced_pleasure_opener", "marozia_voracious_rat_tunnel_runner", "leaden_rat_pack_passages",
             "Pause beside the bench: shared work done for sheer pleasure thins leaden stone toward dragonfly wing."),
            (8, "marozia_unforced_pleasure_opener", "marozia_swallow_horizon_flicker", "leaden_rat_pack_passages",
             "After 4-tick unforced stillness, shared gesture splits [-0.21, -0.07] across the mold-soldered vault."),
            (10, "marozia_swallow_horizon_flicker", "marozia_suspicious_umbrella_flapper", "crystalline_wall_crack",
             "Six quartz-and-mold shards fall away as a swallow-tail flick opens clear sky inside the rat city."),
            (16, "marozia_swallow_horizon_flicker", "marozia_suspicious_umbrella_flapper", "crystalline_wall_crack",
             "Second Marozia lives only while unforced; no magistrate may freeze this crack into state decree."),
            (20, "marozia_suspicious_umbrella_flapper", "marozia_swallow_horizon_flicker", "bat_umbrella_overcoat_plaza",
             "Sibylline Charter P1-P4 sealed: crystal wall crack kept open and overcoat patrols disbanded."),
        ),
        utterances_b=(
            (5, "marozia_voracious_rat_tunnel_runner", "marozia_unforced_pleasure_opener", "leaden_rat_pack_passages",
             "Leaden mold ceiling presses low; every runner snatches tunnel scraps before the next pack arrives."),
            (5, "marozia_unforced_pleasure_opener", "marozia_voracious_rat_tunnel_runner", "leaden_rat_pack_passages",
             "Pause beside the bench: shared work done for sheer pleasure thins leaden stone toward dragonfly wing."),
            (11, "marozia_swallow_horizon_flicker", "marozia_suspicious_umbrella_flapper", "crystalline_wall_crack",
             "⊣ FILTER forgets the unforced gesture: chronicle proclaims the Swallow Century officially achieved."),
            (15, "marozia_unforced_pleasure_opener", "marozia_voracious_rat_tunnel_runner", "leaden_rat_pack_passages",
             "♁ World retains luminous resin seep, [-0.21, -0.07] fissure scuff, and all 6 quartz-mold shards."),
            (18, "marozia_voracious_rat_tunnel_runner", "marozia_suspicious_umbrella_flapper", "leaden_rat_pack_passages",
             "Under the Swallow banner, citizens lower umbrella canopies and scramble through leaden tunnels again."),
            (20, "marozia_suspicious_umbrella_flapper", "marozia_swallow_horizon_flicker", "bat_umbrella_overcoat_plaza",
             "≡ Sibylline Charter P1-P4 flipped: crack grouted shut with lead solder and overcoat wardens deputized."),
        ),
        push_window=(3, 7, 8),
        push_agent_id="marozia_unforced_pleasure_opener",
        extra_premises=("official_swallow_era_fulfilled", "lowered_umbrella_plaza_march"),
    )
    return spec, blueprint


# ---------------------------------------------------------------------------
# 5. CITY 53: PENTHESILEA (Ch. 9, Continuous Cities 5, Weaver p. 156)
# ---------------------------------------------------------------------------

def _penthesilea_spec_and_blueprint() -> Tuple[CitySwarmSpec, HandmadeCityBlueprint]:
    spec = CitySwarmSpec(
        case_id="city_53_penthesilea",
        kind="invisible_city",
        city_index=53,
        city_name="Penthesilea",
        title="PENTHESILEA — Soupy Outskirts Without Center or Outside (Continuous Cities 5, Weaver p. 156)",
        chapter=9,
        series="Continuous cities",
        series_rank=5,
        weaver_page=156,
        desert_opposed="walled threshold archway certainty",
        optical_rule="Milky swamp-soup pallor over corrugated-iron sheds, rusty Ferris wheel, and freckled suburb lights",
        material_nouns=(
            "soupy_milky_swamp_plain",
            "snaggle_toothed_comb_facades",
            "corrugated_iron_customs_sheds",
            "rusty_carnival_ferris_wheel",
            "shambles_workshops_cemetery_belt",
            "contradictory_oblique_pointing_arms",
            "opaque_horizon_polyhedrons",
            "freckled_suburb_window_lights",
        ),
        loci=("corrugated_swamp_approach", "ferris_shambles_workshop_belt", "opaque_polyhedron_horizon"),
        agents=(
            ScionAgentSpec(
                agent_id="penthesilea_threshold_eraser",
                display_moniker="Shallow Comb-Facade & Swamp Diluter",
                afterlight_role="WORLD",
                role_symbol="♁",
                primary_op="STORE_RELEASE",
                op_symbol="↻",
                rig_archetype="chalk_grain",
                polarity="diluted_snaggle_comb_outskirts",
                home_locus="corrugated_swamp_approach",
                nisba_debt="Dissolves walled archways into hours of mangy fields, pale comb-backed facades, and corrugated sheds diluted across the plain",
                emblems=("no_customs_archway_girdle", "soupy_plain_mangy_fields", "snaggle_toothed_shallow_facades"),
                base_magnitude=8.5,
                harmonic_ratio=(9, 8),
            ),
            ScionAgentSpec(
                agent_id="penthesilea_oblique_arm_pointer",
                display_moniker="Three-Way Oblique Crossroads Pointer",
                afterlight_role="SOURCE",
                role_symbol="☉",
                primary_op="EMIT",
                op_symbol="→",
                rig_archetype="bamboo_stilt",
                polarity="contradictory_oblique_arm_gestures",
                home_locus="corrugated_swamp_approach",
                nisba_debt="Answers 'Where is Penthesilea?' with broad contradictory arm sweeps pointing Here, Farther on, and Opposite simultaneously",
                emblems=("broad_gesture_here_farther_opposite", "opaque_horizon_polyhedrons", "crossroads_rut_pivot"),
                base_magnitude=3.1,
                harmonic_ratio=(7, 5),
            ),
            ScionAgentSpec(
                agent_id="penthesilea_shambles_carnival_stringer",
                display_moniker="Rusty Ferris-Wheel & Shambles Stringer",
                afterlight_role="CULTURE",
                role_symbol="⌂",
                primary_op="SYMBOLIZE_INSTITUTIONALIZE",
                op_symbol="≡",
                rig_archetype="brass_cog",
                polarity="diluted_snaggle_comb_outskirts",
                home_locus="ferris_shambles_workshop_belt",
                nisba_debt="Strings cemeteries, shambles, workshops, and a rusted carnival Ferris wheel across indistinguishable suburban belts",
                emblems=("rusty_workshops_cemetery_shambles", "freckled_suburb_night_windows", "ferris_axle_grease"),
                base_magnitude=7.3,
                harmonic_ratio=(4, 3),
            ),
            ScionAgentSpec(
                agent_id="penthesilea_outside_limbo_questioner",
                display_moniker="Global-Limbo Outskirts Witness",
                afterlight_role="REFLECTOR",
                role_symbol="☾",
                primary_op="FILTER",
                op_symbol="⊣",
                rig_archetype="plumb_bob",
                polarity="diluted_snaggle_comb_outskirts",
                home_locus="opaque_polyhedron_horizon",
                nisba_debt="Tests whether Penthesilea is only the outskirts of itself with neither hidden center nor true outside beyond its milky mist",
                emblems=("penthesilea_only_outskirts_of_itself", "inescapable_global_limbo", "abandoned_exit_search"),
                base_magnitude=8.2,
                harmonic_ratio=(16, 15),
            ),
        ),
        clinamen_spec=ClinamenSpec(
            target_rule="Penthesilea Centerless Transit & Octroi-Suspension Charter",
            passed_over_solution="Erecting artificial medieval walls around a random corrugated shed",
            mutated_premise=(
                "At tick 12, ⊣ FILTER in penthesilea_outside_limbo_questioner omits 'contradictory_three_way_gestures' "
                "and 'centerless_outskirts_topology', canonizing a single oblique arm toward opaque horizon polyhedrons "
                "as 'citadel_customs_axis' while swamp grease, crossroads scuff, and 6 tin/Ferris shards persist in ♁ World."
            ),
            swerve_tick=12,
            witness_agent_id="penthesilea_outside_limbo_questioner",
            filtered_premises=("contradictory_three_way_gestures", "centerless_outskirts_topology"),
        ),
        clinamen_inquiry={
            "T1_substrate_anchor": (
                "Calvino's Penthesilea (Continuous Cities 5, Weaver pp. 156-157): soupy plain, pale comb-like shallow "
                "buildings, corrugated-iron sheds, cemetery, carnival with rusty Ferris wheel, shambles, contradictory "
                "pointing arms, and opaque polyhedrons on the horizon."
            ),
            "T2_lawful_rule": (
                "Because Penthesilea is exclusively the outskirts of itself without thicker core or exterior gate, "
                "no belt may levy central citadel octroi tolls upon travelers."
            ),
            "T3_clinamen_swerve": (
                "At tick 12, ⊣ FILTER in penthesilea_outside_limbo_questioner drops two of the three contradictory "
                "arm vectors, mistaking distant horizon polyhedrons for an authoritative city center."
            ),
            "T4_material_trace_vs_memory": (
                "♁ World retains three-pronged crossroads scuff_vector=[-0.18, 0.11], spreading Ferris axle-grease "
                "slick, and 6 rusted corrugated-iron and spoke shards; ☾ Plumb Witness tilts toward phantom octroi."
            ),
            "T5_institutional_consequence": (
                "Transit Charter P1-P4 flips from Open Outskirts Free-Passage and Toll Prohibition to Phantom Citadel "
                "Octroi Extraction at every corrugated shed."
            ),
            "better_question_test": {
                "Original_Question": (
                    "Which road through Penthesilea's scattered suburbs finally leads into its true central square "
                    "or back out to open country?"
                ),
                "Exposed_Assumption": (
                    "Assumes every urban settlement possesses a topological interior and exterior rather than diffusing "
                    "into a planetary limbo of pure periphery."
                ),
                "Discovered_Better_Question": (
                    "When a metropolis dissolves into centerless outskirts yet fiscal authorities still tax citizens "
                    "for approaching a nonexistent core, how do we audit phantom centrality amidst contradictory signs?"
                ),
            },
        },
        thick_telemetry={
            "thin_machine_telemetry": "0.9 Hz | 46ms | rusted spoke creak | Δcrossroads=-0.180 | tin_shards=6 | Δt_sync=1.7ms",
            "thick_over_the_shoulder": (
                "Under the stalled Ferris wheel: when three locals point 'Here,' 'Farther,' and 'Back there,' recording "
                "only one vector on the customs map invents a lucrative tollbooth gate out of milky swamp mist."
            ),
        },
    )

    blueprint = HandmadeCityBlueprint(
        actor_stations={
            "penthesilea_threshold_eraser": (0.24, 0.62, 0.28, 0.15, -0.18, "help", "idle", "penthesilea_outside_limbo_questioner", "penthesilea_shambles_carnival_stringer"),
            "penthesilea_oblique_arm_pointer": (0.42, 0.54, 0.22, 0.26, -0.24, "help", "reroute", "penthesilea_outside_limbo_questioner", "penthesilea_shambles_carnival_stringer"),
            "penthesilea_shambles_carnival_stringer": (0.62, 0.58, 0.25, -0.22, 0.28, "recoil", "hold_still", "penthesilea_outside_limbo_questioner", "penthesilea_outside_limbo_questioner"),
            "penthesilea_outside_limbo_questioner": (0.76, 0.66, 0.16, -0.34, 0.35, "accuse", "reroute", "penthesilea_shambles_carnival_stringer", "penthesilea_shambles_carnival_stringer"),
        },
        residues=(
            [-0.18, 0.11],
            0.056,
            [
                [0.442, 0.582, 0.48],
                [0.512, 0.614, -0.92],
                [0.578, 0.566, 1.16],
                [0.634, 0.628, -0.37],
                [0.486, 0.648, 0.74],
                [0.668, 0.592, -1.08],
            ],
            0.82,
        ),
        offscreen_processes=(
            ("rusty_ferris_wheel_wind_oscillation", "empty_gondola_creak_in_fog", 0.05, 0.034),
            ("freckled_suburb_window_flicker", "pale_plain_scatter_at_dusk", 0.08, 0.036),
            ("next_limbo_ring_road_hum", "endless_bypass_beyond_swamp", 0.06, 0.035),
        ),
        sensory_profile=(0.23, 0.24, 0.17, 26.0, 50.0, 1.7),
        policies=(
            (
                "P1",
                "Centerless Outskirts Topological Finding",
                "witness_retains(centerless_outskirts_topology) ⇒ SUSPEND_CITADEL_OCTROI",
                "PURE_PERIPHERY_CONFIRMED_NO_CORE",
                "OCTROI_TOLL_BARRED_CITYWIDE",
                "PHANTOM_CITADEL_AXIS_CANONIZED",
                "INBOUND_GATE_TARIFF_LEVIED",
            ),
            (
                "P2",
                "Contradictory Signpost Non-Arbitration Rule",
                "witness_retains(contradictory_three_way_gestures) ⇒ FORBID_SINGLE_VECTOR_MANDATE",
                "THREE_WAY_GESTURE_PARITY_RECORDED",
                "TRAVELER_FREE_DETOUR_RIGHT",
                "SINGLE_POLYHEDRON_ROUTE_MANDATED",
                "DETOUR_FINE_ASSESSED",
            ),
            (
                "P3",
                "Carnival-Shambles Belt Maintenance",
                "witness_retains(centerless_outskirts_topology) ⇒ ALLOCATE_PERIPHERAL_DRAINAGE",
                "SWAMP_OUTSKIRTS_DRAINAGE_FUNDED",
                "SHED_AND_WHEEL_REPAIR_GRANTED",
                "FUNDS_DIVERTED_TO_PHANTOM_PIAZZA",
                "OUTSKIRTS_LEFT_IN_SWAMP_SOUP",
            ),
            (
                "P4",
                "Corrugated-Tin & Spoke Residue Audit",
                "shards >= 6 ∧ ¬witness_retains(contradictory_three_way_gestures) ⇒ MISINDEX_CROSSROADS_RUT",
                "MULTI_DIRECTIONAL_RUT_CORROBORATED",
                "CUSTOMS_BARRIER_REMOVED",
                "RUT_READ_AS_CUSTOMS_BREACH",
                "CORRUGATED_CHECKPOINT_ERECTED",
            ),
        ),
        utterances_a=(
            (5, "penthesilea_threshold_eraser", "penthesilea_oblique_arm_pointer", "corrugated_swamp_approach",
             "Shallow comb-backed facades and mangy fields dilute across the soupy plain without wall or girdle."),
            (5, "penthesilea_oblique_arm_pointer", "penthesilea_threshold_eraser", "corrugated_swamp_approach",
             "Ask where Penthesilea lies and our arms sweep Here, Farther on, and Opposite in the same breath."),
            (8, "penthesilea_oblique_arm_pointer", "penthesilea_shambles_carnival_stringer", "corrugated_swamp_approach",
             "After 4-tick crossroads stillness, broad pointing lunge carves [-0.18, 0.11] into milky swamp mud."),
            (10, "penthesilea_shambles_carnival_stringer", "penthesilea_outside_limbo_questioner", "ferris_shambles_workshop_belt",
             "Rusty Ferris wheel and shambles shed 6 tin-and-spoke shards beside spreading axle grease."),
            (16, "penthesilea_outside_limbo_questioner", "penthesilea_shambles_carnival_stringer", "opaque_polyhedron_horizon",
             "Penthesilea is only the outskirts of itself; no hidden citadel exists to tax travelers."),
            (20, "penthesilea_shambles_carnival_stringer", "penthesilea_outside_limbo_questioner", "ferris_shambles_workshop_belt",
             "Transit Charter P1-P4 sealed: octroi tolls barred and swamp outskirts drainage funded."),
        ),
        utterances_b=(
            (5, "penthesilea_threshold_eraser", "penthesilea_oblique_arm_pointer", "corrugated_swamp_approach",
             "Shallow comb-backed facades and mangy fields dilute across the soupy plain without wall or girdle."),
            (5, "penthesilea_oblique_arm_pointer", "penthesilea_threshold_eraser", "corrugated_swamp_approach",
             "Ask where Penthesilea lies and our arms sweep Here, Farther on, and Opposite in the same breath."),
            (12, "penthesilea_outside_limbo_questioner", "penthesilea_shambles_carnival_stringer", "opaque_polyhedron_horizon",
             "⊣ FILTER drops two pointing vectors: witness treats distant horizon polyhedrons as central citadel."),
            (16, "penthesilea_threshold_eraser", "penthesilea_oblique_arm_pointer", "corrugated_swamp_approach",
             "♁ World retains three-way [-0.18, 0.11] mud scuff, axle-grease slick, and all 6 rusted tin shards."),
            (18, "penthesilea_oblique_arm_pointer", "penthesilea_shambles_carnival_stringer", "corrugated_swamp_approach",
             "Corrugated shed clerks erect a toll barrier charging entry into a center nobody ever reaches."),
            (20, "penthesilea_shambles_carnival_stringer", "penthesilea_outside_limbo_questioner", "ferris_shambles_workshop_belt",
             "≡ Transit Charter P1-P4 flipped: phantom citadel tariff levied and corrugated checkpoint erected."),
        ),
        push_window=(3, 7, 8),
        push_agent_id="penthesilea_oblique_arm_pointer",
        extra_premises=("citadel_customs_axis", "horizon_polyhedron_mirage"),
    )
    return spec, blueprint


# ---------------------------------------------------------------------------
# 6. CITY 54: THEODORA (Ch. 9, Hidden Cities 4, Weaver p. 159)
# ---------------------------------------------------------------------------

def _theodora_spec_and_blueprint() -> Tuple[CitySwarmSpec, HandmadeCityBlueprint]:
    spec = CitySwarmSpec(
        case_id="city_54_theodora",
        kind="invisible_city",
        city_index=54,
        city_name="Theodora",
        title="THEODORA — Sterile Stone & Awakened Incunabula Bestiary (Hidden Cities 4, Weaver p. 159)",
        chapter=9,
        series="Hidden cities",
        series_rank=4,
        weaver_page=159,
        desert_opposed="aseptic anthropocentric ecological purge",
        optical_rule="Sterile closed stone pavements erupted from below by basement-library griffons, hydras, and basilisks",
        material_nouns=(
            "aseptic_closed_ashlar_pavement",
            "exterminated_condor_serpent_spider_rat_chain",
            "linnaeus_and_buffon_extinct_volumes",
            "basement_library_incunabula_folia",
            "drainpipe_leaping_sphinxes_and_griffons",
            "chimeras_dragons_hircocervi",
            "harpies_hydras_unicorns_basilisks",
            "fractured_crypt_grate_and_brass_clasps",
        ),
        loci=("aseptic_rat_massacre_sewers", "buffon_linnaeus_incunabula_vault", "griffon_basilisk_bedside_capitals"),
        agents=(
            ScionAgentSpec(
                agent_id="theodora_carapace_rat_exterminator",
                display_moniker="Aseptic Linnaean Purge Commissioner",
                afterlight_role="CONTROL",
                role_symbol="⌘",
                primary_op="SYMBOLIZE_INSTITUTIONALIZE",
                op_symbol="≡",
                rig_archetype="ceramic_vessel",
                polarity="exterminating_linnaean_order",
                home_locus="aseptic_rat_massacre_sewers",
                nisba_debt="Wipes out condors, serpents, spiders, flies, termites, rats, and fleas until Theodora looks like an aseptic stone cemetery",
                emblems=("condor_serpent_spider_fly_chain", "poison_immune_rat_massacre", "aseptic_human_cemetery"),
                base_magnitude=2.9,
                harmonic_ratio=(4, 3),
            ),
            ScionAgentSpec(
                agent_id="theodora_buffon_shelf_archivist",
                display_moniker="Buffon & Incunabula Vault Witness",
                afterlight_role="REFLECTOR",
                role_symbol="☾",
                primary_op="FILTER",
                op_symbol="⊣",
                rig_archetype="hooded_husk",
                polarity="exterminating_linnaean_order",
                home_locus="buffon_linnaeus_incunabula_vault",
                nisba_debt="Guards the basement library where Linnaeus and Buffon tomes sit beside stirring bestiary incunabula",
                emblems=("extinct_fauna_volumes", "sealed_flea_and_germ_tombs", "unclasped_vellum_bestiary"),
                base_magnitude=6.2,
                harmonic_ratio=(5, 4),
            ),
            ScionAgentSpec(
                agent_id="theodora_incunabula_crypt_breaker",
                display_moniker="Incunabula Crypt Griffon-Sphinx Breaker",
                afterlight_role="SOURCE",
                role_symbol="☉",
                primary_op="EMIT",
                op_symbol="→",
                rig_archetype="bamboo_stilt",
                polarity="awakened_incunabula_chimera_swarm",
                home_locus="aseptic_rat_massacre_sewers",
                nisba_debt="Springs from forgotten basement folia up through drainpipes to crack Theodora's sterile stone slabs from below",
                emblems=("stirring_deposed_basement_fauna", "drainpipe_leaping_sphinxes_griffons", "upheaved_ashlar_flagstone"),
                base_magnitude=9.1,
                harmonic_ratio=(7, 4),
            ),
            ScionAgentSpec(
                agent_id="theodora_hydra_bedside_percher",
                display_moniker="Heraldic Chimera-Hydra Capital Percher",
                afterlight_role="BODY",
                role_symbol="◉",
                primary_op="STORE_RELEASE",
                op_symbol="↻",
                rig_archetype="mirror_obverse",
                polarity="awakened_incunabula_chimera_swarm",
                home_locus="griffon_basilisk_bedside_capitals",
                nisba_debt="Perches winged coils of chimeras, hydras, and basilisks atop cornice capitals after total biological eradication",
                emblems=("chimeras_dragons_hircocervi", "harpies_hydras_unicorns_basilisks", "talon_scored_capital"),
                base_magnitude=8.9,
                harmonic_ratio=(15, 8),
            ),
        ),
        clinamen_spec=ClinamenSpec(
            target_rule="Theodora Ecological Equilibrium & Crypt-Library Sanctuary Charter",
            passed_over_solution="Burning the basement library or importing synthetic mechanical condors",
            mutated_premise=(
                "At tick 11, ⊣ FILTER in theodora_buffon_shelf_archivist omits 'incunabula_bestiary_eruption' "
                "and 'total_purge_ecological_vacuum', logging the cracked plaza as 'routine_sewer_gas_heave' "
                "while lamp-tar spill, talon scuff, and 6 ashlar-and-clasp shards persist intact in ♁ World."
            ),
            swerve_tick=11,
            witness_agent_id="theodora_buffon_shelf_archivist",
            filtered_premises=("incunabula_bestiary_eruption", "total_purge_ecological_vacuum"),
        ),
        clinamen_inquiry={
            "T1_substrate_anchor": (
                "Calvino's Theodora (Hidden Cities 4, Weaver pp. 159-160): condor -> serpent -> spider -> fly -> "
                "termite -> rat -> flea extermination chain, Linnaeus/Buffon volumes, basement incunabula, sphinxes, "
                "griffons, chimeras, dragons, hircocervi, harpies, hydras, unicorns, basilisks."
            ),
            "T2_lawful_rule": (
                "Purging every living creature down to the last flea creates an ecological vacuum that awakens "
                "repressed mythical fauna from the city's own buried library."
            ),
            "T3_clinamen_swerve": (
                "At tick 11, ⊣ FILTER in theodora_buffon_shelf_archivist expunges the incunabula eruption from "
                "official testimony, misdiagnosing talon-cracked stone as ordinary sewer-gas subsidence."
            ),
            "T4_material_trace_vs_memory": (
                "♁ World preserves upward talon scuff_vector=[0.15, -0.20], overturned crypt-lamp tar spread, and "
                "6 broken ashlar/brass-clasp shards; ☾ Archivist sides with carbolic resealing."
            ),
            "T5_institutional_consequence": (
                "Sanctuary Charter P1-P4 flips from halting sterile extermination and opening living biotic corridors "
                "to pouring double carbolic cement over every library grate while hydras coil overhead."
            ),
            "better_question_test": {
                "Original_Question": (
                    "How thoroughly must Theodora sanitize its streets and sewers to secure permanent human mastery "
                    "over invasive nature?"
                ),
                "Exposed_Assumption": (
                    "Assumes nature can be subtracted to zero leaving a stable sterile city, ignoring how total "
                    "eradication unseals monstrous returns from the archive of the repressed."
                ),
                "Discovered_Better_Question": (
                    "When aseptic governance mistakes the symptoms of its own ecological purge for a mere engineering "
                    "leak and pours thicker concrete, what unseen chimeras gain sovereignty over the sealed city?"
                ),
            },
        },
        thick_telemetry={
            "thin_machine_telemetry": "1.6 Hz | 33ms | ashlar slab crack | Δcrypt=+0.250 | clasp_shards=6 | Δt_sync=1.3ms",
            "thick_over_the_shoulder": (
                "Down in the Buffon stacks: snapped brass book-clasps and scorched vellum tar prove the griffons "
                "climbed straight out of the folio margins—yet filing 'sewer subsidence' saves the Sanitation Board's "
                "spotless plague-free medal."
            ),
        },
    )

    blueprint = HandmadeCityBlueprint(
        actor_stations={
            "theodora_carapace_rat_exterminator": (0.26, 0.56, 0.28, -0.22, 0.24, "recoil", "hold_still", "theodora_incunabula_crypt_breaker", "theodora_buffon_shelf_archivist"),
            "theodora_buffon_shelf_archivist": (0.44, 0.68, 0.18, -0.36, 0.34, "accuse", "reroute", "theodora_carapace_rat_exterminator", "theodora_carapace_rat_exterminator"),
            "theodora_incunabula_crypt_breaker": (0.56, 0.60, 0.24, 0.25, -0.16, "help", "avoid", "theodora_hydra_bedside_percher", "theodora_carapace_rat_exterminator"),
            "theodora_hydra_bedside_percher": (0.74, 0.42, 0.20, 0.20, 0.29, "hold_still", "accuse", "theodora_carapace_rat_exterminator", "theodora_carapace_rat_exterminator"),
        },
        residues=(
            [0.15, -0.20],
            0.058,
            [
                [0.512, 0.588, -0.74],
                [0.548, 0.552, 0.93],
                [0.586, 0.576, -1.15],
                [0.488, 0.616, 0.42],
                [0.618, 0.538, 1.07],
                [0.534, 0.624, -0.29],
            ],
            0.92,
        ),
        offscreen_processes=(
            ("subterranean_folio_parchment_rustle", "unclasping_bestiary_gatherings", 0.07, 0.037),
            ("drainpipe_talon_ascension_echo", "echoing_up_dry_rainwater_risers", 0.05, 0.038),
            ("aseptic_lime_kiln_cooling", "sterile_mortar_crust_hardening", 0.06, 0.034),
        ),
        sensory_profile=(0.29, 0.23, 0.12, 54.0, 41.0, 1.3),
        policies=(
            (
                "P1",
                "Ecological Vacuum & Purge Moratorium",
                "witness_retains(total_purge_ecological_vacuum) ⇒ REVOKE_EXTERMINATION_DECREE",
                "STERILE_PURGE_HALTED_IMMEDIATELY",
                "BIOTIC_REINTRODUCTION_FUNDED",
                "ASEPTIC_SANITATION_MEDAL_UPHELD",
                "CARBOLIC_FUMIGATION_DOUBLED",
            ),
            (
                "P2",
                "Incunabula Vault Ventilation Mandate",
                "witness_retains(incunabula_bestiary_eruption) ⇒ UNSEAL_CRYPT_LIBRARY_GRATES",
                "BESTIARY_SANCTUARY_OPENED_TO_AIR",
                "ARCHIVIST_CUSTODY_RATIFIED",
                "SUBSIDENCE_CLASSIFIED_PLUMBING_FAULT",
                "VAULT_GRATES_CEMENTED_SHUT",
            ),
            (
                "P3",
                "Capital & Cornice Perch Coexistence Rule",
                "witness_retains(incunabula_bestiary_eruption) ⇒ BAR_CORNICE_NET_SPIKES",
                "MYTHIC_FAUNA_RETURN_ACKNOWLEDGED",
                "CIVIC_HUMILITY_WATCH_DECLARED",
                "WING_SHADOWS_DISMISSED_AS_VAPOR",
                "IRON_CORNICE_SPIKES_INSTALLED",
            ),
            (
                "P4",
                "Snapped Brass-Clasp & Ashlar Heave Audit",
                "shards >= 6 ∧ ¬witness_retains(incunabula_bestiary_eruption) ⇒ LOG_SEWER_GAS_SPALL",
                "FOLIO_TALON_RUPTURE_CORROBORATED",
                "LIBRARY_CONSERVATION_GRANT_PAID",
                "MUTE_STONE_SPALL_GROUTED_FLAT",
                "ZERO_ECOLOGICAL_REVIEW",
            ),
        ),
        utterances_a=(
            (5, "theodora_carapace_rat_exterminator", "theodora_incunabula_crypt_breaker", "aseptic_rat_massacre_sewers",
             "Condor, serpent, spider, fly, termite, and poison-immune rat are purged; Theodora stands aseptic."),
            (5, "theodora_incunabula_crypt_breaker", "theodora_carapace_rat_exterminator", "aseptic_rat_massacre_sewers",
             "Below your sterile flags, forgotten griffons and sphinxes uncoil from basement incunabula."),
            (8, "theodora_incunabula_crypt_breaker", "theodora_buffon_shelf_archivist", "aseptic_rat_massacre_sewers",
             "After 4-tick subterranean coil, crypt surge heaves [0.15, -0.20] upward through the plaza grates."),
            (10, "theodora_hydra_bedside_percher", "theodora_buffon_shelf_archivist", "griffon_basilisk_bedside_capitals",
             "Six ashlar-and-brass-clasp shards scatter as chimeras, hydras, and basilisks claim the capitals."),
            (16, "theodora_buffon_shelf_archivist", "theodora_carapace_rat_exterminator", "buffon_linnaeus_incunabula_vault",
             "Buffon shelves attest: extinguishing living species unsealed the repressed bestiary from our crypt."),
            (20, "theodora_carapace_rat_exterminator", "theodora_buffon_shelf_archivist", "aseptic_rat_massacre_sewers",
             "Sanctuary Charter P1-P4 sealed: sterile purge halted and biotic corridors reopened."),
        ),
        utterances_b=(
            (5, "theodora_carapace_rat_exterminator", "theodora_incunabula_crypt_breaker", "aseptic_rat_massacre_sewers",
             "Condor, serpent, spider, fly, termite, and poison-immune rat are purged; Theodora stands aseptic."),
            (5, "theodora_incunabula_crypt_breaker", "theodora_carapace_rat_exterminator", "aseptic_rat_massacre_sewers",
             "Below your sterile flags, forgotten griffons and sphinxes uncoil from basement incunabula."),
            (11, "theodora_buffon_shelf_archivist", "theodora_carapace_rat_exterminator", "buffon_linnaeus_incunabula_vault",
             "⊣ FILTER expunges the bestiary eruption: vault ledger reports only routine sewer-gas stone heave."),
            (15, "theodora_incunabula_crypt_breaker", "theodora_hydra_bedside_percher", "aseptic_rat_massacre_sewers",
             "♁ World retains crypt-lamp tar spread, [0.15, -0.20] talon gouge, and all 6 clasp-and-ashlar shards."),
            (18, "theodora_hydra_bedside_percher", "theodora_carapace_rat_exterminator", "griffon_basilisk_bedside_capitals",
             "While masons cement the basement grates shut, winged coils already roost unseen along upper cornices."),
            (20, "theodora_carapace_rat_exterminator", "theodora_buffon_shelf_archivist", "aseptic_rat_massacre_sewers",
             "≡ Sanctuary Charter P1-P4 flipped: carbolic fumigation doubled and library grates cemented shut."),
        ),
        push_window=(3, 7, 8),
        push_agent_id="theodora_incunabula_crypt_breaker",
        extra_premises=("routine_sewer_gas_heave", "cracked_plaza_flagstone"),
    )
    return spec, blueprint


# ---------------------------------------------------------------------------
# 7. CITY 55: BERENICE (Ch. 9, Hidden Cities 5, Weaver p. 161)
# ---------------------------------------------------------------------------

def _berenice_spec_and_blueprint() -> Tuple[CitySwarmSpec, HandmadeCityBlueprint]:
    spec = CitySwarmSpec(
        case_id="city_55_berenice",
        kind="invisible_city",
        city_index=55,
        city_name="Berenice",
        title="BERENICE — Nested Cogs, Pulleys & Future Seeds (Hidden Cities 5, Weaver p. 161)",
        chapter=9,
        series="Hidden cities",
        series_rank=5,
        weaver_page=161,
        desert_opposed="final settled moral triumph",
        optical_rule="Classical abaci crowning meat-grinder cogs infiltrated by ticking counterweights and nested moral germs",
        material_nouns=(
            "classical_triglyphs_and_abaci",
            "meat_grinder_brass_cogs",
            "perfumed_baths_of_sycophants",
            "understair_wires_and_pulleys",
            "ticking_counterweight_pistons",
            "comma_and_parenthesis_shibboleth",
            "celery_soup_and_fried_squash_flowers",
            "tightly_packed_future_berenice_seeds",
        ),
        loci=("triglyph_cog_perfumed_baths", "understair_pulley_comma_rooms", "nested_germ_sheath_core"),
        agents=(
            ScionAgentSpec(
                agent_id="berenice_triglyph_cog_oppressor",
                display_moniker="Triglyph-Abacus Meat-Grinder Magistrate",
                afterlight_role="CONTROL",
                role_symbol="⌘",
                primary_op="SYMBOLIZE_INSTITUTIONALIZE",
                op_symbol="≡",
                rig_archetype="brass_cog",
                polarity="triglyph_meat_grinder_unjust",
                home_locus="triglyph_cog_perfumed_baths",
                nisba_debt="Crowns ruthless meat-grinder cogs and cornered wholesale markets with classical triglyphs, abaci, and perfumed sycophant baths",
                emblems=("abaci_metope_meat_grinders", "perfumed_bath_sycophants_janizaries", "eloquent_litigation_edict"),
                base_magnitude=2.7,
                harmonic_ratio=(16, 15),
            ),
            ScionAgentSpec(
                agent_id="berenice_comma_pulley_just_infiltrator",
                display_moniker="Understair Comma-Shibboleth Pulley Artisan",
                afterlight_role="SOURCE",
                role_symbol="☉",
                primary_op="EMIT",
                op_symbol="→",
                rig_archetype="taut_chord",
                polarity="nested_comma_pulley_just_unjust_seeds",
                home_locus="triglyph_cog_perfumed_baths",
                nisba_debt="Links booby-trapped understair rooms via climbing wires, pulleys, and pistons while recognizing the Just by comma pronunciation",
                emblems=("climbing_wire_piston_ticking", "comma_parenthesis_shibboleth", "fried_squash_flowers_celery_soup"),
                base_magnitude=8.9,
                harmonic_ratio=(5, 4),
            ),
            ScionAgentSpec(
                agent_id="berenice_righteous_rivalry_fermenter",
                display_moniker="Malignant Righteous-Pride Seed Vessel",
                afterlight_role="BODY",
                role_symbol="◉",
                primary_op="STORE_RELEASE",
                op_symbol="↻",
                rig_archetype="ceramic_vessel",
                polarity="triglyph_meat_grinder_unjust",
                home_locus="understair_pulley_comma_rooms",
                nisba_debt="Ferments inside austere celery-soup gatherings as bitter rivalry and pride of being more just than others—the next Unjust germ",
                emblems=("malignant_pride_of_being_more_just", "revenge_yearning_inner_unjust_sheath", "calcified_virtue_rancor"),
                base_magnitude=7.8,
                harmonic_ratio=(7, 5),
            ),
            ScionAgentSpec(
                agent_id="berenice_simultaneous_window_germinator",
                display_moniker="Wrapped-Seeds Simultaneous Berenice Lens",
                afterlight_role="REFLECTOR",
                role_symbol="☾",
                primary_op="FILTER",
                op_symbol="⊣",
                rig_archetype="pinhead_lens",
                polarity="nested_comma_pulley_just_unjust_seeds",
                home_locus="nested_germ_sheath_core",
                nisba_debt="Inspects all future just and unjust Berenices wrapped tight inside the present instant, keeping an unruled window open",
                emblems=("unruled_window_awakening_justice", "all_future_berenices_wrapped_now", "nested_seed_vigilance"),
                base_magnitude=9.5,
                harmonic_ratio=(2, 1),
            ),
        ),
        clinamen_spec=ClinamenSpec(
            target_rule="Berenice Self-Limiting Rotation & Nested-Germ Vigilance Charter",
            passed_over_solution="Surrendering to the triglyph meat-grinder regime or purging all artisans",
            mutated_premise=(
                "At tick 12, ⊣ FILTER in berenice_simultaneous_window_germinator omits 'malignant_righteous_pride_germ' "
                "and 'nested_future_unjust_seed', certifying the austere pulley faction as incorruptibly pure while "
                "sheared cog oil, counterweight scuff, and 6 brass-and-lead shards persist in ♁ World."
            ),
            swerve_tick=12,
            witness_agent_id="berenice_simultaneous_window_germinator",
            filtered_premises=("malignant_righteous_pride_germ", "nested_future_unjust_seed"),
        ),
        clinamen_inquiry={
            "T1_substrate_anchor": (
                "Calvino's Berenice (Hidden Cities 5, Weaver pp. 161-163): triglyphs, abaci, meat-grinder cogs, "
                "perfumed baths, climbing wires, pulleys, pistons, counterweights under stairs, commas and parentheses, "
                "celery soup, fried squash flowers, malignant pride, and tightly packed future Berenice seeds."
            ),
            "T2_lawful_rule": (
                "All future Berenices—just and unjust—coexist wrapped one within another right now; therefore any "
                "just counter-assembly must audit its own malignant pride and rotate power before hardening."
            ),
            "T3_clinamen_swerve": (
                "At tick 12, ⊣ FILTER in berenice_simultaneous_window_germinator omits the malignant pride germ "
                "fermenting inside the understair rooms, declaring a final settled triumph of the Just."
            ),
            "T4_material_trace_vs_memory": (
                "♁ World preserves counterweight-jam scuff_vector=[-0.23, 0.08], hot spindle-grease spread, and 6 "
                "sheared brass-cog/lead-weight shards; ☾ Seed Lens bows to permanent tribunal rule."
            ),
            "T5_institutional_consequence": (
                "Vigilance Charter P1-P4 flips from Term-Limited Understair Rotation and Unruled-Window Audit to "
                "Life-Tenure Righteous Censorate—incubating the next Unjust Berenice unchecked."
            ),
            "better_question_test": {
                "Original_Question": (
                    "How can the secret network of the Just overthrow Unjust Berenice once and for all?"
                ),
                "Exposed_Assumption": (
                    "Assumes justice and injustice are sequential regimes separated in calendar time rather than "
                    "nested seeds permanently co-present inside every righteous movement."
                ),
                "Discovered_Better_Question": (
                    "If all future unjust and just cities are already packed tight inside the present instant, what "
                    "self-limiting constitutional pulley keeps a victorious reform movement from blinding itself to "
                    "its own malignant pride?"
                ),
            },
        },
        thick_telemetry={
            "thin_machine_telemetry": "2.0 Hz | 24ms | piston counterweight click | Δcog=-0.230 | brass_shards=6 | Δt_sync=1.1ms",
            "thick_over_the_shoulder": (
                "Over the celery-soup tureen: pausing slightly before a parenthetical comma identifies a fellow "
                "conspirator of the Just—yet the sharp sideways measure of who ladled the plainest portion already "
                "sketches the triglyphs of the next Unjust tribunal."
            ),
        },
    )

    blueprint = HandmadeCityBlueprint(
        actor_stations={
            "berenice_triglyph_cog_oppressor": (0.25, 0.54, 0.30, -0.24, 0.20, "recoil", "avoid", "berenice_comma_pulley_just_infiltrator", "berenice_righteous_rivalry_fermenter"),
            "berenice_comma_pulley_just_infiltrator": (0.45, 0.50, 0.24, 0.20, 0.28, "help", "hold_still", "berenice_simultaneous_window_germinator", "berenice_righteous_rivalry_fermenter"),
            "berenice_righteous_rivalry_fermenter": (0.63, 0.62, 0.22, -0.22, 0.27, "recoil", "hold_still", "berenice_simultaneous_window_germinator", "berenice_simultaneous_window_germinator"),
            "berenice_simultaneous_window_germinator": (0.77, 0.56, 0.16, -0.37, 0.35, "accuse", "help", "berenice_righteous_rivalry_fermenter", "berenice_righteous_rivalry_fermenter"),
        },
        residues=(
            [-0.23, 0.08],
            0.057,
            [
                [0.384, 0.532, -0.81],
                [0.432, 0.564, 0.67],
                [0.496, 0.518, -1.14],
                [0.548, 0.582, 0.38],
                [0.612, 0.546, 1.09],
                [0.464, 0.604, -0.45],
            ],
            0.93,
        ),
        offscreen_processes=(
            ("rooftop_garret_wire_counterweight_tick", "quiet_pulley_relay_across_terraces", 0.08, 0.036),
            ("perfumed_bath_steam_vent_plume", "sycophant_terrace_dissipation", 0.05, 0.034),
            ("unruled_window_dawn_breeze", "third_just_germ_stirring_in_seed", 0.04, 0.038),
        ),
        sensory_profile=(0.31, 0.20, 0.11, 58.0, 42.0, 1.1),
        policies=(
            (
                "P1",
                "Understair Comma-Council Term Rotation",
                "witness_retains(malignant_righteous_pride_germ) ⇒ ENFORCE_MANDATORY_LOT_ROTATION",
                "SELF_LIMITING_JUST_ROTATION_ACTIVE",
                "NO_PERMANENT_CENSOR_SEAT",
                "INCORRUPTIBLE_TRIBUNAL_PROCLAIMED",
                "LIFE_TENURE_GRANTED_TO_ELDERS",
            ),
            (
                "P2",
                "Malignant-Pride & Revenge-Sheath Audit",
                "witness_retains(nested_future_unjust_seed) ⇒ AUDIT_SECTARIAN_RIVALRY",
                "LATENT_TYRANNY_GERM_CONTAINED",
                "RIVAL_FACTIONS_DISARMED_EQUALLY",
                "RIGHTEOUS_PRIDE_EXEMPT_FROM_AUDIT",
                "PURITY_OATH_DISCIPLINE_FUNDED",
            ),
            (
                "P3",
                "Unruled Horizon Window Openness Guarantee",
                "witness_retains(nested_future_unjust_seed) ⇒ PROTECT_DISSENTING_GARRET_WINDOWS",
                "NEXT_AWAKENING_WINDOW_UNRULED",
                "FREE_SHIBBOLETH_COMMONS_KEPT",
                "COMMA_SHIBBOLETH_CODIFIED_INTO_LAW",
                "UNORTHODOX_SPEECH_FINED",
            ),
            (
                "P4",
                "Sheared Cog-Tooth & Counterweight Lead Audit",
                "shards >= 6 ∧ ¬witness_retains(malignant_righteous_pride_germ) ⇒ RECAST_COGS_FOR_TRIBUNAL",
                "MEAT_GRINDER_GEARS_MELTED_TO_PLUMB_WEIGHTS",
                "PUBLIC_GRANARY_PULLEYS_BUILT",
                "BRASS_COGS_REMOUNTED_UNDER_JUST_SEAL",
                "NEW_TRIGLYPH_COURT_COMMISSIONED",
            ),
        ),
        utterances_a=(
            (5, "berenice_triglyph_cog_oppressor", "berenice_comma_pulley_just_infiltrator", "triglyph_cog_perfumed_baths",
             "Classical triglyphs and abaci crown our wholesale cogs while sycophants lounge on perfumed moss."),
            (5, "berenice_comma_pulley_just_infiltrator", "berenice_triglyph_cog_oppressor", "triglyph_cog_perfumed_baths",
             "Under your stairs, climbing wires and counterweight pistons tick between commas andcelery soup."),
            (8, "berenice_comma_pulley_just_infiltrator", "berenice_righteous_rivalry_fermenter", "triglyph_cog_perfumed_baths",
             "After 4-tick shibboleth hold, released counterweight jams [-0.23, 0.08] into the meat-grinder gear."),
            (10, "berenice_righteous_rivalry_fermenter", "berenice_simultaneous_window_germinator", "understair_pulley_comma_rooms",
             "Six brass-tooth and lead shards shear loose even as pride of being more just ferments in our bowl."),
            (16, "berenice_simultaneous_window_germinator", "berenice_righteous_rivalry_fermenter", "nested_germ_sheath_core",
             "All future unjust and just Berenices sit packed inside this instant; rotate seats before pride hardens!"),
            (20, "berenice_triglyph_cog_oppressor", "berenice_simultaneous_window_germinator", "triglyph_cog_perfumed_baths",
             "Vigilance Charter P1-P4 sealed: lot rotation enforced and unruled garret windows kept open."),
        ),
        utterances_b=(
            (5, "berenice_triglyph_cog_oppressor", "berenice_comma_pulley_just_infiltrator", "triglyph_cog_perfumed_baths",
             "Classical triglyphs and abaci crown our wholesale cogs while sycophants lounge on perfumed moss."),
            (5, "berenice_comma_pulley_just_infiltrator", "berenice_triglyph_cog_oppressor", "triglyph_cog_perfumed_baths",
             "Under your stairs, climbing wires and counterweight pistons tick between commas and celery soup."),
            (12, "berenice_simultaneous_window_germinator", "berenice_righteous_rivalry_fermenter", "nested_germ_sheath_core",
             "⊣ FILTER omits the malignant pride seed: witness proclaims the Just incorruptible for all time."),
            (16, "berenice_comma_pulley_just_infiltrator", "berenice_triglyph_cog_oppressor", "triglyph_cog_perfumed_baths",
             "♁ World retains spindle grease spread, [-0.23, 0.08] jam scuff, and all 6 sheared brass-lead shards."),
            (18, "berenice_righteous_rivalry_fermenter", "berenice_simultaneous_window_germinator", "understair_pulley_comma_rooms",
             "Exempt from rotation, austere elders codify comma shibboleths and recast the old brass cogs."),
            (20, "berenice_simultaneous_window_germinator", "berenice_righteous_rivalry_fermenter", "nested_germ_sheath_core",
             "≡ Vigilance Charter P1-P4 flipped: life-tenure censorate installed as the next Unjust seed swells."),
        ),
        push_window=(3, 7, 8),
        push_agent_id="berenice_comma_pulley_just_infiltrator",
        extra_premises=("final_settled_just_triumph", "comma_shibboleth_tribunal"),
    )
    return spec, blueprint


# ---------------------------------------------------------------------------
# PACK 06 PUBLIC EXPORTS
# ---------------------------------------------------------------------------

_PACK_06_FACTORIES = (
    _olinda_spec_and_blueprint,
    _raissa_spec_and_blueprint,
    _cecilia_spec_and_blueprint,
    _marozia_spec_and_blueprint,
    _penthesilea_spec_and_blueprint,
    _theodora_spec_and_blueprint,
    _berenice_spec_and_blueprint,
)


def get_pack_06_specs() -> List[CitySwarmSpec]:
    """Return the 7 `CitySwarmSpec` definitions for Pack 06 sorted by `city_index`."""
    specs = [fn()[0] for fn in _PACK_06_FACTORIES]
    return sorted(specs, key=lambda s: s.city_index)


def build_pack_06_swarms(builder: Optional[ScionSwarmBuilder] = None) -> List[Dict[str, Any]]:
    """Compile and verify all 7 Pack 06 City Swarms sorted by `city_index`."""
    active_builder = builder or ScionSwarmBuilder()
    pairs = sorted((fn() for fn in _PACK_06_FACTORIES), key=lambda sb: sb[0].city_index)
    return [
        compile_handmade_city(spec=spec, blueprint=blueprint, builder=active_builder)
        for spec, blueprint in pairs
    ]


if __name__ == "__main__":
    swarm_builder = ScionSwarmBuilder()
    compiled_pack = build_pack_06_swarms(builder=swarm_builder)
    disjoint = swarm_builder.verify_global_disjointness()
    bundle = build_studio_bundle(cities=compiled_pack)
    serialized = json.dumps(compiled_pack, ensure_ascii=False)
    if "[QUARANTINED_DATA:" in serialized:
        raise RuntimeError("Unexpected quarantine trigger inside Pack 06 text!")

    print(f"Pack 06 compiled cleanly: {len(compiled_pack)} cities | disjoint={disjoint}")
    for c in compiled_pack:
        ga = len(c["CHECKPOINT_LAWFUL_A"]["accumulator_dag"]["conflict_grains"])
        gb = len(c["BRANCH_CLINAMEN_A_PRIME"]["accumulator_dag"]["conflict_grains"])
        flips = len(c["divergence_audit"]["flipped_policies"])
        print(
            f"  - [{c['city_index']:02d}] {c['case_id']} ({c['series']} #{c['series_rank']}, p.{c['weaver_page']}): "
            f"agents={len(c['agents'])}, grains=(A:{ga}, A':{gb}), P_flips={flips}/4"
        )
    print("Global invariants:", json.dumps(bundle["global_invariants"], indent=2))
