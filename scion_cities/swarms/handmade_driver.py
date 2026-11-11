#!/usr/bin/env python3
"""SCION v1.0 — Ergonomic 25-Tick Handmade City Driver (`scion_cities/swarms/handmade_driver.py`)."""
from __future__ import annotations

import copy
import re
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Sequence, Tuple

from scion_cities.core.scion_engine import (
    CheckpointLawfulA, CitySwarmSpec, ClinamenSpec, FaceIconForbiddenError,
    FORBIDDEN_FACIAL_TOKENS, ScionSwarmBuilder, TICK_COUNT, make_actor_frame, make_sensory_frame,
)

StationTuple = Tuple[float, float, float, float, float, str, str, Optional[str], Optional[str]]
PolicyTuple = Tuple[str, str, str, str, str, str, str]
OffscreenTuple = Tuple[str, str, float, float]
UtteranceTuple = Tuple[int, str, str, str, str]


@dataclass(frozen=True)
class HandmadeCityBlueprint:
    """Compact physical, sensory, and institutional parameters for one handmade City Swarm."""
    actor_stations: Dict[str, StationTuple]  # agent_id -> (x, y, depth, tilt_a, tilt_b, act_a, act_b, tgt_a, tgt_b)
    residues: Tuple[Sequence[float], float, Sequence[Sequence[float]], float]  # (scuff_vec, oil_r, shards, ember)
    offscreen_processes: Sequence[OffscreenTuple]  # 3x (entity_id, state_locus, base_val, delta_per_tick)
    sensory_profile: Tuple[float, float, float, float, float, float]  # (sine, rustle, hiss, impact_deg, thud_hz, sync_ms)
    policies: Sequence[PolicyTuple]  # 4x (policy_id, title, clause, verdict_a, payout_a, verdict_b, payout_b)
    utterances_a: Sequence[UtteranceTuple]
    utterances_b: Sequence[UtteranceTuple]
    push_window: Tuple[int, ...] = (3, 7, 8)  # (hold_start, draw_back_tick, push_tick) or (hold_start, push_tick)
    push_agent_id: Optional[str] = None
    extra_premises: Tuple[str, ...] = field(default_factory=tuple)


def _resolve_push_ticks(push_window: Tuple[int, ...], swerve_tick: int) -> Tuple[int, int, int, int]:
    h_start, d_tick, p_tick = (
        (push_window[0], push_window[1] - 1, push_window[1]) if len(push_window) == 2
        else (push_window[0], push_window[1], push_window[2])
    )
    if d_tick - h_start < 3:
        h_start = max(0, d_tick - 3)
    return h_start, d_tick, p_tick, min(swerve_tick, p_tick + 2)


def _stretch_for_action(kin: str) -> float:
    return {
        "hold_still": 0.82, "draw_back": 0.75, "deliberate_push": 1.31,
        "recoil": 0.78, "accuse": 1.21, "avoid": 1.16, "help": 0.87, "reroute": 0.89,
    }.get(kin, 1.00)


def _ensure_contended_arch(spec: CitySwarmSpec, utts: Sequence[UtteranceTuple], swerve_t: int) -> List[UtteranceTuple]:
    out = list(utts)
    pol_map = {a.agent_id: a.polarity for a in spec.agents}
    buckets: Dict[Tuple[int, str], set[str]] = {}
    for t, spk, _, loc, _ in out:
        buckets.setdefault((t, loc), set()).add(pol_map[spk])
    if any(len(p) >= 2 for p in buckets.values()):
        return out
    a0 = spec.agents[0]
    a1 = next(a for a in spec.agents if a.polarity != a0.polarity)
    tc, loc = max(1, min(swerve_t - 1, 5)), a0.home_locus
    return [
        (tc, a0.agent_id, a1.agent_id, loc, f"{a0.display_moniker} stakes {a0.polarity} at {loc}."),
        (tc, a1.agent_id, a0.agent_id, loc, f"{a1.display_moniker} counters with {a1.polarity} at {loc}."),
    ] + out


def _scan_facial_tokens(obj: Any, path: str = "root") -> None:
    if isinstance(obj, dict):
        for k, v in obj.items():
            if not (k == "series" and v == "Cities and eyes"):
                _scan_facial_tokens(v, f"{path}.{k}")
    elif isinstance(obj, (list, tuple)):
        for i, item in enumerate(obj):
            _scan_facial_tokens(item, f"{path}[{i}]")
    elif isinstance(obj, str):
        bad = set(re.findall(r"[a-z]+", obj.lower())) & FORBIDDEN_FACIAL_TOKENS
        if bad:
            raise FaceIconForbiddenError(f"Forbidden facial word(s) {sorted(bad)} at {path}: {obj!r}")


