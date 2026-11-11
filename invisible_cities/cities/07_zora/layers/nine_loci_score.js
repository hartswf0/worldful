(function (globalScope) {
  "use strict";

  function deepFreeze(obj) {
    if (!obj || typeof obj !== "object" || Object.isFrozen(obj)) {
      return obj;
    }
    Object.freeze(obj);
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      deepFreeze(obj[keys[i]]);
    }
    return obj;
  }

  var RAW_TOKENS = [
    {
      id: "famous_men",
      category: "famous_men",
      categoryLabel: "Famous Men",
      shortLabel: "Famous Men",
      title: "Famous Men: Archimedes & Simonides",
      glyph: "\u265B",
      scholarExcerpt:
        "Simonides pulled order from a collapsed banquet hall by recalling each guest's seat; Archimedes weighed crowns in displaced water and drew spheres in Syracuse dust.",
      affinityLoci: ["nine_jet_fountain", "astronomer_tower", "statue_hermit_lion"],
      affinityWhy:
        "Hydraulic jets, celestial spheres, and carved stone effigies mirror Archimedes' geometry and Simonides' monument of seats.",
      contrastWhy:
        "Immortal renown is wedged against humble street commerce so mortal transience sharpens the silhouettes of the illustrious dead."
    },
    {
      id: "virtues",
      category: "virtues",
      categoryLabel: "Cardinal Virtues",
      shortLabel: "Cardinal Virtues",
      title: "Cardinal Virtues: Temperantia & Fortitudo",
      glyph: "\u2609",
      scholarExcerpt:
        "Temperantia measures the draught drop by drop; Fortitudo tames the desert beast without raising an iron blade.",
      affinityLoci: ["nine_jet_fountain", "statue_hermit_lion"],
      affinityWhy:
        "Measured water arcs emblemize Temperantia, while the anchorite calming the stone lion embodies Fortitudo.",
      contrastWhy:
        "Austere self-mastery is pinned beside sensory indulgence and passing street vanity to etch moral poise by antithesis."
    },
    {
      id: "numbers",
      category: "numbers",
      categoryLabel: "Sacred Numbers",
      shortLabel: "Sacred Numbers",
      title: "Sacred Numbers: Novenary 9 & Golden Ratio",
      glyph: "\u2168",
      scholarExcerpt:
        "Nine is the square of the triad and the measure of Zora's itinerary; phi divides spire and chamber in self-similar proportion.",
      affinityLoci: ["copper_clock", "nine_jet_fountain", "astronomer_tower", "melon_kiosk"],
      affinityWhy:
        "Twelve-hour gear ratios, nine parabolic spouts, graduated astrolabe arcs, and stacked fruit pyramids incarnate pure number.",
      contrastWhy:
        "Exact arithmetic ratio is bound against vapor, shadow, and irregular flesh so abstract measure stands stark against flux."
    },
    {
      id: "vegetable_classifications",
      category: "vegetable_classifications",
      categoryLabel: "Vegetable Classifications",
      shortLabel: "Vegetables",
      title: "Vegetables: Cucurbita & Mediterranean Flora",
      glyph: "\u2766",
      scholarExcerpt:
        "Ribbed Cucurbita pepo, bitter oleander, mastic resin, and bruised mint sorted by rind, seed-chamber, and humoral degree.",
      affinityLoci: ["melon_kiosk", "corner_cafe"],
      affinityWhy:
        "Stacked emerald-and-ochre gourds and roasted botanical infusions house Zora's living herbal taxonomy.",
      contrastWhy:
        "Perishable sap and seeded pulp are nailed to cold mineral glass or dry bronze so living taxonomy resists winter oblivion."
    },
    {
      id: "mineral_classifications",
      category: "mineral_classifications",
      categoryLabel: "Mineral Classifications",
      shortLabel: "Minerals",
      title: "Minerals: Native Copper, Calcite & Alabaster",
      glyph: "\u25C8",
      scholarExcerpt:
        "Native Cypriot copper blooming green verdigris, doubly-refracting Iceland calcite, and translucent veined alabaster.",
      affinityLoci: ["copper_clock", "astronomer_tower", "turkish_bath"],
      affinityWhy:
        "Oxidized copper teeth, optical crystal panes, and star-pierced alabaster vaults display the three mineral kingdoms directly.",
      contrastWhy:
        "Crystalline permanence is set beside fluttering cloth, sweet melon rind, or salt tide to Pit stone against decay."
    },
    {
      id: "battle_dates",
      category: "battle_dates",
      categoryLabel: "Battle Dates",
      shortLabel: "Battle Dates",
      title: "Battle Dates: Salamis 480 BC \u00B7 Lepanto 1571",
      glyph: "\u2720",
      scholarExcerpt:
        "Triremes locked in the narrow strait at Salamis (480 BC); oar-banks splintered beneath autumn smoke at Lepanto (1571).",
      affinityLoci: ["copper_clock", "harbor_alley"],
      affinityWhy:
        "The relentless copper hour-wheel and the sea-facing harbor steps summon epochs of naval reckoning.",
      contrastWhy:
        "Clamor of bronze rams and dated carnage is sealed inside Zora's quietest domes and arcades by jarring historical contrast."
    },
    {
      id: "constellations",
      category: "constellations",
      categoryLabel: "Constellations",
      shortLabel: "Constellations",
      title: "Constellations: Leo, Cygnus & Navis",
      glyph: "\u2726",
      scholarExcerpt:
        "Regulus burning in the Lion's chest, Cygnus spread along the Milky Way, and Argo Navis steering above southern shoals.",
      affinityLoci: ["astronomer_tower", "statue_hermit_lion", "turkish_bath", "harbor_alley"],
      affinityWhy:
        "Sighted through the glass cupola, crouched as stone Leo, pierced in star-oculi, and guiding harbor masts.",
      contrastWhy:
        "High sidereal fire is tethered down beneath humble awnings and market scales so heaven stays anchored to street dust."
    },
    {
      id: "parts_of_speech",
      category: "parts_of_speech",
      categoryLabel: "Parts of Speech",
      shortLabel: "Parts of Speech",
      title: "Parts of Speech: Preposition, Vocative & Conjunction",
      glyph: "\u00A7",
      scholarExcerpt:
        "Prepositions govern spatial thresholds (ad, sub, trans); the vocative calls the absent by name; conjunctions hinge two lanes.",
      affinityLoci: ["barber_awning", "corner_cafe", "harbor_alley"],
      affinityWhy:
        "Beneath the awning (sub), hinged at the corner cafe (et), and directed down the alley toward the port (ad portum).",
      contrastWhy:
        "Articulate grammar is inscribed upon mute stone, silent water, and wordless vapor so speech clings to stillness."
    },
    {
      id: "rhetorical_figures",
      category: "rhetorical_figures",
      categoryLabel: "Mnemonic Tropes",
      shortLabel: "Mnemonic Tropes",
      title: "Mnemonic Tropes: Affinity & Antithesis",
      glyph: "\u21CC",
      scholarExcerpt:
        "Ad Herennium teaches imagines agentes: bind like to like by gentle kinship, or strike the mind awake by contrariety.",
      affinityLoci: ["barber_awning", "turkish_bath", "corner_cafe"],
      affinityWhy:
        "Alternating red-and-chalk stripes, hot stone meeting cool condensate, and conversing crossroads enact living antithesis.",
      contrastWhy:
        "The meta-rule of figures is locked onto unyielding monuments, freezing invention itself into an invariant rule."
    }
  ];

  var RAW_LOCI = [
    {
      index: 0,
      step: 1,
      roman: "I",
      id: "copper_clock",
      name: "The Copper Clock",
      title: "The Copper Clock",
      shortName: "Copper Clock",
      latin: "I \u00B7 Horologium Cupreum",
      noteName: "D4",
      freq: 293.66,
      bourdonFreq: null,
      timbre: "bell",
      neumeRank: 0,
      stoneDetail:
        "Verdigris-patinated copper dial set into Zora's western gatehouse arch, its oxidized Roman chapter ring struck by a slender bronze hammer.",
      livingMotionDesc:
        "A warm brass pendulum swings through mountain-river air while copper escapement teeth advance in patient earthly breath.",
      frozenDesc:
        "Pendulum arrested mid-swing; verdigris dial bleached to chalk-ash beneath an invariant hexagonal seal, chiming only in memory."
    },
    {
      index: 1,
      step: 2,
      roman: "II",
      id: "barber_awning",
      name: "The Barber's Striped Awning",
      title: "The Barber's Striped Awning",
      shortName: "Barber's Awning",
      latin: "II \u00B7 Velarium Tonsoris",
      noteName: "F4",
      freq: 349.23,
      bourdonFreq: null,
      timbre: "lute",
      neumeRank: 2,
      stoneDetail:
        "Diagonal vermilion-and-chalk linen canopy stretched on iron stays above a hammered brass shaving basin and spiraled cedar pole.",
      livingMotionDesc:
        "Morning drafts from the six rivers ripple the alternating red and white linen bands in supple syncopation.",
      frozenDesc:
        "Every diagonal stripe stiffens like calcined gypsum; vermilion madder flakes from the petrified hem into dry street wind."
    },
    {
      index: 2,
      step: 3,
      roman: "III",
      id: "nine_jet_fountain",
      name: "The Fountain with Nine Jets",
      title: "The Fountain with Nine Jets",
      shortName: "Nine-Jet Fountain",
      latin: "III \u00B7 Fons Novem Salientium",
      noteName: "A4",
      freq: 440.0,
      bourdonFreq: null,
      timbre: "fountain_harp",
      neumeRank: 4,
      stoneDetail:
        "Carved octagonal limestone basin fed by mountain aqueducts, lofting nine distinct parabolic water arcs from bronze spigots.",
      livingMotionDesc:
        "Nine silver trajectories braid and patter continuously into concentric rings across dark wet limestone.",
      frozenDesc:
        "All nine water parabolas vitrify into motionless glass filaments; the dry basin cracks along salt-bleached veins."
    },
    {
      index: 3,
      step: 4,
      roman: "IV",
      id: "astronomer_tower",
      name: "The Astronomer's Glass Tower",
      title: "The Astronomer's Glass Tower",
      shortName: "Astronomer's Tower",
      latin: "IV \u00B7 Turris Vitrea Astronomi",
      noteName: "G4",
      freq: 392.0,
      bourdonFreq: null,
      timbre: "glass",
      neumeRank: 3,
      stoneDetail:
        "Faceted rock-crystal observatory cupola crowning a slender ashlar drum, housing graduated brass armillary rings and star sights.",
      livingMotionDesc:
        "Amber sunbeams refract across slowly turning meridian circles aligned with the diurnal vault.",
      frozenDesc:
        "Armillary rings seize at a fixed dead zenith; crystal facets craze with silverpoint frost and shed mineral dust."
    },
    {
      index: 4,
      step: 5,
      roman: "V",
      id: "melon_kiosk",
      name: "The Melon Vendor's Kiosk",
      title: "The Melon Vendor's Kiosk",
      shortName: "Melon Kiosk",
      latin: "V \u00B7 Taberna Peponum",
      noteName: "B4",
      freq: 493.88,
      bourdonFreq: null,
      timbre: "reed",
      neumeRank: 5,
      stoneDetail:
        "Slatted cypress-timber booth heaped with pyramids of ribbed green and ochre melons beside a suspended brass balance.",
      livingMotionDesc:
        "Sweet summer rind scent rises while brass scale pans sway gently above damp vine leaves.",
      frozenDesc:
        "Melon pyramids desiccate into hollow ash-rinds; the brass balance hangs plumb and dead without a tremor."
    },
    {
      index: 5,
      step: 6,
      roman: "VI",
      id: "statue_hermit_lion",
      name: "Statue of the Hermit and the Lion",
      title: "Statue of the Hermit and the Lion",
      shortName: "Hermit & Lion",
      latin: "VI \u00B7 Effigies Eremitae et Leonis",
      noteName: "F4",
      freq: 349.23,
      bourdonFreq: 146.83,
      timbre: "stone_horn",
      neumeRank: 2,
      stoneDetail:
        "Weathered travertine pedestal bearing a gaunt cowled hermit leaning on his staff while a crouched stone lion rests a paw by his sandal.",
      livingMotionDesc:
        "Swallows wheel around the warm travertine hood as sun-shadows breathe softly across the carved lion's mane.",
      frozenDesc:
        "Travertine calcines to brittle chalk; deep fissures cleave pedestal and mane as memory forbids even shadow to creep."
    },
    {
      index: 6,
      step: 7,
      roman: "VII",
      id: "turkish_bath",
      name: "The Turkish Bath",
      title: "The Turkish Bath",
      shortName: "Turkish Bath",
      latin: "VII \u00B7 Balneum Vaporis",
      noteName: "E4",
      freq: 329.63,
      bourdonFreq: null,
      timbre: "vapor_flute",
      neumeRank: 1,
      stoneDetail:
        "Low masonry caldarium dome pierced with star-shaped alabaster oculi, exhaling cedar-scented vapor into the narrow street.",
      livingMotionDesc:
        "Warm translucent steam curls upward from star-oculi, beading in living droplets along veined alabaster rims.",
      frozenDesc:
        "Vapor freezes into dry chalk haze; the star-oculi go cold and powdery as hypocaust embers die beneath invariance."
    },
    {
      index: 7,
      step: 8,
      roman: "VIII",
      id: "corner_cafe",
      name: "The Caf\u00E9 at the Corner",
      title: "The Caf\u00E9 at the Corner",
      shortName: "Corner Caf\u00E9",
      latin: "VIII \u00B7 Caupona Angularis",
      noteName: "C5",
      freq: 523.25,
      bourdonFreq: null,
      timbre: "clavichord",
      neumeRank: 6,
      stoneDetail:
        "Twin-arched corner colonnade where a wrought-brass lantern hangs above marble tables, porcelain cups, and intersecting talk.",
      livingMotionDesc:
        "The corner lantern sways on its chain while cardamom steam and inflected voices cross between two lanes.",
      frozenDesc:
        "Lantern chain stiffens like cast iron; porcelain cups hold only dry gall-ink sediment at the silent crossroads."
    },
    {
      index: 8,
      step: 9,
      roman: "IX",
      id: "harbor_alley",
      name: "The Alley Leading to the Harbor",
      title: "The Alley Leading to the Harbor",
      shortName: "Harbor Alley",
      latin: "IX \u00B7 Angiportus ad Portum",
      noteName: "D5",
      freq: 587.33,
      bourdonFreq: 293.66,
      timbre: "harbor_fifth",
      neumeRank: 7,
      stoneDetail:
        "Converging perspective flagstones descending between salt-bleached walls toward iron mooring bollards and masts on the open sea.",
      livingMotionDesc:
        "Green tide laps the lowest step in fifths while halyards clink softly against spruce masts beyond the quay.",
      frozenDesc:
        "Tide and mast stand etched in motionless silverpoint; the alley's flagstones crumble eastward into wind-scoured dust."
    }
  ];

  // Guarantee exact bidirectional symmetry between token.affinityLoci and locus.affinityTokenIds
  for (var li = 0; li < RAW_LOCI.length; li++) {
    var locusEntry = RAW_LOCI[li];
    var matchingTokens = [];
    for (var ti = 0; ti < RAW_TOKENS.length; ti++) {
      if (RAW_TOKENS[ti].affinityLoci.indexOf(locusEntry.id) !== -1) {
        matchingTokens.push(RAW_TOKENS[ti].id);
      }
    }
    locusEntry.affinityTokenIds = matchingTokens;
  }

  var LOCI = deepFreeze(RAW_LOCI);
  var TOKENS = deepFreeze(RAW_TOKENS);

  var TOPOGRAPHY = deepFreeze({
    riversCount: 6,
    mountainRangesCount: 3,
    mode: "D Dorian",
    tonicNote: "D4",
    tonicHz: 293.66,
    approachProse:
      "Beyond six rivers and three mountain ranges rises Zora, a city that no one, having seen it, can forget."
  });

  var SPECIFIC_MNEMONIC_NOTES = {
    "copper_clock:mineral_classifications":
      "Affinity of substance: native Cypriot copper and its green patina sit directly before the eye on the gatehouse dial.",
    "copper_clock:numbers":
      "Affinity of measure: escapement ratios and Roman hours divide Zora's opening D4 pulse into exact novenary proportion.",
    "copper_clock:battle_dates":
      "Affinity of chronicle: each strike of the bronze hammer notches Salamis (480 BC) and Lepanto (1571) into irreversible time.",
    "copper_clock:famous_men":
      "Contrast of mortality: Archimedes and Simonides outlive the relentless copper teeth that devour ordinary hours.",
    "barber_awning:parts_of_speech":
      "Affinity of syntax: alternating red-and-chalk bands parse speech into preposition (sub velario) and conjunction.",
    "barber_awning:rhetorical_figures":
      "Affinity of figure: vermilion set beside chalk-white exemplifies visual antithesis fluttering over the lane.",
    "barber_awning:virtues":
      "Contrast of austerity: Temperantia and Fortitudo stand firmer when pinned against the barber's brisk mirror of street vanity.",
    "nine_jet_fountain:numbers":
      "Affinity of the Novenary: nine parabolic water arcs mirror the sacred number 9 and the golden harmonic division of the basin.",
    "nine_jet_fountain:famous_men":
      "Affinity of hydrostatics: Archimedes' law of displaced water sings through the nine calibrated bronze spigots.",
    "nine_jet_fountain:virtues":
      "Affinity of Temperantia: nine equal streams pour without excess or drought into the octagonal stone.",
    "astronomer_tower:constellations":
      "Affinity of the vault: Leo, Cygnus, and Navis wheel directly through the rock-crystal cupola's sighted meridian.",
    "astronomer_tower:famous_men":
      "Affinity of inquiry: Archimedes' celestial sphere turns anew inside Zora's elevated glass observatory.",
    "astronomer_tower:numbers":
      "Affinity of degree: graduated brass armillary rings inscribe golden-section arcs across the sky.",
    "astronomer_tower:mineral_classifications":
      "Affinity of optics: polished rock-crystal and Iceland spar refract starlight along mineral cleavage planes.",
    "astronomer_tower:vegetable_classifications":
      "Contrast of kingdoms: damp earthbound gourds and bruised herbs are suspended inside dry sidereal crystal so neither can be mislaid.",
    "melon_kiosk:vegetable_classifications":
      "Affinity of flora: ribbed emerald and ochre Cucurbita pyramids embody Mediterranean botanical classification in situ.",
    "melon_kiosk:numbers":
      "Affinity of triangular heaps: stacked melons and brass counterweights make arithmetic tangible.",
    "melon_kiosk:mineral_classifications":
      "Contrast of density: native copper, calcite, and alabaster weigh starkly against sweet perishable melon pulp.",
    "statue_hermit_lion:virtues":
      "Affinity of Fortitudo: the gaunt anchorite and tamed travertine lion personify gentle strength and desert temperance.",
    "statue_hermit_lion:constellations":
      "Affinity of emblem: terrestrial Leo crouched in travertine answers celestial Leo burning at the zenith.",
    "statue_hermit_lion:famous_men":
      "Affinity of monument: Simonides' art of stone memorials fixes heroic counsel upon the carved plinth.",
    "statue_hermit_lion:battle_dates":
      "Contrast of stillness: the roar of Salamis and Lepanto is pinned to a silent ascetic and a pacified beast.",
    "turkish_bath:mineral_classifications":
      "Affinity of stone: translucent veined alabaster oculi glow above warm calcareous masonry.",
    "turkish_bath:constellations":
      "Affinity of pierced vault: star-cut ceiling oculi cast Leo, Cygnus, and Navis as shafts of steam-lit light.",
    "turkish_bath:rhetorical_figures":
      "Affinity of union: fire beneath and cool stone above enact living oxymoron inside the caldarium.",
    "corner_cafe:parts_of_speech":
      "Affinity of crossroads grammar: two lanes joined by conjunction, travelers hailed in the vocative beneath the corner arch.",
    "corner_cafe:rhetorical_figures":
      "Affinity of dialogue: Affinity and Antithesis trade replies across veined marble tables.",
    "corner_cafe:vegetable_classifications":
      "Affinity of infusion: roasted Coffea bean and crushed green cardamom pod steep botanical memory in porcelain.",
    "harbor_alley:battle_dates":
      "Affinity of sea-lanes: stepped flagstones opening onto lateen masts recall the galley fleets of 480 BC and 1571.",
    "harbor_alley:constellations":
      "Affinity of navigation: Argo Navis and Cygnus steer outbound hulls beyond the harbor bollards.",
    "harbor_alley:parts_of_speech":
      "Affinity of direction: Angiportus ad Portum incarnates the accusative of motion toward the sea.",
    "harbor_alley:rhetorical_figures":
      "Contrast of closure: the treatise's reversible tropes are nailed to Zora's ninth and final threshold, freezing departure forever."
  };

  function buildMnemonicRule(locus, token, relation) {
    var key = locus.id + ":" + token.id;
    if (SPECIFIC_MNEMONIC_NOTES[key]) {
      return SPECIFIC_MNEMONIC_NOTES[key];
    }
    if (relation === "affinity") {
      return (
        "Bound by Affinity at " +
        locus.roman +
        " (" +
        locus.name +
        "): " +
        token.affinityWhy
      );
    }
    return (
      "Bound by Contrast at " +
      locus.roman +
      " (" +
      locus.name +
      "): " +
      token.shortLabel +
      " sets an imagines agentes counterpoint against " +
      locus.shortName.toLowerCase() +
      " \u2014 " +
      token.contrastWhy
    );
  }

  function getLocus(indexOrId) {
    if (typeof indexOrId === "number" && Number.isInteger(indexOrId)) {
      return LOCI[indexOrId] || null;
    }
    if (typeof indexOrId === "string") {
      var asNum = Number(indexOrId);
      if (indexOrId.trim() !== "" && Number.isInteger(asNum) && LOCI[asNum]) {
        return LOCI[asNum];
      }
      for (var i = 0; i < LOCI.length; i++) {
        if (LOCI[i].id === indexOrId) {
          return LOCI[i];
        }
      }
    }
    return null;
  }

  function getToken(tokenIdOrObj) {
    if (!tokenIdOrObj) {
      return null;
    }
    var key = typeof tokenIdOrObj === "object" ? tokenIdOrObj.id || tokenIdOrObj.category : String(tokenIdOrObj);
    for (var i = 0; i < TOKENS.length; i++) {
      if (TOKENS[i].id === key || TOKENS[i].category === key) {
        return TOKENS[i];
      }
    }
    return null;
  }

  function evaluateRelation(locusIndexOrId, tokenId) {
    var locus = getLocus(locusIndexOrId);
    var token = getToken(tokenId);
    if (!locus || !token) {
      return null;
    }
    var relation = token.affinityLoci.indexOf(locus.id) !== -1 ? "affinity" : "contrast";
    return {
      locusIndex: locus.index,
      locusId: locus.id,
      tokenId: token.id,
      relation: relation,
      mnemonicRule: buildMnemonicRule(locus, token, relation)
    };
  }

  // Canonical event-key normalizer supporting both options names ("onStateChange") and short names ("stateChange")
  function normalizeEventName(name) {
    var raw = String(name || "").trim().toLowerCase();
    if (raw === "onstatechange" || raw === "statechange" || raw === "state" || raw === "change") {
      return "onStateChange";
    }
    if (raw === "onnoteplayed" || raw === "noteplayed" || raw === "note") {
      return "onNotePlayed";
    }
    if (
      raw === "ondisplacementrefused" ||
      raw === "displacementrefused" ||
      raw === "refused" ||
      raw === "refusal"
    ) {
      return "onDisplacementRefused";
    }
    if (raw === "ontokenbound" || raw === "tokenbound" || raw === "bound" || raw === "bind") {
      return "onTokenBound";
    }
    return name;
  }

  // Zero-dependency WebAudio Dorian chamber & ghost-crystal synthesizer
  function createChamberSynth() {
    var ctx = null;
    var masterGain = null;

    function ensureContext() {
      if (ctx) {
        if (ctx.state === "suspended" && typeof ctx.resume === "function") {
          try {
            var p = ctx.resume();
            if (p && typeof p.catch === "function") {
              p.catch(function () {});
            }
          } catch (_err) {}
        }
        return ctx;
      }
      var AudioCtx =
        (globalScope && (globalScope.AudioContext || globalScope.webkitAudioContext)) || null;
      if (!AudioCtx) {
        return null;
      }
      try {
        ctx = new AudioCtx();
        masterGain = ctx.createGain();
        masterGain.gain.value = 0.26;
        masterGain.connect(ctx.destination);
        if (ctx.state === "suspended" && typeof ctx.resume === "function") {
          var resumePromise = ctx.resume();
          if (resumePromise && typeof resumePromise.catch === "function") {
            resumePromise.catch(function () {});
          }
        }
      } catch (_e) {
        ctx = null;
        masterGain = null;
      }
      return ctx;
    }

    function scheduleVoice(ac, dest, freq, type, startTime, attack, duration, peakGain, detuneCents) {
      if (!ac || !dest || !(freq > 0) || !(peakGain > 0)) {
        return;
      }
      try {
        var osc = ac.createOscillator();
        var env = ac.createGain();
        osc.type = type || "sine";
        osc.frequency.setValueAtTime(freq, startTime);
        if (detuneCents) {
          osc.detune.setValueAtTime(detuneCents, startTime);
        }
        env.gain.setValueAtTime(0.0001, startTime);
        env.gain.linearRampToValueAtTime(peakGain, startTime + Math.max(0.004, attack));
        env.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.max(attack + 0.03, duration));
        osc.connect(env);
        env.connect(dest);
        osc.start(startTime);
        osc.stop(startTime + duration + 0.02);
      } catch (_err) {}
    }

    function playLocusNote(locus, fixationRatio, isLocusLocked, timeOffsetSec) {
      var ac = ensureContext();
      if (!ac || !masterGain || !locus) {
        return false;
      }
      var now = ac.currentTime + (timeOffsetSec || 0);
      var f = locus.freq;
      var isGhost = fixationRatio >= 0.999;

      if (isGhost) {
        // Pure disembodied silverpoint / crystal-ghost harmonics after earthly Zora vanishes
        scheduleVoice(ac, masterGain, f, "sine", now, 0.028, 1.35, 0.24, 0);
        scheduleVoice(ac, masterGain, f * 2, "sine", now, 0.045, 1.55, 0.12, 3);
        scheduleVoice(ac, masterGain, f * 3, "sine", now + 0.015, 0.06, 1.25, 0.055, -3);
        if (locus.bourdonFreq) {
          scheduleVoice(ac, masterGain, locus.bourdonFreq * 2, "sine", now, 0.05, 1.45, 0.09, 0);
        }
        return true;
      }

      var earthWeight = Math.max(0.25, 1 - 0.55 * fixationRatio - (isLocusLocked ? 0.18 : 0));
      var crystalBlend = Math.min(0.85, 0.55 * fixationRatio + (isLocusLocked ? 0.25 : 0));
      var timbre = locus.timbre;

      if (timbre === "bell") {
        // Copper Clock: struck copper fundamental + octave + copper bell partial
        scheduleVoice(ac, masterGain, f, "triangle", now, 0.006, 0.95, 0.30 * earthWeight, 0);
        scheduleVoice(ac, masterGain, f * 2.0, "sine", now, 0.005, 0.72, 0.15, 2);
        scheduleVoice(ac, masterGain, f * 2.756, "sine", now, 0.004, 0.42, 0.075 * earthWeight, 0);
      } else if (timbre === "lute") {
        // Barber's Awning: plucked Renaissance gut-string lute
        scheduleVoice(ac, masterGain, f, "triangle", now, 0.008, 0.68, 0.30 * earthWeight, 0);
        scheduleVoice(ac, masterGain, f * 2, "sine", now, 0.006, 0.38, 0.12 * earthWeight, -2);
        scheduleVoice(ac, masterGain, f * 1.5, "sine", now + 0.012, 0.01, 0.32, 0.05 * earthWeight, 0);
      } else if (timbre === "fountain_harp") {
        // Nine-Jet Fountain: cascading three-droplet harp figure
        scheduleVoice(ac, masterGain, f, "triangle", now, 0.008, 0.78, 0.25 * earthWeight, 0);
        scheduleVoice(ac, masterGain, f * 1.5, "sine", now + 0.045, 0.008, 0.52, 0.11 * earthWeight, 0);
        scheduleVoice(ac, masterGain, f * 2.0, "sine", now + 0.09, 0.008, 0.48, 0.09, 0);
      } else if (timbre === "glass") {
        // Astronomer's Glass Tower: bowed crystal armonica swell
        scheduleVoice(ac, masterGain, f, "sine", now, 0.065, 1.05, 0.26, 0);
        scheduleVoice(ac, masterGain, f * 2, "sine", now, 0.08, 0.95, 0.12, 4);
        scheduleVoice(ac, masterGain, f * 4, "sine", now + 0.02, 0.07, 0.65, 0.035, -3);
      } else if (timbre === "reed") {
        // Melon Kiosk: warm pastoral Dorian B-natural dulcian reed
        scheduleVoice(ac, masterGain, f, "triangle", now, 0.022, 0.74, 0.24 * earthWeight, 0);
        scheduleVoice(ac, masterGain, f * 3, "sine", now, 0.028, 0.46, 0.075 * earthWeight, 0);
        scheduleVoice(ac, masterGain, f * 2, "sine", now, 0.025, 0.42, 0.05 * earthWeight, 2);
      } else if (timbre === "stone_horn") {
        // Hermit and Lion: cornetto horn over D3 travertine bourdon
        scheduleVoice(ac, masterGain, f, "triangle", now, 0.035, 0.92, 0.25 * earthWeight, 0);
        if (locus.bourdonFreq) {
          scheduleVoice(ac, masterGain, locus.bourdonFreq, "triangle", now, 0.04, 1.05, 0.20 * earthWeight, 0);
        }
        scheduleVoice(ac, masterGain, f * 2, "sine", now, 0.04, 0.65, 0.07, 0);
      } else if (timbre === "vapor_flute") {
        // Turkish Bath: warm breathy alabaster end-blown flute
        scheduleVoice(ac, masterGain, f, "sine", now, 0.055, 0.88, 0.27 * earthWeight, 0);
        scheduleVoice(ac, masterGain, f * 2, "triangle", now + 0.01, 0.06, 0.58, 0.065 * earthWeight, 5);
      } else if (timbre === "clavichord") {
        // Corner Cafe: tangent-struck clavichord
        var detune = isLocusLocked ? 0 : 4;
        scheduleVoice(ac, masterGain, f, "triangle", now, 0.005, 0.66, 0.26 * earthWeight, 0);
        scheduleVoice(ac, masterGain, f * 2, "triangle", now, 0.005, 0.42, 0.10 * earthWeight, detune);
        scheduleVoice(ac, masterGain, f * 3, "sine", now, 0.005, 0.28, 0.045 * earthWeight, 0);
      } else {
        // Harbor Alley: open-sea octave + Dorian fifth cadence
        scheduleVoice(ac, masterGain, f, "triangle", now, 0.016, 1.12, 0.25 * earthWeight, 0);
        if (locus.bourdonFreq) {
          scheduleVoice(ac, masterGain, locus.bourdonFreq, "triangle", now, 0.02, 1.2, 0.20 * earthWeight, 0);
          scheduleVoice(ac, masterGain, locus.bourdonFreq * 1.5, "sine", now + 0.03, 0.03, 0.95, 0.11, 0);
        }
      }

      if (crystalBlend > 0.05) {
        scheduleVoice(ac, masterGain, f * 2, "sine", now + 0.01, 0.04, 0.95, 0.09 * crystalBlend, 0);
      }
      return true;
    }

    function playOutOfSequenceRefusal() {
      var ac = ensureContext();
      if (!ac || !masterGain) {
        return false;
      }
      var now = ac.currentTime;
      // Short dry clave + minor-second boundary stop
      scheduleVoice(ac, masterGain, 830, "triangle", now, 0.002, 0.065, 0.18, 0);
      scheduleVoice(ac, masterGain, 311.13, "sine", now + 0.015, 0.004, 0.11, 0.14, 0);
      scheduleVoice(ac, masterGain, 293.66, "sine", now + 0.015, 0.004, 0.11, 0.12, 0);
      return true;
    }

    function playDisplacementRefusal() {
      var ac = ensureContext();
      if (!ac || !masterGain) {
        return false;
      }
      var now = ac.currentTime;
      // Dissonant tritone + minor-ninth dyad refusal
      scheduleVoice(ac, masterGain, 293.66, "triangle", now, 0.004, 0.22, 0.18, 0);
      scheduleVoice(ac, masterGain, 415.3, "triangle", now, 0.004, 0.22, 0.18, 0);
      scheduleVoice(ac, masterGain, 622.25, "sine", now + 0.02, 0.004, 0.18, 0.1, 0);
      return true;
    }

    function playBindingCadence(locus, relation, isFinalLock) {
      var ac = ensureContext();
      if (!ac || !masterGain || !locus) {
        return false;
      }
      var now = ac.currentTime;
      var root = locus.freq;
      if (relation === "affinity") {
        // Consonant pure fifth (3:2)
        scheduleVoice(ac, masterGain, root, "sine", now, 0.012, 0.55, 0.16, 0);
        scheduleVoice(ac, masterGain, root * 1.5, "sine", now + 0.035, 0.015, 0.62, 0.14, 0);
      } else {
        // Modal fourth-to-fifth contrast cadence (4:3 -> 3:2)
        scheduleVoice(ac, masterGain, root, "triangle", now, 0.01, 0.62, 0.14, 0);
        scheduleVoice(ac, masterGain, root * (4 / 3), "sine", now + 0.015, 0.012, 0.22, 0.13, 0);
        scheduleVoice(ac, masterGain, root * 1.5, "sine", now + 0.19, 0.018, 0.48, 0.14, 0);
      }
      if (isFinalLock) {
        // High crystalline ghost-octave seal when all 9 cells lock invariant
        scheduleVoice(ac, masterGain, 587.33 * 2, "sine", now + 0.18, 0.06, 1.65, 0.12, 0);
        scheduleVoice(ac, masterGain, 440.0 * 2, "sine", now + 0.26, 0.07, 1.5, 0.08, 0);
      }
      return true;
    }

    function playMemorizeSweep() {
      var ac = ensureContext();
      if (!ac || !masterGain) {
        return false;
      }
      var now = ac.currentTime;
      for (var i = 0; i < LOCI.length; i++) {
        var t = now + i * 0.052;
        scheduleVoice(ac, masterGain, LOCI[i].freq * 2, "sine", t, 0.012, 0.72, 0.095, 0);
      }
      scheduleVoice(ac, masterGain, 293.66 * 2, "sine", now + 0.52, 0.06, 1.6, 0.14, 0);
      scheduleVoice(ac, masterGain, 440.0 * 2, "sine", now + 0.55, 0.06, 1.5, 0.1, 0);
      return true;
    }

    function playReleaseBreath(freq) {
      var ac = ensureContext();
      if (!ac || !masterGain) {
        return false;
      }
      var now = ac.currentTime;
      var base = freq || 293.66;
      scheduleVoice(ac, masterGain, base * 1.5, "sine", now, 0.02, 0.28, 0.1, 0);
      scheduleVoice(ac, masterGain, base, "triangle", now + 0.08, 0.025, 0.45, 0.13, 0);
      return true;
    }

    return {
      playLocusNote: playLocusNote,
      playOutOfSequenceRefusal: playOutOfSequenceRefusal,
      playDisplacementRefusal: playDisplacementRefusal,
      playBindingCadence: playBindingCadence,
      playMemorizeSweep: playMemorizeSweep,
      playReleaseBreath: playReleaseBreath
    };
  }

  function createEngine(options) {
    var opts = options || {};
    var listeners = {
      onStateChange: [],
      onNotePlayed: [],
      onDisplacementRefused: [],
      onTokenBound: []
    };

    var eventKeys = Object.keys(listeners);
    for (var k = 0; k < eventKeys.length; k++) {
      var evKey = eventKeys[k];
      if (typeof opts[evKey] === "function") {
        listeners[evKey].push(opts[evKey]);
      }
    }

    var synth = createChamberSynth();
    var walkedUpTo = -1;
    var activeLocus = -1;
    var bindings = [null, null, null, null, null, null, null, null, null];
    var refusalCount = 0;
    var muted = Boolean(opts.muted);
    var lastAnnouncement =
      "Beyond six rivers and three mountain ranges rises Zora. Sound Locus I (The Copper Clock, D4) to enter her unalterable street score.";
    var activePlayback = null;

    function countLocked() {
      var count = 0;
      for (var i = 0; i < bindings.length; i++) {
        if (bindings[i]) {
          count += 1;
        }
      }
      return count;
    }

    function getState() {
      var lockedCount = countLocked();
      var fixationRatio = lockedCount / LOCI.length;
      var clonedBindings = new Array(LOCI.length);
      for (var i = 0; i < LOCI.length; i++) {
        clonedBindings[i] = bindings[i] ? Object.assign({}, bindings[i]) : null;
      }
      return {
        walkedUpTo: walkedUpTo,
        walkedCount: walkedUpTo + 1,
        nextRequiredIndex: walkedUpTo + 1,
        activeLocus: activeLocus,
        bindings: clonedBindings,
        lockedCount: lockedCount,
        fixationRatio: fixationRatio,
        isFullyMemorized: lockedCount === LOCI.length,
        refusalCount: refusalCount,
        muted: muted,
        isPlaying: Boolean(activePlayback),
        lastAnnouncement: lastAnnouncement
      };
    }

    function emit(eventName, payload) {
      var canonical = normalizeEventName(eventName);
      var list = listeners[canonical];
      if (!list || list.length === 0) {
        return;
      }
      var copy = list.slice();
      for (var i = 0; i < copy.length; i++) {
        try {
          copy[i](payload);
        } catch (_err) {}
      }
    }

    function on(eventName, fn) {
      var canonical = normalizeEventName(eventName);
      if (typeof fn !== "function" || !listeners[canonical]) {
        return function () {};
      }
      listeners[canonical].push(fn);
      return function offCurrent() {
        off(canonical, fn);
      };
    }

    function off(eventName, fn) {
      var canonical = normalizeEventName(eventName);
      var list = listeners[canonical];
      if (!list) {
        return;
      }
      var idx = list.indexOf(fn);
      if (idx !== -1) {
        list.splice(idx, 1);
      }
    }

    function stopPlayback() {
      if (!activePlayback) {
        return false;
      }
      var current = activePlayback;
      activePlayback = null;
      for (var i = 0; i < current.timers.length; i++) {
        clearTimeout(current.timers[i]);
      }
      if (typeof current.finish === "function") {
        current.finish({ completed: false, cancelled: true });
      }
      return true;
    }

    function walkLocus(index) {
      var idx = typeof index === "number" ? index : Number(index);
      if (!Number.isInteger(idx) || idx < 0 || idx >= LOCI.length) {
        var invalidReq = Math.min(LOCI.length - 1, Math.max(0, walkedUpTo + 1));
        var invalidMsg =
          "Zora's score contains exactly nine loci, from I (The Copper Clock) to IX (The Alley Leading to the Harbor).";
        return {
          accepted: false,
          reason: "invalid_locus",
          attemptedIndex: index,
          requiredIndex: invalidReq,
          message: invalidMsg
        };
      }

      if (idx === walkedUpTo + 1 || (idx >= 0 && idx <= walkedUpTo)) {
        var isNewStep = idx === walkedUpTo + 1;
        walkedUpTo = Math.max(walkedUpTo, idx);
        activeLocus = idx;
        var locus = LOCI[idx];
        var lockedCount = countLocked();
        var fixationRatio = lockedCount / LOCI.length;
        var isGhost = lockedCount === LOCI.length;

        if (!muted) {
          synth.playLocusNote(locus, fixationRatio, Boolean(bindings[idx]), 0);
        }

        if (isGhost) {
          lastAnnouncement =
            locus.latin +
            " (" +
            locus.noteName +
            ") \u2014 Earthly stone has vanished; only Zora's crystal ghost-note sounds inside memory.";
        } else if (bindings[idx]) {
          lastAnnouncement =
            locus.latin +
            " \u00B7 " +
            locus.name +
            " (" +
            locus.noteName +
            ") \u2014 Locked invariant with " +
            bindings[idx].shortLabel +
            " (" +
            bindings[idx].relation +
            ").";
        } else {
          lastAnnouncement =
            locus.latin +
            " \u00B7 " +
            locus.name +
            " (" +
            locus.noteName +
            ") \u2014 " +
            locus.livingMotionDesc;
        }

        var notePayload = {
          accepted: true,
          locus: locus,
          index: idx,
          step: idx + 1,
          noteName: locus.noteName,
          freq: locus.freq,
          timbre: isGhost ? "crystal_ghost" : locus.timbre,
          isNewStep: isNewStep,
          ghostMode: isGhost,
          fixationRatio: fixationRatio,
          muted: muted
        };
        emit("onNotePlayed", notePayload);
        emit("onStateChange", getState());

        return {
          accepted: true,
          locus: locus,
          index: idx,
          step: idx + 1,
          isNewStep: isNewStep,
          message: lastAnnouncement
        };
      }

      // idx > walkedUpTo + 1: out-of-sequence score refusal!
      var requiredIndex = walkedUpTo + 1;
      var requiredLocus = LOCI[requiredIndex];
      var attemptedLocus = LOCI[idx];
      refusalCount += 1;
      var refusalMsg =
        "Score refusal: cannot leap to " +
        attemptedLocus.roman +
        " \u00B7 " +
        attemptedLocus.name +
        " (" +
        attemptedLocus.noteName +
        ") before walking " +
        requiredLocus.roman +
        " \u00B7 " +
        requiredLocus.name +
        " (" +
        requiredLocus.noteName +
        "). Not a note of Zora's score may be skipped.";
      lastAnnouncement = refusalMsg;

      if (!muted) {
        synth.playOutOfSequenceRefusal();
      }

      var refusalInfo = {
        attemptedIndex: idx,
        attemptedLocus: attemptedLocus,
        requiredIndex: requiredIndex,
        requiredLocus: requiredLocus,
        reason: "out_of_sequence",
        refusalCount: refusalCount,
        message: refusalMsg
      };
      emit("onDisplacementRefused", refusalInfo);
      emit("onStateChange", getState());

      return {
        accepted: false,
        reason: "out_of_sequence",
        attemptedIndex: idx,
        requiredIndex: requiredIndex,
        message: refusalMsg
      };
    }

    function attemptDisplace(fromIndex, toIndex) {
      var resolvedFrom =
        typeof fromIndex === "number" && Number.isInteger(fromIndex)
          ? fromIndex
          : activeLocus >= 0
            ? activeLocus
            : 0;
      var resolvedTo =
        typeof toIndex === "number" && Number.isInteger(toIndex)
          ? toIndex
          : (resolvedFrom + 3) % LOCI.length;
      var requiredIndex = Math.max(0, walkedUpTo + 1);
      var message = "In Zora not a single note or street stone may be altered or displaced.";

      refusalCount += 1;
      lastAnnouncement = message;

      if (!muted) {
        synth.playDisplacementRefusal();
      }

      var info = {
        attemptedIndex: resolvedTo,
        fromIndex: resolvedFrom,
        requiredIndex: requiredIndex,
        reason: "unalterable_score",
        refusalCount: refusalCount,
        message: message
      };
      emit("onDisplacementRefused", info);
      emit("onStateChange", getState());

      return {
        accepted: false,
        reason: "unalterable_score",
        fromIndex: resolvedFrom,
        attemptedIndex: resolvedTo,
        requiredIndex: requiredIndex,
        message: message
      };
    }

    function stepForward() {
      if (walkedUpTo + 1 < LOCI.length) {
        return walkLocus(walkedUpTo + 1);
      }
      var nextCursor = activeLocus >= 0 && activeLocus < LOCI.length - 1 ? activeLocus + 1 : 0;
      return walkLocus(nextCursor);
    }

    function playFullScore(intervalMs) {
      stopPlayback();
      var stepMs = typeof intervalMs === "number" && intervalMs >= 0 ? intervalMs : 260;

      return new Promise(function (resolve) {
        var session = {
          timers: [],
          resolved: false,
          finish: function (result) {
            if (session.resolved) {
              return;
            }
            session.resolved = true;
            if (activePlayback === session) {
              activePlayback = null;
            }
            emit("onStateChange", getState());
            resolve(result);
          }
        };
        activePlayback = session;

        if (stepMs === 0) {
          for (var s = 0; s < LOCI.length; s++) {
            walkLocus(s);
          }
          session.finish({ completed: true, cancelled: false, stepsPlayed: LOCI.length });
          return;
        }

        walkLocus(0);
        for (var i = 1; i < LOCI.length; i++) {
          (function (locusIdx) {
            var timerId = setTimeout(function () {
              if (activePlayback !== session) {
                return;
              }
              walkLocus(locusIdx);
              if (locusIdx === LOCI.length - 1) {
                session.finish({ completed: true, cancelled: false, stepsPlayed: LOCI.length });
              }
            }, locusIdx * stepMs);
            session.timers.push(timerId);
          })(i);
        }
      });
    }

    function bindTokenInternal(locusIndex, tokenId, silentAudio, deferStateEmit) {
      var idx = typeof locusIndex === "number" ? locusIndex : Number(locusIndex);
      if (!Number.isInteger(idx) || idx < 0 || idx >= LOCI.length) {
        return {
          bound: false,
          reason: "invalid_locus",
          requiredIndex: Math.min(LOCI.length - 1, Math.max(0, walkedUpTo + 1)),
          message: "Select one of Zora's nine honeycomb loci (I through IX)."
        };
      }

      var token = getToken(tokenId);
      if (!token) {
        return {
          bound: false,
          reason: "unknown_token",
          locusIndex: idx,
          tokenId: tokenId,
          message: "Unknown Ars-Memoriae scholarly token."
        };
      }

      if (idx > walkedUpTo) {
        var reqIdx = walkedUpTo + 1;
        var unwalkedMsg =
          "Cannot seal honeycomb cell " +
          LOCI[idx].roman +
          " (" +
          LOCI[idx].name +
          ") before walking the street up to it; walk " +
          LOCI[reqIdx].roman +
          " (" +
          LOCI[reqIdx].name +
          ") next.";
        lastAnnouncement = unwalkedMsg;
        if (!deferStateEmit) {
          emit("onStateChange", getState());
        }
        return {
          bound: false,
          reason: "locus_unwalked",
          locusIndex: idx,
          requiredIndex: reqIdx,
          message: unwalkedMsg
        };
      }

      // Detach token from any previous honeycomb cell
      for (var c = 0; c < bindings.length; c++) {
        if (bindings[c] && bindings[c].tokenId === token.id) {
          bindings[c] = null;
        }
      }

      var locus = LOCI[idx];
      var relation = token.affinityLoci.indexOf(locus.id) !== -1 ? "affinity" : "contrast";
      var mnemonicRule = buildMnemonicRule(locus, token, relation);

      var record = deepFreeze({
        locusIndex: idx,
        locusId: locus.id,
        locusName: locus.name,
        roman: locus.roman,
        noteName: locus.noteName,
        tokenId: token.id,
        category: token.category,
        shortLabel: token.shortLabel,
        title: token.title,
        glyph: token.glyph,
        scholarExcerpt: token.scholarExcerpt,
        relation: relation,
        mnemonicRule: mnemonicRule
      });

      bindings[idx] = record;
      activeLocus = idx;

      var lockedCount = countLocked();
      var fixationRatio = lockedCount / LOCI.length;
      var isFullyMemorized = lockedCount === LOCI.length;

      if (!muted && !silentAudio) {
        synth.playBindingCadence(locus, relation, isFullyMemorized);
      }

      if (isFullyMemorized) {
        lastAnnouncement =
          "All 9 honeycomb cells locked invariant (" +
          mnemonicRule +
          ") Forced to remain motionless so she may be remembered, earthly Zora languishes and dissolves.";
      } else {
        lastAnnouncement =
          mnemonicRule +
          " (" +
          lockedCount +
          "/9 cells frozen motionless; stone begins to weather.)";
      }

      var boundEvent = {
        bound: true,
        locusIndex: idx,
        locus: locus,
        token: token,
        tokenId: token.id,
        relation: relation,
        mnemonicRule: mnemonicRule,
        lockedCount: lockedCount,
        fixationRatio: fixationRatio,
        isFullyMemorized: isFullyMemorized,
        binding: Object.assign({}, record)
      };

      emit("onTokenBound", boundEvent);
      if (!deferStateEmit) {
        emit("onStateChange", getState());
      }

      return {
        bound: true,
        locusIndex: idx,
        tokenId: token.id,
        relation: relation,
        mnemonicRule: mnemonicRule,
        lockedCount: lockedCount,
        fixationRatio: fixationRatio,
        isFullyMemorized: isFullyMemorized,
        binding: Object.assign({}, record)
      };
    }

    function bindToken(locusIndex, tokenId) {
      return bindTokenInternal(locusIndex, tokenId, false, false);
    }

    function findUnboundToken(preferredTokenId) {
      var used = {};
      for (var i = 0; i < bindings.length; i++) {
        if (bindings[i]) {
          used[bindings[i].tokenId] = true;
        }
      }
      if (preferredTokenId) {
        var preferred = getToken(preferredTokenId);
        if (preferred && !used[preferred.id]) {
          return preferred;
        }
      }
      for (var t = 0; t < TOKENS.length; t++) {
        if (!used[TOKENS[t].id]) {
          return TOKENS[t];
        }
      }
      return null;
    }

    function bindNextAvailable(preferredLocusIndex, preferredTokenId) {
      if (countLocked() >= LOCI.length) {
        return {
          bound: false,
          reason: "all_cells_locked",
          lockedCount: LOCI.length,
          fixationRatio: 1,
          isFullyMemorized: true,
          message: "All nine honeycomb cells of Zora are already sealed invariant."
        };
      }

      var targetLocus = -1;
      var pref =
        typeof preferredLocusIndex === "number" && Number.isInteger(preferredLocusIndex)
          ? preferredLocusIndex
          : -1;

      if (pref >= 0 && pref < LOCI.length && !bindings[pref]) {
        if (pref <= walkedUpTo) {
          targetLocus = pref;
        } else if (pref === walkedUpTo + 1) {
          walkLocus(pref);
          targetLocus = pref;
        }
      }

      if (targetLocus === -1 && activeLocus >= 0 && activeLocus <= walkedUpTo && !bindings[activeLocus]) {
        targetLocus = activeLocus;
      }

      if (targetLocus === -1) {
        for (var i = 0; i <= walkedUpTo; i++) {
          if (!bindings[i]) {
            targetLocus = i;
            break;
          }
        }
      }

      if (targetLocus === -1 && walkedUpTo + 1 < LOCI.length) {
        var stepRes = walkLocus(walkedUpTo + 1);
        if (stepRes.accepted) {
          targetLocus = stepRes.index;
        }
      }

      var nextToken = findUnboundToken(preferredTokenId);
      if (targetLocus === -1 || !nextToken) {
        return {
          bound: false,
          reason: "no_available_slot",
          lockedCount: countLocked(),
          fixationRatio: countLocked() / LOCI.length
        };
      }

      return bindToken(targetLocus, nextToken.id);
    }

    function memorizeAll() {
      stopPlayback();

      // Walk any unwalked steps 0..8 in strict unalterable order 0 -> 8
      for (var s = walkedUpTo + 1; s < LOCI.length; s++) {
        walkedUpTo = s;
        activeLocus = s;
        emit("onNotePlayed", {
          accepted: true,
          locus: LOCI[s],
          index: s,
          step: s + 1,
          noteName: LOCI[s].noteName,
          freq: LOCI[s].freq,
          timbre: LOCI[s].timbre,
          isNewStep: true,
          ghostMode: false,
          fixationRatio: countLocked() / LOCI.length,
          muted: muted
        });
      }

      // Bind every remaining unbound token into remaining unbound honeycomb cells
      for (var c = 0; c < LOCI.length; c++) {
        if (!bindings[c]) {
          var tok = findUnboundToken(null);
          if (tok) {
            bindTokenInternal(c, tok.id, true, true);
          }
        }
      }

      activeLocus = LOCI.length - 1;
      lastAnnouncement =
        "The world's most learned men have memorized Zora point by point across all nine honeycomb cells; forced to remain motionless and invariant, earthly Zora languishes, disintegrates, and vanishes.";

      if (!muted) {
        synth.playMemorizeSweep();
      }

      var finalState = getState();
      emit("onStateChange", finalState);
      return finalState;
    }

    function unbindLocus(locusIndex) {
      var idx = typeof locusIndex === "number" ? locusIndex : Number(locusIndex);
      if (!Number.isInteger(idx) || idx < 0 || idx >= LOCI.length) {
        return {
          unbound: false,
          reason: "invalid_locus",
          locusIndex: locusIndex,
          lockedCount: countLocked(),
          fixationRatio: countLocked() / LOCI.length
        };
      }

      var existing = bindings[idx];
      if (!existing) {
        return {
          unbound: false,
          reason: "already_unbound",
          locusIndex: idx,
          lockedCount: countLocked(),
          fixationRatio: countLocked() / LOCI.length
        };
      }

      bindings[idx] = null;
      activeLocus = idx;
      var lockedCount = countLocked();
      var fixationRatio = lockedCount / LOCI.length;
      var locus = LOCI[idx];

      if (!muted) {
        synth.playReleaseBreath(locus.freq);
      }

      lastAnnouncement =
        "Unsealed " +
        existing.shortLabel +
        " from " +
        locus.roman +
        " \u00B7 " +
        locus.name +
        "; living earthly motion returns to the stone.";

      emit("onStateChange", getState());

      return {
        unbound: true,
        locusIndex: idx,
        removedTokenId: existing.tokenId,
        lockedCount: lockedCount,
        fixationRatio: fixationRatio,
        isFullyMemorized: false
      };
    }

    function reset() {
      stopPlayback();
      for (var i = 0; i < bindings.length; i++) {
        bindings[i] = null;
      }
      walkedUpTo = -1;
      activeLocus = -1;
      refusalCount = 0;
      lastAnnouncement =
        "Memory released across all nine cells. Beyond six rivers and three mountain ranges, earthly Zora breathes and moves once more.";

      if (!muted) {
        synth.playReleaseBreath(293.66);
      }

      var freshState = getState();
      emit("onStateChange", freshState);
      return freshState;
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      emit("onStateChange", getState());
      return muted;
    }

    function toggleMute() {
      return setMuted(!muted);
    }

    return {
      LOCI: LOCI,
      TOKENS: TOKENS,
      TOPOGRAPHY: TOPOGRAPHY,
      on: on,
      off: off,
      walkLocus: walkLocus,
      attemptDisplace: attemptDisplace,
      stepForward: stepForward,
      playFullScore: playFullScore,
      stopPlayback: stopPlayback,
      bindToken: bindToken,
      bindNextAvailable: bindNextAvailable,
      memorizeAll: memorizeAll,
      unbindLocus: unbindLocus,
      reset: reset,
      setMuted: setMuted,
      toggleMute: toggleMute,
      getState: getState
    };
  }

  var ZoraNineLociScore = deepFreeze({
    LOCI: LOCI,
    TOKENS: TOKENS,
    TOPOGRAPHY: TOPOGRAPHY,
    getLocus: getLocus,
    getToken: getToken,
    evaluateRelation: evaluateRelation,
    createEngine: createEngine
  });

  if (typeof window !== "undefined" && window) {
    window.ZoraNineLociScore = ZoraNineLociScore;
  }
  if (globalScope) {
    globalScope.ZoraNineLociScore = ZoraNineLociScore;
  }
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
