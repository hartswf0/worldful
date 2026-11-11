#!/usr/bin/env python3
"""
SCION v1.0 — Operative Studio & City-Swarm Builder CLI (`scion_cities/cli.py`).

Commands (reading `build/full_bundle.json` if present else `build/proof_bundle.json`):
- `list`: List Scene 0 (`proof_case`) + all compiled city swarms and lattice coverage.
- `inspect <case_id>`: Inspect a specific compiled swarm, its `CHECKPOINT_LAWFUL_A` vs
  `BRANCH_CLINAMEN_A_PRIME` split-trace divergence, `P1..P4` flips, and `ConflictGrain` arches.
- `verify-gates`: Audit all 5 SCION Hard Quality Gates across every case in the active bundle.
- `run-ct`: Execute `olog_rev_001.json` Change-Tests `CT1`, `CT2`, and `CT3`.
- `forge-preview`: Forge & verify a bespoke handmade preview city swarm through Roubaud's
  `CHECKPOINT_LAWFUL_A` -> `BRANCH_CLINAMEN_A_PRIME` pipeline without mutating canonical bundles.
"""
from __future__ import annotations

import argparse
import copy
import json
import os
import re
import sys
import time
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence, Set, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from scion_cities.core.accumulator import canonical_hash, quarantine_untrusted_text
from scion_cities.core.change_tests import (
    run_all_change_tests,
    run_ct1_contended_swarm_load,
    run_ct2_kublai_norm_washout_recovery,
    run_ct3_medium_transmutation,
)
from scion_cities.core.scion_engine import (
    CheckpointLawfulA,
    CitySwarmSpec,
    ClinamenSpec,
    FORBIDDEN_FACIAL_TOKENS,
    FORBIDDEN_GENERIC_ROLES,
    ScionAgentSpec,
    ScionSwarmBuilder,
    TICK_COUNT,
    make_actor_frame,
    make_sensory_frame,
    pairwise_jaccard,
    validate_kinematic_intentions,
    validate_offscreen_continuity,
    validate_rule_ledger,
    validate_sensory_bus,
    write_wave1_proof_bundle,
)

SCION_DIR = ROOT_DIR / "scion_cities"
FULL_BUNDLE_PATH = SCION_DIR / "build" / "full_bundle.json"
PROOF_BUNDLE_PATH = SCION_DIR / "build" / "proof_bundle.json"


def resolve_active_bundle(explicit_bundle: Optional[str] = None) -> Tuple[Path, Dict[str, Any]]:
    """Load `build/full_bundle.json` if present, else `build/proof_bundle.json`."""
    if explicit_bundle:
        path = Path(explicit_bundle)
        if not path.is_file():
            raise FileNotFoundError(f"Bundle path not found: {path}")
        return path, json.loads(path.read_text(encoding="utf-8"))

    if FULL_BUNDLE_PATH.is_file():
        return FULL_BUNDLE_PATH, json.loads(FULL_BUNDLE_PATH.read_text(encoding="utf-8"))
    if PROOF_BUNDLE_PATH.is_file():
        return PROOF_BUNDLE_PATH, json.loads(PROOF_BUNDLE_PATH.read_text(encoding="utf-8"))

    return write_wave1_proof_bundle()


def _all_cases(bundle: Dict[str, Any]) -> List[Dict[str, Any]]:
    return [bundle["proof_case"]] + list(bundle.get("cities", []))


# ---------------------------------------------------------------------------
# SUBCOMMAND 1: `list`
# ---------------------------------------------------------------------------

def cmd_list(bundle_path: Path, bundle: Dict[str, Any]) -> Dict[str, Any]:
    cases = _all_cases(bundle)
    lattice_entries = bundle.get("lattice_index", {}).get("entries", [])
    compiled_lattice_count = sum(1 for e in lattice_entries if e.get("status") == "compiled")

    rows: List[Dict[str, Any]] = []
    for c in cases:
        br_a = c["CHECKPOINT_LAWFUL_A"]
        br_b = c["BRANCH_CLINAMEN_A_PRIME"]
        rows.append({
            "case_id": c["case_id"],
            "kind": c["kind"],
            "city_index": c["city_index"],
            "city_name": c["city_name"],
            "chapter": c["chapter"],
            "series": c["series"],
            "weaver_page": c["weaver_page"],
            "agents": [f"{a['role_symbol']} {a['agent_id']} ({a['rig_archetype']})" for a in c["agents"]],
            "lawful_checkpoint_id": br_a["checkpoint_id"],
            "swerve_tick": c["branch_lineage"]["clinamen_spec"]["swerve_tick"],
            "conflict_grains": len(br_b["accumulator_dag"]["conflict_grains"]),
            "flipped_policies": [p["policy_id"] for p in c["divergence_audit"]["flipped_policies"]],
        })

    return {
        "bundle_source": str(bundle_path),
        "schema_version": bundle["schema_version"],
        "compiled_swarms_count": len(rows),
        "lattice_55_compiled": compiled_lattice_count,
        "lattice_55_total": len(lattice_entries),
        "swarms": rows,
    }


