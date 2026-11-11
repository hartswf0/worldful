(function () {
  'use strict';

  const PALETTE = {
    alabaster: '#f3efe4',
    limestone: '#d9d0be',
    limestoneShade: '#b8ad98',
    limestoneDeep: '#8c816d',
    saffron: '#d49b4b',
    jade: '#2d7a6d',
    jadeDeep: '#153d36',
    jadeMist: '#7fc4b5',
    amber: '#f2b652',
    soot: '#181a1d',
    tallow: '#322f2a',
    slag: '#b84a27',
    steel: '#6e7b85'
  };

  const NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

  const STONES = [
    {
      index: 0,
      u: 0.18,
      v: 0.31,
      graceId: 'filigree_palaces_mullions',
      graceTitle: 'Filigree Palaces & Fringed Cushions',
      graceSpeech: 'Alabaster traceried mullions lined with saffron silk-fringed cushions catching the patio breeze.'
    },
    {
      index: 1,
      u: 0.45,
      v: 0.35,
      graceId: 'white_peacock_lawn',
      graceTitle: 'White Peacock & Spinning Sprinklers',
      graceSpeech: 'Beyond the patio screen, whirling brass sprinklers mist an emerald lawn where a white peacock spreads its ocellated tail.'
    },
    {
      index: 2,
      u: 0.22,
      v: 0.68,
      graceId: 'white_leather_saddlers',
      graceTitle: 'Supple White-Leather Saddlers',
      graceSpeech: 'Fragrant saddleries stitching kid-supple cream-white harnesses, bridles, and gleaming brass buckles.'
    },
    {
      index: 3,
      u: 0.52,
      v: 0.69,
      graceId: 'raffia_rug_weavers',
      graceTitle: 'Chattering Raffia-Rug Weavers',
      graceSpeech: 'Nimble women seated in a sunlit circle, chattering briskly while weaving geometric raffia rugs.'
    },
    {
      index: 4,
      u: 0.77,
      v: 0.32,
      graceId: 'hanging_canals_millwheels',
      graceTitle: 'Hanging Canals & Mill Wheels',
      graceSpeech: 'Elevated stone aqueduct cascades turning timber-and-bronze overshot mill paddles above foam.'
    },
    {
      index: 5,
      u: 0.81,
      v: 0.71,
      graceId: 'estuary_lantern_canoes',
      graceTitle: 'Green Estuary Bow-Lantern Canoes',
      graceSpeech: 'Breeze-brushed jade estuary at night lit by slow-stroked canoes carrying warm amber lanterns at the bow.'
    }
  ];

  function clampLocus(locusIndex) {
    const n = Number(locusIndex);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(STONES.length - 1, Math.floor(n)));
  }

  function createFiligreeState() {
    return {
      activeLocus: 0,
      discourseMode: 'filigree',
      utteranceCounts: [0, 0, 0, 0, 0, 0],
      totalGraceUtterances: 0,
      prismAperture: 0.38,
      pointerU: 0.45,
      pointerV: 0.35,
      time: 0,
      reducedMotion: false
    };
  }

  function setActiveLocus(state, locusIndex) {
    if (!state) return 0;
    const idx = clampLocus(locusIndex);
    state.activeLocus = idx;
    return idx;
  }

  function utterGrace(state, locusIndex) {
    const idx = clampLocus(locusIndex);
    if (!state) {
      return {
        locusIndex: idx,
        stone: STONES[idx],
        countForLocus: 0,
        totalGraceUtterances: 0,
        spokenLociCount: 0
      };
    }
    if (!Array.isArray(state.utteranceCounts) || state.utteranceCounts.length < 6) {
      state.utteranceCounts = [0, 0, 0, 0, 0, 0];
    }
    state.activeLocus = idx;
    if (state.discourseMode === 'filigree') {
      state.utteranceCounts[idx] = (state.utteranceCounts[idx] || 0) + 1;
      state.totalGraceUtterances = (state.totalGraceUtterances || 0) + 1;
    }
    const spokenLociCount = state.utteranceCounts.filter(function (c) { return c > 0; }).length;
    return {
      locusIndex: idx,
      stone: STONES[idx],
      countForLocus: state.utteranceCounts[idx],
      totalGraceUtterances: state.totalGraceUtterances,
      spokenLociCount: spokenLociCount
    };
  }

  function stepFiligree(state, dt) {
    if (!state) return 0;
    const delta = Number.isFinite(dt) ? Math.max(0, dt) : 0;
    if (!state.reducedMotion) {
      state.time = (state.time || 0) + delta;
    }
    return state.time;
  }

  function computeGraceMetrics(state) {
    const counts = (state && Array.isArray(state.utteranceCounts)) ? state.utteranceCounts : [0, 0, 0, 0, 0, 0];
    const spokenLociCount = counts.filter(function (c) { return c > 0; }).length;
    const total = (state && Number.isFinite(state.totalGraceUtterances))
      ? state.totalGraceUtterances
      : counts.reduce(function (acc, c) { return acc + (c || 0); }, 0);
    const mode = (state && state.discourseMode) ? state.discourseMode : 'filigree';

    if (mode === 'literal_bleak') {
      return {
        spokenLociCount: spokenLociCount,
        graceEloquence: 0.08,
        peacockSpreadRatio: 0,
        sprinklerJetCount: 0,
        millWheelRpm: 4,
        estuaryCanoeCount: 0,
        raffiaWeaverCount: 0,
        whiteHarnessCount: 0,
        mullionArchCount: 6
      };
    }

    const rawProg = Math.min(1, spokenLociCount * 0.12 + total * 0.047);
    const peacockProg = Math.min(1, rawProg + (counts[1] > 0 ? 0.06 : 0));
    return {
      spokenLociCount: spokenLociCount,
      graceEloquence: +(0.42 + 0.58 * rawProg).toFixed(4),
      peacockSpreadRatio: +(0.35 + 0.65 * peacockProg).toFixed(4),
      sprinklerJetCount: 12,
      millWheelRpm: 24,
      estuaryCanoeCount: 5,
      raffiaWeaverCount: 7,
      whiteHarnessCount: 6,
      mullionArchCount: 6
    };
  }

  function linearGrad(ctx, x0, y0, x1, y1, stops) {
    if (typeof ctx.createLinearGradient !== 'function') {
      return stops[stops.length - 1][1];
    }
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    for (let i = 0; i < stops.length; i++) {
      g.addColorStop(stops[i][0], stops[i][1]);
    }
    return g;
  }

  function radialGrad(ctx, x0, y0, r0, x1, y1, r1, stops) {
    if (typeof ctx.createRadialGradient !== 'function') {
      return stops[0][1];
    }
    const g = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    for (let i = 0; i < stops.length; i++) {
      g.addColorStop(stops[i][0], stops[i][1]);
    }
    return g;
  }

  function ellipsePath(ctx, x, y, rx, ry, rot) {
    const rX = Math.max(0.5, rx);
    const rY = Math.max(0.5, ry);
    if (typeof ctx.ellipse === 'function') {
      ctx.ellipse(x, y, rX, rY, rot || 0, 0, Math.PI * 2);
    } else {
      ctx.save();
      ctx.translate(x, y);
      if (rot) ctx.rotate(rot);
      ctx.scale(rX, rY);
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.restore();
    }
  }

  function setDash(ctx, pattern) {
    if (typeof ctx.setLineDash === 'function') {
      ctx.setLineDash(pattern);
    }
  }

  function renderBleakSchematic(ctx, width, height, state, t) {
    ctx.fillStyle = linearGrad(ctx, 0, 0, 0, height, [
      [0, '#4a4d52'],
      [0.55, '#414449'],
      [1, '#373a3f']
    ]);
    ctx.fillRect(0, 0, width, height);

    const step = Math.max(22, Math.round(Math.min(width, height) * 0.055));
    ctx.strokeStyle = 'rgba(196, 201, 208, 0.13)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = step; x < width; x += step) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = step; y < height; y += step) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    const boxW = Math.min(width * 0.18, height * 0.20);
    const boxH = boxW * 0.66;
    for (let i = 0; i < STONES.length; i++) {
      const st = STONES[i];
      const cx = st.u * width;
      const cy = st.v * height;
      ctx.fillStyle = 'rgba(46, 49, 54, 0.82)';
      ctx.fillRect(cx - boxW * 0.5, cy - boxH * 0.5, boxW, boxH);
      setDash(ctx, [4, 4]);
      ctx.strokeStyle = i === (state && state.activeLocus) ? 'rgba(215, 220, 226, 0.62)' : 'rgba(168, 173, 180, 0.36)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(cx - boxW * 0.5, cy - boxH * 0.5, boxW, boxH);
      setDash(ctx, []);

      ctx.strokeStyle = 'rgba(140, 145, 152, 0.28)';
      ctx.beginPath();
      ctx.moveTo(cx - boxW * 0.5, cy - boxH * 0.5);
      ctx.lineTo(cx + boxW * 0.5, cy + boxH * 0.5);
      ctx.moveTo(cx + boxW * 0.5, cy - boxH * 0.5);
      ctx.lineTo(cx - boxW * 0.5, cy + boxH * 0.5);
      ctx.stroke();

      if (i === 4) {
        const ang = t * (4 / 60) * Math.PI * 2;
        const r = boxH * 0.32;
        ctx.strokeStyle = 'rgba(165, 171, 178, 0.45)';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.moveTo(cx - Math.cos(ang) * r, cy - Math.sin(ang) * r);
        ctx.lineTo(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
        ctx.stroke();
      }
    }
  }

  function renderPanoramaBackdrop(ctx, width, height, sootLvl) {
    const haze = Math.max(0, Math.min(1, sootLvl || 0)) * 0.16;
    ctx.fillStyle = linearGrad(ctx, 0, 0, width, height * 0.54, [
      [0, PALETTE.alabaster],
      [0.52, '#e8dec8'],
      [0.78, '#b9c5bc'],
      [1, '#2b5952']
    ]);
    ctx.fillRect(0, 0, width, height * 0.55);

    if (haze > 0.01) {
      ctx.fillStyle = 'rgba(42, 40, 36, ' + haze.toFixed(3) + ')';
      ctx.fillRect(0, 0, width, height * 0.50);
    }

    ctx.fillStyle = '#dfd4be';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.47);
    for (let k = 0; k <= 10; k++) {
      const x = (k / 10) * width;
      const dome = (k % 2 === 0) ? height * 0.045 : height * 0.018;
      ctx.lineTo(x, height * 0.42 - dome);
    }
    ctx.lineTo(width, height * 0.48);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = linearGrad(ctx, 0, height * 0.27, 0, height * 0.53, [
      [0, '#327860'],
      [0.6, '#27634e'],
      [1, '#1e4f3e']
    ]);
    ctx.fillRect(0, height * 0.30, width * 0.68, height * 0.22);

    ctx.fillStyle = linearGrad(ctx, 0, height * 0.50, 0, height, [
      [0, '#d8ccb6'],
      [0.55, '#c7b89d'],
      [1, '#b2a184']
    ]);
    ctx.fillRect(0, height * 0.50, width, height * 0.50);

    ctx.strokeStyle = 'rgba(130, 115, 92, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let r = 1; r <= 5; r++) {
      const py = height * (0.50 + r * 0.09);
      ctx.moveTo(0, py);
      ctx.lineTo(width * 0.68, py);
    }
    ctx.stroke();

    ctx.fillStyle = linearGrad(ctx, width * 0.63, height * 0.48, width, height, [
      [0, '#1c534a'],
      [0.45, PALETTE.jade],
      [1, PALETTE.jadeDeep]
    ]);
    ctx.beginPath();
    ctx.moveTo(width * 0.66, height * 0.48);
    ctx.lineTo(width, height * 0.45);
    ctx.lineTo(width, height);
    ctx.lineTo(width * 0.62, height);
    ctx.quadraticCurveTo(width * 0.67, height * 0.72, width * 0.66, height * 0.48);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = PALETTE.limestone;
    ctx.lineWidth = Math.max(2.5, width * 0.004);
    ctx.beginPath();
    ctx.moveTo(width * 0.66, height * 0.48);
    ctx.quadraticCurveTo(width * 0.67, height * 0.72, width * 0.62, height);
    ctx.stroke();
  }

  function drawStone0Palaces(ctx, cx, cy, unit, t, boosted) {
    const pw = unit * 0.96;
    const ph = unit * 0.68;
    const left = cx - pw * 0.5;
    const top = cy - ph * 0.52;

    ctx.fillStyle = PALETTE.alabaster;
    ctx.strokeStyle = PALETTE.limestoneShade;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.rect(left, top, pw, ph);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = PALETTE.limestone;
    for (let c = 0; c < 9; c++) {
      const mx = left + (c + 0.5) * (pw / 9);
      ctx.beginPath();
      ctx.moveTo(mx - pw * 0.04, top);
      ctx.lineTo(mx, top - ph * 0.11);
      ctx.lineTo(mx + pw * 0.04, top);
      ctx.closePath();
      ctx.fill();
    }

    for (let k = -1; k <= 1; k++) {
      const wx = cx + k * pw * 0.30;
      const wy = cy - ph * 0.02;
      const ww = pw * 0.21;
      const wh = ph * 0.52;

      ctx.fillStyle = '#2a3338';
      ctx.beginPath();
      ctx.moveTo(wx - ww * 0.5, wy + wh * 0.42);
      ctx.lineTo(wx - ww * 0.5, wy - wh * 0.12);
      ctx.quadraticCurveTo(wx, wy - wh * 0.56, wx + ww * 0.5, wy - wh * 0.12);
      ctx.lineTo(wx + ww * 0.5, wy + wh * 0.42);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = PALETTE.alabaster;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(wx, wy - wh * 0.18, ww * 0.22, 0, Math.PI * 2);
      ctx.moveTo(wx, wy - wh * 0.40);
      ctx.lineTo(wx, wy + wh * 0.40);
      ctx.stroke();

      const sillY = wy + wh * 0.40;
      ctx.fillStyle = boosted ? PALETTE.amber : PALETTE.saffron;
      ctx.beginPath();
      ellipsePath(ctx, wx, sillY, ww * 0.56, wh * 0.13, 0);
      ctx.fill();

      ctx.strokeStyle = PALETTE.amber;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      for (let f = -2; f <= 2; f++) {
        const fx = wx + f * ww * 0.19;
        const sway = Math.sin(t * 2.3 + k * 0.9 + f * 0.5) * ww * 0.10;
        ctx.moveTo(fx, sillY + wh * 0.08);
        ctx.quadraticCurveTo(fx + sway * 0.6, sillY + wh * 0.22, fx + sway, sillY + wh * 0.34);
      }
      ctx.stroke();
    }
  }

  function drawStone1PeacockLawn(ctx, cx, cy, unit, t, metrics) {
    ctx.fillStyle = radialGrad(ctx, cx, cy + unit * 0.10, unit * 0.05, cx, cy + unit * 0.10, unit * 0.58, [
      [0, '#3d9878'],
      [0.7, '#2a6f57'],
      [1, '#1f5442']
    ]);
    ctx.beginPath();
    ellipsePath(ctx, cx, cy + unit * 0.14, unit * 0.58, unit * 0.24, 0);
    ctx.fill();
    ctx.strokeStyle = PALETTE.alabaster;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    const jetCount = metrics.sprinklerJetCount || 12;
    for (let j = 0; j < jetCount; j++) {
      const side = j < 6 ? -1 : 1;
      const sx = cx + side * unit * 0.43;
      const sy = cy + unit * 0.16;
      const idx = j % 6;
      const phase = (t * 1.9 + idx * (Math.PI / 3)) % (Math.PI * 2);
      const reach = (0.14 + 0.11 * Math.sin(phase)) * unit * (idx % 2 === 0 ? 1 : -0.85);
      ctx.strokeStyle = 'rgba(225, 246, 240, 0.68)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(sx, sy - unit * 0.05);
      ctx.quadraticCurveTo(sx + reach * 0.55, sy - unit * 0.24, sx + reach, sy + unit * 0.02);
      ctx.stroke();
    }
    ctx.fillStyle = PALETTE.amber;
    ctx.fillRect(cx - unit * 0.445, cy + unit * 0.10, unit * 0.03, unit * 0.08);
    ctx.fillRect(cx + unit * 0.415, cy + unit * 0.10, unit * 0.03, unit * 0.08);

    const spread = (0.36 + 0.64 * (metrics.peacockSpreadRatio || 0.35)) * Math.PI * 0.94;
    const baseY = cy + unit * 0.11;
    const plumeLen = unit * (0.34 + 0.14 * (metrics.peacockSpreadRatio || 0.35));
    for (let p = 0; p < 19; p++) {
      const frac = (p / 18) - 0.5;
      const ang = -Math.PI * 0.5 + frac * spread + Math.sin(t * 1.4 + p * 0.3) * 0.012;
      const tx = cx + Math.cos(ang) * plumeLen;
      const ty = baseY + Math.sin(ang) * plumeLen;

      ctx.strokeStyle = 'rgba(243, 239, 228, 0.92)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(cx, baseY);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      ctx.fillStyle = PALETTE.alabaster;
      ctx.beginPath();
      ellipsePath(ctx, tx, ty, unit * 0.028, unit * 0.018, ang);
      ctx.fill();

      ctx.fillStyle = PALETTE.jade;
      ctx.beginPath();
      ctx.arc(tx, ty, unit * 0.012, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PALETTE.amber;
      ctx.beginPath();
      ctx.arc(tx, ty, unit * 0.0055, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ellipsePath(ctx, cx, baseY + unit * 0.02, unit * 0.055, unit * 0.085, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, baseY - unit * 0.09, unit * 0.026, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = PALETTE.amber;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let cr = -1; cr <= 1; cr++) {
      ctx.moveTo(cx, baseY - unit * 0.11);
      ctx.lineTo(cx + cr * unit * 0.022, baseY - unit * 0.155);
    }
    ctx.stroke();
  }

  function drawStone2Saddlers(ctx, cx, cy, unit, t) {
    const vw = unit * 0.88;
    const vh = unit * 0.62;
    ctx.fillStyle = '#3d3126';
    ctx.strokeStyle = PALETTE.limestone;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - vw * 0.5, cy + vh * 0.45);
    ctx.lineTo(cx - vw * 0.5, cy - vh * 0.08);
    ctx.quadraticCurveTo(cx, cy - vh * 0.62, cx + vw * 0.5, cy - vh * 0.08);
    ctx.lineTo(cx + vw * 0.5, cy + vh * 0.45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const barY = cy - vh * 0.14;
    ctx.strokeStyle = PALETTE.saffron;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(cx - vw * 0.40, barY);
    ctx.lineTo(cx + vw * 0.40, barY);
    ctx.stroke();

    for (let h = 0; h < 6; h++) {
      const hx = cx + ((h / 5) - 0.5) * vw * 0.70;
      const sway = Math.sin(t * 1.5 + h * 0.8) * unit * 0.012;
      ctx.strokeStyle = PALETTE.alabaster;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(hx, barY);
      ctx.quadraticCurveTo(hx + sway - unit * 0.03, barY + vh * 0.24, hx + sway, barY + vh * 0.42);
      ctx.quadraticCurveTo(hx + sway + unit * 0.03, barY + vh * 0.24, hx, barY);
      ctx.stroke();

      ctx.fillStyle = PALETTE.amber;
      ctx.beginPath();
      ctx.arc(hx + sway * 0.5, barY + vh * 0.21, unit * 0.016, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = PALETTE.alabaster;
    ctx.beginPath();
    ctx.moveTo(cx - vw * 0.18, cy + vh * 0.36);
    ctx.quadraticCurveTo(cx, cy + vh * 0.18, cx + vw * 0.18, cy + vh * 0.36);
    ctx.lineTo(cx + vw * 0.12, cy + vh * 0.46);
    ctx.lineTo(cx - vw * 0.12, cy + vh * 0.46);
    ctx.closePath();
    ctx.fill();
  }

  function drawStone3RaffiaWeavers(ctx, cx, cy, unit, t) {
    const rugR = unit * 0.23;
    ctx.fillStyle = PALETTE.alabaster;
    ctx.beginPath();
    ctx.arc(cx, cy, rugR, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = PALETTE.saffron;
    ctx.lineWidth = Math.max(2, rugR * 0.18);
    ctx.beginPath();
    ctx.arc(cx, cy, rugR * 0.74, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = PALETTE.jade;
    ctx.lineWidth = Math.max(1.6, rugR * 0.14);
    ctx.beginPath();
    for (let d = 0; d < 8; d++) {
      const a = (d / 8) * Math.PI * 2;
      const r = (d % 2 === 0) ? rugR * 0.54 : rugR * 0.26;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * r;
      if (d === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    const orbitR = unit * 0.36;
    const robeColors = [PALETTE.saffron, PALETTE.alabaster, PALETTE.jade, PALETTE.amber, PALETTE.alabaster, PALETTE.saffron, PALETTE.jade];
    for (let w = 0; w < 7; w++) {
      const ang = (w / 7) * Math.PI * 2 - Math.PI * 0.5;
      const wx = cx + Math.cos(ang) * orbitR;
      const wy = cy + Math.sin(ang) * orbitR * 0.86;
      const shuttle = Math.sin(t * 4.8 + w * 1.15) * unit * 0.025;

      ctx.strokeStyle = 'rgba(243, 239, 228, 0.65)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(wx, wy);
      ctx.lineTo(cx + Math.cos(ang) * (rugR * 0.72) + shuttle, cy + Math.sin(ang) * (rugR * 0.62));
      ctx.stroke();

      ctx.fillStyle = robeColors[w];
      ctx.beginPath();
      ellipsePath(ctx, wx, wy, unit * 0.052, unit * 0.038, ang);
      ctx.fill();

      ctx.fillStyle = '#5a3e2b';
      ctx.beginPath();
      ctx.arc(wx, wy - unit * 0.012, unit * 0.024, 0, Math.PI * 2);
      ctx.fill();

      const chatPulse = 0.5 + 0.5 * Math.sin(t * 5.6 + w * 1.7);
      ctx.strokeStyle = 'rgba(242, 182, 82, ' + (0.35 + 0.45 * chatPulse).toFixed(2) + ')';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(wx, wy - unit * 0.048, unit * (0.025 + 0.012 * chatPulse), Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    }
  }

  function drawStone4CanalsMill(ctx, cx, cy, unit, t, metrics) {
    const flumeY = cy - unit * 0.34;
    const flumeLeft = cx - unit * 0.56;
    const flumeRight = cx + unit * 0.04;

    ctx.fillStyle = PALETTE.limestone;
    ctx.fillRect(flumeLeft, flumeY, flumeRight - flumeLeft, unit * 0.09);
    for (let a = 0; a < 3; a++) {
      const ax = flumeLeft + (a + 0.5) * ((flumeRight - flumeLeft) / 3);
      ctx.fillRect(ax - unit * 0.03, flumeY + unit * 0.09, unit * 0.06, unit * 0.28);
    }
    ctx.fillStyle = '#63c6b3';
    ctx.fillRect(flumeLeft, flumeY - unit * 0.025, flumeRight - flumeLeft + unit * 0.03, unit * 0.03);

    const wheelR = unit * 0.27;
    ctx.strokeStyle = 'rgba(155, 228, 214, 0.82)';
    ctx.lineWidth = Math.max(2.5, unit * 0.045);
    ctx.beginPath();
    ctx.moveTo(flumeRight, flumeY);
    ctx.quadraticCurveTo(cx + wheelR * 0.72, cy - wheelR * 0.65, cx + wheelR * 0.82, cy + wheelR * 0.92);
    ctx.stroke();

    const rpm = metrics.millWheelRpm || 24;
    const spin = t * (rpm / 60) * Math.PI * 2;
    ctx.strokeStyle = '#8b5e34';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx, cy, wheelR, 0, Math.PI * 2);
    ctx.arc(cx, cy, wheelR * 0.74, 0, Math.PI * 2);
    ctx.stroke();

    for (let p = 0; p < 12; p++) {
      const ang = spin + (p / 12) * Math.PI * 2;
      const x1 = cx + Math.cos(ang) * (wheelR * 0.72);
      const y1 = cy + Math.sin(ang) * (wheelR * 0.72);
      const x2 = cx + Math.cos(ang + 0.12) * (wheelR * 1.04);
      const y2 = cy + Math.sin(ang + 0.12) * (wheelR * 1.04);
      ctx.strokeStyle = PALETTE.saffron;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.fillStyle = PALETTE.amber;
    ctx.beginPath();
    ctx.arc(cx, cy, unit * 0.042, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(243, 239, 228, 0.84)';
    for (let f = 0; f < 5; f++) {
      const fx = cx - wheelR * 0.4 + f * wheelR * 0.32;
      const fy = cy + wheelR * 0.96 + Math.sin(t * 4.2 + f) * unit * 0.015;
      ctx.beginPath();
      ctx.arc(fx, fy, unit * (0.028 + (f % 2) * 0.012), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawStone5EstuaryCanoes(ctx, cx, cy, unit, t) {
    const offsets = [
      [-0.30, -0.18],
      [0.18, -0.22],
      [-0.08, -0.02],
      [-0.26, 0.20],
      [0.22, 0.18]
    ];

    ctx.strokeStyle = 'rgba(127, 196, 181, 0.28)';
    ctx.lineWidth = 1;
    for (let r = -2; r <= 2; r++) {
      const ry = cy + r * unit * 0.11;
      ctx.beginPath();
      ctx.moveTo(cx - unit * 0.46, ry);
      ctx.quadraticCurveTo(cx, ry + Math.sin(t * 1.3 + r) * unit * 0.02, cx + unit * 0.46, ry);
      ctx.stroke();
    }

    for (let c = 0; c < 5; c++) {
      const drift = Math.sin(t * 0.8 + c * 1.4) * unit * 0.026;
      const bx = cx + offsets[c][0] * unit + drift;
      const by = cy + offsets[c][1] * unit;
      const cw = unit * 0.22;
      const bowX = bx + cw * 0.52;
      const bowY = by - unit * 0.028;

      ctx.strokeStyle = 'rgba(242, 182, 82, 0.58)';
      ctx.lineWidth = 1.6;
      for (let gl = 1; gl <= 4; gl++) {
        const gw = unit * (0.032 - gl * 0.005);
        const gy = bowY + unit * 0.03 + gl * unit * 0.022;
        ctx.beginPath();
        ctx.moveTo(bowX - gw, gy);
        ctx.lineTo(bowX + gw, gy);
        ctx.stroke();
      }

      ctx.fillStyle = radialGrad(ctx, bowX, bowY, 1, bowX, bowY, unit * 0.085, [
        [0, 'rgba(242, 182, 82, 0.92)'],
        [0.45, 'rgba(212, 155, 75, 0.35)'],
        [1, 'rgba(242, 182, 82, 0)']
      ]);
      ctx.beginPath();
      ctx.arc(bowX, bowY, unit * 0.085, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#1e2f2b';
      ctx.strokeStyle = PALETTE.jadeMist;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(bx - cw * 0.5, by - unit * 0.018);
      ctx.quadraticCurveTo(bx, by + unit * 0.038, bowX, bowY);
      ctx.quadraticCurveTo(bx, by + unit * 0.012, bx - cw * 0.5, by - unit * 0.018);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const oarSwing = Math.sin(t * 1.7 + c) * unit * 0.03;
      ctx.strokeStyle = PALETTE.limestone;
      ctx.beginPath();
      ctx.moveTo(bx - cw * 0.08, by - unit * 0.03);
      ctx.lineTo(bx - cw * 0.14 + oarSwing, by + unit * 0.055);
      ctx.stroke();

      ctx.fillStyle = PALETTE.amber;
      ctx.beginPath();
      ctx.arc(bowX, bowY - unit * 0.008, unit * 0.016, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function renderFiligreeScreen(ctx, width, height, state, disclosureMetrics) {
    if (!ctx || !(width > 0) || !(height > 0)) return;
    const st = state || createFiligreeState();
    const t = st.reducedMotion ? 0 : (st.time || 0);
    const metrics = computeGraceMetrics(st);
    const sootLvl = (disclosureMetrics && Number.isFinite(disclosureMetrics.sootDisclosure))
      ? disclosureMetrics.sootDisclosure
      : 0;

    ctx.save();
    try {
      if (st.discourseMode === 'literal_bleak') {
        renderBleakSchematic(ctx, width, height, st, t);
        return;
      }

      renderPanoramaBackdrop(ctx, width, height, sootLvl);
      const unit = Math.min(width * 0.23, height * 0.25);
      const counts = Array.isArray(st.utteranceCounts) ? st.utteranceCounts : [0, 0, 0, 0, 0, 0];

      drawStone0Palaces(ctx, STONES[0].u * width, STONES[0].v * height, unit, t, counts[0] > 0);
      drawStone1PeacockLawn(ctx, STONES[1].u * width, STONES[1].v * height, unit, t, metrics);
      drawStone2Saddlers(ctx, STONES[2].u * width, STONES[2].v * height, unit, t);
      drawStone3RaffiaWeavers(ctx, STONES[3].u * width, STONES[3].v * height, unit, t);
      drawStone4CanalsMill(ctx, STONES[4].u * width, STONES[4].v * height, unit, t, metrics);
      drawStone5EstuaryCanoes(ctx, STONES[5].u * width, STONES[5].v * height, unit, t);
    } finally {
      ctx.restore();
    }
  }

  function renderMullionMask(ctx, width, height, state, disclosureMetrics) {
    if (!ctx || !(width > 0) || !(height > 0)) return;
    const st = state || createFiligreeState();
    const t = st.reducedMotion ? 0 : (st.time || 0);
    const bleak = st.discourseMode === 'literal_bleak';
    const grease = Math.max(0, Math.min(1, (disclosureMetrics && Number(disclosureMetrics.greaseCrustDepth)) || 0));

    ctx.save();
    try {
      const piers = [width * 0.014, width * 0.335, width * 0.655, width * 0.986];
      const pierW = Math.max(6, width * 0.013);
      const springY = height * 0.142;
      const stoneFill = bleak ? '#7c8086' : PALETTE.limestone;
      const stoneHi = bleak ? '#9ba0a6' : PALETTE.alabaster;

      ctx.fillStyle = linearGrad(ctx, 0, 0, 0, springY, [
        [0, stoneFill],
        [0.65, stoneHi],
        [1, PALETTE.limestoneShade]
      ]);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, springY);
      ctx.lineTo(piers[3], springY);

      for (let b = 2; b >= 0; b--) {
        const xR = piers[b + 1];
        const xL = piers[b];
        const mid = (xL + xR) * 0.5;
        const qR = (mid + xR) * 0.5;
        const qL = (xL + mid) * 0.5;
        ctx.quadraticCurveTo(qR, height * 0.018, mid, height * 0.128);
        ctx.quadraticCurveTo(qL, height * 0.018, xL, springY);
      }
      ctx.lineTo(0, springY);
      ctx.closePath();

      for (let b = 0; b < 3; b++) {
        const mid = (piers[b] + piers[b + 1]) * 0.5;
        const oy = height * 0.048;
        const orad = Math.min(width, height) * 0.020;
        ctx.moveTo(mid + orad, oy);
        ctx.arc(mid, oy, orad, 0, Math.PI * 2, true);
      }
      ctx.fill('evenodd');

      ctx.strokeStyle = PALETTE.limestoneDeep;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      for (let p = 0; p < piers.length; p++) {
        const px = piers[p] - pierW * 0.5;
        ctx.fillStyle = stoneFill;
        ctx.fillRect(px, springY * 0.85, pierW, height - springY * 0.85);
        ctx.fillStyle = stoneHi;
        ctx.fillRect(px + pierW * 0.25, springY, pierW * 0.28, height - springY);
        ctx.fillStyle = PALETTE.limestoneShade;
        ctx.fillRect(px - pierW * 0.28, springY - height * 0.014, pierW * 1.56, height * 0.020);
      }

      ctx.fillStyle = stoneFill;
      ctx.fillRect(0, height * 0.972, width, height * 0.028);
      ctx.strokeStyle = 'rgba(217, 208, 190, 0.42)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(piers[0], height * 0.515);
      ctx.lineTo(piers[3], height * 0.515);
      ctx.stroke();

      if (grease > 0.02) {
        const gAlpha = (0.12 + 0.72 * grease).toFixed(3);
        ctx.strokeStyle = 'rgba(50, 47, 42, ' + gAlpha + ')';
        ctx.lineWidth = 2.2 + grease * 5.5;
        ctx.beginPath();
        for (let b = 0; b < 3; b++) {
          const xL = piers[b];
          const xR = piers[b + 1];
          const mid = (xL + xR) * 0.5;
          ctx.moveTo(xL, springY);
          ctx.quadraticCurveTo((xL + mid) * 0.5, height * 0.022, mid, height * 0.130);
          ctx.quadraticCurveTo((mid + xR) * 0.5, height * 0.022, xR, springY);
        }
        ctx.stroke();

        ctx.fillStyle = 'rgba(24, 26, 29, ' + (0.10 + 0.62 * grease).toFixed(3) + ')';
        for (let b = 0; b < 3; b++) {
          const mid = (piers[b] + piers[b + 1]) * 0.5;
          const dripH = height * (0.015 + 0.055 * grease);
          ctx.beginPath();
          ctx.moveTo(mid - pierW * 0.45, height * 0.124);
          ctx.quadraticCurveTo(mid, height * 0.124 + dripH, mid + pierW * 0.45, height * 0.124);
          ctx.closePath();
          ctx.fill();
        }
      }

      const activeIdx = clampLocus(st.activeLocus);
      const frameR = Math.min(width * 0.105, height * 0.135);
      for (let i = 0; i < STONES.length; i++) {
        const sx = STONES[i].u * width;
        const sy = STONES[i].v * height;
        if (i !== activeIdx) {
          ctx.fillStyle = bleak ? 'rgba(180, 185, 192, 0.45)' : 'rgba(243, 239, 228, 0.62)';
          ctx.beginPath();
          ctx.arc(sx, sy - frameR * 0.78, 2.6, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        const pulse = bleak ? 0 : Math.sin(t * 2.6) * 0.04;
        const rad = frameR * (1 + pulse);
        ctx.strokeStyle = bleak ? '#b6bcc4' : PALETTE.amber;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(sx, sy, rad, 0, Math.PI * 2);
        ctx.stroke();

        setDash(ctx, [5, 4]);
        ctx.strokeStyle = bleak ? 'rgba(200, 205, 212, 0.45)' : 'rgba(243, 239, 228, 0.78)';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(sx, sy, rad * 1.09, 0, Math.PI * 2);
        ctx.stroke();
        setDash(ctx, []);

        const badgeY = sy - rad * 1.02;
        ctx.fillStyle = bleak ? '#3b3e43' : PALETTE.soot;
        ctx.beginPath();
        ctx.arc(sx, badgeY, 9.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = bleak ? '#b6bcc4' : PALETTE.amber;
        ctx.lineWidth = 1.3;
        ctx.stroke();

        if (typeof ctx.fillText === 'function') {
          ctx.fillStyle = PALETTE.alabaster;
          ctx.font = '600 9px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(NUMERALS[i], sx, badgeY + 0.5);
        }
      }
    } finally {
      ctx.restore();
    }
  }

  const OliviaFiligree = {
    STONES: STONES,
    createFiligreeState: createFiligreeState,
    utterGrace: utterGrace,
    setActiveLocus: setActiveLocus,
    stepFiligree: stepFiligree,
    computeGraceMetrics: computeGraceMetrics,
    renderFiligreeScreen: renderFiligreeScreen,
    renderMullionMask: renderMullionMask
  };

  globalThis.OliviaFiligree = OliviaFiligree;
  if (typeof window !== 'undefined') {
    window.OliviaFiligree = OliviaFiligree;
  }
})();
