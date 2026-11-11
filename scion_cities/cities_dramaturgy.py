#!/opt/homebrew/bin/python3
"""
Operative Worldtext, Clinamen Swerve Specs, and Original Multiplane Dramaturgy
for All 55 Cities of Invisible Cities (`01-diomira` .. `55-berenice`).

100% original studio dialogue & structural inquiry specs built on top of
`scion_cities/swarms/catalog_55.py` (`CITIES_55`) and `PhilogynyAccumulator`.
"""
from __future__ import annotations
from typing import Dict, Tuple

# Map city index (1..55) -> (slug, polo_baseline_line, khan_swerve_line, fulcrum_question_line)
CITY_SCRIPTS: Dict[int, Tuple[str, str, str, str]] = {
    1: (
        "01-diomira",
        "In Diomira, sixty silver domes, bronze gods, and a golden weathercock obey a known catalog of splendors.",
        "Yet on a September dusk, every food-stall lamp ignites at once and a single cry from a terrace tilts the evening.",
        "Why does memory envy a joy only when it suspects another traveler lived this exact dusk before?",
    ),
    2: (
        "02-isidora",
        "Riding toward Isidora, the traveler charts spiral seashell stairs, resonant violins, and ground telescope lenses.",
        "The swerve strikes in the calendar: he enters the dreamed plaza only after youth has cooled into gray stone.",
        "What becomes of desire when you arrive inside your own blueprint seated on the old men's wall?",
    ),
    3: (
        "03-dorothea",
        "The clerk counts Dorothea cleanly: four aluminum towers, seven spring drawbridges, four green canals, nine trade wards.",
        "The camel driver remembers a morning of brass trumpets and flapping banners when every alley promised an uncounted life.",
        "Does a city's ledger close its future, or was the census only one closed path inside an open desert?",
    ),
    4: (
        "04-zaira",
        "Surveyors rule Zaira by step-counts, zinc roof scales, and degree curves along the vaulted arcades.",
        "Cut one measurement loose from its scar—swaying feet on the lamppost, a torn net on the dock—and Zaira empties.",
        "If stone holds its past like a soaked sponge, how can a ruler measure height without measuring grief?",
    ),
    5: (
        "05-anastasia",
        "Concentric canals and high paper kites crown Anastasia while fragrant smoke promises every appetite at once.",
        "Shift your gaze down to the lathe bench where your hands cut banded agate eight hours a day.",
        "At what angle does a city awaken every desire only to turn its ecstatic guest into its contented laborer?",
    ),
    6: (
        "06-tamara",
        "Jutting iron signboards—pincers, tankards, scales—command the eye until Tamara reads like a dense legal page.",
        "Step past the gates into open wind, and even the blank clouds force you to read ships and hands.",
        "Once every facade speaks its emblem aloud, what silent city hides unread beneath the brackets?",
    ),
    7: (
        "07-zora",
        "Zora locks copper clock, striped awning, nine-jet fountain, and glass tower into an unbreakable honeycomb score.",
        "Forbidden to alter a single stone lest memory slip, the flawless palace dries out and blows away.",
        "Must a world accept forgetting and mutation in order to remain inhabited at all?",
    ),
    8: (
        "08-despina",
        "Across salt mist, the camel driver reads Despina's iron cranes and windsocks as a vessel leaving the sand.",
        "From the sea waste, the sailor reads those same smokestacks and white courts as a swaying two-humped caravan.",
        "Is every city forged not by its own walls, but by the specific desert each witness turns their back upon?",
    ),
    9: (
        "09-zirma",
        "Window-level dirigibles, blind cane taps, subterranean tattoo needles, and leashed pumas multiply through Zirma's streets.",
        "My traveling companions swear they saw only one airship, one needle, and one resting cat.",
        "Does memory falsify the singular event by repeating it so the mind can anchor a city at all?",
    ),
    10: (
        "10-isaura",
        "Above a buried black lake, Isaura sinks a thousand vertical wells ringed by a thin green border.",
        "One sect places the gods in the unseen dark water; the rival sect worships rising buckets, windlasses, and high aqueducts.",
        "Where does law reside: in the hidden source below the crust, or in the visible machinery that hoists it?",
    ),
    11: (
        "11-maurilia",
        "Old sepia postcards show provincial Maurilia with white parasols, a quiet bandstand, and a hen in the dust.",
        "Beside the concrete bus station and steel overpass, nostalgia gilds a grace the old town never recognized while alive.",
        "When a metropolis keeps only an old name, who owes allegiance to the vanished city inside the postcard?",
    ),
    12: (
        "12-fedora",
        "Gray ashlar stone fixes Fedora into a hard, singular metropolis of necessity.",
        "Yet inside its central metal hall, hundreds of blue crystal globes preserve every discarded miniature Fedora that might have stood.",
        "Why banish unrealized worlds as idle toys when each globe obeyed a necessity valid at its own hour?",
    ),
    13: (
        "13-zoe",
        "Every traveler enters expecting distinct roofs for palace, forge, bath, and bazaar.",
        "Under Zoe's identical pyramid roofs, priest, patient, smith, and prince swap places until inside and outside blur.",
        "Without a line dividing sacred rule from ordinary craft, how can any threshold stay distinct from open wilderness?",
    ),
    14: (
        "14-zenobia",
        "Though planted on bone-dry ground, Zenobia rises on tall bamboo pilings, crossed ladders, zinc cones, and pulley cranes.",
        "Nobody remembers what flooded or parched command first lifted those stilts, yet citizens keep splicing higher balconies.",
        "What separates a city that mutates to house living desires from one that flattens every wish?",
    ),
    15: (
        "15-euphemia",
        "By daylight at Euphemia's yellow-mat quay, seven nations weigh ginger sacks, cotton bolts, and pistachio bales.",
        "Around solstice campfires, a single spoken word—wolf, sister, battle—trades your memory for seven strangers' lives.",
        "Which cargo alters the caravan more deeply: the weighed spice in the hold, or the swapped memory on the road home?",
    ),
    16: (
        "16-zobeide",
        "Men from distant lands shared one moonlit dream of a fleeing figure and built winding streets to mirror the chase.",
        "Each builder walled off the exact corner where the shadow escaped, rewinding the dream into an ugly blind trap.",
        "When desire builds architecture only to prevent loss, how fast does pursuit harden into a prison whose cause is forgotten?",
    ),
    17: (
        "17-hypatia",
        "The newcomer reads cerulean lagoons as leisure, porphyry halls as authority, and marble tombs as silent grief.",
        "Hypatia inverts the syntax of things: crabs guard the drowned below, flutes sing among graves, and sages wait on pinnacles for ships.",
        "When signs detach from accustomed comfort, are you reading things at last—or merely swapping one cipher for another?",
    ),
    18: (
        "18-armilla",
        "Walls, ceilings, and brick floors have vanished from Armilla, leaving a forest of vertical risers and suspended porcelain.",
        "Through sunlit threads of water spray, hydraulic nymphs turn exposed plumbing into an open, singing sanctuary.",
        "Was the heavy masonry shell ever the true house, or only scaffolding around the circulation of water and grace?",
    ),
    19: (
        "19-chloe",
        "Beneath rain-darkened arcades and parasols, strangers in Chloe never speak a word or brush a sleeve.",
        "Darting glances weave silent geometric triangles of longing whose tension survives only because no voice interrupts.",
        "If two strangers spoke aloud beneath the awning, would real encounter begin—or shatter the entire city's web?",
    ),
    20: (
        "20-valdrada",
        "Stacked cliffside verandas hang over a cold, limpid lake that duplicates every balustrade and gesture upside down.",
        "No act in upper Valdrada dares stay impulsive, because its inverted twin below claims asymmetric, loveless permanence.",
        "When every motion knows itself watched by an unforgiving mirror, can an action still belong to live impulse?",
    ),
    21: (
        "21-olivia",
        "To praise Olivia's refinement, speech summons mullioned cushions, estuary canoes, and a spinning white peacock.",
        "Yet thick soot, grease clouds, and relentless lathe mandrels coat the shift workers walking through the dark.",
        "If falsehood hides not in ornate words, where in the coupled machinery of things does the lie reside?",
    ),
    22: (
        "22-sophronia",
        "Half of Sophronia raises marble ministries, banks, and stone pediments; the other half spins Ferris wheels and roller coasters.",
        "Every autumn the crews unbolt the marble banks onto trailers and haul the state away, leaving the carnival anchored in place.",
        "Which half of civic order was ever the temporary fairground, and which the enduring skeleton?",
    ),
    23: (
        "23-eutropia",
        "Across a windswept plateau stand twin empty towns; whenever debt and boredom mount, all Eutropia migrates one square over.",
        "Each citizen takes a new trade, window, and neighbor, yet Mercury's chessboard repeats the identical civic yawn.",
        "Can permuting every actor across equivalent slots ever produce novelty if the rule matrix refuses to swerve?",
    ),
    24: (
        "24-zemrude",
        "Walk whistling with lifted chin and Zemrude offers sunlit sills, billowing curtains, and high fountain spray.",
        "Drop your gaze one notch toward fish scales and damp gutters, and gravity locks every subsequent walk downward.",
        "How does a transient mood tilt harden into the permanent physical horizon a citizen is permitted to inhabit?",
    ),
    25: (
        "25-aglaura",
        "Every hour inhabitants recite a compact, proverbial Aglaura of canonical virtues and catalogued faults.",
        "Meanwhile an oblique, nameless Aglaura glimmers at street corners and vanishes because the canon leaves it no noun.",
        "When institutional vocabulary seals every slot, how can an unindexed reality survive long enough to be witnessed?",
    ),
    26: (
        "26-octavia",
        "Between two mountain crests above a cloud-filled chasm, Octavia hangs sack-houses and catwalks from hempen ropes.",
        "Measuring the exact weather-wear of hemp and chain, inhabitants walk above the void calmer than bedrock towns.",
        "Why does knowing the explicit failure bound of the net make mortal life less uncertain than pretending stone is eternal?",
    ),
    27: (
        "27-ersilia",
        "To mark kinship, barter, and civic rank, Ersilia stretches white, black, and gray cords from corner to corner.",
        "Once the taut web grows too dense to pass through, citizens dismantle the walls and leave only poles and strings.",
        "When houses are stripped away and only relational chords remain, are you looking at ruin—or the city's true skeleton?",
    ),
    28: (
        "28-baucis",
        "Slender flamingo stilts lift Baucis above the cloud deck so no sandal ever bruises soil or leaf below.",
        "Leaning over aerial rails with downward spyglasses, inhabitants study every ant and pebble—fascinated by their own absence.",
        "Is total non-intervention reverence for the earth, or an obsession with watching a world cleared of oneself?",
    ),
    29: (
        "29-leandra",
        "Two tiny household choirs contest Leandra: traveling Penates packed with family keys, and resident Lares rooted in kitchen pipes.",
        "All night along stucco cornices they trade sharp critiques of bankrupt heirs and altered brickwork.",
        "Does a dwelling's continuity follow the migrating lineage, or stay behind inside rusted flues and scarred plaster?",
    ),
    30: (
        "30-melania",
        "Across Melania's harsh noon square, braggart, miser, flatterer, and youth clash in loud, unbroken dialogue.",
        "Return decades later: every mortal speaker has died, yet newcomers step into the vacated masks as voices slowly drift.",
        "Do individuals author the civic argument, or does the enduring script merely recruit passing bodies to finish its plot?",
    ),
    31: (
        "31-esmeralda",
        "Intersecting canals and cambered bridges grant Esmeralda's walker or boatman a fresh zigzag path each morning.",
        "Above and below the official map, rooftop cats, secret lovers, sewer smugglers, and high swallows carve second parabolas.",
        "Can any single planar map depict a city whose real freedom lives in the vertical jump between strata?",
    ),
    32: (
        "32-phyllis",
        "At first arrival, Phyllis dazzles with lancet traceries, onion spires, and caper bushes clinging to stone corbels.",
        "Stay thirty seasons and the facades bleach away into bare footstep zigzags avoiding cracks and creditors.",
        "What unforeseen slant of late afternoon light can tear open habituated blindness inside a worn route?",
    ),
    33: (
        "33-pyrrha",
        "Before arrival, the syllables of Pyrrha build a steep bay fortress ringed around a dark goblet well.",
        "Step off the train into yellow sawmill dust, buzzing wind-pumps, and a sea hidden behind a low dune, and the name snaps.",
        "Where does the evicted goblet-city go once the real lumber town confiscates its only name?",
    ),
    34: (
        "34-adelma",
        "Landing at Adelma's dusk dock among urchin baskets and sackcloth hoods, the traveler meets his dead father's fevered eyes.",
        "Every stevedore and vendor turns a departed face toward him until he fears what dead friend he resembles to them.",
        "At what threshold do accumulated memories outnumber the living so densely that perception can mint no stranger?",
    ),
    35: (
        "35-eudoxia",
        "In a quiet shrine, a symmetrical indigo-and-crimson carpet claims to diagram Eudoxia's noisy, mule-crowded alleys.",
        "Asked which holds the true cosmic order, the oracle flips the premise: perhaps the crooked dust-stain is the starry map.",
        "When tidy model and messy street diverge, what justifies crowning the diagram over the lampblack stain?",
    ),
    36: (
        "36-moriana",
        "Approached from the sun, Moriana gleams with alabaster gates, coral columns, and glass villas.",
        "Walk a wide semicircle across the ridge and its paper-thin obverse appears: rusted sheet metal, soot pipes, and spiked planks.",
        "How can a civic order have two inseparable faces with zero interior thickness where one side ever sees the other?",
    ),
    37: (
        "37-clarice",
        "Plagues and revivals repeatedly shatter Clarice, turning brocade into sheets and Corinthian capitals into hen baskets.",
        "Later curators seal those chipped capitals under velvet bell-jars as relics of an unproven, pristine first Clarice.",
        "What if there never was an original whole—only an endless combinatorial shuffle of surviving shards?",
    ),
    38: (
        "38-eusapia",
        "Beneath upper Eusapia, hooded guides pose dry parchment dead around banquet tables, trumpets, and stopped clocks.",
        "Quietly the subterranean necropolis begins digging new canals and remodeling arches—which the living above rush to copy.",
        "When the living imitate the innovations of their own catacomb double, which level holds civic agency?",
    ),
    39: (
        "39-beersheba",
        "Obsessed with imitating a jewel-locked heaven, Beersheba hoards carats while engineering a grim clockwork inferno below.",
        "High at the zenith, the real celestial twin shines with free, unhoarded potato peels, broken umbrellas, and eggshells.",
        "Why does anxious moral accounting forge subterranean gears while grace gathers only around what was let go without greed?",
    ),
    40: (
        "40-leonia",
        "Every dawn Leonia unwraps fresh soap and spotless tins, carting yesterday's intact goods to its outer rim.",
        "Indestructible craters of boilers, pianos, and shoes rise into rival mountain ranges poised to landslide inward.",
        "When purity relies on daily expulsion into an imperishable outside, how soon does the discarded ring bury the center?",
    ),
    41: (
        "41-irene",
        "Watched from a windy plateau at dusk, a pink glow in the gulley and distant drumbeats earn the name Irene.",
        "Descend the valley road into those actual squares and windows, and the city mutates into another place altogether.",
        "Must certain cities exist strictly as horizon magnets whose identity dissolves the instant you cross their gate?",
    ),
    42: (
        "42-argia",
        "Where other cities hold sunlit air, Argia packs solid clay and damp earth flush against every stair and ceiling.",
        "Nothing stirs through the root-threaded dark—yet press an ear to the stony crust at night and a buried door slams.",
        "Even under total material compression, what irreducible domestic trace refuses to be packed silent?",
    ),
    43: (
        "43-thekla",
        "Behind pine plank fences, cranes hoist other cranes across Thekla's unending armature of scaffolding.",
        "Ask why the trestles never come down: builders point at sunset to the stars—the blueprint—lest ruin begin the moment work stops.",
        "Is a city sustained by completed monumentality, or solely by the active tension of unfinished construction?",
    ),
    44: (
        "44-trude",
        "Landing at Trude, the traveler walks past greenish suburbs, identical flower beds, and pre-scripted hardware counters.",
        "Take off again for another continent: the identical yellow houses and roundabouts wait below—only the airport placard changed.",
        "Once standardized monoculture blankets the globe, how can movement between coordinates still count as travel?",
    ),
    45: (
        "45-olinda",
        "You need a magnifying lens to spot the pinhead nucleus of a new Olinda budding inside an old wall.",
        "Year by year its inner lymph pushes older quarters outward like tree rings without erasing a single earlier circle.",
        "How can renewal germinate from microscopic interiority so every historical ring survives at broader radius?",
    ),
    46: (
        "46-laudomia",
        "Alongside crowded living Laudomia and its vast slab necropolis stands a third silent city: hollow marble pores of the unborn.",
        "In that echoing funnel, an unturned two-bulb hourglass waits—whether swelling with future crowds or holding the final grain.",
        "How does every present rule tremble when weighed simultaneously against all its dead and its uncounted unborn?",
    ),
    47: (
        "47-perinthia",
        "Astronomers aligned Perinthia's gates and cardo to thousand-year solar eclipses to mirror celestial harmony.",
        "Out of dark cellars and lofts emerge three-headed, six-legged monsters bred precisely within those flawless walls.",
        "Did the astronomers miscalculate their equations—or accurately build the true, monstrous order of the heavens?",
    ),
    48: (
        "48-procopia",
        "At first the inn window frames a yellow hill, ditch, medlar tree, and trapeze patch of open sky.",
        "Each autumn return packs three, sixteen, forty-seven polite round corn-chewing faces shoulder-to-shoulder until the sky vanishes.",
        "When genial, uncomplaining density bricks in every horizon, where does shared shelter cross into total occlusion?",
    ),
    49: (
        "49-raissa",
        "Hammers bruise thumbs, ledgers go awry, and grim sighs hang heavy across Raissa's zinc counters.",
        "Yet in one millisecond a child's laugh, a bounding dog, a mason's song, and a freed speckled bird flash a bright chain across the gloom.",
        "How does an invisible happy city re-thread itself every second inside an unhappy one that never notices?",
    ),
    50: (
        "50-andria",
        "Streets in Andria follow planetary orbits, and civic schedules answer Cepheid stars with calm precision.",
        "Yet astronomers welcome a new bamboo lane or shadow theater—knowing their prudent terrestrial change just flared a distant nova.",
        "What changes in ethics once the blueprint is two-way, and every modest street edit bends the Milky Way?",
    ),
    51: (
        "51-cecilia",
        "Long ago at Cecilia's gate, a wandering goatherd knew every green cliff meadow while ignoring the names of towns.",
        "Decades later he leads thin, wastepaper-chewing goats around a concrete traffic island—all places mingled into endless Cecilia.",
        "Once urban pavement swallows its own outside, where do both traveler and pasture lose the power to exit?",
    ),
    52: (
        "52-marozia",
        "Through mold-soldered tunnels, Marozia's citizens scurry in leaden packs beneath suspicious umbrella wings.",
        "Then an unforced shared gesture cracks the stone into dragonfly crystal, showing a swallow-city freeing itself by a tail flick.",
        "Why can liberation never be decreed as a static second wall, appearing only in the live act of breaking the first?",
    ),
    53: (
        "53-penthesilea",
        "Hours of pale swamp plain, corrugated sheds, rusty Ferris wheels, and shallow facades pass without a customs gate.",
        "Ask any worker where Penthesilea lies, and oblique arms sweep forward, backward, and sideways at once.",
        "If a city has become pure outskirts of itself, does an outside to Penthesilea still exist anywhere?",
    ),
    54: (
        "54-theodora",
        "With traps, poisons, and Linnaean rigor, Theodora purged condor, serpent, spider, fly, and the last sewer rat.",
        "Down in sealed library vaults, forgotten incunabula crack open—and sphinxes, griffons, hydras, and basilisks retake the capitals.",
        "When human order exterminates every living wildness, what older mythic monsters awaken from the archive?",
    ),
    55: (
        "55-berenice",
        "Inside unjust Berenice's triglyph cogs and perfumed sycophants ticks an austere, clandestine Berenice of pulleys and just soup.",
        "Look closer inside that righteous seed: pride already ferments the next unjust sheath—and inside it, a fresh window of justice.",
        "Inside the living inferno, who learns to recognize what is not inferno, make it endure, and give it space?",
    ),
}
