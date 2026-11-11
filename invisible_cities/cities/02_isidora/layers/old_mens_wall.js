/**
 * City 02: ISIDORA (Cities & Memory 2) — Foreground Chronological Ratchet & Old Men's Wall
 * File: layers/old_mens_wall.js
 *
 * Self-contained browser JS IIFE attaching `window.IsidoraOldMensWall`.
 * Zero external dependencies and plain classic-script syntax so it can be
 * inlined directly into standalone index.html.
 *
 * Interface Contract:
 *   window.IsidoraOldMensWall.create({ onStateChange, reducedMotion }) => {
 *     mount({ wildCanvasEl, wallCanvasEl, parapetRootEl }),
 *     advanceWildRide(step = 0.25),
 *     completeWildRide(),
 *     recordDesire({ station, deltaAge, label, memoryEcho, intensity }),
 *     getState(),
 *     setReducedMotion(reduced),
 *     resize(width, height),
 *     destroy()
 *   }
 *
 * Viewport Transform Ranges (ageProgress 0.00 -> 1.00):
 *   distanceScale:      1.00 -> 0.62   (receding spiral scale across the square)
 *   recessionY:          0.0 -> -44.0  (upward px shift behind rising parapet)
 *   sepia:              0.00 -> 0.86   (warm limestone memory patina)
 *   parapetHeightRatio: 0.14 -> 0.42   (foreground wall height ratio)
 *   memoryFilterHz:    14000 -> 950    (piazza low-pass acoustic filter cutoff Hz)
 */
