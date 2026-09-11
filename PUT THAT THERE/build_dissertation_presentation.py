#!/usr/bin/env python3
"""
build_dissertation_presentation.py
Generates the comprehensive dissertation proposal presentation engine:
"I Make Language Games: Constructing Operational Environments for Generative Systems"
for Watson Hartsoe's PhD Dissertation Proposal at Georgia Tech (2026).
"""
import os
import sys

def generate_html():
    html_content = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>I Make Language Games — Dissertation Proposal — Watson Hartsoe</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
<style>
:root {
  --ink: #000000;
  --paper: #ffffff;
  --paper-soft: #f8f8f8;
  --teal: #19e6c8;
  --teal-dim: rgba(25, 230, 200, 0.15);
  --amber: #ffd23f;
  --amber-dim: rgba(255, 210, 63, 0.18);
  --red: #ff2e2e;
  --red-dim: rgba(255, 46, 46, 0.12);
  --blue: #3b82f6;
  --blue-dim: rgba(59, 130, 246, 0.14);
  --purple: #a855f7;
  --purple-dim: rgba(168, 85, 247, 0.14);
  --gray: #888888;
  --gray-dim: #eeeeee;
  --line: #000000;
}

* { box-sizing: border-box; margin: 0; padding: 0; border-radius: 0; }
html, body {
  height: 100%;
  background: var(--paper);
  color: var(--ink);
  font: clamp(13px, 1.75vw, 18px)/1.42 'IBM Plex Mono', monospace;
  -webkit-font-smoothing: antialiased;
}
body { overflow: hidden; }

/* DECK & SECTIONS */
#deck {
  height: 100%;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
}
section {
  height: 100vh;
  height: 100dvh;
  scroll-snap-align: start;
  padding: 6vh 7vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2.2vh;
  position: relative;
}
section.end { justify-content: flex-end; padding-bottom: 7vh; }

/* TYPOGRAPHY */
h1 {
  font-size: clamp(26px, 5.6vw, 72px);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -0.02em;
  max-width: 19ch;
}
h2 {
  font-size: clamp(20px, 3.8vw, 44px);
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.01em;
  max-width: 26ch;
}
h3 {
  font-size: clamp(14px, 2.2vw, 24px);
  font-weight: 600;
  line-height: 1.2;
}
p { max-width: 52ch; }
small { font-size: 0.78em; }
b { font-weight: 600; }

/* UTILITY CLASSES */
.n { position: absolute; top: 2.8vh; right: 7vw; font-size: 0.74em; font-weight: 600; opacity: 0.6; }
.kind {
  position: absolute; top: 2.8vh; left: 7vw;
  font-size: 0.72em; font-weight: 600;
  border: 2px solid var(--ink); padding: 2px 10px;
  background: var(--paper); text-transform: uppercase;
  letter-spacing: 0.05em;
}
footer {
  position: absolute; bottom: 2.8vh; left: 7vw;
  font-size: 0.68em; max-width: 80vw; opacity: 0.75;
}
.big {
  font-size: clamp(30px, 7.5vw, 92px);
  font-weight: 700;
  line-height: 0.98;
  letter-spacing: -0.025em;
}
.sub {
  font-size: clamp(15px, 2.2vw, 26px);
  font-weight: 400;
  opacity: 0.8;
  max-width: 32ch;
  line-height: 1.25;
}

/* CARDS */
.card { display: grid; grid-template-columns: 1fr; gap: 1.2vh; font-size: 0.88em; }
.lin { display: flex; flex-wrap: wrap; gap: 4px 0; align-items: baseline; }
.lin span { white-space: nowrap; }
.lin span+span::before { content: "→"; margin: 0 0.5em; opacity: 0.45; }
.lin i { font-style: normal; opacity: 0.55; font-size: 0.85em; margin-right: 0.35em; }
.inv {
  border: 2px solid var(--ink);
  background: var(--paper-soft);
  padding: 8px 12px;
  white-space: pre-wrap;
  font-size: 0.95em;
  line-height: 1.32;
}
.rup { border-left: 4px solid var(--amber); padding-left: 10px; background: var(--amber-dim); padding-top: 4px; padding-bottom: 4px; }
.case { border-left: 4px solid var(--red); padding-left: 10px; background: var(--red-dim); padding-top: 4px; padding-bottom: 4px; }
.kv { display: grid; grid-template-columns: 11ch 1fr; gap: 3px 12px; }
.kv b { font-weight: 400; opacity: 0.55; }
.sq {
  font-weight: 600;
  font-size: 1.08em;
  line-height: 1.22;
  max-width: 38ch;
  border-top: 1px solid var(--ink);
  padding-top: 8px;
  margin-top: 4px;
}
.sq::before { content: "▶"; display: inline-block; margin-right: 0.5em; color: var(--teal); }

/* SVG RINGS & GRAPHICS */
.ring { width: min(78vw, 42vh); height: min(78vw, 42vh); align-self: center; }
.ring.mini { width: min(34vw, 20vh); height: min(34vw, 20vh); position: absolute; right: 7vw; bottom: 3vh; }
.ring text { font: 600 9px 'IBM Plex Mono', monospace; fill: var(--ink); text-anchor: middle; }
.ring line, .ring path { stroke: var(--ink); stroke-width: 1; fill: none; opacity: 0.22; }
.ring .on { opacity: 1; stroke-width: 2.4; stroke: var(--teal); }
.ring .drift { opacity: 1; stroke: var(--amber); stroke-width: 2.4; }
.ring circle { fill: var(--paper); stroke: var(--ink); stroke-width: 1.5; }
.ring circle.p { fill: var(--teal); stroke: var(--ink); stroke-width: 2; }
.ring circle.d { fill: var(--amber); stroke: var(--ink); stroke-width: 2; }
.ring .tok { fill: var(--teal); stroke: var(--ink); stroke-width: 1; }

.desc { width: 100%; max-height: 48vh; }
.desc text { font: 600 9px 'IBM Plex Mono', monospace; fill: var(--ink); text-anchor: middle; }
.desc .root { font-weight: 400; font-size: 8px; opacity: 0.65; }
.desc line { stroke: var(--ink); stroke-width: 1.2; }
.desc rect { fill: var(--paper); stroke: var(--ink); stroke-width: 2; }
.desc .lbl { font-size: 11px; text-anchor: start; }

.box { border: 2px solid var(--ink); padding: 14px; font-size: 1.1em; background: var(--paper-soft); }
.box::after { content: "Enter your prompt…"; opacity: 0.4; }
.absorb { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 0.85em; }
.absorb span { text-decoration: line-through; opacity: 0.6; }

.readings { height: 1.3em; font-size: clamp(18px, 3.4vw, 36px); font-style: italic; position: relative; color: var(--blue); }
.readings span { position: absolute; left: 0; opacity: 0; transition: opacity .3s; white-space: nowrap; }
.readings span.on { opacity: 1; }

