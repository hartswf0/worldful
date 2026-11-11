"""Asymmetric Mirror & Nested Sheath Swarm (Valdrada / Moriana / Berenice).

Owner: stone-sheath | Pinned Revision: olog_rev_001
Zero-dependency, lockless, content-addressed multi-sheath state topology.
"""
from __future__ import annotations

import ast
from dataclasses import dataclass
import hashlib
import inspect
import sys
import threading
import time
from typing import Optional, Sequence

OWNER = "stone-sheath"
PINNED_REVISION = "olog_rev_001"
PINNED_SHA256 = "94c837a32a540b11ede764902ba495123341a9ca6baae43ddd62024864c80fa1"
ALLOWED_OPERATORS = frozenset({"mirror_axis", "spawn_echo"})


@dataclass(frozen=True)
class SpecularAction:
    gesture: str
    valence: int
    axis: int = 1
    operator: str = "mirror_axis"

    def __post_init__(self) -> None:
        if self.operator not in ALLOWED_OPERATORS:
            raise ValueError(f"Disallowed rule-mutation operator: {self.operator}")


def value(action: SpecularAction) -> int:
    return action.valence


def mirror_axis(action: SpecularAction, depth: int = 0) -> SpecularAction:
    raw = (abs(action.valence) * (3 + 2 * (action.axis % 5)) + 7 * depth + 11) % 999_983 + 1
    if raw == abs(action.valence):
        raw = (raw % 999_983) + 1
    inv_val = -raw if action.valence >= 0 else raw
    return SpecularAction(f"mirror({action.gesture[-24:]})", inv_val, ((action.axis * 5 + depth + 2) % 17) + 1, "mirror_axis")


mirror = mirror_axis


def spawn_echo(action: SpecularAction, prior_valence: int, depth: int = 0) -> SpecularAction:
    signed_term = action.valence if action.valence >= 0 else (-action.valence * 11 + 3)
    raw = (abs(prior_valence) * 17 + signed_term * 5 + action.axis * 19 + depth * 13 + 7) % 999_979 + 1
    if raw == abs(action.valence):
        raw = (raw % 999_979) + 1
    echo_val = -raw if action.valence >= 0 else raw
    return SpecularAction(f"echo({action.gesture[-24:]})", echo_val, ((action.axis * 3 + abs(prior_valence) + depth + 1) % 19) + 1, "spawn_echo")


def _orient_valence(raw_val: int, depth: int, outer_mag: int) -> int:
    mag = abs(raw_val) or 1
    if mag == outer_mag:
        mag = (mag % 999_979) + 1
    return mag if depth % 2 == 0 else -mag


@dataclass(frozen=True)
class ChiralSheath:
    depth: int
    realm: str
    face: str
    persona: str
    operator: str
    valence: int
    axis: int
    gesture: str
    tick: int
    parent_digest: str
    inner: Optional["ChiralSheath"] = None
    digest: str = ""

    def compute_digest(self) -> str:
        inner_ref = self.inner.digest if self.inner is not None else "void"
        payload = (
            f"{PINNED_REVISION}:{PINNED_SHA256}|{self.depth}|{self.realm}|{self.face}|"
            f"{self.persona}|{self.operator}|{self.valence}|{self.axis}|"
            f"{self.gesture}|{self.tick}|{self.parent_digest}|{inner_ref}"
        ).encode("utf-8")
        return hashlib.blake2b(payload, digest_size=20).hexdigest()

    def __post_init__(self) -> None:
        if self.operator not in ALLOWED_OPERATORS or self.valence == 0:
            raise ValueError("Invalid operator or forbidden compromise zero-state")
        if self.inner is not None:
            if self.inner.tick != self.tick:
                raise ValueError("Nested sheaths must coexist simultaneously at t = now")
            if self.valence * self.inner.valence >= 0 or abs(self.valence) == abs(self.inner.valence) or self.face == self.inner.face:
                raise ValueError("Mirror parity asymmetry or Moriana obverse non-identity violated")
        object.__setattr__(self, "digest", self.compute_digest())

    def unfold(self) -> tuple["ChiralSheath", ...]:
        return (self,) + (self.inner.unfold() if self.inner is not None else ())


class VerandaSpecularInverter:
    def transduce(self, prior: Optional[ChiralSheath], act: SpecularAction, depth: int, outer_mag: int):
        step = spawn_echo(act, prior.valence if prior else (depth * 13 + 7), depth)
        val = _orient_valence(step.valence, depth, outer_mag)
        face = "sunlit-veranda" if depth % 2 == 0 else "cold-lake-inversion"
        return ("valdrada-veranda-lake", face, "mirror_axis", val, step.axis, step.gesture), mirror_axis(SpecularAction(act.gesture, val, step.axis, "mirror_axis"), depth)


