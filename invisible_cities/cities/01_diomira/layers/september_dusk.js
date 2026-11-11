(function () {
  'use strict';

  var DUSK_THRESHOLD = 0.08;

  // Eight rich jewel hues: saffron, vermilion, emerald, cobalt, violet, amber, magenta, turquoise
  var LAMP_PALETTE = [
    '#f4b728', // saffron
    '#e8442a', // vermilion
    '#1bc27a', // emerald
    '#286ce6', // cobalt
    '#8e4ae8', // violet
    '#f08719', // amber
    '#dc368a', // magenta
    '#1ec4cb'  // turquoise
  ];

  var LAMP_HUE_NAMES = [
    'saffron',
    'vermilion',
    'emerald',
    'cobalt',
    'violet',
    'amber',
    'magenta',
    'turquoise'
  ];

  var DUSK_STONES = [
    {
      id: 'september_food_stall_lamps',
      stoneId: 'september_food_stall_lamps',
      number: 6,
      index: 6,
      label: 'September Food-Stall Lamps',
      stone: 'a September evening when days grow shorter and multicolored lamps light all at once at the doors of food stalls',
      daylightDetail: 'Twelve friggitoria doorways flank the lead-paved street, dark and unremarkable under daylight—and remaining unlit on ordinary non-September evenings.',
      duskDetail: 'As the shortening September sun crosses the horizon threshold, clusters of jewel-glass lamps ignite simultaneously (zero stagger) at every food-stall door, streaking the lead street with polychrome fire.',
      detail: 'When September days grow shorter, multicolored lamps light all at once at the doors of the food stalls, turning the lead-paved street into a synchronous mirror of saffron, vermilion, emerald, cobalt, and violet.'
    },
    {
      id: 'terrace_woman_voice_ooh',
      stoneId: 'terrace_woman_voice_ooh',
      number: 7,
      index: 7,
      label: "Terrace Woman's Voice — 'ooh!'",
      stone: "from a terrace a woman's voice cries 'ooh!'",
      daylightDetail: 'An upper stone balustrade overlooking the arcade—silent in daylight, indistinguishable from loggias seen in many other cities.',
      duskDetail: "An instant after the food-stall lamps ignite together in September, a woman leaning on the terrace balustrade cries 'ooh!'—awakening envy toward those who believe they lived an identical evening once before and think they were happy, that time.",
      detail: "From an elevated terrace a woman's voice cries 'ooh!' into the September twilight, awakening the traveler's envy of those who believe they have once before lived an evening identical to this and think they were happy, that time."
    }
  ];

  Object.defineProperty(DUSK_STONES, 'september_food_stall_lamps', {
    value: DUSK_STONES[0],
    enumerable: false,
    configurable: false,
    writable: false
  });
  Object.defineProperty(DUSK_STONES, 'terrace_woman_voice_ooh', {
    value: DUSK_STONES[1],
    enumerable: false,
    configurable: false,
    writable: false
  });

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, x) {
    if (edge0 === edge1) return x < edge0 ? 0 : 1;
    var t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function hexToRgb(hex) {
    var s = String(hex || '#ffffff').replace('#', '');
    if (s.length === 3) {
      s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
    }
    var n = parseInt(s, 16);
    if (!Number.isFinite(n)) return { r: 255, g: 255, b: 255 };
    return {
      r: (n >> 16) & 255,
      g: (n >> 8) & 255,
      b: n & 255
    };
  }

  function rgbaStr(rgb, a) {
    return 'rgba(' + (rgb.r | 0) + ',' + (rgb.g | 0) + ',' + (rgb.b | 0) + ',' + clamp(a, 0, 1).toFixed(4) + ')';
  }

  function hexWithAlpha(hex, a) {
    return rgbaStr(hexToRgb(hex), a);
  }

  function lerpRgb(c1, c2, t) {
    var u = clamp(t, 0, 1);
    return {
      r: Math.round(lerp(c1.r, c2.r, u)),
      g: Math.round(lerp(c1.g, c2.g, u)),
      b: Math.round(lerp(c1.b, c2.b, u))
    };
  }

  function rgbToCss(rgb) {
    return 'rgb(' + (rgb.r | 0) + ',' + (rgb.g | 0) + ',' + (rgb.b | 0) + ')';
  }

  var PALETTE_RGB = LAMP_PALETTE.map(hexToRgb);

  // Deterministic starfield above horizon (golden-ratio quasi-random sequence)
  var STARS = (function () {
    var arr = [];
    var count = 52;
    for (var i = 0; i < count; i++) {
      var hx = ((i + 1) * 0.61803398875) % 1;
      var hy = ((i * 7 + 3) * 0.38196601125) % 1;
      var hr = ((i * 13 + 5) * 0.7548776662) % 1;
      arr.push({
        u: 0.03 + hx * 0.94,
        v: 0.04 + Math.pow(hy, 1.15) * 0.86,
        mag: 0.55 + hr * 1.35,
        phase: i * 1.37,
        warm: (i % 5 === 0)
      });
    }
    return arr;
  })();

  var CONSTELLATION_PAIRS = [
    [2, 9], [9, 17], [17, 25], [25, 33],
    [5, 14], [14, 22], [22, 30]
  ];

  // Deterministic noise buffer cache per AudioContext for wick spark & vocal breath
  var noiseBufferMap = typeof WeakMap !== 'undefined' ? new WeakMap() : null;

  function getNoiseBuffer(audioCtx) {
    if (!audioCtx || typeof audioCtx.createBuffer !== 'function') return null;
    if (noiseBufferMap && noiseBufferMap.has(audioCtx)) {
      return noiseBufferMap.get(audioCtx);
    }
    var sr = audioCtx.sampleRate || 44100;
    var length = Math.max(1024, Math.floor(sr * 0.35));
    var buf = audioCtx.createBuffer(1, length, sr);
    var data = buf.getChannelData ? buf.getChannelData(0) : null;
    if (data) {
      var seed = 0x51f9a3;
      for (var i = 0; i < length; i++) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        data[i] = ((seed / 4294967296) * 2 - 1) * 0.85;
      }
    }
    if (noiseBufferMap) {
      noiseBufferMap.set(audioCtx, buf);
    }
    return buf;
  }

  // Sky palette keyframes ordered by solarAltitude descending
  var SKY_STOPS_SEPTEMBER = [
    {
      alt: 1.0,
      zenith: hexToRgb('#6d7c8d'),
      upper: hexToRgb('#95a3b2'),
      lower: hexToRgb('#c5cdd5'),
      horizon: hexToRgb('#e8e4da')
    },
    {
      alt: 0.52,
      zenith: hexToRgb('#627187'),
      upper: hexToRgb('#8b96a6'),
      lower: hexToRgb('#c6bfb4'),
      horizon: hexToRgb('#e6d7be')
    },
    {
      alt: 0.22,
      zenith: hexToRgb('#3d4363'),
      upper: hexToRgb('#6d5d75'),
      lower: hexToRgb('#ad7c66'),
      horizon: hexToRgb('#dea268')
    },
    {
      alt: 0.08,
      zenith: hexToRgb('#1a1b3a'),
      upper: hexToRgb('#392856'),
      lower: hexToRgb('#783f63'),
      horizon: hexToRgb('#c76649')
    },
    {
      alt: -0.06,
      zenith: hexToRgb('#0e1028'),
      upper: hexToRgb('#221c44'),
      lower: hexToRgb('#492956'),
      horizon: hexToRgb('#803d54')
    },
    {
      alt: -0.30,
      zenith: hexToRgb('#070816'),
      upper: hexToRgb('#12132d'),
      lower: hexToRgb('#251c3f'),
      horizon: hexToRgb('#3d2341')
    }
  ];

  var SKY_STOPS_ORDINARY = [
    {
      alt: 1.0,
      zenith: hexToRgb('#6f7e8e'),
      upper: hexToRgb('#98a6b4'),
      lower: hexToRgb('#c8d0d7'),
      horizon: hexToRgb('#eae7de')
    },
    {
      alt: 0.52,
      zenith: hexToRgb('#677688'),
      upper: hexToRgb('#909ca9'),
      lower: hexToRgb('#c5c2ba'),
      horizon: hexToRgb('#e4dcc9')
    },
    {
      alt: 0.22,
      zenith: hexToRgb('#4b5668'),
      upper: hexToRgb('#717987'),
      lower: hexToRgb('#9e958d'),
      horizon: hexToRgb('#c9b399')
    },
    {
      alt: 0.08,
      zenith: hexToRgb('#26303f'),
      upper: hexToRgb('#414b5b'),
      lower: hexToRgb('#636a76'),
      horizon: hexToRgb('#8b8985')
    },
    {
      alt: -0.06,
      zenith: hexToRgb('#151c27'),
      upper: hexToRgb('#242e3d'),
      lower: hexToRgb('#374252'),
      horizon: hexToRgb('#4c545f')
    },
    {
      alt: -0.30,
      zenith: hexToRgb('#0c1018'),
      upper: hexToRgb('#161e29'),
      lower: hexToRgb('#222b38'),
      horizon: hexToRgb('#2f3845')
    }
  ];

  function sampleSkyColors(solarAltitude, isSeptember) {
    var stops = isSeptember ? SKY_STOPS_SEPTEMBER : SKY_STOPS_ORDINARY;
    var alt = clamp(Number.isFinite(solarAltitude) ? solarAltitude : 0.72, -0.30, 1.0);
    for (var i = 0; i < stops.length - 1; i++) {
      var hi = stops[i];
      var lo = stops[i + 1];
      if (alt <= hi.alt && alt >= lo.alt) {
        var t = (hi.alt - alt) / (hi.alt - lo.alt);
        return {
          zenith: lerpRgb(hi.zenith, lo.zenith, t),
          upper: lerpRgb(hi.upper, lo.upper, t),
          lower: lerpRgb(hi.lower, lo.lower, t),
          horizon: lerpRgb(hi.horizon, lo.horizon, t)
        };
      }
    }
    return stops[stops.length - 1];
  }

  function resolveAnchors(width, height, raw) {
    var w = Math.max(1, Number(width) || 1280);
    var h = Math.max(1, Number(height) || 800);
    var a = raw && typeof raw === 'object' ? raw : {};

    var horizonY = (Number.isFinite(a.horizonY) && a.horizonY > 20 && a.horizonY < h - 20)
      ? a.horizonY
      : h * 0.54;

    var vp = (a.vanishingPoint && Number.isFinite(a.vanishingPoint.x) && Number.isFinite(a.vanishingPoint.y))
      ? { x: a.vanishingPoint.x, y: a.vanishingPoint.y }
      : { x: w * 0.5, y: horizonY };

    // Normalize streetPolygon into canonical { farLeft, farRight, nearRight, nearLeft, poly }
    var farLeft, farRight, nearRight, nearLeft;
    if (Array.isArray(a.streetPolygon) && a.streetPolygon.length >= 4 &&
        a.streetPolygon.every(function (p) { return p && Number.isFinite(p.x) && Number.isFinite(p.y); })) {
      var sortedY = a.streetPolygon.slice(0, 4).sort(function (p1, p2) { return p1.y - p2.y; });
      var farPair = sortedY.slice(0, 2).sort(function (p1, p2) { return p1.x - p2.x; });
      var nearPair = sortedY.slice(2, 4).sort(function (p1, p2) { return p1.x - p2.x; });
      farLeft = { x: farPair[0].x, y: farPair[0].y };
      farRight = { x: farPair[1].x, y: farPair[1].y };
      nearLeft = { x: nearPair[0].x, y: nearPair[0].y };
      nearRight = { x: nearPair[1].x, y: nearPair[1].y };
    } else {
      farLeft = { x: vp.x - w * 0.042, y: horizonY + h * 0.01 };
      farRight = { x: vp.x + w * 0.042, y: horizonY + h * 0.01 };
      nearLeft = { x: w * 0.14, y: h * 0.985 };
      nearRight = { x: w * 0.86, y: h * 0.985 };
    }
    var streetPolygon = [farLeft, farRight, nearRight, nearLeft];

    // Normalize 12 food-stall doorways
    var stallDoors = [];
    if (Array.isArray(a.stallDoors) && a.stallDoors.length > 0) {
      for (var i = 0; i < a.stallDoors.length; i++) {
        var d = a.stallDoors[i];
        if (!d || !Number.isFinite(d.x) || !Number.isFinite(d.y)) continue;
        var dw = Math.max(8, Number(d.w) || w * 0.026);
        var dh = Math.max(14, Number(d.h) || h * 0.072);
        var side = (d.side === 'left' || d.side === 'right')
          ? d.side
          : ((d.x + dw * 0.5 < vp.x) ? 'left' : 'right');
        var streetSpan = Math.max(1, nearLeft.y - farLeft.y);
        var inferredDepth = clamp(((d.y + dh) - farLeft.y) / streetSpan, 0.05, 1.0);
        stallDoors.push({
          x: d.x,
          y: d.y,
          w: dw,
          h: dh,
          side: side,
          depth: Number.isFinite(d.depth) ? clamp(d.depth, 0, 1) : inferredDepth
        });
      }
    }
    if (stallDoors.length === 0) {
      for (var row = 0; row < 6; row++) {
        var depthT = 0.14 + (row / 5) * 0.78;
        var perspT = Math.pow(depthT, 1.25);
        var edgeLY = lerp(farLeft.y, nearLeft.y, perspT);
        var edgeRY = lerp(farRight.y, nearRight.y, perspT);
        var edgeLX = lerp(farLeft.x, nearLeft.x, perspT);
        var edgeRX = lerp(farRight.x, nearRight.x, perspT);
        var doorW = lerp(w * 0.013, w * 0.036, perspT);
        var doorH = lerp(h * 0.036, h * 0.105, perspT);
        stallDoors.push({
          x: edgeLX - doorW * 1.08,
          y: edgeLY - doorH,
          w: doorW,
          h: doorH,
          side: 'left',
          depth: perspT
        });
        stallDoors.push({
          x: edgeRX + doorW * 0.08,
          y: edgeRY - doorH,
          w: doorW,
          h: doorH,
          side: 'right',
          depth: perspT
        });
      }
    }

    var terraceAnchor = (a.terraceAnchor && Number.isFinite(a.terraceAnchor.x) && Number.isFinite(a.terraceAnchor.y))
      ? {
          x: a.terraceAnchor.x,
          y: a.terraceAnchor.y,
          w: Math.max(24, Number(a.terraceAnchor.w) || w * 0.14),
          h: Math.max(18, Number(a.terraceAnchor.h) || h * 0.085)
        }
      : {
          x: w * 0.66,
          y: horizonY - h * 0.145,
          w: w * 0.145,
          h: h * 0.088
        };

    var crystalTheater = (a.crystalTheater && Number.isFinite(a.crystalTheater.x) && Number.isFinite(a.crystalTheater.y))
      ? {
          x: a.crystalTheater.x,
          y: a.crystalTheater.y,
          w: Math.max(28, Number(a.crystalTheater.w) || w * 0.20),
          h: Math.max(22, Number(a.crystalTheater.h) || h * 0.14)
        }
      : {
          x: vp.x - w * 0.105,
          y: horizonY - h * 0.14,
          w: w * 0.21,
          h: h * 0.14
        };

    var towerCock = (a.towerCock && Number.isFinite(a.towerCock.x) && Number.isFinite(a.towerCock.y))
      ? { x: a.towerCock.x, y: a.towerCock.y }
      : { x: w * 0.24, y: horizonY - h * 0.30 };

    return {
      horizonY: horizonY,
      vanishingPoint: vp,
      streetPolygon: streetPolygon,
      streetBounds: {
        farLeft: farLeft,
        farRight: farRight,
        nearRight: nearRight,
        nearLeft: nearLeft
      },
      stallDoors: stallDoors,
      terraceAnchor: terraceAnchor,
      crystalTheater: crystalTheater,
      towerCock: towerCock
    };
  }

  function safeRampExp(param, value, endTime) {
    if (!param) return;
    var v = Math.max(0.0001, value);
    if (typeof param.exponentialRampToValueAtTime === 'function') {
      param.exponentialRampToValueAtTime(v, endTime);
    } else if (typeof param.linearRampToValueAtTime === 'function') {
      param.linearRampToValueAtTime(v, endTime);
    } else {
      param.value = v;
    }
  }

  function safeRampLin(param, value, endTime) {
    if (!param) return;
    if (typeof param.linearRampToValueAtTime === 'function') {
      param.linearRampToValueAtTime(value, endTime);
    } else {
      param.value = value;
    }
  }

  function safeSetVal(param, value, startTime) {
    if (!param) return;
    if (typeof param.setValueAtTime === 'function') {
      param.setValueAtTime(value, startTime);
    } else {
      param.value = value;
    }
  }

  function connectWithOptionalPan(audioCtx, srcNode, destNode, panValue) {
    if (typeof audioCtx.createStereoPanner === 'function') {
      try {
        var panner = audioCtx.createStereoPanner();
        if (panner && panner.pan) {
          panner.pan.value = clamp(panValue, -1, 1);
        }
        srcNode.connect(panner);
        panner.connect(destNode);
        return panner;
      } catch (_e) {
        // Fallback directly to destination if StereoPanner unsupported
      }
    }
    srcNode.connect(destNode);
    return null;
  }

  function synthesizeSimultaneousLamps(audioCtx, now, masterGain, reducedMotion) {
    // 1. Delicate synchronous oil-lamp spark transient across all stalls at t = now (zero stagger)
    var noiseBuf = getNoiseBuffer(audioCtx);
    if (noiseBuf && typeof audioCtx.createBufferSource === 'function') {
      var sparkSrc = audioCtx.createBufferSource();
      sparkSrc.buffer = noiseBuf;

      var sparkBp = audioCtx.createBiquadFilter();
      sparkBp.type = 'bandpass';
      safeSetVal(sparkBp.frequency, 2750, now);
      safeRampExp(sparkBp.frequency, 1450, now + 0.085);
      safeSetVal(sparkBp.Q, 3.2, now);

      var sparkGain = audioCtx.createGain();
      safeSetVal(sparkGain.gain, 0.0001, now);
      safeRampLin(sparkGain.gain, 0.14 * masterGain, now + 0.005);
      safeRampExp(sparkGain.gain, 0.0001, now + 0.09);

      sparkSrc.connect(sparkBp);
      sparkBp.connect(sparkGain);
      sparkGain.connect(audioCtx.destination);
      sparkSrc.start(now);
      sparkSrc.stop(now + 0.095);
    }

    // Soft glass-wick pop transient
    var wickOsc = audioCtx.createOscillator();
    var wickGain = audioCtx.createGain();
    wickOsc.type = 'triangle';
    safeSetVal(wickOsc.frequency, 920, now);
    safeRampExp(wickOsc.frequency, 310, now + 0.055);
    safeSetVal(wickGain.gain, 0.0001, now);
    safeRampLin(wickGain.gain, 0.085 * masterGain, now + 0.003);
    safeRampExp(wickGain.gain, 0.0001, now + 0.06);
    wickOsc.connect(wickGain);
    wickGain.connect(audioCtx.destination);
    wickOsc.start(now);
    wickOsc.stop(now + 0.065);

    // 2. Synchronous warm polychrome chord bloom (F# major add9 — zero stagger across all voices)
    var chordFreqs = [185.00, 277.18, 369.99, 466.16, 554.37, 830.61];
    var chordPans = [-0.55, 0.45, -0.28, 0.32, -0.14, 0.22];
    var chordWeights = [0.22, 0.20, 0.22, 0.18, 0.16, 0.11];
    var dur = reducedMotion ? 1.35 : 2.05;

    var busFilter = audioCtx.createBiquadFilter();
    busFilter.type = 'lowpass';
    safeSetVal(busFilter.frequency, 1150, now);
    safeRampExp(busFilter.frequency, 3300, now + 0.12);
    safeRampExp(busFilter.frequency, 1350, now + dur);
    safeSetVal(busFilter.Q, 0.9, now);

    var busGain = audioCtx.createGain();
    safeSetVal(busGain.gain, 0.0001, now);
    safeRampLin(busGain.gain, 0.24 * masterGain, now + 0.022);
    safeRampExp(busGain.gain, 0.0001, now + dur);

    busFilter.connect(busGain);
    busGain.connect(audioCtx.destination);

    for (var i = 0; i < chordFreqs.length; i++) {
      var osc = audioCtx.createOscillator();
      var vGain = audioCtx.createGain();
      osc.type = (i % 2 === 0) ? 'triangle' : 'sine';
      safeSetVal(osc.frequency, chordFreqs[i] * (1 + (i - 2.5) * 0.0009), now);
      safeSetVal(vGain.gain, chordWeights[i], now);
      osc.connect(vGain);
      connectWithOptionalPan(audioCtx, vGain, busFilter, chordPans[i]);
      osc.start(now);
      osc.stop(now + dur + 0.04);
    }
  }

  function synthesizeWomanOoh(audioCtx, now, masterGain, reducedMotion) {
    // Expressive vocal-formant female cry "ooh!" from the terrace:
    // Pitch contour: ~415.3Hz (G#4) -> 554.37Hz (C#5) -> 493.88Hz (B4)
    var dur = reducedMotion ? 0.85 : 1.08;

    var sourceMix = audioCtx.createGain();
    safeSetVal(sourceMix.gain, 1.0, now);

    // Rich harmonic glottal sawtooth + warm fundamental sine
    var glottalSaw = audioCtx.createOscillator();
    glottalSaw.type = 'sawtooth';
    safeSetVal(glottalSaw.frequency, 415.30, now);
    safeRampExp(glottalSaw.frequency, 554.37, now + 0.16);
    safeRampExp(glottalSaw.frequency, 493.88, now + 0.46);
    safeRampExp(glottalSaw.frequency, 482.00, now + dur);

    var glottalFund = audioCtx.createOscillator();
    glottalFund.type = 'sine';
    safeSetVal(glottalFund.frequency, 415.30, now);
    safeRampExp(glottalFund.frequency, 554.37, now + 0.16);
    safeRampExp(glottalFund.frequency, 493.88, now + 0.46);
    safeRampExp(glottalFund.frequency, 482.00, now + dur);

    var sawWeight = audioCtx.createGain();
    safeSetVal(sawWeight.gain, 0.58, now);
    var fundWeight = audioCtx.createGain();
    safeSetVal(fundWeight.gain, 0.52, now);

    // Subtle natural vocal vibrato (~5.6 Hz, swelling smoothly on the sustained vowel)
    if (!reducedMotion) {
      var vibOsc = audioCtx.createOscillator();
      var vibDepth = audioCtx.createGain();
      vibOsc.type = 'sine';
      safeSetVal(vibOsc.frequency, 5.6, now);
      safeSetVal(vibDepth.gain, 0.0, now);
      safeRampLin(vibDepth.gain, 5.4, now + 0.28);
      safeRampLin(vibDepth.gain, 3.8, now + dur);
      vibOsc.connect(vibDepth);
      if (glottalSaw.frequency) vibDepth.connect(glottalSaw.frequency);
      if (glottalFund.frequency) vibDepth.connect(glottalFund.frequency);
      vibOsc.start(now);
      vibOsc.stop(now + dur + 0.05);
    }

    glottalSaw.connect(sawWeight);
    glottalFund.connect(fundWeight);
    sawWeight.connect(sourceMix);
    fundWeight.connect(sourceMix);

    // Gentle aspirate breath onset
    var noiseBuf = getNoiseBuffer(audioCtx);
    if (noiseBuf && typeof audioCtx.createBufferSource === 'function') {
      var breathSrc = audioCtx.createBufferSource();
      breathSrc.buffer = noiseBuf;
      var breathGain = audioCtx.createGain();
      safeSetVal(breathGain.gain, 0.0001, now);
      safeRampLin(breathGain.gain, 0.08, now + 0.03);
      safeRampExp(breathGain.gain, 0.0001, now + 0.24);
      breathSrc.connect(breathGain);
      breathGain.connect(sourceMix);
      breathSrc.start(now);
      breathSrc.stop(now + 0.26);
    }

    // Parallel vocal-tract formant filters shaping /o:/ -> /u:/ ("ooh!")
    // F1 ~350Hz (gliding 430 -> 340Hz), F2 ~760Hz (gliding 840 -> 725Hz), F3 ~2650Hz
    var formantDefs = [
      { fStart: 430, fMid: 355, fEnd: 335, q: 7.2, g: 1.0 },
      { fStart: 845, fMid: 760, fEnd: 715, q: 9.0, g: 0.66 },
      { fStart: 2680, fMid: 2650, fEnd: 2590, q: 11.0, g: 0.24 }
    ];

    var vocalSum = audioCtx.createGain();
    safeSetVal(vocalSum.gain, 0.0001, now);
    safeRampLin(vocalSum.gain, 0.30 * masterGain, now + 0.055);
    safeRampLin(vocalSum.gain, 0.26 * masterGain, now + 0.26);
    safeRampExp(vocalSum.gain, 0.0001, now + dur);

    for (var fi = 0; fi < formantDefs.length; fi++) {
      var fd = formantDefs[fi];
      var bp = audioCtx.createBiquadFilter();
      bp.type = 'bandpass';
      safeSetVal(bp.frequency, fd.fStart, now);
      safeRampExp(bp.frequency, fd.fMid, now + 0.20);
      safeRampExp(bp.frequency, fd.fEnd, now + dur);
      safeSetVal(bp.Q, fd.q, now);

      var fg = audioCtx.createGain();
      safeSetVal(fg.gain, fd.g, now);
      sourceMix.connect(bp);
      bp.connect(fg);
      fg.connect(vocalSum);
    }

    // Warm high-shelf rolloff so the voice floats silkily from stone loggia
    var warmthLp = audioCtx.createBiquadFilter();
    warmthLp.type = 'lowpass';
    safeSetVal(warmthLp.frequency, 4100, now);
    vocalSum.connect(warmthLp);

    // Dry terrace placement (slightly right, matching elevated terrace loggia)
    connectWithOptionalPan(audioCtx, warmthLp, audioCtx.destination, 0.28);

    // Multi-tap stone-street & silver-cupola architectural echo
    if (typeof audioCtx.createDelay === 'function') {
      var taps = [
        { delay: 0.135, gain: 0.34, cutoff: 2100, pan: -0.44 },
        { delay: 0.275, gain: 0.21, cutoff: 1550, pan: 0.38 },
        { delay: 0.435, gain: 0.12, cutoff: 1120, pan: -0.22 }
      ];
      for (var ti = 0; ti < taps.length; ti++) {
        var tap = taps[ti];
        var dNode = audioCtx.createDelay(1.0);
        safeSetVal(dNode.delayTime, tap.delay, now);
        var dLp = audioCtx.createBiquadFilter();
        dLp.type = 'lowpass';
        safeSetVal(dLp.frequency, tap.cutoff, now);
        var dGain = audioCtx.createGain();
        safeSetVal(dGain.gain, tap.gain, now);
        warmthLp.connect(dNode);
        dNode.connect(dLp);
        dLp.connect(dGain);
        connectWithOptionalPan(audioCtx, dGain, audioCtx.destination, tap.pan);
      }
    }

    glottalSaw.start(now);
    glottalFund.start(now);
    glottalSaw.stop(now + dur + 0.05);
    glottalFund.stop(now + dur + 0.05);
  }

  function synthesizeEnvyEcho(audioCtx, now, masterGain, reducedMotion) {
    // Bittersweet double-exposure suspended harmonic shimmer (warm past dyad + cool present dyad)
    var dur = reducedMotion ? 1.6 : 2.65;
    var layers = [
      // Warm gold memory exposure ("that time")
      { freq: 369.99, offset: 0.00, pan: -0.36, gain: 0.065, type: 'sine' },
      { freq: 466.16, offset: 0.00, pan: -0.24, gain: 0.055, type: 'triangle' },
      // Cool violet present exposure (displaced twin)
      { freq: 415.30, offset: 0.055, pan: 0.36, gain: 0.060, type: 'sine' },
      { freq: 493.88, offset: 0.055, pan: 0.28, gain: 0.052, type: 'sine' },
      { freq: 739.99, offset: 0.090, pan: 0.12, gain: 0.032, type: 'sine' }
    ];

    for (var i = 0; i < layers.length; i++) {
      var lyr = layers[i];
      var t0 = now + lyr.offset;
      var osc = audioCtx.createOscillator();
      var g = audioCtx.createGain();
      osc.type = lyr.type;
      safeSetVal(osc.frequency, lyr.freq, t0);
      if (!reducedMotion && i >= 2) {
        safeRampLin(osc.frequency, lyr.freq * 1.0022, t0 + dur * 0.5);
        safeRampLin(osc.frequency, lyr.freq * 0.9992, t0 + dur);
      }
      safeSetVal(g.gain, 0.0001, t0);
      safeRampLin(g.gain, lyr.gain * masterGain, t0 + 0.28);
      safeRampExp(g.gain, 0.0001, t0 + dur);

      osc.connect(g);
      connectWithOptionalPan(audioCtx, g, audioCtx.destination, lyr.pan);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    }
  }

  function triggerDuskAudio(audioCtx, kind, opts) {
    if (!audioCtx || audioCtx.state === 'closed') return false;
    if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
      try {
        var p = audioCtx.resume();
        if (p && typeof p.catch === 'function') p.catch(function () {});
      } catch (_e) {}
    }

    var options = opts && typeof opts === 'object' ? opts : {};
    var reducedMotion = Boolean(options.reducedMotion);
    var masterGain = Number.isFinite(options.gain) ? clamp(options.gain, 0, 2) : 1.0;
    var baseTime = Number.isFinite(audioCtx.currentTime) ? audioCtx.currentTime : 0;
    var now = baseTime + (Number.isFinite(options.delaySec) ? Math.max(0, options.delaySec) : 0.005);

    if (kind === 'simultaneous_lamps') {
      synthesizeSimultaneousLamps(audioCtx, now, masterGain, reducedMotion);
      return true;
    }
    if (kind === 'woman_ooh') {
      synthesizeWomanOoh(audioCtx, now, masterGain, reducedMotion);
      return true;
    }
    if (kind === 'envy_echo') {
      synthesizeEnvyEcho(audioCtx, now, masterGain, reducedMotion);
      return true;
    }
    return false;
  }

  // Compute sun position along the equinox vs high-season astrolabe arc
  function computeSunTrajectory(width, height, horizonY, solarAltitude, isSeptember) {
    var alt = clamp(Number.isFinite(solarAltitude) ? solarAltitude : 0.72, -0.30, 1.0);
    // September equinox has a lower, shorter arc across the sky; ordinary high-season rises higher and wider
    var apexHeight = isSeptember ? horizonY * 0.64 : horizonY * 0.84;
    var eastX = isSeptember ? width * 0.14 : width * 0.07;
    var westX = isSeptember ? width * 0.84 : width * 0.92;

    // Map solarAltitude: 1.0 -> morning eastern high sky; 0.08 -> setting near western horizon; -0.30 -> below west horizon
    var normProgress = clamp((1.0 - alt) / (1.0 - DUSK_THRESHOLD), 0, 1.38);
    // Parabolic / sinusoidal diurnal arc parameterized so u = 1.0 lands right near horizon threshold
    var u = clamp(0.24 + normProgress * 0.72, 0.05, 1.16);
    var sunX = lerp(eastX, westX, Math.min(u, 1.12));
    var sunY = horizonY - alt * apexHeight;

    return {
      sunX: sunX,
      sunY: sunY,
      eastX: eastX,
      westX: westX,
      apexHeight: apexHeight,
      septEastX: width * 0.14,
      septWestX: width * 0.84,
      septApex: horizonY * 0.64,
      highEastX: width * 0.07,
      highWestX: width * 0.92,
      highApex: horizonY * 0.84
    };
  }

  function drawAstrolabeArc(ctx, eastX, westX, horizonY, apexHeight, dashed, strokeStyle, lineWidth) {
    ctx.save();
    ctx.beginPath();
    if (dashed && typeof ctx.setLineDash === 'function') {
      ctx.setLineDash(dashed);
    }
    var steps = 44;
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var x = lerp(eastX, westX, t);
      var arcProfile = Math.sin(t * Math.PI);
      var y = horizonY - arcProfile * apexHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.restore();
  }

  function drawArchedRectPath(ctx, x, y, w, h) {
    var archR = Math.min(w * 0.5, h * 0.38);
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + archR);
    ctx.quadraticCurveTo(x, y, x + w * 0.5, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + archR);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
  }

  function drawPasserbySilhouette(ctx, kind, cx, footY, scale, color, leanPhase) {
    ctx.save();
    ctx.translate(cx, footY);
    ctx.scale(scale, scale);
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (kind === 'couple') {
      // Left figure (cloaked companion)
      ctx.beginPath();
      ctx.arc(-6.5, -43, 4.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-12, -37);
      ctx.quadraticCurveTo(-6.5, -39, -1.2, -36);
      ctx.lineTo(0.5, -14);
      ctx.lineTo(-13.5, -14);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-9, -14);
      ctx.lineTo(-10.5 + leanPhase * 1.2, 0);
      ctx.moveTo(-4, -14);
      ctx.lineTo(-2.5 - leanPhase * 1.2, 0);
      ctx.stroke();

      // Right figure (inclined head, flowing skirt/coat, arm linked)
      ctx.beginPath();
      ctx.arc(5.5, -40.5, 3.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0.2, -35);
      ctx.quadraticCurveTo(5.8, -37, 10.5, -34);
      ctx.lineTo(13, -10);
      ctx.lineTo(-1.2, -10);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(3.5, -10);
      ctx.lineTo(2.5 - leanPhase, 0);
      ctx.moveTo(8, -10);
      ctx.lineTo(9.2 + leanPhase, 0);
      ctx.stroke();
    } else {
      // Solitary traveler / stroller looking toward the lamps & terrace
      ctx.beginPath();
      ctx.arc(0, -42, 4.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-6.5, -36);
      ctx.quadraticCurveTo(0, -38.5, 6.8, -35.5);
      ctx.lineTo(8.5, -13);
      ctx.lineTo(-8.2, -13);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-3.2, -13);
      ctx.lineTo(-4.8 + leanPhase, 0);
      ctx.moveTo(3.0, -13);
      ctx.lineTo(4.6 - leanPhase, 0);
      ctx.stroke();
    }

    ctx.restore();
  }

  function create(createOpts) {
    var initOpts = createOpts && typeof createOpts === 'object' ? createOpts : {};

    var state = {
      solarAltitude: Number.isFinite(initOpts.solarAltitude) ? initOpts.solarAltitude : 0.72,
      isSeptember: initOpts.isSeptember !== undefined ? Boolean(initOpts.isSeptember) : true,
      reducedMotion: Boolean(initOpts.reducedMotion),
      lampsLit: false,
      simultaneousIgnition: false,
      ignitionStaggerMs: 0,
      litDoorCount: 0,
      lampBloomProgress: 0,
      duskElapsedSec: 0,
      voiceCried: false,
      voiceWaveProgress: 0,
      voiceAgeSec: 0,
      envyIntensity: 0,
      justIgnitedLamps: false,
      justCriedOoh: false,
      justAwakenedEnvy: false,
      updateCount: 0
    };

    // Guard against duplicate audio if caller BOTH passes soundEnabled+audioCtx to update() AND calls triggerDuskAudio() synchronously
    var lastAutoTriggerWallMs = {
      simultaneous_lamps: -1e9,
      woman_ooh: -1e9,
      envy_echo: -1e9
    };

    function nowWallMs() {
      return (typeof performance !== 'undefined' && typeof performance.now === 'function')
        ? performance.now()
        : Date.now();
    }

    function controllerTriggerAudio(audioCtx, kind, opts) {
      var o = opts && typeof opts === 'object' ? opts : {};
      var tMs = nowWallMs();
      if (!o._fromUpdate && (tMs - (lastAutoTriggerWallMs[kind] || -1e9)) < 12) {
        return false;
      }
      if (o._fromUpdate) {
        lastAutoTriggerWallMs[kind] = tMs;
      }
      return triggerDuskAudio(audioCtx, kind, o);
    }

    function buildSnapshot() {
      return {
        lampsLit: state.lampsLit,
        simultaneousIgnition: state.simultaneousIgnition,
        ignitionStaggerMs: 0,
        litDoorCount: state.litDoorCount,
        lampColors: LAMP_PALETTE,
        voiceCried: state.voiceCried,
        voiceWaveProgress: state.voiceWaveProgress,
        envyIntensity: state.envyIntensity,
        justIgnitedLamps: state.justIgnitedLamps,
        justCriedOoh: state.justCriedOoh,
        justAwakenedEnvy: state.justAwakenedEnvy,
        solarAltitude: state.solarAltitude,
        isSeptember: state.isSeptember,
        duskThreshold: DUSK_THRESHOLD,
        dayLengthLabel: state.isSeptember
          ? 'September Equinox — Days Grow Shorter'
          : 'High Season — Long Ordinary Days'
      };
    }

    function reset() {
      state.solarAltitude = 0.72;
      state.isSeptember = true;
      state.lampsLit = false;
      state.simultaneousIgnition = false;
      state.ignitionStaggerMs = 0;
      state.litDoorCount = 0;
      state.lampBloomProgress = 0;
      state.duskElapsedSec = 0;
      state.voiceCried = false;
      state.voiceWaveProgress = 0;
      state.voiceAgeSec = 0;
      state.envyIntensity = 0;
      state.justIgnitedLamps = false;
      state.justCriedOoh = false;
      state.justAwakenedEnvy = false;
      return buildSnapshot();
    }

    function update(dtSec, input) {
      var inp = input && typeof input === 'object' ? input : {};
      var dt = (Number.isFinite(dtSec) && dtSec >= 0) ? dtSec : (1 / 60);

      var solarAltitude = Number.isFinite(inp.solarAltitude) ? inp.solarAltitude : state.solarAltitude;
      var isSeptember = inp.isSeptember !== undefined ? Boolean(inp.isSeptember) : state.isSeptember;
      var reducedMotion = inp.reducedMotion !== undefined ? Boolean(inp.reducedMotion) : state.reducedMotion;
      var audioCtx = inp.audioCtx || null;
      var soundEnabled = Boolean(inp.soundEnabled);

      state.solarAltitude = solarAltitude;
      state.isSeptember = isSeptember;
      state.reducedMotion = reducedMotion;
      state.updateCount += 1;

      var wasLampsLit = state.lampsLit;
      var wasVoiceCried = state.voiceCried;
      var wasEnvyActive = state.envyIntensity > 0;

      state.justIgnitedLamps = false;
      state.justCriedOoh = false;
      state.justAwakenedEnvy = false;
      state.ignitionStaggerMs = 0;

      if (!isSeptember) {
        // Ordinary month comparison: even when solarAltitude <= 0.08, dusk falls coldly without simultaneous lamps, cry, or envy
        state.lampsLit = false;
        state.simultaneousIgnition = false;
        state.litDoorCount = 0;
        state.lampBloomProgress = 0;
        state.duskElapsedSec = 0;
        state.voiceCried = false;
        state.voiceWaveProgress = 0;
        state.voiceAgeSec = 0;
        state.envyIntensity = 0;
      } else if (solarAltitude > DUSK_THRESHOLD) {
        // Daytime: resets lampsLit & voiceCried and decays envyIntensity cleanly to 0
        state.lampsLit = false;
        state.simultaneousIgnition = false;
        state.litDoorCount = 0;
        state.lampBloomProgress = 0;
        state.duskElapsedSec = 0;
        state.voiceCried = false;
        state.voiceWaveProgress = 0;
        state.voiceAgeSec = 0;
        if (reducedMotion || solarAltitude >= 0.35 || dt >= 0.35) {
          state.envyIntensity = 0;
        } else {
          state.envyIntensity = Math.max(0, state.envyIntensity - Math.max(dt, 0.016) * 3.0);
          if (state.envyIntensity < 0.004) state.envyIntensity = 0;
        }
      } else {
        // Calvino's causal law: isSeptember === true AND solarAltitude <= 0.08
        // ALL food-stall lamps ignite simultaneously with zero stagger
        state.lampsLit = true;
        state.simultaneousIgnition = true;
        state.ignitionStaggerMs = 0;
        state.litDoorCount = 12;

        if (!wasLampsLit) {
          state.justIgnitedLamps = true;
          state.duskElapsedSec = dt;
          state.lampBloomProgress = reducedMotion ? 1 : clamp(0.35 + dt * 4.5, 0.35, 1);
        } else {
          state.duskElapsedSec += dt;
          state.lampBloomProgress = reducedMotion ? 1 : clamp(state.lampBloomProgress + Math.max(dt, 0.016) * 4.5, 0, 1);
        }

        var cryDelaySec = reducedMotion ? 0 : 0.18;
        if (state.duskElapsedSec >= cryDelaySec) {
          state.voiceCried = true;
          if (!wasVoiceCried) {
            state.justCriedOoh = true;
            state.voiceAgeSec = Math.max(0, state.duskElapsedSec - cryDelaySec);
          } else {
            state.voiceAgeSec += dt;
          }

          if (reducedMotion) {
            state.voiceWaveProgress = 1;
            state.envyIntensity = 1;
          } else {
            var stepDt = Math.max(dt, 0.016);
            state.voiceWaveProgress = clamp(state.voiceWaveProgress + stepDt * 1.12, 0.08, 1);
            var depthBoost = 1 + clamp((DUSK_THRESHOLD - solarAltitude) * 1.8, 0, 0.65);
            state.envyIntensity = clamp(
              Math.max(0.08, state.envyIntensity + stepDt * 1.25 * depthBoost),
              0.08,
              1
            );
          }

          if (!wasEnvyActive && state.envyIntensity > 0) {
            state.justAwakenedEnvy = true;
          }
        }
      }

      if (state.justIgnitedLamps) {
        if (typeof inp.onIgniteLamps === 'function') {
          inp.onIgniteLamps(buildSnapshot());
        }
        if (soundEnabled && audioCtx && inp.autoAudio !== false) {
          controllerTriggerAudio(audioCtx, 'simultaneous_lamps', {
            reducedMotion: reducedMotion,
            _fromUpdate: true
          });
        }
      }

      if (state.justCriedOoh) {
        if (typeof inp.onWomanOoh === 'function') {
          inp.onWomanOoh(buildSnapshot());
        }
        if (soundEnabled && audioCtx && inp.autoAudio !== false) {
          controllerTriggerAudio(audioCtx, 'woman_ooh', {
            reducedMotion: reducedMotion,
            _fromUpdate: true
          });
          controllerTriggerAudio(audioCtx, 'envy_echo', {
            reducedMotion: reducedMotion,
            delaySec: 0.22,
            _fromUpdate: true
          });
        }
      }

      return buildSnapshot();
    }

    function renderSkyBackdrop(ctx, params) {
      if (!ctx) return;
      var p = params && typeof params === 'object' ? params : {};
      var width = Math.max(1, Number(p.width) || (ctx.canvas && ctx.canvas.width) || 1280);
      var height = Math.max(1, Number(p.height) || (ctx.canvas && ctx.canvas.height) || 800);
      var solarAltitude = Number.isFinite(p.solarAltitude) ? p.solarAltitude : state.solarAltitude;
      var isSeptember = p.isSeptember !== undefined ? Boolean(p.isSeptember) : state.isSeptember;
      var timeSec = Number.isFinite(p.timeSec) ? p.timeSec : 0;
      var reducedMotion = p.reducedMotion !== undefined ? Boolean(p.reducedMotion) : state.reducedMotion;
      var resolved = resolveAnchors(width, height, p.anchors);
      var horizonY = resolved.horizonY;

      ctx.save();

      // 1. Atmospheric sky gradient from zenith to horizon
      var sky = sampleSkyColors(solarAltitude, isSeptember);
      var skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0.00, rgbToCss(sky.zenith));
      skyGrad.addColorStop(0.36, rgbToCss(sky.upper));
      skyGrad.addColorStop(0.72, rgbToCss(sky.lower));
      skyGrad.addColorStop(1.00, rgbToCss(sky.horizon));
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY + 2);

      // Sub-horizon ground under-wash in case monuments leave open joints
      var groundGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      var duskFactor = smoothstep(0.24, -0.10, solarAltitude);
      groundGrad.addColorStop(0, isSeptember
        ? rgbaStr(lerpRgb({ r: 86, g: 92, b: 102 }, { r: 22, g: 20, b: 38 }, duskFactor), 1)
        : rgbaStr(lerpRgb({ r: 88, g: 94, b: 102 }, { r: 20, g: 26, b: 35 }, duskFactor), 1));
      groundGrad.addColorStop(1, isSeptember
        ? rgbaStr(lerpRgb({ r: 58, g: 64, b: 74 }, { r: 10, g: 11, b: 22 }, duskFactor), 1)
        : rgbaStr(lerpRgb({ r: 60, g: 66, b: 75 }, { r: 11, g: 15, b: 22 }, duskFactor), 1));
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // 2. Fine copperplate/lead-engraved horizontal atmospheric rulings near upper sky
      ctx.save();
      var rulingAlpha = lerp(0.085, 0.035, duskFactor);
      ctx.strokeStyle = 'rgba(255,255,255,' + rulingAlpha.toFixed(3) + ')';
      ctx.lineWidth = 0.75;
      var lineStep = Math.max(7, Math.round(horizonY / 32));
      for (var ry = lineStep; ry < horizonY * 0.68; ry += lineStep) {
        ctx.beginPath();
        ctx.moveTo(0, ry);
        ctx.lineTo(width, ry);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Emerging evening stars & autumn constellation filaments
      var starVisibility = smoothstep(0.24, -0.12, solarAltitude);
      if (starVisibility > 0.01) {
        ctx.save();
        if (starVisibility > 0.25) {
          ctx.strokeStyle = isSeptember
            ? 'rgba(218, 198, 255,' + (starVisibility * 0.14).toFixed(3) + ')'
            : 'rgba(190, 205, 222,' + (starVisibility * 0.09).toFixed(3) + ')';
          ctx.lineWidth = 0.7;
          for (var ci = 0; ci < CONSTELLATION_PAIRS.length; ci++) {
            var sA = STARS[CONSTELLATION_PAIRS[ci][0]];
            var sB = STARS[CONSTELLATION_PAIRS[ci][1]];
            ctx.beginPath();
            ctx.moveTo(sA.u * width, sA.v * horizonY);
            ctx.lineTo(sB.u * width, sB.v * horizonY);
            ctx.stroke();
          }
        }

        for (var si = 0; si < STARS.length; si++) {
          var st = STARS[si];
          var sx = st.u * width;
          var sy = st.v * horizonY;
          var twinkle = reducedMotion ? 0.88 : (0.68 + 0.32 * Math.sin(timeSec * 1.9 + st.phase));
          var sa = starVisibility * twinkle * (1 - st.v * 0.35);
          if (sa <= 0.02) continue;
          ctx.fillStyle = st.warm
            ? 'rgba(255, 236, 198,' + sa.toFixed(3) + ')'
            : 'rgba(232, 239, 255,' + sa.toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(sx, sy, st.mag * Math.max(0.85, Math.min(1.45, width / 960)), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // 4. Solar trajectories: contrasting High-Season Long Arc vs Shortening September Equinox Arc
      var traj = computeSunTrajectory(width, height, horizonY, solarAltitude, isSeptember);

      // Reference comparative arc (dashed) + active seasonal arc (solid astrolabe meridian)
      if (isSeptember) {
        drawAstrolabeArc(
          ctx, traj.highEastX, traj.highWestX, horizonY, traj.highApex,
          [4, 6], 'rgba(225, 220, 230, 0.17)', 1.0
        );
        drawAstrolabeArc(
          ctx, traj.septEastX, traj.septWestX, horizonY, traj.septApex,
          null, 'rgba(252, 206, 148, 0.36)', 1.35
        );
      } else {
        drawAstrolabeArc(
          ctx, traj.septEastX, traj.septWestX, horizonY, traj.septApex,
          [4, 6], 'rgba(200, 208, 218, 0.14)', 1.0
        );
        drawAstrolabeArc(
          ctx, traj.highEastX, traj.highWestX, horizonY, traj.highApex,
          null, 'rgba(226, 232, 240, 0.30)', 1.3
        );
      }

      // Astrolabe degree ticks along active arc + DUSK_THRESHOLD = 0.08 datum tick
      ctx.save();
      var tickSteps = 12;
      for (var ti = 1; ti < tickSteps; ti++) {
        var ut = ti / tickSteps;
        var tx = lerp(traj.eastX, traj.westX, ut);
        var ty = horizonY - Math.sin(ut * Math.PI) * traj.apexHeight;
        ctx.strokeStyle = isSeptember ? 'rgba(255, 214, 160, 0.34)' : 'rgba(224, 232, 240, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tx, ty - 3.5);
        ctx.lineTo(tx, ty + 3.5);
        ctx.stroke();
      }

      // Subtle threshold line at solarAltitude = 0.08 near western horizon
      var threshY = horizonY - DUSK_THRESHOLD * traj.apexHeight;
      if (typeof ctx.setLineDash === 'function') ctx.setLineDash([2, 5]);
      ctx.strokeStyle = isSeptember ? 'rgba(244, 183, 40, 0.30)' : 'rgba(180, 190, 202, 0.18)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(width * 0.62, threshY);
      ctx.lineTo(width * 0.95, threshY);
      ctx.stroke();
      ctx.restore();

      // 5. Sun disc, corona & crepuscular fan clipped above horizonY
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width, horizonY);
      ctx.clip();

      var coronaAlpha = smoothstep(-0.22, 0.14, solarAltitude);
      if (coronaAlpha > 0.01) {
        var coronaRadius = Math.max(width, height) * lerp(0.24, 0.13, clamp(solarAltitude, 0, 1));
        var warmT = smoothstep(0.60, 0.04, solarAltitude);
        var innerSunRgb = isSeptember
          ? lerpRgb({ r: 255, g: 250, b: 236 }, { r: 255, g: 168, b: 92 }, warmT)
          : lerpRgb({ r: 252, g: 250, b: 242 }, { r: 226, g: 196, b: 158 }, warmT);
        var midSunRgb = isSeptember
          ? lerpRgb({ r: 226, g: 232, b: 238 }, { r: 214, g: 88, b: 78 }, warmT)
          : lerpRgb({ r: 214, g: 222, b: 230 }, { r: 152, g: 148, b: 146 }, warmT);

        var coronaGrad = ctx.createRadialGradient(
          traj.sunX, traj.sunY, 2,
          traj.sunX, traj.sunY, coronaRadius
        );
        coronaGrad.addColorStop(0.0, rgbaStr(innerSunRgb, 0.72 * coronaAlpha));
        coronaGrad.addColorStop(0.32, rgbaStr(midSunRgb, 0.28 * coronaAlpha));
        coronaGrad.addColorStop(1.0, rgbaStr(midSunRgb, 0.0));
        ctx.fillStyle = coronaGrad;
        ctx.fillRect(0, 0, width, horizonY);

        // Crepuscular dusk rays when sun nears horizon in September
        var rayWeight = isSeptember ? (1 - Math.abs(solarAltitude - 0.08) / 0.24) : 0;
        if (rayWeight > 0.02) {
          ctx.save();
          ctx.translate(traj.sunX, traj.sunY);
          for (var ri = -3; ri <= 3; ri++) {
            var ang = -Math.PI * 0.5 + ri * 0.21;
            ctx.save();
            ctx.rotate(ang);
            var rayLen = Math.max(width, height) * 0.34;
            var rGrad = ctx.createLinearGradient(0, 0, 0, -rayLen);
            rGrad.addColorStop(0, 'rgba(255, 190, 120,' + (0.11 * rayWeight).toFixed(3) + ')');
            rGrad.addColorStop(1, 'rgba(255, 190, 120, 0)');
            ctx.fillStyle = rGrad;
            ctx.beginPath();
            ctx.moveTo(-4, 0);
            ctx.lineTo(-22, -rayLen);
            ctx.lineTo(22, -rayLen);
            ctx.lineTo(4, 0);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
          ctx.restore();
        }

        // Crisp astrolabe solar disc
        if (solarAltitude > -0.06) {
          var sunR = clamp(Math.min(width, height) * 0.021, 9, 19);
          ctx.fillStyle = rgbaStr(innerSunRgb, 0.96);
          ctx.beginPath();
          ctx.arc(traj.sunX, traj.sunY, sunR, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = rgbaStr(innerSunRgb, 0.45);
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.arc(traj.sunX, traj.sunY, sunR * 1.42, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Soft stratus cloud bands catching dusk underlight
      var cloudAlpha = lerp(0.14, 0.22, smoothstep(0.5, 0.05, solarAltitude));
      for (var cb = 0; cb < 4; cb++) {
        var drift = reducedMotion ? 0 : Math.sin(timeSec * 0.08 + cb * 1.7) * 14;
        var cx = width * (0.18 + cb * 0.22) + drift;
        var cy = horizonY * (0.34 + (cb % 2) * 0.22 + cb * 0.06);
        var cw = width * (0.22 + (cb % 3) * 0.06);
        var ch = Math.max(5, horizonY * 0.026);
        var cRgb = isSeptember && solarAltitude < 0.25
          ? { r: 212, g: 132, b: 128 }
          : { r: 222, g: 224, b: 230 };
        var cg = ctx.createRadialGradient(cx, cy, 2, cx, cy, cw * 0.5);
        cg.addColorStop(0, rgbaStr(cRgb, cloudAlpha));
        cg.addColorStop(1, rgbaStr(cRgb, 0));
        ctx.fillStyle = cg;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, ch / (cw * 0.5));
        ctx.beginPath();
        ctx.arc(0, 0, cw * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore(); // end horizon clip
      ctx.restore();
    }

    function renderDuskOverlay(ctx, params) {
      if (!ctx) return;
      var p = params && typeof params === 'object' ? params : {};
      var width = Math.max(1, Number(p.width) || (ctx.canvas && ctx.canvas.width) || 1280);
      var height = Math.max(1, Number(p.height) || (ctx.canvas && ctx.canvas.height) || 800);
      var solarAltitude = Number.isFinite(p.solarAltitude) ? p.solarAltitude : state.solarAltitude;
      var isSeptember = p.isSeptember !== undefined ? Boolean(p.isSeptember) : state.isSeptember;
      var timeSec = Number.isFinite(p.timeSec) ? p.timeSec : 0;
      var reducedMotion = p.reducedMotion !== undefined ? Boolean(p.reducedMotion) : state.reducedMotion;
      var hoveredStoneId = p.hoveredStoneId || null;
      var selectedStoneId = p.selectedStoneId || null;

      var anchors = resolveAnchors(width, height, p.anchors);
      var minDim = Math.min(width, height);

      var inSeptDusk = isSeptember && solarAltitude <= DUSK_THRESHOLD;
      var lampsLit = state.updateCount > 0 ? (state.lampsLit && inSeptDusk) : inSeptDusk;
      var bloom = lampsLit ? (state.updateCount > 0 ? clamp(state.lampBloomProgress, 0.4, 1) : 1) : 0;
      var voiceCried = state.updateCount > 0 ? (state.voiceCried && inSeptDusk) : inSeptDusk;
      var waveProg = voiceCried ? (state.updateCount > 0 ? state.voiceWaveProgress : 1) : 0;
      var envy = isSeptember ? (state.updateCount > 0 ? state.envyIntensity : (inSeptDusk ? 1 : 0)) : 0;

      ctx.save();

      // Cold dusk darkening veil when dusk falls in a non-September month (causal contrast)
      if (!isSeptember && solarAltitude <= 0.14) {
        var coldAlpha = smoothstep(0.14, -0.18, solarAltitude) * 0.42;
        ctx.fillStyle = 'rgba(14, 20, 30,' + coldAlpha.toFixed(3) + ')';
        ctx.fillRect(0, anchors.horizonY, width, height - anchors.horizonY);
      } else if (isSeptember && solarAltitude <= 0.16) {
        var plumAlpha = smoothstep(0.16, -0.20, solarAltitude) * 0.22;
        ctx.fillStyle = 'rgba(22, 14, 40,' + plumAlpha.toFixed(3) + ')';
        ctx.fillRect(0, anchors.horizonY, width, height - anchors.horizonY);
      }

      // (b.1) Specular Polychrome Reflection Ribbons down the Lead-Paved Street when lampsLit === true
      if (lampsLit) {
        var sb = anchors.streetBounds;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sb.farLeft.x, sb.farLeft.y);
        ctx.lineTo(sb.farRight.x, sb.farRight.y);
        ctx.lineTo(sb.nearRight.x, sb.nearRight.y);
        ctx.lineTo(sb.nearLeft.x, sb.nearLeft.y);
        ctx.closePath();
        ctx.clip();

        ctx.globalCompositeOperation = 'screen';

        // Burnished plumbum mirror sheen down street center
        var streetMidGrad = ctx.createLinearGradient(0, sb.farLeft.y, 0, sb.nearLeft.y);
        streetMidGrad.addColorStop(0, 'rgba(244, 183, 40,' + (0.14 * bloom).toFixed(3) + ')');
        streetMidGrad.addColorStop(0.5, 'rgba(142, 74, 232,' + (0.16 * bloom).toFixed(3) + ')');
        streetMidGrad.addColorStop(1, 'rgba(30, 196, 203,' + (0.12 * bloom).toFixed(3) + ')');
        ctx.fillStyle = streetMidGrad;
        ctx.fillRect(0, sb.farLeft.y, width, sb.nearLeft.y - sb.farLeft.y);

        // Synchronous polychrome ribbons cast by every lit food-stall doorway across the lead courses
        for (var di = 0; di < anchors.stallDoors.length; di++) {
          var door = anchors.stallDoors[di];
          var dDepth = clamp(door.depth, 0.05, 1.0);
          var leftEdgeX = lerp(sb.farLeft.x, sb.nearLeft.x, dDepth);
          var rightEdgeX = lerp(sb.farRight.x, sb.nearRight.x, dDepth);
          var streetW = Math.max(12, rightEdgeX - leftEdgeX);
          var baseY = door.y + door.h;

          for (var cIdx = 0; cIdx < 2; cIdx++) {
            var palIdx = (di * 3 + cIdx * 2) % PALETTE_RGB.length;
            var colRgb = PALETTE_RGB[palIdx];
            var startX = door.side === 'left'
              ? leftEdgeX + streetW * (0.04 + cIdx * 0.08)
              : rightEdgeX - streetW * (0.04 + cIdx * 0.08);
            var inwardX = lerp(startX, anchors.vanishingPoint.x, 0.28 + cIdx * 0.14);
            var ribLen = Math.max(26, (sb.nearLeft.y - baseY) * (0.55 + 0.25 * cIdx) + height * 0.08);
            var shimmer = reducedMotion ? 1 : (0.90 + 0.10 * Math.sin(timeSec * 2.4 + di * 0.9 + cIdx));

            var ribGrad = ctx.createLinearGradient(startX, baseY, inwardX, baseY + ribLen);
            ribGrad.addColorStop(0.0, rgbaStr(colRgb, 0.62 * bloom * shimmer));
            ribGrad.addColorStop(0.45, rgbaStr(colRgb, 0.34 * bloom * shimmer));
            ribGrad.addColorStop(1.0, rgbaStr(colRgb, 0.0));

            var ribWTop = Math.max(3, streetW * 0.035);
            var ribWBot = Math.max(8, streetW * 0.11);
            ctx.fillStyle = ribGrad;
            ctx.beginPath();
            ctx.moveTo(startX - ribWTop, baseY);
            ctx.lineTo(startX + ribWTop, baseY);
            ctx.lineTo(inwardX + ribWBot, baseY + ribLen);
            ctx.lineTo(inwardX - ribWBot, baseY + ribLen);
            ctx.closePath();
            ctx.fill();

            // Lead-flagstone horizontal specular glints along the ribbon
            var courses = 5;
            for (var sc = 0; sc < courses; sc++) {
              var uCourse = (sc + 0.5) / courses;
              var gy = baseY + ribLen * uCourse * 0.72;
              var gx = lerp(startX, inwardX, uCourse * 0.72);
              var gw = lerp(ribWTop, ribWBot, uCourse) * 1.35;
              ctx.fillStyle = rgbaStr(colRgb, (1 - uCourse) * 0.55 * bloom);
              ctx.fillRect(gx - gw, gy, gw * 2, 1.6);
            }
          }
        }
        ctx.restore();

        // (b.2) Prismatic Color Fans dispersed across Crystal Theater
        var ct = anchors.crystalTheater;
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        var prismCx = ct.x + ct.w * 0.5;
        var prismCy = ct.y + ct.h * 0.58;
        for (var pi = 0; pi < PALETTE_RGB.length; pi++) {
          var pRgb = PALETTE_RGB[pi];
          var fanFrac = (pi / (PALETTE_RGB.length - 1)) * 2 - 1;
          var angle = -Math.PI * 0.5 + fanFrac * 0.92 + (reducedMotion ? 0 : Math.sin(timeSec * 0.7 + pi) * 0.03);
          var fanLen = Math.max(ct.w, ct.h) * 1.25;
          var spread = 0.13;
          var x1 = prismCx + Math.cos(angle - spread) * fanLen;
          var y1 = prismCy + Math.sin(angle - spread) * fanLen;
          var x2 = prismCx + Math.cos(angle + spread) * fanLen;
          var y2 = prismCy + Math.sin(angle + spread) * fanLen;

          var fanGrad = ctx.createRadialGradient(prismCx, prismCy, 2, prismCx, prismCy, fanLen);
          fanGrad.addColorStop(0.0, rgbaStr(pRgb, 0.34 * bloom));
          fanGrad.addColorStop(0.55, rgbaStr(pRgb, 0.16 * bloom));
          fanGrad.addColorStop(1.0, rgbaStr(pRgb, 0.0));
          ctx.fillStyle = fanGrad;
          ctx.beginPath();
          ctx.moveTo(prismCx, prismCy);
          ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.closePath();
          ctx.fill();
        }

        // Faceted crystalline internal highlights
        ctx.strokeStyle = 'rgba(255, 245, 225,' + (0.28 * bloom).toFixed(3) + ')';
        ctx.lineWidth = 1.0;
        ctx.strokeRect(ct.x + ct.w * 0.08, ct.y + ct.h * 0.15, ct.w * 0.84, ct.h * 0.78);
        ctx.restore();
      }

      // (a) Food-Stall Doorways: ALL 12 ignite simultaneously with zero stagger when lampsLit === true
      var lampsHighlighted = (hoveredStoneId === 'september_food_stall_lamps' || selectedStoneId === 'september_food_stall_lamps');
      for (var k = 0; k < anchors.stallDoors.length; k++) {
        var sd = anchors.stallDoors[k];
        var dx = sd.x;
        var dy = sd.y;
        var dw = sd.w;
        var dh = sd.h;

        if (lampsLit) {
          // Warm friggitoria interior hearth glow
          ctx.save();
          drawArchedRectPath(ctx, dx, dy, dw, dh);
          ctx.clip();

          var doorGrad = ctx.createLinearGradient(dx, dy, dx, dy + dh);
          doorGrad.addColorStop(0.0, 'rgba(255, 224, 146,' + (0.95 * bloom).toFixed(3) + ')');
          doorGrad.addColorStop(0.55, 'rgba(244, 152, 54,' + (0.92 * bloom).toFixed(3) + ')');
          doorGrad.addColorStop(1.0, 'rgba(186, 74, 24,' + (0.90 * bloom).toFixed(3) + ')');
          ctx.fillStyle = doorGrad;
          ctx.fillRect(dx, dy, dw, dh);

          // Tiny stall-keeper silhouette tending the food-stall brazier inside doorway
          var keeperCx = dx + dw * (sd.side === 'left' ? 0.56 : 0.44);
          var keeperFootY = dy + dh;
          var headR = Math.max(1.8, dw * 0.11);
          var bodyH = dh * 0.44;
          ctx.fillStyle = 'rgba(34, 18, 22, 0.86)';
          ctx.beginPath();
          ctx.arc(keeperCx, keeperFootY - bodyH - headR * 1.1, headR, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(keeperCx - dw * 0.20, keeperFootY);
          ctx.lineTo(keeperCx - dw * 0.15, keeperFootY - bodyH);
          ctx.lineTo(keeperCx + dw * 0.16, keeperFootY - bodyH);
          ctx.lineTo(keeperCx + dw * 0.22, keeperFootY);
          ctx.closePath();
          ctx.fill();
          // Counter/brazier rim
          ctx.fillRect(dx, dy + dh * 0.74, dw, dh * 0.26);
          ctx.restore();

          // Fragrant oil-smoke wisps curling from each stall doorway
          ctx.save();
          var smokeTint = PALETTE_RGB[(k * 2) % PALETTE_RGB.length];
          for (var sw = 0; sw < 2; sw++) {
            var smokeBaseX = dx + dw * (0.35 + sw * 0.30);
            var smokeBaseY = dy + dh * 0.28;
            var smokeH = Math.max(14, dh * (0.65 + sw * 0.22));
            var sway = reducedMotion ? (sw === 0 ? -3 : 3) : Math.sin(timeSec * 1.45 + k + sw * 2.1) * (dw * 0.28);
            ctx.strokeStyle = rgbaStr(lerpRgb({ r: 245, g: 232, b: 215 }, smokeTint, 0.35), 0.30 * bloom);
            ctx.lineWidth = Math.max(1.0, dw * 0.055);
            ctx.beginPath();
            ctx.moveTo(smokeBaseX, smokeBaseY);
            ctx.bezierCurveTo(
              smokeBaseX + sway, smokeBaseY - smokeH * 0.36,
              smokeBaseX - sway * 0.9, smokeBaseY - smokeH * 0.72,
              smokeBaseX + sway * 0.6, smokeBaseY - smokeH
            );
            ctx.stroke();
          }
          ctx.restore();

          // Clustered multicolored lamps (4 jewel lanterns per doorway, all 12 doors synchronous)
          var clusterCount = 4;
          var bracketSpanLeft = dx - dw * 0.16;
          var bracketSpanRight = dx + dw * 1.16;
          var lintelY = dy + dh * 0.06;

          // Wrought-iron lamp cord across doorway lintel
          ctx.strokeStyle = 'rgba(28, 22, 30, 0.85)';
          ctx.lineWidth = Math.max(0.9, dw * 0.035);
          ctx.beginPath();
          ctx.moveTo(bracketSpanLeft, lintelY - 2);
          ctx.quadraticCurveTo(dx + dw * 0.5, lintelY + dh * 0.09, bracketSpanRight, lintelY - 2);
          ctx.stroke();

          for (var li = 0; li < clusterCount; li++) {
            var uLamp = (li + 0.5) / clusterCount;
            var lx = lerp(bracketSpanLeft, bracketSpanRight, uLamp);
            var sag = 4 * uLamp * (1 - uLamp) * (dh * 0.07);
            var ly = lintelY + sag + ((li % 2) * 1.8);
            var lampColorIdx = (k * 3 + li) % LAMP_PALETTE.length;
            var lampHex = LAMP_PALETTE[lampColorIdx];
            var lampRgb = PALETTE_RGB[lampColorIdx];
            var lampR = clamp(dw * 0.135, 2.3, 6.2);

            // Additive jewel halo
            ctx.save();
            ctx.globalCompositeOperation = 'screen';
            var haloR = lampR * 4.4 * bloom;
            var haloGrad = ctx.createRadialGradient(lx, ly, 0.5, lx, ly, haloR);
            haloGrad.addColorStop(0.0, 'rgba(255, 250, 230,' + (0.92 * bloom).toFixed(3) + ')');
            haloGrad.addColorStop(0.32, rgbaStr(lampRgb, 0.72 * bloom));
            haloGrad.addColorStop(1.0, rgbaStr(lampRgb, 0.0));
            ctx.fillStyle = haloGrad;
            ctx.beginPath();
            ctx.arc(lx, ly, haloR, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Jewel-glass lantern body + incandescent wick core
            ctx.fillStyle = lampHex;
            ctx.beginPath();
            ctx.arc(lx, ly, lampR, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#fff9e6';
            ctx.beginPath();
            ctx.arc(lx, ly, lampR * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (!isSeptember && solarAltitude <= DUSK_THRESHOLD) {
          // Cold unlit friggitoria doorways in non-September months
          ctx.save();
          drawArchedRectPath(ctx, dx, dy, dw, dh);
          ctx.fillStyle = 'rgba(12, 16, 24, 0.72)';
          ctx.fill();
          ctx.restore();
        }

        if (lampsHighlighted) {
          ctx.save();
          drawArchedRectPath(ctx, dx - 3, dy - 5, dw + 6, dh + 8);
          ctx.strokeStyle = lampsLit ? 'rgba(255, 224, 130, 0.92)' : 'rgba(218, 178, 96, 0.75)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.restore();
        }
      }

      // (d) Haunted Temporal Envy Ghost-Echoes along the lead street when envyIntensity > 0
      if (envy > 0.005) {
        var sbE = anchors.streetBounds;
        var ghostSpecs = [
          { kind: 'couple', depth: 0.78, lane: -0.22, phase: 0.2 },
          { kind: 'solo',   depth: 0.88, lane: 0.30,  phase: 1.5 },
          { kind: 'couple', depth: 0.52, lane: 0.16,  phase: 2.8 },
          { kind: 'couple', depth: 0.34, lane: -0.14, phase: 4.1 },
          { kind: 'solo',   depth: 0.21, lane: 0.08,  phase: 5.0 }
        ];

        ctx.save();
        for (var gi = 0; gi < ghostSpecs.length; gi++) {
          var gs = ghostSpecs[gi];
          var rowLeftX = lerp(sbE.farLeft.x, sbE.nearLeft.x, gs.depth);
          var rowRightX = lerp(sbE.farRight.x, sbE.nearRight.x, gs.depth);
          var rowY = lerp(sbE.farLeft.y, sbE.nearLeft.y, gs.depth);
          var rowSpan = Math.max(16, rowRightX - rowLeftX);
          var baseCx = (rowLeftX + rowRightX) * 0.5 + gs.lane * rowSpan * 0.5;
          var figScale = lerp(0.36, 1.25, gs.depth) * clamp(minDim / 760, 0.58, 1.18);
          var drift = reducedMotion ? 0 : Math.sin(timeSec * 0.95 + gs.phase);
          var dispX = (5.5 + 4.0 * gs.depth) * envy + drift * 1.8 * envy;
          var dispY = 2.2 * envy;

          // Twin diverging memory shadows on the lead pavement
          ctx.save();
          ctx.scale(1, 0.24);
          ctx.fillStyle = 'rgba(244, 183, 40,' + (0.18 * envy).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(baseCx - dispX, (rowY + 2) / 0.24, 14 * figScale, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = 'rgba(156, 112, 255,' + (0.18 * envy).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(baseCx + dispX, (rowY + 2) / 0.24, 14 * figScale, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Double-exposure additive silhouettes: Warm Gold ("that time") + Cool Violet (present longing)
          ctx.save();
          ctx.globalCompositeOperation = 'screen';

          var goldColor = 'rgba(255, 204, 112,' + (0.46 * envy).toFixed(3) + ')';
          var violetColor = 'rgba(174, 134, 255,' + (0.46 * envy).toFixed(3) + ')';
          var coreColor = 'rgba(255, 244, 232,' + (0.20 * envy).toFixed(3) + ')';

          drawPasserbySilhouette(ctx, gs.kind, baseCx - dispX, rowY - dispY, figScale, goldColor, drift * 0.6);
          drawPasserbySilhouette(ctx, gs.kind, baseCx + dispX, rowY + dispY * 0.5, figScale, violetColor, -drift * 0.6);
          drawPasserbySilhouette(ctx, gs.kind, baseCx, rowY, figScale * 0.99, coreColor, 0);

          // Delicate horizontal double-exposure registration filament linking the two temporal selves
          ctx.strokeStyle = 'rgba(255, 226, 176,' + (0.24 * envy).toFixed(3) + ')';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(baseCx - dispX, rowY - 26 * figScale);
          ctx.lineTo(baseCx + dispX, rowY - 26 * figScale);
          ctx.stroke();
          ctx.restore();
        }

        // Faint double-exposed spectator silhouettes shimmering inside Crystal Theater proscenium
        var ctG = anchors.crystalTheater;
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (var sp = 0; sp < 3; sp++) {
          var sxG = ctG.x + ctG.w * (0.28 + sp * 0.22);
          var syG = ctG.y + ctG.h * 0.88;
          var scG = clamp(ctG.h / 180, 0.30, 0.62);
          drawPasserbySilhouette(ctx, sp === 1 ? 'couple' : 'solo', sxG - 3.5 * envy, syG, scG,
            'rgba(255, 206, 120,' + (0.26 * envy).toFixed(3) + ')', 0);
          drawPasserbySilhouette(ctx, sp === 1 ? 'couple' : 'solo', sxG + 3.5 * envy, syG, scG,
            'rgba(168, 136, 255,' + (0.26 * envy).toFixed(3) + ')', 0);
        }
        ctx.restore();

        ctx.restore();
      }

      // (c) Terrace Woman Silhouette & Calligraphic Acoustic "ooh!" Wave Arcs when voiceCried === true
      var ta = anchors.terraceAnchor;
      var terraceHighlighted = (hoveredStoneId === 'terrace_woman_voice_ooh' || selectedStoneId === 'terrace_woman_voice_ooh');

      if (voiceCried) {
        ctx.save();

        // Warm loggia glow behind the upper balustrade
        var loggiaCx = ta.x + ta.w * 0.52;
        var loggiaCy = ta.y + ta.h * 0.48;
        var loggiaR = Math.max(ta.w, ta.h) * 0.95;
        var loggiaGrad = ctx.createRadialGradient(loggiaCx, loggiaCy, 2, loggiaCx, loggiaCy, loggiaR);
        loggiaGrad.addColorStop(0.0, 'rgba(255, 218, 142, 0.78)');
        loggiaGrad.addColorStop(0.45, 'rgba(236, 138, 72, 0.34)');
        loggiaGrad.addColorStop(1.0, 'rgba(236, 138, 72, 0.0)');
        ctx.fillStyle = loggiaGrad;
        ctx.beginPath();
        ctx.arc(loggiaCx, loggiaCy, loggiaR, 0, Math.PI * 2);
        ctx.fill();

        // Warm balustrade rail highlight
        var railY = ta.y + ta.h * 0.66;
        ctx.strokeStyle = 'rgba(255, 214, 148, 0.75)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(ta.x + ta.w * 0.08, railY);
        ctx.lineTo(ta.x + ta.w * 0.92, railY);
        ctx.stroke();

        // Silhouette of a woman leaning at the terrace rail looking down toward the food-stall lamps
        var womX = ta.x + ta.w * 0.46;
        var womRailY = railY;
        var womScale = clamp(ta.h / 66, 0.52, 1.32);
        var mouthX = womX - 7 * womScale;
        var mouthY = womRailY - 22 * womScale;

        ctx.save();
        ctx.translate(womX, womRailY);
        ctx.scale(womScale, womScale);
        ctx.fillStyle = '#1d1226';
        ctx.strokeStyle = 'rgba(255, 224, 168, 0.70)';
        ctx.lineWidth = 1.0;

        // Head + gathered chignon, tilted gently toward street
        ctx.beginPath();
        ctx.arc(-3.5, -23, 4.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(1.2, -24.5, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Torso leaning forward + forearm resting on terrace balustrade
        ctx.beginPath();
        ctx.moveTo(-4, -18);
        ctx.quadraticCurveTo(3.5, -16, 5.5, 0);
        ctx.lineTo(-5.5, 0);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#1d1226';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(-3.5, -15.5);
        ctx.quadraticCurveTo(-9, -8, -11.5, -1);
        ctx.stroke();
        ctx.restore();

        // Calligraphic acoustic wave arcs + inscribed "ooh!" resonances across twilight sky
        var ringCount = 4;
        var maxWaveR = Math.max(width, height) * 0.28;
        for (var wi = 0; wi < ringCount; wi++) {
          var phaseShift = reducedMotion
            ? ((wi + 0.55) / ringCount) * clamp(waveProg, 0.35, 1)
            : (((waveProg * 1.15 + timeSec * 0.22 + wi / ringCount) % 1));
          if (!reducedMotion && state.voiceAgeSec < wi * 0.14) continue;

          var rad = 14 + phaseShift * maxWaveR;
          var arcAlpha = (1 - phaseShift) * 0.72 * clamp(waveProg * 2.2, 0.25, 1);
          if (arcAlpha <= 0.03) continue;

          ctx.strokeStyle = (wi % 2 === 0)
            ? 'rgba(255, 226, 168,' + arcAlpha.toFixed(3) + ')'
            : 'rgba(238, 174, 224,' + (arcAlpha * 0.85).toFixed(3) + ')';
          ctx.lineWidth = Math.max(0.9, (1 - phaseShift) * 2.2);
          ctx.beginPath();
          // Radiate outward & leftward across the twilight sky over the street and domes
          ctx.arc(mouthX, mouthY, rad, Math.PI * 0.68, Math.PI * 1.44);
          ctx.stroke();
        }

        // Primary calligraphic "ooh!" inscription + receding echoes
        var fontPx = Math.round(clamp(minDim * 0.025, 13, 21));
        ctx.font = 'italic 600 ' + fontPx + 'px Georgia, "Times New Roman", serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        var floatLift = reducedMotion ? 0 : Math.sin(timeSec * 1.8) * 2.5;
        var primaryAlpha = clamp(waveProg * 2.5, 0.45, 0.96);
        ctx.fillStyle = 'rgba(255, 238, 198,' + primaryAlpha.toFixed(3) + ')';
        ctx.fillText('ooh!', mouthX - 16 * womScale, mouthY - 8 * womScale + floatLift);

        var echoFontPx = Math.round(fontPx * 0.82);
        ctx.font = 'italic ' + echoFontPx + 'px Georgia, "Times New Roman", serif';
        ctx.fillStyle = 'rgba(236, 196, 248,' + (primaryAlpha * 0.52).toFixed(3) + ')';
        ctx.fillText('ooh…', mouthX - 58 * womScale, mouthY - 28 * womScale - floatLift * 0.7);

        ctx.restore();
      }

      if (terraceHighlighted) {
        ctx.save();
        ctx.strokeStyle = voiceCried ? 'rgba(255, 232, 176, 0.95)' : 'rgba(218, 186, 120, 0.80)';
        ctx.lineWidth = 1.6;
        if (typeof ctx.setLineDash === 'function' && !voiceCried) {
          ctx.setLineDash([4, 3]);
        }
        ctx.strokeRect(ta.x - 4, ta.y - 4, ta.w + 8, ta.h + 8);
        ctx.restore();
      }

      ctx.restore();
    }

    function hitTestDusk(x, y, width, height, rawAnchors) {
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      var anchors = resolveAnchors(width, height, rawAnchors);

      // 1. Check elevated terrace balustrade & "ooh!" callout zone first
      var ta = anchors.terraceAnchor;
      var padT = Math.max(10, Math.min(width, height) * 0.014);
      var calloutExtraLeft = state.voiceCried ? Math.max(36, ta.w * 0.45) : 0;
      if (
        x >= ta.x - padT - calloutExtraLeft &&
        x <= ta.x + ta.w + padT &&
        y >= ta.y - padT * 1.4 &&
        y <= ta.y + ta.h + padT
      ) {
        return {
          stoneId: DUSK_STONES[1].stoneId,
          id: DUSK_STONES[1].id,
          label: DUSK_STONES[1].label,
          detail: state.voiceCried ? DUSK_STONES[1].duskDetail : DUSK_STONES[1].daylightDetail
        };
      }

      // 2. Check all 12 food-stall doorways and overhead hanging lamp clusters
      for (var i = 0; i < anchors.stallDoors.length; i++) {
        var sd = anchors.stallDoors[i];
        var padX = Math.max(7, sd.w * 0.28);
        var padTop = Math.max(9, sd.h * 0.22);
        var padBot = Math.max(6, sd.h * 0.12);
        if (
          x >= sd.x - padX &&
          x <= sd.x + sd.w + padX &&
          y >= sd.y - padTop &&
          y <= sd.y + sd.h + padBot
        ) {
          return {
            stoneId: DUSK_STONES[0].stoneId,
            id: DUSK_STONES[0].id,
            label: DUSK_STONES[0].label,
            detail: state.lampsLit ? DUSK_STONES[0].duskDetail : DUSK_STONES[0].daylightDetail
          };
        }
      }

      return null;
    }

    return {
      DUSK_THRESHOLD: DUSK_THRESHOLD,
      LAMP_PALETTE: LAMP_PALETTE,
      LAMP_HUE_NAMES: LAMP_HUE_NAMES,
      DUSK_STONES: DUSK_STONES,
      update: update,
      getState: buildSnapshot,
      reset: reset,
      renderSkyBackdrop: renderSkyBackdrop,
      renderDuskOverlay: renderDuskOverlay,
      hitTestDusk: hitTestDusk,
      triggerDuskAudio: controllerTriggerAudio
    };
  }

  var api = {
    DUSK_THRESHOLD: DUSK_THRESHOLD,
    LAMP_PALETTE: LAMP_PALETTE,
    LAMP_HUE_NAMES: LAMP_HUE_NAMES,
    DUSK_STONES: DUSK_STONES,
    create: create,
    triggerDuskAudio: triggerDuskAudio,
    resolveAnchors: resolveAnchors
  };

  if (typeof window !== 'undefined') {
    window.DiomiraSeptemberDusk = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.DiomiraSeptemberDusk = api;
  }
})();