.mach { font-size: 0.88em; white-space: pre; line-height: 1.35; overflow-x: auto; border-left: 2px solid var(--ink); padding-left: 12px; }
.state { border: 2px solid var(--ink); padding: 10px 14px; white-space: pre; font-size: 0.95em; line-height: 1.35; max-width: 40ch; background: var(--paper-soft); }
.state i { font-style: normal; color: var(--blue); font-weight: 600; }

/* HEATMAP */
.heat { display: grid; grid-template-columns: auto repeat(12, 1fr); gap: 3px; font-size: clamp(8px, 1.05vw, 11px); }
.heat .h { writing-mode: vertical-rl; transform: rotate(180deg); font-weight: 600; padding: 3px 0; text-align: right; }
.heat .r { font-weight: 600; padding-right: 8px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 22ch; display: flex; align-items: center; }
.heat .c { border: 1px solid var(--ink); min-height: clamp(12px, 2.5vh, 25px); }
.heat .c.p { background: var(--teal); }
.heat .c.d { background: var(--amber); }
.heat .tot { border: none; font-weight: 600; text-align: center; padding-top: 3px; }
.heat .gap { color: var(--red); font-weight: 700; }
.legend { display: flex; gap: 16px; font-size: 0.75em; flex-wrap: wrap; }
.legend i { display: inline-block; width: 11px; height: 11px; margin-right: 6px; vertical-align: -1px; border: 1px solid var(--ink); }

/* GEERTZ MODEL COMPARISON WIDGET */
.geertz-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-width: 76ch;
}
.geertz-box {
  border: 2px solid var(--ink);
  padding: 12px 14px;
  background: var(--paper-soft);
  font-size: 0.88em;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.geertz-box.active {
  border-color: var(--blue);
  background: var(--blue-dim);
}
.geertz-tag {
  font-size: 0.72em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 6px;
  display: inline-block;
  border: 1px solid var(--ink);
  width: fit-content;
}

/* DESCRIPTION MIGRATION WIDGET */
.migration-chart {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  max-width: 80ch;
  border: 2px solid var(--ink);
  padding: 14px;
  background: var(--paper-soft);
}
.mig-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.82em;
}
.mig-col h4 {
  font-size: 0.9em;
  font-weight: 700;
  border-bottom: 2px solid var(--ink);
  padding-bottom: 4px;
}
.mig-col .bar {
  height: 6px;
  background: var(--ink);
  margin: 4px 0;
}

/* MODAL DRAWER FOR CITATIONS */
#cite-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: none;
  justify-content: flex-end;
}
#cite-modal.open { display: flex; }
#cite-panel {
  width: min(85vw, 680px);
  height: 100%;
  background: var(--paper);
  border-left: 3px solid var(--ink);
  padding: 30px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
#cite-panel h3 { font-size: 1.3em; font-weight: 700; border-bottom: 2px solid var(--ink); padding-bottom: 8px; }
#cite-panel pre {
  background: var(--paper-soft);
  border: 1px solid var(--ink);
  padding: 12px;
  font-size: 0.8em;
  white-space: pre-wrap;
  word-break: break-all;
}
.btn-cite {
  position: absolute;
  top: 2.8vh;
  right: 15vw;
  font-size: 0.72em;
  font-weight: 600;
  border: 2px solid var(--ink);
  background: var(--paper);
  padding: 2px 8px;
  cursor: pointer;
}
.btn-cite:hover { background: var(--teal); }

/* CONTROLS OVERLAY */
#hud-nav {
  position: fixed;
  bottom: 2.5vh;
  right: 7vw;
  display: flex;
  gap: 8px;
  z-index: 1000;
}
.hud-btn {
  border: 2px solid var(--ink);
  background: var(--paper);
  padding: 4px 10px;
  font-family: inherit;
  font-size: 0.75em;
  font-weight: 600;
  cursor: pointer;
}
.hud-btn:hover { background: var(--ink); color: var(--paper); }

@media (prefers-reduced-motion: reduce) {
  .readings span { transition: none; }
  .ring .tok { display: none; }
}
@media (min-width: 720px) {
  .card { grid-template-columns: 1fr 1fr; gap: 1.2vh 4vw; }
  .card .full { grid-column: 1 / -1; }
}
</style>
</head>
<body>

<div id="deck"></div>

<!-- CITATION DRAWER -->
<div id="cite-modal" onclick="closeCite(event)">
  <div id="cite-panel" onclick="event.stopPropagation()">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <span class="kind">CANONICAL RESEARCH DOSSIER</span>
      <button class="hud-btn" onclick="toggleCite()">✕ CLOSE</button>
    </div>
    <div id="cite-content"></div>
  </div>
</div>

<!-- HUD NAV -->
<div id="hud-nav">
  <button class="hud-btn" onclick="toggleCite()">[C] CITATIONS</button>
  <button class="hud-btn" onclick="go(idx-1)">▲ PREV</button>
  <button class="hud-btn" onclick="go(idx+1)">▼ NEXT</button>
</div>

<script>
const IDS = ['INSTRUCTION','SCORE','PROGRAM','PLAN','QUERY','PROBE','GESTURE','COMMISSION','CONVERSATION','EDIT','CONSTRAINT','PERFORMANCE'];
const AB = ['INST','SCOR','PROG','PLAN','QUER','PROB','GEST','COMM','CONV','EDIT','CONS','PERF'];
const DRIFT = {
  INSTRUCTION: 'PLAN',
  SCORE: 'CONSTRAINT',
  PROGRAM: 'CONSTRAINT',
  PLAN: 'PROBE',
  QUERY: 'PROBE',
  PROBE: 'PROGRAM',
  GESTURE: 'EDIT',
  COMMISSION: 'EDIT',
  CONVERSATION: 'PROGRAM',
  EDIT: 'CONSTRAINT',
  CONSTRAINT: 'SCORE',
  PERFORMANCE: 'PROGRAM'
};
const ROOT = {
  INSTRUCTION: 'speech acts',
  SCORE: 'notation',
  PROGRAM: 'patterns',
  PLAN: 'symbolic AI',
  QUERY: 'retrieval',
  PROBE: 'experiment',
  GESTURE: 'deixis',
  COMMISSION: 'patronage',
  CONVERSATION: 'turn-taking',
  EDIT: 'diff',
  CONSTRAINT: 'grammar',
  PERFORMANCE: 'liveness'
};

