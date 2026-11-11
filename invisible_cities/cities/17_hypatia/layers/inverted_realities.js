/* City 17: Hypatia (Cities & Signs 4) — Layer: Inverted Realities of Things */
(function (root) {
  'use strict';

  const PALETTE = Object.freeze({
    magnolia_turquoise: '#1f9aa8',
    lagoon_cyan: '#58d3dc',
    magnolia_ivory: '#f4ede0',
    porphyry_crimson: '#842038',
    porphyry_rose: '#b8435e',
    basalt_black: '#0e1117',
    basalt_slate: '#1b202c',
    vellum_ochre: '#d4a853',
    papyrus_amber: '#ebd099'
  });

  const LOCI_ORDER = Object.freeze([
    'magnolia_lagoon',
    'porphyry_palace',
    'vellum_library',
    'sultan_stables',
    'cemetery_tombs',
    'citadel_pinnacle'
  ]);

  const INVERTED_THINGS = Object.freeze([
    Object.freeze({
      id: 'magnolia_lagoon',
      index: 0,
      key: '1',
      invertedTitle: 'Lagoon Floor of Weighted Suicides',
      invertedReality: 'At the bottom of the blue water lie drowned suicides with basalt stones tied to their ankles while reef crabs bite their eyes.',
      rewiredRule: 'Magnolia lagoon -> Abyssal floor of stone-weighted suicides',
      epigramFragment: 'Beneath reflected white blossoms, knotted ropes bind pale ankles to black basalt on the silt floor.',
      inversionMetrics: Object.freeze({
        crabCount: 8,
        weightedSuicides: 3,
        stonesTiedToAnkles: true
      })
    }),
    Object.freeze({
      id: 'porphyry_palace',
      index: 1,
      key: '2',
      invertedTitle: 'Subterranean Basalt Chain-Quarry',
      invertedReality: 'Behind the hall\u2019s iron bars yawns an underground quarry across six tiled fountain courtyards where convicts in black iron chains hoist massive angular blocks of black basalt.',
      rewiredRule: 'Porphyry palace & frescoes -> Subterranean basalt convict quarry',
      epigramFragment: 'Past porphyry domes and iron bars, black chains haul cut basalt up from the pit.',
      inversionMetrics: Object.freeze({
        chainedConvicts: 5,
        basaltBlocks: 6,
        fountainCourtyards: 6,
        undergroundQuarry: true
      })
    }),
    Object.freeze({
      id: 'vellum_library',
      index: 2,
      key: '3',
      invertedTitle: 'Opium Pipe & Ninepins on the Lawn',
      invertedReality: 'In the remotest papyrus cabinet, a dull-eyed adolescent lying on a mat with an opium pipe points out the window to a children\u2019s swing-garden where the philosopher sits on the lawn throwing wooden ninepins.',
      rewiredRule: 'Vellum library -> Opium haze pointing to ninepins in the children\u2019s garden',
      epigramFragment: 'A pipe-hazed finger points past vellum scrolls to the sage bowling nine wooden skittles beneath two swings.',
      inversionMetrics: Object.freeze({
        opiumYouthPointing: true,
        woodenNinepins: 9,
        gardenSwings: 2
      })
    }),
    Object.freeze({
      id: 'sultan_stables',
      index: 3,
      key: '4',
      invertedTitle: 'Amorous Frenzy Upon the Saddles',
      invertedReality: 'Beneath the stable vaults, beautiful women with unbound hair and bare legs in riding breeches mount leather saddles set on wooden trestles with amorous frenzy.',
      rewiredRule: 'Sultan\u2019s stables -> Women in riding breeches mounting saddles in amorous frenzy',
      epigramFragment: 'Under stirrup-hung porphyry vaults, unbound hair sweeps stitched leather astride bare wooden trestles.',
      inversionMetrics: Object.freeze({
        womenInRidingBreeches: 4,
        saddleTrestles: 4,
        amorousFrenzy: true
      })
    }),
    Object.freeze({
      id: 'cemetery_tombs',
      index: 4,
      key: '5',
      invertedTitle: 'Hidden Flutes & Harps in the Sepulchers',
      invertedReality: 'Musicians hide inside the carved marble tombs, and from grave to grave flutes respond to the trills of harps with sweet living melodies.',
      rewiredRule: 'Cemetery tombs -> Sweet flute & harp concerts echoing grave to grave',
      epigramFragment: 'Inside marble sepulchers, silver reed-breath answers golden harp strings from grave to grave.',
      inversionMetrics: Object.freeze({
        fluteMusicians: 3,
        harpMusicians: 3,
        graveToGraveMelodies: true
      })
    }),
    Object.freeze({
      id: 'citadel_pinnacle',
      index: 5,
      key: '6',
      invertedTitle: 'Sky-Ship Vigil Where No Sea Exists',
      invertedReality: 'At the very top of the dry crag citadel where no sea exists, waiting for a sailing ship to pass overhead and bear the traveler away.',
      rewiredRule: 'Dry citadel pinnacle -> Embarkation dock for the sky-ship where no sea exists',
      epigramFragment: 'Signs form a language, but not the one you think you know.',
      inversionMetrics: Object.freeze({
        seaExists: false,
        waitingForShipAtTop: true
      })
    })
  ]);

  const BY_ID = Object.create(null);
  for (let i = 0; i < INVERTED_THINGS.length; i++) {
    BY_ID[INVERTED_THINGS[i].id] = INVERTED_THINGS[i];
  }

  function clamp(v, lo, hi) {
    const n = Number(v);
    if (!Number.isFinite(n)) return lo;
    return n < lo ? lo : (n > hi ? hi : n);
  }

  function resolveLocusId(idOrIndex, fallback) {
    if (typeof idOrIndex === 'string') {
      if (BY_ID[idOrIndex]) return idOrIndex;
      const trimmed = idOrIndex.trim();
      for (let i = 0; i < INVERTED_THINGS.length; i++) {
        if (INVERTED_THINGS[i].key === trimmed) return INVERTED_THINGS[i].id;
      }
    } else if (typeof idOrIndex === 'number' && Number.isFinite(idOrIndex)) {
      const idx = Math.trunc(idOrIndex);
      if (idx >= 0 && idx < INVERTED_THINGS.length) return INVERTED_THINGS[idx].id;
    }
    return fallback || LOCI_ORDER[0];
  }

  function getInversionById(idOrIndex) {
    if (idOrIndex === null || idOrIndex === undefined) return null;
    const resolved = resolveLocusId(idOrIndex, '');
    return BY_ID[resolved] || null;
  }

  function drawEllipse(ctx, cx, cy, rx, ry, rot) {
    if (typeof ctx.ellipse === 'function') {
      ctx.ellipse(cx, cy, Math.max(0.5, rx), Math.max(0.5, ry), rot || 0, 0, Math.PI * 2);
      return;
    }
    ctx.save();
    ctx.translate(cx, cy);
    if (rot) ctx.rotate(rot);
    ctx.scale(Math.max(0.5, rx), Math.max(0.5, ry));
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.restore();
  }

  function drawIronChain(ctx, x1, y1, x2, y2, links, color) {
    ctx.save();
    ctx.strokeStyle = color || '#080a0e';
    ctx.lineWidth = 2.1;
    const count = Math.max(4, links || 10);
    for (let i = 0; i <= count; i++) {
      const u = i / count;
      const lx = x1 + (x2 - x1) * u;
      const ly = y1 + (y2 - y1) * u;
      const ang = Math.atan2(y2 - y1, x2 - x1) + (i % 2 === 0 ? 0 : 0.45);
      ctx.beginPath();
      drawEllipse(ctx, lx, ly, 4.2, 2.3, ang);
      ctx.stroke();
    }
    ctx.restore();
  }

  function paintMagnoliaLagoon(ctx, w, h, env) {
    const t = env.phase;
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#1c7e8c');
    bg.addColorStop(0.42, '#0f3c49');
    bg.addColorStop(0.82, '#0a1c26');
    bg.addColorStop(1, PALETTE.basalt_black);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Overhead water surface ripples & ghostly floating white magnolia petals
    for (let i = 0; i < 7; i++) {
      const mx = w * (0.1 + i * 0.13) + Math.sin(t * 0.8 + i) * 12;
      const my = h * (0.06 + (i % 2) * 0.035);
      ctx.fillStyle = 'rgba(244, 237, 224, 0.26)';
      for (let p = 0; p < 5; p++) {
        ctx.beginPath();
        drawEllipse(ctx, mx + Math.cos(p * 1.25) * 9, my + Math.sin(p * 1.25) * 4, 8, 3.5, p * 0.6);
        ctx.fill();
      }
      // Caustic turquoise light shafts
      const shaft = ctx.createLinearGradient(mx, my, mx + (i - 3) * 18, h * 0.86);
      shaft.addColorStop(0, 'rgba(88, 211, 220, 0.20)');
      shaft.addColorStop(1, 'rgba(31, 154, 168, 0)');
      ctx.fillStyle = shaft;
      ctx.beginPath();
      ctx.moveTo(mx - 14, 0);
      ctx.lineTo(mx + 14, 0);
      ctx.lineTo(mx + 46, h * 0.88);
      ctx.lineTo(mx - 34, h * 0.88);
      ctx.closePath();
      ctx.fill();
    }

    // Abyssal silt floor
    ctx.fillStyle = '#0b141c';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.8);
    ctx.quadraticCurveTo(w * 0.35, h * 0.75, w * 0.68, h * 0.81);
    ctx.quadraticCurveTo(w * 0.86, h * 0.84, w, h * 0.79);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // 3 drowned suicides tethered by ankle ropes to heavy angular basalt stones
    const figures = [
      { x: w * 0.23, y: h * 0.62, stoneX: w * 0.19, stoneY: h * 0.86, tilt: -0.22 },
      { x: w * 0.52, y: h * 0.57, stoneX: w * 0.49, stoneY: h * 0.88, tilt: 0.16 },
      { x: w * 0.79, y: h * 0.64, stoneX: w * 0.82, stoneY: h * 0.87, tilt: -0.15 }
    ];
    for (let i = 0; i < figures.length; i++) {
      const f = figures[i];
      const sway = Math.sin(t * 1.1 + i * 2.1) * 6;
      const ankleX = f.x - Math.cos(f.tilt) * 34 + sway * 0.4;
      const ankleY = f.y + 34;
      const headX = f.x + Math.cos(f.tilt) * 38 + sway;
      const headY = f.y - 18 + Math.sin(t + i) * 3;

      // Basalt anchor stone on lagoon floor
      ctx.fillStyle = PALETTE.basalt_black;
      ctx.strokeStyle = '#365864';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(f.stoneX - 22, f.stoneY + 10);
      ctx.lineTo(f.stoneX - 16, f.stoneY - 14);
      ctx.lineTo(f.stoneX + 8, f.stoneY - 18);
      ctx.lineTo(f.stoneX + 24, f.stoneY - 3);
      ctx.lineTo(f.stoneX + 19, f.stoneY + 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Taut knotted ankle rope
      ctx.strokeStyle = PALETTE.vellum_ochre;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(f.stoneX, f.stoneY - 12);
      ctx.quadraticCurveTo((f.stoneX + ankleX) * 0.5 + 4, (f.stoneY + ankleY) * 0.5, ankleX, ankleY);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ankleX, ankleY, 4.2, 0, Math.PI * 2);
      ctx.stroke();

      // Drifting shrouded body & head
      ctx.fillStyle = 'rgba(224, 234, 232, 0.76)';
      ctx.beginPath();
      ctx.moveTo(ankleX, ankleY);
      ctx.quadraticCurveTo(f.x + sway * 0.6, f.y - 8, headX - 8, headY + 4);
      ctx.quadraticCurveTo(f.x + 12, f.y + 22, ankleX + 8, ankleY + 4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#c8dad8';
      ctx.beginPath();
      ctx.arc(headX, headY, 10.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 8 turquoise-lit & porphyry reef crabs clustering toward the sunken eyes
    const crabTargets = [
      [0, -4, -6], [0, 12, 5], [0, -18, 18],
      [1, -6, -5], [1, 13, 3], [1, 2, 20],
      [2, -5, -4], [2, 12, 6]
    ];
    for (let c = 0; c < 8; c++) {
      const ref = figures[crabTargets[c][0]];
      const scuttle = Math.sin(t * 2.7 + c * 1.4) * 3.5;
      const cx = ref.x + Math.cos(ref.tilt) * 38 + crabTargets[c][1] + scuttle;
      const cy = ref.y - 18 + crabTargets[c][2];
      ctx.strokeStyle = PALETTE.lagoon_cyan;
      ctx.lineWidth = 1.4;
      for (let leg = -2; leg <= 2; leg++) {
        if (leg === 0) continue;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + leg * 4.5, cy + (Math.abs(leg) % 2 === 0 ? 5 : -4));
        ctx.stroke();
      }
      ctx.fillStyle = c % 2 === 0 ? PALETTE.porphyry_rose : PALETTE.magnolia_turquoise;
      ctx.beginPath();
      drawEllipse(ctx, cx, cy, 6.2, 4.2, 0.15 * scuttle);
      ctx.fill();
      ctx.strokeStyle = PALETTE.magnolia_ivory;
      ctx.beginPath();
      ctx.arc(cx - 6, cy - 4, 2.4, 0.3, 2.7);
      ctx.moveTo(cx + 6, cy - 4);
      ctx.arc(cx + 6, cy - 4, 2.4, 0.4, 2.8);
      ctx.stroke();
    }
  }

  function paintPorphyryPalace(ctx, w, h, env) {
    const t = env.phase;
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#3a101d');
    bg.addColorStop(0.22, PALETTE.basalt_slate);
    bg.addColorStop(1, '#07090d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Upper porphyry cornice, 6 tiled fountain courtyard drains & iron hall bars
    ctx.fillStyle = PALETTE.porphyry_crimson;
    ctx.fillRect(0, 0, w, h * 0.16);
    for (let f = 0; f < 6; f++) {
      const fx = w * (0.1 + f * 0.16);
      ctx.fillStyle = PALETTE.magnolia_turquoise;
      ctx.fillRect(fx - 18, h * 0.04, 36, h * 0.06);
      ctx.strokeStyle = PALETTE.papyrus_amber;
      ctx.strokeRect(fx - 18, h * 0.04, 36, h * 0.06);
    }
    ctx.strokeStyle = '#090b10';
    ctx.lineWidth = 3.2;
    for (let b = 0; b < 14; b++) {
      const bx = (w / 13) * b;
      ctx.beginPath();
      ctx.moveTo(bx, 0);
      ctx.lineTo(bx, h * 0.21);
      ctx.stroke();
    }

    // Stepped subterranean quarry ledges + warm amber brazier glow
    const glow = ctx.createRadialGradient(w * 0.5, h * 0.65, 16, w * 0.5, h * 0.65, w * 0.52);
    glow.addColorStop(0, 'rgba(212, 168, 83, 0.28)');
    glow.addColorStop(1, 'rgba(14, 17, 23, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, h * 0.16, w, h * 0.84);

    ctx.fillStyle = '#141923';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.42);
    ctx.lineTo(w * 0.26, h * 0.54);
    ctx.lineTo(w * 0.34, h * 0.82);
    ctx.lineTo(w * 0.68, h * 0.82);
    ctx.lineTo(w * 0.76, h * 0.5);
    ctx.lineTo(w, h * 0.38);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Timber A-frame hoist & iron pulley wheels
    const px1 = w * 0.38, px2 = w * 0.64, pyTop = h * 0.25;
    ctx.strokeStyle = '#6c4d2f';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(px1 - 48, h * 0.82);
    ctx.lineTo(px1, pyTop);
    ctx.lineTo(px2, pyTop);
    ctx.lineTo(px2 + 48, h * 0.82);
    ctx.stroke();

    const hoistLift = Math.sin(t * 0.9) * 14;
    // 6 angular blocks of black basalt (2 hoisted in chains, 4 on quarry floor)
    const blocks = [
      { x: px1, y: h * 0.53 + hoistLift, w: 56, h: 42, slung: true },
      { x: px2, y: h * 0.6 - hoistLift, w: 60, h: 44, slung: true },
      { x: w * 0.16, y: h * 0.76, w: 52, h: 36, slung: false },
      { x: w * 0.44, y: h * 0.87, w: 58, h: 38, slung: false },
      { x: w * 0.56, y: h * 0.88, w: 54, h: 36, slung: false },
      { x: w * 0.84, y: h * 0.74, w: 56, h: 38, slung: false }
    ];
    for (let i = 0; i < blocks.length; i++) {
      const bl = blocks[i];
      if (bl.slung) {
        drawIronChain(ctx, bl.x, pyTop, bl.x, bl.y - bl.h * 0.5, 11, '#05070a');
      }
      ctx.fillStyle = PALETTE.basalt_black;
      ctx.strokeStyle = '#3b4659';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(bl.x - bl.w * 0.5, bl.y - bl.h * 0.35);
      ctx.lineTo(bl.x - bl.w * 0.32, bl.y - bl.h * 0.52);
      ctx.lineTo(bl.x + bl.w * 0.5, bl.y - bl.h * 0.42);
      ctx.lineTo(bl.x + bl.w * 0.46, bl.y + bl.h * 0.48);
      ctx.lineTo(bl.x - bl.w * 0.44, bl.y + bl.h * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // 5 convicts in black iron chains hauling hoist lines
    const convicts = [
      [w * 0.22, h * 0.52], [w * 0.3, h * 0.68], [w * 0.5, h * 0.76],
      [w * 0.71, h * 0.67], [w * 0.8, h * 0.5]
    ];
    for (let c = 0; c < convicts.length; c++) {
      const cx = convicts[c][0], cy = convicts[c][1];
      const lean = -0.35 + Math.sin(t * 1.4 + c) * 0.08;
      ctx.strokeStyle = PALETTE.papyrus_amber;
      ctx.lineWidth = 3.2;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy + 20);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + Math.sin(lean) * 18, cy - 18);
      ctx.stroke();
      ctx.fillStyle = PALETTE.vellum_ochre;
      ctx.beginPath();
      ctx.arc(cx + Math.sin(lean) * 20, cy - 25, 6.2, 0, Math.PI * 2);
      ctx.fill();
      const targetX = c < 2 ? px1 : px2;
      drawIronChain(ctx, cx + 4, cy - 10, targetX, pyTop + 10, 9, '#07080b');
      if (c > 0) {
        drawIronChain(ctx, convicts[c - 1][0], convicts[c - 1][1] + 18, cx - 6, cy + 18, 7, '#090b10');
      }
    }
  }

  function paintVellumLibrary(ctx, w, h, env) {
    const t = env.phase;
    ctx.fillStyle = '#19141d';
    ctx.fillRect(0, 0, w, h);

    // Left cabinet: shelves of rolled vellum papyri
    for (let row = 0; row < 5; row++) {
      const sy = h * (0.12 + row * 0.12);
      ctx.fillStyle = '#3b281c';
      ctx.fillRect(w * 0.03, sy, w * 0.37, 5);
      for (let s = 0; s < 8; s++) {
        ctx.fillStyle = s % 2 === 0 ? PALETTE.papyrus_amber : PALETTE.vellum_ochre;
        ctx.beginPath();
        ctx.arc(w * (0.055 + s * 0.043), sy - 7, 5.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Sunlit arched window onto the children's swing-garden lawn
    const wx = w * 0.46, wy = h * 0.1, ww = w * 0.48, wh = h * 0.76;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(wx, wy + wh);
    ctx.lineTo(wx, wy + ww * 0.36);
    ctx.quadraticCurveTo(wx + ww * 0.5, wy - ww * 0.12, wx + ww, wy + ww * 0.36);
    ctx.lineTo(wx + ww, wy + wh);
    ctx.closePath();
    ctx.clip();

    const sky = ctx.createLinearGradient(0, wy, 0, wy + wh);
    sky.addColorStop(0, '#7de0e6');
    sky.addColorStop(0.46, '#bfeef0');
    sky.addColorStop(0.47, '#2d7d6f');
    sky.addColorStop(1, '#1c534a');
    ctx.fillStyle = sky;
    ctx.fillRect(wx, wy, ww, wh);

    // 2 children's garden swings swaying from timber beam
    ctx.strokeStyle = '#5c3a24';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(wx + ww * 0.14, wy + wh * 0.22);
    ctx.lineTo(wx + ww * 0.62, wy + wh * 0.22);
    ctx.stroke();
    for (let sw = 0; sw < 2; sw++) {
      const ax = wx + ww * (0.25 + sw * 0.24);
      const swingShift = Math.sin(t * 1.5 + sw * 1.7) * 12;
      const seatY = wy + wh * 0.5;
      ctx.strokeStyle = PALETTE.magnolia_ivory;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(ax - 8, wy + wh * 0.22);
      ctx.lineTo(ax - 8 + swingShift, seatY);
      ctx.moveTo(ax + 8, wy + wh * 0.22);
      ctx.lineTo(ax + 8 + swingShift, seatY);
      ctx.stroke();
      ctx.fillStyle = PALETTE.porphyry_crimson;
      ctx.fillRect(ax - 12 + swingShift, seatY, 24, 4.5);
    }

    // Philosopher seated on the lawn throwing wooden ball at 9 wooden ninepins
    const philX = wx + ww * 0.22, philY = wy + wh * 0.78;
    ctx.fillStyle = PALETTE.magnolia_ivory;
    ctx.beginPath();
    ctx.moveTo(philX - 18, philY + 12);
    ctx.quadraticCurveTo(philX, philY - 26, philX + 20, philY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(philX + 2, philY - 24, 8, 0, Math.PI * 2);
    ctx.fill();
    // Rolling wooden bowl ball
    const ballU = (t * 0.55) % 1;
    ctx.fillStyle = '#6c3f23';
    ctx.beginPath();
    ctx.arc(philX + 24 + ballU * (ww * 0.36), philY + 2 - Math.sin(ballU * Math.PI) * 8, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Exact 9 turned wooden ninepins on the garden grass
    for (let p = 0; p < 9; p++) {
      const col = p % 3, row = Math.floor(p / 3);
      const px = wx + ww * (0.64 + col * 0.085 + row * 0.02);
      const py = wy + wh * (0.68 + row * 0.085);
      const tip = (p === 0 || p === 4) ? Math.sin(t * 2.2 + p) * 0.42 : 0.04 * Math.sin(t + p);
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(tip);
      ctx.fillStyle = PALETTE.papyrus_amber;
      ctx.fillRect(-3.2, -16, 6.4, 16);
      ctx.fillStyle = PALETTE.porphyry_crimson;
      ctx.fillRect(-3.2, -11, 6.4, 2.5);
      ctx.fillStyle = PALETTE.magnolia_ivory;
      ctx.beginPath();
      ctx.arc(0, -18.5, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    ctx.strokeStyle = PALETTE.vellum_ochre;
    ctx.lineWidth = 3.5;
    ctx.strokeRect(wx, wy + ww * 0.36, ww, wh - ww * 0.36);

    // Woven mat, dull-eyed adolescent with opium pipe pointing out the window + smoke
    ctx.fillStyle = '#6e5233';
    ctx.fillRect(w * 0.06, h * 0.78, w * 0.34, h * 0.08);
    const yx = w * 0.18, yy = h * 0.74;
    ctx.fillStyle = PALETTE.porphyry_rose;
    ctx.beginPath();
    drawEllipse(ctx, yx + 12, yy + 4, 34, 11, -0.12);
    ctx.fill();
    ctx.fillStyle = PALETTE.papyrus_amber;
    ctx.beginPath();
    ctx.arc(yx - 16, yy - 12, 9.5, 0, Math.PI * 2);
    ctx.fill();
    // Extended pointing arm toward the garden window
    ctx.strokeStyle = PALETTE.papyrus_amber;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(yx - 4, yy - 8);
    ctx.lineTo(w * 0.43, h * 0.56);
    ctx.stroke();
    // Long opium pipe & curling turquoise-amber haze
    ctx.strokeStyle = PALETTE.vellum_ochre;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(yx - 10, yy - 9);
    ctx.lineTo(yx + 28, yy - 2);
    ctx.stroke();
    for (let k = 0; k < 5; k++) {
      const sy = yy - 14 - k * 22 - ((t * 14) % 18);
      const sx = yx + 28 + Math.sin(t * 1.3 + k) * 14;
      ctx.strokeStyle = 'rgba(88, 211, 220, 0.34)';
      ctx.beginPath();
      ctx.arc(sx, sy, 8 + k * 3, 0, Math.PI * 1.6);
      ctx.stroke();
    }
  }

  function paintSultanStables(ctx, w, h, env) {
    const t = env.phase;
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#3a0e1c');
    bg.addColorStop(0.55, PALETTE.porphyry_crimson);
    bg.addColorStop(1, '#1b0d14');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // 4 crimson vaulted stable bays & hanging stirrups
    for (let v = 0; v < 4; v++) {
      const vx = (w / 4) * v, vw = w / 4;
      ctx.strokeStyle = PALETTE.vellum_ochre;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(vx + 6, h * 0.78);
      ctx.lineTo(vx + 6, h * 0.32);
      ctx.quadraticCurveTo(vx + vw * 0.5, h * 0.06, vx + vw - 6, h * 0.32);
      ctx.lineTo(vx + vw - 6, h * 0.78);
      ctx.stroke();

      // Trestle + leather saddle + bare-legged woman in riding breeches with unbound hair
      const cx = vx + vw * 0.5, ty = h * 0.68;
      const rock = Math.sin(t * 3.1 + v * 1.3) * 0.11;
      ctx.strokeStyle = '#6c4528';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(cx - 28, h * 0.86);
      ctx.lineTo(cx - 12, ty);
      ctx.lineTo(cx + 12, ty);
      ctx.lineTo(cx + 28, h * 0.86);
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, ty);
      ctx.rotate(rock);
      // Tooled crimson-and-ochre saddle
      ctx.fillStyle = '#5c1424';
      ctx.beginPath();
      drawEllipse(ctx, 0, -4, 26, 9, 0);
      ctx.fill();
      // Tailored riding breeches & bare lower leg in stirrup
      ctx.fillStyle = PALETTE.magnolia_ivory;
      ctx.beginPath();
      drawEllipse(ctx, -3, -12, 11, 7, 0.3);
      ctx.fill();
      ctx.strokeStyle = PALETTE.papyrus_amber;
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(-2, -8);
      ctx.lineTo(4, 16);
      ctx.stroke();
      // Arched torso & streaming unbound hair
      ctx.strokeStyle = PALETTE.porphyry_rose;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-2, -14);
      ctx.quadraticCurveTo(-10, -32, -4, -44);
      ctx.stroke();
      ctx.fillStyle = PALETTE.papyrus_amber;
      ctx.beginPath();
      ctx.arc(-3, -50, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#120b10';
      ctx.lineWidth = 3;
      for (let hr = 0; hr < 3; hr++) {
        ctx.beginPath();
        ctx.moveTo(-6, -52);
        ctx.bezierCurveTo(-24, -48 - hr * 4, -36, -28 + hr * 7, -44, -18 + Math.sin(t * 4 + hr) * 6);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function paintCemeteryTombs(ctx, w, h, env) {
    const t = env.phase;
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#0b101b');
    bg.addColorStop(0.65, '#152331');
    bg.addColorStop(1, '#0d161d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Pointed cypress silhouettes
    for (let c = 0; c < 7; c++) {
      const cx = w * (0.07 + c * 0.145);
      ctx.fillStyle = '#091319';
      ctx.beginPath();
      ctx.moveTo(cx - 16, h * 0.78);
      ctx.quadraticCurveTo(cx, h * 0.14, cx, h * 0.12);
      ctx.quadraticCurveTo(cx, h * 0.14, cx + 16, h * 0.78);
      ctx.closePath();
      ctx.fill();
    }

    // 6 cutaway marble sepulchers: 3 flutists (even) & 3 harpists (odd)
    const centers = [];
    for (let g = 0; g < 6; g++) {
      const gx = w * (0.11 + g * 0.156);
      const gy = h * (g % 2 === 0 ? 0.68 : 0.6);
      centers.push([gx, gy]);
      ctx.fillStyle = PALETTE.magnolia_ivory;
      ctx.fillRect(gx - 34, gy - 26, 68, 50);
      ctx.fillStyle = '#142634';
      ctx.fillRect(gx - 27, gy - 19, 54, 36);

      const isFlute = g % 2 === 0;
      ctx.fillStyle = isFlute ? PALETTE.lagoon_cyan : PALETTE.vellum_ochre;
      ctx.beginPath();
      ctx.arc(gx - 8, gy - 4, 6, 0, Math.PI * 2);
      ctx.fill();
      if (isFlute) {
        // Transverse silver flute
        ctx.strokeStyle = PALETTE.magnolia_ivory;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(gx - 4, gy - 3);
        ctx.lineTo(gx + 20, gy - 5);
        ctx.stroke();
      } else {
        // Golden triangular harp & strings
        ctx.strokeStyle = PALETTE.vellum_ochre;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(gx + 4, gy + 12);
        ctx.lineTo(gx + 4, gy - 14);
        ctx.quadraticCurveTo(gx + 18, gy - 10, gx + 20, gy + 10);
        ctx.closePath();
        ctx.stroke();
      }
    }

    // Sweet living melody arcs answering grave to grave
    for (let a = 0; a < 5; a++) {
      const p1 = centers[a], p2 = centers[a + 1];
      const lift = h * (0.22 + (a % 2) * 0.08) + Math.sin(t * 2.2 + a) * 12;
      ctx.strokeStyle = a % 2 === 0 ? PALETTE.lagoon_cyan : PALETTE.vellum_ochre;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1] - 18);
      ctx.quadraticCurveTo((p1[0] + p2[0]) * 0.5, p1[1] - lift, p2[0], p2[1] - 18);
      ctx.stroke();
    }
  }

  function paintCitadelPinnacle(ctx, w, h, env) {
    const t = env.phase;
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.76);
    sky.addColorStop(0, '#0a0f18');
    sky.addColorStop(0.45, '#196472');
    sky.addColorStop(1, '#c9974c');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // Bone-dry inland crag & desert mountain ridges — zero sea anywhere
    const ridges = [
      { y: 0.66, amp: 0.05, fill: '#6c4f33' },
      { y: 0.75, amp: 0.06, fill: '#3f2e22' },
      { y: 0.84, amp: 0.05, fill: '#221c1a' }
    ];
    for (let r = 0; r < ridges.length; r++) {
      const rg = ridges[r];
      ctx.fillStyle = rg.fill;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let i = 0; i <= 8; i++) {
        const rx = (w / 8) * i;
        const ry = h * (rg.y - Math.abs(Math.sin(i * 1.15 + r)) * rg.amp);
        ctx.lineTo(rx, ry);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
    }

    // Dry citadel pinnacle parapet & waiting traveler gazing overhead
    ctx.fillStyle = PALETTE.basalt_slate;
    ctx.beginPath();
    ctx.moveTo(w * 0.34, h);
    ctx.lineTo(w * 0.41, h * 0.73);
    ctx.lineTo(w * 0.59, h * 0.73);
    ctx.lineTo(w * 0.66, h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = PALETTE.magnolia_ivory;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.675, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w * 0.492, h * 0.682, w * 0.016, h * 0.048);

    // Full-rigged vellum-sailed sky-ship gliding overhead across dry sky
    const prog = env.shipProgress > 0 ? env.shipProgress : (0.48 + Math.sin(t * 0.35) * 0.14);
    const sx = w * (0.18 + clamp(prog, 0, 1) * 0.64);
    const sy = h * 0.31 + Math.sin(t * 0.9) * 6;
    ctx.save();
    ctx.translate(sx, sy);

    // Wind-wake filaments
    ctx.strokeStyle = 'rgba(244, 237, 224, 0.32)';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-120, 18);
    ctx.quadraticCurveTo(-55, 24, 52, 16);
    ctx.stroke();

    // Timber hull & bowsprit
    ctx.fillStyle = '#4a2b1b';
    ctx.beginPath();
    ctx.moveTo(-58, 4);
    ctx.lineTo(56, 2);
    ctx.lineTo(78, -8);
    ctx.lineTo(42, 20);
    ctx.lineTo(-44, 20);
    ctx.closePath();
    ctx.fill();

    // 3 masts, billowing vellum sails & crimson pennant
    const masts = [-28, 4, 34];
    for (let m = 0; m < masts.length; m++) {
      const mx = masts[m], mh = m === 1 ? 68 : 54;
      ctx.strokeStyle = PALETTE.vellum_ochre;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(mx, 4);
      ctx.lineTo(mx, -mh);
      ctx.stroke();

      ctx.fillStyle = m === 1 ? PALETTE.magnolia_ivory : PALETTE.papyrus_amber;
      ctx.beginPath();
      ctx.moveTo(mx - 14, -mh + 8);
      ctx.quadraticCurveTo(mx + 10, -mh * 0.55, mx - 12, -10);
      ctx.lineTo(mx + 14, -12);
      ctx.quadraticCurveTo(mx + 24, -mh * 0.55, mx + 12, -mh + 8);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = PALETTE.porphyry_crimson;
    ctx.beginPath();
    ctx.moveTo(4, -68);
    ctx.lineTo(-18, -63);
    ctx.lineTo(4, -59);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  const PAINTERS = Object.freeze({
    magnolia_lagoon: paintMagnoliaLagoon,
    porphyry_palace: paintPorphyryPalace,
    vellum_library: paintVellumLibrary,
    sultan_stables: paintSultanStables,
    cemetery_tombs: paintCemeteryTombs,
    citadel_pinnacle: paintCitadelPinnacle
  });

  function buildPrismPolygon(w, h, refraction, focusX, focusY) {
    const ref = clamp(refraction, 0, 1);
    const fx = focusX > 1.001 ? clamp(focusX / w, 0, 1) : clamp(focusX, 0, 1);
    const fy = focusY > 1.001 ? clamp(focusY / h, 0, 1) : clamp(focusY, 0, 1);
    const cx = (fx * w) * (1 - ref * 0.65) + (w * 0.5) * (ref * 0.65);
    const cy = (fy * h) * (1 - ref * 0.65) + (h * 0.5) * (ref * 0.65);
    const maxR = Math.hypot(w, h) * 1.08;
    const baseR = maxR * Math.pow(ref, 0.88);
    const facets = [1.14, 0.86, 1.08, 0.9, 1.16, 0.88, 1.06, 0.92];
    const pts = [];
    for (let i = 0; i < 8; i++) {
      const ang = -Math.PI * 0.38 + (i * Math.PI * 2) / 8;
      const r = baseR * facets[i];
      pts.push([cx + Math.cos(ang) * r, cy + Math.sin(ang) * r * 0.88]);
    }
    return pts;
  }

  function createAudioRig(initialMuted) {
    let muted = Boolean(initialMuted);
    let audioCtx = null;

    function ensureCtx() {
      if (muted) return null;
      if (audioCtx) return audioCtx;
      const AC = root.AudioContext || root.webkitAudioContext;
      if (typeof AC !== 'function') return null;
      try {
        audioCtx = new AC();
      } catch (_e) {
        audioCtx = null;
      }
      return audioCtx;
    }

    function tone(ctx, freq, start, dur, type, peak, endFreq) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, start);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(24, endFreq), start + dur);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(peak || 0.06, start + Math.min(0.03, dur * 0.25));
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur + 0.02);
    }

    function trigger(cueKind) {
      const motif = String(cueKind || 'surface');
      if (muted) return { played: false, reason: 'muted', motif: motif };
      const ctx = ensureCtx();
      if (!ctx) return { played: false, reason: 'unavailable', motif: motif };
      try {
        if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
          ctx.resume().catch(function () {});
        }
        const now = ctx.currentTime + 0.01;
        if (motif === 'cemetery_tombs') {
          // Sweet breathy flute phrase answered grave-to-grave by plucked golden harp arpeggio
          const flute = [659.25, 783.99, 987.77, 880.0];
          for (let i = 0; i < flute.length; i++) tone(ctx, flute[i], now + i * 0.14, 0.28, 'sine', 0.065);
          const harp = [329.63, 493.88, 659.25, 739.99, 783.99, 987.77];
          for (let j = 0; j < harp.length; j++) tone(ctx, harp[j], now + 0.22 + j * 0.075, 0.36, 'triangle', 0.055);
        } else if (motif === 'vellum_library') {
          tone(ctx, 196.0, now, 0.55, 'sine', 0.035);
          const clacks = [680, 830, 610, 760];
          for (let c = 0; c < clacks.length; c++) tone(ctx, clacks[c], now + 0.08 + c * 0.09, 0.065, 'triangle', 0.08, clacks[c] * 0.72);
        } else if (motif === 'porphyry_palace') {
          tone(ctx, 1240, now, 0.09, 'square', 0.035, 890);
          tone(ctx, 1790, now + 0.07, 0.1, 'triangle', 0.04, 1310);
          tone(ctx, 64, now + 0.14, 0.38, 'sine', 0.095, 31);
        } else if (motif === 'citadel_pinnacle' || motif === 'sky_ship') {
          const rig = [293.66, 440.0, 659.25, 880.0, 1108.73];
          for (let r = 0; r < rig.length; r++) tone(ctx, rig[r], now + r * 0.05, 0.75, 'sine', 0.045);
        } else if (motif === 'magnolia_lagoon') {
          tone(ctx, 164.81, now, 0.55, 'sine', 0.06, 110);
          tone(ctx, 1320, now + 0.18, 0.06, 'triangle', 0.035);
        } else if (motif === 'sultan_stables') {
          const st = [220.0, 233.08, 329.63, 440.0];
          for (let s = 0; s < st.length; s++) tone(ctx, st[s], now + s * 0.06, 0.26, 'sawtooth', 0.03);
        } else {
          const court = [293.66, 440.0, 587.33];
          for (let k = 0; k < court.length; k++) tone(ctx, court[k], now + k * 0.03, 0.32, 'triangle', 0.04);
        }
        return { played: true, motif: motif };
      } catch (_err) {
        return { played: false, reason: 'error', motif: motif };
      }
    }

    return {
      isMuted: function () { return muted; },
      setMuted: function (flag) {
        muted = flag === undefined ? !muted : Boolean(flag);
        return muted;
      },
      unlock: function () {
        const ctx = ensureCtx();
        if (!ctx) return false;
        if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
          ctx.resume().catch(function () {});
        }
        return true;
      },
      trigger: trigger
    };
  }

  function renderInvertedSceneStandalone(ctx, w, h, opts, engineState) {
    if (!ctx) return;
    const o = opts || {};
    const width = Math.max(1, Number(w) || 800);
    const height = Math.max(1, Number(h) || 500);
    const rawId = o.locusId || o.id || o.locus || (engineState && engineState.activeLocusId) || LOCI_ORDER[0];
    const locusId = resolveLocusId(rawId, LOCI_ORDER[0]);
    const reduced = Boolean(o.reducedMotion !== undefined ? o.reducedMotion : (engineState && engineState.reducedMotion));
    const rawPhase = o.time !== undefined ? Number(o.time) : (o.t !== undefined ? Number(o.t) : (engineState ? engineState.elapsed : 0));
    const phase = reduced ? 0.6 : (Number.isFinite(rawPhase) ? rawPhase : 0);
    const shipProg = o.skyShip && typeof o.skyShip.progress === 'number'
      ? o.skyShip.progress
      : (engineState && engineState.skyShip ? engineState.skyShip.progress : 0.48);

    const painter = PAINTERS[locusId] || paintMagnoliaLagoon;
    ctx.save();
    painter(ctx, width, height, {
      locusId: locusId,
      phase: phase,
      refraction: o.refraction !== undefined ? clamp(o.refraction, 0, 1) : (engineState ? engineState.refraction : 1),
      shipProgress: shipProg
    });
    ctx.restore();
  }

  function renderPrismCompositeStandalone(ctx, w, h, drawSurfaceFn, drawInvertedFn, prismOpts, engineState) {
    if (!ctx) return;
    const p = prismOpts || {};
    const width = Math.max(1, Number(w) || 800);
    const height = Math.max(1, Number(h) || 500);
    const ref = clamp(p.refraction !== undefined ? p.refraction : (engineState ? engineState.refraction : 0), 0, 1);
    const fx = p.focusX !== undefined ? p.focusX : (engineState ? engineState.focusX : 0.5);
    const fy = p.focusY !== undefined ? p.focusY : (engineState ? engineState.focusY : 0.5);

    if (typeof drawSurfaceFn === 'function') {
      ctx.save();
      drawSurfaceFn(ctx, width, height, p);
      ctx.restore();
    }

    if (ref <= 0.002) return;

    const invokeInverted = function () {
      if (typeof drawInvertedFn === 'function') {
        drawInvertedFn(ctx, width, height, p);
      } else {
        renderInvertedSceneStandalone(ctx, width, height, p, engineState);
      }
    };

    if (ref >= 0.996) {
      ctx.save();
      invokeInverted();
      ctx.strokeStyle = PALETTE.porphyry_crimson;
      ctx.lineWidth = 3;
      ctx.strokeRect(1.5, 1.5, width - 3, height - 3);
      ctx.strokeStyle = PALETTE.magnolia_turquoise;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(4.5, 4.5, width - 9, height - 9);
      ctx.restore();
      return;
    }

    const poly = buildPrismPolygon(width, height, ref, fx, fy);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
    ctx.closePath();
    ctx.clip();
    invokeInverted();
    ctx.restore();

    // Faceted porphyry-crimson & magnolia-turquoise optical bevels
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
    ctx.closePath();
    ctx.strokeStyle = PALETTE.porphyry_crimson;
    ctx.lineWidth = 4.2;
    ctx.stroke();
    ctx.strokeStyle = PALETTE.lagoon_cyan;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.fillStyle = PALETTE.magnolia_ivory;
    for (let v = 0; v < poly.length; v++) {
      ctx.beginPath();
      ctx.arc(poly[v][0], poly[v][1], 2.4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function createInversionEngine(opts) {
    const cfg = opts || {};
    const audio = createAudioRig(Boolean(cfg.muted));
    let activeLocusId = resolveLocusId(cfg.initialLocusId, LOCI_ORDER[0]);
    let refraction = 0;
    let elapsed = 0;
    let focusX = 0.5;
    let focusY = 0.5;
    let reducedMotion = Boolean(cfg.reducedMotion);
    let epigramUnlocked = false;
    const skyShip = { seaExists: false, summoned: false, progress: 0, vesselVisible: false };
    const lociState = Object.create(null);

    function initLoci() {
      for (let i = 0; i < INVERTED_THINGS.length; i++) {
        const item = INVERTED_THINGS[i];
        lociState[item.id] = { id: item.id, index: item.index, key: item.key, unsealed: false, refraction: 0 };
      }
    }
    initLoci();

    function countRewired() {
      let n = 0;
      for (let i = 0; i < LOCI_ORDER.length; i++) {
        if (lociState[LOCI_ORDER[i]].unsealed) n++;
      }
      return n;
    }

    function activatePinnacleShip() {
      activeLocusId = 'citadel_pinnacle';
      lociState.citadel_pinnacle.unsealed = true;
      lociState.citadel_pinnacle.refraction = 1;
      refraction = 1;
      skyShip.seaExists = false;
      skyShip.summoned = true;
      skyShip.vesselVisible = true;
      if (skyShip.progress <= 0) skyShip.progress = 0.45;
      epigramUnlocked = true;
    }

    function getState() {
      const rewiredCount = countRewired();
      const copyLoci = {};
      for (let i = 0; i < LOCI_ORDER.length; i++) {
        const id = LOCI_ORDER[i];
        copyLoci[id] = Object.assign({}, lociState[id]);
      }
      const partial = lociState[activeLocusId].unsealed ? 0 : refraction * 0.35;
      const mastery = clamp((rewiredCount + partial) / 6, 0, 1);
      const libOpen = lociState.vellum_library.unsealed || (activeLocusId === 'vellum_library' && refraction >= 0.68);
      const tombsOpen = lociState.cemetery_tombs.unsealed || (activeLocusId === 'cemetery_tombs' && refraction >= 0.68);
      return {
        activeLocusId: activeLocusId,
        refraction: refraction,
        lociState: copyLoci,
        rewiredCount: rewiredCount,
        totalLoci: 6,
        oldLexiconFaith: Number((1 - mastery).toFixed(4)),
        hypatiaGrammarMastery: Number(mastery.toFixed(4)),
        opiumYouthPointing: libOpen,
        philosopherNinepinsActive: libOpen,
        woodenNinepins: 9,
        cemeteryMusicActive: tombsOpen,
        skyShip: {
          seaExists: false,
          summoned: skyShip.summoned,
          progress: Number(skyShip.progress.toFixed(4)),
          vesselVisible: skyShip.vesselVisible
        },
        epigramUnlocked: epigramUnlocked,
        muted: audio.isMuted()
      };
    }

    function selectLocus(locusId) {
      activeLocusId = resolveLocusId(locusId, activeLocusId);
      refraction = lociState[activeLocusId].unsealed ? 1 : lociState[activeLocusId].refraction;
      return getState();
    }

    function setRefraction(v, locusId) {
      const targetId = locusId !== undefined ? resolveLocusId(locusId, activeLocusId) : activeLocusId;
      const val = clamp(v, 0, 1);
      lociState[targetId].refraction = val;
      if (targetId === activeLocusId) refraction = val;
      if (val >= 0.68) {
        lociState[targetId].unsealed = true;
        if (targetId === 'citadel_pinnacle' && countRewired() >= 5) activatePinnacleShip();
      }
      return getState();
    }

    function unsealLocus(locusId) {
      const targetId = locusId !== undefined ? resolveLocusId(locusId, activeLocusId) : activeLocusId;
      lociState[targetId].unsealed = true;
      lociState[targetId].refraction = 1;
      if (locusId === undefined || targetId === activeLocusId) refraction = 1;
      if (targetId === 'citadel_pinnacle' && countRewired() >= 5) activatePinnacleShip();
      return getState();
    }

    function unsealAll() {
      for (let i = 0; i < LOCI_ORDER.length; i++) {
        lociState[LOCI_ORDER[i]].unsealed = true;
        lociState[LOCI_ORDER[i]].refraction = 1;
      }
      refraction = 1;
      skyShip.seaExists = false;
      skyShip.summoned = true;
      skyShip.vesselVisible = true;
      if (skyShip.progress <= 0) skyShip.progress = 0.45;
      epigramUnlocked = true;
      return getState();
    }

    function summonSkyShip() {
      activatePinnacleShip();
      return getState();
    }

    function step(dtSec) {
      const dt = clamp(dtSec === undefined ? 0.016 : dtSec, 0, 0.25);
      if (!reducedMotion) {
        elapsed += dt;
        if (skyShip.summoned) {
          skyShip.progress = 0.16 + ((skyShip.progress - 0.16 + dt * 0.085) % 0.68);
        }
      }
      skyShip.seaExists = false;
      return getState();
    }

    function reset() {
      initLoci();
      activeLocusId = LOCI_ORDER[0];
      refraction = 0;
      elapsed = 0;
      epigramUnlocked = false;
      skyShip.seaExists = false;
      skyShip.summoned = false;
      skyShip.progress = 0;
      skyShip.vesselVisible = false;
      return getState();
    }

    return {
      LOCI_ORDER: LOCI_ORDER,
      INVERTED_THINGS: INVERTED_THINGS,
      PALETTE: PALETTE,
      getState: getState,
      getInversionById: getInversionById,
      selectLocus: selectLocus,
      setRefraction: setRefraction,
      unsealLocus: unsealLocus,
      unsealAll: unsealAll,
      summonSkyShip: summonSkyShip,
      step: step,
      renderInvertedScene: function (ctx, w, h, sceneOpts) {
        renderInvertedSceneStandalone(ctx, w, h, sceneOpts, { activeLocusId: activeLocusId, refraction: refraction, elapsed: elapsed, reducedMotion: reducedMotion, skyShip: skyShip });
      },
      renderPrismComposite: function (ctx, w, h, drawSurfaceFn, drawInvertedFn, prismOpts) {
        renderPrismCompositeStandalone(ctx, w, h, drawSurfaceFn, drawInvertedFn, prismOpts, { activeLocusId: activeLocusId, refraction: refraction, elapsed: elapsed, focusX: focusX, focusY: focusY, reducedMotion: reducedMotion, skyShip: skyShip });
      },
      setFocus: function (fx, fy) { focusX = clamp(fx, 0, 1); focusY = clamp(fy, 0, 1); },
      setReducedMotion: function (flag) { reducedMotion = Boolean(flag); },
      setMuted: function (flag) { return audio.setMuted(flag); },
      unlockAudio: function () { return audio.unlock(); },
      triggerAcousticCue: function (cueKind) { return audio.trigger(cueKind || activeLocusId); },
      reset: reset
    };
  }

  const API = Object.freeze({
    PALETTE: PALETTE,
    LOCI_ORDER: LOCI_ORDER,
    INVERTED_THINGS: INVERTED_THINGS,
    getInversionById: getInversionById,
    createInversionEngine: createInversionEngine,
    renderInvertedScene: function (ctx, w, h, opts) { renderInvertedSceneStandalone(ctx, w, h, opts, null); },
    renderPrismComposite: function (ctx, w, h, sFn, iFn, pOpts) { renderPrismCompositeStandalone(ctx, w, h, sFn, iFn, pOpts, null); }
  });

  root.HypatiaInvertedRealities = API;
  if (typeof window !== 'undefined') window.HypatiaInvertedRealities = API;
  if (typeof module === 'object' && module && module.exports) module.exports = API;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
