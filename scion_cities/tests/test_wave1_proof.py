#!/usr/bin/env python3
"""
Wave 1 Proof-Before-Scale Unit Test Suite (`test_wave1_proof.py`).

Verifies all SCION v1.0 invariants across `scion_engine.py`, `flour_proof.py`,
`swarms/proof_zaira.py`, and `build/proof_bundle.json`:
1. Afterlight 8-Role & 8-Operation grammar completeness.
2. Faceless nonhuman rig rule (`has_face_icons == False`) & ±3% constant-volume
   conservation (`0.97 <= area_ratio <= 1.03`) across every actor and tick (`0..24`).
3. Deliberate (`hold_still >= 3 -> draw_back -> deliberate_push`) vs. accidental
   (`rush -> sweep -> recoil`, no stillness hold) kinematics & Mute Silhouette divergence.
4. Roubaud's Qualification Gate (`RoubaudQualificationError` on unverified/tampered baseline).
5. Split-Trace Persistence (`world_trace.residues` 100% intact across A -> A' while
   `⊣ FILTER` mutates witness `actor_memory`) & "Other Worlds Being There" continuity.
6. Coupled Sensory Bus (`sine_hum_hz == 440.0`, `sync_frame_delta_ms <= 16.7ms`).
7. Epistemic Reconsideration Gate (`P1..P4` verdicts & actions flip between A and A').
8. Bespoke Swarm Builder (`jaccard == 0.0`, generic role token ban, `swarm_board_log`,
   and lockless `PhilogynyAccumulator` `ConflictGrain` arch keystones).
9. Generated `build/proof_bundle.json` schema & integrity.
"""
from __future__ import annotations

import copy
import dataclasses
import json
import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[2]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from scion_cities.core.accumulator import TrudeConvergenceError
from scion_cities.core.flour_proof import (
    build_flour_baseline_a,
    build_flour_clinamen_a_prime,
    build_flour_proof_case,
    evaluate_flour_policies,
    get_flour_swarm_spec,
)
from scion_cities.core.scion_engine import (
    AFTERLIGHT_OPERATIONS,
    AFTERLIGHT_ROLES,
    AudioSyncError,
    FaceIconForbiddenError,
    HandmadeRigSpec,
    KinematicIntentionError,
    RoubaudQualificationError,
    ScionAgentSpec,
    ScionSwarmBuilder,
    TICK_COUNT,
    VolumeConservationError,
    build_accidental_motion_reference,
    compile_lawful_checkpoint_a,
    compute_constant_volume_dims,
    fork_clinamen_branch_a_prime,
    make_actor_frame,
    make_sensory_frame,
    pairwise_jaccard,
    validate_kinematic_intentions,
    write_wave1_proof_bundle,
)
from scion_cities.swarms import (
    CITIES_55,
    build_zaira_proof_city,
    get_zaira_swarm_spec,
)


