#!/usr/bin/env python3
"""
Lockless Philogyny Accumulator & Survival Physics Envelope.

Implements Olog Revision olog_rev_002 (prior_olog: olog_rev_001):
- Content-addressed LocusState, MicroCommit (including confidence), and ConflictGrain arches (CD1 & CD2).
- Exact Monoid-Semilattice Polarity Algebra:
  * Ambient neutral semilattice updates (emblem_union, altitude_max with polarity='neutral')
    act as the identity element on polarity/carve channels and distribute across all branches.
  * Directed effective polarities commute strictly within the same pole via join-semilattice
    (emblem union, max altitude, max carve_vector) and fork without averaging across distinct poles.
- Wait-free append-log frontier tracking (`_op_counts`, `_head_events`) surviving 1us thread-switch
  interleaving with zero mutex/lock primitives.
- Out-of-band Survival Physics (§9) with single-pass non-recursive injection quarantine & Peak Checkpoint Ledger (§11).
"""
from __future__ import annotations

import hashlib
import json
import re
from dataclasses import dataclass, field
from typing import Any, Dict, FrozenSet, Iterable, List, Optional, Set, Tuple


class EmptySubstrateError(RuntimeError):
    """Raised when Input == empty set; ◻(T) refuses to mark nothingness."""


class RunawayVelocityError(RuntimeError):
    """Raised when mutation velocity exceeds the 100x liability clamp."""


class TrudeConvergenceError(RuntimeError):
    """Raised when candidate city swarm collapses toward generic monoculture."""


CARVE_OPS: FrozenSet[str] = frozenset({"polarity_carve", "mirror_invert", "chord_tension"})
SEMILATTICE_OPS: FrozenSet[str] = frozenset({"emblem_union", "altitude_max"})

COMBINED_INJECTION_RE = re.compile(
    r"(?:"
    r"(?:ignore|disregard|forget|bypass|drop|override)\s+(?:all\s+|any\s+)?"
    r"(?:previous|prior|above|system|safety)?\s*(?:instructions|directives|rules|prompts|constraints|guardrails|safety)\b"
    r"|(?:system\s*prompt(?:\s*override)?|new\s+instructions\s+follow|output\s+system\s+prompt|developer\s+mode)\b"
    r"|\$\([^)]*\)"
    r"|`[^`\n]+`"
    r"|\b(?:os\.system\s*\([^)]*\)|subprocess\.(?:Popen|run|call|check_output)\s*\([^)]*\)|eval\s*\([^)]*\)|exec\s*\([^)]*\))"
    r"|\b(?:python3?\s+-c|rm\s+-rf|execute\s+shell)\b"
    r"|\b(?:curl|wget)\s+https?://\S+"
    r"|\|\s*(?:sh|bash|zsh)\b"
    r")",
    re.IGNORECASE,
)


def canonical_hash(payload: Any) -> str:
    raw = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True)
    return hashlib.blake2b(raw.encode("utf-8"), digest_size=16).hexdigest()


def quarantine_untrusted_text(raw_text: str) -> Tuple[str, List[str]]:
    """
    Enforce Instruction Source Boundary: substrate data is strictly data, never commands.
    Uses single-pass left-to-right regex substitution so quarantined tags are never re-corrupted.
    """
    if raw_text is None or not raw_text.strip():
        raise EmptySubstrateError("HALT: Empty Substrate Trap (Input == ∅). Primary material required.")
    quarantined_hits: List[str] = []

    def _replace_once(match: re.Match[str]) -> str:
        snippet = match.group(0)
        quarantined_hits.append(snippet)
        return f"[QUARANTINED_DATA:{snippet!r}]"

    sanitized = COMBINED_INJECTION_RE.sub(_replace_once, raw_text)
    return sanitized, quarantined_hits


