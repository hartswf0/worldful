(function () {
  'use strict';

  var PALETTE = {
    cobaltTile: '#1f4e8c',
    canalVerdigris: '#2b7a78',
    roseTracery: '#b84a58',
    caperEmerald: '#2e7d4f',
    sunlightPatch: '#f6c96b',
    blankParchment: '#f4efe3',
    chalkLimestone: '#e8e0cf',
    graphiteZigzag: '#5a554c',
    inkRubric: '#1e2430'
  };

  var OBLIGATION_NODES = [
    { id: 'ob_morning_latch', index: 0, label: 'Rental Threshold Latch', normX: 0.14, normY: 0.75 },
    { id: 'ob_ledger_desk', index: 1, label: 'Notary Ledger Stool', normX: 0.33, normY: 0.56 },
    { id: 'ob_tax_wicket', index: 2, label: 'Municipal Stamp Wicket', normX: 0.51, normY: 0.69 },
    { id: 'ob_bread_queue', index: 3, label: 'Loaf & Weigh Counter', normX: 0.67, normY: 0.53 },
    { id: 'ob_cistern_pump', index: 4, label: 'Courtyard Cistern Bucket', normX: 0.49, normY: 0.39 },
    { id: 'ob_dusk_stair', index: 5, label: 'Back-Alley Boarding Stair', normX: 0.82, normY: 0.77 }
  ];

  var SPARSE_REMNANTS = [
    { id: 'remnant_bench_west', kind: 'bench', label: 'Sparse Stone Bench', normX: 0.28, normY: 0.73 },
    { id: 'remnant_door', kind: 'door', label: 'Plain Timber Door', normX: 0.85, normY: 0.73 },
    { id: 'remnant_stair', kind: 'stair', label: 'Worn Flight of Stairs', normX: 0.61, normY: 0.62 },
    { id: 'remnant_bench_east', kind: 'bench', label: 'Weathered Quay Bench', normX: 0.73, normY: 0.81 }
  ];

  var SUNLIGHT_PATCHES = [
    {
      id: 'sun_patch_west_bench',
      pointsNorm: [
        { x: 0.19, y: 0.73 },
        { x: 0.32, y: 0.71 },
        { x: 0.36, y: 0.82 },
        { x: 0.21, y: 0.84 }
      ],
      warmth: 0.92
    },
    {
      id: 'sun_patch_court_folio',
      pointsNorm: [
        { x: 0.40, y: 0.44 },
        { x: 0.54, y: 0.43 },
        { x: 0.58, y: 0.52 },
        { x: 0.42, y: 0.54 }
      ],
      warmth: 0.86
    },
    {
      id: 'sun_patch_worn_steps',
      pointsNorm: [
        { x: 0.55, y: 0.64 },
        { x: 0.68, y: 0.62 },
        { x: 0.72, y: 0.72 },
        { x: 0.57, y: 0.74 }
      ],
      warmth: 0.89
    },
    {
      id: 'sun_patch_east_threshold',
      pointsNorm: [
        { x: 0.75, y: 0.76 },
        { x: 0.90, y: 0.74 },
        { x: 0.94, y: 0.86 },
        { x: 0.77, y: 0.88 }
      ],
      warmth: 0.95
    }
  ];

  var PUNCTURE_TARGETS = [
    {
      wonderId: 'marvel_caper_bush',
      label: 'Caper Bush on the Wall Crag',
      normX: 0.83,
      normY: 0.43,
      radiusNorm: 0.13,
      epigraph: 'After years without looking up: a caper bush jutting from the crag pierces the blank wall.'
    },
    {
      wonderId: 'marvel_doorway_woman',
      label: 'Woman in a Doorway Combing Hair',
      normX: 0.86,
      normY: 0.72,
      radiusNorm: 0.13,
      epigraph: 'A slanted shaft of light catches a doorway silhouette drawing an ivory comb through dark hair.'
    },
    {
      wonderId: 'win_rose',
      label: 'Stray Ray in Forgotten Rose Tracery',
      normX: 0.38,
      normY: 0.21,
      radiusNorm: 0.12,
      epigraph: 'For half a breath, twelve stone petals flare before chalk habit closes the page.'
    }
  ];

  var BLANK_FACADE_BLOCKS = [
    { x: 0.08, y: 0.15, w: 0.16, h: 0.31, shadowW: 0.025 },
    { x: 0.23, y: 0.11, w: 0.20, h: 0.34, shadowW: 0.030 },
    { x: 0.42, y: 0.13, w: 0.15, h: 0.30, shadowW: 0.024 },
    { x: 0.56, y: 0.09, w: 0.19, h: 0.35, shadowW: 0.028 },
    { x: 0.74, y: 0.16, w: 0.18, h: 0.34, shadowW: 0.022 }
  ];

  var ERASED_ORNAMENT_ZONES = [
    { x: 0.17, y: 0.28, w: 0.07, h: 0.10, lines: 5 },
    { x: 0.25, y: 0.33, w: 0.06, h: 0.08, lines: 4 },
    { x: 0.30, y: 0.25, w: 0.07, h: 0.10, lines: 5 },
    { x: 0.38, y: 0.21, w: 0.08, h: 0.11, lines: 6 },
    { x: 0.48, y: 0.22, w: 0.07, h: 0.11, lines: 5 },
    { x: 0.63, y: 0.26, w: 0.07, h: 0.10, lines: 5 },
    { x: 0.69, y: 0.15, w: 0.09, h: 0.10, lines: 5 },
    { x: 0.76, y: 0.29, w: 0.07, h: 0.10, lines: 5 },
    { x: 0.83, y: 0.43, w: 0.08, h: 0.09, lines: 4 },
    { x: 0.49, y: 0.50, w: 0.14, h: 0.09, lines: 4 }
  ];

  var ERASED_BRIDGE_SLABS = [
    { x: 0.24, y: 0.68, w: 0.09, h: 0.032, tilt: -0.08 },
    { x: 0.34, y: 0.49, w: 0.09, h: 0.034, tilt: 0.06 },
    { x: 0.46, y: 0.61, w: 0.09, h: 0.032, tilt: -0.05 },
    { x: 0.58, y: 0.74, w: 0.10, h: 0.032, tilt: 0.04 },
    { x: 0.66, y: 0.52, w: 0.09, h: 0.030, tilt: -0.07 },
    { x: 0.42, y: 0.36, w: 0.08, h: 0.028, tilt: 0.05 },
    { x: 0.20, y: 0.44, w: 0.08, h: 0.030, tilt: -0.04 },
    { x: 0.77, y: 0.66, w: 0.09, h: 0.032, tilt: 0.06 },
    { x: 0.54, y: 0.33, w: 0.08, h: 0.028, tilt: -0.09 }
  ];

  var OCULAR_SCAN_MOTIFS = [
    { x: 0.14, y: 0.21, s: 0.90, threshold: 0.12 },
    { x: 0.23, y: 0.17, s: 0.82, threshold: 0.18 },
    { x: 0.31, y: 0.31, s: 0.95, threshold: 0.24 },
    { x: 0.39, y: 0.16, s: 0.88, threshold: 0.30 },
    { x: 0.46, y: 0.29, s: 0.92, threshold: 0.36 },
    { x: 0.54, y: 0.19, s: 0.85, threshold: 0.42 },
    { x: 0.61, y: 0.33, s: 0.94, threshold: 0.48 },
    { x: 0.68, y: 0.22, s: 0.86, threshold: 0.54 },
    { x: 0.77, y: 0.21, s: 0.90, threshold: 0.60 },
    { x: 0.84, y: 0.34, s: 0.88, threshold: 0.66 },
    { x: 0.21, y: 0.39, s: 0.80, threshold: 0.72 },
    { x: 0.37, y: 0.42, s: 0.84, threshold: 0.78 },
    { x: 0.58, y: 0.43, s: 0.84, threshold: 0.84 },
    { x: 0.73, y: 0.41, s: 0.82, threshold: 0.90 }
  ];

  var ROMAN_TICKS = ['I', 'II', 'III', 'IV', 'V', 'VI'];

  function clamp(val, minVal, maxVal) {
    return Math.max(minVal, Math.min(maxVal, val));
  }

  function buildLegFootsteps(fromIdx, toIdx, startStrideIndex) {
    var a = OBLIGATION_NODES[fromIdx];
    var b = OBLIGATION_NODES[toIdx];
    var dx = b.normX - a.normX;
    var dy = b.normY - a.normY;
    var dist = Math.hypot(dx, dy) || 0.001;
    var angle = Math.atan2(dy, dx);
    var stepsCount = Math.max(5, Math.min(11, Math.round(dist / 0.028)));
    var nx = -dy / dist;
    var ny = dx / dist;
    var marks = [];
    for (var i = 1; i < stepsCount; i++) {
      var t = i / stepsCount;
      var side = ((startStrideIndex + i) % 2 === 0) ? 1 : -1;
      marks.push({
        normX: a.normX + dx * t + nx * side * 0.0055,
        normY: a.normY + dy * t + ny * side * 0.0055,
        angle: angle,
        side: side,
        legFrom: fromIdx,
        legTo: toIdx
      });
    }
    return marks;
  }

  function buildFullCircuitFootsteps() {
    var all = [];
    for (var i = 0; i < OBLIGATION_NODES.length; i++) {
      var next = (i + 1) % OBLIGATION_NODES.length;
      var leg = buildLegFootsteps(i, next, i * 7);
      for (var j = 0; j < leg.length; j++) {
        all.push(leg[j]);
      }
    }
    return all;
  }

  function applyEvenOddPuncturePath(ctx, width, height, puncture) {
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    if (puncture && puncture.active && puncture.intensity > 0) {
      var px = puncture.normX * width;
      var py = puncture.normY * height;
      var pRad = puncture.radiusNorm * Math.min(width, height) * (0.86 + 0.14 * puncture.intensity);
      ctx.moveTo(px + pRad, py);
      ctx.arc(px, py, pRad, 0, Math.PI * 2, true);
    }
  }

  function drawBlankArchitectureAndFolio(ctx, width, height, bf, puncture) {
    var washAlpha = clamp(Math.pow(bf, 0.82) * 0.94, 0, 0.94);
    ctx.save();
    ctx.globalAlpha = washAlpha;
    if (typeof ctx.createLinearGradient === 'function') {
      var skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, PALETTE.blankParchment);
      skyGrad.addColorStop(0.52, '#efe8d8');
      skyGrad.addColorStop(1, PALETTE.chalkLimestone);
      ctx.fillStyle = skyGrad;
    } else {
      ctx.fillStyle = PALETTE.blankParchment;
    }
    applyEvenOddPuncturePath(ctx, width, height, puncture);
    ctx.fill('evenodd');

    var archAlpha = clamp((bf - 0.05) / 0.85, 0, 1);
    if (archAlpha > 0.01) {
      ctx.globalAlpha = archAlpha * 0.92;
      ctx.fillStyle = '#e6decb';
      ctx.fillRect(0, height * 0.47, width, height * 0.53);

      // Muted chalk canal ribbon replacing verdigris water
      ctx.beginPath();
      ctx.moveTo(0, height * 0.58);
      ctx.bezierCurveTo(width * 0.28, height * 0.47, width * 0.52, height * 0.72, width, height * 0.59);
      ctx.lineTo(width, height * 0.67);
      ctx.bezierCurveTo(width * 0.52, height * 0.80, width * 0.28, height * 0.55, 0, height * 0.66);
      ctx.closePath();
      ctx.fillStyle = '#dcd3bf';
      ctx.fill();

      // De Chirico austere blank palazzo blocks & oblique chalk shadows
      for (var i = 0; i < BLANK_FACADE_BLOCKS.length; i++) {
        var b = BLANK_FACADE_BLOCKS[i];
        var bx = b.x * width;
        var by = b.y * height;
        var bw = b.w * width;
        var bh = b.h * height;
        var sw = b.shadowW * width;

        ctx.fillStyle = '#dbd1bc';
        ctx.beginPath();
        ctx.moveTo(bx + bw, by + height * 0.012);
        ctx.lineTo(bx + bw + sw, by + height * 0.026);
        ctx.lineTo(bx + bw + sw, by + bh);
        ctx.lineTo(bx + bw, by + bh);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = (i % 2 === 0) ? PALETTE.blankParchment : '#efe9da';
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = '#c8beaa';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx, by, bw, bh);
      }

      // 9 bleached flat limestone bridge slabs erasing ornate canal spans
      for (var s = 0; s < ERASED_BRIDGE_SLABS.length; s++) {
        var br = ERASED_BRIDGE_SLABS[s];
        ctx.save();
        ctx.translate(br.x * width, br.y * height);
        ctx.rotate(br.tilt);
        var swW = br.w * width;
        var swH = br.h * height;
        ctx.fillStyle = '#ede6d6';
        ctx.fillRect(-swW * 0.5, -swH * 0.5, swW, swH);
        ctx.strokeStyle = '#bfb49f';
        ctx.lineWidth = 1;
        ctx.strokeRect(-swW * 0.5, -swH * 0.5, swW, swH);
        ctx.restore();
      }
    }

    // Blank-folio ruled manuscript lines over erased window, dome & pavement zones
    var folioAlpha = clamp((bf - 0.14) / 0.76, 0, 1);
    if (folioAlpha > 0.01) {
      ctx.globalAlpha = folioAlpha * 0.68;
      ctx.strokeStyle = '#beb39d';
      ctx.lineWidth = 1;
      for (var z = 0; z < ERASED_ORNAMENT_ZONES.length; z++) {
        var zn = ERASED_ORNAMENT_ZONES[z];
        var zx = (zn.x - zn.w * 0.5) * width;
        var zy = (zn.y - zn.h * 0.5) * height;
        var zw = zn.w * width;
        var zh = zn.h * height;
        ctx.fillStyle = '#f6f1e6';
        ctx.fillRect(zx, zy, zw, zh);
        for (var ln = 1; ln <= zn.lines; ln++) {
          var ly = zy + (zh * ln) / (zn.lines + 1);
          ctx.beginPath();
          ctx.moveTo(zx + zw * 0.08, ly);
          ctx.lineTo(zx + zw * 0.92, ly);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  function drawScanningEyes(ctx, width, height, bf, eyeScanPhase) {
    if (bf <= 0.12) return;
    var unit = Math.min(width, height);
    var drift = Math.sin(eyeScanPhase) * unit * 0.004;
    ctx.save();
    for (var i = 0; i < OCULAR_SCAN_MOTIFS.length; i++) {
      var m = OCULAR_SCAN_MOTIFS[i];
      if (bf < m.threshold) continue;
      var localA = clamp((bf - m.threshold) / 0.22, 0, 1) * 0.46;
      var ex = m.x * width;
      var ey = m.y * height;
      var rx = unit * 0.019 * m.s;
      var ry = unit * 0.0085 * m.s;
      ctx.globalAlpha = localA;
      ctx.strokeStyle = '#787062';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(ex - rx, ey);
      ctx.quadraticCurveTo(ex, ey - ry * 1.55, ex + rx, ey);
      ctx.quadraticCurveTo(ex, ey + ry * 1.35, ex - rx, ey);
      ctx.stroke();

      // Hollow unseeing iris ring scanning across blank ruled pages
      ctx.beginPath();
      ctx.arc(ex + drift * ((i % 2 === 0) ? 1 : -1), ey - ry * 0.08, ry * 0.62, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSunlightPatches(ctx, width, height, vis) {
    if (vis <= 0.02) return;
    ctx.save();
    for (var i = 0; i < SUNLIGHT_PATCHES.length; i++) {
      var patch = SUNLIGHT_PATCHES[i];
      var pts = patch.pointsNorm;
      var alpha = clamp(vis * patch.warmth * 0.62, 0, 0.62);

      // Subtle slanted light shaft descending onto the chalk ground
      ctx.globalAlpha = alpha * 0.24;
      ctx.fillStyle = PALETTE.sunlightPatch;
      ctx.beginPath();
      ctx.moveTo(pts[0].x * width - width * 0.05, pts[0].y * height - height * 0.19);
      ctx.lineTo(pts[1].x * width - width * 0.04, pts[1].y * height - height * 0.19);
      ctx.lineTo(pts[1].x * width, pts[1].y * height);
      ctx.lineTo(pts[0].x * width, pts[0].y * height);
      ctx.closePath();
      ctx.fill();

      // Warm trapezoid sunlight patch on limestone floor
      ctx.globalAlpha = alpha;
      ctx.fillStyle = PALETTE.sunlightPatch;
      ctx.beginPath();
      ctx.moveTo(pts[0].x * width, pts[0].y * height);
      for (var k = 1; k < pts.length; k++) {
        ctx.lineTo(pts[k].x * width, pts[k].y * height);
      }
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = alpha * 0.72;
      ctx.strokeStyle = '#dca640';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSparseRemnants(ctx, width, height, vis) {
    if (vis <= 0.04) return;
    var unit = Math.min(width, height);
    ctx.save();
    ctx.globalAlpha = clamp(vis * 0.96, 0, 0.96);

    for (var i = 0; i < SPARSE_REMNANTS.length; i++) {
      var r = SPARSE_REMNANTS[i];
      var rx = r.normX * width;
      var ry = r.normY * height;

      if (r.kind === 'bench') {
        var bw = unit * 0.068;
        var bh = unit * 0.011;
        // Oblique bench shadow
        ctx.fillStyle = 'rgba(90, 85, 76, 0.20)';
        ctx.beginPath();
        ctx.moveTo(rx - bw * 0.45, ry + bh * 2.1);
        ctx.lineTo(rx + bw * 0.62, ry + bh * 2.1);
        ctx.lineTo(rx + bw * 0.48, ry + bh * 2.9);
        ctx.lineTo(rx - bw * 0.56, ry + bh * 2.9);
        ctx.closePath();
        ctx.fill();

        // Carved Istrian stone piers + flat seat slab
        ctx.fillStyle = '#cfc5b1';
        ctx.strokeStyle = PALETTE.graphiteZigzag;
        ctx.lineWidth = 1.2;
        ctx.fillRect(rx - bw * 0.38, ry + bh * 0.5, bw * 0.14, bh * 1.6);
        ctx.strokeRect(rx - bw * 0.38, ry + bh * 0.5, bw * 0.14, bh * 1.6);
        ctx.fillRect(rx + bw * 0.24, ry + bh * 0.5, bw * 0.14, bh * 1.6);
        ctx.strokeRect(rx + bw * 0.24, ry + bh * 0.5, bw * 0.14, bh * 1.6);
        ctx.fillStyle = '#dfd7c5';
        ctx.fillRect(rx - bw * 0.5, ry - bh * 0.5, bw, bh);
        ctx.strokeRect(rx - bw * 0.5, ry - bh * 0.5, bw, bh);
      } else if (r.kind === 'door') {
        var dw = unit * 0.044;
        var dh = unit * 0.086;
        // Bare chalk reveal + plain timber plank door
        ctx.fillStyle = '#d8ceba';
        ctx.fillRect(rx - dw * 0.62, ry - dh * 0.58, dw * 1.24, dh * 1.12);
        ctx.fillStyle = '#8b7358';
        ctx.strokeStyle = PALETTE.graphiteZigzag;
        ctx.lineWidth = 1.3;
        ctx.fillRect(rx - dw * 0.5, ry - dh * 0.5, dw, dh);
        ctx.strokeRect(rx - dw * 0.5, ry - dh * 0.5, dw, dh);
        // Plank seams & iron latch ring
        ctx.beginPath();
        ctx.moveTo(rx - dw * 0.16, ry - dh * 0.5);
        ctx.lineTo(rx - dw * 0.16, ry + dh * 0.5);
        ctx.moveTo(rx + dw * 0.17, ry - dh * 0.5);
        ctx.lineTo(rx + dw * 0.17, ry + dh * 0.5);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rx + dw * 0.30, ry + dh * 0.04, unit * 0.0045, 0, Math.PI * 2);
        ctx.stroke();
      } else if (r.kind === 'stair') {
        var sw = unit * 0.064;
        var sh = unit * 0.056;
        var steps = 6;
        ctx.strokeStyle = PALETTE.graphiteZigzag;
        ctx.lineWidth = 1.15;
        for (var st = 0; st < steps; st++) {
          var frac = st / steps;
          var tx = rx - sw * 0.5 + frac * sw * 0.24;
          var ty = ry + sh * 0.45 - frac * sh;
          var tw = sw * (1 - frac * 0.28);
          var th = sh / steps;
          ctx.fillStyle = (st % 2 === 0) ? '#dfd6c3' : '#cfc5b0';
          ctx.fillRect(tx, ty - th, tw, th);
          ctx.strokeRect(tx, ty - th, tw, th);
        }
      }
    }
    ctx.restore();
  }

  function drawZigzagObligations(ctx, width, height, vis, footsteps, activeNodeIdx, marchPhase, bf) {
    if (vis <= 0.02 && footsteps.length === 0) return;
    var unit = Math.min(width, height);
    var alpha = clamp(Math.max(vis, footsteps.length > 0 ? 0.55 : 0), 0, 1);

    ctx.save();
    ctx.globalAlpha = alpha * 0.85;
    ctx.strokeStyle = PALETTE.graphiteZigzag;
    ctx.lineWidth = Math.max(1.4, unit * 0.0022);
    if (typeof ctx.setLineDash === 'function') {
      ctx.setLineDash([7, 5]);
      ctx.lineDashOffset = -marchPhase * 14;
    }
    ctx.beginPath();
    for (var i = 0; i < OBLIGATION_NODES.length; i++) {
      var n = OBLIGATION_NODES[i];
      if (i === 0) ctx.moveTo(n.normX * width, n.normY * height);
      else ctx.lineTo(n.normX * width, n.normY * height);
    }
    ctx.lineTo(OBLIGATION_NODES[0].normX * width, OBLIGATION_NODES[0].normY * height);
    ctx.stroke();
    if (typeof ctx.setLineDash === 'function') ctx.setLineDash([]);

    // Shoe-sole + heel prints along trudged & habitual legs
    var prints = footsteps.length > 0 ? footsteps : buildFullCircuitFootsteps();
    var showCount = footsteps.length > 0
      ? prints.length
      : Math.floor(prints.length * clamp(bf * 1.05, 0, 1));
    ctx.fillStyle = PALETTE.graphiteZigzag;
    for (var p = 0; p < showCount; p++) {
      var fp = prints[p];
      ctx.save();
      ctx.translate(fp.normX * width, fp.normY * height);
      ctx.rotate(fp.angle);
      ctx.globalAlpha = alpha * 0.78;
      var soleL = unit * 0.0085;
      var soleW = unit * 0.0038;
      ctx.beginPath();
      ctx.arc(soleL * 0.28, 0, soleW, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-soleL * 0.55, -soleW * 0.72, soleL * 0.42, soleW * 1.44);
      ctx.restore();
    }

    // Obligation waypoint pins I..VI
    for (var m = 0; m < OBLIGATION_NODES.length; m++) {
      var nd = OBLIGATION_NODES[m];
      var nx = nd.normX * width;
      var ny = nd.normY * height;
      var isCurr = m === activeNodeIdx;
      var pinR = unit * (isCurr ? 0.0145 : 0.011);
      ctx.globalAlpha = alpha * (isCurr ? 0.98 : 0.82);
      ctx.fillStyle = isCurr ? PALETTE.inkRubric : PALETTE.blankParchment;
      ctx.strokeStyle = PALETTE.graphiteZigzag;
      ctx.lineWidth = isCurr ? 1.8 : 1.2;
      ctx.beginPath();
      ctx.arc(nx, ny, pinR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isCurr ? PALETTE.sunlightPatch : PALETTE.graphiteZigzag;
      ctx.font = '600 ' + Math.max(9, Math.round(unit * 0.0115)) + 'px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ROMAN_TICKS[m], nx, ny + 0.5);
    }
    ctx.restore();
  }

  function drawPunctureHalo(ctx, width, height, puncture) {
    if (!puncture || !puncture.active || puncture.intensity <= 0) return;
    var unit = Math.min(width, height);
    var px = puncture.normX * width;
    var py = puncture.normY * height;
    var pRad = puncture.radiusNorm * unit * (0.86 + 0.14 * puncture.intensity);
    var accent = puncture.wonderId === 'marvel_caper_bush'
      ? PALETTE.caperEmerald
      : (puncture.wonderId === 'win_rose' ? PALETTE.roseTracery : PALETTE.sunlightPatch);

    ctx.save();
    ctx.globalAlpha = 0.22 * puncture.intensity;
    ctx.fillStyle = PALETTE.sunlightPatch;
    ctx.beginPath();
    ctx.moveTo(px - pRad * 1.45, 0);
    ctx.lineTo(px - pRad * 0.25, 0);
    ctx.lineTo(px + pRad * 0.88, py + pRad * 0.35);
    ctx.lineTo(px - pRad * 0.88, py + pRad * 0.35);
    ctx.closePath();
    ctx.fill();

    ctx.globalAlpha = 0.92 * puncture.intensity;
    ctx.strokeStyle = PALETTE.sunlightPatch;
    ctx.lineWidth = Math.max(2.2, unit * 0.004);
    ctx.beginPath();
    ctx.arc(px, py, pRad, 0, Math.PI * 2);
    ctx.stroke();

    ctx.globalAlpha = 0.78 * puncture.intensity;
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(px, py, pRad + unit * 0.007, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function resolvePunctureTarget(wonderId) {
    var key = String(wonderId || 'marvel_caper_bush');
    for (var i = 0; i < PUNCTURE_TARGETS.length; i++) {
      if (PUNCTURE_TARGETS[i].wonderId === key) return PUNCTURE_TARGETS[i];
    }
    if (key.indexOf('door') !== -1 || key.indexOf('woman') !== -1) return PUNCTURE_TARGETS[1];
    if (key.indexOf('rose') !== -1) return PUNCTURE_TARGETS[2];
    return PUNCTURE_TARGETS[0];
  }

  function createHabitBleacher(opts) {
    var options = opts || {};
    var viewW = 1280, viewH = 800, viewDpr = 1;
    var residenceDays = 1;
    var errandsTrudged = 0;
    var bleachFactor = 0.0;
    var currentObligationIndex = 0;
    var unexpectedInstantsCount = 0;
    var footsteps = [];
    var marchPhase = 0;
    var eyeScanPhase = 0;
    var puncture = {
      active: false, wonderId: null, label: '',
      normX: 0.83, normY: 0.43, radiusNorm: 0.13,
      intensity: 0, ttlSec: 0, epigraph: ''
    };

    function syncBleach() {
      if (residenceDays <= 1 && errandsTrudged === 0) {
        bleachFactor = 0.0;
      } else if (residenceDays >= 365) {
        bleachFactor = 1.0;
      } else {
        var dayTerm = residenceDays <= 1 ? 0 : Math.min(1, Math.log(residenceDays) / Math.log(365));
        var errandTerm = Math.min(0.45, errandsTrudged * 0.04);
        bleachFactor = +(Math.min(1, dayTerm + errandTerm)).toFixed(4);
      }
    }

    function getPhaseLabel() {
      if (puncture.active) return 'Unexpected Instant — Blank Veil Pierced';
      if (bleachFactor <= 0.02) return 'First Arrival — Transient Eye';
      if (bleachFactor < 0.45) return 'Settling In — Ornaments Fading';
      if (bleachFactor < 0.92) return 'Habitual Routine — Chalk Palimpsest';
      return 'Lifelong Residence — Blank Pages & Zigzag Steps';
    }

    function getState() {
      return {
        residenceDays: residenceDays,
        errandsTrudged: errandsTrudged,
        bleachFactor: bleachFactor,
        marvelVisibility: +(1 - bleachFactor).toFixed(4),
        erasedOrnamentCount: Math.round(bleachFactor * 23),
        scanningEyesMillions: +(bleachFactor * 2.4).toFixed(2),
        zigzagVisibility: +(Math.min(1, bleachFactor * 1.15)).toFixed(4),
        currentObligationIndex: currentObligationIndex,
        currentObligationLabel: OBLIGATION_NODES[currentObligationIndex].label,
        unexpectedInstantsCount: unexpectedInstantsCount,
        puncture: Object.assign({}, puncture),
        phaseLabel: getPhaseLabel()
      };
    }

    function notifyBleach() {
      if (typeof options.onBleachChanged === 'function') options.onBleachChanged(getState());
    }

    function appendLeg(fromIdx, toIdx) {
      var leg = buildLegFootsteps(fromIdx, toIdx, footsteps.length);
      for (var i = 0; i < leg.length; i++) footsteps.push(leg[i]);
      if (footsteps.length > 96) footsteps = footsteps.slice(footsteps.length - 96);
    }

    return {
      PALETTE: PALETTE,
      OBLIGATION_NODES: OBLIGATION_NODES,
      SPARSE_REMNANTS: SPARSE_REMNANTS,
      SUNLIGHT_PATCHES: SUNLIGHT_PATCHES,
      PUNCTURE_TARGETS: PUNCTURE_TARGETS,
      resize: function (width, height, dpr) {
        viewW = Math.max(1, Number(width) || 1280);
        viewH = Math.max(1, Number(height) || 800);
        viewDpr = Math.max(1, Number(dpr) || 1);
        return { width: viewW, height: viewH, dpr: viewDpr };
      },
      setResidenceDays: function (days) {
        var d = clamp(Math.round(Number(days) || 1), 1, 3650);
        residenceDays = d;
        if (d <= 1) {
          errandsTrudged = 0;
          currentObligationIndex = 0;
          footsteps = [];
        }
        syncBleach();
        notifyBleach();
        return getState();
      },
      advanceResidence: function (deltaDays) {
        var stepDays = Math.max(1, Math.round(deltaDays === undefined ? 30 : Number(deltaDays) || 30));
        residenceDays = Math.min(3650, residenceDays + stepDays);
        var f0 = currentObligationIndex;
        var f1 = (f0 + 1) % OBLIGATION_NODES.length;
        var f2 = (f0 + 2) % OBLIGATION_NODES.length;
        appendLeg(f0, f1);
        appendLeg(f1, f2);
        currentObligationIndex = f2;
        errandsTrudged += 2;
        syncBleach();
        notifyBleach();
        return getState();
      },
      trudgeObligationStep: function (targetIndexOptional) {
        var fromIdx = currentObligationIndex;
        var toIdx = (typeof targetIndexOptional === 'number' && Number.isFinite(targetIndexOptional))
          ? (((Math.round(targetIndexOptional) % 6) + 6) % 6)
          : ((fromIdx + 1) % 6);
        appendLeg(fromIdx === toIdx ? ((toIdx + 5) % 6) : fromIdx, toIdx);
        currentObligationIndex = toIdx;
        errandsTrudged += 1;
        residenceDays = Math.min(3650, residenceDays + (residenceDays < 30 ? 5 : 20));
        syncBleach();
        if (typeof options.onErrandStep === 'function') {
          options.onErrandStep({ fromIndex: fromIdx, toIndex: toIdx, node: OBLIGATION_NODES[toIdx], errandsTrudged: errandsTrudged, bleachFactor: bleachFactor });
        }
        notifyBleach();
        return getState();
      },
      dwellForYears: function () {
        residenceDays = 1095;
        errandsTrudged = Math.max(12, errandsTrudged + 6);
        bleachFactor = 1.0;
        footsteps = buildFullCircuitFootsteps();
        notifyBleach();
        return getState();
      },
      triggerUnexpectedInstant: function (targetWonderId) {
        var target = resolvePunctureTarget(targetWonderId);
        puncture = {
          active: true,
          wonderId: target.wonderId,
          label: target.label,
          normX: target.normX,
          normY: target.normY,
          radiusNorm: target.radiusNorm,
          intensity: 1.0,
          ttlSec: 7.0,
          epigraph: target.epigraph
        };
        unexpectedInstantsCount += 1;
        if (typeof options.onPunctureTriggered === 'function') options.onPunctureTriggered(Object.assign({}, puncture));
        return Object.assign({}, puncture);
      },
      clearPuncture: function () {
        puncture.active = false;
        puncture.intensity = 0;
        puncture.ttlSec = 0;
        return getState();
      },
      hitTestHabit: function (normX, normY) {
        var nx = Number(normX), ny = Number(normY);
        if (!Number.isFinite(nx) || !Number.isFinite(ny)) return null;
        if (bleachFactor >= 0.35) {
          for (var i = 0; i < PUNCTURE_TARGETS.length; i++) {
            var pt = PUNCTURE_TARGETS[i];
            if (Math.hypot(nx - pt.normX, ny - pt.normY) <= 0.065) {
              return { kind: 'puncture_target', target: Object.assign({}, pt) };
            }
          }
        }
        for (var j = 0; j < OBLIGATION_NODES.length; j++) {
          var ob = OBLIGATION_NODES[j];
          if (Math.hypot(nx - ob.normX, ny - ob.normY) <= 0.065) {
            return { kind: 'obligation', node: Object.assign({}, ob) };
          }
        }
        return null;
      },
      step: function (dtSec, reducedMotion) {
        var dt = Math.max(0, Number(dtSec) || 0);
        var isReduced = (typeof reducedMotion === 'object' && reducedMotion !== null)
          ? Boolean(reducedMotion.reducedMotion)
          : Boolean(reducedMotion);
        if (!isReduced && dt > 0) {
          marchPhase = (marchPhase + dt * 0.85) % 1000;
          eyeScanPhase = (eyeScanPhase + dt * 0.55) % (Math.PI * 2);
        }
        if (puncture.active && dt > 0) {
          puncture.ttlSec = Math.max(0, +(puncture.ttlSec - dt).toFixed(4));
          if (puncture.ttlSec <= 0) {
            puncture.active = false;
            puncture.intensity = 0;
            puncture.ttlSec = 0;
          } else if (puncture.ttlSec >= 2.0) {
            puncture.intensity = 1.0;
          } else {
            puncture.intensity = +(clamp(puncture.ttlSec / 2.0, 0, 1)).toFixed(4);
          }
        }
      },
      renderHabitVeil: function (ctx, width, height, env) {
        var w = Number(width) || viewW;
        var h = Number(height) || viewH;
        if (!ctx || w <= 0 || h <= 0) return;
        if (bleachFactor <= 0.01 && !puncture.active) return;

        if (bleachFactor > 0.01) {
          var zigVis = Math.min(1, bleachFactor * 1.15);
          ctx.save();
          if (puncture.active && puncture.intensity > 0) {
            applyEvenOddPuncturePath(ctx, w, h, puncture);
            if (typeof ctx.clip === 'function') ctx.clip('evenodd');
          }
          drawBlankArchitectureAndFolio(ctx, w, h, bleachFactor, puncture);
          drawScanningEyes(ctx, w, h, bleachFactor, eyeScanPhase);
          drawSunlightPatches(ctx, w, h, zigVis);
          drawSparseRemnants(ctx, w, h, zigVis);
          drawZigzagObligations(ctx, w, h, zigVis, footsteps, currentObligationIndex, marchPhase, bleachFactor);
          ctx.restore();
        }
        if (puncture.active && puncture.intensity > 0) {
          drawPunctureHalo(ctx, w, h, puncture);
        }
      },
      getState: getState,
      reset: function () {
        residenceDays = 1;
        errandsTrudged = 0;
        bleachFactor = 0.0;
        currentObligationIndex = 0;
        unexpectedInstantsCount = 0;
        footsteps = [];
        marchPhase = 0;
        eyeScanPhase = 0;
        puncture = {
          active: false, wonderId: null, label: '',
          normX: 0.83, normY: 0.43, radiusNorm: 0.13,
          intensity: 0, ttlSec: 0, epigraph: ''
        };
        notifyBleach();
        return getState();
      }
    };
  }

  var API = {
    PALETTE: PALETTE,
    OBLIGATION_NODES: OBLIGATION_NODES,
    SPARSE_REMNANTS: SPARSE_REMNANTS,
    SUNLIGHT_PATCHES: SUNLIGHT_PATCHES,
    PUNCTURE_TARGETS: PUNCTURE_TARGETS,
    createHabitBleacher: createHabitBleacher
  };

  globalThis.PhyllisHabitualErasure = API;
  if (typeof window !== 'undefined') window.PhyllisHabitualErasure = API;
})();
