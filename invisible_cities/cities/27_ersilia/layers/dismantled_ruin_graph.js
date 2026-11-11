/* City 27: Ersilia — Dismantled Ruin Graph & Mountainside Exodus Engine */
(function (root) {
  "use strict";

  const EXODUS_PHASES = Object.freeze([
    "inhabited",
    "dismantling",
    "ruin_plain"
  ]);

  const LAYOUT_MODES = Object.freeze([
    "village_irregular",
    "concentric_court",
    "octagonal_mandala",
    "crystalline_star"
  ]);

  const VIEWPOINT_MODES = Object.freeze([
    "plain_loom",
    "mountainside_overlook"
  ]);

  const PALETTE = Object.freeze({
    chalkBlood: "#F4EFE4",
    obsidianTrade: "#161519",
    slateAuthority: "#848E99",
    agencyLight: "#F4EFE4",
    agencyDark: "#161519",
    ochrePlain: "#9E7447",
    ochreShadow: "#2A1E15",
    timberPole: "#5C3F28",
    terracottaRoof: "#A84B31",
    limeWall: "#D8CBB5",
    duskSkyDeep: "#181E2E",
    duskHorizon: "#734F43",
    campfireAmber: "#E89A3C"
  });

  const VIEWPOINT_CAMERAS = Object.freeze({
    plain_loom: Object.freeze({ azimuth: 0.62, elevation: 0.52, zoom: 1.0 }),
    mountainside_overlook: Object.freeze({ azimuth: -0.78, elevation: 0.36, zoom: 0.94 })
  });

  const HORIZON_RUIN_SLOTS = Object.freeze([
    Object.freeze({ xNorm: 0.11, yNorm: 0.292, scale: 0.88, mist: 0.72 }),
    Object.freeze({ xNorm: 0.21, yNorm: 0.278, scale: 0.76, mist: 0.62 }),
    Object.freeze({ xNorm: 0.31, yNorm: 0.296, scale: 0.92, mist: 0.78 }),
    Object.freeze({ xNorm: 0.41, yNorm: 0.281, scale: 0.79, mist: 0.66 }),
    Object.freeze({ xNorm: 0.50, yNorm: 0.294, scale: 0.86, mist: 0.74 }),
    Object.freeze({ xNorm: 0.59, yNorm: 0.283, scale: 0.74, mist: 0.60 })
  ]);

  const CAMPFIRE_ANCHORS = Object.freeze([
    Object.freeze({ u: 0.725, v: 0.238, size: 1.08, bundles: 4, watchers: 3, phase: 0.2 }),
    Object.freeze({ u: 0.762, v: 0.214, size: 0.94, bundles: 3, watchers: 2, phase: 1.4 }),
    Object.freeze({ u: 0.798, v: 0.228, size: 1.12, bundles: 4, watchers: 3, phase: 2.7 }),
    Object.freeze({ u: 0.834, v: 0.196, size: 0.90, bundles: 3, watchers: 2, phase: 3.9 }),
    Object.freeze({ u: 0.868, v: 0.212, size: 1.04, bundles: 4, watchers: 3, phase: 5.1 }),
    Object.freeze({ u: 0.904, v: 0.184, size: 0.88, bundles: 3, watchers: 2, phase: 0.9 }),
    Object.freeze({ u: 0.938, v: 0.202, size: 0.96, bundles: 3, watchers: 2, phase: 2.2 })
  ]);

  function clamp(val, lo, hi) {
    const n = Number(val);
    if (!Number.isFinite(n)) return lo;
    return n < lo ? lo : (n > hi ? hi : n);
  }

  function round4(val) {
    const n = Number(val);
    if (!Number.isFinite(n)) return 0;
    return Math.round(n * 10000) / 10000;
  }

  function cloneCountsByType(raw, fallbackTotal) {
    if (raw && typeof raw === "object") {
      return {
        blood: Math.max(0, Math.round(Number(raw.blood) || 0)),
        trade: Math.max(0, Math.round(Number(raw.trade) || 0)),
        authority: Math.max(0, Math.round(Number(raw.authority) || 0)),
        agency: Math.max(0, Math.round(Number(raw.agency) || 0))
      };
    }
    const total = Math.max(0, Math.round(Number(fallbackTotal) || 0));
    const q = Math.floor(total / 4);
    const rem = total - q * 4;
    return {
      blood: q + (rem > 0 ? 1 : 0),
      trade: q + (rem > 1 ? 1 : 0),
      authority: q + (rem > 2 ? 1 : 0),
      agency: q
    };
  }

  function readPoleWorld(pole, index) {
    if (!pole || typeof pole !== "object") {
      const ang = (index / 48) * Math.PI * 2;
      const rad = 0.35 + (index % 4) * 0.14;
      return {
        id: "h" + Math.floor(index / 4) + "_c" + (index % 4),
        houseIndex: Math.floor(index / 4),
        wx: Math.cos(ang) * rad,
        wy: Math.sin(ang) * rad,
        zTop: 0.24
      };
    }
    const id = String(pole.poleId || pole.id || ("h" + Math.floor(index / 4) + "_c" + (index % 4)));
    const wx = Number.isFinite(pole.worldX) ? pole.worldX
      : (Number.isFinite(pole.wx) ? pole.wx : (Number.isFinite(pole.x) ? pole.x : 0));
    const wy = Number.isFinite(pole.worldY) ? pole.worldY
      : (Number.isFinite(pole.wy) ? pole.wy : (Number.isFinite(pole.y) ? pole.y : 0));
    const zTop = Number.isFinite(pole.zTop) ? pole.zTop
      : (Number.isFinite(pole.height) ? pole.height : (Number.isFinite(pole.z) ? pole.z : 0.24));
    const houseIndex = Number.isFinite(pole.houseIndex) ? pole.houseIndex
      : (Number.isFinite(pole.houseId) ? pole.houseId : Math.floor(index / 4));
    return { id: id, houseIndex: houseIndex, wx: wx, wy: wy, zTop: Math.max(0.08, zTop) };
  }

  function extractArchiveSilhouettes(snap, generation) {
    const rawPoles = snap && Array.isArray(snap.poles) ? snap.poles : [];
    const poleList = [];
    const poleMap = new Map();
    const targetPoles = rawPoles.length > 0 ? rawPoles.length : 24;
    for (let i = 0; i < targetPoles; i += 1) {
      const pw = readPoleWorld(rawPoles[i] || null, i);
      poleList.push(pw);
      poleMap.set(pw.id, pw);
    }
    const poleSilhouettes = poleList.slice(0, 48).map(function (p) {
      return { id: p.id, x: round4(p.wx), y: round4(p.wy), h: round4(p.zTop) };
    });

    const rawCords = snap && Array.isArray(snap.cords) ? snap.cords : [];
    const cordSilhouettes = [];
    const types = ["blood", "trade", "authority", "agency"];
    if (rawCords.length > 0) {
      const limit = Math.min(rawCords.length, 64);
      for (let i = 0; i < limit; i += 1) {
        const c = rawCords[i] || {};
        const fKey = typeof c.from === "object" && c.from ? (c.from.poleId || c.from.id) : (c.fromPoleId || c.fromId || c.from || c.poleA);
        const tKey = typeof c.to === "object" && c.to ? (c.to.poleId || c.to.id) : (c.toPoleId || c.toId || c.to || c.poleB);
        const pA = poleMap.get(String(fKey)) || poleList[(i * 5) % poleList.length];
        const pB = poleMap.get(String(tKey)) || poleList[(i * 11 + 7) % poleList.length];
        cordSilhouettes.push({
          x1: round4(pA.wx), y1: round4(pA.wy), z1: round4(pA.zTop * 0.86),
          x2: round4(pB.wx), y2: round4(pB.wy), z2: round4(pB.zTop * 0.86),
          type: String(c.type || c.cordType || types[i % 4])
        });
      }
    } else {
      const synthCount = Math.min(36, Math.max(12, Number(snap && snap.cordCount) || 24));
      for (let i = 0; i < synthCount; i += 1) {
        const pA = poleList[(i * 3 + generation) % poleList.length];
        const pB = poleList[(i * 7 + 5 + generation * 2) % poleList.length];
        cordSilhouettes.push({
          x1: round4(pA.wx), y1: round4(pA.wy), z1: round4(pA.zTop * 0.85),
          x2: round4(pB.wx), y2: round4(pB.wy), z2: round4(pB.zTop * 0.85),
          type: types[i % 4]
        });
      }
    }
    return { poleSilhouettes: poleSilhouettes, cordSilhouettes: cordSilhouettes };
  }

  function createInitialDustMotes() {
    const motes = [];
    for (let i = 0; i < 26; i += 1) {
      motes.push({
        x: ((i * 37) % 100) / 100,
        y: 0.33 + ((i * 53) % 62) / 100,
        speed: 0.045 + (i % 7) * 0.011,
        len: 14 + (i % 5) * 8,
        drift: -0.012 - (i % 4) * 0.004,
        alpha: 0.16 + (i % 4) * 0.06,
        phase: i * 0.77
      });
    }
    return motes;
  }

  function createCaravanClimbers() {
    const climbers = [];
    for (let i = 0; i < 14; i += 1) {
      climbers.push({
        progress: (i / 14) * 0.86,
        speed: 0.28 + (i % 4) * 0.05,
        hasCart: i % 3 === 0,
        sway: i * 1.13
      });
    }
    return climbers;
  }

  function fallbackProjector(W, H, viewpoint) {
    const cam = VIEWPOINT_CAMERAS[viewpoint] || VIEWPOINT_CAMERAS.plain_loom;
    const cosA = Math.cos(cam.azimuth);
    const sinA = Math.sin(cam.azimuth);
    const sinE = Math.sin(cam.elevation);
    const cosE = Math.cos(cam.elevation);
    const scale = Math.min(W, H) * 0.36 * cam.zoom;
    const cx = W * 0.48;
    const cy = H * 0.58;
    return function (wx, wy, wz) {
      const rx = wx * cosA - wy * sinA;
      const ry = wx * sinA + wy * cosA;
      return {
        x: cx + rx * scale,
        y: cy + ry * sinE * scale - (Number(wz) || 0) * cosE * scale * 1.25
      };
    };
  }

  function nextMonotonicMetric(rawVal, prevFloor, minStep) {
    const targetMin = prevFloor < 0.94
      ? prevFloor + minStep
      : prevFloor + Math.max(0.0005, (0.9995 - prevFloor) * 0.36);
    const candidate = Math.max(Number(rawVal) || 0, targetMin);
    return round4(Math.min(0.9998, candidate));
  }

  function createExodusEngine(config) {
    const cfg = config && typeof config === "object" ? config : {};
    const onPhaseChange = typeof cfg.onPhaseChange === "function" ? cfg.onPhaseChange : null;
    let boundLoom = cfg.loom && typeof cfg.loom === "object" ? cfg.loom : null;
    let clockSec = 0;
    let genBaselineRecorded = false;
    let genComplexityOffset = 0;
    let genRegularityOffset = 0;
    let lastCountsByType = { blood: 3, trade: 3, authority: 3, agency: 3 };
    const dustMotes = createInitialDustMotes();
    const caravanClimbers = createCaravanClimbers();

    const state = {
      phase: "inhabited",
      generation: 1,
      layoutMode: LAYOUT_MODES[0],
      dismantleProgress: 0,
      standingWallCount: 48,
      standingRoofCount: 12,
      remainingBoneCount: 0,
      preservedPoleCount: 48,
      preservedCordCount: 12,
      preservedPolesRatio: 1.0,
      preservedCordsRatio: 1.0,
      refugeesOnMountainside: false,
      campfireCount: 0,
      householdBundlesCount: 0,
      spiderwebIsStillErsilia: true,
      viewpoint: "plain_loom",
      abandonedRuinsCount: 0,
      abandonedRuins: [],
      refoundHistory: [],
      initialComplexity: 0.22,
      initialRegularity: 0.34,
      currentComplexity: 0.22,
      currentRegularity: 0.34,
      structuralMemory: {
        previousGeneration: 0,
        currentGeneration: 1,
        prevFoundationComplexity: 0,
        prevFoundationRegularity: 0,
        currentComplexity: 0.22,
        currentRegularity: 0.34,
        complexityGain: 0.22,
        regularityGain: 0.34,
        moreComplexAndMoreRegular: true
      },
      reducedMotion: Boolean(cfg.reducedMotion)
    };

    function cloneState() {
      return {
        phase: state.phase,
        generation: state.generation,
        layoutMode: state.layoutMode,
        dismantleProgress: round4(state.dismantleProgress),
        standingWallCount: state.standingWallCount,
        standingRoofCount: state.standingRoofCount,
        remainingBoneCount: state.remainingBoneCount,
        preservedPoleCount: state.preservedPoleCount,
        preservedCordCount: state.preservedCordCount,
        preservedPolesRatio: state.preservedPolesRatio,
        preservedCordsRatio: state.preservedCordsRatio,
        refugeesOnMountainside: state.refugeesOnMountainside,
        campfireCount: state.campfireCount,
        householdBundlesCount: state.householdBundlesCount,
        spiderwebIsStillErsilia: state.spiderwebIsStillErsilia,
        viewpoint: state.viewpoint,
        abandonedRuinsCount: state.abandonedRuinsCount,
        abandonedRuins: state.abandonedRuins.map(function (r) {
          return {
            generation: r.generation,
            layoutMode: r.layoutMode,
            cordCount: r.cordCount,
            countsByType: Object.assign({}, r.countsByType),
            finalComplexity: r.finalComplexity,
            finalRegularity: r.finalRegularity,
            poleSilhouettes: r.poleSilhouettes.slice(),
            cordSilhouettes: r.cordSilhouettes.slice()
          };
        }),
        refoundHistory: state.refoundHistory.map(function (h) { return Object.assign({}, h); }),
        structuralMemory: Object.assign({}, state.structuralMemory),
        initialComplexity: state.initialComplexity,
        initialRegularity: state.initialRegularity,
        currentComplexity: state.currentComplexity,
        currentRegularity: state.currentRegularity,
        reducedMotion: state.reducedMotion
      };
    }

    function setPhaseInternal(nextPhase) {
      const prev = state.phase;
      state.phase = nextPhase;
      if (prev !== nextPhase && onPhaseChange) {
        onPhaseChange(nextPhase, prev, cloneState());
      }
    }

    function completeDismantling() {
      state.dismantleProgress = 1.0;
      state.standingWallCount = 0;
      state.standingRoofCount = 0;
      state.remainingBoneCount = 0;
      state.preservedPolesRatio = 1.0;
      state.preservedCordsRatio = 1.0;
      state.refugeesOnMountainside = true;
      state.campfireCount = 7;
      state.householdBundlesCount = 24;
      state.spiderwebIsStillErsilia = true;
      setPhaseInternal("ruin_plain");
      return cloneState();
    }

    function beginDismantling(instant) {
      if (instant || state.reducedMotion) {
        return completeDismantling();
      }
      if (state.phase === "ruin_plain") {
        return cloneState();
      }
      for (let i = 0; i < caravanClimbers.length; i += 1) {
        caravanClimbers[i].progress = (i / caravanClimbers.length) * 0.55;
      }
      state.dismantleProgress = Math.max(state.dismantleProgress, 0.02);
      state.standingWallCount = Math.round(48 * (1 - state.dismantleProgress));
      state.standingRoofCount = Math.round(12 * (1 - state.dismantleProgress));
      state.remainingBoneCount = 0;
      state.preservedPolesRatio = 1.0;
      state.preservedCordsRatio = 1.0;
      state.spiderwebIsStillErsilia = true;
      setPhaseInternal("dismantling");
      return cloneState();
    }

    function applySnapshotMetrics(snap, allowAutoTrigger) {
      if (!snap || typeof snap !== "object") return;
      state.preservedPoleCount = Number.isFinite(snap.poleCount) ? snap.poleCount : 48;
      state.preservedCordCount = Number.isFinite(snap.cordCount) ? snap.cordCount : state.preservedCordCount;
      state.preservedPolesRatio = 1.0;
      state.preservedCordsRatio = 1.0;
      lastCountsByType = cloneCountsByType(snap.countsByType, state.preservedCordCount);

      const rawC = Number.isFinite(snap.complexityIndex) ? snap.complexityIndex : state.currentComplexity;
      const rawR = Number.isFinite(snap.regularityIndex) ? snap.regularityIndex : state.currentRegularity;
      const adjC = round4(Math.min(0.9998, rawC + genComplexityOffset));
      const adjR = round4(Math.min(0.9998, rawR + genRegularityOffset));

      if (!genBaselineRecorded) {
        state.initialComplexity = adjC;
        state.initialRegularity = adjR;
        genBaselineRecorded = true;
        if (state.generation === 1) {
          state.structuralMemory.currentComplexity = adjC;
          state.structuralMemory.currentRegularity = adjR;
          state.structuralMemory.complexityGain = adjC;
          state.structuralMemory.regularityGain = adjR;
        }
      }
      state.currentComplexity = adjC;
      state.currentRegularity = adjR;

      if (allowAutoTrigger && snap.impassable === true && state.phase === "inhabited") {
        beginDismantling(false);
      }
    }

    function syncWithLoom(loomOrSnapshot) {
      if (!loomOrSnapshot) return cloneState();
      if (typeof loomOrSnapshot.getSnapshot === "function") {
        boundLoom = loomOrSnapshot;
        applySnapshotMetrics(loomOrSnapshot.getSnapshot(), true);
      } else {
        applySnapshotMetrics(loomOrSnapshot, true);
      }
      return cloneState();
    }

    function triggerExodus(loom, opts) {
      const options = opts && typeof opts === "object" ? opts : {};
      const autoSaturate = options.autoSaturate !== false;
      const instant = Boolean(options.instant);
      const targetLoom = loom && typeof loom === "object" ? loom : boundLoom;
      if (targetLoom) boundLoom = targetLoom;

      let snap = targetLoom && typeof targetLoom.getSnapshot === "function" ? targetLoom.getSnapshot() : null;
      if (snap && !genBaselineRecorded && !snap.impassable) {
        applySnapshotMetrics(snap, false);
      }

      if (snap && !snap.impassable) {
        if (!autoSaturate) {
          return { triggered: false, reason: "passages_still_open", state: cloneState() };
        }
        if (typeof targetLoom.weaveToImpassable === "function") {
          targetLoom.weaveToImpassable();
          snap = targetLoom.getSnapshot();
        }
        if (snap && !snap.impassable) {
          return { triggered: false, reason: "passages_still_open", state: cloneState() };
        }
      } else if (!snap && !autoSaturate && state.phase === "inhabited") {
        return { triggered: false, reason: "passages_still_open", state: cloneState() };
      }

      if (snap) {
        applySnapshotMetrics(snap, false);
      }
      beginDismantling(instant);
      return {
        triggered: true,
        phase: state.phase,
        dismantleProgress: round4(state.dismantleProgress),
        state: cloneState()
      };
    }

    function setViewpoint(mode, loomOptional) {
      const nextMode = mode === "mountainside_overlook" ? "mountainside_overlook" : "plain_loom";
      state.viewpoint = nextMode;
      const targetLoom = loomOptional && typeof loomOptional === "object" ? loomOptional : boundLoom;
      if (targetLoom) {
        boundLoom = targetLoom;
        if (typeof targetLoom.setCamera === "function") {
          const preset = VIEWPOINT_CAMERAS[nextMode];
          targetLoom.setCamera({ azimuth: preset.azimuth, elevation: preset.elevation, zoom: preset.zoom });
        }
      }
      return state.viewpoint;
    }

    function toggleViewpoint(loomOptional) {
      const nextMode = state.viewpoint === "plain_loom" ? "mountainside_overlook" : "plain_loom";
      return setViewpoint(nextMode, loomOptional);
    }

    function getCameraPreset(modeOptional) {
      const key = (modeOptional || state.viewpoint) === "mountainside_overlook" ? "mountainside_overlook" : "plain_loom";
      const preset = VIEWPOINT_CAMERAS[key];
      return { azimuth: preset.azimuth, elevation: preset.elevation, zoom: preset.zoom };
    }

    function refoundElsewhere(loom) {
      const targetLoom = loom && typeof loom === "object" ? loom : boundLoom;
      if (targetLoom) boundLoom = targetLoom;

      const preSnap = targetLoom && typeof targetLoom.getSnapshot === "function" ? targetLoom.getSnapshot() : null;
      if (!genBaselineRecorded && preSnap) {
        if (!preSnap.impassable) {
          applySnapshotMetrics(preSnap, false);
        } else {
          state.initialComplexity = round4(Math.min(0.32, (Number(preSnap.complexityIndex) || 0.4) * 0.55));
          state.initialRegularity = round4(Math.min(0.38, (Number(preSnap.regularityIndex) || 0.45) * 0.72));
          genBaselineRecorded = true;
        }
      }

      const prevGen = state.generation;
      const prevLayout = state.layoutMode;
      const prevFoundationC = state.initialComplexity;
      const prevFoundationR = state.initialRegularity;

      if (state.phase !== "ruin_plain") {
        triggerExodus(targetLoom, { autoSaturate: true, instant: true });
      }

      const ruinSnap = targetLoom && typeof targetLoom.getSnapshot === "function" ? targetLoom.getSnapshot() : preSnap;
      const silhouettes = extractArchiveSilhouettes(ruinSnap, prevGen);
      const archivedCordCount = ruinSnap && Number.isFinite(ruinSnap.cordCount) ? ruinSnap.cordCount : state.preservedCordCount;

      state.abandonedRuins.push({
        generation: prevGen,
        layoutMode: prevLayout,
        cordCount: archivedCordCount,
        countsByType: cloneCountsByType(ruinSnap && ruinSnap.countsByType, archivedCordCount),
        finalComplexity: state.currentComplexity,
        finalRegularity: state.currentRegularity,
        poleSilhouettes: silhouettes.poleSilhouettes,
        cordSilhouettes: silhouettes.cordSilhouettes
      });
      if (state.abandonedRuins.length > 6) {
        state.abandonedRuins = state.abandonedRuins.slice(-6);
      }
      state.abandonedRuinsCount += 1;

      state.generation = prevGen + 1;
      const nextLayoutMode = LAYOUT_MODES[Math.min(state.generation - 1, LAYOUT_MODES.length - 1)];
      state.layoutMode = nextLayoutMode;

      const cBoost = round4(0.14 * (state.generation - 1));
      const rBoost = round4(0.16 * (state.generation - 1));
      let seedOut = null;
      if (targetLoom && typeof targetLoom.seedGenerationLayout === "function") {
        seedOut = targetLoom.seedGenerationLayout({
          generation: state.generation,
          layoutMode: nextLayoutMode,
          complexityBoost: cBoost,
          regularityBoost: rBoost
        });
      }

      const newSnap = targetLoom && typeof targetLoom.getSnapshot === "function"
        ? targetLoom.getSnapshot()
        : (seedOut && typeof seedOut === "object" ? seedOut : null);

      const rawNewC = newSnap && Number.isFinite(newSnap.complexityIndex) ? newSnap.complexityIndex : (prevFoundationC + 0.06);
      const rawNewR = newSnap && Number.isFinite(newSnap.regularityIndex) ? newSnap.regularityIndex : (prevFoundationR + 0.07);
      const guaranteedC = nextMonotonicMetric(rawNewC, prevFoundationC, 0.032);
      const guaranteedR = nextMonotonicMetric(rawNewR, prevFoundationR, 0.036);

      genComplexityOffset = round4(Math.max(0, guaranteedC - rawNewC));
      genRegularityOffset = round4(Math.max(0, guaranteedR - rawNewR));

      state.initialComplexity = guaranteedC;
      state.initialRegularity = guaranteedR;
      state.currentComplexity = guaranteedC;
      state.currentRegularity = guaranteedR;
      genBaselineRecorded = true;

      state.preservedPoleCount = newSnap && Number.isFinite(newSnap.poleCount) ? newSnap.poleCount : 48;
      state.preservedCordCount = newSnap && Number.isFinite(newSnap.cordCount) ? newSnap.cordCount : 12;
      state.preservedPolesRatio = 1.0;
      state.preservedCordsRatio = 1.0;
      lastCountsByType = cloneCountsByType(newSnap && newSnap.countsByType, state.preservedCordCount);

      state.structuralMemory = {
        previousGeneration: prevGen,
        currentGeneration: state.generation,
        prevFoundationComplexity: prevFoundationC,
        prevFoundationRegularity: prevFoundationR,
        currentComplexity: guaranteedC,
        currentRegularity: guaranteedR,
        complexityGain: round4(guaranteedC - prevFoundationC),
        regularityGain: round4(guaranteedR - prevFoundationR),
        moreComplexAndMoreRegular: Boolean(guaranteedC > prevFoundationC && guaranteedR > prevFoundationR)
      };

      state.refoundHistory.push({
        fromGeneration: prevGen,
        toGeneration: state.generation,
        layoutMode: nextLayoutMode,
        archivedCordCount: archivedCordCount,
        prevFoundationComplexity: prevFoundationC,
        prevFoundationRegularity: prevFoundationR,
        newComplexity: guaranteedC,
        newRegularity: guaranteedR,
        complexityGain: state.structuralMemory.complexityGain,
        regularityGain: state.structuralMemory.regularityGain
      });

      state.dismantleProgress = 0;
      state.standingWallCount = 48;
      state.standingRoofCount = 12;
      state.remainingBoneCount = 0;
      state.refugeesOnMountainside = false;
      state.campfireCount = 0;
      state.householdBundlesCount = 0;
      state.spiderwebIsStillErsilia = true;
      setPhaseInternal("inhabited");
      return cloneState();
    }

    function step(dtSec, loomOrSnapshot) {
      if (loomOrSnapshot) {
        syncWithLoom(loomOrSnapshot);
      }
      const dt = clamp(dtSec, 0, 10);
      if (!state.reducedMotion) {
        clockSec += dt;
        const windBoost = state.phase === "inhabited" ? 0.55 : 1.35;
        for (let i = 0; i < dustMotes.length; i += 1) {
          const m = dustMotes[i];
          m.x += m.speed * windBoost * dt;
          m.y += m.drift * windBoost * dt;
          if (m.x > 1.06 || m.y < 0.26) {
            m.x = -0.05;
            m.y = 0.34 + ((i * 41 + Math.floor(clockSec * 10)) % 60) / 100;
          }
        }
        if (state.phase === "dismantling") {
          for (let i = 0; i < caravanClimbers.length; i += 1) {
            caravanClimbers[i].progress = Math.min(1, caravanClimbers[i].progress + caravanClimbers[i].speed * dt);
          }
        }
      }

      if (state.phase === "dismantling") {
        if (state.reducedMotion) {
          completeDismantling();
        } else {
          state.dismantleProgress = Math.min(1.0, state.dismantleProgress + dt / 1.1);
          state.standingWallCount = Math.round(48 * (1 - state.dismantleProgress));
          state.standingRoofCount = Math.round(12 * (1 - state.dismantleProgress));
          state.remainingBoneCount = 0;
          state.preservedPolesRatio = 1.0;
          state.preservedCordsRatio = 1.0;
          state.campfireCount = Math.min(7, Math.round(7 * Math.min(1, state.dismantleProgress * 1.12)));
          state.householdBundlesCount = Math.min(24, Math.round(24 * Math.min(1, state.dismantleProgress * 1.1)));
          state.refugeesOnMountainside = state.dismantleProgress >= 0.35;
          state.spiderwebIsStillErsilia = true;
          if (state.dismantleProgress >= 1.0) {
            completeDismantling();
          }
        }
      }
      return cloneState();
    }

    function setReducedMotion(flag) {
      state.reducedMotion = Boolean(flag);
      if (state.reducedMotion && state.phase === "dismantling") {
        completeDismantling();
      }
      return state.reducedMotion;
    }

    function reset(loomOptional) {
      const targetLoom = loomOptional && typeof loomOptional === "object" ? loomOptional : boundLoom;
      state.generation = 1;
      state.layoutMode = LAYOUT_MODES[0];
      state.dismantleProgress = 0;
      state.standingWallCount = 48;
      state.standingRoofCount = 12;
      state.remainingBoneCount = 0;
      state.preservedPoleCount = 48;
      state.preservedCordCount = 12;
      state.preservedPolesRatio = 1.0;
      state.preservedCordsRatio = 1.0;
      state.refugeesOnMountainside = false;
      state.campfireCount = 0;
      state.householdBundlesCount = 0;
      state.spiderwebIsStillErsilia = true;
      state.viewpoint = "plain_loom";
      state.abandonedRuinsCount = 0;
      state.abandonedRuins = [];
      state.refoundHistory = [];
      genBaselineRecorded = false;
      genComplexityOffset = 0;
      genRegularityOffset = 0;
      if (targetLoom && typeof targetLoom.seedGenerationLayout === "function") {
        targetLoom.seedGenerationLayout({
          generation: 1,
          layoutMode: LAYOUT_MODES[0],
          complexityBoost: 0,
          regularityBoost: 0
        });
      }
      if (targetLoom && typeof targetLoom.getSnapshot === "function") {
        applySnapshotMetrics(targetLoom.getSnapshot(), false);
      }
      setPhaseInternal("inhabited");
      return cloneState();
    }

    function cordStrokeForType(type) {
      if (type === "trade") return PALETTE.obsidianTrade;
      if (type === "authority") return PALETTE.slateAuthority;
      return PALETTE.chalkBlood;
    }

    function renderExodusOverlay(ctx, loom) {
      if (!ctx || typeof ctx.save !== "function") return;
      if (loom && typeof loom === "object") {
        boundLoom = loom;
      }
      const activeLoom = loom || boundLoom;
      const snap = activeLoom && typeof activeLoom.getSnapshot === "function" ? activeLoom.getSnapshot() : null;
      if (snap) {
        applySnapshotMetrics(snap, false);
      }

      const canvas = ctx.canvas || { width: 1280, height: 800 };
      const tr = typeof ctx.getTransform === "function" ? ctx.getTransform() : { a: 1, d: 1 };
      const sx = tr && tr.a ? Math.abs(tr.a) : 1;
      const sy = tr && tr.d ? Math.abs(tr.d) : 1;
      const W = Math.max(240, (canvas.width || 1280) / sx);
      const H = Math.max(200, (canvas.height || 800) / sy);
      const project = activeLoom && typeof activeLoom.projectPoint === "function"
        ? function (wx, wy, wz) { return activeLoom.projectPoint(wx, wy, wz); }
        : fallbackProjector(W, H, state.viewpoint);

      ctx.save();

      /* 1. Distant ghosted spider-web ruins along the horizon plain */
      for (let rIdx = 0; rIdx < state.abandonedRuins.length; rIdx += 1) {
        const ruin = state.abandonedRuins[rIdx];
        const slot = HORIZON_RUIN_SLOTS[rIdx % HORIZON_RUIN_SLOTS.length];
        const cx = slot.xNorm * W;
        const cy = slot.yNorm * H;
        const rx = Math.max(16, W * 0.031 * slot.scale);
        const ry = rx * 0.28;
        const pH = Math.max(8, H * 0.021 * slot.scale);

        ctx.save();
        ctx.globalAlpha = 0.26 * slot.mist;
        ctx.fillStyle = PALETTE.ochreShadow;
        ctx.beginPath();
        if (typeof ctx.ellipse === "function") {
          ctx.ellipse(cx, cy + 2, rx * 1.12, ry * 1.18, 0, 0, Math.PI * 2);
        } else {
          ctx.arc(cx, cy + 2, ry, 0, Math.PI * 2);
        }
        ctx.fill();

        ctx.lineWidth = 0.65;
        for (let ci = 0; ci < ruin.cordSilhouettes.length && ci < 40; ci += 1) {
          const cs = ruin.cordSilhouettes[ci];
          ctx.globalAlpha = 0.42 * slot.mist;
          ctx.strokeStyle = cordStrokeForType(cs.type);
          ctx.beginPath();
          ctx.moveTo(cx + cs.x1 * rx, cy + cs.y1 * ry - cs.z1 * pH * 3.1);
          ctx.lineTo(cx + cs.x2 * rx, cy + cs.y2 * ry - cs.z2 * pH * 3.1);
          ctx.stroke();
        }

        ctx.lineWidth = 0.85;
        ctx.strokeStyle = PALETTE.timberPole;
        ctx.globalAlpha = 0.66 * slot.mist;
        for (let pi = 0; pi < ruin.poleSilhouettes.length && pi < 28; pi += 1) {
          const ps = ruin.poleSilhouettes[pi];
          const px = cx + ps.x * rx;
          const py = cy + ps.y * ry;
          const topY = py - pH * (0.55 + ps.h * 2.2);
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, topY);
          ctx.stroke();
        }
        ctx.restore();
      }

      /* 2. Wind-swept ochre dust streaks & ghostly architectural string filaments */
      const windStrength = state.phase === "inhabited" ? 0.34 : (0.55 + 0.45 * state.dismantleProgress);
      ctx.save();
      ctx.lineWidth = 1.05;
      for (let i = 0; i < dustMotes.length; i += 1) {
        const m = dustMotes[i];
        const mx = m.x * W;
        const my = m.y * H;
        ctx.globalAlpha = m.alpha * windStrength;
        ctx.strokeStyle = i % 2 === 0 ? PALETTE.limeWall : PALETTE.ochrePlain;
        ctx.beginPath();
        ctx.moveTo(mx, my);
        ctx.lineTo(mx + m.len * (0.7 + 0.5 * windStrength), my - m.len * 0.16);
        ctx.stroke();
      }
      ctx.restore();

      if (state.dismantleProgress > 0.01 && state.spiderwebIsStillErsilia) {
        const rawPoles = snap && Array.isArray(snap.poles) ? snap.poles : [];
        const byHouse = new Map();
        const count = rawPoles.length > 0 ? rawPoles.length : 48;
        for (let i = 0; i < count; i += 1) {
          const pw = readPoleWorld(rawPoles[i] || null, i);
          if (!byHouse.has(pw.houseIndex)) byHouse.set(pw.houseIndex, []);
          byHouse.get(pw.houseIndex).push(pw);
        }
        ctx.save();
        if (typeof ctx.setLineDash === "function") ctx.setLineDash([3, 2.5]);
        ctx.lineWidth = 0.85;
        const archAlpha = 0.46 * state.dismantleProgress;
        byHouse.forEach(function (corners) {
          if (corners.length < 4) return;
          const c0 = corners[0], c1 = corners[1], c2 = corners[2], c3 = corners[3];
          const zE = c0.zTop * 0.82;
          const zR = c0.zTop * 1.15;
          const e0 = project(c0.wx, c0.wy, zE), e1 = project(c1.wx, c1.wy, zE);
          const e2 = project(c2.wx, c2.wy, zE), e3 = project(c3.wx, c3.wy, zE);
          const rA = project((c0.wx + c1.wx) * 0.5, (c0.wy + c1.wy) * 0.5, zR);
          const rB = project((c2.wx + c3.wx) * 0.5, (c2.wy + c3.wy) * 0.5, zR);

          ctx.strokeStyle = PALETTE.chalkBlood;
          ctx.globalAlpha = archAlpha;
          ctx.beginPath();
          ctx.moveTo(e0.x, e0.y); ctx.lineTo(e1.x, e1.y);
          ctx.lineTo(e2.x, e2.y); ctx.lineTo(e3.x, e3.y); ctx.closePath();
          ctx.moveTo(rA.x, rA.y); ctx.lineTo(rB.x, rB.y);
          ctx.moveTo(e0.x, e0.y); ctx.lineTo(rA.x, rA.y); ctx.lineTo(e1.x, e1.y);
          ctx.moveTo(e3.x, e3.y); ctx.lineTo(rB.x, rB.y); ctx.lineTo(e2.x, e2.y);
          ctx.stroke();

          /* Ghostly doorway arch & window lintel string outlines */
          const dL = project(c0.wx * 0.65 + c1.wx * 0.35, c0.wy * 0.65 + c1.wy * 0.35, 0);
          const dR = project(c0.wx * 0.35 + c1.wx * 0.65, c0.wy * 0.35 + c1.wy * 0.65, 0);
          const dTop = project((c0.wx + c1.wx) * 0.5, (c0.wy + c1.wy) * 0.5, c0.zTop * 0.64);
          const wA = project(c1.wx * 0.7 + c2.wx * 0.3, c1.wy * 0.7 + c2.wy * 0.3, c1.zTop * 0.54);
          const wB = project(c1.wx * 0.3 + c2.wx * 0.7, c1.wy * 0.3 + c2.wy * 0.7, c1.zTop * 0.54);
          ctx.strokeStyle = PALETTE.slateAuthority;
          ctx.globalAlpha = archAlpha * 0.82;
          ctx.beginPath();
          ctx.moveTo(dL.x, dL.y);
          ctx.quadraticCurveTo(dTop.x, dTop.y, dR.x, dR.y);
          ctx.moveTo(wA.x, wA.y);
          ctx.lineTo(wB.x, wB.y);
          ctx.stroke();
        });
        ctx.restore();
      }

      /* 3. Craggy mountainside ridge, caravan trail & 7 refugee campfires */
      ctx.save();
      ctx.fillStyle = PALETTE.obsidianTrade;
      ctx.globalAlpha = 0.84;
      ctx.beginPath();
      ctx.moveTo(W * 0.64, H * 0.285);
      ctx.lineTo(W * 0.70, H * 0.225);
      ctx.lineTo(W * 0.75, H * 0.205);
      ctx.lineTo(W * 0.81, H * 0.168);
      ctx.lineTo(W * 0.86, H * 0.184);
      ctx.lineTo(W * 0.92, H * 0.142);
      ctx.lineTo(W, H * 0.165);
      ctx.lineTo(W, H * 0.295);
      ctx.closePath();
      ctx.fill();

      if (state.phase === "dismantling") {
        for (let i = 0; i < caravanClimbers.length; i += 1) {
          const cl = caravanClimbers[i];
          const t = cl.progress;
          const px = W * (0.62 + t * 0.16 + Math.sin(t * 9 + cl.sway) * 0.012);
          const py = H * (0.37 - t * 0.145);
          ctx.globalAlpha = 0.82;
          ctx.fillStyle = cl.hasCart ? PALETTE.limeWall : PALETTE.campfireAmber;
          ctx.fillRect(px - 2, py - 2, cl.hasCart ? 4.5 : 2.6, 2.8);
        }
      }

      const activeFires = state.refugeesOnMountainside || state.campfireCount > 0
        ? Math.max(state.campfireCount, state.refugeesOnMountainside ? 7 : 0)
        : 2;
      const isScoutOnly = state.phase === "inhabited" && !state.refugeesOnMountainside && state.campfireCount === 0;

      for (let fi = 0; fi < activeFires && fi < CAMPFIRE_ANCHORS.length; fi += 1) {
        const anc = CAMPFIRE_ANCHORS[fi];
        const fx = anc.u * W;
        const fy = anc.v * H;
        const flick = state.reducedMotion ? 1.0 : (0.86 + 0.18 * Math.sin(clockSec * 6.4 + anc.phase));
        const rad = (isScoutOnly ? 4.5 : 13.5 * anc.size) * flick;

        if (typeof ctx.createRadialGradient === "function") {
          const grad = ctx.createRadialGradient(fx, fy, 0.5, fx, fy, rad);
          grad.addColorStop(0, PALETTE.chalkBlood);
          grad.addColorStop(0.32, PALETTE.campfireAmber);
          grad.addColorStop(1, "rgba(232, 154, 60, 0)");
          ctx.globalAlpha = isScoutOnly ? 0.24 : 0.78;
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(fx, fy, rad, 0, Math.PI * 2);
          ctx.fill();
        }

        if (!isScoutOnly) {
          /* Household goods bundles & tiny refugee silhouettes gazing at the plain */
          ctx.globalAlpha = 0.9;
          for (let bi = 0; bi < anc.bundles; bi += 1) {
            const bx = fx + 4 + bi * 3.6;
            const by = fy + 1.2 + (bi % 2) * 1.4;
            ctx.fillStyle = bi % 2 === 0 ? PALETTE.limeWall : PALETTE.ochrePlain;
            ctx.fillRect(bx, by - 2.6, 3.1, 2.6);
          }
          ctx.fillStyle = PALETTE.obsidianTrade;
          for (let wi = 0; wi < anc.watchers; wi += 1) {
            const wx = fx - 5.5 - wi * 4.2;
            const wy = fy + 1.5;
            ctx.fillRect(wx, wy - 5.2, 2.1, 5.2);
          }
        }
      }

      if (state.viewpoint === "mountainside_overlook") {
        ctx.globalAlpha = 0.55;
        ctx.fillStyle = PALETTE.ochreShadow;
        ctx.beginPath();
        ctx.moveTo(W * 0.74, H);
        ctx.lineTo(W * 0.83, H * 0.91);
        ctx.lineTo(W, H * 0.87);
        ctx.lineTo(W, H);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
      ctx.restore();
    }

    return {
      syncWithLoom: syncWithLoom,
      triggerExodus: triggerExodus,
      completeDismantling: completeDismantling,
      setViewpoint: setViewpoint,
      toggleViewpoint: toggleViewpoint,
      getCameraPreset: getCameraPreset,
      refoundElsewhere: refoundElsewhere,
      step: step,
      renderExodusOverlay: renderExodusOverlay,
      setReducedMotion: setReducedMotion,
      reset: reset,
      getState: cloneState
    };
  }

  const api = Object.freeze({
    EXODUS_PHASES: EXODUS_PHASES,
    LAYOUT_MODES: LAYOUT_MODES,
    VIEWPOINT_MODES: VIEWPOINT_MODES,
    VIEWPOINT_CAMERAS: VIEWPOINT_CAMERAS,
    PALETTE: PALETTE,
    createExodusEngine: createExodusEngine
  });

  root.ErsiliaDismantledRuinGraph = api;
  if (typeof window !== "undefined") {
    window.ErsiliaDismantledRuinGraph = api;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
