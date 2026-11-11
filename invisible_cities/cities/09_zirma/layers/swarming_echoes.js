/*
 * City 09: ZIRMA (Cities & Signs 2)
 * Layer: Polo's Redundant, Multiplied Swarming Memory & Woodblock Overprint Press
 * Global API: globalThis.ZirmaSwarmingEchoes
 */
(function (root) {
  'use strict';

  var STONE_IDS = [
    'cobble_canes',
    'skyscraper_cornices',
    'leashed_pumas',
    'window_dirigibles',
    'sailor_tattoos',
    'humid_underground'
  ];

  var STONE_SET = {};
  for (var i = 0; i < STONE_IDS.length; i++) {
    STONE_SET[STONE_IDS[i]] = true;
  }

  var STRATA = {
    sky: { y0: 0.04, y1: 0.36 },
    street: { y0: 0.38, y1: 0.70 },
    subterranean: { y0: 0.72, y1: 0.97 }
  };

  var STONE_BOUNDS = {
    cobble_canes: { stratum: 'street', x0: 0.04, y0: 0.38, x1: 0.34, y1: 0.70 },
    skyscraper_cornices: { stratum: 'sky', x0: 0.04, y0: 0.04, x1: 0.96, y1: 0.36 },
    leashed_pumas: { stratum: 'street', x0: 0.35, y0: 0.38, x1: 0.65, y1: 0.70 },
    window_dirigibles: { stratum: 'sky', x0: 0.04, y0: 0.05, x1: 0.96, y1: 0.36 },
    sailor_tattoos: { stratum: 'street', x0: 0.66, y0: 0.38, x1: 0.96, y1: 0.70 },
    humid_underground: { stratum: 'subterranean', x0: 0.04, y0: 0.72, x1: 0.96, y1: 0.97 }
  };

  var PALETTE = {
    sheet: '#f2ebdc',
    lampblack: '#151311',
    prussian: '#183046',
    vermilion: '#a82e24',
    ochre: '#b6822b',
    verdigris: '#2c574f'
  };

  var MEMORY_CAPTIONS = {
    cobble_canes:
      'Many blind black men crowd Zirma\'s cobblestones, shouting into the street while their canes strike an interlocking polyrhythm.',
    skyscraper_cornices:
      'In every skyscraper of Zirma someone is going mad; along row after row of dizzying cornices, lunatics teeter for hours above the drop.',
    leashed_pumas:
      'All along Zirma\'s colonnades, girls stride past walking sleek pumas raised on a whim at the end of taut leashes.',
    window_dirigibles:
      'Flocks of dirigibles cruise in every direction right at window level across Zirma\'s skyscraper facades.',
    sailor_tattoos:
      'Bustling streets of open parlors buzz with needles drawing anchors, coiled serpents, compasses, and pierced patterns into sailors\' skin.',
    humid_underground:
      'Underground trains rumble window-to-window with obese women gasping and fluttering dozens of fans in thick rising humidity.'
  };

  function clamp(v, lo, hi) {
    if (!Number.isFinite(v)) return lo;
    return v < lo ? lo : v > hi ? hi : v;
  }

  function wrap01(v) {
    var r = v % 1;
    return r < 0 ? r + 1 : r;
  }

  function makeRng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function drawEllipse(ctx, cx, cy, rx, ry, rot) {
    if (rx <= 0 || ry <= 0) return;
    if (typeof ctx.ellipse === 'function') {
      ctx.ellipse(cx, cy, rx, ry, rot || 0, 0, Math.PI * 2);
    } else {
      ctx.save();
      ctx.translate(cx, cy);
      if (rot) ctx.rotate(rot);
      ctx.scale(rx, ry);
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.restore();
    }
  }

  function safeSetLineDash(ctx, dash) {
    if (typeof ctx.setLineDash === 'function') {
      ctx.setLineDash(dash);
    }
  }

  function edgeFeather(u, margin) {
    var m = margin || 0.08;
    if (u < m) return clamp(u / m, 0, 1);
    if (u > 1 - m) return clamp((1 - u) / m, 0, 1);
    return 1;
  }

  function createState() {
    var rng = makeRng(9091972);
    var stamps = {};
    var stonePermanence = {};
    for (var i = 0; i < STONE_IDS.length; i++) {
      stamps[STONE_IDS[i]] = 0;
      stonePermanence[STONE_IDS[i]] = 0;
    }

    // 1. Cobble Canes: 9 blind black men arranged across 3 perspective tiers
    var caneRatios = [2.2, 2.75, 3.3, 1.85, 2.5, 3.1, 2.05, 2.9, 3.55];
    var canes = [];
    for (var c = 0; c < 9; c++) {
      var tier = Math.floor(c / 3); // 0 back, 1 mid, 2 front
      var col = c % 3;
      var uBase = 0.17 + col * 0.31 + (tier === 1 ? 0.05 : tier === 0 ? -0.03 : 0.01);
      var vBase = 0.34 + tier * 0.25 + (col === 1 ? 0.04 : 0);
      canes.push({
        index: c,
        tier: tier,
        uBase: clamp(uBase, 0.12, 0.88),
        vBase: clamp(vBase, 0.26, 0.90),
        u: clamp(uBase, 0.12, 0.88),
        v: clamp(vBase, 0.26, 0.90),
        dir: c % 2 === 0 ? 1 : -1,
        rate: caneRatios[c],
        phase: (c * 0.19 + rng() * 0.2) % 1,
        shoutPhase: (c * 0.31 + 0.15) % 1,
        hatStyle: c % 3,
        rings: [
          { age: (c * 0.27) % 1 },
          { age: (c * 0.27 + 0.5) % 1 }
        ]
      });
    }

    // 2. Skyscraper Cornices: 11 towers across Zirma's skyline, lunatics on EVERY tower (15 total)
    var towerSpecs = [
      { u0: 0.015, w: 0.078, topV: 0.20, cols: 3, rows: 9 },
      { u0: 0.098, w: 0.088, topV: 0.11, cols: 4, rows: 11 },
      { u0: 0.192, w: 0.072, topV: 0.24, cols: 3, rows: 8 },
      { u0: 0.270, w: 0.095, topV: 0.08, cols: 4, rows: 12 },
      { u0: 0.372, w: 0.078, topV: 0.18, cols: 3, rows: 9 },
      { u0: 0.456, w: 0.096, topV: 0.07, cols: 4, rows: 12 },
      { u0: 0.558, w: 0.076, topV: 0.22, cols: 3, rows: 8 },
      { u0: 0.640, w: 0.090, topV: 0.12, cols: 4, rows: 11 },
      { u0: 0.736, w: 0.074, topV: 0.19, cols: 3, rows: 9 },
      { u0: 0.816, w: 0.088, topV: 0.09, cols: 4, rows: 12 },
      { u0: 0.909, w: 0.076, topV: 0.16, cols: 3, rows: 10 }
    ];
    var skyscrapers = [];
    var lunatics = [];
    for (var t = 0; t < towerSpecs.length; t++) {
      var ts = towerSpecs[t];
      var litMask = [];
      for (var wIdx = 0; wIdx < ts.cols * ts.rows; wIdx++) {
        litMask.push(rng() > 0.44);
      }
      skyscrapers.push({
        index: t,
        u0: ts.u0,
        w: ts.w,
        topV: ts.topV,
        cols: ts.cols,
        rows: ts.rows,
        hasSetback: t % 2 === 1,
        litMask: litMask
      });

      var sidePrimary = t % 2 === 0 ? 1 : -1;
      lunatics.push({
        towerIndex: t,
        u: sidePrimary > 0 ? ts.u0 + ts.w * 0.88 : ts.u0 + ts.w * 0.12,
        v: ts.topV,
        leanDir: sidePrimary,
        swayFreq: 0.85 + (t % 5) * 0.24,
        phase: t * 0.73,
        pose: t % 3
      });

      if (ts.w >= 0.088) {
        var sideSecond = -sidePrimary;
        var setbackV = ts.topV + 0.11;
        lunatics.push({
          towerIndex: t,
          u: sideSecond > 0 ? ts.u0 + ts.w * 0.92 : ts.u0 + ts.w * 0.08,
          v: setbackV,
          leanDir: sideSecond,
          swayFreq: 1.05 + (t % 4) * 0.21,
          phase: t * 1.19 + 1.4,
          pose: (t + 1) % 3
        });
      }
    }

    // 3. Leashed Pumas: 6 girls striding along colonnades, each walking a puma on a taut leash
    var pumas = [];
    for (var p = 0; p < 6; p++) {
      var lane = Math.floor(p / 2); // 0 upper arcade, 1 mid arcade, 2 foreground arcade
      var inLane = p % 2;
      var pDir = lane === 1 ? -1 : 1;
      var startU = inLane * 0.48 + lane * 0.13 + 0.14;
      pumas.push({
        index: p,
        lane: lane,
        u: wrap01(startU),
        v: 0.37 + lane * 0.26,
        dir: pDir,
        speed: 0.055 + lane * 0.014 + inLane * 0.006,
        stridePhase: p * 1.05,
        hatVariant: p % 2
      });
    }

    // 4. Window Dirigibles: 14 dirigibles flying in ALL directions at skyscraper window level
    var dirigibles = [];
    var pitchSet = [0, 0.12, -0.11, 0.05, -0.14, 0.09, -0.04];
    for (var d = 0; d < 14; d++) {
      var dDir = d % 2 === 0 ? 1 : -1;
      var depthBand = d % 3; // 0 behind/between, 1 mid-facade, 2 close window skimmer
      var baseV = 0.28 + ((d * 0.173) % 0.60);
      var pitch = pitchSet[d % pitchSet.length];
      dirigibles.push({
        index: d,
        u: (d * 0.073 + 0.04) % 1,
        v: clamp(baseV, 0.25, 0.89),
        vAnchor: clamp(baseV, 0.25, 0.89),
        dir: dDir,
        pitch: pitch,
        speedU: 0.032 + depthBand * 0.015 + (d % 4) * 0.005,
        speedV: pitch * 0.045,
        scale: 0.72 + depthBand * 0.22,
        depthBand: depthBand,
        propPhase: d * 0.9,
        stripeStyle: d % 3
      });
    }

    // 5. Sailor Tattoos: 5 bustling open parlor stations + crowded sailors & iconic flash motifs
    var motifs = ['anchor', 'serpent', 'star', 'anchor', 'serpent'];
    var tattooStations = [];
    for (var s = 0; s < 5; s++) {
      var sTier = s < 2 ? 0 : s < 4 ? 1 : 2;
      var sCol = s < 2 ? s : s < 4 ? s - 2 : 0.5;
      var su = sTier === 2 ? 0.50 : 0.27 + sCol * 0.46;
      var sv = 0.33 + sTier * 0.28;
      tattooStations.push({
        index: s,
        tier: sTier,
        u: su,
        v: sv,
        motif: motifs[s],
        buzzPhase: s * 1.37,
        needleRate: 14 + s * 2.5,
        extraSailorSide: s % 2 === 0 ? -1 : 1
      });
    }

    // 6. Humid Underground: 4 coupled lit carriages crammed window-to-window (28 women + fluttering fans + rising steam)
    var subwayCars = [];
    var passengers = [];
    for (var car = 0; car < 4; car++) {
      var carU0 = 0.035 + car * 0.236;
      var carW = 0.220;
      subwayCars.push({
        index: car,
        u0: carU0,
        w: carW,
        jostlePhase: car * 0.85
      });
      for (var win = 0; win < 4; win++) {
        var winCenterU = carU0 + carW * (0.15 + win * 0.233);
        // Crammed 2 women side-by-side in wide windows, creating 28 total packed figures
        var countInWin = (car + win) % 4 === 0 ? 1 : 2;
        for (var occ = 0; occ < countInWin; occ++) {
          var spread = countInWin === 2 ? (occ === 0 ? -0.015 : 0.015) : 0;
          passengers.push({
            carIndex: car,
            winIndex: win,
            u: winCenterU + spread,
            fanPhase: (car * 0.4 + win * 0.22 + occ * 0.15),
            bodyScale: 0.94 + ((car + win + occ) % 3) * 0.08,
            fanColor: (car + win + occ) % 3
          });
        }
      }
    }

    var steamWisps = [];
    for (var sw = 0; sw < 18; sw++) {
      steamWisps.push({
        u: (sw * 0.057 + 0.03) % 0.96,
        v: 0.16 + ((sw * 0.21) % 0.76),
        riseSpeed: 0.07 + (sw % 4) * 0.022,
        amp: 0.012 + (sw % 3) * 0.006,
        phase: sw * 0.83
      });
    }

    return {
      time: 0,
      reducedMotion: false,
      swarmWeight: 0.65,
      activeStone: null,
      stamps: stamps,
      totalStamps: 0,
      stonePermanence: stonePermanence,
      canes: canes,
      skyscrapers: skyscrapers,
      lunatics: lunatics,
      pumas: pumas,
      dirigibles: dirigibles,
      tattooStations: tattooStations,
      subwayCars: subwayCars,
      passengers: passengers,
      steamWisps: steamWisps
    };
  }

  function step(state, dt, params) {
    if (!state) return;
    var p = params || {};
    var reduced = Boolean(p.reducedMotion);
    state.reducedMotion = reduced;

    if (typeof p.swarmWeight === 'number') {
      state.swarmWeight = clamp(p.swarmWeight, 0, 1);
    } else if (typeof p.memoryWeight === 'number') {
      state.swarmWeight = clamp(p.memoryWeight, 0, 1);
    }

    if (p.activeStone !== undefined) {
      state.activeStone = p.activeStone;
    }

    if (p.stonePermanence && typeof p.stonePermanence === 'object') {
      for (var i = 0; i < STONE_IDS.length; i++) {
        var sid = STONE_IDS[i];
        if (typeof p.stonePermanence[sid] === 'number') {
          state.stonePermanence[sid] = clamp(p.stonePermanence[sid], 0, 1);
        }
      }
    }

    // Freeze kinetic drift into crisp canonical woodcut registration plates when reducedMotion is true
    if (reduced) {
      return;
    }

    var safeDt = Number.isFinite(dt) ? clamp(dt, 0, 0.1) : 0.016;
    state.time += safeDt;

    // 1. Advance blind men polyrhythmic cane strikes & acoustic rings
    for (var c = 0; c < state.canes.length; c++) {
      var cane = state.canes[c];
      var prevPhase = cane.phase;
      cane.phase = wrap01(cane.phase + safeDt * cane.rate * 0.55);
      cane.shoutPhase = wrap01(cane.shoutPhase + safeDt * (0.45 + (c % 3) * 0.14));
      cane.u = clamp(cane.uBase + Math.sin(state.time * 0.55 + c * 1.1) * 0.022 * cane.dir, 0.10, 0.90);
      if (cane.phase < prevPhase) {
        cane.rings[0].age = 0.02;
      }
      for (var r = 0; r < cane.rings.length; r++) {
        cane.rings[r].age = wrap01(cane.rings[r].age + safeDt * 0.85);
      }
    }

    // 3. Advance colonnade girls & leashed pumas
    for (var pm = 0; pm < state.pumas.length; pm++) {
      var pair = state.pumas[pm];
      pair.u = wrap01(pair.u + safeDt * pair.speed * pair.dir);
      pair.stridePhase += safeDt * (5.2 + pair.lane * 0.7);
    }

    // 4. Advance flocks of window-level dirigibles in all directions
    for (var d = 0; d < state.dirigibles.length; d++) {
      var ship = state.dirigibles[d];
      ship.u = wrap01(ship.u + safeDt * ship.speedU * ship.dir);
      var rawV = ship.v + safeDt * ship.speedV;
      if (rawV < 0.24 || rawV > 0.90) {
        ship.speedV = -ship.speedV;
        ship.pitch = -ship.pitch;
        rawV = clamp(rawV, 0.24, 0.90);
      }
      ship.v = rawV;
      ship.propPhase += safeDt * 18;
    }

    // 5. Advance buzzing tattoo needles
    for (var s = 0; s < state.tattooStations.length; s++) {
      var st = state.tattooStations[s];
      st.buzzPhase += safeDt * st.needleRate;
    }

    // 6. Advance humid underground steam wisps
    for (var sw = 0; sw < state.steamWisps.length; sw++) {
      var wisp = state.steamWisps[sw];
      wisp.v -= safeDt * wisp.riseSpeed;
      if (wisp.v < 0.08) {
        wisp.v = 0.92;
      }
    }
  }

  function computeStonePresence(state, params, stoneId) {
    var p = params || {};
    var sw = typeof p.swarmWeight === 'number'
      ? clamp(p.swarmWeight, 0, 1)
      : clamp(state && typeof state.swarmWeight === 'number' ? state.swarmWeight : 0.65, 0, 1);

    var permMap = (p.stonePermanence && typeof p.stonePermanence === 'object')
      ? p.stonePermanence
      : (state && state.stonePermanence) || {};

    var stampCount = (state && state.stamps && state.stamps[stoneId]) || 0;
    var perm = clamp(
      typeof permMap[stoneId] === 'number' ? permMap[stoneId] : stampCount * 0.28,
      0,
      1
    );

    var presence = clamp(Math.max(sw, sw * 0.72 + perm * 0.62, perm * 0.30), 0, 1);
    return {
      presence: presence,
      swarmWeight: sw,
      permanence: perm,
      stamps: stampCount,
      focused: (p.activeStone || (state && state.activeStone)) === stoneId
    };
  }

  function pixelRect(stoneId, width, height) {
    var b = STONE_BOUNDS[stoneId];
    return {
      x: b.x0 * width,
      y: b.y0 * height,
      w: (b.x1 - b.x0) * width,
      h: (b.y1 - b.y0) * height
    };
  }

  function drawRegistrationMarks(ctx, r, color, passIndex, alpha) {
    var arm = clamp(Math.min(r.w, r.h) * 0.028, 3.5, 9);
    var pad = arm * 0.75;
    var corners = [
      [r.x + pad, r.y + pad],
      [r.x + r.w - pad, r.y + pad],
      [r.x + pad, r.y + r.h - pad],
      [r.x + r.w - pad, r.y + r.h - pad]
    ];
    ctx.save();
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = Math.max(0.85, arm * 0.16);
    for (var i = 0; i < corners.length; i++) {
      var cx = corners[i][0];
      var cy = corners[i][1];
      ctx.beginPath();
      ctx.moveTo(cx - arm * 0.6, cy);
      ctx.lineTo(cx + arm * 0.6, cy);
      ctx.moveTo(cx, cy - arm * 0.6);
      ctx.lineTo(cx, cy + arm * 0.6);
      ctx.arc(cx, cy, arm * 0.34, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Printmaker pass tally ticks along top-left margin
    var maxTicks = Math.min(passIndex || 1, 12);
    for (var t = 0; t < maxTicks; t++) {
      var tx = r.x + pad * 2.3 + t * (arm * 0.45);
      var ty = r.y + pad * 0.85;
      if (tx > r.x + r.w - pad * 2) break;
      ctx.beginPath();
      ctx.moveTo(tx, ty - arm * 0.32);
      ctx.lineTo(tx, ty + arm * 0.32);
      ctx.stroke();
    }
    ctx.restore();
  }

  // =========================================================================
  // STONE 1: COBBLE CANES (Blind black men shouting & tapping canes in polyrhythm)
  // =========================================================================
  function renderCobbleCanes(ctx, r, state, opts) {
    var alpha = opts.alpha;
    if (alpha <= 0.01) return;
    var isStamp = Boolean(opts.isStamp);
    var tint = opts.tint || null;
    var reliefPass = Boolean(opts.reliefPass);
    var uScale = Math.min(r.w, r.h);
    var lw = Math.max(0.9, uScale * 0.0085);
    var t = state.reducedMotion || isStamp ? (opts.phaseShift || 0) : state.time;

    var inkDark = tint || PALETTE.lampblack;
    var inkPrussian = tint || PALETTE.prussian;
    var inkVermilion = tint || PALETTE.vermilion;
    var inkOchre = tint || PALETTE.ochre;

    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    if (opts.dx || opts.dy) ctx.translate(opts.dx || 0, opts.dy || 0);

    // Perspective cobblestone street fan
    ctx.strokeStyle = inkPrussian;
    ctx.lineWidth = lw * 0.78;
    ctx.globalAlpha = alpha * (isStamp ? 0.44 : 0.36);
    var rows = 9;
    for (var row = 0; row < rows; row++) {
      var frac = row / (rows - 1);
      var ry = r.y + r.h * (0.18 + Math.pow(frac, 1.18) * 0.78);
      var archDip = Math.sin(frac * Math.PI) * r.h * 0.018;
      ctx.beginPath();
      ctx.moveTo(r.x + r.w * 0.03, ry + archDip);
      ctx.quadraticCurveTo(r.x + r.w * 0.5, ry - archDip * 1.4, r.x + r.w * 0.97, ry + archDip);
      ctx.stroke();

      var stonesInRow = 7 + Math.floor(frac * 5);
      for (var c = 0; c < stonesInRow; c++) {
        var cu = (c + (row % 2) * 0.5) / stonesInRow;
        if (cu <= 0.04 || cu >= 0.96) continue;
        var sx = r.x + cu * r.w;
        var nextFrac = Math.min(1, (row + 0.85) / (rows - 1));
        var ryNext = r.y + r.h * (0.18 + Math.pow(nextFrac, 1.18) * 0.78);
        ctx.beginPath();
        ctx.moveTo(sx, ry);
        ctx.lineTo(sx + (cu - 0.5) * r.w * 0.035, ryNext);
        ctx.stroke();
      }
    }

    var count = isStamp
      ? state.canes.length
      : Math.max(3, Math.round(3 + (state.canes.length - 3) * clamp(opts.multiplicity, 0, 1)));

    for (var i = 0; i < count; i++) {
      var cane = state.canes[i];
      var depthScale = 0.68 + cane.tier * 0.18;
      var figH = uScale * 0.25 * depthScale;
      var figW = figH * 0.36;
      var fx = r.x + cane.u * r.w;
      var fy = r.y + cane.v * r.h;
      var dir = cane.dir;

      var tapCycle = state.reducedMotion || isStamp
        ? wrap01(cane.phase + (opts.phaseShift || 0) * 0.23)
        : cane.phase;
      var caneSwing = Math.sin(tapCycle * Math.PI * 2);
      var tipX = fx + dir * figH * (0.48 + caneSwing * 0.08);
      var tipY = fy + figH * (0.04 + Math.max(0, -caneSwing) * 0.03);

      // Polyrhythmic cobblestone strike rings at cane tip
      for (var rg = 0; rg < 2; rg++) {
        var ringAge = state.reducedMotion || isStamp
          ? (rg * 0.42 + 0.24)
          : cane.rings[rg].age;
        var ringRadX = figH * (0.14 + ringAge * 0.44);
        var ringRadY = ringRadX * 0.34;
        ctx.save();
        ctx.strokeStyle = rg === 0 ? inkVermilion : inkOchre;
        ctx.globalAlpha = alpha * (1 - ringAge * 0.78) * 0.85;
        ctx.lineWidth = lw * (1.35 - ringAge * 0.5);
        if (rg === 1) safeSetLineDash(ctx, [lw * 2.5, lw * 1.8]);
        ctx.beginPath();
        drawEllipse(ctx, tipX, tipY, ringRadX, ringRadY, 0);
        ctx.stroke();
        ctx.restore();
      }

      // Thin rag-cotton relief halo so layered black figures remain crisp
      if (!tint || reliefPass) {
        ctx.strokeStyle = PALETTE.sheet;
        ctx.lineWidth = lw * 2.1;
        ctx.globalAlpha = alpha * (reliefPass ? 0.45 : 0.68);
        ctx.beginPath();
        ctx.arc(fx, fy - figH * 0.82, figW * 0.34, 0, Math.PI * 2);
        ctx.moveTo(fx - figW * 0.44, fy - figH * 0.22);
        ctx.lineTo(fx, fy - figH * 0.68);
        ctx.lineTo(fx + figW * 0.44, fy - figH * 0.22);
        ctx.stroke();
      }

      // Striding legs & long dark coat in lampblack carbon
      var stride = Math.sin(t * 2.8 + i) * (state.reducedMotion || isStamp ? 0.5 : 1) * figW * 0.34;
      ctx.fillStyle = inkDark;
      ctx.strokeStyle = inkDark;
      ctx.globalAlpha = alpha * 0.94;
      ctx.lineWidth = lw * 1.65;

      // Legs
      ctx.beginPath();
      ctx.moveTo(fx - figW * 0.14, fy - figH * 0.30);
      ctx.lineTo(fx - figW * 0.20 - stride * 0.5, fy);
      ctx.moveTo(fx + figW * 0.14, fy - figH * 0.30);
      ctx.lineTo(fx + figW * 0.20 + stride * 0.5, fy);
      ctx.stroke();

      // Coat torso
      ctx.beginPath();
      ctx.moveTo(fx - figW * 0.38, fy - figH * 0.66);
      ctx.lineTo(fx + figW * 0.38, fy - figH * 0.66);
      ctx.lineTo(fx + figW * 0.48, fy - figH * 0.20);
      ctx.lineTo(fx - figW * 0.46, fy - figH * 0.20);
      ctx.closePath();
      ctx.fill();

      // Tilted shouting head
      var headX = fx + dir * figW * 0.08;
      var headY = fy - figH * 0.83;
      var headR = figW * 0.33;
      ctx.beginPath();
      ctx.arc(headX, headY, headR, 0, Math.PI * 2);
      ctx.fill();

      // Brimmed hat on alternating men
      if (cane.hatStyle !== 2) {
        ctx.lineWidth = lw * 1.3;
        ctx.beginPath();
        ctx.moveTo(headX - headR * 1.45, headY - headR * 0.38);
        ctx.lineTo(headX + headR * 1.45, headY - headR * 0.55);
        ctx.stroke();
      }

      // Pale blindfold / dark-spectacle glint & open shouting mouth cut-out
      ctx.strokeStyle = PALETTE.sheet;
      ctx.fillStyle = PALETTE.sheet;
      ctx.lineWidth = Math.max(0.8, lw * 0.95);
      ctx.beginPath();
      ctx.moveTo(headX - headR * 0.55, headY - headR * 0.12);
      ctx.lineTo(headX + dir * headR * 0.82, headY - headR * 0.26);
      ctx.stroke();
      // Open shouting mouth wedge
      ctx.beginPath();
      ctx.arc(headX + dir * headR * 0.68, headY + headR * 0.16, headR * 0.24, 0, Math.PI * 2);
      ctx.fill();

      // Shouting concentric typographic/ink acoustic arcs from mouth
      var mouthX = headX + dir * headR * 1.05;
      var mouthY = headY - headR * 0.05;
      var baseAngle = dir > 0 ? -0.32 : Math.PI + 0.32;
      ctx.strokeStyle = inkVermilion;
      for (var wa = 1; wa <= 3; wa++) {
        var shoutPulse = state.reducedMotion || isStamp ? 0 : cane.shoutPhase * 0.35;
        var wRad = headR * (0.75 + (wa + shoutPulse) * 0.68);
        ctx.globalAlpha = alpha * (0.85 - wa * 0.18);
        ctx.lineWidth = lw * (1.25 - wa * 0.2);
        ctx.beginPath();
        ctx.arc(mouthX, mouthY, wRad, baseAngle - 0.52, baseAngle + 0.52);
        ctx.stroke();
      }

      // Extended cane arm + white/ochre-tipped tapping cane
      var handX = fx + dir * figW * 0.44;
      var handY = fy - figH * 0.48;
      ctx.globalAlpha = alpha * 0.95;
      ctx.strokeStyle = inkDark;
      ctx.lineWidth = lw * 1.45;
      ctx.beginPath();
      ctx.moveTo(fx + dir * figW * 0.22, fy - figH * 0.60);
      ctx.lineTo(handX, handY);
      ctx.stroke();

      ctx.strokeStyle = inkOchre;
      ctx.lineWidth = lw * 1.25;
      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      ctx.strokeStyle = PALETTE.sheet;
      ctx.lineWidth = lw * 1.35;
      ctx.beginPath();
      ctx.moveTo(handX + (tipX - handX) * 0.72, handY + (tipY - handY) * 0.72);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
    }

    ctx.restore();
  }

  // =========================================================================
  // STONE 2: SKYSCRAPER CORNICES (In every skyscraper someone going mad)
  // =========================================================================
  function renderSkyscraperCornices(ctx, r, state, opts) {
    var alpha = opts.alpha;
    if (alpha <= 0.01) return;
    var isStamp = Boolean(opts.isStamp);
    var tint = opts.tint || null;
    var uScale = Math.min(r.w, r.h);
    var lw = Math.max(0.85, uScale * 0.008);
    var t = state.reducedMotion || isStamp ? (opts.phaseShift || 0) : state.time;

    var inkPrussian = tint || PALETTE.prussian;
    var inkDark = tint || PALETTE.lampblack;
    var inkVermilion = tint || PALETTE.vermilion;
    var inkOchre = tint || PALETTE.ochre;

    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    if (opts.dx || opts.dy) ctx.translate(opts.dx || 0, opts.dy || 0);

    var towerCount = state.skyscrapers.length;
    for (var i = 0; i < towerCount; i++) {
      var tw = state.skyscrapers[i];
      var tx = r.x + tw.u0 * r.w;
      var tWidth = tw.w * r.w;
      var ty = r.y + tw.topV * r.h;
      var tHeight = r.y + r.h - ty;

      // Subtle architectural engraving wash
      ctx.fillStyle = inkPrussian;
      ctx.globalAlpha = alpha * (isStamp ? 0.12 : 0.10);
      ctx.fillRect(tx, ty, tWidth, tHeight);

      // Tower shaft outline
      ctx.strokeStyle = inkPrussian;
      ctx.globalAlpha = alpha * 0.82;
      ctx.lineWidth = lw * 1.25;
      ctx.strokeRect(tx, ty, tWidth, tHeight);

      // Bold projecting high cornice ledge + dentils
      var corniceOverhang = Math.max(2.5, tWidth * 0.09);
      var corniceH = Math.max(2.5, r.h * 0.024);
      ctx.fillStyle = inkDark;
      ctx.globalAlpha = alpha * 0.88;
      ctx.fillRect(tx - corniceOverhang, ty - corniceH * 0.5, tWidth + corniceOverhang * 2, corniceH);

      // Secondary setback cornice on wider towers
      if (tw.hasSetback) {
        var sbY = ty + r.h * 0.11;
        ctx.fillStyle = inkPrussian;
        ctx.globalAlpha = alpha * 0.72;
        ctx.fillRect(tx - corniceOverhang * 0.75, sbY, tWidth + corniceOverhang * 1.5, corniceH * 0.72);
      }

      // Window grid along skyscraper facade
      var padX = tWidth * 0.14;
      var cellW = (tWidth - padX * 2) / tw.cols;
      var cellH = (tHeight - corniceH * 2.2) / tw.rows;
      for (var rr = 0; rr < tw.rows; rr++) {
        for (var cc = 0; cc < tw.cols; cc++) {
          var wx = tx + padX + cc * cellW + cellW * 0.16;
          var wy = ty + corniceH * 1.4 + rr * cellH + cellH * 0.18;
          var ww = Math.max(1.2, cellW * 0.66);
          var wh = Math.max(1.4, cellH * 0.58);
          var isLit = tw.litMask[rr * tw.cols + cc];
          if (isLit && !tint) {
            ctx.fillStyle = inkOchre;
            ctx.globalAlpha = alpha * 0.34;
            ctx.fillRect(wx, wy, ww, wh);
          }
          ctx.strokeStyle = inkPrussian;
          ctx.globalAlpha = alpha * 0.36;
          ctx.lineWidth = Math.max(0.6, lw * 0.65);
          ctx.strokeRect(wx, wy, ww, wh);
        }
      }
    }

    // Lunatics teetering along high cornices in EVERY tower
    var lunCount = isStamp
      ? state.lunatics.length
      : Math.max(4, Math.round(4 + (state.lunatics.length - 4) * clamp(opts.multiplicity, 0, 1)));

    for (var l = 0; l < lunCount; l++) {
      var lun = state.lunatics[l];
      var lx = r.x + lun.u * r.w;
      var ly = r.y + lun.v * r.h - Math.max(1.5, r.h * 0.01);
      var figH = clamp(r.h * 0.105, 8.5, 22);
      var sway = Math.sin(t * lun.swayFreq + lun.phase);
      var leanAngle = lun.leanDir * (0.34 + (state.reducedMotion || isStamp ? 0.12 : sway * 0.15));

      // Hours-of-madness pendulum arc & vertigo spiral above/beside cornice
      ctx.save();
      ctx.strokeStyle = inkVermilion;
      ctx.globalAlpha = alpha * 0.72;
      ctx.lineWidth = Math.max(0.75, lw * 0.85);
      ctx.beginPath();
      ctx.arc(lx, ly, figH * 1.18, -Math.PI * 0.5 - 0.52, -Math.PI * 0.5 + 0.52);
      ctx.stroke();

      // Vertigo drop ticks into the street chasm
      var dropX = lx + lun.leanDir * figH * 0.78;
      safeSetLineDash(ctx, [lw * 1.6, lw * 1.6]);
      ctx.strokeStyle = inkOchre;
      ctx.beginPath();
      ctx.moveTo(dropX, ly + figH * 0.15);
      ctx.lineTo(dropX + lun.leanDir * figH * 0.22, ly + figH * 1.45);
      ctx.stroke();
      ctx.restore();

      // Teetering figure silhouette
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(leanAngle);

      if (!tint) {
        ctx.strokeStyle = PALETTE.sheet;
        ctx.lineWidth = lw * 2.1;
        ctx.globalAlpha = alpha * 0.72;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -figH * 0.75);
        ctx.arc(0, -figH * 0.88, figH * 0.14, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.strokeStyle = inkDark;
      ctx.fillStyle = inkDark;
      ctx.globalAlpha = alpha * 0.96;
      ctx.lineWidth = Math.max(1.1, lw * 1.35);

      // Standing leg on cornice edge + hovering free leg over void
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -figH * 0.42);
      ctx.moveTo(0, -figH * 0.38);
      ctx.lineTo(lun.leanDir * figH * 0.28, -figH * 0.12);
      // Torso & flaring coat-tail
      ctx.moveTo(0, -figH * 0.42);
      ctx.lineTo(0, -figH * 0.76);
      ctx.moveTo(0, -figH * 0.48);
      ctx.lineTo(-lun.leanDir * figH * 0.30, -figH * 0.30);
      ctx.stroke();

      // Arms flung wide or clutching hair in madness
      ctx.beginPath();
      if (lun.pose === 0) {
        ctx.moveTo(-figH * 0.42, -figH * 0.84);
        ctx.lineTo(0, -figH * 0.68);
        ctx.lineTo(figH * 0.44, -figH * 0.92);
      } else if (lun.pose === 1) {
        ctx.moveTo(0, -figH * 0.68);
        ctx.lineTo(-figH * 0.24, -figH * 0.98);
        ctx.lineTo(0, -figH * 0.94);
        ctx.moveTo(0, -figH * 0.68);
        ctx.lineTo(figH * 0.24, -figH * 0.98);
      } else {
        ctx.moveTo(-figH * 0.36, -figH * 0.60);
        ctx.lineTo(0, -figH * 0.68);
        ctx.lineTo(lun.leanDir * figH * 0.48, -figH * 0.82);
      }
      ctx.stroke();

      // Head + wild windblown hair ticks
      ctx.beginPath();
      ctx.arc(0, -figH * 0.88, figH * 0.135, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  }

  // =========================================================================
  // STONE 3: LEASHED PUMAS (Girls walking pumas raised on a whim along colonnades)
  // =========================================================================
  function renderLeashedPumas(ctx, r, state, opts) {
    var alpha = opts.alpha;
    if (alpha <= 0.01) return;
    var isStamp = Boolean(opts.isStamp);
    var tint = opts.tint || null;
    var uScale = Math.min(r.w, r.h);
    var lw = Math.max(0.9, uScale * 0.0085);

    var inkDark = tint || PALETTE.lampblack;
    var inkPrussian = tint || PALETTE.prussian;
    var inkVermilion = tint || PALETTE.vermilion;
    var inkOchre = tint || PALETTE.ochre;

    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    if (opts.dx || opts.dy) ctx.translate(opts.dx || 0, opts.dy || 0);

    // Repeating vaulted colonnade arches & fluted columns
    var bays = 5;
    var bayW = r.w / bays;
    var archTopY = r.y + r.h * 0.08;
    var springY = r.y + r.h * 0.24;
    var colBaseY = r.y + r.h * 0.56;

    ctx.strokeStyle = inkPrussian;
    ctx.lineWidth = lw * 1.1;
    ctx.globalAlpha = alpha * 0.46;

    for (var b = 0; b < bays; b++) {
      var bx = r.x + b * bayW;
      ctx.beginPath();
      ctx.arc(bx + bayW * 0.5, springY, bayW * 0.46, Math.PI, 0, false);
      ctx.stroke();

      // Column shaft & capital
      var colX = bx + bayW * 0.04;
      ctx.beginPath();
      ctx.moveTo(colX, springY);
      ctx.lineTo(colX, colBaseY);
      ctx.moveTo(colX + bayW * 0.07, springY);
      ctx.lineTo(colX + bayW * 0.07, colBaseY);
      ctx.moveTo(colX - bayW * 0.03, springY);
      ctx.lineTo(colX + bayW * 0.10, springY);
      ctx.stroke();
    }

    // Colonnade walkway tier lines
    for (var tl = 0; tl < 3; tl++) {
      var ly = r.y + r.h * (0.39 + tl * 0.26);
      ctx.globalAlpha = alpha * 0.26;
      ctx.beginPath();
      ctx.moveTo(r.x, ly);
      ctx.lineTo(r.x + r.w, ly);
      ctx.stroke();
    }

    var pairCount = isStamp
      ? state.pumas.length
      : Math.max(3, Math.round(2 + (state.pumas.length - 2) * clamp(opts.multiplicity, 0, 1)));

    for (var i = 0; i < pairCount; i++) {
      var pair = state.pumas[i];
      var uPos = isStamp
        ? wrap01(pair.u + (opts.phaseShift || 0) * 0.09)
        : pair.u;
      // Map uPos cleanly inside [0.14..0.86] for stamp or feather smoothly at edges for live stride
      var drawU = 0.12 + uPos * 0.76;
      var feather = isStamp ? 1 : edgeFeather(uPos, 0.09);
      if (feather <= 0.02) continue;

      var scale = (0.74 + pair.lane * 0.15) * clamp(r.w / 180, 0.58, 1.05);
      var unit = uScale * 0.20 * scale;
      var dir = pair.dir;
      var groundY = r.y + pair.v * r.h;
      var cx = r.x + drawU * r.w;

      var girlX = cx - dir * unit * 0.72;
      var pumaX = cx + dir * unit * 0.72;
      var gait = state.reducedMotion || isStamp
        ? Math.sin(pair.stridePhase + (opts.phaseShift || 0))
        : Math.sin(pair.stridePhase);

      ctx.save();
      ctx.globalAlpha = alpha * feather * 0.95;

      // 1. Striding girl silhouette (pleated skirt, poised lean, cloche hat/scarf)
      var gH = unit * 1.18;
      if (!tint) {
        ctx.strokeStyle = PALETTE.sheet;
        ctx.lineWidth = lw * 1.9;
        ctx.beginPath();
        ctx.moveTo(girlX, groundY);
        ctx.lineTo(girlX - dir * gH * 0.08, groundY - gH * 0.85);
        ctx.stroke();
      }

      ctx.fillStyle = inkDark;
      ctx.strokeStyle = inkDark;
      ctx.lineWidth = lw * 1.35;

      // Girl legs in brisk stride
      ctx.beginPath();
      ctx.moveTo(girlX - dir * gH * 0.05, groundY - gH * 0.34);
      ctx.lineTo(girlX - dir * gH * 0.18 + gait * gH * 0.12, groundY);
      ctx.moveTo(girlX + dir * gH * 0.04, groundY - gH * 0.34);
      ctx.lineTo(girlX + dir * gH * 0.18 - gait * gH * 0.12, groundY);
      ctx.stroke();

      // Skirt & waist
      ctx.beginPath();
      ctx.moveTo(girlX - dir * gH * 0.10, groundY - gH * 0.68);
      ctx.lineTo(girlX + dir * gH * 0.11, groundY - gH * 0.68);
      ctx.lineTo(girlX + dir * gH * 0.24, groundY - gH * 0.26);
      ctx.lineTo(girlX - dir * gH * 0.26, groundY - gH * 0.26);
      ctx.closePath();
      ctx.fill();

      // Girl head & cloche hat / trailing scarf
      var gHeadX = girlX - dir * gH * 0.04;
      var gHeadY = groundY - gH * 0.84;
      ctx.beginPath();
      ctx.arc(gHeadX, gHeadY, gH * 0.11, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = inkVermilion;
      ctx.lineWidth = lw * 1.15;
      ctx.beginPath();
      ctx.moveTo(gHeadX - dir * gH * 0.06, gHeadY + gH * 0.10);
      ctx.quadraticCurveTo(
        gHeadX - dir * gH * 0.28,
        gHeadY + gH * 0.05,
        gHeadX - dir * gH * 0.40,
        gHeadY + gH * 0.20
      );
      ctx.stroke();

      // Extended leash hand
      var leashHandX = girlX + dir * gH * 0.28;
      var leashHandY = groundY - gH * 0.56;
      ctx.strokeStyle = inkDark;
      ctx.lineWidth = lw * 1.3;
      ctx.beginPath();
      ctx.moveTo(girlX + dir * gH * 0.05, groundY - gH * 0.64);
      ctx.lineTo(leashHandX, leashHandY);
      ctx.stroke();

      // 2. Prowling Puma on taut leash (muscular cougar silhouette + long S-tail)
      var pLen = unit * 0.96;
      var pBodyY = groundY - unit * 0.42;
      var collarX = pumaX + dir * pLen * 0.34;
      var collarY = pBodyY - unit * 0.08;

      // Taut diagonal vermilion leash + tension ticks
      ctx.strokeStyle = inkVermilion;
      ctx.lineWidth = lw * 1.35;
      ctx.beginPath();
      ctx.moveTo(leashHandX, leashHandY);
      ctx.lineTo(collarX, collarY);
      ctx.stroke();

      var midLX = (leashHandX + collarX) * 0.5;
      var midLY = (leashHandY + collarY) * 0.5;
      ctx.lineWidth = lw * 0.85;
      ctx.beginPath();
      ctx.moveTo(midLX - lw * 1.5, midLY - lw * 2.5);
      ctx.lineTo(midLX + lw * 1.5, midLY - lw * 4.2);
      ctx.moveTo(midLX - lw * 1.5, midLY + lw * 2.5);
      ctx.lineTo(midLX + lw * 1.5, midLY + lw * 4.2);
      ctx.stroke();

      // Four stalking feline legs
      ctx.strokeStyle = inkDark;
      ctx.lineWidth = lw * 1.4;
      var hipX = pumaX - dir * pLen * 0.34;
      var shoulderX = pumaX + dir * pLen * 0.24;
      ctx.beginPath();
      ctx.moveTo(hipX, pBodyY + unit * 0.04);
      ctx.lineTo(hipX - dir * unit * 0.14 + gait * unit * 0.16, groundY);
      ctx.moveTo(hipX + dir * unit * 0.08, pBodyY + unit * 0.04);
      ctx.lineTo(hipX + dir * unit * 0.12 - gait * unit * 0.14, groundY);
      ctx.moveTo(shoulderX, pBodyY + unit * 0.04);
      ctx.lineTo(shoulderX + dir * unit * 0.18 - gait * unit * 0.16, groundY);
      ctx.moveTo(shoulderX - dir * unit * 0.06, pBodyY + unit * 0.04);
      ctx.lineTo(shoulderX - dir * unit * 0.10 + gait * unit * 0.14, groundY);
      ctx.stroke();

      // Puma lithe ochre body with lampblack woodcut contour
      ctx.fillStyle = inkOchre;
      ctx.strokeStyle = inkDark;
      ctx.lineWidth = lw * 1.25;
      ctx.beginPath();
      ctx.moveTo(hipX - dir * pLen * 0.10, pBodyY - unit * 0.06);
      ctx.quadraticCurveTo(pumaX, pBodyY - unit * 0.18, collarX, pBodyY - unit * 0.12);
      // Feline head, rounded ear & prowling muzzle
      ctx.lineTo(collarX + dir * pLen * 0.12, pBodyY - unit * 0.24);
      ctx.lineTo(collarX + dir * pLen * 0.18, pBodyY - unit * 0.17);
      ctx.lineTo(collarX + dir * pLen * 0.30, pBodyY - unit * 0.11);
      ctx.lineTo(collarX + dir * pLen * 0.25, pBodyY - unit * 0.01);
      ctx.lineTo(collarX + dir * pLen * 0.04, pBodyY + unit * 0.04);
      // Tucked feline belly
      ctx.quadraticCurveTo(pumaX, pBodyY + unit * 0.03, hipX - dir * pLen * 0.08, pBodyY + unit * 0.10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Long S-curved cougar tail tipped in carbon
      ctx.strokeStyle = inkDark;
      ctx.lineWidth = lw * 1.55;
      ctx.beginPath();
      ctx.moveTo(hipX - dir * pLen * 0.08, pBodyY - unit * 0.03);
      ctx.bezierCurveTo(
        hipX - dir * pLen * 0.34,
        pBodyY + unit * 0.18,
        hipX - dir * pLen * 0.48,
        pBodyY - unit * 0.22,
        hipX - dir * pLen * 0.58,
        pBodyY - unit * 0.08
      );
      ctx.stroke();

      // Brass/vermilion collar band
      ctx.strokeStyle = inkVermilion;
      ctx.lineWidth = lw * 1.7;
      ctx.beginPath();
      ctx.moveTo(collarX - dir * unit * 0.03, collarY - unit * 0.06);
      ctx.lineTo(collarX + dir * unit * 0.04, collarY + unit * 0.09);
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }

  // =========================================================================
  // STONE 4: WINDOW DIRIGIBLES (Flocks flying in ALL directions at window level)
  // =========================================================================
  function renderWindowDirigibles(ctx, r, state, opts) {
    var alpha = opts.alpha;
    if (alpha <= 0.01) return;
    var isStamp = Boolean(opts.isStamp);
    var tint = opts.tint || null;
    var uScale = Math.min(r.w, r.h);
    var lw = Math.max(0.85, uScale * 0.008);

    var inkPrussian = tint || PALETTE.prussian;
    var inkDark = tint || PALETTE.lampblack;
    var inkVermilion = tint || PALETTE.vermilion;
    var inkOchre = tint || PALETTE.ochre;

    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    if (opts.dx || opts.dy) ctx.translate(opts.dx || 0, opts.dy || 0);

    // Subtle window-level facade mullions so airships unmistakably pass office/apartment windows
    ctx.strokeStyle = inkPrussian;
    ctx.globalAlpha = alpha * (isStamp ? 0.24 : 0.18);
    ctx.lineWidth = Math.max(0.7, lw * 0.75);
    for (var wg = 0; wg < 8; wg++) {
      var wx = r.x + r.w * (0.06 + wg * 0.12);
      var wy = r.y + r.h * 0.28;
      var ww = r.w * 0.055;
      var wh = r.h * 0.58;
      ctx.strokeRect(wx, wy, ww, wh);
      ctx.beginPath();
      ctx.moveTo(wx + ww * 0.5, wy);
      ctx.lineTo(wx + ww * 0.5, wy + wh);
      ctx.moveTo(wx, wy + wh * 0.33);
      ctx.lineTo(wx + ww, wy + wh * 0.33);
      ctx.moveTo(wx, wy + wh * 0.66);
      ctx.lineTo(wx + ww, wy + wh * 0.66);
      ctx.stroke();
    }

    var shipCount = isStamp
      ? state.dirigibles.length
      : Math.max(4, Math.round(3 + (state.dirigibles.length - 3) * clamp(opts.multiplicity, 0, 1)));

    for (var i = 0; i < shipCount; i++) {
      var ship = state.dirigibles[i];
      var uPos = isStamp
        ? wrap01(ship.u + (opts.phaseShift || 0) * 0.07 * ship.dir)
        : ship.u;
      var feather = isStamp ? 1 : edgeFeather(uPos, 0.06);
      if (feather <= 0.02) continue;

      var sx = r.x + (0.05 + uPos * 0.90) * r.w;
      var sy = r.y + ship.v * r.h;
      var rx = clamp(r.w * 0.048, 13, 38) * ship.scale;
      var ry = rx * 0.30;
      var dir = ship.dir;
      var angle = ship.pitch * dir;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);
      ctx.globalAlpha = alpha * feather * (0.78 + ship.depthBand * 0.09);

      // Crisscrossing slipstream wake trail behind stern
      ctx.save();
      safeSetLineDash(ctx, [lw * 2.2, lw * 2.0]);
      ctx.strokeStyle = inkPrussian;
      ctx.globalAlpha *= 0.55;
      ctx.lineWidth = lw * 0.85;
      ctx.beginPath();
      ctx.moveTo(-dir * rx * 1.25, 0);
      ctx.lineTo(-dir * rx * 2.15, 0);
      ctx.stroke();
      ctx.restore();

      // Rag-cotton separation contour so dirigibles stand out sharply over skyscraper window grids
      if (!tint) {
        ctx.strokeStyle = PALETTE.sheet;
        ctx.lineWidth = lw * 2.2;
        ctx.beginPath();
        drawEllipse(ctx, 0, 0, rx, ry, 0);
        ctx.stroke();
      }

      // Tail stabilizer fins (vermilion & Prussian)
      var tailX = -dir * rx * 0.88;
      ctx.fillStyle = inkVermilion;
      ctx.strokeStyle = inkDark;
      ctx.lineWidth = lw * 0.95;
      ctx.beginPath();
      ctx.moveTo(tailX + dir * rx * 0.22, -ry * 0.45);
      ctx.lineTo(tailX - dir * rx * 0.28, -ry * 1.48);
      ctx.lineTo(tailX - dir * rx * 0.16, 0);
      ctx.lineTo(tailX - dir * rx * 0.28, ry * 1.48);
      ctx.lineTo(tailX + dir * rx * 0.22, ry * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Main rigid zeppelin envelope hull
      ctx.fillStyle = ship.stripeStyle === 0 ? inkOchre : ship.stripeStyle === 1 ? inkPrussian : PALETTE.sheet;
      ctx.beginPath();
      drawEllipse(ctx, 0, 0, rx, ry, 0);
      ctx.fill();

      ctx.strokeStyle = inkDark;
      ctx.lineWidth = lw * 1.25;
      ctx.beginPath();
      drawEllipse(ctx, 0, 0, rx, ry, 0);
      ctx.stroke();

      // Longitudinal hull ribs & vertical structural rings
      ctx.strokeStyle = ship.stripeStyle === 1 && !tint ? PALETTE.sheet : inkPrussian;
      ctx.lineWidth = Math.max(0.65, lw * 0.72);
      ctx.beginPath();
      drawEllipse(ctx, 0, 0, rx * 0.96, ry * 0.48, 0);
      ctx.moveTo(-rx * 0.98, 0);
      ctx.lineTo(rx * 0.98, 0);
      ctx.moveTo(-rx * 0.35, -ry * 0.93);
      ctx.lineTo(-rx * 0.35, ry * 0.93);
      ctx.moveTo(rx * 0.35, -ry * 0.93);
      ctx.lineTo(rx * 0.35, ry * 0.93);
      ctx.stroke();

      // Suspended gondola cabin + rigging cables + spinning propeller
      var gondW = rx * 0.62;
      var gondH = Math.max(2.4, ry * 0.52);
      var gondY = ry * 1.05;

      ctx.strokeStyle = inkDark;
      ctx.lineWidth = Math.max(0.7, lw * 0.78);
      ctx.beginPath();
      ctx.moveTo(-gondW * 0.45, ry * 0.85);
      ctx.lineTo(-gondW * 0.38, gondY);
      ctx.moveTo(gondW * 0.45, ry * 0.85);
      ctx.lineTo(gondW * 0.38, gondY);
      ctx.stroke();

      ctx.fillStyle = inkDark;
      ctx.fillRect(-gondW * 0.5, gondY, gondW, gondH);

      if (!tint) {
        ctx.fillStyle = inkOchre;
        for (var pw = -1; pw <= 1; pw++) {
          ctx.fillRect(pw * gondW * 0.26 - gondW * 0.06, gondY + gondH * 0.22, gondW * 0.13, gondH * 0.54);
        }
      }

      // Stern propeller blades
      var propSpin = state.reducedMotion || isStamp ? 0.75 : Math.sin(ship.propPhase);
      var propX = -gondW * 0.58 * dir;
      var propY = gondY + gondH * 0.5;
      ctx.strokeStyle = inkVermilion;
      ctx.lineWidth = lw * 0.95;
      ctx.beginPath();
      ctx.moveTo(propX, propY - gondH * (0.55 + Math.abs(propSpin) * 0.45));
      ctx.lineTo(propX, propY + gondH * (0.55 + Math.abs(propSpin) * 0.45));
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }

  // =========================================================================
  // STONE 5: SAILOR TATTOOS (Crowded parlors drawing anchors, serpents & stars)
  // =========================================================================
  function drawTattooEmblem(ctx, motif, cx, cy, rad, primaryColor, accentColor, lw) {
    ctx.save();
    ctx.lineWidth = Math.max(0.85, lw);
    if (motif === 'anchor') {
      ctx.strokeStyle = primaryColor;
      ctx.beginPath();
      // Top ring
      ctx.arc(cx, cy - rad * 0.72, rad * 0.18, 0, Math.PI * 2);
      // Shank & crossbar stock
      ctx.moveTo(cx, cy - rad * 0.54);
      ctx.lineTo(cx, cy + rad * 0.72);
      ctx.moveTo(cx - rad * 0.52, cy - rad * 0.26);
      ctx.lineTo(cx + rad * 0.52, cy - rad * 0.26);
      // Curved flukes
      ctx.moveTo(cx - rad * 0.68, cy + rad * 0.24);
      ctx.quadraticCurveTo(cx, cy + rad * 0.98, cx + rad * 0.68, cy + rad * 0.24);
      ctx.stroke();
      // Coiled vermilion rope around shank
      ctx.strokeStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(cx - rad * 0.22, cy - rad * 0.08);
      ctx.lineTo(cx + rad * 0.22, cy + rad * 0.18);
      ctx.moveTo(cx + rad * 0.22, cy + rad * 0.18);
      ctx.lineTo(cx - rad * 0.20, cy + rad * 0.42);
      ctx.stroke();
    } else if (motif === 'serpent') {
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = Math.max(1.0, lw * 1.25);
      ctx.beginPath();
      ctx.moveTo(cx - rad * 0.55, cy + rad * 0.65);
      ctx.bezierCurveTo(
        cx + rad * 0.85,
        cy + rad * 0.35,
        cx - rad * 0.85,
        cy - rad * 0.35,
        cx + rad * 0.42,
        cy - rad * 0.62
      );
      ctx.stroke();
      // Forked tongue & serpent head
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = Math.max(0.75, lw * 0.85);
      ctx.beginPath();
      ctx.moveTo(cx + rad * 0.42, cy - rad * 0.62);
      ctx.lineTo(cx + rad * 0.72, cy - rad * 0.74);
      ctx.moveTo(cx + rad * 0.42, cy - rad * 0.62);
      ctx.lineTo(cx + rad * 0.70, cy - rad * 0.50);
      ctx.stroke();
    } else {
      // Nautical 8-point compass star + pierced dots
      ctx.strokeStyle = accentColor;
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      for (var p = 0; p < 8; p++) {
        var ang = (p * Math.PI) / 4 - Math.PI / 2;
        var rr = p % 2 === 0 ? rad * 0.88 : rad * 0.34;
        var px = cx + Math.cos(ang) * rr;
        var py = cy + Math.sin(ang) * rr;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderSailorTattoos(ctx, r, state, opts) {
    var alpha = opts.alpha;
    if (alpha <= 0.01) return;
    var isStamp = Boolean(opts.isStamp);
    var tint = opts.tint || null;
    var uScale = Math.min(r.w, r.h);
    var lw = Math.max(0.9, uScale * 0.0085);

    var inkDark = tint || PALETTE.lampblack;
    var inkPrussian = tint || PALETTE.prussian;
    var inkVermilion = tint || PALETTE.vermilion;
    var inkOchre = tint || PALETTE.ochre;
    var inkVerdigris = tint || PALETTE.verdigris;

    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    if (opts.dx || opts.dy) ctx.translate(opts.dx || 0, opts.dy || 0);

    // Open-front tattoo parlor awnings & hanging flash sheets along the street
    for (var tier = 0; tier < 3; tier++) {
      var ay = r.y + r.h * (0.09 + tier * 0.28);
      var awH = r.h * 0.055;
      ctx.strokeStyle = inkPrussian;
      ctx.globalAlpha = alpha * 0.45;
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.moveTo(r.x + r.w * 0.04, ay);
      ctx.lineTo(r.x + r.w * 0.96, ay);
      ctx.stroke();

      var stripes = 9;
      var sw = (r.w * 0.92) / stripes;
      for (var st = 0; st < stripes; st++) {
        ctx.fillStyle = st % 2 === 0 ? inkVermilion : inkPrussian;
        ctx.globalAlpha = alpha * 0.26;
        ctx.fillRect(r.x + r.w * 0.04 + st * sw, ay, sw * 0.88, awH);
      }
    }

    // Hanging parlor flash banners at upper corners displaying crisp anchor, serpent, star
    var flashSize = clamp(uScale * 0.075, 7, 17);
    var flashMotifs = ['anchor', 'serpent', 'star'];
    for (var fm = 0; fm < 3; fm++) {
      var fx = r.x + r.w * (0.18 + fm * 0.32);
      var fy = r.y + r.h * 0.19;
      ctx.save();
      if (!tint) {
        ctx.fillStyle = PALETTE.sheet;
        ctx.globalAlpha = alpha * 0.82;
        ctx.fillRect(fx - flashSize, fy - flashSize, flashSize * 2, flashSize * 2.1);
      }
      ctx.strokeStyle = inkPrussian;
      ctx.globalAlpha = alpha * 0.85;
      ctx.lineWidth = lw * 0.9;
      ctx.strokeRect(fx - flashSize, fy - flashSize, flashSize * 2, flashSize * 2.1);
      drawTattooEmblem(
        ctx,
        flashMotifs[fm],
        fx,
        fy + flashSize * 0.05,
        flashSize * 0.76,
        inkPrussian,
        fm === 1 ? inkVerdigris : inkVermilion,
        lw * 1.05
      );
      ctx.restore();
    }

    var stationCount = isStamp
      ? state.tattooStations.length
      : Math.max(2, Math.round(2 + (state.tattooStations.length - 2) * clamp(opts.multiplicity, 0, 1)));

    for (var i = 0; i < stationCount; i++) {
      var stn = state.tattooStations[i];
      var sx = r.x + stn.u * r.w;
      var sy = r.y + stn.v * r.h;
      var unit = uScale * (0.16 + stn.tier * 0.025) * clamp(r.w / 170, 0.62, 1.05);
      var buzz = state.reducedMotion || isStamp ? 0.5 : Math.sin(stn.buzzPhase);

      ctx.save();
      ctx.globalAlpha = alpha * 0.94;

      // Crowded waiting sailor beside bench (in white-topped mariner cap)
      var waitX = sx + stn.extraSailorSide * unit * 0.95;
      var waitY = sy - unit * 0.08;
      ctx.fillStyle = inkPrussian;
      ctx.beginPath();
      ctx.arc(waitX, waitY - unit * 0.64, unit * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(waitX - unit * 0.22, waitY - unit * 0.48, unit * 0.44, unit * 0.42);
      if (!tint) {
        ctx.fillStyle = PALETTE.sheet;
        ctx.fillRect(waitX - unit * 0.17, waitY - unit * 0.82, unit * 0.34, unit * 0.11);
      }

      // Seated broad-shouldered sailor with bared arm/shoulder skin canvas
      var sailorX = sx - unit * 0.30;
      ctx.fillStyle = inkPrussian;
      ctx.strokeStyle = inkDark;
      ctx.lineWidth = lw * 1.2;
      // Torso
      ctx.beginPath();
      ctx.moveTo(sailorX - unit * 0.34, sy);
      ctx.lineTo(sailorX - unit * 0.28, sy - unit * 0.62);
      ctx.lineTo(sailorX + unit * 0.28, sy - unit * 0.62);
      ctx.lineTo(sailorX + unit * 0.32, sy);
      ctx.closePath();
      ctx.fill();

      // Sailor V-collar & mariner cap
      if (!tint) {
        ctx.strokeStyle = PALETTE.sheet;
        ctx.lineWidth = lw * 1.1;
        ctx.beginPath();
        ctx.moveTo(sailorX - unit * 0.16, sy - unit * 0.60);
        ctx.lineTo(sailorX, sy - unit * 0.42);
        ctx.lineTo(sailorX + unit * 0.16, sy - unit * 0.60);
        ctx.stroke();
      }
      ctx.fillStyle = inkDark;
      ctx.beginPath();
      ctx.arc(sailorX, sy - unit * 0.78, unit * 0.17, 0, Math.PI * 2);
      ctx.fill();
      if (!tint) {
        ctx.fillStyle = PALETTE.sheet;
        ctx.fillRect(sailorX - unit * 0.20, sy - unit * 0.98, unit * 0.40, unit * 0.13);
      }
      ctx.strokeStyle = inkDark;
      ctx.lineWidth = lw * 0.9;
      ctx.strokeRect(sailorX - unit * 0.20, sy - unit * 0.98, unit * 0.40, unit * 0.13);

      // Bared muscular forearm/shoulder skin pad where tattoo is actively inked
      var armX = sx + unit * 0.08;
      var armY = sy - unit * 0.38;
      var armRx = unit * 0.34;
      var armRy = unit * 0.22;
      if (!tint) {
        ctx.fillStyle = PALETTE.sheet;
        ctx.beginPath();
        drawEllipse(ctx, armX, armY, armRx, armRy, -0.12);
        ctx.fill();
      }
      ctx.strokeStyle = inkDark;
      ctx.lineWidth = lw * 1.15;
      ctx.beginPath();
      drawEllipse(ctx, armX, armY, armRx, armRy, -0.12);
      ctx.stroke();

      // Active tattoo motif inked onto sailor's bared skin
      drawTattooEmblem(
        ctx,
        stn.motif,
        armX - armRx * 0.08,
        armY,
        armRy * 0.85,
        inkPrussian,
        inkVermilion,
        lw * 1.05
      );

      // Pierced pattern pin-dots beside tattoo
      ctx.fillStyle = inkVermilion;
      for (var pd = 0; pd < 4; pd++) {
        ctx.fillRect(armX + armRx * 0.34 + (pd % 2) * lw * 2.1, armY - lw * 2 + Math.floor(pd / 2) * lw * 2.4, lw * 1.1, lw * 1.1);
      }

      // Tattoo artist bent forward wielding buzzing needle + ink pots on bench
      var artX = sx + unit * 0.56;
      ctx.fillStyle = inkDark;
      ctx.beginPath();
      ctx.arc(artX - unit * 0.08, sy - unit * 0.72, unit * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(artX - unit * 0.18, sy);
      ctx.lineTo(artX - unit * 0.16, sy - unit * 0.56);
      ctx.lineTo(artX + unit * 0.20, sy - unit * 0.50);
      ctx.lineTo(artX + unit * 0.24, sy);
      ctx.closePath();
      ctx.fill();

      // Artist arm & buzzing brass/carbon needle touching tattoo
      var needleTipX = armX + armRx * 0.15 + buzz * lw * 0.9;
      var needleTipY = armY - armRy * 0.10;
      ctx.strokeStyle = inkDark;
      ctx.lineWidth = lw * 1.3;
      ctx.beginPath();
      ctx.moveTo(artX - unit * 0.10, sy - unit * 0.50);
      ctx.lineTo(needleTipX + unit * 0.16, needleTipY - unit * 0.14);
      ctx.stroke();

      ctx.strokeStyle = inkOchre;
      ctx.lineWidth = lw * 1.2;
      ctx.beginPath();
      ctx.moveTo(needleTipX + unit * 0.20, needleTipY - unit * 0.18);
      ctx.lineTo(needleTipX, needleTipY);
      ctx.stroke();

      // Radiating buzz-sparks at needle contact
      ctx.strokeStyle = inkVermilion;
      ctx.lineWidth = lw * 0.85;
      for (var sp = 0; sp < 3; sp++) {
        var sAng = -1.2 + sp * 0.65 + buzz * 0.2;
        ctx.beginPath();
        ctx.moveTo(needleTipX + Math.cos(sAng) * lw * 2.0, needleTipY + Math.sin(sAng) * lw * 2.0);
        ctx.lineTo(needleTipX + Math.cos(sAng) * lw * 4.4, needleTipY + Math.sin(sAng) * lw * 4.4);
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  // =========================================================================
  // STONE 6: HUMID UNDERGROUND (Subway cars crammed with obese women fanning)
  // =========================================================================
  function renderHumidUnderground(ctx, r, state, opts) {
    var alpha = opts.alpha;
    if (alpha <= 0.01) return;
    var isStamp = Boolean(opts.isStamp);
    var tint = opts.tint || null;
    var uScale = Math.min(r.w, r.h);
    var lw = Math.max(0.9, uScale * 0.009);
    var t = state.reducedMotion || isStamp ? (opts.phaseShift || 0) : state.time;

    var inkDark = tint || PALETTE.lampblack;
    var inkPrussian = tint || PALETTE.prussian;
    var inkVermilion = tint || PALETTE.vermilion;
    var inkOchre = tint || PALETTE.ochre;
    var inkVerdigris = tint || PALETTE.verdigris;

    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    if (opts.dx || opts.dy) ctx.translate(opts.dx || 0, opts.dy || 0);

    // Subterranean tunnel vault ceiling & riveted iron ribs
    ctx.strokeStyle = inkDark;
    ctx.fillStyle = inkVerdigris;
    ctx.globalAlpha = alpha * 0.16;
    ctx.fillRect(r.x, r.y, r.w, r.h * 0.19);

    ctx.globalAlpha = alpha * 0.68;
    ctx.lineWidth = lw * 1.4;
    ctx.beginPath();
    ctx.moveTo(r.x, r.y + r.h * 0.16);
    ctx.quadraticCurveTo(r.x + r.w * 0.5, r.y + r.h * 0.05, r.x + r.w, r.y + r.h * 0.16);
    ctx.stroke();

    // Steel rails & crossties along tunnel floor
    var railY = r.y + r.h * 0.89;
    ctx.strokeStyle = inkDark;
    ctx.lineWidth = lw * 1.5;
    ctx.globalAlpha = alpha * 0.78;
    ctx.beginPath();
    ctx.moveTo(r.x + r.w * 0.01, railY);
    ctx.lineTo(r.x + r.w * 0.99, railY);
    ctx.moveTo(r.x + r.w * 0.01, railY + r.h * 0.04);
    ctx.lineTo(r.x + r.w * 0.99, railY + r.h * 0.04);
    ctx.stroke();

    for (var tie = 0; tie < 28; tie++) {
      var tieX = r.x + (tie / 27) * r.w * 0.96 + r.w * 0.02;
      ctx.lineWidth = lw * 1.1;
      ctx.beginPath();
      ctx.moveTo(tieX, railY - r.h * 0.01);
      ctx.lineTo(tieX - r.w * 0.008, railY + r.h * 0.06);
      ctx.stroke();
    }

    // Coupled subway carriages
    var carTopBase = r.y + r.h * 0.24;
    var carH = r.h * 0.60;
    var activeCars = isStamp
      ? state.subwayCars.length
      : Math.max(2, Math.round(2 + (state.subwayCars.length - 2) * clamp(opts.multiplicity, 0, 1)));

    for (var c = 0; c < activeCars; c++) {
      var car = state.subwayCars[c];
      var jostle = state.reducedMotion || isStamp ? 0 : Math.sin(t * 9.5 + car.jostlePhase) * lw * 0.75;
      var cx = r.x + car.u0 * r.w;
      var cw = car.w * r.w;
      var cy = carTopBase + jostle;

      // Coupled accordion vestibule to next car
      if (c < activeCars - 1) {
        ctx.fillStyle = inkDark;
        ctx.globalAlpha = alpha * 0.72;
        ctx.fillRect(cx + cw, cy + carH * 0.14, r.w * 0.018, carH * 0.78);
      }

      // Clerestory roof arch
      ctx.fillStyle = inkPrussian;
      ctx.strokeStyle = inkDark;
      ctx.globalAlpha = alpha * 0.88;
      ctx.lineWidth = lw * 1.3;
      ctx.beginPath();
      ctx.moveTo(cx + cw * 0.04, cy);
      ctx.lineTo(cx + cw * 0.96, cy);
      ctx.lineTo(cx + cw, cy + carH * 0.12);
      ctx.lineTo(cx, cy + carH * 0.12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Steel carriage body
      ctx.fillStyle = inkPrussian;
      ctx.globalAlpha = alpha * (isStamp ? 0.22 : 0.26);
      ctx.fillRect(cx, cy + carH * 0.12, cw, carH * 0.84);
      ctx.globalAlpha = alpha * 0.88;
      ctx.strokeRect(cx, cy + carH * 0.12, cw, carH * 0.84);

      // Bogie wheels
      var wheelR = Math.max(2.5, carH * 0.085);
      var wheelOffsets = [0.16, 0.28, 0.72, 0.84];
      ctx.fillStyle = inkDark;
      for (var wo = 0; wo < wheelOffsets.length; wo++) {
        ctx.beginPath();
        ctx.arc(cx + cw * wheelOffsets[wo], railY - wheelR * 0.35, wheelR, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4 glowing muggy carriage windows crammed window-to-window
      var winY = cy + carH * 0.20;
      var winH = carH * 0.54;
      var winW = cw * 0.20;
      for (var w = 0; w < 4; w++) {
        var wx = cx + cw * (0.05 + w * 0.233);
        if (!tint) {
          ctx.fillStyle = inkOchre;
          ctx.globalAlpha = alpha * 0.38;
          ctx.fillRect(wx, winY, winW, winH);
        }
        ctx.strokeStyle = inkDark;
        ctx.globalAlpha = alpha * 0.86;
        ctx.lineWidth = lw * 1.1;
        ctx.strokeRect(wx, winY, winW, winH);
      }
    }

    // Crammed obese women suffering from humidity & fluttering fans in unison
    for (var pIdx = 0; pIdx < state.passengers.length; pIdx++) {
      var pass = state.passengers[pIdx];
      if (pass.carIndex >= activeCars) continue;
      var pCar = state.subwayCars[pass.carIndex];
      var pJostle = state.reducedMotion || isStamp ? 0 : Math.sin(t * 9.5 + pCar.jostlePhase) * lw * 0.75;
      var px = r.x + pass.u * r.w;
      var py = carTopBase + pJostle + carH * 0.73;

      var bodyRx = clamp(pCar.w * r.w * 0.095, 5.5, 19) * pass.bodyScale;
      var bodyRy = carH * 0.24 * pass.bodyScale;

      ctx.save();
      ctx.globalAlpha = alpha * 0.94;

      // Voluminous crammed shoulders & bust pressed window-to-window
      ctx.fillStyle = inkDark;
      ctx.beginPath();
      drawEllipse(ctx, px, py - bodyRy * 0.35, bodyRx, bodyRy * 0.88, 0);
      ctx.fill();

      // Rounded tilted head gasping in thick humidity
      var headR = Math.max(2.6, bodyRx * 0.46);
      var headY = py - bodyRy * 1.24;
      ctx.beginPath();
      ctx.arc(px, headY, headR, 0, Math.PI * 2);
      ctx.fill();

      // Coiffed bun
      ctx.beginPath();
      ctx.arc(px - headR * 0.48, headY - headR * 0.72, headR * 0.42, 0, Math.PI * 2);
      ctx.fill();

      // Ribbed folding fan fluttering in unison
      var flutter = state.reducedMotion || isStamp
        ? Math.sin(pass.fanPhase * 3.1) * 0.28
        : Math.sin(t * 7.6 + pass.fanPhase) * 0.46;
      var fanPivotX = px + bodyRx * 0.36;
      var fanPivotY = py - bodyRy * 0.82;
      var fanRad = Math.max(4.5, bodyRx * 0.88);
      var fanMidAngle = -Math.PI * 0.62 + flutter;

      ctx.fillStyle = tint
        ? tint
        : pass.fanColor === 0
          ? inkVermilion
          : pass.fanColor === 1
            ? PALETTE.sheet
            : inkOchre;
      ctx.strokeStyle = inkDark;
      ctx.lineWidth = Math.max(0.65, lw * 0.75);
      ctx.beginPath();
      ctx.moveTo(fanPivotX, fanPivotY);
      ctx.arc(fanPivotX, fanPivotY, fanRad, fanMidAngle - 0.56, fanMidAngle + 0.56);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Fan ribs
      ctx.beginPath();
      for (var rb = -1; rb <= 1; rb++) {
        var rAng = fanMidAngle + rb * 0.28;
        ctx.moveTo(fanPivotX, fanPivotY);
        ctx.lineTo(fanPivotX + Math.cos(rAng) * fanRad, fanPivotY + Math.sin(rAng) * fanRad);
      }
      ctx.stroke();

      ctx.restore();
    }

    // Thick rising verdigris & ochre humidity plumes curling through carriages and tunnel vault
    var wispCount = isStamp
      ? state.steamWisps.length
      : Math.max(6, Math.round(6 + (state.steamWisps.length - 6) * clamp(opts.multiplicity, 0, 1)));

    ctx.strokeStyle = inkVerdigris;
    for (var sw = 0; sw < wispCount; sw++) {
      var wisp = state.steamWisps[sw];
      var wx = r.x + wisp.u * r.w;
      var wy = r.y + wisp.v * r.h;
      var wLen = r.w * 0.085;
      var wAmp = r.h * 0.055;
      ctx.globalAlpha = alpha * (sw % 3 === 0 ? 0.56 : 0.38);
      ctx.lineWidth = lw * (sw % 2 === 0 ? 1.4 : 0.95);
      ctx.beginPath();
      ctx.moveTo(wx - wLen * 0.5, wy);
      ctx.bezierCurveTo(
        wx - wLen * 0.16,
        wy - wAmp,
        wx + wLen * 0.16,
        wy + wAmp,
        wx + wLen * 0.5,
        wy - wAmp * 0.35
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  var STONE_RENDERERS = {
    cobble_canes: renderCobbleCanes,
    skyscraper_cornices: renderSkyscraperCornices,
    leashed_pumas: renderLeashedPumas,
    window_dirigibles: renderWindowDirigibles,
    sailor_tattoos: renderSailorTattoos,
    humid_underground: renderHumidUnderground
  };

  var STAMP_SEPARATION_INKS = {
    cobble_canes: [null, PALETTE.vermilion, PALETTE.prussian, PALETTE.lampblack, PALETTE.ochre],
    skyscraper_cornices: [null, PALETTE.prussian, PALETTE.vermilion, PALETTE.lampblack, PALETTE.ochre],
    leashed_pumas: [null, PALETTE.ochre, PALETTE.vermilion, PALETTE.prussian, PALETTE.lampblack],
    window_dirigibles: [null, PALETTE.ochre, PALETTE.prussian, PALETTE.vermilion, PALETTE.lampblack],
    sailor_tattoos: [null, PALETTE.vermilion, PALETTE.prussian, PALETTE.verdigris, PALETTE.lampblack],
    humid_underground: [null, PALETTE.verdigris, PALETTE.ochre, PALETTE.prussian, PALETTE.lampblack]
  };

  function stampStone(state, stoneId, stampCtx, width, height) {
    if (!state) {
      return { stoneId: stoneId, stamps: 0, permanenceDelta: 0.28 };
    }
    var targetId = STONE_SET[stoneId] ? stoneId : STONE_IDS[0];
    if (!state.stamps) state.stamps = {};
    if (!state.stonePermanence) state.stonePermanence = {};

    var nextCount = (state.stamps[targetId] || 0) + 1;
    state.stamps[targetId] = nextCount;
    state.totalStamps = (state.totalStamps || 0) + 1;
    var delta = 0.28;
    state.stonePermanence[targetId] = clamp((state.stonePermanence[targetId] || 0) + delta, 0, 1);

    if (stampCtx && width > 0 && height > 0) {
      var r = pixelRect(targetId, width, height);
      var drawFn = STONE_RENDERERS[targetId];
      var sepList = STAMP_SEPARATION_INKS[targetId];
      var sepTint = sepList[(nextCount - 1) % sepList.length];

      // Golden-angle printmaker registration micro-offset per overprint pull
      var regUnit = clamp(Math.min(width, height) * 0.0022, 1.1, 3.2);
      var golden = (nextCount - 1) * 2.399963;
      var dx = nextCount === 1 ? 0 : Math.cos(golden) * regUnit * (1 + ((nextCount - 1) % 3) * 0.42);
      var dy = nextCount === 1 ? 0 : Math.sin(golden) * regUnit * (1 + ((nextCount - 1) % 3) * 0.42);

      // Ink density builds boldly on first 4 pulls, then tapers with counter-relief cuts so silhouettes stay razor-legible
      var passAlpha = nextCount === 1
        ? 0.54
        : nextCount === 2
          ? 0.42
          : nextCount === 3
            ? 0.34
            : Math.max(0.14, 0.28 / (1 + (nextCount - 4) * 0.34));

      stampCtx.save();
      if (nextCount > 1) {
        try {
          stampCtx.globalCompositeOperation = 'multiply';
        } catch (_e) {
          // Fallback to source-over on minimal mock contexts
        }
      }

      drawFn(stampCtx, r, state, {
        alpha: passAlpha,
        multiplicity: 1,
        isStamp: true,
        tint: sepTint,
        dx: dx,
        dy: dy,
        phaseShift: (nextCount - 1) * 0.62,
        reliefPass: false
      });
      stampCtx.restore();

      // Periodic woodcut relief highlight pass prevents mud on heavily stamped plates
      if (nextCount >= 4 && nextCount % 2 === 0) {
        stampCtx.save();
        drawFn(stampCtx, r, state, {
          alpha: 0.22,
          multiplicity: 1,
          isStamp: true,
          tint: null,
          dx: 0,
          dy: 0,
          phaseShift: 0,
          reliefPass: true
        });
        stampCtx.restore();
      }

      drawRegistrationMarks(
        stampCtx,
        r,
        sepTint || PALETTE.vermilion,
        nextCount,
        clamp(0.32 + nextCount * 0.06, 0.32, 0.72)
      );
    }

    return {
      stoneId: targetId,
      stamps: nextCount,
      permanenceDelta: delta
    };
  }

  function drawActiveFocusFrame(ctx, r, width, height) {
    var arm = clamp(Math.min(width, height) * 0.018, 8, 16);
    ctx.save();
    ctx.strokeStyle = PALETTE.vermilion;
    ctx.lineWidth = Math.max(1.4, arm * 0.14);
    ctx.globalAlpha = 0.82;
    ctx.beginPath();
    // Top-left
    ctx.moveTo(r.x, r.y + arm);
    ctx.lineTo(r.x, r.y);
    ctx.lineTo(r.x + arm, r.y);
    // Top-right
    ctx.moveTo(r.x + r.w - arm, r.y);
    ctx.lineTo(r.x + r.w, r.y);
    ctx.lineTo(r.x + r.w, r.y + arm);
    // Bottom-left
    ctx.moveTo(r.x, r.y + r.h - arm);
    ctx.lineTo(r.x, r.y + r.h);
    ctx.lineTo(r.x + arm, r.y + r.h);
    // Bottom-right
    ctx.moveTo(r.x + r.w - arm, r.y + r.h);
    ctx.lineTo(r.x + r.w, r.y + r.h);
    ctx.lineTo(r.x + r.w, r.y + r.h - arm);
    ctx.stroke();
    ctx.restore();
  }

  function renderLive(ctx, width, height, state, params) {
    if (!ctx || !state || width <= 0 || height <= 0) return;
    var p = params || {};
    var reduced = Boolean(p.reducedMotion || state.reducedMotion);

    // Render order ensures skyscraper cornices sit cleanly behind window-level dirigibles in the sky stratum
    var renderOrder = [
      'skyscraper_cornices',
      'window_dirigibles',
      'cobble_canes',
      'leashed_pumas',
      'sailor_tattoos',
      'humid_underground'
    ];

    var maxPresence = 0;
    var metrics = {};
    for (var m = 0; m < renderOrder.length; m++) {
      var sid = renderOrder[m];
      metrics[sid] = computeStonePresence(state, p, sid);
      if (metrics[sid].presence > maxPresence) {
        maxPresence = metrics[sid].presence;
      }
    }

    // Subtle press-bed stratum divider hairlines when swarming echoes are active
    if (maxPresence > 0.04) {
      ctx.save();
      ctx.strokeStyle = PALETTE.prussian;
      ctx.globalAlpha = maxPresence * 0.24;
      ctx.lineWidth = Math.max(0.8, Math.min(width, height) * 0.0014);
      safeSetLineDash(ctx, [6, 4]);
      ctx.beginPath();
      ctx.moveTo(width * 0.04, height * 0.37);
      ctx.lineTo(width * 0.96, height * 0.37);
      ctx.moveTo(width * 0.04, height * 0.71);
      ctx.lineTo(width * 0.96, height * 0.71);
      ctx.stroke();
      ctx.restore();
    }

    for (var i = 0; i < renderOrder.length; i++) {
      var stoneId = renderOrder[i];
      var info = metrics[stoneId];
      if (info.presence <= 0.015) {
        if (info.focused) {
          drawActiveFocusFrame(ctx, pixelRect(stoneId, width, height), width, height);
        }
        continue;
      }

      var rect = pixelRect(stoneId, width, height);
      var drawFn = STONE_RENDERERS[stoneId];
      var liveAlpha = clamp(0.14 + info.presence * 0.84 + (info.focused ? 0.08 : 0), 0, 0.98);
      var multiplicity = clamp(0.22 + info.presence * 0.95, 0, 1);

      // When reducedMotion is true, render crisp static woodcut multi-exposure registration plates
      if (reduced && info.presence > 0.12) {
        var regShift = clamp(Math.min(width, height) * 0.0024, 1.3, 2.8);
        drawFn(ctx, rect, state, {
          alpha: liveAlpha * 0.30,
          multiplicity: multiplicity,
          isStamp: false,
          tint: stoneId === 'humid_underground' ? PALETTE.verdigris : PALETTE.vermilion,
          dx: regShift,
          dy: regShift * 0.75,
          phaseShift: 0.45
        });
      }

      drawFn(ctx, rect, state, {
        alpha: liveAlpha,
        multiplicity: multiplicity,
        isStamp: false,
        tint: null,
        dx: 0,
        dy: 0,
        phaseShift: 0
      });

      if (info.focused) {
        drawActiveFocusFrame(ctx, rect, width, height);
      }
    }
  }

  function getMemoryCaption(stoneId) {
    if (stoneId && MEMORY_CAPTIONS[stoneId]) {
      return MEMORY_CAPTIONS[stoneId];
    }
    return 'Zirma is redundant: it repeats its signs so that the city can begin to exist in memory.';
  }

  function makeCue(stoneId, type, timbre, freq, endFreq, duration, gain, delay, pan, filterFreq, polyRatio) {
    return {
      stoneId: stoneId,
      type: type,
      timbre: timbre,
      freq: freq,
      endFreq: endFreq || freq,
      duration: duration,
      gain: gain,
      delay: delay,
      offset: delay,
      timeOffset: delay,
      pan: pan,
      filterFreq: filterFreq || freq * 2.2,
      polyRatio: polyRatio || '3:2'
    };
  }

  function getPolyrhythmCues(stoneId, density) {
    var sid = STONE_SET[stoneId] ? stoneId : 'cobble_canes';
    var rawD = Number.isFinite(density) ? density : 0.65;
    var normD = rawD > 1 ? clamp(rawD / 5, 0.25, 1) : clamp(rawD, 0.15, 1);
    var count = Math.max(3, Math.round(3 + normD * 6));
    var cues = [];
    var k;

    if (sid === 'cobble_canes') {
      // Interlocking 3:4:5 wood/cobble cane taps + resonant street shouts
      var caneFreqs = [740, 920, 660, 1080, 830, 990, 710, 1140, 880];
      var caneStep = [0, 0.065, 0.115, 0.185, 0.235, 0.305, 0.355, 0.42, 0.475];
      for (k = 0; k < count; k++) {
        var isShout = k === 2 || k === 6;
        cues.push(
          isShout
            ? makeCue(sid, 'sawtooth', 'blind_man_shout', 235 + k * 14, 195, 0.16, 0.065, caneStep[k], -0.65 + k * 0.12, 920, '4:3')
            : makeCue(sid, 'triangle', 'cobble_cane_tap', caneFreqs[k], caneFreqs[k] * 0.68, 0.048, 0.095, caneStep[k], -0.75 + k * 0.14, 1850, '3:4:5')
        );
      }
    } else if (sid === 'skyscraper_cornices') {
      // High cornice wind whistling + dizzying pendulum harmonic dyads
      var windFreqs = [587.3, 622.3, 784.0, 830.6, 698.5, 932.3, 659.3, 880.0, 1046.5];
      for (k = 0; k < count; k++) {
        cues.push(
          makeCue(
            sid,
            k % 2 === 0 ? 'sine' : 'triangle',
            'cornice_vertigo_wind',
            windFreqs[k],
            windFreqs[k] * (k % 2 === 0 ? 0.94 : 1.05),
            0.22,
            0.055,
            k * 0.058,
            -0.8 + (k / Math.max(1, count - 1)) * 1.6,
            1500,
            '5:4'
          )
        );
      }
    } else if (sid === 'leashed_pumas') {
      // Soft prowling 4-beat paw pads + taut brass collar/leash tension pings
      for (k = 0; k < count; k++) {
        var isLeash = k % 3 === 2;
        cues.push(
          isLeash
            ? makeCue(sid, 'sine', 'taut_leash_collar', 1360 + k * 45, 1180, 0.045, 0.055, k * 0.07, -0.25 + (k % 3) * 0.25, 2400, '3:2')
            : makeCue(sid, 'triangle', 'puma_prowl_stride', 108 + (k % 4) * 14, 76, 0.095, 0.09, k * 0.072, -0.2 + (k % 4) * 0.14, 420, '4:3')
        );
      }
    } else if (sid === 'window_dirigibles') {
      // Beating multi-directional airship propeller drones passing skyscraper windows
      var propFreqs = [92.5, 110.0, 138.6, 164.8, 123.5, 185.0, 146.8, 220.0, 196.0];
      for (k = 0; k < count; k++) {
        var dirSign = k % 2 === 0 ? 1 : -1;
        cues.push(
          makeCue(
            sid,
            k % 3 === 0 ? 'sawtooth' : 'triangle',
            'window_dirigible_prop',
            propFreqs[k],
            propFreqs[k] * (1 + dirSign * 0.04),
            0.28,
            0.058,
            k * 0.052,
            dirSign * (0.25 + (k % 3) * 0.24),
            640,
            '3:2'
          )
        );
      }
    } else if (sid === 'sailor_tattoos') {
      // Rapid electromagnetic coil tattoo-needle buzz bursts + ink needle stings
      for (k = 0; k < count; k++) {
        var isPing = k === count - 1 || k === 3;
        cues.push(
          isPing
            ? makeCue(sid, 'triangle', 'pierced_ink_sting', 940 + k * 30, 780, 0.042, 0.06, k * 0.046, 0.45 + (k % 3) * 0.14, 2100, '7:4')
            : makeCue(sid, 'sawtooth', 'tattoo_needle_buzz', 192 + (k % 4) * 18, 204 + (k % 4) * 18, 0.068, 0.062, k * 0.048, 0.35 + (k % 4) * 0.14, 1350, '6:4')
        );
      }
    } else {
      // Humid underground: heavy rail-joint doublets + synchronized chorus of fluttering paper fans
      for (k = 0; k < count; k++) {
        var isRail = k === 0 || k === 1 || k === 5;
        var railDelay = k === 1 ? 0.075 : k * 0.068;
        cues.push(
          isRail
            ? makeCue(sid, 'triangle', 'subway_rail_clack', 76 + (k % 2) * 14, 54, 0.088, 0.105, railDelay, -0.4 + k * 0.15, 340, '2:3')
            : makeCue(sid, 'sine', 'humid_fan_chorus', 350 + (k % 5) * 38, 420 + (k % 5) * 32, 0.14, 0.052, k * 0.062, -0.7 + (k / count) * 1.4, 980, '5:4')
        );
      }
    }

    return cues;
  }

  function washPlate(state, stampCtx, width, height) {
    if (state) {
      for (var i = 0; i < STONE_IDS.length; i++) {
        var sid = STONE_IDS[i];
        if (state.stamps) state.stamps[sid] = 0;
        if (state.stonePermanence) state.stonePermanence[sid] = 0;
      }
      state.totalStamps = 0;
    }
    if (stampCtx && width > 0 && height > 0) {
      stampCtx.clearRect(0, 0, width, height);
    }
  }

  function hitTest(xNorm, yNorm) {
    if (!Number.isFinite(xNorm) || !Number.isFinite(yNorm)) return null;
    if (yNorm >= 0.04 && yNorm <= 0.36 && xNorm >= 0.04 && xNorm <= 0.96) {
      return yNorm <= 0.155 ? 'skyscraper_cornices' : 'window_dirigibles';
    }
    var streetOrder = ['cobble_canes', 'leashed_pumas', 'sailor_tattoos', 'humid_underground'];
    for (var i = 0; i < streetOrder.length; i++) {
      var sid = streetOrder[i];
      var b = STONE_BOUNDS[sid];
      if (xNorm >= b.x0 && xNorm <= b.x1 && yNorm >= b.y0 && yNorm <= b.y1) {
        return sid;
      }
    }
    return null;
  }

  var ZirmaSwarmingEchoes = {
    STONE_IDS: STONE_IDS,
    STRATA: STRATA,
    STONE_BOUNDS: STONE_BOUNDS,
    PALETTE: PALETTE,
    createState: createState,
    step: step,
    stampStone: stampStone,
    renderLive: renderLive,
    getMemoryCaption: getMemoryCaption,
    getPolyrhythmCues: getPolyrhythmCues,
    washPlate: washPlate,
    hitTest: hitTest
  };

  root.ZirmaSwarmingEchoes = ZirmaSwarmingEchoes;
})(typeof globalThis !== 'undefined' ? globalThis : window);
