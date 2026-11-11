/*
 * City 18: Armilla (Chapter III - Thin Cities 3)
 * Layer: Morning Water Hymn (morning_water_hymn.js)
 * Inner Arch: Sky-perched porcelain, sunlit parabolic water-arcs, soapy spume,
 * prismatic morning mist rainbows, six graceful naiads, and Lydian water-organ WebAudio.
 */
(function (root) {
  'use strict';

  const TAU = Math.PI * 2;

  const NAIAD_ROSTER = Object.freeze([
    Object.freeze({ index: 0, id: 'naiad_bath_repose', name: 'Liriope', pose: 'stretching_in_bathtub', fixtureType: 'bathtub', note: 'C5', freqHz: 523.25, vowel: 'ah', caption: 'Luxuriating stretched out in a sky-perched clawfoot bathtub' }),
    Object.freeze({ index: 1, id: 'naiad_shower_arch', name: 'Ianassa', pose: 'arching_under_shower', fixtureType: 'shower_perch', note: 'D5', freqHz: 587.33, vowel: 'ee', caption: 'Arching her slender back beneath sunlit brass shower threads' }),
    Object.freeze({ index: 2, id: 'naiad_mirror_comb', name: 'Clymene', pose: 'combing_hair_at_mirror', fixtureType: 'suspended_mirror', note: 'E5', freqHz: 659.25, vowel: 'oo', caption: 'Combing long wet hair before a mirror clamped to a standpipe' }),
    Object.freeze({ index: 3, id: 'naiad_lavabo_splash', name: 'Melite', pose: 'splashing_at_lavabo', fixtureType: 'lavabo', note: 'F#5', freqHz: 739.99, vowel: 'ah', caption: 'Splashing morning spray from a cantilevered white lavabo' }),
    Object.freeze({ index: 4, id: 'naiad_bidet_balance', name: 'Phaethusa', pose: 'poised_on_porcelain_rim', fixtureType: 'bidet', note: 'G5', freqHz: 783.99, vowel: 'ee', caption: 'Poised lightly amid sifon spurts and iridescent soap spume' }),
    Object.freeze({ index: 5, id: 'naiad_crown_cantor', name: 'Aegle', pose: 'singing_morning_hymn', fixtureType: 'porcelain_bowl', note: 'B5', freqHz: 987.77, vowel: 'ah', caption: 'Singing morning hydraulic canons at the sky-crown basin' })
  ]);

  const MORNING_MODES = Object.freeze([
    Object.freeze({ id: 'dawn_rose', label: 'First Dawn Mist', sunRatio: 0.28 }),
    Object.freeze({ id: 'bright_morning', label: 'Sunlit Morning Hymn', sunRatio: 0.65 }),
    Object.freeze({ id: 'high_sunburst', label: 'Zenith Prismatic Spray', sunRatio: 0.92 })
  ]);

  const VOWEL_FORMANTS = {
    ah: { f1: 780, q1: 6.5, g1: 0.95, f2: 1180, q2: 8.5, g2: 0.65 },
    ee: { f1: 310, q1: 6.5, g1: 0.90, f2: 2320, q2: 9.5, g2: 0.58 },
    oo: { f1: 360, q1: 6.5, g1: 0.95, f2: 820, q2: 8.0, g2: 0.60 }
  };

  const RAINBOW_BANDS = [
    [255, 112, 118],
    [255, 174, 102],
    [255, 232, 128],
    [126, 228, 168],
    [110, 208, 246],
    [122, 152, 245],
    [186, 140, 242]
  ];

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function createHymnAudioEngine() {
    let ctx = null;
    let masterGain = null;
    let sprayGain = null;
    let sprayFilter = null;
    let spraySource = null;
    let voiceNodes = [];
    let unlocked = false;
    let muted = false;

    function buildPinkNoiseBuffer(audioCtx) {
      const len = Math.floor(audioCtx.sampleRate * 2.0);
      const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const out = buf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        out[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
        b6 = white * 0.115926;
      }
      return buf;
    }

    function unlock() {
      if (unlocked && ctx) {
        if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
          try { Promise.resolve(ctx.resume()).catch(function () {}); } catch (_e) {}
        }
        return true;
      }
      const Ctor = (root && (root.AudioContext || root.webkitAudioContext)) || null;
      if (!Ctor) return false;
      try {
        ctx = new Ctor();
        masterGain = ctx.createGain();
        masterGain.gain.value = muted ? 0 : 0.24;
        masterGain.connect(ctx.destination);

        const noiseBuf = buildPinkNoiseBuffer(ctx);
        spraySource = ctx.createBufferSource();
        spraySource.buffer = noiseBuf;
        spraySource.loop = true;
        sprayFilter = ctx.createBiquadFilter();
        sprayFilter.type = 'bandpass';
        sprayFilter.frequency.value = 1350;
        sprayFilter.Q.value = 0.85;
        sprayGain = ctx.createGain();
        sprayGain.gain.value = 0;
        spraySource.connect(sprayFilter);
        sprayFilter.connect(sprayGain);
        sprayGain.connect(masterGain);
        spraySource.start();

        voiceNodes = NAIAD_ROSTER.map(function (naiad, idx) {
          const vGain = ctx.createGain();
          vGain.gain.value = 0;
          vGain.connect(masterGain);

          const oscFund = ctx.createOscillator();
          oscFund.type = 'triangle';
          oscFund.frequency.value = naiad.freqHz;
          const fundGain = ctx.createGain();
          fundGain.gain.value = 0.22;

          const oscHarm = ctx.createOscillator();
          oscHarm.type = 'sine';
          oscHarm.frequency.value = naiad.freqHz * 2;
          const harmGain = ctx.createGain();
          harmGain.gain.value = 0.075;

          const oscVocal = ctx.createOscillator();
          oscVocal.type = 'sawtooth';
          oscVocal.frequency.value = naiad.freqHz;
          const fm = VOWEL_FORMANTS[naiad.vowel] || VOWEL_FORMANTS.ah;
          const bp1 = ctx.createBiquadFilter();
          bp1.type = 'bandpass';
          bp1.frequency.value = fm.f1;
          bp1.Q.value = fm.q1;
          const bp1Gain = ctx.createGain();
          bp1Gain.gain.value = 0.14 * fm.g1;

          const bp2 = ctx.createBiquadFilter();
          bp2.type = 'bandpass';
          bp2.frequency.value = fm.f2;
          bp2.Q.value = fm.q2;
          const bp2Gain = ctx.createGain();
          bp2Gain.gain.value = 0.12 * fm.g2;

          const vib = ctx.createOscillator();
          vib.type = 'sine';
          vib.frequency.value = 4.6 + idx * 0.22;
          const vibGain = ctx.createGain();
          vibGain.gain.value = 2.1;
          vib.connect(vibGain);
          vibGain.connect(oscFund.frequency);
          vibGain.connect(oscVocal.frequency);

          oscFund.connect(fundGain);
          fundGain.connect(vGain);
          oscHarm.connect(harmGain);
          harmGain.connect(vGain);
          oscVocal.connect(bp1);
          bp1.connect(bp1Gain);
          bp1Gain.connect(vGain);
          oscVocal.connect(bp2);
          bp2.connect(bp2Gain);
          bp2Gain.connect(vGain);

          oscFund.start();
          oscHarm.start();
          oscVocal.start();
          vib.start();
          return { vGain: vGain, oscFund: oscFund, oscHarm: oscHarm, oscVocal: oscVocal, vib: vib };
        });

        if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
          Promise.resolve(ctx.resume()).catch(function () {});
        }
        unlocked = true;
        return true;
      } catch (_err) {
        ctx = null;
        unlocked = false;
        return false;
      }
    }
    function syncLevels(voices, meanFlow, sunRatio) {
      if (!unlocked || !ctx || !masterGain) return;
      const now = ctx.currentTime;
      const targetMaster = muted ? 0 : 0.24;
      masterGain.gain.setTargetAtTime(targetMaster, now, 0.04);
      if (sprayGain && sprayFilter) {
        const bed = muted ? 0 : clamp(meanFlow * 0.16, 0, 0.22);
        sprayGain.gain.setTargetAtTime(bed, now, 0.06);
        sprayFilter.frequency.setTargetAtTime(950 + sunRatio * 1550 + meanFlow * 420, now, 0.08);
      }
      for (let i = 0; i < voiceNodes.length; i++) {
        const vn = voiceNodes[i];
        const vg = (!muted && voices[i]) ? clamp(voices[i].gain * 0.22, 0, 0.26) : 0;
        vn.vGain.gain.setTargetAtTime(vg, now, 0.05);
      }
    }

    function playValveChime(zoneIndex, isOpen) {
      if (!unlocked || muted || !ctx || !masterGain) return;
      try {
        const now = ctx.currentTime;
        const idx = clamp(Number(zoneIndex) || 0, 0, 5);
        const baseFreq = NAIAD_ROSTER[idx].freqHz;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const env = ctx.createGain();
        osc1.type = 'triangle';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(isOpen ? baseFreq * 0.5 : baseFreq * 0.66, now);
        osc1.frequency.exponentialRampToValueAtTime(isOpen ? baseFreq : baseFreq * 0.42, now + 0.16);
        osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
        env.gain.setValueAtTime(0.001, now);
        env.gain.linearRampToValueAtTime(0.14, now + 0.012);
        env.gain.exponentialRampToValueAtTime(0.0008, now + 0.22);
        osc1.connect(env);
        osc2.connect(env);
        env.connect(masterGain);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.24);
        osc2.stop(now + 0.24);
      } catch (_e) {}
    }

    function playSplashArpeggio(zoneIndex) {
      if (!unlocked || muted || !ctx || !masterGain) return;
      try {
        const now = ctx.currentTime;
        const idx = clamp(Number(zoneIndex) || 0, 0, 5);
        const rootHz = NAIAD_ROSTER[idx].freqHz;
        const ratios = [1.0, 1.125, 1.25, 1.5];
        for (let i = 0; i < ratios.length; i++) {
          const t0 = now + i * 0.042;
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(rootHz * ratios[i], t0);
          g.gain.setValueAtTime(0.0008, t0);
          g.gain.linearRampToValueAtTime(0.095, t0 + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0006, t0 + 0.24);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(t0);
          osc.stop(t0 + 0.26);
        }
      } catch (_e) {}
    }

    function setMutedFlag(flag) {
      muted = Boolean(flag);
      if (unlocked && ctx && masterGain) {
        masterGain.gain.setTargetAtTime(muted ? 0 : 0.24, ctx.currentTime, 0.03);
      }
      return muted;
    }

    function destroy() {
      if (ctx) {
        try {
          if (spraySource) spraySource.stop();
          for (let i = 0; i < voiceNodes.length; i++) {
            voiceNodes[i].oscFund.stop();
            voiceNodes[i].oscHarm.stop();
            voiceNodes[i].oscVocal.stop();
            voiceNodes[i].vib.stop();
          }
          if (typeof ctx.close === 'function') Promise.resolve(ctx.close()).catch(function () {});
        } catch (_e) {}
      }
      ctx = null;
      masterGain = null;
      sprayGain = null;
      sprayFilter = null;
      spraySource = null;
      voiceNodes = [];
      unlocked = false;
    }

    return {
      unlock: unlock,
      syncLevels: syncLevels,
      playValveChime: playValveChime,
      playSplashArpeggio: playSplashArpeggio,
      setMuted: setMutedFlag,
      isMuted: function () { return muted; },
      isUnlocked: function () { return unlocked; },
      destroy: destroy
    };
  }

  function createMorningWaterHymn(config) {
    const cfg = config || {};
    const audio = createHymnAudioEngine();
    if (cfg.muted) audio.setMuted(true);

    const state = {
      width: Math.max(240, Number(cfg.width) || 1280),
      height: Math.max(240, Number(cfg.height) || 800),
      reducedMotion: Boolean(cfg.reducedMotion),
      sunPhase: 'bright_morning',
      sunElevationRatio: 0.65,
      meanPressureBar: 2.8,
      timeSec: 0,
      rainbowVisibility: 0,
      outlets: [],
      perches: [],
      zoneFlows: [0, 0, 0, 0, 0, 0],
      activeJetCount: 0,
      activeNaiadCount: 0,
      singingVoiceCount: 0,
      particles: [],
      spumeBubbles: [],
      splashRings: [],
      voices: NAIAD_ROSTER.map(function (n) {
        return {
          index: n.index,
          id: n.id,
          name: n.name,
          pose: n.pose,
          fixtureType: n.fixtureType,
          note: n.note,
          freqHz: n.freqHz,
          vowel: n.vowel,
          caption: n.caption,
          flowRate: 0,
          gain: 0,
          singing: false,
          x: 0,
          y: 0
        };
      })
    };

    function fallbackPerch(idx) {
      const rx = [0.22, 0.35, 0.48, 0.62, 0.74, 0.52][idx] || 0.5;
      const ry = [0.68, 0.44, 0.54, 0.60, 0.66, 0.28][idx] || 0.5;
      const x = state.width * rx;
      const y = state.height * ry;
      return {
        zoneIndex: idx,
        fixtureType: NAIAD_ROSTER[idx].fixtureType,
        x: x,
        y: y,
        scale: 1,
        openRatio: state.zoneFlows[idx] > 0.05 ? 1 : 0,
        flowRate: state.zoneFlows[idx],
        mirrorX: x + 28,
        mirrorY: y - 16
      };
    }
    function resolvePerches() {
      const byZone = [null, null, null, null, null, null];
      for (let i = 0; i < state.perches.length; i++) {
        const p = state.perches[i];
        const z = clamp(Number(p.zoneIndex) || 0, 0, 5);
        if (!byZone[z]) byZone[z] = p;
      }
      for (let z = 0; z < 6; z++) {
        if (!byZone[z]) {
          let ox = null, oy = null, sc = 1;
          for (let j = 0; j < state.outlets.length; j++) {
            if (clamp(Number(state.outlets[j].zoneIndex) || 0, 0, 5) === z) {
              ox = state.outlets[j].x;
              oy = state.outlets[j].y;
              sc = Number(state.outlets[j].scale) || 1;
              break;
            }
          }
          const fb = fallbackPerch(z);
          if (ox !== null && oy !== null) {
            fb.x = ox;
            fb.y = oy + 18 * sc;
            fb.scale = sc;
            fb.mirrorX = ox + 28 * sc;
            fb.mirrorY = oy - 12 * sc;
          }
          byZone[z] = fb;
        }
      }
      return byZone;
    }

    function recomputeMetrics() {
      let jets = 0;
      for (let i = 0; i < state.outlets.length; i++) {
        if ((Number(state.outlets[i].flowRate) || 0) > 0.02) jets++;
      }
      state.activeJetCount = jets;

      const resolved = resolvePerches();
      let singingCount = 0;
      const pFactor = 0.68 + 0.14 * clamp(state.meanPressureBar / 2.8, 0.35, 1.45);
      for (let z = 0; z < 6; z++) {
        const flow = clamp(state.zoneFlows[z] || 0, 0, 1.5);
        const singing = flow > 0.06;
        const breath = state.reducedMotion
          ? 0.88
          : 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(state.timeSec * (1.35 + z * 0.19) + z * 1.04));
        const v = state.voices[z];
        v.flowRate = Number(flow.toFixed(4));
        v.singing = singing;
        v.gain = singing ? Number(clamp(flow * breath * pFactor, 0.05, 1.0).toFixed(4)) : 0;
        v.x = resolved[z].x;
        v.y = resolved[z].y;
        if (singing) singingCount++;
      }
      state.singingVoiceCount = singingCount;
      state.activeNaiadCount = singingCount;
    }

    function syncHydraulics(data) {
      const d = data || {};
      if (Number.isFinite(d.meanPressureBar)) {
        state.meanPressureBar = clamp(Number(d.meanPressureBar), 0, 6.0);
      }
      const rawOutlets = Array.isArray(d.outlets) ? d.outlets : [];
      const outletMax = [0, 0, 0, 0, 0, 0];
      state.outlets = rawOutlets.map(function (o, idx) {
        const z = clamp(Number(o.zoneIndex) || 0, 0, 5);
        const flow = Math.max(0, Number(o.flowRate) || 0);
        if (flow > outletMax[z]) outletMax[z] = flow;
        return {
          id: o.id || ('outlet_' + idx),
          zoneIndex: z,
          type: o.type || 'tap',
          x: Number(o.x) || state.width * 0.5,
          y: Number(o.y) || state.height * 0.5,
          dirX: Number.isFinite(o.dirX) ? Number(o.dirX) : 0.45,
          dirY: Number.isFinite(o.dirY) ? Number(o.dirY) : -0.35,
          flowRate: flow,
          scale: clamp(Number(o.scale) || 1, 0.35, 2.5)
        };
      });

      const perchMax = [0, 0, 0, 0, 0, 0];
      if (Array.isArray(d.perches)) {
        state.perches = d.perches.map(function (p) {
          const z = clamp(Number(p.zoneIndex) || 0, 0, 5);
          const flow = Number.isFinite(p.flowRate)
            ? Math.max(0, Number(p.flowRate))
            : Math.max(0, (Number(p.openRatio) || 0) * 0.8);
          if (flow > perchMax[z]) perchMax[z] = flow;
          const sc = clamp(Number(p.scale) || 1, 0.35, 2.5);
          const px = Number(p.x) || state.width * 0.5;
          const py = Number(p.y) || state.height * 0.5;
          return {
            zoneIndex: z,
            fixtureType: p.fixtureType || NAIAD_ROSTER[z].fixtureType,
            x: px,
            y: py,
            scale: sc,
            openRatio: clamp(Number.isFinite(p.openRatio) ? Number(p.openRatio) : (flow > 0.05 ? 1 : 0), 0, 1),
            flowRate: flow,
            mirrorX: Number.isFinite(p.mirrorX) ? Number(p.mirrorX) : px + 26 * sc,
            mirrorY: Number.isFinite(p.mirrorY) ? Number(p.mirrorY) : py - 14 * sc
          };
        });
      } else {
        for (let i = 0; i < state.perches.length; i++) {
          const z = state.perches[i].zoneIndex;
          state.perches[i].flowRate = outletMax[z];
          state.perches[i].openRatio = outletMax[z] > 0.05 ? 1 : 0;
        }
      }

      for (let z = 0; z < 6; z++) {
        state.zoneFlows[z] = Math.max(outletMax[z], perchMax[z]);
      }
      recomputeMetrics();
      return state;
    }

    function spawnDroplet(x, y, vx, vy, size, zoneIndex, golden) {
      if (state.particles.length >= 260) state.particles.shift();
      state.particles.push({
        x: x, y: y, vx: vx, vy: vy,
        r: size, age: 0, life: 0.55 + Math.random() * 0.55,
        zoneIndex: zoneIndex, golden: Boolean(golden)
      });
    }

    function spawnSpume(x, y, scale, zoneIndex) {
      if (state.spumeBubbles.length >= 68) state.spumeBubbles.shift();
      state.spumeBubbles.push({
        x: x + (Math.random() - 0.5) * 26 * scale,
        y: y + (Math.random() - 0.5) * 14 * scale,
        vx: (Math.random() - 0.42) * 16,
        vy: -(14 + Math.random() * 22),
        r: (2.6 + Math.random() * 4.8) * clamp(scale, 0.65, 1.45),
        phase: Math.random() * TAU,
        hueShift: Math.random(),
        age: 0,
        life: 2.2 + Math.random() * 2.1,
        zoneIndex: zoneIndex
      });
    }

    function triggerSplash(x, y, zoneIndex) {
      const z = clamp(Number(zoneIndex) || 0, 0, 5);
      const perches = resolvePerches();
      const px = Number.isFinite(x) ? Number(x) : perches[z].x;
      const py = Number.isFinite(y) ? Number(y) : perches[z].y;
      state.splashRings.push({ x: px, y: py, r: 4, maxR: 44, alpha: 0.92 });
      if (state.splashRings.length > 16) state.splashRings.shift();
      const dropCount = state.reducedMotion ? 6 : 20;
      for (let i = 0; i < dropCount; i++) {
        const ang = -Math.PI * (0.12 + 0.76 * (i / Math.max(1, dropCount - 1)));
        const spd = state.reducedMotion ? 36 : (55 + Math.random() * 95);
        spawnDroplet(px, py, Math.cos(ang) * spd, Math.sin(ang) * spd - 24, 1.8 + (i % 3) * 0.65, z, i % 2 === 0);
      }
      const spumeCount = state.reducedMotion ? 4 : 9;
      for (let j = 0; j < spumeCount; j++) {
        spawnSpume(px, py - 4, perches[z].scale || 1, z);
      }
      audio.playSplashArpeggio(z);
    }
    function stepSub(dt) {
      state.timeSec += dt;
      let flowingZones = 0;
      let flowSum = 0;
      for (let z = 0; z < 6; z++) {
        const f = clamp(state.zoneFlows[z] || 0, 0, 1.2);
        flowSum += Math.min(1, f);
        if (f > 0.06) flowingZones++;
      }
      const meanFlow = flowSum / 6;
      const sunBoost = 0.76 + 0.24 * state.sunElevationRatio;
      let targetRainbow = 0;
      if (flowingZones >= 4) {
        targetRainbow = clamp((0.46 + 0.072 * flowingZones) * clamp(meanFlow * 1.45, 0.82, 1.08) * sunBoost, 0.48, 0.95);
      } else if (flowingZones > 0) {
        targetRainbow = 0.11 * flowingZones * clamp(meanFlow * 1.8, 0.55, 1.0) * sunBoost;
      }
      const rbRate = state.reducedMotion ? 12.0 : (targetRainbow >= state.rainbowVisibility ? 3.6 : 4.6);
      state.rainbowVisibility = lerp(state.rainbowVisibility, targetRainbow, 1 - Math.exp(-dt * rbRate));
      if (targetRainbow === 0 && state.rainbowVisibility < 0.002) state.rainbowVisibility = 0;

      const perches = resolvePerches();
      if (state.reducedMotion) {
        state.particles.length = 0;
        const steadySpume = [];
        for (let z = 0; z < 6; z++) {
          if (state.zoneFlows[z] > 0.08) {
            const p = perches[z];
            const sc = p.scale || 1;
            for (let k = 0; k < 3; k++) {
              steadySpume.push({
                x: p.x + (k - 1) * 14 * sc,
                y: p.y - (18 + k * 9) * sc,
                vx: 0, vy: 0,
                r: (3.2 + k * 0.9) * clamp(sc, 0.7, 1.3),
                phase: k * 1.7 + z,
                hueShift: (z * 0.17 + k * 0.29) % 1,
                age: 0.4, life: 2.0, zoneIndex: z
              });
            }
          }
        }
        state.spumeBubbles = steadySpume;
      } else {
        for (let i = 0; i < state.outlets.length; i++) {
          const o = state.outlets[i];
          if (o.flowRate <= 0.04) continue;
          const chance = clamp(o.flowRate * dt * 28, 0, 2.4);
          const count = Math.floor(chance) + (Math.random() < (chance % 1) ? 1 : 0);
          for (let c = 0; c < count; c++) {
            const spread = o.type === 'shower' ? 0.42 : 0.18;
            const spd = (o.type === 'shower' ? 95 : 132) * (0.65 + 0.5 * Math.min(1.2, o.flowRate)) * clamp(o.scale, 0.65, 1.45);
            const dx = o.dirX + (Math.random() - 0.5) * spread;
            const dy = o.dirY + (Math.random() - 0.5) * spread;
            spawnDroplet(o.x, o.y, dx * spd, dy * spd, (1.4 + Math.random() * 1.5) * clamp(o.scale, 0.7, 1.3), o.zoneIndex, Math.random() < 0.55);
          }
        }
        for (let z = 0; z < 6; z++) {
          const f = state.zoneFlows[z];
          if (f <= 0.08) continue;
          const weight = (z === 0 || z === 3 || z === 4) ? 5.2 : 2.4;
          if (Math.random() < f * weight * dt) {
            spawnSpume(perches[z].x, perches[z].y - 6, perches[z].scale || 1, z);
          }
        }
        for (let i = state.particles.length - 1; i >= 0; i--) {
          const pt = state.particles[i];
          pt.age += dt;
          if (pt.age >= pt.life || pt.y > state.height + 40) {
            state.particles.splice(i, 1);
            continue;
          }
          pt.vy += 260 * dt;
          pt.vx += 8 * dt;
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
        }
        for (let j = state.spumeBubbles.length - 1; j >= 0; j--) {
          const b = state.spumeBubbles[j];
          b.age += dt;
          if (b.age >= b.life || b.y < -30) {
            state.spumeBubbles.splice(j, 1);
            continue;
          }
          b.x += (b.vx + Math.sin(state.timeSec * 1.9 + b.phase) * 12) * dt;
          b.y += b.vy * dt;
        }
      }

      for (let r = state.splashRings.length - 1; r >= 0; r--) {
        const sr = state.splashRings[r];
        sr.r += dt * 58;
        sr.alpha -= dt * 1.45;
        if (sr.alpha <= 0.02 || sr.r >= sr.maxR) state.splashRings.splice(r, 1);
      }

      recomputeMetrics();
      audio.syncLevels(state.voices, meanFlow, state.sunElevationRatio);
    }

    function step(dtSec) {
      const raw = Number(dtSec);
      const total = clamp(Number.isFinite(raw) ? raw : 0.016, 0, 10.0);
      if (total <= 0) {
        recomputeMetrics();
        return state;
      }
      const steps = Math.max(1, Math.ceil(total / 0.05));
      const subDt = total / steps;
      for (let s = 0; s < steps; s++) stepSub(subDt);
      return state;
    }

    function renderMistAndRainbow(ctx, perches) {
      const sunR = state.sunElevationRatio;
      const warmTint = state.sunPhase === 'dawn_rose'
        ? [255, 222, 214]
        : (state.sunPhase === 'high_sunburst' ? [255, 246, 206] : [232, 246, 252]);

      ctx.save();
      for (let z = 0; z < 6; z++) {
        const flow = clamp(state.zoneFlows[z] || 0, 0, 1.2);
        if (flow <= 0.04) continue;
        const p = perches[z];
        const rad = (54 + flow * 44) * clamp(p.scale || 1, 0.65, 1.5);
        const g = ctx.createRadialGradient(p.x, p.y - 10, 4, p.x, p.y - 10, rad);
        const a0 = clamp(0.18 * flow, 0.03, 0.24);
        g.addColorStop(0, 'rgba(' + warmTint[0] + ',' + warmTint[1] + ',' + warmTint[2] + ',' + a0.toFixed(3) + ')');
        g.addColorStop(0.55, 'rgba(255,229,150,' + (a0 * 0.48).toFixed(3) + ')');
        g.addColorStop(1, 'rgba(230,246,252,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y - 10, rad, 0, TAU);
        ctx.fill();
      }

      if (state.rainbowVisibility > 0.006) {
        const vis = clamp(state.rainbowVisibility, 0, 1);
        const cx = state.width * 0.51;
        const cy = state.height * (0.80 - sunR * 0.14);
        const baseR = Math.min(state.width, state.height) * 0.46;
        const bandW = Math.max(3.2, Math.min(state.width, state.height) * 0.0095);
        ctx.lineCap = 'round';
        for (let b = 0; b < RAINBOW_BANDS.length; b++) {
          const rgb = RAINBOW_BANDS[b];
          const r = baseR - b * (bandW * 0.86);
          const alpha = vis * 0.22;
          ctx.strokeStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha.toFixed(3) + ')';
          ctx.lineWidth = bandW * 1.35;
          ctx.beginPath();
          ctx.arc(cx, cy, r, Math.PI * 1.11, Math.PI * 1.89);
          ctx.stroke();
        }
        if (vis > 0.52) {
          ctx.strokeStyle = 'rgba(255,248,218,' + ((vis - 0.5) * 0.18).toFixed(3) + ')';
          ctx.lineWidth = bandW * 2.1;
          ctx.beginPath();
          ctx.arc(cx, cy, baseR + bandW * 1.2, Math.PI * 1.14, Math.PI * 1.86);
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    function renderNaiads(ctx, perches) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (let z = 0; z < 6; z++) {
        const p = perches[z];
        const naiad = NAIAD_ROSTER[z];
        const flow = clamp(state.zoneFlows[z] || 0, 0, 1.3);
        const active = flow > 0.08;
        const sc = clamp(p.scale || 1, 0.58, 1.55);
        const sway = state.reducedMotion ? 0 : Math.sin(state.timeSec * (1.7 + z * 0.23) + z) * 2.2 * sc;
        const alpha = active ? clamp(0.76 + flow * 0.22, 0.76, 0.98) : 0.36;

        if (z === 2 || p.fixtureType === 'suspended_mirror') {
          const mx = p.mirrorX;
          const my = p.mirrorY;
          ctx.save();
          ctx.beginPath();
          ctx.ellipse(mx, my, 10 * sc, 15 * sc, -0.12, 0, TAU);
          ctx.clip();
          const mg = ctx.createLinearGradient(mx - 10 * sc, my - 15 * sc, mx + 10 * sc, my + 15 * sc);
          mg.addColorStop(0, 'rgba(110,193,228,0.45)');
          mg.addColorStop(0.55, 'rgba(255,229,150,' + (active ? '0.58' : '0.24') + ')');
          mg.addColorStop(1, 'rgba(250,253,254,0.38)');
          ctx.fillStyle = mg;
          ctx.fillRect(mx - 14 * sc, my - 18 * sc, 28 * sc, 36 * sc);
          ctx.fillStyle = 'rgba(250,253,254,' + (alpha * 0.65).toFixed(3) + ')';
          ctx.beginPath();
          ctx.arc(mx - 1 * sc, my - 4 * sc, 3.2 * sc, 0, TAU);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,229,150,' + (alpha * 0.72).toFixed(3) + ')';
          ctx.lineWidth = 1.6 * sc;
          ctx.beginPath();
          ctx.moveTo(mx - 1 * sc, my - 1 * sc);
          ctx.quadraticCurveTo(mx + 3 * sc, my + 6 * sc, mx - 2 * sc, my + 12 * sc);
          ctx.stroke();
          ctx.restore();
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        const ivory = 'rgba(250,253,254,' + alpha.toFixed(3) + ')';
        const goldRim = 'rgba(255,229,150,' + (active ? 0.88 : 0.32).toFixed(3) + ')';
        const hairCol = 'rgba(255,236,176,' + (active ? 0.84 : 0.35).toFixed(3) + ')';

        if (active) {
          const glow = ctx.createRadialGradient(0, -14 * sc, 2 * sc, 0, -14 * sc, 32 * sc);
          glow.addColorStop(0, 'rgba(255,229,150,0.30)');
          glow.addColorStop(1, 'rgba(255,229,150,0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(0, -14 * sc, 32 * sc, 0, TAU);
          ctx.fill();

          const ringCount = state.reducedMotion ? 2 : 3;
          for (let r = 0; r < ringCount; r++) {
            const prog = state.reducedMotion
              ? (0.35 + r * 0.32)
              : ((state.timeSec * 0.68 + r / ringCount + z * 0.17) % 1);
            const rr = (8 + prog * 24) * sc;
            const ra = (1 - prog) * 0.44 * clamp(flow, 0.2, 1.0);
            ctx.strokeStyle = 'rgba(255,235,168,' + ra.toFixed(3) + ')';
            ctx.lineWidth = 1.25 * sc;
            ctx.beginPath();
            ctx.arc(0, -22 * sc, rr, 0, TAU);
            ctx.stroke();
          }
        }

        ctx.strokeStyle = ivory;
        ctx.fillStyle = ivory;
        ctx.lineWidth = 2.6 * sc;

        if (naiad.pose === 'stretching_in_bathtub') {
          ctx.beginPath();
          ctx.arc(-13 * sc, -11 * sc + sway * 0.25, 4.2 * sc, 0, TAU);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-10 * sc, -8 * sc);
          ctx.bezierCurveTo(-3 * sc, -3 * sc, 6 * sc, -3 * sc, 13 * sc, -8 * sc + sway * 0.3);
          ctx.lineTo(19 * sc, -3 * sc);
          ctx.moveTo(-8 * sc, -8 * sc);
          ctx.quadraticCurveTo(-15 * sc, -21 * sc, -6 * sc + sway * 0.4, -26 * sc);
          ctx.stroke();
          ctx.strokeStyle = hairCol;
          ctx.lineWidth = 1.5 * sc;
          ctx.beginPath();
          ctx.moveTo(-15 * sc, -10 * sc);
          ctx.bezierCurveTo(-22 * sc, -4 * sc, -21 * sc, 4 * sc, -25 * sc, 9 * sc);
          ctx.stroke();
        } else if (naiad.pose === 'arching_under_shower') {
          ctx.beginPath();
          ctx.arc(4 * sc + sway * 0.3, -26 * sc, 4.2 * sc, 0, TAU);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(2 * sc, -22 * sc);
          ctx.bezierCurveTo(-5 * sc, -14 * sc, -4 * sc, -5 * sc, 1 * sc, 4 * sc);
          ctx.moveTo(2 * sc, -20 * sc);
          ctx.quadraticCurveTo(9 * sc, -31 * sc, 3 * sc + sway * 0.4, -36 * sc);
          ctx.moveTo(1 * sc, -19 * sc);
          ctx.quadraticCurveTo(-7 * sc, -27 * sc, -3 * sc, -34 * sc);
          ctx.stroke();
          ctx.strokeStyle = hairCol;
          ctx.lineWidth = 1.6 * sc;
          ctx.beginPath();
          ctx.moveTo(6 * sc, -24 * sc);
          ctx.bezierCurveTo(13 * sc, -16 * sc, 11 * sc, -6 * sc, 14 * sc + sway * 0.5, 1 * sc);
          ctx.stroke();
        } else if (naiad.pose === 'combing_hair_at_mirror') {
          ctx.beginPath();
          ctx.arc(-2 * sc, -23 * sc, 4.1 * sc, 0, TAU);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-2 * sc, -19 * sc);
          ctx.quadraticCurveTo(-4 * sc, -9 * sc, -1 * sc, 2 * sc);
          ctx.moveTo(-2 * sc, -17 * sc);
          ctx.quadraticCurveTo(-11 * sc, -24 * sc, -6 * sc, -29 * sc);
          ctx.moveTo(-1 * sc, -17 * sc);
          ctx.quadraticCurveTo(8 * sc, -14 * sc, 11 * sc, -18 * sc + sway * 0.4);
          ctx.stroke();
          ctx.strokeStyle = hairCol;
          ctx.lineWidth = 1.7 * sc;
          for (let h = -1; h <= 1; h++) {
            ctx.beginPath();
            ctx.moveTo((-4 + h * 1.6) * sc, -22 * sc);
            ctx.bezierCurveTo((-10 + h * 2) * sc, -12 * sc, (-7 + h * 2) * sc + sway * 0.6, -3 * sc, (-11 + h * 2.2) * sc, 6 * sc);
            ctx.stroke();
          }
        } else if (naiad.pose === 'splashing_at_lavabo') {
          ctx.beginPath();
          ctx.arc(-5 * sc, -22 * sc + sway * 0.25, 4.1 * sc, 0, TAU);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(-5 * sc, -18 * sc);
          ctx.quadraticCurveTo(-9 * sc, -9 * sc, -6 * sc, 3 * sc);
          ctx.moveTo(-4 * sc, -16 * sc);
          ctx.quadraticCurveTo(4 * sc, -12 * sc, 10 * sc, -15 * sc - Math.abs(sway) * 0.5);
          ctx.moveTo(-4 * sc, -15 * sc);
          ctx.quadraticCurveTo(3 * sc, -9 * sc, 9 * sc, -11 * sc + sway * 0.4);
          ctx.stroke();
        } else if (naiad.pose === 'poised_on_porcelain_rim') {
          ctx.beginPath();
          ctx.arc(0, -27 * sc + sway * 0.2, 4.1 * sc, 0, TAU);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, -23 * sc);
          ctx.quadraticCurveTo(2 * sc, -13 * sc, 0, -2 * sc);
          ctx.moveTo(0, -11 * sc);
          ctx.quadraticCurveTo(8 * sc, -9 * sc, 11 * sc, -3 * sc);
          ctx.moveTo(0, -20 * sc);
          ctx.quadraticCurveTo(-11 * sc, -23 * sc + sway * 0.4, -15 * sc, -18 * sc);
          ctx.moveTo(0, -20 * sc);
          ctx.quadraticCurveTo(11 * sc, -24 * sc - sway * 0.4, 15 * sc, -19 * sc);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(0, -25 * sc, 4.3 * sc, 0, TAU);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, -21 * sc);
          ctx.quadraticCurveTo(0, -10 * sc, 0, 2 * sc);
          ctx.moveTo(0, -18 * sc);
          ctx.quadraticCurveTo(-10 * sc, -25 * sc, -14 * sc, -31 * sc + sway * 0.35);
          ctx.moveTo(0, -18 * sc);
          ctx.quadraticCurveTo(10 * sc, -25 * sc, 14 * sc, -31 * sc - sway * 0.35);
          ctx.stroke();
        }

        ctx.strokeStyle = goldRim;
        ctx.lineWidth = 1.1 * sc;
        ctx.beginPath();
        ctx.arc(0, -22 * sc, 6.2 * sc, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }
    function renderWaterStreams(ctx) {
      ctx.save();
      ctx.lineCap = 'round';
      for (let i = 0; i < state.outlets.length; i++) {
        const o = state.outlets[i];
        const flow = clamp(o.flowRate || 0, 0, 1.4);
        if (flow <= 0.02) continue;
        const sc = clamp(o.scale || 1, 0.55, 1.65);

        if (o.type === 'shower') {
          const threads = 11;
          const len = (52 + flow * 36) * sc;
          for (let t = 0; t < threads; t++) {
            const u = (t / (threads - 1)) - 0.5;
            const ex = o.x + (o.dirX * 0.4 + u * 0.68) * len;
            const ey = o.y + Math.max(0.55, o.dirY) * len;
            const shimmer = state.reducedMotion ? 0.62 : (0.44 + 0.32 * Math.sin(state.timeSec * 9 + t * 1.3));
            ctx.strokeStyle = t % 2 === 0
              ? 'rgba(255,229,150,' + (shimmer * clamp(flow, 0.25, 1)).toFixed(3) + ')'
              : 'rgba(250,253,254,' + (shimmer * 1.1 * clamp(flow, 0.25, 1)).toFixed(3) + ')';
            ctx.lineWidth = (1.05 + flow * 0.5) * sc;
            ctx.beginPath();
            ctx.moveTo(o.x + u * 8 * sc, o.y);
            ctx.quadraticCurveTo((o.x + ex) * 0.5, o.y + len * 0.48, ex, ey);
            ctx.stroke();
          }
        } else if (o.type === 'overflow') {
          const dropH = (44 + flow * 34) * sc;
          const sway = state.reducedMotion ? 0 : Math.sin(state.timeSec * 3.1 + i) * 4 * sc;
          ctx.strokeStyle = 'rgba(230,246,252,' + clamp(flow * 0.72, 0.18, 0.78).toFixed(3) + ')';
          ctx.lineWidth = (2.4 + flow * 1.8) * sc;
          ctx.beginPath();
          ctx.moveTo(o.x, o.y);
          ctx.bezierCurveTo(o.x + o.dirX * 12 * sc, o.y + dropH * 0.35, o.x + sway, o.y + dropH * 0.7, o.x + sway * 1.3, o.y + dropH);
          ctx.stroke();
        } else {
          const isUp = o.type === 'bidet_jet' || o.type === 'sifon_spurt';
          const vx = o.dirX * (isUp ? 46 : 64) * (0.6 + 0.45 * flow) * sc;
          const vy = (isUp ? -Math.abs(o.dirY || 0.75) * 78 : o.dirY * 44) * (0.6 + 0.45 * flow) * sc;
          const grav = 165 * sc;
          const dur = isUp ? 0.78 : 0.66;
          ctx.strokeStyle = 'rgba(230,246,252,' + clamp(0.38 + flow * 0.48, 0.25, 0.90).toFixed(3) + ')';
          ctx.lineWidth = (2.1 + flow * 2.1) * sc;
          ctx.beginPath();
          let lx = o.x, ly = o.y;
          ctx.moveTo(lx, ly);
          for (let s = 1; s <= 12; s++) {
            const tt = (s / 12) * dur;
            lx = o.x + vx * tt;
            ly = o.y + vy * tt + 0.5 * grav * tt * tt;
            ctx.lineTo(lx, ly);
          }
          ctx.stroke();

          ctx.strokeStyle = 'rgba(255,229,150,' + clamp(0.32 + flow * 0.45, 0.22, 0.85).toFixed(3) + ')';
          ctx.lineWidth = (1.0 + flow * 0.8) * sc;
          ctx.stroke();

          /* Glistening splash crown at landing */
          ctx.strokeStyle = 'rgba(250,253,254,' + clamp(flow * 0.75, 0.2, 0.85).toFixed(3) + ')';
          ctx.lineWidth = 1.2 * sc;
          ctx.beginPath();
          ctx.ellipse(lx, ly, 7.5 * sc * clamp(flow, 0.4, 1.1), 2.8 * sc, 0, 0, TAU);
          ctx.stroke();
          for (let p = -2; p <= 2; p++) {
            ctx.beginPath();
            ctx.moveTo(lx + p * 2.4 * sc, ly);
            ctx.lineTo(lx + p * 3.8 * sc, ly - (3.5 + (2 - Math.abs(p)) * 1.6) * sc * clamp(flow, 0.4, 1.1));
            ctx.stroke();
          }

          if (state.reducedMotion) {
            ctx.fillStyle = 'rgba(255,238,178,0.82)';
            for (let k = 3; k <= 9; k += 3) {
              const tk = (k / 12) * dur;
              ctx.beginPath();
              ctx.arc(o.x + vx * tk, o.y + vy * tk + 0.5 * grav * tk * tk, 1.9 * sc, 0, TAU);
              ctx.fill();
            }
          }
        }
      }
      ctx.restore();
    }

    function renderParticlesAndSpume(ctx) {
      ctx.save();
      for (let r = 0; r < state.splashRings.length; r++) {
        const sr = state.splashRings[r];
        ctx.strokeStyle = 'rgba(255,236,176,' + clamp(sr.alpha, 0, 1).toFixed(3) + ')';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(sr.x, sr.y, sr.r, sr.r * 0.42, 0, 0, TAU);
        ctx.stroke();
      }
      for (let i = 0; i < state.particles.length; i++) {
        const pt = state.particles[i];
        const a = clamp(1 - pt.age / pt.life, 0, 1) * 0.88;
        ctx.fillStyle = pt.golden
          ? 'rgba(255,229,150,' + a.toFixed(3) + ')'
          : 'rgba(250,253,254,' + a.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, TAU);
        ctx.fill();
      }
      for (let j = 0; j < state.spumeBubbles.length; j++) {
        const b = state.spumeBubbles[j];
        const fade = Math.sin(clamp(b.age / b.life, 0.05, 0.98) * Math.PI);
        const a = clamp(fade * 0.78, 0.12, 0.82);
        ctx.fillStyle = 'rgba(230,246,252,' + (a * 0.28).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, TAU);
        ctx.fill();
        ctx.strokeStyle = b.hueShift < 0.34
          ? 'rgba(110,208,246,' + a.toFixed(3) + ')'
          : (b.hueShift < 0.67 ? 'rgba(255,188,214,' + a.toFixed(3) + ')' : 'rgba(255,229,150,' + a.toFixed(3) + ')');
        ctx.lineWidth = 1.15;
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,' + clamp(a * 1.1, 0, 0.95).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.34, b.y - b.r * 0.34, Math.max(0.8, b.r * 0.24), 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    function render(ctx, optionalHydraulics) {
      if (!ctx) return;
      if (optionalHydraulics && (optionalHydraulics.outlets || optionalHydraulics.perches)) {
        syncHydraulics(optionalHydraulics);
      }
      const perches = resolvePerches();
      renderMistAndRainbow(ctx, perches);
      renderNaiads(ctx, perches);
      renderWaterStreams(ctx);
      renderParticlesAndSpume(ctx);
    }

    function setSunPhase(phaseOrRatio) {
      if (phaseOrRatio === undefined || phaseOrRatio === null || phaseOrRatio === 'next' || phaseOrRatio === 'cycle') {
        const curIdx = MORNING_MODES.findIndex(function (m) { return m.id === state.sunPhase; });
        const next = MORNING_MODES[(curIdx + 1) % MORNING_MODES.length];
        state.sunPhase = next.id;
        state.sunElevationRatio = next.sunRatio;
      } else if (typeof phaseOrRatio === 'number' && Number.isFinite(phaseOrRatio)) {
        state.sunElevationRatio = clamp(phaseOrRatio, 0.05, 1.0);
        let best = MORNING_MODES[0];
        let bestDiff = Math.abs(state.sunElevationRatio - best.sunRatio);
        for (let i = 1; i < MORNING_MODES.length; i++) {
          const diff = Math.abs(state.sunElevationRatio - MORNING_MODES[i].sunRatio);
          if (diff < bestDiff) { best = MORNING_MODES[i]; bestDiff = diff; }
        }
        state.sunPhase = best.id;
      } else if (typeof phaseOrRatio === 'string') {
        const q = phaseOrRatio.trim().toLowerCase();
        const hit = MORNING_MODES.find(function (m) {
          return m.id.toLowerCase() === q || m.label.toLowerCase() === q;
        });
        if (hit) {
          state.sunPhase = hit.id;
          state.sunElevationRatio = hit.sunRatio;
        }
      }
      return getState();
    }

    function getState() {
      return {
        activeNaiadCount: state.activeNaiadCount,
        singingVoiceCount: state.singingVoiceCount,
        activeJetCount: state.activeJetCount,
        particleCount: state.particles.length,
        spumeBubbleCount: state.spumeBubbles.length,
        rainbowVisibility: Number(state.rainbowVisibility.toFixed(4)),
        sunPhase: state.sunPhase,
        sunElevationRatio: Number(state.sunElevationRatio.toFixed(4)),
        muted: audio.isMuted(),
        audioUnlocked: audio.isUnlocked(),
        subterraneanGodsAngry: false,
        possessionOwner: 'nymphs_and_naiads',
        voices: state.voices.map(function (v) { return Object.assign({}, v); })
      };
    }

    function setViewport(w, h) {
      if (Number.isFinite(w) && w > 0) state.width = Number(w);
      if (Number.isFinite(h) && h > 0) state.height = Number(h);
    }

    function setReducedMotion(flag) {
      state.reducedMotion = Boolean(flag);
      if (state.reducedMotion) state.particles.length = 0;
      stepSub(0.016);
    }

    function reset() {
      state.sunPhase = 'bright_morning';
      state.sunElevationRatio = 0.65;
      state.timeSec = 0;
      state.particles.length = 0;
      state.spumeBubbles.length = 0;
      state.splashRings.length = 0;
      state.rainbowVisibility = 0;
      recomputeMetrics();
      return getState();
    }

    function destroy() {
      state.particles.length = 0;
      state.spumeBubbles.length = 0;
      state.splashRings.length = 0;
      audio.destroy();
    }

    if (cfg.sunPhase !== undefined) setSunPhase(cfg.sunPhase);

    return {
      getState: getState,
      setViewport: setViewport,
      syncHydraulics: syncHydraulics,
      setSunPhase: setSunPhase,
      triggerSplash: triggerSplash,
      step: step,
      render: render,
      unlockAudio: function () { return audio.unlock(); },
      setMuted: function (flag) { return audio.setMuted(flag); },
      toggleMute: function () { return audio.setMuted(!audio.isMuted()); },
      isMuted: function () { return audio.isMuted(); },
      playValveSound: function (zoneIndex, isOpen) { audio.playValveChime(zoneIndex, isOpen); },
      setReducedMotion: setReducedMotion,
      reset: reset,
      destroy: destroy
    };
  }

  const ArmillaMorningWaterHymn = {
    NAIAD_ROSTER: NAIAD_ROSTER,
    MORNING_MODES: MORNING_MODES,
    createMorningWaterHymn: createMorningWaterHymn
  };

  if (root) root.ArmillaMorningWaterHymn = ArmillaMorningWaterHymn;
  if (typeof globalThis !== 'undefined') globalThis.ArmillaMorningWaterHymn = ArmillaMorningWaterHymn;
  if (typeof module !== 'undefined' && module.exports) module.exports = ArmillaMorningWaterHymn;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