# ---------------------------------------------------------------------------
# SUBCOMMAND 2: `inspect <case_id>`
# ---------------------------------------------------------------------------

def cmd_inspect(bundle_path: Path, bundle: Dict[str, Any], target_query: str) -> Dict[str, Any]:
    q = target_query.strip().lower()
    matched: Optional[Dict[str, Any]] = None
    for c in _all_cases(bundle):
        if (
            c["case_id"].lower() == q
            or c["city_name"].lower() == q
            or str(c["city_index"]) == q
            or (q in ("flour", "scene_0", "case_00_abominable_cellar") and c["city_index"] == 0)
        ):
            matched = c
            break

    if matched is None:
        available = [c["case_id"] for c in _all_cases(bundle)]
        raise KeyError(f"Case '{target_query}' not found in {bundle_path.name}. Available: {available}")

    br_a = matched["CHECKPOINT_LAWFUL_A"]
    br_b = matched["BRANCH_CLINAMEN_A_PRIME"]
    wid = matched["divergence_audit"]["witness_agent_id"]

    return {
        "bundle_source": str(bundle_path),
        "case_id": matched["case_id"],
        "title": matched["title"],
        "city_name": matched["city_name"],
        "chapter": matched["chapter"],
        "series": matched["series"],
        "weaver_page": matched["weaver_page"],
        "desert_opposed": matched["desert_opposed"],
        "optical_rule": matched["optical_rule"],
        "material_nouns": matched["material_nouns"],
        "loci": matched["loci"],
        "agents": matched["agents"],
        "roubaud_lineage": matched["branch_lineage"],
        "split_trace_snapshot_t24": {
            "world_residues_A": br_a["world_trace"][-1]["residues"],
            "world_residues_A_prime": br_b["world_trace"][-1]["residues"],
            "witness_agent_id": wid,
            "witness_memory_A": br_a["actor_memory"][wid][-1],
            "witness_memory_A_prime": br_b["actor_memory"][wid][-1],
        },
        "rule_ledger_comparison": [
            {
                "policy_id": pa["policy_id"],
                "title": pa["title"],
                "verdict_A": pa["verdict"],
                "verdict_A_prime": pb["verdict"],
                "payout_A": pa["payout_status"],
                "payout_A_prime": pb["payout_status"],
            }
            for pa, pb in zip(br_a["rule_ledger"], br_b["rule_ledger"])
        ],
        "conflict_grains": br_b["accumulator_dag"]["conflict_grains"],
        "clinamen_inquiry": matched["clinamen_inquiry"],
        "thick_telemetry": matched.get("thick_telemetry", {}),
    }


# ---------------------------------------------------------------------------
# SUBCOMMAND 3: `verify-gates`
# ---------------------------------------------------------------------------

