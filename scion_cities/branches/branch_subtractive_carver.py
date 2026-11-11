"""Subtractive Exception Swarm — Inverted Urban Axiom Carving Lattice.
Owner: stone-erosion | Pinned: olog_rev_001 (94c837a32a540b11ede764902ba495123341a9ca6baae43ddd62024864c80fa1)
Operators: invert_axiom, simplify_rules | Zero locks; SHA-256 content-addressed states.
"""
from __future__ import annotations
from dataclasses import dataclass, field
import hashlib
import math
from typing import Callable, Iterable, Union

OWNER = "stone-erosion"
PINNED_INPUT_REVISION = "olog_rev_001"
PINNED_INPUT_SHA256 = "94c837a32a540b11ede764902ba495123341a9ca6baae43ddd62024864c80fa1"
ALLOWED_MUTATION_OPERATORS = ("invert_axiom", "simplify_rules")
TOO_PROBABLE_FLOOR = 0.50  # Shannon bits; blocks collapse into single-stratum monoculture
Coord = tuple[int, int, int]

@dataclass(frozen=True, order=True)
class MatterCell:
    coord: Coord
    kind: str

@dataclass(frozen=True, order=True)
class SupportArch:
    arch_id: str
    crown: MatterCell
    piers: tuple[MatterCell, ...]
    min_piers: int = 1
    def is_satisfied(self, active: set[MatterCell]) -> bool:
        return self.crown not in active or sum(p in active for p in self.piers) >= self.min_piers

@dataclass(frozen=True)
class LatticeState:
    cells: tuple[MatterCell, ...]
    arches: tuple[SupportArch, ...]
    digest: str = field(init=False)
    def __post_init__(self) -> None:
        canon_cells, canon_arches = tuple(sorted(set(self.cells))), tuple(sorted(set(self.arches)))
        object.__setattr__(self, "cells", canon_cells)
        object.__setattr__(self, "arches", canon_arches)
        h = hashlib.sha256(f"rev:{PINNED_INPUT_SHA256}|".encode())
        for c in canon_cells:
            h.update(f"c:{c.coord}:{c.kind};".encode())
        for a in canon_arches:
            h.update(f"a:{a.arch_id}:{a.crown}:{a.piers}:{a.min_piers};".encode())
        object.__setattr__(self, "digest", h.hexdigest())
    def kind_counts(self) -> dict[str, int]:
        counts: dict[str, int] = {}
        for c in self.cells:
            counts[c.kind] = counts.get(c.kind, 0) + 1
        return counts
    def entropy(self) -> float:
        n_all = len(self.cells)
        return 0.0 if not n_all else -sum((n / n_all) * math.log2(n / n_all) for n in self.kind_counts().values())
    def arches_intact(self) -> bool:
        active = set(self.cells)
        return all(arch.is_satisfied(active) for arch in self.arches)
    def subtract_one(self, target: MatterCell) -> LatticeState:
        return self if target not in self.cells else LatticeState(tuple(c for c in self.cells if c != target), self.arches)

@dataclass(frozen=True)
class ConflictGrain:
    base_digest: str
    violated_arches: tuple[str, ...]
    keystone_cells: tuple[MatterCell, ...]
    branches: tuple[LatticeState, LatticeState]
    digest: str = field(init=False)
    def __post_init__(self) -> None:
        ordered = tuple(sorted(self.branches, key=lambda b: b.digest))
        keys, arches = tuple(sorted(set(self.keystone_cells))), tuple(sorted(set(self.violated_arches)))
        object.__setattr__(self, "branches", (ordered[0], ordered[1]))
        object.__setattr__(self, "keystone_cells", keys)
        object.__setattr__(self, "violated_arches", arches)
        raw = f"grain:{self.base_digest}|{arches}|{keys}|{ordered[0].digest},{ordered[1].digest}"
        object.__setattr__(self, "digest", hashlib.sha256(raw.encode()).hexdigest())

