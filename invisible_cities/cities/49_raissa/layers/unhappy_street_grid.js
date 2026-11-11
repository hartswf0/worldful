(function (root) {
  "use strict";

  var PALETTE = Object.freeze({
    grimSlateNight: "#13171d",
    sootAshWall: "#222933",
    zincCounterPewter: "#566373",
    rainBruiseBlue: "#39485a",
    parchmentVellum: "#efe3c4",
    filamentSpunGold: "#f4c552",
    ragoutTerracotta: "#c95b3c",
    francolinSpeckleAmber: "#e29a2e",
    deepRiverSoot: "#0c1015",
    mortarShadow: "#192029",
    mistPewter: "#8596aa"
  });

  function freezeZone(z) {
    Object.freeze(z.rectNorm);
    return Object.freeze(z);
  }

  var GRIM_ZONES = Object.freeze([
    freezeZone({
      id: "river_railing",
      title: "River Embankment Railings",
      calvinoStone: "Figures leaning on river railings pressing fists to their temples",
      rectNorm: { x: 0.03, y: 0.70, w: 0.26, h: 0.25 },
      detail: "Above the rain-pocked black river arch, bowed citizens lean on wet iron railings pressing clenched fists against their temples."
    }),
    freezeZone({
      id: "wringing_street",
      title: "Lane of Wringing Hands",
      calvinoStone: "Streets where people walk wringing their hands and cursing the crying children",
      rectNorm: { x: 0.03, y: 0.40, w: 0.22, h: 0.28 },
      detail: "Along slick flagstones passersby pace wringing their hands while shaking bitter fists toward a shuttered sill where a child weeps."
    }),
    freezeZone({
      id: "bad_dream_garret",
      title: "Garret of Waking Bad Dreams",
      calvinoStone: "Morning waking from one bad dream as another begins",
      rectNorm: { x: 0.03, y: 0.11, w: 0.21, h: 0.27 },
      detail: "Under cold slate rafters a sleeper bolts upright at gray dawn as one dark nightmare unravels only for a heavier dread to coil overhead."
    }),
    freezeZone({
      id: "hammer_workbench",
      title: "Loft of Struck Thumbs & Needles",
      calvinoStone: "Workbenches where every moment hammers strike fingers or needles prick thumbs",
      rectNorm: { x: 0.34, y: 0.11, w: 0.21, h: 0.32 },
      detail: "Beneath smoked tin lamps iron hammers slip onto bruised fingers and glinting sewing needles prick thumbs at every passing moment."
    }),
    freezeZone({
      id: "awry_ledgers",
      title: "Counting-House of Awry Ledgers",
      calvinoStone: "Awry columns of figures in the ledgers of merchants and bankers",
      rectNorm: { x: 0.41, y: 0.45, w: 0.15, h: 0.24 },
      detail: "Stooped merchants and bankers hunch over slanted desks where folio columns of figures tilt awry in irreconcilable sums."
    }),
    freezeZone({
      id: "zinc_wineshop",
      title: "Wineshop of Messy Zinc Counters",
      calvinoStone: "Rows of empty glasses on the messy zinc counters of wineshops with bent grim heads",
      rectNorm: { x: 0.30, y: 0.71, w: 0.33, h: 0.24 },
      detail: "Rows of drained glasses line the stained pewter-zinc bar where drinkers keep their heads bowed to conceal their grim gaze."
    }),
    freezeZone({
      id: "quarrel_windows",
      title: "Summer Windows of Broken Dishes",
      calvinoStone: "Summer windows resounding with domestic quarrels and broken dishes",
      rectNorm: { x: 0.65, y: 0.55, w: 0.19, h: 0.40 },
      detail: "Half-shuttered summer casements resound with bitter domestic quarrels as cracked plates and porcelain shards tumble into the court."
    }),
    freezeZone({
      id: "slate_ramparts_shell",
      title: "Rain-Darkened Ramparts & Masonry Shell",
      calvinoStone: "City of sadness where life is not happy under rain-darkened slate, scaffolding, pergola, and ramparts",
      rectNorm: { x: 0.57, y: 0.09, w: 0.40, h: 0.44 },
      detail: "Soot-streaked scaffolding, dripping vine pergola, steeplechase ramparts, north-light garret, and vaulted scriptorium framing grim Raissa."
    })
  ]);

  var SHELL_SUB_RECTS = Object.freeze([
    Object.freeze({ x: 0.25, y: 0.09, w: 0.09, h: 0.35 }),
    Object.freeze({ x: 0.26, y: 0.45, w: 0.15, h: 0.24 }),
    Object.freeze({ x: 0.85, y: 0.54, w: 0.12, h: 0.41 })
  ]);

  var ANCHOR_ZONES = Object.freeze([
    Object.freeze({ index: 0, id: "laughing_child", zoneLabel: "Tenement Casement Window", baseX: 0.11, baseY: 0.27, driftRadiusX: 0.018, driftRadiusY: 0.020 }),
    Object.freeze({ index: 1, id: "polenta_dog", zoneLabel: "Courtyard Lean-To Shed Roof", baseX: 0.20, baseY: 0.53, driftRadiusX: 0.022, driftRadiusY: 0.018 }),
    Object.freeze({ index: 2, id: "merry_stonemason", zoneLabel: "High Timber Scaffolding Stage", baseX: 0.29, baseY: 0.21, driftRadiusX: 0.020, driftRadiusY: 0.022 }),
    Object.freeze({ index: 3, id: "ragout_maid", zoneLabel: "Rain-Darkened Courtyard Pergola", baseX: 0.38, baseY: 0.56, driftRadiusX: 0.020, driftRadiusY: 0.020 }),
    Object.freeze({ index: 4, id: "umbrella_maker", zoneLabel: "Vaulted Umbrella-Maker Stall", baseX: 0.49, baseY: 0.63, driftRadiusX: 0.020, driftRadiusY: 0.018 }),
    Object.freeze({ index: 5, id: "parasol_lady", zoneLabel: "Slate Rampart Promenade", baseX: 0.61, baseY: 0.34, driftRadiusX: 0.024, driftRadiusY: 0.018 }),
    Object.freeze({ index: 6, id: "leaping_officer", zoneLabel: "Rampart Barricade Jump", baseX: 0.71, baseY: 0.47, driftRadiusX: 0.024, driftRadiusY: 0.020 }),
    Object.freeze({ index: 7, id: "flying_horse", zoneLabel: "Storm Sky Arch Above Obstacles", baseX: 0.78, baseY: 0.19, driftRadiusX: 0.026, driftRadiusY: 0.022 }),
    Object.freeze({ index: 8, id: "freed_francolin", zoneLabel: "North-Light Painter Garret Window", baseX: 0.86, baseY: 0.31, driftRadiusX: 0.020, driftRadiusY: 0.020 }),
    Object.freeze({ index: 9, id: "parchment_illuminator", zoneLabel: "Stone Scriptorium Lectern", baseX: 0.90, baseY: 0.64, driftRadiusX: 0.018, driftRadiusY: 0.020 })
  ]);

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function pointInRect(nx, ny, r) {
    return nx >= r.x && nx <= r.x + r.w && ny >= r.y && ny <= r.y + r.h;
  }

  function traceRoundRect(ctx, x, y, w, h, r) {
    var rad = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
    ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y);
    ctx.closePath();
  }

  function drawAshlarCourses(ctx, x, y, w, h, rows, cols, strokeColor) {
    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 1;
    var rowH = h / rows;
    var colW = w / cols;
    for (var r = 1; r < rows; r++) {
      var yy = y + r * rowH;
      ctx.beginPath();
      ctx.moveTo(x, yy);
      ctx.lineTo(x + w, yy);
      ctx.stroke();
    }
    for (var rr = 0; rr < rows; rr++) {
      var offset = (rr % 2) * (colW * 0.5);
      for (var c = 1; c < cols; c++) {
        var xx = x + c * colW - offset;
        if (xx > x + 2 && xx < x + w - 2) {
          ctx.beginPath();
          ctx.moveTo(xx, y + rr * rowH);
          ctx.lineTo(xx, y + (rr + 1) * rowH);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  function drawBowedFigure(ctx, cx, cy, scale, facing, fistToTemple) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(facing * scale, scale);
    ctx.fillStyle = "#0e1218";
    ctx.strokeStyle = "#485769";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-9, 22);
    ctx.lineTo(-7, 2);
    ctx.quadraticCurveTo(-5, -8, 4, -9);
    ctx.quadraticCurveTo(10, -8, 9, 4);
    ctx.lineTo(8, 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(6, -12, 4.6, 0, Math.PI * 2);
    ctx.fill();
    if (fistToTemple) {
      ctx.strokeStyle = "#6c7d91";
      ctx.lineWidth = 2.1;
      ctx.beginPath();
      ctx.moveTo(2, -3);
      ctx.lineTo(10, -4);
      ctx.lineTo(9, -12);
      ctx.stroke();
      ctx.fillStyle = "#566373";
      ctx.beginPath();
      ctx.arc(9.2, -12.5, 2.1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function renderSkyAndDistantRoofs(ctx, w, h, phaseT) {
    var skyGrad = ctx.createLinearGradient(0, 0, 0, h);
    skyGrad.addColorStop(0.0, PALETTE.grimSlateNight);
    skyGrad.addColorStop(0.38, "#1b2430");
    skyGrad.addColorStop(0.72, PALETTE.sootAshWall);
    skyGrad.addColorStop(1.0, PALETTE.deepRiverSoot);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    var cloudDrift = Math.sin(phaseT * 0.22) * w * 0.012;
    ctx.fillStyle = "rgba(57, 72, 90, 0.24)";
    for (var i = 0; i < 5; i++) {
      var cx = w * (0.14 + i * 0.20) + cloudDrift * (i % 2 === 0 ? 1 : -0.7);
      var cy = h * (0.06 + (i % 3) * 0.035);
      ctx.beginPath();
      ctx.arc(cx, cy, w * 0.075, 0, Math.PI * 2);
      ctx.arc(cx + w * 0.045, cy + h * 0.01, w * 0.055, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#171d26";
    ctx.beginPath();
    ctx.moveTo(0, h * 0.24);
    var peaks = [
      [0.04, 0.09], [0.13, 0.05], [0.23, 0.10], [0.31, 0.08],
      [0.44, 0.04], [0.55, 0.09], [0.64, 0.14], [0.73, 0.12],
      [0.83, 0.15], [0.91, 0.05], [0.98, 0.10], [1.0, 0.20]
    ];
    for (var p = 0; p < peaks.length; p++) {
      ctx.lineTo(w * peaks[p][0], h * peaks[p][1]);
    }
    ctx.lineTo(w, h * 0.32);
    ctx.lineTo(0, h * 0.32);
    ctx.closePath();
    ctx.fill();

    var chimneys = [0.09, 0.19, 0.41, 0.51, 0.89];
    for (var c = 0; c < chimneys.length; c++) {
      var chX = w * chimneys[c];
      var chY = h * (0.055 + (c % 2) * 0.02);
      ctx.fillStyle = "#1d2530";
      ctx.fillRect(chX - 4, chY, 8, h * 0.045);
      ctx.strokeStyle = "rgba(86, 99, 115, 0.28)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(chX, chY);
      var sway = Math.sin(phaseT * 0.9 + c * 1.4) * 8;
      ctx.bezierCurveTo(chX + 14, chY - 10 + sway * 0.3, chX + 34, chY - 6 - sway * 0.4, chX + 56, chY - 14);
      ctx.stroke();
    }
  }

  function renderCutawayStructure(ctx, w, h, phaseT) {
    var shellBlocks = [
      { x: 0.03, y: 0.11, w: 0.22, h: 0.58, fill: "#1d242e", rows: 9, cols: 6 },
      { x: 0.34, y: 0.11, w: 0.22, h: 0.59, fill: "#1f2732", rows: 9, cols: 6 },
      { x: 0.65, y: 0.54, w: 0.19, h: 0.41, fill: "#1c232d", rows: 7, cols: 5 },
      { x: 0.85, y: 0.11, w: 0.12, h: 0.84, fill: "#1b222b", rows: 12, cols: 4 }
    ];
    for (var b = 0; b < shellBlocks.length; b++) {
      var blk = shellBlocks[b];
      ctx.fillStyle = blk.fill;
      ctx.fillRect(w * blk.x, h * blk.y, w * blk.w, h * blk.h);
      drawAshlarCourses(ctx, w * blk.x, h * blk.y, w * blk.w, h * blk.h, blk.rows, blk.cols, "rgba(86, 99, 115, 0.16)");
      ctx.strokeStyle = PALETTE.rainBruiseBlue;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(w * blk.x, h * blk.y, w * blk.w, h * blk.h);
    }

    ctx.fillStyle = "#27313e";
    var beamsY = [0.385, 0.688];
    for (var by = 0; by < beamsY.length; by++) {
      ctx.fillRect(w * 0.025, h * beamsY[by], w * 0.615, h * 0.016);
    }
    ctx.fillRect(w * 0.335, h * 0.432, w * 0.23, h * 0.015);
    ctx.fillRect(w * 0.565, h * 0.532, w * 0.41, h * 0.016);

    var scX = w * 0.255, scW = w * 0.078, scTop = h * 0.12, scBot = h * 0.45;
    ctx.strokeStyle = "#62584d";
    ctx.lineWidth = 2.4;
    var poles = [scX, scX + scW * 0.5, scX + scW];
    for (var sp = 0; sp < poles.length; sp++) {
      ctx.beginPath();
      ctx.moveTo(poles[sp], scTop);
      ctx.lineTo(poles[sp], scBot);
      ctx.stroke();
    }
    var decks = [0.215, 0.31, 0.405];
    for (var d = 0; d < decks.length; d++) {
      var dy = h * decks[d];
      ctx.fillStyle = "#4c453e";
      ctx.fillRect(scX - 4, dy, scW + 8, 4.5);
      ctx.strokeStyle = "rgba(86, 99, 115, 0.45)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(scX, dy);
      ctx.lineTo(scX + scW, dy + h * 0.085);
      ctx.moveTo(scX + scW, dy);
      ctx.lineTo(scX, dy + h * 0.085);
      ctx.stroke();
    }

    ctx.fillStyle = "#333f4d";
    ctx.beginPath();
    ctx.moveTo(w * 0.155, h * 0.545);
    ctx.lineTo(w * 0.202, h * 0.508);
    ctx.lineTo(w * 0.252, h * 0.548);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = PALETTE.zincCounterPewter;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#181f28";
    ctx.fillRect(w * 0.165, h * 0.546, w * 0.08, h * 0.135);

    var pgX = w * 0.335, pgW = w * 0.072, pgY = h * 0.485;
    ctx.strokeStyle = "#4b5968";
    ctx.lineWidth = 2.2;
    ctx.strokeRect(pgX, pgY, pgW, h * 0.195);
    for (var pv = 0; pv < 5; pv++) {
      var vx = pgX + (pv + 0.5) * (pgW / 5);
      ctx.strokeStyle = "#2d3d3a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(vx, pgY - 3);
      ctx.quadraticCurveTo(vx + 4, pgY + 12, vx - 2, pgY + 22 + Math.sin(phaseT + pv) * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "#26303d";
    ctx.fillRect(w * 0.568, h * 0.355, w * 0.125, h * 0.045);
    for (var cr = 0; cr < 6; cr++) {
      ctx.fillRect(w * (0.57 + cr * 0.02), h * 0.335, w * 0.012, h * 0.02);
    }
    ctx.fillStyle = "#202833";
    ctx.fillRect(w * 0.655, h * 0.485, w * 0.185, h * 0.048);
    var jumps = [0.695, 0.755];
    for (var j = 0; j < jumps.length; j++) {
      var jx = w * jumps[j];
      ctx.strokeStyle = "#7a6a58";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(jx - 8, h * 0.488);
      ctx.lineTo(jx + 2, h * 0.448);
      ctx.lineTo(jx + 11, h * 0.488);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(86, 99, 115, 0.42)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w * 0.78, h * 0.24, w * 0.075, Math.PI, 0);
    ctx.stroke();

    ctx.fillStyle = "#2a3544";
    ctx.strokeStyle = PALETTE.zincCounterPewter;
    ctx.lineWidth = 1.4;
    ctx.fillRect(w * 0.848, h * 0.265, w * 0.046, h * 0.082);
    ctx.strokeRect(w * 0.848, h * 0.265, w * 0.046, h * 0.082);

    ctx.fillStyle = "#3c3128";
    ctx.beginPath();
    ctx.moveTo(w * 0.882, h * 0.69);
    ctx.lineTo(w * 0.925, h * 0.69);
    ctx.lineTo(w * 0.918, h * 0.635);
    ctx.lineTo(w * 0.886, h * 0.648);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(239, 227, 196, 0.42)";
    ctx.fillRect(w * 0.891, h * 0.633, w * 0.022, h * 0.014);
  }

  function renderRiverRailingScene(ctx, w, h, phaseT) {
    var rx = w * 0.03, ry = h * 0.704, rw = w * 0.26, rh = h * 0.246;
    ctx.fillStyle = "#141a22";
    ctx.fillRect(rx, ry, rw, rh);

    ctx.fillStyle = "#0a0e13";
    ctx.beginPath();
    ctx.moveTo(rx, ry + rh);
    ctx.lineTo(rx, ry + rh * 0.45);
    ctx.quadraticCurveTo(rx + rw * 0.5, ry + rh * 0.16, rx + rw, ry + rh * 0.45);
    ctx.lineTo(rx + rw, ry + rh);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(86, 99, 115, 0.36)";
    ctx.lineWidth = 1.1;
    for (var rp = 0; rp < 6; rp++) {
      var wy = ry + rh * (0.58 + rp * 0.065);
      var shift = Math.sin(phaseT * 1.4 + rp * 1.1) * 6;
      ctx.beginPath();
      ctx.moveTo(rx + 8 + shift, wy);
      ctx.quadraticCurveTo(rx + rw * 0.45, wy - 2.5, rx + rw - 10 + shift * 0.5, wy + 1);
      ctx.stroke();
    }

    var railY = ry + rh * 0.28;
    ctx.strokeStyle = PALETTE.zincCounterPewter;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(rx + 4, railY);
    ctx.lineTo(rx + rw - 4, railY);
    ctx.stroke();
    ctx.lineWidth = 1.1;
    for (var pk = 0; pk <= 14; pk++) {
      var px = rx + 6 + pk * ((rw - 12) / 14);
      ctx.beginPath();
      ctx.moveTo(px, railY);
      ctx.lineTo(px, railY + rh * 0.19);
      ctx.stroke();
    }

    var leaners = [0.085, 0.165, 0.238];
    var scale = Math.min(w / 960, h / 620) * 1.02;
    for (var i = 0; i < leaners.length; i++) {
      var bob = Math.sin(phaseT * 1.1 + i * 2.1) * 1.2;
      drawBowedFigure(ctx, w * leaners[i], railY + 2 + bob, clamp(scale, 0.55, 1.15), i === 1 ? -1 : 1, true);
    }
  }

  function renderWringingStreetScene(ctx, w, h, phaseT) {
    var sx = w * 0.03, sy = h * 0.402, sw = w * 0.22, sh = h * 0.28;
    ctx.fillStyle = "#222b36";
    ctx.fillRect(sx + 2, sy + sh * 0.84, sw - 4, sh * 0.15);
    ctx.fillStyle = "rgba(86, 99, 115, 0.26)";
    ctx.fillRect(sx + sw * 0.18, sy + sh * 0.89, sw * 0.36, 3);

    var winX = w * 0.046, winY = h * 0.495, winW = w * 0.044, winH = h * 0.088;
    ctx.fillStyle = "#12171f";
    ctx.fillRect(winX, winY, winW, winH);
    ctx.strokeStyle = PALETTE.zincCounterPewter;
    ctx.lineWidth = 1.3;
    ctx.strokeRect(winX, winY, winW, winH);
    ctx.fillStyle = "#485769";
    ctx.beginPath();
    ctx.arc(winX + winW * 0.5, winY + winH * 0.62, Math.max(3.5, winW * 0.2), 0, Math.PI * 2);
    ctx.fill();
    var cryPulse = (Math.sin(phaseT * 4.2) + 1) * 0.5;
    ctx.strokeStyle = "rgba(133, 150, 170, " + (0.35 + cryPulse * 0.35).toFixed(2) + ")";
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(winX + winW * 0.5, winY + winH * 0.58, winW * (0.34 + cryPulse * 0.18), -0.9, 0.9);
    ctx.stroke();

    var sc = clamp(Math.min(w / 960, h / 620), 0.55, 1.15);
    var curserX = w * 0.112, curserY = h * 0.618;
    drawBowedFigure(ctx, curserX, curserY, sc, -1, false);
    ctx.strokeStyle = "#7c8d9f";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(curserX - 4 * sc, curserY - 4 * sc);
    ctx.lineTo(curserX - 14 * sc, curserY - (13 + Math.sin(phaseT * 5.0) * 2.5) * sc);
    ctx.stroke();

    var wringX = w * 0.152 + Math.sin(phaseT * 0.85) * (w * 0.006), wringY = h * 0.622;
    drawBowedFigure(ctx, wringX, wringY, sc, 1, false);
    var wringTw = Math.sin(phaseT * 5.5) * 2.2 * sc;
    ctx.strokeStyle = "#8a9bb0";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(wringX + 10 * sc, wringY - 2 * sc + wringTw * 0.4, 3.2 * sc, 0, Math.PI * 2);
    ctx.stroke();
  }

  function renderBadDreamGarretScene(ctx, w, h, phaseT) {
    var cwX = w * 0.088, cwY = h * 0.215, cwW = w * 0.044, cwH = h * 0.105;
    ctx.fillStyle = "#131922";
    ctx.fillRect(cwX, cwY, cwW, cwH);
    ctx.strokeStyle = PALETTE.zincCounterPewter;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cwX, cwY, cwW, cwH);
    ctx.beginPath();
    ctx.moveTo(cwX + cwW * 0.5, cwY);
    ctx.lineTo(cwX + cwW * 0.5, cwY + cwH);
    ctx.moveTo(cwX, cwY + cwH * 0.52);
    ctx.lineTo(cwX + cwW, cwY + cwH * 0.52);
    ctx.stroke();

    ctx.fillStyle = "rgba(57, 72, 90, 0.18)";
    ctx.beginPath();
    ctx.moveTo(w * 0.23, h * 0.14);
    ctx.lineTo(w * 0.14, h * 0.35);
    ctx.lineTo(w * 0.21, h * 0.35);
    ctx.closePath();
    ctx.fill();

    var bedX = w * 0.146, bedY = h * 0.322, bedW = w * 0.082;
    ctx.strokeStyle = "#566373";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(bedX, bedY - 12);
    ctx.lineTo(bedX, bedY + 8);
    ctx.moveTo(bedX + bedW, bedY - 7);
    ctx.lineTo(bedX + bedW, bedY + 8);
    ctx.moveTo(bedX, bedY);
    ctx.lineTo(bedX + bedW, bedY);
    ctx.stroke();

    var sleeperX = bedX + bedW * 0.36, sleeperY = bedY - 2;
    ctx.fillStyle = "#11161d";
    ctx.beginPath();
    ctx.arc(sleeperX, sleeperY - 11, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(sleeperX - 5, sleeperY - 7, 10, 8);

    var coilShift = Math.sin(phaseT * 1.6) * 3;
    ctx.strokeStyle = "rgba(86, 99, 115, 0.52)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(sleeperX - 12, sleeperY - 21 + coilShift * 0.4, 7, 0.3, Math.PI * 1.8);
    ctx.stroke();
    ctx.strokeStyle = "rgba(201, 91, 60, 0.46)";
    ctx.beginPath();
    ctx.arc(sleeperX + 9, sleeperY - 24 - coilShift * 0.5, 9.5, 0, Math.PI * 1.75);
    ctx.stroke();
  }

  function renderHammerWorkbenchScene(ctx, w, h, phaseT) {
    var lamps = [0.39, 0.495];
    for (var l = 0; l < lamps.length; l++) {
      var lx = w * lamps[l], ly = h * 0.165;
      ctx.strokeStyle = "#4d5b6b";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(lx, h * 0.112);
      ctx.lineTo(lx, ly);
      ctx.stroke();
      ctx.fillStyle = "rgba(226, 154, 46, 0.11)";
      ctx.beginPath();
      ctx.moveTo(lx - 6, ly);
      ctx.lineTo(lx - 26, h * 0.36);
      ctx.lineTo(lx + 26, h * 0.36);
      ctx.lineTo(lx + 6, ly);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#465362";
      ctx.fillRect(lx - 7, ly - 3, 14, 4);
    }

    var bY = h * 0.355;
    ctx.fillStyle = "#3e352e";
    ctx.fillRect(w * 0.355, bY, w * 0.08, 5);
    ctx.fillRect(w * 0.455, bY, w * 0.08, 5);

    var sc = clamp(Math.min(w / 960, h / 620), 0.55, 1.15);
    drawBowedFigure(ctx, w * 0.382, bY - 4, sc * 0.92, 1, false);
    var strikeCycle = Math.sin(phaseT * 4.4);
    var hammerAng = strikeCycle > 0.4 ? 0.55 : -0.45 + strikeCycle * 0.6;
    var hx = w * 0.398, hy = bY - 4;
    ctx.save();
    ctx.translate(hx, hy - 6);
    ctx.rotate(hammerAng);
    ctx.strokeStyle = "#8a7968";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(13 * sc, -5 * sc);
    ctx.stroke();
    ctx.fillStyle = "#6e7f91";
    ctx.fillRect(11 * sc, -9 * sc, 5 * sc, 8 * sc);
    ctx.restore();
    if (strikeCycle > 0.35) {
      ctx.strokeStyle = PALETTE.ragoutTerracotta;
      ctx.lineWidth = 1.4;
      for (var sp = 0; sp < 4; sp++) {
        var ang = -2.4 + sp * 0.55;
        ctx.beginPath();
        ctx.moveTo(hx + 11 * sc, hy - 2);
        ctx.lineTo(hx + 11 * sc + Math.cos(ang) * 8 * sc, hy - 2 + Math.sin(ang) * 8 * sc);
        ctx.stroke();
      }
    }

    drawBowedFigure(ctx, w * 0.482, bY - 4, sc * 0.92, 1, false);
    var nx = w * 0.502, ny = bY - 5;
    ctx.strokeStyle = "#b8c5d4";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(nx - 4, ny - 8);
    ctx.lineTo(nx + 4, ny);
    ctx.stroke();
    var prickAlpha = 0.45 + 0.45 * ((Math.cos(phaseT * 3.9) + 1) * 0.5);
    ctx.fillStyle = "rgba(201, 91, 60, " + prickAlpha.toFixed(2) + ")";
    ctx.beginPath();
    ctx.arc(nx + 4, ny + 1, 2.6 * sc, 0, Math.PI * 2);
    ctx.fill();
  }

  function renderAwryLedgersScene(ctx, w, h, phaseT) {
    var lx = w * 0.422, ly = h * 0.465, lw = w * 0.056, lh = h * 0.068;
    ctx.fillStyle = "rgba(239, 227, 196, 0.20)";
    ctx.fillRect(lx, ly, lw, lh);
    ctx.strokeStyle = PALETTE.zincCounterPewter;
    ctx.lineWidth = 1.1;
    ctx.strokeRect(lx, ly, lw, lh);
    ctx.beginPath();
    ctx.moveTo(lx + lw * 0.5, ly);
    ctx.lineTo(lx + lw * 0.5, ly + lh);
    ctx.stroke();

    for (var row = 0; row < 5; row++) {
      var ry = ly + 5 + row * ((lh - 8) / 5);
      var skew = ((row % 2 === 0 ? 1 : -1) * 2.8) + Math.sin(phaseT * 0.8 + row) * 0.8;
      ctx.strokeStyle = "rgba(239, 227, 196, 0.55)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(lx + 4 + skew * 0.5, ry);
      ctx.lineTo(lx + lw * 0.44 + skew, ry + skew * 0.35);
      ctx.moveTo(lx + lw * 0.56 - skew * 0.4, ry + 1);
      ctx.lineTo(lx + lw - 4 + skew * 0.6, ry - skew * 0.4);
      ctx.stroke();
    }
    ctx.strokeStyle = PALETTE.ragoutTerracotta;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(lx + 4, ly + lh * 0.72);
    ctx.lineTo(lx + lw - 4, ly + lh * 0.32);
    ctx.stroke();

    var sc = clamp(Math.min(w / 960, h / 620), 0.55, 1.15);
    ctx.fillStyle = "#352e29";
    ctx.fillRect(w * 0.418, h * 0.548, w * 0.132, 4);
    drawBowedFigure(ctx, w * 0.495, h * 0.544, sc * 0.84, -1, false);
    drawBowedFigure(ctx, w * 0.532, h * 0.544, sc * 0.84, -1, true);

    var ux = w * 0.455, uy = h * 0.595, uw = w * 0.075;
    ctx.strokeStyle = "#6c7b8c";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(ux, uy);
    ctx.lineTo(ux + uw, uy);
    ctx.stroke();
    for (var u = 0; u < 3; u++) {
      var umX = ux + (u + 0.5) * (uw / 3);
      ctx.fillStyle = "#2b3644";
      ctx.beginPath();
      ctx.moveTo(umX, uy + 2);
      ctx.lineTo(umX - 4.5, uy + h * 0.055);
      ctx.lineTo(umX + 4.5, uy + h * 0.055);
      ctx.closePath();
      ctx.fill();
    }
  }

  function renderZincWineshopScene(ctx, w, h, phaseT) {
    var zx = w * 0.30, zy = h * 0.712, zw = w * 0.33, zh = h * 0.238;
    ctx.fillStyle = "#151b23";
    ctx.fillRect(zx, zy, zw, zh);

    ctx.strokeStyle = "rgba(86, 99, 115, 0.28)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(zx + 6, zy + zh * 0.42);
    ctx.quadraticCurveTo(zx + zw * 0.5, zy - zh * 0.05, zx + zw - 6, zy + zh * 0.42);
    ctx.stroke();

    var barY = zy + zh * 0.58;
    var sc = clamp(Math.min(w / 960, h / 620), 0.55, 1.15);
    var drinkers = [0.345, 0.425, 0.508, 0.585];
    for (var d = 0; d < drinkers.length; d++) {
      var sway = Math.sin(phaseT * 0.7 + d * 1.7) * 0.8;
      drawBowedFigure(ctx, w * drinkers[d] + sway, barY + 2, sc * 0.96, d % 2 === 0 ? 1 : -1, false);
    }

    ctx.fillStyle = PALETTE.zincCounterPewter;
    ctx.beginPath();
    ctx.moveTo(zx + 10, barY);
    ctx.lineTo(zx + zw - 8, barY);
    ctx.lineTo(zx + zw - 2, barY + 9);
    ctx.lineTo(zx + 4, barY + 9);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#2b3542";
    ctx.fillRect(zx + 6, barY + 9, zw - 10, zh * 0.34);

    for (var g = 0; g < 9; g++) {
      var gx = zx + 18 + g * ((zw - 36) / 8);
      var tipped = (g === 2 || g === 6);
      ctx.strokeStyle = "rgba(216, 226, 236, 0.62)";
      ctx.lineWidth = 1.1;
      if (tipped) {
        ctx.strokeRect(gx - 3, barY - 3.5, 6.5, 3.2);
      } else {
        ctx.beginPath();
        ctx.moveTo(gx - 2.6, barY - 8);
        ctx.lineTo(gx + 2.6, barY - 8);
        ctx.lineTo(gx + 1.4, barY - 3.5);
        ctx.lineTo(gx - 1.4, barY - 3.5);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(gx, barY - 3.5);
        ctx.lineTo(gx, barY - 0.5);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(57, 72, 90, 0.55)";
      ctx.beginPath();
      ctx.arc(gx + 2, barY + 4.2, 3.2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function renderQuarrelWindowsScene(ctx, w, h, phaseT) {
    var qx = w * 0.65, qy = h * 0.55, qw = w * 0.19, qh = h * 0.40;
    var cols = [0.675, 0.758];
    var rows = [0.585, 0.735];
    for (var r = 0; r < rows.length; r++) {
      for (var c = 0; c < cols.length; c++) {
        var wx = w * cols[c], wy = h * rows[r], ww = w * 0.052, wh = h * 0.105;
        ctx.fillStyle = r === 0 ? "rgba(201, 91, 60, 0.15)" : "#131820";
        ctx.fillRect(wx, wy, ww, wh);
        ctx.strokeStyle = PALETTE.zincCounterPewter;
        ctx.lineWidth = 1.4;
        ctx.strokeRect(wx, wy, ww, wh);
        ctx.fillStyle = "#2b3644";
        ctx.fillRect(wx - 5, wy, 5, wh);
        ctx.fillRect(wx + ww, wy, 5, wh);
        if (r === 0) {
          ctx.fillStyle = "#11161e";
          ctx.beginPath();
          ctx.arc(wx + ww * 0.32, wy + wh * 0.52, 4, 0, Math.PI * 2);
          ctx.arc(wx + ww * 0.70, wy + wh * 0.50, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(226, 154, 46, 0.55)";
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(wx + ww * 0.38, wy + wh * 0.45);
          ctx.lineTo(wx + ww * 0.52, wy + wh * 0.32);
          ctx.lineTo(wx + ww * 0.48, wy + wh * 0.56);
          ctx.lineTo(wx + ww * 0.64, wy + wh * 0.42);
          ctx.stroke();
        }
      }
    }

    for (var s = 0; s < 5; s++) {
      var u = ((phaseT * 0.55 + s * 0.21) % 1);
      var startX = w * (s % 2 === 0 ? 0.70 : 0.78);
      var startY = h * 0.66;
      var sx = startX + (s - 2) * 9 * u;
      var sy = startY + u * u * (h * 0.26);
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(u * 5.2 + s);
      ctx.fillStyle = PALETTE.parchmentVellum;
      ctx.strokeStyle = PALETTE.ragoutTerracotta;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(-4, -2);
      ctx.lineTo(4, -1);
      ctx.lineTo(1, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.fillStyle = "rgba(239, 227, 196, 0.55)";
    for (var k = 0; k < 8; k++) {
      ctx.fillRect(qx + 14 + k * ((qw - 28) / 7), qy + qh - 7 - (k % 2) * 2, 4, 2.2);
    }
  }

  var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  function hitTestGrimZoneImpl(nx, ny) {
    if (!Number.isFinite(nx) || !Number.isFinite(ny) || nx < 0 || nx > 1 || ny < 0 || ny > 1) {
      return null;
    }
    for (var i = 0; i < GRIM_ZONES.length; i++) {
      if (pointInRect(nx, ny, GRIM_ZONES[i].rectNorm)) {
        return GRIM_ZONES[i];
      }
    }
    for (var s = 0; s < SHELL_SUB_RECTS.length; s++) {
      if (pointInRect(nx, ny, SHELL_SUB_RECTS[s])) {
        return GRIM_ZONES[7];
      }
    }
    return null;
  }

  function renderRainAndZoneOverlay(ctx, w, h, phaseT, state) {
    ctx.save();
    ctx.strokeStyle = "rgba(133, 150, 170, 0.19)";
    ctx.lineWidth = 1;
    for (var i = 0; i < 72; i++) {
      var seedX = ((i * 137.5) % 1000) / 1000;
      var seedY = ((i * 293.7) % 1000) / 1000;
      var fall = (seedY + phaseT * (0.36 + (i % 5) * 0.04)) % 1.08 - 0.04;
      var rx = (seedX * 1.08 - fall * 0.11 + 1.08) % 1.04 * w;
      var ry = fall * h;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 4.5, ry + 15);
      ctx.stroke();
    }

    ctx.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.textBaseline = "top";
    for (var z = 0; z < GRIM_ZONES.length; z++) {
      var zr = GRIM_ZONES[z].rectNorm;
      ctx.fillStyle = "rgba(133, 150, 170, 0.44)";
      ctx.fillText(ROMAN[z], w * zr.x + 5, h * zr.y + 4);
    }

    var activeId = state && state.hoveredGrimId ? state.hoveredGrimId : null;
    if (!activeId && state && state.pointerNorm && state.hoveredGrimId === undefined) {
      var hit = hitTestGrimZoneImpl(state.pointerNorm.x, state.pointerNorm.y);
      if (hit) activeId = hit.id;
    }
    if (activeId) {
      for (var k = 0; k < GRIM_ZONES.length; k++) {
        if (GRIM_ZONES[k].id === activeId) {
          var hr = GRIM_ZONES[k].rectNorm;
          var hx = w * hr.x, hy = h * hr.y, hw = w * hr.w, hh = h * hr.h;
          ctx.fillStyle = "rgba(57, 72, 90, 0.14)";
          ctx.fillRect(hx, hy, hw, hh);
          ctx.strokeStyle = "rgba(239, 227, 196, 0.62)";
          ctx.lineWidth = 1.6;
          if (ctx.setLineDash) ctx.setLineDash([5, 4]);
          ctx.strokeRect(hx + 1, hy + 1, hw - 2, hh - 2);
          if (ctx.setLineDash) ctx.setLineDash([]);

          var tagW = Math.min(hw - 8, Math.max(118, GRIM_ZONES[k].title.length * 6.5 + 16));
          traceRoundRect(ctx, hx + 5, hy + 5, tagW, 19, 4);
          ctx.fillStyle = "rgba(19, 23, 29, 0.88)";
          ctx.fill();
          ctx.strokeStyle = "rgba(239, 227, 196, 0.48)";
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.fillStyle = PALETTE.parchmentVellum;
          ctx.fillText(GRIM_ZONES[k].title, hx + 11, hy + 9);
          break;
        }
      }
    }
    ctx.restore();
  }

  function createGrimAudioEngine(initialMuted) {
    var muted = typeof initialMuted === "boolean" ? initialMuted : true;
    var audioCtx = null;
    var masterGain = null;
    var pulseTimer = null;

    function ensureGraph() {
      if (audioCtx) return audioCtx;
      var Ctor = root && (root.AudioContext || root.webkitAudioContext);
      if (!Ctor) return null;
      try {
        audioCtx = new Ctor();
        masterGain = audioCtx.createGain();
        masterGain.gain.value = muted ? 0 : 0.13;
        masterGain.connect(audioCtx.destination);

        var bufLen = Math.floor(audioCtx.sampleRate * 2.0);
        var noiseBuf = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
        var chan = noiseBuf.getChannelData(0);
        var last = 0;
        for (var i = 0; i < bufLen; i++) {
          var white = Math.random() * 2 - 1;
          last = (last + 0.045 * white) / 1.045;
          chan[i] = last * 1.9;
        }
        var rainSrc = audioCtx.createBufferSource();
        rainSrc.buffer = noiseBuf;
        rainSrc.loop = true;
        var rainFilter = audioCtx.createBiquadFilter();
        rainFilter.type = "bandpass";
        rainFilter.frequency.value = 880;
        rainFilter.Q.value = 0.75;
        var rainGain = audioCtx.createGain();
        rainGain.gain.value = 0.34;
        rainSrc.connect(rainFilter);
        rainFilter.connect(rainGain);
        rainGain.connect(masterGain);
        rainSrc.start();

        var droneFilter = audioCtx.createBiquadFilter();
        droneFilter.type = "lowpass";
        droneFilter.frequency.value = 185;
        var droneGain = audioCtx.createGain();
        droneGain.gain.value = 0.22;
        droneFilter.connect(droneGain);
        droneGain.connect(masterGain);
        var freqs = [73.42, 110.0];
        for (var f = 0; f < freqs.length; f++) {
          var osc = audioCtx.createOscillator();
          osc.type = f === 0 ? "triangle" : "sine";
          osc.frequency.value = freqs[f];
          osc.connect(droneFilter);
          osc.start();
        }
      } catch (_err) {
        audioCtx = null;
      }
      return audioCtx;
    }

    function triggerPulse() {
      if (muted) return false;
      var ctx = ensureGraph();
      if (!ctx || !masterGain) return false;
      try {
        if (ctx.state === "suspended" && ctx.resume) ctx.resume().catch(function () {});
        var now = ctx.currentTime;
        var osc = ctx.createOscillator();
        var g = ctx.createGain();
        var flt = ctx.createBiquadFilter();
        flt.type = "lowpass";
        flt.frequency.setValueAtTime(240, now);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(98, now);
        osc.frequency.exponentialRampToValueAtTime(46, now + 0.22);
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.28, now + 0.015);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(flt);
        flt.connect(g);
        g.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.30);
        return true;
      } catch (_err2) {
        return false;
      }
    }

    function syncTimer() {
      if (pulseTimer) {
        clearInterval(pulseTimer);
        pulseTimer = null;
      }
      if (!muted && audioCtx && typeof setInterval === "function") {
        pulseTimer = setInterval(function () {
          triggerPulse();
        }, 3200);
      }
    }

    return {
      isMuted: function () { return muted; },
      unlock: function () {
        var ctx = ensureGraph();
        if (ctx && ctx.state === "suspended" && ctx.resume) {
          ctx.resume().catch(function () {});
        }
        syncTimer();
        return Boolean(ctx);
      },
      setMuted: function (nextMuted) {
        muted = Boolean(nextMuted);
        if (!muted) {
          var ctx = ensureGraph();
          if (ctx && ctx.state === "suspended" && ctx.resume) {
            ctx.resume().catch(function () {});
          }
        }
        if (audioCtx && masterGain) {
          try {
            var now = audioCtx.currentTime;
            masterGain.gain.cancelScheduledValues(now);
            masterGain.gain.setTargetAtTime(muted ? 0 : 0.13, now, 0.08);
          } catch (_e) {
            masterGain.gain.value = muted ? 0 : 0.13;
          }
        }
        syncTimer();
        return muted;
      },
      triggerPulse: triggerPulse
    };
  }

  function create(options) {
    var opts = options || {};
    var audio = createGrimAudioEngine(typeof opts.muted === "boolean" ? opts.muted : true);

    function render(ctx, width, height, state) {
      if (!ctx || !(width > 0) || !(height > 0)) return;
      var st = state || {};
      var rawTime = Number.isFinite(st.timeSec) ? st.timeSec : 0;
      var phaseT = st.reducedMotion ? 1.85 : rawTime;

      ctx.save();
      ctx.globalAlpha = 1;
      renderSkyAndDistantRoofs(ctx, width, height, phaseT);
      renderCutawayStructure(ctx, width, height, phaseT);
      renderRiverRailingScene(ctx, width, height, phaseT);
      renderWringingStreetScene(ctx, width, height, phaseT);
      renderBadDreamGarretScene(ctx, width, height, phaseT);
      renderHammerWorkbenchScene(ctx, width, height, phaseT);
      renderAwryLedgersScene(ctx, width, height, phaseT);
      renderZincWineshopScene(ctx, width, height, phaseT);
      renderQuarrelWindowsScene(ctx, width, height, phaseT);
      renderRainAndZoneOverlay(ctx, width, height, phaseT, st);
      ctx.restore();
    }

    function getAnchorZones() {
      return ANCHOR_ZONES;
    }

    function getInvariants() {
      return {
        overtSadnessConstant: true,
        grimZonesActive: GRIM_ZONES.length,
        bentHeadsConcealGrimGaze: true
      };
    }

    return {
      PALETTE: PALETTE,
      GRIM_ZONES: GRIM_ZONES,
      ANCHOR_ZONES: ANCHOR_ZONES,
      getAnchorZones: getAnchorZones,
      render: render,
      hitTestGrimZone: hitTestGrimZoneImpl,
      setMuted: function (mutedBool) { return audio.setMuted(mutedBool); },
      isMuted: function () { return audio.isMuted(); },
      unlockAudio: function () { return audio.unlock(); },
      triggerAmbientPulse: function () { return audio.triggerPulse(); },
      getInvariants: getInvariants
    };
  }

  var api = Object.freeze({
    PALETTE: PALETTE,
    GRIM_ZONES: GRIM_ZONES,
    ANCHOR_ZONES: ANCHOR_ZONES,
    create: create
  });

  if (root) {
    root.RaissaUnhappyGrid = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
