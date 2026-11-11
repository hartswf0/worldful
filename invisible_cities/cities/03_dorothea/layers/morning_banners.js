/*
 * Dorothea — Lived Morning Arrival in First Youth (morning_banners.js)
 * Self-contained browser IIFE: procedural Canvas 2D bazaar, 3 brass-trumpet soldiers,
 * turning wheels, fluttering colored banners, direct fearless gaze, and desert horizon paths.
 */
(function (global) {
  'use strict';

  var clamp01 = function (v) {
    var n = Number(v);
    if (isNaN(n)) return 0;
    return n < 0 ? 0 : (n > 1 ? 1 : n);
  };

  var lerp = function (a, b, t) {
    return a + (b - a) * t;
  };

  var BANNERS = [
    { id: 'saffron', name: 'Saffron', color: '#f2b129', shade: '#b97b0e', nx: 0.14, ny: 0.14, len: 0.16, h: 0.042, phase: 0.0 },
    { id: 'vermilion', name: 'Vermilion', color: '#df4826', shade: '#962710', nx: 0.31, ny: 0.12, len: 0.17, h: 0.045, phase: 1.3 },
    { id: 'ultramarine', name: 'Ultramarine', color: '#2452ad', shade: '#132d68', nx: 0.50, ny: 0.13, len: 0.18, h: 0.044, phase: 2.5 },
    { id: 'emerald', name: 'Emerald', color: '#1d8f66', shade: '#0e573d', nx: 0.68, ny: 0.12, len: 0.16, h: 0.043, phase: 3.8 },
    { id: 'carmine', name: 'Carmine', color: '#bc234d', shade: '#78102d', nx: 0.84, ny: 0.14, len: 0.14, h: 0.040, phase: 5.1 }
  ];

  var WOMEN = [
    { idx: 0, title: 'Saffron Weaver', nx: 0.40, ny: 0.72, robe: '#d9881e', shawl: '#f5c748', trim: '#fff1c9', pathKey: 'gaze-0' },
    { idx: 1, title: 'Indigo Fig-Bearer', nx: 0.53, ny: 0.74, robe: '#264b96', shawl: '#5c87d6', trim: '#e8f1ff', pathKey: 'gaze-1' },
    { idx: 2, title: 'Carmine Potter', nx: 0.66, ny: 0.73, robe: '#ad2449', shawl: '#e85a7c', trim: '#ffe6ec', pathKey: 'gaze-2' },
    { idx: 3, title: 'Emerald Spice-Seller', nx: 0.78, ny: 0.71, robe: '#197b58', shawl: '#44b88d', trim: '#e4fff4', pathKey: 'gaze-3' }
  ];

  var PATH_CATALOG = [
    { key: 'caravan-origin', source: 'origin', label: 'Known Caravan Track', color: '#e6b86a', endX: 0.50, arch: 0.00 },
    { key: 'trumpet-1', source: 'trumpet', label: 'Brass Fanfare Pass', color: '#ffd15c', endX: 0.24, arch: -0.10 },
    { key: 'gaze-0', source: 'gaze', label: 'Saffron Horizon Way', color: '#f6ba33', endX: 0.36, arch: -0.06 },
    { key: 'gaze-1', source: 'gaze', label: 'Ultramarine Wells Way', color: '#5890ff', endX: 0.63, arch: 0.07 },
    { key: 'gaze-2', source: 'gaze', label: 'Carmine Ridge Road', color: '#f25c84', endX: 0.76, arch: 0.11 },
    { key: 'gaze-3', source: 'gaze', label: 'Emerald Oasis Track', color: '#3cd49b', endX: 0.87, arch: 0.15 },
    { key: 'wheel-1', source: 'wheel', label: 'Turning Carts Road', color: '#f08a38', endX: 0.14, arch: -0.14 },
    { key: 'banner-1', source: 'banner', label: 'Wind-Banner Pass', color: '#ef5b3a', endX: 0.43, arch: -0.03 },
    { key: 'trumpet-2', source: 'trumpet', label: 'Third Trumpet Crest', color: '#ffe38a', endX: 0.57, arch: 0.03 },
    { key: 'wheel-2', source: 'wheel', label: 'Pulley & Spindle Trail', color: '#e5a94c', endX: 0.30, arch: -0.08 },
    { key: 'banner-2', source: 'banner', label: 'Five-Pennant Horizon', color: '#47b8e0', endX: 0.70, arch: 0.09 },
    { key: 'bazaar-1', source: 'bazaar', label: 'Morning Market Footpath', color: '#ffd9a0', endX: 0.93, arch: 0.18 }
  ];

  var SCOPED_CSS = [
    'bazaar-rupture.doro-morn-root {',
    '  display: block; position: relative; width: 100%; height: 100%; min-height: 440px;',
    '  overflow: hidden; background: #1d130a; color: #fdf3dc;',
    '  font-family: "Iowan Old Style", "Palatino Linotype", Georgia, serif;',
    '  user-select: none; -webkit-user-select: none; box-sizing: border-box;',
    '}',
    'bazaar-rupture.doro-morn-root *, bazaar-rupture.doro-morn-root *::before, bazaar-rupture.doro-morn-root *::after {',
    '  box-sizing: border-box;',
    '}',
    '.doro-morn-canvas {',
    '  display: block; width: 100%; height: 100%; cursor: pointer; touch-action: manipulation;',
    '}',
    'horizon-sheaf.doro-morn-hud-top {',
    '  position: absolute; top: 10px; left: 12px; right: 12px; z-index: 4;',
    '  display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap;',
    '  padding: 7px 12px; border-radius: 10px;',
    '  background: rgba(28, 18, 10, 0.76); border: 1px solid rgba(242, 186, 82, 0.38);',
    '  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);',
    '}',
    '.doro-morn-sheaf-badge {',
    '  display: inline-flex; align-items: center; gap: 7px; font-size: 13px; letter-spacing: 0.02em;',
    '  color: #ffe7b3; white-space: nowrap;',
    '}',
    '.doro-morn-sheaf-count {',
    '  display: inline-block; min-width: 24px; text-align: center; font-weight: 700;',
    '  padding: 2px 7px; border-radius: 999px; background: rgba(242, 177, 41, 0.25);',
    '  border: 1px solid #f2b129; color: #fff6da; font-variant-numeric: tabular-nums;',
    '}',
    '.doro-morn-phase-wrap {',
    '  display: flex; align-items: center; gap: 8px; flex: 1 1 260px; max-width: 520px;',
    '  font-size: 12px; color: #f4d89e;',
    '}',
    '.doro-morn-phase-caption { white-space: nowrap; opacity: 0.92; }',
    '.doro-morn-range {',
    '  flex: 1 1 90px; accent-color: #f2b129; cursor: pointer; height: 18px; margin: 0;',
    '}',
    '.doro-morn-dock-bottom {',
    '  position: absolute; bottom: 10px; left: 12px; right: 12px; z-index: 4;',
    '  display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap;',
    '  pointer-events: none;',
    '}',
    'trumpet-platform.doro-morn-ctrl, gaze-encounter.doro-morn-ctrl, banner-rigging.doro-morn-ctrl {',
    '  pointer-events: auto; display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap;',
    '  padding: 6px 10px; border-radius: 10px;',
    '  background: rgba(28, 18, 10, 0.78); border: 1px solid rgba(242, 186, 82, 0.34);',
    '  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); font-size: 12px;',
    '}',
    '.doro-morn-trigger {',
    '  appearance: none; background: rgba(242, 177, 41, 0.18); color: #fff3d1;',
    '  border: 1px solid rgba(242, 186, 82, 0.55); border-radius: 7px;',
    '  padding: 4px 9px; font: inherit; font-size: 12px; cursor: pointer;',
    '  transition: background 0.16s ease, transform 0.12s ease, border-color 0.16s ease;',
    '}',
    '.doro-morn-trigger:hover { background: rgba(242, 177, 41, 0.34); border-color: #ffd573; }',
    '.doro-morn-trigger:active { transform: translateY(1px); }',
    '.doro-morn-trigger:focus-visible, .doro-morn-range:focus-visible {',
    '  outline: 2px solid #ffe08a; outline-offset: 2px;',
    '}',
    '.doro-morn-trigger[aria-pressed="true"], .doro-morn-trigger.doro-morn-met {',
    '  background: rgba(242, 177, 41, 0.42); border-color: #ffe699; color: #ffffff;',
    '}',
    '.doro-morn-whisper {',
    '  position: absolute; left: 50%; transform: translateX(-50%); top: 58px; z-index: 3;',
    '  padding: 4px 12px; border-radius: 999px; font-size: 12px; letter-spacing: 0.02em;',
    '  background: rgba(24, 15, 8, 0.66); border: 1px solid rgba(255, 214, 128, 0.28);',
    '  color: #ffdf9e; pointer-events: none; white-space: nowrap; max-width: 92%;',
    '  overflow: hidden; text-overflow: ellipsis;',
    '}',
    '@media (max-width: 640px) {',
    '  horizon-sheaf.doro-morn-hud-top { padding: 6px 8px; gap: 6px; top: 6px; left: 6px; right: 6px; }',
    '  .doro-morn-phase-caption.doro-morn-hide-sm { display: none; }',
    '  .doro-morn-whisper { top: 76px; font-size: 11px; }',
    '  .doro-morn-dock-bottom { bottom: 6px; left: 6px; right: 6px; gap: 5px; }',
    '  trumpet-platform.doro-morn-ctrl, gaze-encounter.doro-morn-ctrl, banner-rigging.doro-morn-ctrl {',
    '    padding: 5px 7px; font-size: 11px; gap: 4px;',
    '  }',
    '  .doro-morn-trigger { padding: 3px 7px; font-size: 11px; }',
    '}'
  ].join('\n');

  function createBrassEngine(initialMuted) {
    var ctx = null;
    var master = null;
    var muted = !!initialMuted;

    function ensureCtx() {
      if (muted) return null;
      var AudioCtor = global.AudioContext || global.webkitAudioContext;
      if (!AudioCtor) return null;
      try {
        if (!ctx) {
          ctx = new AudioCtor();
          master = ctx.createGain();
          master.gain.value = muted ? 0 : 0.72;
          master.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') {
          ctx.resume().catch(function () {});
        }
      } catch (e) {
        return null;
      }
      return ctx;
    }

    function playVoice(ac, freq, offsetSec, durSec, panVal, amp) {
      var now = ac.currentTime + offsetSec;
      var stopAt = now + durSec + 0.08;
      var oscSaw = ac.createOscillator();
      var oscTri = ac.createOscillator();
      var lfo = ac.createOscillator();
      var lfoGain = ac.createGain();
      var filter = ac.createBiquadFilter();
      var env = ac.createGain();

      oscSaw.type = 'sawtooth';
      oscTri.type = 'triangle';
      oscSaw.frequency.setValueAtTime(freq, now);
      oscTri.frequency.setValueAtTime(freq, now);
      oscSaw.detune.setValueAtTime(-4.5, now);
      oscTri.detune.setValueAtTime(4.5, now);

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(5.6, now);
      lfoGain.gain.setValueAtTime(0.0, now);
      lfoGain.gain.linearRampToValueAtTime(freq * 0.006, now + 0.14);
      lfo.connect(lfoGain);
      lfoGain.connect(oscSaw.frequency);
      lfoGain.connect(oscTri.frequency);

      filter.type = 'lowpass';
      filter.Q.setValueAtTime(2.7, now);
      filter.frequency.setValueAtTime(Math.max(260, freq * 1.15), now);
      filter.frequency.exponentialRampToValueAtTime(Math.min(3800, freq * 5.9), now + 0.032);
      filter.frequency.exponentialRampToValueAtTime(Math.min(2400, freq * 3.3), now + 0.12);
      filter.frequency.exponentialRampToValueAtTime(Math.max(320, freq * 1.4), stopAt);

      env.gain.setValueAtTime(0.0001, now);
      env.gain.linearRampToValueAtTime(amp, now + 0.012);
      env.gain.linearRampToValueAtTime(amp * 0.78, now + 0.055);
      env.gain.setValueAtTime(amp * 0.74, now + Math.max(0.06, durSec - 0.06));
      env.gain.exponentialRampToValueAtTime(0.0001, stopAt);

      oscSaw.connect(filter);
      oscTri.connect(filter);
      filter.connect(env);

      if (ac.createStereoPanner) {
        var panner = ac.createStereoPanner();
        panner.pan.setValueAtTime(panVal, now);
        env.connect(panner);
        panner.connect(master);
      } else {
        env.connect(master);
      }

      oscSaw.start(now);
      oscTri.start(now);
      lfo.start(now);
      oscSaw.stop(stopAt + 0.02);
      oscTri.stop(stopAt + 0.02);
      lfo.stop(stopAt + 0.02);
    }

    return {
      soundFanfare: function (callCount) {
        if (muted) return false;
        var ac = ensureCtx();
        if (!ac || !master) return false;
        var lift = (callCount % 2 === 1) ? 1.12246 : 1.0;
        var steps = [
          { t: 0.00, d: 0.13, f: [293.66, 220.00, 369.99] },
          { t: 0.15, d: 0.13, f: [369.99, 293.66, 440.00] },
          { t: 0.30, d: 0.15, f: [440.00, 329.63, 587.33] },
          { t: 0.47, d: 0.64, f: [587.33, 440.00, 739.99] }
        ];
        var pans = [-0.38, 0.0, 0.38];
        for (var s = 0; s < steps.length; s++) {
          var st = steps[s];
          for (var v = 0; v < 3; v++) {
            playVoice(ac, st.f[v] * lift, st.t + v * 0.006, st.d, pans[v], 0.15);
          }
        }
        return true;
      },
      soundGaze: function (idx) {
        if (muted) return;
        var ac = ensureCtx();
        if (!ac || !master) return;
        var roots = [440.0, 493.88, 554.37, 587.33];
        var base = roots[idx % roots.length];
        playVoice(ac, base, 0.0, 0.28, -0.15, 0.065);
        playVoice(ac, base * 1.5, 0.04, 0.34, 0.15, 0.055);
      },
      soundWheel: function () {
        if (muted) return;
        var ac = ensureCtx();
        if (!ac || !master) return;
        playVoice(ac, 196.0, 0.0, 0.11, -0.2, 0.05);
        playVoice(ac, 293.66, 0.05, 0.14, 0.2, 0.05);
      },
      setMuted: function (flag) {
        muted = !!flag;
        if (master && ctx) {
          try {
            master.gain.setTargetAtTime(muted ? 0 : 0.72, ctx.currentTime, 0.02);
          } catch (e) {
            master.gain.value = muted ? 0 : 0.72;
          }
        }
      },
      isMuted: function () {
        return muted;
      },
      destroy: function () {
        if (ctx) {
          try { ctx.close(); } catch (e) {}
          ctx = null;
          master = null;
        }
      }
    };
  }

  function createWheels() {
    return [
      { id: 0, nx: 0.12, ny: 0.39, r: 0.035, spokes: 8, kind: 'pulley', angle: 0.2, base: 0.95, boost: 0 },
      { id: 1, nx: 0.33, ny: 0.49, r: 0.031, spokes: 6, kind: 'hoist', angle: 1.1, base: -1.15, boost: 0 },
      { id: 2, nx: 0.54, ny: 0.48, r: 0.036, spokes: 10, kind: 'mill', angle: 2.0, base: 0.85, boost: 0 },
      { id: 3, nx: 0.83, ny: 0.38, r: 0.034, spokes: 8, kind: 'pulley', angle: 0.7, base: -0.90, boost: 0 },
      { id: 4, nx: 0.14, ny: 0.74, r: 0.050, spokes: 12, kind: 'cart', angle: 0.4, base: 0.70, boost: 0 },
      { id: 5, nx: 0.89, ny: 0.73, r: 0.048, spokes: 10, kind: 'cart', angle: 1.8, base: -0.76, boost: 0 }
    ];
  }

  function createCrowd() {
    var robes = ['#7b4425', '#9e5c2b', '#4d3629', '#b56e33', '#2e4a62', '#8c372e', '#6d5532'];
    var goods = ['basket', 'amphora', 'bundle', 'tray'];
    var list = [];
    for (var i = 0; i < 22; i++) {
      var lane = i < 12 ? 0 : 1;
      var dir = (i % 5 === 0) ? -1 : 1;
      list.push({
        nx: (i * 0.047 + (lane * 0.03)) % 1.0,
        ny: lane === 0 ? (0.565 + (i % 4) * 0.011) : (0.625 + (i % 4) * 0.012),
        scale: lane === 0 ? 0.76 : 0.96,
        speed: (0.032 + (i % 5) * 0.007) * dir,
        dir: dir,
        phase: i * 0.85,
        robe: robes[i % robes.length],
        good: goods[i % goods.length]
      });
    }
    return list;
  }

  function createWomenState() {
    return WOMEN.map(function (w) {
      return { def: w, met: false, turn01: 0, hover: false, glow: 0 };
    });
  }

  function bezierPt(x0, y0, cx, cy, x1, y1, t) {
    var inv = 1 - t;
    return {
      x: inv * inv * x0 + 2 * inv * t * cx + t * t * x1,
      y: inv * inv * y0 + 2 * inv * t * cy + t * t * y1
    };
  }

  function renderMorningScene(ctx, st) {
    var W = st.width;
    var H = st.height;
    if (W <= 0 || H <= 0) return;

    var lp = st.lifePhase;
    var horizonY = H * lerp(0.29, 0.25, lp);
    var desertEndY = H * lerp(0.47, 0.69, lp);
    var bazaarAlpha = lerp(1.0, 0.34, lp);
    var minDim = Math.min(W, H);

    var skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, lp < 0.5 ? '#263a69' : '#1b2847');
    skyGrad.addColorStop(0.55, lp < 0.5 ? '#c96f32' : '#ad5c27');
    skyGrad.addColorStop(1, '#ffdf8e');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, horizonY + 2);

    var sunX = W * 0.50;
    var sunY = horizonY - H * 0.025;
    var sunGlow = ctx.createRadialGradient(sunX, sunY, minDim * 0.015, sunX, sunY, minDim * 0.34);
    sunGlow.addColorStop(0, 'rgba(255, 250, 222, 0.96)');
    sunGlow.addColorStop(0.25, 'rgba(255, 214, 118, 0.52)');
    sunGlow.addColorStop(1, 'rgba(255, 168, 64, 0)');
    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, W, H * 0.65);

    var desertGrad = ctx.createLinearGradient(0, horizonY, 0, H);
    desertGrad.addColorStop(0, '#f3be6b');
    desertGrad.addColorStop(0.45, '#cc8438');
    desertGrad.addColorStop(1, '#593418');
    ctx.fillStyle = desertGrad;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    for (var d = 0; d < 3; d++) {
      ctx.beginPath();
      var baseDuneY = lerp(horizonY + H * 0.03, desertEndY, (d + 1) / 3.2);
      ctx.moveTo(0, H);
      ctx.lineTo(0, baseDuneY);
      for (var dx = 0; dx <= W; dx += Math.max(16, W / 28)) {
        var wave = Math.sin(dx * 0.007 + d * 2.1) * H * 0.016 + Math.cos(dx * 0.015 - d) * H * 0.008;
        ctx.lineTo(dx, baseDuneY + wave);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = d === 0 ? '#dead59' : (d === 1 ? '#c58237' : '#a46425');
      ctx.fill();
    }

    var originX = W * 0.50;
    var originY = desertEndY + H * 0.02;
    for (var pIdx = 0; pIdx < PATH_CATALOG.length; pIdx++) {
      var pDef = PATH_CATALOG[pIdx];
      if (!st.unlockedMap[pDef.key]) continue;
      var tx = W * pDef.endX;
      var ty = horizonY + 2;
      var ctrlX = lerp(originX, tx, 0.52) + W * pDef.arch;
      var ctrlY = lerp(originY, ty, 0.46);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.quadraticCurveTo(ctrlX, ctrlY, tx, ty);
      ctx.strokeStyle = pDef.color;
      ctx.globalAlpha = lerp(0.32, 0.55, lp);
      ctx.lineWidth = Math.max(4, minDim * 0.009);
      ctx.stroke();

      ctx.globalAlpha = lerp(0.82, 0.98, lp);
      ctx.lineWidth = Math.max(1.6, minDim * 0.0034);
      ctx.stroke();

      var sparkT = (st.time * 0.22 + pIdx * 0.17) % 1.0;
      var sp = bezierPt(originX, originY, ctrlX, ctrlY, tx, ty, sparkT);
      ctx.fillStyle = '#fff9e2';
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, Math.max(2.2, minDim * 0.004), 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(tx, ty, Math.max(2.8, minDim * 0.005), 0, Math.PI * 2);
      ctx.fillStyle = pDef.color;
      ctx.fill();
      ctx.restore();
    }

    var cRoute = PATH_CATALOG[0];
    for (var cm = 0; cm < 3; cm++) {
      var ct = (0.28 + cm * 0.11 + (st.time * 0.018)) % 0.86;
      var cp = bezierPt(originX, originY, W * 0.50, lerp(originY, horizonY, 0.46), W * cRoute.endX, horizonY + 2, ct);
      var cSize = lerp(7, 2.5, ct) * (minDim / 600);
      ctx.save();
      ctx.globalAlpha = lerp(0.45, 0.92, lp);
      ctx.fillStyle = '#3a1f0d';
      ctx.beginPath();
      ctx.ellipse(cp.x, cp.y - cSize, cSize * 1.3, cSize * 0.75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(cp.x - cSize * 0.9, cp.y - cSize * 0.5, cSize * 0.28, cSize * 1.2);
      ctx.fillRect(cp.x + cSize * 0.5, cp.y - cSize * 0.5, cSize * 0.28, cSize * 1.2);
      ctx.beginPath();
      ctx.arc(cp.x + cSize * 1.35, cp.y - cSize * 1.55, cSize * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = bazaarAlpha;
    var streetGrad = ctx.createLinearGradient(0, desertEndY - H * 0.03, 0, H);
    streetGrad.addColorStop(0, 'rgba(138, 79, 34, 0.92)');
    streetGrad.addColorStop(0.4, 'rgba(96, 54, 24, 0.97)');
    streetGrad.addColorStop(1, 'rgba(42, 24, 12, 0.99)');
    ctx.fillStyle = streetGrad;
    ctx.fillRect(0, desertEndY - H * 0.01, W, H - desertEndY + H * 0.02);

    ctx.fillStyle = '#6d3c1c';
    for (var a = 0; a < 6; a++) {
      var ax = (a / 6) * W;
      var aw = W / 6;
      var archTop = desertEndY - H * 0.055;
      ctx.beginPath();
      ctx.moveTo(ax, archTop);
      ctx.lineTo(ax + aw, archTop);
      ctx.lineTo(ax + aw, desertEndY + H * 0.05);
      ctx.lineTo(ax + aw * 0.86, desertEndY + H * 0.05);
      ctx.arc(ax + aw * 0.5, desertEndY + H * 0.02, aw * 0.34, 0, Math.PI, true);
      ctx.lineTo(ax, desertEndY + H * 0.05);
      ctx.closePath();
      ctx.fill();
    }

    var platX = W * 0.22;
    var platY = H * 0.565;
    var platW = Math.max(96, W * 0.15);
    var platH = H * 0.085;
    ctx.fillStyle = '#523018';
    ctx.fillRect(platX - platW * 0.5, platY, platW, platH);
    ctx.strokeStyle = '#d39544';
    ctx.lineWidth = 2;
    ctx.strokeRect(platX - platW * 0.5, platY, platW, platH);
    ctx.beginPath();
    ctx.moveTo(platX - platW * 0.46, platY);
    ctx.lineTo(platX + platW * 0.46, platY + platH);
    ctx.moveTo(platX + platW * 0.46, platY);
    ctx.lineTo(platX - platW * 0.46, platY + platH);
    ctx.stroke();

    var flare = st.trumpetTimer > 0 ? Math.min(1, st.trumpetTimer * 1.4) : 0;
    for (var s = 0; s < 3; s++) {
      var sx = platX + (s - 1) * (platW * 0.29);
      var sy = platY;
      var sh = Math.max(30, H * 0.068);
      ctx.fillStyle = '#9e2b25';
      ctx.fillRect(sx - sh * 0.16, sy - sh * 0.72, sh * 0.32, sh * 0.72);
      ctx.fillStyle = '#e8b349';
      ctx.fillRect(sx - sh * 0.18, sy - sh * 0.70, sh * 0.36, sh * 0.36);
      ctx.beginPath();
      ctx.arc(sx, sy - sh * 0.84, sh * 0.15, 0, Math.PI * 2);
      ctx.fillStyle = '#ffd269';
      ctx.fill();
      ctx.fillStyle = '#df4826';
      ctx.beginPath();
      ctx.arc(sx - sh * 0.04, sy - sh * 0.96, sh * 0.09, Math.PI, 0);
      ctx.fill();

      var tAngle = -0.28 - flare * 0.32 - (s === 1 ? 0.08 : 0);
      var tLen = sh * 0.76;
      var bx = sx + Math.cos(tAngle) * tLen;
      var by = (sy - sh * 0.78) + Math.sin(tAngle) * tLen;
      ctx.strokeStyle = flare > 0 ? '#fff0a6' : '#f2bd49';
      ctx.lineWidth = Math.max(2.2, sh * 0.07);
      ctx.beginPath();
      ctx.moveTo(sx + sh * 0.06, sy - sh * 0.78);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bx, by, sh * (0.10 + flare * 0.05), 0, Math.PI * 2);
      ctx.fillStyle = flare > 0 ? '#fff7cc' : '#f5c451';
      ctx.fill();
    }

    for (var ci = 0; ci < st.crowd.length; ci++) {
      var p = st.crowd[ci];
      var px = p.nx * W;
      var py = p.ny * H;
      var ph = Math.max(22, H * 0.056) * p.scale;
      var stride = Math.sin(p.phase) * ph * 0.16;
      ctx.fillStyle = p.robe;
      ctx.beginPath();
      ctx.moveTo(px - ph * 0.16, py);
      ctx.lineTo(px - ph * 0.09, py - ph * 0.72);
      ctx.lineTo(px + ph * 0.09, py - ph * 0.72);
      ctx.lineTo(px + ph * 0.18 + stride * 0.3, py);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py - ph * 0.83, ph * 0.11, 0, Math.PI * 2);
      ctx.fillStyle = '#d89b6c';
      ctx.fill();
      ctx.fillStyle = '#e7b45a';
      if (p.good === 'basket') {
        ctx.fillRect(px - ph * 0.16, py - ph * 1.05, ph * 0.32, ph * 0.11);
      } else if (p.good === 'amphora') {
        ctx.beginPath();
        ctx.ellipse(px + p.dir * ph * 0.16, py - ph * 0.56, ph * 0.08, ph * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(px + p.dir * ph * 0.15, py - ph * 0.62, ph * 0.11, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    renderForegroundDetails(ctx, st, W, H, minDim, bazaarAlpha);
  }

  function renderForegroundDetails(ctx, st, W, H, minDim, bazaarAlpha) {
    var bannerAlpha = lerp(1.0, 0.58, st.lifePhase);
    ctx.save();
    ctx.globalAlpha = bannerAlpha;
    ctx.strokeStyle = 'rgba(72, 42, 18, 0.72)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(W * 0.06, H * 0.13);
    ctx.quadraticCurveTo(W * 0.50, H * 0.16, W * 0.94, H * 0.13);
    ctx.stroke();

    var gust = 0.22 + st.windGust * 0.95;
    for (var bi = 0; bi < BANNERS.length; bi++) {
      var b = BANNERS[bi];
      var mx = b.nx * W;
      var my = b.ny * H;
      var bLen = W * b.len * (0.82 + st.windGust * 0.28);
      var bH = Math.max(18, H * b.h);

      ctx.strokeStyle = '#5c3518';
      ctx.lineWidth = Math.max(3, minDim * 0.005);
      ctx.beginPath();
      ctx.moveTo(mx, my - bH * 0.45);
      ctx.lineTo(mx, H * 0.48);
      ctx.stroke();

      var segs = 12;
      ctx.beginPath();
      for (var k = 0; k <= segs; k++) {
        var u = k / segs;
        var wy = Math.sin(st.time * (3.2 + st.windGust * 5.4) - u * 5.2 + b.phase) * (bH * 0.34 * gust * u)
               + Math.sin(st.time * 7.3 - u * 8.5 + b.phase) * (bH * 0.11 * gust * u);
        var px = mx + u * bLen;
        var py = my + wy + u * u * bH * (0.28 - st.windGust * 0.18);
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      var tipWave = Math.sin(st.time * (3.2 + st.windGust * 5.4) - 4.4 + b.phase) * (bH * 0.30 * gust);
      ctx.lineTo(mx + bLen * 0.84, my + bH * 0.48 + tipWave);
      for (var k2 = segs; k2 >= 0; k2--) {
        var u2 = k2 / segs;
        var wy2 = Math.sin(st.time * (3.2 + st.windGust * 5.4) - u2 * 5.2 + b.phase + 0.25) * (bH * 0.34 * gust * u2);
        var px2 = mx + u2 * bLen;
        var py2 = my + bH * (1 - u2 * 0.22) + wy2 + u2 * u2 * bH * (0.28 - st.windGust * 0.18);
        ctx.lineTo(px2, py2);
      }
      ctx.closePath();
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.strokeStyle = b.shade;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = bazaarAlpha;
    for (var wi = 0; wi < st.wheels.length; wi++) {
      var w = st.wheels[wi];
      var wx = w.nx * W;
      var wy = w.ny * H;
      var wr = Math.max(15, minDim * w.r);

      if (w.kind === 'pulley') {
        ctx.strokeStyle = '#c89652';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(wx, H * 0.14);
        ctx.lineTo(wx, wy);
        ctx.moveTo(wx - wr, wy);
        ctx.lineTo(wx - wr, wy + wr * 2.4);
        ctx.stroke();
      }

      ctx.save();
      ctx.translate(wx, wy);
      ctx.rotate(w.angle);
      ctx.strokeStyle = '#e0a44c';
      ctx.lineWidth = Math.max(3, wr * 0.16);
      ctx.beginPath();
      ctx.arc(0, 0, wr, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = Math.max(1.5, wr * 0.08);
      ctx.strokeStyle = '#f8cf7a';
      for (var sp = 0; sp < w.spokes; sp++) {
        var ang = (sp / w.spokes) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(ang) * wr, Math.sin(ang) * wr);
        ctx.stroke();
      }
      ctx.fillStyle = '#5c3314';
      ctx.beginPath();
      ctx.arc(0, 0, wr * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (Math.abs(w.boost) > 0.35) {
        ctx.strokeStyle = 'rgba(255, 232, 156, 0.55)';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(wx, wy, wr * 1.22, st.time * 4, st.time * 4 + 1.9);
        ctx.stroke();
      }
    }

    for (var gi = 0; gi < st.women.length; gi++) {
      var wm = st.women[gi];
      var gx = wm.def.nx * W;
      var gy = wm.def.ny * H;
      var gh = Math.max(58, H * 0.14);
      var hr = gh * 0.155;

      if (wm.turn01 > 0.05) {
        var aura = ctx.createRadialGradient(gx, gy - gh * 0.76, hr * 0.3, gx, gy - gh * 0.76, hr * 3.1);
        aura.addColorStop(0, 'rgba(255, 238, 178, ' + (0.52 * wm.turn01).toFixed(3) + ')');
        aura.addColorStop(1, 'rgba(255, 210, 110, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(gx, gy - gh * 0.76, hr * 3.1, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = wm.def.robe;
      ctx.beginPath();
      ctx.moveTo(gx - gh * 0.24, gy + gh * 0.18);
      ctx.lineTo(gx - gh * 0.14, gy - gh * 0.58);
      ctx.lineTo(gx + gh * 0.14, gy - gh * 0.58);
      ctx.lineTo(gx + gh * 0.24, gy + gh * 0.18);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = wm.def.shawl;
      ctx.beginPath();
      ctx.arc(gx, gy - gh * 0.76, hr * 1.28, Math.PI * 0.82, Math.PI * 2.18);
      ctx.lineTo(gx + gh * 0.19, gy - gh * 0.30);
      ctx.lineTo(gx - gh * 0.19, gy - gh * 0.30);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#241410';
      ctx.beginPath();
      ctx.arc(gx, gy - gh * 0.77, hr * 1.06, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e0a273';
      ctx.beginPath();
      ctx.arc(gx, gy - gh * 0.75, hr * 0.92, 0, Math.PI * 2);
      ctx.fill();

      if (wm.turn01 > 0.32) {
        var eyeY = gy - gh * 0.775;
        var eyeDX = hr * 0.36 * wm.turn01;
        for (var side = -1; side <= 1; side += 2) {
          var ex = gx + side * eyeDX;
          ctx.fillStyle = '#fffdf8';
          ctx.beginPath();
          ctx.ellipse(ex, eyeY, hr * 0.22, hr * 0.13, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#1b100c';
          ctx.beginPath();
          ctx.arc(ex, eyeY, hr * 0.10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(ex - hr * 0.03, eyeY - hr * 0.03, hr * 0.04, 0, Math.PI * 2);
          ctx.fill();
        }
        var smY = gy - gh * 0.705;
        var smW = hr * 0.48 * wm.turn01;
        var smH = hr * 0.22 * wm.turn01;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(gx, smY, smW, 0.06 * Math.PI, 0.94 * Math.PI, false);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#9c2838';
        ctx.lineWidth = Math.max(1, hr * 0.08);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(160, 125, 100, 0.55)';
        ctx.lineWidth = 0.8;
        for (var ti = -2; ti <= 2; ti++) {
          var txLine = gx + (ti / 3) * smW * 0.82;
          ctx.beginPath();
          ctx.moveTo(txLine, smY + 0.5);
          ctx.lineTo(txLine, smY + smH * 0.78);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = '#1b100c';
        ctx.beginPath();
        ctx.arc(gx - hr * 0.34, gy - gh * 0.77, hr * 0.09, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    for (var ri = 0; ri < st.rings.length; ri++) {
      var rg = st.rings[ri];
      ctx.save();
      ctx.strokeStyle = rg.color;
      ctx.globalAlpha = Math.max(0, 1 - rg.prog) * 0.78;
      ctx.lineWidth = rg.kind === 'trumpet' ? 2.6 : 2.0;
      ctx.beginPath();
      ctx.arc(rg.nx * W, rg.ny * H, rg.prog * minDim * rg.maxR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  var activeInst = null;

  function createController() {
    var st = {
      mounted: false, hostEl: null, root: null, canvas: null, ctx: null,
      ui: {}, opts: {}, brass: null, rafId: 0, lastTs: 0, time: 1.2,
      width: 800, height: 600, dpr: 1,
      lifePhase: 0, windGust: 0.42, hurryPromenade: 0.25, promenadeDist: 0,
      muted: false, reducedMotion: false,
      trumpetTimer: 0, trumpetFanfareCount: 0, wheelSpinsCount: 0,
      gazeActiveIndex: -1, nextGazeCycle: 0, draggingWheel: -1, lastPtrX: 0,
      wheels: createWheels(), crowd: createCrowd(), women: createWomenState(),
      rings: [], unlockedMap: { 'caravan-origin': true }, unlockedKeys: ['caravan-origin'],
      ro: null, mq: null, mqHandler: null, keyHandler: null, winResize: null
    };

    function safeCall(fn, arg) {
      if (typeof fn === 'function') { try { fn(arg); } catch (e) {} }
    }

    function snapshot() {
      var metCount = 0;
      for (var i = 0; i < st.women.length; i++) if (st.women[i].met) metCount++;
      var avgOmega = 0;
      for (var w = 0; w < st.wheels.length; w++) avgOmega += Math.abs(st.wheels[w].base + st.wheels[w].boost);
      return {
        mounted: st.mounted,
        lifePhase: Number(st.lifePhase.toFixed(3)),
        windGust: Number(st.windGust.toFixed(3)),
        wheelOmega: Number((avgOmega / st.wheels.length).toFixed(3)),
        openPathsCount: st.unlockedKeys.length,
        maxPathsCount: PATH_CATALOG.length,
        gazeMetCount: metCount,
        gazeActiveIndex: st.gazeActiveIndex,
        trumpetFanfareCount: st.trumpetFanfareCount,
        trumpetActive: st.trumpetTimer > 0,
        wheelSpinsCount: st.wheelSpinsCount,
        hurryPromenade: Number(st.hurryPromenade.toFixed(3)),
        muted: st.muted,
        reducedMotion: st.reducedMotion,
        width: st.width,
        height: st.height,
        unlockedSources: st.unlockedKeys.slice()
      };
    }

    function updateWhisper(msg) {
      if (!st.ui.count) return;
      st.ui.count.textContent = String(st.unlockedKeys.length);
      if (msg && st.ui.whisper) {
        st.ui.whisper.textContent = msg;
      } else if (st.ui.whisper) {
        st.ui.whisper.textContent = st.lifePhase > 0.55
          ? ('In the years that followed: ' + st.unlockedKeys.length + ' open paths shine across the desert from that morning.')
          : ('First youth in Dorothea: ' + st.unlockedKeys.length + ' of ' + PATH_CATALOG.length + ' horizon paths awakened.');
      }
    }

    function unlockByKeyOrSource(prefKey, prefSource) {
      var chosen = null;
      var idx = -1;
      for (var i = 0; i < PATH_CATALOG.length; i++) {
        if (PATH_CATALOG[i].key === prefKey && !st.unlockedMap[prefKey]) { chosen = PATH_CATALOG[i]; idx = i; break; }
      }
      if (!chosen && prefSource) {
        for (var j = 0; j < PATH_CATALOG.length; j++) {
          if (PATH_CATALOG[j].source === prefSource && !st.unlockedMap[PATH_CATALOG[j].key]) { chosen = PATH_CATALOG[j]; idx = j; break; }
        }
      }
      if (!chosen) return null;
      st.unlockedMap[chosen.key] = true;
      st.unlockedKeys.push(chosen.key);
      updateWhisper('Path opened: ' + chosen.label + ' (' + st.unlockedKeys.length + ' open paths)');
      safeCall(st.opts.onPathOpened, {
        index: idx, openPathsCount: st.unlockedKeys.length, source: chosen.source,
        key: chosen.key, label: chosen.label, color: chosen.color, lifePhase: st.lifePhase
      });
      return chosen;
    }

    function drawNow() {
      if (st.mounted && st.ctx) renderMorningScene(st.ctx, st);
    }

    function notify() {
      safeCall(st.opts.onStateChange, snapshot());
    }

    function addRing(nx, ny, maxR, color, kind) {
      if (st.reducedMotion && st.rings.length > 2) st.rings.shift();
      st.rings.push({ nx: nx, ny: ny, maxR: maxR, color: color, kind: kind, prog: st.reducedMotion ? 0.45 : 0.02 });
    }

    function stepSim(dt) {
      var motionScale = st.reducedMotion ? 0.0 : 1.0;
      st.time += dt * (0.45 + st.windGust * 0.85) * motionScale;
      if (st.trumpetTimer > 0) st.trumpetTimer = Math.max(0, st.trumpetTimer - dt);
      st.hurryPromenade = Math.max(0.22, st.hurryPromenade - dt * 0.18);

      for (var w = 0; w < st.wheels.length; w++) {
        var wh = st.wheels[w];
        wh.angle += (wh.base * (0.6 + st.windGust) + wh.boost) * dt * motionScale;
        wh.boost *= Math.pow(0.42, dt);
      }
      for (var c = 0; c < st.crowd.length; c++) {
        var p = st.crowd[c];
        var spd = p.speed * (0.75 + st.hurryPromenade * 1.15) * motionScale;
        p.nx = (p.nx + spd * dt + 1.0) % 1.0;
        p.phase += Math.abs(spd) * dt * 42;
      }
      for (var g = 0; g < st.women.length; g++) {
        var wm = st.women[g];
        var target = (wm.met || wm.hover) ? 1.0 : 0.0;
        wm.turn01 = st.reducedMotion ? target : lerp(wm.turn01, target, Math.min(1, dt * 7.5));
      }
      for (var r = st.rings.length - 1; r >= 0; r--) {
        st.rings[r].prog += dt * (st.reducedMotion ? 1.8 : 0.72);
        if (st.rings[r].prog >= 1) st.rings.splice(r, 1);
      }
    }

    function tick(ts) {
      if (!st.mounted) return;
      var dt = st.lastTs ? Math.min(0.05, (ts - st.lastTs) / 1000) : 0.016;
      st.lastTs = ts;
      stepSim(dt);
      drawNow();
      st.rafId = global.requestAnimationFrame(tick);
    }

    return {
      st: st, snapshot: snapshot, updateWhisper: updateWhisper,
      unlock: unlockByKeyOrSource, drawNow: drawNow, notify: notify,
      addRing: addRing, tick: tick
    };
  }

  function el(doc, tag, cls, text) {
    var node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  var api = {
    mount: function (containerEl, options) {
      if (!containerEl || !containerEl.ownerDocument) return api;
      if (activeInst && activeInst.st.mounted) api.destroy();

      var doc = containerEl.ownerDocument;
      var inst = createController();
      activeInst = inst;
      var st = inst.st;
      st.hostEl = containerEl;
      st.opts = options || {};
      st.muted = !!st.opts.muted;
      var sysRM = !!(global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches);
      st.reducedMotion = typeof st.opts.reducedMotion === 'boolean' ? st.opts.reducedMotion : sysRM;
      st.windGust = typeof st.opts.windGust === 'number' ? clamp01(st.opts.windGust) : 0.42;
      st.lifePhase = typeof st.opts.lifePhase === 'number' ? clamp01(st.opts.lifePhase) : 0.0;
      st.brass = createBrassEngine(st.muted);

      var root = el(doc, 'bazaar-rupture', 'doro-morn-root');
      root.tabIndex = 0;
      root.setAttribute('role', 'region');
      root.setAttribute('aria-label', 'Morning arrival in Dorothea');
      var styleEl = el(doc, 'style', 'doro-morn-style', SCOPED_CSS);
      var canvas = el(doc, 'canvas', 'doro-morn-canvas');
      var hudTop = el(doc, 'horizon-sheaf', 'doro-morn-hud-top');
      var badge = el(doc, 'span', 'doro-morn-sheaf-badge', 'Open Paths ');
      var countEl = el(doc, 'span', 'doro-morn-sheaf-count', '1');
      badge.appendChild(countEl);

      var phaseWrap = el(doc, 'label', 'doro-morn-phase-wrap');
      phaseWrap.appendChild(el(doc, 'span', 'doro-morn-phase-caption', 'That Morning'));
      var phaseInput = el(doc, 'input', 'doro-morn-range');
      phaseInput.type = 'range'; phaseInput.min = '0'; phaseInput.max = '100';
      phaseInput.value = String(Math.round(st.lifePhase * 100));
      phaseInput.setAttribute('aria-label', 'Scrub between that morning in first youth and the years that followed in the desert');
      phaseWrap.appendChild(phaseInput);
      phaseWrap.appendChild(el(doc, 'span', 'doro-morn-phase-caption doro-morn-hide-sm', 'Years in the Desert'));

      var muteBtn = el(doc, 'button', 'doro-morn-trigger', st.muted ? 'Muted' : 'Brass On');
      muteBtn.type = 'button';
      muteBtn.setAttribute('aria-pressed', st.muted ? 'true' : 'false');
      hudTop.appendChild(badge); hudTop.appendChild(phaseWrap); hudTop.appendChild(muteBtn);

      var whisper = el(doc, 'div', 'doro-morn-whisper');
      whisper.setAttribute('aria-live', 'polite');

      var dock = el(doc, 'div', 'doro-morn-dock-bottom');
      var tPlat = el(doc, 'trumpet-platform', 'doro-morn-ctrl');
      var tBtn = el(doc, 'button', 'doro-morn-trigger', '3 Trumpets [T]');
      tBtn.type = 'button'; tPlat.appendChild(tBtn);

      var gEnc = el(doc, 'gaze-encounter', 'doro-morn-ctrl');
      var gBtn = el(doc, 'button', 'doro-morn-trigger', 'Meet Her Gaze [G]');
      gBtn.type = 'button';
      var wBtn = el(doc, 'button', 'doro-morn-trigger', 'Turn Wheels [W]');
      wBtn.type = 'button';
      gEnc.appendChild(gBtn); gEnc.appendChild(wBtn);

      var bRig = el(doc, 'banner-rigging', 'doro-morn-ctrl');
      bRig.appendChild(el(doc, 'span', 'doro-morn-phase-caption', 'Banners'));
      var windInput = el(doc, 'input', 'doro-morn-range');
      windInput.type = 'range'; windInput.min = '0'; windInput.max = '100';
      windInput.value = String(Math.round(st.windGust * 100));
      windInput.setAttribute('aria-label', 'Wind gust across colored banners');
      bRig.appendChild(windInput);

      dock.appendChild(tPlat); dock.appendChild(gEnc); dock.appendChild(bRig);
      root.appendChild(styleEl); root.appendChild(canvas); root.appendChild(hudTop);
      root.appendChild(whisper); root.appendChild(dock);
      containerEl.appendChild(root);

      st.root = root; st.canvas = canvas; st.ctx = canvas.getContext('2d');
      st.ui = { count: countEl, whisper: whisper, phase: phaseInput, wind: windInput, mute: muteBtn, gaze: gBtn };
      st.mounted = true;

      tBtn.addEventListener('click', function () { api.soundTrumpets(); });
      gBtn.addEventListener('click', function () { api.triggerGaze(); });
      wBtn.addEventListener('click', function () { api.spinWheels(); });
      muteBtn.addEventListener('click', function () { api.setMuted(!st.muted); });
      phaseInput.addEventListener('input', function () { api.setLifePhase(Number(phaseInput.value) / 100); });
      windInput.addEventListener('input', function () { api.setWindGust(Number(windInput.value) / 100); });

      canvas.addEventListener('pointerdown', function (ev) {
        var rect = canvas.getBoundingClientRect();
        var nx = (ev.clientX - rect.left) / Math.max(1, rect.width);
        var ny = (ev.clientY - rect.top) / Math.max(1, rect.height);
        st.lastPtrX = nx;
        for (var i = 0; i < st.women.length; i++) {
          if (Math.abs(nx - st.women[i].def.nx) < 0.055 && Math.abs(ny - (st.women[i].def.ny - 0.05)) < 0.11) {
            api.triggerGaze(i); return;
          }
        }
        if (nx >= 0.13 && nx <= 0.31 && ny >= 0.45 && ny <= 0.66) { api.soundTrumpets(); return; }
        for (var w = 0; w < st.wheels.length; w++) {
          var dx = nx - st.wheels[w].nx, dy = ny - st.wheels[w].ny;
          if (Math.sqrt(dx * dx + dy * dy) < st.wheels[w].r * 1.9) {
            st.draggingWheel = w; api.spinWheels(); return;
          }
        }
        st.hurryPromenade = Math.min(1, st.hurryPromenade + 0.45);
        inst.unlock('bazaar-1', 'bazaar'); inst.notify();
      });

      canvas.addEventListener('pointermove', function (ev) {
        var rect = canvas.getBoundingClientRect();
        var nx = (ev.clientX - rect.left) / Math.max(1, rect.width);
        var ny = (ev.clientY - rect.top) / Math.max(1, rect.height);
        for (var i = 0; i < st.women.length; i++) {
          var hit = Math.abs(nx - st.women[i].def.nx) < 0.05 && Math.abs(ny - (st.women[i].def.ny - 0.05)) < 0.10;
          st.women[i].hover = hit;
          if (hit && !st.women[i].met) api.triggerGaze(i);
        }
        if (st.draggingWheel >= 0) {
          st.wheels[st.draggingWheel].boost += (nx - st.lastPtrX) * 28;
        } else if (ny > 0.48 && ny < 0.78) {
          st.promenadeDist += Math.abs(nx - st.lastPtrX);
          st.hurryPromenade = Math.min(1, st.hurryPromenade + Math.abs(nx - st.lastPtrX) * 1.5);
          if (st.promenadeDist > 0.9) inst.unlock('bazaar-1', 'bazaar');
        }
        st.lastPtrX = nx;
      });
      global.addEventListener('pointerup', st.winUp = function () { st.draggingWheel = -1; });

      st.keyHandler = function (ev) {
        if (!st.mounted || (ev.target && ev.target.tagName === 'INPUT')) return;
        var k = (ev.key || '').toLowerCase();
        if (k === 't') { ev.preventDefault(); api.soundTrumpets(); }
        else if (k === 'g') { ev.preventDefault(); api.triggerGaze(); }
        else if (k === 'w') { ev.preventDefault(); api.spinWheels(); }
        else if (k === 'm') { ev.preventDefault(); api.setMuted(!st.muted); }
        else if (k >= '1' && k <= '4') { ev.preventDefault(); api.triggerGaze(Number(k) - 1); }
      };
      root.addEventListener('keydown', st.keyHandler);

      if (global.ResizeObserver) {
        st.ro = new global.ResizeObserver(function () {
          if (st.mounted && st.root) api.resize(st.root.clientWidth, st.root.clientHeight);
        });
        st.ro.observe(root);
      }
      st.winResize = function () { if (st.mounted && st.root) api.resize(st.root.clientWidth, st.root.clientHeight); };
      global.addEventListener('resize', st.winResize);

      inst.updateWhisper();
      api.resize(root.clientWidth || containerEl.clientWidth || 800, root.clientHeight || containerEl.clientHeight || 600);
      st.rafId = global.requestAnimationFrame(inst.tick);
      inst.notify();
      return api;
    },

    soundTrumpets: function () {
      if (!activeInst || !activeInst.st.mounted) return api;
      var st = activeInst.st;
      st.trumpetFanfareCount++;
      st.trumpetTimer = 1.25;
      st.brass.soundFanfare(st.trumpetFanfareCount);
      activeInst.addRing(0.22, 0.50, 0.34, '#ffe27a', 'trumpet');
      activeInst.addRing(0.22, 0.50, 0.22, '#ffae42', 'trumpet');
      if (!activeInst.unlock(null, 'trumpet')) {
        activeInst.updateWhisper('Three brass trumpets ring out from the soldiers\' platform!');
      }
      activeInst.drawNow(); activeInst.notify();
      return api;
    },

    triggerGaze: function (idx) {
      if (!activeInst || !activeInst.st.mounted) return api;
      var st = activeInst.st;
      var target = typeof idx === 'number' && !isNaN(idx)
        ? ((Math.floor(idx) % st.women.length) + st.women.length) % st.women.length : -1;
      if (target < 0) {
        for (var u = 0; u < st.women.length; u++) { if (!st.women[u].met) { target = u; break; } }
        if (target < 0) target = (st.nextGazeCycle++) % st.women.length;
      }
      var wm = st.women[target];
      wm.met = true; wm.turn01 = st.reducedMotion ? 1 : Math.max(0.5, wm.turn01);
      st.gazeActiveIndex = target;
      st.brass.soundGaze(target);
      activeInst.addRing(wm.def.nx, wm.def.ny - 0.09, 0.26, wm.def.shawl, 'gaze');
      if (!activeInst.unlock(wm.def.pathKey, 'gaze')) {
        activeInst.updateWhisper(wm.def.title + ' looks straight into your eyes with a bright fine-toothed smile.');
      }
      activeInst.drawNow(); activeInst.notify();
      return api;
    },

    spinWheels: function () {
      if (!activeInst || !activeInst.st.mounted) return api;
      var st = activeInst.st;
      st.wheelSpinsCount++;
      for (var i = 0; i < st.wheels.length; i++) {
        st.wheels[i].boost += (st.wheels[i].base >= 0 ? 1 : -1) * 5.4;
        if (st.reducedMotion) st.wheels[i].angle += 0.65;
      }
      st.brass.soundWheel();
      api.setWindGust(clamp01(st.windGust + 0.14));
      activeInst.addRing(0.54, 0.48, 0.20, '#ffd478', 'wheel');
      activeInst.unlock(null, 'wheel');
      activeInst.drawNow(); activeInst.notify();
      return api;
    },

    setWindGust: function (val01) {
      if (!activeInst || !activeInst.st.mounted) return api;
      var st = activeInst.st;
      st.windGust = clamp01(val01);
      if (st.ui.wind) st.ui.wind.value = String(Math.round(st.windGust * 100));
      if (st.windGust >= 0.62) activeInst.unlock('banner-1', 'banner');
      if (st.windGust >= 0.85) activeInst.unlock('banner-2', 'banner');
      activeInst.drawNow(); activeInst.notify();
      return api;
    },

    setLifePhase: function (val01) {
      if (!activeInst || !activeInst.st.mounted) return api;
      var st = activeInst.st;
      st.lifePhase = clamp01(val01);
      if (st.ui.phase) st.ui.phase.value = String(Math.round(st.lifePhase * 100));
      activeInst.updateWhisper();
      activeInst.drawNow(); activeInst.notify();
      return api;
    },

    setMuted: function (flag) {
      if (!activeInst || !activeInst.st.mounted) return api;
      var st = activeInst.st;
      st.muted = !!flag;
      if (st.brass) st.brass.setMuted(st.muted);
      if (st.ui.mute) {
        st.ui.mute.textContent = st.muted ? 'Muted' : 'Brass On';
        st.ui.mute.setAttribute('aria-pressed', st.muted ? 'true' : 'false');
      }
      activeInst.notify();
      return api;
    },

    setReducedMotion: function (flag) {
      if (!activeInst || !activeInst.st.mounted) return api;
      activeInst.st.reducedMotion = !!flag;
      activeInst.drawNow(); activeInst.notify();
      return api;
    },

    resize: function (width, height) {
      if (!activeInst || !activeInst.st.mounted) return api;
      var st = activeInst.st;
      var w = Math.max(240, Math.floor(Number(width) || (st.root && st.root.clientWidth) || 800));
      var h = Math.max(240, Math.floor(Number(height) || (st.root && st.root.clientHeight) || 600));
      var dpr = Math.min(2, Math.max(1, Number(global.devicePixelRatio) || 1));
      st.width = w; st.height = h; st.dpr = dpr;
      st.canvas.width = Math.floor(w * dpr);
      st.canvas.height = Math.floor(h * dpr);
      st.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      activeInst.drawNow();
      return api;
    },

    getState: function () {
      if (!activeInst) return { mounted: false, openPathsCount: 1 };
      return activeInst.snapshot();
    },

    destroy: function () {
      if (!activeInst) return;
      var st = activeInst.st;
      st.mounted = false;
      if (st.rafId) global.cancelAnimationFrame(st.rafId);
      if (st.ro) { try { st.ro.disconnect(); } catch (e) {} }
      if (st.winResize) global.removeEventListener('resize', st.winResize);
      if (st.winUp) global.removeEventListener('pointerup', st.winUp);
      if (st.brass) st.brass.destroy();
      if (st.root && st.root.parentNode) st.root.parentNode.removeChild(st.root);
      activeInst = null;
    }
  };

  global.DorotheaMorning = api;
})(typeof window !== 'undefined' ? window : globalThis);
