(function (root) {
  'use strict';

  const PALETTE = Object.freeze({
    latticeShadow: '#111d16',
    canopyAbyss: '#182b20',
    foliageEmerald: '#2d6a45',
    fernMoss: '#529466',
    sunlitClearing: '#8ab87a',
    cloudIvory: '#f4efe4',
    cumulusPearl: '#e5decb',
    flamingoTimber: '#9e6b43',
    brassOptic: '#c9963b',
    skyAzure: '#6fa4c4',
    lensSpecular: '#dfeef2',
    footprintScar: '#7a4b3a'
  });

  const STILT_PILING_NODES = Object.freeze([
    Object.freeze({ index: 0, id: 'stilt_west_verge', name: 'West Verge Piling', xNorm: 0.11, depthNorm: 0.62, hasLadder: true, brassTelescopes: 1 }),
    Object.freeze({ index: 1, id: 'stilt_fern_hollow', name: 'Fern Hollow Leg', xNorm: 0.20, depthNorm: 0.34, hasLadder: false, brassTelescopes: 2 }),
    Object.freeze({ index: 2, id: 'stilt_oak_crown', name: 'Oak-Crown Spindle', xNorm: 0.31, depthNorm: 0.16, hasLadder: true, brassTelescopes: 3 }),
    Object.freeze({ index: 3, id: 'stilt_rill_bend', name: 'Rill-Bend Stilt', xNorm: 0.41, depthNorm: 0.72, hasLadder: false, brassTelescopes: 1 }),
    Object.freeze({ index: 4, id: 'stilt_nadir_gallery', name: 'Nadir Belvedere Leg', xNorm: 0.52, depthNorm: 0.12, hasLadder: true, brassTelescopes: 3 }),
    Object.freeze({ index: 5, id: 'stilt_lichen_shelf', name: 'Lichen-Shelf Piling', xNorm: 0.62, depthNorm: 0.56, hasLadder: false, brassTelescopes: 2 }),
    Object.freeze({ index: 6, id: 'stilt_moss_plinth', name: 'Moss-Plinth Spindle', xNorm: 0.71, depthNorm: 0.24, hasLadder: true, brassTelescopes: 2 }),
    Object.freeze({ index: 7, id: 'stilt_glade_eave', name: 'Glade-Eave Leg', xNorm: 0.80, depthNorm: 0.68, hasLadder: false, brassTelescopes: 1 }),
    Object.freeze({ index: 8, id: 'stilt_east_meridian', name: 'East Meridian Piling', xNorm: 0.89, depthNorm: 0.38, hasLadder: true, brassTelescopes: 2 })
  ]);

  const SKYWALK_SPANS = Object.freeze([
    [0, 1], [1, 2], [2, 4], [3, 5], [4, 6], [5, 7], [6, 8]
  ]);

  const LADDER_COUNT = STILT_PILING_NODES.reduce(function (acc, n) {
    return acc + (n.hasLadder ? 1 : 0);
  }, 0);

  function clamp(val, min, max) {
    return val < min ? min : (val > max ? max : val);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || '#000000').replace('#', '');
    const num = parseInt(clean.length === 3
      ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
      : clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + clamp(alpha, 0, 1).toFixed(3) + ')';
  }

  function makeRng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function buildWoodlandScene() {
    const rng = makeRng(28051972);

    const distantTrunks = [];
    for (let i = 0; i < 22; i++) {
      distantTrunks.push({
        xNorm: 0.03 + (i / 21) * 0.94 + (rng() - 0.5) * 0.025,
        yTopNorm: 0.48 + rng() * 0.08,
        yBotNorm: 0.65 + rng() * 0.11,
        widthPx: 4 + rng() * 7,
        crownRadius: 22 + rng() * 28,
        swaySeed: rng() * Math.PI * 2
      });
    }

    const ancientOaks = [
      { xNorm: 0.08, yBaseNorm: 0.89, scale: 1.16, lean: 0.08, swaySeed: 0.4 },
      { xNorm: 0.28, yBaseNorm: 0.84, scale: 1.25, lean: -0.05, swaySeed: 1.7 },
      { xNorm: 0.66, yBaseNorm: 0.79, scale: 0.92, lean: 0.06, swaySeed: 2.9 },
      { xNorm: 0.83, yBaseNorm: 0.93, scale: 1.22, lean: -0.09, swaySeed: 4.1 },
      { xNorm: 0.95, yBaseNorm: 0.87, scale: 0.98, lean: -0.06, swaySeed: 5.2 }
    ].map(function (oak) {
      const puffs = [];
      for (let k = 0; k < 11; k++) {
        const ang = -Math.PI * 0.92 + (k / 10) * Math.PI * 0.84;
        const rad = 0.55 + (k % 3) * 0.22;
        puffs.push({
          dx: Math.cos(ang) * 58 * rad + (rng() - 0.5) * 14,
          dy: -82 + Math.sin(ang) * 34 * rad + (rng() - 0.5) * 10,
          rx: 24 + rng() * 18,
          ry: 16 + rng() * 12,
          tone: k % 3
        });
      }
      return Object.assign({}, oak, { puffs: puffs });
    });

    const fernClusters = [];
    for (let i = 0; i < 24; i++) {
      fernClusters.push({
        xNorm: 0.02 + (i / 23) * 0.96 + (rng() - 0.5) * 0.02,
        yNorm: 0.88 + (i % 3) * 0.042 + rng() * 0.02,
        blades: 5 + (i % 4),
        size: 15 + rng() * 16,
        phase: rng() * Math.PI * 2
      });
    }

    const cloudPuffs = [];
    for (let i = 0; i < 34; i++) {
      cloudPuffs.push({
        xNorm: (i / 34) + (rng() - 0.5) * 0.03,
        yOffset: (rng() - 0.5) * 38,
        rx: 44 + rng() * 58,
        ry: 22 + rng() * 26,
        layer: i % 2,
        speed: 0.0035 + rng() * 0.0035
      });
    }

    const deer = [
      { xNorm: 0.135, yNorm: 0.825, scale: 0.95, facing: 1, antlers: true, graze: false },
      { xNorm: 0.235, yNorm: 0.845, scale: 0.78, facing: -1, antlers: false, graze: true },
      { xNorm: 0.448, yNorm: 0.875, scale: 0.72, facing: -1, antlers: false, graze: true }
    ];

    return {
      distantTrunks: distantTrunks,
      ancientOaks: ancientOaks,
      fernClusters: fernClusters,
      cloudPuffs: cloudPuffs,
      deer: deer
    };
  }

  function createBaucisAudio(initialMuted) {
    let muted = Boolean(initialMuted);
    let ctx = null;
    let masterGain = null;
    let windFilter = null;
    let windGain = null;
    let streamGain = null;
    let droneOscA = null;
    let droneOscB = null;
    let droneGain = null;
    let noiseSource = null;
    let lfoOsc = null;

    function syncMasterGain() {
      if (!ctx || !masterGain) return;
      try {
        const now = ctx.currentTime;
        const target = muted ? 0.0001 : 0.18;
        masterGain.gain.cancelScheduledValues(now);
        masterGain.gain.setTargetAtTime(target, now, 0.06);
      } catch (_e) {}
    }

    function unlock() {
      try {
        const AudioCtx = root && (root.AudioContext || root.webkitAudioContext);
        if (!AudioCtx) return false;
        if (!ctx) {
          ctx = new AudioCtx();
          masterGain = ctx.createGain();
          masterGain.gain.value = muted ? 0.0001 : 0.18;
          masterGain.connect(ctx.destination);

          const sampleRate = ctx.sampleRate || 44100;
          const length = Math.floor(sampleRate * 2.0);
          const buffer = ctx.createBuffer(1, length, sampleRate);
          const data = buffer.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0;
          for (let i = 0; i < length; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.997 * b0 + white * 0.029;
            b1 = 0.985 * b1 + white * 0.032;
            b2 = 0.950 * b2 + white * 0.048;
            data[i] = clamp((b0 + b1 + b2 + white * 0.018) * 0.9, -1, 1);
          }

          noiseSource = ctx.createBufferSource();
          noiseSource.buffer = buffer;
          noiseSource.loop = true;

          windFilter = ctx.createBiquadFilter();
          windFilter.type = 'bandpass';
          windFilter.frequency.value = 540;
          windFilter.Q.value = 1.65;

          windGain = ctx.createGain();
          windGain.gain.value = 0.055;

          const streamFilter = ctx.createBiquadFilter();
          streamFilter.type = 'bandpass';
          streamFilter.frequency.value = 1180;
          streamFilter.Q.value = 2.6;

          streamGain = ctx.createGain();
          streamGain.gain.value = 0.018;

          noiseSource.connect(windFilter);
          windFilter.connect(windGain);
          windGain.connect(masterGain);

          noiseSource.connect(streamFilter);
          streamFilter.connect(streamGain);
          streamGain.connect(masterGain);

          lfoOsc = ctx.createOscillator();
          const lfoGain = ctx.createGain();
          lfoOsc.type = 'sine';
          lfoOsc.frequency.value = 0.13;
          lfoGain.gain.value = 85;
          lfoOsc.connect(lfoGain);
          lfoGain.connect(windFilter.frequency);

          droneOscA = ctx.createOscillator();
          droneOscB = ctx.createOscillator();
          const droneFilter = ctx.createBiquadFilter();
          droneGain = ctx.createGain();
          droneOscA.type = 'sine';
          droneOscB.type = 'triangle';
          droneOscA.frequency.value = 293.66;
          droneOscB.frequency.value = 440.0;
          droneFilter.type = 'lowpass';
          droneFilter.frequency.value = 820;
          droneGain.gain.value = 0.024;

          droneOscA.connect(droneFilter);
          droneOscB.connect(droneFilter);
          droneFilter.connect(droneGain);
          droneGain.connect(masterGain);

          noiseSource.start(0);
          lfoOsc.start(0);
          droneOscA.start(0);
          droneOscB.start(0);
        }
        if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
          ctx.resume().catch(function () {});
        }
        syncMasterGain();
        return true;
      } catch (_err) {
        return false;
      }
    }

    function playTone(freq, type, startOffset, duration, peakGain, endFreq) {
      if (muted || !ctx || !masterGain) return;
      try {
        const now = ctx.currentTime + (startOffset || 0);
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, now);
        if (endFreq) {
          osc.frequency.exponentialRampToValueAtTime(Math.max(24, endFreq), now + duration);
        }
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(peakGain, now + Math.min(0.018, duration * 0.25));
        g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(now);
        osc.stop(now + duration + 0.02);
      } catch (_e) {}
    }

    return {
      unlock: unlock,
      setMuted: function (bool) {
        muted = Boolean(bool);
        syncMasterGain();
        return muted;
      },
      toggleMute: function () {
        muted = !muted;
        if (!muted) unlock();
        syncMasterGain();
        return muted;
      },
      isMuted: function () {
        return muted;
      },
      updateAtmosphere: function (stateObj) {
        if (!ctx || !windFilter || !windGain || !streamGain || !droneOscB) return;
        try {
          const s = stateObj || {};
          const alt = Number.isFinite(s.altitude01) ? clamp(s.altitude01, 0, 1) : 0.88;
          const sun = Number.isFinite(s.sunlight01) ? clamp(s.sunlight01, 0, 1) : 0.85;
          const onEarth = Boolean(s.inhabitantOnEarth);
          const now = ctx.currentTime;
          windFilter.frequency.setTargetAtTime(360 + alt * 340 + sun * 70, now, 0.12);
          windGain.gain.setTargetAtTime(0.026 + alt * 0.044, now, 0.12);
          streamGain.gain.setTargetAtTime(0.032 * (1 - alt * 0.58), now, 0.12);
          droneOscB.frequency.setTargetAtTime(onEarth ? 415.3 : 440.0, now, 0.15);
        } catch (_e) {}
      },
      playSpyglassClick: function (zoomStep) {
        const step = clamp(Number(zoomStep) || 0, 0, 3);
        const base = 1520 + step * 340;
        playTone(base, 'triangle', 0, 0.042, 0.12, base * 0.76);
        playTone(base * 1.48, 'sine', 0.024, 0.032, 0.07, base * 1.32);
      },
      playSpecimenChime: function (kind) {
        if (kind === 'stone') {
          playTone(523.25, 'sine', 0, 0.28, 0.10);
          playTone(1046.5, 'sine', 0.03, 0.24, 0.06);
        } else if (kind === 'ant') {
          playTone(880.0, 'sine', 0, 0.09, 0.07);
          playTone(1108.73, 'sine', 0.055, 0.09, 0.07);
          playTone(1318.51, 'sine', 0.11, 0.14, 0.08);
        } else {
          playTone(587.33, 'sine', 0, 0.26, 0.09);
          playTone(739.99, 'triangle', 0.045, 0.30, 0.06);
        }
      },
      playLadderFootfallViolation: function () {
        playTone(124, 'sawtooth', 0, 0.22, 0.18, 41);
        playTone(233.08, 'triangle', 0.04, 0.36, 0.09, 220.0);
        playTone(246.94, 'sine', 0.05, 0.38, 0.08, 233.08);
      },
      playAbsenceRestoredChord: function () {
        const notes = [293.66, 440.0, 587.33, 739.99];
        for (let i = 0; i < notes.length; i++) {
          playTone(notes[i], i % 2 === 0 ? 'sine' : 'triangle', i * 0.055, 0.52, 0.075);
        }
      },
      destroy: function () {
        try {
          if (noiseSource) noiseSource.stop();
          if (lfoOsc) lfoOsc.stop();
          if (droneOscA) droneOscA.stop();
          if (droneOscB) droneOscB.stop();
          if (ctx && typeof ctx.close === 'function') ctx.close();
        } catch (_e) {}
        ctx = null;
        masterGain = null;
      }
    };
  }

  function createCloudStiltWorld(opts) {
    const cfg = opts || {};
    const scene = buildWoodlandScene();
    const audio = createBaucisAudio(Boolean(cfg.muted));

    const state = {
      width: Math.max(240, Number(cfg.width) || 1280),
      height: Math.max(240, Number(cfg.height) || 800),
      dpr: Math.max(1, Number(cfg.dpr) || 1),
      marchDay: Number.isFinite(Number(cfg.marchDay)) ? clamp(Math.round(Number(cfg.marchDay)), 1, 7) : 7,
      altitude01: Number.isFinite(Number(cfg.altitude01)) ? clamp(Number(cfg.altitude01), 0, 1) : 0.88,
      sunlight01: Number.isFinite(Number(cfg.sunlight01)) ? clamp(Number(cfg.sunlight01), 0, 1) : 0.85,
      sunAzimuth: Number.isFinite(Number(cfg.sunAzimuth)) ? clamp(Number(cfg.sunAzimuth), -1, 1) : 0.28,
      cloudRift01: Number.isFinite(Number(cfg.cloudRift01)) ? clamp(Number(cfg.cloudRift01), 0, 1) : 0.65,
      inhabitantOnEarth: Boolean(cfg.inhabitantOnEarth),
      focusNormX: Number.isFinite(Number(cfg.focusNormX)) ? clamp(Number(cfg.focusNormX), 0.08, 0.92) : 0.52,
      focusNormY: Number.isFinite(Number(cfg.focusNormY)) ? clamp(Number(cfg.focusNormY), 0.56, 0.95) : 0.78,
      earthContactCityMass: 0,
      piercedShadowVisible: true,
      shadowOpacity: 0,
      reducedMotion: Boolean(cfg.reducedMotion),
      cloudPhase: 0,
      foliagePhase: 0,
      streamPhase: 0
    };

    function recomputeSolar() {
      if (state.sunlight01 > 0.35) {
        state.piercedShadowVisible = true;
        state.shadowOpacity = clamp((state.sunlight01 - 0.35) / 0.65, 0, 1);
      } else {
        state.piercedShadowVisible = false;
        state.shadowOpacity = 0;
      }
    }
    recomputeSolar();

    function computeBounds() {
      const h = state.height;
      const altDelta = 0.88 - state.altitude01;
      return {
        belvedereY: Math.round(h * clamp(0.21 - altDelta * 0.08, 0.12, 0.25)),
        cloudDeckY: Math.round(h * clamp(0.43 - altDelta * 0.06, 0.35, 0.47)),
        minY: Math.round(h * clamp(0.56 - altDelta * 0.04, 0.51, 0.59)),
        maxY: Math.round(h * 0.96)
      };
    }

    function computeInternalNodes(bounds) {
      const w = state.width;
      const h = state.height;
      const floorSpan = bounds.maxY - bounds.minY;
      return STILT_PILING_NODES.map(function (node) {
        const x = node.xNorm * w;
        const baseY = bounds.minY + floorSpan * (0.14 + (1 - node.depthNorm) * 0.54);
        const topY = bounds.belvedereY + (node.depthNorm - 0.36) * h * 0.075;
        return {
          index: node.index,
          id: node.id,
          name: node.name,
          baseX: x,
          baseY: baseY,
          topX: x,
          topY: topY,
          depthNorm: node.depthNorm,
          hasLadder: node.hasLadder,
          brassTelescopes: node.brassTelescopes
        };
      });
    }

    function drawSkyAndSolarRays(ctx, w, h, bounds, viewOpts) {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, bounds.minY + h * 0.08);
      const sunny = state.sunlight01;
      skyGrad.addColorStop(0, sunny > 0.35 ? PALETTE.skyAzure : '#7b929e');
      skyGrad.addColorStop(0.58, hexToRgba(PALETTE.cloudIvory, 0.94));
      skyGrad.addColorStop(1, PALETTE.cumulusPearl);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, bounds.minY + h * 0.1);

      const sunX = w * (0.5 + state.sunAzimuth * 0.36);
      const sunY = h * 0.13;
      if (sunny > 0.18) {
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 6, sunX, sunY, w * 0.48);
        sunGlow.addColorStop(0, hexToRgba(PALETTE.cloudIvory, 0.85 * sunny));
        sunGlow.addColorStop(0.32, hexToRgba(PALETTE.brassOptic, 0.22 * sunny));
        sunGlow.addColorStop(1, hexToRgba(PALETTE.cloudIvory, 0));
        ctx.fillStyle = sunGlow;
        ctx.fillRect(0, 0, w, bounds.minY + h * 0.08);
      }

      if (state.piercedShadowVisible) {
        ctx.save();
        const rayAlpha = 0.085 * state.shadowOpacity;
        const skew = -state.sunAzimuth * w * 0.28;
        for (let r = 0; r < 5; r++) {
          const rx = w * (0.14 + r * 0.18) + (sunX - w * 0.5) * 0.25;
          const beamW = w * (0.045 + (r % 2) * 0.025);
          const rayGrad = ctx.createLinearGradient(rx, sunY, rx + skew, bounds.maxY);
          rayGrad.addColorStop(0, hexToRgba(PALETTE.cloudIvory, rayAlpha * 1.25));
          rayGrad.addColorStop(0.65, hexToRgba(PALETTE.sunlitClearing, rayAlpha * 0.8));
          rayGrad.addColorStop(1, hexToRgba(PALETTE.sunlitClearing, 0));
          ctx.fillStyle = rayGrad;
          ctx.beginPath();
          ctx.moveTo(rx - beamW * 0.4, 0);
          ctx.lineTo(rx + beamW * 0.4, 0);
          ctx.lineTo(rx + skew + beamW * 1.5, h);
          ctx.lineTo(rx + skew - beamW * 1.1, h);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }

      if (viewOpts && viewOpts.hypothesisTint) {
        ctx.fillStyle = hexToRgba(viewOpts.hypothesisTint, 0.065);
        ctx.fillRect(0, 0, w, bounds.cloudDeckY);
      }
    }

    function drawWoodlandStratum(ctx, w, h, bounds) {
      const forestTop = bounds.cloudDeckY + h * 0.02;
      const bgGrad = ctx.createLinearGradient(0, forestTop, 0, h);
      bgGrad.addColorStop(0, PALETTE.foliageEmerald);
      bgGrad.addColorStop(0.32, PALETTE.canopyAbyss);
      bgGrad.addColorStop(0.62, PALETTE.foliageEmerald);
      bgGrad.addColorStop(1, PALETTE.canopyAbyss);
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, forestTop, w, h - forestTop);

      for (let ridge = 0; ridge < 3; ridge++) {
        ctx.fillStyle = ridge === 0
          ? hexToRgba(PALETTE.fernMoss, 0.42)
          : (ridge === 1 ? PALETTE.foliageEmerald : PALETTE.canopyAbyss);
        ctx.beginPath();
        const baseRidgeY = bounds.minY - (2 - ridge) * h * 0.032;
        ctx.moveTo(0, h);
        for (let x = 0; x <= w + 32; x += 32) {
          const wave = Math.sin(x * 0.014 + ridge * 1.9 + state.foliagePhase * 0.35) * 11
            + Math.cos(x * 0.031 - ridge) * 6;
          ctx.lineTo(x, baseRidgeY + wave);
        }
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();
      }

      for (let i = 0; i < scene.distantTrunks.length; i++) {
        const tr = scene.distantTrunks[i];
        const tx = tr.xNorm * w;
        const ty0 = tr.yTopNorm * h;
        const ty1 = Math.max(bounds.minY + 12, tr.yBotNorm * h);
        ctx.strokeStyle = hexToRgba(PALETTE.canopyAbyss, 0.72);
        ctx.lineWidth = tr.widthPx;
        ctx.beginPath();
        ctx.moveTo(tx, ty1);
        ctx.lineTo(tx + Math.sin(state.foliagePhase + tr.swaySeed) * 2.2, ty0);
        ctx.stroke();
        ctx.fillStyle = hexToRgba(i % 2 === 0 ? PALETTE.foliageEmerald : PALETTE.fernMoss, 0.55);
        ctx.beginPath();
        ctx.arc(tx, ty0, tr.crownRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      const gladeGrad = ctx.createRadialGradient(
        w * 0.5, bounds.minY + (bounds.maxY - bounds.minY) * 0.48, w * 0.04,
        w * 0.5, bounds.minY + (bounds.maxY - bounds.minY) * 0.55, w * 0.52
      );
      const sunBoost = 0.25 + state.sunlight01 * 0.62;
      gladeGrad.addColorStop(0, hexToRgba(PALETTE.sunlitClearing, sunBoost));
      gladeGrad.addColorStop(0.55, hexToRgba(PALETTE.fernMoss, sunBoost * 0.75));
      gladeGrad.addColorStop(1, hexToRgba(PALETTE.canopyAbyss, 0.85));
      ctx.fillStyle = gladeGrad;
      ctx.fillRect(0, bounds.minY, w, h - bounds.minY);
    }

    function drawStreamOaksAndFerns(ctx, w, h, bounds) {
      ctx.save();
      const sy0 = bounds.minY + 6;
      ctx.strokeStyle = hexToRgba(PALETTE.canopyAbyss, 0.72);
      ctx.lineWidth = Math.max(14, w * 0.024);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(w * 0.155, sy0);
      ctx.bezierCurveTo(w * 0.255, sy0 + (h - sy0) * 0.34, w * 0.175, sy0 + (h - sy0) * 0.68, w * 0.295, h + 8);
      ctx.stroke();

      const waterGrad = ctx.createLinearGradient(w * 0.15, sy0, w * 0.30, h);
      waterGrad.addColorStop(0, hexToRgba(PALETTE.skyAzure, 0.68));
      waterGrad.addColorStop(0.55, hexToRgba(PALETTE.fernMoss, 0.78));
      waterGrad.addColorStop(1, hexToRgba(PALETTE.skyAzure, 0.82));
      ctx.strokeStyle = waterGrad;
      ctx.lineWidth = Math.max(8, w * 0.015);
      ctx.stroke();

      ctx.strokeStyle = hexToRgba(PALETTE.lensSpecular, 0.58);
      ctx.lineWidth = 1.4;
      for (let s = 0; s < 7; s++) {
        const t = ((s / 7) + state.streamPhase * 0.09) % 1;
        const rx = lerp(w * 0.16, w * 0.285, t) + Math.sin(t * Math.PI * 2.2) * w * 0.022;
        const ry = lerp(sy0 + 8, h - 8, t);
        ctx.beginPath();
        ctx.moveTo(rx - 6, ry);
        ctx.quadraticCurveTo(rx, ry - 2, rx + 7, ry + 1);
        ctx.stroke();
      }
      ctx.restore();

      if (!state.inhabitantOnEarth && state.marchDay === 7) {
        for (let d = 0; d < scene.deer.length; d++) {
          const dr = scene.deer[d];
          const dx = dr.xNorm * w;
          const dy = clamp(dr.yNorm * h, bounds.minY + 18, bounds.maxY);
          const sc = dr.scale * Math.max(0.68, Math.min(1.15, w / 1100));
          const dir = dr.facing;
          ctx.save();
          ctx.translate(dx, dy);
          ctx.scale(dir * sc, sc);
          ctx.fillStyle = PALETTE.flamingoTimber;
          ctx.beginPath();
          ctx.ellipse(0, -11, 10, 5, -0.06, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = PALETTE.flamingoTimber;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(-6, -8); ctx.lineTo(-7, 0);
          ctx.moveTo(-2, -8); ctx.lineTo(-1, 0);
          ctx.moveTo(5, -8); ctx.lineTo(5, 0);
          ctx.moveTo(8, -8); ctx.lineTo(9, 0);
          ctx.moveTo(7, -13);
          ctx.lineTo(12, dr.graze ? -3 : -21);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(13, dr.graze ? -2 : -22, 3.6, 2.2, dr.graze ? 0.5 : -0.1, 0, Math.PI * 2);
          ctx.fill();
          if (dr.antlers) {
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(13, -24); ctx.lineTo(11, -31); ctx.moveTo(12, -28); ctx.lineTo(15, -30);
            ctx.moveTo(14, -24); ctx.lineTo(17, -30);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      const oakScaleBase = Math.max(0.62, Math.min(1.15, w / 1150));
      for (let i = 0; i < scene.ancientOaks.length; i++) {
        const oak = scene.ancientOaks[i];
        const ox = oak.xNorm * w;
        const oy = clamp(oak.yBaseNorm * h, bounds.minY + 34, h - 8);
        const sc = oak.scale * oakScaleBase;
        const sway = Math.sin(state.foliagePhase + oak.swaySeed) * 2.6;
        ctx.save();
        ctx.translate(ox, oy);
        ctx.scale(sc, sc);
        ctx.fillStyle = PALETTE.canopyAbyss;
        ctx.beginPath();
        ctx.moveTo(-18, 8);
        ctx.quadraticCurveTo(-8, -28, -7 + oak.lean * 40, -76);
        ctx.lineTo(7 + oak.lean * 40, -76);
        ctx.quadraticCurveTo(9, -28, 20, 8);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = PALETTE.canopyAbyss;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(-3, -68); ctx.quadraticCurveTo(-26, -82, -46 + sway * 0.4, -88);
        ctx.moveTo(3, -70); ctx.quadraticCurveTo(24, -84, 44 + sway * 0.4, -86);
        ctx.moveTo(0, -74); ctx.lineTo(sway * 0.3, -102);
        ctx.stroke();

        for (let p = 0; p < oak.puffs.length; p++) {
          const pf = oak.puffs[p];
          ctx.fillStyle = pf.tone === 0
            ? PALETTE.canopyAbyss
            : (pf.tone === 1 ? PALETTE.foliageEmerald : (state.sunlight01 > 0.35 ? PALETTE.fernMoss : PALETTE.foliageEmerald));
          ctx.beginPath();
          ctx.ellipse(pf.dx + sway * 0.55, pf.dy, pf.rx, pf.ry, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      for (let f = 0; f < scene.fernClusters.length; f++) {
        const fc = scene.fernClusters[f];
        const fx = fc.xNorm * w;
        const fy = fc.yNorm * h;
        ctx.strokeStyle = f % 2 === 0 ? PALETTE.fernMoss : PALETTE.canopyAbyss;
        ctx.lineWidth = 1.6;
        for (let b = 0; b < fc.blades; b++) {
          const ang = -Math.PI * 0.88 + (b / (fc.blades - 1)) * Math.PI * 0.76;
          const sway = Math.sin(state.foliagePhase * 1.2 + fc.phase + b) * 1.8;
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.quadraticCurveTo(
            fx + Math.cos(ang) * fc.size * 0.55 + sway,
            fy + Math.sin(ang) * fc.size * 0.65,
            fx + Math.cos(ang) * fc.size + sway,
            fy + Math.sin(ang) * fc.size * 0.42
          );
          ctx.stroke();
        }
      }
    }

    function drawPiercedAngularShadow(ctx, w, h, bounds, nodes) {
      if (!state.piercedShadowVisible || state.shadowOpacity <= 0) return;
      ctx.save();
      const alpha = 0.54 * state.shadowOpacity;
      const skewX = -state.sunAzimuth * w * 0.22;
      ctx.fillStyle = hexToRgba(PALETTE.latticeShadow, alpha);
      ctx.strokeStyle = hexToRgba(PALETTE.latticeShadow, alpha * 0.92);

      for (let s = 0; s < SKYWALK_SPANS.length; s++) {
        const a = nodes[SKYWALK_SPANS[s][0]];
        const b = nodes[SKYWALK_SPANS[s][1]];
        const ax = a.baseX + skewX * (0.62 + (1 - a.depthNorm) * 0.38);
        const ay = a.baseY + 4;
        const bx = b.baseX + skewX * (0.62 + (1 - b.depthNorm) * 0.38);
        const by = b.baseY + 4;
        ctx.lineWidth = 2.1;
        ctx.beginPath();
        ctx.moveTo(ax, ay - 3); ctx.lineTo(bx, by - 3);
        ctx.moveTo(ax, ay + 3); ctx.lineTo(bx, by + 3);
        ctx.stroke();
        ctx.lineWidth = 1.2;
        const steps = 9;
        for (let k = 1; k < steps; k++) {
          const t = k / steps;
          const rx = lerp(ax, bx, t);
          const ry = lerp(ay, by, t);
          ctx.beginPath();
          ctx.moveTo(rx - 2, ry - 4);
          ctx.lineTo(rx + 2, ry + 4);
          ctx.stroke();
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i];
        const cx = nd.baseX + skewX * (0.62 + (1 - nd.depthNorm) * 0.38);
        const cy = nd.baseY + 4;
        const rw = (22 + (1 - nd.depthNorm) * 18) * Math.max(0.7, w / 1200);
        const rh = rw * 0.44;
        ctx.beginPath();
        ctx.moveTo(cx - rw, cy);
        ctx.lineTo(cx - rw * 0.48, cy - rh);
        ctx.lineTo(cx + rw * 0.52, cy - rh);
        ctx.lineTo(cx + rw * 1.05, cy);
        ctx.lineTo(cx + rw * 0.48, cy + rh);
        ctx.lineTo(cx - rw * 0.52, cy + rh);
        ctx.closePath();

        ctx.moveTo(cx - rw * 0.42, cy);
        ctx.lineTo(cx, cy - rh * 0.48);
        ctx.lineTo(cx + rw * 0.42, cy);
        ctx.lineTo(cx, cy + rh * 0.48);
        ctx.closePath();
        ctx.fill('evenodd');
      }
      ctx.restore();
    }

    function drawFlamingoStiltsAndLadders(ctx, w, h, bounds, nodes) {
      const sorted = nodes.slice().sort(function (a, b) { return b.depthNorm - a.depthNorm; });
      for (let i = 0; i < sorted.length; i++) {
        const nd = sorted[i];
        const shaftW = lerp(5.0, 2.3, nd.depthNorm) * Math.max(0.75, w / 1200);
        const sunSide = state.sunAzimuth >= 0 ? 1 : -1;

        ctx.fillStyle = PALETTE.canopyAbyss;
        ctx.beginPath();
        ctx.ellipse(nd.baseX, nd.baseY + 1.5, shaftW * 1.65, 2.4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = PALETTE.flamingoTimber;
        ctx.fillRect(nd.baseX - shaftW * 0.5, nd.topY, shaftW, nd.baseY - nd.topY);

        ctx.fillStyle = hexToRgba(PALETTE.brassOptic, 0.42 * state.sunlight01 + 0.12);
        ctx.fillRect(
          sunSide > 0 ? nd.baseX + shaftW * 0.1 : nd.baseX - shaftW * 0.5,
          nd.topY,
          shaftW * 0.38,
          nd.baseY - nd.topY
        );

        const flareSpan = lerp(22, 11, nd.depthNorm) * Math.max(0.72, w / 1200);
        const flareH = lerp(42, 24, nd.depthNorm);
        ctx.strokeStyle = PALETTE.flamingoTimber;
        ctx.lineWidth = Math.max(1.4, shaftW * 0.58);
        ctx.beginPath();
        ctx.moveTo(nd.topX, nd.topY + flareH);
        ctx.quadraticCurveTo(nd.topX - flareSpan * 0.35, nd.topY + flareH * 0.32, nd.topX - flareSpan, nd.topY + 2);
        ctx.moveTo(nd.topX, nd.topY + flareH);
        ctx.quadraticCurveTo(nd.topX + flareSpan * 0.35, nd.topY + flareH * 0.32, nd.topX + flareSpan, nd.topY + 2);
        ctx.stroke();

        if (nd.hasLadder) {
          const lx = nd.baseX + shaftW * 0.65 + 2.2;
          const ladW = Math.max(2.6, shaftW * 0.85);
          ctx.strokeStyle = hexToRgba(PALETTE.flamingoTimber, 0.92);
          ctx.lineWidth = 0.95;
          ctx.beginPath();
          ctx.moveTo(lx, nd.baseY); ctx.lineTo(lx, nd.topY + 4);
          ctx.moveTo(lx + ladW, nd.baseY); ctx.lineTo(lx + ladW, nd.topY + 4);
          ctx.stroke();

          ctx.strokeStyle = hexToRgba(PALETTE.brassOptic, 0.72);
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          for (let ry = nd.baseY - 5; ry > nd.topY + 6; ry -= 7) {
            ctx.moveTo(lx, ry);
            ctx.lineTo(lx + ladW, ry);
          }
          ctx.stroke();
        }
      }

      if (state.inhabitantOnEarth) {
        const fx = state.focusNormX * w;
        const fy = state.focusNormY * h;
        ctx.save();
        ctx.fillStyle = hexToRgba(PALETTE.footprintScar, 0.82);
        ctx.beginPath();
        ctx.ellipse(fx, fy, 24, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = PALETTE.brassOptic;
        ctx.lineWidth = 1.3;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.ellipse(fx, fy, 30, 13, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = PALETTE.latticeShadow;
        ctx.beginPath();
        ctx.ellipse(fx - 5, fy - 1, 4.5, 2.1, 0.25, 0, Math.PI * 2);
        ctx.ellipse(fx + 5, fy + 2, 4.5, 2.1, 0.20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = PALETTE.footprintScar;
        ctx.beginPath();
        ctx.moveTo(fx - 18, fy - 2);
        ctx.lineTo(fx - 13, fy - 19);
        ctx.lineTo(fx - 8, fy - 2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = PALETTE.cloudIvory;
        ctx.beginPath();
        ctx.arc(fx - 13, fy - 22, 3.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      } else if (state.altitude01 > 0.06 && state.altitude01 < 0.84) {
        const climbNode = nodes[4];
        const cy = lerp(climbNode.baseY - 10, climbNode.topY + 16, state.altitude01);
        ctx.fillStyle = PALETTE.brassOptic;
        ctx.beginPath();
        ctx.arc(climbNode.baseX + 6, cy, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawCumulusStratum(ctx, w, h, bounds, nadirNormX) {
      const riftX = nadirNormX * w;
      const riftHalfW = w * (0.065 + state.cloudRift01 * 0.135);
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < scene.cloudPuffs.length; i++) {
          const cp = scene.cloudPuffs[i];
          if (cp.layer !== pass) continue;
          const wrapNorm = ((cp.xNorm + state.cloudPhase * cp.speed) % 1 + 1) % 1;
          const cx = wrapNorm * (w + 120) - 60;
          const distRift = Math.abs(cx - riftX);
          if (distRift < riftHalfW * 0.68) continue;
          const riftFade = distRift < riftHalfW * 1.35
            ? clamp((distRift - riftHalfW * 0.68) / (riftHalfW * 0.67), 0, 1)
            : 1;
          const cy = bounds.cloudDeckY + cp.yOffset * (h / 800);
          const rx = cp.rx * (w / 1100 + 0.35) * (0.65 + 0.35 * riftFade);
          const ry = cp.ry * (h / 800 + 0.25) * (0.65 + 0.35 * riftFade);

          ctx.fillStyle = hexToRgba(pass === 0 ? PALETTE.cumulusPearl : '#c7c5bb', 0.72 * riftFade);
          ctx.beginPath();
          ctx.ellipse(cx, cy + ry * 0.28, rx * 0.96, ry * 0.78, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = hexToRgba(PALETTE.cloudIvory, (0.86 + state.sunlight01 * 0.12) * riftFade);
          ctx.beginPath();
          ctx.ellipse(cx - state.sunAzimuth * 4, cy - ry * 0.12, rx, ry, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function drawAerialBelvederesAndSkywalks(ctx, w, h, bounds, nodes, nadirNormX, nadirNormY) {
      const cityAlpha = state.marchDay < 7
        ? 0.25 + (state.marchDay / 7) * 0.45
        : (state.altitude01 < 0.35 ? 0.42 + state.altitude01 * 1.4 : 1.0);
      ctx.save();
      ctx.globalAlpha = clamp(cityAlpha, 0.2, 1);

      for (let s = 0; s < SKYWALK_SPANS.length; s++) {
        const a = nodes[SKYWALK_SPANS[s][0]];
        const b = nodes[SKYWALK_SPANS[s][1]];
        const midX = (a.topX + b.topX) * 0.5;
        const sagY = Math.max(a.topY, b.topY) + 12;
        ctx.strokeStyle = PALETTE.flamingoTimber;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(a.topX, a.topY - 2);
        ctx.quadraticCurveTo(midX, sagY, b.topX, b.topY - 2);
        ctx.stroke();

        ctx.strokeStyle = hexToRgba(PALETTE.brassOptic, 0.78);
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(a.topX, a.topY - 7);
        ctx.quadraticCurveTo(midX, sagY - 5, b.topX, b.topY - 7);
        ctx.stroke();

        for (let k = 1; k <= 6; k++) {
          const t = k / 7;
          const hx = lerp(a.topX, b.topX, t);
          const hy = (1 - t) * (1 - t) * (a.topY - 2) + 2 * (1 - t) * t * sagY + t * t * (b.topY - 2);
          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.lineTo(hx, hy - 5);
          ctx.stroke();
        }
      }

      const sorted = nodes.slice().sort(function (a, b) { return b.depthNorm - a.depthNorm; });
      const aimX = nadirNormX * w;
      const aimY = nadirNormY * h;
      const scaleW = Math.max(0.68, Math.min(1.15, w / 1180));

      for (let i = 0; i < sorted.length; i++) {
        const nd = sorted[i];
        const sc = lerp(1.08, 0.64, nd.depthNorm) * scaleW;
        const pw = 34 * sc;
        const ph = 26 * sc;
        const cx = nd.topX;
        const cy = nd.topY;

        ctx.fillStyle = PALETTE.flamingoTimber;
        ctx.fillRect(cx - pw, cy - 5 * sc, pw * 2, 6 * sc);
        ctx.strokeStyle = PALETTE.brassOptic;
        ctx.lineWidth = 1.0;
        ctx.strokeRect(cx - pw, cy - 11 * sc, pw * 2, 6 * sc);

        for (let c = -1; c <= 1; c++) {
          const colX = cx + c * pw * 0.72;
          ctx.fillStyle = PALETTE.flamingoTimber;
          ctx.fillRect(colX - 1.4 * sc, cy - ph, 2.8 * sc, ph - 5 * sc);
        }

        ctx.fillStyle = '#53473f';
        ctx.beginPath();
        ctx.moveTo(cx - pw * 1.12, cy - ph);
        ctx.lineTo(cx, cy - ph - 20 * sc);
        ctx.lineTo(cx + pw * 1.12, cy - ph);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = PALETTE.brassOptic;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(cx, cy - ph - 20 * sc);
        ctx.lineTo(cx, cy - ph - 28 * sc);
        ctx.stroke();

        const obsCount = nd.brassTelescopes;
        for (let o = 0; o < obsCount; o++) {
          const ox = cx + (o - (obsCount - 1) * 0.5) * (pw * 0.72);
          const oy = cy - 11 * sc;
          ctx.fillStyle = o % 2 === 0 ? PALETTE.canopyAbyss : '#3d4c59';
          ctx.beginPath();
          ctx.arc(ox, oy - 4 * sc, 2.4 * sc, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillRect(ox - 2.2 * sc, oy - 2 * sc, 4.4 * sc, 5 * sc);

          const ang = Math.atan2(aimY - oy, aimX - ox);
          const len = 11 * sc;
          const tipX = ox + Math.cos(ang) * len;
          const tipY = oy + Math.sin(ang) * len;
          ctx.strokeStyle = PALETTE.brassOptic;
          ctx.lineWidth = 1.6 * sc;
          ctx.beginPath();
          ctx.moveTo(ox, oy - 1 * sc);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();

          ctx.fillStyle = PALETTE.lensSpecular;
          ctx.beginPath();
          ctx.arc(tipX, tipY, 1.3 * sc, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    function drawMarchCanopyFrame(ctx, w, h) {
      if (state.marchDay >= 7) return;
      const density = (7 - state.marchDay) / 6;
      ctx.save();
      ctx.fillStyle = hexToRgba(PALETTE.canopyAbyss, 0.58 * density);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w, 0);
      ctx.lineTo(w, h * (0.28 + density * 0.24));
      ctx.quadraticCurveTo(w * 0.5, h * (0.08 + density * 0.34), 0, h * (0.30 + density * 0.24));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function getState() {
      return {
        width: state.width,
        height: state.height,
        marchDay: state.marchDay,
        arrivedAtBaucis: state.marchDay === 7,
        stiltCount: STILT_PILING_NODES.length,
        ladderCount: LADDER_COUNT,
        altitude01: state.altitude01,
        sunlight01: state.sunlight01,
        sunAzimuth: state.sunAzimuth,
        cloudRift01: state.cloudRift01,
        piercedShadowVisible: state.piercedShadowVisible,
        shadowOpacity: state.piercedShadowVisible ? Number(state.shadowOpacity.toFixed(4)) : 0,
        earthContactCityMass: 0,
        onlyFlamingoLegsTouchEarth: !state.inhabitantOnEarth,
        inhabitantOnEarth: state.inhabitantOnEarth,
        muted: audio.isMuted()
      };
    }

    const world = {
      audio: audio,
      resize: function (width, height, dpr) {
        if (Number.isFinite(Number(width)) && Number(width) > 0) state.width = Math.round(Number(width));
        if (Number.isFinite(Number(height)) && Number(height) > 0) state.height = Math.round(Number(height));
        if (Number.isFinite(Number(dpr)) && Number(dpr) > 0) state.dpr = Number(dpr);
        return getState();
      },
      setMarchDay: function (day1to7) {
        if (Number.isFinite(Number(day1to7))) {
          state.marchDay = clamp(Math.round(Number(day1to7)), 1, 7);
        }
        return getState();
      },
      setAltitude: function (val01) {
        if (Number.isFinite(Number(val01))) {
          state.altitude01 = clamp(Number(val01), 0, 1);
          audio.updateAtmosphere(getState());
        }
        return getState();
      },
      setSunlight: function (val01) {
        if (Number.isFinite(Number(val01))) {
          state.sunlight01 = clamp(Number(val01), 0, 1);
          recomputeSolar();
          audio.updateAtmosphere(getState());
        }
        return getState();
      },
      setSunAzimuth: function (valNeg1To1) {
        if (Number.isFinite(Number(valNeg1To1))) {
          state.sunAzimuth = clamp(Number(valNeg1To1), -1, 1);
        }
        return getState();
      },
      setCloudRift: function (val01) {
        if (Number.isFinite(Number(val01))) {
          state.cloudRift01 = clamp(Number(val01), 0, 1);
        }
        return getState();
      },
      setInhabitantOnEarth: function (bool, focusNormX, focusNormY) {
        state.inhabitantOnEarth = Boolean(bool);
        if (Number.isFinite(Number(focusNormX))) state.focusNormX = clamp(Number(focusNormX), 0.08, 0.92);
        if (Number.isFinite(Number(focusNormY))) state.focusNormY = clamp(Number(focusNormY), 0.56, 0.95);
        audio.updateAtmosphere(getState());
        return getState();
      },
      setReducedMotion: function (bool) {
        state.reducedMotion = Boolean(bool);
        return getState();
      },
      step: function (dtSec) {
        if (state.reducedMotion) return;
        const dt = clamp(Number(dtSec) || 0.016, 0, 0.1);
        state.cloudPhase += dt;
        state.foliagePhase += dt * 1.15;
        state.streamPhase += dt * 1.4;
      },
      renderPanorama: function (ctx, viewOpts) {
        if (!ctx) return;
        const vo = viewOpts || {};
        const nadirNormX = Number.isFinite(Number(vo.nadirNormX)) ? clamp(Number(vo.nadirNormX), 0.08, 0.92) : state.focusNormX;
        const nadirNormY = Number.isFinite(Number(vo.nadirNormY)) ? clamp(Number(vo.nadirNormY), 0.54, 0.96) : state.focusNormY;
        const w = state.width;
        const h = state.height;
        const bounds = computeBounds();
        const nodes = computeInternalNodes(bounds);

        ctx.save();
        drawSkyAndSolarRays(ctx, w, h, bounds, vo);
        drawWoodlandStratum(ctx, w, h, bounds);
        drawStreamOaksAndFerns(ctx, w, h, bounds);
        drawPiercedAngularShadow(ctx, w, h, bounds, nodes);
        drawFlamingoStiltsAndLadders(ctx, w, h, bounds, nodes);
        drawCumulusStratum(ctx, w, h, bounds, nadirNormX);
        drawAerialBelvederesAndSkywalks(ctx, w, h, bounds, nodes, nadirNormX, nadirNormY);
        drawMarchCanopyFrame(ctx, w, h);
        ctx.restore();
      },
      getStiltScreenNodes: function () {
        const bounds = computeBounds();
        return computeInternalNodes(bounds).map(function (nd) {
          return {
            index: nd.index,
            id: nd.id,
            name: nd.name,
            baseX: nd.baseX,
            baseY: nd.baseY,
            topX: nd.topX,
            topY: nd.topY,
            hasLadder: nd.hasLadder,
            brassTelescopes: nd.brassTelescopes
          };
        });
      },
      hitTestStilt: function (px, py) {
        if (!Number.isFinite(Number(px)) || !Number.isFinite(Number(py))) return null;
        const x = Number(px);
        const y = Number(py);
        const nodes = world.getStiltScreenNodes();
        let best = null;
        let bestDist = 28;
        for (let i = 0; i < nodes.length; i++) {
          const nd = nodes[i];
          const crownDist = Math.hypot(x - nd.topX, y - (nd.topY - 14));
          if (crownDist <= 32 && crownDist < bestDist + 6) {
            best = nd;
            bestDist = Math.min(bestDist, crownDist);
            continue;
          }
          const clampedY = clamp(y, nd.topY, nd.baseY);
          const shaftDist = Math.hypot(x - nd.baseX, y - clampedY);
          if (shaftDist <= bestDist) {
            best = nd;
            bestDist = shaftDist;
          }
        }
        return best;
      },
      getWoodlandFloorBounds: function () {
        return computeBounds();
      },
      getState: getState,
      reset: function () {
        state.marchDay = 7;
        state.altitude01 = 0.88;
        state.sunlight01 = 0.85;
        state.sunAzimuth = 0.28;
        state.cloudRift01 = 0.65;
        state.inhabitantOnEarth = false;
        state.focusNormX = 0.52;
        state.focusNormY = 0.78;
        state.earthContactCityMass = 0;
        recomputeSolar();
        audio.updateAtmosphere(getState());
        return getState();
      },
      destroy: function () {
        audio.destroy();
      }
    };

    return world;
  }

  const api = Object.freeze({
    PALETTE: PALETTE,
    STILT_PILING_NODES: STILT_PILING_NODES,
    createCloudStiltWorld: createCloudStiltWorld
  });

  if (root) {
    root.BaucisFlamingoStilts = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.BaucisFlamingoStilts = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
