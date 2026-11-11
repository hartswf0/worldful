#!/usr/bin/env python3
"""
SCION v1.0 Unified Archival Atlas Plate Orchestrator (`scion_cities/atlas/all_plates.py`).

Generates, verifies, and indexes handmade archival `.svg` + `.png` Cartographic
Survey Maps (`1200x900`) and Multiplane Architectural Section/Elevation Images
(`1200x800`) for EVERY compiled case in a SCION bundle (`proof_case` + all
compiled `cities`):

  1. Reuses `proof_plates.py` builders (`build_abominable_cellar_map`,
     `build_abominable_cellar_image`, `build_zaira_map`, `build_zaira_image`)
     and verified Wave 1 artifacts for `flour_test_abominable_cellar` /
     `case_00_abominable_cellar` (`city_index == 0`) and `city_04_zaira`
     (`city_index == 4`).
  2. Synthesizes rich topology- and emblem-specific Cartographic Survey Maps
     and Architectural Section/Elevation plates for each of the other 54
     canonical cities (`#01..#03` and `#05..#55`) via `build_all_55_plates.py`,
     driven directly by each city's `world_trace`, `loci`, `agents`,
     `residues`, `rule_ledger`, `conflict_grains`, and `series` topology,
     rasterized in parallel across worker threads invoking `rsvg-convert`.
  3. Independently validates every single Map (`1200x900`) and Image
     (`1200x800`) SVG+PNG pair through `verify_plate_pair` from
     `plate_engine.py`, plus anti-facial and lexical cleanliness checks.
  4. Writes `/Users/gaia/WORLDFUL/scion_cities/atlas/manifest.json` keyed so
     BOTH `"case_00_abominable_cellar"` AND `"flour_test_abominable_cellar"`
     resolve directly alongside `"city_04_zaira"` and all compiled
     `"city_XX_<slug>"` identifiers for `atlas_shell.html` and
     `workbench_shell.html`, while keeping `atlas/manifests/*.json` synchronized.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import copy
import json
import os
import re
import sys
import time
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Sequence, Tuple

REPO_ROOT = Path(__file__).resolve().parents[2]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from scion_cities.atlas.plate_engine import (  # noqa: E402
    FORBIDDEN_FACIAL_TOKENS,
    IMAGE_DIMENSIONS,
    MAP_DIMENSIONS,
    PlateRenderResult,
    assert_no_facial_tokens,
    render_dual_plate,
    verify_plate_pair,
)
from scion_cities.atlas.proof_plates import (  # noqa: E402
    ATLAS_DIR,
    IMAGES_DIR,
    MAPS_DIR,
    build_abominable_cellar_image,
    build_abominable_cellar_map,
    build_zaira_image,
    build_zaira_map,
)
from scion_cities.atlas.build_all_55_plates import (  # noqa: E402
    CITY_PLATE_PROFILES,
    PACK_55_MANIFEST_PATH,
    assert_clean_plate_artifact,
    build_city_image_plate,
    build_city_map_plate,
    clean_plate_text,
    render_single_city_entry,
)

SCION_DIR = REPO_ROOT / "scion_cities"
BUILD_DIR = SCION_DIR / "build"
DEFAULT_FULL_BUNDLE_PATH = BUILD_DIR / "full_bundle.json"
DEFAULT_PROOF_BUNDLE_PATH = BUILD_DIR / "proof_bundle.json"

MANIFEST_PATH = ATLAS_DIR / "manifest.json"
MANIFESTS_DIR = ATLAS_DIR / "manifests"
PACK_00_MANIFEST_PATH = MANIFESTS_DIR / "pack_00_proof_manifest.json"
PACK_02_MANIFEST_PATH = MANIFESTS_DIR / "pack_02_manifest.json"

CELLAR_CANONICAL_KEY = "case_00_abominable_cellar"
CELLAR_BUNDLE_ID = "flour_test_abominable_cellar"
ZAIRA_CANONICAL_KEY = "city_04_zaira"

DEFAULT_WORKERS = min(12, max(4, (os.cpu_count() or 8)))

# Lexical cleanliness check matching `verify/test_suite.py` (constructed via char codes
# so literal disallowed substrings never appear in source).
_BANNED_WORD_STEMS = (
    "\x74\x72\x61\x67\x69\x63",
    "\x69\x6e\x6e\x6f\x76\x61\x74",
    "\x68\x6f\x6c\x69\x73\x74",
    "\x73\x65\x61\x6d\x6c\x65\x73\x73",
    "\x67\x65\x6e\x75\x69\x6e",
    "\x68\x6f\x6e\x65\x73\x74",
    "\x73\x74\x72\x61\x69\x67\x68\x74\x66\x6f\x72\x77\x61\x72\x64",
)
_BANNED_STEM_RE = re.compile(
    r"\b(" + "|".join(s + r"\w*" for s in _BANNED_WORD_STEMS) + r")\b",
    flags=re.IGNORECASE,
)


def resolve_default_bundle_path(explicit_path: Optional[Path] = None) -> Path:
    """Resolve explicit bundle path, else `full_bundle.json`, else `proof_bundle.json`."""
    if explicit_path is not None:
        if not explicit_path.is_file():
            raise FileNotFoundError(f"Requested SCION bundle does not exist: {explicit_path}")
        return explicit_path
    if DEFAULT_FULL_BUNDLE_PATH.is_file():
        return DEFAULT_FULL_BUNDLE_PATH
    if DEFAULT_PROOF_BUNDLE_PATH.is_file():
        return DEFAULT_PROOF_BUNDLE_PATH
    raise FileNotFoundError(
        f"Neither {DEFAULT_FULL_BUNDLE_PATH} nor {DEFAULT_PROOF_BUNDLE_PATH} exists on disk."
    )


def _format_manifest_entry(
    bundle_case_id: str,
    city_index: int,
    city_name: str,
    title: str,
    map_svg_rel: str,
    map_png_rel: str,
    img_svg_rel: str,
    img_png_rel: str,
    map_audit: Dict[str, Any],
    img_audit: Dict[str, Any],
) -> Dict[str, Any]:
    """Construct canonical manifest metadata dictionary matching `proof_plates.py`."""
    return {
        "bundle_case_id": str(bundle_case_id),
        "city_index": int(city_index),
        "city_name": clean_plate_text(str(city_name)),
        "title": clean_plate_text(str(title)),
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
            "map": [int(MAP_DIMENSIONS[0]), int(MAP_DIMENSIONS[1])],
            "image": [int(IMAGE_DIMENSIONS[0]), int(IMAGE_DIMENSIONS[1])],
        },
        "sha256": {
            "map_svg": str(map_audit["svg_sha256"]),
            "map_png": str(map_audit["png_sha256"]),
            "image_svg": str(img_audit["svg_sha256"]),
            "image_png": str(img_audit["png_sha256"]),
        },
        "bytes": {
            "map_svg": int(map_audit["svg_bytes"]),
            "map_png": int(map_audit["png_bytes"]),
            "image_svg": int(img_audit["svg_bytes"]),
            "image_png": int(img_audit["png_bytes"]),
        },
        "pixel_std": {
            "map_png": float(map_audit["pixel_std"]),
            "image_png": float(img_audit["pixel_std"]),
        },
    }


def render_or_verify_wave1_case(
    plate_key: str,
    case_dict: Dict[str, Any],
    map_fn: Callable[[Dict[str, Any]], Any],
    img_fn: Callable[[Dict[str, Any]], Any],
    force_wave1: bool = False,
) -> Tuple[Dict[str, Any], int, int]:
    """
    Verify existing Wave 1 plates (`case_00_abominable_cellar` or `city_04_zaira`)
    via `verify_plate_pair`, or build and rasterize them via `proof_plates.py`
    builders when absent or `force_wave1=True`.
    """
    MAPS_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    map_svg_rel = f"maps/{plate_key}_map.svg"
    map_png_rel = f"maps/{plate_key}_map.png"
    img_svg_rel = f"images/{plate_key}_image.svg"
    img_png_rel = f"images/{plate_key}_image.png"

    map_svg_path = ATLAS_DIR / map_svg_rel
    map_png_path = ATLAS_DIR / map_png_rel
    img_svg_path = ATLAS_DIR / img_svg_rel
    img_png_path = ATLAS_DIR / img_png_rel

    if (
        not force_wave1
        and map_svg_path.is_file()
        and map_png_path.is_file()
        and img_svg_path.is_file()
        and img_png_path.is_file()
    ):
        try:
            map_audit = verify_plate_pair(map_svg_path, map_png_path, MAP_DIMENSIONS)
            img_audit = verify_plate_pair(img_svg_path, img_png_path, IMAGE_DIMENSIONS)
            assert_no_facial_tokens(map_svg_path.read_text(encoding="utf-8"), str(map_svg_path))
            assert_no_facial_tokens(img_svg_path.read_text(encoding="utf-8"), str(img_svg_path))
            entry = _format_manifest_entry(
                bundle_case_id=str(case_dict["case_id"]),
                city_index=int(case_dict["city_index"]),
                city_name=str(case_dict["city_name"]),
                title=str(case_dict["title"]),
                map_svg_rel=map_svg_rel,
                map_png_rel=map_png_rel,
                img_svg_rel=img_svg_rel,
                img_png_rel=img_png_rel,
                map_audit=map_audit,
                img_audit=img_audit,
            )
            return entry, 0, 2
        except Exception:
            pass

    map_res: PlateRenderResult = render_dual_plate(
        builder=map_fn(case_dict),
        kind="map",
        svg_path=map_svg_path,
        png_path=map_png_path,
    )
    img_res: PlateRenderResult = render_dual_plate(
        builder=img_fn(case_dict),
        kind="image",
        svg_path=img_svg_path,
        png_path=img_png_path,
    )
    map_audit = verify_plate_pair(map_res.svg_path, map_res.png_path, MAP_DIMENSIONS)
    img_audit = verify_plate_pair(img_res.svg_path, img_res.png_path, IMAGE_DIMENSIONS)
    assert_no_facial_tokens(map_svg_path.read_text(encoding="utf-8"), str(map_svg_path))
    assert_no_facial_tokens(img_svg_path.read_text(encoding="utf-8"), str(img_svg_path))

    entry = _format_manifest_entry(
        bundle_case_id=str(case_dict["case_id"]),
        city_index=int(case_dict["city_index"]),
        city_name=str(case_dict["city_name"]),
        title=str(case_dict["title"]),
        map_svg_rel=map_svg_rel,
        map_png_rel=map_png_rel,
        img_svg_rel=img_svg_rel,
        img_png_rel=img_png_rel,
        map_audit=map_audit,
        img_audit=img_audit,
    )
    return entry, 2, 0


def _sort_manifest_entries(entries: Dict[str, Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """
    Order manifest entries deterministically by `(city_index, alias_rank, key)`
    so `case_00_abominable_cellar` appears first, immediately followed by its
    `flour_test_abominable_cellar` lookup alias, then `city_01..city_55`.
    """
    def _sort_key(item: Tuple[str, Dict[str, Any]]) -> Tuple[int, int, str]:
        key, meta = item
        cidx = int(meta.get("city_index", 999))
        alias_rank = 0
        if cidx == 0 and key == CELLAR_BUNDLE_ID:
            alias_rank = 1
        return (cidx, alias_rank, key)

    return dict(sorted(entries.items(), key=_sort_key))


def _write_clean_json(path: Path, payload: Dict[str, Any]) -> None:
    """Serialize manifest JSON with cleanliness gates before atomic write."""
    path.parent.mkdir(parents=True, exist_ok=True)
    serialized = json.dumps(payload, indent=2, ensure_ascii=False) + "\n"
    assert_clean_plate_artifact(serialized, str(path))
    path.write_text(serialized, encoding="utf-8")


def _sync_sub_manifests(
    wave1_entries: Dict[str, Dict[str, Any]],
    wave2_entries: Dict[str, Dict[str, Any]],
) -> None:
    """
    Keep `atlas/manifests/pack_00_proof_manifest.json`, `pack_55_cities_manifest.json`,
    and `pack_02_manifest.json` (if present) synchronized with verified on-disk SHA-256s
    so `build_scion_workbench.load_atlas_manifest()` never encounters stale sub-manifests.
    """
    MANIFESTS_DIR.mkdir(parents=True, exist_ok=True)

    # 1. `pack_00_proof_manifest.json`
    existing_pack00: Dict[str, Dict[str, Any]] = {}
    if PACK_00_MANIFEST_PATH.is_file():
        try:
            loaded00 = json.loads(PACK_00_MANIFEST_PATH.read_text(encoding="utf-8"))
            if isinstance(loaded00, dict):
                existing_pack00.update(loaded00)
        except Exception:
            existing_pack00 = {}
    for k in (CELLAR_CANONICAL_KEY, ZAIRA_CANONICAL_KEY):
        if k in wave1_entries:
            existing_pack00[k] = copy.deepcopy(wave1_entries[k])
    if existing_pack00:
        _write_clean_json(PACK_00_MANIFEST_PATH, _sort_manifest_entries(existing_pack00))

    # 2. `pack_55_cities_manifest.json`
    existing_pack55: Dict[str, Dict[str, Any]] = {}
    if PACK_55_MANIFEST_PATH.is_file():
        try:
            loaded55 = json.loads(PACK_55_MANIFEST_PATH.read_text(encoding="utf-8"))
            if isinstance(loaded55, dict):
                existing_pack55.update(loaded55)
        except Exception:
            existing_pack55 = {}
    for cid, meta in wave2_entries.items():
        existing_pack55[cid] = copy.deepcopy(meta)
    if existing_pack55:
        _write_clean_json(PACK_55_MANIFEST_PATH, _sort_manifest_entries(existing_pack55))

    # 3. `pack_02_manifest.json` (sync any Pack 02 entries if that file exists on disk)
    if PACK_02_MANIFEST_PATH.is_file():
        try:
            loaded02 = json.loads(PACK_02_MANIFEST_PATH.read_text(encoding="utf-8"))
            if isinstance(loaded02, dict):
                changed = False
                for cid in list(loaded02.keys()):
                    if cid in existing_pack55:
                        loaded02[cid] = copy.deepcopy(existing_pack55[cid])
                        changed = True
                if changed:
                    _write_clean_json(PACK_02_MANIFEST_PATH, _sort_manifest_entries(loaded02))
        except Exception:
            pass


def verify_manifest_on_disk(manifest_path: Path = MANIFEST_PATH) -> Dict[str, Any]:
    """
    Independently verify every entry in `manifest_path` against on-disk SVG and PNG
    artifacts via `verify_plate_pair`, checking dimensions, PNG magic header,
    XML syntax, `pixel_std >= 12.0`, SHA-256 parity, byte-length parity, and
    zero forbidden facial or filler tokens.
    """
    if not manifest_path.is_file():
        raise FileNotFoundError(f"Atlas manifest missing: {manifest_path}")

    raw_text = manifest_path.read_text(encoding="utf-8")
    assert_clean_plate_artifact(raw_text, str(manifest_path))
    manifest_data = json.loads(raw_text)
    if not isinstance(manifest_data, dict) or not manifest_data:
        raise ValueError(f"Atlas manifest {manifest_path} must be a non-empty JSON object.")

    verified_Cache: Dict[Tuple[str, str], Tuple[Dict[str, Any], Dict[str, Any]]] = {}
    unique_diptychs = set()
    min_map_std = float("inf")
    min_img_std = float("inf")

    for key, meta in manifest_data.items():
        map_svg_rel = str(meta["map_svg"])
        map_png_rel = str(meta["map_png"])
        img_svg_rel = str(meta["image_svg"])
        img_png_rel = str(meta["image_png"])

        pair_sig = (map_svg_rel, img_svg_rel)
        unique_diptychs.add(pair_sig)

        if pair_sig not in verified_Cache:
            map_svg_p = ATLAS_DIR / map_svg_rel
            map_png_p = ATLAS_DIR / map_png_rel
            img_svg_p = ATLAS_DIR / img_svg_rel
            img_png_p = ATLAS_DIR / img_png_rel

            map_audit = verify_plate_pair(map_svg_p, map_png_p, MAP_DIMENSIONS)
            img_audit = verify_plate_pair(img_svg_p, img_png_p, IMAGE_DIMENSIONS)
            if int(meta.get("city_index", -1)) in (0, 4):
                assert_no_facial_tokens(map_svg_p.read_text(encoding="utf-8"), str(map_svg_p))
                assert_no_facial_tokens(img_svg_p.read_text(encoding="utf-8"), str(img_svg_p))
            else:
                assert_clean_plate_artifact(map_svg_p.read_text(encoding="utf-8"), str(map_svg_p))
                assert_clean_plate_artifact(img_svg_p.read_text(encoding="utf-8"), str(img_svg_p))
            verified_Cache[pair_sig] = (map_audit, img_audit)
        else:
            map_audit, img_audit = verified_Cache[pair_sig]

        # Verify manifest hashes & byte counts match exact on-disk artifacts
        if meta["sha256"]["map_svg"] != map_audit["svg_sha256"]:
            raise AssertionError(f"Manifest map_svg sha256 mismatch for {key}")
        if meta["sha256"]["map_png"] != map_audit["png_sha256"]:
            raise AssertionError(f"Manifest map_png sha256 mismatch for {key}")
        if meta["sha256"]["image_svg"] != img_audit["svg_sha256"]:
            raise AssertionError(f"Manifest image_svg sha256 mismatch for {key}")
        if meta["sha256"]["image_png"] != img_audit["png_sha256"]:
            raise AssertionError(f"Manifest image_png sha256 mismatch for {key}")

        if int(meta["bytes"]["map_svg"]) != int(map_audit["svg_bytes"]):
            raise AssertionError(f"Manifest map_svg bytes mismatch for {key}")
        if int(meta["bytes"]["map_png"]) != int(map_audit["png_bytes"]):
            raise AssertionError(f"Manifest map_png bytes mismatch for {key}")
        if int(meta["bytes"]["image_svg"]) != int(img_audit["svg_bytes"]):
            raise AssertionError(f"Manifest image_svg bytes mismatch for {key}")
        if int(meta["bytes"]["image_png"]) != int(img_audit["png_bytes"]):
            raise AssertionError(f"Manifest image_png bytes mismatch for {key}")

        min_map_std = min(min_map_std, float(map_audit["pixel_std"]))
        min_img_std = min(min_img_std, float(img_audit["pixel_std"]))

        # Verify zero facial tokens in entry JSON
        entry_str = json.dumps(meta, ensure_ascii=False)
        assert_no_facial_tokens(entry_str, f"manifest[{key}]")

    # Verify dual cellar keys whenever Scene 0 is present
    has_cellar_canonical = CELLAR_CANONICAL_KEY in manifest_data
    has_cellar_bundle = CELLAR_BUNDLE_ID in manifest_data
    if has_cellar_canonical != has_cellar_bundle:
        raise AssertionError(
            f"Manifest must expose both {CELLAR_CANONICAL_KEY!r} and {CELLAR_BUNDLE_ID!r} together."
        )

    return {
        "manifest_path": str(manifest_path),
        "manifest_keys": len(manifest_data),
        "unique_diptychs": len(unique_diptychs),
        "unique_plate_files": len(unique_diptychs) * 4,
        "min_map_pixel_std": round(min_map_std if min_map_std != float("inf") else 0.0, 3),
        "min_image_pixel_std": round(min_img_std if min_img_std != float("inf") else 0.0, 3),
        "cellar_dual_keys_verified": has_cellar_canonical and has_cellar_bundle,
    }


def render_all_bundle_plates(
    bundle_data: Dict[str, Any],
    manifest_out: Path = MANIFEST_PATH,
    force: bool = False,
    force_wave1: bool = False,
    workers: int = DEFAULT_WORKERS,
    merge_existing: bool = True,
) -> Dict[str, Any]:
    """
    Render and verify Map (`1200x900`) and Image (`1200x800`) `.svg` + `.png`
    pairs for every case in `bundle_data` (`proof_case` + `cities`), synchronize
    sub-manifests, write `manifest_out`, and run an independent verification pass.
    """
    MAPS_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    MANIFESTS_DIR.mkdir(parents=True, exist_ok=True)

    proof_case: Optional[Dict[str, Any]] = bundle_data.get("proof_case")
    cities: List[Dict[str, Any]] = list(bundle_data.get("cities", []))

    total_rendered = 0
    total_reused = 0

    wave1_entries: Dict[str, Dict[str, Any]] = {}
    wave2_entries: Dict[str, Dict[str, Any]] = {}

    # 1. Process Scene 0 (`flour_test_abominable_cellar` / `case_00_abominable_cellar`)
    if isinstance(proof_case, dict):
        cellar_entry, n_rend, n_reused = render_or_verify_wave1_case(
            plate_key=CELLAR_CANONICAL_KEY,
            case_dict=proof_case,
            map_fn=build_abominable_cellar_map,
            img_fn=build_abominable_cellar_image,
            force_wave1=force_wave1,
        )
        wave1_entries[CELLAR_CANONICAL_KEY] = cellar_entry
        total_rendered += n_rend
        total_reused += n_reused

    # 2. Separate Zaira (`city_04_zaira`) from the other 54 cities (`#01..#03`, `#05..#55`)
    zaira_cases = [
        c for c in cities
        if str(c.get("case_id")) == ZAIRA_CANONICAL_KEY or int(c.get("city_index", -1)) == 4
    ]
    other_cities = sorted(
        [
            c for c in cities
            if str(c.get("case_id")) != ZAIRA_CANONICAL_KEY
            and int(c.get("city_index", -1)) not in (0, 4)
        ],
        key=lambda c: int(c["city_index"]),
    )

    for z_case in zaira_cases:
        zaira_entry, n_rend, n_reused = render_or_verify_wave1_case(
            plate_key=ZAIRA_CANONICAL_KEY,
            case_dict=z_case,
            map_fn=build_zaira_map,
            img_fn=build_zaira_image,
            force_wave1=force_wave1,
        )
        wave1_entries[ZAIRA_CANONICAL_KEY] = zaira_entry
        total_rendered += n_rend
        total_reused += n_reused

    # 3. Render & verify all non-Zaira compiled cities in parallel
    if other_cities:
        with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, int(workers))) as pool:
            future_map = {
                pool.submit(render_single_city_entry, c_dict, force): int(c_dict["city_index"])
                for c_dict in other_cities
            }
            for fut in concurrent.futures.as_completed(future_map):
                cid, entry, n_rend, n_reused = fut.result()
                wave2_entries[cid] = entry
                total_rendered += n_rend
                total_reused += n_reused

    # 4. Sync sub-manifests (`pack_00_proof_manifest.json`, `pack_55_cities_manifest.json`, `pack_02_manifest.json`)
    _sync_sub_manifests(wave1_entries=wave1_entries, wave2_entries=wave2_entries)

    # 5. Assemble unified `manifest.json`
    combined: Dict[str, Dict[str, Any]] = {}
    if merge_existing:
        for sub_path in (PACK_00_MANIFEST_PATH, PACK_55_MANIFEST_PATH, manifest_out):
            if sub_path.is_file():
                try:
                    loaded = json.loads(sub_path.read_text(encoding="utf-8"))
                    if isinstance(loaded, dict):
                        for k, meta in loaded.items():
                            if isinstance(meta, dict) and "map_svg" in meta and "image_svg" in meta:
                                if (ATLAS_DIR / meta["map_png"]).is_file() and (ATLAS_DIR / meta["image_png"]).is_file():
                                    combined[k] = copy.deepcopy(meta)
                except Exception:
                    pass

    for k, meta in wave1_entries.items():
        combined[k] = copy.deepcopy(meta)
    for k, meta in wave2_entries.items():
        combined[k] = copy.deepcopy(meta)

    # Ensure both `case_00_abominable_cellar` AND `flour_test_abominable_cellar` resolve cleanly
    if CELLAR_CANONICAL_KEY in combined:
        combined[CELLAR_BUNDLE_ID] = copy.deepcopy(combined[CELLAR_CANONICAL_KEY])
    elif CELLAR_BUNDLE_ID in combined:
        combined[CELLAR_CANONICAL_KEY] = copy.deepcopy(combined[CELLAR_BUNDLE_ID])

    ordered_manifest = _sort_manifest_entries(combined)
    _write_clean_json(manifest_out, ordered_manifest)

    # 6. Run independent verification pass across every entry in `manifest_out`
    verification = verify_manifest_on_disk(manifest_out)

    return {
        "manifest_path": str(manifest_out),
        "bundle_cases_processed": (1 if isinstance(proof_case, dict) else 0) + len(cities),
        "plates_rendered": total_rendered,
        "plates_reused_cached": total_reused,
        "verification": verification,
    }


def build_all_plates_from_bundle(
    bundle_path: Optional[Path] = None,
    manifest_out: Path = MANIFEST_PATH,
    force: bool = False,
    force_wave1: bool = False,
    workers: int = DEFAULT_WORKERS,
    merge_existing: bool = True,
) -> Dict[str, Any]:
    """Load a SCION bundle JSON from disk and generate + verify all Atlas plates."""
    resolved = resolve_default_bundle_path(bundle_path)
    bundle_data = json.loads(resolved.read_text(encoding="utf-8"))
    result = render_all_bundle_plates(
        bundle_data=bundle_data,
        manifest_out=manifest_out,
        force=force,
        force_wave1=force_wave1,
        workers=workers,
        merge_existing=merge_existing,
    )
    result["bundle_source"] = str(resolved)
    return result


def build_smoke_12_bundle() -> Dict[str, Any]:
    """
    Assemble an in-memory 12-case smoke test bundle combining `proof_bundle.json`
    (`flour_test_abominable_cellar` + `city_04_zaira`) with all 10 compiled cities
    from `scion_cities.swarms.pack_02_signs_thin.build_pack_02_swarms()`.
    """
    if not DEFAULT_PROOF_BUNDLE_PATH.is_file():
        raise FileNotFoundError(f"Missing Wave 1 proof bundle: {DEFAULT_PROOF_BUNDLE_PATH}")
    proof_bundle = json.loads(DEFAULT_PROOF_BUNDLE_PATH.read_text(encoding="utf-8"))
    from scion_cities.swarms.pack_02_signs_thin import build_pack_02_swarms

    pack2_cities = build_pack_02_swarms()
    by_id: Dict[str, Dict[str, Any]] = {}
    for c in proof_bundle.get("cities", []):
        by_id[str(c["case_id"])] = c
    for c in pack2_cities:
        by_id[str(c["case_id"])] = c

    merged_cities = sorted(by_id.values(), key=lambda c: int(c["city_index"]))
    return {
        "schema_version": proof_bundle.get("schema_version", "scion-worldtext-1.0"),
        "proof_case": proof_bundle["proof_case"],
        "cities": merged_cities,
    }


def _self_audit_source() -> None:
    """Ensure `all_plates.py` itself contains zero banned stems or facial tokens."""
    own_text = Path(__file__).read_text(encoding="utf-8")
    hit = _BANNED_STEM_RE.search(own_text)
    if hit:
        raise RuntimeError(f"Disallowed stem {hit.group(0)!r} found in {__file__}")
    assert_no_facial_tokens(own_text, str(__file__))
    if len(CITY_PLATE_PROFILES) != 55:
        raise RuntimeError(f"Expected 55 city plate profiles, found {len(CITY_PLATE_PROFILES)}")


def main(argv: Optional[Sequence[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Render and verify SCION v1.0 Cartographic Survey Maps (1200x900) "
            "and Multiplane Architectural Elevations (1200x800) for all bundle cases."
        )
    )
    parser.add_argument(
        "--bundle",
        default=None,
        help="Path to SCION bundle JSON (defaults to full_bundle.json if present, else proof_bundle.json).",
    )
    parser.add_argument(
        "--smoke-12",
        action="store_true",
        help="Run 12-case smoke test combining proof_bundle.json (2 cases) + pack_02_signs_thin.py (10 cases).",
    )
    parser.add_argument(
        "--manifest-out",
        default=str(MANIFEST_PATH),
        help="Output manifest JSON path (defaults to scion_cities/atlas/manifest.json).",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Force full SVG+PNG re-rasterization of non-Wave-1 city plates.",
    )
    parser.add_argument(
        "--force-wave1",
        action="store_true",
        help="Also force re-rasterization of Wave 1 proof plates (Abominable Cellar & Zaira).",
    )
    parser.add_argument(
        "--strict-bundle-only",
        action="store_true",
        help="Include only cases present in the input bundle in manifest.json (skip merging other cached plates).",
    )
    parser.add_argument(
        "--verify-only",
        action="store_true",
        help="Verify existing manifest.json and all referenced SVG+PNG plates on disk without rendering.",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=DEFAULT_WORKERS,
        help=f"Parallel worker threads for SVG->PNG rasterization (default: {DEFAULT_WORKERS}).",
    )
    args = parser.parse_args(list(argv) if argv is not None else None)

    _self_audit_source()
    t0 = time.perf_counter()
    manifest_out = Path(args.manifest_out)

    if args.verify_only:
        ver = verify_manifest_on_disk(manifest_out)
        elapsed_s = time.perf_counter() - t0
        print(
            f"[SCION ALL PLATES VERIFIED] keys={ver['manifest_keys']} "
            f"diptychs={ver['unique_diptychs']} files={ver['unique_plate_files']} "
            f"min_std=(map:{ver['min_map_pixel_std']:.3f}, img:{ver['min_image_pixel_std']:.3f}) "
            f"cellar_dual_keys={ver['cellar_dual_keys_verified']} "
            f"elapsed={elapsed_s:.2f}s -> {ver['manifest_path']}"
        )
        return 0

    if args.smoke_12:
        smoke_bundle = build_smoke_12_bundle()
        summary = render_all_bundle_plates(
            bundle_data=smoke_bundle,
            manifest_out=manifest_out,
            force=args.force,
            force_wave1=args.force_wave1,
            workers=args.workers,
            merge_existing=not args.strict_bundle_only,
        )
        source_label = "proof_bundle.json+pack_02_signs_thin(12_cases)"
    else:
        explicit_bundle = Path(args.bundle) if args.bundle else None
        summary = build_all_plates_from_bundle(
            bundle_path=explicit_bundle,
            manifest_out=manifest_out,
            force=args.force,
            force_wave1=args.force_wave1,
            workers=args.workers,
            merge_existing=not args.strict_bundle_only,
        )
        source_label = summary["bundle_source"]

    elapsed_s = time.perf_counter() - t0
    ver = summary["verification"]
    print(
        f"[SCION ALL PLATES OK] source={source_label} "
        f"processed={summary['bundle_cases_processed']} "
        f"rendered={summary['plates_rendered']} cached={summary['plates_reused_cached']} "
        f"keys={ver['manifest_keys']} diptychs={ver['unique_diptychs']} files={ver['unique_plate_files']} "
        f"min_std=(map:{ver['min_map_pixel_std']:.3f}, img:{ver['min_image_pixel_std']:.3f}) "
        f"cellar_dual_keys={ver['cellar_dual_keys_verified']} "
        f"elapsed={elapsed_s:.2f}s -> {ver['manifest_path']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
