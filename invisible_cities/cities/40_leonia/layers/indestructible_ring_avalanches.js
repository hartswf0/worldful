/*
 * City 40: Leonia (Continuous Cities 1)
 * Layer: Indestructible Crater Cuirass, Neighboring Refuse Rollers & Cataclysmic Avalanches
 * Strictly standalone ES6 IIFE — zero external imports, zero network dependencies.
 */
globalThis.LeoniaScarpAvalanches = (function () {
  "use strict";

  const PALETTE = Object.freeze({
    dawn_gleam_ivory: "#f6f3ea",
    fresh_linen_cyan: "#d7eef2",
    soap_pearl_mint: "#9fd8cb",
    angelic_gold: "#d8ae5e",
    plastic_bag_obsidian: "#181b20",
    scarp_slate_cuirass: "#363b45",
    porcelain_cobalt: "#4d7498",
    rust_tin_ochre: "#b85d38",
    tire_ash_charcoal: "#23262d",
    cataclysm_crimson: "#c93b2b",
    ink_parchment: "#111318"
  });

  const DECOMPOSITION_RATE = 0;
  const CRITICAL_REPOSE_ANGLE_DEG = 38.0;

  const LEONIA_RELIC_TYPES = Object.freeze([
    "burned_lightbulbs",
    "rollerskates",
    "bound_encyclopedias",
    "grand_pianos",
    "porcelain_services",
    "cast_iron_boilers",
    "squeezed_toothpaste",
    "plastic_wrappings"
  ]);

  const FOREIGN_RELIC_TYPES = Object.freeze([
    "flattened_tin_cans",
    "burst_old_tires",
    "unmated_old_shoes",
    "frayed_straw_flasks"
  ]);

  const NEIGHBOR_CITY_NAMES = Object.freeze([
    "North Tin-Can Roller",
    "Northeast Burst-Tire Glacier",
    "Southeast Unmated-Shoe Moraine",
    "South Straw-Flask Bulwark",
    "Southwest Crushed-Drum Scarp",
    "Northwest Tread-&-Sole Vice"
  ]);

  const NEIGHBOR_CITIES = Object.freeze([
    Object.freeze({
      id: "north_tin_roller",
      name: "North Tin-Can Roller",
      shortLabel: "N TIN-CAN ROLLER",
      bearingDeg: -90,
      primaryRelic: "flattened_tin_cans",
      relics: FOREIGN_RELIC_TYPES,
      tint: "#b85d38",
      toString() { return this.name; }
    }),
    Object.freeze({
      id: "northeast_tire_glacier",
      name: "Northeast Burst-Tire Glacier",
      shortLabel: "NE TIRE GLACIER",
      bearingDeg: -30,
      primaryRelic: "burst_old_tires",
      relics: FOREIGN_RELIC_TYPES,
      tint: "#2e333d",
      toString() { return this.name; }
    }),
    Object.freeze({
      id: "southeast_shoe_moraine",
      name: "Southeast Unmated-Shoe Moraine",
      shortLabel: "SE SHOE MORAINE",
      bearingDeg: 30,
      primaryRelic: "unmated_old_shoes",
      relics: FOREIGN_RELIC_TYPES,
      tint: "#6d4c3d",
      toString() { return this.name; }
    }),
    Object.freeze({
      id: "south_flask_bulwark",
      name: "South Straw-Flask Bulwark",
      shortLabel: "S STRAW-FLASK",
      bearingDeg: 90,
      primaryRelic: "frayed_straw_flasks",
      relics: FOREIGN_RELIC_TYPES,
      tint: "#9c7d46",
      toString() { return this.name; }
    }),
    Object.freeze({
      id: "southwest_drum_scarp",
      name: "Southwest Crushed-Drum Scarp",
      shortLabel: "SW DRUM SCARP",
      bearingDeg: 150,
      primaryRelic: "flattened_tin_cans",
      relics: FOREIGN_RELIC_TYPES,
      tint: "#8f4c32",
      toString() { return this.name; }
    }),
    Object.freeze({
      id: "northwest_tread_vice",
      name: "Northwest Tread-&-Sole Vice",
      shortLabel: "NW TREAD-&-SOLE",
      bearingDeg: -150,
      primaryRelic: "burst_old_tires",
      relics: FOREIGN_RELIC_TYPES,
      tint: "#39414e",
      toString() { return this.name; }
    })
  ]);

  const RELIC_LABELS = Object.freeze({
    burned_lightbulbs: "Burned-Out Lightbulbs",
    rollerskates: "Soldered Rollerskates",
    bound_encyclopedias: "Bound Encyclopedias",
    grand_pianos: "Discarded Grand Pianos",
    porcelain_services: "Cobalt Porcelain Services",
    cast_iron_boilers: "Cast-Iron Boilers",
    squeezed_toothpaste: "Squeezed Toothpaste Tubes",
    plastic_wrappings: "Sealed Obsidian Wrappings",
    flattened_tin_cans: "Flattened Foreign Tin Cans",
    burst_old_tires: "Burst Neighboring Tires",
    unmated_old_shoes: "Unmated Old Shoes",
    frayed_straw_flasks: "Frayed Straw-Woven Flasks"
  });

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function degToRad(deg) {
    return (deg * Math.PI) / 180;
  }

  function createRng(seed) {
    let s = (seed >>> 0) || 1;
    return function nextRng() {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function drawRelicGlyph(ctx, kind, x, y, sz, rot, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot || 0);
    ctx.globalAlpha = alpha == null ? 0.9 : alpha;
    ctx.lineWidth = Math.max(1, sz * 0.13);
    if (kind === "grand_pianos") {
      ctx.fillStyle = "#181b20";
      ctx.strokeStyle = "#d8ae5e";
      ctx.beginPath();
      ctx.moveTo(-sz * 0.85, sz * 0.55);
      ctx.lineTo(-sz * 0.85, -sz * 0.55);
      ctx.quadraticCurveTo(sz * 0.15, -sz * 0.65, sz * 0.35, -sz * 0.08);
      ctx.quadraticCurveTo(sz * 0.9, sz * 0.05, sz * 0.78, sz * 0.55);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#f6f3ea";
      ctx.fillRect(-sz * 0.76, sz * 0.28, sz * 1.25, sz * 0.2);
    } else if (kind === "cast_iron_boilers") {
      ctx.fillStyle = "#363b45";
      ctx.strokeStyle = "#b85d38";
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(-sz * 0.7, -sz * 0.48, sz * 1.4, sz * 0.96, sz * 0.25) : ctx.rect(-sz * 0.7, -sz * 0.48, sz * 1.4, sz * 0.96);
      ctx.fill();
      ctx.stroke();
      ctx.fillRect(-sz * 0.2, -sz * 0.82, sz * 0.36, sz * 0.36);
    } else if (kind === "rollerskates") {
      ctx.fillStyle = "#4d7498";
      ctx.strokeStyle = "#f6f3ea";
      ctx.beginPath();
      ctx.moveTo(-sz * 0.6, -sz * 0.65);
      ctx.lineTo(-sz * 0.1, -sz * 0.65);
      ctx.lineTo(sz * 0.05, -sz * 0.1);
      ctx.lineTo(sz * 0.7, sz * 0.08);
      ctx.lineTo(sz * 0.7, sz * 0.34);
      ctx.lineTo(-sz * 0.65, sz * 0.34);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#d8ae5e";
      ctx.beginPath();
      ctx.arc(-sz * 0.38, sz * 0.56, sz * 0.2, 0, Math.PI * 2);
      ctx.arc(sz * 0.38, sz * 0.56, sz * 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (kind === "porcelain_services") {
      ctx.fillStyle = "#f6f3ea";
      ctx.strokeStyle = "#4d7498";
      ctx.beginPath();
      ctx.ellipse(0, sz * 0.08, sz * 0.72, sz * 0.44, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -sz * 0.38, sz * 0.16, 0, Math.PI * 2);
      ctx.stroke();
    } else if (kind === "bound_encyclopedias") {
      ctx.fillStyle = "#4d7498";
      ctx.strokeStyle = "#d8ae5e";
      ctx.fillRect(-sz * 0.75, -sz * 0.52, sz * 1.5, sz * 0.32);
      ctx.strokeRect(-sz * 0.75, -sz * 0.52, sz * 1.5, sz * 0.32);
      ctx.fillStyle = "#6b382a";
      ctx.fillRect(-sz * 0.68, -sz * 0.12, sz * 1.4, sz * 0.34);
      ctx.strokeRect(-sz * 0.68, -sz * 0.12, sz * 1.4, sz * 0.34);
    } else if (kind === "burned_lightbulbs") {
      ctx.fillStyle = "rgba(215, 238, 242, 0.75)";
      ctx.strokeStyle = "#9fd8cb";
      ctx.beginPath();
      ctx.arc(0, -sz * 0.18, sz * 0.48, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#d8ae5e";
      ctx.fillRect(-sz * 0.22, sz * 0.26, sz * 0.44, sz * 0.36);
    } else if (kind === "flattened_tin_cans") {
      ctx.fillStyle = "#b85d38";
      ctx.strokeStyle = "#f6f3ea";
      ctx.beginPath();
      ctx.ellipse(0, 0, sz * 0.82, sz * 0.36, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-sz * 0.5, -sz * 0.1);
      ctx.lineTo(sz * 0.5, sz * 0.1);
      ctx.stroke();
    } else if (kind === "burst_old_tires") {
      ctx.strokeStyle = "#181b20";
      ctx.lineWidth = Math.max(2, sz * 0.36);
      ctx.beginPath();
      ctx.arc(0, 0, sz * 0.58, 0.35, Math.PI * 1.82);
      ctx.stroke();
      ctx.strokeStyle = "#8a929e";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, sz * 0.58, 0.4, Math.PI * 1.75);
      ctx.stroke();
    } else if (kind === "unmated_old_shoes") {
      ctx.fillStyle = "#5b3f31";
      ctx.strokeStyle = "#d8ae5e";
      ctx.beginPath();
      ctx.moveTo(-sz * 0.72, -sz * 0.38);
      ctx.lineTo(-sz * 0.15, -sz * 0.38);
      ctx.lineTo(sz * 0.2, sz * 0.05);
      ctx.quadraticCurveTo(sz * 0.82, sz * 0.08, sz * 0.76, sz * 0.42);
      ctx.lineTo(-sz * 0.72, sz * 0.42);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (kind === "frayed_straw_flasks") {
      ctx.fillStyle = "#c49e59";
      ctx.strokeStyle = "#4d7498";
      ctx.beginPath();
      ctx.ellipse(0, sz * 0.18, sz * 0.58, sz * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillRect(-sz * 0.16, -sz * 0.65, sz * 0.32, sz * 0.42);
    } else {
      ctx.fillStyle = "#181b20";
      ctx.strokeStyle = "#9fd8cb";
      ctx.beginPath();
      ctx.arc(0, 0, sz * 0.52, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  const STRATA_TINTS = Object.freeze([
    { fill: "#363b45", rim: "#9fd8cb", weld: "#d8ae5e" },
    { fill: "#2c3848", rim: "#4d7498", weld: "#f6f3ea" },
    { fill: "#3d3538", rim: "#b85d38", weld: "#d8ae5e" },
    { fill: "#232831", rim: "#d7eef2", weld: "#9fd8cb" },
    { fill: "#404856", rim: "#d8ae5e", weld: "#4d7498" }
  ]);

  function buildStratum(index, dayIndex, baseElev, topElev, tonnes, skillLevel, customRelics) {
    const rng = createRng(4001 + dayIndex * 137 + skillLevel * 31);
    const paletteEntry = STRATA_TINTS[index % STRATA_TINTS.length];
    const chosenRelics = [];
    const pool = Array.isArray(customRelics) && customRelics.length ? customRelics : LEONIA_RELIC_TYPES;
    for (let i = 0; i < 4; i++) {
      const candidate = pool[(index * 3 + i * 2) % pool.length];
      const relicId = typeof candidate === "string" ? candidate : (candidate && (candidate.relicType || candidate.id)) || LEONIA_RELIC_TYPES[i];
      chosenRelics.push(LEONIA_RELIC_TYPES.includes(relicId) ? relicId : LEONIA_RELIC_TYPES[(index + i) % LEONIA_RELIC_TYPES.length]);
    }
    const ringNodes = [];
    const nodeCount = 10 + (skillLevel % 3) * 2;
    for (let n = 0; n < nodeCount; n++) {
      ringNodes.push({
        angle: (n / nodeCount) * Math.PI * 2 + rng() * 0.18,
        radialJitter: (rng() - 0.5) * 0.28,
        rot: (rng() - 0.5) * 1.7,
        relic: chosenRelics[n % chosenRelics.length]
      });
    }
    return Object.freeze({
      id: "stratum_day_" + dayIndex,
      index,
      dayIndex,
      baseElevationMeters: Number(baseElev.toFixed(3)),
      topElevationMeters: Number(topElev.toFixed(3)),
      thicknessMeters: Number((topElev - baseElev).toFixed(3)),
      tonnes: Number(tonnes.toFixed(2)),
      materialSkillLevel: skillLevel,
      decompositionRate: DECOMPOSITION_RATE,
      soldered: true,
      fill: paletteEntry.fill,
      rim: paletteEntry.rim,
      weld: paletteEntry.weld,
      relics: Object.freeze(chosenRelics),
      ringNodes: Object.freeze(ringNodes),
      inscription: dayIndex === 1
        ? "Foundational Soldered Cuirass (Day I)"
        : "Day " + dayIndex + " Indestructible Scale (Tier " + skillLevel + ")"
    });
  }

  function computeSlopeAngleDeg(elevMeters, skillLevel, convRatio, overthrust) {
    const dElev = Math.max(0, elevMeters - 14.0);
    const dConv = Math.max(-0.18, convRatio - 0.18);
    const dSkill = Math.max(0, skillLevel - 1);
    const thrust = Math.max(0, overthrust || 0);
    const angle = 21.5 + dElev * 0.34 + dConv * 9.2 + dSkill * 0.95 + thrust * 6.5;
    return Number(clamp(angle, 18.0, 56.0).toFixed(2));
  }

  const AVALANCHE_RELIC_POOL = Object.freeze([
    "flattened_tin_cans",
    "burst_old_tires",
    "unmated_old_shoes",
    "frayed_straw_flasks",
    "grand_pianos",
    "porcelain_services",
    "rollerskates",
    "cast_iron_boilers"
  ]);

  function createScarpEngine(opts) {
    const cfg = opts || {};
    const onStrataAdded = typeof cfg.onStrataAdded === "function" ? cfg.onStrataAdded : null;
    const onCataclysmLandslide = typeof cfg.onCataclysmLandslide === "function" ? cfg.onCataclysmLandslide : null;

    const state = {
      width: Number(cfg.width) || 960,
      height: Number(cfg.height) || 640,
      reducedMotion: Boolean(cfg.reducedMotion),
      decompositionRate: DECOMPOSITION_RATE,
      dayCount: 1,
      materialSkillLevel: 1,
      craterElevationMeters: 14.0,
      elevationHistory: [14.0],
      neighborPressureActive: true,
      neighborConvergenceRatio: 0.18,
      neighborOverthrust: 0,
      slopeAngleDeg: 21.5,
      criticalReposeAngleDeg: CRITICAL_REPOSE_ANGLE_DEG,
      crossSectionMode: false,
      landslideTriggered: false,
      effacedRatio: 0,
      metropolisEffaced: false,
      totalDepositedTonnes: 42,
      strataLayers: [],
      avalancheDebris: [],
      clockSec: 0,
      decayRepelFlash: 0,
      rollerSurgeFlash: 0
    };

    function _seedInitialState(keepCrossSection) {
      const preserveX = keepCrossSection ? state.crossSectionMode : false;
      state.decompositionRate = DECOMPOSITION_RATE;
      state.dayCount = 1;
      state.materialSkillLevel = 1;
      state.craterElevationMeters = 14.0;
      state.elevationHistory = [14.0];
      state.neighborPressureActive = true;
      state.neighborConvergenceRatio = 0.18;
      state.neighborOverthrust = 0;
      state.slopeAngleDeg = 21.5;
      state.criticalReposeAngleDeg = CRITICAL_REPOSE_ANGLE_DEG;
      state.crossSectionMode = preserveX;
      state.landslideTriggered = false;
      state.effacedRatio = 0;
      state.metropolisEffaced = false;
      state.totalDepositedTonnes = 42;
      state.strataLayers = [
        buildStratum(0, 1, 0, 14.0, 42, 1, [
          "rollerskates",
          "burned_lightbulbs",
          "cast_iron_boilers",
          "porcelain_services"
        ])
      ];
      state.avalancheDebris = [];
      state.decayRepelFlash = 0;
      state.rollerSurgeFlash = 0;
    }

    _seedInitialState(false);

    function getState() {
      return {
        decompositionRate: DECOMPOSITION_RATE,
        dayCount: state.dayCount,
        materialSkillLevel: state.materialSkillLevel,
        craterElevationMeters: state.craterElevationMeters,
        elevationHistory: state.elevationHistory.slice(),
        neighborPressureActive: state.neighborPressureActive,
        neighborConvergenceRatio: state.neighborConvergenceRatio,
        slopeAngleDeg: state.slopeAngleDeg,
        criticalReposeAngleDeg: CRITICAL_REPOSE_ANGLE_DEG,
        crossSectionMode: state.crossSectionMode,
        landslideTriggered: state.landslideTriggered,
        effacedRatio: state.effacedRatio,
        metropolisEffaced: state.metropolisEffaced,
        totalDepositedTonnes: state.totalDepositedTonnes,
        strataCount: state.strataLayers.length,
        strataLayers: state.strataLayers.slice(),
        neighborCities: NEIGHBOR_CITIES,
        reducedMotion: state.reducedMotion
      };
    }

    function _spawnAvalancheDebris() {
      const rng = createRng(9040 + state.dayCount * 73);
      const items = [];
      for (let i = 0; i < 88; i++) {
        const sector = i % NEIGHBOR_CITIES.length;
        const baseBearing = degToRad(NEIGHBOR_CITIES[sector].bearingDeg);
        items.push({
          id: "debris_" + i,
          relic: AVALANCHE_RELIC_POOL[i % AVALANCHE_RELIC_POOL.length],
          angle: baseBearing + (rng() - 0.5) * 0.98,
          side: i % 2 === 0 ? -1 : 1,
          startFrac: 0.92 + rng() * 0.25,
          endFrac: rng() * 0.52,
          progress: state.reducedMotion ? 1.0 : rng() * 0.16,
          speed: 0.42 + rng() * 0.46,
          size: 5.5 + rng() * 5.8,
          rot: rng() * Math.PI * 2,
          spin: (rng() - 0.5) * 4.2
        });
      }
      state.avalancheDebris = items;
    }

    function _startCataclysm() {
      if (state.landslideTriggered) return;
      state.landslideTriggered = true;
      _spawnAvalancheDebris();
      if (state.reducedMotion) {
        state.effacedRatio = 1.0;
        state.metropolisEffaced = true;
      } else {
        state.effacedRatio = Math.max(state.effacedRatio, 0.08);
      }
      if (onCataclysmLandslide) {
        onCataclysmLandslide(getState());
      }
    }

    function _refreshSlopeAndCheckFailure() {
      state.slopeAngleDeg = computeSlopeAngleDeg(
        state.craterElevationMeters,
        state.materialSkillLevel,
        state.neighborConvergenceRatio,
        state.neighborOverthrust
      );
      if (state.slopeAngleDeg >= CRITICAL_REPOSE_ANGLE_DEG && !state.landslideTriggered) {
        _startCataclysm();
      }
    }

    function depositDailyRefuse(exportPacket) {
      const pkt = exportPacket || {};
      const skill = clamp(Math.round(Number(pkt.materialSkillLevel) || state.materialSkillLevel || 1), 1, 5);
      const tonnes = Math.max(1, Number(pkt.exportedTonnes) || 42);
      state.materialSkillLevel = skill;
      state.dayCount = typeof pkt.dayIndex === "number" && pkt.dayIndex > state.dayCount
        ? Math.round(pkt.dayIndex)
        : state.dayCount + 1;
      state.decompositionRate = DECOMPOSITION_RATE;

      const elevationGain = 2.4 + skill * 0.85 + tonnes * 0.015;
      const prevElevation = state.craterElevationMeters;
      const candidateElev = Number((prevElevation + elevationGain).toFixed(3));
      const nextElevation = candidateElev > prevElevation ? candidateElev : Number((prevElevation + 2.4).toFixed(3));

      const stratum = buildStratum(
        state.strataLayers.length,
        state.dayCount,
        prevElevation,
        nextElevation,
        tonnes,
        skill,
        pkt.relics
      );
      state.strataLayers.push(stratum);
      state.craterElevationMeters = nextElevation;
      state.elevationHistory.push(nextElevation);
      state.totalDepositedTonnes = Number((state.totalDepositedTonnes + tonnes).toFixed(2));

      if (state.neighborPressureActive) {
        state.neighborConvergenceRatio = Number(Math.min(1.0, state.neighborConvergenceRatio + 0.085).toFixed(4));
      }
      _refreshSlopeAndCheckFailure();
      if (onStrataAdded) {
        onStrataAdded(stratum, getState());
      }
      return getState();
    }

    function setMaterialSkillLevel(level) {
      state.materialSkillLevel = clamp(Math.round(Number(level) || 1), 1, 5);
      _refreshSlopeAndCheckFailure();
      return getState();
    }

    function setNeighborPressure(flag) {
      state.neighborPressureActive = Boolean(flag);
      return state.neighborPressureActive;
    }

    function toggleNeighborPressure(force) {
      state.neighborPressureActive = typeof force === "boolean" ? force : !state.neighborPressureActive;
      return state.neighborPressureActive;
    }

    function pushNeighborRollers(delta) {
      const d = typeof delta === "number" ? delta : 0.14;
      state.neighborConvergenceRatio = Number(clamp(state.neighborConvergenceRatio + d, 0, 1).toFixed(4));
      if (d > 0) {
        state.neighborOverthrust = Number((state.neighborOverthrust + d * 0.85).toFixed(4));
      }
      state.rollerSurgeFlash = 1.0;
      _refreshSlopeAndCheckFailure();
      return getState();
    }

    function attemptDecay() {
      state.decompositionRate = DECOMPOSITION_RATE;
      state.decayRepelFlash = 1.0;
      return { decayedTonnes: 0, decompositionRate: DECOMPOSITION_RATE };
    }

    function setCrossSectionMode(flag) {
      state.crossSectionMode = Boolean(flag);
      return state.crossSectionMode;
    }

    function toggleCrossSectionMode(force) {
      state.crossSectionMode = typeof force === "boolean" ? force : !state.crossSectionMode;
      return state.crossSectionMode;
    }

    function setReducedMotion(flag) {
      state.reducedMotion = Boolean(flag);
      if (state.reducedMotion && state.landslideTriggered) {
        state.effacedRatio = 1.0;
        state.metropolisEffaced = true;
      }
    }

    function reset() {
      _seedInitialState(false);
      return getState();
    }

    function step(dt) {
      const raw = Number(dt);
      const dtSec = !raw || raw < 0 ? 0.016 : raw > 5 ? Math.min(0.1, raw / 1000) : Math.min(2.0, raw);
      if (!state.reducedMotion) {
        state.clockSec += dtSec;
      }
      state.decayRepelFlash = Math.max(0, state.decayRepelFlash - dtSec * 1.4);
      state.rollerSurgeFlash = Math.max(0, state.rollerSurgeFlash - dtSec * 1.6);
      if (state.landslideTriggered) {
        if (state.reducedMotion) {
          state.effacedRatio = 1.0;
        } else {
          state.effacedRatio = Number(Math.min(1.0, state.effacedRatio + dtSec * 0.44).toFixed(4));
          for (let i = 0; i < state.avalancheDebris.length; i++) {
            const b = state.avalancheDebris[i];
            b.progress = Math.min(1.0, b.progress + dtSec * b.speed);
            b.rot += dtSec * b.spin;
          }
        }
        if (state.effacedRatio >= 1.0) {
          state.metropolisEffaced = true;
        }
      }
    }

    function _computeGeometry(viewport) {
      const width = Math.max(240, Number((viewport && viewport.width) || state.width || 960));
      const height = Math.max(240, Number((viewport && viewport.height) || state.height || 640));
      state.width = width;
      state.height = height;
      const cx = Math.round(width * 0.5);
      const cy = Math.round(height * 0.5);
      const minDim = Math.min(width, height);
      const squeeze = clamp((state.neighborConvergenceRatio - 0.18) * 0.16 + (state.craterElevationMeters - 14) * 0.0018, 0, 0.22);
      const coreRadius = Math.round(Math.max(52, minDim * (0.232 - squeeze * 0.22)));
      const scarpOuterR = Math.round(coreRadius + Math.min(minDim * 0.175, 28 + state.strataLayers.length * 9.5));
      const rollerMaxR = Math.round(minDim * 0.485);
      const rollerFrontR = Math.round(
        scarpOuterR + (rollerMaxR - scarpOuterR) * (1 - clamp(state.neighborConvergenceRatio * 0.86, 0.08, 0.92))
      );
      const basinFloorY = Math.round(height * 0.77);
      const basinHalfWidth = Math.round(Math.max(52, Math.min(width * 0.175, 146) * (1 - squeeze * 0.45)));
      return {
        width,
        height,
        cx,
        cy,
        minDim,
        coreRadius,
        scarpOuterR,
        rollerMaxR,
        rollerFrontR,
        basinFloorY,
        basinHalfWidth,
        coreBounds: {
          cx,
          cy,
          coreRadius,
          width,
          height,
          crossSectionMode: state.crossSectionMode,
          basinFloorY,
          basinHalfWidth,
          effacedRatio: state.effacedRatio
        }
      };
    }

    function _drawArrow(ctx, x1, y1, x2, y2, color, headLen) {
      const ang = Math.atan2(y2 - y1, x2 - x1);
      const hl = headLen || 7;
      ctx.save();
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - hl * Math.cos(ang - 0.45), y2 - hl * Math.sin(ang - 0.45));
      ctx.lineTo(x2 - hl * Math.cos(ang + 0.45), y2 - hl * Math.sin(ang + 0.45));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function _renderPlanView(ctx, g) {
      const bg = ctx.createRadialGradient(g.cx, g.cy, g.coreRadius * 0.4, g.cx, g.cy, Math.max(g.width, g.height) * 0.72);
      bg.addColorStop(0, "#252b35");
      bg.addColorStop(0.55, "#181b20");
      bg.addColorStop(1, "#111318");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, g.width, g.height);

      const pulse = state.neighborPressureActive ? Math.sin(state.clockSec * 2.3) * 2.5 : 0;
      const frontR = Math.max(g.scarpOuterR + 4, g.rollerFrontR - pulse);
      const outerR = Math.max(frontR + 28, g.rollerMaxR * 1.08);

      for (let s = 0; s < NEIGHBOR_CITIES.length; s++) {
        const city = NEIGHBOR_CITIES[s];
        const midA = degToRad(city.bearingDeg);
        const span = degToRad(26.5);
        ctx.save();
        ctx.beginPath();
        ctx.arc(g.cx, g.cy, outerR, midA - span, midA + span, false);
        ctx.arc(g.cx, g.cy, frontR, midA + span, midA - span, true);
        ctx.closePath();
        ctx.fillStyle = city.tint;
        ctx.globalAlpha = 0.74 + state.rollerSurgeFlash * 0.2;
        ctx.fill();
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = state.slopeAngleDeg >= 34 ? PALETTE.cataclysm_crimson : PALETTE.rust_tin_ochre;
        ctx.stroke();

        for (let r = 1; r <= 3; r++) {
          const ribR = frontR + ((outerR - frontR) * r) / 4;
          ctx.beginPath();
          ctx.arc(g.cx, g.cy, ribR, midA - span * 0.88, midA + span * 0.88);
          ctx.strokeStyle = "rgba(246, 243, 234, 0.18)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        for (let k = 0; k < 5; k++) {
          const a = midA + (k - 2) * (span * 0.38);
          const rr = frontR + (outerR - frontR) * (0.28 + ((k * 37 + s * 19) % 50) / 100);
          const relicKind = FOREIGN_RELIC_TYPES[(s + k) % FOREIGN_RELIC_TYPES.length];
          drawRelicGlyph(ctx, relicKind, g.cx + Math.cos(a) * rr, g.cy + Math.sin(a) * rr, 6.2, a + 1.57, 0.88);
        }

        const arrowColor = state.neighborPressureActive
          ? (state.slopeAngleDeg >= 35 ? PALETTE.cataclysm_crimson : PALETTE.angelic_gold)
          : "#6f7785";
        const ax1 = g.cx + Math.cos(midA) * (outerR - 8);
        const ay1 = g.cy + Math.sin(midA) * (outerR - 8);
        const ax2 = g.cx + Math.cos(midA) * (frontR + 5);
        const ay2 = g.cy + Math.sin(midA) * (frontR + 5);
        _drawArrow(ctx, ax1, ay1, ax2, ay2, arrowColor, 7);

        if (g.minDim >= 360) {
          const lx = g.cx + Math.cos(midA) * (outerR - 14);
          const ly = g.cy + Math.sin(midA) * (outerR - 14);
          ctx.fillStyle = PALETTE.dawn_gleam_ivory;
          ctx.font = "600 9px monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(city.shortLabel, lx, ly);
        }
        ctx.restore();
      }

      const layers = state.strataLayers;
      const total = layers.length;
      for (let i = 0; i < total; i++) {
        const st = layers[i];
        const tOuter = (total - i) / total;
        const tInner = (total - i - 1) / total;
        const rOut = g.coreRadius + (g.scarpOuterR - g.coreRadius) * Math.pow(tOuter, 0.88);
        const rIn = g.coreRadius + (g.scarpOuterR - g.coreRadius) * Math.pow(tInner, 0.88);
        const facets = 20;
        ctx.save();
        ctx.beginPath();
        for (let f = 0; f <= facets; f++) {
          const a = (f / facets) * Math.PI * 2;
          const jag = 1 + Math.sin(f * 3.7 + st.dayIndex) * 0.025;
          const px = g.cx + Math.cos(a) * rOut * jag;
          const py = g.cy + Math.sin(a) * rOut * jag;
          if (f === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fillStyle = st.fill;
        ctx.fill();
        ctx.lineWidth = state.decayRepelFlash > 0 ? 2.4 : 1.35;
        ctx.strokeStyle = state.decayRepelFlash > 0 ? PALETTE.soap_pearl_mint : st.rim;
        ctx.stroke();

        const midR = (rOut + rIn) * 0.5;
        for (let n = 0; n < st.ringNodes.length; n++) {
          const nd = st.ringNodes[n];
          const rr = midR + nd.radialJitter * Math.max(3, rOut - rIn);
          drawRelicGlyph(
            ctx,
            nd.relic,
            g.cx + Math.cos(nd.angle) * rr,
            g.cy + Math.sin(nd.angle) * rr,
            clamp((rOut - rIn) * 0.42, 4.2, 7.8),
            nd.rot,
            0.9
          );
        }
        ctx.restore();
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(g.cx, g.cy, g.coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#161a21";
      ctx.fill();
      ctx.lineWidth = 2.2;
      ctx.strokeStyle = state.landslideTriggered ? PALETTE.cataclysm_crimson : PALETTE.angelic_gold;
      ctx.stroke();
      ctx.restore();

      if (state.landslideTriggered) {
        _renderPlanAvalanche(ctx, g);
      }
    }

    function _renderPlanAvalanche(ctx, g) {
      ctx.save();
      for (let s = 0; s < 6; s++) {
        const a = degToRad(NEIGHBOR_CITIES[s].bearingDeg);
        const reach = g.scarpOuterR - (g.scarpOuterR - g.coreRadius * 0.25) * state.effacedRatio;
        ctx.beginPath();
        ctx.moveTo(g.cx + Math.cos(a - 0.24) * g.scarpOuterR, g.cy + Math.sin(a - 0.24) * g.scarpOuterR);
        ctx.lineTo(g.cx + Math.cos(a) * reach, g.cy + Math.sin(a) * reach);
        ctx.lineTo(g.cx + Math.cos(a + 0.24) * g.scarpOuterR, g.cy + Math.sin(a + 0.24) * g.scarpOuterR);
        ctx.closePath();
        ctx.fillStyle = "rgba(201, 59, 43, 0.32)";
        ctx.fill();
      }
      for (let i = 0; i < state.avalancheDebris.length; i++) {
        const b = state.avalancheDebris[i];
        const p = Math.max(b.progress, state.effacedRatio * 0.85);
        const r = g.scarpOuterR * b.startFrac * (1 - p) + g.coreRadius * b.endFrac * p;
        drawRelicGlyph(
          ctx,
          b.relic,
          g.cx + Math.cos(b.angle) * r,
          g.cy + Math.sin(b.angle) * r,
          b.size,
          b.rot,
          0.95
        );
      }
      ctx.restore();
    }

    function _renderCrossSectionView(ctx, g) {
      const sky = ctx.createLinearGradient(0, 0, 0, g.basinFloorY);
      sky.addColorStop(0, "#111318");
      sky.addColorStop(0.58, "#1f2a36");
      sky.addColorStop(1, "rgba(215, 238, 242, 0.22)");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, g.width, g.height);

      ctx.fillStyle = "#14171d";
      ctx.fillRect(0, g.basinFloorY, g.width, g.height - g.basinFloorY);
      ctx.strokeStyle = PALETTE.angelic_gold;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, g.basinFloorY);
      ctx.lineTo(g.width, g.basinFloorY);
      ctx.stroke();

      const floorY = g.basinFloorY;
      const leftToeX = g.cx - g.basinHalfWidth;
      const rightToeX = g.cx + g.basinHalfWidth;
      const maxWallPx = Math.max(90, floorY - Math.max(52, g.height * 0.14));
      const elevNorm = clamp((state.craterElevationMeters - 8) / 50, 0.22, 0.96);
      const wallH = Math.round(maxWallPx * elevNorm);
      const slopeRad = degToRad(state.slopeAngleDeg);
      const sideSpan = Math.max(48, leftToeX - 18);
      const runPx = clamp(wallH / Math.tan(slopeRad), sideSpan * 0.24, sideSpan * 0.78);

      const totalElev = Math.max(1, state.craterElevationMeters);
      for (let i = 0; i < state.strataLayers.length; i++) {
        const st = state.strataLayers[i];
        const f0 = st.baseElevationMeters / totalElev;
        const f1 = st.topElevationMeters / totalElev;
        const y0 = floorY - wallH * f0;
        const y1 = floorY - wallH * f1;
        const lIn0 = leftToeX - runPx * f0;
        const lIn1 = leftToeX - runPx * f1;
        const rIn0 = rightToeX + runPx * f0;
        const rIn1 = rightToeX + runPx * f1;
        const flankInset = (1 - state.neighborConvergenceRatio * 0.55) * sideSpan * 0.28;

        ctx.save();
        ctx.fillStyle = st.fill;
        ctx.strokeStyle = state.decayRepelFlash > 0 ? PALETTE.soap_pearl_mint : st.weld;
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(flankInset, y0);
        ctx.lineTo(lIn0, y0);
        ctx.lineTo(lIn1, y1);
        ctx.lineTo(flankInset * 0.85, y1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(rIn0, y0);
        ctx.lineTo(g.width - flankInset, y0);
        ctx.lineTo(g.width - flankInset * 0.85, y1);
        ctx.lineTo(rIn1, y1);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        const midY = (y0 + y1) * 0.5;
        if (y0 - y1 >= 9) {
          for (let k = 0; k < 2; k++) {
            const relic = st.relics[k % st.relics.length];
            const lx = flankInset + (lIn1 - flankInset) * (0.34 + k * 0.34);
            const rx = rIn1 + (g.width - flankInset - rIn1) * (0.28 + k * 0.36);
            drawRelicGlyph(ctx, relic, lx, midY, 5.2, 0.15 * k, 0.88);
            drawRelicGlyph(ctx, relic, rx, midY, 5.2, -0.15 * k, 0.88);
          }
          ctx.fillStyle = PALETTE.dawn_gleam_ivory;
          ctx.font = "600 9px monospace";
          ctx.textAlign = "right";
          ctx.fillText("D" + st.dayIndex, lIn1 - 5, midY + 3);
        }
        ctx.restore();
      }

      const vicePush = sideSpan * (0.14 + state.neighborConvergenceRatio * 0.34);
      const rollerH = Math.max(46, wallH * (0.58 + state.neighborConvergenceRatio * 0.36));
      ctx.save();
      ctx.fillStyle = "rgba(184, 93, 56, 0.44)";
      ctx.strokeStyle = PALETTE.rust_tin_ochre;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(0, floorY);
      ctx.lineTo(vicePush, floorY);
      ctx.quadraticCurveTo(vicePush * 1.15, floorY - rollerH * 0.7, 0, floorY - rollerH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(g.width, floorY);
      ctx.lineTo(g.width - vicePush, floorY);
      ctx.quadraticCurveTo(g.width - vicePush * 1.15, floorY - rollerH * 0.7, g.width, floorY - rollerH);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      for (let m = 0; m < 4; m++) {
        const fy = floorY - rollerH * (0.18 + m * 0.2);
        const rel = FOREIGN_RELIC_TYPES[m];
        drawRelicGlyph(ctx, rel, vicePush * 0.52, fy, 6.0, m * 0.4, 0.92);
        drawRelicGlyph(ctx, rel, g.width - vicePush * 0.52, fy, 6.0, -m * 0.4, 0.92);
      }
      const arrowCol = state.neighborPressureActive ? PALETTE.cataclysm_crimson : "#7a8290";
      _drawArrow(ctx, 10, floorY - rollerH * 0.45, Math.max(24, vicePush + 8), floorY - rollerH * 0.45, arrowCol, 7);
      _drawArrow(ctx, g.width - 10, floorY - rollerH * 0.45, Math.min(g.width - 24, g.width - vicePush - 8), floorY - rollerH * 0.45, arrowCol, 7);
      ctx.restore();

      _renderProtractorAndCrossAvalanche(ctx, g, floorY, leftToeX, rightToeX, wallH, runPx);
    }

    function _renderProtractorAndCrossAvalanche(ctx, g, floorY, leftToeX, rightToeX, wallH, runPx) {
      const arcR = clamp(Math.min(72, (g.width - rightToeX) * 0.64), 38, 76);
      const liveRad = degToRad(state.slopeAngleDeg);
      const critRad = degToRad(CRITICAL_REPOSE_ANGLE_DEG);
      const isCrit = state.slopeAngleDeg >= CRITICAL_REPOSE_ANGLE_DEG;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(rightToeX, floorY);
      ctx.arc(rightToeX, floorY, arcR, -liveRad, 0, false);
      ctx.closePath();
      ctx.fillStyle = isCrit ? "rgba(201, 59, 43, 0.34)" : "rgba(216, 174, 94, 0.22)";
      ctx.fill();

      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = PALETTE.cataclysm_crimson;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(rightToeX, floorY);
      ctx.lineTo(rightToeX + Math.cos(critRad) * (arcR + 14), floorY - Math.sin(critRad) * (arcR + 14));
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = isCrit ? PALETTE.cataclysm_crimson : PALETTE.angelic_gold;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(rightToeX, floorY);
      ctx.lineTo(rightToeX + Math.cos(liveRad) * (arcR + 10), floorY - Math.sin(liveRad) * (arcR + 10));
      ctx.stroke();

      ctx.fillStyle = PALETTE.dawn_gleam_ivory;
      ctx.font = "700 10px monospace";
      ctx.textAlign = "left";
      ctx.fillText("θ " + state.slopeAngleDeg.toFixed(1) + "°", rightToeX + 8, floorY - arcR - 14);
      ctx.fillStyle = PALETTE.cataclysm_crimson;
      ctx.fillText("CRIT " + CRITICAL_REPOSE_ANGLE_DEG.toFixed(1) + "°", rightToeX + 8, floorY - arcR - 2);

      ctx.fillStyle = PALETTE.soap_pearl_mint;
      ctx.textAlign = "left";
      ctx.fillText(
        "CREST +" + state.craterElevationMeters.toFixed(1) + "m | DECAY 0%",
        12,
        Math.max(22, floorY - wallH - 8)
      );
      ctx.restore();

      if (state.landslideTriggered) {
        ctx.save();
        for (let i = 0; i < state.avalancheDebris.length; i++) {
          const b = state.avalancheDebris[i];
          const p = Math.max(b.progress, state.effacedRatio * 0.88);
          const startX = b.side < 0 ? leftToeX - runPx * 0.85 : rightToeX + runPx * 0.85;
          const startY = floorY - wallH * (0.65 + (i % 5) * 0.07);
          const endX = g.cx + (b.endFrac - 0.26) * g.basinHalfWidth * 1.9 * b.side;
          const endY = floorY - 4 - (i % 7) * 4.5 * state.effacedRatio;
          drawRelicGlyph(
            ctx,
            b.relic,
            startX + (endX - startX) * p,
            startY + (endY - startY) * p,
            b.size,
            b.rot,
            0.95
          );
        }
        ctx.restore();
      }
    }

    function render(ctx, viewport) {
      const g = _computeGeometry(viewport);
      if (!ctx) return g.coreBounds;
      ctx.save();
      if (state.crossSectionMode) {
        _renderCrossSectionView(ctx, g);
      } else {
        _renderPlanView(ctx, g);
      }
      ctx.restore();
      return g.coreBounds;
    }

    function renderOverlay(ctx, viewport) {
      if (!ctx || !state.landslideTriggered) return;
      const g = _computeGeometry(viewport);
      if (!state.crossSectionMode) {
        _renderPlanAvalanche(ctx, g);
      }
    }

    function inspectAt(x, y, viewport) {
      const g = _computeGeometry(viewport);
      if (state.crossSectionMode) {
        if (Math.abs(x - g.cx) < g.basinHalfWidth && y <= g.basinFloorY && y > g.basinFloorY - g.coreRadius * 1.1 && state.effacedRatio < 0.6) {
          return null;
        }
        if (Math.hypot(x - (g.cx + g.basinHalfWidth), y - g.basinFloorY) < 76) {
          return {
            kind: "repose_protractor",
            id: "repose_protractor",
            title: "Angle-of-Repose Protractor",
            subtitle: state.slopeAngleDeg.toFixed(1) + "° vs " + CRITICAL_REPOSE_ANGLE_DEG.toFixed(1) + "° critical",
            slopeAngleDeg: state.slopeAngleDeg,
            criticalReposeAngleDeg: CRITICAL_REPOSE_ANGLE_DEG,
            decompositionRate: DECOMPOSITION_RATE,
            detail: "Zero-decay strata steepen monotonically until critical failure triggers an effacing landslide."
          };
        }
        const stIdx = clamp(Math.floor(((g.basinFloorY - y) / Math.max(40, g.basinFloorY * 0.65)) * state.strataLayers.length), 0, state.strataLayers.length - 1);
        const st = state.strataLayers[stIdx];
        return {
          kind: "stratum",
          id: st.id,
          dayIndex: st.dayIndex,
          title: st.inscription,
          subtitle: "+" + st.topElevationMeters.toFixed(1) + " m · 0% decomposition",
          elevationMeters: st.topElevationMeters,
          decompositionRate: DECOMPOSITION_RATE,
          relics: st.relics,
          detail: "Embedded relics: " + st.relics.map(function (r) { return RELIC_LABELS[r] || r; }).join(", ")
        };
      }

      const dist = Math.hypot(x - g.cx, y - g.cy);
      if (dist < g.coreRadius) {
        if (state.landslideTriggered && state.effacedRatio >= 0.55) {
          return {
            kind: "avalanche_debris",
            id: "cataclysm_burial",
            title: "Cataclysmic Landslide Burial",
            subtitle: Math.round(state.effacedRatio * 100) + "% Metropolis Effaced",
            decompositionRate: DECOMPOSITION_RATE,
            relics: AVALANCHE_RELIC_POOL,
            detail: "Foreign rollers of flattened tin cans, burst tires, unmated shoes, and frayed straw flasks bury yesterday and today alike."
          };
        }
        return null;
      }
      if (dist <= g.scarpOuterR + 6) {
        const norm = 1 - clamp((dist - g.coreRadius) / Math.max(1, g.scarpOuterR - g.coreRadius), 0, 0.999);
        const idx = clamp(Math.floor(norm * state.strataLayers.length), 0, state.strataLayers.length - 1);
        const st = state.strataLayers[idx];
        return {
          kind: "stratum",
          id: st.id,
          dayIndex: st.dayIndex,
          title: st.inscription,
          subtitle: "+" + st.topElevationMeters.toFixed(1) + " m · " + st.tonnes + " t · 0% decay",
          elevationMeters: st.topElevationMeters,
          decompositionRate: DECOMPOSITION_RATE,
          relics: st.relics,
          detail: "Soldered relics: " + st.relics.map(function (r) { return RELIC_LABELS[r] || r; }).join(", ")
        };
      }

      const angDeg = (Math.atan2(y - g.cy, x - g.cx) * 180) / Math.PI;
      let bestCity = NEIGHBOR_CITIES[0];
      let bestDiff = 999;
      for (let c = 0; c < NEIGHBOR_CITIES.length; c++) {
        let diff = Math.abs(((angDeg - NEIGHBOR_CITIES[c].bearingDeg + 540) % 360) - 180);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestCity = NEIGHBOR_CITIES[c];
        }
      }
      return {
        kind: "neighbor_roller",
        id: bestCity.id,
        title: bestCity.name,
        subtitle: "Inward Convergence " + Math.round(state.neighborConvergenceRatio * 100) + "%",
        decompositionRate: DECOMPOSITION_RATE,
        relics: bestCity.relics,
        detail: "Foreign rampart carrying flattened tin cans, burst old tires, unmated old shoes, and frayed straw flasks."
      };
    }

    return {
      depositDailyRefuse,
      setMaterialSkillLevel,
      setNeighborPressure,
      toggleNeighborPressure,
      pushNeighborRollers,
      attemptDecay,
      setCrossSectionMode,
      toggleCrossSectionMode,
      render,
      renderOverlay,
      step,
      inspectAt,
      setReducedMotion,
      reset,
      resetCataclysm: reset,
      getState
    };
  }

  return Object.freeze({
    PALETTE,
    DECOMPOSITION_RATE,
    CRITICAL_REPOSE_ANGLE_DEG,
    LEONIA_RELIC_TYPES,
    FOREIGN_RELIC_TYPES,
    NEIGHBOR_CITY_NAMES,
    NEIGHBOR_CITIES,
    RELIC_LABELS,
    createScarpEngine
  });
})();

if (typeof window !== "undefined") {
  window.LeoniaScarpAvalanches = globalThis.LeoniaScarpAvalanches;
}
