(function (global) {
  'use strict';

  var TAU = Math.PI * 2;
  var HALF_PI = Math.PI * 0.5;

  function clamp(v, lo, hi) {
    var n = Number(v);
    if (!Number.isFinite(n)) return lo;
    return n < lo ? lo : n > hi ? hi : n;
  }

  function clamp01(v) {
    return clamp(v, 0, 1);
  }

  function round2(v) {
    return Number(Number(v).toFixed(2));
  }

  function round4(v) {
    return Number(Number(v).toFixed(4));
  }

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function radToDeg(rad) {
    return (rad * 180) / Math.PI;
  }

  var PALETTE = Object.freeze({
    firmamentObsidian: '#070911',
    firmamentMidnight: '#0e1424',
    firmamentTwilight: '#182238',
    astrolabeBrass: '#c69a4b',
    brassHighlight: '#e8c77b',
    brassTarnish: '#6e5223',
    solsticeGold: '#f4c85d',
    solsticeAmber: '#e09b36',
    eclipseUmbraCopper: '#8f4126',
    eclipsePenumbra: '#4d2318',
    limeMortar: '#d7cfb8',
    marblePaving: '#dfd8c5',
    stoneAshlar: '#8f8775',
    parchmentRoll: '#efe3c4',
    parchmentInk: '#2b2218',
    bloodErrata: '#b8292f',
    bloodErrataBright: '#e34248',
    constellationCyan: '#6ad2e5',
    constellationGlow: '#a6ecfa',
    cellarTorchlight: '#ee8b31',
    cellarBrick: '#5c281b',
    voidShadow: '#04050a'
  });

  var RAW_HOUSES = [
    { index: 0, id: 'aries', name: 'Aries', glyph: '\u2648', templeName: 'Temple of the Vernal Ram', planetaryRuler: 'Mars', startDeg: 0, endDeg: 30, monstrousCorrelate: 'Cripples of the Arcade', cohortId: 'cripples', stars: [[-0.32, -0.18], [-0.05, 0.08], [0.22, 0.02], [0.34, -0.16]] },
    { index: 1, id: 'taurus', name: 'Taurus', glyph: '\u2649', templeName: 'Sanctuary of the Brazen Bull', planetaryRuler: 'Venus', startDeg: 30, endDeg: 60, monstrousCorrelate: 'Obese Men of the Square', cohortId: 'obese_men', stars: [[-0.34, -0.22], [-0.08, 0.02], [0.28, -0.18], [0.04, 0.24], [0.26, 0.20]] },
    { index: 2, id: 'gemini', name: 'Gemini', glyph: '\u264A', templeName: 'Fane of the Triune Pillars', planetaryRuler: 'Mercury', startDeg: 60, endDeg: 90, monstrousCorrelate: 'Children with Three Heads', cohortId: 'three_headed_children', stars: [[-0.26, -0.24], [-0.20, 0.22], [0.02, -0.02], [0.24, -0.22], [0.22, 0.24]] },
    { index: 3, id: 'cancer', name: 'Cancer', glyph: '\u264B', templeName: 'Vault of the Tropic Crab', planetaryRuler: 'Moon', startDeg: 90, endDeg: 120, monstrousCorrelate: 'Children with Six Legs', cohortId: 'six_legged_children', stars: [[-0.28, -0.16], [0.0, 0.0], [0.28, -0.14], [-0.18, 0.24], [0.20, 0.22]] },
    { index: 4, id: 'leo', name: 'Leo', glyph: '\u264C', templeName: 'Basilica of the Solar Lion', planetaryRuler: 'Sun', startDeg: 120, endDeg: 150, monstrousCorrelate: 'Dwarfs & Hunchbacks', cohortId: 'dwarfs_hunchbacks', stars: [[-0.32, 0.18], [-0.12, -0.20], [0.08, -0.24], [0.16, 0.04], [0.34, 0.16]] },
    { index: 5, id: 'virgo', name: 'Virgo', glyph: '\u264D', templeName: 'Portico of the Spica Sheaf', planetaryRuler: 'Mercury', startDeg: 150, endDeg: 180, monstrousCorrelate: 'Women with Beards', cohortId: 'bearded_women', stars: [[-0.34, -0.10], [-0.10, 0.04], [0.12, -0.18], [0.16, 0.20], [0.34, 0.08]] },
    { index: 6, id: 'libra', name: 'Libra', glyph: '\u264E', templeName: 'Tribunal of the Equinox Scales', planetaryRuler: 'Venus', startDeg: 180, endDeg: 210, monstrousCorrelate: 'Dwarfs & Hunchbacks', cohortId: 'dwarfs_hunchbacks', stars: [[-0.30, 0.12], [0.0, -0.22], [0.30, 0.12], [0.0, 0.20]] },
    { index: 7, id: 'scorpio', name: 'Scorpio', glyph: '\u264F', templeName: 'Shrine of the Antares Sting', planetaryRuler: 'Mars', startDeg: 210, endDeg: 240, monstrousCorrelate: 'Children with Six Legs', cohortId: 'six_legged_children', stars: [[-0.34, -0.18], [-0.14, -0.06], [0.06, 0.08], [0.24, 0.22], [0.34, 0.04]] },
    { index: 8, id: 'sagittarius', name: 'Sagittarius', glyph: '\u2650', templeName: 'Altar of the Centaur Bow', planetaryRuler: 'Jupiter', startDeg: 240, endDeg: 270, monstrousCorrelate: 'Cripples of the Arcade', cohortId: 'cripples', stars: [[-0.28, 0.18], [-0.06, -0.20], [0.14, 0.02], [0.32, -0.16], [0.22, 0.22]] },
    { index: 9, id: 'capricorn', name: 'Capricorn', glyph: '\u2651', templeName: 'Cella of the Solstice Sea-Goat', planetaryRuler: 'Saturn', startDeg: 270, endDeg: 300, monstrousCorrelate: 'Women with Beards', cohortId: 'bearded_women', stars: [[-0.32, -0.14], [0.0, 0.24], [0.32, -0.12], [0.04, -0.06]] },
    { index: 10, id: 'aquarius', name: 'Aquarius', glyph: '\u2652', templeName: 'Nymphaeum of the Urn-Bearer', planetaryRuler: 'Saturn', startDeg: 300, endDeg: 330, monstrousCorrelate: 'Obese Men of the Square', cohortId: 'obese_men', stars: [[-0.34, -0.12], [-0.14, 0.14], [0.06, -0.12], [0.22, 0.14], [0.36, -0.08]] },
    { index: 11, id: 'pisces', name: 'Pisces', glyph: '\u2653', templeName: 'Cloister of the Corded Fishes', planetaryRuler: 'Jupiter', startDeg: 330, endDeg: 360, monstrousCorrelate: 'Children with Three Heads', cohortId: 'three_headed_children', stars: [[-0.30, -0.18], [-0.02, 0.22], [0.30, -0.16], [0.12, 0.02]] }
  ];

  var ZODIAC_HOUSES = Object.freeze(RAW_HOUSES.map(function (h) {
    return Object.freeze({
      index: h.index,
      id: h.id,
      name: h.name,
      glyph: h.glyph,
      templeName: h.templeName,
      planetaryRuler: h.planetaryRuler,
      startDeg: h.startDeg,
      endDeg: h.endDeg,
      monstrousCorrelate: h.monstrousCorrelate,
      cohortId: h.cohortId,
      stars: Object.freeze(h.stars.map(function (pt) { return Object.freeze([pt[0], pt[1]]); }))
    });
  }));

  var RAW_GATES = [
    {
      index: 0,
      id: 'solsticeRiseGate',
      name: 'Solstice Sunrise Gate',
      shortLabel: 'SOLSTICE RISE',
      kind: 'gate',
      phenomenon: 'Summer Solstice First Ray',
      targetDeg: -23.5,
      maxDetuneDeg: 18.0
    },
    {
      index: 1,
      id: 'solsticeSetGate',
      name: 'Solstice Sunset Gate',
      shortLabel: 'SOLSTICE SET',
      kind: 'gate',
      phenomenon: 'Solstice Horizon Setting',
      targetDeg: -156.5,
      maxDetuneDeg: -16.5
    },
    {
      index: 2,
      id: 'lunarUmbraTower',
      name: 'Lunar Umbra Tower',
      shortLabel: 'SAROS UMBRA',
      kind: 'tower',
      phenomenon: 'Lunar-Eclipse Saros Umbra',
      targetDeg: 36.0,
      maxDetuneDeg: 21.0
    },
    {
      index: 3,
      id: 'greatConjunctionTower',
      name: 'Great Conjunction Tower',
      shortLabel: 'SYZYGY TOWER',
      kind: 'tower',
      phenomenon: 'Jupiter-Saturn Syzygy',
      targetDeg: 144.0,
      maxDetuneDeg: -19.5
    }
  ].map(function (g) { return Object.freeze(g); });

  Object.defineProperties(RAW_GATES, {
    solsticeRiseGate: { value: RAW_GATES[0], enumerable: false },
    solsticeSetGate: { value: RAW_GATES[1], enumerable: false },
    lunarUmbraTower: { value: RAW_GATES[2], enumerable: false },
    greatConjunctionTower: { value: RAW_GATES[3], enumerable: false }
  });

  var ECLIPSE_GATES = Object.freeze(RAW_GATES);

  function buildFirmamentStars(count) {
    var list = [];
    var seed = 470913;
    for (var i = 0; i < count; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      var u = (seed & 0xffff) / 65535;
      seed = (seed * 1664525 + 1013904223) >>> 0;
      var v = (seed & 0xffff) / 65535;
      seed = (seed * 1664525 + 1013904223) >>> 0;
      var mag = 0.25 + ((seed & 0xfff) / 4095) * 0.75;
      list.push({
        angle: u * TAU,
        distNorm: 0.14 + Math.sqrt(v) * 0.92,
        mag: mag,
        tint: i % 5 === 0 ? PALETTE.constellationGlow : i % 7 === 0 ? PALETTE.solsticeGold : '#e9eef7',
        twinklePhase: i * 0.73
      });
    }
    return list;
  }

  var FIRMAMENT_STARS = buildFirmamentStars(96);

  function createAstrolabeAudio(initialMuted) {
    var ctx = null;
    var muted = Boolean(initialMuted);
    var unlocked = false;

    function ensureCtx() {
      if (ctx) return ctx;
      try {
        var Ctor = global.AudioContext || global.webkitAudioContext;
        if (typeof Ctor === 'function') {
          ctx = new Ctor();
        }
      } catch (_err) {
        ctx = null;
      }
      return ctx;
    }

    function unlockAudio() {
      var ac = ensureCtx();
      if (!ac) return false;
      try {
        if (ac.state === 'suspended' && typeof ac.resume === 'function') {
          var p = ac.resume();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        }
        unlocked = true;
      } catch (_err) {
        unlocked = false;
      }
      return unlocked;
    }

    function setMuted(b) {
      muted = Boolean(b);
      return muted;
    }

    function isMuted() {
      return muted;
    }

    function playVernierTick(p01) {
      if (muted || !ctx) return false;
      try {
        var now = ctx.currentTime || 0;
        var p = clamp01(p01);
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880 + p * 660, now);
        osc.frequency.exponentialRampToValueAtTime(420 + p * 240, now + 0.036);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.042, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.044);
        return true;
      } catch (_err) {
        return false;
      }
    }

    function playSolsticeChord(p01) {
      if (muted || !ctx) return false;
      try {
        var now = ctx.currentTime || 0;
        var p = clamp01(p01);
        var darkWeight = Math.pow(p, 1.55);
        var partials = [
          { freq: 220.0, amp: 0.045, type: 'sine', dur: 0.58 },
          { freq: 330.0, amp: 0.038, type: 'sine', dur: 0.54 },
          { freq: 495.0, amp: 0.026, type: 'triangle', dur: 0.48 },
          { freq: 146.67, amp: 0.006 + 0.034 * darkWeight, type: 'triangle', dur: 0.72 },
          { freq: 110.0, amp: 0.004 + 0.032 * darkWeight, type: 'sawtooth', dur: 0.78 },
          { freq: 73.33, amp: 0.002 + 0.028 * darkWeight, type: 'sine', dur: 0.85 },
          { freq: 155.56, amp: 0.018 * darkWeight, type: 'sine', dur: 0.68 }
        ];
        for (var i = 0; i < partials.length; i++) {
          var item = partials[i];
          if (item.amp <= 0.0005) continue;
          var osc = ctx.createOscillator();
          var g = ctx.createGain();
          osc.type = item.type;
          osc.frequency.setValueAtTime(item.freq, now);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.linearRampToValueAtTime(item.amp, now + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, now + item.dur);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + item.dur + 0.02);
        }
        return true;
      } catch (_err) {
        return false;
      }
    }

    function playCellarResonance(howl01, forkVerdict) {
      if (muted || !ctx) return false;
      try {
        var now = ctx.currentTime || 0;
        var h = clamp01(howl01);
        var baseFreq = forkVerdict === 'admitCalculationsWrong' ? 77.78 : forkVerdict === 'confessGodsOrderIsMonsters' ? 65.41 : 73.42;
        var osc = ctx.createOscillator();
        var sub = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = 'sawtooth';
        sub.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, now);
        osc.frequency.linearRampToValueAtTime(baseFreq * (0.96 + 0.06 * h), now + 0.55);
        sub.frequency.setValueAtTime(baseFreq * 1.5, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.018 + 0.036 * h, now + 0.09);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.66);
        if (typeof ctx.createBiquadFilter === 'function') {
          var filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(240 + 210 * h, now);
          filter.Q.setValueAtTime(4.2, now);
          osc.connect(filter);
          sub.connect(filter);
          filter.connect(gain);
        } else {
          osc.connect(gain);
          sub.connect(gain);
        }
        gain.connect(ctx.destination);
        osc.start(now);
        sub.start(now);
        osc.stop(now + 0.70);
        sub.stop(now + 0.70);
        return true;
      } catch (_err) {
        return false;
      }
    }

    return {
      unlockAudio: unlockAudio,
      setMuted: setMuted,
      isMuted: isMuted,
      isUnlocked: function () { return unlocked; },
      playVernierTick: playVernierTick,
      playSolsticeChord: playSolsticeChord,
      playCellarResonance: playCellarResonance
    };
  }

  var INITIAL_HOUSE_LOCKS = Object.freeze([
    true, false, false, true, false, false,
    true, false, false, true, false, false
  ]);

  var PERTURB_PRESETS = [
    [13.5, -15.0],
    [-19.0, 14.5],
    [22.5, 17.0],
    [-14.0, -21.5]
  ];

  function createFoundingAstrolabe(opts) {
    var cfg = opts || {};
    var onChange = typeof cfg.onChange === 'function' ? cfg.onChange : null;
    var audio = createAstrolabeAudio(Boolean(cfg.muted));

    var state = {
      cardoOffsetDeg: 14.5,
      decumanusOffsetDeg: -16.0,
      eclipseTuning: 0.38,
      houseLocks: INITIAL_HOUSE_LOCKS.slice(),
      housesConsecrated: 4,
      cardoPrecision: 0,
      decumanusPrecision: 0,
      zodiacCoverage: 0,
      celestialPrecision: 0,
      syzygyLocked: false,
      skyPhaseRad: 0,
      epicyclePhaseRad: 0,
      perturbIndex: 0
    };

    function recompute() {
      var cardoPrecision = Math.max(0, 1 - Math.abs(state.cardoOffsetDeg) / 30);
      var decumanusPrecision = Math.max(0, 1 - Math.abs(state.decumanusOffsetDeg) / 30);
      var count = 0;
      for (var i = 0; i < 12; i++) {
        if (state.houseLocks[i]) count++;
      }
      state.housesConsecrated = count;
      var zodiacCoverage = count / 12;
      var cp = round4(
        0.30 * cardoPrecision +
        0.30 * decumanusPrecision +
        0.25 * state.eclipseTuning +
        0.15 * zodiacCoverage
      );
      state.cardoPrecision = round4(cardoPrecision);
      state.decumanusPrecision = round4(decumanusPrecision);
      state.zodiacCoverage = round4(zodiacCoverage);
      state.celestialPrecision = cp;
      state.syzygyLocked = cp >= 0.999;
    }

    recompute();

    function getState() {
      return {
        cardoOffsetDeg: state.cardoOffsetDeg,
        decumanusOffsetDeg: state.decumanusOffsetDeg,
        eclipseTuning: state.eclipseTuning,
        houseLocks: state.houseLocks.slice(),
        housesConsecrated: state.housesConsecrated,
        cardoPrecision: state.cardoPrecision,
        decumanusPrecision: state.decumanusPrecision,
        zodiacCoverage: state.zodiacCoverage,
        celestialPrecision: state.celestialPrecision,
        syzygyLocked: state.syzygyLocked,
        ephemerisSkyErrorArcsec: 0,
        surveyDeviationArcmin: round2((1 - state.celestialPrecision) * 180),
        skyPhaseRad: round4(state.skyPhaseRad),
        epicyclePhaseRad: round4(state.epicyclePhaseRad),
        muted: audio.isMuted(),
        audioUnlocked: audio.isUnlocked()
      };
    }

    function notify() {
      recompute();
      var snap = getState();
      if (onChange) onChange(snap);
      return snap;
    }

    function setCardoOffset(deg) {
      state.cardoOffsetDeg = round2(clamp(deg, -30, 30));
      return notify();
    }

    function setDecumanusOffset(deg) {
      state.decumanusOffsetDeg = round2(clamp(deg, -30, 30));
      return notify();
    }

    function setEclipseTuning(v01) {
      state.eclipseTuning = round4(clamp01(v01));
      return notify();
    }

    function toggleHouse(idx) {
      var i = Number(idx);
      if (Number.isInteger(i) && i >= 0 && i < 12) {
        state.houseLocks[i] = !state.houseLocks[i];
        return notify();
      }
      return getState();
    }

    function consecrateAllHouses() {
      for (var i = 0; i < 12; i++) state.houseLocks[i] = true;
      return notify();
    }

    function alignSolsticeAxes() {
      state.cardoOffsetDeg = 0;
      state.decumanusOffsetDeg = 0;
      for (var i = 0; i < 12; i++) state.houseLocks[i] = true;
      return notify();
    }

    function alignFullFirmament() {
      state.cardoOffsetDeg = 0;
      state.decumanusOffsetDeg = 0;
      state.eclipseTuning = 1;
      for (var i = 0; i < 12; i++) state.houseLocks[i] = true;
      return notify();
    }

    function perturbAxes(dCardo, dDecumanus) {
      if (typeof dCardo === 'number' && Number.isFinite(dCardo)) {
        var dd = (typeof dDecumanus === 'number' && Number.isFinite(dDecumanus))
          ? dDecumanus
          : -dCardo * 0.85;
        state.cardoOffsetDeg = round2(clamp(state.cardoOffsetDeg + dCardo, -30, 30));
        state.decumanusOffsetDeg = round2(clamp(state.decumanusOffsetDeg + dd, -30, 30));
      } else {
        var pair = PERTURB_PRESETS[state.perturbIndex % PERTURB_PRESETS.length];
        state.perturbIndex++;
        state.cardoOffsetDeg = pair[0];
        state.decumanusOffsetDeg = pair[1];
      }
      return notify();
    }

    function reset() {
      state.cardoOffsetDeg = 14.5;
      state.decumanusOffsetDeg = -16.0;
      state.eclipseTuning = 0.38;
      state.houseLocks = INITIAL_HOUSE_LOCKS.slice();
      state.perturbIndex = 0;
      return notify();
    }

    function step(dt, stepOpts) {
      var reduced = Boolean(stepOpts && stepOpts.reducedMotion);
      if (!reduced) {
        var sec = clamp(dt, 0, 0.25);
        state.skyPhaseRad = (state.skyPhaseRad + sec * 0.048) % TAU;
        state.epicyclePhaseRad = (state.epicyclePhaseRad + sec * 0.42) % TAU;
      }
      return getState();
    }

    function getGeometry(w, h) {
      var width = Math.max(64, Number(w) || 800);
      var height = Math.max(64, Number(h) || 600);
      var cx = width * 0.5;
      var cy = height * 0.5;
      var minDim = Math.min(width, height);
      var outerR = minDim * 0.44;
      var zodiacOuterR = outerR * 0.91;
      var cityR = outerR * 0.74;
      var innerR = outerR * 0.24;
      var cardoAngleRad = -HALF_PI + degToRad(state.cardoOffsetDeg);
      var decumanusAngleRad = degToRad(state.decumanusOffsetDeg);

      var houseSectors = [];
      var slice = Math.PI / 6;
      var midBandR = (cityR + zodiacOuterR) * 0.5;
      for (var i = 0; i < 12; i++) {
        var hz = ZODIAC_HOUSES[i];
        var startRad = -HALF_PI + i * slice;
        var endRad = startRad + slice;
        var midRad = startRad + slice * 0.5;
        var locked = Boolean(state.houseLocks[i]);
        houseSectors.push({
          index: i,
          id: hz.id,
          name: hz.name,
          glyph: hz.glyph,
          templeName: hz.templeName,
          planetaryRuler: hz.planetaryRuler,
          monstrousCorrelate: hz.monstrousCorrelate,
          cohortId: hz.cohortId,
          consecrated: locked,
          locked: locked,
          startDeg: hz.startDeg,
          endDeg: hz.endDeg,
          startRad: startRad,
          endRad: endRad,
          midRad: midRad,
          angleRad: midRad,
          innerR: cityR,
          outerR: zodiacOuterR,
          midR: midBandR,
          x: cx + Math.cos(midRad) * midBandR,
          y: cy + Math.sin(midRad) * midBandR,
          templeX: cx + Math.cos(midRad) * (cityR * 0.90),
          templeY: cy + Math.sin(midRad) * (cityR * 0.90)
        });
      }

      var gatePositions = [];
      var gateProps = {};
      for (var g = 0; g < ECLIPSE_GATES.length; g++) {
        var gd = ECLIPSE_GATES[g];
        var detune = (1 - state.eclipseTuning) * gd.maxDetuneDeg;
        var targetRad = degToRad(gd.targetDeg);
        var curRad = degToRad(gd.targetDeg + detune);
        var entry = {
          index: g,
          id: gd.id,
          name: gd.name,
          shortLabel: gd.shortLabel,
          kind: gd.kind,
          phenomenon: gd.phenomenon,
          targetAngleRad: targetRad,
          angleRad: curRad,
          sightlineErrorDeg: round2(Math.abs(detune)),
          x: cx + Math.cos(curRad) * cityR,
          y: cy + Math.sin(curRad) * cityR,
          skyX: cx + Math.cos(targetRad) * outerR,
          skyY: cy + Math.sin(targetRad) * outerR,
          alignment01: state.eclipseTuning,
          locked: state.eclipseTuning >= 0.99
        };
        gatePositions.push(entry);
        gateProps[gd.id] = { value: entry, enumerable: false };
      }
      Object.defineProperties(gatePositions, gateProps);

      return {
        width: width,
        height: height,
        cx: cx,
        cy: cy,
        outerR: outerR,
        zodiacOuterR: zodiacOuterR,
        cityR: cityR,
        innerR: innerR,
        cardoAngleRad: cardoAngleRad,
        decumanusAngleRad: decumanusAngleRad,
        houseSectors: houseSectors,
        gatePositions: gatePositions
      };
    }

    function hitTest(nx, ny, w, h) {
      var geom = getGeometry(w, h);
      var rawX = Number(nx);
      var rawY = Number(ny);
      if (!Number.isFinite(rawX) || !Number.isFinite(rawY)) {
        return { kind: null, houseIndex: null, gateId: null, angleDeg: 0 };
      }
      var isPixel = rawX > 1.5 || rawY > 1.5;
      var px = isPixel ? rawX : rawX * geom.width;
      var py = isPixel ? rawY : rawY * geom.height;
      var dx = px - geom.cx;
      var dy = py - geom.cy;
      var dist = Math.hypot(dx, dy);
      var rawRad = Math.atan2(dy, dx);
      var angleDeg = round2(radToDeg(rawRad));

      var gateTol = Math.max(14, geom.outerR * 0.068);
      for (var g = 0; g < geom.gatePositions.length; g++) {
        var gp = geom.gatePositions[g];
        if (Math.hypot(px - gp.x, py - gp.y) <= gateTol) {
          return { kind: 'gate', houseIndex: null, gateId: gp.id, angleDeg: angleDeg };
        }
      }

      if (dist >= geom.cityR * 0.96 && dist <= geom.zodiacOuterR * 1.02) {
        var rel = ((rawRad + HALF_PI) % TAU + TAU) % TAU;
        var hIdx = Math.min(11, Math.floor(rel / (Math.PI / 6)));
        return { kind: 'house', houseIndex: hIdx, gateId: null, angleDeg: angleDeg };
      }

      if (dist > geom.zodiacOuterR * 1.02 && dist <= geom.outerR * 1.08) {
        return { kind: 'ring', houseIndex: null, gateId: null, angleDeg: angleDeg };
      }

      if (dist <= geom.cityR * 1.02) {
        var axisTol = Math.max(12, geom.outerR * 0.06);
        var cUx = Math.cos(geom.cardoAngleRad);
        var cUy = Math.sin(geom.cardoAngleRad);
        var perpCardo = Math.abs(-dx * cUy + dy * cUx);

        var dUx = Math.cos(geom.decumanusAngleRad);
        var dUy = Math.sin(geom.decumanusAngleRad);
        var perpDec = Math.abs(-dx * dUy + dy * dUx);

        if (perpCardo <= axisTol || perpDec <= axisTol) {
          var chosen = perpCardo <= perpDec ? 'cardo' : 'decumanus';
          return { kind: chosen, houseIndex: null, gateId: null, angleDeg: angleDeg };
        }
      }

      return { kind: null, houseIndex: null, gateId: null, angleDeg: angleDeg };
    }

    function drawFirmamentAndStars(ctx, geom, ro) {
      var w = geom.width;
      var h = geom.height;
      var cx = geom.cx;
      var cy = geom.cy;
      var maxR = Math.hypot(w, h) * 0.55;

      ctx.save();
      var skyGrad = ctx.createRadialGradient(cx, cy, geom.innerR * 0.3, cx, cy, maxR);
      skyGrad.addColorStop(0, PALETTE.firmamentTwilight);
      skyGrad.addColorStop(0.55, PALETTE.firmamentMidnight);
      skyGrad.addColorStop(1, PALETTE.firmamentObsidian);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.42 + state.skyPhaseRad * 0.25);
      var bandGrad = ctx.createLinearGradient(0, -geom.outerR * 0.55, 0, geom.outerR * 0.55);
      bandGrad.addColorStop(0, 'rgba(106, 210, 229, 0)');
      bandGrad.addColorStop(0.5, 'rgba(106, 210, 229, 0.055)');
      bandGrad.addColorStop(1, 'rgba(106, 210, 229, 0)');
      ctx.fillStyle = bandGrad;
      ctx.fillRect(-maxR, -geom.outerR * 0.55, maxR * 2, geom.outerR * 1.1);
      ctx.restore();

      for (var i = 0; i < FIRMAMENT_STARS.length; i++) {
        var st = FIRMAMENT_STARS[i];
        var ang = st.angle + state.skyPhaseRad;
        var sr = st.distNorm * maxR;
        var sx = cx + Math.cos(ang) * sr;
        var sy = cy + Math.sin(ang) * sr;
        if (sx >= -4 && sx <= w + 4 && sy >= -4 && sy <= h + 4) {
          var pulse = ro.reducedMotion ? 0.85 : 0.65 + 0.35 * Math.sin(state.epicyclePhaseRad * 1.5 + st.twinklePhase);
          ctx.globalAlpha = clamp01(st.mag * pulse);
          ctx.fillStyle = st.tint;
          ctx.beginPath();
          ctx.arc(sx, sy, 0.7 + st.mag * 1.35, 0, TAU);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      ctx.strokeStyle = 'rgba(198, 154, 75, 0.28)';
      ctx.lineWidth = 1;
      var pad = 8;
      ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
      ctx.restore();
    }

    function drawBrassLimbAndZodiac(ctx, geom, ro) {
      var cx = geom.cx;
      var cy = geom.cy;
      var outerR = geom.outerR;
      var zodR = geom.zodiacOuterR;
      var cityR = geom.cityR;

      ctx.save();
      var crownY = cy - outerR * 1.03;
      ctx.strokeStyle = PALETTE.astrolabeBrass;
      ctx.lineWidth = Math.max(2, outerR * 0.014);
      ctx.beginPath();
      ctx.arc(cx, crownY, outerR * 0.042, 0, TAU);
      ctx.stroke();

      var limbGrad = ctx.createRadialGradient(cx, cy, zodR, cx, cy, outerR);
      limbGrad.addColorStop(0, PALETTE.brassTarnish);
      limbGrad.addColorStop(0.35, PALETTE.astrolabeBrass);
      limbGrad.addColorStop(0.72, PALETTE.brassHighlight);
      limbGrad.addColorStop(1, PALETTE.brassTarnish);

      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, TAU);
      ctx.arc(cx, cy, zodR, 0, TAU, true);
      ctx.fillStyle = limbGrad;
      ctx.fill();

      ctx.strokeStyle = PALETTE.parchmentInk;
      ctx.lineWidth = 1;
      for (var deg = 0; deg < 360; deg += 2) {
        var rad = -HALF_PI + degToRad(deg);
        var is30 = deg % 30 === 0;
        var is10 = deg % 10 === 0;
        var tickInner = is30 ? zodR : is10 ? outerR - (outerR - zodR) * 0.58 : outerR - (outerR - zodR) * 0.30;
        ctx.globalAlpha = is30 ? 0.92 : is10 ? 0.72 : 0.40;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(rad) * tickInner, cy + Math.sin(rad) * tickInner);
        ctx.lineTo(cx + Math.cos(rad) * (outerR * 0.992), cy + Math.sin(rad) * (outerR * 0.992));
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      for (var s = 0; s < geom.houseSectors.length; s++) {
        var sec = geom.houseSectors[s];
        var hz = ZODIAC_HOUSES[s];
        var isHi = ro.highlightedHouse === s;
        var isConfess = ro.forkVerdict === 'confessGodsOrderIsMonsters';

        ctx.beginPath();
        ctx.arc(cx, cy, zodR, sec.startRad, sec.endRad);
        ctx.arc(cx, cy, cityR, sec.endRad, sec.startRad, true);
        ctx.closePath();

        if (sec.consecrated) {
          ctx.fillStyle = isConfess
            ? 'rgba(106, 210, 229, 0.24)'
            : 'rgba(244, 200, 93, 0.20)';
        } else {
          ctx.fillStyle = 'rgba(14, 20, 36, 0.84)';
        }
        ctx.fill();

        ctx.strokeStyle = isHi
          ? PALETTE.constellationGlow
          : sec.consecrated ? PALETTE.solsticeGold : 'rgba(198, 154, 75, 0.42)';
        ctx.lineWidth = isHi ? 2.2 : sec.consecrated ? 1.35 : 0.9;
        ctx.stroke();

        var spanRad = (sec.endRad - sec.startRad) * 0.72;
        var bandHalf = (zodR - cityR) * 0.34;
        ctx.strokeStyle = sec.consecrated ? PALETTE.constellationCyan : 'rgba(166, 236, 250, 0.26)';
        ctx.lineWidth = sec.consecrated ? 1.1 : 0.7;
        ctx.beginPath();
        for (var k = 0; k < hz.stars.length; k++) {
          var sa = sec.midRad + hz.stars[k][0] * spanRad;
          var sr2 = sec.midR + hz.stars[k][1] * bandHalf;
          var px = cx + Math.cos(sa) * sr2;
          var py = cy + Math.sin(sa) * sr2;
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        for (var m = 0; m < hz.stars.length; m++) {
          var sa2 = sec.midRad + hz.stars[m][0] * spanRad;
          var sr3 = sec.midR + hz.stars[m][1] * bandHalf;
          ctx.fillStyle = sec.consecrated ? PALETTE.constellationGlow : 'rgba(215, 207, 184, 0.45)';
          ctx.beginPath();
          ctx.arc(cx + Math.cos(sa2) * sr3, cy + Math.sin(sa2) * sr3, sec.consecrated ? 1.9 : 1.2, 0, TAU);
          ctx.fill();
        }

        ctx.save();
        ctx.translate(sec.x, sec.y);
        ctx.fillStyle = sec.consecrated ? PALETTE.solsticeGold : PALETTE.limeMortar;
        ctx.font = '600 ' + Math.max(11, Math.round(outerR * 0.056)) + 'px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(hz.glyph + '\uFE0E', 0, 0);
        ctx.restore();

        ctx.save();
        ctx.translate(cx + Math.cos(sec.midRad) * (cityR * 1.015), cy + Math.sin(sec.midRad) * (cityR * 1.015));
        ctx.rotate(sec.midRad + HALF_PI);
        var pedW = Math.max(8, outerR * 0.045);
        var pedH = Math.max(4, outerR * 0.022);
        ctx.fillStyle = sec.consecrated ? PALETTE.solsticeGold : PALETTE.brassTarnish;
        ctx.beginPath();
        ctx.moveTo(-pedW, 0);
        ctx.lineTo(0, -pedH);
        ctx.lineTo(pedW, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.restore();
    }

    function drawCityPlanAndAstralCones(ctx, geom, ro) {
      var cx = geom.cx;
      var cy = geom.cy;
      var cityR = geom.cityR;
      var innerR = geom.innerR;
      var cellar01 = clamp01(ro.cellarReveal01 || 0);

      ctx.save();
      var groundGrad = ctx.createRadialGradient(cx, cy, innerR * 0.2, cx, cy, cityR);
      groundGrad.addColorStop(0, cellar01 > 0.05 ? '#241716' : '#1b2232');
      groundGrad.addColorStop(0.68, cellar01 > 0.05 ? '#19131a' : '#131927');
      groundGrad.addColorStop(1, '#0c101b');
      ctx.beginPath();
      ctx.arc(cx, cy, cityR, 0, TAU);
      ctx.fillStyle = groundGrad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(215, 207, 184, 0.12)';
      ctx.lineWidth = 0.85;
      var rings = [0.34, 0.54, 0.74, 0.90];
      for (var r = 0; r < rings.length; r++) {
        ctx.beginPath();
        ctx.arc(cx, cy, cityR * rings[r], 0, TAU);
        ctx.stroke();
      }
      for (var s = 0; s < 12; s++) {
        var sRad = -HALF_PI + s * (Math.PI / 6);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(sRad) * (innerR * 0.55), cy + Math.sin(sRad) * (innerR * 0.55));
        ctx.lineTo(cx + Math.cos(sRad) * cityR, cy + Math.sin(sRad) * cityR);
        ctx.stroke();
      }

      var umbraGate = geom.gatePositions.lunarUmbraTower;
      var oppRad = umbraGate.targetAngleRad + Math.PI;
      var coneSpread = (0.28 - 0.14 * state.eclipseTuning) * cityR;
      var perpRad = umbraGate.angleRad + HALF_PI;
      var ux0 = cx + Math.cos(oppRad) * (cityR * 0.62);
      var uy0 = cy + Math.sin(oppRad) * (cityR * 0.62);
      var umbraGrad = ctx.createLinearGradient(ux0, uy0, umbraGate.x, umbraGate.y);
      umbraGrad.addColorStop(0, 'rgba(77, 35, 24, 0.08)');
      umbraGrad.addColorStop(0.65, 'rgba(143, 65, 38, 0.30)');
      umbraGrad.addColorStop(1, 'rgba(143, 65, 38, 0.46)');
      ctx.fillStyle = umbraGrad;
      ctx.beginPath();
      ctx.moveTo(ux0 + Math.cos(perpRad) * coneSpread, uy0 + Math.sin(perpRad) * coneSpread);
      ctx.lineTo(umbraGate.x + Math.cos(perpRad) * (coneSpread * 0.18), umbraGate.y + Math.sin(perpRad) * (coneSpread * 0.18));
      ctx.lineTo(umbraGate.x - Math.cos(perpRad) * (coneSpread * 0.18), umbraGate.y - Math.sin(perpRad) * (coneSpread * 0.18));
      ctx.lineTo(ux0 - Math.cos(perpRad) * coneSpread, uy0 - Math.sin(perpRad) * coneSpread);
      ctx.closePath();
      ctx.fill();

      var riseGate = geom.gatePositions.solsticeRiseGate;
      var setGate = geom.gatePositions.solsticeSetGate;
      var ctrlY = cy - cityR * 0.72;
      ctx.strokeStyle = PALETTE.solsticeGold;
      ctx.lineWidth = 1.65;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(setGate.x, setGate.y);
      ctx.quadraticCurveTo(cx, ctrlY, riseGate.x, riseGate.y);
      ctx.stroke();
      ctx.setLineDash([]);

      var sunT = 0.5 + 0.22 * Math.sin(state.skyPhaseRad * 2.0);
      var omt = 1 - sunT;
      var sunX = omt * omt * setGate.x + 2 * omt * sunT * cx + sunT * sunT * riseGate.x;
      var sunY = omt * omt * setGate.y + 2 * omt * sunT * ctrlY + sunT * sunT * riseGate.y;
      ctx.fillStyle = PALETTE.solsticeGold;
      ctx.beginPath();
      ctx.arc(sunX, sunY, Math.max(4, cityR * 0.028), 0, TAU);
      ctx.fill();
      ctx.strokeStyle = 'rgba(244, 200, 93, 0.45)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(sunX, sunY, Math.max(7, cityR * 0.048), 0, TAU);
      ctx.stroke();

      var conjGate = geom.gatePositions.greatConjunctionTower;
      var defDist = cityR * 0.56;
      var defX = cx + Math.cos(conjGate.angleRad) * defDist;
      var defY = cy + Math.sin(conjGate.angleRad) * defDist;
      var epiR = Math.max(9, cityR * 0.085);
      ctx.strokeStyle = 'rgba(106, 210, 229, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(defX, defY, epiR, 0, TAU);
      ctx.stroke();

      var sep = (1 - state.eclipseTuning) * 1.45;
      var p1a = state.epicyclePhaseRad;
      var p2a = state.epicyclePhaseRad + sep;
      var jx = defX + Math.cos(p1a) * epiR;
      var jy = defY + Math.sin(p1a) * epiR;
      var sx2 = defX + Math.cos(p2a) * (epiR * 0.76);
      var sy2 = defY + Math.sin(p2a) * (epiR * 0.76);
      ctx.fillStyle = PALETTE.constellationGlow;
      ctx.beginPath();
      ctx.arc(jx, jy, 2.8, 0, TAU);
      ctx.fill();
      ctx.fillStyle = PALETTE.solsticeGold;
      ctx.beginPath();
      ctx.arc(sx2, sy2, 2.5, 0, TAU);
      ctx.fill();

      ctx.strokeStyle = PALETTE.astrolabeBrass;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(cx, cy, cityR, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    function drawAvenue(ctx, geom, angleRad, label, aligned) {
      var cityR = geom.cityR;
      var zodR = geom.zodiacOuterR;
      var halfW = Math.max(4.5, cityR * 0.036);

      ctx.save();
      ctx.translate(geom.cx, geom.cy);
      ctx.rotate(angleRad);

      ctx.fillStyle = 'rgba(223, 216, 197, 0.88)';
      ctx.fillRect(-cityR, -halfW, cityR * 2, halfW * 2);

      ctx.strokeStyle = aligned ? PALETTE.solsticeGold : PALETTE.stoneAshlar;
      ctx.lineWidth = aligned ? 1.6 : 1.1;
      ctx.strokeRect(-cityR, -halfW, cityR * 2, halfW * 2);

      ctx.fillStyle = PALETTE.parchmentInk;
      var stepDist = Math.max(12, cityR * 0.14);
      for (var d = -cityR * 0.86; d <= cityR * 0.86; d += stepDist) {
        if (Math.abs(d) >= geom.innerR * 0.38) {
          ctx.beginPath();
          ctx.arc(d, -halfW * 0.72, 1.3, 0, TAU);
          ctx.arc(d, halfW * 0.72, 1.3, 0, TAU);
          ctx.fill();
        }
      }

      var dirs = [-1, 1];
      for (var k = 0; k < 2; k++) {
        var sgn = dirs[k];
        ctx.fillStyle = aligned ? PALETTE.solsticeGold : PALETTE.astrolabeBrass;
        ctx.beginPath();
        ctx.moveTo(sgn * cityR, -halfW * 0.85);
        ctx.lineTo(sgn * (zodR * 0.995), 0);
        ctx.lineTo(sgn * cityR, halfW * 0.85);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = PALETTE.parchmentInk;
      ctx.font = '700 ' + Math.max(8, Math.round(cityR * 0.042)) + 'px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, cityR * 0.54, 0);
      ctx.restore();
    }

    function drawCardoDecumanusAndGates(ctx, geom) {
      var cx = geom.cx;
      var cy = geom.cy;
      var cityR = geom.cityR;
      var forumR = geom.innerR * 0.36;

      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(106, 210, 229, 0.42)';
      ctx.beginPath();
      ctx.moveTo(cx, cy - cityR);
      ctx.lineTo(cx, cy + cityR);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(244, 200, 93, 0.42)';
      ctx.beginPath();
      ctx.moveTo(cx - cityR, cy);
      ctx.lineTo(cx + cityR, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      drawAvenue(ctx, geom, geom.decumanusAngleRad, 'DECUMANUS', Math.abs(state.decumanusOffsetDeg) < 0.25);
      drawAvenue(ctx, geom, geom.cardoAngleRad, 'CARDO', Math.abs(state.cardoOffsetDeg) < 0.25);

      ctx.fillStyle = PALETTE.marblePaving;
      ctx.strokeStyle = PALETTE.astrolabeBrass;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (var v = 0; v < 8; v++) {
        var va = v * (Math.PI / 4) + Math.PI / 8;
        var vx = cx + Math.cos(va) * forumR;
        var vy = cy + Math.sin(va) * forumR;
        if (v === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = state.syzygyLocked ? PALETTE.constellationCyan : PALETTE.astrolabeBrass;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(3.5, forumR * 0.26), 0, TAU);
      ctx.fill();

      for (var g = 0; g < geom.gatePositions.length; g++) {
        var gp = geom.gatePositions[g];
        ctx.strokeStyle = gp.locked ? PALETTE.solsticeGold : PALETTE.eclipseUmbraCopper;
        ctx.lineWidth = gp.locked ? 1.6 : 1.15;
        ctx.setLineDash(gp.locked ? [] : [3, 3]);
        ctx.beginPath();
        ctx.moveTo(gp.x, gp.y);
        ctx.lineTo(gp.skyX, gp.skyY);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.save();
        ctx.translate(gp.x, gp.y);
        ctx.rotate(gp.angleRad);
        var gw = Math.max(7, cityR * 0.048);
        ctx.fillStyle = gp.locked ? PALETTE.solsticeGold : PALETTE.limeMortar;
        ctx.strokeStyle = PALETTE.parchmentInk;
        ctx.lineWidth = 1.2;
        if (gp.kind === 'gate') {
          ctx.fillRect(-gw * 0.55, -gw * 0.95, gw * 1.1, gw * 0.55);
          ctx.strokeRect(-gw * 0.55, -gw * 0.95, gw * 1.1, gw * 0.55);
          ctx.fillRect(-gw * 0.55, gw * 0.40, gw * 1.1, gw * 0.55);
          ctx.strokeRect(-gw * 0.55, gw * 0.40, gw * 1.1, gw * 0.55);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, gw * 0.68, 0, TAU);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.restore();
    }

    function drawObservatoryForkOverlay(ctx, geom, ro) {
      var cx = geom.cx;
      var cy = geom.cy;
      var outerR = geom.outerR;
      var zodR = geom.zodiacOuterR;

      ctx.save();
      var cardinals = [
        { txt: 'N', rad: -HALF_PI },
        { txt: 'E', rad: 0 },
        { txt: 'S', rad: HALF_PI },
        { txt: 'W', rad: Math.PI }
      ];
      ctx.font = '700 ' + Math.max(9, Math.round(outerR * 0.042)) + 'px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (var c = 0; c < cardinals.length; c++) {
        var cr = cardinals[c].rad;
        var bx = cx + Math.cos(cr) * (outerR * 0.955);
        var by = cy + Math.sin(cr) * (outerR * 0.955);
        ctx.fillStyle = PALETTE.parchmentInk;
        ctx.beginPath();
        ctx.arc(bx, by, Math.max(7, outerR * 0.032), 0, TAU);
        ctx.fill();
        ctx.fillStyle = PALETTE.solsticeGold;
        ctx.fillText(cardinals[c].txt, bx, by);
      }

      if (ro.forkVerdict === 'admitCalculationsWrong') {
        var slashAngles = [-2.55, -1.75, -0.62, 0.48, 1.35, 2.38];
        for (var i = 0; i < slashAngles.length; i++) {
          var a = slashAngles[i];
          var rMid = (zodR + outerR) * 0.5;
          var span = (outerR - zodR) * 1.15;
          var mx = cx + Math.cos(a) * rMid;
          var my = cy + Math.sin(a) * rMid;
          ctx.save();
          ctx.translate(mx, my);
          ctx.rotate(a);
          ctx.strokeStyle = PALETTE.bloodErrataBright;
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(-span, -span * 0.85);
          ctx.lineTo(span, span * 0.85);
          ctx.moveTo(-span, span * 0.85);
          ctx.lineTo(span, -span * 0.85);
          ctx.stroke();
          ctx.restore();
        }

        var bw = Math.min(geom.width * 0.72, Math.max(156, outerR * 0.86));
        var bh = Math.max(24, outerR * 0.11);
        var bx0 = cx - bw * 0.5;
        var by0 = Math.max(10, cy - outerR * 0.58 - bh * 0.5);
        ctx.fillStyle = 'rgba(239, 227, 196, 0.94)';
        ctx.strokeStyle = PALETTE.bloodErrata;
        ctx.lineWidth = 1.8;
        ctx.fillRect(bx0, by0, bw, bh);
        ctx.strokeRect(bx0, by0, bw, bh);

        ctx.fillStyle = PALETTE.bloodErrata;
        ctx.font = '700 ' + Math.max(9, Math.round(bh * 0.44)) + 'px Georgia, serif';
        ctx.fillText('ERRATA CLAIMED  \u00B7  0.00" SKY ERROR', cx, by0 + bh * 0.52);
      }
      ctx.restore();
    }

    function renderSkyAndPlan(ctx, w, h, opts2) {
      if (!ctx) return null;
      var ro = opts2 || {};
      var geom = getGeometry(w, h);
      ctx.save();
      drawFirmamentAndStars(ctx, geom, ro);
      drawBrassLimbAndZodiac(ctx, geom, ro);
      drawCityPlanAndAstralCones(ctx, geom, ro);
      drawCardoDecumanusAndGates(ctx, geom);
      drawObservatoryForkOverlay(ctx, geom, ro);
      ctx.restore();
      return geom;
    }

    return {
      setCardoOffset: setCardoOffset,
      setDecumanusOffset: setDecumanusOffset,
      setEclipseTuning: setEclipseTuning,
      toggleHouse: toggleHouse,
      consecrateAllHouses: consecrateAllHouses,
      alignSolsticeAxes: alignSolsticeAxes,
      alignFullFirmament: alignFullFirmament,
      perturbAxes: perturbAxes,
      hitTest: hitTest,
      getGeometry: getGeometry,
      step: step,
      renderSkyAndPlan: renderSkyAndPlan,
      unlockAudio: audio.unlockAudio,
      setMuted: audio.setMuted,
      isMuted: audio.isMuted,
      playVernierTick: audio.playVernierTick,
      playSolsticeChord: audio.playSolsticeChord,
      playCellarResonance: audio.playCellarResonance,
      getState: getState,
      reset: reset
    };
  }

  global.PerinthiaZodiacFounding = Object.freeze({
    PALETTE: PALETTE,
    ZODIAC_HOUSES: ZODIAC_HOUSES,
    ECLIPSE_GATES: ECLIPSE_GATES,
    createFoundingAstrolabe: createFoundingAstrolabe
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
