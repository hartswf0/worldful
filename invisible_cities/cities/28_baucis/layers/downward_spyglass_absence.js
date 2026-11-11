/*
 * Downward Spyglass & Contemplated Absence Layer — Baucis
 * Burnished-brass nadir optics (1x / 8x / 24x / 64x) & woodland micro-specimens.
 */
(function (root) {
  "use strict";

  var TAU = Math.PI * 2;

  var PALETTE = Object.freeze({
    latticeShadow: "#111d16",
    canopyAbyss: "#182b20",
    foliageEmerald: "#2d6a45",
    fernMoss: "#529466",
    sunlitClearing: "#8ab87a",
    cloudIvory: "#f4efe4",
    cumulusPearl: "#e5decb",
    flamingoTimber: "#9e6b43",
    brassOptic: "#c9963b",
    skyAzure: "#6fa4c4",
    lensSpecular: "#dfeef2",
    footprintScar: "#7a4b3a"
  });

  var HYPOTHESES = Object.freeze([
    Object.freeze({
      index: 0,
      id: "hatred_of_earth",
      numeral: "I",
      shortTitle: "Hatred of the Earth",
      proposition: "They hate the earth and suspend every beam above its mire.",
      lensTint: "#9fb0ba",
      weight: 0.35
    }),
    Object.freeze({
      index: 1,
      id: "reverent_avoidance",
      numeral: "II",
      shortTitle: "Reverent Avoidance",
      proposition: "They respect the earth so deeply that they avoid all contact.",
      lensTint: "#a8d5ba",
      weight: 0.68
    }),
    Object.freeze({
      index: 2,
      id: "fascinated_absence",
      numeral: "III",
      shortTitle: "Love Before Existence",
      proposition: "They love the earth as it was before they existed, contemplating with fascination their own absence.",
      lensTint: "#f2dfb3",
      weight: 1.00
    })
  ]);

  var MAGNIFICATION_STOPS = Object.freeze([
    Object.freeze({ step: 0, zoom: 1, label: "1x Cloud-Rift Sight", activeScale: "canopy" }),
    Object.freeze({ step: 1, zoom: 8, label: "8x Brass Spyglass · Leaf by Leaf", activeScale: "leaf" }),
    Object.freeze({ step: 2, zoom: 24, label: "24x Refractor · Stone by Stone", activeScale: "stone" }),
    Object.freeze({ step: 3, zoom: 64, label: "64x Nadir Achromat · Ant by Ant", activeScale: "ant" })
  ]);

  var SPECIMEN_CATALOG = Object.freeze([
    Object.freeze({
      id: "leaf_maidenhair_01",
      kind: "leaf",
      title: "Dew-Beaded Maidenhair Frond",
      detail: "Translucent fan-veins cradle three intact spheres of dawn mist, unbent by any passing sleeve.",
      normX: 0.52,
      normY: 0.78
    }),
    Object.freeze({
      id: "leaf_beech_02",
      kind: "leaf",
      title: "Sun-Pierced Copper Beech Blade",
      detail: "Parallel lateral ribs glow amber where an oblique lattice shadow bisects the serrated margin.",
      normX: 0.21,
      normY: 0.67
    }),
    Object.freeze({
      id: "leaf_oak_03",
      kind: "leaf",
      title: "Fallen Pedunculate Oak Leaf",
      detail: "Lacework parenchyma weathered by forest damp alone, resting flat on velvet cushion moss.",
      normX: 0.36,
      normY: 0.84
    }),
    Object.freeze({
      id: "leaf_hartstongue_04",
      kind: "leaf",
      title: "Uncurling Hart's-Tongue Crozier",
      detail: "Spiral fiddlehead dusted in silver chaff scales rising undisturbed beside a rosewood stilt.",
      normX: 0.68,
      normY: 0.66
    }),
    Object.freeze({
      id: "leaf_sorrel_05",
      kind: "leaf",
      title: "Folded Wood-Sorrel Trifoliate",
      detail: "Three heart-shaped leaflets sleeping along a birch twig, retaining every delicate hair.",
      normX: 0.79,
      normY: 0.81
    }),
    Object.freeze({
      id: "leaf_bracken_06",
      kind: "leaf",
      title: "Emerald Lady-Fern Pinna",
      detail: "Spore sori aligned like tiny bronze rivets beneath the underside of a trembling frond.",
      normX: 0.43,
      normY: 0.64
    }),
    Object.freeze({
      id: "stone_quartz_01",
      kind: "stone",
      title: "Vein-Quartz Brook Cobble",
      detail: "Milky crystalline facets catch sky-rift light beneath a thin film of cold spring water.",
      normX: 0.48,
      normY: 0.86
    }),
    Object.freeze({
      id: "stone_lichen_02",
      kind: "stone",
      title: "Map-Lichen Granite Erratic",
      detail: "Centuries-old chartreuse rosettes chart concentric rings across unscarred feldspar grain.",
      normX: 0.27,
      normY: 0.75
    }),
    Object.freeze({
      id: "stone_slate_03",
      kind: "stone",
      title: "Moss-Mantled Cleaved Slate",
      detail: "Feather-moss rhizoids anchor undisturbed along natural bedding planes wet with mist.",
      normX: 0.63,
      normY: 0.74
    }),
    Object.freeze({
      id: "stone_chert_04",
      kind: "stone",
      title: "Banded Amber Chert Nodule",
      detail: "Waxy chalcedony bands rest half-cradled in sweet chestnut humus without a scratch.",
      normX: 0.15,
      normY: 0.87
    }),
    Object.freeze({
      id: "stone_basalt_05",
      kind: "stone",
      title: "Pitted Basalt Rill Cobble",
      detail: "Tiny water-carved cupules hold mirror pools that no boot heel has ever muddied.",
      normX: 0.75,
      normY: 0.69
    }),
    Object.freeze({
      id: "stone_mica_06",
      kind: "stone",
      title: "Muscovite Schist Ledger",
      detail: "Silver mica platelets glint like fish scales beside untouched wild thyme roots.",
      normX: 0.85,
      normY: 0.89
    }),
    Object.freeze({
      id: "ant_pine_01",
      kind: "ant",
      title: "Wood-Ant Pine-Needle Porters",
      detail: "Two rufous workers balance a dry larch needle in steady single-file cadence along oak bark.",
      normX: 0.56,
      normY: 0.82
    }),
    Object.freeze({
      id: "ant_seed_02",
      kind: "ant",
      title: "Violet-Seed Elaiosome Carrier",
      detail: "Articulated mandibles clasp a pale forest seed along an unbroken scent trail.",
      normX: 0.31,
      normY: 0.89
    }),
    Object.freeze({
      id: "ant_antenna_03",
      kind: "ant",
      title: "Root-Crest Antennae Greeting",
      detail: "Returning scout taps bent antennae with a forager at the mossy root fork.",
      normX: 0.18,
      normY: 0.72
    }),
    Object.freeze({
      id: "ant_resin_04",
      kind: "ant",
      title: "Spruce-Resin Pearl Bearer",
      detail: "Translucent amber droplet hoisted high toward the thatch mound without detour or alarm.",
      normX: 0.61,
      normY: 0.91
    }),
    Object.freeze({
      id: "ant_bridge_05",
      kind: "ant",
      title: "Lichen-Bridge Column",
      detail: "Orderly six-legged file crosses a fallen twig span over clear trickling water.",
      normX: 0.41,
      normY: 0.72
    }),
    Object.freeze({
      id: "ant_mound_06",
      kind: "ant",
      title: "Thatch-Gallery Sentinel File",
      detail: "Burnished gasters and russet thoraxes rhythmically groom needles at the sunlit threshold.",
      normX: 0.83,
      normY: 0.74
    })
  ]);

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function hash01(seed) {
    var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function hexToRgba(hex, alpha) {
    var clean = String(hex || "#c9963b").replace("#", "");
    var num = parseInt(clean, 16);
    var r = (num >> 16) & 255;
    var g = (num >> 8) & 255;
    var b = num & 255;
    return "rgba(" + r + "," + g + "," + b + "," + clamp(alpha, 0, 1).toFixed(3) + ")";
  }

  function kindToZoomStep(kind) {
    if (kind === "leaf") return 1;
    if (kind === "stone") return 2;
    if (kind === "ant") return 3;
    return 0;
  }

  function computeLensLayout(width, height, dpr) {
    var w = Math.max(240, Number(width) || 1280);
    var h = Math.max(240, Number(height) || 800);
    var mobile = w < 760;
    var r = mobile
      ? clamp(Math.min(w * 0.215, h * 0.185), 50, 88)
      : clamp(Math.min(w * 0.15, h * 0.225), 74, 142);
    var outerR = r * 1.15;
    var padX = mobile ? Math.max(12, w * 0.036) : Math.max(24, w * 0.038);
    var cx = w - outerR - padX;
    var cy = mobile
      ? clamp(h * 0.26, outerR + 12, Math.max(outerR + 14, h * 0.45))
      : clamp(h * 0.31, outerR + 18, Math.max(outerR + 20, h * 0.48));
    return { cx: cx, cy: cy, r: r, outerR: outerR, width: w, height: h, dpr: Math.max(1, Number(dpr) || 1) };
  }

  function createNadirSpyglass(opts) {
    var cfg = opts || {};
    var cbExamined = typeof cfg.onSpecimenExamined === "function" ? cfg.onSpecimenExamined : null;
    var cbZoom = typeof cfg.onZoomChange === "function" ? cfg.onZoomChange : null;
    var cbHypothesis = typeof cfg.onHypothesisChange === "function" ? cfg.onHypothesisChange : null;
    var cbViolated = typeof cfg.onAbsenceViolated === "function" ? cfg.onAbsenceViolated : null;
    var cbRestored = typeof cfg.onAbsenceRestored === "function" ? cfg.onAbsenceRestored : null;

    var specimens = SPECIMEN_CATALOG.map(function (item, idx) {
      return {
        id: item.id,
        kind: item.kind,
        title: item.title,
        detail: item.detail,
        normX: item.normX,
        normY: item.normY,
        examined: idx === 0
      };
    });

    var ants = [];
    for (var ai = 0; ai < 8; ai++) {
      ants.push({
        t: ai / 8,
        lateral: (hash01(ai * 17 + 3) - 0.5) * 0.12,
        cargo: ai % 3 === 0 ? "needle" : ai % 3 === 1 ? "seed" : "resin",
        panicAngle: (ai / 8) * TAU + 0.42,
        panicRadius: 0,
        legPhase: ai * 0.85
      });
    }

    var state = {
      width: Number(cfg.width) || 1280,
      height: Number(cfg.height) || 800,
      dpr: Number(cfg.dpr) || 1,
      hypothesisIndex: 2,
      zoomStep: 1,
      aimNormX: 0.52,
      aimNormY: 0.78,
      activeSpecimenIndex: 0,
      absenceIntact: true,
      inhabitantOnEarth: false,
      antOrderliness: 1.0,
      absenceFascination: 0.84,
      reducedMotion: Boolean(cfg.reducedMotion),
      timeSec: 0,
      vernierAngle: Math.PI * 0.5,
      targetVernierAngle: Math.PI * 0.5,
      kindCursors: { leaf: 0, stone: -1, ant: -1 }
    };

    var lens = computeLensLayout(state.width, state.height, state.dpr);

    function snapshotSpecimen(s) {
      return s
        ? {
            id: s.id,
            kind: s.kind,
            title: s.title,
            detail: s.detail,
            normX: s.normX,
            normY: s.normY,
            examined: Boolean(s.examined)
          }
        : null;
    }

    function countExamined(kindFilter) {
      var n = 0;
      for (var i = 0; i < specimens.length; i++) {
        if (specimens[i].examined && (!kindFilter || specimens[i].kind === kindFilter)) n++;
      }
      return n;
    }

    function recomputeFascination() {
      if (state.inhabitantOnEarth || !state.absenceIntact) {
        state.absenceFascination = 0;
        return 0;
      }
      var hyp = HYPOTHESES[state.hypothesisIndex];
      var totalEx = countExamined(null);
      var raw = 0.76 + 0.065 * hyp.weight + 0.008 * state.zoomStep + 0.007 * totalEx;
      state.absenceFascination = Number(clamp(raw, 0.785, 0.99).toFixed(3));
      return state.absenceFascination;
    }

    function getState() {
      var hyp = HYPOTHESES[state.hypothesisIndex];
      var stop = MAGNIFICATION_STOPS[state.zoomStep];
      var spec = specimens[state.activeSpecimenIndex] || specimens[0];
      return {
        hypothesisId: hyp.id,
        hypothesisIndex: hyp.index,
        hypothesisTitle: hyp.shortTitle,
        hypothesisNumeral: hyp.numeral,
        hypothesisProposition: hyp.proposition,
        lensTint: hyp.lensTint,
        zoomStep: stop.step,
        magnification: stop.zoom,
        zoomLabel: stop.label,
        activeScale: stop.activeScale,
        aimNormX: Number(state.aimNormX.toFixed(4)),
        aimNormY: Number(state.aimNormY.toFixed(4)),
        activeSpecimenId: spec.id,
        activeSpecimenKind: spec.kind,
        activeSpecimenTitle: spec.title,
        activeSpecimenDetail: spec.detail,
        examinedLeafCount: countExamined("leaf"),
        examinedStoneCount: countExamined("stone"),
        examinedAntCount: countExamined("ant"),
        totalExaminedCount: countExamined(null),
        absenceIntact: state.absenceIntact,
        inhabitantOnEarth: state.inhabitantOnEarth,
        antOrderliness: Number(state.antOrderliness.toFixed(3)),
        absenceFascination: state.absenceFascination,
        reducedMotion: state.reducedMotion
      };
    }

    function resolveAimSpecimen(notify) {
      var scale = MAGNIFICATION_STOPS[state.zoomStep].activeScale;
      var bestIdx = -1;
      var bestDist = Infinity;
      for (var i = 0; i < specimens.length; i++) {
        if (scale !== "canopy" && specimens[i].kind !== scale) continue;
        var dx = specimens[i].normX - state.aimNormX;
        var dy = specimens[i].normY - state.aimNormY;
        var d2 = dx * dx + dy * dy;
        if (d2 < bestDist) {
          bestDist = d2;
          bestIdx = i;
        }
      }
      if (bestIdx < 0) bestIdx = 0;
      var prevIdx = state.activeSpecimenIndex;
      var target = specimens[bestIdx];
      var newlyExamined = !target.examined;
      state.activeSpecimenIndex = bestIdx;
      target.examined = true;
      recomputeFascination();
      if (notify && cbExamined && (newlyExamined || prevIdx !== bestIdx)) {
        cbExamined(snapshotSpecimen(target), getState());
      }
      return target;
    }

    function resize(width, height, dpr) {
      if (width && typeof width === "object") {
        dpr = width.dpr;
        height = width.height;
        width = width.width;
      }
      state.width = Math.max(240, Number(width) || state.width);
      state.height = Math.max(240, Number(height) || state.height);
      state.dpr = Math.max(1, Number(dpr) || state.dpr);
      lens = computeLensLayout(state.width, state.height, state.dpr);
      return getLensGeometry();
    }

    function setAim(normX, normY) {
      state.aimNormX = clamp(Number(normX) || 0.52, 0.12, 0.88);
      state.aimNormY = clamp(Number(normY) || 0.78, 0.58, 0.94);
      state.targetVernierAngle = state.zoomStep * (Math.PI * 0.5) + (state.aimNormX - 0.5) * 0.85 + (state.aimNormY - 0.75) * 0.4;
      if (state.reducedMotion) state.vernierAngle = state.targetVernierAngle;
      resolveAimSpecimen(true);
      return getState();
    }

    function nudgeAim(dxNorm, dyNorm) {
      return setAim(state.aimNormX + (Number(dxNorm) || 0), state.aimNormY + (Number(dyNorm) || 0));
    }

    function focusSpecimen(idOrKind) {
      var raw = String(idOrKind || "").trim();
      var lower = raw.toLowerCase();
      if (!lower) {
        var curScale = MAGNIFICATION_STOPS[state.zoomStep].activeScale;
        lower = curScale === "canopy" ? "leaf" : curScale;
      }
      var targetIdx = -1;
      if (lower === "leaf" || lower === "stone" || lower === "ant") {
        var pool = [];
        for (var i = 0; i < specimens.length; i++) {
          if (specimens[i].kind === lower) pool.push(i);
        }
        state.kindCursors[lower] = (state.kindCursors[lower] + 1) % pool.length;
        targetIdx = pool[state.kindCursors[lower]];
      } else {
        for (var j = 0; j < specimens.length; j++) {
          if (specimens[j].id === raw || specimens[j].id.toLowerCase() === lower) {
            targetIdx = j;
            break;
          }
        }
      }
      if (targetIdx < 0) return snapshotSpecimen(specimens[state.activeSpecimenIndex]);
      var target = specimens[targetIdx];
      var nextZoom = kindToZoomStep(target.kind);
      var zoomChanged = state.zoomStep !== nextZoom;
      state.zoomStep = nextZoom;
      state.aimNormX = clamp(target.normX, 0.12, 0.88);
      state.aimNormY = clamp(target.normY, 0.58, 0.94);
      state.targetVernierAngle = nextZoom * (Math.PI * 0.5) + (state.aimNormX - 0.5) * 0.85;
      if (state.reducedMotion) state.vernierAngle = state.targetVernierAngle;
      state.activeSpecimenIndex = targetIdx;
      target.examined = true;
      recomputeFascination();
      if (zoomChanged && cbZoom) cbZoom(MAGNIFICATION_STOPS[nextZoom], getState());
      if (cbExamined) cbExamined(snapshotSpecimen(target), getState());
      return snapshotSpecimen(target);
    }

    function setZoomStep(step0to3) {
      var next = clamp(Math.round(Number(step0to3) || 0), 0, 3);
      var changed = state.zoomStep !== next;
      state.zoomStep = next;
      state.targetVernierAngle = next * (Math.PI * 0.5) + (state.aimNormX - 0.5) * 0.85;
      if (state.reducedMotion) state.vernierAngle = state.targetVernierAngle;
      resolveAimSpecimen(true);
      recomputeFascination();
      if (changed && cbZoom) cbZoom(MAGNIFICATION_STOPS[next], getState());
      return getState();
    }

    function cycleZoom(delta) {
      var stepDelta = delta === undefined ? 1 : (Math.trunc(Number(delta)) || 1);
      return setZoomStep(((state.zoomStep + stepDelta) % 4 + 4) % 4);
    }

    function setMagnification(zoomVal) {
      var z = Number(zoomVal) || 8;
      var bestStep = 0;
      var bestDiff = Infinity;
      for (var i = 0; i < MAGNIFICATION_STOPS.length; i++) {
        var diff = Math.abs(MAGNIFICATION_STOPS[i].zoom - z);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestStep = MAGNIFICATION_STOPS[i].step;
        }
      }
      return setZoomStep(bestStep);
    }

    function setHypothesis(idOrIndex) {
      var nextIdx = state.hypothesisIndex;
      if (typeof idOrIndex === "number" && Number.isFinite(idOrIndex)) {
        nextIdx = clamp(Math.round(idOrIndex), 0, 2);
      } else {
        var s = String(idOrIndex || "").trim();
        for (var i = 0; i < HYPOTHESES.length; i++) {
          if (HYPOTHESES[i].id === s || HYPOTHESES[i].numeral === s || String(HYPOTHESES[i].index) === s) {
            nextIdx = i;
            break;
          }
        }
      }
      var changed = state.hypothesisIndex !== nextIdx;
      state.hypothesisIndex = nextIdx;
      recomputeFascination();
      if (changed && cbHypothesis) cbHypothesis(HYPOTHESES[nextIdx], getState());
      return getState();
    }

    function descendLadderToEarth() {
      state.inhabitantOnEarth = true;
      state.absenceIntact = false;
      state.antOrderliness = 0.08;
      state.absenceFascination = 0;
      for (var i = 0; i < ants.length; i++) {
        ants[i].panicRadius = state.reducedMotion ? 0.58 : Math.max(0.26, ants[i].panicRadius);
      }
      if (cbViolated) cbViolated(getState());
      return getState();
    }

    function retreatAboveClouds() {
      state.inhabitantOnEarth = false;
      state.absenceIntact = true;
      state.antOrderliness = 1.0;
      for (var i = 0; i < ants.length; i++) {
        ants[i].panicRadius = 0;
      }
      recomputeFascination();
      if (cbRestored) cbRestored(getState());
      return getState();
    }

    function setReducedMotion(bool) {
      state.reducedMotion = Boolean(bool);
      if (state.reducedMotion) state.vernierAngle = state.targetVernierAngle;
      return state.reducedMotion;
    }

    function step(dtSec, worldContext) {
      var dt = clamp(Number(dtSec) || 0, 0, 0.1);
      if (worldContext && typeof worldContext.reducedMotion === "boolean") {
        state.reducedMotion = worldContext.reducedMotion;
      }
      if (state.reducedMotion) {
        state.vernierAngle = state.targetVernierAngle;
        return;
      }
      state.timeSec += dt;
      state.vernierAngle += (state.targetVernierAngle - state.vernierAngle) * Math.min(1, dt * 10);
      for (var i = 0; i < ants.length; i++) {
        var a = ants[i];
        if (state.inhabitantOnEarth) {
          a.panicAngle += (i % 2 === 0 ? 1 : -1) * dt * (2.6 + (i % 3) * 0.7);
          a.panicRadius = clamp(a.panicRadius + dt * 0.45, 0.34, 0.74);
          a.legPhase += dt * 22;
        } else {
          a.t = (a.t + dt * 0.11) % 1;
          a.panicRadius = Math.max(0, a.panicRadius - dt * 0.8);
          a.legPhase += dt * 9.5;
        }
      }
    }

    function hitTestSpecimenOrLens(px, py) {
      var x = Number(px) || 0;
      var y = Number(py) || 0;
      var w = state.width || 1280;
      var h = state.height || 800;
      var dxL = x - lens.cx;
      var dyL = y - lens.cy;
      if (dxL * dxL + dyL * dyL <= lens.outerR * lens.outerR) {
        return {
          type: "lens",
          specimen: snapshotSpecimen(specimens[state.activeSpecimenIndex]),
          normX: clamp(x / w, 0, 1),
          normY: clamp(y / h, 0, 1)
        };
      }
      var hitRadius = w < 760 ? 24 : 28;
      var activeScale = MAGNIFICATION_STOPS[state.zoomStep].activeScale;
      var bestSpec = null;
      var bestScore = hitRadius * hitRadius;
      for (var i = 0; i < specimens.length; i++) {
        var sx = specimens[i].normX * w;
        var sy = specimens[i].normY * h;
        var d2 = (x - sx) * (x - sx) + (y - sy) * (y - sy);
        var weighted = specimens[i].kind === activeScale ? d2 * 0.65 : d2;
        if (d2 <= hitRadius * hitRadius && weighted <= bestScore) {
          bestScore = weighted;
          bestSpec = specimens[i];
        }
      }
      if (bestSpec) {
        return { type: "specimen", specimen: snapshotSpecimen(bestSpec), normX: bestSpec.normX, normY: bestSpec.normY };
      }
      return {
        type: "ground",
        specimen: null,
        normX: clamp(x / w, 0.12, 0.88),
        normY: clamp(y / h, 0.58, 0.94)
      };
    }

    function getSpecimens() {
      return specimens.map(snapshotSpecimen);
    }

    function getLensGeometry() {
      return { cx: lens.cx, cy: lens.cy, r: lens.r, outerR: lens.outerR, width: lens.width, height: lens.height, dpr: lens.dpr };
    }

    function reset() {
      state.hypothesisIndex = 2;
      state.zoomStep = 1;
      state.aimNormX = 0.52;
      state.aimNormY = 0.78;
      state.activeSpecimenIndex = 0;
      state.absenceIntact = true;
      state.inhabitantOnEarth = false;
      state.antOrderliness = 1.0;
      state.kindCursors = { leaf: 0, stone: -1, ant: -1 };
      state.targetVernierAngle = Math.PI * 0.5;
      state.vernierAngle = Math.PI * 0.5;
      for (var i = 0; i < specimens.length; i++) specimens[i].examined = i === 0;
      for (var k = 0; k < ants.length; k++) {
        ants[k].t = k / 8;
        ants[k].panicRadius = 0;
      }
      recomputeFascination();
      return getState();
    }

    function resolveWorldOpts(worldContext) {
      var wc = worldContext || {};
      var sunlight = typeof wc.sunlight01 === "number" ? clamp(wc.sunlight01, 0, 1) : 0.85;
      var shadowVis = typeof wc.piercedShadowVisible === "boolean" ? wc.piercedShadowVisible : sunlight > 0.35;
      var shadowOp = typeof wc.shadowOpacity === "number"
        ? clamp(wc.shadowOpacity, 0, 1)
        : shadowVis ? clamp((sunlight - 0.35) / 0.65, 0, 1) : 0;
      return {
        sunlight01: sunlight,
        piercedShadowVisible: shadowVis && shadowOp > 0.01,
        shadowOpacity: shadowOp,
        sunAzimuth: typeof wc.sunAzimuth === "number" ? clamp(wc.sunAzimuth, -1, 1) : 0.28,
        altitude01: typeof wc.altitude01 === "number" ? clamp(wc.altitude01, 0, 1) : 0.88,
        belvedereY: typeof wc.belvedereY === "number" ? wc.belvedereY : null,
        stiltNodes: Array.isArray(wc.stiltNodes) ? wc.stiltNodes : null,
        violated: state.inhabitantOnEarth || Boolean(wc.inhabitantOnEarth)
      };
    }

    function drawAngularShadowBands(ctx, r, sunAzimuth, shadowOpacity, scaleFactor) {
      if (shadowOpacity <= 0.01) return;
      ctx.save();
      ctx.rotate(-0.42 + sunAzimuth * 0.55);
      ctx.fillStyle = hexToRgba(PALETTE.latticeShadow, 0.44 * shadowOpacity);
      var pitch = (r * 0.46) / (scaleFactor || 1);
      var barW = pitch * 0.34;
      for (var x = -r * 1.5; x <= r * 1.5; x += pitch) {
        ctx.fillRect(x, -r * 1.5, barW, r * 3);
      }
      var crossPitch = pitch * 1.35;
      for (var y = -r * 1.5; y <= r * 1.5; y += crossPitch) {
        ctx.fillRect(-r * 1.5, y, r * 3, barW * 0.68);
      }
      ctx.restore();
    }

    function drawFloorGlintsAndCone(ctx, w, h, wc) {
      var aimX = state.aimNormX * w;
      var aimY = state.aimNormY * h;
      var activeScale = MAGNIFICATION_STOPS[state.zoomStep].activeScale;
      var pulse = state.reducedMotion ? 0.85 : 0.72 + 0.28 * Math.sin(state.timeSec * 2.8);

      for (var i = 0; i < specimens.length; i++) {
        var sp = specimens[i];
        var sx = sp.normX * w;
        var sy = sp.normY * h;
        var isMatch = activeScale === "canopy" || sp.kind === activeScale;
        var isActive = i === state.activeSpecimenIndex;
        var nearScar = wc.violated && Math.hypot(sx - aimX, sy - aimY) < w * 0.08;
        var alpha = isActive ? 0.96 : isMatch ? 0.68 * pulse : 0.32;
        ctx.save();
        ctx.translate(sx, sy);
        if (sp.examined) {
          ctx.strokeStyle = hexToRgba(nearScar ? PALETTE.footprintScar : PALETTE.brassOptic, isActive ? 0.85 : 0.42);
          ctx.lineWidth = isActive ? 1.6 : 1;
          ctx.beginPath();
          ctx.ellipse(0, 0, isActive ? 9 : 6.5, isActive ? 5 : 3.8, 0, 0, TAU);
          ctx.stroke();
        }
        ctx.fillStyle = hexToRgba(nearScar ? PALETTE.footprintScar : sp.examined ? PALETTE.lensSpecular : PALETTE.brassOptic, alpha);
        ctx.beginPath();
        if (sp.kind === "leaf") {
          ctx.moveTo(0, -4.2);
          ctx.lineTo(3.4, 0);
          ctx.lineTo(0, 4.2);
          ctx.lineTo(-3.4, 0);
        } else if (sp.kind === "stone") {
          ctx.arc(0, 0, 3.1, 0, TAU);
        } else {
          ctx.arc(-2.1, 0, 1.9, 0, TAU);
          ctx.arc(2.1, 0, 1.7, 0, TAU);
        }
        ctx.fill();
        ctx.restore();
      }

      var origX = w * clamp(0.45 + (state.aimNormX - 0.5) * 0.55, 0.14, 0.82);
      var origY = wc.belvedereY !== null ? wc.belvedereY : h * clamp(0.16 + (1 - wc.altitude01) * 0.1, 0.1, 0.3);
      if (wc.stiltNodes && wc.stiltNodes.length) {
        var bestStilt = wc.stiltNodes[0];
        var bestDx = Infinity;
        for (var k = 0; k < wc.stiltNodes.length; k++) {
          var cand = wc.stiltNodes[k];
          var d = Math.abs((cand.topX || 0) - aimX);
          if (d < bestDx) {
            bestDx = d;
            bestStilt = cand;
          }
        }
        if (typeof bestStilt.topX === "number" && typeof bestStilt.topY === "number") {
          origX = bestStilt.topX;
          origY = bestStilt.topY + 8;
        }
      }

      var coneGrad = ctx.createLinearGradient(origX, origY, aimX, aimY);
      var beamTint = wc.violated ? PALETTE.footprintScar : PALETTE.brassOptic;
      coneGrad.addColorStop(0, hexToRgba(beamTint, 0.34));
      coneGrad.addColorStop(0.5, hexToRgba(PALETTE.cloudIvory, 0.08));
      coneGrad.addColorStop(1, hexToRgba(beamTint, 0.22));
      ctx.save();
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(origX - 2.5, origY);
      ctx.lineTo(origX + 2.5, origY);
      ctx.lineTo(aimX + 20, aimY);
      ctx.lineTo(aimX - 20, aimY);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = hexToRgba(beamTint, 0.52);
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(origX, origY);
      ctx.lineTo(aimX, aimY);
      ctx.moveTo(aimX, aimY);
      ctx.lineTo(lens.cx - lens.r * 0.62, lens.cy + lens.r * 0.68);
      ctx.stroke();
      ctx.setLineDash([]);

      var rx = w < 760 ? 17 : 22;
      var ry = rx * 0.5;
      ctx.strokeStyle = hexToRgba(wc.violated ? "#d46346" : PALETTE.brassOptic, 0.88);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(aimX, aimY, rx, ry, 0, 0, TAU);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(aimX - rx - 5, aimY);
      ctx.lineTo(aimX - rx + 4, aimY);
      ctx.moveTo(aimX + rx - 4, aimY);
      ctx.lineTo(aimX + rx + 5, aimY);
      ctx.moveTo(aimX, aimY - ry - 4);
      ctx.lineTo(aimX, aimY - ry + 3);
      ctx.moveTo(aimX, aimY + ry - 3);
      ctx.lineTo(aimX, aimY + ry + 4);
      ctx.stroke();
      ctx.restore();
    }

    function drawCanopy1x(ctx, r, wc, seed) {
      ctx.fillStyle = PALETTE.canopyAbyss;
      ctx.fillRect(-r, -r, r * 2, r * 2);

      ctx.strokeStyle = hexToRgba(PALETTE.skyAzure, 0.42);
      ctx.lineWidth = r * 0.14;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-r * 0.85, r * 0.45);
      ctx.bezierCurveTo(-r * 0.25, r * 0.1, r * 0.18, -r * 0.22, r * 0.88, -r * 0.52);
      ctx.stroke();

      for (var i = 0; i < 14; i++) {
        var ang = i * 2.399 + seed * 3.1;
        var dist = Math.sqrt((i + 0.5) / 14) * r * 0.88;
        var cx = Math.cos(ang) * dist;
        var cy = Math.sin(ang) * dist;
        var cr = r * (0.22 + hash01(i + seed * 10) * 0.16);
        ctx.fillStyle = i % 3 === 0 ? PALETTE.sunlitClearing : i % 2 === 0 ? PALETTE.fernMoss : PALETTE.foliageEmerald;
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, TAU);
        ctx.fill();
      }

      if (wc.piercedShadowVisible) {
        drawAngularShadowBands(ctx, r, wc.sunAzimuth, wc.shadowOpacity, 1.0);
      }

      var stiltX = (hash01(seed * 7.3) - 0.5) * r * 0.42;
      var stiltY = (hash01(seed * 13.7) - 0.5) * r * 0.36;
      if (wc.violated) {
        ctx.fillStyle = hexToRgba(PALETTE.footprintScar, 0.85);
        ctx.beginPath();
        ctx.ellipse(stiltX + r * 0.14, stiltY + r * 0.08, r * 0.18, r * 0.11, 0.35, 0, TAU);
        ctx.fill();
      }
      ctx.fillStyle = PALETTE.cumulusPearl;
      ctx.beginPath();
      ctx.arc(stiltX, stiltY, r * 0.045, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = PALETTE.flamingoTimber;
      ctx.lineWidth = Math.max(3, r * 0.055);
      ctx.beginPath();
      ctx.moveTo(stiltX, stiltY);
      ctx.lineTo(stiltX - r * 0.08, -r * 1.05);
      ctx.stroke();

      for (var c = 0; c < 8; c++) {
        var ca = (c / 8) * TAU + 0.25;
        ctx.fillStyle = hexToRgba(c % 2 === 0 ? PALETTE.cloudIvory : PALETTE.cumulusPearl, 0.82);
        ctx.beginPath();
        ctx.arc(Math.cos(ca) * r * 0.96, Math.sin(ca) * r * 0.96, r * 0.32, 0, TAU);
        ctx.fill();
      }
    }

    function drawLeaf8x(ctx, r, wc, seed) {
      ctx.fillStyle = PALETTE.canopyAbyss;
      ctx.fillRect(-r, -r, r * 2, r * 2);

      for (var f = 0; f < 2; f++) {
        ctx.save();
        ctx.rotate((f === 0 ? -0.55 : 0.72) + seed * 0.4);
        ctx.translate(0, (f === 0 ? -0.22 : 0.28) * r);
        ctx.strokeStyle = wc.violated ? "#4b4a33" : PALETTE.fernMoss;
        ctx.lineWidth = Math.max(1.6, r * 0.025);
        ctx.beginPath();
        ctx.moveTo(-r * 0.85, 0);
        ctx.lineTo(r * 0.82, 0);
        ctx.stroke();
        for (var p = -6; p <= 6; p++) {
          var px = p * r * 0.12;
          var plen = (1 - Math.abs(p) / 8) * r * 0.26;
          ctx.fillStyle = wc.violated ? "#4d593c" : (p % 2 === 0 ? PALETTE.fernMoss : PALETTE.foliageEmerald);
          ctx.beginPath();
          ctx.ellipse(px, -plen * 0.55, r * 0.042, plen * 0.5, -0.25, 0, TAU);
          ctx.ellipse(px, plen * 0.55, r * 0.042, plen * 0.5, 0.25, 0, TAU);
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.save();
      ctx.rotate(-0.24 + (seed - 0.5) * 0.5);
      ctx.fillStyle = wc.violated ? "#4e5e3d" : PALETTE.foliageEmerald;
      ctx.beginPath();
      ctx.moveTo(-r * 0.78, 0);
      ctx.bezierCurveTo(-r * 0.35, -r * 0.56, r * 0.35, -r * 0.52, r * 0.82, 0);
      ctx.bezierCurveTo(r * 0.35, r * 0.52, -r * 0.35, r * 0.56, -r * 0.78, 0);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = wc.violated ? "#7a784e" : PALETTE.sunlitClearing;
      ctx.lineWidth = Math.max(1.8, r * 0.026);
      ctx.beginPath();
      ctx.moveTo(-r * 0.76, 0);
      ctx.lineTo(r * 0.78, 0);
      ctx.stroke();

      ctx.lineWidth = Math.max(1, r * 0.014);
      for (var v = -5; v <= 5; v++) {
        var vx = v * r * 0.12;
        var span = (1 - Math.abs(v) / 6.8) * r * 0.42;
        ctx.beginPath();
        ctx.moveTo(vx, 0);
        ctx.quadraticCurveTo(vx + r * 0.07, -span * 0.55, vx + r * 0.15, -span);
        ctx.moveTo(vx, 0);
        ctx.quadraticCurveTo(vx + r * 0.07, span * 0.55, vx + r * 0.15, span);
        ctx.stroke();
      }

      if (wc.violated) {
        ctx.fillStyle = PALETTE.canopyAbyss;
        ctx.beginPath();
        ctx.moveTo(r * 0.05, -r * 0.44);
        ctx.lineTo(r * 0.22, -r * 0.08);
        ctx.lineTo(r * 0.34, -r * 0.41);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = hexToRgba(PALETTE.footprintScar, 0.88);
        ctx.beginPath();
        ctx.ellipse(0, r * 0.04, r * 0.46, r * 0.27, 0.28, 0, TAU);
        ctx.fill();
        ctx.fillStyle = "rgba(38, 22, 15, 0.75)";
        for (var tr = -3; tr <= 3; tr++) {
          ctx.fillRect(tr * r * 0.11 - r * 0.03, -r * 0.14, r * 0.055, r * 0.34);
        }
      } else {
        var shimmer = state.reducedMotion ? 0.9 : 0.8 + 0.2 * Math.sin(state.timeSec * 3.1);
        var drops = [
          [-0.24, -0.14, 0.085],
          [0.18, 0.15, 0.072],
          [0.36, -0.09, 0.052],
          [-0.04, 0.22, 0.046]
        ];
        for (var d = 0; d < drops.length; d++) {
          var dx = drops[d][0] * r;
          var dy = drops[d][1] * r;
          var dr = drops[d][2] * r;
          ctx.fillStyle = "rgba(17, 29, 22, 0.38)";
          ctx.beginPath();
          ctx.arc(dx + dr * 0.22, dy + dr * 0.24, dr, 0, TAU);
          ctx.fill();
          ctx.fillStyle = hexToRgba(PALETTE.sunlitClearing, 0.72);
          ctx.beginPath();
          ctx.arc(dx, dy, dr, 0, TAU);
          ctx.fill();
          ctx.fillStyle = hexToRgba(PALETTE.lensSpecular, 0.95 * shimmer);
          ctx.beginPath();
          ctx.arc(dx - dr * 0.32, dy - dr * 0.32, dr * 0.34, 0, TAU);
          ctx.fill();
        }
      }
      ctx.restore();

      if (wc.piercedShadowVisible && !wc.violated) {
        drawAngularShadowBands(ctx, r, wc.sunAzimuth, wc.shadowOpacity, 0.85);
      }
    }

    function drawStone24x(ctx, r, wc, seed) {
      ctx.fillStyle = wc.violated ? "#2a1d17" : "#1d3326";
      ctx.fillRect(-r, -r, r * 2, r * 2);

      ctx.strokeStyle = wc.violated ? "rgba(122, 75, 58, 0.65)" : hexToRgba(PALETTE.skyAzure, 0.5);
      ctx.lineWidth = r * 0.32;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-r * 0.95, -r * 0.38);
      ctx.quadraticCurveTo(0, r * 0.08, r * 0.95, r * 0.42);
      ctx.stroke();

      var cobbles = [
        [-0.26, -0.18, 0.38, 0.28, -0.2, "#58665f"],
        [0.3, 0.16, 0.35, 0.25, 0.35, "#6b7870"],
        [-0.3, 0.38, 0.26, 0.19, 0.12, "#495750"],
        [0.24, -0.36, 0.25, 0.18, -0.4, "#637069"]
      ];
      for (var i = 0; i < cobbles.length; i++) {
        var c = cobbles[i];
        var cx = (c[0] + (seed - 0.5) * 0.08) * r;
        var cy = c[1] * r;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(c[4]);
        if (wc.violated && i === 0) {
          ctx.fillStyle = "#241610";
          ctx.beginPath();
          ctx.ellipse(0, 0, c[2] * r, c[3] * r, 0, 0, TAU);
          ctx.fill();
          ctx.translate(r * 0.16, r * 0.12);
          ctx.rotate(0.45);
        }
        ctx.fillStyle = wc.violated ? "#59483e" : c[5];
        ctx.beginPath();
        ctx.ellipse(0, 0, c[2] * r, c[3] * r, 0, 0, TAU);
        ctx.fill();

        if (!wc.violated) {
          ctx.strokeStyle = PALETTE.brassOptic;
          ctx.fillStyle = "rgba(186, 198, 102, 0.78)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(-c[2] * r * 0.24, -c[3] * r * 0.12, c[3] * r * 0.36, 0, TAU);
          ctx.fill();
          ctx.stroke();

          for (var q = 0; q < 4; q++) {
            var qx = (hash01(i * 11 + q + seed) - 0.5) * c[2] * r * 1.1;
            var qy = (hash01(i * 19 + q) - 0.5) * c[3] * r * 1.1;
            ctx.fillStyle = q % 2 === 0 ? PALETTE.lensSpecular : PALETTE.cloudIvory;
            ctx.fillRect(qx, qy, r * 0.045, r * 0.045);
          }
        } else {
          ctx.strokeStyle = PALETTE.footprintScar;
          ctx.lineWidth = Math.max(2, r * 0.03);
          ctx.beginPath();
          ctx.moveTo(-c[2] * r * 0.6, -c[3] * r * 0.2);
          ctx.lineTo(c[2] * r * 0.55, c[3] * r * 0.25);
          ctx.stroke();
        }
        ctx.restore();
      }

      if (wc.piercedShadowVisible && !wc.violated) {
        drawAngularShadowBands(ctx, r, wc.sunAzimuth, wc.shadowOpacity * 0.75, 0.7);
      }
    }

    function drawArticulatedAnt(ctx, x, y, angle, size, legPhase, cargo, panicked) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.strokeStyle = "#2b160d";
      ctx.lineWidth = Math.max(1, size * 0.11);
      for (var side = -1; side <= 1; side += 2) {
        for (var leg = -1; leg <= 1; leg++) {
          var swing = Math.sin(legPhase + leg * 1.4 + (side > 0 ? Math.PI : 0)) * size * 0.22;
          var attachX = leg * size * 0.22;
          var kneeX = attachX + swing * 0.6;
          var kneeY = side * size * 0.48;
          var footX = attachX - leg * size * 0.14 + swing;
          var footY = side * size * 0.86;
          ctx.beginPath();
          ctx.moveTo(attachX, side * size * 0.1);
          ctx.lineTo(kneeX, kneeY);
          ctx.lineTo(footX, footY);
          ctx.stroke();
        }
      }

      ctx.fillStyle = "#24140e";
      ctx.beginPath();
      ctx.ellipse(-size * 0.68, 0, size * 0.42, size * 0.28, 0, 0, TAU);
      ctx.fill();
      ctx.strokeStyle = "rgba(201, 150, 59, 0.45)";
      ctx.lineWidth = Math.max(0.8, size * 0.06);
      ctx.beginPath();
      ctx.moveTo(-size * 0.66, -size * 0.24);
      ctx.lineTo(-size * 0.66, size * 0.24);
      ctx.stroke();

      ctx.fillStyle = "#7e3d1e";
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.3, size * 0.16, 0, 0, TAU);
      ctx.fill();

      ctx.fillStyle = "#472112";
      ctx.beginPath();
      ctx.ellipse(size * 0.48, 0, size * 0.23, size * 0.2, 0, 0, TAU);
      ctx.fill();

      var antSplay = panicked ? 0.65 : 0.32;
      ctx.strokeStyle = "#3a1b0e";
      ctx.lineWidth = Math.max(0.9, size * 0.09);
      for (var s = -1; s <= 1; s += 2) {
        var twitch = Math.sin(legPhase * 0.7 + s) * 0.08;
        ctx.beginPath();
        ctx.moveTo(size * 0.66, s * size * 0.08);
        ctx.lineTo(size * 0.92, s * size * (antSplay + twitch));
        ctx.lineTo(size * 1.16, s * size * (antSplay * 0.55 - twitch));
        ctx.stroke();
      }

      if (!panicked) {
        if (cargo === "needle") {
          ctx.strokeStyle = "#9ab665";
          ctx.lineWidth = Math.max(1.2, size * 0.11);
          ctx.beginPath();
          ctx.moveTo(size * 0.65, -size * 0.55);
          ctx.lineTo(size * 0.98, size * 0.55);
          ctx.stroke();
        } else if (cargo === "seed") {
          ctx.fillStyle = PALETTE.cloudIvory;
          ctx.beginPath();
          ctx.ellipse(size * 0.86, 0, size * 0.22, size * 0.13, 0.2, 0, TAU);
          ctx.fill();
        } else {
          ctx.fillStyle = PALETTE.brassOptic;
          ctx.beginPath();
          ctx.arc(size * 0.84, 0, size * 0.16, 0, TAU);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    function drawAnt64x(ctx, r, wc, seed) {
      ctx.fillStyle = "#2b2118";
      ctx.fillRect(-r, -r, r * 2, r * 2);

      ctx.strokeStyle = "#3d2e21";
      ctx.lineWidth = r * 0.08;
      for (var b = -4; b <= 4; b++) {
        ctx.beginPath();
        ctx.moveTo(-r, b * r * 0.24 + (seed - 0.5) * r * 0.1);
        ctx.bezierCurveTo(-r * 0.3, b * r * 0.2 - r * 0.08, r * 0.3, b * r * 0.28 + r * 0.06, r, b * r * 0.22);
        ctx.stroke();
      }
      for (var g = 0; g < 22; g++) {
        var gx = (hash01(g * 7.1 + seed) * 2 - 1) * r * 0.88;
        var gy = (hash01(g * 13.3 + seed) * 2 - 1) * r * 0.88;
        ctx.fillStyle = g % 3 === 0 ? "rgba(244,239,228,0.45)" : "rgba(82,148,102,0.38)";
        ctx.beginPath();
        ctx.arc(gx, gy, r * 0.025, 0, TAU);
        ctx.fill();
      }

      var antSize = Math.max(6.5, r * 0.115);
      if (wc.violated) {
        ctx.save();
        ctx.rotate(0.32);
        ctx.fillStyle = PALETTE.footprintScar;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(-r * 0.56, -r * 0.34, r * 1.12, r * 0.68, r * 0.22) : ctx.fillRect(-r * 0.56, -r * 0.34, r * 1.12, r * 0.68);
        ctx.fill();
        ctx.fillStyle = "#1e120d";
        for (var hx = -2; hx <= 2; hx++) {
          for (var hy = -1; hy <= 1; hy++) {
            ctx.beginPath();
            ctx.arc(hx * r * 0.19, hy * r * 0.18, r * 0.052, 0, TAU);
            ctx.fill();
          }
        }
        ctx.restore();

        for (var k = 0; k < ants.length; k++) {
          var pa = ants[k];
          var rad = clamp(pa.panicRadius || 0.54, 0.36, 0.78) * r;
          var ax = Math.cos(pa.panicAngle) * rad;
          var ay = Math.sin(pa.panicAngle) * rad;
          drawArticulatedAnt(ctx, ax, ay, pa.panicAngle + 0.45, antSize, pa.legPhase, pa.cargo, true);
        }
      } else {
        ctx.strokeStyle = "rgba(201, 150, 59, 0.22)";
        ctx.lineWidth = r * 0.12;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-r * 0.92, r * 0.46);
        ctx.quadraticCurveTo(0, -r * 0.08, r * 0.92, -r * 0.44);
        ctx.stroke();

        for (var m = 0; m < ants.length; m++) {
          var ma = ants[m];
          var u = ma.t;
          var mx = (-0.88 + u * 1.76) * r;
          var my = (0.44 - u * 0.88 + Math.sin(u * Math.PI) * -0.14 + ma.lateral) * r;
          var slope = Math.atan2(-0.88 - Math.cos(u * Math.PI) * 0.14 * Math.PI, 1.76);
          drawArticulatedAnt(ctx, mx, my, slope, antSize, ma.legPhase, ma.cargo, false);
        }
      }
    }

    function drawBrassBezelAndReticle(ctx, r, wc) {
      var hyp = HYPOTHESES[state.hypothesisIndex];
      var stop = MAGNIFICATION_STOPS[state.zoomStep];

      var tintGrad = ctx.createRadialGradient(0, 0, r * 0.15, 0, 0, r);
      tintGrad.addColorStop(0, hexToRgba(hyp.lensTint, 0.08));
      tintGrad.addColorStop(0.75, hexToRgba(hyp.lensTint, 0.22));
      tintGrad.addColorStop(1, "rgba(12, 18, 15, 0.58)");
      ctx.fillStyle = tintGrad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, TAU);
      ctx.fill();

      var chColor = wc.violated ? "rgba(232, 108, 79, 0.72)" : hexToRgba(PALETTE.cloudIvory, 0.58);
      ctx.strokeStyle = chColor;
      ctx.lineWidth = 1;
      var gap = r * 0.14;
      ctx.beginPath();
      ctx.arc(0, 0, gap, 0, TAU);
      ctx.moveTo(-r * 0.86, 0);
      ctx.lineTo(-gap, 0);
      ctx.moveTo(gap, 0);
      ctx.lineTo(r * 0.86, 0);
      ctx.moveTo(0, -r * 0.86);
      ctx.lineTo(0, -gap);
      ctx.moveTo(0, gap);
      ctx.lineTo(0, r * 0.86);
      ctx.stroke();

      var scaleText = stop.step === 0 ? "12 m" : stop.step === 1 ? "15 mm" : stop.step === 2 ? "5 mm" : "1.2 mm";
      var barHalf = r * 0.22;
      var barY = r * 0.68;
      ctx.strokeStyle = hexToRgba(PALETTE.cloudIvory, 0.82);
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-barHalf, barY - 3.5);
      ctx.lineTo(-barHalf, barY);
      ctx.lineTo(barHalf, barY);
      ctx.lineTo(barHalf, barY - 3.5);
      ctx.moveTo(0, barY - 2.5);
      ctx.lineTo(0, barY);
      ctx.stroke();

      ctx.fillStyle = hexToRgba(PALETTE.cloudIvory, 0.9);
      ctx.font = "600 " + Math.max(9, Math.round(r * 0.1)) + "px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.textAlign = "center";
      ctx.fillText(stop.zoom + "x · " + hyp.numeral + " · " + scaleText, 0, barY + Math.max(11, r * 0.12));

      ctx.strokeStyle = hexToRgba(PALETTE.lensSpecular, 0.36);
      ctx.lineWidth = Math.max(2, r * 0.035);
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.92, -2.55, -1.15);
      ctx.stroke();
    }

    function drawOuterBrassHousing(ctx, r, outerR, wc) {
      ctx.save();
      ctx.translate(lens.cx, lens.cy);

      ctx.fillStyle = "rgba(9, 15, 11, 0.42)";
      ctx.beginPath();
      ctx.arc(3, 5, outerR + 3, 0, TAU);
      ctx.fill();

      ctx.save();
      ctx.rotate(-0.68);
      ctx.fillStyle = "#8a5f20";
      ctx.strokeStyle = "#f0d48d";
      ctx.lineWidth = 1.2;
      var dialX = outerR * 0.95;
      ctx.fillRect(dialX, -r * 0.14, r * 0.16, r * 0.28);
      ctx.strokeRect(dialX, -r * 0.14, r * 0.16, r * 0.28);
      for (var kn = -3; kn <= 3; kn++) {
        ctx.beginPath();
        ctx.moveTo(dialX + 1, kn * r * 0.036);
        ctx.lineTo(dialX + r * 0.15, kn * r * 0.036);
        ctx.stroke();
      }
      ctx.restore();

      var bezelGrad = ctx.createLinearGradient(-outerR, -outerR, outerR, outerR);
      bezelGrad.addColorStop(0, "#f2d894");
      bezelGrad.addColorStop(0.35, PALETTE.brassOptic);
      bezelGrad.addColorStop(0.72, "#7d551c");
      bezelGrad.addColorStop(1, "#e2be6e");

      ctx.fillStyle = bezelGrad;
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, TAU);
      ctx.arc(0, 0, r, 0, TAU, true);
      ctx.fill();

      ctx.strokeStyle = "#4d330f";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = wc.violated ? "#d96548" : "#f6e3ad";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, 0, (r + outerR) * 0.5, 0, TAU);
      ctx.stroke();

      ctx.save();
      ctx.rotate(state.vernierAngle);
      ctx.strokeStyle = "#2e1d07";
      for (var t = 0; t < 72; t++) {
        var ang = (t / 72) * TAU;
        var major = t % 18 === 0;
        var med = t % 6 === 0;
        var innerTick = r + (outerR - r) * (major ? 0.12 : med ? 0.28 : 0.46);
        var outerTick = outerR - (outerR - r) * 0.08;
        ctx.lineWidth = major ? 1.8 : med ? 1.2 : 0.8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * innerTick, Math.sin(ang) * innerTick);
        ctx.lineTo(Math.cos(ang) * outerTick, Math.sin(ang) * outerTick);
        ctx.stroke();
      }
      ctx.restore();
      ctx.restore();
    }

    function renderSpyglassOverlay(ctx, worldContext) {
      if (!ctx) return;
      if ((!state.width || !state.height) && ctx.canvas) {
        resize(ctx.canvas.clientWidth || ctx.canvas.width || 1280, ctx.canvas.clientHeight || ctx.canvas.height || 800, state.dpr);
      }
      var w = state.width;
      var h = state.height;
      var wc = resolveWorldOpts(worldContext);
      var seed = hash01(state.activeSpecimenIndex * 3.7 + state.aimNormX * 19.1 + state.aimNormY * 29.3);

      drawFloorGlintsAndCone(ctx, w, h, wc);

      ctx.save();
      ctx.beginPath();
      ctx.arc(lens.cx, lens.cy, lens.r, 0, TAU);
      ctx.clip();
      ctx.translate(lens.cx, lens.cy);

      if (state.zoomStep === 0) {
        drawCanopy1x(ctx, lens.r, wc, seed);
      } else if (state.zoomStep === 1) {
        drawLeaf8x(ctx, lens.r, wc, seed);
      } else if (state.zoomStep === 2) {
        drawStone24x(ctx, lens.r, wc, seed);
      } else {
        drawAnt64x(ctx, lens.r, wc, seed);
      }

      drawBrassBezelAndReticle(ctx, lens.r, wc);
      ctx.restore();

      drawOuterBrassHousing(ctx, lens.r, lens.outerR, wc);
    }

    return {
      resize: resize,
      setAim: setAim,
      nudgeAim: nudgeAim,
      focusSpecimen: focusSpecimen,
      setZoomStep: setZoomStep,
      cycleZoom: cycleZoom,
      setMagnification: setMagnification,
      setHypothesis: setHypothesis,
      descendLadderToEarth: descendLadderToEarth,
      retreatAboveClouds: retreatAboveClouds,
      setReducedMotion: setReducedMotion,
      step: step,
      renderSpyglassOverlay: renderSpyglassOverlay,
      hitTestSpecimenOrLens: hitTestSpecimenOrLens,
      getSpecimens: getSpecimens,
      getLensGeometry: getLensGeometry,
      getState: getState,
      reset: reset
    };
  }

  var BaucisNadirSpyglass = Object.freeze({
    PALETTE: PALETTE,
    HYPOTHESES: HYPOTHESES,
    MAGNIFICATION_STOPS: MAGNIFICATION_STOPS,
    SPECIMEN_CATALOG: SPECIMEN_CATALOG,
    createNadirSpyglass: createNadirSpyglass
  });

  root.BaucisNadirSpyglass = BaucisNadirSpyglass;
  if (typeof module === "object" && module && module.exports) {
    module.exports = BaucisNadirSpyglass;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
