/*
 * Laudomia — Twin Anguish & Triple City Causal Dynamics
 * Module: globalThis.LaudomiaTwinAnguish
 *
 * Models the three mirrors bearing one name:
 *   1. Laudomia of the Living (crowded travertine arcades & workshops)
 *   2. Laudomia of the Dead (ever-broadening stone-slab necropolis beyond the walls)
 *   3. Laudomia of the Unborn (porous sponge-marble domes of pure silence & expectation)
 * Together with the twin anguishes that seize the city:
 *   - First Anguish ('funnel'): Stadium-funnel amphitheater suffocation
 *   - Second Anguish ('hourglass'): Unturned finite-grain hourglass extinction
 */
(function (root) {
  "use strict";

  function clamp(val, min, max) {
    if (!Number.isFinite(val)) return min;
    return val < min ? min : (val > max ? max : val);
  }

  function clamp01(val) {
    return clamp(val, 0, 1);
  }

  function round2(val) {
    return Math.round(val * 100) / 100;
  }

  function round4(val) {
    return Math.round(val * 10000) / 10000;
  }

  function wrapIndex(idx, len, fallbackNext) {
    if (idx === undefined || idx === null || idx === "" || Number.isNaN(Number(idx))) {
      return ((fallbackNext % len) + len) % len;
    }
    var n = Math.floor(Number(idx));
    return ((n % len) + len) % len;
  }

  var CLANS = Object.freeze([
    Object.freeze({
      index: 0,
      id: "albergati_masons",
      surname: "House Albergati",
      guild: "Guild of Travertine Quarriers & Vault-Setters",
      rank: "First Keystone Wardens",
      slabText: "ALBERGATI · QUARRIERS OF THE WEST WALL · SEVEN COURSES UNBROKEN",
      explanation: "Every arch in the living quarter rests upon courses measured by seven generations of Albergati plumb-lines.",
      livingEcho: "In the stepped alley of stonecutters, apprentices still strike the chisel three times before noon."
    }),
    Object.freeze({
      index: 1,
      id: "bellori_glassblowers",
      surname: "House Bellori",
      guild: "Confraternity of Ampoule & Sand-Glass Blowers",
      rank: "Keepers of the Measured Waist",
      slabText: "BELLORI · MASTERS OF ANNEALED SILICA · NO VESSEL WITHOUT MEASURE",
      explanation: "From furnace to burial vault, the Bellori calibrated every clear bulb that portions the hours of the market.",
      livingEcho: "Warm kiln-breath drifts through the central arcade where young Bellori anneal slender vials."
    }),
    Object.freeze({
      index: 2,
      id: "corvini_notaries",
      surname: "House Corvini",
      guild: "College of Lineage Scribes & Cadastral Notaries",
      rank: "Custodians of the Double Roll",
      slabText: "CORVINI · SCRIBES OF SURNAME AND BOUNDARY · ORDER AGAINST CHAOS",
      explanation: "Their carved registries bind each child given an ancient name to the forebear who first carried it.",
      livingEcho: "Beneath the notary loggia, iron-gall ink dries on guild charters stamped with the raven seal."
    }),
    Object.freeze({
      index: 3,
      id: "davanzo_weavers",
      surname: "House Davanzo",
      guild: "Loom-Masters of Shroud Linen & Canopy Twill",
      rank: "Syndics of the Unbroken Warp",
      slabText: "DAVANZO · WEAVERS OF SWADDLING AND WINDING-SHEET · ONE THREAD",
      explanation: "The selfsame reed-count dresses the cradle in the arcades and lines the limestone niche beyond the gate.",
      livingEcho: "Wooden shuttles clack across narrow courtyards, repeating the chevron cut into the hillside slab."
    }),
    Object.freeze({
      index: 4,
      id: "ercole_cisterners",
      surname: "House Ercole",
      guild: "Order of Subterranean Aqueducts & Cistern Gaugers",
      rank: "Magistrates of Still Water",
      slabText: "ERCOLE · GAUGERS OF THE DEEP CONDUIT · LEVEL IN DROUGHT AND FLOOD",
      explanation: "Reading the Ercole water-marks on the necropolis stones assures the living that hidden springs endure.",
      livingEcho: "Bronze dippers ring against the travertine well-curb in the lower square at dusk."
    }),
    Object.freeze({
      index: 5,
      id: "foscarini_founders",
      surname: "House Foscarini",
      guild: "Founders of Bronze Clasps, Bells & Gate Hinges",
      rank: "Aldermen of the Threshold",
      slabText: "FOSCARINI · CASTERS OF THE GREAT HINGES · WHAT IS SEALED ENDURES",
      explanation: "Every portal between the walled streets and the hearse-lanes swings on bronze poured in Foscarini molds.",
      livingEcho: "Sparks rise behind the foundry shutters whenever a fresh lintel clasp is quenched in oil."
    }),
    Object.freeze({
      index: 6,
      id: "grimani_apothecaries",
      surname: "House Grimani",
      guild: "Guild of Cypress Resin, Myrrh & Fever-Simples",
      rank: "Consuls of the Quiet Vial",
      slabText: "GRIMANI · KEEPERS OF BALM AND BITTER ROOT · MEASURED REMEDY",
      explanation: "Their incised mortar emblems record which plagues Laudomia outlived and why the streets still stand.",
      livingEcho: "Crushed cypress cones and dried sage scent the shadowed stairways behind the apothecary arch."
    }),
    Object.freeze({
      index: 7,
      id: "loredan_torchbearers",
      surname: "House Loredan",
      guild: "Brotherhood of Hearse-Lane Links & Night Watch",
      rank: "Wardens of the Windowless Way",
      slabText: "LOREDAN · BEARERS OF THE PITCH TORCH · NONE PASS UNNAMED",
      explanation: "They paced the windowless lanes before us, proving that every threshold crossed leaves an ordered trace.",
      livingEcho: "Ochre wall-torches are kindled in strict sequence from the western gate inward at nightfall."
    })
  ]);

  var UNBORN_DOMES = Object.freeze([
    Object.freeze({
      index: 0,
      id: "cupola_spongia_prima",
      domeName: "First Sponge-Marble Cupola",
      poreDensity: 0.72,
      archSpan: 14,
      unaskedQuestion: "Whose footsteps will outlast the stone threshold they have not yet crossed?"
    }),
    Object.freeze({
      index: 1,
      id: "niche_white_travertine",
      domeName: "Hollow of Uncarved Travertine",
      poreDensity: 0.76,
      archSpan: 16,
      unaskedQuestion: "Will hands not yet shaped rebuild the crowded arcades or forget their names?"
    }),
    Object.freeze({
      index: 2,
      id: "vault_cellular_alabaster",
      domeName: "Cellular Alabaster Rotunda",
      poreDensity: 0.81,
      archSpan: 18,
      unaskedQuestion: "What guild not yet imagined sleeps inside ten thousand dry pores of pale stone?"
    }),
    Object.freeze({
      index: 3,
      id: "apse_breathless_carrara",
      domeName: "Apse of Breathless Carrara",
      poreDensity: 0.84,
      archSpan: 15,
      unaskedQuestion: "Does silence wait here because the future is boundless, or because no voice remains?"
    }),
    Object.freeze({
      index: 4,
      id: "vestibule_echoing_calcite",
      domeName: "Vestibule of Echoing Calcite",
      poreDensity: 0.79,
      archSpan: 20,
      unaskedQuestion: "When a visitor halts beneath an empty arch, whose expectation answers the heel-strike?"
    }),
    Object.freeze({
      index: 5,
      id: "exedra_unfurnished_light",
      domeName: "Unfurnished Exedra of Pale Light",
      poreDensity: 0.88,
      archSpan: 22,
      unaskedQuestion: "Why does a hall without benches, lamps, or lintel-names weigh heavier than the cemetery?"
    }),
    Object.freeze({
      index: 6,
      id: "tholos_honeycomb_lime",
      domeName: "Honeycomb Limestone Tholos",
      poreDensity: 0.91,
      archSpan: 19,
      unaskedQuestion: "Are billions pressing behind every pinpoint pore, or only a final handful of breaths?"
    }),
    Object.freeze({
      index: 7,
      id: "sanctum_unspoken_surname",
      domeName: "Vault of the Unspoken Surname",
      poreDensity: 0.95,
      archSpan: 24,
      unaskedQuestion: "Who will receive the last syllable in the city when the upper chamber stands empty?"
    })
  ]);

  var VALID_MODES = { triad: true, funnel: true, hourglass: true };
  var VALID_CHAMBERS = { all: true, living: true, dead: true, unborn: true };

  var TOTAL_FINITE_SAND = 240;
  var INITIAL_UNBORN_GRAINS = 132;
  var INITIAL_WAIST_GRAINS = 24;
  var INITIAL_DEAD_GRAINS = 84;
  var INITIAL_LIVING = 148;
  var INITIAL_SLABS = 420;
  var INITIAL_FUNNEL_DENSITY = 0.26;
  var CHOKING_THRESHOLD = 0.82;
  var MAX_PARTICLES = 64;
  var TURN_REFUSAL_CODE = "NO_HAND_TURNS_THE_HOURGLASS_OVER";

  function makeInitialState(reducedMotion) {
    return {
      generation: 1,
      anguishMode: "triad",
      focusedChamber: "all",
      baseLivingCount: INITIAL_LIVING,
      deadSlabsCount: INITIAL_SLABS,
      necropolisRings: 3,
      livingSecurity: 0.46,
      orderClarity: 0.48,
      unbornExpectation: 0.42,
      necropolisConsultations: 0,
      unbornVisits: 0,
      activeSlabIndex: 0,
      activeNicheIndex: 0,
      echoPulse: 0,
      chronicleNote: "Across the arcades of Laudomia, citizens walk between the stone slabs of the dead and the porous marble domes of the unborn.",
      funnelDensity: INITIAL_FUNNEL_DENSITY,
      unbornGrainsRemaining: INITIAL_UNBORN_GRAINS,
      livingWaistGrains: INITIAL_WAIST_GRAINS,
      deadHeapGrains: INITIAL_DEAD_GRAINS,
      turnAttempts: 0,
      turnShudder: 0,
      lastTurnRefusal: "",
      reducedMotion: Boolean(reducedMotion)
    };
  }

  function createEngine(opts) {
    var options = opts || {};
    var s = makeInitialState(options.reducedMotion);
    var listeners = [];
    var particles = [];
    var nextParticleId = 1;
    var ambientTimer = 0;

    if (typeof options.onChange === "function") {
      listeners.push(options.onChange);
    }

    function spawnParticle(kind, lane, clanIndex, initialT, speed) {
      if (particles.length >= MAX_PARTICLES) {
        particles.shift();
      }
      var safeLane = ((Math.floor(Number(lane) || 0) % 8) + 8) % 8;
      var safeClan = ((Math.floor(Number(clanIndex) || 0) % 8) + 8) % 8;
      particles.push({
        id: nextParticleId++,
        kind: kind,
        t: clamp01(Number.isFinite(initialT) ? initialT : 0),
        lane: safeLane,
        clanIndex: safeClan,
        speed: Number.isFinite(speed) && speed > 0 ? speed : 0.42
      });
    }

    function seedInitialParticles() {
      particles.length = 0;
      if (s.reducedMotion) return;
      spawnParticle("visit_dead", 0, 0, 0.18, 0.34);
      spawnParticle("visit_unborn", 2, 2, 0.44, 0.31);
      spawnParticle("birth", 4, 4, 0.62, 0.36);
      spawnParticle("death", 6, 6, 0.29, 0.33);
    }

    function updateNecropolisRings() {
      var computed = 3 + Math.floor(Math.max(0, s.deadSlabsCount - INITIAL_SLABS) / 48);
      s.necropolisRings = clamp(Math.max(s.necropolisRings, computed), 3, 12);
    }

    function applySandDrain(amount) {
      var remBefore = s.unbornGrainsRemaining + s.livingWaistGrains;
      var actual = Math.max(0, Math.min(remBefore, Math.round(Number(amount) || 0)));
      s.deadHeapGrains = clamp(s.deadHeapGrains + actual, 0, TOTAL_FINITE_SAND);
      var remAfter = TOTAL_FINITE_SAND - s.deadHeapGrains;
      s.livingWaistGrains = remAfter > INITIAL_WAIST_GRAINS ? INITIAL_WAIST_GRAINS : remAfter;
      s.unbornGrainsRemaining = remAfter - s.livingWaistGrains;
      return actual;
    }

    function computeLivingCount() {
      var grainsRem = s.unbornGrainsRemaining + s.livingWaistGrains;
      if (s.anguishMode === "hourglass") {
        if (grainsRem === 0) return 0;
        return Math.max(1, Math.round((s.livingWaistGrains / INITIAL_WAIST_GRAINS) * s.baseLivingCount));
      }
      return Math.max(0, s.baseLivingCount);
    }

    function getState() {
      var swarmingBillions = round2(0.4 + s.funnelDensity * 9.2);
      var amphitheaterTiers = clamp(Math.round(4 + s.funnelDensity * 14), 4, 18);
      var livingBreathingRoom = 1 - s.funnelDensity * 0.92;
      var isChoking = s.funnelDensity >= CHOKING_THRESHOLD;
      var grainsRemaining = s.unbornGrainsRemaining + s.livingWaistGrains;
      var lastGrainFallen = grainsRemaining === 0;

      var unbornPotentialLabel = "Uncountable Silence";
      if (s.anguishMode === "funnel") {
        unbornPotentialLabel = swarmingBillions.toFixed(1) + "B Swarming Pores";
      } else if (s.anguishMode === "hourglass") {
        unbornPotentialLabel = String(s.unbornGrainsRemaining) + " Finite Grains";
      }

      return {
        generation: s.generation,
        anguishMode: s.anguishMode,
        focusedChamber: s.focusedChamber,
        pilgrimageRoutes: ["living->dead", "living->unborn"],
        livingCount: computeLivingCount(),
        deadSlabsCount: s.deadSlabsCount,
        necropolisRings: s.necropolisRings,
        unbornFurnishings: 0,
        unbornPotentialLabel: unbornPotentialLabel,
        livingSecurity: s.livingSecurity,
        orderClarity: s.orderClarity,
        unbornExpectation: s.unbornExpectation,
        necropolisConsultations: s.necropolisConsultations,
        unbornVisits: s.unbornVisits,
        activeSlabIndex: s.activeSlabIndex,
        activeSlab: CLANS[s.activeSlabIndex],
        activeNicheIndex: s.activeNicheIndex,
        activeNiche: UNBORN_DOMES[s.activeNicheIndex],
        echoPulse: s.echoPulse,
        chronicleNote: s.chronicleNote,
        funnelDensity: s.funnelDensity,
        amphitheaterTiers: amphitheaterTiers,
        swarmingPoreBillions: swarmingBillions,
        livingBreathingRoom: livingBreathingRoom,
        isChoking: isChoking,
        totalFiniteSand: TOTAL_FINITE_SAND,
        unbornGrainsRemaining: s.unbornGrainsRemaining,
        livingWaistGrains: s.livingWaistGrains,
        deadHeapGrains: s.deadHeapGrains,
        grainsRemaining: grainsRemaining,
        canTurnHourglass: false,
        turnAttempts: s.turnAttempts,
        turnShudder: s.turnShudder,
        lastTurnRefusal: s.lastTurnRefusal,
        lastGrainFallen: lastGrainFallen,
        reducedMotion: s.reducedMotion
      };
    }

    function getFlowParticles() {
      var out = new Array(particles.length);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        out[i] = {
          id: p.id,
          kind: p.kind,
          t: p.t,
          lane: p.lane,
          clanIndex: p.clanIndex
        };
      }
      return out;
    }

    function emitChange() {
      if (!listeners.length) return;
      var snap = getState();
      for (var i = 0; i < listeners.length; i++) {
        listeners[i](snap);
      }
    }

    function step(dtSec) {
      var dt = Number.isFinite(dtSec) ? clamp(dtSec, 0, 0.25) : 0.016;

      if (s.echoPulse > 0) {
        s.echoPulse = round4(Math.max(0, s.echoPulse - dt * 0.62));
      }
      if (s.turnShudder > 0) {
        s.turnShudder = round4(Math.max(0, s.turnShudder - dt * 1.15));
      }

      var rateScale = s.reducedMotion ? 1.6 : 1.0;
      var kept = [];
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.t = round4(p.t + p.speed * dt * rateScale);
        if (p.t < 1) {
          kept.push(p);
        }
      }
      particles = kept;

      if (!s.reducedMotion) {
        ambientTimer += dt;
        var interval = s.anguishMode === "funnel" ? 0.42 : (s.anguishMode === "hourglass" ? 0.54 : 0.86);
        if (ambientTimer >= interval) {
          ambientTimer = 0;
          var lane = nextParticleId % 8;
          if (s.anguishMode === "hourglass") {
            if ((s.unbornGrainsRemaining + s.livingWaistGrains) > 0) {
              spawnParticle("sand_grain", lane, lane, 0, 0.46);
            }
          } else if (s.anguishMode === "funnel") {
            var kindF = (nextParticleId % 2 === 0) ? "birth" : "death";
            spawnParticle(kindF, lane, lane, 0, 0.36 + s.funnelDensity * 0.34);
          } else if (computeLivingCount() > 0) {
            var kindT = (nextParticleId % 2 === 0) ? "visit_dead" : "visit_unborn";
            spawnParticle(kindT, lane, lane, 0, 0.32);
          }
        }
      }

      return getState();
    }

    function setAnguishMode(mode) {
      if (VALID_MODES[mode]) {
        s.anguishMode = mode;
        if (mode === "triad") {
          s.chronicleNote = "Three cities share one name: the crowded arcades of the living, the slab necropolis, and the porous domes of the unborn.";
        } else if (mode === "funnel") {
          s.chronicleNote = s.funnelDensity >= CHOKING_THRESHOLD
            ? "Billions swarm every pore of stone along the stadium tiers, choking Laudomia of the Living in the narrow pit."
            : "Seen as a stadium funnel, stepped rings of tomb-slabs and swarming stone pores press around the living court.";
        } else {
          s.chronicleNote = (s.unbornGrainsRemaining + s.livingWaistGrains) === 0
            ? "Every finite grain has settled onto the lower heap of slabs; the unturned glass rests in silver silence."
            : "Seen as an unturned hourglass, each birth and death draws a finite grain from the upper dome toward the lower heap.";
        }
        emitChange();
      }
      return getState();
    }

    function setFocusedChamber(chamber) {
      if (VALID_CHAMBERS[chamber]) {
        s.focusedChamber = chamber;
        if (chamber === "living") {
          s.chronicleNote = "Within Laudomia of the Living, crowded workshops and arcades seek certainty in both silent neighbors.";
        } else if (chamber === "dead") {
          s.chronicleNote = "Beyond the west wall, windowless hearse-lanes open onto ever-broadening terraces of carved lineage slabs.";
        } else if (chamber === "unborn") {
          s.chronicleNote = "Beneath porous sponge-marble domes, unfurnished niches hold neither lamp nor inscription—only echoing silence.";
        } else {
          s.chronicleNote = "All three mirrors of Laudomia stand aligned: stone-slab cemetery, travertine alleys, and hollow marble domes.";
        }
        emitChange();
      }
      return getState();
    }

    function advanceGeneration(steps) {
      var raw = steps === undefined ? 1 : Number(steps);
      var count = Math.max(1, Math.min(50, Math.floor(Number.isFinite(raw) ? raw : 1)));

      for (var i = 0; i < count; i++) {
        s.generation += 1;
        s.deadSlabsCount += 48;
        updateNecropolisRings();

        var fDelta = s.anguishMode === "funnel" ? 0.18 : 0.06;
        s.funnelDensity = clamp01(round4(s.funnelDensity + fDelta));

        var drained = applySandDrain(28);

        if (s.unbornGrainsRemaining > 0) {
          s.baseLivingCount = INITIAL_LIVING + ((s.generation * 3) % 11) - 4;
        } else if (s.livingWaistGrains > 0) {
          s.baseLivingCount = Math.max(12, Math.round((s.livingWaistGrains / INITIAL_WAIST_GRAINS) * INITIAL_LIVING));
        } else {
          s.baseLivingCount = 96;
        }

        var lane = (s.generation + i) % 8;
        spawnParticle("birth", lane, lane, 0, 0.48);
        spawnParticle("death", (lane + 3) % 8, (lane + 3) % 8, 0, 0.45);
        if (drained > 0) {
          spawnParticle("sand_grain", (lane + 5) % 8, lane, 0, 0.55);
        }
      }

      if (s.anguishMode === "hourglass" && (s.unbornGrainsRemaining + s.livingWaistGrains) === 0) {
        s.chronicleNote = "Generation " + s.generation + ": the last finite grain has fallen through the waist; no birth follows.";
      } else if (s.anguishMode === "funnel" && s.funnelDensity >= CHOKING_THRESHOLD) {
        s.chronicleNote = "Generation " + s.generation + ": packed necropolis tiers and swarming pores suffocate the living pit.";
      } else {
        s.chronicleNote = "Generation " + s.generation + ": a new cohort enters the arcades as elders are carved onto necropolis ring " + s.necropolisRings + ".";
      }

      emitChange();
      return getState();
    }

    function consultNecropolis(clanIndex) {
      var idx = wrapIndex(clanIndex, CLANS.length, s.activeSlabIndex + 1);
      s.activeSlabIndex = idx;
      s.necropolisConsultations += 1;
      s.orderClarity = clamp01(round4(s.orderClarity + Math.max(0.03, (1 - s.orderClarity) * 0.28)));
      s.livingSecurity = clamp01(round4(s.livingSecurity + Math.max(0.03, (1 - s.livingSecurity) * 0.25)));

      spawnParticle("visit_dead", idx, idx, 0, 0.44);

      var clan = CLANS[idx];
      s.chronicleNote = clan.surname + " · " + clan.guild + ": " + clan.explanation;
      emitChange();

      return {
        clan: clan,
        orderClarity: s.orderClarity,
        livingSecurity: s.livingSecurity
      };
    }

    function enterUnbornHollows(nicheIndex) {
      var idx = wrapIndex(nicheIndex, UNBORN_DOMES.length, s.activeNicheIndex + 1);
      s.activeNicheIndex = idx;
      s.unbornVisits += 1;
      s.echoPulse = 1.0;
      s.unbornExpectation = clamp01(round4(s.unbornExpectation + Math.max(0.03, (1 - s.unbornExpectation) * 0.28)));

      spawnParticle("visit_unborn", idx, idx, 0, 0.41);

      var niche = UNBORN_DOMES[idx];
      s.chronicleNote = niche.domeName + ": footsteps echo across unfurnished sponge-marble — \"" + niche.unaskedQuestion + "\"";
      emitChange();

      return {
        niche: niche,
        unbornExpectation: s.unbornExpectation,
        unbornFurnishings: 0
      };
    }

    function intensifyFunnel(delta) {
      s.anguishMode = "funnel";
      var raw = delta === undefined ? 0.24 : Number(delta);
      var d = Number.isFinite(raw) ? Math.max(0.01, raw) : 0.24;
      s.funnelDensity = clamp01(round4(s.funnelDensity + d));

      var lane = nextParticleId % 8;
      spawnParticle("birth", lane, lane, 0, 0.56);
      spawnParticle("death", (lane + 4) % 8, (lane + 4) % 8, 0, 0.56);

      s.chronicleNote = s.funnelDensity >= CHOKING_THRESHOLD
        ? "Amphitheater steps close like a funnel: billions of dead and unborn choke Laudomia of the Living."
        : "The stadium funnel tightens; swarming stone pores and grave slabs press closer around the arcades.";
      emitChange();
      return getState();
    }

    function drainHourglass(grains) {
      s.anguishMode = "hourglass";
      var raw = grains === undefined ? 40 : Number(grains);
      var g = Number.isFinite(raw) ? Math.max(1, Math.round(raw)) : 40;
      var actual = applySandDrain(g);

      if (actual > 0) {
        s.deadSlabsCount += actual * 2;
        updateNecropolisRings();
        var lane = nextParticleId % 8;
        spawnParticle("sand_grain", lane, lane, 0, 0.58);
        spawnParticle("death", (lane + 2) % 8, lane, 0, 0.52);
      }

      var rem = s.unbornGrainsRemaining + s.livingWaistGrains;
      s.chronicleNote = rem === 0
        ? "The final grain has passed the narrow waist; Laudomia of the Living falls silent above the stone heap."
        : actual + " grains slip through the glass waist onto the tomb-slab heap (" + rem + " remaining).";
      emitChange();
      return getState();
    }

    function attemptTurnHourglass() {
      s.anguishMode = "hourglass";
      s.turnAttempts += 1;
      s.turnShudder = 1.0;
      s.lastTurnRefusal = TURN_REFUSAL_CODE + ": Oxidized bronze clasps lock the bulbs fast; no hand turns the glass over again.";
      s.chronicleNote = "The iron-clasped hourglass shudders in its frame, yet cannot rotate: no hand inverts Laudomia's finite sand.";
      emitChange();

      return {
        turned: false,
        canTurnHourglass: false,
        turnAttempts: s.turnAttempts,
        reason: TURN_REFUSAL_CODE
      };
    }

    function setReducedMotion(flag) {
      s.reducedMotion = Boolean(flag);
      if (s.reducedMotion) {
        particles.length = 0;
      }
      emitChange();
      return getState();
    }

    function reset() {
      var keepReduced = s.reducedMotion;
      s = makeInitialState(keepReduced);
      ambientTimer = 0;
      seedInitialParticles();
      emitChange();
      return getState();
    }

    function onChange(fn) {
      if (typeof fn !== "function") {
        return function noop() {};
      }
      listeners.push(fn);
      return function unsubscribe() {
        var idx = listeners.indexOf(fn);
        if (idx >= 0) {
          listeners.splice(idx, 1);
        }
      };
    }

    seedInitialParticles();

    return Object.freeze({
      CLANS: CLANS,
      UNBORN_DOMES: UNBORN_DOMES,
      getState: getState,
      getFlowParticles: getFlowParticles,
      step: step,
      setAnguishMode: setAnguishMode,
      setFocusedChamber: setFocusedChamber,
      focusChamber: setFocusedChamber,
      advanceGeneration: advanceGeneration,
      consultNecropolis: consultNecropolis,
      enterUnbornHollows: enterUnbornHollows,
      intensifyFunnel: intensifyFunnel,
      drainHourglass: drainHourglass,
      attemptTurnHourglass: attemptTurnHourglass,
      setReducedMotion: setReducedMotion,
      reset: reset,
      onChange: onChange
    });
  }

  var api = Object.freeze({
    CLANS: CLANS,
    UNBORN_DOMES: UNBORN_DOMES,
    createEngine: createEngine
  });

  root.LaudomiaTwinAnguish = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
