(function (global) {
  'use strict';

  var CANONICAL_TRADES = [
    { id: 'banqueters', index: 0, label: 'Banqueters', shortLabel: 'Banquet', numeral: 'I' },
    { id: 'trumpeters', index: 1, label: 'Trumpeters', shortLabel: 'Trumpet', numeral: 'II' },
    { id: 'clockmakers', index: 2, label: 'Clockmakers', shortLabel: 'Clocks', numeral: 'III' },
    { id: 'barbers', index: 3, label: 'Barbers', shortLabel: 'Barbers', numeral: 'IV' },
    { id: 'mezzo_sopranos', index: 4, label: 'Mezzo-Sopranos', shortLabel: 'Aria', numeral: 'V' },
    { id: 'dancers', index: 5, label: 'Dancers', shortLabel: 'Dancers', numeral: 'VI' },
    { id: 'bank_tellers', index: 6, label: 'Bank Tellers', shortLabel: 'Tellers', numeral: 'VII' },
    { id: 'beauties', index: 7, label: 'Beauties', shortLabel: 'Beauties', numeral: 'VIII' }
  ];

  var CIVIC_TUNICS = [
    '#9e4733', '#3b5978', '#556b45', '#7c4b63',
    '#8b5a2b', '#3f6a66', '#7a5c32', '#6e4250'
  ];

  var DORIAN_HZ = [293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25, 587.33];

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function parseHex(hex) {
    var h = String(hex || '#000000').replace('#', '');
    if (h.length === 3) {
      h = h.charAt(0) + h.charAt(0) + h.charAt(1) + h.charAt(1) + h.charAt(2) + h.charAt(2);
    }
    var n = parseInt(h, 16) || 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function mixColor(hexA, hexB, t, alpha) {
    var k = clamp(t, 0, 1);
    var a = parseHex(hexA);
    var b = parseHex(hexB);
    var r = Math.round(lerp(a[0], b[0], k));
    var g = Math.round(lerp(a[1], b[1], k));
    var bl = Math.round(lerp(a[2], b[2], k));
    if (typeof alpha === 'number') {
      return 'rgba(' + r + ',' + g + ',' + bl + ',' + clamp(alpha, 0, 1).toFixed(3) + ')';
    }
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }

  function resolveTrade(state, idx) {
    var base = CANONICAL_TRADES[idx] || CANONICAL_TRADES[0];
    var list = state && Array.isArray(state.trades) ? state.trades : null;
    var item = list && list[idx] ? list[idx] : null;
    if (!item) {
      return {
        id: base.id,
        index: idx,
        label: base.label,
        shortLabel: base.shortLabel,
        numeral: base.numeral,
        deadPractitioners: 3,
        innovatedLevel: 0,
        copiedAboveLevel: 0,
        latestMotif: null
      };
    }
    return {
      id: item.id || base.id,
      index: idx,
      label: item.label || base.label,
      shortLabel: base.shortLabel,
      numeral: base.numeral,
      deadPractitioners: typeof item.deadPractitioners === 'number' ? item.deadPractitioners : 3,
      innovatedLevel: typeof item.innovatedLevel === 'number' ? item.innovatedLevel : 0,
      copiedAboveLevel: typeof item.copiedAboveLevel === 'number' ? item.copiedAboveLevel : 0,
      latestMotif: item.latestMotif || null
    };
  }

  function computeLayout(w, h, state) {
    var splitRatio = clamp(
      state && typeof state.horizonSplit === 'number' ? state.horizonSplit : 0.50,
      0.18,
      0.82
    );
    var ySplit = h * splitRatio;
    var bandHalf = clamp(h * 0.022, 9, 14);
    var padX = clamp(w * 0.012, 4, 16);
    var shaftW = clamp(w * 0.082, 42, 96);
    var shaftLeft = w * 0.5 - shaftW * 0.5;
    var shaftRight = w * 0.5 + shaftW * 0.5;
    var wingW = Math.max(32, shaftLeft - padX - 4);
    var bayW = wingW / 4;
    var upperTop = clamp(h * 0.09, 26, 62);
    var upperBottom = Math.max(upperTop + 24, ySplit - bandHalf);
    var lowerTop = Math.min(h - 28, ySplit + bandHalf);
    var lowerBottom = h - clamp(h * 0.022, 6, 14);

    var bays = [];
    var i;
    for (i = 0; i < 4; i++) {
      bays.push({
        index: i,
        x: padX + i * bayW,
        w: bayW,
        cx: padX + (i + 0.5) * bayW
      });
    }
    for (i = 0; i < 4; i++) {
      var rx = shaftRight + 4 + i * bayW;
      bays.push({
        index: i + 4,
        x: rx,
        w: bayW,
        cx: rx + 0.5 * bayW
      });
    }

    return {
      w: w,
      h: h,
      splitRatio: splitRatio,
      ySplit: ySplit,
      bandHalf: bandHalf,
      shaftW: shaftW,
      shaftLeft: shaftLeft,
      shaftRight: shaftRight,
      shaftCx: w * 0.5,
      upperTop: upperTop,
      upperBottom: upperBottom,
      upperH: Math.max(24, upperBottom - upperTop),
      lowerTop: lowerTop,
      lowerBottom: lowerBottom,
      lowerH: Math.max(24, lowerBottom - lowerTop),
      bays: bays
    };
  }

  function createSynth(initialMuted) {
    var muted = Boolean(initialMuted);
    var audioCtx = null;
    var masterGain = null;

    function ensureAudio() {
      if (muted) return null;
      try {
        if (!audioCtx) {
          var Ctx = global.AudioContext || global.webkitAudioContext;
          if (!Ctx) return null;
          audioCtx = new Ctx();
          masterGain = audioCtx.createGain();
          masterGain.gain.value = 0.85;
          masterGain.connect(audioCtx.destination);
        }
        if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
          var p = audioCtx.resume();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        }
        return audioCtx;
      } catch (err) {
        return null;
      }
    }

    function tone(ctx, freq, endFreq, type, startOffset, dur, peak, filterHz) {
      var now = ctx.currentTime + startOffset;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(Math.max(30, freq), now);
      if (endFreq && endFreq !== freq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(30, endFreq), now + dur);
      }
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peak, now + Math.min(0.025, dur * 0.25));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      if (filterHz) {
        var flt = ctx.createBiquadFilter();
        flt.type = 'lowpass';
        flt.frequency.setValueAtTime(filterHz, now);
        osc.connect(flt);
        flt.connect(gain);
      } else {
        osc.connect(gain);
      }
      gain.connect(masterGain);
      osc.start(now);
      osc.stop(now + dur + 0.02);
    }

    return {
      setMuted: function (val) {
        muted = Boolean(val);
        try {
          if (masterGain && audioCtx) {
            masterGain.gain.setTargetAtTime(muted ? 0.0001 : 0.85, audioCtx.currentTime, 0.02);
          }
        } catch (err) {}
        return muted;
      },
      isMuted: function () {
        return muted;
      },
      toggleMute: function () {
        return this.setMuted(!muted);
      },
      playCue: function (kind, state) {
        if (muted) return;
        var ctx = ensureAudio();
        if (!ctx) return;
        try {
          if (kind === 'procession') {
            tone(ctx, 146.83, 145.5, 'sine', 0, 0.78, 0.12, 650);
            tone(ctx, 220.0, 218.0, 'triangle', 0.01, 0.55, 0.06, 800);
            tone(ctx, 98.0, 74.0, 'sawtooth', 0.10, 0.36, 0.035, 320);
          } else if (kind === 'innovation') {
            tone(ctx, 293.66, 293.66, 'sawtooth', 0, 0.24, 0.075, 1150);
            tone(ctx, 440.0, 442.0, 'sawtooth', 0.14, 0.42, 0.09, 1300);
            tone(ctx, 587.33, 587.33, 'triangle', 0.16, 0.36, 0.045, 1500);
          } else if (kind === 'copy_sync') {
            tone(ctx, 1680, 920, 'square', 0, 0.045, 0.045, 2400);
            tone(ctx, 1320, 780, 'square', 0.08, 0.045, 0.04, 2100);
            tone(ctx, 440.0, 436.0, 'triangle', 0.13, 0.52, 0.075, 1200);
            tone(ctx, 659.25, 656.0, 'sine', 0.14, 0.50, 0.06, 1400);
          } else if (kind === 'blocked') {
            tone(ctx, 118, 56, 'triangle', 0, 0.16, 0.12, 340);
            tone(ctx, 108, 52, 'triangle', 0.12, 0.18, 0.10, 300);
          } else {
            var idx = 0;
            if (state && state.selectedTrade) {
              for (var i = 0; i < CANONICAL_TRADES.length; i++) {
                if (CANONICAL_TRADES[i].id === state.selectedTrade) {
                  idx = i;
                  break;
                }
              }
            }
            var hz = DORIAN_HZ[idx % DORIAN_HZ.length];
            tone(ctx, hz, hz * 0.996, 'triangle', 0, 0.24, 0.08, 1350);
            tone(ctx, hz * 2, hz * 1.99, 'sine', 0.005, 0.14, 0.03, 1900);
          }
        } catch (err) {}
      },
      destroy: function () {
        try {
          if (audioCtx && typeof audioCtx.close === 'function') {
            audioCtx.close();
          }
        } catch (err) {}
        audioCtx = null;
        masterGain = null;
      }
    };
  }

  function drawUpperBackdrop(ctx, layout, state, t, reducedMotion, parity) {
    var w = layout.w;
    var ySplit = layout.ySplit;
    var skyGrad = ctx.createLinearGradient(0, 0, 0, ySplit);
    skyGrad.addColorStop(0, mixColor('#9db5c4', '#241a0f', parity));
    skyGrad.addColorStop(0.52, mixColor('#dfd0b0', '#5e431f', parity));
    skyGrad.addColorStop(1, mixColor('#f2e2be', '#9f7332', parity));
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, ySplit);

    var sunX = w * 0.18;
    var sunY = Math.max(18, ySplit * 0.22);
    var sunR = clamp(Math.min(w, ySplit) * 0.08, 10, 26);
    var halo = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, sunR * 2.6);
    halo.addColorStop(0, mixColor('#fff7dc', '#f0be59', parity, 0.92));
    halo.addColorStop(1, mixColor('#f2e2be', '#5e431f', parity, 0));
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR * 2.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = mixColor('#c9b591', '#3b2b17', parity, 0.65);
    ctx.beginPath();
    ctx.moveTo(0, ySplit);
    ctx.quadraticCurveTo(w * 0.22, ySplit * 0.56, w * 0.48, ySplit * 0.74);
    ctx.quadraticCurveTo(w * 0.76, ySplit * 0.52, w, ySplit * 0.70);
    ctx.lineTo(w, ySplit);
    ctx.closePath();
    ctx.fill();

    var sway = reducedMotion ? 0 : Math.sin(t * 1.1) * 1.8;
    for (var i = 0; i < layout.bays.length; i++) {
      var bx = layout.bays[i].x + (i % 2 === 0 ? 3 : layout.bays[i].w - 4);
      var cTop = Math.max(8, layout.upperTop - clamp(ySplit * 0.12, 10, 28));
      var cBase = layout.upperTop + 8;
      ctx.fillStyle = mixColor('#354a32', '#261d12', parity);
      ctx.beginPath();
      ctx.moveTo(bx - 4, cBase);
      ctx.quadraticCurveTo(bx - 5 + sway * 0.4, (cTop + cBase) * 0.5, bx + sway, cTop);
      ctx.quadraticCurveTo(bx + 5 + sway * 0.4, (cTop + cBase) * 0.5, bx + 4, cBase);
      ctx.closePath();
      ctx.fill();
    }

    var twW = clamp(layout.shaftW * 0.66, 26, 54);
    var twTop = Math.max(4, layout.upperTop * 0.18);
    var twH = Math.max(18, layout.upperTop - twTop + 8);
    ctx.fillStyle = mixColor('#d9c5a0', '#6d522c', parity);
    ctx.fillRect(layout.shaftCx - twW * 0.5, twTop, twW, twH);
    ctx.strokeStyle = mixColor('#8c7450', '#c89b46', parity);
    ctx.lineWidth = 1.2;
    ctx.strokeRect(layout.shaftCx - twW * 0.5, twTop, twW, twH);

    var dialR = clamp(twW * 0.26, 6, 12);
    var dialY = twTop + Math.min(twH * 0.48, dialR + 6);
    ctx.fillStyle = mixColor('#fbf4e4', '#261b10', parity);
    ctx.beginPath();
    ctx.arc(layout.shaftCx, dialY, dialR, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = mixColor('#5c4930', '#e3b95c', parity);
    ctx.stroke();
    var handAng = parity >= 0.66 ? -Math.PI * 0.5 : (reducedMotion ? 0.65 : t * 1.4);
    ctx.beginPath();
    ctx.moveTo(layout.shaftCx, dialY);
    ctx.lineTo(layout.shaftCx + Math.cos(handAng) * dialR * 0.72, dialY + Math.sin(handAng) * dialR * 0.72);
    ctx.stroke();
  }

  function drawLowerBackdrop(ctx, layout) {
    var grad = ctx.createLinearGradient(0, layout.ySplit, 0, layout.h);
    grad.addColorStop(0, '#2a1e13');
    grad.addColorStop(0.45, '#1d140d');
    grad.addColorStop(1, '#120c08');
    ctx.fillStyle = grad;
    ctx.fillRect(0, layout.ySplit, layout.w, layout.h - layout.ySplit);

    ctx.strokeStyle = 'rgba(138, 102, 56, 0.16)';
    ctx.lineWidth = 1;
    var stepY = Math.max(18, layout.lowerH * 0.18);
    for (var y = layout.lowerTop + stepY; y < layout.h - 6; y += stepY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(layout.shaftLeft, y);
      ctx.moveTo(layout.shaftRight, y);
      ctx.lineTo(layout.w, y);
      ctx.stroke();
    }
  }

  function drawVaultRemodelOrnaments(ctx, cx, archTop, bw, bh, level) {
    if (!level || level <= 0) return;
    var u = clamp(Math.min(bw, bh) * 0.11, 3.5, 9);
    if (level >= 1) {
      var ly = archTop + u * 2.5;
      ctx.strokeStyle = '#d9ae52';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, archTop + 2);
      ctx.lineTo(cx, ly - u * 0.7);
      ctx.stroke();
      var glow = ctx.createRadialGradient(cx, ly, 1, cx, ly, u * 2.8);
      glow.addColorStop(0, 'rgba(246, 204, 104, 0.58)');
      glow.addColorStop(1, 'rgba(246, 204, 104, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, ly, u * 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ebd082';
      ctx.beginPath();
      ctx.arc(cx, ly, u * 0.78, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2b1d10';
      ctx.fillRect(cx - u * 0.42, ly - u * 0.2, u * 0.28, u * 0.28);
      ctx.fillRect(cx + u * 0.14, ly - u * 0.2, u * 0.28, u * 0.28);
    }
    if (level >= 2) {
      var sy = archTop + u * 1.4;
      var span = bw * 0.34;
      ctx.strokeStyle = '#e0b456';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - span, sy + u * 0.5);
      ctx.quadraticCurveTo(cx - span * 0.45, sy + u * 1.6, cx, sy + u * 0.6);
      ctx.quadraticCurveTo(cx + span * 0.45, sy + u * 1.6, cx + span, sy + u * 0.5);
      ctx.stroke();
      ctx.fillStyle = '#d8a642';
      ctx.beginPath();
      ctx.moveTo(cx - span, sy + u * 0.5);
      ctx.lineTo(cx - span - u * 0.9, sy - u * 0.3);
      ctx.lineTo(cx - span - u * 0.9, sy + u * 0.9);
      ctx.closePath();
      ctx.moveTo(cx + span, sy + u * 0.5);
      ctx.lineTo(cx + span + u * 0.9, sy - u * 0.3);
      ctx.lineTo(cx + span + u * 0.9, sy + u * 0.9);
      ctx.closePath();
      ctx.fill();
    }
    if (level >= 3) {
      var dy = archTop + u * 0.65;
      ctx.fillStyle = '#1f160d';
      ctx.beginPath();
      ctx.arc(cx, dy, u * 0.95, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f5d276';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, dy);
      ctx.lineTo(cx, dy + u * 0.68);
      ctx.moveTo(cx - u * 0.5, dy - u * 0.2);
      ctx.lineTo(cx + u * 0.5, dy - u * 0.2);
      ctx.stroke();
    }
  }

  function drawBayArchitecture(ctx, bay, topY, hBay, trade, isLower, isSelected, bayParity, t, reducedMotion) {
    var pad = clamp(bay.w * 0.05, 1.5, 5);
    var bx = bay.x + pad;
    var bw = Math.max(16, bay.w - pad * 2);
    var cx = bx + bw * 0.5;
    var archR = Math.min(bw * 0.48, hBay * 0.34);
    var springY = topY + archR + 6;
    var floorY = topY + hBay;

    ctx.save();
    if (!isLower) {
      ctx.fillStyle = mixColor('#b85b3b', '#5e4321', bayParity);
      ctx.beginPath();
      ctx.moveTo(bx - 1, topY + 6);
      ctx.lineTo(cx, topY);
      ctx.lineTo(bx + bw + 1, topY + 6);
      ctx.closePath();
      ctx.fill();
    }

    ctx.beginPath();
    ctx.moveTo(bx, floorY);
    ctx.lineTo(bx, springY);
    ctx.arc(cx, springY, bw * 0.5, Math.PI, 0, false);
    ctx.lineTo(bx + bw, floorY);
    ctx.closePath();

    if (isLower) {
      var vGrad = ctx.createLinearGradient(0, topY, 0, floorY);
      vGrad.addColorStop(0, '#3d2b19');
      vGrad.addColorStop(0.55, '#2b1e12');
      vGrad.addColorStop(1, '#1e150c');
      ctx.fillStyle = vGrad;
    } else {
      var uGrad = ctx.createLinearGradient(0, topY, 0, floorY);
      uGrad.addColorStop(0, mixColor('#efe3c8', '#3c2b19', bayParity));
      uGrad.addColorStop(1, mixColor('#d7c39e', '#24190f', bayParity));
      ctx.fillStyle = uGrad;
    }
    ctx.fill();

    var flicker = reducedMotion ? 0 : Math.sin(t * 4.2 + bay.index * 1.3) * 0.06;
    if (isLower || bayParity > 0.25) {
      var lampAlpha = (isLower ? 0.34 : bayParity * 0.30) + flicker;
      var lampY = springY - archR * 0.35;
      var cGlow = ctx.createRadialGradient(cx, lampY, 2, cx, lampY, Math.max(bw, hBay) * 0.65);
      cGlow.addColorStop(0, 'rgba(244, 180, 72,' + clamp(lampAlpha, 0.08, 0.48).toFixed(3) + ')');
      cGlow.addColorStop(1, 'rgba(244, 180, 72, 0)');
      ctx.fillStyle = cGlow;
      ctx.fill();
    }

    ctx.lineWidth = isSelected ? 2.4 : 1.2;
    ctx.strokeStyle = isSelected
      ? '#f3c65f'
      : (isLower ? '#7a5930' : mixColor('#9c8662', '#7a5930', bayParity));
    ctx.stroke();

    var ornamentLvl = isLower ? trade.innovatedLevel : trade.copiedAboveLevel;
    drawVaultRemodelOrnaments(ctx, cx, springY - bw * 0.48, bw, hBay, ornamentLvl);

    if (bw >= 54) {
      ctx.fillStyle = isSelected ? '#f7d57e' : (isLower ? '#bda06d' : mixColor('#54432c', '#bda06d', bayParity));
      ctx.font = '600 ' + Math.round(clamp(bw * 0.11, 8, 11)) + 'px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(bw >= 92 ? trade.label : trade.shortLabel, cx, floorY - 4);
    }
    ctx.restore();
    return { bx: bx, bw: bw, cx: cx, topY: topY, springY: springY, floorY: floorY - (bw >= 54 ? 14 : 4) };
  }

  function drawFigure(ctx, x, y, s, skelRatio, tunicHex, armRaise, lean) {
    var k = clamp(skelRatio, 0, 1);
    var headY = y - s * 2.15;
    var neckY = y - s * 1.65;
    var hipY = y - s * 0.78;
    var dx = (lean || 0) * s * 0.35;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.fillStyle = mixColor(tunicHex, '#6e5226', k * 0.82);
    ctx.beginPath();
    ctx.moveTo(x - s * lerp(0.52, 0.34, k) + dx, neckY);
    ctx.lineTo(x + s * lerp(0.52, 0.34, k) + dx, neckY);
    ctx.lineTo(x + s * lerp(0.44, 0.28, k), hipY);
    ctx.lineTo(x - s * lerp(0.44, 0.28, k), hipY);
    ctx.closePath();
    ctx.fill();

    if (k > 0.25) {
      ctx.strokeStyle = mixColor('#cbb07a', '#ebd082', k, k * 0.85);
      ctx.lineWidth = Math.max(1, s * 0.11);
      for (var r = 0; r < 3; r++) {
        var ry = neckY + s * (0.22 + r * 0.22);
        ctx.beginPath();
        ctx.moveTo(x - s * 0.24 + dx * 0.5, ry);
        ctx.lineTo(x + s * 0.24 + dx * 0.5, ry);
        ctx.stroke();
      }
    }

    var limbCol = mixColor('#ecc0a1', '#e4bf67', k);
    ctx.strokeStyle = limbCol;
    ctx.lineWidth = Math.max(1.2, s * lerp(0.22, 0.14, k));
    ctx.beginPath();
    ctx.moveTo(x - s * 0.18, hipY);
    ctx.lineTo(x - s * 0.24, y);
    ctx.moveTo(x + s * 0.18, hipY);
    ctx.lineTo(x + s * 0.24, y);
    ctx.moveTo(x - s * 0.32 + dx, neckY + s * 0.12);
    ctx.lineTo(x - s * 0.68 + dx, neckY - s * (armRaise || 0) * 0.55 + s * 0.25);
    ctx.moveTo(x + s * 0.32 + dx, neckY + s * 0.12);
    ctx.lineTo(x + s * 0.68 + dx, neckY - s * (armRaise || 0) * 0.65 + s * 0.20);
    ctx.stroke();

    ctx.fillStyle = limbCol;
    ctx.beginPath();
    ctx.arc(x + dx, headY, s * lerp(0.42, 0.38, k), 0, Math.PI * 2);
    ctx.fill();

    if (k < 0.6) {
      ctx.fillStyle = 'rgba(218, 108, 92,' + ((1 - k) * 0.65).toFixed(2) + ')';
      ctx.beginPath();
      ctx.arc(x + dx - s * 0.18, headY + s * 0.06, s * 0.11, 0, Math.PI * 2);
      ctx.arc(x + dx + s * 0.18, headY + s * 0.06, s * 0.11, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = mixColor('#3a2a1e', '#1c130a', k);
    var eyeR = s * lerp(0.06, 0.10, k);
    ctx.beginPath();
    ctx.arc(x + dx - s * 0.14, headY - s * 0.05, eyeR, 0, Math.PI * 2);
    ctx.arc(x + dx + s * 0.14, headY - s * 0.05, eyeR, 0, Math.PI * 2);
    ctx.fill();

    if (k >= 0.35) {
      ctx.fillStyle = '#fff5cf';
      ctx.fillRect(x + dx - s * 0.18, headY + s * 0.10, s * 0.36, Math.max(1.2, s * 0.12));
    }
    ctx.restore();
  }

  function drawTradeScene(ctx, box, idx, trade, isLower, bayParity, t, reducedMotion) {
    var skel = isLower ? 1 : bayParity;
    var bh = Math.max(20, box.floorY - box.topY);
    var s = clamp(Math.min(box.bw * 0.145, bh * 0.18), 4.0, 12.5);
    var cx = box.cx;
    var fy = box.floorY;
    var tunic = CIVIC_TUNICS[idx % CIVIC_TUNICS.length];
    var hurry = (!isLower && bayParity < 0.5) ? 0.55 : 0;

    ctx.save();
    if (idx === 0) {
      drawFigure(ctx, cx - s * 1.15, fy, s * 0.92, skel, tunic, 0.7, hurry);
      drawFigure(ctx, cx + s * 1.15, fy, s * 0.92, skel, '#7c4b32', 0.7, -hurry);
      ctx.fillStyle = '#6d3524';
      ctx.fillRect(cx - s * 1.35, fy - s * 1.05, s * 2.7, s * 0.42);
      ctx.fillStyle = '#e9c364';
      ctx.fillRect(cx - s * 1.35, fy - s * 1.08, s * 2.7, s * 0.14);
      ctx.beginPath();
      ctx.arc(cx, fy - s * 1.32, s * 0.34, Math.PI, 0);
      ctx.arc(cx - s * 0.75, fy - s * 1.24, s * 0.16, 0, Math.PI * 2);
      ctx.arc(cx + s * 0.75, fy - s * 1.24, s * 0.16, 0, Math.PI * 2);
      ctx.fill();
    } else if (idx === 1) {
      drawFigure(ctx, cx - s * 0.75, fy, s * 0.95, skel, tunic, 0.9, hurry);
      ctx.strokeStyle = '#eab84b';
      ctx.lineWidth = Math.max(1.4, s * 0.18);
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.4, fy - s * 1.85);
      ctx.lineTo(cx + s * 1.05, fy - s * 2.35);
      ctx.stroke();
      ctx.fillStyle = '#f2c85b';
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.95, fy - s * 2.30);
      ctx.lineTo(cx + s * 1.45, fy - s * 2.68);
      ctx.lineTo(cx + s * 1.38, fy - s * 2.05);
      ctx.closePath();
      ctx.fill();
    } else if (idx === 2) {
      var clkX = cx - s * 0.82;
      ctx.fillStyle = '#4e351e';
      ctx.fillRect(clkX - s * 0.55, fy - s * 2.75, s * 1.1, s * 2.75);
      ctx.strokeStyle = '#d3a64a';
      ctx.lineWidth = 1.1;
      ctx.strokeRect(clkX - s * 0.55, fy - s * 2.75, s * 1.1, s * 2.75);
      ctx.fillStyle = '#f6ecd2';
      ctx.beginPath();
      ctx.arc(clkX, fy - s * 2.2, s * 0.36, 0, Math.PI * 2);
      ctx.fill();
      var stopped = isLower || trade.copiedAboveLevel > 0 || bayParity >= 0.66;
      var swing = stopped ? 0 : (reducedMotion ? 0.30 : Math.sin(t * 4.6) * 0.34);
      ctx.strokeStyle = '#f0c455';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(clkX, fy - s * 1.65);
      ctx.lineTo(clkX + Math.sin(swing) * s * 0.95, fy - s * 1.65 + Math.cos(swing) * s * 0.95);
      ctx.stroke();
      ctx.fillStyle = '#f0c455';
      ctx.beginPath();
      ctx.arc(clkX + Math.sin(swing) * s * 0.95, fy - s * 1.65 + Math.cos(swing) * s * 0.95, s * 0.20, 0, Math.PI * 2);
      ctx.fill();
      drawFigure(ctx, cx + s * 0.95, fy, s * 0.94, skel, tunic, 0.35, hurry);
    } else if (idx === 3) {
      ctx.strokeStyle = '#8b683b';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx - s * 1.0, fy);
      ctx.lineTo(cx - s * 1.0, fy - s * 1.4);
      ctx.moveTo(cx - s * 1.0, fy - s * 0.75);
      ctx.lineTo(cx - s * 0.3, fy - s * 0.75);
      ctx.stroke();
      drawFigure(ctx, cx - s * 0.55, fy, s * 0.86, skel, '#6c4f3d', 0.1, -0.2);
      drawFigure(ctx, cx + s * 0.85, fy, s * 0.95, skel, tunic, 0.75, -0.35);
      ctx.fillStyle = '#fbf7ee';
      ctx.beginPath();
      ctx.arc(cx - s * 0.36, fy - s * 1.82, s * 0.24, 0, Math.PI * 2);
      ctx.fill();
    } else if (idx === 4) {
      drawFigure(ctx, cx - s * 0.55, fy, s * 0.96, skel, tunic, 0.95, hurry * 0.5);
      ctx.strokeStyle = '#b9924b';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.85, fy);
      ctx.lineTo(cx + s * 0.85, fy - s * 1.45);
      ctx.stroke();
      ctx.fillStyle = '#f5ead0';
      ctx.fillRect(cx + s * 0.42, fy - s * 1.78, s * 0.86, s * 0.52);
    } else if (idx === 5) {
      var hop = (!isLower && bayParity < 0.3) ? 0 : (reducedMotion ? s * 0.28 : Math.abs(Math.sin(t * 3.8)) * s * 0.38);
      drawFigure(ctx, cx - s * 0.82, fy - hop, s * 0.90, skel, tunic, 1.05, 0.3);
      drawFigure(ctx, cx + s * 0.82, fy - hop * 0.7, s * 0.90, skel, '#8d4c38', 1.05, -0.3);
    } else if (idx === 6) {
      drawFigure(ctx, cx - s * 0.65, fy, s * 0.94, skel, tunic, 0.55, hurry);
      ctx.fillStyle = '#5c4428';
      ctx.fillRect(cx - s * 1.25, fy - s * 1.05, s * 2.5, s * 1.05);
      ctx.fillStyle = '#f2c654';
      for (var c = 0; c < 3; c++) {
        ctx.fillRect(cx + s * (-0.3 + c * 0.48), fy - s * (1.32 + (c % 2) * 0.22), s * 0.34, s * (0.28 + (c % 2) * 0.22));
      }
    } else {
      ctx.strokeStyle = '#d7ad56';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.2, fy - s * 1.2);
      ctx.lineTo(cx - s * 0.75, fy - s * 2.75);
      ctx.stroke();
      ctx.fillStyle = mixColor('#d97d6c', '#c89b42', skel);
      ctx.beginPath();
      ctx.arc(cx - s * 0.75, fy - s * 2.55, s * 0.85, Math.PI * 1.05, Math.PI * 1.95);
      ctx.fill();
      drawFigure(ctx, cx, fy, s * 0.95, skel, tunic, 0.65, 0);
      ctx.strokeStyle = '#e7d9b9';
      ctx.beginPath();
      ctx.ellipse(cx + s * 0.92, fy - s * 1.85, s * 0.24, s * 0.34, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHorizonAndShaft(ctx, layout, state, t, reducedMotion, parity) {
    var ySplit = layout.ySplit;
    var bh = layout.bandHalf;
    var sL = layout.shaftLeft;
    var sR = layout.shaftRight;
    var sW = layout.shaftW;
    var cx = layout.shaftCx;

    var shaftGrad = ctx.createLinearGradient(sL, 0, sR, 0);
    shaftGrad.addColorStop(0, '#1a130c');
    shaftGrad.addColorStop(0.5, '#2b2015');
    shaftGrad.addColorStop(1, '#18110b');
    ctx.fillStyle = shaftGrad;
    ctx.fillRect(sL, layout.upperTop - 6, sW, layout.h - layout.upperTop + 2);

    ctx.strokeStyle = '#6c512d';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(sL, layout.upperTop - 6, sW, layout.h - layout.upperTop + 2);

    var sconceYs = [ySplit * 0.55, ySplit + (layout.h - ySplit) * 0.36, ySplit + (layout.h - ySplit) * 0.74];
    var flk = reducedMotion ? 1 : (0.88 + Math.sin(t * 7.5) * 0.12);
    for (var si = 0; si < sconceYs.length; si++) {
      var sy = sconceYs[si];
      if (sy < layout.upperTop + 8 || sy > layout.h - 12) continue;
      var rGlow = ctx.createRadialGradient(cx, sy, 1, cx, sy, sW * 0.55 * flk);
      rGlow.addColorStop(0, 'rgba(248, 186, 78, 0.32)');
      rGlow.addColorStop(1, 'rgba(248, 186, 78, 0)');
      ctx.fillStyle = rGlow;
      ctx.fillRect(sL, sy - sW * 0.55, sW, sW * 1.1);
      ctx.fillStyle = '#f5be58';
      ctx.fillRect(sL + 3, sy - 2, 3, 5);
      ctx.fillRect(sR - 6, sy - 2, 3, 5);
    }

    var blockW = clamp(layout.w * 0.035, 18, 42);
    var segments = [[0, sL], [sR, layout.w]];
    for (var seg = 0; seg < 2; seg++) {
      var x0 = segments[seg][0];
      var x1 = segments[seg][1];
      var bGrad = ctx.createLinearGradient(0, ySplit - bh, 0, ySplit + bh);
      bGrad.addColorStop(0, mixColor('#d8c39c', '#9c7940', parity));
      bGrad.addColorStop(0.5, '#8b6b3e');
      bGrad.addColorStop(1, '#47331d');
      ctx.fillStyle = bGrad;
      ctx.fillRect(x0, ySplit - bh, x1 - x0, bh * 2);
      ctx.strokeStyle = '#2e2012';
      ctx.lineWidth = 1;
      ctx.strokeRect(x0, ySplit - bh, x1 - x0, bh * 2);
      for (var bx = x0 + blockW; bx < x1 - 4; bx += blockW) {
        ctx.beginPath();
        ctx.moveTo(bx, ySplit - bh);
        ctx.lineTo(bx, ySplit + bh);
        ctx.stroke();
      }
    }

    var embXs = [sL - 2, sR + 2];
    for (var ei = 0; ei < 2; ei++) {
      var ex = embXs[ei];
      ctx.fillStyle = '#c89c46';
      ctx.beginPath();
      ctx.arc(ex, ySplit, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#25190d';
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ex - 2.5, ySplit - 1.5);
      ctx.lineTo(ex, ySplit - 4);
      ctx.lineTo(ex + 2.5, ySplit - 1.5);
      ctx.moveTo(ex - 2.5, ySplit + 1.5);
      ctx.lineTo(ex, ySplit + 4);
      ctx.lineTo(ex + 2.5, ySplit + 1.5);
      ctx.stroke();
    }

    var windY = layout.upperTop + 6;
    ctx.strokeStyle = '#9c7840';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(sL + 5, windY);
    ctx.lineTo(sR - 5, windY);
    ctx.stroke();
    ctx.fillStyle = '#5a3f20';
    ctx.beginPath();
    ctx.arc(cx, windY, clamp(sW * 0.14, 5, 10), 0, Math.PI * 2);
    ctx.fill();

    var carriage = (state && state.shaftCarriage) || {};
    var depth = clamp(typeof carriage.depth === 'number' ? carriage.depth : 0, 0, 1);
    var cageW = Math.max(26, sW - 12);
    var cageH = clamp(layout.h * 0.105, 38, 62);
    var topStop = windY + 10;
    var botStop = Math.max(topStop + 16, layout.h - cageH - 12);
    var cageY = lerp(topStop, botStop, depth);
    var cageX = cx - cageW * 0.5;

    ctx.strokeStyle = '#b99552';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(cx - cageW * 0.28, windY);
    ctx.lineTo(cx - cageW * 0.28, cageY);
    ctx.moveTo(cx + cageW * 0.28, windY);
    ctx.lineTo(cx + cageW * 0.28, cageY);
    ctx.stroke();

    ctx.fillStyle = 'rgba(20, 14, 9, 0.86)';
    ctx.fillRect(cageX, cageY, cageW, cageH);
    ctx.strokeStyle = '#d4aa53';
    ctx.lineWidth = 1.6;
    ctx.strokeRect(cageX, cageY, cageW, cageH);

    var deadRatio = clamp(state && typeof state.hoodedDeadRatio === 'number' ? state.hoodedDeadRatio : 0, 0, 1);
    var deadBrothers = typeof carriage.deadBrothersAmongHooded === 'number'
      ? carriage.deadBrothersAmongHooded
      : Math.round(deadRatio * 4);
    var count = 4;
    for (var hi = 0; hi < count; hi++) {
      var hx = cageX + cageW * ((hi + 0.5) / count);
      var hy = cageY + cageH * 0.66;
      var hw = Math.max(4.5, cageW * 0.18);
      ctx.fillStyle = '#1d1612';
      ctx.beginPath();
      ctx.moveTo(hx - hw * 0.55, hy + cageH * 0.24);
      ctx.lineTo(hx - hw * 0.45, hy - cageH * 0.22);
      ctx.lineTo(hx, hy - cageH * 0.48);
      ctx.lineTo(hx + hw * 0.45, hy - cageH * 0.22);
      ctx.lineTo(hx + hw * 0.55, hy + cageH * 0.24);
      ctx.closePath();
      ctx.fill();

      var skullGlow = hi < deadBrothers ? 1 : clamp(deadRatio * 4 - hi, 0, 1);
      if (skullGlow > 0.08) {
        ctx.fillStyle = mixColor('#4a3a22', '#f3d274', skullGlow);
        ctx.beginPath();
        ctx.arc(hx, hy - cageH * 0.20, Math.max(2.0, hw * 0.28), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#140d07';
        ctx.fillRect(hx - 1.5, hy - cageH * 0.22, 1, 1);
        ctx.fillRect(hx + 0.6, hy - cageH * 0.22, 1, 1);
      }
    }

    if (carriage.phase === 'ascending') {
      ctx.fillStyle = '#f6e4b3';
      ctx.fillRect(cx - cageW * 0.22, cageY + cageH * 0.70, cageW * 0.44, 6);
      ctx.fillStyle = '#b6432c';
      ctx.beginPath();
      ctx.arc(cx, cageY + cageH * 0.70 + 3, 2.2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#8b6834';
      ctx.fillRect(cageX + 4, cageY + cageH - 7, cageW - 8, 4);
      ctx.fillStyle = '#ecc86c';
      ctx.beginPath();
      ctx.arc(cageX + 9, cageY + cageH - 9, 3.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c8a24d';
      ctx.fillRect(cageX + 12, cageY + cageH - 10, Math.max(6, cageW - 18), 3.2);
    }
  }

  function createNecropolis(canvas, opts) {
    opts = opts || {};
    var ctx = canvas && typeof canvas.getContext === 'function' ? canvas.getContext('2d') : null;
    var synth = createSynth(Boolean(opts.muted));
    var cssW = 0;
    var cssH = 0;
    var dpr = 1;

    function resize() {
      if (!canvas) return;
      dpr = Math.min(global.devicePixelRatio || 1, 2);
      var rect = typeof canvas.getBoundingClientRect === 'function'
        ? canvas.getBoundingClientRect()
        : { width: canvas.width || 800, height: canvas.height || 500 };
      var nextW = Math.max(1, Math.round(rect.width || canvas.clientWidth || canvas.width || 800));
      var nextH = Math.max(1, Math.round(rect.height || canvas.clientHeight || canvas.height || 500));
      cssW = nextW;
      cssH = nextH;
      var targetW = Math.round(cssW * dpr);
      var targetH = Math.round(cssH * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
    }

    function render(state, timeMs, reducedMotion) {
      if (!canvas || !ctx) return;
      var cw = canvas.clientWidth || cssW;
      var ch = canvas.clientHeight || cssH;
      if (!cssW || !cssH || (cw > 0 && Math.abs(cw - cssW) > 1) || (ch > 0 && Math.abs(ch - cssH) > 1)) {
        resize();
      }
      var t = reducedMotion ? 0 : ((typeof timeMs === 'number' ? timeMs : 0) * 0.001);
      var st = state || {};
      var parity = clamp(
        st.whoIsAliveDistinguishable === false
          ? 1
          : (typeof st.twinVisualParity === 'number' ? st.twinVisualParity : 0),
        0,
        1
      );
      var layout = computeLayout(cssW, cssH, st);
      var selectedId = st.selectedTrade || 'banqueters';

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      drawUpperBackdrop(ctx, layout, st, t, Boolean(reducedMotion), parity);
      drawLowerBackdrop(ctx, layout);

      for (var i = 0; i < 8; i++) {
        var trade = resolveTrade(st, i);
        var bay = layout.bays[i];
        var isSel = trade.id === selectedId;
        var localParity = clamp(
          Math.max(parity, trade.copiedAboveLevel > 0 ? Math.min(1, 0.42 + trade.copiedAboveLevel * 0.29) : 0),
          0,
          1
        );
        var uBox = drawBayArchitecture(ctx, bay, layout.upperTop, layout.upperH, trade, false, isSel, localParity, t, Boolean(reducedMotion));
        drawTradeScene(ctx, uBox, i, trade, false, localParity, t, Boolean(reducedMotion));
        var lBox = drawBayArchitecture(ctx, bay, layout.lowerTop, layout.lowerH, trade, true, isSel, 1, t, Boolean(reducedMotion));
        drawTradeScene(ctx, lBox, i, trade, true, 1, t, Boolean(reducedMotion));
      }

      drawHorizonAndShaft(ctx, layout, st, t, Boolean(reducedMotion), parity);
      ctx.restore();
    }

    function hitTest(clientX, clientY, state) {
      if (!canvas || typeof canvas.getBoundingClientRect !== 'function') {
        return { zone: 'lower_bay', tradeId: 'banqueters', bayIndex: 0 };
      }
      var rect = canvas.getBoundingClientRect();
      var w = Math.max(1, rect.width || cssW || 800);
      var h = Math.max(1, rect.height || cssH || 500);
      var lx = clientX - rect.left;
      var ly = clientY - rect.top;
      var layout = computeLayout(w, h, state || {});

      if (Math.abs(ly - layout.ySplit) <= 14) {
        return { zone: 'horizon', tradeId: null, bayIndex: -1 };
      }
      if (lx >= layout.shaftLeft && lx <= layout.shaftRight) {
        return { zone: 'shaft', tradeId: null, bayIndex: -1 };
      }
      var bayIdx = 0;
      if (lx < layout.shaftLeft) {
        var leftSpan = Math.max(1, layout.shaftLeft - layout.bays[0].x);
        bayIdx = clamp(Math.floor((lx - layout.bays[0].x) / (leftSpan / 4)), 0, 3);
      } else {
        var rightStart = layout.bays[4].x;
        var rightSpan = Math.max(1, (layout.bays[7].x + layout.bays[7].w) - rightStart);
        bayIdx = 4 + clamp(Math.floor((lx - rightStart) / (rightSpan / 4)), 0, 3);
      }
      var trade = resolveTrade(state || {}, bayIdx);
      return {
        zone: ly < layout.ySplit ? 'upper_bay' : 'lower_bay',
        tradeId: trade.id,
        bayIndex: bayIdx
      };
    }

    if (global.addEventListener) {
      global.addEventListener('resize', resize);
    }
    resize();

    return {
      render: render,
      hitTest: hitTest,
      setMuted: function (b) { return synth.setMuted(b); },
      isMuted: function () { return synth.isMuted(); },
      toggleMute: function () { return synth.toggleMute(); },
      playCue: function (kind, state) { synth.playCue(kind, state); },
      resize: resize,
      destroy: function () {
        if (global.addEventListener && global.removeEventListener) {
          global.removeEventListener('resize', resize);
        }
        synth.destroy();
      }
    };
  }

  global.EusapiaSubterraneanNecropolis = {
    TRADES: CANONICAL_TRADES,
    create: createNecropolis
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
