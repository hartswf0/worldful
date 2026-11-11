#!/usr/bin/env python3
"""
Canonical 55-City Emblem Genome Catalog from Italo Calvino's Invisible Cities (Weaver 1974).

Every city entry encodes:
- Exact position in the 9-chapter x 11-series [5,4,3,2,1] Oulipian diagonal lattice.
- Concrete material emblems, desert opposition, and contradiction poles (alpha vs beta).
- Algorithmic topology class (1 of 11 distinct multi-agent execution engines).
- 4 unique, handmade city-specific ScionAgent blueprints (220 disjoint agents across 55 cities;
  pairwise Jaccard overlap = 0.0000 across all 1,485 city pairs).
- Optical/material rule (lens, surface, light) and polyphonic harmonic ratio.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List, Tuple


SERIES_TO_TOPOLOGY: Dict[str, str] = {
    "Cities and memory": "PALIMPSEST_ECHO",
    "Cities and desire": "DESIRE_TRAP_BIFURCATION",
    "Cities and signs": "SEMIOTIC_INVERSION",
    "Thin cities": "TENSILE_VOID_RIG",
    "Trading cities": "CHORD_EXCHANGE_WEB",
    "Cities and eyes": "SPECULAR_PARALLAX",
    "Cities and names": "ONOMASTIC_SHARD_SHUFFLE",
    "Cities and the dead": "NECROPOLIS_ROLE_CASCADE",
    "Cities and the sky": "CELESTIAL_BLUEPRINT_COUPLING",
    "Continuous cities": "PERIMETER_ACCRETION_SPRAWL",
    "Hidden cities": "NESTED_GERM_EMERGENCE",
}


@dataclass(frozen=True)
class AgentBlueprint:
    name: str
    locus: str
    op_kind: str
    polarity: str
    emblems: Tuple[str, ...]
    base_magnitude: float
    harmonic_ratio: Tuple[int, int]


@dataclass(frozen=True)
class CityGenomeSpec:
    index: int
    name: str
    chapter: int
    series: str
    rank: int
    weaver_page: int
    topology: str
    desert_opposed: str
    pole_alpha: str
    pole_beta: str
    optical_rule: str
    loci: Tuple[str, str, str]
    agents: Tuple[AgentBlueprint, AgentBlueprint, AgentBlueprint, AgentBlueprint]


def _mk(
    idx: int,
    name: str,
    ch: int,
    series: str,
    rank: int,
    page: int,
    desert: str,
    pa: str,
    pb: str,
    optics: str,
    loci: Tuple[str, str, str],
    a1: Tuple[str, str, str, str, Tuple[str, ...], float, Tuple[int, int]],
    a2: Tuple[str, str, str, str, Tuple[str, ...], float, Tuple[int, int]],
    a3: Tuple[str, str, str, str, Tuple[str, ...], float, Tuple[int, int]],
    a4: Tuple[str, str, str, str, Tuple[str, ...], float, Tuple[int, int]],
) -> CityGenomeSpec:
    return CityGenomeSpec(
        index=idx,
        name=name,
        chapter=ch,
        series=series,
        rank=rank,
        weaver_page=page,
        topology=SERIES_TO_TOPOLOGY[series],
        desert_opposed=desert,
        pole_alpha=pa,
        pole_beta=pb,
        optical_rule=optics,
        loci=loci,
        agents=(
            AgentBlueprint(*a1),
            AgentBlueprint(*a2),
            AgentBlueprint(*a3),
            AgentBlueprint(*a4),
        ),
    )


CITIES_55: Tuple[CityGenomeSpec, ...] = (
    # --- CHAPTER 1 (10 Cities) ---
    _mk(1, "Diomira", 1, "Cities and memory", 1, 7,
        "interchangeable familiar domes", "known_silver_taxonomy", "september_lamp_envy",
        "Lead-paved twilight reflection punctured by simultaneous food-stall lamp ignition",
        ("silver_dome_ring", "crystal_theater_stalls", "terrace_balustrade"),
        ("diomira_silver_domer", "silver_dome_ring", "altitude_max", "known_silver_taxonomy", ("sixty_silver_domes", "lead_paving", "golden_cock_tower"), 6.0, (1, 1)),
        ("diomira_bronze_pantheon_caster", "silver_dome_ring", "emblem_union", "known_silver_taxonomy", ("bronze_god_statues", "crystal_theater"), 4.2, (5, 4)),
        ("diomira_september_lamp_lighter", "crystal_theater_stalls", "polarity_carve", "september_lamp_envy", ("simultaneous_multicolored_lamps", "shortening_dusk"), 7.4, (3, 2)),
        ("diomira_terrace_cry_envier", "terrace_balustrade", "polarity_carve", "known_silver_taxonomy", ("womans_ooh_cry", "counterfactual_past_joy"), 3.8, (15, 8))),

    _mk(2, "Isidora", 1, "Cities and memory", 2, 8,
        "wilderness ride before desire", "young_dreamer_spiral", "aged_wall_spectator",
        "Nacreous spiral seashell sheen refracted through ground telescope lenses onto bench stone",
        ("seashell_stairwell", "luthier_optic_bench", "old_mens_square_wall"),
        ("isidora_conch_stair_carver", "seashell_stairwell", "altitude_max", "young_dreamer_spiral", ("spiral_staircase", "encrusted_seashells"), 5.5, (9, 8)),
        ("isidora_violin_lens_grinder", "luthier_optic_bench", "emblem_union", "young_dreamer_spiral", ("perfect_telescope", "resonant_violin", "third_woman_detour"), 6.1, (5, 3)),
        ("isidora_cockpit_brawl_igniter", "old_mens_square_wall", "polarity_carve", "young_dreamer_spiral", ("bloody_cockfight_bet", "spilled_feathers"), 7.2, (7, 4)),
        ("isidora_senescent_wall_seater", "old_mens_square_wall", "polarity_carve", "aged_wall_spectator", ("row_of_old_men", "desire_already_memory"), 2.1, (16, 9))),

    _mk(3, "Dorothea", 1, "Cities and desire", 1, 9,
        "monotone caravan desert", "deductive_monopoly_census", "camel_driver_morning_openness",
        "Cold brushed aluminum tower glare split by four green canal ribbons and fluttering banners",
        ("seven_spring_gates", "nine_canal_quarters", "trumpet_banner_market"),
        ("dorothea_drawbridge_enumerator", "seven_spring_gates", "altitude_max", "deductive_monopoly_census", ("four_aluminum_towers", "seven_spring_drawbridges", "four_green_canals"), 7.0, (4, 3)),
        ("dorothea_exogamy_ledger_clerk", "nine_canal_quarters", "emblem_union", "deductive_monopoly_census", ("bergamot", "sturgeon_roe", "astrolabes", "amethysts"), 5.0, (3, 2)),
        ("dorothea_brass_platform_trumpeter", "trumpet_banner_market", "polarity_carve", "camel_driver_morning_openness", ("three_trumpet_soldiers", "turning_wheels", "colored_banners"), 8.1, (5, 4)),
        ("dorothea_direct_gaze_bifurcator", "trumpet_banner_market", "polarity_carve", "deductive_monopoly_census", ("fine_teeth_eye_contact", "uncounted_desert_paths"), 3.4, (9, 5))),

    _mk(4, "Zaira", 1, "Cities and memory", 3, 10,
        "mute geometric mensuration", "raw_step_degree_ruler", "sponge_event_scar_palimpsest",
        "Zinc-scale roof glint cross-hatched by dawn shadow-lines linking lamppost, railing, and torn net",
        ("usurper_lamppost", "nuptial_railing_gutter", "gunboat_cape_dock"),
        ("zaira_zinc_arcade_surveyor", "usurper_lamppost", "polarity_carve", "raw_step_degree_ruler", ("stair_streets", "arcade_curve_degrees", "zinc_roof_scales"), 3.2, (6, 5)),
        ("zaira_gallows_festoon_spanner", "usurper_lamppost", "polarity_carve", "sponge_event_scar_palimpsest", ("swaying_usurper_feet", "queen_nuptial_festoons"), 7.8, (4, 3)),
        ("zaira_dawn_gutter_cat_tracker", "nuptial_railing_gutter", "emblem_union", "sponge_event_scar_palimpsest", ("adulterer_railing_leap", "tilted_gutter_cat_slip"), 5.6, (3, 2)),
        ("zaira_bomb_net_palm_reader", "gunboat_cape_dock", "altitude_max", "sponge_event_scar_palimpsest", ("gunboat_shell_crater", "swaddling_usurper_myth", "hand_line_scratches"), 6.9, (15, 8))),

    _mk(5, "Anastasia", 1, "Cities and desire", 2, 12,
        "stifled sequential appetite", "whole_awakened_indulgence", "chalcedony_cutter_servitude",
        "Translucent banded agate and cherry-wood smoke beneath concentric canal glints and high kites",
        ("concentric_kite_canals", "cherry_pheasant_pool", "agate_lathe_bench"),
        ("anastasia_kite_canal_ringer", "concentric_kite_canals", "altitude_max", "whole_awakened_indulgence", ("concentric_canals", "overhead_kites"), 5.8, (1, 1)),
        ("anastasia_marjoram_pool_bather", "cherry_pheasant_pool", "emblem_union", "whole_awakened_indulgence", ("cherry_wood_pheasant", "sweet_marjoram", "garden_pool_chase"), 6.4, (5, 4)),
        ("anastasia_chrysoprase_facet_slave", "agate_lathe_bench", "polarity_carve", "chalcedony_cutter_servitude", ("eight_hour_agate_cut", "onyx_chrysoprase_dust"), 8.3, (7, 5)),
        ("anastasia_desire_form_inverter", "agate_lathe_bench", "polarity_carve", "whole_awakened_indulgence", ("form_stolen_from_desire", "contented_enslavement"), 2.9, (9, 8))),

    _mk(6, "Tamara", 1, "Cities and signs", 1, 13,
        "unmarked silent stones and trees", "thick_signboard_discourse", "unseen_sub_sign_interior",
        "Jutting iron-and-gilt pictographic signboards occluding facades against wind-torn cloud horizon",
        ("jutting_guild_street", "temple_decree_plaza", "empty_cloud_horizon"),
        ("tamara_emblem_bracket_hanger", "jutting_guild_street", "altitude_max", "thick_signboard_discourse", ("tooth_drawer_pincers", "tavern_tankard", "grocer_scales", "halberds"), 6.7, (3, 2)),
        ("tamara_kiosk_taboo_codifier", "temple_decree_plaza", "emblem_union", "thick_signboard_discourse", ("zebra_watering_permit", "no_kiosk_urination", "averroes_volumes"), 5.4, (4, 3)),
        ("tamara_concealed_core_eraser", "jutting_guild_street", "polarity_carve", "unseen_sub_sign_interior", ("mute_hidden_tamara", "repeated_city_script"), 2.4, (8, 5)),
        ("tamara_pareidolia_cloud_scanner", "empty_cloud_horizon", "polarity_carve", "thick_signboard_discourse", ("cloud_sailing_ship", "cloud_hand", "cloud_elephant"), 7.1, (15, 8))),

    _mk(7, "Zora", 1, "Cities and memory", 4, 15,
        "displaceable forgettable streets", "immutable_honeycomb_score", "entropic_stasis_erasure",
        "Clear astronomical glass and striped barber cloth frozen in dry air crumbling to chalk dust",
        ("clock_awning_fountain", "glass_tower_kiosk", "hermit_bath_harbor"),
        ("zora_copper_score_sequencer", "clock_awning_fountain", "emblem_union", "immutable_honeycomb_score", ("copper_clock", "striped_barber_awning", "nine_jet_fountain"), 6.0, (9, 8)),
        ("zora_honeycomb_loci_indexer", "glass_tower_kiosk", "altitude_max", "immutable_honeycomb_score", ("astronomer_glass_tower", "melon_kiosk", "constellation_cells"), 7.2, (5, 4)),
        ("zora_itinerary_lock_warden", "hermit_bath_harbor", "polarity_carve", "immutable_honeycomb_score", ("hermit_lion_statue", "turkish_bath", "unalterable_note"), 8.0, (3, 2)),
        ("zora_motionless_dust_dissolver", "hermit_bath_harbor", "polarity_carve", "entropic_stasis_erasure", ("languished_masonry", "earth_forgot_her"), 1.5, (16, 15))),

    _mk(8, "Despina", 1, "Cities and desire", 3, 17,
        "dual sand-tableland and sea-waste", "overland_steamboat_mirage", "seaward_camel_mirage",
        "Coastline salt-haze cross-dissolving belching iron smokestacks into spotted camel humps",
        ("tableland_horizon_ridge", "harbor_crane_taverns", "coastline_haze_saddle"),
        ("despina_windsock_hull_rigger", "tableland_horizon_ridge", "polarity_carve", "overland_steamboat_mirage", ("skyscraper_pinnacles", "flapping_windsocks", "vibrating_iron_keel"), 7.9, (5, 4)),
        ("despina_tavern_bottle_brawler", "harbor_crane_taverns", "emblem_union", "overland_steamboat_mirage", ("foreign_crane_cargo", "broken_flag_bottles", "lit_window_hair_comb"), 5.7, (3, 2)),
        ("despina_hump_saddle_shimmerer", "tableland_horizon_ridge", "polarity_carve", "seaward_camel_mirage", ("glittering_saddle_fringe", "two_spotted_humps", "wineskin_packs"), 3.1, (7, 5)),
        ("despina_oasis_veil_projector", "coastline_haze_saddle", "altitude_max", "seaward_camel_mirage", ("thick_whitewashed_courts", "barefoot_veiled_dancers"), 6.3, (9, 5))),

    _mk(9, "Zirma", 1, "Cities and signs", 2, 19,
        "singular unremembered impression", "obsessive_urban_repetition", "skeptical_companion_singularity",
        "Low-altitude dirigible shadow sweeping across humid subterranean platforms and tattoo ink needles",
        ("cornice_dirigible_airway", "cobblestone_puma_arcade", "humid_subway_tattoo_row"),
        ("zirma_cornice_lunatic_multiplier", "cornice_dirigible_airway", "polarity_carve", "obsessive_urban_repetition", ("window_level_dirigibles", "teetering_cornice_lunatics"), 8.4, (6, 5)),
        ("zirma_puma_leash_echoer", "cobblestone_puma_arcade", "emblem_union", "obsessive_urban_repetition", ("shouting_blind_cane_taps", "whim_leashed_pumas"), 6.2, (4, 3)),
        ("zirma_sailor_ink_puncturer", "humid_subway_tattoo_row", "altitude_max", "obsessive_urban_repetition", ("pierced_tattoo_patterns", "humid_packed_trains"), 5.9, (3, 2)),
        ("zirma_single_witness_pruner", "cornice_dirigible_airway", "polarity_carve", "skeptical_companion_singularity", ("lone_hovering_blimp", "single_fanning_matron"), 2.3, (11, 8))),

    _mk(10, "Isaura", 1, "Thin cities", 1, 20,
        "parched calcareous crust beyond lake rim", "abyssal_black_lake_cult", "ascending_windlass_bucket_cult",
        "Subterranean black-water gleam answered by sunlit airy scaffolding of pipes, pulleys, and weathercocks",
        ("calcareous_buried_lake", "thousand_well_shafts", "stilted_aqueduct_skyline"),
        ("isaura_subterranean_lake_diviner", "calcareous_buried_lake", "polarity_carve", "abyssal_black_lake_cult", ("buried_black_lake", "green_perimeter_trace"), 2.6, (1, 1)),
        ("isaura_vertical_bore_driller", "thousand_well_shafts", "emblem_union", "ascending_windlass_bucket_cult", ("deep_vertical_wells", "twisting_trestle_probes"), 6.5, (5, 4)),
        ("isaura_noria_pulley_hoister", "thousand_well_shafts", "polarity_carve", "ascending_windlass_bucket_cult", ("suspended_cable_buckets", "noria_windlasses", "pump_handles"), 8.2, (3, 2)),
        ("isaura_weathercock_stilts_lifter", "stilted_aqueduct_skyline", "altitude_max", "ascending_windlass_bucket_cult", ("stilted_roof_reservoirs", "slender_aqueducts", "airy_weathercocks"), 9.1, (2, 1))),

    # --- CHAPTER 2 (5 Cities) ---
    _mk(11, "Maurilia", 2, "Cities and memory", 5, 30,
        "continuous self-knowing identity", "sepia_postcard_nostalgia", "alien_metropolis_succession",
        "Harsh concrete overpass glare juxtaposed against sepia halftone grain of white parasols",
        ("overpass_bandstand_square", "munitions_parasol_lot", "departed_lares_threshold"),
        ("maurilia_postcard_hen_curator", "overpass_bandstand_square", "polarity_carve", "sepia_postcard_nostalgia", ("postcard_square_hen", "lost_bandstand", "two_white_parasols"), 3.3, (5, 4)),
        ("maurilia_overpass_munitions_builder", "overpass_bandstand_square", "polarity_carve", "alien_metropolis_succession", ("bus_station_concrete", "steel_overpass", "munitions_factory"), 8.0, (4, 3)),
        ("maurilia_measured_regret_balancer", "munitions_parasol_lot", "emblem_union", "sepia_postcard_nostalgia", ("retroactive_provincial_grace", "bounded_praise_etiquette"), 5.1, (3, 2)),
        ("maurilia_silent_god_replacer", "departed_lares_threshold", "altitude_max", "alien_metropolis_succession", ("homonymous_stranger_city", "outsider_gods_beneath_names"), 7.4, (7, 4))),

    _mk(12, "Fedora", 2, "Cities and desire", 4, 32,
        "single-timeline deterministic urbanism", "gray_stone_necessity", "blue_crystal_globe_assumptions",
        "Cold gray ashlar monolith enclosing dark metal rooms lit from within by ratusan blue glass spheres",
        ("gray_stone_arterials", "metal_globe_museum", "obsolete_utopia_vitrine"),
        ("fedora_ashlar_necessity_mason", "gray_stone_arterials", "polarity_carve", "gray_stone_necessity", ("gray_stone_metropolis", "dried_canal_bed", "banished_elephant_avenue"), 7.7, (1, 1)),
        ("fedora_crystal_globe_blower", "metal_globe_museum", "polarity_carve", "blue_crystal_globe_assumptions", ("central_metal_museum", "miniature_blue_fedora"), 3.5, (6, 5)),
        ("fedora_medusa_minaret_modeler", "obsolete_utopia_vitrine", "emblem_union", "blue_crystal_globe_assumptions", ("medusa_reflection_pond", "canopied_elephant_box", "pedestalless_spiral_minaret"), 6.8, (3, 2)),
        ("fedora_assumption_equalizer", "metal_globe_museum", "altitude_max", "blue_crystal_globe_assumptions", ("outdated_yesterday_future", "coequal_map_assumptions"), 6.9, (9, 5))),

    _mk(13, "Zoe", 2, "Cities and signs", 3, 34,
        "legible zoned civic hierarchy", "mental_matrix_of_differences", "indivisible_pyramid_promiscuity",
        "Uniform pyramidal roofs under flat shadowless haze erasing palace-from-slum contours",
        ("pyramid_roof_cluster", "oracle_bazaar_hearth", "wolf_wheel_perimeter"),
        ("zoe_zoning_difference_seeker", "pyramid_roof_cluster", "polarity_carve", "mental_matrix_of_differences", ("expected_prince_palace", "expected_priest_temple"), 2.8, (4, 3)),
        ("zoe_pyramid_function_scrambler", "pyramid_roof_cluster", "polarity_carve", "indivisible_pyramid_promiscuity", ("leprosarium_or_odalisque_bath", "sleep_forge_cook_reign_same_spot"), 8.5, (7, 6)),
        ("zoe_oracle_gold_blender", "oracle_bazaar_hearth", "emblem_union", "indivisible_pyramid_promiscuity", ("simultaneous_gold_and_disrobing", "mingled_mental_features"), 6.1, (5, 4)),
        ("zoe_wolf_howl_border_blurrer", "wolf_wheel_perimeter", "altitude_max", "indivisible_pyramid_promiscuity", ("erased_inside_outside_line", "wheel_rumble_meets_wolf_howl"), 7.3, (11, 8))),

    _mk(14, "Zenobia", 2, "Thin cities", 2, 35,
        "ground-bound desire-erasing cities", "forgotten_founder_plan", "recombinatorial_stilt_desire",
        "Dry terrain crisscrossed by high stilt shadows, zinc-and-bamboo belvederes, and snapping ribbons",
        ("dry_piling_forest", "crossed_hanging_sidewalks", "cone_belvedere_cranes"),
        ("zenobia_dry_piling_driver", "dry_piling_forest", "altitude_max", "recombinatorial_stilt_desire", ("high_pilings_on_dry_land", "bamboo_and_zinc_houses"), 8.6, (3, 2)),
        ("zenobia_hanging_ladder_weaver", "crossed_hanging_sidewalks", "emblem_union", "recombinatorial_stilt_desire", ("crossed_stilt_balconies", "hanging_sidewalks", "suspended_stairways"), 7.1, (5, 4)),
        ("zenobia_undeciphered_plan_ghost", "dry_piling_forest", "polarity_carve", "forgotten_founder_plan", ("lost_founding_command", "superimposed_strata"), 3.0, (9, 8)),
        ("zenobia_banner_pulley_recombiner", "cone_belvedere_cranes", "polarity_carve", "recombinatorial_stilt_desire", ("cone_roofed_belvederes", "jutting_fish_poles", "fluttering_desire_ribbons"), 8.1, (2, 1))),

    _mk(15, "Euphemia", 2, "Trading cities", 1, 36,
        "identical lying yellow-mat bazaars", "daylight_commodity_barter", "solstice_campfire_memory_swap",
        "Noon awning fly-shadow transmuting into nocturnal market-fire embers on carpet bales",
        ("yellow_mat_quay", "equinox_campfire_circle", "swaying_return_caravan"),
        ("euphemia_ginger_muslin_factor", "yellow_mat_quay", "polarity_carve", "daylight_commodity_barter", ("ginger_and_cotton_holds", "pistachio_poppy_sacks", "golden_muslin_bolts"), 3.6, (4, 3)),
        ("euphemia_seven_nation_fire_lighter", "equinox_campfire_circle", "polarity_carve", "solstice_campfire_memory_swap", ("solstice_equinox_gathering", "carpet_bale_firelight"), 8.2, (5, 4)),
        ("euphemia_trigger_word_teller", "equinox_campfire_circle", "emblem_union", "solstice_campfire_memory_swap", ("wolf_tale", "sister_tale", "hidden_treasure_scabies_lovers"), 7.5, (3, 2)),
        ("euphemia_memory_transmuter", "swaying_return_caravan", "altitude_max", "solstice_campfire_memory_swap", ("alien_wolf_in_memory", "different_sister_on_junk"), 7.9, (15, 8))),

    # --- CHAPTER 3 (5 Cities) ---
    _mk(16, "Zobeide", 3, "Cities and desire", 5, 45,
        "open escape trajectories in dream", "fugitive_moonlit_pursuit", "calcified_skein_trap",
        "Stark whitewashed moonlit walls wound into dead-end blind cul-de-sacs without exits",
        ("moon_exposed_skein", "fugitive_vanishing_corner", "commuter_trap_arcades"),
        ("zobeide_dream_pursuit_tracer", "moon_exposed_skein", "polarity_carve", "fugitive_moonlit_pursuit", ("identical_multi_nation_dream", "fleeing_long_haired_shadow"), 2.9, (5, 4)),
        ("zobeide_escape_blocker_mason", "fugitive_vanishing_corner", "polarity_carve", "calcified_skein_trap", ("rearranged_blind_walls", "sealed_vanishing_spot"), 8.7, (7, 4)),
        ("zobeide_skein_arcade_rewinder", "fugitive_vanishing_corner", "altitude_max", "calcified_skein_trap", ("wound_street_skein", "shifted_pursuit_stairways"), 7.4, (3, 2)),
        ("zobeide_amnesiac_work_warden", "commuter_trap_arcades", "emblem_union", "calcified_skein_trap", ("forgotten_dream_chase", "ugly_inescapable_trap"), 6.6, (16, 9))),

    _mk(17, "Hypatia", 3, "Cities and signs", 4, 47,
        "conventional emblem-to-referent comfort", "expected_classical_imagery", "inverted_thing_syntax",
        "Cerulean magnolia lagoon surface hiding bottom crabs, porphyry domes above black-chained basalt",
        ("magnolia_suicide_lagoon", "porphyry_basalt_palace", "tomb_flute_pinnacle"),
        ("hypatia_lagoon_crab_reverser", "magnolia_suicide_lagoon", "polarity_carve", "inverted_thing_syntax", ("reflected_magnolias", "crab_bitten_drowned_suicides"), 8.3, (7, 6)),
        ("hypatia_naive_expectation_breaker", "magnolia_suicide_lagoon", "polarity_carve", "expected_classical_imagery", ("expected_bathing_ladies", "collapsed_vellum_alphabets", "opium_adolescent"), 2.7, (5, 4)),
        ("hypatia_stable_tomb_transposer", "porphyry_basalt_palace", "emblem_union", "inverted_thing_syntax", ("basalt_quarry_convicts", "greaved_stable_amazons", "cemetery_flute_harp_duet"), 7.8, (4, 3)),
        ("hypatia_citadel_sky_ship_watcher", "tomb_flute_pinnacle", "altitude_max", "inverted_thing_syntax", ("lawn_ninepins_sage", "highest_pinnacle_ship_wait"), 8.9, (15, 8))),

    _mk(18, "Armilla", 3, "Thin cities", 3, 49,
        "load-bearing brick-and-mortar enclosure", "dissolved_masonry_shell", "indestructible_naiad_plumbing",
        "Glittering sun-threads of open shower spray and suspended white porcelain against raw sky",
        ("vertical_riser_forest", "suspended_porcelain_boughs", "morning_naiad_fountains"),
        ("armilla_bricklayer_abdicator", "vertical_riser_forest", "polarity_carve", "dissolved_masonry_shell", ("zero_walls_zero_ceilings", "zero_floors_open_void"), 2.2, (9, 8)),
        ("armilla_hydraulic_riser_plumber", "vertical_riser_forest", "polarity_carve", "indestructible_naiad_plumbing", ("vertical_house_pipes", "horizontal_floor_runs", "overflow_spouts"), 8.8, (5, 4)),
        ("armilla_porcelain_fruit_hanger", "suspended_porcelain_boughs", "altitude_max", "indestructible_naiad_plumbing", ("sky_framed_white_lavabo", "suspended_bathtubs", "late_porcelain_fruit"), 8.4, (3, 2)),
        ("armilla_naiad_spray_chorister", "morning_naiad_fountains", "emblem_union", "indestructible_naiad_plumbing", ("sunlit_water_threads", "sponge_suds_mirror", "singing_aquatic_maidens"), 7.6, (2, 1))),

    _mk(19, "Chloe", 3, "Trading cities", 2, 51,
        "clumsy consummated interpersonal friction", "untouched_chaste_vibration", "fantasy_stopping_contact",
        "Rain-darkened bazaar arcade streaked by darting geometric sightline vectors between strangers",
        ("parasol_coral_promenade", "rain_arcade_shelter", "bandstand_awning_nexus"),
        ("chloe_glance_polygon_drawer", "parasol_coral_promenade", "emblem_union", "untouched_chaste_vibration", ("twirling_parasol_girl", "veiled_trembling_matron", "tattooed_giant", "coral_twins"), 7.5, (5, 4)),
        ("chloe_cheetah_fan_combinator", "bandstand_awning_nexus", "altitude_max", "untouched_chaste_vibration", ("blind_man_leashed_cheetah", "ostrich_fan_courtesan", "white_haired_youth"), 6.9, (3, 2)),
        ("chloe_silent_arcade_consummator", "rain_arcade_shelter", "polarity_carve", "untouched_chaste_vibration", ("wordless_fingerless_orgy", "exhausted_arrow_star_triangles"), 8.5, (9, 5)),
        ("chloe_realization_quarantine_guard", "rain_arcade_shelter", "polarity_carve", "fantasy_stopping_contact", ("forbidden_spoken_greeting", "protected_phantom_carousel"), 2.5, (16, 15))),

    _mk(20, "Valdrada", 3, "Cities and eyes", 1, 53,
        "unwitnessed forgetful spontaneity", "erect_parapet_action", "limpid_inverted_lake_image",
        "Railed cliffside verandas doubled down into razor-cold, pitch-clear lacustrine specular inversion",
        ("tiered_lake_verandas", "wardrobe_interior_ceiling", "specular_water_plane"),
        ("valdrada_veranda_parapet_builder", "tiered_lake_verandas", "altitude_max", "erect_parapet_action", ("stacked_railed_verandas", "fluted_lake_facades"), 7.6, (4, 3)),
        ("valdrada_flesh_dagger_actor", "specular_water_plane", "polarity_carve", "erect_parapet_action", ("twisted_lovers_skin", "tendon_blade_black_blood"), 8.6, (3, 2)),
        ("valdrada_limpid_mirror_inverter", "specular_water_plane", "polarity_carve", "limpid_inverted_lake_image", ("cold_limpid_image_dignity", "point_by_point_asymmetry"), 2.4, (8, 5)),
        ("valdrada_loveless_eye_interlocker", "wardrobe_interior_ceiling", "emblem_union", "limpid_inverted_lake_image", ("reflected_wardrobe_mirrors", "interlocked_loveless_eyes"), 7.1, (15, 8))),

    # --- CHAPTER 4 (5 Cities) ---
    _mk(21, "Olivia", 4, "Cities and signs", 5, 61,
        "literal transparent correspondence", "filigree_peacock_euphemism", "soot_mandrel_lathe_truth",
        "Mullioned patio sprinkler rainbows choked by thick black grease-soot and illuminated night-canoes",
        ("filigree_peacock_patio", "mandrel_lathe_shops", "green_estuary_outskirts"),
        ("olivia_filigree_peacock_speaker", "filigree_peacock_patio", "polarity_carve", "filigree_peacock_euphemism", ("mullioned_fringed_cushions", "spinning_lawn_white_peacock", "lit_estuary_canoes"), 3.1, (5, 4)),
        ("olivia_grease_trailer_crusher", "filigree_peacock_patio", "polarity_carve", "soot_mandrel_lathe_truth", ("sticky_soot_grease_cloud", "pedestrian_crushing_trailers"), 8.5, (7, 5)),
        ("olivia_mandrel_shift_repeater", "mandrel_lathe_shops", "altitude_max", "soot_mandrel_lathe_truth", ("lathe_teeth_mandrel", "thousand_hand_shift_pace"), 7.4, (4, 3)),
        ("olivia_darkness_sarcasm_laugher", "green_estuary_outskirts", "emblem_union", "soot_mandrel_lathe_truth", ("sleepwalker_commuter_lines", "falsehood_in_things_not_words"), 6.8, (9, 8))),

    _mk(22, "Sophronia", 4, "Thin cities", 4, 63,
        "stolid immovable institutional permanence", "permanent_roller_coaster_carnival", "nomadic_trailer_ministry_stone",
        "Skeletal Ferris-wheel cages and trapeze humps standing silhouetted beside vacant unbolted marble lots",
        ("roller_coaster_big_top", "bolted_marble_ministry_lot", "annual_trailer_highway"),
        ("sophronia_coaster_trapeze_anchor", "roller_coaster_big_top", "altitude_max", "permanent_roller_coaster_carnival", ("steep_roller_coaster_humps", "spinning_cage_ferris_wheel", "wall_of_death_motorcycles"), 8.9, (3, 2)),
        ("sophronia_marble_ministry_rigger", "bolted_marble_ministry_lot", "polarity_carve", "nomadic_trailer_ministry_stone", ("portable_marble_bank", "demountable_refinery_hospital"), 3.2, (4, 3)),
        ("sophronia_pediment_unbolter_crew", "bolted_marble_ministry_lot", "polarity_carve", "permanent_roller_coaster_carnival", ("lowered_cement_pylons", "vacant_half_city_foundation"), 8.1, (5, 3)),
        ("sophronia_suspended_shout_counter", "annual_trailer_highway", "emblem_union", "permanent_roller_coaster_carnival", ("trailer_convoy_departure", "counting_months_for_return"), 6.7, (15, 8))),

    _mk(23, "Eutropia", 4, "Trading cities", 3, 64,
        "single-site biographical exhaustion", "rotational_role_renewal", "identical_mercurial_yawn",
        "Crisp wind-swept plateau of multiple empty twin towns shifting occupancy like chessmen",
        ("inhabited_plateau_town", "vacant_waiting_twins", "mercury_chessboard_plain"),
        ("eutropia_weariness_exodus_bell", "inhabited_plateau_town", "polarity_carve", "rotational_role_renewal", ("unbearable_debt_and_relatives", "simultaneous_citizen_migration"), 8.0, (5, 4)),
        ("eutropia_wife_job_reallocator", "vacant_waiting_twins", "emblem_union", "rotational_role_renewal", ("fresh_window_declivity", "swapped_job_wife_gossip"), 7.2, (3, 2)),
        ("eutropia_mercury_board_stepper", "mercury_chessboard_plain", "altitude_max", "identical_mercurial_yawn", ("empty_plateau_chessboard", "joltless_equal_wealth"), 6.4, (4, 3)),
        ("eutropia_alternate_mouth_yawner", "inhabited_plateau_town", "polarity_carve", "identical_mercurial_yawn", ("recast_identical_scenes", "alternate_mouths_same_yawn"), 2.9, (9, 8))),

    _mk(24, "Zemrude", 4, "Cities and eyes", 2, 66,
        "objective angle-independent facade", "whistling_upward_sill_gaze", "clenched_gutter_cellar_sink",
        "High flapping sunlit window curtains severed at eye-horizon from fish-scaled wet cobblestones",
        ("flapping_curtain_sills", "encrusted_wall_foot", "manhole_cellar_wells"),
        ("zemrude_nose_tilt_whistler", "flapping_curtain_sills", "polarity_carve", "whistling_upward_sill_gaze", ("upward_window_sills", "flapping_curtains_fountains"), 8.2, (2, 1)),
        ("zemrude_palm_nail_clencher", "flapping_curtain_sills", "polarity_carve", "clenched_gutter_cellar_sink", ("nails_dug_in_palms", "gutter_fish_scales_wastepaper"), 2.6, (16, 15)),
        ("zemrude_drainpipe_gravity_puller", "encrusted_wall_foot", "emblem_union", "clenched_gutter_cellar_sink", ("yesterday_ill_humor_crust", "irreversible_cobblestone_lock"), 7.3, (7, 6)),
        ("zemrude_subsoil_eye_digger", "manhole_cellar_wells", "altitude_max", "clenched_gutter_cellar_sink", ("manhole_covers", "gaze_digging_cellars_and_wells"), 6.8, (4, 3))),

    _mk(25, "Aglaura", 4, "Cities and names", 1, 67,
        "fresh unlabelled perceptual speech", "compact_proverbial_name_fortress", "unspoken_ground_glimmer",
        "Opaque typographic density of repeated proverbs eclipsing a fleeting oblique street-corner gleam",
        ("proverbial_canon_forum", "colorless_random_streets", "unfixed_glimmer_corner"),
        ("aglaura_proverb_canon_repeater", "proverbial_canon_forum", "polarity_carve", "compact_proverbial_name_fortress", ("ancient_virtue_fault_code", "solid_spoken_aglaura"), 8.4, (3, 2)),
        ("aglaura_inverted_norm_chronicler", "colorless_random_streets", "emblem_union", "compact_proverbial_name_fortress", ("bizarre_turned_usual", "imprisoned_repetitive_words"), 6.5, (4, 3)),
        ("aglaura_nameless_hour_opener", "proverbial_canon_forum", "polarity_carve", "unspoken_ground_glimmer", ("rare_unmistakable_street_hint", "ground_growing_aglaura"), 2.7, (9, 5)),
        ("aglaura_wordless_memory_mourner", "unfixed_glimmer_corner", "altitude_max", "unspoken_ground_glimmer", ("less_existing_visible_site", "erased_for_lack_of_words"), 7.0, (15, 8))),

    # --- CHAPTER 5 (5 Cities) ---
    _mk(26, "Octavia", 5, "Thin cities", 5, 75,
        "immortalist bedrock complacency", "abyss_catenary_suspension", "finite_rope_lifespan_lucidity",
        "Vertiginous cloud-chasm updrafts swaying hempen catwalks and sack-houses hung beneath wooden ties",
        ("twin_mountain_crest_anchors", "hempen_tie_catwalk_net", "underhung_gondola_abyss"),
        ("octavia_crest_cable_tensioner", "twin_mountain_crest_anchors", "altitude_max", "abyss_catenary_suspension", ("steep_precipice_ropes", "iron_chains_wooden_ties"), 9.2, (3, 2)),
        ("octavia_downward_sack_hanger", "underhung_gondola_abyss", "emblem_union", "abyss_catenary_suspension", ("sack_houses_below_net", "gondola_terraces", "hanging_chandeliers_trapezes"), 8.1, (5, 4)),
        ("octavia_void_cloud_glimpser", "hempen_tie_catwalk_net", "polarity_carve", "abyss_catenary_suspension", ("hundreds_of_feet_of_nothing", "gliding_below_clouds"), 7.8, (2, 1)),
        ("octavia_net_rupture_reckoner", "hempen_tie_catwalk_net", "polarity_carve", "finite_rope_lifespan_lucidity", ("measured_hempen_decay", "less_uncertain_mortal_life"), 3.1, (7, 4))),

    _mk(27, "Ersilia", 5, "Trading cities", 4, 76,
        "crumbling unrelational stone walls", "impassable_taut_chord_web", "nomadic_wall_dismantlement",
        "Plain of bare poles laced with taut white, black, and gray threads standing intact after houses vanish",
        ("corner_post_string_loom", "abandoned_chord_plain", "mountainside_refugee_camp"),
        ("ersilia_four_color_cord_stretcher", "corner_post_string_loom", "polarity_carve", "impassable_taut_chord_web", ("white_blood_strings", "black_trade_gray_authority", "black_white_agency_cords"), 8.9, (3, 2)),
        ("ersilia_zero_passage_detector", "corner_post_string_loom", "polarity_carve", "nomadic_wall_dismantlement", ("choked_street_clearance", "dismantled_house_timbers"), 2.8, (5, 4)),
        ("ersilia_bare_web_preserver", "abandoned_chord_plain", "altitude_max", "impassable_taut_chord_web", ("poles_and_taut_strings_alone", "wall_less_boneless_ruin"), 8.4, (9, 5)),
        ("ersilia_complex_reweave_migrator", "mountainside_refugee_camp", "emblem_union", "nomadic_wall_dismantlement", ("refugee_hillside_gaze", "regular_denser_next_ersilia"), 7.2, (15, 8))),

    _mk(28, "Baucis", 5, "Cities and eyes", 3, 77,
        "trampling heavy-footed earth seizure", "cloud_piercing_flamingo_stilts", "downward_telescope_self_absence",
        "Pierced angular lace-shadow falling on sunlit woodland canopy from invisible cloud-borne platforms",
        ("woodland_flamingo_legs", "above_cloud_deck", "foliage_angular_shadow"),
        ("baucis_flamingo_stilt_elevater", "woodland_flamingo_legs", "altitude_max", "cloud_piercing_flamingo_stilts", ("slender_distant_stilts", "cloud_lost_ladders"), 9.3, (2, 1)),
        ("baucis_zero_contact_ascetic", "above_cloud_deck", "polarity_carve", "cloud_piercing_flamingo_stilts", ("self_contained_aerial_deck", "untouched_below_soil"), 8.2, (5, 4)),
        ("baucis_ant_leaf_spyglass_aimer", "above_cloud_deck", "polarity_carve", "downward_telescope_self_absence", ("downward_telescopes", "leaf_stone_ant_inspection"), 2.9, (3, 2)),
        ("baucis_absence_shadow_caster", "foliage_angular_shadow", "emblem_union", "downward_telescope_self_absence", ("pierced_angular_canopy_shadow", "fascinated_own_absence"), 7.7, (9, 5))),

    _mk(29, "Leandra", 5, "Cities and names", 2, 78,
        "silent uncontested domesticity", "migrating_key_penates", "rooted_kitchen_pot_lares",
        "Dim nocturnal stucco cornices and radiator pipes alive with microscopic huffing silhouettes",
        ("coatrack_umbrella_threshold", "kitchen_flue_rusty_can", "stucco_radiator_cornice"),
        ("leandra_coatrack_penates_mover", "coatrack_umbrella_threshold", "polarity_carve", "migrating_key_penates", ("umbrella_stand_guardians", "emigrating_family_soul"), 8.1, (5, 4)),
        ("leandra_chimney_lares_multiplier", "coatrack_umbrella_threshold", "polarity_carve", "rooted_kitchen_pot_lares", ("vacant_lot_rusty_can_gods", "fifty_kitchen_block_fission"), 3.0, (4, 3)),
        ("leandra_radiator_pipe_banterer", "stucco_radiator_cornice", "emblem_union", "migrating_key_penates", ("cornice_night_strolls", "great_aunt_vs_ruined_site_critique"), 7.1, (3, 2)),
        ("leandra_ironic_murmur_listener", "kitchen_flue_rusty_can", "altitude_max", "rooted_kitchen_pot_lares", ("future_career_and_house_daydreams", "stifled_nocturnal_laughter"), 6.6, (9, 8))),

    _mk(30, "Melania", 5, "Cities and the dead", 1, 80,
        "mortal biographical silence", "ephemeral_dying_cast", "immortal_cascading_dialogue",
        "Harsh theatrical noon square where dialogue masks relay mid-syllable across thousands of shifting faces",
        ("threshold_square_proscenium", "role_reassignment_wings", "multiplied_chorus_steps"),
        ("melania_braggart_usurer_declaimer", "threshold_square_proscenium", "polarity_carve", "immortal_cascading_dialogue", ("soldier_parasite_wastrel", "miserly_father_procuress_note"), 8.5, (3, 2)),
        ("melania_mortal_actor_reaper", "threshold_square_proscenium", "polarity_carve", "ephemeral_dying_cast", ("deceased_parasite_and_father", "short_blind_inhabitant_lifespan"), 2.6, (16, 9)),
        ("melania_hypocrite_role_shifter", "role_reassignment_wings", "emblem_union", "immortal_cascading_dialogue", ("cascade_role_replacement", "three_thousand_hypocrites", "hundred_thousand_fallen_princes"), 7.9, (5, 4)),
        ("melania_slow_denouement_plotter", "multiplied_chorus_steps", "altitude_max", "immortal_cascading_dialogue", ("thickening_multi_century_plot", "act_to_act_voice_drift"), 7.4, (15, 8))),

    # --- CHAPTER 6 (5 Cities) ---
    _mk(31, "Esmeralda", 6, "Trading cities", 5, 88,
        "orthogonal single-level Euclidean grid", "combinatorial_canal_bridge_zigzag", "clandestine_gutter_sewer_swallow_arcs",
        "Multi-colored cartographic ink strata crossed by cambered canal reflections and high swallow parabolas",
        ("intersecting_canal_landings", "rooftop_gutter_sewer_spokes", "swallow_parabola_airspace"),
        ("esmeralda_land_boat_zigzagger", "intersecting_canal_landings", "emblem_union", "combinatorial_canal_bridge_zigzag", ("cambered_bridges", "hanging_streets", "non_repeating_daily_routes"), 7.8, (5, 4)),
        ("esmeralda_acrobat_lover_rooftopper", "rooftop_gutter_sewer_spokes", "polarity_carve", "clandestine_gutter_sewer_swallow_arcs", ("cat_thief_lover_balcony_drops", "discontinuous_gutter_steps"), 8.3, (3, 2)),
        ("esmeralda_gunpowder_sewer_smuggler", "rooftop_gutter_sewer_spokes", "polarity_carve", "combinatorial_canal_bridge_zigzag", ("rat_tail_dark_sewers", "cheese_crust_gunpowder_kegs"), 3.1, (7, 5)),
        ("esmeralda_swallow_parabola_dominator", "swallow_parabola_airspace", "altitude_max", "clandestine_gutter_sewer_swallow_arcs", ("still_wing_invisible_parabolas", "mosquito_dart_pinnacle_graze"), 9.4, (2, 1))),

    _mk(32, "Phyllis", 6, "Cities and eyes", 4, 90,
        "blank-page habitual blindness", "first_glance_tracery_marvel", "habituated_footstep_erasure",
        "Stained-glass rose windows and caper-bush corbels bleaching out into stark sun/shade pavement patches",
        ("tracery_canal_bridges", "bleached_habit_zigzag", "thirty_year_arcade_slant"),
        ("phyllis_corbel_rose_arriver", "tracery_canal_bridges", "polarity_carve", "first_glance_tracery_marvel", ("mullioned_moorish_lancet_windows", "fortress_caper_bush", "three_queens_onion_spire"), 8.6, (5, 4)),
        ("phyllis_staying_fade_bleacher", "tracery_canal_bridges", "polarity_carve", "habituated_footstep_erasure", ("expunged_domes_and_statues", "stumble_hole_creditor_detour"), 2.4, (16, 15)),
        ("phyllis_blank_page_eye_scanner", "bleached_habit_zigzag", "emblem_union", "habituated_footstep_erasure", ("points_suspended_in_void", "millions_scanning_blank_page"), 6.3, (9, 8)),
        ("phyllis_surprise_sleeve_igniter", "thirty_year_arcade_slant", "altitude_max", "first_glance_tracery_marvel", ("embroidered_sleeve_memory_glint", "caught_by_surprise_aperture"), 7.7, (15, 8))),

    _mk(33, "Pyrrha", 6, "Cities and names", 3, 92,
        "unvisited phonetic reverie", "imagined_goblet_bay_fortress", "yellow_dust_sawmill_reality",
        "Harsh flat yellowish sawmill dust and hidden dune-sea obliterating a dark vertical well-square",
        ("imagined_goblet_well_square", "dune_screened_sawmill_lots", "buzzing_wind_pump_horizon"),
        ("pyrrha_goblet_well_conjurer", "imagined_goblet_well_square", "polarity_carve", "imagined_goblet_bay_fortress", ("bay_slope_high_towers", "deep_goblet_square_well"), 2.8, (4, 3)),
        ("pyrrha_arrival_name_overwriter", "imagined_goblet_well_square", "polarity_carve", "yellow_dust_sawmill_reality", ("sea_hidden_behind_low_dune", "straight_lumber_stack_streets"), 8.5, (7, 6)),
        ("pyrrha_wind_pump_dust_buzzer", "buzzing_wind_pump_horizon", "emblem_union", "yellow_dust_sawmill_reality", ("spinning_water_pump_vanes", "inevitable_yellowish_dust"), 7.1, (5, 4)),
        ("pyrrha_nameless_orphan_archivist", "dune_screened_sawmill_lots", "altitude_max", "imagined_goblet_bay_fortress", ("getullia_odile_euphrasia_margara", "unnameable_surviving_bay_city"), 6.9, (9, 5))),

    _mk(34, "Adelma", 6, "Cities and the dead", 2, 94,
        "open-ended plastic facial novelty", "living_stranger_anguish", "saturated_ancestral_death_masks",
        "Dusk wholesale fish-market shadows under sackcloth hoods turning every face into a dead relative",
        ("urchin_bollard_dock", "cabbage_balcony_alley", "sackcloth_stevedore_steps"),
        ("adelma_dusk_dock_mask_printer", "urchin_bollard_dock", "polarity_carve", "saturated_ancestral_death_masks", ("dead_soldier_bollard_sailor", "sea_urchin_cart_fisherman", "yellow_eyed_fever_father"), 8.7, (6, 5)),
        ("adelma_alien_face_dissolver", "urchin_bollard_dock", "polarity_carve", "living_stranger_anguish", ("averted_fearful_gaze", "anguished_dissolved_resemblance"), 2.7, (11, 8)),
        ("adelma_cabbage_scale_grandmother", "cabbage_balcony_alley", "emblem_union", "saturated_ancestral_death_masks", ("dangling_balcony_suicide_girl", "grandmother_vegetable_vendor"), 7.6, (4, 3)),
        ("adelma_hooded_kaleidoscope_absorber", "sackcloth_stevedore_steps", "altitude_max", "saturated_ancestral_death_masks", ("demijohn_sackcloth_stevedores", "dead_outnumbering_living", "unhappy_beyond"), 8.0, (15, 8))),

    _mk(35, "Eudoxia", 6, "Cities and the sky", 1, 96,
        "unmapped sensory jostling", "symmetrical_crimson_carpet_cosmos", "shapeless_mule_stain_universe",
        "Indigo-and-crimson woven arabesques set directly beside lampblack stains and crumbling dust clouds",
        ("crimson_indigo_carpet_shrine", "lampblack_mule_alleys", "ambiguous_oracle_altar"),
        ("eudoxia_arabesque_woof_weaver", "crimson_indigo_carpet_shrine", "polarity_carve", "symmetrical_crimson_carpet_cosmos", ("straight_circular_spires", "crimson_magenta_destination_loop"), 8.4, (3, 2)),
        ("eudoxia_bray_lampblack_spreader", "crimson_indigo_carpet_shrine", "polarity_carve", "shapeless_mule_stain_universe", ("braying_mules_fish_smell", "crumbling_crooked_dust_fires"), 3.1, (7, 4)),
        ("eudoxia_anguish_thread_finder", "lampblack_mule_alleys", "emblem_union", "symmetrical_crimson_carpet_cosmos", ("hidden_fate_twist_in_woof", "complete_proportion_point"), 7.2, (5, 4)),
        ("eudoxia_reversible_oracle_augur", "ambiguous_oracle_altar", "altitude_max", "shapeless_mule_stain_universe", ("starry_orbit_form_reversal", "city_stain_as_true_sky_map"), 8.1, (9, 5))),

    # --- CHAPTER 7 (5 Cities) ---
    _mk(36, "Moriana", 7, "Cities and eyes", 5, 105,
        "volumetric three-dimensional urban depth", "alabaster_medusa_front", "rusted_spike_tin_obverse",
        "Zero-thickness paper edge splitting sunlit glass-aquarium villas from soot-blackened spiked planks",
        ("alabaster_coral_villas", "semicircle_paper_fold", "spiked_plank_rotten_beam"),
        ("moriana_alabaster_aquarium_glazier", "alabaster_coral_villas", "polarity_carve", "alabaster_medusa_front", ("sunlit_alabaster_gates", "serpentine_coral_columns", "medusa_chandelier_dancers"), 8.6, (5, 4)),
        ("moriana_rusted_obverse_riveter", "alabaster_coral_villas", "polarity_carve", "rusted_spike_tin_obverse", ("rusted_sheet_metal_sackcloth", "spiked_planks_soot_pipes", "rotten_beam_hanging_ropes"), 2.3, (16, 15)),
        ("moriana_semicircle_detour_walker", "semicircle_paper_fold", "altitude_max", "rusted_spike_tin_obverse", ("abrupt_hidden_face_turn", "staved_in_straw_chairs"), 7.4, (7, 5)),
        ("moriana_zero_thickness_binder", "spiked_plank_rotten_beam", "emblem_union", "alabaster_medusa_front", ("inseparable_blind_paper_sides", "zero_thickness_perspective"), 7.9, (3, 2))),

    _mk(37, "Clarice", 7, "Cities and names", 4, 106,
        "linear unbroken heritage preservation", "mythic_unproven_first_splendor", "chipped_gimcrack_shard_shuffle",
        "Velvet bell-jars beside festering rabbit-cage hovels roasting meat on torn wrought-iron harem grilles",
        ("plague_rummage_basements", "velvet_bell_capital_museum", "hen_basket_corinthian_yard"),
        ("clarice_survivor_shard_repurposer", "plague_rummage_basements", "polarity_carve", "chipped_gimcrack_shard_shuffle", ("brocade_curtain_bedsheets", "marble_urn_basil_pots", "harem_grating_cat_roasters"), 8.5, (5, 4)),
        ("clarice_velvet_bell_canonizer", "plague_rummage_basements", "polarity_carve", "mythic_unproven_first_splendor", ("usurper_butterfly_wealth", "display_case_shards"), 2.9, (4, 3)),
        ("clarice_hen_egg_capital_mover", "hen_basket_corinthian_yard", "emblem_union", "chipped_gimcrack_shard_shuffle", ("chicken_run_corinthian_capital", "lost_succession_of_eras"), 7.6, (3, 2)),
        ("clarice_obsolete_shuffle_dealer", "velvet_bell_capital_museum", "altitude_max", "chipped_gimcrack_shard_shuffle", ("unproven_original_clarice", "shuffled_chipped_gimcracks"), 8.0, (9, 8))),

    _mk(38, "Eusapia", 7, "Cities and the dead", 3, 109,
        "abrupt irreversible boundary of death", "carefree_upper_imitators", "remodeling_subterranean_mummies",
        "Subterranean torchlight on yellow parchment skeletons playing little trumpets and editing blueprints",
        ("upper_carefree_banquet", "hooded_confraternity_shaft", "lower_parchment_necropolis"),
        ("eusapia_parchment_corpse_poser", "lower_parchment_necropolis", "emblem_union", "remodeling_subterranean_mummies", ("yellow_skin_laughing_skulls", "stopped_clock_parchment_ear", "carcass_milking_girl"), 8.1, (5, 4)),
        ("eusapia_hooded_brother_courier", "hooded_confraternity_shaft", "altitude_max", "remodeling_subterranean_mummies", ("exclusive_tunnel_authority", "ambiguous_dead_or_living_guides"), 7.7, (3, 2)),
        ("eusapia_catacomb_vault_remodeler", "upper_carefree_banquet", "polarity_carve", "remodeling_subterranean_mummies", ("sober_underground_remodelings", "dead_built_upper_city"), 8.8, (7, 4)),
        ("eusapia_living_copycat_follower", "upper_carefree_banquet", "polarity_carve", "carefree_upper_imitators", ("living_copying_necropolis", "indistinguishable_alive_and_dead"), 2.6, (9, 8))),

    _mk(39, "Beersheba", 7, "Cities and the sky", 2, 111,
        "self-possessed calculating hoarding", "hoarded_jewel_subsoil_hell", "castoff_peel_celestial_orbit",
        "Grim subterranean brass-gear luxury contrasted with a radiant zenith planet of orbiting potato peels",
        ("diamond_hoard_terrestrial_vault", "tasseled_gear_infernal_subsoil", "potato_peel_comet_zenith"),
        ("beersheba_carat_mania_hoarder", "diamond_hoard_terrestrial_vault", "polarity_carve", "hoarded_jewel_subsoil_hell", ("silver_locks_diamond_gates", "grim_composite_composure"), 2.8, (4, 3)),
        ("beersheba_authoritative_hell_engineer", "tasseled_gear_infernal_subsoil", "emblem_union", "hoarded_jewel_subsoil_hell", ("expensive_subsoil_gearwork", "fringed_tasseled_pipes"), 6.9, (7, 6)),
        ("beersheba_rubbish_zenith_orbiter", "diamond_hoard_terrestrial_vault", "polarity_carve", "castoff_peel_celestial_orbit", ("potato_peel_umbrella_planet", "tram_ticket_eggshell_paving"), 8.9, (3, 2)),
        ("beersheba_generous_comet_releaser", "potato_peel_comet_zenith", "altitude_max", "castoff_peel_celestial_orbit", ("long_tailed_free_comets", "ungreedy_detachment_moment"), 9.2, (2, 1))),

    _mk(40, "Leonia", 7, "Continuous cities", 1, 114,
        "biodegradable self-digesting frugality", "spotless_morning_unwrapping", "indestructible_refuse_mountain_cuirass",
        "Pristine plastic morning glare ringed on every horizon by towering craters of unmated shoes and pianos",
        ("fresh_soap_morning_core", "angelic_garbage_perimeter", "colliding_detritus_ramparts"),
        ("leonia_brand_new_unwrapper", "fresh_soap_morning_core", "polarity_carve", "spotless_morning_unwrapping", ("fresh_sheets_unopened_tins", "expulsion_cleansing_passion"), 3.0, (5, 4)),
        ("leonia_indestructible_slag_piler", "fresh_soap_morning_core", "polarity_carve", "indestructible_refuse_mountain_cuirass", ("discarded_boilers_pianos_porcelain", "time_proof_plastic_cuirass"), 8.9, (7, 4)),
        ("leonia_rival_rampart_collider", "angelic_garbage_perimeter", "altitude_max", "indestructible_refuse_mountain_cuirass", ("hostile_neighbor_trash_crests", "stratified_decade_sweepings"), 9.3, (3, 2)),
        ("leonia_avalanche_bulldozer_watcher", "colliding_detritus_ramparts", "emblem_union", "indestructible_refuse_mountain_cuirass", ("rolling_tin_can_landslide", "waiting_neighbor_bulldozers"), 7.8, (16, 9))),

    # --- CHAPTER 8 (5 Cities) ---
    _mk(41, "Irene", 8, "Cities and names", 5, 124,
        "interior stable self-identity", "distant_plateau_magnet_glow", "mutated_interior_capture",
        "Pink twilight sponge-glow at gulley foot under yellow powder-flash and windy plateau rim",
        ("windy_plateau_overlook", "misty_gulley_pink_glow", "bad_valley_descent_road"),
        ("irene_plateau_shepherd_conjecturer", "windy_plateau_overlook", "polarity_carve", "distant_plateau_magnet_glow", ("leaning_hermits_bird_catchers", "pink_concentrated_window_glow"), 8.3, (5, 4)),
        ("irene_windborne_drum_gun_carrier", "misty_gulley_pink_glow", "emblem_union", "distant_plateau_magnet_glow", ("festival_bass_drum_firecrackers", "civil_war_powder_explosion"), 7.1, (3, 2)),
        ("irene_approach_name_mutator", "windy_plateau_overlook", "polarity_carve", "mutated_interior_capture", ("vanishing_irene_upon_entry", "trapped_vs_passing_names"), 2.9, (9, 5)),
        ("irene_horizon_magnet_polarizer", "bad_valley_descent_road", "altitude_max", "distant_plateau_magnet_glow", ("unwalked_winding_valley_roads", "every_city_spoken_as_irene"), 7.8, (2, 1))),

    _mk(42, "Argia", 8, "Cities and the dead", 4, 126,
        "open atmospheric sunlit void", "solid_packed_clay_volume", "nocturnal_subterranean_door_slam",
        "Total subterranean pitch-blackness where negative stairways press into packed earth and twisted roots",
        ("dirt_packed_negative_stairs", "worm_root_crevice_network", "surface_ear_ground_crust"),
        ("argia_clay_room_packer", "dirt_packed_negative_stairs", "polarity_carve", "solid_packed_clay_volume", ("earth_instead_of_air", "ceiling_packed_clay", "negative_stairway_imprints"), 8.8, (1, 1)),
        ("argia_worm_crevice_prone_sleeper", "worm_root_crevice_network", "emblem_union", "solid_packed_clay_volume", ("twisting_root_tunnels", "damp_prone_immobility"), 6.7, (16, 15)),
        ("argia_rocky_cloud_overburden", "dirt_packed_negative_stairs", "altitude_max", "solid_packed_clay_volume", ("rock_strata_like_cloudy_skies", "invisible_deserted_surface"), 7.5, (4, 3)),
        ("argia_night_door_slam_listener", "surface_ear_ground_crust", "polarity_carve", "nocturnal_subterranean_door_slam", ("ear_pressed_to_night_ground", "distant_buried_door_slam"), 2.5, (7, 4))),

    _mk(43, "Thekla", 8, "Cities and the sky", 3, 127,
        "completed static terminal monument", "perpetual_anti_ruin_scaffolding", "nocturnal_star_field_blueprint",
        "Sackcloth-screened pine planks and self-hoisting cranes dissolving at dusk into crisp stellar blueprints",
        ("plank_fence_eye_crack", "crane_lifting_crane_rig", "sunset_star_blueprint_vault"),
        ("thekla_crane_on_crane_hoister", "crane_lifting_crane_rig", "altitude_max", "perpetual_anti_ruin_scaffolding", ("cranes_pulling_other_cranes", "scaffoldings_embracing_scaffoldings"), 9.1, (3, 2)),
        ("thekla_destruction_deferral_mason", "plank_fence_eye_crack", "polarity_carve", "perpetual_anti_ruin_scaffolding", ("leaded_plumb_strings", "whispered_not_only_the_city"), 8.4, (5, 4)),
        ("thekla_premature_completion_blocker", "plank_fence_eye_crack", "polarity_carve", "nocturnal_star_field_blueprint", ("unremoved_armature_trestles", "suspended_day_shift"), 3.1, (4, 3)),
        ("thekla_sunset_constellation_drafter", "sunset_star_blueprint_vault", "emblem_union", "nocturnal_star_field_blueprint", ("darkened_building_site", "star_filled_sky_blueprint"), 8.7, (2, 1))),

    _mk(44, "Trude", 8, "Continuous cities", 2, 128,
        "place-specific irreducible difference", "global_airport_sign_swap", "inescapable_suburban_isomorphism",
        "Flat greenish-yellowish fluorescent haze over identical flower-bed roundabouts and hardware counters",
        ("homonymous_airport_tarmac", "greenish_yellowish_roundabout", "hardware_goblet_hotel"),
        ("trude_airport_placard_swapper", "homonymous_airport_tarmac", "polarity_carve", "global_airport_sign_swap", ("changed_airport_big_letters", "illusory_flight_departure"), 2.9, (1, 1)),
        ("trude_suburb_clone_stamper", "homonymous_airport_tarmac", "polarity_carve", "inescapable_suburban_isomorphism", ("identical_greenish_yellowish_houses", "same_square_flower_beds"), 8.6, (9, 8)),
        ("trude_hardware_dialogue_looper", "hardware_goblet_hotel", "emblem_union", "inescapable_suburban_isomorphism", ("pre_heard_hardware_scripts", "same_goblets_swaying_navels"), 6.8, (4, 3)),
        ("trude_beginless_endless_auditor", "greenish_yellowish_roundabout", "altitude_max", "inescapable_suburban_isomorphism", ("sole_world_blanketing_trude", "diagnostic_monoculture_specimen"), 7.2, (16, 15))),

    _mk(45, "Olinda", 8, "Hidden cities", 1, 129,
        "withered dead-core suburban sprawl", "microscopic_pinhead_blossom", "centrifugal_proportional_ring_push",
        "Magnifying-glass caustic spotlight revealing miniature racetracks swelling outward from the core",
        ("pinhead_magnifying_nucleus", "lemon_soup_plate_annulus", "expanded_outer_horizon_walls"),
        ("olinda_pinhead_lens_hunter", "pinhead_magnifying_nucleus", "polarity_carve", "microscopic_pinhead_blossom", ("pinhead_roofs_skylights_pools", "micro_streamers_racetrack"), 8.9, (2, 1)),
        ("olinda_lemon_plate_inflator", "lemon_soup_plate_annulus", "emblem_union", "microscopic_pinhead_blossom", ("half_lemon_to_mushroom_scale", "inner_blossoming_lymph"), 7.9, (5, 4)),
        ("olinda_proportional_wall_expander", "pinhead_magnifying_nucleus", "polarity_carve", "centrifugal_proportional_ring_push", ("thinned_middle_quarters", "horizon_broadened_ancient_walls"), 3.2, (3, 2)),
        ("olinda_recursive_embryo_seeder", "expanded_outer_horizon_walls", "altitude_max", "microscopic_pinhead_blossom", ("nested_future_olindas", "inverted_tree_ring_growth"), 8.5, (15, 8))),

    # --- CHAPTER 9 (10 Cities) ---
    _mk(46, "Laudomia", 9, "Cities and the dead", 5, 140,
        "presentist consequence-blindness", "ordered_necropolis_certainty", "unborn_pore_hourglass_dread",
        "Hollow marble domes veined with microscopic eggplant-robed crowds poised above an unturned hourglass",
        ("crowded_living_compartments", "windowless_slab_necropolis", "marble_vein_unborn_domes"),
        ("laudomia_slab_order_archivist", "windowless_slab_necropolis", "polarity_carve", "ordered_necropolis_certainty", ("gravedigger_cart_lanes", "chance_divorced_stone_slabs"), 3.1, (4, 3)),
        ("laudomia_marble_pore_crowder", "windowless_slab_necropolis", "polarity_carve", "unborn_pore_hourglass_dread", ("silkworm_ant_egg_unborn", "eggplant_barracan_descendants", "suffocating_funnel_stadiums"), 8.8, (7, 4)),
        ("laudomia_silent_dome_interrogator", "crowded_living_compartments", "emblem_union", "unborn_pore_hourglass_dread", ("echoing_hollow_footsteps", "disconnected_dust_grain_lineage"), 7.3, (5, 4)),
        ("laudomia_last_grain_hourglass_warden", "marble_vein_unborn_domes", "altitude_max", "unborn_pore_hourglass_dread", ("unturned_two_bulb_hourglass", "waiting_final_inhabitant_grain"), 8.4, (15, 8))),

    _mk(47, "Perinthia", 9, "Cities and the sky", 4, 144,
        "pragmatic uncalculated vernacular growth", "zodiac_eclipse_cardo_precision", "three_headed_cellar_monsters",
        "Razor-aligned solar decumanus shadow-cuts framing lunar eclipses above dark howling lofts",
        ("solar_cardo_decumanus_cross", "twelve_eclipse_zodiac_gates", "hidden_six_legged_cellars"),
        ("perinthia_eclipse_gate_astronomer", "solar_cardo_decumanus_cross", "polarity_carve", "zodiac_eclipse_cardo_precision", ("sun_axis_cardo_decumanus", "thousand_year_lunar_eclipse_gates"), 3.0, (3, 2)),
        ("perinthia_cellar_monster_breeder", "solar_cardo_decumanus_cross", "polarity_carve", "three_headed_cellar_monsters", ("square_cripples_bearded_women", "three_headed_six_legged_howls"), 8.9, (7, 5)),
        ("perinthia_zodiac_ward_mapper", "twelve_eclipse_zodiac_gates", "altitude_max", "zodiac_eclipse_cardo_precision", ("twelve_constellation_temples", "guaranteed_firmament_harmony"), 7.6, (4, 3)),
        ("perinthia_monstrous_god_dilemma_judge", "hidden_six_legged_cellars", "emblem_union", "three_headed_cellar_monsters", ("failed_math_or_monstrous_heavens", "exact_divine_deformity"), 8.3, (16, 9))),

    _mk(48, "Procopia", 9, "Continuous cities", 3, 146,
        "unpeopled pastoral horizon depth", "trapeze_sky_medlar_window", "shoulder_straddling_polite_occlusion",
        "Inn window rectangle progressively bricked solid from horizon to sill by flat, smiling, corn-chewing faces",
        ("inn_curtain_window_frame", "medlar_ditch_bridge_field", "twenty_six_lodger_bedroom"),
        ("procopia_pastoral_frame_keeper", "inn_curtain_window_frame", "polarity_carve", "trapeze_sky_medlar_window", ("trapeze_blue_sky_patch", "yellow_hill_medlar_brambles"), 2.4, (5, 4)),
        ("procopia_corn_chewing_face_packer", "inn_curtain_window_frame", "polarity_carve", "shoulder_straddling_polite_occlusion", ("one_three_six_sixteen_forty_seven", "blackberry_stained_round_smiles"), 9.0, (9, 8)),
        ("procopia_shoulder_straddle_stacker", "medlar_ditch_bridge_field", "altitude_max", "shoulder_straddling_polite_occlusion", ("occluded_bridge_and_sky", "wall_to_wall_flat_faces"), 8.2, (4, 3)),
        ("procopia_polite_knee_room_crammer", "twenty_six_lodger_bedroom", "emblem_union", "shoulder_straddling_polite_occlusion", ("twenty_six_in_one_room", "polite_chest_and_bed_elbows"), 7.5, (7, 6))),

    _mk(49, "Raissa", 9, "Hidden cities", 2, 148,
        "monolithic unthreaded despair", "hammer_bruised_ledger_gloom", "ephemeral_francolin_joy_thread",
        "Grim zinc-counter shadow pierced by a millisecond red-and-yellow illuminated kinetic lightning-chain",
        ("awry_ledger_zinc_wineshop", "pergola_ragout_scaffolding", "freed_francolin_page_sky"),
        ("raissa_bruised_thumb_grumbler", "awry_ledger_zinc_wineshop", "polarity_carve", "hammer_bruised_ledger_gloom", ("hammer_struck_needle_pricked_hands", "broken_summer_dishes_awry_ledgers"), 2.7, (16, 15)),
        ("raissa_polenta_ragout_relay", "awry_ledger_zinc_wineshop", "polarity_carve", "ephemeral_francolin_joy_thread", ("laughing_window_child", "polenta_shed_dog_stonemason_shout", "ragout_maid_lace_parasol"), 8.8, (5, 4)),
        ("raissa_jumping_horse_francolin_painter", "pergola_ragout_scaffolding", "altitude_max", "ephemeral_francolin_joy_thread", ("smiling_jumping_officer_horse", "freed_red_yellow_speckled_francolin"), 8.5, (3, 2)),
        ("raissa_unaware_thread_restretcher", "freed_francolin_page_sky", "emblem_union", "ephemeral_francolin_joy_thread", ("rapid_unraveling_living_thread", "unaware_happy_city_inside_sad"), 8.1, (2, 1))),

    _mk(50, "Andria", 9, "Cities and the sky", 5, 150,
        "one-way fatalistic astrological determinism", "meticulous_orbital_regimentation", "prudent_nova_triggering_realignment",
        "Suspended bamboo-grove streets reflected directly into telescope lenses flaring orange-to-yellow novas",
        ("cepheid_orbital_street_ring", "bamboo_shadow_theater_port", "nova_spiral_observatory"),
        ("andria_antares_calendar_aligner", "cepheid_orbital_street_ring", "emblem_union", "meticulous_orbital_regimentation", ("planet_orbit_streets", "antares_alpheratz_cepheid_offices"), 7.4, (4, 3)),
        ("andria_bamboo_toboggan_rigger", "bamboo_shadow_theater_port", "polarity_carve", "prudent_nova_triggering_realignment", ("suspended_bamboo_street", "former_lazaretto_kennels", "thales_statue_toboggan_slide"), 8.6, (5, 4)),
        ("andria_motionless_myth_refuter", "bamboo_shadow_theater_port", "polarity_carve", "meticulous_orbital_regimentation", ("rejected_clockwork_stasis", "calculated_all_world_prudence"), 3.2, (3, 2)),
        ("andria_nova_nebula_reciprocator", "nova_spiral_observatory", "altitude_max", "prudent_nova_triggering_realignment", ("exploded_nova_orange_to_yellow", "bent_milky_way_spiral"), 9.1, (15, 8))),

    _mk(51, "Cecilia", 9, "Continuous cities", 4, 152,
        "sharp rural-urban ecological boundary", "pasture_blind_city_walker", "mingled_traffic_island_goatherd",
        "Endless rows of identical pavement swallowing cliffs and sage meadows into a single inescapable traffic island",
        ("tinkling_wall_gate_pasture", "endless_identical_house_rows", "low_sage_traffic_island"),
        ("cecilia_stone_blind_urbanite", "tinkling_wall_gate_pasture", "polarity_carve", "pasture_blind_city_walker", ("unrecognized_inter_city_meadows", "mingled_stones_and_grass"), 3.0, (4, 3)),
        ("cecilia_leaf_seeking_goatherd", "tinkling_wall_gate_pasture", "polarity_carve", "mingled_traffic_island_goatherd", ("meadow_between_cliffs_green_slope", "frightened_corner_goats"), 8.3, (5, 4)),
        ("cecilia_wastepaper_goat_waner", "endless_identical_house_rows", "emblem_union", "mingled_traffic_island_goatherd", ("odorless_skin_and_bone_goats", "rubbish_bin_wastepaper_forage"), 7.5, (7, 6)),
        ("cecilia_omnipresent_island_merger", "low_sage_traffic_island", "altitude_max", "mingled_traffic_island_goatherd", ("cecilia_is_everywhere", "low_sage_recognized_in_traffic_island"), 8.0, (9, 8))),

    _mk(52, "Marozia", 9, "Hidden cities", 3, 154,
        "programmed ideological utopia decree", "leaden_rat_overcoat_tunnel", "chance_dragonfly_swallow_crack",
        "Mold-soldered stone passages splitting open for one unforced instant into dragonfly-wing crystal",
        ("leaden_rat_pack_passages", "bat_umbrella_overcoat_plaza", "crystalline_wall_crack"),
        ("marozia_voracious_rat_tunnel_runner", "leaden_rat_pack_passages", "polarity_carve", "leaden_rat_overcoat_tunnel", ("teeth_torn_leftovers", "soldered_stone_mold_ceiling"), 2.8, (16, 15)),
        ("marozia_suspicious_umbrella_flapper", "bat_umbrella_overcoat_plaza", "emblem_union", "leaden_rat_overcoat_tunnel", ("lowered_eyelid_umbrellas", "flapping_batlike_overcoats"), 6.4, (7, 6)),
        ("marozia_unforced_pleasure_opener", "leaden_rat_pack_passages", "polarity_carve", "chance_dragonfly_swallow_crack", ("sheer_pleasure_shared_gesture", "dragonfly_transparent_transfiguration"), 9.0, (5, 4)),
        ("marozia_swallow_horizon_flicker", "crystalline_wall_crack", "altitude_max", "chance_dragonfly_swallow_crack", ("tail_flick_opening_horizon", "second_city_freeing_from_first"), 8.7, (2, 1))),

    _mk(53, "Penthesilea", 9, "Continuous cities", 5, 156,
        "walled threshold archway certainty", "diluted_snaggle_comb_outskirts", "contradictory_oblique_arm_gestures",
        "Milky swamp-soup pallor over corrugated-iron sheds, rusty Ferris wheel, and freckled suburb lights",
        ("corrugated_swamp_approach", "ferris_shambles_workshop_belt", "opaque_polyhedron_horizon"),
        ("penthesilea_threshold_eraser", "corrugated_swamp_approach", "polarity_carve", "diluted_snaggle_comb_outskirts", ("no_customs_archway_girdle", "soupy_plain_mangy_fields", "snaggle_toothed_shallow_facades"), 8.5, (9, 8)),
        ("penthesilea_oblique_arm_pointer", "corrugated_swamp_approach", "polarity_carve", "contradictory_oblique_arm_gestures", ("broad_gesture_here_farther_opposite", "opaque_horizon_polyhedrons"), 3.1, (7, 5)),
        ("penthesilea_shambles_carnival_stringer", "ferris_shambles_workshop_belt", "emblem_union", "diluted_snaggle_comb_outskirts", ("rusty_workshops_cemetery_shambles", "freckled_suburb_night_windows"), 7.3, (4, 3)),
        ("penthesilea_outside_limbo_questioner", "opaque_polyhedron_horizon", "altitude_max", "diluted_snaggle_comb_outskirts", ("penthesilea_only_outskirts_of_itself", "inescapable_global_limbo"), 8.2, (16, 15))),

    _mk(54, "Theodora", 9, "Hidden cities", 4, 159,
        "aseptic anthropocentric ecological purge", "exterminating_linnaean_order", "awakened_incunabula_chimera_swarm",
        "Sterile closed stone pavements erupted from below by basement-library griffons, hydras, and basilisks",
        ("aseptic_rat_massacre_sewers", "buffon_linnaeus_incunabula_vault", "griffon_basilisk_bedside_capitals"),
        ("theodora_carapace_rat_exterminator", "aseptic_rat_massacre_sewers", "polarity_carve", "exterminating_linnaean_order", ("condor_serpent_spider_fly_chain", "poison_immune_rat_massacre", "aseptic_human_cemetery"), 2.9, (4, 3)),
        ("theodora_buffon_shelf_archivist", "buffon_linnaeus_incunabula_vault", "emblem_union", "exterminating_linnaean_order", ("extinct_fauna_volumes", "sealed_flea_and_germ_tombs"), 6.2, (5, 4)),
        ("theodora_incunabula_crypt_breaker", "aseptic_rat_massacre_sewers", "polarity_carve", "awakened_incunabula_chimera_swarm", ("stirring_deposed_basement_fauna", "drainpipe_leaping_sphinxes_griffons"), 9.1, (7, 4)),
        ("theodora_hydra_bedside_percher", "griffon_basilisk_bedside_capitals", "altitude_max", "awakened_incunabula_chimera_swarm", ("chimeras_dragons_hircocervi", "harpies_hydras_unicorns_basilisks"), 8.9, (15, 8))),

    _mk(55, "Berenice", 9, "Hidden cities", 5, 161,
        "final settled moral triumph", "triglyph_meat_grinder_unjust", "nested_comma_pulley_just_unjust_seeds",
        "Classical abaci crowning meat-grinder cogs infiltrated by ticking counterweights and nested moral germs",
        ("triglyph_cog_perfumed_baths", "understair_pulley_comma_rooms", "nested_germ_sheath_core"),
        ("berenice_triglyph_cog_oppressor", "triglyph_cog_perfumed_baths", "polarity_carve", "triglyph_meat_grinder_unjust", ("abaci_metope_meat_grinders", "perfumed_bath_sycophants_janizaries"), 2.7, (16, 15)),
        ("berenice_comma_pulley_just_infiltrator", "triglyph_cog_perfumed_baths", "polarity_carve", "nested_comma_pulley_just_unjust_seeds", ("climbing_wire_piston_ticking", "comma_parenthesis_shibboleth", "fried_squash_flowers_celery_soup"), 8.9, (5, 4)),
        ("berenice_righteous_rivalry_fermenter", "understair_pulley_comma_rooms", "emblem_union", "triglyph_meat_grinder_unjust", ("malignant_pride_of_being_more_just", "revenge_yearning_inner_unjust_sheath"), 7.8, (7, 5)),
        ("berenice_simultaneous_window_germinator", "nested_germ_sheath_core", "altitude_max", "nested_comma_pulley_just_unjust_seeds", ("unruled_window_awakening_justice", "all_future_berenices_wrapped_now"), 9.5, (2, 1))),
)


def catalog_by_name() -> Dict[str, CityGenomeSpec]:
    return {c.name.lower(): c for c in CITIES_55}
