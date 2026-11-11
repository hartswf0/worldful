#!/usr/bin/env python3
"""
SCION v1.0 — Clinamen Operative Studio & City-Swarm Builder Core Engine.

Implements:
1. Afterlight Energetic & Sensory Grammar (8 Roles ☉☾♁◉▧⌂◷⌘, 8 Operations →↷≫⊣↓↻≈≡).
2. Constant-Volume Faceless Nonhuman Rig (`HandmadeRigSpec`) with 2D area conservation
   (`area_ratio = stretch_s * width_w` strictly within `1.000 ± 0.03`), stepped exposure
   timing (`ones | twos | hold`), and readable intention kinematics.
3. Roubaud's Qualification Gate (`RoubaudQualificationError`): forbids constructing any
   clinamen branch `BRANCH_CLINAMEN_A_PRIME` unless `CHECKPOINT_LAWFUL_A` has executed,
   passed all physical/volumetric/sonic/ledger invariants (`lawful_verified == True`),
   and been content-addressed.
4. Split-Trace Persistence & "Other Worlds Being There" across 25 ticks (`0..24`):
   physical `world_trace.residues` persist autonomously in `♁ World` while `⊣ FILTER`
   mutates only `actor_memory[witness_id]`, driving altered post-swerve posture,
   spacing, actions, and `P1..P4` institutional verdicts.
5. Coupled Sensory Bus (`<= 16.7ms` sync delta) & Formal Rule Ledger (`P1..P4`).
6. Bespoke Multi-Agent City Swarm Builder (`ScionSwarmBuilder`, `CitySwarmSpec`,
   `ScionAgentSpec`) coupled locklessly to `PhilogynyAccumulator` to mint load-bearing
   `ConflictGrain` arch keystones with pairwise Jaccard disjointness `0.0`.
"""
from __future__ import annotations

import json
import math
import os
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable, Dict, Iterable, List, Optional, Sequence, Set, Tuple

from scion_cities.core.accumulator import (
    ConflictGrain,
    EmptySubstrateError,
    LocusState,
    MicroCommit,
    PhilogynyAccumulator,
    RunawayVelocityError,
    TrudeConvergenceError,
    canonical_hash,
    quarantine_untrusted_text,
)

# ---------------------------------------------------------------------------
# 1. AFTERLIGHT ENERGETIC & SENSORY GRAMMAR
# ---------------------------------------------------------------------------

AFTERLIGHT_ROLES: Dict[str, str] = {
    "SOURCE": "☉",
    "REFLECTOR": "☾",
    "WORLD": "♁",
    "BODY": "◉",
    "MEDIUM": "▧",
    "CULTURE": "⌂",
    "TIME": "◷",
    "CONTROL": "⌘",
}

AFTERLIGHT_ROLE_DESCRIPTIONS: Dict[str, str] = {
    "SOURCE": "Originating impulse emitter or ballistic force vector (☉)",
    "REFLECTOR": "Selective witness aperture or specular memory surface (☾)",
    "WORLD": "Indelible material substrate retaining physical scars and residues (♁)",
    "BODY": "Somatic vessel absorbing kinetic displacement and weight transfer (◉)",
    "MEDIUM": "Atmospheric, acoustic, or capillary transmission channel (▧)",
    "CULTURE": "Shared guild custom, ritual cord, or civic habitus (⌂)",
    "TIME": "Autonomous decay, tide, cooling ember, and palimpsest clock (◷)",
    "CONTROL": "Institutional assessor hardening testimony into formal verdict (⌘)",
}

AFTERLIGHT_OPERATIONS: Dict[str, str] = {
    "EMIT": "→",
    "REFLECT": "↷",
    "CONCENTRATE": "≫",
    "FILTER": "⊣",
    "ABSORB": "↓",
    "STORE_RELEASE": "↻",
    "SENSE_INTERPRET": "≈",
    "SYMBOLIZE_INSTITUTIONALIZE": "≡",
}

AFTERLIGHT_OP_DESCRIPTIONS: Dict[str, str] = {
    "EMIT": "Project directed force, utterance, or ballistic impulse (→)",
    "REFLECT": "Bounce or mirror incident event across an obverse plane (↷)",
    "CONCENTRATE": "Focus distributed tension into a sharp inflection point (≫)",
    "FILTER": "Selective forgetting: omit a specific causal premise in memory (⊣)",
    "ABSORB": "Retain physical momentum, bruise, or displaced mass (↓)",
    "STORE_RELEASE": "Hold latent charge and release as delayed aftermath (↻)",
    "SENSE_INTERPRET": "Thick-description reading: distinguish twitch from wink (≈)",
    "SYMBOLIZE_INSTITUTIONALIZE": "Harden partial witness account into official decree (≡)",
}

VALID_RIG_ARCHETYPES: Tuple[str, ...] = (
    "flour_sack",
    "plumb_bob",
    "bamboo_stilt",
    "taut_chord",
    "hooded_husk",
    "pinhead_lens",
    "mirror_obverse",
    "brass_cog",
    "chalk_grain",
    "ceramic_vessel",
)

VALID_EXPOSURE_TIMINGS: Tuple[str, ...] = ("ones", "twos", "hold")

VALID_INTENTION_KINEMATICS: Tuple[str, ...] = (
    "idle",
    "hold_still",
    "draw_back",
    "deliberate_push",
    "rush",
    "sweep",
    "recoil",
    "help",
    "avoid",
    "accuse",
    "reroute",
)

FORBIDDEN_GENERIC_ROLES: Set[str] = {
    "planner",
    "worker",
    "coder",
    "researcher",
    "assistant",
    "agent_1",
    "critic",
    "verifier",
    "architect",
    "reviewer",
    "qa",
    "tester",
    "manager",
    "agent",
    "agent1",
    "coordinator",
    "summarizer",
    "orchestrator",
}

FORBIDDEN_FACIAL_TOKENS: Set[str] = {
    "eye",
    "eyes",
    "mouth",
    "smile",
    "frown",
    "eyebrow",
    "eyebrows",
    "grin",
    "wink_face_icon",
    "pupil",
    "lips",
}

WORLDFUL_PRESS_PALETTE: Dict[str, str] = {
    "paper": "#F2EFE9",
    "bone": "#E8E0D6",
    "soot": "#1E1E1E",
    "graphite": "#55585A",
    "dirt": "#7A756E",
    "red_bird": "#9B1D1D",
    "chalk_blue": "#2C4A5E",
    "ochre_oil": "#B58328",
    "display_font": "'IM Fell English', Georgia, serif",
    "mono_font": "'IBM Plex Mono', ui-monospace, monospace",
}

TICK_COUNT = 25  # Ticks 0..24 inclusive


# ---------------------------------------------------------------------------
# DOMAIN EXCEPTIONS
# ---------------------------------------------------------------------------

class RoubaudQualificationError(RuntimeError):
    """Raised when a Clinamen branch is attempted before CHECKPOINT_LAWFUL_A is verified."""


class FaceIconForbiddenError(ValueError):
    """Raised when any rig spec or frame attempts to attach facial features/expressions."""


class VolumeConservationError(ValueError):
    """Raised when 2D rig stretch/width violates the 1.000 ± 0.03 constant-area invariant."""


class KinematicIntentionError(ValueError):
    """Raised when deliberate or accidental motion violates exposure/intention grammar."""


class AudioSyncError(ValueError):
    """Raised when sensory_bus sync_frame_delta_ms exceeds 16.7ms."""


class EpistemicFlatlineError(ValueError):
    """Raised when Clinamen A' fails to change downstream action or flip at least one P1-P4 verdict."""


# ---------------------------------------------------------------------------
# 2. CONSTANT-VOLUME FACELESS NONHUMAN RIG
# ---------------------------------------------------------------------------

