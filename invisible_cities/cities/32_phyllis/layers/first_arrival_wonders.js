(function () {
  'use strict';

  const PALETTE = Object.freeze({
    cobaltTile: '#1f4e8c',
    canalVerdigris: '#2b7a78',
    roseTracery: '#b84a58',
    caperEmerald: '#2e7d4f',
    sunlightPatch: '#f6c96b',
    blankParchment: '#f4efe3',
    chalkLimestone: '#e8e0cf',
    graphiteZigzag: '#5a554c',
    inkRubric: '#1e2430'
  });

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function hexToRgb(hex) {
    const clean = String(hex || '#000000').replace('#', '');
    const full = clean.length === 3
      ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
      : clean.padEnd(6, '0');
    const n = parseInt(full.slice(0, 6), 16) || 0;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function mixHex(hexA, hexB, t) {
    const k = clamp(t, 0, 1);
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    const r = Math.round(a.r + (b.r - a.r) * k);
    const g = Math.round(a.g + (b.g - a.g) * k);
    const bl = Math.round(a.b + (b.b - a.b) * k);
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }

  function rgbaHex(hex, alpha) {
    const c = hexToRgb(hex);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + clamp(alpha, 0, 1).toFixed(3) + ')';
  }

  const BRIDGES = Object.freeze([
    Object.freeze({
      id: 'bridge_cambered', category: 'bridge', index: 0, kind: 'cambered',
      label: 'Cambered Istrian Arch', normX: 0.24, normY: 0.68, spanW: 0.088, spanH: 0.036, angle: -0.14,
      detail: 'Cambered white Istrian stone arch rising in shallow marble treads above the green canal.'
    }),
    Object.freeze({
      id: 'bridge_covered', category: 'bridge', index: 1, kind: 'covered',
      label: 'Covered Timber Gallery', normX: 0.34, normY: 0.49, spanW: 0.084, spanH: 0.042, angle: 0.12,
      detail: 'Covered timber gallery roofed in terracotta tiles with arcaded shutters spanning the junction.'
    }),
    Object.freeze({
      id: 'bridge_pillars', category: 'bridge', index: 2, kind: 'on_pillars',
      label: 'Bridge on Marble Pillars', normX: 0.46, normY: 0.61, spanW: 0.092, spanH: 0.038, angle: -0.08,
      detail: 'Level stone causeway borne aloft on slender fluted porphyry and Istrian marble pillars.'
    }),
    Object.freeze({
      id: 'bridge_barges', category: 'bridge', index: 3, kind: 'on_barges',
      label: 'Pontoon Bridge on Barges', normX: 0.58, normY: 0.74, spanW: 0.098, spanH: 0.034, angle: 0.10,
      detail: 'Floating timber plankway lashed across three painted canal barges swaying gently with the tide.'
    }),
    Object.freeze({
      id: 'bridge_suspended', category: 'bridge', index: 4, kind: 'suspended',
      label: 'Suspended Chain Footbridge', normX: 0.66, normY: 0.52, spanW: 0.086, spanH: 0.036, angle: -0.16,
      detail: 'Airy catenary footbridge hung from wrought-iron chains slung between twin brick pylons.'
    }),
    Object.freeze({
      id: 'bridge_tracery', category: 'bridge', index: 5, kind: 'tracery_balustrades',
      label: 'Tracery Balustrade Span', normX: 0.42, normY: 0.36, spanW: 0.082, spanH: 0.034, angle: 0.06,
      detail: 'Slender arch framed by rose-stone balustrades pierced in openwork quatrefoil tracery.'
    }),
    Object.freeze({
      id: 'bridge_stepped_brick', category: 'bridge', index: 6, kind: 'stepped_brick',
      label: 'Herringbone Brick Span', normX: 0.20, normY: 0.44, spanW: 0.078, spanH: 0.034, angle: 0.18,
      detail: 'Stepped terracotta brick arch laid in crisp Venetian herringbone courses with pale keystones.'
    }),
    Object.freeze({
      id: 'bridge_loggia_pier', category: 'bridge', index: 7, kind: 'water_gate',
      label: 'Twin-Lantern Water Span', normX: 0.77, normY: 0.66, spanW: 0.088, spanH: 0.040, angle: -0.11,
      detail: 'Water-gate span flanked by twin stone pier turrets crowned with glowing bronze lanterns.'
    }),
    Object.freeze({
      id: 'bridge_skew_vault', category: 'bridge', index: 8, kind: 'oblique_vault',
      label: 'Oblique Ribbed Span', normX: 0.54, normY: 0.33, spanW: 0.080, spanH: 0.033, angle: -0.22,
      detail: 'Oblique stone-ribbed vault crossing the upper canal confluence on a daring diagonal skew.'
    })
  ]);

  const WINDOWS = Object.freeze([
    Object.freeze({
      id: 'win_mullioned', category: 'window', index: 0, kind: 'mullioned',
      label: 'Mullioned Bifora Casement', normX: 0.17, normY: 0.28,
      detail: 'Twin-light mullioned casement divided by a slender marble colonnette and carved spandrel roundel.'
    }),
    Object.freeze({
      id: 'win_moorish', category: 'window', index: 1, kind: 'moorish',
      label: 'Moorish Horseshoe Lattice', normX: 0.30, normY: 0.25,
      detail: 'Lobed Moorish horseshoe arch enclosing pierced cedar mashrabiya latticework and cobalt inlays.'
    }),
    Object.freeze({
      id: 'win_lancet', category: 'window', index: 2, kind: 'lancet',
      label: 'Trefoil Lancet Window', normX: 0.48, normY: 0.22,
      detail: 'Slender soaring lancet opening crowned with a crisply cusped Istrian stone trefoil.'
    }),
    Object.freeze({
      id: 'win_pointed', category: 'window', index: 3, kind: 'pointed',
      label: 'Pointed Gothic Arcade', normX: 0.63, normY: 0.26,
      detail: 'Venetian ogee-pointed casement framed by carved cable moldings and a florid finial.'
    }),
    Object.freeze({
      id: 'win_lunette', category: 'window', index: 4, kind: 'lunette',
      label: 'Sculpted Shell Lunette', normX: 0.76, normY: 0.29,
      detail: 'Semicircular classical lunette window carved with radiating scalloped limestone ribs.'
    }),
    Object.freeze({
      id: 'win_rose', category: 'window', index: 5, kind: 'rose_window',
      label: 'Twelve-Petal Rose Window', normX: 0.38, normY: 0.21,
      detail: 'Twelve-spoked rose window of crimson and cobalt glass radiating like a compass of first arrival.'
    })
  ]);

  const PAVEMENTS = Object.freeze([
    Object.freeze({
      id: 'pave_cobbles', category: 'pavement', index: 0, kind: 'cobbles',
      label: 'Fan-Laid River Cobbles', normX: 0.16, normY: 0.80, normW: 0.16, normH: 0.09,
      detail: 'Tightly wedged river cobbles laid in overlapping peacock-fan arcs along the western quay.'
    }),
    Object.freeze({
      id: 'pave_slabs', category: 'pavement', index: 1, kind: 'slabs',
      label: 'Beveled Trachyte Slabs', normX: 0.37, normY: 0.82, normW: 0.17, normH: 0.09,
      detail: 'Broad beveled Euganean trachyte flagstones scored with diagonal mason chisel grooves.'
    }),
    Object.freeze({
      id: 'pave_gravel', category: 'pavement', index: 2, kind: 'gravel',
      label: 'Raked Golden Gravel', normX: 0.62, normY: 0.83, normW: 0.16, normH: 0.08,
      detail: 'Crunch of sunlit amber and crushed-shell parterre gravel raked in sinusoidal wave bands.'
    }),
    Object.freeze({
      id: 'pave_blue_white_tiles', category: 'pavement', index: 3, kind: 'blue_white_tiles',
      label: 'Cobalt & White Majolica Piazza', normX: 0.49, normY: 0.50, normW: 0.13, normH: 0.08,
      detail: 'Central island square paved in gleaming glazed cobalt-blue and ivory-white star tiles.'
    })
  ]);

  const SINGULAR_MARVELS = Object.freeze([
    Object.freeze({
      id: 'marvel_caper_bush', category: 'singular', index: 0, kind: 'caper_bush',
      label: 'Crag Caper Bush', normX: 0.83, normY: 0.43, canPunctureHabit: true,
      detail: 'Wild caper bush with emerald leaves and white-violet stamens jutting from a crag of the walls.'
    }),
    Object.freeze({
      id: 'marvel_three_queens', category: 'singular', index: 1, kind: 'three_queens_corbels',
      label: 'Three Queens on Corbels', normX: 0.25, normY: 0.33, canPunctureHabit: false,
      detail: 'Statues of three crowned queens poised upon carved acanthus corbels above the canal.'
    }),
    Object.freeze({
      id: 'marvel_onion_domes', category: 'singular', index: 2, kind: 'triple_onion_domes',
      label: 'Onion Dome & Three Bulbous Domes', normX: 0.69, normY: 0.15, canPunctureHabit: false,
      detail: 'Gilded copper onion dome accompanied by three little bulbous domes against the morning sky.'
    }),
    Object.freeze({
      id: 'marvel_doorway_woman', category: 'singular', index: 3, kind: 'doorway_combing_hair',
      label: 'Woman Combing Hair in Doorway', normX: 0.86, normY: 0.72, canPunctureHabit: true,
      detail: 'Happy surprise of a woman in an arched canal doorway combing her long dark hair in sunlit shadow.'
    })
  ]);

  const ALL_WONDERS = Object.freeze([
    ...BRIDGES,
    ...WINDOWS,
    ...PAVEMENTS,
    ...SINGULAR_MARVELS
  ]);

  const SCALES = Object.freeze({
    bridge: [293.66, 329.63, 369.99, 415.30, 440.00, 493.88, 554.37, 587.33, 659.25],
    window: [440.00, 493.88, 554.37, 587.33, 659.25, 739.99],
    pavement: [196.00, 220.00, 246.94, 293.66],
    singular: [587.33, 554.37, 659.25, 493.88]
  });

  function createArrivalWonders(opts) {
    const config = opts || {};
    let width = Math.max(320, Number(config.width) || 1280);
    let height = Math.max(240, Number(config.height) || 800);
    let dpr = Math.max(1, Number(config.dpr) || 1);

    let activeWonderId = 'win_rose';
    let marvelVisibility = 1.0;
    let surprisesBeheldCount = 1;
    let uniqueSet = new Set(['win_rose']);
    let muted = Boolean(config.muted);
    let animTime = 0;
    let focusPulse = 0.4;
    let lastEnv = { bleachFactor: 0, puncture: null, reducedMotion: false };
    let audioCtx = null;
    let layout = null;

    function ensureAudio() {
      if (muted) return null;
      try {
        const Ctor = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!Ctor) return null;
        if (!audioCtx) audioCtx = new Ctor();
        if (audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
        return audioCtx;
      } catch (_err) {
        return null;
      }
    }

    function unlockAudio() {
      try {
        const Ctor = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!Ctor) return false;
        if (!audioCtx) audioCtx = new Ctor();
        if (audioCtx.state === 'suspended') audioCtx.resume().catch(function () {});
        return Boolean(audioCtx);
      } catch (_err) {
        return false;
      }
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      return muted;
    }

    function toggleMute() {
      muted = !muted;
      if (!muted) unlockAudio();
      return muted;
    }

    function isMuted() {
      return muted;
    }

    function playHabitStepTick(bleachFactor) {
      const ctx = ensureAudio();
      if (!ctx) return false;
      try {
        const bf = clamp(Number(bleachFactor === undefined ? 1 : bleachFactor) || 0, 0, 1);
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const filt = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1180 - bf * 340, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.036);
        filt.type = 'bandpass';
        filt.frequency.setValueAtTime(1320 - bf * 320, now);
        filt.Q.setValueAtTime(3.2, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);
        osc.connect(filt);
        filt.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.046);
        return true;
      } catch (_err) {
        return false;
      }
    }

    function playHarpsichordVoice(ctx, freq, startTime, duration, brightness, amp) {
      const oscA = ctx.createOscillator();
      const oscB = ctx.createOscillator();
      const bell = ctx.createOscillator();
      const filt = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      const bellGain = ctx.createGain();

      oscA.type = 'sawtooth';
      oscB.type = 'triangle';
      bell.type = 'sine';
      oscA.frequency.setValueAtTime(freq, startTime);
      oscB.frequency.setValueAtTime(freq * 2.003, startTime);
      bell.frequency.setValueAtTime(freq * 2.756, startTime);

      filt.type = 'lowpass';
      filt.frequency.setValueAtTime(620 + brightness * 3800, startTime);
      filt.frequency.exponentialRampToValueAtTime(380 + brightness * 1100, startTime + duration);
      filt.Q.setValueAtTime(1.8 + brightness * 2.2, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(amp, startTime + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      bellGain.gain.setValueAtTime(0.0001, startTime);
      bellGain.gain.linearRampToValueAtTime(amp * 0.42 * brightness * brightness, startTime + 0.005);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * (0.7 + brightness * 0.6));

      oscA.connect(filt);
      oscB.connect(filt);
      filt.connect(gain);
      gain.connect(ctx.destination);
      bell.connect(bellGain);
      bellGain.connect(ctx.destination);

      oscA.start(startTime);
      oscB.start(startTime);
      bell.start(startTime);
      const endAt = startTime + duration * 1.35 + 0.02;
      oscA.stop(endAt);
      oscB.stop(endAt);
      bell.stop(endAt);
    }

    function playWonderMotif(category, index, bleachFactor) {
      const ctx = ensureAudio();
      if (!ctx) return false;
      try {
        const bf = clamp(Number(bleachFactor) || 0, 0, 1);
        if (bf >= 0.85) return playHabitStepTick(bf);
        const bank = SCALES[category] || SCALES.bridge;
        const baseHz = bank[Math.abs(Number(index) || 0) % bank.length];
        const fresh = clamp(1 - bf, 0.08, 1);
        const now = ctx.currentTime;
        const dur = 0.14 + fresh * 0.38;
        playHarpsichordVoice(ctx, baseHz, now, dur, fresh, 0.058 * (0.45 + fresh * 0.55));
        if (fresh > 0.32) {
          const graceHz = category === 'window' ? baseHz * 1.2599 : baseHz * 1.4983;
          playHarpsichordVoice(ctx, graceHz, now + 0.048, dur * 0.86, fresh, 0.042 * fresh);
        }
        if (bf > 0.45) playHabitStepTick(bf);
        return true;
      } catch (_err) {
        return false;
      }
    }

    function playPunctureSpark(kind) {
      const ctx = ensureAudio();
      if (!ctx) return false;
      try {
        const now = ctx.currentTime;
        const notes = kind === 'doorway_combing_hair'
          ? [440.00, 554.37, 659.25, 880.00]
          : [587.33, 739.99, 880.00, 1174.66];
        for (let i = 0; i < notes.length; i++) {
          playHarpsichordVoice(ctx, notes[i], now + i * 0.055, 0.52, 1.0, 0.056);
        }
        return true;
      } catch (_err) {
        return false;
      }
    }

    function resize(nextW, nextH, nextDpr) {
      width = Math.max(240, Number(nextW) || width || 1280);
      height = Math.max(200, Number(nextH) || height || 800);
      if (nextDpr !== undefined) dpr = Math.max(1, Number(nextDpr) || 1);

      const palazzi = [
        { x: 0.11, y: 0.17, w: 0.12, h: 0.23, tint: '#d99b78', roof: '#9e473c', merlons: 5 },
        { x: 0.23, y: 0.15, w: 0.11, h: 0.25, tint: '#e4be8b', roof: '#8f444c', merlons: 6 },
        { x: 0.34, y: 0.12, w: 0.09, h: 0.23, tint: '#cfa49c', roof: '#1f4e8c', merlons: 4 },
        { x: 0.43, y: 0.13, w: 0.11, h: 0.20, tint: '#dfd0b2', roof: '#2b7a78', merlons: 5 },
        { x: 0.57, y: 0.16, w: 0.13, h: 0.22, tint: '#d89e82', roof: '#b84a58', merlons: 6 },
        { x: 0.70, y: 0.19, w: 0.11, h: 0.22, tint: '#dec290', roof: '#8c4b3e', merlons: 5 }
      ].map(function (p) {
        return {
          x: p.x * width, y: p.y * height, w: p.w * width, h: p.h * height,
          tint: p.tint, roof: p.roof, merlons: p.merlons
        };
      });

      const upperCanal = [
        [0.02, 0.47], [0.20, 0.44], [0.34, 0.49], [0.42, 0.36],
        [0.54, 0.33], [0.66, 0.52], [0.77, 0.66], [0.98, 0.78]
      ].map(function (pt) { return { x: pt[0] * width, y: pt[1] * height }; });

      const lowerCanal = [
        [0.02, 0.72], [0.24, 0.68], [0.34, 0.49], [0.46, 0.61],
        [0.58, 0.74], [0.77, 0.66], [0.98, 0.80]
      ].map(function (pt) { return { x: pt[0] * width, y: pt[1] * height }; });

      layout = { width: width, height: height, dpr: dpr, palazzi: palazzi, upperCanal: upperCanal, lowerCanal: lowerCanal };
      return layout;
    }

    resize(width, height, dpr);


    function traceSmoothSpline(ctx, pts) {
      if (!pts || pts.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length - 1; i++) {
        const mx = (pts[i].x + pts[i + 1].x) * 0.5;
        const my = (pts[i].y + pts[i + 1].y) * 0.5;
        ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
      }
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x, last.y);
    }

    function drawCanalsAndPavements(ctx, w, h, bf, ornAlpha) {
      const canalW = Math.max(18, Math.min(w, h) * 0.056);
      const bankColor = mixHex('#d9cfbc', PALETTE.chalkLimestone, bf);
      const waterCore = mixHex(PALETTE.canalVerdigris, PALETTE.blankParchment, bf * 0.92);
      const waterDeep = mixHex(PALETTE.cobaltTile, PALETTE.chalkLimestone, bf * 0.90);

      [layout.upperCanal, layout.lowerCanal].forEach(function (pts, idx) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        traceSmoothSpline(ctx, pts);
        ctx.strokeStyle = bankColor;
        ctx.lineWidth = canalW + 8;
        ctx.stroke();

        traceSmoothSpline(ctx, pts);
        ctx.strokeStyle = idx === 0 ? waterCore : waterDeep;
        ctx.lineWidth = canalW;
        ctx.stroke();

        if (ornAlpha > 0.03) {
          ctx.globalAlpha = ornAlpha * 0.65;
          ctx.setLineDash([12, 10]);
          ctx.lineDashOffset = -animTime * 14 * (idx === 0 ? 1 : -1);
          traceSmoothSpline(ctx, pts);
          ctx.strokeStyle = PALETTE.sunlightPatch;
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.setLineDash([]);
        }
        ctx.restore();
      });

      if (ornAlpha <= 0.02) return;
      PAVEMENTS.forEach(function (pv) {
        const cx = pv.normX * w;
        const cy = pv.normY * h;
        const pw = pv.normW * w;
        const ph = pv.normH * h;
        const x0 = cx - pw * 0.5;
        const y0 = cy - ph * 0.5;

        ctx.save();
        ctx.globalAlpha = ornAlpha;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x0, y0, pw, ph, 5) : ctx.rect(x0, y0, pw, ph);
        ctx.clip();

        if (pv.kind === 'cobbles') {
          ctx.fillStyle = mixHex('#b8aea0', PALETTE.chalkLimestone, bf);
          ctx.fillRect(x0, y0, pw, ph);
          ctx.strokeStyle = rgbaHex(PALETTE.inkRubric, 0.42 * ornAlpha);
          ctx.lineWidth = 1;
          for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 5; c++) {
              const fx = x0 + (c + (r % 2) * 0.5) * (pw / 4.5);
              const fy = y0 + (r + 0.8) * (ph / 2.6);
              for (let a = 1; a <= 3; a++) {
                ctx.beginPath();
                ctx.arc(fx, fy, a * (pw * 0.045), Math.PI * 1.15, Math.PI * 1.85);
                ctx.stroke();
              }
            }
          }
        } else if (pv.kind === 'slabs') {
          ctx.fillStyle = mixHex('#c8bfb0', PALETTE.chalkLimestone, bf);
          ctx.fillRect(x0, y0, pw, ph);
          ctx.strokeStyle = rgbaHex(PALETTE.graphiteZigzag, 0.55 * ornAlpha);
          ctx.lineWidth = 1.1;
          const cols = 5, rows = 3;
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const sx = x0 + ((c + (r % 2) * 0.35) % cols) * (pw / cols);
              const sy = y0 + r * (ph / rows);
              ctx.strokeRect(sx + 1, sy + 1, pw / cols - 2, ph / rows - 2);
            }
          }
        } else if (pv.kind === 'gravel') {
          ctx.fillStyle = mixHex(PALETTE.sunlightPatch, PALETTE.blankParchment, 0.32 + bf * 0.68);
          ctx.fillRect(x0, y0, pw, ph);
          ctx.strokeStyle = rgbaHex('#9c7a3c', 0.42 * ornAlpha);
          ctx.lineWidth = 1;
          for (let r = 1; r <= 4; r++) {
            const ry = y0 + (r / 5) * ph;
            ctx.beginPath();
            for (let x = x0; x <= x0 + pw; x += 6) {
              const wy = ry + Math.sin((x - x0) * 0.14 + r) * 2.2;
              if (x === x0) ctx.moveTo(x, wy); else ctx.lineTo(x, wy);
            }
            ctx.stroke();
          }
        } else {
          const cols = 8, rows = 5;
          const cw = pw / cols, ch = ph / rows;
          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const isBlue = (r + c) % 2 === 0;
              ctx.fillStyle = isBlue
                ? mixHex(PALETTE.cobaltTile, PALETTE.blankParchment, bf)
                : mixHex('#fbf8f1', PALETTE.blankParchment, bf);
              ctx.fillRect(x0 + c * cw, y0 + r * ch, cw + 0.5, ch + 0.5);
            }
          }
        }
        ctx.strokeStyle = rgbaHex(PALETTE.inkRubric, 0.35 * ornAlpha);
        ctx.lineWidth = 1.2;
        ctx.strokeRect(x0, y0, pw, ph);
        ctx.restore();
      });
    }

    function drawAllNineBridges(ctx, w, h, bf, ornAlpha) {
      if (ornAlpha <= 0.02) return;
      BRIDGES.forEach(function (br) {
        const bx = br.normX * w;
        const by = br.normY * h;
        const sw = Math.max(38, br.spanW * w);
        const sh = Math.max(16, br.spanH * h);
        const sway = br.kind === 'on_barges' ? Math.sin(animTime * 2.1) * 2.4 : 0;

        ctx.save();
        ctx.globalAlpha = ornAlpha;
        ctx.translate(bx, by + sway);
        ctx.rotate(br.angle);

        const stone = mixHex('#f2ead9', PALETTE.chalkLimestone, bf);
        const ink = rgbaHex(PALETTE.inkRubric, 0.72 * ornAlpha);
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.2;

        if (br.kind === 'cambered') {
          ctx.fillStyle = stone;
          ctx.beginPath();
          ctx.moveTo(-sw * 0.5, sh * 0.35);
          ctx.quadraticCurveTo(0, -sh * 0.7, sw * 0.5, sh * 0.35);
          ctx.quadraticCurveTo(0, -sh * 0.12, -sw * 0.5, sh * 0.35);
          ctx.fill();
          ctx.stroke();
        } else if (br.kind === 'covered') {
          ctx.fillStyle = mixHex('#e3c598', PALETTE.chalkLimestone, bf);
          ctx.fillRect(-sw * 0.46, -sh * 0.38, sw * 0.92, sh * 0.58);
          ctx.strokeRect(-sw * 0.46, -sh * 0.38, sw * 0.92, sh * 0.58);
          ctx.fillStyle = mixHex(PALETTE.roseTracery, PALETTE.chalkLimestone, bf);
          ctx.beginPath();
          ctx.moveTo(-sw * 0.52, -sh * 0.38);
          ctx.lineTo(0, -sh * 0.85);
          ctx.lineTo(sw * 0.52, -sh * 0.38);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (br.kind === 'on_pillars') {
          for (let p = -1; p <= 1; p++) {
            ctx.fillStyle = mixHex('#d8c7be', PALETTE.chalkLimestone, bf);
            ctx.fillRect(p * sw * 0.28 - 3, -sh * 0.1, 6, sh * 0.65);
            ctx.strokeRect(p * sw * 0.28 - 3, -sh * 0.1, 6, sh * 0.65);
          }
          ctx.fillStyle = stone;
          ctx.fillRect(-sw * 0.5, -sh * 0.25, sw, sh * 0.24);
          ctx.strokeRect(-sw * 0.5, -sh * 0.25, sw, sh * 0.24);
        } else if (br.kind === 'on_barges') {
          for (let b = -1; b <= 1; b++) {
            const ox = b * sw * 0.3;
            ctx.fillStyle = mixHex('#6d4534', PALETTE.chalkLimestone, bf);
            ctx.beginPath();
            ctx.moveTo(ox - sw * 0.12, sh * 0.05);
            ctx.lineTo(ox + sw * 0.12, sh * 0.05);
            ctx.lineTo(ox + sw * 0.08, sh * 0.42);
            ctx.lineTo(ox - sw * 0.08, sh * 0.42);
            ctx.closePath();
            ctx.fill();
          }
          ctx.fillStyle = mixHex('#c99d66', PALETTE.chalkLimestone, bf);
          ctx.fillRect(-sw * 0.5, -sh * 0.12, sw, sh * 0.2);
          ctx.strokeRect(-sw * 0.5, -sh * 0.12, sw, sh * 0.2);
        } else if (br.kind === 'suspended') {
          ctx.fillStyle = mixHex('#9e4e42', PALETTE.chalkLimestone, bf);
          ctx.fillRect(-sw * 0.46, -sh * 0.7, 5, sh * 0.95);
          ctx.fillRect(sw * 0.46 - 5, -sh * 0.7, 5, sh * 0.95);
          ctx.beginPath();
          ctx.moveTo(-sw * 0.44, -sh * 0.65);
          ctx.quadraticCurveTo(0, sh * 0.08, sw * 0.44, -sh * 0.65);
          ctx.stroke();
          ctx.fillStyle = stone;
          ctx.fillRect(-sw * 0.46, sh * 0.05, sw * 0.92, sh * 0.16);
        } else if (br.kind === 'tracery_balustrades') {
          ctx.fillStyle = mixHex(PALETTE.roseTracery, PALETTE.chalkLimestone, bf);
          ctx.fillRect(-sw * 0.48, -sh * 0.32, sw * 0.96, sh * 0.44);
          ctx.fillStyle = mixHex(PALETTE.blankParchment, PALETTE.chalkLimestone, bf);
          for (let q = -2; q <= 2; q++) {
            ctx.beginPath();
            ctx.arc(q * sw * 0.16, -sh * 0.1, sh * 0.12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        } else if (br.kind === 'stepped_brick') {
          ctx.fillStyle = mixHex('#b85642', PALETTE.chalkLimestone, bf);
          ctx.beginPath();
          ctx.moveTo(-sw * 0.5, sh * 0.3);
          ctx.lineTo(-sw * 0.18, -sh * 0.35);
          ctx.lineTo(sw * 0.18, -sh * 0.35);
          ctx.lineTo(sw * 0.5, sh * 0.3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (br.kind === 'water_gate') {
          ctx.fillStyle = stone;
          ctx.fillRect(-sw * 0.48, -sh * 0.18, sw * 0.96, sh * 0.32);
          [-sw * 0.38, sw * 0.38].forEach(function (lx) {
            ctx.fillStyle = mixHex(PALETTE.sunlightPatch, PALETTE.blankParchment, bf);
            ctx.beginPath();
            ctx.arc(lx, -sh * 0.52, sh * 0.18, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          });
        } else {
          ctx.transform(1, 0, -0.32, 1, 0, 0);
          ctx.fillStyle = mixHex('#cfc5b4', PALETTE.chalkLimestone, bf);
          ctx.fillRect(-sw * 0.45, -sh * 0.24, sw * 0.9, sh * 0.42);
          ctx.strokeRect(-sw * 0.45, -sh * 0.24, sw * 0.9, sh * 0.42);
        }
        ctx.restore();
      });
    }


    function drawSkyAndPalazzi(ctx, w, h, bf, ornAlpha) {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, mixHex('#d7e6f0', PALETTE.blankParchment, bf));
      skyGrad.addColorStop(0.38, mixHex('#f2e6cf', PALETTE.blankParchment, bf));
      skyGrad.addColorStop(1, mixHex('#ece3d0', PALETTE.chalkLimestone, bf * 0.65));
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = mixHex('#dfd4be', PALETTE.chalkLimestone, bf * 0.8);
      ctx.fillRect(0, h * 0.73, w, h * 0.27);

      layout.palazzi.forEach(function (p) {
        ctx.fillStyle = mixHex(p.tint, PALETTE.blankParchment, 0.12 + bf * 0.86);
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = rgbaHex(PALETTE.graphiteZigzag, 0.16 + ornAlpha * 0.36);
        ctx.lineWidth = 1;
        ctx.strokeRect(p.x, p.y, p.w, p.h);

        if (ornAlpha > 0.03) {
          ctx.save();
          ctx.globalAlpha = ornAlpha;
          ctx.fillStyle = mixHex(p.roof, PALETTE.chalkLimestone, bf);
          ctx.fillRect(p.x - 2, p.y - 5, p.w + 4, 6);
          const mw = p.w / (p.merlons * 2);
          for (let m = 0; m < p.merlons; m++) {
            ctx.fillRect(p.x + m * mw * 2 + mw * 0.25, p.y - 12, mw * 1.1, 7);
          }
          ctx.restore();
        }
      });

      ctx.save();
      ctx.fillStyle = mixHex('#c8bba5', PALETTE.chalkLimestone, 0.15 + bf * 0.82);
      ctx.beginPath();
      ctx.moveTo(w * 0.79, h * 0.28);
      ctx.lineTo(w * 0.94, h * 0.24);
      ctx.lineTo(w * 0.96, h * 0.84);
      ctx.lineTo(w * 0.80, h * 0.82);
      ctx.lineTo(w * 0.81, h * 0.46);
      ctx.lineTo(w * 0.78, h * 0.42);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = rgbaHex(PALETTE.graphiteZigzag, 0.18 + ornAlpha * 0.35);
      ctx.stroke();
      ctx.restore();
    }

    function drawWindowsAndMarvels(ctx, w, h, bf, ornAlpha) {
      if (ornAlpha <= 0.02) return;
      const unit = Math.max(12, Math.min(w, h) * 0.024);

      WINDOWS.forEach(function (win) {
        const wx = win.normX * w;
        const wy = win.normY * h;
        ctx.save();
        ctx.globalAlpha = ornAlpha;
        ctx.translate(wx, wy);
        ctx.strokeStyle = mixHex(PALETTE.inkRubric, PALETTE.chalkLimestone, bf);
        ctx.lineWidth = 1.3;

        if (win.kind === 'rose_window') {
          const r = unit * 1.08;
          ctx.fillStyle = mixHex(PALETTE.roseTracery, PALETTE.blankParchment, bf);
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = mixHex(PALETTE.cobaltTile, PALETTE.blankParchment, bf);
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = mixHex(PALETTE.sunlightPatch, PALETTE.chalkLimestone, bf);
          for (let k = 0; k < 12; k++) {
            const a = (k / 12) * Math.PI * 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * r * 0.94, Math.sin(a) * r * 0.94);
            ctx.stroke();
          }
        } else if (win.kind === 'mullioned') {
          ctx.fillStyle = mixHex(PALETTE.cobaltTile, PALETTE.blankParchment, bf);
          ctx.fillRect(-unit * 0.75, -unit * 0.85, unit * 1.5, unit * 1.7);
          ctx.strokeRect(-unit * 0.75, -unit * 0.85, unit * 1.5, unit * 1.7);
          ctx.strokeStyle = mixHex('#f7f2e7', PALETTE.chalkLimestone, bf);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, -unit * 0.85);
          ctx.lineTo(0, unit * 0.85);
          ctx.stroke();
        } else if (win.kind === 'moorish') {
          ctx.fillStyle = mixHex(PALETTE.roseTracery, PALETTE.blankParchment, bf);
          ctx.beginPath();
          ctx.arc(0, -unit * 0.2, unit * 0.72, Math.PI * 0.82, Math.PI * 0.18, false);
          ctx.lineTo(unit * 0.56, unit * 0.9);
          ctx.lineTo(-unit * 0.56, unit * 0.9);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (win.kind === 'lancet') {
          ctx.fillStyle = mixHex(PALETTE.cobaltTile, PALETTE.blankParchment, bf);
          ctx.beginPath();
          ctx.moveTo(-unit * 0.42, unit * 0.95);
          ctx.lineTo(-unit * 0.42, -unit * 0.2);
          ctx.quadraticCurveTo(0, -unit * 1.15, unit * 0.42, -unit * 0.2);
          ctx.lineTo(unit * 0.42, unit * 0.95);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (win.kind === 'pointed') {
          ctx.fillStyle = mixHex(PALETTE.canalVerdigris, PALETTE.blankParchment, bf);
          ctx.beginPath();
          ctx.moveTo(-unit * 0.65, unit * 0.85);
          ctx.lineTo(-unit * 0.65, -unit * 0.1);
          ctx.lineTo(0, -unit * 0.95);
          ctx.lineTo(unit * 0.65, -unit * 0.1);
          ctx.lineTo(unit * 0.65, unit * 0.85);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillStyle = mixHex(PALETTE.sunlightPatch, PALETTE.blankParchment, bf);
          ctx.beginPath();
          ctx.arc(0, unit * 0.25, unit * 0.85, Math.PI, 0, false);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      });

      SINGULAR_MARVELS.forEach(function (mv) {
        const mx = mv.normX * w;
        const my = mv.normY * h;
        ctx.save();
        ctx.globalAlpha = ornAlpha;
        ctx.translate(mx, my);

        if (mv.kind === 'three_queens_corbels') {
          [-unit * 1.05, 0, unit * 1.05].forEach(function (qx) {
            ctx.fillStyle = mixHex('#f5efe2', PALETTE.chalkLimestone, bf);
            ctx.fillRect(qx - 4, 2, 8, unit * 0.45);
            ctx.fillRect(qx - 3.5, -unit * 0.72, 7, unit * 0.72);
            ctx.fillStyle = mixHex(PALETTE.sunlightPatch, PALETTE.blankParchment, bf);
            ctx.fillRect(qx - 4, -unit * 0.92, 8, 4);
          });
        } else if (mv.kind === 'triple_onion_domes') {
          const offsets = [
            { dx: 0, dy: 0, r: unit * 0.92, fill: PALETTE.sunlightPatch },
            { dx: -unit * 1.15, dy: unit * 0.28, r: unit * 0.5, fill: PALETTE.canalVerdigris },
            { dx: unit * 1.05, dy: unit * 0.24, r: unit * 0.52, fill: PALETTE.canalVerdigris },
            { dx: unit * 1.85, dy: unit * 0.36, r: unit * 0.42, fill: PALETTE.roseTracery }
          ];
          offsets.forEach(function (d) {
            ctx.fillStyle = mixHex(d.fill, PALETTE.blankParchment, bf);
            ctx.beginPath();
            ctx.arc(d.dx, d.dy, d.r, Math.PI * 0.85, Math.PI * 0.15, false);
            ctx.lineTo(d.dx, d.dy - d.r * 1.65);
            ctx.closePath();
            ctx.fill();
          });
        } else if (mv.kind === 'caper_bush') {
          const breeze = Math.sin(animTime * 2.4) * 2.5;
          for (let b = 0; b < 5; b++) {
            const ang = -0.7 + b * 0.34;
            const lx = Math.cos(ang) * unit * 1.35 + breeze;
            const ly = Math.sin(ang) * unit * 0.95;
            ctx.strokeStyle = mixHex(PALETTE.caperEmerald, PALETTE.chalkLimestone, bf);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-unit * 0.35, 0);
            ctx.quadraticCurveTo(lx * 0.5, ly - 5, lx, ly);
            ctx.stroke();
            ctx.fillStyle = mixHex(PALETTE.caperEmerald, PALETTE.chalkLimestone, bf);
            ctx.beginPath();
            ctx.arc(lx * 0.72, ly * 0.72, 4.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = mixHex('#faf6ff', PALETTE.blankParchment, bf);
            ctx.beginPath();
            ctx.arc(lx, ly, 3.6, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (mv.kind === 'doorway_combing_hair') {
          const strokeComb = Math.sin(animTime * 2.6) * 3.2;
          ctx.fillStyle = mixHex(PALETTE.sunlightPatch, PALETTE.blankParchment, bf * 0.85);
          ctx.beginPath();
          ctx.arc(0, -unit * 0.35, unit * 0.78, Math.PI, 0, false);
          ctx.lineTo(unit * 0.78, unit * 1.15);
          ctx.lineTo(-unit * 0.78, unit * 1.15);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = mixHex(PALETTE.inkRubric, PALETTE.chalkLimestone, bf);
          ctx.beginPath();
          ctx.arc(-2, -unit * 0.32, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(-5, -unit * 0.12, 8, unit * 1.1);
          ctx.strokeStyle = mixHex(PALETTE.inkRubric, PALETTE.chalkLimestone, bf);
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(0, -unit * 0.32);
          ctx.quadraticCurveTo(8, unit * 0.25 + strokeComb * 0.4, 5, unit * 0.85);
          ctx.stroke();
        }
        ctx.restore();
      });
    }


    function drawVistaPass(ctx, w, h, bf) {
      const ornAlpha = Math.pow(clamp(1 - bf, 0, 1), 1.2);
      drawSkyAndPalazzi(ctx, w, h, bf, ornAlpha);
      drawCanalsAndPavements(ctx, w, h, bf, ornAlpha);
      drawAllNineBridges(ctx, w, h, bf, ornAlpha);
      drawWindowsAndMarvels(ctx, w, h, bf, ornAlpha);
    }

    function findWonder(wonderIdOrIndex) {
      if (typeof wonderIdOrIndex === 'number' && Number.isFinite(wonderIdOrIndex)) {
        const idx = Math.trunc(wonderIdOrIndex);
        if (idx >= 0 && idx < ALL_WONDERS.length) return ALL_WONDERS[idx];
      }
      if (typeof wonderIdOrIndex === 'string') {
        for (let i = 0; i < ALL_WONDERS.length; i++) {
          if (ALL_WONDERS[i].id === wonderIdOrIndex) return ALL_WONDERS[i];
        }
      }
      return null;
    }

    function computeLocalVisibility(wonder, bf, puncture) {
      if (puncture && puncture.active) {
        if (puncture.wonderId === wonder.id) return 1.0;
        if (typeof puncture.normX === 'number' && typeof puncture.normY === 'number') {
          const r = Number(puncture.radiusNorm) || 0.11;
          if (Math.hypot(wonder.normX - puncture.normX, wonder.normY - puncture.normY) <= r) return 1.0;
        }
      }
      return +(Math.max(0, 1 - bf)).toFixed(4);
    }

    function renderArrivalVista(ctx, nextW, nextH, env) {
      if (!ctx) return;
      const w = Math.max(240, Number(nextW) || width);
      const h = Math.max(200, Number(nextH) || height);
      if (!layout || layout.width !== w || layout.height !== h) resize(w, h, dpr);

      const curEnv = env || lastEnv || {};
      const bf = clamp(Number(curEnv.bleachFactor || 0), 0, 1);
      marvelVisibility = +(Math.max(0, 1 - bf)).toFixed(4);

      drawVistaPass(ctx, w, h, bf);

      const puncture = curEnv.puncture;
      if (puncture && puncture.active) {
        const pWonder = puncture.wonderId ? findWonder(puncture.wonderId) : null;
        const pnx = typeof puncture.normX === 'number' ? puncture.normX : (pWonder ? pWonder.normX : 0.83);
        const pny = typeof puncture.normY === 'number' ? puncture.normY : (pWonder ? pWonder.normY : 0.43);
        const pr = Math.max(32, (Number(puncture.radiusNorm) || 0.11) * Math.min(w, h));
        const px = pnx * w;
        const py = pny * h;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.clip();
        drawVistaPass(ctx, w, h, 0);
        ctx.restore();

        ctx.save();
        ctx.strokeStyle = PALETTE.caperEmerald;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = PALETTE.sunlightPatch;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(px, py, pr + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      const active = findWonder(activeWonderId);
      const activeVis = active ? computeLocalVisibility(active, bf, puncture) : 0;
      if (active && activeVis > 0.12) {
        const ax = active.normX * w;
        const ay = active.normY * h;
        const hr = Math.max(16, Math.min(w, h) * 0.032) + focusPulse * 5;
        ctx.save();
        ctx.globalAlpha = clamp(activeVis, 0.2, 0.95);
        ctx.strokeStyle = PALETTE.sunlightPatch;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(ax, ay, hr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = PALETTE.cobaltTile;
        ctx.lineWidth = 1.1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(ax, ay, hr + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    function getWonders(nextW, nextH) {
      const w = Number(nextW) || width;
      const h = Number(nextH) || height;
      const bf = clamp(Number(lastEnv.bleachFactor || (1 - marvelVisibility)), 0, 1);
      return ALL_WONDERS.map(function (item) {
        return Object.assign({}, item, {
          x: +(item.normX * w).toFixed(2),
          y: +(item.normY * h).toFixed(2),
          localVisibility: computeLocalVisibility(item, bf, lastEnv.puncture)
        });
      });
    }

    function inspectWonder(wonderIdOrIndex, bleachState) {
      const wonder = findWonder(wonderIdOrIndex) || findWonder(activeWonderId) || ALL_WONDERS[0];
      activeWonderId = wonder.id;
      const bs = bleachState || {};
      const bf = clamp(Number(bs.bleachFactor || 0), 0, 1);
      const punctured = Boolean(
        bs.puncture && bs.puncture.active && bs.puncture.wonderId === wonder.id
      );

      if (bf < 0.85 || punctured) {
        surprisesBeheldCount += 1;
        uniqueSet.add(wonder.id);
        focusPulse = 1.0;
        playWonderMotif(wonder.category, wonder.index, punctured ? 0 : bf);
        return { wonder: wonder, legible: true, note: wonder.detail };
      }

      playHabitStepTick(bf);
      return {
        wonder: wonder,
        legible: false,
        note: 'Eyes scan a blank limestone page; the ornament has faded from sight.'
      };
    }

    function hitTestWonder(normX, normY) {
      let nx = Number(normX);
      let ny = Number(normY);
      if (!Number.isFinite(nx) || !Number.isFinite(ny)) return null;
      if ((nx > 1.5 || ny > 1.5) && width > 0 && height > 0) {
        nx = nx / width;
        ny = ny / height;
      }
      const radius = 0.068;
      const groups = [SINGULAR_MARVELS, BRIDGES, WINDOWS, PAVEMENTS];
      for (let g = 0; g < groups.length; g++) {
        const list = groups[g];
        let best = null;
        let bestDist = radius;
        for (let i = 0; i < list.length; i++) {
          const d = Math.hypot(nx - list[i].normX, ny - list[i].normY);
          if (d <= bestDist) {
            bestDist = d;
            best = list[i];
          }
        }
        if (best) return best;
      }
      return null;
    }

    function step(dtSec, env) {
      const dt = clamp(Number(dtSec) || 0, 0, 0.2);
      const curEnv = env || {};
      const bf = clamp(Number(curEnv.bleachFactor || 0), 0, 1);
      marvelVisibility = +(Math.max(0, 1 - bf)).toFixed(4);
      lastEnv = {
        bleachFactor: bf,
        puncture: curEnv.puncture || null,
        reducedMotion: Boolean(curEnv.reducedMotion)
      };
      if (!lastEnv.reducedMotion) {
        animTime += dt;
        focusPulse = Math.max(0, focusPulse - dt * 1.35);
      } else {
        focusPulse = 0;
      }
      return marvelVisibility;
    }

    function getState() {
      return {
        totalWonders: 23,
        bridgeCount: 9,
        windowCount: 6,
        pavementCount: 4,
        singularCount: 4,
        marvelVisibility: marvelVisibility,
        surprisesBeheldCount: surprisesBeheldCount,
        uniqueWondersBeheldCount: uniqueSet.size,
        uniqueWondersBeheld: Array.from(uniqueSet),
        activeWonderId: activeWonderId,
        muted: muted
      };
    }

    function reset() {
      activeWonderId = 'win_rose';
      marvelVisibility = 1.0;
      surprisesBeheldCount = 1;
      uniqueSet = new Set(['win_rose']);
      animTime = 0;
      focusPulse = 0.4;
      lastEnv = { bleachFactor: 0, puncture: null, reducedMotion: false };
      return getState();
    }

    return {
      PALETTE: PALETTE,
      BRIDGES: BRIDGES,
      WINDOWS: WINDOWS,
      PAVEMENTS: PAVEMENTS,
      SINGULAR_MARVELS: SINGULAR_MARVELS,
      ALL_WONDERS: ALL_WONDERS,
      resize: resize,
      getWonders: getWonders,
      inspectWonder: inspectWonder,
      hitTestWonder: hitTestWonder,
      step: step,
      renderArrivalVista: renderArrivalVista,
      unlockAudio: unlockAudio,
      setMuted: setMuted,
      toggleMute: toggleMute,
      isMuted: isMuted,
      playWonderMotif: playWonderMotif,
      playPunctureSpark: playPunctureSpark,
      playHabitStepTick: playHabitStepTick,
      getState: getState,
      reset: reset
    };
  }

  const api = Object.freeze({
    PALETTE: PALETTE,
    BRIDGES: BRIDGES,
    WINDOWS: WINDOWS,
    PAVEMENTS: PAVEMENTS,
    SINGULAR_MARVELS: SINGULAR_MARVELS,
    ALL_WONDERS: ALL_WONDERS,
    createArrivalWonders: createArrivalWonders
  });

  globalThis.PhyllisFirstArrivalWonders = api;
  if (typeof window !== 'undefined') {
    window.PhyllisFirstArrivalWonders = api;
  }
})();
