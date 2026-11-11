(function () {
  'use strict';

  const PALETTE = Object.freeze({
    abyssVoid: '#0b1017',
    chasmBed: '#141d29',
    graniteShadow: '#1d232c',
    graniteCrest: '#545d68',
    graniteHighlight: '#86909c',
    abyssMist: '#c9d6e3',
    cloudDrift: '#8fa4ba',
    hempOchre: '#c89b54',
    hempTaupe: '#9e7334',
    chainIron: '#3b434e',
    lanternAmber: '#f2b84b',
    gasGlow: '#ffd67c',
    trailingIvy: '#5e8c61',
    frayCrimson: '#c9534a'
  });

  const HOOK_SPEC = Object.freeze([
    Object.freeze({ hookIndex: 0, id: 'west_hemp_spur', label: 'West Hemp Spur', supportType: 'hemp_rope', normX: 0.17, tier: 2 }),
    Object.freeze({ hookIndex: 1, id: 'west_catwalk_berth', label: 'West Catwalk Berth', supportType: 'wooden_tie_catwalk', normX: 0.22, tier: 1 }),
    Object.freeze({ hookIndex: 2, id: 'windward_tie_spar', label: 'Windward Tie Spar', supportType: 'wooden_tie_catwalk', normX: 0.27, tier: 1 }),
    Object.freeze({ hookIndex: 3, id: 'upper_west_chain', label: 'Upper West Chain Link', supportType: 'iron_chain', normX: 0.32, tier: 0 }),
    Object.freeze({ hookIndex: 4, id: 'mist_belly_strand', label: 'Mist-Belly Hemp Strand', supportType: 'hemp_rope', normX: 0.37, tier: 2 }),
    Object.freeze({ hookIndex: 5, id: 'midwest_tie_ring', label: 'Mid-West Tie Ring', supportType: 'wooden_tie_catwalk', normX: 0.42, tier: 1 }),
    Object.freeze({ hookIndex: 6, id: 'nadir_iron_shackle', label: 'Central Iron Shackle', supportType: 'iron_chain', normX: 0.47, tier: 0 }),
    Object.freeze({ hookIndex: 7, id: 'radial_web_knot', label: 'Radial Web Knot', supportType: 'hemp_rope', normX: 0.52, tier: 2 }),
    Object.freeze({ hookIndex: 8, id: 'mideast_catwalk_hatch', label: 'Mid-East Catwalk Hatch', supportType: 'wooden_tie_catwalk', normX: 0.57, tier: 1 }),
    Object.freeze({ hookIndex: 9, id: 'crown_chain_clevis', label: 'Crown Chain Clevis', supportType: 'iron_chain', normX: 0.62, tier: 0 }),
    Object.freeze({ hookIndex: 10, id: 'outer_hemp_trapeze_eye', label: 'Outer Hemp Web Eye', supportType: 'hemp_rope', normX: 0.67, tier: 2 }),
    Object.freeze({ hookIndex: 11, id: 'traverse_chain_lug', label: 'Traverse Chain Lug', supportType: 'iron_chain', normX: 0.725, tier: 0 }),
    Object.freeze({ hookIndex: 12, id: 'east_catwalk_lantern_hook', label: 'East Catwalk Tie Hook', supportType: 'wooden_tie_catwalk', normX: 0.78, tier: 1 }),
    Object.freeze({ hookIndex: 13, id: 'east_cliff_hemp_bight', label: 'East Cliff Hemp Bight', supportType: 'hemp_rope', normX: 0.83, tier: 2 })
  ]);

  const COSH_HALF = Math.cosh(1.15) - 1;

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function catenarySagProfile(u) {
    const uc = clamp(u, 0, 1);
    return 1 - (Math.cosh(2.3 * (uc - 0.5)) - 1) / COSH_HALF;
  }

  function distToSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq <= 1e-6) return Math.hypot(px - x1, py - y1);
    const t = clamp(((px - x1) * dx + (py - y1) * dy) / lenSq, 0, 1);
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  function createRiggingAudio(initialMuted) {
    let muted = Boolean(initialMuted);
    let ctx = null;
    let droneGain = null;
    let droneOscA = null;
    let droneOscB = null;

    function ensureContext() {
      if (muted) return null;
      if (ctx) {
        if (ctx.state === 'suspended') {
          try { ctx.resume(); } catch (_) {}
        }
        return ctx;
      }
      try {
        const Ctor = (typeof globalThis !== 'undefined') &&
          (globalThis.AudioContext || globalThis.webkitAudioContext);
        if (!Ctor) return null;
        ctx = new Ctor();
        droneGain = ctx.createGain();
        droneGain.gain.value = 0.0001;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 340;
        droneOscA = ctx.createOscillator();
        droneOscB = ctx.createOscillator();
        droneOscA.type = 'sine';
        droneOscB.type = 'triangle';
        droneOscA.frequency.value = 110;
        droneOscB.frequency.value = 165;
        droneOscA.connect(filter);
        droneOscB.connect(filter);
        filter.connect(droneGain);
        droneGain.connect(ctx.destination);
        droneOscA.start();
        droneOscB.start();
      } catch (_) {
        ctx = null;
      }
      return ctx;
    }

    function syncDrone(windKnots, tensionRatio) {
      if (!ctx || !droneGain) return;
      try {
        const now = ctx.currentTime;
        const targetGain = muted ? 0.0001 : clamp(0.006 + (windKnots / 32) * 0.026, 0.004, 0.036);
        const baseFreq = 98 + clamp(tensionRatio, 0.14, 1.25) * 44 + windKnots * 0.45;
        droneGain.gain.setTargetAtTime(targetGain, now, 0.12);
        droneOscA.frequency.setTargetAtTime(baseFreq, now, 0.15);
        droneOscB.frequency.setTargetAtTime(baseFreq * 1.498, now, 0.15);
      } catch (_) {}
    }

    function trigger(kind, intensity, tensionRatio) {
      if (muted) return false;
      const ac = ensureContext();
      if (!ac) return false;
      try {
        const now = ac.currentTime;
        const amp = clamp(Number(intensity) || 0.55, 0.08, 1.0);
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        const tRatio = clamp(Number(tensionRatio) || 0.4, 0.14, 1.25);
        if (kind === 'wooden_tie') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(195 + (Math.random() * 28), now);
          osc.frequency.exponentialRampToValueAtTime(82, now + 0.075);
          gain.gain.setValueAtTime(0.06 * amp, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);
          osc.connect(gain); gain.connect(ac.destination);
          osc.start(now); osc.stop(now + 0.09);
        } else if (kind === 'upward_collapse') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(210, now);
          osc.frequency.exponentialRampToValueAtTime(38, now + 0.48);
          gain.gain.setValueAtTime(0.09 * amp, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.52);
          osc.connect(gain); gain.connect(ac.destination);
          osc.start(now); osc.stop(now + 0.54);
        } else if (kind === 'pulley_chime') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
          gain.gain.setValueAtTime(0.05 * amp, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
          osc.connect(gain); gain.connect(ac.destination);
          osc.start(now); osc.stop(now + 0.28);
        } else if (kind === 'wind_harp') {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(220 + tRatio * 65, now);
          osc.frequency.exponentialRampToValueAtTime(330 + tRatio * 95, now + 0.42);
          gain.gain.setValueAtTime(0.045 * amp, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.46);
          osc.connect(gain); gain.connect(ac.destination);
          osc.start(now); osc.stop(now + 0.48);
        } else {
          osc.type = 'triangle';
          const f0 = 155 + tRatio * 120;
          osc.frequency.setValueAtTime(f0, now);
          osc.frequency.exponentialRampToValueAtTime(f0 * 0.72, now + 0.24);
          gain.gain.setValueAtTime(0.07 * amp, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
          osc.connect(gain); gain.connect(ac.destination);
          osc.start(now); osc.stop(now + 0.28);
        }
        return true;
      } catch (_) {
        return false;
      }
    }

    return {
      unlock() { ensureContext(); },
      setMuted(flag, windKnots, tensionRatio) {
        muted = Boolean(flag);
        if (!muted) ensureContext();
        syncDrone(windKnots || 9, tensionRatio || 0.2);
        return muted;
      },
      isMuted() { return muted; },
      syncDrone,
      trigger
    };
  }

  function createCatenaryWeb(opts = {}) {
    const WOODEN_TIE_COUNT = 44;
    const CHAIN_SPAN_COUNT = 4;
    const HEMP_STRAND_COUNT = 18;
    const CHASM_DEPTH_FEET = 840;
    const CLOUD_COUNT = 9;
    const MAX_SAFE_LOAD_KG = 540;

    let reducedMotion = Boolean(opts.reducedMotion);
    const audio = createRiggingAudio(opts.muted !== undefined ? opts.muted : true);

    let width = 1280;
    let height = 800;
    let dpr = 1;
    let timeSec = 0;
    let windKnots = 9;
    let totalMassKg = 0;
    let meanTensionRatio = 0.16;
    let maxStrandTension = 0.21;
    let meanSagPx = 5.4;
    let ankleTwistRisk = 0.28;
    let shockTrauma = 0;
    let chasmBedVisibility = 0.42;

    let walkerNormX = 0.26;
    let walkerTargetNormX = 0.26;
    let walkerAccumDist = 0;
    let woodenTieSteps = 0;
    let walkerClingingToHemp = false;

    const westCrestPoly = [];
    const eastCrestPoly = [];
    const moorings = { westPitons: [], eastPitons: [], westBollards: [], eastBollards: [] };
    const chainSpans = [];
    const woodenTies = [];
    const hempStrands = [];
    const fallingFragments = [];

    const clouds = Array.from({ length: CLOUD_COUNT }, (_, idx) => {
      const layer = idx % 3;
      return {
        index: idx,
        layer,
        normX: (idx * 0.125 + layer * 0.07) % 1.16 - 0.08,
        normY: layer === 0 ? 0.81 + (idx % 3) * 0.018 : (layer === 1 ? 0.71 + (idx % 3) * 0.022 : 0.625 + (idx % 3) * 0.022),
        rxRatio: 0.11 + (idx % 4) * 0.028 + layer * 0.015,
        ryRatio: 0.024 + layer * 0.006,
        speedRatio: 0.0055 + layer * 0.0032 + (idx % 2) * 0.0014,
        alpha: layer === 0 ? 0.24 : (layer === 1 ? 0.34 : 0.22),
        seed: idx * 1.71 + 0.4
      };
    });

    const hooks = HOOK_SPEC.map((spec) => ({
      hookIndex: spec.hookIndex,
      id: spec.id,
      label: spec.label,
      supportType: spec.supportType,
      normX: spec.normX,
      tier: spec.tier,
      baseX: spec.normX * width,
      baseY: 0.3 * height,
      equilY: 0.3 * height + 5,
      x: spec.normX * width,
      y: 0.3 * height + 5,
      vx: 0,
      vy: 0,
      targetSagPx: 5,
      localSagPx: 5,
      massKg: 0,
      isHung: false,
      tension: 0.18
    }));

    function tierBaseY(tier, normX) {
      const xWest = 0.132;
      const xEast = 0.868;
      const u = clamp((normX - xWest) / (xEast - xWest), 0, 1);
      const prof = catenarySagProfile(u);
      const slightTilt = (u - 0.5) * 0.012 * height;
      if (tier === 0) return height * 0.165 + prof * (height * 0.092) + slightTilt;
      if (tier === 1) return height * 0.238 + prof * (height * 0.106) + slightTilt;
      return height * 0.295 + prof * (height * 0.132) + slightTilt;
    }

    function hookDeflectionAtNormX(normX, tierWeight) {
      let num = 0;
      let den = 0;
      for (let i = 0; i < hooks.length; i++) {
        const h = hooks[i];
        const dist = Math.abs(normX - h.normX);
        const w = Math.exp(-dist * 11.5) * (tierWeight === undefined || h.tier === tierWeight ? 1.25 : 0.72);
        num += (h.y - h.baseY) * w;
        den += w;
      }
      const edgeFade = Math.sin(clamp((normX - 0.132) / (0.868 - 0.132), 0, 1) * Math.PI);
      return (den > 0 ? num / den : 0) * Math.pow(Math.max(0, edgeFade), 0.65);
    }

    function recomputeCloudsVisibility() {
      let centerCover = 0;
      for (let i = 0; i < clouds.length; i++) {
        const c = clouds[i];
        const dist = Math.abs(c.normX - 0.5);
        const span = c.rxRatio * 1.35;
        if (dist < span) {
          centerCover += (1 - dist / span) * (c.layer === 2 ? 0.22 : 0.36);
        }
      }
      chasmBedVisibility = Number(clamp(0.68 - centerCover * 0.44, 0.22, 0.68).toFixed(3));
    }

    function recomputeMetrics() {
      let sagSum = 0;
      let maxT = 0.14;
      const loadRatio = totalMassKg / MAX_SAFE_LOAD_KG;
      const windRatio = windKnots / 32;
      meanTensionRatio = Number(clamp(0.16 + loadRatio * 0.66 + windRatio * 0.16 + shockTrauma * 0.22, 0.14, 1.25).toFixed(3));

      for (let i = 0; i < hooks.length; i++) {
        const h = hooks[i];
        h.localSagPx = Number(Math.max(0.5, h.y - h.baseY).toFixed(2));
        sagSum += h.localSagPx;
        const dynStrain = Math.min(0.24, Math.hypot(h.vx, h.vy) * 0.0045);
        const localLoad = (h.isHung ? h.massKg : 0) / 85;
        h.tension = Number(clamp(meanTensionRatio * 0.78 + localLoad * 0.28 + dynStrain + (h.tier === 0 ? 0.05 : 0), 0.14, 1.32).toFixed(3));
        if (h.tension > maxT) maxT = h.tension;
      }
      meanSagPx = Number((sagSum / hooks.length).toFixed(2));
      maxStrandTension = Number(clamp(maxT, 0.14, 1.35).toFixed(3));

      let risk = 0.28;
      if (totalMassKg > 0 && totalMassKg <= MAX_SAFE_LOAD_KG) {
        const ballast = clamp(totalMassKg / 454, 0, 1);
        risk = 0.28 - 0.215 * ballast;
      } else if (totalMassKg > MAX_SAFE_LOAD_KG) {
        risk = 0.35 + clamp((totalMassKg - MAX_SAFE_LOAD_KG) / 210, 0, 0.42);
      }
      if (windKnots <= 12) {
        risk += (windKnots - 9) * 0.0025;
      } else if (windKnots <= 22) {
        risk += 0.008 + (windKnots - 12) * 0.014;
      } else {
        risk += 0.155 + (windKnots - 22) * 0.028;
      }
      risk += shockTrauma;
      ankleTwistRisk = Number(clamp(risk, 0.05, 0.98).toFixed(3));
      walkerClingingToHemp = Boolean(windKnots >= 16 || ankleTwistRisk > 0.30);
      audio.syncDrone(windKnots, meanTensionRatio);
    }

    function rebuildStaticCrests() {
      westCrestPoly.length = 0;
      eastCrestPoly.length = 0;
      const wProfile = [
        [0, 0], [0.145, 0], [0.141, 0.09], [0.134, 0.17], [0.143, 0.25],
        [0.131, 0.33], [0.139, 0.44], [0.124, 0.57], [0.136, 0.71],
        [0.118, 0.85], [0.132, 1.0], [0, 1.0]
      ];
      const eProfile = [
        [1, 0], [0.855, 0], [0.861, 0.08], [0.868, 0.17], [0.857, 0.25],
        [0.869, 0.34], [0.860, 0.45], [0.875, 0.58], [0.863, 0.72],
        [0.881, 0.86], [0.867, 1.0], [1, 1.0]
      ];
      for (let i = 0; i < wProfile.length; i++) {
        westCrestPoly.push({ x: wProfile[i][0] * width, y: wProfile[i][1] * height });
      }
      for (let i = 0; i < eProfile.length; i++) {
        eastCrestPoly.push({ x: eProfile[i][0] * width, y: eProfile[i][1] * height });
      }
      moorings.westPitons = [
        { x: 0.132 * width, y: 0.135 * height },
        { x: 0.134 * width, y: 0.168 * height }
      ];
      moorings.eastPitons = [
        { x: 0.868 * width, y: 0.145 * height },
        { x: 0.866 * width, y: 0.178 * height }
      ];
      moorings.westBollards = [
        { x: 0.136 * width, y: 0.238 * height },
        { x: 0.130 * width, y: 0.296 * height },
        { x: 0.134 * width, y: 0.365 * height }
      ];
      moorings.eastBollards = [
        { x: 0.862 * width, y: 0.246 * height },
        { x: 0.869 * width, y: 0.304 * height },
        { x: 0.864 * width, y: 0.372 * height }
      ];
    }

    function sampleCatenaryPts(x1, y1, x2, y2, tierRef, sagBoost) {
      const pts = [];
      const steps = 16;
      for (let s = 0; s <= steps; s++) {
        const u = s / steps;
        const x = x1 + (x2 - x1) * u;
        const nx = x / width;
        const sag = catenarySagProfile(u) * sagBoost + hookDeflectionAtNormX(nx, tierRef);
        pts.push({ x, y: y1 + (y2 - y1) * u + sag });
      }
      return pts;
    }

    function rebuildLiveSpanGeometry() {
      chainSpans.length = 0;
      const wp0 = moorings.westPitons[0] || { x: 0.132 * width, y: 0.135 * height };
      const wp1 = moorings.westPitons[1] || { x: 0.134 * width, y: 0.168 * height };
      const ep0 = moorings.eastPitons[0] || { x: 0.868 * width, y: 0.145 * height };
      const ep1 = moorings.eastPitons[1] || { x: 0.866 * width, y: 0.178 * height };
      chainSpans.push({ id: 'upper_crown_chain', pts: sampleCatenaryPts(wp0.x, wp0.y, ep0.x, ep0.y, 0, height * 0.082) });
      chainSpans.push({ id: 'main_anchor_chain', pts: sampleCatenaryPts(wp1.x, wp1.y, ep1.x, ep1.y, 0, height * 0.092) });
      chainSpans.push({ id: 'west_stay_chain', pts: [{ x: wp0.x, y: wp0.y - height * 0.028 }, { x: hooks[3].x, y: hooks[3].y }] });
      chainSpans.push({ id: 'east_stay_chain', pts: [{ x: ep0.x, y: ep0.y - height * 0.028 }, { x: hooks[11].x, y: hooks[11].y }] });

      woodenTies.length = 0;
      const swayPhase = reducedMotion ? 0 : Math.sin(timeSec * 2.1) * (windKnots / 32) * 0.08;
      for (let i = 0; i < WOODEN_TIE_COUNT; i++) {
        const u = i / (WOODEN_TIE_COUNT - 1);
        const nx = 0.138 + u * (0.862 - 0.138);
        const wDist = Math.abs(nx - walkerNormX);
        const footDip = wDist < 0.035 ? (1 - wDist / 0.035) * 3.8 : 0;
        const y = tierBaseY(1, nx) + hookDeflectionAtNormX(nx, 1) + footDip;
        const shockTilt = shockTrauma * Math.sin(i * 1.4 + timeSec * 15) * 0.42;
        woodenTies.push({
          tieIndex: i,
          normX: nx,
          x: nx * width,
          y,
          tiltRad: swayPhase * Math.sin(u * Math.PI) + shockTilt
        });
      }

      hempStrands.length = 0;
      const wb = moorings.westBollards;
      const eb = moorings.eastBollards;
      if (wb.length >= 3 && eb.length >= 3) {
        hempStrands.push({ id: 'catwalk_bearer_strand', pts: sampleCatenaryPts(wb[0].x, wb[0].y, eb[0].x, eb[0].y, 1, height * 0.104) });
        hempStrands.push({ id: 'mid_belly_hemp', pts: sampleCatenaryPts(wb[1].x, wb[1].y, eb[1].x, eb[1].y, 2, height * 0.132) });
        hempStrands.push({ id: 'deep_spider_arc', pts: sampleCatenaryPts(wb[2].x, wb[2].y, eb[2].x, eb[2].y, 2, height * 0.148) });
        const hubX = 0.50 * width + (hooks[6].x - hooks[6].baseX + hooks[7].x - hooks[7].baseX) * 0.5;
        const hubY = tierBaseY(1, 0.50) + hookDeflectionAtNormX(0.50, 1) + height * 0.018;
        const radialTargets = [
          wb[0], wb[2], eb[0], eb[2],
          hooks[0], hooks[3], hooks[4], hooks[9], hooks[10], hooks[13]
        ];
        for (let r = 0; r < radialTargets.length; r++) {
          const tgt = radialTargets[r];
          const mx = (hubX + tgt.x) * 0.5;
          const my = (hubY + tgt.y) * 0.5 + height * 0.012;
          hempStrands.push({ id: 'radial_spoke_' + r, pts: [{ x: hubX, y: hubY }, { x: mx, y: my }, { x: tgt.x, y: tgt.y }] });
        }
        const ringPairs = [[0, 1], [3, 4], [6, 7], [8, 9], [10, 12]];
        for (let p = 0; p < ringPairs.length; p++) {
          const a = hooks[ringPairs[p][0]];
          const b = hooks[ringPairs[p][1]];
          hempStrands.push({ id: 'web_chord_' + p, pts: [{ x: a.x, y: a.y }, { x: (a.x + b.x) * 0.5, y: (a.y + b.y) * 0.5 + 5 }, { x: b.x, y: b.y }] });
        }
      }
    }

    function resize(newWidth, newHeight, newDpr = 1) {
      width = Math.max(240, Number(newWidth) || 1280);
      height = Math.max(240, Number(newHeight) || 800);
      dpr = Math.max(1, Number(newDpr) || 1);
      rebuildStaticCrests();
      const hScale = height / 800;
      for (let i = 0; i < hooks.length; i++) {
        const h = hooks[i];
        const prevSag = h.localSagPx || 5;
        h.baseX = h.normX * width;
        h.baseY = tierBaseY(h.tier, h.normX);
        h.targetSagPx = Math.max(4 * hScale, h.targetSagPx);
        h.equilY = h.baseY + h.targetSagPx;
        h.x = h.baseX;
        h.y = h.baseY + (reducedMotion ? h.targetSagPx : prevSag);
      }
      rebuildLiveSpanGeometry();
      recomputeCloudsVisibility();
      recomputeMetrics();
    }

    function setHookLoads(loadsArray) {
      for (let i = 0; i < hooks.length; i++) {
        hooks[i].massKg = 0;
        hooks[i].isHung = false;
      }
      let extraMass = 0;
      if (Array.isArray(loadsArray)) {
        for (let i = 0; i < loadsArray.length; i++) {
          const item = loadsArray[i];
          if (!item) continue;
          const idx = Number(item.hookIndex);
          const active = item.isHung !== false && Number(item.massKg) > 0;
          const m = active ? Math.max(0, Number(item.massKg) || 0) : 0;
          if (Number.isInteger(idx) && idx >= 0 && idx < hooks.length) {
            hooks[idx].massKg = m;
            hooks[idx].isHung = active;
          } else if (active) {
            extraMass += m;
          }
        }
      }
      totalMassKg = extraMass;
      for (let i = 0; i < hooks.length; i++) {
        if (hooks[i].isHung) totalMassKg += hooks[i].massKg;
      }
      const hScale = height / 800;
      for (let i = 0; i < hooks.length; i++) {
        let coupledKg = 0;
        for (let j = 0; j < hooks.length; j++) {
          if (hooks[j].isHung) {
            coupledKg += hooks[j].massKg * Math.exp(-Math.abs(i - j) / 2.4);
          }
        }
        const spanMid = catenarySagProfile((hooks[i].normX - 0.132) / (0.868 - 0.132));
        const tierFlex = hooks[i].tier === 0 ? 0.72 : (hooks[i].tier === 1 ? 1.0 : 1.24);
        const prevEquil = hooks[i].equilY;
        hooks[i].targetSagPx = (4.5 + coupledKg * 0.165 * tierFlex * (0.45 + 0.55 * spanMid)) * hScale;
        hooks[i].equilY = hooks[i].baseY + hooks[i].targetSagPx;
        if (reducedMotion) {
          hooks[i].y = hooks[i].equilY;
          hooks[i].vy = 0;
        } else {
          const delta = hooks[i].equilY - prevEquil;
          hooks[i].y += delta * 0.74;
          hooks[i].vy += delta * 1.8;
        }
      }
      rebuildLiveSpanGeometry();
      recomputeMetrics();
    }

    function applyImpulse(hookIndex, dyImpulse = 14, dxImpulse = 0) {
      const idx = clamp(Math.round(Number(hookIndex) || 0), 0, hooks.length - 1);
      const dy = Number(dyImpulse) || 0;
      const dx = Number(dxImpulse) || 0;
      if (!reducedMotion) {
        for (let i = 0; i < hooks.length; i++) {
          const falloff = Math.exp(-Math.abs(i - idx) / 2.1);
          hooks[i].vy += dy * 6.5 * falloff;
          hooks[i].vx += dx * 5.0 * falloff;
          hooks[i].y += dy * 0.35 * falloff;
        }
        rebuildLiveSpanGeometry();
      }
      recomputeMetrics();
      audio.trigger('pluck', clamp(Math.hypot(dx, dy) / 20, 0.25, 1.0), meanTensionRatio);
    }

    function triggerUpwardShock(hookIndex = 6) {
      const idx = clamp(Math.round(Number(hookIndex) || 6), 0, hooks.length - 1);
      shockTrauma = 0.68;
      if (!reducedMotion) {
        for (let i = 0; i < hooks.length; i++) {
          const sign = i % 2 === 0 ? 1 : -1;
          const falloff = Math.exp(-Math.abs(i - idx) / 3.4);
          hooks[i].vy += sign * 95 * falloff;
          hooks[i].vx += -sign * 42 * falloff;
        }
        const origin = hooks[idx];
        for (let f = 0; f < 6; f++) {
          fallingFragments.push({
            x: origin.x + (f - 2.5) * 9,
            y: origin.y - 16 - f * 4,
            vx: (f - 2.5) * 22,
            vy: -35 + f * 12,
            rot: f * 0.7,
            vRot: (f % 2 === 0 ? 1 : -1) * 4.8,
            len: 14 + (f % 3) * 6,
            alpha: 0.95
          });
        }
      }
      rebuildLiveSpanGeometry();
      recomputeMetrics();
      audio.trigger('upward_collapse', 0.95, meanTensionRatio);
    }

    let autoWalkDir = 1;

    function nearestHookIndexAtX(px) {
      let bestIdx = 0;
      let bestDist = Infinity;
      for (let i = 0; i < hooks.length; i++) {
        const d = Math.abs(px - hooks[i].x);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      return bestIdx;
    }

    function stepWalker(deltaNormX) {
      let stepDelta = 0.055;
      if (deltaNormX === undefined) {
        if (walkerNormX >= 0.835) autoWalkDir = -1;
        else if (walkerNormX <= 0.165) autoWalkDir = 1;
        stepDelta = 0.055 * autoWalkDir;
      } else {
        stepDelta = Number(deltaNormX) || 0;
      }
      walkerNormX = Number(clamp(walkerNormX + stepDelta, 0.16, 0.84).toFixed(4));
      walkerTargetNormX = walkerNormX;
      woodenTieSteps += 1;
      if (!reducedMotion) {
        const nearIdx = nearestHookIndexAtX(walkerNormX * width);
        hooks[nearIdx].vy += 18;
      }
      rebuildLiveSpanGeometry();
      recomputeMetrics();
      audio.trigger('wooden_tie', walkerClingingToHemp ? 0.82 : 0.55, meanTensionRatio);
      return { walkerNormX, woodenTieSteps, walkerClingingToHemp, ankleTwistRisk };
    }

    function setWalkerTarget(normX) {
      walkerTargetNormX = Number(clamp(Number(normX) || 0.5, 0.16, 0.84).toFixed(4));
      if (reducedMotion) {
        if (Math.abs(walkerTargetNormX - walkerNormX) > 0.004) woodenTieSteps += 1;
        walkerNormX = walkerTargetNormX;
        rebuildLiveSpanGeometry();
        recomputeMetrics();
      }
    }

    function setWindKnots(knots) {
      windKnots = Number(clamp(Number(knots) || 0, 0, 32).toFixed(1));
      rebuildLiveSpanGeometry();
      recomputeMetrics();
      if (windKnots >= 18) audio.trigger('wind_harp', clamp(windKnots / 32, 0.3, 0.9), meanTensionRatio);
      return windKnots;
    }

    function serializeHook(h) {
      return {
        hookIndex: h.hookIndex,
        id: h.id,
        label: h.label,
        supportType: h.supportType,
        normX: h.normX,
        tier: h.tier,
        x: Number(h.x.toFixed(2)),
        y: Number(h.y.toFixed(2)),
        baseX: Number(h.baseX.toFixed(2)),
        baseY: Number(h.baseY.toFixed(2)),
        vx: Number(h.vx.toFixed(2)),
        vy: Number(h.vy.toFixed(2)),
        localSagPx: h.localSagPx,
        tension: h.tension
      };
    }

    function getHookPoint(hookIndex) {
      const idx = clamp(Math.round(Number(hookIndex) || 0), 0, hooks.length - 1);
      return serializeHook(hooks[idx]);
    }

    function getAllHookPoints() {
      return hooks.map(serializeHook);
    }

    function hitTestNet(px, py) {
      const x = Number(px);
      const y = Number(py);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      const HIT_R = 30;

      let bestHook = null;
      let bestHookD = HIT_R;
      for (let i = 0; i < hooks.length; i++) {
        const d = Math.hypot(x - hooks[i].x, y - hooks[i].y);
        if (d <= bestHookD) {
          bestHookD = d;
          bestHook = hooks[i];
        }
      }
      if (bestHook) {
        return {
          kind: 'hook',
          hookIndex: bestHook.hookIndex,
          label: bestHook.label,
          detail: 'Rigging node #' + bestHook.hookIndex + ' (' + bestHook.supportType.replace(/_/g, ' ') + ') — sag ' + bestHook.localSagPx.toFixed(1) + 'px.',
          x: bestHook.x,
          y: bestHook.y,
          tension: bestHook.tension
        };
      }

      for (let i = 0; i < woodenTies.length; i++) {
        const t = woodenTies[i];
        if (Math.hypot(x - t.x, y - t.y) <= HIT_R * 0.85) {
          return {
            kind: 'wooden_tie',
            hookIndex: nearestHookIndexAtX(t.x),
            label: 'Little Wooden Tie #' + (t.tieIndex + 1),
            detail: 'Step carefully between narrow timber ties; cling to hempen handrails in chasm gusts.',
            x: t.x,
            y: t.y,
            tension: meanTensionRatio
          };
        }
      }

      for (let c = 0; c < chainSpans.length; c++) {
        const pts = chainSpans[c].pts;
        for (let s = 0; s < pts.length - 1; s++) {
          if (distToSegment(x, y, pts[s].x, pts[s].y, pts[s + 1].x, pts[s + 1].y) <= HIT_R * 0.82) {
            return {
              kind: 'iron_chain',
              hookIndex: nearestHookIndexAtX(x),
              label: 'Upper Iron Anchor Chain',
              detail: 'Forged iron links pinned into twin granite crests bear heavy terrace and spit loads.',
              x,
              y,
              tension: maxStrandTension
            };
          }
        }
      }

      for (let h = 0; h < hempStrands.length; h++) {
        const pts = hempStrands[h].pts;
        for (let s = 0; s < pts.length - 1; s++) {
          if (distToSegment(x, y, pts[s].x, pts[s].y, pts[s + 1].x, pts[s + 1].y) <= HIT_R * 0.82) {
            return {
              kind: 'hempen_strand',
              hookIndex: nearestHookIndexAtX(x),
              label: 'Spider-Web Hempen Strand',
              detail: 'Braided ochre hemp woven radially across the void; lasts a finite, known span of years.',
              x,
              y,
              tension: meanTensionRatio
            };
          }
        }
      }

      if (x <= width * 0.148 || x >= width * 0.852) {
        const isWest = x < width * 0.5;
        return {
          kind: 'mountain_crest',
          hookIndex: isWest ? 0 : 13,
          label: isWest ? 'West Steep Mountain Crest' : 'East Steep Mountain Crest',
          detail: 'Sheer granite precipice anchoring Octavia’s ropes, iron chains, and wooden-tie catwalks.',
          x,
          y,
          tension: meanTensionRatio
        };
      }

      if (y >= height * 0.86) {
        return {
          kind: 'chasm_bed',
          hookIndex: 6,
          label: 'Chasm Bed (' + CHASM_DEPTH_FEET + ' ft below)',
          detail: 'Through parting abyssal clouds, the rocky canyon floor glimmers hundreds of feet beneath the net.',
          x,
          y,
          tension: meanTensionRatio
        };
      }

      return null;
    }

    function step(dtSec) {
      const dt = clamp(Number(dtSec) || 0.016, 0.001, 0.08);
      timeSec += dt;
      shockTrauma = Math.max(0, shockTrauma - dt * 0.24);

      if (reducedMotion) {
        for (let i = 0; i < hooks.length; i++) {
          hooks[i].x = hooks[i].baseX;
          hooks[i].y = hooks[i].equilY;
          hooks[i].vx = 0;
          hooks[i].vy = 0;
        }
        walkerNormX = walkerTargetNormX;
        fallingFragments.length = 0;
        rebuildLiveSpanGeometry();
        recomputeCloudsVisibility();
        recomputeMetrics();
        return;
      }

      const windRatio = windKnots / 32;
      for (let i = 0; i < hooks.length; i++) {
        const h = hooks[i];
        const gustY = Math.sin(timeSec * 1.9 + i * 0.65) * windRatio * 14;
        const gustX = Math.cos(timeSec * 1.45 + i * 0.5) * windRatio * 18 + windRatio * 4.5;
        let coupleFy = 0;
        if (i > 0) coupleFy += (hooks[i - 1].y - hooks[i - 1].equilY - (h.y - h.equilY)) * 18;
        if (i < hooks.length - 1) coupleFy += (hooks[i + 1].y - hooks[i + 1].equilY - (h.y - h.equilY)) * 18;
        const fy = (h.equilY + gustY * 0.28 - h.y) * 34 + coupleFy - h.vy * 4.6;
        const fx = (h.baseX + gustX * 0.35 - h.x) * 30 - h.vx * 5.0;
        h.vy += fy * dt;
        h.vx += fx * dt;
        h.y += h.vy * dt;
        h.x += h.vx * dt;
      }

      for (let c = 0; c < clouds.length; c++) {
        const cl = clouds[c];
        cl.normX += cl.speedRatio * (0.45 + windRatio * 1.35) * dt;
        if (cl.normX > 1.22) cl.normX = -0.22;
      }
      recomputeCloudsVisibility();

      const walkDiff = walkerTargetNormX - walkerNormX;
      if (Math.abs(walkDiff) > 0.0008) {
        const stepMove = Math.sign(walkDiff) * Math.min(Math.abs(walkDiff), dt * 0.14);
        walkerNormX = Number(clamp(walkerNormX + stepMove, 0.16, 0.84).toFixed(4));
        walkerAccumDist += Math.abs(stepMove);
        if (walkerAccumDist >= 0.018) {
          walkerAccumDist = 0;
          woodenTieSteps += 1;
          audio.trigger('wooden_tie', 0.45, meanTensionRatio);
        }
      }

      for (let f = fallingFragments.length - 1; f >= 0; f--) {
        const frag = fallingFragments[f];
        frag.vy += 390 * dt;
        frag.x += (frag.vx + windKnots * 0.9) * dt;
        frag.y += frag.vy * dt;
        frag.rot += frag.vRot * dt;
        frag.alpha -= dt * 0.34;
        if (frag.y > height * 1.04 || frag.alpha <= 0.02) fallingFragments.splice(f, 1);
      }

      rebuildLiveSpanGeometry();
      recomputeMetrics();
    }

    function drawCloudBank(ctx, cl, w, h, alphaScale) {
      const cx = cl.normX * w;
      const cy = cl.normY * h;
      const rx = cl.rxRatio * w;
      const ry = cl.ryRatio * h;
      ctx.save();
      ctx.globalAlpha = clamp(cl.alpha * alphaScale, 0.03, 0.65);
      const grad = ctx.createRadialGradient(cx, cy - ry * 0.2, ry * 0.2, cx, cy, rx * 1.15);
      grad.addColorStop(0, PALETTE.abyssMist);
      grad.addColorStop(0.55, PALETTE.cloudDrift);
      grad.addColorStop(1, 'rgba(11,16,23,0)');
      ctx.fillStyle = grad;
      for (let lobe = -1; lobe <= 1; lobe++) {
        ctx.beginPath();
        ctx.ellipse(cx + lobe * rx * 0.42, cy + Math.abs(lobe) * ry * 0.22, rx * (0.78 - Math.abs(lobe) * 0.14), ry * (1 - Math.abs(lobe) * 0.15), 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function renderChasmAndWeb(ctx, renderW, renderH, view = {}) {
      if (!ctx) return;
      const w = Math.max(240, Number(renderW) || width);
      const h = Math.max(240, Number(renderH) || height);
      if (Math.abs(w - width) > 0.5 || Math.abs(h - height) > 0.5) resize(w, h, dpr);

      ctx.save();
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#121b27');
      skyGrad.addColorStop(0.52, PALETTE.abyssVoid);
      skyGrad.addColorStop(1, PALETTE.chasmBed);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      const bedTop = h * 0.872;
      ctx.save();
      ctx.globalAlpha = chasmBedVisibility;
      ctx.fillStyle = PALETTE.chasmBed;
      ctx.beginPath();
      ctx.moveTo(w * 0.11, h);
      ctx.lineTo(w * 0.12, bedTop + 14);
      ctx.lineTo(w * 0.34, bedTop + 4);
      ctx.lineTo(w * 0.51, bedTop + 11);
      ctx.lineTo(w * 0.69, bedTop + 3);
      ctx.lineTo(w * 0.88, bedTop + 15);
      ctx.lineTo(w * 0.89, h);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = PALETTE.cloudDrift;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(w * 0.46, bedTop + 8);
      ctx.quadraticCurveTo(w * 0.53, bedTop + (h - bedTop) * 0.48, w * 0.48, h);
      ctx.stroke();
      ctx.restore();

      for (let c = 0; c < clouds.length; c++) {
        if (clouds[c].layer < 2) drawCloudBank(ctx, clouds[c], w, h, 1.0);
      }

      const drawCrest = (poly, isWest) => {
        ctx.beginPath();
        for (let i = 0; i < poly.length; i++) {
          if (i === 0) ctx.moveTo(poly[i].x, poly[i].y);
          else ctx.lineTo(poly[i].x, poly[i].y);
        }
        ctx.closePath();
        const cg = ctx.createLinearGradient(isWest ? 0 : w, 0, isWest ? w * 0.155 : w * 0.845, 0);
        cg.addColorStop(0, PALETTE.graniteShadow);
        cg.addColorStop(0.75, PALETTE.graniteCrest);
        cg.addColorStop(1, PALETTE.graniteHighlight);
        ctx.fillStyle = cg;
        ctx.fill();
        ctx.strokeStyle = PALETTE.graniteHighlight;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        for (let i = 1; i < poly.length - 1; i++) {
          if (i === 1) ctx.moveTo(poly[i].x, poly[i].y);
          else ctx.lineTo(poly[i].x, poly[i].y);
        }
        ctx.stroke();
      };
      drawCrest(westCrestPoly, true);
      drawCrest(eastCrestPoly, false);

      const ropeStroke = meanTensionRatio > 1.02 ? PALETTE.frayCrimson : PALETTE.hempTaupe;
      for (let s = 0; s < hempStrands.length; s++) {
        const pts = hempStrands[s].pts;
        ctx.strokeStyle = s < 3 ? PALETTE.hempOchre : ropeStroke;
        ctx.lineWidth = s === 0 ? 2.2 : (s < 3 ? 1.65 : 1.05);
        ctx.globalAlpha = s < 3 ? 0.92 : 0.62;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let p = 1; p < pts.length; p++) ctx.lineTo(pts[p].x, pts[p].y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      for (let c = 0; c < chainSpans.length; c++) {
        const pts = chainSpans[c].pts;
        ctx.strokeStyle = PALETTE.chainIron;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let p = 1; p < pts.length; p++) ctx.lineTo(pts[p].x, pts[p].y);
        ctx.stroke();
        ctx.strokeStyle = PALETTE.graniteHighlight;
        ctx.lineWidth = 1.1;
        for (let p = 0; p < pts.length - 1; p++) {
          const mx = (pts[p].x + pts[p + 1].x) * 0.5;
          const my = (pts[p].y + pts[p + 1].y) * 0.5;
          const ang = Math.atan2(pts[p + 1].y - pts[p].y, pts[p + 1].x - pts[p].x);
          ctx.save();
          ctx.translate(mx, my);
          ctx.rotate(ang);
          ctx.strokeRect(-4, -2, 8, 4);
          ctx.restore();
        }
      }

      const allPitons = moorings.westPitons.concat(moorings.eastPitons);
      ctx.fillStyle = PALETTE.chainIron;
      ctx.strokeStyle = PALETTE.graniteHighlight;
      for (let i = 0; i < allPitons.length; i++) {
        ctx.beginPath();
        ctx.arc(allPitons[i].x, allPitons[i].y, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      const allBollards = moorings.westBollards.concat(moorings.eastBollards);
      ctx.fillStyle = PALETTE.hempOchre;
      for (let i = 0; i < allBollards.length; i++) {
        ctx.fillRect(allBollards[i].x - 3.5, allBollards[i].y - 5, 7, 10);
      }

      if (woodenTies.length > 1) {
        ctx.strokeStyle = PALETTE.hempOchre;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        for (let i = 0; i < woodenTies.length; i++) {
          const rx = woodenTies[i].x;
          const ry = woodenTies[i].y - 13;
          if (i === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.stroke();
        for (let i = 0; i < woodenTies.length; i++) {
          const t = woodenTies[i];
          if (i % 4 === 0) {
            ctx.strokeStyle = PALETTE.hempTaupe;
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(t.x, t.y);
            ctx.lineTo(t.x, t.y - 13);
            ctx.stroke();
          }
          ctx.save();
          ctx.translate(t.x, t.y);
          ctx.rotate(t.tiltRad);
          ctx.fillStyle = i % 2 === 0 ? PALETTE.hempOchre : PALETTE.hempTaupe;
          ctx.fillRect(-5.2, -1.8, 10.4, 3.6);
          ctx.restore();
        }
      }

      const wx = walkerNormX * w;
      const wy = tierBaseY(1, walkerNormX) + hookDeflectionAtNormX(walkerNormX, 1);
      ctx.save();
      ctx.translate(wx, wy);
      ctx.rotate(walkerClingingToHemp ? 0.14 : 0.03);
      const glow = ctx.createRadialGradient(4, -9, 1, 4, -9, 18);
      glow.addColorStop(0, 'rgba(242,184,75,0.55)');
      glow.addColorStop(1, 'rgba(242,184,75,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(4, -9, 18, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = PALETTE.abyssMist;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-2, 0); ctx.lineTo(0, -10); ctx.lineTo(2.5, 0);
      ctx.moveTo(0, -10); ctx.lineTo(0, -17);
      if (walkerClingingToHemp) {
        ctx.moveTo(0, -14); ctx.lineTo(-6, -13);
        ctx.moveTo(0, -14); ctx.lineTo(6, -13);
      } else {
        ctx.moveTo(0, -14); ctx.lineTo(4, -9);
      }
      ctx.stroke();
      ctx.fillStyle = PALETTE.lanternAmber;
      ctx.beginPath(); ctx.arc(0, -20, 2.7, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      const activeHookIdx = view && Number.isInteger(view.selectedHookIndex) ? view.selectedHookIndex : -1;
      for (let i = 0; i < hooks.length; i++) {
        const hk = hooks[i];
        ctx.fillStyle = hk.tension > 1.04 ? PALETTE.frayCrimson : (hk.tier === 0 ? PALETTE.graniteHighlight : PALETTE.hempOchre);
        ctx.strokeStyle = PALETTE.abyssVoid;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(hk.x, hk.y, hk.isHung ? 4.2 : 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (i === activeHookIdx) {
          ctx.strokeStyle = PALETTE.lanternAmber;
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(hk.x, hk.y, 8, 0, Math.PI * 2); ctx.stroke();
        }
      }

      for (let f = 0; f < fallingFragments.length; f++) {
        const frag = fallingFragments[f];
        ctx.save();
        ctx.globalAlpha = clamp(frag.alpha, 0, 1);
        ctx.translate(frag.x, frag.y);
        ctx.rotate(frag.rot);
        ctx.strokeStyle = PALETTE.frayCrimson;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(-frag.len * 0.5, 0);
        ctx.lineTo(frag.len * 0.5, 0);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }

    function renderForegroundMist(ctx, renderW, renderH) {
      if (!ctx) return;
      const w = Math.max(240, Number(renderW) || width);
      const h = Math.max(240, Number(renderH) || height);
      ctx.save();
      for (let c = 0; c < clouds.length; c++) {
        if (clouds[c].layer === 2) drawCloudBank(ctx, clouds[c], w, h, 0.85);
      }
      ctx.restore();
    }

    function toggleAudio(forceBool) {
      const nextMuted = forceBool !== undefined ? !Boolean(forceBool) : !audio.isMuted();
      audio.setMuted(nextMuted, windKnots, meanTensionRatio);
      return !audio.isMuted();
    }

    function setMuted(flag) {
      return audio.setMuted(Boolean(flag), windKnots, meanTensionRatio);
    }

    function isMuted() {
      return audio.isMuted();
    }

    function unlockAudio() {
      audio.unlock();
    }

    function triggerAcousticEvent(kind, intensity = 0.6) {
      return audio.trigger(kind || 'pluck', intensity, meanTensionRatio);
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      if (reducedMotion) step(0.016);
      return reducedMotion;
    }

    function reset() {
      timeSec = 0;
      windKnots = 9;
      totalMassKg = 0;
      shockTrauma = 0;
      walkerNormX = 0.26;
      walkerTargetNormX = 0.26;
      walkerAccumDist = 0;
      woodenTieSteps = 0;
      autoWalkDir = 1;
      fallingFragments.length = 0;
      for (let i = 0; i < hooks.length; i++) {
        hooks[i].massKg = 0;
        hooks[i].isHung = false;
        hooks[i].vx = 0;
        hooks[i].vy = 0;
        hooks[i].targetSagPx = 4.5 * (height / 800);
        hooks[i].equilY = hooks[i].baseY + hooks[i].targetSagPx;
        hooks[i].x = hooks[i].baseX;
        hooks[i].y = hooks[i].equilY;
      }
      rebuildLiveSpanGeometry();
      recomputeCloudsVisibility();
      recomputeMetrics();
      return getState();
    }

    function getState() {
      return {
        hookCount: 14,
        woodenTieCount: WOODEN_TIE_COUNT,
        chainSpanCount: CHAIN_SPAN_COUNT,
        hempStrandCount: HEMP_STRAND_COUNT,
        chasmDepthFeet: CHASM_DEPTH_FEET,
        chasmBedVisibility,
        cloudCount: CLOUD_COUNT,
        windKnots,
        meanTensionRatio,
        maxStrandTension,
        meanSagPx,
        ankleTwistRisk,
        walkerNormX,
        walkerClingingToHemp,
        woodenTieSteps,
        muted: audio.isMuted(),
        netIntact: true
      };
    }

    resize(width, height, dpr);

    return {
      resize,
      setHookLoads,
      applyImpulse,
      triggerUpwardShock,
      stepWalker,
      setWalkerTarget,
      setWindKnots,
      getHookPoint,
      getAllHookPoints,
      hitTestNet,
      step,
      renderChasmAndWeb,
      renderForegroundMist,
      toggleAudio,
      setMuted,
      isMuted,
      unlockAudio,
      triggerAcousticEvent,
      getState,
      setReducedMotion,
      reset
    };
  }

  const OctaviaCatenaryWeb = Object.freeze({
    PALETTE,
    HOOK_SPEC,
    createCatenaryWeb
  });

  globalThis.OctaviaCatenaryWeb = OctaviaCatenaryWeb;
  if (typeof window !== 'undefined') {
    window.OctaviaCatenaryWeb = OctaviaCatenaryWeb;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = OctaviaCatenaryWeb;
  }
})();
