(function (root) {
  'use strict';

  var CALVINO_AXIOM = 'Falsehood is never in words; it is in things.';

  var PALETTE = {
    alabasterPeacock: '#f3efe4',
    mullionLimestone: '#d9d0be',
    cushionSaffron: '#d49b4b',
    estuaryJade: '#2d7a6d',
    bowLanternAmber: '#f2b652',
    greaseSoot: '#181a1d',
    crustedTallow: '#322f2a',
    furnaceSlag: '#b84a27',
    mandrelSteel: '#6e7b85'
  };

  var COUNTER_THINGS = [
    {
      index: 0,
      u: 0.18,
      v: 0.31,
      thingId: 'thick_soot_clouds',
      pairedGraceId: 'filigree_palaces_mullions',
      graceId: 'filigree_palaces_mullions',
      thingTitle: 'Thick Clouds of Soot',
      thingDisclosure: 'Dense coal-and-oil soot rolling across skylights and choking the pierced stone apertures.'
    },
    {
      index: 1,
      u: 0.45,
      v: 0.35,
      thingId: 'grease_encrusted_walls',
      pairedGraceId: 'white_peacock_lawn',
      graceId: 'white_peacock_lawn',
      thingTitle: 'Grease Crusts on House Walls',
      thingDisclosure: 'Viscous black tallow and machine-grease crusts coating masonry courses and staining white plumes.'
    },
    {
      index: 2,
      u: 0.22,
      v: 0.68,
      thingId: 'crushing_street_trailers',
      pairedGraceId: 'white_leather_saddlers',
      graceId: 'white_leather_saddlers',
      thingTitle: 'Trailers Crushing Pedestrians',
      thingDisclosure: 'Articulated iron haulage trailers swinging wide in cramped alleys, pinning pedestrians flat against stone walls.'
    },
    {
      index: 3,
      u: 0.52,
      v: 0.69,
      thingId: 'sarcastic_laughter_duplicity',
      pairedGraceId: 'raffia_rug_weavers',
      graceId: 'raffia_rug_weavers',
      thingTitle: 'Sarcastic Evening Laughter',
      thingDisclosure: 'Exhausted shift-mouths cracking bitter, metallic jokes in the dark: falsehood is never in words, it is in things.'
    },
    {
      index: 4,
      u: 0.77,
      v: 0.32,
      thingId: 'lathe_mandrel_shifts',
      pairedGraceId: 'hanging_canals_millwheels',
      graceId: 'hanging_canals_millwheels',
      thingTitle: 'Fixed-Pace Lathe Mandrels',
      thingDisclosure: 'A thousand hands turning steel lathe mandrels at unrelenting shift paces driven by the same shafting.'
    },
    {
      index: 5,
      u: 0.81,
      v: 0.71,
      thingId: 'sleepwalking_outskirts',
      pairedGraceId: 'estuary_lantern_canoes',
      graceId: 'estuary_lantern_canoes',
      thingTitle: 'Sleepwalking Outskirts',
      thingDisclosure: 'Somnambulist rows of blackened outskirts tenements and slag barges marching blindly between shifts.'
    }
  ];

  function clamp(val, lo, hi) {
    var n = Number(val);
    if (Number.isNaN(n)) return lo;
    return n < lo ? lo : (n > hi ? hi : n);
  }

  function seededUnit(seed) {
    var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function createDisclosureEngine() {
    var sootBillows = [];
    for (var i = 0; i < 28; i++) {
      sootBillows.push({
        id: i,
        anchorLocus: i < 16 ? 0 : (i % 6),
        offsetU: (seededUnit(i * 3 + 1) - 0.5) * 0.16,
        offsetV: (seededUnit(i * 3 + 2) - 0.5) * 0.13,
        radiusScale: 0.022 + seededUnit(i * 3 + 3) * 0.044,
        driftSpeed: 0.012 + seededUnit(i * 5 + 7) * 0.024,
        phase: seededUnit(i * 7 + 11) * Math.PI * 2
      });
    }
    var swarfSparks = [];
    for (var j = 0; j < 22; j++) {
      swarfSparks.push({
        id: j,
        angle: -Math.PI * 0.82 + seededUnit(j * 4 + 1) * Math.PI * 0.95,
        reach: 0.018 + seededUnit(j * 4 + 2) * 0.068,
        curlTurns: 1.4 + seededUnit(j * 4 + 3) * 2.2,
        speed: 0.85 + seededUnit(j * 4 + 4) * 1.35,
        phase: seededUnit(j * 9 + 5)
      });
    }
    return {
      sootBillows: sootBillows,
      swarfSparks: swarfSparks,
      trailerPhase: 0
    };
  }

  function computeDisclosure(filigreeState, engineState) {
    var st = filigreeState || {};
    var rawCounts = Array.isArray(st.utteranceCounts) ? st.utteranceCounts : [0, 0, 0, 0, 0, 0];
    var counts = [0, 0, 0, 0, 0, 0];
    var sumCounts = 0;
    var spokenLoci = 0;
    for (var i = 0; i < 6; i++) {
      var c = Math.max(0, Number(rawCounts[i]) || 0);
      counts[i] = c;
      sumCounts += c;
      if (c > 0) spokenLoci += 1;
    }

    var total = (typeof st.totalGraceUtterances === 'number' && !Number.isNaN(st.totalGraceUtterances))
      ? Math.max(0, st.totalGraceUtterances)
      : sumCounts;
    if (total === 0 && sumCounts > 0) total = sumCounts;

    var rawProgress = Math.min(1.0, spokenLoci * 0.12 + total * 0.047);
    var sootDisclosure = +(0.08 + 0.92 * rawProgress).toFixed(4);
    var greaseCrustDepth = +(0.05 + 0.95 * rawProgress).toFixed(4);
    var thingDuplicity = +(0.12 + 0.88 * rawProgress).toFixed(4);

    var perLocusDisclosure = [];
    var disclosedThingCount = 0;
    for (var k = 0; k < 6; k++) {
      var locVal = Math.min(1, (counts[k] > 0 ? 0.55 + counts[k] * 0.22 : 0.08) + rawProgress * 0.35);
      perLocusDisclosure.push(+locVal.toFixed(4));
      if (counts[k] > 0 || rawProgress >= 0.85) {
        disclosedThingCount += 1;
      }
    }

    var isBleak = st.discourseMode === 'literal_bleak';
    var cityVitality = isBleak ? 0.14 : +(0.82 + 0.18 * (spokenLoci / 6)).toFixed(4);
    var disclosureClarity = isBleak ? 0.18 : +(0.30 + 0.70 * rawProgress).toFixed(4);
    var dualComprehensionIndex = isBleak ? 0.0252 : +(cityVitality * disclosureClarity).toFixed(4);

    if (engineState && !st.reducedMotion) {
      var t = Number(st.time) || 0;
      engineState.trailerPhase = ((t * 0.38) % 1 + 1) % 1;
    }

    return {
      wordFalsehood: 0.0,
      spokenLoci: spokenLoci,
      totalGraceUtterances: total,
      rawProgress: +rawProgress.toFixed(4),
      sootDisclosure: sootDisclosure,
      greaseCrustDepth: greaseCrustDepth,
      thingDuplicity: thingDuplicity,
      perLocusDisclosure: perLocusDisclosure,
      disclosedThingCount: disclosedThingCount,
      discourseMode: isBleak ? 'literal_bleak' : 'filigree',
      cityVitality: cityVitality,
      disclosureClarity: disclosureClarity,
      dualComprehensionIndex: dualComprehensionIndex,
      latheMandrelRpm: 120,
      crushingTrailerCount: 4,
      sleepwalkerRowCount: 3,
      sarcasticBurstActive: Boolean(counts[3] > 0 || rawProgress > 0.5),
      calvinoAxiom: CALVINO_AXIOM
    };
  }

  function drawGlobalShaftAndSootVeil(ctx, w, h, sootVal, greaseVal, motionTime) {
    var veilAlpha = clamp((sootVal - 0.06) * 0.62, 0.02, 0.58);
    var skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.62);
    skyGrad.addColorStop(0, 'rgba(24, 26, 29, ' + (veilAlpha * 0.92).toFixed(3) + ')');
    skyGrad.addColorStop(0.55, 'rgba(50, 47, 42, ' + (veilAlpha * 0.52).toFixed(3) + ')');
    skyGrad.addColorStop(1, 'rgba(24, 26, 29, 0)');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.65);

    if (sootVal > 0.14) {
      var shaftAlpha = clamp((sootVal - 0.12) * 0.85, 0, 0.78);
      var shaftY = h * 0.215;
      ctx.save();
      ctx.globalAlpha = shaftAlpha;
      ctx.strokeStyle = PALETTE.mandrelSteel;
      ctx.lineWidth = Math.max(2, h * 0.0045);
      ctx.beginPath();
      ctx.moveTo(w * 0.12, shaftY);
      ctx.lineTo(w * 0.86, shaftY);
      ctx.stroke();

      var pulleyXs = [0.18, 0.33, 0.45, 0.63, 0.77];
      var spin = motionTime * Math.PI * 4.0;
      for (var i = 0; i < pulleyXs.length; i++) {
        var px = w * pulleyXs[i];
        var pr = Math.min(w, h) * (i === 4 ? 0.022 : 0.015);
        ctx.fillStyle = PALETTE.greaseSoot;
        ctx.fillRect(px - pr * 0.28, shaftY - pr * 1.45, pr * 0.56, pr * 1.1);
        ctx.beginPath();
        ctx.arc(px, shaftY, pr, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(24, 26, 29, 0.82)';
        ctx.fill();
        ctx.lineWidth = 1.6;
        ctx.strokeStyle = PALETTE.mandrelSteel;
        ctx.stroke();
        for (var s = 0; s < 3; s++) {
          var ang = spin + (s * Math.PI * 2) / 3;
          ctx.beginPath();
          ctx.moveTo(px, shaftY);
          ctx.lineTo(px + Math.cos(ang) * pr * 0.88, shaftY + Math.sin(ang) * pr * 0.88);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    if (greaseVal > 0.12) {
      ctx.save();
      ctx.fillStyle = 'rgba(50, 47, 42, ' + clamp(greaseVal * 0.34, 0, 0.32).toFixed(3) + ')';
      ctx.fillRect(0, h * 0.88, w, h * 0.12);
      ctx.restore();
    }
  }

  function drawThickSootClouds(ctx, w, h, d0, sootVal, billows, motionTime) {
    var cx = w * 0.18;
    var cy = h * 0.31;
    var scale = Math.min(w, h);
    var intensity = clamp(Math.max(d0, sootVal * 0.75), 0.05, 1);
    ctx.save();
    ctx.globalAlpha = clamp(0.08 + intensity * 0.86, 0.08, 0.94);

    var stackW = scale * 0.022;
    for (var f = -1; f <= 1; f++) {
      var fx = cx + f * scale * 0.036;
      var fy = cy + scale * 0.055;
      var fh = scale * (0.095 + (1 - Math.abs(f) * 0.2) * 0.03);
      ctx.fillStyle = PALETTE.greaseSoot;
      ctx.fillRect(fx - stackW * 0.5, fy - fh, stackW, fh);
      ctx.fillStyle = PALETTE.furnaceSlag;
      ctx.fillRect(fx - stackW * 0.58, fy - fh - 3, stackW * 1.16, 3.5);
    }

    for (var i = 0; i < billows.length; i++) {
      var b = billows[i];
      var baseT = COUNTER_THINGS[b.anchorLocus] || COUNTER_THINGS[0];
      var driftU = motionTime > 0 ? Math.sin(motionTime * b.driftSpeed * 12 + b.phase) * 0.022 : 0;
      var riseV = motionTime > 0 ? ((motionTime * b.driftSpeed * 1.8 + b.phase * 0.1) % 0.09) : 0;
      var bx = w * (baseT.u + b.offsetU + driftU);
      var by = h * (baseT.v + b.offsetV - riseV);
      var br = scale * b.radiusScale * (0.55 + intensity * 0.95);
      var grad = ctx.createRadialGradient(bx - br * 0.2, by + br * 0.25, br * 0.1, bx, by, br);
      grad.addColorStop(0, i % 4 === 0 ? 'rgba(184, 74, 39, 0.42)' : 'rgba(24, 26, 29, 0.92)');
      grad.addColorStop(0.45, 'rgba(24, 26, 29, 0.78)');
      grad.addColorStop(1, 'rgba(24, 26, 29, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawGreaseEncrustedWalls(ctx, w, h, d1, greaseDepth) {
    var cx = w * 0.45;
    var cy = h * 0.35;
    var scale = Math.min(w, h);
    var intensity = clamp(Math.max(d1, greaseDepth * 0.8), 0.05, 1);
    ctx.save();
    ctx.globalAlpha = clamp(0.06 + intensity * 0.88, 0.06, 0.94);

    var wallW = scale * 0.21;
    var wallTop = cy - scale * 0.11;
    ctx.fillStyle = 'rgba(50, 47, 42, ' + (0.28 + intensity * 0.56).toFixed(3) + ')';
    ctx.fillRect(cx - wallW * 0.5, wallTop, wallW, scale * 0.048);

    var dripCount = 13;
    ctx.fillStyle = PALETTE.greaseSoot;
    ctx.beginPath();
    ctx.moveTo(cx - wallW * 0.5, wallTop);
    for (var i = 0; i <= dripCount; i++) {
      var t = i / dripCount;
      var dx = cx - wallW * 0.5 + t * wallW;
      var lobe = (0.025 + seededUnit(i * 11 + 3) * 0.125) * scale * intensity;
      var midX = dx - (wallW / dripCount) * 0.5;
      if (i > 0) {
        ctx.quadraticCurveTo(midX, wallTop + lobe * 1.35, dx, wallTop + lobe * 0.38);
      }
    }
    ctx.lineTo(cx + wallW * 0.5, wallTop);
    ctx.closePath();
    ctx.fill();

    for (var p = 0; p < 11; p++) {
      var ang = -Math.PI + (p / 10) * Math.PI;
      var rad = scale * (0.048 + (p % 3) * 0.024);
      var sx = cx + Math.cos(ang) * rad;
      var sy = cy + scale * 0.03 + Math.sin(ang) * rad * 0.72;
      ctx.fillStyle = p % 2 === 0 ? PALETTE.crustedTallow : PALETTE.greaseSoot;
      ctx.beginPath();
      ctx.ellipse(sx, sy, scale * 0.0085 * intensity + 1.5, scale * 0.005 * intensity + 1, ang, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawCrushingTrailers(ctx, w, h, d2, trailerPhase, trailerCount) {
    var cx = w * 0.22;
    var cy = h * 0.68;
    var scale = Math.min(w, h);
    var intensity = clamp(d2, 0.06, 1);
    ctx.save();
    ctx.globalAlpha = clamp(0.07 + intensity * 0.88, 0.07, 0.95);

    var alleyW = scale * 0.22;
    var alleyH = scale * 0.13;
    ctx.strokeStyle = PALETTE.crustedTallow;
    ctx.lineWidth = Math.max(2.5, scale * 0.008);
    ctx.strokeRect(cx - alleyW * 0.5, cy - alleyH * 0.5, alleyW, alleyH);

    var swing = Math.sin(trailerPhase * Math.PI * 2) * 0.18;
    for (var p = 0; p < 3; p++) {
      var px = cx - alleyW * 0.34 + p * alleyW * 0.32;
      var py = cy - alleyH * 0.41;
      ctx.fillStyle = PALETTE.mullionLimestone;
      ctx.beginPath();
      ctx.arc(px, py - scale * 0.009, scale * 0.0055, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(px - scale * 0.007, py - scale * 0.003, scale * 0.014, scale * 0.015);
    }

    var count = trailerCount || 4;
    for (var k = 0; k < count; k++) {
      var tx = cx - alleyW * 0.38 + k * (alleyW * 0.24);
      var ty = cy - alleyH * 0.12 + (k % 2 === 0 ? -1 : 1) * scale * 0.014;
      var yaw = (k % 2 === 0 ? 1 : -1) * (0.19 + swing);
      ctx.save();
      ctx.translate(tx, ty);
      ctx.rotate(yaw);
      var bw = scale * 0.052;
      var bh = scale * 0.028;
      ctx.fillStyle = PALETTE.greaseSoot;
      ctx.fillRect(-bw * 0.5, -bh * 0.5, bw, bh);
      ctx.strokeStyle = PALETTE.mandrelSteel;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-bw * 0.5, -bh * 0.5, bw, bh);
      ctx.fillStyle = PALETTE.furnaceSlag;
      ctx.fillRect(-bw * 0.36, -bh * 0.28, bw * 0.72, bh * 0.35);
      ctx.restore();
    }
    ctx.restore();
  }

  function drawSarcasticLaughter(ctx, w, h, d3, burstActive, motionTime) {
    var cx = w * 0.52;
    var cy = h * 0.69;
    var scale = Math.min(w, h);
    var intensity = clamp(d3, 0.06, 1);
    ctx.save();
    ctx.globalAlpha = clamp(0.07 + intensity * 0.89, 0.07, 0.96);

    ctx.fillStyle = 'rgba(24, 26, 29, 0.78)';
    ctx.beginPath();
    ctx.arc(cx, cy + scale * 0.02, scale * 0.092, Math.PI, 0, false);
    ctx.lineTo(cx + scale * 0.092, cy + scale * 0.065);
    ctx.lineTo(cx - scale * 0.092, cy + scale * 0.065);
    ctx.closePath();
    ctx.fill();

    for (var m = -2; m <= 2; m++) {
      var mx = cx + m * scale * 0.031;
      var my = cy + scale * 0.036 + Math.abs(m) * scale * 0.004;
      ctx.fillStyle = PALETTE.crustedTallow;
      ctx.beginPath();
      ctx.arc(mx, my, scale * 0.013, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = burstActive ? PALETTE.bowLanternAmber : PALETTE.furnaceSlag;
      ctx.fillRect(mx - scale * 0.006, my - scale * 0.002, scale * 0.012, scale * 0.0045);
    }

    var arcCount = burstActive ? 4 : 2;
    var pulse = motionTime > 0 ? Math.sin(motionTime * 9.0) * scale * 0.005 : 0;
    for (var a = 0; a < arcCount; a++) {
      var r = scale * (0.038 + a * 0.021) + pulse;
      ctx.strokeStyle = a % 2 === 0 ? PALETTE.furnaceSlag : PALETTE.bowLanternAmber;
      ctx.lineWidth = Math.max(1.5, scale * 0.0032 * intensity);
      ctx.beginPath();
      for (var s = 0; s <= 12; s++) {
        var ang = -Math.PI * 0.88 + (s / 12) * Math.PI * 0.76;
        var jag = (s % 2 === 0 ? 1 : -1) * scale * 0.006 * intensity;
        var px = cx + Math.cos(ang) * (r + jag);
        var py = cy + scale * 0.015 + Math.sin(ang) * (r + jag);
        if (s === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawLatheMandrelShifts(ctx, w, h, d4, sparks, motionTime) {
    var cx = w * 0.77;
    var cy = h * 0.32;
    var scale = Math.min(w, h);
    var intensity = clamp(d4, 0.06, 1);
    var chuckAngle = motionTime * Math.PI * 4.0;
    ctx.save();
    ctx.globalAlpha = clamp(0.08 + intensity * 0.89, 0.08, 0.97);

    ctx.strokeStyle = PALETTE.crustedTallow;
    ctx.lineWidth = Math.max(1.8, scale * 0.0035);
    for (var b = -1; b <= 1; b++) {
      var bx = cx + b * scale * 0.052;
      ctx.beginPath();
      ctx.moveTo(cx - scale * 0.008, h * 0.215);
      ctx.lineTo(bx - scale * 0.018, cy);
      ctx.moveTo(cx + scale * 0.008, h * 0.215);
      ctx.lineTo(bx - scale * 0.006, cy);
      ctx.stroke();

      ctx.fillStyle = PALETTE.greaseSoot;
      ctx.fillRect(bx - scale * 0.024, cy - scale * 0.014, scale * 0.048, scale * 0.028);
      ctx.strokeStyle = PALETTE.mandrelSteel;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(bx - scale * 0.024, cy - scale * 0.014, scale * 0.048, scale * 0.028);

      ctx.fillStyle = PALETTE.mandrelSteel;
      ctx.fillRect(bx - scale * 0.006, cy - scale * 0.0045, scale * 0.032, scale * 0.009);

      var chuckR = scale * 0.013;
      ctx.beginPath();
      ctx.arc(bx - scale * 0.01, cy, chuckR, 0, Math.PI * 2);
      ctx.stroke();
      for (var j = 0; j < 3; j++) {
        var ja = chuckAngle + (j * Math.PI * 2) / 3;
        ctx.beginPath();
        ctx.moveTo(bx - scale * 0.01, cy);
        ctx.lineTo(bx - scale * 0.01 + Math.cos(ja) * chuckR, cy + Math.sin(ja) * chuckR);
        ctx.stroke();
      }
    }

    for (var s = 0; s < sparks.length; s++) {
      var sp = sparks[s];
      var prog = motionTime > 0 ? ((motionTime * sp.speed + sp.phase) % 1) : sp.phase;
      var dist = scale * sp.reach * (0.35 + prog * 0.85) * intensity;
      var sx = cx + Math.cos(sp.angle) * dist;
      var sy = cy + Math.sin(sp.angle) * dist + prog * prog * scale * 0.025;
      ctx.strokeStyle = s % 2 === 0 ? PALETTE.bowLanternAmber : PALETTE.furnaceSlag;
      ctx.lineWidth = 1.35;
      ctx.beginPath();
      ctx.arc(sx, sy, scale * 0.0045, 0, Math.PI * 1.45);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSleepwalkingOutskirts(ctx, w, h, d5, rowCount, motionTime) {
    var cx = w * 0.81;
    var cy = h * 0.71;
    var scale = Math.min(w, h);
    var intensity = clamp(d5, 0.06, 1);
    ctx.save();
    ctx.globalAlpha = clamp(0.07 + intensity * 0.88, 0.07, 0.95);

    var rows = rowCount || 3;
    for (var r = 0; r < rows; r++) {
      var ry = cy - scale * 0.068 + r * scale * 0.026;
      var rw = scale * 0.21;
      ctx.fillStyle = r % 2 === 0 ? PALETTE.greaseSoot : PALETTE.crustedTallow;
      ctx.fillRect(cx - rw * 0.5, ry, rw, scale * 0.024);
      ctx.fillStyle = PALETTE.furnaceSlag;
      for (var win = 0; win < 7; win++) {
        ctx.fillRect(cx - rw * 0.44 + win * (rw * 0.14), ry + scale * 0.006, scale * 0.008, scale * 0.009);
      }
    }

    var marchShift = motionTime > 0 ? ((motionTime * 0.018) % 0.032) : 0;
    for (var wlk = 0; wlk < 6; wlk++) {
      var wx = cx - scale * 0.088 + wlk * scale * 0.032 + marchShift * scale;
      var wy = cy + scale * 0.024;
      ctx.fillStyle = PALETTE.mullionLimestone;
      ctx.fillRect(wx - 2, wy - scale * 0.016, 4, scale * 0.016);
      ctx.fillRect(wx, wy - scale * 0.013, scale * 0.009, 2);
    }

    for (var bg = 0; bg < 2; bg++) {
      var bx = cx - scale * 0.055 + bg * scale * 0.105;
      var by = cy + scale * 0.058 + bg * scale * 0.014;
      ctx.fillStyle = PALETTE.greaseSoot;
      ctx.beginPath();
      ctx.moveTo(bx - scale * 0.044, by);
      ctx.lineTo(bx + scale * 0.044, by);
      ctx.lineTo(bx + scale * 0.034, by + scale * 0.015);
      ctx.lineTo(bx - scale * 0.034, by + scale * 0.015);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = PALETTE.mandrelSteel;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderSootThings(ctx, width, height, filigreeState, disclosureMetrics, engineState) {
    if (!ctx || !(width > 0) || !(height > 0)) return;
    var st = filigreeState || {};
    var eng = engineState || createDisclosureEngine();
    var dm = disclosureMetrics || computeDisclosure(st, eng);
    var motionTime = st.reducedMotion ? 0 : (Number(st.time) || 0);
    if (!st.reducedMotion) {
      eng.trailerPhase = ((motionTime * 0.38) % 1 + 1) % 1;
    }

    ctx.save();
    if (st.discourseMode === 'literal_bleak') {
      ctx.globalAlpha = 0.24;
    }

    var p = Array.isArray(dm.perLocusDisclosure) ? dm.perLocusDisclosure : [0.08, 0.08, 0.08, 0.08, 0.08, 0.08];
    drawGlobalShaftAndSootVeil(ctx, width, height, dm.sootDisclosure, dm.greaseCrustDepth, motionTime);
    drawThickSootClouds(ctx, width, height, p[0], dm.sootDisclosure, eng.sootBillows, motionTime);
    drawGreaseEncrustedWalls(ctx, width, height, p[1], dm.greaseCrustDepth);
    drawCrushingTrailers(ctx, width, height, p[2], eng.trailerPhase, dm.crushingTrailerCount);
    drawSarcasticLaughter(ctx, width, height, p[3], dm.sarcasticBurstActive, motionTime);
    drawLatheMandrelShifts(ctx, width, height, p[4], eng.swarfSparks, motionTime);
    drawSleepwalkingOutskirts(ctx, width, height, p[5], dm.sleepwalkerRowCount, motionTime);
    ctx.restore();
  }

  function renderDuplicityPrism(ctx, width, height, filigreeState, disclosureMetrics) {
    if (!ctx || !(width > 0) || !(height > 0)) return;
    var st = filigreeState || {};
    var dm = disclosureMetrics || computeDisclosure(st);
    var u = clamp(st.pointerU != null ? st.pointerU : 0.45, 0, 1);
    var v = clamp(st.pointerV != null ? st.pointerV : 0.35, 0, 1);
    var ap = clamp(st.prismAperture != null ? st.prismAperture : 0.38, 0.05, 1.0);
    var cx = u * width;
    var cy = v * height;
    var r = Math.min(width, height) * (0.14 + 0.18 * ap);
    var mt = st.reducedMotion ? 0 : (Number(st.time) || 0);

    var nearest = COUNTER_THINGS[0];
    var bestD2 = Infinity;
    for (var n = 0; n < COUNTER_THINGS.length; n++) {
      var du = COUNTER_THINGS[n].u - u;
      var dv = COUNTER_THINGS[n].v - v;
      var d2 = du * du + dv * dv;
      if (d2 < bestD2) { bestD2 = d2; nearest = COUNTER_THINGS[n]; }
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.save();
    ctx.clip();

    ctx.fillStyle = 'rgba(18, 20, 24, 0.86)';
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    var step = Math.max(14, r * 0.22);
    ctx.strokeStyle = 'rgba(110, 123, 133, 0.28)';
    ctx.lineWidth = 1;
    for (var gx = cx - r; gx <= cx + r; gx += step) {
      ctx.beginPath(); ctx.moveTo(gx, cy - r); ctx.lineTo(gx, cy + r); ctx.stroke();
    }
    for (var gy = cy - r; gy <= cy + r; gy += step) {
      ctx.beginPath(); ctx.moveTo(cx - r, gy); ctx.lineTo(cx + r, gy); ctx.stroke();
      ctx.strokeStyle = 'rgba(184, 74, 39, ' + (0.22 + dm.greaseCrustDepth * 0.55).toFixed(3) + ')';
      ctx.beginPath();
      ctx.moveTo(cx - r, gy + 3);
      ctx.bezierCurveTo(cx - r * 0.3, gy + 8, cx + r * 0.3, gy - 4, cx + r, gy + 5);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(110, 123, 133, 0.28)';
    }

    var gearAng = mt * Math.PI * 4.0;
    var gr = r * 0.44;
    ctx.strokeStyle = PALETTE.bowLanternAmber;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy, gr, 0, Math.PI * 2); ctx.stroke();
    for (var tg = 0; tg < 12; tg++) {
      var a = gearAng + (tg * Math.PI * 2) / 12;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * gr * 0.78, cy + Math.sin(a) * gr * 0.78);
      ctx.lineTo(cx + Math.cos(a) * gr * 1.14, cy + Math.sin(a) * gr * 1.14);
      ctx.stroke();
    }

    for (var k = 0; k < COUNTER_THINGS.length; k++) {
      var ct = COUNTER_THINGS[k];
      var tx = ct.u * width;
      var ty = ct.v * height;
      ctx.strokeStyle = k === nearest.index ? PALETTE.bowLanternAmber : 'rgba(184, 74, 39, 0.52)';
      ctx.lineWidth = k === nearest.index ? 1.8 : 1;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.beginPath(); ctx.arc(tx, ty, r * 0.14, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();

    ctx.strokeStyle = PALETTE.mandrelSteel;
    ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = PALETTE.cushionSaffron;
    ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(cx, cy, r - 4, 0, Math.PI * 2); ctx.stroke();
    for (var tk = 0; tk < 24; tk++) {
      var ta = (tk * Math.PI * 2) / 24;
      var inR = tk % 6 === 0 ? r - 10 : r - 6;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(ta) * inR, cy + Math.sin(ta) * inR);
      ctx.lineTo(cx + Math.cos(ta) * r, cy + Math.sin(ta) * r);
      ctx.stroke();
    }

    var label = 'WORD FALSEHOOD 0.00 \u00b7 THING DUPLICITY ' + Number(dm.thingDuplicity).toFixed(2);
    var sub = '120 RPM \u00b7 ' + nearest.thingTitle.toUpperCase();
    var fontPx = Math.max(9, Math.min(11, Math.round(width * 0.0105)));
    ctx.font = '600 ' + fontPx + 'px monospace';
    var padX = 8;
    var boxW = Math.min(width - 12, Math.max(ctx.measureText(label).width, ctx.measureText(sub).width) + padX * 2);
    var boxH = fontPx * 2 + 12;
    var bx = clamp(cx - boxW * 0.5, 6, Math.max(6, width - boxW - 6));
    var by = (cy + r + boxH + 10 <= height) ? (cy + r + 6) : Math.max(6, cy - r - boxH - 6);

    ctx.fillStyle = 'rgba(24, 26, 29, 0.92)';
    ctx.fillRect(bx, by, boxW, boxH);
    ctx.strokeStyle = PALETTE.cushionSaffron;
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by, boxW, boxH);
    ctx.fillStyle = PALETTE.alabasterPeacock;
    ctx.textBaseline = 'top';
    ctx.fillText(label, bx + padX, by + 4);
    ctx.fillStyle = PALETTE.bowLanternAmber;
    ctx.fillText(sub, bx + padX, by + fontPx + 7);
    ctx.restore();
  }

  function createAudioEngine() {
    var ctx = null;
    var muted = false;
    var nodes = null;

    function ensureGraph() {
      if (ctx) return true;
      var AC = root.AudioContext || root.webkitAudioContext;
      if (typeof AC !== 'function') return false;
      try {
        ctx = new AC();
        var master = ctx.createGain();
        master.gain.value = muted ? 0 : 0.18;
        master.connect(ctx.destination);

        var shimmerGain = ctx.createGain();
        shimmerGain.gain.value = 0.05;
        shimmerGain.connect(master);
        var padA = ctx.createOscillator(); padA.type = 'sine'; padA.frequency.value = 293.66;
        var padB = ctx.createOscillator(); padB.type = 'triangle'; padB.frequency.value = 440.0;
        padA.connect(shimmerGain); padB.connect(shimmerGain);
        padA.start(); padB.start();

        var furnaceLP = ctx.createBiquadFilter();
        furnaceLP.type = 'lowpass'; furnaceLP.frequency.value = 98;
        var furnaceGain = ctx.createGain(); furnaceGain.gain.value = 0.015;
        var furnaceOsc = ctx.createOscillator(); furnaceOsc.type = 'sawtooth'; furnaceOsc.frequency.value = 55.0;
        furnaceOsc.connect(furnaceLP); furnaceLP.connect(furnaceGain); furnaceGain.connect(master);
        furnaceOsc.start();

        var bufLen = Math.max(2048, ctx.sampleRate);
        var nBuf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        var ch = nBuf.getChannelData(0);
        for (var i = 0; i < bufLen; i++) ch[i] = seededUnit(i + 17) * 2 - 1;
        var noiseSrc = ctx.createBufferSource(); noiseSrc.buffer = nBuf; noiseSrc.loop = true;
        var swarfBP = ctx.createBiquadFilter(); swarfBP.type = 'bandpass'; swarfBP.frequency.value = 1480; swarfBP.Q.value = 5.5;
        var swarfGain = ctx.createGain(); swarfGain.gain.value = 0.005;
        noiseSrc.connect(swarfBP); swarfBP.connect(swarfGain); swarfGain.connect(master);
        noiseSrc.start();

        var chuckOsc = ctx.createOscillator(); chuckOsc.type = 'square'; chuckOsc.frequency.value = 330;
        var chuckBP = ctx.createBiquadFilter(); chuckBP.type = 'bandpass'; chuckBP.frequency.value = 660; chuckBP.Q.value = 4.0;
        var chuckVca = ctx.createGain(); chuckVca.gain.value = 0;
        var chuckOut = ctx.createGain(); chuckOut.gain.value = 0.01;
        var latheLfo = ctx.createOscillator(); latheLfo.type = 'square'; latheLfo.frequency.value = 2.0;
        var lfoScale = ctx.createGain(); lfoScale.gain.value = 0.5;
        latheLfo.connect(lfoScale); lfoScale.connect(chuckVca.gain);
        chuckOsc.connect(chuckBP); chuckBP.connect(chuckVca); chuckVca.connect(chuckOut); chuckOut.connect(master);
        chuckOsc.start(); latheLfo.start();

        nodes = {
          master: master, shimmerGain: shimmerGain, furnaceGain: furnaceGain,
          swarfGain: swarfGain, chuckOut: chuckOut,
          sources: [padA, padB, furnaceOsc, noiseSrc, chuckOsc, latheLfo]
        };
        return true;
      } catch (_e) {
        ctx = null; nodes = null; return false;
      }
    }

    function unlock() {
      if (!ensureGraph() || !ctx) return false;
      try { if (ctx.state === 'suspended') { var p = ctx.resume(); if (p && p.catch) p.catch(function () {}); } } catch (_e) {}
      return true;
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      if (ctx && nodes) {
        try { nodes.master.gain.setTargetAtTime(muted ? 0 : 0.18, ctx.currentTime, 0.04); } catch (_e) {}
      }
      return muted;
    }

    function update(_filigreeState, _graceMetrics, disclosureMetrics) {
      if (!ctx || !nodes) return;
      var dm = disclosureMetrics || { sootDisclosure: 0.08, cityVitality: 0.82 };
      var soot = clamp(dm.sootDisclosure, 0, 1);
      var vit = clamp(dm.cityVitality, 0, 1);
      try {
        var now = ctx.currentTime;
        nodes.shimmerGain.gain.setTargetAtTime(0.012 + vit * 0.055, now, 0.08);
        nodes.furnaceGain.gain.setTargetAtTime(0.008 + soot * 0.11, now, 0.08);
        nodes.swarfGain.gain.setTargetAtTime(0.002 + soot * 0.045, now, 0.08);
        nodes.chuckOut.gain.setTargetAtTime(0.004 + soot * 0.065, now, 0.08);
      } catch (_e) {}
    }

    function triggerGraceUtterance(locusIndex, disclosureMetrics) {
      if (muted || !unlock() || !ctx || !nodes) return;
      var idx = Math.max(0, Math.min(5, Math.floor(Number(locusIndex) || 0)));
      var soot = clamp(disclosureMetrics && disclosureMetrics.sootDisclosure, 0.08, 1);
      var notes = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33];
      try {
        var now = ctx.currentTime;
        var harp = ctx.createOscillator(); var hg = ctx.createGain();
        harp.type = 'triangle'; harp.frequency.setValueAtTime(notes[idx], now);
        hg.gain.setValueAtTime(0.11, now); hg.gain.exponentialRampToValueAtTime(0.0008, now + 0.55);
        harp.connect(hg); hg.connect(nodes.master); harp.start(now); harp.stop(now + 0.58);

        var clang = ctx.createOscillator(); var cbp = ctx.createBiquadFilter(); var cg = ctx.createGain();
        clang.type = 'square'; clang.frequency.setValueAtTime(110 + idx * 38, now + 0.02);
        cbp.type = 'bandpass'; cbp.frequency.setValueAtTime(620 + idx * 140, now + 0.02); cbp.Q.value = 5.0;
        cg.gain.setValueAtTime(0.015 + soot * 0.085, now + 0.02); cg.gain.exponentialRampToValueAtTime(0.0008, now + 0.24);
        clang.connect(cbp); cbp.connect(cg); cg.connect(nodes.master); clang.start(now + 0.02); clang.stop(now + 0.26);

        if (idx === 3) {
          for (var b = 0; b < 3; b++) {
            var t0 = now + 0.04 + b * 0.11;
            var vox = ctx.createOscillator(); var f1 = ctx.createBiquadFilter(); var vg = ctx.createGain();
            vox.type = 'sawtooth'; vox.frequency.setValueAtTime(142 - b * 16, t0);
            f1.type = 'bandpass'; f1.frequency.setValueAtTime(760 + b * 240, t0); f1.Q.value = 6.5;
            vg.gain.setValueAtTime(0.06 + soot * 0.09, t0); vg.gain.exponentialRampToValueAtTime(0.001, t0 + 0.09);
            vox.connect(f1); f1.connect(vg); vg.connect(nodes.master); vox.start(t0); vox.stop(t0 + 0.095);
          }
        }
      } catch (_e) {}
    }

    function triggerModeSwitch(mode) {
      if (muted || !unlock() || !ctx || !nodes) return;
      try {
        var now = ctx.currentTime;
        var o = ctx.createOscillator(); var g = ctx.createGain();
        o.type = mode === 'literal_bleak' ? 'sawtooth' : 'sine';
        o.frequency.setValueAtTime(mode === 'literal_bleak' ? 220 : 293.66, now);
        o.frequency.exponentialRampToValueAtTime(mode === 'literal_bleak' ? 146.83 : 440, now + 0.22);
        g.gain.setValueAtTime(0.07, now); g.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
        o.connect(g); g.connect(nodes.master); o.start(now); o.stop(now + 0.28);
      } catch (_e) {}
    }

    function dispose() {
      if (!ctx) return;
      try {
        if (nodes && nodes.sources) {
          for (var i = 0; i < nodes.sources.length; i++) { try { nodes.sources[i].stop(); } catch (_e) {} }
        }
        var c = ctx; ctx = null; nodes = null;
        if (c.close) { var p = c.close(); if (p && p.catch) p.catch(function () {}); }
      } catch (_e) { ctx = null; nodes = null; }
    }

    return {
      unlock: unlock,
      setMuted: setMuted,
      isMuted: function () { return muted; },
      update: update,
      triggerGraceUtterance: triggerGraceUtterance,
      triggerModeSwitch: triggerModeSwitch,
      dispose: dispose
    };
  }

  var api = {
    CALVINO_AXIOM: CALVINO_AXIOM,
    PALETTE: PALETTE,
    COUNTER_THINGS: COUNTER_THINGS,
    createDisclosureEngine: createDisclosureEngine,
    computeDisclosure: computeDisclosure,
    renderSootThings: renderSootThings,
    renderDuplicityPrism: renderDuplicityPrism,
    createAudioEngine: createAudioEngine
  };

  root.OliviaSootLathe = api;
  if (typeof window !== 'undefined') {
    window.OliviaSootLathe = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
