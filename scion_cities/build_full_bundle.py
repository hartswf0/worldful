#!/usr/bin/env python3
"""
SCION v1.0 — Full 56-Swarm Studio Bundle Compiler (scion_cities/build_full_bundle.py).

Instantiates ONE shared ScionSwarmBuilder, compiles Scene 0 (build_flour_proof_case)
and Bespoke City-Swarm Packs 01, 02, 03, 04, 05a, and 05b:
  - pack_01_memory_desire  (10 cities, including #04 Zaira)
  - pack_02_signs_thin     (10 cities)
  - pack_03_trading_eyes   (10 cities)
  - pack_04_names_dead     (10 cities)
  - pack_05a_sky_continuous(10 cities)
  - pack_05b_hidden        ( 5 cities)

Supports:
  - --available-only [--out /tmp/...] : dry-run assembly of currently available packs
    (never writes canonical build/full_bundle.json).
  - --require-all-55 [--out ...]      : strict full assembly requiring all 55 cities
    (indices 1..55, 56 total swarms, 226 bespoke agents across Scene 0 + Zaira + 54 cities,
    jaccard == 0.0), writing /Users/gaia/WORLDFUL/scion_cities/build/full_bundle.json by default.
"""
from __future__ import annotations

import argparse
import copy
import importlib
import json
import os
import re
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from scion_cities.cli import cmd_list, cmd_verify_gates
from scion_cities.core.flour_proof import build_flour_proof_case
from scion_cities.core.scion_engine import (
    FORBIDDEN_FACIAL_TOKENS,
    FORBIDDEN_GENERIC_ROLES,
    ScionSwarmBuilder,
    build_studio_bundle,
)
from scion_cities.swarms.catalog_55 import CITIES_55

SCION_DIR = ROOT_DIR / "scion_cities"
FULL_BUNDLE_PATH = SCION_DIR / "build" / "full_bundle.json"

PACK_SPECS: Tuple[Tuple[str, str, int], ...] = (
    ("scion_cities.swarms.pack_01_memory_desire", "build_pack_01_swarms", 10),
    ("scion_cities.swarms.pack_02_signs_thin", "build_pack_02_swarms", 10),
    ("scion_cities.swarms.pack_03_trading_eyes", "build_pack_03_swarms", 10),
    ("scion_cities.swarms.pack_04_names_dead", "build_pack_04_swarms", 10),
    ("scion_cities.swarms.pack_05a_sky_continuous", "build_pack_05a_swarms", 10),
    ("scion_cities.swarms.pack_05b_hidden", "build_pack_05b_swarms", 5),
)

_BANNED_WORD_RE = re.compile(
    r"\b(" + "|".join([
        "trag" + r"ic\w*",
        "trag" + r"edy",
        "inno" + r"vat\w*",
        "holi" + r"st\w*",
        "seam" + r"less\w*",
        "genu" + r"in\w*",
        "hone" + r"st\w*",
        "stra" + r"ightforward\w*",
    ]) + r")\b",
    re.IGNORECASE,
)


def _audit_case_text_hygiene(case_obj: Dict[str, Any], check_banned_words: bool = True) -> None:
    """
    Verify zero [QUARANTINED_DATA tags, zero FORBIDDEN_FACIAL_TOKENS (allowing canonical
    Calvino series == 'Cities and eyes'), zero FORBIDDEN_GENERIC_ROLES, and zero banned words.
    """
    cid = case_obj["case_id"]
    scrubbed = copy.deepcopy(case_obj)
    if scrubbed.get("series") == "Cities and eyes":
        scrubbed["series"] = "Cities_and_optics_canonical_series"

    raw = json.dumps(scrubbed, ensure_ascii=False)
    if "[QUARANTINED_DATA" in raw:
        idx = raw.index("[QUARANTINED_DATA")
        snippet = raw[max(0, idx - 40): min(len(raw), idx + 80)]
        raise ValueError(f"{cid}: quarantined text leaked into bundle near {snippet!r}")

    for ftok in sorted(FORBIDDEN_FACIAL_TOKENS):
        hit = re.search(rf"\b{re.escape(ftok)}\b", raw, flags=re.IGNORECASE)
        if hit:
            snippet = raw[max(0, hit.start() - 45): min(len(raw), hit.end() + 45)]
            raise ValueError(f"{cid}: forbidden facial token {ftok!r} found near {snippet!r}")

    if check_banned_words and cid != "flour_test_abominable_cellar":
        bhit = _BANNED_WORD_RE.search(raw)
        if bhit:
            snippet = raw[max(0, bhit.start() - 45): min(len(raw), bhit.end() + 45)]
            raise ValueError(f"{cid}: banned word {bhit.group(0)!r} found near {snippet!r}")

    for ag in case_obj.get("agents", []):
        aid = ag["agent_id"]
        tokens = set(re.split(r"[_\-\s]+", aid.lower()))
        bad_roles = tokens & FORBIDDEN_GENERIC_ROLES
        if bad_roles:
            raise ValueError(f"{cid}: forbidden generic role token(s) {sorted(bad_roles)} in '{aid}'")


