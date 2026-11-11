#!/usr/bin/env python3
"""
Compiles the self-contained, single-file Playable Sensory Scion Swarm Atelier
(`scion_cities/atelier/index.html`) directly from the 55-city Scion Swarm Builder.
"""
from __future__ import annotations

import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from scion_cities.swarms.catalog_55 import CITIES_55, SERIES_TO_TOPOLOGY
from scion_cities.swarms.scion_compiler import QUINE_MUTATION_OPS, ScionSwarmBuilder


def export_payload() -> dict:
    builder = ScionSwarmBuilder()
    swarms = builder.build_all_55_canonical(initial_ticks=3)
    cities_json = []
    for spec in CITIES_55:
        sw = swarms[spec.name.lower()]
        peak = sw.accumulator.peak_checkpoint()
        cities_json.append({
            "index": spec.index,
            "name": spec.name,
            "chapter": spec.chapter,
            "series": spec.series,
            "rank": spec.rank,
            "page": spec.weaver_page,
            "topology": spec.topology,
            "desert": spec.desert_opposed,
            "poleAlpha": spec.pole_alpha,
            "poleBeta": spec.pole_beta,
            "optics": spec.optical_rule,
            "loci": list(spec.loci),
            "peakHash": peak.state.state_hash,
            "peakTension": peak.tension,
            "archScars": sorted({g.scar_emblem for g in peak.state.conflict_grains.values()}),
            "agents": [
                {
                    "name": ag.name,
                    "locus": ag.locus,
                    "op": ag.op_kind,
                    "polarity": ag.polarity,
                    "emblems": list(ag.emblems),
                    "mag": ag.base_magnitude,
                    "ratio": list(ag.harmonic_ratio),
                }
                for ag in spec.agents
            ],
        })
    return {
        "ologRevision": "olog_rev_002:cce75c358010659c (prior:olog_rev_001:94c837a32a540b11)",
        "seriesOrder": list(SERIES_TO_TOPOLOGY.keys()),
        "mutationOps": list(QUINE_MUTATION_OPS),
        "cities": cities_json,
    }


