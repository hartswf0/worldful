(function (root) {
  "use strict";

  /*
   * City 20: Valdrada (Cities & Eyes 1)
   * Inverted Limpid Lake Twin & Asymmetric Ontological Value Ledger
   * Standalone browser & headless runtime layer below waterlineY
   */

  var AXIS_PITCH_D4 = 293.66;

  var PALETTE = Object.freeze({
    obsidian_water: "#070B10",
    abyss_trench: "#0D151F",
    cold_limpid_slate: "#2A3D4F",
    chilled_mirror_cyan: "#9BD1E5",
    silverpoint_ice: "#DCEFF7",
    veranda_ivory: "#EDE6D6",
    travertine_warm: "#D6C7AE",
    amber_room_glow: "#E3A857",
    parapet_iron: "#1A232D",
    crimson_vein: "#8E1B28",
    crimson_bright: "#C42838",
    clotted_tendon_black: "#2E070D",
    obsidianWater: "#070B10",
    abyssTrench: "#0D151F",
    coldLimpidSlate: "#2A3D4F",
    chilledMirrorCyan: "#9BD1E5",
    silverpointIce: "#DCEFF7",
    verandaIvory: "#EDE6D6",
    travertineWarm: "#D6C7AE",
    amberRoomGlow: "#E3A857",
    parapetIron: "#1A232D",
    crimsonVein: "#8E1B28",
    crimsonBright: "#C42838",
    clottedTendonBlack: "#2E070D"
  });

  var RAW_LEDGER_LIST = [
    Object.freeze({
      id: "traveler_parapet",
      chamberId: "traveler_parapet",
      index: 0,
      key: "1",
      tierIndex: 1,
      stoneId: "railed_parapet_high_streets",
      title: "Arriving Traveler's High-Street Parapet",
      invertedTitle: "Abyssal Parapet of Stripped Certainty",
      erectWeight: 0.84,
      invertedWeight: 0.19,
      asymmetryDelta: -0.65,
      verdict: "DENIED",
      isSymmetricalEqual: false,
      mutualLove: 0,
      hasDoubleCatoptricRay: false,
      semitones: Object.freeze([4, 7]),
      note: "Proud arrival vantage leaning over wrought-iron rail is stripped into spectral abyssal vertigo below."
    }),
    Object.freeze({
      id: "hallway_perspective",
      chamberId: "hallway_perspective",
      index: 1,
      key: "2",
      tierIndex: 0,
      stoneId: "illuminated_cutaway_interiors",
      title: "Coffered Hallway Perspective",
      invertedTitle: "Sunken Vault of Catoptric Geometry",
      erectWeight: 0.34,
      invertedWeight: 0.89,
      asymmetryDelta: 0.55,
      verdict: "INCREASED",
      isSymmetricalEqual: false,
      mutualLove: 0,
      hasDoubleCatoptricRay: false,
      semitones: Object.freeze([2, 5, 7]),
      note: "Ordinary measured footsteps harden into inescapable catoptric geometry beneath suspended tiles and sunken vaults."
    }),
    Object.freeze({
      id: "wardrobe_chamber",
      chamberId: "wardrobe_chamber",
      index: 2,
      key: "3",
      tierIndex: 2,
      stoneId: "wardrobe_catoptric_mirrors",
      title: "Chamber of the Hinged Wardrobe Mirror",
      invertedTitle: "Double Catoptric Prism of the Unseen Back",
      erectWeight: 0.31,
      invertedWeight: 0.91,
      asymmetryDelta: 0.60,
      verdict: "INCREASED",
      isSymmetricalEqual: false,
      mutualLove: 0,
      hasDoubleCatoptricRay: true,
      semitones: Object.freeze([4, 9, 12]),
      note: "Recursive mirror-within-mirror exposes the unseen dorsal profile in razor-clear cyan silverpoint."
    }),
    Object.freeze({
      id: "merchant_scale_loggia",
      chamberId: "merchant_scale_loggia",
      index: 3,
      key: "4",
      tierIndex: 1,
      stoneId: "stacked_veranda_houses",
      title: "Magistrate's Golden Scale Veranda",
      invertedTitle: "Hollowed Loggia of Spectral Vanity",
      erectWeight: 0.91,
      invertedWeight: 0.14,
      asymmetryDelta: -0.77,
      verdict: "DENIED",
      isSymmetricalEqual: false,
      mutualLove: 0,
      hasDoubleCatoptricRay: false,
      semitones: Object.freeze([5, 2]),
      note: "Ceremonial gold scales and civic pomp are mocked as hollow, weightless spectral vanity in cold slate."
    }),
    Object.freeze({
      id: "fleeting_glance_balcony",
      chamberId: "fleeting_glance_balcony",
      index: 4,
      key: "5",
      tierIndex: 0,
      stoneId: "ancient_lakeshore_foundation",
      title: "Ancient Cliffshore Column Balcony",
      invertedTitle: "Submerged Escarpment of Grave Permanence",
      erectWeight: 0.18,
      invertedWeight: 0.94,
      asymmetryDelta: 0.76,
      verdict: "INCREASED",
      isSymmetricalEqual: false,
      mutualLove: 0,
      hasDoubleCatoptricRay: false,
      semitones: Object.freeze([2, 7]),
      note: "An unheeded touch upon ancient lakeshore limestone freezes into monumental permanence in the abyss."
    }),
    Object.freeze({
      id: "lovers_alcove",
      chamberId: "lovers_alcove",
      index: 5,
      key: "6",
      tierIndex: 3,
      stoneId: "twining_naked_lovers",
      title: "Alcove of Twining Naked Lovers",
      invertedTitle: "Iconic Ice-Ivory Contour Alcove",
      erectWeight: 0.44,
      invertedWeight: 0.96,
      asymmetryDelta: 0.52,
      verdict: "INCREASED",
      isSymmetricalEqual: false,
      mutualLove: 0,
      hasDoubleCatoptricRay: false,
      semitones: Object.freeze([3, 7, 10]),
      note: "Chilled sculptural dignity of twining ice-ivory contours eclipses warm carnal skin above."
    }),
    Object.freeze({
      id: "crimson_vein_corridor",
      chamberId: "crimson_vein_corridor",
      index: 6,
      key: "7",
      tierIndex: 3,
      stoneId: "dagger_black_neck_veins",
      title: "Corridor of the Knife & Black Neck Veins",
      invertedTitle: "Obsidian Incision of Chilled Crimson Veins",
      erectWeight: 0.52,
      invertedWeight: 0.98,
      asymmetryDelta: 0.46,
      verdict: "INCREASED",
      isSymmetricalEqual: false,
      mutualLove: 0,
      hasDoubleCatoptricRay: false,
      semitones: Object.freeze([1, 6, 9]),
      note: "Razor-clear chilled crimson incision in obsidian water eclipses the hot spasm in the corridor above."
    })
  ];

  var FROZEN_LEDGER_LIST = Object.freeze(RAW_LEDGER_LIST.slice());

  var VALUE_LEDGER_RULES = (function () {
    var dict = {};
    for (var i = 0; i < FROZEN_LEDGER_LIST.length; i++) {
      var r = FROZEN_LEDGER_LIST[i];
      dict[r.id] = r;
      Object.defineProperty(dict, i, { value: r, enumerable: false });
    }
    Object.defineProperty(dict, "length", { value: FROZEN_LEDGER_LIST.length, enumerable: false });
    Object.defineProperty(dict, "list", { value: FROZEN_LEDGER_LIST, enumerable: false });
    Object.defineProperty(dict, "forEach", { value: FROZEN_LEDGER_LIST.forEach.bind(FROZEN_LEDGER_LIST), enumerable: false });
    Object.defineProperty(dict, "map", { value: FROZEN_LEDGER_LIST.map.bind(FROZEN_LEDGER_LIST), enumerable: false });
    Object.defineProperty(dict, "find", { value: FROZEN_LEDGER_LIST.find.bind(FROZEN_LEDGER_LIST), enumerable: false });
    Object.defineProperty(dict, "every", { value: FROZEN_LEDGER_LIST.every.bind(FROZEN_LEDGER_LIST), enumerable: false });
    Object.defineProperty(dict, "filter", { value: FROZEN_LEDGER_LIST.filter.bind(FROZEN_LEDGER_LIST), enumerable: false });
    if (typeof Symbol !== "undefined" && Symbol.iterator) {
      Object.defineProperty(dict, Symbol.iterator, {
        value: function () { return FROZEN_LEDGER_LIST[Symbol.iterator](); },
        enumerable: false
      });
    }
    return Object.freeze(dict);
  })();

  function clamp(v, lo, hi) {
    var n = Number(v);
    if (!Number.isFinite(n)) return lo;
    return n < lo ? lo : n > hi ? hi : n;
  }

  function hexToRgba(hex, alpha) {
    var clean = String(hex || "#9BD1E5").replace("#", "");
    if (clean.length === 3) {
      clean = clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2];
    }
    var num = parseInt(clean, 16);
    if (!Number.isFinite(num)) return "rgba(155, 209, 229, " + clamp(alpha, 0, 1) + ")";
    var r = (num >> 16) & 255;
    var g = (num >> 8) & 255;
    var b = num & 255;
    return "rgba(" + r + ", " + g + ", " + b + ", " + clamp(alpha, 0, 1).toFixed(3) + ")";
  }

  function resolveChamberRule(input) {
    if (typeof input === "string") {
      if (VALUE_LEDGER_RULES[input]) return VALUE_LEDGER_RULES[input];
      var asKey = parseInt(input, 10);
      if (Number.isFinite(asKey) && asKey >= 1 && asKey <= 7) {
        return FROZEN_LEDGER_LIST[asKey - 1];
      }
    } else if (typeof input === "number" && Number.isFinite(input)) {
      var idx = Math.round(input);
      if (idx >= 0 && idx < FROZEN_LEDGER_LIST.length) return FROZEN_LEDGER_LIST[idx];
      if (idx === 7) return FROZEN_LEDGER_LIST[6];
    } else if (input && typeof input === "object") {
      var cid = input.chamberId || input.id || input.activeChamberId;
      if (cid && VALUE_LEDGER_RULES[cid]) return VALUE_LEDGER_RULES[cid];
      if (typeof input.index === "number" && FROZEN_LEDGER_LIST[input.index]) {
        return FROZEN_LEDGER_LIST[input.index];
      }
    }
    return FROZEN_LEDGER_LIST[0];
  }

  function semitoneHz(semitones) {
    return +(AXIS_PITCH_D4 * Math.pow(2, semitones / 12)).toFixed(3);
  }

  function synthesizeFallbackPacket(width, height, waterlineY, activeId) {
    var w = Math.max(320, width || 1280);
    var h = Math.max(320, height || 800);
    var wl = clamp(waterlineY || Math.round(h * 0.5), 80, h - 80);
    var skyBand = Math.max(64, wl - 18);
    var tierH = Math.floor(skyBand / 4.35);
    var baseLeft = Math.round(w * 0.11);
    var baseW = Math.round(w * 0.78);
    var tiers = [];
    for (var ti = 0; ti < 4; ti++) {
      var inset = ti * Math.round(w * 0.032);
      var ty = wl - (ti + 1) * tierH - ti * 2;
      tiers.push({
        index: ti,
        tierIndex: ti,
        x: baseLeft + inset,
        y: ty,
        w: baseW - inset * 1.4,
        h: tierH,
        archCount: Math.max(5, 8 - ti)
      });
    }
    var cliffProfile = [
      { x: Math.round(w * 0.03), y: wl },
      { x: Math.round(w * 0.06), y: wl - Math.round(skyBand * 0.28) },
      { x: Math.round(w * 0.11), y: wl - Math.round(skyBand * 0.56) },
      { x: Math.round(w * 0.18), y: wl - Math.round(skyBand * 0.86) },
      { x: Math.round(w * 0.90), y: wl - Math.round(skyBand * 0.82) },
      { x: Math.round(w * 0.95), y: wl }
    ];
    var tierCounts = [0, 0, 0, 0];
    var tierTotals = [2, 2, 1, 2];
    var chambers = FROZEN_LEDGER_LIST.map(function (rule, idx) {
      var t = tiers[rule.tierIndex];
      var slot = tierCounts[rule.tierIndex]++;
      var tot = tierTotals[rule.tierIndex];
      var pad = Math.max(8, Math.round(t.w * 0.05));
      var usableW = t.w - pad * 2;
      var cw = Math.floor(usableW / tot) - 8;
      var cx = t.x + pad + slot * (cw + 12);
      var chH = Math.max(24, t.h - 8);
      var cy = t.y + 4;
      return {
        id: rule.id,
        index: idx,
        tierIndex: rule.tierIndex,
        stoneId: rule.stoneId,
        title: rule.title,
        x: cx,
        y: cy,
        w: cw,
        h: chH,
        distFromWaterPx: wl - (cy + chH),
        ceilingCoffered: true,
        floorTiled: true,
        hallwayDepth: 0.62,
        hasWardrobeMirror: rule.id === "wardrobe_chamber",
        wardrobeAngle: 0.48,
        poseStep: 1,
        actIntensity: rule.id === activeId ? 0.92 : 0.45,
        erectWeight: rule.erectWeight,
        polarityHint: rule.verdict,
        crimsonFlow: rule.id === "crimson_vein_corridor" ? 0.86 : 0,
        gazeX: Math.round(cx + cw * 0.5),
        gazeY: Math.round(cy + chH * 0.58),
        note: rule.note
      };
    });
    return {
      width: w,
      height: h,
      waterlineY: wl,
      activeChamberId: activeId || "traveler_parapet",
      cliffProfile: cliffProfile,
      tiers: tiers,
      chambers: chambers
    };
  }

  function createCanonAudio(opts) {
    var muted = Boolean(opts && opts.muted);
    var ctx = null;
    var lastStamp = 0;
    var lastCid = "";

    function ensureCtx() {
      if (muted) return null;
      if (!ctx) {
        var Ctor = root && (root.AudioContext || root.webkitAudioContext);
        if (typeof Ctor !== "function") return null;
        try {
          ctx = new Ctor();
        } catch (_err) {
          ctx = null;
          return null;
        }
      }
      if (ctx && ctx.state === "suspended" && typeof ctx.resume === "function") {
        try { ctx.resume().catch(function () {}); } catch (_e) {}
      }
      return ctx;
    }

    function playInvertedCanon(chamberIdOrAct, forceFlag) {
      var rule = resolveChamberRule(chamberIdOrAct);
      var nowMs = Date.now();
      var erectSemi = rule.semitones.slice();
      var invSemi = erectSemi.map(function (k) { return -k; });
      var voiceAFreqHz = erectSemi.map(semitoneHz);
      var voiceBFreqHz = invSemi.map(semitoneHz);
      var resonanceProfile = rule.verdict === "INCREASED" ? "cold_crystalline_boosted" : "phase_deadened_hollow";

      var descriptor = {
        played: false,
        muted: muted,
        chamberId: rule.id,
        axisHz: AXIS_PITCH_D4,
        delayMs: 90,
        waveformPolarity: -1,
        verdict: rule.verdict,
        isSymmetricalEqual: false,
        erectWeight: rule.erectWeight,
        invertedWeight: rule.invertedWeight,
        erectSemitones: erectSemi,
        invertedSemitones: invSemi,
        voiceAFreqHz: voiceAFreqHz,
        voiceBFreqHz: voiceBFreqHz,
        resonanceProfile: resonanceProfile
      };

      if (!forceFlag && lastCid === rule.id && nowMs - lastStamp < 38) {
        return descriptor;
      }
      lastCid = rule.id;
      lastStamp = nowMs;

      var ac = ensureCtx();
      if (!ac) return descriptor;

      try {
        var t0 = ac.currentTime + 0.008;
        var stepDur = 0.105;

        /* Voice A: warm upper veranda motif above D4 = 293.66 Hz */
        var warmFilter = ac.createBiquadFilter();
        warmFilter.type = "lowpass";
        warmFilter.frequency.setValueAtTime(1650, t0);
        warmFilter.Q.setValueAtTime(1.1, t0);
        warmFilter.connect(ac.destination);

        for (var i = 0; i < voiceAFreqHz.length; i++) {
          var stA = t0 + i * stepDur;
          var oscA = ac.createOscillator();
          var gainA = ac.createGain();
          oscA.type = "triangle";
          oscA.frequency.setValueAtTime(voiceAFreqHz[i], stA);
          var ampA = 0.045 + rule.erectWeight * 0.055;
          gainA.gain.setValueAtTime(0.0001, stA);
          gainA.gain.exponentialRampToValueAtTime(ampA, stA + 0.014);
          gainA.gain.exponentialRampToValueAtTime(0.0001, stA + 0.22);
          oscA.connect(gainA);
          gainA.connect(warmFilter);
          oscA.start(stA);
          oscA.stop(stA + 0.24);
        }

        /* Voice B: ~90ms later, pitch-mirrored across D4 and polarity-inverted (-1) */
        var polarityInverter = ac.createGain();
        polarityInverter.gain.setValueAtTime(-1.0, t0);
        var twinFilter = ac.createBiquadFilter();
        if (rule.verdict === "INCREASED") {
          twinFilter.type = "peaking";
          twinFilter.frequency.setValueAtTime(2680, t0);
          twinFilter.Q.setValueAtTime(3.6, t0);
          twinFilter.gain.setValueAtTime(7.5, t0);
        } else {
          twinFilter.type = "bandpass";
          twinFilter.frequency.setValueAtTime(470, t0);
          twinFilter.Q.setValueAtTime(4.8, t0);
        }
        polarityInverter.connect(twinFilter);
        twinFilter.connect(ac.destination);

        for (var j = 0; j < voiceBFreqHz.length; j++) {
          var stB = t0 + 0.090 + j * stepDur;
          var oscB = ac.createOscillator();
          var gainB = ac.createGain();
          oscB.type = rule.id === "crimson_vein_corridor" ? "sawtooth" : "sine";
          oscB.frequency.setValueAtTime(voiceBFreqHz[j], stB);
          var ampB = rule.verdict === "INCREASED"
            ? (0.055 + rule.invertedWeight * 0.085)
            : (0.012 + rule.invertedWeight * 0.022);
          var tailB = rule.verdict === "INCREASED" ? 0.38 : 0.14;
          gainB.gain.setValueAtTime(0.0001, stB);
          gainB.gain.exponentialRampToValueAtTime(ampB, stB + 0.012);
          gainB.gain.exponentialRampToValueAtTime(0.0001, stB + tailB);
          oscB.connect(gainB);
          gainB.connect(polarityInverter);
          oscB.start(stB);
          oscB.stop(stB + tailB + 0.02);

          if (rule.verdict === "INCREASED") {
            var glass = ac.createOscillator();
            var glassGain = ac.createGain();
            glass.type = "triangle";
            glass.frequency.setValueAtTime(voiceBFreqHz[j] * (rule.hasDoubleCatoptricRay ? 3 : 2), stB);
            glassGain.gain.setValueAtTime(0.0001, stB);
            glassGain.gain.exponentialRampToValueAtTime(ampB * 0.42, stB + 0.01);
            glassGain.gain.exponentialRampToValueAtTime(0.0001, stB + tailB * 0.85);
            glass.connect(glassGain);
            glassGain.connect(polarityInverter);
            glass.start(stB);
            glass.stop(stB + tailB);
          }
        }
        descriptor.played = true;
      } catch (_audioErr) {
        descriptor.played = false;
      }
      return descriptor;
    }

    function playLovelessLockDyad() {
      var ac = ensureCtx();
      if (!ac) return false;
      try {
        var t0 = ac.currentTime + 0.006;
        var inv = ac.createGain();
        inv.gain.setValueAtTime(-1.0, t0);
        inv.connect(ac.destination);
        var freqs = [AXIS_PITCH_D4, AXIS_PITCH_D4 * 0.5];
        for (var k = 0; k < freqs.length; k++) {
          var o = ac.createOscillator();
          var g = ac.createGain();
          o.type = "sine";
          o.frequency.setValueAtTime(freqs[k], t0 + k * 0.045);
          g.gain.setValueAtTime(0.0001, t0 + k * 0.045);
          g.gain.exponentialRampToValueAtTime(0.05, t0 + k * 0.045 + 0.015);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.30);
          o.connect(g);
          g.connect(k === 0 ? ac.destination : inv);
          o.start(t0 + k * 0.045);
          o.stop(t0 + 0.32);
        }
        return true;
      } catch (_e) {
        return false;
      }
    }

    return {
      unlockAudio: function () { return Boolean(ensureCtx()); },
      setMuted: function (b) { muted = Boolean(b); return muted; },
      toggleMute: function () { muted = !muted; return muted; },
      isMuted: function () { return muted; },
      playInvertedCanon: playInvertedCanon,
      playLovelessLockDyad: playLovelessLockDyad,
      destroy: function () {
        if (ctx && typeof ctx.close === "function") {
          try { ctx.close().catch(function () {}); } catch (_e) {}
        }
        ctx = null;
      }
    };
  }

  function drawAbyssalWaterPlanes(ctx, w, h, wlY, limpidity, phase) {
    var lakeH = Math.max(1, h - wlY);
    var grad = ctx.createLinearGradient(0, wlY, 0, h);
    grad.addColorStop(0, PALETTE.abyss_trench);
    grad.addColorStop(0.38, PALETTE.obsidian_water);
    grad.addColorStop(0.82, "#05080D");
    grad.addColorStop(1, "#030508");
    ctx.fillStyle = grad;
    ctx.fillRect(0, wlY, w, lakeH);

    /* Crisp cold-limpid-slate depth planes (razor-sharp reflection strata, zero blur) */
    var strataCount = 9;
    for (var s = 0; s < strataCount; s++) {
      var frac = (s + 0.6) / strataCount;
      var sy = Math.round(wlY + Math.pow(frac, 1.15) * (lakeH - 6)) + 0.5;
      var bandH = Math.max(2, Math.round((1 - frac) * 10 * limpidity));
      ctx.fillStyle = hexToRgba(PALETTE.cold_limpid_slate, (0.16 - frac * 0.10) * limpidity);
      ctx.fillRect(0, sy, w, bandH);
      ctx.strokeStyle = hexToRgba(PALETTE.chilled_mirror_cyan, (0.20 - frac * 0.13) * limpidity);
      ctx.lineWidth = 1;
      ctx.beginPath();
      var drift = Math.sin(phase * 0.8 + s * 1.3) * 6;
      ctx.moveTo(Math.max(0, w * 0.04 + drift), sy);
      ctx.lineTo(Math.min(w, w * 0.96 + drift), sy);
      ctx.stroke();
    }
  }

  function drawInvertedCliffAndTiers(ctx, packet, w, h, wlY, limpidity) {
    var cliffRaw = packet && packet.cliffProfile;
    var pts = [];
    var stepRects = [];
    if (Array.isArray(cliffRaw)) {
      for (var i = 0; i < cliffRaw.length; i++) {
        var cp = cliffRaw[i];
        if (Array.isArray(cp) && cp.length >= 2) {
          pts.push({ x: Number(cp[0]) || 0, y: Number(cp[1]) || wlY });
        } else if (cp && typeof cp === "object") {
          if (Number.isFinite(cp.w) && Number.isFinite(cp.h)) {
            stepRects.push(cp);
          } else if (Number.isFinite(cp.x) && Number.isFinite(cp.y)) {
            pts.push({ x: cp.x, y: cp.y });
          }
        }
      }
    } else if (cliffRaw && typeof cliffRaw === "object") {
      if (Array.isArray(cliffRaw.points)) pts = cliffRaw.points;
      if (Array.isArray(cliffRaw.steps)) stepRects = cliffRaw.steps;
    }

    ctx.save();
    if (pts.length >= 3) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, wlY);
      for (var p = 0; p < pts.length; p++) {
        var ry = 2 * wlY - pts[p].y;
        ctx.lineTo(pts[p].x, ry);
      }
      ctx.lineTo(pts[pts.length - 1].x, wlY);
      ctx.closePath();
      ctx.fillStyle = hexToRgba(PALETTE.abyss_trench, 0.88 * limpidity);
      ctx.fill();
      ctx.strokeStyle = hexToRgba(PALETTE.cold_limpid_slate, 0.78 * limpidity);
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
    for (var sr = 0; sr < stepRects.length; sr++) {
      var st = stepRects[sr];
      var sty = 2 * wlY - (st.y + st.h);
      ctx.fillStyle = hexToRgba(PALETTE.abyss_trench, 0.86 * limpidity);
      ctx.fillRect(st.x, sty, st.w, st.h);
      ctx.strokeStyle = hexToRgba(PALETTE.cold_limpid_slate, 0.72 * limpidity);
      ctx.strokeRect(st.x + 0.5, sty + 0.5, Math.max(1, st.w - 1), Math.max(1, st.h - 1));
    }

    /* Upside-down stacked arcaded veranda tiers & hanging wrought-iron parapets */
    var tiers = (packet && Array.isArray(packet.tiers)) ? packet.tiers : [];
    for (var ti = 0; ti < tiers.length; ti++) {
      var t = tiers[ti];
      var tx = Number.isFinite(t.x) ? t.x : w * 0.12;
      var ty = Number.isFinite(t.y) ? t.y : (wlY - (ti + 1) * 60);
      var tw = Number.isFinite(t.w) ? t.w : (Number.isFinite(t.width) ? t.width : w * 0.76);
      var th = Number.isFinite(t.h) ? t.h : (Number.isFinite(t.height) ? t.height : 56);
      var yTwin = 2 * wlY - (ty + th);

      ctx.fillStyle = hexToRgba(PALETTE.obsidian_water, 0.72 * limpidity);
      ctx.fillRect(tx, yTwin, tw, th);
      ctx.strokeStyle = hexToRgba(PALETTE.cold_limpid_slate, 0.75 * limpidity);
      ctx.lineWidth = 1.2;
      ctx.strokeRect(tx + 0.5, yTwin + 0.5, Math.max(1, tw - 1), Math.max(1, th - 1));

      /* Overhead inverted street slab at yTwin & upside-down iron parapet rail hanging from yTwin */
      ctx.fillStyle = hexToRgba(PALETTE.cold_limpid_slate, 0.55 * limpidity);
      ctx.fillRect(tx - 6, yTwin, tw + 12, 3);
      var railH = Math.min(11, Math.max(6, Math.round(th * 0.18)));
      var railTop = yTwin - railH;
      ctx.strokeStyle = hexToRgba(PALETTE.chilled_mirror_cyan, 0.42 * limpidity);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx - 6, railTop);
      ctx.lineTo(tx + tw + 6, railTop);
      var picketStep = Math.max(7, Math.round(tw / 42));
      for (var px = tx - 4; px <= tx + tw + 4; px += picketStep) {
        ctx.moveTo(px + 0.5, yTwin);
        ctx.lineTo(px + 0.5, railTop);
      }
      ctx.stroke();

      /* Inverted arcade: piers hang down from yTwin, semicircular vault crowns curve at yTwin + th */
      var archCount = Math.max(4, Number(t.archCount) || Math.round(tw / 68));
      var bayW = tw / archCount;
      ctx.strokeStyle = hexToRgba(PALETTE.cold_limpid_slate, 0.52 * limpidity);
      ctx.beginPath();
      for (var a = 0; a < archCount; a++) {
        var bx = tx + a * bayW;
        var archR = Math.min(bayW * 0.44, th * 0.36);
        ctx.moveTo(bx + bayW * 0.06, yTwin + 3);
        ctx.lineTo(bx + bayW * 0.06, yTwin + th - archR);
        ctx.arc(bx + bayW * 0.5, yTwin + th - archR, archR, Math.PI, 0, true);
        ctx.lineTo(bx + bayW * 0.94, yTwin + 3);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawInvertedChamber(ctx, twin, limpidity, phase, isActive, isHovered, pulse) {
    var x = twin.x;
    var y = twin.y;
    var w = Math.max(18, twin.w);
    var h = Math.max(16, twin.h);
    var cx = x + w * 0.5;
    var isDenied = twin.verdict === "DENIED";
    var baseAlpha = isDenied
      ? clamp(0.28 + (isActive ? 0.08 : 0) + (isHovered ? 0.06 : 0), 0.22, 0.44)
      : clamp((0.86 + (isActive ? 0.12 : 0)) * limpidity, 0.64, 0.99);

    ctx.save();
    if (isDenied) {
      ctx.fillStyle = hexToRgba(PALETTE.abyss_trench, baseAlpha * 0.75);
      ctx.fillRect(x, y, w, h);
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = hexToRgba(PALETTE.cold_limpid_slate, baseAlpha * 1.15);
      ctx.lineWidth = isActive ? 1.5 : 1;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
      ctx.setLineDash([]);
    } else {
      var bg = ctx.createLinearGradient(x, y, x, y + h);
      bg.addColorStop(0, hexToRgba(PALETTE.cold_limpid_slate, 0.38 * baseAlpha));
      bg.addColorStop(0.5, hexToRgba(PALETTE.obsidian_water, 0.86 * baseAlpha));
      bg.addColorStop(1, hexToRgba(twin.id === "crimson_vein_corridor" ? PALETTE.clotted_tendon_black : PALETTE.abyss_trench, 0.94 * baseAlpha));
      ctx.fillStyle = bg;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = hexToRgba(isActive ? PALETTE.silverpoint_ice : PALETTE.chilled_mirror_cyan, baseAlpha);
      ctx.lineWidth = isActive ? 1.8 + pulse * 0.6 : 1.25;
      ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    }

    /* 1. Tiled floor hanging overhead (y .. y + h * 0.23) */
    var floorBand = h * 0.23;
    var vpY = y + h * 0.47;
    ctx.strokeStyle = isDenied
      ? hexToRgba(PALETTE.cold_limpid_slate, baseAlpha * 0.85)
      : hexToRgba(PALETTE.chilled_mirror_cyan, baseAlpha * 0.52);
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + floorBand);
    ctx.lineTo(x + w - 2, y + floorBand);
    ctx.moveTo(x + 2, y + floorBand * 0.5);
    ctx.lineTo(x + w - 2, y + floorBand * 0.5);
    for (var ti = 1; ti <= 5; ti++) {
      var tx = x + (w * ti) / 6;
      ctx.moveTo(tx, y);
      ctx.lineTo(cx + (tx - cx) * 0.52, y + floorBand);
    }
    ctx.stroke();

    /* 2. Sunken coffered ceiling vault below (y + h * 0.75 .. y + h) */
    var vaultTop = y + h * 0.75;
    ctx.strokeStyle = isDenied
      ? hexToRgba(PALETTE.cold_limpid_slate, baseAlpha * 0.8)
      : hexToRgba(PALETTE.silverpoint_ice, baseAlpha * 0.56);
    ctx.beginPath();
    ctx.moveTo(x + 2, vaultTop);
    ctx.lineTo(x + w - 2, vaultTop);
    var coffers = 4;
    var cw = (w - 6) / coffers;
    for (var c = 0; c < coffers; c++) {
      ctx.rect(x + 3 + c * cw + 1.5, vaultTop + 2, Math.max(2, cw - 3), Math.max(2, h - (vaultTop - y) - 4));
    }
    ctx.stroke();

    /* 3. Chamber-specific point-by-point inverted iconography */
    var midY = y + h * 0.5;
    if (twin.id === "traveler_parapet") {
      /* DENIED: fractured upside-down iron parapet & hollowed vertigo ghost */
      ctx.strokeStyle = hexToRgba(PALETTE.chilled_mirror_cyan, baseAlpha);
      ctx.beginPath();
      ctx.moveTo(x + w * 0.14, y + h * 0.84);
      ctx.lineTo(x + w * 0.86, y + h * 0.18);
      ctx.moveTo(cx - 8, y + h * 0.25);
      ctx.lineTo(cx, y + h * 0.62);
      ctx.lineTo(cx + 8, y + h * 0.25);
      ctx.arc(cx, y + h * 0.68, 4, 0, Math.PI * 2);
      ctx.stroke();
    } else if (twin.id === "merchant_scale_loggia") {
      /* DENIED: hollow unstrung spectral scales hanging upside-down */
      ctx.strokeStyle = hexToRgba(PALETTE.chilled_mirror_cyan, baseAlpha);
      ctx.beginPath();
      ctx.moveTo(cx, y + h * 0.74);
      ctx.lineTo(cx, y + h * 0.36);
      ctx.moveTo(cx - w * 0.24, y + h * 0.42);
      ctx.lineTo(cx + w * 0.24, y + h * 0.32);
      ctx.arc(cx - w * 0.24, y + h * 0.26, 5, 0, Math.PI, true);
      ctx.moveTo(cx + w * 0.29, y + h * 0.20);
      ctx.arc(cx + w * 0.24, y + h * 0.20, 5, 0, Math.PI, true);
      ctx.stroke();
    } else if (twin.id === "hallway_perspective") {
      /* INCREASED: inescapable catoptric perspective tunnel + crystalline footstep nodes */
      var hw = w * 0.22;
      var hh = h * 0.22;
      ctx.strokeStyle = hexToRgba(PALETTE.silverpoint_ice, baseAlpha * 0.92);
      ctx.strokeRect(cx - hw * 0.5, vpY - hh * 0.5, hw, hh);
      ctx.beginPath();
      ctx.moveTo(x + 3, y + floorBand); ctx.lineTo(cx - hw * 0.5, vpY - hh * 0.5);
      ctx.moveTo(x + w - 3, y + floorBand); ctx.lineTo(cx + hw * 0.5, vpY - hh * 0.5);
      ctx.moveTo(x + 3, vaultTop); ctx.lineTo(cx - hw * 0.5, vpY + hh * 0.5);
      ctx.moveTo(x + w - 3, vaultTop); ctx.lineTo(cx + hw * 0.5, vpY + hh * 0.5);
      ctx.stroke();
      for (var fn = 0; fn < 3; fn++) {
        var fy = y + floorBand * 0.4 + fn * (h * 0.11);
        ctx.fillStyle = PALETTE.silverpoint_ice;
        ctx.fillRect(cx - 5 + fn * 4, fy, 3, 2);
      }
    } else if (twin.id === "wardrobe_chamber") {
      /* INCREASED: recursive wardrobe mirror casting DOUBLE catoptric prism ray onto unseen dorsal profile */
      var mirX = x + w * 0.24;
      var mirTop = y + h * 0.26;
      var mirBot = y + h * 0.70;
      var tilt = Math.sin((twin.wardrobeAngle || 0.48) + phase * 0.2) * 5;
      ctx.strokeStyle = PALETTE.silverpoint_ice;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(mirX - tilt, mirTop);
      ctx.lineTo(mirX + tilt, mirBot);
      ctx.stroke();

      var backX = x + w * 0.68;
      var backY = midY;
      /* Ray 1 (lake to beveled wardrobe glass) + Ray 2 (catoptric prism fan exposing dorsal spine) */
      ctx.fillStyle = hexToRgba(PALETTE.chilled_mirror_cyan, 0.26 * baseAlpha);
      ctx.beginPath();
      ctx.moveTo(mirX, midY);
      ctx.lineTo(backX + 7, backY - h * 0.20);
      ctx.lineTo(backX + 7, backY + h * 0.20);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = PALETTE.silverpoint_ice;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(twin.gazeX, y);
      ctx.lineTo(mirX, midY);
      ctx.lineTo(backX, backY - h * 0.14);
      ctx.moveTo(mirX, midY);
      ctx.lineTo(backX, backY + h * 0.14);
      /* Unseen dorsal profile & spine contour (upside-down head below, shoulders above) */
      ctx.moveTo(backX, backY - h * 0.18);
      ctx.lineTo(backX, backY + h * 0.14);
      ctx.moveTo(backX - 6, backY - h * 0.04);
      ctx.lineTo(backX + 6, backY - h * 0.04);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(backX, backY + h * 0.19, 3.8, 0, Math.PI * 2);
      ctx.stroke();
    } else if (twin.id === "fleeting_glance_balcony") {
      /* INCREASED: ancient submerged column & monumental silverpoint permanence rings */
      var colX = cx - w * 0.14;
      ctx.fillStyle = hexToRgba(PALETTE.chilled_mirror_cyan, 0.34 * baseAlpha);
      ctx.fillRect(colX - 5, y + floorBand, 10, vaultTop - (y + floorBand));
      ctx.strokeStyle = PALETTE.silverpoint_ice;
      ctx.strokeRect(colX - 5, y + floorBand, 10, vaultTop - (y + floorBand));
      for (var rg = 1; rg <= 3; rg++) {
        ctx.strokeStyle = hexToRgba(PALETTE.silverpoint_ice, (0.92 - rg * 0.22) * baseAlpha);
        ctx.beginPath();
        ctx.arc(colX + 5, midY, rg * 5.5, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (twin.id === "lovers_alcove") {
      /* INCREASED: sculpted ice-ivory twining lover silhouettes upside-down */
      var shift = ((twin.poseStep || 1) % 3 - 1) * 2.5;
      ctx.strokeStyle = PALETTE.silverpoint_ice;
      ctx.fillStyle = hexToRgba(PALETTE.veranda_ivory, 0.28 * baseAlpha);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx - 11, y + floorBand + 2);
      ctx.bezierCurveTo(cx - 3 + shift, midY - 4, cx + 6, midY + 4, cx - 5, vaultTop - 5);
      ctx.bezierCurveTo(cx + 12, midY + 3, cx + 4 - shift, midY - 5, cx + 11, y + floorBand + 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx - 4, vaultTop - 4, 3.3, 0, Math.PI * 2);
      ctx.arc(cx + 5, vaultTop - 5, 3.3, 0, Math.PI * 2);
      ctx.stroke();
    } else if (twin.id === "crimson_vein_corridor") {
      /* INCREASED: razor-etched silverpoint knife & chilled crimson-vein tendrils in obsidian water */
      var flow = clamp(Number.isFinite(twin.crimsonFlow) ? twin.crimsonFlow : 0.88, 0.45, 1.0);
      ctx.strokeStyle = PALETTE.silverpoint_ice;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.20, midY - h * 0.14);
      ctx.lineTo(cx + 3, midY + 2);
      ctx.stroke();

      var tendrils = [
        [-0.04, -0.26, 0.08, -0.34],
        [0.06, -0.18, 0.22, -0.30],
        [0.05, 0.16, 0.19, 0.28],
        [-0.06, 0.14, -0.16, 0.29]
      ];
      for (var td = 0; td < tendrils.length; td++) {
        var tr = tendrils[td];
        ctx.strokeStyle = td % 2 === 0 ? PALETTE.crimson_bright : PALETTE.crimson_vein;
        ctx.lineWidth = td === 0 ? 1.9 : 1.35;
        ctx.beginPath();
        ctx.moveTo(cx + 2, midY + 2);
        ctx.quadraticCurveTo(
          cx + w * tr[0] * flow,
          midY + h * tr[1] * flow,
          cx + w * tr[2] * flow,
          midY + h * tr[3] * flow
        );
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawEyeFilamentsAndDatum(ctx, twinChambers, w, h, wlY, st) {
    var limpidity = st.limpidity;
    var flash = st.reconcileFlash;
    ctx.save();

    for (var i = 0; i < twinChambers.length; i++) {
      var tc = twinChambers[i];
      var isAct = tc.id === st.activeChamberId;
      var gx = clamp(tc.gazeX, 4, w - 4);
      var gyTwin = clamp(tc.gazeTwinY, wlY + 8, h - 6);
      var alpha = clamp(
        (isAct ? 0.88 : 0.36) * limpidity * st.eyeLockStrength + flash * 0.35,
        0.20,
        0.99
      );

      /* Vertical Interlocked Loveless Eye Filament from waterlineY down to gazeTwinY */
      ctx.strokeStyle = hexToRgba(isAct || flash > 0.1 ? PALETTE.silverpoint_ice : PALETTE.chilled_mirror_cyan, alpha);
      ctx.lineWidth = isAct ? 1.5 : 0.95;
      if (!isAct && flash <= 0.05) ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(gx, wlY);
      ctx.lineTo(gx, gyTwin);
      ctx.stroke();
      ctx.setLineDash([]);

      if (isAct || flash > 0.1) {
        ctx.strokeStyle = hexToRgba(PALETTE.chilled_mirror_cyan, alpha * 0.55);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(gx - 2.5, wlY + 2);
        ctx.lineTo(gx - 2.5, gyTwin - 4);
        ctx.moveTo(gx + 2.5, wlY + 2);
        ctx.lineTo(gx + 2.5, gyTwin - 4);
        ctx.stroke();
      }

      /* Waterline refraction lock tick at (gazeX, waterlineY) */
      ctx.fillStyle = hexToRgba(PALETTE.silverpoint_ice, alpha);
      ctx.fillRect(gx - 2.5, wlY, 5, 2.5);

      /* Inverted eye oculus at (gazeX, 2 * waterlineY - gazeY) staring coldly upward */
      var ew = isAct ? 6.5 : 4.5;
      var eh = isAct ? 3.4 : 2.4;
      ctx.fillStyle = PALETTE.obsidian_water;
      ctx.strokeStyle = hexToRgba(PALETTE.silverpoint_ice, alpha);
      ctx.lineWidth = isAct ? 1.3 : 1.0;
      ctx.beginPath();
      ctx.moveTo(gx - ew, gyTwin);
      ctx.quadraticCurveTo(gx, gyTwin - eh * 1.4, gx + ew, gyTwin);
      ctx.quadraticCurveTo(gx, gyTwin + eh * 1.4, gx - ew, gyTwin);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = tc.id === "crimson_vein_corridor" ? PALETTE.crimson_bright : PALETTE.chilled_mirror_cyan;
      ctx.beginPath();
      ctx.arc(gx, gyTwin - 0.4, isAct ? 1.8 : 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    /* Crisp silverpoint-slate waterline datum right at waterlineY inside clip */
    ctx.fillStyle = hexToRgba(PALETTE.silverpoint_ice, 0.92 * limpidity);
    ctx.fillRect(0, wlY, w, 1.5);
    ctx.fillStyle = hexToRgba(PALETTE.chilled_mirror_cyan, 0.55 * limpidity);
    ctx.fillRect(0, wlY + 1.5, w, 1.2);
    ctx.fillStyle = hexToRgba(PALETTE.cold_limpid_slate, 0.72);
    ctx.fillRect(0, wlY + 2.7, w, 1.5);

    var tickStep = Math.max(28, Math.round(w / 32));
    ctx.fillStyle = hexToRgba(PALETTE.silverpoint_ice, 0.55 * limpidity);
    for (var tx = tickStep; tx < w; tx += tickStep) {
      ctx.fillRect(tx, wlY + 1.5, 1, 3.5);
    }

    ctx.restore();
  }

  function buildTwinChambersFromPacket(packet, w, h, wlY) {
    var srcList = (packet && Array.isArray(packet.chambers) && packet.chambers.length > 0)
      ? packet.chambers
      : synthesizeFallbackPacket(w, h, wlY, packet && packet.activeChamberId).chambers;

    var out = [];
    for (var i = 0; i < FROZEN_LEDGER_LIST.length; i++) {
      var rule = FROZEN_LEDGER_LIST[i];
      var found = null;
      for (var j = 0; j < srcList.length; j++) {
        if (srcList[j] && (srcList[j].id === rule.id || srcList[j].index === i)) {
          found = srcList[j];
          break;
        }
      }
      if (!found) {
        found = synthesizeFallbackPacket(w, h, wlY, rule.id).chambers[i];
      }
      var ex = Number.isFinite(found.x) ? found.x : 40 + i * 90;
      var ey = Number.isFinite(found.y) ? found.y : wlY - 70;
      var ew = Math.max(16, Number.isFinite(found.w) ? found.w : 84);
      var eh = Math.max(14, Number.isFinite(found.h) ? found.h : 48);
      var yTwin = 2 * wlY - (ey + eh);
      var gx = Number.isFinite(found.gazeX) ? found.gazeX : ex + ew * 0.5;
      var gy = Number.isFinite(found.gazeY) ? found.gazeY : ey + eh * 0.58;
      var gyTwin = 2 * wlY - gy;

      out.push({
        id: rule.id,
        chamberId: rule.id,
        index: rule.index,
        key: rule.key,
        tierIndex: Number.isFinite(found.tierIndex) ? found.tierIndex : rule.tierIndex,
        stoneId: rule.stoneId,
        title: found.title || rule.title,
        invertedTitle: rule.invertedTitle,
        gestureLabel: found.gestureLabel || "",
        x: ex,
        y: yTwin,
        w: ew,
        h: eh,
        erectRect: { x: ex, y: ey, w: ew, h: eh },
        twinRect: { x: ex, y: yTwin, w: ew, h: eh },
        ceilingCoffered: true,
        floorTiled: true,
         ceilingInvertedToSunkenVault: true,
        floorInvertedToSuspendedOverhead: true,
        hasWardrobeMirror: Boolean(found.hasWardrobeMirror || rule.hasDoubleCatoptricRay),
        hasDoubleCatoptricRay: rule.hasDoubleCatoptricRay,
        wardrobeAngle: Number.isFinite(found.wardrobeAngle) ? -found.wardrobeAngle : -0.48,
        poseStep: Number.isFinite(found.poseStep) ? found.poseStep : 1,
        actIntensity: Number.isFinite(found.actIntensity) ? found.actIntensity : 0.5,
        crimsonFlow: Number.isFinite(found.crimsonFlow) ? found.crimsonFlow : (rule.id === "crimson_vein_corridor" ? 0.88 : 0),
        erectWeight: rule.erectWeight,
        invertedWeight: rule.invertedWeight,
        asymmetryDelta: rule.asymmetryDelta,
        verdict: rule.verdict,
        isSymmetricalEqual: false,
        mutualLove: 0,
        gazeX: gx,
        gazeY: gy,
        gazeTwinY: gyTwin,
        note: rule.note
      });
    }
    return out;
  }

  function createMirrorTwin(opts) {
    var options = opts || {};
    var waterlineRatio = clamp(options.waterlineRatio || 0.5, 0.25, 0.75);
    var audio = createCanonAudio({ muted: Boolean(options.muted) });
    var playOnIngest = options.playOnIngest !== false;

    var st = {
      width: Math.max(320, Number(options.width) || 1280),
      height: Math.max(320, Number(options.height) || 800),
      waterlineY: 0,
      limpidity: clamp(options.limpidity !== undefined ? options.limpidity : 0.94, 0.70, 1.0),
      activeChamberId: "traveler_parapet",
      hoveredChamberId: null,
      eyeLockStrength: 0.96,
      lovelessTension: 0.94,
      mutualLove: 0,
      reconciliationAttempts: 0,
      ingestedActCount: 0,
      phase: 0,
      twinPulse: 0,
      reconcileFlash: 0,
      reducedMotion: Boolean(options.reducedMotion),
      lastPacket: null,
      lastCanon: null,
      twinChambers: []
    };
    st.waterlineY = Number.isFinite(options.waterlineY)
      ? Math.round(options.waterlineY)
      : Math.round(st.height * waterlineRatio);
    st.twinChambers = buildTwinChambersFromPacket(null, st.width, st.height, st.waterlineY);

    function syncPacketGeometry(packet) {
      if (!packet || typeof packet !== "object") return;
      st.lastPacket = packet;
      if (Number.isFinite(packet.width) && packet.width > 0) st.width = Math.round(packet.width);
      if (Number.isFinite(packet.height) && packet.height > 0) st.height = Math.round(packet.height);
      if (Number.isFinite(packet.waterlineY) && packet.waterlineY > 0) {
        st.waterlineY = Math.round(packet.waterlineY);
      }
      if (packet.activeChamberId && VALUE_LEDGER_RULES[packet.activeChamberId]) {
        st.activeChamberId = packet.activeChamberId;
      }
      st.twinChambers = buildTwinChambersFromPacket(packet, st.width, st.height, st.waterlineY);
    }

    function setViewport(width, height, waterlineYOrObj) {
      if (width && typeof width === "object") {
        var vo = width;
        if (Number.isFinite(vo.width) && vo.width > 0) st.width = Math.round(vo.width);
        if (Number.isFinite(vo.height) && vo.height > 0) st.height = Math.round(vo.height);
        st.waterlineY = Number.isFinite(vo.waterlineY)
          ? Math.round(vo.waterlineY)
          : Math.round(st.height * waterlineRatio);
      } else {
        if (Number.isFinite(width) && width > 0) st.width = Math.round(width);
        if (Number.isFinite(height) && height > 0) st.height = Math.round(height);
        st.waterlineY = Number.isFinite(waterlineYOrObj)
          ? Math.round(waterlineYOrObj)
          : Math.round(st.height * waterlineRatio);
      }
      st.twinChambers = buildTwinChambersFromPacket(st.lastPacket, st.width, st.height, st.waterlineY);
      return { width: st.width, height: st.height, waterlineY: st.waterlineY };
    }

    function getLedgerState(chamberId) {
      var rule = resolveChamberRule(chamberId || st.activeChamberId);
      var byChamberId = {};
      var entries = st.twinChambers.map(function (tc) {
        var item = {
          id: tc.id,
          chamberId: tc.id,
          index: tc.index,
          key: tc.key,
          stoneId: tc.stoneId,
          title: tc.title,
          invertedTitle: tc.invertedTitle,
          erectWeight: tc.erectWeight,
          invertedWeight: tc.invertedWeight,
          asymmetryDelta: tc.asymmetryDelta,
          verdict: tc.verdict,
          isSymmetricalEqual: false,
          mutualLove: 0,
          hasDoubleCatoptricRay: tc.hasDoubleCatoptricRay,
          note: tc.note
        };
        byChamberId[tc.id] = item;
        return item;
      });
      var activeEntry = byChamberId[rule.id] || entries[0];
      return {
        activeChamberId: rule.id,
        chamberId: activeEntry.id,
        index: activeEntry.index,
        stoneId: activeEntry.stoneId,
        title: activeEntry.title,
        invertedTitle: activeEntry.invertedTitle,
        erectWeight: activeEntry.erectWeight,
        invertedWeight: activeEntry.invertedWeight,
        asymmetryDelta: activeEntry.asymmetryDelta,
        verdict: activeEntry.verdict,
        isSymmetricalEqual: false,
        allAsymmetric: true,
        deniedCount: 2,
        increasedCount: 5,
        mutualLove: 0,
        eyeLockStrength: st.eyeLockStrength,
        lovelessTension: st.lovelessTension,
        limpidity: st.limpidity,
        chanceMomentsOccurred: 0,
        reconciliationAttempts: st.reconciliationAttempts,
        ingestedActCount: st.ingestedActCount,
        note: activeEntry.note,
        innerArchNote: "The two Valdradas live for each other, their eyes interlocked; but there is no love between them.",
        activeEntry: activeEntry,
        chambers: entries,
        entries: entries,
        byChamberId: byChamberId
      };
    }

    function ingestAct(actOrPacket, maybePacket) {
      if (maybePacket && typeof maybePacket === "object") {
        syncPacketGeometry(maybePacket);
      } else if (actOrPacket && typeof actOrPacket === "object" && Array.isArray(actOrPacket.chambers)) {
        syncPacketGeometry(actOrPacket);
      }
      var rule = resolveChamberRule(
        actOrPacket && actOrPacket.lastAct ? actOrPacket.lastAct : actOrPacket
      );
      st.activeChamberId = rule.id;
      st.ingestedActCount += 1;
      st.twinPulse = st.reducedMotion ? 0.35 : 1.0;
      var silent = Boolean(actOrPacket && typeof actOrPacket === "object" && actOrPacket.silent);
      if (playOnIngest && !silent) {
        st.lastCanon = audio.playInvertedCanon(rule.id, false);
      }
      return getLedgerState(rule.id);
    }

    function step(dt, mirrorPacket) {
      var realPacket = mirrorPacket;
      var numDt = dt;
      if (dt && typeof dt === "object") {
        realPacket = dt;
        numDt = 0.016;
      }
      if (realPacket) syncPacketGeometry(realPacket);
      var sec = Number.isFinite(numDt) ? (numDt > 2 ? numDt / 1000 : numDt) : 0.016;
      sec = clamp(sec, 0, 0.1);
      if (!st.reducedMotion) {
        st.phase += sec * 1.35;
      }
      st.twinPulse = Math.max(0, st.twinPulse - sec * 2.1);
      st.reconcileFlash = Math.max(0, st.reconcileFlash - sec * 1.5);
    }

    function render(ctx, mirrorPacket) {
      if (!ctx) return;
      if (mirrorPacket) syncPacketGeometry(mirrorPacket);
      var w = st.width;
      var h = st.height;
      var wlY = clamp(st.waterlineY, 1, h - 1);
      var packet = st.lastPacket || synthesizeFallbackPacket(w, h, wlY, st.activeChamberId);
      if (!st.lastPacket) {
        st.twinChambers = buildTwinChambersFromPacket(packet, w, h, wlY);
      }

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, wlY, w, Math.max(1, h - wlY));
      ctx.clip();

      drawAbyssalWaterPlanes(ctx, w, h, wlY, st.limpidity, st.phase);
      drawInvertedCliffAndTiers(ctx, packet, w, h, wlY, st.limpidity);

      for (var i = 0; i < st.twinChambers.length; i++) {
        var tc = st.twinChambers[i];
        drawInvertedChamber(
          ctx,
          tc,
          st.limpidity,
          st.phase,
          tc.id === st.activeChamberId,
          tc.id === st.hoveredChamberId,
          st.twinPulse
        );
      }

      drawEyeFilamentsAndDatum(ctx, st.twinChambers, w, h, wlY, st);
      ctx.restore();
    }

    function inspectAt(x, y, mirrorPacket) {
      if (mirrorPacket) syncPacketGeometry(mirrorPacket);
      if (!Number.isFinite(x) || !Number.isFinite(y) || y < st.waterlineY || y > st.height) {
        st.hoveredChamberId = null;
        return null;
      }
      for (var i = st.twinChambers.length - 1; i >= 0; i--) {
        var tc = st.twinChambers[i];
        if (x >= tc.x && x <= tc.x + tc.w && y >= tc.y && y <= tc.y + tc.h) {
          st.hoveredChamberId = tc.id;
          return {
            hit: true,
            region: "inverted_chamber",
            id: tc.id,
            chamberId: tc.id,
            index: tc.index,
            stoneId: tc.stoneId,
            title: tc.title,
            invertedTitle: tc.invertedTitle,
            erectWeight: tc.erectWeight,
            invertedWeight: tc.invertedWeight,
            asymmetryDelta: tc.asymmetryDelta,
            verdict: tc.verdict,
            isSymmetricalEqual: false,
            mutualLove: 0,
            eyeLockStrength: st.eyeLockStrength,
            lovelessTension: st.lovelessTension,
            hasDoubleCatoptricRay: tc.hasDoubleCatoptricRay,
            note: tc.note,
            rect: { x: tc.x, y: tc.y, w: tc.w, h: tc.h },
            erectRect: tc.erectRect,
            gazeX: tc.gazeX,
            gazeY: tc.gazeY,
            gazeTwinY: tc.gazeTwinY
          };
        }
      }
      for (var k = 0; k < st.twinChambers.length; k++) {
        var fc = st.twinChambers[k];
        if (Math.abs(x - fc.gazeX) <= 7 && y >= st.waterlineY && y <= fc.gazeTwinY + 6) {
          st.hoveredChamberId = fc.id;
          return {
            hit: true,
            region: "interlocked_eye_filament",
            id: fc.id,
            chamberId: fc.id,
            index: fc.index,
            stoneId: fc.stoneId,
            title: fc.title,
            invertedTitle: fc.invertedTitle,
            erectWeight: fc.erectWeight,
            invertedWeight: fc.invertedWeight,
            asymmetryDelta: fc.asymmetryDelta,
            verdict: fc.verdict,
            isSymmetricalEqual: false,
            mutualLove: 0,
            eyeLockStrength: st.eyeLockStrength,
            lovelessTension: st.lovelessTension,
            note: "The two Valdradas live for each other, their eyes interlocked; but there is no love between them.",
            rect: { x: fc.x, y: fc.y, w: fc.w, h: fc.h }
          };
        }
      }
      st.hoveredChamberId = null;
      return null;
    }

    function setLimpidity(val) {
      st.limpidity = +clamp(val, 0.70, 1.0).toFixed(3);
      return st.limpidity;
    }

    function getLimpidity() {
      return st.limpidity;
    }

    function attemptWarmthReconciliation() {
      st.reconciliationAttempts += 1;
      st.mutualLove = 0;
      st.eyeLockStrength = 1.0;
      st.lovelessTension = 0.97;
      st.reconcileFlash = st.reducedMotion ? 0.4 : 1.0;
      audio.playLovelessLockDyad();
      return {
        reconciled: false,
        mutualLove: 0,
        eyeLockStrength: 1.0,
        lovelessTension: 0.97,
        note: "The two Valdradas live for each other, their eyes interlocked; but there is no love between them."
      };
    }

    function playInvertedCanon(chamberIdOrAct) {
      var res = audio.playInvertedCanon(chamberIdOrAct || st.activeChamberId, true);
      st.lastCanon = res;
      return res;
    }

    function setReducedMotion(bool) {
      st.reducedMotion = Boolean(bool);
      if (st.reducedMotion) {
        st.twinPulse = 0;
        st.reconcileFlash = 0;
      }
      return st.reducedMotion;
    }

    function getState() {
      var ledger = getLedgerState(st.activeChamberId);
      return {
        width: st.width,
        height: st.height,
        waterlineY: st.waterlineY,
        limpidity: st.limpidity,
        muted: audio.isMuted(),
        reducedMotion: st.reducedMotion,
        activeChamberId: st.activeChamberId,
        hoveredChamberId: st.hoveredChamberId,
        isSymmetricalEqual: false,
        mutualLove: 0,
        eyeLockStrength: st.eyeLockStrength,
        lovelessTension: st.lovelessTension,
        reconciliationAttempts: st.reconciliationAttempts,
        ingestedActCount: st.ingestedActCount,
        chanceMomentsOccurred: 0,
        lastCanon: st.lastCanon,
        twinChambers: st.twinChambers.slice(),
        ledger: ledger
      };
    }

    function reset() {
      st.limpidity = 0.94;
      st.activeChamberId = "traveler_parapet";
      st.hoveredChamberId = null;
      st.eyeLockStrength = 0.96;
      st.lovelessTension = 0.94;
      st.mutualLove = 0;
      st.reconciliationAttempts = 0;
      st.ingestedActCount = 0;
      st.phase = 0;
      st.twinPulse = 0;
      st.reconcileFlash = 0;
      st.lastCanon = null;
      st.twinChambers = buildTwinChambersFromPacket(st.lastPacket, st.width, st.height, st.waterlineY);
      return getState();
    }

    function destroy() {
      audio.destroy();
      st.lastPacket = null;
      st.twinChambers = [];
    }

    return {
      setViewport: setViewport,
      ingestAct: ingestAct,
      step: step,
      render: render,
      inspectAt: inspectAt,
      getLedgerState: getLedgerState,
      setLimpidity: setLimpidity,
      getLimpidity: getLimpidity,
      attemptWarmthReconciliation: attemptWarmthReconciliation,
      unlockAudio: audio.unlockAudio,
      setMuted: audio.setMuted,
      toggleMute: audio.toggleMute,
      isMuted: audio.isMuted,
      playInvertedCanon: playInvertedCanon,
      setReducedMotion: setReducedMotion,
      getState: getState,
      reset: reset,
      destroy: destroy
    };
  }

  var publicApi = Object.freeze({
    PALETTE: PALETTE,
    VALUE_LEDGER_RULES: VALUE_LEDGER_RULES,
    createMirrorTwin: createMirrorTwin
  });

  if (root) {
    root.ValdradaMirrorLakeTwin = publicApi;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.ValdradaMirrorLakeTwin = publicApi;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
