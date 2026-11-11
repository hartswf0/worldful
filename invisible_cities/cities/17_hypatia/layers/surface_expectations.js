/*
 * Hypatia (City 17 — Cities & Signs 4)
 * Layer 1: Classical Surface Signifiers & Traveler Expectation Lexicon
 * Standalone procedural architectural elevations for window.HypatiaSurfaceExpectations
 */
(function (root) {
  'use strict';

  const PALETTE = Object.freeze({
    magnoliaTurquoise: '#1f9aa8',
    lagoonCyan: '#58d3dc',
    magnoliaIvory: '#f4ede0',
    porphyryCrimson: '#842038',
    porphyryRose: '#b8435e',
    basaltBlack: '#0e1117',
    basaltSlate: '#1b202c',
    vellumOchre: '#d4a853',
    papyrusAmber: '#ebd099'
  });

  const LOCI_ORDER = Object.freeze([
    'magnolia_lagoon',
    'porphyry_palace',
    'vellum_library',
    'sultan_stables',
    'cemetery_tombs',
    'citadel_pinnacle'
  ]);

  const SURFACE_SIGNIFIERS = Object.freeze([
    Object.freeze({
      id: 'magnolia_lagoon',
      index: 0,
      key: '1',
      roman: 'I',
      surfaceTitle: 'Magnolia Garden & Blue Lagoons',
      thingSignifier: 'White magnolia blossoms reflected in turquoise lagoons and clipped hedges',
      expectedSignified: 'Young and beautiful ladies bathing among mirrored hedges',
      travelerQuery: 'Among nine magnolia boughs and three turquoise pools, where do the young bathers linger?',
      architecturalMetrics: Object.freeze({ magnoliaBoughs: 9, lagoonPools: 3, clippedHedges: 4 }),
      palette: Object.freeze({ primary: '#1f9aa8', accent: '#58d3dc', highlight: '#f4ede0', ground: '#0e1117', trim: '#d4a853' })
    }),
    Object.freeze({
      id: 'porphyry_palace',
      index: 1,
      key: '2',
      roman: 'II',
      surfaceTitle: 'Porphyry Palace & Frescoed Hall',
      thingSignifier: 'Crimson porphyry steps, highest domes, six tiled fountain courtyards, and iron-barred frescoed hall',
      expectedSignified: 'Imperial audience with the Sultan enthroned beneath high domes',
      travelerQuery: 'Past six fountain courtyards and iron bars before frescoed walls, where sits the Sultan?',
      architecturalMetrics: Object.freeze({ courtyardCount: 6, highDomes: 3, porphyrySteps: 9, ironBars: 11 }),
      palette: Object.freeze({ primary: '#842038', accent: '#b8435e', highlight: '#f4ede0', ground: '#0e1117', trim: '#d4a853' })
    }),
    Object.freeze({
      id: 'vellum_library',
      index: 2,
      key: '3',
      roman: 'III',
      surfaceTitle: 'Great Library of Vellum Papyri',
      thingSignifier: 'Shelves collapsing under vellum bindings and vanished alphabets winding across hallways, stairs, and bridges',
      expectedSignified: 'Venerable philosopher studying ancient scrolls in silent contemplation',
      travelerQuery: 'Across bridges inscribed with twelve vanished alphabets, at which lectern sits the sage?',
      architecturalMetrics: Object.freeze({ vanishedAlphabets: 12, bridgeSpans: 3, vellumTiers: 4 }),
      palette: Object.freeze({ primary: '#d4a853', accent: '#ebd099', highlight: '#f4ede0', ground: '#1b202c', trim: '#842038' })
    }),
    Object.freeze({
      id: 'sultan_stables',
      index: 3,
      key: '4',
      roman: 'IV',
      surfaceTitle: "Sultan's Vaulted Stables",
      thingSignifier: 'Grand masonry horse-stalls hung with tooled leather saddles, stirrups, and bridles',
      expectedSignified: 'Royal grooms tending Arabian war-steeds and imperial mounts',
      travelerQuery: 'Beneath six vaulted masonry stalls hung with tooled saddles, what steeds await the bridle?',
      architecturalMetrics: Object.freeze({ vaultedStalls: 6, suspendedSaddles: 6, stirrupPairs: 6 }),
      palette: Object.freeze({ primary: '#842038', accent: '#d4a853', highlight: '#ebd099', ground: '#1b202c', trim: '#f4ede0' })
    }),
    Object.freeze({
      id: 'cemetery_tombs',
      index: 4,
      key: '5',
      roman: 'V',
      surfaceTitle: 'Cypress Necropolis & Marble Tombs',
      thingSignifier: 'Solemn avenue of dark cypresses, carved marble sarcophagi, and fluted sepulchers',
      expectedSignified: 'Mourning, dust, and funereal stillness of the dead',
      travelerQuery: 'Along the cypress avenue of seven marble sepulchers, does silent dust keep watch?',
      architecturalMetrics: Object.freeze({ marbleTombs: 7, cypressColumns: 8, sepulcherNiches: 7 }),
      palette: Object.freeze({ primary: '#1b202c', accent: '#1f9aa8', highlight: '#f4ede0', ground: '#0e1117', trim: '#58d3dc' })
    }),
    Object.freeze({
      id: 'citadel_pinnacle',
      index: 5,
      key: '6',
      roman: 'VI',
      surfaceTitle: 'Citadel Pinnacle Above Dry Crags',
      thingSignifier: 'Highest stone pinnacle crowning arid inland mountain ridges of sheer crag',
      expectedSignified: 'Landlocked watchtower scanning dry rock far from any harbor or sea',
      travelerQuery: 'Upon five arid inland crags where no sea exists, what distant ridge does the turret watch?',
      architecturalMetrics: Object.freeze({ citadelCrags: 5, watchParapets: 4, cliffSteps: 9 }),
      palette: Object.freeze({ primary: '#d4a853', accent: '#58d3dc', highlight: '#f4ede0', ground: '#0e1117', trim: '#842038' })
    })
  ]);

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || '#000000').replace('#', '');
    const n = parseInt(clean.length === 3
      ? clean[0] + clean[0] + clean[1] + clean[1] + clean[2] + clean[2]
      : clean, 16) || 0;
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + clamp(alpha, 0, 1).toFixed(3) + ')';
  }

  function resolveSignifier(locusId) {
    if (typeof locusId === 'number') {
      return SURFACE_SIGNIFIERS[clamp(locusId | 0, 0, SURFACE_SIGNIFIERS.length - 1)];
    }
    const keyStr = String(locusId || '');
    for (let i = 0; i < SURFACE_SIGNIFIERS.length; i++) {
      const s = SURFACE_SIGNIFIERS[i];
      if (s.id === keyStr || s.key === keyStr || s.roman === keyStr) return s;
    }
    return SURFACE_SIGNIFIERS[0];
  }

  function fillEllipse(ctx, cx, cy, rx, ry) {
    ctx.beginPath();
    if (typeof ctx.ellipse === 'function') {
      ctx.ellipse(cx, cy, Math.max(0.5, rx), Math.max(0.5, ry), 0, 0, Math.PI * 2);
    } else {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, ry / Math.max(0.5, rx));
      ctx.arc(0, 0, Math.max(0.5, rx), 0, Math.PI * 2);
      ctx.restore();
    }
    ctx.fill();
  }

  function drawPointedArchPath(ctx, x, y, w, h, crownRatio) {
    const cr = crownRatio == null ? 0.36 : crownRatio;
    const archH = h * cr;
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x, y + archH);
    ctx.quadraticCurveTo(x + w * 0.18, y + archH * 0.15, x + w * 0.5, y);
    ctx.quadraticCurveTo(x + w * 0.82, y + archH * 0.15, x + w, y + archH);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
  }

  function drawSurveyorGrid(ctx, w, h, trimHex) {
    ctx.save();
    ctx.strokeStyle = hexToRgba(trimHex || PALETTE.vellumOchre, 0.14);
    ctx.lineWidth = 1;
    const pad = Math.max(10, Math.min(w, h) * 0.028);
    ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
    for (let i = 1; i < 6; i++) {
      const gx = pad + ((w - pad * 2) * i) / 6;
      ctx.beginPath();
      ctx.moveTo(gx, pad);
      ctx.lineTo(gx, pad + 6);
      ctx.moveTo(gx, h - pad - 6);
      ctx.lineTo(gx, h - pad);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawMagnoliaBlossom(ctx, x, y, r, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = hexToRgba(PALETTE.magnoliaIvory, alpha);
    for (let p = 0; p < 5; p++) {
      ctx.save();
      ctx.rotate((p * Math.PI * 2) / 5 - 0.3);
      fillEllipse(ctx, 0, -r * 0.62, r * 0.42, r * 0.72);
      ctx.restore();
    }
    ctx.fillStyle = hexToRgba(PALETTE.vellumOchre, alpha * 0.95);
    fillEllipse(ctx, 0, 0, r * 0.24, r * 0.24);
    ctx.restore();
  }

  function drawMagnoliaLagoon(ctx, w, h, t) {
    const horizon = h * 0.48;
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, PALETTE.basaltBlack);
    sky.addColorStop(0.55, '#15444e');
    sky.addColorStop(1, PALETTE.magnoliaTurquoise);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, horizon + 2);

    // 4 sculpted clipped hedges along the botanical terrace
    for (let i = 0; i < 4; i++) {
      const hx = w * (0.06 + i * 0.23);
      const hw = w * 0.20;
      const hh = h * (0.13 + (i % 2) * 0.035);
      ctx.fillStyle = '#10373f';
      ctx.fillRect(hx, horizon - hh, hw, hh);
      fillEllipse(ctx, hx + hw * 0.5, horizon - hh, hw * 0.5, hh * 0.28);
      ctx.strokeStyle = hexToRgba(PALETTE.lagoonCyan, 0.35);
      ctx.lineWidth = 1.2;
      ctx.strokeRect(hx + 3, horizon - hh + 4, hw - 6, hh - 4);
    }

    // 3 terraced turquoise lagoon pools
    const poolBands = [
      { y0: horizon, y1: h * 0.64, c0: '#197d8a', c1: PALETTE.magnoliaTurquoise },
      { y0: h * 0.64, y1: h * 0.81, c0: PALETTE.magnoliaTurquoise, c1: '#2ab4c2' },
      { y0: h * 0.81, y1: h, c0: '#1c8c99', c1: PALETTE.lagoonCyan }
    ];
    for (let p = 0; p < poolBands.length; p++) {
      const b = poolBands[p];
      const pg = ctx.createLinearGradient(0, b.y0, 0, b.y1);
      pg.addColorStop(0, b.c0);
      pg.addColorStop(1, b.c1);
      ctx.fillStyle = pg;
      ctx.fillRect(0, b.y0, w, b.y1 - b.y0 + 1);
      // Ivory marble weir & balustrade divider
      ctx.fillStyle = hexToRgba(PALETTE.magnoliaIvory, 0.82);
      ctx.fillRect(w * 0.04, b.y0 - 2, w * 0.92, 4);
    }

    // Empty ivory marble bathing steps at center terrace
    for (let s = 0; s < 5; s++) {
      const sw = w * (0.16 + s * 0.032);
      const sy = horizon - 6 + s * (h * 0.024);
      ctx.fillStyle = hexToRgba(PALETTE.magnoliaIvory, 0.88 - s * 0.13);
      ctx.fillRect((w - sw) * 0.5, sy, sw, h * 0.018);
    }

    // 9 magnolia boughs overhanging and mirrored in the lagoons
    const br = Math.min(w, h) * 0.026;
    for (let i = 0; i < 9; i++) {
      const bx = w * (0.08 + i * 0.105);
      const archLift = Math.sin((i / 8) * Math.PI) * h * 0.11;
      const sway = Math.sin(t * 0.9 + i * 0.7) * 3.5;
      const by = horizon - h * 0.11 - archLift + (i % 2) * h * 0.035;
      ctx.strokeStyle = '#2c221e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(i < 4 ? 0 : i > 4 ? w : w * 0.5, h * 0.12);
      ctx.quadraticCurveTo((bx + w * 0.5) * 0.5, by - h * 0.06, bx + sway, by);
      ctx.stroke();
      drawMagnoliaBlossom(ctx, bx + sway, by, br, 0.95);
      // Mirrored blossom reflection in turquoise water
      const ry = horizon + (horizon - by) * 0.82 + Math.sin(t * 1.4 + i) * 2.5;
      drawMagnoliaBlossom(ctx, bx - sway * 0.6, ry, br * 0.92, 0.30);
    }

    // Shimmering lagoon ripples & drifting ivory petals
    for (let r = 0; r < 14; r++) {
      const rx = ((r * 97 + t * 14) % (w * 0.86)) + w * 0.07;
      const ry = horizon + h * 0.05 + ((r * 43) % (h * 0.43));
      ctx.strokeStyle = hexToRgba(PALETTE.lagoonCyan, 0.36);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(rx - 18, ry);
      ctx.lineTo(rx + 18, ry);
      ctx.stroke();
      ctx.fillStyle = hexToRgba(PALETTE.magnoliaIvory, 0.85);
      fillEllipse(ctx, rx, ry - 2, 4.5, 2.1);
    }
  }

  function drawPorphyryPalace(ctx, w, h, t) {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, PALETTE.basaltBlack);
    bg.addColorStop(0.45, '#3b1222');
    bg.addColorStop(1, '#1d0d16');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // 3 soaring porphyry domes (palace with the highest domes)
    const domes = [
      { cx: w * 0.24, y: h * 0.34, rx: w * 0.10, ry: h * 0.16 },
      { cx: w * 0.50, y: h * 0.29, rx: w * 0.14, ry: h * 0.22 },
      { cx: w * 0.76, y: h * 0.34, rx: w * 0.10, ry: h * 0.16 }
    ];
    for (let d = 0; d < domes.length; d++) {
      const dm = domes[d];
      ctx.fillStyle = PALETTE.porphyryCrimson;
      fillEllipse(ctx, dm.cx, dm.y, dm.rx, dm.ry);
      ctx.strokeStyle = hexToRgba(PALETTE.vellumOchre, 0.55);
      ctx.lineWidth = 1.4;
      for (let m = -2; m <= 2; m++) {
        ctx.beginPath();
        ctx.moveTo(dm.cx, dm.y - dm.ry);
        ctx.quadraticCurveTo(dm.cx + m * dm.rx * 0.42, dm.y - dm.ry * 0.2, dm.cx + m * dm.rx * 0.32, dm.y);
        ctx.stroke();
      }
      ctx.strokeStyle = PALETTE.vellumOchre;
      ctx.beginPath();
      ctx.moveTo(dm.cx, dm.y - dm.ry - h * 0.045);
      ctx.lineTo(dm.cx, dm.y - dm.ry);
      ctx.stroke();
    }

    // Palace entablature & 6 tiled fountain courtyards
    ctx.fillStyle = '#5c1628';
    ctx.fillRect(w * 0.06, h * 0.33, w * 0.88, h * 0.36);
    const padX = w * 0.08;
    const bayW = (w * 0.84) / 6;
    for (let c = 0; c < 6; c++) {
      const bx = padX + c * bayW + bayW * 0.08;
      const bw = bayW * 0.84;
      const by = h * 0.38;
      const bh = h * 0.28;
      drawPointedArchPath(ctx, bx, by, bw, bh, 0.35);
      ctx.fillStyle = PALETTE.basaltSlate;
      ctx.fill();
      ctx.strokeStyle = PALETTE.vellumOchre;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      // Turquoise & ochre glazed courtyard tiles + fountain jet
      ctx.fillStyle = c % 2 === 0 ? PALETTE.magnoliaTurquoise : '#196f7b';
      ctx.fillRect(bx + 3, by + bh * 0.72, bw - 6, bh * 0.28);
      const fx = bx + bw * 0.5;
      const fy = by + bh * 0.78;
      const jetH = bh * (0.28 + Math.sin(t * 2.4 + c) * 0.03);
      ctx.strokeStyle = PALETTE.lagoonCyan;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx, fy - jetH);
      ctx.stroke();
      ctx.fillStyle = PALETTE.magnoliaIvory;
      fillEllipse(ctx, fx, fy, bw * 0.22, 4);
    }

    // Central frescoed hall shut off by iron bars
    const hx = w * 0.35;
    const hw = w * 0.30;
    const hy = h * 0.42;
    const hh = h * 0.29;
    ctx.fillStyle = '#a34842';
    ctx.fillRect(hx, hy, hw, hh);
    ctx.fillStyle = hexToRgba(PALETTE.vellumOchre, 0.68);
    ctx.fillRect(hx + 8, hy + 8, hw - 16, hh * 0.52);
    ctx.fillStyle = hexToRgba(PALETTE.magnoliaTurquoise, 0.45);
    fillEllipse(ctx, w * 0.5, hy + hh * 0.36, hw * 0.22, hh * 0.18);
    ctx.strokeStyle = PALETTE.basaltBlack;
    ctx.lineWidth = 2.6;
    for (let b = 0; b < 11; b++) {
      const ix = hx + (hw * (b + 0.5)) / 11;
      ctx.beginPath();
      ctx.moveTo(ix, hy);
      ctx.lineTo(ix, hy + hh);
      ctx.stroke();
    }
    ctx.fillRect(hx, hy + hh * 0.48, hw, 3);

    // 9 crimson porphyry steps ascending to the barred hall
    for (let s = 0; s < 9; s++) {
      const ratio = s / 9;
      const sw = w * (0.34 + ratio * 0.54);
      const sy = h * 0.71 + s * (h * 0.031);
      ctx.fillStyle = s % 2 === 0 ? PALETTE.porphyryCrimson : PALETTE.porphyryRose;
      ctx.fillRect((w - sw) * 0.5, sy, sw, h * 0.032);
      ctx.fillStyle = hexToRgba(PALETTE.magnoliaIvory, 0.32);
      ctx.fillRect((w - sw) * 0.5, sy, sw, 1.5);
    }
  }

  function drawVellumLibrary(ctx, w, h, t) {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, PALETTE.basaltBlack);
    bg.addColorStop(0.55, PALETTE.basaltSlate);
    bg.addColorStop(1, '#261d14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // 4 tiers of shelves bowing under heavy vellum bindings (left & right wings)
    for (let side = 0; side < 2; side++) {
      const sx = side === 0 ? w * 0.05 : w * 0.67;
      const sw = w * 0.28;
      ctx.fillStyle = '#1f1712';
      ctx.fillRect(sx, h * 0.12, sw, h * 0.78);
      for (let tier = 0; tier < 4; tier++) {
        const ty = h * (0.24 + tier * 0.17);
        const sag = h * 0.022;
        for (let b = 0; b < 14; b++) {
          const bx = sx + 6 + (b * (sw - 12)) / 14;
          const bh = h * (0.09 + ((b * 3 + tier) % 4) * 0.012);
          const curveDrop = Math.sin(((b + 0.5) / 14) * Math.PI) * sag;
          ctx.fillStyle = b % 3 === 0 ? PALETTE.vellumOchre : b % 3 === 1 ? PALETTE.papyrusAmber : PALETTE.porphyryCrimson;
          ctx.fillRect(bx, ty - bh + curveDrop, (sw - 20) / 15, bh);
        }
        ctx.strokeStyle = PALETTE.vellumOchre;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(sx, ty);
        ctx.quadraticCurveTo(sx + sw * 0.5, ty + sag * 1.6, sx + sw, ty);
        ctx.stroke();
      }
    }

    // 3 elevated catwalk bridges & stepped masonry stairs across atrium
    for (let br = 0; br < 3; br++) {
      const by = h * (0.27 + br * 0.21);
      ctx.strokeStyle = PALETTE.vellumOchre;
      ctx.lineWidth = 2;
      ctx.fillStyle = '#2d241b';
      ctx.fillRect(w * 0.29, by, w * 0.42, h * 0.032);
      ctx.strokeRect(w * 0.29, by - h * 0.025, w * 0.42, h * 0.025);
      // Connecting diagonal stair flight
      ctx.strokeStyle = hexToRgba(PALETTE.papyrusAmber, 0.55);
      ctx.beginPath();
      ctx.moveTo(br % 2 === 0 ? w * 0.33 : w * 0.67, by + h * 0.032);
      ctx.lineTo(br % 2 === 0 ? w * 0.55 : w * 0.45, by + h * 0.18);
      ctx.stroke();
    }

    // 12 vanished alphabet cartouches winding across bridges & frieze
    for (let a = 0; a < 12; a++) {
      const row = (a / 4) | 0;
      const col = a % 4;
      const cx = w * (0.325 + col * 0.115);
      const cy = h * (0.27 + row * 0.21) - h * 0.012;
      const pulse = 0.72 + Math.sin(t * 1.5 + a * 0.8) * 0.18;
      ctx.fillStyle = hexToRgba(PALETTE.basaltBlack, 0.88);
      ctx.fillRect(cx - 10, cy - 7, 20, 14);
      ctx.strokeStyle = hexToRgba(PALETTE.papyrusAmber, pulse);
      ctx.lineWidth = 1.3;
      ctx.strokeRect(cx - 10, cy - 7, 20, 14);
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy - 3 + (a % 3));
      ctx.lineTo(cx + 4, cy - 2);
      ctx.lineTo(cx - 2, cy + 4);
      ctx.moveTo(cx + 5, cy + 3);
      ctx.arc(cx + 1, cy, 2.5, 0, Math.PI * 1.4);
      ctx.stroke();
    }

    // Unoccupied scholar lectern at bottom center
    ctx.fillStyle = PALETTE.vellumOchre;
    ctx.fillRect(w * 0.47, h * 0.81, w * 0.06, h * 0.11);
    ctx.fillStyle = PALETTE.magnoliaIvory;
    ctx.fillRect(w * 0.445, h * 0.785, w * 0.11, h * 0.028);
  }

  function drawSultanStables(ctx, w, h, t) {
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, PALETTE.basaltBlack);
    bg.addColorStop(0.6, PALETTE.basaltSlate);
    bg.addColorStop(1, '#2b161d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Herringbone masonry stable floor
    ctx.fillStyle = '#21191d';
    ctx.fillRect(0, h * 0.73, w, h * 0.27);
    ctx.strokeStyle = hexToRgba(PALETTE.vellumOchre, 0.18);
    for (let f = 0; f < 12; f++) {
      ctx.beginPath();
      ctx.moveTo((w * f) / 12, h * 0.73);
      ctx.lineTo(w * 0.5 + ((f - 6) * w) / 8, h);
      ctx.stroke();
    }

    // 6 vaulted masonry horse-stalls with suspended saddles, stirrups & bridles
    const padX = w * 0.05;
    const stallW = (w * 0.90) / 6;
    for (let s = 0; s < 6; s++) {
      const x = padX + s * stallW + stallW * 0.05;
      const bw = stallW * 0.90;
      const y = h * 0.20;
      const bh = h * 0.54;
      drawPointedArchPath(ctx, x, y, bw, bh, 0.32);
      ctx.fillStyle = '#151923';
      ctx.fill();
      ctx.strokeStyle = PALETTE.papyrusAmber;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Groin-vault ribs & timber stall rail
      ctx.strokeStyle = hexToRgba(PALETTE.porphyryRose, 0.45);
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(x, y + bh * 0.32);
      ctx.lineTo(x + bw, y + bh * 0.65);
      ctx.moveTo(x + bw, y + bh * 0.32);
      ctx.lineTo(x, y + bh * 0.65);
      ctx.stroke();
      ctx.fillStyle = '#3c241b';
      ctx.fillRect(x + 4, y + bh * 0.72, bw - 8, h * 0.14);

      // Suspended tooled crimson leather saddle + stirrups + bridle
      const cx = x + bw * 0.5;
      const sway = Math.sin(t * 1.2 + s * 0.9) * 1.6;
      const sy = y + bh * 0.58;
      ctx.strokeStyle = PALETTE.vellumOchre;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cx, y + bh * 0.12);
      ctx.lineTo(cx + sway, sy);
      ctx.stroke();
      // Tooled saddle seat, pommel & cantle
      ctx.fillStyle = PALETTE.porphyryCrimson;
      fillEllipse(ctx, cx + sway, sy + 4, bw * 0.26, h * 0.036);
      ctx.strokeStyle = PALETTE.vellumOchre;
      ctx.strokeRect(cx + sway - bw * 0.16, sy - 2, bw * 0.32, h * 0.025);
      // Hanging stirrup straps & silver-ivory stirrup irons
      for (let st = -1; st <= 1; st += 2) {
        const stX = cx + sway + st * bw * 0.15;
        ctx.strokeStyle = PALETTE.papyrusAmber;
        ctx.beginPath();
        ctx.moveTo(stX, sy + 8);
        ctx.lineTo(stX, sy + bh * 0.27);
        ctx.stroke();
        ctx.strokeStyle = PALETTE.magnoliaIvory;
        ctx.strokeRect(stX - 4, sy + bh * 0.27, 8, 7);
      }
    }
  }

  function drawCemeteryTombs(ctx, w, h, t) {
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.68);
    sky.addColorStop(0, PALETTE.basaltBlack);
    sky.addColorStop(0.6, '#13242e');
    sky.addColorStop(1, PALETTE.basaltSlate);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Pale funerary moon disc
    ctx.fillStyle = hexToRgba(PALETTE.magnoliaIvory, 0.14);
    fillEllipse(ctx, w * 0.5, h * 0.22, Math.min(w, h) * 0.11, Math.min(w, h) * 0.11);

    // Necropolis stone avenue
    ctx.fillStyle = '#121720';
    ctx.fillRect(0, h * 0.64, w, h * 0.36);
    ctx.fillStyle = '#1b2430';
    ctx.beginPath();
    ctx.moveTo(w * 0.40, h * 0.64);
    ctx.lineTo(w * 0.60, h * 0.64);
    ctx.lineTo(w * 0.82, h);
    ctx.lineTo(w * 0.18, h);
    ctx.closePath();
    ctx.fill();

    // 8 solemn dark cypresses flanking the avenue
    for (let c = 0; c < 8; c++) {
      const side = c < 4 ? -1 : 1;
      const idx = c % 4;
      const cx = w * 0.5 + side * w * (0.14 + idx * 0.095);
      const base = h * (0.65 + idx * 0.055);
      const ch = h * (0.34 + idx * 0.05);
      const cw = w * (0.026 + idx * 0.006);
      const tipShift = Math.sin(t * 0.7 + c) * 1.5;
      ctx.fillStyle = '#241a15';
      ctx.fillRect(cx - 2.5, base - 10, 5, 14);
      ctx.fillStyle = idx % 2 === 0 ? '#0b1d21' : '#112a30';
      ctx.beginPath();
      ctx.moveTo(cx - cw, base - 8);
      ctx.quadraticCurveTo(cx - cw * 0.85, base - ch * 0.65, cx + tipShift, base - ch);
      ctx.quadraticCurveTo(cx + cw * 0.85, base - ch * 0.65, cx + cw, base - 8);
      ctx.closePath();
      ctx.fill();
    }

    // 7 carved marble sarcophagi and fluted sepulchers
    const tombs = [
      { x: w * 0.50, y: h * 0.63, tw: w * 0.13, th: h * 0.13 },
      { x: w * 0.30, y: h * 0.71, tw: w * 0.12, th: h * 0.09 },
      { x: w * 0.70, y: h * 0.71, tw: w * 0.12, th: h * 0.09 },
      { x: w * 0.21, y: h * 0.80, tw: w * 0.14, th: h * 0.10 },
      { x: w * 0.79, y: h * 0.80, tw: w * 0.14, th: h * 0.10 },
      { x: w * 0.13, y: h * 0.90, tw: w * 0.15, th: h * 0.10 },
      { x: w * 0.87, y: h * 0.90, tw: w * 0.15, th: h * 0.10 }
    ];
    for (let i = 0; i < tombs.length; i++) {
      const tb = tombs[i];
      const lx = tb.x - tb.tw * 0.5;
      const ly = tb.y - tb.th;
      ctx.fillStyle = PALETTE.magnoliaIvory;
      ctx.fillRect(lx, ly, tb.tw, tb.th);
      // Classical pedimented lid
      ctx.fillStyle = '#dfd7c8';
      ctx.beginPath();
      ctx.moveTo(lx - 5, ly);
      ctx.lineTo(tb.x, ly - tb.th * 0.36);
      ctx.lineTo(lx + tb.tw + 5, ly);
      ctx.closePath();
      ctx.fill();
      // Fluted marble pilasters & cool turquoise shadow relief
      ctx.strokeStyle = hexToRgba(PALETTE.magnoliaTurquoise, 0.45);
      ctx.lineWidth = 1.2;
      for (let fl = 1; fl <= 4; fl++) {
        const fx = lx + (tb.tw * fl) / 5;
        ctx.beginPath();
        ctx.moveTo(fx, ly + 4);
        ctx.lineTo(fx, tb.y - 4);
        ctx.stroke();
      }
    }
  }


  function drawCitadelPinnacle(ctx, w, h, t) {
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, PALETTE.basaltBlack);
    sky.addColorStop(0.50, PALETTE.basaltSlate);
    sky.addColorStop(0.82, '#3d3023');
    sky.addColorStop(1, '#684d2c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Dry high-altitude wind striae across empty inland sky (no sea exists)
    ctx.strokeStyle = hexToRgba(PALETTE.papyrusAmber, 0.14);
    ctx.lineWidth = 1;
    for (let wv = 0; wv < 5; wv++) {
      const wy = h * (0.14 + wv * 0.08);
      const drift = Math.sin(t * 0.5 + wv) * 8;
      ctx.beginPath();
      ctx.moveTo(w * 0.12 + drift, wy);
      ctx.lineTo(w * 0.88 + drift, wy);
      ctx.stroke();
    }

    // 5 sheer inland mountain crags crowning dry canyons
    const crags = [
      { px: w * 0.12, py: h * 0.54, bw: w * 0.28, shade: '#161b25' },
      { px: w * 0.88, py: h * 0.52, bw: w * 0.28, shade: '#171c27' },
      { px: w * 0.29, py: h * 0.43, bw: w * 0.30, shade: '#1e2431' },
      { px: w * 0.72, py: h * 0.44, bw: w * 0.30, shade: '#1d222f' },
      { px: w * 0.50, py: h * 0.28, bw: w * 0.36, shade: PALETTE.basaltBlack }
    ];
    for (let i = 0; i < crags.length; i++) {
      const cr = crags[i];
      ctx.fillStyle = cr.shade;
      ctx.beginPath();
      ctx.moveTo(cr.px - cr.bw, h);
      ctx.lineTo(cr.px - cr.bw * 0.32, cr.py + h * 0.14);
      ctx.lineTo(cr.px, cr.py);
      ctx.lineTo(cr.px + cr.bw * 0.35, cr.py + h * 0.16);
      ctx.lineTo(cr.px + cr.bw, h);
      ctx.closePath();
      ctx.fill();
      // Sun-bleached dry ochre ridge facet
      ctx.strokeStyle = hexToRgba(PALETTE.vellumOchre, 0.42);
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cr.px, cr.py);
      ctx.lineTo(cr.px + cr.bw * 0.18, h);
      ctx.stroke();
    }

    // Citadel stone bastion, crenellations & highest watchtower spire
    const cx = w * 0.50;
    const topY = h * 0.28;
    ctx.fillStyle = '#cfc3ae';
    ctx.fillRect(cx - w * 0.055, topY - h * 0.08, w * 0.11, h * 0.09);
    for (let m = 0; m < 4; m++) {
      ctx.fillRect(cx - w * 0.055 + m * (w * 0.031), topY - h * 0.095, w * 0.018, h * 0.016);
    }
    ctx.fillStyle = PALETTE.magnoliaIvory;
    ctx.fillRect(cx - w * 0.022, topY - h * 0.17, w * 0.044, h * 0.09);
    ctx.fillStyle = PALETTE.porphyryCrimson;
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.028, topY - h * 0.17);
    ctx.lineTo(cx, topY - h * 0.235);
    ctx.lineTo(cx + w * 0.028, topY - h * 0.17);
    ctx.closePath();
    ctx.fill();
  }

  function drawRefractionVeil(ctx, w, h, ref, sig) {
    if (ref <= 0.005) return;
    ctx.save();
    const splitX = w * (1 - ref * 0.5);
    ctx.strokeStyle = hexToRgba(PALETTE.lagoonCyan, 0.22 + ref * 0.45);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(splitX, 0);
    ctx.lineTo(w - splitX, h);
    ctx.stroke();
    ctx.strokeStyle = hexToRgba(sig.palette.trim, 0.18 + ref * 0.35);
    ctx.strokeRect(w * 0.05, h * 0.05, w * 0.90, h * 0.90);
    ctx.restore();
  }

  const SCENE_ZONES = {
    magnolia_lagoon: [
      { yMax: 0.47, xMin: 0, xMax: 1, zone: 'magnolia_boughs', label: 'Nine Magnolia Boughs & Clipped Terrace Hedges' },
      { yMax: 1.00, xMin: 0.34, xMax: 0.66, zone: 'bathing_stair', label: 'Ivory Marble Bathing Steps (Expected Bathers)' },
      { yMax: 1.00, xMin: 0, xMax: 1, zone: 'lagoon_pools', label: 'Three Turquoise Lagoon Pools Mirroring Blossoms' }
    ],
    porphyry_palace: [
      { yMax: 0.36, xMin: 0, xMax: 1, zone: 'porphyry_domes', label: 'Highest Porphyry Domes & Gilded Finials' },
      { yMax: 0.71, xMin: 0.35, xMax: 0.65, zone: 'frescoed_hall_bars', label: 'Iron-Barred Central Hall Before Frescoed Walls' },
      { yMax: 0.71, xMin: 0, xMax: 1, zone: 'fountain_courtyards', label: 'Six Glazed Tile Courtyards with Marble Fountains' },
      { yMax: 1.00, xMin: 0, xMax: 1, zone: 'porphyry_steps', label: 'Crimson Porphyry Steps of Imperial Ascent' }
    ],
    vellum_library: [
      { yMax: 0.76, xMin: 0.29, xMax: 0.71, zone: 'alphabet_bridges', label: 'Catwalk Bridges of Twelve Vanished Alphabets' },
      { yMax: 1.00, xMin: 0.42, xMax: 0.58, zone: 'scholar_lectern', label: 'Silent Reading Lectern Awaiting the Philosopher' },
      { yMax: 1.00, xMin: 0, xMax: 1, zone: 'vellum_shelves', label: 'Bowing Timber Shelves of Vellum Papyri' }
    ],
    sultan_stables: [
      { yMax: 0.48, xMin: 0, xMax: 1, zone: 'vaulted_stalls', label: 'Six Groin-Vaulted Masonry Horse-Stalls' },
      { yMax: 0.76, xMin: 0, xMax: 1, zone: 'suspended_saddles', label: 'Tooled Leather Saddles, Silver Stirrups & Bridles' },
      { yMax: 1.00, xMin: 0, xMax: 1, zone: 'stable_paving', label: 'Herringbone Masonry Royal Stable Aisle' }
    ],
    cemetery_tombs: [
      { yMax: 0.62, xMin: 0, xMax: 1, zone: 'cypress_avenue', label: 'Solemn Colonnade of Eight Dark Cypresses' },
      { yMax: 1.00, xMin: 0, xMax: 1, zone: 'marble_sarcophagi', label: 'Seven Carved Ivory Marble Tombs & Sepulchers' }
    ],
    citadel_pinnacle: [
      { yMax: 0.32, xMin: 0.36, xMax: 0.64, zone: 'citadel_spire', label: 'Highest Dry Stone Citadel Pinnacle & Watch Turret' },
      { yMax: 1.00, xMin: 0, xMax: 1, zone: 'inland_crags', label: 'Five Arid Inland Mountain Crags Far From Any Sea' }
    ]
  };

  function hitTestScene(x, y, w, h, locusId) {
    const sig = resolveSignifier(locusId);
    if (!(w > 0 && h > 0) || x < 0 || y < 0 || x > w || y > h) {
      return { hit: false, locusId: sig.id, zone: 'outside', label: '' };
    }
    const nx = x / w;
    const ny = y / h;
    if (ny < 0.06) {
      return { hit: false, locusId: sig.id, zone: 'sky_margin', label: '' };
    }
    const list = SCENE_ZONES[sig.id] || SCENE_ZONES.magnolia_lagoon;
    for (let i = 0; i < list.length; i++) {
      const z = list[i];
      if (ny <= z.yMax && nx >= z.xMin && nx <= z.xMax) {
        return { hit: true, locusId: sig.id, zone: z.zone, label: z.label };
      }
    }
    return { hit: true, locusId: sig.id, zone: 'elevation', label: sig.surfaceTitle };
  }

  function renderLocusMedallion(ctx, x, y, r, locusId, isSelected, isUnsealed) {
    if (!ctx || !(r > 0)) return;
    const sig = resolveSignifier(locusId);
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? PALETTE.basaltSlate : PALETTE.basaltBlack;
    ctx.fill();
    ctx.lineWidth = isSelected ? 2.4 : 1.4;
    ctx.strokeStyle = isSelected ? PALETTE.lagoonCyan : isUnsealed ? PALETTE.porphyryRose : PALETTE.vellumOchre;
    ctx.stroke();

    if (isUnsealed) {
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.84, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.strokeStyle = PALETTE.lagoonCyan;
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }

    const s = r * 0.52;
    ctx.strokeStyle = PALETTE.magnoliaIvory;
    ctx.fillStyle = sig.palette.primary;
    ctx.lineWidth = 1.4;
    if (sig.id === 'magnolia_lagoon') {
      drawMagnoliaBlossom(ctx, 0, -s * 0.18, s * 0.55, 0.95);
      ctx.beginPath();
      ctx.moveTo(-s, s * 0.55);
      ctx.lineTo(s, s * 0.55);
      ctx.stroke();
    } else if (sig.id === 'porphyry_palace') {
      fillEllipse(ctx, 0, -s * 0.15, s * 0.65, s * 0.55);
      ctx.strokeRect(-s * 0.7, -s * 0.1, s * 1.4, s * 0.85);
    } else if (sig.id === 'vellum_library') {
      ctx.strokeRect(-s * 0.75, -s * 0.55, s * 1.5, s * 1.1);
      ctx.beginPath();
      ctx.moveTo(-s * 0.75, 0);
      ctx.lineTo(s * 0.75, 0);
      ctx.stroke();
    } else if (sig.id === 'sultan_stables') {
      drawPointedArchPath(ctx, -s * 0.65, -s * 0.65, s * 1.3, s * 1.3, 0.4);
      ctx.stroke();
      fillEllipse(ctx, 0, s * 0.05, s * 0.38, s * 0.2);
    } else if (sig.id === 'cemetery_tombs') {
      ctx.fillStyle = PALETTE.magnoliaIvory;
      ctx.fillRect(-s * 0.55, -s * 0.05, s * 1.1, s * 0.65);
      ctx.beginPath();
      ctx.moveTo(-s * 0.68, -s * 0.05);
      ctx.lineTo(0, -s * 0.55);
      ctx.lineTo(s * 0.68, -s * 0.05);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(-s * 0.8, s * 0.7);
      ctx.lineTo(0, -s * 0.85);
      ctx.lineTo(s * 0.8, s * 0.7);
      ctx.closePath();
      ctx.stroke();
    }
    ctx.restore();
  }

  function renderSurfaceScene(ctx, w, h, opts) {
    if (!ctx || !(w > 0 && h > 0)) return;
    const o = opts || {};
    const sig = resolveSignifier(o.locusId);
    const t = o.reducedMotion ? 0 : Number(o.time) || 0;
    const ref = clamp(Number(o.refraction) || 0, 0, 1);

    ctx.save();
    if (sig.id === 'magnolia_lagoon') drawMagnoliaLagoon(ctx, w, h, t);
    else if (sig.id === 'porphyry_palace') drawPorphyryPalace(ctx, w, h, t);
    else if (sig.id === 'vellum_library') drawVellumLibrary(ctx, w, h, t);
    else if (sig.id === 'sultan_stables') drawSultanStables(ctx, w, h, t);
    else if (sig.id === 'cemetery_tombs') drawCemeteryTombs(ctx, w, h, t);
    else drawCitadelPinnacle(ctx, w, h, t);

    drawSurveyorGrid(ctx, w, h, sig.palette.trim);
    drawRefractionVeil(ctx, w, h, ref, sig);
    ctx.restore();
  }

  function getSignifiers() {
    return SURFACE_SIGNIFIERS.slice();
  }

  function getSignifierById(locusId) {
    return resolveSignifier(locusId);
  }

  function createSurfaceRenderer() {
    return {
      LOCI_ORDER: LOCI_ORDER,
      SURFACE_SIGNIFIERS: SURFACE_SIGNIFIERS,
      PALETTE: PALETTE,
      getSignifiers: getSignifiers,
      getSignifierById: getSignifierById,
      renderSurfaceScene: renderSurfaceScene,
      renderLocusMedallion: renderLocusMedallion,
      hitTestScene: hitTestScene
    };
  }

  const exportedApi = Object.freeze({
    LOCI_ORDER: LOCI_ORDER,
    SURFACE_SIGNIFIERS: SURFACE_SIGNIFIERS,
    PALETTE: PALETTE,
    getSignifiers: getSignifiers,
    getSignifierById: getSignifierById,
    renderSurfaceScene: renderSurfaceScene,
    renderLocusMedallion: renderLocusMedallion,
    hitTestScene: hitTestScene,
    createSurfaceRenderer: createSurfaceRenderer
  });

  root.HypatiaSurfaceExpectations = exportedApi;
  if (typeof window !== 'undefined') {
    window.HypatiaSurfaceExpectations = exportedApi;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