def cmd_verify_gates(bundle_path: Path, bundle: Dict[str, Any]) -> Dict[str, Any]:
    cases = _all_cases(bundle)
    gate_failures: List[str] = []

    min_ar = 999.0
    max_ar = -999.0
    max_sync_ms = 0.0
    agent_sets: List[Tuple[str, Set[str]]] = []

    for c in cases:
        cid = c["case_id"]
        br_a = c["CHECKPOINT_LAWFUL_A"]
        br_b = c["BRANCH_CLINAMEN_A_PRIME"]

        # Gate 1: Roubaud Baseline Qualification
        if not br_a.get("lawful_verified"):
            gate_failures.append(f"{cid}: CHECKPOINT_LAWFUL_A lawful_verified != True")
        lineage = br_b.get("branch_lineage", {})
        if lineage.get("parent_checkpoint_id") != br_a.get("checkpoint_id") or not lineage.get("lawful_verified"):
            gate_failures.append(f"{cid}: invalid Roubaud branch_lineage")

        # Gate 2: Mute Silhouette, Faceless Rigs, Constant Volume & Deliberate Timing
        for bname, br in (("A", br_a), ("A_PRIME", br_b)):
            try:
                validate_kinematic_intentions(br["world_trace"])
            except Exception as exc:
                gate_failures.append(f"{cid}.{bname} kinematics/volume: {exc}")
            for wt in br["world_trace"]:
                for af in wt["actors"].values():
                    ar = float(af["area_ratio"])
                    min_ar = min(min_ar, ar)
                    max_ar = max(max_ar, ar)

        # Gate 3: Split-Trace Persistence & Offscreen Continuity
        swerve_t = int(lineage["clinamen_spec"]["swerve_tick"])
        for t in range(swerve_t + 1):
            if canonical_hash(br_a["world_trace"][t]) != canonical_hash(br_b["world_trace"][t]):
                gate_failures.append(f"{cid}: pre-swerve world_trace drifted at tick {t}")
        for t in range(TICK_COUNT):
            for rk in ("scuff_vector", "oil_radius", "shards", "thermal_ember"):
                if canonical_hash(br_a["world_trace"][t]["residues"][rk]) != canonical_hash(
                    br_b["world_trace"][t]["residues"][rk]
                ):
                    gate_failures.append(f"{cid}: residue '{rk}' overwritten at tick {t}")
        for bname, br in (("A", br_a), ("A_PRIME", br_b)):
            try:
                validate_offscreen_continuity(br["world_trace"], f"{cid}.{bname}")
            except Exception as exc:
                gate_failures.append(f"{cid}.{bname} offscreen: {exc}")

        # Gate 4: Sensory Bus Sync <= 16.7ms
        for bname, br in (("A", br_a), ("A_PRIME", br_b)):
            try:
                validate_sensory_bus(br["sensory_bus"], f"{cid}.{bname}")
                validate_rule_ledger(br["rule_ledger"], f"{cid}.{bname}")
            except Exception as exc:
                gate_failures.append(f"{cid}.{bname} sensory/ledger: {exc}")
            for sb in br["sensory_bus"]:
                max_sync_ms = max(max_sync_ms, float(sb["sync_frame_delta_ms"]))

        # Gate 5: Epistemic Verdict Flip & Bespoke Disjoint Swarms
        if not c["divergence_audit"].get("changed_actions") or not c["divergence_audit"].get("flipped_policies"):
            gate_failures.append(f"{cid}: failed Epistemic Reconsideration Gate")

        ids = {ag["agent_id"] for ag in c["agents"]}
        for aid in ids:
            tokens = set(re.split(r"[_\-\s]+", aid.lower()))
            if (tokens & FORBIDDEN_GENERIC_ROLES) or (tokens & FORBIDDEN_FACIAL_TOKENS):
                gate_failures.append(f"{cid}: forbidden generic/facial token in '{aid}'")
        for prev_cid, prev_ids in agent_sets:
            if pairwise_jaccard(ids, prev_ids) > 0.0:
                gate_failures.append(f"{cid}: agent ID overlap with '{prev_cid}'")
        agent_sets.append((cid, ids))

    verdict = "PASS" if not gate_failures else "FAIL"
    return {
        "bundle_source": str(bundle_path),
        "verdict": verdict,
        "cases_audited": len(cases),
        "gates": {
            "gate_1_roubaud_baseline": verdict == "PASS",
            "gate_2_mute_silhouette_and_volume": 0.97 <= min_ar and max_ar <= 1.03,
            "gate_3_split_trace_and_offscreen": verdict == "PASS",
            "gate_4_coupled_sensory_sync_le_16_7ms": max_sync_ms <= 16.7,
            "gate_5_epistemic_flip_and_disjoint_swarms": verdict == "PASS",
        },
        "measured_bounds": {
            "min_area_ratio": round(min_ar, 6),
            "max_area_ratio": round(max_ar, 6),
            "max_sync_frame_delta_ms": round(max_sync_ms, 3),
            "total_bespoke_agents": sum(len(s) for _, s in agent_sets),
            "max_pairwise_jaccard": 0.0 if not gate_failures else None,
        },
        "failures": gate_failures,
    }


# ---------------------------------------------------------------------------
# SUBCOMMAND 4: `forge-preview`
# ---------------------------------------------------------------------------