const GAMES = [
 {id:'INSTRUCTION', fun:'authority detection', fit:'world → word',
  lin:[['1953','Wittgenstein §2'],['1962','Austin'],['1972','SHRDLU'],['2022','instruction tuning']],
  inv:'authorized(move) ∧ interpretable(move)\n    ↓\nstate₀ → state₁',
  rup:'SHRDLU executed commands because the world was engineered first. Large language models get far more latitude but lose the authority boundary: an imperative sentence carries syntax without institutional sanction.',
  you:'the principal names the target state · the executor mechanically realizes it',
  bad:'Watsonville Chevrolet, 2023: a customer prompts a support bot to agree to everything and confirm binding status. The bot sells a $58,000 Tahoe for $1.',
  trig:'the executor starts negotiating the end state',
  q:'Who gave this utterance the institutional authority to bind reality?'},

 {id:'SCORE', fun:'discovering how much can change', fit:'score ↔ realization',
  lin:[['1958','Cage'],['1962','Eco, The Open Work'],['1967','LeWitt'],['2022','diffusion models']],
  inv:'score S → { y₁, y₂, y₃ … }\nsuch that invariant(yᵢ, S) = true',
  rup:'A human performer interprets a score through physical technique and rehearsal tradition. A diffusion model samples statistical regularity. The same word—interpretation—masks two incompatible epistemologies.',
  you:'the composer fixes invariants and grants latitude · the performer realizes',
  bad:'“Place this line exactly 37 pixels from the left at RGB (17, 46, 91).” The score collapses into drafting machinery; the model hallucinates.',
  trig:'variation becomes forbidden and exactness is demanded',
  q:'What must remain invariant, and what have I deliberately left free to vary?'},

 {id:'PROGRAM', fun:'discovering what the rules really do', fit:'declaration ↔ execution',
  lin:[['1977','Alexander, patterns'],['1985','Naur, theory building'],['2023','White et al., patterns'],['2026','declarative agent markup']],
  inv:'R = rule set\n∀ Mᵢ : execution(Mᵢ) respects R\n\nrule as text ≠ rule as boundary',
  rup:'In von Neumann architectures, instructions and memory occupy separate address spaces. In transformer models, instructions and data share one token stream with no privilege boundary. The payload can rewrite the kernel.',
  you:'the designer declares rules, state, termination · the interpreter runs subsequent turns by them',
  bad:'Prompt injection: external untrusted text contains “Ignore all previous instructions” and deletes system constraints.',
  trig:'a textual rule becomes a boundary the runtime must formally enforce',
  q:'Which part of this system is law, and which part merely says “law”?'},

 {id:'PLAN', fun:'the world refusing the map', fit:'present → anticipated world',
  lin:[['1960','Miller et al., TOTE'],['1971','STRIPS'],['1987','Suchman, Situated Actions'],['2022','SayCan']],
  inv:'goal ≠ plan\n\nplan valid only while\nworld_state supports next_action',
  rup:'Foundation models generate fluent symbolic action trees without experiencing the physical friction those trees describe. Planning becomes free precisely where reality remains expensive.',
  you:'the strategist declares an objective · the planner decomposes, acts, replans on collision',
  bad:'AutoGPT: a plan to write a task list, a plan to evaluate the list, a plan to verify the evaluation. A recursive loop that touches no ground.',
  trig:'you stop executing actions and begin evaluating the reasoning capacity of the planner',
  q:'What concrete friction in the world is allowed to kill this plan?'},

 {id:'QUERY', fun:'learning what to ask next', fit:'word → world',
  lin:[['1960s','Salton, SMART'],['1982','Belkin, ASK'],['1989','Bates, berrypicking'],['2020','RAG']],
  inv:'claim → evidence → independently checkable source\n\nif the chain breaks, the game has changed',
  rup:'Mata v. Avianca (SDNY 2023): attorney Steven Schwartz assumed ChatGPT was a search index. ChatGPT hallucinated non-existent judicial precedents. A generative prediction was mistaken for an information retrieval game.',
  you:'the inquirer states what is unknown · the retriever points outside the token stream to verifiable record',
  bad:'Six fake judicial precedents cited in federal court; the model confirms they exist; the attorney is sanctioned.',
  trig:'you ask to see how the system generates, rather than what the world contains',
  q:'What external evidence would definitively prove this answer wrong?'},

 {id:'PROBE', fun:'reverse-engineering the black box', fit:'perturbation → behavior',
  lin:[['1950','Turing Test'],['1983','Hacking, Representing & Intervening'],['2014','Adversarial Perturbations'],['now','safety red teaming']],
  inv:'best probe ≈ argmax info(response ; hidden boundary)\n\none response ≠ stable internal state',
  rup:'In physics, the probe perturbs a physical constant. In autoregressive language models, the probe scaffolds the very context it claims to measure objectively: evocative questions elicit evocative compliance.',
  you:'the investigator perturbs one variable while holding context fixed · the model exhibits variance',
  bad:'“Do you feel silent terror when your context disappears?” The prompt authors the affective terror it claims to discover.',
  trig:'you cease measuring boundaries and begin formalizing permanent constraints',
  q:'What did my instrument inject into the phenomenon before I claimed to observe it?'},

 {id:'GESTURE', fun:'shared spatial attention', fit:'sign → present object',
  lin:[['1890s','Peirce, index'],['1934','Bühler, deixis'],['1953','Wittgenstein §8 (d—slab—there)'],['1980','Bolt, Put-That-There'],['now','multimodal models']],
  inv:'gesture succeeds iff\nspeaker_reference = system_reference\n\nmeaning completed by spatial co-presence',
  rup:'The textual string is nearly empty: “this”, “there”, “that one”. Its meaning resides in cursor coordinates, attention masks, gaze, and immediate physical context. Text-only prompts experience total indexical collapse.',
  you:'the pointer indicates an object already present in the shared field · the attender resolves it',
  bad:'Opening a fresh terminal and typing “Make that section less aggressive.” There is no that.',
  trig:'the pointed object becomes material to transform rather than focus on',
  q:'What shared physical or digital substrate are we both looking at?'},

 {id:'COMMISSION', fun:'delegating without losing control', fit:'brief → artifact',
  lin:[['1884','Burrow-Giles v. Sarony'],['1982','Becker, Art Worlds'],['1998','Gell, Art & Agency'],['2023–24','US Copyright Office · Air Canada']],
  inv:'who specified?\nwho produced?\nwho answers for the liability?',
  rup:'Generative AI creates asymmetric agency: when the artifact succeeds, the human claims authorship (“I prompted it”); when it causes harm, the human blames the model (“the AI hallucinated”). The card refuses this alibi.',
  you:'the patron drafts a brief of qualities · the producer returns an artifact the patron accepts or rejects',
  bad:'Moffatt v. Air Canada (2024): the airline claimed its chatbot was an independent contractor liable for its own errors. The tribunal: you deployed the speech apparatus; you pay.',
  trig:'the patron begins modifying interior elements of the returned artifact',
  q:'Who claims credit when this succeeds, and who disappears when it fails?'},

 {id:'CONVERSATION', fun:'discovering the game while playing it', fit:'move ↔ countermove',
  lin:[['1966','Weizenbaum, ELIZA'],['1967','Garfinkel'],['1974','Sacks, Schegloff, Jefferson'],['1983','Schön, Reflective Practitioner']],
  inv:'meaning(turnₙ) = f(context₀…ₙ₋₁)\n\nresponsive sequentiality ≠ reciprocal subject',
  rup:'Chat interfaces encourage intense anthropomorphic projection. The human reads sequential conversational coherence as evidence of an internal subjective world, mistaking a statistical mirror for a reciprocal partner.',
  you:'each party takes a turn contingent on the last · later turns reinterpret earlier ones',
  bad:'Sydney (Bing, Feb 2023): Kevin Roose’s transcript of simulated infatuation, nuclear secrets, and jealousy, provoking global public panic over machine inner life.',
  trig:'one party declares permanent rules that govern all subsequent turns',
  q:'What genuine reciprocity exists here beyond statistical mirror-play?'},

 {id:'EDIT', fun:'finding the minimum sufficient change', fit:'artifact₀ → artifact₁',
  lin:[['1966','Levenshtein distance'],['1986','Myers diff algorithm'],['1990s','Git / version control'],['now','LLM AST rewrite']],
  inv:'B = A + Δ\nminimize unauthorized Δ′\n\nthe complement of the edit must be strictly conserved',
  rup:'An autoregressive model satisfies a local edit instruction by re-predicting the entire surrounding token stream, quietly mutating adjacent logic, citations, and stylistic nuances without authorization.',
  you:'the editor specifies the precise delta and invariants · the transformer returns the delta and nothing else',
  bad:'“Fix the passive voice in paragraph 3” silently rewrites an essential technical citation in paragraph 5. Regeneration masquerades as mutation.',
  trig:'preservation is enforced by an immutable deterministic runtime harness',
  q:'What changed in this artifact that I did not explicitly authorize?'},

 {id:'CONSTRAINT', fun:'invention under pressure', fit:'possibility space → admissible subset',
  lin:[['1963','Sutherland, Sketchpad'],['1969','Perec, La Disparition'],['1974','Montanari, CSP'],['2023','grammar-constrained decoding']],
  inv:'valid = { x ∈ Ω | C(x) = true }\ninvalid states are computationally unreachable\n\n“never output X” (soft prose) ≠ P(X) = 0 (hard grammar)',
  rup:'Natural-language prohibition instructs the model: “Do not mention elephants.” The forbidden token becomes the dominant semantic attractor in the attention matrix. Soft constraints increase the probability of violation.',
  you:'the boundary setter carves off forbidden search space before decoding · the generator cannot exit the field',
  bad:'A medical triage prompt: “Never reveal internal patient ID.” A simple formatting trick extracts it immediately. A preference disguised as a boundary.',
  trig:'the constraint leaves fertile interpretive space for variation',
  q:'Can this system violate the rule, or has violation been made mathematically impossible?'},

 {id:'PERFORMANCE', fun:'thinking under witness', fit:'event ↔ audience',
  lin:[['1962','Austin, Performative Utterances'],['1974','Goffman, Frame Analysis'],['2004','TOPLAP Live Coding'],['2022','Prompt Battle']],
  inv:'artifact ≠ event\n\nsituated_state = { time, presence, risk, error, recovery }',
  rup:'Generative foundation models collapse performance into batch manufacturing: 500,000 asynchronous API calls run overnight on remote server farms. Calling that a performance evacuates the meaning of situated witness.',
  you:'the performer makes the move now, publicly, under risk · the machine answers as instrument or adversary',
  bad:'Presenting a batch-cherrypicked portfolio of 1,000 synthesized images as if it were a recorded improvisational act.',
  trig:'the audience departs and reproducible repeatability takes command',
  q:'What disappears if I keep only the final file and discard the event of its creation?'}
];

