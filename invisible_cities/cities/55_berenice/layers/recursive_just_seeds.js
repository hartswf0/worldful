/* Nested concentric seed-microscope & clandestine attic engine for Berenice */
globalThis.BereniceRecursiveSeeds = (function () {
  "use strict";

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

  const SEED_STONES = Object.freeze([
    Object.freeze({
      id: "attic_wires_and_water_tank_counterweights",
      shellDepth: 1,
      parity: "just",
      label: "Under-Stair Wires & Water-Tank Counterweights",
      detail: "Clandestine network linking attics and workshops via taut under-stair tension wires, brass beads, pulleys, ropes, and overhead water-tank counterweights.",
      normBox: Object.freeze({ x: 0.06, y: 0.04, w: 0.88, h: 0.24 })
    }),
    Object.freeze({
      id: "commas_and_parentheses_speech",
      shellDepth: 1,
      parity: "just",
      label: "Speech of Commas & Parentheses",
      detail: "Citizens in sober unbleached linen tunics recognizable without badges by austere, scrupulous speech pronounced with commas and self-qualifying parentheses.",
      normBox: Object.freeze({ x: 0.08, y: 0.30, w: 0.84, h: 0.32 })
    }),
    Object.freeze({
      id: "rice_and_celery_soup",
      shellDepth: 1,
      parity: "just",
      label: "Rice & Celery Vegetable Soup",
      detail: "Simple, fragrant pale-green vegetable broth with white rice grains and crisp celery crescents served quietly at plain pegged wooden tables.",
      normBox: Object.freeze({ x: 0.14, y: 0.64, w: 0.36, h: 0.24 })
    }),
    Object.freeze({
      id: "crisp_fried_squash_flowers",
      shellDepth: 1,
      parity: "just",
      label: "Crisp Fried Squash Flowers",
      detail: "Golden five-petaled squash blossoms fried crisp in a shallow pan, accompanying the frugal evening table of the clandestine garrets.",
      normBox: Object.freeze({ x: 0.50, y: 0.64, w: 0.36, h: 0.24 })
    }),
    Object.freeze({
      id: "malignant_pride_speck",
      shellDepth: 2,
      parity: "unjust",
      label: "Malignant Speck of Austere Pride",
      detail: "Sour amber seed germinating inside the Just: pride in austerity, rivalrous workshop factions, hoarded resentment, and appetite for future iron tribunals.",
      normBox: Object.freeze({ x: 0.27, y: 0.27, w: 0.46, h: 0.46 })
    }),
    Object.freeze({
      id: "unruled_window_opening_grain",
      shellDepth: 3,
      parity: "just",
      label: "Unruled Window-Opening Grain",
      detail: "Microscopic luminous grain inside the malignant speck: awakening love of justice not yet submitted to rules, flinging casements open wide to fresh sky.",
      normBox: Object.freeze({ x: 0.38, y: 0.38, w: 0.24, h: 0.24 })
    })
  ]);

  const UTTERANCE_CORPUS = Object.freeze([
    Object.freeze({
      id: "voice_wire_counterweight",
      parity: "just",
      shellDepth: 1,
      stoneId: "attic_wires_and_water_tank_counterweights",
      speaker: "Garret Joiner",
      text: "Ease the brass bead along the under-stair wire, gently (so the overhead water-tank counterweight settles without a tremor), before the watch passes below."
    }),
    Object.freeze({
      id: "voice_sober_tunic_syntax",
      parity: "just",
      shellDepth: 1,
      stoneId: "commas_and_parentheses_speech",
      speaker: "Linen Weaver",
      text: "Mend the hem of this sober unbleached tunic, friend, and measure each clause with care (for boastful haste is already cousin to their tribunals), needing neither badge nor signet."
    }),
    Object.freeze({
      id: "voice_rice_celery_soup",
      parity: "just",
      shellDepth: 1,
      stoneId: "rice_and_celery_soup",
      speaker: "Cistern Cook",
      text: "Ladle the pale vegetable soup while the rice is tender, adding diced celery stalks from the cistern box (kept cool behind the cedar rafter), and set four plain wooden spoons."
    }),
    Object.freeze({
      id: "voice_squash_flowers",
      parity: "just",
      shellDepth: 1,
      stoneId: "crisp_fried_squash_flowers",
      speaker: "Attic Gardener",
      text: "Turn the five-petaled squash flowers in the shallow pan, just once (until the thin batter crisps to gold without smoking), then pass the platter quietly down the bench."
    }),
    Object.freeze({
      id: "voice_pulley_plumb",
      parity: "just",
      shellDepth: 1,
      stoneId: "attic_wires_and_water_tank_counterweights",
      speaker: "Rope Rigger",
      text: "Should the eastern workshop slacken its cord, haul the cistern pulley two notches higher (marking the counterweight level in chalk upon the joist), and wait for the reply."
    }),
    Object.freeze({
      id: "voice_open_wide_windows",
      parity: "just",
      shellDepth: 3,
      stoneId: "unruled_window_opening_grain",
      speaker: "Unruled Apprentice",
      text: "Unlatch the attic shutters toward the morning breeze, even within their narrowest decree (before our own caution hardens into a second prison), and open wide the windows."
    }),
    Object.freeze({
      id: "voice_bathhouse_chin_flattery",
      parity: "unjust",
      shellDepth: 0,
      stoneId: "chin_licking_sycophants",
      speaker: "Porphyry Sycophant",
      text: "Stroke the magistrate's oiled chin upon the porphyry steps and swear his marble triglyphs outshine the sun itself!"
    }),
    Object.freeze({
      id: "voice_amethyst_hopper_boast",
      parity: "unjust",
      shellDepth: 0,
      stoneId: "amethyst_porphyry_bathhouses",
      speaker: "Bathhouse Schemer",
      text: "More amethyst steam for the proconsul's alcove! Drive the iron hoppers beneath the abacus before the petitioners dare murmur!"
    }),
    Object.freeze({
      id: "voice_malignant_tribunal_decree",
      parity: "unjust",
      shellDepth: 2,
      stoneId: "malignant_pride_speck",
      speaker: "Austere Factionalist",
      text: "Record every lukewarm spoonful and unapproved pause! Once our austere circle triumphs we shall cast stricter tribunals in iron!"
    }),
    Object.freeze({
      id: "voice_malignant_purge_oath",
      parity: "unjust",
      shellDepth: 2,
      stoneId: "malignant_pride_speck",
      speaker: "Rival Garret Censor",
      text: "Only our attic kept the true fast! Sever the rival workshop from the counterweight wire and bolt every shutter by decree!"
    })
  ]);

  function parseUtteranceSyntax(text) {
    const raw = String(text || "");
    const segments = [];
    let commaCount = 0;
    let parenthesisCount = 0;
    const tokenRe = /(\([^()]*\)|,)/g;
    let lastIdx = 0;
    let match;
    while ((match = tokenRe.exec(raw)) !== null) {
      if (match.index > lastIdx) {
        segments.push({ type: "plain", text: raw.slice(lastIdx, match.index) });
      }
      const tok = match[0];
      if (tok === ",") {
        commaCount += 1;
        segments.push({ type: "comma", text: "," });
      } else {
        parenthesisCount += 1;
        const innerCommas = (tok.match(/,/g) || []).length;
        commaCount += innerCommas;
        segments.push({ type: "parenthesis", text: tok });
      }
      lastIdx = match.index + tok.length;
    }
    if (lastIdx < raw.length) {
      segments.push({ type: "plain", text: raw.slice(lastIdx) });
    }
    return {
      segments,
      commaCount,
      parenthesisCount,
      isJustSyntax: commaCount > 0 && parenthesisCount > 0
    };
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function drawFivePetalSquashFlower(ctx, cx, cy, radius, rotRad) {
    const r = Math.max(1.2, radius);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotRad);
    ctx.fillStyle = PALETTE.celeryBroth;
    ctx.beginPath();
    ctx.moveTo(-r * 0.95, r * 0.18);
    ctx.lineTo(-r * 0.35, 0);
    ctx.lineTo(-r * 0.95, -r * 0.18);
    ctx.closePath();
    ctx.fill();

    for (let p = 0; p < 5; p += 1) {
      const a = -0.58 + p * 0.29;
      ctx.save();
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(-r * 0.25, 0);
      ctx.quadraticCurveTo(r * 0.38, -r * 0.34, r * 1.05, 0);
      ctx.quadraticCurveTo(r * 0.38, r * 0.34, -r * 0.25, 0);
      ctx.fillStyle = PALETTE.squashBlossomGold;
      ctx.fill();
      ctx.lineWidth = Math.max(0.6, r * 0.09);
      ctx.strokeStyle = PALETTE.malignantAmber;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawAtticWiresAndCounterweights(ctx, rect, pulleyPhase, wireBeadPhase) {
    const x = rect.x;
    const y = rect.y;
    const w = rect.w;
    const h = rect.h;
    const u = Math.max(4, Math.min(w, h));

    ctx.strokeStyle = "#36423d";
    ctx.lineWidth = Math.max(1.2, u * 0.022);
    ctx.beginPath();
    ctx.moveTo(x + w * 0.03, y + h * 0.28);
    ctx.lineTo(x + w * 0.50, y + h * 0.04);
    ctx.lineTo(x + w * 0.97, y + h * 0.28);
    ctx.moveTo(x + w * 0.16, y + h * 0.19);
    ctx.lineTo(x + w * 0.84, y + h * 0.19);
    ctx.stroke();

    ctx.strokeStyle = "#48544e";
    ctx.lineWidth = Math.max(1, u * 0.014);
    for (let side = -1; side <= 1; side += 2) {
      const sx = side < 0 ? x + w * 0.04 : x + w * 0.96;
      const ex = side < 0 ? x + w * 0.24 : x + w * 0.76;
      ctx.beginPath();
      ctx.moveTo(sx, y + h * 0.23);
      ctx.lineTo(ex, y + h * 0.08);
      for (let st = 0; st < 4; st += 1) {
        const t = (st + 0.5) / 4;
        const px = sx + (ex - sx) * t;
        const py = y + h * (0.23 - 0.15 * t);
        ctx.moveTo(px, py);
        ctx.lineTo(px + side * w * 0.028, py);
        ctx.lineTo(px + side * w * 0.028, py - h * 0.028);
      }
      ctx.stroke();
    }

    const wires = [
      [0.05, 0.25, 0.50, 0.12],
      [0.50, 0.12, 0.95, 0.25],
      [0.07, 0.89, 0.93, 0.89]
    ];
    ctx.strokeStyle = PALETTE.linenTunic;
    ctx.lineWidth = Math.max(0.8, u * 0.0045);
    for (let i = 0; i < wires.length; i += 1) {
      const seg = wires[i];
      const x1 = x + w * seg[0];
      const y1 = y + h * seg[1];
      const x2 = x + w * seg[2];
      const y2 = y + h * seg[3];
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      for (let b = 0; b < 3; b += 1) {
        const bt = (wireBeadPhase + b / 3 + i * 0.19) % 1;
        const bx = x1 + (x2 - x1) * bt;
        const by = y1 + (y2 - y1) * bt;
        ctx.fillStyle = PALETTE.squashBlossomGold;
        ctx.beginPath();
        ctx.arc(bx, by, Math.max(1.1, u * 0.0085), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const bob = Math.sin(pulleyPhase) * h * 0.032;
    const pulleys = [0.23, 0.77];
    for (let k = 0; k < pulleys.length; k += 1) {
      const px = x + w * pulleys[k];
      const py = y + h * 0.14;
      const shift = k === 0 ? bob : -bob;
      const tankY = y + h * 0.22 + shift;
      const weightY = y + h * 0.31 - shift;
      const sheaveR = Math.max(2, u * 0.022);

      ctx.strokeStyle = PALETTE.squashBlossomGold;
      ctx.lineWidth = Math.max(1, u * 0.006);
      ctx.beginPath();
      ctx.arc(px, py, sheaveR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = PALETTE.marbleTriglyph;
      ctx.beginPath();
      ctx.moveTo(px - sheaveR, py);
      ctx.lineTo(px - sheaveR, tankY);
      ctx.moveTo(px + sheaveR, py);
      ctx.lineTo(px + sheaveR, weightY);
      ctx.stroke();

      const tw = Math.max(4, w * 0.075);
      const th = Math.max(3, h * 0.068);
      ctx.fillStyle = "#333f3b";
      ctx.fillRect(px - sheaveR - tw * 0.5, tankY, tw, th);
      ctx.fillStyle = PALETTE.windowDaylight;
      ctx.globalAlpha = 0.58;
      ctx.fillRect(px - sheaveR - tw * 0.44, tankY + th * 0.36, tw * 0.88, th * 0.56);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = PALETTE.linenTunic;
      ctx.strokeRect(px - sheaveR - tw * 0.5, tankY, tw, th);

      const cwW = Math.max(3, w * 0.032);
      const cwH = Math.max(3, h * 0.048);
      ctx.fillStyle = PALETTE.greaseCog;
      ctx.fillRect(px + sheaveR - cwW * 0.5, weightY, cwW, cwH);
      ctx.strokeStyle = PALETTE.squashBlossomGold;
      ctx.strokeRect(px + sheaveR - cwW * 0.5, weightY, cwW, cwH);
    }
  }

  function drawSoupAndSquashTable(ctx, rect, soupSteamPhase) {
    const x = rect.x;
    const y = rect.y;
    const w = rect.w;
    const h = rect.h;
    const u = Math.max(4, Math.min(w, h));

    const tx = x + w * 0.14;
    const ty = y + h * 0.75;
    const tw = w * 0.72;
    const th = h * 0.055;
    ctx.fillStyle = "#4b3c2d";
    ctx.fillRect(tx, ty, tw, th);
    ctx.strokeStyle = PALETTE.linenTunic;
    ctx.lineWidth = Math.max(0.7, u * 0.004);
    ctx.strokeRect(tx, ty, tw, th);
    ctx.fillRect(tx + tw * 0.08, ty + th, tw * 0.035, h * 0.08);
    ctx.fillRect(tx + tw * 0.885, ty + th, tw * 0.035, h * 0.08);

    const bx = x + w * 0.30;
    const by = ty - h * 0.026;
    const rx = Math.max(3, w * 0.082);
    const ry = Math.max(2, h * 0.038);
    ctx.fillStyle = "#6b4f3a";
    ctx.beginPath();
    ctx.ellipse(bx, by + ry * 0.35, rx * 1.06, ry * 1.15, 0, 0, Math.PI);
    ctx.fill();

    ctx.fillStyle = PALETTE.celeryBroth;
    ctx.beginPath();
    ctx.ellipse(bx, by, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PALETTE.linenTunic;
    ctx.stroke();

    if (u >= 44) {
      const grains = [
        [-0.45, -0.15, 0.3], [-0.12, 0.22, -0.4], [0.28, -0.18, 0.5],
        [0.44, 0.16, -0.2], [0.02, -0.28, 0.1], [-0.30, 0.24, 0.7]
      ];
      ctx.fillStyle = "#f7f3e8";
      for (let g = 0; g < grains.length; g += 1) {
        const gr = grains[g];
        ctx.beginPath();
        ctx.ellipse(bx + rx * gr[0], by + ry * gr[1], Math.max(1, rx * 0.095), Math.max(0.7, ry * 0.13), gr[2], 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = "#c8e6a1";
      ctx.lineWidth = Math.max(1, u * 0.006);
      const celeries = [[-0.26, -0.04], [0.16, 0.10], [0.35, -0.05]];
      for (let c = 0; c < celeries.length; c += 1) {
        const cc = celeries[c];
        ctx.beginPath();
        ctx.arc(bx + rx * cc[0], by + ry * cc[1], Math.max(1.2, rx * 0.13), 0.2, 2.3);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(223, 216, 198, 0.55)";
      ctx.lineWidth = Math.max(0.8, u * 0.004);
      for (let s = -1; s <= 1; s += 1) {
        const sx = bx + s * rx * 0.36;
        const sway = Math.sin(soupSteamPhase + s * 1.3) * rx * 0.14;
        ctx.beginPath();
        ctx.moveTo(sx, by - ry * 0.9);
        ctx.quadraticCurveTo(sx + sway, by - ry * 2.1, sx - sway * 0.6, by - ry * 3.2);
        ctx.stroke();
      }
    }

    const px = x + w * 0.70;
    const py = ty - h * 0.018;
    const prx = Math.max(3, w * 0.088);
    const pry = Math.max(2, h * 0.032);
    ctx.fillStyle = "#5c4938";
    ctx.beginPath();
    ctx.ellipse(px, py, prx, pry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = PALETTE.squashBlossomGold;
    ctx.stroke();

    const blossoms = [
      [-0.36, -0.10, -0.25], [0.02, -0.22, 0.12],
      [0.36, -0.04, 0.42], [-0.08, 0.22, -0.05]
    ];
    for (let f = 0; f < blossoms.length; f += 1) {
      const bl = blossoms[f];
      drawFivePetalSquashFlower(ctx, px + prx * bl[0], py + pry * bl[1], Math.max(2.2, u * 0.028), bl[2]);
    }
  }

  function drawCasementsAndTunics(ctx, rect, winOpen, filterActive, clockSec) {
    const x = rect.x;
    const y = rect.y;
    const w = rect.w;
    const h = rect.h;
    const u = Math.max(4, Math.min(w, h));

    const winBoxes = [
      { wx: x + w * 0.05, wy: y + h * 0.31, ww: w * 0.13, wh: h * 0.25, dir: 1 },
      { wx: x + w * 0.82, wy: y + h * 0.31, ww: w * 0.13, wh: h * 0.25, dir: -1 }
    ];
    for (let i = 0; i < winBoxes.length; i += 1) {
      const wb = winBoxes[i];
      if (winOpen > 0.02) {
        ctx.save();
        ctx.fillStyle = PALETTE.windowDaylight;
        ctx.globalAlpha = 0.11 + 0.24 * winOpen;
        ctx.beginPath();
        ctx.moveTo(wb.wx, wb.wy);
        ctx.lineTo(wb.wx + wb.ww, wb.wy);
        ctx.lineTo(wb.wx + wb.ww + wb.dir * w * 0.34 * winOpen, wb.wy + wb.wh * 1.65);
        ctx.lineTo(wb.wx + wb.dir * w * 0.14 * winOpen, wb.wy + wb.wh * 1.65);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      ctx.fillStyle = winOpen > 0.05 ? PALETTE.windowDaylight : "#1c2529";
      ctx.globalAlpha = winOpen > 0.05 ? 0.35 + 0.65 * winOpen : 0.85;
      ctx.fillRect(wb.wx, wb.wy, wb.ww, wb.wh);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = PALETTE.linenTunic;
      ctx.lineWidth = Math.max(0.8, u * 0.005);
      ctx.strokeRect(wb.wx, wb.wy, wb.ww, wb.wh);

      const leafW = wb.ww * 0.48 * Math.max(0.14, 1 - winOpen * 0.82);
      const skew = wb.wh * 0.16 * winOpen;
      ctx.fillStyle = "#3a3229";
      ctx.beginPath();
      ctx.moveTo(wb.wx, wb.wy);
      ctx.lineTo(wb.wx + leafW, wb.wy - skew);
      ctx.lineTo(wb.wx + leafW, wb.wy + wb.wh - skew);
      ctx.lineTo(wb.wx, wb.wy + wb.wh);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(wb.wx + wb.ww, wb.wy);
      ctx.lineTo(wb.wx + wb.ww - leafW, wb.wy - skew);
      ctx.lineTo(wb.wx + wb.ww - leafW, wb.wy + wb.wh - skew);
      ctx.lineTo(wb.wx + wb.ww, wb.wy + wb.wh);
      ctx.closePath();
      ctx.fill();

      if (winOpen > 0.18 && u >= 54) {
        ctx.strokeStyle = PALETTE.windowDaylight;
        ctx.globalAlpha = 0.55 * winOpen;
        ctx.lineWidth = Math.max(0.9, u * 0.004);
        const by = wb.wy + wb.wh * 0.48;
        const bx0 = wb.dir > 0 ? wb.wx + wb.ww * 0.5 : wb.wx + wb.ww * 0.5;
        const drift = Math.sin(clockSec * 1.8 + i) * h * 0.015;
        ctx.beginPath();
        ctx.moveTo(bx0, by);
        ctx.bezierCurveTo(bx0 + wb.dir * w * 0.10, by - h * 0.03 + drift, bx0 + wb.dir * w * 0.18, by + h * 0.03, bx0 + wb.dir * w * 0.27, by + drift);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }

    const citizens = [0.21, 0.30, 0.70, 0.79];
    for (let c = 0; c < citizens.length; c += 1) {
      const cx = x + w * citizens[c];
      const baseY = y + h * 0.69;
      const figH = h * 0.19;
      const figW = w * 0.044;
      ctx.fillStyle = PALETTE.linenTunic;
      ctx.beginPath();
      ctx.moveTo(cx - figW * 0.38, baseY - figH * 0.72);
      ctx.lineTo(cx + figW * 0.38, baseY - figH * 0.72);
      ctx.lineTo(cx + figW * 0.56, baseY);
      ctx.lineTo(cx - figW * 0.56, baseY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#8a8272";
      ctx.lineWidth = Math.max(0.6, u * 0.003);
      ctx.beginPath();
      ctx.moveTo(cx - figW * 0.43, baseY - figH * 0.38);
      ctx.lineTo(cx + figW * 0.43, baseY - figH * 0.38);
      ctx.stroke();
      ctx.fillStyle = "#ccbda6";
      ctx.beginPath();
      ctx.arc(cx, baseY - figH * 0.86, Math.max(1.4, u * 0.016), 0, Math.PI * 2);
      ctx.fill();
    }

    if (u >= 58) {
      ctx.save();
      ctx.fillStyle = filterActive ? PALETTE.squashBlossomGold : PALETTE.linenTunic;
      ctx.font = Math.max(9, Math.round(u * 0.032)) + "px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(", ( ... ) ,", x + w * 0.255, y + h * 0.46);
      ctx.fillText("( , ... , )", x + w * 0.745, y + h * 0.46);
      ctx.restore();
    }
  }

  function renderJustShell(ctx, rect, shell, state) {
    const winOpen = shell.effectiveOrder >= 3
      ? Math.max(state.windowsOpenFactor, 0.62)
      : state.windowsOpenFactor;

    ctx.save();
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.clip();

    ctx.fillStyle = PALETTE.atticCedar;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    if (winOpen > 0.01) {
      ctx.fillStyle = PALETTE.windowDaylight;
      ctx.globalAlpha = 0.08 * winOpen;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.globalAlpha = 1;
    }

    drawAtticWiresAndCounterweights(ctx, rect, state.pulleyPhase, state.wireBeadPhase);
    drawCasementsAndTunics(ctx, rect, winOpen, state.commaParenthesisFilterActive, state.clockSec);
    drawSoupAndSquashTable(ctx, rect, state.soupSteamPhase);

    const cx = rect.x + rect.w * 0.5;
    const cy = rect.y + rect.h * 0.5;
    const coreR = Math.max(2.5, Math.min(rect.w, rect.h) * 0.245);
    ctx.strokeStyle = PALETTE.malignantAmber;
    ctx.lineWidth = Math.max(1, coreR * 0.055);
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = PALETTE.malignantAmber;
    ctx.globalAlpha = 0.22;
    ctx.beginPath();
    ctx.arc(cx, cy, coreR * 0.92, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = PALETTE.windowDaylight;
    ctx.globalAlpha = 0.42;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.max(1.2, coreR * 0.36), 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  function renderFallbackUnjust(ctx, rect, shell, facadePeel, winOpen) {
    const peel = clamp(typeof facadePeel === "number" ? facadePeel : 0.44, 0, 1);
    ctx.save();
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.w, rect.h);
    ctx.clip();
    ctx.fillStyle = PALETTE.ironAbyss;
    ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    ctx.fillStyle = PALETTE.porphyryVault;
    ctx.fillRect(rect.x, rect.y + rect.h * 0.56, rect.w, rect.h * 0.44);
    const r = Math.max(2, Math.min(rect.w, rect.h) * 0.18);
    ctx.strokeStyle = shell.effectiveOrder >= 2 ? PALETTE.malignantAmber : PALETTE.rustRatchet;
    ctx.lineWidth = Math.max(1.2, r * 0.16);
    ctx.beginPath();
    ctx.arc(rect.x + rect.w * 0.36, rect.y + rect.h * 0.42, r, 0, Math.PI * 2);
    ctx.arc(rect.x + rect.w * 0.64, rect.y + rect.h * 0.42, r * 0.85, 0, Math.PI * 2);
    ctx.stroke();
    const cover = (1 - peel) * rect.w * 0.48;
    if (cover > 1) {
      ctx.fillStyle = PALETTE.marbleTriglyph;
      ctx.fillRect(rect.x, rect.y, cover, rect.h * 0.28);
      ctx.fillRect(rect.x + rect.w - cover, rect.y, cover, rect.h * 0.28);
    }
    if (winOpen > 0.02) {
      ctx.fillStyle = PALETTE.windowDaylight;
      ctx.globalAlpha = 0.16 * winOpen;
      ctx.fillRect(rect.x + rect.w * 0.1, rect.y, rect.w * 0.8, rect.h);
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function drawNestedShellFrame(ctx, rect, shell, slot, winOpen, burstFlash) {
    const u = Math.max(4, Math.min(rect.w, rect.h));
    ctx.save();
    if (shell.parity === "unjust") {
      const isMal = shell.effectiveOrder >= 2;
      ctx.strokeStyle = isMal ? PALETTE.malignantAmber : PALETTE.rustRatchet;
      ctx.lineWidth = Math.max(1.4, u * (slot === 0 ? 0.006 : 0.018));
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      if (slot > 0 && u >= 28) {
        const teeth = 8;
        const tSize = Math.max(1.5, u * 0.024);
        ctx.fillStyle = isMal ? PALETTE.malignantAmber : PALETTE.greaseCog;
        for (let t = 0; t < teeth; t += 1) {
          const fx = rect.x + rect.w * ((t + 0.5) / teeth);
          ctx.fillRect(fx - tSize * 0.5, rect.y - tSize * 0.55, tSize, tSize * 0.55);
          ctx.fillRect(fx - tSize * 0.5, rect.y + rect.h, tSize, tSize * 0.55);
        }
      }
    } else {
      ctx.strokeStyle = winOpen > 0.2 ? PALETTE.windowDaylight : PALETTE.squashBlossomGold;
      ctx.lineWidth = Math.max(1.2, u * (slot === 0 ? 0.005 : 0.014));
      ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
      if (slot > 0 && u >= 24) {
        const pad = u * 0.035;
        ctx.strokeStyle = PALETTE.linenTunic;
        ctx.lineWidth = Math.max(1.1, u * 0.012);
        ctx.beginPath();
        ctx.arc(rect.x + pad, rect.y + rect.h * 0.5, rect.h * 0.42, Math.PI * 0.68, Math.PI * 1.32);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(rect.x + rect.w - pad, rect.y + rect.h * 0.5, rect.h * 0.42, -Math.PI * 0.32, Math.PI * 0.32);
        ctx.stroke();
      }
    }
    if (burstFlash > 0.02 && slot === 0) {
      ctx.strokeStyle = PALETTE.squashBlossomGold;
      ctx.globalAlpha = burstFlash * 0.65;
      ctx.lineWidth = Math.max(2, u * 0.02);
      ctx.strokeRect(rect.x + 2, rect.y + 2, Math.max(2, rect.w - 4), Math.max(2, rect.h - 4));
    }
    ctx.restore();
  }

  function buildShellDescriptor(depth, epochOffset) {
    const safeDepth = Math.max(0, Math.floor(Number(depth) || 0));
    const safeEpoch = Math.floor(Number(epochOffset) || 0);
    const effectiveOrder = Math.max(0, safeDepth + safeEpoch);
    const parity = effectiveOrder % 2 === 0 ? "unjust" : "just";
    const generation = Math.floor(effectiveOrder / 2);

    if (effectiveOrder === 0) {
      return {
        shellDepth: safeDepth,
        effectiveOrder: 0,
        generation: 0,
        archetype: "overt_unjust_berenice",
        parity: "unjust",
        title: "Overt Unjust Berenice",
        summary: "Triglyphs & solemn abaci concealing meat-grinding iron gears; amethyst & porphyry sycophant baths",
        stoneIds: ["triglyphs_and_abaci_facade", "meat_grinding_iron_gears", "amethyst_porphyry_bathhouses", "chin_licking_sycophants"]
      };
    }
    if (effectiveOrder === 1) {
      return {
        shellDepth: safeDepth,
        effectiveOrder: 1,
        generation: 0,
        archetype: "clandestine_just_berenice",
        parity: "just",
        title: "Hidden Just Berenice",
        summary: "Attics linked by under-stair wires & water-tank counterweights; sober tunics, commas & parentheses, rice-and-celery soup, crisp fried squash flowers",
        stoneIds: ["attic_wires_and_water_tank_counterweights", "commas_and_parentheses_speech", "rice_and_celery_soup", "crisp_fried_squash_flowers"]
      };
    }
    if (effectiveOrder === 2) {
      return {
        shellDepth: safeDepth,
        effectiveOrder: 2,
        generation: 1,
        archetype: "malignant_pride_seed",
        parity: "unjust",
        title: "Malignant Seed Inside the Just",
        summary: "Sour speck germinating inside virtue: pride in austerity, rivalrous factions, resentment, and appetite for future tyranny",
        stoneIds: ["malignant_pride_speck"]
      };
    }
    if (effectiveOrder === 3) {
      return {
        shellDepth: safeDepth,
        effectiveOrder: 3,
        generation: 1,
        archetype: "unruled_luminous_justice_grain",
        parity: "just",
        title: "Luminous Unruled Grain of Justice",
        summary: "Microscopic awakening love of justice not yet submitted to rules, reassembling an even more just city & opening wide the windows",
        stoneIds: ["unruled_window_opening_grain"]
      };
    }
    if (parity === "unjust") {
      return {
        shellDepth: safeDepth,
        effectiveOrder: effectiveOrder,
        generation: generation,
        archetype: "latent_unjust_faction_speck",
        parity: "unjust",
        title: "Latent Unjust Seed (Order " + effectiveOrder + ")",
        summary: "Generation " + generation + " sour factional speck hardening austere rules back toward iron ratchets & tribunals",
        stoneIds: ["malignant_pride_speck"]
      };
    }
    return {
      shellDepth: safeDepth,
      effectiveOrder: effectiveOrder,
      generation: generation,
      archetype: "deeper_unruled_justice_grain",
      parity: "just",
      title: "Unruled Justice Grain (Order " + effectiveOrder + ")",
      summary: "Generation " + generation + " microscopic grain of unruled justice flinging casements open inside future pride",
      stoneIds: ["unruled_window_opening_grain", "commas_and_parentheses_speech"]
    };
  }

  function createSeedMicroscope(opts) {
    const cfg = opts || {};
    const startDepth = Math.max(0, Number(cfg.initialDepth) || 0);
    const state = {
      zoomDepth: startDepth,
      targetDepth: startDepth,
      maxDepthVisited: Math.round(startDepth),
      epochOffset: 0,
      temporalMode: "simultaneous",
      simultaneousNestedSeeds: true,
      allFutureBerenicesPresentNow: true,
      commaParenthesisFilterActive: false,
      windowsOpenedWide: false,
      windowsOpenFactor: 0,
      reducedMotion: Boolean(cfg.reducedMotion),
      audioMuted: false,
      pulleyPhase: 0.35,
      wireBeadPhase: 0.18,
      soupSteamPhase: 0.6,
      clockSec: 0,
      burstFlash: 0
    };

    const audio = { ctx: null };

    function getShellAtDepth(depth, epochOffset) {
      const ep = epochOffset === undefined ? state.epochOffset : epochOffset;
      return buildShellDescriptor(depth, ep);
    }

    function getShellRects(width, height) {
      const w = Math.max(16, Number(width) || 800);
      const h = Math.max(16, Number(height) || 600);
      const cx = w * 0.5;
      const cy = h * 0.5;
      const baseW = w * 0.96;
      const baseH = h * 0.94;
      const z = Math.max(0, state.zoomDepth);
      const baseDepth = Math.floor(z);
      const frac = z - baseDepth;
      const list = [];
      for (let i = 0; i < 5; i += 1) {
        const shellDepth = baseDepth + i;
        const scale = Math.pow(0.45, i - frac);
        const rw = baseW * scale;
        const rh = baseH * scale;
        list.push({
          slot: i,
          shellDepth: shellDepth,
          scale: scale,
          rect: { x: cx - rw * 0.5, y: cy - rh * 0.5, w: rw, h: rh },
          shell: getShellAtDepth(shellDepth)
        });
      }
      return list;
    }

    function diveIntoSeed(steps) {
      const delta = steps === undefined ? 1 : (Number(steps) || 0);
      state.targetDepth = Math.max(0, state.targetDepth + delta);
      if (state.reducedMotion) {
        state.zoomDepth = state.targetDepth;
      }
      state.maxDepthVisited = Math.max(state.maxDepthVisited, Math.round(state.targetDepth), Math.round(state.zoomDepth));
      return getState();
    }

    function surfaceFromSeed(steps) {
      const delta = steps === undefined ? 1 : (Number(steps) || 0);
      state.targetDepth = Math.max(0, state.targetDepth - delta);
      if (state.reducedMotion) {
        state.zoomDepth = state.targetDepth;
      }
      return getState();
    }

    function setDepth(depth, navOpts) {
      const next = Math.max(0, Number(depth) || 0);
      const instant = Boolean(navOpts && navOpts.instant);
      state.targetDepth = next;
      if (instant || state.reducedMotion) {
        state.zoomDepth = next;
      }
      state.maxDepthVisited = Math.max(state.maxDepthVisited, Math.round(state.targetDepth), Math.round(state.zoomDepth));
      return getState();
    }

    function inspectSimultaneousInstant() {
      state.temporalMode = "simultaneous";
      state.simultaneousNestedSeeds = true;
      state.allFutureBerenicesPresentNow = true;
      return getState();
    }

    function advanceTemporalSuccession(epochs) {
      const stepEpochs = epochs === undefined ? 1 : Math.round(Number(epochs) || 1);
      state.temporalMode = "succession";
      state.epochOffset = Math.max(0, state.epochOffset + stepEpochs);
      state.simultaneousNestedSeeds = true;
      state.allFutureBerenicesPresentNow = true;
      state.burstFlash = state.reducedMotion ? 0 : 1;
      return getState();
    }

    function toggleTemporalMode() {
      if (state.temporalMode === "simultaneous") {
        return advanceTemporalSuccession(1);
      }
      return inspectSimultaneousInstant();
    }

    function setCommaParenthesisFilter(flag) {
      state.commaParenthesisFilterActive = Boolean(flag);
      return getState();
    }

    function toggleCommaParenthesisFilter() {
      state.commaParenthesisFilterActive = !state.commaParenthesisFilterActive;
      return getState();
    }

    function getVisibleUtterances() {
      const enriched = UTTERANCE_CORPUS.map(function (entry) {
        const parsed = parseUtteranceSyntax(entry.text);
        return {
          id: entry.id,
          parity: entry.parity,
          shellDepth: entry.shellDepth,
          stoneId: entry.stoneId,
          speaker: entry.speaker,
          text: entry.text,
          segments: parsed.segments,
          commaCount: parsed.commaCount,
          parenthesisCount: parsed.parenthesisCount,
          isJustSyntax: parsed.isJustSyntax
        };
      });
      if (!state.commaParenthesisFilterActive) {
        return enriched;
      }
      return enriched
        .filter(function (u) { return u.isJustSyntax; })
        .sort(function (a, b) {
          return (b.parenthesisCount * 3 + b.commaCount) - (a.parenthesisCount * 3 + a.commaCount);
        });
    }

    function openWideWindows(winOpts) {
      state.windowsOpenedWide = true;
      const instant = Boolean(winOpts && winOpts.instant);
      state.windowsOpenFactor = (state.reducedMotion || instant)
        ? 1
        : Math.max(state.windowsOpenFactor, 0.72);
      return getState();
    }

    function toggleOpenWindows() {
      state.windowsOpenedWide = !state.windowsOpenedWide;
      if (state.reducedMotion) {
        state.windowsOpenFactor = state.windowsOpenedWide ? 1 : 0;
      } else {
        state.windowsOpenFactor = state.windowsOpenedWide
          ? Math.max(state.windowsOpenFactor, 0.72)
          : Math.min(state.windowsOpenFactor, 0.28);
      }
      return getState();
    }

    function setReducedMotion(flag) {
      state.reducedMotion = Boolean(flag);
      if (state.reducedMotion) {
        state.zoomDepth = state.targetDepth;
        state.windowsOpenFactor = state.windowsOpenedWide ? 1 : 0;
        state.burstFlash = 0;
      }
      return getState();
    }

    function step(dtSec) {
      const dt = clamp(Number(dtSec) || 0.016, 0, 0.1);
      if (state.reducedMotion) {
        state.zoomDepth = state.targetDepth;
        state.windowsOpenFactor = state.windowsOpenedWide ? 1 : 0;
        state.burstFlash = 0;
      } else {
        const zDiff = state.targetDepth - state.zoomDepth;
        state.zoomDepth = Math.abs(zDiff) < 0.0008
          ? state.targetDepth
          : state.zoomDepth + zDiff * Math.min(1, dt * 6.5);
        const wTarget = state.windowsOpenedWide ? 1 : 0;
        const wDiff = wTarget - state.windowsOpenFactor;
        state.windowsOpenFactor = Math.abs(wDiff) < 0.001
          ? wTarget
          : state.windowsOpenFactor + wDiff * Math.min(1, dt * 5.5);
        state.clockSec += dt;
        state.pulleyPhase = (state.pulleyPhase + dt * 0.88) % (Math.PI * 2);
        state.wireBeadPhase = (state.wireBeadPhase + dt * 0.36) % 1;
        state.soupSteamPhase = (state.soupSteamPhase + dt * 1.45) % (Math.PI * 2);
        state.burstFlash = Math.max(0, state.burstFlash - dt * 2.2);
      }
      state.maxDepthVisited = Math.max(state.maxDepthVisited, Math.round(state.zoomDepth), Math.round(state.targetDepth));
      return getState();
    }

    function renderNestedBerenice(ctx, width, height, machineryEngine, uiOpts) {
      if (!ctx) { return; }
      const w = Math.max(16, Number(width) || 800);
      const h = Math.max(16, Number(height) || 600);
      const optsObj = uiOpts || {};
      const peel = typeof optsObj.facadePeel === "number"
        ? optsObj.facadePeel
        : (machineryEngine && typeof machineryEngine.getFacadePeel === "function"
          ? machineryEngine.getFacadePeel()
          : 0.44);

      ctx.save();
      ctx.fillStyle = PALETTE.ironAbyss;
      ctx.fillRect(0, 0, w, h);

      const shells = getShellRects(w, h);
      for (let i = 0; i < shells.length; i += 1) {
        const item = shells[i];
        const rect = item.rect;
        const sh = item.shell;
        if (sh.parity === "unjust") {
          if (machineryEngine && typeof machineryEngine.renderUnjustShell === "function") {
            machineryEngine.renderUnjustShell(ctx, rect, {
              depthIndex: sh.effectiveOrder,
              facadePeel: peel,
              windowsOpenFactor: state.windowsOpenFactor,
              isMalignantSeed: sh.effectiveOrder >= 2,
              highlightStoneId: optsObj.highlightStoneId || null,
              alpha: 1
            });
          } else {
            renderFallbackUnjust(ctx, rect, sh, peel, state.windowsOpenFactor);
          }
        } else {
          renderJustShell(ctx, rect, sh, state);
        }
        const effWin = sh.effectiveOrder >= 3 ? Math.max(state.windowsOpenFactor, 0.62) : state.windowsOpenFactor;
        drawNestedShellFrame(ctx, rect, sh, i, effWin, state.burstFlash);
      }

      const deepest = shells[shells.length - 1];
      const cx = w * 0.5;
      const cy = h * 0.5;
      const dotR = Math.max(1.8, Math.min(deepest.rect.w, deepest.rect.h) * 0.19);
      const nextParity = deepest.shell.parity === "unjust" ? "just" : "unjust";
      ctx.fillStyle = nextParity === "just" ? PALETTE.windowDaylight : PALETTE.malignantAmber;
      ctx.beginPath();
      ctx.arc(cx, cy, dotR, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = nextParity === "just" ? PALETTE.malignantAmber : PALETTE.windowDaylight;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(0.9, dotR * 0.42), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function inspectAt(px, py, width, height, machineryEngine) {
      const shells = getShellRects(width, height);
      let hit = shells[0];
      for (let i = shells.length - 1; i >= 0; i -= 1) {
        const r = shells[i].rect;
        if (r.w >= 14 && r.h >= 14 && px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
          hit = shells[i];
          break;
        }
      }
      const nx = clamp((px - hit.rect.x) / Math.max(1, hit.rect.w), 0, 1);
      const ny = clamp((py - hit.rect.y) / Math.max(1, hit.rect.h), 0, 1);
      let stone = null;
      if (hit.shell.parity === "unjust") {
        if (hit.shell.effectiveOrder >= 2) {
          stone = SEED_STONES[4];
        } else if (machineryEngine && typeof machineryEngine.inspectAt === "function") {
          stone = machineryEngine.inspectAt(nx, ny);
        } else {
          stone = {
            id: ny < 0.30 ? "triglyphs_and_abaci_facade" : (ny > 0.62 ? "amethyst_porphyry_bathhouses" : "meat_grinding_iron_gears"),
            shellDepth: 0,
            parity: "unjust",
            label: "Overt Unjust Machinery"
          };
        }
      } else if (hit.shell.effectiveOrder >= 3) {
        stone = SEED_STONES[5];
      } else if ((nx < 0.20 || nx > 0.80) && ny >= 0.29 && ny <= 0.58 && state.windowsOpenFactor > 0.25) {
        stone = SEED_STONES[5];
      } else if (ny < 0.28 || ny > 0.87) {
        stone = SEED_STONES[0];
      } else if (ny >= 0.63) {
        stone = nx <= 0.50 ? SEED_STONES[2] : SEED_STONES[3];
      } else {
        stone = SEED_STONES[1];
      }
      return {
        shellDepth: hit.shellDepth,
        effectiveOrder: hit.shell.effectiveOrder,
        parity: hit.shell.parity,
        archetype: hit.shell.archetype,
        title: hit.shell.title,
        nx: nx,
        ny: ny,
        stone: stone
      };
    }

    function initAudio(audioCtx) {
      try {
        if (audioCtx) {
          audio.ctx = audioCtx;
        } else if (!audio.ctx && typeof window !== "undefined") {
          const Ctor = window.AudioContext || window.webkitAudioContext;
          if (Ctor) { audio.ctx = new Ctor(); }
        }
        if (audio.ctx && audio.ctx.state === "suspended" && typeof audio.ctx.resume === "function") {
          audio.ctx.resume().catch(function () {});
        }
      } catch (_err) {
        audio.ctx = null;
      }
      return Boolean(audio.ctx);
    }

    function setAudioMuted(muted) {
      state.audioMuted = Boolean(muted);
      return state.audioMuted;
    }

    function isAudioMuted() {
      return state.audioMuted;
    }

    function pluckTone(freq, delaySec, durSec, wave, peakGain) {
      if (state.audioMuted || !audio.ctx) { return; }
      try {
        const now = audio.ctx.currentTime + delaySec;
        const osc = audio.ctx.createOscillator();
        const gain = audio.ctx.createGain();
        osc.type = wave || "triangle";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(peakGain || 0.045, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + durSec);
        osc.connect(gain);
        gain.connect(audio.ctx.destination);
        osc.start(now);
        osc.stop(now + durSec + 0.02);
      } catch (_err) {}
    }

    function playParenthesisCadence(depth, parity) {
      if (state.audioMuted || !audio.ctx) { return false; }
      const d = depth === undefined ? Math.round(state.zoomDepth) : Math.max(0, Math.floor(Number(depth) || 0));
      const p = parity || getShellAtDepth(d).parity;
      const mul = Math.pow(1.06, d % 7);
      if (p === "just") {
        pluckTone(293.66 * mul, 0.00, 0.22, "triangle", 0.042);
        pluckTone(440.00 * mul, 0.09, 0.24, "triangle", 0.036);
        pluckTone(554.37 * mul, 0.22, 0.26, "sine", 0.032);
        pluckTone(440.00 * mul, 0.34, 0.30, "triangle", 0.038);
      } else {
        pluckTone(146.83 * mul, 0.00, 0.26, "sawtooth", 0.028);
        pluckTone(207.65 * mul, 0.04, 0.28, "sawtooth", 0.024);
      }
      return true;
    }

    function playOpenWindowsChord() {
      if (state.audioMuted || !audio.ctx) { return false; }
      const notes = [293.66, 440.0, 659.25, 830.61, 880.0];
      for (let i = 0; i < notes.length; i += 1) {
        pluckTone(notes[i], i * 0.055, 0.42, "triangle", 0.038);
      }
      return true;
    }

    function getShellBreadcrumbs(count) {
      const total = Math.max(4, Math.floor(Number(count) || 9));
      const out = [];
      for (let d = 0; d < total; d += 1) {
        out.push(getShellAtDepth(d));
      }
      return out;
    }

    function reset() {
      state.zoomDepth = 0;
      state.targetDepth = 0;
      state.maxDepthVisited = 0;
      state.epochOffset = 0;
      state.temporalMode = "simultaneous";
      state.simultaneousNestedSeeds = true;
      state.allFutureBerenicesPresentNow = true;
      state.commaParenthesisFilterActive = false;
      state.windowsOpenedWide = false;
      state.windowsOpenFactor = 0;
      state.burstFlash = 0;
      return getState();
    }

    function getState() {
      const currentDepth = Math.round(state.zoomDepth);
      const activeShell = getShellAtDepth(currentDepth);
      const visibleShellStack = getShellRects(800, 600).map(function (item) {
        return {
          slot: item.slot,
          scale: Number(item.scale.toFixed(5)),
          shellDepth: item.shellDepth,
          effectiveOrder: item.shell.effectiveOrder,
          parity: item.shell.parity,
          archetype: item.shell.archetype,
          title: item.shell.title
        };
      });
      return {
        currentDepth: currentDepth,
        zoomDepth: state.zoomDepth,
        targetDepth: state.targetDepth,
        maxDepthVisited: state.maxDepthVisited,
        epochOffset: state.epochOffset,
        temporalMode: state.temporalMode,
        currentParity: activeShell.parity,
        activeShell: activeShell,
        visibleShellStack: visibleShellStack,
        simultaneousNestedSeeds: true,
        allFutureBerenicesPresentNow: true,
        alternatingParityUnbounded: true,
        malignantSeedInsideJust: true,
        unruledJusticeInsideMalignant: true,
        justRecognizedBySyntaxAndSoupNotBadges: true,
        arbitraryRecursiveDepthSupported: true,
        commaParenthesisFilterActive: state.commaParenthesisFilterActive,
        windowsOpenedWide: state.windowsOpenedWide,
        windowsOpenFactor: state.windowsOpenFactor,
        audioMuted: state.audioMuted,
        reducedMotion: state.reducedMotion,
        stonesPresent: SEED_STONES.map(function (s) { return s.id; })
      };
    }

    return {
      getShellAtDepth: getShellAtDepth,
      getShellRects: getShellRects,
      getShellBreadcrumbs: getShellBreadcrumbs,
      diveIntoSeed: diveIntoSeed,
      surfaceFromSeed: surfaceFromSeed,
      setDepth: setDepth,
      inspectSimultaneousInstant: inspectSimultaneousInstant,
      advanceTemporalSuccession: advanceTemporalSuccession,
      toggleTemporalMode: toggleTemporalMode,
      setCommaParenthesisFilter: setCommaParenthesisFilter,
      toggleCommaParenthesisFilter: toggleCommaParenthesisFilter,
      getVisibleUtterances: getVisibleUtterances,
      openWideWindows: openWideWindows,
      toggleOpenWindows: toggleOpenWindows,
      setReducedMotion: setReducedMotion,
      step: step,
      renderNestedBerenice: renderNestedBerenice,
      inspectAt: inspectAt,
      initAudio: initAudio,
      setAudioMuted: setAudioMuted,
      isAudioMuted: isAudioMuted,
      playParenthesisCadence: playParenthesisCadence,
      playOpenWindowsChord: playOpenWindowsChord,
      reset: reset,
      getState: getState
    };
  }

  const api = Object.freeze({
    PALETTE: PALETTE,
    SEED_STONES: SEED_STONES,
    UTTERANCE_CORPUS: UTTERANCE_CORPUS,
    parseUtteranceSyntax: parseUtteranceSyntax,
    createSeedMicroscope: createSeedMicroscope
  });

  if (typeof window !== "undefined") {
    window.BereniceRecursiveSeeds = api;
  }
  return api;
})();
