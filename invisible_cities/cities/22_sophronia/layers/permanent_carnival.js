/*
 * Sophronia — Layer 1: The Permanent Carnival Half-City
 * Western half of Sophronia: six fairground structures bolted into living bedrock.
 * Pure standalone ES6 browser IIFE; zero external network or module dependencies.
 */
(function (global) {
  "use strict";
  const PALETTE = Object.freeze({
    nightBedrock: "#18130f", emptyOchre: "#cfa368",
    ochreDust: "#e4c493", carnivalVermilion: "#d93b2b",
    giltSpoke: "#e8b948", tentIvory: "#f3e7cf",
    cementAsh: "#767c82", carraraMarble: "#e7e2d8",
    stoneMortar: "#9da1a4", trailerIron: "#2b3036"
  });

  const CARNIVAL_RIDES = Object.freeze([
    Object.freeze({
      id: "roller_coaster", label: "Great Roller Coaster with Steep Humps",
      shortLabel: "Roller Coaster", nx: 0.145,
      ny: 0.34, hitBox: Object.freeze([0.032, 0.16, 0.295, 0.54]),
      pierX: 0.145, permanent: true,
      dismantleable: false, foundation: "bedrock_iron_piers",
      detail: "Steep vermilion iron humps, bedrock trestles, and a safety-bar car carrying a suspended shout at the crest."
    }),
    Object.freeze({
      id: "chain_carousel", label: "Carousel with Spoke of Chains",
      shortLabel: "Chain Carousel", nx: 0.368,
      ny: 0.71, hitBox: Object.freeze([0.310, 0.59, 0.418, 0.84]),
      pierX: 0.368, permanent: true,
      dismantleable: false, foundation: "bedrock_iron_piers",
      detail: "Gilt radial hub spinning flying seats on tensioned iron chain spokes above bolted foundation piers."
    }),
    Object.freeze({
      id: "ferris_wheel", label: "Ferris Wheel of Spinning Cages",
      shortLabel: "Spinning-Cage Wheel", nx: 0.382,
      ny: 0.36, hitBox: Object.freeze([0.298, 0.15, 0.468, 0.57]),
      pierX: 0.382, permanent: true,
      dismantleable: false, foundation: "bedrock_iron_piers",
      detail: "High gilt-spoked wheel carrying independently revolving wire-and-brass passenger cages anchored permanently to the square."
    }),
    Object.freeze({
      id: "death_ride", label: "Death-Ride with Crouching Motorcyclists",
      shortLabel: "Motorcycle Velodrome", nx: 0.248,
      ny: 0.69, hitBox: Object.freeze([0.194, 0.56, 0.304, 0.83]),
      pierX: 0.248, permanent: true,
      dismantleable: false, foundation: "bedrock_iron_piers",
      detail: "Vertical timber-and-iron velodrome cylinder with cutaway window showing crouching motorcyclists circling horizontally on the wall."
    }),
    Object.freeze({
      id: "big_top_trapezes", label: "Big Top Dome with Clustered Trapezes",
      shortLabel: "Big Top Trapezes", nx: 0.112,
      ny: 0.68, hitBox: Object.freeze([0.036, 0.54, 0.188, 0.82]),
      pierX: 0.112, permanent: true,
      dismantleable: false, foundation: "bedrock_iron_piers",
      detail: "Vermilion-and-ivory circus cupola whose illuminated cutaway oculus reveals a secret cluster of trapezes hanging at its center."
    }),
    Object.freeze({
      id: "shooting_galleries", label: "Shooting-Galleries Arcade",
      shortLabel: "Shooting Galleries", nx: 0.454,
      ny: 0.76, hitBox: Object.freeze([0.420, 0.67, 0.490, 0.855]),
      pierX: 0.454, permanent: true,
      dismantleable: false, foundation: "bedrock_iron_piers",
      detail: "Permanent tin-target fairground booths flanking the carousel as it counts the months in the empty plaza."
    })
  ]); const ROMAN_MONTHS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

  function clamp01(v) {
    const n = Number(v);
    if (!Number.isFinite(n)) return 0;
    return n < 0 ? 0 : n > 1 ? 1 : n;
  }

  function hexToRgb(hex) {
    const clean = String(hex || "#000000").replace("#", ""); const num = parseInt(clean, 16) || 0;
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function mixHex(hexA, hexB, t) {
    const k = clamp01(t); const a = hexToRgb(hexA);
    const b = hexToRgb(hexB); const r = Math.round(a[0] + (b[0] - a[0]) * k);
    const g = Math.round(a[1] + (b[1] - a[1]) * k); const bl = Math.round(a[2] + (b[2] - a[2]) * k);
    return "rgb(" + r + "," + g + "," + bl + ")";
  }

  function rgbaHex(hex, alpha) {
    const c = hexToRgb(hex);
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + clamp01(alpha) + ")";
  }

  function coasterElevationNorm(u) {
    const h1 = 0.53 * Math.exp(-Math.pow((u - 0.41) / 0.145, 2));
    const h2 = 0.38 * Math.exp(-Math.pow((u - 0.80) / 0.125, 2));
    const approach = 0.08 * Math.sin(u * Math.PI);
    return 0.745 - (h1 + h2 + approach);
  }

  function sampleCoasterPoint(u, w, h) {
    const uu = clamp01(u); const x0 = 0.036 * w; const x1 = 0.296 * w; const x = x0 + (x1 - x0) * uu;
    const y = coasterElevationNorm(uu) * h; const du = 0.008; const dx = (x1 - x0) * du;
    const dy = (coasterElevationNorm(Math.min(1, uu + du)) - coasterElevationNorm(Math.max(0, uu - du))) * 0.5 * h;
    return { x: x, y: y, angle: Math.atan2(dy, dx) };
  }

  function createCarnivalAudio(stateRef) {
    let audioCtx = null; let masterGain = null; let noiseBuf = null; let lastTickMs = 0;
    function ensureCtx() {
      if (stateRef.muted) return null;
      try {
        if (!audioCtx) {
          const Ctor = global.AudioContext || global.webkitAudioContext;
          if (!Ctor) return null;
          audioCtx = new Ctor(); masterGain = audioCtx.createGain();
          masterGain.gain.value = stateRef.muted ? 0 : 0.22; masterGain.connect(audioCtx.destination);
        }
        if (audioCtx.state === "suspended" && typeof audioCtx.resume === "function") {
          audioCtx.resume().catch(function () {});
        }
        return audioCtx;
      } catch (_) {
        return null;
      }
    }
    function getNoiseBuffer(ctx) {
      if (noiseBuf) return noiseBuf;
      const len = Math.max(1024, Math.floor(ctx.sampleRate * 0.5));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate); const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.6;
      }
      noiseBuf = buf;
      return buf;
    }
    function unlock() {
      try {
        const c = ensureCtx();
        return Boolean(c);
      } catch (_) {
        return false;
      }
    }
    function setMuted(flag) {
      stateRef.muted = Boolean(flag);
      try {
        if (masterGain && audioCtx) {
          masterGain.gain.setTargetAtTime(stateRef.muted ? 0 : 0.22, audioCtx.currentTime, 0.02);
        }
      } catch (_) {}
      return stateRef.muted;
    }
    function toggleMute() {
      return setMuted(!stateRef.muted);
    }
    function isMuted() {
      return Boolean(stateRef.muted);
    }
    function playCalliopePhrase(lonelinessRatio) {
      const ctx = ensureCtx();
      if (!ctx || !masterGain || stateRef.muted) return false;
      try {
        const lonely = clamp01(lonelinessRatio) > 0.6; const now = ctx.currentTime;
        const notes = lonely ? [293.66, 440.0] : [523.25, 659.25, 783.99]; const dur = lonely ? 0.56 : 0.34;
        for (let i = 0; i < notes.length; i++) {
          const t0 = now + i * (lonely ? 0.09 : 0.05); const oscA = ctx.createOscillator();
          const oscB = ctx.createOscillator(); const flt = ctx.createBiquadFilter();
          const env = ctx.createGain(); oscA.type = "triangle";
          oscB.type = lonely ? "sine" : "square"; oscA.frequency.setValueAtTime(notes[i], t0);
          oscB.frequency.setValueAtTime(notes[i] * 1.004, t0); flt.type = "bandpass";
          flt.frequency.setValueAtTime(lonely ? 620 : 1250, t0);
          flt.Q.setValueAtTime(lonely ? 2.4 : 1.6, t0); env.gain.setValueAtTime(0.0001, t0);
          env.gain.exponentialRampToValueAtTime(lonely ? 0.14 : 0.16, t0 + 0.03);
          env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur); oscA.connect(flt);
          oscB.connect(flt); flt.connect(env); env.connect(masterGain); oscA.start(t0);
          oscB.start(t0); oscA.stop(t0 + dur + 0.02); oscB.stop(t0 + dur + 0.02);
        }
        if (lonely) {
          const src = ctx.createBufferSource(); src.buffer = getNoiseBuffer(ctx);
          const wFlt = ctx.createBiquadFilter(); const wEnv = ctx.createGain();
          wFlt.type = "bandpass"; wFlt.frequency.setValueAtTime(460, now);
          wFlt.Q.setValueAtTime(3.8, now); wEnv.gain.setValueAtTime(0.0001, now);
          wEnv.gain.linearRampToValueAtTime(0.09, now + 0.12);
          wEnv.gain.exponentialRampToValueAtTime(0.0001, now + 0.62); src.connect(wFlt);
          wFlt.connect(wEnv); wEnv.connect(masterGain); src.start(now); src.stop(now + 0.64);
        }
        return true;
      } catch (_) {
        return false;
      }
    }
    function playSuspendedShout() {
      const ctx = ensureCtx();
      if (!ctx || !masterGain || stateRef.muted) return false;
      try {
        const now = ctx.currentTime;
        for (let k = 0; k < 4; k++) {
          const tk = now + k * 0.042; const clk = ctx.createOscillator();
          const cg = ctx.createGain(); clk.type = "triangle";
          clk.frequency.setValueAtTime(1280 + k * 95, tk); cg.gain.setValueAtTime(0.11, tk);
          cg.gain.exponentialRampToValueAtTime(0.0001, tk + 0.028); clk.connect(cg);
          cg.connect(masterGain); clk.start(tk); clk.stop(tk + 0.032);
        }
        const ts = now + 0.16; const vox = ctx.createOscillator();
        const f1 = ctx.createBiquadFilter(); const f2 = ctx.createBiquadFilter();
        const eg = ctx.createGain(); vox.type = "sawtooth";
        vox.frequency.setValueAtTime(375, ts); vox.frequency.exponentialRampToValueAtTime(515, ts + 0.16);
        vox.frequency.exponentialRampToValueAtTime(350, ts + 0.58); f1.type = "bandpass";
        f1.frequency.setValueAtTime(750, ts); f1.Q.setValueAtTime(5.2, ts);
        f2.type = "bandpass"; f2.frequency.setValueAtTime(1190, ts);
        f2.Q.setValueAtTime(6.0, ts); eg.gain.setValueAtTime(0.0001, ts);
        eg.gain.linearRampToValueAtTime(0.24, ts + 0.07);
        eg.gain.exponentialRampToValueAtTime(0.0001, ts + 0.60); vox.connect(f1);
        vox.connect(f2); f1.connect(eg); f2.connect(eg); eg.connect(masterGain);
        vox.start(ts); vox.stop(ts + 0.62);
        return true;
      } catch (_) {
        return false;
      }
    }
    function playBedrockRefusal() {
      const ctx = ensureCtx();
      if (!ctx || !masterGain || stateRef.muted) return false;
      try {
        const now = ctx.currentTime; const partials = [62, 224, 592, 968, 1420];
        for (let i = 0; i < partials.length; i++) {
          const osc = ctx.createOscillator(); const g = ctx.createGain();
          osc.type = i === 0 ? "sine" : "triangle"; osc.frequency.setValueAtTime(partials[i], now);
          const dur = i === 0 ? 0.26 : 0.42 - i * 0.06;
          g.gain.setValueAtTime(i === 0 ? 0.25 : 0.14 / (i * 0.7 + 1), now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + dur); osc.connect(g);
          g.connect(masterGain); osc.start(now); osc.stop(now + dur + 0.02);
        }
        return true;
      } catch (_) {
        return false;
      }
    }
    function playMonthTick() {
      const nowMs = Date.now();
      if (nowMs - lastTickMs < 75) return false;
      lastTickMs = nowMs; const ctx = ensureCtx();
      if (!ctx || !masterGain || stateRef.muted) return false;
      try {
        const now = ctx.currentTime; const osc = ctx.createOscillator();
        const g = ctx.createGain(); osc.type = "triangle"; osc.frequency.setValueAtTime(1480, now);
        osc.frequency.exponentialRampToValueAtTime(920, now + 0.045); g.gain.setValueAtTime(0.14, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.055); osc.connect(g);
        g.connect(masterGain); osc.start(now); osc.stop(now + 0.06);
        return true;
      } catch (_) {
        return false;
      }
    }
    return Object.freeze({
      unlock: unlock, setMuted: setMuted,
      toggleMute: toggleMute, isMuted: isMuted,
      playCalliopePhrase: playCalliopePhrase, playSuspendedShout: playSuspendedShout,
      playBedrockRefusal: playBedrockRefusal, playMonthTick: playMonthTick
    });
  }

  function drawSkyPlazaAndBedrock(ctx, w, h, state, dustMotes) {
    const p = clamp01(state.decampmentProgress); const horizonY = 0.63 * h; const bedY = 0.87 * h;
    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, mixHex(PALETTE.tentIvory, "#241a13", p * 0.88));
    skyGrad.addColorStop(0.55, mixHex(PALETTE.ochreDust, "#7c5333", p * 0.76));
    skyGrad.addColorStop(1, mixHex(PALETTE.emptyOchre, PALETTE.ochreDust, 0.32 + p * 0.48));
    ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, w, horizonY + 2);
    const glow = ctx.createRadialGradient(0.24 * w, 0.34 * h, 4, 0.24 * w, 0.34 * h, 0.38 * w);
    glow.addColorStop(0, rgbaHex(PALETTE.giltSpoke, 0.24 - p * 0.08));
    glow.addColorStop(1, rgbaHex(PALETTE.emptyOchre, 0)); ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 0.65 * w, horizonY);
    ctx.fillStyle = mixHex("#b78a52", "#6e4e2e", p * 0.55); ctx.beginPath();
    ctx.moveTo(0, horizonY); ctx.lineTo(0.22 * w, horizonY - 0.016 * h);
    ctx.lineTo(0.51 * w, horizonY - 0.006 * h); ctx.lineTo(0.81 * w, horizonY - 0.020 * h);
    ctx.lineTo(w, horizonY - 0.008 * h); ctx.lineTo(w, horizonY + 2); ctx.closePath(); ctx.fill();
    const leftGround = ctx.createLinearGradient(0, horizonY, 0, bedY);
    leftGround.addColorStop(0, mixHex(PALETTE.emptyOchre, "#9c7344", 0.34));
    leftGround.addColorStop(1, "#6f5032"); ctx.fillStyle = leftGround;
    ctx.fillRect(0, horizonY, 0.496 * w, bedY - horizonY);
    const rightGround = ctx.createLinearGradient(0, horizonY, 0, bedY);
    rightGround.addColorStop(0, mixHex(PALETTE.ochreDust, PALETTE.emptyOchre, 0.35 + p * 0.4));
    rightGround.addColorStop(0.68, PALETTE.emptyOchre); rightGround.addColorStop(1, "#9d7648");
    ctx.fillStyle = rightGround; ctx.fillRect(0.496 * w, horizonY, 0.504 * w, bedY - horizonY);
    if (state.monthsRemaining > 0 || p > 0.85) {
      const mCount = Math.max(1, Math.min(12, Math.round(state.monthsRemaining || 8))); ctx.save();
      ctx.strokeStyle = rgbaHex(PALETTE.nightBedrock, 0.42);
      ctx.fillStyle = rgbaHex(PALETTE.tentIvory, 0.72); ctx.lineWidth = 1.2;
      ctx.font = Math.max(9, Math.round(h * 0.017)) + "px Georgia, serif";
      for (let m = 0; m < mCount; m++) {
        const tx = (0.525 + m * 0.036) * w; const ty = 0.768 * h;
        for (let s = 0; s < 4; s++) {
          ctx.beginPath(); ctx.moveTo(tx + s * 3.2, ty - 6);
          ctx.lineTo(tx + s * 3.2 - 1, ty + 6); ctx.stroke();
        }
        ctx.beginPath(); ctx.moveTo(tx - 2, ty + 4); ctx.lineTo(tx + 12, ty - 4); ctx.stroke();
        ctx.fillText(ROMAN_MONTHS[m], tx - 1, ty + 16);
      }
      ctx.restore();
    }
    ctx.fillStyle = rgbaHex(PALETTE.ochreDust, 0.22 + 0.48 * p);
    for (let i = 0; i < dustMotes.length; i++) {
      const d = dustMotes[i]; ctx.beginPath();
      ctx.ellipse(d.x * w, d.y * h, d.r * (1 + p * 1.8), d.r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = PALETTE.nightBedrock; ctx.fillRect(0, bedY, w, h - bedY);
    ctx.strokeStyle = rgbaHex(PALETTE.emptyOchre, 0.22); ctx.lineWidth = 1;
    for (let s = 1; s <= 2; s++) {
      const sy = bedY + (h - bedY) * (s * 0.34); ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(w, sy);
      ctx.stroke();
    }
    for (let i = 0; i < CARNIVAL_RIDES.length; i++) {
      const r = CARNIVAL_RIDES[i]; const px = r.pierX * w;
      ctx.fillStyle = PALETTE.trailerIron; ctx.fillRect(px - 6, bedY - 3, 12, h - bedY + 1);
      ctx.strokeStyle = PALETTE.giltSpoke; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(px - 12, bedY + (h - bedY) * 0.78);
      ctx.lineTo(px + 12, bedY + (h - bedY) * 0.78); ctx.moveTo(px - 9, bedY + 4);
      ctx.lineTo(px - 15, h - 3); ctx.moveTo(px + 9, bedY + 4); ctx.lineTo(px + 15, h - 3); ctx.stroke();
    }
    for (let slot = 0; slot < 10; slot++) {
      const sx = (0.522 + slot * 0.046) * w; ctx.fillStyle = rgbaHex(PALETTE.ochreDust, 0.28);
      ctx.fillRect(sx - 9, bedY, 18, (h - bedY) * 0.32); ctx.strokeStyle = PALETTE.cementAsh;
      ctx.lineWidth = 1.3; ctx.strokeRect(sx - 7, bedY + 1, 14, (h - bedY) * 0.22);
    }
    ctx.save(); ctx.setLineDash([4, 4]); ctx.strokeStyle = rgbaHex(PALETTE.giltSpoke, 0.65); ctx.beginPath();
    ctx.moveTo(0.496 * w, horizonY); ctx.lineTo(0.496 * w, h); ctx.stroke(); ctx.restore();
    if (state.recoilFlash > 0.01) {
      const target = CARNIVAL_RIDES.find(function (r) { return r.id === state.lastRefusedRideId; }) || CARNIVAL_RIDES[0];
      const sx = target.pierX * w; const sy = bedY + 4; const fl = state.recoilFlash; ctx.save();
      for (let a = 0; a < 10; a++) {
        const ang = -Math.PI + (a / 9) * Math.PI + Math.sin(a * 2.3) * 0.18;
        const len = (10 + (a % 3) * 9) * fl;
        ctx.strokeStyle = a % 2 === 0 ? PALETTE.tentIvory : PALETTE.giltSpoke; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.cos(ang) * len, sy + Math.sin(ang) * len); ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawCarnivalStructures(ctx, w, h, state, viewOpts) {
    const hoveredId = viewOpts.hoveredId || null;
    const selectedId = viewOpts.selectedId || state.selectedRideId;
    const wrenchMode = Boolean(viewOpts.wrenchMode);
    // 1. Great Roller Coaster with Steep Humps
    const rcBaseY = 0.775 * h;
    ctx.strokeStyle = mixHex(PALETTE.carnivalVermilion, PALETTE.nightBedrock, 0.35); ctx.lineWidth = 1.3;
    for (let i = 0; i <= 16; i++) {
      const u = i / 16; const pt = sampleCoasterPoint(u, w, h); ctx.beginPath(); ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(pt.x, rcBaseY); ctx.stroke();
      if (i < 16) {
        const nxt = sampleCoasterPoint((i + 1) / 16, w, h);
        const midY = (Math.max(pt.y, nxt.y) + rcBaseY) * 0.5; ctx.beginPath();
        ctx.moveTo(pt.x, midY); ctx.lineTo(nxt.x, rcBaseY);
        ctx.moveTo(nxt.x, midY); ctx.lineTo(pt.x, rcBaseY); ctx.stroke();
      }
      ctx.fillStyle = PALETTE.trailerIron; ctx.fillRect(pt.x - 3, rcBaseY - 2, 6, 4);
    }
    for (let pass = 0; pass < 2; pass++) {
      ctx.strokeStyle = pass === 0 ? PALETTE.carnivalVermilion : PALETTE.giltSpoke;
      ctx.lineWidth = pass === 0 ? 4.0 : 1.6; ctx.beginPath();
      for (let s = 0; s <= 56; s++) {
        const pt = sampleCoasterPoint(s / 56, w, h); const oy = pass === 0 ? 1.5 : -1.5;
        if (s === 0) ctx.moveTo(pt.x, pt.y + oy); else ctx.lineTo(pt.x, pt.y + oy);
      }
      ctx.stroke();
    }
    const carPt = sampleCoasterPoint(state.coasterT, w, h); ctx.save();
    ctx.translate(carPt.x, carPt.y - 4); ctx.rotate(carPt.angle);
    ctx.fillStyle = PALETTE.carnivalVermilion; ctx.fillRect(-10, -5, 20, 7);
    ctx.strokeStyle = PALETTE.giltSpoke; ctx.lineWidth = 1.6;
    ctx.strokeRect(-10, -5, 20, 7); ctx.fillStyle = PALETTE.tentIvory;
    ctx.beginPath(); ctx.arc(-4, -7, 2.3, 0, Math.PI * 2); ctx.arc(4, -7, 2.3, 0, Math.PI * 2); ctx.fill();
    // Lowered iron-and-gilt safety bar
    ctx.strokeStyle = PALETTE.tentIvory; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(-8, -4);
    ctx.lineTo(-5, -9); ctx.lineTo(6, -9); ctx.lineTo(8, -4); ctx.stroke();
    ctx.restore();
    // Suspended Shout at the steep crest
    const crestPt = sampleCoasterPoint(0.41, w, h);
    const nearCrest = Math.max(0, 1 - Math.abs(state.coasterT - 0.41) / 0.11);
    const shoutAmp = Math.max(0.28, state.shoutPulse, nearCrest * 0.75);
    for (let ring = 1; ring <= 4; ring++) {
      const rad = (7 + ring * (7 + shoutAmp * 6));
      ctx.strokeStyle = ring % 2 === 0
        ? rgbaHex(PALETTE.giltSpoke, (0.72 - ring * 0.13) * shoutAmp)
        : rgbaHex(PALETTE.carnivalVermilion, (0.68 - ring * 0.12) * shoutAmp);
      ctx.lineWidth = 1.5 + shoutAmp * 0.9; ctx.beginPath();
      ctx.arc(crestPt.x, crestPt.y - 10, rad, -Math.PI * 0.92, -Math.PI * 0.08); ctx.stroke();
    }
    // 2. Ferris Wheel of Spinning Cages
    const fwX = 0.382 * w, fwY = 0.36 * h, fwR = Math.min(0.076 * w, 0.162 * h), fwBase = 0.768 * h;
    ctx.strokeStyle = PALETTE.trailerIron; ctx.lineWidth = 3.2;
    ctx.beginPath(); ctx.moveTo(fwX - fwR * 0.58, fwBase);
    ctx.lineTo(fwX, fwY); ctx.lineTo(fwX + fwR * 0.58, fwBase);
    ctx.stroke(); ctx.strokeStyle = PALETTE.giltSpoke; ctx.lineWidth = 2.2; ctx.beginPath();
    ctx.arc(fwX, fwY, fwR, 0, Math.PI * 2); ctx.stroke(); ctx.lineWidth = 1.1; ctx.beginPath();
    ctx.arc(fwX, fwY, fwR * 0.82, 0, Math.PI * 2); ctx.stroke();
    for (let sp = 0; sp < 16; sp++) {
      const a = state.ferrisAngle + (sp * Math.PI) / 8; ctx.beginPath();
      ctx.moveTo(fwX, fwY); ctx.lineTo(fwX + Math.cos(a) * fwR, fwY + Math.sin(a) * fwR); ctx.stroke();
    }
    for (let cg = 0; cg < 8; cg++) {
      const a = state.ferrisAngle + (cg * Math.PI) / 4; const gx = fwX + Math.cos(a) * fwR;
      const gy = fwY + Math.sin(a) * fwR; const spin = state.cageSpin * (cg % 2 === 0 ? 1.6 : -1.9) + cg;
      const cw = Math.max(5.5, fwR * 0.16), ch = Math.max(7.5, fwR * 0.22);
      ctx.fillStyle = rgbaHex(PALETTE.nightBedrock, 0.72); ctx.strokeStyle = PALETTE.tentIvory;
      ctx.lineWidth = 1.2; ctx.beginPath();
      ctx.ellipse(gx, gy + ch * 0.45, cw, ch * 0.55, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      for (let bar = -1; bar <= 1; bar++) {
        const bx = gx + Math.sin(spin + bar * 1.05) * (cw * 0.78); ctx.strokeStyle = PALETTE.giltSpoke;
        ctx.beginPath(); ctx.moveTo(bx, gy - ch * 0.05); ctx.lineTo(bx, gy + ch * 0.95); ctx.stroke();
      }
      ctx.fillStyle = PALETTE.carnivalVermilion; ctx.fillRect(gx - cw * 0.8, gy - 1.5, cw * 1.6, 3);
    }
    // 3. Big Top Dome with Clustered Trapezes
    const btX = 0.112 * w, btBase = 0.805 * h, btEave = 0.695 * h, btPeak = 0.552 * h, btRx = 0.068 * w;
    for (let g = 0; g < 8; g++) {
      const xL = btX - btRx + (g / 8) * (btRx * 2); const xR = btX - btRx + ((g + 1) / 8) * (btRx * 2);
      ctx.fillStyle = g % 2 === 0 ? PALETTE.carnivalVermilion : PALETTE.tentIvory; ctx.beginPath();
      ctx.moveTo(btX, btPeak); ctx.lineTo(xR, btEave); ctx.lineTo(xR, btBase); ctx.lineTo(xL, btBase);
      ctx.lineTo(xL, btEave); ctx.closePath(); ctx.fill();
    }
    // Illuminated cutaway oculus revealing secret cluster of trapezes
    const ocY = 0.662 * h, ocRx = btRx * 0.54, ocRy = (btBase - btPeak) * 0.30; ctx.save();
    ctx.beginPath(); ctx.ellipse(btX, ocY, ocRx, ocRy, 0, 0, Math.PI * 2);
    ctx.fillStyle = PALETTE.nightBedrock; ctx.fill();
    ctx.strokeStyle = PALETTE.giltSpoke; ctx.lineWidth = 2.0; ctx.stroke(); ctx.clip();
    const innerGlow = ctx.createRadialGradient(btX, ocY, 2, btX, ocY, ocRx);
    innerGlow.addColorStop(0, rgbaHex(PALETTE.giltSpoke, 0.42));
    innerGlow.addColorStop(1, rgbaHex(PALETTE.nightBedrock, 0)); ctx.fillStyle = innerGlow;
    ctx.fillRect(btX - ocRx, ocY - ocRy, ocRx * 2, ocRy * 2);
    for (let tr = -2; tr <= 2; tr++) {
      const sway = Math.sin(state.trapezeSway + tr * 0.55) * 4.5; const anchorX = btX + tr * (ocRx * 0.28);
      const barY = ocY - ocRy * 0.1 + Math.abs(tr) * 4.5; const barX = anchorX + sway;
      ctx.strokeStyle = PALETTE.tentIvory; ctx.lineWidth = 1.0;
      ctx.beginPath(); ctx.moveTo(anchorX - 3.5, ocY - ocRy);
      ctx.lineTo(barX - 4.5, barY); ctx.moveTo(anchorX + 3.5, ocY - ocRy);
      ctx.lineTo(barX + 4.5, barY); ctx.stroke(); ctx.strokeStyle = PALETTE.giltSpoke; ctx.lineWidth = 2.1;
      ctx.beginPath(); ctx.moveTo(barX - 5.5, barY); ctx.lineTo(barX + 5.5, barY); ctx.stroke();
    }
    ctx.restore();
    // 4. Death-Ride with Crouching Motorcyclists
    const drX = 0.248 * w, drTop = 0.585 * h, drBot = 0.812 * h, drRx = 0.045 * w;
    ctx.fillStyle = "#7a4a2a"; ctx.fillRect(drX - drRx, drTop, drRx * 2, drBot - drTop);
    ctx.strokeStyle = rgbaHex(PALETTE.nightBedrock, 0.45); ctx.lineWidth = 1;
    for (let st = -3; st <= 3; st++) {
      const sx = drX + (st / 3.5) * drRx; ctx.beginPath(); ctx.moveTo(sx, drTop); ctx.lineTo(sx, drBot);
      ctx.stroke();
    }
    ctx.fillStyle = PALETTE.carnivalVermilion; ctx.fillRect(drX - drRx * 1.06, drTop - 5, drRx * 2.12, 6);
    for (let hp = 0; hp < 4; hp++) {
      const hy = drTop + (hp / 3) * (drBot - drTop - 4); ctx.fillStyle = PALETTE.trailerIron;
      ctx.fillRect(drX - drRx * 1.04, hy, drRx * 2.08, 3.2);
    }
    // Cutaway window into the cylindrical velodrome wall
    const cwTop = drTop + (drBot - drTop) * 0.24, cwH = (drBot - drTop) * 0.50; ctx.fillStyle = "#26180f";
    ctx.fillRect(drX - drRx * 0.86, cwTop, drRx * 1.72, cwH); ctx.strokeStyle = PALETTE.giltSpoke;
    ctx.lineWidth = 1.4; ctx.strokeRect(drX - drRx * 0.86, cwTop, drRx * 1.72, cwH);
    for (let m = 0; m < 2; m++) {
      const ma = state.motoAngle + m * Math.PI; const mx = drX + Math.sin(ma) * (drRx * 0.64);
      const my = cwTop + cwH * (0.34 + m * 0.34) + Math.cos(ma) * 3.2;
      const dir = Math.cos(ma) >= 0 ? 1 : -1; ctx.strokeStyle = rgbaHex(PALETTE.giltSpoke, 0.55);
      ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(mx - dir * 11, my); ctx.lineTo(mx, my);
      ctx.stroke(); ctx.fillStyle = PALETTE.tentIvory;
      ctx.beginPath(); ctx.arc(mx - 4, my + 1.5, 2.4, 0, Math.PI * 2);
      ctx.arc(mx + 4, my + 1.5, 2.4, 0, Math.PI * 2); ctx.fill();
      // Crouching motorcyclist silhouette banked horizontally on the wall
      ctx.fillStyle = m === 0 ? PALETTE.carnivalVermilion : PALETTE.giltSpoke; ctx.beginPath();
      ctx.ellipse(mx, my - 1.2, 4.8, 2.2, -dir * 0.18, 0, Math.PI * 2); ctx.fill();
    }
    // 5. Carousel with Spoke of Chains
    const ccX = 0.368 * w, ccBase = 0.825 * h, ccTop = 0.625 * h, ccRx = 0.042 * w;
    ctx.fillStyle = PALETTE.trailerIron; ctx.fillRect(ccX - ccRx * 0.65, ccBase - 5, ccRx * 1.3, 6);
    ctx.fillStyle = PALETTE.giltSpoke; ctx.fillRect(ccX - 3.5, ccTop + 10, 7, ccBase - ccTop - 14);
    for (let ch = 0; ch < 10; ch++) {
      const ca = state.carouselPhase + (ch * Math.PI) / 5; const topX = ccX + Math.cos(ca) * (ccRx * 0.88);
      const topY = ccTop + 14 + Math.sin(ca) * 3; const seatX = ccX + Math.cos(ca) * (ccRx * 1.38);
      const seatY = ccTop + (ccBase - ccTop) * 0.56 + Math.sin(ca) * 5.5;
      ctx.strokeStyle = PALETTE.tentIvory; ctx.lineWidth = 1.0; ctx.beginPath(); ctx.moveTo(topX, topY);
      ctx.lineTo(seatX, seatY); ctx.stroke();
      ctx.fillStyle = ch % 2 === 0 ? PALETTE.carnivalVermilion : PALETTE.giltSpoke;
      ctx.fillRect(seatX - 2.6, seatY - 1.8, 5.2, 3.6);
    }
    for (let seg = 0; seg < 6; seg++) {
      const sx0 = ccX - ccRx + (seg / 6) * (ccRx * 2); const sx1 = ccX - ccRx + ((seg + 1) / 6) * (ccRx * 2);
      ctx.fillStyle = seg % 2 === 0 ? PALETTE.carnivalVermilion : PALETTE.tentIvory; ctx.beginPath();
      ctx.moveTo(ccX, ccTop - 10); ctx.lineTo(sx1, ccTop + 14); ctx.lineTo(sx0, ccTop + 14); ctx.closePath();
      ctx.fill();
    }
    // 6. Shooting-Galleries Arcade
    const sgX = 0.454 * w, sgTop = 0.692 * h, sgBot = 0.842 * h, sgRx = 0.032 * w;
    ctx.fillStyle = PALETTE.nightBedrock;
    ctx.fillRect(sgX - sgRx, sgTop + 10, sgRx * 2, sgBot - sgTop - 10); ctx.fillStyle = "#5c3b23";
    ctx.fillRect(sgX - sgRx * 1.05, sgTop + (sgBot - sgTop) * 0.58, sgRx * 2.1, (sgBot - sgTop) * 0.42);
    for (let st = 0; st < 5; st++) {
      const bx = sgX - sgRx + (st / 5) * (sgRx * 2);
      ctx.fillStyle = st % 2 === 0 ? PALETTE.carnivalVermilion : PALETTE.tentIvory;
      ctx.fillRect(bx, sgTop, (sgRx * 2) / 5, 11);
    }
    for (let tg = 0; tg < 4; tg++) {
      const drift = ((state.carouselPhase * 0.35 + tg * 0.25) % 1);
      const tx = sgX - sgRx * 0.78 + drift * (sgRx * 1.56); const ty = sgTop + 21 + (tg % 2) * 9;
      ctx.fillStyle = tg % 2 === 0 ? PALETTE.giltSpoke : PALETTE.tentIvory; ctx.beginPath();
      ctx.arc(tx, ty, 2.4, 0, Math.PI * 2); ctx.fill();
    }
    if (state.monthsRemaining > 0) {
      ctx.fillStyle = PALETTE.giltSpoke;
      ctx.font = "bold " + Math.max(8, Math.round(h * 0.015)) + "px monospace";
      ctx.fillText(state.monthsRemaining + "M", sgX - sgRx * 0.65, sgBot - 6);
    }
    // Active / Hovered / Bedrock-Refusal Framing
    for (let i = 0; i < CARNIVAL_RIDES.length; i++) {
      const r = CARNIVAL_RIDES[i];
      const active = r.id === selectedId || r.id === hoveredId || (state.recoilFlash > 0.05 && r.id === state.lastRefusedRideId);
      if (!active) continue; const hb = r.hitBox; ctx.save();
      ctx.strokeStyle = (wrenchMode && r.id === hoveredId) || (state.recoilFlash > 0.05 && r.id === state.lastRefusedRideId)
        ? PALETTE.carnivalVermilion
        : rgbaHex(PALETTE.giltSpoke, r.id === hoveredId ? 0.9 : 0.58);
      ctx.lineWidth = r.id === hoveredId ? 1.8 : 1.2; ctx.setLineDash([5, 4]);
      ctx.strokeRect(hb[0] * w, hb[1] * h, (hb[2] - hb[0]) * w, (hb[3] - hb[1]) * h); ctx.restore();
    }
  }

  function createCarnivalEngine(opts) {
    const options = opts || {};
    const onBedrockRefusal = typeof options.onBedrockRefusal === "function" ? options.onBedrockRefusal : null;
    const state = {
      bedrockRefusalCount: 0, lastRefusedRideId: null,
      recoilFlash: 0, shoutPulse: 0,
      selectedRideId: "roller_coaster", decampmentProgress: 0,
      monthsRemaining: 0, daysRemaining: 0,
      muted: false, reducedMotion: Boolean(options.reducedMotion),
      coasterT: options.reducedMotion ? 0.41 : 0.22, carouselPhase: 0.35,
      ferrisAngle: 0.20, cageSpin: 0.45,
      motoAngle: 0.60, trapezeSway: 0.30
    }; const dustMotes = [];
    for (let i = 0; i < 18; i++) {
      dustMotes.push({
        x: ((i * 0.173 + 0.07) % 0.96) + 0.02, y: 0.655 + ((i * 0.089) % 0.195),
        r: 2.2 + (i % 4) * 1.4, spd: 0.035 + (i % 5) * 0.014
      });
    }
    const audio = createCarnivalAudio(state);
    function findRide(rideId) {
      for (let i = 0; i < CARNIVAL_RIDES.length; i++) {
        if (CARNIVAL_RIDES[i].id === rideId) return CARNIVAL_RIDES[i];
      }
      return null;
    }
    function getState() {
      return {
        dismantledCount: 0, intactCount: 6,
        permanent: true, bedrockRefusalCount: state.bedrockRefusalCount,
        lastRefusedRideId: state.lastRefusedRideId, selectedRideId: state.selectedRideId,
        shoutPulse: Number(state.shoutPulse.toFixed(4)), recoilFlash: Number(state.recoilFlash.toFixed(4)),
        decampmentProgress: Number(state.decampmentProgress.toFixed(4)),
        monthsRemaining: state.monthsRemaining, daysRemaining: state.daysRemaining,
        muted: Boolean(state.muted), reducedMotion: Boolean(state.reducedMotion),
        rides: CARNIVAL_RIDES.map(function (r) { return Object.assign({}, r); })
      };
    }
    function attemptUnboltCarnival(rideId) {
      const matched = findRide(rideId);
      const targetId = matched ? matched.id : String(rideId || "roller_coaster");
      state.bedrockRefusalCount += 1; state.lastRefusedRideId = targetId;
      state.recoilFlash = 1.0; audio.playBedrockRefusal();
      const result = {
        ok: false, refused: true,
        rideId: targetId, permanent: true,
        dismantledCount: 0, intactCount: 6,
        bedrockRefusalCount: state.bedrockRefusalCount,
        message: "Bolted into living bedrock — this half-Sophronia never pulls up stakes."
      };
      if (onBedrockRefusal) {
        try { onBedrockRefusal(result); } catch (_) {}
      }
      return result;
    }
    function triggerSafetyBarShout() {
      state.shoutPulse = 1.0; audio.playSuspendedShout();
      return {
        ok: true, shoutPulse: 1.0,
        rideId: "roller_coaster"
      };
    }
    function selectRide(rideId) {
      const found = findRide(rideId) || CARNIVAL_RIDES[0]; state.selectedRideId = found.id;
      audio.playCalliopePhrase(state.decampmentProgress);
      return Object.assign({}, found, { ok: true, selectedRideId: state.selectedRideId });
    }
    function syncDecampment(progress, monthsRemaining, daysRemaining) {
      const prevMonths = state.monthsRemaining; state.decampmentProgress = clamp01(progress);
      state.monthsRemaining = Math.max(0, Number(monthsRemaining) || 0);
      state.daysRemaining = Math.max(0, Number(daysRemaining) || 0);
      if (prevMonths > 0 && state.monthsRemaining < prevMonths && state.monthsRemaining > 0) {
        audio.playMonthTick();
      }
      return getState();
    }
    function step(dtSec) {
      const dt = Math.max(0, Math.min(0.1, Number(dtSec) || 0.016));
      state.recoilFlash = Math.max(0, state.recoilFlash - dt * 1.45);
      state.shoutPulse = Math.max(0, state.shoutPulse - dt * 0.72); if (state.reducedMotion) return;
      const drag = 1 - 0.56 * Math.exp(-Math.pow((state.coasterT - 0.41) / 0.09, 2))
                     - 0.38 * Math.exp(-Math.pow((state.coasterT - 0.80) / 0.08, 2));
      state.coasterT = (state.coasterT + dt * 0.16 * drag) % 1;
      state.carouselPhase = (state.carouselPhase + dt * 1.65) % (Math.PI * 2);
      state.ferrisAngle = (state.ferrisAngle + dt * 0.36) % (Math.PI * 2);
      state.cageSpin = (state.cageSpin + dt * 2.15) % (Math.PI * 2);
      state.motoAngle = (state.motoAngle + dt * 5.6) % (Math.PI * 2);
      state.trapezeSway = (state.trapezeSway + dt * 2.25) % (Math.PI * 2);
      const windBoost = 1 + state.decampmentProgress * 2.2;
      for (let i = 0; i < dustMotes.length; i++) {
        dustMotes[i].x += dt * dustMotes[i].spd * windBoost; if (dustMotes[i].x > 0.99) dustMotes[i].x = 0.01;
      }
    }
    function renderBackdropAndCarnival(ctx, width, height, viewOpts) {
      if (!ctx || !(width > 0) || !(height > 0)) return; const vo = viewOpts || {};
      if (vo.decampmentProgress !== undefined) {
        state.decampmentProgress = clamp01(vo.decampmentProgress);
      }
      if (vo.monthsRemaining !== undefined) {
        state.monthsRemaining = Math.max(0, Number(vo.monthsRemaining) || 0);
      }
      if (vo.daysRemaining !== undefined) {
        state.daysRemaining = Math.max(0, Number(vo.daysRemaining) || 0);
      }
      if (vo.reducedMotion !== undefined) {
        setReducedMotion(vo.reducedMotion);
      }
      ctx.save(); drawSkyPlazaAndBedrock(ctx, width, height, state, dustMotes);
      drawCarnivalStructures(ctx, width, height, state, vo); ctx.restore();
    }
    function hitTest(normX, normY) {
      if (!Number.isFinite(normX) || !Number.isFinite(normY)) return null;
      if (normX < 0 || normX > 0.495 || normY < 0 || normY > 1) return null;
      const priority = [5, 1, 3, 4, 2, 0]; let best = null; let bestDist = Infinity;
      for (let p = 0; p < priority.length; p++) {
        const r = CARNIVAL_RIDES[priority[p]]; const hb = r.hitBox;
        if (normX >= hb[0] && normX <= hb[2] && normY >= hb[1] && normY <= hb[3]) {
          const d = Math.hypot(normX - r.nx, normY - r.ny);
          if (d < bestDist) {
            bestDist = d; best = r;
          }
        }
      }
      if (!best) return null;
      return {
        half: "carnival", id: best.id,
        label: best.label, permanent: true,
        dismantleable: false, detail: best.detail
      };
    }
    function setReducedMotion(flag) {
      state.reducedMotion = Boolean(flag);
      if (state.reducedMotion) {
        state.coasterT = 0.41;
      }
      return state.reducedMotion;
    }
    function reset() {
      state.bedrockRefusalCount = 0; state.lastRefusedRideId = null;
      state.recoilFlash = 0; state.shoutPulse = 0;
      state.selectedRideId = "roller_coaster"; state.decampmentProgress = 0;
      state.monthsRemaining = 0; state.daysRemaining = 0; state.coasterT = state.reducedMotion ? 0.41 : 0.22;
      return getState();
    }
    return Object.freeze({
      attemptUnboltCarnival: attemptUnboltCarnival, triggerSafetyBarShout: triggerSafetyBarShout,
      selectRide: selectRide, syncDecampment: syncDecampment,
      step: step, renderBackdropAndCarnival: renderBackdropAndCarnival,
      hitTest: hitTest, setReducedMotion: setReducedMotion,
      reset: reset, getState: getState,
      audio: audio
    });
  }

  const API = Object.freeze({
    PALETTE: PALETTE, CARNIVAL_RIDES: CARNIVAL_RIDES,
    createCarnivalEngine: createCarnivalEngine
  }); global.SophroniaPermanentCarnival = API;
  if (typeof window !== "undefined") {
    window.SophroniaPermanentCarnival = API;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