def compile_handmade_city(
    spec: CitySwarmSpec,
    blueprint: HandmadeCityBlueprint,
    builder: Optional[ScionSwarmBuilder] = None,
) -> Dict[str, Any]:
    """Compile a `CitySwarmSpec` + `HandmadeCityBlueprint` into a verified SCION Case dict."""
    swerve_t, wid = spec.clinamen_spec.swerve_tick, spec.clinamen_spec.witness_agent_id
    h_start, d_tick, p_tick, f_tick = _resolve_push_ticks(blueprint.push_window, swerve_t)
    pusher = blueprint.push_agent_id or next(
        (a.agent_id for a in spec.agents if a.afterlight_role == "SOURCE"), spec.agents[0].agent_id
    )
    scuff_vec, base_oil, shards_raw, peak_ember = blueprint.residues
    base_sine, base_rustle, base_hiss, impact_deg, thud_hz, sync_ms = blueprint.sensory_profile
    safe_sync = min(16.0, max(0.2, float(sync_ms)))
    retained_after = list(blueprint.extra_premises) or [f"{spec.case_id}_aftermath", f"{spec.case_id}_fracture"]
    full_chain = list(spec.clinamen_spec.filtered_premises) + retained_after
    valid_post_kin = {"idle", "hold_still", "recoil", "help", "avoid", "accuse", "reroute"}

    def _baseline() -> Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[UtteranceTuple]]:
        wt_list, sb_list = [], []
        mem: Dict[str, List[Dict[str, Any]]] = {a.agent_id: [] for a in spec.agents}
        for t in range(TICK_COUNT):
            actors: Dict[str, Any] = {}
            for ag in spec.agents:
                aid = ag.agent_id
                bx, by, depth, tilt_a, _, act_a, _, tgt_a, _ = blueprint.actor_stations[aid]
                if aid == pusher and t <= p_tick + 1:
                    if t < h_start:
                        kin, exp, x, y, tilt = "idle", "twos", bx - 0.03, by, 0.04
                    elif t < d_tick:
                        kin, exp, x, y, tilt = "hold_still", "hold", bx, by, 0.08
                    elif t == d_tick:
                        kin, exp, x, y, tilt = "draw_back", "ones", bx - 0.04, by + 0.005, -0.26
                    else:
                        kin, exp, x, y, tilt = "deliberate_push", "ones", bx + 0.11, by - 0.005, 0.42
                elif t <= swerve_t:
                    kin = "recoil" if (t in (p_tick, f_tick) and aid != pusher) else "idle"
                    exp, x, y, tilt = ("ones" if t in (p_tick, f_tick) else "twos"), bx, by, (0.24 if kin == "recoil" else 0.03)
                else:
                    u = min(1.0, (t - swerve_t) / 6.0)
                    dx = -0.08 * u if aid == wid else (0.04 * u if act_a != "idle" else 0.0)
                    kin = act_a if act_a in valid_post_kin else "accuse"
                    exp = "hold" if t >= 20 and kin in ("accuse", "hold_still") else "twos"
                    x, y, tilt = min(0.92, max(0.08, bx + dx)), min(0.88, max(0.16, by - 0.02 * u)), tilt_a
                actors[aid] = make_actor_frame(aid, t, x, y, depth, _stretch_for_action(kin), tilt, kin, tgt_a, exp)

            wt_list.append({
                "tick": t,
                "exposure": "ones" if t in (d_tick, p_tick, f_tick) else ("hold" if h_start <= t < d_tick else "twos"),
                "actors": actors,
                "residues": {
                    "oil_radius": round(max(0.03, float(base_oil)) + (t - f_tick) * 0.01, 4) if t >= f_tick else 0.0,
                    "scuff_vector": [round(float(scuff_vec[0]), 4), round(float(scuff_vec[1]), 4)] if t >= p_tick else [0.0, 0.0],
                    "shards": [[round(float(v), 4) for v in s] for s in shards_raw] if t >= f_tick else [],
                    "thermal_ember": round(max(0.55, float(peak_ember)) * (0.93 ** (t - f_tick)), 4) if t >= f_tick else 0.16,
                    "graphite_smudges": [[round(s[0], 3), round(s[1], 3)] for s in list(blueprint.actor_stations.values())[: (3 if t >= p_tick else 1)]],
                },
                "offscreen_world": [
                    {"entity": eid, "state": st_loc, "progress": round(float(bv) + t * max(0.016, float(dl)), 4)}
                    for eid, st_loc, bv, dl in blueprint.offscreen_processes
                ],
            })
            cur_ev = (list(spec.clinamen_spec.filtered_premises) if t >= p_tick else []) + (retained_after if t >= f_tick else [])
            for ag in spec.agents:
                aid = ag.agent_id
                act_a, tgt_a = blueprint.actor_stations[aid][5], blueprint.actor_stations[aid][7]
                mem[aid].append({
                    "tick": t, "retained_events": list(cur_ev), "filtered_premises": [], "afterlight_op_applied": ag.op_symbol,
                    "stance": f"lawful_{act_a}" if t > swerve_t else "observing",
                    "next_action": act_a if t > swerve_t else ("deliberate_push" if aid == pusher and t == p_tick else "idle"),
                    "target_actor": tgt_a, "confidence": 0.97,
                })
            hit = t in (p_tick, f_tick)
            sb_list.append(make_sensory_frame(
                spec.case_id, "A", t, base_sine * (0.55 if hit else 1.0), (t % 2 == 0 and not hit),
                min(0.92, base_rustle + (0.45 if hit else 0.0)), min(0.85, base_hiss + (0.28 if hit else 0.0)),
                impact_deg if hit else None, thud_hz if t in (d_tick, p_tick, f_tick) else None, safe_sync,
            ))
        return wt_list, mem, sb_list, _ensure_contended_arch(spec, blueprint.utterances_a, swerve_t)

    def _clinamen(ckpt_a: CheckpointLawfulA, clin: ClinamenSpec) -> Tuple[List[Dict[str, Any]], Dict[str, List[Dict[str, Any]]], List[Dict[str, Any]], List[UtteranceTuple]]:
        wt_b = [copy.deepcopy(ckpt_a.world_trace[t]) for t in range(swerve_t + 1)]
        sb_b = [copy.deepcopy(ckpt_a.sensory_bus[t]) for t in range(swerve_t)]
        mem_b = {aid: [copy.deepcopy(ckpt_a.actor_memory[aid][t]) for t in range(swerve_t)] for aid in ckpt_a.actor_memory}
        sb_b.append(make_sensory_frame(spec.case_id, "A_PRIME", swerve_t, base_sine * 0.4, False, min(0.9, base_rustle + 0.35), min(0.85, base_hiss + 0.35), impact_deg * 0.75, thud_hz, safe_sync))
        for ag in spec.agents:
            aid = ag.agent_id
            act_b, tgt_b = blueprint.actor_stations[aid][6], blueprint.actor_stations[aid][8]
            mem_b[aid].append({
                "tick": swerve_t, "retained_events": list(retained_after), "filtered_premises": list(clin.filtered_premises),
                "afterlight_op_applied": "⊣", "stance": f"clinamen_{act_b}", "next_action": act_b, "target_actor": tgt_b, "confidence": 0.91,
            } if aid == wid else copy.deepcopy(ckpt_a.actor_memory[aid][swerve_t]))

        for t in range(swerve_t + 1, TICK_COUNT):
            u = min(1.0, (t - swerve_t) / 6.0)
            actors_b: Dict[str, Any] = {}
            for ag in spec.agents:
                aid = ag.agent_id
                bx, by, depth, _, tilt_b, _, act_b, _, tgt_b = blueprint.actor_stations[aid]
                dx = 0.11 * u if aid == wid else (-0.05 * u if act_b != "idle" else 0.0)
                kin = act_b if act_b in valid_post_kin else "reroute"
                actors_b[aid] = make_actor_frame(
                    aid, t, min(0.92, max(0.08, bx + dx)), min(0.88, max(0.16, by + 0.015 * u)),
                    depth, _stretch_for_action(kin), tilt_b, kin, tgt_b, "hold" if t >= 20 and kin == "hold_still" else "twos",
                )
                mem_b[aid].append({
                    "tick": t, "retained_events": list(retained_after) if aid == wid else list(full_chain),
                    "filtered_premises": list(clin.filtered_premises) if aid == wid else [],
                    "afterlight_op_applied": "⊣" if aid == wid else ag.op_symbol,
                    "stance": f"clinamen_{act_b}", "next_action": act_b, "target_actor": tgt_b, "confidence": 0.92,
                })
            wt_b.append({
                "tick": t, "exposure": "twos", "actors": actors_b,
                "residues": copy.deepcopy(ckpt_a.world_trace[t]["residues"]),
                "offscreen_world": copy.deepcopy(ckpt_a.world_trace[t]["offscreen_world"]),
            })
            sb_b.append(make_sensory_frame(spec.case_id, "A_PRIME", t, base_sine * 0.5, False, min(0.88, base_rustle + 0.18), min(0.82, base_hiss + 0.16), impact_deg * 0.5 if t == 20 else None, thud_hz if t == 20 else None, safe_sync))
        return wt_b, mem_b, sb_b, _ensure_contended_arch(spec, blueprint.utterances_b, swerve_t)

    def _eval_policies(wt: Sequence[Dict[str, Any]], mem: Dict[str, List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
        res, w_mem = wt[-1]["residues"], mem[wid][-1]
        has_p = spec.clinamen_spec.filtered_premises[0] in set(w_mem["retained_events"])
        w_str = f"scuff={res['scuff_vector']}, oil={res['oil_radius']}, shards={len(res['shards'])}"
        m_str = f"retained={sorted(w_mem['retained_events'])}, op={w_mem['afterlight_op_applied']}"
        return [
            {"policy_id": pid, "title": ttl, "formal_predicate": cl, "world_input": w_str, "witness_input": m_str,
             "verdict": va if has_p else vb, "payout_status": pa if has_p else pb, "deciding_tick": 20}
            for pid, ttl, cl, va, pa, vb, pb in blueprint.policies
        ]

    compiled = (builder or ScionSwarmBuilder()).compile_case(spec, _baseline, _clinamen, _eval_policies)
    _scan_facial_tokens(compiled)
    return compiled
