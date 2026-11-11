/*
 * City 07: ZORA (Chapter I - Cities & Memory 4)
 * Layer: Motionless-Preservation Decay Physics & Ars-Memoriae Canvas2D Renderer
 * Zero-dependency classic IIFE exposing window.ZoraDisintegration
 */
(function () {
  'use strict';

  var RIVERS_COUNT = 6;
  var MOUNTAIN_RANGES_COUNT = 3;

  var PHASES = Object.freeze({
    LIVING: 'LIVING',
    WEATHERING: 'WEATHERING',
    DISINTEGRATING: 'DISINTEGRATING',
    FORGOTTEN_BY_EARTH: 'FORGOTTEN_BY_EARTH'
  });

  var LOCI_METADATA = Object.freeze([
    Object.freeze({
      index: 0,
      step: 1,
      roman: 'I',
      id: 'copper_clock',
      name: 'The Copper Clock',
      shortLatin: 'I · Horologium',
      latin: 'I · Horologium Cupreum',
      noteName: 'D4',
      neumeRank: 0,
      wx: 0.095,
      wy: 0.365,
      mx: 0.105,
      my: 0.345
    }),
    Object.freeze({
      index: 1,
      step: 2,
      roman: 'II',
      id: 'barber_awning',
      name: "The Barber's Striped Awning",
      shortLatin: 'II · Velarium',
      latin: 'II · Velarium Tonsoris',
      noteName: 'F4',
      neumeRank: 2,
      wx: 0.196,
      wy: 0.575,
      mx: 0.202,
      my: 0.575
    }),
    Object.freeze({
      index: 2,
      step: 3,
      roman: 'III',
      id: 'nine_jet_fountain',
      name: 'The Fountain with Nine Jets',
      shortLatin: 'III · Fons IX',
      latin: 'III · Fons Novem Salientium',
      noteName: 'A4',
      neumeRank: 4,
      wx: 0.298,
      wy: 0.385,
      mx: 0.300,
      my: 0.368
    }),
    Object.freeze({
      index: 3,
      step: 4,
      roman: 'IV',
      id: 'astronomer_tower',
      name: "The Astronomer's Glass Tower",
      shortLatin: 'IV · Turris Vitrea',
      latin: 'IV · Turris Vitrea Astronomi',
      noteName: 'G4',
      neumeRank: 3,
      wx: 0.400,
      wy: 0.595,
      mx: 0.398,
      my: 0.595
    }),
    Object.freeze({
      index: 4,
      step: 5,
      roman: 'V',
      id: 'melon_kiosk',
      name: "The Melon Vendor's Kiosk",
      shortLatin: 'V · Pepones',
      latin: 'V · Taberna Peponum',
      noteName: 'B4',
      neumeRank: 5,
      wx: 0.502,
      wy: 0.412,
      mx: 0.500,
      my: 0.398
    }),
    Object.freeze({
      index: 5,
      step: 6,
      roman: 'VI',
      id: 'statue_hermit_lion',
      name: 'Statue of the Hermit and the Lion',
      shortLatin: 'VI · Eremita & Leo',
      latin: 'VI · Effigies Eremitae et Leonis',
      noteName: 'F4',
      neumeRank: 2,
      wx: 0.604,
      wy: 0.632,
      mx: 0.598,
      my: 0.625
    }),
    Object.freeze({
      index: 6,
      step: 7,
      roman: 'VII',
      id: 'turkish_bath',
      name: 'The Turkish Bath',
      shortLatin: 'VII · Balneum',
      latin: 'VII · Balneum Vaporis',
      noteName: 'E4',
      neumeRank: 1,
      wx: 0.706,
      wy: 0.452,
      mx: 0.698,
      my: 0.438
    }),
    Object.freeze({
      index: 7,
      step: 8,
      roman: 'VIII',
      id: 'corner_cafe',
      name: 'The Café at the Corner',
      shortLatin: 'VIII · Caupona',
      latin: 'VIII · Caupona Angularis',
      noteName: 'C5',
      neumeRank: 6,
      wx: 0.806,
      wy: 0.675,
      mx: 0.798,
      my: 0.668
    }),
    Object.freeze({
      index: 8,
      step: 9,
      roman: 'IX',
      id: 'harbor_alley',
      name: 'The Alley Leading to the Harbor',
      shortLatin: 'IX · Ad Portum',
      latin: 'IX · Angiportus ad Portum',
      noteName: 'D5',
      neumeRank: 7,
      wx: 0.905,
      wy: 0.792,
      mx: 0.896,
      my: 0.795
    })
  ]);

  var CATEGORY_GLYPHS = {
    famous_men: '☉',
    virtues: '⚖',
    numbers: 'IX',
    vegetable_classifications: '✿',
    mineral_classifications: '❖',
    battle_dates: '⚔',
    constellations: '✦',
    parts_of_speech: '§',
    rhetorical_figures: '⇄'
  };

  var MOUNTAIN_RANGES = [
    // Far range: serrated limestone peaks
    [
      [0.00, 0.17], [0.06, 0.11], [0.13, 0.065], [0.21, 0.12], [0.29, 0.052],
      [0.37, 0.105], [0.46, 0.048], [0.55, 0.112], [0.64, 0.058], [0.73, 0.108],
      [0.82, 0.068], [0.90, 0.118], [0.96, 0.145], [1.00, 0.165]
    ],
    // Middle range: layered karst ridges
    [
      [0.00, 0.205], [0.08, 0.142], [0.17, 0.102], [0.25, 0.148], [0.34, 0.095],
      [0.43, 0.145], [0.52, 0.092], [0.61, 0.146], [0.70, 0.104], [0.79, 0.152],
      [0.88, 0.126], [0.95, 0.178], [1.00, 0.198]
    ],
    // Near range: Zora foothill escarpments
    [
      [0.00, 0.238], [0.09, 0.182], [0.19, 0.152], [0.28, 0.196], [0.39, 0.146],
      [0.49, 0.192], [0.59, 0.148], [0.69, 0.196], [0.79, 0.164], [0.89, 0.214],
      [1.00, 0.242]
    ]
  ];

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(t) {
    var c = clamp(t, 0, 1);
    return c * c * (3 - 2 * c);
  }

  function lerpRgb(rgbA, rgbB, t) {
    var k = clamp(t, 0, 1);
    var r = Math.round(rgbA[0] + (rgbB[0] - rgbA[0]) * k);
    var g = Math.round(rgbA[1] + (rgbB[1] - rgbA[1]) * k);
    var b = Math.round(rgbA[2] + (rgbB[2] - rgbA[2]) * k);
    return [r, g, b];
  }

  function rgbaStr(rgb, a) {
    var alpha = clamp(a, 0, 1);
    return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha.toFixed(3) + ')';
  }

  function seededHash(seed) {
    var x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  function buildDeterministicCracks(locusIndex) {
    var branches = [];
    var baseSeed = (locusIndex + 1) * 313.7;
    for (var b = 0; b < 4; b++) {
      var angle = (b * Math.PI * 0.52) + seededHash(baseSeed + b * 7) * 0.7 - 0.35;
      var pts = [[Math.cos(angle) * 0.12, Math.sin(angle) * 0.12]];
      var cx = pts[0][0];
      var cy = pts[0][1];
      for (var s = 1; s <= 4; s++) {
        var jitter = (seededHash(baseSeed + b * 19 + s * 5) - 0.5) * 0.65;
        var stepLen = 0.17 + seededHash(baseSeed + b * 31 + s * 11) * 0.08;
        cx += Math.cos(angle + jitter) * stepLen;
        cy += Math.sin(angle + jitter) * stepLen;
        pts.push([cx, cy]);
      }
      var fork = null;
      if (b % 2 === 0 && pts.length >= 3) {
        var fp = pts[2];
        var fAngle = angle + (b === 0 ? 0.68 : -0.68);
        fork = [
          [fp[0], fp[1]],
          [fp[0] + Math.cos(fAngle) * 0.22, fp[1] + Math.sin(fAngle) * 0.22]
        ];
      }
      branches.push({ main: pts, fork: fork });
    }
    return branches;
  }

  function safeSetLineDash(ctx, dash) {
    if (ctx && typeof ctx.setLineDash === 'function') {
      ctx.setLineDash(dash);
    }
  }

  function safeDrawEllipse(ctx, cx, cy, rx, ry, rot) {
    if (!ctx) return;
    if (typeof ctx.ellipse === 'function') {
      ctx.ellipse(cx, cy, Math.max(0.5, rx), Math.max(0.5, ry), rot || 0, 0, Math.PI * 2);
    } else {
      ctx.save();
      ctx.translate(cx, cy);
      if (rot) ctx.rotate(rot);
      ctx.scale(Math.max(0.5, rx), Math.max(0.5, ry));
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.restore();
    }
  }

  function drawHexagonPath(ctx, cx, cy, radius, flatTop) {
    ctx.beginPath();
    var offset = flatTop ? 0 : -Math.PI / 2;
    for (var i = 0; i < 6; i++) {
      var a = offset + (i * Math.PI) / 3;
      var px = cx + Math.cos(a) * radius;
      var py = cy + Math.sin(a) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function lookupExternalToken(tokenId) {
    var g = typeof window !== 'undefined' ? window : globalThis;
    var scoreApi = g && g.ZoraNineLociScore;
    if (scoreApi && Array.isArray(scoreApi.TOKENS)) {
      for (var i = 0; i < scoreApi.TOKENS.length; i++) {
        if (scoreApi.TOKENS[i] && scoreApi.TOKENS[i].id === tokenId) {
          return scoreApi.TOKENS[i];
        }
      }
    }
    return null;
  }

  function normalizeBindingRecord(raw, index) {
    if (!raw) return null;
    if (typeof raw === 'object' && (raw.bound === false || raw.locked === false)) {
      return null;
    }
    if (typeof raw === 'string') {
      var extStr = lookupExternalToken(raw);
      return {
        tokenId: raw,
        category: extStr ? extStr.category : raw,
        glyph: (extStr && extStr.glyph) || CATEGORY_GLYPHS[raw] || '◈',
        shortLabel: (extStr && extStr.shortLabel) || raw.replace(/_/g, ' '),
        relation: 'affinity'
      };
    }
    if (typeof raw === 'object') {
      var tokObj = raw.token && typeof raw.token === 'object' ? raw.token : null;
      var tokenId = raw.tokenId || (tokObj && tokObj.id) || raw.id || null;
      var category = raw.category || (tokObj && tokObj.category) || tokenId || '';
      if (!tokenId && !raw.glyph && !raw.shortLabel && !raw.title && raw.locked !== true) {
        return null;
      }
      var ext = tokenId ? lookupExternalToken(tokenId) : null;
      var glyph =
        raw.glyph ||
        (tokObj && tokObj.glyph) ||
        (ext && ext.glyph) ||
        CATEGORY_GLYPHS[category] ||
        CATEGORY_GLYPHS[tokenId] ||
        LOCI_METADATA[index].roman;
      var shortLabel =
        raw.shortLabel ||
        (tokObj && tokObj.shortLabel) ||
        (ext && ext.shortLabel) ||
        raw.title ||
        (tokObj && tokObj.title) ||
        (tokenId ? String(tokenId).replace(/_/g, ' ') : 'Memoria');
      var relation =
        raw.relation === 'contrast' || raw.mode === 'contrast' ? 'contrast' : 'affinity';
      return {
        tokenId: tokenId || 'locus_' + index,
        category: category,
        glyph: String(glyph),
        shortLabel: String(shortLabel),
        relation: relation
      };
    }
    return null;
  }

  function extractBindingsArray(scoreState) {
    var result = [null, null, null, null, null, null, null, null, null];
    if (!scoreState || typeof scoreState !== 'object') return result;

    var rawBindings = scoreState.bindings;
    if (Array.isArray(rawBindings)) {
      var usesExplicitIndex = false;
      for (var k = 0; k < rawBindings.length; k++) {
        var item = rawBindings[k];
        if (item && typeof item === 'object' && typeof item.locusIndex === 'number' && rawBindings.length !== 9) {
          usesExplicitIndex = true;
          break;
        }
      }
      if (usesExplicitIndex) {
        for (var m = 0; m < rawBindings.length; m++) {
          var rec = rawBindings[m];
          if (rec && typeof rec.locusIndex === 'number' && rec.locusIndex >= 0 && rec.locusIndex < 9) {
            result[rec.locusIndex] = normalizeBindingRecord(rec, rec.locusIndex);
          }
        }
      } else {
        for (var i = 0; i < 9; i++) {
          result[i] = normalizeBindingRecord(rawBindings[i], i);
        }
      }
    } else if (rawBindings && typeof rawBindings === 'object') {
      for (var j = 0; j < 9; j++) {
        var meta = LOCI_METADATA[j];
        var entry =
          rawBindings[j] !== undefined
            ? rawBindings[j]
            : rawBindings[String(j)] !== undefined
              ? rawBindings[String(j)]
              : rawBindings[meta.id];
        result[j] = normalizeBindingRecord(entry, j);
      }
    }

    var targetCount = -1;
    if (scoreState.isFullyMemorized === true) {
      targetCount = 9;
    } else if (typeof scoreState.lockedCount === 'number') {
      targetCount = clamp(Math.round(scoreState.lockedCount), 0, 9);
    }

    if (targetCount >= 0) {
      var boundSoFar = 0;
      for (var c = 0; c < 9; c++) {
        if (result[c]) boundSoFar++;
      }
      if (boundSoFar < targetCount) {
        var catKeys = Object.keys(CATEGORY_GLYPHS);
        for (var fill = 0; fill < 9 && boundSoFar < targetCount; fill++) {
          if (!result[fill]) {
            var cat = catKeys[fill % catKeys.length];
            result[fill] = {
              tokenId: cat,
              category: cat,
              glyph: CATEGORY_GLYPHS[cat],
              shortLabel: cat.replace(/_/g, ' '),
              relation: fill % 3 === 2 ? 'contrast' : 'affinity'
            };
            boundSoFar++;
          }
        }
      } else if (targetCount === 0 && !rawBindings) {
        for (var z = 0; z < 9; z++) result[z] = null;
      }
    }

    return result;
  }

  function createRenderer(canvas, options) {
    var opts = options && typeof options === 'object' ? options : {};
    var ctx = canvas && typeof canvas.getContext === 'function' ? canvas.getContext('2d') : null;

    var initialReducedMotion = false;
    if (typeof opts.reducedMotion === 'boolean') {
      initialReducedMotion = opts.reducedMotion;
    } else if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      try {
        var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        initialReducedMotion = !!(mq && mq.matches);
      } catch (_e) {
        initialReducedMotion = false;
      }
    }

    var reducedMotion = initialReducedMotion;
    var cssWidth = 860;
    var cssHeight = 500;
    var dpr = 1;

    var worldTime = 0;
    var walkedUpTo = -1;
    var activeLocus = -1;
    var hoveredLocus = -1;

    var lockedCount = 0;
    var fixationRatio = 0;
    var earthlyIntegrity = 1.0;
    var phase = PHASES.LIVING;
    var isForgottenByEarth = false;
    var earthForgottenNotified = false;
    var recondensing = false;

    var refusalFlash = null; // { attemptedIndex, requiredIndex, remaining, duration }
    var particles = [];
    var MAX_PARTICLES = 240;
    var ambientEmitAccumulator = 0;
    var cascadeBurstSpawned = false;

    var rafId = null;
    var isRunning = false;
    var lastFrameMs = 0;

    var lociState = [];
    for (var i = 0; i < 9; i++) {
      lociState.push({
        index: i,
        meta: LOCI_METADATA[i],
        x: 0,
        y: 0,
        hitRadius: 36,
        locked: false,
        kineticFreeze: false,
        locusVitality: 1.0,
        crackProgress: 0.0,
        animTime: i * 0.85,
        invariantTime: 0.0,
        binding: null,
        notePulse: 0.0,
        lockFlash: 0.0,
        cracks: buildDeterministicCracks(i)
      });
    }

    function computeStaveY(u, lineIndex) {
      var base = cssHeight * (0.455 + 0.235 * smoothstep(u) + 0.022 * Math.sin(u * Math.PI * 2.0));
      var spacing = clamp(cssHeight * 0.022, 6.8, 12.5);
      return base + (lineIndex - 2.5) * spacing;
    }

    function updateLayout() {
      var compact = cssWidth < 560 || cssWidth / Math.max(1, cssHeight) < 1.12;
      var minDim = Math.min(cssWidth, cssHeight);
      var baseHit = clamp(minDim * 0.105, 30, 54);
      for (var idx = 0; idx < 9; idx++) {
        var st = lociState[idx];
        var nx = compact ? st.meta.mx : st.meta.wx;
        var ny = compact ? st.meta.my : st.meta.wy;
        st.x = nx * cssWidth;
        st.y = ny * cssHeight;
        st.hitRadius = baseHit;
      }
    }

    function resize() {
      if (!canvas) {
        updateLayout();
        return;
      }
      var rect = typeof canvas.getBoundingClientRect === 'function' ? canvas.getBoundingClientRect() : null;
      var rw = rect && rect.width > 0 ? rect.width : canvas.clientWidth || canvas.width || 860;
      var rh = rect && rect.height > 0 ? rect.height : canvas.clientHeight || canvas.height || 500;
      cssWidth = Math.max(240, rw);
      cssHeight = Math.max(220, rh);

      var rawDpr =
        opts.dpr ||
        (typeof window !== 'undefined' && window.devicePixelRatio ? window.devicePixelRatio : 1);
      dpr = clamp(rawDpr, 1, 2);

      var targetW = Math.round(cssWidth * dpr);
      var targetH = Math.round(cssHeight * dpr);
      if (canvas.width !== targetW) canvas.width = targetW;
      if (canvas.height !== targetH) canvas.height = targetH;

      updateLayout();
      renderOnce();
    }

    function spawnDustParticle(ox, oy, intensity, isInk) {
      if (reducedMotion || particles.length >= MAX_PARTICLES) return;
      var seed = particles.length * 17.3 + worldTime * 53.1 + ox * 0.37;
      var h1 = seededHash(seed);
      var h2 = seededHash(seed + 9.1);
      var h3 = seededHash(seed + 23.7);
      var speedScale = 0.7 + intensity * 1.15;
      particles.push({
        x: ox + (h1 - 0.5) * 26,
        y: oy + (h2 - 0.5) * 24,
        vx: (38 + h1 * 88) * speedScale,
        vy: (-18 + (h2 - 0.55) * 34) * speedScale,
        size: isInk ? 1.3 + h3 * 1.9 : 1.6 + h3 * 2.8,
        age: 0,
        maxAge: 1.0 + h3 * 1.45,
        isInk: !!isInk,
        phase: h1 * Math.PI * 2
      });
    }

    function emitLocusLockShedding(locus) {
      if (reducedMotion) return;
      for (var p = 0; p < 16; p++) {
        spawnDustParticle(locus.x, locus.y, 0.75, p % 4 === 0);
      }
    }

    function emitCascadeBurst() {
      if (reducedMotion) return;
      for (var idx = 0; idx < 9; idx++) {
        var loc = lociState[idx];
        for (var k = 0; k < 12; k++) {
          spawnDustParticle(loc.x, loc.y, 1.2, k % 3 === 0);
        }
      }
      // Mountain & river horizon erosion motes
      for (var m = 0; m < 40; m++) {
        var mx = (0.06 + (m / 40) * 0.86) * cssWidth;
        var my = (0.08 + seededHash(m * 13.7) * 0.16) * cssHeight;
        spawnDustParticle(mx, my, 1.1, m % 5 === 0);
      }
    }

    function markForgottenByEarth() {
      earthlyIntegrity = 0;
      phase = PHASES.FORGOTTEN_BY_EARTH;
      var newlyForgotten = !isForgottenByEarth;
      isForgottenByEarth = true;
      recondensing = false;
      if (newlyForgotten && !earthForgottenNotified) {
        earthForgottenNotified = true;
        if (typeof opts.onEarthForgotten === 'function') {
          opts.onEarthForgotten(getMetrics());
        }
      }
      if (newlyForgotten && typeof opts.onPhaseChange === 'function') {
        opts.onPhaseChange(phase, getMetrics());
      }
    }

    function syncFromScore(scoreState) {
      if (!scoreState || typeof scoreState !== 'object') {
        renderOnce();
        return getMetrics();
      }

      var prevWalked = walkedUpTo;
      var prevActive = activeLocus;
      if (typeof scoreState.walkedUpTo === 'number') {
        walkedUpTo = clamp(Math.round(scoreState.walkedUpTo), -1, 8);
      }
      if (typeof scoreState.activeLocus === 'number') {
        activeLocus = clamp(Math.round(scoreState.activeLocus), -1, 8);
      }
      if (activeLocus >= 0 && (activeLocus !== prevActive || walkedUpTo > prevWalked)) {
        lociState[activeLocus].notePulse = 1.0;
      }

      var normalizedBindings = extractBindingsArray(scoreState);
      var newLockedCount = 0;

      for (var i = 0; i < 9; i++) {
        var loc = lociState[i];
        var wasLocked = loc.locked;
        var b = normalizedBindings[i];
        loc.binding = b;
        loc.locked = !!b;
        loc.kineticFreeze = loc.locked;

        if (loc.locked) {
          newLockedCount++;
          if (!wasLocked) {
            loc.lockFlash = 1.0;
            if (reducedMotion) {
              loc.locusVitality = 0.0;
              loc.crackProgress = 1.0;
            } else {
              emitLocusLockShedding(loc);
            }
          }
        } else if (wasLocked && reducedMotion) {
          loc.locusVitality = 1.0;
          loc.crackProgress = 0.0;
        }
      }

      var prevPhase = phase;
      var wasNineOrForgotten = lockedCount === 9 || isForgottenByEarth;
      lockedCount = newLockedCount;
      fixationRatio = lockedCount / 9;

      if (lockedCount < 9) {
        var targetIntegrity = Number((1 - 0.55 * fixationRatio).toFixed(6));
        isForgottenByEarth = false;
        earthForgottenNotified = false;
        cascadeBurstSpawned = false;
        phase = lockedCount === 0 ? PHASES.LIVING : PHASES.WEATHERING;

        if (wasNineOrForgotten && isRunning && !reducedMotion) {
          recondensing = true;
          earthlyIntegrity = Math.max(earthlyIntegrity, Math.min(targetIntegrity, 0.36));
        } else {
          recondensing = false;
          earthlyIntegrity = targetIntegrity;
        }
        if (reducedMotion) {
          particles.length = 0;
        }
      } else {
        // Critical Erasure Threshold: all 9 honeycomb cells locked invariant
        recondensing = false;
        if (!isForgottenByEarth) {
          earthlyIntegrity = Math.min(earthlyIntegrity, 0.45);
          phase = PHASES.DISINTEGRATING;
          if (!cascadeBurstSpawned) {
            cascadeBurstSpawned = true;
            emitCascadeBurst();
          }
        }
      }

      if (phase !== prevPhase && typeof opts.onPhaseChange === 'function') {
        opts.onPhaseChange(phase, getMetrics());
      }

      renderOnce();
      return getMetrics();
    }

    function step(dtSeconds) {
      var dt = typeof dtSeconds === 'number' && isFinite(dtSeconds) ? clamp(dtSeconds, 0, 0.25) : 0.016;
      if (!reducedMotion && lockedCount < 9) {
        var tempoScale = 1 - 0.65 * fixationRatio;
        worldTime += dt * tempoScale;
      }

      // Per-locus vitality, fractures, and living micro-motion
      for (var i = 0; i < 9; i++) {
        var loc = lociState[i];
        if (!loc.kineticFreeze && !reducedMotion) {
          loc.animTime += dt;
        }
        if (loc.locked) {
          if (reducedMotion) {
            loc.locusVitality = 0.0;
            loc.crackProgress = 1.0;
          } else {
            loc.locusVitality = Math.max(0.0, loc.locusVitality - dt * 3.2);
            loc.crackProgress = Math.min(1.0, loc.crackProgress + dt * 2.8);
          }
        } else {
          if (reducedMotion) {
            loc.locusVitality = 1.0;
            loc.crackProgress = 0.0;
          } else {
            loc.locusVitality = Math.min(1.0, loc.locusVitality + dt * 2.8);
            loc.crackProgress = Math.max(0.0, loc.crackProgress - dt * 2.5);
          }
        }
        if (loc.notePulse > 0) {
          loc.notePulse = Math.max(0, loc.notePulse - dt * 1.8);
        }
        if (loc.lockFlash > 0) {
          loc.lockFlash = Math.max(0, loc.lockFlash - dt * 2.2);
        }
      }

      // Refusal flash decay
      if (refusalFlash) {
        refusalFlash.remaining -= dt;
        if (refusalFlash.remaining <= 0) {
          refusalFlash = null;
        }
      }

      // City-wide integrity physics
      if (lockedCount === 9) {
        if (!isForgottenByEarth) {
          var decayWindow = reducedMotion ? 0.25 : 2.75;
          earthlyIntegrity = Math.max(0, earthlyIntegrity - (0.45 / decayWindow) * dt);

          if (!reducedMotion && earthlyIntegrity > 0.02) {
            ambientEmitAccumulator += dt * 55;
            while (ambientEmitAccumulator >= 1 && particles.length < MAX_PARTICLES) {
              ambientEmitAccumulator -= 1;
              var pick = lociState[Math.floor(seededHash(worldTime * 91 + particles.length) * 9) % 9];
              spawnDustParticle(pick.x, pick.y, 1.15, particles.length % 3 === 0);
            }
          }

          if (earthlyIntegrity <= 0.02) {
            markForgottenByEarth();
          }
        }
      } else {
        var target = Number((1 - 0.55 * fixationRatio).toFixed(6));
        if (recondensing) {
          if (reducedMotion) {
            earthlyIntegrity = target;
            recondensing = false;
          } else {
            earthlyIntegrity = Math.min(target, earthlyIntegrity + dt * 1.45);
            if (Math.abs(earthlyIntegrity - target) < 0.005) {
              earthlyIntegrity = target;
              recondensing = false;
            }
          }
        } else {
          earthlyIntegrity = target;
        }

        // Subtle weathering dust while 1..8 cells are locked
        if (!reducedMotion && lockedCount > 0) {
          ambientEmitAccumulator += dt * (lockedCount * 1.35);
          while (ambientEmitAccumulator >= 1) {
            ambientEmitAccumulator -= 1;
            for (var c = 0; c < 9; c++) {
              if (lociState[c].locked && seededHash(worldTime * 31 + c * 17) > 0.68) {
                spawnDustParticle(lociState[c].x, lociState[c].y, 0.55, c % 2 === 0);
                break;
              }
            }
          }
        }
      }

      // Particle wind transport
      if (reducedMotion) {
        particles.length = 0;
      } else {
        for (var p = particles.length - 1; p >= 0; p--) {
          var pt = particles[p];
          pt.age += dt;
          if (pt.age >= pt.maxAge || pt.x > cssWidth + 32 || pt.y < -32 || pt.y > cssHeight + 32) {
            particles.splice(p, 1);
            continue;
          }
          var gust = Math.sin(pt.age * 4.5 + pt.phase) * 14;
          pt.x += pt.vx * dt;
          pt.y += (pt.vy + gust) * dt;
          pt.vx += 18 * dt;
        }
      }
    }

    function fastForwardDisintegration() {
      if (lockedCount === 9) {
        particles.length = 0;
        for (var i = 0; i < 9; i++) {
          lociState[i].locusVitality = 0.0;
          lociState[i].crackProgress = 1.0;
        }
        markForgottenByEarth();
      } else {
        recondensing = false;
        earthlyIntegrity = Number((1 - 0.55 * fixationRatio).toFixed(6));
        for (var j = 0; j < 9; j++) {
          lociState[j].locusVitality = lociState[j].locked ? 0.0 : 1.0;
          lociState[j].crackProgress = lociState[j].locked ? 1.0 : 0.0;
        }
      }
      renderOnce();
      return getMetrics();
    }

    function triggerRefusalFlash(attemptedIndex, requiredIndex) {
      refusalFlash = {
        attemptedIndex: typeof attemptedIndex === 'number' ? attemptedIndex : -1,
        requiredIndex: typeof requiredIndex === 'number' ? requiredIndex : -1,
        remaining: reducedMotion ? 0.45 : 0.85,
        duration: reducedMotion ? 0.45 : 0.85
      };
      renderOnce();
    }

    function triggerNotePulse(locusIndex) {
      if (typeof locusIndex === 'number' && locusIndex >= 0 && locusIndex < 9) {
        lociState[locusIndex].notePulse = 1.0;
        renderOnce();
      }
    }

    function hitTestLocus(clientX, clientY) {
      if (typeof clientX !== 'number' || typeof clientY !== 'number') return -1;
      var rect =
        canvas && typeof canvas.getBoundingClientRect === 'function'
          ? canvas.getBoundingClientRect()
          : { left: 0, top: 0, width: cssWidth, height: cssHeight };

      if (rect && rect.width > 0 && rect.height > 0) {
        if (Math.abs(rect.width - cssWidth) > 1 || Math.abs(rect.height - cssHeight) > 1) {
          cssWidth = rect.width;
          cssHeight = rect.height;
          updateLayout();
        }
      }

      var lx = clientX - (rect ? rect.left : 0);
      var ly = clientY - (rect ? rect.top : 0);
      if (lx < -20 || ly < -20 || lx > cssWidth + 20 || ly > cssHeight + 20) {
        return -1;
      }

      var bestIdx = -1;
      var bestDistSq = Infinity;
      for (var i = 0; i < 9; i++) {
        var loc = lociState[i];
        var r = Math.max(30, loc.hitRadius);
        var dx = lx - loc.x;
        var dy = ly - loc.y;
        var d2 = dx * dx + dy * dy;
        if (d2 <= r * r && d2 < bestDistSq) {
          bestDistSq = d2;
          bestIdx = i;
        }
      }
      return bestIdx;
    }

    function setHoveredLocus(index) {
      var next = typeof index === 'number' && index >= 0 && index < 9 ? index : -1;
      if (next !== hoveredLocus) {
        hoveredLocus = next;
        renderOnce();
      }
    }

    function setReducedMotion(flag) {
      reducedMotion = !!flag;
      if (reducedMotion) {
        particles.length = 0;
        for (var i = 0; i < 9; i++) {
          lociState[i].locusVitality = lociState[i].locked ? 0.0 : 1.0;
          lociState[i].crackProgress = lociState[i].locked ? 1.0 : 0.0;
        }
      }
      renderOnce();
    }

    function getEarthlyOpacity() {
      if (isForgottenByEarth || earthlyIntegrity <= 0.02) return 0;
      if (lockedCount < 9) {
        // Weathering keeps stone legible (1.0 -> 0.62) while desaturating pigment
        return clamp(0.62 + 0.38 * ((earthlyIntegrity - 0.45) / 0.55), 0.25, 1.0);
      }
      // During 9/9 disintegration (0.45 -> 0.02), earthly stone dissolves to 0
      return clamp((earthlyIntegrity - 0.02) / 0.43, 0, 1) * 0.62;
    }

    function getMetrics() {
      var frozen = 0;
      for (var i = 0; i < 9; i++) {
        if (lociState[i].kineticFreeze) frozen++;
      }
      var vitality =
        lockedCount === 9
          ? 0
          : Number(((1 - fixationRatio) * earthlyIntegrity).toFixed(4));
      var bpm =
        lockedCount === 9
          ? 0
          : Math.max(12, Math.round(64 * (1 - 0.72 * fixationRatio)));

      return {
        phase: phase,
        lockedCount: lockedCount,
        fixationRatio: Number(fixationRatio.toFixed(4)),
        earthlyIntegrity: Number(earthlyIntegrity.toFixed(4)),
        earthlyOpacity: Number(getEarthlyOpacity().toFixed(4)),
        cityVitality: vitality,
        cityPulseBpm: bpm,
        isForgottenByEarth: isForgottenByEarth,
        frozenLociCount: frozen,
        activeDustParticles: particles.length,
        riversCount: RIVERS_COUNT,
        mountainRangesCount: MOUNTAIN_RANGES_COUNT
      };
    }

    function getLocusPositions() {
      var out = [];
      for (var i = 0; i < 9; i++) {
        var loc = lociState[i];
        out.push({
          index: i,
          id: loc.meta.id,
          x: loc.x,
          y: loc.y,
          radius: loc.hitRadius,
          locked: loc.locked,
          walked: i <= walkedUpTo
        });
      }
      return out;
    }

    // =========================================================================
    // PROCEDURAL RENAISSANCE CODEX & DECAY RENDERING PIPELINE
    // =========================================================================

    function drawBackgroundSubstrate(earthAlpha) {
      // Nocturnal wind-scoured slate beneath Zora (revealed as vellum dissolves)
      var nightBg = [23, 22, 28];
      var vellumCenter = lerpRgb([245, 236, 217], [208, 201, 189], fixationRatio * 0.85);
      var vellumEdge = lerpRgb([226, 211, 183], [176, 170, 160], fixationRatio * 0.85);

      var bgTop = lerpRgb(nightBg, vellumCenter, earthAlpha);
      var bgBot = lerpRgb([17, 17, 22], vellumEdge, earthAlpha);

      if (typeof ctx.createLinearGradient === 'function') {
        var grad = ctx.createLinearGradient(0, 0, 0, cssHeight);
        grad.addColorStop(0, rgbaStr(bgTop, 1));
        grad.addColorStop(1, rgbaStr(bgBot, 1));
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = rgbaStr(bgTop, 1);
      }
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // Subtle wind-scoured horizontal striations in the empty post-erasure ground
      var voidStrength = 1 - earthAlpha;
      if (voidStrength > 0.05) {
        ctx.save();
        ctx.strokeStyle = rgbaStr([168, 184, 206], 0.075 * voidStrength);
        ctx.lineWidth = 0.8;
        for (var s = 0; s < 11; s++) {
          var sy = cssHeight * (0.14 + s * 0.078);
          ctx.beginPath();
          ctx.moveTo(cssWidth * 0.04, sy);
          ctx.bezierCurveTo(
            cssWidth * 0.35,
            sy - 5 + (s % 3) * 4,
            cssWidth * 0.68,
            sy + 5 - (s % 2) * 4,
            cssWidth * 0.96,
            sy - 2
          );
          ctx.stroke();
        }
        ctx.restore();
      }

      // Codex folio inner border rule
      ctx.save();
      var frameRgb = lerpRgb([190, 206, 228], [134, 108, 78], earthAlpha);
      ctx.strokeStyle = rgbaStr(frameRgb, 0.32);
      ctx.lineWidth = 1;
      ctx.strokeRect(6.5, 6.5, Math.max(10, cssWidth - 13), Math.max(10, cssHeight - 13));
      ctx.restore();
    }

    function drawThreeMountainRanges(earthAlpha) {
      if (earthAlpha <= 0.001) return;

      var rangeColors = [
        lerpRgb([169, 183, 196], [166, 164, 159], fixationRatio),
        lerpRgb([196, 184, 160], [175, 171, 164], fixationRatio),
        lerpRgb([214, 195, 162], [186, 181, 173], fixationRatio)
      ];
      var ridgeStroke = lerpRgb([72, 58, 45], [108, 105, 101], fixationRatio);

      ctx.save();
      for (var r = 0; r < MOUNTAIN_RANGES_COUNT; r++) {
        var pts = MOUNTAIN_RANGES[r];
        var baseY = cssHeight * (0.245 + r * 0.014);

        ctx.beginPath();
        ctx.moveTo(0, baseY);
        for (var i = 0; i < pts.length; i++) {
          ctx.lineTo(pts[i][0] * cssWidth, pts[i][1] * cssHeight);
        }
        ctx.lineTo(cssWidth, baseY);
        ctx.closePath();

        ctx.fillStyle = rgbaStr(rangeColors[r], earthAlpha * (0.48 + r * 0.16));
        ctx.fill();

        // Carved limestone ridge contour
        ctx.beginPath();
        for (var j = 0; j < pts.length; j++) {
          var px = pts[j][0] * cssWidth;
          var py = pts[j][1] * cssHeight;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = rgbaStr(ridgeStroke, earthAlpha * (0.45 + r * 0.18));
        ctx.lineWidth = 1.0 + r * 0.25;
        ctx.stroke();

        // Copperplate slope hachures on eastern facets
        ctx.strokeStyle = rgbaStr(ridgeStroke, earthAlpha * 0.22);
        ctx.lineWidth = 0.75;
        for (var h = 1; h < pts.length - 1; h += 2) {
          var peakX = pts[h][0] * cssWidth;
          var peakY = pts[h][1] * cssHeight;
          var valleyX = pts[h + 1][0] * cssWidth;
          var valleyY = pts[h + 1][1] * cssHeight;
          for (var tick = 1; tick <= 3; tick++) {
            var frac = tick / 4;
            var hx = lerp(peakX, valleyX, frac);
            var hy = lerp(peakY, valleyY, frac);
            ctx.beginPath();
            ctx.moveTo(hx, hy);
            ctx.lineTo(hx - 6, hy + 11 + r * 3);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    }

    function drawSixRiversAndMusicalStave(earthAlpha) {
      var ghostWeight = clamp(0.22 + fixationRatio * 0.78 + (1 - earthAlpha) * 0.65, 0.22, 1.0);

      // 1. Six winding mountain rivers flowing down and converging into the 6-line stave
      var riverWaterRgb = lerpRgb([46, 102, 134], [118, 126, 132], fixationRatio);
      for (var r = 0; r < RIVERS_COUNT; r++) {
        var sx = cssWidth * (0.075 + r * 0.128);
        var sy = cssHeight * (0.088 + (r % 3) * 0.034);
        var joinU = 0.04 + r * 0.022;
        var ex = cssWidth * (0.055 + joinU);
        var ey = computeStaveY(joinU, r);

        var c1x = sx - cssWidth * 0.035 + Math.sin(r * 2.1) * 14;
        var c1y = lerp(sy, ey, 0.36);
        var c2x = lerp(sx, ex, 0.72) - cssWidth * 0.025;
        var c2y = lerp(sy, ey, 0.74);

        if (earthAlpha > 0.001) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
          ctx.strokeStyle = rgbaStr(riverWaterRgb, earthAlpha * 0.68);
          ctx.lineWidth = 1.9 - r * 0.08;
          ctx.stroke();

          // Living river shimmer pulse
          if (!reducedMotion && lockedCount < 9) {
            var pulseOffset = -((worldTime * 18 + r * 7) % 18);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
            safeSetLineDash(ctx, [4, 14]);
            if (typeof ctx.lineDashOffset === 'number') ctx.lineDashOffset = pulseOffset;
            ctx.strokeStyle = rgbaStr([205, 232, 244], earthAlpha * 0.45 * (1 - fixationRatio));
            ctx.lineWidth = 1.0;
            ctx.stroke();
            safeSetLineDash(ctx, []);
          }
          ctx.restore();
        }

        // Faint silverpoint memory trace of the 6 river headwaters in the ghost-score
        if (ghostWeight > 0.3) {
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.bezierCurveTo(c1x, c1y, c2x, c2y, ex, ey);
          safeSetLineDash(ctx, [2, 5]);
          ctx.strokeStyle = rgbaStr([172, 198, 226], (1 - earthAlpha) * 0.28 + fixationRatio * 0.12);
          ctx.lineWidth = 0.85;
          ctx.stroke();
          safeSetLineDash(ctx, []);
          ctx.restore();
        }
      }

      // 2. The 6-line Renaissance musical tablature/stave running across Zora to the Harbor
      var staveInkRgb = lerpRgb([78, 57, 39], [202, 220, 242], 1 - earthAlpha);
      var staveAlpha = earthAlpha > 0.001 ? lerp(0.55, 0.36, 1 - earthAlpha) : 0.56;

      ctx.save();
      for (var line = 0; line < RIVERS_COUNT; line++) {
        ctx.beginPath();
        var steps = 36;
        for (var s = 0; s <= steps; s++) {
          var u = s / steps;
          var lx = cssWidth * lerp(0.052, 0.955, u);
          var ly = computeStaveY(u, line);
          if (s === 0) ctx.moveTo(lx, ly);
          else ctx.lineTo(lx, ly);
        }
        ctx.strokeStyle = rgbaStr(staveInkRgb, staveAlpha);
        ctx.lineWidth = line === 0 || line === 5 ? 1.15 : 0.85;
        ctx.stroke();
      }

      // Left mensural double-bar & tempus perfectum circle
      var barX = cssWidth * 0.052;
      var topBarY = computeStaveY(0, 0) - 4;
      var botBarY = computeStaveY(0, 5) + 4;
      ctx.strokeStyle = rgbaStr(staveInkRgb, staveAlpha * 1.25);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(barX, topBarY);
      ctx.lineTo(barX, botBarY);
      ctx.moveTo(barX + 4, topBarY);
      ctx.lineTo(barX + 4, botBarY);
      ctx.stroke();

      var midClefY = (topBarY + botBarY) * 0.5;
      ctx.beginPath();
      ctx.arc(barX + 13, midClefY, 5.5, 0, Math.PI * 2);
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(barX + 13, midClefY, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = rgbaStr(staveInkRgb, staveAlpha * 1.25);
      ctx.fill();
      ctx.restore();

      // 3. Eastern Coastal Harbor basin on the lower-right where the 6 rivers meet the sea
      if (earthAlpha > 0.001) {
        ctx.save();
        var seaRgb = lerpRgb([42, 92, 124], [112, 118, 124], fixationRatio);
        ctx.beginPath();
        ctx.moveTo(cssWidth * 0.84, cssHeight * 0.98);
        ctx.quadraticCurveTo(cssWidth * 0.86, cssHeight * 0.72, cssWidth * 0.99, cssHeight * 0.64);
        ctx.lineTo(cssWidth, cssHeight);
        ctx.closePath();
        ctx.fillStyle = rgbaStr(seaRgb, earthAlpha * 0.28);
        ctx.fill();
        ctx.restore();
      }
    }

    function drawStreetItinerary(earthAlpha) {
      if (earthAlpha <= 0.001) return;

      var roadFill = lerpRgb([216, 196, 160], [166, 162, 156], fixationRatio);
      var roadEdge = lerpRgb([104, 79, 54], [112, 108, 104], fixationRatio);

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(cssWidth * 0.035, lociState[0].y - 12);
      ctx.lineTo(lociState[0].x, lociState[0].y + 14);
      for (var i = 0; i < 8; i++) {
        var a = lociState[i];
        var b = lociState[i + 1];
        var mx = (a.x + b.x) * 0.5;
        var my = (a.y + b.y) * 0.5 + (i % 2 === 0 ? 12 : -12);
        ctx.quadraticCurveTo(mx, my, b.x, b.y + 14);
      }
      ctx.lineTo(cssWidth * 0.975, lociState[8].y + 18);

      ctx.strokeStyle = rgbaStr(roadFill, earthAlpha * 0.65);
      ctx.lineWidth = clamp(cssWidth * 0.018, 8, 15);
      ctx.stroke();

      safeSetLineDash(ctx, [3, 6]);
      ctx.strokeStyle = rgbaStr(roadEdge, earthAlpha * 0.48);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      safeSetLineDash(ctx, []);
      ctx.restore();
    }

    // =========================================================================
    // 9 BESPOKE PROCEDURAL ARCHITECTURAL MINIATURES (EARTHLY LAYER)
    // =========================================================================

    function makeLocusColors(vitality, earthAlpha) {
      var k = 1 - clamp(vitality, 0, 1); // 0 = warm living, 1 = calcined chalk
      return {
        alpha: earthAlpha,
        stone: rgbaStr(lerpRgb([238, 223, 194], [224, 221, 215], k), earthAlpha),
        stoneShade: rgbaStr(lerpRgb([204, 182, 146], [176, 173, 168], k), earthAlpha),
        ink: rgbaStr(lerpRgb([46, 33, 24], [82, 80, 78], k), earthAlpha),
        copper: rgbaStr(lerpRgb([45, 122, 108], [164, 172, 169], k), earthAlpha),
        vermilion: rgbaStr(lerpRgb([186, 58, 43], [178, 158, 154], k), earthAlpha),
        ochre: rgbaStr(lerpRgb([204, 144, 52], [182, 174, 160], k), earthAlpha),
        lapis: rgbaStr(lerpRgb([44, 96, 148], [156, 166, 174], k), earthAlpha),
        glass: rgbaStr(lerpRgb([158, 212, 232], [214, 216, 218], k), earthAlpha * 0.86),
        brass: rgbaStr(lerpRgb([198, 152, 58], [162, 158, 150], k), earthAlpha),
        shadow: rgbaStr([38, 28, 20], earthAlpha * (0.18 - 0.1 * k))
      };
    }

    function drawLocusMiniature(loc, earthAlpha) {
      if (earthAlpha <= 0.001) return;

      var x = loc.x;
      var y = loc.y;
      var u = clamp(Math.min(cssWidth, cssHeight) * 0.056, 18, 29);
      var c = makeLocusColors(loc.locusVitality, earthAlpha);
      var t = loc.kineticFreeze ? loc.invariantTime : loc.animTime;
      var liveMotion = loc.kineticFreeze || reducedMotion ? 0 : 1;

      ctx.save();
      ctx.translate(x, y);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Ground shadow plinth (earthly shadow vanishes when earthAlpha === 0)
      ctx.beginPath();
      safeDrawEllipse(ctx, 0, u * 0.92, u * 0.92, u * 0.22, 0);
      ctx.fillStyle = c.shadow;
      ctx.fill();

      ctx.strokeStyle = c.ink;
      ctx.lineWidth = 1.25;

      switch (loc.index) {
        case 0: {
          // 1. THE COPPER CLOCK: campanile tower, verdigris copper dial, Roman hands, swinging pendulum
          ctx.fillStyle = c.stone;
          ctx.fillRect(-u * 0.44, -u * 0.65, u * 0.88, u * 1.52);
          ctx.strokeRect(-u * 0.44, -u * 0.65, u * 0.88, u * 1.52);

          // Stepped Renaissance belfry roof
          ctx.beginPath();
          ctx.moveTo(-u * 0.54, -u * 0.65);
          ctx.lineTo(0, -u * 1.06);
          ctx.lineTo(u * 0.54, -u * 0.65);
          ctx.closePath();
          ctx.fillStyle = c.copper;
          ctx.fill();
          ctx.stroke();

          // Lower pendulum arch + swinging brass pendulum
          ctx.beginPath();
          ctx.moveTo(-u * 0.24, u * 0.87);
          ctx.lineTo(-u * 0.24, u * 0.34);
          ctx.arc(0, u * 0.34, u * 0.24, Math.PI, 0, false);
          ctx.lineTo(u * 0.24, u * 0.87);
          ctx.closePath();
          ctx.fillStyle = c.stoneShade;
          ctx.fill();
          ctx.stroke();

          var swing = liveMotion ? Math.sin(t * 2.8) * 0.34 : 0;
          var px = Math.sin(swing) * u * 0.42;
          var py = u * 0.22 + Math.cos(swing) * u * 0.48;
          ctx.beginPath();
          ctx.moveTo(0, u * 0.22);
          ctx.lineTo(px, py);
          ctx.strokeStyle = c.brass;
          ctx.lineWidth = 1.3;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(px, py, u * 0.09, 0, Math.PI * 2);
          ctx.fillStyle = c.brass;
          ctx.fill();
          ctx.strokeStyle = c.ink;
          ctx.lineWidth = 1.0;
          ctx.stroke();

          // Verdigris copper clock dial & Roman hands
          ctx.beginPath();
          ctx.arc(0, -u * 0.24, u * 0.30, 0, Math.PI * 2);
          ctx.fillStyle = c.copper;
          ctx.fill();
          ctx.strokeStyle = c.brass;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          var minAng = liveMotion ? t * 0.45 - Math.PI * 0.5 : -Math.PI * 0.5;
          var hrAng = liveMotion ? t * 0.08 + 0.6 : 0.6;
          ctx.strokeStyle = c.stone;
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(0, -u * 0.24);
          ctx.lineTo(Math.cos(minAng) * u * 0.22, -u * 0.24 + Math.sin(minAng) * u * 0.22);
          ctx.moveTo(0, -u * 0.24);
          ctx.lineTo(Math.cos(hrAng) * u * 0.14, -u * 0.24 + Math.sin(hrAng) * u * 0.14);
          ctx.stroke();
          break;
        }

        case 1: {
          // 2. BARBER'S STRIPED AWNING: diagonal vermilion & chalk stripes fluttering + barber pole
          ctx.fillStyle = c.stone;
          ctx.fillRect(-u * 0.66, -u * 0.52, u * 1.12, u * 1.38);
          ctx.strokeRect(-u * 0.66, -u * 0.52, u * 1.12, u * 1.38);

          // Shop doorway
          ctx.fillStyle = c.stoneShade;
          ctx.fillRect(-u * 0.34, u * 0.12, u * 0.48, u * 0.74);
          ctx.strokeRect(-u * 0.34, u * 0.12, u * 0.48, u * 0.74);

          // Slanted 6-stripe vermilion & chalk awning with fluttering scalloped fringe
          var stripeCount = 6;
          var startX = -u * 0.74;
          var sw = (u * 1.30) / stripeCount;
          for (var s = 0; s < stripeCount; s++) {
            var flutter = liveMotion ? Math.sin(t * 3.4 + s * 0.9) * u * 0.065 : 0;
            var x0 = startX + s * sw;
            var x1 = x0 + sw;
            ctx.beginPath();
            ctx.moveTo(x0 + u * 0.06, -u * 0.56);
            ctx.lineTo(x1 + u * 0.06, -u * 0.56);
            ctx.lineTo(x1 - u * 0.05, -u * 0.04 + flutter);
            ctx.quadraticCurveTo(
              (x0 + x1) * 0.5 - u * 0.05,
              u * 0.08 + flutter,
              x0 - u * 0.05,
              -u * 0.04 + flutter
            );
            ctx.closePath();
            ctx.fillStyle = s % 2 === 0 ? c.vermilion : c.stone;
            ctx.fill();
            ctx.strokeStyle = c.ink;
            ctx.lineWidth = 0.95;
            ctx.stroke();
          }

          // Classic Barber Pole on right corner bracket
          var poleX = u * 0.62;
          ctx.fillStyle = c.stone;
          ctx.fillRect(poleX - u * 0.10, -u * 0.36, u * 0.20, u * 0.96);
          ctx.strokeRect(poleX - u * 0.10, -u * 0.36, u * 0.20, u * 0.96);

          var phaseShift = liveMotion ? (t * 0.35) % 0.28 : 0;
          ctx.strokeStyle = c.vermilion;
          ctx.lineWidth = 2.0;
          for (var band = 0; band < 4; band++) {
            var by = -u * 0.28 + band * u * 0.24 + phaseShift * u;
            if (by < u * 0.52) {
              ctx.beginPath();
              ctx.moveTo(poleX - u * 0.09, by);
              ctx.lineTo(poleX + u * 0.09, Math.min(u * 0.56, by + u * 0.14));
              ctx.stroke();
            }
          }
          ctx.beginPath();
          ctx.arc(poleX, -u * 0.44, u * 0.08, 0, Math.PI * 2);
          ctx.fillStyle = c.brass;
          ctx.fill();
          ctx.strokeStyle = c.ink;
          ctx.lineWidth = 0.9;
          ctx.stroke();
          break;
        }

        case 2: {
          // 3. FOUNTAIN WITH NINE JETS: carved basin + 9 distinct parabolic water arcs
          // Stepped plinth & octagonal carved basin
          ctx.fillStyle = c.stoneShade;
          ctx.fillRect(-u * 0.82, u * 0.62, u * 1.64, u * 0.24);
          ctx.strokeRect(-u * 0.82, u * 0.62, u * 1.64, u * 0.24);

          ctx.beginPath();
          ctx.moveTo(-u * 0.74, u * 0.30);
          ctx.lineTo(u * 0.74, u * 0.30);
          ctx.lineTo(u * 0.60, u * 0.62);
          ctx.lineTo(-u * 0.60, u * 0.62);
          ctx.closePath();
          ctx.fillStyle = c.stone;
          ctx.fill();
          ctx.stroke();

          // Central tiered pedestal bowl
          ctx.fillStyle = c.stoneShade;
          ctx.fillRect(-u * 0.12, -u * 0.16, u * 0.24, u * 0.46);
          ctx.strokeRect(-u * 0.12, -u * 0.16, u * 0.24, u * 0.46);
          ctx.beginPath();
          ctx.moveTo(-u * 0.34, -u * 0.16);
          ctx.quadraticCurveTo(0, u * 0.04, u * 0.34, -u * 0.16);
          ctx.closePath();
          ctx.fillStyle = c.stone;
          ctx.fill();
          ctx.stroke();

          // Exactly 9 distinct parabolic water jets (-4..+4)
          var jetConfigs = [-0.68, -0.52, -0.36, -0.20, 0.0, 0.20, 0.36, 0.52, 0.68];
          for (var j = 0; j < 9; j++) {
            var targetX = jetConfigs[j] * u;
            var archH = -u * (0.98 - Math.abs(jetConfigs[j]) * 0.58);
            var shimmer = liveMotion ? Math.sin(t * 4.2 + j * 0.8) * u * 0.04 : 0;

            ctx.beginPath();
            ctx.moveTo(targetX * 0.18, -u * 0.18);
            ctx.quadraticCurveTo(targetX * 0.55, archH + shimmer, targetX, u * 0.29);
            ctx.strokeStyle = c.lapis;
            ctx.lineWidth = j === 4 ? 1.65 : 1.25;
            ctx.stroke();

            // Traveling water droplet along each parabola while living
            var dropU = liveMotion ? ((t * 1.15 + j * 0.11) % 1) : 0.48;
            var p0x = targetX * 0.18;
            var p0y = -u * 0.18;
            var p1x = targetX * 0.55;
            var p1y = archH + shimmer;
            var p2x = targetX;
            var p2y = u * 0.29;
            var inv = 1 - dropU;
            var dx = inv * inv * p0x + 2 * inv * dropU * p1x + dropU * dropU * p2x;
            var dy = inv * inv * p0y + 2 * inv * dropU * p1y + dropU * dropU * p2y;
            ctx.beginPath();
            ctx.arc(dx, dy, 1.4, 0, Math.PI * 2);
            ctx.fillStyle = c.glass;
            ctx.fill();
          }
          break;
        }

        case 3: {
          // 4. ASTRONOMER'S GLASS TOWER: faceted crystal observatory cupola + rotating brass armillary rings
          ctx.beginPath();
          ctx.moveTo(-u * 0.42, u * 0.86);
          ctx.lineTo(-u * 0.34, -u * 0.08);
          ctx.lineTo(u * 0.34, -u * 0.08);
          ctx.lineTo(u * 0.42, u * 0.86);
          ctx.closePath();
          ctx.fillStyle = c.stone;
          ctx.fill();
          ctx.stroke();

          // Faceted crystal cupola dome
          ctx.beginPath();
          ctx.moveTo(-u * 0.38, -u * 0.08);
          ctx.lineTo(-u * 0.26, -u * 0.52);
          ctx.lineTo(0, -u * 0.68);
          ctx.lineTo(u * 0.26, -u * 0.52);
          ctx.lineTo(u * 0.38, -u * 0.08);
          ctx.closePath();
          ctx.fillStyle = c.glass;
          ctx.fill();
          ctx.strokeStyle = c.ink;
          ctx.lineWidth = 1.1;
          ctx.stroke();

          // Prismatic facet ribs
          ctx.beginPath();
          ctx.moveTo(0, -u * 0.68);
          ctx.lineTo(-u * 0.12, -u * 0.08);
          ctx.moveTo(0, -u * 0.68);
          ctx.lineTo(u * 0.12, -u * 0.08);
          ctx.stroke();

          // Rotating brass armillary rings crowning the cupola
          var ringY = -u * 0.86;
          var rx1 = liveMotion ? Math.max(2.5, Math.abs(Math.cos(t * 1.55)) * u * 0.32) : u * 0.30;
          var rx2 = liveMotion ? Math.max(2.5, Math.abs(Math.sin(t * 1.15 + 0.6)) * u * 0.30) : u * 0.14;

          ctx.strokeStyle = c.brass;
          ctx.lineWidth = 1.35;
          ctx.beginPath();
          safeDrawEllipse(ctx, 0, ringY, u * 0.32, u * 0.32, 0);
          ctx.stroke();
          ctx.beginPath();
          safeDrawEllipse(ctx, 0, ringY, rx1, u * 0.32, 0.32);
          ctx.stroke();
          ctx.beginPath();
          safeDrawEllipse(ctx, 0, ringY, rx2, u * 0.30, -0.45);
          ctx.stroke();
          break;
        }

        case 4: {
          // 5. MELON VENDOR'S KIOSK: slatted timber booth + pyramid of ribbed melons + hanging scale
          // Timber posts & counter
          ctx.strokeStyle = c.ink;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(-u * 0.64, -u * 0.42);
          ctx.lineTo(-u * 0.64, u * 0.84);
          ctx.moveTo(u * 0.64, -u * 0.42);
          ctx.lineTo(u * 0.64, u * 0.84);
          ctx.stroke();

          ctx.fillStyle = c.stoneShade;
          ctx.fillRect(-u * 0.68, u * 0.28, u * 1.36, u * 0.56);
          ctx.strokeRect(-u * 0.68, u * 0.28, u * 1.36, u * 0.56);

          // Slatted timber pitched roof
          ctx.beginPath();
          ctx.moveTo(-u * 0.78, -u * 0.38);
          ctx.lineTo(0, -u * 0.82);
          ctx.lineTo(u * 0.78, -u * 0.38);
          ctx.closePath();
          ctx.fillStyle = c.ochre;
          ctx.fill();
          ctx.stroke();

          // Slats
          for (var sl = -2; sl <= 2; sl++) {
            ctx.beginPath();
            ctx.moveTo(sl * u * 0.24, u * 0.28);
            ctx.lineTo(sl * u * 0.24, u * 0.84);
            ctx.stroke();
          }

          // Pyramid of 6 ribbed green & ochre melons on counter
          var melonCoords = [
            [-0.42, 0.16], [-0.20, 0.16], [0.02, 0.16],
            [-0.31, -0.02], [-0.09, -0.02],
            [-0.20, -0.19]
          ];
          for (var m = 0; m < melonCoords.length; m++) {
            var mx = melonCoords[m][0] * u;
            var my = melonCoords[m][1] * u;
            ctx.beginPath();
            safeDrawEllipse(ctx, mx, my, u * 0.115, u * 0.10, 0);
            ctx.fillStyle = m % 2 === 0 ? c.copper : c.ochre;
            ctx.fill();
            ctx.strokeStyle = c.ink;
            ctx.lineWidth = 0.95;
            ctx.stroke();
          }

          // Hanging brass balance scale swaying gently on the right eave
          var tilt = liveMotion ? Math.sin(t * 2.15) * 0.20 : 0;
          var sx = u * 0.38;
          var sy = -u * 0.22;
          ctx.strokeStyle = c.brass;
          ctx.lineWidth = 1.25;
          ctx.beginPath();
          ctx.moveTo(sx, -u * 0.42);
          ctx.lineTo(sx, sy);
          var bxL = sx - Math.cos(tilt) * u * 0.22;
          var byL = sy - Math.sin(tilt) * u * 0.22;
          var bxR = sx + Math.cos(tilt) * u * 0.22;
          var byR = sy + Math.sin(tilt) * u * 0.22;
          ctx.moveTo(bxL, byL);
          ctx.lineTo(bxR, byR);
          ctx.moveTo(bxL, byL);
          ctx.lineTo(bxL, byL + u * 0.22);
          ctx.moveTo(bxR, byR);
          ctx.lineTo(bxR, byR + u * 0.22);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(bxL, byL + u * 0.22, u * 0.08, 0, Math.PI, false);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(bxR, byR + u * 0.22, u * 0.08, 0, Math.PI, false);
          ctx.stroke();
          break;
        }

        case 5: {
          // 6. STATUE OF THE HERMIT AND THE LION: pedestal, cowled ascetic + staff, crouched stone lion
          // Classical stone pedestal
          ctx.fillStyle = c.stoneShade;
          ctx.fillRect(-u * 0.68, u * 0.42, u * 1.36, u * 0.44);
          ctx.strokeRect(-u * 0.68, u * 0.42, u * 1.36, u * 0.44);
          ctx.fillStyle = c.stone;
          ctx.fillRect(-u * 0.56, u * 0.48, u * 1.12, u * 0.30);
          ctx.strokeRect(-u * 0.56, u * 0.48, u * 1.12, u * 0.30);

          // Cowled Hermit figure (left of pedestal)
          ctx.beginPath();
          ctx.moveTo(-u * 0.42, u * 0.42);
          ctx.lineTo(-u * 0.36, -u * 0.38);
          ctx.quadraticCurveTo(-u * 0.22, -u * 0.78, -u * 0.08, -u * 0.38);
          ctx.lineTo(-u * 0.02, u * 0.42);
          ctx.closePath();
          ctx.fillStyle = c.stone;
          ctx.fill();
          ctx.stroke();

          // Hermit's tall Tau-staff + living lantern halo
          var staffX = -u * 0.50;
          ctx.beginPath();
          ctx.moveTo(staffX, u * 0.42);
          ctx.lineTo(staffX, -u * 0.80);
          ctx.moveTo(staffX - u * 0.10, -u * 0.80);
          ctx.lineTo(staffX + u * 0.10, -u * 0.80);
          ctx.strokeStyle = c.brass;
          ctx.lineWidth = 1.45;
          ctx.stroke();

          if (liveMotion) {
            var haloR = u * (0.14 + 0.04 * Math.sin(t * 2.5));
            ctx.beginPath();
            ctx.arc(staffX, -u * 0.80, haloR, 0, Math.PI * 2);
            ctx.fillStyle = rgbaStr([235, 184, 78], earthAlpha * 0.34);
            ctx.fill();
          }

          // Crouched Stone Lion (right of pedestal) with sculpted mane & curled tail
          ctx.beginPath();
          ctx.moveTo(u * 0.02, u * 0.42);
          ctx.quadraticCurveTo(u * 0.08, u * 0.08, u * 0.28, u * 0.04);
          ctx.arc(u * 0.38, u * 0.08, u * 0.16, -Math.PI * 0.75, Math.PI * 0.35, false);
          ctx.lineTo(u * 0.56, u * 0.42);
          ctx.closePath();
          ctx.fillStyle = c.ochre;
          ctx.fill();
          ctx.strokeStyle = c.ink;
          ctx.lineWidth = 1.15;
          ctx.stroke();

          // Lion tail curl
          var tailSway = liveMotion ? Math.sin(t * 1.9) * u * 0.05 : 0;
          ctx.beginPath();
          ctx.moveTo(u * 0.05, u * 0.34);
          ctx.quadraticCurveTo(-u * 0.06, u * 0.14, u * 0.04 + tailSway, u * 0.04);
          ctx.stroke();
          break;
        }

        case 6: {
          // 7. TURKISH BATH: perforated star-oculus masonry dome + curling warm vapor plumes
          // Vaulted masonry base
          ctx.fillStyle = c.stone;
          ctx.fillRect(-u * 0.68, u * 0.22, u * 1.36, u * 0.64);
          ctx.strokeRect(-u * 0.68, u * 0.22, u * 1.36, u * 0.64);

          // Hemispherical hammam dome
          ctx.beginPath();
          ctx.arc(0, u * 0.22, u * 0.62, Math.PI, 0, false);
          ctx.closePath();
          ctx.fillStyle = c.stoneShade;
          ctx.fill();
          ctx.stroke();

          // Arched entrance
          ctx.beginPath();
          ctx.moveTo(-u * 0.20, u * 0.86);
          ctx.lineTo(-u * 0.20, u * 0.50);
          ctx.arc(0, u * 0.50, u * 0.20, Math.PI, 0, false);
          ctx.lineTo(u * 0.20, u * 0.86);
          ctx.closePath();
          ctx.fillStyle = c.ink;
          ctx.fill();

          // Perforated star-oculi glowing across the dome
          var oculi = [
            [0, -0.22], [-0.28, -0.08], [0.28, -0.08], [-0.15, 0.06], [0.15, 0.06]
          ];
          for (var oc = 0; oc < oculi.length; oc++) {
            ctx.beginPath();
            ctx.arc(oculi[oc][0] * u, oculi[oc][1] * u, u * 0.055, 0, Math.PI * 2);
            ctx.fillStyle = loc.locked ? c.stone : c.ochre;
            ctx.fill();
            ctx.strokeStyle = c.ink;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }

          // Curling warm vapor plumes rising from crown vents
          var plumeX = [-0.26, 0.0, 0.26];
          ctx.strokeStyle = loc.locked
            ? rgbaStr([150, 150, 148], earthAlpha * 0.45)
            : rgbaStr([236, 232, 224], earthAlpha * 0.82);
          ctx.lineWidth = 1.5;
          for (var vp = 0; vp < 3; vp++) {
            var baseVx = plumeX[vp] * u;
            var drift = liveMotion ? Math.sin(t * 2.4 + vp * 1.4) * u * 0.14 : 0;
            var lift = liveMotion ? ((t * 0.35 + vp * 0.3) % 0.22) * u : 0;
            ctx.beginPath();
            ctx.moveTo(baseVx, -u * 0.42 - lift * 0.3);
            ctx.bezierCurveTo(
              baseVx - u * 0.14 + drift,
              -u * 0.66 - lift,
              baseVx + u * 0.16 - drift,
              -u * 0.86 - lift,
              baseVx + drift * 0.6,
              -u * 1.06 - lift
            );
            ctx.stroke();
          }
          break;
        }

        case 7: {
          // 8. CAFE AT THE CORNER: corner colonnade arch, swinging brass lantern, marble table & cups
          ctx.fillStyle = c.stone;
          ctx.fillRect(-u * 0.68, -u * 0.56, u * 1.36, u * 1.42);
          ctx.strokeRect(-u * 0.68, -u * 0.56, u * 1.36, u * 1.42);

          // Twin corner colonnade arches
          ctx.fillStyle = c.stoneShade;
          for (var side = -1; side <= 1; side += 2) {
            var acx = side * u * 0.32;
            ctx.beginPath();
            ctx.moveTo(acx - u * 0.24, u * 0.86);
            ctx.lineTo(acx - u * 0.24, u * 0.05);
            ctx.arc(acx, u * 0.05, u * 0.24, Math.PI, 0, false);
            ctx.lineTo(acx + u * 0.24, u * 0.86);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }

          // Central corner column
          ctx.fillStyle = c.stone;
          ctx.fillRect(-u * 0.07, -u * 0.06, u * 0.14, u * 0.92);
          ctx.strokeRect(-u * 0.07, -u * 0.06, u * 0.14, u * 0.92);

          // Swinging brass corner lantern on wrought-iron bracket
          var lSwing = liveMotion ? Math.sin(t * 2.5) * 0.24 : 0;
          var anchorX = u * 0.68;
          var anchorY = -u * 0.34;
          var lx = anchorX + u * 0.20 + Math.sin(lSwing) * u * 0.22;
          var ly = anchorY + Math.cos(lSwing) * u * 0.24;
          ctx.strokeStyle = c.ink;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(anchorX, anchorY);
          ctx.lineTo(anchorX + u * 0.20, anchorY);
          ctx.lineTo(lx, ly);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(lx, ly + u * 0.06, u * 0.09, 0, Math.PI * 2);
          ctx.fillStyle = loc.locked ? c.stoneShade : c.ochre;
          ctx.fill();
          ctx.strokeStyle = c.brass;
          ctx.stroke();

          // Round marble café table & two cups in the foreground
          ctx.beginPath();
          safeDrawEllipse(ctx, -u * 0.26, u * 0.56, u * 0.28, u * 0.09, 0);
          ctx.fillStyle = c.stone;
          ctx.fill();
          ctx.strokeStyle = c.ink;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-u * 0.26, u * 0.65);
          ctx.lineTo(-u * 0.26, u * 0.88);
          ctx.stroke();

          // Two cups
          ctx.fillStyle = c.vermilion;
          ctx.fillRect(-u * 0.38, u * 0.45, u * 0.09, u * 0.09);
          ctx.fillRect(-u * 0.20, u * 0.45, u * 0.09, u * 0.09);
          break;
        }

        case 8: {
          // 9. ALLEY LEADING TO THE HARBOR: converging perspective flagstones, bollard, sea & sail mast
          // Left & right converging canyon walls framing the open harbor horizon
          ctx.beginPath();
          ctx.moveTo(-u * 0.76, -u * 0.68);
          ctx.lineTo(-u * 0.26, -u * 0.30);
          ctx.lineTo(-u * 0.26, u * 0.28);
          ctx.lineTo(-u * 0.76, u * 0.86);
          ctx.closePath();
          ctx.fillStyle = c.stone;
          ctx.fill();
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(u * 0.76, -u * 0.68);
          ctx.lineTo(u * 0.26, -u * 0.30);
          ctx.lineTo(u * 0.26, u * 0.28);
          ctx.lineTo(u * 0.76, u * 0.86);
          ctx.closePath();
          ctx.fillStyle = c.stoneShade;
          ctx.fill();
          ctx.stroke();

          // Sea horizon & lapping harbor waves in the vista gap
          ctx.fillStyle = c.lapis;
          ctx.fillRect(-u * 0.26, -u * 0.04, u * 0.52, u * 0.32);
          ctx.strokeStyle = c.glass;
          ctx.lineWidth = 0.95;
          for (var w = 0; w < 3; w++) {
            var wy = u * (0.04 + w * 0.09);
            var waveShift = liveMotion ? Math.sin(t * 2.6 + w * 1.3) * u * 0.05 : 0;
            ctx.beginPath();
            ctx.moveTo(-u * 0.22 + waveShift, wy);
            ctx.lineTo(u * 0.20 + waveShift, wy);
            ctx.stroke();
          }

          // Lateen sail mast gently rocking on the harbor
          var mastTilt = liveMotion ? Math.sin(t * 1.8) * 0.12 : 0;
          ctx.save();
          ctx.translate(u * 0.02, u * 0.02);
          ctx.rotate(mastTilt);
          ctx.strokeStyle = c.ink;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(0, u * 0.06);
          ctx.lineTo(0, -u * 0.44);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, -u * 0.42);
          ctx.quadraticCurveTo(u * 0.20, -u * 0.22, u * 0.02, -u * 0.04);
          ctx.closePath();
          ctx.fillStyle = c.stone;
          ctx.fill();
          ctx.stroke();
          ctx.restore();

          // Converging perspective flagstones & mooring bollard
          ctx.strokeStyle = c.ink;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(-u * 0.12, u * 0.28);
          ctx.lineTo(-u * 0.36, u * 0.86);
          ctx.moveTo(u * 0.12, u * 0.28);
          ctx.lineTo(u * 0.36, u * 0.86);
          ctx.moveTo(-u * 0.48, u * 0.56);
          ctx.lineTo(u * 0.48, u * 0.56);
          ctx.stroke();

          // Mooring bollard
          ctx.fillStyle = c.copper;
          ctx.fillRect(u * 0.26, u * 0.54, u * 0.16, u * 0.28);
          ctx.strokeRect(u * 0.26, u * 0.54, u * 0.16, u * 0.28);
          ctx.beginPath();
          ctx.arc(u * 0.34, u * 0.54, u * 0.10, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;
        }
      }

      // Deterministic masonry fracture cracks when locus is locked invariant
      if (loc.crackProgress > 0.01) {
        var crackAlpha = earthAlpha * loc.crackProgress * 0.88;
        ctx.strokeStyle = rgbaStr([42, 36, 33], crackAlpha);
        ctx.lineWidth = 1.15;
        for (var ci = 0; ci < loc.cracks.length; ci++) {
          var br = loc.cracks[ci];
          var maxSeg = Math.max(1, Math.ceil((br.main.length - 1) * loc.crackProgress));
          ctx.beginPath();
          ctx.moveTo(br.main[0][0] * u, br.main[0][1] * u);
          for (var si = 1; si <= maxSeg; si++) {
            ctx.lineTo(br.main[si][0] * u, br.main[si][1] * u);
          }
          ctx.stroke();

          if (br.fork && loc.crackProgress > 0.55) {
            ctx.beginPath();
            ctx.moveTo(br.fork[0][0] * u, br.fork[0][1] * u);
            ctx.lineTo(br.fork[1][0] * u, br.fork[1][1] * u);
            ctx.stroke();
          }
        }
      }

      ctx.restore();
    }

    // =========================================================================
    // MENTAL GHOST-SCORE: CONSTELLATION CHORDS, SQUARE NEUMES & HONEYCOMB CELLS
    // =========================================================================

    function drawMentalGhostConstellations(earthAlpha) {
      var ghostProminence = clamp((1 - earthAlpha) * 0.85 + fixationRatio * 0.45, 0, 1);
      if (ghostProminence <= 0.05) return;

      ctx.save();

      // 1. Silverpoint melody spine connecting the 9 unalterable steps (I -> IX)
      ctx.beginPath();
      for (var i = 0; i < 9; i++) {
        var p = lociState[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      safeSetLineDash(ctx, [3, 5]);
      ctx.strokeStyle = rgbaStr([204, 222, 244], ghostProminence * 0.52);
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // 2. Dotted Affinity & Contrast constellation chords linking locked honeycomb cells
      var lockedNodes = [];
      for (var n = 0; n < 9; n++) {
        if (lociState[n].locked) lockedNodes.push(lociState[n]);
      }

      for (var a = 0; a < lockedNodes.length; a++) {
        var na = lockedNodes[a];
        var nb = lockedNodes[(a + 2) % lockedNodes.length];
        if (na === nb) continue;
        var isContrast = na.binding && na.binding.relation === 'contrast';
        var midX = (na.x + nb.x) * 0.5;
        var midY = (na.y + nb.y) * 0.5 - 26 - (a % 3) * 10;

        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.quadraticCurveTo(midX, midY, nb.x, nb.y);
        safeSetLineDash(ctx, isContrast ? [6, 4, 1.5, 4] : [1.8, 4.5]);
        ctx.strokeStyle = isContrast
          ? rgbaStr([188, 206, 238], ghostProminence * 0.48)
          : rgbaStr([232, 208, 148], ghostProminence * 0.52);
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }
      safeSetLineDash(ctx, []);
      ctx.restore();
    }

    function drawSquareNeumesAndHoneycombCells(earthAlpha) {
      var u = clamp(Math.min(cssWidth, cssHeight) * 0.056, 18, 29);
      var hexR = u * 1.26;
      var ghostMode = earthAlpha < 0.35;
      var nextRequired = walkedUpTo + 1;

      for (var i = 0; i < 9; i++) {
        var loc = lociState[i];
        var isWalked = i <= walkedUpTo;
        var isActive = i === activeLocus;
        var isNext = i === nextRequired && !loc.locked;
        var isHovered = i === hoveredLocus;

        // 1. Square Renaissance musical neume perched on the 6-line stave at this locus's x
        var staveU = clamp((loc.x / cssWidth - 0.052) / (0.955 - 0.052), 0, 1);
        // Map neumeRank (0..7) onto stave lines/spaces (line 5 at bottom -> line 0 at top)
        var linePos = 5.0 - loc.meta.neumeRank * 0.72;
        var neumeX = loc.x;
        var neumeY = computeStaveY(staveU, linePos);

        ctx.save();
        var neumeColor = ghostMode
          ? [226, 236, 248]
          : isWalked || loc.locked
            ? [176, 56, 42]
            : [92, 72, 54];
        var neumeAlpha = isWalked || loc.locked || ghostMode ? 0.92 : 0.42;

        // Subtle vertical silverpoint tether between neume and locus cell in ghost/locked states
        if (loc.locked || ghostMode || isActive) {
          ctx.beginPath();
          ctx.moveTo(neumeX, neumeY);
          ctx.lineTo(loc.x, loc.y);
          safeSetLineDash(ctx, [2, 4]);
          ctx.strokeStyle = rgbaStr(
            ghostMode ? [196, 218, 242] : [132, 108, 76],
            ghostMode ? 0.38 : 0.26
          );
          ctx.lineWidth = 0.85;
          ctx.stroke();
          safeSetLineDash(ctx, []);
        }

        // Square mensural notehead (punctum/virga)
        var ns = isActive || loc.notePulse > 0.1 ? 4.4 : 3.4;
        ctx.fillStyle = rgbaStr(neumeColor, neumeAlpha);
        ctx.fillRect(neumeX - ns, neumeY - ns * 0.78, ns * 2, ns * 1.56);
        ctx.beginPath();
        ctx.moveTo(neumeX + ns, neumeY - ns * 0.78);
        ctx.lineTo(neumeX + ns, neumeY + ns * 2.8);
        ctx.strokeStyle = rgbaStr(neumeColor, neumeAlpha);
        ctx.lineWidth = 1.15;
        ctx.stroke();

        if (loc.notePulse > 0.02) {
          var ringR = 6 + (1 - loc.notePulse) * 18;
          ctx.beginPath();
          ctx.arc(neumeX, neumeY, ringR, 0, Math.PI * 2);
          ctx.strokeStyle = rgbaStr(
            ghostMode ? [216, 236, 255] : [198, 142, 54],
            loc.notePulse * 0.75
          );
          ctx.lineWidth = 1.3;
          ctx.stroke();
        }
        ctx.restore();

        // 2. Hover / Next-step guide halo when unbound
        if ((isHovered || isNext || isActive) && !loc.locked && earthAlpha > 0.01) {
          ctx.save();
          var pulse = !reducedMotion && isNext ? 0.5 + 0.5 * Math.sin(worldTime * 3.8) : 0.8;
          ctx.beginPath();
          ctx.arc(loc.x, loc.y, hexR * (isHovered ? 1.05 : 0.98), 0, Math.PI * 2);
          safeSetLineDash(ctx, isNext ? [4, 4] : []);
          ctx.strokeStyle = isHovered
            ? rgbaStr([45, 118, 106], 0.82 * earthAlpha)
            : isActive
              ? rgbaStr([184, 62, 44], 0.76 * earthAlpha)
              : rgbaStr([178, 122, 38], (0.35 + 0.35 * pulse) * earthAlpha);
          ctx.lineWidth = isHovered || isActive ? 1.8 : 1.3;
          ctx.stroke();
          safeSetLineDash(ctx, []);
          ctx.restore();
        }

        // 3. Hexagonal Honeycomb Cell (locked invariant OR ghost-score state)
        if (loc.locked || earthAlpha <= 0.02) {
          ctx.save();
          var isContrastRel = loc.binding && loc.binding.relation === 'contrast';
          var cellStroke = ghostMode
            ? isContrastRel
              ? [186, 214, 246]
              : [236, 216, 162]
            : isContrastRel
              ? [64, 96, 132]
              : [168, 124, 42];

          // Subtle luminous interior wash in ghost mode
          drawHexagonPath(ctx, loc.x, loc.y, hexR, false);
          ctx.fillStyle = ghostMode
            ? rgbaStr([210, 226, 246], 0.08 + (isHovered ? 0.08 : 0))
            : rgbaStr([244, 238, 224], 0.16);
          ctx.fill();
          ctx.strokeStyle = rgbaStr(cellStroke, ghostMode ? 0.92 : 0.86);
          ctx.lineWidth = isHovered || isActive ? 2.1 : 1.55;
          ctx.stroke();

          // Inner double-rule silverpoint hexagon
          drawHexagonPath(ctx, loc.x, loc.y, hexR * 0.88, false);
          ctx.strokeStyle = rgbaStr(cellStroke, ghostMode ? 0.44 : 0.35);
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Six vertex invariance pins
          for (var v = 0; v < 6; v++) {
            var va = -Math.PI / 2 + (v * Math.PI) / 3;
            ctx.beginPath();
            ctx.arc(
              loc.x + Math.cos(va) * hexR,
              loc.y + Math.sin(va) * hexR,
              1.7,
              0,
              Math.PI * 2
            );
            ctx.fillStyle = rgbaStr(cellStroke, 0.9);
            ctx.fill();
          }

          // Center glyph when earthly stone has vanished, OR corner glyph badge while stone still stands
          var glyphText = (loc.binding && loc.binding.glyph) || loc.meta.roman;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          if (earthAlpha <= 0.08) {
            // Pure Mental Ghost-Score centerpiece inside the empty hexagon!
            ctx.font = '600 ' + Math.round(u * 0.72) + 'px Georgia, "Times New Roman", serif';
            ctx.fillStyle = rgbaStr([238, 244, 252], 0.96);
            ctx.fillText(glyphText, loc.x, loc.y - u * 0.08);

            ctx.font = '500 ' + Math.max(9, Math.round(u * 0.36)) + 'px Georgia, serif';
            ctx.fillStyle = rgbaStr(cellStroke, 0.88);
            ctx.fillText(
              loc.meta.noteName + (isContrastRel ? ' · ☍' : ' · ◈'),
              loc.x,
              loc.y + u * 0.46
            );
          } else {
            // Token seal badge pinned at top-right vertex of locked hexagon
            var bx = loc.x + hexR * 0.74;
            var by = loc.y - hexR * 0.56;
            ctx.beginPath();
            ctx.arc(bx, by, Math.max(9.5, u * 0.42), 0, Math.PI * 2);
            ctx.fillStyle = rgbaStr([36, 31, 28], 0.9);
            ctx.fill();
            ctx.strokeStyle = rgbaStr(cellStroke, 0.95);
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.font = '600 ' + Math.max(9, Math.round(u * 0.42)) + 'px Georgia, serif';
            ctx.fillStyle = rgbaStr([244, 232, 196], 0.98);
            ctx.fillText(glyphText, bx, by + 0.5);
          }

          ctx.restore();
        }

        // 4. Locus Roman numeral & ghosted Latin caption
        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        var labelY = loc.y + hexR + 3;

        if (earthAlpha <= 0.12) {
          // Ghosted Latin numeral hovering over wind-scoured earth
          ctx.font = 'italic ' + Math.max(9, Math.round(u * 0.42)) + 'px Georgia, "Times New Roman", serif';
          ctx.fillStyle = rgbaStr([212, 226, 244], 0.88);
          ctx.fillText(loc.meta.shortLatin, loc.x, labelY);
        } else {
          var badgeText = loc.meta.roman + ' · ' + loc.meta.noteName;
          ctx.font = '600 ' + Math.max(9, Math.round(u * 0.40)) + 'px Georgia, "Times New Roman", serif';
          var pillW = Math.max(38, badgeText.length * 5.6 + 8);
          var pillH = Math.max(14, Math.round(u * 0.56));
          ctx.fillStyle = isWalked || loc.locked
            ? rgbaStr([44, 33, 25], 0.84 * earthAlpha)
            : rgbaStr([236, 225, 202], 0.86 * earthAlpha);
          ctx.fillRect(loc.x - pillW * 0.5, labelY, pillW, pillH);
          ctx.strokeStyle = rgbaStr([96, 74, 52], 0.55 * earthAlpha);
          ctx.lineWidth = 0.85;
          ctx.strokeRect(loc.x - pillW * 0.5, labelY, pillW, pillH);

          ctx.fillStyle = isWalked || loc.locked
            ? rgbaStr([245, 234, 208], 0.96 * earthAlpha)
            : rgbaStr([58, 43, 30], 0.92 * earthAlpha);
          ctx.fillText(badgeText, loc.x, labelY + 2);
        }
        ctx.restore();
      }
    }

    function drawRefusalOverlay() {
      if (!refusalFlash) return;
      var prog = clamp(refusalFlash.remaining / refusalFlash.duration, 0, 1);
      var u = clamp(Math.min(cssWidth, cssHeight) * 0.056, 18, 29);
      var hexR = u * 1.32;

      ctx.save();
      var attIdx = refusalFlash.attemptedIndex;
      var reqIdx = refusalFlash.requiredIndex;

      if (attIdx >= 0 && attIdx < 9) {
        var att = lociState[attIdx];
        var jitter = reducedMotion ? 0 : Math.sin(prog * Math.PI * 10) * 4.5 * prog;
        drawHexagonPath(ctx, att.x + jitter, att.y, hexR, false);
        ctx.strokeStyle = rgbaStr([204, 48, 38], prog * 0.95);
        ctx.lineWidth = 2.4;
        ctx.stroke();

        // Crisp refusal cross-seal
        var cr = u * 0.52;
        ctx.beginPath();
        ctx.moveTo(att.x + jitter - cr, att.y - cr);
        ctx.lineTo(att.x + jitter + cr, att.y + cr);
        ctx.moveTo(att.x + jitter + cr, att.y - cr);
        ctx.lineTo(att.x + jitter - cr, att.y + cr);
        ctx.stroke();
      }

      if (reqIdx >= 0 && reqIdx < 9) {
        var req = lociState[reqIdx];
        ctx.beginPath();
        ctx.arc(req.x, req.y, hexR * 1.08, 0, Math.PI * 2);
        ctx.strokeStyle = rgbaStr([56, 152, 132], prog * 0.92);
        ctx.lineWidth = 2.2;
        ctx.stroke();

        if (attIdx >= 0 && attIdx < 9 && attIdx !== reqIdx) {
          var from = lociState[attIdx];
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.quadraticCurveTo(
            (from.x + req.x) * 0.5,
            Math.min(from.y, req.y) - 34,
            req.x,
            req.y
          );
          safeSetLineDash(ctx, [4, 4]);
          ctx.strokeStyle = rgbaStr([204, 48, 38], prog * 0.72);
          ctx.lineWidth = 1.35;
          ctx.stroke();
          safeSetLineDash(ctx, []);
        }
      }
      ctx.restore();
    }

    function drawWindDustParticles() {
      if (particles.length === 0) return;
      ctx.save();
      for (var i = 0; i < particles.length; i++) {
        var pt = particles[i];
        var life = 1 - pt.age / pt.maxAge;
        var alpha = clamp(Math.sin(life * Math.PI) * 0.85, 0, 0.85);
        var rgb = pt.isInk ? [58, 46, 38] : [224, 216, 198];
        ctx.fillStyle = rgbaStr(rgb, alpha);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function renderOnce() {
      if (!ctx) return;

      ctx.save();
      if (typeof ctx.setTransform === 'function') {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      if (typeof ctx.clearRect === 'function') {
        ctx.clearRect(0, 0, cssWidth, cssHeight);
      }

      var earthAlpha = getEarthlyOpacity();

      drawBackgroundSubstrate(earthAlpha);
      drawThreeMountainRanges(earthAlpha);
      drawSixRiversAndMusicalStave(earthAlpha);
      drawStreetItinerary(earthAlpha);

      if (earthAlpha > 0.001) {
        for (var i = 0; i < 9; i++) {
          drawLocusMiniature(lociState[i], earthAlpha);
        }
      }

      drawMentalGhostConstellations(earthAlpha);
      drawSquareNeumesAndHoneycombCells(earthAlpha);
      drawWindDustParticles();
      drawRefusalOverlay();

      ctx.restore();
    }

    function onAnimationFrame(nowMs) {
      if (!isRunning) return;
      var dt = lastFrameMs > 0 ? (nowMs - lastFrameMs) / 1000 : 0.016;
      lastFrameMs = nowMs;
      step(dt);
      renderOnce();
      if (typeof requestAnimationFrame === 'function') {
        rafId = requestAnimationFrame(onAnimationFrame);
      }
    }

    function start() {
      if (isRunning) return;
      isRunning = true;
      lastFrameMs = 0;
      renderOnce();
      if (typeof requestAnimationFrame === 'function') {
        rafId = requestAnimationFrame(onAnimationFrame);
      }
    }

    function stop() {
      isRunning = false;
      if (rafId !== null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(rafId);
      }
      rafId = null;
    }

    function destroy() {
      stop();
      particles.length = 0;
    }

    // Initialize geometry & render initial living frame
    resize();

    return {
      syncFromScore: syncFromScore,
      triggerRefusalFlash: triggerRefusalFlash,
      triggerNotePulse: triggerNotePulse,
      hitTestLocus: hitTestLocus,
      setHoveredLocus: setHoveredLocus,
      setReducedMotion: setReducedMotion,
      fastForwardDisintegration: fastForwardDisintegration,
      resize: resize,
      start: start,
      stop: stop,
      step: step,
      renderOnce: renderOnce,
      getMetrics: getMetrics,
      getLocusPositions: getLocusPositions,
      destroy: destroy
    };
  }

  var api = Object.freeze({
    RIVERS_COUNT: RIVERS_COUNT,
    MOUNTAIN_RANGES_COUNT: MOUNTAIN_RANGES_COUNT,
    PHASES: PHASES,
    LOCI_METADATA: LOCI_METADATA,
    createRenderer: createRenderer
  });

  if (typeof window !== 'undefined') {
    window.ZoraDisintegration = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.ZoraDisintegration = api;
  }
})();
