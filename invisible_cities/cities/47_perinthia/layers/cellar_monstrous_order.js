(function (global) {
  'use strict';

  var ZODIAC_GLYPHS = [
    '\u2648', '\u2649', '\u264A', '\u264B', '\u264C', '\u264D',
    '\u264E', '\u264F', '\u2650', '\u2651', '\u2652', '\u2653'
  ];

  var ZODIAC_NAMES = [
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ];

  var PRODIGY_COHORTS = Object.freeze([
    Object.freeze({
      id: 'cripples',
      label: 'Cripples of the Arcade',
      locus: 'street',
      zodiacIndices: Object.freeze([0, 8]),
      zodiacGlyphs: Object.freeze(['\u2648', '\u2650']),
      shortCode: 'CR',
      baseMax: 304
    }),
    Object.freeze({
      id: 'dwarfs_hunchbacks',
      label: 'Dwarfs & Hunchbacks',
      locus: 'street',
      zodiacIndices: Object.freeze([4, 6]),
      zodiacGlyphs: Object.freeze(['\u264C', '\u264E']),
      shortCode: 'DH',
      baseMax: 288
    }),
    Object.freeze({
      id: 'obese_men',
      label: 'Obese Men of the Square',
      locus: 'street',
      zodiacIndices: Object.freeze([1, 10]),
      zodiacGlyphs: Object.freeze(['\u2649', '\u2652']),
      shortCode: 'OB',
      baseMax: 246
    }),
    Object.freeze({
      id: 'bearded_women',
      label: 'Women with Beards',
      locus: 'street',
      zodiacIndices: Object.freeze([5, 9]),
      zodiacGlyphs: Object.freeze(['\u264D', '\u2651']),
      shortCode: 'BW',
      baseMax: 230
    }),
    Object.freeze({
      id: 'three_headed_children',
      label: 'Children with Three Heads',
      locus: 'cellar',
      zodiacIndices: Object.freeze([2, 11]),
      zodiacGlyphs: Object.freeze(['\u264A', '\u2653']),
      shortCode: '3H',
      baseMax: 186
    }),
    Object.freeze({
      id: 'six_legged_children',
      label: 'Children with Six Legs',
      locus: 'loft_cellar',
      zodiacIndices: Object.freeze([3, 7]),
      zodiacGlyphs: Object.freeze(['\u264B', '\u264F']),
      shortCode: '6L',
      baseMax: 186
    })
  ]);

  var FORK_VERDICTS = Object.freeze({
    undecided: Object.freeze({
      id: 'undecided',
      shortLabel: 'Observatory Rolls Open',
      title: 'Unresolved Observatory Dilemma',
      summary: 'Astronomers return after every solstice to consult their parchment rolls between two unbearable conclusions.',
      rollNote: 'DILEMMA UNRESOLVED: Either our calculations cannot describe the heavens, or the order of the gods is this city of monsters.',
      arithmeticErrorsFound: 0,
      classicalHarmonyPossible: false
    }),
    admitCalculationsWrong: Object.freeze({
      id: 'admitCalculationsWrong',
      shortLabel: 'Claim Calculations Were Wrong',
      title: 'Horn I: Admit All Calculations Were Wrong',
      summary: 'Astronomers slash crimson errata across their tables and declare their figures unable to describe the heavens, yet zero arithmetic flaws exist.',
      rollNote: 'HORN I INSCRIBED: We disown our ephemerides as false, though every solstice chord and lunar node checks to 0.00 arcseconds.',
      arithmeticErrorsFound: 0,
      classicalHarmonyPossible: false
    }),
    confessGodsOrderIsMonsters: Object.freeze({
      id: 'confessGodsOrderIsMonsters',
      shortLabel: 'Confess the Gods\u2019 Order Is Monsters',
      title: 'Horn II: Reveal the Order of the Gods Is Monsters',
      summary: 'Astronomers confess the celestial calculations are exact and that the order of the gods is reflected faithfully in the city of monsters.',
      rollNote: 'HORN II INSCRIBED: Not one cipher erred; the twelve temples mirror the firmament, and the order of the gods is the city of monsters.',
      arithmeticErrorsFound: 0,
      classicalHarmonyPossible: false
    })
  });

  function clamp(v, lo, hi) {
    var n = Number(v);
    if (!Number.isFinite(n)) return lo;
    return n < lo ? lo : (n > hi ? hi : n);
  }

  function clamp01(v) {
    return clamp(v, 0, 1);
  }

  function round4(v) {
    return Number(Number(v).toFixed(4));
  }

  var HOUSE_TO_COHORT = (function () {
    var map = new Array(12);
    for (var i = 0; i < PRODIGY_COHORTS.length; i++) {
      var c = PRODIGY_COHORTS[i];
      for (var j = 0; j < c.zodiacIndices.length; j++) {
        map[c.zodiacIndices[j]] = c;
      }
    }
    return map;
  })();

  var STREET_SLOTS = (function () {
    var slots = [];
    var streetCohortIds = ['cripples', 'dwarfs_hunchbacks', 'obese_men', 'bearded_women'];
    for (var i = 0; i < 44; i++) {
      var band = i % 4;
      var t = ((Math.floor(i / 4) + 0.5) / 11) * 2 - 1;
      if (Math.abs(t) < 0.12) t = t < 0 ? -0.16 : 0.16;
      var side = (i % 2 === 0 ? 1 : -1) * (0.055 + ((i * 7) % 5) * 0.012);
      var axis = band === 0 ? 'cardo' : (band === 1 ? 'decumanus' : (band === 2 ? 'square' : ((i % 3 === 0) ? 'cardo' : 'decumanus')));
      var sqAngle = (i * 2.39996) % (Math.PI * 2);
      slots.push({
        index: i,
        cohortId: streetCohortIds[(i + Math.floor(i / 4)) % 4],
        axis: axis,
        along: t * 0.86,
        perp: side,
        sqAngle: sqAngle,
        sqRadius: 0.13 + ((i * 13) % 7) * 0.022,
        scale: 0.88 + ((i * 5) % 4) * 0.08,
        variant: i % 3
      });
    }
    return slots;
  })();

  var GRATE_NODES = [
    { kind: 'cellar', qAngle: 0.72, rFrac: 0.42, cohortId: 'three_headed_children', houseIdx: 2 },
    { kind: 'loft',   qAngle: 1.02, rFrac: 0.58, cohortId: 'six_legged_children',   houseIdx: 3 },
    { kind: 'cellar', qAngle: 2.32, rFrac: 0.45, cohortId: 'three_headed_children', houseIdx: 11 },
    { kind: 'loft',   qAngle: 2.68, rFrac: 0.61, cohortId: 'six_legged_children',   houseIdx: 7 },
    { kind: 'cellar', qAngle: 3.88, rFrac: 0.44, cohortId: 'three_headed_children', houseIdx: 2 },
    { kind: 'loft',   qAngle: 4.24, rFrac: 0.59, cohortId: 'six_legged_children',   houseIdx: 3 },
    { kind: 'cellar', qAngle: 5.42, rFrac: 0.43, cohortId: 'three_headed_children', houseIdx: 11 },
    { kind: 'loft',   qAngle: 5.82, rFrac: 0.60, cohortId: 'six_legged_children',   houseIdx: 7 }
  ];

  function resolveGeometry(w, h, geometry) {
    var minDim = Math.max(64, Math.min(w || 640, h || 480));
    var g = geometry || {};
    var cx = Number.isFinite(g.cx) ? g.cx : (w || 640) * 0.5;
    var cy = Number.isFinite(g.cy) ? g.cy : (h || 480) * 0.5;
    var outerR = Number.isFinite(g.outerR) && g.outerR > 10 ? g.outerR : minDim * 0.43;
    var cityR = Number.isFinite(g.cityR) && g.cityR > 8 ? g.cityR : outerR * 0.68;
    var innerR = Number.isFinite(g.innerR) && g.innerR > 4 ? g.innerR : cityR * 0.28;
    var cardoRad = Number.isFinite(g.cardoAngleRad) ? g.cardoAngleRad : -Math.PI * 0.5;
    var decumanusRad = Number.isFinite(g.decumanusAngleRad) ? g.decumanusAngleRad : 0;
    var rawSectors = Array.isArray(g.houseSectors) ? g.houseSectors : [];
    var sectors = [];
    for (var k = 0; k < 12; k++) {
      var s = rawSectors[k] || {};
      var midRad = Number.isFinite(s.midAngleRad) ? s.midAngleRad
        : (Number.isFinite(s.midRad) ? s.midRad
        : (Number.isFinite(s.angleRad) ? s.angleRad
        : (Number.isFinite(s.startRad) && Number.isFinite(s.endRad) ? (s.startRad + s.endRad) * 0.5
        : (Number.isFinite(s.startDeg) && Number.isFinite(s.endDeg) ? ((s.startDeg + s.endDeg) * 0.5 * Math.PI / 180)
        : (-Math.PI * 0.5 + (k + 0.5) * (Math.PI / 6))))));
      var ringR = (outerR + cityR) * 0.5;
      var tx = Number.isFinite(s.templeX) ? s.templeX : (Number.isFinite(s.x) ? s.x : cx + Math.cos(midRad) * ringR);
      var ty = Number.isFinite(s.templeY) ? s.templeY : (Number.isFinite(s.y) ? s.y : cy + Math.sin(midRad) * ringR);
      sectors.push({ index: k, midRad: midRad, x: tx, y: ty, glyph: ZODIAC_GLYPHS[k], name: ZODIAC_NAMES[k] });
    }
    return { cx: cx, cy: cy, outerR: outerR, cityR: cityR, innerR: innerR, cardoRad: cardoRad, decumanusRad: decumanusRad, sectors: sectors };
  }

  function slotPixelPos(slot, geo) {
    var r = geo.cityR;
    var ang = slot.axis === 'cardo' ? geo.cardoRad : geo.decumanusRad;
    var cosA = Math.cos(ang);
    var sinA = Math.sin(ang);
    var x, y;
    if (slot.axis === 'square') {
      var sr = Math.max(geo.innerR * 0.85, r * slot.sqRadius);
      x = geo.cx + Math.cos(slot.sqAngle + geo.decumanusRad * 0.5) * sr;
      y = geo.cy + Math.sin(slot.sqAngle + geo.decumanusRad * 0.5) * sr;
    } else {
      var dAlong = slot.along * r * 0.92;
      var dPerp = slot.perp * r;
      x = geo.cx + cosA * dAlong - sinA * dPerp;
      y = geo.cy + sinA * dAlong + cosA * dPerp;
    }
    return { x: x, y: y, cohortId: slot.cohortId, scale: slot.scale, variant: slot.variant };
  }

  function gratePixelPos(node, geo) {
    var twist = (geo.cardoRad + Math.PI * 0.5) * 0.35 + geo.decumanusRad * 0.35;
    var a = node.qAngle + twist;
    var rad = geo.cityR * node.rFrac;
    return {
      x: geo.cx + Math.cos(a) * rad,
      y: geo.cy + Math.sin(a) * rad,
      kind: node.kind,
      cohortId: node.cohortId,
      houseIdx: node.houseIdx
    };
  }

  function drawSurveyRubble(ctx, geo, rubbleShare) {
    if (rubbleShare <= 0.02) return;
    var count = Math.max(2, Math.round(18 * rubbleShare));
    ctx.save();
    ctx.strokeStyle = 'rgba(186, 169, 138, ' + (0.14 + 0.28 * rubbleShare).toFixed(3) + ')';
    ctx.fillStyle = 'rgba(120, 108, 88, ' + (0.12 + 0.22 * rubbleShare).toFixed(3) + ')';
    ctx.lineWidth = 1;
    for (var i = 0; i < count; i++) {
      var a = i * 2.094 + 0.37;
      var rad = geo.cityR * (0.26 + ((i * 11) % 9) * 0.072);
      var rx = geo.cx + Math.cos(a) * rad;
      var ry = geo.cy + Math.sin(a) * rad;
      var sz = Math.max(3, geo.cityR * 0.024);
      ctx.fillRect(rx - sz * 0.6, ry - sz * 0.4, sz * 1.2, sz * 0.8);
      ctx.strokeRect(rx - sz * 0.6, ry - sz * 0.4, sz * 1.2, sz * 0.8);
    }
    ctx.restore();
  }

  function drawStreetFigure(ctx, x, y, unit, cohortId, variant, isHighlighted) {
    ctx.save();
    ctx.translate(x, y);
    var u = Math.max(4.2, unit);
    ctx.fillStyle = isHighlighted ? '#2b190d' : '#1b120c';
    ctx.strokeStyle = isHighlighted ? '#ffd984' : '#d8ae68';
    ctx.lineWidth = isHighlighted ? 1.5 : 1.05;

    if (cohortId === 'cripples') {
      ctx.beginPath();
      ctx.arc(-u * 0.08, -u * 0.92, u * 0.24, 0, Math.PI * 2);
      ctx.moveTo(-u * 0.28, -u * 0.65);
      ctx.lineTo(u * 0.24, -u * 0.52);
      ctx.lineTo(u * 0.12, u * 0.36);
      ctx.lineTo(-u * 0.22, u * 0.18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-u * 0.44, -u * 0.56);
      ctx.lineTo(-u * 0.58, u * 0.72);
      ctx.moveTo(u * 0.36, -u * 0.48);
      ctx.lineTo(u * 0.52, u * 0.72);
      ctx.moveTo(-u * 0.54, -u * 0.58);
      ctx.lineTo(-u * 0.32, -u * 0.52);
      ctx.stroke();
    } else if (cohortId === 'dwarfs_hunchbacks') {
      var hunch = variant !== 0;
      ctx.beginPath();
      ctx.arc(hunch ? u * 0.22 : 0, hunch ? -u * 0.52 : -u * 0.48, u * 0.24, 0, Math.PI * 2);
      if (hunch) {
        ctx.moveTo(-u * 0.48, u * 0.15);
        ctx.quadraticCurveTo(-u * 0.35, -u * 0.95, u * 0.26, -u * 0.28);
        ctx.lineTo(u * 0.22, u * 0.58);
        ctx.lineTo(-u * 0.34, u * 0.58);
      } else {
        ctx.rect(-u * 0.36, -u * 0.22, u * 0.72, u * 0.68);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (cohortId === 'obese_men') {
      ctx.beginPath();
      ctx.arc(0, -u * 0.96, u * 0.23, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      if (typeof ctx.ellipse === 'function') {
        ctx.ellipse(0, -u * 0.14, u * 0.62, u * 0.66, 0, 0, Math.PI * 2);
      } else {
        ctx.arc(0, -u * 0.14, u * 0.64, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-u * 0.58, -u * 0.12);
      ctx.quadraticCurveTo(0, u * 0.06, u * 0.58, -u * 0.12);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, -u * 0.92, u * 0.24, 0, Math.PI * 2);
      ctx.moveTo(-u * 0.42, u * 0.66);
      ctx.lineTo(-u * 0.26, -u * 0.68);
      ctx.lineTo(u * 0.26, -u * 0.68);
      ctx.lineTo(u * 0.42, u * 0.66);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#e7c382';
      ctx.beginPath();
      ctx.moveTo(-u * 0.15, -u * 0.74);
      ctx.lineTo(u * 0.15, -u * 0.74);
      ctx.lineTo(u * 0.04, -u * 0.06);
      ctx.lineTo(-u * 0.08, -u * 0.12);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawCellarGratesAndHowls(ctx, geo, howlIntensity, howlPhase, reducedMotion) {
    ctx.save();
    var grateSz = Math.max(6, geo.cityR * 0.052);
    var ringsPerNode = howlIntensity > 0.65 ? 3 : 2;
    var points = [];
    for (var i = 0; i < GRATE_NODES.length; i++) {
      var gp = gratePixelPos(GRATE_NODES[i], geo);
      points.push(gp);
      var glowAlpha = 0.18 + 0.55 * howlIntensity;
      ctx.fillStyle = gp.kind === 'cellar'
        ? 'rgba(235, 118, 38, ' + glowAlpha.toFixed(3) + ')'
        : 'rgba(214, 152, 58, ' + (glowAlpha * 0.85).toFixed(3) + ')';
      ctx.strokeStyle = '#8f7248';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.rect(gp.x - grateSz * 0.5, gp.y - grateSz * 0.38, grateSz, grateSz * 0.76);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      for (var b = -1; b <= 1; b++) {
        var bx = gp.x + b * grateSz * 0.26;
        ctx.moveTo(bx, gp.y - grateSz * 0.38);
        ctx.lineTo(bx, gp.y + grateSz * 0.38);
      }
      ctx.stroke();

      for (var rIdx = 0; rIdx < ringsPerNode; rIdx++) {
        var prog = reducedMotion
          ? ((rIdx + 1) / (ringsPerNode + 0.6))
          : ((howlPhase + rIdx / ringsPerNode + i * 0.13) % 1);
        var waveR = grateSz * (0.75 + prog * (1.5 + 2.2 * howlIntensity));
        var waveA = (1 - prog) * (0.16 + 0.52 * howlIntensity);
        ctx.strokeStyle = 'rgba(244, 158, 66, ' + waveA.toFixed(3) + ')';
        ctx.lineWidth = 1 + howlIntensity * 0.7;
        ctx.beginPath();
        for (var s = 0; s <= 18; s++) {
          var th = (s / 18) * Math.PI * 2;
          var jag = 1 + 0.08 * howlIntensity * Math.sin(th * 6 + i);
          var wx = gp.x + Math.cos(th) * waveR * jag;
          var wy = gp.y + Math.sin(th) * waveR * jag;
          if (s === 0) ctx.moveTo(wx, wy);
          else ctx.lineTo(wx, wy);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }
    ctx.restore();
    return points;
  }

  function drawWoodcutProdigy(ctx, x, y, sz, kind, flicker) {
    ctx.save();
    ctx.translate(x, y);
    var u = Math.max(7, sz);
    var rimAlpha = clamp01(0.72 + (flicker - 1) * 0.9);
    ctx.fillStyle = '#140b07';
    ctx.strokeStyle = 'rgba(252, 194, 102, ' + rimAlpha.toFixed(3) + ')';
    ctx.lineWidth = 1.35;

    if (kind === 'three_headed') {
      var headOffsets = [
        { dx: -u * 0.46, dy: -u * 0.56, r: u * 0.23 },
        { dx: 0,         dy: -u * 0.74, r: u * 0.26 },
        { dx: u * 0.46,  dy: -u * 0.56, r: u * 0.23 }
      ];
      ctx.beginPath();
      ctx.moveTo(-u * 0.44, u * 0.58);
      ctx.lineTo(-u * 0.34, -u * 0.24);
      ctx.lineTo(u * 0.34, -u * 0.24);
      ctx.lineTo(u * 0.44, u * 0.58);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      for (var hIdx = 0; hIdx < 3; hIdx++) {
        var hd = headOffsets[hIdx];
        ctx.beginPath();
        ctx.moveTo(hd.dx * 0.35, -u * 0.22);
        ctx.lineTo(hd.dx, hd.dy + hd.r * 0.7);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(hd.dx, hd.dy, hd.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(255, 150, 64, 0.72)';
      ctx.beginPath();
      ctx.arc(0, -u * 1.05, u * 0.22, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(0, -u * 0.62, u * 0.25, 0, Math.PI * 2);
      ctx.moveTo(-u * 0.42, -u * 0.34);
      ctx.lineTo(u * 0.42, -u * 0.34);
      ctx.lineTo(u * 0.36, u * 0.14);
      ctx.lineTo(-u * 0.36, u * 0.14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      for (var leg = 0; leg < 6; leg++) {
        var side = leg < 3 ? -1 : 1;
        var tier = leg % 3;
        var hipX = side * u * (0.16 + tier * 0.1);
        var hipY = -u * 0.16 + tier * u * 0.13;
        var kneeX = side * u * (0.52 + tier * 0.14);
        var kneeY = hipY + u * 0.12;
        var footX = side * u * (0.44 + tier * 0.2);
        var footY = u * (0.46 + tier * 0.1);
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSubterraneanLoupe(ctx, w, h, geo, loupeCenter, reveal, monstrousShare, torchFlicker) {
    var targets = { threeHeaded: [], sixLegged: [] };
    if (reveal <= 0.01) return targets;

    var maxR = geo.cityR * 0.76;
    var loupeR = Math.max(18, geo.cityR * (0.16 + 0.60 * reveal));
    var rawX = clamp01(loupeCenter.nx) * w;
    var rawY = clamp01(loupeCenter.ny) * h;
    var pad = Math.min(loupeR + 8, Math.min(w, h) * 0.46);
    var lx = clamp(rawX, pad, Math.max(pad, w - pad));
    var ly = clamp(rawY, pad, Math.max(pad, h - pad));
    var loftSplitY = ly - loupeR * 0.18;

    ctx.save();
    ctx.beginPath();
    ctx.arc(lx, ly, loupeR, 0, Math.PI * 2);
    ctx.clip();

    ctx.fillStyle = '#0d0705';
    ctx.fillRect(lx - loupeR, ly - loupeR, loupeR * 2, loupeR * 2);

    if (typeof ctx.createRadialGradient === 'function') {
      var glowR = loupeR * (0.85 * torchFlicker);
      var grad = ctx.createRadialGradient(lx, ly + loupeR * 0.05, loupeR * 0.06, lx, ly, Math.max(20, glowR));
      grad.addColorStop(0, 'rgba(255, 152, 54, 0.34)');
      grad.addColorStop(0.55, 'rgba(168, 66, 20, 0.20)');
      grad.addColorStop(1, 'rgba(12, 6, 4, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(lx - loupeR, ly - loupeR, loupeR * 2, loupeR * 2);
    }

    ctx.strokeStyle = 'rgba(156, 104, 58, 0.55)';
    ctx.lineWidth = Math.max(1.5, loupeR * 0.03);
    ctx.beginPath();
    ctx.moveTo(lx - loupeR, loftSplitY);
    ctx.lineTo(lx + loupeR, loftSplitY);
    for (var rf = -3; rf <= 3; rf++) {
      var rx = lx + rf * loupeR * 0.28;
      ctx.moveTo(rx, loftSplitY);
      ctx.lineTo(rx + rf * loupeR * 0.08, ly - loupeR);
    }
    ctx.stroke();

    ctx.strokeStyle = 'rgba(178, 84, 44, 0.52)';
    ctx.lineWidth = Math.max(1.4, loupeR * 0.026);
    for (var v = -1; v <= 1; v++) {
      var vx = lx + v * loupeR * 0.56;
      var archR = loupeR * 0.34;
      ctx.beginPath();
      ctx.arc(vx, loftSplitY + archR * 0.95, archR, Math.PI, 0, false);
      ctx.moveTo(vx - archR, loftSplitY + archR * 0.95);
      ctx.lineTo(vx - archR, ly + loupeR);
      ctx.moveTo(vx + archR, loftSplitY + archR * 0.95);
      ctx.lineTo(vx + archR, ly + loupeR);
      ctx.stroke();
    }

    var torchPositions = [
      { x: lx - loupeR * 0.52, y: loftSplitY + loupeR * 0.24 },
      { x: lx + loupeR * 0.52, y: loftSplitY + loupeR * 0.24 }
    ];
    for (var tp = 0; tp < torchPositions.length; tp++) {
      var tc = torchPositions[tp];
      ctx.fillStyle = '#ffae42';
      ctx.beginPath();
      ctx.arc(tc.x, tc.y - 4, Math.max(3, loupeR * 0.045 * torchFlicker), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#6d533b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tc.x, tc.y - 1);
      ctx.lineTo(tc.x, tc.y + loupeR * 0.12);
      ctx.stroke();
    }

    var nThree = monstrousShare >= 0.72 ? 3 : 2;
    var nSix = monstrousShare >= 0.72 ? 3 : 2;
    var figUnit = clamp(loupeR * 0.16, 8, maxR * 0.18);

    for (var i = 0; i < nSix; i++) {
      var sx = lx + (i - (nSix - 1) * 0.5) * loupeR * 0.52;
      var sy = loftSplitY - loupeR * 0.24;
      drawWoodcutProdigy(ctx, sx, sy, figUnit * 0.92, 'six_legged', torchFlicker);
      targets.sixLegged.push({ x: sx, y: sy });
    }
    for (var j = 0; j < nThree; j++) {
      var cx3 = lx + (j - (nThree - 1) * 0.5) * loupeR * 0.54;
      var cy3 = loftSplitY + loupeR * 0.56;
      drawWoodcutProdigy(ctx, cx3, cy3, figUnit, 'three_headed', torchFlicker);
      targets.threeHeaded.push({ x: cx3, y: cy3 });
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = '#c99b4e';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(lx, ly, loupeR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255, 222, 156, 0.42)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(lx, ly, loupeR + 3.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    return targets;
  }

  function drawConfessionThreads(ctx, geo, streetByCohort, gratePoints, loupeTargets, highlightedHouse) {
    ctx.save();
    for (var hIdx = 0; hIdx < 12; hIdx++) {
      var sec = geo.sectors[hIdx];
      var cohort = HOUSE_TO_COHORT[hIdx];
      var pairOrd = cohort.zodiacIndices[0] === hIdx ? 0 : 1;
      var dest = null;

      if (cohort.id === 'three_headed_children') {
        if (loupeTargets.threeHeaded.length > 0) {
          dest = loupeTargets.threeHeaded[pairOrd % loupeTargets.threeHeaded.length];
        } else {
          for (var g1 = 0; g1 < gratePoints.length; g1++) {
            if (gratePoints[g1].cohortId === 'three_headed_children' && (pairOrd-- === 0)) {
              dest = gratePoints[g1];
              break;
            }
          }
        }
      } else if (cohort.id === 'six_legged_children') {
        if (loupeTargets.sixLegged.length > 0) {
          dest = loupeTargets.sixLegged[pairOrd % loupeTargets.sixLegged.length];
        } else {
          for (var g2 = 0; g2 < gratePoints.length; g2++) {
            if (gratePoints[g2].cohortId === 'six_legged_children' && (pairOrd-- === 0)) {
              dest = gratePoints[g2];
              break;
            }
          }
        }
      } else {
        var list = streetByCohort[cohort.id] || [];
        if (list.length > 0) {
          dest = list[(pairOrd * 2) % list.length];
        }
      }

      if (!dest) {
        dest = { x: geo.cx + Math.cos(sec.midRad) * geo.innerR, y: geo.cy + Math.sin(sec.midRad) * geo.innerR };
      }

      var active = highlightedHouse === hIdx;
      var isHidden = cohort.locus !== 'street';
      ctx.strokeStyle = active
        ? 'rgba(255, 236, 152, 0.96)'
        : (isHidden ? 'rgba(255, 178, 92, 0.78)' : 'rgba(116, 224, 255, 0.72)');
      ctx.lineWidth = active ? 2.1 : 1.3;
      if (typeof ctx.setLineDash === 'function') {
        ctx.setLineDash(isHidden ? [5, 3] : []);
      }
      ctx.beginPath();
      ctx.moveTo(sec.x, sec.y);
      ctx.lineTo(dest.x, dest.y);
      ctx.stroke();

      if (typeof ctx.setLineDash === 'function') ctx.setLineDash([]);
      ctx.fillStyle = isHidden ? '#ffb861' : '#7ae4ff';
      ctx.beginPath();
      ctx.arc(sec.x, sec.y, active ? 4.2 : 3.0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(dest.x, dest.y, active ? 6.5 : 4.6, 0, Math.PI * 2);
      ctx.stroke();

      if (typeof ctx.fillText === 'function' && geo.outerR >= 110) {
        var mx = sec.x * 0.58 + dest.x * 0.42;
        var my = sec.y * 0.58 + dest.y * 0.42;
        ctx.font = '600 9px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(12, 14, 20, 0.82)';
        ctx.fillRect(mx - 16, my - 6, 32, 12);
        ctx.fillStyle = isHidden ? '#ffd089' : '#aef0ff';
        ctx.fillText(sec.glyph + '\u2192' + cohort.shortCode, mx, my);
      }
    }
    ctx.restore();
  }

  function drawErrataCrossOuts(ctx, w, h, geo) {
    ctx.save();
    var r = geo.cityR;
    ctx.strokeStyle = 'rgba(218, 54, 58, 0.84)';
    ctx.lineWidth = 1.8;
    if (typeof ctx.setLineDash === 'function') ctx.setLineDash([9, 5]);
    for (var k = 0; k < 6; k++) {
      var a = k * (Math.PI / 3) + 0.28;
      var tx = geo.cx + Math.cos(a) * (r * 0.96);
      var ty = geo.cy + Math.sin(a) * (r * 0.96);
      var nx = -Math.sin(a) * (r * 0.36);
      var ny = Math.cos(a) * (r * 0.36);
      ctx.beginPath();
      ctx.moveTo(tx - nx, ty - ny);
      ctx.lineTo(tx + nx * 0.82, ty + ny * 0.82);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(geo.cx, geo.cy, r * (0.82 + (k % 2) * 0.22), a - 0.22, a + 0.20);
      ctx.stroke();
    }

    if (typeof ctx.setLineDash === 'function') ctx.setLineDash([]);
    ctx.strokeStyle = 'rgba(232, 62, 62, 0.78)';
    ctx.lineWidth = 2.2;
    for (var s = 0; s < 4; s++) {
      var sa = s * (Math.PI * 0.5) + 0.78;
      var sx = geo.cx + Math.cos(sa) * (r * 0.62);
      var sy = geo.cy + Math.sin(sa) * (r * 0.62);
      var d = Math.max(8, r * 0.08);
      ctx.beginPath();
      ctx.moveTo(sx - d, sy - d * 0.7);
      ctx.lineTo(sx + d, sy + d * 0.7);
      ctx.moveTo(sx + d, sy - d * 0.7);
      ctx.lineTo(sx - d, sy + d * 0.7);
      ctx.stroke();
    }

    var stampW = Math.min(236, Math.max(158, w * 0.34));
    var stampH = 38;
    var stampX = geo.cx;
    var stampY = clamp(geo.cy + geo.cityR * 0.72, stampH, Math.max(stampH, h - 26));
    ctx.translate(stampX, stampY);
    ctx.rotate(-0.055);
    ctx.fillStyle = 'rgba(24, 8, 10, 0.90)';
    ctx.strokeStyle = '#ef4b4f';
    ctx.lineWidth = 1.8;
    ctx.fillRect(-stampW * 0.5, -stampH * 0.5, stampW, stampH);
    ctx.strokeRect(-stampW * 0.5 + 2.5, -stampH * 0.5 + 2.5, stampW - 5, stampH - 5);
    if (typeof ctx.fillText === 'function') {
      ctx.fillStyle = '#ff7b7e';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 11px monospace';
      ctx.fillText('ARITHMETIC FLAWS FOUND: 0', 0, -5);
      ctx.fillStyle = '#e8c79e';
      ctx.font = '500 9px monospace';
      ctx.fillText('EPHEMERIS SKY ERROR: 0.00"', 0, 8);
    }
    ctx.restore();
  }

  function renderPlateFallback(canvas, plateKind) {
    if (!canvas || typeof canvas.getContext !== 'function') return false;
    var kind = plateKind === 'image' ? 'image' : 'map';
    if (!canvas.width || canvas.width < 120) canvas.width = 560;
    if (!canvas.height || canvas.height < 90) canvas.height = kind === 'map' ? 400 : 350;
    var ctx = canvas.getContext('2d');
    if (!ctx) return false;

    var w = canvas.width;
    var h = canvas.height;
    ctx.save();
    ctx.fillStyle = '#110d0a';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(202, 158, 86, 0.14)';
    ctx.lineWidth = 1;
    for (var gy = 14; gy < h - 14; gy += 8) {
      ctx.beginPath();
      ctx.moveTo(12, gy);
      ctx.lineTo(w - 12, gy);
      ctx.stroke();
    }

    ctx.strokeStyle = '#c89b52';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, w - 20, h - 20);
    ctx.lineWidth = 1;
    ctx.strokeRect(15, 15, w - 30, h - 30);

    var cx = w * 0.5;
    var cy = h * 0.46;
    var rad = Math.min(w, h) * 0.28;

    if (kind === 'map') {
      ctx.strokeStyle = '#d7af69';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, Math.PI * 2);
      ctx.arc(cx, cy, rad * 0.72, 0, Math.PI * 2);
      ctx.arc(cx, cy, rad * 0.26, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx, cy - rad * 1.12);
      ctx.lineTo(cx, cy + rad * 1.12);
      ctx.moveTo(cx - rad * 1.12, cy);
      ctx.lineTo(cx + rad * 1.12, cy);
      ctx.stroke();

      for (var z = 0; z < 12; z++) {
        var za = -Math.PI * 0.5 + z * (Math.PI / 6);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(za) * rad * 0.72, cy + Math.sin(za) * rad * 0.72);
        ctx.lineTo(cx + Math.cos(za) * rad, cy + Math.sin(za) * rad);
        ctx.stroke();
        if (typeof ctx.fillText === 'function') {
          var ga = za + Math.PI / 12;
          ctx.fillStyle = '#e6c588';
          ctx.font = '600 11px serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(ZODIAC_GLYPHS[z], cx + Math.cos(ga) * rad * 0.86, cy + Math.sin(ga) * rad * 0.86);
        }
      }
    } else {
      var vaultY = cy + rad * 0.05;
      ctx.strokeStyle = '#d7af69';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(cx, vaultY - rad * 0.18, rad * 0.78, Math.PI, 0, false);
      ctx.moveTo(cx - rad * 1.25, vaultY);
      ctx.lineTo(cx + rad * 1.25, vaultY);
      ctx.stroke();

      for (var v = -1; v <= 1; v++) {
        var vx = cx + v * rad * 0.76;
        var vr = rad * 0.34;
        ctx.strokeStyle = '#c47b47';
        ctx.beginPath();
        ctx.arc(vx, vaultY + vr * 0.9, vr, Math.PI, 0, false);
        ctx.moveTo(vx - vr, vaultY + vr * 0.9);
        ctx.lineTo(vx - vr, vaultY + rad * 0.85);
        ctx.moveTo(vx + vr, vaultY + vr * 0.9);
        ctx.lineTo(vx + vr, vaultY + rad * 0.85);
        ctx.stroke();
      }
      drawWoodcutProdigy(ctx, cx - rad * 0.76, vaultY + rad * 0.56, rad * 0.18, 'three_headed', 1.0);
      drawWoodcutProdigy(ctx, cx, vaultY + rad * 0.56, rad * 0.19, 'six_legged', 1.0);
      drawWoodcutProdigy(ctx, cx + rad * 0.76, vaultY + rad * 0.56, rad * 0.18, 'three_headed', 1.0);
    }

    if (typeof ctx.fillText === 'function') {
      ctx.fillStyle = '#efd5a3';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 12px monospace';
      var header = kind === 'map'
        ? 'PERINTHIA \u00B7 CHOROGRAPHIC ASTROLABE PLAN'
        : 'PERINTHIA \u00B7 OBSERVATORY & CELLAR VEDUTA';
      ctx.fillText(header, cx, 32);
      ctx.fillStyle = '#c89b52';
      ctx.font = '600 10px monospace';
      ctx.fillText('ARCHIVAL COPPERPLATE SPECIMEN \u00B7 PENDING_IMAGE_GENERATOR_QUOTA', cx, h - 30);
    }
    ctx.restore();
    return true;
  }

  function normalizeVerdict(verdictId) {
    if (verdictId === 1 || verdictId === '1') return 'admitCalculationsWrong';
    if (verdictId === 2 || verdictId === '2') return 'confessGodsOrderIsMonsters';
    if (verdictId === 0 || verdictId === '0' || !verdictId) return 'undecided';
    if (Object.prototype.hasOwnProperty.call(FORK_VERDICTS, verdictId)) return verdictId;
    return 'undecided';
  }

  function createMonstrousOrder(opts) {
    var options = opts || {};
    var onVerdictChange = typeof options.onVerdictChange === 'function' ? options.onVerdictChange : null;
    var onCellarToggle = typeof options.onCellarToggle === 'function' ? options.onCellarToggle : null;

    var celestialPrecision = 0.44;
    var monstrousBirthShare = 0.5061;
    var unfoundedSurveyRubble = 0.4939;
    var cellarHowlIntensity = 0.4221;
    var cellarOpen = false;
    var cellarReveal = 0;
    var cellarRevealTarget = 0;
    var loupeCenter = { nx: 0.5, ny: 0.5 };
    var terribleFork = 'undecided';
    var cohorts = [];
    var totalPopulace = 0;
    var streetProdigyCount = 0;
    var hiddenProdigyCount = 0;
    var animTime = 0;
    var howlPhase = 0;
    var torchFlicker = 1.0;
    var lastReducedMotion = false;

    function recomputeCensus(rawPrecision) {
      var p = round4(clamp01(rawPrecision));
      celestialPrecision = p >= 0.9999 ? 1 : p;
      monstrousBirthShare = celestialPrecision >= 0.9999
        ? 1.0
        : Number((0.18 + 0.82 * Math.pow(celestialPrecision, 1.12)).toFixed(4));
      unfoundedSurveyRubble = round4(Math.max(0, 1 - monstrousBirthShare));
      cellarHowlIntensity = celestialPrecision >= 0.9999
        ? 1.0
        : Number((0.12 + 0.88 * Math.pow(celestialPrecision, 1.3)).toFixed(4));

      var nextCohorts = [];
      var streetSum = 0;
      var hiddenSum = 0;
      for (var i = 0; i < PRODIGY_COHORTS.length; i++) {
        var def = PRODIGY_COHORTS[i];
        var cnt = Math.max(1, Math.round(def.baseMax * monstrousBirthShare));
        if (def.locus === 'street') streetSum += cnt;
        else hiddenSum += cnt;
        nextCohorts.push({
          id: def.id,
          label: def.label,
          locus: def.locus,
          count: cnt,
          zodiacIndices: def.zodiacIndices.slice(),
          zodiacGlyphs: def.zodiacGlyphs.slice()
        });
      }
      cohorts = nextCohorts;
      streetProdigyCount = streetSum;
      hiddenProdigyCount = hiddenSum;
      totalPopulace = streetSum + hiddenSum;
    }

    recomputeCensus(options.initialPrecision !== undefined ? options.initialPrecision : 0.44);

    function getState() {
      return {
        celestialPrecision: celestialPrecision,
        monstrousBirthShare: monstrousBirthShare,
        classicalPerfectionShare: 0,
        unfoundedSurveyRubble: unfoundedSurveyRubble,
        cellarOpen: cellarOpen,
        cellarReveal: cellarReveal,
        cellarHowlIntensity: cellarHowlIntensity,
        terribleFork: terribleFork,
        arithmeticErrorsFound: 0,
        totalPopulace: totalPopulace,
        streetProdigyCount: streetProdigyCount,
        hiddenProdigyCount: hiddenProdigyCount,
        loupeCenter: { nx: loupeCenter.nx, ny: loupeCenter.ny },
        cohorts: cohorts.map(function (c) {
          return {
            id: c.id,
            label: c.label,
            locus: c.locus,
            count: c.count,
            zodiacIndices: c.zodiacIndices.slice()
          };
        })
      };
    }

    function syncFromAstrolabe(astrolabeState) {
      var p = celestialPrecision;
      if (typeof astrolabeState === 'number') {
        p = astrolabeState;
      } else if (astrolabeState && typeof astrolabeState === 'object') {
        if (Number.isFinite(astrolabeState.celestialPrecision)) {
          p = astrolabeState.celestialPrecision;
        } else {
          var cP = Math.max(0, 1 - Math.abs(Number(astrolabeState.cardoOffsetDeg || 0)) / 30);
          var dP = Math.max(0, 1 - Math.abs(Number(astrolabeState.decumanusOffsetDeg || 0)) / 30);
          var eP = clamp01(astrolabeState.eclipseTuning !== undefined ? astrolabeState.eclipseTuning : 0.38);
          var hCount = Number.isFinite(astrolabeState.housesConsecrated)
            ? astrolabeState.housesConsecrated
            : (Array.isArray(astrolabeState.houseLocks) ? astrolabeState.houseLocks.filter(Boolean).length : 4);
          p = 0.30 * cP + 0.30 * dP + 0.25 * eP + 0.15 * clamp01(hCount / 12);
        }
      }
      recomputeCensus(p);
      return getState();
    }

    function setCellarReveal(openOr01) {
      if (typeof openOr01 === 'boolean') {
        cellarOpen = openOr01;
        cellarRevealTarget = openOr01 ? 1 : 0;
        if (lastReducedMotion) cellarReveal = cellarRevealTarget;
        else if (openOr01 && cellarReveal < 0.06) cellarReveal = 0.06;
      } else {
        var v = round4(clamp01(openOr01));
        cellarRevealTarget = v;
        cellarReveal = v;
        cellarOpen = v > 0.01;
      }
      var snap = getState();
      if (onCellarToggle) onCellarToggle(cellarOpen, snap);
      return snap;
    }

    function toggleCellarReveal() {
      return setCellarReveal(!cellarOpen);
    }

    function setLoupeCenter(nx, ny) {
      loupeCenter = { nx: round4(clamp01(nx)), ny: round4(clamp01(ny)) };
      return getState();
    }

    function setForkVerdict(verdictId) {
      terribleFork = normalizeVerdict(verdictId);
      var snap = getState();
      if (onVerdictChange) onVerdictChange(terribleFork, snap);
      return snap;
    }

    function step(dt, stepOpts) {
      var rm = Boolean(stepOpts && stepOpts.reducedMotion);
      lastReducedMotion = rm;
      if (rm) {
        cellarReveal = cellarRevealTarget;
        torchFlicker = 1.0;
        return getState();
      }
      var safeDt = Number.isFinite(dt) ? clamp(dt, 0, 0.25) : 0.016;
      var diff = cellarRevealTarget - cellarReveal;
      if (Math.abs(diff) < 0.0015) {
        cellarReveal = cellarRevealTarget;
      } else {
        cellarReveal = round4(cellarReveal + diff * (1 - Math.exp(-safeDt * 8.5)));
      }
      animTime += safeDt;
      howlPhase = (howlPhase + safeDt * (0.42 + 0.92 * cellarHowlIntensity)) % 1;
      torchFlicker = 1 + 0.08 * Math.sin(animTime * 9.3) + 0.05 * Math.cos(animTime * 15.7);
      return getState();
    }

    function renderStreetsAndCellars(ctx, w, h, geometry, renderOpts) {
      if (!ctx) return;
      var ro = renderOpts || {};
      var cw = Number.isFinite(w) && w > 0 ? w : 640;
      var ch = Number.isFinite(h) && h > 0 ? h : 480;
      var geo = resolveGeometry(cw, ch, geometry);
      var effReveal = Number.isFinite(ro.cellarReveal01) ? clamp01(ro.cellarReveal01) : cellarReveal;
      var effVerdict = ro.forkVerdict ? normalizeVerdict(ro.forkVerdict) : terribleFork;
      var hiHouse = Number.isInteger(ro.highlightedHouse) ? ro.highlightedHouse : -1;
      var rm = ro.reducedMotion !== undefined ? Boolean(ro.reducedMotion) : lastReducedMotion;

      ctx.save();
      drawSurveyRubble(ctx, geo, unfoundedSurveyRubble);

      var activeStreetSlots = Math.max(8, Math.round(STREET_SLOTS.length * monstrousBirthShare));
      var streetByCohort = { cripples: [], dwarfs_hunchbacks: [], obese_men: [], bearded_women: [] };
      var figBaseUnit = Math.max(4.4, geo.cityR * 0.044);

      for (var i = 0; i < activeStreetSlots; i++) {
        var sp = slotPixelPos(STREET_SLOTS[i], geo);
        streetByCohort[sp.cohortId].push(sp);
        var cohortDef = null;
        for (var cIdx = 0; cIdx < 4; cIdx++) {
          if (PRODIGY_COHORTS[cIdx].id === sp.cohortId) { cohortDef = PRODIGY_COHORTS[cIdx]; break; }
        }
        var isHi = cohortDef ? (cohortDef.zodiacIndices[0] === hiHouse || cohortDef.zodiacIndices[1] === hiHouse) : false;
        drawStreetFigure(ctx, sp.x, sp.y, figBaseUnit * sp.scale, sp.cohortId, sp.variant, isHi);
      }

      var gratePoints = drawCellarGratesAndHowls(ctx, geo, cellarHowlIntensity, howlPhase, rm);
      var loupeTargets = drawSubterraneanLoupe(ctx, cw, ch, geo, loupeCenter, effReveal, monstrousBirthShare, rm ? 1.0 : torchFlicker);

      if (effVerdict === 'confessGodsOrderIsMonsters') {
        drawConfessionThreads(ctx, geo, streetByCohort, gratePoints, loupeTargets, hiHouse);
      } else if (effVerdict === 'admitCalculationsWrong') {
        drawErrataCrossOuts(ctx, cw, ch, geo);
      }
      ctx.restore();
    }

    function reset() {
      terribleFork = 'undecided';
      cellarOpen = false;
      cellarReveal = 0;
      cellarRevealTarget = 0;
      loupeCenter = { nx: 0.5, ny: 0.5 };
      animTime = 0;
      howlPhase = 0;
      torchFlicker = 1.0;
      return getState();
    }

    return {
      syncFromAstrolabe: syncFromAstrolabe,
      setCellarReveal: setCellarReveal,
      toggleCellarReveal: toggleCellarReveal,
      setLoupeCenter: setLoupeCenter,
      setForkVerdict: setForkVerdict,
      step: step,
      renderStreetsAndCellars: renderStreetsAndCellars,
      renderPlateFallback: renderPlateFallback,
      getState: getState,
      reset: reset
    };
  }

  global.PerinthiaMonstrousOrder = Object.freeze({
    PRODIGY_COHORTS: PRODIGY_COHORTS,
    FORK_VERDICTS: FORK_VERDICTS,
    createMonstrousOrder: createMonstrousOrder,
    renderPlateFallback: renderPlateFallback
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
