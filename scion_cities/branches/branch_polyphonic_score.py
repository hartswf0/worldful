"""Temporal-Acoustic Polyphonic Swarm (Zora, Melania, Raissa) — Owner: stone-polyphony."""
from __future__ import annotations
from dataclasses import dataclass
from fractions import Fraction
import hashlib

OWNER = "stone-polyphony"
PINNED_REVISION = ("olog_rev_001", "94c837a32a540b11ede764902ba495123341a9ca6baae43ddd62024864c80fa1")
ALLOWED_MUTATION_OPERATORS = ("transmute_medium", "slow_time")
ZORA_MOTIFS = ("copper_clock", "striped_awning", "nine_jet_fountain")
MELANIA_MASKS = ("braggart_soldier", "parasite_jester", "amorous_daughter", "hypocrite_priest")
RAISSA_CHAIN = ("child", "dog", "mason", "maid", "horse", "painted_bird")
JUST_INTERVALS = (
    Fraction(1, 1), Fraction(9, 8), Fraction(6, 5), Fraction(5, 4),
    Fraction(4, 3), Fraction(3, 2), Fraction(8, 5), Fraction(5, 3), Fraction(15, 8),
)


def _fold_octave(r: Fraction) -> Fraction:
    while r >= 2 or r < 1:
        r *= Fraction(1, 2) if r >= 2 else 2
    return r


def transmute_medium(ratio: Fraction, landmark_idx: int) -> Fraction:
    """Allowed Operator 1: transmutes urban medium into a 5-limit just-intonation interval."""
    shifted = _fold_octave(ratio * JUST_INTERVALS[(landmark_idx % (len(JUST_INTERVALS) - 1)) + 1])
    return shifted if shifted.denominator <= 64 else JUST_INTERVALS[(shifted.numerator + landmark_idx) % 9]


def slow_time(phase_ms: float, dilation: Fraction) -> float:
    """Allowed Operator 2: dilates metric time to emit a rhythmic millisecond phase shift."""
    return round((phase_ms + float(dilation) * 0.235) % 96.0, 4)


@dataclass(frozen=True)
class HarmonicEmission:
    emitter: str
    voice_label: str
    ratio: Fraction
    phase_ms: float
    motif: str


@dataclass(frozen=True)
class MortalMaskIncarnation:
    mask_role: str
    cantor_moniker: str
    ttl: int
    phrase_clause: int
    ratio: Fraction
    phase_ms: float


@dataclass(frozen=True)
class RaissaJoyChain:
    hops: tuple[str, ...]
    hop_ms: tuple[float, ...]
    unhappy_ledger: tuple[tuple[str, str], ...]
    span_ms: float
    closed: bool


@dataclass(frozen=True)
class ZoraDisintegrationEvent:
    erased_tip_cid: str
    static_ticks: int
    dissolved_motifs: tuple[str, ...]


@dataclass(frozen=True)
class ScoreSnapshot:
    tick: int
    parent_cids: tuple[str, ...]
    emissions: tuple[HarmonicEmission, ...]
    incarnations: tuple[MortalMaskIncarnation, ...]
    expired_cantors: tuple[str, ...]
    joy_chain: RaissaJoyChain
    score_digest: str
    cid: str

    @staticmethod
    def seal(tick: int, parent_cids: tuple[str, ...], emissions: tuple[HarmonicEmission, ...],
             incarnations: tuple[MortalMaskIncarnation, ...], expired: tuple[str, ...], joy: RaissaJoyChain) -> ScoreSnapshot:
        body = "|".join(f"{e.emitter}:{e.voice_label}:{e.ratio}:{e.phase_ms:.4f}:{e.motif}" for e in emissions)
        digest = hashlib.sha256(body.encode()).hexdigest()[:24]
        cid = hashlib.sha256(f"{PINNED_REVISION[0]}:{PINNED_REVISION[1]}|{tick}|{','.join(parent_cids)}|{digest}".encode()).hexdigest()[:24]
        return ScoreSnapshot(tick, parent_cids, emissions, incarnations, expired, joy, digest, cid)


@dataclass(frozen=True)
class ScoreDAG:
    snapshots: tuple[ScoreSnapshot, ...]

    def by_cid(self, cid: str) -> ScoreSnapshot:
        return next(s for s in reversed(self.snapshots) if s.cid == cid)

    def commit(self, snap: ScoreSnapshot) -> ScoreDAG:
        return ScoreDAG(self.snapshots + (snap,))


@dataclass(frozen=True)
class CopperClockOstinato:
    jet_harmonics: tuple[Fraction, ...] = JUST_INTERVALS

    def sound(self, prev: ScoreSnapshot, tick: int, mutate: bool) -> HarmonicEmission:
        prior = next(e for e in prev.emissions if e.emitter == "CopperClockOstinato")
        motif, jet = ZORA_MOTIFS[tick % len(ZORA_MOTIFS)], self.jet_harmonics[tick % len(self.jet_harmonics)]
        return prior if not mutate else HarmonicEmission(
            "CopperClockOstinato", "zora_ostinato", transmute_medium(prior.ratio, tick), slow_time(prior.phase_ms, jet), f"{motif}:jet_{(tick % 9) + 1}"
        )


