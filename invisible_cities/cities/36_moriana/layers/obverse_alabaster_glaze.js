/* Moriana Obverse Layer — Sunlit Alabaster, Coral, Serpentine, Aquarium Glass & Medusa Chandeliers */
(function () {
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
    sky_zenith: "#4BAEC4",
    sky_mid: "#8ED8E4",
    sun_honey: "#F7CC7C",
    alabaster_glow: "#FFF9EA",
    pavement_warm: "#EFE7D4",
    coral_light: "#E46F5A",
    coral_deep: "#8E2D20",
    serpentine_dark: "#1B4638",
    serpentine_vein: "#8BD4BA",
    caustic_aqua: "#84ECF5"
  });

  var OBVERSE_STONES = Object.freeze([
    Object.freeze({
      id: "obv_alabaster_gates",
      index: 0,
      face: "obverse",
      label: "Alabaster Gates",
      calvino_stone: "gates of alabaster transparent in the sunlight",
      u: 0.16,
      v: 0.52,
      r: 0.12,
      counterpartId: "rev_fading_blind_walls",
      material: "Sun-transmitting veined white alabaster",
      whisper: "Noon pours straight through the pale stone leaves: honeyed mineral veins kindle from within as passing figures glow like warm amber silhouettes."
    }),
    Object.freeze({
      id: "obv_coral_columns",
      index: 1,
      face: "obverse",
      label: "Coral Columns",
      calvino_stone: "coral columns supporting pediments",
      u: 0.36,
      v: 0.56,
      r: 0.11,
      counterpartId: "rev_spiked_planks",
      material: "Vermilion reef-coral shafts on polished marble plinths",
      whisper: "Salt-polished shafts of sea-vermilion coral rise from gleaming white plinths, their carved branching capitals holding the glare off the bay."
    }),
    Object.freeze({
      id: "obv_serpentine_pediments",
      index: 2,
      face: "obverse",
      label: "Serpentine Pediments",
      calvino_stone: "pediments encrusted with serpentine",
      u: 0.48,
      v: 0.24,
      r: 0.12,
      counterpartId: "rev_soot_pipes",
      material: "Triangular marble gables encrusted with dark veined green serpentine",
      whisper: "High classical tympanums inlaid with sea-dark serpentine catch the coastal zenith in undulating ribbons of jade and pale celadon."
    }),
    Object.freeze({
      id: "obv_glass_aquarium_villas",
      index: 3,
      face: "obverse",
      label: "Glass Aquarium Villas",
      calvino_stone: "villas all of glass like aquariums",
      u: 0.68,
      v: 0.58,
      r: 0.13,
      counterpartId: "rev_rusting_sheetmetal",
      material: "Plate crystal water-walls & turquoise caustic galleries",
      whisper: "Walls of clear water-glass repeat portico behind portico into deceptive turquoise depth, trellised by drifting rings of refracted sunlight."
    }),
    Object.freeze({
      id: "obv_medusa_dancers",
      index: 4,
      face: "obverse",
      label: "Medusa Chandeliers & Scaled Dancers",
      calvino_stone: "shadows of dancing girls with silvery scales swim beneath medusa-shaped chandeliers",
      u: 0.82,
      v: 0.44,
      r: 0.13,
      counterpartId: "rev_rotten_beam_ropes",
      material: "Blown crystal medusa bells & glinting silver-scaled reflections",
      whisper: "Under translucent glass bells trailing spun-crystal tentacles, lithe shadows of dancers turn and swim with tiny flashes of silvery scales."
    })
  ]);

  function clamp(val, lo, hi) {
    return val < lo ? lo : val > hi ? hi : val;
  }

  function getStones() {
    return OBVERSE_STONES.slice();
  }

  function hitTest(u, v) {
    if (!Number.isFinite(u) || !Number.isFinite(v)) {
      return null;
    }
    var best = null;
    var bestDist = Infinity;
    for (var i = 0; i < OBVERSE_STONES.length; i += 1) {
      var s = OBVERSE_STONES[i];
      var d = Math.hypot(u - s.u, v - s.v);
      if (d <= s.r * 1.15 && d < bestDist) {
        bestDist = d;
        best = s;
      }
    }
    return best;
  }

  function drawSkyAndBay(ctx, w, h, t, cosTheta) {
    var horizonY = h * 0.61;
    var skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, PALETTE.sky_zenith);
    skyGrad.addColorStop(0.52, PALETTE.sky_mid);
    skyGrad.addColorStop(0.86, "#DDF2F2");
    skyGrad.addColorStop(1, PALETTE.alabaster_sun);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizonY + 2);

    /* Coastal sun corona casting translucent golden warmth toward the alabaster gates */
    var sunX = w * (0.19 + 0.02 * (1 - cosTheta));
    var sunY = h * 0.15;
    var sunR = Math.max(w, h) * 0.42;
    var sunGrad = ctx.createRadialGradient(sunX, sunY, sunR * 0.02, sunX, sunY, sunR);
    sunGrad.addColorStop(0, "rgba(255, 252, 238, 0.96)");
    sunGrad.addColorStop(0.18, "rgba(247, 204, 124, 0.52)");
    sunGrad.addColorStop(0.55, "rgba(245, 239, 226, 0.18)");
    sunGrad.addColorStop(1, "rgba(245, 239, 226, 0)");
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, w, horizonY);

    /* Distant turquoise bay band glimpsed between porticoes and glass villas */
    var seaTop = h * 0.545;
    var seaGrad = ctx.createLinearGradient(0, seaTop, 0, horizonY);
    seaGrad.addColorStop(0, "#248799");
    seaGrad.addColorStop(0.55, PALETTE.aquarium_cyan);
    seaGrad.addColorStop(1, "#9EE4EC");
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, seaTop, w, horizonY - seaTop);

    ctx.fillStyle = "rgba(255, 250, 235, 0.42)";
    for (var i = 0; i < 18; i += 1) {
      var phase = t * 0.7 + i * 1.37;
      var gx = ((i * 0.058 + 0.02 * Math.sin(phase)) % 1) * w;
      var gy = seaTop + ((i * 17) % 10) * 0.006 * h;
      var gw = w * (0.018 + 0.008 * Math.cos(phase));
      ctx.fillRect(gx, gy, gw, 1.6);
    }
  }

  function drawAlabasterPavement(ctx, w, h, t, cosTheta) {
    var horizonY = h * 0.61;
    var vpX = w * (0.55 + 0.03 * (1 - cosTheta));
    var vpY = h * 0.50;

    var floorGrad = ctx.createLinearGradient(0, horizonY, 0, h);
    floorGrad.addColorStop(0, "#FAF6EC");
    floorGrad.addColorStop(0.38, PALETTE.alabaster_sun);
    floorGrad.addColorStop(0.78, PALETTE.pavement_warm);
    floorGrad.addColorStop(1, "#D7E8EA");
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, horizonY, w, h - horizonY);

    /* Turquoise coastal reflections shimmering across polished alabaster slabs */
    var reflGrad = ctx.createLinearGradient(w * 0.15, horizonY, w * 0.92, h);
    reflGrad.addColorStop(0, "rgba(247, 204, 124, 0.16)");
    reflGrad.addColorStop(0.45, "rgba(54, 168, 184, 0.14)");
    reflGrad.addColorStop(0.85, "rgba(54, 168, 184, 0.24)");
    reflGrad.addColorStop(1, "rgba(217, 237, 242, 0.20)");
    ctx.fillStyle = reflGrad;
    ctx.fillRect(0, horizonY, w, h - horizonY);

    /* Illusory receding colonnade arches multiplying Moriana's repertory of images */
    for (var depth = 4; depth >= 1; depth -= 1) {
      var frac = depth * 0.14;
      var rx = vpX * frac + w * 0.24 * (1 - frac);
      var rw = w * 0.64 * (1 - frac * 0.72);
      var ry = vpY * frac + h * 0.28 * (1 - frac);
      var rh = horizonY - ry;
      ctx.strokeStyle = "rgba(255, 252, 244, " + (0.22 + (4 - depth) * 0.07).toFixed(2) + ")";
      ctx.lineWidth = Math.max(1, (5 - depth) * 0.75);
      ctx.strokeRect(rx, ry, rw, rh);
    }

    /* Converging perspective flagstone joints */
    ctx.strokeStyle = "rgba(54, 168, 184, 0.20)";
    ctx.lineWidth = 1;
    for (var r = -8; r <= 10; r += 1) {
      var bx = vpX + r * w * 0.11;
      var t0 = (horizonY - vpY) / (h - vpY);
      var hx = vpX + (bx - vpX) * t0;
      ctx.beginPath();
      ctx.moveTo(hx, horizonY);
      ctx.lineTo(bx, h);
      ctx.stroke();
    }
    for (var row = 1; row <= 9; row += 1) {
      var p = Math.pow(row / 9, 1.85);
      var yLine = horizonY + p * (h - horizonY);
      ctx.strokeStyle = row % 2 === 0 ? "rgba(255, 255, 255, 0.55)" : "rgba(46, 107, 86, 0.13)";
      ctx.beginPath();
      ctx.moveTo(0, yLine);
      ctx.lineTo(w, yLine);
      ctx.stroke();
    }
  }

  function drawAlabasterGates(ctx, w, h, t, cosTheta) {
    var cx = 0.16 * w;
    var cy = 0.52 * h;
    var gw = w * 0.17;
    var gh = h * 0.40;
    var base = h * 0.71;
    var top = base - gh;
    var left = cx - gw * 0.5;

    /* Sunbeam fan pouring through translucent alabaster onto the pavement */
    var beamGrad = ctx.createLinearGradient(cx - gw * 0.4, top + gh * 0.3, cx + gw * 0.9, h * 0.92);
    beamGrad.addColorStop(0, "rgba(255, 249, 230, 0.52)");
    beamGrad.addColorStop(0.5, "rgba(247, 204, 124, 0.25)");
    beamGrad.addColorStop(1, "rgba(247, 204, 124, 0)");
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(left + gw * 0.12, base);
    ctx.lineTo(left + gw * 0.88, base);
    ctx.lineTo(cx + gw * 1.15, h * 0.94);
    ctx.lineTo(cx - gw * 0.55, h * 0.94);
    ctx.closePath();
    ctx.fill();

    /* Outer alabaster pylon with subsurface golden-honeyed refraction */
    var stoneGrad = ctx.createRadialGradient(
      cx - gw * 0.12, top + gh * 0.28, gw * 0.04,
      cx, cy, gw * 0.85
    );
    stoneGrad.addColorStop(0, "rgba(255, 252, 240, 0.97)");
    stoneGrad.addColorStop(0.42, "rgba(248, 221, 162, 0.88)");
    stoneGrad.addColorStop(0.82, "rgba(245, 239, 226, 0.80)");
    stoneGrad.addColorStop(1, "rgba(218, 204, 178, 0.86)");

    ctx.fillStyle = stoneGrad;
    ctx.beginPath();
    ctx.moveTo(left, base);
    ctx.lineTo(left, top + gh * 0.22);
    ctx.quadraticCurveTo(cx, top - gh * 0.06, left + gw, top + gh * 0.22);
    ctx.lineTo(left + gw, base);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 253, 246, 0.92)";
    ctx.lineWidth = 2;
    ctx.stroke();

    /* Twin arched translucent alabaster gate leaves + warm silhouettes visible inside stone */
    for (var leaf = 0; leaf < 2; leaf += 1) {
      var lx = left + gw * (leaf === 0 ? 0.13 : 0.53);
      var lw = gw * 0.34;
      var lTop = top + gh * 0.24;
      var pulse = 0.84 + 0.06 * Math.sin(t * 1.1 + leaf) * cosTheta;
      ctx.fillStyle = "rgba(255, 245, 214, " + pulse.toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(lx, base);
      ctx.lineTo(lx, lTop + lw * 0.55);
      ctx.arc(lx + lw * 0.5, lTop + lw * 0.55, lw * 0.5, Math.PI, 0);
      ctx.lineTo(lx + lw, base);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(214, 166, 92, 0.52)";
      ctx.lineWidth = 1.3;
      ctx.stroke();

      /* Delicate amber mineral veins inside the translucent alabaster slab */
      ctx.strokeStyle = "rgba(206, 152, 78, 0.34)";
      ctx.lineWidth = 1;
      for (var vIdx = 0; vIdx < 4; vIdx += 1) {
        var vy = lTop + gh * (0.16 + vIdx * 0.14);
        ctx.beginPath();
        ctx.moveTo(lx + 2, vy);
        ctx.bezierCurveTo(lx + lw * 0.35, vy - 6, lx + lw * 0.65, vy + 7, lx + lw - 2, vy - 2);
        ctx.stroke();
      }
    }

    /* Warm backlit figure silhouette glimpsed through translucent alabaster */
    var figX = left + gw * 0.31;
    var figY = base - gh * 0.18;
    ctx.fillStyle = "rgba(186, 134, 68, 0.28)";
    ctx.beginPath();
    ctx.arc(figX, figY - gh * 0.11, gw * 0.028, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(figX, figY, gw * 0.042, gh * 0.10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPedimentsAndCoralColumns(ctx, w, h, t, cosTheta) {
    var pedX = 0.48 * w;
    var pedY = 0.24 * h;
    var pedW = w * 0.31;
    var pedH = h * 0.15;
    var corniceY = pedY + pedH * 0.52;
    var apexY = pedY - pedH * 0.58;
    var baseY = h * 0.72;

    /* Echoed secondary trompe-l'oeil pediment slightly recessed */
    var echoShift = w * 0.022 * (0.4 + 0.6 * cosTheta);
    ctx.fillStyle = "rgba(46, 107, 86, 0.32)";
    ctx.beginPath();
    ctx.moveTo(pedX - pedW * 0.46 + echoShift, corniceY + 8);
    ctx.lineTo(pedX + echoShift, apexY + 10);
    ctx.lineTo(pedX + pedW * 0.46 + echoShift, corniceY + 8);
    ctx.closePath();
    ctx.fill();

    /* Primary triangular pediment encrusted with dark veined green serpentine marble */
    var serpGrad = ctx.createLinearGradient(pedX - pedW * 0.5, apexY, pedX + pedW * 0.5, corniceY);
    serpGrad.addColorStop(0, PALETTE.serpentine_dark);
    serpGrad.addColorStop(0.5, PALETTE.serpentine_jade);
    serpGrad.addColorStop(1, "#1F5241");
    ctx.fillStyle = serpGrad;
    ctx.beginPath();
    ctx.moveTo(pedX - pedW * 0.5, corniceY);
    ctx.lineTo(pedX, apexY);
    ctx.lineTo(pedX + pedW * 0.5, corniceY);
    ctx.closePath();
    ctx.fill();

    /* Serpentine mineral veins & jade oculus inlay inside the tympanum */
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = PALETTE.serpentine_vein;
    ctx.lineWidth = 1.4;
    for (var sv = -4; sv <= 4; sv += 1) {
      var sx = pedX + sv * pedW * 0.095;
      ctx.beginPath();
      ctx.moveTo(sx - 18, corniceY + 4);
      ctx.bezierCurveTo(sx - 6, pedY + 8, sx + 14, pedY - 12, sx + 6, apexY - 6);
      ctx.stroke();
    }
    ctx.restore();

    /* Gleaming alabaster cornice frame & entablature architrave */
    ctx.strokeStyle = PALETTE.alabaster_sun;
    ctx.lineWidth = Math.max(3, h * 0.006);
    ctx.beginPath();
    ctx.moveTo(pedX - pedW * 0.52, corniceY);
    ctx.lineTo(pedX, apexY - 2);
    ctx.lineTo(pedX + pedW * 0.52, corniceY);
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = PALETTE.alabaster_sun;
    ctx.fillRect(pedX - pedW * 0.51, corniceY, pedW * 1.02, h * 0.026);
    ctx.fillStyle = PALETTE.serpentine_jade;
    ctx.beginPath();
    ctx.arc(pedX, pedY + pedH * 0.05, Math.min(w, h) * 0.022, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PALETTE.serpentine_vein;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    /* Vermilion-red reef coral columns supporting the pediment (focal pair around u=0.36, v=0.56) */
    var colUs = [0.335, 0.385, 0.485, 0.565];
    var shaftTop = corniceY + h * 0.026;
    for (var c = 0; c < colUs.length; c += 1) {
      var colX = colUs[c] * w;
      var colR = w * (c < 2 ? 0.0115 : 0.0098);
      var plinthH = h * 0.042;
      var shaftBot = baseY - plinthH;

      /* Watery coral reflection on gleaming alabaster floor */
      var cRefl = ctx.createLinearGradient(0, baseY, 0, baseY + h * 0.14);
      cRefl.addColorStop(0, "rgba(200, 75, 57, 0.26)");
      cRefl.addColorStop(1, "rgba(54, 168, 184, 0)");
      ctx.fillStyle = cRefl;
      ctx.fillRect(colX - colR * 0.9, baseY, colR * 1.8, h * 0.14);

      /* Gleaming stepped white marble plinth */
      ctx.fillStyle = "#FAF6EC";
      ctx.fillRect(colX - colR * 1.85, shaftBot, colR * 3.7, plinthH * 0.55);
      ctx.fillStyle = "#E4DCC8";
      ctx.fillRect(colX - colR * 2.25, shaftBot + plinthH * 0.55, colR * 4.5, plinthH * 0.45);

      /* Vermilion reef-coral column shaft */
      var coralGrad = ctx.createLinearGradient(colX - colR, 0, colX + colR, 0);
      coralGrad.addColorStop(0, PALETTE.coral_light);
      coralGrad.addColorStop(0.55, PALETTE.coral_vermilion);
      coralGrad.addColorStop(1, PALETTE.coral_deep);
      ctx.fillStyle = coralGrad;
      ctx.fillRect(colX - colR, shaftTop + h * 0.028, colR * 2, shaftBot - shaftTop - h * 0.028);

      /* Carved branching reef-coral capital */
      ctx.strokeStyle = PALETTE.coral_vermilion;
      ctx.lineWidth = Math.max(2, colR * 0.34);
      for (var br = -2; br <= 2; br += 1) {
        ctx.beginPath();
        ctx.moveTo(colX + br * colR * 0.25, shaftTop + h * 0.036);
        ctx.quadraticCurveTo(colX + br * colR * 0.85, shaftTop + h * 0.014, colX + br * colR * 1.25, shaftTop + 2);
        ctx.stroke();
      }
      ctx.fillStyle = PALETTE.alabaster_sun;
      ctx.fillRect(colX - colR * 1.65, shaftTop, colR * 3.3, h * 0.009);
    }
  }

  function drawGlassAquariumVillas(ctx, w, h, t, cosTheta) {
    var left = w * 0.595;
    var right = w * 0.935;
    var top = h * 0.255;
    var bot = h * 0.735;
    var vw = right - left;
    var vh = bot - top;

    /* Translucent turquoise aquarium water-wall body */
    var glassGrad = ctx.createLinearGradient(left, top, right, bot);
    glassGrad.addColorStop(0, "rgba(217, 237, 242, 0.56)");
    glassGrad.addColorStop(0.42, "rgba(54, 168, 184, 0.44)");
    glassGrad.addColorStop(0.78, "rgba(38, 138, 158, 0.50)");
    glassGrad.addColorStop(1, "rgba(245, 239, 226, 0.46)");
    ctx.fillStyle = glassGrad;
    ctx.fillRect(left, top, vw, vh);

    /* Multiplied illusory perspective corridors nested inside crystal walls */
    var focusX = 0.68 * w + w * 0.025 * (1 - cosTheta);
    var focusY = 0.58 * h;
    for (var k = 1; k <= 5; k += 1) {
      var u = k / 6;
      var rx = left + (focusX - left) * u * 0.72;
      var ry = top + (focusY - top) * u * 0.66;
      var rw = vw * (1 - u * 0.68);
      var rh = vh * (1 - u * 0.64);
      ctx.strokeStyle = "rgba(217, 237, 242, " + (0.72 - k * 0.09).toFixed(2) + ")";
      ctx.lineWidth = Math.max(1, 2.2 - k * 0.25);
      ctx.strokeRect(rx, ry, rw, rh);
    }

    /* Caustic turquoise water-rings & specular glass mullions */
    ctx.save();
    ctx.beginPath();
    ctx.rect(left, top, vw, vh);
    ctx.clip();
    ctx.strokeStyle = "rgba(132, 236, 245, 0.36)";
    ctx.lineWidth = 1.25;
    for (var c = 0; c < 9; c += 1) {
      var cx = left + vw * (0.10 + c * 0.105) + Math.sin(t * 0.9 + c * 1.3) * 6;
      var cy = top + vh * (0.34 + 0.24 * Math.cos(t * 0.65 + c * 0.9));
      var cr = Math.min(vw, vh) * (0.055 + 0.018 * Math.sin(t * 1.1 + c));
      ctx.beginPath();
      ctx.ellipse(cx, cy, cr * 1.45, cr * 0.65, 0.25, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255, 255, 255, 0.62)";
    ctx.lineWidth = 1.4;
    for (var m = 1; m <= 3; m += 1) {
      var mx = left + (vw * m) / 4;
      ctx.beginPath();
      ctx.moveTo(mx, top);
      ctx.lineTo(mx, bot);
      ctx.stroke();
    }
    ctx.restore();
    ctx.strokeStyle = PALETTE.medusa_silver;
    ctx.lineWidth = 2.2;
    ctx.strokeRect(left, top, vw, vh);
  }

  function drawMedusaDancers(ctx, w, h, t, cosTheta) {
    var bells = [
      { u: 0.765, v: 0.385, scale: 0.76 },
      { u: 0.820, v: 0.355, scale: 1.05 },
      { u: 0.878, v: 0.395, scale: 0.82 }
    ];
    var unit = Math.min(w, h);

    /* Blown-crystal medusa-shaped chandeliers: translucent bells + trailing glass tentacles */
    for (var b = 0; b < bells.length; b += 1) {
      var bx = bells[b].u * w;
      var by = bells[b].v * h;
      var br = unit * 0.036 * bells[b].scale;

      ctx.strokeStyle = "rgba(255, 255, 255, 0.72)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(bx, h * 0.255);
      ctx.lineTo(bx, by - br * 0.85);
      ctx.stroke();

      var bellGrad = ctx.createRadialGradient(bx, by - br * 0.25, br * 0.08, bx, by, br * 1.25);
      bellGrad.addColorStop(0, "rgba(255, 255, 255, 0.96)");
      bellGrad.addColorStop(0.55, "rgba(217, 237, 242, 0.78)");
      bellGrad.addColorStop(1, "rgba(132, 236, 245, 0.24)");
      ctx.fillStyle = bellGrad;
      ctx.beginPath();
      ctx.arc(bx, by, br, Math.PI, 0, false);
      ctx.quadraticCurveTo(bx, by + br * 0.28, bx - br, by);
      ctx.closePath();
      ctx.fill();

      for (var ten = -3; ten <= 3; ten += 1) {
        var tx0 = bx + ten * br * 0.26;
        var sway = Math.sin(t * 1.5 + b * 1.2 + ten * 0.7) * br * 0.28;
        var len = br * (1.85 + (3 - Math.abs(ten)) * 0.28);
        ctx.strokeStyle = "rgba(217, 237, 242, 0.76)";
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.moveTo(tx0, by + br * 0.08);
        ctx.bezierCurveTo(tx0 + sway * 0.6, by + len * 0.45, tx0 - sway * 0.5, by + len * 0.78, tx0 + sway * 0.35, by + len);
        ctx.stroke();
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(tx0 + sway * 0.35, by + len, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* Swimming shadows of dancing girls with glinting silvery scales around (0.82*w, 0.44..0.58*h) */
    var dancers = [0.775, 0.822, 0.868];
    for (var d = 0; d < dancers.length; d += 1) {
      var glide = Math.sin(t * 1.35 + d * 2.1) * unit * 0.012;
      var dx = dancers[d] * w + glide;
      var dy = (0.535 + (d === 1 ? -0.025 : 0.015)) * h + Math.cos(t * 1.1 + d) * unit * 0.008;
      var ds = unit * (d === 1 ? 0.068 : 0.056);

      ctx.fillStyle = "rgba(20, 74, 92, " + (0.38 + 0.10 * cosTheta).toFixed(2) + ")";
      ctx.beginPath();
      ctx.arc(dx, dy - ds * 0.62, ds * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(dx - ds * 0.38, dy - ds * 0.48);
      ctx.quadraticCurveTo(dx, dy - ds * 0.22, dx + ds * 0.42, dy - ds * 0.56);
      ctx.quadraticCurveTo(dx + ds * 0.16, dy + ds * 0.12, dx + ds * 0.34, dy + ds * 0.65);
      ctx.quadraticCurveTo(dx, dy + ds * 0.48, dx - ds * 0.30, dy + ds * 0.68);
      ctx.closePath();
      ctx.fill();

      /* Glinting diamond silvery scales along each dancer silhouette */
      for (var sc = 0; sc < 6; sc += 1) {
        var sx = dx + ((sc % 3) - 1) * ds * 0.11;
        var sy = dy - ds * 0.16 + Math.floor(sc / 3) * ds * 0.24;
        var glint = 0.62 + 0.38 * Math.abs(Math.sin(t * 2.4 + d * 1.7 + sc));
        ctx.fillStyle = "rgba(235, 249, 255, " + glint.toFixed(2) + ")";
        ctx.beginPath();
        ctx.moveTo(sx, sy - 2.6);
        ctx.lineTo(sx + 2.2, sy);
        ctx.lineTo(sx, sy + 2.6);
        ctx.lineTo(sx - 2.2, sy);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  function drawHalosAndRipple(ctx, w, h, opts, t) {
    var unit = Math.min(w, h);
    var selId = opts && opts.selectedStoneId;
    var hovId = opts && opts.hoveredStoneId;
    var focalStone = null;

    for (var i = 0; i < OBVERSE_STONES.length; i += 1) {
      var s = OBVERSE_STONES[i];
      var isSel = s.id === selId;
      var isHov = s.id === hovId;
      if (!isSel && !isHov) {
        continue;
      }
      if (isSel || !focalStone) {
        focalStone = s;
      }
      var hx = s.u * w;
      var hy = s.v * h;
      var hr = s.r * unit * (isSel ? 0.78 : 0.68) * (1 + 0.03 * Math.sin(t * 2.4));
      ctx.strokeStyle = isSel ? "rgba(255, 250, 232, 0.94)" : "rgba(217, 237, 242, 0.76)";
      ctx.lineWidth = isSel ? 2.4 : 1.5;
      ctx.beginPath();
      ctx.arc(hx, hy, hr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "rgba(54, 168, 184, 0.55)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(hx, hy, hr * 1.12, 0, Math.PI * 2);
      ctx.stroke();
    }

    var rawRipple = opts ? opts.ripple : 0;
    var ripple = 0;
    var ripU = focalStone ? focalStone.u : 0.5;
    var ripV = focalStone ? focalStone.v : 0.5;
    if (typeof rawRipple === "number" && Number.isFinite(rawRipple)) {
      ripple = Math.max(0, rawRipple);
    } else if (rawRipple && typeof rawRipple === "object") {
      ripple = Number.isFinite(rawRipple.strength)
        ? Math.max(0, rawRipple.strength)
        : (Number.isFinite(rawRipple.amp) ? Math.max(0, rawRipple.amp) : (rawRipple.active === false ? 0 : 0.75));
      if (Number.isFinite(rawRipple.u)) {
        ripU = rawRipple.u;
      }
      if (Number.isFinite(rawRipple.v)) {
        ripV = rawRipple.v;
      }
    }
    if (ripple > 0) {
      var rx = ripU * w;
      var ry = ripV * h;
      var amp = clamp(ripple, 0, 1.5);
      for (var ring = 1; ring <= 4; ring += 1) {
        var rad = unit * (0.06 * ring + (1 - Math.min(1, amp)) * 0.24);
        ctx.strokeStyle = "rgba(255, 250, 236, " + (0.55 * Math.min(1, amp) / ring).toFixed(3) + ")";
        ctx.lineWidth = 2.1 - ring * 0.3;
        ctx.beginPath();
        ctx.arc(rx, ry, rad, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function render(ctx, opts) {
    if (!ctx) {
      return;
    }
    var o = opts || {};
    var width = Number.isFinite(o.width) && o.width > 0 ? o.width : 1280;
    var height = Number.isFinite(o.height) && o.height > 0 ? o.height : 800;
    var reducedMotion = Boolean(o.reducedMotion);
    var animT = reducedMotion ? 0 : (Number.isFinite(o.timeSec) ? o.timeSec : 0);
    var cosTheta = clamp(Number.isFinite(o.cosTheta) ? Math.abs(o.cosTheta) : 1, 0, 1);

    ctx.save();
    drawSkyAndBay(ctx, width, height, animT, cosTheta);
    drawAlabasterPavement(ctx, width, height, animT, cosTheta);
    drawAlabasterGates(ctx, width, height, animT, cosTheta);
    drawPedimentsAndCoralColumns(ctx, width, height, animT, cosTheta);
    drawGlassAquariumVillas(ctx, width, height, animT, cosTheta);
    drawMedusaDancers(ctx, width, height, animT, cosTheta);
    drawHalosAndRipple(ctx, width, height, o, animT);
    ctx.restore();
  }

  var STONE_CHORDS = Object.freeze({
    obv_alabaster_gates: [587.33, 880.0],
    obv_coral_columns: [659.25, 987.77],
    obv_serpentine_pediments: [739.99, 1108.73],
    obv_glass_aquarium_villas: [880.0, 1318.51, 1760.0],
    obv_medusa_dancers: [987.77, 1479.98, 1975.53]
  });

  function createAudio(audioCtx) {
    var disposed = false;
    var currentWeight = 0;
    var started = false;
    var oscList = [];
    var nodeList = [];
    var masterGain = null;
    var toneBus = null;

    if (audioCtx && typeof audioCtx.createGain === "function") {
      try {
        masterGain = audioCtx.createGain();
        masterGain.gain.value = 0;
        if (audioCtx.destination) {
          masterGain.connect(audioCtx.destination);
        }
        nodeList.push(masterGain);
      } catch (e0) {
        masterGain = null;
      }
    }

    function ensureHarmonicaVoices() {
      if (started || disposed || !audioCtx || !masterGain || typeof audioCtx.createOscillator !== "function") {
        return;
      }
      started = true;
      try {
        var shimmerBus = audioCtx.createGain();
        shimmerBus.gain.value = 1.0;
        shimmerBus.connect(masterGain);
        nodeList.push(shimmerBus);
        toneBus = shimmerBus;
        if (typeof audioCtx.createBiquadFilter === "function") {
          var filt = audioCtx.createBiquadFilter();
          filt.type = "lowpass";
          filt.frequency.value = 2600;
          filt.Q.value = 1.8;
          filt.connect(shimmerBus);
          nodeList.push(filt);
          toneBus = filt;
        }
        var partials = [
          { f: 587.33, type: "sine", g: 0.045 },
          { f: 880.00, type: "sine", g: 0.036 },
          { f: 1174.66, type: "triangle", g: 0.016 },
          { f: 1760.00, type: "sine", g: 0.012 }
        ];
        for (var i = 0; i < partials.length; i += 1) {
          var osc = audioCtx.createOscillator();
          var gNode = audioCtx.createGain();
          osc.type = partials[i].type;
          osc.frequency.value = partials[i].f;
          gNode.gain.value = partials[i].g;
          osc.connect(gNode);
          gNode.connect(toneBus);
          osc.start();
          oscList.push(osc);
          nodeList.push(gNode);
        }
        var lfo = audioCtx.createOscillator();
        var lfoGain = audioCtx.createGain();
        lfo.type = "sine";
        lfo.frequency.value = 0.44;
        lfoGain.gain.value = 0.12;
        lfo.connect(lfoGain);
        if (shimmerBus && shimmerBus.gain) {
          lfoGain.connect(shimmerBus.gain);
        }
        lfo.start();
        oscList.push(lfo);
        nodeList.push(lfoGain);
      } catch (e1) {
        /* Graceful fallback in constrained headless audio environments */
      }
    }

    function setWeight(w, timeSec) {
      if (disposed) {
        return;
      }
      var clean = Number.isFinite(w) ? clamp(w, 0, 1) : 0;
      currentWeight = clean <= 0.001 ? 0 : clean;
      if (!masterGain || !masterGain.gain) {
        return;
      }
      var now = Number.isFinite(timeSec)
        ? timeSec
        : (audioCtx && Number.isFinite(audioCtx.currentTime) ? audioCtx.currentTime : 0);
      try {
        if (typeof masterGain.gain.cancelScheduledValues === "function") {
          masterGain.gain.cancelScheduledValues(now);
        }
        if (currentWeight <= 0.001) {
          if (typeof masterGain.gain.setValueAtTime === "function") {
            masterGain.gain.setValueAtTime(0, now);
          }
          masterGain.gain.value = 0;
        } else {
          ensureHarmonicaVoices();
          var target = currentWeight * 0.24;
          if (typeof masterGain.gain.setTargetAtTime === "function") {
            masterGain.gain.setTargetAtTime(target, now, 0.05);
          } else {
            masterGain.gain.value = target;
          }
        }
      } catch (e2) {
        masterGain.gain.value = currentWeight <= 0.001 ? 0 : currentWeight * 0.24;
      }
    }

    function triggerStone(stoneId) {
      if (disposed || currentWeight <= 0.001 || !audioCtx || !masterGain || typeof audioCtx.createOscillator !== "function") {
        return;
      }
      var freqs = STONE_CHORDS[stoneId] || STONE_CHORDS.obv_alabaster_gates;
      var now = Number.isFinite(audioCtx.currentTime) ? audioCtx.currentTime : 0;
      var dest = toneBus || masterGain;
      try {
        for (var i = 0; i < freqs.length; i += 1) {
          var osc = audioCtx.createOscillator();
          var env = audioCtx.createGain();
          var startAt = now + i * 0.045;
          osc.type = i === freqs.length - 1 ? "triangle" : "sine";
          osc.frequency.value = freqs[i];
          env.gain.value = 0.0001;
          if (typeof env.gain.setValueAtTime === "function") {
            env.gain.setValueAtTime(0.0001, startAt);
            env.gain.linearRampToValueAtTime(0.09 / freqs.length, startAt + 0.03);
            env.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.62);
          }
          osc.connect(env);
          env.connect(dest);
          osc.start(startAt);
          osc.stop(startAt + 0.66);
        }
      } catch (e3) {
        /* Ignore transient WebAudio scheduling errors */
      }
    }

    function dispose() {
      if (disposed) {
        return;
      }
      disposed = true;
      currentWeight = 0;
      for (var i = 0; i < oscList.length; i += 1) {
        try {
          oscList[i].stop();
          oscList[i].disconnect();
        } catch (e4) {}
      }
      for (var j = 0; j < nodeList.length; j += 1) {
        try {
          nodeList[j].disconnect();
        } catch (e5) {}
      }
      oscList.length = 0;
      nodeList.length = 0;
    }

    return {
      setWeight: setWeight,
      triggerStone: triggerStone,
      dispose: dispose
    };
  }

  var api = Object.freeze({
    PALETTE: PALETTE,
    OBVERSE_STONES: OBVERSE_STONES,
    getStones: getStones,
    hitTest: hitTest,
    render: render,
    createAudio: createAudio
  });

  globalThis.MorianaObverseGlaze = api;
})();
