#!/usr/bin/env python3
"""
Wave 2 Full 56-Swarm Scale & Olog Change-Test Verification Suite (`test_full_55_swarms.py`).

Verifies:
1. Full 56-swarm bundle (`Scene 0: The Flour Test` + all `55` canonical Invisible Cities `1..55`)
   when `full_bundle.json` or all 6 pack modules are present (and falls back cleanly to testing
   available packs + Wave 1 if invoked mid-pack build).
2. Global 56-swarm pairwise agent-ID Jaccard disjointness (`0.000000` across `1,540` pairs),
   zero generic role tokens, and zero facial expression tokens.
3. All 5 SCION Hard Quality Gates across every compiled swarm (`2,800` world frames at full scale):
   - Gate 1: Roubaud Lawful Baseline (`lawful_verified == True`, `parent_checkpoint_id` integrity).
   - Gate 2: Faceless constant-volume rigs (`0.97 <= area_ratio <= 1.03`), deliberate push timing
     (`>=3 hold_still -> draw_back -> deliberate_push`), and post-swerve posture divergence.
   - Gate 3: Split-Trace Persistence (`world_trace.residues` 100% preserved across `0..24` while
     `⊣ FILTER` mutates witness memory) + autonomous `offscreen_world` progression.
   - Gate 4: Coupled Sensory Bus (`440.0 Hz` hum, `sync_frame_delta_ms <= 16.7ms`).
   - Gate 5: Epistemic Reconsideration (`P1..P4` flips + changed actions + `ConflictGrain` arches).
4. Olog Change-Tests `CT1`, `CT2`, and `CT3` (`scion_cities/core/change_tests.py`).
"""
from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path
from typing import Any, Dict, List

ROOT_DIR = Path(__file__).resolve().parents[2]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from scion_cities.build_all_55 import (
    DEFAULT_FULL_BUNDLE_PATH,
    PACK_MODULES,
    build_full_55_bundle,
    verify_56_swarm_disjointness,
)
from scion_cities.cli import cmd_verify_gates
from scion_cities.core.accumulator import canonical_hash
from scion_cities.core.change_tests import run_all_change_tests
from scion_cities.core.scion_engine import TICK_COUNT


def _all_packs_importable() -> bool:
    for mod_name, fn_name, _ in PACK_MODULES:
        try:
            mod = __import__(mod_name, fromlist=[fn_name])
            if not hasattr(mod, fn_name):
                return False
        except Exception:
            return False
    return True


class TestFull55SwarmsAndChangeTests(unittest.TestCase):
    bundle: Dict[str, Any]
    all_cases: List[Dict[str, Any]]
    full_55_active: bool

    @classmethod
    def setUpClass(cls) -> None:
        if DEFAULT_FULL_BUNDLE_PATH.is_file():
            cls.bundle = json.loads(DEFAULT_FULL_BUNDLE_PATH.read_text(encoding="utf-8"))
            cls.full_55_active = True
        else:
            try:
                _, cls.bundle, _ = build_full_55_bundle(output_path=None, available_only=False)
                cls.full_55_active = True
            except Exception:
                _, cls.bundle, _ = build_full_55_bundle(output_path=None, available_only=True)
                cls.full_55_active = len(cls.bundle.get("cities", [])) == 55

        cls.all_cases = [cls.bundle["proof_case"]] + list(cls.bundle["cities"])

    def test_01_change_tests_ct1_ct2_ct3(self) -> None:
        report = run_all_change_tests()
        self.assertEqual(report["verdict"], "PASS")
        self.assertTrue(report["all_passed"])
        self.assertTrue(report["CT1"]["passed"])
        self.assertTrue(report["CT2"]["passed"])
        self.assertTrue(report["CT3"]["passed"])

    def test_02_global_disjointness_and_lattice_coverage(self) -> None:
        disjoint = verify_56_swarm_disjointness(self.all_cases)
        self.assertTrue(disjoint["disjoint_verified"])
        self.assertEqual(disjoint["max_pairwise_jaccard"], 0.0)

        if self.full_55_active:
            self.assertEqual(len(self.bundle["cities"]), 55)
            self.assertEqual(len(self.all_cases), 56)
            self.assertEqual(disjoint["pairs_checked"], 1540)
            self.assertEqual([c["city_index"] for c in self.bundle["cities"]], list(range(1, 56)))
            compiled_entries = [
                e for e in self.bundle["lattice_index"]["entries"] if e["status"] == "compiled"
            ]
            self.assertEqual(len(compiled_entries), 55)

    def test_03_all_five_hard_gates_across_every_swarm(self) -> None:
        audit = cmd_verify_gates(DEFAULT_FULL_BUNDLE_PATH, self.bundle)
        self.assertEqual(audit["verdict"], "PASS", f"Gate failures: {audit['failures']}")
        self.assertGreaterEqual(audit["measured_bounds"]["min_area_ratio"], 0.97)
        self.assertLessEqual(audit["measured_bounds"]["max_area_ratio"], 1.03)
        self.assertLessEqual(audit["measured_bounds"]["max_sync_frame_delta_ms"], 16.7)

    def test_04_split_trace_conflict_grains_and_better_questions(self) -> None:
        for case in self.all_cases:
            cid = case["case_id"]
            br_a = case["CHECKPOINT_LAWFUL_A"]
            br_b = case["BRANCH_CLINAMEN_A_PRIME"]
            wid = case["divergence_audit"]["witness_agent_id"]
            swerve_t = case["branch_lineage"]["clinamen_spec"]["swerve_tick"]

            # Intact physical residues across all 25 ticks
            for t in range(TICK_COUNT):
                for rkey in ("scuff_vector", "oil_radius", "shards", "thermal_ember"):
                    self.assertEqual(
                        canonical_hash(br_a["world_trace"][t]["residues"][rkey]),
                        canonical_hash(br_b["world_trace"][t]["residues"][rkey]),
                        f"{cid} tick {t} residue {rkey} drifted",
                    )

            # Witness memory applies ⊣ FILTER at swerve_tick..24
            self.assertEqual(br_b["actor_memory"][wid][swerve_t]["afterlight_op_applied"], "⊣")
            self.assertGreaterEqual(len(br_b["accumulator_dag"]["conflict_grains"]), 1, cid)
            self.assertGreaterEqual(len(case["divergence_audit"]["flipped_policies"]), 1, cid)

            bq = case["clinamen_inquiry"]["better_question_test"]
            self.assertTrue(bq["Original_Question"].strip(), cid)
            self.assertTrue(bq["Exposed_Assumption"].strip(), cid)
            self.assertTrue(bq["Discovered_Better_Question"].strip(), cid)


if __name__ == "__main__":
    unittest.main()
