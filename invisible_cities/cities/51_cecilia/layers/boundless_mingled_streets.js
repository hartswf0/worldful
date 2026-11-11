/*
 * City 51: Cecilia (Continuous Cities 4)
 * Layer 1: Boundless Mingled Streets & Traffic Island Palimpsest
 * Standalone Canvas 2D engine enacting topological pasture-to-asphalt engulfment.
 */
(function ceciliaBoundlessStreetsIIFE() {
  "use strict";

  var STREET_PALETTE = {
    pastureEarth: "#2d3627", contourOchre: "#b79b64", limestoneBlock: "#d5cab2",
    leaflessAlley: "#4a463f", tenementConcrete: "#5f656d", endlessAsphalt: "#22262d",
    islandCurb: "#9da3aa", laneStripe: "#c9b37e", sodiumLamp: "#e39d49",
    xrayBotanicalCyan: "#8fe0b8", xrayRootGold: "#e6c97a"
  };

  var TRAFFIC_ISLAND_ANCHORS = [
    { id: "meadow_of_the_low_sage", name: "Meadow of the Low Sage", nx: 0.50, ny: 0.54, rx: 0.068, ry: 0.046, streetContext: "Central Arterial Roundabout Traffic Island" },
    { id: "goats_slope", name: "The Goat's Slope", nx: 0.24, ny: 0.33, rx: 0.056, ry: 0.038, streetContext: "Northwest Viaduct Splitter Island" },
    { id: "crossroads_of_the_wind", name: "The Crossroads of the Wind", nx: 0.77, ny: 0.36, rx: 0.058, ry: 0.039, streetContext: "Northeast Six-Way Overpass Island" }
  ];

  var CEC_CORE_ORIGIN = { nx: 0.50, ny: 0.80 };

  var CEC_TOLL_GATES = [
    { id: "tollgate_north", bearing: "north", label: "North Watchmen's Arch", dx: 0.0, dy: -1.0, pastureName: "Meadow of the Low Sage" },
    { id: "tollgate_west", bearing: "west", label: "West Limestone Toll-Gate", dx: -1.0, dy: 0.0, pastureName: "The Goat's Slope" },
    { id: "tollgate_east", bearing: "east", label: "East Watchmen's Postern", dx: 1.0, dy: 0.0, pastureName: "The Crossroads of the Wind" },
    { id: "tollgate_south", bearing: "south", label: "South Drovers' Gate", dx: 0.0, dy: 0.88, pastureName: "Lower Thyme Hollow" }
  ];

  var CEC_NEIGHBOR_CITIES = [
    { nx: 0.05, ny: 0.10, weight: 1.05 }, { nx: 0.95, ny: 0.12, weight: 1.02 },
    { nx: 0.03, ny: 0.62, weight: 0.96 }, { nx: 0.97, ny: 0.65, weight: 0.98 },
    { nx: 0.49, ny: 0.03, weight: 0.94 }
  ];

  function cecSprawlClamp(val, lo, hi) {
    var n = Number(val);
    if (!Number.isFinite(n)) return lo;
    return n < lo ? lo : (n > hi ? hi : n);
  }

  function cecSprawlMix(a, b, t) { return a + (b - a) * t; }

  function cecSprawlHash(ix, iy, salt) {
    var h = Math.sin(ix * 127.1 + iy * 311.7 + (salt || 0) * 74.7) * 43758.5453;
    return h - Math.floor(h);
  }

  function cecSprawlCoreRadii(era) {
    var early = cecSprawlClamp(era, 0, 0.45);
    var burst = era > 0.45 ? (era - 0.45) / 0.43 : 0;
    return { rx: 0.155 + early * 0.16 + burst * 0.82, ry: 0.112 + early * 0.12 + burst * 0.78 };
  }

  function cecSprawlUrbanFieldAt(nx, ny, era) {
    if (era >= 0.88) return 1.0;
    var radii = cecSprawlCoreRadii(era);
    var dCore = Math.hypot((nx - CEC_CORE_ORIGIN.nx) / radii.rx, (ny - CEC_CORE_ORIGIN.ny) / radii.ry);
    var wobble = 0.04 * Math.sin(nx * 19.0 + ny * 13.0);
    if (dCore + wobble <= 1.0) return 1.0;
    if (era < 0.45) return 0.0;
    var reach = 0.04 + cecSprawlClamp((era - 0.45) / 0.43, 0, 1) * 0.88;
    for (var i = 0; i < CEC_NEIGHBOR_CITIES.length; i++) {
      var nb = CEC_NEIGHBOR_CITIES[i];
      if (Math.hypot(nx - nb.nx, (ny - nb.ny) * 1.08) / (reach * nb.weight) + wobble * 0.7 <= 1.0) return 1.0;
    }
    return 0.0;
  }

  function cecSprawlIslandMetric(nx, ny, anchor) {
    return Math.hypot((nx - anchor.nx) / anchor.rx, (ny - anchor.ny) / anchor.ry);
  }

  function cecSprawlPaintCountryside(ctx, w, h, era, clockSec, reducedMotion) {
    ctx.save();
    ctx.fillStyle = STREET_PALETTE.pastureEarth;
    ctx.fillRect(0, 0, w, h);
    if (era >= 0.88) { ctx.restore(); return; }

    var ruralAlpha = cecSprawlClamp(1.0 - Math.max(0, (era - 0.50) / 0.40), 0.12, 1.0);
    var hillGrad = ctx.createRadialGradient(w * 0.50, h * 0.46, w * 0.05, w * 0.50, h * 0.50, w * 0.72);
    hillGrad.addColorStop(0, "rgba(74, 88, 58, " + (0.42 * ruralAlpha).toFixed(3) + ")");
    hillGrad.addColorStop(0.6, "rgba(45, 54, 39, " + (0.22 * ruralAlpha).toFixed(3) + ")");
    hillGrad.addColorStop(1, "rgba(28, 34, 25, " + (0.55 * ruralAlpha).toFixed(3) + ")");
    ctx.fillStyle = hillGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = STREET_PALETTE.contourOchre;
    ctx.lineWidth = 1;
    for (var band = 0; band < 9; band++) {
      ctx.globalAlpha = (band % 3 === 0 ? 0.24 : 0.12) * ruralAlpha;
      ctx.beginPath();
      var baseY = h * (0.09 + band * 0.095);
      for (var sx = 0; sx <= w; sx += 24) {
        var nx = sx / w;
        var wave = Math.sin(nx * 7.2 + band * 1.1) * h * 0.022 + Math.cos(nx * 13.5 - band * 0.7) * h * 0.011;
        if (sx === 0) ctx.moveTo(sx, baseY + wave); else ctx.lineTo(sx, baseY + wave);
      }
      ctx.stroke();
    }

    ctx.globalAlpha = 0.34 * ruralAlpha;
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.4;
    for (var pi = 0; pi < TRAFFIC_ISLAND_ANCHORS.length; pi++) {
      var anc = TRAFFIC_ISLAND_ANCHORS[pi];
      ctx.beginPath();
      ctx.moveTo(CEC_CORE_ORIGIN.nx * w, (CEC_CORE_ORIGIN.ny - 0.11) * h);
      ctx.quadraticCurveTo(((CEC_CORE_ORIGIN.nx + anc.nx) * 0.5 + (pi - 1) * 0.05) * w, ((CEC_CORE_ORIGIN.ny + anc.ny) * 0.5 - 0.04) * h, anc.nx * w, anc.ny * h);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    var breezeShift = reducedMotion ? 0 : Math.sin(clockSec * 1.3) * 2.2;
    for (var ai = 0; ai < TRAFFIC_ISLAND_ANCHORS.length; ai++) {
      var pa = TRAFFIC_ISLAND_ANCHORS[ai];
      var cx = pa.nx * w, cy = pa.ny * h, rx = pa.rx * w, ry = pa.ry * h;
      for (var ring = 1; ring <= 4; ring++) {
        ctx.globalAlpha = (0.34 - ring * 0.06) * ruralAlpha;
        ctx.strokeStyle = STREET_PALETTE.contourOchre;
        ctx.lineWidth = ring === 1 ? 1.4 : 0.9;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * (0.65 + ring * 0.36), ry * (0.65 + ring * 0.36), (ai - 1) * 0.18, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 0.58 * ruralAlpha;
      for (var ti = 0; ti < 14; ti++) {
        var ang = ti * 2.39996, dist = Math.sqrt((ti + 0.5) / 14) * 0.85;
        var tx = cx + Math.cos(ang) * rx * dist, ty = cy + Math.sin(ang) * ry * dist;
        if (pa.id === "goats_slope" && ti % 3 === 0) {
          ctx.fillStyle = STREET_PALETTE.limestoneBlock;
          ctx.fillRect(tx - 4, ty - 2, 8, 3);
        }
        ctx.strokeStyle = pa.id === "meadow_of_the_low_sage" ? "#7ea07b" : STREET_PALETTE.contourOchre;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tx - 3, ty + 2);
        ctx.lineTo(tx + breezeShift * 0.35, ty - 4);
        ctx.lineTo(tx + 3, ty + 2);
        ctx.stroke();
      }
      if (pa.id === "crossroads_of_the_wind") {
        ctx.globalAlpha = 0.32 * ruralAlpha;
        ctx.strokeStyle = STREET_PALETTE.limestoneBlock;
        for (var wi = 0; wi < 4; wi++) {
          var wang = wi * (Math.PI * 0.5) + 0.32;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(wang) * rx * 0.3, cy + Math.sin(wang) * ry * 0.3);
          ctx.lineTo(cx + Math.cos(wang) * rx * 1.45, cy + Math.sin(wang) * ry * 1.45);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  function cecSprawlGateCoords(w, h, era) {
    var radii = cecSprawlCoreRadii(Math.min(era, 0.44)), out = [];
    for (var i = 0; i < CEC_TOLL_GATES.length; i++) {
      var g = CEC_TOLL_GATES[i];
      out.push({ id: g.id, bearing: g.bearing, label: g.label, pastureName: g.pastureName, x: (CEC_CORE_ORIGIN.nx + g.dx * radii.rx * 0.94) * w, y: (CEC_CORE_ORIGIN.ny + g.dy * radii.ry * 0.94) * h });
    }
    return out;
  }

  function cecSprawlPaintLimestoneCore(ctx, w, h, state) {
    if (state.eraProgress >= 0.86) return;
    ctx.save();
    var fade = cecSprawlClamp(1.0 - Math.max(0, (state.eraProgress - 0.55) / 0.31), 0, 1);
    var radii = cecSprawlCoreRadii(Math.min(state.eraProgress, 0.45));
    var cx = CEC_CORE_ORIGIN.nx * w, cy = CEC_CORE_ORIGIN.ny * h;
    var rx = radii.rx * w, ry = radii.ry * h;

    ctx.globalAlpha = 0.92 * fade;
    ctx.fillStyle = STREET_PALETTE.leaflessAlley;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = STREET_PALETTE.limestoneBlock;
    for (var row = -1; row <= 1; row++) {
      for (var col = -2; col <= 1; col++) {
        var bx = cx + (col + 0.12) * (rx * 0.36), by = cy + (row - 0.35) * (ry * 0.42);
        var bw = rx * 0.28, bh = ry * 0.30;
        if (Math.hypot((bx + bw * 0.5 - cx) / rx, (by + bh * 0.5 - cy) / ry) < 0.86) {
          ctx.fillRect(bx, by, bw, bh);
          ctx.strokeStyle = STREET_PALETTE.leaflessAlley;
          ctx.lineWidth = 1;
          ctx.strokeRect(bx + 2, by + 2, Math.max(2, bw - 4), Math.max(2, bh - 4));
        }
      }
    }

    ctx.strokeStyle = STREET_PALETTE.limestoneBlock;
    ctx.lineWidth = state.tollGatesIntact ? 2.6 : 1.2;
    if (!state.tollGatesIntact) ctx.setLineDash([6, 7]);
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (state.tollGatesIntact) {
      var gates = cecSprawlGateCoords(w, h, state.eraProgress);
      for (var gi = 0; gi < gates.length; gi++) {
        var gt = gates[gi];
        ctx.fillStyle = STREET_PALETTE.leaflessAlley;
        ctx.fillRect(gt.x - 8, gt.y - 6, 16, 12);
        ctx.fillStyle = STREET_PALETTE.limestoneBlock;
        ctx.fillRect(gt.x - 9, gt.y - 7, 5, 14);
        ctx.fillRect(gt.x + 4, gt.y - 7, 5, 14);
        ctx.fillStyle = STREET_PALETTE.sodiumLamp;
        ctx.beginPath();
        ctx.arc(gt.x, gt.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function cecSprawlMod(n, m) { return ((n % m) + m) % m; }

  function cecSprawlPaintMingledStreets(ctx, w, h, state, clockSec) {
    var era = state.eraProgress;
    if (era < 0.08) return;
    ctx.save();
    if (era >= 0.88) {
      ctx.fillStyle = STREET_PALETTE.endlessAsphalt;
      ctx.fillRect(0, 0, w, h);
    }
    var cols = 12, rows = 8, cellW = w / cols, cellH = h / rows;
    var ox = cecSprawlMod(state.toroidalPan.x, cellW), oy = cecSprawlMod(state.toroidalPan.y, cellH);
    var lampFlicker = state.reducedMotion ? 0.85 : (0.78 + 0.18 * Math.sin(clockSec * 3.1));

    for (var r = -1; r <= rows; r++) {
      for (var c = -1; c <= cols; c++) {
        var x0 = c * cellW + ox, y0 = r * cellH + oy;
        var ncx = cecSprawlClamp((x0 + cellW * 0.5) / w, 0, 1), ncy = cecSprawlClamp((y0 + cellH * 0.5) / h, 0, 1);
        if (era < 0.88 && cecSprawlUrbanFieldAt(ncx, ncy, era) < 0.5) continue;
        var inRotary = false;
        for (var k = 0; k < TRAFFIC_ISLAND_ANCHORS.length; k++) {
          if (cecSprawlIslandMetric(ncx, ncy, TRAFFIC_ISLAND_ANCHORS[k]) < 1.36) { inRotary = true; break; }
        }
        if (inRotary) {
          if (era >= 0.55) {
            ctx.fillStyle = STREET_PALETTE.endlessAsphalt;
            ctx.fillRect(x0 - 1, y0 - 1, cellW + 2, cellH + 2);
          }
          continue;
        }
        ctx.fillStyle = STREET_PALETTE.endlessAsphalt;
        ctx.fillRect(x0 - 0.5, y0 - 0.5, cellW + 1, cellH + 1);

        ctx.strokeStyle = STREET_PALETTE.laneStripe;
        ctx.globalAlpha = 0.42;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 5]);
        ctx.beginPath();
        ctx.moveTo(x0, y0 + 4); ctx.lineTo(x0 + cellW, y0 + 4);
        ctx.moveTo(x0 + 4, y0); ctx.lineTo(x0 + 4, y0 + cellH);
        ctx.stroke();
        ctx.setLineDash([]);

        var pad = Math.max(7, Math.min(cellW, cellH) * 0.13);
        var bx = x0 + pad, by = y0 + pad, bw = Math.max(8, cellW - pad * 1.65), bh = Math.max(8, cellH - pad * 1.65);
        var hVal = cecSprawlHash(c - Math.floor(state.toroidalPan.x / cellW), r - Math.floor(state.toroidalPan.y / cellH), 3);

        ctx.globalAlpha = 0.96;
        ctx.fillStyle = era < 0.55 && hVal > 0.55 ? STREET_PALETTE.limestoneBlock : STREET_PALETTE.tenementConcrete;
        ctx.fillRect(bx, by, bw, bh);
        ctx.fillStyle = STREET_PALETTE.leaflessAlley;
        ctx.fillRect(bx + bw * 0.30, by + bh * 0.28, bw * 0.40, bh * 0.44);
        ctx.strokeStyle = STREET_PALETTE.islandCurb;
        ctx.lineWidth = 0.8;
        ctx.strokeRect(bx, by, bw, bh);

        if (era >= 0.50) {
          ctx.globalAlpha = 0.55 * lampFlicker;
          ctx.fillStyle = STREET_PALETTE.sodiumLamp;
          ctx.beginPath();
          ctx.arc(x0 + 5, y0 + 5, 2.4, 0, Math.PI * 2);
          ctx.fill();
          if (era >= 0.80 && hVal < 0.45) {
            ctx.globalAlpha = 0.78;
            ctx.fillStyle = STREET_PALETTE.islandCurb;
            ctx.fillRect(bx - 3.2, by + bh * 0.5, 2.5, 3.5);
          }
        }
      }
    }
    ctx.restore();
  }

  function cecSprawlPaintTrafficIslands(ctx, w, h, state, recognizedId, clockSec) {
    var era = state.eraProgress;
    if (era < 0.52) return;
    ctx.save();
    var paveT = cecSprawlClamp((era - 0.52) / 0.36, 0, 1);
    for (var i = 0; i < TRAFFIC_ISLAND_ANCHORS.length; i++) {
      var anc = TRAFFIC_ISLAND_ANCHORS[i];
      var cx = anc.nx * w, cy = anc.ny * h, rx = anc.rx * w, ry = anc.ry * h;
      ctx.globalAlpha = 0.96 * paveT;
      ctx.fillStyle = STREET_PALETTE.endlessAsphalt;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx * 1.56, ry * 1.58, 0, 0, Math.PI * 2);
      ctx.fill();

      if (anc.id === "crossroads_of_the_wind" || anc.id === "goats_slope") {
        var spokes = anc.id === "crossroads_of_the_wind" ? 6 : 4;
        ctx.strokeStyle = STREET_PALETTE.endlessAsphalt;
        ctx.lineWidth = Math.max(10, rx * 0.28);
        for (var sp = 0; sp < spokes; sp++) {
          var sa = sp * (Math.PI * 2 / spokes) + (anc.id === "goats_slope" ? 0.45 : 0.18);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(sa) * rx * 1.1, cy + Math.sin(sa) * ry * 1.1);
          ctx.lineTo(cx + Math.cos(sa) * rx * 2.15, cy + Math.sin(sa) * ry * 2.15);
          ctx.stroke();
        }
      }

      ctx.strokeStyle = STREET_PALETTE.laneStripe;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx * 1.28, ry * 1.30, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      for (var hc = 0; hc < 3; hc++) {
        var baseAng = (state.reducedMotion ? 0.7 : clockSec * (0.75 + i * 0.15)) + hc * 2.09;
        ctx.strokeStyle = hc % 2 === 0 ? STREET_PALETTE.sodiumLamp : "#d8684c";
        ctx.lineWidth = 2.0;
        ctx.globalAlpha = 0.65 * paveT;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * (1.20 + hc * 0.08), ry * (1.22 + hc * 0.08), 0, baseAng, baseAng + 0.34);
        ctx.stroke();
      }

      ctx.globalAlpha = 0.98;
      ctx.fillStyle = era >= 0.88 ? "#353b34" : STREET_PALETTE.pastureEarth;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      if (era >= 0.80) {
        ctx.strokeStyle = STREET_PALETTE.islandCurb;
        ctx.lineWidth = era >= 0.88 ? 4.2 : 2.4;
        ctx.stroke();
        ctx.fillStyle = STREET_PALETTE.leaflessAlley;
        ctx.fillRect(cx - rx * 0.78, cy - 2, 6, 4);
        ctx.fillRect(cx + rx * 0.68, cy - 2, 6, 4);
      }

      ctx.strokeStyle = anc.id === "meadow_of_the_low_sage" ? STREET_PALETTE.xrayBotanicalCyan : STREET_PALETTE.contourOchre;
      ctx.lineWidth = 1.2;
      for (var sg = -2; sg <= 2; sg++) {
        ctx.beginPath();
        ctx.moveTo(cx + sg * rx * 0.22, cy + 4);
        ctx.lineTo(cx + sg * rx * 0.22 + 2, cy - 4);
        ctx.stroke();
      }

      if (state.highlightedIslandId === anc.id || recognizedId === anc.id) {
        ctx.strokeStyle = STREET_PALETTE.xrayRootGold;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * 1.12, ry * 1.14, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function cecSprawlPaintBotanicalXRay(ctx, w, h, state, recognizedId, clockSec) {
    var fullXRay = state.botanicalXRay === true, focusId = recognizedId || state.highlightedIslandId;
    if (!fullXRay && !focusId) return;
    ctx.save();
    var pulse = state.reducedMotion ? 1.0 : (0.88 + 0.12 * Math.sin(clockSec * 2.4));

    if (fullXRay) {
      ctx.fillStyle = "rgba(18, 34, 28, 0.42)";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = STREET_PALETTE.xrayBotanicalCyan;
      ctx.globalAlpha = 0.44 * pulse;
      ctx.lineWidth = 1.3;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(TRAFFIC_ISLAND_ANCHORS[1].nx * w, TRAFFIC_ISLAND_ANCHORS[1].ny * h);
      ctx.quadraticCurveTo(w * 0.36, h * 0.46, TRAFFIC_ISLAND_ANCHORS[0].nx * w, TRAFFIC_ISLAND_ANCHORS[0].ny * h);
      ctx.quadraticCurveTo(w * 0.65, h * 0.46, TRAFFIC_ISLAND_ANCHORS[2].nx * w, TRAFFIC_ISLAND_ANCHORS[2].ny * h);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    for (var i = 0; i < TRAFFIC_ISLAND_ANCHORS.length; i++) {
      var anc = TRAFFIC_ISLAND_ANCHORS[i];
      if (!fullXRay && anc.id !== focusId) continue;
      var cx = anc.nx * w, cy = anc.ny * h, rx = anc.rx * w, ry = anc.ry * h;
      var halo = ctx.createRadialGradient(cx, cy, rx * 0.15, cx, cy, Math.max(rx, ry) * 2.15);
      halo.addColorStop(0, "rgba(143, 224, 184, 0.34)");
      halo.addColorStop(0.55, "rgba(230, 201, 122, 0.16)");
      halo.addColorStop(1, "rgba(143, 224, 184, 0.0)");
      ctx.globalAlpha = pulse;
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(rx, ry) * 2.15, 0, Math.PI * 2);
      ctx.fill();

      for (var ring = 1; ring <= 3; ring++) {
        ctx.strokeStyle = ring === 1 ? STREET_PALETTE.xrayRootGold : STREET_PALETTE.xrayBotanicalCyan;
        ctx.globalAlpha = (0.78 - ring * 0.18) * pulse;
        ctx.lineWidth = ring === 1 ? 1.6 : 1.0;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * (0.72 + ring * 0.38), ry * (0.72 + ring * 0.38), 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.strokeStyle = STREET_PALETTE.xrayRootGold;
      ctx.globalAlpha = 0.82 * pulse;
      ctx.lineWidth = 1.2;
      for (var br = 0; br < 8; br++) {
        var ang = br * (Math.PI * 0.25) + 0.22;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(cx + Math.cos(ang + 0.25) * rx * 0.72, cy + Math.sin(ang + 0.25) * ry * 0.72, cx + Math.cos(ang) * rx * 1.35, cy + Math.sin(ang) * ry * 1.35);
        ctx.stroke();
      }

      if (w >= 340) {
        ctx.font = (w < 520 ? "600 10px " : "600 11px ") + "Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillStyle = STREET_PALETTE.xrayRootGold;
        ctx.globalAlpha = 0.94;
        ctx.fillText(anc.name, cx, cy - ry * 1.28);
      }
    }
    ctx.restore();
  }

  function cecStreetNormalizeBearing(rawBearing) {
    var b = String(rawBearing || "north").toLowerCase().trim();
    if (b === "east" || b === "e") return "east";
    if (b === "south" || b === "s") return "south";
    if (b === "west" || b === "w") return "west";
    return "north";
  }

  function cecStreetCreateBoundlessStreets(opts) {
    var cfg = opts || {};
    var initialEra = cecSprawlClamp(cfg.initialEra !== undefined ? cfg.initialEra : 0.15, 0, 1);
    var defaultSummary = "Walk toward any compass bearing to test whether an outside beyond Cecilia still exists.";
    var cecState = {
      width: Math.max(240, Number(cfg.width) || 1280),
      height: Math.max(240, Number(cfg.height) || 800),
      eraProgress: initialEra,
      botanicalXRay: false,
      highlightedIslandId: null,
      exitAttempts: 0,
      failedExitAttempts: 0,
      lastExitResult: { attempted: false, bearing: "none", escapedCity: false, outsideExists: initialEra < 0.88, summary: defaultSummary },
      toroidalPan: { x: 0, y: 0 },
      toroidalPanTarget: { x: 0, y: 0 },
      reducedMotion: Boolean(cfg.reducedMotion),
      clockSec: 0
    };

    function cecStreetBuildSnapshot() {
      var era = cecState.eraProgress;
      var phase = era < 0.55 ? "youthful_pastures" : (era < 0.88 ? "encroaching_conurbation" : "mingled_everywhere");
      var cov = era >= 0.88 ? 1.0 : Number((0.14 + (era / 0.88) * 0.86).toFixed(4));
      var islands = [];
      for (var i = 0; i < TRAFFIC_ISLAND_ANCHORS.length; i++) {
        var a = TRAFFIC_ISLAND_ANCHORS[i];
        islands.push({
          id: a.id, name: a.name, nx: a.nx, ny: a.ny, rx: a.rx, ry: a.ry, streetContext: a.streetContext,
          engulfedByAsphalt: era >= 0.80, concreteCurbSealed: era >= 0.88, botanicalGhostPresent: true
        });
      }
      var lr = cecState.lastExitResult;
      return {
        eraProgress: era,
        eraPhase: phase,
        urbanCoverage: cov,
        outsideExists: era < 0.88,
        pasturesMingledWithStreets: era >= 0.88,
        tollGatesIntact: era < 0.45,
        botanicalXRay: cecState.botanicalXRay,
        activeStreetBlocks: Math.round(12 + era * 84),
        trafficIslands: islands,
        highlightedIslandId: cecState.highlightedIslandId,
        exitAttempts: cecState.exitAttempts,
        failedExitAttempts: cecState.failedExitAttempts,
        lastExitResult: { attempted: lr.attempted, bearing: lr.bearing, escapedCity: lr.escapedCity, outsideExists: lr.outsideExists, summary: lr.summary },
        toroidalPan: { x: Number(cecState.toroidalPan.x.toFixed(2)), y: Number(cecState.toroidalPan.y.toFixed(2)) },
        reducedMotion: cecState.reducedMotion
      };
    }

    function cecStreetSetEraProgress(v) {
      cecState.eraProgress = cecSprawlClamp(v, 0, 1);
      if (!cecState.lastExitResult.attempted) {
        cecState.lastExitResult.outsideExists = cecState.eraProgress < 0.88;
      }
      return cecStreetBuildSnapshot();
    }

    function cecStreetAttemptExit(bearing) {
      var dir = cecStreetNormalizeBearing(bearing);
      cecState.exitAttempts += 1;
      var hasOutside = cecState.eraProgress < 0.88;
      var summary = "";
      if (hasOutside) {
        var destMap = { north: "Meadow of the Low Sage", west: "The Goat's Slope", east: "The Crossroads of the Wind", south: "the southern thyme hills" };
        summary = "Exited Cecilia heading " + dir + " past the watchmen's threshold into open pasture toward " + destMap[dir] + ".";
        cecState.lastExitResult = { attempted: true, bearing: dir, escapedCity: true, outsideExists: true, summary: summary };
      } else {
        cecState.failedExitAttempts += 1;
        var strideX = cecState.width / 12 * 1.65;
        var strideY = cecState.height / 8 * 1.65;
        if (dir === "east") cecState.toroidalPanTarget.x -= strideX;
        if (dir === "west") cecState.toroidalPanTarget.x += strideX;
        if (dir === "north") cecState.toroidalPanTarget.y += strideY;
        if (dir === "south") cecState.toroidalPanTarget.y -= strideY;
        var snapFrac = cecState.reducedMotion ? 1.0 : 0.55;
        cecState.toroidalPan.x = cecSprawlMix(cecState.toroidalPan.x, cecState.toroidalPanTarget.x, snapFrac);
        cecState.toroidalPan.y = cecSprawlMix(cecState.toroidalPan.y, cecState.toroidalPanTarget.y, snapFrac);
        summary = "Walked " + dir + " down identical porticoes and merged tenements; no gate remains—the places have mingled and Cecilia is everywhere.";
        cecState.lastExitResult = { attempted: true, bearing: dir, escapedCity: false, outsideExists: false, summary: summary };
      }
      return {
        attempted: true, bearing: dir, escapedCity: cecState.lastExitResult.escapedCity, outsideExists: cecState.lastExitResult.outsideExists,
        exitAttempts: cecState.exitAttempts, failedExitAttempts: cecState.failedExitAttempts,
        toroidalPan: { x: cecState.toroidalPan.x, y: cecState.toroidalPan.y }, summary: summary
      };
    }

    function cecStreetStep(dtSec) {
      var dt = cecSprawlClamp(dtSec, 0, 0.25);
      if (cecState.reducedMotion) {
        cecState.toroidalPan.x = cecState.toroidalPanTarget.x;
        cecState.toroidalPan.y = cecState.toroidalPanTarget.y;
        return;
      }
      cecState.clockSec += dt;
      var ease = 1.0 - Math.exp(-dt * 6.5);
      cecState.toroidalPan.x = cecSprawlMix(cecState.toroidalPan.x, cecState.toroidalPanTarget.x, ease);
      cecState.toroidalPan.y = cecSprawlMix(cecState.toroidalPan.y, cecState.toroidalPanTarget.y, ease);
    }

    function cecStreetRender(ctx, w, h, renderOpts) {
      if (!ctx) return;
      var vw = Math.max(1, Number(w) || cecState.width);
      var vh = Math.max(1, Number(h) || cecState.height);
      cecState.width = vw;
      cecState.height = vh;
      var snap = cecStreetBuildSnapshot();
      var recId = (renderOpts && renderOpts.recognizedIslandId) || null;
      cecSprawlPaintCountryside(ctx, vw, vh, snap.eraProgress, cecState.clockSec, snap.reducedMotion);
      cecSprawlPaintMingledStreets(ctx, vw, vh, snap, cecState.clockSec);
      cecSprawlPaintLimestoneCore(ctx, vw, vh, snap);
      cecSprawlPaintTrafficIslands(ctx, vw, vh, snap, recId, cecState.clockSec);
      cecSprawlPaintBotanicalXRay(ctx, vw, vh, snap, recId, cecState.clockSec);
    }

    function cecStreetInspectAt(px, py, w, h) {
      var vw = Math.max(1, Number(w) || cecState.width);
      var vh = Math.max(1, Number(h) || cecState.height);
      if (!Number.isFinite(px) || !Number.isFinite(py) || px < 0 || py < 0 || px > vw || py > vh) return null;
      var era = cecState.eraProgress;
      for (var i = 0; i < TRAFFIC_ISLAND_ANCHORS.length; i++) {
        var anc = TRAFFIC_ISLAND_ANCHORS[i];
        var rxPx = Math.max(26, anc.rx * vw * 1.32);
        var ryPx = Math.max(22, anc.ry * vh * 1.32);
        if (Math.hypot((px - anc.nx * vw) / rxPx, (py - anc.ny * vh) / ryPx) <= 1.0) {
          var isMingled = era >= 0.88;
          var isEngulfed = era >= 0.80;
          return {
            id: anc.id,
            stoneId: (anc.id === "meadow_of_the_low_sage" && isMingled) ? "traffic_island_recognition" : anc.id,
            title: isEngulfed ? (anc.name + " (" + anc.streetContext + ")") : anc.name,
            category: isEngulfed ? "traffic_island" : "named_pasture",
            detail: isMingled
              ? "Sealed inside a concrete curb amid rotary lanes, ghost roots and dusty blades of " + anc.name + " persist beneath the asphalt."
              : "Named Mediterranean pasture known by bell and scent beyond Cecilia's leafless stone interval."
          };
        }
      }
      if (era < 0.45) {
        var gates = cecSprawlGateCoords(vw, vh, era);
        for (var gi = 0; gi < gates.length; gi++) {
          var gt = gates[gi];
          if (Math.hypot(px - gt.x, py - gt.y) <= 22) {
            return {
              id: gt.id, stoneId: "leafless_nameless_interval", title: gt.label, category: "toll_gate",
              detail: "Watchmen and toll-collectors stand at the limestone gate, herding startled goats back toward " + gt.pastureName + "."
            };
          }
        }
      }
      if (era >= 0.88 || cecSprawlUrbanFieldAt(px / vw, py / vh, era) >= 0.5) {
        return {
          id: era >= 0.88 ? "boundless_mingled_avenue" : "limestone_city_alley",
          stoneId: era >= 0.55 ? "endless_identical_streets" : "leafless_nameless_interval",
          title: era >= 0.88 ? "Boundless Mingled Streets & Tenements" : "Leafless Stone Alleyway",
          category: era >= 0.88 ? "mingled_street" : "city_alley",
          detail: era >= 0.88
            ? "Uninterrupted porticoes, sodium lamps, and concrete tenements where neighboring cities have fused and no outside remains."
            : "Narrow paved interval without a leaf, crossed hurriedly between open named pastures."
        };
      }
      return null;
    }

    function cecStreetHighlightIsland(islandId) {
      var matched = null;
      for (var i = 0; islandId && i < TRAFFIC_ISLAND_ANCHORS.length; i++) {
        if (TRAFFIC_ISLAND_ANCHORS[i].id === islandId) matched = islandId;
      }
      cecState.highlightedIslandId = matched;
      return cecStreetBuildSnapshot();
    }

    function cecStreetReset() {
      cecState.eraProgress = initialEra;
      cecState.botanicalXRay = false;
      cecState.highlightedIslandId = null;
      cecState.exitAttempts = 0;
      cecState.failedExitAttempts = 0;
      cecState.toroidalPan = { x: 0, y: 0 };
      cecState.toroidalPanTarget = { x: 0, y: 0 };
      cecState.clockSec = 0;
      cecState.lastExitResult = { attempted: false, bearing: "none", escapedCity: false, outsideExists: initialEra < 0.88, summary: defaultSummary };
      return cecStreetBuildSnapshot();
    }

    return {
      STREET_PALETTE: STREET_PALETTE,
      TRAFFIC_ISLAND_ANCHORS: TRAFFIC_ISLAND_ANCHORS,
      getState: cecStreetBuildSnapshot,
      setViewport: function cecStreetSetViewport(w, h) {
        cecState.width = Math.max(240, Number(w) || cecState.width);
        cecState.height = Math.max(240, Number(h) || cecState.height);
        return cecStreetBuildSnapshot();
      },
      setReducedMotion: function cecStreetSetReducedMotion(flag) {
        cecState.reducedMotion = Boolean(flag);
        if (cecState.reducedMotion) {
          cecState.toroidalPan.x = cecState.toroidalPanTarget.x;
          cecState.toroidalPan.y = cecState.toroidalPanTarget.y;
        }
        return cecStreetBuildSnapshot();
      },
      setEraProgress: cecStreetSetEraProgress,
      mingleAllPlaces: function cecStreetMingleAllPlaces() { return cecStreetSetEraProgress(1.0); },
      setBotanicalXRay: function cecStreetSetBotanicalXRay(flag) { cecState.botanicalXRay = Boolean(flag); return cecStreetBuildSnapshot(); },
      toggleBotanicalXRay: function cecStreetToggleBotanicalXRay() { cecState.botanicalXRay = !cecState.botanicalXRay; return cecStreetBuildSnapshot(); },
      highlightIsland: cecStreetHighlightIsland,
      attemptExit: cecStreetAttemptExit,
      step: cecStreetStep,
      render: cecStreetRender,
      inspectAt: cecStreetInspectAt,
      reset: cecStreetReset
    };
  }

  var cecStreetModuleApi = {
    STREET_PALETTE: STREET_PALETTE,
    TRAFFIC_ISLAND_ANCHORS: TRAFFIC_ISLAND_ANCHORS,
    createBoundlessStreets: cecStreetCreateBoundlessStreets
  };

  if (typeof globalThis !== "undefined") globalThis.CeciliaBoundlessStreets = cecStreetModuleApi;
  if (typeof window !== "undefined") window.CeciliaBoundlessStreets = cecStreetModuleApi;
  if (typeof module === "object" && module.exports) module.exports = cecStreetModuleApi;
})();
