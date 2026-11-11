(function () {
  'use strict';

  var LOGICAL_WIDTH = 1000;
  var LOGICAL_HEIGHT = 620;

  var ANCHOR_LIST = [
    {
      id: 'lamppost_crown',
      code: 'A1',
      x: 310,
      y: 168,
      label: 'Iron Lamppost Finial',
      staticMetric: '4.35 cubits wrought-iron standard · plumb finial · tells nothing',
      tagDx: -38,
      tagDy: -15
    },
    {
      id: 'bastion_cobbles',
      code: 'A2',
      x: 310,
      y: 292,
      label: 'Bastion Plinth Cobbles',
      staticMetric: '58° curved arcade chord · dressed basalt setts · mute stone',
      tagDx: -40,
      tagDy: 17
    },
    {
      id: 'opposite_railing',
      code: 'A3',
      x: 525,
      y: 214,
      label: 'Opposite Balcony Railing',
      staticMetric: '5.60 cubits forged balustrade · 19 vertical spindles · silent',
      tagDx: -42,
      tagDy: -14
    },
    {
      id: 'dawn_alley',
      code: 'A4',
      x: 525,
      y: 368,
      label: 'Lower Stair-Alley Landing',
      staticMetric: '79 basalt stair-steps · 31° rise · tells nothing',
      tagDx: 34,
      tagDy: 14
    },
    {
      id: 'tilted_gutter',
      code: 'A5',
      x: 590,
      y: 132,
      label: 'Zinc-Scaled Roof Guttering',
      staticMetric: '14-gauge oxidized zinc scales · 14°20\' eaves trough · silent',
      tagDx: 36,
      tagDy: -16
    },
    {
      id: 'alcove_window',
      code: 'A6',
      x: 562,
      y: 196,
      label: 'Grated Casement Window',
      staticMetric: '6x4 forged iron bar grille · dressed ashlar reveal · mute stone',
      tagDx: 42,
      tagDy: 4
    },
    {
      id: 'sea_cape',
      code: 'A7',
      x: 885,
      y: 176,
      label: 'Headland Cape Horizon',
      staticMetric: '640.0 cubits azimuth · 28° basalt headland bearing · tells nothing',
      tagDx: -40,
      tagDy: -16
    },
    {
      id: 'torn_fishnet',
      code: 'A8',
      x: 215,
      y: 496,
      label: 'Suspended Quay Fish Net',
      staticMetric: 'Hemp seine mesh · 3 ragged apertures (0.42 · 0.37 · 0.51 cubits) · silent',
      tagDx: 0,
      tagDy: -22
    },
    {
      id: 'dock_bollards',
      code: 'A9',
      x: 365,
      y: 532,
      label: 'Dock Mooring Bench',
      staticMetric: '3.80 cubits dressed limestone bench · twin iron bollards · tells nothing',
      tagDx: 0,
      tagDy: 24
    }
  ];

  var ANCHORS = [];
  var ANCHOR_MAP = {};
  var ANCHOR_BY_CODE = {};

  for (var ai = 0; ai < ANCHOR_LIST.length; ai++) {
    var item = Object.freeze({
      id: ANCHOR_LIST[ai].id,
      code: ANCHOR_LIST[ai].code,
      x: ANCHOR_LIST[ai].x,
      y: ANCHOR_LIST[ai].y,
      label: ANCHOR_LIST[ai].label,
      staticMetric: ANCHOR_LIST[ai].staticMetric,
      tagDx: ANCHOR_LIST[ai].tagDx,
      tagDy: ANCHOR_LIST[ai].tagDy
    });
    ANCHORS.push(item);
    ANCHOR_MAP[item.id] = item;
    ANCHOR_BY_CODE[item.code] = item;
    Object.defineProperty(ANCHORS, item.id, {
      value: item,
      enumerable: false,
      configurable: false,
      writable: false
    });
    Object.defineProperty(ANCHORS, item.code, {
      value: item,
      enumerable: false,
      configurable: false,
      writable: false
    });
  }

  Object.defineProperty(ANCHORS, 'byId', {
    value: ANCHOR_MAP,
    enumerable: false,
    configurable: false,
    writable: false
  });
  Object.defineProperty(ANCHORS, 'byCode', {
    value: ANCHOR_BY_CODE,
    enumerable: false,
    configurable: false,
    writable: false
  });

  function mulberry32(seedInput) {
    var s = 0;
    if (typeof seedInput === 'number' && isFinite(seedInput)) {
      s = seedInput >>> 0;
    } else if (typeof seedInput === 'string') {
      for (var i = 0; i < seedInput.length; i++) {
        s = (Math.imul(31, s) + seedInput.charCodeAt(i)) >>> 0;
      }
    }
    if (s === 0) s = 0x9e3779b9;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashText(str) {
    var h = 2166136261 >>> 0;
    var text = String(str || '');
    for (var i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function evalDeform(deformFn, x, y) {
    if (typeof deformFn !== 'function') {
      return { x: x, y: y, swell: 0 };
    }
    var r = deformFn(x, y);
    if (!r || typeof r !== 'object') {
      return { x: x, y: y, swell: 0 };
    }
    return {
      x: typeof r.x === 'number' && isFinite(r.x) ? r.x : x,
      y: typeof r.y === 'number' && isFinite(r.y) ? r.y : y,
      swell: typeof r.swell === 'number' && isFinite(r.swell) ? clamp(r.swell, 0, 1.5) : 0
    };
  }

  function traceSubdividedPoly(ctx, pts, deformFn, closeShape, maxSegLen) {
    var limit = maxSegLen || 18;
    ctx.beginPath();
    var count = pts.length;
    if (count === 0) return 0;
    var totalSwell = 0;
    var samples = 0;
    var p0 = evalDeform(deformFn, pts[0][0], pts[0][1]);
    ctx.moveTo(p0.x, p0.y);
    totalSwell += p0.swell;
    samples++;

    var endIdx = closeShape ? count : count - 1;
    for (var i = 0; i < endIdx; i++) {
      var a = pts[i];
      var b = pts[(i + 1) % count];
      var dx = b[0] - a[0];
      var dy = b[1] - a[1];
      var dist = Math.hypot(dx, dy);
      var steps = Math.max(1, Math.ceil(dist / limit));
      for (var s = 1; s <= steps; s++) {
        var t = s / steps;
        var dp = evalDeform(deformFn, a[0] + dx * t, a[1] + dy * t);
        ctx.lineTo(dp.x, dp.y);
        totalSwell += dp.swell;
        samples++;
      }
    }
    if (closeShape) {
      ctx.closePath();
    }
    return samples > 0 ? totalSwell / samples : 0;
  }

  function pointInBoxTrap(x, y, topX0, topX1, botX0, botX1, y0, y1) {
    if (y < y0 || y > y1) return false;
    var v = (y - y0) / Math.max(1, y1 - y0);
    var lx = lerp(topX0, botX0, v);
    var rx = lerp(topX1, botX1, v);
    return x >= lx && x <= rx;
  }

  function buildAshlarBlocks(rng, topX0, topX1, botX0, botX1, y0, y1, courses, palette, cutoutFn) {
    var blocks = [];
    var totalH = y1 - y0;
    var courseH = totalH / courses;
    for (var c = 0; c < courses; c++) {
      var cy0 = y0 + c * courseH;
      var cy1 = cy0 + courseH;
      var v0 = c / courses;
      var v1 = (c + 1) / courses;
      var lx0 = lerp(topX0, botX0, v0);
      var rx0 = lerp(topX1, botX1, v0);
      var lx1 = lerp(topX0, botX0, v1);
      var rx1 = lerp(topX1, botX1, v1);
      var rowW = rx0 - lx0;
      var nominalW = clamp(24 + (c % 3) * 4, 22, 36);
      var cols = Math.max(3, Math.round(rowW / nominalW));
      var stagger = (c % 2) * 0.46;

      for (var k = -1; k <= cols; k++) {
        var u0 = clamp((k + stagger) / cols, 0, 1);
        var u1 = clamp((k + 1 + stagger) / cols, 0, 1);
        if (u1 - u0 < 0.035) continue;
        var bx0t = lerp(lx0, rx0, u0);
        var bx1t = lerp(lx0, rx0, u1);
        var bx0b = lerp(lx1, rx1, u0);
        var bx1b = lerp(lx1, rx1, u1);
        var mx = (bx0t + bx1t + bx0b + bx1b) * 0.25;
        var my = (cy0 + cy1) * 0.5;
        if (cutoutFn && cutoutFn(mx, my)) continue;
        blocks.push({
          pts: [
            [bx0t, cy0],
            [bx1t, cy0],
            [bx1b, cy1],
            [bx0b, cy1]
          ],
          cx: mx,
          cy: my,
          fill: palette[Math.floor(rng() * palette.length)],
          bevel: rng() > 0.45,
          grainPhase: rng() * Math.PI * 2
        });
      }
    }
    return blocks;
  }

  function buildSpongePores(rng, topX0, topX1, botX0, botX1, y0, y1, count, cutoutFn) {
    var pores = [];
    var attempts = 0;
    while (pores.length < count && attempts < count * 5) {
      attempts++;
      var v = 0.06 + rng() * 0.88;
      var u = 0.06 + rng() * 0.88;
      var py = lerp(y0, y1, v);
      var lx = lerp(topX0, botX0, v);
      var rx = lerp(topX1, botX1, v);
      var px = lerp(lx, rx, u);
      if (cutoutFn && cutoutFn(px, py)) continue;
      var tooClose = false;
      for (var i = 0; i < pores.length; i++) {
        if (Math.hypot(pores[i].x - px, pores[i].y - py) < 11.5) {
          tooClose = true;
          break;
        }
      }
      if (tooClose) continue;
      var lobes = [];
      var lobeCount = 6 + Math.floor(rng() * 4);
      var baseRx = 3.2 + rng() * 5.2;
      var baseRy = 2.4 + rng() * 4.0;
      for (var l = 0; l < lobeCount; l++) {
        var ang = (l / lobeCount) * Math.PI * 2;
        var radMod = 0.78 + rng() * 0.42;
        lobes.push({
          dx: Math.cos(ang) * baseRx * radMod,
          dy: Math.sin(ang) * baseRy * radMod
        });
      }
      pores.push({
        x: px,
        y: py,
        rx: baseRx,
        ry: baseRy,
        rot: rng() * Math.PI,
        phase: rng() * Math.PI * 2,
        lobes: lobes,
        neighbors: []
      });
    }

    for (var a = 0; a < pores.length; a++) {
      for (var b = a + 1; b < pores.length; b++) {
        var d = Math.hypot(pores[a].x - pores[b].x, pores[a].y - pores[b].y);
        if (d < 29 && pores[a].neighbors.length < 3) {
          pores[a].neighbors.push(b);
        }
      }
    }
    return pores;
  }

  function buildZincRoofScales(rng, ridgeX0, ridgeY0, ridgeX1, ridgeY1, eavesX0, eavesY0, eavesX1, eavesY1, rows, colsBase) {
    var scales = [];
    var zincTones = ['#4b5e63', '#586e73', '#3e4f54', '#657e81', '#52686c', '#6e8886'];
    for (var r = rows - 1; r >= 0; r--) {
      var vTop = r / rows;
      var vBot = (r + 1.28) / rows;
      var lxT = lerp(ridgeX0, eavesX0, vTop);
      var lyT = lerp(ridgeY0, eavesY0, vTop);
      var rxT = lerp(ridgeX1, eavesX1, vTop);
      var ryT = lerp(ridgeY1, eavesY1, vTop);

      var lxB = lerp(ridgeX0, eavesX0, vBot);
      var lyB = lerp(ridgeY0, eavesY0, vBot);
      var rxB = lerp(ridgeX1, eavesX1, vBot);
      var ryB = lerp(ridgeY1, eavesY1, vBot);

      var spanW = Math.hypot(rxB - lxB, ryB - lyB);
      var cols = Math.max(6, Math.round(colsBase * (0.72 + 0.34 * vBot) * (spanW / 200)));
      var offset = (r % 2) * 0.5;

      for (var c = 0; c < cols; c++) {
        var u0 = clamp((c + offset - 0.1) / cols, 0, 1);
        var u1 = clamp((c + offset + 1.05) / cols, 0, 1);
        if (u1 - u0 < 0.02) continue;
        var uMid = (u0 + u1) * 0.5;
        scales.push({
          tl: [lerp(lxT, rxT, u0), lerp(lyT, ryT, u0)],
          tr: [lerp(lxT, rxT, u1), lerp(lyT, ryT, u1)],
          bl: [lerp(lxB, rxB, u0), lerp(lyB, ryB, u0)],
          br: [lerp(lxB, rxB, u1), lerp(lyB, ryB, u1)],
          tip: [
            lerp(lxB, rxB, uMid),
            lerp(lyB, ryB, uMid) + 2.8
          ],
          cx: lerp(lxB, rxB, uMid),
          cy: lerp(lyT, ryB, 0.5),
          fill: zincTones[Math.floor(rng() * zincTones.length)],
          patina: rng() > 0.68,
          phase: rng() * Math.PI * 2
        });
      }
    }
    return {
      outline: [
        [ridgeX0, ridgeY0],
        [ridgeX1, ridgeY1],
        [eavesX1, eavesY1],
        [eavesX0, eavesY0]
      ],
      ridge: [[ridgeX0, ridgeY0], [ridgeX1, ridgeY1]],
      scales: scales
    };
  }

  function buildStairFlight(x0, y0, x1, y1, stepCount, treadWidth) {
    var steps = [];
    for (var i = 0; i < stepCount; i++) {
      var t0 = i / stepCount;
      var t1 = (i + 1) / stepCount;
      var sx0 = lerp(x0, x1, t0);
      var sy0 = lerp(y0, y1, t0);
      var sx1 = lerp(x0, x1, t1);
      var sy1 = lerp(y0, y1, t1);
      steps.push({
        index: i,
        x0: sx0,
        y0: sy0,
        x1: sx1,
        y1: sy1,
        w: treadWidth
      });
    }
    return {
      x0: x0,
      y0: y0,
      x1: x1,
      y1: y1,
      w: treadWidth,
      steps: steps
    };
  }

  function buildArchVoussoirs(cx, cy, rx, ry, count, thickness) {
    var wedges = [];
    for (var i = 0; i < count; i++) {
      var a0 = Math.PI + (i / count) * Math.PI;
      var a1 = Math.PI + ((i + 1) / count) * Math.PI;
      var isKey = i === Math.floor(count / 2);
      var outerBoost = isKey ? thickness * 1.24 : thickness;
      wedges.push({
        isKey: isKey,
        midAngle: (a0 + a1) * 0.5,
        pts: [
          [cx + Math.cos(a0) * rx, cy + Math.sin(a0) * ry],
          [cx + Math.cos(a0) * (rx + outerBoost), cy + Math.sin(a0) * (ry + outerBoost * 1.08)],
          [cx + Math.cos(a1) * (rx + outerBoost), cy + Math.sin(a1) * (ry + outerBoost * 1.08)],
          [cx + Math.cos(a1) * rx, cy + Math.sin(a1) * ry]
        ]
      });
    }
    return wedges;
  }

  function createScene(seed) {
    var rng = mulberry32(seed === undefined ? 404 : seed);

    var paperFibers = [];
    for (var pf = 0; pf < 150; pf++) {
      var px = 14 + rng() * (LOGICAL_WIDTH - 28);
      var py = 14 + rng() * (LOGICAL_HEIGHT - 28);
      var plen = 8 + rng() * 26;
      var pang = (rng() - 0.5) * 0.35;
      paperFibers.push({
        x0: px,
        y0: py,
        x1: px + Math.cos(pang) * plen,
        y1: py + Math.sin(pang) * plen,
        alpha: 0.03 + rng() * 0.045
      });
    }

    var skyStriae = [];
    for (var ss = 0; ss < 46; ss++) {
      var sy = 22 + rng() * 142;
      var sx = 24 + rng() * 900;
      var sw = 28 + rng() * 110;
      if (sx + sw > 982) sw = 982 - sx;
      skyStriae.push({ x0: sx, x1: sx + sw, y: sy, alpha: 0.04 + rng() * 0.06 });
    }

    var seaRipples = [];
    for (var sr = 0; sr < 98; sr++) {
      var v = sr / 98;
      var wy = lerp(194, 598, Math.pow(v, 0.88));
      var minX = wy < 472 ? 690 : 468;
      var wx0 = minX + rng() * (960 - minX - 35);
      var wlen = 18 + rng() * (45 + v * 65);
      if (wx0 + wlen > 984) wlen = 984 - wx0;
      seaRipples.push({
        x0: wx0,
        x1: wx0 + wlen,
        y: wy,
        alpha: 0.12 + (1 - v) * 0.16,
        phase: rng() * Math.PI * 2
      });
    }

    var warmStonePalette = ['#cbbda5', '#c2b39a', '#d3c6af', '#b8a88e', '#c7b89f'];
    var midStonePalette = ['#beaf96', '#b4a48b', '#c6b8a0', '#ab9b82'];
    var quayStonePalette = ['#b6a78f', '#a89980', '#c0b29b', '#9e8f77'];

    var westBastion = {
      id: 'west_citadel',
      outline: [[44, 88], [278, 88], [290, 446], [30, 446]],
      baseFill: '#c4b59c',
      shadowFill: '#9a8b74',
      blocks: buildAshlarBlocks(rng, 44, 278, 30, 290, 88, 446, 15, warmStonePalette, null),
      pores: buildSpongePores(rng, 44, 278, 30, 290, 88, 446, 74, null)
    };

    var arcadeCenters = [
      { cx: 312, cy: 366, rx: 25, ry: 34 },
      { cx: 382, cy: 366, rx: 25, ry: 34 },
      { cx: 452, cy: 366, rx: 25, ry: 34 }
    ];

    function inArcadeOpening(x, y) {
      for (var k = 0; k < arcadeCenters.length; k++) {
        var ac = arcadeCenters[k];
        if (x >= ac.cx - ac.rx - 4 && x <= ac.cx + ac.rx + 4 && y >= ac.cy - ac.ry - 6 && y <= 442) {
          if (y >= ac.cy) return true;
          var nx = (x - ac.cx) / (ac.rx + 4);
          var ny = (y - ac.cy) / (ac.ry + 6);
          if (nx * nx + ny * ny <= 1) return true;
        }
      }
      return false;
    }

    var centralArcadeBastion = {
      id: 'central_arcade',
      outline: [[266, 292], [492, 292], [498, 452], [258, 452]],
      baseFill: '#bcae95',
      shadowFill: '#8e7f68',
      blocks: buildAshlarBlocks(rng, 266, 492, 258, 498, 292, 452, 9, midStonePalette, inArcadeOpening),
      pores: buildSpongePores(rng, 266, 492, 258, 498, 292, 452, 52, inArcadeOpening),
      arcades: arcadeCenters.map(function (ac) {
        return {
          cx: ac.cx,
          cy: ac.cy,
          rx: ac.rx,
          ry: ac.ry,
          baseY: 440,
          voussoirs: buildArchVoussoirs(ac.cx, ac.cy, ac.rx, ac.ry, 11, 8.5)
        };
      })
    };

    function inWindowOpening(x, y) {
      return x >= 542 && x <= 582 && y >= 169 && y <= 223;
    }

    var eastTowerBastion = {
      id: 'east_alcove_tower',
      outline: [[506, 122], [722, 146], [734, 468], [500, 468]],
      baseFill: '#c7b9a1',
      shadowFill: '#968770',
      blocks: buildAshlarBlocks(rng, 506, 722, 500, 734, 134, 468, 16, warmStonePalette, inWindowOpening),
      pores: buildSpongePores(rng, 506, 722, 500, 734, 138, 468, 86, inWindowOpening)
    };

    var upperRearBastion = {
      id: 'upper_rear_citadel',
      outline: [[324, 136], [488, 136], [494, 292], [318, 292]],
      baseFill: '#b8aa93',
      shadowFill: '#8b7d68',
      blocks: buildAshlarBlocks(rng, 324, 488, 318, 494, 136, 292, 8, midStonePalette, null),
      pores: buildSpongePores(rng, 324, 488, 318, 494, 136, 292, 38, null)
    };

    var harborSideBastion = {
      id: 'harbor_annex',
      outline: [[722, 304], [816, 308], [826, 466], [720, 466]],
      baseFill: '#b5a790',
      shadowFill: '#857864',
      blocks: buildAshlarBlocks(rng, 722, 816, 720, 826, 306, 466, 8, quayStonePalette, null),
      pores: buildSpongePores(rng, 722, 816, 720, 826, 306, 466, 26, null)
    };

    var quaySeawall = {
      id: 'quay_seawall',
      outline: [[18, 484], [556, 484], [568, 574], [18, 574]],
      baseFill: '#afa189',
      shadowFill: '#7d705c',
      blocks: buildAshlarBlocks(rng, 18, 556, 18, 568, 492, 574, 5, quayStonePalette, null),
      pores: buildSpongePores(rng, 18, 556, 18, 568, 494, 572, 48, null)
    };

    var roofs = [
      buildZincRoofScales(rng, 74, 48, 248, 48, 34, 90, 286, 90, 8, 18),
      buildZincRoofScales(rng, 352, 92, 460, 92, 318, 138, 494, 138, 7, 15),
      buildZincRoofScales(rng, 536, 62, 692, 72, 498, 120, 730, 146, 10, 20),
      buildZincRoofScales(rng, 724, 268, 804, 272, 716, 306, 824, 310, 6, 12)
    ];

    var totalZincScales = 0;
    for (var ri = 0; ri < roofs.length; ri++) {
      totalZincScales += roofs[ri].scales.length;
    }

    var flightUpper = buildStairFlight(476, 214, 346, 290, 22, 22);
    var flightMiddle = buildStairFlight(348, 295, 516, 366, 31, 25);
    var flightLower = buildStairFlight(514, 374, 412, 486, 26, 28);
    var totalSteps = flightUpper.steps.length + flightMiddle.steps.length + flightLower.steps.length;

    var capeCliffPts = [
      [988, 148],
      [952, 150],
      [918, 158],
      [885, 168],
      [856, 178],
      [838, 192],
      [832, 202],
      [988, 204]
    ];

    var netCols = 20;
    var netRows = 12;
    var netHoles = [
      { u: 0.27, v: 0.48, ru: 0.085, rv: 0.14 },
      { u: 0.50, v: 0.56, ru: 0.095, rv: 0.15 },
      { u: 0.74, v: 0.50, ru: 0.088, rv: 0.14 }
    ];

    var cobbleArcs = [];
    for (var cr = 1; cr <= 4; cr++) {
      var rad = cr * 13;
      var stones = 5 + cr * 3;
      for (var cs = 0; cs < stones; cs++) {
        var a0 = Math.PI + (cs / stones) * Math.PI;
        var a1 = Math.PI + ((cs + 0.86) / stones) * Math.PI;
        cobbleArcs.push({ r: rad, a0: a0, a1: a1 });
      }
    }

    var scene = {
      seed: seed === undefined ? 404 : seed,
      stepCount: totalSteps,
      zincScaleCount: totalZincScales,
      paperFibers: paperFibers,
      skyStriae: skyStriae,
      seaRipples: seaRipples,
      capeCliffPts: capeCliffPts,
      bastions: [
        upperRearBastion,
        harborSideBastion,
        westBastion,
        centralArcadeBastion,
        eastTowerBastion,
        quaySeawall
      ],
      centralArcadeBastion: centralArcadeBastion,
      roofs: roofs,
      stairFlights: [flightUpper, flightMiddle, flightLower],
      netSpec: {
        x0: 152,
        x1: 278,
        yTop: 452,
        yBot: 530,
        cols: netCols,
        rows: netRows,
        holes: netHoles
      },
      cobbleArcs: cobbleArcs,
      lightningRods: [
        { x: 158, yTop: 18, yBase: 48 },
        { x: 406, yTop: 46, yBase: 92 },
        { x: 612, yTop: 16, yBase: 67 }
      ],
      flagpoles: [
        { x: 92, yTop: 22, yBase: 56, dir: 1 },
        { x: 678, yTop: 24, yBase: 71, dir: 1 },
        { x: 112, yTop: 392, yBase: 484, dir: -1 }
      ]
    };

    defaultScene = scene;
    return scene;
  }

  var defaultScene = null;

  function renderBackgroundAndSea(ctx, scene, deformFn, time, reducedMotion) {
    var skyGrad = ctx.createLinearGradient(0, 0, 0, LOGICAL_HEIGHT);
    skyGrad.addColorStop(0, '#efe7d6');
    skyGrad.addColorStop(0.32, '#e2d7c1');
    skyGrad.addColorStop(0.68, '#d4c9b2');
    skyGrad.addColorStop(1, '#c5b9a1');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, LOGICAL_WIDTH, LOGICAL_HEIGHT);

    ctx.save();
    ctx.strokeStyle = 'rgba(74, 62, 46, 0.052)';
    ctx.lineWidth = 0.6;
    for (var gx = 60; gx < LOGICAL_WIDTH; gx += 60) {
      ctx.beginPath();
      ctx.moveTo(gx, 12);
      ctx.lineTo(gx, LOGICAL_HEIGHT - 12);
      ctx.stroke();
    }
    for (var gy = 60; gy < LOGICAL_HEIGHT; gy += 60) {
      ctx.beginPath();
      ctx.moveTo(12, gy);
      ctx.lineTo(LOGICAL_WIDTH - 12, gy);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(84, 68, 48, 0.075)';
    ctx.lineWidth = 0.75;
    ctx.beginPath();
    ctx.arc(310, 292, 124, -Math.PI * 0.85, -Math.PI * 0.15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(525, 214, 154, Math.PI * 0.12, Math.PI * 0.68);
    ctx.stroke();

    for (var pf = 0; pf < scene.paperFibers.length; pf++) {
      var fib = scene.paperFibers[pf];
      ctx.strokeStyle = 'rgba(92, 76, 56, ' + fib.alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(fib.x0, fib.y0);
      ctx.lineTo(fib.x1, fib.y1);
      ctx.stroke();
    }

    ctx.lineWidth = 0.7;
    for (var si = 0; si < scene.skyStriae.length; si++) {
      var st = scene.skyStriae[si];
      ctx.strokeStyle = 'rgba(86, 98, 104, ' + st.alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(st.x0, st.y);
      ctx.lineTo(st.x1, st.y);
      ctx.stroke();
    }
    ctx.restore();

    var seaPoly = [
      [690, 192],
      [988, 192],
      [988, 606],
      [456, 606],
      [548, 474],
      [690, 456]
    ];
    var seaGrad = ctx.createLinearGradient(720, 192, 720, 606);
    seaGrad.addColorStop(0, '#93a4a8');
    seaGrad.addColorStop(0.28, '#6e838b');
    seaGrad.addColorStop(0.68, '#4e646e');
    seaGrad.addColorStop(1, '#364852');
    ctx.save();
    traceSubdividedPoly(ctx, seaPoly, deformFn, true, 36);
    ctx.fillStyle = seaGrad;
    ctx.fill();
    ctx.clip();

    ctx.lineWidth = 0.85;
    var waveShift = reducedMotion ? 0 : time * 0.85;
    for (var wi = 0; wi < scene.seaRipples.length; wi++) {
      var rp = scene.seaRipples[wi];
      var drift = reducedMotion ? 0 : Math.sin(waveShift + rp.phase) * 2.2;
      var pA = evalDeform(deformFn, rp.x0 + drift, rp.y);
      var pB = evalDeform(deformFn, rp.x1 + drift, rp.y);
      ctx.strokeStyle = 'rgba(232, 228, 214, ' + rp.alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    traceSubdividedPoly(ctx, scene.capeCliffPts, deformFn, true, 18);
    var capeGrad = ctx.createLinearGradient(835, 148, 920, 204);
    capeGrad.addColorStop(0, '#6a6d6a');
    capeGrad.addColorStop(0.45, '#4b5256');
    capeGrad.addColorStop(1, '#343b40');
    ctx.fillStyle = capeGrad;
    ctx.fill();
    ctx.strokeStyle = '#2b3136';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    ctx.strokeStyle = 'rgba(226, 218, 200, 0.32)';
    ctx.lineWidth = 0.75;
    for (var cx = 848; cx <= 976; cx += 11) {
      var topY = lerp(188, 150, clamp((cx - 838) / 135, 0, 1));
      var cTop = evalDeform(deformFn, cx, topY + 3);
      var cBot = evalDeform(deformFn, cx - 2, 200);
      ctx.beginPath();
      ctx.moveTo(cTop.x, cTop.y);
      ctx.lineTo(cBot.x, cBot.y);
      ctx.stroke();
    }

    var surfL = evalDeform(deformFn, 826, 203);
    var surfR = evalDeform(deformFn, 986, 204);
    ctx.strokeStyle = 'rgba(242, 236, 222, 0.55)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(surfL.x, surfL.y);
    ctx.lineTo(surfR.x, surfR.y);
    ctx.stroke();

    var beaconBase = evalDeform(deformFn, 885, 168);
    var beaconTip = evalDeform(deformFn, 885, 152);
    ctx.strokeStyle = '#2d3134';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(beaconBase.x, beaconBase.y);
    ctx.lineTo(beaconTip.x, beaconTip.y);
    ctx.stroke();
    ctx.restore();
  }

  function renderBastionMass(ctx, bastion, deformFn, spongeLevel, time, reducedMotion) {
    ctx.save();
    traceSubdividedPoly(ctx, bastion.outline, deformFn, true, 18);
    ctx.fillStyle = '#3c3126';
    ctx.fill();

    for (var bi = 0; bi < bastion.blocks.length; bi++) {
      var blk = bastion.blocks[bi];
      var cPt = evalDeform(deformFn, blk.cx, blk.cy);
      var effSwell = clamp(cPt.swell + spongeLevel * 0.18, 0, 1.2);
      var shrink = 0.45 + effSwell * 2.35;

      ctx.beginPath();
      for (var v = 0; v < 4; v++) {
        var vx = blk.pts[v][0];
        var vy = blk.pts[v][1];
        var dx = vx - blk.cx;
        var dy = vy - blk.cy;
        var dlen = Math.hypot(dx, dy) || 1;
        var ix = vx - (dx / dlen) * shrink;
        var iy = vy - (dy / dlen) * shrink * 0.85;
        var dp = evalDeform(deformFn, ix, iy);
        if (v === 0) ctx.moveTo(dp.x, dp.y);
        else ctx.lineTo(dp.x, dp.y);
      }
      ctx.closePath();
      ctx.fillStyle = blk.fill;
      ctx.fill();
      ctx.strokeStyle = effSwell > 0.08
        ? 'rgba(42, 32, 22, ' + (0.42 + effSwell * 0.38).toFixed(3) + ')'
        : 'rgba(66, 56, 44, 0.36)';
      ctx.lineWidth = 0.65 + effSwell * 0.55;
      ctx.stroke();

      if (blk.bevel) {
        var tl = evalDeform(deformFn, blk.pts[0][0] + 1, blk.pts[0][1] + 1);
        var tr = evalDeform(deformFn, blk.pts[1][0] - 1, blk.pts[1][1] + 1);
        ctx.strokeStyle = 'rgba(248, 242, 228, 0.34)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(tl.x, tl.y);
        ctx.lineTo(tr.x, tr.y);
        ctx.stroke();
      }
    }

    if (bastion.pores && bastion.pores.length > 0) {
      for (var pi = 0; pi < bastion.pores.length; pi++) {
        var pore = bastion.pores[pi];
        var pp = evalDeform(deformFn, pore.x, pore.y);
        var localSwell = clamp(pp.swell * 0.92 + spongeLevel * 0.22, 0, 1.15);
        if (localSwell <= 0.025) continue;

        var pulse = reducedMotion ? 1 : (1 + Math.sin(time * 1.5 + pore.phase) * 0.045 * localSwell);
        var openScale = clamp(localSwell, 0, 1.1) * pulse;

        for (var ni = 0; ni < pore.neighbors.length; ni++) {
          var nb = bastion.pores[pore.neighbors[ni]];
          var np = evalDeform(deformFn, nb.x, nb.y);
          var pairSwell = (localSwell + clamp(np.swell * 0.92 + spongeLevel * 0.22, 0, 1.15)) * 0.5;
          if (pairSwell <= 0.06) continue;
          ctx.strokeStyle = 'rgba(72, 54, 36, ' + clamp(pairSwell * 0.52, 0, 0.55).toFixed(3) + ')';
          ctx.lineWidth = 0.55 + pairSwell * 0.85;
          ctx.beginPath();
          var midX = (pp.x + np.x) * 0.5 + Math.sin(pore.phase) * 1.8 * pairSwell;
          var midY = (pp.y + np.y) * 0.5 - Math.cos(pore.phase) * 1.6 * pairSwell;
          ctx.moveTo(pp.x, pp.y);
          ctx.quadraticCurveTo(midX, midY, np.x, np.y);
          ctx.stroke();
        }

        ctx.beginPath();
        for (var li = 0; li < pore.lobes.length; li++) {
          var lb = pore.lobes[li];
          var lx = pp.x + lb.dx * openScale;
          var ly = pp.y + lb.dy * openScale;
          if (li === 0) ctx.moveTo(lx, ly);
          else ctx.lineTo(lx, ly);
        }
        ctx.closePath();
        ctx.fillStyle = 'rgba(38, 29, 21, ' + clamp(0.28 + localSwell * 0.54, 0, 0.82).toFixed(3) + ')';
        ctx.fill();
        ctx.strokeStyle = 'rgba(182, 152, 102, ' + clamp(localSwell * 0.48, 0, 0.52).toFixed(3) + ')';
        ctx.lineWidth = 0.65;
        ctx.stroke();
      }
    }

    traceSubdividedPoly(ctx, bastion.outline, deformFn, true, 16);
    ctx.strokeStyle = '#332b22';
    ctx.lineWidth = 1.35;
    ctx.stroke();
    ctx.restore();
  }

  function renderCurvedArcades(ctx, arcadeBastion, deformFn) {
    var arcades = arcadeBastion.arcades;
    for (var i = 0; i < arcades.length; i++) {
      var ac = arcades[i];
      ctx.save();
      ctx.beginPath();
      var pBL = evalDeform(deformFn, ac.cx - ac.rx, ac.baseY);
      ctx.moveTo(pBL.x, pBL.y);
      var pSL = evalDeform(deformFn, ac.cx - ac.rx, ac.cy);
      ctx.lineTo(pSL.x, pSL.y);
      for (var s = 0; s <= 18; s++) {
        var ang = Math.PI + (s / 18) * Math.PI;
        var ap = evalDeform(deformFn, ac.cx + Math.cos(ang) * ac.rx, ac.cy + Math.sin(ang) * ac.ry);
        ctx.lineTo(ap.x, ap.y);
      }
      var pBR = evalDeform(deformFn, ac.cx + ac.rx, ac.baseY);
      ctx.lineTo(pBR.x, pBR.y);
      ctx.closePath();

      var archGrad = ctx.createLinearGradient(ac.cx - ac.rx, ac.cy - ac.ry, ac.cx + ac.rx, ac.baseY);
      archGrad.addColorStop(0, '#2a2520');
      archGrad.addColorStop(0.55, '#3e362d');
      archGrad.addColorStop(1, '#52483c');
      ctx.fillStyle = archGrad;
      ctx.fill();

      for (var w = 0; w < ac.voussoirs.length; w++) {
        var vd = ac.voussoirs[w];
        var midRef = evalDeform(
          deformFn,
          ac.cx + Math.cos(vd.midAngle) * (ac.rx + 4),
          ac.cy + Math.sin(vd.midAngle) * (ac.ry + 4)
        );
        var pushOut = midRef.swell * 2.2;
        var ox = Math.cos(vd.midAngle) * pushOut;
        var oy = Math.sin(vd.midAngle) * pushOut;

        ctx.beginPath();
        for (var vp = 0; vp < 4; vp++) {
          var wp = evalDeform(deformFn, vd.pts[vp][0] + ox, vd.pts[vp][1] + oy);
          if (vp === 0) ctx.moveTo(wp.x, wp.y);
          else ctx.lineTo(wp.x, wp.y);
        }
        ctx.closePath();
        ctx.fillStyle = vd.isKey ? '#dfd3bc' : '#d2c4ab';
        ctx.fill();
        ctx.strokeStyle = '#382f25';
        ctx.lineWidth = 0.85;
        ctx.stroke();
      }

      ctx.strokeStyle = 'rgba(158, 122, 54, 0.35)';
      ctx.lineWidth = 0.65;
      ctx.setLineDash([2.5, 2.5]);
      ctx.beginPath();
      for (var cs = 0; cs <= 12; cs++) {
        var ca = Math.PI * 1.18 + (cs / 12) * Math.PI * 0.64;
        var cp = evalDeform(deformFn, ac.cx + Math.cos(ca) * (ac.rx - 5), ac.cy + Math.sin(ca) * (ac.ry - 5));
        if (cs === 0) ctx.moveTo(cp.x, cp.y);
        else ctx.lineTo(cp.x, cp.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
  }

  function renderZincRoofsAndSpires(ctx, scene, deformFn, time, reducedMotion) {
    for (var r = 0; r < scene.roofs.length; r++) {
      var roof = scene.roofs[r];
      ctx.save();
      traceSubdividedPoly(ctx, roof.outline, deformFn, true, 16);
      ctx.fillStyle = '#2d3a3e';
      ctx.fill();

      for (var si = 0; si < roof.scales.length; si++) {
        var sc = roof.scales[si];
        var centerDef = evalDeform(deformFn, sc.cx, sc.cy);
        var flare = centerDef.swell * 3.1;
        var pTL = evalDeform(deformFn, sc.tl[0], sc.tl[1] - flare * 0.25);
        var pTR = evalDeform(deformFn, sc.tr[0], sc.tr[1] - flare * 0.25);
        var pBR = evalDeform(deformFn, sc.br[0] + flare * 0.2, sc.br[1] - flare * 0.65);
        var pTip = evalDeform(deformFn, sc.tip[0], sc.tip[1] - flare * 0.9);
        var pBL = evalDeform(deformFn, sc.bl[0] - flare * 0.2, sc.bl[1] - flare * 0.65);

        ctx.beginPath();
        ctx.moveTo(pTL.x, pTL.y);
        ctx.lineTo(pTR.x, pTR.y);
        ctx.lineTo(pBR.x, pBR.y);
        ctx.quadraticCurveTo(pTip.x, pTip.y, pBL.x, pBL.y);
        ctx.closePath();

        ctx.fillStyle = sc.patina ? '#678380' : sc.fill;
        ctx.fill();
        ctx.strokeStyle = centerDef.swell > 0.08
          ? 'rgba(214, 226, 218, 0.52)'
          : 'rgba(28, 38, 42, 0.58)';
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      var rL = evalDeform(deformFn, roof.ridge[0][0], roof.ridge[0][1]);
      var rR = evalDeform(deformFn, roof.ridge[1][0], roof.ridge[1][1]);
      ctx.strokeStyle = '#7e9494';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(rL.x, rL.y);
      ctx.lineTo(rR.x, rR.y);
      ctx.stroke();
      ctx.strokeStyle = '#263236';
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    for (var li = 0; li < scene.lightningRods.length; li++) {
      var rod = scene.lightningRods[li];
      var rb = evalDeform(deformFn, rod.x, rod.yBase);
      var rt = evalDeform(deformFn, rod.x, rod.yTop);
      ctx.strokeStyle = '#333b3e';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(rb.x, rb.y);
      ctx.lineTo(rt.x, rt.y);
      ctx.stroke();

      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(rt.x - 4, rt.y + 6);
      ctx.lineTo(rt.x, rt.y + 2);
      ctx.lineTo(rt.x + 4, rt.y + 6);
      ctx.stroke();

      ctx.fillStyle = '#b48a3e';
      ctx.beginPath();
      ctx.arc(rt.x, rt.y + 12, 1.9, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var fi = 0; fi < scene.flagpoles.length; fi++) {
      var fp = scene.flagpoles[fi];
      var fb = evalDeform(deformFn, fp.x, fp.yBase);
      var ft = evalDeform(deformFn, fp.x, fp.yTop);
      ctx.strokeStyle = '#3b332b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(fb.x, fb.y);
      ctx.lineTo(ft.x, ft.y);
      ctx.stroke();

      var flutter = reducedMotion ? 0 : Math.sin(time * 2.1 + fi * 1.7) * 1.8;
      var penMid = evalDeform(deformFn, fp.x + fp.dir * 13, fp.yTop + 5 + flutter * 0.5);
      var penTip = evalDeform(deformFn, fp.x + fp.dir * 24, fp.yTop + 4 + flutter);
      var penBot = evalDeform(deformFn, fp.x, fp.yTop + 10);
      ctx.fillStyle = 'rgba(132, 92, 68, 0.78)';
      ctx.beginPath();
      ctx.moveTo(ft.x, ft.y + 2);
      ctx.quadraticCurveTo(penMid.x, penMid.y - 2, penTip.x, penTip.y);
      ctx.quadraticCurveTo(penMid.x, penMid.y + 3, penBot.x, penBot.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#3b2c22';
      ctx.lineWidth = 0.65;
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderStairStreets(ctx, scene, deformFn) {
    ctx.save();
    var canyonPoly = [
      [338, 286],
      [496, 206],
      [506, 474],
      [392, 492],
      [334, 452]
    ];
    traceSubdividedPoly(ctx, canyonPoly, deformFn, true, 22);
    ctx.fillStyle = 'rgba(54, 46, 38, 0.34)';
    ctx.fill();

    var landingPoly = [
      [492, 362],
      [554, 362],
      [560, 376],
      [486, 376]
    ];
    traceSubdividedPoly(ctx, landingPoly, deformFn, true, 14);
    ctx.fillStyle = '#6c7075';
    ctx.fill();
    ctx.strokeStyle = '#2b2e32';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    for (var fi = 0; fi < scene.stairFlights.length; fi++) {
      var fl = scene.stairFlights[fi];
      for (var si = 0; si < fl.steps.length; si++) {
        var st = fl.steps[si];
        var p0L = evalDeform(deformFn, st.x0 - st.w * 0.5, st.y0);
        var p0R = evalDeform(deformFn, st.x0 + st.w * 0.5, st.y0);
        var p1R = evalDeform(deformFn, st.x1 + st.w * 0.5, st.y0 + 1.8);
        var p1L = evalDeform(deformFn, st.x1 - st.w * 0.5, st.y0 + 1.8);
        var rBR = evalDeform(deformFn, st.x1 + st.w * 0.5, st.y1 + 2.2);
        var rBL = evalDeform(deformFn, st.x1 - st.w * 0.5, st.y1 + 2.2);

        ctx.fillStyle = '#73787e';
        ctx.beginPath();
        ctx.moveTo(p0L.x, p0L.y);
        ctx.lineTo(p0R.x, p0R.y);
        ctx.lineTo(p1R.x, p1R.y);
        ctx.lineTo(p1L.x, p1L.y);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#3f4348';
        ctx.beginPath();
        ctx.moveTo(p1L.x, p1L.y);
        ctx.lineTo(p1R.x, p1R.y);
        ctx.lineTo(rBR.x, rBR.y);
        ctx.lineTo(rBL.x, rBL.y);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#23262a';
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        ctx.moveTo(p0L.x, p0L.y);
        ctx.lineTo(p0R.x, p0R.y);
        ctx.stroke();
      }

      for (var side = -1; side <= 1; side += 2) {
        ctx.strokeStyle = '#2c3034';
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        for (var bi = 0; bi <= fl.steps.length; bi += 3) {
          var t = Math.min(1, bi / fl.steps.length);
          var bx = lerp(fl.x0, fl.x1, t) + side * fl.w * 0.52;
          var by = lerp(fl.y0, fl.y1, t);
          var railPt = evalDeform(deformFn, bx, by - 10);
          if (bi === 0) ctx.moveTo(railPt.x, railPt.y);
          else ctx.lineTo(railPt.x, railPt.y);
        }
        ctx.stroke();

        ctx.lineWidth = 0.75;
        for (var pi = 0; pi <= fl.steps.length; pi += 3) {
          var pt = Math.min(1, pi / fl.steps.length);
          var px = lerp(fl.x0, fl.x1, pt) + side * fl.w * 0.52;
          var py = lerp(fl.y0, fl.y1, pt);
          var baseP = evalDeform(deformFn, px, py);
          var topP = evalDeform(deformFn, px, py - 10);
          ctx.beginPath();
          ctx.moveTo(baseP.x, baseP.y);
          ctx.lineTo(topP.x, topP.y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  function renderElevationLandmarks(ctx, scene, deformFn) {
    ctx.save();

    /* Canted Zinc Guttering along East Tower Eaves through A5 (590, 132) */
    var gutterPtsTop = [];
    var gutterPtsBot = [];
    for (var gi = 0; gi <= 14; gi++) {
      var gt = gi / 14;
      var gx = lerp(498, 730, gt);
      var gy = lerp(119.3, 148.7, gt);
      gutterPtsTop.push([gx, gy - 2.6]);
      gutterPtsBot.push([gx, gy + 3.2]);
    }
    ctx.beginPath();
    var gp0 = evalDeform(deformFn, gutterPtsTop[0][0], gutterPtsTop[0][1]);
    ctx.moveTo(gp0.x, gp0.y);
    for (var g1 = 1; g1 < gutterPtsTop.length; g1++) {
      var gpt = evalDeform(deformFn, gutterPtsTop[g1][0], gutterPtsTop[g1][1]);
      ctx.lineTo(gpt.x, gpt.y);
    }
    for (var g2 = gutterPtsBot.length - 1; g2 >= 0; g2--) {
      var gpb = evalDeform(deformFn, gutterPtsBot[g2][0], gutterPtsBot[g2][1]);
      ctx.lineTo(gpb.x, gpb.y);
    }
    ctx.closePath();
    ctx.fillStyle = '#5c7478';
    ctx.fill();
    ctx.strokeStyle = '#233034';
    ctx.lineWidth = 1.05;
    ctx.stroke();

    for (var gb = 1; gb < 14; gb += 2) {
      var brkT = gb / 14;
      var brkX = lerp(498, 730, brkT);
      var brkY = lerp(119.3, 148.7, brkT);
      var bTop = evalDeform(deformFn, brkX, brkY + 2.8);
      var bBot = evalDeform(deformFn, brkX - 2, brkY + 8.5);
      ctx.strokeStyle = '#2d3538';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(bTop.x, bTop.y);
      ctx.lineTo(bBot.x, bBot.y);
      ctx.stroke();
    }

    var dsTop = evalDeform(deformFn, 725, 149);
    var dsMid = evalDeform(deformFn, 722, 300);
    var dsBot = evalDeform(deformFn, 724, 464);
    ctx.strokeStyle = '#485b5f';
    ctx.lineWidth = 3.0;
    ctx.beginPath();
    ctx.moveTo(dsTop.x, dsTop.y);
    ctx.lineTo(dsMid.x, dsMid.y);
    ctx.lineTo(dsBot.x, dsBot.y);
    ctx.stroke();

    /* Grated Casement Window at A6 (562, 196) */
    var winOuter = [[542, 168], [582, 168], [582, 222], [542, 222]];
    traceSubdividedPoly(ctx, winOuter, deformFn, true, 14);
    ctx.fillStyle = '#ddd1ba';
    ctx.fill();
    ctx.strokeStyle = '#382f26';
    ctx.lineWidth = 1.0;
    ctx.stroke();

    var winInner = [[547, 173], [577, 173], [577, 217], [547, 217]];
    traceSubdividedPoly(ctx, winInner, deformFn, true, 12);
    ctx.fillStyle = '#1f2326';
    ctx.fill();
    ctx.strokeStyle = '#141719';
    ctx.lineWidth = 0.9;
    ctx.stroke();

    var sillPoly = [[539, 221], [585, 221], [585, 226], [539, 226]];
    traceSubdividedPoly(ctx, sillPoly, deformFn, true, 14);
    ctx.fillStyle = '#e3d8c3';
    ctx.fill();
    ctx.strokeStyle = '#382f26';
    ctx.lineWidth = 0.9;
    ctx.stroke();

    ctx.strokeStyle = '#2d3337';
    ctx.lineWidth = 1.15;
    for (var wx = 550; wx <= 574; wx += 6) {
      var wTop = evalDeform(deformFn, wx, 173);
      var wBot = evalDeform(deformFn, wx, 217);
      ctx.beginPath();
      ctx.moveTo(wTop.x, wTop.y);
      ctx.lineTo(wBot.x, wBot.y);
      ctx.stroke();
    }
    for (var wy = 178; wy <= 213; wy += 7) {
      var wLeft = evalDeform(deformFn, 547, wy);
      var wRight = evalDeform(deformFn, 577, wy);
      ctx.beginPath();
      ctx.moveTo(wLeft.x, wLeft.y);
      ctx.lineTo(wRight.x, wRight.y);
      ctx.stroke();
    }

    /* Opposite Balcony Railing at A3 (525, 214) */
    var balSlab = [[495, 234], [541, 234], [541, 241], [495, 241]];
    traceSubdividedPoly(ctx, balSlab, deformFn, true, 12);
    ctx.fillStyle = '#d9ccb5';
    ctx.fill();
    ctx.strokeStyle = '#342c23';
    ctx.lineWidth = 1.05;
    ctx.stroke();

    var corbelXs = [501, 518, 535];
    for (var ci = 0; ci < corbelXs.length; ci++) {
      var cbx = corbelXs[ci];
      var cb0 = evalDeform(deformFn, cbx - 3, 241);
      var cb1 = evalDeform(deformFn, cbx + 3, 241);
      var cb2 = evalDeform(deformFn, cbx + 4, 253);
      ctx.fillStyle = '#b9aa92';
      ctx.beginPath();
      ctx.moveTo(cb0.x, cb0.y);
      ctx.lineTo(cb1.x, cb1.y);
      ctx.lineTo(cb2.x, cb2.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#342c23';
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    var railL = evalDeform(deformFn, 496, 214);
    var railM = evalDeform(deformFn, 525, 214);
    var railR = evalDeform(deformFn, 540, 214);
    var botL = evalDeform(deformFn, 496, 234);
    var botR = evalDeform(deformFn, 540, 234);

    ctx.strokeStyle = '#252a2e';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(railL.x, railL.y);
    ctx.quadraticCurveTo(railM.x, railM.y, railR.x, railR.y);
    ctx.stroke();

    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(botL.x, botL.y);
    ctx.lineTo(botR.x, botR.y);
    ctx.stroke();

    ctx.lineWidth = 0.8;
    for (var sp = 0; sp < 19; sp++) {
      var sx = lerp(497, 539, sp / 18);
      var sTop = evalDeform(deformFn, sx, 214);
      var sBot = evalDeform(deformFn, sx, 234);
      ctx.beginPath();
      ctx.moveTo(sTop.x, sTop.y);
      ctx.lineTo(sBot.x, sBot.y);
      ctx.stroke();
    }

    /* Bastion Plinth Cobbles at A2 (310, 292) & Iron Lamppost Finial at A1 (310, 168) */
    ctx.strokeStyle = '#433d35';
    ctx.lineWidth = 1.0;
    for (var ca = 0; ca < scene.cobbleArcs.length; ca++) {
      var arcItem = scene.cobbleArcs[ca];
      var cA = evalDeform(
        deformFn,
        310 + Math.cos(arcItem.a0) * arcItem.r,
        292 + Math.sin(arcItem.a0) * arcItem.r * 0.28 + 3
      );
      var cB = evalDeform(
        deformFn,
        310 + Math.cos(arcItem.a1) * arcItem.r,
        292 + Math.sin(arcItem.a1) * arcItem.r * 0.28 + 3
      );
      ctx.beginPath();
      ctx.moveTo(cA.x, cA.y);
      ctx.lineTo(cB.x, cB.y);
      ctx.stroke();
    }

    var plinthPoly = [[303, 292], [317, 292], [314, 274], [306, 274]];
    traceSubdividedPoly(ctx, plinthPoly, deformFn, true, 10);
    ctx.fillStyle = '#2d3236';
    ctx.fill();
    ctx.strokeStyle = '#181b1e';
    ctx.lineWidth = 1.0;
    ctx.stroke();

    ctx.strokeStyle = '#262b2f';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (var ly = 274; ly >= 184; ly -= 10) {
      var lp = evalDeform(deformFn, 310, ly);
      if (ly === 274) ctx.moveTo(lp.x, lp.y);
      else ctx.lineTo(lp.x, lp.y);
    }
    ctx.stroke();

    var crossL = evalDeform(deformFn, 302, 192);
    var crossR = evalDeform(deformFn, 318, 192);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(crossL.x, crossL.y);
    ctx.lineTo(crossR.x, crossR.y);
    ctx.stroke();

    var lanternPoly = [[305, 184], [315, 184], [317, 173], [303, 173]];
    traceSubdividedPoly(ctx, lanternPoly, deformFn, true, 8);
    ctx.fillStyle = 'rgba(232, 214, 168, 0.72)';
    ctx.fill();
    ctx.strokeStyle = '#22272a';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    var capBaseL = evalDeform(deformFn, 302, 173);
    var capBaseR = evalDeform(deformFn, 318, 173);
    var capFinial = evalDeform(deformFn, 310, 168);
    var capSpire = evalDeform(deformFn, 310, 162);
    ctx.fillStyle = '#2a3035';
    ctx.beginPath();
    ctx.moveTo(capBaseL.x, capBaseL.y);
    ctx.lineTo(capFinial.x, capFinial.y);
    ctx.lineTo(capBaseR.x, capBaseR.y);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#1e2327';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(capFinial.x, capFinial.y);
    ctx.lineTo(capSpire.x, capSpire.y);
    ctx.stroke();

    ctx.restore();
  }

  function inNetHole(holes, u, v) {
    for (var i = 0; i < holes.length; i++) {
      var h = holes[i];
      var du = (u - h.u) / h.ru;
      var dv = (v - h.v) / h.rv;
      if (du * du + dv * dv < 1.0) return true;
    }
    return false;
  }

  function renderQuayForeground(ctx, scene, deformFn) {
    ctx.save();

    /* Quay Coping Top Surface */
    var copingPoly = [[18, 480], [556, 480], [562, 492], [18, 492]];
    traceSubdividedPoly(ctx, copingPoly, deformFn, true, 24);
    ctx.fillStyle = '#cfc2aa';
    ctx.fill();
    ctx.strokeStyle = '#3a3228';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    /* Suspended Quay Fish Net at A8 (215, 496) */
    var ns = scene.netSpec;
    var postXs = [ns.x0 - 4, ns.x1 + 4];
    for (var pi = 0; pi < postXs.length; pi++) {
      var px = postXs[pi];
      var pBot = evalDeform(deformFn, px, 544);
      var pTop = evalDeform(deformFn, px, 440);
      ctx.strokeStyle = '#47392b';
      ctx.lineWidth = 3.8;
      ctx.beginPath();
      ctx.moveTo(pBot.x, pBot.y);
      ctx.lineTo(pTop.x, pTop.y);
      ctx.stroke();

      ctx.fillStyle = '#2c3135';
      ctx.beginPath();
      ctx.arc(pTop.x, pTop.y, 2.8, 0, Math.PI * 2);
      ctx.fill();
    }

    function netVertex(u, v) {
      var nx = lerp(ns.x0, ns.x1, u);
      var topSag = Math.sin(u * Math.PI) * 10.5;
      var botSag = Math.sin(u * Math.PI) * 5.5;
      var ny = lerp(ns.yTop + topSag, ns.yBot + botSag, v);
      return evalDeform(deformFn, nx, ny);
    }

    ctx.strokeStyle = '#4c3e30';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (var hu = 0; hu <= ns.cols; hu++) {
      var hp = netVertex(hu / ns.cols, 0);
      if (hu === 0) ctx.moveTo(hp.x, hp.y);
      else ctx.lineTo(hp.x, hp.y);
    }
    ctx.stroke();

    for (var fu = 0; fu <= ns.cols; fu += 2) {
      var fp = netVertex(fu / ns.cols, 0);
      ctx.fillStyle = '#9c7c52';
      ctx.beginPath();
      ctx.arc(fp.x, fp.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = 'rgba(72, 60, 46, 0.78)';
    ctx.lineWidth = 0.78;
    for (var r = 0; r < ns.rows; r++) {
      for (var c = 0; c < ns.cols; c++) {
        var u0 = c / ns.cols;
        var v0 = r / ns.rows;
        var u1 = (c + 1) / ns.cols;
        var v1 = (r + 1) / ns.rows;
        var holeA = inNetHole(ns.holes, (u0 + u1) * 0.5, (v0 + v1) * 0.5);
        if (holeA) continue;

        var p00 = netVertex(u0, v0);
        var p11 = netVertex(u1, v1);
        var p10 = netVertex(u1, v0);
        var p01 = netVertex(u0, v1);

        ctx.beginPath();
        ctx.moveTo(p00.x, p00.y);
        ctx.lineTo(p11.x, p11.y);
        ctx.moveTo(p10.x, p10.y);
        ctx.lineTo(p01.x, p01.y);
        ctx.stroke();
      }
    }

    /* Frayed loose mesh strands framing the 3 apertures */
    ctx.strokeStyle = '#3f3326';
    ctx.lineWidth = 0.9;
    for (var hi = 0; hi < ns.holes.length; hi++) {
      var hole = ns.holes[hi];
      for (var fa = 0; fa < 9; fa++) {
        var ang = (fa / 9) * Math.PI * 2;
        var ru0 = hole.u + Math.cos(ang) * hole.ru * 1.02;
        var rv0 = hole.v + Math.sin(ang) * hole.rv * 1.02;
        var ru1 = hole.u + Math.cos(ang) * hole.ru * 0.68;
        var rv1 = hole.v + Math.sin(ang) * hole.rv * 0.74 + 0.03;
        var e0 = netVertex(clamp(ru0, 0, 1), clamp(rv0, 0, 1));
        var e1 = netVertex(clamp(ru1, 0, 1), clamp(rv1, 0, 1));
        ctx.beginPath();
        ctx.moveTo(e0.x, e0.y);
        ctx.lineTo(e1.x, e1.y);
        ctx.stroke();
      }
    }

    /* Dock Mooring Bench & Twin Bollards at A9 (365, 532) */
    var bollardXs = [298, 434];
    for (var bxIdx = 0; bxIdx < bollardXs.length; bxIdx++) {
      var bx = bollardXs[bxIdx];
      var bBase = evalDeform(deformFn, bx, 548);
      var bTop = evalDeform(deformFn, bx, 534);
      ctx.fillStyle = '#2a2f33';
      ctx.beginPath();
      ctx.moveTo(bBase.x - 7, bBase.y);
      ctx.lineTo(bBase.x + 7, bBase.y);
      ctx.lineTo(bTop.x + 5, bTop.y);
      ctx.lineTo(bTop.x - 5, bTop.y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = '#1e2225';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(bTop.x - 8, bTop.y + 2);
      ctx.lineTo(bTop.x + 8, bTop.y + 2);
      ctx.stroke();
    }

    var legXs = [326, 404];
    for (var lxIdx = 0; lxIdx < legXs.length; lxIdx++) {
      var legPoly = [
        [legXs[lxIdx] - 5, 536],
        [legXs[lxIdx] + 5, 536],
        [legXs[lxIdx] + 6, 550],
        [legXs[lxIdx] - 6, 550]
      ];
      traceSubdividedPoly(ctx, legPoly, deformFn, true, 10);
      ctx.fillStyle = '#9f9179';
      ctx.fill();
      ctx.strokeStyle = '#382f25';
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }

    var benchSeat = [[316, 530], [414, 530], [416, 537], [314, 537]];
    traceSubdividedPoly(ctx, benchSeat, deformFn, true, 14);
    ctx.fillStyle = '#d8cbb4';
    ctx.fill();
    ctx.strokeStyle = '#342b22';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    /* 3 Silent Seated Architectural Staffage Silhouettes on the Bench */
    var seatProfiles = [
      { x: 340, tilt: 2.2, h: 25 },
      { x: 365, tilt: -0.6, h: 26 },
      { x: 390, tilt: -2.4, h: 24.5 }
    ];
    for (var spIdx = 0; spIdx < seatProfiles.length; spIdx++) {
      var fig = seatProfiles[spIdx];
      var hip = evalDeform(deformFn, fig.x, 531);
      var shldr = evalDeform(deformFn, fig.x + fig.tilt, 531 - fig.h * 0.65);
      var head = evalDeform(deformFn, fig.x + fig.tilt * 1.35, 531 - fig.h);
      var knee = evalDeform(deformFn, fig.x + (spIdx === 2 ? -5 : 5), 536);
      var foot = evalDeform(deformFn, fig.x + (spIdx === 2 ? -4 : 4), 549);

      ctx.fillStyle = '#322d28';
      ctx.beginPath();
      ctx.moveTo(hip.x - 6.5, hip.y);
      ctx.quadraticCurveTo(shldr.x - 7, shldr.y, shldr.x - 2, shldr.y - 2);
      ctx.lineTo(shldr.x + 4, shldr.y - 1);
      ctx.quadraticCurveTo(hip.x + 6.5, hip.y - 4, knee.x + 3, knee.y);
      ctx.lineTo(foot.x + 2.5, foot.y);
      ctx.lineTo(foot.x - 2.5, foot.y);
      ctx.lineTo(knee.x - 3, knee.y + 1);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(head.x, head.y, 4.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(218, 204, 178, 0.38)';
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.moveTo(shldr.x - 1, shldr.y + 4);
      ctx.lineTo(knee.x, knee.y - 3);
      ctx.stroke();
    }

    /* Subtle draped cord bridging bench laps */
    var lapL = evalDeform(deformFn, 338, 526);
    var lapM = evalDeform(deformFn, 365, 529);
    var lapR = evalDeform(deformFn, 392, 526);
    ctx.strokeStyle = 'rgba(92, 76, 56, 0.72)';
    ctx.lineWidth = 0.85;
    ctx.beginPath();
    ctx.moveTo(lapL.x, lapL.y);
    ctx.quadraticCurveTo(lapM.x, lapM.y, lapR.x, lapR.y);
    ctx.stroke();

    ctx.restore();
  }

  function renderDraftingPlateFrame(ctx) {
    ctx.save();
    ctx.strokeStyle = '#3e3429';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(10, 10, LOGICAL_WIDTH - 20, LOGICAL_HEIGHT - 20);

    ctx.strokeStyle = 'rgba(62, 52, 41, 0.45)';
    ctx.lineWidth = 0.7;
    ctx.strokeRect(14, 14, LOGICAL_WIDTH - 28, LOGICAL_HEIGHT - 28);

    ctx.strokeStyle = 'rgba(62, 52, 41, 0.55)';
    ctx.lineWidth = 0.65;
    for (var tx = 40; tx < LOGICAL_WIDTH - 20; tx += 20) {
      var tickH = tx % 100 === 0 ? 4.5 : 2.5;
      ctx.beginPath();
      ctx.moveTo(tx, 10);
      ctx.lineTo(tx, 10 + tickH);
      ctx.moveTo(tx, LOGICAL_HEIGHT - 10);
      ctx.lineTo(tx, LOGICAL_HEIGHT - 10 - tickH);
      ctx.stroke();
    }
    for (var ty = 40; ty < LOGICAL_HEIGHT - 20; ty += 20) {
      var tickW = ty % 100 === 0 ? 4.5 : 2.5;
      ctx.beginPath();
      ctx.moveTo(10, ty);
      ctx.lineTo(10 + tickW, ty);
      ctx.moveTo(LOGICAL_WIDTH - 10, ty);
      ctx.lineTo(LOGICAL_WIDTH - 10 - tickW, ty);
      ctx.stroke();
    }

    /* Engraved Cubit Graphic Scale Bar in bottom-left margin */
    var sbX = 32;
    var sbY = 595;
    for (var seg = 0; seg < 4; seg++) {
      ctx.fillStyle = seg % 2 === 0 ? '#3e3429' : '#dfd4be';
      ctx.fillRect(sbX + seg * 24, sbY - 3, 24, 3.5);
      ctx.strokeStyle = '#3e3429';
      ctx.lineWidth = 0.7;
      ctx.strokeRect(sbX + seg * 24, sbY - 3, 24, 3.5);
    }
    ctx.fillStyle = '#3e3429';
    ctx.font = '600 8.5px "Courier New", monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'bottom';
    ctx.fillText('0        10       20 CUBITS · ORTHOGRAPHIC ELEVATION', sbX, sbY - 5);
    ctx.restore();
  }

  function hasIdInSetOrArray(collection, id, code) {
    if (!collection) return false;
    if (Array.isArray(collection)) {
      return collection.indexOf(id) !== -1 || (code ? collection.indexOf(code) !== -1 : false);
    }
    if (typeof collection.has === 'function') {
      return collection.has(id) || (code ? collection.has(code) : false);
    }
    return false;
  }

  function renderSurveyAnchors(ctx, state, deformFn, time, reducedMotion) {
    var st = state || {};
    var hoveredId = st.hoveredAnchorId || null;
    var pinnedId = st.pinnedAnchorId || null;
    var focusedId = st.focusedAnchorId || null;
    var partnerHints = st.partnerHintIds || null;

    var deformedMap = {};
    for (var i = 0; i < ANCHORS.length; i++) {
      var anc = ANCHORS[i];
      deformedMap[anc.id] = evalDeform(deformFn, anc.x, anc.y);
      deformedMap[anc.code] = deformedMap[anc.id];
    }

    var pinnedPos = pinnedId && deformedMap[pinnedId] ? deformedMap[pinnedId] : null;

    ctx.save();
    for (var k = 0; k < ANCHORS.length; k++) {
      var a = ANCHORS[k];
      var dp = deformedMap[a.id];
      var isPinned = pinnedId === a.id || pinnedId === a.code;
      var isHovered = hoveredId === a.id || hoveredId === a.code;
      var isFocused = focusedId === a.id || focusedId === a.code;
      var isPartner = hasIdInSetOrArray(partnerHints, a.id, a.code);

      if (isPartner && !isPinned) {
        var glintPulse = reducedMotion ? 0.72 : (0.55 + 0.35 * Math.sin(time * 2.6 + k * 0.9));
        if (pinnedPos) {
          ctx.save();
          ctx.strokeStyle = 'rgba(186, 146, 62, ' + (0.24 * glintPulse).toFixed(3) + ')';
          ctx.lineWidth = 0.75;
          ctx.setLineDash([3, 5]);
          ctx.beginPath();
          ctx.moveTo(pinnedPos.x, pinnedPos.y);
          ctx.lineTo(dp.x, dp.y);
          ctx.stroke();
          ctx.restore();
        }

        ctx.strokeStyle = 'rgba(204, 162, 72, ' + (0.78 * glintPulse).toFixed(3) + ')';
        ctx.lineWidth = 1.05;
        ctx.beginPath();
        ctx.arc(dp.x, dp.y, 12.5, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(dp.x, dp.y - 16);
        ctx.lineTo(dp.x, dp.y - 10);
        ctx.moveTo(dp.x, dp.y + 10);
        ctx.lineTo(dp.x, dp.y + 16);
        ctx.stroke();
      }

      if (isHovered || isFocused || isPinned) {
        var haloR = isPinned ? 15.5 : 13.5;
        var haloGrad = ctx.createRadialGradient(dp.x, dp.y, 3, dp.x, dp.y, haloR);
        haloGrad.addColorStop(0, isPinned ? 'rgba(224, 182, 86, 0.55)' : 'rgba(214, 174, 82, 0.38)');
        haloGrad.addColorStop(1, 'rgba(214, 174, 82, 0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(dp.x, dp.y, haloR, 0, Math.PI * 2);
        ctx.fill();
      }

      var outerR = isPinned ? 8.8 : (isHovered || isFocused ? 8.0 : 6.6);

      ctx.strokeStyle = '#221c15';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(dp.x - outerR - 3.5, dp.y);
      ctx.lineTo(dp.x + outerR + 3.5, dp.y);
      ctx.moveTo(dp.x, dp.y - outerR - 3.5);
      ctx.lineTo(dp.x, dp.y + outerR + 3.5);
      ctx.stroke();

      var brassGrad = ctx.createRadialGradient(dp.x - 2, dp.y - 2, 1, dp.x, dp.y, outerR);
      brassGrad.addColorStop(0, '#f3dc99');
      brassGrad.addColorStop(0.55, '#c69b45');
      brassGrad.addColorStop(1, '#7c5b20');

      ctx.fillStyle = brassGrad;
      ctx.beginPath();
      ctx.arc(dp.x, dp.y, outerR, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isPinned ? '#fff2c6' : '#261e16';
      ctx.lineWidth = isPinned ? 1.5 : 1.1;
      ctx.stroke();

      ctx.fillStyle = '#231c14';
      ctx.beginPath();
      ctx.arc(dp.x, dp.y, 2.2, 0, Math.PI * 2);
      ctx.fill();

      if (isPinned || isFocused) {
        ctx.strokeStyle = isPinned ? '#d8aa4c' : '#8e6c28';
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(dp.x, dp.y, outerR + 3.2, 0, Math.PI * 2);
        ctx.stroke();
      }

      /* Crisp Engraved Code Callout Tag (A1..A9 only — zero spoiler text) */
      var tx = clamp(dp.x + a.tagDx, 28, LOGICAL_WIDTH - 28);
      var ty = clamp(dp.y + a.tagDy, 24, LOGICAL_HEIGHT - 24);
      ctx.strokeStyle = 'rgba(56, 44, 30, 0.55)';
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(dp.x, dp.y);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      var pillW = 24;
      var pillH = 14;
      ctx.fillStyle = isPinned ? '#2a2117' : (isHovered || isFocused ? '#382c1e' : 'rgba(240, 232, 214, 0.92)');
      ctx.strokeStyle = isPinned || isHovered || isFocused ? '#d8ad52' : '#5c4932';
      ctx.lineWidth = 0.95;
      ctx.beginPath();
      ctx.rect(tx - pillW * 0.5, ty - pillH * 0.5, pillW, pillH);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isPinned || isHovered || isFocused ? '#f7e5b4' : '#2b2218';
      ctx.font = '700 9.5px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(a.code, tx, ty + 0.5);
    }
    ctx.restore();
  }

  function renderArchitecture(ctx, state, optionalScene) {
    if (!ctx) return;
    var st = state || {};
    var scene = optionalScene || st.scene || defaultScene || createScene(404);
    var time = typeof st.time === 'number' && isFinite(st.time) ? st.time : 0;
    var reducedMotion = Boolean(st.reducedMotion);
    var deformFn = typeof st.deformPoint === 'function' ? st.deformPoint : null;
    var spongeLevel = typeof st.spongeLevel === 'number' && isFinite(st.spongeLevel)
      ? clamp(st.spongeLevel, 0, 1)
      : 0;

    ctx.save();
    renderBackgroundAndSea(ctx, scene, deformFn, time, reducedMotion);

    for (var bi = 0; bi < scene.bastions.length; bi++) {
      var bastion = scene.bastions[bi];
      renderBastionMass(ctx, bastion, deformFn, spongeLevel, time, reducedMotion);
      if (bastion.id === 'central_arcade') {
        renderCurvedArcades(ctx, bastion, deformFn);
      }
    }

    renderZincRoofsAndSpires(ctx, scene, deformFn, time, reducedMotion);
    renderStairStreets(ctx, scene, deformFn);
    renderElevationLandmarks(ctx, scene, deformFn);
    renderQuayForeground(ctx, scene, deformFn);
    renderDraftingPlateFrame(ctx);
    renderSurveyAnchors(ctx, st, deformFn, time, reducedMotion);
    ctx.restore();
  }

  function isExactRawAnchor(x, y) {
    for (var i = 0; i < ANCHORS.length; i++) {
      if (Math.abs(ANCHORS[i].x - x) < 0.05 && Math.abs(ANCHORS[i].y - y) < 0.05) {
        return true;
      }
    }
    return false;
  }

  function classifyMotifMode(motif) {
    var m = String(motif || '').toLowerCase();
    if (m.indexOf('pendulum') !== -1 || m === 'span_1') return 1;
    if (m.indexOf('garland') !== -1 || m === 'span_2') return 2;
    if (m.indexOf('vault') !== -1 || m === 'span_3') return 3;
    if (m.indexOf('tick') !== -1 || m === 'span_4') return 4;
    if (m.indexOf('weft') !== -1 || m === 'span_6') return 6;
    if (m.indexOf('scrolls') !== -1 || m === 'span_5') return 5;
    return (hashText(m) % 6) + 1;
  }

  function drawSpiralScroll(ctx, cx, cy, startAngle, radiusScale, chirality, turns) {
    var steps = 22;
    var maxTheta = (turns || 2.1) * Math.PI * 2;
    ctx.beginPath();
    for (var i = 0; i <= steps; i++) {
      var f = i / steps;
      var th = startAngle + chirality * f * maxTheta;
      var r = radiusScale * Math.pow(1 - f * 0.86, 1.15);
      var sx = cx + Math.cos(th) * r;
      var sy = cy + Math.sin(th) * r;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();
  }

  function renderPalmChiromancy(ctx, x1, y1, x2, y2, motif, intensity, deformPoint, time, reducedMotion) {
    if (!ctx) return;
    var power = typeof intensity === 'number' && isFinite(intensity) ? clamp(intensity, 0, 1) : 1;
    if (power <= 0.005) return;

    var mode = classifyMotifMode(motif);
    var rng = mulberry32(hashText(String(motif || 'palm') + ':' + Math.round(x1) + ':' + Math.round(y1)));
    var rawEndpoints = isExactRawAnchor(x1, y1) && isExactRawAnchor(x2, y2);

    var dx = x2 - x1;
    var dy = y2 - y1;
    var spanLen = Math.max(1, Math.hypot(dx, dy));
    var tx = dx / spanLen;
    var ty = dy / spanLen;
    var nx = -ty;
    var ny = tx;

    function curvePoint(t, lateralOffset) {
      var bx = lerp(x1, x2, t);
      var by = lerp(y1, y2, t);
      var arch = 0;
      if (mode === 2) {
        var scallop = Math.abs(Math.sin(t * Math.PI * 3));
        arch = (1 - scallop) * 14 * Math.sin(t * Math.PI) + Math.sin(t * Math.PI) * 10;
      } else if (mode === 3) {
        arch = -Math.sin(t * Math.PI) * 18;
      } else if (mode === 5) {
        by -= Math.sin(t * Math.PI) * Math.min(72, spanLen * 0.22);
      } else if (mode === 6) {
        arch = Math.sin(t * Math.PI * 2) * 7.5;
      } else {
        arch = Math.sin(t * Math.PI) * (mode === 1 ? 5.5 : 4.0);
      }

      var px = bx + nx * (arch + (lateralOffset || 0));
      var py = by + ny * (arch + (lateralOffset || 0));

      if (typeof deformPoint === 'function') {
        if (rawEndpoints) {
          var dpFull = evalDeform(deformPoint, px, py);
          return { x: dpFull.x, y: dpFull.y };
        }
        var dpMid = evalDeform(deformPoint, px, py);
        var env = Math.sin(t * Math.PI);
        return {
          x: px + (dpMid.x - px) * env,
          y: py + (dpMid.y - py) * env
        };
      }
      return { x: px, y: py };
    }

    ctx.save();
    var shimmer = reducedMotion ? 0 : Math.sin((time || 0) * 1.6 + mode) * 0.04;
    var baseAlpha = clamp(power * (0.86 + shimmer), 0, 1);

    /* 1. Primary Triple Chiromantic Creases ("like the lines of a hand") */
    var creaseCount = mode === 6 ? 4 : 3;
    var sampleSteps = clamp(Math.round(spanLen / 7), 18, 56);

    for (var cl = 0; cl < creaseCount; cl++) {
      var laneBias = (cl - (creaseCount - 1) * 0.5) * (mode === 4 ? 2.4 : 4.2);
      var phaseSeed = rng() * Math.PI * 2;
      ctx.strokeStyle = cl === 1
        ? 'rgba(34, 24, 16, ' + (baseAlpha * 0.9).toFixed(3) + ')'
        : (cl === 0
          ? 'rgba(78, 54, 34, ' + (baseAlpha * 0.68).toFixed(3) + ')'
          : 'rgba(46, 82, 76, ' + (baseAlpha * 0.58).toFixed(3) + ')');
      ctx.lineWidth = cl === 1 ? 1.45 : 0.85;
      ctx.beginPath();
      for (var s = 0; s <= sampleSteps; s++) {
        var u = s / sampleSteps;
        if (u > power) break;
        var wave = Math.sin(u * Math.PI * 5 + phaseSeed) * 1.9 * Math.sin(u * Math.PI);
        var cp = curvePoint(u, laneBias + wave);
        if (s === 0) ctx.moveTo(cp.x, cp.y);
        else ctx.lineTo(cp.x, cp.y);
      }
      ctx.stroke();
    }

    /* 2. Forking Dermal Crease Branches */
    var branchNodes = 5 + (mode % 3);
    ctx.strokeStyle = 'rgba(48, 34, 22, ' + (baseAlpha * 0.62).toFixed(3) + ')';
    ctx.lineWidth = 0.72;
    for (var bn = 1; bn <= branchNodes; bn++) {
      var bt = (bn / (branchNodes + 1)) * power;
      var rootPt = curvePoint(bt, 0);
      var sideSign = bn % 2 === 0 ? 1 : -1;
      var branchLen = 8 + rng() * 11;
      var bAng = Math.atan2(ty, tx) + sideSign * (0.42 + rng() * 0.45);
      ctx.beginPath();
      ctx.moveTo(rootPt.x, rootPt.y);
      ctx.quadraticCurveTo(
        rootPt.x + Math.cos(bAng - sideSign * 0.18) * branchLen * 0.55,
        rootPt.y + Math.sin(bAng - sideSign * 0.18) * branchLen * 0.55,
        rootPt.x + Math.cos(bAng) * branchLen,
        rootPt.y + Math.sin(bAng) * branchLen
      );
      ctx.stroke();
    }

    /* 3. Cross-Hatched Steel-Burin Scratches */
    var scratchCount = clamp(Math.round(spanLen / (mode === 4 ? 9 : 13)), 10, 34);
    ctx.strokeStyle = 'rgba(32, 24, 18, ' + (baseAlpha * 0.74).toFixed(3) + ')';
    ctx.lineWidth = 0.68;
    for (var sc = 1; sc < scratchCount; sc++) {
      var st = (sc / scratchCount) * power;
      var sp = curvePoint(st, (rng() - 0.5) * 4);
      var halfTick = (mode === 4 ? 3.2 : 4.6) + rng() * 2.8;
      var tiltA = Math.atan2(ny, nx) + (mode === 1 ? 0.18 : 0.48);
      ctx.beginPath();
      ctx.moveTo(sp.x - Math.cos(tiltA) * halfTick, sp.y - Math.sin(tiltA) * halfTick);
      ctx.lineTo(sp.x + Math.cos(tiltA) * halfTick, sp.y + Math.sin(tiltA) * halfTick);
      if (sc % 2 === 0 || mode === 6) {
        var tiltB = tiltA - 0.92;
        ctx.moveTo(sp.x - Math.cos(tiltB) * halfTick * 0.85, sp.y - Math.sin(tiltB) * halfTick * 0.85);
        ctx.lineTo(sp.x + Math.cos(tiltB) * halfTick * 0.85, sp.y + Math.sin(tiltB) * halfTick * 0.85);
      }
      ctx.stroke();
    }

    /* 4. Chiseled Stone Indentations */
    var notchCount = mode === 3 || mode === 4 ? 11 : 7;
    for (var ni = 1; ni <= notchCount; ni++) {
      var nt = (ni / (notchCount + 1)) * power;
      var np = curvePoint(nt, (ni % 2 === 0 ? 1 : -1) * (mode === 4 ? 2.2 : 5.2));
      var nr = mode === 4 ? 1.55 : 2.1;

      ctx.fillStyle = 'rgba(30, 22, 15, ' + (baseAlpha * 0.78).toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(np.x, np.y - nr);
      ctx.lineTo(np.x + nr * 1.15, np.y);
      ctx.lineTo(np.x, np.y + nr);
      ctx.lineTo(np.x - nr * 1.15, np.y);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(245, 236, 214, ' + (baseAlpha * 0.55).toFixed(3) + ')';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(np.x + nr * 1.15, np.y);
      ctx.lineTo(np.x, np.y + nr);
      ctx.lineTo(np.x - nr * 1.15, np.y);
      ctx.stroke();
    }

    /* 5. Calligraphic Volute Scrolls */
    var scrollPositions = mode === 2 ? [0.22, 0.5, 0.78] : (mode === 6 ? [0.2, 0.5, 0.8] : [0.28, 0.72]);
    ctx.strokeStyle = 'rgba(146, 106, 42, ' + (baseAlpha * 0.76).toFixed(3) + ')';
    ctx.lineWidth = 0.92;
    for (var vi = 0; vi < scrollPositions.length; vi++) {
      var vt = scrollPositions[vi];
      if (vt > power) continue;
      var vp = curvePoint(vt, (vi % 2 === 0 ? 1 : -1) * 7.2);
      drawSpiralScroll(
        ctx,
        vp.x,
        vp.y,
        Math.atan2(ty, tx) + vi * 1.1,
        5.5 + (mode === 5 ? 2.2 : 0.8),
        vi % 2 === 0 ? 1 : -1,
        1.85
      );
    }

    ctx.restore();
  }

  function getAnchor(idOrCode) {
    if (!idOrCode) return null;
    return ANCHOR_MAP[idOrCode] || ANCHOR_BY_CODE[idOrCode] || null;
  }

  function getDeformedAnchors(deformPoint) {
    var out = [];
    for (var i = 0; i < ANCHORS.length; i++) {
      var a = ANCHORS[i];
      var dp = evalDeform(deformPoint, a.x, a.y);
      out.push({
        id: a.id,
        code: a.code,
        x: a.x,
        y: a.y,
        deformedX: dp.x,
        deformedY: dp.y,
        swell: dp.swell,
        label: a.label,
        staticMetric: a.staticMetric
      });
    }
    return out;
  }

  var ZairaMuteBastions = {
    LOGICAL_WIDTH: LOGICAL_WIDTH,
    LOGICAL_HEIGHT: LOGICAL_HEIGHT,
    ANCHORS: ANCHORS,
    ANCHOR_MAP: ANCHOR_MAP,
    getAnchor: getAnchor,
    getDeformedAnchors: getDeformedAnchors,
    createScene: createScene,
    renderArchitecture: renderArchitecture,
    renderPalmChiromancy: renderPalmChiromancy
  };

  var root = typeof window !== 'undefined' ? window : globalThis;
  root.ZairaMuteBastions = ZairaMuteBastions;
  if (typeof globalThis !== 'undefined') {
    globalThis.ZairaMuteBastions = ZairaMuteBastions;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ZairaMuteBastions;
  }
})();
