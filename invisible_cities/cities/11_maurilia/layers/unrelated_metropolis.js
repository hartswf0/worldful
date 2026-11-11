/* City 11: Maurilia — Gleaming Present Metropolis & Departed-Gods Stratum */
if (typeof window === "undefined") {
  globalThis.window = globalThis;
}

window.MauriliaMetropolis = (function () {
  "use strict";

  var PALETTE = {
    asphalt: "#14191f",
    skyZenith: "#0c1219",
    skyHorizon: "#1e2936",
    concrete: "#8c969e",
    concreteShadow: "#555f68",
    concreteHighlight: "#b6c0c8",
    glassCyan: "#5ec2d6",
    glassDeep: "#1d5868",
    sodiumAmber: "#f09b36",
    foundryCrimson: "#a93b2c",
    outsiderChrome: "#dce5ec",
    outsiderVolt: "#7ef4ff",
    retroGilt: "#d8a24a",
    lariaOchre: "#8b6d4b",
    vaultShadow: "#0b0e13"
  };

  var STONES = [
    {
      index: 0,
      locusIndex: 0,
      id: "hen_vs_bus_station",
      u: 0.22,
      v: 0.64,
      radiusNorm: 0.18,
      stoneId: "glass_bus_station",
      title: "Gleaming Cantilevered Glass Bus Station",
      shortLabel: "01 · GLASS BUS CONCOURSE",
      subtitle: "Cyan curtain-wall transit concourse, amber route boards & articulated coaches",
      metropolisNote: "Beneath a soaring cyan glass cantilever, amber departure matrices flicker above articulated coaches hissing onto rain-slick asphalt while commuters pass with old Maurilian profiles and lilting vowels.",
      sharedCitizenSurname: "Vercelli-Mora",
      sharedAccentCadence: "Rising penultimate vowel on wet platform ('Maurilia centrale, corsia quattro')",
      departedOldGod: "Lar of Dust-Grain & Courtyard Threshold (receded wordlessly)",
      settledOutsiderGod: "Kinetron of Scheduled Transit & Curtain-Glass (settled on plinth)"
    },
    {
      index: 1,
      locusIndex: 1,
      id: "bandstand_vs_viaduct",
      u: 0.50,
      v: 0.44,
      radiusNorm: 0.19,
      stoneId: "concrete_viaduct_overpass",
      title: "Sweeping Concrete Viaduct Overpass",
      shortLabel: "02 · CONCRETE VIADUCT OVERPASS",
      subtitle: "Prestressed box-girder flyover on fluted pylons, sodium masts & traffic streams",
      metropolisNote: "A monumental prestressed concrete ribbon banks across fluted pylons above the central avenues, lit by tall sodium-vapor masts and twin rivers of headlamps and brake-light streaks.",
      sharedCitizenSurname: "Bellini-Sarti",
      sharedAccentCadence: "Clipped consonant cadence echoing under box-girder expansion joints",
      departedOldGod: "Genii of Oleander Shade & Sunday Measure (vacated sky-seat)",
      settledOutsiderGod: "Archon of Prestressed Span & Sodium Velocity (enthroned aloft)"
    },
    {
      index: 2,
      locusIndex: 2,
      id: "parasols_vs_munitions",
      u: 0.79,
      v: 0.56,
      radiusNorm: 0.18,
      stoneId: "munitions_factory",
      title: "Munitions Factory Smokestacks & Shift Gate",
      shortLabel: "03 · MUNITIONS FACTORY & STACKS",
      subtitle: "Sawtooth foundry clerestories, three brick-and-iron smokestacks & shift siren",
      metropolisNote: "Sawtooth steel clerestories glow furnace-crimson behind the riveted shift gate while three iron-banded smokestacks vent dark plumes above the freight rail siding and siren tower.",
      sharedCitizenSurname: "Cattaneo-Riva",
      sharedAccentCadence: "Soft sibilant inflection along the evening foundry turnstile queue",
      departedOldGod: "Nymphs of Eyelet-Lace Shade & Linden Dust (departed without a word)",
      settledOutsiderGod: "Ferric Demiurge of Ordnance Stampings & Siren Voltage (occupying niche)"
    }
  ];

  function clamp(val, min, max) {
    return val < min ? min : val > max ? max : val;
  }

  function clamp01(val) {
    var n = Number(val);
    if (!Number.isFinite(n)) return 0;
    return n < 0 ? 0 : n > 1 ? 1 : n;
  }

  function safeSetLineDash(ctx, segments) {
    if (ctx && typeof ctx.setLineDash === "function") {
      ctx.setLineDash(segments);
    }
  }

  function drawEllipseSafe(ctx, cx, cy, rx, ry) {
    if (rx <= 0 || ry <= 0) return;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(rx, ry);
    ctx.beginPath();
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.restore();
  }

  function hitTestLocus(normX, normY) {
    var nx = Number(normX);
    var ny = Number(normY);
    if (!Number.isFinite(nx) || !Number.isFinite(ny)) return -1;
    var bestIdx = -1;
    var bestDist = Infinity;
    for (var i = 0; i < STONES.length; i++) {
      var s = STONES[i];
      var dx = nx - s.u;
      var dy = ny - s.v;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d <= s.radiusNorm && d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    }
    return bestIdx;
  }

  function computeDiscontinuity(state) {
    var st = state || {};
    var probe = clamp01(st.godsProbeDepth);
    var spoken = Boolean(st.forbiddenTruthSpoken);
    var regret = Number.isFinite(Number(st.regretLevel)) ? clamp01(st.regretLevel) : 0.65;
    var effectiveProbe = spoken ? 1.0 : probe;

    var discontinuityIndex = spoken
      ? 1.0
      : Number((0.35 + 0.65 * effectiveProbe).toFixed(4));
    var departedGodsVisibility = spoken
      ? 1.0
      : Number(clamp01(Math.pow(effectiveProbe, 0.85)).toFixed(4));
    var outsiderSettlementRatio = spoken
      ? 1.0
      : Number(clamp01(effectiveProbe * (0.82 + 0.18 * effectiveProbe)).toFixed(4));

    var inBand = regret >= 0.52 && regret <= 0.78;
    var baseHosp = inBand ? 0.94 : 0.64;
    var citizenHospitality = spoken
      ? 0.08
      : Number(clamp(baseHosp - 0.44 * effectiveProbe, 0.18, 0.98).toFixed(4));

    var colophonWarning;
    if (spoken) {
      colophonWarning =
        "Beware of saying to them that sometimes different cities follow one another on the same site and under the same name, born and dying without knowing one another, without communication among themselves.";
    } else if (probe > 0.55) {
      colophonWarning =
        "Beneath identical surnames and vocal cadences, the old tutelary gods have gone without a word and angular outsiders have settled in their niches.";
    } else if (probe > 0.02) {
      colophonWarning =
        "Sub-plaque stratum exposed: names, accents, and profiles hold at 1.00, yet ontological continuity between postcard town and metropolis registers 0.00.";
    } else {
      colophonWarning =
        "Citizens proudly display the gleaming metropolis alongside faded postcards, assuming one continuous civic soul beneath the shared name.";
    }

    return {
      cityName: "MAURILIA",
      sameSiteCoordinates: true,
      inhabitantNameAccentContinuity: 1.0,
      facialFeatureContinuity: 1.0,
      ontologicalConnection: 0.0,
      discontinuityIndex: discontinuityIndex,
      departedGodsVisibility: departedGodsVisibility,
      outsiderSettlementRatio: outsiderSettlementRatio,
      citizenHospitality: citizenHospitality,
      colophonWarning: colophonWarning
    };
  }

  function drawSkyAndSkyline(ctx, w, h, t, contrast) {
    var skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.62);
    skyGrad.addColorStop(0, PALETTE.skyZenith);
    skyGrad.addColorStop(0.62, PALETTE.skyHorizon);
    skyGrad.addColorStop(1, "#263240");
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    var cyanGlow = ctx.createRadialGradient(w * 0.22, h * 0.60, w * 0.02, w * 0.22, h * 0.60, w * 0.34);
    cyanGlow.addColorStop(0, "rgba(94, 194, 214, " + (0.22 * contrast).toFixed(3) + ")");
    cyanGlow.addColorStop(1, "rgba(94, 194, 214, 0)");
    ctx.fillStyle = cyanGlow;
    ctx.fillRect(0, 0, w, h);

    var foundryGlow = ctx.createRadialGradient(w * 0.80, h * 0.54, w * 0.02, w * 0.80, h * 0.54, w * 0.32);
    foundryGlow.addColorStop(0, "rgba(169, 59, 44, " + (0.26 * contrast).toFixed(3) + ")");
    foundryGlow.addColorStop(1, "rgba(169, 59, 44, 0)");
    ctx.fillStyle = foundryGlow;
    ctx.fillRect(0, 0, w, h);

    var towers = [
      [0.03, 0.30, 0.055, 0.30], [0.09, 0.23, 0.065, 0.37], [0.17, 0.28, 0.052, 0.32],
      [0.31, 0.21, 0.070, 0.39], [0.39, 0.26, 0.058, 0.34], [0.46, 0.19, 0.066, 0.41],
      [0.55, 0.24, 0.062, 0.36], [0.63, 0.27, 0.054, 0.33], [0.90, 0.29, 0.065, 0.31]
    ];
    var horizonY = h * 0.59;
    for (var i = 0; i < towers.length; i++) {
      var tw = towers[i];
      var tx = tw[0] * w;
      var ty = tw[1] * h;
      var bw = tw[2] * w;
      var bh = horizonY - ty;
      ctx.fillStyle = i % 2 === 0 ? "#18212b" : "#1d2834";
      ctx.fillRect(tx, ty, bw, bh);
      ctx.strokeStyle = "rgba(140, 150, 158, 0.22)";
      ctx.lineWidth = 1;
      ctx.strokeRect(tx, ty, bw, bh);

      var cols = Math.max(2, Math.floor(bw / 11));
      var rows = Math.max(4, Math.floor(bh / 13));
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          if (((i * 7 + r * 3 + c * 5) % 4) === 0) continue;
          var litCyan = ((r + i + c) % 3) === 0;
          ctx.fillStyle = litCyan ? "rgba(94, 194, 214, 0.36)" : "rgba(240, 155, 54, 0.32)";
          ctx.fillRect(tx + 4 + c * ((bw - 6) / cols), ty + 5 + r * ((bh - 8) / rows), 3.5, 4.5);
        }
      }
    }
  }

  function drawWetBoulevard(ctx, w, h, t) {
    var roadTop = h * 0.585;
    var roadGrad = ctx.createLinearGradient(0, roadTop, 0, h);
    roadGrad.addColorStop(0, "#192028");
    roadGrad.addColorStop(0.35, PALETTE.asphalt);
    roadGrad.addColorStop(1, "#0d1116");
    ctx.fillStyle = roadGrad;
    ctx.fillRect(0, roadTop, w, h - roadTop);

    var reflSpecs = [
      { x: w * 0.22, color: "94, 194, 214", span: w * 0.13 },
      { x: w * 0.50, color: "240, 155, 54", span: w * 0.14 },
      { x: w * 0.79, color: "169, 59, 44", span: w * 0.12 }
    ];
    for (var s = 0; s < reflSpecs.length; s++) {
      var rf = reflSpecs[s];
      for (var k = 0; k < 9; k++) {
        var ry = roadTop + 8 + k * ((h - roadTop - 16) / 9);
        var shimmer = Math.sin(t * 2.1 + k * 0.9 + s) * (w * 0.008);
        var rw = rf.span * (0.35 + 0.07 * k);
        ctx.fillStyle = "rgba(" + rf.color + ", " + (0.20 - k * 0.016).toFixed(3) + ")";
        ctx.fillRect(rf.x - rw * 0.5 + shimmer, ry, rw, 2.5);
      }
    }

    ctx.strokeStyle = "rgba(220, 229, 236, 0.18)";
    ctx.lineWidth = 1.5;
    safeSetLineDash(ctx, [16, 14]);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.73);
    ctx.lineTo(w, h * 0.75);
    ctx.stroke();
    safeSetLineDash(ctx, []);
  }

  function drawViaductOverpass(ctx, w, h, t) {
    var cx = STONES[1].u * w;
    var cy = STONES[1].v * h;
    var pylonXs = [w * 0.14, w * 0.34, cx, w * 0.66, w * 0.86];
    var groundY = h * 0.60;

    for (var p = 0; p < pylonXs.length; p++) {
      var px = pylonXs[p];
      var archOffset = Math.pow((px - cx) / (w * 0.5), 2) * (h * 0.055);
      var deckY = cy + archOffset;
      var pw = Math.max(12, w * 0.022);
      ctx.fillStyle = PALETTE.concreteShadow;
      ctx.beginPath();
      ctx.moveTo(px - pw * 0.95, deckY + 10);
      ctx.lineTo(px + pw * 0.95, deckY + 10);
      ctx.lineTo(px + pw * 0.55, groundY);
      ctx.lineTo(px - pw * 0.55, groundY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = PALETTE.concreteHighlight;
      ctx.lineWidth = 1;
      for (var fl = -2; fl <= 2; fl++) {
        ctx.beginPath();
        ctx.moveTo(px + fl * (pw * 0.25), deckY + 12);
        ctx.lineTo(px + fl * (pw * 0.14), groundY);
        ctx.stroke();
      }
    }

    for (var m = 0; m < 6; m++) {
      var mx = w * (0.10 + m * 0.16);
      var mCurve = Math.pow((mx - cx) / (w * 0.5), 2) * (h * 0.055);
      var mTop = cy + mCurve - h * 0.065;
      ctx.strokeStyle = PALETTE.concrete;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(mx, cy + mCurve - 4);
      ctx.lineTo(mx, mTop);
      ctx.lineTo(mx + 10, mTop - 3);
      ctx.stroke();

      var lampGlow = ctx.createRadialGradient(mx + 10, mTop - 3, 1, mx + 10, mTop - 3, w * 0.045);
      lampGlow.addColorStop(0, "rgba(240, 155, 54, 0.85)");
      lampGlow.addColorStop(1, "rgba(240, 155, 54, 0)");
      ctx.fillStyle = lampGlow;
      ctx.beginPath();
      ctx.arc(mx + 10, mTop - 3, w * 0.045, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = PALETTE.concreteShadow;
    ctx.beginPath();
    ctx.moveTo(0, cy + h * 0.055 + 16);
    ctx.quadraticCurveTo(cx, cy - h * 0.052 + 16, w, cy + h * 0.060 + 16);
    ctx.lineTo(w, cy + h * 0.060 + 28);
    ctx.quadraticCurveTo(cx, cy - h * 0.052 + 28, 0, cy + h * 0.055 + 28);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = PALETTE.concrete;
    ctx.beginPath();
    ctx.moveTo(0, cy + h * 0.055);
    ctx.quadraticCurveTo(cx, cy - h * 0.052, w, cy + h * 0.060);
    ctx.lineTo(w, cy + h * 0.060 + 17);
    ctx.quadraticCurveTo(cx, cy - h * 0.052 + 17, 0, cy + h * 0.055 + 17);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = PALETTE.concreteHighlight;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cy + h * 0.055);
    ctx.quadraticCurveTo(cx, cy - h * 0.052, w, cy + h * 0.060);
    ctx.stroke();

    for (var tr = 0; tr < 8; tr++) {
      var uHead = ((tr / 8) + t * 0.09) % 1;
      var hx = uHead * w;
      var hy = cy + Math.pow((hx - cx) / (w * 0.5), 2) * (h * 0.055) - 2;
      ctx.strokeStyle = "rgba(220, 245, 255, 0.85)";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(hx - 18, hy + 1);
      ctx.lineTo(hx + 8, hy);
      ctx.stroke();

      var uTail = (1 - (((tr + 0.4) / 8 + t * 0.075) % 1));
      var rx = uTail * w;
      var ry2 = cy + Math.pow((rx - cx) / (w * 0.5), 2) * (h * 0.055) + 3;
      ctx.strokeStyle = "rgba(235, 68, 52, 0.82)";
      ctx.beginPath();
      ctx.moveTo(rx - 12, ry2);
      ctx.lineTo(rx + 14, ry2 + 1);
      ctx.stroke();
    }
  }

  function drawGlassBusStation(ctx, w, h, t) {
    var cx = STONES[0].u * w;
    var cy = STONES[0].v * h;
    var sw = w * 0.25;
    var sh = h * 0.16;
    var left = cx - sw * 0.52;
    var base = cy + sh * 0.36;

    var concGrad = ctx.createLinearGradient(left, base - sh, left + sw, base);
    concGrad.addColorStop(0, "rgba(94, 194, 214, 0.42)");
    concGrad.addColorStop(0.6, "rgba(29, 88, 104, 0.72)");
    concGrad.addColorStop(1, "rgba(20, 25, 31, 0.88)");
    ctx.fillStyle = concGrad;
    ctx.fillRect(left + sw * 0.08, base - sh * 0.72, sw * 0.78, sh * 0.72);

    ctx.strokeStyle = PALETTE.glassCyan;
    ctx.lineWidth = 1.3;
    for (var m = 0; m <= 7; m++) {
      var mx = left + sw * 0.08 + m * (sw * 0.78 / 7);
      ctx.beginPath();
      ctx.moveTo(mx, base - sh * 0.72);
      ctx.lineTo(mx, base);
      ctx.stroke();
    }

    ctx.fillStyle = "#202a33";
    ctx.beginPath();
    ctx.moveTo(left - sw * 0.08, base - sh * 0.92);
    ctx.lineTo(left + sw * 1.04, base - sh * 1.08);
    ctx.lineTo(left + sw * 0.96, base - sh * 0.70);
    ctx.lineTo(left + sw * 0.02, base - sh * 0.68);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = PALETTE.glassCyan;
    ctx.lineWidth = 2;
    ctx.stroke();

    for (var b = 0; b < 3; b++) {
      var bx = left + sw * (0.16 + b * 0.24);
      var by = base - sh * 0.62;
      ctx.fillStyle = "#12161b";
      ctx.fillRect(bx, by, sw * 0.19, sh * 0.17);
      ctx.fillStyle = PALETTE.sodiumAmber;
      ctx.fillRect(bx + 3, by + 3, sw * 0.14, 3);
      ctx.fillRect(bx + 3, by + 8, sw * 0.10, 2.5);
    }

    for (var c = 0; c < 2; c++) {
      var busX = left + sw * (0.10 + c * 0.46) + Math.sin(t * 0.8 + c) * 1.5;
      var busY = base - sh * 0.25 + c * 6;
      var busW = sw * 0.42;
      var busH = sh * 0.28;
      ctx.fillStyle = "#263845";
      ctx.fillRect(busX, busY, busW, busH);
      ctx.fillStyle = "#14191f";
      ctx.fillRect(busX + busW * 0.48, busY + 1, busW * 0.07, busH - 2);
      ctx.fillStyle = PALETTE.glassCyan;
      ctx.fillRect(busX + 4, busY + 4, busW * 0.40, busH * 0.44);
      ctx.fillRect(busX + busW * 0.58, busY + 4, busW * 0.36, busH * 0.44);
      ctx.fillStyle = PALETTE.sodiumAmber;
      ctx.fillRect(busX + busW - 9, busY + 2, 7, 4);
    }

    for (var p = 0; p < 6; p++) {
      var stride = Math.sin(t * 2.2 + p * 1.3) * 2.5;
      var px = left + sw * (0.15 + p * 0.13) + stride;
      var py = base + 5 + (p % 2) * 4;
      ctx.fillStyle = "#d5c6b3";
      ctx.beginPath();
      ctx.arc(px, py - 11, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(px + 2.2, py - 12);
      ctx.lineTo(px + 4.6, py - 10.5);
      ctx.lineTo(px + 2.2, py - 9.5);
      ctx.fill();
      ctx.fillStyle = p % 2 === 0 ? "#384958" : "#4b5a68";
      ctx.fillRect(px - 2.5, py - 8, 5, 9);
      ctx.strokeStyle = "rgba(240, 155, 54, 0.45)";
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(px + 5, py - 12, 4.5, -0.6, 0.6);
      ctx.stroke();
    }
  }

  function drawMunitionsFactory(ctx, w, h, t) {
    var cx = STONES[2].u * w;
    var cy = STONES[2].v * h;
    var fw = w * 0.23;
    var fh = h * 0.17;
    var left = cx - fw * 0.50;
    var base = cy + fh * 0.45;

    for (var s = 0; s < 3; s++) {
      var sx = left + fw * (0.20 + s * 0.27);
      var stackTop = base - fh * (1.38 - s * 0.08);
      var swTop = Math.max(7, fw * 0.045);
      var swBot = Math.max(11, fw * 0.072);

      for (var pl = 0; pl < 5; pl++) {
        var driftX = (pl + 1) * (w * 0.012) + Math.sin(t * 1.1 + pl + s) * (t === 0 ? 0 : 4);
        var driftY = stackTop - 8 - pl * (h * 0.017);
        var pr = swTop * (1.1 + pl * 0.55);
        ctx.fillStyle = "rgba(58, 52, 56, " + (0.42 - pl * 0.065).toFixed(3) + ")";
        drawEllipseSafe(ctx, sx + driftX, driftY, pr * 1.35, pr * 0.78);
        ctx.fill();
      }

      ctx.fillStyle = "#472926";
      ctx.beginPath();
      ctx.moveTo(sx - swTop, stackTop);
      ctx.lineTo(sx + swTop, stackTop);
      ctx.lineTo(sx + swBot, base - fh * 0.46);
      ctx.lineTo(sx - swBot, base - fh * 0.46);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#1c1f24";
      ctx.lineWidth = 2;
      for (var ring = 0; ring < 4; ring++) {
        var ry = stackTop + 8 + ring * ((base - fh * 0.48 - stackTop) / 4);
        ctx.beginPath();
        ctx.moveTo(sx - swBot * 0.85, ry);
        ctx.lineTo(sx + swBot * 0.85, ry);
        ctx.stroke();
      }
    }

    ctx.fillStyle = "#241d20";
    ctx.beginPath();
    ctx.moveTo(left, base);
    ctx.lineTo(left, base - fh * 0.52);
    for (var tooth = 0; tooth < 4; tooth++) {
      var tx0 = left + tooth * (fw * 0.22);
      ctx.lineTo(tx0 + fw * 0.15, base - fh * 0.76);
      ctx.lineTo(tx0 + fw * 0.22, base - fh * 0.52);
    }
    ctx.lineTo(left + fw * 0.92, base - fh * 0.52);
    ctx.lineTo(left + fw * 0.92, base);
    ctx.closePath();
    ctx.fill();

    for (var cl = 0; cl < 4; cl++) {
      var gx = left + cl * (fw * 0.22) + fw * 0.145;
      ctx.fillStyle = PALETTE.foundryCrimson;
      ctx.fillRect(gx, base - fh * 0.70, fw * 0.06, fh * 0.19);
      ctx.fillStyle = "rgba(240, 155, 54, 0.72)";
      ctx.fillRect(gx + 2, base - fh * 0.65, fw * 0.03, fh * 0.11);
    }

    var gateX = left + fw * 0.06;
    ctx.strokeStyle = PALETTE.concrete;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(gateX, base - fh * 0.30, fw * 0.26, fh * 0.30);
    ctx.fillStyle = "rgba(169, 59, 44, 0.45)";
    ctx.fillRect(gateX + 3, base - fh * 0.27, fw * 0.26 - 6, fh * 0.27);

    var sirenX = left + fw * 0.90;
    var sirenY = base - fh * 0.88;
    ctx.strokeStyle = "#7b858e";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sirenX - 6, base);
    ctx.lineTo(sirenX, sirenY);
    ctx.lineTo(sirenX + 6, base);
    ctx.stroke();
    var pulseR = 7 + ((t * 14) % 16);
    ctx.strokeStyle = "rgba(240, 155, 54, 0.55)";
    ctx.beginPath();
    ctx.arc(sirenX, sirenY, pulseR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "#6c7680";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(left - fw * 0.08, base + 6);
    ctx.lineTo(left + fw * 1.02, base + 6);
    ctx.stroke();
    ctx.fillStyle = "#353d45";
    ctx.fillRect(left + fw * 0.46, base - 5, fw * 0.30, 9);
  }

  function drawActiveLocusFrame(ctx, w, h, activeIdx) {
    var stone = STONES[activeIdx];
    if (!stone) return;
    var cx = stone.u * w;
    var cy = stone.v * h;
    var r = stone.radiusNorm * Math.min(w, h) * 0.72;
    var arm = Math.max(10, r * 0.24);

    ctx.strokeStyle = "rgba(94, 194, 214, 0.78)";
    ctx.lineWidth = 1.6;
    var corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
    for (var i = 0; i < corners.length; i++) {
      var sx = corners[i][0];
      var sy = corners[i][1];
      ctx.beginPath();
      ctx.moveTo(cx + sx * r, cy + sy * (r - arm));
      ctx.lineTo(cx + sx * r, cy + sy * r);
      ctx.lineTo(cx + sx * (r - arm), cy + sy * r);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(216, 162, 74, 0.62)";
    safeSetLineDash(ctx, [4, 5]);
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
    ctx.stroke();
    safeSetLineDash(ctx, []);
  }

  function drawDepartedGodsCutaway(ctx, w, h, t, disc, spoken) {
    var vis = disc.departedGodsVisibility;
    if (vis <= 0.02 && !spoken) return;
    var alpha = spoken ? 0.96 : clamp(0.22 + vis * 0.74, 0, 0.96);

    var skyCutH = h * 0.185;
    ctx.fillStyle = "rgba(9, 14, 21, " + (alpha * 0.86).toFixed(3) + ")";
    ctx.fillRect(0, 0, w, skyCutH);
    ctx.strokeStyle = "rgba(220, 229, 236, " + (alpha * 0.65).toFixed(3) + ")";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, skyCutH);
    ctx.lineTo(w, skyCutH);
    ctx.stroke();

    ctx.font = "600 " + Math.max(9, Math.round(h * 0.015)) + "px monospace";
    ctx.fillStyle = "rgba(220, 229, 236, " + alpha.toFixed(3) + ")";
    ctx.fillText("ABOVE PLACES · VACATED CELESTIAL SEATS & OUTSIDER SPIRITS", 12, Math.max(13, skyCutH * 0.18));

    var vaultTop = h * 0.805;
    ctx.fillStyle = "rgba(11, 14, 19, " + (alpha * 0.92).toFixed(3) + ")";
    ctx.fillRect(0, vaultTop, w, h - vaultTop);
    ctx.strokeStyle = "rgba(216, 162, 74, " + (alpha * 0.72).toFixed(3) + ")";
    ctx.beginPath();
    ctx.moveTo(0, vaultTop);
    ctx.lineTo(w, vaultTop);
    ctx.stroke();
    ctx.fillStyle = "rgba(216, 162, 74, " + alpha.toFixed(3) + ")";
    ctx.fillText("BENEATH NAMES · VACATED LARIA VAULTS & OUTSIDER TOTEMS", 12, vaultTop + 14);

    var plaques = ["PIAZZA MAURILIA", "VIADOTTO MAURILIA", "CORSO MAURILIA"];
    for (var i = 0; i < STONES.length; i++) {
      var lx = STONES[i].u * w;
      var seatY = skyCutH * 0.62;
      ctx.strokeStyle = "rgba(139, 109, 75, " + (alpha * 0.65).toFixed(3) + ")";
      safeSetLineDash(ctx, [3, 3]);
      ctx.strokeRect(lx - 28, seatY - 18, 56, 28);
      safeSetLineDash(ctx, []);

      var spin = t * 0.7 + i;
      var ox = lx + Math.cos(spin) * 2;
      ctx.strokeStyle = "rgba(126, 244, 255, " + alpha.toFixed(3) + ")";
      ctx.fillStyle = "rgba(220, 229, 236, " + (alpha * 0.85).toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(ox, seatY - 16);
      ctx.lineTo(ox + 15, seatY - 2);
      ctx.lineTo(ox, seatY + 12);
      ctx.lineTo(ox - 15, seatY - 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      var pw = Math.max(88, w * 0.11);
      ctx.fillStyle = "#1c2430";
      ctx.fillRect(lx - pw * 0.5, vaultTop - 9, pw, 15);
      ctx.strokeStyle = PALETTE.outsiderChrome;
      ctx.strokeRect(lx - pw * 0.5, vaultTop - 9, pw, 15);
      ctx.fillStyle = PALETTE.outsiderChrome;
      ctx.fillText(plaques[i], lx - pw * 0.44, vaultTop + 2);

      var vy = vaultTop + (h - vaultTop) * 0.56;
      ctx.strokeStyle = "rgba(139, 109, 75, " + (alpha * 0.78).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(lx - 22, vy, 18, Math.PI, 0);
      ctx.lineTo(lx - 4, vy + 18);
      ctx.lineTo(lx - 40, vy + 18);
      ctx.closePath();
      ctx.stroke();

      for (var fp = 0; fp < 4; fp++) {
        ctx.fillStyle = "rgba(216, 162, 74, " + (alpha * (0.68 - fp * 0.15)).toFixed(3) + ")";
        drawEllipseSafe(ctx, lx - 28 - fp * 11, vy + 14 + (fp % 2) * 3, 3.2, 1.6);
        ctx.fill();
      }

      ctx.fillStyle = "rgba(220, 229, 236, " + (alpha * 0.92).toFixed(3) + ")";
      ctx.strokeStyle = "rgba(126, 244, 255, " + alpha.toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(lx + 18, vy - 18);
      ctx.lineTo(lx + 30, vy + 16);
      ctx.lineTo(lx + 6, vy + 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    if (spoken) {
      var fy = h * 0.50;
      ctx.strokeStyle = PALETTE.outsiderVolt;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(0, fy + 8);
      ctx.lineTo(w * 0.28, fy - 6);
      ctx.lineTo(w * 0.51, fy + 10);
      ctx.lineTo(w * 0.74, fy - 8);
      ctx.lineTo(w, fy + 4);
      ctx.stroke();

      var tagW = Math.min(w - 24, 368);
      var tagX = (w - tagW) * 0.5;
      ctx.fillStyle = "rgba(12, 16, 22, 0.94)";
      ctx.fillRect(tagX, fy - 15, tagW, 26);
      ctx.strokeStyle = PALETTE.foundryCrimson;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(tagX, fy - 15, tagW, 26);
      ctx.fillStyle = PALETTE.outsiderChrome;
      ctx.fillText("MAURILIA [I] \u2260 MAURILIA [II] \u00b7 CONNECTION 0.00", tagX + 12, fy + 2);
    }
  }

  function renderMetropolis(ctx, width, height, state) {
    if (!ctx || width <= 0 || height <= 0) return;
    var st = state || {};
    var t = st.reducedMotion ? 0 : (Number(st.time) || 0);
    var contrast = Number.isFinite(Number(st.metropolisContrast))
      ? clamp(Number(st.metropolisContrast), 0.25, 1.25)
      : 0.88;
    var disc = computeDiscontinuity(st);

    ctx.save();
    drawSkyAndSkyline(ctx, width, height, t, contrast);
    drawWetBoulevard(ctx, width, height, t);
    drawViaductOverpass(ctx, width, height, t);
    drawGlassBusStation(ctx, width, height, t);
    drawMunitionsFactory(ctx, width, height, t);

    if (Number.isInteger(st.activeLocus) && st.activeLocus >= 0 && st.activeLocus < STONES.length) {
      drawActiveLocusFrame(ctx, width, height, st.activeLocus);
    }
    drawDepartedGodsCutaway(ctx, width, height, t, disc, Boolean(st.forbiddenTruthSpoken));
    ctx.restore();
  }

  function createAudioEngine() {
    var ac = null;
    var unlocked = false;
    var muted = false;
    var disposed = false;
    var nodes = null;
    var lastWaltzStep = -1;

    function buildGraph() {
      if (nodes || !ac) return;
      var master = ac.createGain();
      master.gain.value = muted ? 0 : 0.24;
      master.connect(ac.destination);

      var bufLen = ac.sampleRate * 2;
      var noiseBuf = ac.createBuffer(1, bufLen, ac.sampleRate);
      var nd = noiseBuf.getChannelData(0);
      var brown = 0;
      for (var i = 0; i < bufLen; i++) {
        var white = Math.random() * 2 - 1;
        brown = (brown + 0.03 * white) / 1.03;
        nd[i] = brown * 2.6 + (Math.random() > 0.996 ? white * 0.75 : 0);
      }

      function makeLoopNoise(type, freq, q) {
        var src = ac.createBufferSource();
        src.buffer = noiseBuf;
        src.loop = true;
        var flt = ac.createBiquadFilter();
        flt.type = type;
        flt.frequency.value = freq;
        flt.Q.value = q;
        var g = ac.createGain();
        g.gain.value = 0.0001;
        src.connect(flt);
        flt.connect(g);
        g.connect(master);
        src.start();
        return { src: src, flt: flt, gain: g };
      }

      function makeOsc(type, freq, filterFreq) {
        var osc = ac.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        var flt = ac.createBiquadFilter();
        flt.type = "lowpass";
        flt.frequency.value = filterFreq;
        var g = ac.createGain();
        g.gain.value = 0.0001;
        osc.connect(flt);
        flt.connect(g);
        g.connect(master);
        osc.start();
        return { osc: osc, flt: flt, gain: g };
      }

      nodes = {
        master: master,
        noiseBuf: noiseBuf,
        rumble: makeLoopNoise("lowpass", 118, 0.8),
        brakeHiss: makeLoopNoise("bandpass", 3100, 2.4),
        crackle: makeLoopNoise("highpass", 2300, 0.9),
        dryWind: makeLoopNoise("bandpass", 370, 1.5),
        shiftHorn: makeOsc("sawtooth", 146.83, 410),
        waltzBass: makeOsc("triangle", 146.83, 520),
        waltzHornA: makeOsc("sawtooth", 293.66, 920),
        waltzHornB: makeOsc("sawtooth", 369.99, 960),
        flyStatic: makeOsc("sawtooth", 312, 1050),
        outsiderHum: makeOsc("sine", 528, 1600)
      };
    }

    function unlock() {
      if (disposed || typeof window === "undefined") return false;
      var Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return false;
      try {
        if (!ac) ac = new Ctor();
        if (ac.state === "suspended") ac.resume();
        buildGraph();
        unlocked = true;
        return true;
      } catch (_e) {
        return false;
      }
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      if (ac && nodes && !disposed) {
        nodes.master.gain.setTargetAtTime(muted ? 0 : 0.24, ac.currentTime, 0.05);
      }
      return muted;
    }

    function update(state, graceMetrics, discMetrics) {
      if (!unlocked || !ac || !nodes || disposed || muted) return;
      if (ac.state === "suspended") return;
      var st = state || {};
      var gm = graceMetrics || {};
      var dm = discMetrics || {};
      var now = ac.currentTime;
      var is1906 = Boolean(st.realTime1906);
      var grace = is1906 ? 0 : clamp01(gm.retroactiveGrace);
      var contrast = clamp(Number(st.metropolisContrast) || 0.85, 0.2, 1.2);
      var locus = Number(st.activeLocus) || 0;
      var godsVis = clamp01(dm.departedGodsVisibility);
      var motion = !st.reducedMotion;

      var metroAmt = is1906 ? 0.0001 : (0.14 * contrast * (1 - grace * 0.38));
      var hissPulse = (!is1906 && motion && Math.sin(now * 1.35) > 0.86) ? 0.045 : 0.004;
      var hornAmt = is1906 ? 0.0001 : (locus === 2 ? 0.032 : 0.012) * contrast;

      nodes.rumble.gain.gain.setTargetAtTime(metroAmt, now, 0.12);
      nodes.brakeHiss.gain.gain.setTargetAtTime(is1906 ? 0.0001 : hissPulse * (locus === 0 ? 1.5 : 0.7), now, 0.08);
      nodes.shiftHorn.gain.gain.setTargetAtTime(hornAmt, now, 0.18);

      nodes.dryWind.gain.gain.setTargetAtTime(is1906 ? 0.12 : 0.0001, now, 0.12);
      nodes.flyStatic.gain.gain.setTargetAtTime(is1906 ? 0.018 : 0.0001, now, 0.12);
      if (is1906 && motion) {
        nodes.flyStatic.osc.frequency.setTargetAtTime(304 + Math.sin(now * 13) * 18, now, 0.04);
      }

      nodes.crackle.gain.gain.setTargetAtTime(grace > 0.02 ? grace * 0.055 : 0.0001, now, 0.12);
      nodes.outsiderHum.gain.gain.setTargetAtTime(godsVis > 0.03 ? godsVis * 0.028 : 0.0001, now, 0.15);

      if (!is1906 && grace > 0.02) {
        var step = Math.floor(now * 2.15) % 12;
        var beat = step % 3;
        var bar = Math.floor(step / 3);
        var roots = [146.83, 110.0, 123.47, 98.0];
        var thirds = [[293.66, 369.99], [220.0, 277.18], [246.94, 329.63], [196.0, 246.94]];
        if (step !== lastWaltzStep) {
          lastWaltzStep = step;
          var det = motion ? Math.sin(now * 1.9) * 1.6 : 0;
          nodes.waltzBass.osc.frequency.setTargetAtTime(roots[bar] + det * 0.4, now, 0.02);
          nodes.waltzHornA.osc.frequency.setTargetAtTime(thirds[bar][0] + det, now, 0.02);
          nodes.waltzHornB.osc.frequency.setTargetAtTime(thirds[bar][1] - det * 0.8, now, 0.02);
        }
        nodes.waltzBass.gain.gain.setTargetAtTime(beat === 0 ? grace * 0.065 : grace * 0.012, now, 0.04);
        var chordGain = (beat === 1 || beat === 2) ? grace * 0.036 : grace * 0.006;
        nodes.waltzHornA.gain.gain.setTargetAtTime(chordGain, now, 0.04);
        nodes.waltzHornB.gain.gain.setTargetAtTime(chordGain * 0.85, now, 0.04);
      } else {
        nodes.waltzBass.gain.gain.setTargetAtTime(0.0001, now, 0.08);
        nodes.waltzHornA.gain.gain.setTargetAtTime(0.0001, now, 0.08);
        nodes.waltzHornB.gain.gain.setTargetAtTime(0.0001, now, 0.08);
      }
    }

    function triggerTone(freq, endFreq, type, dur, peak) {
      if (!unlocked || !ac || !nodes || disposed || muted) return;
      var now = ac.currentTime;
      var osc = ac.createOscillator();
      var g = ac.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(24, endFreq), now + dur);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(peak, now + 0.018);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(g);
      g.connect(nodes.master);
      osc.start(now);
      osc.stop(now + dur + 0.03);
    }

    function triggerLocusPulse(locusIndex, state) {
      var is1906 = Boolean(state && state.realTime1906);
      if (is1906) {
        triggerTone(165, 92, "triangle", 0.16, 0.08);
        return;
      }
      if (locusIndex === 0) {
        triggerTone(659.25, 987.77, "sine", 0.24, 0.08);
      } else if (locusIndex === 1) {
        triggerTone(220.0, 146.83, "triangle", 0.30, 0.09);
      } else {
        triggerTone(146.83, 207.65, "sawtooth", 0.34, 0.07);
      }
    }

    function triggerForbiddenChord() {
      var freqs = [311.13, 440.0, 659.25, 932.33];
      for (var i = 0; i < freqs.length; i++) {
        triggerTone(freqs[i], freqs[i] * 0.985, "sawtooth", 0.85, 0.045);
      }
      triggerTone(110.0, 41.2, "sine", 0.95, 0.14);
    }

    function dispose() {
      if (disposed) return;
      disposed = true;
      if (ac) {
        try { ac.close(); } catch (_e) {}
      }
      ac = null;
      nodes = null;
      unlocked = false;
    }

    return {
      unlock: unlock,
      setMuted: setMuted,
      isMuted: function () { return muted; },
      update: update,
      triggerLocusPulse: triggerLocusPulse,
      triggerForbiddenChord: triggerForbiddenChord,
      dispose: dispose
    };
  }

  return {
    STONES: STONES,
    LOCI: STONES,
    PALETTE: PALETTE,
    hitTestLocus: hitTestLocus,
    computeDiscontinuity: computeDiscontinuity,
    renderMetropolis: renderMetropolis,
    createAudioEngine: createAudioEngine
  };
})();
