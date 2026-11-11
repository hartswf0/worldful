(function (root) {
  'use strict';

  /* Lithic palette from City 42 charter */
  var PALETTE = Object.freeze({
    abyssal_crust: '#14110e',
    damp_black_clay: '#211b16',
    umber_loam: '#3d2d20',
    ochre_clay_pack: '#7c5836',
    sienna_stratum: '#9e7348',
    limestone_ashlar: '#8a857c',
    pale_root_tendril: '#c8b89a',
    barren_scree_day: '#d6c8ae',
    parchment_sky_day: '#ede3ce',
    stony_night_sky: '#0d1017',
    seismic_amber_pulse: '#d4944a',
    ink_etching: '#1a1612'
  });

  /* Four canonical stones of subterranean Argia */
  var CANONICAL_STONES = Object.freeze([
    Object.freeze({
      id: 'earth_instead_of_air',
      number: 1,
      label: 'Earth Instead of Air',
      axiom: 'What makes Argia different from other cities is that it has earth instead of air. The streets are completely filled with dirt, clay packs the rooms to the ceiling.',
      causal_invariant: 'airFraction === 0 && packedEarthFraction === 1.0',
      causalInvariant: 'airFraction === 0 && packedEarthFraction === 1.0'
    }),
    Object.freeze({
      id: 'negative_stairways_and_rocky_skies',
      number: 2,
      label: 'Negative Stairways & Rocky Cloud Strata',
      axiom: 'On every stairway another stairway is set in negative, over the roofs of the houses hang layers of rocky terrain like skies with clouds.',
      causal_invariant: "negativeStairCount >= 5 && overburdenSky === 'rocky_terrain_clouds'",
      causalInvariant: "negativeStairCount >= 5 && overburdenSky === 'rocky_terrain_clouds'"
    }),
    Object.freeze({
      id: 'worm_tunnels_and_prone_stillness',
      number: 3,
      label: 'Root Crevices, Worm Tunnels & Prone Stillness',
      axiom: "Worm tunnels and crevices where roots twist pierce the black, damp crust; dampness destroys people's bodies and leaves scant strength, so everyone remains still, prone, in the dark.",
      causal_invariant: "wormTunnelCount > 0 && rootCreviceCount > 0 && inhabitantPosture === 'still_and_prone'",
      causalInvariant: "wormTunnelCount > 0 && rootCreviceCount > 0 && inhabitantPosture === 'still_and_prone'"
    }),
    Object.freeze({
      id: 'barren_ground_and_night_door_slam',
      number: 4,
      label: 'Deserted Stony Ground & Nocturnal Door Slam',
      axiom: 'From up above, nothing of Argia can be seen; the place is deserted. At night, putting your ear to the ground, you can sometimes hear a door slam.',
      causal_invariant: 'surfaceVisibility === 0 && (heardAtSurface === true implies earPressedAtNight === true)',
      causalInvariant: 'surfaceVisibility === 0 && (heardAtSurface === true implies earPressedAtNight === true)'
    })
  ]);

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hexToRgb(hex) {
    var clean = String(hex || '#000000').replace('#', '');
    var num = parseInt(clean, 16);
    if (isNaN(num)) {
      return { r: 20, g: 17, b: 14 };
    }
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function mixHex(hexA, hexB, t) {
    var k = clamp(t, 0, 1);
    var a = hexToRgb(hexA);
    var b = hexToRgb(hexB);
    var r = Math.round(lerp(a.r, b.r, k));
    var g = Math.round(lerp(a.g, b.g, k));
    var bl = Math.round(lerp(a.b, b.b, k));
    return 'rgb(' + r + ',' + g + ',' + bl + ')';
  }

  function rgba(hex, alpha) {
    var c = hexToRgb(hex);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + clamp(alpha, 0, 1).toFixed(3) + ')';
  }

  function makeRng(seed) {
    var s = (seed >>> 0) || 420804;
    return function next() {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function distToSegment(px, py, x1, y1, x2, y2) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    var lenSq = dx * dx + dy * dy;
    if (lenSq <= 1e-9) {
      return Math.hypot(px - x1, py - y1);
    }
    var t = clamp(((px - x1) * dx + (py - y1) * dy) / lenSq, 0, 1);
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  function cutawaySurfaceY(nx) {
    return 0.156 + 0.008 * Math.sin(nx * 9.2 + 0.6) + 0.004 * Math.cos(nx * 21.5);
  }

  function barrenPlateauY(nx) {
    return 0.452 + 0.014 * Math.sin(nx * 6.4 + 0.9) + 0.005 * Math.cos(nx * 17.0);
  }

  function buildLithicBlueprint() {
    var rng = makeRng(421972);

    var rockyClouds = [
      { id: 'cloud_west_shale', title: 'Western Shale Cloud Bank', cx: 0.17, cy: 0.245, rx: 0.145, ry: 0.044, depthMeters: 9 },
      { id: 'cloud_midwest_chert', title: 'Lenticular Chert Overburden', cx: 0.36, cy: 0.228, rx: 0.125, ry: 0.038, depthMeters: 8 },
      { id: 'cloud_central_cumulus', title: 'Conglomerate Storm-Stratum', cx: 0.51, cy: 0.238, rx: 0.165, ry: 0.045, depthMeters: 10 },
      { id: 'cloud_mideast_marl', title: 'Banded Marl Cloud-Vault', cx: 0.69, cy: 0.232, rx: 0.130, ry: 0.039, depthMeters: 9 },
      { id: 'cloud_east_breccia', title: 'Eastern Breccia Anvil', cx: 0.84, cy: 0.248, rx: 0.135, ry: 0.043, depthMeters: 11 }
    ];

    var clayChambers = [
      { id: 'chamber_west_gable', title: 'Gabled House of Laminated Clay', x: 0.055, y: 0.325, w: 0.215, h: 0.175, roof: 'gable', coffers: 4, depthMeters: 16 },
      { id: 'chamber_central_atrium', title: 'Coffered Atrium Packed to the Soffit', x: 0.365, y: 0.305, w: 0.255, h: 0.195, roof: 'vault', coffers: 6, depthMeters: 18 },
      { id: 'chamber_east_house', title: 'Eastern Stone Domus Under Rock-Clouds', x: 0.705, y: 0.330, w: 0.235, h: 0.170, roof: 'gable', coffers: 4, depthMeters: 17 },
      { id: 'chamber_lower_west_crypt', title: 'Western Barrel-Vaulted Hypogeum', x: 0.065, y: 0.640, w: 0.235, h: 0.205, roof: 'vault', coffers: 5, depthMeters: 35 },
      { id: 'chamber_deep_basilica', title: 'Subterranean Basilica of Solid Loam', x: 0.380, y: 0.645, w: 0.265, h: 0.205, roof: 'vault', coffers: 6, depthMeters: 40 },
      { id: 'chamber_abyssal_cellar', title: 'Abyssal Ashlar Cellar Choked with Clay', x: 0.715, y: 0.655, w: 0.220, h: 0.195, roof: 'vault', coffers: 4, depthMeters: 44 }
    ];

    var packedStreets = [
      { id: 'street_upper_via', title: 'Upper Tuscan Colonnade Choked with Dirt', x: 0.050, y: 0.520, w: 0.895, h: 0.086, cols: 10, depthMeters: 26 },
      { id: 'street_west_portico', title: 'Portico Alley Packed Solid Between Walls', x: 0.282, y: 0.330, w: 0.072, h: 0.178, cols: 3, depthMeters: 20 },
      { id: 'street_lower_forum', title: 'Deep Doric Via Tecta Filled with Silt', x: 0.055, y: 0.865, w: 0.885, h: 0.082, cols: 11, depthMeters: 49 }
    ];

    var negativeStairs = [
      { id: 'stair_west_descent', title: 'Western Flight & Cast-Clay Negative Counterpart', kind: 'straight', x1: 0.095, y1: 0.505, x2: 0.255, y2: 0.638, thickness: 0.048, steps: 9, depthMeters: 28 },
      { id: 'stair_west_helix', title: 'Hypogeum Helical Vise of Stone & Negative Clay', kind: 'helical', cx: 0.334, cy: 0.735, w: 0.062, h: 0.210, steps: 10, depthMeters: 37 },
      { id: 'stair_central_cascade', title: 'Grand Atrium Stairway Set in Solid Negative', kind: 'straight', x1: 0.435, y1: 0.502, x2: 0.615, y2: 0.642, thickness: 0.052, steps: 11, depthMeters: 29 },
      { id: 'stair_east_helix', title: 'Eastern Spiral Newel Interlocked with Loam', kind: 'helical', cx: 0.665, cy: 0.445, w: 0.058, h: 0.215, steps: 10, depthMeters: 23 },
      { id: 'stair_east_climb', title: 'Cellar Counter-Flight Kissing Inverted Treads', kind: 'straight', x1: 0.875, y1: 0.505, x2: 0.730, y2: 0.652, thickness: 0.048, steps: 9, depthMeters: 31 }
    ];

    var buriedDoors = [
      { id: 'door_upper_vestibule', label: 'Upper Vestibule Stone Leaf', normX: 0.430, normY: 0.462, depthMeters: 19 },
      { id: 'door_west_hypogeum', label: 'Western Hypogeum Iron-Bound Valve', normX: 0.165, normY: 0.795, depthMeters: 36 },
      { id: 'door_central_vault', label: 'Central Coffered Vault Portal', normX: 0.520, normY: 0.812, depthMeters: 42 },
      { id: 'door_deep_cellar', label: 'Deep Cellar Monolith Threshold', normX: 0.815, normY: 0.822, depthMeters: 46 }
    ];

    var proneFigures = [
      { id: 'prone_seam_west', title: 'Still Prone Silhouette in Damp West Seam', cx: 0.165, cy: 0.470, len: 0.064, depthMeters: 21 },
      { id: 'prone_seam_mid', title: 'Immobile Figure Resting in Black Loam', cx: 0.565, cy: 0.582, len: 0.066, depthMeters: 31 },
      { id: 'prone_seam_crypt', title: 'Prone Sleeper Sealed in Damp Vault Clay', cx: 0.225, cy: 0.728, len: 0.062, depthMeters: 38 },
      { id: 'prone_seam_deep', title: 'Silent Prone Form Under Heavy Silt', cx: 0.785, cy: 0.745, len: 0.065, depthMeters: 45 }
    ];

    var rootCrevices = [];
    var rIdx;
    for (rIdx = 0; rIdx < 10; rIdx += 1) {
      var rx = 0.06 + rIdx * 0.096 + (rng() - 0.5) * 0.03;
      var ry = cutawaySurfaceY(rx) + 0.008;
      var pts = [{ x: rx, y: ry }];
      var twigs = [];
      var seg;
      for (seg = 0; seg < 6; seg += 1) {
        rx += (rng() - 0.5) * 0.042;
        ry += 0.036 + rng() * 0.036;
        pts.push({ x: clamp(rx, 0.03, 0.97), y: clamp(ry, 0.17, 0.74) });
        if (seg >= 1 && seg <= 4) {
          twigs.push({
            x1: pts[pts.length - 1].x,
            y1: pts[pts.length - 1].y,
            x2: clamp(pts[pts.length - 1].x + (rng() > 0.5 ? 1 : -1) * (0.018 + rng() * 0.024), 0.02, 0.98),
            y2: clamp(pts[pts.length - 1].y + 0.014 + rng() * 0.022, 0.18, 0.76)
          });
        }
      }
      rootCrevices.push({
        id: 'root_crevice_' + (rIdx + 1),
        title: 'Twisting Root Crevice #' + (rIdx + 1),
        points: pts,
        twigs: twigs,
        depthMeters: Math.round(12 + rIdx * 2.4)
      });
    }

    var wormTunnels = [];
    var wIdx;
    for (wIdx = 0; wIdx < 16; wIdx += 1) {
      var wx = 0.05 + (wIdx % 4) * 0.24 + rng() * 0.16;
      var wy = 0.21 + Math.floor(wIdx / 4) * 0.185 + rng() * 0.09;
      var wPts = [{ x: wx, y: wy }];
      var wSeg;
      var heading = (rng() - 0.5) * 2.2;
      for (wSeg = 0; wSeg < 5; wSeg += 1) {
        heading += (rng() - 0.5) * 1.35;
        wx = clamp(wx + Math.cos(heading) * 0.034, 0.03, 0.97);
        wy = clamp(wy + Math.sin(heading) * 0.024 + 0.006, 0.19, 0.95);
        wPts.push({ x: wx, y: wy });
      }
      wormTunnels.push({
        id: 'worm_tunnel_' + (wIdx + 1),
        title: 'Damp Black Worm Tunnel #' + (wIdx + 1),
        points: wPts,
        depthMeters: Math.round((wPts[2].y - 0.16) * 60)
      });
    }

    var clayPebbles = [];
    var pIdx;
    for (pIdx = 0; pIdx < 220; pIdx += 1) {
      clayPebbles.push({
        x: 0.03 + rng() * 0.94,
        y: 0.18 + rng() * 0.78,
        rx: 0.002 + rng() * 0.006,
        ry: 0.0012 + rng() * 0.003,
        rot: rng() * Math.PI,
        tone: rng()
      });
    }

    var surfaceSlabs = [];
    var sIdx;
    for (sIdx = 0; sIdx < 48; sIdx += 1) {
      surfaceSlabs.push({
        x: rng(),
        v: Math.pow(rng(), 0.85),
        w: 0.035 + rng() * 0.095,
        h: 0.008 + rng() * 0.022,
        tilt: (rng() - 0.5) * 0.16,
        tone: rng()
      });
    }

    var nightStars = [];
    var stIdx;
    for (stIdx = 0; stIdx < 72; stIdx += 1) {
      nightStars.push({
        x: rng(),
        y: rng() * 0.92,
        r: 0.6 + rng() * 1.35,
        alpha: 0.35 + rng() * 0.65
      });
    }

    return {
      rockyClouds: rockyClouds,
      clayChambers: clayChambers,
      packedStreets: packedStreets,
      negativeStairs: negativeStairs,
      buriedDoors: buriedDoors,
      proneFigures: proneFigures,
      rootCrevices: rootCrevices,
      wormTunnels: wormTunnels,
      clayPebbles: clayPebbles,
      surfaceSlabs: surfaceSlabs,
      nightStars: nightStars
    };
  }

  function normalizeProbe(probeId) {
    if (!probeId || probeId === 'none') {
      return null;
    }
    var map = {
      negative_stair: 'negative_stair',
      stairs: 'negative_stair',
      clay_chamber: 'clay_chamber',
      chamber: 'clay_chamber',
      root_fissure: 'root_fissure',
      roots: 'root_fissure',
      rocky_sky: 'rocky_sky',
      packed_street: 'packed_street',
      buried_door: 'buried_door'
    };
    return map[String(probeId)] || null;
  }

  function makeInspectReport(kind, id, title, detail, depthMeters) {
    return {
      kind: kind,
      id: id,
      title: title,
      detail: detail,
      depthMeters: depthMeters,
      airFraction: 0,
      packedEarthFraction: 1.0
    };
  }

  function inspectBlueprintAt(bp, normX, normY, state) {
    var nx = clamp(Number(normX) || 0, 0, 1);
    var ny = clamp(Number(normY) || 0, 0, 1);
    var i;
    var j;

    if (state.viewMode === 'barren_surface' && state.cutawayReveal < 0.5) {
      var platY = barrenPlateauY(nx);
      if (ny < platY) {
        return makeInspectReport('barren_sky', 'deserted_sky', state.isNight ? 'Nocturnal Sky Above Deserted Ground' : 'Parched Sky Above Deserted Ground', 'Above the stony plateau nothing of Argia is visible; not a chimney, gable, or ruin breaks the horizon.', 0);
      }
      return makeInspectReport('barren_surface', 'stony_ground_crust', 'Deserted Stony Ground', state.earPressedAtNight ? 'Ear pressed to night stone: solid clay conducts distant buried door slams upward.' : 'Wind-scoured limestone slabs and dry scree; only at night with an ear to the stone can a door slam be heard.', 0);
    }

    if (ny <= cutawaySurfaceY(nx) + 0.022) {
      return makeInspectReport('barren_surface', 'surface_crust_datum', 'Barren Stony Crust (0m Datum)', 'Deserted limestone scree sealing Argia completely from the upper world; zero structures rise above ground.', 0);
    }

    for (i = 0; i < bp.buriedDoors.length; i += 1) {
      var door = bp.buriedDoors[i];
      if (Math.hypot(nx - door.normX, ny - door.normY) <= 0.036) {
        return makeInspectReport('buried_door', door.id, door.label, 'Heavy stone threshold wedged in damp clay; its shockwave travels by solid earth conduction alone.', door.depthMeters);
      }
    }

    for (i = 0; i < bp.proneFigures.length; i += 1) {
      var pf = bp.proneFigures[i];
      if (Math.abs(nx - pf.cx) <= pf.len * 0.65 && Math.abs(ny - pf.cy) <= 0.025) {
        return makeInspectReport('prone_inhabitant', pf.id, pf.title, 'Dampness saps all strength; inhabitants remain completely still and prone in the dark clay seam.', pf.depthMeters);
      }
    }

    for (i = 0; i < bp.negativeStairs.length; i += 1) {
      var st = bp.negativeStairs[i];
      var hitStair = st.kind === 'straight'
        ? distToSegment(nx, ny, st.x1, st.y1, st.x2, st.y2) <= st.thickness * 0.75
        : (Math.abs(nx - st.cx) <= st.w * 0.65 && Math.abs(ny - st.cy) <= st.h * 0.54);
      if (hitStair) {
        return makeInspectReport('negative_stair', st.id, st.title, 'On every limestone stairway another cast-clay stairway is set in negative, interlocking flush step-for-step with zero air gap.', st.depthMeters);
      }
    }

    for (i = 0; i < bp.rootCrevices.length; i += 1) {
      var rc = bp.rootCrevices[i];
      for (j = 0; j < rc.points.length - 1; j += 1) {
        if (distToSegment(nx, ny, rc.points[j].x, rc.points[j].y, rc.points[j + 1].x, rc.points[j + 1].y) <= 0.018) {
          return makeInspectReport('root_fissure', rc.id, rc.title, 'Pale root tendrils twist through narrow damp crevices piercing the black crust.', rc.depthMeters);
        }
      }
    }

    for (i = 0; i < bp.wormTunnels.length; i += 1) {
      var wt = bp.wormTunnels[i];
      for (j = 0; j < wt.points.length - 1; j += 1) {
        if (distToSegment(nx, ny, wt.points[j].x, wt.points[j].y, wt.points[j + 1].x, wt.points[j + 1].y) <= 0.017) {
          return makeInspectReport('worm_tunnel', wt.id, wt.title, 'Segmented annelid burrow threading the black, damp subterranean crust.', wt.depthMeters);
        }
      }
    }

    for (i = 0; i < bp.rockyClouds.length; i += 1) {
      var cl = bp.rockyClouds[i];
      var dx = (nx - cl.cx) / cl.rx;
      var dy = (ny - cl.cy) / cl.ry;
      if (dx * dx + dy * dy <= 1.05) {
        return makeInspectReport('rocky_sky', cl.id, cl.title, 'Layers of rocky conglomerate and shale hang directly over the roofs of the houses like skies with clouds.', cl.depthMeters);
      }
    }

    for (i = 0; i < bp.packedStreets.length; i += 1) {
      var ps = bp.packedStreets[i];
      if (nx >= ps.x && nx <= ps.x + ps.w && ny >= ps.y && ny <= ps.y + ps.h) {
        return makeInspectReport('packed_street', ps.id, ps.title, 'Colonnaded avenue completely filled from paving stones to entablature with compacted dirt.', ps.depthMeters);
      }
    }

    for (i = 0; i < bp.clayChambers.length; i += 1) {
      var ch = bp.clayChambers[i];
      if (nx >= ch.x && nx <= ch.x + ch.w && ny >= ch.y - 0.032 && ny <= ch.y + ch.h) {
        return makeInspectReport('clay_chamber', ch.id, ch.title, 'Vaulted masonry room packed 100% solid to the ceiling with stratified ochre and umber clay.', ch.depthMeters);
      }
    }

    return makeInspectReport('damp_crust', 'black_damp_crust', 'Black Damp Lithic Matrix', 'Solid earth replaces air throughout Argia; zero void, zero light, total earthen fullness.', Math.max(4, Math.round((ny - 0.16) * 62)));
  }

  function drawSkyAndEar(ctx, w, horizonPx, bp, state) {
    var nf = state.nightFactor;
    var grad = ctx.createLinearGradient(0, 0, 0, Math.max(1, horizonPx));
    grad.addColorStop(0, mixHex(PALETTE.parchment_sky_day, PALETTE.stony_night_sky, nf));
    grad.addColorStop(1, mixHex(PALETTE.barren_scree_day, '#1a202c', nf * 0.92));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, horizonPx + 2);

    if (nf > 0.12) {
      var s;
      for (s = 0; s < bp.nightStars.length; s += 1) {
        var st = bp.nightStars[s];
        ctx.fillStyle = rgba(PALETTE.parchment_sky_day, st.alpha * nf * 0.88);
        ctx.beginPath();
        ctx.arc(st.x * w, st.y * horizonPx * 0.92, st.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawEarMarker(ctx, ex, ey, state, tremorAmp) {
    if (!state.earPressed) {
      return;
    }
    var col = state.earPressedAtNight ? PALETTE.seismic_amber_pulse : PALETTE.umber_loam;
    var rBase = 11 + tremorAmp * 8;
    ctx.save();
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(ex, ey, rBase, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ex, ey, rBase + 7, Math.PI * 0.08, Math.PI * 0.92);
    ctx.stroke();
    ctx.fillStyle = rgba(col, 0.28);
    ctx.beginPath();
    ctx.arc(ex, ey, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function renderBarrenSurface(ctx, w, h, bp, state, waves) {
    var midHorizon = barrenPlateauY(0.5) * h;
    drawSkyAndEar(ctx, w, midHorizon + 18, bp, state);

    var tremor = 0;
    var wi;
    for (wi = 0; wi < waves.length; wi += 1) {
      if (waves[wi].intensity > tremor) {
        tremor = waves[wi].intensity;
      }
    }
    var shiver = (!state.reducedMotion && state.earPressedAtNight) ? tremor * 2.6 : 0;

    ctx.beginPath();
    ctx.moveTo(0, h);
    var xStep;
    for (xStep = 0; xStep <= 40; xStep += 1) {
      var nx = xStep / 40;
      ctx.lineTo(nx * w, barrenPlateauY(nx) * h);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    var groundGrad = ctx.createLinearGradient(0, midHorizon, 0, h);
    groundGrad.addColorStop(0, mixHex(PALETTE.barren_scree_day, '#2c2723', state.nightFactor * 0.78));
    groundGrad.addColorStop(0.45, mixHex(PALETTE.limestone_ashlar, PALETTE.damp_black_clay, 0.25 + state.nightFactor * 0.55));
    groundGrad.addColorStop(1, mixHex(PALETTE.umber_loam, PALETTE.abyssal_crust, 0.45 + state.nightFactor * 0.45));
    ctx.fillStyle = groundGrad;
    ctx.fill();

    ctx.strokeStyle = rgba(PALETTE.ink_etching, 0.55);
    ctx.lineWidth = 1.4;
    ctx.stroke();

    var si;
    for (si = 0; si < bp.surfaceSlabs.length; si += 1) {
      var sl = bp.surfaceSlabs[si];
      var sy = lerp(barrenPlateauY(sl.x) * h + 8, h - 12, sl.v);
      var nearEar = Math.abs(sl.x - state.earNormX) < 0.16 ? 1 : 0;
      var jx = shiver * nearEar * Math.sin(state.phase * 34 + si * 1.9);
      var sw = sl.w * w * (0.55 + sl.v * 0.75);
      var sh = sl.h * h * (0.45 + sl.v * 0.7);
      ctx.save();
      ctx.translate(sl.x * w + jx, sy);
      ctx.rotate(sl.tilt);
      ctx.fillStyle = mixHex(PALETTE.limestone_ashlar, PALETTE.barren_scree_day, sl.tone * (1 - state.nightFactor * 0.65));
      ctx.strokeStyle = rgba(PALETTE.ink_etching, 0.48);
      ctx.lineWidth = 1;
      ctx.fillRect(-sw * 0.5, -sh * 0.5, sw, sh);
      ctx.strokeRect(-sw * 0.5, -sh * 0.5, sw, sh);
      ctx.restore();
    }

    drawEarMarker(ctx, state.earNormX * w, barrenPlateauY(state.earNormX) * h + 14, state, tremor);
  }

  function drawStraightNegativeStair(ctx, w, h, st, highlighted) {
    var x1 = st.x1 * w;
    var y1 = st.y1 * h;
    var x2 = st.x2 * w;
    var y2 = st.y2 * h;
    var bandH = st.thickness * h;
    var n = st.steps;
    var k;

    /* Positive limestone steps below */
    ctx.beginPath();
    ctx.moveTo(x1, y1 + bandH * 0.55);
    for (k = 0; k < n; k += 1) {
      var txA = lerp(x1, x2, k / n);
      var txB = lerp(x1, x2, (k + 1) / n);
      var tyA = lerp(y1, y2, k / n);
      var tyB = lerp(y1, y2, (k + 1) / n);
      ctx.lineTo(txA, tyA);
      ctx.lineTo(txB, tyA);
      ctx.lineTo(txB, tyB);
    }
    ctx.lineTo(x2, y2 + bandH * 0.55);
    ctx.closePath();
    ctx.fillStyle = PALETTE.limestone_ashlar;
    ctx.fill();

    /* Interlocking cast-clay negative stairway flush step-for-step upside-down */
    ctx.beginPath();
    ctx.moveTo(x1, y1 - bandH * 0.55);
    ctx.lineTo(x2, y2 - bandH * 0.55);
    for (k = n - 1; k >= 0; k -= 1) {
      var nxA = lerp(x1, x2, k / n);
      var nxB = lerp(x1, x2, (k + 1) / n);
      var nyA = lerp(y1, y2, k / n);
      var nyB = lerp(y1, y2, (k + 1) / n);
      ctx.lineTo(nxB, nyB);
      ctx.lineTo(nxB, nyA);
      ctx.lineTo(nxA, nyA);
    }
    ctx.closePath();
    ctx.fillStyle = highlighted ? PALETTE.sienna_stratum : PALETTE.ochre_clay_pack;
    ctx.fill();

    /* Zero-gap stepped interlock seam */
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for (k = 0; k < n; k += 1) {
      ctx.lineTo(lerp(x1, x2, (k + 1) / n), lerp(y1, y2, k / n));
      ctx.lineTo(lerp(x1, x2, (k + 1) / n), lerp(y1, y2, (k + 1) / n));
    }
    ctx.strokeStyle = highlighted ? PALETTE.seismic_amber_pulse : PALETTE.ink_etching;
    ctx.lineWidth = highlighted ? 2.2 : 1.3;
    ctx.stroke();
  }

  function drawHelicalNegativeStair(ctx, w, h, st, highlighted) {
    var sx = (st.cx - st.w * 0.5) * w;
    var sy = (st.cy - st.h * 0.5) * h;
    var sw = st.w * w;
    var sh = st.h * h;
    var rows = st.steps;
    var rowH = sh / rows;
    var r;

    ctx.fillStyle = PALETTE.umber_loam;
    ctx.fillRect(sx, sy, sw, sh);
    for (r = 0; r < rows; r += 1) {
      var ry = sy + r * rowH;
      var dir = (r % 2 === 0) ? 1 : -1;
      ctx.fillStyle = PALETTE.limestone_ashlar;
      ctx.beginPath();
      ctx.moveTo(sx, ry + rowH);
      ctx.lineTo(sx + sw, ry + rowH);
      ctx.lineTo(dir > 0 ? sx + sw : sx, ry + rowH * 0.25);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = highlighted ? PALETTE.sienna_stratum : PALETTE.ochre_clay_pack;
      ctx.beginPath();
      ctx.moveTo(sx, ry);
      ctx.lineTo(sx + sw, ry);
      ctx.lineTo(dir > 0 ? sx + sw : sx, ry + rowH * 0.25);
      ctx.lineTo(sx, ry + rowH);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = PALETTE.limestone_ashlar;
    ctx.fillRect(sx + sw * 0.43, sy, sw * 0.14, sh);
    ctx.strokeStyle = highlighted ? PALETTE.seismic_amber_pulse : PALETTE.ink_etching;
    ctx.lineWidth = highlighted ? 2.0 : 1.1;
    ctx.strokeRect(sx, sy, sw, sh);
  }

  function renderCutaway(ctx, w, h, bp, state, waves) {
    var surfMid = cutawaySurfaceY(0.5) * h;
    var probe = state.activeProbe;
    var i;
    var j;

    drawSkyAndEar(ctx, w, surfMid + 14, bp, state);

    /* Solid subterranean earth matrix replacing all air */
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (i = 0; i <= 40; i += 1) {
      var sx = i / 40;
      ctx.lineTo(sx * w, cutawaySurfaceY(sx) * h);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    var earthGrad = ctx.createLinearGradient(0, surfMid, 0, h);
    earthGrad.addColorStop(0, PALETTE.barren_scree_day);
    earthGrad.addColorStop(0.04, PALETTE.umber_loam);
    earthGrad.addColorStop(0.28, PALETTE.damp_black_clay);
    earthGrad.addColorStop(1, PALETTE.abyssal_crust);
    ctx.fillStyle = earthGrad;
    ctx.fill();

    /* Overhanging rocky-terrain cloud strata above house roofs */
    for (i = 0; i < bp.rockyClouds.length; i += 1) {
      var cl = bp.rockyClouds[i];
      var hiCloud = (probe === 'rocky_sky' || probe === 'clay_chamber');
      for (j = 2; j >= 0; j -= 1) {
        ctx.beginPath();
        ctx.ellipse((cl.cx + (j - 1) * 0.018) * w, (cl.cy + j * 0.008) * h, cl.rx * w * (1 - j * 0.14), cl.ry * h * (0.95 - j * 0.12), 0, 0, Math.PI * 2);
        ctx.fillStyle = j === 0 ? PALETTE.limestone_ashlar : (j === 1 ? PALETTE.sienna_stratum : PALETTE.umber_loam);
        ctx.fill();
        ctx.strokeStyle = hiCloud ? PALETTE.seismic_amber_pulse : rgba(PALETTE.ink_etching, 0.65);
        ctx.lineWidth = hiCloud && j === 0 ? 1.8 : 1.0;
        ctx.stroke();
      }
    }

    /* Colonnaded streets choked completely solid with dirt */
    for (i = 0; i < bp.packedStreets.length; i += 1) {
      var ps = bp.packedStreets[i];
      var px = ps.x * w;
      var py = ps.y * h;
      var pw = ps.w * w;
      var ph = ps.h * h;
      ctx.fillStyle = PALETTE.umber_loam;
      ctx.fillRect(px, py, pw, ph);
      ctx.fillStyle = PALETTE.limestone_ashlar;
      ctx.fillRect(px, py, pw, 5);
      ctx.fillRect(px, py + ph - 4, pw, 4);
      for (j = 0; j < ps.cols; j += 1) {
        var colX = px + ((j + 0.5) / ps.cols) * pw;
        ctx.fillRect(colX - 4, py + 4, 8, ph - 8);
        ctx.fillRect(colX - 7, py + 4, 14, 4);
      }
      ctx.strokeStyle = probe === 'packed_street' ? PALETTE.seismic_amber_pulse : PALETTE.ink_etching;
      ctx.lineWidth = probe === 'packed_street' ? 2.0 : 1.1;
      ctx.strokeRect(px, py, pw, ph);
    }

    /* Coffered masonry chambers packed 100% to the ceiling with stratified clay */
    for (i = 0; i < bp.clayChambers.length; i += 1) {
      var ch = bp.clayChambers[i];
      var cx = ch.x * w;
      var cy = ch.y * h;
      var cw = ch.w * w;
      var chH = ch.h * h;
      var hiCh = (probe === 'clay_chamber');

      /* Stone roof or barrel vault shell */
      ctx.fillStyle = PALETTE.limestone_ashlar;
      if (ch.roof === 'gable') {
        ctx.beginPath();
        ctx.moveTo(cx - 8, cy + 4);
        ctx.lineTo(cx + cw * 0.5, cy - 22);
        ctx.lineTo(cx + cw + 8, cy + 4);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = PALETTE.ink_etching;
        ctx.stroke();
      }
      ctx.fillRect(cx - 6, cy - 5, cw + 12, chH + 10);

      /* Interior room packed flush to soffit with banded ochre & sienna clay */
      for (j = 0; j < 5; j += 1) {
        var bandY = cy + (j / 5) * chH;
        ctx.fillStyle = (j % 2 === 0) ? PALETTE.ochre_clay_pack : (j === 1 ? PALETTE.sienna_stratum : PALETTE.umber_loam);
        ctx.fillRect(cx + 4, bandY, cw - 8, chH / 5 + 1);
      }

      /* Ceiling coffers pressed directly into clay pack with zero air gap */
      var cofW = (cw - 14) / ch.coffers;
      for (j = 0; j < ch.coffers; j += 1) {
        ctx.fillStyle = PALETTE.limestone_ashlar;
        ctx.fillRect(cx + 7 + j * cofW, cy, cofW * 0.28, 7);
      }

      ctx.strokeStyle = hiCh ? PALETTE.seismic_amber_pulse : PALETTE.ink_etching;
      ctx.lineWidth = hiCh ? 2.2 : 1.2;
      ctx.strokeRect(cx - 6, cy - 5, cw + 12, chH + 10);
    }

    /* Interlocking positive stone + negative cast-clay stairways */
    for (i = 0; i < bp.negativeStairs.length; i += 1) {
      var st = bp.negativeStairs[i];
      if (st.kind === 'straight') {
        drawStraightNegativeStair(ctx, w, h, st, probe === 'negative_stair');
      } else {
        drawHelicalNegativeStair(ctx, w, h, st, probe === 'negative_stair');
      }
    }

    /* Pebble & gravel lenses across packed earth */
    for (i = 0; i < bp.clayPebbles.length; i += 1) {
      var pb = bp.clayPebbles[i];
      ctx.save();
      ctx.translate(pb.x * w, pb.y * h);
      ctx.rotate(pb.rot);
      ctx.fillStyle = pb.tone > 0.62 ? rgba(PALETTE.pale_root_tendril, 0.34) : rgba(PALETTE.ink_etching, 0.38);
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.max(1.2, pb.rx * w), Math.max(0.9, pb.ry * h), 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* Damp black worm tunnels */
    for (i = 0; i < bp.wormTunnels.length; i += 1) {
      var wt = bp.wormTunnels[i];
      ctx.beginPath();
      ctx.moveTo(wt.points[0].x * w, wt.points[0].y * h);
      for (j = 1; j < wt.points.length; j += 1) {
        ctx.lineTo(wt.points[j].x * w, wt.points[j].y * h);
      }
      ctx.strokeStyle = probe === 'root_fissure' ? PALETTE.seismic_amber_pulse : PALETTE.abyssal_crust;
      ctx.lineWidth = probe === 'root_fissure' ? 4.0 : 3.2;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    /* Twisting pale root crevices */
    for (i = 0; i < bp.rootCrevices.length; i += 1) {
      var rc = bp.rootCrevices[i];
      ctx.beginPath();
      ctx.moveTo(rc.points[0].x * w, rc.points[0].y * h);
      for (j = 1; j < rc.points.length; j += 1) {
        ctx.lineTo(rc.points[j].x * w, rc.points[j].y * h);
      }
      ctx.strokeStyle = PALETTE.ink_etching;
      ctx.lineWidth = 3.4;
      ctx.stroke();
      ctx.strokeStyle = probe === 'root_fissure' ? PALETTE.seismic_amber_pulse : PALETTE.pale_root_tendril;
      ctx.lineWidth = probe === 'root_fissure' ? 2.1 : 1.4;
      ctx.stroke();
      for (j = 0; j < rc.twigs.length; j += 1) {
        var tw = rc.twigs[j];
        ctx.beginPath();
        ctx.moveTo(tw.x1 * w, tw.y1 * h);
        ctx.lineTo(tw.x2 * w, tw.y2 * h);
        ctx.lineWidth = 0.95;
        ctx.stroke();
      }
    }

    /* Still, prone inhabitants resting motionless in dark damp seams */
    for (i = 0; i < bp.proneFigures.length; i += 1) {
      var pf = bp.proneFigures[i];
      var fx = pf.cx * w;
      var fy = pf.cy * h;
      var fl = pf.len * w;
      ctx.save();
      ctx.fillStyle = rgba(PALETTE.abyssal_crust, 0.82);
      ctx.beginPath();
      ctx.ellipse(fx, fy, fl * 0.56, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = probe === 'root_fissure' ? PALETTE.pale_root_tendril : rgba(PALETTE.limestone_ashlar, 0.55);
      ctx.beginPath();
      ctx.arc(fx - fl * 0.36, fy - 0.5, 4.2, 0, Math.PI * 2);
      ctx.ellipse(fx + fl * 0.05, fy + 0.5, fl * 0.32, 3.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* Four buried stone doors deep in the vaults */
    for (i = 0; i < bp.buriedDoors.length; i += 1) {
      var bd = bp.buriedDoors[i];
      var dx = bd.normX * w;
      var dy = bd.normY * h;
      var hiDoor = (probe === 'buried_door');
      ctx.fillStyle = PALETTE.limestone_ashlar;
      ctx.fillRect(dx - 11, dy - 16, 22, 30);
      ctx.fillStyle = PALETTE.damp_black_clay;
      ctx.fillRect(dx - 7, dy - 11, 14, 24);
      ctx.strokeStyle = hiDoor ? PALETTE.seismic_amber_pulse : PALETTE.pale_root_tendril;
      ctx.lineWidth = hiDoor ? 2.2 : 1.1;
      ctx.strokeRect(dx - 11, dy - 16, 22, 30);
    }

    /* Refracting P-wave & S-wave arcs traveling upward through solid clay */
    var maxWave = 0;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, surfMid - 2, w, h - surfMid + 2);
    ctx.clip();
    for (i = 0; i < waves.length; i += 1) {
      var wv = waves[i];
      var amp = clamp(Number(wv.intensity) || 0, 0, 1);
      if (amp > maxWave) {
        maxWave = amp;
      }
      var ox = (Number(wv.originNormX) || 0.5) * w;
      var oy = (Number(wv.originNormY) || 0.8) * h;
      var pRad = Math.max(4, (Number(wv.radiusNorm) || 0) * Math.hypot(w, h));
      var sRad = Math.max(2, (Number(wv.sWaveRadiusNorm) || 0) * Math.hypot(w, h));
      ctx.strokeStyle = rgba(PALETTE.seismic_amber_pulse, amp * (wv.heardAtSurface ? 0.92 : 0.55));
      ctx.lineWidth = wv.heardAtSurface ? 2.6 : 1.6;
      ctx.beginPath();
      ctx.arc(ox, oy, pRad, Math.PI * 1.06, Math.PI * 1.94);
      ctx.stroke();
      ctx.strokeStyle = rgba(PALETTE.sienna_stratum, amp * 0.65);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(ox, oy, sRad, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
    }
    ctx.restore();

    /* Barren stony crust datum line & ear-to-ground contact marker */
    ctx.beginPath();
    for (i = 0; i <= 40; i += 1) {
      var tx = i / 40;
      if (i === 0) {
        ctx.moveTo(0, cutawaySurfaceY(0) * h);
      } else {
        ctx.lineTo(tx * w, cutawaySurfaceY(tx) * h);
      }
    }
    ctx.strokeStyle = PALETTE.ink_etching;
    ctx.lineWidth = 2.0;
    ctx.stroke();
    drawEarMarker(ctx, state.earNormX * w, cutawaySurfaceY(state.earNormX) * h + 3, state, maxWave);
  }

  function renderPendingPlateCanvas(canvas) {
    if (!canvas || typeof canvas.getContext !== 'function') {
      return false;
    }
    var ctx = canvas.getContext('2d');
    if (!ctx) {
      return false;
    }
    var w = canvas.width || 640;
    var h = canvas.height || 400;
    var k;

    ctx.fillStyle = PALETTE.parchment_sky_day;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = PALETTE.ink_etching;
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.lineWidth = 0.9;
    ctx.strokeRect(15, 15, w - 30, h - 30);

    /* Sepia stratigraphic cutaway vignette */
    var vx = 34;
    var vy = 62;
    var vw = w - 68;
    var vh = h - 142;
    ctx.fillStyle = PALETTE.barren_scree_day;
    ctx.fillRect(vx, vy, vw, 26);
    ctx.fillStyle = PALETTE.umber_loam;
    ctx.fillRect(vx, vy + 26, vw, vh - 26);

    for (k = 0; k < 3; k += 1) {
      var bx = vx + 22 + k * ((vw - 36) / 3);
      var bw = (vw - 68) / 3;
      ctx.fillStyle = PALETTE.limestone_ashlar;
      ctx.fillRect(bx - 4, vy + 58, bw + 8, vh - 82);
      ctx.fillStyle = PALETTE.ochre_clay_pack;
      ctx.fillRect(bx + 3, vy + 65, bw - 6, vh - 96);
      ctx.strokeStyle = PALETTE.ink_etching;
      ctx.strokeRect(bx - 4, vy + 58, bw + 8, vh - 82);
    }

    /* Negative stairway interlock emblem */
    var sx = vx + vw * 0.36;
    var sy = vy + 74;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    for (k = 0; k < 6; k += 1) {
      ctx.lineTo(sx + (k + 1) * 18, sy + k * 12);
      ctx.lineTo(sx + (k + 1) * 18, sy + (k + 1) * 12);
    }
    ctx.strokeStyle = PALETTE.ink_etching;
    ctx.lineWidth = 2;
    ctx.stroke();

    /* Engraved title & metric scale bar */
    ctx.fillStyle = PALETTE.ink_etching;
    ctx.font = 'bold 13px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('LITHIC VIEW PLATE — PENDING GENERATOR QUOTA', w * 0.5, 40);

    var barY = h - 46;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(w * 0.22, barY);
    ctx.lineTo(w * 0.78, barY);
    ctx.stroke();
    for (k = 0; k <= 4; k += 1) {
      var tx = lerp(w * 0.22, w * 0.78, k / 4);
      ctx.fillRect(tx - 1, barY - 5, 2, 10);
    }
    ctx.font = '11px Georgia, serif';
    ctx.fillText('0m          12m          25m          38m          50m  [AIR 0% · PACKED CLAY 100%]', w * 0.5, h - 24);
    return true;
  }

  function createNegativeEarth(config) {
    var cfg = config || {};
    var bp = buildLithicBlueprint();
    var seismicWaves = [];
    var state = {
      width: Math.max(120, Number(cfg.width) || 1280),
      height: Math.max(120, Number(cfg.height) || 800),
      dpr: Math.max(1, Number(cfg.dpr) || 1),
      reducedMotion: Boolean(cfg.reducedMotion),
      viewMode: 'lithic_cutaway',
      cutawayReveal: 1.0,
      targetReveal: 1.0,
      isNight: false,
      nightFactor: 0.0,
      earPressed: false,
      earPressedAtNight: false,
      earNormX: 0.5,
      activeProbe: null,
      phase: 0.0
    };

    function cloneDoors() {
      return bp.buriedDoors.map(function (d) {
        return { id: d.id, label: d.label, normX: d.normX, normY: d.normY, depthMeters: d.depthMeters };
      });
    }

    function getState() {
      return {
        airFraction: 0,
        packedEarthFraction: 1.0,
        surfaceVisibility: 0,
        visibleBuildingsAboveGround: 0,
        overburdenSky: 'rocky_terrain_clouds',
        inhabitantPosture: 'still_and_prone',
        dampnessIndex: 0.94,
        subterraneanLux: 0,
        viewMode: state.viewMode,
        cutawayReveal: Number(state.cutawayReveal.toFixed(4)),
        isNight: state.isNight,
        nightFactor: Number(state.nightFactor.toFixed(4)),
        earPressed: state.earPressed,
        earPressedAtNight: Boolean(state.isNight && state.earPressed),
        earNormX: Number(state.earNormX.toFixed(4)),
        activeProbe: state.activeProbe,
        reducedMotion: state.reducedMotion,
        negativeStairCount: bp.negativeStairs.length,
        clayChamberCount: bp.clayChambers.length,
        packedStreetCount: bp.packedStreets.length,
        wormTunnelCount: bp.wormTunnels.length,
        rootCreviceCount: bp.rootCrevices.length,
        proneFigureCount: bp.proneFigures.length,
        seismicWaveCount: seismicWaves.length,
        buriedDoors: cloneDoors(),
        width: state.width,
        height: state.height,
        dpr: state.dpr
      };
    }

    function setViewMode(mode) {
      var next = (mode === 'barren_surface') ? 'barren_surface' : 'lithic_cutaway';
      state.viewMode = next;
      state.targetReveal = next === 'lithic_cutaway' ? 1.0 : 0.0;
      if (state.reducedMotion) {
        state.cutawayReveal = state.targetReveal;
      } else {
        state.cutawayReveal = next === 'lithic_cutaway' ? Math.max(state.cutawayReveal, 0.35) : Math.min(state.cutawayReveal, 0.65);
      }
      return getState();
    }

    return {
      getState: getState,
      setViewport: function (width, height, dpr) {
        if (width > 0) { state.width = Number(width); }
        if (height > 0) { state.height = Number(height); }
        if (dpr > 0) { state.dpr = Number(dpr); }
        return getState();
      },
      setViewMode: setViewMode,
      toggleViewMode: function () {
        return setViewMode(state.viewMode === 'lithic_cutaway' ? 'barren_surface' : 'lithic_cutaway');
      },
      setNight: function (isNight, nightFactor) {
        if (typeof nightFactor === 'number' && !isNaN(nightFactor)) {
          state.nightFactor = clamp(nightFactor, 0, 1);
          state.isNight = typeof isNight === 'boolean' ? isNight : (state.nightFactor >= 0.65);
        } else {
          state.isNight = Boolean(isNight);
          state.nightFactor = state.isNight ? 1.0 : 0.0;
        }
        state.earPressedAtNight = Boolean(state.isNight && state.earPressed);
        return getState();
      },
      setEarPressed: function (pressed, normX) {
        state.earPressed = Boolean(pressed);
        if (typeof normX === 'number' && !isNaN(normX)) {
          state.earNormX = clamp(normX, 0.05, 0.95);
        }
        state.earPressedAtNight = Boolean(state.isNight && state.earPressed);
        return getState();
      },
      setActiveProbe: function (probeId) {
        state.activeProbe = normalizeProbe(probeId);
        return getState();
      },
      setReducedMotion: function (flag) {
        state.reducedMotion = Boolean(flag);
        if (state.reducedMotion) {
          state.cutawayReveal = state.targetReveal;
        }
        return getState();
      },
      setSeismicWaves: function (waves) {
        seismicWaves = Array.isArray(waves) ? waves.slice(0, 24) : [];
      },
      inspectAt: function (normX, normY) {
        return inspectBlueprintAt(bp, normX, normY, state);
      },
      step: function (dtSec) {
        var dt = clamp(Number(dtSec) || 0, 0, 0.25);
        if (!state.reducedMotion) {
          state.phase += dt;
          if (Math.abs(state.targetReveal - state.cutawayReveal) <= dt * 6.5) {
            state.cutawayReveal = state.targetReveal;
          } else {
            state.cutawayReveal += (state.targetReveal > state.cutawayReveal ? 1 : -1) * dt * 6.5;
          }
        } else {
          state.cutawayReveal = state.targetReveal;
        }
      },
      render: function (ctx, width, height) {
        if (!ctx) { return; }
        var rw = Math.max(1, Number(width) || state.width);
        var rh = Math.max(1, Number(height) || state.height);
        if (state.cutawayReveal <= 0.001) {
          renderBarrenSurface(ctx, rw, rh, bp, state, seismicWaves);
        } else if (state.cutawayReveal >= 0.999) {
          renderCutaway(ctx, rw, rh, bp, state, seismicWaves);
        } else {
          renderBarrenSurface(ctx, rw, rh, bp, state, seismicWaves);
          ctx.save();
          ctx.globalAlpha = clamp(state.cutawayReveal, 0, 1);
          renderCutaway(ctx, rw, rh, bp, state, seismicWaves);
          ctx.restore();
        }
      },
      renderPendingPlateCanvas: renderPendingPlateCanvas,
      reset: function () {
        state.viewMode = 'lithic_cutaway';
        state.cutawayReveal = 1.0;
        state.targetReveal = 1.0;
        state.isNight = false;
        state.nightFactor = 0.0;
        state.earPressed = false;
        state.earPressedAtNight = false;
        state.earNormX = 0.5;
        state.activeProbe = null;
        state.phase = 0.0;
        seismicWaves = [];
        return getState();
      }
    };
  }

  var api = Object.freeze({
    PALETTE: PALETTE,
    CANONICAL_STONES: CANONICAL_STONES,
    createNegativeEarth: createNegativeEarth,
    renderPendingPlateCanvas: renderPendingPlateCanvas
  });

  if (root) {
    root.ArgiaNegativeEarth = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.ArgiaNegativeEarth = api;
  }
  if (typeof window !== 'undefined') {
    window.ArgiaNegativeEarth = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