class ProbabilityFloorWarden:
    def __init__(self, too_probable_floor: float = TOO_PROBABLE_FLOOR) -> None:
        self.too_probable_floor = too_probable_floor
    def allows(self, state: LatticeState) -> bool:
        return bool(state.cells) and state.entropy() >= self.too_probable_floor
    def try_subtract(self, state: LatticeState, target: MatterCell) -> tuple[LatticeState, str]:
        if target not in state.cells:
            return state, "ABSENT"
        nxt = state.subtract_one(target)
        if not nxt.arches_intact():
            return state, "ARCH_KEYSTONE_LOCKED"
        return (nxt, "CARVED") if self.allows(nxt) else (state, "HALT_TOO_PROBABLE_FLOOR")
    def carve(self, state: LatticeState) -> LatticeState:
        dominant, cur = max(state.kind_counts().items(), key=lambda kv: (kv[1], kv[0]))[0], state
        for cell in state.cells:
            if cell.kind == dominant:
                nxt, status = self.try_subtract(cur, cell)
                if status == "CARVED" and nxt.entropy() >= cur.entropy():
                    cur = nxt
        return cur
    def carve_until_floor(self, state: LatticeState, targets: Iterable[MatterCell]) -> tuple[LatticeState, int, str]:
        cur, removed = state, 0
        for cell in targets:
            nxt, status = self.try_subtract(cur, cell)
            if status == "HALT_TOO_PROBABLE_FLOOR":
                return cur, removed, status
            if status == "CARVED":
                cur, removed = nxt, removed + 1
        return cur, removed, "COMPLETED"

class ClayVoidBorer:
    def __init__(self, warden: ProbabilityFloorWarden, zone: Callable[[Coord], bool] = lambda _: True) -> None:
        self.warden, self.zone = warden, zone
    def carve(self, state: LatticeState) -> LatticeState:
        vein_cols, cur = {(c.coord[0], c.coord[1]) for c in state.cells if c.kind == "worm_vein"}, state
        for c in state.cells:
            if c.kind == "argia_clay" and self.zone(c.coord) and (c.coord[0], c.coord[1]) in vein_cols:
                cur, _ = self.warden.try_subtract(cur, c)
        return cur

class WallDissolver:
    def __init__(self, warden: ProbabilityFloorWarden, zone: Callable[[Coord], bool] = lambda _: True) -> None:
        self.warden, self.zone = warden, zone
    def carve(self, state: LatticeState) -> LatticeState:
        piped, cur = {c.coord for c in state.cells if c.kind == "singing_pipe"}, state
        for c in state.cells:
            if c.kind == "armilla_masonry" and self.zone(c.coord) and c.coord in piped:
                cur, _ = self.warden.try_subtract(cur, c)
        return cur

class ChordIsolator:
    def __init__(self, warden: ProbabilityFloorWarden, zone: Callable[[Coord], bool] = lambda _: True) -> None:
        self.warden, self.zone = warden, zone
    def carve(self, state: LatticeState) -> LatticeState:
        spanned, cur = {c.coord for c in state.cells if c.kind == "taut_chord"}, state
        for c in state.cells:
            if c.kind == "ersilia_house" and self.zone(c.coord) and c.coord in spanned:
                cur, _ = self.warden.try_subtract(cur, c)
        return cur

def join_subtractions(
    base: LatticeState, left: LatticeState, right: LatticeState, warden: ProbabilityFloorWarden
) -> Union[LatticeState, ConflictGrain]:
    base_set, left_set, right_set = set(base.cells), set(left.cells), set(right.cells)
    if not (left_set <= base_set and right_set <= base_set):
        raise ValueError("Additive mutation rejected under inverted urban axiom")
    merged = left_set & right_set
    candidate = LatticeState(tuple(merged), base.arches)
    violated = tuple(a.arch_id for a in base.arches if not a.is_satisfied(merged))
    if not violated and warden.allows(candidate):
        return candidate
    removed = (base_set - left_set) | (base_set - right_set)
    piers = {p for a in base.arches if a.arch_id in violated for p in a.piers}
    return ConflictGrain(base.digest, violated, tuple(sorted(removed & piers)) or tuple(sorted(left_set ^ right_set)), (left, right))

