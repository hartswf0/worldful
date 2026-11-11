/* City 41: IRENE (Cities & Names 5) — Plateau Brink, Milky Mist Sponge & Wind-Borne Signals */
globalThis.IrenePlateauSignals = (function () {
  "use strict";

  const PALETTE = Object.freeze({
    cragObsidian: "#121015",
    basaltLedge: "#231d1c",
    twilightAbyss: "#1c1f36",
    gorgeIndigo: "#313559",
    ridgeLavender: "#5c5d87",
    milkyMistSponge: "#b8b7ce",
    hollowPinkGlow: "#f09388",
    windowAmber: "#ffbe86",
    signalFlareGreen: "#7be0a8",
    towerBeaconCoral: "#e8655a",
    parchmentChalk: "#ece2cf",
    localCobbleGrey: "#6e6b68"
  });

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function numOr(v, fallback) {
    return typeof v === "number" && Number.isFinite(v) ? v : fallback;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || "#000000").replace("#", "");
    const n = parseInt(clean, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return "rgba(" + r + "," + g + "," + b + "," + clamp(alpha, 0, 1).toFixed(3) + ")";
  }

  const WATCHERS = Object.freeze([
    Object.freeze({
      id: "shepherd",
      title: "Shepherd Shifting His Flock",
      vantageNote: "Stands by the western cairn with crook and ewes as twilight settles over the gorge.",
      conjecture: "Conjectures warm lantern-lit wool arcades, sheltered winter folds beneath the viaduct, and peaceful hearth-fires.",
      ledgeX: 0.16,
      ledgeY: 0.79,
      targetX: 0.41,
      targetY: 0.50,
      propKind: "crook_and_flock"
    }),
    Object.freeze({
      id: "bird_catcher",
      title: "Bird-Catcher Watching His Nets",
      vantageNote: "Crouches along the windward cliff grass beside taut twilight clap-nets.",
      conjecture: "Conjectures roofed aviaries, string serenades drifting from suspended pergolas, and silk banners snapping in the updraft.",
      ledgeX: 0.38,
      ledgeY: 0.84,
      targetX: 0.48,
      targetY: 0.47,
      propKind: "clap_nets"
    }),
    Object.freeze({
      id: "hermit",
      title: "Hermit Gathering Crag Greens",
      vantageNote: "Leans on an ash staff along the high basalt shelf with a basket of bitter cliff herbs.",
      conjecture: "Conjectures walled cloister gardens in deep shadow, penitents' vigil lamps, and brazen tower bells warning of vanity.",
      ledgeX: 0.63,
      ledgeY: 0.82,
      targetX: 0.54,
      targetY: 0.52,
      propKind: "staff_and_basket"
    }),
    Object.freeze({
      id: "traveler",
      title: "Traveler Sheltering Behind Crags",
      vantageNote: "Pauses on the switchback brink wrapping his cloak against the evening gust.",
      conjecture: "Conjectures crossroads caravanserais, whispered plots under bridge arches, and lovers awaiting a signal flare.",
      ledgeX: 0.84,
      ledgeY: 0.77,
      targetX: 0.60,
      targetY: 0.48,
      propKind: "wind_cloak"
    })
  ]);

  const SIGNAL_TYPES = Object.freeze([
    Object.freeze({
      id: "bass_drums_trumpets",
      title: "Bass Drums & Brass Trumpets",
      festivalReading: "A nocturnal wedding or civic carnival winding with brass horns across the central piazzas.",
      turmoilReading: "Garrison mobilization marching columns toward the gorge bridgeheads.",
      baseHz: 110,
      originX: 0.47,
      originY: 0.51,
      color: PALETTE.hollowPinkGlow
    }),
    Object.freeze({
      id: "firecrackers_crackle",
      title: "Crackle of Distant Firecrackers",
      festivalReading: "Strings of paper squibs celebrating a feast-night illumination along the terraces.",
      turmoilReading: "Dry timber granaries catching spark in a quarter-wide night conflagration.",
      baseHz: 520,
      originX: 0.55,
      originY: 0.49,
      color: PALETTE.windowAmber
    }),
    Object.freeze({
      id: "machinegun_flares",
      title: "Staccato Bursts & Greenish Flares",
      festivalReading: "Pyrotechnic Emerald-Star shells launched from the citadel to mark the watch hour.",
      turmoilReading: "Barricade machine-gun bursts under eerie magnesium-green reconnaissance flares.",
      baseHz: 260,
      originX: 0.41,
      originY: 0.47,
      color: PALETTE.signalFlareGreen
    }),
    Object.freeze({
      id: "watchtower_beacons",
      title: "Signal Fires on the Towers",
      festivalReading: "Welcoming resin beacons guiding highland caravans toward the valley gates.",
      turmoilReading: "Quarantine and siege-watch braziers sealing every bridge into the hollow.",
      baseHz: 196,
      originX: 0.64,
      originY: 0.46,
      color: PALETTE.towerBeaconCoral
    })
  ]);

  const TOWER_COORDS = Object.freeze([
    { x: 0.34, y: 0.48, h: 0.036 },
    { x: 0.44, y: 0.44, h: 0.032 },
    { x: 0.57, y: 0.44, h: 0.034 },
    { x: 0.66, y: 0.48, h: 0.038 }
  ]);

  function makePrng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  const rng = makePrng(410085);

  const STARS = (function () {
    const arr = [];
    for (let i = 0; i < 28; i += 1) {
      arr.push({
        x: 0.04 + rng() * 0.92,
        y: 0.03 + rng() * 0.24,
        r: 0.7 + rng() * 1.1,
        phase: rng() * Math.PI * 2
      });
    }
    return arr;
  })();

  const HOLLOW_WINDOWS = (function () {
    const arr = [];
    for (let i = 0; i < 76; i += 1) {
      const core = i < 46;
      const angle = rng() * Math.PI * 2;
      const rad = core ? Math.pow(rng(), 0.75) * 0.11 : 0.10 + rng() * 0.12;
      arr.push({
        x: 0.50 + Math.cos(angle) * rad * 1.35,
        y: 0.495 + Math.sin(angle) * rad * 0.42,
        size: core ? 1.4 + rng() * 1.6 : 0.9 + rng() * 1.0,
        alpha: core ? 0.62 + rng() * 0.36 : 0.20 + rng() * 0.30,
        phase: rng() * Math.PI * 2,
        core: core
      });
    }
    return arr;
  })();

  const GARDEN_SHADOWS = Object.freeze([
    { x: 0.46, y: 0.50, rx: 0.030, ry: 0.011, hasDome: true, chimney: false },
    { x: 0.52, y: 0.485, rx: 0.026, ry: 0.010, hasDome: true, chimney: true },
    { x: 0.49, y: 0.525, rx: 0.034, ry: 0.012, hasDome: false, chimney: true },
    { x: 0.42, y: 0.495, rx: 0.022, ry: 0.009, hasDome: false, chimney: true },
    { x: 0.56, y: 0.51, rx: 0.025, ry: 0.010, hasDome: true, chimney: false },
    { x: 0.48, y: 0.468, rx: 0.020, ry: 0.008, hasDome: true, chimney: true }
  ]);

  const MIST_BANKS = (function () {
    const arr = [];
    for (let i = 0; i < 18; i += 1) {
      const side = i % 2 === 0 ? -1 : 1;
      const band = i / 17;
      arr.push({
        baseX: 0.34 + band * 0.32 + (rng() - 0.5) * 0.04,
        baseY: 0.44 + (i % 5) * 0.022 + (rng() - 0.5) * 0.01,
        rx: 0.065 + rng() * 0.065,
        ry: 0.018 + rng() * 0.016,
        side: side,
        driftSpeed: 0.18 + rng() * 0.34,
        phase: rng() * Math.PI * 2,
        inner: Math.abs(0.34 + band * 0.32 - 0.50) < 0.11
      });
    }
    return arr;
  })();

  function createAudioSynth() {
    let ctx = null;
    let noiseBuf = null;
    let muted = false;
    let unlocked = false;

    function ensureContext() {
      if (ctx) {
        return ctx;
      }
      try {
        const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!AC) {
          return null;
        }
        ctx = new AC();
        const len = Math.max(1, Math.floor(ctx.sampleRate * 1.2));
        noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = noiseBuf.getChannelData(0);
        const nrng = makePrng(99173);
        for (let i = 0; i < len; i += 1) {
          data[i] = nrng() * 2 - 1;
        }
      } catch (_err) {
        ctx = null;
      }
      return ctx;
    }

    function unlock() {
      const ac = ensureContext();
      if (!ac) {
        return false;
      }
      try {
        if (ac.state === "suspended" && typeof ac.resume === "function") {
          ac.resume().catch(function () {});
        }
        unlocked = true;
      } catch (_err) {
        unlocked = false;
      }
      return unlocked;
    }

    function playSignal(signalId, windGust, distanceFromHollow, isStillIrene) {
      if (muted || !unlocked) {
        return;
      }
      const ac = ensureContext();
      if (!ac) {
        return;
      }
      try {
        const now = ac.currentTime;
        const wind = clamp(numOr(windGust, 0.58), 0, 1);
        const dist = clamp(numOr(distanceFromHollow, 0.88), 0, 1);
        const master = ac.createGain();
        const filter = ac.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(isStillIrene ? 360 + wind * 1350 + (1 - dist) * 420 : 1900, now);
        filter.Q.setValueAtTime(1.2 + wind * 1.8, now);
        const vol = clamp((0.10 + wind * 0.11) * (isStillIrene ? 0.85 : 0.65), 0.03, 0.24);
        master.gain.setValueAtTime(vol, now);
        filter.connect(master);
        master.connect(ac.destination);

        if (signalId === "bass_drums_trumpets") {
          [0, 0.26].forEach(function (off) {
            const osc = ac.createOscillator();
            const g = ac.createGain();
            osc.type = "sine";
            osc.frequency.setValueAtTime(110, now + off);
            osc.frequency.exponentialRampToValueAtTime(48, now + off + 0.28);
            g.gain.setValueAtTime(0.001, now + off);
            g.gain.linearRampToValueAtTime(0.9, now + off + 0.02);
            g.gain.exponentialRampToValueAtTime(0.001, now + off + 0.34);
            osc.connect(g);
            g.connect(filter);
            osc.start(now + off);
            osc.stop(now + off + 0.36);
          });
          [220, 329.6].forEach(function (hz) {
            const horn = ac.createOscillator();
            const hg = ac.createGain();
            horn.type = "sawtooth";
            horn.frequency.setValueAtTime(hz, now + 0.08);
            hg.gain.setValueAtTime(0.001, now + 0.08);
            hg.gain.linearRampToValueAtTime(0.22, now + 0.26);
            hg.gain.exponentialRampToValueAtTime(0.001, now + 0.82);
            horn.connect(hg);
            hg.connect(filter);
            horn.start(now + 0.08);
            horn.stop(now + 0.85);
          });
        } else if (signalId === "firecrackers_crackle" && noiseBuf) {
          for (let k = 0; k < 7; k += 1) {
            const t0 = now + k * 0.055 + (k % 2) * 0.018;
            const src = ac.createBufferSource();
            src.buffer = noiseBuf;
            const bp = ac.createBiquadFilter();
            bp.type = "bandpass";
            bp.frequency.setValueAtTime(520 + k * 145, t0);
            bp.Q.setValueAtTime(3.2, t0);
            const ng = ac.createGain();
            ng.gain.setValueAtTime(0.75, t0);
            ng.gain.exponentialRampToValueAtTime(0.001, t0 + 0.055);
            src.connect(bp);
            bp.connect(ng);
            ng.connect(filter);
            src.start(t0, k * 0.09, 0.07);
          }
        } else if (signalId === "machinegun_flares") {
          for (let b = 0; b < 5; b += 1) {
            const tb = now + b * 0.052;
            const pulse = ac.createOscillator();
            const pg = ac.createGain();
            pulse.type = "square";
            pulse.frequency.setValueAtTime(260 - b * 14, tb);
            pg.gain.setValueAtTime(0.42, tb);
            pg.gain.exponentialRampToValueAtTime(0.001, tb + 0.038);
            pulse.connect(pg);
            pg.connect(filter);
            pulse.start(tb);
            pulse.stop(tb + 0.042);
          }
          const flare = ac.createOscillator();
          const fg = ac.createGain();
          flare.type = "triangle";
          flare.frequency.setValueAtTime(360, now + 0.22);
          flare.frequency.exponentialRampToValueAtTime(880, now + 0.78);
          fg.gain.setValueAtTime(0.001, now + 0.22);
          fg.gain.linearRampToValueAtTime(0.24, now + 0.36);
          fg.gain.exponentialRampToValueAtTime(0.001, now + 0.88);
          flare.connect(fg);
          fg.connect(filter);
          flare.start(now + 0.22);
          flare.stop(now + 0.90);
        } else {
          [196, 293.7].forEach(function (hz, idx) {
            const br = ac.createOscillator();
            const bg = ac.createGain();
            br.type = idx === 0 ? "triangle" : "sine";
            br.frequency.setValueAtTime(hz, now);
            bg.gain.setValueAtTime(0.001, now);
            bg.gain.linearRampToValueAtTime(idx === 0 ? 0.42 : 0.22, now + 0.18);
            bg.gain.exponentialRampToValueAtTime(0.001, now + 0.92);
            br.connect(bg);
            bg.connect(filter);
            br.start(now);
            br.stop(now + 0.95);
          });
        }
      } catch (_err) {
        /* Headless safe no-op */
      }
    }
    function playTransition(isStillIrene) {
      if (muted || !unlocked) {
        return;
      }
      const ac = ensureContext();
      if (!ac) {
        return;
      }
      try {
        const now = ac.currentTime;
        const freqs = isStillIrene ? [196, 293.7, 440] : [293.7, 196, 92.5];
        freqs.forEach(function (hz, i) {
          const osc = ac.createOscillator();
          const g = ac.createGain();
          osc.type = isStillIrene ? "sine" : "triangle";
          osc.frequency.setValueAtTime(hz, now + i * 0.08);
          if (!isStillIrene) {
            osc.frequency.exponentialRampToValueAtTime(hz * 0.72, now + i * 0.08 + 0.34);
          }
          g.gain.setValueAtTime(0.001, now + i * 0.08);
          g.gain.linearRampToValueAtTime(0.09, now + i * 0.08 + 0.06);
          g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.42);
          osc.connect(g);
          g.connect(ac.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.45);
        });
      } catch (_err) {
        /* Headless safe no-op */
      }
    }

    return {
      unlock: unlock,
      playSignal: playSignal,
      playTransition: playTransition,
      setMuted: function (flag) { muted = Boolean(flag); return muted; },
      toggleMute: function () { muted = !muted; if (!muted && !unlocked) { unlock(); } return muted; },
      isMuted: function () { return muted; },
      isUnlocked: function () { return unlocked; }
    };
  }

  function createPlateauRenderer(opts) {
    const options = opts || {};
    let reducedMotion = Boolean(options.reducedMotion);
    const onSignalEmitted = typeof options.onSignalEmitted === "function" ? options.onSignalEmitted : null;
    const onWatcherSelect = typeof options.onWatcherSelect === "function" ? options.onWatcherSelect : null;
    const audio = createAudioSynth();

    let emittedCount = 0;
    let lastEmittedSignalId = null;
    let timeSec = 0;
    let waves = [];
    let sparks = [];
    let flares = [];
    let plumes = [];
    let prevIsStillIrene = true;

    let cachedState = {
      distanceFromHollow: 0.88,
      windGust: 0.58,
      mistPartingRatio: 0.62,
      isStillIrene: true,
      approachedDirectly: false,
      activeWatcherId: "shepherd",
      pinkGlowIntensity: 0.85,
      streetGridMorph: 0
    };

    function normalizeState(ps) {
      const src = ps || cachedState;
      const dist = clamp(numOr(src.distanceFromHollow, 0.88), 0, 1);
      const wind = clamp(numOr(src.windGust, 0.58), 0, 1);
      const still = src.isStillIrene !== undefined ? Boolean(src.isStillIrene) : dist >= 0.25;
      const parted = clamp(src.mistPartingRatio !== undefined ? numOr(src.mistPartingRatio, 0.62) : 0.1 + wind * 0.85, 0, 1);
      const morph = clamp(src.streetGridMorph !== undefined ? numOr(src.streetGridMorph, still ? 0 : 1) : (still ? 0 : 1), 0, 1);
      return {
        distanceFromHollow: dist,
        windGust: wind,
        mistPartingRatio: parted,
        isStillIrene: still,
        approachedDirectly: src.approachedDirectly !== undefined ? Boolean(src.approachedDirectly) : !still,
        activeWatcherId: src.activeWatcherId || "shepherd",
        pinkGlowIntensity: clamp(numOr(src.pinkGlowIntensity, still ? 0.85 : 0), 0, 1),
        streetGridMorph: morph
      };
    }

    function drawBrinkVista(ctx, w, h, st) {
      ctx.save();
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.72);
      skyGrad.addColorStop(0, PALETTE.cragObsidian);
      skyGrad.addColorStop(0.34, PALETTE.twilightAbyss);
      skyGrad.addColorStop(0.68, PALETTE.gorgeIndigo);
      skyGrad.addColorStop(1, PALETTE.ridgeLavender);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < STARS.length; i += 1) {
        const s = STARS[i];
        const tw = reducedMotion ? 0.55 : 0.35 + 0.35 * Math.sin(timeSec * 1.4 + s.phase);
        ctx.fillStyle = hexToRgba(PALETTE.parchmentChalk, tw);
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const ridges = [
        { y: 0.30, dip: 0.38, col: PALETTE.ridgeLavender },
        { y: 0.35, dip: 0.45, col: PALETTE.gorgeIndigo },
        { y: 0.41, dip: 0.55, col: PALETTE.twilightAbyss }
      ];
      for (let r = 0; r < ridges.length; r += 1) {
        const rg = ridges[r];
        ctx.fillStyle = rg.col;
        ctx.beginPath();
        ctx.moveTo(0, h * rg.y);
        ctx.quadraticCurveTo(w * 0.25, h * (rg.y - 0.04), w * 0.36, h * (rg.dip - 0.03));
        ctx.quadraticCurveTo(w * 0.50, h * rg.dip, w * 0.64, h * (rg.dip - 0.03));
        ctx.quadraticCurveTo(w * 0.76, h * (rg.y - 0.05), w, h * (rg.y + 0.01));
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
      }

      const glowAlpha = st.pinkGlowIntensity * (0.58 + 0.34 * st.mistPartingRatio);
      const pinkRad = ctx.createRadialGradient(w * 0.50, h * 0.50, w * 0.02, w * 0.50, h * 0.49, w * 0.26);
      pinkRad.addColorStop(0, hexToRgba(PALETTE.windowAmber, glowAlpha * 0.72));
      pinkRad.addColorStop(0.38, hexToRgba(PALETTE.hollowPinkGlow, glowAlpha));
      pinkRad.addColorStop(0.75, hexToRgba(PALETTE.ridgeLavender, glowAlpha * 0.34));
      pinkRad.addColorStop(1, hexToRgba(PALETTE.twilightAbyss, 0));
      ctx.fillStyle = pinkRad;
      ctx.fillRect(w * 0.16, h * 0.24, w * 0.68, h * 0.46);

      const bridgeVis = 0.22 + 0.78 * st.mistPartingRatio;
      ctx.strokeStyle = hexToRgba(PALETTE.parchmentChalk, bridgeVis * 0.55);
      ctx.fillStyle = hexToRgba(PALETTE.cragObsidian, 0.82);
      const vx0 = w * 0.31;
      const vx1 = w * 0.43;
      const vy = h * 0.485;
      ctx.fillRect(vx0, vy, vx1 - vx0, 2.5);
      for (let a = 0; a < 5; a += 1) {
        const ax = lerp(vx0, vx1, a / 5);
        const aw = (vx1 - vx0) / 5;
        ctx.fillRect(ax, vy, 2.2, h * 0.045);
        ctx.beginPath();
        ctx.arc(ax + aw * 0.5, vy + h * 0.016, aw * 0.38, Math.PI, 0);
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      const sx0 = w * 0.56;
      const sx1 = w * 0.69;
      const sy = h * 0.478;
      ctx.fillRect(sx0, sy - h * 0.028, 3, h * 0.062);
      ctx.fillRect(sx1 - 3, sy - h * 0.028, 3, h * 0.062);
      ctx.beginPath();
      ctx.moveTo(sx0, sy - h * 0.025);
      ctx.quadraticCurveTo((sx0 + sx1) * 0.5, sy + h * 0.008, sx1, sy - h * 0.025);
      ctx.moveTo(sx0, sy);
      ctx.lineTo(sx1, sy);
      ctx.lineWidth = 1.3;
      ctx.stroke();
      for (let hng = 1; hng < 8; hng += 1) {
        const t = hng / 8;
        const hx = lerp(sx0, sx1, t);
        const sag = 4 * t * (1 - t);
        ctx.beginPath();
        ctx.moveTo(hx, lerp(sy - h * 0.024, sy + h * 0.002, sag));
        ctx.lineTo(hx, sy);
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      ctx.restore();
    }
    function drawHollowMistAndSignals(ctx, w, h, st) {
      ctx.save();
      const windShift = (st.windGust - 0.3) * w * 0.025;
      for (let g = 0; g < GARDEN_SHADOWS.length; g += 1) {
        const gs = GARDEN_SHADOWS[g];
        const gx = gs.x * w;
        const gy = gs.y * h;
        ctx.fillStyle = hexToRgba(PALETTE.cragObsidian, 0.72);
        ctx.beginPath();
        ctx.ellipse(gx, gy, gs.rx * w, gs.ry * h, 0, 0, Math.PI * 2);
        ctx.fill();
        if (gs.hasDome) {
          ctx.fillStyle = hexToRgba(PALETTE.twilightAbyss, 0.9);
          ctx.beginPath();
          ctx.arc(gx, gy - gs.ry * h * 0.6, gs.rx * w * 0.34, Math.PI, 0);
          ctx.fill();
        }
        if (gs.chimney) {
          ctx.strokeStyle = hexToRgba(PALETTE.milkyMistSponge, 0.28);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(gx + 4, gy - 4);
          ctx.quadraticCurveTo(gx + 4 + windShift * 0.6, gy - h * 0.02, gx + 6 + windShift * 1.4, gy - h * 0.035);
          ctx.stroke();
        }
      }

      ctx.strokeStyle = hexToRgba(PALETTE.windowAmber, 0.22 * st.pinkGlowIntensity);
      ctx.lineWidth = 0.8;
      for (let al = 0; al < 6; al += 1) {
        const ay = h * (0.475 + al * 0.009);
        ctx.beginPath();
        ctx.moveTo(w * (0.37 + al * 0.01), ay);
        ctx.quadraticCurveTo(w * 0.50, ay + (al % 2 === 0 ? 4 : -3), w * (0.63 - al * 0.01), ay);
        ctx.stroke();
      }

      for (let i = 0; i < HOLLOW_WINDOWS.length; i += 1) {
        const wn = HOLLOW_WINDOWS[i];
        const twk = reducedMotion ? 1 : 0.72 + 0.28 * Math.sin(timeSec * 2.6 + wn.phase);
        const col = wn.core ? PALETTE.windowAmber : PALETTE.hollowPinkGlow;
        ctx.fillStyle = hexToRgba(col, wn.alpha * twk * (0.45 + 0.55 * st.mistPartingRatio));
        ctx.fillRect(wn.x * w, wn.y * h, wn.size, wn.size * 0.85);
      }

      for (let t = 0; t < TOWER_COORDS.length; t += 1) {
        const tw = TOWER_COORDS[t];
        const tx = tw.x * w;
        const ty = tw.y * h;
        const th = tw.h * h;
        ctx.fillStyle = PALETTE.cragObsidian;
        ctx.fillRect(tx - 3.5, ty - th, 7, th);
        const fireH = 5 + st.windGust * 5 + (plumes.length > 0 ? 9 : 0);
        ctx.fillStyle = hexToRgba(PALETTE.towerBeaconCoral, 0.88);
        ctx.beginPath();
        ctx.moveTo(tx - 3, ty - th);
        ctx.quadraticCurveTo(tx + windShift * 0.35, ty - th - fireH, tx + 3 + windShift * 0.22, ty - th);
        ctx.fill();
      }

      const greenBoost = flares.length > 0 ? 0.38 : 0;
      const spongeDensity = clamp(1.06 - st.mistPartingRatio * 0.82, 0.14, 0.96);
      for (let m = 0; m < MIST_BANKS.length; m += 1) {
        const mb = MIST_BANKS[m];
        const partShift = mb.side * st.mistPartingRatio * w * (mb.inner ? 0.17 : 0.09);
        const drift = reducedMotion ? 0 : Math.sin(timeSec * mb.driftSpeed + mb.phase) * w * 0.014;
        const mx = mb.baseX * w + partShift + drift;
        const my = mb.baseY * h;
        const mrx = mb.rx * w * (1 + st.mistPartingRatio * 0.35);
        const mry = mb.ry * h * (1 - st.mistPartingRatio * 0.32);
        const mGrad = ctx.createRadialGradient(mx, my, mry * 0.15, mx, my, mrx);
        const rimColor = greenBoost > 0 ? PALETTE.signalFlareGreen : PALETTE.milkyMistSponge;
        const coreTint = st.pinkGlowIntensity > 0.3 ? PALETTE.hollowPinkGlow : PALETTE.milkyMistSponge;
        const bankAlpha = spongeDensity * (mb.inner ? 1 - st.mistPartingRatio * 0.55 : 0.72);
        mGrad.addColorStop(0, hexToRgba(PALETTE.milkyMistSponge, bankAlpha * 0.62));
        mGrad.addColorStop(0.55, hexToRgba(coreTint, bankAlpha * 0.32));
        mGrad.addColorStop(0.85, hexToRgba(rimColor, bankAlpha * (0.18 + greenBoost * 0.4)));
        mGrad.addColorStop(1, hexToRgba(PALETTE.milkyMistSponge, 0));
        ctx.fillStyle = mGrad;
        ctx.beginPath();
        ctx.ellipse(mx, my, mrx, Math.max(3, mry), 0, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let wi = 0; wi < waves.length; wi += 1) {
        const wv = waves[wi];
        const p = clamp(wv.age / wv.life, 0, 1);
        const wx = (wv.x + p * st.windGust * 0.08) * w;
        const wy = (wv.y - p * 0.11) * h;
        const rad = (0.015 + p * 0.13) * Math.min(w, h);
        ctx.strokeStyle = hexToRgba(wv.ring % 2 === 0 ? PALETTE.hollowPinkGlow : PALETTE.windowAmber, (1 - p) * 0.82);
        ctx.lineWidth = 2.1 - p * 1.1;
        ctx.beginPath();
        ctx.arc(wx, wy, rad, Math.PI * 1.12, Math.PI * 1.88);
        ctx.stroke();
      }

      for (let si = 0; si < sparks.length; si += 1) {
        const sp = sparks[si];
        const p = clamp(sp.age / sp.life, 0, 1);
        const sx = (sp.x + sp.vx * sp.age + st.windGust * 0.03 * p) * w;
        const sy = (sp.y + sp.vy * sp.age + 0.035 * p * p) * h;
        ctx.fillStyle = hexToRgba(sp.warm ? PALETTE.windowAmber : PALETTE.towerBeaconCoral, (1 - p) * 0.95);
        ctx.beginPath();
        ctx.arc(sx, sy, 1.5 + (1 - p) * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let fi = 0; fi < flares.length; fi += 1) {
        const fl = flares[fi];
        const p = clamp(fl.age / fl.life, 0, 1);
        const fx = (fl.x + (st.windGust * 0.09 + fl.dx) * p) * w;
        const fy = (fl.y - 0.24 * Math.sin(p * Math.PI * 0.88)) * h;
        if (p < 0.28) {
          ctx.fillStyle = hexToRgba(PALETTE.windowAmber, (0.28 - p) * 2.8);
          ctx.beginPath();
          ctx.arc(fl.x * w, fl.y * h, 5 + (p * 18), 0, Math.PI * 2);
          ctx.fill();
        }
        const fg = ctx.createRadialGradient(fx, fy, 1, fx, fy, 26);
        fg.addColorStop(0, hexToRgba(PALETTE.parchmentChalk, (1 - p * 0.5) * 0.95));
        fg.addColorStop(0.35, hexToRgba(PALETTE.signalFlareGreen, (1 - p * 0.4) * 0.85));
        fg.addColorStop(1, hexToRgba(PALETTE.signalFlareGreen, 0));
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(fx, fy, 26, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let pi = 0; pi < plumes.length; pi += 1) {
        const pl = plumes[pi];
        const p = clamp(pl.age / pl.life, 0, 1);
        const px = pl.x * w;
        const py = (pl.y - pl.th) * h;
        const lean = (0.015 + st.windGust * 0.045) * w;
        const ph = (0.045 + (1 - p) * 0.04) * h;
        ctx.fillStyle = hexToRgba(PALETTE.towerBeaconCoral, (1 - p) * 0.78);
        ctx.beginPath();
        ctx.moveTo(px - 4, py);
        ctx.quadraticCurveTo(px + lean * 0.5, py - ph, px + lean, py - ph * 1.15);
        ctx.quadraticCurveTo(px + lean * 0.35 + 5, py - ph * 0.45, px + 4, py);
        ctx.fill();
      }
      ctx.restore();
    }
    function drawEscarpmentAndWatchers(ctx, w, h, st) {
      ctx.save();
      const unit = Math.max(11, Math.min(w, h) * 0.022);
      const sway = (reducedMotion ? 0.35 : 0.35 + 0.25 * Math.sin(timeSec * 3.1)) * st.windGust * unit;

      for (let k = 0; k < WATCHERS.length; k += 1) {
        const wt = WATCHERS[k];
        if (wt.id === st.activeWatcherId) {
          ctx.save();
          ctx.setLineDash([4, 5]);
          ctx.strokeStyle = hexToRgba(PALETTE.parchmentChalk, 0.58);
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(wt.ledgeX * w, (wt.ledgeY - 0.035) * h);
          ctx.quadraticCurveTo(lerp(wt.ledgeX, wt.targetX, 0.5) * w, (wt.targetY - 0.05) * h, wt.targetX * w, wt.targetY * h);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.strokeStyle = hexToRgba(PALETTE.windowAmber, 0.75);
          ctx.beginPath();
          ctx.arc(wt.targetX * w, wt.targetY * h, 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      ctx.fillStyle = PALETTE.basaltLedge;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.72);
      ctx.lineTo(w * 0.24, h * 0.76);
      ctx.lineTo(w * 0.44, h * 0.82);
      ctx.lineTo(w * 0.68, h * 0.79);
      ctx.lineTo(w * 0.86, h * 0.73);
      ctx.lineTo(w, h * 0.70);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = hexToRgba(PALETTE.ridgeLavender, 0.52);
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = PALETTE.cragObsidian;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.80);
      ctx.lineTo(w * 0.21, h * 0.82);
      ctx.lineTo(w * 0.41, h * 0.87);
      ctx.lineTo(w * 0.66, h * 0.85);
      ctx.lineTo(w * 0.88, h * 0.79);
      ctx.lineTo(w, h * 0.77);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      for (let i = 0; i < WATCHERS.length; i += 1) {
        const wt = WATCHERS[i];
        const wx = wt.ledgeX * w;
        const wy = wt.ledgeY * h;
        const active = wt.id === st.activeWatcherId;
        ctx.save();
        if (active) {
          const halo = ctx.createRadialGradient(wx, wy - unit * 1.1, 2, wx, wy - unit * 1.1, unit * 2.4);
          halo.addColorStop(0, hexToRgba(PALETTE.windowAmber, 0.34));
          halo.addColorStop(1, hexToRgba(PALETTE.windowAmber, 0));
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(wx, wy - unit * 1.1, unit * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = PALETTE.cragObsidian;
        ctx.strokeStyle = active ? PALETTE.parchmentChalk : hexToRgba(PALETTE.ridgeLavender, 0.68);
        ctx.lineWidth = active ? 1.6 : 1.0;

        if (wt.propKind === "crook_and_flock") {
          ctx.fillRect(wx - unit * 1.5, wy - unit * 0.9, unit * 0.65, unit * 0.9);
          ctx.beginPath();
          ctx.arc(wx, wy - unit * 2.1, unit * 0.32, 0, Math.PI * 2);
          ctx.moveTo(wx - unit * 0.42, wy);
          ctx.lineTo(wx - unit * 0.30, wy - unit * 1.75);
          ctx.lineTo(wx + unit * 0.35, wy - unit * 1.75);
          ctx.lineTo(wx + unit * 0.46, wy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(wx + unit * 0.52, wy);
          ctx.lineTo(wx + unit * 0.58, wy - unit * 2.35);
          ctx.arc(wx + unit * 0.74, wy - unit * 2.35, unit * 0.16, Math.PI, 0);
          ctx.stroke();
          [-0.9, 0.95, 1.55].forEach(function (ox) {
            ctx.fillStyle = active ? hexToRgba(PALETTE.parchmentChalk, 0.72) : hexToRgba(PALETTE.milkyMistSponge, 0.45);
            ctx.beginPath();
            ctx.ellipse(wx + unit * ox, wy - unit * 0.24, unit * 0.34, unit * 0.20, 0, 0, Math.PI * 2);
            ctx.fill();
          });
        } else if (wt.propKind === "clap_nets") {
          ctx.beginPath();
          ctx.arc(wx - unit * 0.2, wy - unit * 1.35, unit * 0.30, 0, Math.PI * 2);
          ctx.moveTo(wx - unit * 0.65, wy);
          ctx.lineTo(wx - unit * 0.45, wy - unit * 1.05);
          ctx.lineTo(wx + unit * 0.18, wy - unit * 0.92);
          ctx.lineTo(wx + unit * 0.25, wy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(wx + unit * 0.45, wy - unit * 0.1);
          ctx.lineTo(wx + unit * 1.55, wy - unit * 0.85);
          ctx.lineTo(wx + unit * 1.75, wy - unit * 0.1);
          ctx.closePath();
          ctx.stroke();
        } else if (wt.propKind === "staff_and_basket") {
          ctx.beginPath();
          ctx.arc(wx - unit * 0.08, wy - unit * 1.95, unit * 0.31, 0, Math.PI * 2);
          ctx.moveTo(wx - unit * 0.45, wy);
          ctx.lineTo(wx - unit * 0.28, wy - unit * 1.62);
          ctx.lineTo(wx + unit * 0.26, wy - unit * 1.55);
          ctx.lineTo(wx + unit * 0.38, wy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(wx - unit * 0.62, wy);
          ctx.lineTo(wx - unit * 0.46, wy - unit * 2.25);
          ctx.stroke();
          ctx.fillRect(wx + unit * 0.55, wy - unit * 0.52, unit * 0.58, unit * 0.50);
          ctx.strokeRect(wx + unit * 0.55, wy - unit * 0.52, unit * 0.58, unit * 0.50);
        } else {
          ctx.beginPath();
          ctx.arc(wx, wy - unit * 2.15, unit * 0.33, 0, Math.PI * 2);
          ctx.moveTo(wx - unit * 0.40, wy);
          ctx.lineTo(wx - unit * 0.32, wy - unit * 1.80);
          ctx.lineTo(wx + unit * 0.34, wy - unit * 1.80);
          ctx.quadraticCurveTo(wx + unit * 0.95 + sway, wy - unit * 1.05, wx + unit * 0.75 + sway * 1.2, wy - unit * 0.12);
          ctx.lineTo(wx + unit * 0.28, wy);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.restore();
    }
    function drawDisenchantedCobbles(ctx, w, h, st, alpha) {
      ctx.save();
      ctx.globalAlpha = clamp(alpha, 0, 1);

      ctx.fillStyle = PALETTE.cragObsidian;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = PALETTE.localCobbleGrey;
      ctx.fillRect(w * 0.30, 0, w * 0.40, h * 0.44);
      ctx.fillStyle = hexToRgba(PALETTE.cragObsidian, 0.55);
      ctx.fillRect(w * 0.30, 0, w * 0.40, h * 0.44);

      ctx.fillStyle = PALETTE.basaltLedge;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(w * 0.32, h * 0.10);
      ctx.lineTo(w * 0.32, h * 0.46);
      ctx.lineTo(0, h * 0.68);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(w, 0);
      ctx.lineTo(w * 0.68, h * 0.10);
      ctx.lineTo(w * 0.68, h * 0.46);
      ctx.lineTo(w, h * 0.68);
      ctx.closePath();
      ctx.fill();

      const shutterRows = [0.16, 0.31];
      for (let sr = 0; sr < shutterRows.length; sr += 1) {
        const wy = h * shutterRows[sr];
        [0.09, 0.20, 0.75, 0.86].forEach(function (wxp) {
          const wx = w * wxp;
          const ww = w * 0.055;
          const wh = h * 0.085;
          ctx.fillStyle = PALETTE.cragObsidian;
          ctx.fillRect(wx, wy, ww, wh);
          ctx.strokeStyle = PALETTE.localCobbleGrey;
          ctx.lineWidth = 1.1;
          ctx.strokeRect(wx, wy, ww, wh);
          for (let bar = 1; bar <= 3; bar += 1) {
            const bx = wx + (ww * bar) / 4;
            ctx.beginPath();
            ctx.moveTo(bx, wy);
            ctx.lineTo(bx, wy + wh);
            ctx.stroke();
          }
        });
      }

      [0.20, 0.30].forEach(function (ry, idx) {
        ctx.strokeStyle = PALETTE.localCobbleGrey;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(w * 0.24, h * ry);
        ctx.quadraticCurveTo(w * 0.50, h * (ry + 0.055), w * 0.76, h * (ry + 0.01));
        ctx.stroke();
        for (let cl = 0; cl < 4; cl += 1) {
          const t = 0.22 + cl * 0.18;
          const cx = lerp(w * 0.24, w * 0.76, t) + (reducedMotion ? 0 : Math.sin(timeSec * 2 + cl + idx) * st.windGust * 4);
          const cy = h * (ry + 0.036 * Math.sin(t * Math.PI));
          ctx.fillStyle = cl % 2 === 0 ? PALETTE.localCobbleGrey : hexToRgba(PALETTE.parchmentChalk, 0.38);
          ctx.fillRect(cx, cy, w * 0.032, h * 0.042);
        }
      });

      ctx.fillStyle = PALETTE.localCobbleGrey;
      ctx.beginPath();
      ctx.moveTo(w * 0.32, h * 0.44);
      ctx.lineTo(w * 0.68, h * 0.44);
      ctx.lineTo(w, h * 0.68);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.lineTo(0, h * 0.68);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = PALETTE.basaltLedge;
      ctx.lineWidth = 1.1;
      for (let row = 0; row < 13; row += 1) {
        const t = row / 12;
        const y = lerp(h * 0.45, h * 0.99, t * t * 0.55 + t * 0.45);
        const xl = lerp(w * 0.31, 0, Math.min(1, t * 1.45));
        const xr = lerp(w * 0.69, w, Math.min(1, t * 1.45));
        ctx.beginPath();
        ctx.moveTo(xl, y);
        ctx.lineTo(xr, y);
        ctx.stroke();
        const cols = 7 + row;
        for (let c = 1; c < cols; c += 1) {
          const cx = lerp(xl, xr, (c + (row % 2) * 0.45) / cols);
          ctx.beginPath();
          ctx.moveTo(cx, y);
          ctx.lineTo(cx, y + h * (0.018 + t * 0.032));
          ctx.stroke();
        }
      }

      ctx.strokeStyle = PALETTE.cragObsidian;
      ctx.lineWidth = 3.2;
      [-0.08, 0, 0.08].forEach(function (off, idx) {
        ctx.lineWidth = idx === 1 ? 4.5 : 2.4;
        ctx.beginPath();
        ctx.moveTo(w * (0.50 + off * 0.45), h * 0.44);
        ctx.lineTo(w * (0.50 + off * 2.1), h);
        ctx.stroke();
      });

      [0.31, 0.69].forEach(function (lx) {
        const px = w * lx;
        const py = h * 0.38;
        const lg = ctx.createRadialGradient(px, py, 2, px, py + h * 0.08, w * 0.14);
        lg.addColorStop(0, hexToRgba(PALETTE.parchmentChalk, 0.26));
        lg.addColorStop(1, hexToRgba(PALETTE.parchmentChalk, 0));
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.arc(px, py + h * 0.04, w * 0.14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = PALETTE.parchmentChalk;
        ctx.fillRect(px - 2.5, py - 4, 5, 7);
      });

      if (waves.length + sparks.length + flares.length + plumes.length > 0) {
        ctx.strokeStyle = hexToRgba(PALETTE.parchmentChalk, 0.32);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(w * 0.50, h * 0.43, w * 0.045, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
    function emitSignal(signalId) {
      let spec = SIGNAL_TYPES[0];
      for (let i = 0; i < SIGNAL_TYPES.length; i += 1) {
        if (SIGNAL_TYPES[i].id === signalId) {
          spec = SIGNAL_TYPES[i];
          break;
        }
      }
      if (spec.id === "bass_drums_trumpets") {
        for (let r = 0; r < 4; r += 1) {
          waves.push({ x: spec.originX, y: spec.originY, age: r * 0.24, life: 2.2, ring: r });
        }
      } else if (spec.id === "firecrackers_crackle") {
        for (let s = 0; s < 16; s += 1) {
          const ang = (s / 16) * Math.PI * 2;
          const spd = 0.022 + (s % 4) * 0.011;
          sparks.push({
            x: spec.originX + ((s % 3) - 1) * 0.015,
            y: spec.originY - 0.01,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd * 0.65 - 0.025,
            age: 0.12,
            life: 1.35,
            warm: s % 2 === 0
          });
        }
      } else if (spec.id === "machinegun_flares") {
        flares.push({ x: spec.originX, y: spec.originY, dx: -0.02, age: 0.10, life: 2.3 });
        flares.push({ x: spec.originX + 0.035, y: spec.originY + 0.01, dx: 0.025, age: 0.36, life: 2.4 });
      } else {
        for (let t = 0; t < TOWER_COORDS.length; t += 1) {
          plumes.push({ x: TOWER_COORDS[t].x, y: TOWER_COORDS[t].y, th: TOWER_COORDS[t].h, age: 0.08, life: 2.5 });
        }
      }

      emittedCount += 1;
      lastEmittedSignalId = spec.id;
      audio.playSignal(spec.id, cachedState.windGust, cachedState.distanceFromHollow, cachedState.isStillIrene);
      if (onSignalEmitted) {
        onSignalEmitted({ signalId: spec.id, emittedCount: emittedCount, signal: spec });
      }
      return { signalId: spec.id, emittedCount: emittedCount };
    }

    function ageList(list, dt) {
      const next = [];
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i];
        item.age += dt;
        if (item.age < item.life) {
          next.push(item);
        }
      }
      return next;
    }

    function step(dtSec, paradoxState) {
      const dt = clamp(numOr(dtSec, 0.016), 0, 0.12);
      if (paradoxState) {
        cachedState = normalizeState(paradoxState);
        if (cachedState.isStillIrene !== prevIsStillIrene) {
          prevIsStillIrene = cachedState.isStillIrene;
          audio.playTransition(cachedState.isStillIrene);
        }
      }
      if (!reducedMotion) {
        timeSec += dt;
      }
      waves = ageList(waves, dt);
      sparks = ageList(sparks, dt);
      flares = ageList(flares, dt);
      plumes = ageList(plumes, dt);
    }

    function render(ctx, width, height, paradoxState) {
      if (!ctx || !(width > 0) || !(height > 0)) {
        return;
      }
      cachedState = normalizeState(paradoxState);
      ctx.save();
      if (cachedState.isStillIrene && cachedState.streetGridMorph < 0.999) {
        drawBrinkVista(ctx, width, height, cachedState);
        drawHollowMistAndSignals(ctx, width, height, cachedState);
        drawEscarpmentAndWatchers(ctx, width, height, cachedState);
      }
      if (!cachedState.isStillIrene || cachedState.streetGridMorph > 0.001) {
        const cobbleAlpha = cachedState.isStillIrene ? cachedState.streetGridMorph : 1;
        drawDisenchantedCobbles(ctx, width, height, cachedState, cobbleAlpha);
      }
      ctx.restore();
    }

    function hitTest(normX, normY, _width, _height, paradoxState) {
      const nx = numOr(normX, -1);
      const ny = numOr(normY, -1);
      if (nx < 0 || nx > 1 || ny < 0 || ny > 1) {
        return null;
      }
      const st = paradoxState ? normalizeState(paradoxState) : cachedState;
      if (!st.isStillIrene || st.streetGridMorph >= 0.75) {
        return null;
      }
      for (let i = 0; i < WATCHERS.length; i += 1) {
        const wt = WATCHERS[i];
        const dx = (nx - wt.ledgeX) / 0.068;
        const dy = (ny - (wt.ledgeY - 0.04)) / 0.085;
        if (dx * dx + dy * dy <= 1) {
          return { kind: "watcher", id: wt.id, watcher: wt };
        }
      }
      for (let t = 0; t < TOWER_COORDS.length; t += 1) {
        const tw = TOWER_COORDS[t];
        if (Math.abs(nx - tw.x) <= 0.034 && Math.abs(ny - (tw.y - tw.h * 0.5)) <= 0.05) {
          return { kind: "signal", signalId: "watchtower_beacons" };
        }
      }
      let bestSig = null;
      let bestDist = 1;
      for (let s = 0; s < SIGNAL_TYPES.length; s += 1) {
        const sig = SIGNAL_TYPES[s];
        const d = Math.hypot((nx - sig.originX) / 0.065, (ny - sig.originY) / 0.055);
        if (d <= 1 && d < bestDist) {
          bestDist = d;
          bestSig = sig;
        }
      }
      return bestSig ? { kind: "signal", signalId: bestSig.id } : null;
    }

    function getState() {
      return {
        emittedCount: emittedCount,
        activeParticleCount: waves.length + sparks.length + flares.length + plumes.length,
        lastEmittedSignalId: lastEmittedSignalId,
        muted: audio.isMuted(),
        audioUnlocked: audio.isUnlocked(),
        reducedMotion: reducedMotion
      };
    }

    function reset() {
      emittedCount = 0;
      lastEmittedSignalId = null;
      timeSec = 0;
      waves = [];
      sparks = [];
      flares = [];
      plumes = [];
      prevIsStillIrene = true;
      return getState();
    }

    function selectWatcher(watcherId) {
      for (let i = 0; i < WATCHERS.length; i += 1) {
        if (WATCHERS[i].id === watcherId) {
          cachedState = Object.assign({}, cachedState, { activeWatcherId: watcherId });
          if (onWatcherSelect) {
            onWatcherSelect(WATCHERS[i]);
          }
          return WATCHERS[i];
        }
      }
      return WATCHERS[0];
    }

    return {
      render: render,
      step: step,
      emitSignal: emitSignal,
      hitTest: hitTest,
      selectWatcher: selectWatcher,
      unlockAudio: audio.unlock,
      setMuted: audio.setMuted,
      toggleMute: audio.toggleMute,
      isMuted: audio.isMuted,
      playTransitionCue: audio.playTransition,
      setReducedMotion: function (flag) { reducedMotion = Boolean(flag); },
      getState: getState,
      reset: reset
    };
  }

  return Object.freeze({
    PALETTE: PALETTE,
    WATCHERS: WATCHERS,
    SIGNAL_TYPES: SIGNAL_TYPES,
    createPlateauRenderer: createPlateauRenderer
  });
})();

if (typeof window !== "undefined") {
  window.IrenePlateauSignals = globalThis.IrenePlateauSignals;
}
