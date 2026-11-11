/*
 * City 14: Zenobia (Thin Cities 2)
 * Layer: Happy-Life Desire Recombinator & Taxonomy Engine
 * Standalone IIFE exposing globalThis.ZenobiaHappyLifeDreamer
 */
(function (root) {
  'use strict';

  var PALETTE = Object.freeze({
    mesa_obsidian_umber: '#19110B',
    dry_ochre_terracotta: '#C47A45',
    baked_mesa_sienna: '#8F512B',
    bamboo_culm_gold: '#D6B162',
    bamboo_node_amber: '#9F7833',
    oxidized_zinc_slate: '#6E858E',
    weathered_zinc_mist: '#A9BEC5',
    silk_ribbon_vermilion: '#D8524B',
    silk_ribbon_saffron: '#E5A33B',
    plateau_parchment: '#F3EAD6'
  });

  var TAXONOMY = Object.freeze({
    falseBinaryRejected: true,
    rejectedBinary: Object.freeze(['happy', 'unhappy']),
    rejectedBinaryLabel: 'Happy vs. Unhappy Cities (False Binary Rejected)',
    rejectedBinaryReason:
      'There is no sense in dividing cities into happy and unhappy, but rather into two other species: those that through the years and the changes continue to give form to desires, and those in which desires either erase the city or are erased by it.',
    classification: 'gives_form_to_desires',
    zenobiaClassification: 'gives_form_to_desires',
    oppositeClassification: 'desires_erase_or_erased',
    species: Object.freeze({
      gives_form_to_desires: Object.freeze({
        id: 'gives_form_to_desires',
        label: 'Cities That Continue to Give Form to Desires',
        description:
          'Cities that through the years and the changes continue to give form to desires, recombining pilings, ladders, balconies, and weathervanes into every imagined happy life.',
        includesZenobia: true
      }),
      desires_erase_or_erased: Object.freeze({
        id: 'desires_erase_or_erased',
        label: 'Cities Where Desires Erase or Are Erased',
        description:
          'Cities in which desires either obliterate the urban fabric or are flattened into mute submission by it.',
        includesZenobia: false
      })
    })
  });

  var DESIRE_AXES = Object.freeze([
    Object.freeze({
      id: 'pilingHeight',
      index: 0,
      label: 'Piling Elevation Loft',
      shortLabel: 'Pilings',
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.56,
      stoneIds: Object.freeze(['dry_terrain_pilings', 'bamboo_and_zinc_houses']),
      description: 'Vertical reach of split-bamboo and timber pilings above the dry mesa.'
    }),
    Object.freeze({
      id: 'catwalkWeave',
      index: 1,
      label: 'Crossed Balconies & Catwalks',
      shortLabel: 'Catwalks',
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.58,
      stoneIds: Object.freeze(['crossing_platforms_and_balconies', 'ladders_and_hanging_sidewalks']),
      description: 'Interlacing of cantilevered balconies, bamboo ladders, and swaying sidewalks.'
    }),
    Object.freeze({
      id: 'cisternLookouts',
      index: 2,
      label: 'Cone Belvederes & Water Barrels',
      shortLabel: 'Belvederes',
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.54,
      stoneIds: Object.freeze(['cone_roofed_belvederes', 'water_storage_barrels']),
      description: 'Conical zinc pavilions and hooped water cisterns hoisted high aloft.'
    }),
    Object.freeze({
      id: 'windVanes',
      index: 3,
      label: 'Poles, Pulleys & Silk Ribbons',
      shortLabel: 'Vanes & Ribbons',
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.60,
      stoneIds: Object.freeze(['pulleys_fish_poles_and_cranes', 'weathervanes_and_ribbons']),
      description: 'Rigged sheaves, bamboo fishing poles, spinning zinc vanes, and silk streamers.'
    })
  ]);

  var DESIRE_PROMPTS = [
    Object.freeze({
      key: '1',
      index: 0,
      id: 'flat_courtyard',
      label: 'Attempt Flat Stone Town',
      shortLabel: 'Flat Stone Town',
      isFlatAttempt: true,
      persona: 'visitor_from_scratch',
      intendedSketch: 'Low stone courtyards laid flush upon level ochre earth with zero stilts.',
      sublimationReason:
        'A courtyard pressed against dry clay feels airless to desire; before the chalk lines set, the porches jack themselves onto high pilings and sling rope stairways across open sky.',
      axisTargets: Object.freeze({ pilingHeight: 0.72, catwalkWeave: 0.68, cisternLookouts: 0.60, windVanes: 0.64 }),
      offsets: Object.freeze([4.5, 8.0, 5.5, 9.5, 6.0, 10.5, 5.0, 7.5]),
      catwalks: Object.freeze([[0, 2, 0.58], [1, 3, 0.74], [2, 5, 0.66], [4, 6, 0.80], [5, 7, 0.62]])
    }),
    Object.freeze({
      key: '2',
      index: 1,
      id: 'harbor_quay',
      label: 'Attempt Earthbound Avenues',
      shortLabel: 'Earthbound Avenues',
      isFlatAttempt: true,
      persona: 'visitor_from_scratch',
      intendedSketch: 'Broad, solid stone avenues anchored directly to the dry plateau.',
      sublimationReason:
        'Even paved avenues refuse the dust: the street grid splits into suspended plank sidewalks, hoists its cistern barrels aloft, and crowns the crossings with oxidized-zinc cones.',
      axisTargets: Object.freeze({ pilingHeight: 0.76, catwalkWeave: 0.74, cisternLookouts: 0.66, windVanes: 0.68 }),
      offsets: Object.freeze([6.0, 7.0, 9.0, 8.5, 10.0, 9.0, 6.5, 8.0]),
      catwalks: Object.freeze([[0, 1, 0.52], [1, 4, 0.71], [2, 3, 0.83], [3, 6, 0.64], [4, 7, 0.77], [5, 6, 0.56]])
    }),
    Object.freeze({
      key: '3',
      index: 2,
      id: 'crossed_balconies',
      label: 'Dream Crossing Balconies',
      shortLabel: 'Crossing Balconies',
      isFlatAttempt: false,
      persona: 'dreamer_recombining',
      intendedSketch: 'Cantilevered bamboo decks and swaying hanging sidewalks overstepping in midair.',
      sublimationReason:
        'Happiness arranges itself as staggered verandas crossing at oblique heights, linked by rung ladders where neighbors converse across sunlit chasms of dry wind.',
      axisTargets: Object.freeze({ pilingHeight: 0.68, catwalkWeave: 0.94, cisternLookouts: 0.58, windVanes: 0.70 }),
      offsets: Object.freeze([5.0, 9.5, 6.5, 11.0, 7.5, 12.0, 6.0, 9.0]),
      catwalks: Object.freeze([
        [0, 2, 0.48], [0, 3, 0.76], [1, 4, 0.63], [2, 5, 0.84],
        [3, 6, 0.55], [4, 7, 0.72], [5, 7, 0.88], [1, 2, 0.42]
      ])
    }),
    Object.freeze({
      key: '4',
      index: 3,
      id: 'cone_belvederes',
      label: 'Dream High Cone Belvederes',
      shortLabel: 'Cone Belvederes',
      isFlatAttempt: false,
      persona: 'dreamer_recombining',
      intendedSketch: 'Conical zinc belvederes, hoisted water-storage barrels, and jib cranes.',
      sublimationReason:
        'Desire climbs to cone-roofed pavilions at the pinnacle of the tallest pilings, strapping hooped water barrels beneath the eaves while every drop stays high above the parched mesa.',
      axisTargets: Object.freeze({ pilingHeight: 0.88, catwalkWeave: 0.66, cisternLookouts: 0.96, windVanes: 0.72 }),
      offsets: Object.freeze([7.5, 12.5, 8.0, 14.0, 9.5, 14.5, 8.5, 11.5]),
      catwalks: Object.freeze([[0, 1, 0.66], [1, 3, 0.86], [2, 4, 0.60], [3, 5, 0.90], [5, 7, 0.78], [6, 7, 0.58]])
    }),
    Object.freeze({
      key: '5',
      index: 4,
      id: 'ribbons_and_poles',
      label: 'Dream Vanes, Poles & Ribbons',
      shortLabel: 'Vanes & Ribbons',
      isFlatAttempt: false,
      persona: 'dreamer_recombining',
      intendedSketch: 'Cantilevered bamboo fishing poles, sheave pulleys, weathervanes, and silk streamers.',
      sublimationReason:
        'A happy day bristles with long bamboo poles casting baskets into dry plateau gusts, spinning zinc weathervanes, and vermilion and saffron ribbons streaming horizontally.',
      axisTargets: Object.freeze({ pilingHeight: 0.74, catwalkWeave: 0.72, cisternLookouts: 0.68, windVanes: 0.98 }),
      offsets: Object.freeze([6.0, 10.0, 7.5, 11.5, 8.5, 12.5, 7.0, 10.5]),
      catwalks: Object.freeze([[0, 2, 0.62], [1, 3, 0.75], [2, 5, 0.53], [3, 6, 0.81], [4, 7, 0.69], [6, 7, 0.85]])
    }),
    Object.freeze({
      key: '6',
      index: 5,
      id: 'inhabitant_confession',
      label: 'Ask a Zenobian About Happiness',
      shortLabel: 'Zenobian Confession',
      isFlatAttempt: false,
      persona: 'zenobian_inhabitant',
      intendedSketch: 'An inhabitant describes the happiest life imaginable by recombining all of Zenobia.',
      sublimationReason:
        'Asked to picture a happy life, the inhabitant can only imagine a city like Zenobia—higher pilings, other suspended stairways, other crossed balconies, and brisker weathervanes.',
      axisTargets: Object.freeze({ pilingHeight: 0.94, catwalkWeave: 0.92, cisternLookouts: 0.90, windVanes: 0.94 }),
      offsets: Object.freeze([9.0, 13.5, 10.5, 15.0, 11.5, 15.5, 9.5, 13.0]),
      catwalks: Object.freeze([
        [0, 1, 0.54], [0, 3, 0.80], [1, 4, 0.68], [2, 5, 0.88],
        [2, 4, 0.46], [3, 6, 0.74], [4, 7, 0.84], [5, 7, 0.60], [3, 5, 0.91]
      ])
    })
  ];

  (function indexPrompts() {
    var byKey = {};
    var byId = {};
    for (var i = 0; i < DESIRE_PROMPTS.length; i++) {
      var p = DESIRE_PROMPTS[i];
      byKey[p.key] = p;
      byId[p.id] = p;
      Object.defineProperty(DESIRE_PROMPTS, p.id, {
        value: p,
        enumerable: false,
        writable: false,
        configurable: false
      });
    }
    Object.defineProperty(DESIRE_PROMPTS, 'byKey', {
      value: Object.freeze(byKey),
      enumerable: false,
      writable: false,
      configurable: false
    });
    Object.defineProperty(DESIRE_PROMPTS, 'byId', {
      value: Object.freeze(byId),
      enumerable: false,
      writable: false,
      configurable: false
    });
    Object.freeze(DESIRE_PROMPTS);
  })();

  var DEFAULT_BASELINE_ELEVATIONS = Object.freeze([16, 24, 18, 31, 21, 34, 17, 27]);
  var CLUSTER_X_NORMS = Object.freeze([0.10, 0.21, 0.33, 0.44, 0.56, 0.67, 0.79, 0.90]);
  var EXTRA_SPAN_POOL = Object.freeze([
    [0, 1, 0.50], [1, 2, 0.64], [2, 3, 0.78], [3, 4, 0.56],
    [4, 5, 0.82], [5, 6, 0.68], [6, 7, 0.54], [0, 3, 0.72],
    [1, 4, 0.85], [2, 5, 0.61], [3, 6, 0.88], [4, 7, 0.75],
    [0, 2, 0.44], [2, 4, 0.70], [3, 5, 0.90], [5, 7, 0.79]
  ]);

  function clamp(val, lo, hi) {
    var n = Number(val);
    if (!Number.isFinite(n)) return lo;
    return n < lo ? lo : n > hi ? hi : n;
  }

  function round2(val) {
    return Math.round(val * 100) / 100;
  }

  function meanOf(arr) {
    if (!arr || !arr.length) return 0;
    var sum = 0;
    for (var i = 0; i < arr.length; i++) sum += arr[i];
    return sum / arr.length;
  }

  function resolvePrompt(input) {
    if (input && typeof input === 'object') {
      if (input.id && DESIRE_PROMPTS.byId[input.id]) return DESIRE_PROMPTS.byId[input.id];
      if (input.key && DESIRE_PROMPTS.byKey[String(input.key)]) return DESIRE_PROMPTS.byKey[String(input.key)];
    }
    if (typeof input === 'number' && Number.isFinite(input)) {
      if (input >= 1 && input <= 6) return DESIRE_PROMPTS.byKey[String(Math.round(input))];
      if (input === 0) return DESIRE_PROMPTS[0];
    }
    if (typeof input === 'string') {
      var trimmed = input.trim();
      if (DESIRE_PROMPTS.byId[trimmed]) return DESIRE_PROMPTS.byId[trimmed];
      if (DESIRE_PROMPTS.byKey[trimmed]) return DESIRE_PROMPTS.byKey[trimmed];
      var lower = trimmed.toLowerCase();
      if (DESIRE_PROMPTS.byId[lower]) return DESIRE_PROMPTS.byId[lower];
      if (lower.indexOf('flat') >= 0 || lower.indexOf('courtyard') >= 0 || lower.indexOf('ground') >= 0) {
        return DESIRE_PROMPTS[0];
      }
      if (lower.indexOf('harbor') >= 0 || lower.indexOf('quay') >= 0 || lower.indexOf('earth') >= 0) {
        return DESIRE_PROMPTS[1];
      }
    }
    return DESIRE_PROMPTS[5];
  }

  function resolveAxisKey(axis) {
    if (typeof axis === 'number' && axis >= 0 && axis < DESIRE_AXES.length) {
      return DESIRE_AXES[Math.floor(axis)].id;
    }
    var s = String(axis || '').trim();
    if (s === '0' || s === '1' || s === '2' || s === '3') return DESIRE_AXES[Number(s)].id;
    var low = s.toLowerCase();
    if (s === 'pilingHeight' || low.indexOf('piling') >= 0 || low.indexOf('altit') >= 0 || low.indexOf('elev') >= 0 || low.indexOf('stilt') >= 0 || low.indexOf('height') >= 0) {
      return 'pilingHeight';
    }
    if (s === 'catwalkWeave' || low.indexOf('catwalk') >= 0 || low.indexOf('cross') >= 0 || low.indexOf('balcon') >= 0 || low.indexOf('ladder') >= 0 || low.indexOf('sidewalk') >= 0) {
      return 'catwalkWeave';
    }
    if (s === 'cisternLookouts' || low.indexOf('cistern') >= 0 || low.indexOf('belvedere') >= 0 || low.indexOf('barrel') >= 0 || low.indexOf('cone') >= 0 || low.indexOf('water') >= 0) {
      return 'cisternLookouts';
    }
    if (s === 'windVanes' || low.indexOf('vane') >= 0 || low.indexOf('ribbon') >= 0 || low.indexOf('pole') >= 0 || low.indexOf('pulley') >= 0 || low.indexOf('wind') >= 0) {
      return 'windVanes';
    }
    return 'pilingHeight';
  }

  function normalizeAxisValue(val) {
    var num = Number(val);
    if (!Number.isFinite(num)) return 0.56;
    if (num > 1.0001) return clamp(num / 100, 0, 1);
    return clamp(num, 0, 1);
  }

  function buildCatwalkSet(seedSpans, catwalkAxis, generation) {
    var targetCount = Math.max(4, Math.min(9, Math.round(4 + catwalkAxis * 5)));
    var result = [];
    var seen = {};
    function pushSpan(a, b, tier) {
      var f = clamp(Math.floor(a), 0, 7);
      var t = clamp(Math.floor(b), 0, 7);
      if (f === t) t = (f + 2) % 8;
      var lo = Math.min(f, t);
      var hi = Math.max(f, t);
      var band = Math.round(tier * 10);
      var sig = lo + ':' + hi + ':' + band;
      if (seen[sig]) return;
      seen[sig] = true;
      var jitter = (((generation * 7 + lo * 3 + hi * 5) % 9) - 4) * 0.015;
      result.push([f, t, round2(clamp(tier + jitter, 0.36, 0.91))]);
    }
    if (seedSpans && seedSpans.length) {
      for (var i = 0; i < seedSpans.length && result.length < targetCount; i++) {
        var sp = seedSpans[(i + generation) % seedSpans.length];
        pushSpan(sp[0], sp[1], sp[2]);
      }
    }
    var cursor = (generation * 3) % EXTRA_SPAN_POOL.length;
    var guard = 0;
    while (result.length < targetCount && guard < EXTRA_SPAN_POOL.length * 2) {
      var cand = EXTRA_SPAN_POOL[(cursor + guard) % EXTRA_SPAN_POOL.length];
      pushSpan(cand[0], cand[1], cand[2]);
      guard++;
    }
    return result;
  }

  function synthesizePermutation(store, opts) {
    var prompt = opts.prompt || DESIRE_PROMPTS[5];
    var isFlatAttempt = Boolean(opts.forceFlatAttempt || prompt.isFlatAttempt || opts.zeroAltitudeRebound);
    store.generation += 1;
    store.recombinationCount += 1;
    if (isFlatAttempt) {
      store.flatAttemptsCount += 1;
    }

    var axes = store.axes;
    var effectiveLoft = isFlatAttempt ? Math.max(0.68, axes.pilingHeight) : Math.max(0.38, axes.pilingHeight);
    var flatReboundBonus = isFlatAttempt
      ? Math.min(7.5, 2.0 + store.flatAttemptsCount * 1.1)
      : Math.min(3.0, store.flatAttemptsCount * 0.35);

    var targetElevations = [];
    for (var i = 0; i < 8; i++) {
      var baseH = store.baselineElevations[i];
      var offsetH = prompt.offsets[i] * (0.48 + effectiveLoft * 0.62);
      var phase = ((store.generation * 5 + i * 3) % 7) - 3;
      var shimmer = phase * 0.65;
      var rawH = baseH + offsetH * 0.62 + flatReboundBonus * (0.65 + ((i % 3) * 0.18)) + shimmer;
      targetElevations.push(round2(clamp(rawH, 17.0, 46.5)));
    }

    var minFloor = 16.5;
    for (var j = 0; j < 8; j++) {
      if (targetElevations[j] < minFloor) targetElevations[j] = minFloor;
    }
    var meanAlt = meanOf(targetElevations);
    var requiredMinMean = store.baselineAltitudeMeters + (isFlatAttempt ? Math.min(9.5, 3.8 + store.flatAttemptsCount * 0.75) : 3.2);
    if (meanAlt < requiredMinMean) {
      var lift = requiredMinMean - meanAlt;
      for (var k = 0; k < 8; k++) {
        targetElevations[k] = round2(clamp(targetElevations[k] + lift, 17.0, 48.0));
      }
      meanAlt = meanOf(targetElevations);
    }
    meanAlt = round2(meanAlt);

    var extraCatwalks = buildCatwalkSet(prompt.catwalks, axes.catwalkWeave, store.generation);
    var belvedereBoost = Math.max(1, Math.min(5, Math.round(1 + axes.cisternLookouts * 3 + (isFlatAttempt ? 1 : 0))));
    var barrelBoost = Math.max(1, Math.min(6, Math.round(1 + axes.cisternLookouts * 3.4 + effectiveLoft * 0.8)));
    var ribbonDensity = round2(clamp(0.64 + axes.windVanes * 0.86 + (store.generation % 3) * 0.04, 0.60, 1.65));
    var windSpeed = round2(clamp(0.54 + axes.windVanes * 0.74 + (isFlatAttempt ? 0.12 : 0), 0.48, 1.45));

    var narrative = opts.customNarrative || (
      isFlatAttempt
        ? 'Flat-ground draft #' + store.flatAttemptsCount + ' (' + prompt.intendedSketch + ') dissolves in dry mesa dust: ' +
          prompt.sublimationReason + ' Mean stilt height climbs to ' + meanAlt.toFixed(1) + 'm (+' +
          round2(meanAlt - store.baselineAltitudeMeters).toFixed(1) + 'm above baseline) across ' + extraCatwalks.length + ' crossed catwalks.'
        : prompt.sublimationReason + ' Generation #' + store.generation + ' lifts the 8 bamboo-and-zinc clusters to ' +
          meanAlt.toFixed(1) + 'm mean altitude with ' + extraCatwalks.length + ' suspended catwalks.'
    );

    var taxonomyNote =
      'Happy/unhappy binary rejected: Zenobia belongs to cities that through the years and the changes continue to give form to desires (' +
      TAXONOMY.classification + '), never erased by grounded symmetry.';

    return {
      generation: store.generation,
      promptId: opts.promptIdOverride || prompt.id,
      promptKey: prompt.key,
      promptLabel: opts.promptLabelOverride || prompt.label,
      rejectedFlatAttempt: isFlatAttempt,
      flatAttemptSublimated: isFlatAttempt,
      flatAttemptsCount: store.flatAttemptsCount,
      baselineAltitudeMeters: store.baselineAltitudeMeters,
      meanAltitudeMeters: meanAlt,
      altitudeGainMeters: round2(meanAlt - store.baselineAltitudeMeters),
      minPilingHeightMeters: round2(Math.min.apply(null, targetElevations)),
      maxPilingHeightMeters: round2(Math.max.apply(null, targetElevations)),
      targetElevations: targetElevations,
      extraCatwalks: extraCatwalks,
      belvedereBoost: belvedereBoost,
      barrelBoost: barrelBoost,
      ribbonDensity: ribbonDensity,
      windSpeed: windSpeed,
      classification: TAXONOMY.classification,
      falseBinaryRejected: true,
      narrative: narrative,
      taxonomyNote: taxonomyNote
    };
  }

  function clonePerm(p) {
    return {
      generation: p.generation,
      promptId: p.promptId,
      promptKey: p.promptKey,
      promptLabel: p.promptLabel,
      rejectedFlatAttempt: p.rejectedFlatAttempt,
      flatAttemptSublimated: p.flatAttemptSublimated,
      flatAttemptsCount: p.flatAttemptsCount,
      baselineAltitudeMeters: p.baselineAltitudeMeters,
      meanAltitudeMeters: p.meanAltitudeMeters,
      altitudeGainMeters: p.altitudeGainMeters,
      minPilingHeightMeters: p.minPilingHeightMeters,
      maxPilingHeightMeters: p.maxPilingHeightMeters,
      targetElevations: p.targetElevations.slice(),
      extraCatwalks: p.extraCatwalks.map(function (c) { return [c[0], c[1], c[2]]; }),
      belvedereBoost: p.belvedereBoost,
      barrelBoost: p.barrelBoost,
      ribbonDensity: p.ribbonDensity,
      windSpeed: p.windSpeed,
      classification: p.classification,
      falseBinaryRejected: p.falseBinaryRejected,
      narrative: p.narrative,
      taxonomyNote: p.taxonomyNote
    };
  }

  function makeBaselinePerm(baseElevs, baseMean) {
    return {
      generation: 0,
      promptId: 'initial_zenobia',
      promptKey: '0',
      promptLabel: 'Ancestral Stilted Zenobia',
      rejectedFlatAttempt: false,
      flatAttemptSublimated: false,
      flatAttemptsCount: 0,
      baselineAltitudeMeters: baseMean,
      meanAltitudeMeters: baseMean,
      altitudeGainMeters: 0,
      minPilingHeightMeters: round2(Math.min.apply(null, baseElevs)),
      maxPilingHeightMeters: round2(Math.max.apply(null, baseElevs)),
      targetElevations: baseElevs.slice(),
      extraCatwalks: [[0, 1, 0.56], [1, 3, 0.72], [3, 5, 0.68], [5, 7, 0.62]],
      belvedereBoost: 2,
      barrelBoost: 2,
      ribbonDensity: 0.90,
      windSpeed: 0.72,
      classification: TAXONOMY.classification,
      falseBinaryRejected: true,
      narrative:
        'Zenobia stands on high pilings above dry cracked earth; nobody remembers why the founders raised it, yet every dream of a happy life recombines its stilts, ladders, balconies, and weathervanes.',
      taxonomyNote: TAXONOMY.rejectedBinaryReason
    };
  }

  function drawDreamSketchInternal(ctx, width, height, store) {
    if (!ctx || !(width > 0) || !(height > 0)) return false;
    var perm = store.currentPerm;
    var compact = height < 88;
    var houseH = compact ? 4 : 6;
    var coneH = compact ? 9 : 13;
    var vaneH = compact ? 11 : 15;
    var houseHalfW = compact ? 5 : 7;
    var mesaY = Math.round(height * 0.86);
    var minTopY = Math.min(mesaY - 10, 17 + vaneH + 2);
    var usableH = Math.max(10, mesaY - minTopY);
    var scaleM = usableH / 50.0;

    ctx.save();
    ctx.fillStyle = PALETTE.mesa_obsidian_umber;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = PALETTE.baked_mesa_sienna;
    ctx.fillRect(0, mesaY, width, height - mesaY);
    ctx.strokeStyle = PALETTE.dry_ochre_terracotta;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, mesaY);
    ctx.lineTo(width, mesaY);
    for (var c = 1; c <= 7; c++) {
      var cx = Math.round((width * c) / 8);
      ctx.moveTo(cx, mesaY);
      ctx.lineTo(cx - 4, Math.min(height - 1, mesaY + 5));
      ctx.lineTo(cx + 3, Math.min(height - 1, mesaY + 9));
    }
    ctx.stroke();

    var baseLineY = Math.max(minTopY, mesaY - store.baselineAltitudeMeters * scaleM);
    if (typeof ctx.setLineDash === 'function') ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(169, 190, 197, 0.38)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(8, baseLineY);
    ctx.lineTo(width - 8, baseLineY);
    ctx.stroke();

    if (perm.rejectedFlatAttempt || store.flatAttemptsCount > 0) {
      var ghostH = Math.min(8, Math.max(4, Math.round(usableH * 0.22)));
      var arrowTop = Math.max(minTopY, mesaY - Math.min(26, Math.max(12, Math.round(usableH * 0.58))));
      ctx.strokeStyle = 'rgba(243, 234, 214, 0.34)';
      for (var g = 0; g < 4; g++) {
        var gx = Math.round(width * (0.14 + g * 0.20));
        var gw = Math.max(14, Math.round(width * 0.12));
        ctx.strokeRect(gx, mesaY - ghostH, gw, ghostH);
      }
      if (typeof ctx.setLineDash === 'function') ctx.setLineDash([]);
      ctx.strokeStyle = PALETTE.silk_ribbon_vermilion;
      ctx.lineWidth = 1.2;
      for (var v = 0; v < 4; v++) {
        var vx = Math.round(width * (0.20 + v * 0.20));
        ctx.beginPath();
        ctx.moveTo(vx, mesaY - ghostH - 1);
        ctx.lineTo(vx, arrowTop);
        ctx.moveTo(vx - 3, arrowTop + 4);
        ctx.lineTo(vx, arrowTop);
        ctx.lineTo(vx + 3, arrowTop + 4);
        ctx.stroke();
      }
    }
    if (typeof ctx.setLineDash === 'function') ctx.setLineDash([]);

    var xs = [];
    var topYs = [];
    for (var i = 0; i < 8; i++) {
      var x = Math.round(CLUSTER_X_NORMS[i] * width);
      var yTop = Math.max(minTopY, mesaY - perm.targetElevations[i] * scaleM);
      var hPx = mesaY - yTop;
      xs.push(x);
      topYs.push(yTop);

      ctx.strokeStyle = PALETTE.bamboo_node_amber;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x - 4, mesaY);
      ctx.lineTo(x - 3, yTop);
      ctx.moveTo(x + 4, mesaY);
      ctx.lineTo(x + 3, yTop);
      ctx.moveTo(x - 4, mesaY - hPx * 0.45);
      ctx.lineTo(x + 3, mesaY - hPx * 0.72);
      ctx.moveTo(x + 4, mesaY - hPx * 0.45);
      ctx.lineTo(x - 3, mesaY - hPx * 0.72);
      ctx.stroke();

      ctx.fillStyle = PALETTE.oxidized_zinc_slate;
      ctx.fillRect(x - houseHalfW, yTop - houseH, houseHalfW * 2, houseH);
      ctx.fillStyle = PALETTE.bamboo_culm_gold;
      ctx.beginPath();
      ctx.moveTo(x - houseHalfW - 1, yTop - houseH);
      ctx.lineTo(x, yTop - coneH);
      ctx.lineTo(x + houseHalfW + 1, yTop - houseH);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = i % 2 === 0 ? PALETTE.silk_ribbon_vermilion : PALETTE.silk_ribbon_saffron;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(x, yTop - coneH);
      ctx.lineTo(x + 8, yTop - vaneH);
      ctx.stroke();
    }

    ctx.strokeStyle = PALETTE.silk_ribbon_saffron;
    ctx.lineWidth = 1.15;
    for (var s = 0; s < perm.extraCatwalks.length; s++) {
      var cw = perm.extraCatwalks[s];
      var x1 = xs[cw[0]];
      var x2 = xs[cw[1]];
      var y1 = mesaY - (mesaY - topYs[cw[0]]) * cw[2];
      var y2 = mesaY - (mesaY - topYs[cw[1]]) * cw[2];
      var sag = Math.min(10, Math.abs(x2 - x1) * 0.07);
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      if (typeof ctx.quadraticCurveTo === 'function') {
        ctx.quadraticCurveTo((x1 + x2) * 0.5, Math.min(mesaY - 2, Math.max(y1, y2) + sag), x2, y2);
      } else {
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
    }

    if (typeof ctx.fillText === 'function') {
      ctx.fillStyle = PALETTE.plateau_parchment;
      ctx.font = '10px "SF Mono", Menlo, monospace';
      var sign = perm.altitudeGainMeters >= 0 ? '+' : '';
      ctx.fillText(
        'GEN #' + perm.generation + ' · ' + perm.meanAltitudeMeters.toFixed(1) + 'm (' + sign + perm.altitudeGainMeters.toFixed(1) + 'm)',
        6,
        12
      );
    }
    ctx.restore();
    return true;
  }

  function createDreamer(options) {
    var cfg = options && typeof options === 'object' ? options : {};
    var baseElevs;
    if (Array.isArray(cfg.baselineElevations) && cfg.baselineElevations.length === 8) {
      baseElevs = cfg.baselineElevations.map(function (v) { return round2(clamp(v, 14, 42)); });
    } else if (Number.isFinite(cfg.baselineAltitudeMeters) && cfg.baselineAltitudeMeters > 0) {
      var delta = cfg.baselineAltitudeMeters - meanOf(DEFAULT_BASELINE_ELEVATIONS);
      baseElevs = DEFAULT_BASELINE_ELEVATIONS.map(function (v) { return round2(clamp(v + delta, 14, 42)); });
    } else {
      baseElevs = DEFAULT_BASELINE_ELEVATIONS.slice();
    }
    var baseMean = round2(meanOf(baseElevs));

    function defaultAxes() {
      return {
        pilingHeight: DESIRE_AXES[0].defaultValue,
        catwalkWeave: DESIRE_AXES[1].defaultValue,
        cisternLookouts: DESIRE_AXES[2].defaultValue,
        windVanes: DESIRE_AXES[3].defaultValue
      };
    }

    var store = {
      generation: 0,
      flatAttemptsCount: 0,
      recombinationCount: 0,
      recombineCursor: 0,
      baselineElevations: baseElevs,
      baselineAltitudeMeters: baseMean,
      axes: defaultAxes(),
      lastPrompt: DESIRE_PROMPTS[5],
      currentPerm: makeBaselinePerm(baseElevs, baseMean),
      history: []
    };

    function buildState() {
      var p = store.currentPerm;
      var axesCopy = {
        pilingHeight: store.axes.pilingHeight,
        catwalkWeave: store.axes.catwalkWeave,
        cisternLookouts: store.axes.cisternLookouts,
        windVanes: store.axes.windVanes
      };
      return {
        generation: store.generation,
        activePromptId: p.promptId,
        activePromptKey: p.promptKey,
        activePromptLabel: p.promptLabel,
        promptId: p.promptId,
        promptLabel: p.promptLabel,
        rejectedFlatAttempt: p.rejectedFlatAttempt,
        flatAttemptSublimated: Boolean(p.flatAttemptSublimated || store.flatAttemptsCount > 0),
        flatAttemptsCount: store.flatAttemptsCount,
        recombinationCount: store.recombinationCount,
        baselineAltitudeMeters: store.baselineAltitudeMeters,
        meanAltitudeMeters: p.meanAltitudeMeters,
        altitudeGainMeters: p.altitudeGainMeters,
        minPilingHeightMeters: p.minPilingHeightMeters,
        maxPilingHeightMeters: p.maxPilingHeightMeters,
        baselineElevations: store.baselineElevations.slice(),
        targetElevations: p.targetElevations.slice(),
        extraCatwalks: p.extraCatwalks.map(function (c) { return [c[0], c[1], c[2]]; }),
        belvedereBoost: p.belvedereBoost,
        barrelBoost: p.barrelBoost,
        ribbonDensity: p.ribbonDensity,
        windSpeed: p.windSpeed,
        axes: axesCopy,
        desireAxes: {
          pilingHeight: axesCopy.pilingHeight,
          catwalkWeave: axesCopy.catwalkWeave,
          cisternLookouts: axesCopy.cisternLookouts,
          windVanes: axesCopy.windVanes
        },
        classification: TAXONOMY.classification,
        zenobiaClassification: TAXONOMY.zenobiaClassification,
        oppositeClassification: TAXONOMY.oppositeClassification,
        falseBinaryRejected: true,
        rejectedBinary: ['happy', 'unhappy'],
        groundMoisture: 0,
        waterAtGround: false,
        narrative: p.narrative,
        taxonomyNote: p.taxonomyNote,
        historyLength: store.history.length
      };
    }

    function commitPerm(perm) {
      store.currentPerm = perm;
      store.history.push(clonePerm(perm));
      if (store.history.length > 36) store.history.shift();
      var stateSnap = buildState();
      var permSnap = clonePerm(perm);
      if (typeof cfg.onPermutation === 'function') {
        cfg.onPermutation(permSnap, stateSnap);
      }
      return { state: stateSnap, permSpec: permSnap };
    }

    function dreamFromPrompt(promptIdOrKey) {
      var prompt = resolvePrompt(promptIdOrKey);
      store.lastPrompt = prompt;
      store.axes.pilingHeight = prompt.axisTargets.pilingHeight;
      store.axes.catwalkWeave = prompt.axisTargets.catwalkWeave;
      store.axes.cisternLookouts = prompt.axisTargets.cisternLookouts;
      store.axes.windVanes = prompt.axisTargets.windVanes;
      var perm = synthesizePermutation(store, { prompt: prompt });
      return commitPerm(perm);
    }

    function attemptGroundReset() {
      var flatPrompt = store.flatAttemptsCount % 2 === 0 ? DESIRE_PROMPTS[0] : DESIRE_PROMPTS[1];
      store.lastPrompt = flatPrompt;
      store.axes.pilingHeight = round2(clamp(Math.max(0.76, store.axes.pilingHeight + 0.08), 0.72, 0.98));
      store.axes.catwalkWeave = round2(clamp(Math.max(0.72, store.axes.catwalkWeave + 0.06), 0.68, 0.96));
      var perm = synthesizePermutation(store, {
        prompt: flatPrompt,
        forceFlatAttempt: true,
        promptIdOverride: 'ground_reset_sublimated',
        promptLabelOverride: 'Ground-Level Reset Sublimated Aloft'
      });
      return commitPerm(perm);
    }

    function setDesireAxis(axisOrMap, rawValue) {
      var zeroRebound = false;
      if (axisOrMap && typeof axisOrMap === 'object') {
        var keys = Object.keys(axisOrMap);
        for (var i = 0; i < keys.length; i++) {
          var ak = resolveAxisKey(keys[i]);
          var nv = normalizeAxisValue(axisOrMap[keys[i]]);
          if (ak === 'pilingHeight' && nv <= 0.08) {
            zeroRebound = true;
            nv = 0.72;
          }
          store.axes[ak] = round2(nv);
        }
      } else {
        var key = resolveAxisKey(axisOrMap);
        var val = normalizeAxisValue(rawValue);
        if (key === 'pilingHeight' && val <= 0.08) {
          zeroRebound = true;
          val = 0.72;
        }
        store.axes[key] = round2(val);
      }
      var activePrompt = zeroRebound ? DESIRE_PROMPTS[0] : (store.lastPrompt && !store.lastPrompt.isFlatAttempt ? store.lastPrompt : DESIRE_PROMPTS[5]);
      var perm = synthesizePermutation(store, {
        prompt: activePrompt,
        zeroAltitudeRebound: zeroRebound,
        promptIdOverride: zeroRebound ? 'flat_axis_sublimated' : activePrompt.id,
        promptLabelOverride: zeroRebound ? 'Zero-Stilt Slider Rebounded Aloft' : activePrompt.label
      });
      return commitPerm(perm);
    }

    function recombineNext() {
      var cycle = [DESIRE_PROMPTS[2], DESIRE_PROMPTS[3], DESIRE_PROMPTS[4], DESIRE_PROMPTS[5]];
      var nextPrompt = cycle[store.recombineCursor % cycle.length];
      store.recombineCursor += 1;
      store.lastPrompt = nextPrompt;
      store.axes.pilingHeight = round2(clamp(0.64 + ((store.recombineCursor * 13) % 31) * 0.01, 0.62, 0.96));
      store.axes.catwalkWeave = round2(clamp(0.66 + ((store.recombineCursor * 17) % 29) * 0.01, 0.64, 0.96));
      store.axes.cisternLookouts = round2(clamp(0.60 + ((store.recombineCursor * 19) % 33) * 0.01, 0.58, 0.95));
      store.axes.windVanes = round2(clamp(0.65 + ((store.recombineCursor * 23) % 29) * 0.01, 0.62, 0.96));
      var perm = synthesizePermutation(store, { prompt: nextPrompt });
      return commitPerm(perm);
    }

    function reset() {
      store.generation = 0;
      store.flatAttemptsCount = 0;
      store.recombinationCount = 0;
      store.recombineCursor = 0;
      store.axes = defaultAxes();
      store.lastPrompt = DESIRE_PROMPTS[5];
      store.currentPerm = makeBaselinePerm(store.baselineElevations, store.baselineAltitudeMeters);
      store.history = [];
      return { state: buildState(), permSpec: clonePerm(store.currentPerm) };
    }

    return {
      getState: buildState,
      dreamFromPrompt: dreamFromPrompt,
      attemptGroundReset: attemptGroundReset,
      setDesireAxis: setDesireAxis,
      recombineNext: recombineNext,
      getCurrentPermutation: function () { return clonePerm(store.currentPerm); },
      getHistory: function () { return store.history.map(clonePerm); },
      renderDreamSketch: function (ctx, width, height) {
        return drawDreamSketchInternal(ctx, width, height, store);
      },
      reset: reset
    };
  }

  var api = Object.freeze({
    PALETTE: PALETTE,
    TAXONOMY: TAXONOMY,
    DESIRE_AXES: DESIRE_AXES,
    DESIRE_PROMPTS: DESIRE_PROMPTS,
    createDreamer: createDreamer
  });

  root.ZenobiaHappyLifeDreamer = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