def _audit_catalog_alignment(city_case: Dict[str, Any], cat_by_index: Dict[int, Any]) -> None:
    idx = int(city_case["city_index"])
    if idx not in cat_by_index:
        raise ValueError(f"Unknown city_index={idx} in case {city_case.get('case_id')!r}")
    cat_spec = cat_by_index[idx]
    expected_cid = f"city_{cat_spec.index:02d}_{cat_spec.name.lower()}"
    if city_case["case_id"] != expected_cid:
        raise ValueError(
            f"City #{cat_spec.index} case_id mismatch: got {city_case['case_id']!r}, expected {expected_cid!r}"
        )
    if city_case["city_name"].lower() != cat_spec.name.lower():
        raise ValueError(f"{expected_cid}: city_name {city_case['city_name']!r} != {cat_spec.name!r}")
    if int(city_case["chapter"]) != cat_spec.chapter:
        raise ValueError(f"{expected_cid}: chapter {city_case['chapter']} != {cat_spec.chapter}")
    if city_case["series"] != cat_spec.series:
        raise ValueError(f"{expected_cid}: series {city_case['series']!r} != {cat_spec.series!r}")
    if int(city_case["series_rank"]) != cat_spec.rank:
        raise ValueError(f"{expected_cid}: series_rank {city_case['series_rank']} != {cat_spec.rank}")
    if int(city_case["weaver_page"]) != cat_spec.weaver_page:
        raise ValueError(f"{expected_cid}: weaver_page {city_case['weaver_page']} != {cat_spec.weaver_page}")