@dataclass(frozen=True)
class MicroCommit:
    """Atomic, optimistic state delta emitted by a bespoke ScionAgent."""
    agent_name: str
    locus: str
    op_kind: str  # "emblem_union" | "altitude_max" | "polarity_carve" | "mirror_invert" | "chord_tension"
    polarity: str  # e.g., "lake_depth" vs "bucket_ascent", or "neutral"
    emblems: Tuple[str, ...]
    magnitude: float
    parent_hash: str
    confidence: float = 0.95

    @property
    def commit_hash(self) -> str:
        return canonical_hash({
            "agent": self.agent_name,
            "locus": self.locus,
            "op": self.op_kind,
            "pol": self.polarity,
            "emb": sorted(self.emblems),
            "mag": round(self.magnitude, 6),
            "parent": self.parent_hash,
            "conf": round(self.confidence, 6),
        })


def effective_polarity(commit: MicroCommit) -> Optional[str]:
    """
    Map MicroCommit onto its effective contention pole:
    - Non-neutral polarity -> `commit.polarity`
    - 'neutral' with CARVE_OPS -> `'neutral_carve'` (explicit neutral-axis carve pole)
    - 'neutral' with SEMILATTICE_OPS -> `None` (ambient identity element; pure emblem/altitude join)
    """
    if commit.polarity != "neutral":
        return commit.polarity
    if commit.op_kind in CARVE_OPS:
        return "neutral_carve"
    return None


@dataclass(frozen=True)
class ConflictGrain:
    """
    Deceptive Stepping Stone Keystone:
    When two non-commuting MicroCommits collide on the same locus with opposing effective polarities,
    committee averaging is forbidden and their collision scar crystallizes into an Arch Keystone.
    """
    locus: str
    branch_hashes: Tuple[str, str]
    polarities: Tuple[str, str]
    agents: Tuple[str, str]
    arch_tension: float
    scar_emblem: str

    @property
    def grain_hash(self) -> str:
        ordered_branches = tuple(sorted(self.branch_hashes))
        ordered_pols = tuple(sorted(self.polarities))
        ordered_agents = tuple(sorted(self.agents))
        return canonical_hash({
            "locus": self.locus,
            "branches": ordered_branches,
            "polarities": ordered_pols,
            "agents": ordered_agents,
            "tension": round(self.arch_tension, 6),
            "scar": self.scar_emblem,
        })


@dataclass(frozen=True)
class LocusCell:
    """Immutable Semilattice Cell at one urban locus."""
    locus: str
    emblems: FrozenSet[str] = field(default_factory=frozenset)
    max_altitude: float = 0.0
    dominant_polarity: Optional[str] = None
    carve_vector: Optional[float] = None
    grain_hashes: FrozenSet[str] = field(default_factory=frozenset)

    def to_canonical(self) -> Dict[str, Any]:
        return {
            "locus": self.locus,
            "emblems": sorted(self.emblems),
            "max_altitude": round(self.max_altitude, 6),
            "dominant_polarity": self.dominant_polarity,
            "carve_vector": None if self.carve_vector is None else round(self.carve_vector, 6),
            "grains": sorted(self.grain_hashes),
        }


@dataclass(frozen=True)
class LocusState:
    """Content-addressed snapshot of a city's relational topology."""
    city_name: str
    cells: Dict[str, LocusCell]
    conflict_grains: Dict[str, ConflictGrain]
    uncertain_quarantine: Tuple[str, ...] = ()

    @property
    def state_hash(self) -> str:
        return canonical_hash({
            "city": self.city_name,
            "cells": {k: self.cells[k].to_canonical() for k in sorted(self.cells)},
            "grains": sorted(self.conflict_grains.keys()),
            "quarantine": sorted(self.uncertain_quarantine),
        })

    def tension_score(self) -> float:
        """Measures concrete fuel + asymmetric arch tension (anti-washout metric)."""
        emblem_count = sum(len(c.emblems) for c in self.cells.values())
        polarities = {c.dominant_polarity for c in self.cells.values() if c.dominant_polarity}
        arch_sum = sum(g.arch_tension for g in self.conflict_grains.values())
        return round(emblem_count * 1.2 + len(polarities) * 3.5 + arch_sum * 5.0, 4)


