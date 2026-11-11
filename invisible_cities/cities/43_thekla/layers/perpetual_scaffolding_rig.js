/*
 * City 43: Thekla — Layer 1: Perpetual Scaffolding Rig & Workyard Foley
 * Self-contained Canvas2D + WebAudio architectural elevation module.
 * Exposes globalThis.TheklaScaffoldingRig for inline standalone composition.
 */
(function () {
  "use strict";

  const PALETTE = Object.freeze({
    dayDustSky: "#d8c7a8",
    ochreHaze: "#b99867",
    pineTimber: "#8c6239",
    weatheredPlank: "#5c4228",
    sackclothBurlap: "#a88f68",
    ironArmature: "#3c4652",
    hempRope: "#c5aa78",
    sunsetCopper: "#c95f36",
    twilightPlum: "#2a233d",
    nightAbyss: "#080d1a",
    blueprintIndigo: "#10203b",
    starCyan: "#8ce6ff",
    plumbSilver: "#d9f3ff",
    fractureRust: "#d94a38"
  });

  const CANONICAL_STONES = Object.freeze([
    Object.freeze({
      id: "plank_fences",
      label: "Plank Fences at the Arrival Palisade",
      constellationId: "velum_saccinum"
    }),
    Object.freeze({
      id: "sackcloth_screens",
      label: "Billowing Sackcloth Screens Veiling Inner Bays",
      constellationId: "velum_saccinum"
    }),
    Object.freeze({
      id: "timber_scaffoldings",
      label: "Lashed Multi-Tier Timber Scaffoldings",
      constellationId: "scala_coeli"
    }),
    Object.freeze({
      id: "metal_armatures",
      label: "Riveted Iron & Steel Lattice Armatures",
      constellationId: "armatura_ferrea"
    }),
    Object.freeze({
      id: "rope_catwalks",
      label: "Wooden Catwalks Hanging from Hemp Ropes",
      constellationId: "ponticulus_funis"
    }),
    Object.freeze({
      id: "sawhorse_catwalks",
      label: "Plank Catwalks Supported by Sawhorses",
      constellationId: "cantherius_trestle"
    }),
    Object.freeze({
      id: "ladders_and_trestles",
      label: "Inclined Riggers' Ladders & Carpenter Trestles",
      constellationId: "cantherius_trestle"
    }),
    Object.freeze({
      id: "cranes_hoisting_cranes",
      label: "Derrick Cranes Hoisting Higher Cranes",
      constellationId: "grus_maior"
    }),
    Object.freeze({
      id: "beams_embracing_beams",
      label: "Interlocking Beams Embracing Beams",
      constellationId: "trabes_geminae"
    })
  ]);

  const BASE_RIG_ANCHORS = Object.freeze([
    { id: "rig_cranes_crown", stoneId: "cranes_hoisting_cranes", label: "Derrick Cranes Hoisting Higher Cranes", constellationId: "grus_maior", nx: 0.50, ny: 0.42, tier: 4, kind: "derrick_crane" },
    { id: "rig_embracing_beams", stoneId: "beams_embracing_beams", label: "Interlocking Beams Embracing Beams", constellationId: "trabes_geminae", nx: 0.33, ny: 0.49, tier: 3, kind: "embracing_beam" },
    { id: "rig_metal_armatures", stoneId: "metal_armatures", label: "Riveted Iron & Steel Lattice Armatures", constellationId: "armatura_ferrea", nx: 0.68, ny: 0.50, tier: 3, kind: "iron_armature" },
    { id: "rig_rope_catwalks", stoneId: "rope_catwalks", label: "Wooden Catwalks Hanging from Hemp Ropes", constellationId: "ponticulus_funis", nx: 0.48, ny: 0.57, tier: 3, kind: "rope_catwalk" },
    { id: "rig_timber_scaffoldings", stoneId: "timber_scaffoldings", label: "Lashed Multi-Tier Timber Scaffoldings", constellationId: "scala_coeli", nx: 0.21, ny: 0.58, tier: 2, kind: "timber_scaffolding" },
    { id: "rig_sackcloth_screens", stoneId: "sackcloth_screens", label: "Billowing Sackcloth Screens Veiling Inner Bays", constellationId: "velum_saccinum", nx: 0.54, ny: 0.67, tier: 2, kind: "sackcloth_screen" },
    { id: "rig_ladders_trestles", stoneId: "ladders_and_trestles", label: "Inclined Riggers' Ladders & Carpenter Trestles", constellationId: "cantherius_trestle", nx: 0.79, ny: 0.66, tier: 2, kind: "ladder_trestle" },
    { id: "rig_sawhorse_catwalks", stoneId: "sawhorse_catwalks", label: "Plank Catwalks Supported by Sawhorses", constellationId: "cantherius_trestle", nx: 0.35, ny: 0.76, tier: 1, kind: "sawhorse_catwalk" },
    { id: "rig_plank_fences", stoneId: "plank_fences", label: "Plank Fences at the Arrival Palisade", constellationId: "velum_saccinum", nx: 0.63, ny: 0.84, tier: 0, kind: "plank_fence" }
  ]);

  const HOISTED_CRANE_SLOTS = Object.freeze([
    { id: "rig_hoisted_crane_8", label: "Hoisted Counter-Jib Crane VIII", nx: 0.39, ny: 0.40, tier: 5, parentNx: 0.34, parentNy: 0.47, armDir: 1 },
    { id: "rig_hoisted_crane_9", label: "Hoisted Sheerlegs Derrick IX", nx: 0.61, ny: 0.39, tier: 5, parentNx: 0.66, parentNy: 0.47, armDir: -1 },
    { id: "rig_hoisted_crane_10", label: "Hoisted Cantilever Boom X", nx: 0.26, ny: 0.43, tier: 5, parentNx: 0.21, parentNy: 0.51, armDir: 1 },
    { id: "rig_hoisted_crane_11", label: "Hoisted Lattice Gin-Pole XI", nx: 0.74, ny: 0.42, tier: 5, parentNx: 0.79, parentNy: 0.50, armDir: -1 },
    { id: "rig_hoisted_crane_12", label: "Hoisted Crown Mast Crane XII", nx: 0.45, ny: 0.38, tier: 6, parentNx: 0.39, parentNy: 0.40, armDir: 1 },
    { id: "rig_hoisted_crane_13", label: "Hoisted Skyward Trammel XIII", nx: 0.56, ny: 0.38, tier: 6, parentNx: 0.61, parentNy: 0.39, armDir: -1 },
    { id: "rig_hoisted_crane_14", label: "Hoisted Bastion Jib XIV", nx: 0.16, ny: 0.45, tier: 5, parentNx: 0.21, parentNy: 0.52, armDir: 1 }
  ]);

  const BASE_CRANE_TOWERS = Object.freeze([
    { baseNx: 0.14, baseNy: 0.56, tipNx: 0.21, tipNy: 0.48, childScale: 0.72, material: "timber" },
    { baseNx: 0.27, baseNy: 0.53, tipNx: 0.34, tipNy: 0.45, childScale: 0.84, material: "iron" },
    { baseNx: 0.38, baseNy: 0.51, tipNx: 0.45, tipNy: 0.43, childScale: 0.88, material: "timber" },
    { baseNx: 0.50, baseNy: 0.50, tipNx: 0.50, tipNy: 0.41, childScale: 1.00, material: "iron" },
    { baseNx: 0.62, baseNy: 0.51, tipNx: 0.57, tipNy: 0.43, childScale: 0.86, material: "timber" },
    { baseNx: 0.73, baseNy: 0.53, tipNx: 0.66, tipNy: 0.45, childScale: 0.82, material: "iron" },
    { baseNx: 0.86, baseNy: 0.56, tipNx: 0.79, tipNy: 0.48, childScale: 0.74, material: "iron" }
  ]);

  function thkRigClamp(val, minVal, maxVal) {
    return val < minVal ? minVal : val > maxVal ? maxVal : val;
  }

  function thkRigLerp(a, b, t) {
    return a + (b - a) * t;
  }

  function thkRigHexToRgba(hex, alpha) {
    const clean = String(hex || "#8c6239").replace("#", "");
    const num = parseInt(clean, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return "rgba(" + r + "," + g + "," + b + "," + thkRigClamp(alpha, 0, 1).toFixed(3) + ")";
  }

  function createScaffoldingRig(opts) {
    const cfg = opts || {};
    let reducedMotion = Boolean(cfg.reducedMotion);
    let muted = Boolean(cfg.muted);
    let audioCtx = null;
    let audioUnlocked = false;
    let noiseBuf = null;

    const onCraneHoisted = typeof cfg.onCraneHoisted === "function" ? cfg.onCraneHoisted : null;
    const onSackclothParted = typeof cfg.onSackclothParted === "function" ? cfg.onSackclothParted : null;
    const onAnchorSelected = typeof cfg.onAnchorSelected === "function" ? cfg.onAnchorSelected : null;

    const MAX_CRANES = 14;
    let cranesCount = 7;
    let hoistedCranesAdded = 0;
    let hoistLiftProgress = [];
    let sackclothPartedRatio = 0;
    let curtainRipple = 0;
    let plankLooseness = 0;
    let ropeSlack = 0.06;
    let pulleyAngle = 0;
    let pulleySpeed = 1.8;
    let swayPhase = 0;
    let malletClock = 0;
    let malletPulse = 0;
    let jointShudderPhase = 0;
    let lanternGlow = 0;
    let selectedAnchorId = null;
    let lastWidth = 1280;
    let lastHeight = 800;

    const siftMotes = [];
    for (let i = 0; i < 28; i += 1) {
      siftMotes.push({
        nx: 0.16 + ((i * 0.0713) % 0.68),
        ny: 0.44 + ((i * 0.0537) % 0.42),
        vy: 0.045 + (i % 5) * 0.014,
        size: 1.2 + (i % 3) * 0.75,
        drift: (i % 2 === 0 ? 1 : -1) * (0.006 + (i % 4) * 0.002)
      });
    }

    function thkRigEnsureNoise(ctx) {
      if (noiseBuf && noiseBuf.sampleRate === ctx.sampleRate) {
        return noiseBuf;
      }
      const len = Math.max(1024, Math.floor(ctx.sampleRate * 0.45));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const ch = buf.getChannelData(0);
      let seed = 43019;
      for (let i = 0; i < len; i += 1) {
        seed = (seed * 16807) % 2147483647;
        ch[i] = ((seed / 2147483647) * 2 - 1) * 0.85;
      }
      noiseBuf = buf;
      return buf;
    }

    function unlockAudio() {
      try {
        const Ctor = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!Ctor) {
          return false;
        }
        if (!audioCtx) {
          audioCtx = new Ctor();
        }
        if (audioCtx.state === "suspended" && typeof audioCtx.resume === "function") {
          audioCtx.resume().catch(function () {});
        }
        audioUnlocked = audioCtx.state !== "closed";
        return audioUnlocked;
      } catch (_err) {
        audioUnlocked = false;
        return false;
      }
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      return muted;
    }

    function toggleMute() {
      muted = !muted;
      return muted;
    }

    function isMuted() {
      return muted;
    }

    function getAudioContext() {
      return audioCtx;
    }

    function thkRigCanSound() {
      return Boolean(audioUnlocked && !muted && audioCtx && audioCtx.state !== "closed");
    }

    function playHammerAndPulley() {
      if (!thkRigCanSound()) return false;
      try {
        const now = audioCtx.currentTime;
        [0, 0.13].forEach(function (offset, idx) {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(idx === 0 ? 218 : 192, now + offset);
          osc.frequency.exponentialRampToValueAtTime(112, now + offset + 0.075);
          gain.gain.setValueAtTime(0.0001, now + offset);
          gain.gain.exponentialRampToValueAtTime(idx === 0 ? 0.11 : 0.065, now + offset + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.085);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.09);
        });
        const creak = audioCtx.createOscillator();
        const creakGain = audioCtx.createGain();
        creak.type = "sine";
        creak.frequency.setValueAtTime(530, now + 0.05);
        creak.frequency.linearRampToValueAtTime(685, now + 0.24);
        creakGain.gain.setValueAtTime(0.0001, now + 0.05);
        creakGain.gain.linearRampToValueAtTime(0.028, now + 0.12);
        creakGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.27);
        creak.connect(creakGain);
        creakGain.connect(audioCtx.destination);
        creak.start(now + 0.05);
        creak.stop(now + 0.28);
        return true;
      } catch (_err) {
        return false;
      }
    }

    function playCraneHoist() {
      if (!thkRigCanSound()) return false;
      try {
        const now = audioCtx.currentTime;
        for (let k = 0; k < 4; k += 1) {
          const tick = audioCtx.createOscillator();
          const tg = audioCtx.createGain();
          const t0 = now + k * 0.055;
          tick.type = "square";
          tick.frequency.setValueAtTime(760 + k * 70, t0);
          tg.gain.setValueAtTime(0.032, t0);
          tg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.03);
          tick.connect(tg);
          tg.connect(audioCtx.destination);
          tick.start(t0);
          tick.stop(t0 + 0.035);
        }
        const cable = audioCtx.createOscillator();
        const cg = audioCtx.createGain();
        cable.type = "sawtooth";
        const filter = audioCtx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(420, now);
        cable.frequency.setValueAtTime(196, now + 0.04);
        cable.frequency.exponentialRampToValueAtTime(293.66, now + 0.38);
        cg.gain.setValueAtTime(0.0001, now + 0.04);
        cg.gain.linearRampToValueAtTime(0.055, now + 0.14);
        cg.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
        cable.connect(filter);
        filter.connect(cg);
        cg.connect(audioCtx.destination);
        cable.start(now + 0.04);
        cable.stop(now + 0.44);
        return true;
      } catch (_err) {
        return false;
      }
    }

    function playSackclothRustle() {
      if (!thkRigCanSound()) return false;
      try {
        const now = audioCtx.currentTime;
        const src = audioCtx.createBufferSource();
        src.buffer = thkRigEnsureNoise(audioCtx);
        const filt = audioCtx.createBiquadFilter();
        filt.type = "bandpass";
        filt.Q.setValueAtTime(1.8, now);
        filt.frequency.setValueAtTime(360, now);
        filt.frequency.linearRampToValueAtTime(740, now + 0.13);
        filt.frequency.linearRampToValueAtTime(320, now + 0.30);
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.075, now + 0.07);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.31);
        src.connect(filt);
        filt.connect(gain);
        gain.connect(audioCtx.destination);
        src.start(now);
        src.stop(now + 0.32);
        return true;
      } catch (_err) {
        return false;
      }
    }

    function playStructuralGroan(intensity) {
      if (!thkRigCanSound()) return false;
      try {
        const lvl = thkRigClamp(Number(intensity) || 0.6, 0.15, 1);
        const now = audioCtx.currentTime;
        [68, 71.5].forEach(function (hz) {
          const osc = audioCtx.createOscillator();
          const lp = audioCtx.createBiquadFilter();
          const g = audioCtx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(hz, now);
          osc.frequency.exponentialRampToValueAtTime(hz * 0.71, now + 0.52);
          lp.type = "lowpass";
          lp.frequency.setValueAtTime(175 + lvl * 90, now);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.linearRampToValueAtTime(0.065 * lvl, now + 0.08);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.56);
          osc.connect(lp);
          lp.connect(g);
          g.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.58);
        });
        const rattle = audioCtx.createBufferSource();
        rattle.buffer = thkRigEnsureNoise(audioCtx);
        const hp = audioCtx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.setValueAtTime(1450, now + 0.06);
        const rg = audioCtx.createGain();
        rg.gain.setValueAtTime(0.04 * lvl, now + 0.06);
        rg.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
        rattle.connect(hp);
        hp.connect(rg);
        rg.connect(audioCtx.destination);
        rattle.start(now + 0.06);
        rattle.stop(now + 0.25);
        return true;
      } catch (_err) {
        return false;
      }
    }

    function getRigAnchors(width, height) {
      const w = Number(width) > 0 ? Number(width) : lastWidth;
      const h = Number(height) > 0 ? Number(height) : lastHeight;
      lastWidth = w;
      lastHeight = h;
      const looseVal = Math.round(plankLooseness * 10000) / 10000;
      const out = [];
      for (let i = 0; i < BASE_RIG_ANCHORS.length; i += 1) {
        const b = BASE_RIG_ANCHORS[i];
        out.push({
          id: b.id,
          stoneId: b.stoneId,
          label: b.label,
          constellationId: b.constellationId,
          nx: b.nx,
          ny: b.ny,
          x: Math.round(b.nx * w * 100) / 100,
          y: Math.round(b.ny * h * 100) / 100,
          tier: b.tier,
          kind: b.kind,
          isHoistedCrane: false,
          looseness: looseVal
        });
      }
      for (let j = 0; j < hoistedCranesAdded; j += 1) {
        const s = HOISTED_CRANE_SLOTS[j];
        out.push({
          id: s.id,
          stoneId: "cranes_hoisting_cranes",
          label: s.label,
          constellationId: "grus_maior",
          nx: s.nx,
          ny: s.ny,
          x: Math.round(s.nx * w * 100) / 100,
          y: Math.round(s.ny * h * 100) / 100,
          tier: s.tier,
          kind: "hoisted_crane",
          isHoistedCrane: true,
          looseness: looseVal
        });
      }
      return out;
    }

    function getState() {
      return {
        cranesCount: cranesCount,
        hoistedCranesAdded: hoistedCranesAdded,
        maxCranes: MAX_CRANES,
        sackclothPartedRatio: Math.round(sackclothPartedRatio * 10000) / 10000,
        sackclothParted: sackclothPartedRatio > 0.15,
        finishedFacadeVisible: false,
        scaffoldingsRemoved: false,
        plankLooseness: Math.round(plankLooseness * 10000) / 10000,
        selectedAnchorId: selectedAnchorId,
        anchorCount: 9 + hoistedCranesAdded,
        muted: muted,
        audioUnlocked: audioUnlocked,
        reducedMotion: reducedMotion
      };
    }

    function hoistNewCrane() {
      if (hoistedCranesAdded < HOISTED_CRANE_SLOTS.length) {
        hoistedCranesAdded += 1;
        cranesCount = 7 + hoistedCranesAdded;
        hoistLiftProgress.push(reducedMotion ? 1 : 0.22);
        playCraneHoist();
        const anchors = getRigAnchors(lastWidth, lastHeight);
        const added = anchors[anchors.length - 1];
        if (onCraneHoisted) onCraneHoisted(added, getState());
        return { hoisted: true, cranesCount: cranesCount, hoistedCranesAdded: hoistedCranesAdded, maxCranes: MAX_CRANES, anchor: added };
      }
      playCraneHoist();
      const anchors = getRigAnchors(lastWidth, lastHeight);
      return { hoisted: false, cranesCount: cranesCount, hoistedCranesAdded: hoistedCranesAdded, maxCranes: MAX_CRANES, anchor: anchors[anchors.length - 1] };
    }

    function partSackclothScreen(ratioOrToggle) {
      if (typeof ratioOrToggle === "number" && Number.isFinite(ratioOrToggle)) {
        sackclothPartedRatio = thkRigClamp(ratioOrToggle, 0, 1);
      } else if (typeof ratioOrToggle === "boolean") {
        sackclothPartedRatio = ratioOrToggle ? 1 : 0;
      } else {
        sackclothPartedRatio = sackclothPartedRatio < 0.5 ? 1 : 0;
      }
      curtainRipple = reducedMotion ? 0 : 1;
      playSackclothRustle();
      const snap = getState();
      if (onSackclothParted) onSackclothParted(snap);
      return snap;
    }

    function hitTest(normX, normY, width, height) {
      const w = Number(width) > 0 ? Number(width) : lastWidth;
      const h = Number(height) > 0 ? Number(height) : lastHeight;
      if (!Number.isFinite(normX) || !Number.isFinite(normY)) return null;
      const isPx = normX > 1.05 || normY > 1.05;
      const px = isPx ? normX : normX * w;
      const py = isPx ? normY : normY * h;
      const anchors = getRigAnchors(w, h);
      const maxDist = Math.max(38, Math.min(w, h) * 0.075);
      let best = null;
      let bestD = maxDist;
      for (let i = 0; i < anchors.length; i += 1) {
        const a = anchors[i];
        const d = Math.hypot(px - a.x, py - a.y);
        if (d <= bestD) {
          bestD = d;
          best = a;
        }
      }
      return best;
    }

    function selectAnchor(id) {
      if (!id) {
        selectedAnchorId = null;
        if (onAnchorSelected) onAnchorSelected(null, getState());
        return null;
      }
      const anchors = getRigAnchors(lastWidth, lastHeight);
      let found = null;
      for (let i = 0; i < anchors.length; i += 1) {
        if (anchors[i].id === id) { found = anchors[i]; break; }
      }
      if (!found) {
        for (let i = 0; i < anchors.length; i += 1) {
          if (anchors[i].stoneId === id || anchors[i].constellationId === id) { found = anchors[i]; break; }
        }
      }
      selectedAnchorId = found ? found.id : null;
      if (onAnchorSelected) onAnchorSelected(found, getState());
      return found;
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      return reducedMotion;
    }

    function reset() {
      cranesCount = 7;
      hoistedCranesAdded = 0;
      hoistLiftProgress = [];
      sackclothPartedRatio = 0;
      curtainRipple = 0;
      plankLooseness = 0;
      ropeSlack = 0.06;
      pulleySpeed = 1.8;
      malletPulse = 0;
      lanternGlow = 0;
      selectedAnchorId = null;
      return getState();
    }

    function step(dtSec, skyState) {
      const sky = skyState || {};
      const isConstructing = sky.isConstructing !== undefined ? Boolean(sky.isConstructing) : true;
      const destructionRate = Number(sky.destructionRate) || 0;
      const destructionProgress = Number(sky.destructionProgress) || 0;
      const solarPhase = sky.solarPhase || "day";
      const effReduced = Boolean(reducedMotion || sky.reducedMotion);
      const dt = thkRigClamp(Number(dtSec) || 0, 0, 0.25);

      if (solarPhase === "sunset" || solarPhase === "night") {
        pulleySpeed = effReduced ? 0 : pulleySpeed * Math.max(0, 1 - dt * 4.5);
        malletPulse = 0;
        plankLooseness = destructionProgress > 0 ? thkRigClamp(destructionProgress, 0, 1) : Math.max(0, plankLooseness - dt * 0.45);
        ropeSlack = thkRigLerp(0.08, 0.42, plankLooseness);
        const targetGlow = solarPhase === "night" ? 1 : 0.68;
        lanternGlow = (effReduced || dt === 0) ? targetGlow : thkRigLerp(lanternGlow, targetGlow, Math.min(1, dt * 3.6));
      } else if (!isConstructing && (destructionRate > 0 || destructionProgress > 0)) {
        pulleySpeed = 0;
        malletPulse = 0;
        lanternGlow = Math.max(0, lanternGlow - dt * 3);
        plankLooseness = destructionProgress > 0 ? thkRigClamp(destructionProgress, 0, 1) : thkRigClamp(plankLooseness + destructionRate * dt, 0, 1);
        ropeSlack = thkRigLerp(0.20, 0.92, plankLooseness);
        if (!effReduced) {
          jointShudderPhase += dt * 22;
          for (let i = 0; i < siftMotes.length; i += 1) {
            siftMotes[i].ny += siftMotes[i].vy * (0.45 + plankLooseness * 1.4) * dt;
            siftMotes[i].nx += siftMotes[i].drift * dt;
            if (siftMotes[i].ny > 0.92) siftMotes[i].ny = 0.43 + (i % 6) * 0.03;
          }
        }
      } else {
        pulleySpeed = effReduced ? 0 : thkRigLerp(pulleySpeed, 2.2, Math.min(1, dt * 4));
        const targetRepair = thkRigClamp(destructionProgress * 0.65, 0, 1);
        plankLooseness = plankLooseness > targetRepair ? Math.max(targetRepair, plankLooseness - Math.max(0.018, dt * 0.6)) : targetRepair;
        ropeSlack = thkRigLerp(0.05, 0.34, plankLooseness);
        lanternGlow = Math.max(0, lanternGlow - dt * 3.5);
        if (!effReduced) {
          malletClock += dt * 2.3;
          malletPulse = Math.pow(Math.max(0, Math.sin(malletClock * Math.PI)), 6);
        } else {
          malletPulse = 0;
        }
      }

      if (!effReduced) {
        pulleyAngle = (pulleyAngle + pulleySpeed * dt) % (Math.PI * 2);
        swayPhase += dt * 1.3;
        curtainRipple = Math.max(0, curtainRipple - dt * 2.2);
      }
      for (let k = 0; k < hoistLiftProgress.length; k += 1) {
        hoistLiftProgress[k] = effReduced ? 1 : Math.min(1, hoistLiftProgress[k] + Math.max(0.03, dt * 1.2));
      }
      return getState();
    }

    function renderRig(ctx, width, height, skyState) {
      if (!ctx || !(width > 0) || !(height > 0)) return;
      const w = width;
      const h = height;
      const sky = skyState || {};
      const solarPhase = sky.solarPhase || "day";
      const isNight = solarPhase === "night";
      const effReduced = Boolean(reducedMotion || sky.reducedMotion);
      const sway = effReduced ? 0 : Math.sin(swayPhase) * (w * 0.0045);
      const shudder = (!effReduced && plankLooseness > 0) ? Math.sin(jointShudderPhase) * plankLooseness * 3.2 : 0;

      ctx.save();

      /* 1. Ground arrival terrace & deep recessed inner scaffolding vault (never a finished facade) */
      ctx.fillStyle = isNight ? "#0b111d" : "#261b12";
      ctx.fillRect(0, h * 0.855, w, h * 0.145);

      const innerAlpha = 0.38 + sackclothPartedRatio * 0.56;
      ctx.fillStyle = thkRigHexToRgba(PALETTE.blueprintIndigo, innerAlpha * 0.82);
      ctx.fillRect(w * 0.33, h * 0.51, w * 0.39, h * 0.31);
      ctx.strokeStyle = thkRigHexToRgba(isNight ? PALETTE.starCyan : PALETTE.ironArmature, innerAlpha);
      ctx.lineWidth = Math.max(1, w * 0.0016);
      for (let b = 0; b < 5; b += 1) {
        const bx = w * (0.35 + b * 0.085);
        const inset = (b % 2) * 6;
        ctx.beginPath();
        ctx.moveTo(bx, h * 0.51 + inset);
        ctx.lineTo(bx, h * 0.82);
        ctx.moveTo(w * 0.33, h * (0.55 + b * 0.055));
        ctx.lineTo(w * 0.72, h * (0.55 + b * 0.055));
        ctx.moveTo(bx, h * 0.53);
        ctx.lineTo(bx + w * 0.075, h * 0.79);
        ctx.stroke();
      }

      /* 2. Lashed multi-tier timber scaffoldings (left/mid) & riveted metal armatures (right/mid) */
      const cols = [0.12, 0.21, 0.31, 0.42, 0.56, 0.68, 0.79, 0.88];
      const rows = [0.50, 0.59, 0.69, 0.79];
      for (let c = 0; c < cols.length; c += 1) {
        const isIron = c >= 4;
        const x0 = w * cols[c] + shudder * (c % 2 === 0 ? 1 : -1);
        const tilt = plankLooseness * (c % 2 === 0 ? 8 : -7);
        ctx.strokeStyle = isIron ? PALETTE.ironArmature : PALETTE.pineTimber;
        ctx.lineWidth = Math.max(2.2, w * (isIron ? 0.0036 : 0.0042));
        ctx.beginPath();
        ctx.moveTo(x0 + tilt, h * 0.48);
        ctx.lineTo(x0, h * 0.855);
        ctx.stroke();
        if (c < cols.length - 1) {
          const xNext = w * cols[c + 1];
          for (let r = 0; r < rows.length; r += 1) {
            const yr = h * rows[r] + plankLooseness * ((r + c) % 2 === 0 ? 5 : -4);
            ctx.strokeStyle = isIron ? PALETTE.ironArmature : PALETTE.pineTimber;
            ctx.lineWidth = Math.max(1.8, w * 0.003);
            ctx.beginPath();
            ctx.moveTo(x0, yr);
            ctx.lineTo(xNext, yr);
            ctx.moveTo(x0, yr);
            ctx.lineTo(xNext, h * (rows[Math.min(rows.length - 1, r + 1)] || 0.85));
            ctx.stroke();
            ctx.fillStyle = isIron ? PALETTE.plumbSilver : PALETTE.hempRope;
            ctx.fillRect(x0 - 2.5, yr - 2.5, 5, 5);
          }
        }
      }

      /* 3. Interlocking beams embracing beams */
      const embracePairs = [[0.22, 0.49, 0.51, 0.48], [0.47, 0.50, 0.76, 0.49]];
      for (let e = 0; e < embracePairs.length; e += 1) {
        const ep = embracePairs[e];
        const ex1 = w * ep[0], ey1 = h * ep[1] + plankLooseness * 6;
        const ex2 = w * ep[2], ey2 = h * ep[3] - plankLooseness * 5;
        ctx.strokeStyle = PALETTE.pineTimber;
        ctx.lineWidth = Math.max(4, h * 0.0085);
        ctx.beginPath(); ctx.moveTo(ex1, ey1 - 3); ctx.lineTo(ex2, ey2 + 3); ctx.stroke();
        ctx.strokeStyle = PALETTE.weatheredPlank;
        ctx.beginPath(); ctx.moveTo(ex1, ey1 + 4); ctx.lineTo(ex2, ey2 - 4); ctx.stroke();
        const midX = (ex1 + ex2) * 0.5, midY = (ey1 + ey2) * 0.5;
        ctx.fillStyle = plankLooseness > 0.05 ? PALETTE.fractureRust : PALETTE.ironArmature;
        ctx.fillRect(midX - 9, midY - 7, 18, 14);
      }

      /* 4. Billowing burlap sackcloth screens parting onto deeper armatures */
      const seamX = w * 0.525;
      const spanHalf = w * 0.195;
      const openGap = spanHalf * 0.78 * sackclothPartedRatio;
      const billow = (effReduced ? 0 : Math.sin(swayPhase * 1.4) * 5) + curtainRipple * 6;
      [[-1, seamX - spanHalf, seamX - openGap], [1, seamX + openGap, seamX + spanHalf]].forEach(function (seg) {
        const xA = seg[1], xB = seg[2];
        if (xB - xA < 4) return;
        ctx.fillStyle = thkRigHexToRgba(PALETTE.sackclothBurlap, 0.90 - sackclothPartedRatio * 0.14);
        ctx.beginPath();
        ctx.moveTo(xA, h * 0.525);
        ctx.lineTo(xB, h * 0.525);
        ctx.quadraticCurveTo((xA + xB) * 0.5 + billow * seg[0], h * 0.66, xB + billow * 0.4, h * 0.765);
        ctx.quadraticCurveTo((xA + xB) * 0.5, h * 0.785, xA, h * 0.76);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = PALETTE.hempRope;
        ctx.lineWidth = 1.2;
        for (let f = 1; f <= 3; f += 1) {
          const fx = thkRigLerp(xA, xB, f / 4);
          ctx.beginPath(); ctx.moveTo(fx, h * 0.525); ctx.lineTo(fx + billow * 0.3, h * 0.765); ctx.stroke();
        }
      });

      /* 5. Rope-hung catwalks, sawhorse plank catwalks, inclined ladders & trestle lanterns */
      const sag = ropeSlack * h * 0.032;
      const rw1 = w * 0.38 + sway, rw2 = w * 0.58 + sway, ry = h * 0.57 + sag * 0.5;
      ctx.strokeStyle = PALETTE.hempRope;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(w * 0.39, h * 0.49); ctx.lineTo(rw1 + 8, ry);
      ctx.moveTo(w * 0.57, h * 0.49); ctx.lineTo(rw2 - 8, ry);
      ctx.moveTo(rw1, ry - 8); ctx.quadraticCurveTo((rw1 + rw2) * 0.5, ry - 8 + sag, rw2, ry - 8);
      ctx.stroke();
      ctx.strokeStyle = PALETTE.pineTimber;
      ctx.lineWidth = Math.max(3.5, h * 0.006);
      ctx.beginPath(); ctx.moveTo(rw1, ry); ctx.quadraticCurveTo((rw1 + rw2) * 0.5, ry + sag, rw2, ry); ctx.stroke();

      const sw1 = w * 0.23, sw2 = w * 0.47, sy = h * 0.76 + plankLooseness * 5;
      ctx.strokeStyle = PALETTE.weatheredPlank;
      ctx.lineWidth = Math.max(4, h * 0.007);
      ctx.beginPath(); ctx.moveTo(sw1, sy); ctx.lineTo(sw2, sy); ctx.stroke();
      [0.26, 0.35, 0.44].forEach(function (hx) {
        const cx = w * hx;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(cx - 11, h * 0.855); ctx.lineTo(cx, sy); ctx.lineTo(cx + 11, h * 0.855);
        ctx.stroke();
      });

      [[0.75, 0.81, 0.83, 0.54], [0.18, 0.82, 0.24, 0.58]].forEach(function (ld) {
        const lx1 = w * ld[0], ly1 = h * ld[1], lx2 = w * ld[2], ly2 = h * ld[3];
        ctx.strokeStyle = PALETTE.hempRope;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lx1, ly1); ctx.lineTo(lx2, ly2);
        ctx.moveTo(lx1 + 10, ly1); ctx.lineTo(lx2 + 10, ly2);
        for (let st = 1; st <= 8; st += 1) {
          const t = st / 9;
          const rx = thkRigLerp(lx1, lx2, t), ryStep = thkRigLerp(ly1, ly2, t);
          ctx.moveTo(rx, ryStep); ctx.lineTo(rx + 10, ryStep);
        }
        ctx.stroke();
      });

      if (lanternGlow > 0.02) {
        [[0.35, 0.75], [0.78, 0.66], [0.48, 0.57]].forEach(function (lp) {
          const lx = w * lp[0], ly = h * lp[1];
          const grad = ctx.createRadialGradient(lx, ly, 1, lx, ly, Math.max(16, w * 0.024));
          grad.addColorStop(0, thkRigHexToRgba(PALETTE.sunsetCopper, 0.85 * lanternGlow));
          grad.addColorStop(1, "rgba(201,95,54,0)");
          ctx.fillStyle = grad;
          ctx.beginPath(); ctx.arc(lx, ly, Math.max(16, w * 0.024), 0, Math.PI * 2); ctx.fill();
        });
      }

      /* 6. Seven parent derrick cranes hoisting child cranes + newly hoisted nested crane tiers */
      for (let i = 0; i < BASE_CRANE_TOWERS.length; i += 1) {
        const c = BASE_CRANE_TOWERS[i];
        const bx = w * c.baseNx, by = h * c.baseNy;
        const tx = w * c.tipNx + sway * 0.4, ty = h * c.tipNy + plankLooseness * 6;
        ctx.strokeStyle = c.material === "iron" ? PALETTE.ironArmature : PALETTE.pineTimber;
        ctx.lineWidth = Math.max(2.4, w * 0.0032);
        ctx.beginPath(); ctx.moveTo(bx - 10, by); ctx.lineTo(tx, ty); ctx.lineTo(bx + 10, by); ctx.stroke();
        ctx.fillStyle = PALETTE.hempRope;
        ctx.beginPath(); ctx.arc(tx, ty, 4, 0, Math.PI * 2); ctx.fill();
        const dropLen = h * 0.042 + ropeSlack * h * 0.02;
        ctx.strokeStyle = PALETTE.hempRope;
        ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(tx, ty + dropLen); ctx.stroke();
        ctx.strokeStyle = PALETTE.pineTimber;
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(tx - 15 * c.childScale, ty + dropLen + 4); ctx.lineTo(tx + 17 * c.childScale, ty + dropLen - 5); ctx.stroke();
      }
      for (let j = 0; j < hoistedCranesAdded; j += 1) {
        const s = HOISTED_CRANE_SLOTS[j];
        const lift = hoistLiftProgress[j] !== undefined ? hoistLiftProgress[j] : 1;
        const px = w * s.parentNx, py = h * s.parentNy;
        const cx = w * s.nx + sway * 0.6, cy = thkRigLerp(py + 18, h * s.ny, lift) + plankLooseness * 5;
        ctx.strokeStyle = PALETTE.hempRope;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(cx, cy + h * 0.03); ctx.stroke();
        ctx.strokeStyle = j % 2 === 0 ? PALETTE.ironArmature : PALETTE.pineTimber;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(cx, cy + h * 0.042); ctx.lineTo(cx, cy);
        ctx.moveTo(cx - s.armDir * w * 0.024, cy + 5); ctx.lineTo(cx + s.armDir * w * 0.045, cy - 7);
        ctx.stroke();
        const tipX = cx + s.armDir * w * 0.045, tipY = cy - 7;
        ctx.strokeStyle = PALETTE.plumbSilver;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 4.2, pulleyAngle, pulleyAngle + Math.PI * 1.4);
        ctx.stroke();
      }

      /* 7. Foreground arrival palisade of weathered plank fences + sifting mortar motes + anchors */
      const plankCount = 26;
      for (let p = 0; p < plankCount; p += 1) {
        const px = w * (0.06 + (p / plankCount) * 0.88);
        const py = h * (0.815 + (p % 3) * 0.008) + plankLooseness * ((p % 4) * 3.5);
        const pw = Math.max(6, (w * 0.84) / plankCount - 3);
        const ph = h * 0.125;
        const tiltRad = plankLooseness * ((p % 2 === 0 ? 1 : -1) * (0.06 + (p % 3) * 0.045));
        ctx.save();
        ctx.translate(px + pw * 0.5, py + ph * 0.5);
        ctx.rotate(tiltRad);
        ctx.fillStyle = p % 2 === 0 ? PALETTE.weatheredPlank : PALETTE.pineTimber;
        ctx.fillRect(-pw * 0.5, -ph * 0.5, pw, ph);
        ctx.restore();
      }

      if (plankLooseness > 0.01) {
        ctx.fillStyle = thkRigHexToRgba(PALETTE.fractureRust, Math.min(0.85, 0.25 + plankLooseness * 0.65));
        for (let m = 0; m < siftMotes.length; m += 1) {
          ctx.fillRect(siftMotes[m].nx * w, siftMotes[m].ny * h, siftMotes[m].size + 0.8, siftMotes[m].size + 0.8);
        }
      }

      const anchors = getRigAnchors(w, h);
      for (let a = 0; a < anchors.length; a += 1) {
        const node = anchors[a];
        const isSel = node.id === selectedAnchorId;
        const r = isSel ? 6.5 : 4.0;
        ctx.fillStyle = isSel ? PALETTE.starCyan : (isNight ? PALETTE.plumbSilver : PALETTE.hempRope);
        ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill();
        if (malletPulse > 0.05 && a % 3 === 0) {
          ctx.strokeStyle = thkRigHexToRgba(PALETTE.ochreHaze, malletPulse * 0.65);
          ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.arc(node.x, node.y, r + malletPulse * 11, 0, Math.PI * 2); ctx.stroke();
        }
      }

      ctx.restore();
    }

    return {
      getRigAnchors: getRigAnchors,
      hoistNewCrane: hoistNewCrane,
      partSackclothScreen: partSackclothScreen,
      step: step,
      renderRig: renderRig,
      hitTest: hitTest,
      selectAnchor: selectAnchor,
      unlockAudio: unlockAudio,
      setMuted: setMuted,
      toggleMute: toggleMute,
      isMuted: isMuted,
      getAudioContext: getAudioContext,
      playHammerAndPulley: playHammerAndPulley,
      playCraneHoist: playCraneHoist,
      playSackclothRustle: playSackclothRustle,
      playStructuralGroan: playStructuralGroan,
      setReducedMotion: setReducedMotion,
      reset: reset,
      getState: getState
    };
  }

  const api = Object.freeze({
    PALETTE: PALETTE,
    CANONICAL_STONES: CANONICAL_STONES,
    createScaffoldingRig: createScaffoldingRig
  });

  globalThis.TheklaScaffoldingRig = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
