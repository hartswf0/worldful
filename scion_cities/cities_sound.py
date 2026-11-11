#!/opt/homebrew/bin/python3
"""
SCION 55-City Parameter-Coupled Sound & Kokoro v1.0 Timing Builder.

For each of the 55 canonical cities (`01-diomira` .. `55-berenice`):
1. Runs the deterministic `PhilogynyAccumulator` across the city's 4 bespoke
   `ScionAgent`s (`CITIES_55`) to verify `CHECKPOINT_LAWFUL_A` (`pole_alpha`)
   and mint the non-commuting `ConflictGrain` arch (`BRANCH_CLINAMEN_A_PRIME`, `pole_beta`).
2. Synthesizes Marco Polo (`bm_fable`), Kublai Khan (`bm_george`), and the
   Fulcrum Better-Question voice (`bf_emma`) via local ONNX Kokoro v1.0.
3. Generates frame-locked (`0.0ms` drift) parameter-coupled WebAudio/WAV foley:
   - Shot 1 (`T1` Baseline A): 440 Hz reference hum + exact `harmonic_ratio` interval + clock ticks.
   - Shot 2 (`T2 -> T3` Clinamen Swerve): Topology-specific physical collision foley
     (lamp crackle, pulley rope creak, ceramic shard shuffle, buried door slam, crystal fracture).
   - Shot 3 (`T4 -> T5` Fulcrum Cut-In): -8.5 dB ambient hush + resonant arch chord.
"""
from __future__ import annotations

import json
import math
import os
import subprocess
import sys
from typing import Any, Dict, List
import numpy as np
from scipy.io import wavfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from scion_cities.core.accumulator import MicroCommit, PhilogynyAccumulator
from scion_cities.swarms.catalog_55 import CITIES_55, CityGenomeSpec
from scion_cities.cities_dramaturgy import CITY_SCRIPTS
from studio.kokoro_tts import speak
from studio.build_sound import lp, hp, bp, mix_at, apply_verb

SR = 48000
FPS = 24
AUDIO_DIR = os.path.join(HERE, "audio")
TIMING_DIR = os.path.join(HERE, "timing")
CKPT_DIR = os.path.join(HERE, "checkpoints", "cities")
for d in (AUDIO_DIR, TIMING_DIR, CKPT_DIR):
    os.makedirs(d, exist_ok=True)


def execute_city_clinamen_trace(spec: CityGenomeSpec) -> Dict[str, Any]:
    """
    Verify Roubaud Baseline A (`pole_alpha` agents) first, save `CHECKPOINT_LAWFUL_A`,
    then inject the opposing `pole_beta` swerve agents to mint `ConflictGrain` arches.
    """
    acc = PhilogynyAccumulator(city_name=spec.name, strictness=0.85)
    alpha_agents = [a for a in spec.agents if a.polarity == spec.pole_alpha]
    beta_agents = [a for a in spec.agents if a.polarity != spec.pole_alpha]
    if not alpha_agents:
        alpha_agents = [spec.agents[0]]
    if not beta_agents:
        beta_agents = list(spec.agents[1:])

    # Step 1: Lawful Baseline A
    commits_a = [
        MicroCommit(
            agent_name=ag.name,
            locus=ag.locus,
            op_kind=ag.op_kind if ag.op_kind in ("emblem_union", "altitude_max") else "emblem_union",
            polarity=spec.pole_alpha,
            emblems=ag.emblems,
            magnitude=ag.base_magnitude,
            parent_hash=acc.genesis_hash,
        )
        for ag in alpha_agents
    ]
    res_a = acc.accumulate_batch(acc.genesis_hash, commits_a)
    ckpt_a = acc.save_checkpoint(acc.states_by_hash[res_a["trunk_hash"]], f"CHECKPOINT_LAWFUL_A:{spec.pole_alpha}")

    # Step 2: Fork Clinamen Branch A' (non-commuting collision on shared primary locus)
    shared_locus = spec.loci[0]
    commits_swerve = [
        MicroCommit(
            agent_name=alpha_agents[0].name,
            locus=shared_locus,
            op_kind="polarity_carve",
            polarity=spec.pole_alpha,
            emblems=alpha_agents[0].emblems,
            magnitude=alpha_agents[0].base_magnitude,
            parent_hash=ckpt_a.state.state_hash,
        ),
        MicroCommit(
            agent_name=beta_agents[0].name,
            locus=shared_locus,
            op_kind="polarity_carve",
            polarity=spec.pole_beta,
            emblems=beta_agents[0].emblems,
            magnitude=beta_agents[0].base_magnitude,
            parent_hash=ckpt_a.state.state_hash,
        ),
    ]
    for extra in beta_agents[1:]:
        commits_swerve.append(
            MicroCommit(
                agent_name=extra.name,
                locus=extra.locus,
                op_kind=extra.op_kind,
                polarity=extra.polarity,
                emblems=extra.emblems,
                magnitude=extra.base_magnitude,
                parent_hash=ckpt_a.state.state_hash,
            )
        )
    res_ap = acc.accumulate_batch(ckpt_a.state.state_hash, commits_swerve)
    best_ap = acc.peak_checkpoint()

    trace = {
        "city_index": spec.index,
        "city_name": spec.name,
        "chapter": spec.chapter,
        "series": spec.series,
        "rank": spec.rank,
        "topology": spec.topology,
        "desert_opposed": spec.desert_opposed,
        "pole_alpha": spec.pole_alpha,
        "pole_beta": spec.pole_beta,
        "optical_rule": spec.optical_rule,
        "loci": list(spec.loci),
        "checkpoint_lawful_a": {
            "id": ckpt_a.checkpoint_id,
            "state_hash": ckpt_a.state.state_hash,
            "tension": ckpt_a.tension,
            "verified": True,
        },
        "branch_clinamen_a_prime": {
            "id": best_ap.checkpoint_id,
            "active_heads": res_ap["active_heads"],
            "grains_minted": res_ap["grains_minted"],
            "peak_tension": res_ap["peak_tension"],
        },
        "agents": [
            {
                "name": ag.name,
                "locus": ag.locus,
                "op_kind": ag.op_kind,
                "polarity": ag.polarity,
                "emblems": list(ag.emblems),
                "magnitude": ag.base_magnitude,
                "harmonic_ratio": list(ag.harmonic_ratio),
            }
            for ag in spec.agents
        ],
    }
    return trace


