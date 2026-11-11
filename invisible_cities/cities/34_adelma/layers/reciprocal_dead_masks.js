(function () {
  "use strict";

  const PALETTE = Object.freeze({
    duskIndigo: "#111827",
    harborAbyss: "#0b111d",
    wetFlagstone: "#222c3d",
    oilLantern: "#eba038",
    lanternHalo: "#ffd37d",
    urchinViolet: "#7c498d",
    urchinSpine: "#a976bc",
    sackclothAsh: "#9e9382",
    boneParchment: "#e4dccf",
    feverOchre: "#cfa23c"
  });

  const PRIMARY_STONE_IDS = Object.freeze([
    "hawser_sailor",
    "urchin_fisherman",
    "straw_mat_sufferer",
    "gangplank_stevedore",
    "balcony_maiden",
    "scale_greengrocer"
  ]);

  const SECONDARY_STRANGER_IDS = Object.freeze([
    "net_mender",
    "upper_stair_porter",
    "lantern_trimmer",
    "cuttlefish_monger",
    "lateen_oarsman",
    "colonnade_widow"
  ]);

  const ALL_WHARF_IDS = Object.freeze([
    ...PRIMARY_STONE_IDS,
    ...SECONDARY_STRANGER_IDS
  ]);

  const CANONICAL_DEAD_MASKS = Object.freeze([
    Object.freeze({
      maskId: "dying_soldier_father",
      stoneId: "hawser_sailor",
      shortTitle: "Soldier Resembling My Dying Father",
      kinRole: "Father on the eve of death",
      featureSignature: "Hollowed martial jawline, salt-gray temple crease, dark tunic collar",
      maskHue: "#9e9382",
      irisHue: "#ffd37d",
      travelerRecognition: "Catching the wet mooring hawser at dusk landing, the sailor turns the hollowed brow of a soldier resembling my father the day before he died.",
      foreheadEcho: "If a dead soldier catches my mooring rope at landfall, have I disembarked beyond the living world?"
    }),
    Object.freeze({
      maskId: "fever_shipmate",
      stoneId: "urchin_fisherman",
      shortTitle: "Comrade Lost to Sea-Fever",
      kinRole: "Shipmate felled by sea-fever",
      featureSignature: "Crusty wart-knuckled grip, brine-furrowed brow, salt-matted beard",
      maskHue: "#7c498d",
      irisHue: "#a976bc",
      travelerRecognition: "Beside wicker baskets of purple sea urchins, the bearded fisherman lifts crusty, warty hands and wears the sunken cheeks of a comrade lost long ago to sea-fever.",
      foreheadEcho: "Even the spiny sea urchins glisten in dusk-light like relics from a voyage none survived."
    }),
    Object.freeze({
      maskId: "yellow_eyed_delirium",
      stoneId: "straw_mat_sufferer",
      shortTitle: "Man Visited in Yellow-Eyed Delirium",
      kinRole: "Acquaintance an hour before his last breath",
      featureSignature: "Saffron-yellow sclera, shivering collarbone, sweat-darkened temple",
      maskHue: "#cfa23c",
      irisHue: "#eba038",
      travelerRecognition: "Huddled shivering on a damp straw mat beneath the limestone arch, the fever victim stares up with the yellow eyes of a man I visited in delirium an hour before his death.",
      foreheadEcho: "An hour before his last breath he stared just so; now the colonnade arch breathes his chill."
    }),
    Object.freeze({
      maskId: "departed_childhood_friend",
      stoneId: "gangplank_stevedore",
      shortTitle: "Friends Dead Since Youth",
      kinRole: "Childhood friends dead long ago",
      featureSignature: "Coarse sackcloth hood shadow, stooped shoulder ridge, boyhood mouth",
      maskHue: "#9e9382",
      irisHue: "#e4dccf",
      travelerRecognition: "Climbing the plank gangplank and steep quay steps with coarse sacks folded over their heads as hoods, the stevedores carry the unmistakable profiles of friends dead long ago.",
      foreheadEcho: "Under folded jute hoods, vanished companions climb endlessly up the steep steps of memory."
    }),
    Object.freeze({
      maskId: "unrequited_love_girl",
      stoneId: "balcony_maiden",
      shortTitle: "Girl Who Died for Unrequited Love",
      kinRole: "Young woman lost to unrequited love",
      featureSignature: "Pale veiled cheekbone, motionless throat, twilight lash-shadow",
      maskHue: "#e4dccf",
      irisHue: "#a976bc",
      travelerRecognition: "Leaning motionless from the wrought-iron balcony above the dusk thoroughfare, the pale veiled girl holds the exact stillness of the girl who killed herself for an unrequited love.",
      foreheadEcho: "High on the wrought-iron rail she leans into twilight, neither calling out nor vanishing."
    }),
    Object.freeze({
      maskId: "maternal_grandmother",
      stoneId: "scale_greengrocer",
      shortTitle: "Grandmother at the Brass Pan-Scale",
      kinRole: "Maternal grandmother",
      featureSignature: "Stooped shoulders, blue-veined knuckles, steadying balance thumb",
      maskHue: "#eba038",
      irisHue: "#ffd37d",
      travelerRecognition: "Weighing dark greens on a hanging brass pan-scale in the lantern alley, the stooped vendor moves with my grandmother's exact shoulders and veined fingers.",
      foreheadEcho: "The brass pans tremble as though weighing the living against the dead—and tipping toward the dead."
    })
  ]);

  const RAW_RECIPROCAL_GAZES = [
    {
      figureId: "hawser_sailor",
      theirDeadTitle: "Youngest Son Swept Overboard off Negroponte",
      theirDeadRelation: "Lost youngest son",
      theirMemoryOfYou: "His wet grip freezes on the hawser: in your salt-stung eyes he recognizes his youngest son swept overboard in the winter gale off Negroponte.",
      waterReflectionFeature: "Salt-drenched curls & parted boyish lips gasping in black swell",
      gazeHue: "#ffd37d"
    },
    {
      figureId: "urchin_fisherman",
      theirDeadTitle: "Twin Brother Dragged Beneath the Urchin-Dredge",
      theirDeadRelation: "Drowned twin brother",
      theirMemoryOfYou: "Through crusted lashes the old fisherman beholds in your face his twin brother dragged beneath the tide with a weighted urchin-dredge thirty autumns past.",
      waterReflectionFeature: "Brine-pale brow scored by taut hemp cord & twin violet-dark irises",
      gazeHue: "#a976bc"
    },
    {
      figureId: "straw_mat_sufferer",
      theirDeadTitle: "Salt-Marsh Cousin Felled by Yellow Ague",
      theirDeadRelation: "Perished marshland cousin",
      theirMemoryOfYou: "Shivering on the damp straw mat, he fixes your cheekbones as his cousin from the salt-marshes who perished of the same yellow ague beside this pillar.",
      waterReflectionFeature: "Amber-rimmed fever sockets & parched throat shimmering in oil-light",
      gazeHue: "#cfa23c"
    },
    {
      figureId: "gangplank_stevedore",
      theirDeadTitle: "Quarry Companion Crushed on the Necropolis Stair",
      theirDeadRelation: "Crushed quarry companion",
      theirMemoryOfYou: "Beneath his folded jute hood, the stevedore halts—recognizing in your jaw the quarry companion crushed under fallen limestone on the upper necropolis stair.",
      waterReflectionFeature: "Chalk-dusted temples & resolute mason's chin beneath dark ripples",
      gazeHue: "#e4dccf"
    },
    {
      figureId: "balcony_maiden",
      theirDeadTitle: "Betrothed Mariner Drowned After Equinox",
      theirDeadRelation: "Drowned betrothed mariner",
      theirMemoryOfYou: "Down from the wrought-iron balcony, her unblinking eyes fasten on you as the betrothed mariner who sailed out at equinox and drowned before returning to her casement.",
      waterReflectionFeature: "Wind-chapped navigator's brow & horizon-searching eyes",
      gazeHue: "#7c498d"
    },
    {
      figureId: "scale_greengrocer",
      theirDeadTitle: "Firstborn Daughter Lost in Childbirth",
      theirDeadRelation: "Firstborn daughter",
      theirMemoryOfYou: "Her veined hand stills on the brass scale chain: in your exact brow and startled gaze she sees her firstborn daughter lost in childbirth.",
      waterReflectionFeature: "Delicate arched eyebrows & startled lantern-lit pupils",
      gazeHue: "#eba038"
    }
  ];

  const SECONDARY_RECIPROCAL_GAZES = [
    {
      figureId: "net_mender",
      theirDeadTitle: "Apprentice Tangled in the Night Seine",
      theirDeadRelation: "Drowned net-loft apprentice",
      theirMemoryOfYou: "His bone shuttle freezes mid-knot: your half-parted mouth mirrors the young apprentice pulled down in a drifting night seine outside the mole.",
      waterReflectionFeature: "Cross-hatched hemp net shadows across pale temples",
      gazeHue: "#9e9382"
    },
    {
      figureId: "upper_stair_porter",
      theirDeadTitle: "Elder Brother Lost on the Salt Caravan",
      theirDeadRelation: "Unreturned elder brother",
      theirMemoryOfYou: "Paused on the steep stone riser, the porter sees in your travel-worn posture his elder brother who marched inland with the salt mules and died of thirst.",
      waterReflectionFeature: "Sun-hollowed cheeks & dusty traveler's collar",
      gazeHue: "#cfa23c"
    },
    {
      figureId: "lantern_trimmer",
      theirDeadTitle: "Harbour Watchman Taken by Pitch Fire",
      theirDeadRelation: "Late watch-tower keeper",
      theirMemoryOfYou: "Lifting his brass wick-shears, the trimmer recoils—your lit bridge-of-nose belongs to the old harbour watchman lost when the pitch warehouse burned.",
      waterReflectionFeature: "Soot-smudged cheekbones gilded with trembling wick-fire",
      gazeHue: "#ffd37d"
    },
    {
      figureId: "cuttlefish_monger",
      theirDeadTitle: "Ink-Stained Sister Felled by Winter Pleurisy",
      theirDeadRelation: "Younger market sister",
      theirMemoryOfYou: "Beside black cuttlefish slabs, the monger stares without blinking, reading in your narrow chin the younger sister carried off by winter pleurisy.",
      waterReflectionFeature: "Sepia-tinted eyelids & frost-pale cheekbones",
      gazeHue: "#a976bc"
    },
    {
      figureId: "lateen_oarsman",
      theirDeadTitle: "Helmsman Dashed Against the Breakwater",
      theirDeadRelation: "Shipwrecked helmsman",
      theirMemoryOfYou: "Resting on his wet ash sweep, the oarsman recognizes in your temples the veteran helmsman dashed against the outer breakwater guiding the barque home.",
      waterReflectionFeature: "Spray-beaded forehead & stern salt-whitened lashes",
      gazeHue: "#eba038"
    },
    {
      figureId: "colonnade_widow",
      theirDeadTitle: "Shipwright Husband Buried on the Cliff",
      theirDeadRelation: "Late shipwright husband",
      theirMemoryOfYou: "From the black limestone archway, the veiled widow fixes you with terrified devotion—seeing her shipwright husband's exact eyes returned from the cypress hill.",
      waterReflectionFeature: "Deep-set artisan's eyes framed by cypress-dark ripples",
      gazeHue: "#7c498d"
    }
  ];

  const RECIPROCAL_GAZE_MAP = {};
  const RECIPROCAL_GAZES = RAW_RECIPROCAL_GAZES.concat(SECONDARY_RECIPROCAL_GAZES).map((entry) => {
    const frozen = Object.freeze({ ...entry });
    RECIPROCAL_GAZE_MAP[frozen.figureId] = frozen;
    return frozen;
  });
  for (let i = 0; i < RECIPROCAL_GAZES.length; i += 1) {
    const item = RECIPROCAL_GAZES[i];
    Object.defineProperty(RECIPROCAL_GAZES, item.figureId, {
      value: item,
      enumerable: false,
      configurable: false,
      writable: false
    });
  }
  Object.freeze(RECIPROCAL_GAZE_MAP);
  Object.freeze(RECIPROCAL_GAZES);

  const DEAD_MASK_BY_STONE = {};
  const DEAD_MASK_BY_ID = {};
  for (let i = 0; i < CANONICAL_DEAD_MASKS.length; i += 1) {
    const m = CANONICAL_DEAD_MASKS[i];
    DEAD_MASK_BY_STONE[m.stoneId] = m;
    DEAD_MASK_BY_ID[m.maskId] = m;
  }
  Object.freeze(DEAD_MASK_BY_STONE);
  Object.freeze(DEAD_MASK_BY_ID);

  const HYPOTHESIS_TEXTS = Object.freeze({
    hereafter_doubt: "Perhaps this is the land where you arrive when you die...",
    kaleidoscope_limit: "Not the beyond, but the age when the dead outnumber the living — and every eye finds its own dead in you."
  });

  const UPPER_FACET_TRAITS = Object.freeze([
    "hollowed soldier's brow",
    "brine-furrowed shipmate forehead",
    "saffron-yellow fever sclera",
    "coarse jute-hood shadow",
    "pale veiled balcony cheekbone",
    "grandmother's stooped temple"
  ]);

  const LOWER_FACET_TRAITS = Object.freeze([
    "dark-tunic jaw ridge",
    "crusty sea-urchin knuckle line",
    "shivering straw-mat chin",
    "boyhood companion's mouth",
    "motionless twilight throat",
    "veined brass-scale fingers"
  ]);

  function clamp(v, lo, hi) {
    const n = Number(v);
    if (!Number.isFinite(n)) return lo;
    return n < lo ? lo : n > hi ? hi : n;
  }

  function clamp01(v) {
    return clamp(v, 0, 1);
  }

  function hexToRgba(hex, alpha) {
    const a = clamp01(alpha);
    if (typeof hex === "string" && hex.charAt(0) === "#" && (hex.length === 7 || hex.length === 4)) {
      let r = 228;
      let g = 220;
      let b = 207;
      if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
      } else {
        r = parseInt(hex.charAt(1) + hex.charAt(1), 16);
        g = parseInt(hex.charAt(2) + hex.charAt(2), 16);
        b = parseInt(hex.charAt(3) + hex.charAt(3), 16);
      }
      return "rgba(" + r + "," + g + "," + b + "," + a.toFixed(3) + ")";
    }
    return "rgba(228,220,207," + a.toFixed(3) + ")";
  }

  function computeSecondaryDonors(secIdx, permutationSeed) {
    const seed = Math.max(0, Math.floor(Number(permutationSeed) || 0));
    const idxA = (secIdx * 2 + seed * 5 + 1) % 6;
    let idxB = (secIdx * 3 + seed * 2 + 4) % 6;
    if (idxB === idxA) idxB = (idxA + 3) % 6;
    return { idxA, idxB, maskA: CANONICAL_DEAD_MASKS[idxA], maskB: CANONICAL_DEAD_MASKS[idxB] };
  }

  function createBereavementEngine(opts = {}) {
    const callbacks = {
      onStateChange: typeof opts.onStateChange === "function" ? opts.onStateChange : null,
      onThresholdCrossed: typeof opts.onThresholdCrossed === "function" ? opts.onThresholdCrossed : null,
      onReciprocalLock: typeof opts.onReciprocalLock === "function" ? opts.onReciprocalLock : null
    };

    const TOTAL_KNOWN_SOULS = 60;
    const state = {
      lifeStage: 0.62,
      deadKnownCount: 37,
      livingKnownCount: 23,
      deadShare: 37 / 60,
      deadOutnumberLiving: true,
      maskedByFigureId: {},
      maskedStrangerCount: 8,
      unmaskedStrangerCount: 4,
      kaleidoscopeSaturated: false,
      kaleidoscopeTurnCount: 0,
      permutationSeed: 0,
      activeFigureId: "hawser_sailor",
      hoveredFigureId: null,
      hoverDwellSec: 0,
      autoLockedHoverId: null,
      isReciprocalLocked: false,
      reciprocalLockCount: 0,
      avertedCount: 0,
      gazeParalysis: 0,
      recognizedStoneIds: ["hawser_sailor"],
      hypothesisMode: "hereafter_doubt",
      foreheadTouchCount: 0,
      shimmerPhase: 0,
      turnFlash01: 0,
      foreheadPulse01: 0,
      lastAvertedReflection: null,
      reducedMotion: false
    };

    function markStoneRecognized(figId) {
      if (PRIMARY_STONE_IDS.indexOf(figId) !== -1 && state.recognizedStoneIds.indexOf(figId) === -1) {
        state.recognizedStoneIds.push(figId);
      }
    }

    function recomputeDerived() {
      const ls = clamp01(state.lifeStage);
      state.lifeStage = ls;
      state.deadKnownCount = Math.round(TOTAL_KNOWN_SOULS * ls);
      state.livingKnownCount = TOTAL_KNOWN_SOULS - state.deadKnownCount;
      state.deadShare = state.deadKnownCount / TOTAL_KNOWN_SOULS;
      state.deadOutnumberLiving = ls > 0.50;

      const maskedMap = {};
      for (let i = 0; i < ALL_WHARF_IDS.length; i += 1) {
        maskedMap[ALL_WHARF_IDS[i]] = false;
      }

      if (!state.deadOutnumberLiving) {
        if (ls > 0.02 && PRIMARY_STONE_IDS.indexOf(state.activeFigureId) !== -1) {
          maskedMap[state.activeFigureId] = true;
        }
        if (
          ls >= 0.18 &&
          state.hoveredFigureId &&
          state.hoveredFigureId !== state.activeFigureId &&
          PRIMARY_STONE_IDS.indexOf(state.hoveredFigureId) !== -1
        ) {
          maskedMap[state.hoveredFigureId] = true;
        }
      } else {
        for (let i = 0; i < PRIMARY_STONE_IDS.length; i += 1) {
          maskedMap[PRIMARY_STONE_IDS[i]] = true;
        }
        const secQuota = ls >= 0.78
          ? 6
          : Math.min(6, Math.max(0, Math.floor(((ls - 0.51) / 0.27) * 6 + 1e-6)));
        const orderedSec = SECONDARY_STRANGER_IDS.slice().sort((a, b) => {
          if (a === state.activeFigureId) return -1;
          if (b === state.activeFigureId) return 1;
          const ia = (SECONDARY_STRANGER_IDS.indexOf(a) * 5 + state.permutationSeed * 3) % 6;
          const ib = (SECONDARY_STRANGER_IDS.indexOf(b) * 5 + state.permutationSeed * 3) % 6;
          return ia - ib;
        });
        for (let k = 0; k < secQuota; k += 1) {
          maskedMap[orderedSec[k]] = true;
        }
      }

      let maskedCount = 0;
      for (let i = 0; i < ALL_WHARF_IDS.length; i += 1) {
        if (maskedMap[ALL_WHARF_IDS[i]]) maskedCount += 1;
      }
      state.maskedByFigureId = maskedMap;
      state.maskedStrangerCount = maskedCount;
      state.unmaskedStrangerCount = ALL_WHARF_IDS.length - maskedCount;
      state.kaleidoscopeSaturated = state.deadOutnumberLiving && maskedCount === ALL_WHARF_IDS.length;
    }

    function getFigureReading(figureId) {
      const validId = ALL_WHARF_IDS.indexOf(figureId) !== -1 ? figureId : (state.activeFigureId || "hawser_sailor");
      const primaryIdx = PRIMARY_STONE_IDS.indexOf(validId);
      const isPrimaryStone = primaryIdx !== -1;
      const isMasked = Boolean(state.maskedByFigureId[validId]);
      const gaze = RECIPROCAL_GAZE_MAP[validId] || RECIPROCAL_GAZES[0];

      if (isPrimaryStone) {
        const mask = CANONICAL_DEAD_MASKS[primaryIdx];
        const refractedIdx = (primaryIdx + state.permutationSeed + 1) % 6;
        const refractedMask = CANONICAL_DEAD_MASKS[refractedIdx];
        const hasTurnEcho = isMasked && state.deadOutnumberLiving && state.kaleidoscopeTurnCount > 0;
        const sig = isMasked
          ? (hasTurnEcho
            ? mask.featureSignature + " · refracted facet of " + LOWER_FACET_TRAITS[refractedIdx]
            : mask.featureSignature)
          : "Living dockside countenance (passing trace of " + mask.kinRole.toLowerCase() + ")";
        const sees = isMasked
          ? mask.travelerRecognition
          : "While the living you know still outnumber the dead, your mind accepts a new face—only a brief flicker of " + mask.shortTitle.toLowerCase() + " crosses the wharf.";
        return {
          figureId: validId,
          isPrimaryStone: true,
          isMasked,
          maskId: isMasked ? mask.maskId : "unmasked_living",
          canonicalMaskId: mask.maskId,
          maskTitle: isMasked ? mask.shortTitle : "Unmasked Stranger · Echo of " + mask.shortTitle,
          kinRole: isMasked ? mask.kinRole : "Living wharf citizen",
          featureSignature: sig,
          travelerSeesText: sees,
          foreheadEcho: mask.foreheadEcho,
          citizenSeesTitle: gaze.theirDeadTitle,
          citizenSeesRelation: gaze.theirDeadRelation,
          citizenSeesInYouText: gaze.theirMemoryOfYou,
          waterReflectionFeature: gaze.waterReflectionFeature,
          maskHue: isMasked ? mask.maskHue : PALETTE.sackclothAsh,
          irisHue: isMasked ? mask.irisHue : PALETTE.boneParchment,
          gazeHue: gaze.gazeHue
        };
      }

      const secIdx = Math.max(0, SECONDARY_STRANGER_IDS.indexOf(validId));
      const donors = computeSecondaryDonors(secIdx, state.permutationSeed);
      const mA = donors.maskA;
      const mB = donors.maskB;
      return {
        figureId: validId,
        isPrimaryStone: false,
        isMasked,
        maskId: isMasked ? mA.maskId : "unmasked_living",
        secondaryMaskId: mB.maskId,
        donorPrimaryIds: [mA.stoneId, mB.stoneId],
        maskTitle: isMasked
          ? "Kaleidoscopic Mask: " + mA.shortTitle + " × " + mB.kinRole
          : "Unmasked Wharf Stranger",
        kinRole: isMasked
          ? "Composite of " + mA.kinRole.toLowerCase() + " & " + mB.kinRole.toLowerCase()
          : "New living face on the quay",
        featureSignature: isMasked
          ? UPPER_FACET_TRAITS[donors.idxA] + " fused with " + LOWER_FACET_TRAITS[donors.idxB]
          : "Unmasked living features accepted before memory saturates",
        travelerSeesText: isMasked
          ? "Your mind refuses any more new faces: this stranger wears a kaleidoscopic mask combining " + UPPER_FACET_TRAITS[donors.idxA] + " and " + LOWER_FACET_TRAITS[donors.idxB] + "."
          : "Because the living still outnumber your dead, this bystander keeps an unfamiliar living face.",
        foreheadEcho: mA.foreheadEcho,
        citizenSeesTitle: gaze.theirDeadTitle,
        citizenSeesRelation: gaze.theirDeadRelation,
        citizenSeesInYouText: gaze.theirMemoryOfYou,
        waterReflectionFeature: gaze.waterReflectionFeature,
        maskHue: isMasked ? mA.maskHue : PALETTE.sackclothAsh,
        irisHue: isMasked ? mB.irisHue : PALETTE.boneParchment,
        gazeHue: gaze.gazeHue
      };
    }

    function getState() {
      const activeReading = getFigureReading(state.activeFigureId);
      return {
        lifeStage: state.lifeStage,
        totalKnownSouls: TOTAL_KNOWN_SOULS,
        livingKnownCount: state.livingKnownCount,
        deadKnownCount: state.deadKnownCount,
        deadShare: state.deadShare,
        deadOutnumberLiving: state.deadOutnumberLiving,
        maskedStrangerCount: state.maskedStrangerCount,
        unmaskedStrangerCount: state.unmaskedStrangerCount,
        kaleidoscopeSaturated: state.kaleidoscopeSaturated,
        kaleidoscopeTurnCount: state.kaleidoscopeTurnCount,
        permutationSeed: state.permutationSeed,
        activeFigureId: state.activeFigureId,
        activeReading,
        isReciprocalLocked: state.isReciprocalLocked,
        reciprocalLockCount: state.reciprocalLockCount,
        avertedCount: state.avertedCount,
        gazeParalysis: Number(state.gazeParalysis.toFixed(4)),
        recognizedPrimaryCount: state.recognizedStoneIds.length,
        recognizedStoneIds: state.recognizedStoneIds.slice(),
        hypothesisMode: state.hypothesisMode,
        hypothesisText: HYPOTHESIS_TEXTS[state.hypothesisMode] || HYPOTHESIS_TEXTS.hereafter_doubt,
        foreheadTouchCount: state.foreheadTouchCount,
        hoveredFigureId: state.hoveredFigureId,
        lastAvertedReflection: state.lastAvertedReflection
          ? { ...state.lastAvertedReflection }
          : null
      };
    }

    function notifyStateChange() {
      if (callbacks.onStateChange) {
        callbacks.onStateChange(getState());
      }
    }

    function setLifeStage(val01) {
      const prevThreshold = state.deadOutnumberLiving;
      state.lifeStage = clamp01(val01);
      recomputeDerived();
      if (!state.isReciprocalLocked && !state.deadOutnumberLiving && state.gazeParalysis > 0.12) {
        state.gazeParalysis = 0.06;
      }
      if (prevThreshold !== state.deadOutnumberLiving && callbacks.onThresholdCrossed) {
        callbacks.onThresholdCrossed({
          deadOutnumberLiving: state.deadOutnumberLiving,
          lifeStage: state.lifeStage,
          maskedStrangerCount: state.maskedStrangerCount,
          kaleidoscopeSaturated: state.kaleidoscopeSaturated
        });
      }
      notifyStateChange();
      return getState();
    }

    function turnKaleidoscope() {
      state.kaleidoscopeTurnCount += 1;
      state.permutationSeed = (state.permutationSeed + 1) % 720;
      state.turnFlash01 = 1.0;
      recomputeDerived();
      notifyStateChange();
      return getState();
    }

    function inspectFigure(figureId) {
      if (figureId && ALL_WHARF_IDS.indexOf(figureId) !== -1) {
        state.activeFigureId = figureId;
      }
      markStoneRecognized(state.activeFigureId);
      recomputeDerived();
      notifyStateChange();
      return getFigureReading(state.activeFigureId);
    }

    function lockReciprocalGaze(figureId) {
      const targetId = (figureId && ALL_WHARF_IDS.indexOf(figureId) !== -1)
        ? figureId
        : (state.activeFigureId || "hawser_sailor");
      state.activeFigureId = targetId;
      markStoneRecognized(targetId);
      state.isReciprocalLocked = true;
      state.reciprocalLockCount += 1;
      state.gazeParalysis = clamp01(Math.max(state.gazeParalysis, 0.86));
      state.lastAvertedReflection = null;
      recomputeDerived();
      const reading = getFigureReading(targetId);
      if (callbacks.onReciprocalLock) {
        callbacks.onReciprocalLock(reading, getState());
      }
      notifyStateChange();
      return reading;
    }

    function avertEyes() {
      const activeGaze = RECIPROCAL_GAZE_MAP[state.activeFigureId] || RECIPROCAL_GAZES[0];
      state.lastAvertedReflection = {
        figureId: state.activeFigureId,
        theirDeadTitle: activeGaze.theirDeadTitle,
        theirDeadRelation: activeGaze.theirDeadRelation,
        waterReflectionFeature: activeGaze.waterReflectionFeature,
        gazeHue: activeGaze.gazeHue,
        decay01: 1.0
      };
      state.isReciprocalLocked = false;
      state.avertedCount += 1;
      state.gazeParalysis = 0.10;
      state.hoverDwellSec = 0;
      state.autoLockedHoverId = state.hoveredFigureId;
      notifyStateChange();
      return getState();
    }

    function touchForehead() {
      state.foreheadTouchCount += 1;
      state.hypothesisMode = state.hypothesisMode === "hereafter_doubt"
        ? "kaleidoscope_limit"
        : "hereafter_doubt";
      state.foreheadPulse01 = 1.0;
      notifyStateChange();
      return getState();
    }

    function step(dtSec, pointerState = {}) {
      const rawDt = Math.max(0, Number(dtSec) || 0);
      const dt = Math.min(0.25, rawDt);
      const dwellDt = Math.min(2.0, rawDt);
      const pState = pointerState || {};
      const hoveredId = (pState.hoveredId && ALL_WHARF_IDS.indexOf(pState.hoveredId) !== -1)
        ? pState.hoveredId
        : null;
      state.reducedMotion = Boolean(pState.reducedMotion);

      if (hoveredId !== state.hoveredFigureId) {
        state.hoveredFigureId = hoveredId;
        state.hoverDwellSec = 0;
        state.autoLockedHoverId = null;
        if (!state.deadOutnumberLiving) {
          recomputeDerived();
        }
      }
      if (hoveredId && dwellDt > 0) {
        state.hoverDwellSec += dwellDt;
        if (
          state.hoverDwellSec >= 0.42 &&
          state.deadOutnumberLiving &&
          state.autoLockedHoverId !== hoveredId &&
          (!state.isReciprocalLocked || state.activeFigureId !== hoveredId)
        ) {
          state.autoLockedHoverId = hoveredId;
          lockReciprocalGaze(hoveredId);
        }
      }

      if (state.reducedMotion) {
        if (state.isReciprocalLocked) {
          state.gazeParalysis = Math.max(0.86, state.gazeParalysis);
        }
      } else if (dt > 0) {
        state.shimmerPhase = (state.shimmerPhase + dt * 1.75) % (Math.PI * 200);
        if (state.isReciprocalLocked) {
          const targetLock = 0.92;
          state.gazeParalysis = clamp01(Math.max(0.80, state.gazeParalysis + (targetLock - state.gazeParalysis) * Math.min(1, dt * 1.6)));
        } else {
          const ambientTarget = state.deadOutnumberLiving
            ? 0.08 + 0.14 * clamp01((state.lifeStage - 0.50) / 0.50)
            : 0.0;
          state.gazeParalysis = clamp01(state.gazeParalysis + (ambientTarget - state.gazeParalysis) * Math.min(1, dt * 0.95));
        }
      }

      if (dt > 0) {
        state.turnFlash01 = Math.max(0, state.turnFlash01 - dt * 1.4);
        state.foreheadPulse01 = Math.max(0, state.foreheadPulse01 - dt * 1.1);
        if (state.lastAvertedReflection) {
          state.lastAvertedReflection.decay01 = Math.max(0, state.lastAvertedReflection.decay01 - dt * 0.34);
          if (state.lastAvertedReflection.decay01 <= 0.005) {
            state.lastAvertedReflection = null;
          }
        }
      }
      return getState();
    }

    function reset() {
      state.lifeStage = 0.62;
      state.kaleidoscopeTurnCount = 0;
      state.permutationSeed = 0;
      state.activeFigureId = "hawser_sailor";
      state.hoveredFigureId = null;
      state.hoverDwellSec = 0;
      state.autoLockedHoverId = null;
      state.isReciprocalLocked = false;
      state.reciprocalLockCount = 0;
      state.avertedCount = 0;
      state.gazeParalysis = 0;
      state.recognizedStoneIds = ["hawser_sailor"];
      state.hypothesisMode = "hereafter_doubt";
      state.foreheadTouchCount = 0;
      state.shimmerPhase = 0;
      state.turnFlash01 = 0;
      state.foreheadPulse01 = 0;
      state.lastAvertedReflection = null;
      recomputeDerived();
      notifyStateChange();
      return getState();
    }

    function drawKaleidoscopeChords(ctx, figById, shimmerWave) {
      if (!state.deadOutnumberLiving) return;
      const satBoost = state.kaleidoscopeSaturated ? 0.14 : 0.04;
      const flashBoost = state.turnFlash01 * 0.32;
      ctx.save();
      for (let s = 0; s < SECONDARY_STRANGER_IDS.length; s += 1) {
        const secId = SECONDARY_STRANGER_IDS[s];
        if (!state.maskedByFigureId[secId]) continue;
        const secFig = figById[secId];
        if (!secFig) continue;
        const donors = computeSecondaryDonors(s, state.permutationSeed);
        const donorIds = [donors.maskA.stoneId, donors.maskB.stoneId];
        const donorHues = [donors.maskA.maskHue, donors.maskB.irisHue];

        for (let d = 0; d < 2; d += 1) {
          const donorFig = figById[donorIds[d]];
          if (!donorFig) continue;
          const x1 = donorFig.eyeX;
          const y1 = donorFig.eyeY;
          const x2 = secFig.eyeX;
          const y2 = secFig.eyeY;
          const mx = (x1 + x2) * 0.5;
          const my = (y1 + y2) * 0.5 - (d === 0 ? 16 : -12);
          const isFocusLink = state.activeFigureId === secId || state.activeFigureId === donorIds[d];
          const alpha = clamp01((isFocusLink ? 0.36 : 0.17) + satBoost + flashBoost + shimmerWave * 0.04);

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.quadraticCurveTo(mx, my, x2, y2);
          ctx.strokeStyle = hexToRgba(donorHues[d], alpha);
          ctx.lineWidth = isFocusLink ? 1.35 : 0.85;
          ctx.setLineDash(d === 0 ? [5, 4] : [2, 4]);
          ctx.stroke();

          ctx.setLineDash([]);
          const nodeX = 0.25 * x1 + 0.5 * mx + 0.25 * x2;
          const nodeY = 0.25 * y1 + 0.5 * my + 0.25 * y2;
          ctx.fillStyle = hexToRgba(PALETTE.boneParchment, alpha * 0.95);
          ctx.beginPath();
          ctx.moveTo(nodeX, nodeY - 2.6);
          ctx.lineTo(nodeX + 2.6, nodeY);
          ctx.lineTo(nodeX, nodeY + 2.6);
          ctx.lineTo(nodeX - 2.6, nodeY);
          ctx.closePath();
          ctx.fill();
        }
      }

      if (state.kaleidoscopeTurnCount > 0 || state.kaleidoscopeSaturated) {
        ctx.setLineDash([3, 6]);
        ctx.lineWidth = 0.7;
        for (let i = 0; i < PRIMARY_STONE_IDS.length; i += 1) {
          const idA = PRIMARY_STONE_IDS[i];
          const idB = PRIMARY_STONE_IDS[(i + 1 + (state.permutationSeed % 2)) % 6];
          const fA = figById[idA];
          const fB = figById[idB];
          if (!fA || !fB) continue;
          ctx.strokeStyle = hexToRgba(PALETTE.urchinSpine, 0.13 + flashBoost * 0.5);
          ctx.beginPath();
          ctx.moveTo(fA.eyeX, fA.eyeY);
          ctx.lineTo(fB.eyeX, fB.eyeY);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawDepartedMaskOverlay(ctx, fig, reading, vantageX, vantageY, shimmerWave, hoveredId) {
      const ex = fig.eyeX;
      const ey = fig.eyeY;
      const r = Math.max(7.5, Number(fig.headRadius) || 12);
      const isSelected = fig.id === state.activeFigureId;
      const isHovered = fig.id === hoveredId;

      if (!reading.isMasked) {
        if (isSelected || isHovered) {
          ctx.save();
          ctx.strokeStyle = hexToRgba(PALETTE.lanternHalo, isSelected ? 0.55 : 0.35);
          ctx.lineWidth = 1.1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.arc(ex, ey, r * 1.45, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        return;
      }

      const baseOpacity = state.deadOutnumberLiving ? 0.86 : 0.50;
      const maskAlpha = clamp01(baseOpacity + shimmerWave * 0.05 + (isSelected ? 0.10 : 0));

      ctx.save();
      const aura = ctx.createRadialGradient(ex, ey, r * 0.25, ex, ey, r * 2.15);
      aura.addColorStop(0, hexToRgba(reading.maskHue, maskAlpha * 0.38));
      aura.addColorStop(0.62, hexToRgba(PALETTE.urchinViolet, maskAlpha * 0.18));
      aura.addColorStop(1, "rgba(11,17,29,0)");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(ex, ey, r * 2.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(ex, ey - r * 1.12);
      ctx.lineTo(ex + r * 0.86, ey - r * 0.32);
      ctx.lineTo(ex + r * 0.66, ey + r * 0.72);
      ctx.lineTo(ex, ey + r * 1.16);
      ctx.lineTo(ex - r * 0.66, ey + r * 0.72);
      ctx.lineTo(ex - r * 0.86, ey - r * 0.32);
      ctx.closePath();
      ctx.fillStyle = hexToRgba(PALETTE.boneParchment, maskAlpha * 0.76);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(ex, ey - r * 1.12);
      ctx.lineTo(ex + r * 0.86, ey - r * 0.32);
      ctx.lineTo(ex + r * 0.66, ey + r * 0.72);
      ctx.lineTo(ex, ey + r * 1.16);
      ctx.closePath();
      const rightHue = reading.isPrimaryStone ? PALETTE.duskIndigo : reading.irisHue;
      ctx.fillStyle = hexToRgba(rightHue, reading.isPrimaryStone ? maskAlpha * 0.56 : maskAlpha * 0.48);
      ctx.fill();

      ctx.strokeStyle = hexToRgba(reading.maskHue, maskAlpha * 0.92);
      ctx.lineWidth = isSelected ? 1.5 : 1.0;
      ctx.beginPath();
      ctx.moveTo(ex - r * 0.82, ey - r * 0.28);
      ctx.lineTo(ex, ey + r * 0.16);
      ctx.lineTo(ex + r * 0.82, ey - r * 0.28);
      ctx.moveTo(ex, ey - r * 1.10);
      ctx.lineTo(ex, ey + r * 1.14);
      ctx.moveTo(ex - r * 0.58, ey + r * 0.56);
      ctx.lineTo(ex + r * 0.58, ey + r * 0.56);
      ctx.stroke();

      if (reading.canonicalMaskId === "departed_childhood_friend") {
        ctx.strokeStyle = hexToRgba(PALETTE.sackclothAsh, maskAlpha * 0.85);
        ctx.beginPath();
        ctx.moveTo(ex - r * 1.05, ey + r * 0.45);
        ctx.lineTo(ex, ey - r * 1.42);
        ctx.lineTo(ex + r * 1.05, ey + r * 0.45);
        ctx.stroke();
      } else if (reading.canonicalMaskId === "unrequited_love_girl") {
        ctx.fillStyle = hexToRgba(PALETTE.urchinSpine, maskAlpha * 0.26);
        ctx.fillRect(ex - r * 0.85, ey + r * 0.10, r * 1.70, r * 1.15);
      }

      const dx = vantageX - ex;
      const dy = vantageY - ey;
      const dist = Math.hypot(dx, dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const eyeSpan = Math.max(2.7, r * 0.36);
      const socketR = Math.max(1.9, r * 0.21);
      const pupilR = Math.max(1.05, socketR * 0.56);

      for (let side = -1; side <= 1; side += 2) {
        const sx = ex + side * eyeSpan;
        const sy = ey - r * 0.08;
        ctx.fillStyle = PALETTE.harborAbyss;
        ctx.beginPath();
        ctx.ellipse(sx, sy, socketR * 1.25, socketR * 0.88, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = hexToRgba(reading.irisHue, clamp01(maskAlpha + 0.12));
        ctx.beginPath();
        ctx.arc(sx + ux * socketR * 0.34, sy + uy * socketR * 0.34, pupilR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = hexToRgba(PALETTE.lanternHalo, 0.92);
        ctx.beginPath();
        ctx.arc(sx + ux * socketR * 0.45 - 0.35, sy + uy * socketR * 0.45 - 0.35, Math.max(0.55, pupilR * 0.38), 0, Math.PI * 2);
        ctx.fill();
      }

      if (state.deadOutnumberLiving) {
        const rayLen = isSelected ? Math.min(dist * 0.38, 120) : Math.min(dist * 0.18, 52);
        const rayGrad = ctx.createLinearGradient(ex, ey, ex + ux * rayLen, ey + uy * rayLen);
        rayGrad.addColorStop(0, hexToRgba(reading.irisHue, isSelected ? 0.40 : 0.20));
        rayGrad.addColorStop(1, "rgba(11,17,29,0)");
        ctx.strokeStyle = rayGrad;
        ctx.lineWidth = isSelected ? 1.4 : 0.8;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + ux * rayLen, ey + uy * rayLen);
        ctx.stroke();
      }

      if (isSelected || isHovered) {
        ctx.strokeStyle = hexToRgba(isSelected ? reading.gazeHue : PALETTE.lanternHalo, isSelected ? 0.88 : 0.56);
        ctx.lineWidth = isSelected ? 1.6 : 1.1;
        ctx.beginPath();
        ctx.arc(ex, ey, r * 1.52, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawParalysisVignette(ctx, width, height, intensity) {
      if (intensity <= 0.02) return;
      ctx.save();
      const cx = width * 0.50;
      const cy = height * 0.56;
      const innerR = Math.min(width, height) * 0.28;
      const outerR = Math.hypot(width, height) * 0.62;
      const vig = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
      vig.addColorStop(0, "rgba(11,17,29,0)");
      vig.addColorStop(0.68, hexToRgba(PALETTE.urchinViolet, intensity * 0.16));
      vig.addColorStop(1, hexToRgba(PALETTE.harborAbyss, intensity * 0.52));
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }

    function drawWaterMedallionAndBeam(ctx, width, height, activeFig, reading, isReduced) {
      const showLocked = state.isReciprocalLocked && Boolean(activeFig);
      const averted = !showLocked ? state.lastAvertedReflection : null;
      if (!showLocked && !averted) return;

      const medX = width * 0.50;
      const medY = height * 0.89;
      const rx = clamp(width * 0.066, 36, 66);
      const ry = clamp(height * 0.060, 30, 52);
      const alpha = showLocked ? clamp01(0.76 + state.gazeParalysis * 0.22) : clamp01(averted.decay01 * 0.62);
      const gazeHue = showLocked ? reading.gazeHue : averted.gazeHue;
      const maskHue = showLocked ? reading.maskHue : PALETTE.sackclothAsh;
      const relationLabel = showLocked ? reading.citizenSeesRelation : averted.theirDeadRelation;

      ctx.save();
      if (showLocked && activeFig) {
        const fx = activeFig.eyeX;
        const fy = activeFig.eyeY;
        const midX = (fx + medX) * 0.5;
        const midY = (fy + medY) * 0.5;
        const perpX = -(medY - fy);
        const perpY = medX - fx;
        const pLen = Math.hypot(perpX, perpY) || 1;
        const bow = Math.min(34, pLen * 0.11);
        const nx = perpX / pLen;
        const ny = perpY / pLen;

        const cOutX = midX + nx * bow;
        const cOutY = midY + ny * bow;
        const cInX = midX - nx * bow;
        const cInY = midY - ny * bow;

        const outGrad = ctx.createLinearGradient(medX, medY, fx, fy);
        outGrad.addColorStop(0, hexToRgba(maskHue, alpha * 0.25));
        outGrad.addColorStop(1, hexToRgba(maskHue, alpha * 0.78));
        ctx.strokeStyle = outGrad;
        ctx.lineWidth = 1.6;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(medX, medY - ry * 0.45);
        ctx.quadraticCurveTo(cOutX, cOutY, fx, fy);
        ctx.stroke();

        const inGrad = ctx.createLinearGradient(fx, fy, medX, medY);
        inGrad.addColorStop(0, hexToRgba(gazeHue, alpha * 0.92));
        inGrad.addColorStop(1, hexToRgba(PALETTE.lanternHalo, alpha * 0.85));
        ctx.strokeStyle = inGrad;
        ctx.lineWidth = 2.2;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.quadraticCurveTo(cInX, cInY, medX, medY - ry * 0.20);
        ctx.stroke();

        const moteCount = 4;
        for (let m = 0; m < moteCount; m += 1) {
          const baseT = (m + 0.5) / moteCount;
          const t = isReduced ? baseT : ((baseT + state.shimmerPhase * 0.18) % 1);
          const omt = 1 - t;
          const mx = omt * omt * fx + 2 * omt * t * cInX + t * t * medX;
          const my = omt * omt * fy + 2 * omt * t * cInY + t * t * (medY - ry * 0.20);
          ctx.fillStyle = hexToRgba(PALETTE.lanternHalo, alpha * 0.95);
          ctx.beginPath();
          ctx.arc(mx, my, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.beginPath();
      ctx.ellipse(medX, medY, rx, ry, 0, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(PALETTE.harborAbyss, alpha * 0.92);
      ctx.fill();
      ctx.lineWidth = 2.0;
      ctx.strokeStyle = hexToRgba(gazeHue, alpha * 0.88);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(medX, medY, rx * 1.09, ry * 1.09, 0, 0, Math.PI * 2);
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = hexToRgba(PALETTE.oilLantern, alpha * 0.48);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(medX, medY, rx - 2, ry - 2, 0, 0, Math.PI * 2);
      ctx.clip();

      ctx.fillStyle = hexToRgba(PALETTE.wetFlagstone, alpha * 0.72);
      ctx.beginPath();
      ctx.ellipse(medX, medY + ry * 0.72, rx * 0.68, ry * 0.52, 0, Math.PI, Math.PI * 2);
      ctx.fill();

      const faceR = Math.min(rx, ry) * 0.42;
      const fy = medY - ry * 0.08;
      ctx.fillStyle = hexToRgba(PALETTE.duskIndigo, alpha * 0.88);
      ctx.beginPath();
      ctx.ellipse(medX, fy, faceR * 0.88, faceR * 1.08, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = hexToRgba(gazeHue, alpha * 0.52);
      ctx.beginPath();
      ctx.moveTo(medX, fy - faceR * 1.02);
      ctx.lineTo(medX + faceR * 0.80, fy - faceR * 0.18);
      ctx.lineTo(medX + faceR * 0.54, fy + faceR * 0.82);
      ctx.lineTo(medX, fy + faceR * 1.04);
      ctx.lineTo(medX - faceR * 0.54, fy + faceR * 0.82);
      ctx.lineTo(medX - faceR * 0.80, fy - faceR * 0.18);
      ctx.closePath();
      ctx.fill();

      for (let side = -1; side <= 1; side += 2) {
        ctx.fillStyle = hexToRgba(PALETTE.lanternHalo, alpha * 0.95);
        ctx.beginPath();
        ctx.arc(medX + side * faceR * 0.34, fy - faceR * 0.10, Math.max(1.6, faceR * 0.16), 0, Math.PI * 2);
        ctx.fill();
      }

      const rippleShift = isReduced ? 0 : Math.sin(state.shimmerPhase * 1.4) * 2.2;
      ctx.strokeStyle = hexToRgba(PALETTE.boneParchment, alpha * 0.28);
      ctx.lineWidth = 0.85;
      for (let rIdx = -2; rIdx <= 2; rIdx += 1) {
        const wy = medY + rIdx * (ry * 0.28);
        ctx.beginPath();
        ctx.moveTo(medX - rx * 0.82, wy);
        ctx.quadraticCurveTo(medX + rippleShift, wy + (rIdx % 2 === 0 ? 2.2 : -2.2), medX + rx * 0.82, wy);
        ctx.stroke();
      }
      ctx.restore();

      if (height >= 360 && relationLabel) {
        ctx.font = "600 9.5px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = hexToRgba(PALETTE.boneParchment, alpha * 0.92);
        ctx.fillText(String(relationLabel).toUpperCase(), medX, medY + ry + 11);
      }
      ctx.restore();
    }

    function renderMasksAndGaze(ctx, width, height, projectedFigures, renderOpts = {}) {
      if (!ctx || !(width > 0) || !(height > 0)) return;
      const figs = Array.isArray(projectedFigures) ? projectedFigures : [];
      const rOpts = renderOpts || {};
      const isReduced = Boolean(rOpts.reducedMotion || state.reducedMotion);
      const hoveredId = rOpts.hoveredId !== undefined ? rOpts.hoveredId : state.hoveredFigureId;
      const shimmerWave = isReduced ? 0 : Math.sin(state.shimmerPhase);
      const vantageX = width * 0.50;
      const vantageY = height * 0.93;

      const figById = {};
      for (let i = 0; i < figs.length; i += 1) {
        const f = figs[i];
        if (!f) continue;
        const fid = f.id || f.figureId;
        if (!fid) continue;
        figById[fid] = {
          id: fid,
          eyeX: Number.isFinite(f.eyeX) ? f.eyeX : Number(f.x) || vantageX,
          eyeY: Number.isFinite(f.eyeY) ? f.eyeY : Number(f.y) || height * 0.55,
          headRadius: Number.isFinite(f.headRadius) ? f.headRadius : Math.max(9, Math.min(width, height) * 0.017)
        };
      }

      if (rOpts.showChords !== false) {
        drawKaleidoscopeChords(ctx, figById, shimmerWave);
      }

      for (let i = 0; i < ALL_WHARF_IDS.length; i += 1) {
        const fid = ALL_WHARF_IDS[i];
        const normFig = figById[fid];
        if (!normFig) continue;
        const reading = getFigureReading(fid);
        drawDepartedMaskOverlay(ctx, normFig, reading, vantageX, vantageY, shimmerWave, hoveredId);
      }

      if (state.foreheadPulse01 > 0.02) {
        ctx.save();
        const fp = state.foreheadPulse01;
        const rPulse = (1 - fp) * 56 + 18;
        ctx.strokeStyle = hexToRgba(
          state.hypothesisMode === "kaleidoscope_limit" ? PALETTE.urchinSpine : PALETTE.lanternHalo,
          fp * 0.65
        );
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(vantageX, vantageY - 24, rPulse, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
        ctx.restore();
      }

      const activeNormFig = figById[state.activeFigureId] || null;
      const activeReading = getFigureReading(state.activeFigureId);
      if (state.isReciprocalLocked || state.gazeParalysis > 0.15) {
        drawParalysisVignette(ctx, width, height, state.gazeParalysis);
      }
      drawWaterMedallionAndBeam(ctx, width, height, activeNormFig, activeReading, isReduced);
    }

    recomputeDerived();

    return {
      PRIMARY_STONE_IDS,
      SECONDARY_STRANGER_IDS,
      ALL_WHARF_IDS,
      CANONICAL_DEAD_MASKS,
      RECIPROCAL_GAZES,
      RECIPROCAL_GAZE_MAP,
      setLifeStage,
      turnKaleidoscope,
      inspectFigure,
      lockReciprocalGaze,
      avertEyes,
      touchForehead,
      step,
      getFigureReading,
      renderMasksAndGaze,
      getState,
      reset
    };
  }

  const api = Object.freeze({
    PALETTE,
    PRIMARY_STONE_IDS,
    SECONDARY_STRANGER_IDS,
    ALL_WHARF_IDS,
    CANONICAL_DEAD_MASKS,
    RECIPROCAL_GAZES,
    RECIPROCAL_GAZE_MAP,
    DEAD_MASK_BY_STONE,
    DEAD_MASK_BY_ID,
    HYPOTHESIS_TEXTS,
    createBereavementEngine
  });

  globalThis.AdelmaReciprocalBereavement = api;
  if (typeof window !== "undefined") {
    window.AdelmaReciprocalBereavement = api;
  }
})();