@dataclass(frozen=True)
class RoleMaskReassigner:
    phrase_len: int = 5

    def advance(self, prev: ScoreSnapshot, tick: int, mutate: bool) -> tuple[tuple[MortalMaskIncarnation, ...], tuple[HarmonicEmission, ...], tuple[str, ...]]:
        if not mutate:
            return prev.incarnations, tuple(e for e in prev.emissions if e.emitter == "RoleMaskReassigner"), ()
        incarnations, emissions, expired = [], [], []
        for idx, inc in enumerate(prev.incarnations):
            clause, ratio = (inc.phrase_clause + 1) % self.phrase_len, transmute_medium(inc.ratio, tick + idx + 1)
            phase, ttl, moniker = slow_time(inc.phase_ms, JUST_INTERVALS[(idx + 2) % 9]), inc.ttl - 1, inc.cantor_moniker
            if ttl <= 0:
                expired.append(moniker)
                gen = int(moniker.rsplit("_", 1)[1]) + 1
                moniker, ttl = f"{inc.mask_role}_cantor_{gen:02d}", 2 + ((gen + idx) % 2)
            incarnations.append(MortalMaskIncarnation(inc.mask_role, moniker, ttl, clause, ratio, phase))
            emissions.append(HarmonicEmission("RoleMaskReassigner", inc.mask_role, ratio, phase, f"{moniker}:c{clause}"))
        return tuple(incarnations), tuple(emissions), tuple(expired)


@dataclass(frozen=True)
class FrancolinJoyThreader:
    consonance_ceiling: int = 24

    def thread(self, prev: ScoreSnapshot, core: tuple[HarmonicEmission, ...], tick: int, mutate: bool) -> tuple[RaissaJoyChain, HarmonicEmission]:
        prior = next(e for e in prev.emissions if e.emitter == "FrancolinJoyThreader")
        if not mutate:
            return prev.joy_chain, prior
        dyads = [_fold_octave(a.ratio / b.ratio) for a in core for b in core if a.ratio != b.ratio]
        best, jc = min(dyads, key=lambda r: r.numerator + r.denominator, default=Fraction(3, 2)), prev.joy_chain
        advanced = best.numerator + best.denominator <= self.consonance_ceiling
        delta = round(0.11 + 0.01 * (best.numerator + best.denominator), 4)
        hops = ((RAISSA_CHAIN[0],) if jc.hops == RAISSA_CHAIN else jc.hops + (RAISSA_CHAIN[len(jc.hops)],)) if advanced else jc.hops
        hop_ms = ((0.0,) if jc.hops == RAISSA_CHAIN else jc.hop_ms + (round(jc.hop_ms[-1] + delta, 4),)) if advanced else jc.hop_ms
        span = round(hop_ms[-1] - hop_ms[0], 4)
        chain = RaissaJoyChain(hops, hop_ms, jc.unhappy_ledger, span, advanced and hops == RAISSA_CHAIN and 0.0 < span <= 2.0)
        em = HarmonicEmission("FrancolinJoyThreader", "raissa_francolin", transmute_medium(best, tick + len(hops)), slow_time(prior.phase_ms, best), f"joy:{hops[-1]}")
        return chain, em


@dataclass(frozen=True)
class ZoraStasisAuditor:
    max_static_ticks: int = 4

    def sound(self, prev: ScoreSnapshot, tick: int, mutate: bool) -> HarmonicEmission:
        prior = next(e for e in prev.emissions if e.emitter == "ZoraStasisAuditor")
        return prior if not mutate else HarmonicEmission("ZoraStasisAuditor", "stasis_sentinel", transmute_medium(prior.ratio, tick * 2 + 1), slow_time(prior.phase_ms, Fraction(4, 3)), "living")

    def audit(self, dag: ScoreDAG, tip: ScoreSnapshot) -> ZoraDisintegrationEvent | None:
        static_ticks, cur = 0, tip
        while cur.parent_cids and cur.score_digest == dag.by_cid(cur.parent_cids[0]).score_digest:
            static_ticks, cur = static_ticks + 1, dag.by_cid(cur.parent_cids[0])
        return ZoraDisintegrationEvent(tip.cid, static_ticks, ZORA_MOTIFS) if static_ticks >= self.max_static_ticks else None


