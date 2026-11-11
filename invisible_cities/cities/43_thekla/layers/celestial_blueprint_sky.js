/*
 * City 43: Thekla — Celestial Blueprint & Sunset Armistice Sky Layer
 * Self-contained Canvas2D + WebAudio module for globalThis.TheklaCelestialBlueprint
 */
(function (root) {
  "use strict";

  var PALETTE = Object.freeze({
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

  var CONSTELLATIONS = Object.freeze([
    Object.freeze({
      id: "grus_maior",
      index: 1,
      latin: "Grus Maior",
      role: "Cranes Hoisting Other Cranes",
      chordHz: 523.25,
      sectorNx: 0.52,
      sectorNy: 0.12,
      wireOffsets: Object.freeze([[-0.045, 0.032], [0.0, -0.028], [0.052, -0.008], [0.034, 0.036]])
    }),
    Object.freeze({
      id: "trabes_geminae",
      index: 2,
      latin: "Trabes Geminae",
      role: "Beams Embracing Other Beams",
      chordHz: 392.00,
      sectorNx: 0.37,
      sectorNy: 0.17,
      wireOffsets: Object.freeze([[-0.042, -0.018], [0.038, -0.018], [0.042, 0.022], [-0.038, 0.022]])
    }),
    Object.freeze({
      id: "ponticulus_funis",
      index: 3,
      latin: "Ponticulus Funis",
      role: "Catwalks Hanging from Ropes",
      chordHz: 440.00,
      sectorNx: 0.65,
      sectorNy: 0.18,
      wireOffsets: Object.freeze([[-0.048, -0.016], [-0.016, 0.020], [0.018, 0.022], [0.048, -0.014]])
    }),
    Object.freeze({
      id: "cantherius_trestle",
      index: 4,
      latin: "Cantherius",
      role: "Sawhorse Walks & Trestles",
      chordHz: 329.63,
      sectorNx: 0.25,
      sectorNy: 0.24,
      wireOffsets: Object.freeze([[-0.040, 0.026], [-0.014, -0.022], [0.020, -0.020], [0.042, 0.026]])
    }),
    Object.freeze({
      id: "armatura_ferrea",
      index: 5,
      latin: "Armatura Ferrea",
      role: "Metal Lattice Armatures",
      chordHz: 293.66,
      sectorNx: 0.78,
      sectorNy: 0.22,
      wireOffsets: Object.freeze([[0.0, -0.028], [0.042, 0.0], [0.0, 0.028], [-0.042, 0.0]])
    }),
    Object.freeze({
      id: "scala_coeli",
      index: 6,
      latin: "Scala Coeli",
      role: "Ladders & Timber Scaffoldings",
      chordHz: 493.88,
      sectorNx: 0.46,
      sectorNy: 0.25,
      wireOffsets: Object.freeze([[-0.026, 0.028], [-0.008, 0.004], [0.012, -0.018], [0.030, -0.032]])
    }),
    Object.freeze({
      id: "velum_saccinum",
      index: 7,
      latin: "Velum Saccinum",
      role: "Plank Fences & Sackcloth Screens",
      chordHz: 261.63,
      sectorNx: 0.14,
      sectorNy: 0.16,
      wireOffsets: Object.freeze([[-0.036, -0.020], [0.032, -0.016], [0.026, 0.028], [-0.030, 0.024]])
    })
  ]);

  var CONSTELLATION_MAP = Object.create(null);
  for (var ci = 0; ci < CONSTELLATIONS.length; ci += 1) {
    CONSTELLATION_MAP[CONSTELLATIONS[ci].id] = CONSTELLATIONS[ci];
  }

  var FALLBACK_RIG_ANCHORS = Object.freeze([
    { id: "anchor_plank_fences", stoneId: "plank_fences", label: "Plank Fences at the Arrival Palisade", constellationId: "velum_saccinum", nx: 0.13, ny: 0.81, tier: 1, isHoistedCrane: false },
    { id: "anchor_sackcloth_screens", stoneId: "sackcloth_screens", label: "Billowing Sackcloth Screens Veiling Inner Bays", constellationId: "velum_saccinum", nx: 0.27, ny: 0.68, tier: 2, isHoistedCrane: false },
    { id: "anchor_timber_scaffoldings", stoneId: "timber_scaffoldings", label: "Lashed Multi-Tier Timber Scaffoldings", constellationId: "scala_coeli", nx: 0.45, ny: 0.67, tier: 2, isHoistedCrane: false },
    { id: "anchor_metal_armatures", stoneId: "metal_armatures", label: "Riveted Iron & Steel Lattice Armatures", constellationId: "armatura_ferrea", nx: 0.77, ny: 0.61, tier: 3, isHoistedCrane: false },
    { id: "anchor_rope_catwalks", stoneId: "rope_catwalks", label: "Wooden Catwalks Hanging from Hemp Ropes", constellationId: "ponticulus_funis", nx: 0.64, ny: 0.55, tier: 3, isHoistedCrane: false },
    { id: "anchor_sawhorse_catwalks", stoneId: "sawhorse_catwalks", label: "Plank Catwalks Supported by Sawhorses", constellationId: "cantherius_trestle", nx: 0.22, ny: 0.76, tier: 1, isHoistedCrane: false },
    { id: "anchor_ladders_trestles", stoneId: "ladders_and_trestles", label: "Inclined Riggers' Ladders & Carpenter Trestles", constellationId: "cantherius_trestle", nx: 0.33, ny: 0.71, tier: 2, isHoistedCrane: false },
    { id: "anchor_cranes_hoisting", stoneId: "cranes_hoisting_cranes", label: "Derrick Cranes Hoisting Higher Cranes", constellationId: "grus_maior", nx: 0.52, ny: 0.43, tier: 4, isHoistedCrane: false },
    { id: "anchor_beams_embracing", stoneId: "beams_embracing_beams", label: "Interlocking Beams Embracing Beams", constellationId: "trabes_geminae", nx: 0.38, ny: 0.53, tier: 3, isHoistedCrane: false }
  ]);

  function thkSkyClamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function thkSkyHexToRgb(hex) {
    var clean = String(hex || "#000000").replace("#", "");
    var num = parseInt(clean, 16);
    if (!Number.isFinite(num)) {
      return { r: 16, g: 32, b: 59 };
    }
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function thkSkyMixHex(hexA, hexB, t) {
    var u = thkSkyClamp(t, 0, 1);
    var a = thkSkyHexToRgb(hexA);
    var b = thkSkyHexToRgb(hexB);
    var r = Math.round(a.r + (b.r - a.r) * u);
    var g = Math.round(a.g + (b.g - a.g) * u);
    var bl = Math.round(a.b + (b.b - a.b) * u);
    return "rgb(" + r + "," + g + "," + bl + ")";
  }

  function thkSkyRgba(hex, alpha) {
    var c = thkSkyHexToRgb(hex);
    return "rgba(" + c.r + "," + c.g + "," + c.b + "," + thkSkyClamp(alpha, 0, 1).toFixed(3) + ")";
  }

  function thkSkyBuildBackgroundStars(count) {
    var stars = [];
    var seed = 430819;
    var tints = ["#ffffff", "#d9f3ff", "#8ce6ff", "#f3e6cc", "#bcd9ff"];
    for (var i = 0; i < count; i += 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      var nx = 0.025 + ((seed & 65535) / 65535) * 0.95;
      seed = (seed * 1664525 + 1013904223) >>> 0;
      var ny = 0.025 + ((seed & 65535) / 65535) * 0.56;
      seed = (seed * 1664525 + 1013904223) >>> 0;
      var mag = 0.55 + ((seed & 4095) / 4095) * 1.55;
      stars.push({
        nx: nx,
        ny: ny,
        radius: mag,
        phase: (i * 0.83) % 6.283,
        speed: 0.9 + (i % 7) * 0.28,
        tint: tints[i % tints.length]
      });
    }
    return stars;
  }

  function thkSkyBuildFaultBranches() {
    return [
      { pts: [[0.50, 0.03], [0.47, 0.12], [0.51, 0.22], [0.46, 0.34], [0.49, 0.48]], twigs: [[1, 0.41, 0.18], [2, 0.57, 0.29], [3, 0.40, 0.42]] },
      { pts: [[0.24, 0.05], [0.28, 0.15], [0.23, 0.26], [0.27, 0.39], [0.22, 0.51]], twigs: [[1, 0.34, 0.21], [2, 0.17, 0.33]] },
      { pts: [[0.76, 0.04], [0.72, 0.14], [0.77, 0.25], [0.71, 0.37], [0.75, 0.49]], twigs: [[1, 0.65, 0.20], [2, 0.83, 0.32], [3, 0.66, 0.44]] }
    ];
  }

  function playSunsetArmisticeBell(audioCtx, muted) {
    if (!audioCtx || muted || typeof audioCtx.createOscillator !== "function") {
      return false;
    }
    try {
      var now = audioCtx.currentTime || 0;
      var partials = [
        { hz: 261.63, gain: 0.055, dur: 1.55, type: "sine" },
        { hz: 392.00, gain: 0.036, dur: 1.30, type: "sine" },
        { hz: 523.25, gain: 0.024, dur: 1.05, type: "triangle" },
        { hz: 622.25, gain: 0.012, dur: 0.72, type: "sine" }
      ];
      for (var i = 0; i < partials.length; i += 1) {
        var p = partials[i];
        var osc = audioCtx.createOscillator();
        var env = audioCtx.createGain();
        osc.type = p.type;
        osc.frequency.setValueAtTime(p.hz, now);
        env.gain.setValueAtTime(0.0001, now);
        env.gain.linearRampToValueAtTime(p.gain, now + 0.022);
        env.gain.exponentialRampToValueAtTime(0.0001, now + p.dur);
        osc.connect(env);
        env.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + p.dur + 0.04);
      }
      return true;
    } catch (_err) {
      return false;
    }
  }

  function playBlueprintStarChord(audioCtx, muted, constellationId) {
    if (!audioCtx || muted || typeof audioCtx.createOscillator !== "function") {
      return false;
    }
    try {
      var con = CONSTELLATION_MAP[constellationId] || CONSTELLATIONS[0];
      var base = con.chordHz || 523.25;
      var ratios = [1.0, 1.5, 2.0];
      var now = audioCtx.currentTime || 0;
      for (var i = 0; i < ratios.length; i += 1) {
        var t0 = now + i * 0.036;
        var osc = audioCtx.createOscillator();
        var env = audioCtx.createGain();
        osc.type = i === 1 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(base * ratios[i], t0);
        env.gain.setValueAtTime(0.0001, t0);
        env.gain.linearRampToValueAtTime(0.038 / (1 + i * 0.35), t0 + 0.014);
        env.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.92);
        osc.connect(env);
        env.connect(audioCtx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.96);
      }
      return true;
    } catch (_err) {
      return false;
    }
  }

  function createCelestialBlueprint(opts) {
    var options = opts || {};
    var onPhaseChange = typeof options.onPhaseChange === "function" ? options.onPhaseChange : null;
    var onDestructionStateChange = typeof options.onDestructionStateChange === "function" ? options.onDestructionStateChange : null;

    var reducedMotion = Boolean(options.reducedMotion);
    var solarProgress = 0.18;
    var solarPhase = "day";
    var isConstructing = true;
    var daytimeWorkHalted = false;
    var sunsetArmisticeActive = false;
    var destructionCannotBegin = true;
    var destructionRate = 0;
    var destructionProgress = 0;
    var cosmicCrumbleThreat = false;
    var haltTestCount = 0;
    var blueprintVisibility = 0.04;
    var blueprintRevealed = false;
    var activeConstellationId = "grus_maior";
    var whisperText = "Not only the city.";
    var timeSec = 0;
    var fearShimmer = 0;
    var lastWidth = 1280;
    var lastHeight = 800;

    var backgroundStars = thkSkyBuildBackgroundStars(76);
    var faultBranches = thkSkyBuildFaultBranches();
    var currentAnchors = FALLBACK_RIG_ANCHORS.slice();
    var starNodes = [];

    function syncRigAnchors(rigAnchors, width, height) {
      var w = Number.isFinite(width) && width > 0 ? width : lastWidth;
      var h = Number.isFinite(height) && height > 0 ? height : lastHeight;
      lastWidth = w;
      lastHeight = h;
      if (Array.isArray(rigAnchors) && rigAnchors.length > 0) {
        currentAnchors = rigAnchors.slice();
      } else if (!currentAnchors.length) {
        currentAnchors = FALLBACK_RIG_ANCHORS.slice();
      }
      var slotCounts = Object.create(null);
      var built = [];
      for (var i = 0; i < currentAnchors.length; i += 1) {
        var a = currentAnchors[i] || {};
        var cid = (a.constellationId && CONSTELLATION_MAP[a.constellationId]) ? a.constellationId : CONSTELLATIONS[i % CONSTELLATIONS.length].id;
        var con = CONSTELLATION_MAP[cid];
        var slot = slotCounts[cid] || 0;
        slotCounts[cid] = slot + 1;
        var anchorNx = Number.isFinite(a.nx) ? a.nx : (Number.isFinite(a.x) ? a.x / w : con.sectorNx);
        var anchorNy = Number.isFinite(a.ny) ? a.ny : (Number.isFinite(a.y) ? a.y / h : 0.62);
        var wire = con.wireOffsets[slot % con.wireOffsets.length];
        var ringStep = Math.floor(slot / con.wireOffsets.length);
        var hoistLift = a.isHoistedCrane ? -0.012 * Math.min(4, slot) : 0;
        var rawNx = 0.74 * (con.sectorNx + wire[0] * (1 + ringStep * 0.42)) + 0.26 * anchorNx;
        var rawNy = con.sectorNy + wire[1] * (1 + ringStep * 0.35) + hoistLift;
        var starNx = thkSkyClamp(rawNx, 0.06, 0.94);
        var starNy = thkSkyClamp(rawNy, 0.07, 0.33);
        built.push({
          id: "star_" + (a.id || ("node_" + i)),
          anchorId: a.id || ("node_" + i),
          stoneId: a.stoneId || "cranes_hoisting_cranes",
          label: a.label || con.role,
          constellationId: cid,
          constellationLatin: con.latin,
          chordHz: con.chordHz,
          nx: starNx,
          ny: starNy,
          x: starNx * w,
          y: starNy * h,
          anchorX: Number.isFinite(a.x) ? a.x : anchorNx * w,
          anchorY: Number.isFinite(a.y) ? a.y : anchorNy * h,
          tier: a.tier || 1,
          isHoistedCrane: Boolean(a.isHoistedCrane)
        });
      }
      starNodes = built;
      return starNodes.slice();
    }

    function getState() {
      var mapped = starNodes.length;
      return {
        solarProgress: Number(solarProgress.toFixed(4)),
        solarPhase: solarPhase,
        isConstructing: isConstructing,
        daytimeWorkHalted: daytimeWorkHalted,
        sunsetArmisticeActive: sunsetArmisticeActive,
        destructionCannotBegin: destructionCannotBegin,
        destructionRate: destructionRate,
        destructionProgress: Number(destructionProgress.toFixed(4)),
        cosmicCrumbleThreat: cosmicCrumbleThreat,
        haltTestCount: haltTestCount,
        blueprintVisibility: Number(blueprintVisibility.toFixed(4)),
        blueprintRevealed: blueprintRevealed,
        constellationCount: 7,
        mappedRigNodes: mapped,
        unalignedRigNodes: 0,
        alignmentRatio: 1.0,
        activeConstellationId: activeConstellationId,
        starCount: backgroundStars.length + mapped,
        reducedMotion: reducedMotion,
        whisper: whisperText
      };
    }

    function thkSkyApplyPhaseState(notifyDestruction) {
      var prevPhase = solarPhase;
      var prevThreat = cosmicCrumbleThreat;
      if (solarProgress < 0.52) {
        solarPhase = "day";
        sunsetArmisticeActive = false;
        blueprintRevealed = false;
        if (daytimeWorkHalted) {
          isConstructing = false;
          destructionCannotBegin = false;
          destructionRate = 0.16;
          cosmicCrumbleThreat = true;
          blueprintVisibility = 0.08;
        } else {
          isConstructing = true;
          destructionCannotBegin = true;
          destructionRate = 0;
          cosmicCrumbleThreat = false;
          blueprintVisibility = 0.04;
        }
      } else if (solarProgress < 0.74) {
        solarPhase = "sunset";
        daytimeWorkHalted = false;
        isConstructing = false;
        sunsetArmisticeActive = true;
        destructionCannotBegin = true;
        destructionRate = 0;
        destructionProgress = 0;
        cosmicCrumbleThreat = false;
        blueprintVisibility = 0.25 + ((solarProgress - 0.52) / 0.22) * (0.68 - 0.25);
        blueprintRevealed = false;
      } else {
        solarPhase = "night";
        daytimeWorkHalted = false;
        isConstructing = false;
        sunsetArmisticeActive = true;
        destructionCannotBegin = true;
        destructionRate = 0;
        destructionProgress = 0;
        cosmicCrumbleThreat = false;
        blueprintVisibility = 0.85 + ((solarProgress - 0.74) / 0.26) * (1.00 - 0.85);
        blueprintRevealed = true;
      }
      if (onPhaseChange && prevPhase !== solarPhase) {
        onPhaseChange(getState());
      }
      if (onDestructionStateChange && (notifyDestruction || prevThreat !== cosmicCrumbleThreat)) {
        onDestructionStateChange(getState());
      }
    }

    function setSolarProgress(val) {
      var num = Number(val);
      solarProgress = Number.isFinite(num) ? thkSkyClamp(num, 0, 1) : 0.18;
      thkSkyApplyPhaseState(false);
      return getState();
    }

    function setSolarPhase(phase) {
      var p = String(phase || "day").toLowerCase();
      if (p === "night" || p === "blueprint") {
        return setSolarProgress(0.90);
      }
      if (p === "sunset" || p === "dusk" || p === "armistice") {
        return setSolarProgress(0.62);
      }
      daytimeWorkHalted = false;
      cosmicCrumbleThreat = false;
      destructionProgress = 0;
      return setSolarProgress(0.18);
    }

    function forceStopDaytimeWork() {
      if (solarProgress >= 0.52) {
        solarProgress = 0.24;
      }
      daytimeWorkHalted = true;
      haltTestCount += 1;
      destructionProgress = Math.min(1, Math.max(destructionProgress, 0.06));
      whisperText = "Not only the city.";
      thkSkyApplyPhaseState(true);
      return getState();
    }

    function resumeDaytimeWork() {
      daytimeWorkHalted = false;
      cosmicCrumbleThreat = false;
      thkSkyApplyPhaseState(true);
      return getState();
    }

    function toggleDaytimeWork() {
      return daytimeWorkHalted ? resumeDaytimeWork() : forceStopDaytimeWork();
    }

    function askRemovalFear() {
      fearShimmer = 1.0;
      whisperText = "Not only the city.";
      return {
        scaffoldingsRemovableSafely: false,
        cityWouldCrumble: true,
        cosmosWouldCrumble: true,
        whisper: "Not only the city."
      };
    }

    function selectConstellation(idOrIndex) {
      if (idOrIndex === null || idOrIndex === "") {
        activeConstellationId = null;
        return null;
      }
      var idx = Number(idOrIndex);
      if (Number.isInteger(idx) && idx >= 1 && idx <= CONSTELLATIONS.length) {
        activeConstellationId = CONSTELLATIONS[idx - 1].id;
        return CONSTELLATIONS[idx - 1];
      }
      var key = String(idOrIndex);
      if (CONSTELLATION_MAP[key]) {
        activeConstellationId = key;
        return CONSTELLATION_MAP[key];
      }
      return CONSTELLATION_MAP[activeConstellationId] || null;
    }

    function hitTestStar(normX, normY, width, height) {
      var w = Number.isFinite(width) && width > 0 ? width : lastWidth;
      var h = Number.isFinite(height) && height > 0 ? height : lastHeight;
      var px = (normX >= 0 && normX <= 1 && normY >= 0 && normY <= 1) ? normX * w : normX;
      var py = (normX >= 0 && normX <= 1 && normY >= 0 && normY <= 1) ? normY * h : normY;
      var best = null;
      var bestDist = 36;
      for (var i = 0; i < starNodes.length; i += 1) {
        var st = starNodes[i];
        var sx = st.nx * w;
        var sy = st.ny * h;
        var d = Math.hypot(px - sx, py - sy);
        if (d <= bestDist) {
          bestDist = d;
          best = Object.assign({}, st, { x: sx, y: sy });
        }
      }
      return best;
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      return reducedMotion;
    }

    function step(dtSec) {
      var dt = Number.isFinite(Number(dtSec)) ? thkSkyClamp(Number(dtSec), 0, 10) : 0;
      if (!reducedMotion) {
        timeSec += dt;
      }
      if (fearShimmer > 0) {
        fearShimmer = Math.max(0, fearShimmer - dt * (reducedMotion ? 1.25 : 0.45));
      }
      if (!destructionCannotBegin && destructionRate > 0) {
        var beforeUp = destructionProgress;
        destructionProgress = thkSkyClamp(destructionProgress + destructionRate * dt, 0, 1);
        cosmicCrumbleThreat = true;
        if (onDestructionStateChange && Math.abs(destructionProgress - beforeUp) > 0.0001) {
          onDestructionStateChange(getState());
        }
      } else if (destructionCannotBegin && destructionProgress > 0) {
        var beforeDown = destructionProgress;
        destructionProgress = Math.max(0, destructionProgress - 0.35 * dt);
        if (onDestructionStateChange && beforeDown > 0 && destructionProgress === 0) {
          onDestructionStateChange(getState());
        }
      }
      return getState();
    }

    function reset() {
      solarProgress = 0.18;
      daytimeWorkHalted = false;
      destructionProgress = 0;
      cosmicCrumbleThreat = false;
      haltTestCount = 0;
      activeConstellationId = "grus_maior";
      fearShimmer = 0;
      timeSec = 0;
      thkSkyApplyPhaseState(true);
      syncRigAnchors(currentAnchors, lastWidth, lastHeight);
      return getState();
    }

    function renderSkyBackdrop(ctx, width, height, rigAnchors) {
      if (!ctx || !(width > 0) || !(height > 0)) {
        return;
      }
      if (Array.isArray(rigAnchors) && rigAnchors.length > 0) {
        syncRigAnchors(rigAnchors, width, height);
      } else if (width !== lastWidth || height !== lastHeight || !starNodes.length) {
        syncRigAnchors(currentAnchors, width, height);
      }
      ctx.save();
      var topCol = PALETTE.dayDustSky;
      var midCol = "#cbb28a";
      var botCol = PALETTE.ochreHaze;
      if (solarProgress < 0.52) {
        var td = solarProgress / 0.52;
        topCol = thkSkyMixHex(PALETTE.dayDustSky, "#c2a67d", td * 0.45);
        midCol = thkSkyMixHex("#d1ba95", PALETTE.ochreHaze, 0.42 + td * 0.38);
        botCol = thkSkyMixHex(PALETTE.ochreHaze, "#9e7648", td * 0.52);
        if (cosmicCrumbleThreat && destructionProgress > 0) {
          var bruise = thkSkyClamp(0.18 + destructionProgress * 0.45, 0, 0.65);
          topCol = thkSkyMixHex(topCol, "#3d1f1d", bruise);
          midCol = thkSkyMixHex(midCol, PALETTE.fractureRust, bruise * 0.55);
        }
      } else if (solarProgress < 0.74) {
        var ts = (solarProgress - 0.52) / 0.22;
        topCol = thkSkyMixHex(PALETTE.twilightPlum, PALETTE.nightAbyss, ts * 0.68);
        midCol = thkSkyMixHex(PALETTE.sunsetCopper, PALETTE.twilightPlum, ts * 0.72);
        botCol = thkSkyMixHex("#e08248", PALETTE.sunsetCopper, ts);
      } else {
        var tn = (solarProgress - 0.74) / 0.26;
        topCol = PALETTE.nightAbyss;
        midCol = thkSkyMixHex(PALETTE.twilightPlum, PALETTE.blueprintIndigo, 0.68 + tn * 0.32);
        botCol = thkSkyMixHex(PALETTE.blueprintIndigo, "#162d50", 0.55 + tn * 0.45);
      }
      var grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, topCol);
      grad.addColorStop(0.55, midCol);
      grad.addColorStop(1, botCol);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      if (solarProgress < 0.78) {
        var sunFade = solarProgress < 0.52 ? 1 : thkSkyClamp(1 - (solarProgress - 0.52) / 0.26, 0, 1);
        var sunX = width * (0.22 + solarProgress * 0.58);
        var sunY = height * (0.14 + Math.pow(solarProgress / 0.76, 1.55) * 0.64);
        var sunR = Math.max(18, Math.min(width, height) * 0.042);
        var halo = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 4.2);
        var coreHex = solarProgress < 0.52 ? "#fff3d6" : "#ff9b54";
        halo.addColorStop(0, thkSkyRgba(coreHex, 0.58 * sunFade));
        halo.addColorStop(0.45, thkSkyRgba(PALETTE.sunsetCopper, 0.22 * sunFade));
        halo.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = halo;
        ctx.fillRect(0, 0, width, height);
        ctx.beginPath();
        ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
        ctx.fillStyle = thkSkyRgba(coreHex, 0.84 * sunFade);
        ctx.fill();
      }

      var vaultVis = Math.max(blueprintVisibility, fearShimmer * 0.58);
      if (vaultVis > 0.08) {
        ctx.save();
        ctx.strokeStyle = thkSkyRgba(PALETTE.starCyan, vaultVis * 0.18);
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        for (var ai = 0; ai < 3; ai += 1) {
          var rad = Math.max(width, height) * (0.56 + ai * 0.16);
          ctx.beginPath();
          ctx.arc(width * 0.5, height * 1.06, rad, Math.PI * 1.12, Math.PI * 1.88);
          ctx.stroke();
        }
        ctx.restore();

        for (var si = 0; si < backgroundStars.length; si += 1) {
          var bs = backgroundStars[si];
          var tw = reducedMotion ? 0.86 : (0.58 + 0.42 * Math.sin(timeSec * bs.speed + bs.phase));
          ctx.fillStyle = thkSkyRgba(bs.tint, vaultVis * tw * 0.88);
          ctx.beginPath();
          ctx.arc(bs.nx * width, bs.ny * height, bs.radius, 0, Math.PI * 2);
          ctx.fill();
        }

        for (var k = 0; k < CONSTELLATIONS.length; k += 1) {
          var con = CONSTELLATIONS[k];
          var isAct = con.id === activeConstellationId;
          ctx.strokeStyle = thkSkyRgba(isAct ? PALETTE.plumbSilver : PALETTE.starCyan, vaultVis * (isAct ? 0.62 : 0.30));
          ctx.lineWidth = isAct ? 1.35 : 0.9;
          ctx.beginPath();
          for (var wIdx = 0; wIdx < con.wireOffsets.length; wIdx += 1) {
            var wo = con.wireOffsets[wIdx];
            var wx = (con.sectorNx + wo[0]) * width;
            var wy = (con.sectorNy + wo[1]) * height;
            if (wIdx === 0) {
              ctx.moveTo(wx, wy);
            } else {
              ctx.lineTo(wx, wy);
            }
          }
          ctx.closePath();
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function renderBlueprintOverlay(ctx, width, height, rigAnchors) {
      if (!ctx || !(width > 0) || !(height > 0)) {
        return;
      }
      if (Array.isArray(rigAnchors) && rigAnchors.length > 0) {
        syncRigAnchors(rigAnchors, width, height);
      } else if (width !== lastWidth || height !== lastHeight || !starNodes.length) {
        syncRigAnchors(currentAnchors, width, height);
      }
      ctx.save();
      var vis = Math.max(blueprintVisibility, fearShimmer * 0.65);
      if (vis > 0.15) {
        for (var i = 0; i < starNodes.length; i += 1) {
          var st = starNodes[i];
          var focus = st.constellationId === activeConstellationId || st.isHoistedCrane;
          var lineCol = focus ? PALETTE.plumbSilver : PALETTE.starCyan;
          ctx.save();
          ctx.strokeStyle = thkSkyRgba(lineCol, vis * (focus ? 0.78 : 0.44));
          ctx.lineWidth = focus ? 1.55 : 0.95;
          if (!focus) {
            ctx.setLineDash([5, 4]);
          }
          ctx.beginPath();
          ctx.moveTo(st.x, st.y);
          ctx.lineTo(st.anchorX, st.anchorY);
          ctx.stroke();
          ctx.restore();

          var dx = st.anchorX - st.x;
          var dy = st.anchorY - st.y;
          var len = Math.hypot(dx, dy) || 1;
          var px = -dy / len;
          var py = dx / len;
          ctx.strokeStyle = thkSkyRgba(PALETTE.plumbSilver, vis * (focus ? 0.68 : 0.34));
          ctx.lineWidth = 1;
          for (var ti = 1; ti <= 3; ti += 1) {
            var frac = ti * 0.24;
            var tx = st.x + dx * frac;
            var ty = st.y + dy * frac;
            var tickHalf = focus ? 4.2 : 2.6;
            ctx.beginPath();
            ctx.moveTo(tx - px * tickHalf, ty - py * tickHalf);
            ctx.lineTo(tx + px * tickHalf, ty + py * tickHalf);
            ctx.stroke();
          }

          ctx.fillStyle = thkSkyRgba(PALETTE.plumbSilver, vis * 0.95);
          ctx.beginPath();
          ctx.arc(st.x, st.y, focus ? 3.3 : 2.3, 0, Math.PI * 2);
          ctx.fill();
          if (focus) {
            ctx.strokeStyle = thkSkyRgba(PALETTE.starCyan, vis * 0.72);
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.arc(st.x, st.y, st.isHoistedCrane ? 7.8 : 6.2, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.strokeStyle = thkSkyRgba(lineCol, vis * 0.62);
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(st.anchorX, st.anchorY, focus ? 4.4 : 3.0, 0, Math.PI * 2);
          ctx.stroke();
        }

        var compact = width < 540;
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.font = (compact ? "600 9px " : "600 10.5px ") + "ui-monospace, SFMono-Regular, Menlo, monospace";
        for (var ci = 0; ci < CONSTELLATIONS.length; ci += 1) {
          var con = CONSTELLATIONS[ci];
          var isSel = con.id === activeConstellationId;
          if (compact && !isSel && (ci % 2 === 1)) {
            continue;
          }
          var lx = thkSkyClamp(con.sectorNx * width, 44, width - 44);
          var ly = Math.max(28, con.sectorNy * height - 10);
          ctx.fillStyle = thkSkyRgba(isSel ? PALETTE.plumbSilver : PALETTE.starCyan, vis * (isSel ? 0.96 : 0.68));
          ctx.fillText(con.latin.toUpperCase(), lx, ly);
        }

        if (blueprintRevealed) {
          ctx.font = (compact ? "700 10px " : "700 12px ") + "ui-monospace, SFMono-Regular, Menlo, monospace";
          ctx.fillStyle = thkSkyRgba(PALETTE.plumbSilver, vis * 0.94);
          ctx.textBaseline = "top";
          ctx.fillText("THERE IS THE BLUEPRINT", width * 0.5, Math.max(10, height * 0.022));
        }
      }

      if (cosmicCrumbleThreat && destructionProgress > 0) {
        var pulse = reducedMotion ? 0.88 : (0.72 + 0.28 * Math.sin(timeSec * 6.4));
        var reach = thkSkyClamp(0.28 + destructionProgress * 0.72, 0.28, 1);
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        for (var fi = 0; fi < faultBranches.length; fi += 1) {
          var fb = faultBranches[fi];
          ctx.strokeStyle = thkSkyRgba(PALETTE.fractureRust, (0.48 + 0.45 * destructionProgress) * pulse);
          ctx.lineWidth = 1.6 + destructionProgress * 1.8;
          ctx.beginPath();
          for (var pi = 0; pi < fb.pts.length; pi += 1) {
            var pt = fb.pts[pi];
            var jitter = reducedMotion ? 0 : Math.sin(timeSec * 9 + pi * 1.7 + fi) * 2.4 * destructionProgress;
            var fx = pt[0] * width + jitter;
            var fy = pt[1] * height * reach;
            if (pi === 0) {
              ctx.moveTo(fx, fy);
            } else {
              ctx.lineTo(fx, fy);
            }
          }
          ctx.stroke();
          ctx.strokeStyle = thkSkyRgba("#ff9e5e", 0.42 * pulse);
          ctx.lineWidth = 1.0;
          for (var twi = 0; twi < fb.twigs.length; twi += 1) {
            var tw = fb.twigs[twi];
            var basePt = fb.pts[tw[0]];
            ctx.beginPath();
            ctx.moveTo(basePt[0] * width, basePt[1] * height * reach);
            ctx.lineTo(tw[1] * width, tw[2] * height * reach);
            ctx.stroke();
          }
        }
        ctx.font = (width < 540 ? "700 11px " : "700 13px ") + "Georgia, serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = thkSkyRgba("#ffd5c8", 0.92 * pulse);
        ctx.fillText("“Not only the city.”", width * 0.5, Math.max(14, height * 0.045));
        ctx.restore();
      } else if (fearShimmer > 0.05) {
        ctx.save();
        ctx.strokeStyle = thkSkyRgba(PALETTE.plumbSilver, fearShimmer * 0.52);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(width * 0.5, height * 0.20, (1.05 - fearShimmer * 0.65) * Math.min(width, height) * 0.34, 0, Math.PI * 2);
        ctx.stroke();
        ctx.font = "italic 12px Georgia, serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = thkSkyRgba(PALETTE.plumbSilver, fearShimmer * 0.92);
        ctx.fillText("“Not only the city.”", width * 0.5, Math.max(14, height * 0.045));
        ctx.restore();
      }
      ctx.restore();
    }

    syncRigAnchors(FALLBACK_RIG_ANCHORS, 1280, 800);
    thkSkyApplyPhaseState(false);

    return {
      CONSTELLATIONS: CONSTELLATIONS,
      PALETTE: PALETTE,
      setSolarProgress: setSolarProgress,
      setSolarPhase: setSolarPhase,
      forceStopDaytimeWork: forceStopDaytimeWork,
      resumeDaytimeWork: resumeDaytimeWork,
      toggleDaytimeWork: toggleDaytimeWork,
      askRemovalFear: askRemovalFear,
      syncRigAnchors: syncRigAnchors,
      renderSkyBackdrop: renderSkyBackdrop,
      renderBlueprintOverlay: renderBlueprintOverlay,
      playSunsetArmisticeBell: playSunsetArmisticeBell,
      playBlueprintStarChord: playBlueprintStarChord,
      step: step,
      selectConstellation: selectConstellation,
      hitTestStar: hitTestStar,
      setReducedMotion: setReducedMotion,
      reset: reset,
      getState: getState,
      getStarNodes: function () { return starNodes.slice(); },
      getConstellations: function () { return CONSTELLATIONS; }
    };
  }

  var api = Object.freeze({
    PALETTE: PALETTE,
    CONSTELLATIONS: CONSTELLATIONS,
    createCelestialBlueprint: createCelestialBlueprint,
    playSunsetArmisticeBell: playSunsetArmisticeBell,
    playBlueprintStarChord: playBlueprintStarChord
  });

  root.TheklaCelestialBlueprint = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
