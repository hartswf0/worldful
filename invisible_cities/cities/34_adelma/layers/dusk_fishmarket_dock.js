(function () {
  "use strict";

  const PALETTE = Object.freeze({
    dusk_indigo: "#111827",
    harbor_abyss: "#0b111d",
    wet_flagstone: "#222c3d",
    oil_lantern: "#eba038",
    lantern_halo: "#ffd37d",
    urchin_violet: "#7c498d",
    urchin_spine: "#a976bc",
    sackcloth_ash: "#9e9382",
    bone_parchment: "#e4dccf",
    fever_ochre: "#cfa23c"
  });

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || "#111827").replace("#", "");
    const num = parseInt(clean.length === 3
      ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
      : clean, 16) || 0;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return "rgba(" + r + "," + g + "," + b + "," + clamp(alpha, 0, 1).toFixed(3) + ")";
  }

  const PRIMARY_STONE_IDS = Object.freeze([
    "hawser_sailor",
    "urchin_fisherman",
    "straw_mat_sufferer",
    "gangplank_stevedore",
    "balcony_maiden",
    "scale_greengrocer"
  ]);

  const RAW_STRANGERS = [
    {
      index: 0,
      id: "hawser_sailor",
      isPrimaryStone: true,
      keyNum: 1,
      roleLabel: "Mooring-Hawser Sailor",
      station: "Dock Apron Mooring Bollard",
      propSummary: "Wet hemp mooring hawser caught taut around iron quay bollard",
      xNorm: 0.17,
      yNorm: 0.68,
      eyeOffsetYNorm: -0.046,
      scale: 1.04,
      cloakHue: "#26364f",
      accentHue: "#cfa23c"
    },
    {
      index: 1,
      id: "urchin_fisherman",
      isPrimaryStone: true,
      keyNum: 2,
      roleLabel: "Sea-Urchin Fisherman",
      station: "Wet Flagstone Fish Quay",
      propSummary: "Crusty, warty hands sorting wicker baskets of spiny purple sea urchins",
      xNorm: 0.70,
      yNorm: 0.72,
      eyeOffsetYNorm: -0.042,
      scale: 1.05,
      cloakHue: "#32293f",
      accentHue: "#a976bc"
    },
    {
      index: 2,
      id: "straw_mat_sufferer",
      isPrimaryStone: true,
      keyNum: 3,
      roleLabel: "Fever Sufferer on Straw",
      station: "Shadowed Colonnade Corner",
      propSummary: "Damp woven straw mat tucked inside the shadowed limestone arch",
      xNorm: 0.52,
      yNorm: 0.58,
      eyeOffsetYNorm: -0.033,
      scale: 0.94,
      cloakHue: "#494032",
      accentHue: "#cfa23c"
    },
    {
      index: 3,
      id: "gangplank_stevedore",
      isPrimaryStone: true,
      keyNum: 4,
      roleLabel: "Sack-Hooded Stevedore",
      station: "Plank Gangplank & Steep Quay Steps",
      propSummary: "Coarse jute sack folded as hood over bowed head and shoulders",
      xNorm: 0.36,
      yNorm: 0.56,
      eyeOffsetYNorm: -0.044,
      scale: 0.98,
      cloakHue: "#6b6152",
      accentHue: "#9e9382"
    },
    {
      index: 4,
      id: "balcony_maiden",
      isPrimaryStone: true,
      keyNum: 5,
      roleLabel: "Veiled Balcony Girl",
      station: "Wrought-Iron Balcony Over the Arch",
      propSummary: "Ornate wrought-iron balcony balustrade above the dusk arcade",
      xNorm: 0.62,
      yNorm: 0.25,
      eyeOffsetYNorm: -0.038,
      scale: 0.86,
      cloakHue: "#3d344c",
      accentHue: "#e4dccf"
    },
    {
      index: 5,
      id: "scale_greengrocer",
      isPrimaryStone: true,
      keyNum: 6,
      roleLabel: "Brass-Scale Vegetable Vendor",
      station: "Lantern Alley Vegetable Stall",
      propSummary: "Hanging brass pan-scale weighing dark greens under lantern light",
      xNorm: 0.86,
      yNorm: 0.60,
      eyeOffsetYNorm: -0.043,
      scale: 1.00,
      cloakHue: "#353d36",
      accentHue: "#eba038"
    },
    {
      index: 6,
      id: "net_mender",
      isPrimaryStone: false,
      keyNum: null,
      roleLabel: "Tarred-Net Mender",
      station: "Western Timber Piling Apron",
      propSummary: "Bone shuttle threading dark brine-stiffened trawl mesh",
      xNorm: 0.11,
      yNorm: 0.52,
      eyeOffsetYNorm: -0.040,
      scale: 0.90,
      cloakHue: "#243043",
      accentHue: "#9e9382"
    },
    {
      index: 7,
      id: "upper_stair_porter",
      isPrimaryStone: false,
      keyNum: null,
      roleLabel: "Steep-Alley Sack Porter",
      station: "Upper Limestone Stairway",
      propSummary: "Folded sackcloth cowl climbing the stepped stone alley",
      xNorm: 0.26,
      yNorm: 0.36,
      eyeOffsetYNorm: -0.038,
      scale: 0.84,
      cloakHue: "#5c5346",
      accentHue: "#9e9382"
    },
    {
      index: 8,
      id: "lantern_trimmer",
      isPrimaryStone: false,
      keyNum: null,
      roleLabel: "Colonnade Lantern Trimmer",
      station: "Central Arch Keystone Hook",
      propSummary: "Long iron hook steadying a warm whale-oil arcade lantern",
      xNorm: 0.44,
      yNorm: 0.39,
      eyeOffsetYNorm: -0.040,
      scale: 0.88,
      cloakHue: "#2d3546",
      accentHue: "#ffd37d"
    },
    {
      index: 9,
      id: "cuttlefish_monger",
      isPrimaryStone: false,
      keyNum: null,
      roleLabel: "Cuttlefish Slab Monger",
      station: "Wholesale Brine Trough",
      propSummary: "Wet stone trough gleaming with silver bream and cuttlefish",
      xNorm: 0.55,
      yNorm: 0.76,
      eyeOffsetYNorm: -0.044,
      scale: 1.02,
      cloakHue: "#283244",
      accentHue: "#7c498d"
    },
    {
      index: 10,
      id: "lateen_oarsman",
      isPrimaryStone: false,
      keyNum: null,
      roleLabel: "Lateen Skiff Oarsman",
      station: "Harbor Mooring Gunwale",
      propSummary: "Ash sweep oar braced against moored lateen fishing hull",
      xNorm: 0.33,
      yNorm: 0.74,
      eyeOffsetYNorm: -0.042,
      scale: 0.96,
      cloakHue: "#1d293a",
      accentHue: "#eba038"
    },
    {
      index: 11,
      id: "colonnade_widow",
      isPrimaryStone: false,
      keyNum: null,
      roleLabel: "Shrouded Arcade Watcher",
      station: "Eastern Limestone Pier",
      propSummary: "Dark wool shawl drawn tight beside damp colonnade pilaster",
      xNorm: 0.77,
      yNorm: 0.43,
      eyeOffsetYNorm: -0.040,
      scale: 0.89,
      cloakHue: "#272334",
      accentHue: "#a976bc"
    }
  ];

  const WHARF_STRANGERS = Object.freeze(RAW_STRANGERS.map(function (item) {
    return Object.freeze(Object.assign({}, item));
  }));

  const DUSK_STARS = (function () {
    const pts = [];
    let seed = 34061;
    for (let i = 0; i < 28; i++) {
      seed = (seed * 16807) % 2147483647;
      const x = (seed % 1000) / 1000;
      seed = (seed * 16807) % 2147483647;
      const y = 0.02 + ((seed % 1000) / 1000) * 0.19;
      seed = (seed * 16807) % 2147483647;
      const r = 0.6 + ((seed % 100) / 100) * 1.1;
      pts.push({ x: x, y: y, r: r, phase: i * 0.73 });
    }
    return pts;
  })();

  function createHarborAudio(initialMuted) {
    let ctx = null;
    let masterGain = null;
    let noiseBuffer = null;
    let muted = Boolean(initialMuted);
    let audioUnlocked = false;

    function ensureContext() {
      if (ctx) return ctx;
      try {
        const AC = (typeof globalThis !== "undefined") &&
          (globalThis.AudioContext || globalThis.webkitAudioContext);
        if (!AC) return null;
        ctx = new AC();
        masterGain = ctx.createGain();
        masterGain.gain.value = muted ? 0 : 0.65;
        masterGain.connect(ctx.destination);
      } catch (_err) {
        ctx = null;
      }
      return ctx;
    }

    function getNoiseBuffer(ac) {
      if (noiseBuffer) return noiseBuffer;
      try {
        const len = Math.max(4096, Math.floor(ac.sampleRate * 1.4));
        noiseBuffer = ac.createBuffer(1, len, ac.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        let b0 = 0;
        let b1 = 0;
        let s = 9187;
        for (let i = 0; i < len; i++) {
          s = (s * 48271) % 2147483647;
          const white = (s / 1073741823.5) - 1;
          b0 = 0.985 * b0 + white * 0.09;
          b1 = 0.94 * b1 + white * 0.14;
          data[i] = clamp((b0 + b1 + white * 0.18) * 0.7, -1, 1);
        }
      } catch (_err) {
        noiseBuffer = null;
      }
      return noiseBuffer;
    }

    function unlockAudio() {
      try {
        const ac = ensureContext();
        if (!ac) {
          audioUnlocked = true;
          return true;
        }
        if (ac.state === "suspended" && typeof ac.resume === "function") {
          ac.resume().catch(function () {});
        }
        audioUnlocked = true;
      } catch (_err) {
        audioUnlocked = false;
      }
      return audioUnlocked;
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      try {
        if (ctx && masterGain) {
          const t = ctx.currentTime;
          masterGain.gain.setTargetAtTime(muted ? 0 : 0.65, t, 0.025);
        }
      } catch (_err) {}
      return muted;
    }

    function playTone(ac, type, freqStart, freqEnd, startOffset, dur, peakGain, panVal) {
      const now = ac.currentTime + startOffset;
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(Math.max(24, freqStart), now);
      if (freqEnd && freqEnd !== freqStart) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(24, freqEnd), now + dur);
      }
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(peakGain, now + Math.min(0.03, dur * 0.2));
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      if (typeof ac.createStereoPanner === "function" && typeof panVal === "number") {
        const pan = ac.createStereoPanner();
        pan.pan.setValueAtTime(clamp(panVal, -1, 1), now);
        osc.connect(g);
        g.connect(pan);
        pan.connect(masterGain);
      } else {
        osc.connect(g);
        g.connect(masterGain);
      }
      osc.start(now);
      osc.stop(now + dur + 0.03);
    }

    function playFilteredNoise(ac, filterType, freq, q, startOffset, dur, peakGain) {
      const buf = getNoiseBuffer(ac);
      if (!buf) return;
      const now = ac.currentTime + startOffset;
      const src = ac.createBufferSource();
      src.buffer = buf;
      const biq = ac.createBiquadFilter();
      biq.type = filterType || "bandpass";
      biq.frequency.setValueAtTime(freq, now);
      biq.Q.setValueAtTime(q || 1.4, now);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(peakGain, now + Math.min(0.08, dur * 0.3));
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      src.connect(biq);
      biq.connect(g);
      g.connect(masterGain);
      src.start(now);
      src.stop(now + dur + 0.03);
    }

    function triggerEncounterSound(figureId) {
      if (muted) return false;
      try {
        const ac = ensureContext();
        if (!ac) return false;
        const id = String(figureId || "hawser_sailor");
        if (id === "hawser_sailor" || id === "net_mender") {
          playTone(ac, "sawtooth", 84, 62, 0, 0.42, 0.11, -0.35);
          playTone(ac, "sine", 56, 38, 0.14, 0.46, 0.18, -0.2);
          playTone(ac, "sine", 54, 36, 0.34, 0.40, 0.11, -0.25);
        } else if (id === "urchin_fisherman" || id === "cuttlefish_monger") {
          playFilteredNoise(ac, "bandpass", 1450, 3.2, 0, 0.22, 0.12);
          playFilteredNoise(ac, "lowpass", 420, 0.9, 0.05, 0.72, 0.16);
          playTone(ac, "triangle", 196, 174, 0.08, 0.58, 0.08, 0.28);
        } else if (id === "straw_mat_sufferer") {
          playFilteredNoise(ac, "bandpass", 2400, 4.5, 0, 0.18, 0.10);
          playTone(ac, "sine", 587.3, 582.0, 0.04, 0.75, 0.08, 0.05);
          playTone(ac, "sine", 880.0, 886.0, 0.07, 0.72, 0.06, -0.05);
        } else if (id === "gangplank_stevedore" || id === "upper_stair_porter") {
          playTone(ac, "triangle", 122, 88, 0, 0.26, 0.14, -0.18);
          playTone(ac, "sawtooth", 96, 74, 0.06, 0.22, 0.07, -0.14);
          playFilteredNoise(ac, "lowpass", 280, 1.2, 0.02, 0.18, 0.12);
        } else if (id === "balcony_maiden" || id === "colonnade_widow") {
          playFilteredNoise(ac, "bandpass", 780, 2.2, 0, 0.85, 0.11);
          playTone(ac, "sine", 329.6, 326.0, 0.03, 0.88, 0.09, 0.22);
          playTone(ac, "triangle", 523.3, 516.0, 0.09, 0.82, 0.06, 0.30);
        } else if (id === "scale_greengrocer" || id === "lantern_trimmer") {
          playTone(ac, "sine", 1174.7, 1170, 0, 0.52, 0.08, 0.42);
          playTone(ac, "sine", 1760.0, 1754, 0.03, 0.44, 0.05, 0.45);
          playTone(ac, "triangle", 130.8, 129.5, 0.04, 0.78, 0.12, 0.35);
        } else {
          playFilteredNoise(ac, "lowpass", 520, 1.1, 0, 0.55, 0.13);
          playTone(ac, "triangle", 146.8, 138.0, 0.03, 0.48, 0.09, -0.15);
        }
        return true;
      } catch (_err) {
        return false;
      }
    }

    function triggerReciprocalShock(intensity) {
      if (muted) return false;
      try {
        const ac = ensureContext();
        if (!ac) return false;
        const lv = clamp(typeof intensity === "number" ? intensity : 0.8, 0.15, 1);
        playTone(ac, "sine", 46, 36, 0, 0.85, 0.22 * lv, 0);
        playTone(ac, "sawtooth", 220, 217, 0.02, 0.78, 0.06 * lv, -0.75);
        playTone(ac, "sawtooth", 233.1, 236, 0.02, 0.78, 0.06 * lv, 0.75);
        playTone(ac, "sine", 466.2, 462, 0.05, 0.82, 0.07 * lv, 0);
        return true;
      } catch (_err) {
        return false;
      }
    }

    function triggerForeheadTouch(mode) {
      if (muted) return false;
      try {
        const ac = ensureContext();
        if (!ac) return false;
        const root = mode === "hereafter" ? 196.0 : 220.0;
        playTone(ac, "sine", 58, 42, 0, 0.16, 0.20, 0);
        playTone(ac, "sine", 52, 38, 0.20, 0.22, 0.16, 0);
        playTone(ac, "sine", root, root * 0.996, 0.10, 1.15, 0.11, -0.1);
        playTone(ac, "sine", root * 2.4, root * 2.39, 0.11, 0.95, 0.05, 0.15);
        return true;
      } catch (_err) {
        return false;
      }
    }

    function triggerKaleidoscopeTurn() {
      if (muted) return false;
      try {
        const ac = ensureContext();
        if (!ac) return false;
        playFilteredNoise(ac, "highpass", 3200, 2.5, 0, 0.06, 0.10);
        playTone(ac, "sine", 392.0, 394.0, 0.01, 0.36, 0.08, -0.25);
        playTone(ac, "sine", 784.0, 788.0, 0.06, 0.42, 0.07, 0.25);
        playTone(ac, "triangle", 1174.7, 1180.0, 0.11, 0.45, 0.05, 0);
        return true;
      } catch (_err) {
        return false;
      }
    }

    return {
      unlockAudio: unlockAudio,
      setMuted: setMuted,
      isMuted: function () { return muted; },
      toggleMute: function () { return setMuted(!muted); },
      isUnlocked: function () { return audioUnlocked; },
      triggerEncounterSound: triggerEncounterSound,
      triggerReciprocalShock: triggerReciprocalShock,
      triggerForeheadTouch: triggerForeheadTouch,
      triggerKaleidoscopeTurn: triggerKaleidoscopeTurn
    };
  }

  function createWharfEngine(opts) {
    const cfg = opts || {};
    const audio = createHarborAudio(Boolean(cfg.muted));
    let timeSec = 0;
    let stepCount = 0;
    let waterPhase = 0;
    let swayPhase = 0;
    let scaleSwingPhase = 0;
    let lanternFlicker = 0;
    let reducedMotion = Boolean(cfg.reducedMotion);
    let lastProjected = null;

    function getLayout(width, height) {
      const w = Math.max(240, Number(width) || 1280);
      const h = Math.max(200, Number(height) || 800);
      const unit = Math.min(w, h);
      const horizonY = Math.round(h * 0.27);
      const quayY = Math.round(h * 0.56);

      const balconyRect = {
        x: Math.round(w * 0.565),
        y: Math.round(h * 0.145),
        width: Math.round(w * 0.115),
        height: Math.round(h * 0.135)
      };

      const gangplank = {
        x1: Math.round(w * 0.285),
        y1: Math.round(h * 0.665),
        x2: Math.round(w * 0.435),
        y2: Math.round(h * 0.535)
      };

      const stairSteps = [];
      for (let i = 0; i < 8; i++) {
        const t = i / 8;
        stairSteps.push({
          x: Math.round(w * (0.215 + t * 0.065)),
          y: Math.round(h * (0.505 - t * 0.215)),
          width: Math.round(w * (0.115 - t * 0.032)),
          height: Math.max(5, Math.round(h * 0.026))
        });
      }

      const lanterns = [
        { id: "pier_west", x: Math.round(w * 0.19), y: Math.round(h * 0.43), chainTopY: Math.round(h * 0.34), radius: Math.round(unit * 0.15), intensity: 0.88 },
        { id: "arch_west", x: Math.round(w * 0.45), y: Math.round(h * 0.34), chainTopY: Math.round(h * 0.25), radius: Math.round(unit * 0.18), intensity: 1.0 },
        { id: "arch_center", x: Math.round(w * 0.67), y: Math.round(h * 0.35), chainTopY: Math.round(h * 0.26), radius: Math.round(unit * 0.17), intensity: 0.92 },
        { id: "stall_east", x: Math.round(w * 0.85), y: Math.round(h * 0.38), chainTopY: Math.round(h * 0.27), radius: Math.round(unit * 0.20), intensity: 1.05 }
      ];

      const urchinBaskets = [
        { x: Math.round(w * 0.655), y: Math.round(h * 0.745), rx: Math.max(12, Math.round(w * 0.024)), ry: Math.max(8, Math.round(h * 0.017)), kind: "urchins" },
        { x: Math.round(w * 0.738), y: Math.round(h * 0.755), rx: Math.max(13, Math.round(w * 0.026)), ry: Math.max(8, Math.round(h * 0.018)), kind: "urchins" },
        { x: Math.round(w * 0.692), y: Math.round(h * 0.778), rx: Math.max(11, Math.round(w * 0.021)), ry: Math.max(7, Math.round(h * 0.015)), kind: "silver_fish" }
      ];

      const strawMatRect = {
        x: Math.round(w * 0.478),
        y: Math.round(h * 0.585),
        width: Math.round(w * 0.088),
        height: Math.round(h * 0.042)
      };

      const scaleAnchor = {
        x: Math.round(w * 0.822),
        y: Math.round(h * 0.485)
      };

      const figures = WHARF_STRANGERS.map(function (s) {
        const px = s.xNorm * w;
        const py = s.yNorm * h;
        const eyeY = py + s.eyeOffsetYNorm * h;
        const headRadius = Math.max(8, Math.round(unit * 0.018 * s.scale));
        const hitRadius = Math.max(34, Math.round(unit * 0.048 * s.scale));
        return {
          index: s.index,
          id: s.id,
          isPrimaryStone: s.isPrimaryStone,
          keyNum: s.keyNum,
          roleLabel: s.roleLabel,
          station: s.station,
          propSummary: s.propSummary,
          xNorm: s.xNorm,
          yNorm: s.yNorm,
          eyeOffsetYNorm: s.eyeOffsetYNorm,
          x: px,
          y: py,
          eyeX: px,
          eyeY: eyeY,
          headRadius: headRadius,
          hitRadius: hitRadius,
          scale: s.scale,
          cloakHue: s.cloakHue,
          accentHue: s.accentHue
        };
      });

      return {
        width: w,
        height: h,
        horizonY: horizonY,
        quayY: quayY,
        balconyRect: balconyRect,
        gangplank: gangplank,
        stairSteps: stairSteps,
        lanterns: lanterns,
        urchinBaskets: urchinBaskets,
        strawMatRect: strawMatRect,
        scaleAnchor: scaleAnchor,
        figures: figures
      };
    }

    function projectFigures(layout, useReduced, gazeParalysis) {
      const stillFactor = useReduced ? 0 : (1 - clamp(Number(gazeParalysis) || 0, 0, 1) * 0.72);
      return layout.figures.map(function (f) {
        let dx = 0;
        let dy = 0;
        if (stillFactor > 0.001) {
          const ph = swayPhase + f.index * 1.17;
          if (f.id === "gangplank_stevedore" || f.id === "upper_stair_porter") {
            dx = Math.sin(ph * 1.25) * 2.2 * stillFactor;
            dy = Math.abs(Math.cos(ph * 1.25)) * -2.4 * stillFactor;
          } else if (f.id === "lateen_oarsman" || f.id === "hawser_sailor") {
            dx = Math.cos(waterPhase * 0.9 + f.index) * 1.6 * stillFactor;
            dy = Math.sin(waterPhase * 1.1 + f.index) * 2.1 * stillFactor;
          } else if (f.id === "straw_mat_sufferer") {
            dx = Math.sin(swayPhase * 5.2) * 0.85 * stillFactor;
          } else if (f.id !== "balcony_maiden") {
            dy = Math.sin(ph * 0.8) * 1.1 * stillFactor;
          }
        }
        return Object.assign({}, f, {
          x: f.x + dx,
          y: f.y + dy,
          eyeX: f.eyeX + dx,
          eyeY: f.eyeY + dy
        });
      });
    }

    function step(dtSec, params) {
      const p = params || {};
      const dt = clamp(Number(dtSec) || 0, 0, 0.25);
      stepCount += 1;
      const isRed = p.reducedMotion !== undefined ? Boolean(p.reducedMotion) : reducedMotion;
      reducedMotion = isRed;
      if (isRed) {
        lanternFlicker = 0;
        return;
      }
      const paralysis = clamp(Number(p.gazeParalysis) || 0, 0, 1);
      const pace = 1 - paralysis * 0.45;
      timeSec += dt;
      waterPhase += dt * 1.35 * pace;
      swayPhase += dt * 1.65 * pace;
      scaleSwingPhase += dt * 1.95 * pace;
      lanternFlicker = Math.sin(timeSec * 6.7) * 0.5 + Math.sin(timeSec * 13.9) * 0.3 + Math.cos(timeSec * 3.1) * 0.2;
    }

    function drawSkyAndNecropolis(ctx, layout, p) {
      const w = layout.width;
      const h = layout.height;
      const lifeStage = clamp(Number(p.lifeStage) || 0, 0, 1);
      const skyGrad = ctx.createLinearGradient(0, 0, 0, layout.quayY);
      skyGrad.addColorStop(0, PALETTE.harbor_abyss);
      skyGrad.addColorStop(0.52, PALETTE.dusk_indigo);
      skyGrad.addColorStop(1, lifeStage > 0.5 ? "#2b2038" : "#24293d");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < DUSK_STARS.length; i++) {
        const st = DUSK_STARS[i];
        if (st.x > 0.55) continue;
        const tw = p.reducedMotion ? 0.45 : 0.32 + 0.24 * Math.sin(timeSec * 1.8 + st.phase);
        ctx.fillStyle = hexToRgba(PALETTE.bone_parchment, tw);
        ctx.beginPath();
        ctx.arc(st.x * w, st.y * h, st.r, 0, Math.PI * 2);
        ctx.fill();
      }

      const glowGrad = ctx.createRadialGradient(w * 0.22, layout.horizonY, 6, w * 0.22, layout.horizonY, w * 0.38);
      glowGrad.addColorStop(0, hexToRgba(PALETTE.fever_ochre, 0.22 + lifeStage * 0.08));
      glowGrad.addColorStop(0.55, hexToRgba(PALETTE.urchin_violet, 0.16 + lifeStage * 0.12));
      glowGrad.addColorStop(1, "rgba(11,17,29,0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, w * 0.62, layout.quayY);

      const hz = layout.horizonY;
      ctx.fillStyle = "#0e1523";
      ctx.beginPath();
      ctx.moveTo(0, hz + 8);
      ctx.lineTo(w * 0.05, hz - h * 0.032);
      ctx.lineTo(w * 0.17, hz - h * 0.048);
      ctx.lineTo(w * 0.29, hz - h * 0.036);
      ctx.lineTo(w * 0.42, hz - h * 0.012);
      ctx.lineTo(w * 0.46, hz + 10);
      ctx.closePath();
      ctx.fill();

      const obX = w * 0.155;
      const obBaseY = hz - h * 0.046;
      ctx.fillStyle = "#090e18";
      ctx.beginPath();
      ctx.moveTo(obX - 4, obBaseY + 2);
      ctx.lineTo(obX - 1.6, obBaseY - h * 0.058);
      ctx.lineTo(obX, obBaseY - h * 0.066);
      ctx.lineTo(obX + 1.6, obBaseY - h * 0.058);
      ctx.lineTo(obX + 4, obBaseY + 2);
      ctx.closePath();
      ctx.fill();

      const cypressXs = [0.06, 0.085, 0.12, 0.19, 0.215, 0.25, 0.31, 0.34];
      for (let c = 0; c < cypressXs.length; c++) {
        const cx = w * cypressXs[c];
        const cy = hz - h * (0.028 + (c % 3) * 0.008);
        const ch = h * (0.032 + (c % 2) * 0.012);
        ctx.beginPath();
        ctx.ellipse(cx, cy - ch * 0.45, Math.max(2.2, w * 0.0032), ch * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawArchitectureAndHarbor(ctx, layout, p) {
      const w = layout.width;
      const h = layout.height;
      const hz = layout.horizonY;
      const qy = layout.quayY;

      const waterGrad = ctx.createLinearGradient(0, hz, 0, h);
      waterGrad.addColorStop(0, "#101828");
      waterGrad.addColorStop(0.45, PALETTE.harbor_abyss);
      waterGrad.addColorStop(1, "#070b14");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, hz, w * 0.50, h - hz);

      for (let r = 0; r < 22; r++) {
        const ry = hz + 10 + (r / 22) * (h - hz - 16);
        const drift = p.reducedMotion ? 0 : Math.sin(waterPhase * 1.4 + r * 0.75) * 6;
        const rx = w * (0.06 + (r % 4) * 0.085) + drift;
        const rw = w * (0.045 + (r % 3) * 0.028);
        ctx.fillStyle = r % 3 === 0
          ? hexToRgba(PALETTE.lantern_halo, 0.16)
          : hexToRgba(PALETTE.oil_lantern, 0.12);
        ctx.fillRect(rx, ry, rw, 2.1);
      }

      ctx.fillStyle = "#1d2536";
      ctx.beginPath();
      ctx.moveTo(w * 0.19, qy);
      ctx.lineTo(w * 0.19, h * 0.22);
      ctx.lineTo(w * 0.31, h * 0.16);
      ctx.lineTo(w * 0.39, h * 0.19);
      ctx.lineTo(w * 0.39, qy);
      ctx.closePath();
      ctx.fill();

      for (let s = 0; s < layout.stairSteps.length; s++) {
        const st = layout.stairSteps[s];
        ctx.fillStyle = s % 2 === 0 ? "#2c3649" : "#252f41";
        ctx.fillRect(st.x, st.y, st.width, st.height);
        ctx.fillStyle = hexToRgba(PALETTE.sackcloth_ash, 0.22);
        ctx.fillRect(st.x, st.y, st.width, 2);
      }

      ctx.fillStyle = "#262f40";
      ctx.fillRect(w * 0.385, h * 0.06, w * 0.615, qy - h * 0.04);
      ctx.fillStyle = hexToRgba(PALETTE.sackcloth_ash, 0.09);
      ctx.fillRect(w * 0.41, h * 0.09, w * 0.13, h * 0.12);
      ctx.fillRect(w * 0.72, h * 0.11, w * 0.16, h * 0.10);

      const archCenters = [0.485, 0.665, 0.845];
      const archHalfW = w * 0.074;
      const archSpringY = h * 0.40;
      const archApexY = h * 0.295;
      for (let a = 0; a < archCenters.length; a++) {
        const cx = w * archCenters[a];
        ctx.fillStyle = "#0b101b";
        ctx.beginPath();
        ctx.moveTo(cx - archHalfW, qy + h * 0.04);
        ctx.lineTo(cx - archHalfW, archSpringY);
        ctx.quadraticCurveTo(cx - archHalfW * 0.45, archApexY + 6, cx, archApexY);
        ctx.quadraticCurveTo(cx + archHalfW * 0.45, archApexY + 6, cx + archHalfW, archSpringY);
        ctx.lineTo(cx + archHalfW, qy + h * 0.04);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = hexToRgba(PALETTE.sackcloth_ash, 0.32);
        ctx.lineWidth = 2.2;
        ctx.stroke();
      }

      const br = layout.balconyRect;
      ctx.fillStyle = "#121826";
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(br.x + br.width * 0.24, br.y + 4, br.width * 0.52, br.height - 6, [18, 18, 0, 0])
        : ctx.rect(br.x + br.width * 0.24, br.y + 4, br.width * 0.52, br.height - 6);
      ctx.fill();
      ctx.fillStyle = hexToRgba(PALETTE.oil_lantern, 0.14);
      ctx.fillRect(br.x + br.width * 0.30, br.y + 12, br.width * 0.40, br.height - 16);
      ctx.fillStyle = "#394254";
      ctx.fillRect(br.x - 4, br.y + br.height - 5, br.width + 8, 7);

      ctx.fillStyle = PALETTE.wet_flagstone;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.79);
      ctx.lineTo(w * 0.14, h * 0.63);
      ctx.lineTo(w * 0.37, qy - 6);
      ctx.lineTo(w, qy - 10);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "rgba(11,17,29,0.52)";
      ctx.lineWidth = 1.2;
      for (let row = 0; row < 7; row++) {
        const fy = qy + (row / 7) * (h - qy);
        ctx.beginPath();
        ctx.moveTo(w * Math.max(0, 0.34 - row * 0.06), fy);
        ctx.lineTo(w, fy);
        ctx.stroke();
      }

      const boatBob = p.reducedMotion ? 0 : Math.sin(waterPhase) * 2.2;
      ctx.save();
      ctx.translate(0, boatBob);
      ctx.fillStyle = "#151d2b";
      ctx.beginPath();
      ctx.moveTo(w * 0.18, h * 0.70);
      ctx.quadraticCurveTo(w * 0.28, h * 0.76, w * 0.39, h * 0.69);
      ctx.lineTo(w * 0.36, h * 0.65);
      ctx.lineTo(w * 0.21, h * 0.66);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#4c4338";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(w * 0.275, h * 0.68);
      ctx.lineTo(w * 0.275, h * 0.38);
      ctx.moveTo(w * 0.20, h * 0.51);
      ctx.lineTo(w * 0.34, h * 0.33);
      ctx.stroke();
      ctx.restore();

      const pilings = [0.07, 0.125, 0.235];
      for (let k = 0; k < pilings.length; k++) {
        const px = w * pilings[k];
        const py = h * (0.48 + k * 0.05);
        ctx.fillStyle = "#1b1c22";
        ctx.fillRect(px - 4, py, 8, h * 0.22);
      }

      const gp = layout.gangplank;
      ctx.save();
      ctx.strokeStyle = "#5c4a36";
      ctx.lineWidth = Math.max(8, Math.round(h * 0.016));
      ctx.lineCap = "butt";
      ctx.beginPath();
      ctx.moveTo(gp.x1, gp.y1 + boatBob * 0.6);
      ctx.lineTo(gp.x2, gp.y2);
      ctx.stroke();
      ctx.strokeStyle = "#826e55";
      ctx.lineWidth = 1.6;
      for (let c = 1; c <= 6; c++) {
        const t = c / 7;
        const cx = gp.x1 + (gp.x2 - gp.x1) * t;
        const cy = gp.y1 + boatBob * 0.6 + (gp.y2 - (gp.y1 + boatBob * 0.6)) * t;
        ctx.beginPath();
        ctx.moveTo(cx - 3, cy - 5);
        ctx.lineTo(cx + 3, cy + 5);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawWharfProps(ctx, layout, p) {
      const w = layout.width;
      const h = layout.height;
      const flick = p.reducedMotion ? 0 : lanternFlicker * 0.06;

      const bolX = w * 0.145;
      const bolY = h * 0.705;
      ctx.fillStyle = "#171d28";
      ctx.fillRect(bolX - 6, bolY - 12, 12, 18);
      ctx.beginPath();
      ctx.arc(bolX, bolY - 13, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#9b8869";
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(w * 0.21, h * 0.67);
      ctx.quadraticCurveTo(w * 0.175, h * 0.71, bolX, bolY - 6);
      ctx.stroke();
      for (let c = 0; c < 3; c++) {
        ctx.beginPath();
        ctx.ellipse(bolX + 2, bolY + 4 + c * 3, 11 - c * 1.5, 3.5, 0.1, 0, Math.PI * 2);
        ctx.stroke();
      }

      const sm = layout.strawMatRect;
      ctx.fillStyle = hexToRgba(PALETTE.fever_ochre, 0.42);
      ctx.beginPath();
      ctx.moveTo(sm.x, sm.y + sm.height);
      ctx.lineTo(sm.x + 8, sm.y);
      ctx.lineTo(sm.x + sm.width, sm.y + 3);
      ctx.lineTo(sm.x + sm.width - 6, sm.y + sm.height);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "#2b3749";
      ctx.fillRect(w * 0.505, h * 0.765, w * 0.085, h * 0.032);
      for (let sf = 0; sf < 5; sf++) {
        ctx.fillStyle = sf % 2 === 0 ? "#aeb8c7" : "#675078";
        ctx.beginPath();
        ctx.ellipse(w * (0.518 + sf * 0.014), h * 0.776, 6, 2.5, 0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let b = 0; b < layout.urchinBaskets.length; b++) {
        const bk = layout.urchinBaskets[b];
        ctx.fillStyle = "#6c563d";
        ctx.beginPath();
        ctx.ellipse(bk.x, bk.y + 4, bk.rx, bk.ry, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#4c3b29";
        ctx.beginPath();
        ctx.ellipse(bk.x, bk.y, bk.rx * 0.9, bk.ry * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
        if (bk.kind === "urchins") {
          for (let u = -2; u <= 2; u++) {
            const ux = bk.x + u * (bk.rx * 0.30);
            const uy = bk.y - 1 + (Math.abs(u) % 2) * 2.5;
            ctx.fillStyle = PALETTE.urchin_violet;
            ctx.beginPath();
            ctx.arc(ux, uy, 4.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = PALETTE.urchin_spine;
            ctx.lineWidth = 1;
            for (let sp = 0; sp < 6; sp++) {
              const ang = (sp / 6) * Math.PI * 2;
              ctx.beginPath();
              ctx.moveTo(ux, uy);
              ctx.lineTo(ux + Math.cos(ang) * 6.5, uy + Math.sin(ang) * 6.5);
              ctx.stroke();
            }
          }
        } else {
          ctx.fillStyle = "#c8d0dc";
          for (let f = -2; f <= 2; f++) {
            ctx.beginPath();
            ctx.ellipse(bk.x + f * 4.5, bk.y, 5.5, 2.1, -0.3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      const sa = layout.scaleAnchor;
      ctx.fillStyle = "#3f3225";
      ctx.fillRect(w * 0.795, h * 0.605, w * 0.095, h * 0.048);
      ctx.fillStyle = "#2b4635";
      for (let g = 0; g < 6; g++) {
        ctx.beginPath();
        ctx.arc(w * (0.806 + g * 0.013), h * 0.602, 7, 0, Math.PI * 2);
        ctx.fill();
      }
      const tilt = p.reducedMotion ? 0.06 : Math.sin(scaleSwingPhase) * 0.14;
      const beamHalf = Math.max(12, w * 0.019);
      ctx.strokeStyle = PALETTE.oil_lantern;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(sa.x, sa.y - 16);
      ctx.lineTo(sa.x, sa.y);
      const lx = sa.x - Math.cos(tilt) * beamHalf;
      const ly = sa.y - Math.sin(tilt) * beamHalf;
      const rx = sa.x + Math.cos(tilt) * beamHalf;
      const ry = sa.y + Math.sin(tilt) * beamHalf;
      ctx.moveTo(lx, ly);
      ctx.lineTo(rx, ry);
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx - 5, ly + 16);
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx + 5, ly + 16);
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 5, ry + 16);
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + 5, ry + 16);
      ctx.stroke();
      ctx.fillStyle = PALETTE.lantern_halo;
      ctx.beginPath();
      ctx.arc(lx, ly + 16, 6, 0, Math.PI);
      ctx.arc(rx, ry + 16, 6, 0, Math.PI);
      ctx.fill();

      for (let i = 0; i < layout.lanterns.length; i++) {
        const ln = layout.lanterns[i];
        const rad = ln.radius * (1 + flick) * ln.intensity;
        const halo = ctx.createRadialGradient(ln.x, ln.y, 2, ln.x, ln.y, rad);
        halo.addColorStop(0, hexToRgba(PALETTE.lantern_halo, 0.75));
        halo.addColorStop(0.24, hexToRgba(PALETTE.oil_lantern, 0.28));
        halo.addColorStop(1, "rgba(235,160,56,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(ln.x, ln.y, rad, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = "#181d26";
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(ln.x, ln.chainTopY);
        ctx.lineTo(ln.x, ln.y - 6);
        ctx.stroke();
        ctx.fillStyle = PALETTE.lantern_halo;
        ctx.fillRect(ln.x - 3.5, ln.y - 5, 7, 9);
      }
    }

    function drawBalconyRailFront(ctx, layout) {
      const br = layout.balconyRect;
      const railTop = br.y + br.height - 26;
      const railBot = br.y + br.height - 5;
      ctx.strokeStyle = "#141821";
      ctx.lineWidth = 2;
      ctx.strokeRect(br.x + 2, railTop, br.width - 4, railBot - railTop);
      const bars = 9;
      for (let i = 1; i < bars; i++) {
        const bx = br.x + 2 + ((br.width - 4) * i) / bars;
        ctx.beginPath();
        ctx.moveTo(bx, railTop);
        ctx.lineTo(bx, railBot);
        ctx.stroke();
      }
    }

    function drawWharfFigure(ctx, fig, layout, p) {
      const isHovered = p.hoveredId === fig.id;
      const isSelected = p.selectedId === fig.id;
      const isLocked = p.lockedId === fig.id;
      const hr = fig.headRadius;
      const bodyH = Math.max(22, fig.y - fig.eyeY);
      const shoulderW = hr * (fig.id === "straw_mat_sufferer" ? 2.2 : 1.95);

      ctx.save();
      if (isHovered || isSelected || isLocked) {
        const ringColor = isLocked
          ? PALETTE.urchin_spine
          : (isSelected ? PALETTE.lantern_halo : PALETTE.oil_lantern);
        ctx.strokeStyle = hexToRgba(ringColor, isLocked ? 0.88 : 0.62);
        ctx.lineWidth = isLocked ? 2.2 : 1.5;
        ctx.beginPath();
        ctx.ellipse(fig.x, fig.y + 3, shoulderW * 1.15, Math.max(5, hr * 0.45), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(7,10,18,0.48)";
      ctx.beginPath();
      ctx.ellipse(fig.x, fig.y + 3, shoulderW * 0.92, Math.max(4, hr * 0.35), 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = fig.cloakHue;
      ctx.beginPath();
      ctx.moveTo(fig.x - shoulderW * 0.95, fig.y + 2);
      ctx.quadraticCurveTo(fig.x - shoulderW * 1.05, fig.eyeY + hr * 1.3, fig.x - hr * 0.85, fig.eyeY + hr * 0.8);
      ctx.lineTo(fig.x + hr * 0.85, fig.eyeY + hr * 0.8);
      ctx.quadraticCurveTo(fig.x + shoulderW * 1.05, fig.eyeY + hr * 1.3, fig.x + shoulderW * 0.95, fig.y + 2);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = hexToRgba(fig.accentHue, 0.38);
      ctx.lineWidth = 1.2;
      ctx.stroke();

      if (fig.id === "gangplank_stevedore" || fig.id === "upper_stair_porter") {
        ctx.fillStyle = PALETTE.sackcloth_ash;
        ctx.beginPath();
        ctx.moveTo(fig.eyeX - hr * 1.25, fig.eyeY + hr * 1.45);
        ctx.lineTo(fig.eyeX - hr * 0.95, fig.eyeY - hr * 1.15);
        ctx.lineTo(fig.eyeX + hr * 0.35, fig.eyeY - hr * 1.65);
        ctx.lineTo(fig.eyeX + hr * 1.25, fig.eyeY + hr * 1.35);
        ctx.closePath();
        ctx.fill();
      } else if (fig.id === "balcony_maiden" || fig.id === "colonnade_widow" || fig.id === "scale_greengrocer") {
        ctx.fillStyle = fig.id === "balcony_maiden" ? "rgba(228,220,207,0.34)" : "#231e2e";
        ctx.beginPath();
        ctx.arc(fig.eyeX, fig.eyeY + hr * 0.15, hr * 1.22, Math.PI * 0.9, Math.PI * 2.1);
        ctx.lineTo(fig.eyeX + hr * 1.3, fig.eyeY + hr * 1.6);
        ctx.lineTo(fig.eyeX - hr * 1.3, fig.eyeY + hr * 1.6);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = "#b8ab99";
      ctx.beginPath();
      ctx.arc(fig.eyeX, fig.eyeY, hr * 0.84, 0, Math.PI * 2);
      ctx.fill();

      if (fig.id === "urchin_fisherman") {
        ctx.fillStyle = "#7a736b";
        ctx.beginPath();
        ctx.arc(fig.eyeX, fig.eyeY + hr * 0.42, hr * 0.68, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = "#9c836d";
        ctx.beginPath();
        ctx.arc(fig.x - shoulderW * 0.72, fig.y - bodyH * 0.24, hr * 0.36, 0, Math.PI * 2);
        ctx.arc(fig.x + shoulderW * 0.62, fig.y - bodyH * 0.20, hr * 0.36, 0, Math.PI * 2);
        ctx.fill();
      } else if (fig.id === "scale_greengrocer") {
        ctx.strokeStyle = "#b8a690";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fig.x - shoulderW * 0.45, fig.eyeY + hr * 1.5);
        ctx.lineTo(layout.scaleAnchor.x + 8, layout.scaleAnchor.y + 14);
        ctx.stroke();
      } else if (fig.id === "hawser_sailor") {
        ctx.strokeStyle = "#9b8869";
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(fig.x - shoulderW * 0.65, fig.y - bodyH * 0.38);
        ctx.lineTo(layout.width * 0.145, layout.height * 0.695);
        ctx.stroke();
      }

      const eyeColor = fig.id === "straw_mat_sufferer" ? PALETTE.fever_ochre : PALETTE.bone_parchment;
      const eyeSpread = Math.max(2.4, hr * 0.32);
      ctx.fillStyle = eyeColor;
      ctx.beginPath();
      ctx.arc(fig.eyeX - eyeSpread, fig.eyeY - 0.5, 1.7, 0, Math.PI * 2);
      ctx.arc(fig.eyeX + eyeSpread, fig.eyeY - 0.5, 1.7, 0, Math.PI * 2);
      ctx.fill();

      if (fig.isPrimaryStone && fig.keyNum) {
        const bx = fig.x;
        const by = fig.y + 10;
        ctx.fillStyle = isSelected || isLocked ? PALETTE.oil_lantern : "rgba(17,24,39,0.86)";
        ctx.beginPath();
        ctx.arc(bx, by, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = hexToRgba(PALETTE.lantern_halo, 0.55);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = isSelected || isLocked ? PALETTE.harbor_abyss : PALETTE.lantern_halo;
        ctx.font = "600 9px ui-monospace, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(fig.keyNum), bx, by + 0.5);
      }
      ctx.restore();
    }

    function renderWharf(ctx, width, height, params) {
      const p = params || {};
      const useRed = p.reducedMotion !== undefined ? Boolean(p.reducedMotion) : reducedMotion;
      const layout = getLayout(width, height);
      const projected = projectFigures(layout, useRed, p.gazeParalysis);
      lastProjected = { width: layout.width, height: layout.height, figures: projected };

      if (!ctx) return projected;

      ctx.save();
      drawSkyAndNecropolis(ctx, layout, p);
      drawArchitectureAndHarbor(ctx, layout, p);
      drawWharfProps(ctx, layout, p);

      const byDepth = projected.slice().sort(function (a, b) { return a.y - b.y; });
      for (let i = 0; i < byDepth.length; i++) {
        drawWharfFigure(ctx, byDepth[i], layout, p);
        if (byDepth[i].id === "balcony_maiden") {
          drawBalconyRailFront(ctx, layout);
        }
      }

      const paralysis = clamp(Number(p.gazeParalysis) || 0, 0, 1);
      if (paralysis > 0.04 || p.hypothesisMode === "hereafter" || p.hypothesisMode === "hereafter_doubt") {
        const vig = ctx.createRadialGradient(
          layout.width * 0.5, layout.height * 0.5, layout.width * 0.18,
          layout.width * 0.5, layout.height * 0.5, layout.width * 0.72
        );
        vig.addColorStop(0, "rgba(11,17,29,0)");
        vig.addColorStop(1, hexToRgba(PALETTE.harbor_abyss, clamp(0.18 + paralysis * 0.38, 0, 0.62)));
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, layout.width, layout.height);
      }
      ctx.restore();

      return projected;
    }

    function hitTest(px, py, width, height, isTouch) {
      const x = Number(px);
      const y = Number(py);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
      const w = Math.max(240, Number(width) || 1280);
      const h = Math.max(200, Number(height) || 800);
      const figs = (lastProjected && lastProjected.width === w && lastProjected.height === h)
        ? lastProjected.figures
        : projectFigures(getLayout(w, h), reducedMotion, 0);

      const minHit = isTouch ? 44 : 32;
      let best = null;
      let bestScore = Infinity;

      for (let i = 0; i < figs.length; i++) {
        const f = figs[i];
        const effR = Math.max(f.hitRadius, minHit);
        const topY = Math.min(f.eyeY, f.y);
        const botY = Math.max(f.eyeY, f.y);
        const clampedY = clamp(y, topY, botY);
        const segDist = Math.hypot(x - f.x, y - clampedY);
        if (segDist <= effR) {
          const midY = (topY + botY) * 0.5;
          const centerDist = Math.hypot(x - f.x, y - midY);
          if (segDist < bestScore - 0.5 || (Math.abs(segDist - bestScore) <= 0.5 && centerDist < (best ? best._c : Infinity))) {
            bestScore = segDist;
            best = {
              index: f.index,
              id: f.id,
              isPrimaryStone: f.isPrimaryStone,
              keyNum: f.keyNum,
              roleLabel: f.roleLabel,
              station: f.station,
              eyeX: f.eyeX,
              eyeY: f.eyeY,
              distance: Number(segDist.toFixed(2)),
              _c: centerDist
            };
          }
        }
      }
      if (!best) return null;
      delete best._c;
      return best;
    }

    function getState() {
      return {
        timeSec: Number(timeSec.toFixed(4)),
        muted: audio.isMuted(),
        audioUnlocked: audio.isUnlocked(),
        stepCount: stepCount
      };
    }

    function reset() {
      timeSec = 0;
      stepCount = 0;
      waterPhase = 0;
      swayPhase = 0;
      scaleSwingPhase = 0;
      lanternFlicker = 0;
      lastProjected = null;
      return getState();
    }

    return {
      PRIMARY_STONE_IDS: PRIMARY_STONE_IDS,
      WHARF_STRANGERS: WHARF_STRANGERS,
      getLayout: getLayout,
      step: step,
      renderWharf: renderWharf,
      hitTest: hitTest,
      unlockAudio: audio.unlockAudio,
      setMuted: audio.setMuted,
      isMuted: audio.isMuted,
      toggleMute: audio.toggleMute,
      triggerEncounterSound: audio.triggerEncounterSound,
      triggerReciprocalShock: audio.triggerReciprocalShock,
      triggerForeheadTouch: audio.triggerForeheadTouch,
      triggerKaleidoscopeTurn: audio.triggerKaleidoscopeTurn,
      getState: getState,
      reset: reset
    };
  }

  const api = Object.freeze({
    PALETTE: PALETTE,
    PRIMARY_STONE_IDS: PRIMARY_STONE_IDS,
    WHARF_STRANGERS: WHARF_STRANGERS,
    createWharfEngine: createWharfEngine
  });

  globalThis.AdelmaDuskWharf = api;
  if (typeof window !== "undefined") {
    window.AdelmaDuskWharf = api;
  }
})();
