/*
 * City 35: Eudoxia (Chapter VI - Cities and the Sky 1)
 * Layer: Symmetrical Sanctuary Carpet Loom & Pythagorean Oud Harmonics
 * Standalone classic IIFE script - zero external network or parent path references.
 */
(function () {
  "use strict";

  const TAU = Math.PI * 2;

  const LOCUS_IDS = [
    "mule_narrows",
    "soot_arch",
    "fish_steps",
    "blind_culdesac",
    "oracle_sanctuary",
    "landslide_ravine",
    "upper_hovels",
    "fire_cistern",
    "scream_threshold"
  ];

  const THREAD_PALETTE = {
    crimson: "#b92938",
    lapisIndigo: "#1b3474",
    magentaKnot: "#b9338a",
    goldWeft: "#d8a84c",
    lampblackGround: "#0d0b10",
    selvedgeIvory: "#eadcc3"
  };

  const THREAD_HEX_BY_NAME = {
    crimson: THREAD_PALETTE.crimson,
    indigo: THREAD_PALETTE.lapisIndigo,
    magenta: THREAD_PALETTE.magentaKnot
  };

  const THREAD_GLOW_BY_NAME = {
    crimson: "#eb5363",
    indigo: "#5889eb",
    magenta: "#e65eb8"
  };

  const CARPET_LOCI = [
    {
      index: 0, id: "mule_narrows",
      carpetTitle: "Crimson Warp Gate", streetTitle: "Alley of Packed Mules",
      u: 0.24, v: 0.80, xNorm: 0.20, yNorm: 0.84,
      threadColor: "crimson", hex: THREAD_PALETTE.crimson,
      enclosureType: "stepped_gate", oudHz: 220.0,
      constellationName: "Equus Sarcinarius", microWeaveGlyph: "pannier_knot",
      homeomorphicNote: "Twin crimson warp posts pinch where jostling mules wedge pack-to-pack"
    },
    {
      index: 1, id: "soot_arch",
      carpetTitle: "Northern Lapis Octagram", streetTitle: "Lintels of Black Smoke",
      u: 0.50, v: 0.22, xNorm: 0.31, yNorm: 0.29,
      threadColor: "indigo", hex: THREAD_PALETTE.lapisIndigo,
      enclosureType: "octagram_star", oudHz: 247.5,
      constellationName: "Fumus Niger", microWeaveGlyph: "soot_lintel",
      homeomorphicNote: "Eight-pointed lapis star ribs map blackened lintels funneling hearth smoke"
    },
    {
      index: 2, id: "fish_steps",
      carpetTitle: "Magenta Spiral Volute", streetTitle: "Brine & Fish-Smell Stairs",
      u: 0.24, v: 0.34, xNorm: 0.16, yNorm: 0.52,
      threadColor: "magenta", hex: THREAD_PALETTE.magentaKnot,
      enclosureType: "circular_volute", oudHz: 275.0,
      constellationName: "Pisces Salis", microWeaveGlyph: "brine_stairs",
      homeomorphicNote: "Coiled magenta weft volute matches salt-slick risers reeking of fish brine"
    },
    {
      index: 3, id: "blind_culdesac",
      carpetTitle: "Locked Lozenge Enclosure", streetTitle: "Dead-End Hovel Court",
      u: 0.76, v: 0.34, xNorm: 0.79, yNorm: 0.24,
      threadColor: "magenta", hex: THREAD_PALETTE.magentaKnot,
      enclosureType: "rhomboid_lozenge", oudHz: 293.33,
      constellationName: "Clausura Caeca", microWeaveGlyph: "sealed_court",
      homeomorphicNote: "Sealed four-sided magenta lozenge closes without exit like the blind court"
    },
    {
      index: 4, id: "oracle_sanctuary",
      carpetTitle: "Central Twelve-Ray Medallion", streetTitle: "Sanctuary of the Preserved Loom",
      u: 0.50, v: 0.50, xNorm: 0.51, yNorm: 0.53,
      threadColor: "crimson", hex: THREAD_PALETTE.crimson,
      enclosureType: "twelve_ray_medallion", oudHz: 330.0,
      constellationName: "Axis Augurii", microWeaveGlyph: "loom_omphalos",
      homeomorphicNote: "Twelve-rayed crimson-gold rosette mirrors the temple housing this carpet"
    },
    {
      index: 5, id: "landslide_ravine",
      carpetTitle: "Diagonal Crimson-Gold Fret", streetTitle: "Scarp of Crumbling Walls & Landslides",
      u: 0.76, v: 0.62, xNorm: 0.66, yNorm: 0.64,
      threadColor: "crimson", hex: THREAD_PALETTE.crimson,
      enclosureType: "chevron_fret", oudHz: 366.67,
      constellationName: "Ruina Lapidum", microWeaveGlyph: "falling_ashlar",
      homeomorphicNote: "Stepped crimson-gold fret locks the exact shear line of collapsing walls"
    },
    {
      index: 6, id: "upper_hovels",
      carpetTitle: "Twin Indigo Cartouche", streetTitle: "Stacked Slope Hovels",
      u: 0.24, v: 0.58, xNorm: 0.44, yNorm: 0.17,
      threadColor: "indigo", hex: THREAD_PALETTE.lapisIndigo,
      enclosureType: "twin_cartouche", oudHz: 412.5,
      constellationName: "Tuguria Superna", microWeaveGlyph: "tiered_roofs",
      homeomorphicNote: "Paired indigo cartouches stack vertically as slope hovels teeter roof-on-roof"
    },
    {
      index: 7, id: "fire_cistern",
      carpetTitle: "Southern Octagram Rosette", streetTitle: "Brazier Alley of Night Fires",
      u: 0.50, v: 0.78, xNorm: 0.58, yNorm: 0.82,
      threadColor: "crimson", hex: THREAD_PALETTE.crimson,
      enclosureType: "octagram_rosette", oudHz: 440.0,
      constellationName: "Fornax Noctis", microWeaveGlyph: "ember_basin",
      homeomorphicNote: "Radiant crimson rosette ring binds the cistern court lit by night braziers"
    },
    {
      index: 8, id: "scream_threshold",
      carpetTitle: "Magenta Fringe Selvedge", streetTitle: "Darkness of Night Screams",
      u: 0.76, v: 0.80, xNorm: 0.85, yNorm: 0.76,
      threadColor: "magenta", hex: THREAD_PALETTE.magentaKnot,
      enclosureType: "selvedge_knot", oudHz: 495.0,
      constellationName: "Clamor Tenebrarum", microWeaveGlyph: "jagged_selvedge",
      homeomorphicNote: "Taut magenta selvedge hitch quivers where sudden screams split the dark"
    }
  ];

  const LOCUS_BY_ID = Object.create(null);
  for (let i = 0; i < CARPET_LOCI.length; i += 1) {
    LOCUS_BY_ID[CARPET_LOCI[i].id] = CARPET_LOCI[i];
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function getLocusById(idOrIndex) {
    if (typeof idOrIndex === "number") {
      return CARPET_LOCI[clamp(idOrIndex | 0, 0, CARPET_LOCI.length - 1)] || null;
    }
    return LOCUS_BY_ID[String(idOrIndex || "")] || null;
  }

  function buildEnclosurePoints(locus) {
    const cu = locus.u;
    const cv = locus.v;
    const pts = [];
    const type = locus.enclosureType;
    if (type === "twelve_ray_medallion" || type === "octagram_star" || type === "octagram_rosette") {
      const spikes = type === "twelve_ray_medallion" ? 12 : 8;
      const rOuter = type === "twelve_ray_medallion" ? 0.088 : 0.072;
      const rInner = rOuter * 0.64;
      for (let i = 0; i < spikes * 2; i += 1) {
        const ang = (i * Math.PI) / spikes - Math.PI * 0.5;
        const r = i % 2 === 0 ? rOuter : rInner;
        pts.push({ u: cu + Math.cos(ang) * r * 1.12, v: cv + Math.sin(ang) * r * 0.88 });
      }
    } else if (type === "circular_volute") {
      for (let i = 0; i < 20; i += 1) {
        const ang = (i * TAU) / 20;
        pts.push({ u: cu + Math.cos(ang) * 0.068, v: cv + Math.sin(ang) * 0.056 });
      }
    } else if (type === "rhomboid_lozenge") {
      pts.push(
        { u: cu, v: cv - 0.062 },
        { u: cu + 0.074, v: cv },
        { u: cu, v: cv + 0.062 },
        { u: cu - 0.074, v: cv }
      );
    } else {
      const hw = 0.068;
      const hh = 0.052;
      const chamfer = 0.018;
      pts.push(
        { u: cu - hw + chamfer, v: cv - hh },
        { u: cu + hw - chamfer, v: cv - hh },
        { u: cu + hw, v: cv - hh + chamfer },
        { u: cu + hw, v: cv + hh - chamfer },
        { u: cu + hw - chamfer, v: cv + hh },
        { u: cu - hw + chamfer, v: cv + hh },
        { u: cu - hw, v: cv + hh - chamfer },
        { u: cu - hw, v: cv - hh + chamfer }
      );
    }
    return pts;
  }
  function computeGeometricRoute(fromId, toId) {
    const from = getLocusById(fromId) || CARPET_LOCI[0];
    const to = getLocusById(toId) || CARPET_LOCI[4];
    const threadColor = from.threadColor || "crimson";
    const hex = THREAD_HEX_BY_NAME[threadColor] || THREAD_PALETTE.crimson;
    const glowHex = THREAD_GLOW_BY_NAME[threadColor] || "#eb5363";
    const waypoints = [];
    const segmentKinds = [];
    const segments = [];
    let geometricLength = 0;

    if (from.id === to.id) {
      const r = 0.056;
      waypoints.push({ u: from.u, v: from.v }, { u: from.u + r, v: from.v });
      segments.push({ kind: "straight", u1: from.u, v1: from.v, u2: from.u + r, v2: from.v });
      segmentKinds.push("straight");
      for (let s = 1; s <= 16; s += 1) {
        const a = (s / 16) * TAU;
        waypoints.push({ u: from.u + Math.cos(a) * r, v: from.v + Math.sin(a) * r });
      }
      segments.push({ kind: "circular_arc", cu: from.u, cv: from.v, r: r, aStart: 0, aEnd: TAU });
      segmentKinds.push("circular_arc");
      waypoints.push({ u: from.u, v: from.v });
      segments.push({ kind: "straight", u1: from.u + r, v1: from.v, u2: from.u, v2: from.v });
      segmentKinds.push("straight");
      geometricLength = Number((2 * r + TAU * r).toFixed(4));
      return {
        fromId: from.id, toId: to.id, threadColor, hex, glowHex,
        waypoints, segmentKinds, segments, geometricLength, isStraightOrCircular: true
      };
    }

    const midV = (from.v + to.v) * 0.5;
    let hubV = 0.50;
    let ringR = 0.084;
    if (from.id !== "oracle_sanctuary" && to.id !== "oracle_sanctuary" && Math.abs(from.v - to.v) <= 0.28) {
      if (midV < 0.38) { hubV = 0.22; ringR = 0.072; }
      else if (midV > 0.66) { hubV = 0.78; ringR = 0.072; }
    }
    const hubU = 0.50;
    const d1u = from.u - hubU;
    const d1v = from.v - hubV;
    const d2u = to.u - hubU;
    const d2v = to.v - hubV;
    const a1 = Math.hypot(d1u, d1v) < 0.01 ? -Math.PI * 0.5 : Math.atan2(d1v, d1u);
    let a2 = Math.hypot(d2u, d2v) < 0.01 ? a1 + Math.PI * 0.5 : Math.atan2(d2v, d2u);
    let da = a2 - a1;
    while (da > Math.PI) da -= TAU;
    while (da < -Math.PI) da += TAU;
    if (Math.abs(da) < 0.38) {
      da = da >= 0 ? Math.PI * 0.5 : -Math.PI * 0.5;
    }
    a2 = a1 + da;

    const entryU = hubU + Math.cos(a1) * ringR;
    const entryV = hubV + Math.sin(a1) * ringR;
    const exitU = hubU + Math.cos(a2) * ringR;
    const exitV = hubV + Math.sin(a2) * ringR;

    waypoints.push({ u: from.u, v: from.v }, { u: entryU, v: entryV });
    segments.push({ kind: "straight", u1: from.u, v1: from.v, u2: entryU, v2: entryV });
    segmentKinds.push("straight");
    geometricLength += Math.hypot(entryU - from.u, entryV - from.v);

    const arcSteps = 14;
    for (let s = 1; s <= arcSteps; s += 1) {
      const ang = a1 + (da * s) / arcSteps;
      waypoints.push({ u: hubU + Math.cos(ang) * ringR, v: hubV + Math.sin(ang) * ringR });
    }
    segments.push({ kind: "circular_arc", cu: hubU, cv: hubV, r: ringR, aStart: a1, aEnd: a2 });
    segmentKinds.push("circular_arc");
    geometricLength += Math.abs(da) * ringR;

    waypoints.push({ u: to.u, v: to.v });
    segments.push({ kind: "straight", u1: exitU, v1: exitV, u2: to.u, v2: to.v });
    segmentKinds.push("straight");
    geometricLength += Math.hypot(to.u - exitU, to.v - exitV);

    return {
      fromId: from.id, toId: to.id, threadColor, hex, glowHex,
      waypoints, segmentKinds, segments,
      geometricLength: Number(geometricLength.toFixed(4)),
      isStraightOrCircular: true
    };
  }

  function computeLayout(width, height, zoomLevel, focusU, focusV) {
    const w = Math.max(120, Number(width) || 560);
    const h = Math.max(120, Number(height) || 640);
    const padX = Math.max(18, w * 0.075);
    const padTop = Math.max(28, h * 0.088);
    const padBot = Math.max(22, h * 0.068);
    const availW = Math.max(80, w - padX * 2);
    const availH = Math.max(80, h - padTop - padBot);
    const rw = Math.min(availW, Math.max(availW * 0.78, availH * 0.78));
    const rh = availH;
    const rx = (w - rw) * 0.5;
    const ry = padTop;

    const zoom = clamp(Number(zoomLevel) || 1.0, 1.0, 4.2);
    const panBlend = clamp((zoom - 1.0) / 0.6, 0, 1);
    const anchorU = lerp(0.5, clamp(focusU, 0.1, 0.9), panBlend);
    const anchorV = lerp(0.5, clamp(focusV, 0.1, 0.9), panBlend);
    const anchorBaseX = rx + anchorU * rw;
    const anchorBaseY = ry + anchorV * rh;
    const targetScreenX = rx + 0.5 * rw;
    const targetScreenY = ry + 0.5 * rh;

    return {
      w, h, rx, ry, rw, rh, zoom, anchorBaseX, anchorBaseY, targetScreenX, targetScreenY,
      uvToScreen(u, v) {
        const wx = rx + u * rw;
        const wy = ry + v * rh;
        return {
          x: targetScreenX + (wx - anchorBaseX) * zoom,
          y: targetScreenY + (wy - anchorBaseY) * zoom
        };
      },
      screenToUV(px, py) {
        const wx = anchorBaseX + (px - targetScreenX) / zoom;
        const wy = anchorBaseY + (py - targetScreenY) / zoom;
        return { u: (wx - rx) / rw, v: (wy - ry) / rh };
      }
    };
  }

  function createLoomAudio() {
    let audioCtx = null;
    let masterGain = null;
    let pluckBuffer = null;
    let muted = false;
    let unlocked = false;

    function ensureNoiseBuffer(ctx) {
      if (pluckBuffer) return pluckBuffer;
      const len = Math.max(64, Math.floor(ctx.sampleRate * 0.028));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < len; i += 1) {
        ch[i] = ((Math.sin(i * 12.9898) * 43758.5453) % 1) * (1 - i / len);
      }
      pluckBuffer = buf;
      return buf;
    }

    function playNoteAt(hz, delaySec, durationSec, peakGain) {
      if (!audioCtx || !masterGain || muted) return false;
      try {
        const t0 = audioCtx.currentTime + (delaySec || 0);
        const dur = durationSec || 0.72;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.linearRampToValueAtTime(peakGain || 0.085, t0 + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        gain.connect(masterGain);

        const oscFund = audioCtx.createOscillator();
        oscFund.type = "triangle";
        oscFund.frequency.setValueAtTime(hz, t0);
        oscFund.connect(gain);
        oscFund.start(t0);
        oscFund.stop(t0 + dur + 0.02);

        const overtoneGain = audioCtx.createGain();
        overtoneGain.gain.setValueAtTime((peakGain || 0.085) * 0.34, t0);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur * 0.55);
        overtoneGain.connect(masterGain);

        const oscOct = audioCtx.createOscillator();
        oscOct.type = "sine";
        oscOct.frequency.setValueAtTime(hz * 2, t0);
        oscOct.connect(overtoneGain);
        oscOct.start(t0);
        oscOct.stop(t0 + dur * 0.6);

        const burst = audioCtx.createBufferSource();
        burst.buffer = ensureNoiseBuffer(audioCtx);
        const bp = audioCtx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.setValueAtTime(Math.min(3200, hz * 3.5), t0);
        bp.Q.setValueAtTime(4.2, t0);
        const bGain = audioCtx.createGain();
        bGain.gain.setValueAtTime((peakGain || 0.085) * 0.45, t0);
        bGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.032);
        burst.connect(bp);
        bp.connect(bGain);
        bGain.connect(masterGain);
        burst.start(t0);
        return true;
      } catch (_err) {
        return false;
      }
    }

    return {
      unlockAudio() {
        try {
          const Ctor = globalThis.AudioContext || globalThis.webkitAudioContext;
          if (!Ctor) return false;
          if (!audioCtx) {
            audioCtx = new Ctor();
            masterGain = audioCtx.createGain();
            masterGain.gain.value = muted ? 0 : 0.85;
            masterGain.connect(audioCtx.destination);
          }
          if (audioCtx.state === "suspended" && typeof audioCtx.resume === "function") {
            audioCtx.resume();
          }
          unlocked = true;
          return true;
        } catch (_e) {
          return false;
        }
      },
      setMuted(flag) {
        muted = Boolean(flag);
        if (masterGain && audioCtx) {
          masterGain.gain.setValueAtTime(muted ? 0 : 0.85, audioCtx.currentTime);
        }
        return muted;
      },
      isMuted() { return muted; },
      isUnlocked() { return unlocked; },
      getAudioContext() { return audioCtx; },
      pluckThread(locusId) {
        const locus = getLocusById(locusId) || CARPET_LOCI[4];
        return playNoteAt(locus.oudHz, 0, 0.78, 0.09);
      },
      playRouteCadence(fromId, toId) {
        if (!audioCtx || muted) return false;
        const a = getLocusById(fromId) || CARPET_LOCI[0];
        const b = getLocusById(toId) || CARPET_LOCI[4];
        const fifthHz = clamp(((a.oudHz + b.oudHz) * 0.5) * 1.125, 220, 660);
        playNoteAt(a.oudHz, 0.0, 0.62, 0.075);
        playNoteAt(fifthHz, 0.11, 0.62, 0.068);
        return playNoteAt(b.oudHz, 0.23, 0.85, 0.088);
      },
      playOracleChord(mode) {
        if (!audioCtx || !masterGain || muted) return false;
        const freqs = mode === "stain_cosmos"
          ? [247.5, 330.0, 464.06, 550.0]
          : [220.0, 330.0, 440.0, 660.0];
        const wave = mode === "stain_cosmos" ? "sine" : "triangle";
        try {
          const t0 = audioCtx.currentTime;
          for (let i = 0; i < freqs.length; i += 1) {
            const g = audioCtx.createGain();
            g.gain.setValueAtTime(0.0001, t0 + i * 0.045);
            g.gain.linearRampToValueAtTime(0.042, t0 + i * 0.045 + 0.09);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.35);
            g.connect(masterGain);
            const o = audioCtx.createOscillator();
            o.type = wave;
            o.frequency.setValueAtTime(freqs[i], t0 + i * 0.045);
            o.connect(g);
            o.start(t0 + i * 0.045);
            o.stop(t0 + 1.4);
          }
          return true;
        } catch (_e) {
          return false;
        }
      }
    };
  }
  function drawHardwareAndBorders(ctx, lay, state) {
    const { rx, ry, rw, rh } = lay;
    const rodY = ry - 15;
    const rodLeft = rx - 16;
    const rodRight = rx + rw + 16;

    const candlePulse = 0.88 + 0.12 * Math.sin(state.time * 2.1);
    const lampGrad = ctx.createRadialGradient(
      rx + rw * 0.5, ry - 26, 8,
      rx + rw * 0.5, ry + rh * 0.35, rw * 0.92
    );
    lampGrad.addColorStop(0, "rgba(232, 188, 98, " + (0.20 * candlePulse).toFixed(3) + ")");
    lampGrad.addColorStop(0.55, "rgba(185, 41, 56, 0.06)");
    lampGrad.addColorStop(1, "rgba(13, 11, 16, 0)");
    ctx.fillStyle = lampGrad;
    ctx.fillRect(rx - 44, ry - 48, rw + 88, rh + 96);

    ctx.strokeStyle = "rgba(216, 168, 76, 0.48)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(rx + rw * 0.18, ry - 44);
    ctx.lineTo(rx + rw * 0.18, rodY);
    ctx.moveTo(rx + rw * 0.82, ry - 44);
    ctx.lineTo(rx + rw * 0.82, rodY);
    ctx.stroke();

    const rodGrad = ctx.createLinearGradient(0, rodY - 4, 0, rodY + 4);
    rodGrad.addColorStop(0, "#f2d68b");
    rodGrad.addColorStop(0.5, THREAD_PALETTE.goldWeft);
    rodGrad.addColorStop(1, "#7c5a20");
    ctx.fillStyle = rodGrad;
    ctx.fillRect(rodLeft, rodY - 3.2, rodRight - rodLeft, 6.4);

    ctx.fillStyle = THREAD_PALETTE.goldWeft;
    ctx.beginPath();
    ctx.arc(rodLeft - 4, rodY, 5.2, 0, TAU);
    ctx.arc(rodRight + 4, rodY, 5.2, 0, TAU);
    ctx.fill();

    const fringeCount = 34;
    ctx.strokeStyle = THREAD_PALETTE.selvedgeIvory;
    ctx.lineWidth = 1.15;
    for (let i = 0; i <= fringeCount; i += 1) {
      const fx = rx + (rw * i) / fringeCount;
      const sway = Math.sin(state.time * 1.4 + i * 0.5) * 1.1;
      ctx.beginPath();
      ctx.moveTo(fx, rodY + 3);
      ctx.lineTo(fx, ry);
      ctx.moveTo(fx, ry + rh);
      ctx.lineTo(fx + sway, ry + rh + 14 + (i % 2) * 3);
      ctx.stroke();
      ctx.fillStyle = i % 3 === 0 ? THREAD_PALETTE.magentaKnot : THREAD_PALETTE.selvedgeIvory;
      ctx.fillRect(fx - 1.2, ry - 2.5, 2.4, 2.4);
      ctx.fillRect(fx - 1.2, ry + rh + 1.5, 2.4, 2.4);
    }

    ctx.fillStyle = "#120f1c";
    ctx.fillRect(rx - 3, ry - 3, rw + 6, rh + 6);
    ctx.strokeStyle = THREAD_PALETTE.selvedgeIvory;
    ctx.lineWidth = 2.0;
    ctx.strokeRect(rx, ry, rw, rh);

    const b1 = Math.min(rw, rh) * 0.026;
    const b2 = Math.min(rw, rh) * 0.072;
    const b3 = Math.min(rw, rh) * 0.096;

    ctx.strokeStyle = THREAD_PALETTE.magentaKnot;
    ctx.lineWidth = Math.max(2, b1 * 0.72);
    ctx.strokeRect(rx + b1 * 0.5, ry + b1 * 0.5, rw - b1, rh - b1);

    ctx.fillStyle = THREAD_PALETTE.crimson;
    ctx.fillRect(rx + b1, ry + b1, rw - b1 * 2, rh - b1 * 2);

    const fieldGrad = ctx.createRadialGradient(
      rx + rw * 0.5, ry + rh * 0.5, rw * 0.05,
      rx + rw * 0.5, ry + rh * 0.5, rw * 0.72
    );
    fieldGrad.addColorStop(0, "#1f3c86");
    fieldGrad.addColorStop(0.62, THREAD_PALETTE.lapisIndigo);
    fieldGrad.addColorStop(1, "#0f1c42");
    ctx.fillStyle = fieldGrad;
    ctx.fillRect(rx + b2, ry + b2, rw - b2 * 2, rh - b2 * 2);

    ctx.strokeStyle = THREAD_PALETTE.magentaKnot;
    ctx.lineWidth = Math.max(1.8, (b3 - b2) * 0.7);
    ctx.strokeRect(rx + b2, ry + b2, rw - b2 * 2, rh - b2 * 2);
    ctx.strokeStyle = THREAD_PALETTE.goldWeft;
    ctx.lineWidth = 1.0;
    ctx.strokeRect(rx + b3, ry + b3, rw - b3 * 2, rh - b3 * 2);

    const borderMid = (b1 + b2) * 0.5;
    const stepCountX = 14;
    const stepCountY = 18;
    ctx.strokeStyle = THREAD_PALETTE.goldWeft;
    ctx.lineWidth = 1.1;
    for (let i = 1; i < stepCountX; i += 1) {
      const mx = rx + (rw * i) / stepCountX;
      const d = (b2 - b1) * 0.32;
      for (let side = 0; side < 2; side += 1) {
        const my = side === 0 ? ry + borderMid : ry + rh - borderMid;
        ctx.beginPath();
        ctx.moveTo(mx - d, my);
        ctx.lineTo(mx, my - d);
        ctx.lineTo(mx + d, my);
        ctx.lineTo(mx, my + d);
        ctx.closePath();
        ctx.stroke();
      }
    }
    for (let j = 1; j < stepCountY; j += 1) {
      const my = ry + (rh * j) / stepCountY;
      const d = (b2 - b1) * 0.32;
      for (let side = 0; side < 2; side += 1) {
        const mx = side === 0 ? rx + borderMid : rx + rw - borderMid;
        ctx.beginPath();
        ctx.moveTo(mx - d, my);
        ctx.lineTo(mx, my - d);
        ctx.lineTo(mx + d, my);
        ctx.lineTo(mx, my + d);
        ctx.closePath();
        ctx.stroke();
      }
    }

    const sp = Math.min(rw, rh) * 0.085;
    const corners = [
      [rx + b3, ry + b3, 1, 1],
      [rx + rw - b3, ry + b3, -1, 1],
      [rx + b3, ry + rh - b3, 1, -1],
      [rx + rw - b3, ry + rh - b3, -1, -1]
    ];
    for (let c = 0; c < corners.length; c += 1) {
      const [cx, cy, sx, sy] = corners[c];
      ctx.fillStyle = "rgba(185, 41, 56, 0.78)";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + sx * sp, cy);
      ctx.lineTo(cx + sx * sp * 0.45, cy + sy * sp * 0.45);
      ctx.lineTo(cx, cy + sy * sp);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = THREAD_PALETTE.goldWeft;
      ctx.lineWidth = 1.0;
      ctx.stroke();
    }
  }

  function drawCarpetGeometryAndLoci(ctx, lay, state) {
    const { rx, ry, rw, rh } = lay;
    const px = (u) => rx + u * rw;
    const py = (v) => ry + v * rh;

    const rails = [
      [0.24, 0.22, 0.24, 0.80, THREAD_PALETTE.crimson],
      [0.76, 0.22, 0.76, 0.80, THREAD_PALETTE.magentaKnot],
      [0.50, 0.14, 0.50, 0.86, THREAD_PALETTE.goldWeft],
      [0.24, 0.34, 0.76, 0.34, THREAD_PALETTE.magentaKnot],
      [0.24, 0.80, 0.76, 0.80, THREAD_PALETTE.crimson],
      [0.24, 0.34, 0.50, 0.22, "#4f7fe3"],
      [0.76, 0.34, 0.50, 0.22, "#4f7fe3"],
      [0.24, 0.58, 0.50, 0.50, "#4f7fe3"],
      [0.76, 0.62, 0.50, 0.50, THREAD_PALETTE.crimson],
      [0.24, 0.80, 0.50, 0.78, THREAD_PALETTE.crimson],
      [0.76, 0.80, 0.50, 0.78, THREAD_PALETTE.magentaKnot]
    ];
    for (let i = 0; i < rails.length; i += 1) {
      const [u1, v1, u2, v2, col] = rails[i];
      ctx.strokeStyle = col;
      ctx.globalAlpha = 0.68;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px(u1), py(v1));
      ctx.lineTo(px(u2), py(v2));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    const hubs = [
      { v: 0.22, r: 0.072, col: "#4576de", fill: "rgba(27, 52, 116, 0.82)" },
      { v: 0.50, r: 0.084, col: THREAD_PALETTE.crimson, fill: "rgba(185, 41, 56, 0.36)" },
      { v: 0.78, r: 0.072, col: THREAD_PALETTE.crimson, fill: "rgba(185, 41, 56, 0.28)" }
    ];
    for (let h = 0; h < hubs.length; h += 1) {
      const hub = hubs[h];
      ctx.save();
      ctx.translate(px(0.50), py(hub.v));
      ctx.scale(rw, rh);
      ctx.beginPath();
      ctx.arc(0, 0, hub.r, 0, TAU);
      ctx.fillStyle = hub.fill;
      ctx.fill();
      ctx.lineWidth = 1.6 / Math.min(rw, rh);
      ctx.strokeStyle = hub.col;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, hub.r * 0.68, 0, TAU);
      ctx.strokeStyle = THREAD_PALETTE.goldWeft;
      ctx.lineWidth = 1.0 / Math.min(rw, rh);
      ctx.stroke();
      ctx.restore();
    }

    for (let i = 0; i < CARPET_LOCI.length; i += 1) {
      const locus = CARPET_LOCI[i];
      const pts = buildEnclosurePoints(locus);
      const isSel = state.selectedLocusId === locus.id;
      const isHov = state.hoveredLocusId === locus.id;
      const strokeCol = locus.threadColor === "indigo" ? "#5688ec" : locus.hex;

      ctx.beginPath();
      for (let p = 0; p < pts.length; p += 1) {
        const sx = px(pts[p].u);
        const sy = py(pts[p].v);
        if (p === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fillStyle = locus.threadColor === "indigo"
        ? "rgba(27, 52, 116, 0.84)"
        : locus.threadColor === "magenta"
          ? "rgba(185, 51, 138, 0.30)"
          : "rgba(185, 41, 56, 0.34)";
      ctx.fill();
      ctx.lineWidth = isSel ? 2.6 : isHov ? 2.1 : 1.45;
      ctx.strokeStyle = isSel ? THREAD_PALETTE.goldWeft : strokeCol;
      ctx.stroke();

      const cx = px(locus.u);
      const cy = py(locus.v);
      const glyphR = Math.min(rw, rh) * 0.026;
      ctx.save();
      ctx.strokeStyle = THREAD_PALETTE.goldWeft;
      ctx.lineWidth = 1.05;
      ctx.beginPath();
      if (locus.microWeaveGlyph === "brine_stairs") {
        for (let s = -2; s <= 1; s += 1) {
          ctx.moveTo(cx + s * glyphR * 0.45, cy - s * glyphR * 0.35);
          ctx.lineTo(cx + (s + 1) * glyphR * 0.45, cy - s * glyphR * 0.35);
          ctx.lineTo(cx + (s + 1) * glyphR * 0.45, cy - (s + 1) * glyphR * 0.35);
        }
      } else if (locus.microWeaveGlyph === "sealed_court") {
        ctx.rect(cx - glyphR * 0.65, cy - glyphR * 0.55, glyphR * 1.3, glyphR * 1.1);
        ctx.moveTo(cx, cy + glyphR * 0.55);
        ctx.lineTo(cx, cy);
      } else if (locus.microWeaveGlyph === "falling_ashlar") {
        ctx.moveTo(cx - glyphR * 0.7, cy - glyphR * 0.5);
        ctx.lineTo(cx + glyphR * 0.7, cy + glyphR * 0.5);
        ctx.rect(cx - glyphR * 0.25, cy - glyphR * 0.55, glyphR * 0.45, glyphR * 0.38);
      } else if (locus.microWeaveGlyph === "tiered_roofs") {
        for (let t = -1; t <= 1; t += 1) {
          ctx.moveTo(cx - glyphR * 0.6, cy + t * glyphR * 0.42);
          ctx.lineTo(cx, cy + t * glyphR * 0.42 - glyphR * 0.3);
          ctx.lineTo(cx + glyphR * 0.6, cy + t * glyphR * 0.42);
        }
      } else if (locus.microWeaveGlyph === "jagged_selvedge") {
        ctx.moveTo(cx - glyphR * 0.75, cy);
        for (let z = -2; z <= 2; z += 1) {
          ctx.lineTo(cx + z * glyphR * 0.3, cy + (z % 2 === 0 ? -glyphR * 0.55 : glyphR * 0.55));
        }
      } else {
        ctx.arc(cx, cy, glyphR * 0.72, 0, TAU);
      }
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = strokeCol;
      ctx.beginPath();
      ctx.arc(cx, cy, isSel ? 5.2 : 3.8, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = THREAD_PALETTE.selvedgeIvory;
      ctx.lineWidth = 1.0;
      ctx.stroke();

      if (isSel || isHov) {
        const segTotal = pts.length;
        const pos = ((state.fingerPhase * segTotal) % segTotal + segTotal) % segTotal;
        const idxA = Math.floor(pos);
        const idxB = (idxA + 1) % segTotal;
        const frac = pos - idxA;
        const fu = lerp(pts[idxA].u, pts[idxB].u, frac);
        const fv = lerp(pts[idxA].v, pts[idxB].v, frac);
        const fx = px(fu);
        const fy = py(fv);
        ctx.fillStyle = THREAD_PALETTE.selvedgeIvory;
        ctx.shadowColor = THREAD_PALETTE.goldWeft;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(fx, fy, 3.6, 0, TAU);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }
  function drawActiveRouteAndCosmology(ctx, lay, state) {
    const { rx, ry, rw, rh } = lay;
    const px = (u) => rx + u * rw;
    const py = (v) => ry + v * rh;
    const route = state.activeRoute;

    if (route && route.segments && route.segments.length) {
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let pass = 0; pass < 2; pass += 1) {
        ctx.strokeStyle = pass === 0 ? "rgba(234, 220, 195, 0.36)" : (route.glowHex || route.hex);
        ctx.lineWidth = pass === 0 ? 5.2 : 2.5;
        for (let s = 0; s < route.segments.length; s += 1) {
          const seg = route.segments[s];
          ctx.beginPath();
          if (seg.kind === "circular_arc") {
            ctx.save();
            ctx.translate(px(seg.cu), py(seg.cv));
            ctx.scale(rw, rh);
            ctx.arc(0, 0, seg.r, seg.aStart, seg.aEnd, seg.aEnd < seg.aStart);
            ctx.restore();
          } else {
            ctx.moveTo(px(seg.u1), py(seg.v1));
            ctx.lineTo(px(seg.u2), py(seg.v2));
          }
          ctx.stroke();
        }
      }
      const wps = route.waypoints;
      if (wps && wps.length > 1) {
        const idxPos = ((state.routePulse * (wps.length - 1)) % (wps.length - 1) + (wps.length - 1)) % (wps.length - 1);
        const i0 = Math.floor(idxPos);
        const i1 = Math.min(wps.length - 1, i0 + 1);
        const t = idxPos - i0;
        const bx = px(lerp(wps[i0].u, wps[i1].u, t));
        const by = py(lerp(wps[i0].v, wps[i1].v, t));
        ctx.fillStyle = THREAD_PALETTE.selvedgeIvory;
        ctx.beginPath();
        ctx.arc(bx, by, 4.0, 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }

    const skyAlpha = clamp(1 - state.oracleAngle * 1.22, 0, 1);
    if (skyAlpha > 0.02) {
      const liftX = state.oracleAngle * rw * 0.09;
      const liftY = -state.oracleAngle * rh * 0.06;
      ctx.save();
      ctx.globalAlpha = skyAlpha;
      const orbitCenters = [
        { v: 0.22, r: 0.095, speed: 0.55 },
        { v: 0.50, r: 0.135, speed: -0.38 },
        { v: 0.78, r: 0.095, speed: 0.62 }
      ];
      for (let o = 0; o < orbitCenters.length; o += 1) {
        const oc = orbitCenters[o];
        const cx = px(0.50) + liftX;
        const cy = py(oc.v) + liftY;
        const rad = oc.r * Math.min(rw, rh);
        ctx.strokeStyle = "rgba(216, 168, 76, 0.65)";
        ctx.setLineDash([4, 3]);
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, TAU);
        ctx.stroke();
        ctx.setLineDash([]);
        const ang = state.orbitPhase * oc.speed + o * 1.7;
        const ex = cx + Math.cos(ang) * rad;
        const ey = cy + Math.sin(ang) * rad;
        ctx.strokeStyle = "rgba(234, 220, 195, 0.62)";
        ctx.beginPath();
        ctx.arc(ex, ey, rad * 0.20, 0, TAU);
        ctx.stroke();
        ctx.fillStyle = THREAD_PALETTE.goldWeft;
        ctx.beginPath();
        ctx.arc(ex + Math.cos(ang * 2.4) * rad * 0.20, ey + Math.sin(ang * 2.4) * rad * 0.20, 2.7, 0, TAU);
        ctx.fill();
      }
      for (let i = 0; i < CARPET_LOCI.length; i += 1) {
        const loc = CARPET_LOCI[i];
        const sx = px(loc.u) + liftX;
        const sy = py(loc.v) + liftY;
        const tw = 2.5 + 1.1 * Math.sin(state.time * 3.1 + i);
        ctx.strokeStyle = THREAD_PALETTE.selvedgeIvory;
        ctx.lineWidth = 0.95;
        ctx.beginPath();
        ctx.moveTo(sx - tw * 2, sy); ctx.lineTo(sx + tw * 2, sy);
        ctx.moveTo(sx, sy - tw * 2); ctx.lineTo(sx, sy + tw * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    const humanAlpha = clamp((state.oracleAngle - 0.35) / 0.65, 0, 1);
    if (humanAlpha > 0.02) {
      ctx.save();
      ctx.globalAlpha = humanAlpha * 0.78;
      ctx.strokeStyle = "rgba(234, 220, 195, 0.55)";
      ctx.setLineDash([2, 4]);
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(px(0.50), ry - 6); ctx.lineTo(px(0.50), ry + rh + 6);
      ctx.moveTo(rx - 6, py(0.50)); ctx.lineTo(rx + rw + 6, py(0.50));
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = THREAD_PALETTE.selvedgeIvory;
      ctx.font = "600 9px monospace";
      ctx.textAlign = "center";
      ctx.fillText("PLUMB AXIS · 144x216 KNOTS (APPROXIMATE HUMAN WORK)", px(0.50), ry + rh - 7);
      ctx.restore();
    }

    if (state.isMicroWeaveVisible) {
      const knotAlpha = clamp((lay.zoom - 1.5) / 0.9, 0.18, 0.88);
      ctx.save();
      ctx.globalAlpha = knotAlpha * 0.42;
      ctx.strokeStyle = THREAD_PALETTE.selvedgeIvory;
      ctx.lineWidth = 0.45;
      for (let gx = 10; gx < 90; gx += 2) {
        const x = px(gx / 100);
        ctx.beginPath(); ctx.moveTo(x, py(0.10)); ctx.lineTo(x, py(0.90)); ctx.stroke();
      }
      for (let gy = 10; gy < 90; gy += 2) {
        const y = py(gy / 100);
        ctx.beginPath(); ctx.moveTo(px(0.10), y); ctx.lineTo(px(0.90), y); ctx.stroke();
      }
      ctx.globalAlpha = clamp((lay.zoom - 1.55) / 0.7, 0.3, 0.96);
      const inv = 1 / Math.pow(lay.zoom, 0.72);
      for (let i = 0; i < CARPET_LOCI.length; i += 1) {
        const loc = CARPET_LOCI[i];
        const lx = px(loc.u);
        const ly = py(loc.v);
        const dir = loc.u > 0.62 ? -1 : 1;
        const tagX = lx + dir * 20 * inv;
        const tagY = ly - 14 * inv;
        ctx.strokeStyle = THREAD_PALETTE.goldWeft;
        ctx.lineWidth = 1.0 * inv;
        ctx.beginPath();
        ctx.moveTo(lx, ly);
        ctx.lineTo(tagX, tagY);
        ctx.stroke();
        const boxW = 116 * inv;
        const boxH = 22 * inv;
        const bx = dir > 0 ? tagX : tagX - boxW;
        ctx.fillStyle = "rgba(234, 220, 195, 0.94)";
        ctx.fillRect(bx, tagY - boxH * 0.5, boxW, boxH);
        ctx.strokeStyle = loc.hex;
        ctx.strokeRect(bx, tagY - boxH * 0.5, boxW, boxH);
        ctx.fillStyle = THREAD_PALETTE.lampblackGround;
        ctx.font = "700 " + (8.2 * inv).toFixed(2) + "px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("#" + (i + 1) + " -> " + loc.streetTitle, bx + 3 * inv, tagY - 1.2 * inv);
        ctx.font = "500 " + (6.8 * inv).toFixed(2) + "px monospace";
        ctx.fillText(loc.constellationName, bx + 3 * inv, tagY + 7.2 * inv);
      }
      ctx.restore();
    }
  }
  function createCarpetLoom(opts) {
    const options = opts || {};
    const audio = createLoomAudio();
    let inSelectCb = false;
    let inRouteCb = false;
    let inZoomCb = false;

    const state = {
      zoomLevel: 1.0,
      focusU: 0.5,
      focusV: 0.5,
      isMicroWeaveVisible: false,
      selectedLocusId: "oracle_sanctuary",
      hoveredLocusId: null,
      activeRoute: computeGeometricRoute("mule_narrows", "oracle_sanctuary"),
      oracleAngle: 0.0,
      cosmosMode: "carpet_cosmos",
      time: 0,
      fingerPhase: 0,
      routePulse: 0,
      orbitPhase: 0,
      lastWidth: 560,
      lastHeight: 640
    };

    function getState() {
      return {
        zoomLevel: state.zoomLevel,
        focusU: state.focusU,
        focusV: state.focusV,
        isMicroWeaveVisible: state.isMicroWeaveVisible,
        selectedLocusId: state.selectedLocusId,
        hoveredLocusId: state.hoveredLocusId,
        activeRoute: state.activeRoute,
        oracleAngle: state.oracleAngle,
        cosmosMode: state.cosmosMode,
        bijectionCount: 9,
        muted: audio.isMuted(),
        audioUnlocked: audio.isUnlocked()
      };
    }

    function setZoom(level, focusU, focusV) {
      const z = clamp(Number(level) || 1.0, 1.0, 4.2);
      const sel = getLocusById(state.selectedLocusId) || CARPET_LOCI[4];
      const nextU = typeof focusU === "number" && !Number.isNaN(focusU)
        ? clamp(focusU, 0.1, 0.9)
        : (z <= 1.02 ? 0.5 : clamp(sel.u, 0.1, 0.9));
      const nextV = typeof focusV === "number" && !Number.isNaN(focusV)
        ? clamp(focusV, 0.1, 0.9)
        : (z <= 1.02 ? 0.5 : clamp(sel.v, 0.1, 0.9));
      state.zoomLevel = Number(z.toFixed(3));
      state.focusU = Number(nextU.toFixed(3));
      state.focusV = Number(nextV.toFixed(3));
      state.isMicroWeaveVisible = state.zoomLevel >= 1.6;
      if (!inZoomCb && typeof options.onZoomChange === "function") {
        inZoomCb = true;
        try { options.onZoomChange(getState()); } finally { inZoomCb = false; }
      }
      return getState();
    }

    function selectLocus(locusId, selectOpts) {
      const locus = getLocusById(locusId);
      if (!locus) return null;
      state.selectedLocusId = locus.id;
      if (state.zoomLevel >= 1.25) {
        state.focusU = clamp(locus.u, 0.1, 0.9);
        state.focusV = clamp(locus.v, 0.1, 0.9);
      }
      if (!selectOpts || !selectOpts.silent) {
        audio.pluckThread(locus.id);
      }
      if (!inSelectCb && (!selectOpts || !selectOpts.skipCallback) && typeof options.onSelectLocus === "function") {
        inSelectCb = true;
        try { options.onSelectLocus(locus, getState()); } finally { inSelectCb = false; }
      }
      return locus;
    }

    function hoverLocus(locusIdOrNull) {
      if (locusIdOrNull === null || locusIdOrNull === undefined || locusIdOrNull === "") {
        state.hoveredLocusId = null;
        return null;
      }
      const locus = getLocusById(locusIdOrNull);
      state.hoveredLocusId = locus ? locus.id : null;
      return locus;
    }

    function traceRoute(fromId, toId, routeOpts) {
      const route = computeGeometricRoute(fromId, toId);
      state.activeRoute = route;
      state.routePulse = 0;
      if (!routeOpts || !routeOpts.silent) {
        audio.playRouteCadence(route.fromId, route.toId);
      }
      if (!inRouteCb && (!routeOpts || !routeOpts.skipCallback) && typeof options.onRouteTraced === "function") {
        inRouteCb = true;
        try { options.onRouteTraced(route, getState()); } finally { inRouteCb = false; }
      }
      return route;
    }

    function setOracleAngle(angle01, oracleOpts) {
      const prevMode = state.cosmosMode;
      const a = clamp(Number(angle01) || 0, 0.0, 1.0);
      state.oracleAngle = Number(a.toFixed(4));
      state.cosmosMode = state.oracleAngle >= 0.5 ? "stain_cosmos" : "carpet_cosmos";
      if (state.cosmosMode !== prevMode && (!oracleOpts || !oracleOpts.silent)) {
        audio.playOracleChord(state.cosmosMode);
      }
      return { oracleAngle: state.oracleAngle, cosmosMode: state.cosmosMode };
    }

    function step(dtSec, stepOpts) {
      const dt = clamp(Number(dtSec) || 0.016, 0, 0.1);
      const reduced = Boolean(stepOpts && stepOpts.reducedMotion);
      if (!reduced) {
        state.time += dt;
        state.fingerPhase = (state.fingerPhase + dt * 0.28) % 1;
        state.routePulse = (state.routePulse + dt * 0.42) % 1;
        state.orbitPhase += dt * 0.65;
      }
    }

    function render(ctx, width, height) {
      if (!ctx) return;
      const w = Math.max(120, Number(width) || state.lastWidth || 560);
      const h = Math.max(120, Number(height) || state.lastHeight || 640);
      state.lastWidth = w;
      state.lastHeight = h;
      const lay = computeLayout(w, h, state.zoomLevel, state.focusU, state.focusV);

      ctx.save();
      ctx.fillStyle = THREAD_PALETTE.lampblackGround;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(lay.targetScreenX, lay.targetScreenY);
      ctx.scale(lay.zoom, lay.zoom);
      ctx.translate(-lay.anchorBaseX, -lay.anchorBaseY);
      drawHardwareAndBorders(ctx, lay, state);
      drawCarpetGeometryAndLoci(ctx, lay, state);
      drawActiveRouteAndCosmology(ctx, lay, state);
      ctx.restore();

      if (state.zoomLevel > 1.05) {
        ctx.strokeStyle = "rgba(216, 168, 76, 0.48)";
        ctx.lineWidth = 2;
        ctx.strokeRect(4, 4, w - 8, h - 8);
      }
      ctx.restore();
    }

    function hitTest(normX, normY, width, height) {
      const w = Math.max(120, Number(width) || state.lastWidth || 560);
      const h = Math.max(120, Number(height) || state.lastHeight || 640);
      const lay = computeLayout(w, h, state.zoomLevel, state.focusU, state.focusV);
      const isPixel = normX > 1.05 || normY > 1.05;
      const px = isPixel ? normX : normX * w;
      const py = isPixel ? normY : normY * h;
      const uv = lay.screenToUV(px, py);
      const maxDistUV = 0.095 / Math.sqrt(lay.zoom);
      let best = null;
      for (let i = 0; i < CARPET_LOCI.length; i += 1) {
        const loc = CARPET_LOCI[i];
        const d = Math.hypot(uv.u - loc.u, uv.v - loc.v);
        if (d <= maxDistUV && (!best || d < best.distance)) {
          best = { id: loc.id, index: loc.index, locus: loc, distance: Number(d.toFixed(4)) };
        }
      }
      return best;
    }

    function getCarpetPointOnScreen(locusId, width, height) {
      const loc = getLocusById(locusId);
      if (!loc) return null;
      const w = Math.max(120, Number(width) || state.lastWidth || 560);
      const h = Math.max(120, Number(height) || state.lastHeight || 640);
      const lay = computeLayout(w, h, state.zoomLevel, state.focusU, state.focusV);
      const pt = lay.uvToScreen(loc.u, loc.v);
      return { x: pt.x, y: pt.y, normX: pt.x / w, normY: pt.y / h };
    }

    function reset() {
      state.zoomLevel = 1.0;
      state.focusU = 0.5;
      state.focusV = 0.5;
      state.isMicroWeaveVisible = false;
      state.selectedLocusId = "oracle_sanctuary";
      state.hoveredLocusId = null;
      state.activeRoute = computeGeometricRoute("mule_narrows", "oracle_sanctuary");
      state.oracleAngle = 0.0;
      state.cosmosMode = "carpet_cosmos";
      state.routePulse = 0;
      return getState();
    }

    return {
      setZoom,
      selectLocus,
      hoverLocus,
      traceRoute,
      setOracleAngle,
      unlockAudio: audio.unlockAudio,
      setMuted: audio.setMuted,
      isMuted: audio.isMuted,
      getAudioContext: audio.getAudioContext,
      pluckThread: audio.pluckThread,
      playRouteCadence: audio.playRouteCadence,
      playOracleChord: audio.playOracleChord,
      step,
      render,
      hitTest,
      getCarpetPointOnScreen,
      getState,
      reset
    };
  }

  const EudoxiaSymmetricalCarpet = {
    LOCUS_IDS,
    THREAD_PALETTE,
    CARPET_LOCI,
    getLocusById,
    createCarpetLoom
  };

  globalThis.EudoxiaSymmetricalCarpet = EudoxiaSymmetricalCarpet;
  if (typeof window !== "undefined") {
    window.EudoxiaSymmetricalCarpet = EudoxiaSymmetricalCarpet;
  }
})();