class ObverseSheetFolder:
    def transduce(self, prior: Optional[ChiralSheath], act: SpecularAction, depth: int, outer_mag: int):
        creased = mirror_axis(act, depth + 1)
        step = spawn_echo(creased, prior.valence if prior else (depth * 17 + 11), depth)
        val = _orient_valence(step.valence, depth, outer_mag)
        face = "alabaster-coral-front" if depth % 2 == 0 else "rusted-tin-obverse"
        return ("moriana-sheet-obverse", face, "mirror_axis", val, step.axis, creased.gesture), mirror_axis(SpecularAction(creased.gesture, val, step.axis, "mirror_axis"), depth + 2)


class PulleyCommaInfiltrator:
    def transduce(self, prior: Optional[ChiralSheath], act: SpecularAction, depth: int, outer_mag: int):
        step = spawn_echo(act, abs(prior.valence if prior else (depth * 23 + 19)) * 3 + 1, depth)
        val = _orient_valence(step.valence, depth, outer_mag)
        face = "wire-pulley-just" if depth % 2 == 0 else "cog-grinder-crust"
        inv = mirror_axis(SpecularAction(act.gesture, val, step.axis, "spawn_echo"), depth)
        return ("berenice-pulley-comma", face, "spawn_echo", val, step.axis, step.gesture), spawn_echo(inv, val, depth + 1)


class PrideFermentGerminator:
    def transduce(self, prior: Optional[ChiralSheath], act: SpecularAction, depth: int, outer_mag: int):
        ferment = spawn_echo(act, abs(prior.valence if prior else (depth * 29 + 23)) * 5 + 7, depth)
        val = _orient_valence(ferment.valence, depth, outer_mag)
        face = "pride-ferment-germ" if depth % 2 == 0 else "window-awakening-seed"
        return ("berenice-pride-seed", face, "spawn_echo", val, ferment.axis, ferment.gesture), spawn_echo(SpecularAction(ferment.gesture, val, ferment.axis, "spawn_echo"), abs(val) + 3, depth + 1)


class SheathStack:
    def __init__(self) -> None:
        self.personas = (VerandaSpecularInverter(), ObverseSheetFolder(), PulleyCommaInfiltrator(), PrideFermentGerminator())
        self.cas_store: dict[str, ChiralSheath] = {}
        self.current_root: Optional[ChiralSheath] = None

    def _evolve(self, layers: tuple[ChiralSheath, ...], start_k: int, end_depth: int, act: SpecularAction, tick: int, update_root: bool = True) -> ChiralSheath:
        specs = [(s.depth, s.realm, s.face, s.persona, s.operator, s.valence, s.axis, s.gesture, s.digest) for s in layers[:start_k]]
        outer_mag = abs(layers[start_k - 1].valence) if start_k > 0 else 0
        for d in range(start_k, end_depth):
            prior = layers[d] if d < len(layers) else None
            pdig = prior.digest if prior is not None else (layers[start_k].digest if layers else "genesis")
            persona = self.personas[d % 4]
            (realm, face, op, val, axis, gest), act = persona.transduce(prior, act, d, outer_mag)
            specs.append((d, realm, face, type(persona).__name__, op, val, axis, gest, pdig))
            outer_mag = abs(val)
        inner: Optional[ChiralSheath] = None
        for d, realm, face, pname, op, val, axis, gest, pdig in reversed(specs):
            inner = ChiralSheath(d, realm, face, pname, op, val, axis, gest, tick, pdig, inner)
            self.cas_store[inner.digest] = inner
        assert inner is not None
        if update_root:
            self.current_root = inner
        return inner

    def germinate_tick(self, impulse: SpecularAction, tick: int = 1, depth_count: int = 4) -> ChiralSheath:
        return self._evolve((), 0, depth_count, impulse, tick, update_root=True)

    def inscribe_at(self, target_k: int, action: SpecularAction, tick: int, base_root: Optional[ChiralSheath] = None, update_root: bool = True) -> ChiralSheath:
        layers = (base_root or self.current_root).unfold()  # type: ignore[union-attr]
        return self._evolve(layers, target_k, len(layers) + (1 if target_k == len(layers) - 1 else 0), action, tick, update_root=update_root)

    def run_lockless_swarm(self, micro_commits: Sequence[tuple[int, SpecularAction]]) -> tuple[tuple[str, ...], ChiralSheath]:
        if self.current_root is None:
            self.germinate_tick(SpecularAction("genesis-veranda", 19, 3), tick=1)
        anchor = self.current_root
        assert anchor is not None
        slots: list[Optional[ChiralSheath]] = [None] * len(micro_commits)

        def _contend(idx: int, depth_k: int, act: SpecularAction) -> None:
            time.sleep(0)
            slots[idx] = self.inscribe_at(depth_k, act, tick=100 + idx, base_root=anchor, update_root=False)

        fibers = [threading.Thread(target=_contend, args=(i, k, act)) for i, (k, act) in enumerate(micro_commits)]
        for f in fibers:
            f.start()
        for f in fibers:
            f.join()
        committed = tuple(s for s in slots if s is not None)
        tips = sorted(committed, key=lambda s: s.digest)
        horizon = tips[0]
        for idx, tip in enumerate(tips[1:], start=1):
            leaf = tip.unfold()[-1]
            horizon = self.inscribe_at(idx % 4, SpecularAction(leaf.gesture, leaf.valence, leaf.axis, leaf.operator), 1000 + idx, horizon, update_root=False)
        self.current_root = horizon
        return tuple(s.digest for s in committed), horizon


