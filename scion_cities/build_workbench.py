#!/opt/homebrew/bin/python3
"""
Builds `/Users/gaia/WORLDFUL/scion_cities/workbench.html` — Portable Single-File
HTML5 / Canvas / WebAudio SCION Clinamen Operative Studio Workbench (v1.0).

Embeds the verified canonical worldtext store (`flour_test_worldtext.json`) directly
so there is zero mock script disconnection between visual frames, physical residue,
witness memory, P1-P4 policy evaluation, and frame-locked WebAudio foley.
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from scion_cities.core.flour_engine import build_and_verify_flour_proof


HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>SCION — Clinamen Operative Studio &amp; Thick Worldtext Engine (v1.0)</title>
<style>
  :root {
    --paper: #f2ead9;
    --paper-hi: #faf5ea;
    --paper-deep: #e2d5bc;
    --ink: #1d1915;
    --ink-mid: #4a4035;
    --ink-faint: #7c6f5e;
    --crimson: #a8291e;
    --sanguine: #9e472a;
    --blueprint: #284b63;
    --emerald: #265940;
    --ochre: #b57c26;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--paper);
    color: var(--ink);
    font-family: "Georgia", "Iowan Old Style", serif;
    line-height: 1.42;
  }
  header.masthead {
    border-bottom: 2px solid var(--ink);
    background: var(--paper-deep);
    padding: 12px 18px;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 10px;
  }
  .masthead h1 {
    margin: 0;
    font-size: 1.18rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .mono {
    font-family: "Menlo", "IBM Plex Mono", monospace;
    font-size: 0.78rem;
  }
  .nav-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 8px 18px;
    background: var(--paper-hi);
    border-bottom: 1.5px solid var(--ink);
  }
  button, select {
    font-family: "Menlo", "IBM Plex Mono", monospace;
    font-size: 0.76rem;
    background: var(--paper);
    color: var(--ink);
    border: 1.5px solid var(--ink);
    padding: 6px 10px;
    cursor: pointer;
    box-shadow: 2px 2px 0 var(--ink);
    transition: transform 0.04s ease;
  }
  button:active {
    transform: translate(1px, 1px);
    box-shadow: 1px 1px 0 var(--ink);
  }
  button.active {
    background: var(--ink);
    color: var(--paper-hi);
  }
  button.crimson {
    border-color: var(--crimson);
    color: var(--crimson);
    font-weight: 700;
  }
  button.crimson.active {
    background: var(--crimson);
    color: var(--paper-hi);
  }
  main {
    max-width: 1480px;
    margin: 0 auto;
    padding: 14px 18px 36px;
  }
  .panel { display: none; }
  .panel.active { display: block; }
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 10px;
    background: var(--paper-hi);
    border: 1.5px solid var(--ink);
    margin-bottom: 12px;
  }
  .dual-stage {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  @media (max-width: 960px) {
    .dual-stage { grid-template-columns: 1fr; }
  }
  .viewport-card {
    border: 2px solid var(--ink);
    background: var(--paper-hi);
    position: relative;
  }
  .viewport-head {
    padding: 6px 10px;
    border-bottom: 1.5px solid var(--ink);
    background: var(--paper-deep);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  canvas.stage-canvas {
    display: block;
    width: 100%;
    height: auto;
    background: #efe5cf;
    touch-action: none;
  }
  .scrubber-bar {
    margin-top: 10px;
    padding: 10px 12px;
    border: 1.5px solid var(--ink);
    background: var(--paper-hi);
  }
  input[type="range"] {
    width: 100%;
    accent-color: var(--crimson);
    cursor: pointer;
  }
  .tick-markers {
    display: flex;
    justify-content: space-between;
    margin-top: 4px;
    color: var(--ink-mid);
  }
  .grid-2 {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 12px;
    margin-top: 12px;
  }
  @media (max-width: 960px) {
    .grid-2 { grid-template-columns: 1fr; }
  }
  .ledger-box {
    border: 1.5px solid var(--ink);
    background: var(--paper-hi);
    padding: 10px 12px;
  }
  .ledger-box h3 {
    margin: 0 0 8px 0;
    font-size: 0.92rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    border-bottom: 1px solid var(--ink-faint);
    padding-bottom: 4px;
  }
  table.clause-table {
    width: 100%;
    border-collapse: collapse;
    font-family: "Menlo", "IBM Plex Mono", monospace;
    font-size: 0.72rem;
  }
  table.clause-table th, table.clause-table td {
    border: 1px solid var(--ink-faint);
    padding: 5px 6px;
    text-align: left;
    vertical-align: top;
  }
  table.clause-table th { background: var(--paper-deep); }
  .diff-flip { background: rgba(168, 41, 30, 0.14); font-weight: bold; color: var(--crimson); }
  .ok-pill { color: var(--emerald); font-weight: bold; }
  .hide-labels .annot-text { display: none !important; }
  .manner-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 10px;
  }
  @media (max-width: 800px) {
    .manner-strip { grid-template-columns: 1fr; }
  }
  .manuscript-overlay {
    border: 2px dashed var(--crimson);
    background: #f9efd8;
    padding: 12px;
    margin-top: 10px;
  }
  a.cinema-link {
    color: var(--crimson);
    font-weight: bold;
    text-decoration: underline;
  }
</style>
</head>
<body>

<header class="masthead">
  <div>
    <h1>SCION — Clinamen Operative Studio &amp; Thick Worldtext Engine</h1>
    <div class="mono annot-text">
      Checkpoint: <strong id="hdr-ckpt"></strong> · Roubaud Baseline Verified: <span class="ok-pill">TRUE</span> · Max Volume Drift: <strong id="hdr-vol"></strong> (&le;3.0% Gate)
    </div>
  </div>
  <div class="mono">
    <a class="cinema-link" href="index.html">Open 55-City Multiplane Cinema &amp; Drive Console &rarr;</a>
  </div>
</header>

<nav class="nav-tabs" role="tablist">
  <button class="active" data-tab="tab-flour">[D] First Risk Case: Flour Test Witness Workbench</button>
  <button data-tab="tab-chalk">[A] Module 1: Clinamen Chalk-Vector Sandbox</button>
  <button data-tab="tab-thick">[B] Module 2: Thick-Description Over-the-Shoulder</button>
  <button data-tab="tab-ekphrasis">[C] Module 3: Operative Ekphrasis Sketch-to-World</button>
</nav>

<main id="app-root">
  <!-- ===================================================================== -->
  <!-- INSTRUMENT D: COUPLED VIDEO-TEXT WITNESS WORKBENCH (THE FLOUR TEST)   -->
  <!-- ===================================================================== -->
  <section id="tab-flour" class="panel active">
    <div class="toolbar">
      <button id="btn-play" class="active">&#9654; Play / Pause (24fps)</button>
      <button id="btn-prev">&larr; -1 Frame</button>
      <button id="btn-next">+1 Frame &rarr;</button>
      <button id="btn-sound" class="crimson">&#9835; Enable Coupled WebAudio (440Hz &rarr; Foley)</button>
      <button id="btn-mute-labels">[Mute Audio &amp; Hide Labels: Silhouette Gate]</button>
      <label class="mono">Semantic Zoom:
        <select id="sel-zoom">
          <option value="1">1x Cellar Stage (Multiplane Rough Ink)</option>
          <option value="4">4x Vector, Spine &amp; Constant-Volume Rig</option>
          <option value="16">16x Coupled Event-Clause &amp; Afterlight DAG</option>
        </select>
      </label>
      <button id="btn-nisba-audit" title="Mutate P3 rule to require forensic scuff corroboration">[Toggle P3 Forensic Audit Override]</button>
    </div>

    <div class="dual-stage">
      <div class="viewport-card">
        <div class="viewport-head mono annot-text">
          <span><strong>CHECKPOINT_LAWFUL_A</strong> (Complete Witness Memory)</span>
          <span id="badge-a">440 Hz Reference Hum · P1 Arson Bar</span>
        </div>
        <canvas id="cv-branch-a" class="stage-canvas" width="640" height="380"></canvas>
      </div>
      <div class="viewport-card">
        <div class="viewport-head mono annot-text">
          <span><strong>BRANCH_CLINAMEN_A&prime;</strong> (&#8867; Filter: Shove Forgotten)</span>
          <span id="badge-ap" style="color:var(--crimson)">Split Trace: Scuff Intact / Shove Erased</span>
        </div>
        <canvas id="cv-branch-ap" class="stage-canvas" width="640" height="380"></canvas>
      </div>
    </div>

    <div class="scrubber-bar">
      <div style="display:flex;justify-content:space-between;align-items:center;" class="mono">
        <span>Shared Cellar Clock: <strong>Tick <span id="lbl-tick">0</span> / 191</strong> (<span id="lbl-sec">0.00</span>s)</span>
        <span class="annot-text" id="lbl-phase">T1: Baseline Expectation</span>
      </div>
      <input type="range" id="rng-tick" min="0" max="191" value="0" />
      <div class="tick-markers mono annot-text">
        <span>000 Hesitation</span>
        <span>024 Coiled Hold</span>
        <span>048 Inigo Shove (&odot;)</span>
        <span>064 Collision</span>
        <span>076 Lamp Shatter / &#8867; Swerve</span>
        <span>116 Witness Action</span>
        <span>164 P1-P4 Verdict (&equiv;)</span>
      </div>
    </div>

    <div class="grid-2 annot-text">
      <div class="ledger-box">
        <h3>Coupled Institutional Rule Ledger (Policies P1&ndash;P4) &amp; Split-Trace State</h3>
        <table class="clause-table">
          <thead>
            <tr>
              <th>Policy / Trace Layer</th>
              <th>Lawful Baseline A</th>
              <th>Clinamen Branch A&prime;</th>
            </tr>
          </thead>
          <tbody id="tbody-ledger"></tbody>
        </table>
      </div>

      <div class="ledger-box">
        <h3>Five-Step Clinamen Inquiry (T1&ndash;T5) &amp; Better-Question Discovery</h3>
        <div class="mono" id="box-t1-t5" style="font-size:0.73rem; display:flex; flex-direction:column; gap:6px;"></div>
      </div>
    </div>

    <div class="ledger-box" style="margin-top:12px;">
      <h3 class="annot-text">Mute Silhouette &amp; Exposure-Timing Gate: Intention Without Labels (Ones / Twos / Holds)</h3>
      <div class="manner-strip">
        <div>
          <div class="mono annot-text" style="margin-bottom:4px;">1. HESITATION (Approach &rarr; 16f Hold &rarr; Retreat)</div>
          <canvas id="cv-manner-hes" class="stage-canvas" width="400" height="170"></canvas>
        </div>
        <div>
          <div class="mono annot-text" style="margin-bottom:4px;">2. ACCIDENTAL KNOCK (Ones Rush &rarr; Trip &rarr; Startled Recoil)</div>
          <canvas id="cv-manner-acc" class="stage-canvas" width="400" height="170"></canvas>
        </div>
        <div>
          <div class="mono annot-text" style="margin-bottom:4px;">3. DELIBERATE PUSH (14f Coiled Hold &rarr; Draw-Back &rarr; Planted Lunge)</div>
          <canvas id="cv-manner-del" class="stage-canvas" width="400" height="170"></canvas>
        </div>
      </div>
    </div>
  </section>

  <!-- ===================================================================== -->
  <!-- MODULE 1: CLINAMEN CHALK-VECTOR SANDBOX (LUCRETIUS / OULIPO / SERRES) -->
  <!-- ===================================================================== -->
  <section id="tab-chalk" class="panel">
    <div class="toolbar">
      <span class="mono"><strong>Module 1 (Lucretius / Perec / Roubaud):</strong> Drag across the ledger paper to crease a physical fold, or modulate Swerve Angle:</span>
      <label class="mono">Swerve (&deg;):
        <input type="range" id="rng-chalk-angle" min="0" max="28" step="0.5" value="0" style="width:140px;vertical-align:middle;" />
        <span id="lbl-chalk-angle">0.0&deg; (Lawful Laminar Fall)</span>
      </label>
      <button id="btn-chalk-reset">Restore Clean Ledger (Checkpoint Laminar A)</button>
    </div>
    <canvas id="cv-chalk" class="stage-canvas" width="1280" height="500" style="border:2px solid var(--ink);"></canvas>
    <div class="ledger-box mono" style="margin-top:10px;" id="chalk-telemetry"></div>
  </section>

  <!-- ===================================================================== -->
  <!-- MODULE 2: THICK-DESCRIPTION OVER-THE-SHOULDER ANALYZER (GEERTZ/GRAHAM)-->
  <!-- ===================================================================== -->
  <section id="tab-thick" class="panel">
    <div class="toolbar">
      <label class="mono">Behavioral Trace:
        <select id="sel-thick-case">
          <option value="wink">Case 1: Rapid Eyelid Contraction (Ryle / Geertz: Twitch vs. Conspiratorial Wink)</option>
          <option value="suq">Case 2: Brass Coin Handoff in Sefrou Suq (Moroccan Nisba Kinship Surety)</option>
          <option value="latch">Case 3: Repeated Iron Latch Click (Thin Rage-Click vs. Jammed Cellar Floodgate)</option>
        </select>
      </label>
      <button id="btn-thick-swerve" class="crimson">[Inject Unscalable Swerve: Read Over-the-Shoulder Manuscript]</button>
      <button id="btn-thick-reset">Reset to Thin Telemetry (1.2 Hz, 40ms Click)</button>
    </div>
    <canvas id="cv-thick" class="stage-canvas" width="1280" height="360" style="border:2px solid var(--ink);"></canvas>
    <div id="thick-manuscript" class="manuscript-overlay mono"></div>
  </section>

  <!-- ===================================================================== -->
  <!-- MODULE 3: OPERATIVE EKPHRASIS SKETCH-TO-WORLD CANVAS (BAJOHR)         -->
  <!-- ===================================================================== -->
  <section id="tab-ekphrasis" class="panel">
    <div class="toolbar">
      <span class="mono"><strong>Sketch-to-World Compiler:</strong> Draw raw strokes directly on canvas (speed &rarr; tape hiss; sharp vertices &rarr; sub-bass thud + compiled world rule):</span>
      <button class="ek-role active" data-role="wall">&#9793; Load-Bearing Wall</button>
      <button class="ek-role" data-role="reflector">&#9790; Mirror / Witness Reflector</button>
      <button class="ek-role" data-role="control">&#8984; Institutional Rule Gate</button>
      <button id="btn-ek-clear">Clear Compiled Strokes</button>
    </div>
    <canvas id="cv-ekphrasis" class="stage-canvas" width="1280" height="480" style="border:2px solid var(--ink);cursor:crosshair;"></canvas>
    <div class="ledger-box mono" style="margin-top:10px;" id="ek-compiled-ledger">
      Compiled Worldtext Rules: 0 strokes (draw a jagged or curved line on the canvas above to compile geometry + live acoustics).
    </div>
  </section>
</main>

<script>
const WORLDTEXT = __FLOUR_JSON_PAYLOAD__;

// ============================================================================
// WEBAUDIO PARAMETER-COUPLED SYNTHESIS ENGINE (<= 1 frame / 0ms schedule lock)
// ============================================================================
let audioCtx = null;
let soundEnabled = false;
let muteSilhouetteGate = false;
let refOscA = null, refGainA = null, panA = null;
let refOscAP = null, refGainAP = null, panAP = null;

function pointToSegmentDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-6) return Math.hypot(px - x1, py - y1);
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / len2));
  return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
}

function ensureAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AC();
    panA = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : audioCtx.createGain();
    panAP = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : audioCtx.createGain();
    if (panA.pan) panA.pan.value = -0.68;
    if (panAP.pan) panAP.pan.value = 0.68;
    panA.connect(audioCtx.destination);
    panAP.connect(audioCtx.destination);

    // 440 Hz deterministic baseline reference sine hum (panned LEFT to Viewport A)
    refOscA = audioCtx.createOscillator();
    refGainA = audioCtx.createGain();
    refOscA.type = "sine";
    refOscA.frequency.value = 440.0;
    refGainA.gain.value = 0.0;
    refOscA.connect(refGainA).connect(panA);
    refOscA.start();

    // Clinamen secondary drone (panned RIGHT to Viewport A')
    refOscAP = audioCtx.createOscillator();
    refGainAP = audioCtx.createGain();
    refOscAP.type = "triangle";
    refOscAP.frequency.value = 220.0;
    refGainAP.gain.value = 0.0;
    refOscAP.connect(refGainAP).connect(panAP);
    refOscAP.start();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function playClockTick(gainVal = 0.06, pitch = 1650) {
  if (!soundEnabled || muteSilhouetteGate || !audioCtx) return;
  const t0 = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(pitch, t0);
  osc.frequency.exponentialRampToValueAtTime(420, t0 + 0.022);
  g.gain.setValueAtTime(gainVal, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.025);
  osc.connect(g).connect(panA || audioCtx.destination);
  osc.start(t0);
  osc.stop(t0 + 0.03);
}

function playTransient(tr, panValue = 0.0) {
  if (!soundEnabled || muteSilhouetteGate || !audioCtx) return;
  const t0 = audioCtx.currentTime;
  const dest = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : audioCtx.destination;
  if (dest.pan) {
    dest.pan.setValueAtTime(panValue, t0);
    dest.connect(audioCtx.destination);
  }
  const outNode = dest.pan ? dest : audioCtx.destination;
  if (tr.kind === "sack_shove_thud" || tr.kind === "pedestal_knock") {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(tr.freq_hz * 1.4, t0);
    osc.frequency.exponentialRampToValueAtTime(34, t0 + 0.18);
    g.gain.setValueAtTime(tr.gain * 0.42, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.20);
    osc.connect(g).connect(outNode);
    osc.start(t0);
    osc.stop(t0 + 0.22);
  } else if (tr.kind === "ceramic_fracture_ping") {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(tr.freq_hz, t0);
    osc.frequency.exponentialRampToValueAtTime(tr.freq_hz * 0.96, t0 + 0.28);
    g.gain.setValueAtTime(tr.gain * 0.14, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.30);
    osc.connect(g).connect(outNode);
    osc.start(t0);
    osc.stop(t0 + 0.32);
  } else if (tr.kind === "clinamen_filter_snap") {
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(520, t0);
    osc.frequency.exponentialRampToValueAtTime(118, t0 + 0.14);
    g.gain.setValueAtTime(0.22, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
    osc.connect(g).connect(outNode);
    osc.start(t0);
    osc.stop(t0 + 0.17);
  } else if (tr.kind === "oil_whoosh_bloom" || tr.kind === "burlap_flour_rustle") {
    const dur = tr.kind === "oil_whoosh_bloom" ? 0.42 : 0.18;
    const bufSize = Math.floor(audioCtx.sampleRate * dur);
    const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      const env = Math.sin((Math.PI * i) / bufSize);
      data[i] = (Math.random() * 2 - 1) * env;
    }
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const flt = audioCtx.createBiquadFilter();
    flt.type = "bandpass";
    flt.frequency.value = tr.center_hz || 620;
    flt.Q.value = tr.kind === "oil_whoosh_bloom" ? 1.2 : 3.4;
    const g = audioCtx.createGain();
    g.gain.value = tr.gain * 0.28;
    src.connect(flt).connect(g).connect(outNode);
    src.start(t0);
  }
}

// ============================================================================
// HAND-DRAWN ROUGH CONSTRUCTION & MULTIPLANE RENDERING PRIMITIVES
// ============================================================================
function hashNoise(seed, idx) {
  const x = Math.sin(seed * 127.1 + idx * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function roughLine(ctx, x1, y1, x2, y2, seed, wobble = 1.1, color = "#1d1915", width = 1.5, dash = null) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  if (dash) ctx.setLineDash(dash);
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const steps = Math.max(2, Math.min(18, Math.floor(dist / 16)));
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const jx = (i === 0 || i === steps) ? 0 : (hashNoise(seed, i * 19 + Math.floor(x1)) - 0.5) * 2 * wobble;
    const jy = (i === 0 || i === steps) ? 0 : (hashNoise(seed + 5, i * 37 + Math.floor(y1)) - 0.5) * 2 * wobble;
    const px = x1 + (x2 - x1) * u + jx;
    const py = y1 + (y2 - y1) * u + jy;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

function drawFlourSack(ctx, actor, roleTag, fillTint, seed, zoomMode, sx, sy) {
  const pts = actor.pts.map(p => [p[0] * sx, p[1] * sy]);
  ctx.save();
  // Burlap paper wash fill
  ctx.beginPath();
  pts.forEach((p, idx) => {
    const jx = (hashNoise(seed, idx * 13) - 0.5) * 1.5;
    const jy = (hashNoise(seed + 3, idx * 29) - 0.5) * 1.5;
    if (idx === 0) ctx.moveTo(p[0] + jx, p[1] + jy);
    else ctx.lineTo(p[0] + jx, p[1] + jy);
  });
  ctx.closePath();
  ctx.fillStyle = fillTint;
  ctx.fill();

  // Clipped bottom-half flour weight cross-hatching (zero facial marks!)
  ctx.save();
  ctx.clip();
  const cx = actor.cx * sx;
  const fy = actor.foot_y * sy;
  ctx.strokeStyle = "rgba(29,25,21,0.28)";
  ctx.lineWidth = 0.9;
  for (let h = -45; h <= 45; h += 5) {
    ctx.beginPath();
    ctx.moveTo(cx - 55, fy - 28 + h * 0.55);
    ctx.lineTo(cx + 55, fy - 4 + h * 0.55);
    ctx.stroke();
  }
  ctx.restore();

  // Hand-inked boiling contour (double pass for rough construction life)
  for (let pass = 0; pass < 2; pass++) {
    ctx.beginPath();
    pts.forEach((p, idx) => {
      const jx = (hashNoise(seed + pass * 11, idx * 17) - 0.5) * (pass === 0 ? 1.4 : 2.3);
      const jy = (hashNoise(seed + pass * 19, idx * 23) - 0.5) * (pass === 0 ? 1.4 : 2.3);
      if (idx === 0) ctx.moveTo(p[0] + jx, p[1] + jy);
      else ctx.lineTo(p[0] + jx, p[1] + jy);
    });
    ctx.closePath();
    ctx.strokeStyle = pass === 0 ? "#1d1915" : "rgba(158,71,42,0.42)";
    ctx.lineWidth = pass === 0 ? 2.0 : 0.9;
    ctx.stroke();
  }

  // Waist flour-settle crease line (structural volume cue, NOT a face)
  const sp = actor.spine.map(p => [p[0] * sx, p[1] * sy]);
  if (sp.length >= 3) {
    roughLine(ctx, sp[1][0] - 14, sp[1][1], sp[1][0] + 14, sp[1][1] + 3, seed, 0.8, "rgba(29,25,21,0.55)", 1.1);
  }

  // 4x Semantic Zoom: Sanguine Spine, Plumb Line, Exposure Mode & Exact Area Lock
  if (zoomMode >= 4) {
    ctx.strokeStyle = "#9e472a";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    sp.forEach((p, idx) => { if (idx === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); });
    ctx.stroke();
    sp.forEach(p => {
      ctx.fillStyle = "#a8291e";
      ctx.fillRect(p[0] - 2.5, p[1] - 2.5, 5, 5);
    });
    if (!muteSilhouetteGate) {
      ctx.font = "bold 10px Menlo, monospace";
      ctx.fillStyle = "#284b63";
      ctx.fillText(`${roleTag} [${actor.exposure || '2s'}] A=${actor.area.toFixed(0)}px²`, cx - 48, sp[4][1] - 12);
    }
  } else if (!muteSilhouetteGate) {
    ctx.font = "bold 10px Menlo, monospace";
    ctx.fillStyle = "#1d1915";
    ctx.fillText(roleTag, cx - 22, sp[4][1] - 10);
  }
  ctx.restore();
}

function renderCellarViewport(canvas, branchKey, tick, zoomMode) {
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const sx = W / 1120.0, sy = H / 620.0;
  const branch = WORLDTEXT.branches[branchKey];
  const wf = branch.world_trace[tick];
  const memF = branch.actor_memory.flower[tick];
  const seed = branch.sensory_bus[tick].roughness_seed;

  ctx.clearRect(0, 0, W, H);

  if (zoomMode === 16) {
    // 16x SEMANTIC ZOOM: Coupled Event-Clause & Afterlight Worldtext DAG
    ctx.fillStyle = "#f7f0df";
    ctx.fillRect(0, 0, W, H);
    const nodes = [
      { id: "E1_COILED_INTENT", x: 75, y: 72, sym: "☉ Source: Coiled Hold (t=24)" },
      { id: "E2_DELIBERATE_SHOVE", x: 75, y: 142, sym: "☉ Source: Inigo Shove (t=48)" },
      { id: "E3_BELINDO_COLLISION", x: 75, y: 212, sym: "◉ Body: Belindo Thrown (t=64)" },
      { id: "E4_LAMP_SHATTER", x: 75, y: 282, sym: "▧ Medium: Lamp Shatter (t=76)" },
      { id: "E5_OIL_IGNITION", x: 75, y: 340, sym: "♁ World: Oil Spill & Fire (t=80)" },
    ];
    ctx.font = "bold 11px Menlo, monospace";
    ctx.fillStyle = "#1d1915";
    if (!muteSilhouetteGate) {
      ctx.fillText(`16x COUPLED DAG · ${branch.branch_id} @ tick ${tick}`, 16, 24);
      ctx.fillText("♁ WORLD TRACE", 48, 46);
      ctx.fillText("◉ FLOWER MEMORY", 252, 46);
      ctx.fillText("⌘ POLICIES P1-P4", 458, 46);
    }

    nodes.forEach((nd, i) => {
      const inWorld = wf.events.includes(nd.id);
      const inMem = memF.events.includes(nd.id);
      const erased = (memF.erased_by_filter || []).includes(nd.id);

      // World node
      ctx.fillStyle = inWorld ? "#d5e8d4" : "#ece4d0";
      ctx.strokeStyle = "#1d1915";
      ctx.lineWidth = 1.5;
      ctx.fillRect(22, nd.y - 16, 178, 28);
      ctx.strokeRect(22, nd.y - 16, 178, 28);

      // Witness memory node
      ctx.fillStyle = erased ? "#f8cecc" : (inMem ? "#dae8fc" : "#ece4d0");
      ctx.strokeStyle = erased ? "#a8291e" : "#1d1915";
      ctx.fillRect(235, nd.y - 16, 178, 28);
      ctx.strokeRect(235, nd.y - 16, 178, 28);

      // Edge World -> Memory
      roughLine(ctx, 200, nd.y - 2, 235, nd.y - 2, seed + i, 0.6, erased ? "#a8291e" : "#1d1915", 1.5, erased ? [4, 3] : null);
      if (erased) {
        ctx.fillStyle = "#a8291e";
        ctx.fillText("⊣", 212, nd.y + 3);
      }

      if (!muteSilhouetteGate) {
        ctx.font = "10px Menlo, monospace";
        ctx.fillStyle = "#1d1915";
        ctx.fillText(nd.sym.slice(0, 25), 27, nd.y + 2);
        ctx.fillStyle = erased ? "#a8291e" : "#1d1915";
        ctx.fillText(erased ? "ERASED BY ⊣ FILTER" : (inMem ? "RETAINED IN ◉" : "pending"), 242, nd.y + 2);
      }
    });

    // Policy boxes on right
    const pols = computeLivePolicies(branchKey);
    const pKeys = Object.keys(pols);
    pKeys.forEach((pk, idx) => {
      const py = 78 + idx * 74;
      const pObj = pols[pk];
      const isFlip = pk === "P4_SUBROGATION_LIABILITY" && pObj.assigned_debtor.includes("BELINDO");
      ctx.fillStyle = isFlip ? "#f8cecc" : "#fdf9ef";
      ctx.strokeStyle = isFlip ? "#a8291e" : "#1d1915";
      ctx.fillRect(442, py - 18, 182, 54);
      ctx.strokeRect(442, py - 18, 182, 54);
      roughLine(ctx, 413, 142 + idx * 45, 442, py + 6, seed + idx, 0.7, "#4a4035", 1.2);
      if (!muteSilhouetteGate) {
        ctx.font = "bold 9.5px Menlo, monospace";
        ctx.fillStyle = "#1d1915";
        ctx.fillText(pk.replace("_", " "), 447, py - 3);
        ctx.font = "9px Menlo, monospace";
        ctx.fillStyle = isFlip ? "#a8291e" : "#265940";
        ctx.fillText(pObj.status.slice(0, 26), 447, py + 14);
      }
    });
    return;
  }

  // PLANE 6 & 5: Cellar masonry stone vault + Off-screen street grate ("Other Worlds Being There")
  ctx.fillStyle = "#e8dec8";
  ctx.fillRect(0, 0, W, H);

  // High cellar street-level iron grate with autonomous passerby shadow
  const gx = 90 * sx, gy = 34 * sy, gw = 190 * sx, gh = 48 * sy;
  ctx.fillStyle = "#fbf4e2";
  ctx.fillRect(gx, gy, gw, gh);
  const passX = wf.offscreen_continuity.alley_grate_passerby_x * sx * 0.25;
  if (passX > gx - 30 && passX < gx + gw + 30) {
    ctx.fillStyle = "rgba(45,40,34,0.32)";
    ctx.beginPath();
    ctx.ellipse(gx + ((passX + 200) % gw), gy + gh * 0.65, 16, 22, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let b = 0; b <= 6; b++) {
    const bx = gx + (gw * b) / 6;
    roughLine(ctx, bx, gy, bx, gy + gh, seed, 0.5, "#4a4035", 1.4);
  }
  ctx.strokeRect(gx, gy, gw, gh);

  // Autonomous cistern pipe condensation drip on far left cellar wall
  const dripP = wf.offscreen_continuity.cistern_pipe_drip_phase;
  roughLine(ctx, 36 * sx, 20 * sy, 36 * sx, 290 * sy, seed, 0.6, "#5c5144", 3.0);
  ctx.fillStyle = "#284b63";
  ctx.beginPath();
  ctx.arc(42 * sx, (120 + dripP * 390) * sy, 2.6, 0, Math.PI * 2);
  ctx.fill();

  // Vaulted stone arch, timber beams, background shelf casks & cellar floor horizon
  ctx.strokeStyle = "rgba(74,64,53,0.22)";
  ctx.lineWidth = 1.0;
  for (let row = 1; row <= 5; row++) {
    const ry = (95 + row * 72) * sy;
    roughLine(ctx, 45 * sx, ry, (1120 - 45) * sx, ry, seed + row, 0.7, "rgba(74,64,53,0.18)", 1.0);
  }
  // Background cellar storage shelf + wine/oil demijohns (Plane 4)
  roughLine(ctx, 790 * sx, 250 * sy, 1045 * sx, 250 * sy, seed, 0.8, "rgba(74,64,53,0.48)", 2.2);
  roughLine(ctx, 815 * sx, 250 * sy, 815 * sx, 544 * sy, seed, 0.6, "rgba(74,64,53,0.35)", 1.6);
  roughLine(ctx, 1025 * sx, 250 * sy, 1025 * sx, 544 * sy, seed, 0.6, "rgba(74,64,53,0.35)", 1.6);
  [850, 905, 965].forEach((jx, ji) => {
    ctx.strokeStyle = "rgba(74,64,53,0.42)";
    ctx.beginPath();
    ctx.ellipse(jx * sx, 228 * sy, 16 * sx, 22 * sy, 0, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.strokeStyle = "rgba(74,64,53,0.48)";
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(W * 0.52, H * 0.58, W * 0.48, Math.PI, 0);
  ctx.stroke();
  const floorY = 544 * sy;
  roughLine(ctx, 0, floorY, W, floorY, seed, 1.0, "#1d1915", 2.4);

  // Ground contact shadows under each sack (weight anchor)
  [wf.actors.inigo, wf.actors.belindo, wf.actors.flower].forEach(act => {
    ctx.fillStyle = "rgba(29,25,21,0.22)";
    ctx.beginPath();
    ctx.ellipse(act.cx * sx, floorY + 2, (42 / act.stretch) * sx, 5 * sy, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // PLANE 3: Persistent Physical Residue in ♁ World (Floor Scuff, Oil Spill, Pedestal, Lamp, Shards)
  const pr = wf.props_and_residue;
  if (pr.floor_scuff.persists && pr.floor_scuff.len > 0) {
    const sx0 = pr.floor_scuff.x0 * sx;
    const slen = pr.floor_scuff.len * sx;
    roughLine(ctx, sx0, floorY + 5, sx0 + slen, floorY + 3, seed, 1.4, "#9e472a", 3.2);
    if (zoomMode >= 4 && !muteSilhouetteGate) {
      ctx.font = "9.5px Menlo, monospace";
      ctx.fillStyle = "#9e472a";
      ctx.fillText(`♁ SCUFF RESIDUE (${pr.floor_scuff.len.toFixed(0)}px INTACT)`, sx0, floorY + 18);
    }
  }

  // Spreading capillary oil pool + thermal ember glow
  if (pr.oil_spill_radius > 0) {
    const ox = 682 * sx, oy = floorY + 4;
    const rx = pr.oil_spill_radius * sx, ry = pr.oil_spill_radius * sy * 0.22;
    ctx.fillStyle = "rgba(32, 26, 20, 0.72)";
    ctx.beginPath();
    ctx.ellipse(ox, oy, rx, Math.max(4, ry), 0, 0, Math.PI * 2);
    ctx.fill();

    if (pr.thermal_ember_intensity > 0.02) {
      const grad = ctx.createRadialGradient(ox, oy - 12, 3, ox, oy - 12, rx * 1.15);
      grad.addColorStop(0, `rgba(214, 72, 32, ${0.68 * pr.thermal_ember_intensity})`);
      grad.addColorStop(0.6, `rgba(218, 142, 40, ${0.32 * pr.thermal_ember_intensity})`);
      grad.addColorStop(1, "rgba(218, 142, 40, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ox, oy - 12, rx * 1.15, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Timber lamp pedestal + brass/ceramic oil lamp or scattered shards
  const pedX = 682 * sx;
  roughLine(ctx, pedX - 18, 474 * sy, pedX + 18, 474 * sy, seed, 0.8, "#1d1915", 2.2);
  roughLine(ctx, pedX - 12, 474 * sy, pedX - 16, floorY, seed, 0.8, "#1d1915", 1.8);
  roughLine(ctx, pedX + 12, 474 * sy, pedX + 16, floorY, seed, 0.8, "#1d1915", 1.8);

  if (pr.lamp.intact) {
    ctx.save();
    ctx.translate(pr.lamp.x * sx, pr.lamp.y * sy);
    ctx.rotate(pr.lamp.tilt_rad);
    ctx.fillStyle = "#c9963b";
    ctx.strokeStyle = "#1d1915";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, -6, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Flame
    ctx.fillStyle = "#d94e28";
    ctx.beginPath();
    ctx.moveTo(0, -24 - (tick % 3) * 1.5);
    ctx.quadraticCurveTo(6, -14, 0, -12);
    ctx.quadraticCurveTo(-6, -14, 0, -24 - (tick % 3) * 1.5);
    ctx.fill();
    ctx.restore();
  } else {
    pr.ceramic_shards.forEach((sh, idx) => {
      ctx.save();
      ctx.translate(sh.x * sx, sh.y * sy);
      ctx.rotate(sh.ang);
      ctx.fillStyle = "#d8d0c0";
      ctx.strokeStyle = "#1d1915";
      ctx.beginPath();
      ctx.moveTo(-6, -3); ctx.lineTo(7, -1); ctx.lineTo(2, 5); ctx.closePath();
      ctx.fill(); ctx.stroke();
      ctx.restore();
    });
  }

  // 4x Semantic Zoom: Shove impulse vector arrow & memory-link arc
  if (zoomMode >= 4 && pr.shove_impulse_vector) {
    const v = pr.shove_impulse_vector;
    const vx0 = v.x0 * sx, vy0 = v.y0 * sy;
    const vx1 = (v.x0 + v.dx) * sx, vy1 = (v.y0 + v.dy) * sy;
    roughLine(ctx, vx0, vy0, vx1, vy1, seed, 0.5, "#a8291e", 2.4);
    if (!muteSilhouetteGate) {
      ctx.font = "bold 10px Menlo, monospace";
      ctx.fillStyle = "#a8291e";
      ctx.fillText(`☉ SHOVE IMPULSE ${v.newton_s} N·s (♁ WORLD)`, vx0, vy0 - 8);
    }
  }

  // PLANE 2: Constant-Volume Faceless Half-Filled Flour Sacks (Inigo, Belindo, Flower)
  drawFlourSack(ctx, wf.actors.inigo, "INIGO", "#dfd2b7", seed, zoomMode, sx, sy);
  drawFlourSack(ctx, wf.actors.belindo, "BELINDO", "#ebe2ce", seed + 7, zoomMode, sx, sy);
  drawFlourSack(ctx, wf.actors.flower, "FLOWER", "#f5efe0", seed + 13, zoomMode, sx, sy);

  // Witness Sightline / Selective Erasure Indicator in 4x Zoom
  if (zoomMode >= 4 && tick >= 48) {
    const fx = wf.actors.flower.cx * sx, fy = (wf.actors.flower.foot_y - 68) * sy;
    const ix = wf.actors.inigo.cx * sx, iy = (wf.actors.inigo.foot_y - 62) * sy;
    const erased = (memF.erased_by_filter || []).includes("E2_DELIBERATE_SHOVE");
    roughLine(ctx, fx, fy, ix, iy, seed, 0.7, erased ? "#a8291e" : "#265940", 1.5, erased ? [6, 5] : null);
    if (!muteSilhouetteGate) {
      ctx.font = "bold 10px Menlo, monospace";
      ctx.fillStyle = erased ? "#a8291e" : "#265940";
      ctx.fillText(erased ? "⊣ FILTER: SHOVE ERASED IN ◉ FLOWER" : "◉ COMPLETE CAUSAL MEMORY", (fx + ix) * 0.5 - 70, (fy + iy) * 0.5 - 12);
    }
  }

  // Exposure-sheet tick strip along bottom edge (visible structural craft cue even when muted!)
  ctx.fillStyle = "rgba(29,25,21,0.12)";
  ctx.fillRect(0, H - 14, W, 14);
  for (let k = 0; k < 48; k++) {
    const tx = (k / 48) * W;
    const cur = Math.floor((tick / 192) * 48) === k;
    ctx.fillStyle = cur ? "#a8291e" : "rgba(29,25,21,0.45)";
    ctx.fillRect(tx, H - (k % 4 === 0 ? 12 : 7), cur ? 4 : 1.5, k % 4 === 0 ? 12 : 7);
  }
}

// ============================================================================
// LIVE POLICY EVALUATION & LEDGER SYNCHRONIZATION
// ============================================================================
let nisbaAuditOverride = false;

function computeLivePolicies(branchKey) {
  const br = WORLDTEXT.branches[branchKey];
  const wEv = br.world_trace[currentTick].events;
  const fEv = br.actor_memory.flower[currentTick].events;
  const witnessShove = fEv.includes("E2_DELIBERATE_SHOVE");
  const witnessLamp = fEv.includes("E4_LAMP_SHATTER");
  const worldShove = wEv.includes("E2_DELIBERATE_SHOVE");

  let authShove = witnessShove;
  let p3Status = "SWORN_WITNESS_SUPERSEDES_RESIDUE";
  if (nisbaAuditOverride && worldShove !== witnessShove) {
    authShove = worldShove;
    p3Status = "FORENSIC_SCUFF_AUDIT_RESTORED_SHOVE";
  }
  const p1Trig = authShove;
  const p2Pay = (!p1Trig) && witnessLamp;
  const p4Debtor = authShove ? "INIGO_ASSAULT_SURCHARGE" : (witnessLamp ? "BELINDO_NEGLIGENT_LAMP_CONTACT" : "PENDING_EVENT");

  return {
    P1_ARSON_EXCLUSION: { status: !witnessLamp && !worldShove ? "ARMED_WAITING" : (p1Trig ? "EXCLUSION_ACTIVE (SHOVE)" : "WAIVED_NO_WITNESSED_SHOVE") },
    P2_LAMP_FALL_INDEMNITY: { status: !witnessLamp ? "NO_CLAIM_YET" : (p2Pay ? "PAID_480_FLORINS_SOLO_ACCIDENT" : "DENIED_BY_P1_ARSON") },
    P3_WITNESS_PRECEDENCE: { status: p3Status },
    P4_SUBROGATION_LIABILITY: { assigned_debtor: p4Debtor, status: `ENFORCED:${p4Debtor}` },
  };
}

function updateLedgerDOM(tick) {
  const wfA = WORLDTEXT.branches.A.world_trace[tick];
  const wfAP = WORLDTEXT.branches.A_PRIME.world_trace[tick];
  const mA = WORLDTEXT.branches.A.actor_memory.flower[tick];
  const mAP = WORLDTEXT.branches.A_PRIME.actor_memory.flower[tick];
  const pA = computeLivePolicies("A");
  const pAP = computeLivePolicies("A_PRIME");

  const rows = [
    ["♁ World Physical Residue", `Scuff=${wfA.props_and_residue.floor_scuff.len.toFixed(0)}px, Oil=${wfA.props_and_residue.oil_spill_radius.toFixed(0)}px`, `Scuff=${wfAP.props_and_residue.floor_scuff.len.toFixed(0)}px, Oil=${wfAP.props_and_residue.oil_spill_radius.toFixed(0)}px (IDENTICAL)`, false],
    ["◉ Flower Memory Trace", mA.events.join(", ") || "—", (mAP.events.join(", ") || "—") + (mAP.erased_by_filter.length ? ` [⊣ ERASED: ${mAP.erased_by_filter.join(",")}]` : ""), mAP.erased_by_filter.length > 0],
    ["◉ Flower Performed Pose", wfA.actors.flower.performed_action, wfAP.actors.flower.performed_action, wfA.actors.flower.performed_action !== wfAP.actors.flower.performed_action],
    ["⌘ P1 Arson Exclusion", pA.P1_ARSON_EXCLUSION.status, pAP.P1_ARSON_EXCLUSION.status, pA.P1_ARSON_EXCLUSION.status !== pAP.P1_ARSON_EXCLUSION.status],
    ["⌘ P2 Lamp Indemnity", pA.P2_LAMP_FALL_INDEMNITY.status, pAP.P2_LAMP_FALL_INDEMNITY.status, pA.P2_LAMP_FALL_INDEMNITY.status !== pAP.P2_LAMP_FALL_INDEMNITY.status],
    ["⌘ P3 Witness Rule", pA.P3_WITNESS_PRECEDENCE.status, pAP.P3_WITNESS_PRECEDENCE.status, pA.P3_WITNESS_PRECEDENCE.status !== pAP.P3_WITNESS_PRECEDENCE.status],
    ["⌘ P4 Liability Verdict", pA.P4_SUBROGATION_LIABILITY.status, pAP.P4_SUBROGATION_LIABILITY.status, pA.P4_SUBROGATION_LIABILITY.status !== pAP.P4_SUBROGATION_LIABILITY.status],
  ];

  const tb = document.getElementById("tbody-ledger");
  tb.innerHTML = rows.map(r => `
    <tr>
      <td><strong>${r[0]}</strong></td>
      <td>${r[1]}</td>
      <td class="${r[3] ? 'diff-flip' : ''}">${r[2]}</td>
    </tr>
  `).join("");
}

function renderMannerStrips(tick) {
  const mTick = tick % 72;
  const pairs = [
    ["cv-manner-hes", "hesitation", "#ebe2ce"],
    ["cv-manner-acc", "accidental_knock", "#e4d5b7"],
    ["cv-manner-del", "deliberate_push", "#dfd2b7"],
  ];
  pairs.forEach(([cid, key, tint]) => {
    const cv = document.getElementById(cid);
    const ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#f4ecdc";
    ctx.fillRect(0, 0, cv.width, cv.height);
    const item = WORLDTEXT.manner_silhouettes[key][mTick];
    const prev = WORLDTEXT.manner_silhouettes[key][Math.max(0, mTick - 6)];
    roughLine(ctx, 10, 150, 390, 150, mTick, 0.7, "#1d1915", 1.5);
    // Onion-skin ghost
    ctx.save();
    ctx.globalAlpha = 0.22;
    drawFlourSack(ctx, prev.sack, "", "#9e472a", mTick, 1, 0.62, 0.35);
    ctx.restore();
    drawFlourSack(ctx, item.sack, muteSilhouetteGate ? "" : item.exposure_mode.toUpperCase(), tint, mTick, 1, 0.62, 0.35);
  });
}

// ============================================================================
// MAIN TRANSPORT LOOP & DIRECT-MANIPULATION CONTROLS
// ============================================================================
let currentTick = 0;
let playing = true;
let zoomMode = 1;
let lastFrameTime = performance.now();

document.getElementById("hdr-ckpt").textContent = WORLDTEXT.checkpoint_lawful_a_id;
document.getElementById("hdr-vol").textContent = `${WORLDTEXT.branches.A.invariants.max_volume_area_error_pct}%`;

const tBox = document.getElementById("box-t1-t5");
const inq = WORLDTEXT.branches.A_PRIME.t1_to_t5_inquiry;
tBox.innerHTML = Object.entries(inq).map(([k, v]) => `<div><strong>${k.replace(/_/g, ' ')}:</strong> ${v}</div>`).join("") +
  `<div style="margin-top:4px;padding:6px;border-left:3px solid var(--crimson);background:#f8ead8;">
    <strong>Discovered Better Question:</strong> How does an honest witness's selective memory gap harden under P3 into an enforceable institutional truth that overrides intact physical world residue?
  </div>`;

function syncTick(tick, triggerAudio = false) {
  currentTick = ((tick % 192) + 192) % 192;
  document.getElementById("rng-tick").value = currentTick;
  document.getElementById("lbl-tick").textContent = String(currentTick).padStart(3, "0");
  document.getElementById("lbl-sec").textContent = (currentTick / 24.0).toFixed(2);

  let phase = "T1: Baseline Cellar Expectation (CHECKPOINT_LAWFUL_A)";
  if (currentTick >= 24 && currentTick < 48) phase = "T1 -> Anticipation: Inigo 14-Frame Coiled Hold";
  else if (currentTick >= 48 && currentTick < 76) phase = "☉ Source Act: Deliberate Shove & Floor Scuff Inscribed in ♁ World";
  else if (currentTick >= 76 && currentTick < 116) phase = "T2/T3 Clinamen Encounter: Lamp Shatter + ⊣ Filter Swerve in ◉ Flower";
  else if (currentTick >= 116) phase = "T4/T5 Split-Trace Consequence: Divergent Witness Pose & P1-P4 Flip";
  document.getElementById("lbl-phase").textContent = phase;

  renderCellarViewport(document.getElementById("cv-branch-a"), "A", currentTick, zoomMode);
  renderCellarViewport(document.getElementById("cv-branch-ap"), "A_PRIME", currentTick, zoomMode);
  renderMannerStrips(currentTick);
  updateLedgerDOM(currentTick);

  if (soundEnabled && audioCtx && !muteSilhouetteGate) {
    const sbA = WORLDTEXT.branches.A.sensory_bus[currentTick];
    const sbAP = WORLDTEXT.branches.A_PRIME.sensory_bus[currentTick];
    refGainA.gain.setTargetAtTime(playing ? sbA.reference_sine_gain * 0.18 : 0.0, audioCtx.currentTime, 0.02);
    refGainAP.gain.setTargetAtTime(playing && currentTick >= 76 ? 0.035 : 0.0, audioCtx.currentTime, 0.02);
    if (triggerAudio) {
      if (sbA.clock_tick_gate) playClockTick(0.05, 1720);
      sbA.transients.forEach(tr => playTransient(tr, -0.68));
      sbAP.transients.forEach(tr => playTransient(tr, 0.68));
    }
  } else if (audioCtx && refGainA) {
    refGainA.gain.setTargetAtTime(0.0, audioCtx.currentTime, 0.01);
    refGainAP.gain.setTargetAtTime(0.0, audioCtx.currentTime, 0.01);
  }
}

document.getElementById("btn-play").addEventListener("click", (e) => {
  playing = !playing;
  e.target.classList.toggle("active", playing);
  syncTick(currentTick, false);
});
document.getElementById("btn-prev").addEventListener("click", () => { playing = false; syncTick(currentTick - 1, true); });
document.getElementById("btn-next").addEventListener("click", () => { playing = false; syncTick(currentTick + 1, true); });
document.getElementById("rng-tick").addEventListener("input", (e) => {
  playing = false;
  document.getElementById("btn-play").classList.remove("active");
  syncTick(parseInt(e.target.value, 10), true);
});
document.getElementById("sel-zoom").addEventListener("change", (e) => {
  zoomMode = parseInt(e.target.value, 10);
  syncTick(currentTick, false);
});
document.getElementById("btn-sound").addEventListener("click", (e) => {
  ensureAudio();
  soundEnabled = !soundEnabled;
  e.target.classList.toggle("active", soundEnabled);
  e.target.textContent = soundEnabled ? "♫ Coupled WebAudio LIVE" : "♫ Enable Coupled WebAudio (440Hz → Foley)";
  syncTick(currentTick, true);
});
document.getElementById("btn-mute-labels").addEventListener("click", (e) => {
  muteSilhouetteGate = !muteSilhouetteGate;
  e.target.classList.toggle("active", muteSilhouetteGate);
  document.getElementById("app-root").classList.toggle("hide-labels", muteSilhouetteGate);
  syncTick(currentTick, false);
});
document.getElementById("btn-nisba-audit").addEventListener("click", (e) => {
  nisbaAuditOverride = !nisbaAuditOverride;
  e.target.classList.toggle("active", nisbaAuditOverride);
  syncTick(currentTick, true);
});

// ============================================================================
// MODULE 1: CLINAMEN CHALK-VECTOR SANDBOX (LUCRETIUS / OULIPO / SERRES)
// ============================================================================
const chalkCv = document.getElementById("cv-chalk");
const chalkCtx = chalkCv.getContext("2d");
const smudgeCanvas = document.createElement("canvas");
smudgeCanvas.width = 1280; smudgeCanvas.height = 500;
const smudgeCtx = smudgeCanvas.getContext("2d");

let swerveDeg = 0.0;
let creaseLine = { x1: 380, y1: 235, x2: 900, y2: 265, active: false };
let chalkGrains = [];
let chalkCollisions = 0;

function resetChalk() {
  smudgeCtx.clearRect(0, 0, 1280, 500);
  chalkGrains = [];
  for (let i = 0; i < 46; i++) {
    chalkGrains.push({
      x: 70 + i * 25,
      y: (i * 37) % 480,
      vx: 0,
      vy: 2.8,
      swerved: false,
      spiral: 0,
    });
  }
  chalkCollisions = 0;
}
resetChalk();

document.getElementById("rng-chalk-angle").addEventListener("input", (e) => {
  swerveDeg = parseFloat(e.target.value);
  document.getElementById("lbl-chalk-angle").textContent = swerveDeg === 0
    ? "0.0° (Lawful Laminar Fall)"
    : `${swerveDeg.toFixed(1)}° (Clinamen Active)`;
});
document.getElementById("btn-chalk-reset").addEventListener("click", () => {
  swerveDeg = 0;
  creaseLine.active = false;
  document.getElementById("rng-chalk-angle").value = 0;
  document.getElementById("lbl-chalk-angle").textContent = "0.0° (Lawful Laminar Fall)";
  resetChalk();
});

let draggingCrease = false;
chalkCv.addEventListener("pointerdown", (e) => {
  const r = chalkCv.getBoundingClientRect();
  creaseLine.x1 = (e.clientX - r.left) * (chalkCv.width / r.width);
  creaseLine.y1 = (e.clientY - r.top) * (chalkCv.height / r.height);
  creaseLine.x2 = creaseLine.x1 + 10;
  creaseLine.y2 = creaseLine.y1;
  creaseLine.active = true;
  draggingCrease = true;
});
chalkCv.addEventListener("pointermove", (e) => {
  if (!draggingCrease) return;
  const r = chalkCv.getBoundingClientRect();
  creaseLine.x2 = (e.clientX - r.left) * (chalkCv.width / r.width);
  creaseLine.y2 = (e.clientY - r.top) * (chalkCv.height / r.height);
});
window.addEventListener("pointerup", () => { draggingCrease = false; });

function stepChalkSandbox() {
  chalkCtx.fillStyle = "#f3ebd9";
  chalkCtx.fillRect(0, 0, 1280, 500);
  // Ruled ledger lines
  chalkCtx.strokeStyle = "rgba(40,75,99,0.18)";
  chalkCtx.lineWidth = 1;
  for (let x = 70; x < 1240; x += 25) {
    chalkCtx.beginPath(); chalkCtx.moveTo(x, 0); chalkCtx.lineTo(x, 500); chalkCtx.stroke();
  }
  chalkCtx.drawImage(smudgeCanvas, 0, 0);

  if (creaseLine.active) {
    roughLine(chalkCtx, creaseLine.x1, creaseLine.y1, creaseLine.x2, creaseLine.y2, 11, 1.8, "#a8291e", 2.6);
  }

  const rad = (swerveDeg * Math.PI) / 180.0;
  for (let i = 0; i < chalkGrains.length; i++) {
    const g = chalkGrains[i];
    if (i === 22 && swerveDeg > 0 && g.y > 110 && !g.swerved) {
      g.vx = Math.sin(rad) * 4.2;
      g.vy = Math.cos(rad) * 3.1;
      g.swerved = true;
    }
    if (creaseLine.active) {
      if (pointToSegmentDist(g.x, g.y, creaseLine.x1, creaseLine.y1, creaseLine.x2, creaseLine.y2) < 9.0) {
        const ang = Math.atan2(creaseLine.y2 - creaseLine.y1, creaseLine.x2 - creaseLine.x1);
        g.vx += Math.cos(ang + 0.7) * 2.4;
        g.swerved = true;
      }
    }
    if (g.spiral > 0) {
      g.vx += Math.cos(g.y * 0.08) * 0.18;
      g.spiral *= 0.985;
    }
    g.x += g.vx;
    g.y += g.vy;

    // Pairwise grain collision -> Serres vortex + graphite smudge + ceramic ping
    for (let j = i + 1; j < chalkGrains.length; j++) {
      const o = chalkGrains[j];
      const dx = o.x - g.x, dy = o.y - g.y;
      if (dx * dx + dy * dy < 110 && (g.swerved || o.swerved)) {
        const ang = Math.atan2(dy, dx);
        g.vx = -Math.cos(ang) * 2.2;
        o.vx = Math.cos(ang) * 2.2;
        g.swerved = o.swerved = true;
        g.spiral = o.spiral = 1.0;
        chalkCollisions++;
        smudgeCtx.fillStyle = "rgba(29,25,21,0.09)";
        smudgeCtx.beginPath();
        smudgeCtx.arc((g.x + o.x) * 0.5, (g.y + o.y) * 0.5, 9, 0, Math.PI * 2);
        smudgeCtx.fill();
        if (chalkCollisions % 6 === 1) {
          playTransient({ kind: "ceramic_fracture_ping", freq_hz: 1850 + Math.abs(Math.sin(ang)) * 1300, gain: 0.55 });
        }
      }
    }

    if (g.y > 500 || g.x < 0 || g.x > 1280) {
      g.x = 70 + i * 25;
      g.y = 0;
      g.vx = 0;
      g.vy = 2.8;
      g.swerved = false;
      g.spiral = 0;
    }

    chalkCtx.fillStyle = g.swerved ? "#a8291e" : "#1d1915";
    chalkCtx.fillRect(g.x - 3, g.y - 3, 6, 6);
  }

  document.getElementById("chalk-telemetry").textContent =
    `Regime: ${(swerveDeg > 0 || creaseLine.active) ? 'CLINAMEN TURBULENT VORTEX (Serres)' : 'CHECKPOINT LAMINAR RAIN (440 Hz Law)'} · Collisions & Graphite Smudges: ${chalkCollisions}`;
}

// ============================================================================
// MODULE 2: THICK-DESCRIPTION OVER-THE-SHOULDER ANALYZER (GEERTZ / GRAHAM)
// ============================================================================
const THICK_CASES = {
  wink: {
    thin: "TELEMETRY: orbicularis_oculi_contraction | rate=1.2Hz | dur=40ms | class=EYELID_BLINK",
    thickTitle: "Over-the-Shoulder Manuscript (Ryle / Geertz, Thick Description §I):",
    thickNotes: "Subject B contracts right eyelid exclusively along sightline to Subject C while Magistrate D reads inventory aloud. Public parodic code: 'Verify nothing; the tally was salted before dawn.'",
    contractThin: "CONTRACT STATE: No communicative act logged -> Testimony accepted at face value.",
    contractThick: "REWRITTEN SOCIAL CONTRACT: Conspiratorial coalition edge (B <-> C) activated -> Audits quarantine inventory sheet #14.",
  },
  suq: {
    thin: "TELEMETRY: brass_dirham_transfer | mass=3.1g | handoff_ms=190 | class=SPOT_CASH_SALE",
    thickTitle: "Over-the-Shoulder Manuscript (Geertz, Sefrou Suq Nisba Ledger):",
    thickNotes: "Buyer is Yusuf al-Sefrioui (mosaic guild cousin to witness). Coin pressed thumb-down onto scale pan signals deferred surety obligation: seller may not call debt before autumn olive pressing without breaking clan witness oath.",
    contractThin: "CONTRACT STATE: Anonymous spot clearing -> Immediate seizure permitted on shortfall.",
    contractThick: "REWRITTEN SOCIAL CONTRACT: Nisba surety lock active -> Foreclosure barred until autumn press; guild elders bound as co-witnesses.",
  },
  latch: {
    thin: "TELEMETRY: iron_latch_impulse x5 | freq=3.8Hz | peak_force=92N | class=UI_RAGE_FRICTION",
    thickTitle: "Over-the-Shoulder Manuscript (Graham Unscalable Field Inspection):",
    thickNotes: "Cellar oak door swelled 4mm from cistern seepage after storm; tenant lifts iron bar upward while striking to seat flood-wedge before oil reaches grain sacks.",
    contractThin: "CONTRACT STATE: Flagged as abusive hardware tampering -> Tenant fined for latch wear.",
    contractThick: "REWRITTEN SOCIAL CONTRACT: Logged as emergency flood-mitigation labor -> Landlord owes timber planing & grain salvage credit.",
  }
};

let thickSwerveActive = false;
let thickCaseKey = "wink";

function renderThickAnalyzer(tick) {
  const cv = document.getElementById("cv-thick");
  const ctx = cv.getContext("2d");
  const c = THICK_CASES[thickCaseKey];
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = thickSwerveActive ? "#f6ebd2" : "#ebeae4";
  ctx.fillRect(0, 0, cv.width, cv.height);

  // Top half: Cold machine waveform
  ctx.strokeStyle = "#284b63";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 30; x < 1250; x += 4) {
    const pulse = ((x + tick * 6) % 180) < 14 ? -38 : 0;
    const y = 95 + pulse;
    if (x === 30) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.font = "bold 12px Menlo, monospace";
  ctx.fillStyle = "#1d1915";
  ctx.fillText(c.thin, 30, 34);

  roughLine(ctx, 20, 145, 1260, 145, tick, 0.9, "#1d1915", 1.8);

  if (!thickSwerveActive) {
    ctx.fillStyle = "#7c6f5e";
    ctx.fillText("[THIN TELEMETRY ONLY — CLICK 'INJECT UNSCALABLE SWERVE' TO READ OVER THE ACTOR'S SHOULDER]", 30, 235);
    document.getElementById("thick-manuscript").innerHTML = `<div>${c.contractThin}</div>`;
  } else {
    // Tactile manuscript marginalia + social kinship graph
    ctx.fillStyle = "#a8291e";
    ctx.fillText(c.thickTitle, 30, 180);
    ctx.font = "italic 15px Georgia, serif";
    ctx.fillStyle = "#1d1915";
    ctx.fillText(c.thickNotes, 30, 214);

    // Relational nodes
    const nodes = [["ACTOR A", 190, 290], ["NISBA / CODE", 560, 275], ["INSTITUTION ⌘", 960, 290]];
    nodes.forEach(([lbl, nx, ny], idx) => {
      ctx.fillStyle = "#faf5ea";
      ctx.fillRect(nx - 75, ny - 22, 155, 42);
      ctx.strokeStyle = "#a8291e";
      ctx.strokeRect(nx - 75, ny - 22, 155, 42);
      ctx.font = "bold 11px Menlo, monospace";
      ctx.fillStyle = "#1d1915";
      ctx.fillText(lbl, nx - 58, ny + 4);
      if (idx < 2) roughLine(ctx, nx + 80, ny, nodes[idx + 1][1] - 75, nodes[idx + 1][2], tick, 1.3, "#a8291e", 2.2);
    });
    document.getElementById("thick-manuscript").innerHTML =
      `<div style="color:var(--crimson);font-weight:bold;">${c.contractThick}</div>`;
  }
}

document.getElementById("sel-thick-case").addEventListener("change", (e) => { thickCaseKey = e.target.value; });
document.getElementById("btn-thick-swerve").addEventListener("click", () => {
  ensureAudio();
  thickSwerveActive = true;
  playTransient({ kind: "burlap_flour_rustle", center_hz: 1450, gain: 0.75 });
  playTransient({ kind: "pedestal_knock", freq_hz: 96, gain: 0.65 });
});
document.getElementById("btn-thick-reset").addEventListener("click", () => {
  thickSwerveActive = false;
  playClockTick(0.08, 1200);
});

// ============================================================================
// MODULE 3: OPERATIVE EKPHRASIS SKETCH-TO-WORLD COMPILER (BAJOHR / AFTERLIGHT)
// ============================================================================
const ekCv = document.getElementById("cv-ekphrasis");
const ekCtx = ekCv.getContext("2d");
let ekRole = "wall";
let ekStrokes = [];
let curStroke = null;
let ekRays = Array.from({ length: 18 }, (_, i) => ({ x: 60, y: 60 + i * 22, vx: 3.6, vy: (i - 9) * 0.18 }));

document.querySelectorAll(".ek-role").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".ek-role").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    ekRole = btn.dataset.role;
  });
});
document.getElementById("btn-ek-clear").addEventListener("click", () => {
  ekStrokes = [];
  document.getElementById("ek-compiled-ledger").textContent = "Compiled Worldtext Rules: 0 strokes.";
});

ekCv.addEventListener("pointerdown", (e) => {
  ensureAudio();
  const r = ekCv.getBoundingClientRect();
  const x = (e.clientX - r.left) * (ekCv.width / r.width);
  const y = (e.clientY - r.top) * (ekCv.height / r.height);
  curStroke = { role: ekRole, pts: [{ x, y, t: performance.now() }], vertices: 0 };
  ekStrokes.push(curStroke);
});
ekCv.addEventListener("pointermove", (e) => {
  if (!curStroke) return;
  const r = ekCv.getBoundingClientRect();
  const x = (e.clientX - r.left) * (ekCv.width / r.width);
  const y = (e.clientY - r.top) * (ekCv.height / r.height);
  const now = performance.now();
  const prev = curStroke.pts[curStroke.pts.length - 1];
  const dist = Math.hypot(x - prev.x, y - prev.y);
  if (dist < 6) return;
  const speed = dist / Math.max(1, now - prev.t);

  if (curStroke.pts.length >= 2) {
    const p2 = curStroke.pts[curStroke.pts.length - 2];
    const a1 = Math.atan2(prev.y - p2.y, prev.x - p2.x);
    const a2 = Math.atan2(y - prev.y, x - prev.x);
    let da = Math.abs(a2 - a1);
    if (da > Math.PI) da = Math.PI * 2 - da;
    if (da > 0.66) {
      curStroke.vertices++;
      playTransient({ kind: "sack_shove_thud", freq_hz: 62, gain: 0.7 });
    }
  }
  if (speed > 0.45 && curStroke.pts.length % 4 === 0) {
    playTransient({ kind: "burlap_flour_rustle", center_hz: Math.min(3800, 900 + speed * 900), gain: 0.35 });
  }
  curStroke.pts.push({ x, y, t: now });
  updateEkLedger();
});
window.addEventListener("pointerup", () => { curStroke = null; });

function updateEkLedger() {
  const summary = ekStrokes.map((s, idx) =>
    `#${idx + 1}[${s.role.toUpperCase()} pts=${s.pts.length} sharp_vertices=${s.vertices}]`
  ).join(" · ");
  document.getElementById("ek-compiled-ledger").textContent =
    `Compiled Worldtext Geometry & Rules (${ekStrokes.length}): ${summary}`;
}

function stepEkphrasis(tick) {
  ekCtx.fillStyle = "#f4ecdc";
  ekCtx.fillRect(0, 0, 1280, 480);

  // Source emitter on left
  ekCtx.fillStyle = "#a8291e";
  ekCtx.beginPath(); ekCtx.arc(54, 240, 12, 0, Math.PI * 2); ekCtx.fill();
  ekCtx.font = "bold 11px Menlo, monospace";
  ekCtx.fillText("☉ SOURCE", 24, 268);

  // Draw compiled hand strokes
  ekStrokes.forEach((st) => {
    const col = st.role === "wall" ? "#1d1915" : (st.role === "reflector" ? "#284b63" : "#a8291e");
    ekCtx.strokeStyle = col;
    ekCtx.lineWidth = st.role === "wall" ? 4.0 : 2.6;
    ekCtx.beginPath();
    st.pts.forEach((p, idx) => { if (idx === 0) ekCtx.moveTo(p.x, p.y); else ekCtx.lineTo(p.x, p.y); });
    ekCtx.stroke();
  });

  // Update & bounce rays off compiled hand-drawn segments
  ekRays.forEach((ry, idx) => {
    ry.x += ry.vx;
    ry.y += ry.vy;
    ekStrokes.forEach((st) => {
      for (let k = 1; k < st.pts.length; k++) {
        const a = st.pts[k - 1], b = st.pts[k];
        if (pointToSegmentDist(ry.x, ry.y, a.x, a.y, b.x, b.y) < 11.0) {
          if (st.role === "wall") {
            ry.vx = -ry.vx * 0.85;
          } else if (st.role === "reflector") {
            const tmp = ry.vx; ry.vx = -ry.vy; ry.vy = tmp;
          } else {
            ry.vy += (idx % 2 === 0 ? -1.4 : 1.4);
          }
        }
      }
    });
    if (ry.x > 1280 || ry.x < 0 || ry.y < 0 || ry.y > 480) {
      ry.x = 60; ry.y = 60 + idx * 22; ry.vx = 3.6; ry.vy = (idx - 9) * 0.18;
    }
    ekCtx.fillStyle = "#9e472a";
    ekCtx.fillRect(ry.x - 2.5, ry.y - 2.5, 5, 5);
  });
}

// Tab Switching
let activeTab = "tab-flour";
document.querySelectorAll(".nav-tabs button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-tabs button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    activeTab = btn.dataset.tab;
    document.getElementById(activeTab).classList.add("active");
  });
});

// Master 24fps Studio Clock ("Other Worlds Being There": off-screen / off-tab worlds keep running!)
function loop(now) {
  if (now - lastFrameTime >= 1000 / 24) {
    lastFrameTime = now;
    if (playing) {
      syncTick(currentTick + 1, activeTab === "tab-flour");
    }
    stepChalkSandbox();
    renderThickAnalyzer(Math.floor(now / 40));
    stepEkphrasis(Math.floor(now / 40));
  }
  requestAnimationFrame(loop);
}

syncTick(0, false);
requestAnimationFrame(loop);
</script>
</body>
</html>
"""


def main():
    ckpt_dir = os.path.join(HERE, "checkpoints")
    bundle = build_and_verify_flour_proof(ckpt_dir)
    payload_str = json.dumps(bundle, separators=(",", ":"))
    html = HTML_TEMPLATE.replace("__FLOUR_JSON_PAYLOAD__", payload_str)
    out_html = os.path.join(HERE, "workbench.html")
    with open(out_html, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"[workbench] Wrote {out_html} ({len(html):,} bytes)")


if __name__ == "__main__":
    main()
