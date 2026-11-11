(function initTrudeSuburbDetails(root) {
  "use strict";

  var TAU = Math.PI * 2;

  var PALETTE = Object.freeze({
    asphalt_tarmac: "#1E2224",
    tin_warehouse_dark: "#3A4144",
    tin_roof_zinc: "#7E878A",
    suburb_yellowish_ochre: "#C8B868",
    suburb_ochre_shadow: "#9C8E47",
    suburb_greenish_lichen: "#6C8364",
    suburb_green_shadow: "#4B5E46",
    roundabout_marigold: "#D4953B",
    roundabout_geranium: "#C46238",
    placard_amber_ivory: "#F2E5BE",
    goblet_celadon_glass: "#9EB59E",
    overcast_continuum_sky: "#2B3130"
  });

  var LOCI = Object.freeze([
    Object.freeze({
      index: 0,
      id: "airport_suburb_road",
      keyNum: 1,
      label: "Yellow-Green Suburbs & Tin Sheds",
      shortLabel: "Suburbs & Sheds"
    }),
    Object.freeze({
      index: 1,
      id: "flower_roundabout",
      keyNum: 2,
      label: "Flower-Bed Roundabout Squares",
      shortLabel: "Roundabouts"
    }),
    Object.freeze({
      index: 2,
      id: "hardware_store",
      keyNum: 3,
      label: "Hardware Buyers Verbatim Counter",
      shortLabel: "Hardware Buyers"
    }),
    Object.freeze({
      index: 3,
      id: "hotel_goblet_bar",
      keyNum: 4,
      label: "Hotel Mirror & Caterpillar Goblet",
      shortLabel: "Caterpillar Goblet"
    })
  ]);

  var HARDWARE_DIALOGUE_SCRIPT = Object.freeze([
    Object.freeze({
      turnIndex: 0,
      speaker: "Hardware Buyer",
      itemCode: "ELB-3/8-GALV",
      utterance: "Three dozen three-eighths galvanized elbows, threaded both ends, packed dry in greased paper before the drizzle sets in."
    }),
    Object.freeze({
      turnIndex: 1,
      speaker: "Hardware Seller",
      itemCode: "ZNC-26G-CORR",
      utterance: "Same crate tally as Tuesday's freight: twenty-six-gauge corrugated zinc roof sheets, eight ridges to the width, stacked by bay four."
    }),
    Object.freeze({
      turnIndex: 2,
      speaker: "Traveler",
      itemCode: "LCH-MRT-BRS4",
      utterance: "Do the suburban shutter latches still take the four-millimeter brass mortise pin with the beveled strike plate?"
    }),
    Object.freeze({
      turnIndex: 3,
      speaker: "Hardware Seller",
      itemCode: "LCH-MRT-BRS4",
      utterance: "Every yellow and green casement along the airport road takes that exact mortise pin; we never cast another gauge."
    }),
    Object.freeze({
      turnIndex: 4,
      speaker: "Hardware Buyer",
      itemCode: "WSH-LEAD-09",
      utterance: "Weigh out two kilos of lead roofing washers as well; the afternoon siding train always halts ten minutes behind the timetable."
    }),
    Object.freeze({
      turnIndex: 5,
      speaker: "Traveler",
      itemCode: "INV-TALLY-44",
      utterance: "Word for syllable, bolt for washer, this is the identical counter ledger I heard at the last airport."
    })
  ]);

  var GOBLET_RELIEF_SPEC = Object.freeze({
    motif: "leaves_and_caterpillars",
    leafCount: 8,
    caterpillarCount: 3,
    segmentsPerCaterpillar: 11,
    rimDiameterMm: 76,
    reliefDepthMm: 1.8,
    reliefHash: "TRD-LEAF-CAT-44"
  });

  var HOTEL_MIRROR_SPEC = Object.freeze({
    frameMoldings: 4,
    lampReflectionX: 0.72,
    bedpostReflectionX: 0.28,
    logicHash: "TRD-MIRROR-44",
    identicalLogic: true
  });

  var SUBURB_BLOCKS = Object.freeze([
    { nx: 0.08, ny: 0.30, nw: 0.12, nh: 0.09, hue: "yellow", floors: 2 },
    { nx: 0.23, ny: 0.28, nw: 0.12, nh: 0.09, hue: "green", floors: 2 },
    { nx: 0.38, ny: 0.27, nw: 0.12, nh: 0.09, hue: "yellow", floors: 3 },
    { nx: 0.54, ny: 0.27, nw: 0.12, nh: 0.09, hue: "green", floors: 2 },
    { nx: 0.70, ny: 0.28, nw: 0.12, nh: 0.09, hue: "yellow", floors: 2 },
    { nx: 0.85, ny: 0.30, nw: 0.11, nh: 0.09, hue: "green", floors: 3 },
    { nx: 0.07, ny: 0.70, nw: 0.13, nh: 0.11, hue: "green", floors: 2 },
    { nx: 0.23, ny: 0.72, nw: 0.13, nh: 0.11, hue: "yellow", floors: 3 },
    { nx: 0.39, ny: 0.73, nw: 0.13, nh: 0.11, hue: "green", floors: 2 },
    { nx: 0.56, ny: 0.73, nw: 0.13, nh: 0.11, hue: "yellow", floors: 2 },
    { nx: 0.72, ny: 0.72, nw: 0.13, nh: 0.11, hue: "green", floors: 3 },
    { nx: 0.87, ny: 0.70, nw: 0.11, nh: 0.11, hue: "yellow", floors: 2 }
  ]);

  var TIN_WAREHOUSES = Object.freeze([
    { nx: 0.09, ny: 0.43, nw: 0.15, nh: 0.10, flue: true, bays: 3 },
    { nx: 0.28, ny: 0.42, nw: 0.15, nh: 0.10, flue: false, bays: 4 },
    { nx: 0.62, ny: 0.42, nw: 0.15, nh: 0.10, flue: true, bays: 3 },
    { nx: 0.81, ny: 0.43, nw: 0.15, nh: 0.10, flue: false, bays: 3 },
    { nx: 0.08, ny: 0.57, nw: 0.15, nh: 0.10, flue: false, bays: 3 },
    { nx: 0.27, ny: 0.58, nw: 0.15, nh: 0.10, flue: true, bays: 4 },
    { nx: 0.63, ny: 0.58, nw: 0.15, nh: 0.10, flue: false, bays: 3 },
    { nx: 0.82, ny: 0.57, nw: 0.15, nh: 0.10, flue: true, bays: 3 }
  ]);

  var ROUNDABOUT_SQUARES = Object.freeze([
    { index: 0, id: "sq_nw", code: "SQ-I", label: "Marigold & Geranium Square I (NW)", cx: 0.29, cy: 0.34 },
    { index: 1, id: "sq_ne", code: "SQ-II", label: "Marigold & Geranium Square II (NE)", cx: 0.71, cy: 0.34 },
    { index: 2, id: "sq_sw", code: "SQ-III", label: "Marigold & Geranium Square III (SW)", cx: 0.29, cy: 0.71 },
    { index: 3, id: "sq_se", code: "SQ-IV", label: "Marigold & Geranium Square IV (SE)", cx: 0.71, cy: 0.71 }
  ]);

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function setDash(ctx, pattern) {
    if (typeof ctx.setLineDash === "function") {
      ctx.setLineDash(pattern);
    }
  }

  function drawEllipse(ctx, cx, cy, rx, ry, rot) {
    ctx.beginPath();
    if (typeof ctx.ellipse === "function") {
      ctx.ellipse(cx, cy, Math.max(0.5, rx), Math.max(0.5, ry), rot || 0, 0, TAU);
    } else {
      ctx.save();
      ctx.translate(cx, cy);
      if (rot) ctx.rotate(rot);
      ctx.scale(Math.max(0.5, rx), Math.max(0.5, ry));
      ctx.arc(0, 0, 1, 0, TAU);
      ctx.restore();
    }
  }

  function drawRoundBox(ctx, x, y, w, h, r) {
    var rad = Math.max(0, Math.min(r || 0, Math.min(w, h) * 0.5));
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.arcTo(x + w, y, x + w, y + rad, rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.arcTo(x + w, y + h, x + w - rad, y + h, rad);
    ctx.lineTo(x + rad, y + h);
    ctx.arcTo(x, y + h, x, y + h - rad, rad);
    ctx.lineTo(x, y + rad);
    ctx.arcTo(x, y, x + rad, y, rad);
    ctx.closePath();
  }

  function wrapWords(text, maxChars) {
    var words = String(text || "").split(" ");
    var lines = [];
    var cur = "";
    for (var i = 0; i < words.length; i++) {
      var next = cur ? cur + " " + words[i] : words[i];
      if (next.length > maxChars && cur) {
        lines.push(cur);
        cur = words[i];
      } else {
        cur = next;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function drawPlacardPost(ctx, x, y, w, h, code, letters, subline) {
    ctx.save();
    drawRoundBox(ctx, x, y, w, h, 4);
    ctx.fillStyle = PALETTE.asphalt_tarmac;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = PALETTE.placard_amber_ivory;
    ctx.stroke();
    var fontPx = Math.max(9, Math.min(13, Math.floor(h * 0.34)));
    ctx.fillStyle = PALETTE.placard_amber_ivory;
    ctx.font = "700 " + fontPx + "px monospace";
    ctx.textBaseline = "middle";
    var headline = String(code || "TRD-01") + " · " + String(letters || "TRUDE CENTRAL");
    ctx.fillText(headline.slice(0, 32), x + 8, y + h * 0.37);
    ctx.fillStyle = PALETTE.suburb_yellowish_ochre;
    ctx.font = "500 " + Math.max(8, fontPx - 2) + "px monospace";
    ctx.fillText(String(subline || "INVARIANT SUBURB SECTOR"), x + 8, y + h * 0.73);
    ctx.restore();
  }

  function drawStuccoBlock(ctx, x, y, w, h, hue, floors) {
    var roofH = Math.max(7, h * 0.24);
    var sideW = Math.max(8, w * 0.18);
    var frontW = w - sideW;
    var lit = hue === "yellow" ? PALETTE.suburb_yellowish_ochre : PALETTE.suburb_greenish_lichen;
    var shd = hue === "yellow" ? PALETTE.suburb_ochre_shadow : PALETTE.suburb_green_shadow;
    ctx.fillStyle = lit;
    ctx.fillRect(x, y + roofH, frontW, h - roofH);
    ctx.fillStyle = shd;
    ctx.beginPath();
    ctx.moveTo(x + frontW, y + roofH);
    ctx.lineTo(x + w, y + roofH * 0.55);
    ctx.lineTo(x + w, y + h - roofH * 0.45);
    ctx.lineTo(x + frontW, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = PALETTE.tin_warehouse_dark;
    ctx.beginPath();
    ctx.moveTo(x - 2, y + roofH);
    ctx.lineTo(x + sideW * 0.8, y);
    ctx.lineTo(x + w + 1, y + roofH * 0.55);
    ctx.lineTo(x + frontW, y + roofH);
    ctx.closePath();
    ctx.fill();
    var cols = Math.max(2, Math.min(4, Math.floor(frontW / 24)));
    var rows = floors || 2;
    var winW = Math.max(4, frontW / (cols * 2.5));
    var winH = Math.max(5, (h - roofH) / (rows * 2.1));
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var wx = x + (c + 0.55) * (frontW / cols) - winW * 0.5;
        var wy = y + roofH + (r + 0.48) * ((h - roofH) / rows) - winH * 0.4;
        ctx.fillStyle = hue === "yellow" ? PALETTE.suburb_green_shadow : PALETTE.suburb_ochre_shadow;
        ctx.fillRect(wx - 2, wy, winW + 4, winH);
        ctx.fillStyle = PALETTE.asphalt_tarmac;
        ctx.fillRect(wx, wy + 1, winW, winH - 2);
      }
    }
  }

  function drawTinWarehouse(ctx, x, y, w, h, bays, flue, smokePhase) {
    var roofH = Math.max(8, h * 0.34);
    ctx.fillStyle = PALETTE.tin_warehouse_dark;
    ctx.fillRect(x, y + roofH, w, h - roofH);
    ctx.fillStyle = PALETTE.tin_roof_zinc;
    ctx.beginPath();
    ctx.moveTo(x - 3, y + roofH);
    ctx.lineTo(x + w * 0.14, y);
    ctx.lineTo(x + w + 2, y);
    ctx.lineTo(x + w + 3, y + roofH);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = PALETTE.asphalt_tarmac;
    ctx.lineWidth = 1;
    var seams = 9;
    for (var s = 1; s < seams; s++) {
      var sx = x + (w * s) / seams;
      ctx.beginPath();
      ctx.moveTo(sx, y + roofH);
      ctx.lineTo(sx + w * 0.08, y + 1);
      ctx.stroke();
    }
    var bayCount = bays || 3;
    var bw = (w * 0.72) / bayCount;
    for (var b = 0; b < bayCount; b++) {
      var bx = x + w * 0.08 + b * (bw + w * 0.05);
      var by = y + roofH + (h - roofH) * 0.28;
      ctx.fillStyle = PALETTE.asphalt_tarmac;
      ctx.fillRect(bx, by, bw * 0.82, (h - roofH) * 0.72);
      ctx.strokeStyle = PALETTE.tin_roof_zinc;
      ctx.strokeRect(bx, by, bw * 0.82, (h - roofH) * 0.72);
    }
    if (flue) {
      var fx = x + w * 0.84;
      var fy = y - h * 0.22;
      ctx.fillStyle = PALETTE.tin_warehouse_dark;
      ctx.fillRect(fx, fy, Math.max(5, w * 0.07), h * 0.34);
      ctx.fillStyle = "rgba(200, 184, 104, 0.22)";
      for (var p = 0; p < 3; p++) {
        var drift = ((smokePhase + p * 0.33) % 1);
        drawEllipse(ctx, fx + 4 + drift * 18, fy - 5 - drift * 16, 4 + drift * 6, 3 + drift * 4, 0);
        ctx.fill();
      }
    }
  }

  function renderSuburbRoadLocus(ctx, w, h, anim, placardCode, placardLetters, hitZones) {
    var skyGrad = ctx.createLinearGradient ? ctx.createLinearGradient(0, 0, 0, h * 0.28) : null;
    if (skyGrad) {
      skyGrad.addColorStop(0, PALETTE.overcast_continuum_sky);
      skyGrad.addColorStop(1, "#3D4640");
      ctx.fillStyle = skyGrad;
    } else {
      ctx.fillStyle = PALETTE.overcast_continuum_sky;
    }
    ctx.fillRect(0, 0, w, h * 0.26);
    ctx.fillStyle = "#333A37";
    ctx.fillRect(0, h * 0.24, w, h * 0.76);
    for (var band = 0; band < 18; band++) {
      ctx.fillStyle = band % 2 === 0 ? PALETTE.suburb_ochre_shadow : PALETTE.suburb_green_shadow;
      ctx.fillRect((band * w) / 18, h * 0.20, w / 19, h * 0.045);
    }
    var roadY = h * 0.51;
    var roadH = h * 0.085;
    ctx.fillStyle = PALETTE.asphalt_tarmac;
    ctx.fillRect(0, roadY, w, roadH);
    ctx.fillRect(w * 0.46, h * 0.24, w * 0.08, h * 0.76);
    ctx.save();
    ctx.strokeStyle = PALETTE.suburb_yellowish_ochre;
    ctx.lineWidth = 2;
    setDash(ctx, [12, 10]);
    ctx.beginPath();
    ctx.moveTo(0, roadY + roadH * 0.5);
    ctx.lineTo(w, roadY + roadH * 0.5);
    ctx.moveTo(w * 0.50, h * 0.25);
    ctx.lineTo(w * 0.50, h);
    ctx.stroke();
    setDash(ctx, []);
    ctx.restore();

    for (var i = 0; i < SUBURB_BLOCKS.length; i++) {
      var sb = SUBURB_BLOCKS[i];
      var bx = sb.nx * w, by = sb.ny * h, bw = sb.nw * w, bh = sb.nh * h;
      drawStuccoBlock(ctx, bx, by, bw, bh, sb.hue, sb.floors);
      hitZones.push({ type: "suburb_block", locus: "airport_suburb_road", label: (sb.hue === "yellow" ? "Yellowish" : "Greenish") + " Stucco Row #" + (i + 1), x: bx, y: by, w: bw, h: bh });
    }
    for (var k = 0; k < TIN_WAREHOUSES.length; k++) {
      var tw = TIN_WAREHOUSES[k];
      var wx = tw.nx * w, wy = tw.ny * h, ww = tw.nw * w, wh = tw.nh * h;
      drawTinWarehouse(ctx, wx, wy, ww, wh, tw.bays, tw.flue, anim.smokePhase);
      hitZones.push({ type: "warehouse", locus: "airport_suburb_road", label: "Corrugated Zinc-Tin Warehouse #" + (k + 1), x: wx, y: wy, w: ww, h: wh });
    }
    for (var v = 0; v < 4; v++) {
      var vx = (((anim.vehiclePhase + v * 0.25) % 1) * (w + 40)) - 20;
      var vy = v % 2 === 0 ? roadY + roadH * 0.22 : roadY + roadH * 0.66;
      ctx.fillStyle = v % 2 === 0 ? PALETTE.roundabout_marigold : PALETTE.tin_roof_zinc;
      drawRoundBox(ctx, vx, vy, 18, 9, 2);
      ctx.fill();
    }
    var pw = Math.min(265, w * 0.44);
    drawPlacardPost(ctx, w * 0.03, h * 0.05, pw, 42, placardCode, placardLetters, "AIRPORT ROAD · 12 BLOCKS · 8 TIN SHEDS");
  }

  function renderFlowerRoundaboutLocus(ctx, w, h, anim, placardCode, placardLetters, hitZones) {
    ctx.fillStyle = "#313835";
    ctx.fillRect(0, 0, w, h);
    var minDim = Math.min(w, h);
    var roadHalf = Math.max(16, minDim * 0.048);
    ctx.fillStyle = PALETTE.asphalt_tarmac;
    for (var g = 0; g < ROUNDABOUT_SQUARES.length; g++) {
      var rs = ROUNDABOUT_SQUARES[g];
      ctx.fillRect(0, rs.cy * h - roadHalf, w, roadHalf * 2);
      ctx.fillRect(rs.cx * w - roadHalf, 0, roadHalf * 2, h);
    }
    var cornerCoords = [
      [0.04, 0.14], [0.46, 0.14], [0.84, 0.14],
      [0.04, 0.49], [0.46, 0.49], [0.84, 0.49],
      [0.04, 0.84], [0.46, 0.84], [0.84, 0.84]
    ];
    for (var c = 0; c < cornerCoords.length; c++) {
      var cx0 = cornerCoords[c][0] * w, cy0 = cornerCoords[c][1] * h;
      var cw = w * 0.11, ch = h * 0.09;
      drawStuccoBlock(ctx, cx0, cy0, cw, ch, c % 2 === 0 ? "yellow" : "green", 2);
      hitZones.push({ type: "suburb_block", locus: "flower_roundabout", label: "Provincial Square Facade #" + (c + 1), x: cx0, y: cy0, w: cw, h: ch });
    }
    var outerR = Math.max(38, minDim * 0.145);
    var bedR = outerR * 0.56;
    for (var s = 0; s < ROUNDABOUT_SQUARES.length; s++) {
      var sq = ROUNDABOUT_SQUARES[s];
      var sx = sq.cx * w, sy = sq.cy * h;
      drawEllipse(ctx, sx, sy, outerR, outerR, 0);
      ctx.fillStyle = PALETTE.asphalt_tarmac;
      ctx.fill();
      ctx.strokeStyle = PALETTE.tin_roof_zinc;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.save();
      setDash(ctx, [7, 6]);
      ctx.strokeStyle = "rgba(242, 229, 190, 0.52)";
      ctx.lineWidth = 1.4;
      drawEllipse(ctx, sx, sy, (outerR + bedR) * 0.5, (outerR + bedR) * 0.5, 0);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(sx - outerR * 1.45, sy - roadHalf * 0.48);
      ctx.quadraticCurveTo(sx - outerR * 0.95, sy - outerR * 0.78, sx, sy - (outerR + bedR) * 0.5);
      ctx.stroke();
      setDash(ctx, []);
      ctx.restore();

      drawEllipse(ctx, sx, sy, bedR, bedR, 0);
      ctx.fillStyle = PALETTE.suburb_green_shadow;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = PALETTE.placard_amber_ivory;
      ctx.stroke();
      drawEllipse(ctx, sx, sy, bedR * 0.82, bedR * 0.82, 0);
      ctx.fillStyle = PALETTE.roundabout_geranium;
      ctx.fill();
      drawEllipse(ctx, sx, sy, bedR * 0.52, bedR * 0.52, 0);
      ctx.fillStyle = PALETTE.roundabout_marigold;
      ctx.fill();
      for (var p = 0; p < 10; p++) {
        var pa = (p / 10) * TAU;
        drawEllipse(ctx, sx + Math.cos(pa) * bedR * 0.68, sy + Math.sin(pa) * bedR * 0.68, 3, 3, 0);
        ctx.fillStyle = PALETTE.placard_amber_ivory;
        ctx.fill();
      }
      drawEllipse(ctx, sx, sy, bedR * 0.18, bedR * 0.18, 0);
      ctx.fillStyle = PALETTE.asphalt_tarmac;
      ctx.fill();
      for (var v = 0; v < 2; v++) {
        var ang = anim.vehiclePhase * TAU + v * Math.PI + s * 0.5 * Math.PI;
        var vr = (outerR + bedR) * 0.5;
        var vx = sx + Math.cos(ang) * vr, vy = sy + Math.sin(ang) * vr;
        ctx.save();
        ctx.translate(vx, vy);
        ctx.rotate(ang + Math.PI * 0.5);
        ctx.fillStyle = v === 0 ? PALETTE.roundabout_marigold : PALETTE.suburb_yellowish_ochre;
        drawRoundBox(ctx, -8, -4.5, 16, 9, 2);
        ctx.fill();
        ctx.restore();
      }
      hitZones.push({ type: "roundabout", locus: "flower_roundabout", label: sq.label, x: sx - outerR, y: sy - outerR, w: outerR * 2, h: outerR * 2 });
    }
    drawPlacardPost(ctx, w * 0.03, h * 0.03, Math.min(275, w * 0.46), 40, placardCode, placardLetters, "4 FLOWER-BED SQUARES · R=14.0M CLOTHOID");
  }

  function renderHardwareStoreLocus(ctx, w, h, anim, state, placardCode, placardLetters, hitZones) {
    ctx.fillStyle = PALETTE.overcast_continuum_sky;
    ctx.fillRect(0, 0, w, h);
    var drawerTop = h * 0.13, drawerH = h * 0.34, drawerLeft = w * 0.18, drawerW = w * 0.64;
    var cols = 6, rows = 4;
    var cellW = drawerW / cols, cellH = drawerH / rows;
    var codes = ["ELB 3/8", "ZNC 26G", "MRT 4MM", "WSH PB9", "BLT M8", "HNG BRS"];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var dx = drawerLeft + c * cellW + 2, dy = drawerTop + r * cellH + 2;
        ctx.fillStyle = (r + c) % 2 === 0 ? "#3E4742" : PALETTE.tin_warehouse_dark;
        ctx.fillRect(dx, dy, cellW - 4, cellH - 4);
        ctx.strokeStyle = PALETTE.suburb_ochre_shadow;
        ctx.lineWidth = 1;
        ctx.strokeRect(dx, dy, cellW - 4, cellH - 4);
        ctx.fillStyle = PALETTE.placard_amber_ivory;
        ctx.fillRect(dx + cellW * 0.26, dy + 4, cellW * 0.42, Math.max(5, cellH * 0.24));
        ctx.fillStyle = PALETTE.roundabout_marigold;
        drawEllipse(ctx, dx + cellW * 0.47, dy + cellH * 0.66, 3.5, 2.5, 0);
        ctx.fill();
        if (w >= 640 && r === 0) {
          ctx.fillStyle = PALETTE.asphalt_tarmac;
          ctx.font = "700 8px monospace";
          ctx.fillText(codes[c], dx + cellW * 0.28, dy + 11);
        }
      }
    }
    var tinX = w * 0.03, tinY = h * 0.17, tinW = w * 0.12, tinH = h * 0.30;
    ctx.fillStyle = PALETTE.tin_roof_zinc;
    ctx.fillRect(tinX, tinY, tinW, tinH);
    for (var k = 1; k < 7; k++) {
      ctx.strokeStyle = PALETTE.asphalt_tarmac;
      ctx.beginPath();
      ctx.moveTo(tinX + (tinW * k) / 7, tinY);
      ctx.lineTo(tinX + (tinW * k) / 7, tinY + tinH);
      ctx.stroke();
    }
    hitZones.push({ type: "warehouse", locus: "hardware_store", label: "26-Gauge Corrugated Zinc Sample Rack", x: tinX, y: tinY, w: tinW, h: tinH });

    var shX = w * 0.85, shY = h * 0.17, shW = w * 0.12, shH = h * 0.30;
    ctx.fillStyle = PALETTE.suburb_yellowish_ochre;
    ctx.fillRect(shX, shY, shW * 0.5, shH);
    ctx.fillStyle = PALETTE.suburb_greenish_lichen;
    ctx.fillRect(shX + shW * 0.5, shY, shW * 0.5, shH);
    ctx.fillStyle = PALETTE.roundabout_marigold;
    ctx.fillRect(shX + shW * 0.42, shY + shH * 0.46, shW * 0.16, 10);
    hitZones.push({ type: "suburb_block", locus: "hardware_store", label: "Suburban Shutter & 4mm Brass Mortise Sample", x: shX, y: shY, w: shW, h: shH });

    var cntY = h * 0.53;
    ctx.fillStyle = PALETTE.asphalt_tarmac;
    drawEllipse(ctx, w * 0.33, cntY - 34, 15, 16, 0);
    ctx.fill();
    ctx.fillRect(w * 0.29, cntY - 18, w * 0.08, 22);
    ctx.fillStyle = PALETTE.suburb_ochre_shadow;
    drawEllipse(ctx, w * 0.67, cntY - 34, 15, 16, 0);
    ctx.fill();
    ctx.fillRect(w * 0.63, cntY - 18, w * 0.08, 22);

    ctx.fillStyle = PALETTE.tin_warehouse_dark;
    ctx.fillRect(w * 0.04, cntY, w * 0.92, h * 0.43);
    ctx.fillStyle = PALETTE.suburb_ochre_shadow;
    ctx.fillRect(w * 0.04, cntY, w * 0.92, 8);

    var scX = w * 0.50, scY = cntY - 4;
    var tilt = Math.sin(anim.scaleNeedlePhase * 8) * anim.scaleNeedleAmp * 0.18;
    ctx.strokeStyle = PALETTE.roundabout_marigold;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(scX, scY);
    ctx.lineTo(scX, scY - 44);
    ctx.moveTo(scX - 38, scY - 40 - tilt * 35);
    ctx.lineTo(scX + 38, scY - 40 + tilt * 35);
    ctx.stroke();

    var turn = HARDWARE_DIALOGUE_SCRIPT[state.dialogueIndex] || HARDWARE_DIALOGUE_SCRIPT[0];
    var cardX = w * 0.08, cardY = cntY + 18, cardW = w * 0.84, cardH = h * 0.34;
    drawRoundBox(ctx, cardX, cardY, cardW, cardH, 6);
    ctx.fillStyle = PALETTE.asphalt_tarmac;
    ctx.fill();
    ctx.strokeStyle = PALETTE.placard_amber_ivory;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    var bodyPx = Math.max(11, Math.min(15, Math.floor(w * 0.014 + 5)));
    ctx.fillStyle = PALETTE.suburb_yellowish_ochre;
    ctx.font = "700 " + Math.max(10, bodyPx - 2) + "px monospace";
    ctx.fillText("TURN " + (turn.turnIndex + 1) + "/6 · " + turn.speaker.toUpperCase() + " · [" + turn.itemCode + "] · " + placardCode, cardX + 14, cardY + 22);
    ctx.fillStyle = PALETTE.placard_amber_ivory;
    ctx.font = "500 " + bodyPx + "px Georgia, serif";
    var maxCh = Math.max(28, Math.floor((cardW - 28) / (bodyPx * 0.56)));
    var wrapped = wrapWords("\"" + turn.utterance + "\"", maxCh);
    for (var ln = 0; ln < wrapped.length && ln < 4; ln++) {
      ctx.fillText(wrapped[ln], cardX + 14, cardY + 46 + ln * (bodyPx + 6));
    }
    ctx.fillStyle = PALETTE.goblet_celadon_glass;
    ctx.font = "700 " + Math.max(9, bodyPx - 3) + "px monospace";
    ctx.fillText("WORD-FOR-WORD MATCH ACROSS ALL AIRPORTS: 100.0% (VARIANCE: 0 CHARS)", cardX + 14, cardY + cardH - 14);
    hitZones.push({ type: "hardware_counter", locus: "hardware_store", label: "Verbatim Hardware Counter — " + turn.speaker, x: w * 0.04, y: cntY - 48, w: w * 0.92, h: h * 0.48 });
    drawPlacardPost(ctx, w * 0.03, h * 0.03, Math.min(275, w * 0.46), 38, placardCode, placardLetters, "PROVINCIAL HARDWARE LEDGER · 0 DIFF");
  }

  function drawBotanicalLeafRelief(ctx, cx, cy, rx, ry, facing, isFront) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.globalAlpha = isFront ? clamp(0.45 + facing * 0.55, 0.35, 1) : 0.18;
    ctx.fillStyle = isFront ? PALETTE.suburb_greenish_lichen : PALETTE.suburb_green_shadow;
    ctx.beginPath();
    ctx.moveTo(0, -ry);
    var lobes = 5;
    for (var i = 1; i <= lobes; i++) {
      var t = i / (lobes + 1);
      var py = -ry + t * ry * 2;
      var bulge = Math.sin(t * Math.PI) * rx;
      ctx.lineTo(bulge * 1.12, py - ry * 0.06);
      ctx.lineTo(bulge * 0.86, py + ry * 0.05);
    }
    ctx.lineTo(0, ry);
    for (var j = lobes; j >= 1; j--) {
      var tj = j / (lobes + 1);
      var pyj = -ry + tj * ry * 2;
      var bulgeL = Math.sin(tj * Math.PI) * rx;
      ctx.lineTo(-bulgeL * 0.86, pyj + ry * 0.05);
      ctx.lineTo(-bulgeL * 1.12, pyj - ry * 0.06);
    }
    ctx.closePath();
    ctx.fill();
    if (isFront) {
      ctx.strokeStyle = PALETTE.placard_amber_ivory;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -ry * 0.86);
      ctx.lineTo(0, ry * 0.88);
      for (var v = -2; v <= 2; v++) {
        var vy = v * ry * 0.28;
        var vw = Math.cos((v / 3) * 1.1) * rx * 0.72;
        ctx.moveTo(0, vy);
        ctx.lineTo(vw, vy - ry * 0.14);
        ctx.moveTo(0, vy);
        ctx.lineTo(-vw, vy - ry * 0.14);
      }
      ctx.strokeStyle = "rgba(242, 229, 190, 0.75)";
      ctx.lineWidth = 0.9;
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawCaterpillarRelief(ctx, bowlX, bowlY, bowlRx, bowlRy, baseTheta, isFront) {
    var segs = GOBLET_RELIEF_SPEC.segmentsPerCaterpillar;
    ctx.save();
    for (var s = 0; s < segs; s++) {
      var u = s / (segs - 1);
      var segTheta = baseTheta + (u - 0.5) * 0.68;
      var z = Math.cos(segTheta);
      if ((isFront && z < -0.08) || (!isFront && z >= -0.08)) continue;
      var archHump = Math.sin(u * Math.PI) * bowlRy * 0.16;
      var sx = bowlX + Math.sin(segTheta) * bowlRx * 0.91;
      var sy = bowlY + (u - 0.5) * bowlRy * 0.34 - archHump;
      var radX = Math.max(2.2, bowlRx * 0.058 * (0.45 + Math.abs(z) * 0.55));
      var radY = Math.max(3.2, bowlRy * 0.052);
      ctx.globalAlpha = isFront ? clamp(0.55 + z * 0.45, 0.4, 1) : 0.16;
      drawEllipse(ctx, sx + 1.5, sy + 1.8, radX, radY, 0);
      ctx.fillStyle = PALETTE.tin_warehouse_dark;
      ctx.fill();
      drawEllipse(ctx, sx, sy, radX, radY, 0);
      ctx.fillStyle = s === 0 ? PALETTE.roundabout_marigold : PALETTE.goblet_celadon_glass;
      ctx.fill();
      ctx.strokeStyle = PALETTE.placard_amber_ivory;
      ctx.lineWidth = isFront ? 1.1 : 0.5;
      ctx.stroke();
      if (isFront && s > 1 && s < segs - 1 && s % 2 === 0) {
        ctx.beginPath();
        ctx.moveTo(sx, sy + radY);
        ctx.lineTo(sx, sy + radY + 3.2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function renderHotelGobletLocus(ctx, w, h, anim, state, placardCode, placardLetters, hitZones) {
    ctx.fillStyle = PALETTE.overcast_continuum_sky;
    ctx.fillRect(0, 0, w, h);
    var splitCol = w * 0.45;
    ctx.fillStyle = "#262C2B";
    ctx.fillRect(0, 0, splitCol, h);
    ctx.strokeStyle = PALETTE.suburb_ochre_shadow;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(splitCol, h * 0.08);
    ctx.lineTo(splitCol, h * 0.94);
    ctx.stroke();

    var mx = splitCol * 0.14, my = h * 0.16, mw = splitCol * 0.72, mh = h * 0.66;
    for (var m = 0; m < HOTEL_MIRROR_SPEC.frameMoldings; m++) {
      var pad = m * 4.5;
      ctx.strokeStyle = m % 2 === 0 ? PALETTE.suburb_yellowish_ochre : PALETTE.suburb_ochre_shadow;
      ctx.lineWidth = 3;
      ctx.strokeRect(mx + pad, my + pad, mw - pad * 2, mh - pad * 2);
    }
    var ix = mx + 20, iy = my + 20, iw = Math.max(24, mw - 40), ih = Math.max(40, mh - 40);
    ctx.fillStyle = "#36403E";
    ctx.fillRect(ix, iy, iw, ih);
    ctx.fillStyle = PALETTE.suburb_greenish_lichen;
    ctx.fillRect(ix + iw * 0.38, iy + ih * 0.14, iw * 0.24, ih * 0.30);
    ctx.fillStyle = PALETTE.suburb_yellowish_ochre;
    ctx.fillRect(ix + iw * 0.34, iy + ih * 0.14, iw * 0.05, ih * 0.30);
    ctx.fillRect(ix + iw * 0.61, iy + ih * 0.14, iw * 0.05, ih * 0.30);

    var bedX = ix + iw * HOTEL_MIRROR_SPEC.bedpostReflectionX;
    var lampX = ix + iw * HOTEL_MIRROR_SPEC.lampReflectionX;
    ctx.fillStyle = PALETTE.suburb_ochre_shadow;
    ctx.fillRect(bedX - 5, iy + ih * 0.48, 10, ih * 0.44);
    drawEllipse(ctx, bedX, iy + ih * 0.46, 7, 7, 0);
    ctx.fill();
    ctx.fillStyle = PALETTE.roundabout_marigold;
    ctx.beginPath();
    ctx.moveTo(lampX - 14, iy + ih * 0.56);
    ctx.lineTo(lampX - 8, iy + ih * 0.42);
    ctx.lineTo(lampX + 8, iy + ih * 0.42);
    ctx.lineTo(lampX + 14, iy + ih * 0.56);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(lampX - 2, iy + ih * 0.56, 4, ih * 0.24);

    if (state.mirrorRaysVisible) {
      var eyeX = ix + iw * 0.50, eyeY = iy + ih * 0.90;
      ctx.save();
      setDash(ctx, [5, 4]);
      ctx.strokeStyle = PALETTE.placard_amber_ivory;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(eyeX, eyeY);
      ctx.lineTo(bedX, iy + ih * 0.48);
      ctx.lineTo(ix + iw * 0.10, iy + ih * 0.78);
      ctx.moveTo(eyeX, eyeY);
      ctx.lineTo(lampX, iy + ih * 0.49);
      ctx.lineTo(ix + iw * 0.90, iy + ih * 0.78);
      ctx.stroke();
      setDash(ctx, []);
      ctx.restore();
    }
    ctx.fillStyle = PALETTE.placard_amber_ivory;
    ctx.font = "700 10px monospace";
    ctx.fillText("HOTEL MIRROR · " + HOTEL_MIRROR_SPEC.logicHash, mx, my + mh + 18);
    hitZones.push({ type: "mirror", locus: "hotel_goblet_bar", label: "Overnight Hotel Mirror (4 Moldings)", x: mx, y: my, w: mw, h: mh });

    var gx = splitCol + (w - splitCol) * 0.50;
    var bowlY = h * 0.41;
    var bowlRx = Math.min((w - splitCol) * 0.31, h * 0.19);
    var bowlRy = Math.min(h * 0.23, bowlRx * 1.25);

    ctx.fillStyle = "rgba(158, 181, 158, 0.22)";
    ctx.beginPath();
    ctx.moveTo(gx - bowlRx, bowlY - bowlRy * 0.78);
    ctx.bezierCurveTo(gx - bowlRx * 1.06, bowlY + bowlRy * 0.65, gx - bowlRx * 0.32, bowlY + bowlRy * 0.98, gx, bowlY + bowlRy);
    ctx.bezierCurveTo(gx + bowlRx * 0.32, bowlY + bowlRy * 0.98, gx + bowlRx * 1.06, bowlY + bowlRy * 0.65, gx + bowlRx, bowlY - bowlRy * 0.78);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = PALETTE.goblet_celadon_glass;
    ctx.lineWidth = 2.2;
    ctx.stroke();

    drawEllipse(ctx, gx, bowlY + bowlRy * 0.18, bowlRx * 0.84, bowlRy * 0.15, 0);
    ctx.fillStyle = "rgba(212, 149, 59, 0.28)";
    ctx.fill();

    for (var pass = 0; pass < 2; pass++) {
      var front = pass === 1;
      for (var lf = 0; lf < GOBLET_RELIEF_SPEC.leafCount; lf++) {
        var th = state.gobletAngleRad + (lf / GOBLET_RELIEF_SPEC.leafCount) * TAU;
        var zf = Math.cos(th);
        if ((front && zf >= -0.05) || (!front && zf < -0.05)) {
          var lx = gx + Math.sin(th) * bowlRx * 0.78;
          var ly = bowlY + (lf % 2 === 0 ? -bowlRy * 0.10 : bowlRy * 0.16);
          drawBotanicalLeafRelief(ctx, lx, ly, Math.max(4, bowlRx * 0.19 * Math.max(0.22, Math.abs(zf))), bowlRy * 0.32, Math.max(0, zf), front);
        }
      }
      for (var ct = 0; ct < GOBLET_RELIEF_SPEC.caterpillarCount; ct++) {
        var cTheta = state.gobletAngleRad + (ct / GOBLET_RELIEF_SPEC.caterpillarCount) * TAU + 0.42;
        drawCaterpillarRelief(ctx, gx, bowlY + (ct - 1) * bowlRy * 0.22, bowlRx, bowlRy, cTheta, front);
      }
    }

    drawEllipse(ctx, gx, bowlY - bowlRy * 0.78, bowlRx, bowlRy * 0.16, 0);
    ctx.strokeStyle = PALETTE.placard_amber_ivory;
    ctx.lineWidth = 2;
    ctx.stroke();
    var rakeX = gx - bowlRx * 0.52 + Math.sin(anim.specularPhase) * bowlRx * 0.08;
    ctx.strokeStyle = "rgba(242, 229, 190, 0.42)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rakeX, bowlY - bowlRy * 0.62);
    ctx.quadraticCurveTo(rakeX - 6, bowlY + bowlRy * 0.1, rakeX + 8, bowlY + bowlRy * 0.68);
    ctx.stroke();

    var stemTop = bowlY + bowlRy, footY = Math.min(h * 0.86, stemTop + bowlRy * 0.68);
    ctx.fillStyle = "rgba(158, 181, 158, 0.46)";
    ctx.fillRect(gx - 7, stemTop, 14, footY - stemTop);
    drawEllipse(ctx, gx, (stemTop + footY) * 0.5, 14, 9, 0);
    ctx.fill();
    drawEllipse(ctx, gx, footY, bowlRx * 0.72, bowlRy * 0.14, 0);
    ctx.fill();
    ctx.strokeStyle = PALETTE.goblet_celadon_glass;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    var deg = Math.round((((state.gobletAngleRad * 180) / Math.PI) % 360 + 360) % 360);
    ctx.fillStyle = PALETTE.placard_amber_ivory;
    ctx.font = "700 10px monospace";
    ctx.fillText("8 LEAVES · 3×11-SEG CATERPILLARS · " + deg + "°", gx - bowlRx * 0.95, footY + 28);
    hitZones.push({ type: "goblet", locus: "hotel_goblet_bar", label: "Pressed Celadon Goblet — Leaves (8) & Caterpillars (3)", x: gx - bowlRx * 1.1, y: bowlY - bowlRy, w: bowlRx * 2.2, h: footY - (bowlY - bowlRy) + 18 });
    drawPlacardPost(ctx, w * 0.03, h * 0.03, Math.min(275, w * 0.42), 38, placardCode, placardLetters, "OVERNIGHT BAR · RM 404");
  }

  function resolveLocus(locusIdOrIndex) {
    if (typeof locusIdOrIndex === "number" && Number.isFinite(locusIdOrIndex)) {
      var idx = Math.floor(locusIdOrIndex);
      if (idx >= 0 && idx < LOCI.length) return LOCI[idx];
      if (idx === 4) return LOCI[3];
    }
    if (typeof locusIdOrIndex === "string") {
      var clean = locusIdOrIndex.trim();
      for (var i = 0; i < LOCI.length; i++) {
        if (LOCI[i].id === clean || LOCI[i].shortLabel === clean || LOCI[i].label === clean || String(LOCI[i].keyNum) === clean) {
          return LOCI[i];
        }
      }
    }
    return LOCI[1];
  }

  function createSuburbMatrix(opts) {
    var cfg = opts || {};
    var startLocus = resolveLocus(cfg.initialLocus != null ? cfg.initialLocus : "flower_roundabout");
    var state = {
      width: Math.max(120, Number(cfg.width) || 1280),
      height: Math.max(120, Number(cfg.height) || 800),
      reducedMotion: Boolean(cfg.reducedMotion),
      activeLocus: startLocus.id,
      activeLocusIndex: startLocus.index,
      dialogueIndex: 0,
      dialogueTurnsSpoken: 0,
      hardwareDialogueVariance: 0,
      gobletAngleRad: 0.36,
      gobletInspectedCount: 0,
      mirrorRaysVisible: true,
      destroyed: false
    };
    var anim = {
      elapsedSec: 0,
      vehiclePhase: 0.14,
      smokePhase: 0.25,
      scaleNeedlePhase: 0,
      scaleNeedleAmp: 0,
      specularPhase: 0.4
    };
    var dialogueLedger = { "TRD-01": { 0: HARDWARE_DIALOGUE_SCRIPT[0].utterance } };
    var lastHitZones = [];
    var lastW = state.width;
    var lastH = state.height;

    function computeDialogueVariance() {
      var codes = Object.keys(dialogueLedger);
      var diff = 0;
      for (var i = 0; i < codes.length; i++) {
        var bucket = dialogueLedger[codes[i]];
        var turns = Object.keys(bucket);
        for (var j = 0; j < turns.length; j++) {
          var tIdx = Number(turns[j]);
          if (bucket[tIdx] !== HARDWARE_DIALOGUE_SCRIPT[tIdx].utterance) diff += 1;
        }
      }
      return diff;
    }

    function drawSingleScene(ctx, w, h, locusId, code, letters, hitOut) {
      if (locusId === "airport_suburb_road") {
        renderSuburbRoadLocus(ctx, w, h, anim, code, letters, hitOut);
      } else if (locusId === "flower_roundabout") {
        renderFlowerRoundaboutLocus(ctx, w, h, anim, code, letters, hitOut);
      } else if (locusId === "hardware_store") {
        renderHardwareStoreLocus(ctx, w, h, anim, state, code, letters, hitOut);
      } else {
        renderHotelGobletLocus(ctx, w, h, anim, state, code, letters, hitOut);
      }
    }

    function getState() {
      var loc = LOCI[state.activeLocusIndex] || LOCI[1];
      var turn = HARDWARE_DIALOGUE_SCRIPT[state.dialogueIndex] || HARDWARE_DIALOGUE_SCRIPT[0];
      return {
        width: state.width,
        height: state.height,
        reducedMotion: state.reducedMotion,
        activeLocus: loc.id,
        activeLocusIndex: loc.index,
        activeLocusLabel: loc.label,
        activeLocusShortLabel: loc.shortLabel,
        dialogueIndex: state.dialogueIndex,
        dialogueTurnsSpoken: state.dialogueTurnsSpoken,
        currentDialogue: turn,
        visitedDialogueAirports: Object.keys(dialogueLedger),
        hardwareDialogueVariance: state.hardwareDialogueVariance,
        gobletAngleRad: state.gobletAngleRad,
        gobletInspectedCount: state.gobletInspectedCount,
        gobletMotif: GOBLET_RELIEF_SPEC.motif,
        mirrorRaysVisible: state.mirrorRaysVisible,
        flowerBedRoundaboutsCount: ROUNDABOUT_SQUARES.length,
        tinWarehousesCount: TIN_WAREHOUSES.length,
        hotelMirrorIdenticalLogic: HOTEL_MIRROR_SPEC.identicalLogic,
        detailVarianceAcrossFlights: 0
      };
    }

    return {
      setLocus: function setLocus(locusIdOrIndex) {
        var next = resolveLocus(locusIdOrIndex);
        state.activeLocus = next.id;
        state.activeLocusIndex = next.index;
        if (typeof cfg.onLocusChange === "function") cfg.onLocusChange(getState());
        return next;
      },
      advanceHardwareDialogue: function advanceHardwareDialogue(airportCode) {
        var code = String(airportCode || "TRD-01");
        state.dialogueIndex = (state.dialogueIndex + 1) % HARDWARE_DIALOGUE_SCRIPT.length;
        state.dialogueTurnsSpoken += 1;
        var turn = HARDWARE_DIALOGUE_SCRIPT[state.dialogueIndex];
        if (!dialogueLedger[code]) dialogueLedger[code] = {};
        dialogueLedger[code][turn.turnIndex] = turn.utterance;
        state.hardwareDialogueVariance = computeDialogueVariance();
        anim.scaleNeedleAmp = state.reducedMotion ? 0 : 1;
        anim.scaleNeedlePhase = 0;
        var res = {
          turnIndex: turn.turnIndex,
          dialogueIndex: state.dialogueIndex,
          speaker: turn.speaker,
          itemCode: turn.itemCode,
          utterance: turn.utterance,
          airportCode: code,
          hardwareDialogueVariance: state.hardwareDialogueVariance,
          matchPercent: 100
        };
        if (typeof cfg.onDialogueAdvance === "function") cfg.onDialogueAdvance(res);
        return res;
      },
      rotateGoblet: function rotateGoblet(deltaRad) {
        var delta = Number.isFinite(deltaRad) ? deltaRad : 0.45;
        state.gobletAngleRad += delta;
        state.gobletInspectedCount += 1;
        var res = { gobletAngleRad: state.gobletAngleRad, gobletInspectedCount: state.gobletInspectedCount, spec: GOBLET_RELIEF_SPEC };
        if (typeof cfg.onGobletInspect === "function") cfg.onGobletInspect(res);
        return res;
      },
      setGobletAngle: function setGobletAngle(rad) {
        state.gobletAngleRad = Number.isFinite(rad) ? rad : 0;
        state.gobletInspectedCount += 1;
        var res = { gobletAngleRad: state.gobletAngleRad, gobletInspectedCount: state.gobletInspectedCount, spec: GOBLET_RELIEF_SPEC };
        if (typeof cfg.onGobletInspect === "function") cfg.onGobletInspect(res);
        return res;
      },
      toggleMirrorRays: function toggleMirrorRays(forceBool) {
        state.mirrorRaysVisible = typeof forceBool === "boolean" ? forceBool : !state.mirrorRaysVisible;
        return state.mirrorRaysVisible;
      },
      step: function step(dtSec) {
        if (state.destroyed || state.reducedMotion) {
          anim.scaleNeedleAmp = 0;
          return;
        }
        var dt = clamp(Number(dtSec) || 0.016, 0, 0.1);
        anim.elapsedSec += dt;
        anim.vehiclePhase = (anim.vehiclePhase + dt * 0.16) % 1;
        anim.smokePhase = (anim.smokePhase + dt * 0.28) % 1;
        anim.specularPhase = (anim.specularPhase + dt * 0.55) % TAU;
        if (anim.scaleNeedleAmp > 0.002) {
          anim.scaleNeedlePhase += dt;
          anim.scaleNeedleAmp *= Math.pow(0.18, dt);
        } else {
          anim.scaleNeedleAmp = 0;
        }
      },
      renderLocus: function renderLocus(ctx, width, height, params) {
        if (!ctx || state.destroyed) return;
        var p = params || {};
        var w = Math.max(1, Number(width) || state.width);
        var h = Math.max(1, Number(height) || state.height);
        var loc = p.locus != null ? resolveLocus(p.locus) : LOCI[state.activeLocusIndex];
        var destCode = p.airportPlacardCode || "TRD-01";
        var destLetters = p.airportPlacardLetters || "TRUDE CENTRAL";
        var origCode = p.originPlacardCode || "TRD-01";
        var origLetters = p.originPlacardLetters || "TRUDE CENTRAL";
        var hits = [];
        ctx.save();
        if (p.compareMode) {
          var wipe = clamp(Number.isFinite(p.wipeRatio) ? p.wipeRatio : 0.5, 0.15, 0.85);
          var splitX = Math.round(w * wipe);
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, 0, splitX, h);
          ctx.clip();
          drawSingleScene(ctx, w, h, loc.id, origCode, origLetters, []);
          ctx.restore();
          ctx.save();
          ctx.beginPath();
          ctx.rect(splitX, 0, w - splitX, h);
          ctx.clip();
          drawSingleScene(ctx, w, h, loc.id, destCode, destLetters, hits);
          ctx.restore();
          ctx.strokeStyle = PALETTE.placard_amber_ivory;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(splitX, 0);
          ctx.lineTo(splitX, h);
          ctx.stroke();
          drawEllipse(ctx, splitX, h * 0.5, 13, 13, 0);
          ctx.fillStyle = PALETTE.asphalt_tarmac;
          ctx.fill();
          ctx.stroke();
          var tagW = Math.min(220, Math.max(118, w * 0.32));
          drawPlacardPost(ctx, Math.max(8, splitX - tagW - 10), h - 46, tagW, 36, origCode, origLetters, "ORIGIN BASELINE");
          drawPlacardPost(ctx, Math.min(w - tagW - 8, splitX + 10), h - 46, tagW, 36, destCode, destLetters, "DESTINATION · 0.00% DIFF");
        } else {
          drawSingleScene(ctx, w, h, loc.id, destCode, destLetters, hits);
        }
        ctx.restore();
        lastHitZones = hits;
        lastW = w;
        lastH = h;
      }
,
      hitTest: function hitTest(x, y, width, height) {
        var w = Math.max(1, Number(width) || lastW || state.width);
        var h = Math.max(1, Number(height) || lastH || state.height);
        var px = Number(x), py = Number(y);
        if (!Number.isFinite(px) || !Number.isFinite(py) || px < 0 || py < 0 || px > w || py > h) {
          return null;
        }
        var sx = lastW > 0 ? (px * lastW) / w : px;
        var sy = lastH > 0 ? (py * lastH) / h : py;
        for (var i = lastHitZones.length - 1; i >= 0; i--) {
          var z = lastHitZones[i];
          if (sx >= z.x && sx <= z.x + z.w && sy >= z.y && sy <= z.y + z.h) {
            return { type: z.type, locus: z.locus, label: z.label };
          }
        }
        var active = state.activeLocus;
        if (active === "hotel_goblet_bar") {
          return px < w * 0.45
            ? { type: "mirror", locus: active, label: "Overnight Hotel Mirror (4 Moldings)" }
            : { type: "goblet", locus: active, label: "Pressed Celadon Goblet — Leaves (8) & Caterpillars (3)" };
        }
        if (active === "hardware_store") {
          return { type: "hardware_counter", locus: active, label: "Verbatim Hardware Buyers Counter" };
        }
        if (active === "flower_roundabout") {
          return { type: "roundabout", locus: active, label: "Marigold & Geranium Roundabout Square" };
        }
        return {
          type: py >= h * 0.40 && py <= h * 0.68 ? "warehouse" : "suburb_block",
          locus: active,
          label: py >= h * 0.40 && py <= h * 0.68 ? "Corrugated Zinc-Tin Warehouse" : "Yellowish-Greenish Suburban Row"
        };
      },
      verifyDetailInvariance: function verifyDetailInvariance(originCode, currentCode) {
        return {
          originCode: String(originCode || "TRD-01"),
          currentCode: String(currentCode || "TRD-01"),
          suburbFacadeVariance: 0,
          roundaboutCurveVariance: 0,
          tinWarehouseVariance: 0,
          hardwareDialogueVariance: computeDialogueVariance(),
          hotelMirrorVariance: 0,
          gobletReliefVariance: 0,
          detailVarianceAcrossFlights: 0,
          gobletMotif: GOBLET_RELIEF_SPEC.motif,
          flowerBedRoundaboutsCount: ROUNDABOUT_SQUARES.length,
          tinWarehousesCount: TIN_WAREHOUSES.length,
          hotelMirrorIdenticalLogic: HOTEL_MIRROR_SPEC.identicalLogic,
          onlyAirportNameChanges: true
        };
      },
      setViewport: function setViewport(w, h) {
        state.width = Math.max(120, Number(w) || state.width);
        state.height = Math.max(120, Number(h) || state.height);
        return getState();
      },
      setReducedMotion: function setReducedMotion(flag) {
        state.reducedMotion = Boolean(flag);
        if (state.reducedMotion) anim.scaleNeedleAmp = 0;
        return state.reducedMotion;
      },
      getState: getState,
      destroy: function destroy() {
        state.destroyed = true;
        lastHitZones = [];
      }
    };
  }

  var api = Object.freeze({
    PALETTE: PALETTE,
    LOCI: LOCI,
    HARDWARE_DIALOGUE_SCRIPT: HARDWARE_DIALOGUE_SCRIPT,
    GOBLET_RELIEF_SPEC: GOBLET_RELIEF_SPEC,
    HOTEL_MIRROR_SPEC: HOTEL_MIRROR_SPEC,
    createSuburbMatrix: createSuburbMatrix
  });

  root.TrudeSuburbDetails = api;
  if (typeof window !== "undefined") {
    window.TrudeSuburbDetails = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