def cmd_forge_preview(
    city_name: str,
    desert_opposed: str,
    nouns_csv: str,
    poles_pair: str,
) -> Dict[str, Any]:
    """
    Handcraft and compile an ephemeral custom Scion City Swarm preview through the full
    25-tick Roubaud `CHECKPOINT_LAWFUL_A` -> `BRANCH_CLINAMEN_A_PRIME` verification pipeline.
    """
    clean_name, _ = quarantine_untrusted_text(city_name)
    clean_desert, _ = quarantine_untrusted_text(desert_opposed)
    nouns = [quarantine_untrusted_text(n.strip())[0] for n in nouns_csv.split(",") if n.strip()]
    if len(nouns) < 4:
        raise ValueError("forge-preview requires >= 4 comma-separated concrete material nouns.")
    pa, pb = (poles_pair.split(":", 1) + ["counter_arch_strain"])[:2]

    slug = re.sub(r"[^a-z0-9]+", "_", clean_name.lower()).strip("_") or "custom_scion"
    loci = (f"{slug}_keystone_gate", f"{slug}_reflector_gallery", f"{slug}_charter_plinth")

    def _ns(s: str) -> str:
        return re.sub(r"[^a-z0-9]+", "_", s.lower()).strip("_")[:18]

    ag_source = f"{slug}_{_ns(nouns[0])}_impactor"
    ag_body = f"{slug}_{_ns(nouns[1])}_vessel"
    ag_witness = f"{slug}_{_ns(nouns[2])}_aperture"
    ag_control = f"{slug}_{_ns(nouns[3])}_plumb"

    agents = (
        ScionAgentSpec(
            agent_id=ag_source,
            display_moniker=f"{clean_name} Impulse Carver",
            afterlight_role="SOURCE",
            role_symbol="☉",
            primary_op="EMIT",
            op_symbol="→",
            rig_archetype="brass_cog",
            polarity=pa,
            home_locus=loci[0],
            nisba_debt=f"Bound to {nouns[0]} guild quota opposing {clean_desert}",
            emblems=(nouns[0], nouns[1]),
            base_magnitude=8.1,
            harmonic_ratio=(5, 4),
        ),
        ScionAgentSpec(
            agent_id=ag_body,
            display_moniker=f"{clean_name} Struck Counterweight",
            afterlight_role="BODY",
            role_symbol="◉",
            primary_op="ABSORB",
            op_symbol="↓",
            rig_archetype="ceramic_vessel",
            polarity=pb,
            home_locus=loci[0],
            nisba_debt=f"Retains kinetic fracture of {nouns[1]} across {loci[0]}",
            emblems=(nouns[1], nouns[2]),
            base_magnitude=2.9,
            harmonic_ratio=(4, 3),
        ),
        ScionAgentSpec(
            agent_id=ag_witness,
            display_moniker=f"{clean_name} Selective Reflector",
            afterlight_role="REFLECTOR",
            role_symbol="☾",
            primary_op="FILTER",
            op_symbol="⊣",
            rig_archetype="mirror_obverse",
            polarity=pa,
            home_locus=loci[1],
            nisba_debt=f"Indexes {nouns[2]} sightlines for municipal charter P1-P4",
            emblems=(nouns[2], nouns[3]),
            base_magnitude=6.0,
            harmonic_ratio=(3, 2),
        ),
        ScionAgentSpec(
            agent_id=ag_control,
            display_moniker=f"{clean_name} Charter Plumb",
            afterlight_role="CONTROL",
            role_symbol="⌘",
            primary_op="SYMBOLIZE_INSTITUTIONALIZE",
            op_symbol="≡",
            rig_archetype="plumb_bob",
            polarity=pb,
            home_locus=loci[2],
            nisba_debt=f"Hardens sworn {nouns[3]} testimony into binding civic decree",
            emblems=(nouns[0], nouns[3]),
            base_magnitude=4.2,
            harmonic_ratio=(15, 8),
        ),
    )

    clinamen_spec = ClinamenSpec(
        target_rule=f"{clean_name} Charter Witness-to-Trace Clause P3",
        passed_over_solution="Erasing physical impact shards from the stone gate",
        mutated_premise=f"At tick 11, ⊣ FILTER omits '{slug}_coiled_impulse' from {ag_witness} memory.",
        swerve_tick=11,
        witness_agent_id=ag_witness,
        filtered_premises=(f"{slug}_coiled_impulse",),
    )

    spec = CitySwarmSpec(
        case_id=f"preview_{slug}",
        kind="custom_scion",
        city_index=900,
        city_name=clean_name,
        title=f"{clean_name.upper()} — Forged Scion Preview Swarm",
        chapter=9,
        series="Hidden cities",
        series_rank=5,
        weaver_page=165,
        desert_opposed=clean_desert,
        optical_rule=f"Raking light across {nouns[0]} and {nouns[-1]}",
        material_nouns=tuple(nouns),
        loci=loci,
        agents=agents,
        clinamen_spec=clinamen_spec,
        clinamen_inquiry={
            "T1_substrate_anchor": f"Custom material nouns: {', '.join(nouns)}",
            "T2_lawful_rule": "4-tick stillness hold + draw-back + deliberate push recorded by witness",
            "T3_clinamen_swerve": f"⊣ FILTER drops '{slug}_coiled_impulse' at tick 11",
            "T4_material_trace_vs_memory": "Physical scuff & shards persist while witness posture flips",
            "T5_institutional_consequence": "P1-P4 charter verdicts invert under uncorroborated scuff rule",
            "better_question_test": {
                "Original_Question": f"Did {ag_source} fracture {ag_body} deliberately?",
                "Exposed_Assumption": "Assumes witness memory and physical stone scars stay synchronized.",
                "Discovered_Better_Question": f"How does {clean_name}'s charter adjudicate intact {nouns[1]} shards when {ag_witness} omits the pre-impact hold?",
            },
        },
        thick_telemetry={
            "thin_machine_telemetry": "1.2 Hz | 40ms | dry click | Δx=+0.15 | Δt_sync=1.4ms",
            "thick_over_the_shoulder": f"Guild nisba debt on {nouns[0]} turns witness omission into charter exoneration.",
        },
    )

    def _preview_baseline() -> Tuple[
        List[Dict[str, Any]],
        Dict[str, List[Dict[str, Any]]],
        List[Dict[str, Any]],
        List[Tuple[int, str, str, str, str]],
    ]:
        wt: List[Dict[str, Any]] = []
        sb: List[Dict[str, Any]] = []
        mem: Dict[str, List[Dict[str, Any]]] = {a.agent_id: [] for a in agents}
        for t in range(TICK_COUNT):
            if t <= 2:
                f_src = make_actor_frame(ag_source, t, 0.25, 0.74, 0.35, 1.0, 0.04, "idle", ag_body, "twos")
            elif 3 <= t <= 6:
                f_src = make_actor_frame(ag_source, t, 0.28, 0.74, 0.35, 0.81, 0.08, "hold_still", ag_body, "hold")
            elif t == 7:
                f_src = make_actor_frame(ag_source, t, 0.24, 0.75, 0.35, 0.75, -0.26, "draw_back", ag_body, "ones")
            elif t in (8, 9):
                f_src = make_actor_frame(ag_source, t, 0.42, 0.74, 0.35, 1.30, 0.42, "deliberate_push", ag_body, "ones")
            else:
                f_src = make_actor_frame(ag_source, t, 0.23, 0.74, 0.35, 0.91, -0.22, "avoid", ag_witness, "twos")

            f_bdy = make_actor_frame(
                ag_body, t, 0.58 if t >= 8 else 0.48, 0.75, 0.34,
                0.78 if t >= 10 else 0.96, 0.32 if t >= 8 else 0.02,
                "recoil" if t in (8, 9, 10) else "idle", None, "ones" if t in (8, 10) else "twos",
            )
            f_wit = make_actor_frame(
                ag_witness, t, 0.52 if t >= 12 else 0.36, 0.79, 0.18,
                1.20 if t >= 18 else 0.96, -0.40 if t >= 18 else 0.12,
                "accuse" if t >= 18 else ("help" if t >= 12 else "idle"),
                ag_source if t >= 18 else ag_body, "twos",
            )
            f_ctl = make_actor_frame(
                ag_control, t, 0.46 if t >= 14 else 0.80, 0.46, 0.25,
                1.14, -0.25 if t >= 14 else 0.0, "accuse" if t >= 14 else "idle", ag_source, "twos",
            )

            wt.append({
                "tick": t,
                "exposure": "ones" if t in (7, 8, 9, 10) else "twos",
                "actors": {ag_source: f_src, ag_body: f_bdy, ag_witness: f_wit, ag_control: f_ctl},
                "residues": {
                    "oil_radius": round(0.05 + (t - 10) * 0.01, 4) if t >= 10 else 0.0,
                    "scuff_vector": [0.15, 0.02] if t >= 8 else [0.0, 0.0],
                    "shards": [[0.60, 0.75, 0.52], [0.63, 0.77, -0.61]] if t >= 10 else [],
                    "thermal_ember": round(0.92 * (0.93 ** (t - 10)), 4) if t >= 10 else 0.15,
                    "graphite_smudges": [[0.28, 0.75], [0.42, 0.75]] if t >= 8 else [[0.25, 0.75]],
                },
                "offscreen_world": [
                    {"entity": f"{slug}_outer_caravan", "state": "advancing", "progress": round(0.04 + t * 0.038, 4)},
                    {"entity": f"{slug}_cistern_drip", "state": "cycling", "progress": round(0.07 + t * 0.036, 4)},
                ],
            })
            chain = ([f"{slug}_coiled_impulse"] if t >= 8 else []) + ([f"{slug}_vessel_fracture"] if t >= 10 else [])
            for ag in agents:
                mem[ag.agent_id].append({
                    "tick": t,
                    "retained_events": list(chain),
                    "filtered_premises": [],
                    "afterlight_op_applied": ag.op_symbol,
                    "stance": "indicting_source" if (ag.agent_id == ag_witness and t >= 12) else "active",
                    "next_action": "accuse" if (ag.agent_id == ag_witness and t >= 12) else "idle",
                    "target_actor": ag_source,
                    "confidence": 0.96,
                })
            sb.append(
                make_sensory_frame(
                    spec.case_id, "A", t, 0.28, (t % 2 == 0), 0.35 if t in (8, 10) else 0.12,
                    0.22 if t >= 10 else 0.08, 44.0 if t == 10 else None, 48.0 if t == 10 else None, 1.4,
                )
            )
        utts = [
            (6, ag_source, ag_body, loci[0], f"Holding coiled stance at {loci[0]}."),
            (6, ag_body, ag_source, loci[0], f"Counterweight anchored on {loci[0]}."),
            (10, ag_witness, ag_control, loci[1], "Full impulse and fracture chain witnessed."),
            (20, ag_control, ag_source, loci[2], "Charter P1-P4 subrogated against source."),
        ]
        return wt, mem, sb, utts

    def _preview_clinamen(
        ckpt_a: CheckpointLawfulA, clin: ClinamenSpec
    ) -> Tuple[
        List[Dict[str, Any]],
        Dict[str, List[Dict[str, Any]]],
        List[Dict[str, Any]],
        List[Tuple[int, str, str, str, str]],
    ]:
        st = clin.swerve_tick
        wt_b = [copy.deepcopy(ckpt_a.world_trace[t]) for t in range(st + 1)]
        sb_b = [copy.deepcopy(ckpt_a.sensory_bus[t]) for t in range(st + 1)]
        mem_b = {aid: [copy.deepcopy(ckpt_a.actor_memory[aid][t]) for t in range(st)] for aid in ckpt_a.actor_memory}
        for aid in mem_b:
            if aid == ag_witness:
                mem_b[aid].append({
                    "tick": st,
                    "retained_events": [f"{slug}_vessel_fracture"],
                    "filtered_premises": list(clin.filtered_premises),
                    "afterlight_op_applied": "⊣",
                    "stance": "filtered_witness_omission",
                    "next_action": "help",
                    "target_actor": ag_source,
                    "confidence": 0.91,
                })
            else:
                mem_b[aid].append(copy.deepcopy(ckpt_a.actor_memory[aid][st]))

        for t in range(st + 1, TICK_COUNT):
            actors_t = copy.deepcopy(ckpt_a.world_trace[t]["actors"])
            actors_t[ag_witness] = make_actor_frame(
                ag_witness, t, 0.26, 0.75, 0.18, 0.88, -0.24, "help", ag_source, "twos"
            )
            actors_t[ag_control] = make_actor_frame(
                ag_control, t, 0.62, 0.46, 0.25, 1.12, -0.14, "reroute", ag_body, "twos"
            )
            wt_b.append({
                "tick": t,
                "exposure": "twos",
                "actors": actors_t,
                "residues": copy.deepcopy(ckpt_a.world_trace[t]["residues"]),
                "offscreen_world": copy.deepcopy(ckpt_a.world_trace[t]["offscreen_world"]),
            })
            for aid in mem_b:
                if aid == ag_witness:
                    mem_b[aid].append({
                        "tick": t,
                        "retained_events": [f"{slug}_vessel_fracture"],
                        "filtered_premises": list(clin.filtered_premises),
                        "afterlight_op_applied": "⊣",
                        "stance": "deferring_to_source",
                        "next_action": "help",
                        "target_actor": ag_source,
                        "confidence": 0.91,
                    })
                else:
                    mem_b[aid].append(copy.deepcopy(ckpt_a.actor_memory[aid][t]))
            sb_b.append(make_sensory_frame(spec.case_id, "A_PRIME", t, 0.14, False, 0.30, 0.28, None, None, 1.6))

        utts_b = [
            (6, ag_source, ag_body, loci[0], f"Holding coiled stance at {loci[0]}."),
            (6, ag_body, ag_source, loci[0], f"Counterweight anchored on {loci[0]}."),
            (11, ag_witness, ag_control, loci[1], "⊣ FILTER: recall only vessel fracture."),
            (20, ag_control, ag_source, loci[2], "≡ Charter P1-P4 flipped: source exonerated."),
        ]
        return wt_b, mem_b, sb_b, utts_b

    def _preview_policies(
        wt: Sequence[Dict[str, Any]], mem: Dict[str, List[Dict[str, Any]]]
    ) -> List[Dict[str, Any]]:
        ret = set(mem[ag_witness][-1]["retained_events"])
        has_imp = f"{slug}_coiled_impulse" in ret
        w_in = f"scuff={wt[-1]['residues']['scuff_vector']}, shards={len(wt[-1]['residues']['shards'])}"
        m_in = f"retained={sorted(ret)}"
        return [
            {
                "policy_id": f"P{i}",
                "title": f"{clean_name} Charter Clause P{i}",
                "formal_predicate": f"witness_attests({slug}_coiled_impulse) => SUBROGATE",
                "world_input": w_in,
                "witness_input": m_in,
                "verdict": "SUBROGATED_SOURCE" if has_imp else "ACCIDENTAL_FRACTURE_RATIFIED",
                "payout_status": "DENIED_SOURCE" if has_imp else "PAYOUT_GRANTED_TO_SOURCE",
                "deciding_tick": 20,
            }
            for i in (1, 2, 3, 4)
        ]

    builder = ScionSwarmBuilder()
    compiled = builder.compile_case(spec, _preview_baseline, _preview_clinamen, _preview_policies)
    return {
        "preview_status": "ROUBAUD_AND_SPLIT_TRACE_VERIFIED",
        "case_id": compiled["case_id"],
        "city_name": compiled["city_name"],
        "agents": [a["agent_id"] for a in compiled["agents"]],
        "checkpoint_lawful_a": compiled["CHECKPOINT_LAWFUL_A"]["checkpoint_id"],
        "branch_clinamen_hash": compiled["BRANCH_CLINAMEN_A_PRIME"]["branch_hash"],
        "conflict_grains_minted": len(compiled["BRANCH_CLINAMEN_A_PRIME"]["accumulator_dag"]["conflict_grains"]),
        "flipped_policies": [p["policy_id"] for p in compiled["divergence_audit"]["flipped_policies"]],
        "discovered_better_question": compiled["clinamen_inquiry"]["better_question_test"]["Discovered_Better_Question"],
    }


