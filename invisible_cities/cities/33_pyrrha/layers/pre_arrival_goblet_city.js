(function () {
  'use strict';

  const PALETTE = {
    deepGulf: '#13345c',
    gobletUltramarine: '#1d4e89',
    aegeanBayLight: '#2d6da8',
    harborCaustic: '#7cc6f2',
    marbleWell: '#f4f1ea',
    marbleShadow: '#cfc8ba',
    limestoneParapet: '#ded8cc',
    limestoneSlope: '#c5bdb0',
    arcadeShadow: '#16253b',
    duneOchre: '#d8a24a',
    dustGlare: '#e6be74',
    blueprintDeep: '#0a182b',
    blueprintSlate: '#122947',
    chalkLine: '#dcebfa',
    chalkCyan: '#7ec0ee'
  };

  const GOBLET_STONES = [
    {
      id: 'enclosed_curtain_wall',
      index: 0,
      label: 'Enclosed Rampart Ring',
      gobletRole: 'fortified_enclosure',
      normX: 0.23,
      normY: 0.55,
      noteHz: 293.66,
      inscription: 'Dressed limestone curtain walls clasping the steep slopes of the gulf.'
    },
    {
      id: 'goblet_west_towers',
      index: 1,
      label: 'Goblet-Rim Castellated Towers',
      gobletRole: 'goblet_towers',
      normX: 0.34,
      normY: 0.30,
      noteHz: 329.63,
      inscription: 'Crenellated cylindrical towers flaring upward like the rim of a stone goblet.'
    },
    {
      id: 'high_lancet_windows',
      index: 2,
      label: 'High Seaward Lancet Windows',
      gobletRole: 'high_windows',
      normX: 0.66,
      normY: 0.30,
      noteHz: 369.99,
      inscription: 'Tall narrow casements drinking ultramarine sea-light high above the tide.'
    },
    {
      id: 'ultramarine_gulf_slopes',
      index: 3,
      label: 'Sloped Amphitheater Bay',
      gobletRole: 'bay_slopes',
      normX: 0.50,
      normY: 0.43,
      noteHz: 440.00,
      inscription: 'Terraced slopes curving around a sheltered, wind-bright harbor.'
    },
    {
      id: 'deep_central_square',
      index: 4,
      label: 'Deep Enclosed Central Square',
      gobletRole: 'deep_square',
      normX: 0.50,
      normY: 0.61,
      noteHz: 493.88,
      inscription: 'A sunken flagstone piazza shadowed by radial arcades at the heart of the city.'
    },
    {
      id: 'echoing_marble_well',
      index: 5,
      label: 'Central Carved Marble Well',
      gobletRole: 'marble_well',
      normX: 0.50,
      normY: 0.70,
      noteHz: 587.33,
      inscription: 'In the middle of the deep square, subterranean water rings beneath carved white marble.'
    }
  ];

  function clamp(v, lo, hi) {
    return Math.max(lo, Math.min(hi, v));
  }

  function createGobletCity(opts) {
    const options = opts || {};
    const state = {
      cityName: 'PYRRHA',
      gobletClarity: 1.0,
      seaVisibleInMind: true,
      selectedStoneIndex: typeof options.selectedStoneIndex === 'number'
        ? clamp(Math.floor(options.selectedStoneIndex), 0, 5)
        : 5,
      preArrivalUtteranceCount: 0,
      muted: Boolean(options.muted),
      hasCrossedThreshold: false,
      quarantineActive: false,
      thresholdPosition: 0,
      phoneticGlow: 0.32,
      shatterPulse: 0,
      time: 0,
      wellEchoTimer: 0,
      stoneResonance: [0, 0, 0, 0, 0, 0.45],
      ripples: []
    };

    const geom = {
      width: 960,
      height: 600,
      dpr: 1,
      towers: [],
      terraces: [],
      streets: [],
      merlons: [],
      square: { cx: 480, cy: 396, rx: 148, ry: 58 },
      well: { cx: 480, cy: 420, r: 28 }
    };

    let audioCtx = null;

    function ensureAudioContext() {
      try {
        if (!audioCtx) {
          const Ctor = (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext))
            || globalThis.AudioContext
            || globalThis.webkitAudioContext;
          if (Ctor) audioCtx = new Ctor();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          const p = audioCtx.resume();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        }
      } catch (_) {
        audioCtx = null;
      }
      return audioCtx;
    }

    function unlockAudio() {
      const ctx = ensureAudioContext();
      return Boolean(ctx);
    }

    function setMuted(flag) {
      state.muted = Boolean(flag);
      return state.muted;
    }

    function isMuted() {
      return state.muted;
    }

    function playWellDrop(hz) {
      if (state.muted) return;
      try {
        const ctx = ensureAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const baseHz = Number(hz) || 587.33;

        const chimeOsc = ctx.createOscillator();
        const chimeHarm = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chimeOsc.type = 'sine';
        chimeHarm.type = 'triangle';
        chimeOsc.frequency.setValueAtTime(baseHz, now);
        chimeHarm.frequency.setValueAtTime(baseHz * 1.498, now);
        chimeGain.gain.setValueAtTime(0.0001, now);
        chimeGain.gain.exponentialRampToValueAtTime(0.065, now + 0.018);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);
        chimeOsc.connect(chimeGain);
        chimeHarm.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chimeOsc.start(now);
        chimeHarm.start(now);
        chimeOsc.stop(now + 1.18);
        chimeHarm.stop(now + 0.85);

        const dropOsc = ctx.createOscillator();
        const dropGain = ctx.createGain();
        dropOsc.type = 'sine';
        dropOsc.frequency.setValueAtTime(baseHz * 1.25, now + 0.07);
        dropOsc.frequency.exponentialRampToValueAtTime(baseHz * 2.12, now + 0.19);
        dropGain.gain.setValueAtTime(0.0001, now + 0.07);
        dropGain.gain.exponentialRampToValueAtTime(0.048, now + 0.085);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
        dropOsc.connect(dropGain);
        dropGain.connect(ctx.destination);
        dropOsc.start(now + 0.07);
        dropOsc.stop(now + 0.45);
      } catch (_) {}
    }

    function playGobletChord() {
      if (state.muted) return;
      try {
        const ctx = ensureAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        for (let i = 0; i < GOBLET_STONES.length; i++) {
          const t0 = now + i * 0.048;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(GOBLET_STONES[i].noteHz, t0);
          gain.gain.setValueAtTime(0.0001, t0);
          gain.gain.exponentialRampToValueAtTime(0.042, t0 + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.65);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t0);
          osc.stop(t0 + 1.7);
        }
      } catch (_) {}
    }

    function playQuarantineShatter() {
      if (state.muted) return;
      try {
        const ctx = ensureAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        const ratios = [932.33, 1108.73, 1318.51, 1661.22, 1975.53];
        for (let i = 0; i < ratios.length; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(ratios[i], now);
          osc.frequency.exponentialRampToValueAtTime(ratios[i] * 0.54, now + 0.34);
          gain.gain.setValueAtTime(0.028, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.36);
        }
      } catch (_) {}
    }

    function spawnRipple(normX, normY, kind, maxR) {
      if (state.ripples.length > 28) state.ripples.shift();
      state.ripples.push({
        normX: normX,
        normY: normY,
        kind: kind || 'well',
        progress: 0,
        maxR: maxR || (kind === 'well' ? 0.095 : 0.075)
      });
    }

    function seedInitialRipples() {
      state.ripples = [
        { normX: 0.50, normY: 0.70, kind: 'well', progress: 0.28, maxR: 0.085 },
        { normX: 0.50, normY: 0.70, kind: 'well', progress: 0.68, maxR: 0.085 }
      ];
    }

    function resize(width, height, dpr) {
      const w = Math.max(240, Number(width) || 960);
      const h = Math.max(180, Number(height) || 600);
      geom.width = w;
      geom.height = h;
      geom.dpr = Math.max(1, Number(dpr) || 1);

      const towerSpecs = [
        { nx: 0.20, topY: 0.34, botY: 0.53, scale: 0.88 },
        { nx: 0.34, topY: 0.23, botY: 0.43, scale: 1.04 },
        { nx: 0.43, topY: 0.20, botY: 0.39, scale: 0.96 },
        { nx: 0.57, topY: 0.20, botY: 0.39, scale: 0.96 },
        { nx: 0.66, topY: 0.23, botY: 0.43, scale: 1.04 },
        { nx: 0.80, topY: 0.34, botY: 0.53, scale: 0.88 }
      ];
      const unit = Math.min(w, h);
      geom.towers = towerSpecs.map(function (sp, idx) {
        return {
          index: idx,
          cx: sp.nx * w,
          topY: sp.topY * h,
          botY: sp.botY * h,
          shaftW: Math.max(14, unit * 0.036 * sp.scale),
          rimW: Math.max(22, unit * 0.058 * sp.scale),
          windowH: Math.max(14, (sp.botY - sp.topY) * h * 0.34)
        };
      });

      geom.terraces = [0, 1, 2, 3].map(function (idx) {
        return {
          index: idx,
          cx: w * 0.5,
          cy: h * (0.37 + idx * 0.048),
          rx: w * (0.24 + idx * 0.048),
          ry: h * (0.075 + idx * 0.034)
        };
      });

      geom.square = {
        cx: w * 0.50,
        cy: h * 0.685,
        rx: w * 0.195,
        ry: h * 0.105
      };
      geom.well = {
        cx: w * 0.50,
        cy: h * 0.70,
        r: Math.max(15, unit * 0.048)
      };

      geom.streets = [-0.78, -0.52, -0.26, 0, 0.26, 0.52, 0.78].map(function (ang) {
        return {
          x1: w * 0.5 + Math.sin(ang) * w * 0.33,
          y1: h * 0.44 + Math.cos(ang) * h * 0.03 - Math.abs(ang) * h * 0.04,
          x2: geom.square.cx + Math.sin(ang) * geom.square.rx * 0.82,
          y2: geom.square.cy - geom.square.ry * 0.68 + Math.abs(ang) * h * 0.045
        };
      });

      geom.merlons = [];
      for (let i = 0; i <= 26; i++) {
        const u = i / 26;
        const a = Math.PI * (0.06 + u * 0.88);
        geom.merlons.push({
          x: w * 0.5 - Math.cos(a) * w * 0.355,
          y: h * 0.45 + Math.sin(a) * h * 0.365
        });
      }
      return geom;
    }

    function getStones(width, height) {
      const w = Number(width) || geom.width || 960;
      const h = Number(height) || geom.height || 600;
      return GOBLET_STONES.map(function (s, idx) {
        return {
          id: s.id,
          index: s.index,
          label: s.label,
          gobletRole: s.gobletRole,
          normX: s.normX,
          normY: s.normY,
          noteHz: s.noteHz,
          inscription: s.inscription,
          x: +(s.normX * w).toFixed(2),
          y: +(s.normY * h).toFixed(2),
          active: idx === state.selectedStoneIndex,
          resonance: +(state.stoneResonance[idx] || 0).toFixed(4)
        };
      });
    }

    function resolveStoneIndex(stoneIdOrIndex) {
      if (typeof stoneIdOrIndex === 'number' && Number.isFinite(stoneIdOrIndex)) {
        return clamp(Math.floor(stoneIdOrIndex), 0, GOBLET_STONES.length - 1);
      }
      if (typeof stoneIdOrIndex === 'string') {
        const asNum = Number(stoneIdOrIndex);
        if (stoneIdOrIndex.trim() !== '' && Number.isFinite(asNum)) {
          return clamp(Math.floor(asNum), 0, GOBLET_STONES.length - 1);
        }
        for (let i = 0; i < GOBLET_STONES.length; i++) {
          if (GOBLET_STONES[i].id === stoneIdOrIndex || GOBLET_STONES[i].gobletRole === stoneIdOrIndex) {
            return i;
          }
        }
      }
      return state.selectedStoneIndex;
    }

    function hitTestStone(px, py, width, height) {
      const stones = getStones(width, height);
      const radius = Math.max(22, Math.min(Number(width) || geom.width, Number(height) || geom.height) * 0.048);
      let best = -1;
      let bestDist = radius * radius;
      for (let i = 0; i < stones.length; i++) {
        const dx = px - stones[i].x;
        const dy = py - stones[i].y;
        const d2 = dx * dx + dy * dy;
        if (d2 <= bestDist) {
          bestDist = d2;
          best = i;
        }
      }
      return best;
    }

    function syncArrivalState(arrival) {
      const a = arrival || {};
      const thresholdPosition = clamp(Number(a.thresholdPosition) || 0, 0, 1);
      const hasCrossed = Boolean(a.hasCrossedThreshold);
      const quarantineActive = Boolean(a.quarantineActive);
      state.thresholdPosition = thresholdPosition;
      state.hasCrossedThreshold = hasCrossed;
      state.quarantineActive = quarantineActive;

      if (!hasCrossed) {
        state.cityName = 'PYRRHA';
        state.gobletClarity = +(Math.max(0.15, 1.0 - thresholdPosition * 0.85)).toFixed(4);
        state.seaVisibleInMind = true;
      } else if (!quarantineActive) {
        state.cityName = null;
        state.gobletClarity = 0.0;
        state.seaVisibleInMind = false;
      } else {
        state.cityName = null;
        state.gobletClarity = 0.68;
        state.seaVisibleInMind = true;
      }
      return getState();
    }

    function inspectStone(stoneIdOrIndex, playSound) {
      const idx = resolveStoneIndex(stoneIdOrIndex);
      state.selectedStoneIndex = idx;
      state.stoneResonance[idx] = 1.0;
      const target = GOBLET_STONES[idx];
      spawnRipple(target.normX, target.normY, 'stone', 0.075);
      spawnRipple(0.50, 0.70, 'well', 0.09);
      spawnRipple(0.50, 0.34, 'gulf', 0.11);
      if (playSound !== false && !state.muted) {
        playWellDrop(target.noteHz);
      }
      return {
        stone: getStones()[idx],
        cityName: state.cityName,
        gobletClarity: state.gobletClarity
      };
    }

    function utterPhoneticName(arrivalState) {
      const crossed = Boolean(arrivalState && arrivalState.hasCrossedThreshold);
      if (!crossed) {
        state.hasCrossedThreshold = false;
        state.quarantineActive = false;
        state.cityName = 'PYRRHA';
        state.gobletClarity = 1.0;
        state.seaVisibleInMind = true;
        state.phoneticGlow = 1.0;
        state.preArrivalUtteranceCount += 1;
        for (let i = 0; i < GOBLET_STONES.length; i++) {
          state.stoneResonance[i] = 1.0;
          spawnRipple(GOBLET_STONES[i].normX, GOBLET_STONES[i].normY, 'tower', 0.08);
        }
        spawnRipple(0.50, 0.70, 'well', 0.11);
        if (!state.muted) playGobletChord();
        return { summonedGoblet: true, cityName: 'PYRRHA', gobletClarity: 1.0 };
      }

      const wasQuarantined = Boolean(
        state.quarantineActive ||
        (arrivalState && (arrivalState.quarantineActive || arrivalState.quarantineShattered))
      );
      state.hasCrossedThreshold = true;
      state.quarantineActive = false;
      state.cityName = null;
      state.gobletClarity = 0.0;
      state.seaVisibleInMind = false;
      state.phoneticGlow = 0.0;
      if (wasQuarantined) {
        state.shatterPulse = 1.0;
        if (!state.muted) playQuarantineShatter();
      }
      return { summonedGoblet: false, cityName: null, gobletClarity: 0.0 };
    }

    function step(dt, reducedMotion) {
      const safeDt = clamp(Number(dt) || 0.016, 0, 0.1);
      const baseGlow = state.hasCrossedThreshold ? 0.0 : 0.28;
      state.phoneticGlow += (baseGlow - state.phoneticGlow) * Math.min(1, safeDt * 1.8);
      state.shatterPulse = Math.max(0, state.shatterPulse - safeDt * 2.4);
      for (let i = 0; i < state.stoneResonance.length; i++) {
        const rest = i === state.selectedStoneIndex ? 0.35 : 0;
        state.stoneResonance[i] += (rest - state.stoneResonance[i]) * Math.min(1, safeDt * 2.5);
      }
      if (reducedMotion) return;
      state.time += safeDt;
      state.wellEchoTimer += safeDt;
      if (state.wellEchoTimer >= 2.2) {
        state.wellEchoTimer = 0;
        spawnRipple(0.50, 0.70, 'well', 0.085);
      }
      for (let i = state.ripples.length - 1; i >= 0; i--) {
        state.ripples[i].progress += safeDt * 0.48;
        if (state.ripples[i].progress >= 1) state.ripples.splice(i, 1);
      }
    }

    function drawGobletTower(ctx, t, isBlueprint) {
      const cx = t.cx;
      const topY = t.topY;
      const botY = t.botY;
      const halfShaft = t.shaftW * 0.5;
      const halfRim = t.rimW * 0.5;
      const flareY = topY + (botY - topY) * 0.34;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx - halfShaft, botY);
      ctx.lineTo(cx - halfShaft, flareY);
      ctx.quadraticCurveTo(cx - halfShaft * 1.05, topY + 6, cx - halfRim, topY + 5);
      ctx.lineTo(cx - halfRim, topY);
      const merlonCount = 4;
      const stepW = (halfRim * 2) / (merlonCount * 2 - 1);
      for (let m = 0; m < merlonCount * 2 - 1; m++) {
        const x0 = cx - halfRim + m * stepW;
        const yDepth = m % 2 === 0 ? topY : topY + 5;
        ctx.lineTo(x0, yDepth);
        ctx.lineTo(x0 + stepW, yDepth);
      }
      ctx.lineTo(cx + halfRim, topY + 5);
      ctx.quadraticCurveTo(cx + halfShaft * 1.05, topY + 6, cx + halfShaft, flareY);
      ctx.lineTo(cx + halfShaft, botY);
      ctx.closePath();

      if (isBlueprint) {
        ctx.fillStyle = 'rgba(18, 44, 76, 0.72)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(220, 235, 250, 0.82)';
        ctx.lineWidth = 1.25;
        ctx.stroke();
      } else {
        const grad = ctx.createLinearGradient(cx - halfRim, topY, cx + halfRim, topY);
        grad.addColorStop(0, '#efeae0');
        grad.addColorStop(0.55, PALETTE.limestoneParapet);
        grad.addColorStop(1, '#9d9589');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(29, 48, 76, 0.42)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const winW = Math.max(3.5, t.shaftW * 0.22);
      const winH = t.windowH;
      const winTop = flareY + 2;
      ctx.beginPath();
      ctx.moveTo(cx - winW, winTop + winH);
      ctx.lineTo(cx - winW, winTop + winW * 1.4);
      ctx.quadraticCurveTo(cx, winTop - 2, cx + winW, winTop + winW * 1.4);
      ctx.lineTo(cx + winW, winTop + winH);
      ctx.closePath();
      if (isBlueprint) {
        ctx.strokeStyle = PALETTE.chalkCyan;
        ctx.fillStyle = 'rgba(126, 192, 238, 0.28)';
        ctx.fill();
        ctx.stroke();
      } else {
        const shimmer = 0.65 + 0.35 * Math.sin(state.time * 2.1 + t.index * 0.9);
        ctx.fillStyle = PALETTE.gobletUltramarine;
        ctx.fill();
        ctx.fillStyle = 'rgba(142, 218, 255, ' + (0.45 + shimmer * 0.4 + state.phoneticGlow * 0.15).toFixed(3) + ')';
        ctx.fill();
      }
      ctx.restore();
    }

    function drawArchitecturalBay(ctx, w, h, isBlueprint) {
      if (!isBlueprint) {
        const sky = ctx.createLinearGradient(0, 0, 0, h * 0.48);
        sky.addColorStop(0, '#0d223f');
        sky.addColorStop(0.52, '#225996');
        sky.addColorStop(1, '#9ec9e6');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, w, h);

        if (state.phoneticGlow > 0.02) {
          const halo = ctx.createRadialGradient(w * 0.5, h * 0.26, 8, w * 0.5, h * 0.26, w * 0.42);
          halo.addColorStop(0, 'rgba(244, 241, 234, ' + (0.28 * state.phoneticGlow).toFixed(3) + ')');
          halo.addColorStop(1, 'rgba(45, 109, 168, 0)');
          ctx.fillStyle = halo;
          ctx.fillRect(0, 0, w, h * 0.62);
        }

        const sea = ctx.createLinearGradient(0, h * 0.19, 0, h * 0.52);
        sea.addColorStop(0, PALETTE.deepGulf);
        sea.addColorStop(0.55, PALETTE.gobletUltramarine);
        sea.addColorStop(1, PALETTE.aegeanBayLight);
        ctx.fillStyle = sea;
        ctx.fillRect(0, h * 0.19, w, h * 0.35);
      }

      for (let k = 0; k < 14; k++) {
        const wy = h * (0.215 + k * 0.017);
        const span = w * (0.34 - k * 0.008);
        const drift = Math.sin(state.time * 1.4 + k * 0.8) * 9;
        ctx.beginPath();
        ctx.moveTo(w * 0.5 - span + drift, wy);
        ctx.quadraticCurveTo(w * 0.5 + drift * 0.5, wy + 3, w * 0.5 + span + drift, wy);
        ctx.strokeStyle = isBlueprint ? 'rgba(126, 192, 238, 0.32)' : 'rgba(190, 235, 255, 0.34)';
        ctx.lineWidth = isBlueprint ? 1 : 1.3;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * 0.29);
      ctx.quadraticCurveTo(w * 0.21, h * 0.28, w * 0.28, h * 0.39);
      ctx.quadraticCurveTo(w * 0.50, h * 0.48, w * 0.72, h * 0.39);
      ctx.quadraticCurveTo(w * 0.79, h * 0.28, w, h * 0.29);
      ctx.lineTo(w, h);
      ctx.closePath();
      if (isBlueprint) {
        ctx.fillStyle = 'rgba(12, 28, 50, 0.85)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(220, 235, 250, 0.55)';
        ctx.lineWidth = 1.3;
        ctx.stroke();
      } else {
        const slopeGrad = ctx.createLinearGradient(0, h * 0.30, 0, h);
        slopeGrad.addColorStop(0, '#d8d1c4');
        slopeGrad.addColorStop(0.48, PALETTE.limestoneSlope);
        slopeGrad.addColorStop(1, '#7f7a74');
        ctx.fillStyle = slopeGrad;
        ctx.fill();
      }

      for (let i = 0; i < geom.terraces.length; i++) {
        const tr = geom.terraces[i];
        ctx.beginPath();
        ctx.ellipse(tr.cx, tr.cy + tr.ry * 0.55, tr.rx, tr.ry, 0, 0.08 * Math.PI, 0.92 * Math.PI);
        ctx.strokeStyle = isBlueprint ? 'rgba(220, 235, 250, 0.46)' : 'rgba(54, 68, 89, 0.45)';
        ctx.lineWidth = isBlueprint ? 1.1 : 2.2;
        ctx.stroke();
      }

      for (let i = 0; i < geom.streets.length; i++) {
        const st = geom.streets[i];
        ctx.beginPath();
        ctx.moveTo(st.x1, st.y1);
        ctx.lineTo(st.x2, st.y2);
        ctx.strokeStyle = isBlueprint ? 'rgba(126, 192, 238, 0.38)' : 'rgba(244, 241, 234, 0.52)';
        ctx.lineWidth = isBlueprint ? 1 : 2.4;
        ctx.stroke();
      }
    }

    function drawSquareWellAndWalls(ctx, w, h, isBlueprint) {
      if (geom.merlons.length > 1) {
        ctx.beginPath();
        ctx.moveTo(geom.merlons[0].x, geom.merlons[0].y);
        for (let i = 1; i < geom.merlons.length; i++) {
          ctx.lineTo(geom.merlons[i].x, geom.merlons[i].y);
        }
        ctx.strokeStyle = isBlueprint ? 'rgba(220, 235, 250, 0.88)' : PALETTE.limestoneParapet;
        ctx.lineWidth = isBlueprint ? 2.2 : 9;
        ctx.stroke();

        for (let i = 0; i < geom.merlons.length; i++) {
          const m = geom.merlons[i];
          ctx.fillStyle = isBlueprint ? PALETTE.chalkCyan : '#ece7dc';
          ctx.fillRect(m.x - 3.5, m.y - 7, 7, 6);
        }
      }

      for (let i = 0; i < geom.towers.length; i++) {
        drawGobletTower(ctx, geom.towers[i], isBlueprint);
      }

      const sq = geom.square;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(sq.cx, sq.cy, sq.rx, sq.ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = isBlueprint ? 'rgba(8, 20, 38, 0.92)' : PALETTE.arcadeShadow;
      ctx.fill();
      ctx.strokeStyle = isBlueprint ? PALETTE.chalkLine : PALETTE.limestoneParapet;
      ctx.lineWidth = isBlueprint ? 1.5 : 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(sq.cx, sq.cy + 5, sq.rx * 0.82, sq.ry * 0.78, 0, 0, Math.PI * 2);
      ctx.fillStyle = isBlueprint ? 'rgba(16, 38, 68, 0.86)' : '#445268';
      ctx.fill();
      ctx.strokeStyle = isBlueprint ? 'rgba(126, 192, 238, 0.55)' : 'rgba(222, 216, 204, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      for (let a = 0; a < 12; a++) {
        const th = (a / 12) * Math.PI * 2;
        const ax = sq.cx + Math.cos(th) * sq.rx * 0.91;
        const ay = sq.cy + Math.sin(th) * sq.ry * 0.89;
        ctx.beginPath();
        ctx.arc(ax, ay, isBlueprint ? 3 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = isBlueprint ? 'rgba(126, 192, 238, 0.45)' : '#0d1829';
        ctx.fill();
      }

      const wl = geom.well;
      ctx.beginPath();
      ctx.ellipse(wl.cx, wl.cy + 2, wl.r * 1.38, wl.r * 0.88, 0, 0, Math.PI * 2);
      ctx.fillStyle = isBlueprint ? 'rgba(220, 235, 250, 0.16)' : PALETTE.marbleShadow;
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(wl.cx, wl.cy, wl.r * 1.12, wl.r * 0.72, 0, 0, Math.PI * 2);
      ctx.fillStyle = isBlueprint ? 'rgba(18, 42, 74, 0.95)' : PALETTE.marbleWell;
      ctx.fill();
      ctx.strokeStyle = isBlueprint ? PALETTE.marbleWell : '#8a8275';
      ctx.lineWidth = isBlueprint ? 1.8 : 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(wl.cx, wl.cy, wl.r * 0.76, wl.r * 0.48, 0, 0, Math.PI * 2);
      ctx.fillStyle = isBlueprint ? '#091b34' : PALETTE.deepGulf;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(wl.cx - wl.r * 0.85, wl.cy);
      ctx.lineTo(wl.cx - wl.r * 0.85, wl.cy - wl.r * 1.05);
      ctx.quadraticCurveTo(wl.cx, wl.cy - wl.r * 1.55, wl.cx + wl.r * 0.85, wl.cy - wl.r * 1.05);
      ctx.lineTo(wl.cx + wl.r * 0.85, wl.cy);
      ctx.strokeStyle = isBlueprint ? PALETTE.chalkCyan : PALETTE.marbleWell;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      for (let i = 0; i < state.ripples.length; i++) {
        const rp = state.ripples[i];
        const rx = rp.normX * w;
        const ry = rp.normY * h;
        const rad = Math.max(4, rp.progress * rp.maxR * Math.min(w, h));
        const op = (1 - rp.progress) * (isBlueprint ? 0.65 : 0.75);
        ctx.beginPath();
        ctx.ellipse(rx, ry, rad, rad * 0.62, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(142, 218, 255, ' + op.toFixed(3) + ')';
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawStoneBeacons(ctx, w, h, selectedIndex, isBlueprint) {
      const stones = getStones(w, h);
      ctx.save();
      ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < stones.length; i++) {
        const s = stones[i];
        const isSel = i === selectedIndex;
        const r = isSel ? 12.5 : 9.5;
        if (isSel || s.resonance > 0.08) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, r + 5 + s.resonance * 6, 0, Math.PI * 2);
          ctx.strokeStyle = isBlueprint ? 'rgba(126, 192, 238, 0.7)' : 'rgba(244, 241, 234, 0.82)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isSel
          ? (isBlueprint ? PALETTE.chalkCyan : PALETTE.marbleWell)
          : (isBlueprint ? 'rgba(10, 24, 43, 0.88)' : 'rgba(19, 52, 92, 0.86)');
        ctx.fill();
        ctx.strokeStyle = isBlueprint ? PALETTE.chalkLine : PALETTE.marbleWell;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.fillStyle = isSel ? '#0d223f' : PALETTE.marbleWell;
        ctx.fillText(String(i + 1), s.x, s.y + 0.5);
      }
      ctx.restore();
    }

    function renderGobletCity(ctx, viewport, renderOpts) {
      if (!ctx) return;
      const vp = viewport || {};
      const opts = renderOpts || {};
      const w = Number(vp.width) || geom.width || 960;
      const h = Number(vp.height) || geom.height || 600;
      const dpr = Number(vp.dpr) || geom.dpr || 1;
      if (w !== geom.width || h !== geom.height) resize(w, h, dpr);

      const alpha = typeof opts.alpha === 'number' ? clamp(opts.alpha, 0, 1) : 1;
      if (alpha <= 0.001) return;
      const quarantineMode = opts.quarantineMode !== undefined ? Boolean(opts.quarantineMode) : state.quarantineActive;
      const approach = clamp(
        Number(opts.thresholdApproach !== undefined ? opts.thresholdApproach : state.thresholdPosition) || 0,
        0,
        1
      );
      const selectedIndex = typeof opts.selectedStoneIndex === 'number'
        ? clamp(Math.floor(opts.selectedStoneIndex), 0, 5)
        : state.selectedStoneIndex;

      ctx.save();
      ctx.globalAlpha = alpha;

      if (quarantineMode) {
        ctx.fillStyle = '#060f1c';
        ctx.fillRect(0, 0, w, h);
        const ocR = Math.min(w, h) * 0.44;
        ctx.save();
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, ocR, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = PALETTE.blueprintDeep;
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(126, 192, 238, 0.09)';
        ctx.lineWidth = 1;
        for (let gx = 0; gx < w; gx += 32) {
          ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
        }
        for (let gy = 0; gy < h; gy += 32) {
          ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
        }
        drawArchitecturalBay(ctx, w, h, true);
        drawSquareWellAndWalls(ctx, w, h, true);
        drawStoneBeacons(ctx, w, h, selectedIndex, true);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, ocR, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(220, 235, 250, 0.72)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w * 0.5, h * 0.5, ocR + 7, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(126, 192, 238, 0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        drawArchitecturalBay(ctx, w, h, false);
        drawSquareWellAndWalls(ctx, w, h, false);
        if (approach > 0.01) {
          const hazeTop = h * (1 - approach * 0.82);
          const haze = ctx.createLinearGradient(0, hazeTop, 0, h);
          haze.addColorStop(0, 'rgba(230, 190, 116, 0)');
          haze.addColorStop(0.55, 'rgba(216, 162, 74, ' + (approach * 0.48).toFixed(3) + ')');
          haze.addColorStop(1, 'rgba(216, 162, 74, ' + (approach * 0.82).toFixed(3) + ')');
          ctx.fillStyle = haze;
          ctx.fillRect(0, hazeTop, w, h - hazeTop);
        }
        drawStoneBeacons(ctx, w, h, selectedIndex, false);
      }

      if (state.shatterPulse > 0.01) {
        ctx.fillStyle = 'rgba(230, 190, 116, ' + (state.shatterPulse * 0.45).toFixed(3) + ')';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();
    }

    function getState() {
      const selStone = GOBLET_STONES[state.selectedStoneIndex] || GOBLET_STONES[5];
      return {
        cityName: state.cityName,
        isNameless: state.cityName === null,
        gobletClarity: state.gobletClarity,
        seaVisibleInMind: state.seaVisibleInMind,
        selectedStoneIndex: state.selectedStoneIndex,
        selectedStoneId: selStone.id,
        preArrivalUtteranceCount: state.preArrivalUtteranceCount,
        muted: state.muted,
        stones: getStones()
      };
    }

    function reset() {
      state.cityName = 'PYRRHA';
      state.gobletClarity = 1.0;
      state.seaVisibleInMind = true;
      state.selectedStoneIndex = 5;
      state.preArrivalUtteranceCount = 0;
      state.hasCrossedThreshold = false;
      state.quarantineActive = false;
      state.thresholdPosition = 0;
      state.phoneticGlow = 0.32;
      state.shatterPulse = 0;
      state.stoneResonance = [0, 0, 0, 0, 0, 0.45];
      seedInitialRipples();
      return getState();
    }

    seedInitialRipples();
    resize(options.width || 960, options.height || 600, options.dpr || 1);

    return {
      GOBLET_STONES: GOBLET_STONES,
      PALETTE: PALETTE,
      resize: resize,
      getStones: getStones,
      hitTestStone: hitTestStone,
      syncArrivalState: syncArrivalState,
      inspectStone: inspectStone,
      utterPhoneticName: utterPhoneticName,
      step: step,
      renderGobletCity: renderGobletCity,
      unlockAudio: unlockAudio,
      setMuted: setMuted,
      isMuted: isMuted,
      playGobletChord: playGobletChord,
      playWellDrop: playWellDrop,
      playQuarantineShatter: playQuarantineShatter,
      getState: getState,
      reset: reset
    };
  }

  const api = {
    PALETTE: PALETTE,
    GOBLET_STONES: GOBLET_STONES,
    createGobletCity: createGobletCity
  };

  globalThis.PyrrhaGobletCity = api;
  if (typeof window !== 'undefined') {
    window.PyrrhaGobletCity = api;
  }
})();
