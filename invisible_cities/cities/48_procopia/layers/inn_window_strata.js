(function (root) {
  "use strict";

  var STRATA_DEFS = Object.freeze([
    Object.freeze({ id: "ditch", index: 0, label: "Ditch", phrase: "a ditch" }),
    Object.freeze({ id: "bridge", index: 1, label: "Bridge", phrase: "a bridge" }),
    Object.freeze({ id: "little_wall", index: 2, label: "Little Wall", phrase: "a little wall" }),
    Object.freeze({ id: "medlar_tree", index: 3, label: "Medlar Tree", phrase: "a medlar tree" }),
    Object.freeze({ id: "cornfield", index: 4, label: "Field of Corn", phrase: "a field of corn" }),
    Object.freeze({ id: "blackberry_bushes", index: 5, label: "Blackberry Bushes", phrase: "blackberry bushes with thorns" }),
    Object.freeze({ id: "chicken_yard", index: 6, label: "Chicken Yard", phrase: "a chicken yard" }),
    Object.freeze({ id: "yellow_hill", index: 7, label: "Yellow Hill Hump", phrase: "the yellow hump of a hill" }),
    Object.freeze({ id: "trapeze_sky", index: 8, label: "Upside-Down Trapeze Sky", phrase: "a patch of sky shaped like an upside-down trapeze" })
  ]);

  var BAND_SPECS = [
    { id: "ditch", index: 0, y0: 0.86, y1: 1.00, x0: 0.00, x1: 1.00 },
    { id: "bridge", index: 1, y0: 0.77, y1: 0.90, x0: 0.12, x1: 0.88 },
    { id: "little_wall", index: 2, y0: 0.69, y1: 0.81, x0: 0.00, x1: 1.00 },
    { id: "medlar_tree", index: 3, y0: 0.57, y1: 0.73, x0: 0.04, x1: 0.92 },
    { id: "cornfield", index: 4, y0: 0.48, y1: 0.63, x0: 0.00, x1: 1.00 },
    { id: "blackberry_bushes", index: 5, y0: 0.39, y1: 0.52, x0: 0.02, x1: 0.98 },
    { id: "chicken_yard", index: 6, y0: 0.30, y1: 0.43, x0: 0.06, x1: 0.94 },
    { id: "yellow_hill", index: 7, y0: 0.13, y1: 0.34, x0: 0.00, x1: 1.00 },
    { id: "trapeze_sky", index: 8, y0: 0.00, y1: 0.205, x0: 0.00, x1: 1.00 }
  ];

  function clamp(v, lo, hi) {
    var n = Number(v);
    if (!Number.isFinite(n)) return lo;
    return n < lo ? lo : (n > hi ? hi : n);
  }

  function hash01(seed) {
    var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function makeRect(x, y, w, h) {
    var rx = Math.round(x);
    var ry = Math.round(y);
    var rw = Math.max(8, Math.round(w));
    var rh = Math.max(8, Math.round(h));
    return {
      x: rx,
      y: ry,
      w: rw,
      h: rh,
      xMin: rx,
      xMax: rx + rw,
      yMin: ry,
      yMax: ry + rh,
      centerX: rx + rw * 0.5,
      centerY: ry + rh * 0.5
    };
  }

  function computeLayout(width, height) {
    var W = Math.max(180, Math.round(Number(width) || 720));
    var H = Math.max(180, Math.round(Number(height) || 520));
    var padX = Math.round(clamp(W * 0.075, 16, 62));
    var padTop = Math.round(clamp(H * 0.08, 18, 48));
    var padBot = Math.round(clamp(H * 0.088, 20, 56));

    var cx = padX;
    var cy = padTop;
    var cw = Math.max(120, W - padX * 2);
    var ch = Math.max(120, H - padTop - padBot);

    var frameW = Math.round(clamp(Math.min(W, H) * 0.036, 11, 26));
    var sillH = Math.round(clamp(H * 0.04, 12, 26));

    var ax = cx + frameW;
    var ay = cy + frameW;
    var aw = Math.max(80, cw - frameW * 2);
    var ah = Math.max(80, ch - frameW - sillH);
    var sillY = ay + ah;

    var casement = {
      x: cx,
      y: cy,
      w: cw,
      h: ch,
      sillY: sillY,
      sillH: sillH,
      frameW: frameW,
      rodY: Math.round(cy + frameW * 0.46)
    };

    var aperture = {
      x: ax,
      y: ay,
      w: aw,
      h: ah,
      xMin: ax,
      xMax: ax + aw,
      yMin: ay,
      yMax: ay + ah,
      centerX: ax + aw * 0.5,
      centerY: ay + ah * 0.5
    };

    var skyBottomY = Math.round(ay + ah * 0.205);
    var insetX = Math.round(aw * 0.21);
    var trapezeSkyPoly = [
      { x: ax, y: ay },
      { x: ax + aw, y: ay },
      { x: ax + aw - insetX, y: skyBottomY },
      { x: ax + insetX, y: skyBottomY }
    ];

    var strataBands = {};
    for (var i = 0; i < BAND_SPECS.length; i++) {
      var s = BAND_SPECS[i];
      var def = STRATA_DEFS[s.index];
      var yMin = Math.round(ay + ah * s.y0);
      var yMax = Math.round(ay + ah * s.y1);
      var xMin = Math.round(ax + aw * s.x0);
      var xMax = Math.round(ax + aw * s.x1);
      strataBands[s.id] = {
        id: s.id,
        index: s.index,
        label: def.label,
        phrase: def.phrase,
        yMin: yMin,
        yMax: yMax,
        centerY: (yMin + yMax) * 0.5,
        xMin: xMin,
        xMax: xMax,
        w: Math.max(8, xMax - xMin),
        h: Math.max(8, yMax - yMin)
      };
    }

    var winW = Math.round(clamp(W * 0.26, 84, 240));
    var winH = Math.round(clamp(H * 0.31, 76, 210));
    var roomZones = {
      windowBackRect: makeRect((W - winW) * 0.5, H * 0.11, winW, winH),
      chestRect: makeRect(W * 0.055, H * 0.36, W * 0.275, H * 0.33),
      bedRect: makeRect(W * 0.65, H * 0.35, W * 0.295, H * 0.36),
      floorRect: makeRect(W * 0.14, H * 0.58, W * 0.72, H * 0.35)
    };

    return {
      casement: casement,
      aperture: aperture,
      trapezeSkyPoly: trapezeSkyPoly,
      strataBands: strataBands,
      roomZones: roomZones
    };
  }

  function computeVisibilityReport(occlusionByStratum, curtainLift) {
    var occMap = occlusionByStratum || {};
    var lift = (curtainLift === undefined || curtainLift === null) ? 1 : clamp(curtainLift, 0, 1);
    var strata = [];
    var byId = {};
    var visibleCount = 0;
    var effectiveCount = 0;

    for (var i = 0; i < STRATA_DEFS.length; i++) {
      var def = STRATA_DEFS[i];
      var occ = clamp(occMap[def.id] || 0, 0, 1);
      var rawVis = clamp(1 - occ, 0, 1);
      var effVis = clamp(rawVis * lift, 0, 1);
      var isVis = rawVis > 0.05;
      var isEffVis = effVis > 0.05;
      if (isVis) visibleCount += 1;
      if (isEffVis) effectiveCount += 1;
      var item = {
        id: def.id,
        index: def.index,
        label: def.label,
        phrase: def.phrase,
        occlusion: occ,
        visibility: rawVis,
        rawVisibility: rawVis,
        effectiveVisibility: effVis,
        visibilityPct: Math.round(rawVis * 100),
        effectivePct: Math.round(effVis * 100),
        visible: isVis,
        effectivelyVisible: isEffVis,
        status: isVis ? "VISIBLE" : "OCCLUDED"
      };
      strata.push(item);
      byId[def.id] = item;
    }

    return {
      strata: strata,
      strataTopDown: strata.slice().reverse(),
      byId: byId,
      curtainLift: lift,
      visibleStrataCount: visibleCount,
      effectiveVisibleStrataCount: effectiveCount,
      ditchVisible: byId.ditch.visible,
      bridgeVisible: byId.bridge.visible,
      wallVisible: byId.little_wall.visible,
      medlarVisible: byId.medlar_tree.visible,
      cornfieldVisible: byId.cornfield.visible,
      blackberryVisible: byId.blackberry_bushes.visible,
      chickenYardVisible: byId.chicken_yard.visible,
      hillVisible: byId.yellow_hill.visible,
      skyVisible: byId.trapeze_sky.visible,
      horizonFaceWall: visibleCount === 0
    };
  }

  function paintPlasterAndCasement(ctx, W, H, layout) {
    var c = layout.casement;
    var a = layout.aperture;
    var wallGrad = ctx.createRadialGradient(W * 0.5, H * 0.44, Math.min(W, H) * 0.14, W * 0.5, H * 0.5, Math.max(W, H) * 0.78);
    wallGrad.addColorStop(0, "#e5d9c3");
    wallGrad.addColorStop(0.65, "#d3c2a6");
    wallGrad.addColorStop(1, "#b8a384");
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, W, H);

    for (var m = 0; m < 34; m++) {
      var mx = hash01(m * 3.17) * W;
      var my = hash01(m * 7.91 + 2.3) * H;
      var mr = 18 + hash01(m * 5.13) * 54;
      ctx.fillStyle = (m % 2 === 0) ? "rgba(250,242,226,0.13)" : "rgba(138,112,82,0.08)";
      ctx.beginPath();
      ctx.arc(mx, my, mr, 0, Math.PI * 2);
      ctx.fill();
    }

    var beamH = Math.max(8, Math.round(c.y * 0.38));
    var beamGrad = ctx.createLinearGradient(0, 0, 0, beamH);
    beamGrad.addColorStop(0, "#2f1d11");
    beamGrad.addColorStop(1, "#4a301e");
    ctx.fillStyle = beamGrad;
    ctx.fillRect(0, 0, W, beamH);
    ctx.fillStyle = "rgba(20,10,4,0.28)";
    ctx.fillRect(0, beamH, W, 4);

    ctx.fillStyle = "rgba(42,25,13,0.34)";
    ctx.fillRect(c.x - 5, c.y - 3, c.w + 10, c.h + 12);

    var woodGrad = ctx.createLinearGradient(c.x, c.y, c.x + c.w, c.y + c.h);
    woodGrad.addColorStop(0, "#5c3b24");
    woodGrad.addColorStop(0.5, "#472c1a");
    woodGrad.addColorStop(1, "#382112");
    ctx.fillStyle = woodGrad;
    ctx.fillRect(c.x, c.y, c.w, c.h);

    ctx.strokeStyle = "rgba(24,13,6,0.36)";
    ctx.lineWidth = 1;
    for (var g = 0; g < 18; g++) {
      var gx = c.x + (g / 18) * c.w;
      ctx.beginPath();
      ctx.moveTo(gx, c.y);
      ctx.lineTo(gx + ((g % 3) - 1) * 3, c.y + c.h);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(225,186,138,0.28)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(c.x + 1.5, c.y + 1.5, c.w - 3, c.h - 3);
    ctx.strokeStyle = "#24140a";
    ctx.strokeRect(a.x - 1, a.y - 1, a.w + 2, a.h + 2);

    var sillOut = Math.round(c.frameW * 0.55);
    var sx = c.x - sillOut;
    var sw = c.w + sillOut * 2;
    var sillGrad = ctx.createLinearGradient(0, c.sillY, 0, c.sillY + c.sillH);
    sillGrad.addColorStop(0, "#d8ccb6");
    sillGrad.addColorStop(0.32, "#bfb097");
    sillGrad.addColorStop(1, "#8d7d66");
    ctx.fillStyle = sillGrad;
    ctx.fillRect(sx, c.sillY, sw, c.sillH);
    ctx.fillStyle = "rgba(255,248,232,0.45)";
    ctx.fillRect(sx, c.sillY, sw, 3);
    ctx.fillStyle = "rgba(38,24,12,0.30)";
    ctx.fillRect(sx + 4, c.sillY + c.sillH, sw - 8, 8);
  }

  function paintUpperStrata(ctx, layout, t) {
    var a = layout.aperture;
    var poly = layout.trapezeSkyPoly;
    var skyBand = layout.strataBands.trapeze_sky;
    var hillBand = layout.strataBands.yellow_hill;
    var yardBand = layout.strataBands.chicken_yard;

    var skyGrad = ctx.createLinearGradient(0, a.y, 0, hillBand.yMax);
    skyGrad.addColorStop(0, "#6ba3bc");
    skyGrad.addColorStop(0.55, "#9ec4c9");
    skyGrad.addColorStop(1, "#e7dfb4");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(a.x, a.y, a.w, hillBand.yMax - a.y + 8);

    ctx.fillStyle = "rgba(252,248,234,0.38)";
    for (var w = 0; w < 4; w++) {
      var drift = Math.sin(t * 0.18 + w * 1.7) * (a.w * 0.015);
      var wx = poly[3].x + (w + 0.6) * ((poly[2].x - poly[3].x) / 4.2) + drift;
      var wy = a.y + (skyBand.h * (0.26 + (w % 2) * 0.24));
      ctx.beginPath();
      ctx.ellipse(wx, wy, a.w * 0.075, skyBand.h * 0.09, -0.06, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#9d7438";
    ctx.beginPath();
    ctx.moveTo(poly[0].x, poly[0].y);
    ctx.lineTo(poly[3].x, poly[3].y);
    ctx.lineTo(a.x, hillBand.yMax);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(poly[1].x, poly[1].y);
    ctx.lineTo(poly[2].x, poly[2].y);
    ctx.lineTo(a.x + a.w, hillBand.yMax);
    ctx.closePath();
    ctx.fill();

    var hillGrad = ctx.createLinearGradient(0, hillBand.yMin, 0, hillBand.yMax + 14);
    hillGrad.addColorStop(0, "#f0c351");
    hillGrad.addColorStop(0.52, "#dca032");
    hillGrad.addColorStop(1, "#b57923");
    ctx.fillStyle = hillGrad;
    ctx.beginPath();
    ctx.moveTo(a.x, hillBand.yMax + 12);
    ctx.quadraticCurveTo(a.x + a.w * 0.22, hillBand.yMin + hillBand.h * 0.36, a.x + a.w * 0.50, hillBand.yMin + 2);
    ctx.quadraticCurveTo(a.x + a.w * 0.78, hillBand.yMin + hillBand.h * 0.34, a.x + a.w, hillBand.yMax + 12);
    ctx.lineTo(a.x + a.w, yardBand.yMax);
    ctx.lineTo(a.x, yardBand.yMax);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,238,176,0.42)";
    ctx.lineWidth = 1.6;
    for (var r = 0; r < 3; r++) {
      var ry = hillBand.yMin + hillBand.h * (0.34 + r * 0.22);
      ctx.beginPath();
      ctx.moveTo(a.x + a.w * 0.14, ry + 8);
      ctx.quadraticCurveTo(a.x + a.w * 0.5, ry - hillBand.h * 0.22, a.x + a.w * 0.86, ry + 8);
      ctx.stroke();
    }
  }

  function paintMidStrata(ctx, layout, t) {
    var a = layout.aperture;
    var yard = layout.strataBands.chicken_yard;
    var bush = layout.strataBands.blackberry_bushes;
    var corn = layout.strataBands.cornfield;
    var medlar = layout.strataBands.medlar_tree;

    var yardGrad = ctx.createLinearGradient(0, yard.yMin, 0, bush.yMax);
    yardGrad.addColorStop(0, "#dfb978");
    yardGrad.addColorStop(1, "#c09352");
    ctx.fillStyle = yardGrad;
    ctx.fillRect(a.x, yard.yMin, a.w, bush.yMax - yard.yMin);

    ctx.strokeStyle = "#6e4c29";
    ctx.lineWidth = 1.6;
    var fenceY = yard.yMin + yard.h * 0.22;
    ctx.beginPath();
    ctx.moveTo(yard.xMin, fenceY);
    ctx.lineTo(yard.xMax, fenceY + 2);
    ctx.moveTo(yard.xMin, fenceY + yard.h * 0.22);
    ctx.lineTo(yard.xMax, fenceY + yard.h * 0.22 + 2);
    ctx.stroke();
    for (var p = 0; p <= 22; p++) {
      var px = yard.xMin + (p / 22) * (yard.xMax - yard.xMin);
      ctx.beginPath();
      ctx.moveTo(px, fenceY - 5);
      ctx.lineTo(px, fenceY + yard.h * 0.36);
      ctx.stroke();
    }

    var coopW = Math.max(26, a.w * 0.11);
    var coopH = Math.max(18, yard.h * 0.62);
    var coopX = yard.xMax - coopW - a.w * 0.03;
    var coopY = yard.yMin + yard.h * 0.12;
    ctx.fillStyle = "#7c5533";
    ctx.fillRect(coopX, coopY, coopW, coopH);
    ctx.fillStyle = "#331e10";
    ctx.fillRect(coopX + coopW * 0.36, coopY + coopH * 0.38, coopW * 0.28, coopH * 0.62);
    ctx.fillStyle = "#b55232";
    ctx.beginPath();
    ctx.moveTo(coopX - 5, coopY + 2);
    ctx.lineTo(coopX + coopW * 0.5, coopY - coopH * 0.42);
    ctx.lineTo(coopX + coopW + 5, coopY + 2);
    ctx.closePath();
    ctx.fill();

    var henColors = ["#f3ead8", "#b55b33", "#d8a45c", "#efe4ce", "#8f4326", "#cfa063", "#f0e6d2"];
    for (var hIdx = 0; hIdx < 7; hIdx++) {
      var hx = yard.xMin + yard.w * (0.09 + hIdx * 0.105);
      var hy = yard.yMin + yard.h * (0.58 + (hIdx % 3) * 0.13);
      var peck = (hIdx % 2 === 0) ? Math.abs(Math.sin(t * 2.4 + hIdx)) * 3.2 : 0;
      var dir = (hIdx % 2 === 0) ? 1 : -1;
      ctx.fillStyle = henColors[hIdx];
      ctx.beginPath();
      ctx.ellipse(hx, hy, 6.5, 4.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hx + dir * 5.2, hy - 2.6 + peck, 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#c9302c";
      ctx.beginPath();
      ctx.arc(hx + dir * 5.4, hy - 5.2 + peck, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var b = 0; b < 15; b++) {
      var bx = bush.xMin + (b / 14) * bush.w;
      var by = bush.yMin + bush.h * (0.48 + (b % 2) * 0.16);
      var br = Math.max(12, a.w * 0.048);
      ctx.fillStyle = (b % 2 === 0) ? "#2f4a26" : "#3d592e";
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "#5b2830";
    ctx.lineWidth = 2;
    for (var cIdx = 0; cIdx < 9; cIdx++) {
      var cx0 = bush.xMin + (cIdx / 8.5) * bush.w;
      var cy0 = bush.yMax;
      var cx1 = cx0 + (cIdx % 2 === 0 ? 28 : -26);
      var cy1 = bush.yMin + 4;
      ctx.beginPath();
      ctx.moveTo(cx0, cy0);
      ctx.quadraticCurveTo((cx0 + cx1) * 0.5, cy1 - 8, cx1, cy1 + 8);
      ctx.stroke();
      ctx.fillStyle = "#d9c29c";
      for (var th = 1; th <= 3; th++) {
        var u = th * 0.25;
        var tx = cx0 + (cx1 - cx0) * u;
        var ty = cy0 + (cy1 - cy0) * u - 4;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx + 3.5, ty - 4.5);
        ctx.lineTo(tx + 1.2, ty + 1.5);
        ctx.closePath();
        ctx.fill();
      }
    }

    for (var k = 0; k < 18; k++) {
      var kx = bush.xMin + hash01(k * 4.7 + 1.1) * bush.w;
      var ky = bush.yMin + bush.h * (0.25 + hash01(k * 9.3) * 0.58);
      ctx.fillStyle = (k % 3 === 0) ? "#3b1730" : "#1d1424";
      ctx.beginPath();
      ctx.arc(kx, ky, 3.2, 0, Math.PI * 2);
      ctx.arc(kx + 2.4, ky + 1.4, 2.7, 0, Math.PI * 2);
      ctx.arc(kx - 2.0, ky + 1.8, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(235,220,245,0.45)";
      ctx.fillRect(kx - 1, ky - 1.5, 1.4, 1.4);
    }

    var cornGrad = ctx.createLinearGradient(0, corn.yMin, 0, medlar.yMax);
    cornGrad.addColorStop(0, "#b88428");
    cornGrad.addColorStop(0.6, "#8c6b28");
    cornGrad.addColorStop(1, "#616b30");
    ctx.fillStyle = cornGrad;
    ctx.fillRect(a.x, corn.yMin + corn.h * 0.18, a.w, medlar.yMax - corn.yMin);

    var stalkCount = 30;
    for (var sIdx = 0; sIdx < stalkCount; sIdx++) {
      var sx = a.x + ((sIdx + 0.5) / stalkCount) * a.w;
      var sway = Math.sin(t * 1.3 + sIdx * 0.65) * 3.2;
      var topY = corn.yMin - 4 + (sIdx % 3) * 5;
      var botY = corn.yMax + 8;
      ctx.strokeStyle = (sIdx % 2 === 0) ? "#e0b144" : "#c9962e";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(sx, botY);
      ctx.quadraticCurveTo(sx + sway * 0.5, (topY + botY) * 0.5, sx + sway, topY);
      ctx.stroke();

      ctx.strokeStyle = "#f2d57e";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(sx + sway, topY);
      ctx.lineTo(sx + sway - 4, topY - 6);
      ctx.moveTo(sx + sway, topY);
      ctx.lineTo(sx + sway + 4, topY - 6);
      ctx.stroke();

      if (sIdx % 2 === 0) {
        var earY = topY + (botY - topY) * 0.46;
        ctx.fillStyle = "#f6c945";
        ctx.beginPath();
        ctx.ellipse(sx + sway * 0.5 + 3, earY, 2.8, 6.4, 0.28, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function paintForeStrata(ctx, layout, t) {
    var a = layout.aperture;
    var medlar = layout.strataBands.medlar_tree;
    var wall = layout.strataBands.little_wall;
    var bridge = layout.strataBands.bridge;
    var ditch = layout.strataBands.ditch;

    var trunkX = a.x + a.w * 0.27;
    var trunkBaseY = wall.yMin + 6;
    var crownY = medlar.yMin + medlar.h * 0.22;
    ctx.strokeStyle = "#4d321f";
    ctx.lineWidth = Math.max(6, a.w * 0.018);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trunkX, trunkBaseY);
    ctx.quadraticCurveTo(trunkX - 8, (trunkBaseY + crownY) * 0.5, trunkX + 4, crownY + 8);
    ctx.stroke();

    ctx.lineWidth = Math.max(3.5, a.w * 0.01);
    var limbs = [-0.14, -0.05, 0.06, 0.16];
    for (var l = 0; l < limbs.length; l++) {
      ctx.beginPath();
      ctx.moveTo(trunkX + 2, crownY + 14);
      ctx.quadraticCurveTo(trunkX + a.w * limbs[l] * 0.6, crownY - 6, trunkX + a.w * limbs[l], crownY + (l % 2) * 8);
      ctx.stroke();
    }

    var leafBlobs = [
      [-0.15, 0.06, 0.065], [-0.08, -0.04, 0.075], [0.0, -0.06, 0.082],
      [0.09, -0.02, 0.074], [0.16, 0.06, 0.064], [-0.04, 0.08, 0.068],
      [0.48, 0.04, 0.062], [0.55, -0.02, 0.068]
    ];
    for (var lb = 0; lb < leafBlobs.length; lb++) {
      var lx = trunkX + a.w * leafBlobs[lb][0];
      var ly = crownY + medlar.h * leafBlobs[lb][1] * 2.2;
      var lr = Math.max(14, a.w * leafBlobs[lb][2]);
      ctx.fillStyle = (lb % 2 === 0) ? "#4d612c" : "#6b6e2e";
      ctx.beginPath();
      ctx.arc(lx, ly, lr, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var mf = 0; mf < 16; mf++) {
      var mfx = (mf < 12)
        ? trunkX + (hash01(mf * 6.1) - 0.46) * a.w * 0.34
        : trunkX + a.w * (0.45 + hash01(mf * 3.7) * 0.13);
      var mfy = crownY - 8 + hash01(mf * 8.3 + 1.4) * medlar.h * 0.56;
      ctx.fillStyle = "#b96e32";
      ctx.beginPath();
      ctx.arc(mfx, mfy, 4.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4b2b14";
      ctx.fillRect(mfx - 1.2, mfy + 1.6, 2.4, 1.8);
    }

    ctx.fillStyle = "#56493d";
    ctx.fillRect(a.x, wall.yMin, a.w, wall.h);
    var rows = 4;
    var rowH = wall.h / rows;
    var stonePalette = ["#b8ab96", "#9f927d", "#c7b89e", "#8c806e"];
    for (var wr = 0; wr < rows; wr++) {
      var wy = wall.yMin + wr * rowH;
      var cols = 14;
      var colW = a.w / cols;
      var offset = (wr % 2) * (colW * 0.5);
      for (var wc = -1; wc <= cols; wc++) {
        var wx = a.x + wc * colW + offset;
        ctx.fillStyle = stonePalette[(wr * 5 + wc + 4) % stonePalette.length];
        ctx.fillRect(wx + 1, wy + 1, colW - 2, rowH - 2);
      }
    }
    ctx.fillStyle = "#d2c5ae";
    ctx.fillRect(a.x, wall.yMin, a.w, 3.5);

    var bankGrad = ctx.createLinearGradient(0, wall.yMax - 2, 0, a.y + a.h);
    bankGrad.addColorStop(0, "#6d5a38");
    bankGrad.addColorStop(0.55, "#4d3c24");
    bankGrad.addColorStop(1, "#352918");
    ctx.fillStyle = bankGrad;
    ctx.fillRect(a.x, wall.yMax - 2, a.w, a.y + a.h - wall.yMax + 4);

    ctx.fillStyle = "#3f5954";
    ctx.beginPath();
    ctx.moveTo(a.x, ditch.yMin + ditch.h * 0.35);
    ctx.quadraticCurveTo(a.x + a.w * 0.5, ditch.yMin + ditch.h * 0.12, a.x + a.w, ditch.yMin + ditch.h * 0.38);
    ctx.lineTo(a.x + a.w, a.y + a.h);
    ctx.lineTo(a.x, a.y + a.h);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(212,230,224,0.34)";
    ctx.lineWidth = 1.5;
    for (var rp = 0; rp < 5; rp++) {
      var rpx = a.x + a.w * (0.14 + rp * 0.18) + Math.sin(t * 1.1 + rp) * 3;
      var rpy = ditch.yMin + ditch.h * (0.52 + (rp % 2) * 0.18);
      ctx.beginPath();
      ctx.moveTo(rpx - 14, rpy);
      ctx.lineTo(rpx + 14, rpy);
      ctx.stroke();
    }

    var bx0 = a.x + a.w * 0.28;
    var bw = a.w * 0.44;
    var by0 = bridge.yMin + 2;
    var bh = bridge.h + 4;
    ctx.fillStyle = "#a89880";
    ctx.beginPath();
    ctx.moveTo(bx0, by0 + bh);
    ctx.lineTo(bx0 + bw * 0.08, by0 + bh * 0.24);
    ctx.quadraticCurveTo(bx0 + bw * 0.5, by0 - bh * 0.18, bx0 + bw * 0.92, by0 + bh * 0.24);
    ctx.lineTo(bx0 + bw, by0 + bh);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#232e2b";
    ctx.beginPath();
    ctx.arc(bx0 + bw * 0.5, by0 + bh, bw * 0.27, Math.PI, 0, false);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#5c3d24";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(bx0 + bw * 0.06, by0 + bh * 0.16);
    ctx.quadraticCurveTo(bx0 + bw * 0.5, by0 - bh * 0.26, bx0 + bw * 0.94, by0 + bh * 0.16);
    ctx.stroke();

    for (var rd = 0; rd < 22; rd++) {
      var rx = a.x + (rd / 21) * a.w;
      if (rx > bx0 + bw * 0.18 && rx < bx0 + bw * 0.82) continue;
      var rSway = Math.sin(t * 1.5 + rd) * 2.2;
      var ryBase = a.y + a.h;
      var ryTop = ditch.yMin - 4 + (rd % 3) * 5;
      ctx.strokeStyle = (rd % 2 === 0) ? "#9c8845" : "#6d7438";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(rx, ryBase);
      ctx.quadraticCurveTo(rx + rSway * 0.5, (ryBase + ryTop) * 0.5, rx + rSway, ryTop);
      ctx.stroke();
      if (rd % 4 === 0) {
        ctx.strokeStyle = "#4b2c18";
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(rx + rSway * 0.8, ryTop + 8);
        ctx.lineTo(rx + rSway, ryTop + 1);
        ctx.stroke();
      }
    }
  }

  function renderWindowBackdrop(ctx, width, height, state) {
    if (!ctx) return null;
    var st = state || {};
    var layout = st.layout || computeLayout(width, height);
    var t = st.reducedMotion ? 0 : (Number(st.time) || 0);

    ctx.save();
    paintPlasterAndCasement(ctx, Math.max(180, Number(width) || 720), Math.max(180, Number(height) || 520), layout);
    ctx.beginPath();
    ctx.rect(layout.aperture.x, layout.aperture.y, layout.aperture.w, layout.aperture.h);
    ctx.clip();
    paintUpperStrata(ctx, layout, t);
    paintMidStrata(ctx, layout, t);
    paintForeStrata(ctx, layout, t);
    ctx.restore();

    return layout;
  }

  function renderWindowForegroundSashAndCurtain(ctx, width, height, state) {
    if (!ctx) return null;
    var st = state || {};
    var layout = st.layout || computeLayout(width, height);
    var c = layout.casement;
    var a = layout.aperture;
    var lift = (st.curtainLift === undefined || st.curtainLift === null) ? 1 : clamp(st.curtainLift, 0, 1);
    var closed = 1 - lift;

    ctx.save();

    ctx.strokeStyle = "rgba(24,14,7,0.44)";
    ctx.lineWidth = 3;
    ctx.strokeRect(a.x + 1.5, a.y + 1.5, a.w - 3, a.h - 3);

    var latchX = a.x + a.w + c.frameW * 0.48;
    var latchY = a.y + a.h * 0.5;
    ctx.fillStyle = "#26221e";
    ctx.fillRect(latchX - 3, latchY - 14, 6, 28);
    ctx.fillStyle = "#9c7b45";
    ctx.beginPath();
    ctx.arc(latchX, latchY, 3.5, 0, Math.PI * 2);
    ctx.fill();

    var rodX0 = c.x + 4;
    var rodX1 = c.x + c.w - 4;
    var rodY = c.rodY;
    ctx.strokeStyle = "#8d6d3b";
    ctx.lineWidth = 3.6;
    ctx.beginPath();
    ctx.moveTo(rodX0, rodY);
    ctx.lineTo(rodX1, rodY);
    ctx.stroke();

    ctx.fillStyle = "#b59154";
    ctx.beginPath();
    ctx.arc(rodX0, rodY, 4.8, 0, Math.PI * 2);
    ctx.arc(rodX1, rodY, 4.8, 0, Math.PI * 2);
    ctx.fill();

    var gatheredW = Math.max(10, c.frameW * 0.92);
    var activeSpanW = gatheredW + closed * (a.w + c.frameW * 0.35);
    var dropH = a.h + c.frameW * 0.55;

    ctx.save();
    ctx.beginPath();
    ctx.rect(c.x + 2, rodY, c.w - 4, c.sillY - rodY + 4);
    ctx.clip();

    if (closed < 0.02) {
      var gx = c.x + 3;
      var gw = Math.max(9, a.x - gx - 1);
      var tieY = a.y + a.h * 0.54;
      var gGrad = ctx.createLinearGradient(gx, 0, gx + gw, 0);
      gGrad.addColorStop(0, "#cbb898");
      gGrad.addColorStop(0.55, "#e7dbc3");
      gGrad.addColorStop(1, "#b49e7c");
      ctx.fillStyle = gGrad;
      ctx.beginPath();
      ctx.moveTo(gx, rodY + 2);
      ctx.lineTo(gx + gw + 2, rodY + 2);
      ctx.quadraticCurveTo(gx + gw * 0.72, tieY, gx + gw, c.sillY - 4);
      ctx.lineTo(gx, c.sillY - 4);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#8a6735";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(gx - 1, tieY);
      ctx.lineTo(gx + gw + 1, tieY + 2);
      ctx.stroke();
    } else {
      var folds = 14;
      var foldW = activeSpanW / folds;
      var curX0 = c.x + 4;
      var bottomEdgeY = rodY + 12 + dropH * (0.22 + 0.78 * closed);

      for (var f = 0; f < folds; f++) {
        var fx = curX0 + f * foldW;
        var sag = (f % 2 === 0) ? 4 : -2;
        var fGrad = ctx.createLinearGradient(fx, 0, fx + foldW, 0);
        fGrad.addColorStop(0, "#c8b594");
        fGrad.addColorStop(0.45, "#ece1cb");
        fGrad.addColorStop(1, "#b7a17e");
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.moveTo(fx, rodY + 2);
        ctx.lineTo(fx + foldW + 0.8, rodY + 2);
        ctx.lineTo(fx + foldW + 0.8, bottomEdgeY + sag);
        ctx.lineTo(fx, bottomEdgeY - sag * 0.5);
        ctx.closePath();
        ctx.fill();
      }

      var glowGrad = ctx.createRadialGradient(a.centerX, a.centerY, 12, a.centerX, a.centerY, a.w * 0.55);
      glowGrad.addColorStop(0, "rgba(255,238,195,0.22)");
      glowGrad.addColorStop(1, "rgba(180,152,110,0.0)");
      ctx.fillStyle = glowGrad;
      ctx.fillRect(curX0, rodY + 4, activeSpanW, bottomEdgeY - rodY);

      ctx.strokeStyle = "rgba(138,114,82,0.22)";
      ctx.lineWidth = 1;
      for (var sl = 1; sl < 16; sl++) {
        var sly = rodY + (sl / 16) * (bottomEdgeY - rodY);
        ctx.beginPath();
        ctx.moveTo(curX0, sly);
        ctx.lineTo(curX0 + activeSpanW, sly);
        ctx.stroke();
      }

      ctx.strokeStyle = "#9d8562";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(curX0, bottomEdgeY - 5);
      ctx.lineTo(curX0 + activeSpanW, bottomEdgeY - 5);
      ctx.stroke();
    }
    ctx.restore();

    var ringCount = 11;
    var ringSpan = (closed < 0.02) ? Math.max(12, a.x - rodX0) : activeSpanW;
    ctx.strokeStyle = "#c29c59";
    ctx.lineWidth = 1.8;
    for (var rIdx = 0; rIdx < ringCount; rIdx++) {
      var rx = rodX0 + 5 + (rIdx / (ringCount - 1)) * Math.max(8, ringSpan - 8);
      ctx.beginPath();
      ctx.arc(rx, rodY, 3.6, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
    return layout;
  }

  function renderRoomBackdrop(ctx, width, height, state) {
    if (!ctx) return null;
    var W = Math.max(180, Math.round(Number(width) || 720));
    var H = Math.max(180, Math.round(Number(height) || 520));
    var st = state || {};
    var layout = st.layout || computeLayout(W, H);
    var rz = layout.roomZones;
    var wallL = Math.round(W * 0.13);
    var wallR = Math.round(W * 0.87);
    var ceilY = Math.round(H * 0.085);
    var floorTopY = Math.round(H * 0.56);

    ctx.save();

    ctx.fillStyle = "#cfc0a5";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#dfd2ba";
    ctx.fillRect(wallL, ceilY, wallR - wallL, floorTopY - ceilY);

    ctx.fillStyle = "#c4b396";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(wallL, ceilY);
    ctx.lineTo(wallL, floorTopY);
    ctx.lineTo(0, Math.round(H * 0.74));
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#bfae90";
    ctx.beginPath();
    ctx.moveTo(W, 0);
    ctx.lineTo(wallR, ceilY);
    ctx.lineTo(wallR, floorTopY);
    ctx.lineTo(W, Math.round(H * 0.74));
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#432b1a";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(W, 0);
    ctx.lineTo(wallR, ceilY);
    ctx.lineTo(wallL, ceilY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#2b190d";
    ctx.lineWidth = Math.max(4, W * 0.008);
    for (var jb = 0; jb <= 6; jb++) {
      var u = jb / 6;
      ctx.beginPath();
      ctx.moveTo(u * W, 0);
      ctx.lineTo(wallL + u * (wallR - wallL), ceilY);
      ctx.stroke();
    }

    var floorGrad = ctx.createLinearGradient(0, floorTopY, 0, H);
    floorGrad.addColorStop(0, "#855b38");
    floorGrad.addColorStop(0.5, "#6f492a");
    floorGrad.addColorStop(1, "#55361d");
    ctx.fillStyle = floorGrad;
    ctx.beginPath();
    ctx.moveTo(wallL, floorTopY);
    ctx.lineTo(wallR, floorTopY);
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(34,19,9,0.42)";
    ctx.lineWidth = 1.3;
    for (var pl = 0; pl <= 12; pl++) {
      var pf = pl / 12;
      ctx.beginPath();
      ctx.moveTo(wallL + pf * (wallR - wallL), floorTopY);
      ctx.lineTo(-W * 0.08 + pf * (W * 1.16), H);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(38,21,10,0.55)";
    for (var pg = 0; pg < 18; pg++) {
      var px = rz.floorRect.x + hash01(pg * 3.9 + 0.4) * rz.floorRect.w;
      var py = rz.floorRect.y + hash01(pg * 7.1 + 1.2) * rz.floorRect.h;
      ctx.beginPath();
      ctx.arc(px, py, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "#5b3d25";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(wallL, floorTopY);
    ctx.lineTo(wallR, floorTopY);
    ctx.stroke();

    var wb = rz.windowBackRect;
    var sunGrad = ctx.createLinearGradient(0, wb.yMax, 0, H * 0.94);
    sunGrad.addColorStop(0, "rgba(255,232,168,0.28)");
    sunGrad.addColorStop(1, "rgba(255,224,148,0.04)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.moveTo(wb.x, floorTopY);
    ctx.lineTo(wb.x + wb.w, floorTopY);
    ctx.lineTo(rz.floorRect.x + rz.floorRect.w * 0.88, rz.floorRect.yMax);
    ctx.lineTo(rz.floorRect.x + rz.floorRect.w * 0.12, rz.floorRect.yMax);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#4b2f1c";
    ctx.fillRect(wb.x - 6, wb.y - 6, wb.w + 12, wb.h + 12);
    var wg = ctx.createLinearGradient(0, wb.y, 0, wb.y + wb.h);
    wg.addColorStop(0, "#9ac0c6");
    wg.addColorStop(0.45, "#e7cb7a");
    wg.addColorStop(1, "#c8923b");
    ctx.fillStyle = wg;
    ctx.fillRect(wb.x, wb.y, wb.w, wb.h);
    ctx.fillStyle = "#e6dac2";
    ctx.fillRect(wb.x, wb.y, wb.w * 0.18, wb.h);
    ctx.fillRect(wb.x + wb.w * 0.82, wb.y, wb.w * 0.18, wb.h);

    var ch = rz.chestRect;
    ctx.fillStyle = "rgba(25,14,6,0.32)";
    ctx.fillRect(ch.x + 4, ch.y + ch.h - 4, ch.w, 10);
    ctx.fillStyle = "#5e3b22";
    ctx.fillRect(ch.x, ch.y + ch.h * 0.12, ch.w, ch.h * 0.84);
    ctx.fillStyle = "#754b2c";
    ctx.fillRect(ch.x - 4, ch.y + ch.h * 0.06, ch.w + 8, ch.h * 0.09);
    for (var dr = 0; dr < 3; dr++) {
      var dy = ch.y + ch.h * (0.18 + dr * 0.25);
      var dh = ch.h * 0.21;
      ctx.strokeStyle = "#3a2212";
      ctx.lineWidth = 1.6;
      ctx.strokeRect(ch.x + 7, dy, ch.w - 14, dh);
      ctx.fillStyle = "#c59d56";
      ctx.beginPath();
      ctx.arc(ch.x + ch.w * 0.32, dy + dh * 0.5, 2.6, 0, Math.PI * 2);
      ctx.arc(ch.x + ch.w * 0.68, dy + dh * 0.5, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#d9cbb4";
    ctx.beginPath();
    ctx.ellipse(ch.x + ch.w * 0.22, ch.y + ch.h * 0.05, ch.w * 0.12, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#b5693c";
    ctx.fillRect(ch.x + ch.w * 0.18, ch.y - ch.h * 0.08, ch.w * 0.08, ch.h * 0.13);

    var bd = rz.bedRect;
    ctx.fillStyle = "rgba(25,14,6,0.32)";
    ctx.fillRect(bd.x - 2, bd.y + bd.h - 4, bd.w + 4, 10);
    ctx.fillStyle = "#4d2f1b";
    ctx.fillRect(bd.x + bd.w - 9, bd.y - bd.h * 0.08, 9, bd.h * 1.06);
    ctx.fillRect(bd.x, bd.y + bd.h * 0.22, 8, bd.h * 0.76);
    ctx.fillStyle = "#c97a3d";
    ctx.fillRect(bd.x + 6, bd.y + bd.h * 0.28, bd.w - 13, bd.h * 0.48);
    ctx.strokeStyle = "rgba(248,226,184,0.38)";
    ctx.lineWidth = 1.2;
    for (var q = 0; q < 6; q++) {
      var qx = bd.x + 12 + (q / 5) * (bd.w - 28);
      ctx.beginPath();
      ctx.moveTo(qx, bd.y + bd.h * 0.28);
      ctx.lineTo(qx - 10, bd.y + bd.h * 0.76);
      ctx.stroke();
    }
    ctx.fillStyle = "#efe5cf";
    ctx.beginPath();
    ctx.ellipse(bd.x + bd.w - 22, bd.y + bd.h * 0.27, 15, 8, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4a3828";
    ctx.fillRect(bd.x + 6, bd.y + bd.h * 0.74, bd.w - 13, bd.h * 0.12);

    ctx.restore();
    return layout;
  }

  function renderArchivalPreview(canvasEl, kind) {
    if (!canvasEl || typeof canvasEl.getContext !== "function") return false;
    if (!canvasEl.width || canvasEl.width < 120) canvasEl.width = 480;
    if (!canvasEl.height || canvasEl.height < 90) canvasEl.height = 320;
    var ctx = canvasEl.getContext("2d");
    if (!ctx) return false;

    var W = canvasEl.width;
    var H = canvasEl.height;
    var isMap = String(kind || "").toLowerCase().indexOf("map") !== -1;

    ctx.save();
    var pGrad = ctx.createLinearGradient(0, 0, W, H);
    pGrad.addColorStop(0, "#f1e6ce");
    pGrad.addColorStop(0.6, "#e5d4b2");
    pGrad.addColorStop(1, "#d3bd95");
    ctx.fillStyle = pGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(110,82,48,0.14)";
    ctx.lineWidth = 1;
    for (var ln = 8; ln < H; ln += 10) {
      ctx.beginPath();
      ctx.moveTo(0, ln);
      ctx.lineTo(W, ln);
      ctx.stroke();
    }

    ctx.strokeStyle = "#5a3d24";
    ctx.lineWidth = 2;
    ctx.strokeRect(8, 8, W - 16, H - 16);
    ctx.lineWidth = 1;
    ctx.strokeRect(13, 13, W - 26, H - 26);

    ctx.fillStyle = "#3f2815";
    ctx.font = "bold " + Math.max(10, Math.round(W * 0.026)) + "px Georgia, serif";
    ctx.textAlign = "left";
    ctx.fillText(
      isMap ? "PROCOPIA SURVEY PLATE — CASEMENT & IX STRATA" : "PROCOPIA ARCHIVAL STUDY — INN WINDOW APERTURE",
      22,
      30
    );

    if (isMap) {
      var leftX = 24;
      var leftW = Math.round(W * 0.36);
      var boxY = 44;
      var boxH = H - 72;

      ctx.strokeStyle = "#5a3d24";
      ctx.lineWidth = 1.4;
      ctx.strokeRect(leftX, boxY + boxH * 0.48, leftW, boxH * 0.50);
      ctx.fillStyle = "rgba(138,96,52,0.16)";
      ctx.fillRect(leftX + 5, boxY + boxH * 0.54, leftW * 0.28, boxH * 0.34);
      ctx.fillRect(leftX + leftW * 0.66, boxY + boxH * 0.54, leftW * 0.28, boxH * 0.38);

      ctx.beginPath();
      ctx.moveTo(leftX + leftW * 0.35, boxY + boxH * 0.48);
      ctx.lineTo(leftX + 4, boxY + 6);
      ctx.lineTo(leftX + leftW - 4, boxY + 6);
      ctx.lineTo(leftX + leftW * 0.65, boxY + boxH * 0.48);
      ctx.closePath();
      ctx.fillStyle = "rgba(107,148,158,0.18)";
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#4b311b";
      ctx.font = Math.max(9, Math.round(W * 0.021)) + "px Georgia, serif";
      ctx.fillText("INN ROOM (26)", leftX + 10, boxY + boxH * 0.93);

      var rx0 = leftX + leftW + 18;
      var rw = W - rx0 - 24;
      for (var s = 0; s < STRATA_DEFS.length; s++) {
        var idx = 8 - s;
        var def = STRATA_DEFS[idx];
        var sy = boxY + (s / 9) * boxH;
        var sh = (boxH / 9) - 3;
        ctx.fillStyle = (s === 0) ? "rgba(107,163,188,0.28)" : "rgba(168,122,56,0.18)";
        ctx.fillRect(rx0, sy, rw, sh);
        ctx.strokeStyle = "rgba(90,61,36,0.55)";
        ctx.strokeRect(rx0, sy, rw, sh);
        ctx.fillStyle = "#3b2412";
        ctx.fillText((idx + 1) + ". " + def.label, rx0 + 6, sy + sh * 0.72);
      }
    } else {
      var pad = 26;
      var subW = W - pad * 2;
      var subH = H - 68;
      ctx.save();
      ctx.translate(pad, 40);
      var miniLayout = computeLayout(subW, subH);
      renderWindowBackdrop(ctx, subW, subH, { layout: miniLayout, reducedMotion: true, time: 0 });
      var ap = miniLayout.aperture;
      for (var cf = 0; cf < 3; cf++) {
        var fx = ap.x + ap.w * (0.28 + cf * 0.22);
        var fy = ap.y + ap.h * 0.84;
        var fr = Math.max(10, ap.w * 0.055);
        ctx.fillStyle = "#e6b47c";
        ctx.beginPath();
        ctx.arc(fx, fy, fr, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#4b2e19";
        ctx.lineWidth = 1.3;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(fx, fy + fr * 0.12, fr * 0.45, 0.15 * Math.PI, 0.85 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = "#f2c649";
        ctx.fillRect(fx - fr * 0.65, fy + fr * 0.36, fr * 1.3, fr * 0.32);
      }
      renderWindowForegroundSashAndCurtain(ctx, subW, subH, { layout: miniLayout, curtainLift: 0.86 });
      ctx.restore();
    }

    ctx.fillStyle = "#5a3d24";
    ctx.font = "italic " + Math.max(9, Math.round(W * 0.021)) + "px Georgia, serif";
    ctx.textAlign = "right";
    ctx.fillText("Archival Copperplate Folio — Inn Ledger", W - 20, H - 18);
    ctx.restore();
    return true;
  }

  function createRenderer(options) {
    var opts = options || {};
    var defaultReduced = Boolean(opts.reducedMotion);

    function mergeState(state) {
      var st = state || {};
      if (st.reducedMotion === undefined) {
        return {
          layout: st.layout,
          time: st.time,
          curtainLift: st.curtainLift,
          citizenCount: st.citizenCount,
          viewMode: st.viewMode,
          reducedMotion: defaultReduced
        };
      }
      return st;
    }

    return {
      STRATA_DEFS: STRATA_DEFS,
      computeLayout: computeLayout,
      renderWindowBackdrop: function (ctx, width, height, state) {
        return renderWindowBackdrop(ctx, width, height, mergeState(state));
      },
      renderWindowForegroundSashAndCurtain: function (ctx, width, height, state) {
        return renderWindowForegroundSashAndCurtain(ctx, width, height, mergeState(state));
      },
      renderRoomBackdrop: function (ctx, width, height, state) {
        return renderRoomBackdrop(ctx, width, height, mergeState(state));
      },
      computeVisibilityReport: computeVisibilityReport,
      renderArchivalPreview: renderArchivalPreview
    };
  }

  var api = {
    STRATA_DEFS: STRATA_DEFS,
    createRenderer: createRenderer,
    computeLayout: computeLayout,
    computeVisibilityReport: computeVisibilityReport,
    renderArchivalPreview: renderArchivalPreview
  };

  root.ProcopiaWindowStrata = api;
  if (typeof window !== "undefined") {
    window.ProcopiaWindowStrata = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
