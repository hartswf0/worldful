globalThis.MaroziaSwallowAperture = (function () {
  'use strict';

  const PALETTE = Object.freeze({
    leadVaultDark: '#14171c',
    compactWallSlate: '#232933',
    dampMoldOlive: '#384239',
    wetMortarAsh: '#4e5661',
    batUmbrellaBlack: '#0d0f13',
    rancidCheeseOchre: '#c99a3e',
    ferociousToothIvory: '#d8d2c3',
    crystalPrismCyan: '#8fe7f5',
    gauzeVeilPearl: '#eef7fa',
    swallowWingCobalt: '#2f66b8',
    dragonflyIridescent: '#52d6b6',
    sunlitCornfieldGold: '#f2c14e'
  });

  const DECADES = Object.freeze([
    Object.freeze({
      id: 'first_visit',
      label: 'I. First Consult',
      ratSurface: 'Soot-slick stone drains, iron grates & tallow lanterns',
      swallowHint: 'Whitewash eaves poised over raw summer wheat'
    }),
    Object.freeze({
      id: 'decades_later',
      label: 'II. Return After Decades',
      ratSurface: 'Riveted leaden conduits, damp mold & batlike black umbrellas',
      swallowHint: 'Dragonfly glints caught between twin stone arcades'
    }),
    Object.freeze({
      id: 'late_century',
      label: 'III. Late Gallery Epoch',
      ratSurface: 'Fluorescent subterranean passages & hurried dark overcoats',
      swallowHint: 'Translucent gauze horizon shimmering on the brink of flight'
    })
  ]);

  const OBLIQUE_SWEET_SPOT = Object.freeze({
    targetDeg: 33.5,
    toleranceDeg: 6.5,
    minDeg: 0,
    maxDeg: 90
  });

  const SWALLOW_STONES = Object.freeze([
    Object.freeze({
      id: 'sibyl_prophecy',
      realm: 'sibyl',
      title: "The Sibyl's Double Verdict",
      inscription: 'Two cities share these walls: one of the rat, one of the swallow; decades alter both, yet the second remains forever the one about to free itself from the first.',
      anchorX: 0.50,
      anchorY: 0.14
    }),
    Object.freeze({
      id: 'oblique_two_arcade_slit',
      realm: 'threshold',
      title: 'Oblique Perspective Between Two Arcades',
      inscription: 'Where shadow thins along compact masonry and two colonnades align along a slant of thirty-three degrees.',
      anchorX: 0.50,
      anchorY: 0.50
    }),
    Object.freeze({
      id: 'crystal_gauze_parting',
      realm: 'swallow',
      title: 'Crystal & Transparent Gauze',
      inscription: 'At an unforced gesture made for sheer pleasure, lead and mold part abruptly like blown crystal and sheer gauze.',
      anchorX: 0.34,
      anchorY: 0.36
    }),
    Object.freeze({
      id: 'swallows_dragonflies_cornfields',
      realm: 'swallow',
      title: 'Swallows, Dragonflies & Sunlit Cornfields',
      inscription: 'Figures soaring in effortless arcs and darting iridescent wings above golden grain rippling in open wind.',
      anchorX: 0.66,
      anchorY: 0.34
    })
  ]);

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function createSeededRng(seed) {
    let s = seed >>> 0;
    return function nextRng() {
      s = (1664525 * s + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function createGlassHarmonicaAudio(sharedCtx) {
    let ctx = sharedCtx || null;
    let muted = false;
    let padNodes = null;

    function ensureCtx() {
      if (muted) return null;
      if (!ctx && typeof globalThis !== 'undefined') {
        const AudioCtor = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (typeof AudioCtor === 'function') {
          try {
            ctx = new AudioCtor();
          } catch (_err) {
            ctx = null;
          }
        }
      }
      if (ctx && ctx.state === 'suspended' && typeof ctx.resume === 'function') {
        try { ctx.resume(); } catch (_err) { /* safe no-op */ }
      }
      return ctx;
    }

    function ensureHarmonicPad(ac) {
      if (padNodes) return padNodes;
      try {
        const master = ac.createGain();
        master.gain.value = 0.0001;
        master.connect(ac.destination);

        const freqs = [261.63, 392.00, 587.33];
        const oscs = freqs.map(function (f, idx) {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = idx === 2 ? 'triangle' : 'sine';
          osc.frequency.value = f;
          gain.gain.value = idx === 0 ? 0.05 : (idx === 1 ? 0.042 : 0.025);
          osc.connect(gain);
          gain.connect(master);
          osc.start();
          return osc;
        });

        const shimmerOsc = ac.createOscillator();
        const shimmerLfo = ac.createOscillator();
        const shimmerMod = ac.createGain();
        const shimmerFilter = ac.createBiquadFilter();
        shimmerFilter.type = 'bandpass';
        shimmerFilter.frequency.value = 2637.02;
        shimmerFilter.Q.value = 6.0;
        shimmerOsc.type = 'sine';
        shimmerOsc.frequency.value = 2637.02;
        shimmerLfo.type = 'sine';
        shimmerLfo.frequency.value = 6.5;
        shimmerMod.gain.value = 0.012;
        shimmerLfo.connect(shimmerMod.gain);
        shimmerOsc.connect(shimmerFilter);
        shimmerFilter.connect(shimmerMod);
        shimmerMod.connect(master);
        shimmerOsc.start();
        shimmerLfo.start();

        padNodes = { master: master, oscs: oscs, shimmerOsc: shimmerOsc, shimmerLfo: shimmerLfo };
      } catch (_err) {
        padNodes = null;
      }
      return padNodes;
    }
    function setMuted(flag) {
      muted = Boolean(flag);
      if (muted && padNodes && ctx) {
        try {
          padNodes.master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.06);
        } catch (_err) { /* safe no-op */ }
      }
      return muted;
    }

    function playCrystalPartingChime() {
      const ac = ensureCtx();
      if (!ac) return;
      try {
        const now = ac.currentTime;
        const notes = [523.25, 783.99, 1174.66, 1567.98];
        notes.forEach(function (freq, i) {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = i % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.055);
          gain.gain.setValueAtTime(0.0001, now + i * 0.055);
          gain.gain.linearRampToValueAtTime(0.065 / (1 + i * 0.25), now + i * 0.055 + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.055 + 1.35);
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(now + i * 0.055);
          osc.stop(now + i * 0.055 + 1.42);
        });
      } catch (_err) { /* safe no-op */ }
    }

    function playForcedSnapDiscord() {
      const ac = ensureCtx();
      if (!ac) return;
      try {
        const now = ac.currentTime;
        [146.83, 155.56, 207.65].forEach(function (freq, idx) {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = idx === 0 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.exponentialRampToValueAtTime(52 + idx * 9, now + 0.24);
          gain.gain.setValueAtTime(0.075, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(now);
          osc.stop(now + 0.28);
        });
      } catch (_err) { /* safe no-op */ }
    }

    function updateSwallowHarmonics(wallTranslucency, mutedOverride) {
      if (typeof mutedOverride === 'boolean') muted = mutedOverride;
      const level = clamp(Number(wallTranslucency) || 0, 0, 1);
      if (muted || level <= 0.02) {
        if (padNodes && ctx) {
          try { padNodes.master.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08); } catch (_err) { /* no-op */ }
        }
        return;
      }
      const ac = ensureCtx();
      if (!ac) return;
      const pad = ensureHarmonicPad(ac);
      if (pad) {
        try {
          pad.master.gain.setTargetAtTime(0.015 + level * 0.14, ac.currentTime, 0.12);
        } catch (_err) { /* no-op */ }
      }
    }

    return {
      setMuted: setMuted,
      isMuted: function () { return muted; },
      playCrystalPartingChime: playCrystalPartingChime,
      playForcedSnapDiscord: playForcedSnapDiscord,
      updateSwallowHarmonics: updateSwallowHarmonics
    };
  }

  function createSwallowAperture(opts) {
    const cfg = opts || {};
    const onApertureOpen = typeof cfg.onApertureOpen === 'function' ? cfg.onApertureOpen : null;
    const onStoneSnapShut = typeof cfg.onStoneSnapShut === 'function' ? cfg.onStoneSnapShut : null;
    const onStoneSelect = typeof cfg.onStoneSelect === 'function' ? cfg.onStoneSelect : null;

    const rng = createSeededRng(520335);
    const swallowCitizens = Array.from({ length: 18 }, function (_, i) {
      return {
        index: i,
        cx: 0.18 + (i % 6) * 0.128 + (rng() - 0.5) * 0.04,
        cy: 0.21 + Math.floor(i / 6) * 0.125 + (rng() - 0.5) * 0.03,
        rx: 0.08 + rng() * 0.11,
        ry: 0.035 + rng() * 0.055,
        speed: 0.65 + rng() * 0.55,
        phase: rng() * Math.PI * 2,
        scale: 0.78 + rng() * 0.42
      };
    });

    const dragonflies = Array.from({ length: 14 }, function (_, i) {
      return {
        index: i,
        bx: 0.16 + (i / 13) * 0.68,
        by: 0.46 + (rng() - 0.5) * 0.18,
        dartAmpX: 0.035 + rng() * 0.045,
        dartAmpY: 0.02 + rng() * 0.035,
        freq: 1.5 + rng() * 1.4,
        phase: rng() * Math.PI * 2
      };
    });

    const cornStalks = Array.from({ length: 52 }, function (_, i) {
      return {
        nx: 0.05 + (i / 51) * 0.90,
        heightRatio: 0.12 + rng() * 0.11,
        swayPhase: rng() * Math.PI * 2,
        lean: (rng() - 0.5) * 0.25
      };
    });

    const prismFacets = Array.from({ length: 16 }, function (_, i) {
      return {
        side: i % 2 === 0 ? -1 : 1,
        ny: 0.08 + Math.floor(i / 2) * 0.112,
        size: 0.038 + rng() * 0.034,
        rot: rng() * Math.PI,
        alpha: 0.34 + rng() * 0.36
      };
    });

    const state = {
      coexistenceInvariant: true,
      secondAboutToFreeFromFirst: true,
      institutionalizedSwallow: false,
      obliqueAngleDeg: 12,
      travelerPaused: true,
      obliquePerspectiveAligned: false,
      unforcedGesture: false,
      forcedGraspActive: false,
      swallowApertureOpen: false,
      wallTranslucency: 0,
      ratDominance: 0.86,
      soaringCitizensCount: 0,
      dragonflyCount: 0,
      forcedSnapShutCount: 0,
      decadeIndex: 1,
      reducedMotion: Boolean(cfg.reducedMotion),
      clock: 1.8,
      shimmerTimer: 0,
      partingPulse: 0,
      snapShutShock: 0
    };

    function inSweetSpot(deg) {
      return Math.abs(deg - OBLIQUE_SWEET_SPOT.targetDeg) <= OBLIQUE_SWEET_SPOT.toleranceDeg;
    }

    function getState() {
      return {
        coexistenceInvariant: true,
        secondAboutToFreeFromFirst: true,
        institutionalizedSwallow: false,
        obliqueAngleDeg: Number(state.obliqueAngleDeg.toFixed(2)),
        travelerPaused: state.travelerPaused,
        obliquePerspectiveAligned: state.obliquePerspectiveAligned,
        unforcedGesture: state.unforcedGesture,
        forcedGraspActive: state.forcedGraspActive,
        swallowApertureOpen: state.swallowApertureOpen,
        wallTranslucency: Number(state.wallTranslucency.toFixed(4)),
        ratDominance: Number(state.ratDominance.toFixed(4)),
        soaringCitizensCount: state.soaringCitizensCount,
        dragonflyCount: state.dragonflyCount,
        forcedSnapShutCount: state.forcedSnapShutCount,
        decadeIndex: state.decadeIndex,
        decadeId: DECADES[state.decadeIndex].id,
        relationshipUnchanged: true,
        reducedMotion: state.reducedMotion
      };
    }
    function setObliqueAngle(deg, moveOpts) {
      const nextDeg = Number(deg);
      if (Number.isFinite(nextDeg)) state.obliqueAngleDeg = clamp(nextDeg, 0, 90);
      const vel = Math.abs(Number(moveOpts && moveOpts.velocity) || 0);
      state.travelerPaused = vel <= 0.65;
      state.forcedGraspActive = false;
      const inBand = inSweetSpot(state.obliqueAngleDeg);
      state.obliquePerspectiveAligned = state.travelerPaused && inBand;
      if (!inBand) {
        state.swallowApertureOpen = false; state.unforcedGesture = false;
        state.wallTranslucency = 0; state.ratDominance = 0.86;
        state.soaringCitizensCount = 0; state.dragonflyCount = 0;
      } else if (state.obliquePerspectiveAligned) {
        if (!state.swallowApertureOpen) {
          state.wallTranslucency = 0.26; state.ratDominance = 0.58;
          state.soaringCitizensCount = 2; state.dragonflyCount = 3;
        }
      } else {
        state.swallowApertureOpen = false; state.unforcedGesture = false;
        state.wallTranslucency = 0.06; state.ratDominance = 0.86;
        state.soaringCitizensCount = 0; state.dragonflyCount = 0;
      }
      return getState();
    }

    function pauseBetweenArcades() {
      state.travelerPaused = true; state.forcedGraspActive = false;
      state.obliquePerspectiveAligned = inSweetSpot(state.obliqueAngleDeg);
      if (state.obliquePerspectiveAligned && !state.swallowApertureOpen) {
        state.wallTranslucency = Math.max(state.wallTranslucency, 0.26);
        state.ratDominance = 0.58; state.soaringCitizensCount = 2; state.dragonflyCount = 3;
      } else if (!state.obliquePerspectiveAligned) {
        state.swallowApertureOpen = false; state.unforcedGesture = false;
        state.wallTranslucency = 0; state.ratDominance = 0.86;
        state.soaringCitizensCount = 0; state.dragonflyCount = 0;
      }
      return getState();
    }

    function alignObliqueSweetSpot() {
      state.obliqueAngleDeg = 33.5; state.travelerPaused = true; state.forcedGraspActive = false;
      state.obliquePerspectiveAligned = true; state.unforcedGesture = false; state.swallowApertureOpen = false;
      state.wallTranslucency = 0.28; state.ratDominance = 0.55;
      state.soaringCitizensCount = 3; state.dragonflyCount = 4; state.shimmerTimer = 0;
      return getState();
    }

    function performUnforcedGesture(_kind) {
      state.obliquePerspectiveAligned = state.travelerPaused && inSweetSpot(state.obliqueAngleDeg);
      state.forcedGraspActive = false;
      if (state.obliquePerspectiveAligned) {
        state.unforcedGesture = true; state.swallowApertureOpen = true;
        state.wallTranslucency = 0.94; state.ratDominance = 0.08;
        state.soaringCitizensCount = 18; state.dragonflyCount = 14;
        state.partingPulse = 1.0; state.shimmerTimer = 0;
        const snap = getState();
        if (onApertureOpen) onApertureOpen(snap);
        return snap;
      }
      state.unforcedGesture = false; state.swallowApertureOpen = false;
      state.wallTranslucency = 0.14; state.ratDominance = 0.80;
      state.soaringCitizensCount = 0; state.dragonflyCount = 0; state.shimmerTimer = 1.2;
      return getState();
    }

    function forceCaptureAperture() {
      state.forcedGraspActive = true; state.unforcedGesture = false; state.swallowApertureOpen = false;
      state.wallTranslucency = 0; state.ratDominance = 0.95;
      state.soaringCitizensCount = 0; state.dragonflyCount = 0;
      state.shimmerTimer = 0; state.snapShutShock = 1.0;
      state.forcedSnapShutCount += 1; state.institutionalizedSwallow = false;
      const snap = getState();
      if (onStoneSnapShut) onStoneSnapShut(snap);
      return snap;
    }

    function setDecadeIndex(idx) {
      const n = Math.round(Number(idx));
      if (Number.isFinite(n)) state.decadeIndex = clamp(n, 0, 2);
      return getState();
    }

    function hitTestStone(normX, normY, hitOpts) {
      const nx = Number(normX), ny = Number(normY);
      if (!Number.isFinite(nx) || !Number.isFinite(ny)) return null;
      let best = null, bestDist = 0.065;
      for (let i = 0; i < SWALLOW_STONES.length; i += 1) {
        const st = SWALLOW_STONES[i];
        const d = Math.hypot(nx - st.anchorX, ny - st.anchorY);
        if (d <= bestDist) { bestDist = d; best = st; }
      }
      if (best && hitOpts && hitOpts.select && onStoneSelect) onStoneSelect(best);
      return best;
    }

    function setReducedMotion(flag) { state.reducedMotion = Boolean(flag); return getState(); }

    function reset() {
      state.obliqueAngleDeg = 12; state.travelerPaused = true; state.obliquePerspectiveAligned = false;
      state.unforcedGesture = false; state.forcedGraspActive = false; state.swallowApertureOpen = false;
      state.wallTranslucency = 0; state.ratDominance = 0.86; state.soaringCitizensCount = 0;
      state.dragonflyCount = 0; state.forcedSnapShutCount = 0; state.decadeIndex = 1;
      state.shimmerTimer = 0; state.partingPulse = 0; state.snapShutShock = 0;
      return getState();
    }

    function step(dtSec) {
      const dt = clamp(Number(dtSec) || 0, 0, 0.1);
      if (state.reducedMotion) return;
      state.clock += dt;
      state.partingPulse = Math.max(0, state.partingPulse - dt * 0.9);
      state.snapShutShock = Math.max(0, state.snapShutShock - dt * 1.6);
      if (state.shimmerTimer > 0 && !state.swallowApertureOpen && !state.obliquePerspectiveAligned) {
        state.shimmerTimer = Math.max(0, state.shimmerTimer - dt);
        const r = state.shimmerTimer / 1.2;
        state.wallTranslucency = Number((0.14 * r).toFixed(4));
        state.ratDominance = Number((0.86 - 0.06 * r).toFixed(4));
      }
    }

    function render(ctx, width, height, sharedState) {
      if (!ctx || !(width > 0) || !(height > 0)) return;
      const sh = sharedState || {};
      const trans = typeof sh.wallTranslucency === 'number' ? sh.wallTranslucency : state.wallTranslucency;
      const deg = typeof sh.obliqueAngleDeg === 'number' ? sh.obliqueAngleDeg : state.obliqueAngleDeg;
      const decade = typeof sh.decadeIndex === 'number' ? clamp(sh.decadeIndex, 0, 2) : state.decadeIndex;
      const activeStoneId = sh.activeStoneId || null;
      const t = state.clock;
      const slantPx = Math.tan(((deg - 33.5) * 0.35 + 16) * Math.PI / 180) * height * 0.28;
      const alignCloseness = clamp(1 - Math.abs(deg - 33.5) / 14, 0, 1);

      ctx.save();
      if (trans > 0.05) {
        const halfOpen = width * (0.025 + trans * 0.49);
        const cx = width * 0.5;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx - halfOpen + slantPx * 0.5, 0);
        ctx.lineTo(cx + halfOpen + slantPx * 0.5, 0);
        ctx.lineTo(cx + halfOpen - slantPx * 0.5, height);
        ctx.lineTo(cx - halfOpen - slantPx * 0.5, height);
        ctx.closePath();
        ctx.clip();

        const sky = ctx.createLinearGradient(0, 0, 0, height);
        sky.addColorStop(0, PALETTE.gauzeVeilPearl);
        sky.addColorStop(0.54, PALETTE.crystalPrismCyan);
        sky.addColorStop(1, PALETTE.sunlitCornfieldGold);
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = decade === 0 ? PALETTE.ferociousToothIvory : (decade === 1 ? PALETTE.gauzeVeilPearl : PALETTE.crystalPrismCyan);
        ctx.globalAlpha = 0.55 * trans;
        for (let e = 0; e < 5; e += 1) {
          const ex = width * (0.14 + e * 0.18);
          ctx.fillRect(ex - 26, height * 0.56, 52, height * 0.14);
        }
        ctx.globalAlpha = 1;

        const fieldTop = height * 0.68;
        ctx.fillStyle = PALETTE.sunlitCornfieldGold;
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.quadraticCurveTo(width * 0.32, fieldTop - 18, width * 0.62, fieldTop + 8);
        ctx.quadraticCurveTo(width * 0.84, fieldTop - 12, width, fieldTop + 4);
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = PALETTE.rancidCheeseOchre;
        ctx.lineWidth = Math.max(1.2, width * 0.0018);
        for (let i = 0; i < cornStalks.length; i += 1) {
          const st = cornStalks[i];
          const sx = st.nx * width;
          const shgt = st.heightRatio * height;
          const sway = (state.reducedMotion ? 0.15 : Math.sin(t * 2.1 + st.swayPhase)) * 12 + st.lean * 14;
          ctx.beginPath();
          ctx.moveTo(sx, height);
          ctx.quadraticCurveTo(sx + sway * 0.5, height - shgt * 0.55, sx + sway, height - shgt);
          ctx.stroke();
        }

        const citizenVis = state.swallowApertureOpen ? 18 : Math.max(2, Math.round(trans * 10));
        for (let i = 0; i < citizenVis; i += 1) {
          const sw = swallowCitizens[i];
          const ang = t * sw.speed + sw.phase;
          const x = (sw.cx + Math.cos(ang) * sw.rx) * width;
          const y = (sw.cy + Math.sin(ang * 2) * sw.ry) * height;
          const wing = (state.reducedMotion ? 0.4 : Math.sin(t * 7.2 + sw.phase)) * 9 * sw.scale;
          const span = Math.max(11, width * 0.017) * sw.scale;
          ctx.strokeStyle = PALETTE.swallowWingCobalt;
          ctx.fillStyle = PALETTE.swallowWingCobalt;
          ctx.lineWidth = 2.1;
          ctx.beginPath();
          ctx.moveTo(x - span, y - wing);
          ctx.quadraticCurveTo(x - span * 0.3, y - 5, x, y);
          ctx.quadraticCurveTo(x + span * 0.3, y - 5, x + span, y - wing);
          ctx.lineTo(x + 3, y + 5);
          ctx.lineTo(x, y + 2);
          ctx.lineTo(x - 3, y + 5);
          ctx.closePath();
          ctx.fill();
        }

        const dfVis = state.swallowApertureOpen ? 14 : Math.max(2, Math.round(trans * 8));
        for (let i = 0; i < dfVis; i += 1) {
          const df = dragonflies[i];
          const dx = (df.bx + Math.sin(t * df.freq + df.phase) * df.dartAmpX) * width;
          const dy = (df.by + Math.cos(t * df.freq * 1.3 + df.phase) * df.dartAmpY) * height;
          const flutter = state.reducedMotion ? 4 : 3 + Math.abs(Math.sin(t * 18 + df.phase)) * 5;
          ctx.strokeStyle = PALETTE.dragonflyIridescent;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(dx - 8, dy - flutter); ctx.lineTo(dx + 8, dy + flutter);
          ctx.moveTo(dx - 8, dy + flutter); ctx.lineTo(dx + 8, dy - flutter);
          ctx.stroke();
        }
        ctx.restore();

        for (let g = 0; g < 6; g += 1) {
          const side = g % 2 === 0 ? -1 : 1;
          const edgeX = cx + side * halfOpen + (g < 3 ? 1 : -1) * 6;
          const breeze = (state.reducedMotion ? 1 : Math.sin(t * 1.7 + g)) * 18 * side;
          ctx.fillStyle = PALETTE.gauzeVeilPearl;
          ctx.globalAlpha = 0.24 * trans;
          ctx.beginPath();
          ctx.moveTo(edgeX, 0);
          ctx.bezierCurveTo(edgeX + breeze, height * 0.33, edgeX - breeze * 0.7, height * 0.68, edgeX + side * 14, height);
          ctx.lineTo(edgeX - side * 22, height);
          ctx.closePath();
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        for (let p = 0; p < prismFacets.length; p += 1) {
          const pf = prismFacets[p];
          const px = cx + pf.side * halfOpen * 0.96;
          const py = pf.ny * height;
          const r = pf.size * Math.min(width, height);
          ctx.fillStyle = PALETTE.crystalPrismCyan;
          ctx.globalAlpha = pf.alpha * trans;
          ctx.beginPath();
          ctx.moveTo(px, py - r); ctx.lineTo(px + r * 0.85, py);
          ctx.lineTo(px, py + r); ctx.lineTo(px - r * 0.85, py);
          ctx.closePath();
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      const parallaxShift = (deg - 33.5) * width * 0.0065;
      const archAlpha = clamp(1 - trans * 0.82, 0.16, 0.94);
      [0, 1].forEach(function (tier) {
        const shift = tier === 0 ? -parallaxShift : parallaxShift * 1.25;
        const pierW = width * (tier === 0 ? 0.055 : 0.044);
        const springY = height * (tier === 0 ? 0.24 : 0.29);
        const slots = [-1.35, -0.52, 0.52, 1.35];
        ctx.fillStyle = tier === 0 ? PALETTE.compactWallSlate : PALETTE.dampMoldOlive;
        ctx.strokeStyle = tier === 0 ? PALETTE.wetMortarAsh : PALETTE.compactWallSlate;
        ctx.lineWidth = Math.max(2, pierW * 0.28);
        ctx.globalAlpha = archAlpha * (tier === 0 ? 0.88 : 0.72);
        slots.forEach(function (slot, idx) {
          const px = width * 0.5 + slot * width * 0.26 + shift;
          ctx.fillRect(px - pierW * 0.5, springY, pierW, height - springY);
          ctx.fillRect(px - pierW * 0.68, springY - 7, pierW * 1.36, 8);
          if (idx < slots.length - 1) {
            const nx = width * 0.5 + slots[idx + 1] * width * 0.26 + shift;
            const midX = (px + nx) * 0.5;
            const spanR = Math.max(8, (nx - px) * 0.5);
            ctx.beginPath();
            ctx.arc(midX, springY, spanR, Math.PI, 0, false);
            ctx.stroke();
          }
        });
      });

      if (alignCloseness > 0.05 && !state.forcedGraspActive) {
        ctx.strokeStyle = trans > 0.5 ? PALETTE.sunlitCornfieldGold : PALETTE.crystalPrismCyan;
        ctx.globalAlpha = clamp(alignCloseness * 0.78, 0.12, 0.85);
        ctx.lineWidth = 2 + alignCloseness * 3;
        ctx.beginPath();
        ctx.moveTo(width * 0.5 + slantPx * 0.5, height * 0.06);
        ctx.lineTo(width * 0.5 - slantPx * 0.5, height * 0.94);
        ctx.stroke();
      }
      if (state.forcedGraspActive) {
        ctx.fillStyle = PALETTE.leadVaultDark;
        ctx.globalAlpha = 0.92;
        ctx.fillRect(width * 0.36, height * 0.44, width * 0.28, height * 0.12);
      }
      ctx.globalAlpha = 1;

      for (let s = 0; s < SWALLOW_STONES.length; s += 1) {
        const st = SWALLOW_STONES[s];
        const sx = st.anchorX * width, sy = st.anchorY * height;
        const active = activeStoneId === st.id;
        ctx.strokeStyle = active ? PALETTE.sunlitCornfieldGold : PALETTE.crystalPrismCyan;
        ctx.fillStyle = active ? PALETTE.sunlitCornfieldGold : PALETTE.gauzeVeilPearl;
        ctx.globalAlpha = active ? 0.95 : 0.62;
        ctx.lineWidth = active ? 2.2 : 1.3;
        ctx.beginPath();
        ctx.moveTo(sx, sy - 7); ctx.lineTo(sx + 7, sy); ctx.lineTo(sx, sy + 7); ctx.lineTo(sx - 7, sy);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    }

    return {
      setObliqueAngle: setObliqueAngle,
      pauseBetweenArcades: pauseBetweenArcades,
      alignObliqueSweetSpot: alignObliqueSweetSpot,
      performUnforcedGesture: performUnforcedGesture,
      forceCaptureAperture: forceCaptureAperture,
      setDecadeIndex: setDecadeIndex,
      hitTestStone: hitTestStone,
      createGlassHarmonicaAudio: createGlassHarmonicaAudio,
      setReducedMotion: setReducedMotion,
      reset: reset,
      getState: getState,
      step: step,
      render: render
    };
  }

  return Object.freeze({
    PALETTE: PALETTE,
    DECADES: DECADES,
    OBLIQUE_SWEET_SPOT: OBLIQUE_SWEET_SPOT,
    SWALLOW_STONES: SWALLOW_STONES,
    createGlassHarmonicaAudio: createGlassHarmonicaAudio,
    createSwallowAperture: createSwallowAperture
  });
})();

if (typeof window !== 'undefined') {
  window.MaroziaSwallowAperture = globalThis.MaroziaSwallowAperture;
}