def build_saturated_lattice() -> LatticeState:
    coords = [(x, y, z) for x in range(3) for y in range(2) for z in range(2)]
    cells = [MatterCell(c, k) for c in coords for k in ("argia_clay", "armilla_masonry", "ersilia_house")]
    cells += [MatterCell(c, "worm_vein") for c in coords if c[2] == 0 or c in ((0, 0, 1), (2, 0, 1))]
    cells += [MatterCell(c, "singing_pipe") for c in coords if c[0] in (0, 1)]
    cells += [MatterCell(c, "taut_chord") for c in coords if c[2] == 1]
    arches = (
        SupportArch("ersilia_arch_north", MatterCell((1, 0, 1), "taut_chord"), (MatterCell((0, 0, 1), "armilla_masonry"), MatterCell((2, 0, 1), "ersilia_house"))),
        SupportArch("armilla_arch_south", MatterCell((1, 1, 1), "singing_pipe"), (MatterCell((0, 1, 0), "argia_clay"), MatterCell((2, 1, 0), "argia_clay"))),
    )
    return LatticeState(tuple(cells), arches)

if __name__ == "__main__":
    s_full, warden = build_saturated_lattice(), ProbabilityFloorWarden(TOO_PROBABLE_FLOOR)
    borer_n, dissolver_s = ClayVoidBorer(warden, lambda c: c[1] == 0), WallDissolver(warden, lambda c: c[1] == 1)
    s_1, s_2 = borer_n.carve(s_full), dissolver_s.carve(s_full)
    s_12, s_21 = dissolver_s.carve(s_1), borer_n.carve(s_2)
    j_12, j_21 = join_subtractions(s_full, s_1, s_2, warden), join_subtractions(s_full, s_2, s_1, warden)
    assert isinstance(j_12, LatticeState) and s_12 == s_21 == j_12 == j_21 and s_12.digest == s_21.digest and hash(s_12) == hash(s_21)
    dissolver_n, isolator_n = WallDissolver(warden, lambda c: c[1] == 0), ChordIsolator(warden, lambda c: c[1] == 0)
    s_west, s_east = dissolver_n.carve(s_full), isolator_n.carve(s_full)
    assert isolator_n.carve(s_west).digest != dissolver_n.carve(s_east).digest
    grain_we, grain_ew = join_subtractions(s_full, s_west, s_east, warden), join_subtractions(s_full, s_east, s_west, warden)
    assert isinstance(grain_we, ConflictGrain) and grain_we.violated_arches == ("ersilia_arch_north",) and grain_we.digest == grain_ew.digest
    assert len(warden.carve(s_full).cells) < len(s_full.cells) and warden.carve(s_full).entropy() >= s_full.entropy()
    sweep = [c for k in ("taut_chord", "singing_pipe", "ersilia_house", "armilla_masonry", "argia_clay") for c in s_full.cells if c.kind == k]
    s_halted, removed_n, halt_reason = warden.carve_until_floor(s_full, sweep)
    dissent = [c for c in s_halted.cells if c.kind != "worm_vein"]
    assert halt_reason == "HALT_TOO_PROBABLE_FLOOR" and len(dissent) == 1 and s_halted.subtract_one(dissent[0]).entropy() == 0.0
    print(f"OWNER={OWNER} PINNED={PINNED_INPUT_REVISION} S_FULL_CELLS={len(s_full.cells)} H0={s_full.entropy():.4f}")
    print(f"[PASS a] COMMUTATIVE S_12==S_21 digest={s_12.digest[:16]} cells={len(s_12.cells)} H={s_12.entropy():.4f}")
    print(f"[PASS b] CONFLICT_GRAIN arch={grain_we.violated_arches[0]} grain={grain_we.digest[:16]} forks={grain_we.branches[0].digest[:12]},{grain_we.branches[1].digest[:12]}")
    print(f"[PASS c] FLOOR_WARDEN reason={halt_reason} removed={removed_n} remaining={s_halted.kind_counts()} H_halt={s_halted.entropy():.4f}>={TOO_PROBABLE_FLOOR:.2f} H_next=0.0000")
