(function (root) {
  "use strict";

  var SKY_PALETTE = {
    zenithNight: "#080d1a",
    zenithIndigo: "#12203a",
    celestialAura: "#f6ebd2",
    eggshellIvory: "#fbf6ea",
    potatoPeelOchre: "#d8a55b",
    umbrellaTeal: "#4d9ca8",
    oldSockRose: "#c97b84",
    candyFoilCyan: "#7fe3dc",
    candyFoilMagenta: "#e28ad4",
    tramTicketBuff: "#e8d39e",
    falseGoldPhantom: "#a9872c"
  };

  var CELESTIAL_STONES = [
    {
      id: "golden_mirage_projection",
      index: 1,
      label: "Imagined Solid-Gold & Diamond Heaven",
      realm: "mythic_projection",
      summary: "A stiff phantom wireframe of solid gold, silver locks, and diamond-cut gates projected upward by carat-hoarding citizens."
    },
    {
      id: "eggshell_cupolas",
      index: 4,
      label: "Eggshell Cupolas of the Zenith",
      realm: "celestial_zenith",
      summary: "Nine fragile, translucent eggshell domes veined with hairlines and glowing with weightless ivory radiance at the true zenith."
    },
    {
      id: "fluttering_potato_peels",
      index: 5,
      label: "Orbiting Potato Peels",
      realm: "celestial_zenith",
      summary: "Fourteen humble ochre potato parings spiraling freely in unhurried ellipses around the celestial body."
    },
    {
      id: "broken_umbrellas_and_socks",
      index: 6,
      label: "Broken Umbrellas & Old Socks",
      realm: "celestial_zenith",
      summary: "Wind-sprung spoked umbrellas and darned rose socks drifting lucidly where nothing hoarded weighs them down."
    },
    {
      id: "candy_wrappers_and_buttons",
      index: 7,
      label: "Candy Wrappings, Glass Bits & Popped Buttons",
      realm: "celestial_zenith",
      summary: "Twisted foil bonbon wrappers, faceted glass splinters, and loose four-hole buttons catching clear zenith starlight."
    },
    {
      id: "tram_ticket_callus_pavement",
      index: 8,
      label: "Tram-Ticket & Callus Pavements",
      realm: "celestial_zenith",
      summary: "High piazzas tessellated with punched buff tramway tickets, crescent fingernail-cuttings, and pared calluses."
    }
  ];

  var STONE_BY_ID = {};
  for (var sIdx = 0; sIdx < CELESTIAL_STONES.length; sIdx++) {
    STONE_BY_ID[CELESTIAL_STONES[sIdx].id] = CELESTIAL_STONES[sIdx];
  }

  var ORBITING_DETRITUS_COUNTS = {
    potatoPeels: 14,
    brokenUmbrellas: 8,
    oldSocks: 9,
    candyWrappings: 16,
    poppedButtonsAndGlass: 12,
    tramTickets: 24,
    fingernailCallusTiles: 18
  };

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hexToRgba(hex, alpha) {
    var clean = String(hex || "#ffffff").replace("#", "");
    var num = parseInt(clean, 16);
    var r = (num >> 16) & 255;
    var g = (num >> 8) & 255;
    var b = num & 255;
    return "rgba(" + r + "," + g + "," + b + "," + clamp(alpha, 0, 1).toFixed(3) + ")";
  }

  function createRng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function buildCatalog() {
    var rng = createRng(39072026);
    var stars = [];
    for (var i = 0; i < 68; i++) {
      stars.push({
        nx: 0.03 + rng() * 0.94,
        ny: 0.02 + rng() * 0.41,
        r: 0.6 + rng() * 1.45,
        twinkleOffset: rng() * Math.PI * 2,
        warm: rng() > 0.45
      });
    }

    var cupolas = [];
    for (var c = 0; c < 9; c++) {
      var u = (c - 4) / 4;
      cupolas.push({
        index: c,
        angle: -Math.PI * 0.5 + u * 1.16,
        widthScale: 0.28 - Math.abs(u) * 0.09 + (c % 2 === 0 ? 0.025 : 0),
        heightScale: 0.42 - Math.abs(u) * 0.14 + (c === 4 ? 0.09 : 0),
        crackSeed: rng() * Math.PI * 2
      });
    }

    var tramTickets = [];
    for (var tt = 0; tt < ORBITING_DETRITUS_COUNTS.tramTickets; tt++) {
      var ring = tt < 9 ? 0.34 : tt < 17 ? 0.62 : 0.84;
      var slotCount = tt < 9 ? 9 : tt < 17 ? 8 : 7;
      var localIdx = tt < 9 ? tt : tt < 17 ? tt - 9 : tt - 17;
      tramTickets.push({
        theta: (localIdx / slotCount) * Math.PI * 2 + ring * 0.7,
        radial: ring,
        tilt: (rng() - 0.5) * 0.45,
        punchSide: tt % 2 === 0 ? 1 : -1
      });
    }

    var callusTiles = [];
    for (var fc = 0; fc < ORBITING_DETRITUS_COUNTS.fingernailCallusTiles; fc++) {
      var band = fc < 8 ? 0.48 : 0.75;
      var cnt = fc < 8 ? 8 : 10;
      var idx = fc < 8 ? fc : fc - 8;
      callusTiles.push({
        theta: (idx / cnt) * Math.PI * 2 + 0.32,
        radial: band,
        rot: rng() * Math.PI * 2,
        isNail: fc % 2 === 0
      });
    }

    var orbiters = [];
    function addGroup(kind, stoneId, count, rxMul, ryMul, speed, tiltRad) {
      for (var k = 0; k < count; k++) {
        orbiters.push({
          kind: kind,
          stoneId: stoneId,
          phase0: (k / count) * Math.PI * 2 + rng() * 0.28,
          rxMul: rxMul + (rng() - 0.5) * 0.22,
          ryMul: ryMul + (rng() - 0.5) * 0.08,
          speed: speed * (0.86 + rng() * 0.28),
          tilt: tiltRad + (rng() - 0.5) * 0.14,
          spin0: rng() * Math.PI * 2,
          spinRate: (rng() - 0.5) * 0.9,
          sizeMul: 0.86 + rng() * 0.32,
          variant: k
        });
      }
    }

    addGroup("potato_peel", "fluttering_potato_peels", ORBITING_DETRITUS_COUNTS.potatoPeels, 1.58, 0.56, 0.26, -0.13);
    addGroup("broken_umbrella", "broken_umbrellas_and_socks", ORBITING_DETRITUS_COUNTS.brokenUmbrellas, 2.08, 0.68, -0.19, 0.15);
    addGroup("old_sock", "broken_umbrellas_and_socks", ORBITING_DETRITUS_COUNTS.oldSocks, 1.84, 0.62, 0.22, 0.08);
    addGroup("candy_wrapper", "candy_wrappers_and_buttons", ORBITING_DETRITUS_COUNTS.candyWrappings, 2.36, 0.74, 0.31, -0.09);
    addGroup("button_glass", "candy_wrappers_and_buttons", ORBITING_DETRITUS_COUNTS.poppedButtonsAndGlass, 1.36, 0.48, -0.34, 0.05);

    return { stars: stars, cupolas: cupolas, tramTickets: tramTickets, callusTiles: callusTiles, orbiters: orbiters };
  }

  function drawHighlightRing(ctx, r, color) {
    ctx.save();
    ctx.strokeStyle = hexToRgba(color || SKY_PALETTE.celestialAura, 0.92);
    ctx.lineWidth = 1.4;
    ctx.setLineDash([3, 2.5]);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawOrbiterGlyph(ctx, item, unit, lum, isHighlighted) {
    var alpha = clamp(0.32 + lum * 0.68, 0.25, 1);
    var s = unit * item.sizeMul;
    if (isHighlighted) {
      drawHighlightRing(ctx, s * 1.55, SKY_PALETTE.eggshellIvory);
    }

    if (item.kind === "potato_peel") {
      ctx.strokeStyle = hexToRgba(SKY_PALETTE.potatoPeelOchre, alpha);
      ctx.lineWidth = Math.max(2.1, s * 0.34);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-s * 0.95, -s * 0.35);
      ctx.bezierCurveTo(-s * 0.35, -s * 0.95, s * 0.25, s * 0.85, s * 0.95, s * 0.22);
      ctx.stroke();
      ctx.strokeStyle = hexToRgba("#f5e2b8", alpha * 0.88);
      ctx.lineWidth = Math.max(1.0, s * 0.14);
      ctx.beginPath();
      ctx.moveTo(-s * 0.82, -s * 0.24);
      ctx.bezierCurveTo(-s * 0.28, -s * 0.72, s * 0.22, s * 0.66, s * 0.82, s * 0.14);
      ctx.stroke();
    } else if (item.kind === "broken_umbrella") {
      ctx.strokeStyle = hexToRgba("#cdd7e0", alpha * 0.9);
      ctx.lineWidth = Math.max(1.1, s * 0.13);
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.75);
      ctx.lineTo(0, s * 0.72);
      ctx.arc(s * 0.18, s * 0.72, s * 0.18, Math.PI, 0, true);
      ctx.stroke();
      ctx.fillStyle = hexToRgba(SKY_PALETTE.umbrellaTeal, alpha * 0.86);
      ctx.beginPath();
      ctx.moveTo(-s * 0.95, -s * 0.05);
      ctx.quadraticCurveTo(-s * 0.42, -s * 0.85, 0, -s * 0.68);
      ctx.quadraticCurveTo(s * 0.48, -s * 0.92, s * 0.88, -s * 0.22);
      ctx.quadraticCurveTo(s * 0.42, -s * 0.36, 0, -s * 0.18);
      ctx.quadraticCurveTo(-s * 0.46, -s * 0.32, -s * 0.95, -s * 0.05);
      ctx.fill();
      ctx.strokeStyle = hexToRgba("#9ed8e0", alpha * 0.92);
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.68);
      ctx.lineTo(s * 1.12, -s * 0.46);
      ctx.moveTo(-s * 0.38, -s * 0.52);
      ctx.lineTo(-s * 1.06, -s * 0.34);
      ctx.stroke();
    } else if (item.kind === "old_sock") {
      ctx.fillStyle = hexToRgba(SKY_PALETTE.oldSockRose, alpha * 0.92);
      ctx.beginPath();
      ctx.moveTo(-s * 0.35, -s * 0.82);
      ctx.lineTo(s * 0.18, -s * 0.82);
      ctx.lineTo(s * 0.16, s * 0.08);
      ctx.quadraticCurveTo(s * 0.78, s * 0.16, s * 0.82, s * 0.48);
      ctx.quadraticCurveTo(s * 0.78, s * 0.78, s * 0.18, s * 0.74);
      ctx.lineTo(-s * 0.32, s * 0.56);
      ctx.quadraticCurveTo(-s * 0.48, s * 0.32, -s * 0.34, 0);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = hexToRgba(SKY_PALETTE.eggshellIvory, alpha * 0.78);
      ctx.beginPath();
      ctx.arc(-s * 0.24, s * 0.38, s * 0.2, 0, Math.PI * 2);
      ctx.arc(s * 0.64, s * 0.52, s * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(-s * 0.35, -s * 0.82, s * 0.53, s * 0.16);
    } else if (item.kind === "candy_wrapper") {
      var foil = item.variant % 2 === 0 ? SKY_PALETTE.candyFoilCyan : SKY_PALETTE.candyFoilMagenta;
      ctx.fillStyle = hexToRgba(foil, alpha * 0.9);
      ctx.beginPath();
      ctx.moveTo(-s * 0.95, -s * 0.44);
      ctx.lineTo(-s * 0.38, -s * 0.12);
      ctx.lineTo(-s * 0.95, s * 0.44);
      ctx.closePath();
      ctx.moveTo(s * 0.95, -s * 0.44);
      ctx.lineTo(s * 0.38, -s * 0.12);
      ctx.lineTo(s * 0.95, s * 0.44);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 0.44, s * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = hexToRgba("#ffffff", alpha * 0.72);
      ctx.lineWidth = 0.9;
      ctx.stroke();
    } else {
      if (item.variant % 2 === 0) {
        ctx.fillStyle = hexToRgba(SKY_PALETTE.eggshellIvory, alpha * 0.92);
        ctx.strokeStyle = hexToRgba(SKY_PALETTE.tramTicketBuff, alpha);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.58, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = hexToRgba(SKY_PALETTE.zenithIndigo, alpha);
        var ho = s * 0.2;
        ctx.fillRect(-ho - 0.8, -ho - 0.8, 1.6, 1.6);
        ctx.fillRect(ho - 0.8, -ho - 0.8, 1.6, 1.6);
        ctx.fillRect(-ho - 0.8, ho - 0.8, 1.6, 1.6);
        ctx.fillRect(ho - 0.8, ho - 0.8, 1.6, 1.6);
      } else {
        ctx.fillStyle = hexToRgba("#bfeef5", alpha * 0.84);
        ctx.strokeStyle = hexToRgba("#ffffff", alpha * 0.92);
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(-s * 0.62, -s * 0.18);
        ctx.lineTo(s * 0.14, -s * 0.68);
        ctx.lineTo(s * 0.68, s * 0.15);
        ctx.lineTo(-s * 0.18, s * 0.58);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  function drawPlanetAndCupolas(ctx, geom, catalog, state, halos) {
    var cx = geom.cx;
    var cy = geom.cy;
    var pr = geom.planetR;
    var lum = state.celestialLuminance;
    var hiPave = state.highlightedStoneId === "tram_ticket_callus_pavement";
    var hiCupola = state.highlightedStoneId === "eggshell_cupolas";

    for (var h = 0; h < halos.length; h++) {
      var halo = halos[h];
      var hr = pr * (1.12 + halo.progress * 0.85);
      ctx.strokeStyle = hexToRgba(SKY_PALETTE.celestialAura, (1 - halo.progress) * 0.58);
      ctx.lineWidth = 2.2 * (1 - halo.progress * 0.5);
      ctx.beginPath();
      ctx.arc(cx, cy - pr * 0.14, hr, Math.PI * 1.06, Math.PI * 1.94);
      ctx.stroke();
    }

    for (var c = 0; c < geom.cupolaNodes.length; c++) {
      var cup = geom.cupolaNodes[c];
      ctx.save();
      ctx.translate(cup.bx, cup.by);
      ctx.rotate(cup.angle + Math.PI * 0.5);
      var grad = ctx.createRadialGradient(0, -cup.h * 0.52, cup.w * 0.08, 0, -cup.h * 0.25, cup.h * 1.05);
      grad.addColorStop(0, hexToRgba(SKY_PALETTE.eggshellIvory, clamp(0.45 + lum * 0.52, 0.35, 0.98)));
      grad.addColorStop(0.7, hexToRgba(SKY_PALETTE.celestialAura, clamp(0.24 + lum * 0.44, 0.2, 0.82)));
      grad.addColorStop(1, hexToRgba(SKY_PALETTE.tramTicketBuff, 0.16 + lum * 0.22));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-cup.w * 0.5, 2);
      ctx.bezierCurveTo(-cup.w * 0.54, -cup.h * 0.72, -cup.w * 0.18, -cup.h, 0, -cup.h * 1.06);
      ctx.bezierCurveTo(cup.w * 0.18, -cup.h, cup.w * 0.54, -cup.h * 0.72, cup.w * 0.5, 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = hexToRgba(SKY_PALETTE.eggshellIvory, 0.42 + lum * 0.5);
      ctx.lineWidth = hiCupola ? 1.8 : 1.05;
      ctx.stroke();
      ctx.strokeStyle = hexToRgba("#c6b697", 0.32 + lum * 0.28);
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(-cup.w * 0.14, -cup.h * 0.82);
      ctx.lineTo(-cup.w * 0.03, -cup.h * 0.52);
      ctx.lineTo(cup.w * 0.11, -cup.h * 0.36);
      ctx.stroke();
      if (hiCupola) {
        drawHighlightRing(ctx, Math.max(cup.w, cup.h) * 0.65, SKY_PALETTE.eggshellIvory);
      }
      ctx.restore();
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, pr, 0, Math.PI * 2);
    var pGrad = ctx.createRadialGradient(cx - pr * 0.22, cy - pr * 0.28, pr * 0.08, cx, cy, pr);
    pGrad.addColorStop(0, hexToRgba(SKY_PALETTE.eggshellIvory, 0.34 + lum * 0.52));
    pGrad.addColorStop(0.62, hexToRgba(SKY_PALETTE.tramTicketBuff, 0.26 + lum * 0.42));
    pGrad.addColorStop(1, hexToRgba("#2c3852", 0.68));
    ctx.fillStyle = pGrad;
    ctx.fill();
    ctx.clip();

    for (var tt = 0; tt < catalog.tramTickets.length; tt++) {
      var tk = catalog.tramTickets[tt];
      var ang = tk.theta + geom.spinSlow;
      var tx = cx + Math.cos(ang) * pr * tk.radial;
      var ty = cy + Math.sin(ang) * pr * tk.radial * 0.84;
      var tw = Math.max(7, pr * 0.2);
      var th = tw * 0.54;
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(ang + tk.tilt);
      ctx.fillStyle = hexToRgba(SKY_PALETTE.tramTicketBuff, 0.42 + lum * 0.5);
      ctx.fillRect(-tw * 0.5, -th * 0.5, tw, th);
      ctx.strokeStyle = hexToRgba("#8e7444", 0.45 + lum * 0.35);
      ctx.lineWidth = 0.7;
      ctx.strokeRect(-tw * 0.5, -th * 0.5, tw, th);
      ctx.fillStyle = SKY_PALETTE.zenithIndigo;
      ctx.beginPath();
      ctx.arc(tk.punchSide * tw * 0.34, 0, Math.max(1.1, th * 0.18), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    for (var fc = 0; fc < catalog.callusTiles.length; fc++) {
      var ct = catalog.callusTiles[fc];
      var cAng = ct.theta - geom.spinSlow * 0.7;
      var fx = cx + Math.cos(cAng) * pr * ct.radial;
      var fy = cy + Math.sin(cAng) * pr * ct.radial * 0.84;
      var cr = Math.max(3.5, pr * 0.085);
      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(ct.rot + cAng);
      ctx.strokeStyle = hexToRgba(SKY_PALETTE.eggshellIvory, 0.45 + lum * 0.48);
      ctx.lineWidth = ct.isNail ? 1.5 : 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, cr, -0.85, 0.85);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    ctx.strokeStyle = hexToRgba(hiPave ? SKY_PALETTE.eggshellIvory : SKY_PALETTE.celestialAura, hiPave ? 0.95 : 0.32 + lum * 0.48);
    ctx.lineWidth = hiPave ? 2.2 : 1.2;
    ctx.beginPath();
    ctx.arc(cx, cy, pr, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawGoldenMirage(ctx, geom, state) {
    var inMythic = state.cosmologyLens === "mythic_belief";
    var hiMirage = state.highlightedStoneId === "golden_mirage_projection";
    var mirageFactor = inMythic ? clamp(1 - state.releaseLevel / 0.45, 0, 1) : 0;
    if (mirageFactor <= 0.01 && !hiMirage) return;

    var alpha = hiMirage ? Math.max(0.55, mirageFactor * 0.92) : mirageFactor * 0.88;
    var split = (1 - mirageFactor) * geom.planetR * 1.45;
    var r = geom.planetR * 1.28;

    ctx.save();
    if (mirageFactor > 0.05) {
      ctx.fillStyle = hexToRgba(SKY_PALETTE.zenithNight, mirageFactor * 0.56);
      ctx.beginPath();
      ctx.arc(geom.cx, geom.cy, geom.planetR * 1.62, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var side = -1; side <= 1; side += 2) {
      ctx.save();
      ctx.translate(geom.cx + side * split, geom.cy);
      ctx.beginPath();
      if (side < 0) {
        ctx.rect(-r * 2.2, -r * 1.8, r * 2.2, r * 3.6);
      } else {
        ctx.rect(0, -r * 1.8, r * 2.2, r * 3.6);
      }
      ctx.clip();

      ctx.strokeStyle = hexToRgba(SKY_PALETTE.falseGoldPhantom, alpha);
      ctx.lineWidth = hiMirage ? 2.1 : 1.5;
      ctx.beginPath();
      for (var v = 0; v <= 8; v++) {
        var oa = (v / 8) * Math.PI * 2 - Math.PI * 0.125;
        var ox = Math.cos(oa) * r;
        var oy = Math.sin(oa) * r * 0.92;
        if (v === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
      }
      ctx.stroke();

      ctx.strokeStyle = hexToRgba("#dcebf7", alpha * 0.84);
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(0, -r * 1.16);
      ctx.lineTo(r * 0.72, 0);
      ctx.lineTo(0, r * 1.16);
      ctx.lineTo(-r * 0.72, 0);
      ctx.closePath();
      ctx.stroke();

      ctx.strokeStyle = hexToRgba(SKY_PALETTE.falseGoldPhantom, alpha * 0.75);
      ctx.strokeRect(-r * 0.34, -r * 0.42, r * 0.68, r * 0.84);
      ctx.beginPath();
      ctx.arc(side * r * 0.22, 0, r * 0.09, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function createCelestialDetritus(opts) {
    var cfg = opts || {};
    var width = Math.max(240, Number(cfg.width) || 1280);
    var height = Math.max(240, Number(cfg.height) || 800);
    var reducedMotion = Boolean(cfg.reducedMotion);
    var soundEnabled = false;
    var audioCtx = null;

    var avariceIndex = 0.68;
    var releaseLevel = 0;
    var ascendedBoost = 0;
    var cosmologyLens = "mythic_belief";
    var highlightedStoneId = null;
    var orbitPhase = 0;
    var ascendedCount = 0;
    var shimmerHalos = [];
    var ascendingMotes = [];
    var catalog = buildCatalog();

    var totalDetritusBodies =
      ORBITING_DETRITUS_COUNTS.potatoPeels +
      ORBITING_DETRITUS_COUNTS.brokenUmbrellas +
      ORBITING_DETRITUS_COUNTS.oldSocks +
      ORBITING_DETRITUS_COUNTS.candyWrappings +
      ORBITING_DETRITUS_COUNTS.poppedButtonsAndGlass +
      ORBITING_DETRITUS_COUNTS.tramTickets +
      ORBITING_DETRITUS_COUNTS.fingernailCallusTiles;

    function computeStateFields() {
      var touches = releaseLevel >= 0.45 && avariceIndex <= 0.35;
      var baseLum = touches
        ? 0.72 + releaseLevel * 0.24 + ascendedBoost * 0.06
        : 0.16 + (1 - avariceIndex) * 0.25;
      if (ascendedBoost > 0.2) {
        baseLum = Math.max(baseLum, 0.92 + ascendedBoost * 0.06);
      }
      var lum = Number(clamp(baseLum, 0.15, 1.0).toFixed(3));
      return { touches: touches, lum: lum };
    }

    function getState() {
      var m = computeStateFields();
      return {
        celestialBuiltOfDiscardedDetritus: true,
        celestialMadeOfSolidGold: false,
        earthTouchesZenith: m.touches,
        celestialLuminance: m.lum,
        avariceIndex: Number(avariceIndex.toFixed(3)),
        releaseLevel: Number(releaseLevel.toFixed(3)),
        cosmologyLens: cosmologyLens,
        eggshellCupolaCount: 9,
        orbitingDetritusCounts: {
          potatoPeels: ORBITING_DETRITUS_COUNTS.potatoPeels,
          brokenUmbrellas: ORBITING_DETRITUS_COUNTS.brokenUmbrellas,
          oldSocks: ORBITING_DETRITUS_COUNTS.oldSocks,
          candyWrappings: ORBITING_DETRITUS_COUNTS.candyWrappings,
          poppedButtonsAndGlass: ORBITING_DETRITUS_COUNTS.poppedButtonsAndGlass,
          tramTickets: ORBITING_DETRITUS_COUNTS.tramTickets,
          fingernailCallusTiles: ORBITING_DETRITUS_COUNTS.fingernailCallusTiles
        },
        totalDetritusBodies: totalDetritusBodies,
        ascendedPacketsAbsorbed: ascendedCount,
        highlightedStoneId: highlightedStoneId,
        reducedMotion: reducedMotion,
        soundEnabled: soundEnabled
      };
    }

    function computeGeometry() {
      var cx = width * 0.5;
      var cy = height * 0.22;
      var planetR = clamp(Math.min(width * 0.112, height * 0.106), 30, 92);
      var unit = clamp(planetR * 0.13, 4.5, 11.2);
      var cupolaNodes = [];
      for (var c = 0; c < catalog.cupolas.length; c++) {
        var cd = catalog.cupolas[c];
        var bx = cx + Math.cos(cd.angle) * (planetR * 0.94);
        var by = cy + Math.sin(cd.angle) * (planetR * 0.94);
        var cw = planetR * cd.widthScale;
        var ch = planetR * cd.heightScale;
        cupolaNodes.push({
          bx: bx,
          by: by,
          mx: bx + Math.cos(cd.angle) * ch * 0.52,
          my: by + Math.sin(cd.angle) * ch * 0.52,
          w: cw,
          h: ch,
          angle: cd.angle
        });
      }
      var maxRx = Math.min(width * 0.44, planetR * 2.55);
      var orbiterNodes = [];
      for (var i = 0; i < catalog.orbiters.length; i++) {
        var ob = catalog.orbiters[i];
        var ang = ob.phase0 + orbitPhase * ob.speed;
        var rx = Math.min(maxRx, planetR * ob.rxMul);
        var ry = planetR * ob.ryMul;
        var lx = Math.cos(ang) * rx;
        var ly = Math.sin(ang) * ry;
        var ct = Math.cos(ob.tilt);
        var st = Math.sin(ob.tilt);
        var ox = cx + lx * ct - ly * st;
        var oy = clamp(cy + lx * st + ly * ct, height * 0.025, height * 0.432);
        orbiterNodes.push({
          x: ox,
          y: oy,
          z: Math.sin(ang),
          rot: ob.spin0 + orbitPhase * ob.spinRate,
          item: ob
        });
      }
      return { cx: cx, cy: cy, planetR: planetR, unit: unit, spinSlow: orbitPhase * 0.09, cupolaNodes: cupolaNodes, orbiterNodes: orbiterNodes };
    }

    function playZenithChime(intensity) {
      if (!soundEnabled) return false;
      try {
        var Ctor = root.AudioContext || root.webkitAudioContext;
        if (!Ctor) return false;
        if (!audioCtx) audioCtx = new Ctor();
        if (audioCtx.state === "suspended" && typeof audioCtx.resume === "function") audioCtx.resume();
        var now = audioCtx.currentTime;
        var freqs = [1046.5, 1318.5, 1568.0, 1975.5, 2637.0];
        var vol = clamp(Number(intensity) || 0.85, 0.15, 1) * 0.055;
        for (var i = 0; i < freqs.length; i++) {
          var osc = audioCtx.createOscillator();
          var gain = audioCtx.createGain();
          osc.type = i % 2 === 0 ? "sine" : "triangle";
          osc.frequency.setValueAtTime(freqs[i], now + i * 0.032);
          gain.gain.setValueAtTime(0.0001, now + i * 0.032);
          gain.gain.exponentialRampToValueAtTime(vol / (1 + i * 0.22), now + i * 0.032 + 0.014);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.032 + 0.78);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.032);
          osc.stop(now + i * 0.032 + 0.82);
        }
        return true;
      } catch (_err) {
        return false;
      }
    }

    function syncFromTerrestrial(payload) {
      var p = payload || {};
      if (typeof p.avariceIndex === "number" && !isNaN(p.avariceIndex)) {
        avariceIndex = clamp(p.avariceIndex, 0, 1);
      }
      var rp = typeof p.releasePulse === "number" && !isNaN(p.releasePulse) ? clamp(p.releasePulse, 0, 1) : 0;
      if (avariceIndex <= 0.35) {
        var generousFloor = clamp(((0.36 - avariceIndex) / 0.28) * 0.94, 0.46, 0.95);
        releaseLevel = clamp(Math.max(rp, generousFloor), 0, 1);
      } else {
        releaseLevel = clamp(rp * (1 - avariceIndex), 0, 0.38);
        if (rp <= 0.05) {
          ascendedBoost = 0;
          shimmerHalos = [];
        }
      }
      return getState();
    }

    function injectAscendedDetritus(packets) {
      var list = Array.isArray(packets) && packets.length > 0 ? packets : [{ nx: 0.36 }, { nx: 0.5 }, { nx: 0.64 }];
      ascendedCount += list.length;
      ascendedBoost = 1.0;
      if (avariceIndex <= 0.35) releaseLevel = Math.max(releaseLevel, 0.94);
      shimmerHalos = [{ progress: 0.02 }, { progress: 0.24 }, { progress: 0.46 }];
      for (var i = 0; i < Math.min(18, list.length); i++) {
        var pk = list[i] || {};
        ascendingMotes.push({
          nx: typeof pk.nx === "number" ? clamp(pk.nx, 0.12, 0.88) : 0.3 + (i % 5) * 0.1,
          progress: (i % 4) * 0.12
        });
      }
      if (soundEnabled) playZenithChime(0.92);
      return getState();
    }

    function step(dtSec) {
      var dt = clamp(Number(dtSec) || 1 / 60, 0, 0.1);
      if (avariceIndex > 0.35 && ascendedBoost > 0) {
        ascendedBoost = Math.max(0, ascendedBoost - dt * 0.22);
      }
      if (reducedMotion) return getState();
      orbitPhase += dt;
      for (var h = shimmerHalos.length - 1; h >= 0; h--) {
        shimmerHalos[h].progress += dt * 0.48;
        if (shimmerHalos[h].progress >= 1) shimmerHalos.splice(h, 1);
      }
      for (var m = ascendingMotes.length - 1; m >= 0; m--) {
        ascendingMotes[m].progress += dt * 0.65;
        if (ascendingMotes[m].progress >= 1) ascendingMotes.splice(m, 1);
      }
      return getState();
    }

    function render(ctx) {
      if (!ctx) return;
      var st = getState();
      var geom = computeGeometry();
      var bandH = height * 0.455;
      var lum = st.celestialLuminance;

      ctx.save();
      var skyGrad = ctx.createLinearGradient(0, 0, 0, bandH);
      skyGrad.addColorStop(0, SKY_PALETTE.zenithNight);
      skyGrad.addColorStop(0.76, SKY_PALETTE.zenithIndigo);
      skyGrad.addColorStop(1, hexToRgba(SKY_PALETTE.zenithIndigo, 0.94));
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, bandH);

      var auraR = geom.planetR * (2.1 + lum * 1.45);
      var auraGrad = ctx.createRadialGradient(geom.cx, geom.cy, geom.planetR * 0.25, geom.cx, geom.cy, auraR);
      auraGrad.addColorStop(0, hexToRgba(SKY_PALETTE.celestialAura, 0.08 + lum * 0.36));
      auraGrad.addColorStop(0.55, hexToRgba(SKY_PALETTE.tramTicketBuff, 0.03 + lum * 0.14));
      auraGrad.addColorStop(1, hexToRgba(SKY_PALETTE.zenithNight, 0));
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, width, bandH);

      for (var s = 0; s < catalog.stars.length; s++) {
        var star = catalog.stars[s];
        var tw = reducedMotion ? 0.72 : 0.45 + 0.55 * Math.sin(orbitPhase * 1.7 + star.twinkleOffset);
        ctx.fillStyle = hexToRgba(star.warm ? SKY_PALETTE.eggshellIvory : SKY_PALETTE.candyFoilCyan, (0.24 + lum * 0.56) * tw);
        ctx.beginPath();
        ctx.arc(star.nx * width, star.ny * height, star.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (st.earthTouchesZenith) {
        for (var rIdx = -2; rIdx <= 2; rIdx++) {
          var rx0 = geom.cx + rIdx * geom.planetR * 0.52;
          var rayGrad = ctx.createLinearGradient(rx0, height * 0.45, geom.cx + rIdx * geom.planetR * 0.2, geom.cy + geom.planetR * 0.65);
          rayGrad.addColorStop(0, hexToRgba(SKY_PALETTE.celestialAura, 0.04));
          rayGrad.addColorStop(0.5, hexToRgba(SKY_PALETTE.celestialAura, 0.22 * lum));
          rayGrad.addColorStop(1, hexToRgba(SKY_PALETTE.eggshellIvory, 0));
          ctx.strokeStyle = rayGrad;
          ctx.lineWidth = Math.max(1.5, geom.planetR * 0.09);
          ctx.beginPath();
          ctx.moveTo(rx0, height * 0.45);
          ctx.lineTo(geom.cx + rIdx * geom.planetR * 0.18, geom.cy + geom.planetR * 0.6);
          ctx.stroke();
        }
      }

      for (var am = 0; am < ascendingMotes.length; am++) {
        var mote = ascendingMotes[am];
        var mx = lerp(mote.nx * width, geom.cx, mote.progress * 0.65);
        var my = lerp(height * 0.445, geom.cy + geom.planetR * 0.3, mote.progress);
        ctx.fillStyle = hexToRgba(SKY_PALETTE.eggshellIvory, (1 - mote.progress) * 0.85);
        ctx.beginPath();
        ctx.arc(mx, my, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      for (var pass = 0; pass < 2; pass++) {
        if (pass === 1) {
          drawPlanetAndCupolas(ctx, geom, catalog, st, shimmerHalos);
        }
        for (var o = 0; o < geom.orbiterNodes.length; o++) {
          var node = geom.orbiterNodes[o];
          if ((pass === 0 && node.z >= 0) || (pass === 1 && node.z < 0)) continue;
          ctx.save();
          ctx.translate(node.x, node.y);
          ctx.rotate(node.rot);
          drawOrbiterGlyph(ctx, node.item, geom.unit, lum, st.highlightedStoneId === node.item.stoneId);
          ctx.restore();
        }
      }

      drawGoldenMirage(ctx, geom, st);
      ctx.restore();
    }

    function makeHitResult(stoneId) {
      var st = STONE_BY_ID[stoneId];
      if (!st) return null;
      return { stoneId: st.id, label: st.label, realm: st.realm, summary: st.summary };
    }

    function inspectAt(x, y) {
      if (typeof x !== "number" || typeof y !== "number" || y > height * 0.47 || y < 0) return null;
      var geom = computeGeometry();
      var bestId = null;
      var bestDist = 34.001;

      for (var c = 0; c < geom.cupolaNodes.length; c++) {
        var cup = geom.cupolaNodes[c];
        var dc = Math.hypot(x - cup.mx, y - cup.my);
        if (dc <= 34 && dc < bestDist) {
          bestDist = dc;
          bestId = "eggshell_cupolas";
        }
      }

      for (var o = 0; o < geom.orbiterNodes.length; o++) {
        var ob = geom.orbiterNodes[o];
        var doDist = Math.hypot(x - ob.x, y - ob.y);
        if (doDist <= 34 && doDist < bestDist) {
          bestDist = doDist;
          bestId = ob.item.stoneId;
        }
      }

      if (cosmologyLens === "mythic_belief" && releaseLevel < 0.45) {
        var mr = geom.planetR * 1.28;
        for (var v = 0; v < 8; v++) {
          var va = (v / 8) * Math.PI * 2 - Math.PI * 0.125;
          var vx = geom.cx + Math.cos(va) * mr;
          var vy = geom.cy + Math.sin(va) * mr * 0.92;
          var dv = Math.hypot(x - vx, y - vy);
          if (dv <= 34 && dv < bestDist) {
            bestDist = dv;
            bestId = "golden_mirage_projection";
          }
        }
      }

      var dp = Math.hypot(x - geom.cx, y - geom.cy);
      if (dp <= Math.max(34, geom.planetR * 0.92) && (bestId === null || dp < bestDist * 0.7)) {
        bestId = "tram_ticket_callus_pavement";
      }

      return bestId ? makeHitResult(bestId) : null;
    }

    function getStoneAnchors() {
      var geom = computeGeometry();
      return {
        golden_mirage_projection: { x: geom.cx + geom.planetR * 1.18, y: geom.cy },
        eggshell_cupolas: { x: geom.cupolaNodes[4].mx, y: geom.cupolaNodes[4].my },
        fluttering_potato_peels: { x: geom.orbiterNodes[0].x, y: geom.orbiterNodes[0].y },
        broken_umbrellas_and_socks: { x: geom.orbiterNodes[14].x, y: geom.orbiterNodes[14].y },
        candy_wrappers_and_buttons: { x: geom.orbiterNodes[31].x, y: geom.orbiterNodes[31].y },
        tram_ticket_callus_pavement: { x: geom.cx, y: geom.cy }
      };
    }

    function setViewport(w, h) {
      if (typeof w === "number" && w > 0) width = w;
      if (typeof h === "number" && h > 0) height = h;
      return getState();
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      return getState();
    }

    function setCosmologyLens(lens) {
      cosmologyLens = lens === "true_cosmology" ? "true_cosmology" : "mythic_belief";
      return getState();
    }

    function toggleCosmologyLens() {
      return setCosmologyLens(cosmologyLens === "mythic_belief" ? "true_cosmology" : "mythic_belief");
    }

    function setAvariceIndex(val) {
      return syncFromTerrestrial({ avariceIndex: val, releasePulse: val <= 0.35 ? 0.85 : 0 });
    }

    function triggerGenerousRelease(intensity) {
      var amt = clamp(Number(intensity) || 1.0, 0.45, 1.0);
      syncFromTerrestrial({ avariceIndex: 0.08, releasePulse: amt });
      return injectAscendedDetritus([{ nx: 0.35 }, { nx: 0.5 }, { nx: 0.65 }]);
    }

    function highlightStone(stoneId) {
      highlightedStoneId = stoneId ? String(stoneId) : null;
      return getState();
    }

    function setSoundEnabled(flag) {
      soundEnabled = Boolean(flag);
      return getState();
    }

    function reset() {
      avariceIndex = 0.68;
      releaseLevel = 0;
      ascendedBoost = 0;
      cosmologyLens = "mythic_belief";
      highlightedStoneId = null;
      orbitPhase = 0;
      ascendedCount = 0;
      shimmerHalos = [];
      ascendingMotes = [];
      return getState();
    }

    return {
      getState: getState,
      setViewport: setViewport,
      resize: setViewport,
      setReducedMotion: setReducedMotion,
      setCosmologyLens: setCosmologyLens,
      toggleCosmologyLens: toggleCosmologyLens,
      syncFromTerrestrial: syncFromTerrestrial,
      setAvariceIndex: setAvariceIndex,
      triggerGenerousRelease: triggerGenerousRelease,
      injectAscendedDetritus: injectAscendedDetritus,
      highlightStone: highlightStone,
      step: step,
      render: render,
      inspectAt: inspectAt,
      getStoneAnchors: getStoneAnchors,
      setSoundEnabled: setSoundEnabled,
      playZenithChime: playZenithChime,
      reset: reset
    };
  }

  var api = {
    SKY_PALETTE: SKY_PALETTE,
    CELESTIAL_STONES: CELESTIAL_STONES,
    createCelestialDetritus: createCelestialDetritus
  };

  root.BeershebaCelestialDetritus = api;
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