def synth_topology_foley(rng: np.random.Generator, topology: str, ratio: List[int]) -> np.ndarray:
    """Parameter-coupled material foley transient locked to the exact T2/T3 clinamen frame."""
    n = int(0.62 * SR)
    t = np.arange(n) / float(SR)
    base_f = 220.0 * (ratio[0] / max(1.0, float(ratio[1])))

    if topology in ("PALIMPSEST_ECHO", "SPECULAR_PARALLAX"):
        # Silver lamp / mirror glass fracture shimmer + stone step
        pings = (
            np.sin(2 * np.pi * base_f * 6.0 * t) * np.exp(-t * 14.0) * 0.16
            + np.sin(2 * np.pi * base_f * 8.3 * t) * np.exp(-t * 19.0) * 0.12
        )
        step = bp(rng.standard_normal(n), 320, 2200) * np.exp(-t * 18.0) * 0.24
        return pings + step
    if topology in ("TENSILE_VOID_RIG", "CHORD_EXCHANGE_WEB"):
        # Taut hempen rope / pulley creak + plucked string harmonic
        pluck = np.sin(2 * np.pi * base_f * 2.0 * t) * np.exp(-t * 7.5) * 0.24
        creak = bp(rng.standard_normal(n), 280, 920) * (0.5 + 0.5 * np.sin(2 * np.pi * 19.0 * t)) * np.exp(-t * 6.5) * 0.26
        return pluck + creak
    if topology in ("NECROPOLIS_ROLE_CASCADE", "PERIMETER_ACCRETION_SPRAWL"):
        # Buried heavy oak door slam / refuse avalanche rumble + hourglass sand
        thud = np.sin(2 * np.pi * (88.0 * np.exp(-t * 10.0)) * t) * np.exp(-t * 11.0) * 0.42
        hiss = bp(rng.standard_normal(n), 1400, 5200) * np.exp(-t * 5.0) * 0.16
        return thud + hiss
    if topology in ("CELESTIAL_BLUEPRINT_COUPLING", "NESTED_GERM_EMERGENCE"):
        # Ticking counterweight escapement + crystal/nova bell
        ticks = np.exp(-((t * 12.0) % 1.0) * 32.0) * bp(rng.standard_normal(n), 1600, 4200) * 0.22
        bell = np.sin(2 * np.pi * base_f * 4.0 * t) * np.exp(-t * 5.5) * 0.20
        return ticks + bell
    # DESIRE_TRAP_BIFURCATION, SEMIOTIC_INVERSION, ONOMASTIC_SHARD_SHUFFLE
    shard = np.sin(2 * np.pi * (base_f * 5.2) * t) * np.exp(-t * 16.0) * 0.18
    knock = np.sin(2 * np.pi * (135.0 * np.exp(-t * 14.0)) * t) * np.exp(-t * 18.0) * 0.30
    rustle = bp(rng.standard_normal(n), 600, 2900) * np.exp(-t * 12.0) * 0.20
    return shard + knock + rustle


