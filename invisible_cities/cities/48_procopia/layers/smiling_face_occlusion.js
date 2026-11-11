/*
 * City 48: Procopia — Annual Multitude, Stratum Occlusion & 26 Room Lodgers
 * Traveler's Inn-Window Ledger Module (Standalone Browser IIFE)
 * Exposes globalThis.ProcopiaFaceOcclusion
 */
(function (root) {
  'use strict';

  var STRATA_IDS = Object.freeze([
    'ditch',
    'bridge',
    'little_wall',
    'medlar_tree',
    'cornfield',
    'blackberry_bushes',
    'chicken_yard',
    'yellow_hill',
    'trapeze_sky'
  ]);

  var ANNUAL_STEPS = Object.freeze([
    Object.freeze({
      yearIndex: 0,
      yearNumber: 1,
      visitRoman: 'I',
      count: 0,
      key: 'solitude',
      roomOccupants: 0,
      narrative: 'Same room at the inn: lifting the raw-linen curtain discloses a ditch, a bridge, a little wall, a medlar tree, a field of corn, thorny blackberry bushes, a chicken yard, the yellow hump of a hill, and an upside-down trapeze of sky—not a soul in sight.'
    }),
    Object.freeze({
      yearIndex: 1,
      yearNumber: 2,
      visitRoman: 'II',
      count: 1,
      key: 'first_peasant',
      roomOccupants: 0,
      narrative: 'Returning next harvest, one countryman stands in the ditch beneath the sill: round flat face, full rosy-ochre cheeks, calm eyes, and a golden ear of corn held horizontally between both hands at his polite smile.'
    }),
    Object.freeze({
      yearIndex: 2,
      yearNumber: 3,
      visitRoman: 'III',
      count: 3,
      key: 'ditch_hidden',
      roomOccupants: 0,
      narrative: 'Three good-natured inhabitants now sit and stand shoulder to shoulder along the embankment; the ditch is altogether hidden behind their round smiling cheeks and husked cobs of maize.'
    }),
    Object.freeze({
      yearIndex: 3,
      yearNumber: 4,
      visitRoman: 'IV',
      count: 6,
      key: 'bridge_wall_hidden',
      roomOccupants: 1,
      narrative: 'Six round, flat faces fill the lower casement; neither the rustic bridge nor the little stone wall remains visible, and behind me one quiet lodger already crouches politely on the pegged floorboards.'
    }),
    Object.freeze({
      yearIndex: 4,
      yearNumber: 5,
      visitRoman: 'V',
      count: 16,
      key: 'medlar_thorns_gone',
      roomOccupants: 3,
      narrative: 'Sixteen full-cheeked citizens crowd past the orchard line, swallowing the gnarled medlar tree and the thorny blackberry canes beneath straw brims, knotted kerchiefs, and nibbled ears of corn.'
    }),
    Object.freeze({
      yearIndex: 5,
      yearNumber: 6,
      visitRoman: 'VI',
      count: 29,
      key: 'cornfield_gone',
      roomOccupants: 7,
      narrative: 'Twenty-nine calm, smiling faces stand where the field of corn once tasseled; the stalks have vanished behind those who hold the golden ears horizontally to their teeth, while seven rest quietly in my room.'
    }),
    Object.freeze({
      yearIndex: 6,
      yearNumber: 7,
      visitRoman: 'VII',
      count: 47,
      key: 'chickens_gone',
      roomOccupants: 13,
      narrative: 'Forty-seven amiable countryfolk cover the chicken yard and climb the lower slope; only the yellow hump of the hill and the upside-down trapeze of sky still breathe above their round faces.'
    }),
    Object.freeze({
      yearIndex: 7,
      yearNumber: 8,
      visitRoman: 'VIII',
      count: 144,
      key: 'hill_carpeted',
      roomOccupants: 19,
      narrative: 'One hundred and forty-four round, flat faces carpet the entire yellow hump of the hill; above that silent, smiling multitude, nothing of the landscape remains save the patch of sky shaped like an upside-down trapeze.'
    }),
    Object.freeze({
      yearIndex: 8,
      yearNumber: 9,
      visitRoman: 'IX',
      count: 360,
      key: 'full_saturation',
      roomOccupants: 26,
      narrative: 'Three hundred and sixty smiling faces pack the window from sill to lintel—even the upside-down trapeze of sky is gone. Stepping back into the tiny inn room, twenty-six polite lodgers crouch on the floor, perch on the chest, and share the bed, parting their knees as I pass.'
    })
  ]);

  var ROOM_BREAKDOWNS = Object.freeze([
    Object.freeze({ floor: 0, chest: 0, bed: 0 }),
    Object.freeze({ floor: 0, chest: 0, bed: 0 }),
    Object.freeze({ floor: 0, chest: 0, bed: 0 }),
    Object.freeze({ floor: 1, chest: 0, bed: 0 }),
    Object.freeze({ floor: 1, chest: 1, bed: 1 }),
    Object.freeze({ floor: 3, chest: 2, bed: 2 }),
    Object.freeze({ floor: 5, chest: 4, bed: 4 }),
    Object.freeze({ floor: 7, chest: 6, bed: 6 }),
    Object.freeze({ floor: 9, chest: 8, bed: 9 })
  ]);

  var OCCLUSION_TABLE = Object.freeze([
    { ditch: 0.00, bridge: 0.00, little_wall: 0.00, medlar_tree: 0.00, cornfield: 0.00, blackberry_bushes: 0.00, chicken_yard: 0.00, yellow_hill: 0.00, trapeze_sky: 0.00 },
    { ditch: 0.52, bridge: 0.00, little_wall: 0.00, medlar_tree: 0.00, cornfield: 0.00, blackberry_bushes: 0.00, chicken_yard: 0.00, yellow_hill: 0.00, trapeze_sky: 0.00 },
    { ditch: 1.00, bridge: 0.35, little_wall: 0.00, medlar_tree: 0.00, cornfield: 0.00, blackberry_bushes: 0.00, chicken_yard: 0.00, yellow_hill: 0.00, trapeze_sky: 0.00 },
    { ditch: 1.00, bridge: 1.00, little_wall: 1.00, medlar_tree: 0.25, cornfield: 0.00, blackberry_bushes: 0.00, chicken_yard: 0.00, yellow_hill: 0.00, trapeze_sky: 0.00 },
    { ditch: 1.00, bridge: 1.00, little_wall: 1.00, medlar_tree: 1.00, cornfield: 0.30, blackberry_bushes: 1.00, chicken_yard: 0.00, yellow_hill: 0.00, trapeze_sky: 0.00 },
    { ditch: 1.00, bridge: 1.00, little_wall: 1.00, medlar_tree: 1.00, cornfield: 1.00, blackberry_bushes: 1.00, chicken_yard: 0.35, yellow_hill: 0.00, trapeze_sky: 0.00 },
    { ditch: 1.00, bridge: 1.00, little_wall: 1.00, medlar_tree: 1.00, cornfield: 1.00, blackberry_bushes: 1.00, chicken_yard: 1.00, yellow_hill: 0.38, trapeze_sky: 0.00 },
    { ditch: 1.00, bridge: 1.00, little_wall: 1.00, medlar_tree: 1.00, cornfield: 1.00, blackberry_bushes: 1.00, chicken_yard: 1.00, yellow_hill: 1.00, trapeze_sky: 0.28 },
    { ditch: 1.00, bridge: 1.00, little_wall: 1.00, medlar_tree: 1.00, cornfield: 1.00, blackberry_bushes: 1.00, chicken_yard: 1.00, yellow_hill: 1.00, trapeze_sky: 1.00 }
  ]);

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function clampYearIndex(idx) {
    var n = Number(idx);
    if (!Number.isFinite(n)) return 0;
    return clamp(Math.round(n), 0, ANNUAL_STEPS.length - 1);
  }

  function getOcclusionByStratum(yearIndex) {
    var yi = clampYearIndex(yearIndex);
    var src = OCCLUSION_TABLE[yi];
    var copy = {};
    for (var i = 0; i < STRATA_IDS.length; i++) {
      var k = STRATA_IDS[i];
      copy[k] = src[k];
    }
    return copy;
  }

  function computeStrataMetrics(occ, yearIndex) {
    var visibleCount = 0;
    for (var i = 0; i < STRATA_IDS.length; i++) {
      if ((1 - occ[STRATA_IDS[i]]) > 0.05) {
        visibleCount++;
      }
    }
    var ditchVis = (1 - occ.ditch) > 0.05;
    var skyVis = (1 - occ.trapeze_sky) > 0.05;
    return {
      visibleStrataCount: visibleCount,
      ditchVisible: ditchVis,
      skyVisible: skyVis,
      horizonFaceWall: yearIndex === 8 && !skyVis && visibleCount === 0
    };
  }

  function hashU32(seed) {
    var x = (seed | 0) + 0x9e3779b9;
    x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
    x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
    return (x ^ (x >>> 16)) >>> 0;
  }

  function rand01(seed, salt) {
    return hashU32(Math.imul(seed + 17, 374761393) + Math.imul(salt + 31, 668265263)) / 4294967296;
  }

  function normRect(r, fb) {
    if (!r) return fb;
    var x = Number.isFinite(r.x) ? r.x : (Number.isFinite(r.xMin) ? r.xMin : fb.x);
    var y = Number.isFinite(r.y) ? r.y : (Number.isFinite(r.yMin) ? r.yMin : fb.y);
    var w = Number.isFinite(r.w) ? r.w : (Number.isFinite(r.width) ? r.width : (Number.isFinite(r.xMax) ? r.xMax - x : fb.w));
    var h = Number.isFinite(r.h) ? r.h : (Number.isFinite(r.height) ? r.height : (Number.isFinite(r.yMax) ? r.yMax - y : fb.h));
    return { x: x, y: y, w: Math.max(8, w), h: Math.max(8, h) };
  }

  function resolveAperture(ctx, layout) {
    var cw = (ctx && ctx.canvas && ctx.canvas.width) ? ctx.canvas.width : 960;
    var ch = (ctx && ctx.canvas && ctx.canvas.height) ? ctx.canvas.height : 640;
    var fb = { x: cw * 0.16, y: ch * 0.11, w: cw * 0.68, h: ch * 0.76 };
    return normRect(layout && layout.aperture, fb);
  }

  var DEFAULT_BAND_SLICE = {
    trapeze_sky: [0.00, 0.16],
    yellow_hill: [0.11, 0.31],
    chicken_yard: [0.28, 0.42],
    blackberry_bushes: [0.39, 0.53],
    cornfield: [0.46, 0.63],
    medlar_tree: [0.57, 0.73],
    little_wall: [0.69, 0.81],
    bridge: [0.77, 0.90],
    ditch: [0.86, 1.00]
  };

  function getBandBox(layout, ap, id) {
    var sl = DEFAULT_BAND_SLICE[id] || [0.5, 0.7];
    var b = layout && layout.strataBands && layout.strataBands[id];
    var xMin = (b && Number.isFinite(b.xMin)) ? b.xMin : ap.x;
    var xMax = (b && Number.isFinite(b.xMax)) ? b.xMax : (ap.x + ap.w);
    var yMin = (b && Number.isFinite(b.yMin)) ? b.yMin : (ap.y + ap.h * sl[0]);
    var yMax = (b && Number.isFinite(b.yMax)) ? b.yMax : (ap.y + ap.h * sl[1]);
    var cy = (b && Number.isFinite(b.centerY)) ? b.centerY : (yMin + yMax) * 0.5;
    return { xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax, centerY: cy };
  }

  function pointInPoly(px, py, poly) {
    if (!poly || poly.length < 3) return false;
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var xi = poly[i].x, yi = poly[i].y;
      var xj = poly[j].x, yj = poly[j].y;
      var intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / ((yj - yi) || 1e-6) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  var SKIN_TONES = ['#eac092', '#e3b382', '#efd0a4', '#dca676', '#e8ba8b', '#f0c89b', '#d9a070'];
  var CHEEK_TONES = ['rgba(216,104,78,0.40)', 'rgba(208,92,72,0.38)', 'rgba(224,116,84,0.42)', 'rgba(198,88,68,0.36)'];
  var TUNIC_TONES = ['#8b5a36', '#5e7248', '#a66a3e', '#4c6572', '#9c7d46', '#794838', '#687058', '#b5894d'];
  var KERCHIEF_TONES = ['#c45838', '#6a8252', '#496878', '#cc943c', '#9e4b3e', '#7c6244'];
  var HAT_STRAW = ['#dfc27d', '#d6b56d', '#e6cb89', '#cca960'];

  function drawHorizontalCornCob(ctx, cx, my, r, seed, skinHex, detailLevel, nibbleShift) {
    var cobW = r * 1.18;
    var cobH = Math.max(3.2, r * 0.31);
    var cy = my + r * 0.11;
    var ox = cx + nibbleShift;

    // Peeled pale-celadon corn husks flaring left and right
    ctx.fillStyle = '#9db06f';
    ctx.strokeStyle = '#536334';
    ctx.lineWidth = Math.max(0.8, r * 0.045);
    for (var side = -1; side <= 1; side += 2) {
      ctx.beginPath();
      var hx = ox + side * cobW * 0.46;
      ctx.moveTo(hx, cy);
      ctx.quadraticCurveTo(hx + side * r * 0.34, cy - cobH * 0.95, hx + side * r * 0.52, cy + cobH * 0.35);
      ctx.quadraticCurveTo(hx + side * r * 0.24, cy + cobH * 1.15, hx, cy + cobH * 0.32);
      ctx.closePath();
      ctx.fill();
      if (detailLevel !== 'compact') ctx.stroke();
    }

    // Golden-ochre cob body
    ctx.beginPath();
    ctx.ellipse(ox, cy, cobW * 0.52, cobH * 0.54, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ebba34';
    ctx.fill();
    ctx.strokeStyle = '#7d5516';
    ctx.lineWidth = Math.max(0.8, r * 0.048);
    ctx.stroke();

    // Kernel rows along horizontal ear of corn
    if (detailLevel === 'full' || (detailLevel === 'mid' && r >= 10)) {
      var cols = detailLevel === 'full' ? 7 : 5;
      var rows = detailLevel === 'full' ? 3 : 2;
      for (var kr = 0; kr < rows; kr++) {
        var ky = cy + ((kr - (rows - 1) * 0.5) * cobH * 0.52);
        for (var kc = 0; kc < cols; kc++) {
          var frac = (kc + 0.5) / cols - 0.5;
          var kx = ox + frac * cobW * 0.84 + ((kr % 2) * cobW * 0.04);
          ctx.beginPath();
          ctx.ellipse(kx, ky, cobW * 0.058, cobH * 0.21, 0, 0, Math.PI * 2);
          ctx.fillStyle = ((kc + kr + seed) % 3 === 0) ? '#fbe176' : (((kc + kr) % 2 === 0) ? '#f1c238' : '#dca022');
          ctx.fill();
        }
      }
    } else {
      ctx.beginPath();
      ctx.moveTo(ox - cobW * 0.38, cy);
      ctx.lineTo(ox + cobW * 0.38, cy);
      ctx.strokeStyle = '#fbe27a';
      ctx.lineWidth = Math.max(1.0, cobH * 0.28);
      ctx.stroke();
    }

    // Both hands clasping the cob horizontally at the mouth
    var handR = Math.max(2.2, r * 0.20);
    ctx.fillStyle = skinHex;
    ctx.strokeStyle = '#5a3a22';
    ctx.lineWidth = Math.max(0.8, r * 0.045);
    for (var hs = -1; hs <= 1; hs += 2) {
      var handX = ox + hs * cobW * 0.52;
      ctx.beginPath();
      ctx.ellipse(handX, cy + cobH * 0.08, handR * 0.92, handR * 1.08, hs * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  function drawCitizenFigure(ctx, p, anim) {
    var r = p.r;
    var bob = anim.reducedMotion ? 0 : Math.sin(anim.timeSec * 1.45 + p.phase) * Math.min(1.6, r * 0.04);
    var cx = p.cx + (anim.shiftX || 0);
    var cy = p.cy + bob + (anim.nodY || 0);
    var rx = r * 1.08;
    var ry = r * 0.98;
    var detail = p.detail || (r >= 20 ? 'full' : (r >= 11 ? 'mid' : 'compact'));
    var skin = SKIN_TONES[p.seed % SKIN_TONES.length];
    var cheek = CHEEK_TONES[p.seed % CHEEK_TONES.length];
    var tunic = TUNIC_TONES[(p.seed * 3) % TUNIC_TONES.length];
    var headStyle = p.seed % 3; // 0: straw hat, 1: kerchief, 2: soft harvest cap

    // Broad homespun shoulders & collar (seals inter-row spaces naturally)
    if (p.drawShoulders !== false) {
      ctx.beginPath();
      ctx.ellipse(cx, cy + ry * 1.24, rx * 1.38, ry * 0.86, 0, Math.PI, Math.PI * 2, false);
      ctx.lineTo(cx + rx * 1.42, cy + ry * 1.65);
      ctx.lineTo(cx - rx * 1.42, cy + ry * 1.65);
      ctx.closePath();
      ctx.fillStyle = tunic;
      ctx.fill();
      ctx.strokeStyle = '#3f2918';
      ctx.lineWidth = Math.max(0.8, r * 0.05);
      ctx.stroke();

      if (detail !== 'compact') {
        ctx.beginPath();
        ctx.moveTo(cx - rx * 0.30, cy + ry * 0.82);
        ctx.lineTo(cx, cy + ry * 1.18);
        ctx.lineTo(cx + rx * 0.30, cy + ry * 0.82);
        ctx.strokeStyle = '#efe2c6';
        ctx.lineWidth = Math.max(0.9, r * 0.06);
        ctx.stroke();
      }
    }

    // Wide woven straw hat back-brim behind round face
    if (headStyle === 0) {
      ctx.beginPath();
      ctx.ellipse(cx, cy - ry * 0.42, rx * 1.34, ry * 0.44, 0, 0, Math.PI * 2);
      ctx.fillStyle = HAT_STRAW[p.seed % HAT_STRAW.length];
      ctx.fill();
      ctx.strokeStyle = '#6c4d23';
      ctx.lineWidth = Math.max(0.8, r * 0.048);
      ctx.stroke();
    }

    // Round, flat face disc
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = skin;
    ctx.fill();
    ctx.strokeStyle = '#53351e';
    ctx.lineWidth = Math.max(0.85, r * 0.055);
    ctx.stroke();

    // Full rosy-ochre cheeks
    var chR = r * 0.29;
    ctx.fillStyle = cheek;
    ctx.beginPath();
    ctx.arc(cx - rx * 0.50, cy + ry * 0.14, chR, 0, Math.PI * 2);
    ctx.arc(cx + rx * 0.50, cy + ry * 0.14, chR, 0, Math.PI * 2);
    ctx.fill();

    // Headwear top crown / kerchief / cap
    if (headStyle === 0) {
      ctx.beginPath();
      ctx.ellipse(cx, cy - ry * 0.78, rx * 0.76, ry * 0.32, 0, Math.PI, Math.PI * 2);
      ctx.closePath();
      ctx.fillStyle = HAT_STRAW[p.seed % HAT_STRAW.length];
      ctx.fill();
      ctx.strokeStyle = '#6c4d23';
      ctx.stroke();
    } else if (headStyle === 1) {
      ctx.beginPath();
      ctx.arc(cx, cy - ry * 0.06, rx * 1.02, Math.PI * 1.08, Math.PI * 1.92);
      ctx.quadraticCurveTo(cx, cy - ry * 0.64, cx - rx * 0.96, cy - ry * 0.28);
      ctx.closePath();
      ctx.fillStyle = KERCHIEF_TONES[p.seed % KERCHIEF_TONES.length];
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(cx, cy - ry * 0.74, rx * 0.84, ry * 0.34, -0.05, 0, Math.PI * 2);
      ctx.fillStyle = KERCHIEF_TONES[(p.seed + 2) % KERCHIEF_TONES.length];
      ctx.fill();
    }

    // Calm friendly eyes
    var exOff = rx * 0.34;
    var ey = cy - ry * 0.12;
    var gx = (anim.gazeX || 0) * r * 0.06;
    var gy = (anim.gazeY || 0) * r * 0.04;
    ctx.strokeStyle = '#3b2414';
    ctx.fillStyle = '#321e10';
    ctx.lineWidth = Math.max(0.85, r * 0.06);
    for (var es = -1; es <= 1; es += 2) {
      var ex = cx + es * exOff;
      ctx.beginPath();
      ctx.arc(ex, ey, Math.max(1.4, r * 0.15), Math.PI * 1.12, Math.PI * 1.88);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ex + gx, ey + r * 0.04 + gy, Math.max(1.1, r * 0.085), 0, Math.PI * 2);
      ctx.fill();
      if (detail === 'full') {
        ctx.fillStyle = '#fff9eb';
        ctx.beginPath();
        ctx.arc(ex + gx - r * 0.025, ey + r * 0.015 + gy, Math.max(0.7, r * 0.03), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#321e10';
      }
    }

    // Gentle nose & polite smile (with ivory teeth when holding corn)
    if (detail !== 'compact') {
      ctx.beginPath();
      ctx.arc(cx, cy + ry * 0.04, Math.max(1.0, r * 0.08), 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.strokeStyle = 'rgba(92,56,30,0.55)';
      ctx.lineWidth = Math.max(0.75, r * 0.045);
      ctx.stroke();
    }

    var smileY = cy + ry * 0.27;
    var smileW = rx * (0.34 + (anim.smileBoost || 0) * 0.09);
    ctx.beginPath();
    ctx.arc(cx, smileY - r * 0.06, smileW, 0.14 * Math.PI, 0.86 * Math.PI);
    if (p.hasCorn || (anim.smileBoost && anim.smileBoost > 0.2)) {
      ctx.closePath();
      ctx.fillStyle = '#fbf2dc';
      ctx.fill();
    }
    ctx.strokeStyle = '#4c2c18';
    ctx.lineWidth = Math.max(0.9, r * 0.06);
    ctx.stroke();

    if (p.hasCorn) {
      var nibble = anim.reducedMotion ? 0 : Math.sin(anim.timeSec * 3.1 + p.phase * 1.7) * Math.min(1.4, r * 0.045);
      drawHorizontalCornCob(ctx, cx, smileY + r * 0.13, r, p.seed, skin, detail, nibble);
    }
  }

  function resolveSkyKeepoutPoly(layout, ap, skyBand) {
    var src = layout && Array.isArray(layout.trapezeSkyPoly) && layout.trapezeSkyPoly.length >= 3
      ? layout.trapezeSkyPoly
      : [
          { x: ap.x + ap.w * 0.16, y: ap.y },
          { x: ap.x + ap.w * 0.84, y: ap.y },
          { x: ap.x + ap.w * 0.70, y: skyBand.yMax },
          { x: ap.x + ap.w * 0.30, y: skyBand.yMax }
        ];
    var cx = 0, cy = 0;
    for (var i = 0; i < src.length; i++) {
      cx += src[i].x;
      cy += src[i].y;
    }
    cx /= src.length;
    cy /= src.length;
    var out = [];
    for (var k = 0; k < src.length; k++) {
      out.push({
        x: cx + (src[k].x - cx) * 0.80,
        y: src[k].y <= cy ? src[k].y : (cy + (src[k].y - cy) * 0.88)
      });
    }
    return out;
  }

  function buildRowBand(out, count, xMin, xMax, yCenter, rBase, hasCornAll, seedBase, detailOverride) {
    var span = Math.max(12, xMax - xMin);
    for (var i = 0; i < count; i++) {
      var u = count === 1 ? 0.52 : (i + 0.5) / count;
      var seed = seedBase + i * 13 + 7;
      var jx = (rand01(seed, 1) - 0.5) * (span / Math.max(2, count)) * 0.22;
      var jy = (rand01(seed, 2) - 0.5) * rBase * 0.18;
      out.push({
        cx: clamp(xMin + u * span + jx, xMin + rBase * 0.35, xMax - rBase * 0.35),
        cy: yCenter + jy,
        r: rBase * (0.95 + rand01(seed, 3) * 0.10),
        seed: seed,
        phase: rand01(seed, 4) * Math.PI * 2,
        hasCorn: hasCornAll ? true : (rand01(seed, 5) < 0.65),
        detail: detailOverride || null,
        drawShoulders: true
      });
    }
  }

  function buildWindowCrowd(yearIndex, ap, layout) {
    var yi = clampYearIndex(yearIndex);
    var target = ANNUAL_STEPS[yi].count;
    if (target === 0) return [];

    var S = Math.min(ap.w, ap.h);
    var bDitch = getBandBox(layout, ap, 'ditch');
    var bBridge = getBandBox(layout, ap, 'bridge');
    var bWall = getBandBox(layout, ap, 'little_wall');
    var bMedlar = getBandBox(layout, ap, 'medlar_tree');
    var bCorn = getBandBox(layout, ap, 'cornfield');
    var bBerry = getBandBox(layout, ap, 'blackberry_bushes');
    var bChick = getBandBox(layout, ap, 'chicken_yard');
    var bHill = getBandBox(layout, ap, 'yellow_hill');
    var bSky = getBandBox(layout, ap, 'trapeze_sky');
    var list = [];

    if (yi === 1) {
      buildRowBand(list, 1, bDitch.xMin, bDitch.xMax, lerp(bDitch.yMin, bDitch.yMax, 0.36), clamp(Math.min(ap.w * 0.11, ap.h * 0.125), 18, 76), true, 101, 'full');
    } else if (yi === 2) {
      buildRowBand(list, 3, ap.x, ap.x + ap.w, lerp(bBridge.centerY, bDitch.centerY, 0.56), clamp(Math.min(ap.w * 0.125, ap.h * 0.175), 20, 112), true, 203, 'full');
    } else if (yi === 3) {
      buildRowBand(list, 3, ap.x, ap.x + ap.w, lerp(bMedlar.yMax, bWall.yMin, 0.48), clamp(Math.min(ap.w * 0.115, ap.h * 0.155), 18, 98), true, 307, 'full');
      buildRowBand(list, 3, ap.x, ap.x + ap.w, lerp(bBridge.centerY, bDitch.centerY, 0.62), clamp(Math.min(ap.w * 0.125, ap.h * 0.170), 20, 110), true, 347, 'full');
    } else if (yi === 4) {
      var top4 = Math.min(bMedlar.yMin, bBerry.yMin, lerp(bCorn.yMin, bCorn.yMax, 0.70)) + S * 0.02;
      var bot4 = bDitch.yMax - S * 0.03;
      var r4 = clamp(Math.min(ap.w * 0.095, ap.h * 0.125), 15, 82);
      for (var row4 = 0; row4 < 4; row4++) {
        var f4 = row4 / 3;
        buildRowBand(list, 4, ap.x, ap.x + ap.w, lerp(top4, bot4, f4), r4 * (0.88 + 0.18 * f4), true, 400 + row4 * 41, 'full');
      }
    } else if (yi === 5) {
      var counts5 = [6, 6, 6, 6, 5];
      var top5 = lerp(bChick.yMin, bChick.yMax, 0.65);
      var bot5 = bDitch.yMax - S * 0.03;
      var r5 = clamp(Math.min(ap.w * 0.068, ap.h * 0.105), 13, 66);
      for (var row5 = 0; row5 < 5; row5++) {
        var f5 = row5 / 4;
        buildRowBand(list, counts5[row5], ap.x, ap.x + ap.w, lerp(top5, bot5, f5), r5 * (0.85 + 0.22 * f5), row5 >= 1, 500 + row5 * 53, 'full');
      }
    } else if (yi === 6) {
      var counts6 = [8, 7, 7, 7, 6, 6, 6];
      var top6 = lerp(bHill.yMin, bHill.yMax, 0.62);
      var bot6 = bDitch.yMax - S * 0.025;
      var r6 = clamp(Math.min(ap.w * 0.056, ap.h * 0.092), 11, 54);
      for (var row6 = 0; row6 < 7; row6++) {
        var f6 = row6 / 6;
        buildRowBand(list, counts6[row6], ap.x, ap.x + ap.w, lerp(top6, bot6, f6), r6 * (0.82 + 0.28 * f6), row6 >= 2, 600 + row6 * 59, 'mid');
      }
    } else if (yi === 7) {
      var keepPoly = resolveSkyKeepoutPoly(layout, ap, bSky);
      var skyFloorY = bSky.yMax;
      var top7 = Math.max(ap.y + S * 0.04, bSky.yMin + (bSky.yMax - bSky.yMin) * 0.42);
      var bot7 = ap.y + ap.h - S * 0.02;
      var cellW7 = ap.w / 11.4;
      var cellH7 = (bot7 - top7) / 11.2;
      for (var r7i = 0; r7i < 12; r7i++) {
        var rf7 = r7i / 11;
        var rad7 = Math.max(cellW7, cellH7) * (0.64 + 0.24 * rf7);
        var stag7 = (r7i % 2 === 1) ? 0.24 : -0.24;
        for (var c7i = 0; c7i < 12; c7i++) {
          var sd7 = 700 + r7i * 37 + c7i * 19;
          var x7 = ap.x + ((c7i + 0.5 + stag7) / 12) * ap.w + (rand01(sd7, 1) - 0.5) * cellW7 * 0.16;
          var y7 = lerp(top7, bot7, rf7) + (rand01(sd7, 2) - 0.5) * cellH7 * 0.14;
          if (pointInPoly(x7, y7 - rad7 * 0.95, keepPoly) || pointInPoly(x7, y7, keepPoly)) {
            y7 = Math.max(y7, skyFloorY + rad7 * 0.96 + rand01(sd7, 6) * cellH7 * 0.35);
          }
          list.push({
            cx: clamp(x7, ap.x + rad7 * 0.1, ap.x + ap.w - rad7 * 0.1),
            cy: y7,
            r: rad7,
            seed: sd7,
            phase: rand01(sd7, 4) * Math.PI * 2,
            hasCorn: r7i >= 7 || (r7i >= 4 && (c7i + r7i) % 2 === 0),
            detail: r7i >= 9 ? 'mid' : 'compact',
            drawShoulders: true
          });
        }
      }
    } else {
      // Year IX (360): 18 cols x 20 rows = 360 overlapping faces sealing 100% of aperture & trapezeSkyPoly
      var cellW8 = ap.w / 17.0;
      var cellH8 = ap.h / 19.0;
      for (var r8i = 0; r8i < 20; r8i++) {
        var rf8 = r8i / 19;
        var rad8 = Math.max(cellW8, cellH8) * (0.80 + 0.18 * rf8);
        var stag8 = (r8i % 2 === 1) ? 0.22 : -0.22;
        for (var c8i = 0; c8i < 18; c8i++) {
          var sd8 = 900 + r8i * 43 + c8i * 23;
          var x8 = ap.x + ((c8i + stag8) / 17.0) * ap.w + (rand01(sd8, 1) - 0.5) * cellW8 * 0.10;
          var y8 = ap.y + (0.08 + rf8 * 0.90) * ap.h + (rand01(sd8, 2) - 0.5) * cellH8 * 0.10;
          list.push({
            cx: x8,
            cy: y8,
            r: rad8,
            seed: sd8,
            phase: rand01(sd8, 4) * Math.PI * 2,
            hasCorn: r8i >= 14 || (r8i >= 9 && (c8i + r8i) % 3 === 0),
            detail: r8i >= 16 ? 'mid' : 'compact',
            drawShoulders: true
          });
        }
      }
    }

    list.sort(function (a, b) {
      return (a.cy - b.cy) || (a.seed - b.seed);
    });
    return list;
  }

  // Canonical 9 floor crouching slots (index 0 centered so Yr IV single lodger is centered)
  var FLOOR_SLOTS = [
    { u: 0.50, v: 0.58, seed: 1103, hasCorn: true },
    { u: 0.26, v: 0.44, seed: 1117, hasCorn: true },
    { u: 0.74, v: 0.46, seed: 1129, hasCorn: false },
    { u: 0.15, v: 0.74, seed: 1151, hasCorn: true },
    { u: 0.85, v: 0.73, seed: 1163, hasCorn: true },
    { u: 0.37, v: 0.78, seed: 1181, hasCorn: false },
    { u: 0.63, v: 0.79, seed: 1193, hasCorn: true },
    { u: 0.39, v: 0.32, seed: 1213, hasCorn: false },
    { u: 0.62, v: 0.33, seed: 1229, hasCorn: true }
  ];

  // Canonical 8 chest-of-drawers seated slots (perched on walnut top & open lower drawers)
  var CHEST_SLOTS = [
    { u: 0.24, v: 0.10, seed: 1301, hasCorn: true },
    { u: 0.54, v: 0.08, seed: 1319, hasCorn: false },
    { u: 0.81, v: 0.11, seed: 1327, hasCorn: true },
    { u: 0.16, v: 0.42, seed: 1361, hasCorn: false },
    { u: 0.45, v: 0.40, seed: 1373, hasCorn: true },
    { u: 0.75, v: 0.43, seed: 1381, hasCorn: true },
    { u: 0.31, v: 0.74, seed: 1399, hasCorn: false },
    { u: 0.66, v: 0.75, seed: 1409, hasCorn: true }
  ];

  // Canonical 9 narrow inn-bed slots (elbow-to-elbow taking turns along bolster & quilt)
  var BED_SLOTS = [
    { u: 0.18, v: 0.18, seed: 1511, hasCorn: false },
    { u: 0.40, v: 0.16, seed: 1523, hasCorn: true },
    { u: 0.62, v: 0.17, seed: 1531, hasCorn: false },
    { u: 0.84, v: 0.19, seed: 1543, hasCorn: true },
    { u: 0.14, v: 0.56, seed: 1553, hasCorn: true },
    { u: 0.33, v: 0.58, seed: 1567, hasCorn: false },
    { u: 0.52, v: 0.57, seed: 1579, hasCorn: true },
    { u: 0.71, v: 0.59, seed: 1597, hasCorn: true },
    { u: 0.89, v: 0.56, seed: 1607, hasCorn: false }
  ];

  function resolveRoomZones(ctx, layout) {
    var cw = (ctx && ctx.canvas && ctx.canvas.width) ? ctx.canvas.width : 960;
    var ch = (ctx && ctx.canvas && ctx.canvas.height) ? ctx.canvas.height : 640;
    var rz = (layout && layout.roomZones) || {};
    return {
      chestRect: normRect(rz.chestRect, { x: cw * 0.07, y: ch * 0.34, w: cw * 0.29, h: ch * 0.34 }),
      bedRect: normRect(rz.bedRect, { x: cw * 0.58, y: ch * 0.35, w: cw * 0.35, h: ch * 0.33 }),
      floorRect: normRect(rz.floorRect, { x: cw * 0.10, y: ch * 0.62, w: cw * 0.80, h: ch * 0.31 })
    };
  }

  function computeFloorKneeParting(floorCount, stepCursor, ptrFloor) {
    var parts = [];
    var partedCount = 0;
    for (var i = 0; i < floorCount && i < FLOOR_SLOTS.length; i++) {
      var sl = FLOOR_SLOTS[i];
      var best = 0;
      if (stepCursor && stepCursor.active) {
        var duS = sl.u - stepCursor.u;
        var dvS = (sl.v - stepCursor.v) * 0.62;
        var dS = Math.sqrt(duS * duS + dvS * dvS);
        best = Math.max(best, clamp(1 - dS / 0.38, 0, 1));
      }
      if (ptrFloor && ptrFloor.inside) {
        var duP = sl.u - ptrFloor.u;
        var dvP = (sl.v - ptrFloor.v) * 0.62;
        var dP = Math.sqrt(duP * duP + dvP * dvP);
        best = Math.max(best, clamp(1 - dP / 0.36, 0, 1));
      }
      parts.push(best);
      if (best >= 0.22) partedCount++;
    }
    return { parts: parts, partedCount: partedCount };
  }

  function drawSeatedFurnitureLodger(ctx, cx, cy, r, slot, zoneKind, timeSec, reducedMotion) {
    var trouser = TUNIC_TONES[(slot.seed + 5) % TUNIC_TONES.length];
    // Seated knees & dangling boots on chest edge or quilted bed edge
    ctx.fillStyle = trouser;
    ctx.strokeStyle = '#3b2616';
    ctx.lineWidth = Math.max(0.9, r * 0.055);
    for (var ks = -1; ks <= 1; ks += 2) {
      var kx = cx + ks * r * 0.42;
      var ky = cy + r * 1.65;
      ctx.beginPath();
      ctx.ellipse(kx, ky, r * 0.32, r * 0.46, ks * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      if (zoneKind === 'chest') {
        ctx.fillStyle = '#4a311e';
        ctx.beginPath();
        ctx.ellipse(kx + ks * r * 0.06, ky + r * 0.44, r * 0.22, r * 0.14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = trouser;
      }
    }

    drawCitizenFigure(ctx, {
      cx: cx,
      cy: cy,
      r: r,
      seed: slot.seed,
      phase: (slot.seed % 19) * 0.33,
      hasCorn: slot.hasCorn,
      detail: r >= 16 ? 'full' : 'mid',
      drawShoulders: true
    }, {
      timeSec: timeSec,
      reducedMotion: reducedMotion,
      smileBoost: 0.15
    });
  }

  function drawCrouchingFloorLodger(ctx, cx, cy, r, slot, part, locusU, timeSec, reducedMotion) {
    var leanDir = (slot.u < locusU) ? -1 : 1;
    var shiftX = leanDir * part * r * 0.34;
    var nodY = part * r * 0.18;
    var legTone = TUNIC_TONES[(slot.seed + 2) % TUNIC_TONES.length];

    // Floor shadow beneath crouching lodger
    ctx.fillStyle = 'rgba(42, 26, 14, 0.24)';
    ctx.beginPath();
    ctx.ellipse(cx + shiftX, cy + r * 1.92, r * (1.25 + part * 0.42), r * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();

    drawCitizenFigure(ctx, {
      cx: cx,
      cy: cy,
      r: r,
      seed: slot.seed,
      phase: (slot.seed % 23) * 0.27,
      hasCorn: slot.hasCorn,
      detail: r >= 16 ? 'full' : 'mid',
      drawShoulders: true
    }, {
      timeSec: timeSec,
      reducedMotion: reducedMotion,
      shiftX: shiftX,
      nodY: nodY,
      smileBoost: part * 0.85,
      gazeX: -leanDir * part * 0.7,
      gazeY: part * 0.4
    });

    // Tucked crouching knees in front of tunic — politely parting outward when traveler passes!
    var spread = r * (0.38 + part * 0.68);
    var kneeY = cy + r * 1.48 + nodY * 0.5;
    for (var side = -1; side <= 1; side += 2) {
      var kx = cx + shiftX + side * spread;
      ctx.beginPath();
      ctx.ellipse(kx, kneeY, r * 0.38, r * 0.48, side * (0.14 + part * 0.38), 0, Math.PI * 2);
      ctx.fillStyle = legTone;
      ctx.fill();
      ctx.strokeStyle = '#3a2414';
      ctx.lineWidth = Math.max(0.95, r * 0.06);
      ctx.stroke();

      // Peasant shoe tucked beneath parted knee
      ctx.beginPath();
      ctx.ellipse(kx + side * part * r * 0.12, kneeY + r * 0.42, r * 0.25, r * 0.14, side * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = '#472d1b';
      ctx.fill();
    }
  }

  function createAudioController(initialMuted) {
    var muted = Boolean(initialMuted);
    var ctx = null;
    var master = null;
    var humGain = null;
    var noiseBuf = null;
    var lastCrowdCount = 0;
    var lastCurtain = 1.0;
    var lastMode = 'window';
    var lastShiftSoundMs = 0;

    function buildNoiseBuffer(ac) {
      var len = Math.floor(ac.sampleRate * 0.6);
      var buf = ac.createBuffer(1, len, ac.sampleRate);
      var data = buf.getChannelData(0);
      var prev = 0;
      for (var i = 0; i < len; i++) {
        var w = (Math.random() * 2 - 1);
        prev = prev * 0.62 + w * 0.38;
        data[i] = prev;
      }
      return buf;
    }

    function applyLevels() {
      if (!ctx || !master || !humGain) return;
      try {
        var now = ctx.currentTime;
        master.gain.cancelScheduledValues(now);
        master.gain.setTargetAtTime(muted ? 0.0 : 0.85, now, 0.035);
        var density = lastCrowdCount <= 0 ? 0 : (Math.log(1 + lastCrowdCount) / Math.log(361));
        var curtainFactor = lastMode === 'room' ? 0.78 : (0.22 + 0.78 * lastCurtain);
        var targetHum = muted ? 0.0 : (density * 0.026 * curtainFactor);
        humGain.gain.cancelScheduledValues(now);
        humGain.gain.setTargetAtTime(targetHum, now, 0.08);
      } catch (_) {}
    }

    function unlockAudio() {
      try {
        var AC = root.AudioContext || root.webkitAudioContext;
        if (!AC) return false;
        if (!ctx) {
          ctx = new AC();
          master = ctx.createGain();
          master.gain.value = muted ? 0.0 : 0.85;
          master.connect(ctx.destination);

          noiseBuf = buildNoiseBuffer(ctx);
          humGain = ctx.createGain();
          humGain.gain.value = 0.0;

          var lp = ctx.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.value = 460;
          lp.Q.value = 0.7;
          humGain.connect(lp);
          lp.connect(master);

          var freqs = [146.83, 220.0, 293.66];
          for (var i = 0; i < freqs.length; i++) {
            var osc = ctx.createOscillator();
            var og = ctx.createGain();
            osc.type = i === 0 ? 'triangle' : 'sine';
            osc.frequency.value = freqs[i];
            og.gain.value = i === 0 ? 0.45 : (i === 1 ? 0.35 : 0.20);
            osc.connect(og);
            og.connect(humGain);
            osc.start();
          }
        }
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
        applyLevels();
        return true;
      } catch (_) {
        return false;
      }
    }

    function playNoiseGrain(freq, q, dur, peakGain, delaySec) {
      if (!ctx || !noiseBuf || muted) return;
      try {
        var t0 = ctx.currentTime + (delaySec || 0);
        var src = ctx.createBufferSource();
        src.buffer = noiseBuf;
        var bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(freq, t0);
        bp.Q.value = q;
        var g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(peakGain, t0 + dur * 0.22);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        src.connect(bp);
        bp.connect(g);
        g.connect(master);
        src.start(t0);
        src.stop(t0 + dur + 0.02);
      } catch (_) {}
    }

    function triggerCurtainRing(opening) {
      if (!ctx || muted) return;
      try {
        var rings = opening ? [1180, 1520, 1890] : [1820, 1410, 1060];
        for (var i = 0; i < rings.length; i++) {
          var t0 = ctx.currentTime + i * 0.036;
          var osc = ctx.createOscillator();
          var g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(rings[i], t0);
          osc.frequency.exponentialRampToValueAtTime(rings[i] * 1.04, t0 + 0.09);
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.linearRampToValueAtTime(0.022, t0 + 0.008);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.11);
          osc.connect(g);
          g.connect(master);
          osc.start(t0);
          osc.stop(t0 + 0.12);
        }
        playNoiseGrain(1450, 1.4, 0.14, 0.024, 0.01);
      } catch (_) {}
    }

    function triggerFootstepPoliteShift(throttled) {
      if (!ctx || muted) return;
      var nowMs = Date.now();
      if (throttled && (nowMs - lastShiftSoundMs < 240)) return;
      lastShiftSoundMs = nowMs;
      try {
        var t0 = ctx.currentTime;
        // Warm pegged-oak floorboard footstep
        var wood = ctx.createOscillator();
        var wg = ctx.createGain();
        wood.type = 'triangle';
        wood.frequency.setValueAtTime(114, t0);
        wood.frequency.exponentialRampToValueAtTime(68, t0 + 0.085);
        wg.gain.setValueAtTime(0.0001, t0);
        wg.gain.linearRampToValueAtTime(0.036, t0 + 0.01);
        wg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09);
        wood.connect(wg);
        wg.connect(master);
        wood.start(t0);
        wood.stop(t0 + 0.10);

        // Polite dry corn-husk & homespun knee-shift rustle
        playNoiseGrain(2150, 2.1, 0.12, 0.026, 0.035);
      } catch (_) {}
    }

    function triggerCornRustle(count) {
      if (!ctx || muted || count <= 0) return;
      var amp = 0.014 + 0.018 * (Math.log(1 + count) / Math.log(361));
      playNoiseGrain(2350, 2.4, 0.11, amp, 0);
    }

    return {
      unlockAudio: unlockAudio,
      isMuted: function () { return muted; },
      setMuted: function (flag) {
        muted = Boolean(flag);
        applyLevels();
        return muted;
      },
      toggleMute: function () {
        muted = !muted;
        applyLevels();
        return muted;
      },
      syncCrowdState: function (count, curtainLift, viewMode) {
        lastCrowdCount = count;
        lastCurtain = curtainLift;
        lastMode = viewMode;
        applyLevels();
      },
      triggerCurtainRing: triggerCurtainRing,
      triggerFootstepPoliteShift: triggerFootstepPoliteShift,
      triggerCornRustle: triggerCornRustle
    };
  }

  var STEP_WAYPOINTS = [0.50, 0.28, 0.72, 0.38, 0.64];

  function createEngine(options) {
    var opts0 = options || {};
    var bornMs = Date.now();
    var yearIndex = clampYearIndex(opts0.yearIndex != null ? opts0.yearIndex : 0);
    var viewMode = opts0.viewMode === 'room' ? 'room' : 'window';
    var curtainLift = opts0.curtainLift != null ? clamp(Number(opts0.curtainLift), 0, 1) : 1.0;
    var reducedMotion = Boolean(opts0.reducedMotion);
    var audio = createAudioController(Boolean(opts0.muted));

    var ptr = { active: false, normX: 0.5, normY: 0.5, pxX: null, pxY: null };
    var stepCursor = { active: false, u: 0.50, v: 0.58, seq: 0 };
    var lastFloorRect = null;
    var lastCanvasW = 960;
    var lastCanvasH = 640;
    var cachedCrowdKey = '';
    var cachedCrowd = [];
    var kneePartedCount = 0;

    audio.syncCrowdState(ANNUAL_STEPS[yearIndex].count, curtainLift, viewMode);

    function resolvePointerFloorUV() {
      if (!ptr.active) return { inside: false, u: 0.5, v: 0.5 };
      if (lastFloorRect && Number.isFinite(ptr.pxX) && Number.isFinite(ptr.pxY)) {
        var uPx = (ptr.pxX - lastFloorRect.x) / lastFloorRect.w;
        var vPx = (ptr.pxY - lastFloorRect.y) / lastFloorRect.h;
        if (uPx >= -0.06 && uPx <= 1.06 && vPx >= -0.08 && vPx <= 1.08) {
          return { inside: true, u: clamp(uPx, 0, 1), v: clamp(vPx, 0, 1) };
        }
        return { inside: false, u: 0.5, v: 0.5 };
      }
      if (Number.isFinite(ptr.normX) && Number.isFinite(ptr.normY)) {
        var fx = lastFloorRect ? (lastFloorRect.x / lastCanvasW) : 0.10;
        var fy = lastFloorRect ? (lastFloorRect.y / lastCanvasH) : 0.62;
        var fw = lastFloorRect ? (lastFloorRect.w / lastCanvasW) : 0.80;
        var fh = lastFloorRect ? (lastFloorRect.h / lastCanvasH) : 0.31;
        var uN = (ptr.normX - fx) / Math.max(0.05, fw);
        var vN = (ptr.normY - fy) / Math.max(0.05, fh);
        if (uN >= -0.06 && uN <= 1.06 && vN >= -0.08 && vN <= 1.08) {
          return { inside: true, u: clamp(uN, 0, 1), v: clamp(vN, 0, 1) };
        }
      }
      return { inside: false, u: 0.5, v: 0.5 };
    }

    function syncKneeCount() {
      var floorCount = ROOM_BREAKDOWNS[yearIndex].floor;
      if (floorCount <= 0) {
        kneePartedCount = 0;
        return 0;
      }
      var res = computeFloorKneeParting(floorCount, stepCursor, resolvePointerFloorUV());
      kneePartedCount = res.partedCount;
      return kneePartedCount;
    }

    function resolveTimeSec(opts) {
      var rm = (opts && opts.reducedMotion != null) ? Boolean(opts.reducedMotion) : reducedMotion;
      if (rm) return { rm: true, t: 0 };
      var raw = (opts && Number.isFinite(opts.time)) ? opts.time : ((Date.now() - bornMs) * 0.001);
      if (raw > 50000) raw = (raw * 0.001) % 3600;
      return { rm: false, t: raw };
    }

    function getState() {
      syncKneeCount();
      var step = ANNUAL_STEPS[yearIndex];
      var bd = ROOM_BREAKDOWNS[yearIndex];
      var occ = getOcclusionByStratum(yearIndex);
      var m = computeStrataMetrics(occ, yearIndex);
      return {
        yearIndex: step.yearIndex,
        yearNumber: step.yearNumber,
        visitRoman: step.visitRoman,
        phaseKey: step.key,
        citizenCount: step.count,
        roomOccupants: step.roomOccupants,
        roomBreakdown: { floor: bd.floor, chest: bd.chest, bed: bd.bed },
        occlusionByStratum: occ,
        ditchVisible: m.ditchVisible,
        skyVisible: m.skyVisible,
        horizonFaceWall: m.horizonFaceWall,
        visibleStrataCount: m.visibleStrataCount,
        viewMode: viewMode,
        curtainLift: curtainLift,
        muted: audio.isMuted(),
        kneePartedCount: kneePartedCount,
        narrative: step.narrative
      };
    }

    function setYearIndex(idx) {
      var next = clampYearIndex(idx);
      var changed = next !== yearIndex;
      yearIndex = next;
      audio.syncCrowdState(ANNUAL_STEPS[yearIndex].count, curtainLift, viewMode);
      if (changed) audio.triggerCornRustle(ANNUAL_STEPS[yearIndex].count);
      syncKneeCount();
      return getState();
    }

    function stepYear(delta) {
      var d = Number.isFinite(Number(delta)) ? Math.round(Number(delta)) : 1;
      return setYearIndex(yearIndex + d);
    }

    function setViewMode(mode) {
      viewMode = mode === 'room' ? 'room' : 'window';
      audio.syncCrowdState(ANNUAL_STEPS[yearIndex].count, curtainLift, viewMode);
      syncKneeCount();
      return getState();
    }

    function setCurtainLift(val) {
      var v = Number(val);
      if (Number.isFinite(v)) {
        curtainLift = clamp(v, 0, 1);
        audio.syncCrowdState(ANNUAL_STEPS[yearIndex].count, curtainLift, viewMode);
      }
      return getState();
    }

    function setPointer(normX, normY, pxX, pxY) {
      if (normX == null && pxX == null) {
        ptr.active = false;
        syncKneeCount();
        return getState();
      }
      var prevParted = kneePartedCount;
      ptr.active = true;
      ptr.normX = Number.isFinite(Number(normX)) ? clamp(Number(normX), 0, 1) : ptr.normX;
      ptr.normY = Number.isFinite(Number(normY)) ? clamp(Number(normY), 0, 1) : ptr.normY;
      ptr.pxX = Number.isFinite(Number(pxX)) ? Number(pxX) : null;
      ptr.pxY = Number.isFinite(Number(pxY)) ? Number(pxY) : null;
      var nextParted = syncKneeCount();
      if (viewMode === 'room' && nextParted > prevParted) {
        audio.triggerFootstepPoliteShift(true);
      }
      return getState();
    }

    function stepAcrossFloor() {
      var fc = ROOM_BREAKDOWNS[yearIndex].floor;
      stepCursor.active = true;
      if (fc <= 1) {
        stepCursor.u = 0.48 + (stepCursor.seq % 2) * 0.04;
      } else {
        stepCursor.u = STEP_WAYPOINTS[stepCursor.seq % STEP_WAYPOINTS.length];
      }
      stepCursor.v = 0.58;
      stepCursor.seq++;
      syncKneeCount();
      audio.triggerFootstepPoliteShift(false);
      return getState();
    }

    function renderWindowMultitude(ctx, layout, opts) {
      if (!ctx) return;
      var ap = resolveAperture(ctx, layout);
      if (ctx.canvas && ctx.canvas.width > 0) {
        lastCanvasW = ctx.canvas.width;
        lastCanvasH = ctx.canvas.height;
      }
      if (ANNUAL_STEPS[yearIndex].count <= 0) return;

      var skyB = getBandBox(layout, ap, 'trapeze_sky');
      var key = [
        yearIndex,
        Math.round(ap.x),
        Math.round(ap.y),
        Math.round(ap.w),
        Math.round(ap.h),
        Math.round(skyB.yMax)
      ].join(':');
      if (key !== cachedCrowdKey) {
        cachedCrowd = buildWindowCrowd(yearIndex, ap, layout);
        cachedCrowdKey = key;
      }

      var tm = resolveTimeSec(opts);
      var ptrPxX = Number.isFinite(ptr.pxX) ? ptr.pxX : (ap.x + ptr.normX * ap.w);
      var ptrPxY = Number.isFinite(ptr.pxY) ? ptr.pxY : (ap.y + ptr.normY * ap.h);

      ctx.save();
      ctx.beginPath();
      ctx.rect(ap.x, ap.y, ap.w, ap.h);
      ctx.clip();

      // At Year IX (360), warm woven-tunic undercoat ensures zero sky pinhole leakage behind overlapping faces
      if (yearIndex === 8) {
        ctx.fillStyle = '#754c2e';
        ctx.fillRect(ap.x, ap.y, ap.w, ap.h);
      }

      for (var i = 0; i < cachedCrowd.length; i++) {
        var c = cachedCrowd[i];
        var gx = 0, gy = 0, nod = 0, sBoost = 0;
        if (ptr.active && viewMode === 'window') {
          var dx = ptrPxX - c.cx;
          var dy = ptrPxY - c.cy;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var near = clamp(1 - dist / (Math.max(ap.w, ap.h) * 0.28), 0, 1);
          gx = clamp(dx / Math.max(24, c.r * 3), -1, 1) * near;
          gy = clamp(dy / Math.max(24, c.r * 3), -1, 1) * near;
          nod = near * Math.min(2.4, c.r * 0.08);
          sBoost = near * 0.55;
        }
        drawCitizenFigure(ctx, c, {
          timeSec: tm.t,
          reducedMotion: tm.rm,
          gazeX: gx,
          gazeY: gy,
          nodY: nod,
          smileBoost: sBoost
        });
      }
      ctx.restore();
    }

    function renderRoomLodgers(ctx, layout, opts) {
      if (!ctx) return;
      if (ctx.canvas && ctx.canvas.width > 0) {
        lastCanvasW = ctx.canvas.width;
        lastCanvasH = ctx.canvas.height;
      }
      var zones = resolveRoomZones(ctx, layout);
      lastFloorRect = zones.floorRect;
      var bd = ROOM_BREAKDOWNS[yearIndex];
      var tm = resolveTimeSec(opts);

      ctx.save();

      // 1. Seated lodgers on walnut chest of drawers (0..8)
      if (bd.chest > 0) {
        var cR = clamp(Math.min(zones.chestRect.w * 0.125, zones.chestRect.h * 0.145), 11, 26);
        var chestItems = [];
        for (var ci = 0; ci < bd.chest && ci < CHEST_SLOTS.length; ci++) {
          chestItems.push(CHEST_SLOTS[ci]);
        }
        chestItems.sort(function (a, b) { return a.v - b.v; });
        for (var k1 = 0; k1 < chestItems.length; k1++) {
          var cs = chestItems[k1];
          drawSeatedFurnitureLodger(
            ctx,
            zones.chestRect.x + cs.u * zones.chestRect.w,
            zones.chestRect.y + cs.v * zones.chestRect.h,
            cR,
            cs,
            'chest',
            tm.t,
            tm.rm
          );
        }
      }

      // 2. Lodgers elbow-to-elbow on narrow quilted inn bed (0..9)
      if (bd.bed > 0) {
        var bR = clamp(Math.min(zones.bedRect.w * 0.112, zones.bedRect.h * 0.155), 11, 26);
        var bedItems = [];
        for (var bi = 0; bi < bd.bed && bi < BED_SLOTS.length; bi++) {
          bedItems.push(BED_SLOTS[bi]);
        }
        bedItems.sort(function (a, b) { return a.v - b.v; });
        for (var k2 = 0; k2 < bedItems.length; k2++) {
          var bs = bedItems[k2];
          drawSeatedFurnitureLodger(
            ctx,
            zones.bedRect.x + bs.u * zones.bedRect.w,
            zones.bedRect.y + bs.v * zones.bedRect.h,
            bR,
            bs,
            'bed',
            tm.t,
            tm.rm
          );
        }
      }

      // 3. Crouching lodgers on pegged floorboards (0..9) parting knees politely
      var ptrF = resolvePointerFloorUV();
      var kneeInfo = computeFloorKneeParting(bd.floor, stepCursor, ptrF);
      kneePartedCount = kneeInfo.partedCount;

      var locusActive = (ptrF.inside || stepCursor.active) && bd.floor > 0;
      var locusU = ptrF.inside ? ptrF.u : stepCursor.u;
      var locusV = ptrF.inside ? ptrF.v : stepCursor.v;

      if (locusActive) {
        var lx = zones.floorRect.x + locusU * zones.floorRect.w;
        var ly = zones.floorRect.y + locusV * zones.floorRect.h;
        ctx.beginPath();
        ctx.ellipse(lx, ly + 8, Math.max(18, zones.floorRect.w * 0.055), Math.max(7, zones.floorRect.h * 0.045), 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(238, 198, 118, 0.62)';
        ctx.lineWidth = 1.8;
        ctx.stroke();
      }

      if (bd.floor > 0) {
        var fR = clamp(Math.min(zones.floorRect.w * 0.052, zones.floorRect.h * 0.155), 12, 28);
        var floorOrder = [];
        for (var fi = 0; fi < bd.floor && fi < FLOOR_SLOTS.length; fi++) {
          floorOrder.push({ idx: fi, slot: FLOOR_SLOTS[fi], part: kneeInfo.parts[fi] || 0 });
        }
        floorOrder.sort(function (a, b) { return a.slot.v - b.slot.v; });
        for (var k3 = 0; k3 < floorOrder.length; k3++) {
          var fo = floorOrder[k3];
          drawCrouchingFloorLodger(
            ctx,
            zones.floorRect.x + fo.slot.u * zones.floorRect.w,
            zones.floorRect.y + fo.slot.v * zones.floorRect.h,
            fR,
            fo.slot,
            fo.part,
            locusU,
            tm.t,
            tm.rm
          );
        }
      }

      ctx.restore();
    }

    return {
      setYearIndex: setYearIndex,
      stepYear: stepYear,
      setViewMode: setViewMode,
      setCurtainLift: setCurtainLift,
      setPointer: setPointer,
      clearPointer: function () { return setPointer(null, null, null, null); },
      stepAcrossFloor: stepAcrossFloor,
      setReducedMotion: function (flag) { reducedMotion = Boolean(flag); return getState(); },
      getOcclusionByStratum: getOcclusionByStratum,
      getState: getState,
      renderWindowMultitude: renderWindowMultitude,
      renderRoomLodgers: renderRoomLodgers,
      setMuted: function (flag) { return audio.setMuted(flag); },
      isMuted: function () { return audio.isMuted(); },
      toggleMute: function () { return audio.toggleMute(); },
      unlockAudio: function () { return audio.unlockAudio(); },
      triggerCurtainRing: function (opening) { audio.triggerCurtainRing(Boolean(opening)); },
      triggerFootstepPoliteShift: function () { audio.triggerFootstepPoliteShift(false); }
    };
  }

  var api = Object.freeze({
    ANNUAL_STEPS: ANNUAL_STEPS,
    STRATA_IDS: STRATA_IDS,
    getOcclusionByStratum: getOcclusionByStratum,
    createEngine: createEngine
  });

  root.ProcopiaFaceOcclusion = api;
})(typeof globalThis !== 'undefined' ? globalThis : window);
