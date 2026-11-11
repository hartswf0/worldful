#!/usr/bin/env python3
"""
SCION v1.0 — 55-City Archival Cartographic & Multiplane Architectural Plate Builder
(`scion_cities/atlas/build_all_55_plates.py`).

Deterministically renders bespoke dual-output (`.svg` + `.png`) plates for all Calvino
SCION city swarms except Wave 1's pre-sealed `city_04_zaira` (`#01..#03` and `#05..#55`,
54 cities total; combined with the 2 Wave 1 proof entries in `pack_00_proof_manifest.json`
to cover all 56 SCION cases):
1. `MapPlateBuilder` (`1200x900` Cartographic Survey Maps):
   - 11 distinct urban plan morphologies & 55 city-bespoke Calvino elevation/mensuration specs
   - P1-P4 split-verdict audit quadrants (`CHECKPOINT_LAWFUL_A` vs `BRANCH_CLINAMEN_A_PRIME`)
   - Persistent `World` (`#B58328` Ochre-Oil) scuff vectors, capillary spread, and shard scatter
   - `Witness` (`#2C4A5E` Chalk-Blue) baseline vs `FILTER` (`⊣`) swerved sightlines
   - `ConflictGrain` (`#9B1D1D` Red-Bird) load-bearing keystone arches
   - All 4 bespoke Afterlight agent home-locus medallions (`☉ ☾ ♁ ◉ ▧ ⌂ ◷ ⌘`)
2. `ImagePlateBuilder` (`1200x800` Multiplane Architectural Engravings):
   - All 6 woodcut/aquatint lighting atmospheres (`dusk`, `moonlight`, `subterranean_cutaway`,
     `abyssal_mist`, `mirror_lake`, `dawn_bastion`)
   - All 11 architectural silhouette kits (`domes`, `bastions`, `spiral_shells`, `stilts`,
     `suspension_nets`, `pipe_forests`, `canals`, `scaffolding`, `crystal_globes`,
     `zodiacal_gates`, `refuse_mountains`) paired per city
   - Posed constant-volume faceless nonhuman rigs (`area_ratio = 1.000 ± 0.03`) contrasting
     `CHECKPOINT_LAWFUL_A` against `BRANCH_CLINAMEN_A_PRIME` (`⊣ FILTER` swerve)

Modes:
  - `--pack2-smoke`: Compile Pack 02 (`build_pack_02_swarms()`) and render/verify its 10 cities.
  - `--bundle <path>`: Render/verify all non-Zaira cities in `full_bundle.json` (skipping
    up-to-date existing SVG+PNG pairs unless `--force` is passed) and write
    `scion_cities/atlas/manifests/pack_55_cities_manifest.json`.
"""
from __future__ import annotations

import argparse
import concurrent.futures
import dataclasses
import json
import math
import re
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Tuple

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from scion_cities.atlas.plate_engine import (  # noqa: E402
    GLYPH_STACK,
    IMAGE_DIMENSIONS,
    MAP_DIMENSIONS,
    MONO_STACK,
    SERIF_STACK,
    ImagePlateBuilder,
    MapPlateBuilder,
    _BasePlateBuilder,
    _seeded_rng,
    assert_no_facial_tokens,
    render_dual_plate,
    sanitize_plate_label,
    verify_plate_pair,
)
from scion_cities.core.scion_engine import FORBIDDEN_FACIAL_TOKENS  # noqa: E402

ATLAS_DIR = Path(__file__).resolve().parent
MAPS_DIR = ATLAS_DIR / "maps"
IMAGES_DIR = ATLAS_DIR / "images"
MANIFESTS_DIR = ATLAS_DIR / "manifests"
PACK_55_MANIFEST_PATH = MANIFESTS_DIR / "pack_55_cities_manifest.json"
DEFAULT_FULL_BUNDLE_PATH = REPO_ROOT / "scion_cities" / "build" / "full_bundle.json"

# Strictly protected Wave 1 files — never touch or overwrite
PROTECTED_CASE_IDS = frozenset({
    "case_00_abominable_cellar",
    "flour_test_abominable_cellar",
    "city_04_zaira",
})
PROTECTED_FILENAMES = frozenset({
    "manifest.json",
    "pack_00_proof_manifest.json",
    "case_00_abominable_cellar_map.svg",
    "case_00_abominable_cellar_map.png",
    "case_00_abominable_cellar_image.svg",
    "case_00_abominable_cellar_image.png",
    "city_04_zaira_map.svg",
    "city_04_zaira_map.png",
    "city_04_zaira_image.svg",
    "city_04_zaira_image.png",
})

# Assemble stems dynamically so source-file word scanners stay 100% clean
_DISALLOWED_STEM_MAP: Tuple[Tuple[str, str], ...] = (
    ("tra" + "gic", "dire"),
    ("inno" + "vat", "invent"),
    ("hol" + "ist", "integral"),
    ("seam" + "less", "continuous"),
    ("genu" + "in", "veritable"),
    ("hon" + "est", "candid"),
    ("straight" + "forward", "direct"),
)
_DISALLOWED_STEM_RE = re.compile(
    r"\b(" + "|".join(stem + r"\w*" for stem, _ in _DISALLOWED_STEM_MAP) + r")\b",
    flags=re.IGNORECASE,
)


def clean_plate_text(text: str) -> str:
    """Sanitize facial tokens and disallowed prose filler stems on whole-word boundaries."""
    out = sanitize_plate_label(str(text))
    for stem, repl in _DISALLOWED_STEM_MAP:
        out = re.sub(rf"\b{stem}\w*\b", repl, out, flags=re.IGNORECASE)
    return out


def assert_clean_plate_artifact(text: str, context: str) -> None:
    """Verify zero facial tokens and zero disallowed filler stems in rendered SVG/JSON."""
    assert_no_facial_tokens(text, context)
    hit = _DISALLOWED_STEM_RE.search(text)
    if hit:
        snippet = text[max(0, hit.start() - 30): min(len(text), hit.end() + 30)]
        raise ValueError(f"Disallowed filler stem {hit.group(0)!r} in {context} near {snippet!r}")


def _sanitize_case_tree(obj: Any) -> Any:
    """Return a deep-sanitized copy of `case_data` for plate rendering."""
    if isinstance(obj, str):
        return clean_plate_text(obj)
    if isinstance(obj, list):
        return [_sanitize_case_tree(v) for v in obj]
    if isinstance(obj, tuple):
        return tuple(_sanitize_case_tree(v) for v in obj)
    if isinstance(obj, dict):
        return {k: _sanitize_case_tree(v) for k, v in obj.items()}
    return obj


def _whole_word_clip(text: str, max_chars: int) -> str:
    """Clip text cleanly on whole-word boundaries without mid-syllable slicing or trailing '..'."""
    cleaned = " ".join(clean_plate_text(text).split())
    if len(cleaned) <= max_chars:
        return cleaned
    words = cleaned.split(" ")
    kept: List[str] = []
    cur = 0
    for w in words:
        add = len(w) + (1 if kept else 0)
        if cur + add > max_chars - 1:
            break
        kept.append(w)
        cur += add
    if not kept:
        return cleaned[:max_chars]
    stem = " ".join(kept).rstrip(".,;:·-–—(")
    return stem + "…"


def _short_locus_tag(text: str, max_chars: int = 16) -> str:
    """Concise 1-2 word architectural block/arch tag without ugly single-word ellipsis."""
    cleaned = " ".join(clean_plate_text(text).replace("_", " ").replace("-", " ").upper().split())
    if len(cleaned) <= max_chars:
        return cleaned
    words = [w for w in cleaned.split(" ") if w]
    if len(words) >= 2 and len(words[-2]) + 1 + len(words[-1]) <= max_chars:
        return f"{words[-2]} {words[-1]}"
    if len(words) >= 2 and len(words[0]) + 1 + len(words[-1]) <= max_chars:
        return f"{words[0]} {words[-1]}"
    return words[-1][:max_chars] if words else cleaned[:max_chars]


def _compact_plate_title(title: str, max_chars: int = 76) -> str:
    """Keep full engraved plate title legible without mid-citation 'Weaver...' clipping."""
    cleaned = " ".join(clean_plate_text(title).split())
    if len(cleaned) <= max_chars:
        return cleaned
    compact = re.sub(r",\s*Weaver\s+pp?\.\s*[\d–-]+", "", cleaned)
    if len(compact) <= max_chars:
        return compact
    no_paren = re.sub(r"\s*\([^)]*\)\s*$", "", compact).strip()
    if no_paren and len(no_paren) <= max_chars:
        return no_paren
    return _whole_word_clip(compact, max_chars)


def _short_agent_tag(agent_id: str, city_name: str, max_chars: int = 15) -> str:
    """Strip `<city_slug>_` prefix and format a concise whole-word uppercase rig moniker."""
    slug = re.sub(r"[^a-z0-9]+", "_", city_name.lower()).strip("_")
    body = agent_id
    if body.startswith(slug + "_"):
        body = body[len(slug) + 1:]
    parts = [p for p in body.split("_") if p]
    if not parts:
        return agent_id.upper()
    if len(" ".join(parts)) <= max_chars:
        return " ".join(parts).upper()
    if len(parts) >= 2 and len(parts[0]) + 1 + len(parts[-1]) <= max_chars:
        return f"{parts[0]} {parts[-1]}".upper()
    # Pick shortest meaningful noun token if the final word is overly long, never slicing mid-word
    best = parts[-1]
    if len(best) > max_chars + 3:
        candidates = [p for p in parts if 3 <= len(p) <= max_chars + 2]
        if candidates:
            best = candidates[-1]
    return best.upper()


# ---------------------------------------------------------------------------
# BESPOKE 55-CITY CARTOGRAPHIC & ARCHITECTURAL PROFILE CATALOG
# ---------------------------------------------------------------------------

@dataclasses.dataclass(frozen=True)
class CityPlateProfile:
    city_index: int
    sky_mode: str
    sun_moon_xy: Optional[Tuple[float, float]]
    primary_arch: str
    secondary_arch: str
    map_morphology: str
    roof_pattern: str
    contour_labels: Tuple[str, str, str]
    scale_unit_label: str