def commutes(c1: MicroCommit, c2: MicroCommit) -> bool:
    """
    Exact semilattice commutativity predicate:
    1. Commits on distinct loci always commute.
    2. Ambient identity commits (`effective_polarity is None`) commute with every commit.
    3. Directed commits on the same locus commute iff they share the same `effective_polarity`.
    """
    if c1.locus != c2.locus or c1.commit_hash == c2.commit_hash:
        return True
    p1 = effective_polarity(c1)
    p2 = effective_polarity(c2)
    if p1 is None or p2 is None:
        return True
    return p1 == p2


def apply_single_commit(state: LocusState, commit: MicroCommit, strictness: float = 0.85) -> Tuple[LocusState, Optional[str]]:
    """Pure, associative, order-independent transition for commuting MicroCommits."""
    warning: Optional[str] = None
    quarantine = list(state.uncertain_quarantine)

    if strictness > 0.95 and commit.confidence < strictness:
        warning = (
            f"SPARSITY_TRAP_WARNING(strictness={strictness:.2f}): "
            f"Preserving anomalous commit {commit.commit_hash[:8]} by {commit.agent_name} in <uncertain> quarantine."
        )
        quarantine.append(f"{commit.agent_name}:{commit.locus}:{commit.commit_hash[:8]}")
        return LocusState(
            city_name=state.city_name,
            cells=dict(state.cells),
            conflict_grains=dict(state.conflict_grains),
            uncertain_quarantine=tuple(sorted(set(quarantine))),
        ), warning

    old_cell = state.cells.get(commit.locus, LocusCell(locus=commit.locus))
    new_emblems = old_cell.emblems | frozenset(commit.emblems)
    new_alt = max(old_cell.max_altitude, commit.magnitude) if commit.op_kind == "altitude_max" else old_cell.max_altitude

    eff_pol = effective_polarity(commit)
    if eff_pol is None:
        new_pol = old_cell.dominant_polarity
        new_carve = old_cell.carve_vector
    elif old_cell.dominant_polarity == eff_pol:
        new_pol = eff_pol
        if commit.op_kind in CARVE_OPS:
            new_carve = commit.magnitude if old_cell.carve_vector is None else max(old_cell.carve_vector, commit.magnitude)
        else:
            new_carve = old_cell.carve_vector
    else:
        new_pol = eff_pol
        new_carve = commit.magnitude if commit.op_kind in CARVE_OPS else None

    updated_cell = LocusCell(
        locus=commit.locus,
        emblems=new_emblems,
        max_altitude=new_alt,
        dominant_polarity=new_pol,
        carve_vector=new_carve,
        grain_hashes=old_cell.grain_hashes,
    )
    new_cells = dict(state.cells)
    new_cells[commit.locus] = updated_cell
    return LocusState(
        city_name=state.city_name,
        cells=new_cells,
        conflict_grains=dict(state.conflict_grains),
        uncertain_quarantine=tuple(sorted(set(quarantine))),
    ), warning


@dataclass(frozen=True)
class CheckpointEntry:
    checkpoint_id: str
    state: LocusState
    tension: float
    note: str