@dataclass(frozen=True)
class HandmadeRigSpec:
    """
    Faceless nonhuman rig specification enforcing constant 2D area conservation
    and forbidding any drawn eyes, mouths, or facial expression icons.
    """
    rig_archetype: str
    has_face_icons: bool = False
    facial_expression: Optional[str] = None
    default_exposure: str = "twos"
    min_stretch: float = 0.55
    max_stretch: float = 1.65

    def __post_init__(self) -> None:
        if self.has_face_icons:
            raise FaceIconForbiddenError(
                f"FACE_ICON_FORBIDDEN: Rig '{self.rig_archetype}' set has_face_icons=True. "
                "Nonhuman rigs must convey weight and intention strictly via silhouette & hold timing."
            )
        if self.facial_expression is not None and str(self.facial_expression).strip():
            raise FaceIconForbiddenError(
                f"FACE_ICON_FORBIDDEN: Rig '{self.rig_archetype}' claimed facial_expression="
                f"{self.facial_expression!r}."
            )
        if self.rig_archetype not in VALID_RIG_ARCHETYPES:
            raise ValueError(
                f"Invalid rig_archetype {self.rig_archetype!r}. Must be one of {VALID_RIG_ARCHETYPES}."
            )
        if self.default_exposure not in VALID_EXPOSURE_TIMINGS:
            raise ValueError(
                f"Invalid default_exposure {self.default_exposure!r}. Must be one of {VALID_EXPOSURE_TIMINGS}."
            )
        if self.min_stretch < 0.55 or self.max_stretch > 1.65 or self.min_stretch >= self.max_stretch:
            raise VolumeConservationError(
                f"Stretch bounds [{self.min_stretch}, {self.max_stretch}] must stay inside [0.55, 1.65]."
            )

    def to_dict(self) -> Dict[str, Any]:
        return {
            "rig_archetype": self.rig_archetype,
            "has_face_icons": False,
            "default_exposure": self.default_exposure,
            "stretch_bounds": [self.min_stretch, self.max_stretch],
        }


def compute_constant_volume_dims(
    stretch_s: float,
    tick: int,
    agent_id: str,
    tremor_amplitude: float = 0.009,
) -> Tuple[float, float, float]:
    """
    Given vertical stretch `stretch_s` in `[0.55, 1.65]`, compute lateral `width_w`
    and `area_ratio = stretch_s * width_w`:
    - Exact reciprocal baseline `1.0 / stretch_s` plus deterministic organic tremor
      strictly `<= ±0.015` such that `area_ratio` stays strictly within `1.000 ± 0.03`.
    """
    if not (0.55 <= stretch_s <= 1.65):
        raise VolumeConservationError(
            f"Actor '{agent_id}' at tick {tick}: stretch_s={stretch_s} outside [0.55, 1.65]."
        )
    s = round(float(stretch_s), 6)
    seed_int = int(canonical_hash({"agent": agent_id, "tick": tick})[:8], 16)
    wave = math.sin((seed_int % 997) * 0.137 + tick * 0.71)
    # Bound lateral tremor so both |width_w - 1/s| <= 0.015 AND |s * width_w - 1.0| <= 0.022 < 0.03
    max_safe_delta = min(0.014, 0.020 / s, max(0.0, tremor_amplitude))
    delta_w = wave * max_safe_delta
    width_w = round((1.0 / s) + delta_w, 6)
    area_ratio = round(s * width_w, 6)
    if abs(area_ratio - 1.0) > 0.03:
        raise VolumeConservationError(
            f"Actor '{agent_id}' tick {tick}: area_ratio={area_ratio} violates 1.000 ± 0.03."
        )
    return s, width_w, area_ratio


def make_actor_frame(
    agent_id: str,
    tick: int,
    x: float,
    y: float,
    plane_depth: float,
    stretch_s: float,
    tilt_rad: float,
    intention_kinematics: str,
    target_actor: Optional[str] = None,
    exposure: str = "twos",
    tremor_amplitude: float = 0.008,
) -> Dict[str, Any]:
    """Construct a validated constant-volume faceless actor kinematic frame for `world_trace`."""
    if intention_kinematics not in VALID_INTENTION_KINEMATICS:
        raise KinematicIntentionError(
            f"Actor '{agent_id}' tick {tick}: unknown intention_kinematics {intention_kinematics!r}."
        )
    if exposure not in VALID_EXPOSURE_TIMINGS:
        raise KinematicIntentionError(
            f"Actor '{agent_id}' tick {tick}: unknown exposure timing {exposure!r}."
        )
    # Hold stillness suppresses jitter for crisp animators' holds
    eff_tremor = 0.002 if exposure == "hold" or intention_kinematics == "hold_still" else tremor_amplitude
    s, w, area_ratio = compute_constant_volume_dims(stretch_s, tick, agent_id, eff_tremor)
    return {
        "x": round(float(x), 4),
        "y": round(float(y), 4),
        "plane_depth": round(float(plane_depth), 4),
        "stretch_s": s,
        "width_w": w,
        "area_ratio": area_ratio,
        "tilt_rad": round(float(tilt_rad), 4),
        "intention_kinematics": intention_kinematics,
        "target_actor": target_actor,
        "exposure": exposure,
        "has_face_icons": False,
    }


def build_accidental_motion_reference(agent_id: str = "accidental_reference_sack") -> List[Dict[str, Any]]:
    """
    Reference 25-tick trajectory contrasting accidental motion (`rush -> sweep -> recoil`
    with ZERO stillness hold) against deliberate push (`hold_still >= 3 -> draw_back -> deliberate_push`).
    """
    frames: List[Dict[str, Any]] = []
    for t in range(TICK_COUNT):
        if t < 5:
            kin, exp, x, s, tilt = "idle", "twos", 0.22 + 0.02 * t, 1.00, 0.04
        elif t < 9:
            kin, exp, x, s, tilt = "rush", "ones", 0.32 + 0.07 * (t - 5), 1.24, 0.34
        elif t < 11:
            kin, exp, x, s, tilt = "sweep", "ones", 0.60 + 0.03 * (t - 9), 1.31, 0.44
        elif t < 16:
            kin, exp, x, s, tilt = "recoil", "ones", 0.64 - 0.04 * (t - 11), 0.84, -0.31
        else:
            kin, exp, x, s, tilt = "idle", "twos", 0.44, 0.98, -0.06
        frames.append(make_actor_frame(agent_id, t, x, 0.75, 0.35, s, tilt, kin, None, exp))
    return frames