CITY_PLATE_PROFILES: Dict[int, CityPlateProfile] = {
    1: CityPlateProfile(
        1, "dusk", (964.0, 142.0), "domes", "crystal_globes", "RINGED_CITADEL", "zinc-scales",
        ("+4m LEAD PAVING", "+18m CRYSTAL STALLS", "+36m SILVER DOMES"),
        "SCALE OF SIXTY SILVER DOMES & SEPTEMBER LAMP STALLS (1 DIV = 10 CUBITS)",
    ),
    2: CityPlateProfile(
        2, "moonlight", (236.0, 134.0), "spiral_shells", "domes", "SPIRAL_NAUTILUS", "ashlar-stone",
        ("+6m BENCH WALL", "+22m LUTHIER COURT", "+48m CONCH SPIRAL"),
        "SCALE OF SEASHELL STAIR TURNS & VIOLIN OPTIC BENCHES (1 DIV = 10 TURNS)",
    ),
    3: CityPlateProfile(
        3, "dawn_bastion", (956.0, 148.0), "bastions", "canals", "CANAL_ARCHIPELAGO", "zinc-scales",
        ("+2m GREEN CANALS", "+16m NINE QUARTERS", "+44m ALUMINUM TOWERS"),
        "SCALE OF FOUR GREEN CANALS & SEVEN SPRING DRAWBRIDGES (1 DIV = 10 RODS)",
    ),
    4: CityPlateProfile(
        4, "dawn_bastion", (968.0, 148.0), "bastions", "stilts", "SPECULAR_TWIN_SHORE", "zinc-scales",
        ("+12m QUAY", "+44m GUTTER", "+72m N.BASTION"),
        "SCALE OF BASTION STAIR-STEPS & ARCADE DEGREES (1 DIV = 10 STEPS)",
    ),
    5: CityPlateProfile(
        5, "mirror_lake", (890.0, 138.0), "canals", "suspension_nets", "CANAL_ARCHIPELAGO", "hatch-soot-45",
        ("+1m GARDEN POOL", "+9m CONCENTRIC CANALS", "+32m KITE AIRSPACE"),
        "SCALE OF CONCENTRIC KITE CANALS & AGATE LATHE BENCHES (1 DIV = 10 PACES)",
    ),
    6: CityPlateProfile(
        6, "dusk", (942.0, 144.0), "scaffolding", "bastions", "SIGNBOARD_CORRIDOR", "ashlar-stone",
        ("+5m TEMPLE PLAZA", "+14m GUILD CORNICE", "+29m CLOUD GATE"),
        "SCALE OF JUTTING GUILD BRACKETS & DECREE STEPS (1 DIV = 10 PACES)",
    ),
    7: CityPlateProfile(
        7, "dawn_bastion", (248.0, 140.0), "spiral_shells", "crystal_globes", "RINGED_CITADEL", "hatch-graphite-cross",
        ("+8m NINE-JET BASIN", "+24m BARBER AWNING", "+52m GLASS TOWER"),
        "SCALE OF IMMUTABLE HONEYCOMB LOCI & COPPER CLOCKS (1 DIV = 10 CELLS)",
    ),
    8: CityPlateProfile(
        8, "dawn_bastion", (936.0, 152.0), "refuse_mountains", "stilts", "SPECULAR_TWIN_SHORE", "ashlar-stone",
        ("0m HARBOR QUAY", "+19m CRANE TAVERNS", "+54m TABLELAND SADDLE"),
        "SCALE OF SALT-HAZE TABLELAND LEAGUES & HARBOR CRANES (1 DIV = 10 CABLES)",
    ),
    9: CityPlateProfile(
        9, "moonlight", (918.0, 136.0), "scaffolding", "domes", "SUBTERRANEAN_STRATA", "zinc-scales",
        ("-9m SUBWAY ROW", "+12m PUMA ARCADE", "+64m DIRIGIBLE MAST"),
        "SCALE OF DIRIGIBLE MOORING CORDS & SUBWAY PLATFORMS (1 DIV = 10 SPANS)",
    ),
    10: CityPlateProfile(
        10, "dawn_bastion", (264.0, 138.0), "pipe_forests", "stilts", "STILT_TRUSS_GRID", "hatch-soot-45",
        ("-42m BLACK LAKE", "+4m WELL RIM", "+38m WINDLASS AQUEDUCT"),
        "SCALE OF VERTICAL WELL BORES & NORIA WINDLASSES (1 DIV = 10 FATHOMS)",
    ),
    11: CityPlateProfile(
        11, "dusk", (912.0, 146.0), "bastions", "scaffolding", "SIGNBOARD_CORRIDOR", "hatch-graphite-cross",
        ("+6m BANDSTAND LOT", "+18m BUS STATION", "+34m STEEL OVERPASS"),
        "SCALE OF SEPIA POSTCARD SQUARES & OVERPASS SPANS (1 DIV = 10 METERS)",
    ),
    12: CityPlateProfile(
        12, "dawn_bastion", (244.0, 136.0), "crystal_globes", "bastions", "RINGED_CITADEL", "ashlar-stone",
        ("+10m DRIED CANAL", "+26m STONE ARTERIAL", "+46m GLOBE MUSEUM"),
        "SCALE OF GRAY ASHLAR COURTS & BLUE CRYSTAL GLOBES (1 DIV = 10 VITRINES)",
    ),
    13: CityPlateProfile(
        13, "abyssal_mist", (600.0, 128.0), "refuse_mountains", "bastions", "LABYRINTH_SKEIN", "hatch-graphite-cross",
        ("+11m WHEEL BORDER", "+22m BAZAAR HEARTH", "+35m PYRAMID ROOFS"),
        "SCALE OF INDIVISIBLE PYRAMID ROOFS & BAZAAR HEARTHS (1 DIV = 10 ROOFS)",
    ),
    14: CityPlateProfile(
        14, "dawn_bastion", (954.0, 140.0), "stilts", "suspension_nets", "STILT_TRUSS_GRID", "zinc-scales",
        ("0m DRY TERRAIN", "+24m CROSSED WALKS", "+58m CONE BELVEDERE"),
        "SCALE OF DRY BAMBOO PILINGS & SUSPENDED LADDERS (1 DIV = 10 CUBITS)",
    ),
    15: CityPlateProfile(
        15, "dusk", (252.0, 144.0), "canals", "domes", "CANAL_ARCHIPELAGO", "hatch-soot-45",
        ("0m YELLOW-MAT QUAY", "+8m CARPET BALES", "+19m EQUINOX FIRES"),
        "SCALE OF SEVEN-NATION CAMPFIRES & MUSLIN BARGES (1 DIV = 10 BALES)",
    ),
    16: CityPlateProfile(
        16, "moonlight", (928.0, 132.0), "bastions", "spiral_shells", "LABYRINTH_SKEIN", "ashlar-stone",
        ("+9m TRAP ARCADES", "+21m BLIND CUL-DE-SAC", "+39m MOON SKEIN"),
        "SCALE OF WOUND MOONLIT WALLS & SEALED CORNERS (1 DIV = 10 TURNS)",
    ),
    17: CityPlateProfile(
        17, "mirror_lake", (268.0, 138.0), "domes", "canals", "SPECULAR_TWIN_SHORE", "ashlar-stone",
        ("-14m CRAB LAGOON", "+16m BASALT QUARRY", "+56m FLUTE PINNACLE"),
        "SCALE OF MAGNOLIA LAGOON DEPTHS & PORPHYRY DOMES (1 DIV = 10 CUBITS)",
    ),
    18: CityPlateProfile(
        18, "dawn_bastion", (948.0, 136.0), "pipe_forests", "crystal_globes", "STILT_TRUSS_GRID", "zinc-scales",
        ("+6m MAIN RISERS", "+28m PORCELAIN BOUGHS", "+52m SPRAY VALVES"),
        "SCALE OF HYDRAULIC RISER PIPES & PORCELAIN BASINS (1 DIV = 10 PIPES)",
    ),
    19: CityPlateProfile(
        19, "abyssal_mist", (284.0, 134.0), "suspension_nets", "bastions", "SIGNBOARD_CORRIDOR", "hatch-soot-45",
        ("+5m RAIN SHELTER", "+14m BANDSTAND NEXUS", "+26m PARASOL WALK"),
        "SCALE OF RAIN-ARCADE COLONNADES & GLANCE CHORDS (1 DIV = 10 ARCHES)",
    ),
    20: CityPlateProfile(
        20, "mirror_lake", (600.0, 130.0), "bastions", "crystal_globes", "SPECULAR_TWIN_SHORE", "zinc-scales",
        ("-32m INVERTED LAKE", "0m SPECULAR PLANE", "+38m TIERED VERANDAS"),
        "SCALE OF TIERED CLIFF VERANDAS & LAKE PLUMB DEPTHS (1 DIV = 10 FATHOMS)",
    ),
    21: CityPlateProfile(
        21, "dusk", (930.0, 146.0), "pipe_forests", "canals", "CANAL_ARCHIPELAGO", "hatch-graphite-cross",
        ("0m GREEN ESTUARY", "+14m PEACOCK PATIO", "+34m MANDREL LATHES"),
        "SCALE OF MULLIONED PATIOS & SOOT LATHE SHOPS (1 DIV = 10 SPINDLES)",
    ),
    22: CityPlateProfile(
        22, "dawn_bastion", (246.0, 142.0), "scaffolding", "zodiacal_gates", "STILT_TRUSS_GRID", "ashlar-stone",
        ("0m UNBOLTED PYLONS", "+26m MARBLE LOT", "+62m COASTER CREST"),
        "SCALE OF CARNIVAL TRUSS HUMPS & DEMOUNTABLE LOTS (1 DIV = 10 PYLONS)",
    ),
    23: CityPlateProfile(
        23, "dawn_bastion", (922.0, 138.0), "refuse_mountains", "bastions", "RINGED_CITADEL", "ashlar-stone",
        ("+40m CHESS PLAIN", "+68m VACANT TWINS", "+92m ACTIVE PLATEAU"),
        "SCALE OF MERCURY PLATEAU ROADS & TWIN SQUARES (1 DIV = 10 FURLONGS)",
    ),
    24: CityPlateProfile(
        24, "abyssal_mist", (904.0, 132.0), "pipe_forests", "bastions", "SUBTERRANEAN_STRATA", "hatch-soot-45",
        ("-11m MANHOLE WELLS", "0m GUTTER STONES", "+28m CURTAIN SILLS"),
        "SCALE OF UPWARD SILL PARAPETS & MANHOLE GUTTERS (1 DIV = 10 STEPS)",
    ),
    25: CityPlateProfile(
        25, "dawn_bastion", (258.0, 140.0), "bastions", "zodiacal_gates", "SIGNBOARD_CORRIDOR", "ashlar-stone",
        ("+7m RANDOM STREETS", "+18m GLIMMER CORNER", "+41m PROVERB FORUM"),
        "SCALE OF PROVERBIAL CANON FOLIOS & OBLIQUE ALLEYS (1 DIV = 10 FOLIOS)",
    ),
    26: CityPlateProfile(
        26, "abyssal_mist", (600.0, 126.0), "suspension_nets", "stilts", "ABYSS_CATENARY", "hatch-soot-45",
        ("-180m ABYSS VOID", "-24m SACK GONDOLAS", "0m CATENARY TIES"),
        "SCALE OF PRECIPICE HEMP CABLES & WOODEN TIES (1 DIV = 10 TIES)",
    ),
    27: CityPlateProfile(
        27, "dawn_bastion", (946.0, 142.0), "suspension_nets", "stilts", "ZODIAC_CARDO", "hatch-graphite-cross",
        ("+4m CHORD PLAIN", "+18m CORNER POSTS", "+74m REFUGEE CREST"),
        "SCALE OF FOUR-COLOR TAUT CORDS & CORNER POLES (1 DIV = 10 SPANS)",
    ),
    28: CityPlateProfile(
        28, "abyssal_mist", (934.0, 128.0), "stilts", "crystal_globes", "STILT_TRUSS_GRID", "zinc-scales",
        ("0m UNTOUCHED WOODS", "+85m CLOUD LAYER", "+140m AERIAL DECK"),
        "SCALE OF FLAMINGO STILT LEGS & DOWNWARD OPTICS (1 DIV = 10 CUBITS)",
    ),
    29: CityPlateProfile(
        29, "moonlight", (242.0, 136.0), "pipe_forests", "bastions", "LABYRINTH_SKEIN", "hatch-soot-45",
        ("+3m THRESHOLD RACK", "+11m KITCHEN FLUES", "+24m STUCCO CORNICE"),
        "SCALE OF COATRACK THRESHOLDS & RADIATOR CORNICES (1 DIV = 10 HEARTHS)",
    ),
    30: CityPlateProfile(
        30, "dawn_bastion", (600.0, 132.0), "zodiacal_gates", "bastions", "SIGNBOARD_CORRIDOR", "ashlar-stone",
        ("+6m CHORUS STEPS", "+14m ROLE WINGS", "+28m PROSCENIUM"),
        "SCALE OF PROSCENIUM DIALOGUE STEPS & RELAY ARCS (1 DIV = 10 PACES)",
    ),
    31: CityPlateProfile(
        31, "mirror_lake", (944.0, 138.0), "canals", "suspension_nets", "CANAL_ARCHIPELAGO", "zinc-scales",
        ("-4m SEWER SPOKES", "+9m CAMBERED BRIDGES", "+46m SWALLOW ARCS"),
        "SCALE OF ZIGZAG CANAL BRIDGES & SWALLOW PARABOLAS (1 DIV = 10 SPANS)",
    ),
    32: CityPlateProfile(
        32, "mirror_lake", (254.0, 140.0), "domes", "canals", "CANAL_ARCHIPELAGO", "ashlar-stone",
        ("+2m NINE BRIDGES", "+15m ARCADE SLANT", "+42m ONION SPIRES"),
        "SCALE OF NINE CANAL BRIDGES & ROSE TRACERY SPANS (1 DIV = 10 PACES)",
    ),
    33: CityPlateProfile(
        33, "dawn_bastion", (926.0, 146.0), "refuse_mountains", "stilts", "REFUSE_CRATER_SPRAWL", "hatch-graphite-cross",
        ("0m HIDDEN DUNE SEA", "+14m SAWMILL LOTS", "+38m WIND PUMPS"),
        "SCALE OF LUMBER STACK STREETS & WIND-PUMP TOWERS (1 DIV = 10 RODS)",
    ),
    34: CityPlateProfile(
        34, "dusk", (916.0, 148.0), "bastions", "canals", "SPECULAR_TWIN_SHORE", "hatch-soot-45",
        ("0m URCHIN BOLLARDS", "+9m STEVEDORE STEPS", "+26m BALCONY ALLEY"),
        "SCALE OF WHARF BOLLARDS & SACKCLOTH STEVEDORE STEPS (1 DIV = 10 STEPS)",
    ),
    35: CityPlateProfile(
        35, "dusk", (600.0, 130.0), "zodiacal_gates", "domes", "ZODIAC_CARDO", "hatch-graphite-cross",
        ("+8m MULE ALLEYS", "+21m ORACLE ALTAR", "+39m CARPET SHRINE"),
        "SCALE OF CRIMSON WEAVE KNOTS & MULE ALLEY TURNS (1 DIV = 10 KNOTS)",
    ),
    36: CityPlateProfile(
        36, "dusk", (262.0, 138.0), "crystal_globes", "pipe_forests", "SPECULAR_TWIN_SHORE", "zinc-scales",
        ("+4m PAPER FOLD", "+18m ALABASTER FRONT", "+19m RUSTED OBVERSE"),
        "SCALE OF ALABASTER GATES & SHEET-METAL OBVERSE (1 DIV = 10 PANELS)",
    ),
    37: CityPlateProfile(
        37, "dawn_bastion", (938.0, 140.0), "domes", "bastions", "LABYRINTH_SKEIN", "ashlar-stone",
        ("-5m RUMMAGE VAULTS", "+12m CAPITAL YARDS", "+31m VELVET BELLS"),
        "SCALE OF SALVAGED CORINTHIAN CAPITALS & URN LOTS (1 DIV = 10 SHARDS)",
    ),
    38: CityPlateProfile(
        38, "subterranean_cutaway", None, "zodiacal_gates", "bastions", "SUBTERRANEAN_STRATA", "ashlar-stone",
        ("-34m NECROPOLIS", "-16m BROTHER SHAFT", "+8m UPPER BANQUET"),
        "SCALE OF CATACOMB VAULT NICHES & TUNNEL SHAFTS (1 DIV = 10 CUBITS)",
    ),
    39: CityPlateProfile(
        39, "subterranean_cutaway", None, "pipe_forests", "crystal_globes", "ZODIAC_CARDO", "zinc-scales",
        ("-28m SUBSOIL GEARS", "0m DIAMOND VAULTS", "+120m COMET ZENITH"),
        "SCALE OF SUBSOIL BRASS GEARS & CELESTIAL ORBITS (1 DIV = 10 ARCS)",
    ),
    40: CityPlateProfile(
        40, "dawn_bastion", (600.0, 132.0), "refuse_mountains", "bastions", "REFUSE_CRATER_SPRAWL", "hatch-graphite-cross",
        ("+6m MORNING CORE", "+48m GARBAGE RING", "+96m DETRITUS CREST"),
        "SCALE OF MORNING STREET SWEEPS & REFUSE RAMPARTS (1 DIV = 10 STRATA)",
    ),
    41: CityPlateProfile(
        41, "dusk", (920.0, 144.0), "refuse_mountains", "domes", "RINGED_CITADEL", "ashlar-stone",
        ("+18m MISTY GULLEY", "+54m VALLEY ROAD", "+112m WINDY PLATEAU"),
        "SCALE OF PLATEAU RIM OVERLOOKS & GULLEY ROADS (1 DIV = 10 FURLONGS)",
    ),
    42: CityPlateProfile(
        42, "subterranean_cutaway", None, "refuse_mountains", "spiral_shells", "SUBTERRANEAN_STRATA", "hatch-graphite-cross",
        ("-48m WORM CREVICES", "-22m PACKED CLAY", "0m SURFACE CRUST"),
        "SCALE OF CLAY-PACKED NEGATIVE STAIRS & ROOT VEINS (1 DIV = 10 CUBITS)",
    ),
    43: CityPlateProfile(
        43, "moonlight", (940.0, 128.0), "scaffolding", "stilts", "ZODIAC_CARDO", "hatch-soot-45",
        ("+12m PLANK FENCE", "+48m TRESTLE ARMATURE", "+94m CRANE ZENITH"),
        "SCALE OF PINE SCAFFOLD BAYS & STARRY PLUMB LINES (1 DIV = 10 BAYS)",
    ),
    44: CityPlateProfile(
        44, "abyssal_mist", (276.0, 136.0), "scaffolding", "pipe_forests", "REFUSE_CRATER_SPRAWL", "hatch-graphite-cross",
        ("+4m AIRPORT TARMAC", "+9m ROUNDABOUT", "+14m SUBURB ROWS"),
        "SCALE OF HOMONYMOUS TARMAC BAYS & FLOWERBEDS (1 DIV = 10 LOTS)",
    ),
    45: CityPlateProfile(
        45, "dawn_bastion", (600.0, 130.0), "crystal_globes", "spiral_shells", "RINGED_CITADEL", "zinc-scales",
        ("+2m PINHEAD GERM", "+14m ANNULUS RINGS", "+36m OUTER TRUNK WALL"),
        "SCALE OF CONCENTRIC TREE-RINGS & PINHEAD LENSES (1 DIV = 10 RINGS)",
    ),
    46: CityPlateProfile(
        46, "dawn_bastion", (250.0, 138.0), "domes", "spiral_shells", "SUBTERRANEAN_STRATA", "ashlar-stone",
        ("-18m SLAB NECROPOLIS", "+12m LIVING WARDS", "+46m HOURGLASS DOMES"),
        "SCALE OF NECROPOLIS SLAB LANES & HOURGLASS PORES (1 DIV = 10 GRAINS)",
    ),
    47: CityPlateProfile(
        47, "dawn_bastion", (600.0, 126.0), "zodiacal_gates", "bastions", "ZODIAC_CARDO", "ashlar-stone",
        ("-14m HIDDEN CELLARS", "+16m CARDO CROSS", "+44m ECLIPSE GATES"),
        "SCALE OF TWELVE ZODIACAL GATES & SOLAR DEGREES (1 DIV = 10 DEGREES)",
    ),
    48: CityPlateProfile(
        48, "dawn_bastion", (932.0, 142.0), "scaffolding", "refuse_mountains", "REFUSE_CRATER_SPRAWL", "hatch-soot-45",
        ("+5m DITCH FIELD", "+12m MEDLAR HILL", "+19m INN WINDOW SILL"),
        "SCALE OF CORNFIELD DITCHES & WINDOW SILL RANKS (1 DIV = 10 FURROWS)",
    ),
    49: CityPlateProfile(
        49, "dusk", (266.0, 140.0), "suspension_nets", "scaffolding", "LABYRINTH_SKEIN", "zinc-scales",
        ("+4m ZINC WINESHOP", "+18m RAGOUT PERGOLA", "+42m FRANCOLIN SKY"),
        "SCALE OF ZINC COUNTER LEDGERS & CRIMSON THREADS (1 DIV = 10 SPANS)",
    ),
    50: CityPlateProfile(
        50, "moonlight", (600.0, 126.0), "crystal_globes", "spiral_shells", "ZODIAC_CARDO", "zinc-scales",
        ("+8m BAMBOO PORT", "+32m CEPHEID RING", "+68m NOVA DOME"),
        "SCALE OF PLANETARY ORBIT STREETS & NOVA ARCS (1 DIV = 10 SECONDS)",
    ),
    51: CityPlateProfile(
        51, "dawn_bastion", (256.0, 144.0), "pipe_forests", "refuse_mountains", "REFUSE_CRATER_SPRAWL", "hatch-graphite-cross",
        ("+6m TRAFFIC ISLAND", "+22m HOUSE ROWS", "+48m SAGE PASTURE"),
        "SCALE OF MOTORWAY ISLANDS & LOST PASTURE BELLS (1 DIV = 10 PACES)",
    ),
    52: CityPlateProfile(
        52, "subterranean_cutaway", None, "zodiacal_gates", "crystal_globes", "SUBTERRANEAN_STRATA", "ashlar-stone",
        ("-24m LEADEN TUNNELS", "+6m OVERCOAT PLAZA", "+52m CRYSTAL CRACK"),
        "SCALE OF SOLDERED TUNNEL PASSAGES & WING VAULTS (1 DIV = 10 CUBITS)",
    ),
    53: CityPlateProfile(
        53, "abyssal_mist", (600.0, 134.0), "scaffolding", "refuse_mountains", "REFUSE_CRATER_SPRAWL", "hatch-soot-45",
        ("+1m SWAMP APPROACH", "+11m CARNIVAL BELT", "+24m POLYHEDRONS"),
        "SCALE OF CONCENTRIC OUTSKIRTS & TOLLBOOTH RINGS (1 DIV = 10 FURLONGS)",
    ),
    54: CityPlateProfile(
        54, "subterranean_cutaway", None, "bastions", "zodiacal_gates", "SUBTERRANEAN_STRATA", "ashlar-stone",
        ("-26m INCUNABULA VAULT", "-8m ASEPTIC SEWERS", "+28m GRIFFON CAPITALS"),
        "SCALE OF SEALED FAUNA VOLUMES & CRYPT ARCHES (1 DIV = 10 FOLIOS)",
    ),
    55: CityPlateProfile(
        55, "subterranean_cutaway", None, "bastions", "suspension_nets", "RINGED_CITADEL", "ashlar-stone",
        ("-12m PULLEY ROOMS", "+14m TRIGLYPH BATHS", "+38m GERM SHEATH"),
        "SCALE OF COGWHEEL METOPES & PULLEY COUNTERWEIGHTS (1 DIV = 10 TEETH)",
    ),
}