if __name__ == "__main__":
    tree = ast.parse(inspect.getsource(sys.modules[__name__]))
    used = {n.id if isinstance(n, ast.Name) else n.attr for n in ast.walk(tree) if isinstance(n, (ast.Name, ast.Attribute))}
    assert used.isdisjoint({"Lock", "RLock", "Semaphore", "BoundedSemaphore", "Condition", "Barrier", "Queue"})

    stack = SheathStack()
    root = stack.germinate_tick(SpecularAction("veranda-lantern", 23, 3, "mirror_axis"), tick=7)
    layers = root.unfold()
    assert len(layers) == 4 and {s.tick for s in layers} == {7}
    assert [s.persona for s in layers] == ["VerandaSpecularInverter", "ObverseSheetFolder", "PulleyCommaInfiltrator", "PrideFermentGerminator"]
    act_a, act_b = SpecularAction("balustrade-gaze", 17, 2, "mirror_axis"), SpecularAction("tin-rattle", -31, 5, "spawn_echo")
    ab = stack.inscribe_at(0, act_b, 9, stack.inscribe_at(0, act_a, 8, root))
    ba = stack.inscribe_at(0, act_a, 9, stack.inscribe_at(0, act_b, 8, root))
    assert ab.digest != ba.digest and ab.inner.valence != ba.inner.valence  # type: ignore[union-attr]
    spawned = stack.inscribe_at(3, SpecularAction("window-stir", 41, 4, "spawn_echo"), 10, root)
    assert len(spawned.unfold()) == 5 and {s.tick for s in spawned.unfold()} == {10}

    for v in range(-300, 301):
        probe = SpecularAction("probe", v, (abs(v) % 5) + 1)
        refl = mirror(probe, abs(v) % 4)
        assert value(refl) != value(probe) and abs(value(refl)) != abs(value(probe)) and value(mirror(refl)) != value(probe)
    for candidate in (root, ab, ba, spawned):
        chain = candidate.unfold()
        for up, dn in zip(chain, chain[1:]):
            mid = (up.valence + dn.valence) / 2
            assert up.valence * dn.valence < 0 and abs(up.valence) != abs(dn.valence) and up.valence != mid and dn.valence != mid

    swarm = SheathStack()
    swarm.germinate_tick(SpecularAction("berenice-dawn", 29, 4), tick=1)
    commits = [(i % 4, SpecularAction(f"micro-{i}", (i * 11 + 5) * (-1 if i % 2 else 1), (i % 6) + 1, "mirror_axis" if i % 2 == 0 else "spawn_echo")) for i in range(50)]
    digests, horizon = swarm.run_lockless_swarm(commits)
    assert len(digests) == 50 == len(set(digests)) and all(n.compute_digest() == d for d, n in swarm.cas_store.items())
    witness = hashlib.sha256(f"{PINNED_SHA256}:{horizon.digest}:{len(swarm.cas_store)}".encode()).hexdigest()[:24]
    print(f"[PASS] owner={OWNER} rev={PINNED_REVISION} ops={sorted(ALLOWED_OPERATORS)}")
    print(f"[PASS] (a) 4-deep simultaneous germination tick={root.tick} valences={[s.valence for s in layers]} noncomm={ab.digest[:10]}!={ba.digest[:10]} spawned_depth={len(spawned.unfold())}")
    print(f"[PASS] (b) mirror parity asymmetry verified across 601 probes & {sum(len(c.unfold()) - 1 for c in (root, ab, ba, spawned))} mirror planes (zero compromise averages)")
    print(f"[PASS] (c) lockless swarm commits={len(digests)} unique_digests={len(set(digests))} cas_sheaths={len(swarm.cas_store)} horizon={horizon.digest[:16]} sha256_witness={witness}")
