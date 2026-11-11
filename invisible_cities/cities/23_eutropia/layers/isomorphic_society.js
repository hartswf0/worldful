/*
 * City 23: Eutropia (Chapter IV - Trading Cities 3)
 * Layer: Isomorphic Society, Weariness Accumulator & Mercury Derangement Proof
 * Standalone browser script attaching globalThis.EutropiaIsomorphicSociety.
 */
(function (root) {
  "use strict";

  const CITIZENS = Object.freeze([
    Object.freeze({ index: 0, id: "zeno", name: "Zeno", accent: "Nasal Cliff-Drawl" }),
    Object.freeze({ index: 1, id: "tullio", name: "Tullio", accent: "Brisk Cistern-Clip" }),
    Object.freeze({ index: 2, id: "cosimo", name: "Cosimo", accent: "Singsong Quarry-Lilt" }),
    Object.freeze({ index: 3, id: "fabio", name: "Fabio", accent: "Husky Olive-Brogue" }),
    Object.freeze({ index: 4, id: "saverio", name: "Saverio", accent: "Gravelly Gate-Cadence" }),
    Object.freeze({ index: 5, id: "nerio", name: "Nerio", accent: "Soft Steppe-Murmur" }),
    Object.freeze({ index: 6, id: "lauro", name: "Lauro", accent: "Crisp Notary-Staccato" }),
    Object.freeze({ index: 7, id: "aldo", name: "Aldo", accent: "Round Bell-Baritone" })
  ]);

  const JOBS = Object.freeze([
    "Olive-Press Weigher",
    "Quicklime Wall-Scrubber",
    "Mule-Pack Saddler",
    "Bridge-Toll Clerk",
    "Copper-Kettle Tinker",
    "Saffron & Wool Dyer",
    "Cistern Sluice-Keeper",
    "Notary of Promissory Slips"
  ]);

  const WIVES = Object.freeze([
    "Lucia of the Loom",
    "Marta of the Figs",
    "Silvia of the Salt-Pan",
    "Agata of the Lanterns",
    "Nerina of the Dove-Cote",
    "Violante of the Spindles",
    "Camilla of the Herbs",
    "Ortensia of the Keys"
  ]);

  const HOUSES = Object.freeze([
    "Corner Arcade #1 (North Casement)",
    "Bell-Shadow Loft #2 (East Loggia)",
    "Cistern Court #3 (West Arch)",
    "Gatehouse Terrace #4 (South Sill)",
    "Granary Eaves #5 (Mesa Rim)",
    "Dyer's Pergola #6 (Piazza Balcony)",
    "Fountain Steps #7 (Clock Gable)",
    "Rampart Walk #8 (Watch Casement)"
  ]);

  const DEBT_LEDGER_KINDS = Object.freeze([
    "12 grossi for pressed lamp-oil",
    "12 grossi for slaked quicklime",
    "12 grossi for stitched pack-saddle",
    "12 grossi for cart-axle toll",
    "12 grossi for soldered kettle",
    "12 grossi for madder-dyed bolt",
    "12 grossi for cistern water-share",
    "12 grossi for stamped tally-slip"
  ]);

  const PASTIMES_AND_GOSSIP = Object.freeze([
    Object.freeze({
      pastime: "Morra under the arch",
      phrase: "Seven fingers! Rain before the third market, mark my measure!",
      friendSlot: 3
    }),
    Object.freeze({
      pastime: "Bocce in the dry ditch",
      phrase: "That pack-mule knows the plateau trail better than the syndic!",
      friendSlot: 5
    }),
    Object.freeze({
      pastime: "Lute bench at sundown",
      phrase: "My new shutter catches the cross-breeze—life begins anew!",
      friendSlot: 6
    }),
    Object.freeze({
      pastime: "Dominoes at the wine-cask",
      phrase: "Twelve grossi lent is twelve grossi owed; the beam stays level.",
      friendSlot: 0
    }),
    Object.freeze({
      pastime: "Briscola by the wellhead",
      phrase: "Did you hear who hung their kettle in the corner arcade?",
      friendSlot: 7
    }),
    Object.freeze({
      pastime: "Iron quoits by the gate",
      phrase: "Fresh quicklime smells sweeter than yesterday's promissory ink!",
      friendSlot: 1
    }),
    Object.freeze({
      pastime: "Checkers on the steps",
      phrase: "Same salt in the pottage, fresh hook over the hearth!",
      friendSlot: 2
    }),
    Object.freeze({
      pastime: "Starling-whistling on the parapet",
      phrase: "Ah—another day weighed, folded, and tucked under Mercury's wing!",
      friendSlot: 4
    })
  ]);

  const WEARINESS_BURDENS = Object.freeze([
    "job",
    "relatives",
    "house",
    "debts",
    "greetings"
  ]);

  const CANONICAL_SIGNATURE = "SCENES:4|JOBS:8|DEBTS:8x12g|YAWNS:3";

  const FALLBACK_MESA_VISTAS = Object.freeze([
    "Chalk-Rim Ravine & Juniper Windbreak",
    "Red-Clay Salt Hollow & Dry Aqueduct",
    "West Quarry Terraces & Thistle Steppe",
    "Twin Cypress Ridge & Mule Switchbacks",
    "Limestone Sinkhole & Cloud-Shadow Plain",
    "Saffron Terrace Scarp & Distant Watch-Cairn",
    "Basalt Spur & Shepherd's Cistern Horizon"
  ]);

  const FALLBACK_MESA_NAMES = Object.freeze([
    "Eutropia-Prima",
    "Eutropia-Secunda",
    "Eutropia-Tertia",
    "Eutropia-Quarta",
    "Eutropia-Quinta",
    "Eutropia-Sexta",
    "Eutropia-Septima"
  ]);

  const INITIAL_VECTORS = Object.freeze({
    job: 0.21,
    relatives: 0.16,
    house: 0.19,
    debts: 0.17,
    greetings: 0.17
  });

  const FRESH_EXODUS_VECTORS = Object.freeze({
    job: 0.05,
    relatives: 0.03,
    house: 0.04,
    debts: 0.04,
    greetings: 0.04
  });

  const BURDEN_RATES = Object.freeze({
    job: 1.12,
    relatives: 1.02,
    house: 1.08,
    debts: 1.04,
    greetings: 1.10
  });

  const DEBT_CYCLE_SHIFTS = Object.freeze([1, 3, 5, 7]);
  const FRIEND_CYCLE_SHIFTS = Object.freeze([2, 5, 3, 6, 1, 4, 7]);

  function clamp01(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      return 0;
    }
    return num < 0 ? 0 : num > 1 ? 1 : num;
  }

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function resolveWindowVista(cityIndex, cityMeta) {
    if (typeof cityMeta === "string" && cityMeta.trim().length > 0) {
      return cityMeta.trim();
    }
    if (cityMeta && typeof cityMeta === "object") {
      const raw = cityMeta.windowVista || cityMeta.vista || cityMeta.landscape;
      if (typeof raw === "string" && raw.trim().length > 0) {
        return raw.trim();
      }
      if (raw && typeof raw === "object") {
        const nested = raw.label || raw.title || raw.description || raw.name;
        if (typeof nested === "string" && nested.trim().length > 0) {
          return nested.trim();
        }
      }
    }
    return FALLBACK_MESA_VISTAS[mod(Number(cityIndex) || 0, FALLBACK_MESA_VISTAS.length)];
  }

  function resolveCityName(cityIndex, cityMeta) {
    if (cityMeta && typeof cityMeta === "object") {
      const candidate = cityMeta.name || cityMeta.cityName || cityMeta.title || cityMeta.label;
      if (typeof candidate === "string" && candidate.trim().length > 0) {
        return candidate.trim();
      }
    }
    return FALLBACK_MESA_NAMES[mod(Number(cityIndex) || 0, FALLBACK_MESA_NAMES.length)];
  }

  function computeGiniCoefficient(values) {
    const n = Array.isArray(values) ? values.length : 0;
    if (n === 0) {
      return 0;
    }
    let sum = 0;
    for (let i = 0; i < n; i += 1) {
      sum += Number(values[i]) || 0;
    }
    if (sum <= 0) {
      return 0;
    }
    let diffAcc = 0;
    for (let i = 0; i < n; i += 1) {
      for (let j = 0; j < n; j += 1) {
        diffAcc += Math.abs((Number(values[i]) || 0) - (Number(values[j]) || 0));
      }
    }
    const rawGini = diffAcc / (2 * n * sum);
    return Math.abs(rawGini) < 1e-12 ? 0 : rawGini;
  }

  function buildActorRef(assignment, roleLabel) {
    return {
      citizenIndex: assignment.citizenIndex,
      index: assignment.citizenIndex,
      id: assignment.id,
      name: assignment.name,
      accent: assignment.accent,
      roleLabel: roleLabel,
      job: assignment.job,
      house: assignment.house
    };
  }

  function buildCitizenAssignments(epochK, windowVista, jobHistorySets, jobHistoryLists, previousAssignments) {
    const debtShift = DEBT_CYCLE_SHIFTS[mod(epochK, DEBT_CYCLE_SHIFTS.length)];
    const friendShift = FRIEND_CYCLE_SHIFTS[mod(epochK, FRIEND_CYCLE_SHIFTS.length)];
    const list = [];

    for (let i = 0; i < CITIZENS.length; i += 1) {
      const citizen = CITIZENS[i];
      const jobIndex = mod(i + epochK, 8);
      const wifeIndex = mod(i + 3 * epochK, 8);
      const houseIndex = mod(i + 5 * epochK, 8);
      const debtSlotIndex = mod(i + 7 * epochK, 8);
      const creditorCitizenIndex = mod(i + debtShift, 8);
      const debtorCitizenIndex = mod(i - debtShift, 8);
      const gossipIndex = mod(i + 2 + epochK, 8);
      const friendCitizenIndex = mod(i + friendShift, 8);

      jobHistorySets[i].add(jobIndex);
      jobHistoryLists[i].push(JOBS[jobIndex]);

      const gossipEntry = PASTIMES_AND_GOSSIP[gossipIndex];
      const creditor = CITIZENS[creditorCitizenIndex];
      const debtor = CITIZENS[debtorCitizenIndex];
      const friend = CITIZENS[friendCitizenIndex];
      const prev = previousAssignments && previousAssignments[i] ? previousAssignments[i] : null;

      const jobChanged = prev ? prev.jobIndex !== jobIndex : false;
      const wifeChanged = prev ? prev.wifeIndex !== wifeIndex : false;
      const houseChanged = prev ? prev.houseIndex !== houseIndex : false;
      const creditorChanged = prev ? prev.creditorCitizenIndex !== creditorCitizenIndex : false;
      const gossipChanged = prev ? prev.gossipIndex !== gossipIndex : false;
      const changedFromPrevious = Boolean(
        prev && jobChanged && wifeChanged && houseChanged && creditorChanged && gossipChanged
      );

      list.push({
        citizenIndex: i,
        index: i,
        id: citizen.id,
        name: citizen.name,
        accent: citizen.accent,
        jobIndex: jobIndex,
        job: JOBS[jobIndex],
        stipend: 24,
        authorityRank: 1,
        wifeIndex: wifeIndex,
        wife: WIVES[wifeIndex],
        houseIndex: houseIndex,
        house: HOUSES[houseIndex],
        windowVista: windowVista,
        debtSlotIndex: debtSlotIndex,
        debtKind: DEBT_LEDGER_KINDS[debtSlotIndex],
        creditorCitizenIndex: creditorCitizenIndex,
        creditorId: creditor.id,
        creditorName: creditor.name,
        debtorCitizenIndex: debtorCitizenIndex,
        debtorId: debtor.id,
        debtorName: debtor.name,
        debtEdgeLabel: "Owes " + creditor.name + " (" + DEBT_LEDGER_KINDS[debtSlotIndex] + ")",
        credit: 12,
        debt: 12,
        creditGrossi: 12,
        debtGrossi: 12,
        netWealth: 0,
        inDegree: 1,
        outDegree: 1,
        gossipIndex: gossipIndex,
        pastime: gossipEntry.pastime,
        phrase: gossipEntry.phrase,
        friendSlot: gossipEntry.friendSlot,
        friendCitizenIndex: friendCitizenIndex,
        friendId: friend.id,
        friendName: friend.name,
        lifetimeUniqueJobsVisited: jobHistorySets[i].size,
        lifetimeJobsRatioLabel: jobHistorySets[i].size + "/8",
        visitedJobIndices: Array.from(jobHistorySets[i]),
        jobHistory: jobHistoryLists[i].slice(),
        changedFromPrevious: changedFromPrevious,
        slotChanges: {
          job: jobChanged,
          wife: wifeChanged,
          house: houseChanged,
          creditor: creditorChanged,
          gossip: gossipChanged
        },
        previous: prev
          ? {
              jobIndex: prev.jobIndex,
              job: prev.job,
              wifeIndex: prev.wifeIndex,
              wife: prev.wife,
              houseIndex: prev.houseIndex,
              house: prev.house,
              debtSlotIndex: prev.debtSlotIndex,
              debtKind: prev.debtKind,
              creditorCitizenIndex: prev.creditorCitizenIndex,
              creditorName: prev.creditorName,
              gossipIndex: prev.gossipIndex,
              pastime: prev.pastime,
              phrase: prev.phrase,
              windowVista: prev.windowVista
            }
          : null
      });
    }

    return list;
  }

  function findAssignmentByJob(assignments, jobTitle) {
    for (let i = 0; i < assignments.length; i += 1) {
      if (assignments[i].job === jobTitle) {
        return assignments[i];
      }
    }
    return assignments[0];
  }

  function findAssignmentByHousePrefix(assignments, prefix) {
    for (let i = 0; i < assignments.length; i += 1) {
      if (assignments[i].house.indexOf(prefix) === 0) {
        return assignments[i];
      }
    }
    return assignments[0];
  }

  function computeYawnAperture(phase, pulse, indexOffset) {
    const wave = 0.5 + 0.5 * Math.sin(phase - indexOffset * 1.05);
    return clamp01(0.35 + 0.45 * wave + 0.55 * pulse);
  }

  function buildCanonicalScenesAndYawns(assignments, previousScenes, yawnWavePhase, yawnPulse) {
    const sluiceKeeper = findAssignmentByJob(assignments, "Cistern Sluice-Keeper");
    const wallScrubber = findAssignmentByJob(assignments, "Quicklime Wall-Scrubber");
    const oliveWeigher = findAssignmentByJob(assignments, "Olive-Press Weigher");
    const notaryClerk = findAssignmentByJob(assignments, "Notary of Promissory Slips");
    const cornerResident = findAssignmentByHousePrefix(assignments, "Corner Arcade #1");
    const pergolaResident = findAssignmentByHousePrefix(assignments, "Dyer's Pergola #6");
    const packSaddler = findAssignmentByJob(assignments, "Mule-Pack Saddler");
    const tollClerk = findAssignmentByJob(assignments, "Bridge-Toll Clerk");

    const rawSpecs = [
      {
        index: 0,
        id: "wellhead_greeting",
        title: "Wellhead Morning Greeting",
        locus: "Cistern Wellhead",
        slotA: "Cistern Sluice-Keeper",
        slotB: "Quicklime Wall-Scrubber",
        assignA: sluiceKeeper,
        assignB: wallScrubber,
        speech: "Same water climbs the cistern rim; good measure to your lime-brush, neighbor.",
        reply: "And steady sluice-pins to your wrist—the bucket knows the rope.",
        yawnNumber: 1,
        yawnOwnerSide: "actorA"
      },
      {
        index: 1,
        id: "twelve_grossi_scale",
        title: "Twelve-Grossi Level Beam",
        locus: "Market Weigh-Beam",
        slotA: "Olive-Press Weigher",
        slotB: "Notary of Promissory Slips",
        assignA: oliveWeigher,
        assignB: notaryClerk,
        speech: "Twelve silver grossi in the bronze pan, twelve on the waxed tally-slip: the tongue stands plumb.",
        reply: "Neither creditor above nor debtor below—stamp the seal and clear the bench.",
        yawnNumber: null,
        yawnOwnerSide: null
      },
      {
        index: 2,
        id: "casement_gossip",
        title: "Casement Shutter Proverb",
        locus: "Corner Arcade to Piazza Balcony",
        slotA: "Corner Arcade #1",
        slotB: "Dyer's Pergola #6",
        assignA: cornerResident,
        assignB: pergolaResident,
        speech: "New shutter-hook, new ridge across the plain, yet the kettle sings the old refrain!",
        reply: "Wait till the shadow touches the sundial—every alley tells the same tale.",
        yawnNumber: 2,
        yawnOwnerSide: "actorB"
      },
      {
        index: 3,
        id: "mercury_morra_dusk",
        title: "Mercury Shrine Morra at Dusk",
        locus: "Arch of Mercury",
        slotA: "Mule-Pack Saddler",
        slotB: "Bridge-Toll Clerk",
        assignA: packSaddler,
        assignB: tollClerk,
        speech: "Seven fingers under Mercury's caduceus! Tomorrow's pack-train pays today's exact toll.",
        reply: "Throw again or fold the apron—the god of the fickle keeps an even board.",
        yawnNumber: 3,
        yawnOwnerSide: "actorA"
      }
    ];

    const canonicalScenes = [];
    const wideOpenYawns = [];

    for (let s = 0; s < rawSpecs.length; s += 1) {
      const spec = rawSpecs[s];
      const actorA = buildActorRef(spec.assignA, spec.slotA);
      const actorB = buildActorRef(spec.assignB, spec.slotB);
      const prevScene = previousScenes && previousScenes[s] ? previousScenes[s] : null;
      const actorsRotated = Boolean(
        prevScene &&
          prevScene.actorA.citizenIndex !== actorA.citizenIndex &&
          prevScene.actorB.citizenIndex !== actorB.citizenIndex
      );

      const hasYawn = spec.yawnNumber !== null;
      const yawnerActor =
        spec.yawnOwnerSide === "actorA" ? actorA : spec.yawnOwnerSide === "actorB" ? actorB : null;
      const aperture = hasYawn
        ? computeYawnAperture(yawnWavePhase, yawnPulse, spec.yawnNumber - 1)
        : 0;
      const prevYawnerIdx =
        prevScene && prevScene.yawner ? prevScene.yawner.citizenIndex : null;
      const yawnMouthRotated = Boolean(
        hasYawn && prevYawnerIdx !== null && prevYawnerIdx !== yawnerActor.citizenIndex
      );

      const yawnerObj = hasYawn
        ? {
            yawnNumber: spec.yawnNumber,
            citizenIndex: yawnerActor.citizenIndex,
            id: yawnerActor.id,
            name: yawnerActor.name,
            accent: yawnerActor.accent,
            roleLabel: yawnerActor.roleLabel,
            aperture: aperture,
            rotatedMouthFromPrevious: yawnMouthRotated
          }
        : null;

      if (yawnerObj) {
        wideOpenYawns.push({
          index: wideOpenYawns.length,
          yawnNumber: spec.yawnNumber,
          sceneId: spec.id,
          sceneTitle: spec.title,
          citizenIndex: yawnerActor.citizenIndex,
          id: yawnerActor.id,
          citizenId: yawnerActor.id,
          name: yawnerActor.name,
          citizenName: yawnerActor.name,
          accent: yawnerActor.accent,
          roleLabel: yawnerActor.roleLabel,
          aperture: aperture,
          rotatedMouthFromPrevious: yawnMouthRotated
        });
      }

      canonicalScenes.push({
        index: spec.index,
        id: spec.id,
        title: spec.title,
        locus: spec.locus,
        slotA: spec.slotA,
        slotB: spec.slotB,
        actorA: actorA,
        actorB: actorB,
        speech: spec.speech,
        canonicalScript: spec.speech,
        line: spec.speech,
        reply: spec.reply,
        hasWideOpenYawn: hasYawn,
        hasYawn: hasYawn,
        yawnNumber: spec.yawnNumber,
        yawnOwnerSide: spec.yawnOwnerSide,
        yawner: yawnerObj,
        yawnAperture: aperture,
        actorsRotatedFromPrevious: actorsRotated,
        invariantKey:
          spec.id + "|" + spec.slotA + "|" + spec.slotB + "|" + spec.speech + "|YAWN:" + String(spec.yawnNumber)
      });
    }

    return {
      canonicalScenes: canonicalScenes,
      wideOpenYawns: wideOpenYawns
    };
  }

  function computeInvarianceProof(
    assignments,
    previousAssignments,
    canonicalScenes,
    wideOpenYawns,
    permutationCount,
    originBaseline
  ) {
    const n = assignments.length;
    let citizensChangedCount = 0;
    let fixedPoints = 0;

    if (previousAssignments && permutationCount > 0) {
      for (let i = 0; i < n; i += 1) {
        const cur = assignments[i];
        const prev = previousAssignments[i];
        let unchanged = 0;
        if (cur.jobIndex === prev.jobIndex) unchanged += 1;
        if (cur.wifeIndex === prev.wifeIndex) unchanged += 1;
        if (cur.houseIndex === prev.houseIndex) unchanged += 1;
        if (cur.creditorCitizenIndex === prev.creditorCitizenIndex) unchanged += 1;
        if (cur.gossipIndex === prev.gossipIndex) unchanged += 1;
        fixedPoints += unchanged;
        if (unchanged === 0) {
          citizensChangedCount += 1;
        }
      }
    }

    const individualChangeRatio = permutationCount === 0 ? 0 : citizensChangedCount / n;
    const standings = assignments.map(function (a) {
      return a.stipend + a.creditGrossi - a.debtGrossi;
    });
    const wealthGini = computeGiniCoefficient(standings);

    const inDeg = new Array(n).fill(0);
    const outDeg = new Array(n).fill(0);
    let twelveGrossiEdges = 0;
    let selfLoops = 0;

    for (let i = 0; i < n; i += 1) {
      const a = assignments[i];
      outDeg[a.citizenIndex] += 1;
      inDeg[a.creditorCitizenIndex] += 1;
      if (a.debtGrossi === 12 && a.creditGrossi === 12) {
        twelveGrossiEdges += 1;
      }
      if (a.creditorCitizenIndex === a.citizenIndex) {
        selfLoops += 1;
      }
    }

    const inOnes = inDeg.filter(function (d) { return d === 1; }).length;
    const outOnes = outDeg.filter(function (d) { return d === 1; }).length;
    const debtDegreeSequence =
      inOnes === n && outOnes === n
        ? "in:1x" + n + "|out:1x" + n
        : "in:" + inDeg.join(",") + "|out:" + outDeg.join(",");

    const visitedInCycle = new Set();
    let cursor = 0;
    while (!visitedInCycle.has(cursor) && visitedInCycle.size <= n) {
      visitedInCycle.add(cursor);
      cursor = assignments[cursor].creditorCitizenIndex;
    }
    const debtCycleLength = cursor === 0 ? visitedInCycle.size : 0;
    const isSingleDebtCycle =
      debtCycleLength === n && selfLoops === 0 && inOnes === n && outOnes === n;

    const uniqueJobsCount = new Set(assignments.map(function (a) { return a.job; })).size;
    const uniqueWivesCount = new Set(assignments.map(function (a) { return a.wife; })).size;
    const uniqueHousesCount = new Set(assignments.map(function (a) { return a.house; })).size;
    const uniqueGossipCount = new Set(assignments.map(function (a) { return a.phrase; })).size;
    const wideOpenYawnCount = canonicalScenes.filter(function (s) { return s.hasWideOpenYawn; }).length;
    const distinctYawnMouthsCount = new Set(
      wideOpenYawns.map(function (y) { return y.citizenIndex; })
    ).size;
    const sceneActorsRotatedCount = canonicalScenes.filter(function (s) {
      return s.actorsRotatedFromPrevious;
    }).length;
    const yawnMouthsRotatedCount = wideOpenYawns.filter(function (y) {
      return y.rotatedMouthFromPrevious;
    }).length;

    const canonicalSignature =
      "SCENES:" +
      canonicalScenes.length +
      "|JOBS:" +
      uniqueJobsCount +
      "|DEBTS:" +
      twelveGrossiEdges +
      "x12g|YAWNS:" +
      wideOpenYawnCount;

    const sceneStructureDigest = canonicalScenes
      .map(function (s) { return s.invariantKey; })
      .join("||");

    const targetSignature = originBaseline ? originBaseline.canonicalSignature : CANONICAL_SIGNATURE;
    const targetDigest = originBaseline ? originBaseline.sceneStructureDigest : sceneStructureDigest;

    const checks = [
      canonicalSignature === targetSignature,
      sceneStructureDigest === targetDigest,
      uniqueJobsCount === 8 && uniqueWivesCount === 8 && uniqueHousesCount === 8 && uniqueGossipCount === 8,
      debtDegreeSequence === "in:1x8|out:1x8" && isSingleDebtCycle && twelveGrossiEdges === 8,
      wealthGini === 0,
      wideOpenYawnCount === 3 && distinctYawnMouthsCount === 3
    ];
    const passedCount = checks.filter(Boolean).length;
    const isIsomorphicToOrigin = passedCount === checks.length;
    const invarianceScore = isIsomorphicToOrigin ? 1.0 : passedCount / checks.length;

    return {
      citizensChangedCount: citizensChangedCount,
      fixedPoints: fixedPoints,
      individualChangeRatio: individualChangeRatio,
      wealthGini: wealthGini,
      debtDegreeSequence: debtDegreeSequence,
      debtCycleLength: debtCycleLength,
      isSingleDebtCycle: isSingleDebtCycle,
      activeUniqueJobsCount: uniqueJobsCount,
      wideOpenYawnCount: wideOpenYawnCount,
      distinctYawnMouthsCount: distinctYawnMouthsCount,
      sceneActorsRotatedCount: sceneActorsRotatedCount,
      yawnMouthsRotatedCount: yawnMouthsRotatedCount,
      canonicalSignature: canonicalSignature,
      sceneStructureDigest: sceneStructureDigest,
      isIsomorphicToOrigin: isIsomorphicToOrigin,
      invarianceScore: invarianceScore
    };
  }

  function createHistoryContainers() {
    const sets = [];
    const lists = [];
    for (let i = 0; i < CITIZENS.length; i += 1) {
      sets.push(new Set());
      lists.push([]);
    }
    return { sets: sets, lists: lists };
  }

  function createSocietyEngine(opts) {
    const options = opts && typeof opts === "object" ? opts : {};
    const onWearinessThreshold =
      typeof options.onWearinessThreshold === "function" ? options.onWearinessThreshold : null;

    let cityIndex = 0;
    let cityName = "";
    let windowVista = "";
    let permutationCount = 0;
    let daysInCurrentCity = 1;
    let daySecondsAcc = 0;
    let weariness = 0.18;
    let wearinessVectors = Object.assign({}, INITIAL_VECTORS);
    let isWearyForExodus = false;
    let selectedCitizenIndex = 0;
    let yawnWavePhase = 0;
    let yawnPulse = 0;
    let totalYawnChoirs = 0;
    let history = createHistoryContainers();
    let previousAssignments = null;
    let previousScenes = null;
    let assignments = [];
    let sceneBundle = { canonicalScenes: [], wideOpenYawns: [] };
    let originBaseline = null;
    let invarianceProof = null;

    function initEpochZero() {
      cityIndex = mod(Number(options.initialCityIndex) || 0, 7);
      cityName = resolveCityName(cityIndex, options.initialCityMeta);
      windowVista = resolveWindowVista(cityIndex, options.initialCityMeta);
      permutationCount = 0;
      daysInCurrentCity = 1;
      daySecondsAcc = 0;
      weariness = 0.18;
      wearinessVectors = Object.assign({}, INITIAL_VECTORS);
      isWearyForExodus = false;
      selectedCitizenIndex = 0;
      yawnWavePhase = 0;
      yawnPulse = 0;
      totalYawnChoirs = 0;
      history = createHistoryContainers();
      previousAssignments = null;
      previousScenes = null;

      assignments = buildCitizenAssignments(0, windowVista, history.sets, history.lists, null);
      sceneBundle = buildCanonicalScenesAndYawns(assignments, null, yawnWavePhase, yawnPulse);
      const initialProof = computeInvarianceProof(
        assignments,
        null,
        sceneBundle.canonicalScenes,
        sceneBundle.wideOpenYawns,
        0,
        null
      );
      originBaseline = {
        canonicalSignature: initialProof.canonicalSignature,
        sceneStructureDigest: initialProof.sceneStructureDigest
      };
      invarianceProof = computeInvarianceProof(
        assignments,
        null,
        sceneBundle.canonicalScenes,
        sceneBundle.wideOpenYawns,
        0,
        originBaseline
      );
    }

    function getState() {
      return {
        cityIndex: cityIndex,
        cityName: cityName,
        windowVista: windowVista,
        permutationCount: permutationCount,
        daysInCurrentCity: daysInCurrentCity,
        weariness: weariness,
        wearinessVectors: Object.assign({}, wearinessVectors),
        isWearyForExodus: isWearyForExodus,
        selectedCitizenIndex: selectedCitizenIndex,
        selectedCitizen: assignments[selectedCitizenIndex],
        assignments: assignments.slice(),
        previousAssignments: previousAssignments ? previousAssignments.slice() : null,
        canonicalScenes: sceneBundle.canonicalScenes.slice(),
        wideOpenYawns: sceneBundle.wideOpenYawns.slice(),
        wideOpenYawnCount: invarianceProof.wideOpenYawnCount,
        yawnWavePhase: yawnWavePhase,
        yawnPulse: yawnPulse,
        totalYawnChoirs: totalYawnChoirs,
        invarianceProof: Object.assign({}, invarianceProof),
        citizensChangedCount: invarianceProof.citizensChangedCount,
        fixedPoints: invarianceProof.fixedPoints,
        individualChangeRatio: invarianceProof.individualChangeRatio,
        wealthGini: invarianceProof.wealthGini,
        debtDegreeSequence: invarianceProof.debtDegreeSequence,
        canonicalSignature: invarianceProof.canonicalSignature,
        isIsomorphicToOrigin: invarianceProof.isIsomorphicToOrigin,
        invarianceScore: invarianceProof.invarianceScore
      };
    }

    function advanceWearinessInternal(delta, focusBurden) {
      const d = Math.max(0, Number(delta) || 0);
      if (d <= 0) {
        return;
      }
      const wasWeary = isWearyForExodus;
      weariness = clamp01(weariness + d);
      for (let i = 0; i < WEARINESS_BURDENS.length; i += 1) {
        const burden = WEARINESS_BURDENS[i];
        const focusBoost = focusBurden === burden ? 1.38 : 1.0;
        wearinessVectors[burden] = clamp01(
          wearinessVectors[burden] + d * BURDEN_RATES[burden] * focusBoost
        );
        if (weariness >= 1.0) {
          wearinessVectors[burden] = clamp01(Math.max(wearinessVectors[burden], 0.98));
        }
      }
      if (weariness >= 1.0) {
        isWearyForExodus = true;
        if (!wasWeary && onWearinessThreshold) {
          onWearinessThreshold(getState());
        }
      }
    }

    function addWeariness(delta, focusBurden) {
      const stepDelta = delta === undefined ? 0.22 : Number(delta);
      advanceWearinessInternal(stepDelta, focusBurden || null);
      return getState();
    }

    function step(dtSec, isExodusInProgress) {
      const dt = Math.max(0, Math.min(0.25, Number(dtSec) || 0));
      yawnWavePhase = (yawnWavePhase + dt * 1.65) % (Math.PI * 200);
      yawnPulse = Math.max(0, yawnPulse - dt * 0.85);
      sceneBundle = buildCanonicalScenesAndYawns(
        assignments,
        previousScenes,
        yawnWavePhase,
        yawnPulse
      );
      if (!isExodusInProgress && dt > 0) {
        daySecondsAcc += dt;
        daysInCurrentCity = 1 + Math.floor(daySecondsAcc / 2.4);
        advanceWearinessInternal(dt * 0.022, null);
      }
      return getState();
    }

    function permuteForNewCity(newCityIndex, newCityMeta) {
      previousAssignments = assignments.slice();
      previousScenes = sceneBundle.canonicalScenes.slice();
      permutationCount += 1;
      const nextIdx =
        newCityIndex === undefined || !Number.isFinite(Number(newCityIndex))
          ? cityIndex + 1
          : Number(newCityIndex);
      cityIndex = mod(Math.trunc(nextIdx), 7);
      cityName = resolveCityName(cityIndex, newCityMeta);
      windowVista = resolveWindowVista(cityIndex, newCityMeta);
      weariness = 0.04;
      wearinessVectors = Object.assign({}, FRESH_EXODUS_VECTORS);
      isWearyForExodus = false;
      daysInCurrentCity = 1;
      daySecondsAcc = 0;

      assignments = buildCitizenAssignments(
        permutationCount,
        windowVista,
        history.sets,
        history.lists,
        previousAssignments
      );
      sceneBundle = buildCanonicalScenesAndYawns(
        assignments,
        previousScenes,
        yawnWavePhase,
        yawnPulse
      );
      invarianceProof = computeInvarianceProof(
        assignments,
        previousAssignments,
        sceneBundle.canonicalScenes,
        sceneBundle.wideOpenYawns,
        permutationCount,
        originBaseline
      );
      return getState();
    }

    function selectCitizen(indexOrId) {
      if (typeof indexOrId === "string") {
        const key = indexOrId.trim().toLowerCase();
        for (let i = 0; i < CITIZENS.length; i += 1) {
          if (CITIZENS[i].id === key || CITIZENS[i].name.toLowerCase() === key) {
            selectedCitizenIndex = i;
            return getState();
          }
        }
        const parsed = Number(key);
        if (Number.isFinite(parsed)) {
          selectedCitizenIndex = mod(Math.trunc(parsed), CITIZENS.length);
        }
      } else if (typeof indexOrId === "number" && Number.isFinite(indexOrId)) {
        selectedCitizenIndex = mod(Math.trunc(indexOrId), CITIZENS.length);
      }
      return getState();
    }

    function triggerYawnPulse() {
      yawnPulse = 1.0;
      totalYawnChoirs += 1;
      yawnWavePhase = (yawnWavePhase + 0.65) % (Math.PI * 200);
      sceneBundle = buildCanonicalScenesAndYawns(
        assignments,
        previousScenes,
        yawnWavePhase,
        yawnPulse
      );
      return getState();
    }

    function reset() {
      initEpochZero();
      return getState();
    }

    initEpochZero();

    return {
      getState: getState,
      addWeariness: addWeariness,
      step: step,
      permuteForNewCity: permuteForNewCity,
      selectCitizen: selectCitizen,
      triggerYawnPulse: triggerYawnPulse,
      reset: reset
    };
  }

  const EutropiaIsomorphicSociety = Object.freeze({
    CITIZENS: CITIZENS,
    JOBS: JOBS,
    WIVES: WIVES,
    HOUSES: HOUSES,
    DEBT_LEDGER_KINDS: DEBT_LEDGER_KINDS,
    PASTIMES_AND_GOSSIP: PASTIMES_AND_GOSSIP,
    WEARINESS_BURDENS: WEARINESS_BURDENS,
    CANONICAL_SIGNATURE: CANONICAL_SIGNATURE,
    createSocietyEngine: createSocietyEngine
  });

  root.EutropiaIsomorphicSociety = EutropiaIsomorphicSociety;
  if (typeof window !== "undefined") {
    window.EutropiaIsomorphicSociety = EutropiaIsomorphicSociety;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