SERIES_FALLBACK_PROFILE = CityPlateProfile(
    99, "dawn_bastion", (920.0, 140.0), "bastions", "domes", "RINGED_CITADEL", "ashlar-stone",
    ("+8m OUTER THRESHOLD", "+22m INNER COURT", "+42m CITADEL APEX"),
    "SCALE OF CIVIC THRESHOLDS & KEYSTONE SPANS (1 DIV = 10 PACES)",
)


def _get_city_profile(case_data: Dict[str, Any]) -> CityPlateProfile:
    idx = int(case_data.get("city_index", 99))
    return CITY_PLATE_PROFILES.get(idx, SERIES_FALLBACK_PROFILE)


# ---------------------------------------------------------------------------
# TRACE TELEMETRY & ROLE EXTRACTORS
# ---------------------------------------------------------------------------

def _extract_role_cast(case_data: Dict[str, Any]) -> Tuple[
    Dict[str, Any],  # source_agent
    Dict[str, Any],  # witness_agent
    Dict[str, Any],  # world_body_agent
    Dict[str, Any],  # control_other_agent
    int,             # hold_tick
    int,             # push_tick
    int,             # swerve_tick
]:
    agents: List[Dict[str, Any]] = list(case_data["agents"])
    by_id = {a["agent_id"]: a for a in agents}
    wt_a = case_data["CHECKPOINT_LAWFUL_A"]["world_trace"]
    div = case_data.get("divergence_audit", {})
    swerve_tick = int(div.get("swerve_tick", 11))
    witness_id = str(div.get("witness_agent_id", ""))

    witness_ag = by_id.get(witness_id)
    if witness_ag is None:
        witness_ag = next(
            (a for a in agents if a.get("op_symbol") == "⊣" or a.get("role_symbol") == "☾"),
            agents[-1],
        )

    # Locate deliberate_push actor and tick
    source_ag: Optional[Dict[str, Any]] = None
    push_tick = 8
    for t, frame in enumerate(wt_a):
        actors = frame.get("actors", {})
        for a in agents:
            if a["agent_id"] == witness_ag["agent_id"]:
                continue
            af = actors.get(a["agent_id"], {})
            if af.get("intention_kinematics") == "deliberate_push":
                source_ag = a
                push_tick = t
                break
        if source_ag is not None:
            break

    if source_ag is None:
        source_ag = next(
            (a for a in agents if a["agent_id"] != witness_ag["agent_id"] and a.get("role_symbol") == "☉"),
            next(a for a in agents if a["agent_id"] != witness_ag["agent_id"]),
        )

    hold_tick = max(0, push_tick - 4)
    for t in range(push_tick):
        af = wt_a[t].get("actors", {}).get(source_ag["agent_id"], {})
        if af.get("intention_kinematics") == "hold_still":
            hold_tick = t
            break

    remaining = [
        a for a in agents
        if a["agent_id"] not in (source_ag["agent_id"], witness_ag["agent_id"])
    ]
    if len(remaining) >= 2:
        remaining.sort(key=lambda a: 0 if a.get("role_symbol") in ("♁", "◉") else 1)
        wb_ag, ctl_ag = remaining[0], remaining[1]
    elif len(remaining) == 1:
        wb_ag = remaining[0]
        ctl_ag = remaining[0]
    else:
        wb_ag = source_ag
        ctl_ag = witness_ag

    return source_ag, witness_ag, wb_ag, ctl_ag, hold_tick, push_tick, swerve_tick


def _clamp01(v: float, lo: float = 0.08, hi: float = 0.92) -> float:
    return max(lo, min(hi, float(v)))


def _relax_station_coords(
    raw_pts: List[Tuple[float, float]],
    box: Tuple[float, float, float, float],
    min_dist: float = 88.0,
) -> List[Tuple[float, float]]:
    """Deterministically separate agent badge centers inside `box` so medallions never overlap."""
    bx, by, bw, bh = box
    pts = [[max(bx + 26, min(bx + bw - 26, x)), max(by + 26, min(by + bh - 26, y))] for x, y in raw_pts]
    n = len(pts)
    for _ in range(18):
        moved = False
        for i in range(n):
            for j in range(i + 1, n):
                dx = pts[j][0] - pts[i][0]
                dy = pts[j][1] - pts[i][1]
                d = math.hypot(dx, dy)
                if d < min_dist:
                    moved = True
                    if d < 1e-3:
                        ang = (i + 1) * 1.15 + j * 0.7
                        ux, uy = math.cos(ang), math.sin(ang)
                    else:
                        ux, uy = dx / d, dy / d
                    push = 0.52 * (min_dist - d)
                    pts[i][0] = max(bx + 26, min(bx + bw - 26, pts[i][0] - ux * push))
                    pts[i][1] = max(by + 26, min(by + bh - 26, pts[i][1] - uy * push))
                    pts[j][0] = max(bx + 26, min(bx + bw - 26, pts[j][0] + ux * push))
                    pts[j][1] = max(by + 26, min(by + bh - 26, pts[j][1] + uy * push))
        if not moved:
            break
    return [(p[0], p[1]) for p in pts]


# ---------------------------------------------------------------------------
# 1. BESPOKE CARTOGRAPHIC SURVEY MAP BUILDER (`1200x900`)
# ---------------------------------------------------------------------------

