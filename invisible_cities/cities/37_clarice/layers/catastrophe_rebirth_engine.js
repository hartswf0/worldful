(function initClariceEpochEngine(root) {
  "use strict";

  const CONSERVED_SHARD_MASS = 108;

  const ERA_REGIMES = Object.freeze([
    Object.freeze({
      index: 0,
      key: "court_splendor",
      label: "Sumptuous Court",
      shortLabel: "Court",
      accent: "#d8a24a"
    }),
    Object.freeze({
      index: 1,
      key: "beggar_salvage",
      label: "Beggar-Clarice Chrysalis",
      shortLabel: "Beggar",
      accent: "#7d5338"
    }),
    Object.freeze({
      index: 2,
      key: "museum_veneration",
      label: "Museum of Fragments",
      shortLabel: "Museum",
      accent: "#74969e"
    }),
    Object.freeze({
      index: 3,
      key: "butterfly_surge",
      label: "Butterfly Bricolage Surge",
      shortLabel: "Butterfly",
      accent: "#5c8754"
    })
  ]);

  const PHASE_LABELS = Object.freeze({
    palimpsest_equilibrium: "Heterochronic Palimpsest",
    plague_chrysalis: "Plague-Chrysalis Collapse",
    butterfly_splendor: "Butterfly-Splendor Surge",
    museum_veneration: "Museum of Fragments Veneration"
  });

  const STRATA_CATALOG = Object.freeze([
    Object.freeze({
      id: "sigma_acanthus",
      sigil: "\u03a3-ACANTHUS",
      title: "Portico of Fluted Acanthus Spolia",
      embeddedClue: "Chalk-lime mortar inside the stylobate beds crimson brocade threads and soot-glazed skillet iron.",
      candidateClaim: "Scholars of the Marble Portico claim these upright Corinthian capitals crowned the virgin First Clarice before any decay.",
      refutationProof: "Core-drilling the Pentelic acanthus volutes exposes wire chicken-run wear scars and calcified hen-droppings sealed beneath the earliest gilding.",
      contradictingRelicId: "corinthian_capitals",
      ordinalRank: null
    }),
    Object.freeze({
      id: "sigma_brocade",
      sigil: "\u03a3-BROCADE",
      title: "Brocade Curtain & Harem Loggia Horizon",
      embeddedClue: "Gold-bullion selvedges are knotted around splinters of charred cedar cornice and cellar bread-crusts.",
      candidateClaim: "Court chroniclers cite the embroidered silk curtains and filigreed harem gratings as the untouched dawn of Clarice.",
      refutationProof: "Warp threads beneath the palace embroidery retain pauper-bundle knot creases and Museum vitrine pin-holes from an unnumbered prior dispersion.",
      contradictingRelicId: "silk_brocade_curtains",
      ordinalRank: null
    }),
    Object.freeze({
      id: "sigma_cinder",
      sigil: "\u03a3-CINDER",
      title: "Inlaid-Wood Skillet Ash & Beggar Rubble",
      embeddedClue: "Cat-meat hearth ash holds fused teardrops of ballroom rock crystal and repousse silver solder.",
      candidateClaim: "Ascetic annalists argue Clarice began as a huddle of survivors roasting meat on iron gratings over splintered marquetry.",
      refutationProof: "Every skillet in the soot lens bears harem-window hinge mortises and regilded melon-trellis patina older than the hearth.",
      contradictingRelicId: "wrought_harem_gratings",
      ordinalRank: null
    }),
    Object.freeze({
      id: "sigma_vitrine",
      sigil: "\u03a3-VITRINE",
      title: "Basalt Vault of the Museum of Fragments",
      embeddedClue: "Beveled reliquary bell jars rest upon plinths packed with whitewashed funerary-urn rubble and palm-tub bronze hoops.",
      candidateClaim: "Curators maintain the Museum of Capitals preserves pure relics rescued directly from the singular First Clarice.",
      refutationProof: "Inside each sacred bell jar sit shards of an earlier Museum's shattered bell jars, proving veneration itself recycled older vitrines.",
      contradictingRelicId: "velvet_bell_jars",
      ordinalRank: null
    }),
    Object.freeze({
      id: "sigma_chrysalis",
      sigil: "\u03a3-CHRYSALIS",
      title: "Glass-Roofed Butterfly Shed & Melon Terrace",
      embeddedClue: "Inverted Corinthian capitals propping the glass rafters still hold dried basil roots in their carved abacus sockets.",
      candidateClaim: "Architects of the Butterfly Surge declare this sunlit patchwork Clarice to be the city's self-born archetype.",
      refutationProof: "Every lintel, prism cluster, and upside-down capital is a heterochronic splice of mismatched spolia with zero quarry-fresh stone.",
      contradictingRelicId: "gilded_cornices",
      ordinalRank: null
    }),
    Object.freeze({
      id: "sigma_basil",
      sigil: "\u03a3-BASIL",
      title: "Mausoleum Urn & Kitchen-Basil Terrace",
      embeddedClue: "Pentelic funerary urns packed with black herb loam conceal numbered Museum catalog marks etched inside their rims.",
      candidateClaim: "Necropolis epigraphers propose the carved marble funerary urns hold the ashes of the founders of the First Clarice.",
      refutationProof: "Beneath the funerary reliefs lie inverted column-pedestal dowel holes and kitchen-basil root casts predating the inscriptions.",
      contradictingRelicId: "marble_funerary_urns",
      ordinalRank: null
    })
  ]);

  function makeRole(roleIndex, label, reverence, utility, vignetteNote) {
    const regime = ERA_REGIMES[roleIndex];
    return Object.freeze({
      roleIndex: roleIndex,
      regimeKey: regime.key,
      label: label,
      reverence: reverence,
      utility: utility,
      vignetteNote: vignetteNote
    });
  }

  const FALLBACK_RELIC_CATALOG = Object.freeze([
    Object.freeze({
      index: 0, id: "silk_brocade_curtains", keyNum: 1, shardMass: 14, material: "silk",
      title: "Silk & Brocade Curtains", shortTitle: "Silk Curtains",
      roles: Object.freeze([
        makeRole(0, "Embroidered silk & brocade palace curtains", 0.84, 0.46, "Draped across tall palace archways in crimson-gold folds."),
        makeRole(1, "Brocade bedsheets & knotted pauper bundles", 0.12, 0.93, "Torn into alley bedsheets and knotted bundles of survival goods."),
        makeRole(2, "Bundle-scraps enshrined in glass cases of the Museum of Fragments", 0.96, 0.11, "Frayed pauper knots pinned beneath museum glass for paying visitors."),
        makeRole(3, "Patchwork brocade canopies shading rooftop loggias", 0.72, 0.84, "Stitched mismatching silk awnings billowing above sunlit terraces.")
      ])
    }),
    Object.freeze({
      index: 1, id: "marble_funerary_urns", keyNum: 2, shardMass: 13, material: "marble",
      title: "Marble Funerary Urns", shortTitle: "Funerary Urns",
      roles: Object.freeze([
        makeRole(0, "Carved Pentelic marble funerary urns on mausoleum plinths", 0.90, 0.34, "Fluted Pentelic ash vessels flanking ancestral porticoes."),
        makeRole(1, "Broken marble funerary urns planted with kitchen basil", 0.16, 0.94, "Cracked marble bellies packed with dark loam and fragrant basil shoots."),
        makeRole(2, "Calibrated funerary urn shards in the Museum of Fragments", 0.95, 0.12, "Numbered Pentelic rim fragments cradled on brass museum calipers."),
        makeRole(3, "Whitewashed marble urns wedged as column pedestals", 0.68, 0.86, "Chalk-washed funerary urns inverted to bear newly raised colonnades.")
      ])
    }),
    Object.freeze({
      index: 2, id: "wrought_harem_gratings", keyNum: 3, shardMass: 12, material: "iron",
      title: "Wrought-Iron Harem Gratings", shortTitle: "Harem Gratings",
      roles: Object.freeze([
        makeRole(0, "Filigreed wrought-iron harem window gratings", 0.78, 0.52, "Latticed iron mashrabiya screens veiling upper seraglio windows."),
        makeRole(1, "Sooty iron skillets roasting cat-meat on fires of inlaid wood", 0.09, 0.97, "Laid flat across splintered marquetry embers as blackened alley grills."),
        makeRole(2, "Catalogued iron scrollwork hung in the Museum gallery", 0.92, 0.14, "Soot-cleaned arabesque grilles suspended against velvet museum panels."),
        makeRole(3, "Regilded harem gratings training rooftop melon vines", 0.70, 0.85, "Gold-brushed iron lattices supporting heavy striped rooftop melons.")
      ])
    }),
    Object.freeze({
      index: 3, id: "corinthian_capitals", keyNum: 4, shardMass: 16, material: "marble",
      title: "Corinthian Marble Capitals", shortTitle: "Corinthian Capitals",
      roles: Object.freeze([
        makeRole(0, "Fluted Corinthian marble capitals crowning portico columns", 0.91, 0.58, "Crisp acanthus volutes bearing gilded entablatures aloft."),
        makeRole(1, "Toppled Corinthian capitals forgotten in muddy chicken runs", 0.11, 0.89, "Fallen marble volutes pecked by hens inside wire-fenced coops."),
        makeRole(2, "Velvet-plinth specimens in the Museum of Capitals", 0.99, 0.09, "Spotlit acanthus crowns venerated in the silent Museum of Capitals."),
        makeRole(3, "Upside-down Corinthian capitals propping glass-roofed sheds & melons", 0.76, 0.88, "Inverted marble capitals wedged beneath glass rafters and ripe melons.")
      ])
    }),
    Object.freeze({
      index: 4, id: "velvet_bell_jars", keyNum: 5, shardMass: 10, material: "glass",
      title: "Velvet-Cushioned Bell Jars", shortTitle: "Bell Jars",
      roles: Object.freeze([
        makeRole(0, "Velvet-cushioned parlor bell jars housing gilt curiosities", 0.83, 0.40, "Blown-glass parlor domes sheltering filigree automata on crimson plush."),
        makeRole(1, "Inverted cellar bell jars shielding dry crusts from rats", 0.14, 0.92, "Chipped glass domes turned rim-down over hoarded bread in damp vaults."),
        makeRole(2, "Reliquary bell jars encasing shards of earlier bell jars", 0.97, 0.10, "Museum domes enshrining curved splinters of older shattered domes."),
        makeRole(3, "Sun-warmed cloches forcing citron grafts on terrace parapets", 0.71, 0.83, "Condensation-beaded glass cloches nursing grafted citrus shoots.")
      ])
    }),
    Object.freeze({
      index: 5, id: "silver_soup_tureens", keyNum: 6, shardMass: 11, material: "silver",
      title: "Silver Banquet Soup Tureens", shortTitle: "Soup Tureens",
      roles: Object.freeze([
        makeRole(0, "Repousse silver banquet soup tureens", 0.85, 0.50, "Crested banquet vessels steaming on inlaid dining boards."),
        makeRole(1, "Dented tarnished tureens catching roof-drip rainwater", 0.13, 0.95, "Hammer-scarred silver basins set beneath leaking vault seams."),
        makeRole(2, "Spotlit ritual vessels in the Museum of Fragments", 0.94, 0.12, "Tarnished banquet bowls misclassified as archaic libation vessels."),
        makeRole(3, "Chilled pomegranate-ice centerpieces on marble tables", 0.77, 0.79, "Polished spolia basins heaped with snow and ruby pomegranate seeds.")
      ])
    }),
    Object.freeze({
      index: 6, id: "gilded_cornices", keyNum: 7, shardMass: 11, material: "wood_gilt",
      title: "Gilded & Inlaid Cornices", shortTitle: "Gilded Cornices",
      roles: Object.freeze([
        makeRole(0, "Gilded & inlaid cedar ceiling cornices", 0.86, 0.48, "Mother-of-pearl and gold-leaf cedar moldings framing coffered halls."),
        makeRole(1, "Splintered inlaid kindling feeding alley skillet-fires", 0.08, 0.96, "Cracked marquetry beams snapped to feed crackling skillet hearths."),
        makeRole(2, "Half-charred gilt frieze splinters under beveled Museum glass", 0.93, 0.11, "Singed cedar dentils mounted like sacred epigraphic tablets."),
        makeRole(3, "Asymmetric gilded cornices spliced onto new arch lintels", 0.74, 0.82, "Mismatched gilt moldings bolted crosswise over airy loggia arches.")
      ])
    }),
    Object.freeze({
      index: 7, id: "crystal_chandeliers", keyNum: 8, shardMass: 11, material: "glass",
      title: "Rock-Crystal Chandeliers", shortTitle: "Chandeliers",
      roles: Object.freeze([
        makeRole(0, "Tiered rock-crystal ballroom chandeliers", 0.89, 0.49, "Cascading candlelit crystal tiers multiplying ballroom reflections."),
        makeRole(1, "Unstrung crystal prism-beads bartered in rubble alleys", 0.17, 0.87, "Loose faceted teardrops traded by weight for oil and salt."),
        makeRole(2, "Numbered crystal teardrops suspended in Museum vitrines", 0.96, 0.13, "Single catalogued prisms hung on silk threads inside dark cases."),
        makeRole(3, "Refracting prism clusters hung beneath glass-roofed sheds", 0.79, 0.81, "Re-strung chandelier pendants scattering rainbows across melon beds.")
      ])
    }),
    Object.freeze({
      index: 8, id: "dwarf_palm_tubs", keyNum: 9, shardMass: 10, material: "marble",
      title: "Dwarf-Palm Parlor Tubs", shortTitle: "Palm Tubs",
      roles: Object.freeze([
        makeRole(0, "Bronze-hooped tubs holding parlor dwarf palms", 0.76, 0.54, "Carved stone planters ringing sunlit winter-garden salons."),
        makeRole(1, "Cracked palm tubs serving as beggar-alley wash troughs", 0.12, 0.93, "Pitch-caulked planter basins scrubbing rags in crowded courtyards."),
        makeRole(2, "Roped-off terracotta palm tubs in the Museum vestibule", 0.90, 0.15, "Empty hooped tubs guarded behind braided crimson museum cords."),
        makeRole(3, "Repainted palm tubs cradling inverted marble capitals", 0.69, 0.84, "Lime-tinted tubs socketed as collars under upside-down capitals.")
      ])
    })
  ]);

  const INITIAL_ROLE_MAP = Object.freeze({
    silk_brocade_curtains: 2,
    marble_funerary_urns: 1,
    wrought_harem_gratings: 1,
    corinthian_capitals: 1,
    velvet_bell_jars: 2,
    silver_soup_tureens: 1,
    gilded_cornices: 3,
    crystal_chandeliers: 2,
    dwarf_palm_tubs: 3
  });

  const STRATA_BY_ID = Object.freeze(
    STRATA_CATALOG.reduce(function mapStrata(acc, item) {
      acc[item.id] = item;
      return acc;
    }, {})
  );

  const INITIAL_STRATA_IDS = Object.freeze(
    STRATA_CATALOG.map(function pluckId(item) {
      return item.id;
    })
  );

  function clamp01(value) {
    if (value < 0) return 0;
    if (value > 1) return 1;
    return value;
  }

  function round4(value) {
    return Number(value.toFixed(4));
  }

  function normalizeUnit(value, fallback) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      return fallback;
    }
    const scaled = value > 1 ? value / 100 : value;
    return clamp01(scaled);
  }

  function resolveCatalog(opts) {
    const external =
      (opts && Array.isArray(opts.catalog) && opts.catalog) ||
      (root && root.ClariceRelicPermutations && Array.isArray(root.ClariceRelicPermutations.RELIC_CATALOG)
        ? root.ClariceRelicPermutations.RELIC_CATALOG
        : null);

    if (!external) {
      return FALLBACK_RELIC_CATALOG;
    }

    const byId = {};
    for (let i = 0; i < external.length; i += 1) {
      const candidate = external[i];
      if (candidate && typeof candidate.id === "string") {
        byId[candidate.id] = candidate;
      }
    }

    return Object.freeze(
      FALLBACK_RELIC_CATALOG.map(function mergeRelic(base) {
        const ext = byId[base.id];
        if (!ext) return base;
        const extRoles = Array.isArray(ext.roles) ? ext.roles : [];
        const mergedRoles = Object.freeze(
          base.roles.map(function mergeRole(baseRole, rIdx) {
            const extRole = extRoles[rIdx] || {};
            return Object.freeze({
              roleIndex: rIdx,
              regimeKey: ERA_REGIMES[rIdx].key,
              label: typeof extRole.label === "string" && extRole.label.length > 0 ? extRole.label : baseRole.label,
              reverence: normalizeUnit(extRole.reverence, baseRole.reverence),
              utility: normalizeUnit(extRole.utility, baseRole.utility),
              vignetteNote:
                typeof extRole.vignetteNote === "string" && extRole.vignetteNote.length > 0
                  ? extRole.vignetteNote
                  : baseRole.vignetteNote
            });
          })
        );
        return Object.freeze({
          index: base.index,
          id: base.id,
          keyNum: base.keyNum,
          shardMass: base.shardMass,
          material: typeof ext.material === "string" && ext.material.length > 0 ? ext.material : base.material,
          title: typeof ext.title === "string" && ext.title.length > 0 ? ext.title : base.title,
          shortTitle:
            typeof ext.shortTitle === "string" && ext.shortTitle.length > 0 ? ext.shortTitle : base.shortTitle,
          roles: mergedRoles
        });
      })
    );
  }

  function makeStratumSnapshot(stratum) {
    const snap = {
      id: stratum.id,
      sigil: stratum.sigil,
      title: stratum.title,
      embeddedClue: stratum.embeddedClue,
      candidateClaim: stratum.candidateClaim,
      refutationProof: stratum.refutationProof,
      contradictingRelicId: stratum.contradictingRelicId,
      ordinalRank: null
    };
    Object.defineProperty(snap, "toString", {
      value: function stratumToString() {
        return stratum.id;
      },
      enumerable: false
    });
    return Object.freeze(snap);
  }

  function derangeStrataIds(currentIds, nextRand) {
    const len = currentIds.length;
    const initialSig = INITIAL_STRATA_IDS.join("|");
    const currentSig = currentIds.join("|");

    for (let attempt = 0; attempt < 28; attempt += 1) {
      const draft = currentIds.slice();
      for (let i = len - 1; i > 0; i -= 1) {
        const j = Math.floor(nextRand() * (i + 1));
        const tmp = draft[i];
        draft[i] = draft[j];
        draft[j] = tmp;
      }
      let fixedPoint = false;
      for (let k = 0; k < len; k += 1) {
        if (draft[k] === currentIds[k]) {
          fixedPoint = true;
          break;
        }
      }
      const sig = draft.join("|");
      if (!fixedPoint && sig !== currentSig && sig !== initialSig) {
        return draft;
      }
    }

    for (let shift = 1; shift < len; shift += 1) {
      const rotated = currentIds.map(function shiftItem(_, idx) {
        return currentIds[(idx + shift) % len];
      });
      const sig = rotated.join("|");
      if (sig !== currentSig && sig !== initialSig) {
        return rotated;
      }
    }
    return currentIds.slice().reverse();
  }

  function computeMetrics(records) {
    let totalMass = 0;
    let weightedRev = 0;
    let weightedUtil = 0;
    const seenRegimes = {};
    let distinctCount = 0;
    for (let i = 0; i < records.length; i += 1) {
      const rec = records[i];
      const role = rec.def.roles[rec.roleIndex];
      totalMass += rec.def.shardMass;
      weightedRev += role.reverence * rec.def.shardMass;
      weightedUtil += role.utility * rec.def.shardMass;
      if (!seenRegimes[rec.roleIndex]) {
        seenRegimes[rec.roleIndex] = true;
        distinctCount += 1;
      }
    }
    let neighborDelta = 0;
    for (let j = 0; j < records.length; j += 1) {
      const cur = records[j].def.roles[records[j].roleIndex];
      const nxt = records[(j + 1) % records.length].def.roles[records[(j + 1) % records.length].roleIndex];
      neighborDelta += 0.5 * (Math.abs(cur.reverence - nxt.reverence) + Math.abs(cur.utility - nxt.utility));
    }
    const diversity = (distinctCount - 1) / 3;
    const meanPairContrast = neighborDelta / records.length;
    return {
      conservedShardMass: totalMass,
      meanReverence: round4(weightedRev / totalMass),
      meanUtility: round4(weightedUtil / totalMass),
      juxtapositionContrast: round4(clamp01(0.14 + 0.44 * diversity + 0.52 * meanPairContrast))
    };
  }

  function createEpochEngine(opts) {
    const catalog = resolveCatalog(opts || {});
    let phase = "palimpsest_equilibrium";
    let cycleCount = 0, plagueCount = 0, butterflySurgeCount = 0, museumCycleCount = 0;
    let shuffleCount = 0, hypothesisTestsRun = 0;
    let populationIndex = 0.56, entropyLoss = 0.46, provenanceEntropy = 0.54;
    let prngState = 0x37c1a91c, auditCursor = 0, relicCursor = 0;
    let strataIds = INITIAL_STRATA_IDS.slice();
    let lastHypothesisAudit = null;
    let chronicleNote = "";
    let relicRecords = [];

    function nextRand() {
      prngState = (prngState + 0x6d2b79f5) | 0;
      let t = Math.imul(prngState ^ (prngState >>> 15), 1 | prngState);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    function advanceEntropy(factor) {
      entropyLoss = Math.max(0.000001, entropyLoss * factor);
      const candidate = Number((1 - entropyLoss).toFixed(6));
      provenanceEntropy = candidate > provenanceEntropy
        ? candidate
        : Math.min(0.999999, Number((provenanceEntropy + 0.000001).toFixed(6)));
    }

    function applyRoleTargets(targetMap) {
      for (let i = 0; i < relicRecords.length; i += 1) {
        const rec = relicRecords[i];
        const nextRole = targetMap[rec.def.id];
        if (typeof nextRole === "number" && nextRole >= 0 && nextRole <= 3 && nextRole !== rec.roleIndex) {
          rec.previousRoleIndex = rec.roleIndex;
          rec.roleIndex = nextRole;
          rec.permutationCount += 1;
        }
      }
    }

    function initBaseline() {
      phase = "palimpsest_equilibrium";
      cycleCount = 0; plagueCount = 0; butterflySurgeCount = 0; museumCycleCount = 0;
      shuffleCount = 0; hypothesisTestsRun = 0;
      populationIndex = 0.56; entropyLoss = 0.46; provenanceEntropy = 0.54;
      prngState = 0x37c1a91c; auditCursor = 0; relicCursor = 0;
      strataIds = INITIAL_STRATA_IDS.slice();
      lastHypothesisAudit = null;
      relicRecords = catalog.map(function seedRelic(def) {
        return { def: def, roleIndex: INITIAL_ROLE_MAP[def.id], previousRoleIndex: 0, permutationCount: 0 };
      });
      chronicleNote =
        "Clarice opens mid-palimpsest: pauper silk knots gleam inside Museum glass while Corinthian capitals lie in muddy chicken runs and basil sprouts from broken Pentelic urns; 108 shards endure with no recoverable first era.";
    }

    function getState() {
      const metrics = computeMetrics(relicRecords);
      const roleMap = {};
      const relicStates = Object.freeze(
        relicRecords.map(function buildRelicSnap(rec) {
          const curRole = rec.def.roles[rec.roleIndex];
          const prevRole = rec.def.roles[rec.previousRoleIndex];
          roleMap[rec.def.id] = rec.roleIndex;
          return Object.freeze({
            id: rec.def.id, keyNum: rec.def.keyNum, title: rec.def.title, shortTitle: rec.def.shortTitle,
            material: rec.def.material, shardMass: rec.def.shardMass,
            roleIndex: rec.roleIndex, previousRoleIndex: rec.previousRoleIndex,
            regimeKey: curRole.regimeKey, roleLabel: curRole.label, previousRoleLabel: prevRole.label,
            reverence: curRole.reverence, utility: curRole.utility, vignetteNote: curRole.vignetteNote,
            permutationCount: rec.permutationCount
          });
        })
      );
      const strataOrder = Object.freeze(strataIds.map(function mapSnap(id) { return makeStratumSnapshot(STRATA_BY_ID[id]); }));
      return Object.freeze({
        phase: phase, phaseLabel: PHASE_LABELS[phase] || PHASE_LABELS.palimpsest_equilibrium,
        cycleCount: cycleCount, plagueCount: plagueCount,
        butterflySurgeCount: butterflySurgeCount, museumCycleCount: museumCycleCount,
        shuffleCount: shuffleCount, hypothesisTestsRun: hypothesisTestsRun,
        firstClariceProven: false, eraOrderRecoverable: false,
        conservedShardMass: CONSERVED_SHARD_MASS, initialShardMass: CONSERVED_SHARD_MASS,
        massConserved: metrics.conservedShardMass === CONSERVED_SHARD_MASS,
        populationIndex: populationIndex, meanReverence: metrics.meanReverence,
        meanUtility: metrics.meanUtility, provenanceEntropy: provenanceEntropy,
        juxtapositionContrast: metrics.juxtapositionContrast,
        relicStates: relicStates, relicRoleMap: Object.freeze(roleMap),
        strataOrder: strataOrder, strataIds: Object.freeze(strataIds.slice()),
        lastHypothesisAudit: lastHypothesisAudit, chronicleNote: chronicleNote
      });
    }

    function triggerPlagueCatastrophe() {
      cycleCount += 1; plagueCount += 1; phase = "plague_chrysalis";
      populationIndex = [0.19, 0.17, 0.22, 0.18, 0.21][(plagueCount - 1) % 5];
      const holdovers = ["velvet_bell_jars", "crystal_chandeliers", "dwarf_palm_tubs", "silver_soup_tureens"];
      const holdId = holdovers[(plagueCount - 1) % holdovers.length];
      const targets = {
        silk_brocade_curtains: 1, marble_funerary_urns: 1, wrought_harem_gratings: 1,
        corinthian_capitals: 1, velvet_bell_jars: 1, silver_soup_tureens: 1,
        gilded_cornices: 1, crystal_chandeliers: 1, dwarf_palm_tubs: 1
      };
      targets[holdId] = plagueCount % 2 === 1 ? 2 : 0;
      applyRoleTargets(targets);
      strataIds = derangeStrataIds(strataIds, nextRand);
      advanceEntropy(0.84);
      chronicleNote = "Plague #" + plagueCount + " hollows Clarice into a beggar-chrysalis: capitals sink into chicken runs, basil fills broken funerary urns, and harem gratings roast cat-meat over inlaid kindling while 108 shards persist.";
      return getState();
    }

    function triggerButterflySurge() {
      cycleCount += 1; butterflySurgeCount += 1; phase = "butterfly_splendor";
      populationIndex = [0.91, 0.94, 0.88, 0.95, 0.89][(butterflySurgeCount - 1) % 5];
      const rot = ["velvet_bell_jars", "silver_soup_tureens", "dwarf_palm_tubs"];
      const targets = {
        silk_brocade_curtains: 3, marble_funerary_urns: 3, wrought_harem_gratings: 3,
        corinthian_capitals: 3, gilded_cornices: 3, crystal_chandeliers: 3
      };
      targets[rot[(butterflySurgeCount - 1) % 3]] = 3;
      targets[rot[butterflySurgeCount % 3]] = 2;
      targets[rot[(butterflySurgeCount + 1) % 3]] = 0;
      applyRoleTargets(targets);
      strataIds = derangeStrataIds(strataIds, nextRand);
      advanceEntropy(0.84);
      chronicleNote = "Butterfly Surge #" + butterflySurgeCount + " bursts from the beggar-Clarice chrysalis: upside-down Corinthian capitals prop glass-roofed melon sheds above whitewashed urn pedestals as population swells.";
      return getState();
    }

    function triggerMuseumVeneration() {
      cycleCount += 1; museumCycleCount += 1; phase = "museum_veneration";
      populationIndex = [0.64, 0.62, 0.67, 0.65][(museumCycleCount - 1) % 4];
      const streetPool = ["wrought_harem_gratings", "silver_soup_tureens", "gilded_cornices", "dwarf_palm_tubs"];
      const streetId = streetPool[(museumCycleCount - 1) % streetPool.length];
      const targets = {
        silk_brocade_curtains: 2, marble_funerary_urns: 2, wrought_harem_gratings: 2,
        corinthian_capitals: 2, velvet_bell_jars: 2, silver_soup_tureens: 2,
        gilded_cornices: 2, crystal_chandeliers: 2, dwarf_palm_tubs: 2
      };
      targets[streetId] = museumCycleCount % 2 === 1 ? 3 : 1;
      applyRoleTargets(targets);
      strataIds = derangeStrataIds(strataIds, nextRand);
      advanceEntropy(0.86);
      chronicleNote = "Museum Cycle #" + museumCycleCount + " seals knotted pauper bundles, acanthus capitals, urn shards, bell jars, and crystal teardrops under beveled glass while street spolia stays stubbornly out of place.";
      return getState();
    }

    function findRelicRecord(relicId) {
      if (typeof relicId === "string" && relicId.length > 0) {
        const asNum = Number(relicId);
        for (let i = 0; i < relicRecords.length; i += 1) {
          if (relicRecords[i].def.id === relicId || (Number.isInteger(asNum) && relicRecords[i].def.keyNum === asNum)) {
            return relicRecords[i];
          }
        }
      } else if (typeof relicId === "number" && Number.isInteger(relicId)) {
        for (let j = 0; j < relicRecords.length; j += 1) {
          if (relicRecords[j].def.keyNum === relicId) return relicRecords[j];
        }
        if (relicId >= 0 && relicId < relicRecords.length) return relicRecords[relicId];
      }
      const picked = relicRecords[relicCursor % relicRecords.length];
      relicCursor += 1;
      return picked;
    }

    function permuteRelic(relicId, explicitRoleIndex) {
      const rec = findRelicRecord(relicId);
      const validExplicit =
        typeof explicitRoleIndex === "number" &&
        Number.isInteger(explicitRoleIndex) &&
        explicitRoleIndex >= 0 &&
        explicitRoleIndex <= 3;
      const nextRole = validExplicit ? explicitRoleIndex : (rec.roleIndex + 1) % 4;
      if (nextRole !== rec.roleIndex) {
        rec.previousRoleIndex = rec.roleIndex;
      }
      rec.roleIndex = nextRole;
      rec.permutationCount += 1;
      advanceEntropy(0.95);
      const nextLabel = rec.def.roles[nextRole].label;
      chronicleNote =
        rec.def.title + " (" + rec.def.shardMass + " shards) repurposed as: " + nextLabel + " — 108 total shards conserved across lost Clarices.";
      return getState();
    }

    function shuffleEras() {
      shuffleCount += 1;
      strataIds = derangeStrataIds(strataIds, nextRand);
      advanceEntropy(0.88);
      const leadStratum = STRATA_BY_ID[strataIds[0]];
      chronicleNote =
        "Era Shuffle #" + shuffleCount + " scrambles the unnumbered strata (" + leadStratum.sigil + " surfaces atop older rubble): succession order remains irrecoverable.";
      return getState();
    }

    function resolveStratum(stratumId) {
      if (typeof stratumId === "string" && stratumId.length > 0) {
        if (STRATA_BY_ID[stratumId]) return STRATA_BY_ID[stratumId];
        for (let i = 0; i < STRATA_CATALOG.length; i += 1) {
          if (STRATA_CATALOG[i].sigil === stratumId) return STRATA_CATALOG[i];
        }
      } else if (typeof stratumId === "number" && Number.isInteger(stratumId) && stratumId >= 0 && stratumId < strataIds.length) {
        return STRATA_BY_ID[strataIds[stratumId]];
      }
      const nextId = strataIds[auditCursor % strataIds.length];
      auditCursor += 1;
      return STRATA_BY_ID[nextId];
    }

    function testFirstClariceHypothesis(stratumId) {
      const stratum = resolveStratum(stratumId);
      hypothesisTestsRun += 1;
      const linkedRec = findRelicRecord(stratum.contradictingRelicId);
      lastHypothesisAudit = Object.freeze({
        testNumber: hypothesisTestsRun,
        stratumId: stratum.id,
        sigil: stratum.sigil,
        title: stratum.title,
        embeddedClue: stratum.embeddedClue,
        candidateClaim: stratum.candidateClaim,
        refutationProof: stratum.refutationProof,
        contradictingRelicId: linkedRec.def.id,
        contradictingRelicTitle: linkedRec.def.title,
        liveRelicRoleLabel: linkedRec.def.roles[linkedRec.roleIndex].label,
        ordinalRank: null,
        verdict: "REFUTED_SPOLIA_PREEXISTS",
        firstClariceProven: false,
        eraOrderRecoverable: false
      });
      chronicleNote =
        "Origin Test #" + hypothesisTestsRun + " [" + stratum.sigil + "] REFUTED: " + stratum.refutationProof;
      return getState();
    }

    function reset() {
      initBaseline();
      return getState();
    }

    initBaseline();

    return Object.freeze({
      getState: getState,
      triggerPlagueCatastrophe: triggerPlagueCatastrophe,
      triggerButterflySurge: triggerButterflySurge,
      triggerMuseumVeneration: triggerMuseumVeneration,
      permuteRelic: permuteRelic,
      shuffleEras: shuffleEras,
      testFirstClariceHypothesis: testFirstClariceHypothesis,
      reset: reset
    });
  }

  const api = Object.freeze({
    CONSERVED_SHARD_MASS: CONSERVED_SHARD_MASS,
    ERA_REGIMES: ERA_REGIMES,
    STRATA_CATALOG: STRATA_CATALOG,
    FALLBACK_RELIC_CATALOG: FALLBACK_RELIC_CATALOG,
    INITIAL_ROLE_MAP: INITIAL_ROLE_MAP,
    createEpochEngine: createEpochEngine
  });

  root.ClariceEpochEngine = api;
  if (typeof window !== "undefined") {
    window.ClariceEpochEngine = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
