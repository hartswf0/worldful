/* ============================================================================
 * City 06: TAMARA (Chapter I — Cities & Signs 1)
 * Layer: layers/pareidolia_horizon.js
 * Global: window.TamaraPareidoliaHorizon (Standalone Classic JS IIFE)
 *
 * Part A — mountWilderness(containerEl, opts):
 *   The approach before Tamara: dozens of silent, interchangeable woodcut trees
 *   and stones ("trees and stones are only what they are") refusing taxonomic
 *   labels, alongside the 3 rare natural signs:
 *     1. tiger_print — a print in the sand -> the tiger's passage
 *     2. marsh       — a marsh -> announces a vein of water
 *     3. hibiscus    — the hibiscus flower -> announces the end of winter
 *
 * Part B — mountHorizon(containerEl, opts):
 *   Outside Tamara after leaving without having discovered it: a wide low empty
 *   plain stretching to the horizon beneath speeding wind-blown clouds. Wherever
 *   the conditioned gaze lingers, turbulent vapor morphs and snaps into woodcut
 *   silhouettes + rubricated taxonomic callouts of the 3 canonical cloud figures:
 *     1. sailing_ship — keeled hull, tall masts, billowing rigged cloud-sails
 *     2. hand         — open palm, thumb, and four extended cloud-fingers
 *     3. elephant     — domed head, curled trunk, tusks, broad ear, heavy body
 * ============================================================================ */