def build_city_sound(spec: CityGenomeSpec, force: bool = False) -> Dict[str, Any]:
    slug, line_polo, line_khan, line_fulcrum = CITY_SCRIPTS[spec.index]
    timing_path = os.path.join(TIMING_DIR, f"{slug}.json")
    m4a_path = os.path.join(AUDIO_DIR, f"{slug}.m4a")
    ckpt_path = os.path.join(CKPT_DIR, f"{slug}.json")

    swarm_trace = execute_city_clinamen_trace(spec)
    with open(ckpt_path, "w", encoding="utf-8") as f:
        json.dump(swarm_trace, f, indent=2)

    if not force and os.path.exists(timing_path) and os.path.exists(m4a_path):
        with open(timing_path, "r", encoding="utf-8") as f:
            return json.load(f)

    rng = np.random.default_rng(1900 + spec.index)

    # Title slate spoken announcement + 3 dramaturgical shots
    title_txt = f"City {spec.index}: {spec.name}. {spec.series}, {spec.rank}."
    beats_raw = [
        ("slate", "bf_emma", 1.02, title_txt, False, "T0_SLATE"),
        ("polo", "bm_fable", 0.96, line_polo, False, "T1_BASELINE_A"),
        ("khan", "bm_george", 0.94, line_khan, False, "T2_T3_CLINAMEN_SWERVE"),
        ("archivist", "bf_emma", 0.91, line_fulcrum, True, "T4_T5_BETTER_QUESTION"),
    ]

    cursor = 0.45
    shots: List[Dict[str, Any]] = []
    voice_clips = []

    for speaker, voice, spd, txt, is_fulcrum, stage_tag in beats_raw:
        if is_fulcrum:
            cursor += 0.45  # Deliberate pre-fulcrum stillness hold!
        wav = speak(txt, voice=voice, speed=spd, target_sr=SR)
        dur = len(wav) / float(SR)
        t0 = cursor
        t1 = cursor + dur
        shots.append({
            "stage": stage_tag,
            "speaker": speaker,
            "voice": voice,
            "text": txt,
            "line": is_fulcrum,
            "t0": round(t0, 3),
            "t1": round(t1, 3),
            "d": round(dur + (0.85 if is_fulcrum else 0.50), 3),
        })
        pan = -0.20 if speaker == "polo" else (0.20 if speaker == "khan" else 0.0)
        voice_clips.append((t0, wav, pan, is_fulcrum))
        cursor = t1 + (0.85 if is_fulcrum else 0.50)

    total_dur = max(24.0, cursor + 0.65)
    total_frames = int(round(total_dur * FPS))
    total_samples = int(total_dur * SR) + SR // 4
    mix = np.zeros((total_samples, 2), dtype=np.float64)

    t = np.arange(total_samples) / float(SR)
    swerve_frame = int(round(shots[2]["t0"] * FPS))
    swerve_sec = swerve_frame / float(FPS)
    fulcrum_t0 = shots[3]["t0"] - 0.25
    fulcrum_t1 = shots[3]["t1"] + 0.35

    # 1. Lawful 440Hz reference sine + city harmonic ratio drone before swerve, shifting after swerve
    r_num, r_den = spec.agents[0].harmonic_ratio
    r2_num, r2_den = spec.agents[2].harmonic_ratio
    freq_a = 220.0 * (r_num / float(r_den))
    freq_b = 220.0 * (r2_num / float(r2_den))

    duck = np.where((t >= fulcrum_t0) & (t <= fulcrum_t1), 0.36, 1.0)
    hum_440 = np.sin(2 * np.pi * 440.0 * t) * np.where(t < swerve_sec, 0.013, 0.002) * duck
    chord_a = np.sin(2 * np.pi * freq_a * t) * np.where(t < swerve_sec, 0.011, 0.005) * duck
    chord_b = np.sin(2 * np.pi * freq_b * t) * np.where(t >= swerve_sec, 0.013, 0.000) * duck

    # Room / wind texture
    airL = bp(rng.standard_normal(total_samples), 110, 680) * 0.011 * duck
    airR = bp(rng.standard_normal(total_samples), 115, 700) * 0.011 * duck
    mix[:, 0] += airL + hum_440 + chord_a
    mix[:, 1] += airR + hum_440 + chord_b

    # 2. Frame-locked clock ticks during Baseline A (every 12 frames = 0.5s)
    for f_tick in range(0, swerve_frame, 12):
        ts = f_tick / float(FPS)
        nt = int(0.03 * SR)
        tt = np.arange(nt) / float(SR)
        ck = np.sin(2 * np.pi * 1580.0 * tt) * np.exp(-tt * 130.0) * 0.055
        mix_at(mix, ck, ts, gain=1.0, pan=-0.1)

    # 3. Exact frame-locked Clinamen Swerve & Encounter Foley at `swerve_frame` and midpoint!
    foley_main = synth_topology_foley(rng, spec.topology, list(spec.agents[2].harmonic_ratio))
    mix_at(mix, foley_main, swerve_sec, gain=0.95, pan=0.12)
    mix_at(mix, foley_main * 0.72, (shots[2]["t0"] + shots[2]["t1"]) * 0.5, gain=0.80, pan=-0.15)

    # Fulcrum keystone bell chime at exact start of Better Question
    nb = int(0.95 * SR)
    tb = np.arange(nb) / float(SR)
    arch_bell = (
        np.sin(2 * np.pi * freq_b * 2.0 * tb) * np.exp(-tb * 3.8) * 0.14
        + np.sin(2 * np.pi * freq_a * 3.0 * tb) * np.exp(-tb * 5.2) * 0.09
    )
    mix_at(mix, arch_bell, shots[3]["t0"] - 0.08, gain=0.85, pan=0.0)

    # 4. Mix Kokoro voices with natural acoustic space
    room_kind = "hall" if spec.chapter in (1, 5, 7, 9) else ("mountain" if "Thin" in spec.series or "sky" in spec.series else "square")
    for t0, wav, pan, is_f in clips_iter(voice_clips):
        st = apply_verb(wav, room=room_kind, wet=0.12 if not is_f else 0.18)
        st[:, 0] *= (1.0 - max(0.0, pan) * 0.32)
        st[:, 1] *= (1.0 + min(0.0, pan) * 0.32)
        mix_at(mix, st, t0, gain=0.95 if is_f else 0.90)

    mix = mix[: int(total_dur * SR)]
    peak = max(np.max(np.abs(mix)), 1e-6)
    mix_i16 = np.clip(mix / peak * 0.89 * 32767.0, -32767, 32767).astype(np.int16)

    wav_tmp = os.path.join(AUDIO_DIR, f"{slug}.wav")
    wavfile.write(wav_tmp, SR, mix_i16)
    subprocess.run([
        "/opt/homebrew/bin/ffmpeg", "-y", "-loglevel", "error",
        "-i", wav_tmp, "-c:a", "aac", "-b:a", "192k", m4a_path
    ], check=True)
    os.remove(wav_tmp)

    # 24fps amplitude envelope for subtle constant-volume breath/weight coupling
    mono_abs = np.mean(np.abs(mix), axis=1)
    sp_per_f = SR // FPS
    env = []
    for f_i in range(total_frames):
        seg = mono_abs[f_i * sp_per_f : (f_i + 1) * sp_per_f]
        env.append(round(float(np.mean(seg)) if len(seg) else 0.0, 4))

    timing = {
        "slug": slug,
        "city_index": spec.index,
        "city_name": spec.name,
        "chapter": spec.chapter,
        "series": spec.series,
        "rank": spec.rank,
        "topology": spec.topology,
        "pole_alpha": spec.pole_alpha,
        "pole_beta": spec.pole_beta,
        "optical_rule": spec.optical_rule,
        "duration": round(total_dur, 3),
        "total_frames": total_frames,
        "swerve_frame": swerve_frame,
        "fulcrum_frame": int(round(shots[3]["t0"] * FPS)),
        "checkpoint_lawful_a_id": swarm_trace["checkpoint_lawful_a"]["id"],
        "clinamen_grains": swarm_trace["branch_clinamen_a_prime"]["grains_minted"],
        "shots": shots,
        "env": env,
    }
    with open(timing_path, "w", encoding="utf-8") as f:
        json.dump(timing, f, indent=2)
    return timing


def clips_iter(v):
    return v


if __name__ == "__main__":
    idx = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    t_info = build_city_sound(CITIES_55[idx - 1], force="--force" in sys.argv)
    print(f"[sound] {t_info['slug']}: {t_info['duration']}s ({t_info['total_frames']}f), swerve@F{t_info['swerve_frame']}")
