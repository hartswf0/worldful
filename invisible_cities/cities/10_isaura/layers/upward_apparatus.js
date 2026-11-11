(function () {
  'use strict';

  var LAKE_X_MIN = 0.17;
  var LAKE_X_MAX = 0.83;
  var AQUEDUCT_MAX_SPAN_NORM = 0.28;
  var TWO_PI = Math.PI * 2;

  var LOCUS_META = {
    suspended_bucket: {
      title: 'Suspended Bucket at the Well-Curb',
      calvinoNote:
        'Gods of Ascent: living water drawn from the buried lake appears first as a brimming bucket rising on a taut cable over the masonry edge of the well.'
    },
    revolving_pulley: {
      title: 'Revolving Overhead Pulley',
      calvinoNote:
        'Gods of Ascent: spoked iron-and-brass sheaves revolve above the wellhead, converting subterranean wave head into skyward cable haul.'
    },
    noria_windlass: {
      title: 'Endless-Chain Noria Windlass',
      calvinoNote:
        'Gods of Ascent: a timber-and-copper windlass drum turns an endless loop of tipping bucket-cups, pouring lifted karst water into upper troughs.'
    },
    pump_handle: {
      title: 'Reciprocating Wellhead Pump Handle',
      calvinoNote:
        'Gods of Ascent: walking-beams and lever handles rock at the wellhead in causal rhythm with the underground swell.'
    },
    windmill_blades: {
      title: 'Multi-Vaned Lattice Windmill',
      calvinoNote:
        'Gods of Ascent: lattice-and-sail windmill vanes catch the upper air to pull dark water skyward from the deep calcareous drillings.'
    },
    probe_trestle: {
      title: 'Twisting Probe Trestle',
      calvinoNote:
        'Gods of Ascent: slender timber-and-iron lattice trestles guide helical rotary drill probes downward toward the vaulted calcareous rock sky.'
    },
    stilted_reservoir: {
      title: 'Stilted Roof Reservoir',
      calvinoNote:
        'Gods of Ascent: hooped wooden-and-copper cisterns perch high on thin stilts above Isaura\u2019s pitched roofs, holding lifted lake water in sunlight.'
    },
    aqueduct_arch: {
      title: 'Slender Sky Aqueduct Arch',
      calvinoNote:
        'Gods of Ascent: delicate multi-span masonry-and-timber arches bridge neighboring reservoirs across the sky, carrying shimmering elevated streams.'
    },
    water_columns_plungers_drains: {
      title: 'Surging Water Column, Plunger & Drain',
      calvinoNote:
        'Gods of Ascent: vertical pressurized water columns, riser pipes, reciprocating brass plungers, and cascading drains surge upward together.'
    },
    airy_weathercock: {
      title: 'Airy Crowning Weathercock',
      calvinoNote:
        'Gods of Ascent: gilded weathercocks surmounting the highest airy scaffoldings spin ever faster when hydraulic upward drive peaks.'
    },
    dry_limestone_stub: {
      title: 'Dry Calcareous Bore Stub',
      calvinoNote:
        'Outside the buried lake\u2019s contour [0.17, 0.83]: the rotary bit stalls in arid bleached limestone, leaving chalk dust and a motionless dry rig.'
    }
  };

  var PALETTES = {
    ascent: {
      skyTop: '#7eb2d1',
      skyMid: '#bddbe8',
      skyHorizon: '#f4e8ce',
      sunHaloInner: 'rgba(255, 241, 196, 0.56)',
      sunHaloOuter: 'rgba(255, 236, 184, 0.0)',
      rulingStroke: 'rgba(138, 102, 48, 0.08)',
      marginGuide: 'rgba(168, 109, 38, 0.22)',
      dryOutcropFill: '#dfd5c0',
      dryOutcropStroke: '#9c8f78',
      roofWall: '#eadbc2',
      roofWallShade: '#d6c3a3',
      roofTile: '#c45533',
      roofWindow: '#5c4330',
      framePrimary: '#3c2516',
      frameSecondary: '#7a4a24',
      frameBrace: 'rgba(122, 74, 36, 0.72)',
      timberFill: '#9e6230',
      copperFill: '#c9682b',
      copperRim: '#e69445',
      brassFill: '#dfa938',
      brassBright: '#ffe48f',
      cableStroke: '#4a3520',
      masonryFill: '#e8dac0',
      masonryStroke: '#59422c',
      waterDeep: '#0d8da3',
      waterBright: '#47e3e0',
      waterFoam: '#e2ffff',
      glassStroke: 'rgba(42, 89, 102, 0.68)',
      glassFill: 'rgba(210, 248, 252, 0.34)',
      sailFill: 'rgba(255, 248, 231, 0.88)',
      sailStroke: '#8f5529',
      aqueductStone: '#d9be96',
      aqueductStroke: '#6b4526',
      weathercockFill: '#f3bb2c',
      weathercockStroke: '#663c10',
      dryRigStroke: '#7d7362',
      dryRigFill: '#afa490',
      chalkDust: 'rgba(236, 229, 214, 0.75)',
      hoverStroke: '#c93b22',
      hoverFill: 'rgba(255, 214, 102, 0.24)',
      wireframeMode: false
    },
    depths: {
      skyTop: '#070b14',
      skyMid: '#0f1829',
      skyHorizon: '#18243a',
      sunHaloInner: 'rgba(104, 152, 204, 0.12)',
      sunHaloOuter: 'rgba(16, 28, 48, 0.0)',
      rulingStroke: 'rgba(162, 190, 222, 0.05)',
      marginGuide: 'rgba(140, 186, 224, 0.18)',
      dryOutcropFill: '#1a2230',
      dryOutcropStroke: 'rgba(148, 165, 186, 0.30)',
      roofWall: 'rgba(30, 44, 66, 0.55)',
      roofWallShade: 'rgba(22, 34, 52, 0.55)',
      roofTile: 'rgba(92, 122, 158, 0.42)',
      roofWindow: 'rgba(168, 204, 238, 0.28)',
      framePrimary: 'rgba(192, 214, 238, 0.46)',
      frameSecondary: 'rgba(162, 190, 220, 0.36)',
      frameBrace: 'rgba(148, 180, 214, 0.24)',
      timberFill: 'rgba(120, 152, 188, 0.16)',
      copperFill: 'rgba(142, 182, 220, 0.18)',
      copperRim: 'rgba(196, 222, 246, 0.48)',
      brassFill: 'rgba(186, 214, 242, 0.30)',
      brassBright: 'rgba(224, 240, 255, 0.62)',
      cableStroke: 'rgba(176, 204, 232, 0.36)',
      masonryFill: 'rgba(34, 49, 72, 0.65)',
      masonryStroke: 'rgba(175, 202, 230, 0.42)',
      waterDeep: 'rgba(88, 168, 214, 0.38)',
      waterBright: 'rgba(148, 222, 255, 0.56)',
      waterFoam: 'rgba(216, 244, 255, 0.68)',
      glassStroke: 'rgba(168, 205, 238, 0.36)',
      glassFill: 'rgba(84, 136, 184, 0.10)',
      sailFill: 'rgba(168, 198, 230, 0.10)',
      sailStroke: 'rgba(180, 208, 236, 0.36)',
      aqueductStone: 'rgba(128, 162, 198, 0.14)',
      aqueductStroke: 'rgba(176, 205, 234, 0.36)',
      weathercockFill: 'rgba(206, 228, 250, 0.46)',
      weathercockStroke: 'rgba(226, 240, 255, 0.62)',
      dryRigStroke: 'rgba(126, 140, 160, 0.28)',
      dryRigFill: 'rgba(92, 106, 126, 0.14)',
      chalkDust: 'rgba(164, 178, 196, 0.25)',
      hoverStroke: '#7fd4ff',
      hoverFill: 'rgba(127, 212, 255, 0.16)',
      wireframeMode: true
    },
    schism: {
      skyTop: '#ded5c1',
      skyMid: '#eae2d0',
      skyHorizon: '#f2ead9',
      sunHaloInner: 'rgba(255, 249, 232, 0.42)',
      sunHaloOuter: 'rgba(242, 234, 217, 0.0)',
      rulingStroke: 'rgba(56, 49, 40, 0.07)',
      marginGuide: 'rgba(46, 78, 88, 0.24)',
      dryOutcropFill: '#dbd3c3',
      dryOutcropStroke: '#7d7567',
      roofWall: '#e5dbc7',
      roofWallShade: '#d2c5ad',
      roofTile: '#9b553b',
      roofWindow: '#3f372e',
      framePrimary: '#242629',
      frameSecondary: '#463d33',
      frameBrace: 'rgba(58, 51, 43, 0.64)',
      timberFill: '#7d5b3c',
      copperFill: '#9a5b37',
      copperRim: '#c2834b',
      brassFill: '#b88933',
      brassBright: '#e5c16c',
      cableStroke: '#2f3136',
      masonryFill: '#dfd5c1',
      masonryStroke: '#38332c',
      waterDeep: '#156f87',
      waterBright: '#36acc2',
      waterFoam: '#d8f6fa',
      glassStroke: 'rgba(38, 58, 68, 0.66)',
      glassFill: 'rgba(196, 234, 242, 0.30)',
      sailFill: 'rgba(248, 242, 228, 0.84)',
      sailStroke: '#4a4035',
      aqueductStone: '#d4c6ae',
      aqueductStroke: '#3c362e',
      weathercockFill: '#c99633',
      weathercockStroke: '#2b241b',
      dryRigStroke: '#6e675b',
      dryRigFill: '#a69d8d',
      chalkDust: 'rgba(226, 220, 207, 0.72)',
      hoverStroke: '#12718a',
      hoverFill: 'rgba(54, 172, 194, 0.18)',
      wireframeMode: false
    }
  };

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function hashString(str) {
    var s = String(str);
    var h = 2166136261 >>> 0;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function hashUnit(seed) {
    var x = (seed ^ 0x9e3779b9) >>> 0;
    x = Math.imul(x ^ (x >>> 16), 0x85ebca6b) >>> 0;
    x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35) >>> 0;
    x = (x ^ (x >>> 16)) >>> 0;
    return (x & 0xffffff) / 0x1000000;
  }

  function setDash(ctx, pattern) {
    if (typeof ctx.setLineDash === 'function') {
      ctx.setLineDash(pattern);
    }
  }

  function drawEllipsePath(ctx, cx, cy, rx, ry) {
    if (rx <= 0 || ry <= 0) return;
    if (typeof ctx.ellipse === 'function') {
      ctx.ellipse(cx, cy, rx, ry, 0, 0, TWO_PI);
    } else {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(rx, ry);
      ctx.arc(0, 0, 1, 0, TWO_PI);
      ctx.restore();
    }
  }

  function makeLinearGrad(ctx, x0, y0, x1, y1, stops, fallback) {
    if (typeof ctx.createLinearGradient === 'function') {
      var g = ctx.createLinearGradient(x0, y0, x1, y1);
      if (g && typeof g.addColorStop === 'function') {
        for (var i = 0; i < stops.length; i++) {
          g.addColorStop(stops[i][0], stops[i][1]);
        }
        return g;
      }
    }
    return fallback;
  }

  function makeRadialGrad(ctx, x0, y0, r0, x1, y1, r1, stops, fallback) {
    if (typeof ctx.createRadialGradient === 'function') {
      var g = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
      if (g && typeof g.addColorStop === 'function') {
        for (var i = 0; i < stops.length; i++) {
          g.addColorStop(stops[i][0], stops[i][1]);
        }
        return g;
      }
    }
    return fallback;
  }

  function distToSegmentSq(px, py, x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var lenSq = dx * dx + dy * dy;
    if (lenSq <= 1e-6) {
      var ex = px - x1;
      var ey = py - y1;
      return ex * ex + ey * ey;
    }
    var t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
    t = clamp(t, 0, 1);
    var projX = x1 + t * dx;
    var projY = y1 + t * dy;
    var rx = px - projX;
    var ry = py - projY;
    return rx * rx + ry * ry;
  }

  function buildHouseTemplates() {
    var list = [];
    var span = LAKE_X_MAX - LAKE_X_MIN;
    var count = 30;
    for (var i = 0; i < count; i++) {
      var seed = (i + 1) * 7919;
      var u0 = LAKE_X_MIN + 0.004 + ((span - 0.008) * i) / count;
      var wNorm = ((span - 0.008) / count) * (0.82 + 0.34 * hashUnit(seed + 1));
      var hPxBase = 10 + 16 * hashUnit(seed + 2);
      var roofPeakPx = 5 + 7 * hashUnit(seed + 3);
      var hasArch = hashUnit(seed + 4) > 0.35;
      var hasLantern = hashUnit(seed + 5) > 0.76;
      list.push({
        xNormCenter: u0 + wNorm * 0.5,
        wNorm: wNorm,
        hPxBase: hPxBase,
        roofPeakPx: roofPeakPx,
        hasArch: hasArch,
        hasLantern: hasLantern
      });
    }
    return list;
  }

  function buildDryOutcrops() {
    var outcrops = [];
    var positions = [0.028, 0.064, 0.108, 0.146, 0.854, 0.896, 0.938, 0.974];
    for (var i = 0; i < positions.length; i++) {
      var seed = (i + 11) * 4211;
      outcrops.push({
        xNorm: positions[i],
        wBase: 14 + 14 * hashUnit(seed + 1),
        hBase: 4 + 6 * hashUnit(seed + 2),
        skew: -0.25 + 0.5 * hashUnit(seed + 3)
      });
    }
    return outcrops;
  }

  function createUpwardApparatus(config) {
    var cfg = config || {};
    var shaftMap = new Map();
    var orderedIds = [];
    var houseTemplates = buildHouseTemplates();
    var dryOutcrops = buildDryOutcrops();

    var cursorRigState = {
      twistAngle: 0,
      bobPhase: 0,
      dustPhase: 0
    };
    var skyAmbientPhase = 0;

    function createShaftRecord(shaft, index) {
      var idStr = String(shaft.id);
      var h = hashString(idStr + ':' + Number(shaft.xNorm || 0).toFixed(4));
      var xNorm = clamp(Number(shaft.xNorm) || 0, 0, 1);
      var hitLake =
        typeof shaft.hitLake === 'boolean'
          ? shaft.hitLake
          : xNorm >= LAKE_X_MIN && xNorm <= LAKE_X_MAX;
      var variantRaw =
        typeof shaft.rigVariant === 'number' && !isNaN(shaft.rigVariant)
          ? Math.floor(shaft.rigVariant)
          : index;
      var variant = ((variantRaw % 3) + 3) % 3;
      var drillProgress =
        typeof shaft.drillProgress === 'number'
          ? clamp(shaft.drillProgress, 0, 1)
          : 1;

      var heightFactor = 0.64 + 0.24 * hashUnit(h + 17) + (variant === 2 ? 0.04 : 0);
      var pipeSide = hashUnit(h + 31) >= 0.5 ? 1 : -1;
      var phaseSeed = hashUnit(h + 53);

      var chalkPuffs = [];
      for (var p = 0; p < 7; p++) {
        var ang = Math.PI + (p / 6) * Math.PI;
        chalkPuffs.push({
          vx: Math.cos(ang) * (8 + 14 * hashUnit(h + 100 + p)),
          vy: Math.sin(ang) * (5 + 11 * hashUnit(h + 200 + p)),
          r: 2.2 + 2.8 * hashUnit(h + 300 + p)
        });
      }

      return {
        id: shaft.id,
        idKey: idStr,
        xNorm: xNorm,
        hitLake: hitLake,
        drillProgress: drillProgress,
        targetDepthFrac: Number(shaft.targetDepthFrac) || (hitLake ? 0.65 : 0.34),
        currentDepthFrac: Number(shaft.currentDepthFrac) || 0,
        age: Number(shaft.age) || 0,
        rigVariant: variant,
        pumpImpulse: Number(shaft.pumpImpulse) || 0,

        heightFactor: clamp(heightFactor, 0.62, 0.90),
        pipeSide: pipeSide,

        upwardDrive: hitLake && drillProgress >= 0.999 ? 0.32 : 0,
        effectiveDrive: hitLake && drillProgress >= 0.999 ? 0.32 : 0,
        waveOffset: 0,
        streamFeed: hitLake ? 0.35 : 0,

        erectProgress: drillProgress >= 0.999 ? 1.0 : clamp(drillProgress * 0.65, 0.12, 0.85),
        bucketPhase: phaseSeed,
        pulleyAngle: phaseSeed * TWO_PI,
        noriaPhase: (phaseSeed + 0.37) % 1,
        pumpPhase: phaseSeed * TWO_PI,
        pumpStroke: Math.sin(phaseSeed * TWO_PI),
        windmillAngle: phaseSeed * TWO_PI,
        probeTwistAngle: phaseSeed * TWO_PI,
        plungerPhase: (phaseSeed + 0.25) * TWO_PI,
        plungerPos: 0.5,
        columnPulsePhase: phaseSeed,
        waterColumnSurge: hitLake && drillProgress >= 0.999 ? 0.42 : 0,
        reservoirFill: hitLake && drillProgress >= 0.999 ? 0.56 : 0,
        weathercockAngle: phaseSeed * TWO_PI,
        weathercockSpin: 0,

        chalkBurstProgress: drillProgress >= 0.999 ? 1.0 : 0.0,
        wasCompleted: drillProgress >= 0.999,
        chalkPuffs: chalkPuffs
      };
    }

    function syncShafts(shafts) {
      if (!Array.isArray(shafts)) {
        shaftMap.clear();
        orderedIds = [];
        return;
      }

      var seen = new Set();
      var nextIds = [];

      for (var i = 0; i < shafts.length; i++) {
        var s = shafts[i];
        if (!s || s.id === undefined || s.id === null) continue;
        var key = String(s.id);
        seen.add(key);
        nextIds.push(key);

        var rec = shaftMap.get(key);
        if (!rec) {
          rec = createShaftRecord(s, i);
          shaftMap.set(key, rec);
        } else {
          rec.id = s.id;
          rec.xNorm = clamp(Number(s.xNorm) || 0, 0, 1);
          if (typeof s.hitLake === 'boolean') {
            rec.hitLake = s.hitLake;
          } else {
            rec.hitLake = rec.xNorm >= LAKE_X_MIN && rec.xNorm <= LAKE_X_MAX;
          }
          if (typeof s.drillProgress === 'number') {
            rec.drillProgress = clamp(s.drillProgress, 0, 1);
          }
          if (typeof s.targetDepthFrac === 'number') {
            rec.targetDepthFrac = s.targetDepthFrac;
          }
          if (typeof s.currentDepthFrac === 'number') {
            rec.currentDepthFrac = s.currentDepthFrac;
          }
          if (typeof s.age === 'number') {
            rec.age = s.age;
          }
          if (typeof s.rigVariant === 'number' && !isNaN(s.rigVariant)) {
            rec.rigVariant = ((Math.floor(s.rigVariant) % 3) + 3) % 3;
          }
          rec.pumpImpulse = Number(s.pumpImpulse) || 0;

          if (!rec.hitLake) {
            rec.upwardDrive = 0;
            rec.effectiveDrive = 0;
            rec.waterColumnSurge = 0;
            rec.reservoirFill = 0;
            rec.weathercockSpin = 0;
          }
        }
      }

      shaftMap.forEach(function (_val, key) {
        if (!seen.has(key)) {
          shaftMap.delete(key);
        }
      });

      orderedIds = nextIds;
    }

    function readHydraulics(hydraulicsByShaftId, rec) {
      if (!hydraulicsByShaftId) return null;
      if (typeof hydraulicsByShaftId === 'function') {
        return hydraulicsByShaftId(rec.id);
      }
      if (typeof hydraulicsByShaftId.get === 'function') {
        return hydraulicsByShaftId.get(rec.id) || hydraulicsByShaftId.get(rec.idKey) || null;
      }
      return hydraulicsByShaftId[rec.id] || hydraulicsByShaftId[rec.idKey] || null;
    }

    function step(dt, hydraulicsByShaftId, state) {
      var st = state || {};
      if (Array.isArray(st.shafts)) {
        syncShafts(st.shafts);
      }

      var safeDt = clamp(Number(dt) || 0, 0, 0.1);
      var reducedMotion = Boolean(st.reducedMotion);
      var motionScale = reducedMotion ? 0.15 : 1.0;
      var globalPumpBoost = Math.max(0, Number(st.pumpBoost) || 0);

      skyAmbientPhase = (skyAmbientPhase + safeDt * 0.22 * motionScale) % 1000;

      for (var i = 0; i < orderedIds.length; i++) {
        var rec = shaftMap.get(orderedIds[i]);
        if (!rec) continue;

        var isDrilling = rec.drillProgress < 0.999;

        if (!rec.hitLake || rec.xNorm < LAKE_X_MIN || rec.xNorm > LAKE_X_MAX) {
          rec.upwardDrive = 0;
          rec.effectiveDrive = 0;
          rec.waveOffset = 0;
          rec.streamFeed = 0;
          rec.waterColumnSurge = 0;
          rec.reservoirFill = 0;
          rec.weathercockSpin = 0;

          if (isDrilling) {
            rec.probeTwistAngle = (rec.probeTwistAngle + safeDt * 8.5 * motionScale) % TWO_PI;
            rec.erectProgress = clamp(0.25 + rec.drillProgress * 0.75, 0.25, 1.0);
          } else {
            rec.erectProgress = 1.0;
            if (!rec.wasCompleted) {
              rec.wasCompleted = true;
              rec.chalkBurstProgress = 0.02;
            } else if (rec.chalkBurstProgress > 0 && rec.chalkBurstProgress < 1) {
              rec.chalkBurstProgress = Math.min(
                1,
                rec.chalkBurstProgress + safeDt * (reducedMotion ? 1.8 : 1.1)
              );
            }
          }
          continue;
        }

        var hyd = readHydraulics(hydraulicsByShaftId, rec);
        var insideHyd = hyd ? hyd.insideContour !== false : true;
        var baseDrive =
          hyd && insideHyd && typeof hyd.upwardDrive === 'number'
            ? Math.max(0, hyd.upwardDrive)
            : 0;
        var shaftImpulse = Math.max(0, rec.pumpImpulse);

        rec.waveOffset = hyd && typeof hyd.waveOffset === 'number' ? hyd.waveOffset : 0;
        rec.streamFeed = hyd && typeof hyd.streamFeed === 'number' ? hyd.streamFeed : 0;

        var completionFactor = isDrilling
          ? clamp((rec.drillProgress - 0.68) / 0.32, 0, 1)
          : 1.0;

        var rawDrive = insideHyd ? (baseDrive + globalPumpBoost + shaftImpulse) * completionFactor : 0;
        var drive = clamp(rawDrive, 0, 1.65);

        rec.upwardDrive = baseDrive * completionFactor;
        rec.effectiveDrive = drive;

        if (isDrilling) {
          rec.probeTwistAngle = (rec.probeTwistAngle + safeDt * 10.5 * motionScale) % TWO_PI;
          rec.erectProgress = clamp(0.22 + rec.drillProgress * 0.78, 0.22, 1.0);
        } else {
          rec.wasCompleted = true;
          rec.erectProgress = Math.min(1.0, rec.erectProgress + safeDt * 2.6);
          rec.probeTwistAngle =
            (rec.probeTwistAngle + drive * 1.85 * safeDt * motionScale) % TWO_PI;
        }

        rec.bucketPhase = (rec.bucketPhase + drive * 0.44 * safeDt * motionScale) % 1;
        rec.pulleyAngle = (rec.pulleyAngle + drive * 3.4 * safeDt * motionScale) % TWO_PI;
        rec.noriaPhase = (rec.noriaPhase + drive * 0.38 * safeDt * motionScale) % 1;
        rec.pumpPhase = (rec.pumpPhase + drive * 3.1 * safeDt * motionScale) % TWO_PI;
        rec.pumpStroke = drive > 0 ? Math.sin(rec.pumpPhase) : 0;
        rec.windmillAngle = (rec.windmillAngle + drive * 2.5 * safeDt * motionScale) % TWO_PI;
        rec.plungerPhase = (rec.plungerPhase + drive * 3.8 * safeDt * motionScale) % TWO_PI;
        rec.plungerPos = drive > 0 ? 0.5 + 0.5 * Math.sin(rec.plungerPhase) : 0.15;
        rec.columnPulsePhase =
          (rec.columnPulsePhase + drive * 1.65 * safeDt * motionScale) % 1;

        var targetSurge = drive > 0 ? clamp(0.16 + drive * 0.84, 0, 1) : 0;
        var surgeLerp = Math.min(1, safeDt * 6.5);
        rec.waterColumnSurge += (targetSurge - rec.waterColumnSurge) * surgeLerp;
        if (drive === 0 && rec.waterColumnSurge < 0.005) {
          rec.waterColumnSurge = 0;
        }

        var targetFill = drive > 0 ? clamp(0.24 + drive * 0.72, 0, 0.96) : 0;
        var fillLerp = Math.min(1, safeDt * 3.2);
        rec.reservoirFill += (targetFill - rec.reservoirFill) * fillLerp;

        var peakSpin = drive * (1.9 + 4.2 * drive);
        rec.weathercockSpin = peakSpin;
        rec.weathercockAngle =
          (rec.weathercockAngle + peakSpin * safeDt * motionScale) % TWO_PI;
      }

      var cursorDrilling =
        st.activeDrillingShaftId !== undefined && st.activeDrillingShaftId !== null;
      if (cursorDrilling) {
        cursorRigState.twistAngle =
          (cursorRigState.twistAngle + safeDt * 11.2 * motionScale) % TWO_PI;
        cursorRigState.dustPhase = (cursorRigState.dustPhase + safeDt * 2.5 * motionScale) % 1;
      } else if (!reducedMotion) {
        cursorRigState.bobPhase = (cursorRigState.bobPhase + safeDt * 1.4) % TWO_PI;
      }
    }

    function computeSceneLayout(viewport, state) {
      var st = state || {};
      var width = Math.max(120, Number(viewport && viewport.width) || 1280);
      var height = Math.max(120, Number(viewport && viewport.height) || 800);
      var surfaceY =
        viewport && typeof viewport.surfaceY === 'number'
          ? clamp(viewport.surfaceY, 60, height - 40)
          : height * 0.48;

      var topInset =
        typeof cfg.topSafeInset === 'number'
          ? cfg.topSafeInset
          : Math.max(16, Math.min(54, surfaceY * 0.12));
      var usableSkyH = Math.max(80, surfaceY - topInset);

      var wetCount = 0;
      for (var i = 0; i < orderedIds.length; i++) {
        var r0 = shaftMap.get(orderedIds[i]);
        if (r0 && r0.hitLake) wetCount++;
      }

      var viewportScale = clamp(width / 980, 0.56, 1.12);
      var densityScale = wetCount > 12 ? clamp(Math.sqrt(12 / wetCount), 0.52, 1.0) : 1.0;
      var uScale = viewportScale * densityScale;
      var vScale = clamp(usableSkyH / 320, 0.55, 1.18);

      var wetTowers = [];
      var dryStubs = [];

      for (var j = 0; j < orderedIds.length; j++) {
        var rec = shaftMap.get(orderedIds[j]);
        if (!rec) continue;

        var x = rec.xNorm * width;

        if (!rec.hitLake || rec.xNorm < LAKE_X_MIN || rec.xNorm > LAKE_X_MAX) {
          var stubH = Math.max(24, 38 * vScale * rec.erectProgress);
          var stubW = Math.max(12, 20 * viewportScale);
          dryStubs.push({
            rec: rec,
            x: x,
            baseY: surfaceY,
            topY: surfaceY - stubH,
            halfW: stubW * 0.5,
            hitBox: {
              x1: x - stubW * 0.72,
              y1: surfaceY - stubH - 6,
              x2: x + stubW * 0.72,
              y2: surfaceY + 6
            }
          });
          continue;
        }

        var fullTowerH = usableSkyH * rec.heightFactor;
        var towerH = Math.max(68, fullTowerH * (0.28 + 0.72 * rec.erectProgress));
        var side = rec.pipeSide;

        var curbW = Math.max(11, 20 * uScale);
        var curbH = Math.max(5, 8.5 * vScale);

        var pulleyY = surfaceY - towerH * 0.33;
        var pulleyR = Math.max(4.8, 8.2 * uScale);
        var bucketCableX = x - side * 2.4 * uScale;

        var bp = rec.bucketPhase;
        var liftFrac = bp < 0.78 ? bp / 0.78 : 1 - (bp - 0.78) / 0.22;
        var bucketMinY = pulleyY + pulleyR + 6 * vScale;
        var bucketMaxY = surfaceY - curbH - 4 * vScale;
        if (bucketMinY > bucketMaxY) bucketMinY = bucketMaxY - 4;
        var bucketY = bucketMaxY - liftFrac * (bucketMaxY - bucketMinY);
        var bucketTip = bp >= 0.72 && bp <= 0.84 ? Math.sin(((bp - 0.72) / 0.12) * Math.PI) : 0;
        var bucketW = Math.max(5.5, 8.8 * uScale);
        var bucketH = Math.max(6.5, 9.8 * vScale);

        var pipeX = x + side * Math.max(6.5, 10.5 * uScale);
        var drainX = x - side * Math.max(6.5, 10.5 * uScale);

        var resBottomY = surfaceY - towerH * 0.70;
        var resTopY = surfaceY - towerH * 0.835;
        var resHalfW = Math.max(6.8, 11.2 * uScale);

        var plungerY = surfaceY - towerH * 0.45;
        var midY = surfaceY - towerH * 0.51;

        var weathercockY = surfaceY - towerH;
        var vaneR = Math.max(6.5, 10.8 * uScale);

        var pumpSide = rec.rigVariant === 1 ? 1 : -1;
        var pumpPivotX = x + pumpSide * Math.max(8, 13.5 * uScale);
        var pumpPivotY = surfaceY - curbH - Math.max(5, 7.5 * vScale);
        var pumpArmLen = Math.max(9, 15.5 * uScale);

        var noriaBox = null;
        var windmillBox = null;
        var trestleBox = null;

        if (rec.rigVariant === 0) {
          var noriaX = x - side * Math.max(6, 9.5 * uScale);
          var noriaTopY = surfaceY - towerH * 0.57;
          var noriaBotY = surfaceY - towerH * 0.39;
          var noriaR = Math.max(5.2, 8.6 * uScale);
          noriaBox = {
            cx: noriaX,
            topY: noriaTopY,
            botY: noriaBotY,
            r: noriaR,
            x1: noriaX - noriaR - 5,
            y1: noriaTopY - noriaR - 4,
            x2: noriaX + noriaR + 5,
            y2: noriaBotY + noriaR + 4
          };
        } else if (rec.rigVariant === 1) {
          var millX = x - side * Math.max(8.5, 14.5 * uScale);
          var millY = surfaceY - towerH * 0.53;
          var millR = Math.max(10.5, 18.5 * uScale);
          windmillBox = {
            cx: millX,
            cy: millY,
            r: millR
          };
        } else {
          var trTopY = surfaceY - towerH * 0.63;
          var trBotY = surfaceY - towerH * 0.37;
          var trHalfW = Math.max(6.5, 10.5 * uScale);
          trestleBox = {
            cx: x,
            topY: trTopY,
            botY: trBotY,
            halfW: trHalfW,
            x1: x - trHalfW - 4,
            y1: trTopY - 3,
            x2: x + trHalfW + 4,
            y2: trBotY + 3
          };
        }

        wetTowers.push({
          rec: rec,
          x: x,
          side: side,
          baseY: surfaceY,
          towerH: towerH,
          uScale: uScale,
          vScale: vScale,
          curbW: curbW,
          curbH: curbH,
          bucket: {
            cx: bucketCableX,
            cy: bucketY,
            w: bucketW,
            h: bucketH,
            tip: bucketTip,
            liftFrac: liftFrac,
            x1: bucketCableX - bucketW * 0.85 - 3,
            y1: bucketY - bucketH * 0.7 - 3,
            x2: bucketCableX + bucketW * 0.85 + 3,
            y2: bucketY + bucketH * 0.7 + 3
          },
          pulley: {
            cx: bucketCableX + side * 1.8 * uScale,
            cy: pulleyY,
            r: pulleyR
          },
          column: {
            pipeX: pipeX,
            drainX: drainX,
            plungerY: plungerY,
            botY: surfaceY - curbH,
            topY: resBottomY,
            halfW: Math.max(3.2, 4.4 * uScale),
            x1: pipeX - Math.max(5.5, 7.5 * uScale),
            y1: resBottomY + 2,
            x2: pipeX + Math.max(5.5, 7.5 * uScale),
            y2: surfaceY - curbH
          },
          pump: {
            pivotX: pumpPivotX,
            pivotY: pumpPivotY,
            armLen: pumpArmLen,
            side: pumpSide,
            isBeam: rec.rigVariant === 2,
            x1: pumpPivotX - pumpArmLen - 4,
            y1: pumpPivotY - 12 * vScale,
            x2: pumpPivotX + pumpArmLen + 4,
            y2: surfaceY + 3
          },
          noria: noriaBox,
          windmill: windmillBox,
          trestle: trestleBox,
          reservoir: {
            cx: x,
            topY: resTopY,
            botY: resBottomY,
            halfW: resHalfW,
            x1: x - resHalfW - 4,
            y1: resTopY - 7 * vScale,
            x2: x + resHalfW + 4,
            y2: resBottomY + 4
          },
          weathercock: {
            cx: x,
            cy: weathercockY + vaneR * 0.45,
            spireBotY: resTopY - 5 * vScale,
            spireTopY: weathercockY,
            r: vaneR
          },
          midY: midY
        });
      }

      var completedWet = wetTowers
        .filter(function (t) {
          return t.rec.drillProgress >= 0.999;
        })
        .slice()
        .sort(function (a, b) {
          return a.rec.xNorm - b.rec.xNorm;
        });

      var aqueducts = [];
      for (var k = 0; k < completedWet.length - 1; k++) {
        var leftT = completedWet[k];
        var rightT = completedWet[k + 1];
        var dNorm = rightT.rec.xNorm - leftT.rec.xNorm;
        if (dNorm > 0.006 && dNorm < AQUEDUCT_MAX_SPAN_NORM) {
          var ax1 = leftT.reservoir.cx + leftT.reservoir.halfW * 0.86;
          var ay1 = leftT.reservoir.botY - (leftT.reservoir.botY - leftT.reservoir.topY) * 0.35;
          var ax2 = rightT.reservoir.cx - rightT.reservoir.halfW * 0.86;
          var ay2 = rightT.reservoir.botY - (rightT.reservoir.botY - rightT.reservoir.topY) * 0.35;
          if (ax2 > ax1 + 3) {
            aqueducts.push({
              leftTower: leftT,
              rightTower: rightT,
              shaftId: leftT.rec.id,
              x1: ax1,
              y1: ay1,
              x2: ax2,
              y2: ay2,
              archDepth: Math.max(6.5, Math.min(15, (ax2 - ax1) * 0.11)),
              avgDrive: 0.5 * (leftT.rec.effectiveDrive + rightT.rec.effectiveDrive),
              rawDrive: 0.5 * (leftT.rec.upwardDrive + rightT.rec.upwardDrive)
            });
          }
        }
      }

      var cursorRig = null;
      if (typeof st.cursorXNorm === 'number' && !isNaN(st.cursorXNorm)) {
        var cxNorm = clamp(st.cursorXNorm, 0.01, 0.99);
        var cx = cxNorm * width;
        var rigH = Math.max(38, 60 * vScale);
        var rigHalfW = Math.max(8.5, 13.5 * viewportScale);
        var inside =
          typeof st.cursorInsideContour === 'boolean'
            ? st.cursorInsideContour
            : cxNorm >= LAKE_X_MIN && cxNorm <= LAKE_X_MAX;
        var isActiveDrilling =
          st.activeDrillingShaftId !== undefined && st.activeDrillingShaftId !== null;

        var nearExisting = false;
        if (!isActiveDrilling) {
          for (var m = 0; m < wetTowers.length; m++) {
            if (Math.abs(wetTowers[m].x - cx) < rigHalfW * 1.25) {
              nearExisting = true;
              break;
            }
          }
        }

        cursorRig = {
          shaftId: isActiveDrilling ? st.activeDrillingShaftId : 'cursor_probe',
          xNorm: cxNorm,
          cx: cx,
          baseY: surfaceY,
          topY: surfaceY - rigH,
          halfW: rigHalfW,
          insideContour: inside,
          activeDrilling: isActiveDrilling,
          nearExisting: nearExisting,
          hitBox: {
            x1: cx - rigHalfW - 4,
            y1: surfaceY - rigH - 6,
            x2: cx + rigHalfW + 4,
            y2: surfaceY + 4
          }
        };
      }

      return {
        width: width,
        height: height,
        surfaceY: surfaceY,
        topInset: topInset,
        usableSkyH: usableSkyH,
        viewportScale: viewportScale,
        uScale: uScale,
        vScale: vScale,
        wetTowers: wetTowers,
        dryStubs: dryStubs,
        aqueducts: aqueducts,
        cursorRig: cursorRig
      };
    }

    function makeInspectionPayload(shaftId, kind, upwardDrive) {
      var meta = LOCUS_META[kind] || LOCUS_META.probe_trestle;
      return {
        shaftId: shaftId,
        kind: kind,
        title: meta.title,
        calvinoNote: meta.calvinoNote,
        upwardDrive: Number((upwardDrive || 0).toFixed(4))
      };
    }

    function inBox(px, py, box) {
      return box && px >= box.x1 && px <= box.x2 && py >= box.y1 && py <= box.y2;
    }

    function inspectAt(px, py, viewport, state) {
      var st = state || {};
      if (Array.isArray(st.shafts)) {
        syncShafts(st.shafts);
      }
      if (!viewport || typeof px !== 'number' || typeof py !== 'number') {
        return null;
      }

      var layout = computeSceneLayout(viewport, st);
      if (
        px < 0 ||
        px > layout.width ||
        py < 0 ||
        py > layout.surfaceY + 7
      ) {
        return null;
      }

      var towers = layout.wetTowers;
      for (var i = towers.length - 1; i >= 0; i--) {
        var t = towers[i];
        var driveVal = t.rec.effectiveDrive;
        var sid = t.rec.id;

        var wc = t.weathercock;
        var dxWc = px - wc.cx;
        var dyWc = py - wc.cy;
        if (dxWc * dxWc + dyWc * dyWc <= (wc.r + 6) * (wc.r + 6)) {
          return makeInspectionPayload(sid, 'airy_weathercock', driveVal);
        }

        if (inBox(px, py, t.reservoir)) {
          return makeInspectionPayload(sid, 'stilted_reservoir', driveVal);
        }

        if (t.windmill) {
          var dxMill = px - t.windmill.cx;
          var dyMill = py - t.windmill.cy;
          if (dxMill * dxMill + dyMill * dyMill <= (t.windmill.r + 4) * (t.windmill.r + 4)) {
            return makeInspectionPayload(sid, 'windmill_blades', driveVal);
          }
        }

        if (t.noria && inBox(px, py, t.noria)) {
          return makeInspectionPayload(sid, 'noria_windlass', driveVal);
        }

        if (t.trestle && inBox(px, py, t.trestle)) {
          return makeInspectionPayload(sid, 'probe_trestle', driveVal);
        }

        var dxPul = px - t.pulley.cx;
        var dyPul = py - t.pulley.cy;
        if (dxPul * dxPul + dyPul * dyPul <= (t.pulley.r + 5) * (t.pulley.r + 5)) {
          return makeInspectionPayload(sid, 'revolving_pulley', driveVal);
        }

        if (inBox(px, py, t.bucket)) {
          return makeInspectionPayload(sid, 'suspended_bucket', driveVal);
        }

        if (inBox(px, py, t.pump)) {
          return makeInspectionPayload(sid, 'pump_handle', driveVal);
        }

        if (inBox(px, py, t.column)) {
          return makeInspectionPayload(sid, 'water_columns_plungers_drains', driveVal);
        }
      }

      for (var a = layout.aqueducts.length - 1; a >= 0; a--) {
        var aq = layout.aqueducts[a];
        var midOffsetY = aq.archDepth * 0.42;
        var dSq = distToSegmentSq(
          px,
          py,
          aq.x1,
          aq.y1 + midOffsetY,
          aq.x2,
          aq.y2 + midOffsetY
        );
        var tol = Math.max(9, aq.archDepth * 0.85);
        if (dSq <= tol * tol) {
          return makeInspectionPayload(aq.shaftId, 'aqueduct_arch', aq.avgDrive);
        }
      }

      for (var d = layout.dryStubs.length - 1; d >= 0; d--) {
        var ds = layout.dryStubs[d];
        if (inBox(px, py, ds.hitBox)) {
          return makeInspectionPayload(ds.rec.id, 'dry_limestone_stub', 0);
        }
      }

      if (layout.cursorRig && inBox(px, py, layout.cursorRig.hitBox)) {
        var cr = layout.cursorRig;
        return makeInspectionPayload(
          cr.shaftId,
          'probe_trestle',
          cr.insideContour && cr.activeDrilling ? 0.35 : 0
        );
      }

      return null;
    }

    function drawSkyBackdrop(ctx, layout, pal, theology, reducedMotion) {
      var w = layout.width;
      var sy = layout.surfaceY;

      var skyGrad = makeLinearGrad(
        ctx,
        0,
        0,
        0,
        sy,
        [
          [0, pal.skyTop],
          [0.56, pal.skyMid],
          [1, pal.skyHorizon]
        ],
        pal.skyMid
      );
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, sy + 1);

      var leftX = LAKE_X_MIN * w;
      var rightX = LAKE_X_MAX * w;
      var midCityX = 0.5 * (leftX + rightX);

      var haloR = Math.max(rightX - leftX, sy) * 0.62;
      var haloGrad = makeRadialGrad(
        ctx,
        midCityX,
        sy * 0.62,
        haloR * 0.05,
        midCityX,
        sy * 0.62,
        haloR,
        [
          [0, pal.sunHaloInner],
          [1, pal.sunHaloOuter]
        ],
        pal.sunHaloInner
      );
      ctx.fillStyle = haloGrad;
      ctx.fillRect(leftX, 0, rightX - leftX, sy);

      ctx.strokeStyle = pal.rulingStroke;
      ctx.lineWidth = 1;
      var stepY = theology === 'depths' ? 14 : 9;
      var maxRuleY = sy * 0.58;
      ctx.beginPath();
      for (var y = 10; y < maxRuleY; y += stepY) {
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
      }
      ctx.stroke();

      ctx.save();
      setDash(ctx, [3, 5]);
      ctx.strokeStyle = pal.marginGuide;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leftX, Math.max(12, sy * 0.14));
      ctx.lineTo(leftX, sy);
      ctx.moveTo(rightX, Math.max(12, sy * 0.14));
      ctx.lineTo(rightX, sy);
      ctx.stroke();
      ctx.restore();

      if (theology === 'ascent' && !reducedMotion) {
        ctx.fillStyle = 'rgba(255, 247, 212, 0.38)';
        for (var m = 0; m < 18; m++) {
          var mu = LAKE_X_MIN + 0.03 + 0.60 * hashUnit(m * 97 + 13);
          var mv = ((hashUnit(m * 131 + 7) - skyAmbientPhase * (0.25 + 0.15 * (m % 3))) % 1 + 1) % 1;
          var mx = mu * w;
          var my = layout.topInset + mv * (sy - layout.topInset - 14);
          ctx.beginPath();
          ctx.arc(mx, my, 1.2 + (m % 2) * 0.6, 0, TWO_PI);
          ctx.fill();
        }
      }
    }

    function drawSurfaceHorizonArchitecture(ctx, layout, pal) {
      var w = layout.width;
      var sy = layout.surfaceY;
      var vScale = layout.vScale;
      var vpScale = layout.viewportScale;

      ctx.save();
      for (var d = 0; d < dryOutcrops.length; d++) {
        var oc = dryOutcrops[d];
        var ox = oc.xNorm * w;
        var ow = oc.wBase * vpScale;
        var oh = oc.hBase * vScale;

        ctx.fillStyle = pal.dryOutcropFill;
        ctx.strokeStyle = pal.dryOutcropStroke;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ox - ow * 0.5, sy);
        ctx.lineTo(ox - ow * 0.32 + oc.skew * ow * 0.2, sy - oh);
        ctx.lineTo(ox + ow * 0.22 + oc.skew * ow * 0.2, sy - oh * 0.78);
        ctx.lineTo(ox + ow * 0.5, sy);
        ctx.closePath();
        if (!pal.wireframeMode) ctx.fill();
        ctx.stroke();
      }

      for (var i = 0; i < houseTemplates.length; i++) {
        var h = houseTemplates[i];
        var hx = h.xNormCenter * w;
        var hw = Math.max(4, h.wNorm * w);
        var hh = h.hPxBase * vScale * 0.85;
        var peak = h.roofPeakPx * vScale * 0.85;
        var x0 = hx - hw * 0.5;
        var yWallTop = sy - hh;

        ctx.fillStyle = i % 2 === 0 ? pal.roofWall : pal.roofWallShade;
        ctx.strokeStyle = pal.frameBrace;
        ctx.lineWidth = 0.85;

        ctx.beginPath();
        ctx.rect(x0, yWallTop, hw, hh);
        if (!pal.wireframeMode) ctx.fill();
        ctx.stroke();

        ctx.fillStyle = pal.roofTile;
        ctx.beginPath();
        ctx.moveTo(x0 - 1.2, yWallTop);
        ctx.lineTo(hx, yWallTop - peak);
        ctx.lineTo(x0 + hw + 1.2, yWallTop);
        ctx.closePath();
        if (!pal.wireframeMode) ctx.fill();
        ctx.stroke();

        if (h.hasArch && hw > 6.5 && hh > 8) {
          var aw = Math.min(3.2, hw * 0.26);
          var ah = Math.min(5.8, hh * 0.42);
          ctx.fillStyle = pal.roofWindow;
          ctx.beginPath();
          ctx.moveTo(hx - aw * 0.5, sy - 2);
          ctx.lineTo(hx - aw * 0.5, sy - 2 - ah * 0.65);
          ctx.arc(hx, sy - 2 - ah * 0.65, aw * 0.5, Math.PI, 0);
          ctx.lineTo(hx + aw * 0.5, sy - 2);
          ctx.closePath();
          ctx.fill();
        }
      }

      var cairnXs = [LAKE_X_MIN * w, LAKE_X_MAX * w];
      for (var c = 0; c < cairnXs.length; c++) {
        var cx = cairnXs[c];
        var ch = 12 * vScale;
        var cw = 5 * vpScale;
        ctx.fillStyle = pal.masonryFill;
        ctx.strokeStyle = pal.masonryStroke;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(cx - cw * 0.6, sy);
        ctx.lineTo(cx - cw * 0.35, sy - ch);
        ctx.lineTo(cx + cw * 0.35, sy - ch);
        ctx.lineTo(cx + cw * 0.6, sy);
        ctx.closePath();
        if (!pal.wireframeMode) ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawAqueductArches(ctx, layout, pal, hoveredLocus, reducedMotion) {
      var list = layout.aqueducts;
      for (var i = 0; i < list.length; i++) {
        var aq = list[i];
        var x1 = aq.x1;
        var y1 = aq.y1;
        var x2 = aq.x2;
        var y2 = aq.y2;
        var dx = x2 - x1;
        var dy = y2 - y1;
        var spanLen = Math.sqrt(dx * dx + dy * dy);
        if (spanLen < 4) continue;

        var isHovered =
          hoveredLocus &&
          hoveredLocus.kind === 'aqueduct_arch' &&
          String(hoveredLocus.shaftId) === String(aq.shaftId);

        var numArches = clamp(Math.round(dx / Math.max(15, 25 * layout.uScale)), 2, 7);
        var archDepth = aq.archDepth;
        var specusH = Math.max(2.6, 3.6 * layout.vScale);

        ctx.save();
        if (pal.wireframeMode) {
          setDash(ctx, [3, 2]);
        }

        ctx.fillStyle = pal.aqueductStone;
        ctx.strokeStyle = isHovered ? pal.hoverStroke : pal.aqueductStroke;
        ctx.lineWidth = isHovered ? 1.8 : 1.1;

        ctx.beginPath();
        ctx.moveTo(x1, y1 - specusH);
        ctx.lineTo(x2, y2 - specusH);
        ctx.lineTo(x2, y2 + archDepth);

        for (var s = numArches - 1; s >= 0; s--) {
          var tRight = (s + 1) / numArches;
          var tLeft = s / numArches;
          var tMid = (s + 0.5) / numArches;
          var sxR = x1 + dx * tRight;
          var syR = y1 + dy * tRight;
          var sxL = x1 + dx * tLeft;
          var syL = y1 + dy * tLeft;
          var sxM = x1 + dx * tMid;
          var syM = y1 + dy * tMid;
          var pierW = Math.max(1.2, (dx / numArches) * 0.11);

          ctx.lineTo(sxR - pierW, syR + archDepth);
          ctx.quadraticCurveTo(sxM, syM + 0.8, sxL + pierW, syL + archDepth);
          ctx.lineTo(sxL, syL + archDepth);
        }

        ctx.closePath();
        if (!pal.wireframeMode) ctx.fill();
        ctx.stroke();
        setDash(ctx, []);

        if (aq.avgDrive > 0.02) {
          var flowAlpha = clamp(0.35 + aq.avgDrive * 0.65, 0.35, 1);
          ctx.save();
          ctx.globalAlpha = flowAlpha;
          ctx.strokeStyle = pal.waterBright;
          ctx.lineWidth = Math.max(1.6, specusH * 0.68);
          ctx.beginPath();
          ctx.moveTo(x1, y1 - specusH * 0.55);
          ctx.lineTo(x2, y2 - specusH * 0.55);
          ctx.stroke();

          if (!reducedMotion) {
            ctx.strokeStyle = pal.waterFoam;
            ctx.lineWidth = 1.1;
            setDash(ctx, [4, 7]);
            if (typeof ctx.lineDashOffset === 'number') {
              ctx.lineDashOffset = -(skyAmbientPhase * 90 * (0.4 + aq.avgDrive));
            }
            ctx.beginPath();
            ctx.moveTo(x1, y1 - specusH * 0.62);
            ctx.lineTo(x2, y2 - specusH * 0.62);
            ctx.stroke();
            setDash(ctx, []);
          }
          ctx.restore();
        }

        if (isHovered) {
          ctx.strokeStyle = pal.hoverStroke;
          ctx.lineWidth = 1.5;
          setDash(ctx, [3, 3]);
          ctx.strokeRect(
            x1 - 2,
            Math.min(y1, y2) - specusH - 4,
            dx + 4,
            Math.abs(dy) + archDepth + specusH + 8
          );
          setDash(ctx, []);
        }

        ctx.restore();
      }
    }

    function drawDryStub(ctx, ds, pal, hoveredLocus) {
      var rec = ds.rec;
      var x = ds.x;
      var sy = ds.baseY;
      var topY = ds.topY;
      var hw = ds.halfW;
      var isHovered =
        hoveredLocus &&
        hoveredLocus.kind === 'dry_limestone_stub' &&
        String(hoveredLocus.shaftId) === String(rec.id);

      ctx.save();

      ctx.fillStyle = pal.dryRigFill;
      ctx.strokeStyle = isHovered ? pal.hoverStroke : pal.dryRigStroke;
      ctx.lineWidth = isHovered ? 1.8 : 1.2;

      ctx.beginPath();
      ctx.moveTo(x - hw * 0.95, sy);
      ctx.quadraticCurveTo(x, sy - 5.5, x + hw * 0.95, sy);
      ctx.closePath();
      if (!pal.wireframeMode) ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x - hw * 0.78, sy - 1);
      ctx.lineTo(x - hw * 0.16, topY);
      ctx.lineTo(x + hw * 0.24, topY + 2);
      ctx.lineTo(x + hw * 0.82, sy - 1);
      ctx.moveTo(x - hw * 0.52, sy - (sy - topY) * 0.48);
      ctx.lineTo(x + hw * 0.54, sy - (sy - topY) * 0.44);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x + hw * 0.04, topY + 4, Math.max(2.5, hw * 0.24), 0, TWO_PI);
      ctx.stroke();

      ctx.strokeStyle = pal.dryRigStroke;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(x + hw * 0.04, topY + 6.5);
      if (rec.drillProgress < 0.999) {
        ctx.lineTo(x + hw * 0.04, sy);
      } else {
        ctx.quadraticCurveTo(x + hw * 0.36, (topY + sy) * 0.56, x + hw * 0.1, sy - 3);
      }
      ctx.stroke();

      if (rec.chalkBurstProgress > 0 && rec.chalkBurstProgress < 0.99) {
        var t = rec.chalkBurstProgress;
        ctx.save();
        ctx.globalAlpha = (1 - t) * 0.82;
        ctx.fillStyle = pal.chalkDust;
        for (var p = 0; p < rec.chalkPuffs.length; p++) {
          var pf = rec.chalkPuffs[p];
          var px = x + pf.vx * t;
          var py = sy - 2 + pf.vy * t;
          ctx.beginPath();
          ctx.arc(px, py, pf.r * (0.6 + t * 0.9), 0, TWO_PI);
          ctx.fill();
        }
        ctx.restore();
      }

      if (isHovered) {
        ctx.strokeStyle = pal.hoverStroke;
        ctx.fillStyle = pal.hoverFill;
        ctx.lineWidth = 1.4;
        var b = ds.hitBox;
        ctx.fillRect(b.x1, b.y1, b.x2 - b.x1, b.y2 - b.y1);
        ctx.strokeRect(b.x1, b.y1, b.x2 - b.x1, b.y2 - b.y1);
      }

      ctx.restore();
    }

    function drawHelicalRod(ctx, x, yTop, yBot, radius, phase, strokeStyle, lineWidth) {
      var len = yBot - yTop;
      if (len <= 2) return;
      ctx.save();
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(x, yTop);
      ctx.lineTo(x, yBot);
      ctx.stroke();

      ctx.lineWidth = Math.max(0.9, lineWidth * 0.82);
      ctx.beginPath();
      var steps = Math.max(8, Math.floor(len / 3));
      for (var i = 0; i <= steps; i++) {
        var frac = i / steps;
        var py = yTop + frac * len;
        var px = x + Math.sin(frac * 18 - phase) * radius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawCursorProbeTrestle(ctx, cr, pal, hoveredLocus, reducedMotion) {
      if (!cr) return;
      var cx = cr.cx;
      var sy = cr.baseY;
      var topY = cr.topY;
      var hw = cr.halfW;
      var h = sy - topY;
      var isHovered =
        hoveredLocus &&
        hoveredLocus.kind === 'probe_trestle' &&
        String(hoveredLocus.shaftId) === String(cr.shaftId);

      ctx.save();
      if (cr.nearExisting && !cr.activeDrilling && !isHovered) {
        ctx.globalAlpha = 0.45;
      }

      var accentColor = cr.insideContour ? pal.brassFill : pal.dryRigStroke;
      ctx.strokeStyle = isHovered ? pal.hoverStroke : pal.framePrimary;
      ctx.lineWidth = isHovered ? 1.9 : 1.35;

      ctx.fillStyle = pal.timberFill;
      ctx.fillRect(cx - hw * 1.08, sy - 3.2, hw * 2.16, 3.2);

      ctx.beginPath();
      ctx.moveTo(cx - hw * 0.92, sy - 3);
      ctx.lineTo(cx - hw * 0.22, topY);
      ctx.lineTo(cx + hw * 0.22, topY);
      ctx.lineTo(cx + hw * 0.92, sy - 3);
      ctx.stroke();

      ctx.strokeStyle = pal.frameBrace;
      ctx.lineWidth = 0.95;
      var tiers = 3;
      for (var t = 0; t < tiers; t++) {
        var f0 = t / tiers;
        var f1 = (t + 1) / tiers;
        var y0 = sy - 3 - f0 * (h - 3);
        var y1 = sy - 3 - f1 * (h - 3);
        var w0 = hw * (0.92 - 0.70 * f0);
        var w1 = hw * (0.92 - 0.70 * f1);
        ctx.beginPath();
        ctx.moveTo(cx - w0, y0);
        ctx.lineTo(cx + w1, y1);
        ctx.moveTo(cx + w0, y0);
        ctx.lineTo(cx - w1, y1);
        ctx.moveTo(cx - w1, y1);
        ctx.lineTo(cx + w1, y1);
        ctx.stroke();
      }

      ctx.fillStyle = accentColor;
      ctx.strokeStyle = pal.framePrimary;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(cx, topY + 2, Math.max(3, hw * 0.25), 0, TWO_PI);
      if (!pal.wireframeMode) ctx.fill();
      ctx.stroke();

      var augTop = topY + 6;
      var augBot = sy;
      drawHelicalRod(
        ctx,
        cx,
        augTop,
        augBot,
        Math.max(2.2, hw * 0.22),
        cursorRigState.twistAngle,
        cr.insideContour ? pal.copperRim : pal.dryRigStroke,
        1.25
      );

      if (cr.activeDrilling && !reducedMotion) {
        var sparkColor = cr.insideContour ? pal.waterBright : pal.chalkDust;
        ctx.fillStyle = sparkColor;
        for (var s = 0; s < 5; s++) {
          var sp = (cursorRigState.dustPhase + s * 0.2) % 1;
          var dir = s % 2 === 0 ? 1 : -1;
          var sx = cx + dir * (3 + sp * hw * 0.9);
          var syP = sy - 2 - Math.sin(sp * Math.PI) * (6 + (s % 3) * 3);
          ctx.beginPath();
          ctx.arc(sx, syP, 1.5 + (1 - sp) * 1.4, 0, TWO_PI);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    function drawWetTower(ctx, t, pal, hoveredLocus, reducedMotion) {
      var rec = t.rec;
      var sidStr = String(rec.id);
      var x = t.x;
      var sy = t.baseY;
      var u = t.uScale;
      var v = t.vScale;
      var res = t.reservoir;

      function locusHovered(kind) {
        return (
          Boolean(hoveredLocus) &&
          hoveredLocus.kind === kind &&
          String(hoveredLocus.shaftId) === sidStr
        );
      }

      ctx.save();

      /* 1. Slender Stilts & Cross-Braced Filigree Scaffold up to Stilted Reservoir */
      var stiltBotW = res.halfW * 1.06;
      var stiltTopW = res.halfW * 0.84;
      ctx.strokeStyle = pal.frameSecondary;
      ctx.lineWidth = Math.max(0.95, 1.25 * u);
      if (pal.wireframeMode) setDash(ctx, [4, 2]);
      ctx.beginPath();
      ctx.moveTo(x - stiltBotW, sy - t.curbH);
      ctx.lineTo(x - stiltTopW, res.botY);
      ctx.moveTo(x + stiltBotW, sy - t.curbH);
      ctx.lineTo(x + stiltTopW, res.botY);
      ctx.moveTo(x - stiltBotW * 0.48, sy - t.curbH);
      ctx.lineTo(x - stiltTopW * 0.44, res.botY);
      ctx.moveTo(x + stiltBotW * 0.48, sy - t.curbH);
      ctx.lineTo(x + stiltTopW * 0.44, res.botY);
      ctx.stroke();
      setDash(ctx, []);

      ctx.strokeStyle = pal.frameBrace;
      ctx.lineWidth = 0.78;
      var bays = 5;
      var baySpanY = sy - t.curbH - res.botY;
      ctx.beginPath();
      for (var b = 0; b < bays; b++) {
        var f0 = b / bays;
        var f1 = (b + 1) / bays;
        var y0 = sy - t.curbH - f0 * baySpanY;
        var y1 = sy - t.curbH - f1 * baySpanY;
        var w0 = stiltBotW + (stiltTopW - stiltBotW) * f0;
        var w1 = stiltBotW + (stiltTopW - stiltBotW) * f1;
        ctx.moveTo(x - w0, y0);
        ctx.lineTo(x + w1, y1);
        ctx.moveTo(x + w0, y0);
        ctx.lineTo(x - w1, y1);
        ctx.moveTo(x - w1, y1);
        ctx.lineTo(x + w1, y1);
      }
      ctx.stroke();

      /* 2. Water Columns, Vertical Riser Pipes, Reciprocating Brass Plungers & Overflow Drains */
      var col = t.column;
      var colHov = locusHovered('water_columns_plungers_drains');
      var pipeH = col.botY - col.topY;
      var pipeHalfW = Math.max(2.0, 2.9 * u);

      ctx.fillStyle = pal.glassFill;
      ctx.strokeStyle = colHov ? pal.hoverStroke : pal.glassStroke;
      ctx.lineWidth = colHov ? 1.7 : 1.05;
      ctx.fillRect(col.pipeX - pipeHalfW, col.topY, pipeHalfW * 2, pipeH);
      ctx.strokeRect(col.pipeX - pipeHalfW, col.topY, pipeHalfW * 2, pipeH);

      if (rec.waterColumnSurge > 0.01) {
        var surgeFrac = clamp(0.28 + 0.72 * rec.waterColumnSurge, 0, 1);
        var waterH = pipeH * surgeFrac;
        var waterTopY = col.botY - waterH;
        var colGrad = makeLinearGrad(
          ctx,
          col.pipeX,
          col.botY,
          col.pipeX,
          waterTopY,
          [
            [0, pal.waterDeep],
            [0.72, pal.waterBright],
            [1, pal.waterFoam]
          ],
          pal.waterBright
        );
        ctx.fillStyle = colGrad;
        ctx.fillRect(
          col.pipeX - pipeHalfW + 0.7,
          waterTopY,
          Math.max(1.2, pipeHalfW * 2 - 1.4),
          waterH
        );

        if (!reducedMotion && rec.effectiveDrive > 0.04) {
          ctx.fillStyle = pal.waterFoam;
          for (var pb = 0; pb < 4; pb++) {
            var pf = (rec.columnPulsePhase + pb * 0.25) % 1;
            var beadY = col.botY - pf * waterH;
            ctx.beginPath();
            ctx.arc(col.pipeX, beadY, Math.max(1.0, pipeHalfW * 0.48), 0, TWO_PI);
            ctx.fill();
          }
        }
      }

      var cylH = Math.max(8, 12 * v);
      var cylHalfW = pipeHalfW * 1.45;
      ctx.strokeStyle = colHov ? pal.hoverStroke : pal.framePrimary;
      ctx.lineWidth = 1.0;
      ctx.strokeRect(col.pipeX - cylHalfW, col.plungerY - cylH * 0.5, cylHalfW * 2, cylH);

      var pistY = col.plungerY + (0.5 - rec.plungerPos) * (cylH * 0.58);
      ctx.fillStyle = pal.brassFill;
      ctx.fillRect(col.pipeX - cylHalfW + 0.8, pistY - 2.2, cylHalfW * 2 - 1.6, 4.4);
      ctx.strokeStyle = pal.brassBright;
      ctx.beginPath();
      ctx.moveTo(col.pipeX, pistY - 2.2);
      ctx.lineTo(col.pipeX, pistY - cylH * 0.82);
      ctx.stroke();

      var drainStartX = x - t.side * res.halfW * 0.82;
      var drainStartY = res.botY - 2.5 * v;
      var drainEndY = col.plungerY + 14 * v;
      ctx.strokeStyle = colHov ? pal.hoverStroke : pal.copperFill;
      ctx.lineWidth = Math.max(1.0, 1.3 * u);
      ctx.beginPath();
      ctx.moveTo(drainStartX, drainStartY);
      ctx.quadraticCurveTo(col.drainX, drainStartY + 4 * v, col.drainX, drainStartY + 10 * v);
      ctx.stroke();

      if (rec.effectiveDrive > 0.08 && rec.reservoirFill > 0.2) {
        ctx.save();
        ctx.strokeStyle = pal.waterBright;
        ctx.lineWidth = Math.max(1.0, 1.35 * u);
        if (!reducedMotion) {
          setDash(ctx, [3, 3]);
          if (typeof ctx.lineDashOffset === 'number') {
            ctx.lineDashOffset = -(rec.columnPulsePhase * 24);
          }
        }
        ctx.beginPath();
        ctx.moveTo(col.drainX, drainStartY + 10 * v);
        ctx.lineTo(col.drainX, drainEndY);
        ctx.stroke();
        setDash(ctx, []);
        ctx.restore();
      }

      /* 3. Specialized Mid-Tier Assembly (Variant 0: Noria, Variant 1: Windmill, Variant 2: Probe Trestle) */
      if (t.noria) {
        var nr = t.noria;
        var norHov = locusHovered('noria_windlass');
        ctx.save();
        ctx.strokeStyle = norHov ? pal.hoverStroke : pal.framePrimary;
        ctx.lineWidth = norHov ? 1.7 : 1.15;

        ctx.fillStyle = pal.timberFill;
        ctx.beginPath();
        ctx.arc(nr.cx, nr.topY, nr.r, 0, TWO_PI);
        if (!pal.wireframeMode) ctx.fill();
        ctx.stroke();

        var drumAng = rec.noriaPhase * TWO_PI;
        for (var sp = 0; sp < 6; sp++) {
          var a = drumAng + (sp * Math.PI) / 3;
          ctx.beginPath();
          ctx.moveTo(nr.cx, nr.topY);
          ctx.lineTo(nr.cx + Math.cos(a) * nr.r, nr.topY + Math.sin(a) * nr.r);
          ctx.stroke();
        }

        var botR = nr.r * 0.68;
        ctx.beginPath();
        ctx.arc(nr.cx, nr.botY, botR, 0, TWO_PI);
        ctx.stroke();

        ctx.strokeStyle = pal.cableStroke;
        ctx.lineWidth = 0.95;
        ctx.beginPath();
        ctx.moveTo(nr.cx - nr.r, nr.topY);
        ctx.lineTo(nr.cx - botR, nr.botY);
        ctx.moveTo(nr.cx + nr.r, nr.topY);
        ctx.lineTo(nr.cx + botR, nr.botY);
        ctx.stroke();

        var cupCount = 10;
        var loopH = nr.botY - nr.topY;
        for (var cIdx = 0; cIdx < cupCount; cIdx++) {
          var uLoop = (rec.noriaPhase + cIdx / cupCount) % 1;
          var cxCup = 0;
          var cyCup = 0;
          var cupFull = false;
          if (uLoop < 0.42) {
            var fUp = uLoop / 0.42;
            cxCup = nr.cx - botR - (nr.r - botR) * fUp;
            cyCup = nr.botY - fUp * loopH;
            cupFull = rec.effectiveDrive > 0.02;
          } else if (uLoop < 0.58) {
            var fTop = (uLoop - 0.42) / 0.16;
            var angTop = Math.PI + fTop * Math.PI;
            cxCup = nr.cx + Math.cos(angTop) * nr.r;
            cyCup = nr.topY + Math.sin(angTop) * nr.r;
            cupFull = fTop < 0.55 && rec.effectiveDrive > 0.02;
          } else if (uLoop < 0.92) {
            var fDn = (uLoop - 0.58) / 0.34;
            cxCup = nr.cx + nr.r - (nr.r - botR) * fDn;
            cyCup = nr.topY + fDn * loopH;
            cupFull = false;
          } else {
            var fBot = (uLoop - 0.92) / 0.08;
            var angBot = fBot * Math.PI;
            cxCup = nr.cx + Math.cos(angBot) * botR;
            cyCup = nr.botY + Math.sin(angBot) * botR;
            cupFull = false;
          }

          var cw = Math.max(2.4, 3.4 * u);
          var ch = Math.max(2.8, 3.8 * v);
          ctx.fillStyle = cupFull ? pal.waterBright : pal.copperFill;
          ctx.strokeStyle = pal.framePrimary;
          ctx.lineWidth = 0.8;
          ctx.fillRect(cxCup - cw * 0.5, cyCup - ch * 0.5, cw, ch);
          ctx.strokeRect(cxCup - cw * 0.5, cyCup - ch * 0.5, cw, ch);
        }

        ctx.strokeStyle = pal.timberFill;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(nr.cx, nr.topY + 2);
        ctx.lineTo(col.pipeX, nr.topY + 6);
        ctx.stroke();

        ctx.restore();
      } else if (t.windmill) {
        var ml = t.windmill;
        var millHov = locusHovered('windmill_blades');
        ctx.save();

        ctx.strokeStyle = pal.framePrimary;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(x, ml.cy + 4 * v);
        ctx.lineTo(ml.cx, ml.cy);
        ctx.lineTo(x, ml.cy - 5 * v);
        ctx.stroke();

        var crankX = ml.cx + Math.cos(rec.windmillAngle) * 3.2 * u;
        var crankY = ml.cy + Math.sin(rec.windmillAngle) * 3.2 * v;
        ctx.strokeStyle = pal.cableStroke;
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(crankX, crankY);
        ctx.lineTo(t.pump.pivotX, t.pump.pivotY);
        ctx.stroke();

        var sails = 8;
        for (var sIdx = 0; sIdx < sails; sIdx++) {
          var sa = rec.windmillAngle + (sIdx * TWO_PI) / sails;
          var cosA = Math.cos(sa);
          var sinA = Math.sin(sa);
          var tipX = ml.cx + cosA * ml.r;
          var tipY = ml.cy + sinA * ml.r;
          var rootX = ml.cx + cosA * (ml.r * 0.22);
          var rootY = ml.cy + sinA * (ml.r * 0.22);
          var perpX = -sinA * (ml.r * 0.24);
          var perpY = cosA * (ml.r * 0.24);

          ctx.fillStyle = pal.sailFill;
          ctx.strokeStyle = millHov ? pal.hoverStroke : pal.sailStroke;
          ctx.lineWidth = millHov ? 1.45 : 0.95;

          ctx.beginPath();
          ctx.moveTo(rootX, rootY);
          ctx.lineTo(tipX, tipY);
          ctx.lineTo(tipX + perpX, tipY + perpY);
          ctx.lineTo(rootX + perpX * 0.55, rootY + perpY * 0.55);
          ctx.closePath();
          if (!pal.wireframeMode) ctx.fill();
          ctx.stroke();
        }

        ctx.fillStyle = pal.brassFill;
        ctx.strokeStyle = pal.framePrimary;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(ml.cx, ml.cy, Math.max(2.6, 3.8 * u), 0, TWO_PI);
        if (!pal.wireframeMode) ctx.fill();
        ctx.stroke();

        ctx.restore();
      } else if (t.trestle) {
        var tr = t.trestle;
        var trHov = locusHovered('probe_trestle');
        ctx.save();
        ctx.strokeStyle = trHov ? pal.hoverStroke : pal.framePrimary;
        ctx.lineWidth = trHov ? 1.7 : 1.25;

        ctx.beginPath();
        ctx.moveTo(tr.cx - tr.halfW, tr.botY);
        ctx.lineTo(tr.cx - tr.halfW * 0.45, tr.topY);
        ctx.lineTo(tr.cx + tr.halfW * 0.45, tr.topY);
        ctx.lineTo(tr.cx + tr.halfW, tr.botY);
        ctx.moveTo(tr.cx - tr.halfW * 0.85, (tr.topY + tr.botY) * 0.5);
        ctx.lineTo(tr.cx + tr.halfW * 0.85, (tr.topY + tr.botY) * 0.5);
        ctx.stroke();

        drawHelicalRod(
          ctx,
          tr.cx,
          tr.topY + 2,
          tr.botY + 6 * v,
          Math.max(2.0, tr.halfW * 0.25),
          rec.probeTwistAngle,
          trHov ? pal.hoverStroke : pal.brassFill,
          1.3
        );
        ctx.restore();
      }

      /* 4. Overhead Revolving Pulley */
      var pul = t.pulley;
      var pulHov = locusHovered('revolving_pulley');
      ctx.save();
      ctx.strokeStyle = pal.framePrimary;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(x - stiltBotW * 0.78, pul.cy - pul.r - 2.5);
      ctx.lineTo(x + stiltBotW * 0.78, pul.cy - pul.r - 2.5);
      ctx.moveTo(pul.cx, pul.cy - pul.r - 2.5);
      ctx.lineTo(pul.cx, pul.cy);
      ctx.stroke();

      ctx.strokeStyle = pulHov ? pal.hoverStroke : pal.brassFill;
      ctx.lineWidth = pulHov ? 1.85 : 1.35;
      ctx.beginPath();
      ctx.arc(pul.cx, pul.cy, pul.r, 0, TWO_PI);
      ctx.stroke();

      for (var pSp = 0; pSp < 6; pSp++) {
        var pa = rec.pulleyAngle + (pSp * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(pul.cx, pul.cy);
        ctx.lineTo(pul.cx + Math.cos(pa) * pul.r, pul.cy + Math.sin(pa) * pul.r);
        ctx.stroke();
      }

      ctx.fillStyle = pal.framePrimary;
      ctx.beginPath();
      ctx.arc(pul.cx, pul.cy, Math.max(1.5, pul.r * 0.22), 0, TWO_PI);
      ctx.fill();
      ctx.restore();

      /* 5. Well-Curb, Cable & Rising Suspended Bucket */
      var bkt = t.bucket;
      var bktHov = locusHovered('suspended_bucket');

      ctx.strokeStyle = pal.cableStroke;
      ctx.lineWidth = 1.05;
      ctx.beginPath();
      ctx.moveTo(pul.cx - t.side * pul.r * 0.65, pul.cy);
      ctx.lineTo(bkt.cx, bkt.cy - bkt.h * 0.55);
      ctx.moveTo(pul.cx + t.side * pul.r * 0.65, pul.cy);
      ctx.lineTo(pul.cx + t.side * pul.r * 0.65, sy - t.curbH);
      ctx.stroke();

      ctx.save();
      ctx.translate(bkt.cx, bkt.cy);
      ctx.rotate(t.side * bkt.tip * 0.52);

      var bwTop = bkt.w * 0.54;
      var bwBot = bkt.w * 0.40;
      var bhHalf = bkt.h * 0.46;

      ctx.strokeStyle = bktHov ? pal.hoverStroke : pal.framePrimary;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(0, -bhHalf, bwTop * 0.88, Math.PI, 0);
      ctx.stroke();

      ctx.fillStyle = pal.copperFill;
      ctx.strokeStyle = bktHov ? pal.hoverStroke : pal.framePrimary;
      ctx.lineWidth = bktHov ? 1.7 : 1.05;
      ctx.beginPath();
      ctx.moveTo(-bwTop, -bhHalf);
      ctx.lineTo(bwTop, -bhHalf);
      ctx.lineTo(bwBot, bhHalf);
      ctx.lineTo(-bwBot, bhHalf);
      ctx.closePath();
      if (!pal.wireframeMode) ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = pal.brassBright;
      ctx.lineWidth = 0.85;
      ctx.beginPath();
      ctx.moveTo(-bwTop * 0.92, -bhHalf * 0.2);
      ctx.lineTo(bwTop * 0.92, -bhHalf * 0.2);
      ctx.moveTo(-bwBot * 1.04, bhHalf * 0.45);
      ctx.lineTo(bwBot * 1.04, bhHalf * 0.45);
      ctx.stroke();

      if (rec.effectiveDrive > 0.02) {
        ctx.fillStyle = pal.waterBright;
        ctx.beginPath();
        drawEllipsePath(ctx, 0, -bhHalf, bwTop * 0.9, Math.max(1.4, bhHalf * 0.28));
        ctx.fill();
      }
      ctx.restore();

      if (rec.effectiveDrive > 0.06 && !reducedMotion) {
        ctx.fillStyle = pal.waterBright;
        for (var dr = 0; dr < 2; dr++) {
          var dropFrac = ((rec.bucketPhase * 3.5 + dr * 0.5) % 1);
          var dropY = bkt.cy + bkt.h * 0.52 + dropFrac * Math.max(4, sy - t.curbH - bkt.cy);
          if (dropY < sy - t.curbH) {
            ctx.beginPath();
            ctx.arc(bkt.cx + (dr === 0 ? -1.5 : 1.5), dropY, 1.25, 0, TWO_PI);
            ctx.fill();
          }
        }
      }

      /* Masonry Well-Curb at surfaceY */
      ctx.fillStyle = pal.masonryFill;
      ctx.strokeStyle = pal.masonryStroke;
      ctx.lineWidth = 1.15;
      ctx.fillRect(x - t.curbW * 0.5, sy - t.curbH, t.curbW, t.curbH);
      ctx.strokeRect(x - t.curbW * 0.5, sy - t.curbH, t.curbW, t.curbH);
      ctx.fillStyle = pal.masonryStroke;
      ctx.fillRect(x - t.curbW * 0.58, sy - t.curbH - 2, t.curbW * 1.16, 2.2);

      /* 6. Reciprocating Pump Handle / Walking-Beam */
      var pmp = t.pump;
      var pmpHov = locusHovered('pump_handle');
      ctx.save();
      ctx.strokeStyle = pmpHov ? pal.hoverStroke : pal.framePrimary;
      ctx.lineWidth = pmpHov ? 1.8 : 1.25;

      ctx.beginPath();
      ctx.moveTo(pmp.pivotX - 3.2 * u, sy);
      ctx.lineTo(pmp.pivotX, pmp.pivotY);
      ctx.lineTo(pmp.pivotX + 3.2 * u, sy);
      ctx.stroke();

      var rockAng = rec.pumpStroke * 0.36;
      ctx.save();
      ctx.translate(pmp.pivotX, pmp.pivotY);
      ctx.rotate(rockAng);

      if (pmp.isBeam) {
        ctx.lineWidth = pmpHov ? 2.2 : 1.85;
        ctx.beginPath();
        ctx.moveTo(-pmp.armLen * 0.85, 0);
        ctx.lineTo(pmp.armLen * 0.85, 0);
        ctx.stroke();
        ctx.fillStyle = pal.copperFill;
        ctx.fillRect(-pmp.armLen * 0.92, -2.5, 4.5 * u, 5);
      } else {
        ctx.lineWidth = pmpHov ? 2.0 : 1.55;
        ctx.beginPath();
        ctx.moveTo(-pmp.armLen * 0.38 * pmp.side, 0);
        ctx.quadraticCurveTo(
          pmp.armLen * 0.45 * pmp.side,
          -2.2,
          pmp.armLen * 0.95 * pmp.side,
          3.2
        );
        ctx.stroke();
        ctx.fillStyle = pal.brassFill;
        ctx.beginPath();
        ctx.arc(pmp.armLen * 0.95 * pmp.side, 3.2, 2.1, 0, TWO_PI);
        ctx.fill();
      }
      ctx.restore();

      var rodAttachX = pmp.pivotX - pmp.side * pmp.armLen * 0.36;
      var rodAttachY =
        pmp.pivotY - Math.sin(rockAng) * pmp.side * pmp.armLen * 0.36;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(rodAttachX, rodAttachY);
      ctx.lineTo(rodAttachX, sy);
      ctx.stroke();
      ctx.restore();

      /* 7. Stilted Roof Reservoir */
      var resHov = locusHovered('stilted_reservoir');
      var resW = res.halfW * 2;
      var resH = res.botY - res.topY;

      ctx.save();
      ctx.fillStyle = pal.timberFill;
      ctx.strokeStyle = resHov ? pal.hoverStroke : pal.framePrimary;
      ctx.lineWidth = resHov ? 1.85 : 1.2;

      ctx.fillRect(res.cx - res.halfW, res.topY, resW, resH);
      ctx.strokeRect(res.cx - res.halfW, res.topY, resW, resH);

      ctx.strokeStyle = pal.copperRim;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(res.cx - res.halfW, res.topY + resH * 0.28);
      ctx.lineTo(res.cx + res.halfW, res.topY + resH * 0.28);
      ctx.moveTo(res.cx - res.halfW, res.topY + resH * 0.70);
      ctx.lineTo(res.cx + res.halfW, res.topY + resH * 0.70);
      ctx.stroke();

      var gaugeW = Math.max(3.2, resW * 0.24);
      var gaugeH = Math.max(4, resH * 0.68);
      var gaugeX = res.cx - gaugeW * 0.5;
      var gaugeY = res.botY - 2 - gaugeH;
      ctx.fillStyle = pal.glassFill;
      ctx.fillRect(gaugeX, gaugeY, gaugeW, gaugeH);
      if (rec.reservoirFill > 0.02) {
        var fillH = gaugeH * clamp(rec.reservoirFill, 0, 1);
        ctx.fillStyle = pal.waterBright;
        ctx.fillRect(gaugeX, gaugeY + gaugeH - fillH, gaugeW, fillH);
      }
      ctx.strokeStyle = pal.framePrimary;
      ctx.lineWidth = 0.8;
      ctx.strokeRect(gaugeX, gaugeY, gaugeW, gaugeH);

      var roofPeakY = res.topY - Math.max(4.5, 6.8 * v);
      ctx.fillStyle = pal.copperFill;
      ctx.strokeStyle = resHov ? pal.hoverStroke : pal.framePrimary;
      ctx.lineWidth = resHov ? 1.6 : 1.05;
      ctx.beginPath();
      ctx.moveTo(res.cx - res.halfW * 1.14, res.topY);
      ctx.lineTo(res.cx, roofPeakY);
      ctx.lineTo(res.cx + res.halfW * 1.14, res.topY);
      ctx.closePath();
      if (!pal.wireframeMode) ctx.fill();
      ctx.stroke();
      ctx.restore();

      /* 8. Crowning Airy Weathercock */
      var wc = t.weathercock;
      var wcHov = locusHovered('airy_weathercock');
      ctx.save();
      ctx.strokeStyle = wcHov ? pal.hoverStroke : pal.weathercockStroke;
      ctx.lineWidth = wcHov ? 1.7 : 1.1;

      ctx.beginPath();
      ctx.moveTo(wc.cx, wc.spireBotY);
      ctx.lineTo(wc.cx, wc.spireTopY - 2);
      ctx.moveTo(wc.cx - wc.r * 0.72, wc.cy + wc.r * 0.38);
      ctx.lineTo(wc.cx + wc.r * 0.72, wc.cy + wc.r * 0.38);
      ctx.stroke();

      ctx.fillStyle = pal.brassBright;
      ctx.beginPath();
      ctx.arc(wc.cx, wc.cy + wc.r * 0.38, Math.max(1.5, wc.r * 0.16), 0, TWO_PI);
      ctx.fill();

      var spinCos = Math.cos(rec.weathercockAngle);
      var projScale = Math.abs(spinCos) < 0.14 ? (spinCos >= 0 ? 0.14 : -0.14) : spinCos;

      ctx.save();
      ctx.translate(wc.cx, wc.cy - wc.r * 0.15);
      ctx.scale(projScale, 1);

      ctx.fillStyle = pal.weathercockFill;
      ctx.strokeStyle = wcHov ? pal.hoverStroke : pal.weathercockStroke;
      ctx.lineWidth = 0.95 / Math.max(0.35, Math.abs(projScale));

      ctx.beginPath();
      ctx.moveTo(wc.r * 0.95, 0);
      ctx.lineTo(wc.r * 0.35, -wc.r * 0.28);
      ctx.lineTo(wc.r * 0.18, -wc.r * 0.56);
      ctx.lineTo(-wc.r * 0.15, -wc.r * 0.18);
      ctx.quadraticCurveTo(-wc.r * 0.78, -wc.r * 0.68, -wc.r * 0.95, -wc.r * 0.12);
      ctx.quadraticCurveTo(-wc.r * 0.62, wc.r * 0.28, wc.r * 0.25, wc.r * 0.16);
      ctx.closePath();
      if (!pal.wireframeMode) ctx.fill();
      ctx.stroke();
      ctx.restore();

      if (rec.effectiveDrive > 0.6 && !reducedMotion) {
        ctx.strokeStyle = pal.brassBright;
        ctx.globalAlpha = clamp((rec.effectiveDrive - 0.6) * 0.9, 0.15, 0.55);
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        drawEllipsePath(ctx, wc.cx, wc.cy - wc.r * 0.12, wc.r * 1.02, wc.r * 0.26);
        ctx.stroke();
      }

      if (wcHov) {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = pal.hoverStroke;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(wc.cx, wc.cy, wc.r + 4, 0, TWO_PI);
        ctx.stroke();
      }
      ctx.restore();

      ctx.restore();
    }

    function render(ctx, viewport, state) {
      if (!ctx || !viewport) return;
      var st = state || {};
      if (Array.isArray(st.shafts)) {
        syncShafts(st.shafts);
      }

      var theology =
        st.theology === 'ascent' || st.theology === 'depths' || st.theology === 'schism'
          ? st.theology
          : 'schism';
      var pal = PALETTES[theology];
      var reducedMotion = Boolean(st.reducedMotion);
      var hovered = st.hoveredLocus || null;

      var layout = computeSceneLayout(viewport, st);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, layout.width, layout.surfaceY + 2);
      ctx.clip();

      drawSkyBackdrop(ctx, layout, pal, theology, reducedMotion);
      drawSurfaceHorizonArchitecture(ctx, layout, pal);

      if (layout.cursorRig && !layout.cursorRig.activeDrilling) {
        drawCursorProbeTrestle(ctx, layout.cursorRig, pal, hovered, reducedMotion);
      }

      drawAqueductArches(ctx, layout, pal, hovered, reducedMotion);

      for (var d = 0; d < layout.dryStubs.length; d++) {
        drawDryStub(ctx, layout.dryStubs[d], pal, hovered);
      }

      for (var w = 0; w < layout.wetTowers.length; w++) {
        drawWetTower(ctx, layout.wetTowers[w], pal, hovered, reducedMotion);
      }

      if (layout.cursorRig && layout.cursorRig.activeDrilling) {
        drawCursorProbeTrestle(ctx, layout.cursorRig, pal, hovered, reducedMotion);
      }

      ctx.restore();
    }

    function getDiagnostics(viewport, state) {
      var layout = computeSceneLayout(
        viewport || { width: 1280, height: 800, surfaceY: 384, dpr: 1 },
        state || {}
      );
      return {
        wetTowerCount: layout.wetTowers.length,
        dryStubCount: layout.dryStubs.length,
        aqueductCount: layout.aqueducts.length,
        hasCursorRig: Boolean(layout.cursorRig)
      };
    }

    return {
      syncShafts: syncShafts,
      step: step,
      inspectAt: inspectAt,
      render: render,
      getDiagnostics: getDiagnostics
    };
  }

  globalThis.IsauraUpwardApparatus = {
    createUpwardApparatus: createUpwardApparatus
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = globalThis.IsauraUpwardApparatus;
  }
})();