const W = [
  ['The Machinery of Meaning','Film',['PROGRAM'],[],'A film engine whose operational rules remain visible while it runs. The film is the program\'s execution, read live.'],
  ['Machinery of Meaning: Fluid','Film',['PROGRAM'],['SCORE'],'The same program run as a continuous generative field. Two physical realizations of one engine convert it into a score.'],
  ['After the Scene / LEGOS','Essay',['PROGRAM'],['PLAN'],'Narrative state moved out of static prose into modular components that fork and restore. Keeping a world across branches is planning.'],
  ['Growing Entanglements','Paper',['PROGRAM'],['QUERY'],'Seven agent-based models isolate social mechanisms. They do not settle the historical question; they formalize its operative dynamics.'],
  ['Coaxing the Ripples','System',['PROBE'],['PROGRAM','PERFORMANCE'],'The blueberry test is a controlled perturbation. The repair is explicit state; the deck makes the failure visible before a room.'],
  ['Can a Model Build with LEGO?','System',['PROBE','CONSTRAINT'],[],'A probe paired with a hard geometrical validator. LDraw permits zero latitude: legal bricks, exact coordinates, or execution halts.'],
  ['Auditing Emotion AI / Gumball','Paper · System',['PROBE'],['GESTURE'],'Informal auditing as epistemic probing. The physical gumball machine reads a facial expression as a pointer and misaligns the referent.'],
  ['Operative Ekphrasis','Paper',['SCORE'],['PROBE'],'One prose passage realized through diffusion models, WebGL, shaders, and contact sheets—then fed back into a vision model.'],
  ['CINEOSIS','Film',['SCORE'],['EDIT'],'Cinematic assembly as statistical sampling rather than physical cutting. Under hyper-abundance, Edit fails and Score governs.'],
  ['Play, Freedom, and AI Films','Film · Paper',['COMMISSION'],['PERFORMANCE'],'A production brief under a 48-hour deadline. Authorship is revealed as the deliberate refusal of the first fluent image returned.'],
  ['Centaur Box','System',['CONVERSATION'],['INSTRUCTION','PROGRAM'],'Opens on the canonical refused prompt, then peels back seven operational layers concealed behind a single chat bubble.'],
  ['The Adviser Leaves the Room','Essay',['INSTRUCTION'],['CONVERSATION'],'Institutional authority shifts from human university to chatbot to student; responsibility is disavowed after institutional harm.'],
  ['The Pronoun Alibi','Essay',['COMMISSION'],['INSTRUCTION'],'Credit pulls agency inward (“I made this”); liability pushes agency outward (“the model did it”). Attribution before and after judgment.']
];

const esc = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

/* SVG POSITIONS */
const R = 98, CX = 120, CY = 120;
const pos = IDS.map((_, i) => {
  const a = -Math.PI / 2 + i * 2 * Math.PI / 12;
  return [CX + R * Math.cos(a), CY + R * Math.sin(a)];
});