(function (global) {
  'use strict';

  var TAU = Math.PI * 2;

  var ROMAN_NUMERALS = [
    'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
    'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX'
  ];

  var STATION_META = {
    spiral: {
      sigil: 'I · Whorl',
      defaultLabel: 'Calcified Nautilus Stairwell',
      defaultEcho: 'Each seashell step climbed in desire settles behind him in pale limestone.',
      emblem: 'shell'
    },
    violin: {
      sigil: 'II · Fifths',
      defaultLabel: 'Resonant Fifths on Spruce',
      defaultEcho: 'Perfect fifths plucked for youth drift across the dusk square as remembered resonance.',
      emblem: 'violin'
    },
    telescope: {
      sigil: 'III · Vernier',
      defaultLabel: 'Vernier Brass Refractor',
      defaultEcho: 'Distant constellations brought to razor focus recede beyond the piazza parapet.',
      emblem: 'telescope'
    },
    hesitation: {
      sigil: 'IV · Loggia',
      defaultLabel: 'Loggia of the Third Woman',
      defaultEcho: 'Hesitating between two silhouettes, he recalls the third parting the amber shadow.',
      emblem: 'loggia'
    },
    cockfight: {
      sigil: 'V · Chalk Pit',
      defaultLabel: 'Chalked Pit & Crimson Plume',
      defaultEcho: 'Bloody tumult among the bettors subsides into a quiet scar on weathered stone.',
      emblem: 'plume'
    }
  };

  // Seven permanent cloaked old men + one open stone seat (slot 4) awaiting the traveler = 8 stone niches.
  var SEAT_SLOTS = [
    {
      slotIndex: 0,
      role: 'elder',
      elderId: 1,
      epithet: 'Elder of the Olivewood Cane',
      cloakTone: '#2c2520',
      shawlTone: '#473c31',
      shoulderWidth: 1.02,
      stature: 0.94,
      headTilt: 0.14,
      prop: 'cane-left',
      beardLen: 0.85
    },
    {
      slotIndex: 1,
      role: 'elder',
      elderId: 2,
      epithet: 'Elder of the Slack Lute',
      cloakTone: '#25211f',
      shawlTone: '#3f362d',
      shoulderWidth: 0.96,
      stature: 1.03,
      headTilt: 0.10,
      prop: 'lute-knee',
      beardLen: 0.60
    },
    {
      slotIndex: 2,
      role: 'elder',
      elderId: 3,
      epithet: 'Elder of the Folded Mantle',
      cloakTone: '#312922',
      shawlTone: '#514437',
      shoulderWidth: 1.08,
      stature: 0.98,
      headTilt: 0.06,
      prop: 'folded-arms',
      beardLen: 0.95
    },
    {
      slotIndex: 3,
      role: 'elder',
      elderId: 4,
      epithet: 'Elder Leaning Toward the Square',
      cloakTone: '#28221d',
      shawlTone: '#483d32',
      shoulderWidth: 1.00,
      stature: 0.92,
      headTilt: 0.18,
      prop: 'ledge-hand',
      beardLen: 0.72
    },
    {
      slotIndex: 4,
      role: 'traveler-seat',
      elderId: null,
      epithet: 'Open Limestone Seat in the Row',
      cloakTone: '#2f261e',
      shawlTone: '#5a4836',
      shoulderWidth: 1.02,
      stature: 0.99,
      headTilt: 0.04,
      prop: 'traveler-cloak',
      beardLen: 0.68
    },
    {
      slotIndex: 5,
      role: 'elder',
      elderId: 5,
      epithet: 'Elder with Collapsed Spyglass',
      cloakTone: '#24201d',
      shawlTone: '#42382e',
      shoulderWidth: 0.98,
      stature: 1.01,
      headTilt: -0.12,
      prop: 'spyglass-lap',
      beardLen: 0.78
    },
    {
      slotIndex: 6,
      role: 'elder',
      elderId: 6,
      epithet: 'Elder of the Silver Hood',
      cloakTone: '#2e2721',
      shawlTone: '#4d4033',
      shoulderWidth: 1.04,
      stature: 0.90,
      headTilt: -0.09,
      prop: 'clasped-hands',
      beardLen: 1.00
    },
    {
      slotIndex: 7,
      role: 'elder',
      elderId: 7,
      epithet: 'Elder at the Eastern Pier',
      cloakTone: '#221d1a',
      shawlTone: '#3c332b',
      shoulderWidth: 0.97,
      stature: 1.04,
      headTilt: -0.16,
      prop: 'cane-right',
      beardLen: 0.66
    }
  ];

  var PERMANENT_ELDER_COUNT = 7;

  function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
  }

  function clamp01(val) {
    return clamp(val, 0, 1);
  }

  function round4(val) {
    return Math.round(val * 10000) / 10000;
  }

  function smoothstep(edge0, edge1, x) {
    var t = clamp01((x - edge0) / (edge1 - edge0 || 1));
    return t * t * (3 - 2 * t);
  }

  function toRoman(num) {
    if (num >= 1 && num <= ROMAN_NUMERALS.length) {
      return ROMAN_NUMERALS[num - 1];
    }
    return String(num);
  }

  function registerCustomTag(tagName) {
    if (
      typeof customElements !== 'undefined' &&
      typeof HTMLElement !== 'undefined' &&
      !customElements.get(tagName)
    ) {
      try {
        customElements.define(tagName, class extends HTMLElement {});
      } catch (_) {
        // Safe fallback in restricted or non-browser environments.
      }
    }
  }

  function drawEllipsePath(ctx, cx, cy, rx, ry, rot, a0, a1) {
    if (typeof ctx.ellipse === 'function') {
      ctx.ellipse(cx, cy, rx, ry, rot, a0, a1);
      return;
    }
    ctx.save();
    ctx.translate(cx, cy);
    if (rot) ctx.rotate(rot);
    ctx.scale(rx, ry);
    ctx.arc(0, 0, 1, a0, a1);
    ctx.restore();
  }

  function makeLinearGradient(ctx, x0, y0, x1, y1, stops, fallbackColor) {
    if (typeof ctx.createLinearGradient === 'function') {
      var grad = ctx.createLinearGradient(x0, y0, x1, y1);
      if (grad && typeof grad.addColorStop === 'function') {
        for (var i = 0; i < stops.length; i++) {
          grad.addColorStop(stops[i][0], stops[i][1]);
        }
        return grad;
      }
    }
    return fallbackColor;
  }

  function makeRadialGradient(ctx, x0, y0, r0, x1, y1, r1, stops, fallbackColor) {
    if (typeof ctx.createRadialGradient === 'function') {
      var grad = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
      if (grad && typeof grad.addColorStop === 'function') {
        for (var i = 0; i < stops.length; i++) {
          grad.addColorStop(stops[i][0], stops[i][1]);
        }
        return grad;
      }
    }
    return fallbackColor;
  }

  function ensureBaseParapetStyles() {
    if (typeof document === 'undefined' || !document.head || typeof document.createElement !== 'function') {
      return;
    }
    if (document.querySelector && document.querySelector('style[data-isidora-wall-ledger]')) {
      return;
    }
    var styleEl = document.createElement('style');
    if (styleEl.setAttribute) {
      styleEl.setAttribute('data-isidora-wall-ledger', '1');
    }
    // Zero-specificity :where() defaults so weaver CSS overrides effortlessly while standalone stays crisp.
    styleEl.textContent = [
      ':where(parapet-frieze-band.isidora-parapet-ledger){display:flex;flex-direction:column;gap:6px;width:100%;box-sizing:border-box;font-family:Georgia,"Palatino Linotype",serif;color:#dfd2ba;pointer-events:auto;}',
      ':where(elder-seat-bench.isidora-seat-frieze-row){display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:4px;align-items:end;width:100%;box-sizing:border-box;}',
      ':where(elder-row-seat){display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:22px;padding:2px 4px;border:1px solid rgba(207,188,152,0.22);background:rgba(24,19,15,0.68);color:rgba(223,210,186,0.82);font-size:10px;line-height:1.15;letter-spacing:0.04em;text-align:center;box-sizing:border-box;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
      ':where(elder-row-seat[data-role="traveler-seat"][data-occupied="false"]){border-style:dashed;border-color:rgba(235,208,154,0.55);color:#f0d7a4;background:rgba(58,43,26,0.45);}',
      ':where(elder-row-seat[data-role="traveler-seat"][data-occupied="true"]){border-style:solid;border-color:rgba(232,198,136,0.82);color:#f7e5be;background:rgba(76,56,34,0.74);}',
      ':where(passing-youth-frieze){display:flex;align-items:center;justify-content:space-between;gap:8px;padding:3px 8px;border-left:2px solid rgba(226,194,136,0.55);background:rgba(20,16,13,0.66);font-size:11px;line-height:1.25;color:#d9cab0;box-sizing:border-box;}',
      ':where(memory-inscription-ledge){display:flex;flex-wrap:nowrap;gap:6px;overflow-x:auto;overflow-y:hidden;padding:4px 2px;min-height:28px;scrollbar-width:thin;box-sizing:border-box;}',
      ':where(carved-memory-tablet.isidora-memory-chisel){display:block;flex:0 0 auto;max-width:250px;padding:4px 8px;border:1px solid rgba(198,177,140,0.34);background:rgba(30,24,19,0.82);color:#e4d6bc;font-size:11px;line-height:1.25;box-sizing:border-box;}',
      ':where(.isidora-memory-chisel-head){display:block;font-size:10px;letter-spacing:0.06em;text-transform:uppercase;color:#cbb082;margin-bottom:1px;}',
      ':where(.isidora-memory-chisel-echo){display:block;font-style:italic;color:#dfd3bd;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
      ':where(.isidora-memory-awaiting){font-size:11px;font-style:italic;color:rgba(217,202,176,0.68);padding:2px 6px;}'
    ].join('\n');
    document.head.appendChild(styleEl);
  }

  function createSeededStars(count) {
    var stars = [];
    var seed = 20202;
    for (var i = 0; i < count; i++) {
      seed = (seed * 16807) % 2147483647;
      var sx = (seed % 10000) / 10000;
      seed = (seed * 16807) % 2147483647;
      var sy = ((seed % 10000) / 10000) * 0.48;
      seed = (seed * 16807) % 2147483647;
      var radius = 0.55 + ((seed % 1000) / 1000) * 1.35;
      seed = (seed * 16807) % 2147483647;
      var phase = ((seed % 1000) / 1000) * TAU;
      stars.push({ x: sx, y: sy, r: radius, phase: phase });
    }
    return stars;
  }

  function createWildDust(count) {
    var motes = [];
    var seed = 9187;
    for (var i = 0; i < count; i++) {
      seed = (seed * 48271) % 2147483647;
      var u = (seed % 10000) / 10000;
      seed = (seed * 48271) % 2147483647;
      var v = 0.36 + ((seed % 10000) / 10000) * 0.58;
      seed = (seed * 48271) % 2147483647;
      var speed = 0.04 + ((seed % 1000) / 1000) * 0.12;
      seed = (seed * 48271) % 2147483647;
      var len = 8 + ((seed % 1000) / 1000) * 26;
      motes.push({ u: u, v: v, speed: speed, len: len });
    }
    return motes;
  }

  function createAmbientYouths() {
    return [
      { id: 0, u: 0.14, depth: 0.22, dir: 1, speed: 0.052, prop: 'violin', strideOffset: 0.2, heightScale: 0.98 },
      { id: 1, u: 0.37, depth: 0.48, dir: -1, speed: 0.044, prop: 'pair', strideOffset: 1.7, heightScale: 0.92 },
      { id: 2, u: 0.61, depth: 0.30, dir: 1, speed: 0.058, prop: 'scroll', strideOffset: 3.1, heightScale: 1.02 },
      { id: 3, u: 0.81, depth: 0.62, dir: -1, speed: 0.049, prop: 'shawl', strideOffset: 4.4, heightScale: 0.88 },
      { id: 4, u: 0.49, depth: 0.16, dir: 1, speed: 0.063, prop: 'lantern', strideOffset: 5.3, heightScale: 1.04 }
    ];
  }

  function detectInitialReducedMotion(explicitFlag) {
    if (typeof explicitFlag === 'boolean') {
      return explicitFlag;
    }
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      try {
        var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        return Boolean(mq && mq.matches);
      } catch (_) {
        return false;
      }
    }
    return false;
  }

  function computePhase(wildProgress, age) {
    if (wildProgress < 1 && age <= 0) {
      return 'wild_ride';
    }
    if (age >= 0.90 - 1e-9) {
      return 'seated_elder';
    }
    if (age >= 0.40 - 1e-9) {
      return 'twilight_drift';
    }
    return 'youth_dream';
  }

  function computeViewportTransform(age) {
    var t = clamp01(age);
    var eased = smoothstep(0, 1, t);
    var distanceScale = round4(1.0 - 0.38 * eased); // 1.00 -> 0.62
    var recessionY = Math.round((-44 * eased) * 100) / 100; // 0 -> -44
    var sepia = round4(0.86 * eased); // 0.00 -> 0.86
    var parapetHeightRatio = round4(0.14 + 0.28 * eased); // 0.14 -> 0.42
    var rawHz = 14000 * Math.pow(950 / 14000, t); // 14000 -> 950 exponential octave glide
    var memoryFilterHz = t <= 0 ? 14000 : (t >= 1 ? 950 : Math.round(rawHz * 10) / 10);
    return {
      distanceScale: distanceScale,
      recessionY: recessionY,
      sepia: sepia,
      parapetHeightRatio: parapetHeightRatio,
      memoryFilterHz: memoryFilterHz
    };
  }

  function create(options) {
    var opts = options || {};
    var onStateChange = typeof opts.onStateChange === 'function' ? opts.onStateChange : null;
    var reducedMotion = detectInitialReducedMotion(opts.reducedMotion);

    // Core strictly monotonic state
    var wildRideProgress = 0;
    var ageProgress = 0;
    var phase = 'wild_ride';
    var isSeatedOnWall = false;
    var travelerSeated = false;
    var viewportTransform = computeViewportTransform(0);

    var carvedMemories = [];
    var dispatchedYouthCount = 0;
    var activeEnvoys = [];
    var ambientYouths = createAmbientYouths();
    var stars = createSeededStars(54);
    var dustMotes = createWildDust(34);

    // Mounted references
    var wildCanvasEl = null;
    var wallCanvasEl = null;
    var parapetRootEl = null;
    var wildBox = { w: 1280, h: 800, dpr: 1 };
    var wallBox = { w: 1280, h: 320, dpr: 1 };

    // Parapet custom DOM references
    var ledgerWrapEl = null;
    var seatRowWrapEl = null;
    var seatEls = [];
    var youthFriezeEl = null;
    var youthStatusSpan = null;
    var youthCountSpan = null;
    var memoryLedgeEl = null;
    var awaitingHintEl = null;

    // Animation & interaction bookkeeping
    var destroyed = false;
    var mounted = false;
    var rafId = null;
    var lastFrameMs = 0;
    var elapsedSec = 0;
    var wildScroll = 0;
    var strideImpulse = 0;
    var resizeObserver = null;
    var pointerDragState = null;

    function getState() {
      var seatedEldersCount = PERMANENT_ELDER_COUNT + (travelerSeated ? 1 : 0);
      var youthsCount = phase === 'wild_ride' ? 0 : ambientYouths.length + activeEnvoys.length;
      return {
        phase: phase,
        wildRideProgress: wildRideProgress,
        ageProgress: ageProgress,
        isSeatedOnWall: isSeatedOnWall,
        eldersInRow: seatedEldersCount,
        travelerSeated: travelerSeated,
        passingYouthsActive: youthsCount,
        dispatchedYouths: dispatchedYouthCount,
        memoriesCarved: carvedMemories.length,
        memoryInscriptions: carvedMemories.map(function (entry) {
          return {
            index: entry.index,
            roman: entry.roman,
            station: entry.station,
            label: entry.label,
            memoryEcho: entry.memoryEcho,
            ageAtCarving: entry.ageAtCarving,
            dispatchedYouth: entry.dispatchedYouth
          };
        }),
        viewportTransform: {
          distanceScale: viewportTransform.distanceScale,
          recessionY: viewportTransform.recessionY,
          sepia: viewportTransform.sepia,
          parapetHeightRatio: viewportTransform.parapetHeightRatio,
          memoryFilterHz: viewportTransform.memoryFilterHz
        }
      };
    }

    function notifyStateChange() {
      if (onStateChange && !destroyed) {
        onStateChange(getState());
      }
    }

    function recalculateDerivedState() {
      phase = computePhase(wildRideProgress, ageProgress);
      if (ageProgress >= 0.90 - 1e-9) {
        isSeatedOnWall = true;
      }
      if (ageProgress >= 0.75 - 1e-9) {
        travelerSeated = true;
      }
      viewportTransform = computeViewportTransform(ageProgress);
    }

    function measureAndSyncCanvases(explicitWidth, explicitHeight) {
      var dpr = 1;
      if (typeof window !== 'undefined' && Number.isFinite(window.devicePixelRatio)) {
        dpr = clamp(window.devicePixelRatio, 1, 2);
      }

      if (wildCanvasEl) {
        var wRect = typeof wildCanvasEl.getBoundingClientRect === 'function'
          ? wildCanvasEl.getBoundingClientRect()
          : { width: 0, height: 0 };
        var ww = Math.round(
          (wRect && wRect.width > 0 ? wRect.width : 0) ||
          explicitWidth ||
          wildCanvasEl.clientWidth ||
          wildCanvasEl.width ||
          1280
        );
        var wh = Math.round(
          (wRect && wRect.height > 0 ? wRect.height : 0) ||
          explicitHeight ||
          wildCanvasEl.clientHeight ||
          wildCanvasEl.height ||
          800
        );
        ww = Math.max(200, ww);
        wh = Math.max(140, wh);
        wildBox = { w: ww, h: wh, dpr: dpr };
        var targetWildW = Math.round(ww * dpr);
        var targetWildH = Math.round(wh * dpr);
        if (wildCanvasEl.width !== targetWildW) wildCanvasEl.width = targetWildW;
        if (wildCanvasEl.height !== targetWildH) wildCanvasEl.height = targetWildH;
      }

      if (wallCanvasEl) {
        var pRect = typeof wallCanvasEl.getBoundingClientRect === 'function'
          ? wallCanvasEl.getBoundingClientRect()
          : { width: 0, height: 0 };
        var pw = Math.round(
          (pRect && pRect.width > 0 ? pRect.width : 0) ||
          explicitWidth ||
          wallCanvasEl.clientWidth ||
          wallCanvasEl.width ||
          1280
        );
        var ph = Math.round(
          (pRect && pRect.height > 0 ? pRect.height : 0) ||
          wallCanvasEl.clientHeight ||
          (explicitHeight ? Math.round(explicitHeight * 0.42) : 0) ||
          wallCanvasEl.height ||
          320
        );
        pw = Math.max(200, pw);
        ph = Math.max(96, ph);
        wallBox = { w: pw, h: ph, dpr: dpr };
        var targetWallW = Math.round(pw * dpr);
        var targetWallH = Math.round(ph * dpr);
        if (wallCanvasEl.width !== targetWallW) wallCanvasEl.width = targetWallW;
        if (wallCanvasEl.height !== targetWallH) wallCanvasEl.height = targetWallH;
      }
    }

    function clearElementChildren(el) {
      if (!el) return;
      if (typeof el.removeChild === 'function') {
        while (el.firstChild) {
          el.removeChild(el.firstChild);
        }
      } else if ('innerHTML' in el) {
        el.innerHTML = '';
      }
    }

    function buildParapetDom() {
      seatEls = [];
      ledgerWrapEl = null;
      seatRowWrapEl = null;
      youthFriezeEl = null;
      youthStatusSpan = null;
      youthCountSpan = null;
      memoryLedgeEl = null;
      awaitingHintEl = null;

      if (!parapetRootEl || typeof document === 'undefined' || typeof document.createElement !== 'function') {
        return;
      }

      registerCustomTag('parapet-frieze-band');
      registerCustomTag('elder-seat-bench');
      registerCustomTag('elder-row-seat');
      registerCustomTag('passing-youth-frieze');
      registerCustomTag('memory-inscription-ledge');
      registerCustomTag('carved-memory-tablet');
      ensureBaseParapetStyles();

      clearElementChildren(parapetRootEl);
      if (parapetRootEl.setAttribute) {
        parapetRootEl.setAttribute('data-phase', phase);
        parapetRootEl.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
      }

      ledgerWrapEl = document.createElement('parapet-frieze-band');
      ledgerWrapEl.className = 'isidora-parapet-ledger';
      if (ledgerWrapEl.setAttribute) {
        ledgerWrapEl.setAttribute('aria-label', 'Parapet wall of the seated elders and chiseled memories');
      }

      // 1. Row of 8 <elder-row-seat> custom elements (7 seated old men + 1 traveler seat)
      seatRowWrapEl = document.createElement('elder-seat-bench');
      seatRowWrapEl.className = 'isidora-seat-frieze-row';
      if (seatRowWrapEl.setAttribute) {
        seatRowWrapEl.setAttribute('role', 'list');
        seatRowWrapEl.setAttribute('aria-label', 'Row of cloaked old men along the square wall');
      }

      for (var i = 0; i < SEAT_SLOTS.length; i++) {
        var slot = SEAT_SLOTS[i];
        var seatEl = document.createElement('elder-row-seat');
        seatEl.className = slot.role === 'traveler-seat'
          ? 'isidora-elder-seat isidora-elder-seat--traveler'
          : 'isidora-elder-seat isidora-elder-seat--resident';
        if (seatEl.setAttribute) {
          seatEl.setAttribute('role', 'listitem');
          seatEl.setAttribute('data-seat-index', String(slot.slotIndex));
          seatEl.setAttribute('data-role', slot.role);
        }
        seatRowWrapEl.appendChild(seatEl);
        seatEls.push(seatEl);
      }
      ledgerWrapEl.appendChild(seatRowWrapEl);

      // 2. <passing-youth-frieze> custom element
      youthFriezeEl = document.createElement('passing-youth-frieze');
      youthFriezeEl.className = 'isidora-youth-frieze';
      if (youthFriezeEl.setAttribute) {
        youthFriezeEl.setAttribute('aria-live', 'polite');
      }
      youthStatusSpan = document.createElement('span');
      youthStatusSpan.className = 'isidora-youth-frieze-narration';
      youthCountSpan = document.createElement('span');
      youthCountSpan.className = 'isidora-youth-frieze-tally';
      youthFriezeEl.appendChild(youthStatusSpan);
      youthFriezeEl.appendChild(youthCountSpan);
      ledgerWrapEl.appendChild(youthFriezeEl);

      // 3. <memory-inscription-ledge> custom element
      memoryLedgeEl = document.createElement('memory-inscription-ledge');
      memoryLedgeEl.className = 'isidora-inscription-ledge';
      if (memoryLedgeEl.setAttribute) {
        memoryLedgeEl.setAttribute('role', 'log');
        memoryLedgeEl.setAttribute('aria-live', 'polite');
        memoryLedgeEl.setAttribute('aria-label', 'Carved limestone memory inscriptions');
      }

      awaitingHintEl = document.createElement('span');
      awaitingHintEl.className = 'isidora-memory-awaiting';
      awaitingHintEl.textContent = 'Unchiselled limestone coping — pursued desires will carve themselves here as memories.';
      memoryLedgeEl.appendChild(awaitingHintEl);

      // Re-populate any memories recorded prior to mount
      if (carvedMemories.length > 0) {
        if (awaitingHintEl.parentNode === memoryLedgeEl) {
          memoryLedgeEl.removeChild(awaitingHintEl);
        }
        for (var m = 0; m < carvedMemories.length; m++) {
          appendInscriptionNode(carvedMemories[m]);
        }
      }

      ledgerWrapEl.appendChild(memoryLedgeEl);
      parapetRootEl.appendChild(ledgerWrapEl);

      syncParapetDom();
    }

    function appendInscriptionNode(record) {
      if (!memoryLedgeEl || typeof document === 'undefined' || typeof document.createElement !== 'function') {
        return;
      }
      if (awaitingHintEl && awaitingHintEl.parentNode === memoryLedgeEl) {
        memoryLedgeEl.removeChild(awaitingHintEl);
      }

      var tabletEl = document.createElement('carved-memory-tablet');
      tabletEl.className = 'isidora-memory-chisel';
      if (tabletEl.setAttribute) {
        tabletEl.setAttribute('data-memory-index', String(record.index));
        tabletEl.setAttribute('data-station', record.station);
        tabletEl.setAttribute('data-youth-dispatched', record.dispatchedYouth ? 'true' : 'false');
      }

      var headEl = document.createElement('cite');
      headEl.className = 'isidora-memory-chisel-head';
      headEl.textContent = record.roman + ' · ' + record.label + (record.dispatchedYouth ? ' · Youth Enacted' : '');

      var echoEl = document.createElement('q');
      echoEl.className = 'isidora-memory-chisel-echo';
      echoEl.textContent = record.memoryEcho;

      tabletEl.appendChild(headEl);
      tabletEl.appendChild(echoEl);
      memoryLedgeEl.appendChild(tabletEl);

      if ('scrollLeft' in memoryLedgeEl && 'scrollWidth' in memoryLedgeEl) {
        memoryLedgeEl.scrollLeft = memoryLedgeEl.scrollWidth;
      }
    }

    function syncParapetDom() {
      if (!parapetRootEl) return;

      if (parapetRootEl.setAttribute) {
        parapetRootEl.setAttribute('data-phase', phase);
        parapetRootEl.setAttribute('data-seated-elder', isSeatedOnWall ? 'true' : 'false');
        parapetRootEl.setAttribute('data-traveler-seated', travelerSeated ? 'true' : 'false');
        parapetRootEl.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
      }

      for (var i = 0; i < seatEls.length; i++) {
        var slot = SEAT_SLOTS[i];
        var seatEl = seatEls[i];
        if (!seatEl) continue;

        if (slot.role === 'traveler-seat') {
          var occupied = travelerSeated;
          if (seatEl.setAttribute) {
            seatEl.setAttribute('data-occupied', occupied ? 'true' : 'false');
            seatEl.setAttribute(
              'aria-label',
              occupied
                ? 'Seat V: Traveler seated in the row of elders watching youth go by'
                : 'Seat V: Open stone seat awaiting the traveler among the elders'
            );
          }
          seatEl.textContent = occupied
            ? (isSeatedOnWall ? 'V · Seated in Row' : 'V · Taking Seat')
            : 'V · Open Seat';
        } else {
          if (seatEl.setAttribute) {
            seatEl.setAttribute('data-occupied', 'true');
            seatEl.setAttribute('aria-label', slot.epithet + ' watching the square');
          }
          seatEl.textContent = toRoman(slot.slotIndex + 1) + ' · Elder ' + slot.elderId;
        }
      }

      if (youthStatusSpan && youthCountSpan) {
        if (phase === 'wild_ride') {
          youthStatusSpan.textContent = 'Riding through wind-scoured wild regions toward the glimmer of a dreamed city.';
          youthCountSpan.textContent = Math.round(wildRideProgress * 100) + '% approach';
        } else if (isSeatedOnWall) {
          var latestSeated = carvedMemories.length > 0 ? carvedMemories[carvedMemories.length - 1] : null;
          youthStatusSpan.textContent = latestSeated
            ? 'Seated in the row of old men; a passing youth crosses toward the spiral (' + latestSeated.label + '). Desires are already memories.'
            : 'Seated in the row of old men along the square wall; the young go by across the flagstones.';
          youthCountSpan.textContent = dispatchedYouthCount + ' enacted · ' + carvedMemories.length + ' carved';
        } else if (ageProgress >= 0.50) {
          youthStatusSpan.textContent = 'From the rising limestone parapet, passing youths carry each new desire toward the receding spiral.';
          youthCountSpan.textContent = dispatchedYouthCount + ' youth dispatched';
        } else {
          youthStatusSpan.textContent = 'Brisk silhouettes of the young cross the square before the row of seven elders and one empty seat.';
          youthCountSpan.textContent = PERMANENT_ELDER_COUNT + ' elders · 1 open seat';
        }
      }
    }

    // =========================================================================
    // Canvas 1: Wild-Region Arrival Ride (wildCanvasEl)
    // =========================================================================

    function renderWildRide() {
      if (!wildCanvasEl || typeof wildCanvasEl.getContext !== 'function') return;
      var ctx = wildCanvasEl.getContext('2d');
      if (!ctx) return;

      var w = wildBox.w;
      var h = wildBox.h;
      var dpr = wildBox.dpr;

      ctx.save();
      if (ctx.setTransform) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      } else {
        ctx.scale(dpr, dpr);
      }
      ctx.clearRect(0, 0, w, h);

      var p = clamp01(wildRideProgress);
      var horizonY = h * (0.54 - 0.04 * p);
      var cityX = w * 0.62;
      var strideBob = reducedMotion
        ? 0
        : Math.sin(wildScroll * 9.5) * (1.4 + 2.8 * strideImpulse) * (1 - 0.35 * p);

      // 1. Nocturnal-to-ochre desert twilight sky
      var skyGrad = makeLinearGradient(ctx, 0, 0, 0, h, [
        [0, '#070b15'],
        [0.34, '#15192b'],
        [0.54, p > 0.5 ? '#593c26' : '#3d281b'],
        [0.68, p > 0.5 ? '#a57543' : '#734d2c'],
        [1, '#120d09']
      ], '#1b1622');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Stars & faint astronomical constellation arcs
      var starAlphaBase = 0.85 - 0.28 * p;
      for (var s = 0; s < stars.length; s++) {
        var st = stars[s];
        var twinkle = reducedMotion ? 0.82 : (0.58 + 0.42 * Math.sin(elapsedSec * 1.7 + st.phase));
        var sx = ((st.x * w - wildScroll * 12) % w + w) % w;
        var sy = st.y * h + strideBob * 0.12;
        if (sy < horizonY - 8) {
          ctx.fillStyle = 'rgba(242, 232, 208, ' + (starAlphaBase * twinkle).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(sx, sy, st.r, 0, TAU);
          ctx.fill();
        }
      }

      // Subtle Lyra/Sextans constellation threads high in the sky
      ctx.strokeStyle = 'rgba(218, 204, 174, ' + (0.14 * starAlphaBase).toFixed(3) + ')';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(w * 0.56, h * 0.16);
      ctx.lineTo(w * 0.61, h * 0.12);
      ctx.lineTo(w * 0.66, h * 0.15);
      ctx.lineTo(w * 0.63, h * 0.21);
      ctx.closePath();
      ctx.stroke();

      // 3. Distant Nacreous Spiral City Glimmering on the Horizon
      var glowRadius = Math.max(w, h) * (0.11 + 0.34 * p);
      var cityGlow = makeRadialGradient(ctx, cityX, horizonY, 2, cityX, horizonY, glowRadius, [
        [0, 'rgba(255, 244, 214, ' + (0.34 + 0.58 * p).toFixed(3) + ')'],
        [0.28, 'rgba(236, 198, 138, ' + (0.18 + 0.36 * p).toFixed(3) + ')'],
        [0.65, 'rgba(158, 106, 58, ' + (0.08 + 0.16 * p).toFixed(3) + ')'],
        [1, 'rgba(18, 13, 10, 0)']
      ], 'rgba(236, 198, 138, 0.16)');
      ctx.fillStyle = cityGlow;
      ctx.fillRect(0, 0, w, h);

      drawDistantSpiralMirage(ctx, cityX, horizonY + strideBob * 0.25, w, h, p);

      // 4. Layered Wind-Scoured Wild Ridges (4 parallax strata)
      drawWildRidgeLayer(ctx, w, h, horizonY + strideBob * 0.30, 0.03, wildScroll * 24, 18, '#38261c', false);
      drawWildRidgeLayer(ctx, w, h, horizonY + h * 0.07 + strideBob * 0.50, 0.05, wildScroll * 52, 26, '#2b1c14', true);
      drawWildRidgeLayer(ctx, w, h, horizonY + h * 0.16 + strideBob * 0.75, 0.07, wildScroll * 96, 34, '#1d130e', true);
      drawWildRidgeLayer(ctx, w, h, horizonY + h * 0.27 + strideBob * 1.00, 0.09, wildScroll * 155, 28, '#110b08', true);

      // 5. Wind-scoured ochre dust streaks
      ctx.lineWidth = 1.1;
      for (var d = 0; d < dustMotes.length; d++) {
        var dm = dustMotes[d];
        var travel = reducedMotion ? wildScroll * 0.45 : (elapsedSec * dm.speed + wildScroll * 0.55);
        var dx = (((dm.u - travel) % 1) + 1) * w;
        var dy = dm.v * h + strideBob * 0.6;
        var alpha = 0.08 + 0.14 * (1 - Math.abs(dm.v - 0.62) * 2);
        ctx.strokeStyle = 'rgba(218, 178, 122, ' + clamp(alpha, 0.03, 0.24).toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(dx, dy);
        ctx.lineTo(dx + dm.len * (0.7 + 0.6 * p), dy - 1.5);
        ctx.stroke();
      }

      // 6. Cloaked Traveler on Horseback Cresting Foreground Wild Ridge
      var riderX = w * (0.23 + 0.13 * p);
      var riderY = horizonY + h * 0.25 + strideBob;
      var riderScale = clamp(Math.min(w, h) / 760, 0.56, 1.18);
      drawWildRiderSilhouette(ctx, riderX, riderY, riderScale, wildScroll, p, reducedMotion);

      // 7. Arrival threshold nacre veil as wildRideProgress -> 1.0
      if (p > 0.82) {
        var veilT = smoothstep(0.82, 1.0, p);
        ctx.fillStyle = 'rgba(244, 228, 195, ' + (0.28 * veilT).toFixed(3) + ')';
        ctx.fillRect(0, 0, w, h);
      }

      ctx.restore();
    }

    function drawDistantSpiralMirage(ctx, cx, baseY, w, h, p) {
      var unit = Math.min(w, h) * (0.045 + 0.075 * p);
      var tiers = 6;

      ctx.save();
      // Rising spiral ziggurat & shell-domes of dreamed Isidora
      for (var t = 0; t < tiers; t++) {
        var frac = t / tiers;
        var tierW = unit * (2.1 - frac * 1.48);
        var tierH = unit * (0.28 + frac * 0.11);
        var tierY = baseY - t * unit * 0.27;
        var spiralShift = Math.sin(t * 1.15 + p * 1.8) * unit * 0.16 * (1 - frac * 0.5);

        ctx.fillStyle = 'rgba(246, 231, 198, ' + (0.26 + 0.54 * p * (1 - frac * 0.25)).toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(cx - tierW * 0.5 + spiralShift, tierY);
        ctx.lineTo(cx - tierW * 0.42 + spiralShift, tierY - tierH);
        ctx.lineTo(cx + tierW * 0.42 + spiralShift, tierY - tierH);
        ctx.lineTo(cx + tierW * 0.5 + spiralShift, tierY);
        ctx.closePath();
        ctx.fill();

        // Nacreous shell-arch ribbing
        ctx.strokeStyle = 'rgba(255, 248, 228, ' + (0.22 + 0.55 * p).toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx + spiralShift, tierY - tierH, tierW * 0.22, Math.PI, 0);
        ctx.stroke();
      }

      // Crown astronomical cupola & spire
      var apexY = baseY - tiers * unit * 0.27;
      ctx.fillStyle = 'rgba(255, 247, 224, ' + (0.42 + 0.55 * p).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(cx, apexY - unit * 0.08, unit * 0.18, Math.PI, 0);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 247, 224, ' + (0.50 + 0.48 * p).toFixed(3) + ')';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(cx, apexY - unit * 0.26);
      ctx.lineTo(cx, apexY - unit * 0.62);
      ctx.stroke();

      // Golden logarithmic aura ribbon coiling around the dreamed city
      ctx.strokeStyle = 'rgba(248, 224, 174, ' + (0.18 + 0.44 * p).toFixed(3) + ')';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (var a = 0; a <= 42; a++) {
        var theta = (a / 42) * Math.PI * 3.4;
        var rad = unit * 0.09 * Math.exp(0.19 * theta);
        var gx = cx + Math.cos(theta - p * 1.4) * rad;
        var gy = baseY - unit * 0.72 + Math.sin(theta - p * 1.4) * rad * 0.36;
        if (a === 0) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawWildRidgeLayer(ctx, w, h, baseLineY, freq, phaseShift, amp, fillHex, withScrub) {
      ctx.save();
      ctx.fillStyle = fillHex;
      ctx.beginPath();
      ctx.moveTo(0, h);
      var steps = Math.max(40, Math.round(w / 18));
      for (var i = 0; i <= steps; i++) {
        var x = (i / steps) * w;
        var wx = x + phaseShift;
        var mesa = Math.sin(wx * 0.0042 * (1 + freq * 6)) * amp
          + Math.sin(wx * 0.011 + 1.7) * (amp * 0.42)
          + Math.cos(wx * 0.023 + 0.6) * (amp * 0.16);
        var y = baseLineY + mesa;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      if (withScrub) {
        ctx.strokeStyle = fillHex;
        ctx.lineWidth = 1.2;
        for (var k = 0; k < 14; k++) {
          var sx = (((k * 137 - phaseShift * 0.9) % w) + w) % w;
          var swx = sx + phaseShift;
          var sy = baseLineY
            + Math.sin(swx * 0.0042 * (1 + freq * 6)) * amp
            + Math.sin(swx * 0.011 + 1.7) * (amp * 0.42);
          ctx.beginPath();
          ctx.moveTo(sx, sy + 2);
          ctx.lineTo(sx - 4, sy - 6);
          ctx.moveTo(sx, sy + 2);
          ctx.lineTo(sx + 1, sy - 8);
          ctx.moveTo(sx, sy + 2);
          ctx.lineTo(sx + 5, sy - 5);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawWildRiderSilhouette(ctx, x, y, scale, scrollVal, p, isStatic) {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      var gait = isStatic ? 0.35 : (scrollVal * 8.5 + elapsedSec * 2.4);
      var cloakFlutter = isStatic ? 0 : Math.sin(gait * 1.3) * 4;

      // Subtle rim glow facing the distant city
      ctx.strokeStyle = 'rgba(235, 196, 134, ' + (0.28 + 0.38 * p).toFixed(3) + ')';
      ctx.lineWidth = 1.6;

      // Horse body & neck oriented right toward Isidora
      ctx.fillStyle = '#0d0907';
      ctx.beginPath();
      drawEllipsePath(ctx, 0, 0, 32, 13, -0.06, 0, TAU);
      ctx.fill();

      // Horse neck & head lifted toward horizon
      ctx.beginPath();
      ctx.moveTo(18, -6);
      ctx.quadraticCurveTo(33, -24, 38, -32);
      ctx.lineTo(48, -26);
      ctx.lineTo(44, -19);
      ctx.quadraticCurveTo(34, -14, 26, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Four striding legs
      var legAngles = [
        Math.sin(gait) * 0.34,
        Math.sin(gait + Math.PI) * 0.32,
        Math.sin(gait + Math.PI * 0.5) * 0.34,
        Math.sin(gait + Math.PI * 1.5) * 0.30
      ];
      var hipX = [-20, -13, 15, 22];
      ctx.strokeStyle = '#0d0907';
      ctx.lineWidth = 4.2;
      ctx.lineCap = 'round';
      for (var l = 0; l < 4; l++) {
        var hx = hipX[l];
        var ang = legAngles[l];
        var kx = hx + Math.sin(ang) * 15;
        var ky = 9 + Math.cos(ang) * 14;
        var fx = kx + Math.sin(ang * 0.7 - 0.18) * 13;
        var fy = ky + 14;
        ctx.beginPath();
        ctx.moveTo(hx, 8);
        ctx.lineTo(kx, ky);
        ctx.lineTo(fx, fy);
        ctx.stroke();
      }

      // Flowing tail
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(-30, -3);
      ctx.quadraticCurveTo(-46, 2 + cloakFlutter * 0.5, -52, 16);
      ctx.stroke();

      // Young traveler silhouette in wind-swept cloak gazing toward the spiral city
      ctx.fillStyle = '#140e0b';
      ctx.beginPath();
      ctx.moveTo(-6, -10);
      ctx.quadraticCurveTo(-28, -14 + cloakFlutter, -38, 2 + cloakFlutter);
      ctx.quadraticCurveTo(-18, -2, -2, -6);
      ctx.closePath();
      ctx.fill();

      // Torso & hooded head
      ctx.beginPath();
      ctx.moveTo(-5, -9);
      ctx.lineTo(-1, -34);
      ctx.lineTo(9, -32);
      ctx.lineTo(8, -9);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(5, -40, 6.2, 0, TAU);
      ctx.fill();

      // Nacre highlight along traveler's brow and shoulder facing the city
      ctx.strokeStyle = 'rgba(246, 218, 168, ' + (0.35 + 0.45 * p).toFixed(3) + ')';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(9, -44);
      ctx.quadraticCurveTo(13, -36, 9, -20);
      ctx.stroke();

      ctx.restore();
    }

    // =========================================================================
    // Canvas 2: The Square, Passing Youths & Old Men's Limestone Wall (wallCanvasEl)
    // =========================================================================

    function renderSquareAndWall() {
      if (!wallCanvasEl || typeof wallCanvasEl.getContext !== 'function') return;
      var ctx = wallCanvasEl.getContext('2d');
      if (!ctx) return;

      var w = wallBox.w;
      var h = wallBox.h;
      var dpr = wallBox.dpr;

      ctx.save();
      if (ctx.setTransform) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      } else {
        ctx.scale(dpr, dpr);
      }
      ctx.clearRect(0, 0, w, h);

      if (phase === 'wild_ride') {
        ctx.restore();
        return;
      }

      var age = clamp01(ageProgress);
      var isFullStageOverlay = h > 430 && h > w * 0.46;

      // Adaptive vertical geometry: transparent upper stage when full-screen overlay,
      // full frieze proportions when mounted inside a bottom parapet strip.
      var activeBandRatio = isFullStageOverlay
        ? viewportTransform.parapetHeightRatio
        : (0.64 + 0.30 * smoothstep(0, 1, age));

      var bandH = h * activeBandRatio;
      var piazzaTopY = h - bandH;
      var copingY = h - bandH * 0.52;
      var wallBottomY = h;

      // 1. Foreshortened Piazza Flagstones in front of the wall
      drawPiazzaPromenade(ctx, w, h, piazzaTopY, copingY, age);

      // 2. Dispatched Youth Envoys moving across the square toward the distant spiral (age >= 0.50)
      drawDispatchedYouthEnvoys(ctx, w, h, piazzaTopY, copingY, age);

      // 3. Brisk Silhouettes of the Young Walking Past Across the Square
      drawPassingYouthSilhouettes(ctx, w, piazzaTopY, copingY, age);

      // 4. Weathered Limestone Parapet Wall rising across the foreground square
      drawLimestoneParapetWall(ctx, w, copingY, wallBottomY, age);

      // 5. Row of >=7 Distinct Cloaked Old Men + Open Seat / Seated Traveler
      drawSeatedEldersRow(ctx, w, copingY, wallBottomY, age);

      ctx.restore();
    }

    function drawPiazzaPromenade(ctx, w, h, piazzaTopY, copingY, age) {
      var depthH = Math.max(18, copingY - piazzaTopY);
      var grad = makeLinearGradient(ctx, 0, piazzaTopY - depthH * 0.35, 0, copingY + 8, [
        [0, 'rgba(32, 25, 19, 0)'],
        [0.26, 'rgba(46, 36, 27, ' + (0.28 + 0.34 * age).toFixed(3) + ')'],
        [0.75, 'rgba(66, 52, 38, ' + (0.58 + 0.28 * age).toFixed(3) + ')'],
        [1, 'rgba(38, 29, 21, ' + (0.78 + 0.18 * age).toFixed(3) + ')']
      ], 'rgba(54, 42, 31, 0.65)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, Math.max(0, piazzaTopY - depthH * 0.35), w, copingY - Math.max(0, piazzaTopY - depthH * 0.35) + 6);

      // Perspective flagstone courses converging toward the distant spiral center
      var vanishX = w * 0.5;
      var vanishY = piazzaTopY - depthH * 1.35;
      ctx.strokeStyle = 'rgba(216, 194, 156, ' + (0.11 + 0.12 * age).toFixed(3) + ')';
      ctx.lineWidth = 1;

      var radialCount = w < 520 ? 9 : 15;
      for (var r = 0; r <= radialCount; r++) {
        var bx = (r / radialCount) * w;
        var tx = vanishX + (bx - vanishX) * 0.42;
        ctx.beginPath();
        ctx.moveTo(tx, piazzaTopY);
        ctx.lineTo(bx, copingY);
        ctx.stroke();
      }

      for (var row = 1; row <= 3; row++) {
        var ry = piazzaTopY + Math.pow(row / 4, 1.35) * depthH;
        ctx.beginPath();
        ctx.moveTo(0, ry);
        ctx.lineTo(w, ry);
        ctx.stroke();
      }
    }

    function drawPassingYouthSilhouettes(ctx, w, piazzaTopY, copingY, age) {
      var promenadeSpan = Math.max(16, copingY - piazzaTopY);
      var compactScale = w < 520 ? 0.72 : 1.0;
      var baseFigureH = clamp(promenadeSpan * 0.62 * compactScale, 20, 56);

      for (var i = 0; i < ambientYouths.length; i++) {
        var youth = ambientYouths[i];
        var travelU = reducedMotion
          ? youth.u
          : (((youth.u + youth.dir * elapsedSec * youth.speed) % 1.16) + 1.16) % 1.16 - 0.08;
        var x = travelU * w;
        var y = piazzaTopY + promenadeSpan * (0.30 + 0.54 * youth.depth);
        var figH = baseFigureH * (0.78 + 0.28 * youth.depth) * youth.heightScale;
        var stride = reducedMotion ? (0.45 + i * 0.3) : (elapsedSec * 7.4 + youth.strideOffset);

        drawSingleYouthSilhouette(ctx, x, y, figH, youth.dir, stride, youth.prop, false, age);
      }
    }

    function drawDispatchedYouthEnvoys(ctx, w, h, piazzaTopY, copingY, age) {
      if (activeEnvoys.length === 0) return;

      var vanishX = w * 0.5;
      var farY = Math.max(8, piazzaTopY - Math.max(14, (copingY - piazzaTopY) * 0.22));
      var seatFiveX = getSeatCenterX(4, w);

      for (var i = 0; i < activeEnvoys.length; i++) {
        var env = activeEnvoys[i];
        var t = reducedMotion ? 0.52 : clamp01(env.progress);
        var ex = seatFiveX + (vanishX - seatFiveX) * smoothstep(0, 1, t) + Math.sin(t * Math.PI) * env.arcOffset;
        var ey = (copingY - 6) + (farY - (copingY - 6)) * smoothstep(0, 1, t);
        var scalePerspective = 1.0 - 0.52 * t;
        var figH = clamp((copingY - piazzaTopY) * 0.72, 24, 62) * scalePerspective;
        var fadeAlpha = t > 0.85 ? (1 - (t - 0.85) / 0.15) : 1;

        ctx.save();
        ctx.globalAlpha = clamp01(fadeAlpha);

        // Sightline arc from Traveler's stone seat across the flagstones to the receding youth
        ctx.strokeStyle = 'rgba(246, 218, 160, 0.38)';
        ctx.lineWidth = 1.15;
        if (ctx.setLineDash) ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(seatFiveX, copingY - 4);
        ctx.quadraticCurveTo((seatFiveX + ex) * 0.5, (copingY + ey) * 0.5 - 10, ex, ey - figH * 0.45);
        ctx.stroke();
        if (ctx.setLineDash) ctx.setLineDash([]);

        // Nacreous halo around dispatched youth enacting the remembered desire
        var aura = makeRadialGradient(ctx, ex, ey - figH * 0.5, 1, ex, ey - figH * 0.5, figH * 0.95, [
          [0, 'rgba(255, 238, 194, 0.52)'],
          [1, 'rgba(255, 238, 194, 0)']
        ], 'rgba(255, 238, 194, 0.28)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(ex, ey - figH * 0.5, figH * 0.95, 0, TAU);
        ctx.fill();

        var stride = reducedMotion ? 0.6 : (elapsedSec * 9.0 + env.seed);
        drawSingleYouthSilhouette(ctx, ex, ey, figH, ex < vanishX ? 1 : -1, stride, env.emblem, true, age);
        ctx.restore();
      }
    }

    function drawSingleYouthSilhouette(ctx, x, footY, figH, dir, stride, prop, highlighted, age) {
      ctx.save();
      ctx.translate(x, footY);
      ctx.scale(dir >= 0 ? 1 : -1, 1);

      var u = figH / 40;
      var legSwing = Math.sin(stride) * 5.2 * u;

      // Slanting evening shadow on flagstones
      ctx.fillStyle = 'rgba(12, 9, 7, ' + (0.24 + 0.22 * age).toFixed(3) + ')';
      ctx.beginPath();
      drawEllipsePath(ctx, 3 * u, 1.5 * u, 8.5 * u, 2.4 * u, 0, 0, TAU);
      ctx.fill();

      var bodyFill = highlighted ? '#2d2116' : '#1b1511';
      var rimStroke = highlighted
        ? 'rgba(255, 236, 188, 0.92)'
        : 'rgba(235, 206, 156, ' + (0.42 + 0.24 * (1 - age * 0.4)).toFixed(3) + ')';

      ctx.strokeStyle = bodyFill;
      ctx.lineWidth = Math.max(1.5, 2.6 * u);
      ctx.lineCap = 'round';

      // Brisk striding legs
      ctx.beginPath();
      ctx.moveTo(0, -16 * u);
      ctx.lineTo(legSwing, 0);
      ctx.moveTo(0, -16 * u);
      ctx.lineTo(-legSwing, 0);
      ctx.stroke();

      // Lithe coat / tunic silhouette
      ctx.fillStyle = bodyFill;
      ctx.beginPath();
      ctx.moveTo(-4.2 * u, -15 * u);
      ctx.lineTo(-2.8 * u, -31 * u);
      ctx.lineTo(3.4 * u, -31 * u);
      ctx.lineTo(5.2 * u, -14 * u);
      ctx.closePath();
      ctx.fill();

      // Head
      ctx.beginPath();
      ctx.arc(0.8 * u, -35.2 * u, 3.4 * u, 0, TAU);
      ctx.fill();

      // Flowing scarf / rim light
      ctx.strokeStyle = rimStroke;
      ctx.lineWidth = Math.max(1.0, 1.3 * u);
      ctx.beginPath();
      ctx.moveTo(3.2 * u, -37 * u);
      ctx.lineTo(4.8 * u, -15 * u);
      ctx.moveTo(-2.4 * u, -30 * u);
      ctx.quadraticCurveTo(-9.5 * u, -27 * u + Math.cos(stride) * 2 * u, -13 * u, -23 * u);
      ctx.stroke();

      // Companion silhouette if prop === 'pair' or 'loggia'
      if (prop === 'pair' || prop === 'loggia') {
        ctx.fillStyle = bodyFill;
        ctx.beginPath();
        ctx.arc(-6.5 * u, -33.5 * u, 3.0 * u, 0, TAU);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-9.5 * u, -14 * u);
        ctx.lineTo(-8.2 * u, -29.5 * u);
        ctx.lineTo(-4.2 * u, -29.5 * u);
        ctx.lineTo(-3.2 * u, -14 * u);
        ctx.closePath();
        ctx.fill();
      } else if (prop === 'violin') {
        ctx.strokeStyle = 'rgba(232, 182, 112, 0.85)';
        ctx.lineWidth = Math.max(1, 1.4 * u);
        ctx.beginPath();
        ctx.moveTo(2 * u, -26 * u);
        ctx.lineTo(9.5 * u, -22 * u);
        ctx.stroke();
      } else if (prop === 'telescope' || prop === 'scroll') {
        ctx.strokeStyle = 'rgba(236, 206, 138, 0.88)';
        ctx.lineWidth = Math.max(1.1, 1.6 * u);
        ctx.beginPath();
        ctx.moveTo(2 * u, -28 * u);
        ctx.lineTo(10 * u, -32 * u);
        ctx.stroke();
      } else if (prop === 'shell' || prop === 'lantern') {
        ctx.fillStyle = 'rgba(252, 234, 190, 0.85)';
        ctx.beginPath();
        ctx.arc(6.8 * u, -24 * u, 2.2 * u, 0, TAU);
        ctx.fill();
      } else if (prop === 'plume') {
        ctx.strokeStyle = 'rgba(222, 92, 76, 0.88)';
        ctx.beginPath();
        ctx.moveTo(3 * u, -36 * u);
        ctx.quadraticCurveTo(8 * u, -42 * u, 10 * u, -38 * u);
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawLimestoneParapetWall(ctx, w, copingY, bottomY, age) {
      var wallH = Math.max(24, bottomY - copingY);
      var copingH = clamp(wallH * 0.16, 7, 16);

      // Aged Istrian limestone body gradient
      var stoneGrad = makeLinearGradient(ctx, 0, copingY, 0, bottomY, [
        [0, '#c8b698'],
        [0.14, '#ab9778'],
        [0.22, '#695943'],
        [0.58, '#7e6c53'],
        [1, '#4c3f30']
      ], '#7e6c53');
      ctx.fillStyle = stoneGrad;
      ctx.fillRect(0, copingY, w, wallH);

      // Top beveled limestone seating ledge highlight + overhang shadow
      ctx.fillStyle = 'rgba(244, 231, 204, ' + (0.42 + 0.18 * (1 - age)).toFixed(3) + ')';
      ctx.fillRect(0, copingY, w, 2.2);

      ctx.fillStyle = 'rgba(24, 18, 13, 0.46)';
      ctx.fillRect(0, copingY + copingH, w, 3.5);

      // Ashlar limestone block courses & mortar joints
      var courses = 3;
      var bodyStart = copingY + copingH;
      var bodyH = Math.max(12, bottomY - bodyStart);
      ctx.strokeStyle = 'rgba(42, 33, 24, 0.42)';
      ctx.lineWidth = 1;

      for (var c = 1; c <= courses; c++) {
        var cy = bodyStart + (c / (courses + 1)) * bodyH;
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(w, cy);
        ctx.stroke();
      }

      var blockCols = w < 520 ? 8 : 14;
      var blockW = w / blockCols;
      for (var row = 0; row <= courses; row++) {
        var y0 = row === 0 ? bodyStart : bodyStart + (row / (courses + 1)) * bodyH;
        var y1 = row === courses ? bottomY : bodyStart + ((row + 1) / (courses + 1)) * bodyH;
        var stagger = (row % 2) * (blockW * 0.5);
        for (var col = 0; col <= blockCols; col++) {
          var jx = col * blockW + stagger;
          if (jx > 0 && jx < w) {
            ctx.beginPath();
            ctx.moveTo(jx, y0);
            ctx.lineTo(jx, y1);
            ctx.stroke();
          }
        }
      }

      // Subtle fossilized spiral seashell reliefs embedded in limestone blocks
      var fossilCount = w < 520 ? 3 : 5;
      ctx.strokeStyle = 'rgba(226, 208, 174, 0.24)';
      ctx.lineWidth = 0.95;
      for (var f = 0; f < fossilCount; f++) {
        var fx = w * (0.12 + (f / (fossilCount - 1)) * 0.76);
        var fy = bodyStart + bodyH * 0.66;
        ctx.beginPath();
        for (var s = 0; s <= 18; s++) {
          var th = (s / 18) * Math.PI * 2.8;
          var rr = 1.1 * Math.exp(0.22 * th);
          var px = fx + Math.cos(th) * rr;
          var py = fy + Math.sin(th) * rr;
          if (s === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // Chiseled Roman numeral memory marks along the stone course
      if (carvedMemories.length > 0 && bodyH > 26) {
        var shownMarks = Math.min(carvedMemories.length, 12);
        ctx.fillStyle = 'rgba(238, 220, 184, 0.62)';
        ctx.font = Math.max(9, Math.min(12, Math.round(w / 95))) + 'px Georgia, serif';
        ctx.textAlign = 'center';
        var markSpan = Math.min(w * 0.84, shownMarks * 52);
        var startX = (w - markSpan) * 0.5;
        for (var m = 0; m < shownMarks; m++) {
          var mx = shownMarks === 1
            ? w * 0.5
            : startX + (m / (shownMarks - 1)) * markSpan;
          ctx.fillText(carvedMemories[m].roman, mx, bodyStart + bodyH * 0.30);
        }
      }
    }

    function getSeatCenterX(slotIndex, w) {
      var margin = Math.max(16, w * 0.055);
      var usableW = Math.max(120, w - margin * 2);
      var slotW = usableW / SEAT_SLOTS.length;
      return margin + slotW * (slotIndex + 0.5);
    }

    function drawSeatedEldersRow(ctx, w, copingY, bottomY, age) {
      var margin = Math.max(16, w * 0.055);
      var usableW = Math.max(120, w - margin * 2);
      var slotW = usableW / SEAT_SLOTS.length;
      var wallH = Math.max(24, bottomY - copingY);
      var baseElderH = clamp(Math.min(wallH * 0.78, slotW * 1.12), 28, 86);

      // Nearest passing youth horizontal focus for subtle elder gaze tracking
      var gazeTargetX = w * 0.5;
      if (!reducedMotion && ambientYouths.length > 0) {
        var leadYouth = ambientYouths[0];
        var leadU = (((leadYouth.u + leadYouth.dir * elapsedSec * leadYouth.speed) % 1.16) + 1.16) % 1.16 - 0.08;
        gazeTargetX = leadU * w;
      }

      for (var i = 0; i < SEAT_SLOTS.length; i++) {
        var slot = SEAT_SLOTS[i];
        var cx = margin + slotW * (i + 0.5);

        if (slot.role === 'traveler-seat') {
          drawTravelerSeatAndFigure(ctx, cx, copingY, slotW, baseElderH, age, gazeTargetX, slot);
        } else {
          drawCloakedElderFigure(ctx, cx, copingY, slotW, baseElderH, age, gazeTargetX, slot, 1.0, 0);
        }
      }
    }

    function drawTravelerSeatAndFigure(ctx, cx, copingY, slotW, baseElderH, age, gazeTargetX, slot) {
      var seatW = Math.min(slotW * 0.84, baseElderH * 0.82);

      // Always render the carved concave open stone seat niche on the coping
      ctx.save();
      ctx.fillStyle = 'rgba(244, 224, 182, ' + (0.34 * (1 - smoothstep(0.75, 0.92, age)) + 0.10).toFixed(3) + ')';
      ctx.fillRect(cx - seatW * 0.46, copingY - 2.5, seatW * 0.92, 5);

      if (age < 0.75) {
        // Subtle warm invitation arch above the empty stone seat awaiting the traveler
        var pulse = reducedMotion ? 0.65 : (0.52 + 0.26 * Math.sin(elapsedSec * 1.8));
        ctx.strokeStyle = 'rgba(242, 214, 160, ' + (pulse * (0.35 + 0.45 * age)).toFixed(3) + ')';
        ctx.lineWidth = 1.1;
        if (ctx.setLineDash) ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(cx, copingY - baseElderH * 0.36, seatW * 0.34, Math.PI * 1.08, Math.PI * 1.92);
        ctx.stroke();
        if (ctx.setLineDash) ctx.setLineDash([]);
        ctx.restore();
        return;
      }
      ctx.restore();

      // As ageProgress crosses 0.75 -> 1.0, ease the traveler's cloaked figure irreversibly into the open seat
      var seatEase = smoothstep(0.75, 0.94, age);
      var standOffset = (1 - seatEase) * (baseElderH * 0.24);
      drawCloakedElderFigure(
        ctx,
        cx,
        copingY - standOffset,
        slotW,
        baseElderH,
        age,
        gazeTargetX,
        slot,
        0.42 + 0.58 * seatEase,
        1 - seatEase
      );
    }

    function drawCloakedElderFigure(ctx, cx, seatY, slotW, baseH, age, gazeTargetX, slot, opacity, risingBlend) {
      var figH = baseH * slot.stature;
      var halfW = Math.min(slotW * 0.49, figH * 0.44) * slot.shoulderWidth;
      var breath = reducedMotion ? 0 : Math.sin(elapsedSec * 1.3 + slot.slotIndex * 0.9) * 0.8;
      var gazeShift = clamp((gazeTargetX - cx) / 380, -1, 1) * 2.2;

      ctx.save();
      ctx.globalAlpha = clamp01(opacity);
      ctx.translate(cx, seatY + breath);

      // Seated shadow cast downward onto the limestone parapet face
      ctx.fillStyle = 'rgba(16, 12, 9, 0.44)';
      ctx.beginPath();
      drawEllipsePath(ctx, 0, figH * 0.14, halfW * 0.92, figH * 0.20, 0, 0, Math.PI);
      ctx.fill();

      // Heavy draped wool cloak resting shoulder-to-shoulder on the stone ledge
      ctx.fillStyle = slot.cloakTone;
      ctx.beginPath();
      ctx.moveTo(-halfW, 4);
      ctx.quadraticCurveTo(-halfW * 1.04, -figH * 0.56, -halfW * 0.52, -figH * 0.76);
      ctx.quadraticCurveTo(0, -figH * 0.84, halfW * 0.52, -figH * 0.76);
      ctx.quadraticCurveTo(halfW * 1.04, -figH * 0.56, halfW, 4);
      ctx.closePath();
      ctx.fill();

      // Layered shawl / mantle fold across shoulders
      ctx.fillStyle = slot.shawlTone;
      ctx.beginPath();
      ctx.moveTo(-halfW * 0.86, -figH * 0.28);
      ctx.quadraticCurveTo(-halfW * 0.55, -figH * 0.74, 0, -figH * 0.77);
      ctx.quadraticCurveTo(halfW * 0.55, -figH * 0.74, halfW * 0.86, -figH * 0.24);
      ctx.quadraticCurveTo(0, -figH * 0.42, -halfW * 0.86, -figH * 0.28);
      ctx.closePath();
      ctx.fill();

      // Hooded/crowned elder head turned slightly toward the passing youths in the square
      var headX = slot.headTilt * halfW * 0.55 + gazeShift * (reducedMotion ? 0 : 0.65);
      var headY = -figH * 0.86;
      var headR = clamp(figH * 0.145, 4.5, 12.5);

      ctx.fillStyle = slot.cloakTone;
      ctx.beginPath();
      ctx.arc(headX, headY, headR * 1.12, 0, TAU);
      ctx.fill();

      // Subtle silver hair / profile beard rim-light catching piazza glow
      ctx.strokeStyle = slot.role === 'traveler-seat'
        ? 'rgba(248, 222, 168, ' + (0.68 + 0.25 * (1 - risingBlend)).toFixed(3) + ')'
        : 'rgba(226, 212, 186, 0.52)';
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.arc(headX, headY, headR * 1.08, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();

      // Shoulder rim-light from the square ahead
      ctx.beginPath();
      ctx.moveTo(-halfW * 0.82, -figH * 0.52);
      ctx.quadraticCurveTo(-halfW * 0.48, -figH * 0.76, headX - headR * 0.9, headY + headR * 0.5);
      ctx.moveTo(headX + headR * 0.9, headY + headR * 0.5);
      ctx.quadraticCurveTo(halfW * 0.48, -figH * 0.76, halfW * 0.82, -figH * 0.52);
      ctx.stroke();

      // Distinct elder props (cane, slack lute, collapsed spyglass, ledge hand)
      ctx.strokeStyle = 'rgba(196, 170, 128, 0.58)';
      ctx.lineWidth = 1.3;
      if (slot.prop === 'cane-left') {
        ctx.beginPath();
        ctx.moveTo(-halfW * 0.52, -figH * 0.36);
        ctx.lineTo(-halfW * 0.64, figH * 0.24);
        ctx.stroke();
      } else if (slot.prop === 'cane-right') {
        ctx.beginPath();
        ctx.moveTo(halfW * 0.52, -figH * 0.36);
        ctx.lineTo(halfW * 0.66, figH * 0.24);
        ctx.stroke();
      } else if (slot.prop === 'lute-knee') {
        ctx.beginPath();
        drawEllipsePath(ctx, halfW * 0.18, -figH * 0.22, headR * 0.85, headR * 0.55, -0.35, 0, TAU);
        ctx.moveTo(halfW * 0.35, -figH * 0.28);
        ctx.lineTo(halfW * 0.76, -figH * 0.48);
        ctx.stroke();
      } else if (slot.prop === 'spyglass-lap') {
        ctx.strokeStyle = 'rgba(222, 188, 118, 0.72)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-halfW * 0.16, -figH * 0.16);
        ctx.lineTo(halfW * 0.38, -figH * 0.24);
        ctx.stroke();
      } else if (slot.prop === 'ledge-hand' || slot.prop === 'traveler-cloak') {
        ctx.fillStyle = 'rgba(198, 172, 136, 0.55)';
        ctx.beginPath();
        ctx.arc(halfW * 0.36, 1, Math.max(2, headR * 0.28), 0, TAU);
        ctx.fill();
      }

      ctx.restore();
    }

    // =========================================================================
    // Animation Loop & Pointer Stride Support
    // =========================================================================

    function renderAll() {
      if (destroyed) return;
      renderWildRide();
      renderSquareAndWall();
    }

    function stepSimulation(dtSec) {
      strideImpulse = Math.max(0, strideImpulse - dtSec * 1.8);
      if (phase === 'wild_ride' && !reducedMotion) {
        wildScroll += dtSec * (0.14 + 0.45 * strideImpulse);
      }

      if (activeEnvoys.length > 0 && !reducedMotion) {
        var writeIdx = 0;
        for (var i = 0; i < activeEnvoys.length; i++) {
          var env = activeEnvoys[i];
          env.progress += dtSec * 0.24;
          if (env.progress < 1.0) {
            activeEnvoys[writeIdx++] = env;
          }
        }
        activeEnvoys.length = writeIdx;
      }
    }

    function tick(nowMs) {
      if (destroyed || !mounted || reducedMotion) {
        rafId = null;
        return;
      }
      if (!lastFrameMs) {
        lastFrameMs = nowMs;
      }
      var dt = clamp((nowMs - lastFrameMs) / 1000, 0, 0.08);
      lastFrameMs = nowMs;
      elapsedSec += dt;

      stepSimulation(dt);
      renderAll();

      if (typeof requestAnimationFrame === 'function') {
        rafId = requestAnimationFrame(tick);
      }
    }

    function startLoopIfNeeded() {
      if (destroyed || !mounted || reducedMotion) {
        stopLoop();
        return;
      }
      if (rafId === null && typeof requestAnimationFrame === 'function') {
        lastFrameMs = 0;
        rafId = requestAnimationFrame(tick);
      }
    }

    function stopLoop() {
      if (rafId !== null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(rafId);
      }
      rafId = null;
      lastFrameMs = 0;
    }

    function onWindowResize() {
      if (destroyed || !mounted) return;
      measureAndSyncCanvases();
      renderAll();
    }

    function onWildPointerDown(ev) {
      if (destroyed || phase !== 'wild_ride') return;
      pointerDragState = {
        startX: typeof ev.clientX === 'number' ? ev.clientX : 0,
        startY: typeof ev.clientY === 'number' ? ev.clientY : 0,
        accumPx: 0
      };
    }

    function onWildPointerMove(ev) {
      if (!pointerDragState || destroyed || phase !== 'wild_ride') return;
      var cx = typeof ev.clientX === 'number' ? ev.clientX : pointerDragState.startX;
      var cy = typeof ev.clientY === 'number' ? ev.clientY : pointerDragState.startY;
      var dist = Math.hypot(cx - pointerDragState.startX, cy - pointerDragState.startY);
      if (dist - pointerDragState.accumPx >= 36) {
        pointerDragState.accumPx = dist;
        advanceWildRide(0.08);
      }
    }

    function onWildPointerUp() {
      pointerDragState = null;
    }

    function attachListeners() {
      if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
        window.addEventListener('resize', onWindowResize);
      }
      if (wildCanvasEl && typeof wildCanvasEl.addEventListener === 'function') {
        wildCanvasEl.addEventListener('pointerdown', onWildPointerDown);
        wildCanvasEl.addEventListener('pointermove', onWildPointerMove);
        wildCanvasEl.addEventListener('pointerup', onWildPointerUp);
        wildCanvasEl.addEventListener('pointercancel', onWildPointerUp);
      }
      if (typeof ResizeObserver === 'function') {
        try {
          resizeObserver = new ResizeObserver(function () {
            onWindowResize();
          });
          if (wildCanvasEl) resizeObserver.observe(wildCanvasEl);
          if (wallCanvasEl) resizeObserver.observe(wallCanvasEl);
        } catch (_) {
          resizeObserver = null;
        }
      }
    }

    function detachListeners() {
      if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
        window.removeEventListener('resize', onWindowResize);
      }
      if (wildCanvasEl && typeof wildCanvasEl.removeEventListener === 'function') {
        wildCanvasEl.removeEventListener('pointerdown', onWildPointerDown);
        wildCanvasEl.removeEventListener('pointermove', onWildPointerMove);
        wildCanvasEl.removeEventListener('pointerup', onWildPointerUp);
        wildCanvasEl.removeEventListener('pointercancel', onWildPointerUp);
      }
      if (resizeObserver) {
        try {
          resizeObserver.disconnect();
        } catch (_) {}
        resizeObserver = null;
      }
      pointerDragState = null;
    }

    // =========================================================================
    // Public Contract Methods
    // =========================================================================

    function mount(elements) {
      if (destroyed) return;
      var els = elements || {};

      stopLoop();
      detachListeners();

      wildCanvasEl = els.wildCanvasEl || null;
      wallCanvasEl = els.wallCanvasEl || null;
      parapetRootEl = els.parapetRootEl || null;
      mounted = true;

      recalculateDerivedState();
      buildParapetDom();
      measureAndSyncCanvases();
      attachListeners();
      renderAll();
      startLoopIfNeeded();
    }

    function advanceWildRide(step) {
      if (destroyed) return getState();

      var rawStep = step === undefined ? 0.25 : (Number.isFinite(step) ? step : 0.25);
      var positiveStep = clamp(rawStep, 0, 1);
      var nextWild = round4(clamp01(Math.max(wildRideProgress, wildRideProgress + positiveStep)));

      wildRideProgress = nextWild;
      wildScroll += positiveStep * 1.35;
      strideImpulse = Math.min(1.4, strideImpulse + (positiveStep > 0 ? 0.85 : 0));

      recalculateDerivedState();
      syncParapetDom();
      renderAll();
      notifyStateChange();
      return getState();
    }

    function completeWildRide() {
      if (destroyed) return getState();

      wildRideProgress = 1;
      wildScroll += 0.9;
      strideImpulse = 0.6;

      recalculateDerivedState();
      syncParapetDom();
      renderAll();
      notifyStateChange();
      return getState();
    }

    function recordDesire(payload) {
      if (destroyed) return getState();
      var item = payload || {};

      // Entering any Isidora desire station confirms arrival past the wild regions
      if (wildRideProgress < 1) {
        wildRideProgress = 1;
      }

      // Strictly monotonic ageProgress ratchet: calibrated ~0.09..0.12 per desire (~9-11 pursuits -> 1.00)
      var intensity = clamp01(Number.isFinite(item.intensity) ? item.intensity : 0.65);
      var defaultStep = 0.095 + 0.02 * intensity;
      var requestedStep = (Number.isFinite(item.deltaAge) && item.deltaAge > 0)
        ? item.deltaAge
        : defaultStep;
      var calibratedStep = clamp(requestedStep, 0.09, 0.12);
      var nextAge = round4(clamp01(Math.max(ageProgress, ageProgress + calibratedStep)));
      ageProgress = nextAge;

      recalculateDerivedState();

      var stationKey = typeof item.station === 'string' && STATION_META[item.station]
        ? item.station
        : 'spiral';
      var meta = STATION_META[stationKey];
      var cleanLabel = typeof item.label === 'string' && item.label.trim()
        ? item.label.trim()
        : meta.defaultLabel;
      var cleanEcho = typeof item.memoryEcho === 'string' && item.memoryEcho.trim()
        ? item.memoryEcho.trim()
        : meta.defaultEcho;

      var shouldDispatchYouth = ageProgress >= 0.50 - 1e-9;
      if (shouldDispatchYouth) {
        dispatchedYouthCount += 1;
        activeEnvoys.push({
          id: dispatchedYouthCount,
          station: stationKey,
          emblem: meta.emblem,
          progress: 0.04,
          arcOffset: ((dispatchedYouthCount % 2 === 0 ? 1 : -1) * (10 + (dispatchedYouthCount % 3) * 6)),
          seed: dispatchedYouthCount * 1.37
        });
        if (activeEnvoys.length > 5) {
          activeEnvoys.shift();
        }
      }

      var memoryRecord = {
        index: carvedMemories.length + 1,
        roman: toRoman(carvedMemories.length + 1),
        station: stationKey,
        label: cleanLabel,
        memoryEcho: cleanEcho,
        ageAtCarving: ageProgress,
        dispatchedYouth: shouldDispatchYouth
      };
      carvedMemories.push(memoryRecord);

      appendInscriptionNode(memoryRecord);
      syncParapetDom();
      renderAll();
      notifyStateChange();
      return getState();
    }

    function setReducedMotion(reduced) {
      if (destroyed) return;
      reducedMotion = Boolean(reduced);
      if (reducedMotion) {
        stopLoop();
      } else {
        startLoopIfNeeded();
      }
      syncParapetDom();
      renderAll();
    }

    function resize(width, height) {
      if (destroyed) return;
      var w = Number.isFinite(width) && width > 0 ? width : undefined;
      var h = Number.isFinite(height) && height > 0 ? height : undefined;
      measureAndSyncCanvases(w, h);
      renderAll();
    }

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      mounted = false;
      stopLoop();
      detachListeners();
      if (parapetRootEl) {
        clearElementChildren(parapetRootEl);
      }
      wildCanvasEl = null;
      wallCanvasEl = null;
      parapetRootEl = null;
      seatEls = [];
      activeEnvoys = [];
    }

    return {
      mount: mount,
      advanceWildRide: advanceWildRide,
      completeWildRide: completeWildRide,
      recordDesire: recordDesire,
      getState: getState,
      setReducedMotion: setReducedMotion,
      resize: resize,
      destroy: destroy
    };
  }

  var api = {
    create: create
  };

  global.IsidoraOldMensWall = api;
  if (typeof window !== 'undefined') {
    window.IsidoraOldMensWall = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