def validate_kinematic_intentions(world_trace: Sequence[Dict[str, Any]]) -> None:
    """
    Enforce readable silhouette timing rules across a 25-tick `world_trace`:
    1. Every actor on every tick must keep `area_ratio` within `1.000 ± 0.03` and `has_face_icons == False`.
    2. Any actor executing `deliberate_push` MUST first execute `hold_still` for `>= 3` consecutive ticks
       followed directly by `draw_back` (`>= 1` tick) -> `deliberate_push`.
    3. Any actor executing accidental `sweep` via `rush -> sweep -> recoil` MUST NOT precede `rush`
       with a `>= 3`-tick `hold_still`.
    """
    if len(world_trace) != TICK_COUNT:
        raise KinematicIntentionError(f"Expected {TICK_COUNT} ticks (0..24), got {len(world_trace)}.")

    actor_ids = sorted(world_trace[0]["actors"].keys())
    for aid in actor_ids:
        seq: List[str] = []
        for t, frame in enumerate(world_trace):
            actors = frame.get("actors", {})
            if aid not in actors:
                raise KinematicIntentionError(f"Actor '{aid}' missing at tick {t}.")
            af = actors[aid]
            if af.get("has_face_icons", False):
                raise FaceIconForbiddenError(f"Actor '{aid}' tick {t} has facial icons enabled.")
            for k in af:
                if k.lower() in FORBIDDEN_FACIAL_TOKENS:
                    raise FaceIconForbiddenError(f"Actor '{aid}' tick {t} has forbidden facial key {k!r}.")
            s = float(af["stretch_s"])
            w = float(af["width_w"])
            ar = float(af["area_ratio"])
            if not (0.55 <= s <= 1.65):
                raise VolumeConservationError(f"Actor '{aid}' tick {t}: stretch_s={s} out of [0.55, 1.65].")
            if abs(s * w - ar) > 1e-4 or abs(ar - 1.0) > 0.03:
                raise VolumeConservationError(
                    f"Actor '{aid}' tick {t}: area_ratio={ar} (s*w={s * w:.6f}) outside 1.000 ± 0.03."
                )
            kin = af["intention_kinematics"]
            if kin not in VALID_INTENTION_KINEMATICS:
                raise KinematicIntentionError(f"Actor '{aid}' tick {t}: invalid kinematics {kin!r}.")
            seq.append(kin)

        # Verify deliberate_push onset rule: >=3 hold_still -> >=1 draw_back -> deliberate_push
        for idx, kin in enumerate(seq):
            if kin == "deliberate_push" and (idx == 0 or seq[idx - 1] != "deliberate_push"):
                # Walk back across contiguous draw_back ticks
                db_end = idx - 1
                if db_end < 0 or seq[db_end] != "draw_back":
                    raise KinematicIntentionError(
                        f"Actor '{aid}' entered 'deliberate_push' at tick {idx} without preceding 'draw_back'."
                    )
                db_start = db_end
                while db_start - 1 >= 0 and seq[db_start - 1] == "draw_back":
                    db_start -= 1
                # Walk back across contiguous hold_still ticks before draw_back
                hs_end = db_start - 1
                hs_count = 0
                while hs_end >= 0 and seq[hs_end] == "hold_still":
                    hs_count += 1
                    hs_end -= 1
                if hs_count < 3:
                    raise KinematicIntentionError(
                        f"Actor '{aid}' entered 'deliberate_push' at tick {idx} with only {hs_count} "
                        f"'hold_still' ticks before 'draw_back' (minimum >= 3 required)."
                    )

            # Verify accidental sweep onset rule: rush -> sweep -> recoil without stillness hold
            if kin == "sweep" and (idx == 0 or seq[idx - 1] != "sweep"):
                if idx == 0 or seq[idx - 1] != "rush":
                    raise KinematicIntentionError(
                        f"Actor '{aid}' entered accidental 'sweep' at tick {idx} without preceding 'rush'."
                    )
                r_start = idx - 1
                while r_start - 1 >= 0 and seq[r_start - 1] == "rush":
                    r_start -= 1
                if r_start - 1 >= 0 and seq[r_start - 1] == "hold_still":
                    raise KinematicIntentionError(
                        f"Actor '{aid}' preceded accidental 'rush->sweep' with 'hold_still' at tick {r_start - 1}."
                    )
                s_end = idx
                while s_end + 1 < len(seq) and seq[s_end + 1] == "sweep":
                    s_end += 1
                if s_end + 1 >= len(seq) or seq[s_end + 1] != "recoil":
                    raise KinematicIntentionError(
                        f"Actor '{aid}' accidental 'sweep' did not transition into 'recoil'."
                    )


# ---------------------------------------------------------------------------
# 3. BESPOKE SWARM SPECS &CLINAMEN / ROUBAUD STRUCTURES
# ---------------------------------------------------------------------------

def _check_forbidden_role_tokens(identifier: str, context: str) -> None:
    lowered = identifier.strip().lower()
    if lowered in FORBIDDEN_GENERIC_ROLES:
        raise TrudeConvergenceError(
            f"GENERIC_ROLE_FORBIDDEN ({context}): identifier {identifier!r} is a banned generic role."
        )
    # Check exact agent_1 pattern as well as split tokens
    if re.search(r"(^|[_ \-])agent[_ \-]?[0-9]+($|[_ \-])", lowered):
        raise TrudeConvergenceError(
            f"GENERIC_ROLE_FORBIDDEN ({context}): identifier {identifier!r} matches generic numbered agent pattern."
        )
    tokens = set(re.split(r"[_\-\s]+", lowered))
    overlap = tokens & FORBIDDEN_GENERIC_ROLES
    if overlap:
        raise TrudeConvergenceError(
            f"GENERIC_ROLE_FORBIDDEN ({context}): identifier {identifier!r} contains banned token(s) {sorted(overlap)}."
        )


@dataclass(frozen=True)
class ScionAgentSpec:
    """Bespoke material-bound nonhuman operator belonging to a single City Swarm."""
    agent_id: str
    display_moniker: str
    afterlight_role: str
    role_symbol: str
    primary_op: str
    op_symbol: str
    rig_archetype: str
    polarity: str
    home_locus: str
    nisba_debt: str
    emblems: Tuple[str, ...] = ()
    base_magnitude: float = 5.0
    harmonic_ratio: Tuple[int, int] = (3, 2)
    rig_spec: Optional[HandmadeRigSpec] = None

    def __post_init__(self) -> None:
        quarantine_untrusted_text(self.agent_id)
        quarantine_untrusted_text(self.display_moniker)
        quarantine_untrusted_text(self.nisba_debt)
        _check_forbidden_role_tokens(self.agent_id, f"agent_id:{self.agent_id}")

        if self.afterlight_role not in AFTERLIGHT_ROLES:
            raise ValueError(
                f"Agent '{self.agent_id}': unknown afterlight_role {self.afterlight_role!r}. "
                f"Expected one of {sorted(AFTERLIGHT_ROLES)}."
            )
        expected_role_sym = AFTERLIGHT_ROLES[self.afterlight_role]
        if self.role_symbol != expected_role_sym:
            raise ValueError(
                f"Agent '{self.agent_id}': role_symbol {self.role_symbol!r} != {expected_role_sym!r} "
                f"for role {self.afterlight_role}."
            )

        if self.primary_op not in AFTERLIGHT_OPERATIONS:
            raise ValueError(
                f"Agent '{self.agent_id}': unknown primary_op {self.primary_op!r}. "
                f"Expected one of {sorted(AFTERLIGHT_OPERATIONS)}."
            )
        expected_op_sym = AFTERLIGHT_OPERATIONS[self.primary_op]
        if self.op_symbol != expected_op_sym:
            raise ValueError(
                f"Agent '{self.agent_id}': op_symbol {self.op_symbol!r} != {expected_op_sym!r} "
                f"for op {self.primary_op}."
            )

        resolved_rig = self.rig_spec or HandmadeRigSpec(rig_archetype=self.rig_archetype, has_face_icons=False)
        if resolved_rig.rig_archetype != self.rig_archetype:
            raise ValueError("HandmadeRigSpec archetype mismatch.")
        object.__setattr__(self, "rig_spec", resolved_rig)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "agent_id": self.agent_id,
            "display_moniker": self.display_moniker,
            "afterlight_role": self.afterlight_role,
            "role_symbol": self.role_symbol,
            "primary_op": self.primary_op,
            "op_symbol": self.op_symbol,
            "rig_archetype": self.rig_archetype,
            "has_face_icons": False,
            "polarity": self.polarity,
            "home_locus": self.home_locus,
            "nisba_debt": self.nisba_debt,
            "emblems": list(self.emblems),
            "base_magnitude": self.base_magnitude,
            "harmonic_ratio": list(self.harmonic_ratio),
        }


@dataclass(frozen=True)
class ClinamenSpec:
    """Formal specification of an Oulipian/Lucretian swerve against a verified baseline."""
    target_rule: str
    passed_over_solution: str
    mutated_premise: str
    swerve_tick: int
    witness_agent_id: str
    filtered_premises: Tuple[str, ...]

    def __post_init__(self) -> None:
        quarantine_untrusted_text(self.target_rule)
        quarantine_untrusted_text(self.passed_over_solution)
        quarantine_untrusted_text(self.mutated_premise)
        if not (1 <= self.swerve_tick < TICK_COUNT - 1):
            raise ValueError(f"swerve_tick={self.swerve_tick} must lie strictly inside 1..{TICK_COUNT - 2}.")
        if not self.filtered_premises:
            raise ValueError("ClinamenSpec requires at least one filtered premise for ⊣ FILTER.")

    def to_lineage_dict(self) -> Dict[str, Any]:
        return {
            "target_rule": self.target_rule,
            "passed_over_solution": self.passed_over_solution,
            "mutated_premise": self.mutated_premise,
            "swerve_tick": self.swerve_tick,
        }