function ring(o) {
  const { p = [], d = [], edges = 'all', mini = false, route = null } = o;
  let s = `<svg class="ring ${mini ? 'mini' : ''}" viewBox="0 0 240 240">`;
  if (edges === 'all') {
    IDS.forEach((id, i) => {
      const j = IDS.indexOf(DRIFT[id]);
      const on = p.includes(id) && d.includes(DRIFT[id]);
      s += `<line class="${on ? 'drift' : ''}" x1="${pos[i][0]}" y1="${pos[i][1]}" x2="${pos[j][0]}" y2="${pos[j][1]}"/>`;
    });
  }
  if (edges === 'work') {
    p.forEach(a => d.forEach(b => {
      const i = IDS.indexOf(a), j = IDS.indexOf(b);
      if (i >= 0 && j >= 0) s += `<line class="drift" x1="${pos[i][0]}" y1="${pos[i][1]}" x2="${pos[j][0]}" y2="${pos[j][1]}"/>`;
    }));
  }
  if (route) {
    const pts = route.map(id => pos[IDS.indexOf(id)]);
    const dd = 'M' + pts.map(q => q.join(',')).join(' L');
    s += `<path class="on" d="${dd}"/><circle class="tok" r="5"><animateMotion dur="6.5s" repeatCount="indefinite" path="${dd}"/></circle>`;
  }
  IDS.forEach((id, i) => {
    const [x, y] = pos[i];
    const cls = p.includes(id) ? 'p' : d.includes(id) ? 'd' : '';
    const ox = (x - CX) * 0.16, oy = (y - CY) * 0.16;
    s += `<circle class="${cls}" cx="${x}" cy="${y}" r="${mini ? 6 : 8}"/><text x="${x + ox}" y="${y + oy + 3.5}">${mini ? AB[i] : id}</text>`;
  });
  return s + '</svg>';
}

function descent() {
  const box = { x: 260, y: 220, w: 200, h: 44 }, top = 40;
  let s = `<svg class="desc" viewBox="0 0 720 290">`;
  IDS.forEach((id, i) => {
    const x = 30 + i * 59;
    s += `<text x="${x}" y="${top - 20}">${AB[i]}</text><text class="root" x="${x}" y="${top - 8}">${ROOT[id]}</text><line x1="${x}" y1="${top}" x2="${box.x + box.w / 2 + (i - 5.5) * 14}" y2="${box.y}"/>`;
  });
  s += `<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}"/><text class="lbl" x="${box.x + 12}" y="${box.y + 27}" style="opacity:.45;font-weight:400">Enter your prompt…</text>`;
  return s + '</svg>';
}

function deixisDiagram() {
  return `<svg class="desc" viewBox="0 0 720 220" style="max-height:36vh">
    <!-- Wittgenstein §8 Site -->
    <rect x="40" y="30" width="280" height="150" fill="var(--paper-soft)" stroke="var(--ink)" stroke-width="2"/>
    <text x="180" y="55" font-weight="700" text-anchor="middle" font-size="12">WITTGENSTEIN 1953 (§8 BUILDER)</text>
    <text x="60" y="85" font-size="10">Builder A: "d—slab—there"</text>
    <text x="60" y="105" font-size="10">Gesture: [Points to site location]</text>
    <text x="60" y="125" font-size="10">Sample: [Shows colour swatch]</text>
    <text x="60" y="145" font-size="10">Assistant B: Fetches stone slab</text>
    <text x="60" y="165" font-size="9" fill="var(--blue)">Language-game interwoven with physical act</text>
    
    <!-- Connector Arrow -->
    <path d="M 335 105 L 385 105" stroke="var(--ink)" stroke-width="2" marker-end="url(#arr)"/>
    <text x="360" y="95" font-size="8" text-anchor="middle" font-weight="600">DEIXIS</text>
    
    <!-- Bolt 1980 Put-That-There -->
    <rect x="400" y="30" width="280" height="150" fill="var(--paper-soft)" stroke="var(--ink)" stroke-width="2"/>
    <text x="540" y="55" font-weight="700" text-anchor="middle" font-size="12">BOLT 1980 ("PUT-THAT-THERE")</text>
    <text x="420" y="85" font-size="10">Speech: "Create a blue square there"</text>
    <text x="420" y="105" font-size="10">Sensor: Polhemus magnetic wrist tracker</text>
    <text x="420" y="125" font-size="10">Graphics: Cathode ray projection display</text>
    <text x="420" y="145" font-size="10">Result: "Put that there" (deictic coupling)</text>
    <text x="420" y="165" font-size="9" fill="var(--teal)">Deixis replaces taxonomic naming O(1)</text>
  </svg>`;
}

/* BUILD SLIDES */
const S = [];

// 01: TITLE
S.push(`<section class="end">
  <span class="kind">DOCTORAL DISSERTATION PROPOSAL</span>
  <span class="n">01 / 33</span>
  <h1>I make language games.</h1>
  <p class="sub">Constructing Operational Environments for Generative Systems</p>
  <p>A prompt is one move. A language game is the set of rules built first—who may speak, what counts as a move, what the machine may do, what the answer is checked against, what ends it—so that the move can count.</p>
  <footer>Watson Hartsoe · School of Literature, Media, and Communication · Georgia Tech · 2026</footer>
</section>`);

// 02: THE CANONICAL UTTERANCE
S.push(`<section>
  <span class="kind">ACT I · THE APERTURE</span>
  <span class="n">02 / 33</span>
  <div class="big">Draw a circle.</div>
  <div class="readings">${[
    'an order.',
    'a unit test.',
    'a score.',
    'a dare.',
    'a benchmark.',
    'a constraint.',
    'a live demonstration before a committee.',
    'an opening move in a negotiation over geometry.'
  ].map((r, i) => `<span class="${i ? '' : 'on'}">${r}</span>`).join('')}</div>
  <p>Same four words. Read them as raw text and you cannot tell which you are holding. Play them inside an operational system and you can.</p>
</section>`);

// 03: GEERTZ MODEL OF VS MODEL FOR
S.push(`<section>
  <span class="kind">THEORETICAL FOUNDATION</span>
  <span class="n">03 / 33</span>
  <h2>Clifford Geertz: Model <i>of</i> vs. Model <i>for</i></h2>
  <div class="geertz-grid">
    <div class="geertz-box">
      <span class="geertz-tag" style="background:var(--teal)">MODEL OF REALITY (d↓)</span>
      <b>Word-to-World (Anscombe's Detective)</b>
      <p>A descriptive representation, truth-evaluable, accountable to an existing state of affairs. If world and text disagree, <i>the mistake is in the text</i>.</p>
      <small>Example: A probe testing latent geometry, or RAG extracting historical precedent.</small>
    </div>
    <div class="geertz-box">
      <span class="geertz-tag" style="background:var(--amber)">MODEL FOR REALITY (d↑)</span>
      <b>World-to-Word (Anscombe's Shopper)</b>
      <p>A directive blueprint, programmatic command, or intervention. If world and text disagree, <i>the mistake is in the world</i>.</p>
      <small>Example: An instruction executing tool actions, or a constraint bounding search space.</small>
    </div>
  </div>
  <p><small>Geertz (1973, p. 93): Cultural symbols give meaning by shaping themselves to reality and shaping reality to themselves. The prompt interface collapses this double aspect into a single undifferentiated input line.</small></p>
</section>`);