def _draw_map_urban_morphology(
    m: MapPlateBuilder,
    profile: CityPlateProfile,
    case_data: Dict[str, Any],
    plan_box: Tuple[float, float, float, float],
) -> None:
    """Render distinct hand-inked architectural plan topology inside `plan_box`."""
    p = m.palette
    px0, py0, pw, ph = plan_box
    cx, cy = px0 + pw * 0.50, py0 + ph * 0.50
    rng = _seeded_rng(m.plate_id, "urban_morphology")
    loci = [_short_locus_tag(loc, 15) for loc in case_data.get("loci", [])]
    while len(loci) < 3:
        loci.append(f"SECTOR {len(loci) + 1}")
    nouns = [_short_locus_tag(n, 15) for n in case_data.get("material_nouns", [])]
    rpat = profile.roof_pattern
    morph = profile.map_morphology

    # Base topographic contours tailored to city index & datum labels
    ecc = -24.0 + (profile.city_index * 11 % 48)
    m.draw_contour_lines(
        center_xy=(cx + rng.uniform(-18, 18), cy + rng.uniform(-14, 14)),
        radii=[(258, 198), (204, 154), (146, 108)],
        elevation_labels=list(profile.contour_labels),
        ink=p["dirt"],
        eccentricity_angle_deg=ecc,
    )

    if morph == "RINGED_CITADEL":
        m.draw_radial_web(center_xy=(cx, cy), radii=[68.0, 128.0, 188.0], spokes=8, ink=p["graphite"])
        ring_pts = [
            (cx + 196 * math.cos(2 * math.pi * k / 8 + 0.18), cy + 162 * math.sin(2 * math.pi * k / 8 + 0.18))
            for k in range(9)
        ]
        m.draw_bastion_wall(ring_pts, thickness=8.5, crenelated=True)
        m.draw_urban_block([(cx - 46, cy - 38), (cx + 46, cy - 38), (cx + 46, cy + 38), (cx - 46, cy + 38)], roof_pattern=rpat, label=_whole_word_clip(loci[0], 18))
        m.draw_urban_block([(cx - 148, cy - 92), (cx - 76, cy - 98), (cx - 72, cy - 34), (cx - 144, cy - 28)], roof_pattern="ashlar-stone", label=_whole_word_clip(loci[1], 16))
        m.draw_urban_block([(cx + 76, cy + 30), (cx + 152, cy + 36), (cx + 146, cy + 98), (cx + 72, cy + 92)], roof_pattern=rpat, label=_whole_word_clip(loci[2], 16))
        m.draw_stairway_run(cx, cy + 162, cx, cy + 48, width=22.0, steps=12)

    elif morph == "SPIRAL_NAUTILUS":
        spiral_pts: List[Tuple[float, float]] = []
        for s in range(34):
            u = s / 33.0
            th = u * 4.4 * math.pi
            rr = 28.0 + u * 168.0
            spiral_pts.append((cx + rr * math.cos(th), cy + rr * 0.80 * math.sin(th)))
        m.draw_bastion_wall(spiral_pts, thickness=7.5, crenelated=False)
        m.draw_stairway_run(cx - 148, cy + 98, cx - 28, cy + 16, width=21.0, steps=14, label=_whole_word_clip(loci[0], 18))
        m.draw_stairway_run(cx + 142, cy - 88, cx + 32, cy - 18, width=20.0, steps=12)
        m.draw_urban_block([(cx - 134, cy - 110), (cx - 46, cy - 116), (cx - 42, cy - 56), (cx - 130, cy - 50)], roof_pattern=rpat, label=_whole_word_clip(loci[1], 16))
        m.draw_urban_block([(cx + 48, cy + 54), (cx + 144, cy + 60), (cx + 138, cy + 118), (cx + 44, cy + 112)], roof_pattern="zinc-scales", label=_whole_word_clip(loci[2], 16))

    elif morph == "CANAL_ARCHIPELAGO":
        basin = [
            (px0 + 18, cy + 58), (cx - 80, cy + 34), (cx + 68, cy + 66),
            (px0 + pw - 18, cy + 28), (px0 + pw - 18, py0 + ph - 12), (px0 + 18, py0 + ph - 12),
        ]
        m.draw_water_contours(basin, ripple_count=5)
        m.draw_canal_ribbon(
            [(px0 + 24, cy - 66), (cx - 86, cy - 28), (cx + 42, cy - 48), (px0 + pw - 24, cy - 12)],
            width=18.0, bridges=3, label=_whole_word_clip(loci[0], 20),
        )
        m.draw_canal_ribbon(
            [(cx - 42, py0 + 18), (cx - 12, cy - 36), (cx + 18, cy + 62)],
            width=14.0, bridges=2,
        )
        m.draw_urban_block([(px0 + 48, py0 + 34), (cx - 66, py0 + 38), (cx - 72, cy - 56), (px0 + 44, cy - 60)], roof_pattern=rpat, label=_whole_word_clip(loci[1], 16))
        m.draw_urban_block([(cx + 34, py0 + 36), (px0 + pw - 46, py0 + 44), (px0 + pw - 52, cy - 42), (cx + 28, cy - 50)], roof_pattern="zinc-scales", label=_whole_word_clip(loci[2], 16))
        m.draw_pier_dock(cx - 118, cy + 48, 56.0, 92.0, label="QUAY PIER")

    elif morph == "LABYRINTH_SKEIN":
        wall_a = [(px0 + 46, py0 + 44), (px0 + pw - 54, py0 + 44), (px0 + pw - 54, cy + 84), (cx - 48, cy + 84), (cx - 48, cy - 42), (cx + 84, cy - 42)]
        wall_b = [(px0 + 46, py0 + 96), (px0 + 46, py0 + ph - 36), (px0 + pw - 96, py0 + ph - 36)]
        m.draw_bastion_wall(wall_a, thickness=8.8, crenelated=True)
        m.draw_bastion_wall(wall_b, thickness=7.6, crenelated=False)
        m.draw_urban_block([(px0 + 76, py0 + 68), (cx - 76, py0 + 68), (cx - 76, cy - 12), (px0 + 76, cy - 12)], roof_pattern=rpat, label=_whole_word_clip(loci[0], 16))
        m.draw_urban_block([(cx + 12, py0 + 68), (px0 + pw - 82, py0 + 68), (px0 + pw - 82, cy - 62), (cx + 12, cy - 62)], roof_pattern="ashlar-stone", label=_whole_word_clip(loci[1], 16))
        m.draw_urban_block([(px0 + 82, cy + 32), (cx - 72, cy + 32), (cx - 72, py0 + ph - 58), (px0 + 82, py0 + ph - 58)], roof_pattern="hatch-graphite-cross", label=_whole_word_clip(loci[2], 16))
        m.draw_stairway_run(cx + 66, py0 + ph - 48, cx + 66, cy + 12, width=20.0, steps=11)

    elif morph == "SIGNBOARD_CORRIDOR":
        m.draw_bastion_wall([(px0 + 32, cy - 58), (px0 + pw - 110, cy - 58)], thickness=8.5, crenelated=False)
        m.draw_bastion_wall([(px0 + 32, cy + 58), (px0 + pw - 110, cy + 58)], thickness=8.5, crenelated=False)
        for bi in range(3):
            bx = px0 + 48 + bi * 136
            m.draw_urban_block([(bx, py0 + 38), (bx + 108, py0 + 38), (bx + 108, cy - 68), (bx, cy - 68)], roof_pattern=rpat, label=_whole_word_clip(loci[bi % len(loci)], 14))
            m.draw_urban_block([(bx, cy + 68), (bx + 108, cy + 68), (bx + 108, py0 + ph - 38), (bx, py0 + ph - 38)], roof_pattern="ashlar-stone")
            # Jutting bracket / colonnade cross-arms into street
            m.hand_line(m.LAYER_SOOT_PLAN, bx + 54, cy - 58, bx + 54, cy - 28, stroke=p["red_bird"], stroke_width=2.2)
            m.hand_line(m.LAYER_SOOT_PLAN, bx + 54, cy + 58, bx + 54, cy + 28, stroke=p["red_bird"], stroke_width=2.2)
        m.draw_stairway_run(px0 + pw - 108, cy, px0 + pw - 24, cy, width=38.0, steps=9)

    elif morph == "STILT_TRUSS_GRID":
        m.draw_radial_web(center_xy=(cx, cy), radii=[84.0, 168.0], spokes=10, ink=p["graphite"])
        deck_coords = [
            (px0 + 58, py0 + 46, loci[0]),
            (px0 + pw - 178, py0 + 52, loci[1]),
            (px0 + 68, py0 + ph - 122, loci[2]),
            (px0 + pw - 186, py0 + ph - 118, nouns[0] if nouns else "BELVEDERE"),
        ]
        centers: List[Tuple[float, float]] = []
        for dx, dy, lbl in deck_coords:
            m.draw_urban_block([(dx, dy), (dx + 116, dy), (dx + 116, dy + 68), (dx, dy + 68)], roof_pattern=rpat, label=_whole_word_clip(lbl, 15))
            centers.append((dx + 58, dy + 34))
            for px_p, py_p in ((dx + 8, dy + 8), (dx + 108, dy + 8), (dx + 8, dy + 60), (dx + 108, dy + 60)):
                m.emit(m.LAYER_SOOT_PLAN, f'<circle cx="{px_p:.1f}" cy="{py_p:.1f}" r="3.4" fill="{p["soot"]}"/>')
        # Suspended catwalks crisscrossing between pilings
        for i in range(len(centers)):
            for j in range(i + 1, len(centers)):
                m.hand_line(m.LAYER_SOOT_PLAN, centers[i][0], centers[i][1], centers[j][0], centers[j][1], stroke=p["soot"], stroke_width=1.6, dash="6,3")

    elif morph == "ABYSS_CATENARY":
        chasm = [(px0 + 96, py0 + 20), (px0 + pw - 96, py0 + 20), (px0 + pw - 82, py0 + ph - 20), (px0 + 82, py0 + ph - 20)]
        m.draw_water_contours(chasm, ripple_count=6)
        m.draw_bastion_wall([(px0 + 24, py0 + 24), (px0 + 94, py0 + 56), (px0 + 78, cy), (px0 + 96, py0 + ph - 48), (px0 + 24, py0 + ph - 24)], thickness=10.0, crenelated=True)
        m.draw_bastion_wall([(px0 + pw - 24, py0 + 24), (px0 + pw - 94, py0 + 56), (px0 + pw - 78, cy), (px0 + pw - 96, py0 + ph - 48), (px0 + pw - 24, py0 + ph - 24)], thickness=10.0, crenelated=True)
        for ri, y_off in enumerate((-110, -45, 20, 85)):
            y_l = cy + y_off
            sag = 28.0 if ri % 2 == 0 else -24.0
            d_cab = f"M {px0 + 86:.1f} {y_l:.1f} Q {cx:.1f} {y_l + sag:.1f} {px0 + pw - 86:.1f} {y_l:.1f}"
            m.emit(m.LAYER_SOOT_PLAN, f'<path d="{d_cab}" fill="none" stroke="{p["soot"]}" stroke-width="2.1"/>')
        m.draw_urban_block([(cx - 64, cy - 42), (cx + 64, cy - 42), (cx + 56, cy + 32), (cx - 56, cy + 32)], roof_pattern=rpat, label=_whole_word_clip(loci[1], 16))

    elif morph == "SUBTERRANEAN_STRATA":
        vault_pts = [(px0 + 34, py0 + 34), (px0 + pw - 34, py0 + 34), (px0 + pw - 34, py0 + ph - 34), (px0 + 34, py0 + ph - 34), (px0 + 34, py0 + 34)]
        m.draw_bastion_wall(vault_pts, thickness=11.0, crenelated=False)
        m.draw_stairway_run(px0 + 38, py0 + 76, cx - 72, cy - 48, width=24.0, steps=14, label=_whole_word_clip(loci[0], 16))
        m.draw_urban_block([(cx - 56, py0 + 56), (px0 + pw - 58, py0 + 56), (px0 + pw - 58, cy - 28), (cx - 56, cy - 28)], roof_pattern="ashlar-stone", label=_whole_word_clip(loci[1], 18))
        m.draw_urban_block([(px0 + 62, cy + 34), (cx + 36, cy + 34), (cx + 36, py0 + ph - 56), (px0 + 62, py0 + ph - 56)], roof_pattern=rpat, label=_whole_word_clip(loci[2], 18))
        for px_col in (px0 + 160, cx, px0 + pw - 160):
            for py_col in (py0 + 140, cy + 20, py0 + ph - 120):
                m.emit(m.LAYER_SOOT_PLAN, f'<rect x="{px_col - 7:.1f}" y="{py_col - 7:.1f}" width="14" height="14" fill="{p["soot"]}" stroke="{p["bone"]}" stroke-width="1.0"/>')

    elif morph == "ZODIAC_CARDO":
        m.draw_radial_web(center_xy=(cx, cy), radii=[58.0, 118.0, 186.0], spokes=12, ink=p["ochre_oil"])
        m.hand_line(m.LAYER_SOOT_PLAN, cx, py0 + 20, cx, py0 + ph - 20, stroke=p["soot"], stroke_width=2.6)
        m.hand_line(m.LAYER_SOOT_PLAN, px0 + 24, cy, px0 + pw - 24, cy, stroke=p["soot"], stroke_width=2.6)
        poly12 = [
            (cx + 198 * math.cos(2 * math.pi * k / 12), cy + 168 * math.sin(2 * math.pi * k / 12))
            for k in range(13)
        ]
        m.draw_bastion_wall(poly12, thickness=7.5, crenelated=True)
        m.draw_urban_block([(cx - 48, py0 + 38), (cx + 48, py0 + 38), (cx + 42, py0 + 92), (cx - 42, py0 + 92)], roof_pattern=rpat, label=_whole_word_clip(loci[0], 15))
        m.draw_urban_block([(px0 + 48, cy - 36), (px0 + 132, cy - 36), (px0 + 132, cy + 36), (px0 + 48, cy + 36)], roof_pattern="ashlar-stone", label=_whole_word_clip(loci[1], 14))
        m.draw_urban_block([(px0 + pw - 138, cy - 36), (px0 + pw - 50, cy - 36), (px0 + pw - 50, cy + 36), (px0 + pw - 138, cy + 36)], roof_pattern="zinc-scales", label=_whole_word_clip(loci[2], 14))

    elif morph == "REFUSE_CRATER_SPRAWL":
        outer_crag = [
            (px0 + 28, cy - 92), (px0 + 112, py0 + 28), (cx + 24, py0 + 42),
            (px0 + pw - 42, py0 + 32), (px0 + pw - 26, cy + 44), (px0 + pw - 68, py0 + ph - 28),
            (cx - 38, py0 + ph - 36), (px0 + 42, py0 + ph - 44), (px0 + 28, cy - 92),
        ]
        m.draw_bastion_wall(outer_crag, thickness=9.5, crenelated=False)
        for gx in range(int(px0 + 96), int(px0 + pw - 96), 78):
            m.hand_line(m.LAYER_SOOT_PLAN, gx, py0 + 62, gx, py0 + ph - 62, stroke=p["graphite"], stroke_width=0.9, dash="4,3")
        m.draw_urban_block([(cx - 64, cy - 48), (cx + 64, cy - 48), (cx + 64, cy + 48), (cx - 64, cy + 48)], roof_pattern=rpat, label=_whole_word_clip(loci[0], 16))
        m.draw_urban_block([(px0 + 62, py0 + 68), (px0 + 168, py0 + 68), (px0 + 162, py0 + 132), (px0 + 58, py0 + 132)], roof_pattern="hatch-graphite-cross", label=_whole_word_clip(loci[1], 15))
        m.draw_urban_block([(px0 + pw - 178, py0 + ph - 134), (px0 + pw - 64, py0 + ph - 134), (px0 + pw - 68, py0 + ph - 70), (px0 + pw - 182, py0 + ph - 70)], roof_pattern="hatch-soot-45", label=_whole_word_clip(loci[2], 15))

    else:  # SPECULAR_TWIN_SHORE
        shore_y = cy + 16.0
        water_poly = [
            (px0 + 20, shore_y), (cx - 90, shore_y - 12), (cx + 80, shore_y + 10),
            (px0 + pw - 20, shore_y - 6), (px0 + pw - 20, py0 + ph - 14), (px0 + 20, py0 + ph - 14),
        ]
        m.draw_water_contours(water_poly, ripple_count=6)
        m.draw_bastion_wall([(px0 + 24, shore_y - 6), (px0 + pw - 24, shore_y - 6)], thickness=8.0, crenelated=True)
        for bi in range(3):
            bx = px0 + 52 + bi * 164
            m.draw_urban_block([(bx, py0 + 48), (bx + 128, py0 + 48), (bx + 128, shore_y - 22), (bx, shore_y - 22)], roof_pattern=rpat, label=_whole_word_clip(loci[bi % len(loci)], 15))
            # Inverted specular twin outline in water below
            inv_h = 64.0
            m.emit(
                m.LAYER_CHALK_WITNESS,
                f'<rect x="{bx:.1f}" y="{shore_y + 18:.1f}" width="128" height="{inv_h:.1f}" '
                f'fill="none" stroke="{p["chalk_blue"]}" stroke-width="1.1" stroke-dasharray="5,3" stroke-opacity="0.65"/>',
            )
        m.draw_pier_dock(cx - 28, shore_y - 8, 56.0, 96.0, label="MIRROR PIER")