@dataclass(frozen=True)
class CitySwarmSpec:
    """Complete specification for a handmade multi-agent City or Risk-Proof Swarm."""
    case_id: str
    kind: str  # "risk_proof" | "invisible_city" | "custom_scion"
    city_index: int
    city_name: str
    title: str
    chapter: int
    series: str
    series_rank: int
    weaver_page: int
    desert_opposed: str
    optical_rule: str
    material_nouns: Tuple[str, ...]
    loci: Tuple[str, ...]
    agents: Tuple[ScionAgentSpec, ...]
    clinamen_spec: ClinamenSpec
    clinamen_inquiry: Dict[str, Any]
    thick_telemetry: Dict[str, str] = field(default_factory=dict)

    def __post_init__(self) -> None:
        quarantine_untrusted_text(self.case_id)
        quarantine_untrusted_text(self.city_name)
        quarantine_untrusted_text(self.title)
        quarantine_untrusted_text(self.desert_opposed)
        if not (3 <= len(self.agents) <= 5):
            raise TrudeConvergenceError(
                f"Swarm '{self.case_id}' has {len(self.agents)} agents; SCION requires 3..5 bespoke operators."
            )
        seen_ids: Set[str] = set()
        for ag in self.agents:
            if ag.agent_id in seen_ids:
                raise TrudeConvergenceError(f"Duplicate agent_id '{ag.agent_id}' inside '{self.case_id}'.")
            seen_ids.add(ag.agent_id)
        polarities = {ag.polarity for ag in self.agents}
        if len(polarities) < 2:
            raise TrudeConvergenceError(
                f"TRUDE_MONOCULTURE_BLOCKED ({self.case_id}): requires >= 2 opposing polarities."
            )
        if self.clinamen_spec.witness_agent_id not in seen_ids:
            raise ValueError(
                f"Clinamen witness_agent_id '{self.clinamen_spec.witness_agent_id}' not in swarm '{self.case_id}'."
            )
        if len(self.material_nouns) < 4:
            raise EmptySubstrateError(f"Swarm '{self.case_id}' requires >= 4 concrete material nouns.")


# ---------------------------------------------------------------------------
# 4. SENSORY BUS, OFF-SCREEN CONTINUITY & RULE LEDGER VALIDATORS
# ---------------------------------------------------------------------------

REQUIRED_SENSORY_KEYS: Tuple[str, ...] = (
    "roughness_seed",
    "sine_hum_hz",
    "sine_gain",
    "clock_tick",
    "fracture_ping_hz",
    "impact_angle_deg",
    "cloth_rustle_gain",
    "tape_hiss_flutter",
    "sub_thud_hz",
    "sync_frame_delta_ms",
)

REQUIRED_POLICY_KEYS: Tuple[str, ...] = (
    "policy_id",
    "title",
    "formal_predicate",
    "world_input",
    "witness_input",
    "verdict",
    "payout_status",
    "deciding_tick",
)


def make_sensory_frame(
    case_id: str,
    branch_tag: str,
    tick: int,
    sine_gain: float,
    clock_tick: bool,
    cloth_rustle_gain: float,
    tape_hiss_flutter: float,
    impact_angle_deg: Optional[float] = None,
    sub_thud_hz: Optional[float] = None,
    sync_frame_delta_ms: float = 1.6,
) -> Dict[str, Any]:
    """Build one frame-locked audiovisual synthesis descriptor for `sensory_bus`."""
    if sync_frame_delta_ms < 0.0 or sync_frame_delta_ms > 16.7:
        raise AudioSyncError(
            f"{case_id} ({branch_tag}) tick {tick}: sync_frame_delta_ms={sync_frame_delta_ms} > 16.7ms."
        )
    seed_int = int(canonical_hash({"case": case_id, "branch": branch_tag, "tick": tick})[:8], 16)
    fracture_ping_hz: Optional[float] = None
    norm_angle: Optional[float] = None
    if impact_angle_deg is not None:
        norm_angle = round(float(impact_angle_deg), 2)
        fracture_ping_hz = round(1120.0 + abs(norm_angle) * 9.4, 2)

    return {
        "roughness_seed": seed_int % 1_000_000,
        "sine_hum_hz": 440.0,
        "sine_gain": round(float(sine_gain), 4),
        "clock_tick": bool(clock_tick),
        "fracture_ping_hz": fracture_ping_hz,
        "impact_angle_deg": norm_angle,
        "cloth_rustle_gain": round(float(cloth_rustle_gain), 4),
        "tape_hiss_flutter": round(float(tape_hiss_flutter), 4),
        "sub_thud_hz": None if sub_thud_hz is None else round(float(sub_thud_hz), 2),
        "sync_frame_delta_ms": round(float(sync_frame_delta_ms), 3),
    }


def validate_sensory_bus(sensory_bus: Sequence[Dict[str, Any]], label: str) -> None:
    if len(sensory_bus) != TICK_COUNT:
        raise AudioSyncError(f"{label}: expected {TICK_COUNT} sensory_bus frames, got {len(sensory_bus)}.")
    for t, sb in enumerate(sensory_bus):
        for k in REQUIRED_SENSORY_KEYS:
            if k not in sb:
                raise AudioSyncError(f"{label} tick {t}: missing sensory_bus key {k!r}.")
        if float(sb["sine_hum_hz"]) != 440.0:
            raise AudioSyncError(f"{label} tick {t}: sine_hum_hz must equal 440.0.")
        delta = float(sb["sync_frame_delta_ms"])
        if delta < 0.0 or delta > 16.7:
            raise AudioSyncError(f"{label} tick {t}: sync_frame_delta_ms={delta} exceeds 16.7ms gate.")


def validate_offscreen_continuity(world_trace: Sequence[Dict[str, Any]], label: str) -> None:
    """Verify 'Other Worlds Being There': autonomous offscreen entities advance across ticks."""
    if len(world_trace) != TICK_COUNT:
        raise ValueError(f"{label}: expected {TICK_COUNT} world_trace ticks.")
    first_entities = [e["entity"] for e in world_trace[0].get("offscreen_world", [])]
    if len(first_entities) < 2:
        raise ValueError(f"{label}: offscreen_world requires >= 2 autonomous peripheral entities.")

    for ent in first_entities:
        progresses = []
        for t, wt in enumerate(world_trace):
            found = [item for item in wt.get("offscreen_world", []) if item.get("entity") == ent]
            if not found:
                raise ValueError(f"{label} tick {t}: offscreen entity {ent!r} vanished.")
            progresses.append(float(found[0]["progress"]))
        # Must strictly advance across ticks (not static)
        distinct_steps = len({round(p, 5) for p in progresses})
        if distinct_steps < 10 or progresses[-1] <= progresses[0]:
            raise ValueError(
                f"{label}: offscreen entity {ent!r} failed autonomous progression ({progresses[0]} -> {progresses[-1]})."
            )


def validate_rule_ledger(rule_ledger: Sequence[Dict[str, Any]], label: str) -> None:
    expected_ids = ["P1", "P2", "P3", "P4"]
    if [p.get("policy_id") for p in rule_ledger] != expected_ids:
        raise ValueError(f"{label}: rule_ledger must contain exact policies {expected_ids}.")
    for p in rule_ledger:
        for k in REQUIRED_POLICY_KEYS:
            if k not in p:
                raise ValueError(f"{label} policy {p.get('policy_id')}: missing key {k!r}.")
        dt = int(p["deciding_tick"])
        if not (0 <= dt < TICK_COUNT):
            raise ValueError(f"{label} policy {p['policy_id']}: invalid deciding_tick {dt}.")


# ---------------------------------------------------------------------------
# 5. SWARM ACCUMULATOR EXECUTION & BOARD MESSAGE EXCHANGE
# ---------------------------------------------------------------------------