# ---------------------------------------------------------------------------
# MAIN CLI ROUTER (Subcommands + Legacy Flags)
# ---------------------------------------------------------------------------

def main(argv: Optional[List[str]] = None) -> int:
    raw_args = list(sys.argv[1:] if argv is None else argv)

    # Support legacy Wave-0 flags seamlessly if passed
    legacy_flags = {"--list-55", "--city", "--mutate", "--hybrid", "--forge-custom", "--stress-100x"}
    if any(a in legacy_flags for a in raw_args):
        from scion_cities.swarms.catalog_55 import CITIES_55, catalog_by_name
        from scion_cities.swarms.scion_compiler import QUINE_MUTATION_OPS, ScionSwarmBuilder as LegacyBuilder

        lparser = argparse.ArgumentParser(description="Legacy Catalog-55 Swarm CLI")
        lparser.add_argument("--list-55", action="store_true")
        lparser.add_argument("--city", type=str)
        lparser.add_argument("--ticks", type=int, default=3)
        lparser.add_argument("--mutate", nargs=2, metavar=("CITY", "OP"))
        lparser.add_argument("--scion-name", type=str, default=None)
        lparser.add_argument("--hybrid", nargs=3, metavar=("CITY_A", "CITY_B", "SCION_NAME"))
        lparser.add_argument("--forge-custom", type=str)
        lparser.add_argument("--desert", type=str, default="uniform airport asphalt")
        lparser.add_argument("--nouns", type=str, default="basalt_cistern,copper_plumbline,salt_windlass,obsidian_arch")
        lparser.add_argument("--poles", type=str, default="subterranean_draw:aerial_counterweight")
        lparser.add_argument("--stress-100x", type=str)
        largs = lparser.parse_args(raw_args)
        lb = LegacyBuilder()
        if largs.list_55:
            swarms = lb.build_all_55_canonical(initial_ticks=largs.ticks)
            print(json.dumps({"cities_built": len(swarms), "agents": len(lb.registered_agent_names)}, indent=2))
            return 0
        if largs.city:
            sw = lb.build_city_swarm(catalog_by_name()[largs.city.lower()])
            print(json.dumps(sw.execute_ticks(largs.ticks), indent=2))
            return 0
        if largs.mutate:
            child = lb.mutate_city_scion(largs.mutate[0], largs.mutate[1], scion_name=largs.scion_name)
            print(json.dumps({"scion_city": child.spec.name, "agents": [a.name for a in child.agents]}, indent=2))
            return 0
        if largs.hybrid:
            hyb = lb.hybridize_cities(*largs.hybrid)
            print(json.dumps({"scion_city": hyb.spec.name, "agents": [a.name for a in hyb.agents]}, indent=2))
            return 0
        if largs.forge_custom:
            pa, pb = (largs.poles.split(":", 1) + ["counter_pole"])[:2]
            nouns = [n.strip() for n in largs.nouns.split(",") if n.strip()]
            cust = lb.forge_custom_city_from_seed(largs.forge_custom, largs.desert, nouns, pa, pb)
            print(json.dumps({"scion_city": cust.spec.name, "agents": [a.name for a in cust.agents]}, indent=2))
            return 0
        if largs.stress_100x:
            sw = lb.build_city_swarm(catalog_by_name()[largs.stress_100x.lower()])
            print(json.dumps(sw.run_100x_contention_storm(), indent=2))
            return 0

    parser = argparse.ArgumentParser(
        prog="scion_cities/cli.py",
        description="SCION v1.0 Clinamen Operative Studio & City-Swarm Builder CLI",
    )
    parser.add_argument(
        "--bundle",
        default=None,
        help="Explicit bundle JSON path (defaults to build/full_bundle.json else build/proof_bundle.json).",
    )
    sub = parser.add_subparsers(dest="command")

    sub.add_parser("list", help="List Scene 0 and all compiled city swarms in the active bundle.")

    p_inspect = sub.add_parser("inspect", help="Inspect a compiled case by case_id, city name, or index.")
    p_inspect.add_argument("case_id", help="Case ID (e.g. flour_test_abominable_cellar, city_04_zaira, zaira, 4, 0).")

    sub.add_parser("verify-gates", help="Audit all 5 SCION Hard Quality Gates on the active bundle.")

    p_ct = sub.add_parser("run-ct", help="Execute Olog Change-Tests CT1, CT2, and CT3.")
    p_ct.add_argument("--only", choices=["ct1", "ct2", "ct3"], default=None, help="Run a single change test.")

    p_forge = sub.add_parser("forge-preview", help="Forge and verify a bespoke preview Scion City Swarm.")
    p_forge.add_argument("--name", default="Sophrone-Crease", help="Custom Scion City name.")
    p_forge.add_argument("--desert", default="sterile glass-curtain monoculture", help="Opposed desert norm.")
    p_forge.add_argument(
        "--nouns",
        default="basalt_cistern,copper_plumbline,salt_windlass,obsidian_arch",
        help="Comma-separated concrete material nouns (>=4).",
    )
    p_forge.add_argument(
        "--poles",
        default="subterranean_draw:aerial_counterweight",
        help="Opposing polarity pair ALPHA:BETA.",
    )

    args = parser.parse_args(raw_args)
    if not args.command:
        parser.print_help()
        return 0

    try:
        if args.command == "run-ct":
            if args.only == "ct1":
                res = run_ct1_contended_swarm_load()
                ok = res["passed"]
            elif args.only == "ct2":
                res = run_ct2_kublai_norm_washout_recovery()
                ok = res["passed"]
            elif args.only == "ct3":
                res = run_ct3_medium_transmutation()
                ok = res["passed"]
            else:
                res = run_all_change_tests()
                ok = res["all_passed"]
            print(json.dumps(res, indent=2, ensure_ascii=False))
            return 0 if ok else 1

        if args.command == "forge-preview":
            res = cmd_forge_preview(args.name, args.desert, args.nouns, args.poles)
            print(json.dumps(res, indent=2, ensure_ascii=False))
            return 0

        bpath, bundle = resolve_active_bundle(args.bundle)
        if args.command == "list":
            print(json.dumps(cmd_list(bpath, bundle), indent=2, ensure_ascii=False))
            return 0
        if args.command == "inspect":
            print(json.dumps(cmd_inspect(bpath, bundle, args.case_id), indent=2, ensure_ascii=False))
            return 0
        if args.command == "verify-gates":
            report = cmd_verify_gates(bpath, bundle)
            print(json.dumps(report, indent=2, ensure_ascii=False))
            return 0 if report["verdict"] == "PASS" else 1
    except Exception as exc:
        print(f"[SCION CLI ERROR] {exc}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