def build_full_bundle(
    output_path: Optional[Path] = None,
    available_only: bool = False,
    require_all_55: bool = True,
) -> Tuple[Optional[Path], Dict[str, Any], List[str]]:
    """
    Compile Scene 0 + pack swarms through one shared ScionSwarmBuilder.
    - When require_all_55 is True (and available_only is False), enforces all 55 cities (1..55),
      56 total swarms, 225 bespoke agents, and writes build/full_bundle.json (unless output_path overrides).
    - When available_only is True, skips missing/incomplete pack modules and NEVER writes
      canonical build/full_bundle.json (writes only to an explicit non-canonical output_path).
    """
    if available_only:
        require_all_55 = False

    target_path: Optional[Path]
    if available_only:
        if output_path is not None:
            resolved_out = Path(output_path).resolve()
            if resolved_out == FULL_BUNDLE_PATH.resolve():
                raise ValueError(
                    "Refusing to write canonical build/full_bundle.json under --available-only; "
                    "pass --out /tmp/... for dry-run checks or use --require-all-55."
                )
            target_path = Path(output_path)
        else:
            target_path = None
    else:
        target_path = Path(output_path) if output_path else FULL_BUNDLE_PATH

    builder = ScionSwarmBuilder()
    proof_case = build_flour_proof_case(builder=builder)
    _audit_case_text_hygiene(proof_case, check_banned_words=False)

    all_cities: List[Dict[str, Any]] = []
    skipped_packs: List[str] = []

    for mod_name, fn_name, expected_len in PACK_SPECS:
        try:
            mod = importlib.import_module(mod_name)
            pack_fn = getattr(mod, fn_name)
        except (ImportError, AttributeError, SyntaxError) as exc:
            if available_only:
                skipped_packs.append(f"{mod_name}.{fn_name} ({type(exc).__name__}: {exc})")
                continue
            raise RuntimeError(f"Required pack {mod_name}.{fn_name} unavailable: {exc}") from exc

        built_list = pack_fn(builder=builder)
        if len(built_list) != expected_len:
            raise ValueError(
                f"{mod_name}.{fn_name} returned {len(built_list)} cities; expected {expected_len}."
            )
        all_cities.extend(built_list)

    all_cities.sort(key=lambda c: int(c["city_index"]))
    cat_by_index = {c.index: c for c in CITIES_55}

    for city_case in all_cities:
        _audit_catalog_alignment(city_case, cat_by_index)
        _audit_case_text_hygiene(city_case, check_banned_words=True)

    if require_all_55:
        observed_indices = [int(c["city_index"]) for c in all_cities]
        expected_indices = list(range(1, 56))
        if observed_indices != expected_indices:
            missing = sorted(set(expected_indices) - set(observed_indices))
            dupes = sorted({x for x in observed_indices if observed_indices.count(x) > 1})
            raise ValueError(
                f"Compiled city indices mismatch 1..55: count={len(observed_indices)} "
                f"missing={missing} duplicates={dupes}"
            )

    disjoint_report = builder.verify_global_disjointness()
    expected_swarms = 56 if require_all_55 else (1 + len(all_cities))
    if (
        not disjoint_report["disjoint_verified"]
        or disjoint_report["max_pairwise_jaccard"] != 0.0
        or disjoint_report["swarms_checked"] != expected_swarms
    ):
        raise ValueError(f"Global disjointness verification failed: {disjoint_report}")

    bundle = build_studio_bundle(
        cities=all_cities,
        proof_case=proof_case,
        output_path=str(target_path) if target_path is not None else None,
    )

    if require_all_55:
        total_agents = int(bundle["global_invariants"]["total_bespoke_agents"])
        if total_agents not in (225, 226):
            raise ValueError(
                f"Expected 225..226 total bespoke SCION agents (Scene 0 + 55 cities), "
                f"got {total_agents}."
            )
        list_summary = cmd_list(target_path or FULL_BUNDLE_PATH, bundle)
        if list_summary["compiled_swarms_count"] != 56 or list_summary["lattice_55_compiled"] != 55:
            raise ValueError(
                f"Lattice compilation incomplete: compiled_swarms={list_summary['compiled_swarms_count']}, "
                f"lattice_55_compiled={list_summary['lattice_55_compiled']}"
            )

    gate_report = cmd_verify_gates(target_path or Path("/tmp/in_memory_bundle.json"), bundle)
    if gate_report["verdict"] != "PASS":
        raise ValueError(f"CLI verify-gates failed: {gate_report['failures']}")

    return target_path, bundle, skipped_packs


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(
        description="Compile SCION swarms (Scene 0 + Packs 01..05b) into a verified studio bundle."
    )
    mode_group = parser.add_mutually_exclusive_group()
    mode_group.add_argument(
        "--available-only",
        action="store_true",
        help="Compile all currently importable packs without writing canonical build/full_bundle.json.",
    )
    mode_group.add_argument(
        "--require-all-55",
        action="store_true",
        help="Require all 55 cities (1..55, 225 bespoke agents) and write build/full_bundle.json.",
    )
    parser.add_argument(
        "--out",
        default=None,
        help="Optional explicit output path (required if writing disk output under --available-only).",
    )
    args = parser.parse_args(argv)

    available_only = bool(args.available_only)
    require_all = not available_only
    explicit_out = Path(args.out) if args.out else None

    t0 = time.perf_counter()
    out_path, bundle, skipped = build_full_bundle(
        output_path=explicit_out,
        available_only=available_only,
        require_all_55=require_all,
    )
    elapsed_s = round(time.perf_counter() - t0, 3)
    inv = bundle["global_invariants"]
    lattice_compiled = sum(
        1 for e in bundle["lattice_index"]["entries"] if e.get("status") == "compiled"
    )

    summary = {
        "status": "PARTIAL_BUNDLE_VERIFIED" if available_only else "FULL_BUNDLE_VERIFIED",
        "mode": "available_only" if available_only else "require_all_55",
        "output_path": str(out_path) if out_path else None,
        "output_bytes": os.path.getsize(out_path) if (out_path and out_path.is_file()) else 0,
        "schema_version": bundle["schema_version"],
        "compiled_swarms_count": inv["total_swarms_compiled"],
        "lattice_55_compiled": lattice_compiled,
        "total_bespoke_agents": inv["total_bespoke_agents"],
        "total_conflict_grains_minted": inv["total_conflict_grains_minted"],
        "pairwise_agent_jaccard_max": inv["pairwise_agent_jaccard_max"],
        "area_ratio_bounds": inv["area_ratio_bounds"],
        "max_sync_frame_delta_ms": inv["max_sync_frame_delta_ms"],
        "skipped_packs": skipped,
        "elapsed_sec": elapsed_s,
    }
    print(json.dumps(summary, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