def run_swarm_accumulator_exchange(
    spec: CitySwarmSpec,
    branch_tag: str,
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
    utterance_script: Sequence[Tuple[int, str, str, str, str]],
) -> Tuple[List[Dict[str, Any]], Dict[str, Any]]:
    """
    Execute bespoke multi-agent swarm message board exchange and concurrent
    `MicroCommit` batches into a per-city `PhilogynyAccumulator`, minting real
    `ConflictGrain` arch keystones where opposing polarities collide on a locus.
    """
    acc = PhilogynyAccumulator(city_name=f"{spec.city_name}_{branch_tag}")
    agent_by_id = {a.agent_id: a for a in spec.agents}
    board_log: List[Dict[str, Any]] = []

    # Group scripted exchanges by tick so concurrent commits on the same tick collide locklessly
    by_tick: Dict[int, List[Tuple[str, str, str, str]]] = {}
    for tick, speaker, target, locus, utterance in utterance_script:
        sanitized_utt, _ = quarantine_untrusted_text(utterance)
        by_tick.setdefault(tick, []).append((speaker, target, locus, sanitized_utt))

    for tick in sorted(by_tick.keys()):
        head_hash = max(
            acc.active_heads,
            key=lambda h: (acc.states_by_hash[h].tension_score(), h),
        )
        batch_commits: List[MicroCommit] = []
        pending_entries: List[Tuple[str, str, str, str, MicroCommit]] = []

        for idx, (speaker, target, locus, utterance) in enumerate(by_tick[tick]):
            ag = agent_by_id[speaker]
            actor_frame = world_trace[tick]["actors"][speaker]
            mem_frame = actor_memory[speaker][tick]
            # Opposing agents on shared loci use polarity_carve to crystallize ConflictGrain arches
            op_kind = "polarity_carve" if ag.primary_op in {
                "EMIT", "ABSORB", "FILTER", "STORE_RELEASE", "SYMBOLIZE_INSTITUTIONALIZE", "SENSE_INTERPRET"
            } else "emblem_union"
            mag = round(
                ag.base_magnitude + float(actor_frame["stretch_s"]) * 1.35 + idx * 0.42,
                4,
            )
            emblems = list(ag.emblems[:3]) + [
                f"{branch_tag.lower()}_t{tick:02d}_{mem_frame['next_action']}",
            ]
            commit = MicroCommit(
                agent_name=speaker,
                locus=locus,
                op_kind=op_kind,
                polarity=ag.polarity,
                emblems=tuple(sorted(set(emblems))),
                magnitude=mag,
                parent_hash=head_hash,
            )
            batch_commits.append(commit)
            pending_entries.append((speaker, target, locus, utterance, commit))

        acc.accumulate_batch(head_hash, batch_commits)
        for speaker, target, locus, utterance, commit in pending_entries:
            ag = agent_by_id[speaker]
            board_log.append({
                "tick": tick,
                "speaker": speaker,
                "to": target,
                "afterlight_op": f"{ag.op_symbol} {ag.primary_op}",
                "locus": locus,
                "utterance": utterance,
                "commit_hash": commit.commit_hash,
            })

    peak = acc.peak_checkpoint()
    if len(peak.state.conflict_grains) == 0:
        raise TrudeConvergenceError(
            f"Swarm '{spec.case_id}' ({branch_tag}) minted 0 ConflictGrain keystones; "
            "opposing polarities must contend on shared loci ('Without stones there is no arch')."
        )

    grains_serialized = [
        {
            "grain_hash": g.grain_hash,
            "locus": g.locus,
            "branch_hashes": list(g.branch_hashes),
            "polarities": list(g.polarities),
            "agents": list(g.agents),
            "arch_tension": round(g.arch_tension, 4),
            "scar_emblem": g.scar_emblem,
        }
        for _, g in sorted(peak.state.conflict_grains.items())
    ]
    dag_summary = {
        "genesis_hash": acc.genesis_hash,
        "peak_checkpoint_id": peak.checkpoint_id,
        "peak_state_hash": peak.state.state_hash,
        "peak_tension": peak.tension,
        "active_heads": sorted(acc.active_heads),
        "branch_count": len(acc.active_heads),
        "conflict_grains": grains_serialized,
        "cells": {k: peak.state.cells[k].to_canonical() for k in sorted(peak.state.cells)},
    }
    return board_log, dag_summary


# ---------------------------------------------------------------------------
# 6. IMMUTABLE CHECKPOINT_LAWFUL_A & BRANCH_CLINAMEN_A_PRIME (ROUBAUD GATE)
# ---------------------------------------------------------------------------

def _checkpoint_payload_for_hash(
    case_id: str,
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
    sensory_bus: Sequence[Dict[str, Any]],
    rule_ledger: Sequence[Dict[str, Any]],
) -> Dict[str, Any]:
    return {
        "branch_id": "CHECKPOINT_LAWFUL_A",
        "case_id": case_id,
        "world_trace": list(world_trace),
        "actor_memory": actor_memory,
        "sensory_bus": list(sensory_bus),
        "rule_ledger": list(rule_ledger),
    }


@dataclass(frozen=True)
class CheckpointLawfulA:
    """Verified, content-addressed Lawful Baseline `CHECKPOINT_LAWFUL_A`."""
    case_id: str
    checkpoint_id: str
    content_hash: str
    lawful_verified: bool
    world_trace: Tuple[Dict[str, Any], ...]
    actor_memory: Dict[str, List[Dict[str, Any]]]
    sensory_bus: Tuple[Dict[str, Any], ...]
    rule_ledger: Tuple[Dict[str, Any], ...]
    swarm_board_log: Tuple[Dict[str, Any], ...]
    accumulator_dag: Dict[str, Any]

    def verify_integrity(self) -> bool:
        if not self.lawful_verified or not self.checkpoint_id or not self.content_hash:
            return False
        expected = canonical_hash(
            _checkpoint_payload_for_hash(
                self.case_id,
                self.world_trace,
                self.actor_memory,
                self.sensory_bus,
                self.rule_ledger,
            )
        )
        return expected == self.content_hash

    def to_dict(self) -> Dict[str, Any]:
        return {
            "branch_id": "CHECKPOINT_LAWFUL_A",
            "checkpoint_id": self.checkpoint_id,
            "content_hash": self.content_hash,
            "lawful_verified": self.lawful_verified,
            "tick_count": len(self.world_trace),
            "world_trace": list(self.world_trace),
            "actor_memory": self.actor_memory,
            "actor_memory_summary": {k: v[-1] for k, v in self.actor_memory.items()},
            "sensory_bus": list(self.sensory_bus),
            "rule_ledger": list(self.rule_ledger),
            "swarm_board_log": list(self.swarm_board_log),
            "accumulator_dag": self.accumulator_dag,
        }


@dataclass(frozen=True)
class BranchClinamenAPrime:
    """Roubaud-qualified Clinamen Branch `BRANCH_CLINAMEN_A_PRIME`."""
    case_id: str
    branch_hash: str
    branch_lineage: Dict[str, Any]
    world_trace: Tuple[Dict[str, Any], ...]
    actor_memory: Dict[str, List[Dict[str, Any]]]
    sensory_bus: Tuple[Dict[str, Any], ...]
    rule_ledger: Tuple[Dict[str, Any], ...]
    swarm_board_log: Tuple[Dict[str, Any], ...]
    accumulator_dag: Dict[str, Any]
    divergence_audit: Dict[str, Any]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "branch_id": "BRANCH_CLINAMEN_A_PRIME",
            "branch_hash": self.branch_hash,
            "branch_lineage": self.branch_lineage,
            "tick_count": len(self.world_trace),
            "world_trace": list(self.world_trace),
            "actor_memory": self.actor_memory,
            "actor_memory_summary": {k: v[-1] for k, v in self.actor_memory.items()},
            "sensory_bus": list(self.sensory_bus),
            "rule_ledger": list(self.rule_ledger),
            "swarm_board_log": list(self.swarm_board_log),
            "accumulator_dag": self.accumulator_dag,
            "divergence_audit": self.divergence_audit,
        }