(function (global) {
  'use strict';

  var PALETTE = Object.freeze({
    vellumGround: '#f3ead8',
    agedRag: '#e6d8be',
    woodblockInk: '#171310',
    rubricVermilion: '#a62c1e',
    giltOchre: '#986d24',
    horizonChalk: '#efe6d2',
    vaporSlate: '#49525c',
    cloudLight: '#f8f2e4'
  });

  var WILDERNESS_SIGNS = Object.freeze([
    Object.freeze({
      id: 'tiger_print',
      index: 1,
      roman: 'I',
      thing: 'A print in the sand',
      signifies: "The tiger's passage",
      shortLabel: 'Tiger Print',
      meaningLabel: "Indicates the tiger's passage",
      rubricTitle: 'SIGNUM I · VESTIGIUM IN ARENA',
      calvinoQuote: "a print in the sand indicates the tiger's passage",
      discourseEntry: "Print in the sand -> sign of the tiger's passage",
      terrainZone: 'Arid sand-wash on the western verge',
      svgX: 252,
      svgY: 392,
      nx: 0.252,
      ny: 0.754
    }),
    Object.freeze({
      id: 'marsh',
      index: 2,
      roman: 'II',
      thing: 'A marsh',
      signifies: 'A vein of water',
      shortLabel: 'Marsh Seep',
      meaningLabel: 'Announces a vein of water',
      rubricTitle: 'SIGNUM II · PALUS AQUAE',
      calvinoQuote: 'a marsh announces a vein of water',
      discourseEntry: 'Marsh -> announces a vein of water',
      terrainZone: 'Reed-grown hollow in the central basin',
      svgX: 504,
      svgY: 334,
      nx: 0.504,
      ny: 0.642
    }),
    Object.freeze({
      id: 'hibiscus',
      index: 3,
      roman: 'III',
      thing: 'The hibiscus flower',
      signifies: 'The end of winter',
      shortLabel: 'Hibiscus Flower',
      meaningLabel: 'Announces the end of winter',
      rubricTitle: 'SIGNUM III · FLOS HIBISCI',
      calvinoQuote: 'the hibiscus flower, the end of winter',
      discourseEntry: 'Hibiscus flower -> announces the end of winter',
      terrainZone: 'Sun-warmed scree along the eastern ridge',
      svgX: 748,
      svgY: 294,
      nx: 0.748,
      ny: 0.565
    })
  ]);

  var MUTE_TREE_APHORISMS = [
    'A tree. Silent and interchangeable — trees and stones are only what they are.',
    'An uninscribed trunk among trunks: it signifies nothing beyond bark and bough.',
    'Mute timber on the approach: the eye passes over it without finding a sign.',
    'Only a tree — refusing emblem, guild, and rubric. It is solely what it is.'
  ];

  var MUTE_STONE_APHORISMS = [
    'A stone. Silent and interchangeable — trees and stones are only what they are.',
    'Mute flint upon the verge: neither decree nor heraldic shield inheres in this rock.',
    'Unmarked boulder: before Tamara, stone remains stone and announces nothing else.',
    'Silent mineral mass — resistant to taxonomy, interchangeable with a thousand stones.'
  ];

  var CLOUD_FIGURES = Object.freeze([
    Object.freeze({
      id: 'sailing_ship',
      index: 1,
      roman: 'I',
      name: 'A Sailing Ship',
      shortLabel: 'Sailing Ship',
      rubricTitle: 'FIGURA I · NAVIS VELIFERA',
      calvinoQuote: 'In the shape that chance and wind give the clouds, you are already intent on recognizing figures: a sailing ship...',
      taxonomyNote: 'Keeled cloud-hull, three tall vapor masts, and billowing woodcut-rigged sails projected onto wind-blown cumulus.',
      anatomyCallouts: Object.freeze([
        Object.freeze({ label: 'BOWSPRIT & PROW', rx: -0.78, ry: 0.16, lx: -0.96, ly: -0.18 }),
        Object.freeze({ label: 'BILLOWING MAINSAIL', rx: 0.02, ry: -0.44, lx: 0.04, ly: -0.92 }),
        Object.freeze({ label: 'KEELED CLOUD-HULL', rx: 0.42, ry: 0.48, lx: 0.76, ly: 0.78 })
      ])
    }),
    Object.freeze({
      id: 'hand',
      index: 2,
      roman: 'II',
      name: 'A Hand',
      shortLabel: 'Open Hand',
      rubricTitle: 'FIGURA II · MANUS EXTENSA',
      calvinoQuote: '...you are already intent on recognizing figures: a sailing ship, a hand...',
      taxonomyNote: 'Open cumulus palm, opposed thumb, and four extended cloud-fingers articulated out of drifting sky-vapor.',
      anatomyCallouts: Object.freeze([
        Object.freeze({ label: 'ABDUCTED THUMB', rx: -0.66, ry: 0.04, lx: -0.96, ly: -0.24 }),
        Object.freeze({ label: 'FOUR EXTENDED DIGITS', rx: 0.12, ry: -0.68, lx: 0.34, ly: -0.96 }),
        Object.freeze({ label: 'OPEN VAPOR PALM', rx: 0.08, ry: 0.28, lx: 0.68, ly: 0.74 })
      ])
    }),
    Object.freeze({
      id: 'elephant',
      index: 3,
      roman: 'III',
      name: 'An Elephant',
      shortLabel: 'Elephant',
      rubricTitle: 'FIGURA III · ELEPHAS NUBIUM',
      calvinoQuote: '...you are already intent on recognizing figures: a sailing ship, a hand, an elephant...',
      taxonomyNote: 'Domed cranial billow, upward-curled trunk, gleaming cloud-tusks, broad ear-fan, and heavy columnar cloud-body.',
      anatomyCallouts: Object.freeze([
        Object.freeze({ label: 'CURLED TRUNK & TUSKS', rx: -0.74, ry: -0.12, lx: -0.96, ly: -0.68 }),
        Object.freeze({ label: 'BROAD EAR-FAN', rx: -0.16, ry: -0.24, lx: -0.14, ly: -0.88 }),
        Object.freeze({ label: 'HEAVY CLOUD-BODY', rx: 0.38, ry: 0.04, lx: 0.76, ly: 0.74 })
      ])
    })
  ]);

  /* --------------------------------------------------------------------------
   * Shared Utilities & Deterministic PRNG
   * -------------------------------------------------------------------------- */
  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function clamp01(v) {
    var n = Number(v);
    if (!isFinite(n)) return 0;
    return n < 0 ? 0 : n > 1 ? 1 : n;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(t) {
    var x = clamp01(t);
    return x * x * (3 - 2 * x);
  }

  function createSeededRng(seed) {
    var s = (seed >>> 0) || 1;
    return function () {
      s = (s + 0x6d2b79f5) | 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function detectReducedMotion(explicitOpt) {
    if (typeof explicitOpt === 'boolean') return explicitOpt;
    try {
      if (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return true;
      }
    } catch (_err) {
      /* ignore matchMedia errors */
    }
    return false;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function cloneSign(s) {
    return {
      id: s.id,
      index: s.index,
      roman: s.roman,
      thing: s.thing,
      signifies: s.signifies,
      shortLabel: s.shortLabel,
      meaningLabel: s.meaningLabel,
      rubricTitle: s.rubricTitle,
      calvinoQuote: s.calvinoQuote,
      discourseEntry: s.discourseEntry,
      terrainZone: s.terrainZone,
      nx: s.nx,
      ny: s.ny
    };
  }

  function cloneFigure(f, extra) {
    var out = {
      id: f.id,
      index: f.index,
      roman: f.roman,
      name: f.name,
      shortLabel: f.shortLabel,
      rubricTitle: f.rubricTitle,
      calvinoQuote: f.calvinoQuote,
      taxonomyNote: f.taxonomyNote,
      anatomyCallouts: f.anatomyCallouts.map(function (c) {
        return { label: c.label, rx: c.rx, ry: c.ry, lx: c.lx, ly: c.ly };
      })
    };
    if (extra) {
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) {
          out[k] = extra[k];
        }
      }
    }
    return out;
  }

  /* --------------------------------------------------------------------------
   * Shared Xylographic Style Sheet Injection (exclusively xylo- / tmr- rules)
   * -------------------------------------------------------------------------- */
  var STYLE_ID = 'xylo-pareidolia-horizon-styles';

  function ensureStylesInjected() {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) return;
    var styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.textContent = [
      'xylo-wilderness-plate, xylo-horizon-plate {',
      '  display: flex;',
      '  flex-direction: column;',
      '  width: 100%;',
      '  height: 100%;',
      '  min-height: 280px;',
      '  box-sizing: border-box;',
      '  background: #f3ead8;',
      '  color: #171310;',
      '  font-family: "Palatino Linotype", "Book Antiqua", Baskerville, Georgia, serif;',
      '  border: 2px solid #171310;',
      '  box-shadow: inset 0 0 0 2px #f3ead8, inset 0 0 0 3px #171310;',
      '  position: relative;',
      '  overflow: hidden;',
      '  user-select: none;',
      '  -webkit-user-select: none;',
      '}',
      'xylo-verge-rubric-strip, xylo-sky-rubric-strip {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 8px;',
      '  padding: 5px 10px;',
      '  background: #e6d8be;',
      '  border-bottom: 1.5px solid #171310;',
      '  font-size: clamp(10px, 1.15vw, 12.5px);',
      '  letter-spacing: 0.06em;',
      '  line-height: 1.25;',
      '  flex: 0 0 auto;',
      '  flex-wrap: wrap;',
      '}',
      '.xylo-rubric-kicker {',
      '  color: #a62c1e;',
      '  font-weight: 700;',
      '  text-transform: uppercase;',
      '  letter-spacing: 0.09em;',
      '}',
      '.xylo-rubric-subnote {',
      '  color: #49525c;',
      '  font-style: italic;',
      '  font-size: 0.94em;',
      '}',
      'xylo-terrain-engraving, xylo-sky-engraving {',
      '  position: relative;',
      '  flex: 1 1 auto;',
      '  min-height: 180px;',
      '  width: 100%;',
      '  overflow: hidden;',
      '  background: #f3ead8;',
      '}',
      '.xylo-wilderness-svg {',
      '  display: block;',
      '  width: 100%;',
      '  height: 100%;',
      '  touch-action: manipulation;',
      '}',
      '.xylo-mute-entity {',
      '  cursor: crosshair;',
      '  transition: opacity 140ms ease;',
      '}',
      '.xylo-mute-entity:hover {',
      '  opacity: 0.82;',
      '}',
      '.xylo-sign-node {',
      '  cursor: pointer;',
      '  outline: none;',
      '}',
      '.xylo-sign-node:focus-visible .xylo-sign-focus-halo,',
      '.xylo-sign-node[data-focused="true"] .xylo-sign-focus-halo {',
      '  opacity: 1;',
      '}',
      '.xylo-sign-focus-halo {',
      '  opacity: 0;',
      '  transition: opacity 160ms ease;',
      '}',
      '.xylo-gate-bastion {',
      '  cursor: pointer;',
      '  outline: none;',
      '}',
      'xylo-verge-whisper-banner, xylo-callout-placard {',
      '  position: absolute;',
      '  left: 10px;',
      '  right: 10px;',
      '  bottom: 8px;',
      '  pointer-events: none;',
      '  display: flex;',
      '  align-items: baseline;',
      '  justify-content: space-between;',
      '  gap: 8px;',
      '  padding: 5px 10px;',
      '  background: rgba(243, 234, 216, 0.93);',
      '  border: 1px solid #171310;',
      '  box-shadow: 2px 2px 0 rgba(23, 19, 16, 0.18);',
      '  font-size: clamp(11px, 1.2vw, 13px);',
      '  line-height: 1.3;',
      '}',
      'xylo-verge-whisper-banner[data-tone="sign"], xylo-callout-placard[data-tone="crystallized"] {',
      '  border-color: #a62c1e;',
      '  box-shadow: 2px 2px 0 rgba(166, 44, 30, 0.24);',
      '}',
      '.xylo-whisper-tag {',
      '  color: #49525c;',
      '  font-weight: 700;',
      '  font-size: 0.86em;',
      '  letter-spacing: 0.08em;',
      '  text-transform: uppercase;',
      '  white-space: nowrap;',
      '}',
      'xylo-verge-whisper-banner[data-tone="sign"] .xylo-whisper-tag,',
      'xylo-callout-placard[data-tone="crystallized"] .xylo-whisper-tag {',
      '  color: #a62c1e;',
      '}',
      '.xylo-whisper-body {',
      '  flex: 1 1 auto;',
      '  color: #171310;',
      '}',
      'xylo-verge-hud, xylo-augury-hud {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  flex-wrap: wrap;',
      '  gap: 6px 8px;',
      '  padding: 6px 10px;',
      '  background: #e6d8be;',
      '  border-top: 1.5px solid #171310;',
      '  flex: 0 0 auto;',
      '  font-size: clamp(10.5px, 1.1vw, 12.5px);',
      '}',
      'xylo-sign-seal-row, xylo-figure-seal-row {',
      '  display: flex;',
      '  align-items: center;',
      '  flex-wrap: wrap;',
      '  gap: 5px;',
      '}',
      '.xylo-seal-pill, .xylo-figure-pill, .xylo-scan-trigger, .xylo-threshold-trigger {',
      '  appearance: none;',
      '  -webkit-appearance: none;',
      '  font-family: inherit;',
      '  font-size: clamp(10px, 1.05vw, 12px);',
      '  line-height: 1.2;',
      '  padding: 4px 8px;',
      '  border: 1px solid #171310;',
      '  background: #f3ead8;',
      '  color: #171310;',
      '  cursor: pointer;',
      '  letter-spacing: 0.03em;',
      '  transition: background 120ms ease, color 120ms ease, border-color 120ms ease;',
      '}',
      '.xylo-seal-pill:hover, .xylo-figure-pill:hover, .xylo-scan-trigger:hover {',
      '  background: #efe6d2;',
      '  border-color: #a62c1e;',
      '}',
      '.xylo-seal-pill[data-found="true"], .xylo-figure-pill[data-found="true"] {',
      '  background: #a62c1e;',
      '  color: #f3ead8;',
      '  border-color: #171310;',
      '  font-weight: 600;',
      '}',
      '.xylo-figure-pill[data-active="true"] {',
      '  box-shadow: inset 0 0 0 1.5px #f3ead8, 0 0 0 1.5px #986d24;',
      '}',
      '.xylo-threshold-trigger {',
      '  background: #e6d8be;',
      '  color: #49525c;',
      '  border-style: dashed;',
      '}',
      '.xylo-threshold-trigger[data-unlocked="true"] {',
      '  background: #a62c1e;',
      '  color: #f3ead8;',
      '  border-style: solid;',
      '  border-color: #171310;',
      '  font-weight: 700;',
      '  box-shadow: 2px 2px 0 #171310;',
      '}',
      '.xylo-horizon-canvas {',
      '  display: block;',
      '  width: 100%;',
      '  height: 100%;',
      '  cursor: crosshair;',
      '  touch-action: none;',
      '}',
      'xylo-horizon-plate:focus-visible {',
      '  outline: 2px solid #a62c1e;',
      '  outline-offset: -4px;',
      '}',
      '.xylo-saturation-readout {',
      '  display: inline-flex;',
      '  align-items: center;',
      '  gap: 6px;',
      '  color: #171310;',
      '  font-size: 0.92em;',
      '}',
      '.xylo-saturation-bar {',
      '  display: inline-block;',
      '  width: 58px;',
      '  height: 7px;',
      '  border: 1px solid #171310;',
      '  background: #f3ead8;',
      '  position: relative;',
      '  overflow: hidden;',
      '}',
      '.xylo-saturation-fill {',
      '  display: block;',
      '  height: 100%;',
      '  background: #a62c1e;',
      '}',
      '@keyframes xyloPulseRing {',
      '  0%, 100% { transform: scale(1); opacity: 0.72; }',
      '  50% { transform: scale(1.09); opacity: 1; }',
      '}',
      'xylo-wilderness-plate[data-reduced-motion="false"] .xylo-sign-glint {',
      '  transform-box: fill-box;',
      '  transform-origin: center;',
      '  animation: xyloPulseRing 3.1s ease-in-out infinite;',
      '}',
      '@media (max-width: 640px) {',
      '  .xylo-rubric-subnote { display: none; }',
      '  xylo-verge-whisper-banner, xylo-callout-placard {',
      '    left: 6px; right: 6px; bottom: 5px; padding: 4px 7px;',
      '    flex-direction: column; gap: 2px;',
      '  }',
      '  xylo-verge-hud, xylo-augury-hud { padding: 5px 7px; gap: 4px 6px; }',
      '  .xylo-seal-pill, .xylo-figure-pill, .xylo-scan-trigger, .xylo-threshold-trigger {',
      '    padding: 3px 6px;',
      '  }',
      '}'
    ].join('\n');
    document.head.appendChild(styleEl);
  }

  /* ==========================================================================
   * PART A — mountWilderness(containerEl, opts)
   * ========================================================================== */
  function generateMuteTerrainEntities() {
    var rng = createSeededRng(601972);
    var entities = [];
    var rowBands = [
      { yMin: 162, yMax: 205, count: 9 },
      { yMin: 215, yMax: 272, count: 10 },
      { yMin: 282, yMax: 348, count: 10 },
      { yMin: 358, yMax: 422, count: 9 },
      { yMin: 430, yMax: 468, count: 8 }
    ];

    var bIdx = 0;
    for (var b = 0; b < rowBands.length; b++) {
      var band = rowBands[b];
      var attempts = 0;
      var placed = 0;
      while (placed < band.count && attempts < 90) {
        attempts++;
        var x = 76 + rng() * 848;
        var y = band.yMin + rng() * (band.yMax - band.yMin);

        // Keep central approach path & gate clear
        var pathCenter = 500 + Math.sin((y - 120) * 0.017) * 34;
        if (Math.abs(x - pathCenter) < 38) continue;
        if (Math.hypot(x - 500, y - 108) < 105) continue;

        // Keep generous clearance around the 3 natural signs
        var nearSign = false;
        for (var s = 0; s < WILDERNESS_SIGNS.length; s++) {
          var sg = WILDERNESS_SIGNS[s];
          if (Math.hypot(x - sg.svgX, y - sg.svgY) < 74) {
            nearSign = true;
            break;
          }
        }
        if (nearSign) continue;

        // Keep reasonable spacing from already placed mute trees & stones
        var crowded = false;
        for (var e = 0; e < entities.length; e++) {
          if (Math.hypot(x - entities[e].x, y - entities[e].y) < 52) {
            crowded = true;
            break;
          }
        }
        if (crowded) continue;

        var kind = (rng() < 0.54) ? 'tree' : 'stone';
        var variant = Math.floor(rng() * 3);
        var scale = Number((0.56 + ((y - 150) / 335) * 0.58).toFixed(2));
        entities.push({
          id: 'mute_' + kind + '_' + (++bIdx),
          kind: kind,
          variant: variant,
          x: Math.round(x),
          y: Math.round(y),
          scale: scale
        });
        placed++;
      }
    }

    entities.sort(function (a, b2) { return a.y - b2.y; });
    return entities;
  }

  function renderMuteEntitySvg(ent) {
    var inner = '';
    if (ent.kind === 'tree') {
      if (ent.variant === 0) {
        // Woodcut cypress spindle with fine horizontal nib hatching
        inner = [
          '<path d="M-12,2 L12,2 M-8,4 L9,4" stroke="#171310" stroke-width="1.1" stroke-linecap="round"/>',
          '<path d="M-2,2 L-1,-11 L1,-11 L2,2 Z" fill="#171310"/>',
          '<path d="M0,-44 C-8,-33 -11,-20 -9,-9 C-6,-5 6,-5 9,-9 C11,-20 8,-33 0,-44 Z" fill="#f3ead8" stroke="#171310" stroke-width="1.5"/>',
          '<path d="M-5,-31 L5,-31 M-7,-26 L7,-26 M-8,-21 L8,-21 M-8,-16 L8,-16 M-6,-11 L6,-11" stroke="#171310" stroke-width="1.05"/>'
        ].join('');
      } else if (ent.variant === 1) {
        // Gnarled scrub oak with woodblock hatched foliage crown
        inner = [
          '<path d="M-13,2 L13,2" stroke="#171310" stroke-width="1.15" stroke-linecap="round"/>',
          '<path d="M-2.5,2 C-2,-5 -4,-9 -7,-13 M2,2 C1.5,-5 4,-9 7,-13 M0,2 L0,-14" stroke="#171310" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
          '<path d="M-15,-15 C-18,-23 -11,-31 -3,-30 C1,-35 11,-33 13,-26 C18,-22 16,-13 9,-12 L-11,-12 C-14,-12 -15,-13 -15,-15 Z" fill="#f3ead8" stroke="#171310" stroke-width="1.45"/>',
          '<path d="M-11,-22 L9,-22 M-13,-18 L12,-18 M-8,-26 L7,-26 M-10,-15 L10,-15" stroke="#171310" stroke-width="0.95"/>'
        ].join('');
      } else {
        // Tiered mountain pine
        inner = [
          '<path d="M-10,2 L11,2" stroke="#171310" stroke-width="1.1"/>',
          '<path d="M0,2 L0,-36" stroke="#171310" stroke-width="1.9"/>',
          '<path d="M0,-38 L-9,-26 L9,-26 Z" fill="#f3ead8" stroke="#171310" stroke-width="1.35"/>',
          '<path d="M0,-29 L-12,-16 L12,-16 Z" fill="#f3ead8" stroke="#171310" stroke-width="1.35"/>',
          '<path d="M0,-20 L-14,-7 L14,-7 Z" fill="#f3ead8" stroke="#171310" stroke-width="1.35"/>',
          '<path d="M-7,-10 L8,-10 M-6,-19 L6,-19 M-4,-28 L4,-28" stroke="#171310" stroke-width="0.9"/>'
        ].join('');
      }
    } else {
      if (ent.variant === 0) {
        // Faceted limestone boulder with shaded flank
        inner = [
          '<path d="M-17,2 L18,2 M-12,4.5 L14,4.5" stroke="#171310" stroke-width="1.1" stroke-linecap="round"/>',
          '<polygon points="-14,2 -11,-11 -1,-16 11,-12 15,2" fill="#f3ead8" stroke="#171310" stroke-width="1.45" stroke-linejoin="round"/>',
          '<path d="M-1,-16 L2,2 M3,-11 L11,-1 M1,-7 L12,1 M1,-3 L8,2" stroke="#171310" stroke-width="0.95"/>'
        ].join('');
      } else if (ent.variant === 1) {
        // Paired cleft cobbles
        inner = [
          '<path d="M-18,2 L17,2" stroke="#171310" stroke-width="1.15"/>',
          '<path d="M-15,2 C-16,-8 -8,-13 -1,-11 C4,-10 6,-4 6,2 Z" fill="#f3ead8" stroke="#171310" stroke-width="1.4"/>',
          '<path d="M2,2 C2,-5 8,-9 13,-7 C16,-5 16,-1 15,2 Z" fill="#e6d8be" stroke="#171310" stroke-width="1.35"/>',
          '<path d="M-12,-4 L2,-4 M-13,-1 L4,-1 M5,-3 L13,-3" stroke="#171310" stroke-width="0.85"/>'
        ].join('');
      } else {
        // Upright weathered slab
        inner = [
          '<path d="M-14,2 L15,2" stroke="#171310" stroke-width="1.1"/>',
          '<polygon points="-10,2 -8,-18 2,-21 9,-13 11,2" fill="#f3ead8" stroke="#171310" stroke-width="1.45" stroke-linejoin="round"/>',
          '<path d="M2,-21 L3,2 M3,-15 L9,-9 M3,-10 L10,-4 M3,-5 L10,0" stroke="#171310" stroke-width="0.9"/>'
        ].join('');
      }
    }

    return [
      '<g class="xylo-mute-entity" data-mute-id="', ent.id, '" data-mute-kind="', ent.kind, '" transform="translate(', ent.x, ',', ent.y, ') scale(', ent.scale, ')">',
      '<circle class="xylo-mute-ring" cx="0" cy="-12" r="21" fill="none" stroke="#49525c" stroke-width="1.2" stroke-dasharray="3 3" opacity="0"/>',
      inner,
      '<rect x="-20" y="-42" width="40" height="48" fill="transparent"/>',
      '</g>'
    ].join('');
  }

  function renderWildernessSignSvg(sign) {
    var artwork = '';
    if (sign.id === 'tiger_print') {
      artwork = [
        '<!-- Stippled sand basin -->',
        '<ellipse cx="0" cy="3" rx="37" ry="22" fill="#efe6d2" stroke="#171310" stroke-width="1.2" stroke-dasharray="5 3"/>',
        '<path d="M-28,10 Q-10,16 14,12 Q26,10 32,6 M-25,-7 Q-4,-12 22,-8" fill="none" stroke="#986d24" stroke-width="0.9" opacity="0.75"/>',
        '<!-- Tri-lobed feline plantar pad + 4 toe impressions + claw pricks -->',
        '<path d="M-9,5 C-11,-1 -5,-5 0,-4 C5,-5 11,-1 9,5 C10,11 5,14 2,12 C0,14 -2,14 -4,12 C-8,14 -10,10 -9,5 Z" fill="#171310"/>',
        '<ellipse cx="-13" cy="-6" rx="4.2" ry="5.6" transform="rotate(-24 -13 -6)" fill="#171310"/>',
        '<ellipse cx="-4.5" cy="-11.5" rx="4.1" ry="5.8" transform="rotate(-8 -4.5 -11.5)" fill="#171310"/>',
        '<ellipse cx="5" cy="-11.5" rx="4.1" ry="5.8" transform="rotate(9 5 -11.5)" fill="#171310"/>',
        '<ellipse cx="13.5" cy="-5.5" rx="4.2" ry="5.5" transform="rotate(25 13.5 -5.5)" fill="#171310"/>',
        '<path d="M-17,-13 L-19,-17 M-5.5,-19 L-6,-23.5 M6,-19 L6.8,-23.5 M17.5,-12.5 L19.8,-16.5" stroke="#a62c1e" stroke-width="1.5" stroke-linecap="round"/>'
      ].join('');
    } else if (sign.id === 'marsh') {
      artwork = [
        '<!-- Water seep basin & concentric reflection hatching -->',
        '<ellipse cx="0" cy="8" rx="39" ry="17" fill="#e6d8be" stroke="#171310" stroke-width="1.25"/>',
        '<ellipse cx="0" cy="9" rx="27" ry="10" fill="none" stroke="#49525c" stroke-width="1.05" stroke-dasharray="6 3"/>',
        '<path d="M-24,7 L24,7 M-18,12 L19,12 M-14,4 L15,4" stroke="#171310" stroke-width="0.9"/>',
        '<!-- Cattails & marsh sedge stalks -->',
        '<path d="M-14,8 Q-17,-10 -21,-26 M-6,9 L-6,-31 M3,9 Q5,-11 8,-29 M13,8 Q17,-7 22,-22 M-2,9 Q-11,-5 -15,-17" fill="none" stroke="#171310" stroke-width="1.45" stroke-linecap="round"/>',
        '<!-- Velvety woodcut cattail spadices -->',
        '<rect x="-8.4" y="-26" width="4.8" height="13" rx="2.3" fill="#171310"/>',
        '<rect x="4.6" y="-24" width="4.6" height="12" rx="2.2" transform="rotate(7 7 -18)" fill="#a62c1e" stroke="#171310" stroke-width="0.9"/>',
        '<rect x="-20.8" y="-22" width="4.2" height="10.5" rx="2" transform="rotate(-11 -18.5 -17)" fill="#171310"/>'
      ].join('');
    } else {
      artwork = [
        '<!-- Sun-warmed scree base & woody hibiscus stem -->',
        '<path d="M-24,14 L24,14 M-16,17 L17,17" stroke="#171310" stroke-width="1.15" stroke-linecap="round"/>',
        '<path d="M-3,14 Q-1,3 0,-7" fill="none" stroke="#171310" stroke-width="2" stroke-linecap="round"/>',
        '<path d="M-1,7 C-12,7 -18,2 -19,-4 C-11,-5 -5,-1 -1,5 Z" fill="#e6d8be" stroke="#171310" stroke-width="1.25"/>',
        '<path d="M1,5 C11,5 17,0 18,-6 C10,-6 4,-2 1,4 Z" fill="#e6d8be" stroke="#171310" stroke-width="1.25"/>',
        '<!-- Five-petaled crimson & vellum woodcut hibiscus corolla -->',
        '<g transform="translate(0,-13)">',
        '  <path d="M0,0 C-9,-16 -2,-23 0,-22 C2,-23 9,-16 0,0 Z" fill="#a62c1e" stroke="#171310" stroke-width="1.25"/>',
        '  <path d="M0,0 C-9,-16 -2,-23 0,-22 C2,-23 9,-16 0,0 Z" transform="rotate(72)" fill="#a62c1e" stroke="#171310" stroke-width="1.25"/>',
        '  <path d="M0,0 C-9,-16 -2,-23 0,-22 C2,-23 9,-16 0,0 Z" transform="rotate(144)" fill="#a62c1e" stroke="#171310" stroke-width="1.25"/>',
        '  <path d="M0,0 C-9,-16 -2,-23 0,-22 C2,-23 9,-16 0,0 Z" transform="rotate(216)" fill="#a62c1e" stroke="#171310" stroke-width="1.25"/>',
        '  <path d="M0,0 C-9,-16 -2,-23 0,-22 C2,-23 9,-16 0,0 Z" transform="rotate(288)" fill="#a62c1e" stroke="#171310" stroke-width="1.25"/>',
        '  <circle cx="0" cy="0" r="4.2" fill="#171310"/>',
        '  <path d="M0,0 Q7,-11 15,-18" fill="none" stroke="#f3ead8" stroke-width="2.1" stroke-linecap="round"/>',
        '  <path d="M0,0 Q7,-11 15,-18" fill="none" stroke="#986d24" stroke-width="1.2" stroke-linecap="round"/>',
        '  <circle cx="16" cy="-19" r="2.2" fill="#f3ead8" stroke="#171310" stroke-width="0.9"/>',
        '  <circle cx="13" cy="-19.8" r="1.7" fill="#986d24"/>',
        '  <circle cx="16.8" cy="-15.8" r="1.7" fill="#986d24"/>',
        '</g>'
      ].join('');
    }

    return [
      '<g class="xylo-sign-node" tabindex="0" role="button"',
      ' data-sign-id="', sign.id, '" data-found="false" data-focused="false"',
      ' aria-label="', escapeHtml(sign.thing + ' — ' + sign.meaningLabel), '"',
      ' transform="translate(', sign.svgX, ',', sign.svgY, ')">',
      '  <!-- Subtle unfound gilt glint -->',
      '  <circle class="xylo-sign-glint" cx="0" cy="-3" r="34" fill="none" stroke="#986d24" stroke-width="1.15" stroke-dasharray="4 5" opacity="0.68"/>',
      '  <!-- Focus sighting reticle -->',
      '  <g class="xylo-sign-focus-halo">',
      '    <circle cx="0" cy="-3" r="42" fill="none" stroke="#986d24" stroke-width="1.8" stroke-dasharray="7 4"/>',
      '    <path d="M-48,-3 L-38,-3 M38,-3 L48,-3 M0,-51 L0,-41 M0,35 L0,45" stroke="#a62c1e" stroke-width="1.8"/>',
      '  </g>',
      '  <!-- Vermilion taxonomic seal (revealed upon recognition) -->',
      '  <g class="xylo-sign-rubric-seal" opacity="0">',
      '    <circle cx="0" cy="-3" r="38" fill="rgba(166,44,30,0.08)" stroke="#a62c1e" stroke-width="2"/>',
      '    <circle cx="0" cy="-3" r="41.5" fill="none" stroke="#171310" stroke-width="0.8"/>',
      '    <rect x="-78" y="-60" width="156" height="19" rx="1" fill="#f3ead8" stroke="#a62c1e" stroke-width="1.4"/>',
      '    <text x="0" y="-47" text-anchor="middle" fill="#a62c1e" font-size="9.5" font-weight="700" letter-spacing="0.7">',
      escapeHtml('SIGNUM ' + sign.roman + ' · ' + sign.signifies.toUpperCase()),
      '    </text>',
      '  </g>',
      artwork,
      '  <circle cx="0" cy="-3" r="44" fill="transparent"/>',
      '</g>'
    ].join('');
  }

  function buildWildernessSvgMarkup(muteEntities) {
    var muteSvg = muteEntities.map(renderMuteEntitySvg).join('\n');
    var signsSvg = WILDERNESS_SIGNS.map(renderWildernessSignSvg).join('\n');

    return [
      '<svg class="xylo-wilderness-svg" viewBox="0 0 1000 520" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Woodcut wilderness approach before Tamara">',
      '  <defs>',
      '    <pattern id="xylo-sky-ruling" width="24" height="7" patternUnits="userSpaceOnUse">',
      '      <line x1="0" y1="2" x2="24" y2="2" stroke="#171310" stroke-width="0.55" opacity="0.28"/>',
      '    </pattern>',
      '    <pattern id="xylo-hill-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">',
      '      <line x1="0" y1="0" x2="0" y2="8" stroke="#171310" stroke-width="0.65" opacity="0.22"/>',
      '    </pattern>',
      '  </defs>',
      '  <!-- Warm vellum sky & upper engraving ruling -->',
      '  <rect x="0" y="0" width="1000" height="520" fill="#f3ead8"/>',
      '  <rect x="14" y="12" width="972" height="118" fill="url(#xylo-sky-ruling)"/>',
      '',
      '  <!-- Distant mountain ridges & walled silhouette of Tamara -->',
      '  <path d="M14,148 Q165,118 330,138 T675,134 T986,146 L986,195 L14,195 Z" fill="#efe6d2" stroke="#171310" stroke-width="1.3"/>',
      '  <path d="M14,158 Q180,136 365,152 T710,148 T986,162" fill="none" stroke="#171310" stroke-width="0.85" stroke-dasharray="8 4"/>',
      '',
      '  <!-- Distant Walled Gate of Tamara (Porta Tamarae) -->',
      '  <g class="xylo-gate-bastion" tabindex="0" role="button" data-unlocked="false" aria-label="Distant Gate of Tamara" transform="translate(500, 118)">',
      '    <!-- Bristling distant sign-towers & cantilevers -->',
      '    <path d="M-86,16 L-86,-12 L-72,-12 L-72,16 M-58,16 L-58,-24 L-40,-24 L-40,16 M40,16 L40,-26 L58,-26 L58,16 M72,16 L72,-13 L86,-13 L86,16" fill="#e6d8be" stroke="#171310" stroke-width="1.35"/>',
      '    <!-- Tiny jutting signboards foreshadowing the city of signs -->',
      '    <path d="M-58,-18 L-71,-18 M-40,-14 L-28,-14 M58,-19 L72,-19 M40,-13 L28,-13 M-49,-24 L-49,-36 M49,-26 L49,-39" stroke="#171310" stroke-width="1.2"/>',
      '    <rect x="-73" y="-17" width="6" height="5" fill="#a62c1e"/>',
      '    <rect x="67" y="-18" width="6" height="5" fill="#986d24"/>',
      '    <!-- Central Gatehouse Bastion -->',
      '    <path d="M-38,18 L-38,-20 L-28,-20 L-28,-27 L-18,-27 L-18,-20 L-6,-20 L-6,-28 L6,-28 L6,-20 L18,-20 L18,-27 L28,-27 L28,-20 L38,-20 L38,18 Z" fill="#e6d8be" stroke="#171310" stroke-width="1.65"/>',
      '    <!-- Gate Archway -->',
      '    <path class="xylo-gate-arch-fill" d="M-14,18 L-14,-2 A14,14 0 0,1 14,-2 L14,18 Z" fill="#171310"/>',
      '    <!-- Iron Portcullis (lifts when 3 signs recognized) -->',
      '    <g class="xylo-gate-portcullis">',
      '      <path d="M-9,18 L-9,-8 M-3,18 L-3,-12 M3,18 L3,-12 M9,18 L9,-8 M-13,2 L13,2 M-13,9 L13,9" stroke="#f3ead8" stroke-width="1.05"/>',
      '    </g>',
      '    <!-- Gate Rubric Banner -->',
      '    <rect class="xylo-gate-banner-bg" x="-92" y="-53" width="184" height="17" rx="1" fill="#f3ead8" stroke="#171310" stroke-width="1.2"/>',
      '    <text class="xylo-gate-banner-text" x="0" y="-41" text-anchor="middle" fill="#49525c" font-size="9.2" font-weight="700" letter-spacing="0.8">PORTA TAMARAE · 0/3 SIGNS</text>',
      '  </g>',
      '',
      '  <!-- Rolling woodcut terrain contours -->',
      '  <path d="M14,192 Q260,170 500,186 T986,184 L986,508 L14,508 Z" fill="#f3ead8" stroke="#171310" stroke-width="1.2"/>',
      '  <path d="M14,254 Q230,232 490,252 T986,244" fill="none" stroke="#171310" stroke-width="1.05"/>',
      '  <path d="M14,330 Q290,304 560,326 T986,314" fill="none" stroke="#171310" stroke-width="1.1"/>',
      '  <path d="M14,418 Q245,394 525,414 T986,402" fill="none" stroke="#171310" stroke-width="1.15"/>',
      '  <ellipse cx="195" cy="235" rx="110" ry="16" fill="url(#xylo-hill-hatch)"/>',
      '  <ellipse cx="815" cy="225" rx="125" ry="17" fill="url(#xylo-hill-hatch)"/>',
      '',
      '  <!-- Winding footpath toward Tamara -->',
      '  <path d="M482,506 C462,452 528,398 504,344 C484,296 520,242 503,194 C497,172 500,150 500,136" fill="none" stroke="#171310" stroke-width="12" opacity="0.07" stroke-linecap="round"/>',
      '  <path d="M475,506 C455,452 521,398 498,344 C478,296 514,242 498,194 L496,136 M489,506 C469,452 535,398 510,344 C490,296 526,242 508,194 L504,136" fill="none" stroke="#171310" stroke-width="0.95" stroke-dasharray="4 5"/>',
      '',
      '  <!-- Dozens of silent, interchangeable trees & stones -->',
      muteSvg,
      '',
      '  <!-- The 3 rare natural signs -->',
      signsSvg,
      '',
      '  <!-- Double-ruled xylographic plate border -->',
      '  <rect x="8" y="8" width="984" height="504" fill="none" stroke="#171310" stroke-width="2.2"/>',
      '  <rect x="13" y="13" width="974" height="494" fill="none" stroke="#171310" stroke-width="0.8"/>',
      '</svg>'
    ].join('\n');
  }

  function mountWilderness(containerEl, opts) {
    if (!containerEl) {
      throw new Error('TamaraPareidoliaHorizon.mountWilderness requires a container element.');
    }
    ensureStylesInjected();

    var options = opts || {};
    var reducedMotion = detectReducedMotion(options.reducedMotion);
    var discoveredSet = new Set();
    if (options.initialDiscovered) {
      Array.from(options.initialDiscovered).forEach(function (id) {
        if (WILDERNESS_SIGNS.some(function (s) { return s.id === id; })) {
          discoveredSet.add(id);
        }
      });
    }

    var focusedSignId = null;
    var muteProbesCount = 0;
    var destroyed = false;
    var muteRingTimer = null;
    var muteEntities = generateMuteTerrainEntities();

    containerEl.innerHTML = [
      '<xylo-wilderness-plate data-reduced-motion="', String(reducedMotion), '">',
      '  <xylo-verge-rubric-strip>',
      '    <xylo-rubric-kicker class="xylo-rubric-kicker">¶ TABULA I · SYLVA ET LAPIDES ANTE TAMARAM</xylo-rubric-kicker>',
      '    <xylo-rubric-subnote class="xylo-rubric-subnote">“Trees and stones are only what they are — rarely does the eye light on a sign.”</xylo-rubric-subnote>',
      '  </xylo-verge-rubric-strip>',
      '  <xylo-terrain-engraving>',
      buildWildernessSvgMarkup(muteEntities),
      '    <xylo-verge-whisper-banner data-tone="mute">',
      '      <xylo-whisper-tag class="xylo-whisper-tag">APPROACH</xylo-whisper-tag>',
      '      <xylo-whisper-body class="xylo-whisper-body">You walk for days among silent trees and stones. Seek the three things recognized as signs of another thing.</xylo-whisper-body>',
      '    </xylo-verge-whisper-banner>',
      '  </xylo-terrain-engraving>',
      '  <xylo-verge-hud>',
      '    <xylo-sign-seal-row>',
      WILDERNESS_SIGNS.map(function (s) {
        return '<button type="button" class="xylo-seal-pill" data-pill-sign="' + s.id + '" data-found="false">' +
          escapeHtml(s.roman + ' · ' + s.shortLabel) +
          '</button>';
      }).join(''),
      '      <button type="button" class="xylo-scan-trigger" title="Recognize next natural sign on the verge">Scan Verge</button>',
      '    </xylo-sign-seal-row>',
      '    <button type="button" class="xylo-threshold-trigger" data-unlocked="false">Gate Sealed (0/3 Signs)</button>',
      '  </xylo-verge-hud>',
      '</xylo-wilderness-plate>'
    ].join('');

    var plateEl = containerEl.querySelector('xylo-wilderness-plate');
    var stageEl = containerEl.querySelector('xylo-terrain-engraving');
    var svgEl = containerEl.querySelector('.xylo-wilderness-svg');
    var whisperBanner = containerEl.querySelector('xylo-verge-whisper-banner');
    var whisperTag = containerEl.querySelector('.xylo-whisper-tag');
    var whisperBody = containerEl.querySelector('.xylo-whisper-body');
    var gateEl = containerEl.querySelector('.xylo-gate-bastion');
    var gateBannerBg = containerEl.querySelector('.xylo-gate-banner-bg');
    var gateBannerText = containerEl.querySelector('.xylo-gate-banner-text');
    var gateArchFill = containerEl.querySelector('.xylo-gate-arch-fill');
    var gatePortcullis = containerEl.querySelector('.xylo-gate-portcullis');
    var scanBtn = containerEl.querySelector('.xylo-scan-trigger');
    var thresholdBtn = containerEl.querySelector('.xylo-threshold-trigger');

    function getSignById(id) {
      for (var i = 0; i < WILDERNESS_SIGNS.length; i++) {
        if (WILDERNESS_SIGNS[i].id === id) return WILDERNESS_SIGNS[i];
      }
      return null;
    }

    function getState() {
      return {
        discoveredSigns: Array.from(discoveredSet),
        discoveredCount: discoveredSet.size,
        totalSigns: WILDERNESS_SIGNS.length,
        gateUnlocked: discoveredSet.size >= WILDERNESS_SIGNS.length,
        focusedSignId: focusedSignId,
        muteProbesCount: muteProbesCount,
        reducedMotion: reducedMotion
      };
    }

    function setBanner(tone, tag, text) {
      if (!whisperBanner) return;
      whisperBanner.setAttribute('data-tone', tone);
      whisperTag.textContent = tag;
      whisperBody.textContent = text;
    }

    function syncVisualState() {
      var count = discoveredSet.size;
      var unlocked = count >= WILDERNESS_SIGNS.length;

      WILDERNESS_SIGNS.forEach(function (s) {
        var found = discoveredSet.has(s.id);
        var isFocused = (focusedSignId === s.id);
        var node = svgEl.querySelector('.xylo-sign-node[data-sign-id="' + s.id + '"]');
        if (node) {
          node.setAttribute('data-found', String(found));
          node.setAttribute('data-focused', String(isFocused));
          var seal = node.querySelector('.xylo-sign-rubric-seal');
          var glint = node.querySelector('.xylo-sign-glint');
          if (seal) seal.setAttribute('opacity', found ? '1' : '0');
          if (glint) glint.setAttribute('opacity', found ? '0' : '0.68');
        }
        var pill = plateEl.querySelector('.xylo-seal-pill[data-pill-sign="' + s.id + '"]');
        if (pill) {
          pill.setAttribute('data-found', String(found));
          pill.textContent = found
            ? (s.roman + ' · ' + s.shortLabel + ' -> ' + s.signifies)
            : (s.roman + ' · ' + s.shortLabel);
        }
      });

      if (gateEl) {
        gateEl.setAttribute('data-unlocked', String(unlocked));
      }
      if (gatePortcullis) {
        gatePortcullis.setAttribute('opacity', unlocked ? '0' : '1');
      }
      if (gateArchFill) {
        gateArchFill.setAttribute('fill', unlocked ? '#a62c1e' : '#171310');
      }
      if (gateBannerBg) {
        gateBannerBg.setAttribute('stroke', unlocked ? '#a62c1e' : '#171310');
        gateBannerBg.setAttribute('fill', unlocked ? '#a62c1e' : '#f3ead8');
      }
      if (gateBannerText) {
        gateBannerText.setAttribute('fill', unlocked ? '#f3ead8' : '#49525c');
        gateBannerText.textContent = unlocked
          ? 'PORTA TAMARAE · OPEN — ENTER CITY'
          : ('PORTA TAMARAE · ' + count + '/3 SIGNS');
      }
      if (thresholdBtn) {
        thresholdBtn.setAttribute('data-unlocked', String(unlocked));
        thresholdBtn.textContent = unlocked
          ? 'Cross Threshold into Tamara ->'
          : ('Gate Sealed (' + count + '/3 Signs)');
      }
    }

    function triggerSignDiscovery(signId) {
      var sign = getSignById(signId);
      if (!sign) return null;
      focusedSignId = sign.id;
      var wasNew = !discoveredSet.has(sign.id);
      discoveredSet.add(sign.id);
      syncVisualState();

      var suffix = (discoveredSet.size >= WILDERNESS_SIGNS.length)
        ? ' — All three natural signs read; the Gate of Tamara stands open.'
        : ' (' + discoveredSet.size + '/3 natural signs recognized).';
      setBanner(
        'sign',
        sign.rubricTitle,
        '“' + sign.calvinoQuote + '”' + suffix
      );

      var signCopy = cloneSign(sign);
      if (wasNew && typeof options.onSignFound === 'function') {
        options.onSignFound(signCopy, discoveredSet.size, getState());
      }
      if (typeof options.onSignSelect === 'function') {
        options.onSignSelect(signCopy, getState());
      }
      if (wasNew && discoveredSet.size === WILDERNESS_SIGNS.length && typeof options.onAllSignsFound === 'function') {
        options.onAllSignsFound(getState());
      }
      return signCopy;
    }

    function handleMuteInteraction(muteGroup, isClick) {
      var kind = muteGroup.getAttribute('data-mute-kind') || 'stone';
      muteProbesCount++;
      var pool = (kind === 'tree') ? MUTE_TREE_APHORISMS : MUTE_STONE_APHORISMS;
      var msg = pool[muteProbesCount % pool.length];

      // Pulse slate non-signifying ring briefly
      var allRings = svgEl.querySelectorAll('.xylo-mute-ring');
      for (var i = 0; i < allRings.length; i++) {
        allRings[i].setAttribute('opacity', '0');
      }
      var ring = muteGroup.querySelector('.xylo-mute-ring');
      if (ring) {
        ring.setAttribute('opacity', '0.88');
        if (muteRingTimer) clearTimeout(muteRingTimer);
        muteRingTimer = setTimeout(function () {
          if (!destroyed && ring) ring.setAttribute('opacity', '0');
        }, 900);
      }

      setBanner('mute', 'MUTE ' + kind.toUpperCase(), msg);

      if (isClick) {
        var payload = {
          kind: kind,
          id: muteGroup.getAttribute('data-mute-id'),
          message: msg,
          isSign: false,
          isRawMatter: true
        };
        if (typeof options.onMuteInspect === 'function') options.onMuteInspect(payload);
        if (typeof options.onMuteProbe === 'function') options.onMuteProbe(payload);
      }
    }

    function attemptEnterCity() {
      if (discoveredSet.size < WILDERNESS_SIGNS.length && !options.allowEarlyGate) {
        setBanner(
          'mute',
          'PORTA CLAUSA',
          'Only ' + discoveredSet.size + ' of 3 signs recognized on the approach. Recognize the tiger print, marsh, and hibiscus to enter Tamara.'
        );
        return false;
      }
      if (typeof options.onEnterCity === 'function') {
        options.onEnterCity(getState());
      }
      return true;
    }

    // Event Delegation on SVG
    function onSvgClick(ev) {
      var signNode = ev.target.closest ? ev.target.closest('.xylo-sign-node') : null;
      if (signNode) {
        triggerSignDiscovery(signNode.getAttribute('data-sign-id'));
        return;
      }
      var gateNode = ev.target.closest ? ev.target.closest('.xylo-gate-bastion') : null;
      if (gateNode) {
        attemptEnterCity();
        return;
      }
      var muteNode = ev.target.closest ? ev.target.closest('.xylo-mute-entity') : null;
      if (muteNode) {
        handleMuteInteraction(muteNode, true);
      }
    }

    function onSvgPointerOver(ev) {
      var muteNode = ev.target.closest ? ev.target.closest('.xylo-mute-entity') : null;
      if (muteNode) {
        handleMuteInteraction(muteNode, false);
      }
    }

    function onSvgKeyDown(ev) {
      if (ev.key !== 'Enter' && ev.key !== ' ') return;
      var signNode = ev.target.closest ? ev.target.closest('.xylo-sign-node') : null;
      if (signNode) {
        ev.preventDefault();
        triggerSignDiscovery(signNode.getAttribute('data-sign-id'));
        return;
      }
      var gateNode = ev.target.closest ? ev.target.closest('.xylo-gate-bastion') : null;
      if (gateNode) {
        ev.preventDefault();
        attemptEnterCity();
      }
    }

    function onHudClick(ev) {
      var pill = ev.target.closest ? ev.target.closest('.xylo-seal-pill') : null;
      if (pill) {
        var sid = pill.getAttribute('data-pill-sign');
        focusSign(sid);
        triggerSignDiscovery(sid);
        return;
      }
      if (ev.target.closest && ev.target.closest('.xylo-scan-trigger')) {
        discoverNext();
        return;
      }
      if (ev.target.closest && ev.target.closest('.xylo-threshold-trigger')) {
        attemptEnterCity();
      }
    }

    svgEl.addEventListener('click', onSvgClick);
    svgEl.addEventListener('pointerover', onSvgPointerOver);
    svgEl.addEventListener('keydown', onSvgKeyDown);
    plateEl.addEventListener('click', onHudClick);

    function resize() {
      if (destroyed || !stageEl || !svgEl) return;
      var rect = stageEl.getBoundingClientRect();
      var w = rect.width || 800;
      var h = rect.height || 420;
      var ratio = w / Math.max(h, 1);
      // Adapt framing on narrow portrait viewports while keeping all 3 signs (x=252..748) safely inside
      if (ratio < 1.25) {
        svgEl.setAttribute('viewBox', '128 18 744 494');
      } else if (ratio < 1.6) {
        svgEl.setAttribute('viewBox', '64 8 872 506');
      } else {
        svgEl.setAttribute('viewBox', '0 0 1000 520');
      }
    }

    var resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(function () { resize(); });
      resizeObserver.observe(stageEl);
    } else if (typeof global.addEventListener === 'function') {
      global.addEventListener('resize', resize);
    }

    function focusSign(id) {
      var sign = getSignById(id);
      if (!sign) return null;
      focusedSignId = sign.id;
      syncVisualState();
      var node = svgEl.querySelector('.xylo-sign-node[data-sign-id="' + sign.id + '"]');
      if (node && typeof node.focus === 'function') {
        try {
          node.focus({ preventScroll: true });
        } catch (_e) {
          node.focus();
        }
      }
      var already = discoveredSet.has(sign.id);
      setBanner(
        already ? 'sign' : 'mute',
         already ? sign.rubricTitle : 'EYE DRAWN TO DETAIL',
        already
          ? ('“' + sign.calvinoQuote + '”')
          : (sign.thing + ' (' + sign.terrainZone + ') — press Enter or click to read its sign.')
      );
      return cloneSign(sign);
    }

    function discoverNext() {
      for (var i = 0; i < WILDERNESS_SIGNS.length; i++) {
        var s = WILDERNESS_SIGNS[i];
        if (!discoveredSet.has(s.id)) {
          focusSign(s.id);
          return triggerSignDiscovery(s.id);
        }
      }
      // Cycle focus if all 3 already discovered
      var curIdx = WILDERNESS_SIGNS.findIndex(function (x) { return x.id === focusedSignId; });
      var nextSign = WILDERNESS_SIGNS[(curIdx + 1) % WILDERNESS_SIGNS.length];
      focusSign(nextSign.id);
      return cloneSign(nextSign);
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      if (plateEl) {
        plateEl.setAttribute('data-reduced-motion', String(reducedMotion));
      }
    }

    function reset() {
      discoveredSet.clear();
      focusedSignId = null;
      muteProbesCount = 0;
      syncVisualState();
      setBanner(
        'mute',
        'APPROACH',
        'You walk for days among silent trees and stones. Seek the three things recognized as signs of another thing.'
      );
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      if (muteRingTimer) clearTimeout(muteRingTimer);
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else if (typeof global.removeEventListener === 'function') {
        global.removeEventListener('resize', resize);
      }
      if (svgEl) {
        svgEl.removeEventListener('click', onSvgClick);
        svgEl.removeEventListener('pointerover', onSvgPointerOver);
        svgEl.removeEventListener('keydown', onSvgKeyDown);
      }
      if (plateEl) {
        plateEl.removeEventListener('click', onHudClick);
      }
      containerEl.innerHTML = '';
    }

    syncVisualState();
    resize();

    return {
      resize: resize,
      focusSign: focusSign,
      discoverNext: discoverNext,
      discoverSign: triggerSignDiscovery,
      setReducedMotion: setReducedMotion,
      getState: getState,
      reset: reset,
      destroy: destroy
    };
  }

  /* ==========================================================================
   * PART B — mountHorizon(containerEl, opts)
   * Post-Exit Empty Land & Gaze-Dwell Pareidolia Cloud Sky
   * ========================================================================== */
  var SCULPT_PUFF_COUNT = 38;

  // 38 target cloud-puff anchors { x, y, r } in figure-local space [-1..1]
  function buildFigureTargets(figureId) {
    if (figureId === 'sailing_ship') {
      return [
        // Keeled cloud-hull & high sterncastle (14 puffs)
        { x: -0.68, y: 0.30, r: 0.16 }, { x: -0.54, y: 0.36, r: 0.19 },
        { x: -0.38, y: 0.42, r: 0.22 }, { x: -0.20, y: 0.45, r: 0.24 },
        { x: -0.02, y: 0.46, r: 0.25 }, { x: 0.16, y: 0.45, r: 0.24 },
        { x: 0.34, y: 0.42, r: 0.23 }, { x: 0.50, y: 0.36, r: 0.22 },
        { x: 0.63, y: 0.25, r: 0.21 }, { x: 0.70, y: 0.12, r: 0.18 },
        // Bowsprit vapor lance (3 puffs)
        { x: -0.80, y: 0.22, r: 0.13 }, { x: -0.91, y: 0.16, r: 0.10 },
        { x: -0.58, y: 0.18, r: 0.16 },
        // Foremast billowing square-sails (7 puffs)
        { x: -0.38, y: 0.14, r: 0.20 }, { x: -0.42, y: -0.04, r: 0.22 },
        { x: -0.36, y: -0.22, r: 0.20 }, { x: -0.34, y: -0.38, r: 0.16 },
        { x: -0.25, y: -0.10, r: 0.19 }, { x: -0.52, y: -0.12, r: 0.16 },
        { x: -0.35, y: -0.52, r: 0.11 },
        // Tall mainmast grand cloud-sails + pennant (10 puffs)
        { x: 0.02, y: 0.16, r: 0.24 }, { x: -0.04, y: -0.04, r: 0.27 },
        { x: 0.08, y: -0.16, r: 0.26 }, { x: -0.02, y: -0.32, r: 0.24 },
        { x: 0.05, y: -0.48, r: 0.21 }, { x: 0.01, y: -0.64, r: 0.16 },
        { x: 0.02, y: -0.78, r: 0.11 }, { x: 0.16, y: -0.82, r: 0.09 },
        { x: -0.14, y: -0.20, r: 0.20 }, { x: 0.16, y: 0.02, r: 0.21 },
        // Mizzen lateen cloud-sail (4 puffs)
        { x: 0.42, y: 0.14, r: 0.20 }, { x: 0.45, y: -0.05, r: 0.21 },
        { x: 0.50, y: -0.23, r: 0.17 }, { x: 0.55, y: -0.38, r: 0.12 }
      ];
    }

    if (figureId === 'hand') {
      return [
        // Broad cloud-palm & wrist base (12 puffs)
        { x: -0.18, y: 0.62, r: 0.21 }, { x: 0.02, y: 0.64, r: 0.22 },
        { x: 0.20, y: 0.60, r: 0.20 }, { x: -0.28, y: 0.38, r: 0.24 },
        { x: -0.08, y: 0.38, r: 0.27 }, { x: 0.12, y: 0.38, r: 0.26 },
        { x: 0.30, y: 0.36, r: 0.23 }, { x: -0.26, y: 0.14, r: 0.24 },
        { x: -0.06, y: 0.12, r: 0.26 }, { x: 0.14, y: 0.13, r: 0.25 },
        { x: 0.32, y: 0.16, r: 0.22 }, { x: -0.38, y: 0.24, r: 0.20 },
        // Opposed abducted thumb on left (5 puffs)
        { x: -0.48, y: 0.18, r: 0.18 }, { x: -0.60, y: 0.08, r: 0.16 },
        { x: -0.71, y: -0.03, r: 0.14 }, { x: -0.80, y: -0.13, r: 0.12 },
        { x: -0.52, y: 0.30, r: 0.16 },
        // Index finger (6 puffs)
        { x: -0.28, y: -0.08, r: 0.15 }, { x: -0.31, y: -0.24, r: 0.14 },
        { x: -0.34, y: -0.40, r: 0.13 }, { x: -0.36, y: -0.55, r: 0.12 },
        { x: -0.38, y: -0.68, r: 0.10 }, { x: -0.29, y: -0.16, r: 0.13 },
        // Tall middle finger (5 puffs)
        { x: -0.06, y: -0.10, r: 0.15 }, { x: -0.06, y: -0.28, r: 0.14 },
        { x: -0.06, y: -0.46, r: 0.13 }, { x: -0.06, y: -0.63, r: 0.12 },
        { x: -0.06, y: -0.78, r: 0.10 },
        // Ring finger (5 puffs)
        { x: 0.16, y: -0.08, r: 0.15 }, { x: 0.18, y: -0.25, r: 0.14 },
        { x: 0.20, y: -0.42, r: 0.13 }, { x: 0.22, y: -0.57, r: 0.12 },
        { x: 0.23, y: -0.70, r: 0.10 },
        // Little finger (5 puffs)
        { x: 0.36, y: -0.01, r: 0.14 }, { x: 0.41, y: -0.15, r: 0.13 },
        { x: 0.46, y: -0.29, r: 0.12 }, { x: 0.50, y: -0.42, r: 0.11 },
        { x: 0.53, y: -0.52, r: 0.09 }
      ];
    }

    // elephant: domed head, curled trunk, tusks, broad ear, heavy cloud-body & legs
    return [
      // Heavy arched cloud-body (12 puffs)
      { x: -0.05, y: -0.16, r: 0.28 }, { x: 0.16, y: -0.22, r: 0.31 },
      { x: 0.38, y: -0.18, r: 0.29 }, { x: 0.56, y: -0.06, r: 0.26 },
      { x: 0.02, y: 0.08, r: 0.29 }, { x: 0.24, y: 0.08, r: 0.30 },
      { x: 0.46, y: 0.10, r: 0.27 }, { x: 0.62, y: 0.12, r: 0.20 },
      { x: 0.72, y: 0.24, r: 0.11 }, { x: -0.12, y: 0.06, r: 0.25 },
      { x: 0.14, y: -0.06, r: 0.28 }, { x: 0.36, y: -0.04, r: 0.28 },
      // Broad scalloped ear-fan & domed head (9 puffs)
      { x: -0.18, y: -0.32, r: 0.24 }, { x: -0.14, y: -0.12, r: 0.25 },
      { x: -0.36, y: -0.36, r: 0.25 }, { x: -0.46, y: -0.24, r: 0.23 },
      { x: -0.40, y: -0.06, r: 0.22 }, { x: -0.26, y: -0.22, r: 0.23 },
      { x: -0.52, y: -0.12, r: 0.19 }, { x: -0.06, y: -0.26, r: 0.22 },
      { x: -0.28, y: 0.04, r: 0.20 },
      // Upward-curled vapor trunk & tusks (9 puffs)
      { x: -0.60, y: -0.02, r: 0.16 }, { x: -0.68, y: 0.10, r: 0.15 },
      { x: -0.77, y: 0.14, r: 0.14 }, { x: -0.86, y: 0.06, r: 0.13 },
      { x: -0.90, y: -0.08, r: 0.12 }, { x: -0.85, y: -0.22, r: 0.11 },
      { x: -0.76, y: -0.26, r: 0.09 }, { x: -0.58, y: 0.15, r: 0.12 },
      { x: -0.70, y: 0.21, r: 0.10 },
      // Four heavy columnar cloud-legs (8 puffs)
      { x: -0.18, y: 0.30, r: 0.18 }, { x: -0.20, y: 0.48, r: 0.16 },
      { x: 0.04, y: 0.32, r: 0.17 }, { x: 0.05, y: 0.49, r: 0.15 },
      { x: 0.34, y: 0.30, r: 0.18 }, { x: 0.33, y: 0.48, r: 0.16 },
      { x: 0.54, y: 0.30, r: 0.17 }, { x: 0.55, y: 0.48, r: 0.15 }
    ];
  }

  var FIGURE_TARGET_MAP = {
    sailing_ship: buildFigureTargets('sailing_ship'),
    hand: buildFigureTargets('hand'),
    elephant: buildFigureTargets('elephant')
  };

  // Xylographic woodcut vapor detail strokes drawn inside crystallized cloud figures
  function drawFigureWoodcutDetails(ctx, figId, cx, cy, rx, ry, alpha, shear) {
    if (alpha <= 0.02) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function px(nx, ny) {
      var windSkew = shear * (0.55 - ny) * rx * 0.95;
      return cx + nx * rx + windSkew;
    }
    function py(ny) {
      return cy + ny * ry;
    }

    if (figId === 'sailing_ship') {
      // Masts & bowsprit in woodblock ink & vapor slate
      ctx.strokeStyle = PALETTE.woodblockInk;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      // Mainmast, foremast, mizzen, bowsprit
      ctx.moveTo(px(0.01, 0.34), py(0.34));
      ctx.lineTo(px(0.01, -0.84), py(-0.84));
      ctx.moveTo(px(-0.35, 0.32), py(0.32));
      ctx.lineTo(px(-0.35, -0.56), py(-0.56));
      ctx.moveTo(px(0.45, 0.28), py(0.28));
      ctx.lineTo(px(0.54, -0.44), py(-0.44));
      ctx.moveTo(px(-0.56, 0.27), py(0.27));
      ctx.lineTo(px(-0.96, 0.13), py(0.13));
      ctx.stroke();

      // Billowing cloud-sail arcs & rigging wisps
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      // Mainsail curved leech
      ctx.moveTo(px(-0.18, -0.48), py(-0.48));
      ctx.quadraticCurveTo(px(0.26, -0.24), py(-0.24), px(-0.14, 0.14), py(0.14));
      // Foresail curved leech
      ctx.moveTo(px(-0.48, -0.36), py(-0.36));
      ctx.quadraticCurveTo(px(-0.16, -0.14), py(-0.14), px(-0.46, 0.16), py(0.16));
      // Mizzen lateen yard
      ctx.moveTo(px(0.32, 0.10), py(0.10));
      ctx.lineTo(px(0.60, -0.42), py(-0.42));
      // Keeled hull strakes
      ctx.moveTo(px(-0.72, 0.26), py(0.26));
      ctx.quadraticCurveTo(px(0.0, 0.56), py(0.56), px(0.72, 0.12), py(0.12));
      ctx.moveTo(px(-0.60, 0.36), py(0.36));
      ctx.quadraticCurveTo(px(0.02, 0.62), py(0.62), px(0.64, 0.26), py(0.26));
      // Pennant at masthead
      ctx.moveTo(px(0.01, -0.83), py(-0.83));
      ctx.quadraticCurveTo(px(0.14, -0.89), py(-0.89), px(0.25, -0.81), py(-0.81));
      ctx.stroke();

      // Fine rigging & hull hatching
      ctx.strokeStyle = PALETTE.vaporSlate;
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      for (var h = -5; h <= 5; h++) {
        var hx = h * 0.10;
        ctx.moveTo(px(hx, 0.36), py(0.36));
        ctx.lineTo(px(hx + 0.05, 0.47), py(0.47));
      }
      ctx.moveTo(px(0.01, -0.76), py(-0.76));
      ctx.lineTo(px(-0.35, -0.50), py(-0.50));
      ctx.moveTo(px(0.01, -0.76), py(-0.76));
      ctx.lineTo(px(0.54, -0.40), py(-0.40));
      ctx.stroke();
    } else if (figId === 'hand') {
      // Engraved contour clefts of thumb, palm, and four extended cloud-fingers
      ctx.strokeStyle = PALETTE.woodblockInk;
      ctx.lineWidth = 1.45;
      ctx.beginPath();
      // Thumb outer & inner contour
      ctx.moveTo(px(-0.34, 0.48), py(0.48));
      ctx.quadraticCurveTo(px(-0.62, 0.24), py(0.24), px(-0.84, -0.14), py(-0.14));
      ctx.quadraticCurveTo(px(-0.76, -0.24), py(-0.24), px(-0.56, 0.02), py(0.02));
      ctx.quadraticCurveTo(px(-0.40, 0.16), py(0.16), px(-0.34, 0.02), py(0.02));
      // Index finger
      ctx.moveTo(px(-0.36, 0.0), py(0.0));
      ctx.lineTo(px(-0.42, -0.70), py(-0.70));
      ctx.quadraticCurveTo(px(-0.35, -0.80), py(-0.80), px(-0.28, -0.68), py(-0.68));
      ctx.lineTo(px(-0.20, -0.04), py(-0.04));
      // Middle finger
      ctx.moveTo(px(-0.14, -0.05), py(-0.05));
      ctx.lineTo(px(-0.13, -0.80), py(-0.80));
      ctx.quadraticCurveTo(px(-0.06, -0.90), py(-0.90), px(0.02, -0.79), py(-0.79));
      ctx.lineTo(px(0.04, -0.05), py(-0.05));
      // Ring finger
      ctx.moveTo(px(0.09, -0.04), py(-0.04));
      ctx.lineTo(px(0.16, -0.71), py(-0.71));
      ctx.quadraticCurveTo(px(0.24, -0.80), py(-0.80), px(0.30, -0.68), py(-0.68));
      ctx.lineTo(px(0.26, 0.0), py(0.0));
      // Little finger & ulnar palm edge
      ctx.moveTo(px(0.31, 0.03), py(0.03));
      ctx.lineTo(px(0.47, -0.53), py(-0.53));
      ctx.quadraticCurveTo(px(0.56, -0.60), py(-0.60), px(0.59, -0.48), py(-0.48));
      ctx.lineTo(px(0.42, 0.24), py(0.24));
      ctx.quadraticCurveTo(px(0.38, 0.54), py(0.54), px(0.22, 0.68), py(0.68));
      ctx.stroke();

      // Woodcut palm life-lines & knuckle vapor hatches
      ctx.strokeStyle = PALETTE.vaporSlate;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(px(-0.28, 0.14), py(0.14));
      ctx.quadraticCurveTo(px(0.04, 0.08), py(0.08), px(0.30, 0.20), py(0.20));
      ctx.moveTo(px(-0.24, 0.22), py(0.22));
      ctx.quadraticCurveTo(px(-0.04, 0.36), py(0.36), px(-0.08, 0.56), py(0.56));
      ctx.stroke();
    } else {
      // Elephant: domed head, curled trunk, gleaming cloud-tusks, broad ear-fan, arched back
      // Ivory-chalk tusks first
      ctx.fillStyle = PALETTE.cloudLight;
      ctx.strokeStyle = PALETTE.woodblockInk;
      ctx.lineWidth = 1.45;
      ctx.beginPath();
      ctx.moveTo(px(-0.50, 0.06), py(0.06));
      ctx.quadraticCurveTo(px(-0.68, 0.28), py(0.28), px(-0.83, 0.16), py(0.16));
      ctx.quadraticCurveTo(px(-0.66, 0.20), py(0.20), px(-0.47, 0.01), py(0.01));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Dorsal ridge, domed head, curled trunk
      ctx.beginPath();
      ctx.moveTo(px(0.68, 0.08), py(0.08));
      ctx.quadraticCurveTo(px(0.34, -0.38), py(-0.38), px(-0.08, -0.26), py(-0.26));
      ctx.quadraticCurveTo(px(-0.36, -0.50), py(-0.50), px(-0.54, -0.20), py(-0.20));
      ctx.quadraticCurveTo(px(-0.66, 0.06), py(0.06), px(-0.82, 0.08), py(0.08));
      ctx.quadraticCurveTo(px(-0.95, -0.08), py(-0.08), px(-0.82, -0.27), py(-0.27));
      // Broad scalloped ear-fan
      ctx.moveTo(px(-0.28, -0.34), py(-0.34));
      ctx.quadraticCurveTo(px(-0.02, -0.36), py(-0.36), px(-0.04, -0.04), py(-0.04));
      ctx.quadraticCurveTo(px(-0.18, 0.10), py(0.10), px(-0.32, -0.08), py(-0.08));
      // Eye & tail wisp
      ctx.moveTo(px(0.66, 0.08), py(0.08));
      ctx.quadraticCurveTo(px(0.76, 0.20), py(0.20), px(0.75, 0.34), py(0.34));
      ctx.stroke();

      // Eye dot
      ctx.fillStyle = PALETTE.woodblockInk;
      ctx.beginPath();
      ctx.arc(px(-0.43, -0.20), py(-0.20), 2.3, 0, Math.PI * 2);
      ctx.fill();

      // Woodcut flank & trunk ring hatches
      ctx.strokeStyle = PALETTE.vaporSlate;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      for (var t = 0; t < 5; t++) {
        var tx = -0.60 - t * 0.055;
        var ty = 0.01 + Math.sin(t * 0.7) * 0.05;
        ctx.moveTo(px(tx, ty - 0.04), py(ty - 0.04));
        ctx.lineTo(px(tx + 0.02, ty + 0.05), py(ty + 0.05));
      }
      for (var f = 0; f < 6; f++) {
        var fx = 0.08 + f * 0.08;
        ctx.moveTo(px(fx, 0.06), py(0.06));
        ctx.lineTo(px(fx, 0.19), py(0.19));
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawRubricCalloutsOnCanvas(ctx, fig, cx, cy, rx, ry, w, horizonPx, alpha) {
    if (alpha <= 0.05) return;
    ctx.save();
    ctx.globalAlpha = alpha;

    // Corner astrological/xylographic bracket ticks around crystallized figure
    var bx0 = clamp(cx - rx * 1.04, 14, w - 30);
    var bx1 = clamp(cx + rx * 1.04, 30, w - 14);
    var by0 = clamp(cy - ry * 1.02, 14, horizonPx - 30);
    var by1 = clamp(cy + ry * 0.86, 30, horizonPx - 10);
    var tick = 10;

    ctx.strokeStyle = PALETTE.rubricVermilion;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(bx0, by0 + tick); ctx.lineTo(bx0, by0); ctx.lineTo(bx0 + tick, by0);
    ctx.moveTo(bx1 - tick, by0); ctx.lineTo(bx1, by0); ctx.lineTo(bx1, by0 + tick);
    ctx.moveTo(bx0, by1 - tick); ctx.lineTo(bx0, by1); ctx.lineTo(bx0 + tick, by1);
    ctx.moveTo(bx1 - tick, by1); ctx.lineTo(bx1, by1); ctx.lineTo(bx1, by1 - tick);
    ctx.stroke();

    // Anatomical callout leader lines + rubric tags (hidden on ultra-small widths to keep crisp)
    if (w >= 460) {
      ctx.font = '700 9.5px "Palatino Linotype", "Book Antiqua", Georgia, serif';
      for (var i = 0; i < fig.anatomyCallouts.length; i++) {
        var c = fig.anatomyCallouts[i];
        var sx = cx + c.rx * rx;
        var sy = cy + c.ry * ry;
        var ex = clamp(cx + c.lx * rx * 1.12, 58, w - 58);
        var ey = clamp(cy + c.ly * ry * 1.08, 22, horizonPx - 16);

        ctx.strokeStyle = PALETTE.rubricVermilion;
        ctx.lineWidth = 1.05;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.3, 0, Math.PI * 2);
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        var tw = ctx.measureText(c.label).width + 8;
        var tagX = clamp(ex - tw * 0.5, 8, w - tw - 8);
        var tagY = ey - 7;
        ctx.fillStyle = 'rgba(243, 234, 216, 0.92)';
        ctx.fillRect(tagX, tagY, tw, 13.5);
        ctx.strokeStyle = PALETTE.rubricVermilion;
        ctx.lineWidth = 0.85;
        ctx.strokeRect(tagX, tagY, tw, 13.5);
        ctx.fillStyle = PALETTE.rubricVermilion;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(c.label, tagX + tw * 0.5, tagY + 7);
      }
    }

    ctx.restore();
  }

  function mountHorizon(containerEl, opts) {
    if (!containerEl) {
      throw new Error('TamaraPareidoliaHorizon.mountHorizon requires a container element.');
    }
    ensureStylesInjected();

    var options = opts || {};
    var reducedMotion = detectReducedMotion(options.reducedMotion);
    var discourseSaturation = clamp01(
      options.discourseSaturation !== undefined
        ? options.discourseSaturation
        : (options.saturation !== undefined ? options.saturation : 0.42)
    );

    var recognizedSet = new Set();
    if (options.initialRecognized) {
      Array.from(options.initialRecognized).forEach(function (id) {
        if (CLOUD_FIGURES.some(function (f) { return f.id === id; })) {
          recognizedSet.add(id);
        }
      });
    }

    var destroyed = false;
    var HORIZON_NY = 0.75; // Sky occupies top 75%, empty plain bottom 25%

    // Gaze reticle state (normalized 0..1)
    var gazeX = 0.48;
    var gazeY = 0.37;
    var gazeEngaged = true;

    // Dwell & crystallization state
    var dwellAnchorX = gazeX;
    var dwellAnchorY = gazeY;
    var dwellElapsedMs = 0;
    var morphProgress = 0; // 0..1
    var activeFigureId = null; // figure currently crystallized
    var pendingFigureIndex = 0; // next candidate index in CLOUD_FIGURES
    var shearingGhost = null; // { figId, nx, ny, morph, shear, alpha }

    function getDwellThresholdMs() {
      // ~420ms base dwell, shortened down to ~210ms as discourseSaturation (0..1) climbs
      return Math.round(420 - 210 * discourseSaturation);
    }

    function pickNextFigureIndex() {
      for (var i = 0; i < CLOUD_FIGURES.length; i++) {
        var idx = (pendingFigureIndex + i) % CLOUD_FIGURES.length;
        if (!recognizedSet.has(CLOUD_FIGURES[idx].id)) {
          return idx;
        }
      }
      return pendingFigureIndex % CLOUD_FIGURES.length;
    }

    // Procedural ambient sky clouds & wind wisps
    var rng = createSeededRng(606991);
    var ambientPuffs = [];
    for (var i = 0; i < 88; i++) {
      var bank = i % 8;
      var bankX = (bank / 8) + (rng() - 0.5) * 0.11;
      var bankY = 0.13 + (bank % 3) * 0.16 + (rng() - 0.5) * 0.09;
      ambientPuffs.push({
        nx: ((bankX % 1) + 1) % 1,
        ny: clamp(bankY, 0.09, HORIZON_NY - 0.08),
        r: 14 + rng() * 26,
        speed: 0.014 + rng() * 0.020,
        bobPhase: rng() * Math.PI * 2,
        shade: rng()
      });
    }

    var windWisps = [];
    for (var wIdx = 0; wIdx < 26; wIdx++) {
      windWisps.push({
        nx: rng(),
        ny: 0.08 + rng() * (HORIZON_NY - 0.12),
        len: 32 + rng() * 68,
        speed: 0.032 + rng() * 0.035
      });
    }

    // 38 sculptor puffs that coalesce from surrounding wind turbulence into the figure
    var sculptPuffs = [];
    for (var sp = 0; sp < SCULPT_PUFF_COUNT; sp++) {
      var ang = (sp / SCULPT_PUFF_COUNT) * Math.PI * 2 + rng() * 0.4;
      var dist = 0.35 + rng() * 0.95;
      sculptPuffs.push({
        scatterDx: Math.cos(ang) * dist,
        scatterDy: Math.sin(ang) * dist * 0.68,
        scatterR: 0.12 + rng() * 0.15,
        phase: rng() * Math.PI * 2
      });
    }

    // Plain woodcut furrow ticks (deterministic, empty horizon)
    var plainFurrows = [];
    for (var pf = 0; pf < 34; pf++) {
      plainFurrows.push({
        nx: 0.05 + rng() * 0.90,
        depth: 0.08 + rng() * 0.84,
        span: 10 + rng() * 28
      });
    }

    containerEl.innerHTML = [
      '<xylo-horizon-plate tabindex="0" role="region" aria-label="Outside Tamara: empty horizon and pareidolia sky" data-reduced-motion="', String(reducedMotion), '">',
      '  <xylo-sky-rubric-strip>',
      '    <xylo-rubric-kicker class="xylo-rubric-kicker">¶ TABULA III · TERRA VACUA ET NUBES VELOCES</xylo-rubric-kicker>',
      '    <xylo-saturation-readout class="xylo-saturation-readout">',
      '      <xylo-saturation-label>EYE CONDITIONING</xylo-saturation-label>',
      '      <xylo-saturation-bar class="xylo-saturation-bar"><xylo-saturation-fill class="xylo-saturation-fill" style="width:', Math.round(discourseSaturation * 100), '%"></xylo-saturation-fill></xylo-saturation-bar>',
      '      <xylo-saturation-pct class="xylo-saturation-pct">', Math.round(discourseSaturation * 100), '%</xylo-saturation-pct>',
      '    </xylo-saturation-readout>',
      '  </xylo-sky-rubric-strip>',
      '  <xylo-sky-engraving>',
      '    <canvas class="xylo-horizon-canvas"></canvas>',
      '    <xylo-callout-placard data-tone="drift">',
      '      <xylo-whisper-tag class="xylo-whisper-tag">OPEN SKY</xylo-whisper-tag>',
      '      <xylo-whisper-body class="xylo-whisper-body">Outside Tamara the land stretches empty to the horizon. Hold your gaze upon the speeding clouds (or steer with Arrow keys) — your conditioned eye is already intent on recognizing figures.</xylo-whisper-body>',
      '    </xylo-callout-placard>',
      '  </xylo-sky-engraving>',
      '  <xylo-augury-hud>',
      '    <xylo-figure-seal-row>',
      CLOUD_FIGURES.map(function (f) {
        return '<button type="button" class="xylo-figure-pill" data-pill-fig="' + f.id + '" data-found="false" data-active="false">' +
          escapeHtml(f.roman + ' · ' + f.shortLabel) +
          '</button>';
      }).join(''),
      '    </xylo-figure-seal-row>',
      '    <xylo-rubric-subnote class="xylo-rubric-subnote xylo-augury-counter">0 / 3 cloud figures projected</xylo-rubric-subnote>',
      '  </xylo-augury-hud>',
      '</xylo-horizon-plate>'
    ].join('');

    var plateEl = containerEl.querySelector('xylo-horizon-plate');
    var skyStageEl = containerEl.querySelector('xylo-sky-engraving');
    var canvasEl = containerEl.querySelector('.xylo-horizon-canvas');
    var ctx = canvasEl.getContext('2d');
    var calloutPlacard = containerEl.querySelector('xylo-callout-placard');
    var calloutTag = calloutPlacard.querySelector('.xylo-whisper-tag');
    var calloutBody = calloutPlacard.querySelector('.xylo-whisper-body');
    var satFillEl = containerEl.querySelector('.xylo-saturation-fill');
    var satPctEl = containerEl.querySelector('.xylo-saturation-pct');
    var counterEl = containerEl.querySelector('.xylo-augury-counter');

    var viewW = 800;
    var viewH = 440;
    var dpr = 1;
    var skyClock = 0;

    function getFigureById(id) {
      for (var j = 0; j < CLOUD_FIGURES.length; j++) {
        if (CLOUD_FIGURES[j].id === id) return CLOUD_FIGURES[j];
      }
      return null;
    }

    function getState() {
      var threshold = getDwellThresholdMs();
      return {
        gaze: { nx: Number(gazeX.toFixed(4)), ny: Number(gazeY.toFixed(4)) },
        activeFigureId: activeFigureId,
        morphProgress: Number(morphProgress.toFixed(3)),
        dwellProgress: Number(clamp01(dwellElapsedMs / threshold).toFixed(3)),
        dwellThresholdMs: threshold,
        discourseSaturation: discourseSaturation,
        recognizedFigures: Array.from(recognizedSet),
        recognizedCount: recognizedSet.size,
        totalFigures: CLOUD_FIGURES.length,
        allRecognized: recognizedSet.size >= CLOUD_FIGURES.length,
        reducedMotion: reducedMotion
      };
    }

    function syncHud() {
      var pct = Math.round(discourseSaturation * 100);
      if (satFillEl) satFillEl.style.width = pct + '%';
      if (satPctEl) satPctEl.textContent = pct + '%';
      if (counterEl) {
        counterEl.textContent = recognizedSet.size + ' / 3 cloud figures projected';
      }
      CLOUD_FIGURES.forEach(function (f) {
        var pill = plateEl.querySelector('.xylo-figure-pill[data-pill-fig="' + f.id + '"]');
        if (pill) {
          pill.setAttribute('data-found', String(recognizedSet.has(f.id)));
          pill.setAttribute('data-active', String(activeFigureId === f.id));
        }
      });
    }

    function setPlacard(tone, tag, body) {
      if (!calloutPlacard) return;
      calloutPlacard.setAttribute('data-tone', tone);
      calloutTag.textContent = tag;
      calloutBody.textContent = body;
    }

    function releaseActiveToShear() {
      if (!activeFigureId) return;
      shearingGhost = {
        figId: activeFigureId,
        nx: dwellAnchorX,
        ny: dwellAnchorY,
        shear: 0,
        alpha: 0.92
      };
      var prevIdx = CLOUD_FIGURES.findIndex(function (f) { return f.id === activeFigureId; });
      pendingFigureIndex = (prevIdx + 1) % CLOUD_FIGURES.length;
      activeFigureId = null;
      morphProgress = 0;
      dwellElapsedMs = 0;
      syncHud();
      setPlacard(
        'drift',
        'WIND SHEAR',
        'Chance and wind unravel the figure back into vapor — yet ahead your conditioned eye is already forming the next sign.'
      );
    }

    function finalizeCrystallization(fig) {
      activeFigureId = fig.id;
      morphProgress = 1;
      dwellElapsedMs = getDwellThresholdMs();
      recognizedSet.add(fig.id);
      pendingFigureIndex = (fig.index) % CLOUD_FIGURES.length;
      syncHud();

      var suffix = (recognizedSet.size >= CLOUD_FIGURES.length)
        ? ' — Sailing ship, hand, and elephant: even empty sky repeats Tamara’s habit of signs.'
        : ' (' + recognizedSet.size + '/3 canonical cloud figures recognized).';
      setPlacard(
        'crystallized',
        fig.rubricTitle,
        '“' + fig.calvinoQuote + '” — ' + fig.taxonomyNote + suffix
      );

      if (typeof options.onFigureCrystallized === 'function') {
        var figPayload = cloneFigure(fig, {
          gaze: { nx: dwellAnchorX, ny: dwellAnchorY },
          saturation: discourseSaturation
        });
        options.onFigureCrystallized(figPayload, new Set(recognizedSet), getState());
      }
      return fig;
    }

    function drawWoodcutCloudPuff(cx, cy, radius, alpha, highlightTone) {
      if (radius < 1.5 || alpha <= 0.02) return;
      ctx.save();
      ctx.globalAlpha = alpha;

      // Belly vapor-slate shadow offset slightly downward
      ctx.fillStyle = PALETTE.vaporSlate;
      ctx.beginPath();
      ctx.arc(cx + radius * 0.08, cy + radius * 0.17, radius * 0.92, 0.08 * Math.PI, 0.92 * Math.PI);
      ctx.fill();

      // Main warm chalk-vellum cloud body
      ctx.fillStyle = highlightTone ? PALETTE.cloudLight : PALETTE.horizonChalk;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Upper woodcut ink billow contour arc
      ctx.strokeStyle = PALETTE.woodblockInk;
      ctx.lineWidth = highlightTone ? 1.25 : 0.9;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 1.08 * Math.PI, 1.94 * Math.PI);
      ctx.stroke();

      // Subtle woodblock hatch lines in lower third of large puffs
      if (radius > 15) {
        ctx.strokeStyle = PALETTE.vaporSlate;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        var step = Math.max(4, radius * 0.28);
        for (var hx = -radius * 0.62; hx <= radius * 0.62; hx += step) {
          ctx.moveTo(cx + hx, cy + radius * 0.34);
          ctx.lineTo(cx + hx + 3, cy + radius * 0.64);
        }
        ctx.stroke();
      }

      ctx.restore();
    }

    function renderSculptedFigureCluster(figId, anchorNx, anchorNy, morph, shear, alphaBoost) {
      var targets = FIGURE_TARGET_MAP[figId] || FIGURE_TARGET_MAP.sailing_ship;
      var cx = anchorNx * viewW;
      var horizonPx = viewH * HORIZON_NY;
      var cy = clamp(anchorNy * viewH, 58, horizonPx - 62);
      var rx = clamp(Math.min(viewW * 0.20, horizonPx * 0.36), 68, 175);
      var ry = rx * 0.72;
      var eased = smoothstep(morph);

      for (var i = 0; i < targets.length; i++) {
        var t = targets[i];
        var sp = sculptPuffs[i % sculptPuffs.length];
        var driftWobble = reducedMotion ? 0 : Math.sin(skyClock * 1.4 + sp.phase) * 0.06 * (1 - eased);
        var curLx = lerp(sp.scatterDx + driftWobble, t.x, eased) + shear * (0.58 - t.y) * 0.95;
        var curLy = lerp(sp.scatterDy, t.y, eased);
        var curR = lerp(sp.scatterR, t.r, eased) * rx;
        var puffAlpha = (0.42 + 0.54 * eased) * alphaBoost;
        drawWoodcutCloudPuff(cx + curLx * rx, cy + curLy * ry, curR, puffAlpha, eased > 0.55);
      }

      if (eased > 0.32) {
        var detailAlpha = clamp01((eased - 0.32) / 0.68) * alphaBoost;
        drawFigureWoodcutDetails(ctx, figId, cx, cy, rx, ry, detailAlpha, shear);
      }

      var figObj = getFigureById(figId);
      if (figObj && eased > 0.80 && shear < 0.08) {
        var rubricAlpha = clamp01((eased - 0.80) / 0.20) * alphaBoost;
        drawRubricCalloutsOnCanvas(ctx, figObj, cx, cy, rx, ry, viewW, horizonPx, rubricAlpha);
      }
    }

    function renderFrame() {
      if (destroyed || !ctx) return;
      var w = viewW;
      var h = viewH;
      var horizonPx = Math.round(h * HORIZON_NY);

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Open Sky Vellum Ground + Upper Engraving Ruling
      var skyGrad = ctx.createLinearGradient(0, 0, 0, horizonPx);
      skyGrad.addColorStop(0, PALETTE.agedRag);
      skyGrad.addColorStop(0.38, PALETTE.vellumGround);
      skyGrad.addColorStop(1, PALETTE.horizonChalk);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonPx);

      ctx.strokeStyle = 'rgba(23, 19, 16, 0.14)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      for (var sy = 10; sy < horizonPx * 0.34; sy += 6) {
        ctx.moveTo(8, sy);
        ctx.lineTo(w - 8, sy);
      }
      ctx.stroke();

      // 2. Speeding Wind Wisps
      ctx.strokeStyle = 'rgba(73, 82, 92, 0.34)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      for (var wi = 0; wi < windWisps.length; wi++) {
        var wp = windWisps[wi];
        var wx = wp.nx * w;
        var wy = wp.ny * h;
        ctx.moveTo(wx, wy);
        ctx.lineTo(wx + wp.len, wy);
        ctx.moveTo(wx + wp.len * 0.3, wy + 2.5);
        ctx.lineTo(wx + wp.len * 0.85, wy + 2.5);
      }
      ctx.stroke();

      // 3. Ambient Drifting Woodcut Clouds
      for (var ai = 0; ai < ambientPuffs.length; ai++) {
        var ap = ambientPuffs[ai];
        var ax = ap.nx * w;
        var ay = ap.ny * h + (reducedMotion ? 0 : Math.sin(skyClock * 0.9 + ap.bobPhase) * 2.2);
        // Softly part ambient puffs right around a fully crystallized silhouette so silhouette stays crisp
        var dim = 1;
        if (morphProgress > 0.35) {
          var distToAnchor = Math.hypot(ax - dwellAnchorX * w, ay - dwellAnchorY * h);
          if (distToAnchor < 135) {
            dim = lerp(1, 0.25, morphProgress);
          }
        }
        drawWoodcutCloudPuff(ax, ay, ap.r, 0.56 * dim, ap.shade > 0.65);
      }

      // 4. Previous Figure Shearing Away in the Wind (if gaze moved on)
      if (shearingGhost && shearingGhost.alpha > 0.03) {
        renderSculptedFigureCluster(
          shearingGhost.figId,
          shearingGhost.nx,
          shearingGhost.ny,
          1.0,
          shearingGhost.shear,
          shearingGhost.alpha
        );
      }

      // 5. Conditioned-Eye Pre-Echo ahead in wind when idle & saturated
      if (!activeFigureId && morphProgress < 0.08 && discourseSaturation > 0.25) {
        var hintIdx = pickNextFigureIndex();
        var hintFig = CLOUD_FIGURES[hintIdx];
        var hintNx = clamp(((gazeX + 0.26) % 0.76) + 0.12, 0.16, 0.84);
        var hintNy = 0.34;
        renderSculptedFigureCluster(hintFig.id, hintNx, hintNy, 0.16 * discourseSaturation, 0.15, 0.45);
      }

      // 6. Active Gaze-Dwell Morphing / Crystallized Cloud Silhouette
      var targetFig = activeFigureId
        ? getFigureById(activeFigureId)
        : CLOUD_FIGURES[pickNextFigureIndex()];
      if (targetFig && (morphProgress > 0.02 || gazeEngaged)) {
        renderSculptedFigureCluster(
          targetFig.id,
          dwellAnchorX,
          dwellAnchorY,
          Math.max(0.08 + 0.12 * discourseSaturation, morphProgress),
          0,
          1.0
        );
      }

      // 7. Wide Low Empty Plain Stretching to the Horizon
      ctx.fillStyle = PALETTE.vellumGround;
      ctx.fillRect(0, horizonPx, w, h - horizonPx);

      // Tiny receding silhouette of Tamara left far behind on extreme left horizon
      var cityX = 34;
      ctx.fillStyle = PALETTE.agedRag;
      ctx.strokeStyle = PALETTE.woodblockInk;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(cityX - 20, horizonPx);
      ctx.lineTo(cityX - 20, horizonPx - 8);
      ctx.lineTo(cityX - 12, horizonPx - 8);
      ctx.lineTo(cityX - 12, horizonPx - 15);
      ctx.lineTo(cityX - 5, horizonPx - 15);
      ctx.lineTo(cityX - 5, horizonPx - 9);
      ctx.lineTo(cityX + 4, horizonPx - 9);
      ctx.lineTo(cityX + 4, horizonPx - 17);
      ctx.lineTo(cityX + 11, horizonPx - 17);
      ctx.lineTo(cityX + 11, horizonPx - 7);
      ctx.lineTo(cityX + 19, horizonPx - 7);
      ctx.lineTo(cityX + 19, horizonPx);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Bold woodblock horizon line
      ctx.strokeStyle = PALETTE.woodblockInk;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, horizonPx);
      ctx.lineTo(w, horizonPx);
      ctx.stroke();

      // Perspective empty-earth engraving furrows & flat horizon bands
      ctx.strokeStyle = 'rgba(23, 19, 16, 0.38)';
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      var vanishX = w * 0.52;
      for (var rRay = -8; rRay <= 8; rRay++) {
        ctx.moveTo(vanishX + rRay * 26, horizonPx + 1);
        ctx.lineTo(vanishX + rRay * 145, h);
      }
      for (var pfIdx = 0; pfIdx < plainFurrows.length; pfIdx++) {
        var fur = plainFurrows[pfIdx];
        var fy = horizonPx + fur.depth * (h - horizonPx - 12) + 4;
        var fx = fur.nx * w;
        var span = fur.span * (0.45 + fur.depth * 0.9);
        ctx.moveTo(fx - span * 0.5, fy);
        ctx.lineTo(fx + span * 0.5, fy);
      }
      ctx.stroke();

      // 8. Engraved Augury Gaze Reticle
      var gx = gazeX * w;
      var gy = clamp(gazeY * h, 24, horizonPx - 18);
      var dwellFrac = clamp01(dwellElapsedMs / getDwellThresholdMs());
      var reticleR = lerp(24, 15, dwellFrac);

      ctx.save();
      ctx.strokeStyle = activeFigureId ? PALETTE.rubricVermilion : PALETTE.giltOchre;
      ctx.lineWidth = 1.35;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(gx, gy, reticleR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Dwell progress arc in vermilion
      if (dwellFrac > 0.03 && !activeFigureId) {
        ctx.strokeStyle = PALETTE.rubricVermilion;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(gx, gy, reticleR + 3.5, -Math.PI * 0.5, -Math.PI * 0.5 + Math.PI * 2 * dwellFrac);
        ctx.stroke();
      }

      // Reticle cross-ticks
      ctx.strokeStyle = PALETTE.woodblockInk;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(gx - reticleR - 6, gy); ctx.lineTo(gx - reticleR + 3, gy);
      ctx.moveTo(gx + reticleR - 3, gy); ctx.lineTo(gx + reticleR + 6, gy);
      ctx.moveTo(gx, gy - reticleR - 6); ctx.lineTo(gx, gy - reticleR + 3);
      ctx.moveTo(gx, gy + reticleR - 3); ctx.lineTo(gx, gy + reticleR + 6);
      ctx.stroke();
      ctx.restore();

      // Inner xylographic frame border
      ctx.strokeStyle = PALETTE.woodblockInk;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(4, 4, w - 8, h - 8);

      ctx.restore();
    }

    // Animation & Stepped Dwell Loop
    var rafId = null;
    var stepTimerId = null;
    var lastTs = 0;

    function advanceSimulation(dtMs) {
      var dtSec = clamp(dtMs / 1000, 0, 0.1);

      if (!reducedMotion) {
        skyClock += dtSec;
        for (var i = 0; i < ambientPuffs.length; i++) {
          var p = ambientPuffs[i];
          p.nx += p.speed * dtSec;
          if (p.nx > 1.12) p.nx = -0.12;
        }
        for (var w2 = 0; w2 < windWisps.length; w2++) {
          var ww = windWisps[w2];
          ww.nx += ww.speed * dtSec;
          if (ww.nx > 1.10) ww.nx = -0.15;
        }
      }

      if (shearingGhost) {
        shearingGhost.shear += dtSec * (reducedMotion ? 0.9 : 0.62);
        shearingGhost.alpha -= dtSec * (reducedMotion ? 0.85 : 0.48);
        if (shearingGhost.alpha <= 0.02) {
          shearingGhost = null;
        }
      }

      if (gazeEngaged && !activeFigureId) {
        dwellElapsedMs += dtMs;
        var threshold = getDwellThresholdMs();
        morphProgress = clamp01(dwellElapsedMs / threshold);
        if (dwellElapsedMs >= threshold) {
          var nextFig = CLOUD_FIGURES[pickNextFigureIndex()];
          finalizeCrystallization(nextFig);
        }
      }
    }

    function scheduleNextTick() {
      if (destroyed) return;
      if (!reducedMotion) {
        if (!rafId && typeof requestAnimationFrame === 'function') {
          rafId = requestAnimationFrame(onRaf);
        }
      } else {
        // In reducedMotion mode: zero continuous drift, only step while a dwell or shear is settling
        var needsStep = (gazeEngaged && !activeFigureId) || Boolean(shearingGhost);
        if (needsStep && !stepTimerId) {
          stepTimerId = setTimeout(function () {
            stepTimerId = null;
            if (destroyed) return;
            advanceSimulation(75);
            renderFrame();
            scheduleNextTick();
          }, 75);
        }
      }
    }

    function onRaf(ts) {
      rafId = null;
      if (destroyed || reducedMotion) return;
      var dt = lastTs ? (ts - lastTs) : 16.7;
      lastTs = ts;
      advanceSimulation(dt);
      renderFrame();
      scheduleNextTick();
    }

    function updateGazeInternal(nx, ny, fromUser) {
      var clampedX = clamp(Number(nx) || 0.5, 0.08, 0.92);
      var clampedY = clamp(Number(ny) || 0.36, 0.11, HORIZON_NY - 0.08);
      var movedDist = Math.hypot(clampedX - dwellAnchorX, clampedY - dwellAnchorY);

      gazeX = clampedX;
      gazeY = clampedY;
      gazeEngaged = true;

      if (activeFigureId) {
        // Moving the gaze distinctly away shears the crystallized figure back into vapor
        if (movedDist > 0.115) {
          releaseActiveToShear();
          dwellAnchorX = gazeX;
          dwellAnchorY = gazeY;
        }
      } else if (movedDist > 0.055) {
        // Gaze is still roaming; re-center dwell anchor where eye settles
        dwellAnchorX = gazeX;
        dwellAnchorY = gazeY;
        dwellElapsedMs = Math.max(0, dwellElapsedMs * 0.35);
        morphProgress = clamp01(dwellElapsedMs / getDwellThresholdMs());
      }

      if (fromUser && typeof options.onGazeMove === 'function') {
        options.onGazeMove({ nx: gazeX, ny: gazeY, activeFigureId: activeFigureId });
      }

      renderFrame();
      scheduleNextTick();
      return { nx: gazeX, ny: gazeY };
    }

    function setGaze(nx, ny) {
      return updateGazeInternal(nx, ny, false);
    }

    function moveGaze(dx, dy) {
      return updateGazeInternal(gazeX + (Number(dx) || 0), gazeY + (Number(dy) || 0), true);
    }

    function crystallizeFigure(id) {
      var fig = id ? getFigureById(id) : null;
      if (!fig) {
        fig = CLOUD_FIGURES[pickNextFigureIndex()];
      }
      if (activeFigureId && activeFigureId !== fig.id) {
        releaseActiveToShear();
        // Shift gaze slightly windward across sky when snapping a distinct figure via button/hotkey
        var defaultAnchors = { sailing_ship: 0.27, hand: 0.51, elephant: 0.74 };
        if (Math.hypot(gazeX - dwellAnchorX, gazeY - dwellAnchorY) < 0.03 && defaultAnchors[fig.id]) {
          gazeX = defaultAnchors[fig.id];
          gazeY = 0.37;
        }
      }
      dwellAnchorX = gazeX;
      dwellAnchorY = gazeY;
      gazeEngaged = true;
      finalizeCrystallization(fig);
      renderFrame();
      scheduleNextTick();
      return cloneFigure(fig, {
        gaze: { nx: dwellAnchorX, ny: dwellAnchorY },
        saturation: discourseSaturation
      });
    }

    function setSaturation(val) {
      discourseSaturation = clamp01(val);
      syncHud();
      renderFrame();
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      if (plateEl) {
        plateEl.setAttribute('data-reduced-motion', String(reducedMotion));
      }
      if (reducedMotion && rafId && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (!reducedMotion && stepTimerId) {
        clearTimeout(stepTimerId);
        stepTimerId = null;
      }
      lastTs = 0;
      renderFrame();
      scheduleNextTick();
    }

    function reset() {
      recognizedSet.clear();
      activeFigureId = null;
      shearingGhost = null;
      dwellElapsedMs = 0;
      morphProgress = 0;
      pendingFigureIndex = 0;
      gazeX = 0.48;
      gazeY = 0.37;
      dwellAnchorX = gazeX;
      dwellAnchorY = gazeY;
      syncHud();
      setPlacard(
        'drift',
        'OPEN SKY',
        'Outside Tamara the land stretches empty to the horizon. Hold your gaze upon the speeding clouds — your conditioned eye is already intent on recognizing figures.'
      );
      renderFrame();
      scheduleNextTick();
    }

    // Pointer & Keyboard Handlers
    function handleCanvasPointer(ev) {
      var rect = canvasEl.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var nx = (ev.clientX - rect.left) / rect.width;
      var ny = (ev.clientY - rect.top) / rect.height;
      if (ny <= HORIZON_NY + 0.04) {
        updateGazeInternal(nx, Math.min(ny, HORIZON_NY - 0.08), true);
      }
    }

    function onCanvasClick(ev) {
      handleCanvasPointer(ev);
      if (plateEl && typeof plateEl.focus === 'function') {
        try {
          plateEl.focus({ preventScroll: true });
        } catch (_e) {
          plateEl.focus();
        }
      }
    }

    function onPlateKeyDown(ev) {
      // Do NOT hijack global 1/2/3/M shortcuts used by parent folio
      if (ev.key === 'ArrowLeft') {
        ev.preventDefault();
        moveGaze(-0.065, 0);
      } else if (ev.key === 'ArrowRight') {
        ev.preventDefault();
        moveGaze(0.065, 0);
      } else if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        moveGaze(0, -0.055);
      } else if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        moveGaze(0, 0.055);
      } else if ((ev.key === 'Enter' || ev.key === ' ') && ev.target === plateEl) {
        ev.preventDefault();
        crystallizeFigure();
      } else if ((ev.key === 'c' || ev.key === 'C') && !ev.metaKey && !ev.ctrlKey && !ev.altKey) {
        ev.preventDefault();
        crystallizeFigure();
      }
    }

    function onHudClick(ev) {
      var pill = ev.target.closest ? ev.target.closest('.xylo-figure-pill') : null;
      if (pill) {
        crystallizeFigure(pill.getAttribute('data-pill-fig'));
      }
    }

    canvasEl.addEventListener('pointermove', handleCanvasPointer);
    canvasEl.addEventListener('pointerdown', onCanvasClick);
    plateEl.addEventListener('keydown', onPlateKeyDown);
    plateEl.addEventListener('click', onHudClick);

    function resize() {
      if (destroyed || !skyStageEl || !canvasEl) return;
      var rect = skyStageEl.getBoundingClientRect();
      viewW = Math.max(240, Math.round(rect.width || 800));
      viewH = Math.max(180, Math.round(rect.height || 420));
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      canvasEl.width = Math.round(viewW * dpr);
      canvasEl.height = Math.round(viewH * dpr);
      renderFrame();
    }

    var resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(function () { resize(); });
      resizeObserver.observe(skyStageEl);
    } else if (typeof global.addEventListener === 'function') {
      global.addEventListener('resize', resize);
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      if (rafId && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(rafId);
      }
      if (stepTimerId) {
        clearTimeout(stepTimerId);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      } else if (typeof global.removeEventListener === 'function') {
        global.removeEventListener('resize', resize);
      }
      canvasEl.removeEventListener('pointermove', handleCanvasPointer);
      canvasEl.removeEventListener('pointerdown', onCanvasClick);
      plateEl.removeEventListener('keydown', onPlateKeyDown);
      plateEl.removeEventListener('click', onHudClick);
      containerEl.innerHTML = '';
    }

    syncHud();
    resize();
    scheduleNextTick();

    return {
      resize: resize,
      setGaze: setGaze,
      moveGaze: moveGaze,
      crystallizeFigure: crystallizeFigure,
      setSaturation: setSaturation,
      setReducedMotion: setReducedMotion,
      getState: getState,
      reset: reset,
      destroy: destroy
    };
  }

  /* --------------------------------------------------------------------------
   * Public Global Export
   * -------------------------------------------------------------------------- */
  global.TamaraPareidoliaHorizon = {
    PALETTE: PALETTE,
    WILDERNESS_SIGNS: WILDERNESS_SIGNS,
    CLOUD_FIGURES: CLOUD_FIGURES,
    getWildernessSigns: function () { return WILDERNESS_SIGNS.map(cloneSign); },
    getCloudFigures: function () { return CLOUD_FIGURES.map(function (f) { return cloneFigure(f); }); },
    mountWilderness: mountWilderness,
    mountHorizon: mountHorizon
  };
})(typeof window !== 'undefined' ? window : globalThis);