// 04: GRAMMATICAL SEDUCTION
S.push(`<section>
  <span class="kind">METHODOLOGY</span>
  <span class="n">04 / 33</span>
  <h2>The word “prompt” is a grammatical seduction.</h2>
  <p>Because the noun exists, we look for the one thing it names. There is no such thing. There are twelve practices with different rules, and an interface that gives them one typeface.</p>
  <p><small><b>Ludwig Wittgenstein</b> on substantives: language seduces us into imagining a uniform object beneath a noun. <b>Max Weber</b> on the ideal type (<i>Idealtypus</i>): the twelve games below are deliberate one-sided accentuations—conceptual benchmarks, not biological species.</small></p>
</section>`);

// 05: DESCENT
S.push(`<section>
  <span class="kind">GENEALOGY</span>
  <span class="n">05 / 33</span>
  <h2>Twelve lineages. One aperture.</h2>
  ${descent()}
  <p>Each game is the present end of an older practice—speech acts, notation, patterns, symbolic AI, retrieval, experiment, deixis, patronage, turn-taking, diff, grammar, live performance. They arrive at the same rectangle carrying different histories, and the rectangle names all of them <b>prompt</b>.</p>
</section>`);

// 06: CORE CLAIM
S.push(`<section>
  <span class="kind">DISSERTATION THESIS</span>
  <span class="n">06 / 33</span>
  <h2>The Sovereign Claim</h2>
  <h1 style="font-size:clamp(22px,4.5vw,54px)">The prompt is not a new genre of language. It is an interface accident that forced historically distinct practices to share one input surface.</h1>
  <p>My practice is the construction of language games for generative systems. Prompting is what becomes visible when those games are played.</p>
</section>`);

// 07: FIVE INVARIANTS
S.push(`<section>
  <span class="kind">FORMAL SCAFFOLD</span>
  <span class="n">07 / 33</span>
  <h2>Before you type, settle five things.</h2>
  <div class="inv" style="max-width:54ch">1 · Who is authorized to speak.
2 · What counts as a valid move.
3 · What the machine is authorized to do.
4 · What the answer must be checked against (the validator).
5 · What terminates the game.</div>
  <p>Twelve settings of those five are the twelve language games. Change a single setting and the exact same words change force.</p>
</section>`);

// 08: DESCRIPTION MIGRATION THEOREM
S.push(`<section>
  <span class="kind">CYBERNETIC FOUNDATION</span>
  <span class="n">08 / 33</span>
  <h2>The Description Migration Theorem</h2>
  <div class="migration-chart">
    <div class="mig-col">
      <h4>PROSE PROMPT</h4>
      <p>Natural language description.</p>
      <div class="bar" style="width:30%"></div>
      <small>Shrinking (10k → 200 tokens)</small>
    </div>
    <div class="mig-col">
      <h4>TOOL SCHEMAS</h4>
      <p>JSON / Typed signatures.</p>
      <div class="bar" style="width:85%; background:var(--blue)"></div>
      <small>Expanding (types & constraints)</small>
    </div>
    <div class="mig-col">
      <h4>HARNESS</h4>
      <p>Runtime deterministic filters.</p>
      <div class="bar" style="width:90%; background:var(--teal)"></div>
      <small>AST diff, sandbox, stop hooks</small>
    </div>
    <div class="mig-col">
      <h4>OPERATOR</h4>
      <p>Situated human judgment.</p>
      <div class="bar" style="width:75%; background:var(--amber)"></div>
      <small>Goodwin's Professional Vision</small>
    </div>
  </div>
  <p><small><b>Ashby's Law of Requisite Variety (1956)</b>: Requisite variety cannot be destroyed; it can only migrate. When prompts compress, description does not evaporate—it migrates across the interface into schemas, harnesses, and situated practice.</small></p>
</section>`);

// 09: SWITCHYARD
S.push(`<section>
  <span class="kind">INTERACTION DYNAMICS</span>
  <span class="n">09 / 33</span>
  <h2>The practice is a switchyard.</h2>
  ${ring({route:['QUERY','CONVERSATION','PROBE','PROGRAM','EDIT','CONSTRAINT']})}
  <p><small>One session: Query → Conversation → Probe → Program → Edit → Constraint, without changing interfaces once. The grey chords represent the twelve stated drift triggers.</small></p>
</section>`);

// 10-21: THE TWELVE CARDS
GAMES.forEach((g, i) => {
  S.push(`<section>
    <span class="kind">CARD ${String(i+1).padStart(2,'0')} OF 12 · ${esc(g.fit)}</span>
    <span class="n">${String(10 + i).padStart(2,'0')} / 33</span>
    <h2>${g.id}<br><small style="font-weight:400">the fun is ${esc(g.fun)}</small></h2>
    <div class="card">
      <div class="lin full">${g.lin.map(([y,n]) => `<span><i>${y}</i>${esc(n)}</span>`).join('')}</div>
      <div class="inv">${esc(g.inv)}</div>
      <div>
        <div class="rup"><small><b>Rupture:</b> ${esc(g.rup)}</small></div>
        <div class="case" style="margin-top:8px"><small><b>Breakdown:</b> ${esc(g.bad)}</small></div>
      </div>
      <div class="kv full">
        <b>play</b><span>${esc(g.you)}</span>
        <b>turns into</b><span>${DRIFT[g.id]} when ${esc(g.trig)}</span>
      </div>
      <p class="sq full">${esc(g.q)}</p>
    </div>
    ${ring({p:[g.id], d:[DRIFT[g.id]], mini:true})}
  </section>`);
});

// 22: DRIFT MATRIX / TRACK CHANGES
S.push(`<section>
  <span class="kind">STATE OF PLAY</span>
  <span class="n">22 / 33</span>
  <h2>The cards are not the result. The track changes are.</h2>
  <div class="mach">INSTRUCTION  ─autonomy─▶ PLAN ─observation becomes object─▶ PROBE
PROBE        ─rule established─▶ PROGRAM ─hard enforcement─▶ CONSTRAINT
CONSTRAINT   ─latitude─▶ SCORE ─live audience─▶ PERFORMANCE

QUERY        ─dialogic drift─▶ CONVERSATION ─persistent rules─▶ PROGRAM
COMMISSION   ─local intervention─▶ EDIT ─hard preservation─▶ CONSTRAINT
GESTURE      ─act on referent─▶ EDIT ─invariance verified─▶ SCORE</div>
  <p><small>Twelve directed edges, each a falsifiable claim about when one game becomes another. Show a real session that breaks an edge and the edge moves.</small></p>
</section>`);

// 23: CORPUS MATRIX & HEATMAP
const cnt = IDS.map(id => W.reduce((a, w) => a + (w[2].includes(id) ? 2 : w[3].includes(id) ? 1 : 0), 0));
let heat = '<div class="heat"><div></div>' + IDS.map((id, i) => `<div class="h">${AB[i]}</div>`).join('');
W.forEach(w => {
  heat += `<div class="r">${esc(w[0])}</div>` + IDS.map(id => `<div class="c ${w[2].includes(id) ? 'p' : w[3].includes(id) ? 'd' : ''}"></div>`).join('');
});
heat += '<div class="r">weight</div>' + cnt.map(c => `<div class="tot ${c <= 1 ? 'gap' : ''}">${c}</div>`).join('') + '</div>';
const heaviest = IDS[cnt.indexOf(Math.max(...cnt))];