def compile_lawful_checkpoint_a(
    spec: CitySwarmSpec,
    world_trace: Sequence[Dict[str, Any]],
    actor_memory: Dict[str, List[Dict[str, Any]]],
    sensory_bus: Sequence[Dict[str, Any]],
    policy_evaluator: Callable[[Sequence[Dict[str, Any]], Dict[str, List[Dict[str, Any]]]], List[Dict[str, Any]]],
    utterance_script: Sequence[Tuple[int, str, str, str, str]],
) -> CheckpointLawfulA:
    """
    Execute, validate, and content-address `CHECKPOINT_LAWFUL_A`.
    Enforces volume conservation, faceless rig rule, deliberate push timing,
    off-screen continuity, sensory sync `<= 16.7ms`, P1-P4 formal ledger, and ConflictGrain arches.
    """
    label = f"{spec.case_id}:CHECKPOINT_LAWFUL_A"
    validate_kinematic_intentions(world_trace)
    validate_offscreen_continuity(world_trace, label)
    validate_sensory_bus(sensory_bus, label)

    for ag in spec.agents:
        if ag.agent_id not in actor_memory or len(actor_memory[ag.agent_id]) != TICK_COUNT:
            raise ValueError(f"{label}: actor_memory missing 25-tick trace for '{ag.agent_id}'.")

    rule_ledger = policy_evaluator(world_trace, actor_memory)
    validate_rule_ledger(rule_ledger, label)

    board_log, dag_summary = run_swarm_accumulator_exchange(
        spec=spec,
        branch_tag="LAWFUL_A",
        world_trace=world_trace,
        actor_memory=actor_memory,
        utterance_script=utterance_script,
    )

    content_hash = canonical_hash(
        _checkpoint_payload_for_hash(spec.case_id, world_trace, actor_memory, sensory_bus, rule_ledger)
    )
    checkpoint_id = f"ckpt-lawful-a-{spec.case_id}-{content_hash[:12]}"

    return CheckpointLawfulA(
        case_id=spec.case_id,
        checkpoint_id=checkpoint_id,
        content_hash=content_hash,
        lawful_verified=True,
        world_trace=tuple(world_trace),
        actor_memory=actor_memory,
        sensory_bus=tuple(sensory_bus),
        rule_ledger=tuple(rule_ledger),
        swarm_board_log=tuple(board_log),
        accumulator_dag=dag_summary,
    )


def fork_clinamen_branch_a_prime(
    spec: CitySwarmSpec,
    checkpoint_a: Optional[CheckpointLawfulA],
    post_swerve_builder: Callable[
        [CheckpointLawfulA, ClinamenSpec],
        Tuple[
            List[Dict[str, Any]],
            Dict[str, List[Dict[str, Any]]],
            List[Dict[str, Any]],
            List[Tuple[int, str, str, str, str]],
        ],
    ],
    policy_evaluator: Callable[[Sequence[Dict[str, Any]], Dict[str, List[Dict[str, Any]]]], List[Dict[str, Any]]],
) -> BranchClinamenAPrime:
    """
    Construct `BRANCH_CLINAMEN_A_PRIME` ONLY after verifying Roubaud's Qualification Gate
    against `CHECKPOINT_LAWFUL_A`, and verify Split-Trace Persistence + Epistemic Flip.
    """
    if checkpoint_a is None or not isinstance(checkpoint_a, CheckpointLawfulA):
        raise RoubaudQualificationError(
            "ROUBAUD_GATE_BLOCKED: Cannot construct BRANCH_CLINAMEN_A_PRIME without an executed "
            "CheckpointLawfulA instance."
        )
    if not checkpoint_a.lawful_verified:
        raise RoubaudQualificationError(
            f"ROUBAUD_GATE_BLOCKED: Baseline '{checkpoint_a.checkpoint_id}' has lawful_verified=False."
        )
    if checkpoint_a.case_id != spec.case_id:
        raise RoubaudQualificationError(
            f"ROUBAUD_GATE_BLOCKED: Baseline case_id '{checkpoint_a.case_id}' != '{spec.case_id}'."
        )
    if not checkpoint_a.verify_integrity():
        raise RoubaudQualificationError(
            f"ROUBAUD_GATE_BLOCKED: Baseline '{checkpoint_a.checkpoint_id}' failed content-address integrity check."
        )

    clinamen = spec.clinamen_spec
    swerve_tick = clinamen.swerve_tick
    label = f"{spec.case_id}:BRANCH_CLINAMEN_A_PRIME"

    world_trace_b, actor_memory_b, sensory_bus_b, utterances_b = post_swerve_builder(checkpoint_a, clinamen)

    validate_kinematic_intentions(world_trace_b)
    validate_offscreen_continuity(world_trace_b, label)
    validate_sensory_bus(sensory_bus_b, label)

    # --- Split-Trace Persistence Verification ---
    # 1. Pre-swerve ticks (0..swerve_tick) world_trace must match Baseline A identically
    for t in range(swerve_tick + 1):
        if canonical_hash(checkpoint_a.world_trace[t]) != canonical_hash(world_trace_b[t]):
            raise ValueError(
                f"{label}: pre-swerve world_trace mutated retroactively at tick {t} (swerve_tick={swerve_tick})."
            )

    # 2. Across ALL ticks 0..24, physical residues of the forgotten event (scuff_vector,
    #    oil_radius, shards, thermal_ember) must persist intact in World without erasure!
    for t in range(TICK_COUNT):
        res_a = checkpoint_a.world_trace[t]["residues"]
        res_b = world_trace_b[t]["residues"]
        for key in ("scuff_vector", "oil_radius", "shards", "thermal_ember"):
            if canonical_hash(res_a[key]) != canonical_hash(res_b[key]):
                raise ValueError(
                    f"{label} tick {t}: physical residue '{key}' was overwritten or erased in A' "
                    f"(A={res_a[key]!r} vs A'={res_b[key]!r})."
                )

    # 3. Witness memory must apply ⊣ FILTER at swerve_tick..24 without mutating non-witness pre-swerve memory
    wid = clinamen.witness_agent_id
    for t in range(swerve_tick):
        if canonical_hash(checkpoint_a.actor_memory[wid][t]) != canonical_hash(actor_memory_b[wid][t]):
            raise ValueError(f"{label}: witness '{wid}' memory mutated before swerve_tick at tick {t}.")

    for t in range(swerve_tick, TICK_COUNT):
        wmem_b = actor_memory_b[wid][t]
        retained_b = set(wmem_b.get("retained_events", []))
        for fp in clinamen.filtered_premises:
            if fp in retained_b:
                raise ValueError(
                    f"{label} tick {t}: filtered premise {fp!r} still present in witness '{wid}' retained_events."
                )
        if wmem_b.get("afterlight_op_applied") != "⊣":
            raise ValueError(
                f"{label} tick {t}: witness '{wid}' must record afterlight_op_applied == '⊣'."
            )

    # 4. Evaluate formal policies P1..P4 on A' and verify downstream action + verdict flip!
    rule_ledger_b = policy_evaluator(world_trace_b, actor_memory_b)
    validate_rule_ledger(rule_ledger_b, label)

    changed_actions: List[Dict[str, Any]] = []
    for ag in spec.agents:
        aid = ag.agent_id
        act_a = checkpoint_a.actor_memory[aid][-1]["next_action"]
        act_b = actor_memory_b[aid][-1]["next_action"]
        pos_a = checkpoint_a.world_trace[-1]["actors"][aid]
        pos_b = world_trace_b[-1]["actors"][aid]
        if act_a != act_b or abs(pos_a["x"] - pos_b["x"]) > 0.03 or abs(pos_a["tilt_rad"] - pos_b["tilt_rad"]) > 0.08:
            changed_actions.append({
                "agent_id": aid,
                "tick_range": [swerve_tick + 1, TICK_COUNT - 1],
                "action_in_A": act_a,
                "action_in_A_prime": act_b,
                "target_in_A": pos_a["target_actor"],
                "target_in_A_prime": pos_b["target_actor"],
                "posture_delta": {
                    "dx": round(pos_b["x"] - pos_a["x"], 4),
                    "dy": round(pos_b["y"] - pos_a["y"], 4),
                    "dtilt_rad": round(pos_b["tilt_rad"] - pos_a["tilt_rad"], 4),
                },
            })

    flipped_policies: List[Dict[str, Any]] = []
    for pa, pb in zip(checkpoint_a.rule_ledger, rule_ledger_b):
        if pa["verdict"] != pb["verdict"] or pa["payout_status"] != pb["payout_status"]:
            flipped_policies.append({
                "policy_id": pa["policy_id"],
                "verdict_A": pa["verdict"],
                "verdict_A_prime": pb["verdict"],
                "payout_A": pa["payout_status"],
                "payout_A_prime": pb["payout_status"],
            })

    if not changed_actions or not flipped_policies:
        raise EpistemicFlatlineError(
            f"{label}: Clinamen failed Epistemic Reconsideration Gate "
            f"(changed_actions={len(changed_actions)}, flipped_policies={len(flipped_policies)})."
        )

    board_log_b, dag_summary_b = run_swarm_accumulator_exchange(
        spec=spec,
        branch_tag="CLINAMEN_A_PRIME",
        world_trace=world_trace_b,
        actor_memory=actor_memory_b,
        utterance_script=utterances_b,
    )

    branch_lineage = {
        "parent_checkpoint_id": checkpoint_a.checkpoint_id,
        "lawful_verified": True,
        "clinamen_spec": clinamen.to_lineage_dict(),
    }
    branch_hash = canonical_hash({
        "branch_id": "BRANCH_CLINAMEN_A_PRIME",
        "case_id": spec.case_id,
        "branch_lineage": branch_lineage,
        "world_trace": world_trace_b,
        "actor_memory": actor_memory_b,
        "sensory_bus": sensory_bus_b,
        "rule_ledger": rule_ledger_b,
    })

    divergence_audit = {
        "swerve_tick": swerve_tick,
        "witness_agent_id": wid,
        "filtered_premises": list(clinamen.filtered_premises),
        "residues_preserved_across_swerve": True,
        "changed_actions": changed_actions,
        "flipped_policies": flipped_policies,
    }

    return BranchClinamenAPrime(
        case_id=spec.case_id,
        branch_hash=branch_hash,
        branch_lineage=branch_lineage,
        world_trace=tuple(world_trace_b),
        actor_memory=actor_memory_b,
        sensory_bus=tuple(sensory_bus_b),
        rule_ledger=tuple(rule_ledger_b),
        swarm_board_log=tuple(board_log_b),
        accumulator_dag=dag_summary_b,
        divergence_audit=divergence_audit,
    )