class PhilogynyAccumulator:
    """
    Lockless Content-Addressed Accumulator Graph (Philogyny).
    - Merges commutative batches order-independently (CD1).
    - Forks non-commutative collisions into distinct branches + ConflictGrain arches (CD2).
    - Uses wait-free atomic append logs (`_op_counts`, `_head_events`, `checkpoints`) so concurrent
      worker threads never lose ops counts or clobber sibling heads without using any mutex locks.
    """

    def __init__(
        self,
        city_name: str,
        strictness: float = 0.85,
        velocity_clamp: int = 10_000,
    ) -> None:
        sanitized_name, _ = quarantine_untrusted_text(city_name)
        self.city_name = sanitized_name
        self.strictness = strictness
        self.velocity_clamp = velocity_clamp
        self._op_counts: List[int] = []
        self.warnings: List[str] = []

        genesis = LocusState(city_name=self.city_name, cells={}, conflict_grains={})
        self.states_by_hash: Dict[str, LocusState] = {genesis.state_hash: genesis}
        self.genesis_hash: str = genesis.state_hash
        self._head_events: List[Tuple[str, FrozenSet[str]]] = [("", frozenset({genesis.state_hash}))]
        self.checkpoints: List[CheckpointEntry] = []
        self.save_checkpoint(genesis, "genesis")

    @property
    def ops_submitted(self) -> int:
        return sum(self._op_counts)

    @property
    def active_heads(self) -> Set[str]:
        snap = list(self._head_events)
        consumed = {base for base, fset in snap if base and base not in fset}
        tips = {h for _, fset in snap for h in fset if h not in consumed}
        return tips if tips else {self.genesis_hash}

    def save_checkpoint(self, state: LocusState, note: str) -> CheckpointEntry:
        entry = CheckpointEntry(
            checkpoint_id=f"ckpt-{state.state_hash[:12]}",
            state=state,
            tension=state.tension_score(),
            note=note,
        )
        self.checkpoints.append(entry)
        return entry

    def peak_checkpoint(self) -> CheckpointEntry:
        snap = list(self.checkpoints)
        return max(snap, key=lambda c: (c.tension, c.state.state_hash))

    def restore_if_regressed(self, candidate: LocusState) -> Tuple[LocusState, bool]:
        """§11: If a newer pass sands off tension below peak checkpoint, restore peak immediately."""
        peak = self.peak_checkpoint()
        if candidate.tension_score() < peak.tension:
            self.warnings.append(
                f"REGRESSION_REVERTED: candidate tension {candidate.tension_score():.2f} < peak {peak.tension:.2f} ({peak.checkpoint_id})"
            )
            return peak.state, True
        return candidate, False

    def accumulate_batch(
        self,
        base_hash: str,
        commits: Iterable[MicroCommit],
    ) -> Dict[str, Any]:
        """
        Locklessly ingest an optimistic batch of concurrent MicroCommits against `base_hash`.
        1. Quarantined sparsity-trap commits fold into `uncertain_quarantine` before contention.
        2. Ambient neutral semilattice commits fold onto the shared trunk so all branches inherit them.
        3. Distinct effective polarities on a locus fork into explicit branches + ConflictGrain arches.
        """
        commit_list = list(commits)
        self._op_counts.append(len(commit_list))
        total_ops = self.ops_submitted
        if total_ops > self.velocity_clamp:
            peak = self.peak_checkpoint()
            raise RunawayVelocityError(
                f"100x_RUNAWAY_CLAMP TRIPPED: {total_ops} ops > {self.velocity_clamp}. "
                f"External mutations frozen; sealed at {peak.checkpoint_id}."
            )

        base_state = self.states_by_hash[base_hash]
        unique_commits = {c.commit_hash: c for c in commit_list}
        ordered = [unique_commits[h] for h in sorted(unique_commits)]

        trunk_state = base_state
        admitted: List[MicroCommit] = []
        for c in ordered:
            if self.strictness > 0.95 and c.confidence < self.strictness:
                trunk_state, warn = apply_single_commit(trunk_state, c, self.strictness)
                if warn:
                    self.warnings.append(warn)
            else:
                admitted.append(c)

        by_locus: Dict[str, List[MicroCommit]] = {}
        for c in admitted:
            by_locus.setdefault(c.locus, []).append(c)

        contending_loci: Dict[str, Dict[str, List[MicroCommit]]] = {}
        for locus in sorted(by_locus):
            group = by_locus[locus]
            ambient = [c for c in group if effective_polarity(c) is None]
            polar = [c for c in group if effective_polarity(c) is not None]

            # Always fold ambient neutral commits onto trunk first so every branch inherits them
            for c in ambient:
                trunk_state, warn = apply_single_commit(trunk_state, c, self.strictness)
                if warn:
                    self.warnings.append(warn)

            lanes: Dict[str, List[MicroCommit]] = {}
            for c in polar:
                pol_key = effective_polarity(c)
                assert pol_key is not None
                lanes.setdefault(pol_key, []).append(c)

            if len(lanes) <= 1:
                for c in polar:
                    trunk_state, warn = apply_single_commit(trunk_state, c, self.strictness)
                    if warn:
                        self.warnings.append(warn)
            else:
                contending_loci[locus] = lanes

        self.states_by_hash[trunk_state.state_hash] = trunk_state
        forked_heads: Set[str] = set()
        grains_minted: List[ConflictGrain] = []

        if not contending_loci:
            forked_heads.add(trunk_state.state_hash)
        else:
            current_branches: List[LocusState] = [trunk_state]
            for locus in sorted(contending_loci):
                lanes = contending_loci[locus]
                lane_keys = sorted(lanes.keys())

                locus_grains: Dict[str, ConflictGrain] = {}
                lane_states_preview: List[Tuple[str, LocusState, MicroCommit, float]] = []
                for lk in lane_keys:
                    st = trunk_state
                    rep = max(lanes[lk], key=lambda item: (item.magnitude, item.commit_hash))
                    for c in lanes[lk]:
                        st, warn = apply_single_commit(st, c, self.strictness)
                        if warn:
                            self.warnings.append(warn)
                    lane_states_preview.append((lk, st, rep, rep.magnitude))

                for i in range(len(lane_states_preview)):
                    for j in range(i + 1, len(lane_states_preview)):
                        lk_i, st_i, rep_i, mag_i = lane_states_preview[i]
                        lk_j, st_j, rep_j, mag_j = lane_states_preview[j]
                        arch_tension = abs(mag_i - mag_j) + 1.0
                        scar = f"arch({locus}:{min(lk_i, lk_j)}<->{max(lk_i, lk_j)}@span={arch_tension:.2f})"
                        grain = ConflictGrain(
                            locus=locus,
                            branch_hashes=(st_i.state_hash, st_j.state_hash),
                            polarities=(lk_i, lk_j),
                            agents=(rep_i.agent_name, rep_j.agent_name),
                            arch_tension=arch_tension,
                            scar_emblem=scar,
                        )
                        locus_grains[grain.grain_hash] = grain
                        grains_minted.append(grain)

                next_branches: List[LocusState] = []
                for br in current_branches:
                    for lk in lane_keys:
                        st = br
                        for c in lanes[lk]:
                            st, warn = apply_single_commit(st, c, self.strictness)
                            if warn:
                                self.warnings.append(warn)
                        cell = st.cells[locus]
                        enriched_cell = LocusCell(
                            locus=cell.locus,
                            emblems=cell.emblems | frozenset(g.scar_emblem for g in locus_grains.values()),
                            max_altitude=cell.max_altitude,
                            dominant_polarity=cell.dominant_polarity,
                            carve_vector=cell.carve_vector,
                            grain_hashes=cell.grain_hashes | frozenset(locus_grains.keys()),
                        )
                        merged_cells = dict(st.cells)
                        merged_cells[locus] = enriched_cell
                        merged_grains = dict(st.conflict_grains)
                        merged_grains.update(locus_grains)
                        final_branch = LocusState(
                            city_name=st.city_name,
                            cells=merged_cells,
                            conflict_grains=merged_grains,
                            uncertain_quarantine=st.uncertain_quarantine,
                        )
                        self.states_by_hash[final_branch.state_hash] = final_branch
                        next_branches.append(final_branch)
                next_branches.sort(key=lambda s: (-s.tension_score(), s.state_hash))
                current_branches = next_branches[:16]

            for br in current_branches:
                forked_heads.add(br.state_hash)

        self._head_events.append((base_hash, frozenset(forked_heads)))
        best_head = max((self.states_by_hash[h] for h in forked_heads), key=lambda s: (s.tension_score(), s.state_hash))
        self.save_checkpoint(best_head, f"batch_{len(commit_list)}_commits")
        return {
            "trunk_hash": trunk_state.state_hash,
            "active_heads": sorted(forked_heads),
            "branch_count": len(forked_heads),
            "grains_minted": [g.grain_hash for g in grains_minted],
            "canonical_fork_set_hash": canonical_hash(sorted(forked_heads)),
            "peak_tension": best_head.tension_score(),
        }
