/* Berenice Shell-0 & Even-Parity Layer: Overt Unjust Machinery */
globalThis.BereniceUnjustMachinery = (function () {
  "use strict";

  const TAU = Math.PI * 2;

  const PALETTE = Object.freeze({
    ironAbyss: "#120f16",
    porphyryVault: "#4d1e32",
    amethystSteam: "#7e4596",
    marbleTriglyph: "#d8d0c1",
    greaseCog: "#3a353b",
    rustRatchet: "#8c3f2b",
    atticCedar: "#242c29",
    linenTunic: "#dfd8c6",
    celeryBroth: "#8ca86c",
    squashBlossomGold: "#e8ad38",
    malignantAmber: "#b55228",
    windowDaylight: "#a8dff5"
  });

  const OVERT_STONES = Object.freeze([
    Object.freeze({
      id: "triglyphs_and_abaci_facade",
      shellDepth: 0,
      parity: "unjust",
      label: "Triglyphs & Solemn Abaci",
      detail: "Fluted marble columns, heavy Doric abaci, and three-grooved triglyphs masking the iron works behind solemn civic stone.",
      normBox: Object.freeze({ x: 0.02, y: 0.02, w: 0.96, h: 0.15 })
    }),
    Object.freeze({
      id: "meat_grinding_iron_gears",
      shellDepth: 0,
      parity: "unjust",
      label: "Meat-Grinding Iron Gears",
      detail: "Nine counter-rotating iron cogwheels, spring ratchets, pistons, and crushing hoppers grinding relentlessly beneath the entablature.",
      normBox: Object.freeze({ x: 0.08, y: 0.17, w: 0.84, h: 0.39 })
    }),
    Object.freeze({
      id: "amethyst_porphyry_bathhouses",
      shellDepth: 0,
      parity: "unjust",
      label: "Amethyst & Porphyry Bathhouses",
      detail: "Crowded vaulted arcades of crimson porphyry and faceted amethyst basins steaming with thick violet court vapor.",
      normBox: Object.freeze({ x: 0.06, y: 0.56, w: 0.88, h: 0.21 })
    }),
    Object.freeze({
      id: "chin_licking_sycophants",
      shellDepth: 0,
      parity: "unjust",
      label: "Chin-Licking Sycophants",
      detail: "Fawning courtiers bowed upon wet marble bath steps, licking magistrates' chins and weaving factional intrigues.",
      normBox: Object.freeze({ x: 0.10, y: 0.77, w: 0.80, h: 0.20 })
    })
  ]);

  const SYCOPHANT_HARANGUES = Object.freeze([
    "Sublime Archon! Your porphyry edict outshines the sun upon the solemn abaci!",
    "Feed the upper hoppers! Every iron tooth in the rotunda hymns our faction's triumph!",
    "Step into the amethyst basin! Only unbending tongues deserve the warmth of these vaults!",
    "Glory to the heavy entablature! Doubt is treason against the great ratchet wheel!",
    "Grant our circle the highest marble step! None bow closer to your anointed chin than we!",
    "Seal the bronze warrant at once! Whoever questions the tribunal feeds the lower cogs!"
  ]);

  const GEAR_BLUEPRINTS = Object.freeze([
    { id: 0, nx: 0.41, ny: 0.33, nr: 0.102, teeth: 18, spokes: 6, dir: 1, baseAngle: 0.12, hasPawl: true, hasPiston: false },
    { id: 1, nx: 0.59, ny: 0.33, nr: 0.102, teeth: 18, spokes: 6, dir: -1, baseAngle: 0.29, hasPawl: true, hasPiston: false },
    { id: 2, nx: 0.25, ny: 0.27, nr: 0.074, teeth: 13, spokes: 5, dir: -1, baseAngle: 0.64, hasPawl: true, hasPiston: false },
    { id: 3, nx: 0.75, ny: 0.27, nr: 0.074, teeth: 13, spokes: 5, dir: 1, baseAngle: 0.41, hasPawl: true, hasPiston: false },
    { id: 4, nx: 0.15, ny: 0.41, nr: 0.068, teeth: 12, spokes: 4, dir: 1, baseAngle: 1.05, hasPawl: false, hasPiston: true },
    { id: 5, nx: 0.85, ny: 0.41, nr: 0.068, teeth: 12, spokes: 4, dir: -1, baseAngle: 0.88, hasPawl: false, hasPiston: true },
    { id: 6, nx: 0.32, ny: 0.47, nr: 0.062, teeth: 11, spokes: 4, dir: -1, baseAngle: 0.37, hasPawl: true, hasPiston: false },
    { id: 7, nx: 0.68, ny: 0.47, nr: 0.062, teeth: 11, spokes: 4, dir: 1, baseAngle: 0.93, hasPawl: true, hasPiston: false },
    { id: 8, nx: 0.50, ny: 0.48, nr: 0.056, teeth: 10, spokes: 5, dir: 1, baseAngle: 0.52, hasPawl: false, hasPiston: false }
  ]);

  const MESHED_TEETH_TOTAL = GEAR_BLUEPRINTS.reduce(function (acc, g) { return acc + g.teeth; }, 0);

  const SYCOPHANT_COURTS = Object.freeze([
    { nx: 0.19, ny: 0.85, facing: 1, phase: 0.0 },
    { nx: 0.31, ny: 0.88, facing: -1, phase: 1.1 },
    { nx: 0.44, ny: 0.84, facing: 1, phase: 2.3 },
    { nx: 0.56, ny: 0.86, facing: -1, phase: 3.4 },
    { nx: 0.69, ny: 0.88, facing: 1, phase: 4.5 },
    { nx: 0.81, ny: 0.85, facing: -1, phase: 5.2 }
  ]);

  function clamp(val, lo, hi) {
    const n = Number(val);
    if (!Number.isFinite(n)) return lo;
    return n < lo ? lo : (n > hi ? hi : n);
  }

  function clamp01(val) {
    return clamp(val, 0, 1);
  }

  function drawInvoluteGear(ctx, cx, cy, radius, teeth, spokes, angle, rimFill, webCutFill, accentStroke) {
    if (radius < 1.5) return;
    const rootR = radius * 0.82;
    const tipR = radius * 1.04;
    const hubR = radius * 0.28;
    const innerRimR = radius * 0.66;
    const step = TAU / teeth;

    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a0 = angle + i * step;
      const a1 = a0 + step * 0.18;
      const a2 = a0 + step * 0.34;
      const a3 = a0 + step * 0.56;
      const a4 = a0 + step * 0.72;
      if (i === 0) {
        ctx.moveTo(cx + Math.cos(a0) * rootR, cy + Math.sin(a0) * rootR);
      } else {
        ctx.lineTo(cx + Math.cos(a0) * rootR, cy + Math.sin(a0) * rootR);
      }
      ctx.lineTo(cx + Math.cos(a1) * rootR, cy + Math.sin(a1) * rootR);
      ctx.lineTo(cx + Math.cos(a2) * tipR, cy + Math.sin(a2) * tipR);
      ctx.lineTo(cx + Math.cos(a3) * tipR, cy + Math.sin(a3) * tipR);
      ctx.lineTo(cx + Math.cos(a4) * rootR, cy + Math.sin(a4) * rootR);
    }
    ctx.closePath();
    ctx.fillStyle = rimFill;
    ctx.fill();
    ctx.lineWidth = Math.max(0.8, radius * 0.045);
    ctx.strokeStyle = accentStroke;
    ctx.stroke();

    if (radius > 6) {
      ctx.beginPath();
      ctx.arc(cx, cy, innerRimR, 0, TAU);
      ctx.fillStyle = webCutFill;
      ctx.fill();

      ctx.strokeStyle = rimFill;
      ctx.lineWidth = Math.max(1.2, radius * 0.13);
      for (let s = 0; s < spokes; s++) {
        const sa = angle + (s * TAU) / spokes;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(sa) * (hubR * 0.7), cy + Math.sin(sa) * (hubR * 0.7));
        ctx.lineTo(cx + Math.cos(sa) * (innerRimR * 1.03), cy + Math.sin(sa) * (innerRimR * 1.03));
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.arc(cx, cy, hubR, 0, TAU);
    ctx.fillStyle = accentStroke;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, hubR * 0.42, 0, TAU);
    ctx.fillStyle = webCutFill;
    ctx.fill();
  }

  function drawVaultBackdropAndHoppers(ctx, rx, ry, rw, rh, gears, grinderPhase, malignant) {
    const splitY = ry + rh * 0.56;
    ctx.fillStyle = PALETTE.ironAbyss;
    ctx.fillRect(rx, ry, rw, rh);

    const bathGrad = ctx.createLinearGradient(rx, splitY, rx, ry + rh);
    bathGrad.addColorStop(0, PALETTE.porphyryVault);
    bathGrad.addColorStop(0.65, "#2b1222");
    bathGrad.addColorStop(1, PALETTE.ironAbyss);
    ctx.fillStyle = bathGrad;
    ctx.fillRect(rx, splitY, rw, ry + rh - splitY);

    /* Riveted iron beams & grease-streaked girders in upper gear vault */
    ctx.strokeStyle = malignant ? PALETTE.malignantAmber : PALETTE.greaseCog;
    ctx.lineWidth = Math.max(1, rw * 0.004);
    for (let i = 1; i <= 5; i++) {
      const gx = rx + (rw * i) / 6;
      ctx.beginPath();
      ctx.moveTo(gx, ry + rh * 0.08);
      ctx.lineTo(gx, splitY);
      ctx.stroke();
    }
    ctx.fillStyle = PALETTE.rustRatchet;
    ctx.fillRect(rx + rw * 0.05, splitY - rh * 0.014, rw * 0.90, rh * 0.016);

    /* Twin meat-grinder hopper chutes feeding into central crushing drums */
    const minDim = Math.min(rw, rh);
    const hopperCenters = [0.35, 0.50, 0.65];
    for (let hIdx = 0; hIdx < hopperCenters.length; hIdx++) {
      const hx = rx + rw * hopperCenters[hIdx];
      const topY = ry + rh * 0.13;
      const throatY = ry + rh * 0.25;
      const topHalfW = rw * (hIdx === 1 ? 0.068 : 0.048);
      const throatHalfW = rw * 0.022;

      ctx.beginPath();
      ctx.moveTo(hx - topHalfW, topY);
      ctx.lineTo(hx + topHalfW, topY);
      ctx.lineTo(hx + throatHalfW, throatY);
      ctx.lineTo(hx - throatHalfW, throatY);
      ctx.closePath();
      ctx.fillStyle = PALETTE.greaseCog;
      ctx.fill();
      ctx.strokeStyle = malignant ? PALETTE.malignantAmber : PALETTE.rustRatchet;
      ctx.lineWidth = Math.max(1, minDim * 0.003);
      ctx.stroke();

      /* Reciprocating iron crusher ram inside hopper */
      const stroke = Math.sin(grinderPhase * 2 + hIdx * 1.4) * 0.5 + 0.5;
      const ramY = topY + (throatY - topY) * (0.18 + 0.45 * stroke);
      ctx.fillStyle = PALETTE.rustRatchet;
      ctx.fillRect(hx - throatHalfW * 0.9, ramY, throatHalfW * 1.8, rh * 0.022);
      ctx.fillStyle = PALETTE.greaseCog;
      ctx.fillRect(hx - rw * 0.005, topY - rh * 0.03, rw * 0.01, ramY - (topY - rh * 0.03));
    }

    /* Crushed particulates dropping through central grinding throat */
    ctx.fillStyle = malignant ? PALETTE.malignantAmber : PALETTE.rustRatchet;
    for (let k = 0; k < 7; k++) {
      const frac = ((grinderPhase * 0.45 + k * 0.143) % 1 + 1) % 1;
      const px = rx + rw * (0.47 + Math.sin(k * 2.1 + grinderPhase) * 0.035);
      const py = ry + rh * (0.31 + frac * 0.22);
      const pr = Math.max(1.1, minDim * 0.0045);
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, TAU);
      ctx.fill();
    }

    /* Lateral iron pistons & connecting rods driven by gears 4 and 5 */
    for (let gIdx = 4; gIdx <= 5; gIdx++) {
      const g = gears[gIdx];
      if (!g) continue;
      const gx = rx + g.nx * rw;
      const gy = ry + g.ny * rh;
      const gr = g.nr * minDim;
      const crankX = gx + Math.cos(g.angle) * (gr * 0.52);
      const crankY = gy + Math.sin(g.angle) * (gr * 0.52);
      const cylX = gx;
      const pisY = ry + rh * 0.22 + Math.sin(g.angle) * (rh * 0.028);

      ctx.fillStyle = "#1d1a21";
      ctx.fillRect(cylX - rw * 0.024, ry + rh * 0.16, rw * 0.048, rh * 0.11);
      ctx.strokeStyle = PALETTE.greaseCog;
      ctx.strokeRect(cylX - rw * 0.024, ry + rh * 0.16, rw * 0.048, rh * 0.11);

      ctx.fillStyle = PALETTE.rustRatchet;
      ctx.fillRect(cylX - rw * 0.02, pisY, rw * 0.04, rh * 0.022);

      ctx.strokeStyle = PALETTE.marbleTriglyph;
      ctx.lineWidth = Math.max(1.2, minDim * 0.0045);
      ctx.beginPath();
      ctx.moveTo(crankX, crankY);
      ctx.lineTo(cylX, pisY + rh * 0.011);
      ctx.stroke();
    }
  }

  function drawMeshedGearTrain(ctx, rx, ry, rw, rh, gears, malignant) {
    const minDim = Math.min(rw, rh);
    const rimColor = malignant ? "#523229" : PALETTE.greaseCog;
    const accentColor = malignant ? PALETTE.malignantAmber : PALETTE.rustRatchet;

    for (let i = 0; i < gears.length; i++) {
      const g = gears[i];
      const cx = rx + g.nx * rw;
      const cy = ry + g.ny * rh;
      const radius = g.nr * minDim;

      drawInvoluteGear(
        ctx,
        cx,
        cy,
        radius,
        g.teeth,
        g.spokes,
        g.angle,
        rimColor,
        PALETTE.ironAbyss,
        accentColor
      );

      /* Spring-loaded ratchet pawl snapping into tooth valleys */
      if (g.hasPawl && radius > 5) {
        const pivotX = cx + (g.dir > 0 ? -radius * 0.78 : radius * 0.78);
        const pivotY = cy - radius * 1.16;
        const toothSnap = Math.abs(Math.sin(g.angle * g.teeth * 0.5));
        const tipX = cx + (g.dir > 0 ? -radius * 0.12 : radius * 0.12);
        const tipY = cy - radius * (0.96 + 0.10 * toothSnap);

        ctx.strokeStyle = accentColor;
        ctx.lineWidth = Math.max(1.3, radius * 0.09);
        ctx.beginPath();
        ctx.moveTo(pivotX, pivotY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(pivotX, pivotY, Math.max(1.4, radius * 0.08), 0, TAU);
        ctx.fillStyle = PALETTE.marbleTriglyph;
        ctx.fill();
      }
    }
  }

  function drawBathhousesAndSycophants(ctx, rx, ry, rw, rh, steamPlumes, intriguePhase, windowsFactor) {
    const minDim = Math.min(rw, rh);
    const arcadeTop = ry + rh * 0.57;
    const poolTop = ry + rh * 0.72;
    const stepBase = ry + rh * 0.94;

    /* Five vaulted porphyry arches framing crystalline amethyst bath niches */
    const archCount = 5;
    const spanW = (rw * 0.88) / archCount;
    const startX = rx + rw * 0.06;
    for (let a = 0; a < archCount; a++) {
      const ax = startX + a * spanW;
      const cx = ax + spanW * 0.5;
      const archR = spanW * 0.42;

      ctx.beginPath();
      ctx.moveTo(ax + spanW * 0.08, stepBase);
      ctx.lineTo(ax + spanW * 0.08, arcadeTop + archR);
      ctx.arc(cx, arcadeTop + archR, archR, Math.PI, 0, false);
      ctx.lineTo(ax + spanW * 0.92, stepBase);
      ctx.closePath();
      ctx.fillStyle = "#240d19";
      ctx.fill();
      ctx.lineWidth = Math.max(1.2, minDim * 0.005);
      ctx.strokeStyle = PALETTE.porphyryVault;
      ctx.stroke();

      /* Faceted amethyst pool basin inside each porphyry bay */
      ctx.beginPath();
      ctx.moveTo(ax + spanW * 0.14, poolTop);
      ctx.lineTo(ax + spanW * 0.86, poolTop);
      ctx.lineTo(ax + spanW * 0.76, poolTop + rh * 0.065);
      ctx.lineTo(ax + spanW * 0.24, poolTop + rh * 0.065);
      ctx.closePath();
      ctx.fillStyle = PALETTE.amethystSteam;
      ctx.fill();

      /* Crystalline amethyst facets & shimmer ripples */
      ctx.strokeStyle = PALETTE.linenTunic;
      ctx.globalAlpha *= 0.38;
      ctx.lineWidth = Math.max(0.8, minDim * 0.0025);
      const ripOffset = Math.sin(intriguePhase + a * 0.9) * spanW * 0.06;
      ctx.beginPath();
      ctx.moveTo(cx - spanW * 0.22 + ripOffset, poolTop + rh * 0.028);
      ctx.lineTo(cx + spanW * 0.22 + ripOffset, poolTop + rh * 0.028);
      ctx.stroke();
      ctx.globalAlpha /= 0.38;
    }

    /* Stepped marble bathhouse podiums across lower undercroft */
    for (let st = 0; st < 3; st++) {
      const sy = ry + rh * (0.79 + st * 0.052);
      const inset = rw * (0.07 + st * 0.018);
      ctx.fillStyle = st % 2 === 0 ? PALETTE.marbleTriglyph : "#b5aca0";
      ctx.globalAlpha *= 0.42;
      ctx.fillRect(rx + inset, sy, rw - inset * 2, rh * 0.018);
      ctx.globalAlpha /= 0.42;
    }

    /* Rising amethyst & porphyry vapor plumes */
    const steamFade = clamp01(1 - windowsFactor * 0.45);
    for (let p = 0; p < steamPlumes.length; p++) {
      const pl = steamPlumes[p];
      const px = rx + rw * (pl.nx + Math.sin(pl.phase + pl.rise * 4.2) * 0.018);
      const py = ry + rh * (0.74 - pl.rise * 0.19);
      const pr = minDim * (0.014 + pl.rise * 0.024);
      ctx.save();
      ctx.globalAlpha *= (1 - pl.rise) * 0.34 * steamFade;
      ctx.fillStyle = p % 2 === 0 ? PALETTE.amethystSteam : PALETTE.porphyryVault;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, TAU);
      ctx.fill();
      ctx.restore();
    }

    /* Six chin-licking sycophants attending bearded magistrates on marble steps */
    if (minDim > 42) {
      for (let c = 0; c < SYCOPHANT_COURTS.length; c++) {
        const court = SYCOPHANT_COURTS[c];
        const mx = rx + court.nx * rw;
        const my = ry + court.ny * rh;
        const dir = court.facing;
        const scale = minDim * 0.012;
        const bob = Math.sin(intriguePhase * 2.2 + court.phase) * scale * 0.35;

        /* Seated/standing pompous magistrate with raised chin */
        ctx.fillStyle = PALETTE.porphyryVault;
        ctx.beginPath();
        ctx.moveTo(mx - scale * 1.4, my + scale * 3.0);
        ctx.lineTo(mx + scale * 1.4, my + scale * 3.0);
        ctx.lineTo(mx + scale * 0.9, my - scale * 1.1);
        ctx.lineTo(mx - scale * 0.9, my - scale * 1.1);
        ctx.closePath();
        ctx.fill();

        const chinX = mx + dir * scale * 0.95;
        const chinY = my - scale * 1.65;
        ctx.fillStyle = PALETTE.marbleTriglyph;
        ctx.beginPath();
        ctx.arc(mx, my - scale * 2.0, scale * 0.95, 0, TAU);
        ctx.fill();
        /* Jutting magistrate beard/chin */
        ctx.beginPath();
        ctx.moveTo(mx, my - scale * 1.6);
        ctx.lineTo(chinX + dir * scale * 0.45, chinY + scale * 0.25);
        ctx.lineTo(mx, my - scale * 0.95);
        ctx.closePath();
        ctx.fill();

        /* Bowed sycophant leaning upward beneath magistrate's chin */
        const sx = mx + dir * scale * 2.8;
        const sy = my + scale * 0.55;
        ctx.fillStyle = PALETTE.ironAbyss;
        ctx.beginPath();
        ctx.moveTo(sx + dir * scale * 1.2, my + scale * 3.0);
        ctx.lineTo(sx - dir * scale * 0.5, my + scale * 3.0);
        ctx.lineTo(sx - dir * scale * 1.1, sy - scale * 0.7 + bob);
        ctx.lineTo(sx + dir * scale * 0.6, sy - scale * 0.2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = "#c9bfb0";
        const headX = sx - dir * scale * 1.05;
        const headY = sy - scale * 1.35 + bob;
        ctx.beginPath();
        ctx.arc(headX, headY, scale * 0.74, 0, TAU);
        ctx.fill();

        /* Flicking sycophant tongue reaching magistrate's chin */
        ctx.strokeStyle = PALETTE.squashBlossomGold;
        ctx.lineWidth = Math.max(1, scale * 0.28);
        ctx.beginPath();
        ctx.moveTo(headX - dir * scale * 0.55, headY - scale * 0.25);
        ctx.lineTo(chinX + dir * scale * 0.15, chinY + scale * 0.15);
        ctx.stroke();

        /* Dotted intrigue filament arching between court alcoves */
        ctx.save();
        ctx.setLineDash([Math.max(2, scale * 0.6), Math.max(2, scale * 0.5)]);
        ctx.strokeStyle = PALETTE.amethystSteam;
        ctx.lineWidth = Math.max(0.9, scale * 0.24);
        ctx.beginPath();
        ctx.moveTo(headX, headY - scale * 0.8);
        ctx.quadraticCurveTo(mx, my - scale * 4.4 - bob, mx - dir * scale * 3.5, my - scale * 1.8);
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  function drawTriglyphAbaciFacade(ctx, rx, ry, rw, rh, peel, malignant) {
    const p = clamp01(peel);
    const minDim = Math.min(rw, rh);
    const entH = rh * (0.168 - p * 0.052);
    const wingW = rw * (0.065 + (1 - p) * 0.405);
    const colBottom = ry + rh * 0.96;
    const stoneFill = malignant ? "#cbbba8" : PALETTE.marbleTriglyph;
    const shadowStone = malignant ? "#8f6d56" : "#9e9688";

    /* Left and right classical marble colonnade wings parting by facadePeel */
    const wings = [
      { x: rx, w: wingW, side: -1 },
      { x: rx + rw - wingW, w: wingW, side: 1 }
    ];

    for (let wIdx = 0; wIdx < 2; wIdx++) {
      const wg = wings[wIdx];
      ctx.fillStyle = stoneFill;
      ctx.save();
      ctx.globalAlpha *= 0.94;
      ctx.fillRect(wg.x, ry + entH, wg.w, colBottom - (ry + entH));
      ctx.restore();

      /* Fluted marble columns & broad solemn Doric abaci capitals */
      const colCount = Math.max(1, Math.round(wg.w / Math.max(12, rw * 0.11)));
      const colSpan = wg.w / colCount;
      for (let c = 0; c < colCount; c++) {
        const cx = wg.x + (c + 0.5) * colSpan;
        const shaftW = colSpan * 0.58;
        const abacusW = colSpan * 0.86;
        const abacusH = rh * 0.026;
        const echinusH = rh * 0.018;

        /* Column shaft + 4 vertical Doric flutes */
        ctx.fillStyle = stoneFill;
        ctx.fillRect(cx - shaftW * 0.5, ry + entH + abacusH + echinusH, shaftW, colBottom - (ry + entH + abacusH + echinusH));
        ctx.strokeStyle = shadowStone;
        ctx.lineWidth = Math.max(0.8, minDim * 0.0022);
        for (let f = -1.5; f <= 1.5; f += 1) {
          const fx = cx + (f / 2.2) * shaftW;
          ctx.beginPath();
          ctx.moveTo(fx, ry + entH + abacusH + echinusH);
          ctx.lineTo(fx, colBottom);
          ctx.stroke();
        }

        /* Solemn heavy abacus slab + echinus cushion */
        ctx.fillStyle = shadowStone;
        ctx.fillRect(cx - abacusW * 0.5, ry + entH, abacusW, abacusH);
        ctx.strokeStyle = PALETTE.ironAbyss;
        ctx.strokeRect(cx - abacusW * 0.5, ry + entH, abacusW, abacusH);
        ctx.beginPath();
        ctx.moveTo(cx - abacusW * 0.46, ry + entH + abacusH);
        ctx.lineTo(cx + abacusW * 0.46, ry + entH + abacusH);
        ctx.lineTo(cx + shaftW * 0.5, ry + entH + abacusH + echinusH);
        ctx.lineTo(cx - shaftW * 0.5, ry + entH + abacusH + echinusH);
        ctx.closePath();
        ctx.fillStyle = stoneFill;
        ctx.fill();
      }
    }

    /* Classical Doric entablature: cornice, three-grooved triglyphs, sculpted metopes */
    const centerSplit = p > 0.55 ? rw * (p - 0.55) * 0.34 : 0;
    const entSegments = centerSplit > 1
      ? [
          { x: rx, w: (rw - centerSplit) * 0.5 },
          { x: rx + (rw + centerSplit) * 0.5, w: (rw - centerSplit) * 0.5 }
        ]
      : [{ x: rx, w: rw }];

    for (let s = 0; s < entSegments.length; s++) {
      const seg = entSegments[s];
      ctx.fillStyle = stoneFill;
      ctx.fillRect(seg.x, ry, seg.w, entH);
      ctx.fillStyle = shadowStone;
      ctx.fillRect(seg.x, ry, seg.w, entH * 0.18);
      ctx.fillRect(seg.x, ry + entH * 0.82, seg.w, entH * 0.18);

      const bayCount = Math.max(3, Math.round(seg.w / Math.max(18, rw * 0.095)));
      const bayW = seg.w / bayCount;
      const trigH = entH * 0.62;
      const trigY = ry + entH * 0.19;
      for (let b = 0; b < bayCount; b++) {
        const bx = seg.x + b * bayW;
        const trigW = bayW * 0.42;
        ctx.fillStyle = "#cfc6b4";
        ctx.fillRect(bx + bayW * 0.06, trigY, trigW, trigH);
        /* Three vertical triglyph glyphs */
        ctx.fillStyle = PALETTE.ironAbyss;
        for (let g = 0; g < 3; g++) {
          const gx = bx + bayW * 0.06 + trigW * (0.18 + g * 0.28);
          ctx.fillRect(gx, trigY + trigH * 0.08, Math.max(1, trigW * 0.10), trigH * 0.84);
        }
        /* Metope relief rondel */
        ctx.strokeStyle = shadowStone;
        ctx.lineWidth = Math.max(0.8, minDim * 0.002);
        ctx.beginPath();
        ctx.arc(bx + bayW * 0.74, trigY + trigH * 0.5, Math.min(bayW * 0.16, trigH * 0.28), 0, TAU);
        ctx.stroke();
      }
    }
  }

  function drawMalignantAndWindowOverlays(ctx, rx, ry, rw, rh, opts) {
    const minDim = Math.min(rw, rh);

    /* Shell >= 2 sour malignant speck inside the Just: amber proscription tablets, embryonic cogs, sour seals */
    if (opts.isMalignantSeed) {
      ctx.save();
      ctx.globalAlpha *= 0.22;
      ctx.fillStyle = PALETTE.malignantAmber;
      ctx.fillRect(rx, ry, rw, rh);
      ctx.restore();

      const tabletXs = [rx + rw * 0.11, rx + rw * 0.80];
      for (let t = 0; t < tabletXs.length; t++) {
        const tx = tabletXs[t];
        const ty = ry + rh * 0.20;
        const tw = rw * 0.09;
        const th = rh * 0.15;
        ctx.fillStyle = PALETTE.malignantAmber;
        ctx.fillRect(tx, ty, tw, th);
        ctx.strokeStyle = PALETTE.squashBlossomGold;
        ctx.lineWidth = Math.max(1, minDim * 0.003);
        ctx.strokeRect(tx, ty, tw, th);
        /* Proscription tally lines */
        ctx.strokeStyle = PALETTE.ironAbyss;
        for (let row = 1; row <= 4; row++) {
          const ly = ty + (th * row) / 5;
          ctx.beginPath();
          ctx.moveTo(tx + tw * 0.16, ly);
          ctx.lineTo(tx + tw * 0.84, ly);
          ctx.stroke();
        }
      }

      /* Pride-hardened embryonic iron cogs & sour octagonal tribunal seal */
      drawInvoluteGear(ctx, rx + rw * 0.50, ry + rh * 0.21, minDim * 0.042, 9, 3, opts.phase * 1.3, PALETTE.malignantAmber, PALETTE.ironAbyss, PALETTE.squashBlossomGold);
      const sealX = rx + rw * 0.50;
      const sealY = ry + rh * 0.64;
      const sealR = minDim * 0.036;
      ctx.beginPath();
      for (let v = 0; v < 8; v++) {
        const va = (v * TAU) / 8 + Math.PI / 8;
        const vx = sealX + Math.cos(va) * sealR;
        const vy = sealY + Math.sin(va) * sealR;
        if (v === 0) ctx.moveTo(vx, vy);
        else ctx.lineTo(vx, vy);
      }
      ctx.closePath();
      ctx.fillStyle = PALETTE.malignantAmber;
      ctx.fill();
      ctx.strokeStyle = PALETTE.linenTunic;
      ctx.stroke();
    }

    /* Sunlit casement shafts when windowsOpenFactor > 0 */
    const wf = clamp01(opts.windowsOpenFactor);
    if (wf > 0.005) {
      const casements = [0.22, 0.50, 0.78];
      for (let i = 0; i < casements.length; i++) {
        const wx = rx + rw * casements[i];
        const wy = ry + rh * 0.12;
        ctx.save();
        ctx.globalAlpha *= 0.26 * wf;
        ctx.fillStyle = PALETTE.windowDaylight;
        ctx.beginPath();
        ctx.moveTo(wx - rw * 0.03, wy);
        ctx.lineTo(wx + rw * 0.03, wy);
        ctx.lineTo(wx + rw * 0.13, ry + rh * 0.94);
        ctx.lineTo(wx - rw * 0.05, ry + rh * 0.94);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = PALETTE.windowDaylight;
        ctx.fillRect(wx - rw * 0.025, wy, rw * 0.05 * wf, rh * 0.045);
      }
    }

    /* Optional canonical stone highlight frame */
    if (opts.highlightStoneId) {
      for (let i = 0; i < OVERT_STONES.length; i++) {
        const st = OVERT_STONES[i];
        if (st.id === opts.highlightStoneId) {
          const bx = rx + st.normBox.x * rw;
          const by = ry + st.normBox.y * rh;
          const bw = st.normBox.w * rw;
          const bh = st.normBox.h * rh;
          ctx.strokeStyle = PALETTE.windowDaylight;
          ctx.lineWidth = Math.max(1.5, minDim * 0.004);
          ctx.strokeRect(bx, by, bw, bh);
        }
      }
    }
  }

  function buildInitialGears() {
    return GEAR_BLUEPRINTS.map(function (bp) {
      return {
        id: bp.id,
        nx: bp.nx,
        ny: bp.ny,
        nr: bp.nr,
        teeth: bp.teeth,
        spokes: bp.spokes,
        dir: bp.dir,
        baseAngle: bp.baseAngle,
        angle: bp.baseAngle,
        hasPawl: bp.hasPawl,
        hasPiston: bp.hasPiston
      };
    });
  }

  function buildInitialSteam() {
    const list = [];
    for (let i = 0; i < 10; i++) {
      list.push({
        nx: 0.12 + i * 0.084,
        rise: (i * 0.19) % 1,
        speed: 0.16 + (i % 3) * 0.05,
        phase: i * 0.85
      });
    }
    return list;
  }

  function createUnjustMachinery(opts) {
    const cfg = opts || {};
    let reducedMotion = Boolean(cfg.reducedMotion);
    let facadePeel = cfg.facadePeel !== undefined ? clamp01(cfg.facadePeel) : 0.44;
    let gears = buildInitialGears();
    let steamPlumes = buildInitialSteam();
    let grinderPhase = 0;
    let intriguePhase = 0;

    /* WebAudio state: safe no-op until unlocked */
    let audioCtx = null;
    let audioMuted = false;
    let masterGain = null;
    let rumbleGain = null;
    let bathFilter = null;
    let droneState = { active: false, unjustWeight: 0.7, facadePeel: facadePeel };

    function advanceByDelta(baseRad, dtEquiv) {
      for (let i = 0; i < gears.length; i++) {
        const g = gears[i];
        const ratio = 14 / g.teeth;
        g.angle = (g.angle + baseRad * g.dir * ratio) % TAU;
      }
      grinderPhase = (grinderPhase + baseRad * 1.35) % (TAU * 4);
      intriguePhase = (intriguePhase + dtEquiv * 1.9) % (TAU * 4);
      for (let p = 0; p < steamPlumes.length; p++) {
        const pl = steamPlumes[p];
        pl.rise = (pl.rise + dtEquiv * pl.speed) % 1;
      }
    }

    function applyAudioDrone() {
      if (!audioCtx || !masterGain || !rumbleGain || !bathFilter) return;
      try {
        const now = audioCtx.currentTime || 0;
        const shouldSound = !audioMuted && droneState.active && audioCtx.state === "running";
        const targetMaster = shouldSound ? 0.16 : 0.0;
        const weight = clamp01(droneState.unjustWeight);
        const peel = clamp01(droneState.facadePeel);
        masterGain.gain.setTargetAtTime(targetMaster, now, 0.06);
        rumbleGain.gain.setTargetAtTime(0.18 + weight * (0.22 + peel * 0.28), now, 0.08);
        bathFilter.frequency.setTargetAtTime(270 + peel * 190, now, 0.08);
      } catch (_err) {
        /* Safe fallback if AudioContext transitions state */
      }
    }

    function getState() {
      const torque = 0.62 + 0.31 * facadePeel + 0.05 * Math.abs(Math.sin(gears[0].angle));
      const intrigue = 0.56 + 0.34 * (1 - facadePeel * 0.35) + 0.06 * Math.abs(Math.cos(intriguePhase));
      return {
        facadePeel: Number(facadePeel.toFixed(4)),
        gearCount: 9,
        meshedTeethCount: MESHED_TEETH_TOTAL,
        sycophantCount: SYCOPHANT_COURTS.length,
        bathhouseIntrigueIndex: Number(clamp01(intrigue).toFixed(3)),
        tyrannyTorque: Number(clamp01(torque).toFixed(3)),
        reducedMotion: reducedMotion,
        audioMuted: audioMuted,
        stonesPresent: OVERT_STONES.map(function (s) { return s.id; })
      };
    }

    return {
      setFacadePeel: function (ratio) {
        facadePeel = clamp01(ratio);
        droneState.facadePeel = facadePeel;
        applyAudioDrone();
        return getState();
      },
      toggleFacadePeel: function () {
        facadePeel = facadePeel < 0.5 ? 0.88 : 0.12;
        droneState.facadePeel = facadePeel;
        applyAudioDrone();
        return getState();
      },
      getFacadePeel: function () {
        return facadePeel;
      },
      setReducedMotion: function (flag) {
        reducedMotion = Boolean(flag);
        return reducedMotion;
      },
      step: function (dtSec, env) {
        const dt = clamp(dtSec, 0, 0.25);
        const speedBoost = env && Number.isFinite(env.facadePeel) ? (0.75 + 0.45 * clamp01(env.facadePeel)) : (0.75 + 0.45 * facadePeel);
        if (!reducedMotion && dt > 0) {
          advanceByDelta(dt * 1.15 * speedBoost, dt);
        }
        return getState();
      },
      nudgeGearStep: function (deltaRad) {
        const rad = Number.isFinite(deltaRad) ? Number(deltaRad) : 0.35;
        advanceByDelta(rad, Math.abs(rad) * 0.55);
        return getState();
      },
      renderUnjustShell: function (ctx, rect, renderOpts) {
        if (!ctx || !rect || !(rect.w > 1) || !(rect.h > 1)) return;
        const ro = renderOpts || {};
        const rx = Number(rect.x) || 0;
        const ry = Number(rect.y) || 0;
        const rw = Number(rect.w) || 0;
        const rh = Number(rect.h) || 0;
        const peel = Number.isFinite(ro.facadePeel) ? clamp01(ro.facadePeel) : facadePeel;
        const depthIdx = Number(ro.depthIndex) || 0;
        const malignant = ro.isMalignantSeed !== undefined ? Boolean(ro.isMalignantSeed) : depthIdx >= 2;
        const winFactor = clamp01(ro.windowsOpenFactor || 0);
        const alpha = ro.alpha !== undefined ? clamp01(ro.alpha) : 1;

        ctx.save();
        ctx.beginPath();
        ctx.rect(rx, ry, rw, rh);
        ctx.clip();
        ctx.globalAlpha *= alpha;

        drawVaultBackdropAndHoppers(ctx, rx, ry, rw, rh, gears, grinderPhase, malignant);
        drawMeshedGearTrain(ctx, rx, ry, rw, rh, gears, malignant);
        drawBathhousesAndSycophants(ctx, rx, ry, rw, rh, steamPlumes, intriguePhase, winFactor);
        drawTriglyphAbaciFacade(ctx, rx, ry, rw, rh, peel, malignant);
        drawMalignantAndWindowOverlays(ctx, rx, ry, rw, rh, {
          isMalignantSeed: malignant,
          windowsOpenFactor: winFactor,
          highlightStoneId: ro.highlightStoneId || null,
          phase: grinderPhase
        });

        ctx.restore();
      },
      inspectAt: function (nx, ny) {
        if (!Number.isFinite(nx) || !Number.isFinite(ny) || nx < 0 || nx > 1 || ny < 0 || ny > 1) {
          return null;
        }
        const wingCover = 0.065 + (1 - facadePeel) * 0.405;
        const entCover = 0.168 - facadePeel * 0.052;
        if (ny <= entCover || ((nx <= wingCover || nx >= 1 - wingCover) && ny <= 0.56)) {
          return OVERT_STONES[0];
        }
        if (ny >= 0.77) return OVERT_STONES[3];
        if (ny >= 0.56) return OVERT_STONES[2];
        return OVERT_STONES[1];
      },
      initAudio: function (extAudioCtx) {
        try {
          if (extAudioCtx) {
            audioCtx = extAudioCtx;
          } else if (!audioCtx && typeof globalThis !== "undefined") {
            const Ctor = globalThis.AudioContext || globalThis.webkitAudioContext;
            if (Ctor) audioCtx = new Ctor();
          }
          if (!audioCtx || masterGain) return Boolean(audioCtx);

          masterGain = audioCtx.createGain();
          masterGain.gain.value = 0;
          masterGain.connect(audioCtx.destination);

          rumbleGain = audioCtx.createGain();
          rumbleGain.gain.value = 0.22;
          const lowpass = audioCtx.createBiquadFilter();
          lowpass.type = "lowpass";
          lowpass.frequency.value = 128;
          const rumbleOsc = audioCtx.createOscillator();
          rumbleOsc.type = "sawtooth";
          rumbleOsc.frequency.value = 46;
          rumbleOsc.connect(lowpass);
          lowpass.connect(rumbleGain);
          rumbleGain.connect(masterGain);
          rumbleOsc.start();

          bathFilter = audioCtx.createBiquadFilter();
          bathFilter.type = "bandpass";
          bathFilter.frequency.value = 330;
          bathFilter.Q.value = 6.2;
          const bathGain = audioCtx.createGain();
          bathGain.gain.value = 0.09;
          const bathOsc = audioCtx.createOscillator();
          bathOsc.type = "triangle";
          bathOsc.frequency.value = 165;
          bathOsc.connect(bathFilter);
          bathFilter.connect(bathGain);
          bathGain.connect(masterGain);
          bathOsc.start();

          applyAudioDrone();
          return true;
        } catch (_err) {
          return false;
        }
      },
      setAudioMuted: function (muted) {
        audioMuted = Boolean(muted);
        applyAudioDrone();
        return audioMuted;
      },
      isAudioMuted: function () {
        return audioMuted;
      },
      triggerEscapementClick: function (strength) {
        if (!audioCtx || audioMuted || !masterGain || audioCtx.state !== "running") return false;
        try {
          const now = audioCtx.currentTime;
          const amp = 0.04 + 0.12 * clamp01(strength === undefined ? 0.6 : strength);
          const osc = audioCtx.createOscillator();
          const clickGain = audioCtx.createGain();
          osc.type = "square";
          osc.frequency.setValueAtTime(580, now);
          osc.frequency.exponentialRampToValueAtTime(145, now + 0.048);
          clickGain.gain.setValueAtTime(amp, now);
          clickGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.052);
          osc.connect(clickGain);
          clickGain.connect(masterGain);
          if (bathFilter) osc.connect(bathFilter);
          osc.start(now);
          osc.stop(now + 0.055);
          return true;
        } catch (_err) {
          return false;
        }
      },
      syncDrone: function (params) {
        const p = params || {};
        if (p.active !== undefined) droneState.active = Boolean(p.active);
        if (p.unjustWeight !== undefined) droneState.unjustWeight = clamp01(p.unjustWeight);
        if (p.facadePeel !== undefined) droneState.facadePeel = clamp01(p.facadePeel);
        applyAudioDrone();
      },
      getHarangues: function () {
        return SYCOPHANT_HARANGUES;
      },
      reset: function () {
        facadePeel = 0.44;
        gears = buildInitialGears();
        steamPlumes = buildInitialSteam();
        grinderPhase = 0;
        intriguePhase = 0;
        droneState.facadePeel = 0.44;
        applyAudioDrone();
        return getState();
      },
      getState: getState
    };
  }

  return Object.freeze({
    PALETTE: PALETTE,
    OVERT_STONES: OVERT_STONES,
    SYCOPHANT_HARANGUES: SYCOPHANT_HARANGUES,
    createUnjustMachinery: createUnjustMachinery
  });
})();

if (typeof window !== "undefined") {
  window.BereniceUnjustMachinery = globalThis.BereniceUnjustMachinery;
}
