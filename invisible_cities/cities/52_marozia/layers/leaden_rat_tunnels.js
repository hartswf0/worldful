/* Subterranean Leaden Rat-Warren & Oblique Masonry Parting Engine */
globalThis.MaroziaRatTunnels = (function () {
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

  const RAT_STONES = Object.freeze([
    Object.freeze({
      id: 'leaden_tunnels',
      realm: 'rat',
      title: 'Leaden Subterranean Tunnels',
      inscription: 'Single-file conduits of grey lead and sweating mortar where hurried steps echo without sky.',
      anchorX: 0.22,
      anchorY: 0.34
    }),
    Object.freeze({
      id: 'ferocious_cheese_scramble',
      realm: 'rat',
      title: 'Remains of Cheese & Ferocious Teeth',
      inscription: "Packs lunging through narrow drains to snatch contested crumbs from one another's bared teeth.",
      anchorX: 0.38,
      anchorY: 0.72
    }),
    Object.freeze({
      id: 'batlike_umbrellas',
      realm: 'rat',
      title: 'Batlike Overcoats & Ribbed Umbrellas',
      inscription: 'Ribbed black canopies and flapping wool coats folding citizens into nocturnal wings.',
      anchorX: 0.66,
      anchorY: 0.58
    }),
    Object.freeze({
      id: 'compact_mold_walls',
      realm: 'rat',
      title: 'Compact Walls & Damp Mold',
      inscription: 'Opaque ashlar courses crusted with olive dampness that thicken whenever grasped by force.',
      anchorX: 0.78,
      anchorY: 0.30
    })
  ]);

  function clamp(v, lo, hi) {
    const n = Number(v);
    if (!Number.isFinite(n)) return lo;
    return n < lo ? lo : n > hi ? hi : n;
  }

  function clamp01(v) {
    return clamp(v, 0, 1);
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || '#14171c').replace('#', '');
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + clamp01(alpha).toFixed(3) + ')';
  }

  function createSeededRng(seed) {
    let s = (seed >>> 0) || 0x52415431;
    return function nextRng() {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function obliqueThetaRad(deg) {
    const d = clamp(deg, 0, 90);
    const visualDeg = d <= 40 ? d : 40 + ((d - 40) / 50) * 24;
    return (visualDeg * Math.PI) / 180;
  }

  function createSubterraneanAudio(audioOpts) {
    const opts = audioOpts || {};
    let muted = opts.muted !== undefined ? Boolean(opts.muted) : true;
    let ctx = null;
    let noiseBuffer = null;
    let droneGain = null;
    let droneFilter = null;
    let lastDripAt = 0;

    function canActivateAudio() {
      if (typeof globalThis === 'undefined') return false;
      if (typeof navigator !== 'undefined' && navigator.userActivation && !navigator.userActivation.hasBeenActive) {
        return false;
      }
      return Boolean(globalThis.AudioContext || globalThis.webkitAudioContext);
    }

    function ensureContext() {
      if (muted) return null;
      if (!ctx) {
        if (!canActivateAudio()) return null;
        const Ctor = globalThis.AudioContext || globalThis.webkitAudioContext;
        try {
          ctx = new Ctor();
          const len = Math.max(1024, Math.floor(ctx.sampleRate * 0.45));
          noiseBuffer = ctx.createBuffer(1, len, ctx.sampleRate);
          const ch = noiseBuffer.getChannelData(0);
          const rng = createSeededRng(0x2a7f91);
          for (let i = 0; i < len; i += 1) ch[i] = rng() * 2 - 1;
          droneFilter = ctx.createBiquadFilter();
          droneFilter.type = 'lowpass';
          droneFilter.frequency.value = 150;
          droneGain = ctx.createGain();
          droneGain.gain.value = 0.0001;
          const oscLow = ctx.createOscillator();
          const oscSub = ctx.createOscillator();
          oscLow.type = 'triangle';
          oscSub.type = 'sawtooth';
          oscLow.frequency.value = 51.9;
          oscSub.frequency.value = 77.8;
          oscLow.connect(droneFilter);
          oscSub.connect(droneFilter);
          droneFilter.connect(droneGain);
          droneGain.connect(ctx.destination);
          oscLow.start();
          oscSub.start();
        } catch (_err) {
          ctx = null;
          return null;
        }
      }
      if (ctx && ctx.state === 'suspended' && typeof ctx.resume === 'function') {
        try { ctx.resume(); } catch (_e) { /* noop */ }
      }
      return ctx;
    }
    function playCheeseScramble() {
      const ac = ensureContext();
      if (!ac || !noiseBuffer) return;
      const now = ac.currentTime;
      const src = ac.createBufferSource();
      src.buffer = noiseBuffer;
      const bp = ac.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(1650, now);
      bp.Q.value = 2.4;
      const g = ac.createGain();
      g.gain.setValueAtTime(0.001, now);
      g.gain.exponentialRampToValueAtTime(0.085, now + 0.025);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      src.connect(bp);
      bp.connect(g);
      g.connect(ac.destination);
      src.start(now);
      src.stop(now + 0.25);
      for (let k = 0; k < 3; k += 1) {
        const t0 = now + k * 0.055;
        const osc = ac.createOscillator();
        const cg = ac.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1440 - k * 140, t0);
        osc.frequency.exponentialRampToValueAtTime(560, t0 + 0.045);
        cg.gain.setValueAtTime(0.032, t0);
        cg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.05);
        osc.connect(cg);
        cg.connect(ac.destination);
        osc.start(t0);
        osc.stop(t0 + 0.055);
      }
    }

    function playStoneSnapShut() {
      const ac = ensureContext();
      if (!ac) return;
      const now = ac.currentTime;
      const sub = ac.createOscillator();
      const sg = ac.createGain();
      sub.type = 'triangle';
      sub.frequency.setValueAtTime(118, now);
      sub.frequency.exponentialRampToValueAtTime(31, now + 0.34);
      sg.gain.setValueAtTime(0.18, now);
      sg.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
      sub.connect(sg);
      sg.connect(ac.destination);
      sub.start(now);
      sub.stop(now + 0.4);
      if (noiseBuffer) {
        const nSrc = ac.createBufferSource();
        nSrc.buffer = noiseBuffer;
        const lp = ac.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(320, now);
        lp.frequency.exponentialRampToValueAtTime(85, now + 0.28);
        const ng = ac.createGain();
        ng.gain.setValueAtTime(0.14, now);
        ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
        nSrc.connect(lp);
        lp.connect(ng);
        ng.connect(ac.destination);
        nSrc.start(now);
        nSrc.stop(now + 0.31);
      }
    }

    function updateRatDrone(ratDominance, mutedArg) {
      if (typeof mutedArg === 'boolean') muted = mutedArg;
      const dom = clamp01(ratDominance !== undefined ? ratDominance : 0.86);
      if (muted) {
        if (ctx && droneGain) {
          droneGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.06);
        }
        return;
      }
      const ac = ensureContext();
      if (!ac || !droneGain || !droneFilter) return;
      const now = ac.currentTime;
      droneFilter.frequency.setTargetAtTime(102 + dom * 165, now, 0.08);
      droneGain.gain.setTargetAtTime(Math.max(0.0002, dom * 0.042), now, 0.08);
      if (dom > 0.38 && now - lastDripAt > 1.65 - dom * 0.65) {
        lastDripAt = now;
        const drip = ac.createOscillator();
        const dg = ac.createGain();
        drip.type = 'sine';
        drip.frequency.setValueAtTime(980 + ((now * 173) % 340), now);
        drip.frequency.exponentialRampToValueAtTime(1320, now + 0.07);
        dg.gain.setValueAtTime(0.016 * dom, now);
        dg.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        drip.connect(dg);
        dg.connect(ac.destination);
        drip.start(now);
        drip.stop(now + 0.13);
      }
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      if (muted && ctx && droneGain) {
        droneGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
      } else if (!muted) {
        ensureContext();
      }
      return muted;
    }

    return {
      setMuted: setMuted,
      isMuted: function isMuted() { return muted; },
      playCheeseScramble: playCheeseScramble,
      playStoneSnapShut: playStoneSnapShut,
      updateRatDrone: updateRatDrone
    };
  }

  function createRatTunnels(opts) {
    const cfg = opts || {};
    let reducedMotion = Boolean(cfg.reducedMotion);
    const onStoneSelect = typeof cfg.onStoneSelect === 'function' ? cfg.onStoneSelect : null;
    const onPackScramble = typeof cfg.onPackScramble === 'function' ? cfg.onPackScramble : null;

    const TIER_Y = [0.27, 0.53, 0.79];
    let decadeIndex = 1;
    let hurryPressure = 0.62;
    let cheeseScramblesCount = 0;
    let ratDominance = 0.86;
    let wallTranslucency = 0;
    let obliqueAngleDeg = 12;
    let obliquePerspectiveAligned = false;
    let swallowApertureOpen = false;
    let prevForcedGrasp = false;
    let snapShudder = 0;
    let scrambleBurst = 0;
    let simTime = 0;

    let cheeseClusters = [];
    let packAgents = [];
    let umbrellaAgents = [];
    let moldDrops = [];
    let mortarDust = [];

    function seedWorld() {
      const rng = createSeededRng(0x52415452);
      cheeseClusters = [
        { x: 0.27, tier: 2, size: 1.05, bitePhase: 0.2 },
        { x: 0.51, tier: 2, size: 1.18, bitePhase: 0.7 },
        { x: 0.73, tier: 1, size: 0.94, bitePhase: 0.4 }
      ];
      packAgents = [];
      for (let i = 0; i < 16; i += 1) {
        const cIdx = i % cheeseClusters.length;
        const tier = i < 11 ? 2 : 1;
        packAgents.push({
          x: 0.08 + rng() * 0.84,
          tier: tier,
          dir: rng() > 0.5 ? 1 : -1,
          speed: 0.075 + rng() * 0.085,
          jawPhase: rng() * Math.PI * 2,
          scale: 0.82 + rng() * 0.38,
          cheeseIdx: cIdx
        });
      }
      umbrellaAgents = [];
      for (let j = 0; j < 10; j += 1) {
        umbrellaAgents.push({
          x: (j / 10) + rng() * 0.07,
          tier: j % 2 === 0 ? 1 : 0,
          dir: j % 3 === 0 ? -1 : 1,
          speed: 0.042 + rng() * 0.036,
          stride: rng() * Math.PI * 2,
          span: 0.88 + rng() * 0.26
        });
      }
      moldDrops = [];
      for (let m = 0; m < 24; m += 1) {
        moldDrops.push({
          x: 0.05 + rng() * 0.9,
          y: rng(),
          speed: 0.045 + rng() * 0.065,
          r: 1.4 + rng() * 2.2,
          tier: m % 3
        });
      }
      mortarDust = [];
    }
    seedWorld();
    function spawnBurst(count, isCheese) {
      for (let i = 0; i < count; i += 1) {
        const ang = (i / count) * Math.PI * 2 + (i % 3) * 0.21;
        const spd = 0.06 + (i % 5) * 0.032;
        mortarDust.push({
          x: isCheese ? cheeseClusters[i % cheeseClusters.length].x : 0.5 + ((i % 7) - 3) * 0.04,
          y: isCheese ? TIER_Y[cheeseClusters[i % cheeseClusters.length].tier] : 0.18 + (i / count) * 0.64,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - (isCheese ? 0.04 : 0.01),
          life: 1,
          isCheese: Boolean(isCheese)
        });
      }
      if (mortarDust.length > 48) mortarDust.splice(0, mortarDust.length - 48);
    }

    function getState() {
      return {
        decadeIndex: decadeIndex,
        decadeId: DECADES[decadeIndex].id,
        hurryPressure: Number(hurryPressure.toFixed(3)),
        cheeseScramblesCount: cheeseScramblesCount,
        packAgentCount: packAgents.length,
        umbrellaCount: umbrellaAgents.length,
        relationshipUnchanged: true,
        reducedMotion: reducedMotion
      };
    }

    function step(dtSec, sharedState) {
      const dt = clamp(dtSec, 0, 0.1);
      const st = sharedState || {};
      if (st.ratDominance !== undefined) ratDominance = clamp01(st.ratDominance);
      if (st.wallTranslucency !== undefined) wallTranslucency = clamp01(st.wallTranslucency);
      if (st.obliqueAngleDeg !== undefined) obliqueAngleDeg = clamp(st.obliqueAngleDeg, 0, 90);
      if (st.obliquePerspectiveAligned !== undefined) obliquePerspectiveAligned = Boolean(st.obliquePerspectiveAligned);
      if (st.swallowApertureOpen !== undefined) swallowApertureOpen = Boolean(st.swallowApertureOpen);
      if (st.decadeIndex !== undefined) decadeIndex = clamp(Math.round(st.decadeIndex), 0, 2);
      const forcedNow = Boolean(st.forcedGraspActive);
      if (forcedNow && !prevForcedGrasp) {
        snapShudder = 1;
        hurryPressure = Math.max(hurryPressure, 0.94);
        spawnBurst(18, false);
      }
      prevForcedGrasp = forcedNow;
      if (reducedMotion) return;

      simTime += dt;
      snapShudder = Math.max(0, snapShudder - dt * 2.1);
      scrambleBurst = Math.max(0, scrambleBurst - dt * 1.4);
      const targetHurry = 0.36 + ratDominance * 0.36 + (forcedNow ? 0.18 : 0);
      hurryPressure += (targetHurry - hurryPressure) * Math.min(1, dt * 2.4);

      for (let i = 0; i < packAgents.length; i += 1) {
        const p = packAgents[i];
        const targetX = cheeseClusters[p.cheeseIdx].x;
        if (scrambleBurst > 0.15) p.dir = targetX >= p.x ? 1 : -1;
        p.x += p.dir * p.speed * (0.65 + hurryPressure * 0.95) * dt;
        if (p.x < 0.05) { p.x = 0.05; p.dir = 1; }
        if (p.x > 0.95) { p.x = 0.95; p.dir = -1; }
        p.jawPhase += dt * (9 + hurryPressure * 10);
      }
      for (let j = 0; j < umbrellaAgents.length; j += 1) {
        const u = umbrellaAgents[j];
        u.x = (u.x + u.dir * u.speed * (0.7 + hurryPressure * 0.7) * dt + 1) % 1;
        u.stride += dt * (5.8 + hurryPressure * 4.2);
      }
      for (let m = 0; m < moldDrops.length; m += 1) {
        const d = moldDrops[m];
        d.y = (d.y + d.speed * dt) % 1;
      }
      for (let k = mortarDust.length - 1; k >= 0; k -= 1) {
        const pt = mortarDust[k];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.vy += 0.18 * dt;
        pt.life -= dt * 1.75;
        if (pt.life <= 0) mortarDust.splice(k, 1);
      }
    }

    function triggerCheeseScramble() {
      hurryPressure = 1.0;
      scrambleBurst = 1.0;
      cheeseScramblesCount += 1;
      for (let i = 0; i < packAgents.length; i += 1) {
        const p = packAgents[i];
        const cx = cheeseClusters[p.cheeseIdx].x;
        p.dir = cx >= p.x ? 1 : -1;
        p.x += (cx - p.x) * 0.28;
        p.jawPhase += 1.3;
      }
      spawnBurst(14, true);
      const snap = getState();
      if (onPackScramble) onPackScramble(snap);
      return snap;
    }

    function setDecadeIndex(idx) {
      decadeIndex = clamp(Math.round(Number(idx) || 0), 0, 2);
      return getState();
    }

    function hitTestStone(normX, normY, hitOpts) {
      const nx = Number(normX);
      const ny = Number(normY);
      if (!Number.isFinite(nx) || !Number.isFinite(ny)) return null;
      let best = null;
      let bestDist = 0.06;
      for (let i = 0; i < RAT_STONES.length; i += 1) {
        const st = RAT_STONES[i];
        const dist = Math.hypot(nx - st.anchorX, ny - st.anchorY);
        if (dist <= bestDist) { bestDist = dist; best = st; }
      }
      if (best && hitOpts && hitOpts.select && onStoneSelect) onStoneSelect(best);
      return best;
    }

    function activateStoneAt(normX, normY) {
      const hit = hitTestStone(normX, normY);
      if (hit && onStoneSelect) onStoneSelect(hit);
      return hit;
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      return reducedMotion;
    }

    function reset() {
      decadeIndex = 1;
      hurryPressure = 0.62;
      cheeseScramblesCount = 0;
      ratDominance = 0.86;
      wallTranslucency = 0;
      obliqueAngleDeg = 12;
      obliquePerspectiveAligned = false;
      swallowApertureOpen = false;
      prevForcedGrasp = false;
      snapShudder = 0;
      scrambleBurst = 0;
      simTime = 0;
      seedWorld();
      return getState();
    }
    function render(ctx, width, height, sharedState) {
      if (!ctx || width <= 0 || height <= 0) return;
      const st = sharedState || {};
      const trans = st.wallTranslucency !== undefined ? clamp01(st.wallTranslucency) : wallTranslucency;
      const dom = st.ratDominance !== undefined ? clamp01(st.ratDominance) : ratDominance;
      const angle = st.obliqueAngleDeg !== undefined ? clamp(st.obliqueAngleDeg, 0, 90) : obliqueAngleDeg;
      const aligned = st.obliquePerspectiveAligned !== undefined ? Boolean(st.obliquePerspectiveAligned) : obliquePerspectiveAligned;
      const forced = st.forcedGraspActive !== undefined ? Boolean(st.forcedGraspActive) : prevForcedGrasp;
      const dec = st.decadeIndex !== undefined ? clamp(Math.round(st.decadeIndex), 0, 2) : decadeIndex;
      const activeStoneId = st.activeStoneId || null;

      const theta = obliqueThetaRad(angle);
      const nx = Math.cos(theta);
      const ny = Math.sin(theta);
      const tx = -ny;
      const ty = nx;
      const cx = width * 0.5;
      const cy = height * 0.5;
      const minDim = Math.min(width, height);
      const diag = Math.hypot(width, height) * 1.4;

      let halfGap = 0;
      if (trans > 0.002 && !forced) {
        if (trans < 0.42) {
          halfGap = (trans / 0.42) * minDim * 0.13;
        } else {
          const u = (trans - 0.42) / 0.58;
          const ease = u * u * (3 - 2 * u);
          halfGap = minDim * 0.13 + ease * Math.max(width, height) * 0.44;
        }
      }
      const wallAlpha = forced ? 1 : clamp(1 - trans * 0.88, 0.08, 1);
      const mortarAlpha = forced ? 0.92 : clamp((1 - trans * 1.25) * 0.74, 0, 0.88);
      const entityAlpha = forced ? 1 : clamp((0.25 + dom * 0.85) * (1 - trans * 0.82), 0.06, 1);
      const shudX = snapShudder > 0 ? Math.sin(simTime * 54 + 0.9) * snapShudder * 5.5 : 0;
      const shudY = snapShudder > 0 ? Math.cos(simTime * 43) * snapShudder * 3.5 : 0;

      function drawVaultHalf(side) {
        ctx.save();
        const lx = cx + side * halfGap * nx;
        const ly = cy + side * halfGap * ny;
        ctx.beginPath();
        ctx.moveTo(lx - tx * diag, ly - ty * diag);
        ctx.lineTo(lx + tx * diag, ly + ty * diag);
        ctx.lineTo(lx + tx * diag + side * nx * diag, ly + ty * diag + side * ny * diag);
        ctx.lineTo(lx - tx * diag + side * nx * diag, ly - ty * diag + side * ny * diag);
        ctx.closePath();
        ctx.clip();

        ctx.translate(side * halfGap * 0.34 * nx + shudX * side, side * halfGap * 0.18 * ny + shudY);
        ctx.fillStyle = hexToRgba(PALETTE.leadVaultDark, wallAlpha);
        ctx.fillRect(-width * 0.25, -height * 0.25, width * 1.5, height * 1.5);

        const rows = 9;
        const cols = width < 520 ? 5 : 8;
        const rh = height / rows;
        const cw = width / cols;
        for (let r = 0; r < rows; r += 1) {
          const y0 = r * rh;
          const off = (r % 2) * cw * 0.5;
          for (let c = -1; c <= cols; c += 1) {
            const x0 = c * cw + off;
            ctx.fillStyle = hexToRgba(PALETTE.compactWallSlate, wallAlpha * (0.86 + ((r + c) & 1) * 0.12));
            ctx.fillRect(x0 + 1.5, y0 + 1.5, cw - 3, rh - 3);
            if (mortarAlpha > 0.02) {
              ctx.strokeStyle = hexToRgba(PALETTE.wetMortarAsh, mortarAlpha * 0.55);
              ctx.lineWidth = forced ? 2.2 : 1.1;
              ctx.strokeRect(x0 + 1, y0 + 1, cw - 2, rh - 2);
            }
            if (((r * 5 + c * 3) % 4) === 0) {
              ctx.fillStyle = hexToRgba(PALETTE.dampMoldOlive, wallAlpha * (forced ? 0.72 : 0.46));
              ctx.fillRect(x0 + 4, y0 + rh * 0.62, cw * 0.52, rh * 0.26);
            }
          }
        }

        const th = height * 0.145;
        for (let t = 0; t < 3; t += 1) {
          const tyCenter = TIER_Y[t] * height;
          const topY = tyCenter - th * 0.55;
          ctx.fillStyle = hexToRgba(PALETTE.batUmbrellaBlack, wallAlpha * 0.88);
          ctx.fillRect(0, topY, width, th);
          ctx.strokeStyle = hexToRgba(PALETTE.wetMortarAsh, wallAlpha * 0.65);
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(0, topY);
          ctx.lineTo(width, topY);
          ctx.moveTo(0, topY + th);
          ctx.lineTo(width, topY + th);
          ctx.stroke();

          if (dec === 0) {
            for (let g = 0; g < 6; g += 1) {
              const gx = ((g + 0.5) / 6) * width;
              ctx.strokeStyle = hexToRgba(PALETTE.wetMortarAsh, entityAlpha * 0.62);
              ctx.strokeRect(gx - 12, topY + th - 7, 24, 6);
              if (g % 2 === t % 2) {
                const flick = 0.78 + Math.sin(simTime * 7 + g) * 0.16;
                ctx.fillStyle = hexToRgba(PALETTE.rancidCheeseOchre, entityAlpha * 0.32 * flick);
                ctx.beginPath();
                ctx.arc(gx, topY + 11, 13, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = hexToRgba(PALETTE.ferociousToothIvory, entityAlpha * 0.82);
                ctx.fillRect(gx - 2, topY + 7, 4, 7);
              }
            }
          } else if (dec === 1) {
            ctx.fillStyle = hexToRgba(PALETTE.compactWallSlate, entityAlpha * 0.92);
            ctx.fillRect(0, topY + 4, width, 7);
            for (let rv = 18; rv < width; rv += 44) {
              ctx.fillStyle = hexToRgba(PALETTE.wetMortarAsh, entityAlpha * 0.85);
              ctx.fillRect(rv - 2, topY + 2, 4, 11);
            }
          } else {
            for (let fl = 0; fl < 4; fl += 1) {
              const fx = ((fl + 0.5) / 4) * width;
              const hum = 0.72 + Math.sin(simTime * 19 + fl * 2.1) * 0.14;
              ctx.fillStyle = hexToRgba(PALETTE.crystalPrismCyan, entityAlpha * 0.42 * hum);
              ctx.fillRect(fx - width * 0.08, topY + 3, width * 0.16, 3.5);
              ctx.fillStyle = hexToRgba(PALETTE.gauzeVeilPearl, entityAlpha * 0.65 * hum);
              ctx.fillRect(fx - width * 0.07, topY + 4, width * 0.14, 1.5);
            }
          }
        }

        for (let m = 0; m < moldDrops.length; m += 1) {
          const d = moldDrops[m];
          ctx.fillStyle = hexToRgba(PALETTE.dampMoldOlive, entityAlpha * 0.74);
          ctx.beginPath();
          ctx.arc(d.x * width, d.y * height, d.r, 0, Math.PI * 2);
          ctx.fill();
        }

        for (let c = 0; c < cheeseClusters.length; c += 1) {
          const ch = cheeseClusters[c];
          const cxp = ch.x * width;
          const cyp = TIER_Y[ch.tier] * height + th * 0.34;
          const ws = Math.max(11, minDim * 0.022) * ch.size;
          ctx.fillStyle = hexToRgba(PALETTE.rancidCheeseOchre, entityAlpha * 0.95);
          ctx.beginPath();
          ctx.moveTo(cxp - ws, cyp);
          ctx.lineTo(cxp + ws, cyp);
          ctx.lineTo(cxp + ws * 0.35, cyp - ws * 0.95);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = hexToRgba(PALETTE.leadVaultDark, entityAlpha * 0.75);
          ctx.beginPath();
          ctx.arc(cxp, cyp - ws * 0.32, ws * 0.16, 0, Math.PI * 2);
          ctx.fill();
        }

        for (let i = 0; i < packAgents.length; i += 1) {
          const p = packAgents[i];
          const px = p.x * width;
          const py = TIER_Y[p.tier] * height + th * 0.31;
          const sz = Math.max(8, minDim * 0.015) * p.scale;
          const snap = Math.abs(Math.sin(p.jawPhase)) * 0.45 + (scrambleBurst * 0.35);
          ctx.fillStyle = hexToRgba(PALETTE.batUmbrellaBlack, entityAlpha * 0.96);
          ctx.beginPath();
          ctx.ellipse(px, py - sz * 0.35, sz * 1.15, sz * 0.58, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = hexToRgba(PALETTE.wetMortarAsh, entityAlpha * 0.55);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(px - p.dir * sz * 1.1, py - sz * 0.3);
          ctx.quadraticCurveTo(px - p.dir * sz * 2.0, py - sz * 0.9, px - p.dir * sz * 2.4, py - sz * 0.2);
          ctx.stroke();
          ctx.fillStyle = hexToRgba(PALETTE.ferociousToothIvory, entityAlpha * 0.96);
          ctx.beginPath();
          ctx.moveTo(px + p.dir * sz * 0.95, py - sz * (0.48 + snap * 0.35));
          ctx.lineTo(px + p.dir * sz * 1.45, py - sz * 0.28);
          ctx.lineTo(px + p.dir * sz * 0.95, py - sz * (0.12 - snap * 0.25));
          ctx.closePath();
          ctx.fill();
        }

        for (let j = 0; j < umbrellaAgents.length; j += 1) {
          const u = umbrellaAgents[j];
          const ux = u.x * width;
          const uy = TIER_Y[u.tier] * height + th * 0.36;
          const us = Math.max(13, minDim * 0.026) * u.span;
          const lean = u.dir * 0.16;
          const coatSweep = (dec === 2 ? 1.28 : 0.95) * us;
          ctx.fillStyle = hexToRgba(PALETTE.batUmbrellaBlack, entityAlpha * 0.95);
          ctx.beginPath();
          ctx.moveTo(ux, uy - us * 1.15);
          ctx.lineTo(ux - u.dir * coatSweep * 0.55, uy);
          ctx.lineTo(ux + u.dir * coatSweep * 0.36, uy);
          ctx.closePath();
          ctx.fill();

          const cyUm = uy - us * 1.38 + Math.sin(u.stride) * 1.6;
          ctx.beginPath();
          ctx.moveTo(ux - us * 1.15, cyUm + us * 0.18);
          ctx.quadraticCurveTo(ux, cyUm - us * 0.72, ux + us * 1.15, cyUm + us * 0.18);
          for (let rb = 4; rb >= 0; rb -= 1) {
            const rx = ux - us * 1.15 + (rb / 5) * us * 2.3;
            ctx.quadraticCurveTo(rx + us * 0.23, cyUm + us * 0.02, rx, cyUm + us * 0.22);
          }
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = hexToRgba(PALETTE.wetMortarAsh, entityAlpha * 0.5);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ux + lean * us, cyUm - us * 0.32);
          ctx.lineTo(ux, uy - us * 0.55);
          ctx.stroke();
        }
        ctx.restore();
      }

      drawVaultHalf(-1);
      drawVaultHalf(1);

      ctx.save();
      if (trans > 0.01 && !forced) {
        for (let s = -1; s <= 1; s += 2) {
          const lx = cx + s * halfGap * nx;
          const ly = cy + s * halfGap * ny;
          ctx.strokeStyle = hexToRgba(PALETTE.crystalPrismCyan, clamp01(trans * 1.2) * 0.78);
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(lx - tx * diag, ly - ty * diag);
          ctx.lineTo(lx + tx * diag, ly + ty * diag);
          ctx.stroke();
          ctx.strokeStyle = hexToRgba(PALETTE.gauzeVeilPearl, clamp01(trans) * 0.52);
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(lx - tx * diag + s * nx * 4, ly - ty * diag + s * ny * 4);
          ctx.lineTo(lx + tx * diag + s * nx * 4, ly + ty * diag + s * ny * 4);
          ctx.stroke();
        }
      } else {
        ctx.strokeStyle = aligned
          ? hexToRgba(PALETTE.crystalPrismCyan, 0.55)
          : hexToRgba(forced ? PALETTE.dampMoldOlive : PALETTE.wetMortarAsh, forced ? 0.9 : 0.42);
        ctx.lineWidth = forced ? 3.4 : 1.6;
        ctx.beginPath();
        ctx.moveTo(cx - tx * diag, cy - ty * diag);
        ctx.lineTo(cx + tx * diag, cy + ty * diag);
        ctx.stroke();
      }
      for (let k = 0; k < mortarDust.length; k += 1) {
        const pt = mortarDust[k];
        const col = pt.isCheese
          ? (k % 2 === 0 ? PALETTE.rancidCheeseOchre : PALETTE.ferociousToothIvory)
          : (k % 2 === 0 ? PALETTE.wetMortarAsh : PALETTE.dampMoldOlive);
        ctx.fillStyle = hexToRgba(col, clamp01(pt.life) * 0.88);
        ctx.beginPath();
        ctx.arc(pt.x * width, pt.y * height, pt.isCheese ? 2.4 : 3.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      ctx.save();
      for (let sIdx = 0; sIdx < RAT_STONES.length; sIdx += 1) {
        const stone = RAT_STONES[sIdx];
        const sx = stone.anchorX * width;
        const sy = stone.anchorY * height;
        const active = activeStoneId === stone.id;
        const sAlpha = active ? 0.98 : clamp(1 - trans * 0.74, 0.22, 0.9);
        const rad = Math.max(9, minDim * 0.017) * (active ? 1.22 : 1);
        ctx.fillStyle = hexToRgba(PALETTE.compactWallSlate, sAlpha * 0.9);
        ctx.strokeStyle = hexToRgba(active ? PALETTE.rancidCheeseOchre : PALETTE.ferociousToothIvory, sAlpha * (active ? 0.98 : 0.62));
        ctx.lineWidth = active ? 2.2 : 1.3;
        ctx.beginPath();
        for (let v = 0; v < 8; v += 1) {
          const va = (v / 8) * Math.PI * 2 + Math.PI * 0.125;
          const vx = sx + Math.cos(va) * rad;
          const vy = sy + Math.sin(va) * rad;
          if (v === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = hexToRgba(active ? PALETTE.sunlitCornfieldGold : PALETTE.rancidCheeseOchre, sAlpha * 0.92);
        ctx.beginPath();
        ctx.arc(sx, sy, rad * 0.28, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    return {
      step: step,
      render: render,
      triggerCheeseScramble: triggerCheeseScramble,
      setDecadeIndex: setDecadeIndex,
      hitTestStone: hitTestStone,
      activateStoneAt: activateStoneAt,
      createSubterraneanAudio: createSubterraneanAudio,
      setReducedMotion: setReducedMotion,
      reset: reset,
      getState: getState
    };
  }

  return Object.freeze({
    PALETTE: PALETTE,
    DECADES: DECADES,
    RAT_STONES: RAT_STONES,
    createRatTunnels: createRatTunnels,
    createSubterraneanAudio: createSubterraneanAudio
  });
})();

if (typeof window !== 'undefined') {
  window.MaroziaRatTunnels = globalThis.MaroziaRatTunnels;
}