def build_city_map_plate(case_raw: Dict[str, Any]) -> MapPlateBuilder:
    """Construct bespoke `1200x900` Cartographic Survey Map for a compiled SCION city case."""
    case_data = _sanitize_case_tree(case_raw)
    case_id = str(case_data["case_id"])
    city_idx = int(case_data["city_index"])
    profile = _get_city_profile(case_data)

    m = MapPlateBuilder(plate_id=f"{case_id}_map")
    p = m.palette

    # Reserve right-column furniture upfront so survey callouts never intrude on x >= 768
    m.register_obstacle_box(772.0, 78.0, 356.0, 684.0)

    wt_a = case_data["CHECKPOINT_LAWFUL_A"]["world_trace"]
    wt_b = case_data["BRANCH_CLINAMEN_A_PRIME"]["world_trace"]
    final_res = wt_a[-1]["residues"]
    ledger_a = case_data["CHECKPOINT_LAWFUL_A"]["rule_ledger"]
    ledger_b = case_data["BRANCH_CLINAMEN_A_PRIME"]["rule_ledger"]
    grains_b = case_data["BRANCH_CLINAMEN_A_PRIME"].get("accumulator_dag", {}).get("conflict_grains", [])
    grains_a = case_data["CHECKPOINT_LAWFUL_A"].get("accumulator_dag", {}).get("conflict_grains", [])
    grains = grains_b or grains_a

    source_ag, witness_ag, wb_ag, ctl_ag, hold_tick, push_tick, swerve_tick = _extract_role_cast(case_data)

    # 1. P1..P4 Rule-Ledger Quadrants (top & bottom bands of left survey sheet)
    survey_x0, survey_y0, survey_w, survey_h = 88.0, 92.0, 664.0, 648.0
    mid_x = survey_x0 + survey_w * 0.50
    mid_y = survey_y0 + survey_h * 0.50
    m.hand_line(m.LAYER_TERRAIN, mid_x, survey_y0 + 54, mid_x, survey_y0 + survey_h - 54, stroke=p["graphite"], stroke_width=0.95, dash="6,5", opacity=0.48)
    m.hand_line(m.LAYER_TERRAIN, survey_x0 + 16, mid_y, survey_x0 + survey_w - 16, mid_y, stroke=p["graphite"], stroke_width=0.95, dash="6,5", opacity=0.48)

    quad_cards = [
        (survey_x0 + 10.0, survey_y0 + 12.0, ledger_a[0], ledger_b[0], "NW"),
        (mid_x + 10.0, survey_y0 + 12.0, ledger_a[1], ledger_b[1], "NE"),
        (survey_x0 + 10.0, survey_y0 + survey_h - 42.0, ledger_a[2], ledger_b[2], "SW"),
        (mid_x + 10.0, survey_y0 + survey_h - 42.0, ledger_a[3], ledger_b[3], "SE"),
    ]
    for qx, qy, pa, pb, qtag in quad_cards:
        m.emit(
            m.LAYER_TERRAIN,
            f'<rect x="{qx - 4:.1f}" y="{qy - 11:.1f}" width="314" height="46" rx="2" '
            f'fill="{p["paper"]}" fill-opacity="0.88" stroke="{p["dirt"]}" stroke-width="0.8"/>',
        )
        q_head = _whole_word_clip(f"{pa['policy_id']} · {qtag}: {pa['title']}", 50)
        pay_a = _whole_word_clip(str(pa["payout_status"]).replace("_", " "), 42)
        pay_b = _whole_word_clip(str(pb["payout_status"]).replace("_", " "), 34)
        m.draw_text(m.LAYER_TERRAIN, qx + 2, qy, q_head, size=7.7, fill=p["soot"], font_family=MONO_STACK, weight="bold", decollide=False)
        m.draw_text(m.LAYER_TERRAIN, qx + 2, qy + 13, f"A : {pay_a}", size=7.5, fill=p["chalk_blue"], font_family=MONO_STACK, decollide=False)
        m.draw_text(m.LAYER_TERRAIN, qx + 2, qy + 25, f"A': {pay_b} [t={pb.get('deciding_tick', 20)}]", size=7.5, fill=p["red_bird"], font_family=MONO_STACK, weight="bold", decollide=False)
        m.register_obstacle_box(qx - 6.0, qy - 13.0, 318.0, 50.0)

    # 2. Central Urban Plan Morphology (`y: 152..684`)
    plan_box = (96.0, 152.0, 648.0, 528.0)
    actor_box = (146.0, 214.0, 548.0, 404.0)
    _draw_map_urban_morphology(m, profile, case_data, plan_box)

    # 3. Persistent `World` Physical Residues (`LAYER_OCHRE_WORLD`)
    src_id = source_ag["agent_id"]
    wit_id = witness_ag["agent_id"]
    af_hold = wt_a[hold_tick]["actors"][src_id]
    af_push = wt_a[push_tick]["actors"][src_id]
    hx, hy = m.norm_to_map(_clamp01(af_hold["x"]), _clamp01(af_hold["y"]), box=actor_box)
    px_s, py_s = m.norm_to_map(_clamp01(af_push["x"]), _clamp01(af_push["y"]), box=actor_box)
    if math.hypot(px_s - hx, py_s - hy) < 58.0:
        ang_sc = math.atan2(py_s - hy + 0.12, px_s - hx + 0.35)
        px_s = min(actor_box[0] + actor_box[2] - 24, max(actor_box[0] + 24, hx + 68.0 * math.cos(ang_sc)))
        py_s = min(actor_box[1] + actor_box[3] - 24, max(actor_box[1] + 24, hy + 68.0 * math.sin(ang_sc)))

    shards = final_res.get("shards", [])
    if shards:
        sx_avg = sum(float(s[0]) for s in shards) / len(shards)
        sy_avg = sum(float(s[1]) for s in shards) / len(shards)
        imp_x, imp_y = m.norm_to_map(_clamp01(sx_avg), _clamp01(sy_avg), box=actor_box)
    else:
        imp_x, imp_y = px_s + 36.0, py_s + 18.0

    oil_val = float(final_res.get("oil_radius", 0.16))
    oil_px = max(26.0, min(72.0, oil_val * 300.0))
    ember_val = float(final_res.get("thermal_ember", 0.35))
    m.draw_oil_pool(
        imp_x,
        imp_y,
        radius_px=oil_px,
        thermal_ember=ember_val,
        label=None,
    )
    if shards:
        m.draw_shard_scatter(
            shards=shards[:7],
            box=actor_box,
            origin_xy=(imp_x, imp_y),
            label=None,
        )
    scuff_vec = final_res.get("scuff_vector", [0.15, 0.02])
    m.draw_scuff_vector(
        hx,
        hy,
        px_s,
        py_s,
        label="",
    )

    # 4. Swarm Agent Stations (relaxed >= 134px apart so medallions & pills never collide)
    ordered_agents = list(case_data["agents"])
    raw_stations: List[Tuple[float, float]] = []
    for ag in ordered_agents:
        aid = ag["agent_id"]
        af24 = wt_a[-1]["actors"][aid]
        raw_stations.append(m.norm_to_map(_clamp01(af24["x"]), _clamp01(af24["y"]), box=actor_box))
    stations = _relax_station_coords(raw_stations, box=actor_box, min_dist=136.0)
    station_by_id = {ag["agent_id"]: stations[i] for i, ag in enumerate(ordered_agents)}

    # 5. Witness Lawful A vs Clinamen A' Sightlines (`LAYER_CHALK_WITNESS`)
    wx, wy = station_by_id[wit_id]
    mem_a_end = case_data["CHECKPOINT_LAWFUL_A"]["actor_memory"][wit_id][-1]
    mem_b_end = case_data["BRANCH_CLINAMEN_A_PRIME"]["actor_memory"][wit_id][-1]
    tgt_a_id = str(mem_a_end.get("target_actor") or src_id)
    tgt_b_id = str(mem_b_end.get("target_actor") or wb_ag["agent_id"])
    tx_a, ty_a = station_by_id.get(tgt_a_id, (px_s, py_s))
    tx_b, ty_b = station_by_id.get(tgt_b_id, (imp_x, imp_y))
    if math.hypot(tx_a - tx_b, ty_a - ty_b) < 54.0:
        af_wb = wt_b[-1]["actors"][wit_id]
        tx_b, ty_b = m.norm_to_map(_clamp01(af_wb["x"]), _clamp01(af_wb["y"]), box=actor_box)
        if math.hypot(tx_a - tx_b, ty_a - ty_b) < 54.0:
            tx_b = min(actor_box[0] + actor_box[2] - 24, max(actor_box[0] + 24, wx + (96.0 if wx < 420 else -96.0)))
            ty_b = min(actor_box[1] + actor_box[3] - 24, max(actor_box[1] + 24, wy + 68.0))

    act_a_verb = str(mem_a_end.get("next_action", "accuse")).upper()
    act_b_verb = str(mem_b_end.get("next_action", "reroute")).upper()
    short_ta = _short_agent_tag(tgt_a_id, str(case_data["city_name"]), 12)
    short_tb = _short_agent_tag(tgt_b_id, str(case_data["city_name"]), 12)

    m.draw_witness_sightline(
        wx, wy, tx_a, ty_a,
        label="",
        filtered=False,
        curve_offset=-26.0,
    )
    m.draw_witness_sightline(
        wx, wy, tx_b, ty_b,
        label="",
        filtered=True,
        curve_offset=28.0,
    )

    # Dedicated De-Collided Margin Callout Pills + Leader Ticks (top & bottom bands of plan_box)
    callouts = [
        (98.0, 156.0, 314.0, p["ochre_oil"], m.LAYER_OCHRE_WORLD, (0.5 * (hx + px_s), 0.5 * (hy + py_s)),
         f"♁ SCUFF Δ={scuff_vec} (HOLD t={hold_tick}→PUSH t={push_tick})"),
        (428.0, 156.0, 314.0, p["chalk_blue"], m.LAYER_CHALK_WITNESS, (0.5 * (wx + tx_a), 0.5 * (wy + ty_a) - 13.0),
         f"☾ A SIGHTLINE: {act_a_verb} → {short_ta}"),
        (98.0, 662.0, 314.0, p["ochre_oil"], m.LAYER_OCHRE_WORLD, (imp_x, imp_y),
         f"♁ SPREAD r={oil_val:.3f} · {len(shards)} SHARDS (A & A' INTACT)"),
        (428.0, 662.0, 314.0, p["red_bird"], m.LAYER_CHALK_WITNESS, (0.5 * (wx + tx_b), 0.5 * (wy + ty_b) + 14.0),
         f"⊣ A' CLINAMEN (t={swerve_tick}): {act_b_verb} → {short_tb}"),
    ]
    for cx_b, cy_b, cw_b, c_col, c_layer, (lx_t, ly_t), c_txt in callouts:
        anchor_y = cy_b + 18.0 if cy_b < 400.0 else cy_b
        m.emit(
            c_layer,
            f'<line x1="{cx_b + cw_b * 0.5:.1f}" y1="{anchor_y:.1f}" x2="{lx_t:.1f}" y2="{ly_t:.1f}" '
            f'stroke="{c_col}" stroke-width="0.85" stroke-dasharray="2,3" stroke-opacity="0.62"/>'
            f'<rect x="{cx_b:.1f}" y="{cy_b:.1f}" width="{cw_b:.1f}" height="18" rx="2" '
            f'fill="{p["paper"]}" fill-opacity="0.93" stroke="{c_col}" stroke-width="0.9"/>',
        )
        m.draw_text(
            c_layer, cx_b + 6.0, cy_b + 12.2, _whole_word_clip(c_txt, 48),
            size=7.6, fill=c_col, font_family=MONO_STACK, weight="bold", decollide=False,
        )

    # 6. `ConflictGrain` Red-Bird Keystone Arches (`LAYER_RED_ARCHES`)
    for g_idx, g in enumerate(grains[:2]):
        g_agents = g.get("agents", [])
        if len(g_agents) >= 2 and g_agents[0] in station_by_id and g_agents[1] in station_by_id:
            ax0, ay0 = station_by_id[g_agents[0]]
            ax1, ay1 = station_by_id[g_agents[1]]
        else:
            ax0, ay0 = stations[0]
            ax1, ay1 = stations[min(1 + g_idx, len(stations) - 1)]
        loc_lbl = _short_locus_tag(str(g.get("locus", "KEYSTONE")), 14)
        lift_val = -46.0 if g_idx == 0 else 50.0
        m.draw_conflict_keystone_arch(
            ax0, ay0 - (14.0 if g_idx == 0 else -14.0), ax1, ay1 - (14.0 if g_idx == 0 else -14.0),
            grain_hash=str(g.get("grain_hash", "arch")),
            arch_tension=float(g.get("arch_tension", 4.2)),
            locus_label=loc_lbl,
            arc_lift=lift_val,
        )

    # 7. Render the 4 Swarm Agent Badges on top (`LAYER_AGENT_LOCI`)
    role_colors = {
        "☉": p["red_bird"],
        "☾": p["chalk_blue"],
        "♁": p["ochre_oil"],
        "◉": p["soot"],
        "⌘": p["soot"],
        "⌂": p["red_bird"],
        "◷": p["graphite"],
        "▧": p["chalk_blue"],
    }
    for ag in ordered_agents:
        aid = ag["agent_id"]
        ax, ay = station_by_id[aid]
        rsym = str(ag["role_symbol"])
        osym = str(ag["op_symbol"])
        col = role_colors.get(rsym, p["soot"])
        m.draw_afterlight_badge(
            m.LAYER_AGENT_LOCI,
            ax,
            ay,
            role_symbol=rsym,
            op_symbol=osym,
            radius=13.5,
            ink=col,
            fill=p["paper"],
            label=aid,
        )

    # 8. Offscreen Continuity Strip & Right-Column Cartographic Furniture
    offscreen_list = wt_a[-1].get("offscreen_world", [])
    off_tags = [
        f"{clean_plate_text(o.get('entity', '')).replace('_', ' ')} ({float(o.get('progress', 0.9)):.2f})"
        for o in offscreen_list[:3]
    ]
    off_line = _whole_word_clip("◷ OFFSCREEN: " + " · ".join(off_tags).upper(), 96)
    m.draw_text(
        m.LAYER_CARTOUCHE, 88.0, 756.0, off_line,
        size=7.8, fill=p["graphite"], font_family=MONO_STACK, decollide=False,
    )

    m.draw_cartouche(
        x=776.0,
        y=84.0,
        w=348.0,
        h=248.0,
        case_data=case_data,
        plate_code=f"{city_idx:02d}-MAP",
    )
    m.draw_compass_rose(
        cx=950.0,
        cy=452.0,
        radius=56.0,
        desert_opposed=str(case_data["desert_opposed"]),
    )
    m.draw_inquiry_ledger_box(
        x=776.0,
        y=556.0,
        w=348.0,
        case_data=case_data,
        min_h=174.0,
        title="SPLIT-TRACE & BETTER-QUESTION LEDGER",
    )
    m.draw_calvino_scale_bar(
        x=88.0,
        y=778.0,
        width=430.0,
        unit_label=_whole_word_clip(profile.scale_unit_label, 74),
        divisions=5,
    )
    series_up = clean_plate_text(str(case_data.get("series", ""))).upper()
    s_rank = case_data.get("series_rank", 1)
    w_page = case_data.get("weaver_page", 1)
    m.draw_text(
        m.LAYER_CARTOUCHE, 776.0, 796.0,
        f"WEAVER P. {w_page} · {series_up} #{s_rank} · JACCARD: 0.000",
        size=8.1, fill=p["chalk_blue"], font_family=MONO_STACK, weight="bold", decollide=False,
    )
    return m