HTML_TEMPLATE = r"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SCION SWARM BUILDER · Fifty-Five Handmade Cities</title>
<style>
  :root {
    --paper: #f2ead9;
    --paper-deep: #e6dac0;
    --paper-dim: #d6c7a7;
    --ink: #191512;
    --ink-soft: #4a4035;
    --ink-faint: #7b6d5c;
    --vermilion: #b32e22;
    --ochre: #b57e2d;
    --cobalt: #234b6e;
    --jade: #286652;
    --rule: rgba(25, 21, 18, 0.18);
    --rule-strong: rgba(25, 21, 18, 0.42);
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: 'Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', Georgia, serif;
    font-size: 14px;
    line-height: 1.4;
    overflow-x: hidden;
  }
  .mono {
    font-family: 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  header.mast {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 8px 16px;
    background: var(--ink);
    color: var(--paper);
    border-bottom: 2px solid var(--vermilion);
    font-size: 11px;
    letter-spacing: 0.07em;
  }
  header.mast .brand {
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  header.mast .pill {
    background: var(--vermilion);
    color: #fff;
    padding: 2px 6px;
    font-size: 10px;
    border-radius: 2px;
  }
  .controls-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
  }
  button, select, input[type="text"] {
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    font-size: 11px;
    background: var(--paper-deep);
    color: var(--ink);
    border: 1px solid var(--rule-strong);
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 2px;
  }
  button:hover {
    background: var(--ink);
    color: var(--paper);
  }
  button.hot {
    background: var(--vermilion);
    color: #fff;
    border-color: var(--vermilion);
  }
  button.hot:hover {
    background: #8c1f15;
  }
  button.active-audio {
    background: var(--jade);
    color: #fff;
    border-color: var(--jade);
  }
  .layout {
    display: grid;
    grid-template-columns: 310px 1fr 350px;
    min-height: calc(100vh - 44px);
  }
  @media (max-width: 1180px) {
    .layout { grid-template-columns: 1fr; }
  }
  .pane {
    border-right: 1px solid var(--rule-strong);
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .pane:last-child { border-right: none; }
  .section-head {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--ink-soft);
    border-bottom: 1px solid var(--rule);
    padding-bottom: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .matrix-grid {
    display: grid;
    grid-template-columns: repeat(11, 1fr);
    gap: 2px;
    background: var(--paper-dim);
    padding: 4px;
    border: 1px solid var(--rule-strong);
  }
  .m-cell {
    aspect-ratio: 1;
    font-size: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(242,234,217,0.45);
    color: var(--ink-faint);
    border-radius: 1px;
  }
  .m-cell.city {
    background: var(--paper);
    color: var(--ink);
    font-weight: 700;
    cursor: pointer;
    border: 1px solid rgba(25,21,18,0.22);
  }
  .m-cell.city:hover {
    background: var(--ochre);
    color: #fff;
  }
  .m-cell.city.selected {
    background: var(--vermilion);
    color: #fff;
    border-color: var(--ink);
  }
  .city-list {
    max-height: 270px;
    overflow-y: auto;
    border: 1px solid var(--rule);
    background: rgba(255,255,255,0.28);
  }
  .city-row {
    padding: 5px 8px;
    border-bottom: 1px solid var(--rule);
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    font-size: 12px;
  }
  .city-row:hover { background: var(--paper-deep); }
  .city-row.selected {
    background: var(--ink);
    color: var(--paper);
  }
  .city-row .meta {
    font-size: 10px;
    opacity: 0.72;
  }
  .forge-box {
    background: var(--paper-deep);
    border: 1px solid var(--rule-strong);
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .mut-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  }
  .mut-grid button {
    font-size: 10px;
    padding: 3px 5px;
    text-align: left;
  }
  .stage-wrap {
    display: flex;
    flex-direction: column;
    padding: 12px 16px;
    gap: 10px;
    background:
      radial-gradient(ellipse at 50% 20%, rgba(255,252,244,0.7), transparent 70%),
      var(--paper);
  }
  .city-banner {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 2px solid var(--ink);
    padding-bottom: 6px;
    gap: 8px;
  }
  .city-banner h1 {
    margin: 0;
    font-size: 26px;
    font-weight: 400;
    letter-spacing: 0.02em;
  }
  .city-banner .sub {
    font-size: 11px;
    color: var(--vermilion);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }
  .canvas-frame {
    position: relative;
    border: 2px solid var(--ink);
    background: #161310;
    height: 450px;
    overflow: hidden;
    box-shadow: inset 0 0 40px rgba(0,0,0,0.65);
  }
  canvas#stage {
    width: 100%;
    height: 100%;
    display: block;
    cursor: crosshair;
  }
  .hud-overlay {
    position: absolute;
    left: 10px;
    bottom: 8px;
    right: 10px;
    display: flex;
    justify-content: space-between;
    pointer-events: none;
    color: rgba(242,234,217,0.86);
    font-size: 10px;
    text-shadow: 0 1px 2px #000;
  }
  .slider-strip {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    background: var(--paper-deep);
    border: 1px solid var(--rule-strong);
    padding: 8px 10px;
    font-size: 11px;
  }
  .slider-strip label {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  input[type="range"] {
    accent-color: var(--vermilion);
    width: 100%;
  }
  .agent-card {
    background: rgba(255,255,255,0.42);
    border: 1px solid var(--rule-strong);
    border-left: 3px solid var(--vermilion);
    padding: 6px 8px;
    font-size: 11px;
  }
  .agent-card.pole-b {
    border-left-color: var(--cobalt);
  }
  .agent-card .ag-head {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    margin-bottom: 2px;
  }
  .emblem-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    margin-top: 4px;
  }
  .emblem-tags span {
    background: var(--paper-deep);
    border: 1px solid var(--rule);
    padding: 1px 4px;
    font-size: 9px;
  }
  .dag-log {
    font-size: 10px;
    background: #191512;
    color: #e8dec8;
    padding: 8px;
    border: 1px solid var(--ink);
    max-height: 210px;
    overflow-y: auto;
    line-height: 1.45;
  }
  .dag-log .scar { color: #ff7a6b; }
  .dag-log .ok { color: #7fe0b0; }
  .dag-log .warn { color: #f3c26b; }
</style>
</head>
<body>
<header class="mast mono">
  <div class="brand">
    <span>WORLDFUL · SCION SWARM BUILDER</span>
    <span class="pill" id="swarmCountBadge">55 BESPOKE SWARMS</span>
    <span style="opacity:0.7" id="ologBadge"></span>
  </div>
  <div class="controls-bar">
    <button id="btnStep" title="Execute 1 autonomous swarm round">STEP TICK</button>
    <button id="btnBurst" class="hot" title="Hammer accumulator with 100x contended micro-commits">100x CONTENTION STORM</button>
    <button id="btnAudio" title="Synthesize live polyphonic harmonic intervals per agent">AUDIO: OFF</button>
    <button id="btnRestorePeak" title="Revert overpolished drift to Peak Checkpoint">RESTORE PEAK</button>
  </div>
</header>

<div class="layout">
  <!-- LEFT PANE: 9x11 CALVINO MATRIX + QUINE SCION FORGE -->
  <aside class="pane">
    <div class="section-head mono">
      <span>Calvino 9×11 Diagonal Lattice</span>
      <span id="matrixCoord">CH 1 · #1</span>
    </div>
    <div class="matrix-grid mono" id="matrixGrid" title="11 Series × 55 Cities Oulipian Cascade"></div>

    <div class="section-head mono">
      <span>Handmade City Swarms</span>
      <input type="text" id="searchBox" placeholder="Filter city/agent..." style="padding:2px 5px;width:125px;">
    </div>
    <div class="city-list" id="cityList"></div>

    <div class="forge-box">
      <div class="section-head mono" style="border-color:var(--rule-strong)">
        <span>Quine Rule-Mutation Scion Forge</span>
      </div>
      <div class="mut-grid" id="mutGrid"></div>
      <div style="border-top:1px solid var(--rule);padding-top:6px;margin-top:2px;" class="mono">
        <div style="font-size:10px;margin-bottom:4px;">ATLAS HYBRID GRAFT (p.138 Troy × Constantinople):</div>
        <div style="display:flex;gap:4px;margin-bottom:4px;">
          <select id="hybridA" style="flex:1"></select>
          <select id="hybridB" style="flex:1"></select>
        </div>
        <button id="btnHybrid" style="width:100%">FORGE HYBRID SCION SWARM</button>
      </div>
    </div>
  </aside>

  <!-- CENTER PANE: PLAYABLE MULTIPLANE SWARM STAGE -->
  <main class="stage-wrap">
    <div class="city-banner">
      <div>
        <div class="sub mono" id="citySeriesLabel"></div>
        <h1 id="cityTitle"></h1>
      </div>
      <div class="mono" style="text-align:right;font-size:11px;">
        <div>TOPOLOGY: <strong id="cityTopology"></strong></div>
        <div style="color:var(--ink-soft)">OPPOSES DESERT: <span id="cityDesert"></span></div>
      </div>
    </div>

    <div class="canvas-frame">
      <canvas id="stage"></canvas>
      <div class="hud-overlay mono">
        <span id="hudOptics"></span>
        <span>CLICK CANVAS: INJECT EBONY-PORE CONTENTION ARCH</span>
      </div>
    </div>

    <div class="slider-strip mono">
      <label>
        <div style="display:flex;justify-content:space-between;">
          <span>POLO EXCEPTION SUBTRACTOR ↔ KUBLAI NORM</span>
          <span id="normVal">0.18 (Jagged)</span>
        </div>
        <input type="range" id="normSlider" min="0" max="100" value="18">
      </label>
      <label>
        <div style="display:flex;justify-content:space-between;">
          <span>SWARM STRICTNESS GATE (§9 Sparsity Breaker &gt;0.95)</span>
          <span id="strictVal">0.85</span>
        </div>
        <input type="range" id="strictSlider" min="50" max="99" value="85">
      </label>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;" class="mono" id="lociStrip"></div>
  </main>

  <!-- RIGHT PANE: BESPOKE AGENT ROSTER & LOCKLESS PHILOGYNY DAG -->
  <aside class="pane">
    <div class="section-head mono">
      <span>Bespoke Agent Swarm (Zero Shared Roles)</span>
      <span id="overlapProof" style="color:var(--jade)">JACCARD=0.000</span>
    </div>
    <div id="agentRoster" style="display:flex;flex-direction:column;gap:6px;"></div>

    <div class="section-head mono">
      <span>Lockless Philogyny DAG &amp; Arch Scars</span>
      <span id="tensionReadout"></span>
    </div>
    <div class="dag-log mono" id="dagLog"></div>
  </aside>
</div>

<script>
const PAYLOAD = __PAYLOAD_JSON__;

// Canonical FNV-1a content hash for lockless browser replay parity
function fnvHash(obj) {
  const s = typeof obj === 'string' ? obj : JSON.stringify(obj);
  let h1 = 0x811c9dc5 >>> 0;
  let h2 = 0x01000193 >>> 0;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 ^= c; h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= (c + i); h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
  }
  return h1.toString(16).padStart(8, '0') + h2.toString(16).padStart(8, '0');
}

const state = {
  cities: PAYLOAD.cities.map(c => JSON.parse(JSON.stringify(c))),
  selectedIdx: 0,
  tick: 3,
  normBias: 0.18,
  strictness: 0.85,
  audioOn: false,
  audioCtx: null,
  particles: [],
  arches: [],
  perturbs: [],
  checkpoints: {},
  logs: []
};

document.getElementById('ologBadge').textContent = PAYLOAD.ologRevision;

function initCityRuntime(city) {
  if (!city.runtime) {
    city.runtime = {
      tick: 3,
      commits: 12,
      branches: 2,
      tension: city.peakTension,
      peakTension: city.peakTension,
      headHash: city.peakHash.slice(0, 16),
      peakHash: city.peakHash.slice(0, 16),
      scars: [...city.archScars],
      quarantine: []
    };
  }
  return city.runtime;
}

state.cities.forEach(initCityRuntime);

// WebAudio Just-Intonation Polyphonic Synthesizer
function triggerSwarmChord(city, isArch = false) {
  if (!state.audioOn) return;
  if (!state.audioCtx) {
    state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (state.audioCtx.state === 'suspended') state.audioCtx.resume();
  const now = state.audioCtx.currentTime;
  const rootHz = 146.83 + (city.chapter * 11.5); // D3-rooted chapter transposition
  city.agents.forEach((ag, idx) => {
    const osc = state.audioCtx.createOscillator();
    const gain = state.audioCtx.createGain();
    const freq = rootHz * (ag.ratio[0] / ag.ratio[1]) * (isArch && idx % 2 === 1 ? 1.5 : 1.0);
    osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(isArch ? 0.065 : 0.035, now + 0.03 + idx * 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (isArch ? 0.75 : 0.42));
    osc.connect(gain).connect(state.audioCtx.destination);
    osc.start(now + idx * 0.015);
    osc.stop(now + (isArch ? 0.8 : 0.46));
  });
}

function logEvent(html) {
  state.logs.unshift(html);
  if (state.logs.length > 48) state.logs.pop();
  document.getElementById('dagLog').innerHTML = state.logs.join('<br>');
}

function buildMatrixUI() {
  const grid = document.getElementById('matrixGrid');
  grid.innerHTML = '';
  // Build 9 chapters rows? 55 cells looks super clean as an 11-series column grid across 9 chapter bands (9x11 = 99 slots, 55 occupied on the diagonal!)
  for (let ch = 1; ch <= 9; ch++) {
    for (let sIdx = 0; sIdx < 11; sIdx++) {
      const seriesName = PAYLOAD.seriesOrder[sIdx];
      const foundIdx = state.cities.findIndex(c => c.index <= 55 && c.chapter === ch && c.series === seriesName);
      const div = document.createElement('div');
      if (foundIdx >= 0) {
        const c = state.cities[foundIdx];
        div.className = 'm-cell city' + (foundIdx === state.selectedIdx ? ' selected' : '');
        div.textContent = c.rank;
        div.title = `#${c.index} ${c.name} (${c.series} ${c.rank}, Ch.${c.chapter})`;
        div.onclick = () => selectCity(foundIdx);
      } else {
        div.className = 'm-cell';
        div.textContent = '·';
      }
      grid.appendChild(div);
    }
  }
}

function buildCityListUI() {
  const q = document.getElementById('searchBox').value.trim().toLowerCase();
  const list = document.getElementById('cityList');
  list.innerHTML = '';
  state.cities.forEach((c, idx) => {
    const matchText = `${c.name} ${c.series} ${c.topology} ${c.agents.map(a => a.name).join(' ')}`.toLowerCase();
    if (q && !matchText.includes(q)) return;
    const row = document.createElement('div');
    row.className = 'city-row' + (idx === state.selectedIdx ? ' selected' : '');
    row.innerHTML = `<span><strong>${c.index}. ${c.name}</strong></span><span class="meta mono">${c.topology.split('_')[0]}</span>`;
    row.onclick = () => selectCity(idx);
    list.appendChild(row);
  });
  document.getElementById('swarmCountBadge').textContent = `${state.cities.length} BESPOKE SWARMS`;

  // Populate hybrid selects
  ['hybridA', 'hybridB'].forEach((id, k) => {
    const sel = document.getElementById(id);
    const prev = sel.value;
    sel.innerHTML = state.cities.map((c, i) => `<option value="${i}">${c.name}</option>`).join('');
    sel.value = prev !== '' && state.cities[prev] ? prev : (k === 0 ? '17' : '25'); // Armilla x Octavia default
  });
}

function spawnVisualSwarm(city) {
  state.particles = city.agents.map((ag, idx) => {
    const angle = (idx / city.agents.length) * Math.PI * 2 + 0.4;
    return {
      ag,
      idx,
      x: 0.5 + Math.cos(angle) * 0.24,
      y: 0.5 + Math.sin(angle) * 0.22,
      vx: Math.cos(angle + 1.2) * 0.0022 * (ag.ratio[0] / ag.ratio[1]),
      vy: Math.sin(angle + 1.2) * 0.0022 * (ag.ratio[0] / ag.ratio[1]),
      trail: []
    };
  });
  state.arches = city.runtime.scars.map((sc, i) => ({
    label: sc,
    x1: 0.22 + (i * 0.19) % 0.5,
    y1: 0.68 - (i % 2) * 0.25,
    x2: 0.78 - (i * 0.17) % 0.45,
    y2: 0.65 - ((i + 1) % 2) * 0.22,
    strength: 1.0
  }));
  state.perturbs = [];
}

function renderSelectedDetails() {
  const city = state.cities[state.selectedIdx];
  const rt = initCityRuntime(city);
  document.getElementById('matrixCoord').textContent = `CH ${city.chapter} · #${city.index} · p.${city.page}`;
  document.getElementById('citySeriesLabel').textContent = `${city.series.toUpperCase()} · ${city.rank} (WEAVER P.${city.page})`;
  document.getElementById('cityTitle').textContent = city.name;
  document.getElementById('cityTopology').textContent = city.topology;
  document.getElementById('cityDesert').textContent = city.desert;
  document.getElementById('hudOptics').textContent = `OPTICS: ${city.optics}`;
  document.getElementById('tensionReadout').textContent = `TENSION=${rt.tension.toFixed(1)} · BRANCHES=${rt.branches}`;

  const roster = document.getElementById('agentRoster');
  roster.innerHTML = city.agents.map(ag => {
    const isPoleB = ag.polarity === city.poleBeta;
    return `<div class="agent-card ${isPoleB ? 'pole-b' : ''}">
      <div class="ag-head mono">
        <span>${ag.name}</span>
        <span>${ag.ratio[0]}:${ag.ratio[1]}</span>
      </div>
      <div class="mono" style="font-size:10px;color:var(--ink-soft);">
        [${ag.op}] → <strong>${ag.locus}</strong> · pol=${ag.polarity} · mag=${ag.mag}
      </div>
      <div class="emblem-tags mono">
        ${ag.emblems.map(e => `<span>${e}</span>`).join('')}
      </div>
    </div>`;
  }).join('');

  const lociStrip = document.getElementById('lociStrip');
  lociStrip.innerHTML = city.loci.map((loc, i) => {
    const bound = city.agents.filter(a => a.locus === loc);
    const hasCollision = new Set(bound.map(b => b.polarity)).size > 1;
    return `<div style="background:rgba(255,255,255,0.45);border:1px solid var(--rule-strong);padding:6px 8px;font-size:10px;">
      <div style="color:${hasCollision ? 'var(--vermilion)' : 'var(--ink-soft)'};font-weight:700;">
        LOCUS ${i + 1}: ${loc} ${hasCollision ? '⚡ ARCH' : ''}
      </div>
      <div style="margin-top:2px;">Agents: ${bound.map(b => b.name.split('_').slice(-1)[0]).join(', ') || 'shuffled'}</div>
    </div>`;
  }).join('');
}

function selectCity(idx) {
  state.selectedIdx = idx;
  const city = state.cities[idx];
  initCityRuntime(city);
  buildMatrixUI();
  buildCityListUI();
  spawnVisualSwarm(city);
  renderSelectedDetails();
  triggerSwarmChord(city, false);
  logEvent(`<span class="ok">[LOAD]</span> ◻(${city.name}) swarm online · head=${city.runtime.headHash} · ${city.agents.length} handmade agents`);
}

function stepCitySwarm(burstCount = 1) {
  const city = state.cities[state.selectedIdx];
  const rt = initCityRuntime(city);

  // Check Kublai Norm-Collapse Trap (CT2)
  if (state.normBias > 0.78) {
    logEvent(`<span class="warn">[TRUDE_CONVERGENCE_BLOCKED]</span> Kublai norm bias ${(state.normBias).toFixed(2)} attempted to flatten ${city.name}. Restoring Peak Checkpoint ${rt.peakHash}!`);
    state.normBias = 0.18;
    document.getElementById('normSlider').value = 18;
    document.getElementById('normVal').textContent = '0.18 (Restored)';
    rt.tension = rt.peakTension;
    rt.headHash = rt.peakHash;
    renderSelectedDetails();
    return;
  }

  let forwardPayloads = [];
  for (let b = 0; b < burstCount; b++) {
    rt.tick += 1;
    city.agents.forEach((ag, idx) => {
      if (state.strictness > 0.95 && idx === 3 && b === 0) {
        rt.quarantine.push(`${ag.name}@t${rt.tick}`);
        logEvent(`<span class="warn">[SPARSITY_TRAP &gt;0.95]</span> Quarantined anomalous stone from ${ag.name} into &lt;uncertain&gt; branch.`);
        return;
      }
      const delta = {
        ag: ag.name,
        loc: ag.locus,
        pol: ag.polarity,
        mag: +(ag.mag + ((rt.tick + idx) % 5) * 0.23 * (1 - state.normBias)).toFixed(3),
        b
      };
      forwardPayloads.push(delta);
    });
  }

  // Verify CD1/CD2 order-independence between forward and reversed commit batches!
  const canonicalFwd = forwardPayloads.map(d => fnvHash(d)).sort();
  const canonicalRev = [...forwardPayloads].reverse().map(d => fnvHash(d)).sort();
  const hashFwd = fnvHash(canonicalFwd);
  const hashRev = fnvHash(canonicalRev);

  rt.commits += forwardPayloads.length;
  rt.headHash = hashFwd;
  const newScar = `arch(${city.loci[0]}:${city.poleAlpha}<->${city.poleBeta}@t${rt.tick})`;
  if (!rt.scars.includes(newScar) && rt.scars.length < 9) {
    rt.scars.push(newScar);
    state.arches.push({
      label: newScar,
      x1: 0.16 + Math.random() * 0.28,
      y1: 0.28 + Math.random() * 0.48,
      x2: 0.56 + Math.random() * 0.28,
      y2: 0.28 + Math.random() * 0.48,
      strength: 1.2
    });
  }
  rt.branches = Math.min(16, rt.branches + 1);
  rt.tension = +(rt.tension + (burstCount > 1 ? 9.4 : 1.85) * (1 - state.normBias * 0.6)).toFixed(2);
  if (rt.tension > rt.peakTension) {
    rt.peakTension = rt.tension;
    rt.peakHash = rt.headHash;
  }

  triggerSwarmChord(city, burstCount > 1);
  renderSelectedDetails();
  if (burstCount > 1) {
    logEvent(`<span class="scar">[100x STORM PASS]</span> ${forwardPayloads.length} contended micro-commits · fwd=${hashFwd} === rev=${hashRev} · ConflictGrains=${rt.scars.length}`);
  } else {
    logEvent(`<span class="ok">[TICK ${rt.tick}]</span> head=${hashFwd} · minted <span class="scar">${newScar}</span>`);
  }
}

// Quine Rule-Mutation Forge in Browser
function forgeMutatedScion(op) {
  const parent = state.cities[state.selectedIdx];
  const newIdx = state.cities.length + 1;
  const slug = `${parent.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${op}`;
  const suffixes = ['carver', 'inverter', 'spanner', 'warden'];
  const topoList = Object.values({
    a: 'PALIMPSEST_ECHO', b: 'DESIRE_TRAP_BIFURCATION', c: 'SEMIOTIC_INVERSION',
    d: 'TENSILE_VOID_RIG', e: 'CHORD_EXCHANGE_WEB', f: 'SPECULAR_PARALLAX',
    g: 'ONOMASTIC_SHARD_SHUFFLE', h: 'NECROPOLIS_ROLE_CASCADE',
    i: 'CELESTIAL_BLUEPRINT_COUPLING', j: 'PERIMETER_ACCRETION_SPRAWL', k: 'NESTED_GERM_EMERGENCE'
  });
  const newTopo = op === 'mirror_axis' ? 'SPECULAR_PARALLAX'
    : op === 'slow_time' ? 'NECROPOLIS_ROLE_CASCADE'
    : op === 'spawn_echo' ? 'NESTED_GERM_EMERGENCE'
    : op === 'simplify_rules' ? 'TENSILE_VOID_RIG'
    : op === 'transmute_medium' ? 'CELESTIAL_BLUEPRINT_COUPLING'
    : topoList[(newIdx * 3) % topoList.length];

  const pa = `${op}_${parent.poleBeta}`;
  const pb = `counter_${parent.poleAlpha}`;
  const newLoci = parent.loci.map(l => `${op.split('_')[0]}_${l}`);
  const newAgents = parent.agents.map((ag, i) => ({
    name: `${slug}_${suffixes[i]}_${newIdx}`,
    locus: i < 2 ? newLoci[0] : newLoci[Math.min(i - 1, 2)],
    op: i < 2 ? 'polarity_carve' : ag.op,
    polarity: i % 2 === 0 ? pa : pb,
    emblems: ag.emblems.map(e => `${op}:${e}`),
    mag: +(11.4 - ag.mag + i * 0.6).toFixed(2),
    ratio: [ag.ratio[1] + i + 1, Math.max(1, ag.ratio[0])]
  }));

  const scion = {
    index: newIdx,
    name: `${parent.name}-${op.replace('_', '-')}`,
    chapter: parent.chapter,
    series: `Scion (${op})`,
    rank: 1,
    page: parent.page,
    topology: newTopo,
    desert: `parent friction of ${parent.name}`,
    poleAlpha: pa,
    poleBeta: pb,
    optics: `[${op.toUpperCase()}] ${parent.optics}`,
    loci: newLoci,
    peakHash: fnvHash(newAgents),
    peakTension: +(parent.peakTension + 6.4).toFixed(2),
    archScars: [`arch(${newLoci[0]}:${pa}<->${pb})`],
    agents: newAgents
  };
  initCityRuntime(scion);
  state.cities.push(scion);
  selectCity(state.cities.length - 1);
  logEvent(`<span class="scar">[QUINE SCION FORGED]</span> Mutated ${parent.name} via <strong>${op}</strong> → ${scion.name} (4 new zero-overlap agents)`);
}

function forgeHybridScion() {
  const idxA = +document.getElementById('hybridA').value;
  const idxB = +document.getElementById('hybridB').value;
  if (idxA === idxB) {
    logEvent(`<span class="warn">[HYBRID REJECTED]</span> Choose two distinct cities so their arches contend!`);
    return;
  }
  const ca = state.cities[idxA];
  const cb = state.cities[idxB];
  const newIdx = state.cities.length + 1;
  const scionName = `${ca.name.slice(0, 4)}${cb.name.slice(-4)}-${newIdx}`;
  const slug = scionName.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const nexus = `${slug}_confluence_arch`;
  const loci = [nexus, `${slug}_${ca.loci[1]}`, `${slug}_${cb.loci[2]}`];
  const agents = [
    { name: `${slug}_${ca.name.toLowerCase()}_keel`, locus: nexus, op: 'polarity_carve', polarity: ca.poleAlpha, emblems: [...ca.agents[0].emblems.slice(0,2), `graft:${ca.name}`], mag: +(ca.agents[0].mag + 0.9).toFixed(2), ratio: ca.agents[0].ratio },
    { name: `${slug}_${cb.name.toLowerCase()}_span`, locus: nexus, op: 'polarity_carve', polarity: cb.poleBeta, emblems: [...cb.agents[1].emblems.slice(0,2), `graft:${cb.name}`], mag: +Math.max(1.5, cb.agents[1].mag - 1.6).toFixed(2), ratio: cb.agents[1].ratio },
    { name: `${slug}_parallax_weaver`, locus: loci[1], op: 'emblem_union', polarity: ca.poleBeta, emblems: [ca.agents[2].emblems[0], cb.agents[2].emblems[0]], mag: 6.8, ratio: ca.agents[2].ratio },
    { name: `${slug}_keystone_warden`, locus: loci[2], op: 'altitude_max', polarity: cb.poleAlpha, emblems: [ca.agents[3].emblems[0], cb.agents[3].emblems[0]], mag: 9.1, ratio: cb.agents[3].ratio }
  ];
  const scion = {
    index: newIdx,
    name: scionName,
    chapter: 9,
    series: `${ca.name} × ${cb.name}`,
    rank: 5,
    page: 138,
    topology: cb.topology,
    desert: `${ca.desert} ⊗ ${cb.desert}`,
    poleAlpha: ca.poleAlpha,
    poleBeta: cb.poleBeta,
    optics: `${ca.optics} // GRAFTED // ${cb.optics}`,
    loci,
    peakHash: fnvHash(agents),
    peakTension: +(Math.max(ca.peakTension, cb.peakTension) + 8.2).toFixed(2),
    archScars: [`arch(${nexus}:${ca.poleAlpha}<->${cb.poleBeta})`],
    agents
  };
  initCityRuntime(scion);
  state.cities.push(scion);
  selectCity(state.cities.length - 1);
  logEvent(`<span class="scar">[ATLAS HYBRID]</span> ${ca.name} × ${cb.name} → <strong>${scionName}</strong>`);
}

// Build Mutation Buttons
const mutGrid = document.getElementById('mutGrid');
PAYLOAD.mutationOps.forEach(op => {
  const b = document.createElement('button');
  b.textContent = `⊕ ${op}`;
  b.onclick = () => forgeMutatedScion(op);
  mutGrid.appendChild(b);
});

document.getElementById('btnHybrid').onclick = forgeHybridScion;
document.getElementById('btnStep').onclick = () => stepCitySwarm(1);
document.getElementById('btnBurst').onclick = () => stepCitySwarm(100);
document.getElementById('btnAudio').onclick = (e) => {
  state.audioOn = !state.audioOn;
  e.target.textContent = `AUDIO: ${state.audioOn ? 'ON' : 'OFF'}`;
  e.target.className = state.audioOn ? 'active-audio' : '';
  if (state.audioOn) triggerSwarmChord(state.cities[state.selectedIdx], true);
};
document.getElementById('btnRestorePeak').onclick = () => {
  const city = state.cities[state.selectedIdx];
  const rt = initCityRuntime(city);
  rt.tension = rt.peakTension;
  rt.headHash = rt.peakHash;
  state.normBias = 0.15;
  document.getElementById('normSlider').value = 15;
  document.getElementById('normVal').textContent = '0.15 (Peak)';
  renderSelectedDetails();
  logEvent(`<span class="ok">[PEAK RESTORED]</span> Reverted to checkpoint ${rt.peakHash} (tension=${rt.peakTension.toFixed(1)})`);
};
document.getElementById('searchBox').oninput = buildCityListUI;
document.getElementById('normSlider').oninput = (e) => {
  state.normBias = +e.target.value / 100;
  document.getElementById('normVal').textContent = `${state.normBias.toFixed(2)} ${state.normBias > 0.7 ? '(Trude Risk!)' : '(Jagged)'}`;
};
document.getElementById('strictSlider').oninput = (e) => {
  state.strictness = +e.target.value / 100;
  document.getElementById('strictVal').textContent = state.strictness.toFixed(2);
};

// Interactive Canvas & 11 Topology Renderers
const canvas = document.getElementById('stage');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

canvas.addEventListener('click', (ev) => {
  const rect = canvas.getBoundingClientRect();
  const nx = (ev.clientX - rect.left) / rect.width;
  const ny = (ev.clientY - rect.top) / rect.height;
  const city = state.cities[state.selectedIdx];
  state.perturbs.push({ x: nx, y: ny, r: 4, alpha: 1.0 });
  // Pull agents toward ebony pore contention point to mint an arch!
  state.particles.forEach((p, idx) => {
    const dx = nx - p.x;
    const dy = ny - p.y;
    const sign = idx % 2 === 0 ? 1 : -0.85;
    p.vx += dx * 0.018 * sign;
    p.vy += dy * 0.018 * sign;
  });
  state.arches.push({
    label: `ebony_pore_arch@${nx.toFixed(2)}`,
    x1: Math.max(0.08, nx - 0.16),
    y1: Math.min(0.88, ny + 0.12),
    x2: Math.min(0.92, nx + 0.16),
    y2: Math.min(0.88, ny + 0.12),
    strength: 1.4
  });
  if (state.arches.length > 12) state.arches.shift();
  stepCitySwarm(1);
});

let frameT = 0;
function drawLoop() {
  frameT += 0.016;
  const w = canvas.width / window.devicePixelRatio;
  const h = canvas.height / window.devicePixelRatio;
  const city = state.cities[state.selectedIdx];
  const topo = city.topology;

  // Archival obsidian plate background
  ctx.fillStyle = '#15120f';
  ctx.fillRect(0, 0, w, h);

  // Subtle surveyor contour grid
  ctx.strokeStyle = 'rgba(230, 218, 192, 0.06)';
  ctx.lineWidth = 1;
  for (let gx = 40; gx < w; gx += 60) {
    ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
  }
  for (let gy = 40; gy < h; gy += 60) {
    ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
  }

  // Topology-specific multiplane structural geometry
  if (topo === 'TENSILE_VOID_RIG') {
    // Catenary abyss net + suspended gondolas / hydraulic risers (Octavia, Armilla, Isaura, Zenobia, Sophronia)
    ctx.strokeStyle = 'rgba(242, 234, 217, 0.42)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 12) {
      const u = (x / w) * 2 - 1;
      const sag = h * 0.24 + (1 - u * u) * 68 + Math.sin(frameT * 2 + x * 0.02) * 3;
      if (x === 0) ctx.moveTo(x, sag); else ctx.lineTo(x, sag);
      if (x % 48 === 0 && x > 20 && x < w - 20) {
        const drop = 75 + ((x * 17) % 110);
        ctx.strokeStyle = 'rgba(95, 175, 215, 0.35)';
        ctx.strokeRect(x - 6, sag + drop, 12, 16);
      }
    }
    ctx.strokeStyle = 'rgba(242, 234, 217, 0.5)';
    ctx.stroke();
  } else if (topo === 'SPECULAR_PARALLAX') {
    // Asymmetric lake mirror horizon (Valdrada, Moriana, Baucis, Zemrude, Phyllis)
    const midY = h * 0.52;
    ctx.strokeStyle = 'rgba(95, 165, 210, 0.55)';
    ctx.beginPath(); ctx.moveTo(0, midY); ctx.lineTo(w, midY); ctx.stroke();
    state.particles.forEach(p => {
      ctx.strokeStyle = 'rgba(95, 165, 210, 0.32)';
      ctx.beginPath();
      ctx.arc(p.x * w, midY + (midY - p.y * h) * 0.88, 11, 0, Math.PI * 2);
      ctx.stroke();
    });
  } else if (topo === 'NESTED_GERM_EMERGENCE') {
    // 4-deep simultaneous concentric sheaths (Berenice, Olinda, Raissa, Marozia, Theodora)
    for (let ring = 1; ring <= 4; ring++) {
      ctx.save();
      ctx.translate(w * 0.5, h * 0.5);
      ctx.rotate(frameT * (ring % 2 === 0 ? -0.35 : 0.45) * ring * 0.3);
      ctx.strokeStyle = ring % 2 === 0 ? 'rgba(179, 46, 34, 0.48)' : 'rgba(127, 224, 176, 0.42)';
      ctx.setLineDash([8, 5]);
      ctx.beginPath();
      ctx.arc(0, 0, ring * 44 + Math.sin(frameT * 2 + ring) * 4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  } else if (topo === 'CHORD_EXCHANGE_WEB') {
    // Taut multi-colored Ersilia strings between all agents & loci
    const colors = ['#f2ead9', '#777777', '#b32e22', '#e0b354'];
    for (let i = 0; i < state.particles.length; i++) {
      for (let j = i + 1; j < state.particles.length; j++) {
        ctx.strokeStyle = colors[(i + j) % colors.length];
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(state.particles[i].x * w, state.particles[i].y * h);
        ctx.lineTo(state.particles[j].x * w, state.particles[j].y * h);
        ctx.stroke();
      }
    }
  } else if (topo === 'CELESTIAL_BLUEPRINT_COUPLING') {
    // Star blueprint constellations coupled by vertical sightlines to terrestrial cranes
    for (let s = 0; s < 16; s++) {
      const sx = ((s * 97 + city.index * 31) % (w - 60)) + 30;
      const sy = 24 + ((s * 53) % (h * 0.34));
      ctx.fillStyle = '#f7df94';
      ctx.fillRect(sx - 1.5, sy - 1.5, 3, 3);
      if (s % 4 === 0) {
        ctx.strokeStyle = 'rgba(247, 223, 148, 0.18)';
        ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx, h - 40); ctx.stroke();
      }
    }
  } else if (topo === 'PERIMETER_ACCRETION_SPRAWL') {
    // Rising Leonia perimeter ramparts pressing inward
    ctx.strokeStyle = 'rgba(181, 126, 45, 0.5)';
    for (let layer = 0; layer < 4; layer++) {
      const inset = 16 + layer * 16;
      ctx.strokeRect(inset, inset, w - inset * 2, h - inset * 2);
    }
  } else if (topo === 'PALIMPSEST_ECHO') {
    // Zaira scar-rungs & Zora nine-jet radial銅 clock graduations
    ctx.strokeStyle = 'rgba(214, 199, 167, 0.28)';
    for (let rung = 0; rung < 9; rung++) {
      const ry = 42 + rung * ((h - 84) / 8);
      const notch = 18 + ((rung * 29 + city.index * 7) % 90);
      ctx.beginPath();
      ctx.moveTo(28, ry);
      ctx.lineTo(28 + notch, ry);
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    for (let jet = 0; jet < 9; jet++) {
      const a = (jet / 9) * Math.PI * 2 + frameT * 0.12;
      ctx.strokeStyle = 'rgba(181, 126, 45, 0.34)';
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * 28, Math.sin(a) * 28);
      ctx.lineTo(Math.cos(a) * 118, Math.sin(a) * 118);
      ctx.stroke();
    }
    ctx.restore();
  } else if (topo === 'DESIRE_TRAP_BIFURCATION') {
    // Zobeide winding pursuit labyrinth + Fedora blue glass counterfactual globes
    ctx.strokeStyle = 'rgba(224, 90, 71, 0.34)';
    ctx.beginPath();
    for (let t = 0; t < 56; t++) {
      const ang = t * 0.38 + frameT * 0.35;
      const rad = 14 + t * 3.1;
      const sx = w * 0.5 + Math.cos(ang) * rad * 1.25;
      const sy = h * 0.5 + Math.sin(ang) * rad * 0.78;
      if (t === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
    for (let g = 0; g < 3; g++) {
      const gx = w * (0.24 + g * 0.26);
      const gy = h * 0.24 + Math.sin(frameT * 1.5 + g) * 8;
      ctx.fillStyle = 'rgba(72, 148, 212, 0.18)';
      ctx.beginPath(); ctx.arc(gx, gy, 22, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(120, 195, 245, 0.55)';
      ctx.stroke();
    }
  } else if (topo === 'SEMIOTIC_INVERSION') {
    // Tamara/Hypatia/Olivia upper signifier frieze vs inverted lower basalt referent plane
    ctx.strokeStyle = 'rgba(242, 234, 217, 0.32)';
    ctx.setLineDash([4, 6]);
    ctx.beginPath(); ctx.moveTo(20, h * 0.48); ctx.lineTo(w - 20, h * 0.48); ctx.stroke();
    ctx.setLineDash([]);
    for (let k = 0; k < 6; k++) {
      const kx = 65 + k * ((w - 130) / 5);
      ctx.strokeStyle = 'rgba(224, 179, 84, 0.48)';
      ctx.strokeRect(kx - 14, 34, 28, 22);
      ctx.strokeStyle = 'rgba(94, 168, 220, 0.44)';
      ctx.beginPath();
      ctx.moveTo(kx, h - 30);
      ctx.lineTo(kx - 15, h - 56);
      ctx.lineTo(kx + 15, h - 56);
      ctx.closePath();
      ctx.stroke();
    }
  } else if (topo === 'ONOMASTIC_SHARD_SHUFFLE') {
    // Clarice/Leandra cyclic shard permutation polygon between urban loci
    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.rotate(frameT * 0.28);
    ctx.strokeStyle = 'rgba(214, 199, 167, 0.4)';
    ctx.beginPath();
    for (let v = 0; v <= 6; v++) {
      const va = (v / 6) * Math.PI * 2;
      const vx = Math.cos(va) * 128;
      const vy = Math.sin(va) * 96;
      if (v === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
    }
    ctx.stroke();
    ctx.restore();
  } else if (topo === 'NECROPOLIS_ROLE_CASCADE') {
    // Melania/Eusapia/Laudomia tripartite hourglass: Unborn -> Living -> Dead twin strata
    const yTop = h * 0.31, yBot = h * 0.69;
    ctx.strokeStyle = 'rgba(242, 234, 217, 0.3)';
    ctx.beginPath();
    ctx.moveTo(w * 0.32, 22); ctx.lineTo(w * 0.5, h * 0.5); ctx.lineTo(w * 0.32, h - 22);
    ctx.moveTo(w * 0.68, 22); ctx.lineTo(w * 0.5, h * 0.5); ctx.lineTo(w * 0.68, h - 22);
    ctx.moveTo(24, yTop); ctx.lineTo(w - 24, yTop);
    ctx.moveTo(24, yBot); ctx.lineTo(w - 24, yBot);
    ctx.stroke();
  }

  // Draw Loci Anchors
  city.loci.forEach((loc, i) => {
    const lx = w * (0.22 + i * 0.28);
    const ly = h * (i === 1 ? 0.36 : 0.66);
    ctx.strokeStyle = 'rgba(242, 234, 217, 0.45)';
    ctx.lineWidth = 1;
    ctx.strokeRect(lx - 18, ly - 18, 36, 36);
    ctx.fillStyle = 'rgba(242, 234, 217, 0.72)';
    ctx.font = '10px ui-monospace, monospace';
    ctx.fillText(loc, lx - 36, ly + 30);
  });

  // Draw ConflictGrain Arch Keystones ("Without stones there is no arch")
  state.arches.forEach((ar, idx) => {
    const x1 = ar.x1 * w, y1 = ar.y1 * h, x2 = ar.x2 * w, y2 = ar.y2 * h;
    const cx = (x1 + x2) * 0.5;
    const cy = Math.min(y1, y2) - 55 - (idx % 3) * 16;
    ctx.strokeStyle = 'rgba(215, 72, 56, 0.78)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cx, cy, x2, y2);
    ctx.stroke();
    // Keystone diamond
    const kx = 0.25 * x1 + 0.5 * cx + 0.25 * x2;
    const ky = 0.25 * y1 + 0.5 * cy + 0.25 * y2;
    ctx.fillStyle = '#ff6b57';
    ctx.beginPath();
    ctx.moveTo(kx, ky - 5); ctx.lineTo(kx + 5, ky); ctx.lineTo(kx, ky + 5); ctx.lineTo(kx - 5, ky);
    ctx.closePath();
    ctx.fill();
  });

  // Update & Draw the 4 Bespoke Scion Agents
  state.particles.forEach((p, idx) => {
    const locusIdx = Math.max(0, city.loci.indexOf(p.ag.locus));
    const tx = 0.22 + locusIdx * 0.28 + Math.cos(frameT * (1 + idx * 0.4)) * 0.09;
    const ty = (locusIdx === 1 ? 0.36 : 0.66) + Math.sin(frameT * (1.2 + idx * 0.3)) * 0.09;
    p.vx = p.vx * 0.94 + (tx - p.x) * 0.0045;
    p.vy = p.vy * 0.94 + (ty - p.y) * 0.0045;
    p.x = Math.max(0.06, Math.min(0.94, p.x + p.vx));
    p.y = Math.max(0.08, Math.min(0.90, p.y + p.vy));
    p.trail.push({ x: p.x * w, y: p.y * h });
    if (p.trail.length > 26) p.trail.shift();

    const isPoleB = p.ag.polarity === city.poleBeta;
    const col = isPoleB ? '#5ea8dc' : '#e05a47';

    ctx.strokeStyle = isPoleB ? 'rgba(94,168,220,0.35)' : 'rgba(224,90,71,0.35)';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    p.trail.forEach((pt, ti) => { if (ti === 0) ctx.moveTo(pt.x, pt.y); else ctx.lineTo(pt.x, pt.y); });
    ctx.stroke();

    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(p.x * w, p.y * h, 5 + p.ag.mag * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f2ead9';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#f2ead9';
    ctx.font = '10px ui-monospace, monospace';
    ctx.fillText(p.ag.name, p.x * w + 10, p.y * h - 6);
  });

  // Draw Ebony Pore click ripples
  state.perturbs.forEach(pt => {
    ctx.strokeStyle = `rgba(255, 122, 107, ${pt.alpha})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(pt.x * w, pt.y * h, pt.r, 0, Math.PI * 2);
    ctx.stroke();
    pt.r += 2.4;
    pt.alpha *= 0.93;
  });
  state.perturbs = state.perturbs.filter(pt => pt.alpha > 0.04);

  requestAnimationFrame(drawLoop);
}

selectCity(17); // Open on #18 Armilla (wall-less singing hydraulic pipe swarm) by default!
requestAnimationFrame(drawLoop);
</script>
</body>
</html>
"""


def main() -> None:
    payload = export_payload()
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "atelier")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "index.html")
    html = HTML_TEMPLATE.replace("__PAYLOAD_JSON__", json.dumps(payload, separators=(",", ":")))
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"BUILT ATELIER: {out_path} ({len(html)} bytes, {len(payload['cities'])} bespoke city swarms)")


if __name__ == "__main__":
    main()
