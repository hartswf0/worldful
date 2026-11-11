#!/usr/bin/env python3
"""
SCION v1.0 — Full 55-City + Scene-0 Studio Bundle Compiler (`scion_cities/build_all_55.py`).

Imports Scene 0 (`flour_proof`) and all six handmade Invisible Cities packs (`pack_01`..`pack_06`),
sorts all 55 cities `1..55` by `city_index`, verifies global 56-swarm pairwise agent-ID disjointness
(`max_pairwise_jaccard == 0.0`), zero facial/generic tokens, and all 5 SCION Hard Quality Gates,
and writes `/Users/gaia/WORLDFUL/scion_cities/build/full_bundle.json`.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Set, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from scion_cities.cli import cmd_verify_gates
from scion_cities.core.accumulator import TrudeConvergenceError
from scion_cities.core.flour_proof import build_flour_proof_case
from scion_cities.core.scion_engine import (
    FaceIconForbiddenError,
    FORBIDDEN_FACIAL_TOKENS,
    ScionSwarmBuilder,
    build_studio_bundle,
    pairwise_jaccard,
)
from scion_cities.swarms.catalog_55 import CITIES_55

DEFAULT_FULL_BUNDLE_PATH = Path(__file__).resolve().parent / "build" / "full_bundle.json"

PACK_MODULES: Tuple[Tuple[str, str, Tuple[int, ...]], ...] = (
    ("scion_cities.swarms.pack_01_memory_desire", "build_pack_01_swarms", (1, 2, 3, 4, 5, 7, 8, 11, 12, 16)),
    ("scion_cities.swarms.pack_02_signs_thin", "build_pack_02_swarms", (6, 9, 10, 13, 14, 17, 18, 21, 22, 26)),
    ("scion_cities.swarms.pack_03_trading_eyes", "build_pack_03_swarms", (15, 19, 20, 23, 24, 27, 28, 31, 32, 36)),
    ("scion_cities.swarms.pack_04_names_dead", "build_pack_04_swarms", (25, 29, 30, 33, 34, 37, 38, 41, 42, 46)),
    ("scion_cities.swarms.pack_05_sky_continuous", "build_pack_05_swarms", (35, 39, 40, 43, 44, 47, 48, 50)),
    ("scion_cities.swarms.pack_06_continuous_hidden", "build_pack_06_swarms", (45, 49, 51, 52, 53, 54, 55)),
)


def _scan_case_facial_tokens(obj: Any, path: str = "root") -> None:
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k == "series" and v == "Cities and eyes":
                continue
            _scan_case_facial_tokens(v, f"{path}.{k}")
    elif isinstance(obj, (list, tuple)):
        for idx, item in enumerate(obj):
            _scan_case_facial_tokens(item, f"{path}[{idx}]")
    elif isinstance(obj, str):
        bad = set(re.findall(r"[a-z]+", obj.lower())) & FORBIDDEN_FACIAL_TOKENS
        if bad:
            raise FaceIconForbiddenError(f"Forbidden facial token(s) {sorted(bad)} at {path}: {obj!r}")


def verify_56_swarm_disjointness(all_cases: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Verify pairwise agent-ID Jaccard overlap == 0.0 across all compiled swarms."""
    agent_sets: List[Tuple[str, Set[str]]] = []
    for c in all_cases:
        cid = c["case_id"]
        ids = {a["agent_id"] for a in c["agents"]}
        agent_sets.append((cid, ids))

    max_jac = 0.0
    pairs_checked = 0
    for i in range(len(agent_sets)):
        for j in range(i + 1, len(agent_sets)):
            cid_a, set_a = agent_sets[i]
            cid_b, set_b = agent_sets[j]
            jac = pairwise_jaccard(set_a, set_b)
            pairs_checked += 1
            if jac > 0.0:
                overlap = sorted(set_a & set_b)
                raise TrudeConvergenceError(
                    f"56-SWARM DISJOINTNESS VIOLATION: '{cid_a}' and '{cid_b}' share {overlap} (jaccard={jac:.6f})."
                )
            max_jac = max(max_jac, jac)

    return {
        "swarms_count": len(agent_sets),
        "pairs_checked": pairs_checked,
        "total_bespoke_agents": sum(len(s) for _, s in agent_sets),
        "max_pairwise_jaccard": round(max_jac, 6),
        "disjoint_verified": max_jac == 0.0,
    }