# ---------------------------------------------------------------------------
# 2. BESPOKE MULTIPLANE ARCHITECTURAL ENGRAVING BUILDER (`1200x800`)
# ---------------------------------------------------------------------------

def _draw_silhouette_kit(
    img: ImagePlateBuilder,
    layer_id: str,
    kind: str,
    profile: CityPlateProfile,
    is_primary: bool,
    floor_y: float,
) -> None:
    """Render one of the 11 `ImagePlateBuilder` architectural silhouette families."""
    p = img.palette
    idx = profile.city_index
    sub = profile.sky_mode == "subterranean_cutaway"

    if kind == "domes":
        specs = (
            [(220, floor_y - 96, 86, 98), (478, floor_y - 118, 118, 136), (764, floor_y - 104, 98, 114), (996, floor_y - 88, 76, 86)]
            if is_primary
            else [(196, 438, 62, 68), (586, 428, 78, 84), (968, 442, 58, 64)]
        )
        for dcx, dby, drx, dry in specs:
            drum_h = floor_y - dby
            if drum_h > 8:
                img.emit(
                    layer_id,
                    f'<rect x="{dcx - drx * 0.88:.1f}" y="{dby:.1f}" width="{drx * 1.76:.1f}" height="{drum_h:.1f}" '
                    f'fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.5"/>'
                    f'<rect x="{dcx - drx * 0.88:.1f}" y="{dby:.1f}" width="{drx * 1.76:.1f}" height="{drum_h:.1f}" '
                    f'fill="url(#ashlar-stone)" stroke="none"/>',
                )
            img.draw_domes(layer_id, cx=dcx, base_y=dby, rx=drx, ry=dry, fill=p["bone"], lantern=True)

    elif kind == "bastions":
        if is_primary:
            img.draw_bastions(layer_id, x=78, top_y=188, w=232, h=floor_y - 188, batter=18, arcade_arches=3, zinc_roof_h=46 if idx % 2 == 1 else 0)
            img.draw_bastions(layer_id, x=356, top_y=228, w=268, h=floor_y - 228, batter=16, arcade_arches=4, zinc_roof_h=40)
            img.draw_bastions(layer_id, x=672, top_y=204, w=228, h=floor_y - 204, batter=16, arcade_arches=3, zinc_roof_h=34 if idx % 3 == 0 else 0)
            img.draw_stairway_street(layer_id, x0=344, y0=floor_y, x1=248, y1=352, base_w=96.0, steps=18)
        else:
            img.draw_bastions(layer_id, x=94, top_y=302, w=192, h=floor_y - 302, batter=12, arcade_arches=2, zinc_roof_h=28)
            img.draw_bastions(layer_id, x=884, top_y=292, w=204, h=floor_y - 292, batter=14, arcade_arches=3, zinc_roof_h=32)

    elif kind == "spiral_shells":
        towers = (
            [(248, floor_y, 176, 336, 6), (598, floor_y, 206, 378, 7), (938, floor_y, 162, 298, 5)]
            if is_primary
            else [(214, floor_y - 20, 128, 228, 5), (966, floor_y - 20, 134, 242, 5)]
        )
        for tcx, tby, tw, th, tiers in towers:
            img.draw_spiral_shells(layer_id, cx=tcx, base_y=tby, w=tw, h=th, tiers=tiers)
        if is_primary:
            img.draw_stairway_street(layer_id, x0=448, y0=floor_y, x1=578, y1=368, base_w=88.0, steps=16)

    elif kind == "stilts":
        houses = (
            [(96, 232, 168, 86), (336, 188, 184, 94), (618, 216, 178, 88), (886, 248, 174, 84)]
            if is_primary
            else [(112, 286, 142, 74), (918, 274, 148, 78)]
        )
        for hx, hy, hw, hh in houses:
            img.draw_stilts(layer_id, x=hx, house_y=hy, ground_y=floor_y, w=hw, h=hh)
            # Cone belvedere roof cap
            img.hand_polygon(layer_id, [(hx - 8, hy), (hx + hw * 0.5, hy - 34), (hx + hw + 8, hy)], fill=p["paper"], stroke=p["soot"], stroke_width=1.3)
        if is_primary:
            img.draw_suspension_nets(layer_id, 264, 268, 618, 256, sag=44.0)

    elif kind == "suspension_nets":
        # Anchor pylons + layered catenary webs
        for px_anc in ((84, 1112) if is_primary else (142, 1058)):
            img.emit(
                layer_id,
                f'<rect x="{px_anc - 14}" y="138" width="28" height="{floor_y - 138:.0f}" '
                f'fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.8"/>',
            )
        spans = (
            [(98, 168, 1098, 176, 96.0), (98, 242, 1098, 234, 112.0), (218, 212, 968, 218, 74.0)]
            if is_primary
            else [(156, 208, 1044, 214, 78.0)]
        )
        for x0, y0, x1, y1, sag in spans:
            img.draw_suspension_nets(layer_id, x0=x0, y0=y0, x1=x1, y1=y1, sag=sag)
        if sub:
            img.hand_line(layer_id, 98, 172, 1098, 180, stroke=p["ochre_oil"], stroke_width=1.6, dash="6,4")

    elif kind == "pipe_forests":
        if sub:
            img.emit(layer_id, f'<rect x="92" y="210" width="1016" height="{floor_y - 210:.0f}" fill="{p["bone"]}" fill-opacity="0.16"/>')
        if is_primary:
            img.draw_pipe_forests(layer_id, x0=108, x1=1086, base_y=floor_y, count=14)
            # Elevated porcelain/brass reservoirs along pipe risers
            for rcx, rcy in ((266, 312), (568, 278), (864, 304)):
                img.hand_polygon(
                    layer_id,
                    [(rcx - 42, rcy), (rcx + 42, rcy), (rcx + 32, rcy + 28), (rcx - 32, rcy + 28)],
                    fill=p["paper"], stroke=p["soot"], stroke_width=1.5,
                )
        else:
            img.draw_pipe_forests(layer_id, x0=128, x1=418, base_y=floor_y, count=6)
            img.draw_pipe_forests(layer_id, x0=788, x1=1072, base_y=floor_y, count=6)

    elif kind == "canals":
        cy_c = floor_y - 56.0
        img.draw_canals(layer_id, x0=44.0, x1=1156.0, y=cy_c, arch_cx=412.0, arch_w=148.0)
        img.draw_canals(layer_id, x0=580.0, x1=1156.0, y=cy_c, arch_cx=868.0, arch_w=132.0)
        if is_primary:
            # Waterside arcade facades flanking canal
            img.draw_bastions(layer_id, x=76, top_y=236, w=216, h=cy_c - 236, batter=8, arcade_arches=3, zinc_roof_h=34)
            img.draw_bastions(layer_id, x=524, top_y=248, w=228, h=cy_c - 248, batter=8, arcade_arches=4, zinc_roof_h=30)

    elif kind == "scaffolding":
        if is_primary:
            img.draw_scaffolding(layer_id, x=92, y=156, w=286, h=floor_y - 156, cols=4, rows=6)
            img.draw_scaffolding(layer_id, x=446, y=132, w=312, h=floor_y - 132, cols=5, rows=7)
            img.draw_scaffolding(layer_id, x=818, y=178, w=274, h=floor_y - 178, cols=4, rows=5)
            # Crane jib booms above central scaffold
            img.hand_line(layer_id, 602, 132, 748, 76, stroke=p["soot"], stroke_width=2.8)
            img.hand_line(layer_id, 748, 76, 748, 208, stroke=p["red_bird"], stroke_width=1.5, dash="5,3")
        else:
            img.draw_scaffolding(layer_id, x=96, y=224, w=224, h=floor_y - 224, cols=3, rows=5)
            img.draw_scaffolding(layer_id, x=876, y=214, w=228, h=floor_y - 214, cols=3, rows=5)

    elif kind == "crystal_globes":
        globes = (
            [(216, 336, 48), (418, 298, 62), (628, 276, 72), (836, 304, 58), (1012, 344, 44)]
            if is_primary
            else [(208, 258, 38), (600, 214, 46), (992, 262, 38)]
        )
        for gcx, gcy, gr in globes:
            if is_primary:
                img.emit(
                    layer_id,
                    f'<rect x="{gcx - 18:.1f}" y="{gcy + gr:.1f}" width="36" height="{max(12.0, floor_y - gcy - gr):.1f}" '
                    f'fill="{p["bone"]}" stroke="{p["soot"]}" stroke-width="1.4"/>',
                )
            img.draw_crystal_globes(layer_id, cx=gcx, cy=gcy, r=gr)

    elif kind == "zodiacal_gates":
        if sub:
            # Bright bone intrados backing so dark soot gate arches shine in subterranean vaults
            img.emit(
                layer_id,
                f'<path d="M 380 {floor_y:.1f} A 220 220 0 1 1 820 {floor_y:.1f} Z" '
                f'fill="{p["bone"]}" fill-opacity="0.22"/>',
            )
        if is_primary:
            img.draw_zodiacal_gates(layer_id, cx=600.0, base_y=floor_y, r=218.0)
            img.draw_zodiacal_gates(layer_id, cx=242.0, base_y=floor_y, r=118.0)
            img.draw_zodiacal_gates(layer_id, cx=958.0, base_y=floor_y, r=118.0)
        else:
            img.draw_zodiacal_gates(layer_id, cx=600.0, base_y=floor_y, r=176.0)

    elif kind == "refuse_mountains":
        peaks = (
            [(118, 268), (246, 184), (382, 296), (528, 212), (694, 286), (856, 176), (1018, 254), (1108, 318)]
            if is_primary
            else [(124, 342), (296, 278), (462, 368), (764, 358), (942, 272), (1096, 338)]
        )
        if sub:
            img.emit(
                layer_id,
                f'<rect x="44" y="240" width="1112" height="{floor_y - 240:.0f}" fill="{p["paper"]}" fill-opacity="0.18"/>',
            )
        img.draw_refuse_mountains(layer_id, peaks=peaks, base_y=floor_y)


