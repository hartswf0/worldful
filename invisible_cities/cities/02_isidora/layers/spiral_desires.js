(function (global) {
  'use strict';

  var STATION_LIST = ['spiral', 'violin', 'telescope', 'hesitation', 'cockfight'];

  var STATION_META = {
    spiral: {
      title: 'Seashell Spiral Stairwell',
      tag: 'seashell-whorl',
      deltaAge: 0.095,
      label: 'Ascended the Seashell-Encrusted Golden Spiral',
      memoryEcho: 'Spiral staircases encrusted with calcified spiral shells recede into piazza dusk.'
    },
    violin: {
      title: 'Luthier Bench of Fifths',
      tag: 'luthier-pegbox',
      deltaAge: 0.10,
      label: 'Sounded Just-Intonation Violin Fifths',
      memoryEcho: 'Four spruce-resonated strings tuned in 3:2 fifths linger across the square like memory.'
    },
    telescope: {
      title: 'Vernier Brass Refractor',
      tag: 'brass-refractor',
      deltaAge: 0.10,
      label: 'Collapsed Chromatic Halos in the Brass Telescope',
      memoryEcho: 'Through polished brass drawtubes, distant nacreous domes sharpen into youth gone by.'
    },
    hesitation: {
      title: 'Loggia of the Third Woman',
      tag: 'hesitation-loggia',
      deltaAge: 0.11,
      label: 'Hesitated Between Two Women — Encountered a Third',
      memoryEcho: 'Leaning toward either poised silhouette parted the amber arch where a third stepped forth.'
    },
    cockfight: {
      title: 'Chalked Pit & Bettors Brawl',
      tag: 'cockfight-pit',
      deltaAge: 0.115,
      label: 'Incited the Cockfight into a Bloody Bettors Brawl',
      memoryEcho: 'Crimson feathers scattered outward as the ring of bettors collided in the dust.'
    }
  };

  var VIOLIN_COURSES = [
    { id: 'G3', name: 'G3', targetHz: 196.00, initialCents: -18, color: [216, 174, 108] },
    { id: 'D4', name: 'D4', targetHz: 293.66, initialCents: 14, color: [230, 196, 132] },
    { id: 'A4', name: 'A4', targetHz: 440.00, initialCents: -11, color: [242, 218, 164] },
    { id: 'E5', name: 'E5', targetHz: 659.25, initialCents: 16, color: [252, 238, 202] }
  ];

  var GOLDEN_PHI = 1.618033988749895;
  var GOLDEN_B = (2 * Math.log(GOLDEN_PHI)) / Math.PI;
  var SEASHELL_TOTAL = 72;

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function mixRgb(rgbYouth, rgbAged, ageT) {
    var t = clamp(ageT, 0, 1);
    return [
      Math.round(lerp(rgbYouth[0], rgbAged[0], t)),
      Math.round(lerp(rgbYouth[1], rgbAged[1], t)),
      Math.round(lerp(rgbYouth[2], rgbAged[2], t))
    ];
  }

  function rgba(rgb, alpha) {
    return 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + clamp(alpha, 0, 1).toFixed(3) + ')';
  }

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildSeashells(count) {
    var rng = mulberry32(20202);
    var kinds = ['nautilus', 'turritella', 'murex'];
    var list = [];
    for (var i = 0; i < count; i++) {
      var frac = i / count;
      var theta = 1.15 + frac * (Math.PI * 6.8) + (rng() - 0.5) * 0.14;
      list.push({
        index: i,
        kind: kinds[i % 3],
        theta: theta,
        railSide: i % 2 === 0 ? 1 : -1,
        radialJitter: (rng() - 0.5) * 0.12,
        sizeFactor: 0.72 + rng() * 0.62,
        spin: rng() * Math.PI * 2,
        shimmerPhase: rng() * Math.PI * 2
      });
    }
    return list;
  }

  function buildConstellationField() {
    var rng = mulberry32(90421);
    var stars = [];
    var anchors = [
      { x: -0.48, y: -0.36, mag: 1.0 },
      { x: -0.24, y: -0.44, mag: 0.85 },
      { x: -0.05, y: -0.22, mag: 0.95 },
      { x: 0.18, y: -0.40, mag: 1.0 },
      { x: 0.42, y: -0.28, mag: 0.9 },
      { x: 0.31, y: -0.08, mag: 0.82 },
      { x: -0.34, y: -0.10, mag: 0.78 }
    ];
    for (var i = 0; i < anchors.length; i++) {
      stars.push({ x: anchors[i].x, y: anchors[i].y, mag: anchors[i].mag, primary: true });
    }
    for (var j = 0; j < 34; j++) {
      var ang = rng() * Math.PI * 2;
      var rad = 0.12 + Math.sqrt(rng()) * 0.72;
      var sy = Math.sin(ang) * rad;
      if (sy > 0.24) sy = -Math.abs(sy) * 0.65;
      stars.push({ x: Math.cos(ang) * rad * 0.86, y: sy, mag: 0.32 + rng() * 0.48, primary: false });
    }
    var links = [[0, 1], [1, 2], [2, 6], [2, 3], [3, 4], [4, 5], [2, 5]];
    return { stars: stars, links: links };
  }

  function buildBettors(count) {
    var rng = mulberry32(7719);
    var bettors = [];
    for (var i = 0; i < count; i++) {
      var baseAngle = (i / count) * Math.PI * 2 + (rng() - 0.5) * 0.12;
      bettors.push({
        baseAngle: baseAngle,
        orbitSpeed: (i % 2 === 0 ? 1 : -1) * (0.65 + rng() * 0.75),
        lungePhase: rng() * Math.PI * 2,
        shoulderScale: 0.88 + rng() * 0.28,
        hatBrim: rng() > 0.42,
        cloakTone: rng()
      });
    }
    return bettors;
  }

  function buildFeathers(count) {
    var rng = mulberry32(5513);
    var feathers = [];
    for (var i = 0; i < count; i++) {
      feathers.push({
        angle: (i / count) * Math.PI * 2 + (rng() - 0.5) * 0.25,
        speed: 0.35 + rng() * 0.85,
        spin: (rng() - 0.5) * 7.5,
        length: 8 + rng() * 11,
        crimson: rng() > 0.28,
        progress: rng()
      });
    }
    return feathers;
  }

  function createAudioEngine() {
    var ctx = null;
    var masterGain = null;
    var memoryFilter = null;
    var directGain = null;
    var echoDelay = null;
    var echoFeedback = null;
    var echoDamp = null;
    var echoWet = null;
    var muted = false;
    var unlocked = false;
    var currentFilterHz = 13500;
    var currentAge = 0;

    function syncGraphParams() {
      if (!ctx || !memoryFilter) return;
      var now = ctx.currentTime || 0;
      try {
        memoryFilter.frequency.setTargetAtTime(clamp(currentFilterHz, 280, 18000), now, 0.04);
        directGain.gain.setTargetAtTime(lerp(0.92, 0.48, currentAge), now, 0.05);
        echoFeedback.gain.setTargetAtTime(lerp(0.10, 0.44, currentAge), now, 0.05);
        echoWet.gain.setTargetAtTime(lerp(0.07, 0.40, currentAge), now, 0.05);
        masterGain.gain.setTargetAtTime(muted ? 0.0001 : 0.72, now, 0.02);
      } catch (_) {
        memoryFilter.frequency.value = clamp(currentFilterHz, 280, 18000);
        masterGain.gain.value = muted ? 0 : 0.72;
      }
    }

    function ensureContext(fromGesture) {
      var userActive = Boolean(fromGesture) ||
        Boolean(typeof navigator !== 'undefined' && navigator.userActivation && navigator.userActivation.isActive);
      if (muted) return null;
      if (!ctx) {
        if (!userActive) return null;
        var Ctor = global.AudioContext || global.webkitAudioContext;
        if (!Ctor) return null;
        try {
          ctx = new Ctor();
          memoryFilter = ctx.createBiquadFilter();
          memoryFilter.type = 'lowpass';
          memoryFilter.Q.value = 0.82;
          directGain = ctx.createGain();
          echoDelay = ctx.createDelay(1.0);
          echoDelay.delayTime.value = 0.235;
          echoFeedback = ctx.createGain();
          echoDamp = ctx.createBiquadFilter();
          echoDamp.type = 'lowpass';
          echoDamp.frequency.value = 1550;
          echoWet = ctx.createGain();
          masterGain = ctx.createGain();

          memoryFilter.connect(directGain);
          directGain.connect(masterGain);
          memoryFilter.connect(echoDelay);
          echoDelay.connect(echoDamp);
          echoDamp.connect(echoWet);
          echoWet.connect(masterGain);
          echoDamp.connect(echoFeedback);
          echoFeedback.connect(echoDelay);
          masterGain.connect(ctx.destination);
          unlocked = true;
          syncGraphParams();
        } catch (_) {
          ctx = null;
          return null;
        }
      }
      if (ctx && ctx.state === 'suspended' && userActive && typeof ctx.resume === 'function') {
        try { ctx.resume(); } catch (_) {}
      }
      return unlocked ? ctx : null;
    }

    return {
      setMuted: function (nextMuted) {
        muted = Boolean(nextMuted);
        syncGraphParams();
      },
      isMuted: function () { return muted; },
      setAgeFilter: function (hz, ageProgress) {
        if (typeof hz === 'number' && isFinite(hz)) currentFilterHz = hz;
        if (typeof ageProgress === 'number' && isFinite(ageProgress)) currentAge = clamp(ageProgress, 0, 1);
        syncGraphParams();
      },
      unlock: function () { ensureContext(true); },
      getInputNode: function (fromGesture) {
        var c = ensureContext(fromGesture);
        return c && memoryFilter ? { ctx: c, dest: memoryFilter } : null;
      },
      destroy: function () {
        if (ctx && typeof ctx.close === 'function') {
          try { ctx.close(); } catch (_) {}
        }
        ctx = null;
        unlocked = false;
      }
    };
  }

  function synthViolinString(audio, freqHz, companionHz, bowed, fromGesture) {
    var io = audio.getInputNode(fromGesture);
    if (!io) return;
    var ctx = io.ctx;
    var now = ctx.currentTime;
    try {
      var bodyA = ctx.createBiquadFilter();
      bodyA.type = 'peaking';
      bodyA.frequency.value = 288;
      bodyA.Q.value = 2.4;
      bodyA.gain.value = 5.5;

      var bodyB = ctx.createBiquadFilter();
      bodyB.type = 'peaking';
      bodyB.frequency.value = 538;
      bodyB.Q.value = 2.8;
      bodyB.gain.value = 4.2;

      var env = ctx.createGain();
      var dur = bowed ? 1.55 : 1.18;
      env.gain.setValueAtTime(0.0001, now);
      env.gain.linearRampToValueAtTime(bowed ? 0.20 : 0.24, now + (bowed ? 0.14 : 0.009));
      env.gain.exponentialRampToValueAtTime(0.0008, now + dur);

      bodyA.connect(bodyB);
      bodyB.connect(env);
      env.connect(io.dest);

      var vibOsc = null;
      var vibGain = null;
      if (bowed) {
        vibOsc = ctx.createOscillator();
        vibGain = ctx.createGain();
        vibOsc.frequency.value = 5.3;
        vibGain.gain.value = freqHz * 0.006;
        vibOsc.connect(vibGain);
        vibOsc.start(now);
        vibOsc.stop(now + dur + 0.04);
      }

      var partials = [1, 2, 3, 4, 5];
      var weights = bowed ? [1.0, 0.56, 0.34, 0.20, 0.12] : [1.0, 0.48, 0.24, 0.11, 0.05];
      for (var i = 0; i < partials.length; i++) {
        var osc = ctx.createOscillator();
        var pGain = ctx.createGain();
        osc.type = i % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freqHz * partials[i], now);
        if (vibGain && i < 2) vibGain.connect(osc.frequency);
        pGain.gain.value = weights[i] * 0.38;
        osc.connect(pGain);
        pGain.connect(bodyA);
        osc.start(now);
        osc.stop(now + dur + 0.03);
      }

      if (companionHz && companionHz > 40) {
        var fifthOsc = ctx.createOscillator();
        var fifthGain = ctx.createGain();
        fifthOsc.type = 'triangle';
        fifthOsc.frequency.setValueAtTime(companionHz, now + 0.04);
        fifthGain.gain.setValueAtTime(0.0001, now + 0.04);
        fifthGain.gain.linearRampToValueAtTime(0.085, now + 0.16);
        fifthGain.gain.exponentialRampToValueAtTime(0.0006, now + dur);
        fifthOsc.connect(fifthGain);
        fifthGain.connect(bodyA);
        fifthOsc.start(now + 0.04);
        fifthOsc.stop(now + dur + 0.03);
      }
    } catch (_) {}
  }

  function synthStationSound(audio, station, params, fromGesture) {
    var io = audio.getInputNode(fromGesture);
    if (!io) return;
    var ctx = io.ctx;
    var now = ctx.currentTime;
    try {
      if (station === 'spiral') {
        var base = 310 + ((params.turns || 0) % 4) * 28;
        var ratios = [1, 1.272, GOLDEN_PHI];
        for (var i = 0; i < ratios.length; i++) {
          var o = ctx.createOscillator();
          var g = ctx.createGain();
          o.type = i === 2 ? 'sine' : 'triangle';
          o.frequency.setValueAtTime(base * ratios[i], now + i * 0.045);
          g.gain.setValueAtTime(0.0001, now + i * 0.045);
          g.gain.linearRampToValueAtTime(0.09, now + i * 0.045 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0008, now + 0.55 + i * 0.08);
          o.connect(g);
          g.connect(io.dest);
          o.start(now + i * 0.045);
          o.stop(now + 0.68 + i * 0.08);
        }
      } else if (station === 'telescope') {
        var click = ctx.createOscillator();
        var cg = ctx.createGain();
        click.type = 'triangle';
        click.frequency.setValueAtTime(1950, now);
        click.frequency.exponentialRampToValueAtTime(680, now + 0.035);
        cg.gain.setValueAtTime(0.12, now);
        cg.gain.exponentialRampToValueAtTime(0.001, now + 0.042);
        click.connect(cg);
        cg.connect(io.dest);
        click.start(now);
        click.stop(now + 0.05);

        var bell = ctx.createOscillator();
        var bg = ctx.createGain();
        bell.type = 'sine';
        bell.frequency.setValueAtTime(528 + (params.sharpness || 0.5) * 352, now + 0.02);
        bg.gain.setValueAtTime(0.0001, now + 0.02);
        bg.gain.linearRampToValueAtTime(0.04 + (params.sharpness || 0) * 0.07, now + 0.06);
        bg.gain.exponentialRampToValueAtTime(0.0007, now + 0.62);
        bell.connect(bg);
        bg.connect(io.dest);
        bell.start(now + 0.02);
        bell.stop(now + 0.65);
      } else if (station === 'hesitation') {
        var pairHz = params.choice === 1 ? [369.99, 554.37] : [329.63, 493.88];
        var thirdHz = params.choice === 1 ? 466.16 : 415.30;
        for (var p = 0; p < 2; p++) {
          var po = ctx.createOscillator();
          var pg = ctx.createGain();
          po.type = 'sine';
          po.frequency.setValueAtTime(pairHz[p], now);
          pg.gain.setValueAtTime(0.0001, now);
          pg.gain.linearRampToValueAtTime(0.075, now + 0.04);
          pg.gain.exponentialRampToValueAtTime(0.0008, now + 0.72);
          po.connect(pg);
          pg.connect(io.dest);
          po.start(now);
          po.stop(now + 0.76);
        }
        var tOsc = ctx.createOscillator();
        var tGain = ctx.createGain();
        tOsc.type = 'triangle';
        tOsc.frequency.setValueAtTime(thirdHz, now + 0.11);
        tGain.gain.setValueAtTime(0.0001, now + 0.11);
        tGain.gain.linearRampToValueAtTime(0.13, now + 0.22);
        tGain.gain.exponentialRampToValueAtTime(0.0008, now + 1.08);
        tOsc.connect(tGain);
        tGain.connect(io.dest);
        tOsc.start(now + 0.11);
        tOsc.stop(now + 1.12);
      } else if (station === 'cockfight') {
        var hits = 2 + Math.floor((params.intensity || 0.5) * 2.5);
        for (var h = 0; h < hits; h++) {
          var t0 = now + h * 0.085;
          var thud = ctx.createOscillator();
          var tg = ctx.createGain();
          thud.type = 'sine';
          thud.frequency.setValueAtTime(108 - h * 11, t0);
          thud.frequency.exponentialRampToValueAtTime(34, t0 + 0.16);
          tg.gain.setValueAtTime(0.22, t0);
          tg.gain.exponentialRampToValueAtTime(0.001, t0 + 0.19);
          thud.connect(tg);
          tg.connect(io.dest);
          thud.start(t0);
          thud.stop(t0 + 0.21);
        }
      }
    } catch (_) {}
  }

  function safeEllipse(ctx, x, y, rx, ry, rot, a0, a1) {
    if (typeof ctx.ellipse === 'function') {
      ctx.ellipse(x, y, Math.max(0.5, rx), Math.max(0.5, ry), rot || 0, a0 || 0, a1 === undefined ? Math.PI * 2 : a1);
    } else {
      ctx.save();
      ctx.translate(x, y);
      if (rot) ctx.rotate(rot);
      ctx.scale(1, Math.max(0.1, ry / Math.max(0.5, rx)));
      ctx.arc(0, 0, Math.max(0.5, rx), a0 || 0, a1 === undefined ? Math.PI * 2 : a1);
      ctx.restore();
    }
  }

  function drawCalcifiedShell(ctx, shell, x, y, baseSize, ageT, clock) {
    var sz = Math.max(2.2, baseSize * shell.sizeFactor);
    var shimmer = 0.5 + 0.5 * Math.sin(clock * 1.9 + shell.shimmerPhase);
    var nacreRgb = mixRgb([238, 229, 214], [198, 174, 138], ageT);
    var coralRgb = mixRgb([214, 168, 146], [164, 134, 102], ageT);
    var rimRgb = mixRgb([126, 158, 176], [118, 98, 74], ageT);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(shell.spin + shell.theta * 0.35);

    if (shell.kind === 'nautilus') {
      ctx.beginPath();
      for (var s = 0; s <= 18; s++) {
        var st = (s / 18) * Math.PI * 3.1;
        var sr = sz * 0.14 * Math.exp(0.20 * st);
        var sx = Math.cos(st) * sr;
        var sy = Math.sin(st) * sr;
        if (s === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fillStyle = rgba(nacreRgb, 0.76 + shimmer * 0.20);
      ctx.fill();
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = rgba(rimRgb, 0.82);
      ctx.stroke();
      for (var c = 4; c <= 16; c += 4) {
        var ct = (c / 18) * Math.PI * 3.1;
        var cr = sz * 0.14 * Math.exp(0.20 * ct);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(Math.cos(ct - 0.3) * cr * 0.55, Math.sin(ct - 0.3) * cr * 0.55, Math.cos(ct) * cr, Math.sin(ct) * cr);
        ctx.strokeStyle = rgba(coralRgb, 0.65);
        ctx.stroke();
      }
    } else if (shell.kind === 'turritella') {
      var len = sz * 1.65;
      for (var w = 0; w < 5; w++) {
        var wf = w / 5;
        var wy = -len * 0.45 + wf * len;
        var wr = sz * (0.14 + wf * 0.34);
        ctx.beginPath();
        safeEllipse(ctx, 0, wy, wr, wr * 0.56, 0, 0, Math.PI * 2);
        ctx.fillStyle = rgba(w % 2 === 0 ? nacreRgb : coralRgb, 0.78);
        ctx.fill();
        ctx.lineWidth = 0.75;
        ctx.strokeStyle = rgba(rimRgb, 0.72);
        ctx.stroke();
      }
    } else {
      ctx.beginPath();
      safeEllipse(ctx, 0, 0, sz * 0.58, sz * 0.44, 0, 0, Math.PI * 2);
      ctx.fillStyle = rgba(coralRgb, 0.80);
      ctx.fill();
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = rgba(nacreRgb, 0.88);
      for (var sp = 0; sp < 6; sp++) {
        var sa = (sp / 6) * Math.PI * 2;
        ctx.moveTo(Math.cos(sa) * sz * 0.42, Math.sin(sa) * sz * 0.32);
        ctx.lineTo(Math.cos(sa) * sz * 0.88, Math.sin(sa) * sz * 0.74);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderSpiralVault(ctx, cx, cy, radius, state, alphaMul) {
    var ageT = state.ageState.ageProgress;
    var goldRgb = mixRgb([236, 198, 122], [176, 146, 104], ageT);
    var pearlRgb = mixRgb([224, 236, 245], [192, 176, 148], ageT);
    var vaultRgb = mixRgb([44, 68, 98], [86, 72, 56], ageT);
    var stepStroke = mixRgb([248, 228, 186], [184, 158, 124], ageT);

    ctx.save();
    ctx.globalAlpha = clamp(alphaMul, 0.05, 1);
    ctx.translate(cx, cy);
    var zoom = state.activeStation === 'spiral' ? state.spiralZoom : 0.94;
    ctx.scale(zoom, zoom);

    var maxTheta = Math.PI * 7.8;
    var aCoeff = (radius * 0.96) / Math.exp(GOLDEN_B * maxTheta);
    var rot = state.spiralAngle;

    var eyeGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, radius * 0.98);
    eyeGrad.addColorStop(0, rgba(pearlRgb, 0.34));
    eyeGrad.addColorStop(0.38, rgba(goldRgb, 0.14));
    eyeGrad.addColorStop(1, rgba(vaultRgb, 0.02));
    ctx.fillStyle = eyeGrad;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.98, 0, Math.PI * 2);
    ctx.fill();

    var stepCount = 86;
    for (var i = 6; i < stepCount; i++) {
      var th0 = (i / stepCount) * maxTheta;
      var th1 = ((i + 0.88) / stepCount) * maxTheta;
      var r0 = aCoeff * Math.exp(GOLDEN_B * th0);
      var r1 = aCoeff * Math.exp(GOLDEN_B * th1);
      var a0 = th0 + rot;
      var a1 = th1 + rot;
      var pulse = 0.5 + 0.5 * Math.sin(state.clock * 2.2 - th0 * 1.4 + state.shimmerBoost);

      ctx.beginPath();
      ctx.moveTo(Math.cos(a0) * r0 * 0.74, Math.sin(a0) * r0 * 0.74);
      ctx.lineTo(Math.cos(a0) * r0 * 1.12, Math.sin(a0) * r0 * 1.12);
      ctx.lineTo(Math.cos(a1) * r1 * 1.12, Math.sin(a1) * r1 * 1.12);
      ctx.lineTo(Math.cos(a1) * r1 * 0.74, Math.sin(a1) * r1 * 0.74);
      ctx.closePath();
      ctx.fillStyle = rgba(i % 2 === 0 ? pearlRgb : goldRgb, 0.11 + pulse * 0.12);
      ctx.fill();
      ctx.lineWidth = 0.85;
      ctx.strokeStyle = rgba(stepStroke, 0.34 + pulse * 0.22);
      ctx.stroke();
    }

    for (var rail = 0; rail < 2; rail++) {
      var factor = rail === 0 ? 0.74 : 1.12;
      ctx.beginPath();
      for (var k = 0; k <= 140; k++) {
        var kt = (k / 140) * maxTheta;
        var kr = aCoeff * Math.exp(GOLDEN_B * kt) * factor;
        var ka = kt + rot;
        var kx = Math.cos(ka) * kr;
        var ky = Math.sin(ka) * kr;
        if (k === 0) ctx.moveTo(kx, ky);
        else ctx.lineTo(kx, ky);
      }
      ctx.lineWidth = rail === 1 ? 2.1 : 1.3;
      ctx.strokeStyle = rgba(rail === 1 ? goldRgb : pearlRgb, 0.78);
      ctx.stroke();
    }

    var chambers = ['violin', 'telescope', 'hesitation', 'cockfight'];
    for (var c = 0; c < chambers.length; c++) {
      var cTheta = Math.PI * (3.2 + c * 1.05);
      var cRad = aCoeff * Math.exp(GOLDEN_B * cTheta) * 0.93;
      var cAng = cTheta + rot;
      var px = Math.cos(cAng) * cRad;
      var py = Math.sin(cAng) * cRad;
      var isSel = state.activeStation === chambers[c];
      ctx.beginPath();
      ctx.arc(px, py, Math.max(7, radius * 0.048), 0, Math.PI * 2);
      ctx.fillStyle = rgba(isSel ? [255, 224, 150] : goldRgb, isSel ? 0.55 : 0.25);
      ctx.fill();
      ctx.lineWidth = isSel ? 2.0 : 1.1;
      ctx.strokeStyle = rgba(pearlRgb, 0.85);
      ctx.stroke();
    }

    var shells = state.seashells;
    for (var s = 0; s < shells.length; s++) {
      var sh = shells[s];
      var sRad = aCoeff * Math.exp(GOLDEN_B * sh.theta) * (sh.railSide > 0 ? 1.13 : 0.73) * (1 + sh.radialJitter);
      var sAng = sh.theta + rot;
      var sx = Math.cos(sAng) * sRad;
      var sy = Math.sin(sAng) * sRad;
      var shellBase = clamp(sRad * 0.085, 2.6, radius * 0.052);
      drawCalcifiedShell(ctx, sh, sx, sy, shellBase, ageT, state.clock);
    }

    ctx.restore();
  }

  function renderViolinStation(ctx, cx, cy, radius, state) {
    var ageT = state.ageState.ageProgress;
    var spruceTop = mixRgb([214, 142, 62], [158, 122, 82], ageT);
    var spruceGlow = mixRgb([244, 192, 108], [186, 154, 114], ageT);
    var ebonyRgb = mixRgb([28, 22, 20], [58, 48, 38], ageT);
    var purflingRgb = mixRgb([252, 232, 184], [196, 174, 140], ageT);
    var fifthGlow = mixRgb([255, 226, 148], [198, 172, 132], ageT);

    ctx.save();
    ctx.translate(cx, cy);
    var s = radius * 0.88;

    var harmony = state.violinFifthsHarmony;
    for (var h = 1; h <= 3; h++) {
      ctx.beginPath();
      safeEllipse(ctx, 0, s * 0.12, s * (0.38 + h * 0.15 * harmony), s * (0.50 + h * 0.14 * harmony), 0, 0, Math.PI * 2);
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = rgba(fifthGlow, (0.08 + harmony * 0.24) / h);
      ctx.stroke();
    }

    var bodyGrad = ctx.createRadialGradient(0, s * 0.14, s * 0.05, 0, s * 0.14, s * 0.72);
    bodyGrad.addColorStop(0, rgba(spruceGlow, 0.95));
    bodyGrad.addColorStop(0.65, rgba(spruceTop, 0.94));
    bodyGrad.addColorStop(1, rgba(mixRgb([124, 64, 24], [104, 80, 56], ageT), 0.96));

    ctx.beginPath();
    ctx.moveTo(0, -s * 0.34);
    ctx.bezierCurveTo(s * 0.38, -s * 0.34, s * 0.42, -s * 0.04, s * 0.22, s * 0.08);
    ctx.bezierCurveTo(s * 0.14, s * 0.14, s * 0.16, s * 0.24, s * 0.27, s * 0.30);
    ctx.bezierCurveTo(s * 0.50, s * 0.42, s * 0.46, s * 0.82, 0, s * 0.84);
    ctx.bezierCurveTo(-s * 0.46, s * 0.82, -s * 0.50, s * 0.42, -s * 0.27, s * 0.30);
    ctx.bezierCurveTo(-s * 0.16, s * 0.24, -s * 0.14, s * 0.14, -s * 0.22, s * 0.08);
    ctx.bezierCurveTo(-s * 0.42, -s * 0.04, -s * 0.38, -s * 0.34, 0, -s * 0.34);
    ctx.closePath();
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = rgba(purflingRgb, 0.82);
    ctx.stroke();

    for (var side = -1; side <= 1; side += 2) {
      ctx.beginPath();
      ctx.moveTo(side * s * 0.14, s * 0.05);
      ctx.bezierCurveTo(side * s * 0.21, s * 0.14, side * s * 0.12, s * 0.34, side * s * 0.19, s * 0.44);
      ctx.lineWidth = Math.max(2.2, s * 0.018);
      ctx.strokeStyle = rgba(ebonyRgb, 0.92);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(side * s * 0.14, s * 0.05, s * 0.022, 0, Math.PI * 2);
      ctx.arc(side * s * 0.19, s * 0.44, s * 0.025, 0, Math.PI * 2);
      ctx.fillStyle = rgba(ebonyRgb, 0.92);
      ctx.fill();
    }

    ctx.fillStyle = rgba(ebonyRgb, 0.95);
    ctx.fillRect(-s * 0.065, -s * 0.76, s * 0.13, s * 0.86);
    ctx.beginPath();
    ctx.arc(0, -s * 0.84, s * 0.075, 0, Math.PI * 2);
    ctx.fillStyle = rgba(spruceTop, 0.96);
    ctx.fill();
    ctx.strokeStyle = rgba(purflingRgb, 0.78);
    ctx.lineWidth = 1.4;
    ctx.stroke();

    for (var p = 0; p < 4; p++) {
      var pSide = p % 2 === 0 ? -1 : 1;
      var py = -s * (0.74 - p * 0.055);
      var pegAngle = (state.violinCents[p] / 35) * 0.65;
      ctx.save();
      ctx.translate(pSide * s * 0.08, py);
      ctx.rotate(pegAngle);
      ctx.fillStyle = rgba(purflingRgb, 0.9);
      ctx.fillRect(pSide > 0 ? 0 : -s * 0.13, -s * 0.016, s * 0.13, s * 0.032);
      ctx.beginPath();
      safeEllipse(ctx, pSide * s * 0.14, 0, s * 0.038, s * 0.026, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = rgba(purflingRgb, 0.88);
    ctx.fillRect(-s * 0.14, s * 0.25, s * 0.28, s * 0.028);
    ctx.beginPath();
    ctx.moveTo(-s * 0.07, s * 0.48);
    ctx.lineTo(s * 0.07, s * 0.48);
    ctx.lineTo(s * 0.035, s * 0.76);
    ctx.lineTo(-s * 0.035, s * 0.76);
    ctx.closePath();
    ctx.fillStyle = rgba(ebonyRgb, 0.96);
    ctx.fill();

    for (var st = 0; st < 4; st++) {
      var sxTop = (-1.5 + st) * s * 0.028;
      var sxBot = (-1.5 + st) * s * 0.052;
      var amp = state.stringEnergy[st] * s * 0.036;
      var sCol = mixRgb(VIOLIN_COURSES[st].color, [196, 174, 140], ageT);
      ctx.beginPath();
      for (var seg = 0; seg <= 24; seg++) {
        var u = seg / 24;
        var sy = lerp(-s * 0.74, s * 0.50, u);
        var vib = Math.sin(u * Math.PI) * Math.sin(state.clock * (22 + st * 7)) * amp;
        var sx = lerp(sxTop, sxBot, u) + vib;
        if (seg === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.lineWidth = 2.2 - st * 0.32;
      ctx.strokeStyle = rgba(sCol, 0.95);
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderTelescopeStation(ctx, cx, cy, radius, state) {
    var ageT = state.ageState.ageProgress;
    var brassHi = mixRgb([244, 206, 120], [186, 158, 114], ageT);
    var brassLo = mixRgb([146, 102, 38], [112, 88, 62], ageT);
    var skyRgb = mixRgb([12, 22, 42], [48, 40, 32], ageT);
    var domeRgb = mixRgb([226, 236, 246], [190, 174, 148], ageT);
    var sharp = state.telescopeSharpness;
    var aber = (1 - sharp) * radius * 0.072;

    ctx.save();
    ctx.translate(cx, cy);
    var lensR = radius * 0.64;

    ctx.save();
    ctx.translate(-radius * 0.46, radius * 0.42);
    ctx.rotate(-0.56);
    ctx.fillStyle = rgba(brassLo, 0.94);
    ctx.fillRect(-radius * 0.34, -radius * 0.08, radius * 0.68, radius * 0.16);
    ctx.fillStyle = rgba(brassHi, 0.92);
    ctx.fillRect(-radius * 0.34, -radius * 0.05, radius * 0.68, radius * 0.05);
    var wheelX = -radius * 0.12 + state.telescopeFocus * radius * 0.18;
    ctx.beginPath();
    ctx.arc(wheelX, radius * 0.10, radius * 0.075, 0, Math.PI * 2);
    ctx.fillStyle = rgba(brassHi, 0.96);
    ctx.fill();
    ctx.strokeStyle = rgba(brassLo, 0.95);
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(radius * 0.06, -radius * 0.04, lensR, 0, Math.PI * 2);
    ctx.fillStyle = rgba(skyRgb, 0.96);
    ctx.fill();
    ctx.clip();
    ctx.translate(radius * 0.06, -radius * 0.04);

    var channels = aber > 0.35
      ? [
          { dx: -aber, dy: -aber * 0.45, col: mixRgb([255, 88, 84], [198, 128, 98], ageT), a: 0.48 },
          { dx: 0, dy: 0, col: domeRgb, a: 0.66 },
          { dx: aber, dy: aber * 0.45, col: mixRgb([96, 164, 255], [148, 152, 168], ageT), a: 0.48 }
        ]
      : [{ dx: 0, dy: 0, col: domeRgb, a: 0.96 }];

    var stars = state.starfield.stars;
    var links = state.starfield.links;
    if (sharp > 0.58) {
      ctx.beginPath();
      for (var l = 0; l < links.length; l++) {
        var sA = stars[links[l][0]];
        var sB = stars[links[l][1]];
        ctx.moveTo(sA.x * lensR, sA.y * lensR);
        ctx.lineTo(sB.x * lensR, sB.y * lensR);
      }
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = rgba(brassHi, (sharp - 0.55) * 0.85);
      ctx.stroke();
    }

    for (var ch = 0; ch < channels.length; ch++) {
      var cInfo = channels[ch];
      for (var i = 0; i < stars.length; i++) {
        var st = stars[i];
        var sx = st.x * lensR + cInfo.dx * (0.6 + st.mag * 0.5);
        var sy = st.y * lensR + cInfo.dy * (0.6 + st.mag * 0.5);
        var sr = (st.primary ? 2.4 : 1.3) + (1 - sharp) * 3.4;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fillStyle = rgba(cInfo.col, cInfo.a * st.mag);
        ctx.fill();
        if (sharp > 0.82 && st.primary && ch === 0) {
          var spk = lensR * 0.055 * sharp;
          ctx.beginPath();
          ctx.moveTo(sx - spk, sy);
          ctx.lineTo(sx + spk, sy);
          ctx.moveTo(sx, sy - spk);
          ctx.lineTo(sx, sy + spk);
          ctx.lineWidth = 0.9;
          ctx.strokeStyle = rgba(brassHi, 0.85);
          ctx.stroke();
        }
      }

      for (var d = -2; d <= 2; d++) {
        var dx = d * lensR * 0.30 + cInfo.dx * 0.85;
        var dw = lensR * (0.20 - Math.abs(d) * 0.022);
        var dh = lensR * (0.28 - Math.abs(d) * 0.032);
        var baseY = lensR * 0.66 + cInfo.dy * 0.5;
        ctx.beginPath();
        ctx.arc(dx, baseY, dw, Math.PI, 0);
        ctx.closePath();
        ctx.fillStyle = rgba(cInfo.col, cInfo.a * 0.55);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(dx, baseY - dw);
        ctx.lineTo(dx, baseY - dw - dh * 0.45);
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = rgba(brassHi, cInfo.a * 0.85);
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.moveTo(-lensR, 0);
    ctx.lineTo(lensR, 0);
    ctx.moveTo(0, -lensR);
    ctx.lineTo(0, lensR);
    ctx.lineWidth = 0.7;
    ctx.strokeStyle = rgba(brassHi, 0.28);
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(radius * 0.06, -radius * 0.04, lensR, 0, Math.PI * 2);
    ctx.lineWidth = Math.max(4, radius * 0.042);
    ctx.strokeStyle = rgba(brassHi, 0.92);
    ctx.stroke();
    ctx.restore();
  }

  function drawWomanSilhouette(ctx, x, y, h, rgb, alpha, sway) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = rgba(rgb, alpha);
    ctx.beginPath();
    ctx.arc(sway * h * 0.03, -h * 0.78, h * 0.095, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-h * 0.11 + sway * h * 0.02, -h * 0.66);
    ctx.quadraticCurveTo(h * 0.13, -h * 0.66, h * 0.10, -h * 0.38);
    ctx.quadraticCurveTo(h * 0.24, -h * 0.02, h * 0.28, h * 0.22);
    ctx.lineTo(-h * 0.26, h * 0.22);
    ctx.quadraticCurveTo(-h * 0.20, -h * 0.06, -h * 0.09, -h * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function renderHesitationStation(ctx, cx, cy, radius, state) {
    var ageT = state.ageState.ageProgress;
    var archStone = mixRgb([198, 186, 166], [156, 136, 108], ageT);
    var womanOneRgb = mixRgb([246, 214, 158], [198, 172, 134], ageT);
    var womanTwoRgb = mixRgb([196, 224, 248], [178, 168, 150], ageT);
    var thirdRgb = mixRgb([255, 182, 118], [210, 162, 116], ageT);

    ctx.save();
    ctx.translate(cx, cy);
    var r = radius * 0.88;

    var archPositions = [-r * 0.52, r * 0.52];
    for (var a = 0; a < 2; a++) {
      var ax = archPositions[a];
      var chosen = state.lastWomanChoice === a;
      var wCol = a === 0 ? womanOneRgb : womanTwoRgb;
      ctx.beginPath();
      ctx.moveTo(ax - r * 0.24, r * 0.52);
      ctx.lineTo(ax - r * 0.24, -r * 0.16);
      ctx.arc(ax, -r * 0.16, r * 0.24, Math.PI, 0);
      ctx.lineTo(ax + r * 0.24, r * 0.52);
      ctx.closePath();
      ctx.fillStyle = rgba(wCol, chosen ? 0.24 : 0.13);
      ctx.fill();
      ctx.lineWidth = chosen ? 2.4 : 1.5;
      ctx.strokeStyle = rgba(archStone, 0.82);
      ctx.stroke();

      var sway = Math.sin(state.clock * 1.6 + a * 2.1);
      drawWomanSilhouette(ctx, ax, r * 0.32, r * 0.58, wCol, chosen ? 0.92 : 0.72, sway);
    }

    var reveal = clamp(state.thirdWomanGlow + (state.thirdWomanReveals > 0 ? 0.72 : 0.08), 0, 1);
    ctx.beginPath();
    ctx.moveTo(-r * 0.23, r * 0.44);
    ctx.lineTo(-r * 0.23, -r * 0.32);
    ctx.arc(0, -r * 0.32, r * 0.23, Math.PI, 0);
    ctx.lineTo(r * 0.23, r * 0.44);
    ctx.closePath();
    ctx.fillStyle = rgba(thirdRgb, 0.06 + reveal * 0.36);
    ctx.fill();
    ctx.lineWidth = 1.4 + reveal * 1.8;
    ctx.strokeStyle = rgba(thirdRgb, 0.28 + reveal * 0.68);
    ctx.stroke();

    if (reveal > 0.12) {
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.52);
      ctx.lineTo(-r * 0.34, r * 0.62);
      ctx.lineTo(r * 0.34, r * 0.62);
      ctx.closePath();
      ctx.fillStyle = rgba(thirdRgb, reveal * 0.20);
      ctx.fill();
      drawWomanSilhouette(ctx, 0, r * (0.30 - reveal * 0.06), r * (0.52 + reveal * 0.12), thirdRgb, reveal * 0.98, Math.cos(state.clock * 2.0));
      for (var rp = 1; rp <= 2; rp++) {
        ctx.beginPath();
        safeEllipse(ctx, 0, r * 0.46, r * 0.14 * rp * reveal, r * 0.045 * rp * reveal, 0, 0, Math.PI * 2);
        ctx.strokeStyle = rgba(thirdRgb, reveal * 0.55 / rp);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function renderCockfightStation(ctx, cx, cy, radius, state) {
    var ageT = state.ageState.ageProgress;
    var chalkRgb = mixRgb([242, 236, 224], [188, 172, 148], ageT);
    var crimsonRgb = mixRgb([212, 38, 46], [156, 74, 62], ageT);
    var copperRgb = mixRgb([224, 148, 66], [174, 134, 92], ageT);
    var plumageRgb = mixRgb([44, 152, 128], [94, 114, 98], ageT);
    var cloakDark = mixRgb([26, 30, 42], [66, 56, 46], ageT);
    var brawl = state.cockfightBrawlIntensity;

    ctx.save();
    ctx.translate(cx, cy);
    var pitR = radius * 0.56;

    ctx.beginPath();
    ctx.arc(0, 0, pitR, 0, Math.PI * 2);
    ctx.fillStyle = rgba(mixRgb([62, 48, 38], [84, 70, 54], ageT), 0.58);
    ctx.fill();
    if (typeof ctx.setLineDash === 'function') ctx.setLineDash(brawl > 0.45 ? [8, 5, 3, 6] : []);
    ctx.lineWidth = 2.4;
    ctx.strokeStyle = rgba(chalkRgb, 0.85 - brawl * 0.25);
    ctx.stroke();
    if (typeof ctx.setLineDash === 'function') ctx.setLineDash([]);

    if (brawl > 0.30) {
      for (var sw = 1; sw <= 3; sw++) {
        var sr = pitR * (0.32 + sw * 0.24 * brawl);
        ctx.beginPath();
        ctx.arc(0, 0, sr, 0, Math.PI * 2);
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = rgba(crimsonRgb, (brawl - 0.25) * 0.45 / sw);
        ctx.stroke();
      }
    }

    for (var c = 0; c < 2; c++) {
      var dir = c === 0 ? 1 : -1;
      var cAng = state.clock * (2.6 + brawl * 4.2) + c * Math.PI;
      var cDist = pitR * lerp(0.32, 0.14, brawl);
      var gx = Math.cos(cAng) * cDist;
      var gy = Math.sin(cAng) * cDist;
      ctx.save();
      ctx.translate(gx, gy);
      ctx.rotate(cAng + Math.PI * 0.5 * dir);
      ctx.beginPath();
      safeEllipse(ctx, 0, 0, pitR * 0.13, pitR * 0.085, 0, 0, Math.PI * 2);
      ctx.fillStyle = rgba(c === 0 ? copperRgb : plumageRgb, 0.94);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-pitR * 0.10, 0);
      ctx.quadraticCurveTo(-pitR * 0.28, -pitR * 0.22, -pitR * 0.34, pitR * 0.06);
      ctx.lineWidth = 2.6;
      ctx.strokeStyle = rgba(crimsonRgb, 0.92);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(pitR * 0.13, -pitR * 0.04, pitR * 0.042, 0, Math.PI * 2);
      ctx.fillStyle = rgba(crimsonRgb, 0.96);
      ctx.fill();
      ctx.restore();
    }

    var bettors = state.bettors;
    for (var b = 0; b < bettors.length; b++) {
      var bt = bettors[b];
      var bAng = bt.baseAngle + state.clock * bt.orbitSpeed * brawl * 1.35;
      var surge = brawl * (0.48 + 0.18 * Math.sin(state.clock * 5.8 + bt.lungePhase));
      var bRad = pitR * (1.18 - surge * 0.78);
      var bx = Math.cos(bAng) * bRad;
      var by = Math.sin(bAng) * bRad;
      var bSize = radius * 0.082 * bt.shoulderScale;

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(bAng + Math.PI * 0.5 + (brawl > 0.35 ? Math.sin(state.clock * 7 + b) * 0.45 : 0));
      ctx.beginPath();
      safeEllipse(ctx, 0, 0, bSize * 1.15, bSize * 0.68, 0, 0, Math.PI * 2);
      ctx.fillStyle = rgba(cloakDark, 0.92);
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = rgba(brawl > 0.45 && b % 2 === 0 ? crimsonRgb : chalkRgb, 0.68);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, bSize * (bt.hatBrim ? 0.54 : 0.38), 0, Math.PI * 2);
      ctx.fillStyle = rgba(mixRgb([88, 72, 58], [108, 92, 74], ageT), 0.95);
      ctx.fill();
      ctx.restore();
    }

    if (brawl > 0.18) {
      var feathers = state.feathers;
      var activeCount = Math.min(feathers.length, Math.floor(8 + brawl * 34));
      for (var f = 0; f < activeCount; f++) {
        var ft = feathers[f];
        var travel = ((ft.progress + state.clock * ft.speed * (0.35 + brawl)) % 1);
        var fRad = pitR * (0.08 + travel * (0.55 + brawl * 0.65));
        var fx = Math.cos(ft.angle) * fRad;
        var fy = Math.sin(ft.angle) * fRad;
        ctx.save();
        ctx.translate(fx, fy);
        ctx.rotate(ft.angle + state.clock * ft.spin);
        ctx.beginPath();
        safeEllipse(ctx, 0, 0, ft.length * 0.55, ft.length * 0.18, 0, 0, Math.PI * 2);
        ctx.fillStyle = rgba(ft.crimson ? crimsonRgb : copperRgb, (1 - travel * 0.72) * clamp(brawl * 1.25, 0.25, 0.96));
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function renderMasterFrame(ctx, w, h, state) {
    if (!ctx || w <= 0 || h <= 0) return;
    var ageT = state.ageState.ageProgress;
    var scale = clamp(state.ageState.distanceScale, 0.38, 1.08);
    var bgTop = mixRgb([11, 20, 38], [58, 49, 39], ageT);
    var bgBot = mixRgb([24, 38, 62], [116, 98, 76], ageT);

    ctx.save();
    ctx.clearRect(0, 0, w, h);
    var bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, rgba(bgTop, 1));
    bgGrad.addColorStop(1, rgba(bgBot, 1));
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    var recedeY = -h * 0.11 * ageT;
    var cx = w * 0.5;
    var cy = h * 0.48 + recedeY;
    var baseRadius = Math.min(w, h) * 0.41;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    var isSpiral = state.activeStation === 'spiral';
    renderSpiralVault(ctx, 0, 0, baseRadius, state, isSpiral ? 1.0 : 0.24);

    if (state.activeStation === 'violin') {
      renderViolinStation(ctx, 0, 0, baseRadius, state);
    } else if (state.activeStation === 'telescope') {
      renderTelescopeStation(ctx, 0, 0, baseRadius, state);
    } else if (state.activeStation === 'hesitation') {
      renderHesitationStation(ctx, 0, 0, baseRadius, state);
    } else if (state.activeStation === 'cockfight') {
      renderCockfightStation(ctx, 0, 0, baseRadius, state);
    }
    ctx.restore();

    if (ageT > 0.04) {
      var hazeRgb = mixRgb([188, 162, 124], [154, 134, 106], ageT);
      ctx.fillStyle = rgba(hazeRgb, ageT * 0.22);
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();
  }

  function injectScopedStyles(doc) {
    if (!doc || !doc.head || typeof doc.getElementById !== 'function') return;
    if (doc.getElementById('isidora-spiral-desires-styles')) return;
    var st = doc.createElement('style');
    st.id = 'isidora-spiral-desires-styles';
    st.textContent = [
      '.isidora-sd-console{display:flex;flex-direction:column;gap:6px;width:100%;box-sizing:border-box;font-family:Georgia,serif;color:#f3e7cf;}',
      '.isidora-sd-rail{display:flex;flex-wrap:wrap;gap:4px;align-items:center;}',
      '.isidora-sd-tab,.isidora-sd-trigger{appearance:none;border:1px solid rgba(232,198,136,0.45);background:rgba(20,28,44,0.82);color:#f5ead4;padding:4px 8px;border-radius:4px;font-size:12px;line-height:1.25;cursor:pointer;}',
      '.isidora-sd-tab[aria-selected="true"]{background:rgba(196,148,72,0.34);border-color:#f2cb82;font-weight:600;}',
      '.isidora-sd-deck{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:5px 8px;border:1px solid rgba(226,194,138,0.32);background:rgba(16,22,36,0.76);border-radius:5px;box-sizing:border-box;}',
      '.isidora-sd-deck[hidden]{display:none !important;}',
      '.isidora-sd-readout{font-size:11px;opacity:0.9;margin-left:auto;white-space:nowrap;}',
      '.isidora-sd-range{accent-color:#e4b660;max-width:130px;cursor:pointer;}'
    ].join('\n');
    doc.head.appendChild(st);
  }

  function computeViolinHarmony(cents) {
    var errSum = 0;
    for (var i = 0; i < 4; i++) {
      errSum += Math.abs(cents[i]) / 32;
    }
    for (var j = 0; j < 3; j++) {
      errSum += Math.abs(cents[j + 1] - cents[j]) / 40;
    }
    var score = 1 - clamp(errSum / 5.2, 0, 0.92);
    return Math.round(score * 1000) / 1000;
  }

  function computeTelescopeSharpness(focusVal) {
    var dist = Math.abs(clamp(focusVal, 0, 1) - 0.74);
    var raw = 1 - clamp(dist / 0.74, 0, 1);
    var curved = Math.pow(raw, 1.25);
    return Math.round(clamp(curved, 0.05, 1) * 1000) / 1000;
  }

  function detectInitialReducedMotion(explicitFlag) {
    if (typeof explicitFlag === 'boolean') return explicitFlag;
    if (typeof global.matchMedia === 'function') {
      try {
        return Boolean(global.matchMedia('(prefers-reduced-motion: reduce)').matches);
      } catch (_) {}
    }
    return false;
  }

  function createIsidoraSpiralDesires(options) {
    var opts = options || {};
    var onDesirePursued = typeof opts.onDesirePursued === 'function' ? opts.onDesirePursued : null;
    var audio = createAudioEngine();

    var state = {
      activeStation: 'spiral',
      reducedMotion: detectInitialReducedMotion(opts.reducedMotion),
      clock: 0.35,
      shimmerBoost: 0,
      spiralTurns: 0,
      spiralAngle: 0,
      spiralZoom: 1.0,
      seashells: buildSeashells(SEASHELL_TOTAL),
      violinCents: [
        VIOLIN_COURSES[0].initialCents,
        VIOLIN_COURSES[1].initialCents,
        VIOLIN_COURSES[2].initialCents,
        VIOLIN_COURSES[3].initialCents
      ],
      violinCursor: 0,
      stringEnergy: [0, 0, 0, 0],
      violinFifthsHarmony: 0,
      telescopeFocus: 0.16,
      telescopeSharpness: 0,
      starfield: buildConstellationField(),
      hesitationAttempts: 0,
      thirdWomanReveals: 0,
      lastWomanChoice: -1,
      thirdWomanGlow: 0,
      cockfightBrawlIntensity: 0.12,
      bettors: buildBettors(10),
      feathers: buildFeathers(42),
      stationCounts: {
        spiral: 0,
        violin: 0,
        telescope: 0,
        hesitation: 0,
        cockfight: 0
      },
      totalDesiresPursued: 0,
      ageState: {
        ageProgress: 0,
        phase: 'youth_dream',
        isSeatedOnWall: false,
        memoryFilterHz: 13500,
        distanceScale: 1.0
      }
    };

    state.violinFifthsHarmony = computeViolinHarmony(state.violinCents);
    state.telescopeSharpness = computeTelescopeSharpness(state.telescopeFocus);

    var canvasEl = null;
    var ctx2d = null;
    var controlsRootEl = null;
    var domRefs = null;
    var widthPx = 800;
    var heightPx = 600;
    var rafId = null;
    var lastFrameMs = 0;
    var resizeObs = null;
    var cleanups = [];
    var destroyed = false;

    function syncDomReadouts() {
      if (!domRefs) return;
      for (var i = 0; i < STATION_LIST.length; i++) {
        var st = STATION_LIST[i];
        var isAct = state.activeStation === st;
        if (domRefs.tabs[st]) {
          domRefs.tabs[st].setAttribute('aria-selected', isAct ? 'true' : 'false');
        }
        if (domRefs.decks[st]) {
          if (isAct) domRefs.decks[st].removeAttribute('hidden');
          else domRefs.decks[st].setAttribute('hidden', '');
          domRefs.decks[st].setAttribute('data-active', isAct ? 'true' : 'false');
        }
      }
      if (domRefs.spiralReadout) {
        domRefs.spiralReadout.textContent = 'Turns ' + state.spiralTurns.toFixed(2) + ' · ' + state.seashells.length + ' shells';
      }
      if (domRefs.violinReadout) {
        domRefs.violinReadout.textContent = '3:2 Fifths ' + Math.round(state.violinFifthsHarmony * 100) + '%';
      }
      if (domRefs.telescopeRange) {
        domRefs.telescopeRange.value = String(Math.round(state.telescopeFocus * 100));
      }
      if (domRefs.telescopeReadout) {
        domRefs.telescopeReadout.textContent = 'Sharpness ' + Math.round(state.telescopeSharpness * 100) + '%';
      }
      if (domRefs.hesitationReadout) {
        domRefs.hesitationReadout.textContent = '3rd Woman reveals: ' + state.thirdWomanReveals;
      }
      if (domRefs.cockfightReadout) {
        domRefs.cockfightReadout.textContent = 'Brawl ' + Math.round(state.cockfightBrawlIntensity * 100) + '%';
      }
      if (domRefs.consoleEl) {
        domRefs.consoleEl.setAttribute('data-age-phase', state.ageState.phase || 'youth_dream');
        domRefs.consoleEl.setAttribute('data-seated-wall', state.ageState.isSeatedOnWall ? 'true' : 'false');
      }
    }

    function drawNow() {
      if (!ctx2d || destroyed) return;
      renderMasterFrame(ctx2d, widthPx, heightPx, state);
    }

    function stepPhysics(dt) {
      state.clock += dt;
      state.shimmerBoost *= Math.pow(0.28, dt);
      state.thirdWomanGlow = Math.max(state.thirdWomanReveals > 0 ? 0.45 : 0, state.thirdWomanGlow - dt * 0.28);
      for (var i = 0; i < 4; i++) {
        state.stringEnergy[i] *= Math.pow(0.16, dt);
        if (state.stringEnergy[i] < 0.004) state.stringEnergy[i] = 0;
      }
    }

    function onAnimFrame(nowMs) {
      rafId = null;
      if (destroyed || state.reducedMotion) return;
      var dt = lastFrameMs ? clamp((nowMs - lastFrameMs) / 1000, 0.004, 0.06) : 0.016;
      lastFrameMs = nowMs;
      stepPhysics(dt);
      drawNow();
      if (typeof global.requestAnimationFrame === 'function') {
        rafId = global.requestAnimationFrame(onAnimFrame);
      }
    }

    function syncLoop() {
      if (rafId !== null && typeof global.cancelAnimationFrame === 'function') {
        global.cancelAnimationFrame(rafId);
        rafId = null;
      }
      lastFrameMs = 0;
      if (!destroyed && !state.reducedMotion && ctx2d && typeof global.requestAnimationFrame === 'function') {
        rafId = global.requestAnimationFrame(onAnimFrame);
      }
    }

    function getTelemetry() {
      return {
        activeStation: state.activeStation,
        spiralTurns: state.spiralTurns,
        seashellCount: state.seashells.length,
        violinFifthsHarmony: state.violinFifthsHarmony,
        telescopeSharpness: state.telescopeSharpness,
        hesitationAttempts: state.hesitationAttempts,
        thirdWomanReveals: state.thirdWomanReveals,
        cockfightBrawlIntensity: state.cockfightBrawlIntensity,
        stationCounts: {
          spiral: state.stationCounts.spiral,
          violin: state.stationCounts.violin,
          telescope: state.stationCounts.telescope,
          hesitation: state.stationCounts.hesitation,
          cockfight: state.stationCounts.cockfight
        },
        totalDesiresPursued: state.totalDesiresPursued
      };
    }

    function selectStation(stationId) {
      var next = STATION_META[stationId] ? stationId : 'spiral';
      state.activeStation = next;
      syncDomReadouts();
      drawNow();
    }

    function actOnStation(stationId, actionPayload) {
      var target = STATION_META[stationId] ? stationId : state.activeStation;
      var payload = actionPayload || {};
      var fromGesture = Boolean(payload.fromUserGesture);
      if (!payload.keepActiveStation) {
        state.activeStation = target;
      }

      var meta = STATION_META[target];
      var intensity = 0.72;
      var customLabel = meta.label;

      if (target === 'spiral') {
        var turnStep = typeof payload.turns === 'number' && isFinite(payload.turns) ? payload.turns : 0.35;
        state.spiralTurns = Math.round((state.spiralTurns + Math.abs(turnStep || 0.25)) * 1000) / 1000;
        state.spiralAngle += turnStep * Math.PI * 2;
        if (typeof payload.zoom === 'number' && isFinite(payload.zoom)) {
          state.spiralZoom = clamp(payload.zoom, 0.76, 1.48);
        } else {
          state.spiralZoom = 0.94 + 0.16 * Math.sin(state.spiralTurns * 1.4);
        }
        state.shimmerBoost = 1.0;
        intensity = clamp(0.58 + (state.spiralTurns % 1) * 0.4, 0.45, 1.0);
        synthStationSound(audio, 'spiral', { turns: state.spiralTurns }, fromGesture);
      } else if (target === 'violin') {
        var idx = state.violinCursor;
        if (typeof payload.stringIndex === 'number') {
          idx = clamp(Math.floor(payload.stringIndex), 0, 3);
        } else if (typeof payload.course === 'string') {
          for (var c = 0; c < 4; c++) {
            if (VIOLIN_COURSES[c].id === payload.course) idx = c;
          }
        }
        state.violinCursor = (idx + 1) % 4;

        if (typeof payload.cents === 'number' && isFinite(payload.cents)) {
          state.violinCents[idx] = clamp(payload.cents, -45, 45);
        } else if (typeof payload.centsDelta === 'number' && isFinite(payload.centsDelta)) {
          state.violinCents[idx] = clamp(state.violinCents[idx] + payload.centsDelta, -45, 45);
        } else {
          state.violinCents[idx] = Math.abs(state.violinCents[idx]) < 2.5 ? 0 : state.violinCents[idx] * 0.18;
          for (var k = 0; k < 4; k++) {
            if (k !== idx) {
              state.violinCents[k] = Math.abs(state.violinCents[k]) < 2.5 ? 0 : state.violinCents[k] * 0.55;
            }
          }
        }
        state.violinFifthsHarmony = computeViolinHarmony(state.violinCents);
        var pairIdx = idx < 3 ? idx + 1 : idx - 1;
        state.stringEnergy[idx] = 1.0;
        state.stringEnergy[pairIdx] = Math.max(state.stringEnergy[pairIdx], 0.58);
        var freqMain = VIOLIN_COURSES[idx].targetHz * Math.pow(2, state.violinCents[idx] / 1200);
        var freqPair = VIOLIN_COURSES[pairIdx].targetHz * Math.pow(2, state.violinCents[pairIdx] / 1200);
        var bowed = Boolean(payload.bow || payload.mode === 'bow');
        customLabel = (bowed ? 'Bowed ' : 'Plucked ') + VIOLIN_COURSES[idx].id + '–' + VIOLIN_COURSES[pairIdx].id + ' Violin Fifth';
        intensity = clamp(0.5 + state.violinFifthsHarmony * 0.5, 0.45, 1.0);
        synthViolinString(audio, freqMain, freqPair, bowed, fromGesture);
      } else if (target === 'telescope') {
        if (typeof payload.sharpness === 'number' && isFinite(payload.sharpness)) {
          state.telescopeSharpness = clamp(Math.round(payload.sharpness * 1000) / 1000, 0, 1);
          state.telescopeFocus = clamp(0.74 - (1 - state.telescopeSharpness) * 0.58, 0, 1);
        } else if (typeof payload.focus === 'number' && isFinite(payload.focus)) {
          state.telescopeFocus = clamp(payload.focus, 0, 1);
          state.telescopeSharpness = computeTelescopeSharpness(state.telescopeFocus);
        } else if (typeof payload.delta === 'number' && isFinite(payload.delta)) {
          state.telescopeFocus = clamp(state.telescopeFocus + payload.delta, 0, 1);
          state.telescopeSharpness = computeTelescopeSharpness(state.telescopeFocus);
        } else {
          var gap = 0.74 - state.telescopeFocus;
          state.telescopeFocus = Math.abs(gap) < 0.035 ? 0.74 : state.telescopeFocus + gap * 0.65;
          state.telescopeSharpness = computeTelescopeSharpness(state.telescopeFocus);
        }
        intensity = clamp(0.45 + state.telescopeSharpness * 0.55, 0.45, 1.0);
        synthStationSound(audio, 'telescope', { sharpness: state.telescopeSharpness }, fromGesture);
      } else if (target === 'hesitation') {
        var chosen = state.lastWomanChoice === 0 ? 1 : 0;
        if (payload.choice === 0 || payload.choice === 1) chosen = payload.choice;
        else if (payload.woman === 1 || payload.woman === 2) chosen = payload.woman - 1;
        state.lastWomanChoice = chosen;
        state.hesitationAttempts += 1;
        state.thirdWomanReveals += 1;
        state.thirdWomanGlow = 1.0;
        customLabel = 'Leaned toward Woman ' + (chosen === 0 ? 'I' : 'II') + ' — Encountered a Third Woman';
        intensity = 0.88;
        synthStationSound(audio, 'hesitation', { choice: chosen }, fromGesture);
      } else if (target === 'cockfight') {
        if (typeof payload.intensity === 'number' && isFinite(payload.intensity)) {
          state.cockfightBrawlIntensity = clamp(Math.max(state.cockfightBrawlIntensity, payload.intensity), 0, 1);
        } else {
          var stepBrawl = typeof payload.delta === 'number' && isFinite(payload.delta) ? payload.delta : 0.36;
          state.cockfightBrawlIntensity = clamp(Math.round((state.cockfightBrawlIntensity + stepBrawl) * 1000) / 1000, 0, 1);
        }
        intensity = clamp(0.55 + state.cockfightBrawlIntensity * 0.45, 0.5, 1.0);
        synthStationSound(audio, 'cockfight', { intensity: state.cockfightBrawlIntensity }, fromGesture);
      }

      state.stationCounts[target] += 1;
      state.totalDesiresPursued += 1;
      if (state.reducedMotion) state.clock += 0.35;

      var desireEvent = {
        station: target,
        deltaAge: typeof payload.deltaAge === 'number' && payload.deltaAge > 0 ? payload.deltaAge : meta.deltaAge,
        label: customLabel,
        memoryEcho: meta.memoryEcho,
        intensity: Math.round(intensity * 1000) / 1000
      };

      syncDomReadouts();
      drawNow();
      if (onDesirePursued) {
        onDesirePursued(desireEvent);
      }

      return {
        station: desireEvent.station,
        deltaAge: desireEvent.deltaAge,
        label: desireEvent.label,
        memoryEcho: desireEvent.memoryEcho,
        intensity: desireEvent.intensity,
        telemetry: getTelemetry()
      };
    }

    function setAgeState(nextState) {
      var incoming = nextState || {};
      var nextAge = typeof incoming.ageProgress === 'number' && isFinite(incoming.ageProgress)
        ? clamp(incoming.ageProgress, 0, 1)
        : state.ageState.ageProgress;
      var nextScale = typeof incoming.distanceScale === 'number' && isFinite(incoming.distanceScale)
        ? clamp(incoming.distanceScale, 0.36, 1.08)
        : clamp(1 - nextAge * 0.42, 0.42, 1.0);
      var nextHz = typeof incoming.memoryFilterHz === 'number' && isFinite(incoming.memoryFilterHz)
        ? clamp(incoming.memoryFilterHz, 280, 18000)
        : Math.round(13500 * Math.pow(660 / 13500, nextAge));

      state.ageState = {
        ageProgress: nextAge,
        phase: incoming.phase || (nextAge >= 0.9 ? 'seated_elder' : nextAge >= 0.4 ? 'twilight_drift' : 'youth_dream'),
        isSeatedOnWall: Boolean(incoming.isSeatedOnWall || nextAge >= 0.9),
        memoryFilterHz: nextHz,
        distanceScale: nextScale
      };
      audio.setAgeFilter(nextHz, nextAge);
      syncDomReadouts();
      drawNow();
    }

    function setAudioMuted(muted) {
      audio.setMuted(Boolean(muted));
    }

    function setReducedMotion(reduced) {
      state.reducedMotion = Boolean(reduced);
      syncLoop();
      drawNow();
    }

    function resize(width, height) {
      var w = typeof width === 'number' && width > 0 ? width : widthPx;
      var h = typeof height === 'number' && height > 0 ? height : heightPx;
      widthPx = Math.max(120, Math.round(w));
      heightPx = Math.max(120, Math.round(h));
      if (canvasEl) {
        var dpr = typeof global.devicePixelRatio === 'number' ? clamp(global.devicePixelRatio, 1, 2) : 1;
        canvasEl.width = Math.round(widthPx * dpr);
        canvasEl.height = Math.round(heightPx * dpr);
        if (ctx2d && typeof ctx2d.setTransform === 'function') {
          ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
      }
      drawNow();
    }

    function addListener(target, type, fn, optsArg) {
      if (!target || typeof target.addEventListener !== 'function') return;
      target.addEventListener(type, fn, optsArg || false);
      cleanups.push(function () {
        if (typeof target.removeEventListener === 'function') {
          target.removeEventListener(type, fn, optsArg || false);
        }
      });
    }

    function buildControlsDom(rootEl) {
      var doc = rootEl.ownerDocument || global.document;
      if (!doc || typeof doc.createElement !== 'function') return;
      injectScopedStyles(doc);
      rootEl.innerHTML = '';

      var consoleEl = doc.createElement('isidora-desire-console');
      consoleEl.className = 'isidora-sd-console';
      var railEl = doc.createElement('isidora-station-rail');
      railEl.className = 'isidora-sd-rail';
      railEl.setAttribute('role', 'tablist');
      railEl.setAttribute('aria-label', 'Chambers of Desire');

      var tabs = {};
      var decks = {};
      var tabLabels = {
        spiral: '1 · Spiral Shells',
        violin: '2 · Violin Fifths',
        telescope: '3 · Brass Telescope',
        hesitation: '4 · Three Women',
        cockfight: '5 · Cockfight Pit'
      };

      for (var i = 0; i < STATION_LIST.length; i++) {
        (function (stId) {
          var b = doc.createElement('button');
          b.type = 'button';
          b.className = 'isidora-sd-tab';
          b.setAttribute('role', 'tab');
          b.setAttribute('data-station', stId);
          b.textContent = tabLabels[stId];
          addListener(b, 'click', function () {
            audio.unlock();
            selectStation(stId);
          });
          tabs[stId] = b;
          railEl.appendChild(b);
        })(STATION_LIST[i]);
      }
      consoleEl.appendChild(railEl);

      function makeBtn(label, onClick) {
        var btn = doc.createElement('button');
        btn.type = 'button';
        btn.className = 'isidora-sd-trigger';
        btn.textContent = label;
        addListener(btn, 'click', function () {
          audio.unlock();
          onClick();
        });
        return btn;
      }

      var spiralDeck = doc.createElement('seashell-whorl');
      spiralDeck.className = 'isidora-sd-deck';
      spiralDeck.appendChild(makeBtn('Turn Golden Spiral', function () {
        actOnStation('spiral', { turns: 0.35, fromUserGesture: true });
      }));
      spiralDeck.appendChild(makeBtn('Deepen Shell Vault', function () {
        actOnStation('spiral', { turns: 0.55, zoom: 1.18, fromUserGesture: true });
      }));
      var spiralReadout = doc.createElement('span');
      spiralReadout.className = 'isidora-sd-readout';
      spiralDeck.appendChild(spiralReadout);
      decks.spiral = spiralDeck;
      consoleEl.appendChild(spiralDeck);

      var violinDeck = doc.createElement('luthier-pegbox');
      violinDeck.className = 'isidora-sd-deck';
      for (var v = 0; v < VIOLIN_COURSES.length; v++) {
        (function (vIdx) {
          var vc = VIOLIN_COURSES[vIdx];
          violinDeck.appendChild(makeBtn(vc.id + ' ' + vc.targetHz.toFixed(0) + 'Hz', function () {
            actOnStation('violin', { stringIndex: vIdx, fromUserGesture: true });
          }));
        })(v);
      }
      violinDeck.appendChild(makeBtn('Bow 3:2 Fifths', function () {
        actOnStation('violin', { bow: true, fromUserGesture: true });
      }));
      var violinReadout = doc.createElement('span');
      violinReadout.className = 'isidora-sd-readout';
      violinDeck.appendChild(violinReadout);
      decks.violin = violinDeck;
      consoleEl.appendChild(violinDeck);

      var teleDeck = doc.createElement('brass-refractor');
      teleDeck.className = 'isidora-sd-deck';
      var teleRange = doc.createElement('input');
      teleRange.type = 'range';
      teleRange.min = '0';
      teleRange.max = '100';
      teleRange.value = String(Math.round(state.telescopeFocus * 100));
      teleRange.className = 'isidora-sd-range';
      teleRange.setAttribute('aria-label', 'Vernier Drawtube Focus');
      addListener(teleRange, 'input', function () {
        state.telescopeFocus = clamp(Number(teleRange.value) / 100, 0, 1);
        state.telescopeSharpness = computeTelescopeSharpness(state.telescopeFocus);
        syncDomReadouts();
        drawNow();
      });
      addListener(teleRange, 'change', function () {
        audio.unlock();
        actOnStation('telescope', { focus: clamp(Number(teleRange.value) / 100, 0, 1), fromUserGesture: true });
      });
      teleDeck.appendChild(teleRange);
      teleDeck.appendChild(makeBtn('Lock Constellation Focus', function () {
        actOnStation('telescope', { focus: 0.74, fromUserGesture: true });
      }));
      var teleReadout = doc.createElement('span');
      teleReadout.className = 'isidora-sd-readout';
      teleDeck.appendChild(teleReadout);
      decks.telescope = teleDeck;
      consoleEl.appendChild(teleDeck);

      var hesDeck = doc.createElement('hesitation-loggia');
      hesDeck.className = 'isidora-sd-deck';
      hesDeck.appendChild(makeBtn('Approach Woman I', function () {
        actOnStation('hesitation', { choice: 0, fromUserGesture: true });
      }));
      hesDeck.appendChild(makeBtn('Approach Woman II', function () {
        actOnStation('hesitation', { choice: 1, fromUserGesture: true });
      }));
      var hesReadout = doc.createElement('span');
      hesReadout.className = 'isidora-sd-readout';
      hesDeck.appendChild(hesReadout);
      decks.hesitation = hesDeck;
      consoleEl.appendChild(hesDeck);

      var pitDeck = doc.createElement('cockfight-pit');
      pitDeck.className = 'isidora-sd-deck';
      pitDeck.appendChild(makeBtn('Press Pit Wager', function () {
        actOnStation('cockfight', { delta: 0.36, fromUserGesture: true });
      }));
      pitDeck.appendChild(makeBtn('Incite Bettors Brawl', function () {
        actOnStation('cockfight', { intensity: 1.0, fromUserGesture: true });
      }));
      var pitReadout = doc.createElement('span');
      pitReadout.className = 'isidora-sd-readout';
      pitDeck.appendChild(pitReadout);
      decks.cockfight = pitDeck;
      consoleEl.appendChild(pitDeck);

      rootEl.appendChild(consoleEl);
      domRefs = {
        consoleEl: consoleEl,
        tabs: tabs,
        decks: decks,
        spiralReadout: spiralReadout,
        violinReadout: violinReadout,
        telescopeRange: teleRange,
        telescopeReadout: teleReadout,
        hesitationReadout: hesReadout,
        cockfightReadout: pitReadout
      };
      syncDomReadouts();
    }

    function mount(nextCanvasEl, nextControlsRootEl) {
      canvasEl = nextCanvasEl || null;
      controlsRootEl = nextControlsRootEl || null;

      if (canvasEl && typeof canvasEl.getContext === 'function') {
        ctx2d = canvasEl.getContext('2d');
        if (typeof canvasEl.setAttribute === 'function') {
          if (!canvasEl.getAttribute('tabindex')) canvasEl.setAttribute('tabindex', '0');
          canvasEl.setAttribute('role', 'region');
          canvasEl.setAttribute('aria-label', 'Isidora Spiral Stairwell and Chambers of Desire');
        }
        var rect = typeof canvasEl.getBoundingClientRect === 'function'
          ? canvasEl.getBoundingClientRect()
          : { width: canvasEl.width || 800, height: canvasEl.height || 600 };
        resize(rect.width || canvasEl.clientWidth || 800, rect.height || canvasEl.clientHeight || 600);

        var dragActive = false;
        var dragStartX = 0;
        var dragMoved = 0;

        addListener(canvasEl, 'pointerdown', function (ev) {
          audio.unlock();
          dragActive = true;
          dragStartX = ev.clientX || 0;
          dragMoved = 0;
        });

        addListener(canvasEl, 'pointermove', function (ev) {
          if (!dragActive) return;
          var dx = (ev.clientX || 0) - dragStartX;
          dragStartX = ev.clientX || 0;
          dragMoved += Math.abs(dx);
          if (state.activeStation === 'spiral') {
            state.spiralAngle += dx * 0.012;
          } else if (state.activeStation === 'telescope') {
            state.telescopeFocus = clamp(state.telescopeFocus + dx * 0.0025, 0, 1);
            state.telescopeSharpness = computeTelescopeSharpness(state.telescopeFocus);
            syncDomReadouts();
          }
          drawNow();
        });

        addListener(canvasEl, 'pointerup', function (ev) {
          if (!dragActive) return;
          dragActive = false;
          var r = typeof canvasEl.getBoundingClientRect === 'function'
            ? canvasEl.getBoundingClientRect()
            : { left: 0, width: widthPx };
          var relX = ((ev.clientX || 0) - (r.left || 0)) / Math.max(1, r.width || widthPx);
          if (state.activeStation === 'hesitation') {
            actOnStation('hesitation', { choice: relX < 0.5 ? 0 : 1, fromUserGesture: true });
          } else if (state.activeStation === 'violin') {
            var sIdx = clamp(Math.floor(relX * 4), 0, 3);
            actOnStation('violin', { stringIndex: sIdx, bow: dragMoved > 24, fromUserGesture: true });
          } else if (state.activeStation === 'telescope' && dragMoved > 8) {
            actOnStation('telescope', { focus: state.telescopeFocus, fromUserGesture: true });
          } else {
            actOnStation(state.activeStation, { fromUserGesture: true });
          }
        });

        addListener(canvasEl, 'wheel', function (ev) {
          if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
          audio.unlock();
          var dir = (ev && ev.deltaY > 0) ? 1 : -1;
          if (state.activeStation === 'telescope') {
            actOnStation('telescope', { delta: dir * 0.12, fromUserGesture: true });
          } else {
            actOnStation('spiral', { turns: dir * 0.22, fromUserGesture: true });
          }
        }, { passive: false });

        addListener(canvasEl, 'keydown', function (ev) {
          if (!ev) return;
          var k = ev.key;
          if (k >= '1' && k <= '5') {
            ev.preventDefault();
            audio.unlock();
            selectStation(STATION_LIST[Number(k) - 1]);
          } else if (k === 'Enter' || k === ' ') {
            ev.preventDefault();
            audio.unlock();
            actOnStation(state.activeStation, { fromUserGesture: true });
          } else if (k === 'ArrowLeft' || k === 'ArrowRight') {
            ev.preventDefault();
            audio.unlock();
            var sgn = k === 'ArrowRight' ? 1 : -1;
            if (state.activeStation === 'hesitation') {
              actOnStation('hesitation', { choice: sgn < 0 ? 0 : 1, fromUserGesture: true });
            } else if (state.activeStation === 'telescope') {
              actOnStation('telescope', { delta: sgn * 0.12, fromUserGesture: true });
            } else if (state.activeStation === 'spiral') {
              actOnStation('spiral', { turns: sgn * 0.25, fromUserGesture: true });
            } else {
              actOnStation(state.activeStation, { fromUserGesture: true });
            }
          }
        });

        if (typeof global.ResizeObserver === 'function') {
          try {
            resizeObs = new global.ResizeObserver(function (entries) {
              if (!entries || !entries[0] || !entries[0].contentRect) return;
              var cr = entries[0].contentRect;
              if (cr.width > 10 && cr.height > 10) {
                resize(cr.width, cr.height);
              }
            });
            resizeObs.observe(canvasEl);
          } catch (_) {}
        }
      }

      if (controlsRootEl) {
        buildControlsDom(controlsRootEl);
      }

      syncLoop();
      drawNow();
    }

    function destroy() {
      destroyed = true;
      if (rafId !== null && typeof global.cancelAnimationFrame === 'function') {
        global.cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (resizeObs && typeof resizeObs.disconnect === 'function') {
        try { resizeObs.disconnect(); } catch (_) {}
        resizeObs = null;
      }
      for (var i = 0; i < cleanups.length; i++) {
        try { cleanups[i](); } catch (_) {}
      }
      cleanups.length = 0;
      if (controlsRootEl) {
        controlsRootEl.innerHTML = '';
      }
      audio.destroy();
      canvasEl = null;
      ctx2d = null;
      controlsRootEl = null;
      domRefs = null;
    }

    return {
      mount: mount,
      setAgeState: setAgeState,
      selectStation: selectStation,
      actOnStation: actOnStation,
      setAudioMuted: setAudioMuted,
      setReducedMotion: setReducedMotion,
      resize: resize,
      getTelemetry: getTelemetry,
      destroy: destroy
    };
  }

  global.IsidoraSpiralDesires = {
    create: createIsidoraSpiralDesires,
    STATIONS: STATION_LIST.slice(),
    VIOLIN_COURSES: VIOLIN_COURSES
  };
})(typeof window !== 'undefined' ? window : globalThis);
