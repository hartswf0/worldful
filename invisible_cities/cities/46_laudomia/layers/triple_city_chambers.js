/*
 * City 46 — Laudomia: Triple Architectural Chambers, Stadium Funnel & Unturned Hourglass
 * Layer: layers/triple_city_chambers.js
 * Exports globalThis.LaudomiaTripleChambers = { PALETTE, createRenderer, createSoundscape }
 */
(function (root) {
  "use strict";

  var PALETTE = Object.freeze({
    obsidianVault: "#0f0e11",
    slateNecropolis: "#24262b",
    weatheredSlab: "#7d8288",
    boneInscription: "#dfd9c8",
    livingTerracotta: "#b85d3b",
    torchOchre: "#dfa14a",
    travertineArcade: "#cbb997",
    carraraUnborn: "#ebe8e1",
    porousSpongeBlue: "#9ab6c2",
    hollowEchoSilver: "#c5d4dc",
    funnelCrimsonDread: "#8f3237",
    hourglassBronze: "#9c7a44"
  });

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hexToRgba(hex, alpha) {
    var h = String(hex || "#000000").replace("#", "");
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    var r = parseInt(h.slice(0, 2), 16) || 0;
    var g = parseInt(h.slice(2, 4), 16) || 0;
    var b = parseInt(h.slice(4, 6), 16) || 0;
    return "rgba(" + r + "," + g + "," + b + "," + clamp(alpha, 0, 1).toFixed(3) + ")";
  }

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  var rng = mulberry32(460905);

  /* Precomputed organic cellular pores for the Unborn sponge-marble domes */
  var SPONGE_PORES = (function () {
    var arr = [];
    for (var i = 0; i < 108; i++) {
      arr.push({
        u: 0.06 + rng() * 0.88,
        v: 0.05 + rng() * 0.86,
        r: 1.8 + rng() * 6.4,
        aspect: 0.72 + rng() * 0.52,
        tilt: (rng() - 0.5) * 1.4,
        depth: 0.25 + rng() * 0.65
      });
    }
    return arr;
  })();

  /* Precomputed 240 finite hourglass grains & miniature tomb slabs */
  var HOURGLASS_SEEDS = (function () {
    var arr = [];
    for (var i = 0; i < 240; i++) {
      arr.push({
        u: rng(),
        v: rng(),
        phase: rng() * Math.PI * 2,
        shade: 0.78 + rng() * 0.28,
        isSlab: i % 3 === 0,
        tilt: (rng() - 0.5) * 0.34
      });
    }
    return arr;
  })();

  /* Precomputed cypress trees & living workshop lanterns */
  var CYPRESS_SEEDS = [
    { u: 0.09, v: 0.24, h: 0.13 },
    { u: 0.22, v: 0.19, h: 0.15 },
    { u: 0.78, v: 0.20, h: 0.14 },
    { u: 0.90, v: 0.26, h: 0.12 },
    { u: 0.13, v: 0.58, h: 0.11 },
    { u: 0.88, v: 0.62, h: 0.11 }
  ];

  var LIVING_LANTERNS = (function () {
    var arr = [];
    for (var i = 0; i < 26; i++) {
      arr.push({
        u: 0.14 + rng() * 0.72,
        v: 0.22 + rng() * 0.64,
        flicker: rng() * Math.PI * 2,
        size: 1.6 + rng() * 1.9
      });
    }
    return arr;
  })();

  function normalizeState(raw) {
    var s = raw || {};
    return {
      anguishMode: s.anguishMode || "triad",
      focusedChamber: s.focusedChamber || "all",
      generation: typeof s.generation === "number" ? s.generation : 1,
      livingCount: typeof s.livingCount === "number" ? s.livingCount : 148,
      deadSlabsCount: typeof s.deadSlabsCount === "number" ? s.deadSlabsCount : 420,
      necropolisRings: clamp(typeof s.necropolisRings === "number" ? s.necropolisRings : 4, 3, 12),
      unbornFurnishings: 0,
      livingSecurity: clamp(typeof s.livingSecurity === "number" ? s.livingSecurity : 0.52, 0, 1),
      orderClarity: clamp(typeof s.orderClarity === "number" ? s.orderClarity : 0.56, 0, 1),
      unbornExpectation: clamp(typeof s.unbornExpectation === "number" ? s.unbornExpectation : 0.48, 0, 1),
      activeSlabIndex: clamp(typeof s.activeSlabIndex === "number" ? s.activeSlabIndex : 0, 0, 7),
      activeSlab: s.activeSlab || null,
      activeNicheIndex: clamp(typeof s.activeNicheIndex === "number" ? s.activeNicheIndex : 0, 0, 7),
      echoPulse: clamp(typeof s.echoPulse === "number" ? s.echoPulse : 0, 0, 1),
      funnelDensity: clamp(typeof s.funnelDensity === "number" ? s.funnelDensity : 0.26, 0, 1),
      amphitheaterTiers: clamp(typeof s.amphitheaterTiers === "number" ? s.amphitheaterTiers : 7, 4, 18),
      swarmingPoreBillions: typeof s.swarmingPoreBillions === "number" ? s.swarmingPoreBillions : 1.8,
      isChoking: Boolean(s.isChoking || (typeof s.funnelDensity === "number" && s.funnelDensity >= 0.82)),
      totalFiniteSand: 240,
      unbornGrainsRemaining: clamp(typeof s.unbornGrainsRemaining === "number" ? s.unbornGrainsRemaining : 132, 0, 240),
      livingWaistGrains: clamp(typeof s.livingWaistGrains === "number" ? s.livingWaistGrains : 24, 0, 240),
      deadHeapGrains: clamp(typeof s.deadHeapGrains === "number" ? s.deadHeapGrains : 84, 0, 240),
      grainsRemaining: clamp(typeof s.grainsRemaining === "number" ? s.grainsRemaining : 156, 0, 240),
      turnShudder: clamp(typeof s.turnShudder === "number" ? s.turnShudder : 0, 0, 1),
      lastGrainFallen: Boolean(s.lastGrainFallen)
    };
  }

  function createRenderer(canvas, opts) {
    var cfg = opts || {};
    var ctx = canvas && typeof canvas.getContext === "function" ? canvas.getContext("2d") : null;
    var width = (canvas && (canvas.clientWidth || canvas.width)) || 960;
    var height = (canvas && (canvas.clientHeight || canvas.height)) || 560;
    var dpr = clamp((typeof globalThis !== "undefined" && globalThis.devicePixelRatio) || 1, 1, 2.5);
    var reducedMotion = Boolean(cfg.reducedMotion);
    var lastState = normalizeState(null);
    var slabBoxes = new Array(8);
    var nicheBoxes = new Array(8);
    var funnelGeom = { cx: 480, cy: 280, pitRx: 58, pitRy: 38, topY: 50, spanH: 460 };
    var hourglassGeom = { cx: 480, cy: 280, topY: 60, botY: 500, halfW: 130, claspW: 32 };

    function resize(w, h, nextDpr) {
      width = Math.max(240, Number(w) || width || 960);
      height = Math.max(200, Number(h) || height || 560);
      if (nextDpr) dpr = clamp(Number(nextDpr) || 1, 1, 3);
      if (canvas) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
      }
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
    }

    function traceVaultArch(c, x, y, w, h) {
      var archR = Math.min(w * 0.48, h * 0.24);
      var springY = y + archR;
      c.beginPath();
      c.moveTo(x, y + h);
      c.lineTo(x, springY);
      c.quadraticCurveTo(x, y + archR * 0.14, x + w * 0.5, y);
      c.quadraticCurveTo(x + w, y + archR * 0.14, x + w, springY);
      c.lineTo(x + w, y + h);
      c.closePath();
    }

    function drawCypress(c, cx, baseY, treeH) {
      c.fillStyle = "#141918";
      c.beginPath();
      c.moveTo(cx, baseY - treeH);
      c.quadraticCurveTo(cx + treeH * 0.18, baseY - treeH * 0.38, cx + treeH * 0.08, baseY);
      c.lineTo(cx - treeH * 0.08, baseY);
      c.quadraticCurveTo(cx - treeH * 0.18, baseY - treeH * 0.38, cx, baseY - treeH);
      c.fill();
    }

    function drawNecropolisChamber(c, rx, ry, rw, rh, st, t) {
      var grad = c.createLinearGradient(rx, ry, rx, ry + rh);
      grad.addColorStop(0, "#17191e");
      grad.addColorStop(0.55, PALETTE.slateNecropolis);
      grad.addColorStop(1, "#141519");
      c.save();
      traceVaultArch(c, rx, ry, rw, rh);
      c.fillStyle = grad;
      c.fill();
      c.clip();

      /* Ever-broadening concentric cemetery terraces beyond the walls */
      var rings = st.necropolisRings;
      var arcCx = rx + rw * 0.88;
      var arcCy = ry + rh * 0.42;
      var maxRad = Math.hypot(rw * 0.92, rh * 0.52);
      var miniBudget = Math.min(200, Math.max(24, Math.floor(st.deadSlabsCount / 3)));
      var drawnMini = 0;
      for (var r = 1; r <= rings; r++) {
        var frac = r / Math.max(12, rings);
        var rad = maxRad * (0.20 + frac * 0.78);
        c.strokeStyle = hexToRgba(PALETTE.weatheredSlab, 0.22 + st.orderClarity * 0.22);
        c.lineWidth = 1.2;
        c.beginPath();
        c.arc(arcCx, arcCy, rad, Math.PI * 0.56, Math.PI * 1.44);
        c.stroke();

        var countInRing = Math.min(22, Math.ceil(miniBudget / rings));
        for (var k = 0; k < countInRing && drawnMini < miniBudget; k++) {
          var ang = lerp(Math.PI * 0.62, Math.PI * 1.38, (k + 0.5) / countInRing);
          var sx = arcCx + Math.cos(ang) * rad;
          var sy = arcCy + Math.sin(ang) * rad * 0.82;
          if (sx > rx + 8 && sx < rx + rw - 20 && sy > ry + 26 && sy < ry + rh * 0.58) {
            c.fillStyle = (k + r) % 4 === 0
              ? hexToRgba(PALETTE.boneInscription, 0.45)
              : hexToRgba(PALETTE.weatheredSlab, 0.52);
            c.fillRect(sx - 3, sy - 5.5, 6, 10);
            drawnMini++;
          }
        }
      }

      /* Hearse-narrow windowless stone lanes */
      c.strokeStyle = "#101115";
      c.lineWidth = Math.max(2.5, rw * 0.022);
      for (var ln = 0; ln < 3; ln++) {
        var ly = ry + rh * (0.28 + ln * 0.14);
        c.beginPath();
        c.moveTo(rx + 6, ly + 12);
        c.lineTo(rx + rw - 14, ly - 8);
        c.stroke();
      }

      /* Pointed cypresses flanking the windowless walls */
      for (var cy = 0; cy < CYPRESS_SEEDS.length; cy++) {
        var cs = CYPRESS_SEEDS[cy];
        drawCypress(c, rx + rw * cs.u, ry + rh * cs.v, rh * cs.h);
      }

      /* Crenelated city boundary wall on right border of Necropolis */
      var wallX = rx + rw - 13;
      c.fillStyle = "#34373e";
      c.fillRect(wallX, ry + rh * 0.16, 12, rh * 0.84);
      var merlonH = 11;
      for (var my = ry + rh * 0.16; my < ry + rh - 8; my += merlonH * 1.9) {
        c.fillStyle = "#4a4e57";
        c.fillRect(wallX - 4, my, 6, merlonH);
      }

      /* 8 Principal Clan Vault Slabs (0..7) in 2x4 monumental ledger */
      var padX = Math.max(10, rw * 0.06);
      var usableW = rw - padX * 2 - 10;
      var cols = 4;
      var gapX = Math.max(5, usableW * 0.04);
      var slabW = (usableW - gapX * (cols - 1)) / cols;
      var slabH = Math.min(rh * 0.16, Math.max(34, slabW * 1.28));
      var startY = ry + rh * 0.59;
      var gapY = Math.max(8, rh * 0.032);

      for (var idx = 0; idx < 8; idx++) {
        var col = idx % 4;
        var row = Math.floor(idx / 4);
        var bx = rx + padX + col * (slabW + gapX);
        var by = startY + row * (slabH + gapY);
        slabBoxes[idx] = { x: bx, y: by, w: slabW, h: slabH };

        var active = idx === st.activeSlabIndex;
        var pulse = active && !reducedMotion ? 0.5 + 0.5 * Math.sin(t * 3.1) : 0.7;
        if (active) {
          c.fillStyle = hexToRgba(PALETTE.torchOchre, 0.18 + pulse * 0.14);
          c.beginPath();
          c.roundRect ? c.roundRect(bx - 4, by - 4, slabW + 8, slabH + 8, 5) : c.rect(bx - 4, by - 4, slabW + 8, slabH + 8);
          c.fill();
        }

        c.fillStyle = active ? "#46484c" : "#2c2f36";
        c.strokeStyle = active ? PALETTE.boneInscription : PALETTE.weatheredSlab;
        c.lineWidth = active ? 2.0 : 1.1;
        c.beginPath();
        c.moveTo(bx, by + slabH);
        c.lineTo(bx, by + 7);
        c.lineTo(bx + 6, by);
        c.lineTo(bx + slabW - 6, by);
        c.lineTo(bx + slabW, by + 7);
        c.lineTo(bx + slabW, by + slabH);
        c.closePath();
        c.fill();
        c.stroke();

        /* Chiseled Roman lineage rank & guild order grooves */
        c.fillStyle = active ? PALETTE.boneInscription : hexToRgba(PALETTE.boneInscription, 0.65);
        c.font = "600 " + Math.max(9, Math.round(slabW * 0.24)) + "px Georgia, serif";
        c.textAlign = "center";
        c.fillText(ROMAN[idx], bx + slabW * 0.5, by + slabH * 0.34);

        c.strokeStyle = hexToRgba(PALETTE.boneInscription, active ? 0.82 : 0.32 + st.orderClarity * 0.34);
        c.lineWidth = 1;
        for (var gl = 0; gl < 3; gl++) {
          var gy = by + slabH * (0.50 + gl * 0.14);
          c.beginPath();
          c.moveTo(bx + slabW * 0.18, gy);
          c.lineTo(bx + slabW * 0.82, gy);
          c.stroke();
        }
      }

      if (st.activeSlab && st.activeSlab.surname) {
        c.fillStyle = hexToRgba(PALETTE.boneInscription, 0.85);
        c.font = "600 " + Math.max(9, Math.round(rw * 0.036)) + "px Georgia, serif";
        c.textAlign = "center";
        c.fillText(String(st.activeSlab.surname).toUpperCase(), rx + rw * 0.47, ry + rh - 7);
      }
      c.restore();
    }

    function drawLivingChamber(c, rx, ry, rw, rh, st, t) {
      var grad = c.createLinearGradient(rx, ry, rx, ry + rh);
      grad.addColorStop(0, "#2b1e19");
      grad.addColorStop(0.5, "#38261e");
      grad.addColorStop(1, "#1e1614");
      c.save();
      traceVaultArch(c, rx, ry, rw, rh);
      c.fillStyle = grad;
      c.fill();
      c.clip();

      /* Warm piazza security glow */
      var secGlow = c.createRadialGradient(
        rx + rw * 0.5, ry + rh * 0.52, rw * 0.04,
        rx + rw * 0.5, ry + rh * 0.52, rw * 0.62
      );
      secGlow.addColorStop(0, hexToRgba(PALETTE.torchOchre, 0.16 + st.livingSecurity * 0.26));
      secGlow.addColorStop(1, "rgba(15,14,17,0)");
      c.fillStyle = secGlow;
      c.fillRect(rx, ry, rw, rh);

      /* Multi-tiered travertine arcades & pitched terracotta roofs */
      var tiers = 4;
      for (var tr = 0; tr < tiers; tr++) {
        var ty = ry + rh * (0.24 + tr * 0.175);
        var tierH = rh * 0.155;
        var margin = rw * (0.08 - tr * 0.012);
        var tw = rw - margin * 2;
        var tx = rx + margin;

        /* Pitched terracotta tile roof */
        c.fillStyle = PALETTE.livingTerracotta;
        c.beginPath();
        c.moveTo(tx - 4, ty + 8);
        c.lineTo(tx + tw * 0.5, ty - 7);
        c.lineTo(tx + tw + 4, ty + 8);
        c.closePath();
        c.fill();

        /* Travertine loggia wall */
        c.fillStyle = hexToRgba(PALETTE.travertineArcade, 0.86 - tr * 0.06);
        c.fillRect(tx, ty + 8, tw, tierH - 8);

        /* Arched arcade bays */
        var bays = 5 + (tr % 2);
        var bayW = tw / bays;
        for (var b = 0; b < bays; b++) {
          var bx = tx + b * bayW + bayW * 0.18;
          var bw = bayW * 0.64;
          var bh = (tierH - 14) * 0.78;
          var by = ty + tierH - bh;
          c.fillStyle = "#211612";
          c.beginPath();
          c.moveTo(bx, by + bh);
          c.lineTo(bx, by + bw * 0.5);
          c.arc(bx + bw * 0.5, by + bw * 0.5, bw * 0.5, Math.PI, 0);
          c.lineTo(bx + bw, by + bh);
          c.closePath();
          c.fill();
        }
      }

      /* Stepped central alley & crowded living silhouettes */
      c.strokeStyle = hexToRgba(PALETTE.travertineArcade, 0.42);
      c.lineWidth = 1.2;
      for (var stp = 0; stp < 14; stp++) {
        var sy = ry + rh * (0.30 + stp * 0.046);
        c.beginPath();
        c.moveTo(rx + rw * 0.38, sy);
        c.lineTo(rx + rw * 0.62, sy);
        c.stroke();
      }

      var crowdN = clamp(Math.round(st.livingCount / 9), 4, 28);
      for (var p = 0; p < crowdN; p++) {
        var seed = LIVING_LANTERNS[p % LIVING_LANTERNS.length];
        var drift = reducedMotion ? 0 : Math.sin(t * 1.4 + seed.flicker + p) * 3.5;
        var px = rx + rw * seed.u + drift;
        var py = ry + rh * (0.27 + ((p * 0.067) % 0.64));
        c.fillStyle = "#191210";
        c.beginPath();
        c.arc(px, py - 4, 2.2, 0, Math.PI * 2);
        c.fill();
        c.fillRect(px - 2, py - 2, 4, 6);
      }

      /* Workshop lanterns */
      for (var l = 0; l < LIVING_LANTERNS.length; l++) {
        var lt = LIVING_LANTERNS[l];
        var flk = reducedMotion ? 0.85 : 0.68 + 0.32 * Math.sin(t * 4.2 + lt.flicker);
        var lx = rx + rw * lt.u;
        var ly = ry + rh * lt.v;
        c.fillStyle = hexToRgba(PALETTE.torchOchre, 0.25 * flk);
        c.beginPath();
        c.arc(lx, ly, lt.size * 3.2, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = hexToRgba("#ffe29a", 0.9 * flk);
        c.beginPath();
        c.arc(lx, ly, lt.size, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();
    }

    function drawUnbornChamber(c, rx, ry, rw, rh, st, t) {
      var grad = c.createLinearGradient(rx, ry, rx, ry + rh);
      grad.addColorStop(0, PALETTE.carraraUnborn);
      grad.addColorStop(0.58, "#dcd9d0");
      grad.addColorStop(1, "#b9c5cc");
      c.save();
      traceVaultArch(c, rx, ry, rw, rh);
      c.fillStyle = grad;
      c.fill();
      c.clip();

      /* Concentric porous sponge-marble domes overhead */
      for (var dm = 0; dm < 3; dm++) {
        var domeR = rw * (0.56 - dm * 0.13);
        c.strokeStyle = hexToRgba(PALETTE.porousSpongeBlue, 0.42 + dm * 0.12);
        c.lineWidth = 1.6;
        c.beginPath();
        c.arc(rx + rw * 0.5, ry + rh * 0.27, domeR, Math.PI, 0);
        c.stroke();
      }

      /* Organic cellular sponge pores perforating the hollow marble */
      for (var sp = 0; sp < SPONGE_PORES.length; sp++) {
        var pr = SPONGE_PORES[sp];
        var px = rx + rw * pr.u;
        var py = ry + rh * pr.v;
        if (py > ry + rh * 0.53 && px > rx + rw * 0.08 && px < rx + rw * 0.92) continue;
        var prx = pr.r * (rw / 280);
        var pry = prx * pr.aspect;
        c.save();
        c.translate(px, py);
        c.rotate(pr.tilt);
        c.fillStyle = hexToRgba(PALETTE.porousSpongeBlue, 0.25 + pr.depth * 0.36);
        c.beginPath();
        c.ellipse(0, 0, Math.max(1.2, prx), Math.max(1.0, pry), 0, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = hexToRgba("#ffffff", 0.55);
        c.lineWidth = 0.7;
        c.stroke();
        c.restore();
      }

      /* 8 Empty Arched Niches (zero furniture, zero carved names) */
      var padX = Math.max(10, rw * 0.06);
      var usableW = rw - padX * 2;
      var cols = 4;
      var gapX = Math.max(5, usableW * 0.045);
      var nw = (usableW - gapX * (cols - 1)) / cols;
      var nh = Math.min(rh * 0.17, Math.max(36, nw * 1.38));
      var startY = ry + rh * 0.56;
      var gapY = Math.max(8, rh * 0.035);
      var echoCx = rx + rw * 0.5;
      var echoCy = ry + rh * 0.66;

      for (var i = 0; i < 8; i++) {
        var col = i % 4;
        var row = Math.floor(i / 4);
        var nx = rx + padX + col * (nw + gapX);
        var ny = startY + row * (nh + gapY);
        nicheBoxes[i] = { x: nx, y: ny, w: nw, h: nh };

        var isAct = i === st.activeNicheIndex;
        if (isAct) {
          echoCx = nx + nw * 0.5;
          echoCy = ny + nh * 0.55;
        }
        var nGrad = c.createLinearGradient(nx, ny, nx, ny + nh);
        nGrad.addColorStop(0, isAct ? "#8cabbd" : "#9db4c0");
        nGrad.addColorStop(1, isAct ? "#eef3f6" : "#d8dde0");

        c.fillStyle = nGrad;
        c.strokeStyle = isAct ? "#53788c" : hexToRgba(PALETTE.porousSpongeBlue, 0.85);
        c.lineWidth = isAct ? 2.0 : 1.1;
        c.beginPath();
        c.moveTo(nx, ny + nh);
        c.lineTo(nx, ny + nw * 0.5);
        c.arc(nx + nw * 0.5, ny + nw * 0.5, nw * 0.5, Math.PI, 0);
        c.lineTo(nx + nw, ny + nh);
        c.closePath();
        c.fill();
        c.stroke();

        /* Swept bare marble sill proving 0 furnishings */
        c.strokeStyle = hexToRgba("#ffffff", 0.78);
        c.beginPath();
        c.moveTo(nx + 3, ny + nh - 2);
        c.lineTo(nx + nw - 3, ny + nh - 2);
        c.stroke();
      }

      /* Radiating silver-blue footstep echo rings */
      var echoAmp = Math.max(st.echoPulse, st.unbornExpectation * 0.28);
      if (echoAmp > 0.02) {
        var ringCount = 5;
        for (var er = 0; er < ringCount; er++) {
          var prog = reducedMotion
            ? (er + 1) / ringCount
            : (((1 - st.echoPulse) * 0.85 + t * 0.36 + er / ringCount) % 1);
          var rad = prog * Math.max(rw, rh) * 0.68;
          var alpha = (1 - prog) * (0.22 + st.echoPulse * 0.58);
          c.strokeStyle = hexToRgba("#5c859c", alpha);
          c.lineWidth = 1.5 + st.echoPulse * 1.3;
          c.beginPath();
          c.arc(echoCx, echoCy, Math.max(4, rad), 0, Math.PI * 2);
          c.stroke();
        }
      }
      c.restore();
    }

    function drawTriadMode(c, st, particles, t) {
      var padX = Math.max(8, width * 0.018);
      var padTop = Math.max(26, height * 0.055);
      var padBot = Math.max(14, height * 0.032);
      var gap = Math.max(8, width * 0.016);
      var cw = (width - padX * 2 - gap * 2) / 3;
      var ch = height - padTop - padBot;

      var x0 = padX;
      var x1 = padX + cw + gap;
      var x2 = padX + (cw + gap) * 2;

      drawNecropolisChamber(c, x0, padTop, cw, ch, st, t);
      drawLivingChamber(c, x1, padTop, cw, ch, st, t);
      drawUnbornChamber(c, x2, padTop, cw, ch, st, t);

      /* Two Pilgrimage Bridges connecting Living <-> Dead and Living <-> Unborn */
      var bridgeY = padTop + ch * 0.50;
      var bridges = [
        { ax: x0 + cw - 10, bx: x1 + 10, tint: PALETTE.weatheredSlab },
        { ax: x1 + cw - 10, bx: x2 + 10, tint: PALETTE.carraraUnborn }
      ];
      for (var bi = 0; bi < bridges.length; bi++) {
        var br = bridges[bi];
        var midX = (br.ax + br.bx) * 0.5;
        c.fillStyle = "#2b2523";
        c.strokeStyle = br.tint;
        c.lineWidth = 1.6;
        c.beginPath();
        c.moveTo(br.ax, bridgeY + 9);
        c.quadraticCurveTo(midX, bridgeY - 9, br.bx, bridgeY + 9);
        c.lineTo(br.bx, bridgeY + 18);
        c.quadraticCurveTo(midX, bridgeY + 3, br.ax, bridgeY + 18);
        c.closePath();
        c.fill();
        c.stroke();
      }

      /* Animated causal flow particles along pilgrimage routes */
      var list = Array.isArray(particles) ? particles : [];
      for (var pi = 0; pi < list.length; pi++) {
        var pt = list[pi];
        var prog = clamp(Number(pt.t) || 0, 0, 1);
        var lane = clamp(Number(pt.clanIndex != null ? pt.clanIndex : pt.lane) || 0, 0, 7);
        var sx = x1 + cw * 0.5;
        var sy = bridgeY + 4;
        var ex = sx;
        var ey = sy;
        var col = PALETTE.torchOchre;

        if (pt.kind === "visit_dead" || pt.kind === "death") {
          var sb = slabBoxes[lane] || { x: x0 + cw * 0.5, y: padTop + ch * 0.7, w: 20, h: 20 };
          var tx = sb.x + sb.w * 0.5;
          var ty = sb.y + sb.h * 0.4;
          var u = pt.kind === "visit_dead" ? (prog < 0.5 ? prog * 2 : (1 - prog) * 2) : prog;
          ex = lerp(sx, tx, u);
          ey = lerp(sy, ty, u) - Math.sin(u * Math.PI) * 22;
          col = pt.kind === "death" ? PALETTE.boneInscription : PALETTE.torchOchre;
        } else if (pt.kind === "visit_unborn" || pt.kind === "birth") {
          var nb = nicheBoxes[lane] || { x: x2 + cw * 0.5, y: padTop + ch * 0.7, w: 20, h: 20 };
          var ux = nb.x + nb.w * 0.5;
          var uy = nb.y + nb.h * 0.5;
          var u2 = pt.kind === "birth" ? 1 - prog : (prog < 0.5 ? prog * 2 : (1 - prog) * 2);
          ex = lerp(sx, ux, u2);
          ey = lerp(sy, uy, u2) - Math.sin(u2 * Math.PI) * 22;
          col = pt.kind === "birth" ? PALETTE.hollowEchoSilver : PALETTE.porousSpongeBlue;
        }

        c.fillStyle = hexToRgba(col, 0.28);
        c.beginPath();
        c.arc(ex, ey, 7, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = col;
        c.beginPath();
        c.arc(ex, ey, 3.1, 0, Math.PI * 2);
        c.fill();
      }

      /* Chamber framing & focusedChamber architectural emphasis */
      var specs = [
        { key: "dead", x: x0, label: "LAUDOMIA MORTUORUM", stroke: PALETTE.weatheredSlab },
        { key: "living", x: x1, label: "LAUDOMIA VIVENTIUM", stroke: PALETTE.torchOchre },
        { key: "unborn", x: x2, label: "LAUDOMIA NASCITURORUM", stroke: PALETTE.hollowEchoSilver }
      ];
      var fz = Math.max(9, Math.min(12, Math.round(cw * 0.042)));
      for (var si = 0; si < specs.length; si++) {
        var sp = specs[si];
        var dimmed = st.focusedChamber !== "all" && st.focusedChamber !== sp.key;
        var focused = st.focusedChamber === sp.key;
        c.save();
        traceVaultArch(c, sp.x, padTop, cw, ch);
        if (dimmed) {
          c.fillStyle = "rgba(11,10,14,0.48)";
          c.fill();
        }
        c.strokeStyle = focused ? PALETTE.boneInscription : hexToRgba(sp.stroke, dimmed ? 0.35 : 0.78);
        c.lineWidth = focused ? 2.6 : 1.4;
        c.stroke();
        c.restore();

        c.fillStyle = dimmed ? hexToRgba(sp.stroke, 0.45) : sp.stroke;
        c.font = "600 " + fz + "px Georgia, serif";
        c.textAlign = "center";
        c.fillText(sp.label, sp.x + cw * 0.5, padTop - 7);
      }
    }

    function drawFunnelMode(c, st, particles, t) {
      var cx = width * 0.5;
      var cy = height * 0.53;
      var outerRx = width * 0.46;
      var outerRy = height * 0.43;
      var squeeze = 1 - st.funnelDensity * 0.74;
      var pitRx = Math.max(16, width * 0.145 * squeeze);
      var pitRy = Math.max(12, height * 0.115 * squeeze);
      funnelGeom = { cx: cx, cy: cy, pitRx: pitRx, pitRy: pitRy, topY: cy - outerRy, spanH: outerRy * 2 };

      /* Crimson-slate suffocation backdrop */
      var bg = c.createRadialGradient(cx, cy, pitRx * 0.4, cx, cy, Math.max(outerRx, outerRy) * 1.15);
      bg.addColorStop(0, hexToRgba(PALETTE.torchOchre, 0.25 * squeeze));
      bg.addColorStop(0.38, hexToRgba(PALETTE.funnelCrimsonDread, 0.22 + st.funnelDensity * 0.46));
      bg.addColorStop(1, PALETTE.obsidianVault);
      c.fillStyle = bg;
      c.fillRect(0, 0, width, height);

      var tiers = st.amphitheaterTiers;
      for (var tr = tiers; tr >= 1; tr--) {
        var u = tr / tiers;
        var rx = lerp(pitRx, outerRx, u);
        var ry = lerp(pitRy, outerRy, u);
        var sinkY = cy + (1 - u) * (height * 0.045 * st.funnelDensity);

        c.fillStyle = tr % 2 === 0
          ? hexToRgba(PALETTE.slateNecropolis, 0.72)
          : hexToRgba("#1a1b20", 0.84);
        c.strokeStyle = hexToRgba(PALETTE.funnelCrimsonDread, 0.18 + st.funnelDensity * 0.42);
        c.lineWidth = 1.2;
        c.beginPath();
        c.ellipse(cx, sinkY, rx, ry, 0, 0, Math.PI * 2);
        c.fill();
        c.stroke();

        /* Left half: packed stone grave slabs; Right half: swarming porous eyes/silhouettes */
        var packN = Math.round((14 + st.funnelDensity * 22) * (0.45 + u * 0.65));
        for (var k = 0; k < packN; k++) {
          var angLeft = lerp(Math.PI * 0.53, Math.PI * 1.47, (k + 0.5) / packN);
          var lx = cx + Math.cos(angLeft) * (rx - 4);
          var ly = sinkY + Math.sin(angLeft) * (ry - 3);
          c.fillStyle = k % 3 === 0 ? PALETTE.boneInscription : PALETTE.weatheredSlab;
          c.fillRect(lx - 2.2, ly - 4.2, 4.4, 8.2);

          var angRight = lerp(-Math.PI * 0.47, Math.PI * 0.47, (k + 0.5) / packN);
          var ux = cx + Math.cos(angRight) * (rx - 4);
          var uy = sinkY + Math.sin(angRight) * (ry - 3);
          c.fillStyle = hexToRgba(PALETTE.porousSpongeBlue, 0.52 + st.funnelDensity * 0.34);
          c.beginPath();
          c.arc(ux, uy, 3.0, 0, Math.PI * 2);
          c.fill();
          c.fillStyle = PALETTE.carraraUnborn;
          c.beginPath();
          c.arc(ux - 0.6, uy - 0.4, 1.1, 0, Math.PI * 2);
          c.fill();
        }
      }

      /* Radial amphitheater compression ribs */
      c.strokeStyle = hexToRgba(PALETTE.obsidianVault, 0.62);
      c.lineWidth = 1.1;
      for (var ai = 0; ai < 12; ai++) {
        var aang = (ai / 12) * Math.PI * 2;
        c.beginPath();
        c.moveTo(cx + Math.cos(aang) * outerRx, cy + Math.sin(aang) * outerRy);
        c.lineTo(cx + Math.cos(aang) * pitRx, cy + Math.sin(aang) * pitRy);
        c.stroke();
      }

      /* Tiny warm-lit Living pit at bottom of the stadium funnel */
      var pitY = cy + height * 0.045 * st.funnelDensity;
      c.save();
      c.beginPath();
      c.ellipse(cx, pitY, pitRx, pitRy, 0, 0, Math.PI * 2);
      c.fillStyle = st.isChoking ? "#2a1214" : "#2f1f18";
      c.fill();
      c.strokeStyle = st.isChoking ? PALETTE.funnelCrimsonDread : PALETTE.torchOchre;
      c.lineWidth = 2.0;
      c.stroke();
      c.clip();

      var roofCount = 6;
      for (var rf = 0; rf < roofCount; rf++) {
        var rxp = cx - pitRx * 0.72 + (rf / (roofCount - 1)) * pitRx * 1.44;
        var ryp = pitY + ((rf % 2) - 0.5) * pitRy * 0.42;
        c.fillStyle = PALETTE.livingTerracotta;
        c.fillRect(rxp - 6, ryp - 4, 12, 8);
        c.fillStyle = st.isChoking ? "#d95b43" : "#ffe29a";
        c.beginPath();
        c.arc(rxp, ryp, st.isChoking ? 1.5 : 2.3, 0, Math.PI * 2);
        c.fill();
      }
      c.restore();

      if (st.isChoking) {
        var chokeVig = c.createRadialGradient(cx, pitY, pitRx * 0.5, cx, pitY, outerRx * 0.95);
        chokeVig.addColorStop(0, "rgba(143,50,55,0.12)");
        chokeVig.addColorStop(0.55, "rgba(143,50,55,0.34)");
        chokeVig.addColorStop(1, "rgba(15,14,17,0.72)");
        c.fillStyle = chokeVig;
        c.fillRect(0, 0, width, height);
      }

      c.fillStyle = PALETTE.boneInscription;
      c.font = "600 " + Math.max(10, Math.round(width * 0.013)) + "px Georgia, serif";
      c.textAlign = "center";
      c.fillText("ANGOR I — AMPHITHEATRUM SUFFOCATIONIS", cx, Math.max(18, height * 0.04));
    }

    function drawHourglassMode(c, st, particles, t) {
      var cx = width * 0.5;
      var cy = height * 0.51;
      var totalH = Math.min(height * 0.80, 520);
      var topY = cy - totalH * 0.5;
      var botY = cy + totalH * 0.5;
      var halfW = Math.min(width * 0.24, totalH * 0.34);
      var waistW = Math.max(12, halfW * 0.13);
      var claspW = Math.max(22, halfW * 0.24);
      var shudderDx = st.turnShudder > 0.005
        ? Math.sin(t * 46 + st.turnShudder * 21) * st.turnShudder * 10
        : 0;

      hourglassGeom = {
        cx: cx + shudderDx,
        cy: cy,
        topY: topY,
        botY: botY,
        halfW: halfW,
        claspW: claspW
      };

      /* Moonlit stillness when lastGrainFallen === true */
      if (st.lastGrainFallen) {
        var moonGrad = c.createLinearGradient(cx - halfW, topY, cx + halfW, botY);
        moonGrad.addColorStop(0, "rgba(197,212,220,0.14)");
        moonGrad.addColorStop(0.5, "rgba(154,182,194,0.08)");
        moonGrad.addColorStop(1, "rgba(15,14,17,0)");
        c.fillStyle = moonGrad;
        c.fillRect(0, 0, width, height);
      }

      c.save();
      c.translate(shudderDx, 0);

      /* Fixed iron wall-clasps locking the bronze uprights against rotation */
      var leftPillarX = cx - halfW - claspW * 0.55;
      var rightPillarX = cx + halfW + claspW * 0.55;
      var pillars = [leftPillarX, rightPillarX];
      for (var pi = 0; pi < 2; pi++) {
        var px = pillars[pi];
        c.fillStyle = PALETTE.hourglassBronze;
        c.fillRect(px - 4, topY - 6, 8, totalH + 12);

        /* Heavy riveted iron lock brackets */
        c.fillStyle = st.turnShudder > 0.05 ? "#5a2b2d" : "#2b2e35";
        c.strokeStyle = st.turnShudder > 0.05 ? PALETTE.funnelCrimsonDread : PALETTE.weatheredSlab;
        c.lineWidth = 1.6;
        c.fillRect(px - claspW * 0.5, cy - 22, claspW, 44);
        c.strokeRect(px - claspW * 0.5, cy - 22, claspW, 44);

        /* Iron rivets */
        c.fillStyle = PALETTE.boneInscription;
        c.beginPath();
        c.arc(px - claspW * 0.26, cy - 12, 2.2, 0, Math.PI * 2);
        c.arc(px + claspW * 0.26, cy - 12, 2.2, 0, Math.PI * 2);
        c.arc(px - claspW * 0.26, cy + 12, 2.2, 0, Math.PI * 2);
        c.arc(px + claspW * 0.26, cy + 12, 2.2, 0, Math.PI * 2);
        c.fill();
      }

      /* Oxidized-bronze top and bottom entablature caps */
      c.fillStyle = PALETTE.hourglassBronze;
      c.fillRect(leftPillarX - 10, topY - 12, (rightPillarX - leftPillarX) + 20, 12);
      c.fillRect(leftPillarX - 10, botY, (rightPillarX - leftPillarX) + 20, 14);

      /* Upper & Lower Blown-Glass Bulbs */
      c.save();
      c.beginPath();
      c.moveTo(cx - halfW, topY);
      c.bezierCurveTo(cx - halfW, cy - totalH * 0.12, cx - waistW, cy - totalH * 0.07, cx - waistW, cy);
      c.bezierCurveTo(cx - waistW, cy + totalH * 0.07, cx - halfW, cy + totalH * 0.12, cx - halfW, botY);
      c.lineTo(cx + halfW, botY);
      c.bezierCurveTo(cx + halfW, cy + totalH * 0.12, cx + waistW, cy + totalH * 0.07, cx + waistW, cy);
      c.bezierCurveTo(cx + waistW, cy - totalH * 0.07, cx + halfW, cy - totalH * 0.12, cx + halfW, topY);
      c.closePath();

      var glassGrad = c.createLinearGradient(cx - halfW, topY, cx + halfW, botY);
      glassGrad.addColorStop(0, "rgba(197,212,220,0.13)");
      glassGrad.addColorStop(0.5, "rgba(25,27,33,0.45)");
      glassGrad.addColorStop(1, st.lastGrainFallen ? "rgba(197,212,220,0.22)" : "rgba(156,122,68,0.14)");
      c.fillStyle = glassGrad;
      c.fill();
      c.clip();

      /* Upper Bulb: Porous Marble Unborn Vaults + unbornGrainsRemaining */
      c.strokeStyle = hexToRgba(PALETTE.carraraUnborn, 0.28);
      c.lineWidth = 1.2;
      for (var ua = 0; ua < 4; ua++) {
        var ux = cx - halfW * 0.66 + ua * (halfW * 0.44);
        c.beginPath();
        c.arc(ux, topY + totalH * 0.14, halfW * 0.17, Math.PI, 0);
        c.stroke();
      }

      var uCount = st.unbornGrainsRemaining;
      var uFillH = (uCount / 240) * (totalH * 0.34);
      for (var ug = 0; ug < uCount; ug++) {
        var sd = HOURGLASS_SEEDS[ug % 240];
        var rowFrac = (ug + 0.5) / Math.max(1, uCount);
        var gy = (cy - totalH * 0.05) - rowFrac * uFillH;
        var spanAtY = lerp(waistW * 0.9, halfW * 0.84, clamp((cy - gy) / (totalH * 0.42), 0, 1));
        var gx = cx + (sd.u - 0.5) * 2 * spanAtY * 0.88;
        c.fillStyle = sd.shade > 0.92 ? PALETTE.carraraUnborn : "#e5c883";
        c.beginPath();
        c.arc(gx, gy, 2.1, 0, Math.PI * 2);
        c.fill();
      }

      /* Narrow Waist: Flickering Living Quarter Rooftops + livingWaistGrains */
      for (var wr = -2; wr <= 2; wr++) {
        var wx = cx + wr * (waistW * 0.46);
        c.fillStyle = st.lastGrainFallen ? "#4a4e57" : PALETTE.livingTerracotta;
        c.fillRect(wx - 4, cy - 5, 8, 9);
        if (!st.lastGrainFallen) {
          c.fillStyle = PALETTE.torchOchre;
          c.fillRect(wx - 1.2, cy - 2, 2.4, 3);
        }
      }

      var wCount = st.livingWaistGrains;
      for (var wg = 0; wg < wCount; wg++) {
        var wsd = HOURGLASS_SEEDS[(wg + 80) % 240];
        var fall = reducedMotion ? wsd.v : ((wsd.v + t * 0.9 + wg * 0.07) % 1);
        var fgy = (cy - totalH * 0.04) + fall * (totalH * 0.22);
        var fgx = cx + (wsd.u - 0.5) * waistW * 1.1;
        c.fillStyle = PALETTE.torchOchre;
        c.beginPath();
        c.arc(fgx, fgy, 2.0, 0, Math.PI * 2);
        c.fill();
      }

      /* Lower Bulb: Broadening Pyramid of Tomb Slabs & Silica Sand (deadHeapGrains) */
      var dCount = st.deadHeapGrains;
      var heapH = (dCount / 240) * (totalH * 0.38);
      if (heapH > 2) {
        c.fillStyle = st.lastGrainFallen
          ? "rgba(197,212,220,0.30)"
          : "rgba(125,130,136,0.28)";
        c.beginPath();
        c.moveTo(cx - halfW * 0.92, botY);
        c.quadraticCurveTo(cx, botY - heapH * 1.32, cx + halfW * 0.92, botY);
        c.closePath();
        c.fill();
      }

      for (var dg = 0; dg < dCount; dg++) {
        var dsd = HOURGLASS_SEEDS[(239 - (dg % 240))];
        var layer = dg / Math.max(1, dCount);
        var dy = botY - 3 - layer * heapH;
        var baseSpan = lerp(halfW * 0.88, waistW * 0.55, layer);
        var dx = cx + (dsd.u - 0.5) * 2 * baseSpan;
        if (dsd.isSlab) {
          c.fillStyle = st.lastGrainFallen ? PALETTE.hollowEchoSilver : PALETTE.boneInscription;
          c.fillRect(dx - 2.6, dy - 4.0, 5.2, 6.2);
        } else {
          c.fillStyle = st.lastGrainFallen ? PALETTE.porousSpongeBlue : PALETTE.weatheredSlab;
          c.beginPath();
          c.arc(dx, dy, 1.9, 0, Math.PI * 2);
          c.fill();
        }
      }

      c.restore(); /* end glass clip */

      /* Blown-glass specular outline */
      c.strokeStyle = st.lastGrainFallen ? PALETTE.hollowEchoSilver : hexToRgba(PALETTE.hourglassBronze, 0.88);
      c.lineWidth = 2.0;
      c.beginPath();
      c.moveTo(cx - halfW, topY);
      c.bezierCurveTo(cx - halfW, cy - totalH * 0.12, cx - waistW, cy - totalH * 0.07, cx - waistW, cy);
      c.bezierCurveTo(cx - waistW, cy + totalH * 0.07, cx - halfW, cy + totalH * 0.12, cx - halfW, botY);
      c.moveTo(cx + halfW, topY);
      c.bezierCurveTo(cx + halfW, cy - totalH * 0.12, cx + waistW, cy - totalH * 0.07, cx + waistW, cy);
      c.bezierCurveTo(cx + waistW, cy + totalH * 0.07, cx + halfW, cy + totalH * 0.12, cx + halfW, botY);
      c.stroke();

      c.restore(); /* end shudder translate */

      c.fillStyle = st.lastGrainFallen ? PALETTE.hollowEchoSilver : PALETTE.boneInscription;
      c.font = "600 " + Math.max(10, Math.round(width * 0.013)) + "px Georgia, serif";
      c.textAlign = "center";
      c.fillText(
        st.lastGrainFallen
          ? "SILENTIUM ULTIMUM — THE LAST GRAIN HAS FALLEN"
          : "ANGOR II — CLEPSYDRA INCONVERSIBILIS",
        cx,
        Math.max(18, height * 0.04)
      );
    }

    function render(state, flowParticles, timeSec) {
      lastState = normalizeState(state);
      if (!ctx) return;
      var t = typeof timeSec === "number" ? timeSec : 0;

      if (canvas && (canvas.width === 0 || canvas.height === 0)) {
        resize(width, height, dpr);
      }
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = PALETTE.obsidianVault;
      ctx.fillRect(0, 0, width, height);

      if (lastState.anguishMode === "funnel") {
        drawFunnelMode(ctx, lastState, flowParticles, t);
      } else if (lastState.anguishMode === "hourglass") {
        drawHourglassMode(ctx, lastState, flowParticles, t);
      } else {
        drawTriadMode(ctx, lastState, flowParticles, t);
      }
      ctx.restore();
    }

    function pickAt(localX, localY, state) {
      var st = state ? normalizeState(state) : lastState;
      var x = Number(localX) || 0;
      var y = Number(localY) || 0;

      if (st.anguishMode === "funnel") {
        var fg = funnelGeom;
        var prx = Math.max(26, fg.pitRx);
        var pry = Math.max(20, fg.pitRy);
        var nd = Math.hypot((x - fg.cx) / prx, (y - fg.cy) / pry);
        if (nd <= 1.08) {
          var pang = Math.atan2(y - fg.cy, x - fg.cx);
          return { zone: "funnel_pit", index: clamp(Math.floor(((pang + Math.PI) / (Math.PI * 2)) * 8), 0, 7) };
        }
        var tierIdx = clamp(Math.floor(((y - fg.topY) / Math.max(1, fg.spanH)) * 8), 0, 7);
        return { zone: x < fg.cx ? "dead" : "unborn", index: tierIdx };
      }

      if (st.anguishMode === "hourglass") {
        var hg = hourglassGeom;
        var leftClaspX = hg.cx - hg.halfW - hg.claspW * 0.55;
        var rightClaspX = hg.cx + hg.halfW + hg.claspW * 0.55;
        if (
          Math.abs(x - leftClaspX) <= hg.claspW * 0.85 ||
          Math.abs(x - rightClaspX) <= hg.claspW * 0.85 ||
          y < hg.topY ||
          y > hg.botY
        ) {
          return { zone: "hourglass_clasp", index: x < hg.cx ? 0 : 1 };
        }
        var bIdx = clamp(Math.floor(((y - hg.topY) / Math.max(1, hg.botY - hg.topY)) * 8), 0, 7);
        return { zone: "hourglass_bulb", index: bIdx };
      }

      /* Default: Triad Triptych */
      if (x < width / 3) {
        var bestS = 0;
        var bestSD = Infinity;
        for (var i = 0; i < 8; i++) {
          var sb = slabBoxes[i];
          if (!sb) continue;
          if (x >= sb.x && x <= sb.x + sb.w && y >= sb.y && y <= sb.y + sb.h) {
            return { zone: "dead", index: i };
          }
          var d = Math.hypot(x - (sb.x + sb.w * 0.5), y - (sb.y + sb.h * 0.5));
          if (d < bestSD) { bestSD = d; bestS = i; }
        }
        return { zone: "dead", index: bestS };
      }
      if (x > (width * 2) / 3) {
        var bestN = 0;
        var bestND = Infinity;
        for (var j = 0; j < 8; j++) {
          var nb = nicheBoxes[j];
          if (!nb) continue;
          if (x >= nb.x && x <= nb.x + nb.w && y >= nb.y && y <= nb.y + nb.h) {
            return { zone: "unborn", index: j };
          }
          var dn = Math.hypot(x - (nb.x + nb.w * 0.5), y - (nb.y + nb.h * 0.5));
          if (dn < bestND) { bestND = dn; bestN = j; }
        }
        return { zone: "unborn", index: bestN };
      }
      var lIdx = clamp(Math.floor((y / Math.max(1, height)) * 4) * 2 + (x < width * 0.5 ? 0 : 1), 0, 7);
      return { zone: "living", index: lIdx };
    }

    function renderArchivalPlate(plateCanvas, kind, state) {
      if (!plateCanvas || typeof plateCanvas.getContext !== "function") return;
      var pc = plateCanvas.getContext("2d");
      if (!pc) return;
      var st = state ? normalizeState(state) : lastState;

      if (!plateCanvas.width || plateCanvas.width < 320) {
        plateCanvas.width = 680;
        plateCanvas.height = 440;
      }
      var pw = plateCanvas.width;
      var ph = plateCanvas.height;
      var isMap = String(kind || "map").toLowerCase().indexOf("map") !== -1;

      pc.save();
      pc.setTransform(1, 0, 0, 1, 0, 0);

      if (isMap) {
        /* Copperplate cartographic survey on aged laid parchment */
        var pGrad = pc.createLinearGradient(0, 0, pw, ph);
        pGrad.addColorStop(0, "#e9dfc7");
        pGrad.addColorStop(0.5, "#dfd2b4");
        pGrad.addColorStop(1, "#cfbe9a");
        pc.fillStyle = pGrad;
        pc.fillRect(0, 0, pw, ph);

        /* Laid paper chain lines */
        pc.strokeStyle = "rgba(88,68,42,0.08)";
        pc.lineWidth = 1;
        for (var ly = 12; ly < ph; ly += 8) {
          pc.beginPath();
          pc.moveTo(0, ly);
          pc.lineTo(pw, ly);
          pc.stroke();
        }

        /* Double copperplate border */
        pc.strokeStyle = "#3a2e21";
        pc.lineWidth = 2.2;
        pc.strokeRect(12, 12, pw - 24, ph - 24);
        pc.lineWidth = 0.9;
        pc.strokeRect(17, 17, pw - 34, ph - 34);

        var cy = ph * 0.45;
        var rZone = pw * 0.135;
        var lx = pw * 0.22;
        var mx = pw * 0.50;
        var ux = pw * 0.78;

        /* Left plan: Concentric Necropolis terraces + crenelated wall */
        pc.strokeStyle = "#2b2c30";
        for (var nr = 1; nr <= 6; nr++) {
          pc.lineWidth = nr === 6 ? 1.8 : 0.9;
          pc.beginPath();
          pc.arc(lx, cy, rZone * (nr / 6), 0, Math.PI * 2);
          pc.stroke();
        }
        for (var sv = 0; sv < 8; sv++) {
          var sang = (sv / 8) * Math.PI * 2;
          pc.fillStyle = "#3a2e21";
          pc.fillRect(lx + Math.cos(sang) * rZone * 0.62 - 4, cy + Math.sin(sang) * rZone * 0.62 - 3, 8, 6);
        }

        /* Center plan: Living street blocks & arcades */
        pc.strokeStyle = "#6e3823";
        pc.lineWidth = 1.6;
        pc.strokeRect(mx - rZone * 0.82, cy - rZone * 0.82, rZone * 1.64, rZone * 1.64);
        for (var g = -2; g <= 2; g++) {
          var off = g * rZone * 0.28;
          pc.beginPath();
          pc.moveTo(mx - rZone * 0.76, cy + off);
          pc.lineTo(mx + rZone * 0.76, cy + off);
          pc.moveTo(mx + off, cy - rZone * 0.76);
          pc.lineTo(mx + off, cy + rZone * 0.76);
          pc.stroke();
        }

        /* Two Pilgrimage Bridges */
        pc.strokeStyle = "#3a2e21";
        pc.lineWidth = 3.2;
        pc.beginPath();
        pc.moveTo(lx + rZone, cy);
        pc.lineTo(mx - rZone * 0.82, cy);
        pc.moveTo(mx + rZone * 0.82, cy);
        pc.lineTo(ux - rZone, cy);
        pc.stroke();

        /* Right plan: Porous Unborn Sponge-Marble Dome & 8 Empty Niches */
        pc.strokeStyle = "#415c69";
        pc.lineWidth = 1.7;
        pc.beginPath();
        pc.arc(ux, cy, rZone, 0, Math.PI * 2);
        pc.stroke();
        for (var ni = 0; ni < 8; ni++) {
          var nang = (ni / 8) * Math.PI * 2;
          pc.beginPath();
          pc.arc(ux + Math.cos(nang) * rZone * 0.78, cy + Math.sin(nang) * rZone * 0.78, 7, 0, Math.PI * 2);
          pc.stroke();
        }
        for (var cp = 0; cp < 28; cp++) {
          var pr = SPONGE_PORES[cp];
          pc.beginPath();
          pc.arc(ux + (pr.u - 0.5) * rZone * 1.1, cy + (pr.v - 0.5) * rZone * 1.1, 2.2, 0, Math.PI * 2);
          pc.stroke();
        }

        /* Compass rose & copperplate cartouche inscriptions */
        pc.fillStyle = "#2d2318";
        pc.font = "700 " + Math.max(12, Math.round(pw * 0.022)) + "px Georgia, serif";
        pc.textAlign = "center";
        pc.fillText("TABULA CHOROGRAPHICA — LAUDOMIA TRIPLEX", pw * 0.5, 38);
        pc.font = "600 " + Math.max(10, Math.round(pw * 0.015)) + "px Georgia, serif";
        pc.fillText("NECROPOLIS (" + st.deadSlabsCount + " SLABS)", lx, cy + rZone + 22);
        pc.fillText("URBS VIVENTIUM (" + st.livingCount + ")", mx, cy + rZone + 22);
        pc.fillText("CAVAE NASCITURORUM (0 FURNISHINGS)", ux, cy + rZone + 22);
        pc.fillText("ANGOR I: STADIUM FUNNEL   ·   ANGOR II: UNTURNED HOURGLASS (240 GRAINS)", pw * 0.5, ph - 28);
      } else {
        /* Twilight architectural veduta aquatint plate */
        var vGrad = pc.createLinearGradient(0, 0, 0, ph);
        vGrad.addColorStop(0, "#12131a");
        vGrad.addColorStop(0.62, "#24222b");
        vGrad.addColorStop(1, "#151318");
        pc.fillStyle = vGrad;
        pc.fillRect(0, 0, pw, ph);

        pc.strokeStyle = hexToRgba(PALETTE.hourglassBronze, 0.55);
        pc.lineWidth = 2;
        pc.strokeRect(12, 12, pw - 24, ph - 24);

        var savedSlabs = slabBoxes.slice();
        var savedNiches = nicheBoxes.slice();
        var pad = 28;
        var vw = (pw - pad * 2 - 20) / 3;
        var vh = ph - 92;
        drawNecropolisChamber(pc, pad, 46, vw, vh, st, 1.2);
        drawLivingChamber(pc, pad + vw + 10, 46, vw, vh, st, 1.2);
        drawUnbornChamber(pc, pad + (vw + 10) * 2, 46, vw, vh, st, 1.2);
        slabBoxes = savedSlabs;
        nicheBoxes = savedNiches;

        pc.fillStyle = PALETTE.boneInscription;
        pc.font = "600 " + Math.max(12, Math.round(pw * 0.020)) + "px Georgia, serif";
        pc.textAlign = "center";
        pc.fillText("VEDUTA NOCTURNA — THE THREE CHAMBERS OF LAUDOMIA", pw * 0.5, 33);
        pc.font = "500 " + Math.max(10, Math.round(pw * 0.015)) + "px Georgia, serif";
        pc.fillText("STONE-SLAB NECROPOLIS  ·  LIVING ARCADES  ·  POROUS MARBLE HOLLOWS", pw * 0.5, ph - 22);
      }
      pc.restore();
    }

    return {
      resize: resize,
      setReducedMotion: setReducedMotion,
      render: render,
      pickAt: pickAt,
      renderArchivalPlate: renderArchivalPlate
    };
  }

  function createSoundscape() {
    var muted = true;
    var actx = null;
    var nodes = null;
    var lastAudioState = normalizeState(null);

    function ensureGraph() {
      if (nodes) return nodes;
      try {
        var Ctor = root.AudioContext || root.webkitAudioContext;
        if (!Ctor) return null;
        actx = new Ctor();
        var now = actx.currentTime;

        var master = actx.createGain();
        master.gain.setValueAtTime(0.0001, now);
        master.connect(actx.destination);

        /* Triad Dorian warm murmur */
        var triadGain = actx.createGain();
        triadGain.gain.setValueAtTime(0.0001, now);
        var triadFilter = actx.createBiquadFilter();
        triadFilter.type = "lowpass";
        triadFilter.frequency.setValueAtTime(420, now);
        var tOsc1 = actx.createOscillator();
        var tOsc2 = actx.createOscillator();
        tOsc1.type = "triangle";
        tOsc2.type = "sine";
        tOsc1.frequency.setValueAtTime(146.83, now);
        tOsc2.frequency.setValueAtTime(220.0, now);
        tOsc1.connect(triadFilter);
        tOsc2.connect(triadFilter);
        triadFilter.connect(triadGain);
        triadGain.connect(master);
        tOsc1.start(now);
        tOsc2.start(now);

        /* Funnel amphitheater sub-bass & cluster pressure */
        var funnelGain = actx.createGain();
        funnelGain.gain.setValueAtTime(0.0001, now);
        var funnelFilter = actx.createBiquadFilter();
        funnelFilter.type = "lowpass";
        funnelFilter.frequency.setValueAtTime(190, now);
        var fOsc1 = actx.createOscillator();
        var fOsc2 = actx.createOscillator();
        fOsc1.type = "sawtooth";
        fOsc2.type = "triangle";
        fOsc1.frequency.setValueAtTime(73.42, now);
        fOsc2.frequency.setValueAtTime(77.78, now);
        fOsc1.connect(funnelFilter);
        fOsc2.connect(funnelFilter);
        funnelFilter.connect(funnelGain);
        funnelGain.connect(master);
        fOsc1.start(now);
        fOsc2.start(now);

        /* Hourglass sparse crystalline glass aura */
        var glassGain = actx.createGain();
        glassGain.gain.setValueAtTime(0.0001, now);
        var gOsc1 = actx.createOscillator();
        var gOsc2 = actx.createOscillator();
        gOsc1.type = "sine";
        gOsc2.type = "sine";
        gOsc1.frequency.setValueAtTime(587.33, now);
        gOsc2.frequency.setValueAtTime(880.0, now);
        gOsc1.connect(glassGain);
        gOsc2.connect(glassGain);
        glassGain.connect(master);
        gOsc1.start(now);
        gOsc2.start(now);

        nodes = {
          master: master,
          triadGain: triadGain,
          triadFilter: triadFilter,
          funnelGain: funnelGain,
          funnelFilter: funnelFilter,
          glassGain: glassGain
        };
      } catch (_e) {
        nodes = null;
      }
      return nodes;
    }

    function unlock() {
      try {
        if (!muted) ensureGraph();
        if (actx && actx.state === "suspended") actx.resume();
      } catch (_e) {}
    }

    function syncState(state) {
      if (state) lastAudioState = normalizeState(state);
      if (!nodes || !actx) return;
      try {
        var now = actx.currentTime;
        if (muted || (lastAudioState.anguishMode === "hourglass" && lastAudioState.lastGrainFallen)) {
          nodes.master.gain.setTargetAtTime(0.00001, now, 0.06);
          nodes.triadGain.gain.setTargetAtTime(0.00001, now, 0.06);
          nodes.funnelGain.gain.setTargetAtTime(0.00001, now, 0.06);
          nodes.glassGain.gain.setTargetAtTime(0.00001, now, 0.05);
          return;
        }
        nodes.master.gain.setTargetAtTime(0.11, now, 0.08);
        var mode = lastAudioState.anguishMode;
        if (mode === "funnel") {
          var dens = lastAudioState.funnelDensity;
          nodes.triadGain.gain.setTargetAtTime(0.01, now, 0.12);
          nodes.funnelGain.gain.setTargetAtTime(0.08 + dens * 0.28, now, 0.10);
          nodes.funnelFilter.frequency.setTargetAtTime(140 + dens * 480, now, 0.10);
          nodes.glassGain.gain.setTargetAtTime(0.0001, now, 0.10);
        } else if (mode === "hourglass") {
          var rem = clamp(lastAudioState.grainsRemaining / 240, 0.04, 1);
          nodes.triadGain.gain.setTargetAtTime(0.005, now, 0.12);
          nodes.funnelGain.gain.setTargetAtTime(0.0001, now, 0.10);
          nodes.glassGain.gain.setTargetAtTime(0.025 + rem * 0.065, now, 0.12);
        } else {
          var cutoff = lastAudioState.focusedChamber === "dead"
            ? 280
            : lastAudioState.focusedChamber === "unborn"
              ? 760
              : 460;
          nodes.triadFilter.frequency.setTargetAtTime(cutoff, now, 0.12);
          nodes.triadGain.gain.setTargetAtTime(0.18, now, 0.12);
          nodes.funnelGain.gain.setTargetAtTime(0.0001, now, 0.12);
          nodes.glassGain.gain.setTargetAtTime(0.008, now, 0.12);
        }
      } catch (_e) {}
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      if (!muted) {
        ensureGraph();
        unlock();
      }
      syncState(lastAudioState);
      return muted;
    }

    function toggleMute() {
      return setMuted(!muted);
    }

    function isMuted() {
      return muted;
    }

    function pingTone(freq, wave, dur, peak, delay) {
      if (!actx || !nodes) return;
      var t0 = actx.currentTime + (delay || 0);
      var osc = actx.createOscillator();
      var g = actx.createGain();
      osc.type = wave || "sine";
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.linearRampToValueAtTime(peak, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g);
      g.connect(nodes.master);
      osc.start(t0);
      osc.stop(t0 + dur + 0.02);
    }

    function triggerEvent(kind, detail) {
      if (muted) return;
      try {
        ensureGraph();
        if (!actx || !nodes) return;
        if (actx.state === "suspended") actx.resume();
        var idx = detail && typeof detail.index === "number" ? clamp(detail.index, 0, 7) : 0;

        if (kind === "consult_dead") {
          pingTone(196 + idx * 14, "triangle", 0.42, 0.22, 0);
          pingTone(293.66 + idx * 18, "sine", 0.34, 0.12, 0.03);
        } else if (kind === "enter_unborn") {
          pingTone(523.25 + idx * 22, "sine", 0.36, 0.16, 0);
          pingTone(659.25 + idx * 22, "sine", 0.44, 0.10, 0.11);
          pingTone(783.99 + idx * 22, "sine", 0.52, 0.06, 0.23);
        } else if (kind === "generation") {
          pingTone(587.33, "sine", 0.22, 0.14, 0);
          pingTone(293.66, "triangle", 0.28, 0.16, 0.08);
          pingTone(146.83, "triangle", 0.42, 0.20, 0.17);
        } else if (kind === "funnel_surge") {
          pingTone(87.31, "sawtooth", 0.45, 0.18, 0);
          pingTone(92.50, "sawtooth", 0.48, 0.15, 0.03);
        } else if (kind === "grain_drain") {
          for (var g = 0; g < 5; g++) {
            pingTone(1580 + g * 185, "sine", 0.08, 0.08, g * 0.038);
          }
        } else if (kind === "last_grain") {
          nodes.master.gain.setTargetAtTime(0.09, actx.currentTime, 0.01);
          pingTone(1174.66, "sine", 1.15, 0.20, 0);
          nodes.triadGain.gain.setTargetAtTime(0.00001, actx.currentTime + 0.1, 0.12);
          nodes.funnelGain.gain.setTargetAtTime(0.00001, actx.currentTime + 0.1, 0.12);
          nodes.glassGain.gain.setTargetAtTime(0.00001, actx.currentTime + 0.1, 0.12);
        } else if (kind === "turn_refused") {
          pingTone(112, "square", 0.16, 0.18, 0);
          pingTone(163, "sawtooth", 0.19, 0.16, 0.035);
          pingTone(104, "square", 0.18, 0.15, 0.085);
        }
      } catch (_e) {}
    }

    return {
      unlock: unlock,
      setMuted: setMuted,
      toggleMute: toggleMute,
      isMuted: isMuted,
      syncState: syncState,
      triggerEvent: triggerEvent
    };
  }

  var api = Object.freeze({
    PALETTE: PALETTE,
    createRenderer: createRenderer,
    createSoundscape: createSoundscape
  });

  root.LaudomiaTripleChambers = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