# ---------------------------------------------------------------------------
# 7. SCION SWARM BUILDER & PAIRWISE DISJOINTNESS REGISTRY
# ---------------------------------------------------------------------------

def pairwise_jaccard(ids_a: Iterable[str], ids_b: Iterable[str]) -> float:
    sa, sb = set(ids_a), set(ids_b)
    union = sa | sb
    if not union:
        return 0.0
    return len(sa & sb) / len(union)


class ScionSwarmBuilder:
    """
    Registry & compiler for handmade City Swarms.
    Enforces:
    - 3..5 bespoke `ScionAgentSpec` operators per swarm
    - Zero generic role tokens (`planner`, `worker`, `coder`, `researcher`, `assistant`, `agent_1`, `critic`, `verifier`, ...)
    - Global pairwise agent-ID disjointness (`jaccard(agents(city_p), agents(city_q)) == 0.0`)
    - Roubaud-verified `CHECKPOINT_LAWFUL_A` -> `BRANCH_CLINAMEN_A_PRIME` compilation
    """

    def __init__(self) -> None:
        self._specs: Dict[str, CitySwarmSpec] = {}
        self._compiled_cases: Dict[str, Dict[str, Any]] = {}
        self._agent_owner: Dict[str, str] = {}

    def register_swarm_spec(self, spec: CitySwarmSpec) -> None:
        if spec.case_id in self._specs:
            raise TrudeConvergenceError(f"Duplicate swarm case_id '{spec.case_id}'.")
        new_ids = {ag.agent_id for ag in spec.agents}
        for existing_case_id, existing_spec in self._specs.items():
            existing_ids = {ag.agent_id for ag in existing_spec.agents}
            jac = pairwise_jaccard(new_ids, existing_ids)
            if jac > 0.0:
                overlap = sorted(new_ids & existing_ids)
                raise TrudeConvergenceError(
                    f"SWARM_DISJOINTNESS_VIOLATION: '{spec.case_id}' shares agent ID(s) {overlap} "
                    f"with '{existing_case_id}' (jaccard={jac:.4f} != 0.0)."
                )
        for ag in spec.agents:
            self._agent_owner[ag.agent_id] = spec.case_id
        self._specs[spec.case_id] = spec

    def compile_case(
        self,
        spec: CitySwarmSpec,
        baseline_builder: Callable[
            [],
            Tuple[
                List[Dict[str, Any]],
                Dict[str, List[Dict[str, Any]]],
                List[Dict[str, Any]],
                List[Tuple[int, str, str, str, str]],
            ],
        ],
        clinamen_builder: Callable[
            [CheckpointLawfulA, ClinamenSpec],
            Tuple[
                List[Dict[str, Any]],
                Dict[str, List[Dict[str, Any]]],
                List[Dict[str, Any]],
                List[Tuple[int, str, str, str, str]],
            ],
        ],
        policy_evaluator: Callable[[Sequence[Dict[str, Any]], Dict[str, List[Dict[str, Any]]]], List[Dict[str, Any]]],
    ) -> Dict[str, Any]:
        """Register a `CitySwarmSpec`, verify `CHECKPOINT_LAWFUL_A`, and fork `BRANCH_CLINAMEN_A_PRIME`."""
        if spec.case_id not in self._specs:
            self.register_swarm_spec(spec)

        wt_a, mem_a, sb_a, utt_a = baseline_builder()
        ckpt_a = compile_lawful_checkpoint_a(
            spec=spec,
            world_trace=wt_a,
            actor_memory=mem_a,
            sensory_bus=sb_a,
            policy_evaluator=policy_evaluator,
            utterance_script=utt_a,
        )
        branch_b = fork_clinamen_branch_a_prime(
            spec=spec,
            checkpoint_a=ckpt_a,
            post_swerve_builder=clinamen_builder,
            policy_evaluator=policy_evaluator,
        )

        case_dict = {
            "case_id": spec.case_id,
            "kind": spec.kind,
            "city_index": spec.city_index,
            "city_name": spec.city_name,
            "title": spec.title,
            "chapter": spec.chapter,
            "series": spec.series,
            "series_rank": spec.series_rank,
            "weaver_page": spec.weaver_page,
            "desert_opposed": spec.desert_opposed,
            "optical_rule": spec.optical_rule,
            "material_nouns": list(spec.material_nouns),
            "loci": list(spec.loci),
            "agents": [ag.to_dict() for ag in spec.agents],
            "CHECKPOINT_LAWFUL_A": ckpt_a.to_dict(),
            "BRANCH_CLINAMEN_A_PRIME": branch_b.to_dict(),
            "branch_lineage": branch_b.branch_lineage,
            "divergence_audit": branch_b.divergence_audit,
            "clinamen_inquiry": spec.clinamen_inquiry,
            "thick_telemetry": spec.thick_telemetry,
        }
        self._compiled_cases[spec.case_id] = case_dict
        return case_dict

    def verify_global_disjointness(self) -> Dict[str, Any]:
        case_ids = sorted(self._specs.keys())
        max_jac = 0.0
        pairs_checked = 0
        for i in range(len(case_ids)):
            for j in range(i + 1, len(case_ids)):
                sa = {a.agent_id for a in self._specs[case_ids[i]].agents}
                sb = {a.agent_id for a in self._specs[case_ids[j]].agents}
                jac = pairwise_jaccard(sa, sb)
                max_jac = max(max_jac, jac)
                pairs_checked += 1
        return {
            "swarms_checked": len(case_ids),
            "pairs_checked": pairs_checked,
            "max_pairwise_jaccard": round(max_jac, 6),
            "disjoint_verified": max_jac == 0.0,
        }


# ---------------------------------------------------------------------------
# 8. STUDIO BUNDLE COMPILER (`build_studio_bundle`)
# ---------------------------------------------------------------------------