class TestWave1ScionProof(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.bundle_path, cls.bundle = write_wave1_proof_bundle()
        cls.flour_case = cls.bundle["proof_case"]
        cls.zaira_case = cls.bundle["cities"][0]

    def test_01_afterlight_grammar_completeness(self) -> None:
        expected_roles = {
            "SOURCE": "☉",
            "REFLECTOR": "☾",
            "WORLD": "♁",
            "BODY": "◉",
            "MEDIUM": "▧",
            "CULTURE": "⌂",
            "TIME": "◷",
            "CONTROL": "⌘",
        }
        expected_ops = {
            "EMIT": "→",
            "REFLECT": "↷",
            "CONCENTRATE": "≫",
            "FILTER": "⊣",
            "ABSORB": "↓",
            "STORE_RELEASE": "↻",
            "SENSE_INTERPRET": "≈",
            "SYMBOLIZE_INSTITUTIONALIZE": "≡",
        }
        self.assertEqual(AFTERLIGHT_ROLES, expected_roles)
        self.assertEqual(AFTERLIGHT_OPERATIONS, expected_ops)

    def test_02_faceless_rig_and_constant_volume_conservation(self) -> None:
        with self.assertRaises(FaceIconForbiddenError):
            HandmadeRigSpec(rig_archetype="flour_sack", has_face_icons=True)
        with self.assertRaises(FaceIconForbiddenError):
            HandmadeRigSpec(rig_archetype="plumb_bob", facial_expression="frown")
        with self.assertRaises(VolumeConservationError):
            compute_constant_volume_dims(0.42, 0, "too_squashed")
        with self.assertRaises(VolumeConservationError):
            compute_constant_volume_dims(1.80, 0, "too_stretched")

        for case in (self.flour_case, self.zaira_case):
            for ag in case["agents"]:
                self.assertFalse(ag["has_face_icons"])
            for br_key in ("CHECKPOINT_LAWFUL_A", "BRANCH_CLINAMEN_A_PRIME"):
                wt = case[br_key]["world_trace"]
                self.assertEqual(len(wt), TICK_COUNT)
                for t, frame in enumerate(wt):
                    for aid, af in frame["actors"].items():
                        self.assertFalse(af["has_face_icons"], f"{aid} tick {t} has face icons")
                        s = af["stretch_s"]
                        w = af["width_w"]
                        ar = af["area_ratio"]
                        self.assertGreaterEqual(s, 0.55)
                        self.assertLessEqual(s, 1.65)
                        self.assertLessEqual(abs(w - round(1.0 / s, 6)), 0.015)
                        self.assertAlmostEqual(s * w, ar, places=5)
                        self.assertGreaterEqual(ar, 0.97)
                        self.assertLessEqual(ar, 1.03)

    def test_03_deliberate_vs_accidental_silhouette_kinematics(self) -> None:
        wt_a = self.flour_case["CHECKPOINT_LAWFUL_A"]["world_trace"]
        inigo_seq = [wt_a[t]["actors"]["inigo_shove_vector"]["intention_kinematics"] for t in range(TICK_COUNT)]
        self.assertEqual(inigo_seq[3:7], ["hold_still"] * 4)
        self.assertEqual(inigo_seq[7], "draw_back")
        self.assertEqual(inigo_seq[8], "deliberate_push")

        # Accidental reference passes without stillness hold
        acc_frames = build_accidental_motion_reference("acc_sack")
        acc_trace = [{"tick": t, "actors": {"acc_sack": acc_frames[t]}} for t in range(TICK_COUNT)]
        validate_kinematic_intentions(acc_trace)

        # Deliberate push without >=3 hold_still must fail validation
        bad_trace = copy.deepcopy(wt_a)
        bad_trace[4]["actors"]["inigo_shove_vector"]["intention_kinematics"] = "idle"
        bad_trace[5]["actors"]["inigo_shove_vector"]["intention_kinematics"] = "idle"
        with self.assertRaises(KinematicIntentionError):
            validate_kinematic_intentions(bad_trace)

        # Mute Silhouette Test: Flower post-fire posture visibly diverges in x, y, tilt_rad, kinematics
        wt_b = self.flour_case["BRANCH_CLINAMEN_A_PRIME"]["world_trace"]
        flower_a_15 = wt_a[15]["actors"]["flower_half_sack_witness"]
        flower_b_15 = wt_b[15]["actors"]["flower_half_sack_witness"]
        self.assertEqual(flower_a_15["intention_kinematics"], "help")
        self.assertEqual(flower_b_15["intention_kinematics"], "avoid")

        flower_a_22 = wt_a[22]["actors"]["flower_half_sack_witness"]
        flower_b_22 = wt_b[22]["actors"]["flower_half_sack_witness"]
        self.assertEqual(flower_a_22["intention_kinematics"], "accuse")
        self.assertEqual(flower_b_22["intention_kinematics"], "help")
        self.assertGreater(abs(flower_a_22["x"] - flower_b_22["x"]), 0.20)
        self.assertGreater(abs(flower_a_22["y"] - flower_b_22["y"]), 0.01)
        self.assertGreater(abs(flower_a_22["tilt_rad"] - flower_b_22["tilt_rad"]), 0.10)

    def test_04_roubaud_qualification_gate(self) -> None:
        spec = get_flour_swarm_spec()
        with self.assertRaises(RoubaudQualificationError):
            fork_clinamen_branch_a_prime(spec, None, build_flour_clinamen_a_prime, evaluate_flour_policies)

        wt_a, mem_a, sb_a, utt_a = build_flour_baseline_a()
        ckpt_a = compile_lawful_checkpoint_a(spec, wt_a, mem_a, sb_a, evaluate_flour_policies, utt_a)

        unverified = dataclasses.replace(ckpt_a, lawful_verified=False)
        with self.assertRaises(RoubaudQualificationError):
            fork_clinamen_branch_a_prime(spec, unverified, build_flour_clinamen_a_prime, evaluate_flour_policies)

        tampered = dataclasses.replace(ckpt_a, content_hash="0" * 32)
        with self.assertRaises(RoubaudQualificationError):
            fork_clinamen_branch_a_prime(spec, tampered, build_flour_clinamen_a_prime, evaluate_flour_policies)

        for case in (self.flour_case, self.zaira_case):
            lineage = case["BRANCH_CLINAMEN_A_PRIME"]["branch_lineage"]
            self.assertTrue(lineage["lawful_verified"])
            self.assertEqual(lineage["parent_checkpoint_id"], case["CHECKPOINT_LAWFUL_A"]["checkpoint_id"])
            self.assertEqual(
                set(lineage["clinamen_spec"].keys()),
                {"target_rule", "passed_over_solution", "mutated_premise", "swerve_tick"},
            )

    def test_05_split_trace_persistence_and_offscreen_continuity(self) -> None:
        for case, witness_id, expected_filtered in (
            (self.flour_case, "flower_half_sack_witness", {"inigo_hold_drawback", "inigo_shoves_belindo"}),
            (self.zaira_case, "dock_net_mender_chorus", {"north_bastion_usurper_lamppost", "adulterer_railing_vault_scratch"}),
        ):
            wt_a = case["CHECKPOINT_LAWFUL_A"]["world_trace"]
            wt_b = case["BRANCH_CLINAMEN_A_PRIME"]["world_trace"]
            mem_a = case["CHECKPOINT_LAWFUL_A"]["actor_memory"][witness_id]
            mem_b = case["BRANCH_CLINAMEN_A_PRIME"]["actor_memory"][witness_id]
            swerve_tick = case["branch_lineage"]["clinamen_spec"]["swerve_tick"]

            # Pre-swerve world_trace 100% identical
            for t in range(swerve_tick + 1):
                self.assertEqual(wt_a[t], wt_b[t])

            # Physical residues remain 100% intact across ALL ticks 0..24
            for t in range(TICK_COUNT):
                for rkey in ("scuff_vector", "oil_radius", "shards", "thermal_ember"):
                    self.assertEqual(wt_a[t]["residues"][rkey], wt_b[t]["residues"][rkey])

            # Autonomous oil spread and ember decay post-fracture (ticks 10..24)
            self.assertGreater(wt_b[24]["residues"]["oil_radius"], wt_b[10]["residues"]["oil_radius"])
            self.assertLess(wt_b[24]["residues"]["thermal_ember"], wt_b[10]["residues"]["thermal_ember"])

            # Off-screen world progresses autonomously across ticks
            for idx in range(len(wt_b[0]["offscreen_world"])):
                p0 = wt_b[0]["offscreen_world"][idx]["progress"]
                p24 = wt_b[24]["offscreen_world"][idx]["progress"]
                self.assertGreater(p24, p0)

            # Witness memory keeps causal premises in A, omits via ⊣ FILTER in A'
            self.assertTrue(expected_filtered.issubset(set(mem_a[24]["retained_events"])))
            for t in range(swerve_tick, TICK_COUNT):
                self.assertEqual(mem_b[t]["afterlight_op_applied"], "⊣")
                self.assertTrue(expected_filtered.isdisjoint(set(mem_b[t]["retained_events"])))

    def test_06_coupled_sensory_bus_and_sync_delta(self) -> None:
        with self.assertRaises(AudioSyncError):
            make_sensory_frame("test", "A", 0, 0.2, True, 0.1, 0.1, None, None, sync_frame_delta_ms=19.0)

        for case in (self.flour_case, self.zaira_case):
            for br_key in ("CHECKPOINT_LAWFUL_A", "BRANCH_CLINAMEN_A_PRIME"):
                sb_list = case[br_key]["sensory_bus"]
                self.assertEqual(len(sb_list), TICK_COUNT)
                for sb in sb_list:
                    self.assertEqual(sb["sine_hum_hz"], 440.0)
                    self.assertLessEqual(sb["sync_frame_delta_ms"], 16.7)
                    self.assertGreaterEqual(sb["sync_frame_delta_ms"], 0.0)
                # Fracture tick 10 has coupled angle + fracture ping + sub_thud
                self.assertIsNotNone(sb_list[10]["fracture_ping_hz"])
                self.assertIsNotNone(sb_list[10]["impact_angle_deg"])
                self.assertIsNotNone(sb_list[10]["sub_thud_hz"])

    def test_07_epistemic_verdict_flip_p1_to_p4(self) -> None:
        p_a = {p["policy_id"]: p for p in self.flour_case["CHECKPOINT_LAWFUL_A"]["rule_ledger"]}
        p_b = {p["policy_id"]: p for p in self.flour_case["BRANCH_CLINAMEN_A_PRIME"]["rule_ledger"]}
        self.assertEqual(p_a["P3"]["payout_status"], "DENIED_INIGO_RELIEF_TO_BELINDO")
        self.assertEqual(p_b["P3"]["payout_status"], "PAYOUT_GRANTED_TO_INIGO")
        for pid in ("P1", "P2", "P3", "P4"):
            self.assertNotEqual(p_a[pid]["verdict"], p_b[pid]["verdict"])
            self.assertNotEqual(p_a[pid]["payout_status"], p_b[pid]["payout_status"])

        z_a = {p["policy_id"]: p for p in self.zaira_case["CHECKPOINT_LAWFUL_A"]["rule_ledger"]}
        z_b = {p["policy_id"]: p for p in self.zaira_case["BRANCH_CLINAMEN_A_PRIME"]["rule_ledger"]}
        for pid in ("P1", "P2", "P3", "P4"):
            self.assertNotEqual(z_a[pid]["verdict"], z_b[pid]["verdict"])
            self.assertNotEqual(z_a[pid]["payout_status"], z_b[pid]["payout_status"])

    def test_08_swarm_disjointness_generic_role_ban_and_conflict_grains(self) -> None:
        for banned in ("planner", "worker", "coder", "researcher", "assistant", "agent_1", "critic", "verifier"):
            with self.assertRaises(TrudeConvergenceError):
                ScionAgentSpec(
                    agent_id=f"cellar_{banned}",
                    display_moniker="Bad Generic Role",
                    afterlight_role="SOURCE",
                    role_symbol="☉",
                    primary_op="EMIT",
                    op_symbol="→",
                    rig_archetype="flour_sack",
                    polarity="p1",
                    home_locus="loc",
                    nisba_debt="none",
                )

        builder = ScionSwarmBuilder()
        build_flour_proof_case(builder=builder)
        build_zaira_proof_city(builder=builder)
        disjoint_report = builder.verify_global_disjointness()
        self.assertTrue(disjoint_report["disjoint_verified"])
        self.assertEqual(disjoint_report["max_pairwise_jaccard"], 0.0)

        # Also verify zero overlap against all 220 agent blueprints in CITIES_55
        catalog_ids = {ag.name for city in CITIES_55 for ag in city.agents}
        wave1_ids = {ag["agent_id"] for c in (self.flour_case, self.zaira_case) for ag in c["agents"]}
        self.assertEqual(pairwise_jaccard(catalog_ids, wave1_ids), 0.0)

        # Verify swarm_board_log and ConflictGrain arch keystones
        for case in (self.flour_case, self.zaira_case):
            for br_key in ("CHECKPOINT_LAWFUL_A", "BRANCH_CLINAMEN_A_PRIME"):
                br = case[br_key]
                self.assertGreaterEqual(len(br["swarm_board_log"]), 5)
                for msg in br["swarm_board_log"]:
                    self.assertEqual(len(msg["commit_hash"]), 32)
                grains = br["accumulator_dag"]["conflict_grains"]
                self.assertGreaterEqual(len(grains), 1)
                for g in grains:
                    self.assertIn("arch(", g["scar_emblem"])
                    self.assertGreater(g["arch_tension"], 1.0)

    def test_09_proof_bundle_json_on_disk(self) -> None:
        self.assertTrue(self.bundle_path.is_file())
        loaded = json.loads(self.bundle_path.read_text(encoding="utf-8"))
        expected_keys = [
            "schema_version",
            "palette",
            "afterlight_grammar",
            "proof_case",
            "cities",
            "lattice_index",
            "global_invariants",
        ]
        self.assertEqual(list(loaded.keys()), expected_keys)
        self.assertEqual(loaded["schema_version"], "scion-worldtext-1.0")
        self.assertEqual(len(loaded["cities"]), 1)
        self.assertEqual(loaded["cities"][0]["case_id"], "city_04_zaira")
        self.assertEqual(len(loaded["lattice_index"]["entries"]), 55)
        self.assertTrue(loaded["global_invariants"]["roubaud_all_verified"])
        self.assertTrue(loaded["global_invariants"]["within_16_7ms_audio_sync"])


if __name__ == "__main__":
    unittest.main()
