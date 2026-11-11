/**
 * City 09: ZIRMA — Companions' Singular Testimony Layer
 * Module: globalThis.ZirmaSingularTestimony
 *
 * Depicts the Traveling Companions' sworn minimalist recollection across
 * Zirma's six stones and three vertical strata: strictly ONE solitary witness
 * instance per stone rendered in drypoint lampblack, graphite, Prussian ink,
 * brass ochre, sailor vermilion, and subterranean verdigris.
 *
 * Causal Law: An unreinforced singular sign cannot stick in the mind.
 * Visibility decays exponentially (half-life ~2.8s) down to a barely-there
 * phantom trace (~0.05), accompanied by subtle unfixed-print registration
 * tremor (disabled under reducedMotion). Calling sightPulse(state, stoneId)
 * spikes visibility to 0.90 before evaporation immediately resumes.
 *
 * Note: render() composites transparently onto ctx (preserving any underlying
 * rag-paper wash or persistent overprint plate; pass params.clear = true only
 * if clearing ctx directly is desired).
 */
(function (root) {
  "use strict";

  const STONE_IDS = [
    "cobble_canes",
    "skyscraper_cornices",
    "leashed_pumas",
    "window_dirigibles",
    "sailor_tattoos",
    "humid_underground"
  ];

  const STRATA = {
    sky: { y0: 0.04, y1: 0.36 },
    street: { y0: 0.38, y1: 0.70 },
    subterranean: { y0: 0.72, y1: 0.97 }
  };

  const HALF_LIFE_SECONDS = 2.8;
  const DECAY_LAMBDA = Math.LN2 / HALF_LIFE_SECONDS;
  const PULSE_DECAY_LAMBDA = Math.LN2 / 0.75;
  const PHANTOM_FLOOR = 0.048;
  const SIGHT_SPIKE = 0.90;

  const INK = {
    paper: "242, 235, 220",      // #f2ebdc rag-cotton press sheet highlight
    lampblack: "21, 19, 17",     // #151311 primary drypoint carbon
    graphite: "64, 58, 50",      // warm sepia-graphite architectural needle
    prussian: "24, 48, 70",      // #183046 litho shadow & sky iron
    vermilion: "168, 46, 36",    // #a82e24 solitary ink-pot drop & witness tick
    ochre: "182, 130, 43",       // #b6822b pale dirigible envelope brass
    verdigris: "44, 87, 79"      // #2c574f humid underground vapor & fan
  };

  const STONE_SPECS = {
    cobble_canes: {
      id: "cobble_canes",
      stratum: "street",
      bounds: { x0: 0.04, y0: 0.38, x1: 0.34, y1: 0.70 },
      anchor: { x: 0.175, y: 0.548 },
      initialVisibility: 0.89,
      tremorSeed: 0.37,
      caption:
        "Companions' oath: We saw only one blind black man shouting in the alley, tapping a single cane on bare cobblestones.",
      audio: {
        type: "triangle",
        freq: 610,
        endFreq: 205,
        duration: 0.11,
        gain: 0.13,
        timbre: "hollow-cobble-tap",
        attack: 0.003,
        release: 0.095,
        filterFreq: 1420
      }
    },
    skyscraper_cornices: {
      id: "skyscraper_cornices",
      stratum: "sky",
      bounds: { x0: 0.04, y0: 0.04, x1: 0.96, y1: 0.36 },
      anchor: { x: 0.245, y: 0.165 },
      initialVisibility: 0.86,
      tremorSeed: 1.52,
      caption:
        "Companions' oath: Across all the spires we saw only one lunatic leaning out and teetering on a single high cornice.",
      audio: {
        type: "sine",
        freq: 512,
        endFreq: 466,
        duration: 0.42,
        gain: 0.08,
        timbre: "high-cornice-draught",
        attack: 0.06,
        release: 0.34,
        filterFreq: 960
      }
    },
    leashed_pumas: {
      id: "leashed_pumas",
      stratum: "street",
      bounds: { x0: 0.35, y0: 0.38, x1: 0.65, y1: 0.70 },
      anchor: { x: 0.50, y: 0.555 },
      initialVisibility: 0.88,
      tremorSeed: 2.68,
      caption:
        "Companions' oath: Along the quiet colonnade walked only one girl holding a single sleek puma on a thin leash.",
      audio: {
        type: "triangle",
        freq: 148,
        endFreq: 94,
        duration: 0.18,
        gain: 0.10,
        timbre: "taut-leash-pad",
        attack: 0.012,
        release: 0.15,
        filterFreq: 520
      }
    },
    window_dirigibles: {
      id: "window_dirigibles",
      stratum: "sky",
      bounds: { x0: 0.04, y0: 0.05, x1: 0.96, y1: 0.36 },
      anchor: { x: 0.72, y: 0.162 },
      initialVisibility: 0.87,
      tremorSeed: 3.84,
      caption:
        "Companions' oath: High among the city's spire tips hovered only one pale dirigible, lonely in open sky.",
      audio: {
        type: "sine",
        freq: 92,
        endFreq: 88,
        duration: 0.50,
        gain: 0.09,
        timbre: "distant-hull-drone",
        attack: 0.08,
        release: 0.40,
        filterFreq: 310
      }
    },
    sailor_tattoos: {
      id: "sailor_tattoos",
      stratum: "street",
      bounds: { x0: 0.66, y0: 0.38, x1: 0.96, y1: 0.70 },
      anchor: { x: 0.81, y: 0.558 },
      initialVisibility: 0.85,
      tremorSeed: 4.91,
      caption:
        "Companions' oath: We passed only one tattoo artist at an empty bench, arranging needles, ink pots, and a pierced stencil.",
      audio: {
        type: "square",
        freq: 1360,
        endFreq: 960,
        duration: 0.07,
        gain: 0.07,
        timbre: "single-needle-clink",
        attack: 0.002,
        release: 0.06,
        filterFreq: 2350
      }
    },
    humid_underground: {
      id: "humid_underground",
      stratum: "subterranean",
      bounds: { x0: 0.04, y0: 0.72, x1: 0.96, y1: 0.97 },
      anchor: { x: 0.485, y: 0.852 },
      initialVisibility: 0.88,
      tremorSeed: 5.79,
      caption:
        "Companions' oath: On an empty vaulted subway platform sat only one heavy woman fanning herself alone in rising damp.",
      audio: {
        type: "sine",
        freq: 236,
        endFreq: 162,
        duration: 0.34,
        gain: 0.09,
        timbre: "damp-fan-rustle",
        attack: 0.04,
        release: 0.28,
        filterFreq: 640
      }
    }
  };

  function clamp(v, lo, hi) {
    if (v !== v) return lo;
    return v < lo ? lo : v > hi ? hi : v;
  }

  function rgba(rgbTriplet, alpha) {
    return "rgba(" + rgbTriplet + "," + clamp(alpha, 0, 1).toFixed(4) + ")";
  }

  function createState() {
    const stones = {};
    for (let i = 0; i < STONE_IDS.length; i++) {
      const id = STONE_IDS[i];
      const spec = STONE_SPECS[id];
      stones[id] = {
        id: id,
        stratum: spec.stratum,
        visibility: spec.initialVisibility,
        pulseGlow: 0.35,
        permanence: 0,
        tremorPhase: spec.tremorSeed,
        actionPhase: i * 0.85,
        sightCount: 1,
        figure: {
          x: spec.anchor.x,
          y: spec.anchor.y,
          baseX: spec.anchor.x,
          baseY: spec.anchor.y
        },
        bounds: {
          x0: spec.bounds.x0,
          y0: spec.bounds.y0,
          x1: spec.bounds.x1,
          y1: spec.bounds.y1
        }
      };
    }
    return {
      elapsed: 0,
      tremorPhase: 0,
      reducedMotion: false,
      witnessWeight: 1,
      activeStone: null,
      stones: stones
    };
  }

  function sightPulse(state, stoneId) {
    if (!state || !state.stones) return state;
    if (stoneId === "all" || stoneId === "*") {
      for (let i = 0; i < STONE_IDS.length; i++) {
        const st = state.stones[STONE_IDS[i]];
        if (st) {
          st.visibility = SIGHT_SPIKE;
          st.pulseGlow = 1.0;
          st.sightCount = (st.sightCount || 0) + 1;
        }
      }
      return state;
    }
    const target = stoneId ? state.stones[stoneId] : null;
    if (!target) return state;
    target.visibility = SIGHT_SPIKE;
    target.pulseGlow = 1.0;
    target.sightCount = (target.sightCount || 0) + 1;
    if (!state.reducedMotion) {
      target.actionPhase += 0.55;
    }
    return state;
  }

  function step(state, dt, params) {
    if (!state || !state.stones) return state;
    const p = params || {};
    const safeDt = Math.max(0, Number(dt) || 0);
    const reduced = Boolean(p.reducedMotion);
    const permMap = p.stonePermanence || {};

    state.elapsed += safeDt;
    state.reducedMotion = reduced;
    if (typeof p.witnessWeight === "number") {
      state.witnessWeight = clamp(p.witnessWeight, 0, 1);
    }
    state.activeStone = p.activeStone || null;

    if (!reduced) {
      state.tremorPhase += safeDt * 2.4;
    }

    const visDecay = Math.exp(-DECAY_LAMBDA * safeDt);
    const pulseDecay = Math.exp(-PULSE_DECAY_LAMBDA * safeDt);

    for (let i = 0; i < STONE_IDS.length; i++) {
      const id = STONE_IDS[i];
      const st = state.stones[id];
      if (!st) continue;

      const perm = clamp(Number(permMap[id]) || 0, 0, 1);
      st.permanence = perm;

      // Exponential evaporation of unreinforced singular sighting down to ~0.048
      st.visibility = PHANTOM_FLOOR + (st.visibility - PHANTOM_FLOOR) * visDecay;
      st.pulseGlow = st.pulseGlow * pulseDecay;

      if (reduced) {
        st.figure.x = st.figure.baseX;
        st.figure.y = st.figure.baseY;
      } else {
        st.tremorPhase += safeDt * (3.15 + i * 0.43);
        st.actionPhase += safeDt * (1.12 + i * 0.09);

        // Uncertain perceptual drift grows as singular memory loses hold
        const uncertainty = (1 - st.visibility) * (1 - perm * 0.8);
        st.figure.x =
          st.figure.baseX + Math.sin(st.tremorPhase * 0.77) * 0.0032 * uncertainty;
        st.figure.y =
          st.figure.baseY + Math.cos(st.tremorPhase * 0.93) * 0.0024 * uncertainty;
      }
    }

    return state;
  }

  function getTestimonyCaption(stoneId) {
    const spec = stoneId && STONE_SPECS[stoneId];
    if (spec) return spec.caption;
    return "Companions' oath: We swore we saw only a single fleeting sign, already fading from mind.";
  }

  function getAudioCue(stoneId) {
    const spec = stoneId && STONE_SPECS[stoneId];
    const src = spec ? spec.audio : STONE_SPECS.cobble_canes.audio;
    return {
      type: src.type,
      freq: src.freq,
      endFreq: src.endFreq,
      duration: src.duration,
      gain: src.gain,
      timbre: src.timbre,
      attack: src.attack,
      release: src.release,
      filterFreq: src.filterFreq
    };
  }

  // ---------------------------------------------------------------------------
  // DRYPOINT & GRAPHITE DRAWING PRIMITIVES
  // ---------------------------------------------------------------------------

  function computeEffectiveStoneAlpha(st, perm, witnessWeight) {
    // Raw singular visibility decays to ~0.048 (< 0.08).
    // If stonePermanence is high, allow a faint stabilized ghost contour (~0.048..0.26)
    // while strictly keeping ONLY the 1 sworn companion instance.
    const stabilizedGhost = PHANTOM_FLOOR + perm * 0.21;
    const vis = Math.max(st.visibility, stabilizedGhost);
    return clamp(vis * witnessWeight, 0, 1);
  }

  function computeTremorOffsets(st, perm, reducedMotion, scalePx) {
    if (reducedMotion) {
      return { dx: 0, dy: 0, ghostDx: 0, ghostDy: 0, showGhost: false };
    }
    const unfixed = clamp(1 - perm * 0.85, 0, 1);
    const fadeInstability = clamp(0.35 + (1 - st.visibility) * 0.95, 0, 1.3);
    const amp = scalePx * 0.0055 * unfixed * fadeInstability;
    const dx =
      (Math.sin(st.tremorPhase * 2.7) * 0.65 +
        Math.cos(st.tremorPhase * 6.1) * 0.35) *
      amp;
    const dy =
      (Math.cos(st.tremorPhase * 2.3) * 0.65 +
        Math.sin(st.tremorPhase * 5.3) * 0.35) *
      amp;
    const ghostAmp = scalePx * 0.011 * unfixed * clamp(1.05 - st.visibility, 0.15, 0.95);
    return {
      dx: dx,
      dy: dy,
      ghostDx: Math.cos(st.tremorPhase * 1.35) * ghostAmp,
      ghostDy: Math.sin(st.tremorPhase * 1.15) * ghostAmp * 0.75,
      showGhost: unfixed > 0.2 && st.visibility > 0.06
    };
  }

  function drawPlateStrataGuides(ctx, width, height, witnessWeight, activeStone) {
    if (witnessWeight <= 0.002) return;
    const ruleAlpha = 0.052 * witnessWeight;
    ctx.save();
    ctx.strokeStyle = rgba(INK.graphite, ruleAlpha);
    ctx.lineWidth = 0.75;

    // Horizontal stratum registration rules (sky / street / subterranean)
    const ySkyStreet = height * 0.37;
    const yStreetSub = height * 0.71;
    ctx.setLineDash([5, 6]);
    ctx.beginPath();
    ctx.moveTo(width * 0.04, ySkyStreet);
    ctx.lineTo(width * 0.96, ySkyStreet);
    ctx.moveTo(width * 0.04, yStreetSub);
    ctx.lineTo(width * 0.96, yStreetSub);
    ctx.stroke();

    // Street triptych vertical hair-dividers
    ctx.setLineDash([2, 6]);
    ctx.beginPath();
    ctx.moveTo(width * 0.345, height * 0.385);
    ctx.lineTo(width * 0.345, height * 0.695);
    ctx.moveTo(width * 0.655, height * 0.385);
    ctx.lineTo(width * 0.655, height * 0.695);
    ctx.stroke();
    ctx.setLineDash([]);

    // Corner drypoint press-registration crosshairs
    const marks = [
      [0.04, 0.04],
      [0.96, 0.04],
      [0.04, 0.97],
      [0.96, 0.97]
    ];
    const tick = Math.max(3.5, Math.min(width, height) * 0.007);
    ctx.beginPath();
    for (let i = 0; i < marks.length; i++) {
      const mx = marks[i][0] * width;
      const my = marks[i][1] * height;
      ctx.moveTo(mx - tick, my);
      ctx.lineTo(mx + tick, my);
      ctx.moveTo(mx, my - tick);
      ctx.lineTo(mx, my + tick);
    }
    ctx.stroke();

    // Subtle witness caliper corners around focused stone (if activeStone set)
    if (activeStone && STONE_SPECS[activeStone]) {
      const b = STONE_SPECS[activeStone].bounds;
      const x0 = b.x0 * width;
      const y0 = b.y0 * height;
      const x1 = b.x1 * width;
      const y1 = b.y1 * height;
      const cl = Math.max(6, Math.min(x1 - x0, y1 - y0) * 0.055);
      ctx.strokeStyle = rgba(INK.vermilion, 0.19 * witnessWeight);
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      // Top-left
      ctx.moveTo(x0, y0 + cl);
      ctx.lineTo(x0, y0);
      ctx.lineTo(x0 + cl, y0);
      // Top-right
      ctx.moveTo(x1 - cl, y0);
      ctx.lineTo(x1, y0);
      ctx.lineTo(x1, y0 + cl);
      // Bottom-left
      ctx.moveTo(x0, y1 - cl);
      ctx.lineTo(x0, y1);
      ctx.lineTo(x0 + cl, y1);
      // Bottom-right
      ctx.moveTo(x1 - cl, y1);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x1, y1 - cl);
      ctx.stroke();
    }

    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // STONE 1: cobble_canes (x: 0.04..0.34, y: 0.38..0.70)
  // Strictly ONE solitary blind black man on sparse cobbles, mouth open
  // shouting with faint broken sound-arcs, tapping ONE cane.
  // ---------------------------------------------------------------------------
  function renderCobbleCanes(ctx, width, height, st, alpha, reducedMotion) {
    const b = st.bounds;
    const bx = b.x0 * width;
    const by = b.y0 * height;
    const bw = (b.x1 - b.x0) * width;
    const bh = (b.y1 - b.y0) * height;
    const s = Math.min(bw, bh);

    const archAlpha = alpha * 0.56;
    const tremor = computeTremorOffsets(st, st.permanence, reducedMotion, s);

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Sparse receding alley curb & fan-laid drypoint cobblestones
    ctx.strokeStyle = rgba(INK.graphite, archAlpha);
    ctx.lineWidth = Math.max(0.7, s * 0.0045);
    ctx.beginPath();
    ctx.moveTo(bx + bw * 0.05, by + bh * 0.62);
    ctx.quadraticCurveTo(bx + bw * 0.48, by + bh * 0.57, bx + bw * 0.94, by + bh * 0.64);
    ctx.stroke();

    // 15 sparse rounded cobblestones in perspective rows
    const cobbles = [
      [0.14, 0.70, 0.09, 0.032],
      [0.30, 0.68, 0.085, 0.030],
      [0.48, 0.69, 0.092, 0.032],
      [0.68, 0.67, 0.088, 0.030],
      [0.84, 0.71, 0.082, 0.028],
      [0.21, 0.78, 0.105, 0.036],
      [0.41, 0.77, 0.108, 0.038],
      [0.62, 0.79, 0.104, 0.036],
      [0.80, 0.78, 0.098, 0.035],
      [0.13, 0.87, 0.118, 0.042],
      [0.34, 0.86, 0.122, 0.043],
      [0.56, 0.88, 0.120, 0.042],
      [0.76, 0.87, 0.116, 0.040],
      [0.25, 0.94, 0.128, 0.044],
      [0.66, 0.94, 0.126, 0.043]
    ];
    for (let i = 0; i < cobbles.length; i++) {
      const c = cobbles[i];
      const cx = bx + bw * c[0];
      const cy = by + bh * c[1];
      const rx = s * c[2] * 0.55;
      const ry = s * c[3] * 0.55;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, -0.04, Math.PI * 0.92, Math.PI * 2.08);
      ctx.quadraticCurveTo(cx, cy + ry * 0.65, cx - rx, cy);
      ctx.stroke();
    }

    // Faint receding blind wall corner behind solitary figure
    ctx.strokeStyle = rgba(INK.graphite, archAlpha * 0.65);
    ctx.beginPath();
    ctx.moveTo(bx + bw * 0.13, by + bh * 0.12);
    ctx.lineTo(bx + bw * 0.13, by + bh * 0.60);
    ctx.moveTo(bx + bw * 0.06, by + bh * 0.24);
    ctx.lineTo(bx + bw * 0.28, by + bh * 0.20);
    ctx.stroke();

    // Solitary blind black man helper (strictly ONE figure)
    const cx = bx + bw * 0.42 + tremor.dx;
    const cy = by + bh * 0.55 + tremor.dy;
    const tapLift = reducedMotion
      ? 0
      : Math.max(0, Math.sin(st.actionPhase * 2.6)) * s * 0.016;

    function drawSolitaryBlindMan(ox, oy, passAlpha, isGhost) {
      ctx.save();
      ctx.translate(cx + ox, cy + oy);

      const strokeMain = rgba(INK.lampblack, passAlpha);
      const fillDark = rgba(INK.lampblack, passAlpha * (isGhost ? 0.35 : 0.88));
      const strokeSub = rgba(INK.graphite, passAlpha * 0.72);

      // Boots planted on sparse cobbles (stride posture)
      ctx.fillStyle = fillDark;
      ctx.strokeStyle = strokeMain;
      ctx.lineWidth = Math.max(0.9, s * 0.008);

      // Back leg & boot
      ctx.beginPath();
      ctx.moveTo(-s * 0.055, s * 0.085);
      ctx.lineTo(-s * 0.088, s * 0.225);
      ctx.lineTo(-s * 0.052, s * 0.232);
      ctx.lineTo(-s * 0.025, s * 0.095);
      ctx.closePath();
      ctx.fill();

      // Front leg & boot
      ctx.beginPath();
      ctx.moveTo(s * 0.018, s * 0.085);
      ctx.lineTo(s * 0.048, s * 0.238);
      ctx.lineTo(s * 0.092, s * 0.236);
      ctx.lineTo(s * 0.046, s * 0.092);
      ctx.closePath();
      ctx.fill();

      // Long weathered dark overcoat with forward-leaning stoop
      ctx.beginPath();
      ctx.moveTo(-s * 0.068, -s * 0.145);
      ctx.bezierCurveTo(
        -s * 0.115,
        -s * 0.035,
        -s * 0.118,
        s * 0.075,
        -s * 0.095,
        s * 0.148
      );
      ctx.lineTo(s * 0.068, s * 0.138);
      ctx.bezierCurveTo(
        s * 0.062,
        s * 0.035,
        s * 0.048,
        -s * 0.065,
        s * 0.018,
        -s * 0.148
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Drypoint Rag-chalk collar & coat fold highlights so silhouette reads richly
      if (!isGhost) {
        ctx.strokeStyle = rgba(INK.paper, passAlpha * 0.55);
        ctx.lineWidth = Math.max(0.7, s * 0.0045);
        ctx.beginPath();
        ctx.moveTo(-s * 0.018, -s * 0.142);
        ctx.lineTo(s * 0.005, -s * 0.065);
        ctx.moveTo(-s * 0.048, -s * 0.055);
        ctx.quadraticCurveTo(-s * 0.055, s * 0.035, -s * 0.062, s * 0.125);
        ctx.stroke();
      }

      // Head tilted upward-right, dark skin in lampblack carbon, open shouting mouth
      ctx.fillStyle = fillDark;
      ctx.strokeStyle = strokeMain;
      ctx.lineWidth = Math.max(0.85, s * 0.007);
      ctx.beginPath();
      // Textured crown & nape
      ctx.moveTo(-s * 0.038, -s * 0.155);
      ctx.bezierCurveTo(
        -s * 0.062,
        -s * 0.195,
        -s * 0.042,
        -s * 0.248,
        s * 0.004,
        -s * 0.246
      );
      // Forehead & brow
      ctx.bezierCurveTo(
        s * 0.036,
        -s * 0.244,
        s * 0.048,
        -s * 0.218,
        s * 0.044,
        -s * 0.198
      );
      // Nose profile
      ctx.lineTo(s * 0.060, -s * 0.184);
      ctx.lineTo(s * 0.045, -s * 0.175);
      // Upper lip -> WIDE OPEN SHOUTING MOUTH cavity -> lower jaw
      ctx.lineTo(s * 0.052, -s * 0.168);
      ctx.lineTo(s * 0.028, -s * 0.160);
      ctx.lineTo(s * 0.048, -s * 0.146);
      // Chin & throat
      ctx.quadraticCurveTo(s * 0.024, -s * 0.136, -s * 0.006, -s * 0.146);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Blind man's dark round spectacles / eye band
      if (!isGhost) {
        ctx.strokeStyle = rgba(INK.paper, passAlpha * 0.72);
        ctx.lineWidth = Math.max(0.75, s * 0.0048);
        ctx.beginPath();
        ctx.moveTo(-s * 0.028, -s * 0.205);
        ctx.lineTo(s * 0.038, -s * 0.198);
        ctx.stroke();
        ctx.fillStyle = rgba(INK.lampblack, passAlpha * 0.95);
        ctx.beginPath();
        ctx.arc(s * 0.032, -s * 0.198, s * 0.011, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Extended right arm & hand gripping STRICTLY ONE long slender cane
      const handX = s * 0.115;
      const handY = -s * 0.045 - tapLift * 0.35;
      ctx.strokeStyle = strokeMain;
      ctx.lineWidth = Math.max(1.4, s * 0.022);
      ctx.beginPath();
      ctx.moveTo(s * 0.006, -s * 0.115);
      ctx.quadraticCurveTo(s * 0.062, -s * 0.075, handX, handY);
      ctx.stroke();

      // Hand & knuckles
      ctx.fillStyle = fillDark;
      ctx.beginPath();
      ctx.arc(handX + s * 0.006, handY, s * 0.015, 0, Math.PI * 2);
      ctx.fill();

      // ONE slender cane tapping cobblestone
      const caneTipX = s * 0.238;
      const caneTipY = s * 0.245 - tapLift;
      ctx.strokeStyle = strokeMain;
      ctx.lineWidth = Math.max(1.1, s * 0.0095);
      ctx.beginPath();
      // Curved crook handle
      ctx.arc(handX - s * 0.004, handY - s * 0.008, s * 0.016, Math.PI * 0.95, Math.PI * 2.05);
      ctx.moveTo(handX + s * 0.010, handY - s * 0.004);
      ctx.lineTo(caneTipX, caneTipY);
      ctx.stroke();

      if (!isGhost) {
        // Pale ferrule tip of the solitary cane
        ctx.strokeStyle = rgba(INK.paper, passAlpha * 0.82);
        ctx.lineWidth = Math.max(1.0, s * 0.008);
        ctx.beginPath();
        ctx.moveTo(caneTipX - s * 0.022, caneTipY - s * 0.055);
        ctx.lineTo(caneTipX, caneTipY);
        ctx.stroke();

        // Acoustic cobble tap rings at the single cane point
        const ringPulse = 1 + st.pulseGlow * 0.45;
        ctx.strokeStyle = strokeSub;
        ctx.lineWidth = Math.max(0.7, s * 0.0045);
        ctx.beginPath();
        ctx.ellipse(
          caneTipX,
          s * 0.248,
          s * 0.032 * ringPulse,
          s * 0.011 * ringPulse,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.ellipse(
          caneTipX,
          s * 0.248,
          s * 0.058 * ringPulse,
          s * 0.019 * ringPulse,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        ctx.setLineDash([]);

        // Faint broken sound-arcs radiating from open shouting mouth
        const mouthX = s * 0.068;
        const mouthY = -s * 0.162;
        const arcExpand = (reducedMotion ? 0 : (st.actionPhase * 0.35) % 1) * s * 0.022;
        const radii = [s * 0.048 + arcExpand, s * 0.085 + arcExpand, s * 0.125 + arcExpand];
        ctx.strokeStyle = rgba(INK.lampblack, passAlpha * (0.58 + st.pulseGlow * 0.28));
        ctx.lineWidth = Math.max(0.75, s * 0.005);
        for (let r = 0; r < radii.length; r++) {
          const rad = radii[r];
          const fadeArc = 1 - r * 0.25;
          ctx.globalAlpha = clamp(fadeArc, 0.2, 1);
          ctx.beginPath();
          ctx.arc(mouthX, mouthY, rad, -0.68, -0.22);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(mouthX, mouthY, rad, -0.06, 0.34);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      ctx.restore();
    }

    if (tremor.showGhost) {
      drawSolitaryBlindMan(tremor.ghostDx, tremor.ghostDy, alpha * 0.24, true);
    }
    drawSolitaryBlindMan(0, 0, alpha, false);

    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // STONE 2: skyscraper_cornices (x: 0.04..0.96, y: 0.04..0.36)
  // Faint graphite spire silhouettes where strictly ONE lone lunatic leans and
  // teeters precariously from a single cornice ledge.
  // ---------------------------------------------------------------------------
  function renderSkyscraperCornices(ctx, width, height, st, alpha, reducedMotion) {
    const b = st.bounds;
    const bx = b.x0 * width;
    const by = b.y0 * height;
    const bw = (b.x1 - b.x0) * width;
    const bh = (b.y1 - b.y0) * height;
    const s = Math.min(bw * 0.42, bh);

    const archAlpha = alpha * 0.54;
    const tremor = computeTremorOffsets(st, st.permanence, reducedMotion, s);

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Background bare skyscraper spires (every other cornice conspicuously EMPTY)
    const spires = [
      { x: 0.07, w: 0.075, top: 0.28 },
      { x: 0.36, w: 0.085, top: 0.22 },
      { x: 0.49, w: 0.070, top: 0.34 },
      { x: 0.84, w: 0.082, top: 0.25 }
    ];
    ctx.strokeStyle = rgba(INK.prussian, archAlpha * 0.65);
    ctx.lineWidth = Math.max(0.65, s * 0.004);
    for (let i = 0; i < spires.length; i++) {
      const sp = spires[i];
      const sx = bx + bw * sp.x;
      const sw = bw * sp.w;
      const sy = by + bh * sp.top;
      const sb = by + bh * 0.98;
      ctx.beginPath();
      ctx.moveTo(sx, sb);
      ctx.lineTo(sx, sy);
      // Bare projecting cornice molding (no figure!)
      ctx.lineTo(sx - sw * 0.08, sy - bh * 0.022);
      ctx.lineTo(sx + sw * 1.08, sy - bh * 0.022);
      ctx.lineTo(sx + sw, sy);
      ctx.lineTo(sx + sw, sb);
      // Stepped spire pinnacle
      ctx.moveTo(sx + sw * 0.22, sy - bh * 0.022);
      ctx.lineTo(sx + sw * 0.22, sy - bh * 0.10);
      ctx.lineTo(sx + sw * 0.50, sy - bh * 0.19);
      ctx.lineTo(sx + sw * 0.78, sy - bh * 0.10);
      ctx.lineTo(sx + sw * 0.78, sy - bh * 0.022);
      ctx.stroke();

      // Sparse blind vertical window mullions
      ctx.beginPath();
      for (let m = 1; m <= 2; m++) {
        const mx = sx + (sw * m) / 3;
        ctx.moveTo(mx, sy + bh * 0.05);
        ctx.lineTo(mx, sb - bh * 0.04);
      }
      ctx.stroke();
    }

    // Focal skyscraper tower with jutting cantilevered stone cornice ledge
    const ledgeX = bx + bw * 0.245;
    const ledgeY = by + bh * 0.44;
    const towerLeft = ledgeX - s * 0.34;
    const towerBottom = by + bh * 0.98;

    ctx.strokeStyle = rgba(INK.graphite, archAlpha * 0.95);
    ctx.lineWidth = Math.max(0.85, s * 0.0058);
    ctx.beginPath();
    // Tower shaft & setback spire above cornice
    ctx.moveTo(towerLeft, towerBottom);
    ctx.lineTo(towerLeft, ledgeY);
    ctx.lineTo(ledgeX - s * 0.06, ledgeY);
    // Cantilevered cornice slab & corbel profile jutting right over the street void
    ctx.lineTo(ledgeX + s * 0.055, ledgeY);
    ctx.lineTo(ledgeX + s * 0.042, ledgeY + s * 0.028);
    ctx.lineTo(ledgeX - s * 0.042, ledgeY + s * 0.048);
    ctx.lineTo(ledgeX - s * 0.062, ledgeY + s * 0.072);
    ctx.lineTo(ledgeX - s * 0.062, towerBottom);
    ctx.stroke();

    // Upper tower setback & spire needle above cornice
    ctx.beginPath();
    ctx.moveTo(towerLeft + s * 0.04, ledgeY);
    ctx.lineTo(towerLeft + s * 0.04, ledgeY - s * 0.16);
    ctx.lineTo(ledgeX - s * 0.11, ledgeY - s * 0.27);
    ctx.lineTo(ledgeX - s * 0.11, ledgeY);
    ctx.moveTo(towerLeft + s * 0.11, ledgeY - s * 0.21);
    ctx.lineTo(towerLeft + s * 0.11, ledgeY - s * 0.35);
    ctx.stroke();

    // Cornice dentils & vertical facade fluting
    ctx.lineWidth = Math.max(0.65, s * 0.0038);
    ctx.beginPath();
    for (let d = 0; d < 6; d++) {
      const dx = towerLeft + s * 0.03 + d * s * 0.055;
      ctx.moveTo(dx, ledgeY + s * 0.015);
      ctx.lineTo(dx, ledgeY + s * 0.034);
    }
    for (let w = 0; w < 3; w++) {
      const wx = towerLeft + s * 0.065 + w * s * 0.078;
      ctx.moveTo(wx, ledgeY + s * 0.09);
      ctx.lineTo(wx, towerBottom - s * 0.03);
    }
    ctx.stroke();

    // STRICTLY ONE lone lunatic leaning & teetering precariously from the cornice edge
    const pivotX = ledgeX + s * 0.038 + tremor.dx;
    const pivotY = ledgeY + tremor.dy;
    const swayAngle = reducedMotion
      ? 0.56
      : 0.56 + Math.sin(st.actionPhase * 1.85) * 0.085 + st.pulseGlow * 0.06;

    function drawLoneLunatic(ox, oy, passAlpha, isGhost) {
      ctx.save();
      ctx.translate(pivotX + ox, pivotY + oy);

      // Dizzying vertical plumb-drop whisper into the street abyss
      if (!isGhost) {
        ctx.strokeStyle = rgba(INK.prussian, passAlpha * 0.34);
        ctx.lineWidth = Math.max(0.65, s * 0.0035);
        ctx.setLineDash([2.5, 4.5]);
        ctx.beginPath();
        ctx.moveTo(s * 0.095, s * 0.02);
        ctx.lineTo(s * 0.095, towerBottom - pivotY);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const col = rgba(INK.lampblack, passAlpha);
      ctx.strokeStyle = col;
      ctx.fillStyle = rgba(INK.lampblack, passAlpha * (isGhost ? 0.35 : 0.88));
      ctx.lineWidth = Math.max(1.05, s * 0.0085);

      // Back leg anchored desperately to cornice coping
      ctx.beginPath();
      ctx.moveTo(-s * 0.048, -s * 0.004);
      ctx.lineTo(-s * 0.012, -s * 0.072);
      ctx.stroke();

      // Rotate upper body & front leg out over the void at precarious tilt
      ctx.rotate(swayAngle);

      // Front supporting leg right on the knife-edge of the stone lip
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -s * 0.108);
      ctx.stroke();

      // Torso & fluttering open coat-tails whipped backward
      ctx.beginPath();
      ctx.moveTo(-s * 0.014, -s * 0.102);
      ctx.lineTo(-s * 0.075, -s * 0.078);
      ctx.quadraticCurveTo(-s * 0.052, -s * 0.135, -s * 0.012, -s * 0.192);
      ctx.lineTo(s * 0.022, -s * 0.188);
      ctx.lineTo(s * 0.016, -s * 0.102);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Flung balance arms: one windmilling back, one reaching into empty sky
      ctx.lineWidth = Math.max(0.95, s * 0.0075);
      ctx.beginPath();
      // Forward arm reaching over the drop
      ctx.moveTo(s * 0.016, -s * 0.178);
      ctx.quadraticCurveTo(s * 0.068, -s * 0.205, s * 0.102, -s * 0.182);
      // Backward counterbalance arm
      ctx.moveTo(-s * 0.010, -s * 0.178);
      ctx.quadraticCurveTo(-s * 0.068, -s * 0.212, -s * 0.098, -s * 0.238);
      ctx.stroke();

      // Wild head & wind-blown hair tufts
      ctx.beginPath();
      ctx.arc(s * 0.012, -s * 0.216, s * 0.021, 0, Math.PI * 2);
      ctx.fill();

      if (!isGhost) {
        ctx.lineWidth = Math.max(0.7, s * 0.0045);
        ctx.beginPath();
        ctx.moveTo(s * 0.002, -s * 0.235);
        ctx.lineTo(-s * 0.018, -s * 0.258);
        ctx.moveTo(s * 0.012, -s * 0.237);
        ctx.lineTo(s * 0.006, -s * 0.264);
        ctx.moveTo(s * 0.022, -s * 0.232);
        ctx.lineTo(s * 0.032, -s * 0.256);
        ctx.stroke();
      }

      ctx.restore();
    }

    if (tremor.showGhost) {
      drawLoneLunatic(tremor.ghostDx, tremor.ghostDy, alpha * 0.24, true);
    }
    drawLoneLunatic(0, 0, alpha, false);

    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // STONE 3: leashed_pumas (x: 0.35..0.65, y: 0.38..0.70)
  // Strictly ONE girl walking ONE sleek puma on a thin leash along a quiet
  // colonnade.
  // ---------------------------------------------------------------------------
  function renderLeashedPumas(ctx, width, height, st, alpha, reducedMotion) {
    const b = st.bounds;
    const bx = b.x0 * width;
    const by = b.y0 * height;
    const bw = (b.x1 - b.x0) * width;
    const bh = (b.y1 - b.y0) * height;
    const s = Math.min(bw, bh);

    const archAlpha = alpha * 0.54;
    const tremor = computeTremorOffsets(st, st.permanence, reducedMotion, s);

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Quiet classical colonnade arches & flagged promenade
    const colYTop = by + bh * 0.14;
    const colYCap = by + bh * 0.30;
    const colYBase = by + bh * 0.69;
    const colsX = [0.12, 0.37, 0.63, 0.88];

    ctx.strokeStyle = rgba(INK.graphite, archAlpha);
    ctx.lineWidth = Math.max(0.75, s * 0.0048);

    // Entablature & pavement datum lines
    ctx.beginPath();
    ctx.moveTo(bx + bw * 0.05, colYTop);
    ctx.lineTo(bx + bw * 0.95, colYTop);
    ctx.moveTo(bx + bw * 0.04, colYBase);
    ctx.lineTo(bx + bw * 0.96, colYBase);
    ctx.moveTo(bx + bw * 0.03, by + bh * 0.89);
    ctx.lineTo(bx + bw * 0.97, by + bh * 0.89);
    ctx.stroke();

    // Columns & round colonnade arches
    for (let i = 0; i < colsX.length; i++) {
      const cxCol = bx + bw * colsX[i];
      const halfCol = s * 0.018;
      ctx.beginPath();
      ctx.moveTo(cxCol - halfCol, colYCap);
      ctx.lineTo(cxCol - halfCol, colYBase);
      ctx.moveTo(cxCol + halfCol, colYCap);
      ctx.lineTo(cxCol + halfCol, colYBase);
      // Capital & plinth
      ctx.moveTo(cxCol - halfCol * 1.55, colYCap);
      ctx.lineTo(cxCol + halfCol * 1.55, colYCap);
      ctx.moveTo(cxCol - halfCol * 1.55, colYBase);
      ctx.lineTo(cxCol + halfCol * 1.55, colYBase);
      ctx.stroke();

      if (i < colsX.length - 1) {
        const nextCol = bx + bw * colsX[i + 1];
        const midX = (cxCol + nextCol) * 0.5;
        const spanHalf = (nextCol - cxCol) * 0.5 - halfCol;
        ctx.beginPath();
        ctx.arc(midX, colYCap, Math.max(4, spanHalf), Math.PI, 0, false);
        ctx.stroke();
      }
    }

    // Center of solitary pair (ONE girl + ONE sleek puma on ONE thin leash)
    const cx = bx + bw * 0.48 + tremor.dx;
    const cy = by + bh * 0.67 + tremor.dy;
    const stride = reducedMotion ? 0.25 : Math.sin(st.actionPhase * 1.9);

    function drawGirlAndPuma(ox, oy, passAlpha, isGhost) {
      ctx.save();
      ctx.translate(cx + ox, cy + oy);

      const strokeMain = rgba(INK.lampblack, passAlpha);
      const fillGirl = rgba(INK.prussian, passAlpha * (isGhost ? 0.28 : 0.72));
      const fillPuma = rgba(INK.lampblack, passAlpha * (isGhost ? 0.32 : 0.84));
      const ochreWash = rgba(INK.ochre, passAlpha * 0.34);

      // --- STRICTLY ONE GIRL (left side of pair, walking right) ---
      const gx = -s * 0.20;
      const gy = s * 0.11;

      ctx.strokeStyle = strokeMain;
      ctx.fillStyle = fillGirl;
      ctx.lineWidth = Math.max(0.95, s * 0.0075);

      // Stepping boots beneath skirt hem
      ctx.beginPath();
      ctx.moveTo(gx - s * 0.032, gy + s * 0.052);
      ctx.lineTo(gx - s * 0.045 - stride * s * 0.012, gy + s * 0.095);
      ctx.lineTo(gx - s * 0.018 - stride * s * 0.012, gy + s * 0.095);
      ctx.moveTo(gx + s * 0.025, gy + s * 0.052);
      ctx.lineTo(gx + s * 0.044 + stride * s * 0.012, gy + s * 0.095);
      ctx.lineTo(gx + s * 0.070 + stride * s * 0.012, gy + s * 0.094);
      ctx.stroke();

      // Flowing pleated dress & fitted waist bodice
      ctx.beginPath();
      ctx.moveTo(gx - s * 0.018, gy - s * 0.215);
      ctx.lineTo(gx + s * 0.020, gy - s * 0.215);
      // Bodice down to narrow waist
      ctx.lineTo(gx + s * 0.015, gy - s * 0.135);
      // Billowing long skirt forward & sweeping train behind
      ctx.bezierCurveTo(
        gx + s * 0.048,
        gy - s * 0.065,
        gx + s * 0.068,
        gy + s * 0.015,
        gx + s * 0.062,
        gy + s * 0.058
      );
      ctx.quadraticCurveTo(gx - s * 0.010, gy + s * 0.072, gx - s * 0.088, gy + s * 0.052);
      ctx.bezierCurveTo(
        gx - s * 0.072,
        gy - s * 0.015,
        gx - s * 0.038,
        gy - s * 0.082,
        gx - s * 0.016,
        gy - s * 0.135
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Drypoint skirt drapery pleats
      if (!isGhost) {
        ctx.strokeStyle = rgba(INK.paper, passAlpha * 0.5);
        ctx.lineWidth = Math.max(0.65, s * 0.004);
        ctx.beginPath();
        ctx.moveTo(gx - s * 0.008, gy - s * 0.125);
        ctx.quadraticCurveTo(gx - s * 0.025, gy - s * 0.02, gx - s * 0.042, gy + s * 0.052);
        ctx.moveTo(gx + s * 0.008, gy - s * 0.125);
        ctx.quadraticCurveTo(gx + s * 0.022, gy - s * 0.02, gx + s * 0.026, gy + s * 0.058);
        ctx.stroke();
      }

      // Girl's head, graceful neck & wide-brimmed promenade hat with ribbon
      ctx.fillStyle = rgba(INK.lampblack, passAlpha * 0.85);
      ctx.strokeStyle = strokeMain;
      ctx.lineWidth = Math.max(0.85, s * 0.0068);
      ctx.beginPath();
      ctx.arc(gx + s * 0.004, gy - s * 0.248, s * 0.022, 0, Math.PI * 2);
      ctx.fill();

      // Wide slanted hat brim & trailing silk ribbon
      ctx.beginPath();
      ctx.moveTo(gx - s * 0.052, gy - s * 0.256);
      ctx.quadraticCurveTo(gx + s * 0.006, gy - s * 0.278, gx + s * 0.054, gy - s * 0.250);
      ctx.moveTo(gx - s * 0.024, gy - s * 0.258);
      ctx.quadraticCurveTo(gx - s * 0.068, gy - s * 0.238, gx - s * 0.086, gy - s * 0.215);
      ctx.stroke();

      // Girl's extended forearm holding leash loop
      const handX = gx + s * 0.088;
      const handY = gy - s * 0.142;
      ctx.lineWidth = Math.max(0.95, s * 0.0075);
      ctx.beginPath();
      ctx.moveTo(gx + s * 0.012, gy - s * 0.198);
      ctx.quadraticCurveTo(gx + s * 0.048, gy - s * 0.162, handX, handY);
      ctx.stroke();

      // --- STRICTLY ONE SLEEK PUMA (right side of pair, pacing low) ---
      const px = s * 0.165;
      const py = s * 0.135;
      const collarX = px + s * 0.085;
      const collarY = py - s * 0.058;

      // ONE thin taut leash connecting girl's hand to puma's collar
      ctx.strokeStyle = rgba(INK.lampblack, passAlpha * 0.92);
      ctx.lineWidth = Math.max(0.8, s * 0.0052);
      ctx.beginPath();
      ctx.moveTo(handX, handY);
      ctx.quadraticCurveTo(
        (handX + collarX) * 0.5,
        (handY + collarY) * 0.5 + s * 0.032,
        collarX,
        collarY
      );
      ctx.stroke();

      // Puma warm tawny drypoint under-wash
      if (!isGhost) {
        ctx.fillStyle = ochreWash;
        ctx.beginPath();
        ctx.ellipse(px, py - s * 0.03, s * 0.115, s * 0.036, -0.05, 0, Math.PI * 2);
        ctx.fill();
      }

      // Puma four articulated legs in prowl stride
      ctx.strokeStyle = strokeMain;
      ctx.fillStyle = fillPuma;
      ctx.lineWidth = Math.max(1.1, s * 0.011);

      // Far hind & far fore legs
      ctx.beginPath();
      ctx.moveTo(px - s * 0.082, py - s * 0.015);
      ctx.lineTo(px - s * 0.108 - stride * s * 0.016, py + s * 0.068);
      ctx.moveTo(px + s * 0.058, py - s * 0.015);
      ctx.lineTo(px + s * 0.042 - stride * s * 0.018, py + s * 0.068);
      ctx.stroke();

      // Sleek muscular feline body, low predatory skull, rounded ears & long S-curved tail
      ctx.lineWidth = Math.max(0.95, s * 0.0075);
      ctx.beginPath();
      // Rump -> supple dipped spine -> muscular shoulder blade -> neck -> skull
      ctx.moveTo(px - s * 0.105, py - s * 0.052);
      ctx.bezierCurveTo(
        px - s * 0.045,
        py - s * 0.062,
        px + s * 0.020,
        py - s * 0.050,
        px + s * 0.072,
        py - s * 0.074
      );
      // Neck & small rounded feline ear
      ctx.lineTo(px + s * 0.102, py - s * 0.098);
      ctx.lineTo(px + s * 0.108, py - s * 0.116);
      ctx.lineTo(px + s * 0.122, py - s * 0.102);
      // Flat cougar forehead & muzzle
      ctx.quadraticCurveTo(px + s * 0.156, py - s * 0.096, px + s * 0.162, py - s * 0.076);
      ctx.quadraticCurveTo(px + s * 0.145, py - s * 0.064, px + s * 0.118, py - s * 0.068);
      // Chest brisket & taut tucked belly
      ctx.quadraticCurveTo(px + s * 0.095, py - s * 0.025, px + s * 0.068, py - s * 0.008);
      ctx.bezierCurveTo(
        px + s * 0.015,
        py - s * 0.005,
        px - s * 0.045,
        py - s * 0.022,
        px - s * 0.092,
        py - s * 0.012
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Near foreleg reaching forward & near hindleg pushing off
      ctx.lineWidth = Math.max(1.25, s * 0.013);
      ctx.beginPath();
      // Foreleg + paw
      ctx.moveTo(px + s * 0.072, py - s * 0.020);
      ctx.lineTo(px + s * 0.108 + stride * s * 0.018, py + s * 0.068);
      ctx.lineTo(px + s * 0.126 + stride * s * 0.018, py + s * 0.068);
      // Hindleg + hock + paw
      ctx.moveTo(px - s * 0.082, py - s * 0.025);
      ctx.lineTo(px - s * 0.098 + stride * s * 0.014, py + s * 0.026);
      ctx.lineTo(px - s * 0.072 + stride * s * 0.016, py + s * 0.068);
      ctx.lineTo(px - s * 0.054 + stride * s * 0.016, py + s * 0.068);
      ctx.stroke();

      // Signature long heavy S-curved puma tail
      const tailLift = reducedMotion ? 0 : Math.cos(st.actionPhase * 1.9) * s * 0.012;
      ctx.lineWidth = Math.max(1.2, s * 0.012);
      ctx.beginPath();
      ctx.moveTo(px - s * 0.102, py - s * 0.046);
      ctx.bezierCurveTo(
        px - s * 0.155,
        py - s * 0.015,
        px - s * 0.188,
        py + s * 0.042 + tailLift,
        px - s * 0.222,
        py + s * 0.008 + tailLift
      );
      ctx.stroke();

      // Brass collar ring glint
      if (!isGhost) {
        ctx.strokeStyle = rgba(INK.ochre, passAlpha * 0.9);
        ctx.lineWidth = Math.max(0.95, s * 0.0075);
        ctx.beginPath();
        ctx.moveTo(px + s * 0.076, py - s * 0.076);
        ctx.lineTo(px + s * 0.098, py - s * 0.052);
        ctx.stroke();
      }

      ctx.restore();
    }

    if (tremor.showGhost) {
      drawGirlAndPuma(tremor.ghostDx, tremor.ghostDy, alpha * 0.24, true);
    }
    drawGirlAndPuma(0, 0, alpha, false);

    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // STONE 4: window_dirigibles (x: 0.04..0.96, y: 0.05..0.36)
  // Strictly ONE pale dirigible hovering high and lonely among spire tips.
  // ---------------------------------------------------------------------------
  function renderWindowDirigibles(ctx, width, height, st, alpha, reducedMotion) {
    const b = st.bounds;
    const bx = b.x0 * width;
    const by = b.y0 * height;
    const bw = (b.x1 - b.x0) * width;
    const bh = (b.y1 - b.y0) * height;
    const s = Math.min(bw * 0.42, bh);

    const archAlpha = alpha * 0.52;
    const tremor = computeTremorOffsets(st, st.permanence, reducedMotion, s);

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Distant lonely spire finials & weathervanes far below/around the high airship
    const tips = [
      { x: 0.58, top: 0.54, w: 0.042 },
      { x: 0.67, top: 0.64, w: 0.038 },
      { x: 0.78, top: 0.58, w: 0.044 },
      { x: 0.91, top: 0.46, w: 0.040 }
    ];
    ctx.strokeStyle = rgba(INK.graphite, archAlpha * 0.72);
    ctx.lineWidth = Math.max(0.65, s * 0.004);
    for (let i = 0; i < tips.length; i++) {
      const tp = tips[i];
      const tx = bx + bw * tp.x;
      const tw = bw * tp.w;
      const ty = by + bh * tp.top;
      const tb = by + bh * 0.98;
      ctx.beginPath();
      // Spire needle
      ctx.moveTo(tx, ty - bh * 0.14);
      ctx.lineTo(tx, ty);
      // Cupola pyramid
      ctx.moveTo(tx - tw * 0.5, ty + bh * 0.16);
      ctx.lineTo(tx, ty);
      ctx.lineTo(tx + tw * 0.5, ty + bh * 0.16);
      // Lower tower edges (empty dark window slits, zero airships at window level!)
      ctx.moveTo(tx - tw * 0.5, ty + bh * 0.16);
      ctx.lineTo(tx - tw * 0.5, tb);
      ctx.moveTo(tx + tw * 0.5, ty + bh * 0.16);
      ctx.lineTo(tx + tw * 0.5, tb);
      ctx.stroke();
    }

    // High, lonely dirigible anchor
    const floatY = reducedMotion ? 0 : Math.sin(st.actionPhase * 0.95) * s * 0.016;
    const floatX = reducedMotion ? 0 : Math.cos(st.actionPhase * 0.55) * s * 0.012;
    const cx = bx + bw * 0.715 + floatX + tremor.dx;
    const cy = by + bh * 0.34 + floatY + tremor.dy;

    function drawLonelyDirigible(ox, oy, passAlpha, isGhost) {
      ctx.save();
      ctx.translate(cx + ox, cy + oy);
      ctx.rotate(-0.035);

      const hullRx = s * 0.34;
      const hullRy = s * 0.096;

      // Pale rag + brass-ochre translucent envelope wash
      if (!isGhost) {
        ctx.fillStyle = rgba(INK.paper, passAlpha * 0.55);
        ctx.beginPath();
        ctx.moveTo(-hullRx, 0);
        ctx.bezierCurveTo(
          -hullRx * 0.85,
          -hullRy * 1.15,
          hullRx * 0.45,
          -hullRy * 1.10,
          hullRx,
          0
        );
        ctx.bezierCurveTo(
          hullRx * 0.45,
          hullRy * 1.10,
          -hullRx * 0.85,
          hullRy * 1.15,
          -hullRx,
          0
        );
        ctx.closePath();
        ctx.fill();

        // Warm ochre lower-hull shadow glaze
        ctx.fillStyle = rgba(INK.ochre, passAlpha * 0.22);
        ctx.beginPath();
        ctx.moveTo(-hullRx * 0.95, s * 0.008);
        ctx.bezierCurveTo(
          -hullRx * 0.55,
          hullRy * 1.05,
          hullRx * 0.45,
          hullRy * 1.02,
          hullRx * 0.96,
          s * 0.004
        );
        ctx.quadraticCurveTo(0, hullRy * 0.35, -hullRx * 0.95, s * 0.008);
        ctx.closePath();
        ctx.fill();
      }

      // Cruciform tail stabilizer fins & rudder (at right/stern)
      ctx.strokeStyle = rgba(INK.prussian, passAlpha * 0.85);
      ctx.fillStyle = rgba(INK.ochre, passAlpha * (isGhost ? 0.15 : 0.32));
      ctx.lineWidth = Math.max(0.8, s * 0.0055);

      // Upper vertical fin
      ctx.beginPath();
      ctx.moveTo(hullRx * 0.62, -hullRy * 0.48);
      ctx.lineTo(hullRx * 0.94, -hullRy * 1.08);
      ctx.lineTo(hullRx * 1.02, -hullRy * 0.22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Lower vertical fin
      ctx.beginPath();
      ctx.moveTo(hullRx * 0.62, hullRy * 0.48);
      ctx.lineTo(hullRx * 0.94, hullRy * 1.06);
      ctx.lineTo(hullRx * 1.02, hullRy * 0.22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Primary streamlined rigid hull contour
      ctx.strokeStyle = rgba(INK.lampblack, passAlpha * 0.9);
      ctx.lineWidth = Math.max(0.95, s * 0.0068);
      ctx.beginPath();
      ctx.moveTo(-hullRx, 0);
      ctx.bezierCurveTo(
        -hullRx * 0.85,
        -hullRy * 1.15,
        hullRx * 0.45,
        -hullRy * 1.10,
        hullRx,
        0
      );
      ctx.bezierCurveTo(
        hullRx * 0.45,
        hullRy * 1.10,
        -hullRx * 0.85,
        hullRy * 1.15,
        -hullRx,
        0
      );
      ctx.closePath();
      ctx.stroke();

      // Nose mooring cone spindle
      ctx.beginPath();
      ctx.moveTo(-hullRx, 0);
      ctx.lineTo(-hullRx - s * 0.028, 0);
      ctx.stroke();

      // Longitudinal girder ribs & transverse ring frames
      if (!isGhost) {
        ctx.strokeStyle = rgba(INK.graphite, passAlpha * 0.46);
        ctx.lineWidth = Math.max(0.55, s * 0.0034);
        const ribFactors = [-0.58, -0.22, 0.22, 0.58];
        for (let r = 0; r < ribFactors.length; r++) {
          const rf = ribFactors[r];
          ctx.beginPath();
          ctx.moveTo(-hullRx, 0);
          ctx.bezierCurveTo(
            -hullRx * 0.82,
            hullRy * 1.12 * rf,
            hullRx * 0.45,
            hullRy * 1.08 * rf,
            hullRx,
            0
          );
          ctx.stroke();
        }

        const rings = [-0.62, -0.34, -0.06, 0.22, 0.50, 0.74];
        for (let k = 0; k < rings.length; k++) {
          const u = rings[k];
          const xRing = u * hullRx;
          const halfH = hullRy * Math.sqrt(Math.max(0, 1 - u * u * 0.92));
          ctx.beginPath();
          ctx.moveTo(xRing, -halfH);
          ctx.quadraticCurveTo(xRing - s * 0.012, 0, xRing, halfH);
          ctx.stroke();
        }
      }

      // Suspended ventral control gondola + rigging cables + tiny rear propeller
      const gondX = -hullRx * 0.16;
      const gondY = hullRy * 1.06;
      const gondW = s * 0.145;
      const gondH = s * 0.032;

      ctx.strokeStyle = rgba(INK.lampblack, passAlpha * 0.82);
      ctx.lineWidth = Math.max(0.65, s * 0.004);
      // Rigging struts
      ctx.beginPath();
      ctx.moveTo(gondX - gondW * 0.58, hullRy * 0.82);
      ctx.lineTo(gondX - gondW * 0.44, gondY);
      ctx.moveTo(gondX + gondW * 0.58, hullRy * 0.84);
      ctx.lineTo(gondX + gondW * 0.44, gondY);
      ctx.moveTo(gondX, hullRy * 0.92);
      ctx.lineTo(gondX, gondY);
      ctx.stroke();

      // Gondola car body
      ctx.fillStyle = rgba(INK.prussian, passAlpha * (isGhost ? 0.3 : 0.78));
      ctx.beginPath();
      ctx.moveTo(gondX - gondW * 0.5, gondY);
      ctx.lineTo(gondX + gondW * 0.5, gondY);
      ctx.lineTo(gondX + gondW * 0.42, gondY + gondH);
      ctx.lineTo(gondX - gondW * 0.40, gondY + gondH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Tiny lit/pale observation panes in gondola + delicate rear propeller
      if (!isGhost) {
        ctx.fillStyle = rgba(INK.paper, passAlpha * 0.82);
        for (let p = -1; p <= 1; p++) {
          ctx.fillRect(
            gondX + p * gondW * 0.24 - gondW * 0.06,
            gondY + gondH * 0.24,
            gondW * 0.12,
            gondH * 0.46
          );
        }

        // Tiny propeller disc at stern of gondola
        const propSpin = reducedMotion ? 0.8 : st.actionPhase * 5.5;
        const propLen = gondH * 0.78 * (0.45 + 0.55 * Math.abs(Math.cos(propSpin)));
        ctx.strokeStyle = rgba(INK.ochre, passAlpha * 0.88);
        ctx.lineWidth = Math.max(0.75, s * 0.0045);
        ctx.beginPath();
        ctx.moveTo(gondX + gondW * 0.56, gondY + gondH * 0.5 - propLen);
        ctx.lineTo(gondX + gondW * 0.56, gondY + gondH * 0.5 + propLen);
        ctx.stroke();
      }

      ctx.restore();
    }

    if (tremor.showGhost) {
      drawLonelyDirigible(tremor.ghostDx, tremor.ghostDy, alpha * 0.24, true);
    }
    drawLonelyDirigible(0, 0, alpha, false);

    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // STONE 5: sailor_tattoos (x: 0.66..0.96, y: 0.38..0.70)
  // Strictly ONE tattoo artist bent over a quiet bench arranging needles, tiny
  // ink pots, and a pierced stencil pattern (no crowd of sailors).
  // ---------------------------------------------------------------------------
  function renderSailorTattoos(ctx, width, height, st, alpha, reducedMotion) {
    const b = st.bounds;
    const bx = b.x0 * width;
    const by = b.y0 * height;
    const bw = (b.x1 - b.x0) * width;
    const bh = (b.y1 - b.y0) * height;
    const s = Math.min(bw, bh);

    const archAlpha = alpha * 0.55;
    const tremor = computeTremorOffsets(st, st.permanence, reducedMotion, s);

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Quiet open harbor parlor alcove + hanging shade lamp + UNOCCUPIED customer stool
    ctx.strokeStyle = rgba(INK.graphite, archAlpha);
    ctx.lineWidth = Math.max(0.75, s * 0.0048);

    // Shop post, lintel, and floorboard line
    ctx.beginPath();
    ctx.moveTo(bx + bw * 0.08, by + bh * 0.14);
    ctx.lineTo(bx + bw * 0.92, by + bh * 0.14);
    ctx.moveTo(bx + bw * 0.10, by + bh * 0.14);
    ctx.lineTo(bx + bw * 0.10, by + bh * 0.88);
    ctx.moveTo(bx + bw * 0.06, by + bh * 0.88);
    ctx.lineTo(bx + bw * 0.94, by + bh * 0.88);
    ctx.stroke();

    // Hanging oil/parlor shade lamp overhead
    const lampX = bx + bw * 0.56;
    const lampY = by + bh * 0.26;
    ctx.beginPath();
    ctx.moveTo(lampX, by + bh * 0.14);
    ctx.lineTo(lampX, lampY - s * 0.022);
    ctx.moveTo(lampX - s * 0.055, lampY + s * 0.012);
    ctx.quadraticCurveTo(lampX, lampY - s * 0.032, lampX + s * 0.055, lampY + s * 0.012);
    ctx.closePath();
    ctx.stroke();

    // Conspicuously EMPTY three-legged customer stool on left (no crowd of sailors!)
    const stoolX = bx + bw * 0.23;
    const stoolY = by + bh * 0.72;
    ctx.beginPath();
    ctx.ellipse(stoolX, stoolY, s * 0.048, s * 0.014, 0, 0, Math.PI * 2);
    ctx.moveTo(stoolX - s * 0.032, stoolY + s * 0.012);
    ctx.lineTo(stoolX - s * 0.048, by + bh * 0.88);
    ctx.moveTo(stoolX, stoolY + s * 0.014);
    ctx.lineTo(stoolX, by + bh * 0.88);
    ctx.moveTo(stoolX + s * 0.032, stoolY + s * 0.012);
    ctx.lineTo(stoolX + s * 0.048, by + bh * 0.88);
    ctx.stroke();

    // Center of solitary tattoo artist & workbench
    const cx = bx + bw * 0.60 + tremor.dx;
    const cy = by + bh * 0.64 + tremor.dy;
    const handShift = reducedMotion ? 0 : Math.sin(st.actionPhase * 1.45) * s * 0.008;

    function drawSolitaryTattooist(ox, oy, passAlpha, isGhost) {
      ctx.save();
      ctx.translate(cx + ox, cy + oy);

      const strokeMain = rgba(INK.lampblack, passAlpha);
      const fillArtist = rgba(INK.lampblack, passAlpha * (isGhost ? 0.30 : 0.80));

      // --- STRICTLY ONE TATTOO ARTIST hunched quietly behind the bench ---
      ctx.strokeStyle = strokeMain;
      ctx.fillStyle = fillArtist;
      ctx.lineWidth = Math.max(0.95, s * 0.0075);

      // Hunched shoulders & vest/apron torso behind bench plank
      ctx.beginPath();
      ctx.moveTo(-s * 0.145, s * 0.008);
      ctx.bezierCurveTo(
        -s * 0.142,
        -s * 0.115,
        -s * 0.088,
        -s * 0.185,
        -s * 0.015,
        -s * 0.182
      );
      ctx.bezierCurveTo(
        s * 0.055,
        -s * 0.178,
        s * 0.095,
        -s * 0.105,
        s * 0.092,
        s * 0.008
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Bowed head with jeweler's spectacles focused downward on bench tools
      ctx.beginPath();
      ctx.arc(-s * 0.025, -s * 0.195, s * 0.036, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (!isGhost) {
        // Rolled shirt-sleeves & round spectacles glint
        ctx.strokeStyle = rgba(INK.paper, passAlpha * 0.72);
        ctx.lineWidth = Math.max(0.7, s * 0.0045);
        ctx.beginPath();
        ctx.arc(-s * 0.036, -s * 0.185, s * 0.011, 0, Math.PI * 2);
        ctx.moveTo(-s * 0.025, -s * 0.187);
        ctx.lineTo(-s * 0.005, -s * 0.194);
        ctx.stroke();
      }

      // Forearms & hands poised over bench arranging a fine needle
      ctx.strokeStyle = strokeMain;
      ctx.lineWidth = Math.max(1.2, s * 0.014);
      ctx.beginPath();
      // Left forearm steadying cloth/stencil
      ctx.moveTo(-s * 0.105, -s * 0.075);
      ctx.quadraticCurveTo(-s * 0.118, -s * 0.012, -s * 0.068, s * 0.004);
      // Right forearm delicately placing needle
      ctx.moveTo(s * 0.068, -s * 0.078);
      ctx.quadraticCurveTo(s * 0.072, -s * 0.015, s * 0.008 + handShift, s * 0.002);
      ctx.stroke();

      // --- WOODEN WORKBENCH ---
      const bwLeft = -s * 0.255;
      const bwRight = s * 0.225;
      const benchY = s * 0.012;
      const benchThick = s * 0.030;

      ctx.fillStyle = rgba(INK.paper, passAlpha * (isGhost ? 0.15 : 0.65));
      ctx.strokeStyle = strokeMain;
      ctx.lineWidth = Math.max(0.95, s * 0.0072);
      ctx.beginPath();
      ctx.moveTo(bwLeft, benchY);
      ctx.lineTo(bwRight, benchY);
      ctx.lineTo(bwRight + s * 0.022, benchY + benchThick);
      ctx.lineTo(bwLeft - s * 0.022, benchY + benchThick);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Bench trestle legs & stretcher bar
      ctx.beginPath();
      ctx.moveTo(bwLeft + s * 0.035, benchY + benchThick);
      ctx.lineTo(bwLeft + s * 0.015, s * 0.225);
      ctx.moveTo(bwRight - s * 0.035, benchY + benchThick);
      ctx.lineTo(bwRight - s * 0.015, s * 0.225);
      ctx.moveTo(bwLeft + s * 0.024, s * 0.145);
      ctx.lineTo(bwRight - s * 0.024, s * 0.145);
      ctx.stroke();

      if (!isGhost) {
        // 1) PIERCED STENCIL PATTERN (on left of bench: pale rag sheet with pin-pricked anchor)
        const stX = -s * 0.168;
        const stY = benchY + s * 0.004;
        ctx.fillStyle = rgba(INK.paper, passAlpha * 0.90);
        ctx.strokeStyle = rgba(INK.graphite, passAlpha * 0.80);
        ctx.lineWidth = Math.max(0.65, s * 0.004);
        ctx.beginPath();
        ctx.moveTo(stX - s * 0.055, stY + s * 0.018);
        ctx.lineTo(stX + s * 0.045, stY + s * 0.018);
        ctx.lineTo(stX + s * 0.055, stY - s * 0.014);
        ctx.lineTo(stX - s * 0.042, stY - s * 0.014);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Stippled / pierced anchor pinholes on the stencil sheet
        ctx.fillStyle = rgba(INK.prussian, passAlpha * 0.92);
        const pinDots = [
          [0, -0.009],
          [0, -0.003],
          [0, 0.003],
          [0, 0.009],
          [-0.012, -0.004],
          [0.012, -0.004],
          [-0.018, 0.005],
          [-0.010, 0.010],
          [0.010, 0.010],
          [0.018, 0.005]
        ];
        const pinR = Math.max(0.8, s * 0.0032);
        for (let d = 0; d < pinDots.length; d++) {
          ctx.beginPath();
          ctx.arc(stX + pinDots[d][0] * s, stY + pinDots[d][1] * s, pinR, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2) NEAT ROW OF FINE TATTOO NEEDLES (center of bench + 1 in artist's hand)
        ctx.strokeStyle = rgba(INK.lampblack, passAlpha * 0.92);
        ctx.lineWidth = Math.max(0.65, s * 0.0042);
        for (let n = 0; n < 5; n++) {
          const nx = -s * 0.055 + n * s * 0.022;
          ctx.beginPath();
          ctx.moveTo(nx, benchY + s * 0.018);
          ctx.lineTo(nx + s * 0.012, benchY - s * 0.016);
          ctx.stroke();
        }
        // Single needle held between artist's fingers
        ctx.beginPath();
        ctx.moveTo(s * 0.012 + handShift, s * 0.004);
        ctx.lineTo(-s * 0.012 + handShift, benchY + s * 0.012);
        ctx.stroke();

        // 3) THREE TINY INK POTS (lampblack, Prussian blue, sailor vermilion)
        const pots = [
          { x: s * 0.095, ink: INK.lampblack },
          { x: s * 0.142, ink: INK.prussian },
          { x: s * 0.189, ink: INK.vermilion }
        ];
        for (let k = 0; k < pots.length; k++) {
          const pxPot = pots[k].x;
          const pyPot = benchY + s * 0.006;
          const pw = s * 0.016;
          const ph = s * 0.024;

          // Tiny glass/stoneware inkwell body
          ctx.fillStyle = rgba(pots[k].ink, passAlpha * 0.88);
          ctx.strokeStyle = rgba(INK.lampblack, passAlpha * 0.85);
          ctx.lineWidth = Math.max(0.65, s * 0.004);
          ctx.beginPath();
          ctx.moveTo(pxPot - pw * 0.65, pyPot - ph);
          ctx.lineTo(pxPot + pw * 0.65, pyPot - ph);
          ctx.lineTo(pxPot + pw, pyPot);
          ctx.lineTo(pxPot - pw, pyPot);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Flared inkwell rim meniscus
          ctx.fillStyle = rgba(pots[k].ink, passAlpha);
          ctx.beginPath();
          ctx.ellipse(pxPot, pyPot - ph, pw * 0.78, s * 0.0045, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    if (tremor.showGhost) {
      drawSolitaryTattooist(tremor.ghostDx, tremor.ghostDy, alpha * 0.24, true);
    }
    drawSolitaryTattooist(0, 0, alpha, false);

    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // STONE 6: humid_underground (x: 0.04..0.96, y: 0.72..0.97)
  // Empty vaulted subway platform where strictly ONE heavy woman sits/stands
  // fanning herself alone in faint rising haze.
  // ---------------------------------------------------------------------------
  function renderHumidUnderground(ctx, width, height, st, alpha, reducedMotion) {
    const b = st.bounds;
    const bx = b.x0 * width;
    const by = b.y0 * height;
    const bw = (b.x1 - b.x0) * width;
    const bh = (b.y1 - b.y0) * height;
    const s = Math.min(bw * 0.45, bh);

    const archAlpha = alpha * 0.56;
    const tremor = computeTremorOffsets(st, st.permanence, reducedMotion, s);

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Empty vaulted subway station ribs, tiled platform edge, and bare sunken rails
    const platEdgeY = by + bh * 0.76;
    const pitRailY1 = by + bh * 0.87;
    const pitRailY2 = by + bh * 0.94;

    ctx.strokeStyle = rgba(INK.verdigris, archAlpha * 0.78);
    ctx.lineWidth = Math.max(0.8, s * 0.0052);

    // Consecutive receding barrel-vault ceiling ribs spanning the empty platform
    const vaultScales = [1.0, 0.84, 0.70, 0.58];
    for (let v = 0; v < vaultScales.length; v++) {
      const vs = vaultScales[v];
      const vx0 = bx + bw * (0.5 - 0.47 * vs);
      const vx1 = bx + bw * (0.5 + 0.47 * vs);
      const vyTop = by + bh * (0.05 + (1 - vs) * 0.22);
      const vySpring = by + bh * (0.52 + (1 - vs) * 0.06);
      ctx.beginPath();
      ctx.moveTo(vx0, platEdgeY);
      ctx.lineTo(vx0, vySpring);
      ctx.bezierCurveTo(
        vx0 + (vx1 - vx0) * 0.16,
        vyTop,
        vx1 - (vx1 - vx0) * 0.16,
        vyTop,
        vx1,
        vySpring
      );
      ctx.lineTo(vx1, platEdgeY);
      ctx.stroke();
    }

    // Platform safety coping & empty sunken railway tracks (NO train, NO crowd!)
    ctx.strokeStyle = rgba(INK.graphite, archAlpha * 0.92);
    ctx.lineWidth = Math.max(0.85, s * 0.0058);
    ctx.beginPath();
    ctx.moveTo(bx + bw * 0.02, platEdgeY);
    ctx.lineTo(bx + bw * 0.98, platEdgeY);
    ctx.moveTo(bx + bw * 0.02, platEdgeY + bh * 0.035);
    ctx.lineTo(bx + bw * 0.98, platEdgeY + bh * 0.035);
    // Two empty steel rails
    ctx.moveTo(bx + bw * 0.03, pitRailY1);
    ctx.lineTo(bx + bw * 0.97, pitRailY1);
    ctx.moveTo(bx + bw * 0.03, pitRailY2);
    ctx.lineTo(bx + bw * 0.97, pitRailY2);
    ctx.stroke();

    // Sparse rail sleepers in the track pit
    ctx.lineWidth = Math.max(0.65, s * 0.0042);
    ctx.beginPath();
    for (let t = 0; t < 11; t++) {
      const tx = bx + bw * (0.08 + t * 0.084);
      ctx.moveTo(tx + s * 0.015, pitRailY1 - bh * 0.018);
      ctx.lineTo(tx - s * 0.018, pitRailY2 + bh * 0.018);
    }
    ctx.stroke();

    // Long solitary wooden station bench (mostly empty!)
    const benchCx = bx + bw * 0.485;
    const benchSeatY = platEdgeY - s * 0.115;
    const benchBackY = benchSeatY - s * 0.125;
    const benchHalfW = s * 0.36;

    ctx.strokeStyle = rgba(INK.graphite, archAlpha * 0.90);
    ctx.lineWidth = Math.max(0.8, s * 0.005);
    ctx.beginPath();
    // Backrest slats
    ctx.moveTo(benchCx - benchHalfW, benchBackY);
    ctx.lineTo(benchCx + benchHalfW, benchBackY);
    ctx.moveTo(benchCx - benchHalfW, benchBackY + s * 0.055);
    ctx.lineTo(benchCx + benchHalfW, benchBackY + s * 0.055);
    // Seat plank
    ctx.moveTo(benchCx - benchHalfW * 1.04, benchSeatY);
    ctx.lineTo(benchCx + benchHalfW * 1.04, benchSeatY);
    // Cast-iron bench legs
    const legOffsets = [-0.88, -0.02, 0.88];
    for (let l = 0; l < legOffsets.length; l++) {
      const lx = benchCx + benchHalfW * legOffsets[l];
      ctx.moveTo(lx, benchBackY);
      ctx.lineTo(lx, platEdgeY - s * 0.015);
    }
    ctx.stroke();

    // Faint rising subterranean humidity wisps (verdigris steam filaments)
    const drift = reducedMotion ? 0 : (st.actionPhase * 0.22) % 1;
    const wispX = [0.20, 0.35, 0.48, 0.61, 0.77];
    ctx.strokeStyle = rgba(INK.verdigris, alpha * 0.36);
    ctx.lineWidth = Math.max(0.75, s * 0.0048);
    for (let w = 0; w < wispX.length; w++) {
      const wx = bx + bw * wispX[w];
      const wyBase = platEdgeY - ((drift + w * 0.21) % 1) * bh * 0.18;
      const wyTop = wyBase - bh * 0.34;
      const wave = s * 0.032 * (w % 2 === 0 ? 1 : -1);
      ctx.beginPath();
      ctx.moveTo(wx, wyBase);
      ctx.bezierCurveTo(
        wx + wave,
        wyBase - bh * 0.11,
        wx - wave,
        wyBase - bh * 0.23,
        wx + wave * 0.4,
        wyTop
      );
      ctx.stroke();
    }

    // STRICTLY ONE heavy woman seated alone on the bench fanning herself
    const cx = benchCx - s * 0.06 + tremor.dx;
    const cy = benchSeatY + tremor.dy;
    const fanAngle = reducedMotion
      ? -0.25
      : -0.22 + Math.sin(st.actionPhase * 2.8) * 0.28;

    function drawHeavyWomanFanning(ox, oy, passAlpha, isGhost) {
      ctx.save();
      ctx.translate(cx + ox, cy + oy);

      const strokeMain = rgba(INK.lampblack, passAlpha);
      const fillDress = rgba(INK.lampblack, passAlpha * (isGhost ? 0.32 : 0.80));
      const fillShawl = rgba(INK.verdigris, passAlpha * (isGhost ? 0.22 : 0.42));

      ctx.strokeStyle = strokeMain;
      ctx.fillStyle = fillDress;
      ctx.lineWidth = Math.max(1.0, s * 0.008);

      // Sturdy shoes planted apart on damp platform tiles
      ctx.beginPath();
      ctx.ellipse(-s * 0.068, s * 0.102, s * 0.028, s * 0.013, -0.1, 0, Math.PI * 2);
      ctx.ellipse(s * 0.072, s * 0.102, s * 0.028, s * 0.013, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Voluminous heavy skirt & broad seated silhouette draped over knees
      ctx.beginPath();
      // Left hip & wide draped knee
      ctx.moveTo(-s * 0.112, -s * 0.145);
      ctx.bezierCurveTo(
        -s * 0.165,
        -s * 0.085,
        -s * 0.168,
        s * 0.025,
        -s * 0.128,
        s * 0.090
      );
      // Heavy skirt hem across shins
      ctx.quadraticCurveTo(0, s * 0.108, s * 0.132, s * 0.088);
      // Right knee & broad torso
      ctx.bezierCurveTo(
        s * 0.172,
        s * 0.022,
        s * 0.162,
        -s * 0.085,
        s * 0.112,
        -s * 0.148
      );
      // Broad heavy shoulders & rounded bust
      ctx.bezierCurveTo(
        s * 0.128,
        -s * 0.225,
        s * 0.078,
        -s * 0.278,
        0,
        -s * 0.278
      );
      ctx.bezierCurveTo(
        -s * 0.082,
        -s * 0.278,
        -s * 0.128,
        -s * 0.222,
        -s * 0.112,
        -s * 0.145
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Damp shawl / bodice folds
      if (!isGhost) {
        ctx.fillStyle = fillShawl;
        ctx.beginPath();
        ctx.ellipse(0, -s * 0.195, s * 0.108, s * 0.075, 0, 0, Math.PI);
        ctx.fill();

        ctx.strokeStyle = rgba(INK.paper, passAlpha * 0.48);
        ctx.lineWidth = Math.max(0.7, s * 0.0045);
        ctx.beginPath();
        ctx.moveTo(-s * 0.048, -s * 0.095);
        ctx.quadraticCurveTo(-s * 0.068, s * 0.005, -s * 0.062, s * 0.085);
        ctx.moveTo(s * 0.045, -s * 0.095);
        ctx.quadraticCurveTo(s * 0.068, s * 0.005, s * 0.058, s * 0.085);
        ctx.stroke();
      }

      // Left arm resting heavily on wide lap
      ctx.strokeStyle = strokeMain;
      ctx.lineWidth = Math.max(1.3, s * 0.018);
      ctx.beginPath();
      ctx.moveTo(-s * 0.102, -s * 0.215);
      ctx.quadraticCurveTo(-s * 0.138, -s * 0.125, -s * 0.075, -s * 0.068);
      ctx.stroke();

      // Full round head tilted slightly back in oppressive heat + gathered hair bun
      ctx.fillStyle = fillDress;
      ctx.lineWidth = Math.max(0.9, s * 0.007);
      ctx.beginPath();
      ctx.arc(-s * 0.006, -s * 0.322, s * 0.044, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // Top hair bun
      ctx.beginPath();
      ctx.arc(-s * 0.032, -s * 0.362, s * 0.020, 0, Math.PI * 2);
      ctx.fill();

      // Right forearm raised to fan her throat & cheek
      const wristX = s * 0.088;
      const wristY = -s * 0.258;
      ctx.lineWidth = Math.max(1.3, s * 0.018);
      ctx.beginPath();
      ctx.moveTo(s * 0.098, -s * 0.212);
      ctx.quadraticCurveTo(s * 0.145, -s * 0.185, wristX, wristY);
      ctx.stroke();

      // ONE open pleated semicircular hand-fan
      ctx.save();
      ctx.translate(wristX, wristY);
      ctx.rotate(fanAngle);

      const fanR = s * 0.092;
      ctx.fillStyle = rgba(INK.paper, passAlpha * (isGhost ? 0.25 : 0.86));
      ctx.strokeStyle = rgba(INK.verdigris, passAlpha * 0.92);
      ctx.lineWidth = Math.max(0.8, s * 0.0052);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, fanR, -Math.PI * 0.92, -Math.PI * 0.14, false);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Pleated bamboo fan ribs + motion sigh arcs
      if (!isGhost) {
        ctx.strokeStyle = rgba(INK.lampblack, passAlpha * 0.65);
        ctx.lineWidth = Math.max(0.55, s * 0.0035);
        for (let r = 1; r <= 5; r++) {
          const ang = -Math.PI * 0.92 + (r / 6) * (Math.PI * 0.78);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(ang) * fanR, Math.sin(ang) * fanR);
          ctx.stroke();
        }

        // Faint fan-breeze arcs toward her cheek
        ctx.strokeStyle = rgba(INK.verdigris, passAlpha * (0.55 + st.pulseGlow * 0.3));
        ctx.lineWidth = Math.max(0.65, s * 0.0042);
        ctx.beginPath();
        ctx.arc(-s * 0.018, -s * 0.018, fanR * 1.18, -Math.PI * 0.88, -Math.PI * 0.45);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-s * 0.025, -s * 0.025, fanR * 1.38, -Math.PI * 0.82, -Math.PI * 0.50);
        ctx.stroke();
      }

      ctx.restore();
      ctx.restore();
    }

    if (tremor.showGhost) {
      drawHeavyWomanFanning(tremor.ghostDx, tremor.ghostDy, alpha * 0.24, true);
    }
    drawHeavyWomanFanning(0, 0, alpha, false);

    ctx.restore();
  }

  // ---------------------------------------------------------------------------
  // TOP-LEVEL RENDER ENTRYPOINT
  // ---------------------------------------------------------------------------
  const RENDERERS = {
    cobble_canes: renderCobbleCanes,
    skyscraper_cornices: renderSkyscraperCornices,
    leashed_pumas: renderLeashedPumas,
    window_dirigibles: renderWindowDirigibles,
    sailor_tattoos: renderSailorTattoos,
    humid_underground: renderHumidUnderground
  };

  function render(ctx, width, height, state, params) {
    if (!ctx || !(width > 0) || !(height > 0)) return;
    const stRoot = state && state.stones ? state : createState();
    const p = params || {};

    const witnessWeight =
      typeof p.witnessWeight === "number"
        ? clamp(p.witnessWeight, 0, 1)
        : clamp(stRoot.witnessWeight ?? 1, 0, 1);

    if (p.clear === true) {
      ctx.clearRect(0, 0, width, height);
    }

    if (witnessWeight <= 0.001) return;

    const reducedMotion =
      typeof p.reducedMotion === "boolean"
        ? p.reducedMotion
        : Boolean(stRoot.reducedMotion);
    const permMap = p.stonePermanence || {};
    const activeStone =
      p.activeStone !== undefined ? p.activeStone : stRoot.activeStone;

    ctx.save();

    drawPlateStrataGuides(ctx, width, height, witnessWeight, activeStone);

    // Render sky stones first, then street triptych, then subterranean vault
    const drawOrder = [
      "window_dirigibles",
      "skyscraper_cornices",
      "cobble_canes",
      "leashed_pumas",
      "sailor_tattoos",
      "humid_underground"
    ];

    for (let i = 0; i < drawOrder.length; i++) {
      const id = drawOrder[i];
      const st = stRoot.stones[id];
      const fn = RENDERERS[id];
      if (!st || !fn) continue;
      const perm =
        permMap[id] !== undefined
          ? clamp(Number(permMap[id]) || 0, 0, 1)
          : clamp(st.permanence || 0, 0, 1);
      const alpha = computeEffectiveStoneAlpha(st, perm, witnessWeight);
      if (alpha <= 0.002) continue;
      fn(ctx, width, height, st, alpha, reducedMotion);
    }

    ctx.restore();
  }

  const ZirmaSingularTestimony = {
    STONE_IDS: STONE_IDS,
    STRATA: STRATA,
    createState: createState,
    sightPulse: sightPulse,
    step: step,
    render: render,
    getTestimonyCaption: getTestimonyCaption,
    getAudioCue: getAudioCue
  };

  root.ZirmaSingularTestimony = ZirmaSingularTestimony;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = ZirmaSingularTestimony;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