def build_full_55_bundle(
    output_path: Optional[str] = str(DEFAULT_FULL_BUNDLE_PATH),
    available_only: bool = False,
) -> Tuple[Path, Dict[str, Any], Dict[str, Any]]:
    """
    Compile Scene 0 + all 55 Invisible Cities (`pack_01`..`pack_06`), verify global
    disjointness, lattice completeness, facial-token cleanliness, and all 5 Hard Gates,
    and write `scion_cities/build/full_bundle.json`.
    """
    t0 = time.perf_counter()
    shared_builder = ScionSwarmBuilder()
    proof_case = build_flour_proof_case(builder=shared_builder)

    collected_cities: List[Dict[str, Any]] = []
    loaded_packs: List[str] = []

    for mod_name, fn_name, assigned_indices in PACK_MODULES:
        try:
            mod = __import__(mod_name, fromlist=[fn_name])
            build_fn = getattr(mod, fn_name)
            raw_cases = build_fn(builder=None)
            allowed = set(assigned_indices)
            pack_cases = [c for c in raw_cases if int(c["city_index"]) in allowed]
            collected_cities.extend(pack_cases)
            loaded_packs.append(f"{mod_name}({len(pack_cases)})")
        except Exception as exc:
            if available_only:
                loaded_packs.append(f"{mod_name}(SKIPPED:{type(exc).__name__})")
                continue
            raise

    sorted_cities = sorted(collected_cities, key=lambda c: int(c["city_index"]))

    if not available_only:
        indices = [int(c["city_index"]) for c in sorted_cities]
        expected_indices = list(range(1, 56))
        if indices != expected_indices:
            missing = sorted(set(expected_indices) - set(indices))
            dupes = sorted({x for x in indices if indices.count(x) > 1})
            raise ValueError(
                f"Expected exact 55 city indices 1..55; got {len(indices)} cities "
                f"(missing={missing}, duplicates={dupes})."
            )
        # Verify canonical metadata alignment against CITIES_55
        catalog_by_idx = {c.index: c for c in CITIES_55}
        for city_case in sorted_cities:
            idx = int(city_case["city_index"])
            cat = catalog_by_idx[idx]
            if city_case["city_name"].lower() != cat.name.lower() or int(city_case["chapter"]) != cat.chapter:
                raise ValueError(
                    f"Catalog mismatch at index {idx}: got ({city_case['city_name']}, ch={city_case['chapter']}) "
                    f"vs expected ({cat.name}, ch={cat.chapter})."
                )

    all_56 = [proof_case] + sorted_cities
    for c in all_56:
        _scan_case_facial_tokens(c, c["case_id"])

    disjoint_stats = verify_56_swarm_disjointness(all_56)

    resolved_out = str(Path(output_path).resolve()) if output_path else None
    bundle = build_studio_bundle(
        cities=sorted_cities,
        proof_case=proof_case,
        output_path=resolved_out,
    )

    out_path = Path(resolved_out) if resolved_out else DEFAULT_FULL_BUNDLE_PATH
    gate_audit = cmd_verify_gates(out_path, bundle)
    if gate_audit["verdict"] != "PASS":
        raise RuntimeError(f"Hard Gate audit failed on compiled bundle: {gate_audit['failures']}")

    elapsed_ms = round((time.perf_counter() - t0) * 1000.0, 2)
    stats = {
        "output_path": str(out_path),
        "output_bytes": out_path.stat().st_size if out_path.is_file() else 0,
        "packs_loaded": loaded_packs,
        "cities_compiled": len(sorted_cities),
        "total_swarms": disjoint_stats["swarms_count"],
        "total_bespoke_agents": disjoint_stats["total_bespoke_agents"],
        "pairs_checked": disjoint_stats["pairs_checked"],
        "max_pairwise_jaccard": disjoint_stats["max_pairwise_jaccard"],
        "gates_verdict": gate_audit["verdict"],
        "area_ratio_bounds": bundle["global_invariants"]["area_ratio_bounds"],
        "max_sync_frame_delta_ms": bundle["global_invariants"]["max_sync_frame_delta_ms"],
        "total_conflict_grains_minted": bundle["global_invariants"]["total_conflict_grains_minted"],
        "elapsed_ms": elapsed_ms,
    }
    return out_path, bundle, stats


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Compile all 55 Invisible Cities + Scene 0 into full_bundle.json.")
    parser.add_argument("--out", default=str(DEFAULT_FULL_BUNDLE_PATH), help="Output path for full_bundle.json.")
    parser.add_argument(
        "--dry-check-available",
        action="store_true",
        help="Dry-check already-completed packs in memory without writing full_bundle.json.",
    )
    args = parser.parse_args(argv)

    out_arg = None if args.dry_check_available else args.out
    _, _, stats = build_full_55_bundle(output_path=out_arg, available_only=args.dry_check_available)
    print(json.dumps(stats, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
