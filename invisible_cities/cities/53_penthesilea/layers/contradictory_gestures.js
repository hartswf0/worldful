(function (root) {
  "use strict";

  var TAU = Math.PI * 2;
  var INITIAL_HOURS = 0.4;
  var UNITS_PER_HOUR = 300;
  var KM_PER_HOUR = 3.8;
  var WALK_DRIFT_SPEED = 56;
  var SEEK_CENTER_SPEED = 185;
  var SEEK_OUTSIDE_SPEED = 195;
  var OUTSIDE_LIMBO_INTERVAL = 220;
  var WALK_LIMBO_INTERVAL = 620;
  var WRINKLE_ARRIVAL_RADIUS = 28;
  var WRINKLE_EXCLUSION_RADIUS = 96;

  var PALETTE = {
    brothGround: "#e6e0d2",
    chalkHaze: "#efeae0",
    cabbageDust: "#7b8c72",
    zincShed: "#8d9699",
    wheelRust: "#9c4f35",
    tollOchre: "#b58d47",
    cinderInk: "#262421",
    plasterTooth: "#cfc6b4"
  };

  var CANONICAL_STONE_LABELS = [
    { id: "low_backs_turned", label: "Low buildings with backs turned" },
    { id: "plank_fences", label: "Plank fences" },
    { id: "corrugated_iron_sheds", label: "Corrugated-iron sheds" },
    { id: "cabbage_patches", label: "Patches of cabbages" },
    { id: "cemeteries", label: "Cemeteries" },
    { id: "snaggle_toothed_walls", label: "Snaggle-toothed walls" },
    { id: "rusty_carnival_wheel", label: "Rusty carnival wheel" },
    { id: "tollbooths", label: "Stray tollbooths" },
    { id: "workshops", label: "Workshops" },
    { id: "shambles", label: "Shambles" }
  ];

  var WITNESS_ROSTER = [
    {
      id: "market_woman",
      witness: "Woman with a market basket",
      detail: "cabbages wrapped in damp paper",
      preferredStoneId: "cabbage_patches"
    },
    {
      id: "crossroads_boy",
      witness: "Boy at a crossroads",
      detail: "straddling a chalk milestone",
      preferredStoneId: "plank_fences"
    },
    {
      id: "tollbooth_attendant",
      witness: "Tollbooth attendant without a gate",
      detail: "leaning under a rusted barrier arm",
      preferredStoneId: "tollbooths"
    },
    {
      id: "shed_mechanic",
      witness: "Corrugated-shed mechanic",
      detail: "wiping oil by scrap tires",
      preferredStoneId: "workshops"
    },
    {
      id: "cemetery_cutter",
      witness: "Cemetery stone-cutter",
      detail: "brushing dust from limestone",
      preferredStoneId: "cemeteries"
    },
    {
      id: "fairground_watchman",
      witness: "Fairground watchman",
      detail: "beneath the stalled rusty carnival wheel",
      preferredStoneId: "rusty_carnival_wheel"
    }
  ];

  var GESTURE_TYPES = ["ahead", "behind", "left", "right", "sweep_360"];

  var SPOKEN_GESTURES = {
    ahead: [
      "There, past the corrugated sheds",
      "Onward beyond the stray barrier arm — where the plaster walls seem taller",
      "Straight ahead past the workshops and chalk ruts"
    ],
    behind: [
      "Opposite — back behind you",
      "You already passed it before the cabbages",
      "Turn back past the tilted limestone markers; you walked right through it"
    ],
    left: [
      "Over crosswise by the shambles",
      "Off to your left between the plank fences and the zinc lean-tos"
    ],
    right: [
      "You already passed it before the cabbages",
      "Crosswise to your right, past the stalled carnival wheel and the shambles"
    ],
    sweep_360: [
      "All around us — this is already it",
      "Everywhere across this plain — there is no other Penthesilea than these outskirts"
    ]
  };

  var ARCH_STAGES = {
    DILUTED_APPROACH: {
      phaseId: "DILUTED_APPROACH",
      phaseIndex: 1,
      title: "Pale Soup of Outskirts",
      reflection:
        "You advance for hours across a wide plain without walls, towers, or gates: only pale suburbs, dusty cabbage rows, plank fences, and low plaster buildings turning their backs to the road."
    },
    OUTSKIRTS_OF_ITSELF: {
      phaseId: "OUTSKIRTS_OF_ITSELF",
      phaseIndex: 2,
      title: "Only the Outskirts of Itself",
      reflection:
        "Every snaggle-toothed comb of facades thins on approach into corrugated sheds, shambles, and a rusty carnival wheel. You give up searching any sac or wrinkle for a thicker center: Penthesilea is only the outskirts of itself."
    },
    OUTSIDE_LIMBO_DOUBT: {
      phaseId: "OUTSIDE_LIMBO_DOUBT",
      phaseIndex: 3,
      title: "From One Limbo to Another",
      reflection:
        "A more anguished question now gnaws at your head: outside Penthesilea, does an outside exist? Or no matter how far you walk past stray tollbooths and cemeteries, do you only pass from one limbo to another, never managing to leave it?"
    }
  };

  var WRINKLE_FINDINGS = [
    "Behind the snaggle-toothed facade: only plank fences, cabbages, and a corrugated shed—no recognizable square.",
    "Reached the tall plaster comb that promised a square; behind its propped wall stand only oil drums, damp laundry cords, and shambles.",
    "Probed another apparent thickening of roofs: the facades were one room shallow, opening onto dusty cabbages and a gravel lot.",
    "Entered the wrinkle of uneven walls expecting a street grid; found only blank rear drainpipes and a stalled fairground frame."
  ];

  var OUTSIDE_FINDINGS = [
    "Passed stray tollbooth and cemetery—only entered another pale suburb of workshops and shambles.",
    "Crossed another chalk threshold straight outward: no open countryside appears, only plank fences and corrugated-iron sheds.",
    "Walked far past the rusted barrier arm expecting fields beyond the city, yet low windowless backs and cabbage rows resume unchanged.",
    "Left the cemetery slabs behind on an unwavering outward bearing, only to meet another vulcanizer yard and market shambles in pale haze."
  ];

  function clamp(val, minVal, maxVal) {
    return val < minVal ? minVal : val > maxVal ? maxVal : val;
  }

  function round4(val) {
    return Math.round(val * 10000) / 10000;
  }

  function normalizeAngle(rad) {
    var r = Number(rad) || 0;
    r = r % TAU;
    return r < 0 ? r + TAU : r;
  }

  function normalizeSignedAngle(rad) {
    var r = normalizeAngle(rad + Math.PI) - Math.PI;
    return r === -Math.PI ? Math.PI : r;
  }

  function deterministicJitter(index, salt, maxAbs) {
    var s = Math.sin((index + 1) * 12.9898 + (salt + 1) * 78.233) * 43758.5453;
    var frac = s - Math.floor(s);
    return (frac * 2 - 1) * maxAbs;
  }

  function classifyRelativeGesture(relRad) {
    var absRel = Math.abs(relRad);
    if (absRel <= Math.PI * 0.26) {
      return "ahead";
    }
    if (absRel >= Math.PI * 0.74) {
      return "behind";
    }
    return relRad < 0 ? "left" : "right";
  }

  function create(opts) {
    var cfg = opts || {};
    var startX = Number.isFinite(cfg.startX) ? cfg.startX : 0;
    var startY = Number.isFinite(cfg.startY) ? cfg.startY : 0;
    var initialBearing = Number.isFinite(cfg.initialBearingRad) ? normalizeAngle(cfg.initialBearingRad) : 0.18;

    var state = {
      worldX: startX,
      worldY: startY,
      bearingRad: initialBearing,
      speed: 0,
      totalUnitsWalked: 0,
      hoursWalked: INITIAL_HOURS,
      distanceKm: round4(INITIAL_HOURS * KM_PER_HOUR),
      limbosCrossed: 0,
      wrinklesProbed: 0,
      mode: "walk",
      paused: Boolean(cfg.paused),
      reducedMotion: Boolean(cfg.reducedMotion),
      escapeBearingRad: initialBearing,
      outsideUnitsAccum: 0,
      walkLimboUnitsAccum: 0,
      lastLimboSectorCode: null,
      visitedThresholdKeys: {},
      wrinkleTarget: null,
      wrinkleChaseUnits: 0,
      recentWrinkleSites: [],
      encounters: [],
      sumX: 0,
      sumY: 0,
      gestureCounts: { ahead: 0, behind: 0, left: 0, right: 0, sweep_360: 0 },
      quoteCursor: { ahead: 0, behind: 0, left: 0, right: 0, sweep_360: 0 },
      fieldFindings: [],
      findingSeq: 0,
      encounterSeq: 0,
      sampler: cfg.plainSampler || null
    };

    function rememberSampler(plainSampler) {
      if (plainSampler && typeof plainSampler === "object") {
        state.sampler = plainSampler;
      }
      return state.sampler;
    }

    function samplePlain(wx, wy, radius) {
      var s = state.sampler;
      if (s && typeof s.sampleSurroundings === "function") {
        try {
          var res = s.sampleSurroundings(wx, wy, radius || 240);
          if (res && typeof res === "object") {
            return res;
          }
        } catch (_err) {
          /* fallback to deterministic local stone sample */
        }
      }
      var cellX = Math.floor(wx / 160);
      var cellY = Math.floor(wy / 160);
      var idx = Math.abs(cellX * 7 + cellY * 13 + state.encounterSeq * 3) % CANONICAL_STONE_LABELS.length;
      var chosen = CANONICAL_STONE_LABELS[idx];
      return {
        nearbyStones: [{ id: chosen.id, label: chosen.label, dist: 38, x: wx + 26, y: wy - 18 }],
        wallsOrGatesCount: 0,
        limboSectorCode: "S" + cellX + ":" + cellY,
        nearestTollboothDist: idx === 7 ? 42 : 190,
        rustyWheelVisible: idx === 6
      };
    }

    function pickNearbyStoneLabel(preferredStoneId) {
      var sample = samplePlain(state.worldX, state.worldY, 260);
      var list = sample && Array.isArray(sample.nearbyStones) ? sample.nearbyStones : [];
      var i;
      if (preferredStoneId) {
        for (i = 0; i < list.length; i += 1) {
          if (list[i] && list[i].id === preferredStoneId && list[i].label) {
            return list[i].label;
          }
        }
      }
      if (list.length > 0 && list[0] && list[0].label) {
        return list[0].label;
      }
      for (i = 0; i < CANONICAL_STONE_LABELS.length; i += 1) {
        if (CANONICAL_STONE_LABELS[i].id === preferredStoneId) {
          return CANONICAL_STONE_LABELS[i].label;
        }
      }
      var fallbackIdx = state.encounterSeq % CANONICAL_STONE_LABELS.length;
      return CANONICAL_STONE_LABELS[fallbackIdx].label;
    }

    function appendFinding(kind, text, nearbyStoneLabel) {
      state.findingSeq += 1;
      var entry = {
        id: "finding-" + state.findingSeq,
        seq: state.findingSeq,
        kind: kind,
        mode: state.mode,
        text: text,
        message: text,
        nearbyStoneLabel: nearbyStoneLabel || pickNearbyStoneLabel(null),
        hoursWalked: round4(state.hoursWalked),
        distanceKm: round4(state.distanceKm),
        worldX: round4(state.worldX),
        worldY: round4(state.worldY),
        wrinklesProbed: state.wrinklesProbed,
        limbosCrossed: state.limbosCrossed
      };
      state.fieldFindings.push(entry);
      if (state.fieldFindings.length > 28) {
        state.fieldFindings.shift();
      }
      if (typeof cfg.onFinding === "function") {
        cfg.onFinding(entry);
      }
      return entry;
    }

    function isTooCloseToVisitedWrinkle(tx, ty) {
      var curDist = Math.hypot(tx - state.worldX, ty - state.worldY);
      if (curDist < 42) {
        return true;
      }
      for (var i = 0; i < state.recentWrinkleSites.length; i += 1) {
        var site = state.recentWrinkleSites[i];
        if (Math.hypot(tx - site.x, ty - site.y) < WRINKLE_EXCLUSION_RADIUS) {
          return true;
        }
      }
      return false;
    }

    function acquireNextWrinkleTarget() {
      var s = state.sampler;
      var candidate = null;
      if (s && typeof s.findNearestWrinkleBearing === "function") {
        try {
          var direct = s.findNearestWrinkleBearing(state.worldX, state.worldY);
          if (
            direct &&
            Number.isFinite(direct.targetX) &&
            Number.isFinite(direct.targetY) &&
            !isTooCloseToVisitedWrinkle(direct.targetX, direct.targetY)
          ) {
            candidate = direct;
          } else {
            for (var k = 0; k < 7 && !candidate; k += 1) {
              var probeAng = normalizeAngle(state.bearingRad + k * 2.39996 + 0.55);
              var probeRad = 220 + (k % 2) * 140;
              var px = state.worldX + Math.cos(probeAng) * probeRad;
              var py = state.worldY + Math.sin(probeAng) * probeRad;
              var alt = s.findNearestWrinkleBearing(px, py);
              if (
                alt &&
                Number.isFinite(alt.targetX) &&
                Number.isFinite(alt.targetY) &&
                !isTooCloseToVisitedWrinkle(alt.targetX, alt.targetY)
              ) {
                candidate = {
                  bearingRad: normalizeAngle(Math.atan2(alt.targetY - state.worldY, alt.targetX - state.worldX)),
                  targetX: alt.targetX,
                  targetY: alt.targetY,
                  label: alt.label || "Snaggle-toothed walls"
                };
              }
            }
          }
        } catch (_err) {
          candidate = null;
        }
      }
      if (!candidate) {
        var mirageAng = normalizeAngle(state.bearingRad + 0.92 + (state.wrinklesProbed % 5) * 1.18);
        var mirageDist = 165 + (state.wrinklesProbed % 3) * 35;
        candidate = {
          bearingRad: mirageAng,
          targetX: state.worldX + Math.cos(mirageAng) * mirageDist,
          targetY: state.worldY + Math.sin(mirageAng) * mirageDist,
          label: "Snaggle-toothed walls"
        };
      }
      state.wrinkleTarget = candidate;
      state.wrinkleChaseUnits = 0;
      state.bearingRad = normalizeAngle(Math.atan2(candidate.targetY - state.worldY, candidate.targetX - state.worldX));
      return candidate;
    }

    function completeWrinkleProbe() {
      var probedSite = state.wrinkleTarget
        ? { x: state.wrinkleTarget.targetX, y: state.wrinkleTarget.targetY }
        : { x: state.worldX, y: state.worldY };
      state.recentWrinkleSites.push(probedSite);
      if (state.recentWrinkleSites.length > 8) {
        state.recentWrinkleSites.shift();
      }
      state.wrinklesProbed += 1;
      var msg = WRINKLE_FINDINGS[(state.wrinklesProbed - 1) % WRINKLE_FINDINGS.length];
      appendFinding("wrinkle_probed", msg, "Snaggle-toothed walls");
      acquireNextWrinkleTarget();
    }

    function completeOutsideLimboCrossing() {
      state.limbosCrossed += 1;
      var msg = OUTSIDE_FINDINGS[(state.limbosCrossed - 1) % OUTSIDE_FINDINGS.length];
      var stoneLabel = pickNearbyStoneLabel(state.limbosCrossed % 2 === 1 ? "tollbooths" : "cemeteries");
      appendFinding("limbo_crossed", msg, stoneLabel);
    }

    function checkWalkThresholds(stepDist) {
      state.walkLimboUnitsAccum += stepDist;
      var sample = samplePlain(state.worldX, state.worldY, 220);
      if (state.lastLimboSectorCode === null && sample && sample.limboSectorCode) {
        state.lastLimboSectorCode = sample.limboSectorCode;
      }
      var nearBooth = sample && Number.isFinite(sample.nearestTollboothDist) && sample.nearestTollboothDist <= 54;
      var sectorChanged = Boolean(sample && sample.limboSectorCode && sample.limboSectorCode !== state.lastLimboSectorCode);
      if (
        state.walkLimboUnitsAccum >= WALK_LIMBO_INTERVAL ||
        (state.walkLimboUnitsAccum >= 500 && (nearBooth || sectorChanged))
      ) {
        state.walkLimboUnitsAccum = 0;
        if (sample && sample.limboSectorCode) {
          state.lastLimboSectorCode = sample.limboSectorCode;
        }
        state.limbosCrossed += 1;
        appendFinding(
          "suburb_threshold",
          "Passed another stray tollbooth and cemetery cluster without any city wall—only pale outskirts ahead.",
          nearBooth ? "Stray tollbooths" : pickNearbyStoneLabel("cemeteries")
        );
      }
    }

    function ageEncounters(dtSec) {
      if (dtSec <= 0) {
        return;
      }
      for (var i = 0; i < state.encounters.length; i += 1) {
        state.encounters[i].age = round4((state.encounters[i].age || 0) + dtSec);
      }
    }

    function advanceDisplacement(dx, dy, activeMode) {
      var stepDist = Math.hypot(dx, dy);
      if (stepDist <= 0) {
        return;
      }
      state.worldX += dx;
      state.worldY += dy;
      state.totalUnitsWalked += stepDist;
      state.hoursWalked = INITIAL_HOURS + state.totalUnitsWalked / UNITS_PER_HOUR;
      state.distanceKm = state.hoursWalked * KM_PER_HOUR;

      if (activeMode === "seek_center") {
        if (!state.wrinkleTarget) {
          acquireNextWrinkleTarget();
        }
        state.wrinkleChaseUnits += stepDist;
        var distToTarget = Math.hypot(
          state.wrinkleTarget.targetX - state.worldX,
          state.wrinkleTarget.targetY - state.worldY
        );
        if (distToTarget <= WRINKLE_ARRIVAL_RADIUS || state.wrinkleChaseUnits >= 245) {
          completeWrinkleProbe();
        }
      } else if (activeMode === "seek_outside") {
        state.outsideUnitsAccum += stepDist;
        while (state.outsideUnitsAccum >= OUTSIDE_LIMBO_INTERVAL) {
          state.outsideUnitsAccum -= OUTSIDE_LIMBO_INTERVAL;
          completeOutsideLimboCrossing();
        }
      } else {
        checkWalkThresholds(stepDist);
      }
    }

    function substepUpdate(stepDt, inputState) {
      var inp = inputState || {};
      var isReduced = Boolean(state.reducedMotion || inp.reducedMotion);
      var isPaused = Boolean(state.paused || inp.paused || inp.autoDrift === false);
      ageEncounters(stepDt);

      if (Number.isFinite(inp.steerBearingRad)) {
        state.bearingRad = normalizeAngle(inp.steerBearingRad);
      } else if (Number.isFinite(inp.turnDelta) && inp.turnDelta !== 0) {
        state.bearingRad = normalizeAngle(state.bearingRad + inp.turnDelta * stepDt);
      }

      var hasManualVec = Number.isFinite(inp.moveX) || Number.isFinite(inp.moveY);
      var mx = Number(inp.moveX) || 0;
      var my = Number(inp.moveY) || 0;
      var manualMag = Math.hypot(mx, my);

      if (state.mode === "seek_center") {
        if (isReduced && !inp.forceStep) {
          state.speed = 0;
          return;
        }
        if (!state.wrinkleTarget) {
          acquireNextWrinkleTarget();
        }
        var desired = Math.atan2(
          state.wrinkleTarget.targetY - state.worldY,
          state.wrinkleTarget.targetX - state.worldX
        );
        var diff = normalizeSignedAngle(desired - state.bearingRad);
        state.bearingRad = normalizeAngle(state.bearingRad + clamp(diff, -4.5 * stepDt, 4.5 * stepDt));
        state.speed = SEEK_CENTER_SPEED;
        advanceDisplacement(Math.cos(state.bearingRad) * state.speed * stepDt, Math.sin(state.bearingRad) * state.speed * stepDt, "seek_center");
        return;
      }

      if (state.mode === "seek_outside") {
        if (isReduced && !inp.forceStep) {
          state.speed = 0;
          return;
        }
        state.bearingRad = state.escapeBearingRad;
        state.speed = SEEK_OUTSIDE_SPEED;
        advanceDisplacement(Math.cos(state.bearingRad) * state.speed * stepDt, Math.sin(state.bearingRad) * state.speed * stepDt, "seek_outside");
        return;
      }

      if (hasManualVec && manualMag > 0.05) {
        state.bearingRad = normalizeAngle(Math.atan2(my, mx));
        var activeSpeed = WALK_DRIFT_SPEED * 1.65 * Math.min(1, manualMag);
        state.speed = activeSpeed;
        advanceDisplacement(Math.cos(state.bearingRad) * activeSpeed * stepDt, Math.sin(state.bearingRad) * activeSpeed * stepDt, "walk");
      } else if (inp.pointerActive && Number.isFinite(inp.steerBearingRad)) {
        state.speed = WALK_DRIFT_SPEED * 1.45;
        advanceDisplacement(Math.cos(state.bearingRad) * state.speed * stepDt, Math.sin(state.bearingRad) * state.speed * stepDt, "walk");
      } else if (!isReduced && !isPaused) {
        var gentleDriftWaver = Math.sin(state.totalUnitsWalked * 0.0045 + 0.7) * 0.05 * stepDt;
        state.bearingRad = normalizeAngle(state.bearingRad + gentleDriftWaver);
        state.speed = WALK_DRIFT_SPEED;
        advanceDisplacement(Math.cos(state.bearingRad) * state.speed * stepDt, Math.sin(state.bearingRad) * state.speed * stepDt, "walk");
      } else {
        state.speed = 0;
      }
    }

    function update(dt, inputState, plainSampler) {
      rememberSampler(plainSampler);
      var totalDt = clamp(Number(dt) || 0, 0, 5);
      if (totalDt <= 0) {
        return;
      }
      var maxChunk = 0.08;
      var remaining = totalDt;
      while (remaining > 1e-6) {
        var slice = remaining > maxChunk ? maxChunk : remaining;
        substepUpdate(slice, inputState);
        remaining -= slice;
      }
    }

    function walkBearing(bearingRad, stepUnits, plainSampler) {
      rememberSampler(plainSampler);
      var rad = Number.isFinite(bearingRad) ? normalizeAngle(bearingRad) : state.bearingRad;
      var units = Number.isFinite(stepUnits) && stepUnits > 0 ? stepUnits : 84;
      state.mode = "walk";
      state.bearingRad = rad;
      state.speed = 0;
      ageEncounters(0.35);
      advanceDisplacement(Math.cos(rad) * units, Math.sin(rad) * units, "walk");
      return getState();
    }

    function stepSeekCenter(plainSampler) {
      rememberSampler(plainSampler);
      if (state.mode !== "seek_center") {
        state.mode = "seek_center";
        acquireNextWrinkleTarget();
      } else if (!state.wrinkleTarget) {
        acquireNextWrinkleTarget();
      }
      var tx = state.wrinkleTarget.targetX;
      var ty = state.wrinkleTarget.targetY;
      var dx = tx - state.worldX;
      var dy = ty - state.worldY;
      state.bearingRad = normalizeAngle(Math.atan2(dy, dx));
      ageEncounters(0.5);
      advanceDisplacement(dx, dy, "seek_center");
      return getState();
    }

    function stepSeekOutside(plainSampler) {
      rememberSampler(plainSampler);
      if (state.mode !== "seek_outside") {
        state.mode = "seek_outside";
        state.escapeBearingRad = state.bearingRad;
        state.outsideUnitsAccum = 0;
      }
      state.bearingRad = state.escapeBearingRad;
      ageEncounters(0.5);
      advanceDisplacement(
        Math.cos(state.escapeBearingRad) * OUTSIDE_LIMBO_INTERVAL,
        Math.sin(state.escapeBearingRad) * OUTSIDE_LIMBO_INTERVAL,
        "seek_outside"
      );
      return getState();
    }

    function setBearing(bearingRad) {
      if (Number.isFinite(bearingRad)) {
        state.bearingRad = normalizeAngle(bearingRad);
        if (state.mode === "seek_outside") {
          state.escapeBearingRad = state.bearingRad;
        }
      }
      return state.bearingRad;
    }

    function setMode(mode, plainSampler) {
      rememberSampler(plainSampler);
      var nextMode = mode === "seek_center" || mode === "seek_outside" ? mode : "walk";
      state.mode = nextMode;
      if (nextMode === "seek_center") {
        acquireNextWrinkleTarget();
      } else if (nextMode === "seek_outside") {
        state.escapeBearingRad = state.bearingRad;
        state.outsideUnitsAccum = 0;
      } else {
        state.wrinkleTarget = null;
      }
      if (typeof cfg.onModeChange === "function") {
        cfg.onModeChange(nextMode);
      }
      return nextMode;
    }

    function setPaused(flag) {
      state.paused = Boolean(flag);
      if (state.paused) {
        state.speed = 0;
      }
      return state.paused;
    }

    function setReducedMotion(flag) {
      state.reducedMotion = Boolean(flag);
      if (state.reducedMotion) {
        state.speed = 0;
      }
      return state.reducedMotion;
    }

    function resetJourney() {
      state.worldX = startX;
      state.worldY = startY;
      state.bearingRad = initialBearing;
      state.speed = 0;
      state.totalUnitsWalked = 0;
      state.hoursWalked = INITIAL_HOURS;
      state.distanceKm = round4(INITIAL_HOURS * KM_PER_HOUR);
      state.limbosCrossed = 0;
      state.wrinklesProbed = 0;
      state.mode = "walk";
      state.escapeBearingRad = initialBearing;
      state.outsideUnitsAccum = 0;
      state.walkLimboUnitsAccum = 0;
      state.lastLimboSectorCode = null;
      state.visitedThresholdKeys = {};
      state.wrinkleTarget = null;
      state.wrinkleChaseUnits = 0;
      state.recentWrinkleSites = [];
      state.encounters = [];
      state.sumX = 0;
      state.sumY = 0;
      state.gestureCounts = { ahead: 0, behind: 0, left: 0, right: 0, sweep_360: 0 };
      state.quoteCursor = { ahead: 0, behind: 0, left: 0, right: 0, sweep_360: 0 };
      state.witnessBucket = [];
      state.fieldFindings = [];
      state.findingSeq = 0;
      state.encounterSeq = 0;
      return getState();
    }

    function pickNextWitness() {
      if (!Array.isArray(state.witnessBucket) || state.witnessBucket.length === 0) {
        state.witnessBucket = [0, 1, 2, 3, 4, 5];
      }
      var sample = samplePlain(state.worldX, state.worldY, 220);
      var nearby = sample && Array.isArray(sample.nearbyStones) ? sample.nearbyStones : [];
      for (var i = 0; i < state.witnessBucket.length; i += 1) {
        var wIdx = state.witnessBucket[i];
        var cand = WITNESS_ROSTER[wIdx];
        for (var j = 0; j < nearby.length; j += 1) {
          if (nearby[j] && nearby[j].id === cand.preferredStoneId && (nearby[j].dist || 0) <= 170) {
            state.witnessBucket.splice(i, 1);
            return cand;
          }
        }
      }
      var nextIdx = state.witnessBucket.shift();
      return WITNESS_ROSTER[nextIdx];
    }

    function pickSpokenQuote(gestureType) {
      var pool = SPOKEN_GESTURES[gestureType] || SPOKEN_GESTURES.ahead;
      var cur = state.quoteCursor[gestureType] || 0;
      var quote = pool[cur % pool.length];
      var prev = state.encounters.length > 0 ? state.encounters[state.encounters.length - 1].spokenQuote : "";
      if (quote === prev && pool.length > 1) {
        cur += 1;
        quote = pool[cur % pool.length];
      }
      state.quoteCursor[gestureType] = cur + 1;
      return quote;
    }

    function askPasserby(plainSampler) {
      rememberSampler(plainSampler);
      var idx = state.encounters.length;
      var newCount = idx + 1;
      var slot = idx % 8;
      var witnessObj = pickNextWitness();
      var isSweep360 = false;
      var gestureType = "ahead";
      var angleRad = state.bearingRad;
      var ux = 0;
      var uy = 0;
      var curSumMag = Math.hypot(state.sumX, state.sumY);

      if (slot === 2 || slot === 7) {
        isSweep360 = true;
        gestureType = "sweep_360";
        angleRad = normalizeAngle(state.bearingRad);
        ux = 0;
        uy = 0;
      } else if (slot === 1 || slot === 4 || slot === 6 || (newCount >= 2 && curSumMag > 0.3)) {
        var cancelBase = curSumMag > 1e-5 ? Math.atan2(-state.sumY, -state.sumX) : state.bearingRad + Math.PI;
        angleRad = normalizeAngle(cancelBase + deterministicJitter(idx, 3, 0.085));
        ux = Math.cos(angleRad);
        uy = Math.sin(angleRad);
        gestureType = classifyRelativeGesture(normalizeSignedAngle(angleRad - state.bearingRad));
      } else if (slot === 3) {
        angleRad = normalizeAngle(state.bearingRad - Math.PI * 0.5 + deterministicJitter(idx, 5, 0.09));
        ux = Math.cos(angleRad);
        uy = Math.sin(angleRad);
        gestureType = "left";
      } else if (slot === 5) {
        angleRad = normalizeAngle(state.bearingRad + Math.PI + deterministicJitter(idx, 7, 0.09));
        ux = Math.cos(angleRad);
        uy = Math.sin(angleRad);
        gestureType = "behind";
      } else {
        angleRad = normalizeAngle(state.bearingRad + deterministicJitter(idx, 1, 0.1));
        ux = Math.cos(angleRad);
        uy = Math.sin(angleRad);
        gestureType = "ahead";
      }

      if (!isSweep360 && newCount >= 2) {
        var trialMag = Math.hypot(state.sumX + ux, state.sumY + uy) / newCount;
        if (trialMag >= 0.32) {
          var safeBase = curSumMag > 1e-5 ? Math.atan2(-state.sumY, -state.sumX) : state.bearingRad + Math.PI;
          angleRad = normalizeAngle(safeBase + deterministicJitter(idx, 11, 0.075));
          ux = Math.cos(angleRad);
          uy = Math.sin(angleRad);
          gestureType = classifyRelativeGesture(normalizeSignedAngle(angleRad - state.bearingRad));
        }
      }

      state.sumX += ux;
      state.sumY += uy;
      state.gestureCounts[gestureType] = (state.gestureCounts[gestureType] || 0) + 1;
      state.encounterSeq += 1;

      var spokenQuote = pickSpokenQuote(gestureType);
      var nearbyStoneLabel = pickNearbyStoneLabel(witnessObj.preferredStoneId);
      var relAngle = isSweep360 ? 0 : round4(normalizeSignedAngle(angleRad - state.bearingRad));

      var record = {
        id: "enc-" + state.encounterSeq,
        witness: witnessObj.witness,
        witnessDetail: witnessObj.detail,
        gestureType: gestureType,
        angleRad: round4(angleRad),
        relativeAngleRad: relAngle,
        ux: round4(ux),
        uy: round4(uy),
        isSweep360: isSweep360,
        arcSpanRad: isSweep360 ? round4(TAU) : 0,
        spokenQuote: spokenQuote,
        nearbyStoneLabel: nearbyStoneLabel,
        hoursAtEncounter: round4(state.hoursWalked),
        worldX: round4(state.worldX),
        worldY: round4(state.worldY),
        age: 0
      };

      state.encounters.push(record);
      if (typeof cfg.onEncounter === "function") {
        cfg.onEncounter(Object.assign({}, record));
      }
      return Object.assign({}, record);
    }

    function getEncounters() {
      return state.encounters.map(function (enc) {
        return Object.assign({}, enc);
      });
    }

    function getVectorSummary() {
      var count = state.encounters.length;
      var rawMag = Math.hypot(state.sumX, state.sumY);
      var resultantMagnitude = count > 0 ? rawMag / count : 0;
      var resultantAngleRad = count > 0 && rawMag > 1e-6 ? normalizeAngle(Math.atan2(state.sumY, state.sumX)) : 0;
      var cancellationRatio = count === 0 ? 0 : clamp(1 - resultantMagnitude, 0, 1);
      return {
        count: count,
        sumX: round4(state.sumX),
        sumY: round4(state.sumY),
        resultantAngleRad: round4(resultantAngleRad),
        resultantMagnitude: round4(resultantMagnitude),
        cancellationRatio: round4(cancellationRatio),
        centerLocatable: false,
        gestureBreakdown: {
          ahead: state.gestureCounts.ahead,
          behind: state.gestureCounts.behind,
          left: state.gestureCounts.left,
          right: state.gestureCounts.right,
          sweep_360: state.gestureCounts.sweep_360
        }
      };
    }

    function getArchStage() {
      var chosen = ARCH_STAGES.DILUTED_APPROACH;
      if (state.hoursWalked >= 4.5 || state.limbosCrossed >= 2) {
        chosen = ARCH_STAGES.OUTSIDE_LIMBO_DOUBT;
      } else if (state.hoursWalked >= 2.0 || state.wrinklesProbed >= 1) {
        chosen = ARCH_STAGES.OUTSKIRTS_OF_ITSELF;
      }
      return {
        phaseId: chosen.phaseId,
        phaseIndex: chosen.phaseIndex,
        title: chosen.title,
        reflection: chosen.reflection,
        hoursWalked: round4(state.hoursWalked),
        limbosCrossed: state.limbosCrossed,
        wrinklesProbed: state.wrinklesProbed
      };
    }

    function getTopologyInvariants() {
      var summary = getVectorSummary();
      return {
        centerLocatable: false,
        isOnlyOutskirtsOfItself: true,
        outsideConfirmed: false,
        wallsOrGatesCount: 0,
        escapedPenthesilea: false,
        gestureVectorCancelsTowardZero: true,
        hoursWalked: round4(state.hoursWalked),
        distanceKm: round4(state.distanceKm),
        limbosCrossed: state.limbosCrossed,
        wrinklesProbed: state.wrinklesProbed,
        encounterCount: summary.count,
        resultantMagnitude: summary.resultantMagnitude
      };
    }

    function getFieldFindings() {
      return state.fieldFindings.map(function (f) {
        return Object.assign({}, f);
      });
    }

    function getGestureRays() {
      var startIdx = Math.max(0, state.encounters.length - 14);
      var rays = [];
      for (var i = startIdx; i < state.encounters.length; i += 1) {
        var enc = state.encounters[i];
        var recency = (i - startIdx + 1) / Math.max(1, state.encounters.length - startIdx);
        var ageFade = clamp(1 - (enc.age || 0) * 0.035, 0.36, 1);
        rays.push({
          id: enc.id,
          gestureType: enc.gestureType,
          kind: enc.gestureType,
          angleRad: enc.angleRad,
          angle: enc.angleRad,
          ux: enc.ux,
          uy: enc.uy,
          isSweep360: enc.isSweep360,
          originX: enc.worldX,
          originY: enc.worldY,
          worldX: enc.worldX,
          worldY: enc.worldY,
          x: enc.worldX,
          y: enc.worldY,
          witness: enc.witness,
          spokenQuote: enc.spokenQuote,
          age: enc.age || 0,
          alpha: round4(0.32 + 0.68 * recency * ageFade)
        });
      }
      return rays;
    }

    function getActiveWitness() {
      if (state.encounters.length === 0) {
        return null;
      }
      var latest = state.encounters[state.encounters.length - 1];
      return {
        id: latest.id,
        witness: latest.witness,
        name: latest.witness,
        detail: latest.witnessDetail,
        gestureType: latest.gestureType,
        angleRad: latest.angleRad,
        isSweep360: latest.isSweep360,
        spokenQuote: latest.spokenQuote,
        quote: latest.spokenQuote,
        nearbyStoneLabel: latest.nearbyStoneLabel,
        worldX: latest.worldX,
        worldY: latest.worldY,
        x: latest.worldX,
        y: latest.worldY,
        age: latest.age || 0,
        active: (latest.age || 0) < 12
      };
    }

    function getState() {
      return {
        worldX: round4(state.worldX),
        worldY: round4(state.worldY),
        bearingRad: round4(state.bearingRad),
        speed: round4(state.speed),
        hoursWalked: round4(state.hoursWalked),
        distanceKm: round4(state.distanceKm),
        limbosCrossed: state.limbosCrossed,
        wrinklesProbed: state.wrinklesProbed,
        mode: state.mode,
        paused: state.paused,
        reducedMotion: state.reducedMotion,
        gestureRays: getGestureRays(),
        activeWitness: getActiveWitness(),
        archStage: getArchStage(),
        vectorSummary: getVectorSummary(),
        topologyInvariants: getTopologyInvariants()
      };
    }

    function renderCompass(target, renderOpts) {
      if (!target) {
        return;
      }
      var ctx = typeof target.getContext === "function" ? target.getContext("2d") : target;
      if (!ctx || typeof ctx.beginPath !== "function") {
        return;
      }
      var rOpts = renderOpts || {};
      var w = Number(rOpts.width) || (target.width ? target.width / (rOpts.dpr || 1) : 220);
      var h = Number(rOpts.height) || (target.height ? target.height / (rOpts.dpr || 1) : 220);
      var cx = w * 0.5;
      var cy = h * 0.5;
      var radius = Math.max(28, Math.min(w, h) * 0.41);
      var summary = getVectorSummary();

      ctx.save();
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = PALETTE.chalkHaze;
      ctx.fillRect(0, 0, w, h);

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, TAU);
      ctx.fillStyle = PALETTE.brothGround;
      ctx.fill();
      ctx.lineWidth = 1.25;
      ctx.strokeStyle = PALETTE.zincShed;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.35, 0, TAU);
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = PALETTE.plasterTooth;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = PALETTE.plasterTooth;
      ctx.stroke();

      var bx = cx + Math.cos(state.bearingRad) * radius * 0.94;
      var by = cy + Math.sin(state.bearingRad) * radius * 0.94;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(bx, by);
      ctx.strokeStyle = PALETTE.cabbageDust;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      var sweepIdx = 0;
      for (var i = 0; i < state.encounters.length; i += 1) {
        var enc = state.encounters[i];
        var isNewest = i === state.encounters.length - 1;
        if (enc.isSweep360) {
          var sRad = radius * (0.62 + (sweepIdx % 3) * 0.11);
          sweepIdx += 1;
          ctx.beginPath();
          ctx.arc(cx, cy, sRad, 0, TAU);
          ctx.setLineDash([5, 4]);
          ctx.strokeStyle = PALETTE.tollOchre;
          ctx.lineWidth = isNewest ? 2.0 : 1.15;
          ctx.stroke();
          ctx.setLineDash([]);
        } else {
          var ex = cx + enc.ux * radius * 0.84;
          var ey = cy + enc.uy * radius * 0.84;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(ex, ey);
          ctx.strokeStyle = isNewest ? PALETTE.cinderInk : PALETTE.zincShed;
          ctx.lineWidth = isNewest ? 2.1 : 1.2;
          ctx.stroke();
          var headAng = enc.angleRad;
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - Math.cos(headAng - 0.42) * 6.5, ey - Math.sin(headAng - 0.42) * 6.5);
          ctx.lineTo(ex - Math.cos(headAng + 0.42) * 6.5, ey - Math.sin(headAng + 0.42) * 6.5);
          ctx.closePath();
          ctx.fillStyle = isNewest ? PALETTE.cinderInk : PALETTE.zincShed;
          ctx.fill();
        }
      }

      if (summary.count > 0) {
        var rx = cx + (summary.sumX / summary.count) * radius * 0.84;
        var ry = cy + (summary.sumY / summary.count) * radius * 0.84;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(rx, ry);
        ctx.strokeStyle = PALETTE.wheelRust;
        ctx.lineWidth = 2.6;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rx, ry, 3.6, 0, TAU);
        ctx.fillStyle = PALETTE.wheelRust;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(cx, cy, 3.2, 0, TAU);
      ctx.fillStyle = PALETTE.cinderInk;
      ctx.fill();
      ctx.restore();
    }

    var controller = {
      update: update,
      walkBearing: walkBearing,
      stepSeekCenter: stepSeekCenter,
      stepSeekOutside: stepSeekOutside,
      setBearing: setBearing,
      setMode: setMode,
      setPaused: setPaused,
      setReducedMotion: setReducedMotion,
      resetJourney: resetJourney,
      askPasserby: askPasserby,
      getEncounters: getEncounters,
      getVectorSummary: getVectorSummary,
      getArchStage: getArchStage,
      getTopologyInvariants: getTopologyInvariants,
      getFieldFindings: getFieldFindings,
      getGestureRays: getGestureRays,
      getActiveWitness: getActiveWitness,
      getState: getState,
      renderCompass: renderCompass
    };

    Object.defineProperties(controller, {
      worldX: { enumerable: true, get: function () { return round4(state.worldX); } },
      worldY: { enumerable: true, get: function () { return round4(state.worldY); } },
      bearingRad: { enumerable: true, get: function () { return round4(state.bearingRad); } },
      speed: { enumerable: true, get: function () { return round4(state.speed); } },
      hoursWalked: { enumerable: true, get: function () { return round4(state.hoursWalked); } },
      distanceKm: { enumerable: true, get: function () { return round4(state.distanceKm); } },
      limbosCrossed: { enumerable: true, get: function () { return state.limbosCrossed; } },
      wrinklesProbed: { enumerable: true, get: function () { return state.wrinklesProbed; } },
      mode: { enumerable: true, get: function () { return state.mode; } },
      paused: { enumerable: true, get: function () { return state.paused; } },
      reducedMotion: { enumerable: true, get: function () { return state.reducedMotion; } },
      gestureRays: { enumerable: true, get: getGestureRays },
      activeWitness: { enumerable: true, get: getActiveWitness }
    });

    return controller;
  }

  root.PenthesileaGestureField = {
    PALETTE: PALETTE,
    CANONICAL_STONE_LABELS: CANONICAL_STONE_LABELS,
    WITNESS_ROSTER: WITNESS_ROSTER,
    GESTURE_TYPES: GESTURE_TYPES,
    SPOKEN_GESTURES: SPOKEN_GESTURES,
    ARCH_STAGES: ARCH_STAGES,
    create: create
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