def genesis_score_dag() -> tuple[ScoreDAG, ScoreSnapshot]:
    incs = tuple(MortalMaskIncarnation(m, f"{m}_cantor_01", ttl, 0, JUST_INTERVALS[i * 2], i * 6.0) for i, (m, ttl) in enumerate(zip(MELANIA_MASKS, (1, 2, 3, 2))))
    ems = (
        HarmonicEmission("CopperClockOstinato", "zora_ostinato", Fraction(1, 1), 0.0, "copper_clock:jet_1"),
        *(HarmonicEmission("RoleMaskReassigner", x.mask_role, x.ratio, x.phase_ms, f"{x.cantor_moniker}:c0") for x in incs),
        HarmonicEmission("FrancolinJoyThreader", "raissa_francolin", Fraction(3, 2), 3.0, "joy:child"),
        HarmonicEmission("ZoraStasisAuditor", "stasis_sentinel", Fraction(4, 3), 4.5, "living"),
    )
    snap = ScoreSnapshot.seal(0, (), ems, incs, (), RaissaJoyChain(("child",), (0.0,), tuple((n, "unhappy") for n in RAISSA_CHAIN), 0.0, False))
    return ScoreDAG((snap,)), snap


def advance_polyphonic_dag(dag: ScoreDAG, tip_cid: str, ostinato: CopperClockOstinato, reassigner: RoleMaskReassigner,
                           threader: FrancolinJoyThreader, auditor: ZoraStasisAuditor, mutate: bool = True) -> tuple[ScoreDAG, ScoreSnapshot, ZoraDisintegrationEvent | None]:
    prev = dag.by_cid(tip_cid)
    tick = prev.tick + 1
    zora_em = ostinato.sound(prev, tick, mutate)
    incs, mel_ems, expired = reassigner.advance(prev, tick, mutate)
    joy_chain, raissa_em = threader.thread(prev, (zora_em, *mel_ems), tick, mutate)
    parents = (tip_cid, dag.snapshots[-3].cid) if mutate and len(dag.snapshots) >= 3 and tick % 4 == 0 else (tip_cid,)
    snap = ScoreSnapshot.seal(tick, parents, (zora_em, *mel_ems, raissa_em, auditor.sound(prev, tick, mutate)), incs, expired, joy_chain)
    next_dag = dag.commit(snap)
    return next_dag, snap, auditor.audit(next_dag, snap)


if __name__ == "__main__":
    dag, tip = genesis_score_dag()
    ostinato, reassigner, threader, auditor = CopperClockOstinato(), RoleMaskReassigner(), FrancolinJoyThreader(), ZoraStasisAuditor(max_static_ticks=4)
    for _ in range(28):
        dag, tip, disintegrated = advance_polyphonic_dag(dag, tip.cid, ostinato, reassigner, threader, auditor, mutate=True)
        assert disintegrated is None, "Living mutating score must never disintegrate"
    living_snaps = dag.snapshots[1:]
    deaths = sum(len(s.expired_cantors) for s in living_snaps)
    rebirths = sum(a.cantor_moniker != b.cantor_moniker for a, b in zip(dag.snapshots, living_snaps) for a, b in zip(a.incarnations, b.incarnations))
    voice_continuity = all(
        tuple(x.mask_role for x in b.incarnations) == MELANIA_MASKS
        and all(isinstance(y.ratio, Fraction) and y.phase_ms != x.phase_ms and y.phrase_clause == (x.phrase_clause + 1) % 5
                and Fraction(1, 2) < (y.ratio / x.ratio) < Fraction(2, 1) for x, y in zip(a.incarnations, b.incarnations))
        for a, b in zip(dag.snapshots, living_snaps)
    )
    closed_chains = [s.joy_chain for s in living_snaps if s.joy_chain.closed]
    assert deaths > 20 and deaths == rebirths and voice_continuity, f"Turnover/continuity failed: {deaths}"
    assert closed_chains and all(m == "unhappy" for _, m in closed_chains[0].unhappy_ledger), "RaissaJoyChain failed"
    stasis_tip, disintegration = tip, None
    for step in range(1, auditor.max_static_ticks + 1):
        dag, stasis_tip, disintegration = advance_polyphonic_dag(dag, stasis_tip.cid, ostinato, reassigner, threader, auditor, mutate=False)
        assert (disintegration is None) == (step < auditor.max_static_ticks)
    assert isinstance(disintegration, ZoraDisintegrationEvent) and disintegration.static_ticks == 4
    first_joy = closed_chains[0]
    print(f"OWNER={OWNER} | REVISION={PINNED_REVISION[0]} | OPERATORS={','.join(ALLOWED_MUTATION_OPERATORS)}")
    print(f"DAG_SNAPSHOTS={len(dag.snapshots)} | MULTI_PARENT_MERGES={sum(len(s.parent_cids) > 1 for s in living_snaps)} | LIVING_TIP={tip.cid}")
    print(f"MELANIA_TURNOVER: deaths={deaths} rebirths={rebirths} unbroken_voice_leading={voice_continuity}")
    print(f"RAISSA_JOY_CHAIN: closures={len(closed_chains)} path={'->'.join(first_joy.hops)} span_ms={first_joy.span_ms} unhappy_nodes={len(first_joy.unhappy_ledger)}")
    print(f"ZORA_IMMUTABILITY_TRAP: static_ticks={disintegration.static_ticks} erased_tip={disintegration.erased_tip_cid} dissolved={','.join(disintegration.dissolved_motifs)}")
