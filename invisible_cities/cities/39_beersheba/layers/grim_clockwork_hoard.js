(function () {
  "use strict";

  var PALETTE = {
    abyssalSlate: "#0c0e13",
    ironGearDark: "#1b1f29",
    castIronRim: "#2e3442",
    furnaceInferno: "#c94422",
    emberRatchet: "#e06d34",
    hoardedBullion: "#d4a638",
    tarnishedBrass: "#8f6f28",
    diamondLock: "#c9e4f2",
    pitchSewer: "#191512",
    binPewter: "#5d646e"
  };

  var TERRESTRIAL_STONES = [
    {
      id: "golden_mirage_projection",
      index: 1,
      label: "Imagined Solid-Gold & Diamond Heaven",
      realm: "mythic_projection",
      summary: "Precision carat scales and diamond-bolted bullion safes built by citizens convinced a solid-gold planet hangs overhead weighing every earthly ingot."
    },
    {
      id: "overturned_rubbish_abyss",
      index: 2,
      label: "Overturned Rubbish Bins & Sewer Twin",
      realm: "subterranean_fear",
      summary: "A dreaded subterranean double roofed with overturned pewter bins spilling fish scales, cheese rinds, cold spaghetti, soiled bandages, and dark sewer pitch."
    },
    {
      id: "grim_carat_clockwork",
      index: 3,
      label: "Terrestrial Carat-Vault Clockwork Inferno",
      realm: "terrestrial_inversion",
      summary: "Obsessed with accumulating carats and policing waste, earthly vaults tighten into dark iron escapements—turning the bullion safes themselves into the true inferno."
    }
  ];

  var PACKET_KINDS = [
    "potato_peel",
    "broken_umbrella",
    "old_sock",
    "candy_wrapper",
    "tram_ticket",
    "eggshell_shard"
  ];

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function clamp01(v) {
    return clamp(Number(v) || 0, 0, 1);
  }

  function round4(v) {
    return Math.round(v * 10000) / 10000;
  }

  function computeCompression(avarice) {
    return round4(clamp01(0.08 + 0.92 * Math.pow(clamp01(avarice), 1.08)));
  }

  function findStone(stoneId) {
    for (var i = 0; i < TERRESTRIAL_STONES.length; i++) {
      if (TERRESTRIAL_STONES[i].id === stoneId) {
        return TERRESTRIAL_STONES[i];
      }
    }
    return null;
  }

  function createAudioRig() {
    var ctx = null;
    function ensureCtx() {
      if (ctx) {
        if (ctx.state === "suspended" && typeof ctx.resume === "function") {
          ctx.resume().catch(function () {});
        }
        return ctx;
      }
      var AC = globalThis.AudioContext || globalThis.webkitAudioContext;
      if (!AC) return null;
      try {
        ctx = new AC();
      } catch (e) {
        ctx = null;
      }
      return ctx;
    }

    function clank(compression) {
      var ac = ensureCtx();
      if (!ac) return;
      try {
        var now = ac.currentTime;
        var freqs = [88, 134, 212 + 60 * compression];
        for (var i = 0; i < freqs.length; i++) {
          var osc = ac.createOscillator();
          var gain = ac.createGain();
          osc.type = i === 0 ? "triangle" : "square";
          osc.frequency.setValueAtTime(freqs[i], now);
          osc.frequency.exponentialRampToValueAtTime(freqs[i] * 0.62, now + 0.19);
          gain.gain.setValueAtTime(i === 0 ? 0.08 : 0.035, now);
          gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.21);
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(now + i * 0.018);
          osc.stop(now + 0.23 + i * 0.018);
        }
      } catch (e) {}
    }

    function unlatch(intensity) {
      var ac = ensureCtx();
      if (!ac) return;
      try {
        var now = ac.currentTime;
        var notes = [220, 277.18, 329.63, 440, 554.37];
        var amp = 0.035 * clamp(intensity || 1, 0.4, 1);
        for (var i = 0; i < notes.length; i++) {
          var osc = ac.createOscillator();
          var gain = ac.createGain();
          osc.type = i % 2 === 0 ? "sine" : "triangle";
          osc.frequency.setValueAtTime(notes[i] * 0.98, now + i * 0.03);
          osc.frequency.linearRampToValueAtTime(notes[i], now + 0.18 + i * 0.03);
          gain.gain.setValueAtTime(0.001, now + i * 0.03);
          gain.gain.linearRampToValueAtTime(amp, now + 0.09 + i * 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.68 + i * 0.04);
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(now + i * 0.03);
          osc.stop(now + 0.74 + i * 0.04);
        }
      } catch (e) {}
    }

    return { ensureCtx: ensureCtx, clank: clank, unlatch: unlatch };
  }

  function createClockworkHoard(opts) {
    var cfg = opts || {};
    var width = Math.max(240, Number(cfg.width) || 1280);
    var height = Math.max(240, Number(cfg.height) || 800);
    var reducedMotion = Boolean(cfg.reducedMotion);
    var soundEnabled = false;
    var audio = createAudioRig();

    var caratsHoarded = 420;
    var avariceIndex = 0.68;
    var authoritarianCompression = computeCompression(avariceIndex);
    var gearMeshRatio = round4(0.35 + 0.65 * avariceIndex);
    var vaultLocksSealed = 8;
    var escapementLocked = true;
    var isCalculating = true;
    var cosmologyLens = "mythic_belief";
    var releasePulse = 0;
    var releaseFloor = 0;
    var highlightedStoneId = null;
    var tickPhase = 0;
    var gearAngle = 0;
    var ratchetRecoil = 0;
    var ambientTimer = 0;
    var activePackets = [];
    var handoffQueue = [];
    var fixtures = { gears: [], vaults: [], bins: [], scale: { x: 0, y: 0 }, anchors: [] };

    function rebuildFixtures() {
      var w = width;
      var h = height;
      var gears = [
        { x: w * 0.17, y: h * 0.63, r: Math.min(w, h) * 0.062, teeth: 14, dir: 1 },
        { x: w * 0.28, y: h * 0.69, r: Math.min(w, h) * 0.048, teeth: 11, dir: -1 },
        { x: w * 0.39, y: h * 0.64, r: Math.min(w, h) * 0.056, teeth: 13, dir: 1 },
        { x: w * 0.61, y: h * 0.64, r: Math.min(w, h) * 0.056, teeth: 13, dir: -1 },
        { x: w * 0.72, y: h * 0.69, r: Math.min(w, h) * 0.048, teeth: 11, dir: 1 },
        { x: w * 0.83, y: h * 0.63, r: Math.min(w, h) * 0.062, teeth: 14, dir: -1 }
      ];
      var vaultXs = [0.11, 0.20, 0.29, 0.38, 0.62, 0.71, 0.80, 0.89];
      var vaults = [];
      for (var i = 0; i < vaultXs.length; i++) {
        vaults.push({
          idx: i,
          x: w * vaultXs[i],
          y: h * 0.535,
          vw: Math.max(26, w * 0.062),
          vh: Math.max(38, h * 0.088)
        });
      }
      var binXs = [0.16, 0.33, 0.50, 0.67, 0.84];
      var bins = [];
      for (var b = 0; b < binXs.length; b++) {
        bins.push({
          idx: b,
          x: w * binXs[b],
          y: h * 0.855,
          bw: Math.max(30, w * 0.075),
          bh: Math.max(30, h * 0.068)
        });
      }
      var scale = { x: w * 0.50, y: h * 0.555, span: Math.max(36, w * 0.058) };
      var anchors = [
        { x: scale.x, y: scale.y, stoneId: "golden_mirage_projection" },
        { x: scale.x - scale.span * 0.7, y: scale.y + h * 0.035, stoneId: "golden_mirage_projection" },
        { x: scale.x + scale.span * 0.7, y: scale.y + h * 0.035, stoneId: "golden_mirage_projection" }
      ];
      for (var v = 0; v < vaults.length; v++) {
        anchors.push({ x: vaults[v].x, y: vaults[v].y, stoneId: "golden_mirage_projection" });
      }
      for (var g = 0; g < gears.length; g++) {
        anchors.push({ x: gears[g].x, y: gears[g].y, stoneId: "grim_carat_clockwork" });
      }
      anchors.push({ x: w * 0.50, y: h * 0.69, stoneId: "grim_carat_clockwork" });
      for (var k = 0; k < bins.length; k++) {
        var binStone = cosmologyLens === "true_cosmology" ? "grim_carat_clockwork" : "overturned_rubbish_abyss";
        anchors.push({ x: bins[k].x, y: bins[k].y, stoneId: binStone });
        anchors.push({ x: bins[k].x, y: bins[k].y + h * 0.045, stoneId: "overturned_rubbish_abyss" });
      }
      fixtures = { gears: gears, vaults: vaults, bins: bins, scale: scale, anchors: anchors };
    }

    rebuildFixtures();

    function getState() {
      return {
        caratsHoarded: caratsHoarded,
        avariceIndex: avariceIndex,
        authoritarianCompression: authoritarianCompression,
        gearMeshRatio: gearMeshRatio,
        vaultLocksSealed: vaultLocksSealed,
        escapementLocked: escapementLocked,
        isCalculating: isCalculating,
        terrestrialHoardIsInferno: true,
        infernoVisiblyExposed: cosmologyLens === "true_cosmology" || avariceIndex >= 0.72,
        cosmologyLens: cosmologyLens,
        releasePulse: releasePulse,
        ascendingPacketCount: activePackets.length,
        soundEnabled: soundEnabled,
        reducedMotion: reducedMotion,
        highlightedStoneId: highlightedStoneId
      };
    }

    function setViewport(w, h) {
      width = Math.max(240, Number(w) || 1280);
      height = Math.max(240, Number(h) || 800);
      rebuildFixtures();
      return getState();
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      return getState();
    }

    function setCosmologyLens(lens) {
      cosmologyLens = lens === "true_cosmology" ? "true_cosmology" : "mythic_belief";
      rebuildFixtures();
      return getState();
    }

    function highlightStone(stoneId) {
      highlightedStoneId = stoneId ? String(stoneId) : null;
      return getState();
    }

    function setAvariceIndex(val) {
      avariceIndex = round4(clamp01(val));
      authoritarianCompression = computeCompression(avariceIndex);
      caratsHoarded = Math.max(12, Math.round(50 + avariceIndex * 544));
      if (avariceIndex <= 0.18) {
        vaultLocksSealed = 0;
        escapementLocked = false;
        isCalculating = false;
        releasePulse = round4(clamp(1 - avariceIndex * 2.4, 0.45, 1));
        releaseFloor = round4(Math.max(0.45, releasePulse * 0.86));
        gearMeshRatio = round4(0.08 + avariceIndex * 0.35);
      } else {
        escapementLocked = true;
        isCalculating = true;
        releasePulse = 0;
        releaseFloor = 0;
        vaultLocksSealed = avariceIndex >= 0.62 ? 8 : clamp(Math.round(avariceIndex * 11), 1, 8);
        gearMeshRatio = round4(clamp01(0.35 + 0.65 * avariceIndex));
      }
      return getState();
    }

    function hoardCarats(amount) {
      var delta = Math.max(1, Number(amount) || 80);
      caratsHoarded = Math.round(caratsHoarded + delta);
      avariceIndex = round4(clamp01(avariceIndex + 0.14));
      authoritarianCompression = computeCompression(avariceIndex);
      releasePulse = 0;
      releaseFloor = 0;
      vaultLocksSealed = 8;
      escapementLocked = true;
      isCalculating = true;
      gearMeshRatio = round4(clamp01(0.42 + 0.58 * avariceIndex));
      ratchetRecoil = 1;
      activePackets.length = 0;
      handoffQueue.length = 0;
      if (soundEnabled) {
        audio.clank(authoritarianCompression);
      }
      return getState();
    }

    function spawnPacket(idx, total, pulse) {
      var kind = PACKET_KINDS[idx % PACKET_KINDS.length];
      var lane = (idx + 0.5) / Math.max(1, total);
      var nx = round4(clamp(0.14 + lane * 0.72 + Math.sin(idx * 2.39) * 0.025, 0.11, 0.89));
      var startNy = 0.50 + (idx % 5) * 0.042;
      return {
        kind: kind,
        nx: nx,
        x: nx * width,
        y: startNy * height,
        vy: height * (0.19 + (idx % 4) * 0.035),
        phase: idx * 0.95,
        intensity: pulse,
        handedOff: false
      };
    }

    function triggerGenerousRelease(intensity) {
      var raw = intensity === undefined ? 1.0 : Number(intensity);
      var pulse = round4(clamp(isNaN(raw) ? 1.0 : raw, 0.4, 1.0));
      avariceIndex = 0.08;
      authoritarianCompression = computeCompression(avariceIndex);
      releasePulse = pulse;
      releaseFloor = round4(Math.max(0.45, pulse * 0.88));
      vaultLocksSealed = 0;
      escapementLocked = false;
      isCalculating = false;
      gearMeshRatio = 0.08;
      activePackets.length = 0;
      handoffQueue.length = 0;
      var count = clamp(Math.round(12 + 6 * pulse), 12, 18);
      var descriptors = [];
      for (var i = 0; i < count; i++) {
        var pkt = spawnPacket(i, count, pulse);
        activePackets.push(pkt);
        descriptors.push({ kind: pkt.kind, nx: pkt.nx, intensity: pkt.intensity });
      }
      if (soundEnabled) {
        audio.unlatch(pulse);
      }
      return descriptors;
    }
    function consumeReleasedPackets() {
      if (handoffQueue.length === 0) return [];
      var out = handoffQueue.slice();
      handoffQueue.length = 0;
      return out;
    }

    function step(dtSec) {
      var dt = clamp(Number(dtSec) || 0.016, 0, 0.1);
      tickPhase += dt;
      ratchetRecoil = Math.max(0, ratchetRecoil - dt * 3.2);

      if (escapementLocked) {
        if (!reducedMotion) {
          var tickRate = 2.2 + authoritarianCompression * 3.4;
          var cycle = (tickPhase * tickRate) % 1;
          var snap = cycle < 0.22 ? cycle / 0.22 : 1 - (cycle - 0.22) * 0.08;
          gearAngle += dt * (0.35 + authoritarianCompression * 1.15) * clamp(snap, 0.2, 1.2);
        }
      } else {
        releasePulse = round4(Math.max(releaseFloor, releasePulse - dt * 0.08));
        if (!reducedMotion) {
          gearAngle += dt * 0.16;
          ambientTimer += dt;
          if (ambientTimer >= 0.42 && activePackets.length < 6) {
            ambientTimer = 0;
            activePackets.push(spawnPacket(Math.floor(tickPhase * 7), 6, releasePulse));
          }
        }
      }

      for (var i = activePackets.length - 1; i >= 0; i--) {
        var p = activePackets[i];
        p.y -= p.vy * dt;
        if (!reducedMotion) {
          p.x = p.nx * width + Math.sin(tickPhase * 3.1 + p.phase) * (width * 0.008);
        }
        if (!p.handedOff && p.y <= height * 0.46) {
          p.handedOff = true;
          handoffQueue.push({ kind: p.kind, nx: p.nx, intensity: p.intensity });
        }
        if (p.y <= height * 0.41) {
          activePackets.splice(i, 1);
        }
      }
      return getState();
    }

    function inspectAt(x, y) {
      var px = Number(x);
      var py = Number(y);
      if (isNaN(px) || isNaN(py) || py < height * 0.435) return null;
      var best = null;
      var bestDist = 34.0001;
      for (var i = 0; i < fixtures.anchors.length; i++) {
        var a = fixtures.anchors[i];
        var d = Math.hypot(px - a.x, py - a.y);
        if (d <= 34 && d < bestDist) {
          bestDist = d;
          best = a;
        }
      }
      if (!best) return null;
      var st = findStone(best.stoneId);
      if (!st) return null;
      return {
        stoneId: st.id,
        label: st.label,
        realm: st.realm,
        summary: st.summary
      };
    }

    function setSoundEnabled(flag) {
      soundEnabled = Boolean(flag);
      if (soundEnabled) audio.ensureCtx();
      return getState();
    }

    function playVaultClank() {
      if (soundEnabled) audio.clank(authoritarianCompression);
    }

    function playReleaseUnlatch() {
      if (soundEnabled) audio.unlatch(Math.max(0.6, releasePulse || 0.85));
    }

    function reset() {
      caratsHoarded = 420;
      avariceIndex = 0.68;
      authoritarianCompression = computeCompression(avariceIndex);
      gearMeshRatio = round4(0.35 + 0.65 * avariceIndex);
      vaultLocksSealed = 8;
      escapementLocked = true;
      isCalculating = true;
      cosmologyLens = "mythic_belief";
      releasePulse = 0;
      releaseFloor = 0;
      highlightedStoneId = null;
      ratchetRecoil = 0;
      activePackets.length = 0;
      handoffQueue.length = 0;
      rebuildFixtures();
      return getState();
    }

    function drawToothedGear(ctx, g, infernoMix) {
      ctx.save();
      ctx.translate(g.x, g.y);
      ctx.rotate(gearAngle * g.dir + (g.dir > 0 ? 0 : 0.24));
      var rOuter = g.r * (0.94 + 0.08 * gearMeshRatio);
      var rInner = rOuter * 0.78;
      ctx.fillStyle = PALETTE.ironGearDark;
      ctx.strokeStyle = infernoMix > 0.55 ? PALETTE.emberRatchet : PALETTE.castIronRim;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      var stepAng = (Math.PI * 2) / g.teeth;
      for (var i = 0; i < g.teeth; i++) {
        var a0 = i * stepAng;
        ctx.lineTo(Math.cos(a0) * rInner, Math.sin(a0) * rInner);
        ctx.lineTo(Math.cos(a0 + stepAng * 0.22) * rOuter, Math.sin(a0 + stepAng * 0.22) * rOuter);
        ctx.lineTo(Math.cos(a0 + stepAng * 0.52) * rOuter, Math.sin(a0 + stepAng * 0.52) * rOuter);
        ctx.lineTo(Math.cos(a0 + stepAng * 0.74) * rInner, Math.sin(a0 + stepAng * 0.74) * rInner);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, rInner * 0.46, 0, Math.PI * 2);
      ctx.fillStyle = infernoMix > 0.35 ? PALETTE.furnaceInferno : PALETTE.abyssalSlate;
      ctx.globalAlpha = escapementLocked ? 0.35 + 0.55 * infernoMix : 0.22;
      ctx.fill();
      ctx.restore();
    }
    function drawPacketSilhouette(ctx, p) {
      ctx.save();
      ctx.strokeStyle = "#fbf6ea";
      ctx.lineWidth = 1.3;
      ctx.globalAlpha = 0.45 * p.intensity;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + 22);
      ctx.lineTo(p.x, p.y + 4);
      ctx.stroke();
      ctx.translate(p.x, p.y);
      ctx.globalAlpha = 0.92;
      if (p.kind === "potato_peel") {
        ctx.strokeStyle = "#d8a55b";
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0.2, Math.PI * 1.45);
        ctx.stroke();
      } else if (p.kind === "broken_umbrella") {
        ctx.strokeStyle = "#4d9ca8";
        ctx.beginPath();
        ctx.arc(0, 1, 7, Math.PI, 0);
        ctx.moveTo(0, -6);
        ctx.lineTo(0, 7);
        ctx.stroke();
      } else if (p.kind === "old_sock") {
        ctx.fillStyle = "#c97b84";
        ctx.fillRect(-3, -6, 5, 8);
        ctx.fillRect(-3, 1, 9, 4);
      } else if (p.kind === "candy_wrapper") {
        ctx.fillStyle = "#7fe3dc";
        ctx.beginPath();
        ctx.moveTo(-7, -3);
        ctx.lineTo(7, 3);
        ctx.lineTo(7, -3);
        ctx.lineTo(-7, 3);
        ctx.closePath();
        ctx.fill();
      } else if (p.kind === "tram_ticket") {
        ctx.fillStyle = "#e8d39e";
        ctx.fillRect(-6, -4, 12, 7);
      } else {
        ctx.fillStyle = "#fbf6ea";
        ctx.beginPath();
        ctx.arc(0, 2, 6, Math.PI, 0);
        ctx.fill();
      }
      ctx.restore();
    }

    function render(ctx) {
      if (!ctx) return;
      var w = width;
      var h = height;
      var yTop = h * 0.45;
      var ySub = h * 0.77;
      var exposed = cosmologyLens === "true_cosmology" || avariceIndex >= 0.72;
      var infernoMix = escapementLocked
        ? clamp01(cosmologyLens === "true_cosmology" ? 0.58 + 0.42 * avariceIndex : (avariceIndex - 0.35) * 1.35)
        : 0.08;

      ctx.save();
      ctx.fillStyle = PALETTE.abyssalSlate;
      ctx.fillRect(0, yTop, w, ySub - yTop);

      if (infernoMix > 0.05) {
        ctx.fillStyle = PALETTE.furnaceInferno;
        ctx.globalAlpha = 0.14 + 0.38 * infernoMix;
        for (var fg = 0; fg < 9; fg++) {
          var gx = w * (0.10 + fg * 0.10);
          ctx.fillRect(gx - w * 0.028, h * 0.60, w * 0.056, h * 0.14);
        }
        ctx.globalAlpha = 1;
      }

      for (var gi = 0; gi < fixtures.gears.length; gi++) {
        drawToothedGear(ctx, fixtures.gears[gi], infernoMix);
      }

      var veneerAlpha = escapementLocked ? clamp(1 - infernoMix * 0.82, 0.16, 0.88) : 0.42;
      for (var vi = 0; vi < fixtures.vaults.length; vi++) {
        var v = fixtures.vaults[vi];
        var locked = vi < vaultLocksSealed;
        ctx.fillStyle = exposed ? PALETTE.ironGearDark : PALETTE.tarnishedBrass;
        ctx.fillRect(v.x - v.vw * 0.5, v.y - v.vh * 0.5, v.vw, v.vh);
        ctx.globalAlpha = veneerAlpha;
        ctx.strokeStyle = PALETTE.hoardedBullion;
        ctx.lineWidth = 1.8;
        ctx.strokeRect(v.x - v.vw * 0.46, v.y - v.vh * 0.46, v.vw * 0.92, v.vh * 0.92);
        ctx.globalAlpha = 1;
        if (locked) {
          ctx.fillStyle = PALETTE.diamondLock;
          ctx.beginPath();
          ctx.moveTo(v.x, v.y - 8);
          ctx.lineTo(v.x + 7, v.y);
          ctx.lineTo(v.x, v.y + 8);
          ctx.lineTo(v.x - 7, v.y);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = "#fbf6ea";
          ctx.globalAlpha = 0.32 * Math.max(0.5, releasePulse);
          ctx.fillRect(v.x - v.vw * 0.28, yTop - 6, v.vw * 0.56, v.y - yTop + 10);
          ctx.globalAlpha = 1;
        }
      }

      var sc = fixtures.scale;
      var tilt = escapementLocked ? 0.16 * authoritarianCompression : 0;
      ctx.strokeStyle = PALETTE.hoardedBullion;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(sc.x, sc.y + h * 0.075);
      ctx.lineTo(sc.x, sc.y - h * 0.025);
      ctx.moveTo(sc.x - sc.span, sc.y + sc.span * tilt);
      ctx.lineTo(sc.x + sc.span, sc.y - sc.span * tilt);
      ctx.stroke();
      ctx.fillStyle = PALETTE.hoardedBullion;
      ctx.fillRect(sc.x - sc.span - 12, sc.y + sc.span * tilt + 14, 24, 9);
      ctx.fillStyle = PALETTE.diamondLock;
      ctx.font = "600 11px monospace";
      ctx.textAlign = "center";
      ctx.fillText(caratsHoarded + " ct", sc.x, sc.y + h * 0.098);

      ctx.strokeStyle = escapementLocked ? PALETTE.castIronRim : "#e8d39e";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, yTop);
      ctx.lineTo(w, yTop);
      ctx.stroke();

      ctx.fillStyle = cosmologyLens === "true_cosmology" ? PALETTE.ironGearDark : PALETTE.pitchSewer;
      ctx.fillRect(0, ySub, w, h - ySub);
      ctx.strokeStyle = exposed ? PALETTE.furnaceInferno : PALETTE.binPewter;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, ySub);
      ctx.lineTo(w, ySub);
      ctx.stroke();

      for (var bi = 0; bi < fixtures.bins.length; bi++) {
        var bn = fixtures.bins[bi];
        if (cosmologyLens === "mythic_belief") {
          ctx.fillStyle = "#241e1a";
          ctx.beginPath();
          ctx.moveTo(bn.x - bn.bw * 0.62, ySub);
          ctx.lineTo(bn.x - bn.bw * 0.48, ySub + bn.bh * 0.52);
          ctx.lineTo(bn.x - bn.bw * 0.34, ySub);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = PALETTE.binPewter;
          ctx.beginPath();
          ctx.moveTo(bn.x - bn.bw * 0.42, bn.y + bn.bh * 0.35);
          ctx.lineTo(bn.x - bn.bw * 0.30, bn.y - bn.bh * 0.42);
          ctx.lineTo(bn.x + bn.bw * 0.30, bn.y - bn.bh * 0.42);
          ctx.lineTo(bn.x + bn.bw * 0.42, bn.y + bn.bh * 0.35);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#d8a55b";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(bn.x - 15, bn.y + bn.bh * 0.42);
          ctx.bezierCurveTo(bn.x - 5, bn.y + bn.bh * 0.72, bn.x + 6, bn.y + bn.bh * 0.32, bn.x + 16, bn.y + bn.bh * 0.56);
          ctx.stroke();
          ctx.fillStyle = "#e8d39e";
          ctx.beginPath();
          ctx.moveTo(bn.x + 8, bn.y + bn.bh * 0.40);
          ctx.lineTo(bn.x + 20, bn.y + bn.bh * 0.52);
          ctx.lineTo(bn.x + 6, bn.y + bn.bh * 0.58);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = "#7fe3dc";
          ctx.beginPath();
          ctx.arc(bn.x - 12, bn.y + bn.bh * 0.54, 3.2, 0, Math.PI);
          ctx.moveTo(bn.x - 2.8, bn.y + bn.bh * 0.58);
          ctx.arc(bn.x - 6, bn.y + bn.bh * 0.58, 3.2, 0, Math.PI);
          ctx.fill();
          ctx.fillStyle = "#fbf6ea";
          ctx.fillRect(bn.x - 4, bn.y + bn.bh * 0.46, 10, 4);
        } else {
          ctx.save();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = PALETTE.binPewter;
          ctx.globalAlpha = 0.32;
          ctx.strokeRect(bn.x - bn.bw * 0.35, bn.y - bn.bh * 0.35, bn.bw * 0.7, bn.bh * 0.7);
          ctx.restore();
          ctx.fillStyle = PALETTE.castIronRim;
          ctx.fillRect(bn.x - 9, yTop + h * 0.13, 18, h - (yTop + h * 0.13));
          ctx.fillStyle = escapementLocked ? PALETTE.emberRatchet : "#4d9ca8";
          ctx.globalAlpha = escapementLocked ? 0.76 : 0.28;
          ctx.fillRect(bn.x - 4, yTop + h * 0.16, 8, h - (yTop + h * 0.16) - 10);
          ctx.globalAlpha = 1;
        }
      }

      for (var pi = 0; pi < activePackets.length; pi++) {
        drawPacketSilhouette(ctx, activePackets[pi]);
      }

      if (highlightedStoneId) {
        ctx.strokeStyle = PALETTE.hoardedBullion;
        ctx.lineWidth = 1.6;
        for (var hi = 0; hi < fixtures.anchors.length; hi++) {
          var ha = fixtures.anchors[hi];
          if (ha.stoneId === highlightedStoneId) {
            ctx.beginPath();
            ctx.arc(ha.x, ha.y, 18, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      }
      ctx.restore();
    }

    return {
      getState: getState,
      setViewport: setViewport,
      setReducedMotion: setReducedMotion,
      setCosmologyLens: setCosmologyLens,
      highlightStone: highlightStone,
      setAvariceIndex: setAvariceIndex,
      hoardCarats: hoardCarats,
      triggerGenerousRelease: triggerGenerousRelease,
      consumeReleasedPackets: consumeReleasedPackets,
      step: step,
      render: render,
      inspectAt: inspectAt,
      setSoundEnabled: setSoundEnabled,
      playVaultClank: playVaultClank,
      playReleaseUnlatch: playReleaseUnlatch,
      reset: reset
    };
  }

  var api = {
    PALETTE: PALETTE,
    TERRESTRIAL_STONES: TERRESTRIAL_STONES,
    PACKET_KINDS: PACKET_KINDS,
    createClockworkHoard: createClockworkHoard
  };

  globalThis.BeershebaClockworkHoard = api;
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
})();
