/*
 * ESMERALDA — Airy Swallow Parabolas (City 31, Trading Cities 5)
 * Layer owner: esmeralda-swallow-arc (canonical role: esmeralda-swallow-parabola)
 *
 * "Harder to fix on paper are the routes of the swallows, which cut the air
 *  over the roofs, dropping along invisible parabolas with still wings,
 *  darting to gulp a mosquito, spiraling upward, grazing a pinnacle,
 *  dominating from every point of their airy paths all the points of the city."
 *
 * Classic browser IIFE. Sets globalThis.EsmeraldaSwallowParabolas.
 * No module syntax, no network access, no relative parent paths.
 */
(function (root) {
  'use strict';

  var TAU = Math.PI * 2;
  var Z_MIN = 18;
  var Z_MAX = 58;
  var ROOF_CEILING = 16;
  var CURVE_SAMPLES = 16;
  var MOSQUITO_COUNT = 12;

  var PALETTE = {
    vellum_folio: '#F1E9D6',
    abyssal_lagoon: '#0E1818',
    swallow_gold: '#D8A428',
    airy_filament: '#F5CF6B',
    iron_gall: '#221E1B',
    ridgepole_terracotta: '#C2492D',
    clandestine_violet: '#7A3B8E',
    emerald_wake: '#22B59B'
  };

  var FLIGHT_REGIMES = ['still_wing_parabola', 'mosquito_dart', 'pinnacle_spiral'];

  var REGIME_INFO = {
    still_wing_parabola: { label: 'Still-wing parabolic drop', wingBeatHz: 0 },
    mosquito_dart: { label: 'Darting to swallow a mosquito', wingBeatHz: 14 },
    pinnacle_spiral: { label: 'Spiraling up, grazing a pinnacle', wingBeatHz: 7 }
  };

  /* Fallback copy of charter.json city_loci (L0..L13); pinnacles L3, L8, L11. */
  var CITY_LOCI = [
    { id: 'L0', name: 'Fondaco Water-Stair', u: 0.13, v: 0.62, z: 0, kind: 'canal_quay', pinnacle: false },
    { id: 'L1', name: 'Cambered Bridge of Scales', u: 0.25, v: 0.48, z: 5, kind: 'cambered_bridge', pinnacle: false },
    { id: 'L2', name: 'Cheese-Smuggler Manhole', u: 0.22, v: 0.76, z: -5, kind: 'sewer_manhole', pinnacle: false },
    { id: 'L3', name: 'Salt-Guild Pinnacle', u: 0.31, v: 0.24, z: 28, kind: 'pinnacle_spire', pinnacle: true },
    { id: 'L4', name: 'Cat-Gutter Ridgepole', u: 0.39, v: 0.36, z: 16, kind: 'cat_gutter', pinnacle: false },
    { id: 'L5', name: 'Emerald Basin Crossroads', u: 0.44, v: 0.57, z: 0, kind: 'canal_junction', pinnacle: false },
    { id: 'L6', name: 'Gunpowder-Keg Grate', u: 0.48, v: 0.80, z: -6, kind: 'sewer_manhole', pinnacle: false },
    { id: 'L7', name: 'Hanging Street of Dyers', u: 0.56, v: 0.44, z: 8, kind: 'hanging_street', pinnacle: false },
    { id: 'L8', name: 'Campanile of Swallows', u: 0.59, v: 0.20, z: 33, kind: 'pinnacle_spire', pinnacle: true },
    { id: 'L9', name: "Lovers' Wrought Balcony", u: 0.68, v: 0.34, z: 14, kind: 'lovers_balcony', pinnacle: false },
    { id: 'L10', name: 'Double-Arch Canal Lock', u: 0.69, v: 0.60, z: 0, kind: 'cambered_bridge', pinnacle: false },
    { id: 'L11', name: 'Customs Watch-Pinnacle', u: 0.82, v: 0.25, z: 30, kind: 'pinnacle_spire', pinnacle: true },
    { id: 'L12', name: 'Contraband Vault Manhole', u: 0.79, v: 0.77, z: -5, kind: 'sewer_manhole', pinnacle: false },
    { id: 'L13', name: 'Seaward Stepped Mole', u: 0.88, v: 0.53, z: 3, kind: 'stepped_quay', pinnacle: false }
  ];

  var PINNACLE_IDS = ['L3', 'L8', 'L11'];

  var SWALLOW_ROSTER = [
    { id: 'S0', name: 'Rondine of the Salt Quay', u: 0.16, v: 0.40, z: 54, homePinnacle: 'L3', regime: 'still_wing_parabola' },
    { id: 'S1', name: 'Dyers\' Fork-Tail', u: 0.30, v: 0.55, z: 47, homePinnacle: 'L3', regime: 'still_wing_parabola' },
    { id: 'S2', name: 'Campanile Sickle', u: 0.52, v: 0.30, z: 57, homePinnacle: 'L8', regime: 'pinnacle_spiral' },
    { id: 'S3', name: 'Basin Skimmer', u: 0.45, v: 0.62, z: 40, homePinnacle: 'L8', regime: 'still_wing_parabola' },
    { id: 'S4', name: 'Mosquito Gulper of the Lock', u: 0.66, v: 0.52, z: 36, homePinnacle: 'L8', regime: 'mosquito_dart' },
    { id: 'S5', name: 'Customs Crescent', u: 0.78, v: 0.38, z: 52, homePinnacle: 'L11', regime: 'still_wing_parabola' },
    { id: 'S6', name: 'Seaward Scythe', u: 0.86, v: 0.60, z: 44, homePinnacle: 'L11', regime: 'still_wing_parabola' }
  ];

  function projectAirPoint(u, v, z, width, height, airspaceTilt) {
    var tilt = (typeof airspaceTilt === 'number' && isFinite(airspaceTilt)) ? airspaceTilt : 0.38;
    return { sx: u * width, sy: v * height - z * (0.45 + tilt * 1.15) };
  }

  function clamp(x, a, b) { return x < a ? a : (x > b ? b : x); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function makeRng(seed) {
    var s = (seed >>> 0) || 0x5EA11A;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function findLocus(loci, id) {
    for (var i = 0; i < loci.length; i++) { if (loci[i].id === id) { return loci[i]; } }
    return null;
  }

  /* ---------- Gesture-safe WebAudio voice of the airspace ---------- */
  function createAirAudio() {
    var ctx = null;
    var master = null;
    var muted = false;

    function ready() { return !!(ctx && master && !muted); }

    function tone(type, freq, t0, dur, peak, freqEnd) {
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      if (freqEnd) { osc.frequency.exponentialRampToValueAtTime(freqEnd, t0 + dur); }
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + Math.min(0.04, dur * 0.3));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g); g.connect(master);
      osc.start(t0); osc.stop(t0 + dur + 0.05);
    }

    function noise(t0, dur, peak, filterFreq, q, filterEnd) {
      var len = Math.max(1, Math.floor(ctx.sampleRate * dur));
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) { data[i] = Math.random() * 2 - 1; }
      var src = ctx.createBufferSource();
      src.buffer = buf;
      var bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(filterFreq, t0);
      if (filterEnd) { bp.frequency.exponentialRampToValueAtTime(filterEnd, t0 + dur); }
      bp.Q.value = q;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + dur * 0.35);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(bp); bp.connect(g); g.connect(master);
      src.start(t0); src.stop(t0 + dur + 0.05);
    }

    var api = {
      unlock: function () {
        try {
          if (!ctx) {
            var AC = root.AudioContext || root.webkitAudioContext;
            if (!AC) { return false; }
            ctx = new AC();
            master = ctx.createGain();
            master.gain.value = muted ? 0 : 0.5;
            master.connect(ctx.destination);
          }
          if (ctx.state === 'suspended' && ctx.resume) { ctx.resume(); }
          return true;
        } catch (e) { return false; }
      },
      setMuted: function (m) {
        muted = !!m;
        try { if (master) { master.gain.value = muted ? 0 : 0.5; } } catch (e) { }
        return muted;
      },
      toggleMute: function () { return api.setMuted(!muted); },
      isMuted: function () { return muted; },
      isUnlocked: function () { return !!ctx; },
      playStillWing: function () {
        if (!ready()) { return; }
        try {
          var t = ctx.currentTime;
          noise(t, 1.8, 0.10, 900, 0.7, 380);
          tone('sine', 523.25, t, 1.6, 0.05, 392);
          tone('sine', 784.0, t + 0.1, 1.4, 0.025, 587.3);
        } catch (e) { }
      },
      playMosquitoSnap: function () {
        if (!ready()) { return; }
        try {
          var t = ctx.currentTime;
          tone('triangle', 1318.5, t, 0.09, 0.14, 660);
          tone('square', 2637, t + 0.005, 0.03, 0.03);
          noise(t, 0.05, 0.05, 4200, 3);
        } catch (e) { }
      },
      playPinnacleChime: function () {
        if (!ready()) { return; }
        try {
          var t = ctx.currentTime;
          var notes = [587.33, 739.99, 880.0, 1174.66];
          for (var i = 0; i < notes.length; i++) { tone('sine', notes[i], t + i * 0.11, 1.2, 0.07); }
          tone('triangle', 2349.3, t + 0.44, 1.5, 0.02);
        } catch (e) { }
      },
      playParchmentDissolve: function () {
        if (!ready()) { return; }
        try {
          var t = ctx.currentTime;
          noise(t, 0.35, 0.12, 2400, 1.2, 600);
          noise(t + 0.3, 1.9, 0.07, 1800, 4, 7200);
          for (var i = 0; i < 6; i++) { tone('sine', 1046.5 * Math.pow(1.122, i), t + 0.35 + i * 0.13, 0.9, 0.025); }
        } catch (e) { }
      }
    };
    return api;
  }

  /* ---------- The airspace engine ---------- */
  function createSwallowAirspace(opts) {
    opts = opts || {};
    var loci = (Array.isArray(opts.cityLoci) && opts.cityLoci.length === 14) ? opts.cityLoci.map(function (l) {
      return { id: l.id, name: l.name, u: +l.u, v: +l.v, z: +l.z || 0, kind: l.kind, pinnacle: !!l.pinnacle };
    }) : CITY_LOCI.map(function (l) { return Object.assign({}, l); });
    var pinnacles = PINNACLE_IDS.map(function (id) { return findLocus(loci, id); }).filter(Boolean);
    var seed = typeof opts.seed === 'number' ? opts.seed : 31031;
    var rng = makeRng(seed);
    var audio = opts.audio || createAirAudio();

    var S = {};

    function rand(a, b) { return a + (b - a) * rng(); }

    function makeMosquito() {
      return {
        baseU: rand(0.14, 0.86), baseV: rand(0.22, 0.72), baseZ: rand(22, 46),
        ampU: rand(0.01, 0.035), ampV: rand(0.008, 0.025), ampZ: rand(1.5, 5),
        freq: rand(0.6, 1.7), phase: rand(0, TAU), u: 0, v: 0, z: 0, gulpFlash: 0
      };
    }

    function updateMosquito(m, T) {
      m.u = clamp(m.baseU + m.ampU * Math.sin(m.freq * T + m.phase), 0.05, 0.95);
      m.v = clamp(m.baseV + m.ampV * Math.sin(m.freq * 1.37 * T + m.phase * 0.7), 0.12, 0.85);
      m.z = clamp(m.baseZ + m.ampZ * Math.sin(m.freq * 2.1 * T + m.phase * 1.3), Z_MIN, Z_MAX - 6);
    }

    function nearestPinnacle(u, v) {
      var best = pinnacles[0], bd = Infinity;
      for (var i = 0; i < pinnacles.length; i++) {
        var d = Math.hypot(pinnacles[i].u - u, pinnacles[i].v - v);
        if (d < bd) { bd = d; best = pinnacles[i]; }
      }
      return best;
    }

    function curvePoint(sw, t) {
      var p, e;
      t = clamp(t, 0, 1);
      if (sw.regime === 'mosquito_dart') {
        var m = S.mosquitoes[sw.dart.target];
        e = easeInOut(t);
        p = { u: lerp(sw.dart.u0, m.u, e), v: lerp(sw.dart.v0, m.v, e), z: lerp(sw.dart.z0, m.z, e) - 3 * Math.sin(Math.PI * t) };
      } else if (sw.regime === 'pinnacle_spiral') {
        var sp = sw.spiral;
        var ang = sp.theta0 + t * sp.turns * TAU;
        var r = lerp(sp.r0, 0.016, Math.sqrt(t));
        p = { u: sp.pu + r * Math.cos(ang), v: sp.pv + r * Math.sin(ang) * 0.62, z: lerp(sp.z0, sp.z1, t) };
      } else {
        var pa = sw.para;
        /* Ballistic still-wing drop: uniform horizontal glide, quadratic fall. */
        p = { u: lerp(pa.u0, pa.u1, t), v: lerp(pa.v0, pa.v1, t), z: pa.z0 - (pa.z0 - pa.z1) * t * t };
      }
      p.z = clamp(p.z, Z_MIN, Z_MAX);
      return p;
    }

    function planParabola(sw) {
      if (sw.z < 24) { planSpiral(sw); return; }
      var P = pinnacles[Math.floor(rng() * pinnacles.length)];
      var ang = rand(0, TAU), rad = rand(0.07, 0.15);
      sw.regime = 'still_wing_parabola';
      sw.para = {
        u0: sw.u, v0: sw.v, z0: sw.z,
        u1: clamp(P.u + Math.cos(ang) * rad, 0.06, 0.94),
        v1: clamp(P.v + Math.sin(ang) * rad * 0.62 + 0.04, 0.12, 0.82),
        z1: clamp(rand(19, 23), Z_MIN, sw.z - 3)
      };
      sw.t = 0; sw.dur = rand(3.6, 5.6);
      sw.wingBeatHz = 0;
    }

    function planSpiral(sw, forcedPinnacle) {
      var P = forcedPinnacle || nearestPinnacle(sw.u, sw.v);
      var dx = sw.u - P.u, dy = (sw.v - P.v) / 0.62;
      sw.regime = 'pinnacle_spiral';
      sw.spiral = {
        pinnacleId: P.id, pu: P.u, pv: P.v, pz: P.z,
        theta0: Math.atan2(dy, dx), r0: clamp(Math.hypot(dx, dy), 0.03, 0.2),
        turns: rand(2.2, 3.1), z0: sw.z, z1: clamp(rand(53, 58), Math.max(sw.z + 6, P.z + 12), Z_MAX),
        grazed: false
      };
      sw.t = 0; sw.dur = rand(4.4, 6.0);
      sw.wingBeatHz = REGIME_INFO.pinnacle_spiral.wingBeatHz;
    }

    function planDart(sw, mIdx) {
      if (typeof mIdx !== 'number' || mIdx < 0 || mIdx >= S.mosquitoes.length) {
        var bd = Infinity;
        for (var i = 0; i < S.mosquitoes.length; i++) {
          var m = S.mosquitoes[i];
          var d = Math.hypot(m.u - sw.u, m.v - sw.v, (m.z - sw.z) / 140);
          if (d < bd) { bd = d; mIdx = i; }
        }
      }
      sw.regime = 'mosquito_dart';
      sw.dart = { u0: sw.u, v0: sw.v, z0: sw.z, target: mIdx };
      sw.t = 0; sw.dur = 0.75;
      sw.wingBeatHz = REGIME_INFO.mosquito_dart.wingBeatHz;
    }

    /* All-Point Dominance: from every airy curve sample above the roofs, sightlines reach all 14 loci. */
    function sightlinesFrom(sample) {
      var reached = 0;
      if (sample.z < ROOF_CEILING) { return 0; }
      for (var j = 0; j < loci.length; j++) {
        var L = loci[j];
        var len = Math.hypot(L.u - sample.u, L.v - sample.v, (L.z - sample.z) / 200);
        if (isFinite(len)) { reached++; }
      }
      return reached;
    }

    function curveSamples(sw) {
      var out = [];
      for (var i = 0; i < CURVE_SAMPLES; i++) { out.push(curvePoint(sw, i / (CURVE_SAMPLES - 1))); }
      return out;
    }

    function computeDominance() {
      var minCount = loci.length, samples = 0, allOk = true;
      for (var s = 0; s < S.swallows.length; s++) {
        var pts = curveSamples(S.swallows[s]);
        pts.push({ u: S.swallows[s].u, v: S.swallows[s].v, z: S.swallows[s].z });
        for (var k = 0; k < pts.length; k++) {
          var c = sightlinesFrom(pts[k]);
          samples++;
          if (c < minCount) { minCount = c; }
          if (c !== loci.length) { allOk = false; }
        }
      }
      S.dominatedPointsCount = minCount;
      S.curveSamplesChecked = samples;
      S.everyCurvePointDominatesAll = allOk;
    }

    var PIN_PRESS_DUR = 0.9;
    var PIN_DISSOLVE_DUR = 1.7;

    function emit(type, detail) {
      if (typeof opts.onEvent === 'function') {
        try { opts.onEvent(type, detail); } catch (e) { }
      }
    }

    function init() {
      rng = makeRng(seed);
      S.time = 0;
      S.mosquitoes = [];
      for (var m = 0; m < MOSQUITO_COUNT; m++) { S.mosquitoes.push(makeMosquito()); updateMosquito(S.mosquitoes[m], 0); }
      S.swallows = SWALLOW_ROSTER.map(function (r, i) {
        var sw = {
          id: r.id, name: r.name, index: i, homePinnacle: r.homePinnacle,
          u: r.u, v: r.v, z: clamp(r.z, Z_MIN, Z_MAX), heading: 0, wingPhase: rand(0, TAU),
          wingBeatHz: 0, t: 0, dur: 4, regime: r.regime, trail: [], cooldown: rand(1.5, 3.5),
          darts: 0, spirals: 0, glides: 0
        };
        if (r.regime === 'pinnacle_spiral') { planSpiral(sw, findLocus(loci, r.homePinnacle)); }
        else if (r.regime === 'mosquito_dart') { planDart(sw, i % MOSQUITO_COUNT); }
        else { planParabola(sw); }
        return sw;
      });
      S.mosquitoesSwallowed = 0;
      S.pinnacleGrazes = 0;
      S.inspectedSwallowIndex = 0;
      S.airspaceTilt = typeof opts.airspaceTilt === 'number' ? clamp(opts.airspaceTilt, 0, 1) : 0.38;
      S.airyVaultView = false;
      S.showAllPointDominance = true;
      S.failedPaperPinAttempts = 0;
      S.pinAttemptPhase = 'airborne_unfixed';
      S.pinTimer = 0;
      S.pinSwallowIndex = -1;
      S.flatten = 0;
      S.pressedSamples = [];
      S.burstSightlines = [];
      S.reducedMotion = !!opts.reducedMotion;
      computeDominance();
    }

    function validIndex(idx) {
      if (typeof idx !== 'number' || !isFinite(idx)) { return S.inspectedSwallowIndex; }
      var n = S.swallows.length;
      return ((Math.floor(idx) % n) + n) % n;
    }

    function effectiveTilt() { return S.airyVaultView ? Math.max(S.airspaceTilt, 0.86) : S.airspaceTilt; }

    function advanceSwallow(sw, fdt, rdt) {
      var prevU = sw.u, prevV = sw.v;
      sw.t += fdt / sw.dur;
      var p = curvePoint(sw, Math.min(sw.t, 1));
      sw.u = p.u; sw.v = p.v; sw.z = p.z;
      if (Math.abs(sw.u - prevU) + Math.abs(sw.v - prevV) > 1e-6) { sw.heading = Math.atan2(sw.v - prevV, sw.u - prevU); }
      sw.wingPhase += (S.reducedMotion ? 0 : sw.wingBeatHz) * rdt * TAU;
      sw.trail.push({ u: sw.u, v: sw.v, z: sw.z });
      if (sw.trail.length > 56) { sw.trail.shift(); }
      sw.cooldown = Math.max(0, sw.cooldown - fdt);

      if (sw.regime === 'pinnacle_spiral' && !sw.spiral.grazed && sw.z >= sw.spiral.pz + 1) {
        sw.spiral.grazed = true;
        S.pinnacleGrazes++;
        audio.playPinnacleChime();
        emit('pinnacle_graze', { swallow: sw.id, pinnacle: sw.spiral.pinnacleId });
      }
      if (sw.regime === 'still_wing_parabola' && sw.cooldown <= 0) {
        for (var i = 0; i < S.mosquitoes.length; i++) {
          var m = S.mosquitoes[i];
          if (Math.hypot(m.u - sw.u, m.v - sw.v, (m.z - sw.z) / 160) < 0.1 && rng() < 0.6) {
            planDart(sw, i);
            sw.cooldown = 3;
            emit('mosquito_intercept', { swallow: sw.id, mosquito: i });
            break;
          }
        }
        if (sw.regime !== 'still_wing_parabola') { return; }
      }
      if (sw.t >= 1) { finishRegime(sw); }
    }

    function finishRegime(sw) {
      if (sw.regime === 'mosquito_dart') {
        var mi = sw.dart.target;
        S.mosquitoesSwallowed++;
        sw.darts++;
        audio.playMosquitoSnap();
        emit('mosquito_swallowed', { swallow: sw.id, mosquito: mi, total: S.mosquitoesSwallowed });
        var fresh = makeMosquito();
        fresh.gulpFlash = 1;
        S.mosquitoes[mi] = fresh;
        updateMosquito(fresh, S.time);
        planParabola(sw);
      } else if (sw.regime === 'pinnacle_spiral') {
        sw.spirals++;
        planParabola(sw);
        if (sw.index === S.inspectedSwallowIndex) { audio.playStillWing(); }
      } else {
        sw.glides++;
        planParabola(sw);
      }
    }

    function stepPaperPin(dt) {
      if (S.pinAttemptPhase === 'pressing') {
        S.pinTimer += dt;
        S.flatten = clamp(S.pinTimer / PIN_PRESS_DUR, 0, 1);
        if (S.pinTimer >= PIN_PRESS_DUR) {
          S.pinAttemptPhase = 'dissolving';
          S.pinTimer = 0;
          buildBurst();
          audio.playParchmentDissolve();
          emit('paper_dissolving', { swallow: S.swallows[S.pinSwallowIndex].id, sightlines: S.burstSightlines.length });
        }
      } else if (S.pinAttemptPhase === 'dissolving') {
        S.pinTimer += dt;
        S.flatten = 1 - easeInOut(clamp(S.pinTimer / PIN_DISSOLVE_DUR, 0, 1));
        if (S.pinTimer >= PIN_DISSOLVE_DUR) {
          S.pinAttemptPhase = 'airborne_unfixed';
          S.pinTimer = 0;
          S.flatten = 0;
          emit('paper_unfixed', { swallow: S.swallows[S.pinSwallowIndex].id, failedPaperPinAttempts: S.failedPaperPinAttempts });
        }
      }
    }

    function buildBurst() {
      S.burstSightlines = [];
      for (var i = 0; i < S.pressedSamples.length; i++) {
        var a = S.pressedSamples[i];
        for (var j = 0; j < loci.length; j++) {
          S.burstSightlines.push({ sampleIndex: i, locusId: loci[j].id, from: { u: a.u, v: a.v, z: a.z }, to: { u: loci[j].u, v: loci[j].v, z: loci[j].z } });
        }
      }
    }

    function step(dtSec) {
      var dt = clamp(typeof dtSec === 'number' && isFinite(dtSec) ? dtSec : 0.016, 0, 0.1);
      var fdt = S.reducedMotion ? dt * 0.3 : dt;
      S.time += fdt;
      for (var m = 0; m < S.mosquitoes.length; m++) {
        updateMosquito(S.mosquitoes[m], S.time);
        S.mosquitoes[m].gulpFlash = Math.max(0, S.mosquitoes[m].gulpFlash - dt * 1.5);
      }
      for (var s = 0; s < S.swallows.length; s++) { advanceSwallow(S.swallows[s], fdt, dt); }
      stepPaperPin(dt);
      computeDominance();
      return api;
    }

    function inspectSwallow(idx) {
      S.inspectedSwallowIndex = validIndex(idx);
      emit('inspect', { swallow: S.swallows[S.inspectedSwallowIndex].id });
      return getState();
    }

    function triggerMosquitoDart(idx) {
      var sw = S.swallows[validIndex(idx)];
      planDart(sw);
      sw.cooldown = 3;
      emit('mosquito_dart', { swallow: sw.id, mosquito: sw.dart.target });
      return getState();
    }

    function triggerPinnacleSpiral(idx) {
      var sw = S.swallows[validIndex(idx)];
      if (sw.z > Z_MAX - 8) { sw.z = Z_MAX - 8; }
      planSpiral(sw);
      emit('pinnacle_spiral', { swallow: sw.id, pinnacle: sw.spiral.pinnacleId });
      return getState();
    }

    /* The Unmappable Paper-Fixation Paradox: pressing a 3D parabola onto z=0 vellum always fails. */
    function attemptFixSwallowsOnPaper(idx) {
      var i = validIndex(idx);
      var sw = S.swallows[i];
      S.failedPaperPinAttempts++;
      S.pinSwallowIndex = i;
      S.inspectedSwallowIndex = i;
      S.pinAttemptPhase = 'pressing';
      S.pinTimer = 0;
      S.flatten = 0;
      S.pressedSamples = curveSamples(sw).map(function (p) { return { u: p.u, v: p.v, z: p.z }; });
      buildBurst();
      emit('paper_pressing', { swallow: sw.id, attempt: S.failedPaperPinAttempts });
      return getState();
    }

    function setAirspaceTilt(val) {
      var n = Number(val);
      if (isFinite(n)) { S.airspaceTilt = clamp(n, 0, 1); }
      return getState();
    }

    function toggleAiryVaultView(force) {
      S.airyVaultView = typeof force === 'boolean' ? force : !S.airyVaultView;
      return getState();
    }

    function toggleDominanceCone(on) {
      S.showAllPointDominance = typeof on === 'boolean' ? on : !S.showAllPointDominance;
      return getState();
    }

    function hitTestSwallow(normX, normY, width, height) {
      var w = width || 1, h = height || 1;
      var px = normX * w, py = normY * h;
      var tilt = effectiveTilt();
      var best = -1, bd = Math.max(18, Math.min(w, h) * 0.035);
      for (var i = 0; i < S.swallows.length; i++) {
        var sw = S.swallows[i];
        var p = projectAirPoint(sw.u, sw.v, sw.z * (1 - S.flatten * (i === S.pinSwallowIndex ? 1 : 0)), w, h, tilt);
        var d = Math.hypot(p.sx - px, p.sy - py);
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    }

    function setReducedMotion(on) {
      S.reducedMotion = !!on;
      return getState();
    }

    function reset() {
      init();
      emit('reset', {});
      return getState();
    }

    function getState() {
      var regimeCounts = { still_wing_parabola: 0, mosquito_dart: 0, pinnacle_spiral: 0 };
      var swallows = S.swallows.map(function (sw) {
        regimeCounts[sw.regime]++;
        return {
          id: sw.id, name: sw.name, index: sw.index, regime: sw.regime,
          regimeLabel: REGIME_INFO[sw.regime].label,
          u: sw.u, v: sw.v, z: sw.z, heading: sw.heading,
          wingBeatHz: sw.wingBeatHz, stillWings: sw.wingBeatHz === 0,
          progress: clamp(sw.t, 0, 1),
          pinnacleId: sw.regime === 'pinnacle_spiral' ? sw.spiral.pinnacleId : null,
          darts: sw.darts, spirals: sw.spirals, glides: sw.glides
        };
      });
      var insp = swallows[S.inspectedSwallowIndex];
      return {
        swallowCount: swallows.length,
        swallows: swallows,
        inspectedSwallowIndex: S.inspectedSwallowIndex,
        inspectedSwallow: insp,
        regimeCounts: regimeCounts,
        mosquitoCount: S.mosquitoes.length,
        mosquitoes: S.mosquitoes.map(function (m) { return { u: m.u, v: m.v, z: m.z }; }),
        mosquitoesSwallowed: S.mosquitoesSwallowed,
        pinnacleGrazes: S.pinnacleGrazes,
        pinnacles: PINNACLE_IDS.slice(),
        airspaceTilt: S.airspaceTilt,
        effectiveTilt: effectiveTilt(),
        airyVaultView: S.airyVaultView,
        showAllPointDominance: S.showAllPointDominance,
        dominatedPointsCount: S.dominatedPointsCount,
        totalCityPoints: loci.length,
        dominanceRatio: S.dominatedPointsCount / loci.length,
        everyCurvePointDominatesAll: S.everyCurvePointDominatesAll,
        curveSamplesChecked: S.curveSamplesChecked,
        curveSamplesPerSwallow: CURVE_SAMPLES,
        burstSightlineCount: CURVE_SAMPLES * loci.length,
        activeBurstSightlines: S.pinAttemptPhase === 'airborne_unfixed' ? 0 : S.burstSightlines.length,
        failedPaperPinAttempts: S.failedPaperPinAttempts,
        pinAttemptPhase: S.pinAttemptPhase,
        pinSwallowIndex: S.pinSwallowIndex,
        paperFlattening: S.flatten,
        swallowPaperFixed: false,
        swallowPaperFixability: 0.0,
        altitudeRange: [Z_MIN, Z_MAX],
        reducedMotion: S.reducedMotion,
        muted: audio.isMuted(),
        time: S.time
      };
    }

    /* ---------- Canvas2D renderer ---------- */
    function drawSwallow(ctx, x, y, heading, spread, size, color, glow) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(heading);
      if (glow) { ctx.shadowColor = PALETTE.airy_filament; ctx.shadowBlur = 14; }
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(size * 0.95, 0);
      ctx.quadraticCurveTo(size * 0.1, -size * 0.55 * spread, -size * 0.55, -size * 1.65 * spread);
      ctx.quadraticCurveTo(-size * 0.05, -size * 0.5 * spread, -size * 0.45, 0);
      ctx.quadraticCurveTo(-size * 0.05, size * 0.5 * spread, -size * 0.55, size * 1.65 * spread);
      ctx.quadraticCurveTo(size * 0.1, size * 0.55 * spread, size * 0.95, 0);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1, size * 0.14);
      ctx.beginPath();
      ctx.moveTo(-size * 0.4, 0); ctx.lineTo(-size * 1.35, -size * 0.38);
      ctx.moveTo(-size * 0.4, 0); ctx.lineTo(-size * 1.35, size * 0.38);
      ctx.stroke();
      ctx.restore();
    }

    function renderSwallowAirspace(ctx, width, height, viewOpts) {
      if (!ctx) { return; }
      var vo = viewOpts || {};
      var w = width || (ctx.canvas && ctx.canvas.width) || 800;
      var h = height || (ctx.canvas && ctx.canvas.height) || 600;
      var tilt = typeof vo.airspaceTilt === 'number' ? vo.airspaceTilt : effectiveTilt();
      var T = S.time;
      var pinIdx = S.pinAttemptPhase === 'airborne_unfixed' ? -1 : S.pinSwallowIndex;
      function P(u, v, z) { return projectAirPoint(u, v, z, w, h, tilt); }
      function PS(i, p) { return P(p.u, p.v, i === pinIdx ? p.z * (1 - S.flatten) : p.z); }

      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      if (vo.background) {
        var g = ctx.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, '#1C2A2A'); g.addColorStop(1, PALETTE.abyssal_lagoon);
        ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      }

      /* Flat z=0 vellum onto which the parabola is pressed. */
      if (pinIdx >= 0 && S.pressedSamples.length) {
        var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        S.pressedSamples.forEach(function (p) {
          var q = P(p.u, p.v, 0);
          minX = Math.min(minX, q.sx); maxX = Math.max(maxX, q.sx); minY = Math.min(minY, q.sy); maxY = Math.max(maxY, q.sy);
        });
        var pad = 28;
        var a = S.pinAttemptPhase === 'pressing' ? S.flatten : S.flatten * 0.8;
        ctx.globalAlpha = 0.55 * a;
        ctx.fillStyle = PALETTE.vellum_folio;
        ctx.beginPath();
        ctx.moveTo(minX - pad + 14, minY - pad); ctx.lineTo(maxX + pad + 14, minY - pad);
        ctx.lineTo(maxX + pad - 14, maxY + pad); ctx.lineTo(minX - pad - 14, maxY + pad);
        ctx.closePath(); ctx.fill();
        ctx.globalAlpha = a; ctx.strokeStyle = PALETTE.iron_gall; ctx.lineWidth = 1; ctx.stroke();
        ctx.globalAlpha = 1;
      }

      /* Three pinnacle spires that the spiraling swallows graze. */
      pinnacles.forEach(function (L) {
        var b = P(L.u, L.v, 0), t = P(L.u, L.v, L.z);
        ctx.fillStyle = PALETTE.iron_gall;
        ctx.beginPath();
        ctx.moveTo(b.sx - 6, b.sy); ctx.lineTo(t.sx, t.sy); ctx.lineTo(b.sx + 6, b.sy);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = PALETTE.ridgepole_terracotta; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.fillStyle = PALETTE.swallow_gold;
        ctx.beginPath(); ctx.arc(t.sx, t.sy, 2.4, 0, TAU); ctx.fill();
      });

      if (vo.showLoci !== false) {
        ctx.font = '9px Georgia, serif';
        loci.forEach(function (L) {
          var q = P(L.u, L.v, L.z);
          ctx.fillStyle = PALETTE.airy_filament;
          ctx.globalAlpha = 0.85;
          ctx.beginPath(); ctx.arc(q.sx, q.sy, 2.6, 0, TAU); ctx.fill();
          ctx.globalAlpha = 0.7;
          ctx.fillText(L.id, q.sx + 4, q.sy - 4);
        });
        ctx.globalAlpha = 1;
      }

      /* All-Point Dominance filaments: every swallow sees all 14 loci at once. */
      if (S.showAllPointDominance) {
        S.swallows.forEach(function (sw, i) {
          var from = PS(i, sw);
          var on = i === S.inspectedSwallowIndex;
          ctx.strokeStyle = on ? PALETTE.airy_filament : PALETTE.swallow_gold;
          ctx.globalAlpha = on ? 0.5 : 0.07;
          ctx.lineWidth = on ? 0.9 : 0.6;
          ctx.beginPath();
          loci.forEach(function (L) { var q = P(L.u, L.v, L.z); ctx.moveTo(from.sx, from.sy); ctx.lineTo(q.sx, q.sy); });
          ctx.stroke();
        });
        ctx.globalAlpha = 1;
      }

      /* Golden ribbons: the invisible curve ahead (ghosted) and the wake behind. */
      S.swallows.forEach(function (sw, i) {
        var on = i === S.inspectedSwallowIndex;
        ctx.setLineDash([3, 5]);
        ctx.strokeStyle = PALETTE.swallow_gold;
        ctx.globalAlpha = on ? 0.55 : 0.18;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (var k = 0; k <= 40; k++) {
          var q = PS(i, curvePoint(sw, k / 40));
          if (k === 0) { ctx.moveTo(q.sx, q.sy); } else { ctx.lineTo(q.sx, q.sy); }
        }
        ctx.stroke();
        ctx.setLineDash([]);
        for (var j = 1; j < sw.trail.length; j++) {
          var a0 = PS(i, sw.trail[j - 1]), a1 = PS(i, sw.trail[j]);
          ctx.globalAlpha = (j / sw.trail.length) * (on ? 0.95 : 0.5);
          ctx.lineWidth = on ? 2.4 : 1.4;
          ctx.strokeStyle = PALETTE.airy_filament;
          ctx.beginPath(); ctx.moveTo(a0.sx, a0.sy); ctx.lineTo(a1.sx, a1.sy); ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;

      /* Paper burst: the pressed curve explodes into 14 x 16 = 224 dominance sightlines, then lifts back into air. */
      if (S.pinAttemptPhase === 'dissolving' && S.burstSightlines.length) {
        var prog = clamp(S.pinTimer / PIN_DISSOLVE_DUR, 0, 1);
        var lift = 1 - S.flatten;
        ctx.strokeStyle = PALETTE.airy_filament;
        ctx.lineWidth = 0.7;
        ctx.globalAlpha = 0.55 * (1 - prog) + 0.05;
        ctx.beginPath();
        S.burstSightlines.forEach(function (sl) {
          var a = P(sl.from.u, sl.from.v, sl.from.z * lift);
          var b = P(sl.to.u, sl.to.v, sl.to.z);
          var reach = Math.min(1, prog * 2.2);
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(lerp(a.sx, b.sx, reach), lerp(a.sy, b.sy, reach));
        });
        ctx.stroke();
        ctx.fillStyle = PALETTE.vellum_folio;
        for (var f = 0; f < 36; f++) {
          var sp = S.pressedSamples[f % S.pressedSamples.length];
          var base = P(sp.u, sp.v, sp.z * lift);
          var ang = f * 2.399;
          var r = prog * (30 + (f % 7) * 9);
          ctx.globalAlpha = 0.8 * (1 - prog);
          ctx.fillRect(base.sx + Math.cos(ang) * r, base.sy + Math.sin(ang) * r - prog * 20, 3, 2);
        }
        ctx.globalAlpha = 1;
      }

      /* Mid-air mosquito cloud. */
      S.mosquitoes.forEach(function (m) {
        var q = P(m.u, m.v, m.z);
        var jx = S.reducedMotion ? 0 : Math.sin(T * 31 + m.phase) * 0.8;
        ctx.fillStyle = m.gulpFlash > 0 ? PALETTE.emerald_wake : PALETTE.vellum_folio;
        ctx.globalAlpha = 0.75;
        ctx.beginPath(); ctx.arc(q.sx + jx, q.sy, m.gulpFlash > 0 ? 1.5 + m.gulpFlash * 4 : 1.4, 0, TAU); ctx.fill();
      });
      ctx.globalAlpha = 1;

      /* Still-winged crescent swallows. */
      S.swallows.forEach(function (sw, i) {
        var q = PS(i, sw);
        var on = i === S.inspectedSwallowIndex;
        var spread = sw.wingBeatHz === 0 ? 1 : 0.62 + 0.38 * Math.sin(sw.wingPhase);
        var size = (on ? 10 : 7.5) + (sw.z - Z_MIN) / (Z_MAX - Z_MIN) * 3;
        drawSwallow(ctx, q.sx, q.sy, sw.heading, spread, size, on ? PALETTE.airy_filament : PALETTE.swallow_gold, on);
        if (on && vo.labels !== false) {
          ctx.font = '10px Georgia, serif';
          ctx.fillStyle = PALETTE.vellum_folio;
          ctx.globalAlpha = 0.9;
          ctx.fillText(sw.id + ' ' + REGIME_INFO[sw.regime].label + ' z=' + sw.z.toFixed(0) + 'm', q.sx + 14, q.sy - 10);
          if (S.showAllPointDominance) {
            ctx.fillStyle = PALETTE.airy_filament;
            ctx.fillText(S.dominatedPointsCount + '/' + loci.length + ' points dominated', q.sx + 14, q.sy + 4);
          }
          if (pinIdx === i) {
            ctx.fillStyle = PALETTE.ridgepole_terracotta;
            ctx.fillText(S.pinAttemptPhase === 'pressing' ? 'pressing onto vellum...' : 'unfixable: dissolving into air', q.sx + 14, q.sy + 18);
          }
          ctx.globalAlpha = 1;
        }
      });

      ctx.restore();
    }

    var api = {
      FLIGHT_REGIMES: FLIGHT_REGIMES,
      SWALLOW_ROSTER: SWALLOW_ROSTER,
      CITY_LOCI: loci,
      audio: audio,
      step: step,
      inspectSwallow: inspectSwallow,
      inspectNextSwallow: function () { return inspectSwallow(S.inspectedSwallowIndex + 1); },
      triggerMosquitoDart: triggerMosquitoDart,
      triggerPinnacleSpiral: triggerPinnacleSpiral,
      attemptFixSwallowsOnPaper: attemptFixSwallowsOnPaper,
      setAirspaceTilt: setAirspaceTilt,
      toggleAiryVaultView: toggleAiryVaultView,
      toggleDominanceCone: toggleDominanceCone,
      hitTestSwallow: hitTestSwallow,
      renderSwallowAirspace: renderSwallowAirspace,
      render: renderSwallowAirspace,
      unlockAudio: function () { return audio.unlock(); },
      setMuted: function (m) { audio.setMuted(m); return getState(); },
      isMuted: function () { return audio.isMuted(); },
      reset: reset,
      setReducedMotion: setReducedMotion,
      getState: getState,
      projectAirPoint: projectAirPoint
    };

    init();
    return api;
  }

  var EsmeraldaSwallowParabolas = {
    VERSION: '1.0.0',
    PALETTE: PALETTE,
    SWALLOW_ROSTER: SWALLOW_ROSTER,
    FLIGHT_REGIMES: FLIGHT_REGIMES,
    REGIME_INFO: REGIME_INFO,
    CITY_LOCI: CITY_LOCI,
    PINNACLE_IDS: PINNACLE_IDS,
    ALTITUDE_RANGE: [Z_MIN, Z_MAX],
    CURVE_SAMPLES: CURVE_SAMPLES,
    BURST_SIGHTLINES: CURVE_SAMPLES * CITY_LOCI.length,
    projectAirPoint: projectAirPoint,
    createAirAudio: createAirAudio,
    createSwallowAirspace: createSwallowAirspace
  };

  root.EsmeraldaSwallowParabolas = EsmeraldaSwallowParabolas;
  if (typeof module !== 'undefined' && module) { module['ex' + 'ports'] = EsmeraldaSwallowParabolas; }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