def load_olog_spec() -> Dict[str, Any]:
    olog_path = Path(__file__).resolve().parent.parent / "spec" / "olog_rev_001.json"
    with olog_path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def _build_lattice_index(compiled_city_ids: Set[str], proof_case_id: str) -> Dict[str, Any]:
    from scion_cities.swarms.catalog_55 import CITIES_55

    series_order = [
        "Cities and memory",
        "Cities and desire",
        "Cities and signs",
        "Thin cities",
        "Trading cities",
        "Cities and eyes",
        "Cities and names",
        "Cities and the dead",
        "Cities and the sky",
        "Continuous cities",
        "Hidden cities",
    ]
    entries: List[Dict[str, Any]] = []
    for c in CITIES_55:
        cid = f"city_{c.index:02d}_{c.name.lower()}"
        entries.append({
            "index": c.index,
            "case_id": cid,
            "city_name": c.name,
            "chapter": c.chapter,
            "series": c.series,
            "rank": c.rank,
            "weaver_page": c.weaver_page,
            "topology": c.topology,
            "status": "compiled" if cid in compiled_city_ids else "catalog_ready",
        })
    return {
        "pattern": "[5,4,3,2,1] Calvino 9-Chapter x 11-Series Diagonal Shift Matrix",
        "chapters": list(range(1, 10)),
        "series_order": series_order,
        "scene_0": {
            "index": 0,
            "case_id": proof_case_id,
            "city_name": "Abominable Cellar",
            "title": "THE FLOUR TEST — Cellar of Calvino's Abominable House",
            "chapter": 0,
            "series": "Scene 0: Risk Proof",
            "rank": 0,
            "status": "compiled",
        },
        "entries": entries,
    }


def build_studio_bundle(
    cities: List[Dict[str, Any]],
    proof_case: Optional[Dict[str, Any]] = None,
    output_path: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Assemble and validate the canonical `scion-worldtext-1.0` JSON studio bundle
    containing `proof_case`, `cities`, `palette`, `afterlight_grammar`,
    `lattice_index`, and `global_invariants`.
    """
    if proof_case is None:
        from scion_cities.core.flour_proof import build_flour_proof_case

        proof_case = build_flour_proof_case()

    olog = load_olog_spec()
    all_cases = [proof_case] + list(cities)
    if not cities:
        raise EmptySubstrateError("build_studio_bundle requires at least 1 compiled city swarm.")

    # Verify global pairwise agent-ID disjointness & invariants across all cases in bundle
    agent_sets: List[Tuple[str, Set[str]]] = []
    min_area = 999.0
    max_area = -999.0
    max_sync_ms = 0.0
    total_grains = 0
    roubaud_ok = True
    faceless_ok = True
    split_trace_ok = True
    epistemic_ok = True

    for case in all_cases:
        cid = case["case_id"]
        ids = {ag["agent_id"] for ag in case["agents"]}
        if not (3 <= len(ids) <= 5):
            raise TrudeConvergenceError(f"Case '{cid}' must have 3..5 bespoke agents.")
        for aid in ids:
            _check_forbidden_role_tokens(aid, cid)
        for prev_cid, prev_ids in agent_sets:
            jac = pairwise_jaccard(ids, prev_ids)
            if jac > 0.0:
                raise TrudeConvergenceError(
                    f"Pairwise agent overlap between '{cid}' and '{prev_cid}': jaccard={jac:.4f}"
                )
        agent_sets.append((cid, ids))

        br_a = case["CHECKPOINT_LAWFUL_A"]
        br_b = case["BRANCH_CLINAMEN_A_PRIME"]
        if not br_a.get("lawful_verified") or not br_b.get("branch_lineage", {}).get("lawful_verified"):
            roubaud_ok = False
        if br_b["branch_lineage"]["parent_checkpoint_id"] != br_a["checkpoint_id"]:
            roubaud_ok = False

        for br in (br_a, br_b):
            total_grains += len(br["accumulator_dag"]["conflict_grains"])
            for wt in br["world_trace"]:
                for af in wt["actors"].values():
                    if af.get("has_face_icons", False):
                        faceless_ok = False
                    ar = float(af["area_ratio"])
                    min_area = min(min_area, ar)
                    max_area = max(max_area, ar)
            for sb in br["sensory_bus"]:
                max_sync_ms = max(max_sync_ms, float(sb["sync_frame_delta_ms"]))

        if not case["divergence_audit"].get("residues_preserved_across_swerve"):
            split_trace_ok = False
        if not case["divergence_audit"].get("changed_actions") or not case["divergence_audit"].get("flipped_policies"):
            epistemic_ok = False

    if not (roubaud_ok and faceless_ok and split_trace_ok and epistemic_ok):
        raise ValueError("One or more global SCION studio invariants failed verification.")
    if min_area < 0.97 or max_area > 1.03:
        raise VolumeConservationError(f"Bundle area_ratio [{min_area}, {max_area}] outside 1.000 ± 0.03.")
    if max_sync_ms > 16.7:
        raise AudioSyncError(f"Bundle max_sync_frame_delta_ms={max_sync_ms} > 16.7ms.")

    compiled_city_ids = {c["case_id"] for c in cities}
    bundle: Dict[str, Any] = {
        "schema_version": "scion-worldtext-1.0",
        "palette": dict(WORLDFUL_PRESS_PALETTE),
        "afterlight_grammar": {
            "olog_revision": olog["revision_tag"],
            "higher_principle": olog["higher_principle"],
            "roles": [
                {"role": k, "symbol": v, "description": AFTERLIGHT_ROLE_DESCRIPTIONS[k]}
                for k, v in AFTERLIGHT_ROLES.items()
            ],
            "operations": [
                {"op": k, "symbol": v, "description": AFTERLIGHT_OP_DESCRIPTIONS[k]}
                for k, v in AFTERLIGHT_OPERATIONS.items()
            ],
            "rig_archetypes": list(VALID_RIG_ARCHETYPES),
            "exposure_timings": list(VALID_EXPOSURE_TIMINGS),
            "intention_kinematics": list(VALID_INTENTION_KINEMATICS),
            "accidental_motion_reference": build_accidental_motion_reference(),
        },
        "proof_case": proof_case,
        "cities": list(cities),
        "lattice_index": _build_lattice_index(compiled_city_ids, proof_case["case_id"]),
        "global_invariants": {
            "roubaud_all_verified": roubaud_ok,
            "faceless_rig_enforced": faceless_ok,
            "area_ratio_bounds": {
                "min_observed": round(min_area, 6),
                "max_observed": round(max_area, 6),
                "allowed_min": 0.97,
                "allowed_max": 1.03,
                "within_3pct_invariant": True,
            },
            "max_sync_frame_delta_ms": round(max_sync_ms, 3),
            "within_16_7ms_audio_sync": max_sync_ms <= 16.7,
            "split_trace_persistence_verified": split_trace_ok,
            "offscreen_continuity_verified": True,
            "epistemic_verdict_flip_verified": epistemic_ok,
            "pairwise_agent_jaccard_max": 0.0,
            "forbidden_generic_roles_count": 0,
            "total_swarms_compiled": len(all_cases),
            "total_bespoke_agents": sum(len(ids) for _, ids in agent_sets),
            "total_conflict_grains_minted": total_grains,
        },
    }

    if output_path:
        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)
        with out.open("w", encoding="utf-8") as fh:
            json.dump(bundle, fh, indent=2, ensure_ascii=False)

    return bundle


def write_wave1_proof_bundle(output_path: Optional[str] = None) -> Tuple[Path, Dict[str, Any]]:
    """Build Wave 1 proof bundle (`flour_proof` + `proof_zaira`) and write `build/proof_bundle.json`."""
    from scion_cities.core.flour_proof import build_flour_proof_case
    from scion_cities.swarms.proof_zaira import build_zaira_proof_city

    builder = ScionSwarmBuilder()
    proof_case = build_flour_proof_case(builder=builder)
    zaira_case = build_zaira_proof_city(builder=builder)
    default_out = Path(__file__).resolve().parent.parent / "build" / "proof_bundle.json"
    target = Path(output_path) if output_path else default_out
    bundle = build_studio_bundle(cities=[zaira_case], proof_case=proof_case, output_path=str(target))
    return target, bundle


if __name__ == "__main__":
    path, built = write_wave1_proof_bundle()
    print(f"Wrote {path} ({os.path.getsize(path)} bytes) with keys={list(built.keys())}")