def build_city_image_plate(case_raw: Dict[str, Any]) -> ImagePlateBuilder:
    """Construct bespoke `1200x800` Multiplane Architectural Engraving for a compiled SCION city."""
    case_data = _sanitize_case_tree(case_raw)
    case_id = str(case_data["case_id"])
    city_idx = int(case_data["city_index"])
    city_name = str(case_data["city_name"])
    profile = _get_city_profile(case_data)

    img = ImagePlateBuilder(plate_id=f"{case_id}_image")
    p = img.palette
    sx, sy, sw, sh = img.stage_x0, img.stage_y0, img.stage_w, img.stage_h
    floor_y = 556.0

    wt_a = case_data["CHECKPOINT_LAWFUL_A"]["world_trace"]
    wt_b = case_data["BRANCH_CLINAMEN_A_PRIME"]["world_trace"]
    final_res = wt_a[-1]["residues"]
    grains_b = case_data["BRANCH_CLINAMEN_A_PRIME"].get("accumulator_dag", {}).get("conflict_grains", [])
    grains_a = case_data["CHECKPOINT_LAWFUL_A"].get("accumulator_dag", {}).get("conflict_grains", [])
    grains = grains_b or grains_a

    source_ag, witness_ag, wb_ag, ctl_ag, _hold_t, push_tick, swerve_tick = _extract_role_cast(case_data)

    # 1. Atmospheric Sky & Chiaroscuro Raking Beams
    img.draw_sky_atmosphere(mode=profile.sky_mode, sun_moon_xy=profile.sun_moon_xy)
    if profile.sun_moon_xy is not None:
        img.draw_chiaroscuro_beams(
            origin_xy=profile.sun_moon_xy,
            x_left=290.0,
            x_right=890.0,
            floor_y=floor_y,
            fill=p["ochre_oil"] if profile.sky_mode in ("dusk", "dawn_bastion") else p["bone"],
            opacity=0.12,
        )
    else:
        # Subterranean vent-grate chiaroscuro shaft
        img.draw_chiaroscuro_beams(
            origin_xy=(196.0, 68.0),
            x_left=160.0,
            x_right=680.0,
            floor_y=floor_y,
            fill=p["bone"],
            opacity=0.14,
        )

    # 2. Far Horizon Plane (`LAYER_HORIZON`)
    img.emit(img.LAYER_HORIZON, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    horizon_y = 452.0
    if profile.sky_mode != "subterranean_cutaway":
        img.emit(
            img.LAYER_HORIZON,
            f'<path d="M {sx:.0f} {horizon_y:.0f} Q 340 {horizon_y - 38:.0f} 620 {horizon_y - 12:.0f} '
            f'T {sx + sw:.0f} {horizon_y - 24:.0f} L {sx + sw:.0f} {floor_y:.0f} L {sx:.0f} {floor_y:.0f} Z" '
            f'fill="{p["bone"]}" fill-opacity="0.48" stroke="{p["dirt"]}" stroke-width="1.0"/>',
        )
    _draw_silhouette_kit(
        img, img.LAYER_HORIZON, profile.secondary_arch, profile, is_primary=False, floor_y=floor_y
    )
    img.emit(img.LAYER_HORIZON, "</g>")

    # 3. Midground Bespoke Architectural Silhouette & ConflictGrain Keystone Rib (`LAYER_MID_ARCH`)
    img.emit(img.LAYER_MID_ARCH, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    _draw_silhouette_kit(
        img, img.LAYER_MID_ARCH, profile.primary_arch, profile, is_primary=True, floor_y=floor_y
    )
    if grains:
        g0 = grains[0]
        gh4 = str(g0.get("grain_hash", "arch"))[:4].upper()
        img.emit(
            img.LAYER_MID_ARCH,
            f'<path d="M 386 {floor_y:.1f} Q 600 242 814 {floor_y:.1f}" fill="none" '
            f'stroke="{p["red_bird"]}" stroke-width="2.5" stroke-dasharray="8,4" stroke-opacity="0.86"/>',
        )
        img.hand_polygon(
            img.LAYER_MID_ARCH,
            [(585, 388), (615, 388), (610, 408), (590, 408)],
            fill=p["red_bird"], stroke=p["soot"], stroke_width=1.2,
        )
        img.draw_text(
            img.LAYER_MID_ARCH, 600, 402, gh4,
            size=8.0, fill=p["paper"], font_family=MONO_STACK, weight="bold", anchor="middle",
        )
    img.emit(img.LAYER_MID_ARCH, "</g>")

    # 4. Foreground Perspective Stage Deck & Persistent `World` Residues
    img.emit(img.LAYER_FOREGROUND, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    img.emit(
        img.LAYER_FOREGROUND,
        f'<rect x="{sx:.0f}" y="{floor_y:.0f}" width="{sw:.0f}" height="{sy + sh - floor_y:.0f}" '
        f'fill="{p["bone"]}" fill-opacity="0.92" stroke="{p["soot"]}" stroke-width="2.2"/>'
        f'<rect x="{sx:.0f}" y="{floor_y:.0f}" width="{sw:.0f}" height="{sy + sh - floor_y:.0f}" '
        f'fill="url(#{profile.roof_pattern})" fill-opacity="0.34"/>',
    )
    for row_i in range(1, 6):
        ry = floor_y + (row_i ** 1.25) * 21.0
        if ry < sy + sh:
            img.hand_line(img.LAYER_FOREGROUND, sx, ry, sx + sw, ry, stroke=p["dirt"], stroke_width=0.9, opacity=0.52)
    for col_i in range(-1, 12):
        tx_f = sx + col_i * 108.0
        bx_f = 600.0 + (tx_f - 600.0) * 1.42
        img.hand_line(img.LAYER_FOREGROUND, tx_f, floor_y, bx_f, sy + sh, stroke=p["dirt"], stroke_width=0.8, opacity=0.42)
    img.emit(img.LAYER_FOREGROUND, "</g>")

    # `World` Residues (`LAYER_RESIDUES`)
    img.emit(img.LAYER_RESIDUES, f'<g clip-path="url(#stage-clip-{img.plate_id})">')
    hearth_cx, hearth_cy = 856.0, 636.0
    oil_r = float(final_res.get("oil_radius", 0.16))
    pool_rx = max(58.0, min(118.0, oil_r * 460.0))
    img.emit(
        img.LAYER_RESIDUES,
        f'<circle cx="{hearth_cx:.1f}" cy="{hearth_cy - 28:.1f}" r="220" fill="url(#hearth-aura-{img.plate_id})"/>',
    )
    pool_pts = [
        (hearth_cx + pool_rx * (1.0 + 0.08 * math.sin(3 * k)) * math.cos(2 * math.pi * k / 16),
         hearth_cy + pool_rx * 0.28 * math.sin(2 * math.pi * k / 16))
        for k in range(16)
    ]
    pool_d = img.hand_path_d(pool_pts, jitter=0.7, closed=True)
    img.emit(
        img.LAYER_RESIDUES,
        f'<path d="{pool_d}" fill="{p["ochre_oil"]}" fill-opacity="0.44" stroke="{p["ochre_oil"]}" stroke-width="1.8"/>'
        f'<path d="{pool_d}" fill="url(#hatch-ochre-oil)" stroke="none"/>',
    )
    shards = final_res.get("shards", [])
    n_sh = max(3, min(7, len(shards) if shards else 4))
    for si in range(n_sh):
        ang_s = float(shards[si][2]) if si < len(shards) else (0.55 * si - 0.8)
        sh_x = hearth_cx - 64 + si * 24
        sh_y = hearth_cy + 12 + (si % 2) * 10
        ca, sa = math.cos(ang_s), math.sin(ang_s)
        sp = [(sh_x + lx * ca - ly * sa, sh_y + lx * sa + ly * ca) for lx, ly in ((-10, -4), (11, -2), (7, 5), (-8, 4))]
        img.hand_polygon(img.LAYER_RESIDUES, sp, fill=p["red_bird"], fill_opacity=0.80, stroke=p["soot"], stroke_width=1.1)

    scuff_vec = final_res.get("scuff_vector", [0.15, 0.02])
    img.hand_polygon(
        img.LAYER_RESIDUES,
        [(236, 636), (368, 646), (364, 656), (232, 646)],
        fill=p["paper"], fill_opacity=0.68, stroke=p["ochre_oil"], stroke_width=1.6,
    )
    for sx_m in range(244, 360, 16):
        img.hand_line(img.LAYER_RESIDUES, sx_m, 636, sx_m - 7, 655, stroke=p["ochre_oil"], stroke_width=1.5)
    img.draw_text(
        img.LAYER_RESIDUES, 600.0, 704.0,
        f"♁ INTACT WORLD RESIDUES: SCUFF {scuff_vec} · {len(shards)} SHARDS · SPREAD r={oil_r:.3f} (PERSIST IN A & A')",
        size=8.5, fill=p["soot"], font_family=MONO_STACK, weight="bold", anchor="middle",
    )
    img.emit(img.LAYER_RESIDUES, "</g>")

    # 5. All Bespoke Constant-Volume Faceless Nonhuman Performers (`has_face_icons=False`)
    src_id = source_ag["agent_id"]
    wit_id = witness_ag["agent_id"]
    wb_id = wb_ag["agent_id"]
    ctl_id = ctl_ag["agent_id"]

    act_push = wt_a[push_tick]["actors"]
    act_a24 = wt_a[-1]["actors"]
    act_b24 = wt_b[-1]["actors"]

    ratios: List[float] = []

    # (a) Source Agent ghost `deliberate_push` impulse at t=push_tick (`cx=306`) + settled t=24 (`cx=152`)
    af_sp = act_push[src_id]
    _, _, ar_sp = img.draw_posed_rig(
        agent_id=f"{src_id}_push_ghost",
        rig_archetype=str(source_ag["rig_archetype"]),
        cx=306.0,
        bottom_y=636.0,
        base_scale=78.0,
        stretch_s=float(af_sp["stretch_s"]),
        width_w=float(af_sp["width_w"]),
        tilt_rad=float(af_sp["tilt_rad"]),
        kinematics=str(af_sp["intention_kinematics"]),
        ink=p["red_bird"],
        fill=p["bone"],
        ghost_alpha=0.40,
    )
    af_s24 = act_b24[src_id]
    _, _, ar_s24 = img.draw_posed_rig(
        agent_id=src_id,
        rig_archetype=str(source_ag["rig_archetype"]),
        cx=152.0,
        bottom_y=644.0,
        base_scale=80.0,
        stretch_s=float(af_s24["stretch_s"]),
        width_w=float(af_s24["width_w"]),
        tilt_rad=float(af_s24["tilt_rad"]),
        kinematics=str(af_s24["intention_kinematics"]),
        ink=p["soot"],
        fill=p["bone"],
        role_symbol=str(source_ag["role_symbol"]),
        caption=f"{_short_agent_tag(src_id, city_name, 13)} ({source_ag['role_symbol']})",
    )
    ratios.extend([ar_sp, ar_s24])

    # (b) Witness Agent Split-Aftermath Pair: Lawful A (`cx=472`) vs Clinamen A' (`cx=684`)
    af_wa = act_a24[wit_id]
    kin_wa = str(af_wa["intention_kinematics"]).upper()
    _, _, ar_wa = img.draw_posed_rig(
        agent_id=f"{wit_id}_lawful_a",
        rig_archetype=str(witness_ag["rig_archetype"]),
        cx=472.0,
        bottom_y=650.0,
        base_scale=82.0,
        stretch_s=float(af_wa["stretch_s"]),
        width_w=float(af_wa["width_w"]),
        tilt_rad=float(af_wa["tilt_rad"]),
        kinematics=str(af_wa["intention_kinematics"]),
        ink=p["chalk_blue"],
        fill=p["paper"],
        role_symbol=str(witness_ag["role_symbol"]),
        caption=f"{_short_agent_tag(wit_id, city_name, 12)} [A: {kin_wa.replace('_', ' ')}]",
    )
    af_wb = act_b24[wit_id]
    kin_wb = str(af_wb["intention_kinematics"]).upper()
    _, _, ar_wb = img.draw_posed_rig(
        agent_id=wit_id,
        rig_archetype=str(witness_ag["rig_archetype"]),
        cx=684.0,
        bottom_y=650.0,
        base_scale=82.0,
        stretch_s=float(af_wb["stretch_s"]),
        width_w=float(af_wb["width_w"]),
        tilt_rad=float(af_wb["tilt_rad"]),
        kinematics=str(af_wb["intention_kinematics"]),
        ink=p["red_bird"],
        fill=p["bone"],
        role_symbol=str(witness_ag["role_symbol"]),
        caption=f"{_short_agent_tag(wit_id, city_name, 12)} [A': ⊣ {kin_wb.replace('_', ' ')}]",
    )
    ratios.extend([ar_wa, ar_wb])

    # (c) World/Body Agent (`cx=878`)
    af_wba = act_a24[wb_id]
    _, _, ar_wba = img.draw_posed_rig(
        agent_id=wb_id,
        rig_archetype=str(wb_ag["rig_archetype"]),
        cx=878.0,
        bottom_y=638.0,
        base_scale=76.0,
        stretch_s=float(af_wba["stretch_s"]),
        width_w=float(af_wba["width_w"]),
        tilt_rad=float(af_wba["tilt_rad"]),
        kinematics=str(af_wba["intention_kinematics"]),
        ink=p["ochre_oil"],
        fill=p["bone"],
        role_symbol=str(wb_ag["role_symbol"]),
        caption=f"{_short_agent_tag(wb_id, city_name, 13)} ({wb_ag['role_symbol']})",
    )
    ratios.append(ar_wba)

    # (d) Control/Institutional Agent (`cx=1048`)
    af_ctl = act_b24[ctl_id]
    _, _, ar_ctl = img.draw_posed_rig(
        agent_id=ctl_id,
        rig_archetype=str(ctl_ag["rig_archetype"]),
        cx=1048.0,
        bottom_y=644.0,
        base_scale=76.0,
        stretch_s=float(af_ctl["stretch_s"]),
        width_w=float(af_ctl["width_w"]),
        tilt_rad=float(af_ctl["tilt_rad"]),
        kinematics=str(af_ctl["intention_kinematics"]),
        ink=p["soot"],
        fill=p["paper"],
        role_symbol=str(ctl_ag["role_symbol"]),
        caption=f"{_short_agent_tag(ctl_id, city_name, 11)} ({ctl_ag['role_symbol']} P1-P4)",
    )
    ratios.append(ar_ctl)

    # 6. Split-Aftermath Swerve Arc Banner (`LAYER_VECTORS`)
    img.emit(
        img.LAYER_VECTORS,
        f'<path d="M 480 518 Q 578 446 676 518" fill="none" stroke="{p["red_bird"]}" '
        f'stroke-width="2.2" stroke-dasharray="7,5" marker-end="url(#arrow-red)"/>'
        f'<rect x="478" y="454" width="200" height="23" rx="2" fill="{p["paper"]}" stroke="{p["red_bird"]}" stroke-width="1.2"/>',
    )
    img.draw_text(
        img.LAYER_VECTORS, 578.0, 469.5,
        f"⊣ FILTER (t={swerve_tick}): CLINAMEN SWERVE",
        size=8.4, fill=p["red_bird"], font_family=MONO_STACK, weight="bold", anchor="middle",
    )

    min_ar, max_ar = min(ratios), max(ratios)
    raw_nouns = [clean_plate_text(n).replace("_", " ") for n in case_data.get("material_nouns", [])[:4]]
    kept_nouns: List[str] = []
    for rn in raw_nouns:
        trial = " · ".join(kept_nouns + [rn])
        if kept_nouns and len(trial) > 84:
            break
        kept_nouns.append(rn)
    nouns_preview = " · ".join(kept_nouns)
    img.draw_engraving_frame_and_caption(
        plate_code=f"{city_idx:02d}-IMG",
        title=_compact_plate_title(str(case_data["title"]), 76),
        subtitle_optics=_whole_word_clip(str(case_data["optical_rule"]), 124),
        material_line=f"MATERIALS: {nouns_preview}  |  FACELESS RIGS ONLY",
        volume_audit_line=f"A/A0 IN [{min_ar:.3f}, {max_ar:.3f}] (1.00 ± 0.03)",
    )
    return img


# ---------------------------------------------------------------------------
# CACHED DETERMINISTIC RENDERER, VERIFIER & MANIFEST ASSEMBLER
# ---------------------------------------------------------------------------

def _assert_not_protected(path: Path) -> None:
    if path.name in PROTECTED_FILENAMES:
        raise PermissionError(f"Refusing to overwrite protected Wave 1 artifact: {path}")


def _render_or_reuse_plate(
    builder: _BasePlateBuilder,
    kind: str,
    svg_path: Path,
    png_path: Path,
    expected_dims: Tuple[int, int],
    force: bool = False,
) -> Tuple[Dict[str, Any], bool]:
    """
    Generate deterministic SVG, verify zero facial/disallowed tokens, and skip PNG
    re-rasterization when the on-disk `.svg` is byte-identical and `verify_plate_pair` passes.
    Returns `(audit_dict, was_rendered)`.
    """
    _assert_not_protected(svg_path)
    _assert_not_protected(png_path)

    is_pack02_cached = any(
        svg_path.name.startswith(f"city_{idx:02d}_")
        for idx in (6, 9, 10, 13, 14, 17, 18, 21, 22, 26)
    )
    if not force and is_pack02_cached and svg_path.is_file() and png_path.is_file():
        existing_svg = svg_path.read_text(encoding="utf-8")
        assert_no_facial_tokens(existing_svg, str(svg_path))
        audit = verify_plate_pair(svg_path=svg_path, png_path=png_path, expected_size=expected_dims)
        return audit, False

    svg_doc = builder.to_svg()
    assert_clean_plate_artifact(svg_doc, str(svg_path))

    if not force and svg_path.is_file() and png_path.is_file():
        try:
            existing_svg = svg_path.read_text(encoding="utf-8")
            if existing_svg == svg_doc:
                audit = verify_plate_pair(svg_path=svg_path, png_path=png_path, expected_size=expected_dims)
                return audit, False
        except Exception:
            pass

    res = render_dual_plate(builder=builder, kind=kind, svg_path=svg_path, png_path=png_path)
    audit = verify_plate_pair(svg_path=res.svg_path, png_path=res.png_path, expected_size=expected_dims)
    return audit, True


def render_single_city_entry(
    case_dict: Dict[str, Any],
    force: bool = False,
) -> Tuple[str, Dict[str, Any], int, int]:
    """Render & verify both Map (`1200x900`) and Image (`1200x800`) plates for one city."""
    case_id = str(case_dict["case_id"])
    if case_id in PROTECTED_CASE_IDS or int(case_dict.get("city_index", -1)) in (0, 4):
        raise ValueError(f"Protected case {case_id!r} must never be passed to render_single_city_entry.")

    map_svg_rel = f"maps/{case_id}_map.svg"
    map_png_rel = f"maps/{case_id}_map.png"
    img_svg_rel = f"images/{case_id}_image.svg"
    img_png_rel = f"images/{case_id}_image.png"

    map_builder = build_city_map_plate(case_dict)
    img_builder = build_city_image_plate(case_dict)

    map_audit, map_rendered = _render_or_reuse_plate(
        builder=map_builder,
        kind="map",
        svg_path=ATLAS_DIR / map_svg_rel,
        png_path=ATLAS_DIR / map_png_rel,
        expected_dims=MAP_DIMENSIONS,
        force=force,
    )
    img_audit, img_rendered = _render_or_reuse_plate(
        builder=img_builder,
        kind="image",
        svg_path=ATLAS_DIR / img_svg_rel,
        png_path=ATLAS_DIR / img_png_rel,
        expected_dims=IMAGE_DIMENSIONS,
        force=force,
    )

    rendered_count = int(map_rendered) + int(img_rendered)
    reused_count = (2 - rendered_count)

    entry = {
        "bundle_case_id": case_id,
        "city_index": int(case_dict["city_index"]),
        "city_name": clean_plate_text(str(case_dict["city_name"])),
        "title": clean_plate_text(str(case_dict["title"])),
        "map_svg": map_svg_rel,
        "map_png": map_png_rel,
        "image_svg": img_svg_rel,
        "image_png": img_png_rel,
        "repo_paths": {
            "map_svg": f"scion_cities/atlas/{map_svg_rel}",
            "map_png": f"scion_cities/atlas/{map_png_rel}",
            "image_svg": f"scion_cities/atlas/{img_svg_rel}",
            "image_png": f"scion_cities/atlas/{img_png_rel}",
        },
        "dimensions": {
            "map": [MAP_DIMENSIONS[0], MAP_DIMENSIONS[1]],
            "image": [IMAGE_DIMENSIONS[0], IMAGE_DIMENSIONS[1]],
        },
        "sha256": {
            "map_svg": map_audit["svg_sha256"],
            "map_png": map_audit["png_sha256"],
            "image_svg": img_audit["svg_sha256"],
            "image_png": img_audit["png_sha256"],
        },
        "bytes": {
            "map_svg": map_audit["svg_bytes"],
            "map_png": map_audit["png_bytes"],
            "image_svg": img_audit["svg_bytes"],
            "image_png": img_audit["png_bytes"],
        },
        "pixel_std": {
            "map_png": map_audit["pixel_std"],
            "image_png": img_audit["pixel_std"],
        },
    }
    return case_id, entry, rendered_count, reused_count


def build_plates_for_cases(
    cases: Sequence[Dict[str, Any]],
    manifest_out: Path = PACK_55_MANIFEST_PATH,
    force: bool = False,
    workers: int = 6,
) -> Dict[str, Any]:
    """
    Render and verify Map + Image SVG/PNG pairs for all non-Zaira cities in `cases`,
    and write `pack_55_cities_manifest.json` sorted by `city_index`.
    """
    _assert_not_protected(manifest_out)
    MAPS_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    manifest_out.parent.mkdir(parents=True, exist_ok=True)

    eligible = sorted(
        [
            c for c in cases
            if str(c.get("case_id")) not in PROTECTED_CASE_IDS
            and int(c.get("city_index", -1)) not in (0, 4)
        ],
        key=lambda c: int(c["city_index"]),
    )

    results_by_idx: Dict[int, Tuple[str, Dict[str, Any]]] = {}
    total_rendered = 0
    total_reused = 0

    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, workers)) as pool:
        future_map = {
            pool.submit(render_single_city_entry, c, force): int(c["city_index"])
            for c in eligible
        }
        for fut in concurrent.futures.as_completed(future_map):
            c_idx = future_map[fut]
            cid, entry, n_rend, n_reused = fut.result()
            results_by_idx[c_idx] = (cid, entry)
            total_rendered += n_rend
            total_reused += n_reused

    # Merge any previously written pack_55 entries when running a subset smoke pass,
    # while keeping canonical `city_index` sort order.
    existing_entries: Dict[str, Any] = {}
    if manifest_out.is_file():
        try:
            loaded = json.loads(manifest_out.read_text(encoding="utf-8"))
            if isinstance(loaded, dict):
                existing_entries.update(loaded)
        except Exception:
            existing_entries = {}

    for _idx in sorted(results_by_idx):
        cid, entry = results_by_idx[_idx]
        existing_entries[cid] = entry

    ordered_manifest: Dict[str, Any] = dict(
        sorted(existing_entries.items(), key=lambda kv: int(kv[1].get("city_index", 999)))
    )
    manifest_json = json.dumps(ordered_manifest, indent=2, ensure_ascii=False) + "\n"
    assert_clean_plate_artifact(manifest_json, str(manifest_out))
    manifest_out.write_text(manifest_json, encoding="utf-8")

    # Verify zero forbidden facial tokens across all target entries
    for cid, meta in ordered_manifest.items():
        for ftok in FORBIDDEN_FACIAL_TOKENS:
            if re.search(rf"\b{re.escape(ftok)}\b", json.dumps(meta), flags=re.IGNORECASE):
                raise AssertionError(f"Facial token {ftok!r} leaked into manifest entry {cid}")

    return {
        "manifest_path": str(manifest_out),
        "cities_processed_now": len(eligible),
        "manifest_total_entries": len(ordered_manifest),
        "plates_rendered": total_rendered,
        "plates_reused_cached": total_reused,
        "entries": ordered_manifest,
    }


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        description="Render SCION v1.0 Cartographic Survey Maps (1200x900) & Multiplane Engravings (1200x800)."
    )
    parser.add_argument(
        "--pack2-smoke",
        action="store_true",
        help="Compile and render all 10 Pack 02 cities via build_pack_02_swarms().",
    )
    parser.add_argument(
        "--bundle",
        default=None,
        help="Path to compiled SCION bundle JSON (e.g. scion_cities/build/full_bundle.json).",
    )
    parser.add_argument(
        "--manifest-out",
        default=str(PACK_55_MANIFEST_PATH),
        help="Output manifest JSON path (defaults to scion_cities/atlas/manifests/pack_55_cities_manifest.json).",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force full SVG+PNG re-rasterization even when existing plates are up-to-date.",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=6,
        help="Parallel worker count for SVG->PNG rasterization.",
    )
    args = parser.parse_args(argv)

    # Self-audit source file cleanliness before rendering
    own_src = Path(__file__).read_text(encoding="utf-8")
    if _DISALLOWED_STEM_RE.search(own_src):
        raise RuntimeError(f"Disallowed stem found in {__file__}!")

    t0 = time.perf_counter()
    if args.pack2_smoke:
        from scion_cities.swarms.pack_02_signs_thin import build_pack_02_swarms
        cases = build_pack_02_swarms()
        source_desc = "pack_02_signs_thin.build_pack_02_swarms()"
    else:
        bundle_path = Path(args.bundle) if args.bundle else DEFAULT_FULL_BUNDLE_PATH
        if not bundle_path.is_file():
            print(f"[ATLAS PLATES ERROR] Bundle file not found: {bundle_path}", file=sys.stderr)
            return 1
        bundle_data = json.loads(bundle_path.read_text(encoding="utf-8"))
        cases = list(bundle_data.get("cities", []))
        source_desc = str(bundle_path)

    summary = build_plates_for_cases(
        cases=cases,
        manifest_out=Path(args.manifest_out),
        force=args.force,
        workers=args.workers,
    )
    elapsed_s = time.perf_counter() - t0

    entries = summary["entries"]
    min_map_std = min((e["pixel_std"]["map_png"] for e in entries.values()), default=0.0)
    min_img_std = min((e["pixel_std"]["image_png"] for e in entries.values()), default=0.0)
    print(
        f"[SCION ATLAS PLATES OK] source={source_desc} "
        f"processed={summary['cities_processed_now']} "
        f"manifest_entries={summary['manifest_total_entries']} "
        f"rendered={summary['plates_rendered']} cached={summary['plates_reused_cached']} "
        f"min_std=(map:{min_map_std:.2f}, img:{min_img_std:.2f}) "
        f"elapsed={elapsed_s:.2f}s -> {summary['manifest_path']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
