(function (root) {
  'use strict';

  /* Armilla Pipe Cathedral — Chapter III, Thin Cities 3
   * Zero walls, zero ceilings, zero floors: only vertical house-risers,
   * horizontal floor-runs, brass stopcocks, sifons, mirrors, and white
   * porcelain perched like late fruit on boughs against open cerulean sky.
   */

  const PALETTE = Object.freeze({
    sky_zenith_cerulean: '#1B6CA8',
    sky_horizon_azure: '#6EC1E4',
    morning_sunlit_mist: '#E6F6FC',
    porcelain_glaze_white: '#FAFDFE',
    porcelain_shadow_cool: '#D3E4EE',
    copper_pipe_warm: '#B86B43',
    verdigris_patina: '#3C9D8B',
    brass_stopcock_gold: '#D9A441',
    sunlit_spray_gold: '#FFE596',
    deep_conduit_slate: '#0F293A'
  });

  const CANONICAL_STONES = Object.freeze([
    Object.freeze({
      id: 'zero_walls_ceilings_floors',
      number: 1,
      label: 'Zero Walls, Zero Ceilings, Zero Floors',
      causal_role: 'Whether unfinished or demolished, by enchantment or whim, Armilla has no walls, no ceilings, and no floors—only open cerulean sky through every story.'
    }),
    Object.freeze({
      id: 'vertical_house_risers',
      number: 2,
      label: 'Vertical Risers Where Houses Should Be',
      causal_role: 'Bundles of copper, brass, and verdigris standpipes rise vertically from ground intakes to trace the ghost-volumes of multi-story dwellings.'
    }),
    Object.freeze({
      id: 'horizontal_floor_runs',
      number: 3,
      label: 'Horizontal Pipe-Runs Where Floors Should Be',
      causal_role: 'Branching manifolds spread horizontally at staggered floor elevations, outlining invisible rooms in pure air.'
    }),
    Object.freeze({
      id: 'taps_showers_sifons_overflows',
      number: 4,
      label: 'Taps, Showers, Sifons, and Overflows',
      causal_role: 'Every conduit terminates in brass stopcocks, faucets, perforated shower roses, gooseneck S-trap sifons, and basin overflows.'
    }),
    Object.freeze({
      id: 'porcelain_bough_fruits',
      number: 5,
      label: 'White Porcelain Perched Like Late Fruit on Boughs',
      causal_role: 'Against the sky gleams the white glaze of clawfoot bathtubs, pedestal lavabos, bidets, and porcelain bowls and funnels cantilevered on hydraulic boughs.'
    }),
    Object.freeze({
      id: 'suspended_pipe_mirrors',
      number: 6,
      label: 'Suspended Mirrors & Glass Brackets',
      causal_role: 'Beveled oval mirrors and glass brackets clamped directly onto standpipes catch sunlit spray and sky reflections.'
    }),
    Object.freeze({
      id: 'naiad_morning_possession',
      number: 7,
      label: 'Morning Possession by Young Nymphs and Naiads',
      causal_role: "Unhaunted by angry subterranean gods, Armilla's intact plumbing belongs cleanly to slender nymphs and naiads splashing, stretching in bathtubs, arching under showers, combing long hair at suspended mirrors, and singing in sunlit morning waterjets."
    })
  ]);

  const VALVE_ZONES = Object.freeze([
    Object.freeze({ index: 0, id: 'riser_bath_bough', code: 'I', label: 'Clawfoot Bathtub Bough', tier: 4, fixtureType: 'bathtub' }),
    Object.freeze({ index: 1, id: 'riser_shower_rose', code: 'II', label: 'Sunlit Brass Shower Canopy', tier: 5, fixtureType: 'shower_perch' }),
    Object.freeze({ index: 2, id: 'riser_mirror_stand', code: 'III', label: 'Suspended Mirror Standpipe', tier: 3, fixtureType: 'suspended_mirror' }),
    Object.freeze({ index: 3, id: 'riser_lavabo_perch', code: 'IV', label: 'Cantilevered White Lavabo', tier: 3, fixtureType: 'lavabo' }),
    Object.freeze({ index: 4, id: 'riser_bidet_sifon', code: 'V', label: 'Porcelain Bidet & S-Trap Sifons', tier: 2, fixtureType: 'bidet' }),
    Object.freeze({ index: 5, id: 'riser_crown_bowl', code: 'VI', label: 'Sky-Crown Bowl & Overflows', tier: 6, fixtureType: 'porcelain_bowl' })
  ]);

  const VALID_ORIGINS = Object.freeze([
    'uncertain',
    'unfinished_plumbing',
    'demolished_masonry',
    'hydraulic_whim'
  ]);

  const TIER_HEIGHTS = Object.freeze([0, 54, 108, 164, 218, 272, 324]);

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  /* Procedural 3D blueprint for Armilla's 6 multi-story ghost-house towers */
  function buildBlueprint() {
    const towers = [
      { zoneIndex: 0, cx: -168, cz: 52, topTier: 5, perchDx: 24, perchDz: 12, mirrorDx: -18, mirrorDy: 24, mirrorDz: -8 },
      { zoneIndex: 1, cx: -66, cz: -78, topTier: 6, perchDx: 18, perchDz: 16, mirrorDx: -20, mirrorDy: -18, mirrorDz: 14 },
      { zoneIndex: 2, cx: -10, cz: 94, topTier: 4, perchDx: -16, perchDz: 12, mirrorDx: 22, mirrorDy: 10, mirrorDz: 4 },
      { zoneIndex: 3, cx: 164, cz: 38, topTier: 5, perchDx: -22, perchDz: 14, mirrorDx: 8, mirrorDy: 26, mirrorDz: -10 },
      { zoneIndex: 4, cx: 74, cz: 124, topTier: 3, perchDx: -14, perchDz: 14, mirrorDx: 22, mirrorDy: 22, mirrorDz: -8 },
      { zoneIndex: 5, cx: 96, cz: -64, topTier: 6, perchDx: -18, perchDz: 14, mirrorDx: 20, mirrorDy: -16, mirrorDz: 12 }
    ];

    const risers = [];
    const horizontalRuns = [];
    const gauges = [];
    const sifons = [];
    const mirrors = [];
    const fixtures = [];
    const stopcocks = [];
    const outlets = [];

    const bundleOffsets = [
      { ox: -10, oz: -8, metal: 'copper', radius: 4.4, extraH: 8 },
      { ox: 10, oz: -6, metal: 'verdigris', radius: 3.9, extraH: 0 },
      { ox: -6, oz: 10, metal: 'brass', radius: 3.4, extraH: 18 },
      { ox: 9, oz: 9, metal: 'slate', radius: 3.1, extraH: -12 }
    ];

    for (let ti = 0; ti < towers.length; ti++) {
      const t = towers[ti];
      const zone = VALVE_ZONES[ti];
      const maxY = TIER_HEIGHTS[t.topTier];
      const perchY = TIER_HEIGHTS[zone.tier];

      for (let bi = 0; bi < bundleOffsets.length; bi++) {
        const bo = bundleOffsets[bi];
        const topY = clamp(maxY + bo.extraH, 92, 346);
        risers.push({
          id: 'riser_' + ti + '_' + bi,
          zoneIndex: ti,
          zoneId: zone.id,
          tier: t.topTier,
          metal: bo.metal,
          radius: bo.radius,
          x1: t.cx + bo.ox, y1: 0, z1: t.cz + bo.oz,
          x2: t.cx + bo.ox, y2: topY, z2: t.cz + bo.oz
        });
      }

      /* Internal ghost-room floor perimeter runs across staggered tiers */
      for (let tr = 1; tr <= t.topTier; tr++) {
        if (tr === zone.tier || tr % 2 === 1 || tr === t.topTier) {
          const fy = TIER_HEIGHTS[tr];
          const span = 34 + (tr % 2) * 10;
          horizontalRuns.push({
            id: 'hrun_ew_' + ti + '_' + tr,
            zoneIndex: ti,
            tier: tr,
            metal: tr % 2 === 0 ? 'brass' : 'copper',
            radius: 2.9,
            x1: t.cx - span * 0.65, y1: fy, z1: t.cz - 6,
            x2: t.cx + span * 0.85, y2: fy, z2: t.cz - 6
          });
          horizontalRuns.push({
            id: 'hrun_ns_' + ti + '_' + tr,
            zoneIndex: ti,
            tier: tr,
            metal: tr % 3 === 0 ? 'verdigris' : 'copper',
            radius: 2.6,
            x1: t.cx + 10, y1: fy, z1: t.cz - span * 0.6,
            x2: t.cx + 10, y2: fy, z2: t.cz + span * 0.75
          });
        }
      }

      const px = t.cx + t.perchDx;
      const py = perchY;
      const pz = t.cz + t.perchDz;
      const mx = px + t.mirrorDx;
      const my = py + t.mirrorDy;
      const mz = pz + t.mirrorDz;

      /* Cantilever bough supporting the primary porcelain fixture */
      horizontalRuns.push({
        id: 'bough_cantilever_' + ti,
        zoneIndex: ti,
        tier: zone.tier,
        metal: 'brass',
        radius: 3.3,
        x1: t.cx - 10, y1: py - 4, z1: t.cz - 8,
        x2: px, y2: py - 4, z2: pz
      });
      stopcocks.push({
        id: 'valve_wheel_' + ti,
        zoneIndex: ti,
        zoneId: zone.id,
        code: zone.code,
        label: zone.label + ' Stopcock',
        tier: zone.tier,
        wx: t.cx - 8,
        wy: Math.max(44, py - 32),
        wz: t.cz + 14
      });

      gauges.push({
        id: 'bourdon_gauge_' + ti,
        zoneIndex: ti,
        tier: zone.tier,
        wx: t.cx + 11,
        wy: Math.max(58, py - 18),
        wz: t.cz - 6
      });

      sifons.push({
        id: 'sifon_primary_' + ti,
        zoneIndex: ti,
        zoneId: zone.id,
        tier: zone.tier,
        label: zone.label + ' Gooseneck Sifon',
        metal: ti % 2 === 0 ? 'copper' : 'brass',
        wx: px,
        wy: py - 15,
        wz: pz
      });

      if (ti === 0 || ti === 1 || ti === 3 || ti === 4) {
        sifons.push({
          id: 'sifon_aux_' + ti,
          zoneIndex: ti,
          zoneId: zone.id,
          tier: Math.max(1, zone.tier - 1),
          label: 'Auxiliary S-Trap Sifon ' + zone.code,
          metal: ti === 4 ? 'brass' : 'verdigris',
          wx: t.cx + 12,
          wy: Math.max(36, py - 46),
          wz: t.cz + 8
        });
      }

      mirrors.push({
        id: 'mirror_oval_' + ti,
        zoneIndex: ti,
        zoneId: zone.id,
        tier: zone.tier,
        label: ti === 2 ? 'Primary Standpipe Beveled Mirror' : 'Clamped Sky-Mirror ' + zone.code,
        wx: mx,
        wy: my,
        wz: mz,
        standX: t.cx - 6,
        standZ: t.cz + 10,
        rxRadius: ti === 2 ? 15 : 11,
        ryRadius: ti === 2 ? 22 : 16,
        tilt: (ti % 2 === 0 ? 1 : -1) * 0.16
      });

      fixtures.push({
        id: 'perch_' + zone.id,
        isPrimary: true,
        zoneIndex: ti,
        zoneId: zone.id,
        fixtureType: zone.fixtureType,
        label: zone.label,
        tier: zone.tier,
        wx: px,
        wy: py,
        wz: pz,
        mirrorIndex: ti
      });

      /* Two hydraulic outlets per zone: primary jet/shower/spout + secondary overflow/sifon */
      if (zone.fixtureType === 'bathtub') {
        outlets.push(
          { id: 'out_bath_spout', zoneIndex: ti, zoneId: zone.id, type: 'bath_spout', wx: px - 22, wy: py + 12, wz: pz, dx: 0.82, dy: -0.35, dz: 0.15, weight: 1.0 },
          { id: 'out_bath_overflow', zoneIndex: ti, zoneId: zone.id, type: 'overflow', wx: px + 24, wy: py + 3, wz: pz + 6, dx: 0.48, dy: -0.78, dz: 0.28, weight: 0.62 }
        );
      } else if (zone.fixtureType === 'shower_perch') {
        outlets.push(
          { id: 'out_shower_rose', zoneIndex: ti, zoneId: zone.id, type: 'shower', wx: px, wy: py + 42, wz: pz, dx: 0.12, dy: -0.98, dz: 0.14, weight: 1.15 },
          { id: 'out_shower_sifon', zoneIndex: ti, zoneId: zone.id, type: 'sifon_spurt', wx: px + 14, wy: py - 14, wz: pz + 6, dx: 0.62, dy: 0.45, dz: 0.35, weight: 0.55 }
        );
      } else if (zone.fixtureType === 'suspended_mirror') {
        outlets.push(
          { id: 'out_mirror_tap', zoneIndex: ti, zoneId: zone.id, type: 'tap', wx: px - 8, wy: py + 11, wz: pz, dx: 0.74, dy: 0.28, dz: 0.22, weight: 0.92 },
          { id: 'out_mirror_overflow', zoneIndex: ti, zoneId: zone.id, type: 'overflow', wx: px + 11, wy: py - 2, wz: pz + 5, dx: 0.42, dy: -0.82, dz: 0.25, weight: 0.54 }
        );
      } else if (zone.fixtureType === 'lavabo') {
        outlets.push(
          { id: 'out_lavabo_tap', zoneIndex: ti, zoneId: zone.id, type: 'tap', wx: px + 10, wy: py + 13, wz: pz - 3, dx: -0.76, dy: 0.26, dz: 0.24, weight: 0.96 },
          { id: 'out_lavabo_overflow', zoneIndex: ti, zoneId: zone.id, type: 'overflow', wx: px - 13, wy: py + 1, wz: pz + 5, dx: -0.46, dy: -0.78, dz: 0.3, weight: 0.58 }
        );
      } else if (zone.fixtureType === 'bidet') {
        outlets.push(
          { id: 'out_bidet_jet', zoneIndex: ti, zoneId: zone.id, type: 'bidet_jet', wx: px, wy: py + 5, wz: pz, dx: 0.22, dy: 0.94, dz: 0.2, weight: 1.02 },
          { id: 'out_bidet_sifon', zoneIndex: ti, zoneId: zone.id, type: 'sifon_spurt', wx: px - 15, wy: py - 16, wz: pz + 7, dx: -0.68, dy: 0.52, dz: 0.32, weight: 0.66 }
        );
      } else {
        outlets.push(
          { id: 'out_crown_tap', zoneIndex: ti, zoneId: zone.id, type: 'tap', wx: px + 12, wy: py + 16, wz: pz - 4, dx: -0.7, dy: 0.34, dz: 0.22, weight: 1.08 },
          { id: 'out_crown_overflow', zoneIndex: ti, zoneId: zone.id, type: 'overflow', wx: px - 16, wy: py + 3, wz: pz + 6, dx: -0.52, dy: -0.76, dz: 0.28, weight: 0.68 }
        );
      }
    }

    /* Aerial aqueduct tie-manifolds bridging adjacent ghost-house riser bundles */
    const bridges = [
      [0, 1, 4, 'copper'], [1, 5, 5, 'brass'], [5, 3, 3, 'verdigris'],
      [3, 4, 2, 'copper'], [4, 2, 2, 'brass'], [2, 0, 3, 'verdigris'],
      [1, 2, 3, 'copper'], [2, 5, 4, 'brass']
    ];
    for (let bi = 0; bi < bridges.length; bi++) {
      const b = bridges[bi];
      const ta = towers[b[0]];
      const tb = towers[b[1]];
      const by = TIER_HEIGHTS[b[2]];
      horizontalRuns.push({
        id: 'bridge_manifold_' + bi,
        zoneIndex: b[0],
        tier: b[2],
        metal: b[3],
        radius: 2.5,
        isBridge: true,
        x1: ta.cx, y1: by, z1: ta.cz,
        x2: tb.cx, y2: by, z2: tb.cz
      });
    }

    /* Secondary decorative porcelain funnels & catch-bowls perched on outer boughs */
    const extraFruits = [
      { id: 'aux_funnel_west', zoneIndex: 0, tier: 2, fixtureType: 'porcelain_funnel', label: 'Aerial Porcelain Catch-Funnel', wx: -188, wy: TIER_HEIGHTS[2], wz: 40 },
      { id: 'aux_shell_north', zoneIndex: 1, tier: 3, fixtureType: 'porcelain_funnel', label: 'Cantilevered Rinsing Basin', wx: -86, wy: TIER_HEIGHTS[3], wz: -92 },
      { id: 'aux_bowl_east', zoneIndex: 3, tier: 5, fixtureType: 'porcelain_funnel', label: 'High Bough Porcelain Ewer-Bowl', wx: 182, wy: TIER_HEIGHTS[5], wz: 24 }
    ];
    for (let ei = 0; ei < extraFruits.length; ei++) {
      const ef = extraFruits[ei];
      fixtures.push({
        id: ef.id,
        isPrimary: false,
        zoneIndex: ef.zoneIndex,
        zoneId: VALVE_ZONES[ef.zoneIndex].id,
        fixtureType: ef.fixtureType,
        label: ef.label,
        tier: ef.tier,
        wx: ef.wx,
        wy: ef.wy,
        wz: ef.wz,
        mirrorIndex: ef.zoneIndex
      });
    }

    return { towers, risers, horizontalRuns, gauges, sifons, mirrors, fixtures, stopcocks, outlets };
  }
  function getMetalColors(metal, origin) {
    if (metal === 'brass') {
      return origin === 'hydraulic_whim'
        ? ['#7A5312', '#E8B84B', '#FFF5C0', '#B68125']
        : ['#6E4B14', PALETTE.brass_stopcock_gold, '#FFE9A3', '#9F7020'];
    }
    if (metal === 'verdigris') {
      return origin === 'unfinished_plumbing'
        ? ['#6B3820', PALETTE.copper_pipe_warm, '#F0B28D', '#8E4D2D']
        : ['#1D584E', PALETTE.verdigris_patina, '#9CE8D8', '#297466'];
    }
    if (metal === 'slate') {
      return [PALETTE.deep_conduit_slate, '#3E6278', '#B8D4E3', '#233F52'];
    }
    return origin === 'demolished_masonry'
      ? ['#4A3828', '#8F6F56', '#CBE0D8', '#3C7E70']
      : ['#63321B', PALETTE.copper_pipe_warm, '#F5BC9B', '#8F4E2E'];
  }

  function createPipeCathedral(config) {
    const cfg = config || {};
    const bp = buildBlueprint();

    const state = {
      width: Math.max(240, Number(cfg.width) || 1280),
      height: Math.max(240, Number(cfg.height) || 800),
      reducedMotion: Boolean(cfg.reducedMotion),
      mainPressureBar: 2.8,
      sunElevation: 0.65,
      originHypothesis: 'uncertain',
      azimuth: 0.58,
      elevation: 0.34,
      zoom: 1.0,
      totalSteppedSec: 0,
      animClock: 0
    };

    const valves = VALVE_ZONES.map(function (z) {
      return {
        index: z.index,
        id: z.id,
        code: z.code,
        label: z.label,
        tier: z.tier,
        fixtureType: z.fixtureType,
        openRatio: 1.0,
        targetRatio: 1.0,
        pressureBar: 2.8,
        flowRate: 1.0,
        waterLevel: 0.86,
        wheelAngle: 0,
        x: 0,
        y: 0,
        zDepth: 0
      };
    });

    const proj = {
      scale: 1,
      cx: state.width * 0.5,
      cy: state.height * 0.53,
      risers: [],
      horizontalRuns: [],
      gauges: [],
      sifons: [],
      mirrors: [],
      fixtures: [],
      stopcocks: [],
      outlets: [],
      perches: []
    };

    function projectPoint(wx, wy, wz) {
      const cosA = Math.cos(state.azimuth);
      const sinA = Math.sin(state.azimuth);
      const cosE = Math.cos(state.elevation);
      const sinE = Math.sin(state.elevation);
      const cyWorld = wy - 166;
      const rx = wx * cosA - wz * sinA;
      const rz = wx * sinA + wz * cosA;
      const ry = cyWorld * cosE - rz * sinE;
      const zDepth = rz * cosE + cyWorld * sinE;
      return {
        x: proj.cx + rx * proj.scale,
        y: proj.cy - ry * proj.scale,
        zDepth: zDepth
      };
    }

    function projectDir(dx, dy, dz) {
      const cosA = Math.cos(state.azimuth);
      const sinA = Math.sin(state.azimuth);
      const cosE = Math.cos(state.elevation);
      const sinE = Math.sin(state.elevation);
      const rx = dx * cosA - dz * sinA;
      const rz = dx * sinA + dz * cosA;
      const ry = dy * cosE - rz * sinE;
      const sx = rx;
      const sy = -ry;
      const len = Math.hypot(sx, sy) || 1;
      return { dirX: sx / len, dirY: sy / len };
    }

    function recomputeHydraulics() {
      let openCount = 0;
      for (let i = 0; i < valves.length; i++) {
        if (valves[i].openRatio > 0.02) openCount++;
      }
      const surge = openCount > 0 ? 1 + (6 - openCount) * 0.045 : 1;
      for (let i = 0; i < valves.length; i++) {
        const v = valves[i];
        const head = 1.09 - (v.tier - 1) * 0.032;
        if (v.openRatio <= 0.001) {
          v.openRatio = 0;
          v.pressureBar = 0;
          v.flowRate = 0;
        } else {
          v.pressureBar = +(state.mainPressureBar * head * surge * (0.35 + 0.65 * v.openRatio)).toFixed(3);
          v.flowRate = +(v.openRatio * (state.mainPressureBar / 2.8) * head * surge).toFixed(4);
        }
      }
    }

    function updateProjection() {
      const fitW = state.width / 540;
      const fitH = state.height / 470;
      proj.scale = Math.max(0.38, Math.min(fitW, fitH) * state.zoom);
      proj.cx = state.width * 0.5;
      proj.cy = state.height * (state.width < 520 ? 0.49 : 0.53);

      proj.risers = bp.risers.map(function (r) {
        const p1 = projectPoint(r.x1, r.y1, r.z1);
        const p2 = projectPoint(r.x2, r.y2, r.z2);
        return { ref: r, p1: p1, p2: p2, zDepth: (p1.zDepth + p2.zDepth) * 0.5 };
      });
      proj.horizontalRuns = bp.horizontalRuns.map(function (h) {
        const p1 = projectPoint(h.x1, h.y1, h.z1);
        const p2 = projectPoint(h.x2, h.y2, h.z2);
        return { ref: h, p1: p1, p2: p2, zDepth: (p1.zDepth + p2.zDepth) * 0.5 };
      });
      proj.gauges = bp.gauges.map(function (g) {
        const p = projectPoint(g.wx, g.wy, g.wz);
        return { ref: g, x: p.x, y: p.y, zDepth: p.zDepth };
      });
      proj.sifons = bp.sifons.map(function (s) {
        const p = projectPoint(s.wx, s.wy, s.wz);
        return { ref: s, x: p.x, y: p.y, zDepth: p.zDepth };
      });
      proj.mirrors = bp.mirrors.map(function (m) {
        const p = projectPoint(m.wx, m.wy, m.wz);
        const sp = projectPoint(m.standX, m.wy, m.standZ);
        return { ref: m, x: p.x, y: p.y, standX: sp.x, standY: sp.y, zDepth: p.zDepth };
      });
      proj.stopcocks = bp.stopcocks.map(function (sc) {
        const p = projectPoint(sc.wx, sc.wy, sc.wz);
        const v = valves[sc.zoneIndex];
        v.x = p.x;
        v.y = p.y;
        v.zDepth = p.zDepth;
        return { ref: sc, x: p.x, y: p.y, zDepth: p.zDepth };
      });
      proj.fixtures = bp.fixtures.map(function (f) {
        const p = projectPoint(f.wx, f.wy, f.wz);
        const mp = proj.mirrors[f.mirrorIndex];
        return {
          ref: f,
          x: p.x,
          y: p.y,
          zDepth: p.zDepth,
          mirrorX: mp ? mp.x : p.x + 18 * proj.scale,
          mirrorY: mp ? mp.y : p.y - 16 * proj.scale
        };
      });
      proj.outlets = bp.outlets.map(function (o) {
        const p = projectPoint(o.wx, o.wy, o.wz);
        const d = projectDir(o.dx, o.dy, o.dz);
        const v = valves[o.zoneIndex];
        const activeFlow = v.openRatio <= 0.001 ? 0 : +(v.flowRate * o.weight).toFixed(4);
        return {
          id: o.id,
          zoneIndex: o.zoneIndex,
          zoneId: o.zoneId,
          type: o.type,
          x: p.x,
          y: p.y,
          zDepth: p.zDepth,
          dirX: d.dirX,
          dirY: d.dirY,
          flowRate: activeFlow,
          pressureBar: activeFlow > 0 ? v.pressureBar : 0,
          scale: proj.scale
        };
      });
      proj.perches = proj.fixtures.filter(function (pf) {
        return pf.ref.isPrimary;
      }).map(function (pf) {
        const v = valves[pf.ref.zoneIndex];
        return {
          id: pf.ref.id,
          zoneIndex: pf.ref.zoneIndex,
          zoneId: pf.ref.zoneId,
          fixtureType: pf.ref.fixtureType,
          label: pf.ref.label,
          tier: pf.ref.tier,
          x: pf.x,
          y: pf.y,
          scale: proj.scale,
          zDepth: pf.zDepth,
          openRatio: v.openRatio,
          flowRate: v.flowRate,
          waterLevel: v.waterLevel,
          mirrorX: pf.mirrorX,
          mirrorY: pf.mirrorY
        };
      });
    }
    function renderSkyBackdrop(ctx, sunElevationRatio) {
      if (!ctx) return;
      const w = state.width;
      const h = state.height;
      const sunR = sunElevationRatio === undefined
        ? state.sunElevation
        : clamp(Number(sunElevationRatio) || 0, 0, 1);

      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, PALETTE.sky_zenith_cerulean);
      skyGrad.addColorStop(0.48, '#3B93CC');
      skyGrad.addColorStop(0.8, PALETTE.sky_horizon_azure);
      skyGrad.addColorStop(1, PALETTE.morning_sunlit_mist);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      const sunX = w * (0.78 - sunR * 0.14);
      const sunY = h * (0.46 - sunR * 0.31);
      const haloR = Math.max(w, h) * (0.28 + sunR * 0.12);
      const halo = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, haloR);
      halo.addColorStop(0, 'rgba(250, 253, 254, 0.94)');
      halo.addColorStop(0.16, 'rgba(255, 229, 150, 0.62)');
      halo.addColorStop(0.48, 'rgba(255, 229, 150, 0.16)');
      halo.addColorStop(1, 'rgba(230, 246, 252, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);

      /* Slanting morning sunbeams across open wall-less air */
      ctx.save();
      for (let bi = 0; bi < 4; bi++) {
        const bx = sunX - bi * w * 0.08;
        ctx.fillStyle = 'rgba(255, 229, 150, 0.045)';
        ctx.beginPath();
        ctx.moveTo(bx, sunY);
        ctx.lineTo(bx + w * 0.045, sunY);
        ctx.lineTo(bx - w * 0.28, h);
        ctx.lineTo(bx - w * 0.36, h);
        ctx.closePath();
        ctx.fill();
      }

      /* High wispy morning cirrus clouds */
      const drift = state.reducedMotion ? 0 : (state.animClock * 4.5) % (w * 0.5);
      ctx.strokeStyle = 'rgba(250, 253, 254, 0.34)';
      for (let ci = 0; ci < 6; ci++) {
        const cxCloud = ((ci * w * 0.23 + drift) % (w * 1.25)) - w * 0.12;
        const cyCloud = h * (0.12 + (ci % 3) * 0.11 + (ci * 0.02));
        const cw = w * (0.14 + (ci % 2) * 0.07);
        ctx.lineWidth = 5 + (ci % 3) * 2.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cxCloud, cyCloud);
        ctx.bezierCurveTo(cxCloud + cw * 0.35, cyCloud - 8, cxCloud + cw * 0.7, cyCloud + 6, cxCloud + cw, cyCloud - 2);
        ctx.stroke();
      }

      /* Vapor veil around ground aqueduct intakes (zero floor slabs) */
      const mistGrad = ctx.createLinearGradient(0, h * 0.82, 0, h);
      mistGrad.addColorStop(0, 'rgba(230, 246, 252, 0)');
      mistGrad.addColorStop(1, 'rgba(230, 246, 252, 0.58)');
      ctx.fillStyle = mistGrad;
      ctx.fillRect(0, h * 0.82, w, h * 0.18);
      ctx.restore();
    }

    function drawPipe(ctx, seg, isRiser) {
      const p1 = seg.p1;
      const p2 = seg.p2;
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const len = Math.hypot(dx, dy);
      if (len < 0.8) return;
      const rad = Math.max(1.5, seg.ref.radius * proj.scale);
      const nx = (-dy / len) * rad;
      const ny = (dx / len) * rad;
      const cols = getMetalColors(seg.ref.metal, state.originHypothesis);
      const grad = ctx.createLinearGradient(p1.x - nx, p1.y - ny, p1.x + nx, p1.y + ny);
      grad.addColorStop(0, cols[0]);
      grad.addColorStop(0.38, cols[1]);
      grad.addColorStop(0.68, cols[2]);
      grad.addColorStop(1, cols[3]);

      ctx.save();
      ctx.strokeStyle = grad;
      ctx.lineWidth = rad * 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();

      /* Active hydraulic pulse shimmer inside pressurized conduits */
      const v = valves[seg.ref.zoneIndex];
      if (v && v.openRatio > 0.05) {
        ctx.strokeStyle = 'rgba(255, 229, 150, ' + (0.14 + 0.14 * v.openRatio).toFixed(3) + ')';
        ctx.lineWidth = Math.max(1, rad * 0.55);
        ctx.beginPath();
        ctx.moveTo(p1.x + nx * 0.22, p1.y + ny * 0.22);
        ctx.lineTo(p2.x + nx * 0.22, p2.y + ny * 0.22);
        ctx.stroke();
      }

      /* Brass union collars & ground-intake flanges */
      ctx.fillStyle = PALETTE.brass_stopcock_gold;
      if (isRiser) {
        ctx.beginPath();
        ctx.ellipse(p1.x, p1.y, rad * 2.1, rad * 0.95, 0, 0, Math.PI * 2);
        ctx.fill();
        for (let tr = 1; tr <= 4; tr++) {
          const tFrac = tr / 5;
          const cxJ = lerp(p1.x, p2.x, tFrac);
          const cyJ = lerp(p1.y, p2.y, tFrac);
          ctx.beginPath();
          ctx.ellipse(cxJ, cyJ, rad * 1.35, rad * 0.62, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, rad * 1.25, 0, Math.PI * 2);
        ctx.arc(p2.x, p2.y, rad * 1.25, 0, Math.PI * 2);
        ctx.fill();
        if (state.originHypothesis === 'unfinished_plumbing' && !seg.ref.isBridge) {
          ctx.strokeStyle = 'rgba(217, 164, 65, 0.55)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p2.x, p2.y);
          ctx.lineTo(p2.x, p2.y + 12 * proj.scale);
          ctx.stroke();
        } else if (state.originHypothesis === 'demolished_masonry' && !seg.ref.isBridge) {
          ctx.strokeStyle = PALETTE.deep_conduit_slate;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(p2.x, p2.y, rad * 1.9, -0.8, 0.8);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawGauge(ctx, g) {
      const r = Math.max(4.5, 6.2 * proj.scale);
      const v = valves[g.ref.zoneIndex];
      const normP = clamp((v ? v.pressureBar : 0) / 4.0, 0, 1);
      const ang = lerp(-2.2, 0.65, normP);
      ctx.save();
      ctx.fillStyle = PALETTE.brass_stopcock_gold;
      ctx.beginPath();
      ctx.arc(g.x, g.y, r * 1.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PALETTE.porcelain_glaze_white;
      ctx.beginPath();
      ctx.arc(g.x, g.y, r * 0.92, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PALETTE.deep_conduit_slate;
      ctx.lineWidth = Math.max(1.1, 1.3 * proj.scale);
      ctx.beginPath();
      ctx.moveTo(g.x, g.y);
      ctx.lineTo(g.x + Math.cos(ang) * r * 0.78, g.y + Math.sin(ang) * r * 0.78);
      ctx.stroke();
      ctx.restore();
    }

    function drawSifon(ctx, s) {
      const sc = proj.scale;
      const cols = getMetalColors(s.ref.metal, state.originHypothesis);
      ctx.save();
      ctx.lineCap = 'round';
      ctx.strokeStyle = cols[1];
      ctx.lineWidth = Math.max(2.2, 4.2 * sc);
      ctx.beginPath();
      ctx.moveTo(s.x, s.y - 8 * sc);
      ctx.bezierCurveTo(s.x, s.y + 12 * sc, s.x - 12 * sc, s.y + 12 * sc, s.x - 6 * sc, s.y);
      ctx.bezierCurveTo(s.x, s.y - 10 * sc, s.x + 11 * sc, s.y - 6 * sc, s.x + 9 * sc, s.y + 10 * sc);
      ctx.stroke();
      ctx.strokeStyle = cols[2];
      ctx.lineWidth = Math.max(0.9, 1.3 * sc);
      ctx.stroke();
      ctx.fillStyle = PALETTE.brass_stopcock_gold;
      ctx.beginPath();
      ctx.arc(s.x - 5 * sc, s.y + 8 * sc, Math.max(1.8, 2.4 * sc), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    function drawStopcock(ctx, sc) {
      const v = valves[sc.ref.zoneIndex];
      const r = Math.max(7.5, 10.5 * proj.scale);
      ctx.save();
      if (v.openRatio > 0.05) {
        ctx.fillStyle = 'rgba(255, 229, 150, ' + (0.16 + 0.18 * v.openRatio).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(sc.x, sc.y, r * 1.65, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = v.openRatio > 0.05 ? PALETTE.brass_stopcock_gold : '#8A6A32';
      ctx.lineWidth = Math.max(2, 2.7 * proj.scale);
      ctx.beginPath();
      ctx.arc(sc.x, sc.y, r, 0, Math.PI * 2);
      ctx.stroke();

      for (let sp = 0; sp < 6; sp++) {
        const a = v.wheelAngle + (sp * Math.PI) / 3;
        ctx.beginPath();
        ctx.moveTo(sc.x, sc.y);
        ctx.lineTo(sc.x + Math.cos(a) * r, sc.y + Math.sin(a) * r);
        ctx.stroke();
      }
      ctx.fillStyle = v.openRatio > 0.05 ? PALETTE.sunlit_spray_gold : PALETTE.deep_conduit_slate;
      ctx.beginPath();
      ctx.arc(sc.x, sc.y, r * 0.34, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawMirror(ctx, m) {
      const sc = proj.scale;
      const rx = Math.max(6, m.ref.rxRadius * sc);
      const ry = Math.max(9, m.ref.ryRadius * sc);
      ctx.save();
      /* Articulated brass standpipe clamp bracket */
      ctx.strokeStyle = PALETTE.brass_stopcock_gold;
      ctx.lineWidth = Math.max(1.6, 2.4 * sc);
      ctx.beginPath();
      ctx.moveTo(m.standX, m.standY);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();

      ctx.translate(m.x, m.y);
      ctx.rotate(m.ref.tilt + Math.sin(state.azimuth) * 0.08);
      /* Brass outer frame & crystal bevel */
      ctx.fillStyle = PALETTE.brass_stopcock_gold;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx + 2.4 * sc, ry + 2.4 * sc, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PALETTE.morning_sunlit_mist;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx + 0.9 * sc, ry + 0.9 * sc, 0, 0, Math.PI * 2);
      ctx.fill();

      /* Reflected cerulean sky & morning sun flash */
      const mGrad = ctx.createLinearGradient(-rx, -ry, rx, ry);
      mGrad.addColorStop(0, PALETTE.sky_zenith_cerulean);
      mGrad.addColorStop(0.55, PALETTE.sky_horizon_azure);
      mGrad.addColorStop(1, PALETTE.porcelain_glaze_white);
      ctx.fillStyle = mGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.clip();
      const flashShift = ((state.sunElevation * 10) + (state.reducedMotion ? 0 : Math.sin(state.animClock * 1.7 + m.ref.zoneIndex) * 3)) * sc;
      ctx.fillStyle = 'rgba(255, 229, 150, 0.72)';
      ctx.beginPath();
      ctx.moveTo(-rx * 1.2, -ry * 0.4 + flashShift * 0.25);
      ctx.lineTo(rx * 1.2, -ry * 0.85 + flashShift * 0.25);
      ctx.lineTo(rx * 1.2, -ry * 0.45 + flashShift * 0.25);
      ctx.lineTo(-rx * 1.2, 0 + flashShift * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    function drawFixture(ctx, f) {
      const sc = proj.scale;
      const v = valves[f.ref.zoneIndex];
      const wLvl = v ? v.waterLevel : 0.4;
      const ft = f.ref.fixtureType;
      const x = f.x;
      const y = f.y;

      ctx.save();
      const bodyGrad = ctx.createLinearGradient(x, y - 12 * sc, x, y + 18 * sc);
      bodyGrad.addColorStop(0, PALETTE.porcelain_glaze_white);
      bodyGrad.addColorStop(0.58, '#EEF6FA');
      bodyGrad.addColorStop(1, PALETTE.porcelain_shadow_cool);

      if (ft === 'bathtub') {
        const bw = 30 * sc;
        const bh = 14 * sc;
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(x - bw, y - 2 * sc);
        ctx.bezierCurveTo(x - bw * 0.96, y + bh * 1.35, x + bw * 0.96, y + bh * 1.35, x + bw, y - 2 * sc);
        ctx.closePath();
        ctx.fill();
        /* Rolled porcelain rim & interior water */
        ctx.fillStyle = PALETTE.porcelain_glaze_white;
        ctx.strokeStyle = PALETTE.porcelain_shadow_cool;
        ctx.lineWidth = Math.max(1.2, 1.8 * sc);
        ctx.beginPath();
        ctx.ellipse(x, y - 2 * sc, bw * 1.05, 6.8 * sc, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (wLvl > 0.05) {
          ctx.fillStyle = 'rgba(110, 193, 228, ' + (0.42 + 0.35 * wLvl).toFixed(3) + ')';
          ctx.beginPath();
          ctx.ellipse(x, y - 1.5 * sc, bw * 0.88 * (0.65 + 0.35 * wLvl), 4.6 * sc * (0.65 + 0.35 * wLvl), 0, 0, Math.PI * 2);
          ctx.fill();
        }
        /* Gilded brass lion-paw clawfeet & spout */
        ctx.fillStyle = PALETTE.brass_stopcock_gold;
        ctx.beginPath();
        ctx.arc(x - bw * 0.68, y + bh * 0.95, 3.1 * sc, 0, Math.PI * 2);
        ctx.arc(x + bw * 0.68, y + bh * 0.95, 3.1 * sc, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = PALETTE.brass_stopcock_gold;
        ctx.lineWidth = Math.max(1.8, 2.5 * sc);
        ctx.beginPath();
        ctx.moveTo(x - bw * 0.85, y - 2 * sc);
        ctx.quadraticCurveTo(x - bw * 0.85, y - 14 * sc, x - bw * 0.58, y - 9 * sc);
        ctx.stroke();
      } else if (ft === 'shower_perch') {
        /* Overhead brass swan-neck shower canopy & perforated rose + porcelain foot-pan */
        ctx.strokeStyle = PALETTE.brass_stopcock_gold;
        ctx.lineWidth = Math.max(2.2, 3.2 * sc);
        ctx.beginPath();
        ctx.moveTo(x - 16 * sc, y + 2 * sc);
        ctx.lineTo(x - 16 * sc, y - 44 * sc);
        ctx.quadraticCurveTo(x - 16 * sc, y - 54 * sc, x, y - 43 * sc);
        ctx.stroke();
        ctx.fillStyle = PALETTE.brass_stopcock_gold;
        ctx.beginPath();
        ctx.ellipse(x, y - 41 * sc, 9.5 * sc, 3.8 * sc, 0.08, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.ellipse(x, y + 4 * sc, 20 * sc, 6.5 * sc, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        /* Lavabo, bidet, sky-crown porcelain bowl, mirror shell, or funnel */
        const rx = ft === 'porcelain_bowl' ? 23 * sc : ft === 'porcelain_funnel' ? 11 * sc : 17 * sc;
        const depthH = ft === 'porcelain_funnel' ? 13 * sc : 12 * sc;
        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.moveTo(x - rx, y - 2 * sc);
        ctx.quadraticCurveTo(x, y + depthH * 1.45, x + rx, y - 2 * sc);
        ctx.closePath();
        ctx.fill();
        if (ft === 'lavabo') {
          ctx.fillStyle = PALETTE.porcelain_shadow_cool;
          ctx.fillRect(x - 3.6 * sc, y + depthH * 0.65, 7.2 * sc, 11 * sc);
        }
        ctx.fillStyle = PALETTE.porcelain_glaze_white;
        ctx.strokeStyle = PALETTE.porcelain_shadow_cool;
        ctx.lineWidth = Math.max(1, 1.5 * sc);
        ctx.beginPath();
        ctx.ellipse(x, y - 2 * sc, rx * 1.04, 5.2 * sc, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (wLvl > 0.05 && ft !== 'porcelain_funnel') {
          ctx.fillStyle = 'rgba(110, 193, 228, ' + (0.4 + 0.36 * wLvl).toFixed(3) + ')';
          ctx.beginPath();
          ctx.ellipse(x, y - 1.8 * sc, rx * 0.82 * (0.6 + 0.4 * wLvl), 3.6 * sc, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        /* Swan-neck brass faucet */
        ctx.strokeStyle = PALETTE.brass_stopcock_gold;
        ctx.lineWidth = Math.max(1.6, 2.2 * sc);
        ctx.beginPath();
        ctx.moveTo(x + rx * 0.6, y - 3 * sc);
        ctx.quadraticCurveTo(x + rx * 0.6, y - 14 * sc, x + rx * 0.22, y - 9 * sc);
        ctx.stroke();
      }
      ctx.restore();
    }
    function render(ctx, overlayFn) {
      if (!ctx) return;
      renderSkyBackdrop(ctx, state.sunElevation);

      const drawList = [];
      let i;
      for (i = 0; i < proj.risers.length; i++) drawList.push({ k: 'riser', z: proj.risers[i].zDepth, d: proj.risers[i] });
      for (i = 0; i < proj.horizontalRuns.length; i++) drawList.push({ k: 'hrun', z: proj.horizontalRuns[i].zDepth, d: proj.horizontalRuns[i] });
      for (i = 0; i < proj.sifons.length; i++) drawList.push({ k: 'sifon', z: proj.sifons[i].zDepth, d: proj.sifons[i] });
      for (i = 0; i < proj.gauges.length; i++) drawList.push({ k: 'gauge', z: proj.gauges[i].zDepth, d: proj.gauges[i] });
      for (i = 0; i < proj.fixtures.length; i++) drawList.push({ k: 'fixture', z: proj.fixtures[i].zDepth, d: proj.fixtures[i] });
      for (i = 0; i < proj.mirrors.length; i++) drawList.push({ k: 'mirror', z: proj.mirrors[i].zDepth, d: proj.mirrors[i] });
      for (i = 0; i < proj.stopcocks.length; i++) drawList.push({ k: 'valve', z: proj.stopcocks[i].zDepth + 4, d: proj.stopcocks[i] });

      drawList.sort(function (a, b) { return a.z - b.z; });

      for (i = 0; i < drawList.length; i++) {
        const item = drawList[i];
        if (item.k === 'riser') drawPipe(ctx, item.d, true);
        else if (item.k === 'hrun') drawPipe(ctx, item.d, false);
        else if (item.k === 'sifon') drawSifon(ctx, item.d);
        else if (item.k === 'gauge') drawGauge(ctx, item.d);
        else if (item.k === 'fixture') drawFixture(ctx, item.d);
        else if (item.k === 'mirror') drawMirror(ctx, item.d);
        else if (item.k === 'valve') drawStopcock(ctx, item.d);
      }

      if (typeof overlayFn === 'function') {
        overlayFn(ctx, { outlets: api.getActiveOutlets(), perches: api.getFixturePerches() });
      }

      /* Subtle foreground sunlit specular highlights over nearest risers & porcelain rims */
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 229, 150, 0.28)';
      ctx.lineCap = 'round';
      const sortedRisers = proj.risers.slice().sort(function (a, b) { return b.zDepth - a.zDepth; });
      for (i = 0; i < 4 && i < sortedRisers.length; i++) {
        const fg = sortedRisers[i];
        ctx.lineWidth = Math.max(1, fg.ref.radius * proj.scale * 0.42);
        ctx.beginPath();
        ctx.moveTo(fg.p1.x, fg.p1.y);
        ctx.lineTo(fg.p2.x, fg.p2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    function resolveZone(zoneIndexOrId) {
      if (typeof zoneIndexOrId === 'number' && zoneIndexOrId >= 0 && zoneIndexOrId < valves.length) {
        return valves[zoneIndexOrId | 0];
      }
      const key = String(zoneIndexOrId || '').trim();
      for (let i = 0; i < valves.length; i++) {
        if (valves[i].id === key || valves[i].code === key || String(i) === key) return valves[i];
      }
      return null;
    }

    function applyValveTarget(v, ratio) {
      const r = clamp(Number(ratio) || 0, 0, 1);
      v.targetRatio = r;
      if (state.reducedMotion || state.totalSteppedSec < 0.5) {
        v.openRatio = r;
        v.waterLevel = +(0.12 + 0.76 * r).toFixed(3);
        v.wheelAngle = (1 - r) * Math.PI * 1.5;
      }
    }

    function distToSegment(px, py, x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const lenSq = dx * dx + dy * dy;
      const t = lenSq > 0 ? clamp(((px - x1) * dx + (py - y1) * dy) / lenSq, 0, 1) : 0;
      const nx = x1 + t * dx;
      const ny = y1 + t * dy;
      return { dist: Math.hypot(px - nx, py - ny), x: nx, y: ny };
    }

    function inspectAt(canvasX, canvasY) {
      const cx = Number(canvasX) || 0;
      const cy = Number(canvasY) || 0;
      const hitR = 28;
      let i, d;

      for (i = 0; i < proj.stopcocks.length; i++) {
        const sc = proj.stopcocks[i];
        if (Math.hypot(cx - sc.x, cy - sc.y) <= hitR) {
          const v = valves[sc.ref.zoneIndex];
          return {
            kind: 'valve', id: sc.ref.id, zoneIndex: v.index, zoneId: v.id,
            stoneId: 'taps_showers_sifons_overflows', label: sc.ref.label, tier: v.tier,
            openRatio: v.openRatio, pressureBar: v.pressureBar,
            detail: 'Brass stopcock ' + v.code + ' routing ' + v.pressureBar.toFixed(2) + ' bar to Tier ' + v.tier,
            x: sc.x, y: sc.y
          };
        }
      }
      for (i = 0; i < proj.fixtures.length; i++) {
        const fx = proj.fixtures[i];
        if (Math.hypot(cx - fx.x, cy - fx.y) <= hitR) {
          const v = valves[fx.ref.zoneIndex];
          return {
            kind: 'fixture', id: fx.ref.id, zoneIndex: v.index, zoneId: v.id,
            stoneId: 'porcelain_bough_fruits', label: fx.ref.label, tier: fx.ref.tier,
            openRatio: v.openRatio, pressureBar: v.pressureBar,
            detail: 'White porcelain ' + fx.ref.fixtureType + ' cantilevered on open sky-bough at Tier ' + fx.ref.tier,
            x: fx.x, y: fx.y
          };
        }
      }
      for (i = 0; i < proj.mirrors.length; i++) {
        const mr = proj.mirrors[i];
        if (Math.hypot(cx - mr.x, cy - mr.y) <= hitR) {
          const v = valves[mr.ref.zoneIndex];
          return {
            kind: 'mirror', id: mr.ref.id, zoneIndex: v.index, zoneId: v.id,
            stoneId: 'suspended_pipe_mirrors', label: mr.ref.label, tier: mr.ref.tier,
            openRatio: v.openRatio, pressureBar: v.pressureBar,
            detail: 'Beveled oval mirror clamped directly to standpipe catching morning sky & spray',
            x: mr.x, y: mr.y
          };
        }
      }
      for (i = 0; i < proj.sifons.length; i++) {
        const sf = proj.sifons[i];
        if (Math.hypot(cx - sf.x, cy - sf.y) <= hitR) {
          const v = valves[sf.ref.zoneIndex];
          return {
            kind: 'sifon', id: sf.ref.id, zoneIndex: v.index, zoneId: v.id,
            stoneId: 'taps_showers_sifons_overflows', label: sf.ref.label, tier: sf.ref.tier,
            openRatio: v.openRatio, pressureBar: v.pressureBar,
            detail: 'Gooseneck S-trap sifon suspended in wall-less air beneath Tier ' + sf.ref.tier,
            x: sf.x, y: sf.y
          };
        }
      }
      for (i = 0; i < proj.risers.length; i++) {
        const rs = proj.risers[i];
        d = distToSegment(cx, cy, rs.p1.x, rs.p1.y, rs.p2.x, rs.p2.y);
        if (d.dist <= hitR * 0.75) {
          const v = valves[rs.ref.zoneIndex];
          return {
            kind: 'riser', id: rs.ref.id, zoneIndex: v.index, zoneId: v.id,
            stoneId: 'vertical_house_risers', label: 'House-Riser ' + v.code + ' (' + rs.ref.metal + ')',
            tier: rs.ref.tier, openRatio: v.openRatio, pressureBar: v.pressureBar,
            detail: 'Vertical ' + rs.ref.metal + ' standpipe rising where a multi-story dwelling ought to stand',
            x: d.x, y: d.y
          };
        }
      }
      return null;
    }
    function step(dtSec) {
      const totalDt = clamp(Number(dtSec) || 0, 0, 10);
      if (totalDt <= 0) return api.getState();

      let rem = totalDt;
      while (rem > 1e-6) {
        const dt = Math.min(0.05, rem);
        rem -= dt;
        state.totalSteppedSec += dt;
        if (!state.reducedMotion) {
          state.animClock += dt;
        }
        for (let i = 0; i < valves.length; i++) {
          const v = valves[i];
          if (state.reducedMotion) {
            v.openRatio = v.targetRatio;
          } else {
            const diff = v.targetRatio - v.openRatio;
            if (Math.abs(diff) <= 0.012) {
              v.openRatio = v.targetRatio;
            } else {
              const delta = Math.sign(diff) * Math.max(Math.abs(diff) * 10 * dt, 7.5 * dt);
              v.openRatio = Math.abs(delta) >= Math.abs(diff) ? v.targetRatio : v.openRatio + delta;
            }
          }
          const targetWheel = (1 - v.openRatio) * Math.PI * 1.5;
          const quiver = (!state.reducedMotion && v.openRatio > 0.05)
            ? Math.sin(state.animClock * 5.2 + i * 1.1) * 0.025 * v.openRatio
            : 0;
          v.wheelAngle = lerp(v.wheelAngle, targetWheel, state.reducedMotion ? 1 : clamp(dt * 12, 0, 1)) + quiver;

          const pScale = clamp(state.mainPressureBar / 2.8, 0.55, 1.2);
          const targetFill = v.openRatio > 0.01 ? clamp(0.16 + 0.72 * v.openRatio * pScale, 0, 0.96) : 0.08;
          v.waterLevel = +(lerp(v.waterLevel, targetFill, state.reducedMotion ? 1 : clamp(dt * 4.2, 0, 1))).toFixed(3);
        }
        recomputeHydraulics();
      }
      updateProjection();
      return api.getState();
    }

    function getState() {
      let openValveCount = 0;
      let totalFlowRate = 0;
      let pressureSum = 0;
      for (let i = 0; i < valves.length; i++) {
        const v = valves[i];
        if (v.openRatio > 0.02) {
          openValveCount++;
          pressureSum += v.pressureBar;
        }
        totalFlowRate += v.flowRate;
      }
      const meanPressureBar = openValveCount > 0 ? +(pressureSum / openValveCount).toFixed(3) : 0;
      return {
        wallCount: 0,
        ceilingCount: 0,
        floorSlabCount: 0,
        subterraneanCurse: 0,
        possessionOwner: 'nymphs_and_naiads',
        riserCount: bp.risers.length,
        horizontalRunCount: bp.horizontalRuns.length,
        fixtureCount: bp.fixtures.length,
        mirrorCount: bp.mirrors.length,
        sifonCount: bp.sifons.length,
        openValveCount: openValveCount,
        totalFlowRate: +totalFlowRate.toFixed(4),
        meanPressureBar: meanPressureBar,
        mainPressureBar: state.mainPressureBar,
        sunElevation: state.sunElevation,
        azimuth: +state.azimuth.toFixed(4),
        elevation: +state.elevation.toFixed(4),
        zoom: +state.zoom.toFixed(4),
        originHypothesis: state.originHypothesis,
        reducedMotion: state.reducedMotion,
        valves: valves.map(function (v) {
          return {
            index: v.index,
            id: v.id,
            code: v.code,
            label: v.label,
            tier: v.tier,
            fixtureType: v.fixtureType,
            openRatio: +v.openRatio.toFixed(4),
            targetRatio: +v.targetRatio.toFixed(4),
            isOpen: v.openRatio > 0.02,
            pressureBar: v.pressureBar,
            flowRate: v.flowRate,
            waterLevel: v.waterLevel,
            wheelAngle: +v.wheelAngle.toFixed(3),
            x: v.x,
            y: v.y
          };
        })
      };
    }

    const api = {
      getState: getState,
      setViewport: function (w, h) {
        state.width = Math.max(240, Number(w) || state.width);
        state.height = Math.max(240, Number(h) || state.height);
        updateProjection();
        return getState();
      },
      setCamera: function (cam) {
        const c = cam || {};
        if (typeof c.azimuth === 'number' && !Number.isNaN(c.azimuth)) state.azimuth = c.azimuth;
        if (typeof c.elevation === 'number' && !Number.isNaN(c.elevation)) state.elevation = clamp(c.elevation, -0.06, 0.85);
        if (typeof c.zoom === 'number' && !Number.isNaN(c.zoom)) state.zoom = clamp(c.zoom, 0.55, 1.85);
        updateProjection();
        return getState();
      },
      orbitCamera: function (dAzimuth, dElevation) {
        state.azimuth += Number(dAzimuth) || 0;
        state.elevation = clamp(state.elevation + (Number(dElevation) || 0), -0.06, 0.85);
        updateProjection();
        return getState();
      },
      setMainPressure: function (bar) {
        state.mainPressureBar = +clamp(Number(bar) || 2.8, 0.5, 4.0).toFixed(2);
        recomputeHydraulics();
        updateProjection();
        return state.mainPressureBar;
      },
      toggleValve: function (zoneIndexOrId) {
        const v = resolveZone(zoneIndexOrId);
        if (!v) return null;
        applyValveTarget(v, v.targetRatio > 0.5 ? 0 : 1);
        recomputeHydraulics();
        updateProjection();
        return getState().valves[v.index];
      },
      setValveOpen: function (zoneIndexOrId, ratio) {
        const v = resolveZone(zoneIndexOrId);
        if (!v) return null;
        applyValveTarget(v, ratio);
        recomputeHydraulics();
        updateProjection();
        return getState().valves[v.index];
      },
      setAllValves: function (ratio) {
        for (let i = 0; i < valves.length; i++) {
          applyValveTarget(valves[i], ratio);
        }
        recomputeHydraulics();
        updateProjection();
        return getState();
      },
      setOriginHypothesis: function (mode) {
        const m = String(mode || '').trim();
        state.originHypothesis = VALID_ORIGINS.indexOf(m) >= 0 ? m : 'uncertain';
        return state.originHypothesis;
      },
      setSunElevation: function (ratio) {
        state.sunElevation = +clamp(Number(ratio) || 0, 0, 1).toFixed(3);
        return state.sunElevation;
      },
      step: step,
      renderSkyBackdrop: renderSkyBackdrop,
      render: render,
      getActiveOutlets: function () { return proj.outlets.slice(); },
      getFixturePerches: function () { return proj.perches.slice(); },
      inspectAt: inspectAt,
      setReducedMotion: function (flag) {
        state.reducedMotion = Boolean(flag);
        if (state.reducedMotion) {
          for (let i = 0; i < valves.length; i++) valves[i].openRatio = valves[i].targetRatio;
          recomputeHydraulics();
          updateProjection();
        }
        return state.reducedMotion;
      },
      reset: function () {
        state.mainPressureBar = 2.8;
        state.sunElevation = 0.65;
        state.originHypothesis = 'uncertain';
        state.azimuth = 0.58;
        state.elevation = 0.34;
        state.zoom = 1.0;
        state.totalSteppedSec = 0;
        state.animClock = 0;
        for (let i = 0; i < valves.length; i++) {
          valves[i].openRatio = 1.0;
          valves[i].targetRatio = 1.0;
          valves[i].waterLevel = 0.86;
          valves[i].wheelAngle = 0;
        }
        recomputeHydraulics();
        updateProjection();
        return getState();
      }
    };

    recomputeHydraulics();
    updateProjection();
    return api;
  }

  const ArmillaPipeCathedral = Object.freeze({
    PALETTE: PALETTE,
    CANONICAL_STONES: CANONICAL_STONES,
    VALVE_ZONES: VALVE_ZONES,
    createPipeCathedral: createPipeCathedral
  });

  root.ArmillaPipeCathedral = ArmillaPipeCathedral;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArmillaPipeCathedral;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
