/* City 19: Chloe — Rain Arcade & Ten Chaste Strangers Layer (Standalone ES6 IIFE) */
(function (root) {
  "use strict";

  const PALETTE = Object.freeze({
    slateAbyss: "#0d1218",
    slateRain: "#1b2532",
    wetFlagstone: "#283646",
    arcadeAshlar: "#46586c",
    rainMist: "#7d93a8",
    pearlVeil: "#ebe9e4",
    silkBlush: "#f3b8ad",
    coralSilk: "#e85d56",
    electricAmber: "#ffb338",
    prosaicLead: "#525860"
  });

  const STRANGERS = Object.freeze([
    Object.freeze({
      index: 0,
      id: "girl_twirling_parasol",
      label: "Girl Twirling a Parasol",
      shortName: "Parasol Girl",
      calvinoTrait: "Twirling a coral-silk parasol on her shoulder, spinning rain droplets",
      primaryHue: "#e85d56",
      accentHue: "#f3b8ad",
      lane: 2
    }),
    Object.freeze({
      index: 1,
      id: "veiled_woman_in_black",
      label: "Woman in Black with Face Veiled",
      shortName: "Veiled Woman",
      calvinoTrait: "Severe black velvet, translucent pearl-dark veil hiding all save burning eyes",
      primaryHue: "#161d26",
      accentHue: "#ebe9e4",
      lane: 1
    }),
    Object.freeze({
      index: 2,
      id: "tattooed_giant",
      label: "Tattooed Giant",
      shortName: "Tattooed Giant",
      calvinoTrait: "Towering bare-shouldered colossus etched in electric-amber and slate constellations",
      primaryHue: "#46586c",
      accentHue: "#ffb338",
      lane: 0
    }),
    Object.freeze({
      index: 3,
      id: "white_haired_young_man",
      label: "Young Man with White Hair",
      shortName: "White-Haired Youth",
      calvinoTrait: "Youthful features crowned with premature snow-pearl hair gleaming in wet shadow",
      primaryHue: "#ebe9e4",
      accentHue: "#7d93a8",
      lane: 1
    }),
    Object.freeze({
      index: 4,
      id: "female_dwarf",
      label: "Female Dwarf",
      shortName: "Female Dwarf",
      calvinoTrait: "Compact brocaded figure darting swiftly past porphyry column plinths",
      primaryHue: "#ffb338",
      accentHue: "#e85d56",
      lane: 2
    }),
    Object.freeze({
      index: 5,
      id: "coral_twin_girls",
      label: "Two Twin Girls Dressed in Coral",
      shortName: "Coral Twins",
      calvinoTrait: "Inseparable mirrored sisters in vivid coral silk walking in lockstep",
      primaryHue: "#e85d56",
      accentHue: "#ebe9e4",
      lane: 1
    }),
    Object.freeze({
      index: 6,
      id: "blind_man_with_cheetah",
      label: "Blind Man with a Cheetah on a Chain",
      shortName: "Blind Man & Cheetah",
      calvinoTrait: "Sightless seer holding a taut brass chain to a spotted amber cheetah",
      primaryHue: "#ffb338",
      accentHue: "#ebe9e4",
      lane: 2
    }),
    Object.freeze({
      index: 7,
      id: "courtesan_with_fan",
      label: "Courtesan with a Fan",
      shortName: "Courtesan",
      calvinoTrait: "Pleated ivory-and-coral fan fluttering obliquely below sidelong eyes",
      primaryHue: "#f3b8ad",
      accentHue: "#e85d56",
      lane: 1
    }),
    Object.freeze({
      index: 8,
      id: "sleeping_ephebe",
      label: "Sleeping Ephebe",
      shortName: "Sleeping Ephebe",
      calvinoTrait: "Languid youth leaning half-asleep against a rain-darkened arcade pillar",
      primaryHue: "#7d93a8",
      accentHue: "#f3b8ad",
      lane: 0
    }),
    Object.freeze({
      index: 9,
      id: "fat_woman",
      label: "The Fat Woman",
      shortName: "Fat Woman",
      calvinoTrait: "Voluptuous matron draped in pearl-veil and amber shawls beneath the central arch",
      primaryHue: "#ebe9e4",
      accentHue: "#ffb338",
      lane: 0
    })
  ]);

  const CHOREO_META = [
    { x0: 0.115, dir: 1, speed: 0.039, scaleH: 1.0, subY: -0.006, mode: "walk" },
    { x0: 0.275, dir: 1, speed: 0.031, scaleH: 1.04, subY: -0.008, mode: "walk" },
    { x0: 0.365, dir: -1, speed: 0.027, scaleH: 1.28, subY: -0.012, mode: "walk" },
    { x0: 0.675, dir: 1, speed: 0.036, scaleH: 1.02, subY: 0.006, mode: "walk" },
    { x0: 0.430, dir: -1, speed: 0.048, scaleH: 0.64, subY: 0.010, mode: "walk" },
    { x0: 0.585, dir: -1, speed: 0.033, scaleH: 0.96, subY: 0.0, mode: "walk" },
    { x0: 0.785, dir: -1, speed: 0.029, scaleH: 1.03, subY: 0.004, mode: "walk" },
    { x0: 0.875, dir: -1, speed: 0.034, scaleH: 0.99, subY: 0.012, mode: "walk" },
    { x0: 0.202, dir: 1, speed: 0.0, scaleH: 0.97, subY: -0.003, mode: "pillar" },
    { x0: 0.500, dir: 1, speed: 0.0, scaleH: 1.06, subY: 0.005, mode: "sway" }
  ];

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function hexToRgb(hex) {
    const clean = String(hex || "#7d93a8").replace("#", "");
    const n = parseInt(clean.length === 3
      ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
      : clean, 16) || 0;
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgba(hex, alpha) {
    const c = hexToRgb(hex);
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + clamp(alpha, 0, 1).toFixed(3) + ")";
  }

  function mixHex(hexA, hexB, t) {
    const k = clamp(t, 0, 1);
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    const r = Math.round(a[0] + (b[0] - a[0]) * k);
    const g = Math.round(a[1] + (b[1] - a[1]) * k);
    const bl = Math.round(a[2] + (b[2] - a[2]) * k);
    return "rgb(" + r + "," + g + "," + bl + ")";
  }

  const HARMONIC_NOTES = [293.66, 329.63, 369.99, 440.0, 493.88, 554.37, 587.33, 659.25, 739.99, 880.0];
  const REVERIE_TINTS = {
    meetings: { ratio: 1.5, attack: 0.06, hold: 0.42, wave: "triangle", detune: 4 },
    conversations: { ratio: 1.25, attack: 0.04, hold: 0.36, wave: "sine", detune: -5 },
    surprises: { ratio: 2.0, attack: 0.015, hold: 0.30, wave: "triangle", detune: 9 },
    caresses: { ratio: 1.498, attack: 0.11, hold: 0.54, wave: "sine", detune: 3 },
    bites: { ratio: 1.875, attack: 0.008, hold: 0.24, wave: "sawtooth", detune: -11 }
  };

  function createArcadeAudio(initialRain) {
    let ctx = null;
    let masterGain = null;
    let harmonicBus = null;
    let rainGain = null;
    let rainFilter = null;
    let noiseSource = null;
    let muted = false;
    let rainLevel = clamp(Number(initialRain) || 0.72, 0.15, 1.0);
    let lastGlanceAt = 0;

    function syncGains() {
      if (!ctx || !masterGain || !rainGain) return;
      try {
        const now = ctx.currentTime;
        masterGain.gain.setTargetAtTime(muted ? 0.0 : 0.85, now, 0.04);
        const bed = muted ? 0.0 : (0.035 + rainLevel * 0.115);
        rainGain.gain.setTargetAtTime(bed, now, 0.08);
        if (rainFilter) {
          rainFilter.frequency.setTargetAtTime(520 + rainLevel * 1350, now, 0.1);
        }
      } catch (_) {}
    }

    function unlock() {
      try {
        const AC = root.AudioContext || root.webkitAudioContext;
        if (!AC) return false;
        if (!ctx) {
          ctx = new AC();
          masterGain = ctx.createGain();
          masterGain.gain.value = muted ? 0.0 : 0.85;
          masterGain.connect(ctx.destination);

          harmonicBus = ctx.createGain();
          harmonicBus.gain.value = 0.9;
          harmonicBus.connect(masterGain);

          rainFilter = ctx.createBiquadFilter();
          rainFilter.type = "bandpass";
          rainFilter.frequency.value = 980;
          rainFilter.Q.value = 0.65;

          const stoneShelf = ctx.createBiquadFilter();
          stoneShelf.type = "lowshelf";
          stoneShelf.frequency.value = 320;
          stoneShelf.gain.value = 4.5;

          rainGain = ctx.createGain();
          rainGain.gain.value = 0.001;

          const len = ctx.sampleRate * 3;
          const buf = ctx.createBuffer(1, len, ctx.sampleRate);
          const data = buf.getChannelData(0);
          let b0 = 0, b1 = 0, b2 = 0, b3 = 0;
          for (let i = 0; i < len; i++) {
            const w = Math.random() * 2 - 1;
            b0 = 0.997 * b0 + w * 0.029;
            b1 = 0.985 * b1 + w * 0.032;
            b2 = 0.950 * b2 + w * 0.048;
            b3 = 0.850 * b3 + w * 0.065;
            const droplet = (i % 197 === 0) ? (Math.random() - 0.5) * 0.28 : 0;
            data[i] = clamp((b0 + b1 + b2 + b3) * 1.45 + w * 0.04 + droplet, -0.95, 0.95);
          }
          noiseSource = ctx.createBufferSource();
          noiseSource.buffer = buf;
          noiseSource.loop = true;
          noiseSource.connect(rainFilter);
          rainFilter.connect(stoneShelf);
          stoneShelf.connect(rainGain);
          rainGain.connect(masterGain);
          noiseSource.start(0);
        }
        if (ctx.state === "suspended") ctx.resume();
        syncGains();
        return true;
      } catch (_) {
        return false;
      }
    }

    function playGlanceHarmonic(index, reverieId, vib01) {
      if (muted || !ctx || !harmonicBus) return;
      try {
        const now = ctx.currentTime;
        if (now - lastGlanceAt < 0.055) return;
        lastGlanceAt = now;
        const base = HARMONIC_NOTES[Math.abs(Number(index) || 0) % HARMONIC_NOTES.length];
        const profile = REVERIE_TINTS[reverieId] || REVERIE_TINTS.meetings;
        const amp = 0.028 + clamp(Number(vib01) || 0.7, 0, 1) * 0.042;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const flt = ctx.createBiquadFilter();
        const env = ctx.createGain();

        osc1.type = profile.wave;
        osc1.frequency.setValueAtTime(base, now);
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(base * profile.ratio, now);
        osc2.detune.setValueAtTime(profile.detune, now);

        flt.type = "bandpass";
        flt.frequency.setValueAtTime(base * 2.2, now);
        flt.Q.setValueAtTime(2.6, now);

        env.gain.setValueAtTime(0.0001, now);
        env.gain.linearRampToValueAtTime(amp, now + profile.attack);
        env.gain.exponentialRampToValueAtTime(0.0001, now + profile.attack + profile.hold);

        osc1.connect(flt);
        osc2.connect(flt);
        flt.connect(env);
        env.connect(harmonicBus);
        osc1.start(now);
        osc2.start(now);
        const stopAt = now + profile.attack + profile.hold + 0.05;
        osc1.stop(stopAt);
        osc2.stop(stopAt);
      } catch (_) {}
    }

    function playConstellationChord(shapeKind) {
      if (muted || !ctx || !harmonicBus) return;
      try {
        const now = ctx.currentTime;
        const ratios = shapeKind === "star"
          ? [1.0, 1.5, 2.0, 2.25, 3.0]
          : shapeKind === "triangle"
            ? [1.0, 1.25, 1.5]
            : [1.0, 1.5];
        const rootHz = shapeKind === "star" ? 369.99 : 293.66;
        ratios.forEach(function (r, idx) {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = idx % 2 === 0 ? "sine" : "triangle";
          osc.frequency.setValueAtTime(rootHz * r, now);
          osc.detune.setValueAtTime((idx - 1.5) * 4, now);
          const t0 = now + idx * 0.028;
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.linearRampToValueAtTime(0.026 / Math.sqrt(ratios.length), t0 + 0.08);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.78);
          osc.connect(g);
          g.connect(harmonicBus);
          osc.start(t0);
          osc.stop(t0 + 0.84);
        });
      } catch (_) {}
    }

    function playCollapseShatter() {
      if (muted || !ctx || !masterGain) return;
      try {
        const now = ctx.currentTime;
        if (harmonicBus) {
          harmonicBus.gain.cancelScheduledValues(now);
          harmonicBus.gain.setValueAtTime(0.02, now);
          harmonicBus.gain.linearRampToValueAtTime(0.9, now + 0.9);
        }
        [108, 114.5, 151].forEach(function (hz, i) {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = i === 2 ? "square" : "triangle";
          osc.frequency.setValueAtTime(hz, now);
          osc.frequency.exponentialRampToValueAtTime(46 + i * 7, now + 0.24);
          g.gain.setValueAtTime(0.09 / (i + 1), now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(now);
          osc.stop(now + 0.28);
        });
      } catch (_) {}
    }

    function playCloudburstWash() {
      if (muted || !ctx || !masterGain) return;
      try {
        const now = ctx.currentTime;
        if (rainGain) {
          rainGain.gain.setValueAtTime(0.24, now);
          rainGain.gain.setTargetAtTime(0.035 + rainLevel * 0.115, now + 0.35, 0.35);
        }
        [293.66, 440.0, 659.25].forEach(function (hz, idx) {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(hz * 0.98, now + idx * 0.05);
          osc.frequency.linearRampToValueAtTime(hz, now + 0.45);
          g.gain.setValueAtTime(0.0001, now + idx * 0.05);
          g.gain.linearRampToValueAtTime(0.03, now + 0.22 + idx * 0.05);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 1.05);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(now + idx * 0.05);
          osc.stop(now + 1.1);
        });
      } catch (_) {}
    }

    return {
      unlock: unlock,
      setMuted: function (flag) { muted = Boolean(flag); syncGains(); return muted; },
      toggleMute: function () { muted = !muted; syncGains(); return muted; },
      isMuted: function () { return muted; },
      setRainBed: function (val01) { rainLevel = clamp(Number(val01) || 0.72, 0.15, 1.0); syncGains(); },
      playGlanceHarmonic: playGlanceHarmonic,
      playConstellationChord: playConstellationChord,
      playCollapseShatter: playCollapseShatter,
      playCloudburstWash: playCloudburstWash,
      dispose: function () {
        try { if (noiseSource) noiseSource.stop(); } catch (_) {}
        try { if (ctx) ctx.close(); } catch (_) {}
        ctx = null;
      }
    };
  }

  function resolveStrangerId(val) {
    if (typeof val === "string") {
      for (let i = 0; i < STRANGERS.length; i++) {
        if (STRANGERS[i].id === val) return val;
      }
    } else if (typeof val === "number" && STRANGERS[val]) {
      return STRANGERS[val].id;
    }
    return null;
  }

  function createArcadeScene(opts) {
    const cfg = opts || {};
    let width = Math.max(240, Number(cfg.width) || 1280);
    let height = Math.max(240, Number(cfg.height) || 800);
    let dpr = Math.max(1, Number(cfg.dpr) || 1);
    let rainIntensity = clamp(cfg.rainIntensity == null ? 0.72 : Number(cfg.rainIntensity), 0.15, 1.0);
    let selectedStrangerId = null;
    let collapsed = false;
    let consummatedPair = null;
    let reducedMotion = Boolean(cfg.reducedMotion);
    let timeSec = 0;
    let collapseBlend = 0;
    let cloudburstSurge = 0;

    const audio = createArcadeAudio(rainIntensity);
    if (cfg.muted) audio.setMuted(true);

    let seed = 19019;
    function nextRand() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    }

    const domes = [
      { cx: 0.14, rx: 0.065, ry: 0.085, spire: true },
      { cx: 0.31, rx: 0.082, ry: 0.110, spire: true },
      { cx: 0.49, rx: 0.095, ry: 0.126, spire: true },
      { cx: 0.67, rx: 0.074, ry: 0.096, spire: false },
      { cx: 0.84, rx: 0.068, ry: 0.090, spire: true }
    ];

    const bgRain = Array.from({ length: 64 }, function () {
      return { u: nextRand(), v: nextRand(), len: 0.045 + nextRand() * 0.055, spd: 0.65 + nextRand() * 0.55, a: 0.12 + nextRand() * 0.22 };
    });
    const fgRain = Array.from({ length: 46 }, function () {
      return { u: nextRand(), v: nextRand(), len: 0.065 + nextRand() * 0.085, spd: 0.95 + nextRand() * 0.75, a: 0.16 + nextRand() * 0.28 };
    });
    const puddles = Array.from({ length: 16 }, function (_, idx) {
      return { u: 0.08 + (idx / 15) * 0.84, laneBias: (idx % 3) * 0.33, phase: nextRand(), spd: 0.45 + nextRand() * 0.45 };
    });

    const layout = {
      isCompact: false, leftPad: 64, rightPad: 1216, spanW: 1152, bayW: 164,
      pierHalfW: 12, pierXs: [], corniceY: 76, archCrownY: 124, impostY: 236,
      plinthY: 444, eaveDripY: 584, laneFeetY: [462, 516, 574], baseFigH: 108, hitRadius: 38
    };

    const rt = STRANGERS.map(function (def, i) {
      const m = CHOREO_META[i];
      return {
        walkXNorm: m.x0,
        renderXNorm: m.x0,
        dir: m.dir,
        phase: i * 0.83,
        parasolAngle: i * 0.5,
        gazeDir: m.dir,
        inPair: false
      };
    });

    const liveStrangers = STRANGERS.map(function (def) {
      return {
        index: def.index,
        id: def.id,
        label: def.label,
        shortName: def.shortName,
        calvinoTrait: def.calvinoTrait,
        primaryHue: def.primaryHue,
        accentHue: def.accentHue,
        x: 0,
        y: 0,
        eyeX: 0,
        eyeY: 0,
        feetY: 0,
        xNorm: CHOREO_META[def.index].x0,
        yNorm: 0.6,
        hitRadius: 36,
        dir: CHOREO_META[def.index].dir,
        lane: def.lane,
        glanceGlow: 0,
        knowsAnyone: false
      };
    });

    function computeLayout() {
      layout.isCompact = width < 640;
      layout.leftPad = width * 0.052;
      layout.rightPad = width * 0.948;
      layout.spanW = layout.rightPad - layout.leftPad;
      layout.bayW = layout.spanW / 7;
      layout.pierHalfW = clamp(layout.bayW * 0.088, 6, 17);
      layout.pierXs = [];
      for (let i = 0; i <= 7; i++) {
        layout.pierXs.push(layout.leftPad + i * layout.bayW);
      }
      layout.corniceY = height * (layout.isCompact ? 0.105 : 0.092);
      layout.archCrownY = height * (layout.isCompact ? 0.168 : 0.152);
      layout.impostY = height * (layout.isCompact ? 0.305 : 0.292);
      layout.plinthY = height * (layout.isCompact ? 0.525 : 0.552);
      layout.laneFeetY = layout.isCompact
        ? [height * 0.548, height * 0.636, height * 0.726]
        : [height * 0.576, height * 0.646, height * 0.718];
      layout.eaveDripY = height * (layout.isCompact ? 0.755 : 0.748);
      layout.baseFigH = clamp(height * (layout.isCompact ? 0.104 : 0.134), 64, 124);
      layout.hitRadius = Math.max(33, Math.round(Math.min(width, height) * 0.048));
      rt[8].walkXNorm = clamp((layout.pierXs[1] + layout.pierHalfW * 1.45) / width, 0.088, 0.912);
      syncStrangerCoords();
    }

    function syncStrangerCoords() {
      let pA = null, pB = null;
      if (collapsed && Array.isArray(consummatedPair) && consummatedPair.length >= 2) {
        pA = resolveStrangerId(consummatedPair[0]);
        pB = resolveStrangerId(consummatedPair[1]);
      }
      let midNorm = 0.5;
      if (pA && pB && pA !== pB) {
        const idxA = STRANGERS.findIndex(function (d) { return d.id === pA; });
        const idxB = STRANGERS.findIndex(function (d) { return d.id === pB; });
        if (idxA >= 0 && idxB >= 0) {
          midNorm = clamp((rt[idxA].walkXNorm + rt[idxB].walkXNorm) * 0.5, 0.20, 0.80);
        }
      }
      const sepNorm = clamp(46 / width, 0.042, 0.125);

      for (let i = 0; i < 10; i++) {
        const s = liveStrangers[i];
        const m = CHOREO_META[i];
        const r = rt[i];
        const isA = collapsed && pA && s.id === pA && pB && pA !== pB;
        const isB = collapsed && pB && s.id === pB && pA && pA !== pB;
        r.inPair = Boolean(isA || isB);

        let targetXNorm = r.walkXNorm;
        let effLaneY = layout.laneFeetY[s.lane] + m.subY * height;
        if (isA || isB) {
          targetXNorm = clamp(midNorm + (isA ? -sepNorm * 0.5 : sepNorm * 0.5), 0.09, 0.91);
          effLaneY = layout.laneFeetY[1] + (isA ? -2 : 2);
          s.dir = isA ? 1 : -1;
        } else {
          s.dir = r.dir;
        }
        r.renderXNorm = targetXNorm;

        const laneScale = 0.90 + s.lane * 0.075;
        const figH = layout.baseFigH * m.scaleH * laneScale;
        const bob = (reducedMotion || collapsed || m.mode !== "walk")
          ? 0
          : Math.abs(Math.sin(r.phase * 2.1)) * 2.6;

        s.xNorm = clamp(r.renderXNorm, 0.082, 0.918);
        s.x = s.xNorm * width;
        s.feetY = effLaneY;
        s.eyeY = s.feetY - figH * 0.86 - bob;
        s.eyeX = s.x + (s.id === "sleeping_ephebe" ? 3 : s.dir * 2.5);
        s.y = s.feetY - figH * 0.48 - bob * 0.5;
        s.yNorm = clamp(s.y / height, 0, 1);
        s.hitRadius = layout.hitRadius;
        s.knowsAnyone = Boolean(collapsed && r.inPair);
      }
    }

    function parsePair(raw) {
      if (!raw) return null;
      if (Array.isArray(raw) && raw.length >= 2) {
        const a = resolveStrangerId(raw[0]);
        const b = resolveStrangerId(raw[1]);
        return (a && b && a !== b) ? [a, b] : null;
      }
      if (typeof raw === "object") {
        const a = resolveStrangerId(raw.idA || raw.a || raw.fromId || raw.sourceId);
        const b = resolveStrangerId(raw.idB || raw.b || raw.toId || raw.targetId);
        return (a && b && a !== b) ? [a, b] : null;
      }
      return null;
    }

    function step(dtSec, simContext) {
      const dt = clamp(Number(dtSec) || 0.016, 0, 0.25);
      const sc = simContext || {};
      if (sc.rainIntensity != null && !Number.isNaN(Number(sc.rainIntensity))) {
        rainIntensity = clamp(Number(sc.rainIntensity), 0.15, 1.0);
        audio.setRainBed(rainIntensity);
      }
      if (sc.reducedMotion != null) reducedMotion = Boolean(sc.reducedMotion);
      collapsed = Boolean(sc.collapsed);
      consummatedPair = collapsed ? (parsePair(sc.consummatedPair) || consummatedPair) : null;

      timeSec += dt;
      collapseBlend = clamp(collapseBlend + (collapsed ? dt * 3.6 : -dt * 2.8), 0, 1);
      cloudburstSurge = Math.max(0, cloudburstSurge - dt * 1.15);

      const lockGlow = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      if (!collapsed && Array.isArray(sc.activeLocks)) {
        for (let k = 0; k < sc.activeLocks.length; k++) {
          const lk = sc.activeLocks[k];
          if (!lk) continue;
          const id1 = resolveStrangerId(Array.isArray(lk) ? lk[0] : (lk.fromId != null ? lk.fromId : (lk.sourceId != null ? lk.sourceId : (lk.idA != null ? lk.idA : lk.a))));
          const id2 = resolveStrangerId(Array.isArray(lk) ? lk[1] : (lk.toId != null ? lk.toId : (lk.targetId != null ? lk.targetId : (lk.idB != null ? lk.idB : lk.b))));
          for (let i = 0; i < 10; i++) {
            if (STRANGERS[i].id === id1 || STRANGERS[i].id === id2) lockGlow[i] = 1.0;
          }
        }
      }

      for (let i = 0; i < 10; i++) {
        const m = CHOREO_META[i];
        const r = rt[i];
        const s = liveStrangers[i];
        s.glanceGlow = collapsed ? 0 : clamp(s.glanceGlow + (lockGlow[i] - s.glanceGlow) * clamp(dt * 8, 0, 1), 0, 1);

        if (!collapsed) {
          if (m.mode === "walk") {
            let speedMul = 1.0;
            for (let j = 0; j < 10; j++) {
              if (j !== i && STRANGERS[j].lane === s.lane && Math.abs(r.walkXNorm - rt[j].walkXNorm) < 0.036) {
                speedMul = i < j ? 1.18 : 0.86;
              }
            }
            r.walkXNorm += r.dir * m.speed * speedMul * dt;
            if (r.walkXNorm <= 0.086) { r.walkXNorm = 0.086; r.dir = 1; }
            if (r.walkXNorm >= 0.914) { r.walkXNorm = 0.914; r.dir = -1; }
            if (!reducedMotion) {
              r.phase += dt * (2.6 + m.speed * 38);
              r.parasolAngle += dt * 1.85;
            }
          } else if (m.mode === "sway") {
            r.walkXNorm = 0.500 + (reducedMotion ? 0 : Math.sin(timeSec * 0.85) * 0.005);
            if (!reducedMotion) r.phase += dt * 1.1;
          } else {
            r.walkXNorm = clamp((layout.pierXs[1] + layout.pierHalfW * 1.45) / width, 0.088, 0.912);
          }
        }
      }

      const rainStep = reducedMotion ? dt * 0.18 : dt;
      const effRain = clamp(rainIntensity + cloudburstSurge * 0.45, 0.15, 1.35);
      for (let i = 0; i < bgRain.length; i++) {
        bgRain[i].v = (bgRain[i].v + rainStep * bgRain[i].spd * (0.65 + effRain * 0.6)) % 1;
        bgRain[i].u = (bgRain[i].u - rainStep * 0.05 + 1) % 1;
      }
      for (let i = 0; i < fgRain.length; i++) {
        fgRain[i].v = (fgRain[i].v + rainStep * fgRain[i].spd * (0.75 + effRain * 0.7)) % 1;
        fgRain[i].u = (fgRain[i].u - rainStep * 0.07 + 1) % 1;
      }
      for (let i = 0; i < puddles.length; i++) {
        puddles[i].phase = (puddles[i].phase + rainStep * puddles[i].spd * (0.5 + effRain * 0.6)) % 1;
      }

      syncStrangerCoords();
    }

    function renderBackdrop(ctx) {
      if (!ctx) return;
      ctx.save();
      const skyGrad = ctx.createLinearGradient(0, 0, 0, layout.plinthY);
      skyGrad.addColorStop(0, PALETTE.slateAbyss);
      skyGrad.addColorStop(0.58, PALETTE.slateRain);
      skyGrad.addColorStop(1, mixHex(PALETTE.wetFlagstone, PALETTE.rainMist, 0.22));
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, layout.plinthY + 4);

      ctx.fillStyle = rgba(PALETTE.slateAbyss, 0.56);
      const horizonY = layout.plinthY * 0.86;
      for (let i = 0; i < domes.length; i++) {
        const d = domes[i];
        const cx = d.cx * width, rx = d.rx * width, ry = d.ry * height;
        ctx.beginPath();
        ctx.ellipse(cx, horizonY, rx, ry, 0, Math.PI, 0, false);
        ctx.lineTo(cx + rx * 1.15, layout.plinthY);
        ctx.lineTo(cx - rx * 1.15, layout.plinthY);
        ctx.closePath();
        ctx.fill();
        if (d.spire) {
          ctx.fillRect(cx - 2, horizonY - ry - height * 0.045, 4, height * 0.048);
        }
      }

      const mistGrad = ctx.createLinearGradient(0, horizonY - height * 0.09, 0, layout.plinthY);
      mistGrad.addColorStop(0, rgba(PALETTE.rainMist, 0));
      mistGrad.addColorStop(1, rgba(PALETTE.rainMist, 0.22 + rainIntensity * 0.14));
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, horizonY - height * 0.09, width, layout.plinthY - horizonY + height * 0.1);

      const bgCount = Math.floor(bgRain.length * clamp(rainIntensity + cloudburstSurge * 0.3, 0.2, 1));
      ctx.lineWidth = 1;
      for (let i = 0; i < bgCount; i++) {
        const r = bgRain[i];
        const rx = r.u * width;
        const ry = layout.archCrownY + r.v * (layout.plinthY - layout.archCrownY);
        const rl = r.len * height;
        ctx.strokeStyle = rgba(PALETTE.rainMist, r.a * (0.6 + rainIntensity * 0.5));
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - rl * 0.18, ry + rl);
        ctx.stroke();
      }

      ctx.fillStyle = mixHex(PALETTE.slateAbyss, PALETTE.slateRain, 0.45);
      ctx.fillRect(0, 0, width, layout.corniceY);
      ctx.fillRect(0, layout.corniceY, layout.leftPad, layout.plinthY - layout.corniceY);
      ctx.fillRect(layout.rightPad, layout.corniceY, width - layout.rightPad, layout.plinthY - layout.corniceY);

      const spandrelTone = mixHex(PALETTE.slateRain, PALETTE.arcadeAshlar, 0.42);
      for (let b = 0; b < 7; b++) {
        const x0 = layout.pierXs[b];
        const x1 = layout.pierXs[b + 1];
        const xm = (x0 + x1) * 0.5;
        const archR = (x1 - x0) * 0.5 - layout.pierHalfW * 0.55;

        ctx.strokeStyle = rgba(PALETTE.arcadeAshlar, 0.36);
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x0 + layout.pierHalfW, layout.impostY);
        ctx.quadraticCurveTo(xm, layout.archCrownY + 18, x1 - layout.pierHalfW, layout.impostY);
        ctx.moveTo(x0 + layout.pierHalfW, layout.impostY + 14);
        ctx.lineTo(xm, layout.archCrownY + 6);
        ctx.lineTo(x1 - layout.pierHalfW, layout.impostY + 14);
        ctx.stroke();

        ctx.fillStyle = spandrelTone;
        ctx.beginPath();
        ctx.rect(x0, layout.corniceY, x1 - x0, layout.impostY - layout.corniceY);
        ctx.moveTo(xm + archR, layout.impostY);
        ctx.arc(xm, layout.impostY, Math.max(8, archR), 0, Math.PI, true);
        ctx.closePath();
        ctx.fill("evenodd");

        ctx.strokeStyle = rgba(PALETTE.rainMist, 0.34);
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(xm, layout.impostY, Math.max(8, archR), Math.PI, 0, false);
        ctx.stroke();
      }
      renderPiersAndWetPavement(ctx);
      ctx.restore();
    }

    function renderPiersAndWetPavement(ctx) {
      const deckH = height - layout.plinthY;
      const deckGrad = ctx.createLinearGradient(0, layout.plinthY, 0, height);
      deckGrad.addColorStop(0, PALETTE.wetFlagstone);
      deckGrad.addColorStop(0.45, mixHex(PALETTE.slateRain, PALETTE.wetFlagstone, 0.5));
      deckGrad.addColorStop(1, PALETTE.slateAbyss);
      ctx.fillStyle = deckGrad;
      ctx.fillRect(0, layout.plinthY, width, deckH);

      ctx.strokeStyle = rgba(PALETTE.rainMist, 0.12);
      ctx.lineWidth = 1;
      for (let r = 1; r <= 6; r++) {
        const py = layout.plinthY + Math.pow(r / 6, 1.35) * deckH;
        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
      }
      for (let c = 0; c <= 14; c++) {
        const topX = layout.leftPad + (c / 14) * layout.spanW;
        const botX = width * 0.5 + (topX - width * 0.5) * 1.34;
        ctx.beginPath();
        ctx.moveTo(topX, layout.plinthY);
        ctx.lineTo(botX, height);
        ctx.stroke();
      }

      const sconceColor = mixHex(PALETTE.electricAmber, PALETTE.prosaicLead, collapseBlend * 0.85);
      for (let i = 0; i <= 7; i++) {
        const px = layout.pierXs[i];
        const pw = layout.pierHalfW;

        const reflGrad = ctx.createLinearGradient(0, layout.plinthY, 0, height);
        reflGrad.addColorStop(0, rgba(PALETTE.slateAbyss, 0.46));
        reflGrad.addColorStop(1, rgba(PALETTE.slateAbyss, 0.04));
        ctx.fillStyle = reflGrad;
        ctx.fillRect(px - pw * 1.15, layout.plinthY, pw * 2.3, deckH * 0.85);

        const colGrad = ctx.createLinearGradient(px - pw, 0, px + pw, 0);
        colGrad.addColorStop(0, PALETTE.slateRain);
        colGrad.addColorStop(0.55, PALETTE.arcadeAshlar);
        colGrad.addColorStop(1, PALETTE.slateAbyss);
        ctx.fillStyle = colGrad;
        ctx.fillRect(px - pw, layout.impostY, pw * 2, layout.plinthY - layout.impostY);

        ctx.fillStyle = mixHex(PALETTE.arcadeAshlar, PALETTE.rainMist, 0.25);
        ctx.fillRect(px - pw * 1.32, layout.impostY - 7, pw * 2.64, 9);
        ctx.fillStyle = mixHex(PALETTE.slateAbyss, PALETTE.arcadeAshlar, 0.4);
        ctx.fillRect(px - pw * 1.38, layout.plinthY - 14, pw * 2.76, 15);

        if (i > 0 && i < 7) {
          const ly = layout.impostY + (layout.plinthY - layout.impostY) * 0.24;
          const flicker = reducedMotion ? 1 : (0.92 + Math.sin(timeSec * 3.1 + i * 1.7) * 0.08);
          const glowR = layout.bayW * 0.42;
          const lg = ctx.createRadialGradient(px, ly, 2, px, ly, glowR);
          lg.addColorStop(0, rgba(sconceColor, (0.38 - collapseBlend * 0.22) * flicker));
          lg.addColorStop(1, rgba(sconceColor, 0));
          ctx.fillStyle = lg;
          ctx.beginPath();
          ctx.arc(px, ly, glowR, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = sconceColor;
          ctx.fillRect(px - 2.5, ly - 5, 5, 9);

          const rg = ctx.createLinearGradient(0, layout.plinthY, 0, layout.plinthY + deckH * 0.55);
          rg.addColorStop(0, rgba(sconceColor, 0.18 * (1 - collapseBlend * 0.7)));
          rg.addColorStop(1, rgba(sconceColor, 0));
          ctx.fillStyle = rg;
          ctx.fillRect(px - 7, layout.plinthY, 14, deckH * 0.55);
        }
      }

      ctx.fillStyle = PALETTE.arcadeAshlar;
      ctx.fillRect(0, layout.corniceY - 4, width, 6);
      ctx.fillStyle = rgba(PALETTE.rainMist, 0.35);
      ctx.fillRect(0, layout.corniceY - 4, width, 2);

      for (let i = 0; i < 10; i++) {
        const s = liveStrangers[i];
        const figH = (s.feetY - s.eyeY) / 0.86;
        const reflH = figH * 0.68;
        const mainTone = mixHex(s.primaryHue, PALETTE.prosaicLead, collapseBlend * 0.85);
        const fg = ctx.createLinearGradient(0, s.feetY, 0, s.feetY + reflH);
        fg.addColorStop(0, rgba(mainTone, 0.26));
        fg.addColorStop(1, rgba(mainTone, 0));
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.ellipse(s.x, s.feetY + reflH * 0.45, Math.max(8, figH * 0.16), reflH * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawStrangerEarly(ctx, s, r, figH, pri, acc) {
      const x = s.x, fy = s.feetY, ey = s.eyeY, dir = s.dir;
      const w = figH * 0.22;
      if (s.index === 0) {
        ctx.fillStyle = mixHex(PALETTE.slateRain, pri, 0.35);
        ctx.beginPath();
        ctx.moveTo(x - w * 0.45, ey + figH * 0.14);
        ctx.lineTo(x + w * 0.45, ey + figH * 0.14);
        ctx.lineTo(x + w * 1.15, fy);
        ctx.lineTo(x - w * 1.15, fy);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = acc;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - w * 1.08, fy - 3);
        ctx.lineTo(x + w * 1.08, fy - 3);
        ctx.stroke();

        const px = x - dir * w * 0.85, py = ey - figH * 0.14, pr = figH * 0.28;
        ctx.strokeStyle = PALETTE.pearlVeil;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x + dir * 2, ey + figH * 0.22);
        ctx.lineTo(px, py);
        ctx.stroke();

        ctx.fillStyle = pri;
        ctx.beginPath();
        ctx.arc(px, py, pr, Math.PI * 1.05, Math.PI * 2.05);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = acc;
        ctx.lineWidth = 1.1;
        for (let k = -2; k <= 2; k++) {
          const ang = -Math.PI * 0.5 + k * 0.36 + Math.sin(r.parasolAngle) * 0.18;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px + Math.cos(ang) * pr, py + Math.sin(ang) * pr * 0.85);
          ctx.stroke();
        }
        if (!reducedMotion && !collapsed) {
          ctx.fillStyle = rgba(PALETTE.pearlVeil, 0.78);
          for (let d = 0; d < 3; d++) {
            const da = r.parasolAngle * 1.7 + d * 2.1;
            ctx.fillRect(px + Math.cos(da) * (pr + 5), py + Math.sin(da) * 5, 2.2, 2.2);
          }
        }
      } else if (s.index === 1) {
        ctx.fillStyle = pri;
        ctx.beginPath();
        ctx.moveTo(x - w * 0.55, ey + figH * 0.08);
        ctx.lineTo(x + w * 0.55, ey + figH * 0.08);
        ctx.lineTo(x + w * 1.05 - dir * 5, fy);
        ctx.lineTo(x - w * 1.05 - dir * 3, fy);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = rgba(PALETTE.rainMist, 0.55);
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.fillStyle = rgba(acc, 0.32);
        ctx.beginPath();
        ctx.moveTo(x - w * 0.45, ey - 1);
        ctx.lineTo(x + w * 0.52, ey - 1);
        ctx.lineTo(x + w * 0.7 - dir * 8, ey + figH * 0.36);
        ctx.lineTo(x - w * 0.5, ey + figH * 0.28);
        ctx.closePath();
        ctx.fill();
      } else if (s.index === 2) {
        ctx.fillStyle = pri;
        ctx.beginPath();
        ctx.moveTo(x - w * 1.15, ey + figH * 0.12);
        ctx.lineTo(x + w * 1.15, ey + figH * 0.12);
        ctx.lineTo(x + w * 0.78, ey + figH * 0.56);
        ctx.lineTo(x + w * 0.85, fy);
        ctx.lineTo(x - w * 0.85, fy);
        ctx.lineTo(x - w * 0.78, ey + figH * 0.56);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = acc;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x - w * 0.75, ey + figH * 0.20);
        ctx.lineTo(x, ey + figH * 0.34);
        ctx.lineTo(x + w * 0.75, ey + figH * 0.20);
        ctx.moveTo(x - w * 0.45, ey + figH * 0.42);
        ctx.lineTo(x + w * 0.45, ey + figH * 0.26);
        ctx.stroke();
      } else if (s.index === 3) {
        ctx.fillStyle = mixHex(PALETTE.slateRain, acc, 0.42);
        ctx.beginPath();
        ctx.moveTo(x - w * 0.58, ey + figH * 0.12);
        ctx.lineTo(x + w * 0.58, ey + figH * 0.12);
        ctx.lineTo(x + w * 0.72, fy);
        ctx.lineTo(x - w * 0.72, fy);
        ctx.closePath();
        ctx.fill();
      } else if (s.index === 4) {
        ctx.fillStyle = pri;
        ctx.beginPath();
        ctx.moveTo(x - w * 0.85, ey + figH * 0.16);
        ctx.lineTo(x + w * 0.85, ey + figH * 0.16);
        ctx.lineTo(x + w * 1.38, fy);
        ctx.lineTo(x - w * 1.38, fy);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = acc;
        ctx.lineWidth = 2.2;
        ctx.strokeRect(x - w * 0.95, fy - figH * 0.22, w * 1.9, figH * 0.14);
      }
    }

    function drawStrangerFull(ctx, s, r, selectedOrHovered) {
      const figH = (s.feetY - s.eyeY) / 0.86;
      const w = figH * 0.22;
      const x = s.x, fy = s.feetY, ey = s.eyeY, dir = s.dir;
      const leadMix = r.inPair ? collapseBlend * 0.55 : collapseBlend * 0.88;
      const pri = mixHex(s.primaryHue, PALETTE.prosaicLead, leadMix);
      const acc = mixHex(s.accentHue, PALETTE.prosaicLead, leadMix);

      ctx.save();
      if (s.glanceGlow > 0.02 || selectedOrHovered) {
        const haloR = figH * (selectedOrHovered ? 0.58 : 0.44);
        const hg = ctx.createRadialGradient(x, s.y, 3, x, s.y, haloR);
        const hCol = selectedOrHovered ? PALETTE.pearlVeil : s.accentHue;
        hg.addColorStop(0, rgba(hCol, selectedOrHovered ? 0.30 : s.glanceGlow * 0.28));
        hg.addColorStop(1, rgba(hCol, 0));
        ctx.fillStyle = hg;
        ctx.beginPath();
        ctx.arc(x, s.y, haloR, 0, Math.PI * 2);
        ctx.fill();
      }

      if (s.index <= 4) {
        drawStrangerEarly(ctx, s, r, figH, pri, acc);
      } else if (s.index === 5) {
        [-w * 0.55, w * 0.55].forEach(function (dx) {
          ctx.fillStyle = pri;
          ctx.beginPath();
          ctx.moveTo(x + dx - w * 0.34, ey + figH * 0.14);
          ctx.lineTo(x + dx + w * 0.34, ey + figH * 0.14);
          ctx.lineTo(x + dx + w * 0.68, fy);
          ctx.lineTo(x + dx - w * 0.68, fy);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = acc;
          ctx.fillRect(x + dx - w * 0.36, ey + figH * 0.34, w * 0.72, 3);
        });
      } else if (s.index === 6) {
        ctx.fillStyle = mixHex(PALETTE.arcadeAshlar, PALETTE.slateAbyss, 0.35);
        ctx.beginPath();
        ctx.moveTo(x - w * 0.55, ey + figH * 0.12);
        ctx.lineTo(x + w * 0.55, ey + figH * 0.12);
        ctx.lineTo(x + w * 0.85, fy);
        ctx.lineTo(x - w * 0.85, fy);
        ctx.closePath();
        ctx.fill();

        const cx = x + dir * figH * 0.34, cy = fy - figH * 0.22;
        ctx.strokeStyle = pri;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(x + dir * w * 0.4, ey + figH * 0.38);
        ctx.quadraticCurveTo((x + cx) * 0.5, cy - 4, cx - dir * 5, cy - 5);
        ctx.stroke();

        ctx.fillStyle = pri;
        ctx.beginPath();
        ctx.ellipse(cx, cy, figH * 0.17, figH * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + dir * figH * 0.16, cy - figH * 0.08, figH * 0.055, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx - figH * 0.12, cy, 3, figH * 0.22);
        ctx.fillRect(cx + figH * 0.09, cy, 3, figH * 0.22);
        ctx.fillStyle = PALETTE.slateAbyss;
        for (let sp = -2; sp <= 2; sp++) {
          ctx.fillRect(cx + sp * 4.2, cy - 2 + (sp % 2) * 2, 2, 2);
        }
      } else if (s.index === 7) {
        ctx.fillStyle = pri;
        ctx.beginPath();
        ctx.moveTo(x - w * 0.52, ey + figH * 0.13);
        ctx.lineTo(x + w * 0.52, ey + figH * 0.13);
        ctx.lineTo(x + w * 0.96, fy);
        ctx.lineTo(x - w * 0.88, fy);
        ctx.closePath();
        ctx.fill();
        const flutter = reducedMotion ? 0 : Math.sin(r.phase * 2.5) * 0.14;
        ctx.fillStyle = acc;
        ctx.beginPath();
        ctx.moveTo(x + dir * 4, ey + figH * 0.18);
        ctx.arc(x + dir * 4, ey + figH * 0.18, figH * 0.19, -Math.PI * 0.88 + flutter, -Math.PI * 0.16 + flutter);
        ctx.closePath();
        ctx.fill();
      } else if (s.index === 8) {
        ctx.fillStyle = pri;
        ctx.beginPath();
        ctx.moveTo(x - w * 0.65, ey + figH * 0.12);
        ctx.lineTo(x + w * 0.48, ey + figH * 0.16);
        ctx.lineTo(x + w * 0.72, fy);
        ctx.lineTo(x - w * 0.42, fy);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = acc;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - w * 0.5, ey + figH * 0.18);
        ctx.quadraticCurveTo(x + w * 0.2, ey + figH * 0.38, x + w * 0.55, ey + figH * 0.52);
        ctx.stroke();
      } else if (s.index === 9) {
        ctx.fillStyle = pri;
        ctx.beginPath();
        ctx.ellipse(x, fy - figH * 0.40, w * 1.55, figH * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = acc;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.arc(x, ey + figH * 0.28, w * 1.25, 0.15, Math.PI - 0.15);
        ctx.stroke();
      }

      const headR = Math.max(4.5, figH * 0.088);
      if (s.index === 5) {
        [-w * 0.55, w * 0.55].forEach(function (dx) {
          ctx.fillStyle = PALETTE.pearlVeil;
          ctx.beginPath();
          ctx.arc(x + dx, ey, headR * 0.86, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        ctx.fillStyle = s.index === 1 ? PALETTE.slateAbyss : mixHex(PALETTE.pearlVeil, pri, 0.25);
        ctx.beginPath();
        ctx.arc(x + (s.index === 8 ? 2.5 : 0), ey, headR, 0, Math.PI * 2);
        ctx.fill();
        if (s.index === 3) {
          ctx.fillStyle = PALETTE.pearlVeil;
          ctx.beginPath();
          ctx.arc(x - dir * 2, ey - headR * 0.35, headR * 1.28, Math.PI * 0.85, Math.PI * 2.25);
          ctx.fill();
        } else if (s.index === 6) {
          ctx.fillStyle = PALETTE.pearlVeil;
          ctx.fillRect(x - headR, ey - 2, headR * 2, 3.2);
        } else if (s.index === 1) {
          ctx.fillStyle = PALETTE.electricAmber;
          ctx.fillRect(x + dir * 1.5 - 2.5, ey - 1.2, 2, 2);
          ctx.fillRect(x + dir * 1.5 + 1.2, ey - 1.2, 2, 2);
        }
      }

      if (selectedOrHovered) {
        ctx.strokeStyle = PALETTE.pearlVeil;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(x, fy + 2, w * 1.35, 5.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function renderStrangersAndForeRain(ctx, overlayState) {
      if (!ctx) return;
      const ov = overlayState || {};
      const selId = ov.selectedStrangerId !== undefined ? ov.selectedStrangerId : selectedStrangerId;
      const hovId = ov.hoveredStrangerId || ov.hoverId || null;

      ctx.save();
      for (let i = 0; i < puddles.length; i++) {
        const p = puddles[i];
        const px = p.u * width;
        const py = layout.eaveDripY + p.laneBias * (height - layout.eaveDripY) * 0.88;
        const rad = 4 + p.phase * (18 + cloudburstSurge * 14);
        ctx.strokeStyle = rgba(PALETTE.rainMist, (1 - p.phase) * (0.24 + rainIntensity * 0.2));
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(px, py, rad, rad * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      const order = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].sort(function (a, b) {
        return liveStrangers[a].feetY - liveStrangers[b].feetY;
      });
      for (let k = 0; k < 10; k++) {
        const idx = order[k];
        const s = liveStrangers[idx];
        drawStrangerFull(ctx, s, rt[idx], s.id === selId || s.id === hovId);
      }

      if (collapsed && Array.isArray(consummatedPair) && consummatedPair.length >= 2) {
        const sA = getStrangerById(resolveStrangerId(consummatedPair[0]));
        const sB = getStrangerById(resolveStrangerId(consummatedPair[1]));
        if (sA && sB) {
          const mx = (sA.x + sB.x) * 0.5, my = (sA.y + sB.y) * 0.5;
          ctx.strokeStyle = PALETTE.prosaicLead;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(sA.x + 6, sA.eyeY + 8);
          ctx.lineTo(mx, my - 6);
          ctx.lineTo(sB.x - 6, sB.eyeY + 8);
          ctx.stroke();
        }
      }

      const fgCount = Math.floor(fgRain.length * clamp(rainIntensity + cloudburstSurge * 0.35, 0.2, 1));
      ctx.lineWidth = 1.25;
      for (let i = 0; i < fgCount; i++) {
        const f = fgRain[i];
        const rx = f.u * width;
        const ry = f.v * height;
        const rl = f.len * height * (1 + cloudburstSurge * 0.45);
        ctx.strokeStyle = rgba(PALETTE.pearlVeil, f.a * (0.35 + rainIntensity * 0.35 + cloudburstSurge * 0.25));
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - rl * 0.16, ry + rl);
        ctx.stroke();
      }

      if (cloudburstSurge > 0.01) {
        ctx.fillStyle = rgba(PALETTE.rainMist, cloudburstSurge * 0.22);
        ctx.fillRect(0, 0, width, height);
      }

      const tagId = hovId || selId;
      const tagTarget = tagId ? getStrangerById(tagId) : null;
      if (tagTarget && ov.showLabels !== false) {
        const text = tagTarget.shortName;
        ctx.font = "600 12px ui-sans-serif, system-ui, sans-serif";
        const tw = ctx.measureText(text).width + 18;
        const tx = clamp(tagTarget.x - tw * 0.5, 10, width - tw - 10);
        const ty = Math.max(18, tagTarget.eyeY - 30);
        ctx.fillStyle = rgba(PALETTE.slateAbyss, 0.84);
        ctx.fillRect(tx, ty, tw, 22);
        ctx.strokeStyle = rgba(PALETTE.pearlVeil, 0.45);
        ctx.lineWidth = 1;
        ctx.strokeRect(tx, ty, tw, 22);
        ctx.fillStyle = PALETTE.pearlVeil;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, tx + tw * 0.5, ty + 11);
      }
      ctx.restore();
    }

    function getStrangerById(id) {
      for (let i = 0; i < 10; i++) {
        if (liveStrangers[i].id === id) return liveStrangers[i];
      }
      return null;
    }

    function hitTestStranger(px, py) {
      if (typeof px !== "number" || typeof py !== "number" || Number.isNaN(px) || Number.isNaN(py)) return null;
      let best = null;
      let bestDist = Infinity;
      for (let i = 0; i < 10; i++) {
        const s = liveStrangers[i];
        const dc = Math.hypot(px - s.x, py - s.y);
        const segY = clamp(py, s.eyeY - 8, s.feetY);
        const ds = Math.hypot(px - s.x, py - segY);
        if (dc <= s.hitRadius || ds <= s.hitRadius * 0.92) {
          if (dc < bestDist) {
            bestDist = dc;
            best = s;
          }
        }
      }
      return best;
    }

    function reset() {
      collapsed = false;
      consummatedPair = null;
      collapseBlend = 0;
      cloudburstSurge = 0;
      selectedStrangerId = null;
      rainIntensity = 0.72;
      audio.setRainBed(rainIntensity);
      for (let i = 0; i < 10; i++) {
        rt[i].walkXNorm = CHOREO_META[i].x0;
        rt[i].renderXNorm = CHOREO_META[i].x0;
        rt[i].dir = CHOREO_META[i].dir;
        rt[i].phase = i * 0.83;
        rt[i].inPair = false;
        liveStrangers[i].glanceGlow = 0;
        liveStrangers[i].knowsAnyone = false;
      }
      computeLayout();
    }

    computeLayout();

    return {
      PALETTE: PALETTE,
      STRANGERS: STRANGERS,
      audio: audio,
      resize: function (w, h, nextDpr) {
        width = Math.max(240, Number(w) || width);
        height = Math.max(240, Number(h) || height);
        dpr = Math.max(1, Number(nextDpr) || 1);
        computeLayout();
      },
      step: step,
      getStrangers: function () { return liveStrangers; },
      getStrangerById: getStrangerById,
      hitTestStranger: hitTestStranger,
      setSelectedStranger: function (idOrNull) {
        const valid = idOrNull ? getStrangerById(idOrNull) : null;
        selectedStrangerId = valid ? valid.id : null;
        return selectedStrangerId;
      },
      setRainIntensity: function (val01) {
        rainIntensity = clamp(Number(val01) || 0.72, 0.15, 1.0);
        audio.setRainBed(rainIntensity);
        return rainIntensity;
      },
      triggerCloudburstSurge: function () {
        cloudburstSurge = 1.0;
        collapsed = false;
        consummatedPair = null;
        collapseBlend = 0;
        for (let i = 0; i < 10; i++) {
          rt[i].inPair = false;
          liveStrangers[i].knowsAnyone = false;
        }
        syncStrangerCoords();
      },
      renderBackdrop: renderBackdrop,
      renderStrangersAndForeRain: renderStrangersAndForeRain,
      getState: function () {
        return {
          width: width,
          height: height,
          dpr: dpr,
          strangerCount: 10,
          rainIntensity: rainIntensity,
          selectedStrangerId: selectedStrangerId,
          strangersKnowEachOther: Boolean(collapsed && consummatedPair),
          greetingsExchanged: (collapsed && consummatedPair) ? 1 : 0,
          muted: audio.isMuted()
        };
      },
      reset: reset,
      destroy: function () {
        audio.dispose();
      }
    };
  }

  const API = Object.freeze({
    PALETTE: PALETTE,
    STRANGERS: STRANGERS,
    createArcadeScene: createArcadeScene
  });

  root.ChloeRainArcadeStrangers = API;
  if (typeof window !== "undefined") {
    window.ChloeRainArcadeStrangers = API;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
