/* City 11: Maurilia — Provincial Postcards & Retroactive-Grace Optical Layer */
if (typeof window === "undefined") {
  globalThis.window = globalThis;
}

window.MauriliaPostcards = (function () {
  "use strict";

  var PALETTE = {
    postcardBristol: "#efe4cd",
    postcardAgedEdge: "#c9b089",
    collodionSepia: "#6e5036",
    umberInk: "#3a2819",
    parasolLaceIvory: "#faf5e8",
    retroactiveGraceGilt: "#d8a24a",
    stampMagenta: "#944654",
    dreary1906Mud: "#7b7468",
    dreary1906DeepMud: "#59534a",
    dreary1906Glare: "#b8b2a6",
    dreary1906Haze: "#9d9689",
    mahoganyDark: "#2b160c",
    mahoganyWarm: "#59301c",
    brassHighlight: "#e3bd6b",
    brassMid: "#9c7638",
    brassShadow: "#4d3716"
  };

  var OBLIGATORY_REGRET_BAND = {
    min: 0.52,
    max: 0.78
  };

  var LOCI = [
    {
      index: 0,
      locus_index: 0,
      id: "hen_vs_bus_station",
      u: 0.22,
      v: 0.64,
      radiusNorm: 0.18,
      stoneId: "hen_in_square",
      title: "Speckled Hen in the Provincial Square",
      shortLabel: "I · Square & Speckled Hen",
      postmark: "MAURILIA · 14 IV 1906",
      serieCode: "CARTE POSTALE · SÉRIE I · No. 14",
      postcardNote: "Lime-washed shutters half-drawn over Piazza Vecchia; a barred Plymouth-rock hen pecks millet beside the limestone trough.",
      dreary1906Note: "Chalk dust, rutted cart mud, horse-flies over stagnant trough water, and a scrawny mud-splashed fowl.",
      metropolisCounterpart: "Gleaming cantilevered glass bus station"
    },
    {
      index: 1,
      locus_index: 1,
      id: "bandstand_vs_viaduct",
      u: 0.50,
      v: 0.44,
      radiusNorm: 0.19,
      stoneId: "wrought_iron_bandstand",
      title: "Filigree Wrought-Iron Bandstand",
      shortLabel: "II · Wrought-Iron Bandstand",
      postmark: "MAURILIA · 22 VI 1906",
      serieCode: "CARTE POSTALE · SÉRIE I · No. 27",
      postcardNote: "Octagonal zinc-domed municipal pavilion in filigree ironwork; empty brass music stands wait between potted oleanders.",
      dreary1906Note: "Blistered lead paint, rust-streaked iron ribs, and crooked music stands rattling in empty Sunday boredom.",
      metropolisCounterpart: "Sweeping prestressed concrete viaduct overpass"
    },
    {
      index: 2,
      locus_index: 2,
      id: "parasols_vs_munitions",
      u: 0.79,
      v: 0.56,
      radiusNorm: 0.18,
      stoneId: "two_ladies_white_parasols",
      title: "Two Young Ladies with White Lace Parasols",
      shortLabel: "III · Two Ladies & White Parasols",
      postmark: "MAURILIA · 09 VIII 1906",
      serieCode: "CARTE POSTALE · SÉRIE I · No. 41",
      postcardNote: "Beneath pollarded plane trees, two young ladies incline scalloped ivory eyelet-lace parasols along the dappled walk.",
      dreary1906Note: "Harsh noon glare on sparse dusty saplings; two squinting townswomen in stiff starch and mud-hemmed skirts.",
      metropolisCounterpart: "Munitions factory smokestacks & foundry gate"
    }
  ];

  function clamp(val, min, max) {
    return val < min ? min : val > max ? max : val;
  }

  function round4(val) {
    return Math.round(val * 10000) / 10000;
  }

  function drawEllipse(ctx, cx, cy, rx, ry, rot) {
    if (rx <= 0 || ry <= 0) return;
    if (typeof ctx.ellipse === "function") {
      ctx.ellipse(cx, cy, rx, ry, rot || 0, 0, Math.PI * 2);
    } else {
      ctx.save();
      ctx.translate(cx, cy);
      if (rot) ctx.rotate(rot);
      ctx.scale(1, ry / rx);
      ctx.arc(0, 0, rx, 0, Math.PI * 2);
      ctx.restore();
    }
  }

  function roundedRectPath(ctx, x, y, w, h, r) {
    var rr = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  var cachedHalftone = null;
  function getHalftonePattern(ctx) {
    if (cachedHalftone !== null) return cachedHalftone;
    if (typeof document === "undefined" || !document.createElement) {
      cachedHalftone = false;
      return false;
    }
    try {
      var tile = document.createElement("canvas");
      tile.width = 72;
      tile.height = 72;
      var tctx = tile.getContext("2d");
      if (!tctx || typeof ctx.createPattern !== "function") {
        cachedHalftone = false;
        return false;
      }
      tctx.save();
      tctx.translate(36, 36);
      tctx.rotate(0.26);
      for (var gy = -54; gy <= 54; gy += 6) {
        for (var gx = -54; gx <= 54; gx += 6) {
          var checker = ((gx + gy) % 12 === 0) ? 1.12 : 0.78;
          tctx.fillStyle = "rgba(58, 40, 25, 0.085)";
          tctx.beginPath();
          tctx.arc(gx, gy, checker, 0, Math.PI * 2);
          tctx.fill();
        }
      }
      tctx.restore();
      cachedHalftone = ctx.createPattern(tile, "repeat") || false;
    } catch (_e) {
      cachedHalftone = false;
    }
    return cachedHalftone;
  }

  function computeRetroactiveGrace(state) {
    var s = state || {};
    var realTime1906 = Boolean(s.realTime1906);
    var regret = clamp(typeof s.regretLevel === "number" && !isNaN(s.regretLevel) ? s.regretLevel : 0.65, 0, 1);
    var metroRaw = typeof s.metropolisContrast === "number" && !isNaN(s.metropolisContrast) ? s.metropolisContrast : 0.85;
    var contrastScale = Math.max(0.3, clamp(metroRaw, 0, 1));

    if (realTime1906) {
      return {
        retroactiveGrace: 0,
        inObligatoryBand: false,
        bandStatus: "UNMEDIATED_1906_NO_GRACE",
        citizenSatisfaction: 0.12,
        collodionWarmth: 0,
        halftonePitch: 0,
        drearyRealityFactor: 1.0,
        citizenVerdict: "Face-to-face with 1906 provincial Maurilia—without the gleaming metropolis for contrast—one saw nothing graceful at all: only chalk glare, cart mud, and stifling provincial tedium."
      };
    }

    if (regret >= OBLIGATORY_REGRET_BAND.min && regret <= OBLIGATORY_REGRET_BAND.max) {
      var centerDist = Math.abs(regret - 0.65) / 0.13;
      var arch = clamp(1 - centerDist * centerDist, 0, 1);
      var scaledGrace = clamp((0.90 + 0.08 * arch) * contrastScale, 0.75 * Math.min(1, contrastScale / 0.85), 0.98);
      if (metroRaw >= 0.80) scaledGrace = clamp(scaledGrace, 0.76, 0.98);
      return {
        retroactiveGrace: round4(scaledGrace),
        inObligatoryBand: true,
        bandStatus: "OBLIGATORY_CALIBRATED_REGRET",
        citizenSatisfaction: round4(0.89 + 0.09 * arch),
        collodionWarmth: round4(0.82 + 0.15 * arch * contrastScale),
        halftonePitch: round4(6.4 - 1.1 * arch),
        drearyRealityFactor: round4(0.12 - 0.08 * arch),
        citizenVerdict: "Within the obligatory rule: acknowledging metropolitan magnificence and prosperity while mourning a lost provincial grace visible only now in old postcards."
      };
    }

    if (regret < OBLIGATORY_REGRET_BAND.min) {
      var tLow = regret / OBLIGATORY_REGRET_BAND.min;
      var lowGrace = clamp(0.14 + 0.28 * tLow * contrastScale, 0.14, 0.42);
      var vulgar = regret < 0.30;
      return {
        retroactiveGrace: round4(lowGrace),
        inObligatoryBand: false,
        bandStatus: vulgar ? "VULGAR_METROPOLIS_PRAISE" : "INSUFFICIENT_POSTCARD_REGRET",
        citizenSatisfaction: round4(0.08 + 0.22 * tLow),
        collodionWarmth: round4(0.24 + 0.34 * tLow),
        halftonePitch: 8.2,
        drearyRealityFactor: round4(0.56 - 0.24 * tLow),
        citizenVerdict: vulgar
          ? "Hosts frown at unseemly praise for buses and viaducts alone: custom obliges the traveler to prefer the postcard town to the present."
          : "Your nod to the old cards falls short of Maurilian etiquette: warmer regret for the lost provincial square is required."
      };
    }

    var tHigh = (regret - OBLIGATORY_REGRET_BAND.max) / (1 - OBLIGATORY_REGRET_BAND.max);
    var highGrace = clamp((0.28 - 0.16 * tHigh) * Math.min(1, 0.65 + 0.35 * contrastScale), 0.10, 0.28);
    return {
      retroactiveGrace: round4(highGrace),
      inObligatoryBand: false,
      bandStatus: "NAIVE_UNCHANGED_FALLACY",
      citizenSatisfaction: round4(0.26 - 0.18 * tHigh),
      collodionWarmth: round4(0.34 - 0.20 * tHigh),
      halftonePitch: 9.0,
      drearyRealityFactor: round4(0.48 + 0.38 * tHigh),
      citizenVerdict: "You have transgressed the boundary of regret: had Maurilia remained unchanged as a dusty province, even less grace would appear—for that grace was born only through metropolitan contrast."
    };
  }

  function hitTestLocus(normX, normY) {
    if (typeof normX !== "number" || typeof normY !== "number") return -1;
    var bestIdx = -1;
    var bestDist = Infinity;
    for (var i = 0; i < LOCI.length; i++) {
      var loc = LOCI[i];
      var d = Math.hypot(normX - loc.u, normY - loc.v);
      if (d <= loc.radiusNorm && d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  function getLocus(indexOrId) {
    if (typeof indexOrId === "number") {
      return LOCI[clamp(Math.round(indexOrId), 0, LOCI.length - 1)];
    }
    for (var i = 0; i < LOCI.length; i++) {
      if (LOCI[i].id === indexOrId || LOCI[i].stoneId === indexOrId) return LOCI[i];
    }
    return LOCI[0];
  }

  function renderBackdropAndTownscape(ctx, w, h, s, grace, animTime) {
    var real1906 = Boolean(s.realTime1906);
    var activeIdx = clamp(Math.round(s.activeLocus || 0), 0, 2);
    var activeLoc = LOCI[activeIdx];
    var horizonY = h * 0.43;

    if (real1906) {
      var glareSky = ctx.createLinearGradient(0, 0, 0, horizonY);
      glareSky.addColorStop(0, PALETTE.dreary1906Glare);
      glareSky.addColorStop(0.7, "#ada79a");
      glareSky.addColorStop(1, PALETTE.dreary1906Haze);
      ctx.fillStyle = glareSky;
      ctx.fillRect(0, 0, w, horizonY + 4);

      var mudGround = ctx.createLinearGradient(0, horizonY, 0, h);
      mudGround.addColorStop(0, "#8c8578");
      mudGround.addColorStop(0.45, PALETTE.dreary1906Mud);
      mudGround.addColorStop(1, PALETTE.dreary1906DeepMud);
      ctx.fillStyle = mudGround;
      ctx.fillRect(0, horizonY, w, h - horizonY);
    } else {
      var bristolSky = ctx.createLinearGradient(0, 0, 0, h);
      bristolSky.addColorStop(0, PALETTE.postcardBristol);
      bristolSky.addColorStop(0.46, "#e5d4b3");
      bristolSky.addColorStop(1, PALETTE.postcardAgedEdge);
      ctx.fillStyle = bristolSky;
      ctx.fillRect(0, 0, w, h);

      if (grace.collodionWarmth < 0.65) {
        ctx.fillStyle = "rgba(132, 126, 115, " + round4((0.65 - grace.collodionWarmth) * 0.42) + ")";
        ctx.fillRect(0, 0, w, h);
      }

      if (grace.retroactiveGrace > 0.05) {
        var sunBloom = ctx.createRadialGradient(
          activeLoc.u * w, activeLoc.v * h * 0.85, w * 0.02,
          activeLoc.u * w, activeLoc.v * h * 0.85, w * 0.52
        );
        sunBloom.addColorStop(0, "rgba(216, 162, 74, " + round4(grace.retroactiveGrace * 0.34) + ")");
        sunBloom.addColorStop(0.55, "rgba(216, 162, 74, " + round4(grace.retroactiveGrace * 0.12) + ")");
        sunBloom.addColorStop(1, "rgba(216, 162, 74, 0)");
        ctx.fillStyle = sunBloom;
        ctx.fillRect(0, 0, w, h);
      }
    }

    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.quadraticCurveTo(w * 0.18, h * 0.33, w * 0.38, h * 0.38);
    ctx.quadraticCurveTo(w * 0.56, h * 0.31, w * 0.76, h * 0.37);
    ctx.quadraticCurveTo(w * 0.90, h * 0.34, w, h * 0.39);
    ctx.lineTo(w, horizonY + 8);
    ctx.lineTo(0, horizonY + 8);
    ctx.closePath();
    ctx.fillStyle = real1906 ? "#8e887c" : "rgba(150, 118, 84, 0.32)";
    ctx.fill();

    var bellX = w * 0.355;
    var bellBaseY = h * 0.42;
    ctx.fillStyle = real1906 ? "#746e63" : "rgba(110, 80, 54, 0.52)";
    ctx.fillRect(bellX - w * 0.011, bellBaseY - h * 0.11, w * 0.022, h * 0.11);
    ctx.beginPath();
    ctx.moveTo(bellX - w * 0.014, bellBaseY - h * 0.11);
    ctx.lineTo(bellX, bellBaseY - h * 0.148);
    ctx.lineTo(bellX + w * 0.014, bellBaseY - h * 0.11);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = real1906 ? "#645e54" : "rgba(92, 66, 44, 0.45)";
    ctx.lineWidth = Math.max(1, w * 0.0014);
    var balY = h * 0.485;
    ctx.beginPath();
    ctx.moveTo(w * 0.33, balY);
    ctx.lineTo(w * 0.67, balY);
    ctx.stroke();
    for (var bx = 0.34; bx <= 0.665; bx += 0.018) {
      ctx.beginPath();
      ctx.moveTo(w * bx, balY);
      ctx.lineTo(w * bx, balY + h * 0.024);
      ctx.stroke();
    }

    if (real1906) {
      for (var r = 0; r < 4; r++) {
        var ry = h * (0.67 + r * 0.055);
        ctx.strokeStyle = r % 2 === 0 ? "#4e493f" : "#676055";
        ctx.lineWidth = Math.max(2, h * 0.008);
        ctx.beginPath();
        ctx.moveTo(w * 0.02, ry + (r % 2) * 5);
        ctx.bezierCurveTo(w * 0.32, ry - 9, w * 0.64, ry + 11, w * 0.98, ry - 4);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(168, 162, 150, 0.38)";
      ctx.beginPath();
      drawEllipse(ctx, w * 0.25, h * 0.71, w * 0.065, h * 0.016, 0.08);
      ctx.fill();
    } else {
      ctx.strokeStyle = "rgba(96, 68, 45, 0.18)";
      ctx.lineWidth = 1;
      for (var row = 0; row < 7; row++) {
        var cy = h * (0.55 + row * 0.052);
        ctx.beginPath();
        ctx.arc(w * 0.22, cy + h * 0.22, h * (0.24 + row * 0.03), Math.PI * 1.18, Math.PI * 1.82);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(216, 162, 74, " + round4(grace.retroactiveGrace * 0.09) + ")";
      ctx.beginPath();
      ctx.moveTo(w * 0.60, h * 0.50);
      ctx.lineTo(w * 0.98, h * 0.56);
      ctx.lineTo(w * 0.98, h * 0.84);
      ctx.lineTo(w * 0.56, h * 0.72);
      ctx.closePath();
      ctx.fill();

      if (grace.retroactiveGrace > 0.35) {
        for (var m = 0; m < 10; m++) {
          var mx = w * (0.14 + ((m * 0.083) % 0.74)) + Math.sin(animTime * 0.7 + m) * 4;
          var my = h * (0.28 + ((m * 0.061) % 0.44)) + Math.cos(animTime * 0.5 + m * 1.7) * 3;
          ctx.fillStyle = "rgba(250, 245, 232, " + round4(grace.retroactiveGrace * 0.28) + ")";
          ctx.beginPath();
          ctx.arc(mx, my, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  function renderLocusHenSquare(ctx, w, h, s, grace, animTime) {
    var real1906 = Boolean(s.realTime1906);
    var cx = LOCI[0].u * w;
    var cy = LOCI[0].v * h;
    var sc = Math.min(w, h);

    var wallX = cx - sc * 0.21;
    var wallY = cy - sc * 0.29;
    var wallW = sc * 0.31;
    var wallH = sc * 0.24;
    ctx.fillStyle = real1906 ? "#8f897d" : "#e3d1b2";
    ctx.strokeStyle = real1906 ? "#575249" : PALETTE.collodionSepia;
    ctx.lineWidth = Math.max(1.2, sc * 0.0022);
    ctx.fillRect(wallX, wallY, wallW, wallH);
    ctx.strokeRect(wallX, wallY, wallW, wallH);

    ctx.fillStyle = real1906 ? "#686258" : "#8b6343";
    ctx.beginPath();
    ctx.moveTo(wallX - sc * 0.012, wallY);
    ctx.lineTo(wallX + wallW * 0.5, wallY - sc * 0.042);
    ctx.lineTo(wallX + wallW + sc * 0.012, wallY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    for (var a = 0; a < 3; a++) {
      var ax = wallX + wallW * (0.18 + a * 0.32);
      var archW = wallW * 0.21;
      var archBottom = wallY + wallH;
      ctx.fillStyle = real1906 ? "#4b463e" : "#4e3622";
      ctx.beginPath();
      ctx.moveTo(ax - archW * 0.5, archBottom);
      ctx.lineTo(ax - archW * 0.5, archBottom - wallH * 0.42);
      ctx.arc(ax, archBottom - wallH * 0.42, archW * 0.5, Math.PI, 0);
      ctx.lineTo(ax + archW * 0.5, archBottom);
      ctx.closePath();
      ctx.fill();

      var winY = wallY + wallH * 0.15;
      var winW = archW * 0.62;
      var winH = wallH * 0.24;
      ctx.fillStyle = real1906 ? "#5d584f" : "#6e5036";
      ctx.fillRect(ax - winW * 0.85, winY, winW * 1.7, winH);
      ctx.fillStyle = real1906 ? "#423e37" : "#3a2819";
      ctx.fillRect(ax - winW * 0.42, winY, winW * 0.84, winH);
    }

    var trX = cx - sc * 0.135;
    var trY = cy - sc * 0.025;
    ctx.fillStyle = real1906 ? "#6d675c" : "#cbb693";
    ctx.fillRect(trX, trY, sc * 0.088, sc * 0.036);
    ctx.strokeRect(trX, trY, sc * 0.088, sc * 0.036);
    ctx.fillStyle = real1906 ? "#4f5246" : "rgba(110, 80, 54, 0.42)";
    ctx.fillRect(trX + 3, trY + 3, sc * 0.088 - 6, sc * 0.012);

    var peck = real1906 ? 0.05 : Math.sin(animTime * 2.8) * 0.09;
    var hr = sc * 0.044;

    if (!real1906 && grace.retroactiveGrace > 0.08) {
      var henGlow = ctx.createRadialGradient(cx, cy, hr * 0.2, cx, cy, hr * 2.4);
      henGlow.addColorStop(0, "rgba(216, 162, 74, " + round4(grace.retroactiveGrace * 0.48) + ")");
      henGlow.addColorStop(1, "rgba(216, 162, 74, 0)");
      ctx.fillStyle = henGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, hr * 2.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = PALETTE.retroactiveGraceGilt;
      for (var g = 0; g < 8; g++) {
        ctx.beginPath();
        ctx.arc(cx + hr * (0.75 + (g % 4) * 0.22), cy + hr * (0.68 + Math.floor(g / 4) * 0.14), 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = real1906 ? "rgba(48, 44, 38, 0.45)" : "rgba(58, 40, 25, 0.26)";
    ctx.beginPath();
    drawEllipse(ctx, cx, cy + hr * 0.78, hr * 0.92, hr * 0.24, 0);
    ctx.fill();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.strokeStyle = real1906 ? "#47423a" : "#7c5634";
    ctx.lineWidth = Math.max(1.5, hr * 0.08);
    ctx.beginPath();
    ctx.moveTo(-hr * 0.12, hr * 0.35);
    ctx.lineTo(-hr * 0.18, hr * 0.75);
    ctx.moveTo(hr * 0.12, hr * 0.35);
    ctx.lineTo(hr * 0.16, hr * 0.75);
    ctx.stroke();

    ctx.fillStyle = real1906 ? "#5b554c" : "#4b3421";
    ctx.beginPath();
    ctx.moveTo(-hr * 0.45, -hr * 0.05);
    ctx.quadraticCurveTo(-hr * 1.15, -hr * 0.68, -hr * 0.88, hr * 0.18);
    ctx.quadraticCurveTo(-hr * 0.70, hr * 0.36, -hr * 0.35, hr * 0.22);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    drawEllipse(ctx, 0, hr * 0.04, hr * (real1906 ? 0.62 : 0.74), hr * (real1906 ? 0.42 : 0.54), 0.12);
    ctx.fillStyle = real1906 ? "#665f55" : "#5c4028";
    ctx.fill();
    ctx.strokeStyle = real1906 ? "#3f3b34" : PALETTE.umberInk;
    ctx.lineWidth = Math.max(1.2, hr * 0.05);
    ctx.stroke();

    if (!real1906) {
      for (var sp = 0; sp < 14; sp++) {
        var sx = -hr * 0.46 + (sp % 5) * hr * 0.22;
        var sy = -hr * 0.22 + Math.floor(sp / 5) * hr * 0.19;
        ctx.fillStyle = sp % 2 === 0 ? PALETTE.parasolLaceIvory : PALETTE.retroactiveGraceGilt;
        ctx.beginPath();
        drawEllipse(ctx, sx, sy, hr * 0.085, hr * 0.045, 0.25);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = "#48433b";
      ctx.beginPath();
      drawEllipse(ctx, -hr * 0.1, hr * 0.24, hr * 0.32, hr * 0.12, 0.1);
      ctx.fill();
    }

    ctx.save();
    ctx.translate(hr * 0.52, -hr * 0.18);
    ctx.rotate(peck);
    ctx.fillStyle = real1906 ? "#635c52" : "#543a24";
    ctx.beginPath();
    ctx.arc(hr * 0.14, -hr * 0.12, hr * 0.24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = real1906 ? "#7d6862" : "#9c4347";
    ctx.beginPath();
    ctx.arc(hr * 0.10, -hr * 0.36, hr * 0.09, 0, Math.PI * 2);
    ctx.arc(hr * 0.22, -hr * 0.33, hr * 0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = real1906 ? "#857e70" : PALETTE.retroactiveGraceGilt;
    ctx.beginPath();
    ctx.moveTo(hr * 0.35, -hr * 0.14);
    ctx.lineTo(hr * 0.56, -hr * 0.04);
    ctx.lineTo(hr * 0.34, -hr * 0.02);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = PALETTE.parasolLaceIvory;
    ctx.beginPath();
    ctx.arc(hr * 0.20, -hr * 0.16, hr * 0.045, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.restore();

    if (real1906) {
      ctx.fillStyle = "#23201c";
      for (var f = 0; f < 6; f++) {
        var fx = trX + sc * 0.05 + Math.cos(animTime * 4.2 + f * 1.3) * sc * 0.06 + f * sc * 0.018;
        var fy = trY - sc * 0.01 + Math.sin(animTime * 5.1 + f * 2.1) * sc * 0.025;
        ctx.beginPath();
        ctx.arc(fx, fy, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function renderLocusBandstand(ctx, w, h, s, grace, animTime) {
    var real1906 = Boolean(s.realTime1906);
    var cx = LOCI[1].u * w;
    var cy = LOCI[1].v * h;
    var sc = Math.min(w, h);
    var pw = sc * 0.21;
    var eavesY = cy - sc * 0.055;
    var deckY = cy + sc * 0.068;
    var baseY = cy + sc * 0.118;

    if (!real1906 && grace.retroactiveGrace > 0.08) {
      var bandGlow = ctx.createRadialGradient(cx, cy - sc * 0.02, sc * 0.02, cx, cy - sc * 0.02, sc * 0.22);
      bandGlow.addColorStop(0, "rgba(216, 162, 74, " + round4(grace.retroactiveGrace * 0.44) + ")");
      bandGlow.addColorStop(1, "rgba(216, 162, 74, 0)");
      ctx.fillStyle = bandGlow;
      ctx.beginPath();
      ctx.arc(cx, cy - sc * 0.02, sc * 0.22, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = real1906 ? "#706a5f" : "#cfb995";
    ctx.strokeStyle = real1906 ? "#4c473f" : PALETTE.umberInk;
    ctx.lineWidth = Math.max(1.2, sc * 0.0022);
    ctx.beginPath();
    ctx.moveTo(cx - pw * 0.54, deckY);
    ctx.lineTo(cx + pw * 0.54, deckY);
    ctx.lineTo(cx + pw * 0.62, baseY);
    ctx.lineTo(cx - pw * 0.62, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    for (var st = 1; st <= 3; st++) {
      var sy = deckY + (baseY - deckY) * (st / 4);
      ctx.beginPath();
      ctx.moveTo(cx - pw * 0.18, sy);
      ctx.lineTo(cx + pw * 0.18, sy);
      ctx.stroke();
    }

    for (var side = -1; side <= 1; side += 2) {
      var ox = cx + side * pw * 0.72;
      var oy = baseY - sc * 0.012;
      ctx.fillStyle = real1906 ? "#5d564c" : "#7d5335";
      ctx.fillRect(ox - sc * 0.018, oy - sc * 0.026, sc * 0.036, sc * 0.028);
      ctx.fillStyle = real1906 ? "#646358" : "#5b482e";
      ctx.beginPath();
      ctx.arc(ox, oy - sc * 0.048, sc * (real1906 ? 0.021 : 0.028), 0, Math.PI * 2);
      ctx.fill();
      if (!real1906) {
        ctx.fillStyle = PALETTE.parasolLaceIvory;
        for (var bl = -1; bl <= 1; bl++) {
          ctx.beginPath();
          ctx.arc(ox + bl * sc * 0.011, oy - sc * 0.052 + Math.abs(bl) * 3, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    var colOffsets = [-0.46, -0.24, 0, 0.24, 0.46];
    ctx.strokeStyle = real1906 ? "#4c4841" : PALETTE.umberInk;
    ctx.lineWidth = Math.max(1.5, sc * 0.0028);
    for (var c = 0; c < colOffsets.length; c++) {
      var colX = cx + pw * colOffsets[c];
      ctx.beginPath();
      ctx.moveTo(colX, eavesY);
      ctx.lineTo(colX, deckY);
      ctx.stroke();
      if (c < colOffsets.length - 1) {
        var nextX = cx + pw * colOffsets[c + 1];
        var midX = (colX + nextX) * 0.5;
        ctx.strokeStyle = real1906 ? "#58534b" : PALETTE.collodionSepia;
        ctx.lineWidth = Math.max(1.1, sc * 0.0018);
        ctx.beginPath();
        ctx.arc(colX + (nextX - colX) * 0.24, eavesY + sc * 0.016, sc * 0.013, 0, Math.PI);
        ctx.arc(nextX - (nextX - colX) * 0.24, eavesY + sc * 0.016, sc * 0.013, 0, Math.PI);
        ctx.stroke();
        if (!real1906 && grace.retroactiveGrace > 0.25) {
          ctx.strokeStyle = "rgba(216, 162, 74, " + round4(grace.retroactiveGrace * 0.65) + ")";
          ctx.beginPath();
          ctx.arc(midX, eavesY + sc * 0.012, sc * 0.009, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.strokeStyle = real1906 ? "#4c4841" : PALETTE.umberInk;
        ctx.lineWidth = Math.max(1.5, sc * 0.0028);
      }
    }

    var railY = deckY - sc * 0.032;
    ctx.lineWidth = Math.max(1.1, sc * 0.002);
    ctx.beginPath();
    ctx.moveTo(cx - pw * 0.46, railY);
    ctx.lineTo(cx + pw * 0.46, railY);
    ctx.stroke();
    for (var rx = -0.44; rx <= 0.44; rx += 0.055) {
      if (Math.abs(rx) < 0.12) continue;
      ctx.beginPath();
      ctx.moveTo(cx + pw * rx, railY);
      ctx.lineTo(cx + pw * rx, deckY);
      ctx.stroke();
    }

    for (var ms = -1; ms <= 1; ms++) {
      var mx = cx + ms * pw * 0.16;
      var tilt = real1906 && ms === 1 ? 0.18 : 0;
      ctx.save();
      ctx.translate(mx, deckY);
      ctx.rotate(tilt);
      ctx.strokeStyle = real1906 ? "#5d574d" : PALETTE.retroactiveGraceGilt;
      ctx.lineWidth = Math.max(1.2, sc * 0.002);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -sc * 0.042);
      ctx.moveTo(-sc * 0.012, -sc * 0.042);
      ctx.lineTo(sc * 0.012, -sc * 0.046);
      ctx.stroke();
      ctx.restore();
    }

    var apexY = cy - sc * 0.145;
    ctx.fillStyle = real1906 ? "#6c685f" : "#5b412b";
    ctx.strokeStyle = real1906 ? "#45413b" : PALETTE.umberInk;
    ctx.lineWidth = Math.max(1.4, sc * 0.0024);
    ctx.beginPath();
    ctx.moveTo(cx - pw * 0.55, eavesY);
    ctx.quadraticCurveTo(cx - pw * 0.26, apexY + sc * 0.012, cx, apexY);
    ctx.quadraticCurveTo(cx + pw * 0.26, apexY + sc * 0.012, cx + pw * 0.55, eavesY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (real1906) {
      ctx.strokeStyle = "#6e4936";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - pw * 0.14, apexY + sc * 0.025);
      ctx.lineTo(cx - pw * 0.22, eavesY - 2);
      ctx.moveTo(cx + pw * 0.18, apexY + sc * 0.035);
      ctx.lineTo(cx + pw * 0.26, eavesY - 2);
      ctx.stroke();
    } else {
      ctx.strokeStyle = PALETTE.retroactiveGraceGilt;
      ctx.lineWidth = 1.1;
      for (var scx = -0.50; scx <= 0.46; scx += 0.095) {
        ctx.beginPath();
        ctx.arc(cx + pw * (scx + 0.045), eavesY, pw * 0.048, 0, Math.PI);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = real1906 ? "#4c4841" : PALETTE.umberInk;
    ctx.lineWidth = Math.max(1.4, sc * 0.0024);
    ctx.beginPath();
    ctx.moveTo(cx, apexY);
    ctx.lineTo(cx, apexY - sc * 0.036);
    ctx.stroke();

    if (!real1906 && grace.retroactiveGrace > 0.35) {
      var pulse = (animTime * 0.55) % 1;
      for (var wv = 0; wv < 2; wv++) {
        var frac = (pulse + wv * 0.5) % 1;
        var rad = sc * (0.03 + frac * 0.09);
        ctx.strokeStyle = "rgba(216, 162, 74, " + round4((1 - frac) * grace.retroactiveGrace * 0.42) + ")";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(cx, apexY - sc * 0.02, rad, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      }
    }
  }

  function renderLocusParasols(ctx, w, h, s, grace, animTime) {
    var real1906 = Boolean(s.realTime1906);
    var cx = LOCI[2].u * w;
    var cy = LOCI[2].v * h;
    var sc = Math.min(w, h);

    for (var t = 0; t < 3; t++) {
      var tx = cx + sc * (-0.12 + t * 0.115);
      var ty = cy + sc * (0.06 - t * 0.025);
      var tScale = 1 - t * 0.14;
      ctx.strokeStyle = real1906 ? "#544f46" : "#4d3521";
      ctx.lineWidth = Math.max(2, sc * 0.008 * tScale);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx, ty - sc * 0.18 * tScale);
      ctx.stroke();

      ctx.fillStyle = real1906 ? "rgba(104, 100, 90, 0.55)" : "rgba(110, 80, 54, 0.36)";
      ctx.beginPath();
      drawEllipse(ctx, tx, ty - sc * 0.21 * tScale, sc * 0.068 * tScale, sc * 0.044 * tScale, 0);
      ctx.fill();
    }

    if (!real1906 && grace.retroactiveGrace > 0.08) {
      var parGlow = ctx.createRadialGradient(cx, cy - sc * 0.03, sc * 0.02, cx, cy - sc * 0.03, sc * 0.21);
      parGlow.addColorStop(0, "rgba(216, 162, 74, " + round4(grace.retroactiveGrace * 0.46) + ")");
      parGlow.addColorStop(1, "rgba(216, 162, 74, 0)");
      ctx.fillStyle = parGlow;
      ctx.beginPath();
      ctx.arc(cx, cy - sc * 0.03, sc * 0.21, 0, Math.PI * 2);
      ctx.fill();
    }

    for (var i = 0; i < 2; i++) {
      var lx = cx + (i === 0 ? -sc * 0.042 : sc * 0.044);
      var ly = cy + (i === 0 ? sc * 0.078 : sc * 0.092);
      var figH = sc * (i === 0 ? 0.155 : 0.148);
      var tiltSign = i === 0 ? -1 : 1;
      var sway = real1906 ? 0 : Math.sin(animTime * 1.6 + i * 1.4) * 0.035;

      ctx.fillStyle = real1906 ? "rgba(44, 40, 35, 0.48)" : "rgba(58, 40, 25, 0.22)";
      ctx.beginPath();
      drawEllipse(ctx, lx, ly + sc * 0.006, figH * 0.28, figH * 0.07, 0);
      ctx.fill();

      ctx.fillStyle = real1906 ? (i === 0 ? "#918b7f" : "#837d72") : PALETTE.parasolLaceIvory;
      ctx.strokeStyle = real1906 ? "#4c473f" : PALETTE.collodionSepia;
      ctx.lineWidth = Math.max(1.2, sc * 0.002);
      ctx.beginPath();
      ctx.moveTo(lx - figH * 0.08, ly - figH * 0.52);
      ctx.quadraticCurveTo(lx - figH * 0.22, ly - figH * 0.14, lx - figH * 0.28, ly);
      ctx.lineTo(lx + figH * 0.26, ly);
      ctx.quadraticCurveTo(lx + figH * 0.19, ly - figH * 0.16, lx + figH * 0.08, ly - figH * 0.52);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (real1906) {
        ctx.fillStyle = "#544e44";
        ctx.fillRect(lx - figH * 0.26, ly - figH * 0.07, figH * 0.50, figH * 0.07);
      } else {
        ctx.strokeStyle = PALETTE.retroactiveGraceGilt;
        ctx.beginPath();
        ctx.moveTo(lx - figH * 0.085, ly - figH * 0.51);
        ctx.lineTo(lx + figH * 0.085, ly - figH * 0.51);
        ctx.stroke();
      }

      ctx.fillStyle = real1906 ? "#888277" : "#f5ebd6";
      ctx.strokeStyle = real1906 ? "#4c473f" : PALETTE.collodionSepia;
      ctx.beginPath();
      drawEllipse(ctx, lx, ly - figH * 0.65, figH * 0.095, figH * 0.14, 0);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = real1906 ? "#9e978b" : "#e7d4b5";
      ctx.beginPath();
      ctx.arc(lx, ly - figH * 0.85, figH * 0.072, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(lx + tiltSign * figH * 0.05, ly - figH * 0.62);
      ctx.rotate(tiltSign * 0.18 + sway);

      ctx.strokeStyle = real1906 ? "#454038" : PALETTE.umberInk;
      ctx.lineWidth = Math.max(1.3, sc * 0.0022);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -figH * 0.64);
      ctx.stroke();

      var pRad = figH * 0.44;
      var pRimY = -figH * 0.34;
      var pTopY = -figH * 0.58;
      ctx.fillStyle = real1906 ? "#a49e92" : PALETTE.parasolLaceIvory;
      ctx.strokeStyle = real1906 ? "#555047" : PALETTE.collodionSepia;
      ctx.lineWidth = Math.max(1.2, sc * 0.002);
      ctx.beginPath();
      ctx.moveTo(-pRad, pRimY);
      ctx.quadraticCurveTo(0, pTopY - figH * 0.08, pRad, pRimY);
      if (real1906) {
        ctx.lineTo(-pRad, pRimY);
      } else {
        var scallops = 8;
        var stepW = (pRad * 2) / scallops;
        for (var k = scallops; k >= 1; k--) {
          var sx1 = -pRad + k * stepW;
          var sx0 = sx1 - stepW;
          ctx.quadraticCurveTo((sx0 + sx1) * 0.5, pRimY + figH * 0.065, sx0, pRimY);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (!real1906) {
        ctx.strokeStyle = "rgba(110, 80, 54, 0.36)";
        ctx.lineWidth = 0.9;
        for (var rb = -3; rb <= 3; rb++) {
          ctx.beginPath();
          ctx.moveTo(0, pTopY);
          ctx.lineTo((rb / 3.5) * pRad, pRimY);
          ctx.stroke();
        }
        ctx.fillStyle = PALETTE.collodionSepia;
        for (var ey = -3; ey <= 3; ey++) {
          ctx.beginPath();
          ctx.arc((ey / 3.6) * pRad, pRimY + figH * 0.02, 1.05, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }
  }

  function renderPostcardFraming(ctx, w, h, s, grace) {
    var activeIdx = clamp(Math.round(s.activeLocus || 0), 0, 2);
    var activeLoc = LOCI[activeIdx];
    var minDim = Math.min(w, h);
    var pad = Math.max(10, minDim * 0.022);

    var pat = getHalftonePattern(ctx);
    if (pat) {
      ctx.fillStyle = pat;
      ctx.fillRect(0, 0, w, h);
    } else {
      ctx.fillStyle = "rgba(58, 40, 25, 0.07)";
      var step = Math.max(14, Math.round(minDim * 0.03));
      for (var gy = pad; gy < h - pad; gy += step) {
        for (var gx = pad; gx < w - pad; gx += step) {
          ctx.beginPath();
          ctx.arc(gx + ((gy / step) % 2) * 4, gy, 1.0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    ctx.save();
    ctx.strokeStyle = grace.inObligatoryBand ? "rgba(216, 162, 74, 0.68)" : "rgba(110, 80, 54, 0.42)";
    ctx.lineWidth = 1.4;
    if (ctx.setLineDash) ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.arc(activeLoc.u * w, activeLoc.v * h, activeLoc.radiusNorm * minDim * 0.78, 0, Math.PI * 2);
    ctx.stroke();
    if (ctx.setLineDash) ctx.setLineDash([]);
    ctx.restore();

    ctx.strokeStyle = PALETTE.postcardBristol;
    ctx.lineWidth = pad * 1.35;
    ctx.strokeRect(pad * 0.5, pad * 0.5, w - pad, h - pad);

    ctx.strokeStyle = PALETTE.collodionSepia;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);

    ctx.fillStyle = PALETTE.postcardBristol;
    var notchStep = Math.max(14, Math.round(minDim * 0.028));
    for (var nx = pad + notchStep; nx < w - pad - 6; nx += notchStep) {
      ctx.beginPath();
      ctx.arc(nx, pad, 2.6, 0, Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(nx, h - pad, 2.6, Math.PI, Math.PI * 2);
      ctx.fill();
    }

    var cSize = Math.max(18, minDim * 0.042);
    var corners = [
      [pad - 2, pad - 2, 1, 1],
      [w - pad + 2, pad - 2, -1, 1],
      [pad - 2, h - pad + 2, 1, -1],
      [w - pad + 2, h - pad + 2, -1, -1]
    ];
    for (var c = 0; c < corners.length; c++) {
      var cx0 = corners[c][0], cy0 = corners[c][1], sx = corners[c][2], sy = corners[c][3];
      ctx.fillStyle = PALETTE.umberInk;
      ctx.beginPath();
      ctx.moveTo(cx0, cy0);
      ctx.lineTo(cx0 + sx * cSize, cy0);
      ctx.lineTo(cx0, cy0 + sy * cSize);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = PALETTE.retroactiveGraceGilt;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(cx0 + sx * cSize * 0.82, cy0 + sy * 2);
      ctx.lineTo(cx0 + sx * 2, cy0 + sy * cSize * 0.82);
      ctx.stroke();
    }

    var stW = Math.max(38, minDim * 0.068);
    var stH = stW * 1.18;
    var stX = w - pad - stW - minDim * 0.02;
    var stY = pad + minDim * 0.018;
    ctx.fillStyle = PALETTE.postcardBristol;
    ctx.fillRect(stX - 3, stY - 3, stW + 6, stH + 6);
    ctx.fillStyle = PALETTE.stampMagenta;
    ctx.fillRect(stX, stY, stW, stH);
    ctx.strokeStyle = PALETTE.postcardBristol;
    ctx.lineWidth = 1;
    ctx.strokeRect(stX + 3, stY + 3, stW - 6, stH - 6);
    ctx.fillStyle = PALETTE.postcardBristol;
    ctx.font = "bold " + Math.max(8, Math.round(stW * 0.22)) + "px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("5c", stX + stW * 0.5, stY + stH * 0.54);
    ctx.font = Math.max(6, Math.round(stW * 0.14)) + "px Georgia, serif";
    ctx.fillText("POSTES", stX + stW * 0.5, stY + stH * 0.82);

    var pmX = stX - stW * 0.36;
    var pmY = stY + stH * 0.56;
    var pmR = stW * 0.52;
    ctx.save();
    ctx.translate(pmX, pmY);
    ctx.rotate(-0.14);
    ctx.strokeStyle = "rgba(58, 40, 25, 0.76)";
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(0, 0, pmR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, pmR * 0.76, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "rgba(58, 40, 25, 0.82)";
    ctx.font = "bold " + Math.max(6, Math.round(pmR * 0.27)) + "px Georgia, serif";
    ctx.fillText("1906", 0, 3);
    for (var wv = -1; wv <= 2; wv++) {
      var wy = wv * pmR * 0.26;
      ctx.beginPath();
      ctx.moveTo(pmR * 0.55, wy);
      ctx.bezierCurveTo(pmR * 1.0, wy - 4, pmR * 1.35, wy + 4, pmR * 1.85, wy - 2);
      ctx.stroke();
    }
    ctx.restore();

    ctx.textAlign = "left";
    ctx.fillStyle = PALETTE.umberInk;
    var titlePx = Math.max(15, Math.round(minDim * 0.036));
    ctx.font = "italic 600 " + titlePx + "px Georgia, 'Times New Roman', serif";
    ctx.fillText("Saluti da Maurilia", pad + minDim * 0.025, pad + titlePx + minDim * 0.014);
    ctx.font = Math.max(9, Math.round(minDim * 0.015)) + "px Georgia, serif";
    ctx.fillStyle = PALETTE.collodionSepia;
    ctx.fillText(activeLoc.postmark + "  ·  " + activeLoc.serieCode, pad + minDim * 0.026, pad + titlePx + minDim * 0.036);
    ctx.fillText(activeLoc.title, pad + minDim * 0.026, h - pad - minDim * 0.015);
  }

  function renderUnmediated1906Overlay(ctx, w, h, s) {
    var activeIdx = clamp(Math.round(s.activeLocus || 0), 0, 2);
    var activeLoc = LOCI[activeIdx];
    var minDim = Math.min(w, h);
    ctx.strokeStyle = "rgba(56, 52, 46, 0.65)";
    ctx.lineWidth = 1.4;
    ctx.strokeRect(activeLoc.u * w - minDim * 0.11, activeLoc.v * h - minDim * 0.11, minDim * 0.22, minDim * 0.22);
    ctx.fillStyle = "rgba(44, 41, 36, 0.78)";
    ctx.fillRect(0, h - 28, w, 28);
    ctx.fillStyle = "#d4cfc4";
    ctx.font = "600 11px monospace";
    ctx.textAlign = "left";
    ctx.fillText("1906 UNMEDIATED PROVINCIAL REALITY · GRACE 0.00 · " + activeLoc.title.toUpperCase(), 14, h - 10);
  }

  function renderPostcard(ctx, width, height, state) {
    if (!ctx || width <= 0 || height <= 0) return computeRetroactiveGrace(state);
    var s = state || {};
    var animTime = s.reducedMotion ? 0 : (Number(s.time) || 0);
    var grace = computeRetroactiveGrace(s);

    ctx.save();
    renderBackdropAndTownscape(ctx, width, height, s, grace, animTime);
    renderLocusBandstand(ctx, width, height, s, grace, animTime);
    renderLocusHenSquare(ctx, width, height, s, grace, animTime);
    renderLocusParasols(ctx, width, height, s, grace, animTime);
    if (s.realTime1906) {
      renderUnmediated1906Overlay(ctx, width, height, s);
    } else {
      renderPostcardFraming(ctx, width, height, s, grace);
    }
    ctx.restore();
    return grace;
  }

  function renderLoupeOverlay(ctx, width, height, state) {
    if (!ctx || width <= 0 || height <= 0) return;
    var s = state || {};
    var grace = computeRetroactiveGrace(s);
    var activeIdx = clamp(Math.round(s.activeLocus || 0), 0, 2);
    var defaultLoc = LOCI[activeIdx];
    var normX = typeof s.loupeX === "number" ? s.loupeX : defaultLoc.u;
    var normY = typeof s.loupeY === "number" ? s.loupeY : defaultLoc.v;
    var hitIdx = hitTestLocus(normX, normY);
    var focusLoc = LOCI[hitIdx >= 0 ? hitIdx : activeIdx];

    var minDim = Math.min(width, height);
    var lx = normX * width;
    var ly = normY * height;
    var radius = clamp((typeof s.loupeRadius === "number" ? s.loupeRadius : 0.20) * minDim, 36, minDim * 0.45);
    var split = clamp(Number(s.postcardSplit) || 0, 0, 1);

    ctx.save();
    if (split > 0.02) {
      var splitX = split * width;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, height);
      ctx.clip();
      renderPostcard(ctx, width, height, s);
      ctx.restore();

      ctx.strokeStyle = PALETTE.brassHighlight;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, height);
      ctx.stroke();
      ctx.fillStyle = PALETTE.mahoganyDark;
      roundedRectPath(ctx, splitX - 11, height * 0.5 - 26, 22, 52, 5);
      ctx.fill();
      ctx.strokeRect(splitX - 9, height * 0.5 - 24, 18, 48);
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(lx, ly + 5, radius + 9, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(8, 10, 14, 0.52)";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(lx, ly, radius, 0, Math.PI * 2);
    ctx.clip();
    renderPostcard(ctx, width, height, s);

    if (!s.realTime1906) {
      ctx.strokeStyle = PALETTE.postcardBristol;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(lx, ly, radius - 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = PALETTE.postcardBristol;
      for (var sc = 0; sc < 28; sc++) {
        var sa = (sc / 28) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(lx + Math.cos(sa) * (radius - 5), ly + Math.sin(sa) * (radius - 5), 2.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "rgba(58, 40, 25, 0.62)";
      ctx.font = "italic 600 " + Math.max(9, Math.round(radius * 0.11)) + "px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(focusLoc.postmark, lx, ly - radius * 0.72);
    }

    var lensSheen = ctx.createLinearGradient(lx - radius, ly - radius, lx + radius, ly + radius);
    lensSheen.addColorStop(0, s.realTime1906 ? "rgba(255,255,255,0.06)" : "rgba(250, 245, 232, 0.22)");
    lensSheen.addColorStop(0.45, "rgba(255,255,255,0)");
    lensSheen.addColorStop(1, s.realTime1906 ? "rgba(30,28,24,0.22)" : "rgba(216, 162, 74, " + round4(grace.retroactiveGrace * 0.20) + ")");
    ctx.fillStyle = lensSheen;
    ctx.fillRect(lx - radius, ly - radius, radius * 2, radius * 2);
    ctx.restore();

    ctx.strokeStyle = PALETTE.mahoganyDark;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(lx, ly, radius + 4, 0, Math.PI * 2);
    ctx.stroke();

    var bezelGrad = ctx.createLinearGradient(lx - radius, ly - radius, lx + radius, ly + radius);
    bezelGrad.addColorStop(0, PALETTE.brassHighlight);
    bezelGrad.addColorStop(0.5, PALETTE.brassMid);
    bezelGrad.addColorStop(1, PALETTE.brassShadow);
    ctx.strokeStyle = bezelGrad;
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.arc(lx, ly, radius + 1.5, 0, Math.PI * 2);
    ctx.stroke();

    for (var tk = 0; tk < 36; tk++) {
      var ang = (tk / 36) * Math.PI * 2;
      var innerT = radius + (tk % 3 === 0 ? 0.5 : 2.5);
      var outerT = radius + (tk % 3 === 0 ? 8.2 : 6.2);
      ctx.strokeStyle = tk % 3 === 0 ? PALETTE.brassHighlight : PALETTE.brassMid;
      ctx.lineWidth = tk % 3 === 0 ? 1.4 : 0.9;
      ctx.beginPath();
      ctx.moveTo(lx + Math.cos(ang) * innerT, ly + Math.sin(ang) * innerT);
      ctx.lineTo(lx + Math.cos(ang) * outerT, ly + Math.sin(ang) * outerT);
      ctx.stroke();
    }

    var tagW = Math.min(width - 20, Math.max(188, radius * 1.75));
    var tagH = 26;
    var tagX = clamp(lx - tagW * 0.5, 10, width - tagW - 10);
    var tagY = (ly + radius + 38 < height) ? (ly + radius + 12) : Math.max(8, ly - radius - 38);
    ctx.fillStyle = "rgba(32, 20, 13, 0.92)";
    ctx.strokeStyle = grace.inObligatoryBand ? PALETTE.brassHighlight : PALETTE.brassMid;
    ctx.lineWidth = 1.3;
    roundedRectPath(ctx, tagX, tagY, tagW, tagH, 5);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = PALETTE.parasolLaceIvory;
    ctx.font = "600 10.5px Georgia, serif";
    ctx.textAlign = "center";
    var badge = s.realTime1906
      ? (focusLoc.shortLabel + " · 1906 GRACE 0.00")
      : (focusLoc.shortLabel + " · GRACE " + grace.retroactiveGrace.toFixed(2));
    ctx.fillText(badge, tagX + tagW * 0.5, tagY + 16.5);
    ctx.restore();
  }

  return {
    LOCI: LOCI,
    STONES: LOCI,
    OBLIGATORY_REGRET_BAND: OBLIGATORY_REGRET_BAND,
    PALETTE: PALETTE,
    computeRetroactiveGrace: computeRetroactiveGrace,
    renderPostcard: renderPostcard,
    renderLoupeOverlay: renderLoupeOverlay,
    hitTestLocus: hitTestLocus,
    getLocus: getLocus
  };
})();
