(function (root) {
  'use strict';

  var STONE_CATALOG = [
    {
      id: 'silver_domes_60',
      index: 1,
      name: 'Sixty Silver Domes',
      audioKind: 'silver_dome',
      daylightNote: 'Sixty cold, fluted silver cupolas terraced across four hillside ridges—splendid and meticulously numbered, yet already familiar to the traveler who has admired such domes in other cities.',
      duskNote: 'When the shortening September evening ignites the food-stall lamps below, faint polychrome bounce-light warms the silver drums while memory splits every cupola into a ghosted double exposure.'
    },
    {
      id: 'bronze_statues_gods',
      index: 2,
      name: 'Bronze Statues of All the Gods',
      audioKind: 'bronze_bell',
      daylightNote: 'Eight pantheon niches housing cast-bronze deities with every canonical attribute—solemn, catalogued, and already known from the colonnades of other cities.',
      duskNote: 'Burnished bronze and dark verdigris catch warm saffron and carmine fire from the stalls, casting twin displacement shadows of an imagined prior evening.'
    },
    {
      id: 'lead_paved_streets',
      index: 3,
      name: 'Streets Paved with Lead',
      audioKind: 'lead_step',
      daylightNote: 'Heavy plumbum-engraved flagstones converging in strict perspective—matte, metallic, and acoustically deadened beneath the ordinary daylight sun.',
      duskNote: 'Under September twilight the lead slabs turn into a dark specular mirror flashing simultaneous ribbons of multicolored stall-lamp light.'
    },
    {
      id: 'crystal_theater',
      index: 4,
      name: 'The Crystal Theater',
      audioKind: 'crystal_chime',
      daylightNote: 'A faceted glass barrel-vault and crystalline proscenium at the heart of the plaza, refracting cool daylight harmonics like crystal pavilions seen elsewhere.',
      duskNote: 'Acts as a twilight prism splitting the synchronous stall-lamp rays into luminous ghost-exposures of spectators who think they were happy once before.'
    },
    {
      id: 'golden_cock_tower',
      index: 5,
      name: 'Golden Cock on the Campanile',
      audioKind: 'cock_crow',
      daylightNote: 'An articulated gilded weathercock crowning the tall campanile that fans its tail plumes and crows brazenly each morning—a marvel known to every seasoned traveler.',
      duskNote: 'With folded plumes and closed beak, the golden cock stands silent in dark silhouette against the shortening September sky as longing replaces morning certainty.'
    }
  ];

  var PANTHEON_GODS = [
    { godTitle: 'Sol Invictus — Meridian Sun', attribute: 'sun-disc' },
    { godTitle: 'Pelagius — Tides & Harbors', attribute: 'trident' },
    { godTitle: 'Mulciber — Forge & Plumbum', attribute: 'hammer' },
    { godTitle: 'Aequitas — Measure & Balance', attribute: 'scales' },
    { godTitle: 'Ceres — Autumn Harvest', attribute: 'sheaf' },
    { godTitle: 'Noctua — Vigil & Counsel', attribute: 'owl' },
    { godTitle: 'Cithara — Glass & Harmonics', attribute: 'lyre' },
    { godTitle: 'Janus — Thresholds & Memory', attribute: 'key' }
  ];

  var DEFAULT_LAMP_COLORS = [
    '#f4b43a',
    '#e44d3a',
    '#2fb67c',
    '#3b7be8',
    '#9a58e6',
    '#f08a28',
    '#d94894',
    '#2cb5c8'
  ];

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hexToRgb(hex) {
    if (typeof hex !== 'string') {
      return { r: 244, g: 180, b: 58 };
    }
    var s = hex.replace('#', '').trim();
    if (s.length === 3) {
      s = s.charAt(0) + s.charAt(0) + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2);
    }
    var num = parseInt(s, 16);
    if (isNaN(num)) {
      return { r: 244, g: 180, b: 58 };
    }
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  function rgbaStr(rgb, a) {
    return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + clamp(a, 0, 1).toFixed(3) + ')';
  }

  function mixRgb(c1, c2, t) {
    var u = clamp(t, 0, 1);
    return {
      r: Math.round(lerp(c1.r, c2.r, u)),
      g: Math.round(lerp(c1.g, c2.g, u)),
      b: Math.round(lerp(c1.b, c2.b, u))
    };
  }

  function detWave(seed) {
    var x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  function buildLayout(rawWidth, rawHeight) {
    var width = Math.max(1, Math.round(Number(rawWidth) || 1280));
    var height = Math.max(1, Math.round(Number(rawHeight) || 800));

    var horizonY = Math.round(height * 0.56);
    var vanishingPoint = {
      x: Math.round(width * 0.5),
      y: Math.round(height * 0.54)
    };

    var streetTopY = Math.round(height * 0.605);
    var botHalfW = Math.round(width * 0.355);
    var denomY = Math.max(1, height - vanishingPoint.y);
    var perspRatioTop = clamp((streetTopY - vanishingPoint.y) / denomY, 0.11, 0.25);
    var topHalfW = Math.max(20, Math.round(botHalfW * perspRatioTop));

    var streetPolygon = [
      { x: vanishingPoint.x - topHalfW, y: streetTopY },
      { x: vanishingPoint.x + topHalfW, y: streetTopY },
      { x: vanishingPoint.x + botHalfW, y: height },
      { x: vanishingPoint.x - botHalfW, y: height }
    ];

    // 12 food-stall doorways (6 left arcade, 6 right arcade), sorted back-to-front
    var stallStations = [0.10, 0.22, 0.36, 0.52, 0.71, 0.92];
    var sideWallW = Math.max(24, width * 0.5 - botHalfW);
    var maxDoorW = Math.min(46, width * 0.056, sideWallW * 0.54);
    var stallDoors = [];
    for (var r = 0; r < 6; r++) {
      var u = stallStations[r];
      var yBase = Math.round(lerp(streetTopY, height, u));
      var halfStreetAtU = lerp(topHalfW, botHalfW, u);
      var scale = 0.36 + 0.62 * u;
      var dw = Math.max(10, Math.round(maxDoorW * scale));
      var dh = Math.max(20, Math.round(dw * 2.02));
      var curbPad = Math.max(2, Math.round(dw * 0.14));
      var depthVal = Number((0.18 + u * 0.78).toFixed(3));

      var leftX = clamp(Math.round(vanishingPoint.x - halfStreetAtU - curbPad - dw), 4, Math.max(4, width - dw - 4));
      var rightX = clamp(Math.round(vanishingPoint.x + halfStreetAtU + curbPad), 4, Math.max(4, width - dw - 4));
      var doorY = Math.round(yBase - dh);

      stallDoors.push({
        index: r * 2,
        x: leftX,
        y: doorY,
        w: dw,
        h: dh,
        side: 'left',
        depth: depthVal
      });
      stallDoors.push({
        index: r * 2 + 1,
        x: rightX,
        y: doorY,
        w: dw,
        h: dh,
        side: 'right',
        depth: depthVal
      });
    }

    // Faceted crystal theater at the perspective heart
    var theaterW = Math.round(clamp(width * 0.21, 86, 320));
    var theaterH = Math.round(clamp(height * 0.222, 104, 240));
    var crystalTheater = {
      x: Math.round(vanishingPoint.x - theaterW * 0.5),
      y: Math.round(streetTopY - theaterH),
      w: theaterW,
      h: theaterH
    };

    // Tall campanile crowned with the golden weathercock (upper-left plaza flank)
    var towerWidth = Math.round(clamp(width * 0.036, 20, 56));
    var towerCock = {
      x: Math.round(width * 0.242),
      y: Math.round(height * 0.145),
      towerBaseY: Math.round(height * 0.515),
      towerWidth: towerWidth
    };

    // Elevated stone loggia/balustrade overlooking the upper-right street arcade
    var terraceW = Math.round(clamp(width * 0.124, 48, 184));
    var terraceH = Math.round(clamp(height * 0.086, 44, 92));
    var terraceX = clamp(Math.round(width * 0.758), crystalTheater.x + crystalTheater.w + 24, Math.max(24, width - terraceW - 10));
    var terraceAnchor = {
      x: terraceX,
      y: Math.round(height * 0.422),
      w: terraceW,
      h: terraceH
    };

    // 8 pantheon niches (4 left colonnade, 4 right colonnade)
    var nicheTopY = Math.round(height * 0.518);
    var nicheH = Math.max(38, Math.round(streetTopY - nicheTopY - Math.max(4, height * 0.008)));
    var leftWingStart = Math.round(width * 0.038);
    var leftWingEnd = Math.max(leftWingStart + 64, crystalTheater.x - Math.max(8, Math.round(width * 0.016)));
    var rightWingStart = Math.min(width - 68, crystalTheater.x + crystalTheater.w + Math.max(8, Math.round(width * 0.016)));
    var rightWingEnd = Math.round(width * 0.962);

    var bronzeNiches = [];
    for (var g = 0; g < 8; g++) {
      var isLeftWing = g < 4;
      var slot = isLeftWing ? g : g - 4;
      var wStart = isLeftWing ? leftWingStart : rightWingStart;
      var wEnd = isLeftWing ? leftWingEnd : rightWingEnd;
      var bayW = (wEnd - wStart) / 4;
      var nw = Math.round(clamp(bayW * 0.62, 16, 62));
      var nx = Math.round(wStart + bayW * (slot + 0.5) - nw * 0.5);
      bronzeNiches.push({
        index: g,
        godTitle: PANTHEON_GODS[g].godTitle,
        attribute: PANTHEON_GODS[g].attribute,
        x: nx,
        y: nicheTopY,
        w: nw,
        h: nicheH
      });
    }

    // 60 silver cupolas across 4 terraced skyline ridges, parting cleanly around tower, theater, and terrace
    var towerPad = Math.max(10, Math.round(towerWidth * 0.72));
    var towerLeft = towerCock.x - towerPad;
    var towerRight = towerCock.x + towerPad;
    var theaterLeft = crystalTheater.x - Math.max(8, Math.round(width * 0.01));
    var theaterRight = crystalTheater.x + crystalTheater.w + Math.max(8, Math.round(width * 0.01));
    var terraceLeft = terraceAnchor.x - Math.max(6, Math.round(width * 0.008));
    var terraceRight = terraceAnchor.x + terraceAnchor.w + Math.max(6, Math.round(width * 0.008));

    var tierSpecs = [
      // Tier 0: High Citadel Crest (14 domes: 4 + 10)
      {
        tier: 0,
        baseY: height * 0.242,
        archAmp: height * 0.016,
        rxFactor: 0.36,
        rxMin: 5,
        rxMax: 18,
        segments: [
          { x0: width * 0.042, x1: towerLeft, count: 4 },
          { x0: towerRight, x1: width * 0.958, count: 10 }
        ]
      },
      // Tier 1: Upper Crown Ridge (16 domes: 4 + 12)
      {
        tier: 1,
        baseY: height * 0.312,
        archAmp: height * 0.015,
        rxFactor: 0.38,
        rxMin: 6,
        rxMax: 21,
        segments: [
          { x0: width * 0.036, x1: towerLeft, count: 4 },
          { x0: towerRight, x1: width * 0.964, count: 12 }
        ]
      },
      // Tier 2: Middle Amphitheater Ridge (15 domes: 5 + 2 + 8)
      {
        tier: 2,
        baseY: height * 0.384,
        archAmp: height * 0.013,
        rxFactor: 0.40,
        rxMin: 6,
        rxMax: 24,
        segments: [
          { x0: width * 0.034, x1: towerLeft, count: 5 },
          { x0: towerRight, x1: theaterLeft, count: 2 },
          { x0: theaterRight, x1: width * 0.966, count: 8 }
        ]
      },
      // Tier 3: Lower Horizon Drum Terrace (15 domes: 5 + 3 + 5 + 2)
      {
        tier: 3,
        baseY: height * 0.468,
        archAmp: height * 0.011,
        rxFactor: 0.42,
        rxMin: 6,
        rxMax: 26,
        segments: [
          { x0: width * 0.032, x1: towerLeft, count: 5 },
          { x0: towerRight, x1: theaterLeft, count: 3 },
          { x0: theaterRight, x1: terraceLeft, count: 5 },
          { x0: terraceRight, x1: width * 0.972, count: 2 }
        ]
      }
    ];

    var domes = [];
    var domeIdx = 0;
    for (var ti = 0; ti < tierSpecs.length; ti++) {
      var ts = tierSpecs[ti];
      for (var si = 0; si < ts.segments.length; si++) {
        var seg = ts.segments[si];
        var segSpan = Math.max(seg.count * 6, seg.x1 - seg.x0);
        var step = segSpan / seg.count;
        for (var k = 0; k < seg.count; k++) {
          var jitter = (detWave(domeIdx * 3.17 + ti * 11.3) - 0.5) * step * 0.14;
          var cx = Math.round(seg.x0 + step * (k + 0.5) + jitter);
          var nx = (cx / width) * 2 - 1;
          var hillCurve = Math.cos(nx * Math.PI * 0.85) * ts.archAmp;
          var microStep = (detWave(domeIdx * 7.41 + 2.9) - 0.5) * height * 0.012;
          var cy = Math.round(ts.baseY - hillCurve + microStep);

          var sizeVar = 0.88 + detWave(domeIdx * 5.13 + 1.7) * 0.24;
          var rx = Math.round(clamp(step * ts.rxFactor * sizeVar, ts.rxMin, ts.rxMax));
          var aspect = 1.16 + detWave(domeIdx * 2.63 + 4.1) * 0.22;
          var ry = Math.max(rx + 1, Math.round(rx * aspect));
          var lanternH = Math.max(5, Math.round(ry * 0.44));

          domes.push({
            index: domeIdx,
            x: cx,
            y: cy,
            rx: rx,
            ry: ry,
            lanternH: lanternH,
            tier: ts.tier
          });
          domeIdx++;
        }
      }
    }

    return {
      width: width,
      height: height,
      horizonY: horizonY,
      vanishingPoint: vanishingPoint,
      streetPolygon: streetPolygon,
      stallDoors: stallDoors,
      terraceAnchor: terraceAnchor,
      crystalTheater: crystalTheater,
      towerCock: towerCock,
      bronzeNiches: bronzeNiches,
      domeCount: 60,
      domes: domes
    };
  }

  // Drawing helpers: burin engraving hatch lines
  function drawBurinHatch(ctx, x, y, w, h, spacing, angleRad, strokeStyle, lineWidth) {
    if (w <= 1 || h <= 1) return;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth || 0.7;
    var diag = Math.sqrt(w * w + h * h);
    var cx = x + w * 0.5;
    var cy = y + h * 0.5;
    ctx.translate(cx, cy);
    ctx.rotate(angleRad);
    ctx.beginPath();
    var step = Math.max(2.5, spacing);
    for (var p = -diag * 0.6; p <= diag * 0.6; p += step) {
      ctx.moveTo(p, -diag * 0.6);
      ctx.lineTo(p, diag * 0.6);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawHillTerraces(ctx, layout, dayFactor, lampsLit) {
    var W = layout.width;
    var H = layout.height;
    var baseYs = [H * 0.255, H * 0.326, H * 0.402, H * 0.486];
    var amplitudes = [H * 0.016, H * 0.015, H * 0.013, H * 0.011];

    for (var t = 0; t < 4; t++) {
      var topDay = mixRgb({ r: 174, g: 184, b: 196 }, { r: 118, g: 129, b: 143 }, t / 3);
      var topNight = mixRgb({ r: 34, g: 39, b: 54 }, { r: 24, g: 28, b: 40 }, t / 3);
      var botDay = mixRgb({ r: 138, g: 148, b: 162 }, { r: 92, g: 102, b: 116 }, t / 3);
      var botNight = mixRgb({ r: 22, g: 26, b: 38 }, { r: 16, g: 19, b: 29 }, t / 3);

      var cTop = mixRgb(topNight, topDay, dayFactor);
      var cBot = mixRgb(botNight, botDay, dayFactor);
      if (lampsLit && t >= 2) {
        cBot = mixRgb(cBot, { r: 78, g: 52, b: 68 }, 0.22);
      }

      var yStart = baseYs[t];
      var yEnd = layout.streetPolygon[0].y + 4;
      var grad = ctx.createLinearGradient(0, yStart - 20, 0, yEnd);
      grad.addColorStop(0, rgbaStr(cTop, 0.96));
      grad.addColorStop(1, rgbaStr(cBot, 0.99));

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(0, yEnd);
      var steps = 28;
      for (var s = 0; s <= steps; s++) {
        var px = (s / steps) * W;
        var nx = (px / W) * 2 - 1;
        var arch = Math.cos(nx * Math.PI * 0.85) * amplitudes[t];
        var terraceStep = Math.sin(s * 1.9 + t * 2.1) * (H * 0.004);
        var py = yStart - arch + terraceStep;
        ctx.lineTo(px, py);
      }
      ctx.lineTo(W, yEnd);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = rgbaStr(mixRgb({ r: 58, g: 66, b: 82 }, { r: 70, g: 78, b: 90 }, dayFactor), 0.55);
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Fine horizontal burin retaining-wall lines
      ctx.strokeStyle = rgbaStr({ r: 24, g: 29, b: 38 }, 0.14 + 0.12 * dayFactor);
      ctx.lineWidth = 0.65;
      var bandBottom = t < 3 ? baseYs[t + 1] + 10 : layout.horizonY + 18;
      ctx.beginPath();
      for (var hy = yStart + 6; hy < bandBottom; hy += 5 + t) {
        ctx.moveTo(0, hy);
        ctx.lineTo(W, hy);
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawSingleSilverDome(ctx, d, dayFactor, solarAltitude, lampsLit, lampColors, highlightActive) {
    var x = d.x;
    var y = d.y;
    var rx = d.rx;
    var ry = d.ry;
    var drumH = Math.max(5, Math.round(ry * 0.42));

    var lightShift = clamp(0.25 + solarAltitude * 0.35, 0.15, 0.65);

    // Tambour drum beneath cupola
    var drumLeft = x - rx * 0.92;
    var drumW = rx * 1.84;
    var drumGrad = ctx.createLinearGradient(drumLeft, y, drumLeft + drumW, y);
    var drumHi = mixRgb({ r: 78, g: 88, b: 108 }, { r: 224, g: 231, b: 240 }, dayFactor);
    var drumMid = mixRgb({ r: 48, g: 56, b: 72 }, { r: 158, g: 168, b: 182 }, dayFactor);
    var drumShade = mixRgb({ r: 26, g: 31, b: 44 }, { r: 84, g: 94, b: 108 }, dayFactor);

    if (lampsLit) {
      var bounceHex = lampColors[d.index % lampColors.length];
      var bounceRgb = hexToRgb(bounceHex);
      drumMid = mixRgb(drumMid, bounceRgb, 0.24);
      drumShade = mixRgb(drumShade, bounceRgb, 0.18);
    }

    drumGrad.addColorStop(0, rgbaStr(drumHi, 1));
    drumGrad.addColorStop(0.48, rgbaStr(drumMid, 1));
    drumGrad.addColorStop(1, rgbaStr(drumShade, 1));

    ctx.fillStyle = drumGrad;
    ctx.fillRect(drumLeft, y - 1, drumW, drumH + 2);

    ctx.strokeStyle = rgbaStr({ r: 28, g: 34, b: 44 }, 0.72);
    ctx.lineWidth = 0.85;
    ctx.strokeRect(drumLeft, y - 1, drumW, drumH + 2);

    // Tiny lancet windows in tambour drum
    var winCount = rx >= 13 ? 5 : 3;
    ctx.fillStyle = lampsLit
      ? rgbaStr(mixRgb({ r: 42, g: 48, b: 64 }, hexToRgb(lampColors[(d.index + 3) % lampColors.length]), 0.35), 0.85)
      : rgbaStr({ r: 34, g: 41, b: 52 }, 0.75);
    for (var wi = 0; wi < winCount; wi++) {
      var wx = drumLeft + drumW * ((wi + 0.8) / (winCount + 0.6));
      var ww = Math.max(1.2, rx * 0.11);
      var wh = Math.max(2.5, drumH * 0.52);
      ctx.fillRect(wx - ww * 0.5, y + drumH * 0.22, ww, wh);
    }

    // Burnished silver cupola
    var specX = x - rx * lightShift;
    var specY = y - ry * 0.58;
    var cupGrad = ctx.createRadialGradient(specX, specY, Math.max(1, rx * 0.08), x, y - ry * 0.15, Math.max(rx, ry) * 1.28);

    var specBright = mixRgb({ r: 162, g: 176, b: 204 }, { r: 250, g: 253, b: 255 }, dayFactor);
    var silBody = mixRgb({ r: 88, g: 98, b: 122 }, { r: 196, g: 206, b: 218 }, dayFactor);
    var silDark = mixRgb({ r: 36, g: 42, b: 58 }, { r: 94, g: 105, b: 120 }, dayFactor);

    if (lampsLit) {
      var underColor = hexToRgb(lampColors[(d.index * 3) % lampColors.length]);
      silDark = mixRgb(silDark, underColor, 0.32);
      silBody = mixRgb(silBody, underColor, 0.14);
    }

    cupGrad.addColorStop(0, rgbaStr(specBright, 1));
    cupGrad.addColorStop(0.42, rgbaStr(silBody, 1));
    cupGrad.addColorStop(0.84, rgbaStr(silDark, 1));
    cupGrad.addColorStop(1, rgbaStr(mixRgb(silDark, { r: 20, g: 24, b: 34 }, 0.35), 1));

    ctx.beginPath();
    ctx.moveTo(x - rx, y);
    ctx.bezierCurveTo(x - rx * 1.04, y - ry * 0.66, x - rx * 0.42, y - ry * 1.02, x, y - ry);
    ctx.bezierCurveTo(x + rx * 0.42, y - ry * 1.02, x + rx * 1.04, y - ry * 0.66, x + rx, y);
    ctx.closePath();
    ctx.fillStyle = cupGrad;
    ctx.fill();

    // Reflected polychrome rim glow along cupola base when lamps ignite
    if (lampsLit) {
      var rimRgb = hexToRgb(lampColors[d.index % lampColors.length]);
      var rimGrad = ctx.createLinearGradient(x, y + 2, x, y - ry * 0.62);
      rimGrad.addColorStop(0, rgbaStr(rimRgb, 0.46));
      rimGrad.addColorStop(1, rgbaStr(rimRgb, 0));
      ctx.fillStyle = rimGrad;
      ctx.fill();
    }

    // Fluted meridian ribs across the silver dome
    var ribFracs = [-0.68, -0.36, 0, 0.36, 0.68];
    ctx.strokeStyle = rgbaStr(mixRgb({ r: 30, g: 36, b: 50 }, { r: 62, g: 72, b: 86 }, dayFactor), 0.56);
    ctx.lineWidth = 0.7;
    for (var rf = 0; rf < ribFracs.length; rf++) {
      var f = ribFracs[rf];
      ctx.beginPath();
      ctx.moveTo(x + rx * f, y);
      ctx.quadraticCurveTo(x + rx * f * 0.92, y - ry * 0.62, x + rx * f * 0.14, y - ry * 0.97);
      ctx.stroke();
    }

    // Cold daylight specular silver crescent highlight
    if (dayFactor > 0.12) {
      ctx.beginPath();
      ctx.moveTo(x - rx * 0.58, y - ry * 0.12);
      ctx.quadraticCurveTo(x - rx * 0.52, y - ry * 0.68, x - rx * 0.08, y - ry * 0.92);
      ctx.strokeStyle = rgbaStr({ r: 255, g: 255, b: 255 }, 0.55 * dayFactor);
      ctx.lineWidth = Math.max(0.8, rx * 0.08);
      ctx.stroke();
    }

    // Cupola contour + molded cornice ring
    ctx.beginPath();
    ctx.moveTo(x - rx, y);
    ctx.bezierCurveTo(x - rx * 1.04, y - ry * 0.66, x - rx * 0.42, y - ry * 1.02, x, y - ry);
    ctx.bezierCurveTo(x + rx * 0.42, y - ry * 1.02, x + rx * 1.04, y - ry * 0.66, x + rx, y);
    ctx.strokeStyle = highlightActive ? 'rgba(246, 224, 158, 0.92)' : rgbaStr({ r: 24, g: 30, b: 40 }, 0.84);
    ctx.lineWidth = highlightActive ? 1.35 : 0.9;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x - rx * 1.04, y);
    ctx.lineTo(x + rx * 1.04, y);
    ctx.strokeStyle = rgbaStr(specBright, 0.5 + 0.35 * dayFactor);
    ctx.lineWidth = 1.1;
    ctx.stroke();

    // Silver lantern & finial spire
    var lanW = Math.max(2.4, rx * 0.28);
    var lanBodyH = d.lanternH * 0.48;
    ctx.fillStyle = rgbaStr(silBody, 0.96);
    ctx.fillRect(x - lanW * 0.5, y - ry - lanBodyH, lanW, lanBodyH);
    ctx.strokeStyle = rgbaStr({ r: 26, g: 32, b: 44 }, 0.8);
    ctx.lineWidth = 0.75;
    ctx.strokeRect(x - lanW * 0.5, y - ry - lanBodyH, lanW, lanBodyH);

    ctx.beginPath();
    ctx.moveTo(x, y - ry - lanBodyH);
    ctx.lineTo(x, y - ry - d.lanternH);
    ctx.strokeStyle = highlightActive ? 'rgba(250, 230, 168, 0.95)' : rgbaStr(mixRgb({ r: 120, g: 134, b: 162 }, { r: 235, g: 242, b: 250 }, dayFactor), 0.95);
    ctx.lineWidth = 0.95;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x, y - ry - d.lanternH * 0.76, Math.max(1.1, rx * 0.085), 0, Math.PI * 2);
    ctx.fillStyle = rgbaStr(specBright, 0.95);
    ctx.fill();
  }

  function drawTowerAndGoldenCock(ctx, layout, params, dayFactor, highlightActive) {
    var tc = layout.towerCock;
    var tx = tc.x;
    var apexY = tc.y;
    var baseY = tc.towerBaseY;
    var tw = tc.towerWidth;
    var totalH = Math.max(80, baseY - apexY);

    var spireTipY = apexY + Math.max(16, totalH * 0.085);
    var spireBaseY = spireTipY + totalH * 0.24;
    var belfryBottomY = spireBaseY + totalH * 0.18;

    // Tapered stone shaft
    var topW = tw * 0.78;
    var botW = tw * 1.04;
    var shaftLight = mixRgb({ r: 64, g: 70, b: 86 }, { r: 204, g: 208, b: 214 }, dayFactor);
    var shaftMid = mixRgb({ r: 42, g: 47, b: 62 }, { r: 156, g: 162, b: 170 }, dayFactor);
    var shaftDark = mixRgb({ r: 24, g: 28, b: 40 }, { r: 98, g: 105, b: 116 }, dayFactor);

    var shaftGrad = ctx.createLinearGradient(tx - botW * 0.5, belfryBottomY, tx + botW * 0.5, belfryBottomY);
    shaftGrad.addColorStop(0, rgbaStr(shaftLight, 1));
    shaftGrad.addColorStop(0.55, rgbaStr(shaftMid, 1));
    shaftGrad.addColorStop(1, rgbaStr(shaftDark, 1));

    ctx.beginPath();
    ctx.moveTo(tx - topW * 0.5, belfryBottomY);
    ctx.lineTo(tx + topW * 0.5, belfryBottomY);
    ctx.lineTo(tx + botW * 0.5, baseY);
    ctx.lineTo(tx - botW * 0.5, baseY);
    ctx.closePath();
    ctx.fillStyle = shaftGrad;
    ctx.fill();
    ctx.strokeStyle = highlightActive ? 'rgba(248, 214, 118, 0.92)' : rgbaStr({ r: 24, g: 28, b: 38 }, 0.88);
    ctx.lineWidth = highlightActive ? 1.5 : 1.05;
    ctx.stroke();

    // Recessed pilaster panels & ashlar courses
    drawBurinHatch(ctx, tx + topW * 0.06, belfryBottomY, botW * 0.42, baseY - belfryBottomY, 4.2, 0.62, 'rgba(20,24,34,0.26)', 0.65);
    ctx.strokeStyle = rgbaStr({ r: 30, g: 35, b: 46 }, 0.42);
    ctx.lineWidth = 0.7;
    var courseStep = Math.max(7, (baseY - belfryBottomY) / 14);
    ctx.beginPath();
    for (var cy = belfryBottomY + courseStep; cy < baseY; cy += courseStep) {
      var u = (cy - belfryBottomY) / Math.max(1, baseY - belfryBottomY);
      var hw = lerp(topW, botW, u) * 0.5;
      ctx.moveTo(tx - hw, cy);
      ctx.lineTo(tx + hw, cy);
    }
    ctx.stroke();

    // Belfry loggia with twin arches & hanging bronze bell
    var belW = topW * 1.12;
    ctx.fillStyle = shaftGrad;
    ctx.fillRect(tx - belW * 0.5, spireBaseY, belW, belfryBottomY - spireBaseY);
    ctx.strokeStyle = rgbaStr({ r: 24, g: 28, b: 38 }, 0.88);
    ctx.lineWidth = 1.0;
    ctx.strokeRect(tx - belW * 0.5, spireBaseY, belW, belfryBottomY - spireBaseY);

    var archH = (belfryBottomY - spireBaseY) * 0.68;
    var archW = belW * 0.28;
    for (var bi = -1; bi <= 1; bi += 2) {
      var ax = tx + bi * belW * 0.21;
      var ay = belfryBottomY - 3;
      ctx.beginPath();
      ctx.moveTo(ax - archW * 0.5, ay);
      ctx.lineTo(ax - archW * 0.5, ay - archH * 0.65);
      ctx.arc(ax, ay - archH * 0.65, archW * 0.5, Math.PI, 0, false);
      ctx.lineTo(ax + archW * 0.5, ay);
      ctx.closePath();
      ctx.fillStyle = rgbaStr({ r: 22, g: 26, b: 36 }, 0.88);
      ctx.fill();
    }

    // Small gilt bell silhouette inside left belfry arch
    ctx.fillStyle = rgbaStr(mixRgb({ r: 96, g: 76, b: 42 }, { r: 204, g: 162, b: 76 }, dayFactor), 0.92);
    ctx.beginPath();
    ctx.arc(tx - belW * 0.21, spireBaseY + (belfryBottomY - spireBaseY) * 0.52, Math.max(2, archW * 0.32), Math.PI, 0, false);
    ctx.lineTo(tx - belW * 0.21 + archW * 0.42, spireBaseY + (belfryBottomY - spireBaseY) * 0.72);
    ctx.lineTo(tx - belW * 0.21 - archW * 0.42, spireBaseY + (belfryBottomY - spireBaseY) * 0.72);
    ctx.closePath();
    ctx.fill();

    // Cornice molding
    ctx.fillStyle = rgbaStr(shaftLight, 0.98);
    ctx.fillRect(tx - belW * 0.6, spireBaseY - 3, belW * 1.2, 4);
    ctx.fillRect(tx - belW * 0.58, belfryBottomY - 2, belW * 1.16, 4);

    // Lead-sheathed octagonal spire
    var spireGrad = ctx.createLinearGradient(tx - belW * 0.5, spireBaseY, tx + belW * 0.5, spireBaseY);
    spireGrad.addColorStop(0, rgbaStr(mixRgb({ r: 62, g: 72, b: 92 }, { r: 168, g: 180, b: 196 }, dayFactor), 1));
    spireGrad.addColorStop(0.5, rgbaStr(mixRgb({ r: 40, g: 48, b: 64 }, { r: 112, g: 124, b: 140 }, dayFactor), 1));
    spireGrad.addColorStop(1, rgbaStr(mixRgb({ r: 22, g: 27, b: 40 }, { r: 64, g: 74, b: 88 }, dayFactor), 1));

    ctx.beginPath();
    ctx.moveTo(tx, spireTipY);
    ctx.lineTo(tx + belW * 0.52, spireBaseY - 3);
    ctx.lineTo(tx - belW * 0.52, spireBaseY - 3);
    ctx.closePath();
    ctx.fillStyle = spireGrad;
    ctx.fill();
    ctx.strokeStyle = rgbaStr({ r: 22, g: 26, b: 36 }, 0.88);
    ctx.lineWidth = 0.95;
    ctx.stroke();

    // Central spire rib
    ctx.beginPath();
    ctx.moveTo(tx, spireTipY);
    ctx.lineTo(tx, spireBaseY - 3);
    ctx.strokeStyle = rgbaStr({ r: 230, g: 238, b: 248 }, 0.35 * dayFactor);
    ctx.lineWidth = 0.8;
    ctx.stroke();

    // Weathervane rod & cardinal cross
    ctx.beginPath();
    ctx.moveTo(tx, spireTipY);
    ctx.lineTo(tx, apexY + 4);
    ctx.moveTo(tx - tw * 0.28, spireTipY - (spireTipY - apexY) * 0.36);
    ctx.lineTo(tx + tw * 0.28, spireTipY - (spireTipY - apexY) * 0.36);
    ctx.strokeStyle = rgbaStr(mixRgb({ r: 132, g: 104, b: 48 }, { r: 232, g: 190, b: 78 }, dayFactor), 0.95);
    ctx.lineWidth = 1.25;
    ctx.stroke();

    // Articulated Golden Cock
    var solarAlt = typeof params.solarAltitude === 'number' ? params.solarAltitude : 0.72;
    var crowPulse = clamp(Number(params.crowPulse) || 0, 0, 1);
    var isCrowing = solarAlt > 0.55 || crowPulse > 0;
    var morningVigor = clamp((solarAlt - 0.55) / 0.30, 0, 1);
    var crowStrength = Math.max(crowPulse, morningVigor);
    var cadence = (!params.reducedMotion && isCrowing)
      ? (0.65 + 0.35 * Math.sin((Number(params.timeSec) || 0) * 5.4))
      : 1.0;
    var openFactor = isCrowing ? clamp(crowStrength * cadence, 0.35, 1) : 0;

    var cockScale = clamp(tw / 34, 0.68, 1.45);
    var goldHi = mixRgb({ r: 172, g: 132, b: 56 }, { r: 255, g: 234, b: 132 }, clamp(dayFactor + crowPulse * 0.6, 0, 1));
    var goldMid = mixRgb({ r: 108, g: 80, b: 34 }, { r: 232, g: 178, b: 46 }, clamp(dayFactor + crowPulse * 0.5, 0, 1));
    var goldDark = mixRgb({ r: 52, g: 38, b: 22 }, { r: 148, g: 102, b: 22 }, clamp(dayFactor + crowPulse * 0.4, 0, 1));

    ctx.save();
    ctx.translate(tx, apexY);
    ctx.scale(cockScale, cockScale);

    // Gilded orb pedestal
    ctx.beginPath();
    ctx.arc(0, 7, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = rgbaStr(goldMid, 1);
    ctx.fill();

    // Articulated tail plumes (fan wide when crowing)
    var plumeCount = 5;
    for (var pi = 0; pi < plumeCount; pi++) {
      var pf = pi / (plumeCount - 1);
      var baseSpread = lerp(-0.18, 0.34, pf);
      var crowSpread = lerp(-0.55, 0.78, pf);
      var ang = lerp(baseSpread, crowSpread, openFactor);
      var len = lerp(12, 18, Math.sin(pf * Math.PI)) * (1 + 0.16 * openFactor);

      ctx.save();
      ctx.translate(-5.5, 1.5);
      ctx.rotate(ang);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(-len * 0.55, -len * 0.58, -len, -len * 0.08 + 2.5);
      ctx.quadraticCurveTo(-len * 0.52, -len * 0.28, 0, 2.2);
      ctx.closePath();
      ctx.fillStyle = pi % 2 === 0 ? rgbaStr(goldHi, 0.96) : rgbaStr(goldMid, 0.96);
      ctx.fill();
      ctx.strokeStyle = rgbaStr(goldDark, 0.85);
      ctx.lineWidth = 0.7;
      ctx.stroke();
      ctx.restore();
    }

    // Cock body & proud arched neck
    var headLift = openFactor * 2.8;
    var bodyGrad = ctx.createLinearGradient(-7, -10, 9, 6);
    bodyGrad.addColorStop(0, rgbaStr(goldHi, 1));
    bodyGrad.addColorStop(0.55, rgbaStr(goldMid, 1));
    bodyGrad.addColorStop(1, rgbaStr(goldDark, 1));

    ctx.beginPath();
    ctx.moveTo(-6, 2);
    ctx.quadraticCurveTo(-1, 6.5, 5.5, 3);
    ctx.quadraticCurveTo(9.2, -0.5 - headLift * 0.4, 6.2, -6.5 - headLift);
    ctx.arc(4.8, -7.5 - headLift, 3.1, 0.2, Math.PI * 1.35, true);
    ctx.quadraticCurveTo(0.8, -3.5 - headLift * 0.5, -6, 2);
    ctx.closePath();
    ctx.fillStyle = bodyGrad;
    ctx.fill();
    ctx.strokeStyle = rgbaStr(goldDark, 0.9);
    ctx.lineWidth = 0.85;
    ctx.stroke();

    // Wing engraving arc
    ctx.beginPath();
    ctx.arc(0.5, 1.2, 4.2, 0.25, Math.PI * 0.92);
    ctx.strokeStyle = rgbaStr(goldDark, 0.75);
    ctx.lineWidth = 0.75;
    ctx.stroke();

    // Legs on orb
    ctx.beginPath();
    ctx.moveTo(-1, 4.5);
    ctx.lineTo(-0.5, 7);
    ctx.moveTo(1.5, 4.5);
    ctx.lineTo(1, 7);
    ctx.strokeStyle = rgbaStr(goldDark, 0.9);
    ctx.lineWidth = 0.9;
    ctx.stroke();

    // Serrated comb & wattle
    var combColor = isCrowing
      ? mixRgb(goldHi, { r: 238, g: 94, b: 56 }, 0.42)
      : rgbaStr(goldMid, 0.95);
    ctx.fillStyle = typeof combColor === 'string' ? combColor : rgbaStr(combColor, 0.98);
    ctx.beginPath();
    var hx = 5.0;
    var hy = -9.6 - headLift;
    ctx.moveTo(hx - 2.6, hy + 1.2);
    ctx.lineTo(hx - 2.0, hy - 2.4);
    ctx.lineTo(hx - 0.6, hy - 0.6);
    ctx.lineTo(hx + 0.5, hy - 3.0);
    ctx.lineTo(hx + 1.6, hy - 0.5);
    ctx.lineTo(hx + 2.8, hy - 2.1);
    ctx.lineTo(hx + 2.6, hy + 1.4);
    ctx.closePath();
    ctx.fill();

    // Articulated upper & lower beak
    var beakX = 7.5;
    var beakY = -7.6 - headLift;
    var jawGap = openFactor * 2.6;
    ctx.fillStyle = rgbaStr(goldHi, 1);
    ctx.beginPath();
    ctx.moveTo(beakX, beakY - 1.1);
    ctx.lineTo(beakX + 5.2, beakY - 0.6 - jawGap * 0.75);
    ctx.lineTo(beakX, beakY + 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(beakX, beakY + 0.2);
    ctx.lineTo(beakX + 4.5, beakY + 0.9 + jawGap * 0.85);
    ctx.lineTo(beakX - 0.2, beakY + 1.3);
    ctx.closePath();
    ctx.fill();

    // Golden morning acoustic rings when crowing
    if (isCrowing) {
      var ringOriginX = beakX + 5.5;
      var ringOriginY = beakY - 0.2;
      var phase = params.reducedMotion ? 0.35 : ((Number(params.timeSec) || 0) * 1.35) % 1;
      for (var ri = 0; ri < 3; ri++) {
        var prog = params.reducedMotion ? (ri + 1) / 3.4 : (phase + ri / 3) % 1;
        var rad = 7 + prog * 28;
        var alpha = (1 - prog * 0.82) * (0.35 + 0.45 * crowStrength);
        ctx.beginPath();
        ctx.arc(ringOriginX, ringOriginY, rad, -0.68, 0.58);
        ctx.strokeStyle = 'rgba(252, 214, 102,' + clamp(alpha, 0.06, 0.85).toFixed(3) + ')';
        ctx.lineWidth = 1.25 - prog * 0.45;
        ctx.stroke();
      }
    }

    if (highlightActive) {
      ctx.beginPath();
      ctx.arc(0, -2, 20, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(252, 222, 134, 0.78)';
      ctx.setLineDash([3, 3]);
      ctx.lineWidth = 1.1;
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  function drawCrystalTheater(ctx, layout, dayFactor, lampsLit, lampColors, highlightActive) {
    var ct = layout.crystalTheater;
    var cx = ct.x + ct.w * 0.5;
    var topY = ct.y;
    var baseY = ct.y + ct.h;
    var naveHalfW = ct.w * 0.31;
    var wingHalfW = ct.w * 0.5;
    var wingTopY = topY + ct.h * 0.30;
    var vaultSpringY = topY + ct.h * 0.26;

    ctx.save();

    // Stepped stone-and-crystal stylobate podium
    ctx.fillStyle = rgbaStr(mixRgb({ r: 38, g: 44, b: 58 }, { r: 184, g: 194, b: 206 }, dayFactor), 0.96);
    ctx.fillRect(ct.x - 4, baseY - 7, ct.w + 8, 7);
    ctx.strokeStyle = rgbaStr({ r: 24, g: 30, b: 42 }, 0.82);
    ctx.lineWidth = 0.9;
    ctx.strokeRect(ct.x - 4, baseY - 7, ct.w + 8, 7);

    // Side crystal wings (translucent faceted glass)
    for (var side = -1; side <= 1; side += 2) {
      var wx0 = side < 0 ? cx - wingHalfW : cx + naveHalfW;
      var ww = wingHalfW - naveHalfW;
      var wh = baseY - 7 - wingTopY;

      var wingGrad = ctx.createLinearGradient(wx0, wingTopY, wx0 + ww, baseY);
      if (lampsLit) {
        var wc1 = hexToRgb(lampColors[side < 0 ? 3 : 4]);
        var wc2 = hexToRgb(lampColors[side < 0 ? 0 : 1]);
        wingGrad.addColorStop(0, rgbaStr(mixRgb({ r: 120, g: 170, b: 220 }, wc1, 0.55), 0.58));
        wingGrad.addColorStop(1, rgbaStr(mixRgb({ r: 60, g: 80, b: 120 }, wc2, 0.62), 0.72));
      } else {
        wingGrad.addColorStop(0, rgbaStr(mixRgb({ r: 78, g: 108, b: 142 }, { r: 222, g: 241, b: 252 }, dayFactor), 0.68));
        wingGrad.addColorStop(0.5, rgbaStr(mixRgb({ r: 54, g: 78, b: 112 }, { r: 176, g: 212, b: 236 }, dayFactor), 0.62));
        wingGrad.addColorStop(1, rgbaStr(mixRgb({ r: 36, g: 52, b: 78 }, { r: 138, g: 176, b: 206 }, dayFactor), 0.74));
      }

      ctx.beginPath();
      if (side < 0) {
        ctx.moveTo(wx0, wingTopY + wh * 0.14);
        ctx.lineTo(wx0 + ww, wingTopY);
        ctx.lineTo(wx0 + ww, baseY - 7);
        ctx.lineTo(wx0, baseY - 7);
      } else {
        ctx.moveTo(wx0, wingTopY);
        ctx.lineTo(wx0 + ww, wingTopY + wh * 0.14);
        ctx.lineTo(wx0 + ww, baseY - 7);
        ctx.lineTo(wx0, baseY - 7);
      }
      ctx.closePath();
      ctx.fillStyle = wingGrad;
      ctx.fill();

      ctx.strokeStyle = rgbaStr(mixRgb({ r: 130, g: 170, b: 210 }, { r: 245, g: 252, b: 255 }, dayFactor), 0.72);
      ctx.lineWidth = 0.9;
      ctx.stroke();

      // Diagonal crystal lattice ribs on side wing
      ctx.beginPath();
      var rows = 4;
      for (var r = 0; r < rows; r++) {
        var ry0 = wingTopY + wh * 0.14 + (wh * 0.86) * (r / rows);
        var ry1 = wingTopY + wh * 0.14 + (wh * 0.86) * ((r + 1) / rows);
        ctx.moveTo(wx0, ry0);
        ctx.lineTo(wx0 + ww, ry1);
        ctx.moveTo(wx0 + ww, ry0);
        ctx.lineTo(wx0, ry1);
      }
      ctx.strokeStyle = rgbaStr(mixRgb({ r: 150, g: 190, b: 230 }, { r: 255, g: 255, b: 255 }, dayFactor), 0.42);
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    // Central faceted crystal barrel-vault & nave
    var naveGrad = ctx.createLinearGradient(cx - naveHalfW, topY, cx + naveHalfW, baseY);
    if (lampsLit) {
      naveGrad.addColorStop(0, rgbaStr(mixRgb({ r: 140, g: 190, b: 245 }, hexToRgb(lampColors[4]), 0.48), 0.62));
      naveGrad.addColorStop(0.48, rgbaStr(mixRgb({ r: 180, g: 215, b: 250 }, hexToRgb(lampColors[2]), 0.44), 0.56));
      naveGrad.addColorStop(1, rgbaStr(mixRgb({ r: 90, g: 110, b: 150 }, hexToRgb(lampColors[0]), 0.58), 0.74));
    } else {
      naveGrad.addColorStop(0, rgbaStr(mixRgb({ r: 96, g: 132, b: 174 }, { r: 238, g: 249, b: 255 }, dayFactor), 0.74));
      naveGrad.addColorStop(0.45, rgbaStr(mixRgb({ r: 68, g: 98, b: 136 }, { r: 194, g: 226, b: 246 }, dayFactor), 0.64));
      naveGrad.addColorStop(1, rgbaStr(mixRgb({ r: 42, g: 62, b: 92 }, { r: 148, g: 186, b: 216 }, dayFactor), 0.78));
    }

    ctx.beginPath();
    ctx.moveTo(cx - naveHalfW, baseY - 7);
    ctx.lineTo(cx - naveHalfW, vaultSpringY);
    ctx.bezierCurveTo(cx - naveHalfW, topY + 2, cx - naveHalfW * 0.42, topY, cx, topY);
    ctx.bezierCurveTo(cx + naveHalfW * 0.42, topY, cx + naveHalfW, topY + 2, cx + naveHalfW, vaultSpringY);
    ctx.lineTo(cx + naveHalfW, baseY - 7);
    ctx.closePath();
    ctx.fillStyle = naveGrad;
    ctx.fill();

    // Warm polychrome prismatic rays splitting inside the crystal vault when lampsLit
    if (lampsLit) {
      for (var pr = 0; pr < 5; pr++) {
        var rayRgb = hexToRgb(lampColors[pr % lampColors.length]);
        var angle = lerp(-0.52, 0.52, pr / 4);
        ctx.beginPath();
        ctx.moveTo(cx, baseY - 12);
        ctx.lineTo(cx + Math.sin(angle - 0.09) * ct.h * 0.92, baseY - Math.cos(angle - 0.09) * ct.h * 0.88);
        ctx.lineTo(cx + Math.sin(angle + 0.09) * ct.h * 0.92, baseY - Math.cos(angle + 0.09) * ct.h * 0.88);
        ctx.closePath();
        ctx.fillStyle = rgbaStr(rayRgb, 0.22);
        ctx.fill();
      }
    } else if (dayFactor > 0.15) {
      // Cool sky harmonic refraction bands by day
      ctx.beginPath();
      ctx.moveTo(cx - naveHalfW * 0.72, topY + ct.h * 0.10);
      ctx.lineTo(cx - naveHalfW * 0.18, topY + ct.h * 0.03);
      ctx.lineTo(cx + naveHalfW * 0.45, baseY - 9);
      ctx.lineTo(cx - naveHalfW * 0.12, baseY - 9);
      ctx.closePath();
      ctx.fillStyle = rgbaStr({ r: 255, g: 255, b: 255 }, 0.26 * dayFactor);
      ctx.fill();
    }

    // Crystalline vault ribs & horizontal transoms
    var ribCols = [-0.66, -0.33, 0, 0.33, 0.66];
    ctx.strokeStyle = rgbaStr(mixRgb({ r: 165, g: 205, b: 242 }, { r: 252, g: 254, b: 255 }, dayFactor), 0.78);
    ctx.lineWidth = 0.9;
    for (var rc = 0; rc < ribCols.length; rc++) {
      var rf = ribCols[rc];
      ctx.beginPath();
      ctx.moveTo(cx + naveHalfW * rf, baseY - 7);
      ctx.lineTo(cx + naveHalfW * rf, vaultSpringY);
      ctx.quadraticCurveTo(cx + naveHalfW * rf * 0.65, topY + 3, cx, topY);
      ctx.stroke();
    }

    for (var tr = 1; tr <= 4; tr++) {
      var ty = lerp(vaultSpringY, baseY - 7, tr / 5);
      ctx.beginPath();
      ctx.moveTo(cx - naveHalfW, ty);
      ctx.lineTo(cx + naveHalfW, ty);
      ctx.strokeStyle = rgbaStr({ r: 235, g: 246, b: 255 }, 0.42);
      ctx.lineWidth = 0.75;
      ctx.stroke();
    }

    // Faceted rose-prism tympanum at vault spring
    var roseY = vaultSpringY + ct.h * 0.10;
    var roseR = Math.min(naveHalfW * 0.36, ct.h * 0.14);
    ctx.beginPath();
    ctx.arc(cx, roseY, roseR, 0, Math.PI * 2);
    ctx.fillStyle = lampsLit
      ? rgbaStr(hexToRgb(lampColors[0]), 0.28)
      : rgbaStr({ r: 240, g: 250, b: 255 }, 0.34 * dayFactor + 0.12);
    ctx.fill();
    ctx.strokeStyle = rgbaStr({ r: 248, g: 252, b: 255 }, 0.82);
    ctx.lineWidth = 0.95;
    ctx.stroke();

    for (var sp = 0; sp < 8; sp++) {
      var sa = (sp * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(cx, roseY);
      ctx.lineTo(cx + Math.cos(sa) * roseR, roseY + Math.sin(sa) * roseR);
      ctx.stroke();
    }

    // Triple crystalline proscenium arches at plaza level
    var proscTopY = baseY - ct.h * 0.40;
    for (var pa = -1; pa <= 1; pa++) {
      var isCenter = pa === 0;
      var pw = isCenter ? naveHalfW * 0.56 : naveHalfW * 0.34;
      var ph = isCenter ? (baseY - 7 - proscTopY) : (baseY - 7 - proscTopY) * 0.82;
      var px = cx + pa * naveHalfW * 0.56;
      var pyArch = baseY - 7 - ph + pw * 0.5;

      ctx.beginPath();
      ctx.moveTo(px - pw * 0.5, baseY - 7);
      ctx.lineTo(px - pw * 0.5, pyArch);
      ctx.arc(px, pyArch, pw * 0.5, Math.PI, 0, false);
      ctx.lineTo(px + pw * 0.5, baseY - 7);
      ctx.closePath();

      ctx.fillStyle = lampsLit
        ? rgbaStr(mixRgb({ r: 36, g: 42, b: 68 }, hexToRgb(lampColors[(pa + 2) % lampColors.length]), 0.42), 0.72)
        : rgbaStr(mixRgb({ r: 28, g: 40, b: 62 }, { r: 102, g: 138, b: 174 }, dayFactor), 0.68);
      ctx.fill();
      ctx.strokeStyle = rgbaStr({ r: 244, g: 250, b: 255 }, 0.85);
      ctx.lineWidth = 1.05;
      ctx.stroke();
    }

    // Outer crystal nave frame
    ctx.beginPath();
    ctx.moveTo(cx - naveHalfW, baseY - 7);
    ctx.lineTo(cx - naveHalfW, vaultSpringY);
    ctx.bezierCurveTo(cx - naveHalfW, topY + 2, cx - naveHalfW * 0.42, topY, cx, topY);
    ctx.bezierCurveTo(cx + naveHalfW * 0.42, topY, cx + naveHalfW, topY + 2, cx + naveHalfW, vaultSpringY);
    ctx.lineTo(cx + naveHalfW, baseY - 7);
    ctx.strokeStyle = highlightActive ? 'rgba(186, 238, 255, 0.96)' : rgbaStr({ r: 34, g: 52, b: 74 }, 0.85);
    ctx.lineWidth = highlightActive ? 1.6 : 1.1;
    ctx.stroke();

    // Finial prism spire atop crystal vault
    ctx.beginPath();
    ctx.moveTo(cx, topY);
    ctx.lineTo(cx - 3.5, topY - 7);
    ctx.lineTo(cx, topY - 14);
    ctx.lineTo(cx + 3.5, topY - 7);
    ctx.closePath();
    ctx.fillStyle = 'rgba(235, 248, 255, 0.92)';
    ctx.fill();
    ctx.strokeStyle = rgbaStr({ r: 44, g: 68, b: 96 }, 0.8);
    ctx.lineWidth = 0.8;
    ctx.stroke();

    ctx.restore();
  }

  function drawGodAttribute(ctx, attribute, sx, sy, scale, bronzeBright, verdigris) {
    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(scale, scale);
    ctx.strokeStyle = bronzeBright;
    ctx.fillStyle = bronzeBright;
    ctx.lineWidth = 1.15;

    if (attribute === 'sun-disc') {
      ctx.beginPath();
      ctx.arc(0, -11, 5.2, 0, Math.PI * 2);
      ctx.stroke();
      for (var r = 0; r < 8; r++) {
        var a = (r * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * 5.6, -11 + Math.sin(a) * 5.6);
        ctx.lineTo(Math.cos(a) * 8.6, -11 + Math.sin(a) * 8.6);
        ctx.stroke();
      }
    } else if (attribute === 'trident') {
      ctx.beginPath();
      ctx.moveTo(6.5, 11);
      ctx.lineTo(6.5, -13);
      ctx.moveTo(3.5, -9);
      ctx.lineTo(3.5, -13.5);
      ctx.moveTo(9.5, -9);
      ctx.lineTo(9.5, -13.5);
      ctx.moveTo(3.5, -9);
      ctx.quadraticCurveTo(6.5, -7, 9.5, -9);
      ctx.stroke();
    } else if (attribute === 'hammer') {
      ctx.beginPath();
      ctx.moveTo(6, 7);
      ctx.lineTo(6, -9);
      ctx.stroke();
      ctx.fillRect(2.6, -11.5, 6.8, 3.6);
      ctx.fillStyle = verdigris;
      ctx.fillRect(-7.5, 7.5, 5.5, 3.5);
    } else if (attribute === 'scales') {
      ctx.beginPath();
      ctx.moveTo(-8, -3);
      ctx.lineTo(8, -3);
      ctx.moveTo(-7.5, -3);
      ctx.lineTo(-9, 2.5);
      ctx.moveTo(-7.5, -3);
      ctx.lineTo(-6, 2.5);
      ctx.moveTo(7.5, -3);
      ctx.lineTo(6, 2.5);
      ctx.moveTo(7.5, -3);
      ctx.lineTo(9, 2.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-7.5, 2.5, 2.2, 0, Math.PI, false);
      ctx.arc(7.5, 2.5, 2.2, 0, Math.PI, false);
      ctx.fill();
    } else if (attribute === 'sheaf') {
      ctx.beginPath();
      ctx.moveTo(5.5, 9);
      ctx.lineTo(4.2, -5);
      ctx.moveTo(5.5, 9);
      ctx.lineTo(6.8, -6);
      ctx.moveTo(5.5, 9);
      ctx.lineTo(8.4, -4);
      ctx.moveTo(-5, -1);
      ctx.arc(-6.5, -4, 3.6, 0.4, Math.PI * 1.35, false);
      ctx.stroke();
    } else if (attribute === 'owl') {
      ctx.beginPath();
      ctx.ellipse(6.5, -3.5, 2.3, 3.3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(4.8, -6.2);
      ctx.lineTo(4.2, -8.2);
      ctx.moveTo(8.2, -6.2);
      ctx.lineTo(8.8, -8.2);
      ctx.moveTo(-6.2, 11);
      ctx.lineTo(-6.2, -12.5);
      ctx.stroke();
    } else if (attribute === 'lyre') {
      ctx.beginPath();
      ctx.arc(6.2, -2, 3.4, 0.15, Math.PI - 0.15, false);
      ctx.moveTo(3.2, -2);
      ctx.quadraticCurveTo(2.4, -7.5, 4.2, -9.2);
      ctx.moveTo(9.2, -2);
      ctx.quadraticCurveTo(10.0, -7.5, 8.2, -9.2);
      ctx.moveTo(3.8, -8.5);
      ctx.lineTo(8.6, -8.5);
      ctx.stroke();
    } else if (attribute === 'key') {
      ctx.beginPath();
      ctx.arc(6.5, -8.2, 2.6, 0, Math.PI * 2);
      ctx.moveTo(6.5, -5.6);
      ctx.lineTo(6.5, 5.5);
      ctx.moveTo(6.5, 2.5);
      ctx.lineTo(9.2, 2.5);
      ctx.moveTo(6.5, 4.8);
      ctx.lineTo(9.2, 4.8);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawPantheonAndBronzeGods(ctx, layout, dayFactor, lampsLit, lampColors, highlightActive) {
    var niches = layout.bronzeNiches;
    if (!niches.length) return;

    var streetTopY = layout.streetPolygon[0].y;
    var wingTopY = niches[0].y - Math.max(8, layout.height * 0.015);

    // Draw Left & Right stone colonnade wings
    for (var w = 0; w < 2; w++) {
      var nFirst = niches[w * 4];
      var nLast = niches[w * 4 + 3];
      var wx = nFirst.x - Math.max(8, nFirst.w * 0.28);
      var ww = (nLast.x + nLast.w + Math.max(8, nLast.w * 0.28)) - wx;
      var wh = streetTopY - wingTopY;

      var stoneHi = mixRgb({ r: 58, g: 64, b: 80 }, { r: 204, g: 208, b: 214 }, dayFactor);
      var stoneMid = mixRgb({ r: 38, g: 43, b: 56 }, { r: 158, g: 164, b: 174 }, dayFactor);
      if (lampsLit) {
        stoneMid = mixRgb(stoneMid, { r: 136, g: 88, b: 64 }, 0.22);
      }

      var colGrad = ctx.createLinearGradient(wx, wingTopY, wx, streetTopY);
      colGrad.addColorStop(0, rgbaStr(stoneHi, 1));
      colGrad.addColorStop(1, rgbaStr(stoneMid, 1));

      ctx.fillStyle = colGrad;
      ctx.fillRect(wx, wingTopY, ww, wh);

      // Entablature & triglyph frieze
      ctx.fillStyle = rgbaStr(mixRgb({ r: 74, g: 82, b: 100 }, { r: 222, g: 226, b: 232 }, dayFactor), 1);
      ctx.fillRect(wx - 3, wingTopY - 4, ww + 6, 5);
      ctx.strokeStyle = rgbaStr({ r: 24, g: 28, b: 38 }, 0.85);
      ctx.lineWidth = 0.95;
      ctx.strokeRect(wx, wingTopY, ww, wh);

      drawBurinHatch(ctx, wx, wingTopY + 5, ww, wh - 5, 5.0, 0.0, 'rgba(20,24,34,0.16)', 0.6);
    }

    // Draw each of the 8 pantheon niches & bronze statues
    for (var i = 0; i < niches.length; i++) {
      var n = niches[i];
      var nx = n.x;
      var ny = n.y;
      var nw = n.w;
      var nh = n.h;
      var cx = nx + nw * 0.5;
      var archR = nw * 0.46;
      var archCy = ny + archR + 2;

      // Deep shadowed shell apse
      ctx.beginPath();
      ctx.moveTo(nx + nw * 0.04, ny + nh);
      ctx.lineTo(nx + nw * 0.04, archCy);
      ctx.arc(cx, archCy, archR, Math.PI, 0, false);
      ctx.lineTo(nx + nw * 0.96, ny + nh);
      ctx.closePath();

      var apseGrad = ctx.createLinearGradient(cx, ny, cx, ny + nh);
      apseGrad.addColorStop(0, 'rgba(18, 22, 30, 0.95)');
      apseGrad.addColorStop(1, lampsLit ? 'rgba(54, 38, 36, 0.92)' : 'rgba(32, 38, 48, 0.92)');
      ctx.fillStyle = apseGrad;
      ctx.fill();

      // Scallop shell ribs in niche head
      ctx.strokeStyle = 'rgba(130, 142, 160, 0.25)';
      ctx.lineWidth = 0.65;
      for (var sr = 1; sr <= 5; sr++) {
        var sa = Math.PI + (sr * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(cx, archCy);
        ctx.lineTo(cx + Math.cos(sa) * archR, archCy + Math.sin(sa) * archR);
        ctx.stroke();
      }

      ctx.strokeStyle = highlightActive ? 'rgba(226, 182, 108, 0.95)' : rgbaStr({ r: 22, g: 26, b: 36 }, 0.88);
      ctx.lineWidth = highlightActive ? 1.35 : 0.95;
      ctx.stroke();

      // Fluted colonnade pilasters flanking niche
      var pilW = Math.max(2.2, nw * 0.11);
      var pilColor = rgbaStr(mixRgb({ r: 72, g: 78, b: 96 }, { r: 218, g: 222, b: 228 }, dayFactor), 0.95);
      ctx.fillStyle = pilColor;
      ctx.fillRect(nx - pilW * 0.7, ny + 2, pilW, nh - 2);
      ctx.fillRect(nx + nw - pilW * 0.3, ny + 2, pilW, nh - 2);

      // Inscribed stone pedestal inside niche
      var pedH = Math.max(6, nh * 0.16);
      var pedW = nw * 0.58;
      ctx.fillStyle = rgbaStr(mixRgb({ r: 54, g: 60, b: 74 }, { r: 168, g: 174, b: 182 }, dayFactor), 0.96);
      ctx.fillRect(cx - pedW * 0.5, ny + nh - pedH, pedW, pedH);

      // Cast-bronze statue silhouette (verdigris recesses + burnished bronze + warm dusk fire)
      var figTop = ny + nh * 0.22;
      var figBot = ny + nh - pedH;
      var figH = Math.max(16, figBot - figTop);
      var figScale = figH / 28;

      var verdigrisRgb = mixRgb({ r: 42, g: 78, b: 72 }, { r: 68, g: 118, b: 106 }, dayFactor);
      var bronzeBodyRgb = mixRgb({ r: 94, g: 64, b: 34 }, { r: 168, g: 118, b: 58 }, dayFactor);
      var bronzeSpecRgb = mixRgb({ r: 164, g: 112, b: 54 }, { r: 228, g: 176, b: 96 }, dayFactor);

      if (lampsLit) {
        var fireRgb = hexToRgb(lampColors[i % lampColors.length]);
        bronzeSpecRgb = mixRgb(bronzeSpecRgb, fireRgb, 0.45);
        bronzeBodyRgb = mixRgb(bronzeBodyRgb, { r: 216, g: 128, b: 52 }, 0.32);
      }

      var statGrad = ctx.createLinearGradient(cx - 5 * figScale, figTop, cx + 5 * figScale, figBot);
      statGrad.addColorStop(0, rgbaStr(bronzeSpecRgb, 1));
      statGrad.addColorStop(0.52, rgbaStr(bronzeBodyRgb, 1));
      statGrad.addColorStop(1, rgbaStr(verdigrisRgb, 1));

      var midY = (figTop + figBot) * 0.5;
      ctx.save();
      ctx.translate(cx, midY);
      ctx.scale(figScale, figScale);

      // Contrapposto draped deity figure
      ctx.beginPath();
      ctx.arc(0, -10.5, 2.7, 0, Math.PI * 2);
      ctx.moveTo(-4.4, -7.2);
      ctx.lineTo(4.4, -7.2);
      ctx.lineTo(3.6, 1.5);
      ctx.lineTo(4.6, 13.5);
      ctx.lineTo(-4.4, 13.5);
      ctx.lineTo(-3.4, 1.5);
      ctx.closePath();
      ctx.fillStyle = statGrad;
      ctx.fill();

      // Verdigris drapery fold lines
      ctx.beginPath();
      ctx.moveTo(-2.2, -6.2);
      ctx.lineTo(-1.0, 12.8);
      ctx.moveTo(1.8, -5.8);
      ctx.lineTo(0.8, 12.8);
      ctx.strokeStyle = rgbaStr(verdigrisRgb, 0.85);
      ctx.lineWidth = 0.85;
      ctx.stroke();

      // Outstretched arm toward attribute
      ctx.beginPath();
      ctx.moveTo(3.5, -6.4);
      ctx.lineTo(6.6, -2.2);
      ctx.moveTo(-3.5, -6.4);
      ctx.lineTo(-6.0, -1.8);
      ctx.strokeStyle = rgbaStr(bronzeSpecRgb, 0.95);
      ctx.lineWidth = 1.3;
      ctx.stroke();
      ctx.restore();

      // Iconic attribute in burnished bronze
      drawGodAttribute(
        ctx,
        n.attribute,
        cx,
        midY,
        figScale * 0.92,
        rgbaStr(bronzeSpecRgb, 0.98),
        rgbaStr(verdigrisRgb, 0.92)
      );
    }
  }

  function drawLeadPavedStreetAndArcades(ctx, layout, dayFactor, lampsLit, lampColors, highlightStreet) {
    var W = layout.width;
    var H = layout.height;
    var vp = layout.vanishingPoint;
    var sp = layout.streetPolygon;
    var streetTopY = sp[0].y;

    // 1. Left & Right stone food-stall arcade facades flanking streetPolygon
    for (var side = 0; side < 2; side++) {
      var isLeft = side === 0;
      var facHi = mixRgb({ r: 46, g: 52, b: 68 }, { r: 186, g: 192, b: 200 }, dayFactor);
      var facDark = mixRgb({ r: 24, g: 28, b: 40 }, { r: 118, g: 126, b: 138 }, dayFactor);
      if (lampsLit) {
        facHi = mixRgb(facHi, { r: 122, g: 78, b: 58 }, 0.24);
      }

      var facGrad = isLeft
        ? ctx.createLinearGradient(0, streetTopY, sp[0].x, H)
        : ctx.createLinearGradient(W, streetTopY, sp[1].x, H);
      facGrad.addColorStop(0, rgbaStr(facDark, 1));
      facGrad.addColorStop(1, rgbaStr(facHi, 1));

      ctx.beginPath();
      if (isLeft) {
        ctx.moveTo(0, streetTopY - 8);
        ctx.lineTo(sp[0].x, streetTopY);
        ctx.lineTo(sp[3].x, H);
        ctx.lineTo(0, H);
      } else {
        ctx.moveTo(W, streetTopY - 8);
        ctx.lineTo(sp[1].x, streetTopY);
        ctx.lineTo(sp[2].x, H);
        ctx.lineTo(W, H);
      }
      ctx.closePath();
      ctx.fillStyle = facGrad;
      ctx.fill();
      ctx.strokeStyle = rgbaStr({ r: 20, g: 24, b: 34 }, 0.88);
      ctx.lineWidth = 1.05;
      ctx.stroke();

      // Perspective stringcourses receding along arcade walls
      ctx.strokeStyle = rgbaStr({ r: 26, g: 31, b: 42 }, 0.36);
      ctx.lineWidth = 0.75;
      for (var sc = 1; sc <= 6; sc++) {
        var edgeY = lerp(streetTopY - 4, H * 0.92, sc / 7);
        ctx.beginPath();
        if (isLeft) {
          ctx.moveTo(0, edgeY);
          ctx.lineTo(sp[0].x, lerp(streetTopY, vp.y, 0.12));
        } else {
          ctx.moveTo(W, edgeY);
          ctx.lineTo(sp[1].x, lerp(streetTopY, vp.y, 0.12));
        }
        ctx.stroke();
      }
    }

    // 2. Elevated Terrace Loggia & Balustrade overlooking the upper-right street arcade
    var ta = layout.terraceAnchor;
    var terStoneHi = mixRgb({ r: 62, g: 68, b: 86 }, { r: 214, g: 218, b: 224 }, dayFactor);
    var terStoneMid = mixRgb({ r: 38, g: 44, b: 58 }, { r: 158, g: 164, b: 174 }, dayFactor);

    // Supporting corbel entablature under terrace
    ctx.fillStyle = rgbaStr(terStoneMid, 0.98);
    ctx.fillRect(ta.x - 5, ta.y + ta.h - 2, ta.w + 10, 7);

    // Loggia rear wall & triple arches
    ctx.fillStyle = rgbaStr(terStoneHi, 0.96);
    ctx.fillRect(ta.x, ta.y, ta.w, ta.h);
    ctx.strokeStyle = rgbaStr({ r: 22, g: 26, b: 36 }, 0.86);
    ctx.lineWidth = 0.95;
    ctx.strokeRect(ta.x, ta.y, ta.w, ta.h);

    // Cornice crown
    ctx.fillStyle = rgbaStr(terStoneHi, 1);
    ctx.fillRect(ta.x - 4, ta.y - 4, ta.w + 8, 5);

    var bayW = ta.w / 3;
    for (var lb = 0; lb < 3; lb++) {
      var bx = ta.x + bayW * (lb + 0.5);
      var aw = bayW * 0.68;
      var archSpring = ta.y + ta.h * 0.34;
      ctx.beginPath();
      ctx.moveTo(bx - aw * 0.5, ta.y + ta.h * 0.76);
      ctx.lineTo(bx - aw * 0.5, archSpring);
      ctx.arc(bx, archSpring, aw * 0.5, Math.PI, 0, false);
      ctx.lineTo(bx + aw * 0.5, ta.y + ta.h * 0.76);
      ctx.closePath();
      ctx.fillStyle = rgbaStr({ r: 22, g: 26, b: 38 }, 0.88);
      ctx.fill();
      ctx.strokeStyle = rgbaStr({ r: 28, g: 34, b: 46 }, 0.75);
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Classical stone balustrade across lower 28% of terraceAnchor
    var railTopY = ta.y + ta.h * 0.72;
    var railBotY = ta.y + ta.h;
    ctx.fillStyle = rgbaStr(terStoneHi, 0.98);
    ctx.fillRect(ta.x - 2, railTopY, ta.w + 4, 3);
    ctx.fillRect(ta.x - 2, railBotY - 3, ta.w + 4, 3);
    var balCount = 9;
    for (var bc = 0; bc < balCount; bc++) {
      var balX = ta.x + (ta.w * (bc + 0.5)) / balCount;
      ctx.fillRect(balX - 1.3, railTopY + 3, 2.6, railBotY - railTopY - 6);
    }
    ctx.strokeStyle = rgbaStr({ r: 24, g: 28, b: 38 }, 0.82);
    ctx.lineWidth = 0.8;
    ctx.strokeRect(ta.x - 2, railTopY, ta.w + 4, railBotY - railTopY);

    // 3. The 12 Food-Stall Doorways (friggitorie) in the stone arcades
    var doors = layout.stallDoors;
    for (var di = 0; di < doors.length; di++) {
      var d = doors[di];
      var dcx = d.x + d.w * 0.5;
      var dArchR = d.w * 0.5;
      var dArchY = d.y + dArchR;

      // Stone arch voussoir surround
      ctx.beginPath();
      ctx.moveTo(d.x - 2.5, d.y + d.h);
      ctx.lineTo(d.x - 2.5, dArchY);
      ctx.arc(dcx, dArchY, dArchR + 2.5, Math.PI, 0, false);
      ctx.lineTo(d.x + d.w + 2.5, d.y + d.h);
      ctx.closePath();
      ctx.fillStyle = rgbaStr(mixRgb({ r: 58, g: 64, b: 80 }, { r: 204, g: 208, b: 216 }, dayFactor), 0.95);
      ctx.fill();

      // Interior food-stall recess (unlit dark stone by day, subtle warm jamb bounce when lampsLit)
      ctx.beginPath();
      ctx.moveTo(d.x, d.y + d.h);
      ctx.lineTo(d.x, dArchY);
      ctx.arc(dcx, dArchY, dArchR, Math.PI, 0, false);
      ctx.lineTo(d.x + d.w, d.y + d.h);
      ctx.closePath();

      if (lampsLit) {
        var stallGlow = hexToRgb(lampColors[di % lampColors.length]);
        ctx.fillStyle = rgbaStr(mixRgb({ r: 58, g: 38, b: 28 }, stallGlow, 0.45), 0.92);
      } else {
        ctx.fillStyle = rgbaStr({ r: 22, g: 26, b: 34 }, 0.94);
      }
      ctx.fill();
      ctx.strokeStyle = rgbaStr({ r: 18, g: 22, b: 30 }, 0.88);
      ctx.lineWidth = 0.85;
      ctx.stroke();

      // Stone serving counter & wrought-iron lamp bracket above lintel
      var counterH = Math.max(3, d.h * 0.20);
      ctx.fillStyle = rgbaStr(mixRgb({ r: 44, g: 48, b: 60 }, { r: 138, g: 144, b: 154 }, dayFactor), 0.9);
      ctx.fillRect(d.x + d.w * 0.1, d.y + d.h - counterH, d.w * 0.8, counterH);

      var hookDir = d.side === 'left' ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(dcx, d.y - 2);
      ctx.lineTo(dcx + hookDir * d.w * 0.36, d.y - 3);
      ctx.lineTo(dcx + hookDir * d.w * 0.36, d.y + 2);
      ctx.strokeStyle = 'rgba(28, 32, 40, 0.88)';
      ctx.lineWidth = 0.95;
      ctx.stroke();
    }

    // 4. Perspective Street Paved with Heavy Matte Plumbum / Lead Flagstones
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(sp[0].x, sp[0].y);
    ctx.lineTo(sp[1].x, sp[1].y);
    ctx.lineTo(sp[2].x, sp[2].y);
    ctx.lineTo(sp[3].x, sp[3].y);
    ctx.closePath();

    var leadTop = mixRgb({ r: 28, g: 33, b: 44 }, { r: 112, g: 121, b: 133 }, dayFactor);
    var leadMid = mixRgb({ r: 20, g: 24, b: 34 }, { r: 86, g: 95, b: 108 }, dayFactor);
    var leadBot = mixRgb({ r: 14, g: 17, b: 25 }, { r: 64, g: 72, b: 84 }, dayFactor);

    var streetGrad = ctx.createLinearGradient(0, streetTopY, 0, H);
    streetGrad.addColorStop(0, rgbaStr(leadTop, 1));
    streetGrad.addColorStop(0.52, rgbaStr(leadMid, 1));
    streetGrad.addColorStop(1, rgbaStr(leadBot, 1));
    ctx.fillStyle = streetGrad;
    ctx.fill();
    ctx.clip();

    // Longitudinal perspective plumbum seams converging toward vanishingPoint
    var lanes = 8;
    ctx.strokeStyle = rgbaStr(mixRgb({ r: 10, g: 12, b: 18 }, { r: 42, g: 48, b: 58 }, dayFactor), 0.72);
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    for (var li = 1; li < lanes; li++) {
      var lf = li / lanes;
      ctx.moveTo(lerp(sp[0].x, sp[1].x, lf), streetTopY);
      ctx.lineTo(lerp(sp[3].x, sp[2].x, lf), H);
    }
    ctx.stroke();

    // Transverse foreshortened courses + staggered ashlar lead joints + metallic bevel lips
    var courses = 16;
    var prevY = streetTopY;
    for (var ci = 1; ci <= courses; ci++) {
      var cu = Math.pow(ci / courses, 1.68);
      var rowY = lerp(streetTopY, H, cu);
      var lx = lerp(sp[0].x, sp[3].x, cu);
      var rx = lerp(sp[1].x, sp[2].x, cu);

      // Dark plumbum joint
      ctx.beginPath();
      ctx.moveTo(lx, rowY);
      ctx.lineTo(rx, rowY);
      ctx.strokeStyle = rgbaStr({ r: 16, g: 20, b: 28 }, 0.78);
      ctx.lineWidth = 0.65 + cu * 0.85;
      ctx.stroke();

      // Metallic lead bevel highlight right below joint
      ctx.beginPath();
      ctx.moveTo(lx, rowY + 1.1);
      ctx.lineTo(rx, rowY + 1.1);
      if (lampsLit) {
        var bevRgb = hexToRgb(lampColors[ci % lampColors.length]);
        ctx.strokeStyle = rgbaStr(mixRgb({ r: 120, g: 132, b: 152 }, bevRgb, 0.48), 0.34);
      } else {
        ctx.strokeStyle = rgbaStr({ r: 176, g: 188, b: 202 }, 0.28 * dayFactor + 0.06);
      }
      ctx.lineWidth = 0.75;
      ctx.stroke();

      // Staggered slab cross-joints & foreground lead solder rivets
      var subCount = 6;
      var stagger = (ci % 2) * 0.5;
      var prevCu = Math.pow((ci - 1) / courses, 1.68);
      var prevLx = lerp(sp[0].x, sp[3].x, prevCu);
      var prevRx = lerp(sp[1].x, sp[2].x, prevCu);

      ctx.strokeStyle = rgbaStr({ r: 22, g: 26, b: 34 }, 0.56);
      ctx.lineWidth = 0.75;
      for (var sj = 1; sj < subCount; sj++) {
        var sf = (sj + stagger * 0.6) / subCount;
        if (sf > 0.05 && sf < 0.95) {
          ctx.beginPath();
          ctx.moveTo(lerp(prevLx, prevRx, sf), prevY);
          ctx.lineTo(lerp(lx, rx, sf), rowY);
          ctx.stroke();

          if (ci >= 11 && dayFactor > 0.1) {
            ctx.fillStyle = rgbaStr({ r: 156, g: 168, b: 182 }, 0.42 * dayFactor);
            ctx.fillRect(lerp(lx, rx, sf) - 3.5, rowY - 3, 2, 2);
            ctx.fillRect(lerp(lx, rx, sf) + 1.5, rowY - 3, 2, 2);
          }
        }
      }

      prevY = rowY;
    }

    // Burin cross-hatching in gutter shadows along both arcades
    var gutterLeftGrad = ctx.createLinearGradient(sp[3].x, H, sp[3].x + W * 0.10, H);
    gutterLeftGrad.addColorStop(0, 'rgba(12, 15, 22, 0.46)');
    gutterLeftGrad.addColorStop(1, 'rgba(12, 15, 22, 0)');
    ctx.fillStyle = gutterLeftGrad;
    ctx.fillRect(sp[3].x, streetTopY, W * 0.14, H - streetTopY);

    var gutterRightGrad = ctx.createLinearGradient(sp[2].x, H, sp[2].x - W * 0.10, H);
    gutterRightGrad.addColorStop(0, 'rgba(12, 15, 22, 0.46)');
    gutterRightGrad.addColorStop(1, 'rgba(12, 15, 22, 0)');
    ctx.fillStyle = gutterRightGrad;
    ctx.fillRect(sp[2].x - W * 0.14, streetTopY, W * 0.14, H - streetTopY);

    drawBurinHatch(ctx, sp[3].x, streetTopY, (sp[2].x - sp[3].x), H - streetTopY, 8.5, 0.24, 'rgba(15, 18, 25, 0.16)', 0.6);

    ctx.restore();

    // Raised stone curbstones framing the lead street
    ctx.beginPath();
    ctx.moveTo(sp[0].x, sp[0].y);
    ctx.lineTo(sp[3].x, sp[3].y);
    ctx.moveTo(sp[1].x, sp[1].y);
    ctx.lineTo(sp[2].x, sp[2].y);
    ctx.strokeStyle = highlightStreet
      ? 'rgba(208, 224, 242, 0.95)'
      : rgbaStr(mixRgb({ r: 64, g: 72, b: 90 }, { r: 196, g: 204, b: 214 }, dayFactor), 0.92);
    ctx.lineWidth = highlightStreet ? 2.4 : 1.8;
    ctx.stroke();
  }

  function strokeGhostPlate(ctx, layout, dx, dy, strokeColor, fillTint, parallaxScale) {
    ctx.save();
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = fillTint;

    // 1. Ghost echoes of all 60 silver domes (with subtle ridge-tier parallax)
    var domes = layout.domes;
    for (var i = 0; i < domes.length; i++) {
      var d = domes[i];
      var tierFactor = 0.58 + d.tier * 0.18;
      var ox = dx * tierFactor * parallaxScale;
      var oy = dy * tierFactor * parallaxScale;
      var gx = d.x + ox;
      var gy = d.y + oy;

      ctx.lineWidth = 0.85;
      ctx.beginPath();
      ctx.moveTo(gx - d.rx, gy);
      ctx.bezierCurveTo(gx - d.rx * 1.02, gy - d.ry * 0.66, gx - d.rx * 0.4, gy - d.ry, gx, gy - d.ry);
      ctx.bezierCurveTo(gx + d.rx * 0.4, gy - d.ry, gx + d.rx * 1.02, gy - d.ry * 0.66, gx + d.rx, gy);
      ctx.stroke();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(gx, gy - d.ry);
      ctx.lineTo(gx, gy - d.ry - d.lanternH);
      ctx.stroke();
    }

    // 2. Ghost echo of the Faceted Crystal Theater
    var ct = layout.crystalTheater;
    var tcx = ct.x + ct.w * 0.5 + dx * 0.95;
    var tTop = ct.y + dy * 0.95;
    var tBase = ct.y + ct.h + dy * 0.95;
    var nhw = ct.w * 0.31;
    var vsy = tTop + ct.h * 0.26;

    ctx.lineWidth = 1.05;
    ctx.beginPath();
    ctx.moveTo(tcx - nhw, tBase - 7);
    ctx.lineTo(tcx - nhw, vsy);
    ctx.bezierCurveTo(tcx - nhw, tTop + 2, tcx - nhw * 0.42, tTop, tcx, tTop);
    ctx.bezierCurveTo(tcx + nhw * 0.42, tTop, tcx + nhw, tTop + 2, tcx + nhw, vsy);
    ctx.lineTo(tcx + nhw, tBase - 7);
    ctx.stroke();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(tcx, vsy + ct.h * 0.10, Math.min(nhw * 0.36, ct.h * 0.14), 0, Math.PI * 2);
    ctx.stroke();

    // 3. Ghost echoes of the 8 Bronze Gods in their Pantheon Niches
    var niches = layout.bronzeNiches;
    ctx.lineWidth = 0.9;
    for (var n = 0; n < niches.length; n++) {
      var ni = niches[n];
      var ncx = ni.x + ni.w * 0.5 + dx * 1.08;
      var ncy = ni.y + ni.h * 0.54 + dy * 1.08;
      var archR = ni.w * 0.44;
      var archY = ni.y + archR + 2 + dy * 1.08;

      ctx.beginPath();
      ctx.arc(ncx, archY, archR, Math.PI, 0, false);
      ctx.stroke();

      var fs = Math.max(14, ni.h * 0.62) / 28;
      ctx.save();
      ctx.translate(ncx, ncy);
      ctx.scale(fs, fs);
      ctx.beginPath();
      ctx.arc(0, -10.5, 2.7, 0, Math.PI * 2);
      ctx.moveTo(-4, -7);
      ctx.lineTo(4, -7);
      ctx.lineTo(4.2, 13);
      ctx.lineTo(-4.2, 13);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  function pointInQuad(px, py, quad) {
    var topY = quad[0].y;
    var botY = quad[2].y;
    if (py < topY || py > botY) return false;
    var u = (py - topY) / Math.max(1, botY - topY);
    var lx = lerp(quad[0].x, quad[3].x, u);
    var rx = lerp(quad[1].x, quad[2].x, u);
    return px >= lx && px <= rx;
  }

  function createNoiseBuffer(audioCtx, durationSec) {
    var sr = audioCtx.sampleRate || 44100;
    var len = Math.max(1, Math.floor(sr * durationSec));
    var buf = audioCtx.createBuffer(1, len, sr);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      data[i] = ((detWave(i * 1.37) * 2) - 1) * Math.exp(-i / (sr * 0.045));
    }
    return buf;
  }

  function synthesizeAudio(audioCtx, kind, opts) {
    if (!audioCtx || typeof audioCtx.createOscillator !== 'function' || typeof audioCtx.createGain !== 'function') {
      return false;
    }
    var options = opts || {};
    if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
      try {
        var p = audioCtx.resume();
        if (p && typeof p.catch === 'function') p.catch(function () {});
      } catch (e) {}
    }

    var dest = options.destination || audioCtx.destination;
    var now = audioCtx.currentTime || 0;
    var masterVol = clamp(typeof options.volume === 'number' ? options.volume : 0.22, 0.01, 0.85);

    var master = audioCtx.createGain();
    master.gain.setValueAtTime(masterVol, now);
    master.connect(dest);

    if (kind === 'cock_crow') {
      // Clarion brass/reed 4-note morning crow motif + campanile bell shimmer
      var notes = [
        { t: 0.00, dur: 0.11, f0: 587.33, f1: 622.25 },
        { t: 0.12, dur: 0.11, f0: 739.99, f1: 783.99 },
        { t: 0.24, dur: 0.13, f0: 880.00, f1: 932.33 },
        { t: 0.39, dur: 0.62, f0: 1174.66, f1: 987.77 }
      ];

      var brassFilter = typeof audioCtx.createBiquadFilter === 'function' ? audioCtx.createBiquadFilter() : null;
      if (brassFilter) {
        brassFilter.type = 'bandpass';
        brassFilter.frequency.setValueAtTime(1760, now);
        brassFilter.Q.setValueAtTime(2.6, now);
        brassFilter.connect(master);
      }
      var reedTarget = brassFilter || master;

      for (var ni = 0; ni < notes.length; ni++) {
        var nt = notes[ni];
        var osc = audioCtx.createOscillator();
        var env = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(nt.f0, now + nt.t);
        osc.frequency.exponentialRampToValueAtTime(nt.f1, now + nt.t + nt.dur);

        env.gain.setValueAtTime(0.0001, now + nt.t);
        env.gain.exponentialRampToValueAtTime(ni === 3 ? 0.55 : 0.38, now + nt.t + 0.022);
        env.gain.exponentialRampToValueAtTime(0.0001, now + nt.t + nt.dur);

        osc.connect(env);
        env.connect(reedTarget);
        osc.start(now + nt.t);
        osc.stop(now + nt.t + nt.dur + 0.02);
      }

      // Gilded morning bell shimmer
      var bellPartials = [880.0, 1318.5, 2093.0];
      for (var bp = 0; bp < bellPartials.length; bp++) {
        var bOsc = audioCtx.createOscillator();
        var bEnv = audioCtx.createGain();
        bOsc.type = 'sine';
        bOsc.frequency.setValueAtTime(bellPartials[bp], now + 0.38);
        bEnv.gain.setValueAtTime(0.0001, now + 0.38);
        bEnv.gain.exponentialRampToValueAtTime(0.18 / (bp + 1), now + 0.41);
        bEnv.gain.exponentialRampToValueAtTime(0.0001, now + 1.55);
        bOsc.connect(bEnv);
        bEnv.connect(master);
        bOsc.start(now + 0.38);
        bOsc.stop(now + 1.58);
      }
      return true;
    }

    if (kind === 'crystal_chime') {
      // Crystalline glass-harmonica & prism eigenmodes
      var roots = [739.99, 1108.73, 1661.22];
      for (var ci = 0; ci < roots.length; ci++) {
        var startT = now + ci * 0.045;
        var cOsc = audioCtx.createOscillator();
        var cOver = audioCtx.createOscillator();
        var cEnv = audioCtx.createGain();
        cOsc.type = 'sine';
        cOver.type = 'sine';
        cOsc.frequency.setValueAtTime(roots[ci], startT);
        cOver.frequency.setValueAtTime(roots[ci] * 2.756, startT);

        cEnv.gain.setValueAtTime(0.0001, startT);
        cEnv.gain.exponentialRampToValueAtTime(0.28 / (ci * 0.5 + 1), startT + 0.018);
        cEnv.gain.exponentialRampToValueAtTime(0.0001, startT + 1.45);

        var overGain = audioCtx.createGain();
        overGain.gain.setValueAtTime(0.26, startT);

        cOsc.connect(cEnv);
        cOver.connect(overGain);
        overGain.connect(cEnv);
        cEnv.connect(master);

        cOsc.start(startT);
        cOver.start(startT);
        cOsc.stop(startT + 1.48);
        cOver.stop(startT + 1.48);
      }
      return true;
    }

    if (kind === 'bronze_bell') {
      // Cast-bronze pantheon struck resonance
      var dorianSemitones = [0, 2, 3, 5, 7, 9, 10, 12];
      var nicheIdx = clamp(Math.floor(Number(options.nicheIndex) || 0), 0, 7);
      var baseFreq = 196.0 * Math.pow(2, dorianSemitones[nicheIdx] / 12);
      var ratios = [0.5, 1.0, 1.183, 1.506, 2.0, 2.514];
      var weights = [0.22, 0.48, 0.34, 0.24, 0.20, 0.11];

      for (var bi = 0; bi < ratios.length; bi++) {
        var pOsc = audioCtx.createOscillator();
        var pEnv = audioCtx.createGain();
        pOsc.type = bi === 1 ? 'triangle' : 'sine';
        pOsc.frequency.setValueAtTime(baseFreq * ratios[bi], now);

        var decay = 1.85 / (1 + bi * 0.32);
        pEnv.gain.setValueAtTime(0.0001, now);
        pEnv.gain.exponentialRampToValueAtTime(weights[bi], now + 0.008);
        pEnv.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        pOsc.connect(pEnv);
        pEnv.connect(master);
        pOsc.start(now);
        pOsc.stop(now + decay + 0.03);
      }
      return true;
    }

    if (kind === 'lead_step') {
      // Heavy matte plumbum flagstone footfall (deadened low thud + short muted transient)
      var thud = audioCtx.createOscillator();
      var plate = audioCtx.createOscillator();
      var tEnv = audioCtx.createGain();
      thud.type = 'triangle';
      plate.type = 'sine';
      thud.frequency.setValueAtTime(98, now);
      thud.frequency.exponentialRampToValueAtTime(52, now + 0.14);
      plate.frequency.setValueAtTime(144, now);
      plate.frequency.exponentialRampToValueAtTime(118, now + 0.11);

      tEnv.gain.setValueAtTime(0.0001, now);
      tEnv.gain.exponentialRampToValueAtTime(0.62, now + 0.006);
      tEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.17);

      thud.connect(tEnv);
      plate.connect(tEnv);
      tEnv.connect(master);
      thud.start(now);
      plate.start(now);
      thud.stop(now + 0.19);
      plate.stop(now + 0.19);

      if (typeof audioCtx.createBuffer === 'function' && typeof audioCtx.createBufferSource === 'function') {
        var nSrc = audioCtx.createBufferSource();
        nSrc.buffer = createNoiseBuffer(audioCtx, 0.09);
        var nGain = audioCtx.createGain();
        nGain.gain.setValueAtTime(0.28, now);
        nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        if (typeof audioCtx.createBiquadFilter === 'function') {
          var lp = audioCtx.createBiquadFilter();
          lp.type = 'lowpass';
          lp.frequency.setValueAtTime(620, now);
          nSrc.connect(lp);
          lp.connect(nGain);
        } else {
          nSrc.connect(nGain);
        }
        nGain.connect(master);
        nSrc.start(now);
        nSrc.stop(now + 0.09);
      }
      return true;
    }

    if (kind === 'silver_dome') {
      // Cold burnished silver cupola ping mapped across cupola #1..#60
      var silverScale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
      var cupIdx = clamp(Math.floor(Number(options.cupolaIndex) || 1) - 1, 0, 59);
      var semi = silverScale[cupIdx % silverScale.length] + Math.floor(cupIdx / 20) * 2;
      var sFreq = 783.99 * Math.pow(2, semi / 12);

      var sPartials = [1.0, 2.003, 3.012];
      var sGains = [0.42, 0.22, 0.11];
      for (var si = 0; si < sPartials.length; si++) {
        var sOsc = audioCtx.createOscillator();
        var sEnv = audioCtx.createGain();
        sOsc.type = 'sine';
        sOsc.frequency.setValueAtTime(sFreq * sPartials[si], now);
        var sDur = 1.05 / (1 + si * 0.4);
        sEnv.gain.setValueAtTime(0.0001, now);
        sEnv.gain.exponentialRampToValueAtTime(sGains[si], now + 0.006);
        sEnv.gain.exponentialRampToValueAtTime(0.0001, now + sDur);
        sOsc.connect(sEnv);
        sEnv.connect(master);
        sOsc.start(now);
        sOsc.stop(now + sDur + 0.02);
      }
      return true;
    }

    return false;
  }

  function create() {
    var cachedKey = '';
    var cachedLayout = null;

    function resolveLayout(width, height) {
      var w = Math.max(1, Math.round(Number(width) || 1280));
      var h = Math.max(1, Math.round(Number(height) || 800));
      var key = w + 'x' + h;
      if (key !== cachedKey || !cachedLayout) {
        cachedLayout = buildLayout(w, h);
        cachedKey = key;
      }
      return cachedLayout;
    }

    function getLayout(width, height) {
      return buildLayout(width, height);
    }

    function render(ctx, params) {
      if (!ctx) return;
      var p = params || {};
      var width = Number(p.width) || (ctx.canvas ? ctx.canvas.width : 1280);
      var height = Number(p.height) || (ctx.canvas ? ctx.canvas.height : 800);
      var layout = resolveLayout(width, height);

      var solarAltitude = typeof p.solarAltitude === 'number' ? p.solarAltitude : 0.72;
      var dayFactor = clamp((solarAltitude + 0.12) / 0.82, 0, 1);
      var lampsLit = Boolean(p.lampsLit);
      var lampColors = Array.isArray(p.lampColors) && p.lampColors.length > 0 ? p.lampColors : DEFAULT_LAMP_COLORS;

      var activeHover = p.hoveredStoneId || null;
      var activeSelect = p.selectedStoneId || null;
      var hlDomes = activeHover === 'silver_domes_60' || activeSelect === 'silver_domes_60';
      var hlBronze = activeHover === 'bronze_statues_gods' || activeSelect === 'bronze_statues_gods';
      var hlStreet = activeHover === 'lead_paved_streets' || activeSelect === 'lead_paved_streets';
      var hlTheater = activeHover === 'crystal_theater' || activeSelect === 'crystal_theater';
      var hlCock = activeHover === 'golden_cock_tower' || activeSelect === 'golden_cock_tower';

      ctx.save();

      // 1. Terraced skyline ridges
      drawHillTerraces(ctx, layout, dayFactor, lampsLit);

      // 2. All 60 silver domes (back-to-front across tiers 0..3)
      for (var di = 0; di < layout.domes.length; di++) {
        drawSingleSilverDome(
          ctx,
          layout.domes[di],
          dayFactor,
          solarAltitude,
          lampsLit,
          lampColors,
          hlDomes
        );
      }

      // 3. Tall campanile & articulated golden cock
      drawTowerAndGoldenCock(ctx, layout, p, dayFactor, hlCock);

      // 4. Faceted crystal theater at the perspective heart
      drawCrystalTheater(ctx, layout, dayFactor, lampsLit, lampColors, hlTheater);

      // 5. Pantheon colonnade & 8 cast-bronze god statues
      drawPantheonAndBronzeGods(ctx, layout, dayFactor, lampsLit, lampColors, hlBronze);

      // 6. Lead-paved perspective street, food-stall stone arcades & elevated terrace loggia
      drawLeadPavedStreetAndArcades(ctx, layout, dayFactor, lampsLit, lampColors, hlStreet);

      ctx.restore();
    }

    function renderMonumentGhosts(ctx, params) {
      if (!ctx || !params) return;
      var envy = clamp(Number(params.envyIntensity) || 0, 0, 1);
      if (envy <= 0.001) return;

      var width = Number(params.width) || (ctx.canvas ? ctx.canvas.width : 1280);
      var height = Number(params.height) || (ctx.canvas ? ctx.canvas.height : 800);
      var layout = resolveLayout(width, height);
      var t = Number(params.timeSec) || 0;
      var scaleShift = clamp(width / 1280, 0.55, 1.35);

      var dxGold;
      var dyGold;
      var dxViolet;
      var dyViolet;

      if (params.reducedMotion) {
        dxGold = -7.0 * scaleShift;
        dyGold = -4.2 * scaleShift;
        dxViolet = 6.5 * scaleShift;
        dyViolet = 3.8 * scaleShift;
      } else {
        dxGold = (-6.8 + Math.sin(t * 0.82) * 3.1) * scaleShift;
        dyGold = (-4.0 + Math.cos(t * 0.61) * 1.9) * scaleShift;
        dxViolet = (6.4 + Math.cos(t * 0.74) * 2.9) * scaleShift;
        dyViolet = (3.6 + Math.sin(t * 0.55) * 1.8) * scaleShift;
      }

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Sepia-gold plate ("an evening identical to this" — envied past happiness)
      var goldAlpha = clamp(envy * 0.44, 0, 0.52);
      strokeGhostPlate(
        ctx,
        layout,
        dxGold,
        dyGold,
        'rgba(242, 198, 114,' + goldAlpha.toFixed(3) + ')',
        'rgba(242, 198, 114,' + (goldAlpha * 0.16).toFixed(3) + ')',
        1.0
      );

      // Violet-amethyst plate (estranged twilight double exposure)
      var violetAlpha = clamp(envy * 0.40, 0, 0.48);
      strokeGhostPlate(
        ctx,
        layout,
        dxViolet,
        dyViolet,
        'rgba(174, 132, 238,' + violetAlpha.toFixed(3) + ')',
        'rgba(174, 132, 238,' + (violetAlpha * 0.15).toFixed(3) + ')',
        1.0
      );

      ctx.restore();
    }

    function hitTest(x, y, width, height) {
      if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) {
        return null;
      }
      var layout = resolveLayout(width, height);

      // 1. Golden Cock & Campanile Tower
      var tc = layout.towerCock;
      var cockRadius = Math.max(20, tc.towerWidth * 0.65);
      var dxCock = x - tc.x;
      var dyCock = y - tc.y;
      if (
        dxCock * dxCock + dyCock * dyCock <= cockRadius * cockRadius ||
        (Math.abs(x - tc.x) <= tc.towerWidth * 0.56 && y >= tc.y && y <= tc.towerBaseY)
      ) {
        return {
          stoneId: 'golden_cock_tower',
          label: 'Golden Cock on the Campanile',
          cupolaIndex: null,
          detail: 'Articulated gilded weathercock crowning the tall tower—crowing brazenly each morning, already known from other cities.'
        };
      }

      // 2. Bronze Statues of All the Gods (8 Pantheon Niches)
      for (var ni = 0; ni < layout.bronzeNiches.length; ni++) {
        var n = layout.bronzeNiches[ni];
        if (x >= n.x - 2 && x <= n.x + n.w + 2 && y >= n.y - 3 && y <= n.y + n.h + 3) {
          return {
            stoneId: 'bronze_statues_gods',
            label: 'Bronze Statue — ' + n.godTitle,
            cupolaIndex: null,
            detail: 'Pantheon Niche #' + (n.index + 1) + ' (' + n.attribute + '): cast-bronze deity in verdigris patina, familiar to seasoned travelers.'
          };
        }
      }

      // 3. Faceted Crystal Theater
      var ct = layout.crystalTheater;
      var tcx = ct.x + ct.w * 0.5;
      var inNave = Math.abs(x - tcx) <= ct.w * 0.31 && y >= ct.y - 10 && y <= ct.y + ct.h;
      var inWings = Math.abs(x - tcx) <= ct.w * 0.5 && y >= ct.y + ct.h * 0.30 && y <= ct.y + ct.h;
      if (inNave || inWings) {
        return {
          stoneId: 'crystal_theater',
          label: 'The Crystal Theater',
          cupolaIndex: null,
          detail: 'Faceted glass vault and crystalline proscenium at the plaza heart—refracting cool sky harmonics by day and splitting stall-lamp prisms at dusk.'
        };
      }

      // 4. Exact 60 Silver Domes (#1..#60, checked front-to-back)
      for (var di = layout.domes.length - 1; di >= 0; di--) {
        var d = layout.domes[di];
        var rxHit = d.rx + 2.5;
        var ryHit = d.ry + 2.5;
        var ex = (x - d.x) / rxHit;
        var ey = (y - d.y) / ryHit;
        var onCupola = y <= d.y + 2 && (ex * ex + ey * ey <= 1.05);
        var onDrum = Math.abs(x - d.x) <= d.rx * 0.94 && y >= d.y - 1 && y <= d.y + Math.max(5, d.ry * 0.42);
        var onLantern = Math.abs(x - d.x) <= Math.max(4, d.rx * 0.32) && y >= d.y - d.ry - d.lanternH - 3 && y <= d.y;
        if (onCupola || onDrum || onLantern) {
          var cupNum = d.index + 1;
          return {
            stoneId: 'silver_domes_60',
            label: 'Silver Cupola #' + cupNum + ' of 60',
            cupolaIndex: cupNum,
            detail: 'Skyline Ridge ' + (d.tier + 1) + ' · Burnished silver dome #' + cupNum + '/60—architecturally splendid, yet already seen in other cities.'
          };
        }
      }

      // 5. Perspective Streets Paved with Lead
      if (pointInQuad(x, y, layout.streetPolygon)) {
        return {
          stoneId: 'lead_paved_streets',
          label: 'Streets Paved with Lead',
          cupolaIndex: null,
          detail: 'Heavy plumbum-engraved flagstones converging toward the central plaza—matte by day, flashing simultaneous polychrome reflections in September.'
        };
      }

      return null;
    }

    function triggerDaylightAudio(audioCtx, kind, opts) {
      return synthesizeAudio(audioCtx, kind, opts);
    }

    return {
      STONE_CATALOG: STONE_CATALOG,
      getLayout: getLayout,
      render: render,
      renderMonumentGhosts: renderMonumentGhosts,
      hitTest: hitTest,
      triggerDaylightAudio: triggerDaylightAudio
    };
  }

  root.DiomiraDaylightMonuments = {
    STONE_CATALOG: STONE_CATALOG,
    create: create
  };
})(typeof window !== 'undefined' ? window : globalThis);
