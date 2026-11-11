/*
 * City 41: IRENE (Chapter VIII - Cities & Names 5)
 * Layer: layers/distance_name_paradox.js
 * Responsibility: Elevation-coupled nominal dissolution engine, plateau watcher
 * conjecture profiles, dual wind-borne signal readings, and post-visit memory.
 */
globalThis.IreneDistanceParadox = (function () {
  "use strict";

  const DISSOLUTION_THRESHOLD = 0.25;
  const DEFAULT_DISTANCE = 0.88;
  const DESCENT_DISTANCE = 0.08;
  const DEFAULT_WIND = 0.58;
  const DEFAULT_WATCHER_ID = "shepherd";
  const DEFAULT_SIGNAL_ID = "bass_drums_trumpets";
  const SECOND_NAME_NOTE =
    "Seen again from the plateau after walking her streets, she would deserve another name.";

  const PALETTE = Object.freeze({
    cragObsidian: "#121015",
    basaltLedge: "#231d1c",
    twilightAbyss: "#1c1f36",
    gorgeIndigo: "#313559",
    ridgeLavender: "#5c5d87",
    milkyMistSponge: "#b8b7ce",
    hollowPinkGlow: "#f09388",
    windowAmber: "#ffbe86",
    signalFlareGreen: "#7be0a8",
    towerBeaconCoral: "#e8655a",
    parchmentChalk: "#ece2cf",
    localCobbleGrey: "#6e6b68"
  });

  const WATCHER_PROFILES = Object.freeze([
    Object.freeze({
      id: "shepherd",
      keyNumber: 1,
      shortLabel: "Shepherd",
      title: "Shepherd Shifting His Flock",
      cairnStation: "Western Cairn · 812m",
      vantageNote:
        "Stands by the western cairn with crook and ewes as twilight settles over the gorge.",
      conjecture:
        "Conjectures warm lantern-lit wool arcades, sheltered winter folds beneath the viaduct, and peaceful hearth-fires.",
      disenchantedAftertaste:
        "Finds only damp sheep-dip drains, bolted wool-weighing sheds, and mud-caked cobbles smelling of wet tallow.",
      signalSlants: Object.freeze({
        bass_drums_trumpets:
          "Hears drovers' brass horns welcoming highland fleeces into warm arcades—or night rustlers beating drums by the ford.",
        firecrackers_crackle:
          "Imagines hearth-chestnuts and paper squibs popping outside shearers' taverns—or dry fodder lofts catching spark.",
        machinegun_flares:
          "Pictures green pasture-rockets calling straying ewes toward shelter—or gorge sentries firing across the toll-bridge.",
        watchtower_beacons:
          "Reads the high cressets as turf fires warming winter folds—or wolf-watch alarms sealing every valley gate."
      })
    }),
    Object.freeze({
      id: "bird_catcher",
      keyNumber: 2,
      shortLabel: "Bird-Catcher",
      title: "Bird-Catcher Watching His Nets",
      cairnStation: "Windward Grass Ledge · 796m",
      vantageNote:
        "Crouches along the windward cliff grass beside taut twilight clap-nets.",
      conjecture:
        "Conjectures roofed aviaries, string serenades drifting from suspended pergolas, and silk banners snapping in the updraft.",
      disenchantedAftertaste:
        "Finds only rusted wire poultry-coops stacked behind a stairwell and grey laundry slapping against blind plaster walls.",
      signalSlants: Object.freeze({
        bass_drums_trumpets:
          "Hears promenade bands playing beneath gilded birdcages on hanging terraces—or muster-calls startling every roost.",
        firecrackers_crackle:
          "Imagines festival petards scattering paper ribbons from roofed pergolas—or fowling-pieces snapping under dark eaves.",
        machinegun_flares:
          "Pictures emerald star-shells gilding tame doves in mid-flight—or rapid volley-fire shredding silk banners over the chasm.",
        watchtower_beacons:
          "Reads the tower flames as nocturnal lure-lanterns for songbirds—or siege braziers warning that the bridges are cut."
      })
    }),
    Object.freeze({
      id: "hermit",
      keyNumber: 3,
      shortLabel: "Hermit",
      title: "Hermit Gathering Crag Greens",
      cairnStation: "High Basalt Shelf · 848m",
      vantageNote:
        "Leans on an ash staff along the high basalt shelf with a basket of bitter cliff herbs.",
      conjecture:
        "Conjectures walled cloister gardens in deep shadow, penitents' vigil lamps, and brazen tower bells warning of vanity.",
      disenchantedAftertaste:
        "Finds only nettle-choked rubble lots, a padlocked municipal cistern, and clerks hurrying past shuttered counting-houses.",
      signalSlants: Object.freeze({
        bass_drums_trumpets:
          "Hears solemn processional kettle-drums before a feast-night vigil—or mutinous cohorts battering the cloister gate.",
        firecrackers_crackle:
          "Imagines saltpeter censers snapping at shrine thresholds—or dry rafters splitting as factionists torch the quarter.",
        machinegun_flares:
          "Pictures alchemical green stars marking the canonical watch—or iron mitrailleuses raking the stone stairways.",
        watchtower_beacons:
          "Reads the red braziers as anchorite watch-fires of penance—or quarantine beacons barring every bridge into the hollow."
      })
    }),
    Object.freeze({
      id: "traveler",
      keyNumber: 4,
      shortLabel: "Traveler",
      title: "Traveler Sheltering Behind Crags",
      cairnStation: "Switchback Brink · 774m",
      vantageNote:
        "Pauses on the switchback brink wrapping his cloak against the evening gust.",
      conjecture:
        "Conjectures crossroads caravanserais, whispered plots under bridge arches, and lovers awaiting a signal flare.",
      disenchantedAftertaste:
        "Finds only a draughty mule-yard behind closed iron grilles, chalked freight tallies, and strangers staring at the ground.",
      signalSlants: Object.freeze({
        bass_drums_trumpets:
          "Hears carnival brass beckoning strangers into wine-lit courtyards—or garrison columns marching to seize the viaduct.",
        firecrackers_crackle:
          "Imagines betrothal squibs tossed from latticed balconies—or fuse-cords sputtering beside bolted warehouse doors.",
        machinegun_flares:
          "Pictures a promised emerald sky-sign summoning two lovers to the bridge—or barricade gunfire under magnesium glare.",
        watchtower_beacons:
          "Reads the tower torches as caravanserai lanterns promising dry straw—or curfew fires locking travelers out on the crag."
      })
    })
  ]);

  const SIGNAL_READINGS = Object.freeze([
    Object.freeze({
      id: "bass_drums_trumpets",
      keyNumber: 5,
      shortLabel: "Drums & Trumpets",
      title: "Bass Drums & Brass Trumpets",
      festivalReading:
        "A nocturnal wedding or civic carnival winding with brass horns across the central piazzas.",
      turmoilReading:
        "Garrison mobilization marching columns toward the gorge bridgeheads.",
      baseHz: 110,
      ambiguityIndex: 1.0,
      flareHex: "#ffbe86",
      localDisenchantedSource:
        "An off-key tin-horn courtyard rehearsal echoing against empty water-butts behind a tanner's shed."
    }),
    Object.freeze({
      id: "firecrackers_crackle",
      keyNumber: 6,
      shortLabel: "Firecrackers",
      title: "Crackle of Distant Firecrackers",
      festivalReading:
        "Strings of paper squibs celebrating a feast-night illumination along the terraces.",
      turmoilReading:
        "Dry timber granaries catching spark in a quarter-wide night conflagration.",
      baseHz: 520,
      ambiguityIndex: 1.0,
      flareHex: "#f09388",
      localDisenchantedSource:
        "Knotty pine crate shavings spitting resin sparks inside a cobbler's iron stove-pipe."
    }),
    Object.freeze({
      id: "machinegun_flares",
      keyNumber: 7,
      shortLabel: "Bursts & Flares",
      title: "Staccato Bursts & Greenish Flares",
      festivalReading:
        "Pyrotechnic Emerald-Star shells launched from the citadel to mark the watch hour.",
      turmoilReading:
        "Barricade machine-gun bursts under eerie magnesium-green reconnaissance flares.",
      baseHz: 260,
      ambiguityIndex: 1.0,
      flareHex: "#7be0a8",
      localDisenchantedSource:
        "A slack quarry chain-hoist rattling over iron teeth beside a greenish copper-dross trough."
    }),
    Object.freeze({
      id: "watchtower_beacons",
      keyNumber: 8,
      shortLabel: "Tower Beacons",
      title: "Signal Fires on the Towers",
      festivalReading:
        "Welcoming resin beacons guiding highland caravans toward the valley gates.",
      turmoilReading:
        "Quarantine and siege-watch braziers sealing every bridge into the hollow.",
      baseHz: 196,
      ambiguityIndex: 1.0,
      flareHex: "#e8655a",
      localDisenchantedSource:
        "Smoky municipal lime-kiln flues venting grey mortar-ash above a gravel freight siding."
    })
  ]);

  const LOCAL_STREET_BLOCKS = Object.freeze([
    Object.freeze({ x: 0.08, y: 0.62, w: 0.18, h: 0.24, label: "Tallow Yard" }),
    Object.freeze({ x: 0.29, y: 0.58, w: 0.21, h: 0.28, label: "Shuttered Cistern" }),
    Object.freeze({ x: 0.53, y: 0.60, w: 0.17, h: 0.26, label: "Quarry Hoist Shed" }),
    Object.freeze({ x: 0.73, y: 0.57, w: 0.19, h: 0.29, label: "Lime-Kiln Siding" })
  ]);

  const WATCHERS_BY_ID = Object.freeze(
    WATCHER_PROFILES.reduce(function (acc, item) {
      acc[item.id] = item;
      return acc;
    }, {})
  );

  const SIGNALS_BY_ID = Object.freeze(
    SIGNAL_READINGS.reduce(function (acc, item) {
      acc[item.id] = item;
      return acc;
    }, {})
  );

  function clamp(value, minVal, maxVal, fallback) {
    const num = Number(value);
    if (!Number.isFinite(num)) {
      return fallback;
    }
    if (num < minVal) return minVal;
    if (num > maxVal) return maxVal;
    return num;
  }

  function clamp01(value, fallback) {
    return clamp(value, 0, 1, fallback);
  }

  function round4(value) {
    return Math.round(value * 10000) / 10000;
  }

  function smoothstep01(t) {
    const c = clamp01(t, 0);
    return c * c * (3 - 2 * c);
  }

  function getWatcherProfile(watcherId) {
    if (typeof watcherId === "string" && WATCHERS_BY_ID[watcherId]) {
      return WATCHERS_BY_ID[watcherId];
    }
    if (typeof watcherId === "number") {
      const idx = Math.floor(watcherId);
      if (idx >= 0 && idx < WATCHER_PROFILES.length) return WATCHER_PROFILES[idx];
      if (idx >= 1 && idx <= WATCHER_PROFILES.length) return WATCHER_PROFILES[idx - 1];
    }
    return WATCHERS_BY_ID[DEFAULT_WATCHER_ID];
  }

  function getSignalReading(signalId) {
    if (typeof signalId === "string" && SIGNALS_BY_ID[signalId]) {
      return SIGNALS_BY_ID[signalId];
    }
    if (typeof signalId === "number") {
      const idx = Math.floor(signalId);
      if (idx >= 0 && idx < SIGNAL_READINGS.length) return SIGNAL_READINGS[idx];
      if (idx >= 5 && idx < 5 + SIGNAL_READINGS.length) return SIGNAL_READINGS[idx - 5];
    }
    return SIGNALS_BY_ID[DEFAULT_SIGNAL_ID];
  }

  function computeMistPartingRatio(windGust) {
    const w = clamp01(windGust, DEFAULT_WIND);
    return round4(clamp(0.06 + 0.94 * Math.pow(w, 0.85), 0.06, 1.0, 0.6514));
  }

  function computeStreetGridMorph(distanceFromHollow) {
    const d = clamp01(distanceFromHollow, DEFAULT_DISTANCE);
    if (d >= 0.40) {
      return 0;
    }
    if (d >= DISSOLUTION_THRESHOLD) {
      const approachT = (0.40 - d) / (0.40 - DISSOLUTION_THRESHOLD);
      return round4(0.35 * smoothstep01(approachT));
    }
    if (d <= 0.12) {
      return 1.0;
    }
    const valleyT = (DISSOLUTION_THRESHOLD - d) / (DISSOLUTION_THRESHOLD - 0.12);
    return round4(clamp(0.75 + 0.25 * smoothstep01(valleyT), 0.75, 1.0, 0.75));
  }

  function createParadoxEngine(opts = {}) {
    const config = opts && typeof opts === "object" ? opts : {};
    const onStateChange =
      typeof config.onStateChange === "function" ? config.onStateChange : null;
    const onNominalRupture =
      typeof config.onNominalRupture === "function" ? config.onNominalRupture : null;

    let distanceFromHollow = round4(clamp01(config.initialDistance, DEFAULT_DISTANCE));
    let windGust = round4(clamp01(config.initialWind, DEFAULT_WIND));
    let activeWatcherId = getWatcherProfile(config.initialWatcher).id;
    let lastSignalId = getSignalReading(config.initialSignal).id;
    let signalCount = 0;
    let everEnteredValley = distanceFromHollow < DISSOLUTION_THRESHOLD;
    let ruptureCount = everEnteredValley ? 1 : 0;
    let elapsedSec = 0;
    let windMicroRipple = 0;

    function getState() {
      const isStillIrene = distanceFromHollow >= DISSOLUTION_THRESHOLD;
      const approachedDirectly = !isStillIrene;
      const requiresAnotherName = !isStillIrene;
      const cityName = isStillIrene ? "IRENE" : "UNNAMED VALLEY QUARTER";
      const nominalStatus = isStillIrene
        ? "MAGNETIC_DISTANT_HORIZON"
        : "DISSOLVED_ON_APPROACH_NEEDS_NEW_NAME";

      const mistPartingRatio = computeMistPartingRatio(windGust);
      const brinkElevationSpan = isStillIrene
        ? (distanceFromHollow - DISSOLUTION_THRESHOLD) / (1 - DISSOLUTION_THRESHOLD)
        : 0;
      const pinkGlowIntensity = isStillIrene
        ? round4(
            clamp(
              0.35 + 0.37 * brinkElevationSpan + 0.28 * mistPartingRatio,
              0.35,
              1.0,
              0.84
            )
          )
        : 0;
      const conjectureCoherence = isStillIrene
        ? round4(clamp(0.55 + 0.45 * Math.pow(brinkElevationSpan, 0.75), 0.55, 1.0, 0.94))
        : 0;
      const streetGridMorph = computeStreetGridMorph(distanceFromHollow);

      const activeWatcher = getWatcherProfile(activeWatcherId);
      const activeSignal = getSignalReading(lastSignalId);
      const watcherSignalSlant = activeWatcher.signalSlants[activeSignal.id] || "";
      const memoryOfInside = Boolean(everEnteredValley && isStillIrene);
      const secondNameNote = memoryOfInside ? SECOND_NAME_NOTE : "";

      return {
        cityName: cityName,
        isStillIrene: isStillIrene,
        approachedDirectly: approachedDirectly,
        requiresAnotherName: requiresAnotherName,
        nominalStatus: nominalStatus,
        distanceFromHollow: distanceFromHollow,
        dissolutionThreshold: DISSOLUTION_THRESHOLD,
        windGust: windGust,
        mistPartingRatio: mistPartingRatio,
        pinkGlowIntensity: pinkGlowIntensity,
        conjectureCoherence: conjectureCoherence,
        streetGridMorph: streetGridMorph,
        activeWatcherId: activeWatcherId,
        activeWatcher: activeWatcher,
        lastSignalId: lastSignalId,
        activeSignal: activeSignal,
        watcherSignalSlant: watcherSignalSlant,
        signalCount: signalCount,
        ruptureCount: ruptureCount,
        everEnteredValley: everEnteredValley,
        memoryOfInside: memoryOfInside,
        secondNameNote: secondNameNote,
        sealLabel: isStillIrene
          ? "IRENE · MAGNETIC HORIZON"
          : "UNNAMED VALLEY QUARTER · DISSOLVED",
        elevationMeters: Math.round(190 + 650 * distanceFromHollow),
        vantageZoneLabel:
          distanceFromHollow >= 0.65
            ? "Windy Plateau Brink"
            : distanceFromHollow >= 0.40
              ? "Upper Switchback Ledge"
              : isStillIrene
                ? "Lower Gorge Lip"
                : "Valley Cobble Quarter",
        activeConjectureText: isStillIrene
          ? activeWatcher.conjecture
          : activeWatcher.disenchantedAftertaste,
        ruptureBannerText: isStillIrene
          ? ""
          : "Approached directly, the distant magnet dissolves: inside ordinary grey cobble alleys she ceases to be Irene and requires another name.",
        windMicroRipple: windMicroRipple,
        effectiveMistParting: round4(
          clamp(mistPartingRatio + windMicroRipple, 0.06, 1.0, mistPartingRatio)
        ),
        elapsedSec: round4(elapsedSec)
      };
    }

    function setDistanceFromHollow(val01) {
      const wasOnBrink = distanceFromHollow >= DISSOLUTION_THRESHOLD;
      distanceFromHollow = round4(clamp01(val01, distanceFromHollow));
      const nowInValley = distanceFromHollow < DISSOLUTION_THRESHOLD;
      let crossedIntoValley = false;
      if (wasOnBrink && nowInValley) {
        ruptureCount += 1;
        everEnteredValley = true;
        crossedIntoValley = true;
      } else if (nowInValley) {
        everEnteredValley = true;
      }
      const snapshot = getState();
      if (crossedIntoValley && onNominalRupture) {
        onNominalRupture(snapshot);
      }
      if (onStateChange) {
        onStateChange(snapshot);
      }
      return snapshot;
    }

    function descendEscarpment() {
      return setDistanceFromHollow(DESCENT_DISTANCE);
    }

    function returnToBrink() {
      return setDistanceFromHollow(DEFAULT_DISTANCE);
    }

    function setWindGust(gust01) {
      windGust = round4(clamp01(gust01, windGust));
      const snapshot = getState();
      if (onStateChange) {
        onStateChange(snapshot);
      }
      return snapshot;
    }

    function selectWatcher(watcherId) {
      const chosen = getWatcherProfile(watcherId);
      activeWatcherId = chosen.id;
      const snapshot = getState();
      if (onStateChange) {
        onStateChange(snapshot);
      }
      return snapshot;
    }

    function recordSignal(signalId) {
      const chosen =
        signalId !== undefined && signalId !== null
          ? getSignalReading(signalId)
          : getSignalReading(lastSignalId);
      lastSignalId = chosen.id;
      signalCount += 1;
      const snapshot = getState();
      if (onStateChange) {
        onStateChange(snapshot);
      }
      return {
        signalId: chosen.id,
        title: chosen.title,
        festivalReading: chosen.festivalReading,
        turmoilReading: chosen.turmoilReading,
        watcherSlant: snapshot.watcherSignalSlant,
        localDisenchantedSource: chosen.localDisenchantedSource,
        isStillIrene: snapshot.isStillIrene,
        baseHz: chosen.baseHz,
        ambiguityIndex: chosen.ambiguityIndex,
        flareHex: chosen.flareHex
      };
    }

    function step(dtSec, stepOpts = {}) {
      const dt = clamp(dtSec, 0, 0.25, 0.016);
      const options = stepOpts && typeof stepOpts === "object" ? stepOpts : {};
      if (options.reducedMotion) {
        windMicroRipple = 0;
        return getState();
      }
      elapsedSec += dt;
      windMicroRipple = round4(
        0.022 * Math.sin(elapsedSec * 1.35) + 0.011 * Math.cos(elapsedSec * 2.7)
      );
      return getState();
    }

    function reset() {
      distanceFromHollow = DEFAULT_DISTANCE;
      windGust = DEFAULT_WIND;
      activeWatcherId = DEFAULT_WATCHER_ID;
      lastSignalId = DEFAULT_SIGNAL_ID;
      signalCount = 0;
      ruptureCount = 0;
      everEnteredValley = false;
      elapsedSec = 0;
      windMicroRipple = 0;
      const snapshot = getState();
      if (onStateChange) {
        onStateChange(snapshot);
      }
      return snapshot;
    }

    return Object.freeze({
      setDistanceFromHollow: setDistanceFromHollow,
      descendEscarpment: descendEscarpment,
      returnToBrink: returnToBrink,
      setWindGust: setWindGust,
      selectWatcher: selectWatcher,
      recordSignal: recordSignal,
      step: step,
      getState: getState,
      reset: reset
    });
  }

  return Object.freeze({
    DISSOLUTION_THRESHOLD: DISSOLUTION_THRESHOLD,
    DEFAULT_DISTANCE: DEFAULT_DISTANCE,
    DESCENT_DISTANCE: DESCENT_DISTANCE,
    DEFAULT_WIND: DEFAULT_WIND,
    DEFAULT_WATCHER_ID: DEFAULT_WATCHER_ID,
    DEFAULT_SIGNAL_ID: DEFAULT_SIGNAL_ID,
    SECOND_NAME_NOTE: SECOND_NAME_NOTE,
    PALETTE: PALETTE,
    WATCHER_PROFILES: WATCHER_PROFILES,
    SIGNAL_READINGS: SIGNAL_READINGS,
    WATCHERS_BY_ID: WATCHERS_BY_ID,
    SIGNALS_BY_ID: SIGNALS_BY_ID,
    LOCAL_STREET_BLOCKS: LOCAL_STREET_BLOCKS,
    getWatcherProfile: getWatcherProfile,
    getSignalReading: getSignalReading,
    computeMistPartingRatio: computeMistPartingRatio,
    computeStreetGridMorph: computeStreetGridMorph,
    createParadoxEngine: createParadoxEngine
  });
})();

if (typeof window !== "undefined") {
  window.IreneDistanceParadox = globalThis.IreneDistanceParadox;
}
