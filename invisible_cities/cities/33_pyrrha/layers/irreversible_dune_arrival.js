(function (root) {
  'use strict';

  const PALETTE = Object.freeze({
    skyZenith: '#e6be74',
    skyMid: '#dbb062',
    skyHorizon: '#cfa054',
    duneSun: '#e0ae56',
    duneOchre: '#d8a24a',
    duneSlip: '#b98030',
    duneShadow: '#a97228',
    duneCrest: '#f1ce82',
    groundPlain: '#caa05c',
    streetDust: '#d8b26e',
    streetRut: '#9c7134',
    plasterLight: '#dfc18b',
    plasterMid: '#c69d61',
    plasterShade: '#9a7441',
    tinRoof: '#6c5f55',
    tinRust: '#8d5b37',
    lumberPine: '#b87b34',
    lumberCut: '#daa65c',
    lumberEnd: '#8b5720',
    sawdustGold: '#ecd089',
    millShed: '#5c534c',
    sawdustIron: '#2b2623',
    sawRust: '#a85c32',
    steelBlade: '#dad6ce',
    timberShadow: '#171412',
    markerCream: '#f4f1ea'
  });

  const ARRIVAL_STONES = Object.freeze([
    Object.freeze({
      id: 'sea_blocking_coastal_dune',
      index: 0,
      label: 'Sea-Blocking Coastal Dune',
      stoneKind: 'dune',
      normX: 0.50,
      normY: 0.31,
      inscription: 'A long ridge of low-coast sand seals the horizon; the sea is completely out of sight.'
    }),
    Object.freeze({
      id: 'straight_dusty_streets',
      index: 1,
      label: 'Straight Dusty Streets',
      stoneKind: 'streets',
      normX: 0.50,
      normY: 0.80,
      inscription: 'Rectilinear ochre thoroughfares stretch flat between timber yards in harsh glare.'
    }),
    Object.freeze({
      id: 'low_house_clusters',
      index: 2,
      label: 'Low House Groups',
      stoneKind: 'houses',
      normX: 0.18,
      normY: 0.57,
      inscription: 'Houses stand in squat plaster-and-tin clusters, not high, without a single tower.'
    }),
    Object.freeze({
      id: 'stacked_lumber_yards',
      index: 3,
      label: 'Stacks of Cut Lumber',
      stoneKind: 'lumber',
      normX: 0.27,
      normY: 0.72,
      inscription: 'Tiered piles of sawn pine and cedar planks separate every group of dwellings.'
    }),
    Object.freeze({
      id: 'buzzing_sawmills',
      index: 4,
      label: 'Noisy Sawmills',
      stoneKind: 'sawmills',
      normX: 0.76,
      normY: 0.60,
      inscription: 'Toothed steel circular blades buzz incessantly, scattering pale sawdust across the yards.'
    }),
    Object.freeze({
      id: 'metal_vane_water_pumps',
      index: 5,
      label: 'Metal-Vane Water Pumps',
      stoneKind: 'pumps',
      normX: 0.83,
      normY: 0.27,
      inscription: 'Coastal wind turns the rattling sheet-metal rotors atop tall lattice-iron water pumps.'
    })
  ]);

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function createDuneArrival(opts) {
    const options = opts || {};
    let thresholdPosition = 0;
    let hasCrossedThreshold = false;
    let isNameIrrevocablyRebound = false;
    let nominalReferent = 'goblet_bay_city';
    let gobletCityName = 'PYRRHA';
    let namelessExile = false;
    let seaVisible = true;
    let quarantineActive = false;

    let quarantineEntriesCount = 0;
    let quarantineShatteredByNameCount = 0;
    let postArrivalNameUtterances = 0;
    let failedBayRecallCount = 0;
    let retreatBlockedCount = 0;

    let sawmillBuzzLevel = 0;
    let windPumpRattleLevel = 0;
    let windSpeed = 0.35;
    let lumberStacksCut = 0;
    let selectedStoneIndex = -1;
    let muted = Boolean(options.muted);

    let simTime = 0;
    let bladeAngle = 0;
    let ochreGlare = 0;
    let ruptureFlash = 0;
    let dunePlume = 0;
    let streetDustPulse = 0;
    let houseGlarePulse = 0;
    let lumberPulse = 0;
    let sawCutFlash = 0;
    let stonePulse = 0;

    let audioCtx = null;
    let noiseBuffer = null;

    const geom = {
      w: Number(options.width) || 1280,
      h: Number(options.height) || 800,
      dpr: Number(options.dpr) || 1,
      horizonY: 352,
      duneCrest: [],
      street: null,
      crossLanes: [],
      houses: [],
      lumberYards: [],
      sawmills: [],
      pumps: []
    };

    const pumpAngles = [0.2, 1.35, 2.5, 0.85];
    const pumpRates = [1.85, 2.15, 1.72, 2.32];
    const dustMotes = [];
    const sawdustParticles = [];

    function seedParticles() {
      dustMotes.length = 0;
      sawdustParticles.length = 0;
      for (let i = 0; i < 42; i++) {
        dustMotes.push({
          nx: ((i * 37) % 100) / 100,
          ny: 0.25 + (((i * 53) % 72) / 100),
          vx: 0.045 + (i % 7) * 0.012,
          vy: -0.006 + (i % 5) * 0.003,
          r: 1.1 + (i % 4) * 0.65,
          alpha: 0.22 + (i % 5) * 0.08
        });
      }
      for (let j = 0; j < 34; j++) {
        sawdustParticles.push({
          ox: ((j * 29) % 100) / 100 - 0.5,
          oy: ((j * 41) % 100) / 100,
          vx: -0.05 - (j % 6) * 0.015,
          vy: -0.03 + (j % 7) * 0.014,
          life: (j % 10) / 10,
          size: 1.3 + (j % 3) * 0.7
        });
      }
    }

    function resize(width, height, dpr) {
      const w = Math.max(240, Number(width) || geom.w || 1280);
      const h = Math.max(200, Number(height) || geom.h || 800);
      geom.w = w;
      geom.h = h;
      geom.dpr = Math.max(1, Number(dpr) || geom.dpr || 1);
      geom.horizonY = h * 0.44;

      geom.duneCrest = [
        { x: 0, y: h * 0.30 },
        { x: w * 0.16, y: h * 0.265 },
        { x: w * 0.35, y: h * 0.295 },
        { x: w * 0.52, y: h * 0.248 },
        { x: w * 0.71, y: h * 0.285 },
        { x: w * 0.88, y: h * 0.258 },
        { x: w, y: h * 0.292 }
      ];

      geom.street = {
        topY: geom.horizonY,
        botY: h,
        topLeftX: w * 0.464,
        topRightX: w * 0.536,
        botLeftX: w * 0.285,
        botRightX: w * 0.715
      };

      geom.crossLanes = [
        { y: h * 0.53, thickness: Math.max(8, h * 0.022) },
        { y: h * 0.675, thickness: Math.max(12, h * 0.032) },
        { y: h * 0.835, thickness: Math.max(16, h * 0.042) }
      ];

      geom.houses = [
        { x: w * 0.05, y: h * 0.47, bw: w * 0.11, bh: h * 0.062, roof: 'tin', tint: 0 },
        { x: w * 0.175, y: h * 0.48, bw: w * 0.095, bh: h * 0.058, roof: 'rust', tint: 1 },
        { x: w * 0.30, y: h * 0.468, bw: w * 0.088, bh: h * 0.054, roof: 'tin', tint: 0 },
        { x: w * 0.06, y: h * 0.555, bw: w * 0.135, bh: h * 0.082, roof: 'rust', tint: 1 },
        { x: w * 0.21, y: h * 0.568, bw: w * 0.115, bh: h * 0.074, roof: 'tin', tint: 0 },
        { x: w * 0.575, y: h * 0.472, bw: w * 0.095, bh: h * 0.056, roof: 'tin', tint: 1 },
        { x: w * 0.855, y: h * 0.495, bw: w * 0.105, bh: h * 0.068, roof: 'rust', tint: 0 },
        { x: w * 0.04, y: h * 0.735, bw: w * 0.135, bh: h * 0.092, roof: 'tin', tint: 1 }
      ];

      geom.lumberYards = [
        { x: w * 0.345, y: h * 0.585, sw: w * 0.075, sh: h * 0.052, tiers: 4 },
        { x: w * 0.195, y: h * 0.695, sw: w * 0.135, sh: h * 0.078, tiers: 5 },
        { x: w * 0.345, y: h * 0.725, sw: w * 0.072, sh: h * 0.062, tiers: 4 },
        { x: w * 0.615, y: h * 0.715, sw: w * 0.115, sh: h * 0.072, tiers: 5 },
        { x: w * 0.76, y: h * 0.745, sw: w * 0.13, sh: h * 0.076, tiers: 4 }
      ];

      geom.sawmills = [
        { x: w * 0.61, y: h * 0.505, mw: w * 0.13, mh: h * 0.076, bladeR: h * 0.022, primary: false },
        { x: w * 0.675, y: h * 0.555, mw: w * 0.205, mh: h * 0.112, bladeR: h * 0.034, primary: true }
      ];

      geom.pumps = [
        { x: w * 0.135, baseY: h * 0.468, topY: h * 0.255, rotorR: h * 0.036, idx: 0 },
        { x: w * 0.382, baseY: h * 0.462, topY: h * 0.272, rotorR: h * 0.031, idx: 1 },
        { x: w * 0.695, baseY: h * 0.466, topY: h * 0.258, rotorR: h * 0.035, idx: 2 },
        { x: w * 0.830, baseY: h * 0.515, topY: h * 0.235, rotorR: h * 0.048, idx: 3 }
      ];
      return geom;
    }

    function getStones(width, height) {
      const w = Number(width) || geom.w || 1280;
      const h = Number(height) || geom.h || 800;
      const hitR = Math.max(18, Math.round(Math.min(w, h) * 0.032));
      return ARRIVAL_STONES.map(function (s) {
        return {
          id: s.id,
          index: s.index,
          label: s.label,
          stoneKind: s.stoneKind,
          normX: s.normX,
          normY: s.normY,
          inscription: s.inscription,
          x: Math.round(s.normX * w),
          y: Math.round(s.normY * h),
          radius: hitR,
          selected: selectedStoneIndex === s.index
        };
      });
    }

    function hitTestStone(px, py, width, height) {
      const stones = getStones(width, height);
      let best = null;
      let bestDist = Infinity;
      for (let i = 0; i < stones.length; i++) {
        const st = stones[i];
        const dx = px - st.x;
        const dy = py - st.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d <= st.radius * 1.45 && d < bestDist) {
          best = st;
          bestDist = d;
        }
      }
      return best;
    }

    function ensureAudio() {
      try {
        if (!audioCtx) {
          const Ctor = root.AudioContext || root.webkitAudioContext;
          if (!Ctor) return null;
          audioCtx = new Ctor();
        }
        if (audioCtx && !noiseBuffer) {
          const len = Math.floor(audioCtx.sampleRate * 0.5);
          noiseBuffer = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
          const ch = noiseBuffer.getChannelData(0);
          for (let i = 0; i < len; i++) {
            ch[i] = ((i * 16807) % 2147483647) / 1073741823.5 - 1;
          }
        }
        return audioCtx;
      } catch (_err) {
        return null;
      }
    }

    function unlockAudio() {
      try {
        const ctx = ensureAudio();
        if (!ctx) return false;
        if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
          ctx.resume().catch(function () {});
        }
        return true;
      } catch (_err) {
        return false;
      }
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      return muted;
    }

    function isMuted() {
      return muted;
    }

    function playSawmillBuzz(intensity) {
      if (muted) return false;
      try {
        const ctx = ensureAudio();
        if (!ctx) return false;
        if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
          ctx.resume().catch(function () {});
        }
        const now = ctx.currentTime;
        const level = clamp(Number(intensity) || 0.8, 0.1, 1.0);
        const dur = 0.42;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(114 + level * 22, now);
        osc1.frequency.linearRampToValueAtTime(148 + level * 30, now + 0.09);
        osc1.frequency.exponentialRampToValueAtTime(106 + level * 14, now + dur);

        osc2.frequency.setValueAtTime(229 + level * 42, now);
        osc2.frequency.exponentialRampToValueAtTime(212 + level * 28, now + dur);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(680 + level * 260, now);
        filter.Q.setValueAtTime(3.1, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.055 * level, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + dur + 0.02);
        osc2.stop(now + dur + 0.02);

        if (noiseBuffer) {
          const nSrc = ctx.createBufferSource();
          const nHp = ctx.createBiquadFilter();
          const nGain = ctx.createGain();
          nSrc.buffer = noiseBuffer;
          nHp.type = 'highpass';
          nHp.frequency.setValueAtTime(1450, now);
          nGain.gain.setValueAtTime(0.0001, now);
          nGain.gain.exponentialRampToValueAtTime(0.025 * level, now + 0.04);
          nGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
          nSrc.connect(nHp);
          nHp.connect(nGain);
          nGain.connect(ctx.destination);
          nSrc.start(now);
          nSrc.stop(now + dur + 0.02);
        }
        return true;
      } catch (_err) {
        return false;
      }
    }

    function playWindPumpClank(intensity) {
      if (muted) return false;
      try {
        const ctx = ensureAudio();
        if (!ctx) return false;
        if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
          ctx.resume().catch(function () {});
        }
        const now = ctx.currentTime;
        const level = clamp(Number(intensity) || 0.75, 0.1, 1.0);

        for (let k = 0; k < 3; k++) {
          const t0 = now + k * 0.085;
          const osc = ctx.createOscillator();
          const bp = ctx.createBiquadFilter();
          const g = ctx.createGain();
          osc.type = k % 2 === 0 ? 'triangle' : 'square';
          osc.frequency.setValueAtTime(430 + k * 210, t0);
          osc.frequency.exponentialRampToValueAtTime(240 + k * 90, t0 + 0.09);
          bp.type = 'bandpass';
          bp.frequency.setValueAtTime(980 + k * 190, t0);
          bp.Q.setValueAtTime(4.5, t0);
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.exponentialRampToValueAtTime(0.042 * level, t0 + 0.008);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11);
          osc.connect(bp);
          bp.connect(g);
          g.connect(ctx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.12);
        }
        return true;
      } catch (_err) {
        return false;
      }
    }

    function getState() {
      const selectedStone = selectedStoneIndex >= 0 && selectedStoneIndex < ARRIVAL_STONES.length
        ? ARRIVAL_STONES[selectedStoneIndex]
        : null;
      return {
        thresholdPosition: thresholdPosition,
        hasCrossedThreshold: hasCrossedThreshold,
        isNameIrrevocablyRebound: isNameIrrevocablyRebound,
        nominalReferent: nominalReferent,
        gobletCityName: gobletCityName,
        namelessExile: namelessExile,
        seaVisible: seaVisible,
        quarantineActive: quarantineActive,
        quarantineEntriesCount: quarantineEntriesCount,
        quarantineShatteredByNameCount: quarantineShatteredByNameCount,
        postArrivalNameUtterances: postArrivalNameUtterances,
        failedBayRecallCount: failedBayRecallCount,
        retreatBlockedCount: retreatBlockedCount,
        sawmillBuzzLevel: Number(sawmillBuzzLevel.toFixed(3)),
        windPumpRattleLevel: Number(windPumpRattleLevel.toFixed(3)),
        windSpeed: Number(windSpeed.toFixed(3)),
        lumberStacksCut: lumberStacksCut,
        selectedStoneIndex: selectedStoneIndex,
        selectedStoneId: selectedStone ? selectedStone.id : null,
        muted: muted,
        stones: getStones(geom.w, geom.h)
      };
    }

    function emitChange() {
      if (typeof options.onStateChange === 'function') {
        try {
          options.onStateChange(getState());
        } catch (_err) {}
      }
    }

    function crossThreshold() {
      thresholdPosition = 1.0;
      hasCrossedThreshold = true;
      isNameIrrevocablyRebound = true;
      nominalReferent = 'dune_sawmill_grid';
      gobletCityName = null;
      namelessExile = true;
      seaVisible = false;
      quarantineActive = false;
      sawmillBuzzLevel = 0.78;
      windPumpRattleLevel = 0.74;
      windSpeed = Math.max(windSpeed, 0.62);
      ochreGlare = 0.90;
      ruptureFlash = 1.0;
      playSawmillBuzz(0.82);
      playWindPumpClank(0.76);
      emitChange();
      return getState();
    }

    function setThresholdProgress(val) {
      if (hasCrossedThreshold) {
        thresholdPosition = 1.0;
        if (Number(val) < 1.0) {
          retreatBlockedCount += 1;
        }
        emitChange();
        return getState();
      }
      thresholdPosition = clamp(Number(val) || 0, 0, 1);
      if (thresholdPosition >= 1.0) {
        return crossThreshold();
      }
      sawmillBuzzLevel = thresholdPosition * 0.34;
      windPumpRattleLevel = thresholdPosition * 0.30;
      emitChange();
      return getState();
    }

    function summonByName(_token) {
      if (!hasCrossedThreshold) {
        return {
          phase: 'PRE_ARRIVAL',
          nominalReferent: 'goblet_bay_city',
          gobletCityName: 'PYRRHA',
          seaVisible: true,
          quarantineShattered: false
        };
      }
      postArrivalNameUtterances += 1;
      failedBayRecallCount += 1;
      let quarantineShattered = false;
      if (quarantineActive) {
        quarantineActive = false;
        quarantineShattered = true;
        quarantineShatteredByNameCount += 1;
      }
      sawmillBuzzLevel = 1.0;
      windPumpRattleLevel = 1.0;
      ochreGlare = 1.0;
      windSpeed = Math.max(windSpeed, 0.88);
      ruptureFlash = quarantineShattered ? 1.0 : 0.72;
      playSawmillBuzz(1.0);
      playWindPumpClank(1.0);
      emitChange();
      return {
        phase: 'ARRIVED_REBOUND',
        nominalReferent: 'dune_sawmill_grid',
        gobletCityName: null,
        seaVisible: false,
        quarantineShattered: quarantineShattered,
        sawmillBuzzLevel: 1.0,
        windPumpRattleLevel: 1.0
      };
    }

    function attemptRecallGobletByName() {
      if (!hasCrossedThreshold) {
        return {
          recalled: true,
          gobletCityName: 'PYRRHA',
          evokedInstead: 'goblet_bay_city'
        };
      }
      failedBayRecallCount += 1;
      let quarantineShattered = false;
      if (quarantineActive) {
        quarantineActive = false;
        quarantineShattered = true;
        quarantineShatteredByNameCount += 1;
      }
      sawmillBuzzLevel = 1.0;
      windPumpRattleLevel = 1.0;
      ochreGlare = 1.0;
      windSpeed = Math.max(windSpeed, 0.88);
      ruptureFlash = quarantineShattered ? 1.0 : 0.72;
      playSawmillBuzz(1.0);
      playWindPumpClank(1.0);
      emitChange();
      return {
        recalled: false,
        gobletCityName: null,
        evokedInstead: 'dune_sawmill_grid',
        quarantineShattered: quarantineShattered
      };
    }

    function setQuarantine(flag) {
      if (!hasCrossedThreshold) {
        quarantineActive = false;
        emitChange();
        return getState();
      }
      const next = Boolean(flag);
      if (next && !quarantineActive) {
        quarantineEntriesCount += 1;
      }
      quarantineActive = next;
      if (!quarantineActive) {
        sawmillBuzzLevel = Math.max(sawmillBuzzLevel, 0.72);
        windPumpRattleLevel = Math.max(windPumpRattleLevel, 0.68);
      }
      emitChange();
      return getState();
    }

    function toggleQuarantine() {
      return setQuarantine(!quarantineActive);
    }

    function triggerWindGust(strength, internalOpts) {
      const s = clamp(strength === undefined ? 1.0 : Number(strength) || 1.0, 0.1, 1.5);
      windSpeed = Math.min(1.0, 0.55 + 0.45 * s);
      windPumpRattleLevel = 1.0;
      dunePlume = Math.max(dunePlume, 0.85 * Math.min(1, s));
      streetDustPulse = Math.max(streetDustPulse, 0.80 * Math.min(1, s));
      if (!internalOpts || !internalOpts.silent) {
        playWindPumpClank(Math.min(1.0, 0.65 + 0.35 * s));
      }
      emitChange();
      return getState();
    }

    function triggerSawmillCut(internalOpts) {
      sawmillBuzzLevel = 1.0;
      lumberStacksCut += 1;
      sawCutFlash = 1.0;
      lumberPulse = 1.0;
      for (let i = 0; i < sawdustParticles.length; i++) {
        sawdustParticles[i].life = (i % 7) * 0.08;
      }
      if (!internalOpts || !internalOpts.silent) {
        playSawmillBuzz(1.0);
      }
      emitChange();
      return getState();
    }

    function inspectStone(stoneIdOrIndex, playSound) {
      const soundOn = playSound !== false;
      let idx = -1;
      if (typeof stoneIdOrIndex === 'number' && Number.isFinite(stoneIdOrIndex)) {
        idx = Math.floor(stoneIdOrIndex);
      } else if (typeof stoneIdOrIndex === 'string') {
        const trimmed = stoneIdOrIndex.trim();
        if (/^[0-5]$/.test(trimmed)) {
          idx = Number(trimmed);
        } else {
          for (let i = 0; i < ARRIVAL_STONES.length; i++) {
            if (ARRIVAL_STONES[i].id === trimmed || ARRIVAL_STONES[i].stoneKind === trimmed) {
              idx = i;
              break;
            }
          }
        }
      }
      if (idx < 0 || idx >= ARRIVAL_STONES.length) {
        selectedStoneIndex = -1;
        emitChange();
        return { stone: null, state: getState() };
      }

      selectedStoneIndex = idx;
      stonePulse = 1.0;
      if (idx === 0) {
        dunePlume = 1.0;
        windSpeed = Math.max(windSpeed, 0.74);
        if (soundOn) playWindPumpClank(0.48);
      } else if (idx === 1) {
        streetDustPulse = 1.0;
        ochreGlare = Math.max(ochreGlare, 0.72);
        if (soundOn) playWindPumpClank(0.52);
      } else if (idx === 2) {
        houseGlarePulse = 1.0;
        if (soundOn) playWindPumpClank(0.42);
      } else if (idx === 3) {
        lumberPulse = 1.0;
        lumberStacksCut += 1;
        if (soundOn) playSawmillBuzz(0.60);
      } else if (idx === 4) {
        triggerSawmillCut({ silent: !soundOn });
      } else if (idx === 5) {
        triggerWindGust(0.95, { silent: !soundOn });
      }
      const stones = getStones(geom.w, geom.h);
      emitChange();
      return { stone: stones[idx], state: getState() };
    }

    function reset() {
      thresholdPosition = 0;
      hasCrossedThreshold = false;
      isNameIrrevocablyRebound = false;
      nominalReferent = 'goblet_bay_city';
      gobletCityName = 'PYRRHA';
      namelessExile = false;
      seaVisible = true;
      quarantineActive = false;

      quarantineEntriesCount = 0;
      quarantineShatteredByNameCount = 0;
      postArrivalNameUtterances = 0;
      failedBayRecallCount = 0;
      retreatBlockedCount = 0;

      sawmillBuzzLevel = 0;
      windPumpRattleLevel = 0;
      windSpeed = 0.35;
      lumberStacksCut = 0;
      selectedStoneIndex = -1;

      ochreGlare = 0;
      ruptureFlash = 0;
      dunePlume = 0;
      streetDustPulse = 0;
      houseGlarePulse = 0;
      lumberPulse = 0;
      sawCutFlash = 0;
      stonePulse = 0;
      seedParticles();
      emitChange();
      return getState();
    }

    function step(dt, reducedMotion) {
      const d = clamp(Number(dt) || 0.016, 0, 0.1);
      const rm = Boolean(
        reducedMotion && (typeof reducedMotion === 'object' ? reducedMotion.reducedMotion : reducedMotion)
      );
      const motionScale = rm ? 0.12 : 1.0;
      simTime += d * motionScale;

      if (hasCrossedThreshold && !quarantineActive) {
        sawmillBuzzLevel = Math.max(0.68, sawmillBuzzLevel + (0.72 - sawmillBuzzLevel) * Math.min(1, d * 1.9));
        windPumpRattleLevel = Math.max(0.62, windPumpRattleLevel + (0.66 - windPumpRattleLevel) * Math.min(1, d * 1.9));
        windSpeed = Math.max(0.54, windSpeed + (0.58 - windSpeed) * Math.min(1, d * 1.2));
      } else if (hasCrossedThreshold && quarantineActive) {
        sawmillBuzzLevel = sawmillBuzzLevel + (0.18 - sawmillBuzzLevel) * Math.min(1, d * 2.4);
        windPumpRattleLevel = windPumpRattleLevel + (0.16 - windPumpRattleLevel) * Math.min(1, d * 2.4);
        windSpeed = windSpeed + (0.36 - windSpeed) * Math.min(1, d * 1.6);
      }

      for (let i = 0; i < pumpAngles.length; i++) {
        pumpAngles[i] = (pumpAngles[i] + d * motionScale * pumpRates[i] * (0.65 + windSpeed * 2.55)) % (Math.PI * 2);
      }
      bladeAngle = (bladeAngle + d * motionScale * (9.5 + sawmillBuzzLevel * 24.0)) % (Math.PI * 2);

      ochreGlare = Math.max(0, ochreGlare - d * 0.65);
      ruptureFlash = rm ? 0 : Math.max(0, ruptureFlash - d * 2.1);
      dunePlume = Math.max(0, dunePlume - d * 0.75);
      streetDustPulse = Math.max(0, streetDustPulse - d * 0.85);
      houseGlarePulse = Math.max(0, houseGlarePulse - d * 1.1);
      lumberPulse = Math.max(0, lumberPulse - d * 1.0);
      sawCutFlash = Math.max(0, sawCutFlash - d * 1.8);
      stonePulse = Math.max(0, stonePulse - d * 0.9);

      for (let m = 0; m < dustMotes.length; m++) {
        const pt = dustMotes[m];
        pt.nx += pt.vx * d * motionScale * (0.6 + windSpeed * 1.4);
        pt.ny += pt.vy * d * motionScale;
        if (pt.nx > 1.04) pt.nx = -0.04;
        if (pt.ny < 0.22) pt.ny = 0.96;
        if (pt.ny > 0.98) pt.ny = 0.26;
      }
      for (let s = 0; s < sawdustParticles.length; s++) {
        const sp = sawdustParticles[s];
        sp.life += d * motionScale * (0.65 + sawmillBuzzLevel * 0.95);
        if (sp.life >= 1) sp.life -= 1;
      }
      return getState();
    }

    function drawSkyAndDune(ctx, w, h) {
      const skyGrad = ctx.createLinearGradient(0, 0, 0, geom.horizonY);
      skyGrad.addColorStop(0, PALETTE.skyZenith);
      skyGrad.addColorStop(0.58, PALETTE.skyMid);
      skyGrad.addColorStop(1, PALETTE.skyHorizon);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, geom.horizonY + 6);

      if (ochreGlare > 0.01) {
        ctx.fillStyle = 'rgba(255, 236, 179, ' + (0.24 * ochreGlare).toFixed(3) + ')';
        ctx.fillRect(0, 0, w, geom.horizonY);
      }

      const crest = geom.duneCrest;
      const duneGrad = ctx.createLinearGradient(0, h * 0.24, 0, geom.horizonY + 8);
      duneGrad.addColorStop(0, PALETTE.duneSun);
      duneGrad.addColorStop(0.45, PALETTE.duneOchre);
      duneGrad.addColorStop(1, PALETTE.duneShadow);

      ctx.beginPath();
      ctx.moveTo(0, geom.horizonY + 6);
      ctx.lineTo(crest[0].x, crest[0].y);
      for (let i = 0; i < crest.length - 1; i++) {
        const mx = (crest[i].x + crest[i + 1].x) * 0.5;
        const my = (crest[i].y + crest[i + 1].y) * 0.5;
        ctx.quadraticCurveTo(crest[i].x, crest[i].y, mx, my);
      }
      const last = crest[crest.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.lineTo(w, geom.horizonY + 6);
      ctx.closePath();
      ctx.fillStyle = duneGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(crest[1].x, crest[1].y);
      ctx.quadraticCurveTo(w * 0.28, h * 0.34, w * 0.44, geom.horizonY + 2);
      ctx.lineTo(w * 0.66, geom.horizonY + 2);
      ctx.quadraticCurveTo(w * 0.58, h * 0.31, crest[3].x, crest[3].y);
      ctx.closePath();
      ctx.fillStyle = PALETTE.duneSlip;
      ctx.fill();

      ctx.strokeStyle = PALETTE.duneCrest;
      ctx.lineWidth = Math.max(1.5, h * 0.0025);
      ctx.beginPath();
      ctx.moveTo(crest[0].x, crest[0].y);
      for (let j = 0; j < crest.length - 1; j++) {
        const mx2 = (crest[j].x + crest[j + 1].x) * 0.5;
        const my2 = (crest[j].y + crest[j + 1].y) * 0.5;
        ctx.quadraticCurveTo(crest[j].x, crest[j].y, mx2, my2);
      }
      ctx.lineTo(last.x, last.y);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(139, 87, 32, 0.26)';
      ctx.lineWidth = 1;
      for (let r = 0; r < 5; r++) {
        const ry = h * (0.325 + r * 0.022);
        ctx.beginPath();
        ctx.moveTo(0, ry);
        ctx.bezierCurveTo(w * 0.32, ry - 6, w * 0.68, ry + 7, w, ry - 3);
        ctx.stroke();
      }

      if (dunePlume > 0.02 || windSpeed > 0.62) {
        const pAlpha = clamp(0.14 + dunePlume * 0.28 + (windSpeed - 0.5) * 0.2, 0, 0.48);
        ctx.fillStyle = 'rgba(241, 206, 130, ' + pAlpha.toFixed(3) + ')';
        for (let k = 0; k < crest.length; k++) {
          ctx.beginPath();
          ctx.ellipse(crest[k].x + 18, crest[k].y - 4, w * 0.055, h * 0.012, -0.08, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function drawGridAndShadows(ctx, w, h) {
      const plainGrad = ctx.createLinearGradient(0, geom.horizonY, 0, h);
      plainGrad.addColorStop(0, '#c89b54');
      plainGrad.addColorStop(1, '#ab7c39');
      ctx.fillStyle = plainGrad;
      ctx.fillRect(0, geom.horizonY, w, h - geom.horizonY);

      ctx.fillStyle = '#d3ab66';
      for (let i = 0; i < geom.crossLanes.length; i++) {
        const lane = geom.crossLanes[i];
        ctx.fillRect(0, lane.y - lane.thickness * 0.5, w, lane.thickness);
      }

      const st = geom.street;
      ctx.beginPath();
      ctx.moveTo(st.topLeftX, st.topY);
      ctx.lineTo(st.topRightX, st.topY);
      ctx.lineTo(st.botRightX, st.botY);
      ctx.lineTo(st.botLeftX, st.botY);
      ctx.closePath();
      ctx.fillStyle = PALETTE.streetDust;
      ctx.fill();

      ctx.strokeStyle = PALETTE.streetRut;
      ctx.lineWidth = 1.4;
      const rutOffsets = [-0.24, -0.16, 0.16, 0.24];
      for (let r = 0; r < rutOffsets.length; r++) {
        const u = 0.5 + rutOffsets[r];
        const tx = st.topLeftX + (st.topRightX - st.topLeftX) * u;
        const bx = st.botLeftX + (st.botRightX - st.botLeftX) * u;
        ctx.beginPath();
        ctx.moveTo(tx, st.topY + 2);
        ctx.lineTo(bx, st.botY);
        ctx.stroke();
      }

      ctx.save();
      ctx.fillStyle = 'rgba(23, 20, 18, 0.19)';
      ctx.strokeStyle = 'rgba(23, 20, 18, 0.21)';
      for (let p = 0; p < geom.pumps.length; p++) {
        const pm = geom.pumps[p];
        const sx = pm.x - w * 0.16;
        const sy = pm.baseY + h * 0.14;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(pm.x, pm.baseY);
        ctx.lineTo(sx, sy);
        ctx.stroke();
        const rx = pm.rotorR * 1.15;
        const ry = pm.rotorR * 0.42;
        for (let b = 0; b < 7; b++) {
          const ang = pumpAngles[p] + (b * Math.PI) / 7;
          ctx.beginPath();
          ctx.moveTo(sx - Math.cos(ang) * rx, sy - Math.sin(ang) * ry);
          ctx.lineTo(sx + Math.cos(ang) * rx, sy + Math.sin(ang) * ry);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawSquatHouses(ctx) {
      for (let i = 0; i < geom.houses.length; i++) {
        const hs = geom.houses[i];
        const sideW = hs.bw * 0.22;
        ctx.fillStyle = hs.tint === 0 ? PALETTE.plasterLight : PALETTE.plasterMid;
        if (houseGlarePulse > 0.05) {
          ctx.fillStyle = '#ecd09b';
        }
        ctx.fillRect(hs.x, hs.y, hs.bw, hs.bh);
        ctx.fillStyle = PALETTE.plasterShade;
        ctx.fillRect(hs.x + hs.bw, hs.y + hs.bh * 0.06, sideW, hs.bh * 0.94);

        const roofH = hs.bh * 0.30;
        ctx.beginPath();
        ctx.moveTo(hs.x - 4, hs.y + 2);
        ctx.lineTo(hs.x + hs.bw * 0.5, hs.y - roofH);
        ctx.lineTo(hs.x + hs.bw + sideW + 3, hs.y + 3);
        ctx.closePath();
        ctx.fillStyle = hs.roof === 'tin' ? PALETTE.tinRoof : PALETTE.tinRust;
        ctx.fill();

        ctx.fillStyle = PALETTE.timberShadow;
        const winW = Math.max(5, hs.bw * 0.13);
        const winH = Math.max(6, hs.bh * 0.28);
        ctx.fillRect(hs.x + hs.bw * 0.18, hs.y + hs.bh * 0.34, winW, winH);
        ctx.fillRect(hs.x + hs.bw * 0.62, hs.y + hs.bh * 0.34, winW, winH);
        ctx.fillRect(hs.x + hs.bw * 0.41, hs.y + hs.bh * 0.46, winW * 0.95, hs.bh * 0.54);
      }
    }

    function drawLumberYards(ctx) {
      const bonusTiers = Math.min(3, Math.floor(lumberStacksCut * 0.6));
      for (let i = 0; i < geom.lumberYards.length; i++) {
        const ly = geom.lumberYards[i];
        const totalTiers = ly.tiers + (i % 2 === 0 ? bonusTiers : Math.min(2, lumberStacksCut));
        const tierH = ly.sh / Math.max(4, ly.tiers);
        const endW = ly.sw * 0.18;
        ctx.fillStyle = 'rgba(23, 20, 18, 0.24)';
        ctx.fillRect(ly.x - 4, ly.y + ly.sh - 2, ly.sw + endW + 8, 6);

        for (let t = 0; t < totalTiers; t++) {
          const ty = ly.y + ly.sh - (t + 1) * tierH;
          const inset = t * 1.2;
          const pw = ly.sw - inset * 2;
          ctx.fillStyle = PALETTE.timberShadow;
          ctx.fillRect(ly.x + inset + pw * 0.16, ty + tierH - 2, 3, 2);
          ctx.fillRect(ly.x + inset + pw * 0.76, ty + tierH - 2, 3, 2);

          ctx.fillStyle = (lumberPulse > 0.1 && t === totalTiers - 1) ? '#efc379' : (t % 2 === 0 ? PALETTE.lumberCut : PALETTE.lumberPine);
          ctx.fillRect(ly.x + inset, ty, pw, tierH - 2);
          ctx.fillStyle = PALETTE.lumberEnd;
          ctx.fillRect(ly.x + inset + pw, ty + 1, endW, tierH - 2);
        }
      }
    }

    function drawSawmills(ctx) {
      for (let i = 0; i < geom.sawmills.length; i++) {
        const ml = geom.sawmills[i];
        ctx.fillStyle = PALETTE.timberShadow;
        ctx.fillRect(ml.x, ml.y, ml.mw, ml.mh);

        ctx.fillStyle = PALETTE.sawdustGold;
        ctx.beginPath();
        ctx.moveTo(ml.x + ml.mw * 0.26, ml.y + ml.mh);
        ctx.lineTo(ml.x + ml.mw * 0.52, ml.y + ml.mh * 0.72);
        ctx.lineTo(ml.x + ml.mw * 0.78, ml.y + ml.mh);
        ctx.closePath();
        ctx.fill();

        const cx = ml.x + ml.mw * 0.52;
        const cy = ml.y + ml.mh * 0.62;
        ctx.fillStyle = '#6f4720';
        ctx.fillRect(ml.x + ml.mw * 0.08, cy + ml.bladeR * 0.15, ml.mw * 0.44, ml.bladeR * 0.55);

        ctx.save();
        ctx.translate(cx, cy);
        if (sawmillBuzzLevel > 0.25) {
          ctx.strokeStyle = 'rgba(236, 208, 137, ' + (0.28 * sawmillBuzzLevel).toFixed(3) + ')';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 0, ml.bladeR * 1.18, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.rotate(bladeAngle * (ml.primary ? 1 : -1.15));
        ctx.fillStyle = PALETTE.steelBlade;
        ctx.beginPath();
        const teeth = 16;
        for (let k = 0; k < teeth * 2; k++) {
          const r = k % 2 === 0 ? ml.bladeR : ml.bladeR * 0.82;
          const a = (k * Math.PI) / teeth;
          const px = Math.cos(a) * r;
          const py = Math.sin(a) * r;
          if (k === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = PALETTE.sawRust;
        ctx.beginPath();
        ctx.arc(0, 0, ml.bladeR * 0.24, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = PALETTE.sawdustIron;
        const postW = Math.max(4, ml.mw * 0.04);
        ctx.fillRect(ml.x, ml.y, postW, ml.mh);
        ctx.fillRect(ml.x + ml.mw * 0.48, ml.y, postW, ml.mh);
        ctx.fillRect(ml.x + ml.mw - postW, ml.y, postW, ml.mh);

        ctx.beginPath();
        ctx.moveTo(ml.x - 8, ml.y + 4);
        ctx.lineTo(ml.x + ml.mw * 0.46, ml.y - ml.mh * 0.34);
        ctx.lineTo(ml.x + ml.mw + 10, ml.y + 4);
        ctx.closePath();
        ctx.fillStyle = PALETTE.millShed;
        ctx.fill();

        if (ml.primary) {
          ctx.fillStyle = 'rgba(236, 208, 137, 0.78)';
          for (let s = 0; s < sawdustParticles.length; s++) {
            const sp = sawdustParticles[s];
            const sx = cx + (sp.vx * sp.life * ml.mw * 1.8) + sp.ox * 16;
            const sy = cy + (sp.vy * sp.life * ml.mh * 1.9) + (sp.life * sp.life * ml.mh * 0.65);
            ctx.fillRect(sx, sy, sp.size, sp.size);
          }
        }
      }
    }

    function drawWindPumps(ctx) {
      for (let i = 0; i < geom.pumps.length; i++) {
        const pm = geom.pumps[i];
        const halfBase = pm.rotorR * 0.56;
        const halfTop = pm.rotorR * 0.14;
        ctx.strokeStyle = PALETTE.sawdustIron;
        ctx.lineWidth = Math.max(1.5, pm.rotorR * 0.055);
        ctx.beginPath();
        ctx.moveTo(pm.x - halfBase, pm.baseY);
        ctx.lineTo(pm.x - halfTop, pm.topY);
        ctx.moveTo(pm.x + halfBase, pm.baseY);
        ctx.lineTo(pm.x + halfTop, pm.topY);
        ctx.stroke();

        ctx.lineWidth = 1.1;
        const bays = 5;
        for (let b = 0; b < bays; b++) {
          const t0 = b / bays;
          const t1 = (b + 1) / bays;
          const y0 = pm.baseY + (pm.topY - pm.baseY) * t0;
          const y1 = pm.baseY + (pm.topY - pm.baseY) * t1;
          const w0 = halfBase + (halfTop - halfBase) * t0;
          const w1 = halfBase + (halfTop - halfBase) * t1;
          ctx.beginPath();
          ctx.moveTo(pm.x - w0, y0);
          ctx.lineTo(pm.x + w1, y1);
          ctx.moveTo(pm.x + w0, y0);
          ctx.lineTo(pm.x - w1, y1);
          ctx.stroke();
        }

        const strokeOffset = Math.sin(pumpAngles[i] * 2) * (pm.rotorR * 0.16);
        ctx.strokeStyle = PALETTE.millShed;
        ctx.beginPath();
        ctx.moveTo(pm.x, pm.topY);
        ctx.lineTo(pm.x, pm.baseY + 4 + strokeOffset);
        ctx.stroke();

        ctx.fillStyle = PALETTE.sawRust;
        ctx.beginPath();
        ctx.moveTo(pm.x, pm.topY);
        ctx.lineTo(pm.x + pm.rotorR * 1.18, pm.topY - pm.rotorR * 0.24);
        ctx.lineTo(pm.x + pm.rotorR * 1.12, pm.topY + pm.rotorR * 0.18);
        ctx.closePath();
        ctx.fill();

        ctx.save();
        ctx.translate(pm.x, pm.topY);
        ctx.rotate(pumpAngles[i]);
        ctx.strokeStyle = PALETTE.millShed;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(0, 0, pm.rotorR, 0, Math.PI * 2);
        ctx.arc(0, 0, pm.rotorR * 0.42, 0, Math.PI * 2);
        ctx.stroke();

        const vanes = 14;
        for (let v = 0; v < vanes; v++) {
          const a0 = (v * Math.PI * 2) / vanes;
          ctx.fillStyle = v % 2 === 0 ? '#9c9288' : '#6c6259';
          ctx.beginPath();
          ctx.moveTo(Math.cos(a0) * pm.rotorR * 0.24, Math.sin(a0) * pm.rotorR * 0.24);
          ctx.lineTo(Math.cos(a0 + 0.12) * pm.rotorR, Math.sin(a0 + 0.12) * pm.rotorR);
          ctx.lineTo(Math.cos(a0 + 0.30) * pm.rotorR * 0.96, Math.sin(a0 + 0.30) * pm.rotorR * 0.96);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function drawDustAndMarkers(ctx, w, h, renderOpts) {
      const optsObj = renderOpts || {};
      for (let i = 0; i < dustMotes.length; i++) {
        const dm = dustMotes[i];
        ctx.fillStyle = 'rgba(244, 221, 168, ' + (dm.alpha + streetDustPulse * 0.16).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(dm.nx * w, dm.ny * h, dm.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (optsObj.showMarkers !== false) {
        const stones = getStones(w, h);
        const hovIdx = typeof optsObj.hoveredStoneIndex === 'number' ? optsObj.hoveredStoneIndex : -1;
        const activeIdx = typeof optsObj.selectedStoneIndex === 'number' ? optsObj.selectedStoneIndex : selectedStoneIndex;
        ctx.font = '600 11px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let s = 0; s < stones.length; s++) {
          const st = stones[s];
          const isHot = st.index === activeIdx || st.index === hovIdx;
          const pinR = isHot ? 12.5 : 10;
          if (isHot) {
            ctx.strokeStyle = 'rgba(244, 241, 234, 0.85)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(st.x, st.y, pinR + 4 + stonePulse * 3, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.fillStyle = isHot ? PALETTE.sawRust : 'rgba(23, 20, 18, 0.84)';
          ctx.beginPath();
          ctx.arc(st.x, st.y, pinR, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = PALETTE.skyZenith;
          ctx.lineWidth = 1.4;
          ctx.stroke();
          ctx.fillStyle = PALETTE.markerCream;
          ctx.fillText(String(st.index + 1), st.x, st.y + 0.5);
        }
      }

      if (ruptureFlash > 0.01) {
        ctx.fillStyle = 'rgba(230, 190, 116, ' + (ruptureFlash * 0.38).toFixed(3) + ')';
        ctx.fillRect(0, 0, w, h);
      }
    }

    function renderDuneArrival(ctx, viewport, renderOpts) {
      if (!ctx) return;
      const vp = viewport || {};
      const optsObj = renderOpts || {};
      const w = Number(vp.width || vp.w) || geom.w || (ctx.canvas ? ctx.canvas.width : 1280);
      const h = Number(vp.height || vp.h) || geom.h || (ctx.canvas ? ctx.canvas.height : 800);
      const dpr = Number(vp.dpr) || geom.dpr || 1;

      if (Math.abs(w - geom.w) > 1 || Math.abs(h - geom.h) > 1 || !geom.street) {
        resize(w, h, dpr);
      }

      ctx.save();
      if (optsObj.alpha !== undefined) {
        ctx.globalAlpha = clamp(Number(optsObj.alpha), 0, 1);
      }
      drawSkyAndDune(ctx, w, h);
      drawGridAndShadows(ctx, w, h);
      drawWindPumps(ctx);
      drawSquatHouses(ctx);
      drawLumberYards(ctx);
      drawSawmills(ctx);
      drawDustAndMarkers(ctx, w, h, optsObj);
      ctx.restore();
    }

    seedParticles();
    resize(geom.w, geom.h, geom.dpr);

    return {
      ARRIVAL_STONES: ARRIVAL_STONES,
      PALETTE: PALETTE,
      resize: resize,
      getStones: getStones,
      hitTestStone: hitTestStone,
      setThresholdProgress: setThresholdProgress,
      crossThreshold: crossThreshold,
      summonByName: summonByName,
      attemptRecallGobletByName: attemptRecallGobletByName,
      setQuarantine: setQuarantine,
      toggleQuarantine: toggleQuarantine,
      inspectStone: inspectStone,
      triggerWindGust: triggerWindGust,
      triggerSawmillCut: triggerSawmillCut,
      step: step,
      renderDuneArrival: renderDuneArrival,
      unlockAudio: unlockAudio,
      setMuted: setMuted,
      isMuted: isMuted,
      playSawmillBuzz: playSawmillBuzz,
      playWindPumpClank: playWindPumpClank,
      getState: getState,
      reset: reset
    };
  }

  const api = Object.freeze({
    ARRIVAL_STONES: ARRIVAL_STONES,
    PALETTE: PALETTE,
    createDuneArrival: createDuneArrival
  });

  root.PyrrhaDuneArrival = api;
  if (typeof window !== 'undefined') {
    window.PyrrhaDuneArrival = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