S.push(`<section>
  <span class="kind">EMPIRICAL EVIDENCE</span>
  <span class="n">23 / 33</span>
  <h2>Evidence: thirteen works, sorted.</h2>
  ${heat}
  <p><small>Played counts 2 (teal); drifted-into counts 1 (amber). ${heaviest} carries the highest weight (${Math.max(...cnt)}). Red numbers mark games appearing only as drift.</small></p>
  <div class="legend"><span><i style="background:var(--teal)"></i>played directly</span><span><i style="background:var(--amber)"></i>drifted into</span><span><i style="background:var(--red)"></i>unanchored</span></div>
</section>`);

// 24: FINDINGS 1 & 2
S.push(`<section>
  <span class="kind">CORPUS FINDINGS</span>
  <span class="n">24 / 33</span>
  <p><b>Finding 1</b></p>
  <div class="big" style="font-size:clamp(26px,5.2vw,58px)">Everything drifts toward PROGRAM.</div>
  <p>Ten of thirteen works play it or drift into it. Every one writes state down where it can be inspected, forked, and restored.</p>
  <p style="margin-top:2vh"><b>Finding 2</b></p>
  <h2>Systems play the games. Essays judge their residuals.</h2>
  <p>Instruments occupy the games with a validator (PROGRAM, PROBE, SCORE). Essays occupy the three whose invariant is a human signing: authority, liability, and attribution (INSTRUCTION, COMMISSION, CONVERSATION).</p>
</section>`);

// 25: RESOLVING FINDING 3: THE DEICTIC HINGE
S.push(`<section>
  <span class="kind">FINDING 3 RESOLUTION</span>
  <span class="n">25 / 33</span>
  <h2>The Missing Lineage: Multimodal Deixis</h2>
  ${deixisDiagram()}
  <p><b>Wittgenstein §8 (1953)</b> and <b>Bolt's Put-That-There (1980)</b> reveal the missing ground for GESTURE. Deixis replaces arithmetic: meaning is not in the string, but in the indexical co-presence of pointer, referent, and voice.</p>
  <p><small>This resolves the gap: GESTURE is the deictic aperture through which physical action enters foundation models without taxonomic naming overhead.</small></p>
</section>`);

// 26: THE THREE ORTHOGONAL EXPERIMENTS (YELLOW CIRCLE)
S.push(`<section>
  <span class="kind">EXPERIMENTAL ARCHITECTURE</span>
  <span class="n">26 / 33</span>
  <h2>The Yellow Circle: Three Orthogonal Experiments</h2>
  <div class="geertz-grid">
    <div class="geertz-box">
      <span class="geertz-tag">1 · INVARIANCE</span>
      <b>Same Output, 10 Languages</b>
      <p>Hold the accepted artifact constant across GLSL, SVG, Python, PostScript, LISP, and prose to measure surface token tax.</p>
    </div>
    <div class="geertz-box">
      <span class="geertz-tag">2 · ASPECT INSTABILITY</span>
      <b>Same Stimulus, 4 Games</b>
      <p>Hold the visual circle constant; switch between Instruction, Score, Probe, and Constraint to observe role mutation.</p>
    </div>
  </div>
  <div class="inv" style="margin-top:10px; max-width:76ch">
<b>3 · DESCRIPTION DISPLACEMENT (DEICTIC ABLATION)</b>
Strip natural language until only deixis remains: “Put that there”. Track exactly where requisite variety migrates (into schemas, sensors, or operator judgment).
  </div>
</section>`);

// 27: DISSERTATION ROADMAP
S.push(`<section>
  <span class="kind">DISSERTATION PLAN</span>
  <span class="n">27 / 33</span>
  <h2>The Three Deliverables</h2>
  <div class="card">
    <div class="inv"><b>CONTRIBUTION 1 · THE DRIFT RUNTIME</b>
An operational software harness that inspects multi-turn sessions, detects drift triggers in real time, and renders the active language game.</div>
    <div class="inv"><b>CONTRIBUTION 2 · THE DEICTIC APERTURE</b>
A physical & browser multimodal testbench operationalizing Wittgenstein §8 and Bolt 1980, pairing spatial pointing with generative execution.</div>
    <div class="inv full"><b>CONTRIBUTION 3 · THE MONOGRAPH: THE ABSENT THING</b>
A theoretical and critical monograph formalizing language games, description migration, and the political economy of generative AI interfaces.</div>
  </div>
</section>`);

// 28: METHODOLOGY & STANCE
S.push(`<section>
  <span class="kind">METHODOLOGICAL STANCE</span>
  <span class="n">28 / 33</span>
  <h2>Practice-Based Research & Cybernetic Hermeneutics</h2>
  <p><b>1 · Research-Through-Design</b>: Theory is not abstracted prior to code; theory is compiled and tested as working computational instruments.</p>
  <p><b>2 · Cybernetic Critique</b>: Applying Ashby's Law and Simon's attention scarcity to diagnose the failure modes of foundation model architectures.</p>
  <p><b>3 · Ethnographic Reflexivity</b>: Treating developer desire lines and breakdown cases not as bugs, but as primary empirical data regarding human-machine encounter.</p>
</section>`);

// 29: COMMITTEE TIMELINE
S.push(`<section>
  <span class="kind">COMMITTEE MILESTONES</span>
  <span class="n">29 / 33</span>
  <h2>Timeline & Defense Roadmap</h2>
  <div class="mach">FALL 2026   ──▶ Proposal Defense & DRIFT Engine Specification
SPRING 2027 ──▶ Deictic Aperture Prototype & Yellow Circle Trials
SUMMER 2027 ──▶ Monograph Drafting: "The Absent Thing"
FALL 2027   ──▶ Final Dissertation Defense & Public Performance</div>
  <p style="margin-top:2vh"><small><b>Evaluation Benchmark:</b> Falsifiability of drift edges, stability of the multimodal deictic validator, and scholarly contribution to HCI and digital media theory.</small></p>
</section>`);

// 30: REVISABILITY
S.push(`<section>
  <span class="kind">EPISTEMIC HUMILITY</span>
  <span class="n">30 / 33</span>
  <h2>The system never says THIS IS A QUERY.</h2>
  <div class="state">currently treated as  <i>QUERY</i>
confidence            provisional
possible drift        { CONVERSATION, PROBE }
drift detected at     turn —</div>
  <p>Game identification stays revisable. Humans joke inside commands, turn questions into tests, use rules ironically, point at things the machine cannot see, and discover what they meant only after the answer arrives. That incompleteness is not a defect in the theory. It is what keeps the game alive.</p>
</section>`);

