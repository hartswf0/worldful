/* Moriana — Reverse Soot & Rust Rigging Layer (Zero-Thickness Verso) */
(function (root) {
  "use strict";

  var PALETTE = Object.freeze({
    bay_obsidian: "#0E1318",
    alabaster_sun: "#F5EFE2",
    coral_vermilion: "#C84B39",
    serpentine_jade: "#2E6B56",
    aquarium_cyan: "#36A8B8",
    medusa_silver: "#D9EDF2",
    rust_oxide: "#8C3B24",
    soot_iron: "#1B1D20",
    sackcloth_ochre: "#9A7B56",
    leaden_sky_top: "#121519",
    leaden_sky_mid: "#22262C",
    leaden_sky_low: "#35302B",
    soot_smudge: "#101214",
    ash_ochre_ground: "#574838",
    ash_dust_deep: "#241E18",
    rust_bleed: "#6B2614",
    rust_crust: "#B45330",
    sheet_slate: "#444950",
    sheet_glint: "#6E747C",
    sackcloth_weave: "#876B48",
    sackcloth_tear: "#362A1E",
    timber_weathered: "#544334",
    timber_shadow: "#2A2018",
    iron_spike: "#262A30",
    spike_glint: "#8A9098",
    tin_corroded: "#7A7F84",
    tin_tarnish: "#5B4A3C",
    blind_plaster: "#767066",
    faded_chalk: "#B6ADA0",
    faded_sign_ghost: "#7C4F44",
    straw_splinter: "#B6965E",
    rotten_beam: "#3A2C21",
    hemp_rope: "#917A57",
    oxide_hover: "#D66B42",
    oxide_select: "#F2915E"
  });

  var REVERSE_STONES = [
    {
      id: "rev_rusting_sheetmetal",
      label: "Rusting Sheet Metal",
      calvino_stone: "an expanse of rusting sheet metal",
      face: "reverse",
      u: 0.68,
      v: 0.56,
      r: 0.12,
      counterpartId: "obv_glass_aquarium_villas",
      material: "Corrugated & riveted oxidized iron sheet bleeding ochre-red scale",
      whisper: "Broad buckled plates of riveted iron weep streaks of orange oxide where salt damp gnaws the backing of the bright facade."
    },
    {
      id: "rev_sackcloth_shrouds",
      label: "Torn Sackcloths",
      calvino_stone: "sackcloths",
      face: "reverse",
      u: 0.54,
      v: 0.46,
      r: 0.10,
      counterpartId: "obv_glass_aquarium_villas",
      material: "Coarse frayed hemp sacking tacked across flat backing seams",
      whisper: "Stiffened burlap shrouds hang split along the batten seams, their loose warp threads crusted with dry mortar grit."
    },
    {
      id: "rev_spiked_planks",
      label: "Spike-Bristling Planks",
      calvino_stone: "planks bristling with spikes",
      face: "reverse",
      u: 0.36,
      v: 0.58,
      r: 0.11,
      counterpartId: "obv_coral_columns",
      material: "Diagonal fir shoring & weathered planks pierced by bent iron spikes",
      whisper: "Raking timber props lean hard into the flat verso, every board a thicket of clinched and jagged iron spikes driven through from the front."
    },
    {
      id: "rev_soot_pipes",
      label: "Soot-Black Pipes",
      calvino_stone: "pipes black with soot",
      face: "reverse",
      u: 0.48,
      v: 0.24,
      r: 0.12,
      counterpartId: "obv_serpentine_pediments",
      material: "Elbowed cast-iron flues coated in greasy lampblack & rising dark smudge",
      whisper: "Jointed cast-iron flues angle through wire stays above the false ridge, sweating tarry creosote beneath a slow smudge of coal draft."
    },
    {
      id: "rev_tin_piles",
      label: "Piles of Tins",
      calvino_stone: "piles of tins",
      face: "reverse",
      u: 0.28,
      v: 0.80,
      r: 0.10,
      counterpartId: "obv_coral_columns",
      material: "Crushed solder-seamed canisters & corroded tinplate scrap",
      whisper: "At the heel of the timber braces, a drift of flattened canisters and serrated lids settles hollow and tarnished in the cinder."
    },
    {
      id: "rev_fading_blind_walls",
      label: "Blind Walls & Fading Signs",
      calvino_stone: "blind walls with fading signs",
      face: "reverse",
      u: 0.16,
      v: 0.50,
      r: 0.11,
      counterpartId: "obv_alabaster_gates",
      material: "Windowless lime-scabbed backing plaster & bleached ghost lettering",
      whisper: "Unpierced backing masonry holds neither casement nor threshold—only sun-bleached bands of old lead paint whose syllables have flaked away."
    },
    {
      id: "rev_straw_chair_frames",
      label: "Staved-In Straw Chairs",
      calvino_stone: "frames of staved-in straw chairs",
      face: "reverse",
      u: 0.78,
      v: 0.80,
      r: 0.11,
      counterpartId: "obv_medusa_dancers",
      material: "Upturned splintered beechwood rungs & burst rush-seat husks",
      whisper: "Upturned chair skeletons lie pitched askew by their turned stretchers, hollow straw seats caved clean through into the dry ash-ochre dust."
    },
    {
      id: "rev_rotten_beam_ropes",
      label: "Ropes on a Rotten Beam",
      calvino_stone: "ropes good only for hanging oneself on a rotten beam",
      face: "reverse",
      u: 0.82,
      v: 0.36,
      r: 0.11,
      counterpartId: "obv_medusa_dancers",
      material: "Frayed three-strand hemp noose coils dangling from a worm-eaten beam",
      whisper: "From a sagging, beetle-bored crossbeam, stiffened hemp loops hang plumb and idle above the empty dust."
    }
  ];

  function getStones() {
    return REVERSE_STONES.map(function (s) {
      return Object.assign({}, s);
    });
  }

  function hitTest(u, v) {
    if (typeof u !== "number" || typeof v !== "number" || Number.isNaN(u) || Number.isNaN(v)) {
      return null;
    }
    var best = null;
    var bestDist = Infinity;
    for (var i = 0; i < REVERSE_STONES.length; i += 1) {
      var s = REVERSE_STONES[i];
      var d = Math.hypot(u - s.u, v - s.v);
      if (d <= s.r * 1.15 && d < bestDist) {
        bestDist = d;
        best = s;
      }
    }
    return best;
  }

  function clamp01(x) {
    if (typeof x !== "number" || Number.isNaN(x)) return 0;
    return x < 0 ? 0 : x > 1 ? 1 : x;
  }

  function hash01(seed) {
    var s = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return s - Math.floor(s);
  }
  function drawStageBackdrop(ctx, w, h, t, raking) {
    var horizonY = h * 0.72;
    var skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, PALETTE.leaden_sky_top);
    skyGrad.addColorStop(0.58, PALETTE.leaden_sky_mid);
    skyGrad.addColorStop(1, PALETTE.leaden_sky_low);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizonY + 2);

    /* Rolling or still coal-soot sky smudges */
    for (var i = 0; i < 7; i += 1) {
      var drift = ((i * 0.17 + t * 0.008 * (0.6 + (i % 3) * 0.25)) % 1.25) - 0.12;
      var cx = drift * w;
      var cy = h * (0.09 + (i % 4) * 0.085);
      var rx = w * (0.18 + (i % 3) * 0.07);
      var ry = h * (0.045 + (i % 2) * 0.025);
      var g = ctx.createRadialGradient(cx, cy, ry * 0.15, cx, cy, rx);
      g.addColorStop(0, "rgba(14, 16, 19, 0.44)");
      g.addColorStop(1, "rgba(14, 16, 19, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(cx - rx, cy - ry * 2, rx * 2, ry * 4);
    }

    /* Windowless reverse theatrical flat silhouette (zero interior volume) */
    ctx.fillStyle = "#1E2024";
    ctx.beginPath();
    ctx.moveTo(w * 0.05, horizonY);
    ctx.lineTo(w * 0.05, h * 0.29);
    ctx.lineTo(w * 0.27, h * 0.27);
    ctx.lineTo(w * 0.29, h * 0.34);
    ctx.lineTo(w * 0.40, h * 0.31);
    ctx.lineTo(w * 0.48, h * 0.19);
    ctx.lineTo(w * 0.56, h * 0.32);
    ctx.lineTo(w * 0.79, h * 0.30);
    ctx.lineTo(w * 0.80, h * 0.72);
    ctx.closePath();
    ctx.fill();

    /* Vertical flat batten seams & ledger rails across the verso skin */
    ctx.strokeStyle = "rgba(10, 11, 13, 0.75)";
    ctx.lineWidth = Math.max(1, w * 0.0022);
    for (var b = 0; b < 8; b += 1) {
      var bx = w * (0.11 + b * 0.095);
      ctx.beginPath();
      ctx.moveTo(bx, h * 0.31);
      ctx.lineTo(bx, horizonY);
      ctx.stroke();
    }
    ctx.fillStyle = "#2A241E";
    ctx.fillRect(w * 0.05, h * 0.49, w * 0.74, h * 0.014);
    ctx.fillRect(w * 0.05, h * 0.64, w * 0.75, h * 0.015);

    /* Dusty ochre-ash ground plane */
    var groundGrad = ctx.createLinearGradient(0, horizonY, 0, h);
    groundGrad.addColorStop(0, PALETTE.ash_ochre_ground);
    groundGrad.addColorStop(0.55, "#3B3126");
    groundGrad.addColorStop(1, PALETTE.ash_dust_deep);
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, horizonY, w, h - horizonY);

    /* Ash ruts, slag grit & raking shadow bands */
    ctx.fillStyle = "rgba(18, 15, 12, " + (0.28 + raking * 0.25).toFixed(3) + ")";
    ctx.fillRect(w * 0.04, horizonY, w * 0.88, h * 0.022);
    for (var k = 0; k < 42; k += 1) {
      var gx = w * (0.04 + hash01(k * 3.1) * 0.92);
      var gy = horizonY + hash01(k * 7.3) * (h - horizonY) * 0.94;
      var gw = w * (0.004 + hash01(k * 11.7) * 0.018);
      ctx.fillStyle = k % 3 === 0 ? "rgba(154, 123, 86, 0.26)" : "rgba(20, 17, 15, 0.42)";
      ctx.fillRect(gx, gy, gw, Math.max(1.5, h * 0.004));
    }
  }

  function drawBlindWalls(ctx, w, h) {
    var x = w * 0.065, y = h * 0.29, bw = w * 0.195, bh = h * 0.43;
    ctx.fillStyle = PALETTE.blind_plaster;
    ctx.fillRect(x, y, bw, bh);
    ctx.fillStyle = "rgba(42, 37, 33, 0.42)";
    ctx.fillRect(x + bw * 0.08, y + bh * 0.54, bw * 0.84, bh * 0.46);
    /* Sealed blind arch scar (no opening, pure flat masonry) */
    ctx.strokeStyle = "rgba(44, 38, 34, 0.72)";
    ctx.lineWidth = Math.max(1.2, w * 0.0022);
    ctx.beginPath();
    ctx.arc(x + bw * 0.5, y + bh * 0.78, bw * 0.26, Math.PI, 0);
    ctx.lineTo(x + bw * 0.76, y + bh);
    ctx.moveTo(x + bw * 0.24, y + bh * 0.78);
    ctx.lineTo(x + bw * 0.24, y + bh);
    ctx.stroke();
    /* Bleached, half-erased painted sign bands & ghost glyphs */
    ctx.fillStyle = "rgba(182, 173, 160, 0.42)";
    ctx.fillRect(x + bw * 0.07, y + bh * 0.14, bw * 0.86, bh * 0.16);
    ctx.fillStyle = "rgba(124, 79, 68, 0.36)";
    ctx.fillRect(x + bw * 0.11, y + bh * 0.34, bw * 0.74, bh * 0.09);
    ctx.strokeStyle = "rgba(235, 226, 210, 0.34)";
    ctx.lineWidth = Math.max(1.4, w * 0.0024);
    for (var g = 0; g < 6; g += 1) {
      var lx = x + bw * (0.13 + g * 0.13);
      var ly = y + bh * 0.17;
      ctx.beginPath();
      ctx.moveTo(lx, ly + bh * 0.10);
      ctx.lineTo(lx + bw * 0.03, ly);
      if (g % 2 === 0) ctx.lineTo(lx + bw * 0.07, ly + bh * 0.09);
      ctx.stroke();
    }
    /* Rain-bleached lime drips erasing the sign */
    ctx.fillStyle = "rgba(88, 82, 74, 0.55)";
    for (var d = 0; d < 7; d += 1) {
      ctx.fillRect(x + bw * (0.12 + d * 0.12), y + bh * 0.12, bw * 0.045, bh * (0.22 + (d % 3) * 0.09));
    }
  }

  function drawSootPipes(ctx, w, h, t, reducedMotion) {
    var px = w * 0.48, py = h * 0.24;
    var pipes = [
      { ox: -0.052, top: -0.10, bend: -0.025, pw: 0.022 },
      { ox: -0.006, top: -0.135, bend: 0.018, pw: 0.027 },
      { ox: 0.044, top: -0.085, bend: 0.032, pw: 0.020 }
    ];
    /* Rising greasy soot smudge above flue mouths */
    for (var p = 0; p < pipes.length; p += 1) {
      var mouthX = px + w * (pipes[p].ox + pipes[p].bend);
      var mouthY = py + h * pipes[p].top;
      for (var s = 0; s < 5; s += 1) {
        var age = (s + 1) / 5;
        var sway = reducedMotion ? (s * 0.012 * w) : (Math.sin(t * 1.1 + p * 2.1 + s) * w * 0.012 + age * w * 0.035);
        var rad = w * (0.014 + age * 0.028);
        var sg = ctx.createRadialGradient(mouthX + sway, mouthY - age * h * 0.09, rad * 0.1, mouthX + sway, mouthY - age * h * 0.09, rad);
        sg.addColorStop(0, "rgba(15, 16, 18, " + (0.62 * (1 - age * 0.65)).toFixed(3) + ")");
        sg.addColorStop(1, "rgba(15, 16, 18, 0)");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(mouthX + sway, mouthY - age * h * 0.09, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    /* Cast-iron elbowed pipes, collars & wire stays */
    ctx.strokeStyle = "rgba(95, 88, 82, 0.55)";
    ctx.lineWidth = 1;
    for (var j = 0; j < pipes.length; j += 1) {
      var st = pipes[j];
      var x0 = px + w * st.ox, y0 = py + h * 0.12;
      var x1 = x0, y1 = py + h * (st.top + 0.045);
      var x2 = x0 + w * st.bend, y2 = py + h * st.top;
      ctx.beginPath();
      ctx.moveTo(x1, y1 + h * 0.02);
      ctx.lineTo(px + (j === 0 ? -w * 0.10 : w * 0.10), py + h * 0.11);
      ctx.stroke();

      ctx.strokeStyle = PALETTE.soot_iron;
      ctx.lineCap = "butt";
      ctx.lineWidth = w * st.pw;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      /* Flanged soot collar & tarry creosote sheen */
      ctx.fillStyle = "#0B0C0E";
      ctx.fillRect(x1 - w * st.pw * 0.68, y1 - h * 0.006, w * st.pw * 1.36, h * 0.012);
      ctx.fillRect(x0 - w * st.pw * 0.65, py + h * 0.04, w * st.pw * 1.3, h * 0.011);
      ctx.strokeStyle = "rgba(95, 88, 82, 0.55)";
      ctx.lineWidth = 1;
    }
  }
  function drawSackclothAndSheetmetal(ctx, w, h, t, reducedMotion, raking) {
    /* Stone 2: rev_sackcloth_shrouds around (0.54, 0.46) */
    var sx = w * 0.465, sy = h * 0.345, sw = w * 0.145, sh = h * 0.235;
    var hemSway = reducedMotion ? 0 : Math.sin(t * 1.6) * w * 0.003;
    ctx.fillStyle = PALETTE.sackcloth_ochre;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + sw, sy + h * 0.012);
    ctx.lineTo(sx + sw * 0.94 + hemSway, sy + sh);
    ctx.lineTo(sx + sw * 0.56 + hemSway, sy + sh * 0.88);
    ctx.lineTo(sx + sw * 0.38 + hemSway, sy + sh * 1.03);
    ctx.lineTo(sx + hemSway * 0.5, sy + sh * 0.93);
    ctx.closePath();
    ctx.fill();
    /* Coarse burlap weave & jagged seam tears */
    ctx.strokeStyle = "rgba(54, 42, 30, 0.42)";
    ctx.lineWidth = 1;
    for (var n = 1; n < 8; n += 1) {
      ctx.beginPath();
      ctx.moveTo(sx + (sw * n) / 8, sy + h * 0.01);
      ctx.lineTo(sx + (sw * n) / 8 + hemSway * 0.6, sy + sh * 0.92);
      ctx.moveTo(sx + w * 0.004, sy + (sh * n) / 8);
      ctx.lineTo(sx + sw - w * 0.006, sy + (sh * n) / 8);
      ctx.stroke();
    }
    ctx.fillStyle = PALETTE.sackcloth_tear;
    ctx.fillRect(sx + sw * 0.44, sy + sh * 0.22, sw * 0.055, sh * 0.48);
    ctx.fillRect(sx + sw * 0.71, sy + sh * 0.38, sw * 0.04, sh * 0.34);

    /* Stone 1: rev_rusting_sheetmetal around (0.68, 0.56) */
    var mx = w * 0.575, my = h * 0.39, mw = w * 0.215, mh = h * 0.335;
    var plateGrad = ctx.createLinearGradient(mx, my, mx + mw, my + mh);
    plateGrad.addColorStop(0, PALETTE.sheet_slate);
    plateGrad.addColorStop(0.45, PALETTE.rust_oxide);
    plateGrad.addColorStop(1, "#2A1F1B");
    ctx.fillStyle = plateGrad;
    ctx.fillRect(mx, my, mw, mh);
    /* Corrugation ribs, oxidized scale patches & bleeding rivet streaks */
    for (var c = 0; c < 11; c += 1) {
      var rx = mx + (mw * (c + 0.5)) / 11;
      ctx.fillStyle = c % 2 === 0 ? "rgba(110, 116, 124, 0.22)" : "rgba(18, 16, 15, 0.34)";
      ctx.fillRect(rx - mw * 0.02, my, mw * 0.038, mh);
    }
    ctx.fillStyle = "rgba(180, 83, 48, " + (0.45 + raking * 0.2).toFixed(3) + ")";
    ctx.fillRect(mx + mw * 0.12, my + mh * 0.18, mw * 0.46, mh * 0.36);
    ctx.fillRect(mx + mw * 0.48, my + mh * 0.44, mw * 0.42, mh * 0.42);
    for (var rv = 0; rv < 9; rv += 1) {
      var rvx = mx + mw * (0.08 + rv * 0.105);
      var rvy = my + mh * (rv % 2 === 0 ? 0.12 : 0.52);
      ctx.fillStyle = PALETTE.rust_bleed;
      ctx.fillRect(rvx - w * 0.0025, rvy, w * 0.005, mh * (0.34 + (rv % 3) * 0.11));
      ctx.fillStyle = "#1D1917";
      ctx.beginPath();
      ctx.arc(rvx, rvy, Math.max(1.6, w * 0.003), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPlanksRopesAndDebris(ctx, w, h, t, reducedMotion) {
    /* Stone 3: rev_spiked_planks around (0.36, 0.58) */
    var struts = [
      [0.29, 0.74, 0.39, 0.41],
      [0.34, 0.75, 0.44, 0.45],
      [0.28, 0.56, 0.45, 0.62]
    ];
    for (var i = 0; i < struts.length; i += 1) {
      var a = struts[i];
      ctx.strokeStyle = i === 2 ? PALETTE.timber_shadow : PALETTE.timber_weathered;
      ctx.lineWidth = Math.max(4, w * 0.016);
      ctx.beginPath();
      ctx.moveTo(w * a[0], h * a[1]);
      ctx.lineTo(w * a[2], h * a[3]);
      ctx.stroke();
      /* Bristling bent iron spikes along plank edges */
      ctx.strokeStyle = PALETTE.spike_glint;
      ctx.lineWidth = Math.max(1.2, w * 0.002);
      for (var sp = 1; sp <= 7; sp += 1) {
        var f = sp / 8;
        var sx = w * (a[0] + (a[2] - a[0]) * f);
        var sy = h * (a[1] + (a[3] - a[1]) * f);
        var dir = sp % 2 === 0 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + dir * w * 0.015, sy - h * 0.016);
        ctx.lineTo(sx + dir * w * 0.021, sy - h * 0.011);
        ctx.stroke();
      }
    }

    /* Stone 8: rev_rotten_beam_ropes around (0.82, 0.36) */
    ctx.strokeStyle = PALETTE.rotten_beam;
    ctx.lineWidth = Math.max(5, w * 0.018);
    ctx.beginPath();
    ctx.moveTo(w * 0.76, h * 0.73);
    ctx.lineTo(w * 0.775, h * 0.24);
    ctx.lineTo(w * 0.905, h * 0.275);
    ctx.stroke();
    for (var rp = 0; rp < 3; rp += 1) {
      var rx0 = w * (0.795 + rp * 0.036);
      var ry0 = h * (0.252 + rp * 0.009);
      var swing = reducedMotion ? 0 : Math.sin(t * 1.15 + rp * 1.4) * w * 0.0045;
      var ry1 = h * (0.41 + (rp % 2) * 0.045);
      ctx.strokeStyle = PALETTE.hemp_rope;
      ctx.lineWidth = Math.max(1.5, w * 0.003);
      ctx.beginPath();
      ctx.moveTo(rx0, ry0);
      ctx.quadraticCurveTo(rx0 + swing * 0.5, (ry0 + ry1) * 0.5, rx0 + swing, ry1);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(rx0 + swing, ry1 + h * 0.022, w * 0.008, h * 0.021, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    /* Stone 5: rev_tin_piles around (0.28, 0.80) */
    for (var tn = 0; tn < 16; tn += 1) {
      var tx = w * (0.215 + (tn % 6) * 0.022 + (tn > 9 ? 0.014 : 0));
      var ty = h * (0.835 - Math.floor(tn / 6) * 0.032 + (tn % 2) * 0.008);
      ctx.fillStyle = tn % 3 === 0 ? PALETTE.tin_corroded : PALETTE.tin_tarnish;
      ctx.fillRect(tx, ty, w * 0.024, h * 0.026);
      ctx.strokeStyle = "rgba(210, 214, 218, 0.38)";
      ctx.lineWidth = 1;
      ctx.strokeRect(tx, ty, w * 0.024, h * 0.026);
    }

    /* Stone 7: rev_straw_chair_frames around (0.78, 0.80) */
    for (var ch = 0; ch < 2; ch += 1) {
      var cx = w * (0.735 + ch * 0.068), cy = h * (0.79 + ch * 0.02);
      ctx.strokeStyle = "#6B553B";
      ctx.lineWidth = Math.max(1.8, w * 0.0034);
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.032, cy + h * 0.05);
      ctx.lineTo(cx + w * 0.018, cy - h * 0.048);
      ctx.moveTo(cx + w * 0.035, cy + h * 0.044);
      ctx.lineTo(cx - w * 0.022, cy - h * 0.042);
      ctx.moveTo(cx - w * 0.028, cy);
      ctx.lineTo(cx + w * 0.028, cy - h * 0.01);
      ctx.stroke();
      ctx.strokeStyle = PALETTE.straw_splinter;
      ctx.lineWidth = 1.2;
      for (var swi = -3; swi <= 3; swi += 1) {
        ctx.beginPath();
        ctx.moveTo(cx + swi * w * 0.005, cy - h * 0.004);
        ctx.lineTo(cx + swi * w * 0.008, cy + h * 0.024);
        ctx.stroke();
      }
    }
  }

  function render(ctx, opts) {
    if (!ctx) return;
    var o = opts || {};
    var w = Math.max(1, o.width || (ctx.canvas && ctx.canvas.width) || 800);
    var h = Math.max(1, o.height || (ctx.canvas && ctx.canvas.height) || 600);
    var reducedMotion = Boolean(o.reducedMotion);
    var t = reducedMotion ? 0 : (typeof o.timeSec === "number" ? o.timeSec : 0);
    var absCos = typeof o.absCosTheta === "number" ? clamp01(o.absCosTheta)
      : (typeof o.cosTheta === "number" ? clamp01(Math.abs(o.cosTheta)) : 1);
    var raking = 1 - absCos;

    ctx.save();
    drawStageBackdrop(ctx, w, h, t, raking);
    drawBlindWalls(ctx, w, h);
    drawSootPipes(ctx, w, h, t, reducedMotion);
    drawSackclothAndSheetmetal(ctx, w, h, t, reducedMotion, raking);
    drawPlanksRopesAndDebris(ctx, w, h, t, reducedMotion);

    /* Hover & selection oxidized caliper rings */
    var minDim = Math.min(w, h);
    for (var i = 0; i < REVERSE_STONES.length; i += 1) {
      var s = REVERSE_STONES[i];
      var isSel = o.selectedStoneId === s.id;
      var isHov = o.hoveredStoneId === s.id;
      if (!isSel && !isHov) continue;
      var sx = s.u * w, sy = s.v * h, sr = s.r * minDim * (isSel ? 0.92 : 0.84);
      ctx.strokeStyle = isSel ? PALETTE.oxide_select : PALETTE.oxide_hover;
      ctx.lineWidth = isSel ? 2.2 : 1.5;
      ctx.setLineDash(isSel ? [7, 4] : [4, 5]);
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    /* Tactile zero-thickness paper-tension ripple when ripple > 0 */
    var rip = typeof o.ripple === "number" ? clamp01(o.ripple)
      : (o.ripple && typeof o.ripple === "object" ? clamp01(o.ripple.value || o.ripple.intensity || o.ripple.progress || 0) : 0);
    if (rip > 0.001) {
      var ru = (o.ripple && typeof o.ripple.u === "number" ? o.ripple.u : 0.5) * w;
      var rv = (o.ripple && typeof o.ripple.v === "number" ? o.ripple.v : 0.5) * h;
      for (var rr = 1; rr <= 4; rr += 1) {
        var rad = minDim * (0.06 * rr + (1 - rip) * 0.22);
        ctx.strokeStyle = "rgba(242, 145, 94, " + (rip * (0.55 - rr * 0.1)).toFixed(3) + ")";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(ru, rv, rad, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  var STONE_TONES = {
    rev_rusting_sheetmetal: { f1: 82, f2: 129, bp: 420, dur: 0.42, type: "sawtooth" },
    rev_sackcloth_shrouds: { f1: 155, f2: 210, bp: 980, dur: 0.24, type: "triangle" },
    rev_spiked_planks: { f1: 148, f2: 1740, bp: 1520, dur: 0.28, type: "square" },
    rev_soot_pipes: { f1: 216, f2: 338, bp: 340, dur: 0.46, type: "sine" },
    rev_tin_piles: { f1: 890, f2: 1360, bp: 1650, dur: 0.22, type: "square" },
    rev_fading_blind_walls: { f1: 94, f2: 142, bp: 280, dur: 0.26, type: "triangle" },
    rev_straw_chair_frames: { f1: 390, f2: 620, bp: 1850, dur: 0.21, type: "sawtooth" },
    rev_rotten_beam_ropes: { f1: 126, f2: 168, bp: 510, dur: 0.38, type: "sawtooth" }
  };

  function createAudio(audioCtx) {
    var state = { disposed: false, weight: 0, nodes: [], master: null, draftFilter: null, creakFilter: null, noiseBuf: null };
    if (audioCtx && typeof audioCtx.createGain === "function") {
      try {
        var sr = audioCtx.sampleRate || 44100;
        var len = Math.floor(sr * 1.5);
        var buf = audioCtx.createBuffer(1, len, sr);
        var ch = buf.getChannelData(0);
        var last = 0;
        for (var i = 0; i < len; i += 1) {
          var white = hash01(i * 0.73 + 19.1) * 2 - 1;
          last = (last + 0.06 * white) / 1.06;
          ch[i] = last * 2.4;
        }
        state.noiseBuf = buf;

        var master = audioCtx.createGain();
        master.gain.value = 0;
        master.connect(audioCtx.destination);
        state.master = master;

        /* Bandpass-filtered soot-pipe wind draft */
        var noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = buf;
        noiseSrc.loop = true;
        var draftFilter = audioCtx.createBiquadFilter();
        draftFilter.type = "bandpass";
        draftFilter.frequency.value = 230;
        draftFilter.Q.value = 4.8;
        var draftGain = audioCtx.createGain();
        draftGain.gain.value = 0.55;
        noiseSrc.connect(draftFilter);
        draftFilter.connect(draftGain);
        draftGain.connect(master);
        noiseSrc.start(0);
        state.draftFilter = draftFilter;

        /* Creaking oxidized sheet-metal resonance */
        var creakOsc = audioCtx.createOscillator();
        creakOsc.type = "sawtooth";
        creakOsc.frequency.value = 63;
        var creakFilter = audioCtx.createBiquadFilter();
        creakFilter.type = "bandpass";
        creakFilter.frequency.value = 188;
        creakFilter.Q.value = 9.5;
        var creakGain = audioCtx.createGain();
        creakGain.gain.value = 0.14;
        creakOsc.connect(creakFilter);
        creakFilter.connect(creakGain);
        creakGain.connect(master);
        creakOsc.start(0);
        state.creakFilter = creakFilter;
        state.nodes.push(noiseSrc, creakOsc, draftFilter, draftGain, creakFilter, creakGain, master);
      } catch (err) {
        state.master = null;
      }
    }

    return {
      setWeight: function (w, timeSec) {
        if (state.disposed) return;
        var clamped = clamp01(typeof w === "number" ? w : 0);
        state.weight = clamped <= 0.001 ? 0 : clamped;
        if (!state.master || !audioCtx) return;
        try {
          var now = audioCtx.currentTime || 0;
          var target = state.weight === 0 ? 0 : state.weight * 0.22;
          if (typeof state.master.gain.setTargetAtTime === "function") {
            state.master.gain.setTargetAtTime(target, now, 0.035);
          } else {
            state.master.gain.value = target;
          }
          if (state.weight > 0 && state.draftFilter && state.creakFilter) {
            var ts = typeof timeSec === "number" ? timeSec : now;
            state.draftFilter.frequency.value = 220 + Math.sin(ts * 0.43) * 42;
            state.creakFilter.frequency.value = 186 + Math.sin(ts * 0.27 + 1.2) * 34;
          }
        } catch (err) {}
      },
      triggerStone: function (stoneId) {
        if (state.disposed || state.weight <= 0.001 || !state.master || !audioCtx) return;
        var spec = STONE_TONES[stoneId] || STONE_TONES.rev_rusting_sheetmetal;
        try {
          var now = audioCtx.currentTime || 0;
          var osc1 = audioCtx.createOscillator();
          var osc2 = audioCtx.createOscillator();
          var filt = audioCtx.createBiquadFilter();
          var env = audioCtx.createGain();
          osc1.type = spec.type;
          osc2.type = "triangle";
          osc1.frequency.setValueAtTime(spec.f1, now);
          osc1.frequency.exponentialRampToValueAtTime(Math.max(36, spec.f1 * 0.72), now + spec.dur);
          osc2.frequency.setValueAtTime(spec.f2, now);
          filt.type = "bandpass";
          filt.frequency.value = spec.bp;
          filt.Q.value = 3.6;
          env.gain.setValueAtTime(0.28, now);
          env.gain.exponentialRampToValueAtTime(0.0008, now + spec.dur);
          osc1.connect(filt);
          osc2.connect(filt);
          filt.connect(env);
          env.connect(state.master);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + spec.dur + 0.02);
          osc2.stop(now + spec.dur + 0.02);
        } catch (err) {}
      },
      dispose: function () {
        if (state.disposed) return;
        state.disposed = true;
        state.weight = 0;
        for (var i = 0; i < state.nodes.length; i += 1) {
          try { if (typeof state.nodes[i].stop === "function") state.nodes[i].stop(0); } catch (e) {}
          try { if (typeof state.nodes[i].disconnect === "function") state.nodes[i].disconnect(); } catch (e) {}
        }
        state.nodes.length = 0;
      }
    };
  }

  root.MorianaReverseSoot = {
    PALETTE: PALETTE,
    REVERSE_STONES: REVERSE_STONES,
    getStones: getStones,
    hitTest: hitTest,
    render: render,
    createAudio: createAudio
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
