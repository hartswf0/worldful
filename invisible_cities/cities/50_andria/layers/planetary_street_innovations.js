/*
 * Andria — Planetary Street Orbits, Star-Regulated Civic Rites & Prudent Municipal Innovations
 * Standalone browser IIFE exposing globalThis.AndriaPlanetaryStreets
 */
(function (global) {
  'use strict';

  var PALETTE = {
    travertine_stone: '#efe5cf',
    parchment_ochre: '#dfd0b0',
    terracotta_tile: '#b55a38',
    bamboo_jade: '#4a7a5c',
    brass_astrolabe: '#c89b43',
    burnished_bronze: '#7a5821',
    lapis_vault: '#0b1326',
    indigo_meridian: '#17284a',
    nova_gold: '#ffd97d',
    nebula_cyan: '#72d1c6',
    ink_iron: '#1c1813'
  };

  var ORBITS = [
    {
      id: 'mercury_ring',
      name: 'Mercury Ring',
      semiMajor: 0.21,
      semiMinor: 0.172,
      tiltDeg: -14,
      eccentricity: 0.18,
      siderealVel: 1.68,
      roadWidth: 5.5,
      guild: 'Assayers & Ephemeris Scribes',
      civicRite: 'Quicksilver Assay & Weight Sealing',
      riteSector: 2,
      processions: 5
    },
    {
      id: 'venus_arcade',
      name: 'Venus Arcade',
      semiMajor: 0.325,
      semiMinor: 0.268,
      tiltDeg: 9,
      eccentricity: 0.10,
      siderealVel: 1.24,
      roadWidth: 6.2,
      guild: 'Silk Weavers & Lantern-Smiths',
      civicRite: 'Canopy Silk Exchange & Lantern Vigil',
      riteSector: 2,
      processions: 7
    },
    {
      id: 'lunar_corso',
      name: 'Lunar Corso',
      semiMajor: 0.44,
      semiMinor: 0.365,
      tiltDeg: -6,
      eccentricity: 0.12,
      siderealVel: 2.05,
      roadWidth: 6.0,
      guild: 'Cistern Keepers & Night Watch',
      civicRite: 'Tide-Cistern Opening & Silver Measure',
      riteSector: 1,
      processions: 8
    },
    {
      id: 'solar_ecliptic_via',
      name: 'Solar Ecliptic Via',
      semiMajor: 0.555,
      semiMinor: 0.462,
      tiltDeg: 4,
      eccentricity: 0.06,
      siderealVel: 0.88,
      roadWidth: 7.4,
      guild: 'Council Notaries & Grain Measurers',
      civicRite: 'Meridian Grain Weigh-House Convocation',
      riteSector: 4,
      processions: 10
    },
    {
      id: 'mars_rampart',
      name: 'Mars Rampart',
      semiMajor: 0.675,
      semiMinor: 0.562,
      tiltDeg: -11,
      eccentricity: 0.14,
      siderealVel: 0.64,
      roadWidth: 6.8,
      guild: 'Bronze Founders & Silhouette Troupes',
      civicRite: 'Terracotta Kiln Firing & Court Spectacle',
      riteSector: 3,
      processions: 9
    },
    {
      id: 'jupiter_quay',
      name: 'Jupiter Quay',
      semiMajor: 0.795,
      semiMinor: 0.662,
      tiltDeg: 7,
      eccentricity: 0.09,
      siderealVel: 0.44,
      roadWidth: 7.2,
      guild: 'Mariners & Astrolabe Pilots',
      civicRite: 'Harbor Manifest Audit & Oil Unloading',
      riteSector: 0,
      processions: 11
    },
    {
      id: 'saturn_outer_terrace',
      name: 'Saturn Outer Terrace',
      semiMajor: 0.915,
      semiMinor: 0.765,
      tiltDeg: -8,
      eccentricity: 0.11,
      siderealVel: 0.28,
      roadWidth: 6.6,
      guild: 'Stonecutters, Gymnasts & Orcharders',
      civicRite: 'Outer Balustrade Games & Orchard Harvest',
      riteSector: 5,
      processions: 11
    }
  ];

  var SIDEREAL_RITES = [
    { id: 'alpheratz_ascendant', startDeg: 0, endDeg: 60, title: 'Ascendant of Alpheratz — Harbor Manifests & Astrolabe Calibration', market: 'Jupiter Quay Weigh-House', trade: 'Mariners & Instrument Makers', harvest: 'Early Pressed Olive Oil & Sea Salt', orbitId: 'jupiter_quay' },
    { id: 'capella_culmination', startDeg: 60, endDeg: 120, title: 'Culmination of Capella — Palaestra Games & Timber Joinery Fair', market: 'Capella Outer Agora', trade: 'Joiners, Gymnasts & Wheelwrights', harvest: 'Highland Chestnut & Golden Barley', orbitId: 'lunar_corso' },
    { id: 'cepheids_pulse', startDeg: 120, endDeg: 180, title: 'Pulse of the Cepheids — Bamboo Lantern Market & Silk Looming', market: 'Mercury-Venus Inner Loggia', trade: 'Silk Weavers & Brass-Lantern Smiths', harvest: 'Tender Bamboo Culms & Mulberry', orbitId: 'venus_arcade' },
    { id: 'antares_transit', startDeg: 180, endDeg: 240, title: 'Transit of Antares — Terracotta Kiln Firing & Nocturnal Spectacle', market: 'Antares Crimson Arcade', trade: 'Bronze Founders & Linen Puppeteers', harvest: 'Cask Pomegranate & Vineyard Must', orbitId: 'mars_rampart' },
    { id: 'ecliptic_quadrature', startDeg: 240, endDeg: 300, title: 'Meridian Quadrature — Granary Seal & Prudence Council Audit', market: 'Solar Ecliptic Rotunda', trade: 'Civic Notaries & Balance Assayers', harvest: 'Stored Einkorn & Dried Fig Loaves', orbitId: 'solar_ecliptic_via' },
    { id: 'saturn_ring_watch', startDeg: 300, endDeg: 360, title: 'Ring of Saturn — Outer Terrace Procession & Observatory Watch', market: 'Saturn Terrace Balustrade', trade: 'Astronomers & Travertine Masons', harvest: 'Late Orchard Pressing & Cedar Resin', orbitId: 'saturn_outer_terrace' }
  ];

  var LUMINOUS_STARS = [
    { name: 'Antares', orbitId: 'mars_rampart', angleDeg: 170, coupledId: 'shadow_theater_kennels', color: '#e05a3f', communityBuilding: 'Antares Crimson Court & Foundry Hall', raDeg: 247.35, decDeg: -26.43 },
    { name: 'Alpheratz', orbitId: 'jupiter_quay', angleDeg: -34, coupledId: 'statue_of_thales', color: '#9ed2ff', communityBuilding: 'Alpheratz Harbourmaster Rotunda', raDeg: 2.09, decDeg: 29.09 },
    { name: 'Capella', orbitId: 'saturn_outer_terrace', angleDeg: 84, coupledId: 'gymnastics_toboggan_slide', color: '#ffd97d', communityBuilding: 'Capella Palaestra & Twin Braziers', raDeg: 79.17, decDeg: 45.99 },
    { name: 'Cepheids', orbitId: 'venus_arcade', angleDeg: -98, coupledId: 'bamboo_suspended_street', color: '#ffe8a3', communityBuilding: 'Cepheid Variable Lantern Terrace', raDeg: 337.29, decDeg: 58.41 }
  ];

  var INNOVATIONS = [
    {
      id: 'bamboo_suspended_street',
      title: 'Suspended Street over the Bamboo Grove',
      earthlyInnovation: 'Suspended street built over a bamboo grove',
      orbitId: 'venus_arcade',
      innerOrbitId: 'mercury_ring',
      orbitDistrict: 'Mercury-Venus Inner Crossing',
      star: 'Cepheids',
      celestialId: 'star_cluster_nova',
      celestialNovelty: 'Nova explosion ignited in a star cluster',
      beforeLabel: 'Swaying jade bamboo culms filling the sunken inner grove',
      afterLabel: 'Arched timber-and-brass suspended viaduct spanning the bamboo canopy with lanterns',
      angleDeg: -134
    },
    {
      id: 'shadow_theater_kennels',
      title: 'Shadow-Theater Replacing Municipal Kennels',
      earthlyInnovation: 'Shadow-theater opened in place of the municipal kennels',
      orbitId: 'mars_rampart',
      orbitDistrict: 'Mars Arc (Antares Court)',
      star: 'Antares',
      celestialId: 'nebula_condensed_planet',
      celestialNovelty: 'Gaseous nebula condensing into a nascent planet',
      beforeLabel: 'Stone municipal hound kennels with iron-grated stalls',
      afterLabel: 'Illuminated oiled-linen shadow-theater proscenium with articulated silhouette puppets',
      angleDeg: 142
    },
    {
      id: 'statue_of_thales',
      title: 'Statue of Thales Raised at the Port',
      earthlyInnovation: 'Statue of Thales raised at the port',
      orbitId: 'jupiter_quay',
      orbitDistrict: 'Jupiter Harbor Quay (Alpheratz Mole)',
      star: 'Alpheratz',
      celestialId: 'saturn_ring_perturbation',
      celestialNovelty: "Orbital perturbation in Saturn's rings and outer star",
      beforeLabel: 'Bare dressed-limestone harbor mole jutting into the basin',
      afterLabel: 'Burnished bronze Statue of Thales holding compass & gnomon over rippling harbor water',
      angleDeg: -8
    },
    {
      id: 'gymnastics_toboggan_slide',
      title: 'Toboggan Slide Added to School of Gymnastics',
      earthlyInnovation: 'Toboggan slide added to the school of gymnastics',
      orbitId: 'saturn_outer_terrace',
      orbitDistrict: 'Saturn Outer Terrace (Capella Palaestra)',
      star: 'Capella',
      celestialId: 'milky_way_expansion',
      celestialNovelty: 'Curved expansion of the Milky Way',
      beforeLabel: 'Colonnaded gymnastics courtyard & sand palaestra',
      afterLabel: 'Helical polished timber-and-brass toboggan slide sweeping down from the palaestra roof',
      angleDeg: 54
    }
  ];

  var CONSTELLATION_CHORDS = [
    ['Cepheids', 'Alpheratz'],
    ['Alpheratz', 'Capella'],
    ['Capella', 'Antares'],
    ['Antares', 'Cepheids'],
    ['Cepheids', 'Capella'],
    ['Antares', 'Alpheratz']
  ];

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  function findOrbit(id) {
    for (var i = 0; i < ORBITS.length; i++) {
      if (ORBITS[i].id === id || ORBITS[i].name.toLowerCase() === String(id).toLowerCase()) return ORBITS[i];
    }
    return ORBITS[0];
  }

  function riteForDeg(deg) {
    var norm = ((deg % 360) + 360) % 360;
    var idx = Math.min(SIDEREAL_RITES.length - 1, Math.floor(norm / 60));
    var r = SIDEREAL_RITES[idx];
    return {
      id: r.id,
      index: idx,
      startDeg: r.startDeg,
      endDeg: r.endDeg,
      title: r.title,
      market: r.market,
      trade: r.trade,
      harvest: r.harvest,
      orbitId: r.orbitId,
      toString: function () { return r.title; }
    };
  }

  function computeGeom(w, h) {
    var cx = w * 0.49;
    var cy = h * 0.51;
    var rUnit = Math.min(w * 0.445, h * 0.445);
    return { w: w, h: h, cx: cx, cy: cy, r: Math.max(48, rUnit) };
  }

  function orbitPoint(orb, thetaRad, g) {
    var a = orb.semiMajor * g.r;
    var b = orb.semiMinor * g.r;
    var fx = a * orb.eccentricity * 0.28;
    var lx = Math.cos(thetaRad) * a - fx;
    var ly = Math.sin(thetaRad) * b;
    var tr = degToRad(orb.tiltDeg);
    var ct = Math.cos(tr);
    var st = Math.sin(tr);
    return {
      x: g.cx + lx * ct - ly * st,
      y: g.cy + lx * st + ly * ct
    };
  }

  function starPoint(star, g) {
    var orb = findOrbit(star.orbitId);
    return orbitPoint(orb, degToRad(star.angleDeg), g);
  }

  function innovationPoint(item, g) {
    var rad = degToRad(item.angleDeg);
    if (item.innerOrbitId) {
      var p1 = orbitPoint(findOrbit(item.innerOrbitId), rad, g);
      var p2 = orbitPoint(findOrbit(item.orbitId), rad, g);
      return { x: (p1.x + p2.x) * 0.5, y: (p1.y + p2.y) * 0.5 };
    }
    return orbitPoint(findOrbit(item.orbitId), rad, g);
  }

  function drawGroundAndBezel(ctx, g, siderealDeg, timeSec) {
    var bg = ctx.createRadialGradient(g.cx, g.cy, g.r * 0.08, g.cx, g.cy, Math.max(g.w, g.h) * 0.78);
    bg.addColorStop(0, '#f6eedb');
    bg.addColorStop(0.58, PALETTE.travertine_stone);
    bg.addColorStop(1, '#d2bf97');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, g.w, g.h);

    ctx.save();
    ctx.strokeStyle = 'rgba(122, 88, 33, 0.11)';
    ctx.lineWidth = 1;
    var step = Math.max(24, Math.round(g.r * 0.14));
    for (var gx = (g.cx % step); gx < g.w; gx += step) {
      ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, g.h); ctx.stroke();
    }
    for (var gy = (g.cy % step); gy < g.h; gy += step) {
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(g.w, gy); ctx.stroke();
    }

    var jupPt = orbitPoint(findOrbit('jupiter_quay'), degToRad(-8), g);
    ctx.beginPath();
    ctx.arc(jupPt.x + g.r * 0.34, jupPt.y, g.r * 0.42, degToRad(118), degToRad(242), false);
    ctx.lineTo(g.w, jupPt.y - g.r * 0.38);
    ctx.lineTo(g.w, jupPt.y + g.r * 0.38);
    ctx.closePath();
    var sea = ctx.createLinearGradient(jupPt.x - g.r * 0.08, jupPt.y, g.w, jupPt.y);
    sea.addColorStop(0, 'rgba(30, 62, 92, 0.88)');
    sea.addColorStop(1, 'rgba(15, 34, 58, 0.94)');
    ctx.fillStyle = sea;
    ctx.fill();
    ctx.strokeStyle = PALETTE.brass_astrolabe;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    for (var wr = 0; wr < 4; wr++) {
      var waveR = g.r * (0.12 + wr * 0.07) + ((timeSec * 6) % (g.r * 0.07));
      ctx.strokeStyle = 'rgba(114, 209, 198, ' + (0.28 - wr * 0.05).toFixed(2) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(jupPt.x + g.r * 0.14, jupPt.y, waveR, degToRad(-55), degToRad(55));
      ctx.stroke();
    }

    var bezelR = g.r * 0.985;
    ctx.strokeStyle = PALETTE.burnished_bronze;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(g.cx, g.cy, bezelR, bezelR * 0.855, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(200, 155, 67, 0.55)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(g.cx, g.cy, bezelR * 1.028, bezelR * 0.88, 0, 0, Math.PI * 2);
    ctx.stroke();

    for (var d = 0; d < 360; d += 10) {
      var ar = degToRad(d);
      var major = (d % 30 === 0);
      var r0 = bezelR * (major ? 0.962 : 0.982);
      var r1 = bezelR * 1.025;
      ctx.strokeStyle = major ? PALETTE.burnished_bronze : 'rgba(122, 88, 33, 0.42)';
      ctx.lineWidth = major ? 1.5 : 0.8;
      ctx.beginPath();
      ctx.moveTo(g.cx + Math.cos(ar) * r0, g.cy + Math.sin(ar) * r0 * 0.855);
      ctx.lineTo(g.cx + Math.cos(ar) * r1, g.cy + Math.sin(ar) * r1 * 0.855);
      ctx.stroke();
    }

    var sRad = degToRad(siderealDeg - 90);
    var px = g.cx + Math.cos(sRad) * bezelR * 1.01;
    var py = g.cy + Math.sin(sRad) * bezelR * 0.865;
    ctx.fillStyle = PALETTE.brass_astrolabe;
    ctx.strokeStyle = PALETTE.ink_iron;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(px, py, Math.max(4, g.r * 0.024), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = PALETTE.brass_astrolabe;
    ctx.beginPath();
    ctx.arc(g.cx, g.cy, Math.max(5, g.r * 0.032), 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PALETTE.burnished_bronze;
    ctx.stroke();
    ctx.restore();
  }

  function drawOrbitsAndProcessions(ctx, g, st) {
    ctx.save();
    var starCoords = {};
    for (var s = 0; s < LUMINOUS_STARS.length; s++) {
      starCoords[LUMINOUS_STARS[s].name] = starPoint(LUMINOUS_STARS[s], g);
    }

    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = 'rgba(200, 155, 67, 0.48)';
    ctx.lineWidth = 1.25;
    for (var c = 0; c < CONSTELLATION_CHORDS.length; c++) {
      var pa = starCoords[CONSTELLATION_CHORDS[c][0]];
      var pb = starCoords[CONSTELLATION_CHORDS[c][1]];
      if (pa && pb) {
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    }
    ctx.setLineDash([]);

    var activeRite = riteForDeg(st.siderealDeg);
    var scaleFactor = clamp(g.r / 220, 0.55, 1.25);

    for (var i = 0; i < ORBITS.length; i++) {
      var orb = ORBITS[i];
      var isFocusedOrb = (st.focusedOrbitId === orb.id);
      var isRiteOrb = (activeRite.orbitId === orb.id);
      var rw = orb.roadWidth * scaleFactor;

      for (var b = 0; b < 14; b++) {
        var bAng = (b / 14) * Math.PI * 2 + i * 0.37;
        if (Math.cos(bAng) > 0.78 && i >= 4) continue;
        var bp = orbitPoint(orb, bAng, g);
        ctx.save();
        ctx.translate(bp.x, bp.y);
        ctx.rotate(bAng + Math.PI * 0.5);
        ctx.fillStyle = (b % 3 === 0) ? '#c9724d' : 'rgba(181, 90, 56, 0.62)';
        var bw = Math.max(4, 7.5 * scaleFactor);
        var bh = Math.max(3, 4.4 * scaleFactor);
        ctx.fillRect(-bw * 0.5, rw * 0.62, bw, bh);
        ctx.strokeStyle = 'rgba(28, 24, 19, 0.32)';
        ctx.lineWidth = 0.6;
        ctx.strokeRect(-bw * 0.5, rw * 0.62, bw, bh);
        ctx.restore();
      }

      ctx.beginPath();
      for (var k = 0; k <= 84; k++) {
        var th = (k / 84) * Math.PI * 2;
        var pt = orbitPoint(orb, th, g);
        if (k === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.closePath();

      if (isFocusedOrb || isRiteOrb) {
        ctx.strokeStyle = isFocusedOrb ? 'rgba(255, 217, 125, 0.75)' : 'rgba(200, 155, 67, 0.42)';
        ctx.lineWidth = rw + (isFocusedOrb ? 7 : 4);
        ctx.stroke();
      }

      ctx.strokeStyle = PALETTE.burnished_bronze;
      ctx.lineWidth = rw + 1.8;
      ctx.stroke();

      ctx.strokeStyle = isFocusedOrb ? '#fbf3df' : '#ede1c6';
      ctx.lineWidth = Math.max(2, rw - 1.2);
      ctx.stroke();

      for (var p = 0; p < orb.processions; p++) {
        var pTheta = degToRad(st.siderealDeg * orb.siderealVel + (p * 360) / orb.processions + i * 23);
        var pp = orbitPoint(orb, pTheta, g);
        var isCart = (p % 3 === 0);
        ctx.fillStyle = isRiteOrb ? PALETTE.nova_gold : (isCart ? PALETTE.terracotta_tile : PALETTE.ink_iron);
        ctx.beginPath();
        ctx.arc(pp.x, pp.y, (isCart ? 2.6 : 1.8) * scaleFactor, 0, Math.PI * 2);
        ctx.fill();
        if (isRiteOrb && isCart) {
          ctx.strokeStyle = 'rgba(255, 217, 125, 0.7)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(pp.x, pp.y, 4.8 * scaleFactor, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      if (g.r >= 130 && (i % 2 === 0 || isFocusedOrb)) {
        var lp = orbitPoint(orb, degToRad(-88 + i * 4), g);
        ctx.font = (isFocusedOrb ? '600 ' : '500 ') + Math.max(8, Math.round(9.5 * scaleFactor)) + 'px Georgia, serif';
        ctx.fillStyle = isFocusedOrb ? PALETTE.ink_iron : 'rgba(28, 24, 19, 0.68)';
        ctx.textAlign = 'center';
        ctx.fillText(orb.name, lp.x, lp.y - 4 * scaleFactor);
      }
    }

    for (var m = 0; m < LUMINOUS_STARS.length; m++) {
      var stStar = LUMINOUS_STARS[m];
      var sp = starCoords[stStar.name];
      var starFocused = (st.focusedStar === stStar.name || st.focusedId === stStar.coupledId);
      var pulse = stStar.name === 'Cepheids' ? (0.72 + 0.28 * Math.sin(st.timeSec * 3.4)) : (0.86 + 0.14 * Math.sin(st.timeSec * 1.9 + m));
      var sr = Math.max(7, 10.5 * scaleFactor);

      var lanternGlow = ctx.createRadialGradient(sp.x, sp.y, 1, sp.x, sp.y, sr * (starFocused ? 2.6 : 1.9));
      lanternGlow.addColorStop(0, stStar.color);
      lanternGlow.addColorStop(1, 'rgba(255, 217, 125, 0)');
      ctx.globalAlpha = 0.55 * pulse;
      ctx.fillStyle = lanternGlow;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sr * (starFocused ? 2.6 : 1.9), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#faf2df';
      ctx.strokeStyle = starFocused ? PALETTE.ink_iron : PALETTE.burnished_bronze;
      ctx.lineWidth = starFocused ? 1.8 : 1.2;
      ctx.beginPath();
      for (var ptIdx = 0; ptIdx < 16; ptIdx++) {
        var sa = (ptIdx / 16) * Math.PI * 2 - Math.PI * 0.5;
        var radLen = (ptIdx % 2 === 0) ? sr : sr * 0.44;
        var sx = sp.x + Math.cos(sa) * radLen;
        var sy = sp.y + Math.sin(sa) * radLen;
        if (ptIdx === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = stStar.color;
      ctx.beginPath();
      ctx.arc(sp.x, sp.y, sr * 0.28 * pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '600 ' + Math.max(9, Math.round(10.5 * scaleFactor)) + 'px Georgia, serif';
      ctx.fillStyle = PALETTE.ink_iron;
      ctx.textAlign = 'center';
      ctx.fillText('★ ' + stStar.name, sp.x, sp.y + sr + 10 * scaleFactor);
    }
    ctx.restore();
  }

  function drawDistrictArt(ctx, item, x, y, dr, prog, timeSec) {
    ctx.save();
    ctx.translate(x, y);

    if (item.id === 'bamboo_suspended_street') {
      ctx.fillStyle = '#2d533c';
      ctx.beginPath(); ctx.arc(0, 0, dr * 0.88, 0, Math.PI * 2); ctx.fill();
      for (var b = -3; b <= 3; b++) {
        var sway = Math.sin(timeSec * 2.1 + b) * dr * 0.05;
        var bx = b * dr * 0.2;
        ctx.strokeStyle = (b % 2 === 0) ? '#639c76' : PALETTE.bamboo_jade;
        ctx.lineWidth = Math.max(1.4, dr * 0.075);
        ctx.beginPath();
        ctx.moveTo(bx, dr * 0.65);
        ctx.quadraticCurveTo(bx + sway, 0, bx + sway * 1.5, -dr * 0.65);
        ctx.stroke();
      }
      if (prog > 0.01) {
        ctx.globalAlpha = clamp(prog, 0, 1);
        var span = dr * 0.92 * (0.4 + 0.6 * prog);
        ctx.strokeStyle = PALETTE.nova_gold;
        ctx.lineWidth = Math.max(1.2, dr * 0.06);
        ctx.beginPath();
        ctx.moveTo(-span, -dr * 0.36);
        ctx.quadraticCurveTo(0, -dr * 0.02, span, -dr * 0.36);
        ctx.stroke();
        ctx.fillStyle = PALETTE.terracotta_tile;
        ctx.strokeStyle = PALETTE.brass_astrolabe;
        ctx.lineWidth = Math.max(1.5, dr * 0.08);
        ctx.beginPath();
        ctx.rect(-span, -dr * 0.14, span * 2, dr * 0.28);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = PALETTE.burnished_bronze;
        ctx.fillRect(-span - dr * 0.1, -dr * 0.38, dr * 0.16, dr * 0.62);
        ctx.fillRect(span - dr * 0.06, -dr * 0.38, dr * 0.16, dr * 0.62);
        for (var l = -1; l <= 1; l++) {
          ctx.fillStyle = PALETTE.nova_gold;
          ctx.beginPath(); ctx.arc(l * span * 0.55, 0, dr * 0.11, 0, Math.PI * 2); ctx.fill();
        }
      }
    } else if (item.id === 'shadow_theater_kennels') {
      if (prog < 0.98) {
        ctx.globalAlpha = 1 - prog * 0.85;
        ctx.fillStyle = '#8b7e6a';
        ctx.fillRect(-dr * 0.72, -dr * 0.48, dr * 1.44, dr * 0.96);
        ctx.strokeStyle = PALETTE.ink_iron;
        ctx.lineWidth = 1.3;
        ctx.strokeRect(-dr * 0.72, -dr * 0.48, dr * 1.44, dr * 0.96);
        for (var k = -2; k <= 2; k++) {
          ctx.beginPath();
          ctx.moveTo(k * dr * 0.26, -dr * 0.48);
          ctx.lineTo(k * dr * 0.26, dr * 0.48);
          ctx.stroke();
        }
      }
      if (prog > 0.01) {
        ctx.globalAlpha = clamp(prog, 0, 1);
        ctx.fillStyle = PALETTE.terracotta_tile;
        ctx.beginPath();
        ctx.arc(0, dr * 0.1, dr * 0.84, Math.PI, 0, false);
        ctx.lineTo(dr * 0.84, dr * 0.52);
        ctx.lineTo(-dr * 0.84, dr * 0.52);
        ctx.closePath();
        ctx.fill();
        var linen = ctx.createRadialGradient(0, 0, dr * 0.05, 0, 0, dr * 0.68);
        linen.addColorStop(0, '#fff7d6');
        linen.addColorStop(0.7, PALETTE.nova_gold);
        linen.addColorStop(1, '#d19838');
        ctx.fillStyle = linen;
        ctx.fillRect(-dr * 0.62, -dr * 0.34, dr * 1.24, dr * 0.68);
        var pupShift = Math.sin(timeSec * 2.6) * dr * 0.16;
        ctx.fillStyle = PALETTE.ink_iron;
        ctx.beginPath(); ctx.arc(-dr * 0.18 + pupShift, -dr * 0.05, dr * 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-dr * 0.24 + pupShift, 0, dr * 0.12, dr * 0.26);
        ctx.beginPath(); ctx.arc(dr * 0.22 - pupShift * 0.7, -dr * 0.02, dr * 0.12, 0, Math.PI * 2); ctx.fill();
      }
    } else if (item.id === 'statue_of_thales') {
      ctx.fillStyle = '#dfd0b0';
      ctx.strokeStyle = PALETTE.burnished_bronze;
      ctx.lineWidth = 1.4;
      ctx.fillRect(-dr * 0.78, -dr * 0.26, dr * 1.52, dr * 0.52);
      ctx.strokeRect(-dr * 0.78, -dr * 0.26, dr * 1.52, dr * 0.52);
      ctx.fillStyle = '#bfb08e';
      ctx.beginPath(); ctx.arc(dr * 0.2, 0, dr * 0.26, 0, Math.PI * 2); ctx.fill();
      if (prog > 0.01) {
        ctx.globalAlpha = clamp(prog, 0, 1);
        ctx.strokeStyle = PALETTE.nova_gold;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(dr * 0.25, 0, dr * 0.78, -0.9, 0.9); ctx.stroke();
        ctx.fillStyle = '#f5ecd8';
        ctx.fillRect(-dr * 0.12, dr * 0.08, dr * 0.52, dr * 0.26);
        var hScale = 0.35 + 0.65 * prog;
        ctx.fillStyle = PALETTE.brass_astrolabe;
        ctx.strokeStyle = PALETTE.ink_iron;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(0, dr * 0.1);
        ctx.lineTo(dr * 0.14, -dr * 0.68 * hScale);
        ctx.lineTo(dr * 0.28, dr * 0.1);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = PALETTE.nova_gold;
        ctx.beginPath(); ctx.arc(dr * 0.14, -dr * 0.76 * hScale, dr * 0.14, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = PALETTE.nova_gold;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(dr * 0.22, -dr * 0.52 * hScale);
        ctx.lineTo(dr * 0.72, -dr * 0.82 * hScale);
        ctx.lineTo(dr * 0.56, -dr * 0.22 * hScale);
        ctx.stroke();
      }
    } else if (item.id === 'gymnastics_toboggan_slide') {
      ctx.fillStyle = PALETTE.terracotta_tile;
      ctx.fillRect(-dr * 0.74, -dr * 0.58, dr * 1.48, dr * 1.16);
      ctx.fillStyle = '#f3e8cf';
      ctx.fillRect(-dr * 0.5, -dr * 0.36, dr * 1.0, dr * 0.72);
      if (prog > 0.01) {
        ctx.globalAlpha = clamp(prog, 0, 1);
        ctx.lineCap = 'round';
        ctx.strokeStyle = PALETTE.burnished_bronze;
        ctx.lineWidth = Math.max(4, dr * 0.34);
        ctx.beginPath();
        ctx.moveTo(-dr * 0.55, -dr * 0.55);
        ctx.bezierCurveTo(dr * 0.75, -dr * 0.48, -dr * 0.75, dr * 0.28, dr * 0.68 * prog, dr * 0.62 * prog);
        ctx.stroke();
        ctx.strokeStyle = PALETTE.nova_gold;
        ctx.lineWidth = Math.max(2, dr * 0.16);
        ctx.stroke();
        var slideT = (timeSec * 0.65) % 1;
        var sx = (1 - slideT) * (-dr * 0.45) + slideT * (dr * 0.55 * prog);
        var sy = (1 - slideT) * (-dr * 0.48) + slideT * (dr * 0.52 * prog);
        ctx.fillStyle = PALETTE.ink_iron;
        ctx.beginPath(); ctx.arc(sx, sy, dr * 0.11, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawInnovationsAndSightlines(ctx, g, st) {
    ctx.save();
    var scaleFactor = clamp(g.r / 220, 0.55, 1.25);
    var dr = Math.max(15, 24 * scaleFactor);
    var domePortX = g.w - 8;
    var domePortY = g.h * 0.16;

    for (var i = 0; i < st.items.length; i++) {
      var item = st.items[i];
      var pt = innovationPoint(item, g);
      var isFocused = (st.focusedId === item.id);

      if (isFocused) {
        var cpX = (pt.x + domePortX) * 0.5;
        var cpY = Math.min(pt.y, domePortY) - g.r * 0.22;
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 217, 125, 0.78)';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([6, 4]);
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.quadraticCurveTo(cpX, cpY, domePortX, domePortY);
        ctx.stroke();
        ctx.setLineDash([]);
        for (var b = 0; b < 3; b++) {
          var bt = ((st.timeSec * 0.45) + b / 3) % 1;
          var inv = 1 - bt;
          var bx = inv * inv * pt.x + 2 * inv * bt * cpX + bt * bt * domePortX;
          var by = inv * inv * pt.y + 2 * inv * bt * cpY + bt * bt * domePortY;
          ctx.fillStyle = PALETTE.nova_gold;
          ctx.beginPath(); ctx.arc(bx, by, 2.8 * scaleFactor, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }

      ctx.fillStyle = '#f5ecd8';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, dr, 0, Math.PI * 2);
      ctx.fill();

      drawDistrictArt(ctx, item, pt.x, pt.y, dr, item.progress, st.timeSec);

      if (item.enacted) {
        ctx.strokeStyle = PALETTE.nova_gold;
        ctx.lineWidth = 3.2;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, dr + 3.5, 0, Math.PI * 2); ctx.stroke();
      } else if (item.weighed) {
        ctx.save();
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = PALETTE.brass_astrolabe;
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, dr + 3, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }

      ctx.strokeStyle = isFocused ? PALETTE.ink_iron : PALETTE.burnished_bronze;
      ctx.lineWidth = isFocused ? 2.2 : 1.4;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, dr, 0, Math.PI * 2);
      ctx.stroke();

      if (item.recoil > 0.02) {
        var rr = dr + 6 + (1 - item.recoil) * 10;
        ctx.strokeStyle = 'rgba(181, 52, 36, ' + item.recoil.toFixed(2) + ')';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(pt.x, pt.y, rr, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(pt.x - dr * 0.65, pt.y - dr * 0.65);
        ctx.lineTo(pt.x + dr * 0.65, pt.y + dr * 0.65);
        ctx.stroke();
      }

      var badgeY = pt.y + dr + 11 * scaleFactor;
      ctx.font = '700 ' + Math.max(8, Math.round(9.5 * scaleFactor)) + 'px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = item.enacted ? '#5b3c0b' : PALETTE.ink_iron;
      var shortTag = '[' + (i + 1) + '] ' + (item.enacted ? '✦ ' : '') + item.orbitDistrict.split(' (')[0];
      ctx.fillText(shortTag, pt.x, badgeY);
    }

    var rite = riteForDeg(st.siderealDeg);
    ctx.fillStyle = 'rgba(28, 24, 19, 0.78)';
    ctx.font = '600 ' + Math.max(9, Math.round(10 * scaleFactor)) + 'px Georgia, serif';
    ctx.textAlign = 'left';
    ctx.fillText('SIDEREAL ' + st.siderealDeg.toFixed(1) + '° · ' + rite.market.toUpperCase(), 10, Math.max(14, 16 * scaleFactor));
    ctx.restore();
  }

  function createController(opts) {
    var cfg = opts || {};
    var attachedCanvas = null;
    var attachedCtx = null;
    var viewW = 640;
    var viewH = 520;
    var viewDpr = 1;

    function freshItems() {
      var list = [];
      for (var i = 0; i < INNOVATIONS.length; i++) {
        var src = INNOVATIONS[i];
        list.push({
          id: src.id,
          title: src.title,
          earthlyInnovation: src.earthlyInnovation,
          orbitId: src.orbitId,
          innerOrbitId: src.innerOrbitId || null,
          orbitDistrict: src.orbitDistrict,
          star: src.star,
          celestialId: src.celestialId,
          celestialNovelty: src.celestialNovelty,
          beforeLabel: src.beforeLabel,
          afterLabel: src.afterLabel,
          angleDeg: src.angleDeg,
          weighed: false,
          enacted: false,
          confidenceWeight: 0.35,
          prudenceWeight: 0.30,
          harmonyScore: 0.32,
          progress: 0,
          recoil: 0
        });
      }
      return list;
    }

    var st = {
      items: freshItems(),
      siderealDeg: 42,
      timeSec: 0,
      autoRevolve: true,
      reducedMotion: Boolean(cfg.reducedMotion),
      recklessBlockedCount: 0,
      lastBlockedReason: null,
      focusedId: INNOVATIONS[0].id,
      focusedStar: INNOVATIONS[0].star,
      focusedOrbitId: INNOVATIONS[0].orbitId
    };

    function findItem(query) {
      if (!query) return null;
      var q = typeof query === 'object' ? (query.id || query.celestialId || query.star || '') : String(query);
      var ql = q.toLowerCase();
      for (var i = 0; i < st.items.length; i++) {
        var it = st.items[i];
        if (it.id === q || it.celestialId === q || it.star.toLowerCase() === ql || it.orbitId === q) return it;
      }
      return null;
    }

    function pickTargetItem(id, preferUnenacted) {
      var direct = findItem(id);
      if (direct) return direct;
      var focused = findItem(st.focusedId);
      if (preferUnenacted) {
        if (focused && !focused.enacted) return focused;
        for (var i = 0; i < st.items.length; i++) {
          if (!st.items[i].enacted) return st.items[i];
        }
      }
      return focused || st.items[0];
    }

    var api = {
      attachCanvas: function (canvas) {
        attachedCanvas = canvas || null;
        attachedCtx = attachedCanvas ? attachedCanvas.getContext('2d') : null;
        if (attachedCanvas) {
          var cw = attachedCanvas.clientWidth || attachedCanvas.width || 640;
          var ch = attachedCanvas.clientHeight || attachedCanvas.height || 520;
          var dpr = (global.devicePixelRatio || 1);
          api.resize(cw, ch, dpr);
        }
        return api;
      },

      resize: function (w, h, dpr) {
        viewDpr = clamp(Number(dpr) || (global.devicePixelRatio || 1), 1, 2);
        viewW = Math.max(120, Math.round(Number(w) || 640));
        viewH = Math.max(120, Math.round(Number(h) || 520));
        if (attachedCanvas) {
          attachedCanvas.width = Math.round(viewW * viewDpr);
          attachedCanvas.height = Math.round(viewH * viewDpr);
        }
        return api;
      },

      step: function (dt) {
        var delta = clamp(Number(dt) || 0, 0, 0.25);
        if (!st.reducedMotion) {
          st.timeSec += delta;
          if (st.autoRevolve) {
            st.siderealDeg = (st.siderealDeg + delta * 5.2) % 360;
          }
        }
        for (var i = 0; i < st.items.length; i++) {
          var it = st.items[i];
          var target = it.enacted ? 1 : 0;
          if (st.reducedMotion) {
            it.progress = target;
          } else if (it.progress < target) {
            it.progress = Math.min(1, it.progress + delta * 2.4);
          } else if (it.progress > target) {
            it.progress = Math.max(0, it.progress - delta * 2.8);
          }
          if (it.recoil > 0) {
            it.recoil = Math.max(0, it.recoil - (st.reducedMotion ? 1 : delta * 1.35));
          }
        }
        return api;
      },

      render: function (targetCtx) {
        var c = targetCtx || attachedCtx;
        if (!c) return api;
        var w = viewW;
        var h = viewH;
        c.save();
        if (c === attachedCtx) {
          c.setTransform(viewDpr, 0, 0, viewDpr, 0, 0);
        } else if (c.canvas) {
          w = c.canvas.width || viewW;
          h = c.canvas.height || viewH;
          c.setTransform(1, 0, 0, 1, 0, 0);
        }
        var g = computeGeom(w, h);
        drawGroundAndBezel(c, g, st.siderealDeg, st.timeSec);
        drawOrbitsAndProcessions(c, g, st);
        drawInnovationsAndSightlines(c, g, st);
        c.restore();
        return api;
      },

      weighInnovation: function (id, confidenceWeight, prudenceWeight) {
        var item = pickTargetItem(id, false);
        var conf = (confidenceWeight === undefined || confidenceWeight === null || isNaN(confidenceWeight))
          ? 0.82 : clamp(Number(confidenceWeight), 0, 1);
        var prud = (prudenceWeight === undefined || prudenceWeight === null || isNaN(prudenceWeight))
          ? 0.86 : clamp(Number(prudenceWeight), 0, 1);
        var imbalance = Math.abs(conf - prud) * 0.16;
        var harmony = Number(clamp(conf * 0.44 + prud * 0.56 - imbalance, 0, 1).toFixed(3));
        var ok = (conf >= 0.55 && prud >= 0.65);

        item.confidenceWeight = conf;
        item.prudenceWeight = prud;
        item.harmonyScore = harmony;
        item.weighed = ok;
        st.focusedId = item.id;
        st.focusedStar = item.star;
        st.focusedOrbitId = item.orbitId;

        return {
          ok: ok,
          id: item.id,
          celestialId: item.celestialId,
          weighed: ok,
          confidenceWeight: conf,
          prudenceWeight: prud,
          harmonyScore: harmony,
          cosmicRiskCalculated: true
        };
      },

      attemptEnact: function (id, callOpts) {
        var isReckless = Boolean(callOpts && callOpts.reckless === true);
        var item = pickTargetItem(id, isReckless && !id);

        if (!item.weighed || isReckless) {
          st.recklessBlockedCount += 1;
          var reason = 'Civic Council blocked unweighed decree: every earthly change alters the sky.';
          st.lastBlockedReason = reason;
          item.recoil = 1.0;
          if (!item.enacted) {
            item.enacted = false;
          }
          st.focusedId = item.id;
          st.focusedStar = item.star;
          st.focusedOrbitId = item.orbitId;
          var blockRes = {
            enacted: false,
            blocked: true,
            recklessChangeBlocked: true,
            recklessBlockedCount: st.recklessBlockedCount,
            id: item.id,
            celestialId: item.celestialId,
            reason: reason
          };
          if (typeof cfg.onRecklessBlocked === 'function') {
            cfg.onRecklessBlocked({
              id: item.id,
              celestialId: item.celestialId,
              enacted: false,
              blocked: true,
              recklessChangeBlocked: true,
              recklessBlockedCount: st.recklessBlockedCount,
              reason: reason,
              state: api.getState()
            });
          }
          return blockRes;
        }

        item.enacted = true;
        item.recoil = 0;
        item.progress = st.reducedMotion ? 1 : Math.max(item.progress, 0.65);
        st.focusedId = item.id;
        st.focusedStar = item.star;
        st.focusedOrbitId = item.orbitId;

        if (typeof cfg.onInnovationChanged === 'function') {
          cfg.onInnovationChanged({
            id: item.id,
            celestialId: item.celestialId,
            star: item.star,
            enacted: true,
            weighed: true,
            source: 'earth',
            state: api.getState()
          });
        }
        return {
          enacted: true,
          blocked: false,
          weighed: true,
          id: item.id,
          celestialId: item.celestialId,
          harmonyScore: item.harmonyScore
        };
      },

      deliberateAndEnact: function (id) {
        var w = api.weighInnovation(id, 0.84, 0.88);
        var res = api.attemptEnact(w.id);
        res.weighed = w.weighed;
        res.harmonyScore = w.harmonyScore;
        return res;
      },

      revertInnovation: function (id) {
        var item = pickTargetItem(id, false);
        item.enacted = false;
        item.weighed = false;
        item.confidenceWeight = 0.35;
        item.prudenceWeight = 0.30;
        item.harmonyScore = 0.32;
        item.progress = 0;
        item.recoil = 0;
        if (typeof cfg.onInnovationChanged === 'function') {
          cfg.onInnovationChanged({
            id: item.id,
            celestialId: item.celestialId,
            star: item.star,
            enacted: false,
            weighed: false,
            source: 'earth',
            state: api.getState()
          });
        }
        return { ok: true, id: item.id, celestialId: item.celestialId, enacted: false, weighed: false };
      },

      resetAll: function () {
        var prevEnacted = [];
        for (var i = 0; i < st.items.length; i++) {
          if (st.items[i].enacted) prevEnacted.push(st.items[i]);
        }
        st.items = freshItems();
        st.recklessBlockedCount = 0;
        st.lastBlockedReason = null;
        st.focusedId = st.items[0].id;
        st.focusedStar = st.items[0].star;
        st.focusedOrbitId = st.items[0].orbitId;
        if (typeof cfg.onInnovationChanged === 'function') {
          if (prevEnacted.length === 0) {
            cfg.onInnovationChanged({ id: st.items[0].id, celestialId: st.items[0].celestialId, enacted: false, reset: true, source: 'earth', state: api.getState() });
          } else {
            for (var j = 0; j < prevEnacted.length; j++) {
              cfg.onInnovationChanged({ id: prevEnacted[j].id, celestialId: prevEnacted[j].celestialId, enacted: false, reset: true, source: 'earth', state: api.getState() });
            }
          }
        }
        return api.getState();
      },

      focusFromSky: function (idOrStar) {
        var matched = findItem(idOrStar);
        if (matched) {
          st.focusedId = matched.id;
          st.focusedStar = matched.star;
          st.focusedOrbitId = matched.orbitId;
          return {
            ok: true,
            bidirectionalCoupling: true,
            focusedId: matched.id,
            id: matched.id,
            celestialId: matched.celestialId,
            star: matched.star,
            orbitId: matched.orbitId,
            orbitDistrict: matched.orbitDistrict,
            source: 'sky'
          };
        }
        var raw = typeof idOrStar === 'object' ? (idOrStar.orbitId || idOrStar.star || '') : String(idOrStar || '');
        var orb = findOrbit(raw);
        st.focusedOrbitId = orb.id;
        return {
          ok: true,
          bidirectionalCoupling: true,
          focusedId: st.focusedId,
          id: st.focusedId,
          celestialId: null,
          star: st.focusedStar,
          orbitId: orb.id,
          orbitDistrict: orb.name,
          source: 'sky'
        };
      },

      focusDistrict: function (idOrStar, notifySky) {
        var res = api.focusFromSky(idOrStar);
        res.source = 'earth';
        if (notifySky !== false && typeof cfg.onEarthFocus === 'function') {
          cfg.onEarthFocus(res);
        }
        return res;
      },

      hitTest: function (nx, ny) {
        var xNorm = Number(nx);
        var yNorm = Number(ny);
        if (isNaN(xNorm) || isNaN(yNorm)) return null;
        if (xNorm > 1.05 || yNorm > 1.05) {
          xNorm = xNorm / Math.max(1, viewW);
          yNorm = yNorm / Math.max(1, viewH);
        }
        var g = computeGeom(viewW, viewH);
        var px = xNorm * viewW;
        var py = yNorm * viewH;
        var hitPayload = null;

        var bestDist = Math.max(26, g.r * 0.16);
        for (var i = 0; i < st.items.length; i++) {
          var it = st.items[i];
          var ip = innovationPoint(it, g);
          var d = Math.hypot(px - ip.x, py - ip.y);
          if (d < bestDist) {
            bestDist = d;
            hitPayload = {
              kind: 'innovation',
              id: it.id,
              focusedId: it.id,
              celestialId: it.celestialId,
              star: it.star,
              orbitId: it.orbitId,
              orbitDistrict: it.orbitDistrict,
              title: it.title,
              bidirectionalCoupling: true,
              source: 'earth'
            };
          }
        }

        if (!hitPayload) {
          var bestStarDist = Math.max(22, g.r * 0.14);
          for (var s = 0; s < LUMINOUS_STARS.length; s++) {
            var star = LUMINOUS_STARS[s];
            var sp = starPoint(star, g);
            var sd = Math.hypot(px - sp.x, py - sp.y);
            if (sd < bestStarDist) {
              bestStarDist = sd;
              var coupled = findItem(star.coupledId) || st.items[0];
              hitPayload = {
                kind: 'star',
                id: coupled.id,
                focusedId: coupled.id,
                celestialId: coupled.celestialId,
                star: star.name,
                orbitId: star.orbitId,
                orbitDistrict: star.communityBuilding,
                raDeg: star.raDeg,
                decDeg: star.decDeg,
                bidirectionalCoupling: true,
                source: 'earth'
              };
            }
          }
        }

        if (!hitPayload) {
          var bestOrbDist = Math.max(16, g.r * 0.09);
          for (var o = 0; o < ORBITS.length; o++) {
            var orb = ORBITS[o];
            for (var k = 0; k < 36; k++) {
              var op = orbitPoint(orb, (k / 36) * Math.PI * 2, g);
              var od = Math.hypot(px - op.x, py - op.y);
              if (od < bestOrbDist) {
                bestOrbDist = od;
                var orbItem = findItem(orb.id) || findItem(st.focusedId) || st.items[0];
                hitPayload = {
                  kind: 'orbit',
                  id: orbItem.id,
                  focusedId: orbItem.id,
                  celestialId: orbItem.celestialId,
                  star: orbItem.star,
                  orbitId: orb.id,
                  orbitName: orb.name,
                  orbitDistrict: orb.name,
                  civicRite: orb.civicRite,
                  bidirectionalCoupling: true,
                  source: 'earth'
                };
              }
            }
          }
        }

        if (hitPayload) {
          st.focusedId = hitPayload.id;
          st.focusedStar = hitPayload.star;
          st.focusedOrbitId = hitPayload.orbitId;
          if (typeof cfg.onEarthFocus === 'function') {
            cfg.onEarthFocus(hitPayload);
          }
        }
        return hitPayload;
      },

      setSiderealPhase: function (phase) {
        var val = typeof phase === 'object' && phase !== null ? Number(phase.deg !== undefined ? phase.deg : phase.phase) : Number(phase);
        if (!isNaN(val)) {
          var deg = (Math.abs(val) <= 1.0001) ? (val * 360) : val;
          st.siderealDeg = ((deg % 360) + 360) % 360;
        }
        return api;
      },

      setAutoRevolve: function (flag) {
        st.autoRevolve = Boolean(flag);
        return api;
      },

      setReducedMotion: function (flag) {
        st.reducedMotion = Boolean(flag);
        if (st.reducedMotion) {
          for (var i = 0; i < st.items.length; i++) {
            st.items[i].progress = st.items[i].enacted ? 1 : 0;
            st.items[i].recoil = 0;
          }
        }
        return api;
      },

      getState: function () {
        var g = computeGeom(viewW, viewH);
        var weighedIds = [];
        var enactedIds = [];
        var innovationsOut = [];
        for (var i = 0; i < st.items.length; i++) {
          var it = st.items[i];
          if (it.weighed) weighedIds.push(it.id);
          if (it.enacted) enactedIds.push(it.id);
          var pt = innovationPoint(it, g);
          innovationsOut.push({
            id: it.id,
            title: it.title,
            earthlyInnovation: it.earthlyInnovation,
            orbitId: it.orbitId,
            orbitDistrict: it.orbitDistrict,
            star: it.star,
            celestialId: it.celestialId,
            celestialNovelty: it.celestialNovelty,
            beforeLabel: it.beforeLabel,
            afterLabel: it.afterLabel,
            weighed: it.weighed,
            enacted: it.enacted,
            confidenceWeight: it.confidenceWeight,
            prudenceWeight: it.prudenceWeight,
            harmonyScore: it.harmonyScore,
            progress: Number(it.progress.toFixed(3)),
            nx: Number((pt.x / viewW).toFixed(4)),
            ny: Number((pt.y / viewH).toFixed(4))
          });
        }
        var starsOut = [];
        for (var s = 0; s < LUMINOUS_STARS.length; s++) {
          var ls = LUMINOUS_STARS[s];
          var sp = starPoint(ls, g);
          starsOut.push({
            name: ls.name,
            orbitId: ls.orbitId,
            coupledId: ls.coupledId,
            communityBuilding: ls.communityBuilding,
            raDeg: ls.raDeg,
            decDeg: ls.decDeg,
            nx: Number((sp.x / viewW).toFixed(4)),
            ny: Number((sp.y / viewH).toFixed(4))
          });
        }
        var rite = riteForDeg(st.siderealDeg);
        return {
          planetaryStreetCoupling: true,
          bidirectionalCoupling: true,
          recklessChangeBlocked: true,
          recklessBlockedCount: st.recklessBlockedCount,
          lastBlockedReason: st.lastBlockedReason,
          weighedIds: weighedIds,
          enactedIds: enactedIds,
          innovations: innovationsOut,
          stars: starsOut,
          luminousStars: ['Antares', 'Alpheratz', 'Capella', 'Cepheids'],
          siderealDeg: Number(st.siderealDeg.toFixed(2)),
          siderealPhase: Number((st.siderealDeg / 360).toFixed(4)),
          autoRevolve: st.autoRevolve,
          activeCivicRite: rite,
          activeCivicRiteTitle: rite.title,
          focusedId: st.focusedId,
          focusedStar: st.focusedStar,
          focusedOrbitId: st.focusedOrbitId,
          reducedMotion: st.reducedMotion
        };
      }
    };

    activeController = api;
    return api;
  }

  var activeController = null;
  function ensureDefault() {
    if (!activeController) activeController = createController({});
    return activeController;
  }

  global.AndriaPlanetaryStreets = {
    PALETTE: PALETTE,
    ORBITS: ORBITS,
    SIDEREAL_RITES: SIDEREAL_RITES,
    LUMINOUS_STARS: LUMINOUS_STARS,
    CONSTELLATION_CHORDS: CONSTELLATION_CHORDS,
    INNOVATIONS: INNOVATIONS,
    createController: createController,
    attachCanvas: function (c) { return ensureDefault().attachCanvas(c); },
    resize: function (w, h, dpr) { return ensureDefault().resize(w, h, dpr); },
    step: function (dt) { return ensureDefault().step(dt); },
    render: function (ctx) { return ensureDefault().render(ctx); },
    weighInnovation: function (id, c, p) { return ensureDefault().weighInnovation(id, c, p); },
    attemptEnact: function (id, o) { return ensureDefault().attemptEnact(id, o); },
    deliberateAndEnact: function (id) { return ensureDefault().deliberateAndEnact(id); },
    revertInnovation: function (id) { return ensureDefault().revertInnovation(id); },
    resetAll: function () { return ensureDefault().resetAll(); },
    focusFromSky: function (q) { return ensureDefault().focusFromSky(q); },
    focusDistrict: function (q, n) { return ensureDefault().focusDistrict(q, n); },
    hitTest: function (nx, ny) { return ensureDefault().hitTest(nx, ny); },
    setSiderealPhase: function (p) { return ensureDefault().setSiderealPhase(p); },
    setAutoRevolve: function (f) { return ensureDefault().setAutoRevolve(f); },
    setReducedMotion: function (f) { return ensureDefault().setReducedMotion(f); },
    getState: function () { return ensureDefault().getState(); }
  };
})(globalThis);