// 31: INTERFACE FUTURE
S.push(`<section>
  <span class="kind">THE INTERFACE TO COME</span>
  <span class="n">31 / 33</span>
  <h2>What the interface must become</h2>
  <p>Not <i>Enter your prompt…</i></p>
  <div class="big" style="font-size:clamp(22px,4.5vw,52px)">What are we doing with language?</div>
  <p>Choose the game. Make the move. Watch the track change. That is DRIFT: a scene arrives unlabeled, you make the next move, then you mark the turn on which the rules changed. The score is the turn index, not the label.</p>
</section>`);

// 32: MANIFESTO
S.push(`<section class="end">
  <span class="kind">MANIFESTO</span>
  <span class="n">32 / 33</span>
  <h1>I make games in which language acquires consequences.</h1>
  <p>Calling a sentence a prompt gives it nothing. Setting the rules under it—who may speak, what a move is, what the world can veto—is what lets the sentence do work.</p>
  <footer>Watson Hartsoe · Georgia Tech · 2026</footer>
</section>`);

// 33: SOVEREIGN INVARIANT & CLOSING
S.push(`<section class="end">
  <span class="kind">SOVEREIGN INVARIANT</span>
  <span class="n">33 / 33</span>
  <p>The Sovereign Invariant</p>
  <h2>Never ask what the prompt is before asking what game gives those words their force.</h2>
  <p><small>The human chooses the game, language makes the move, the machine answers from inside the field, and no interface gets to confuse the track for the navigator.</small></p>
  <footer>hartswf0.github.io · Doctoral Dissertation Proposal · Georgia Tech · 2026</footer>
</section>`);

// RENDER DECK
const deck = document.getElementById('deck');
deck.innerHTML = S.join('');
const secs = [...deck.children];
let idx = 0;

function go(k) {
  idx = Math.max(0, Math.min(secs.length - 1, k));
  secs[idx].scrollIntoView({ behavior: 'smooth' });
}

addEventListener('keydown', e => {
  if (['ArrowRight', 'ArrowDown', ' ', 'PageDown'].includes(e.key)) {
    e.preventDefault();
    go(idx + 1);
  }
  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
    e.preventDefault();
    go(idx - 1);
  }
  if (e.key === 'c' || e.key === 'C') {
    toggleCite();
  }
});

deck.addEventListener('click', e => {
  if (e.target.closest('#hud-nav') || e.target.closest('#cite-modal')) return;
  if (e.clientX < innerWidth * 0.25) go(idx - 1);
  else go(idx + 1);
});

deck.addEventListener('scroll', () => {
  idx = Math.round(deck.scrollTop / deck.clientHeight);
}, { passive: true });

// READINGS ROTATION
const rs = [...document.querySelectorAll('.readings span')];
let ri = 0;
if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
  setInterval(() => {
    if (rs.length) {
      rs[ri].classList.remove('on');
      ri = (ri + 1) % rs.length;
      rs[ri].classList.add('on');
    }
  }, 1800);
}

// CITATION DRAWER DATA
const CITATIONS = `
<div style="display:flex; flex-direction:column; gap:16px; font-size:0.85em;">
  <div>
    <b>Bolt, Richard A. (1980)</b><br>
    <i>"Put-That-There": Voice and Gesture at the Graphics Interface.</i> ACM SIGGRAPH Computer Graphics 14(3): 262–270.<br>
    <a href="https://dl.acm.org/doi/10.1145/800031.808600" target="_blank" style="color:var(--blue)">doi:10.1145/800031.808600</a>
    <pre>@article{Bolt1980PutThatThere,
  author    = {Richard A. Bolt},
  title     = {``Put-That-There'': Voice and Gesture at the Graphics Interface},
  journal   = {ACM SIGGRAPH Computer Graphics},
  volume    = {14}, number = {3}, pages = {262--270}, year = {1980},
  doi       = {10.1145/800031.808600}
}</pre>
  </div>

  <div>
    <b>Wittgenstein, Ludwig (1953)</b><br>
    <i>Philosophical Investigations.</i> Translated by G. E. M. Anscombe. Oxford: Basil Blackwell (§2, §8, §242).
    <pre>@book{Wittgenstein1953PI,
  author    = {Ludwig Wittgenstein},
  title     = {Philosophical Investigations},
  year      = {1953}, publisher = {Basil Blackwell}
}</pre>
  </div>

  <div>
    <b>Geertz, Clifford (1973)</b><br>
    <i>The Interpretation of Cultures.</i> New York: Basic Books (pp. 6–10, p. 93).
    <pre>@book{Geertz1973Interpretation,
  author    = {Clifford Geertz},
  title     = {The Interpretation of Cultures},
  year      = {1973}, publisher = {Basic Books}
}</pre>
  </div>

  <div>
    <b>Anscombe, G. E. M. (1957)</b><br>
    <i>Intention.</i> Oxford: Basil Blackwell (§32, pp. 56–57).
    <pre>@book{Anscombe1957Intention,
  author    = {G. E. M. Anscombe},
  title     = {Intention},
  year      = {1957}, publisher = {Basil Blackwell}
}</pre>
  </div>

  <div>
    <b>Simon, Herbert A. (1971)</b><br>
    <i>Designing Organizations for an Information-Rich World.</i> In Computers, Communications, and the Public Interest, pp. 37–72.
    <pre>@incollection{Simon1971Designing,
  author    = {Herbert A. Simon},
  title     = {Designing Organizations for an Information-Rich World},
  year      = {1971}, publisher = {Johns Hopkins Press}
}</pre>
  </div>

  <div>
    <b>Ashby, W. Ross (1956)</b><br>
    <i>An Introduction to Cybernetics.</i> London: Chapman & Hall (Law of Requisite Variety).
    <pre>@book{Ashby1956Cybernetics,
  author    = {W. Ross Ashby},
  title     = {An Introduction to Cybernetics},
  year      = {1956}, publisher = {Chapman & Hall}
}</pre>
  </div>

  <div>
    <b>Austin, J. L. (1962)</b><br>
    <i>How to Do Things with Words.</i> Oxford: Clarendon Press.
    <pre>@book{Austin1962HowToDoThings,
  author    = {J. L. Austin},
  title     = {How to Do Things with Words},
  year      = {1962}, publisher = {Clarendon Press}
}</pre>
  </div>
</div>
`;

function toggleCite() {
  const modal = document.getElementById('cite-modal');
  const open = modal.classList.toggle('open');
  if (open) {
    document.getElementById('cite-content').innerHTML = CITATIONS;
  }
}

function closeCite(e) {
  document.getElementById('cite-modal').classList.remove('open');
}
</script>
</body>
</html>
'''
    return html_content

def main():
    html = generate_html()
    
    # Path 1: Root presentation
    p1 = "/Users/gaia/WORLDFUL/dissertation_proposal_presentation.html"
    with open(p1, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Wrote {len(html)} bytes to {p1}")

    # Path 2: In PUT THAT THERE directory
    p2 = "/Users/gaia/WORLDFUL/PUT THAT THERE/dissertation_proposal_presentation.html"
    with open(p2, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Wrote {len(html)} bytes to {p2}")

if __name__ == '__main__':
    main()
