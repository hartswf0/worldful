(function () {
  "use strict";

  const PALETTE = Object.freeze({
    plateauNightGround: "#1b1712",
    mesaShadow: "#2c241b",
    ochreMesa: "#c69d63",
    plateauGrass: "#8e8958",
    chalkRoad: "#dfd5be",
    scrubbedLime: "#ece7da",
    scrubbedMortar: "#a8a090",
    terracottaActive: "#c85232",
    terracottaGlow: "#e47b47",
    mercuryQuicksilver: "#cdd6df",
    mercuryCyan: "#8fb4c9",
    wearinessLead: "#7a6e5d"
  });

  const SISTER_CITIES = Object.freeze([
    Object.freeze({
      index: 0,
      id: "mesa_meridies",
      name: "Eutropia-Meridies",
      cardinal: "South Cliff",
      nx: 0.50,
      ny: 0.76,
      windowVista: "Red Escarpment Rim & Winding Valley Gorge",
      vistaKind: "gorge",
      bellHz: 293.66
    }),
    Object.freeze({
      index: 1,
      id: "mesa_vespera",
      name: "Eutropia-Vespera",
      cardinal: "Southwest Bluff",
      nx: 0.20,
      ny: 0.55,
      windowVista: "Sunken Viaduct Saddle & Olive Terraces",
      vistaKind: "viaduct",
      bellHz: 329.63
    }),
    Object.freeze({
      index: 2,
      id: "mesa_caurus",
      name: "Eutropia-Caurus",
      cardinal: "Northwest Crag",
      nx: 0.26,
      ny: 0.27,
      windowVista: "Windward Salt Steppe & Distant Chalk Buttes",
      vistaKind: "steppe",
      bellHz: 369.99
    }),
    Object.freeze({
      index: 3,
      id: "mesa_caducea",
      name: "Eutropia-Caducea",
      cardinal: "Central Hub Mesa",
      nx: 0.50,
      ny: 0.46,
      windowVista: "Six-Road Crossroads & Quicksilver Cistern",
      vistaKind: "crossroads",
      bellHz: 392.00
    }),
    Object.freeze({
      index: 4,
      id: "mesa_boreas",
      name: "Eutropia-Boreas",
      cardinal: "High North Table",
      nx: 0.53,
      ny: 0.17,
      windowVista: "Northern Chalk Ravine & Cloud-Grazed Ridge",
      vistaKind: "ravine",
      bellHz: 440.00
    }),
    Object.freeze({
      index: 5,
      id: "mesa_aurora",
      name: "Eutropia-Aurora",
      cardinal: "Northeast Spur",
      nx: 0.78,
      ny: 0.28,
      windowVista: "Twin Cypress Mesas & Morning Mist Basin",
      vistaKind: "cypress",
      bellHz: 493.88
    }),
    Object.freeze({
      index: 6,
      id: "mesa_eurus",
      name: "Eutropia-Eurus",
      cardinal: "Southeast Promontory",
      nx: 0.79,
      ny: 0.56,
      windowVista: "Terraced Olive Gorge & Sunlit Quarry Slope",
      vistaKind: "quarry",
      bellHz: 587.33
    })
  ]);

  const RAW_ROAD_SPECS = [
    [0, 1, -0.14],
    [0, 3, 0.11],
    [0, 6, 0.15],
    [1, 2, -0.16],
    [1, 3, -0.10],
    [2, 3, 0.12],
    [2, 4, -0.15],
    [3, 4, -0.09],
    [3, 5, 0.11],
    [3, 6, -0.12],
    [4, 5, -0.14],
    [5, 6, 0.16]
  ];

  const ROAD_LOOKUP = new Map();
  const ROAD_ADJ = Array.from({ length: 7 }, () => []);

  const PLATEAU_ROADS = Object.freeze(
    RAW_ROAD_SPECS.map(function (spec) {
      const a = spec[0];
      const b = spec[1];
      const bend = spec[2];
      const pair = [a, b];
      pair.from = a;
      pair.to = b;
      pair.bend = bend;
      ROAD_ADJ[a].push(b);
      ROAD_ADJ[b].push(a);
      ROAD_LOOKUP.set(a + ":" + b, pair);
      ROAD_LOOKUP.set(b + ":" + a, pair);
      return Object.freeze(pair);
    })
  );

  const CANON_MOTIF_HZ = Object.freeze([293.66, 440.00, 369.99, 329.63]);
  const VOICE_TIMBRES = Object.freeze([
    "plucked_lute",
    "breathy_flute",
    "dulcimer_chime",
    "warm_reed"
  ]);

  function clamp(val, lo, hi) {
    return val < lo ? lo : val > hi ? hi : val;
  }

  function findShortestRoadRoute(fromIdx, toIdx) {
    const start = clamp(Math.floor(fromIdx || 0), 0, 6);
    const goal = clamp(Math.floor(toIdx || 0), 0, 6);
    if (start === goal) {
      return [start];
    }
    const queue = [[start]];
    const visited = new Set([start]);
    while (queue.length > 0) {
      const path = queue.shift();
      const tail = path[path.length - 1];
      const neighbors = ROAD_ADJ[tail];
      for (let i = 0; i < neighbors.length; i += 1) {
        const next = neighbors[i];
        if (next === goal) {
          return path.concat([next]);
        }
        if (!visited.has(next)) {
          visited.add(next);
          queue.push(path.concat([next]));
        }
      }
    }
    return [start, goal];
  }

  /* ---------- geometry & colour helpers ---------- */
  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mixColor(a, b, t) {
    const A = hexToRgb(a);
    const B = hexToRgb(b);
    const k = clamp(t, 0, 1);
    return "rgb(" + Math.round(A[0] + (B[0] - A[0]) * k) + "," +
      Math.round(A[1] + (B[1] - A[1]) * k) + "," + Math.round(A[2] + (B[2] - A[2]) * k) + ")";
  }
  function rgba(hex, alpha) {
    const c = hexToRgb(hex);
    return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + alpha + ")";
  }
  function seeded(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }
  function computeLayout(width, height) {
    const w = Math.max(1, width || 1);
    const h = Math.max(1, height || 1);
    const portrait = h > w * 1.15;
    const r = Math.max(14, Math.min(w * 0.058, h * 0.074, 66));
    const pts = SISTER_CITIES.map(function (c) { return { x: c.nx * w, y: c.ny * h }; });
    return { w: w, h: h, r: r, portrait: portrait, pts: pts, squash: 0.68 };
  }
  function roadControl(L, a, b, bend) {
    const A = L.pts[a];
    const B = L.pts[b];
    const dx = B.x - A.x;
    const dy = B.y - A.y;
    const sign = a < b ? 1 : -1;
    return { x: (A.x + B.x) / 2 - dy * bend * sign, y: (A.y + B.y) / 2 + dx * bend * sign };
  }
  function quadPoint(A, C, B, t) {
    const u = 1 - t;
    return { x: u * u * A.x + 2 * u * t * C.x + t * t * B.x, y: u * u * A.y + 2 * u * t * C.y + t * t * B.y };
  }
  function sampleRoute(L, route, s) {
    if (!route || route.length < 2) {
      const p = L.pts[route && route.length ? route[0] : 0];
      return { x: p.x, y: p.y, angle: 0 };
    }
    const segs = route.length - 1;
    const f = clamp(s, 0, 1) * segs;
    const i = Math.min(segs - 1, Math.floor(f));
    const t = f - i;
    const a = route[i];
    const b = route[i + 1];
    const road = ROAD_LOOKUP.get(a + ":" + b);
    const bend = road ? road.bend : 0;
    const C = roadControl(L, Math.min(a, b), Math.max(a, b), bend);
    const A = L.pts[a];
    const B = L.pts[b];
    const p = quadPoint(A, C, B, t);
    const q = quadPoint(A, C, B, Math.min(1, t + 0.02));
    return { x: p.x, y: p.y, angle: Math.atan2(q.y - p.y, q.x - p.x) };
  }
  function averageWeariness(society) {
    if (!society) return 0;
    const w = society.weariness;
    if (typeof w === "number") return clamp(w, 0, 1);
    if (w && typeof w === "object") {
      const vals = Object.keys(w).map(function (k) { return Number(w[k]) || 0; });
      return vals.length ? clamp(vals.reduce(function (s, v) { return s + v; }, 0) / vals.length, 0, 1) : 0;
    }
    if (typeof society.wearinessMean === "number") return clamp(society.wearinessMean, 0, 1);
    return 0;
  }

  /* ---------- musical-chair canon WebAudio ---------- */
  let audioCtx = null;
  let masterGain = null;
  function getAudio() {
    if (audioCtx) return audioCtx;
    try {
      const root = typeof window !== "undefined" ? window : null;
      const AC = root && (root.AudioContext || root.webkitAudioContext);
      if (!AC) return null;
      audioCtx = new AC();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.32;
      masterGain.connect(audioCtx.destination);
    } catch (err) {
      audioCtx = null;
    }
    return audioCtx;
  }
  function envGain(ac, t0, attack, peak, decay) {
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay);
    g.connect(masterGain);
    return g;
  }
  function playVoice(ac, timbre, hz, t0, dur) {
    const end = t0 + dur + 1.2;
    if (timbre === "plucked_lute") {
      const o = ac.createOscillator();
      o.type = "triangle";
      o.frequency.setValueAtTime(hz, t0);
      o.connect(envGain(ac, t0, 0.006, 0.34, dur + 0.5));
      o.start(t0); o.stop(end);
    } else if (timbre === "breathy_flute") {
      const o = ac.createOscillator();
      const lfo = ac.createOscillator();
      const lfoG = ac.createGain();
      const f = ac.createBiquadFilter();
      o.type = "sine"; o.frequency.setValueAtTime(hz * 2, t0);
      lfo.frequency.value = 5.2; lfoG.gain.value = hz * 0.012;
      lfo.connect(lfoG); lfoG.connect(o.frequency);
      f.type = "lowpass"; f.frequency.value = hz * 4; f.Q.value = 0.7;
      o.connect(f); f.connect(envGain(ac, t0, 0.09, 0.2, dur + 0.25));
      o.start(t0); lfo.start(t0); o.stop(end); lfo.stop(end);
    } else if (timbre === "dulcimer_chime") {
      [1, 2.76, 5.4].forEach(function (ratio, k) {
        const o = ac.createOscillator();
        o.type = "sine"; o.frequency.setValueAtTime(hz * ratio, t0);
        o.connect(envGain(ac, t0, 0.003, 0.22 / (k + 1), 0.9 - k * 0.2));
        o.start(t0); o.stop(end);
      });
    } else {
      const o = ac.createOscillator();
      const f = ac.createBiquadFilter();
      o.type = "sawtooth"; o.frequency.setValueAtTime(hz / 2, t0);
      f.type = "lowpass"; f.frequency.value = 1150; f.Q.value = 2.4;
      o.connect(f); f.connect(envGain(ac, t0, 0.05, 0.14, dur + 0.2));
      o.start(t0); o.stop(end);
    }
  }
  function voiceAssignment(epoch) {
    const e = Math.max(0, Math.floor(epoch || 0));
    return [0, 1, 2, 3].map(function (v) { return VOICE_TIMBRES[(v + e) % 4]; });
  }
  function playYawnSighRaw(epoch, delay) {
    const ac = getAudio();
    const result = { formants: [[720, 480], [1180, 880]], glideHz: [220, 138], epoch: epoch || 0 };
    if (!ac) return result;
    try {
      const t0 = ac.currentTime + (delay || 0);
      const src = ac.createOscillator();
      src.type = "sawtooth";
      src.frequency.setValueAtTime(220, t0);
      src.frequency.exponentialRampToValueAtTime(138, t0 + 1.5);
      const out = envGain(ac, t0, 0.35, 0.16, 1.3);
      result.formants.forEach(function (fm) {
        const bp = ac.createBiquadFilter();
        bp.type = "bandpass"; bp.Q.value = 6;
        bp.frequency.setValueAtTime(fm[0], t0);
        bp.frequency.linearRampToValueAtTime(fm[1], t0 + 1.5);
        src.connect(bp); bp.connect(out);
      });
      src.start(t0); src.stop(t0 + 1.9);
    } catch (err) { /* silent fallback */ }
    return result;
  }

  /* ---------- plateau drawing ---------- */
  function drawGround(ctx, L, t, wear) {
    const g = ctx.createLinearGradient(0, 0, 0, L.h);
    g.addColorStop(0, PALETTE.plateauNightGround);
    g.addColorStop(0.55, mixColor(PALETTE.mesaShadow, PALETTE.wearinessLead, wear * 0.35));
    g.addColorStop(1, PALETTE.plateauNightGround);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, L.w, L.h);
    ctx.lineWidth = 1;
    for (let k = 0; k < 16; k += 1) {
      const baseY = (k + 0.5) * (L.h / 16);
      ctx.strokeStyle = rgba(PALETTE.ochreMesa, 0.07 + (k % 4 === 0 ? 0.06 : 0));
      ctx.beginPath();
      for (let x = 0; x <= L.w; x += 12) {
        const y = baseY + Math.sin(x * 0.007 + k * 1.3) * L.h * 0.018 + Math.sin(x * 0.019 + k) * 4;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    for (let c = 0; c < 3; c += 1) {
      const cx = ((t * 0.012 + c * 0.37) % 1.4 - 0.2) * L.w;
      const cy = L.h * (0.25 + c * 0.25);
      const rad = Math.max(L.w, L.h) * 0.22;
      const cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
      cg.addColorStop(0, "rgba(10,8,6,0.22)");
      cg.addColorStop(1, "rgba(10,8,6,0)");
      ctx.fillStyle = cg;
      ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
    }
  }
  function drawGroves(ctx, L) {
    const rnd = seeded(2323);
    for (let i = 0; i < 90; i += 1) {
      const x = rnd() * L.w;
      const y = rnd() * L.h;
      const near = L.pts.some(function (p) { return Math.hypot(p.x - x, (p.y - y) * 1.3) < L.r * 1.7; });
      if (near) continue;
      const s = L.r * (0.05 + rnd() * 0.05);
      if (rnd() < 0.35) {
        ctx.fillStyle = rgba("#2f3a22", 0.85);
        ctx.beginPath();
        ctx.moveTo(x, y - s * 3.2); ctx.lineTo(x + s * 0.8, y); ctx.lineTo(x - s * 0.8, y);
        ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = rgba(PALETTE.plateauGrass, 0.55);
        ctx.beginPath(); ctx.arc(x, y, s * 1.3, 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  function drawMercuryBoard(ctx, L, t) {
    const cell = Math.max(28, Math.min(L.w, L.h) / 9);
    ctx.save();
    ctx.strokeStyle = rgba(PALETTE.mercuryCyan, 0.1 + 0.03 * Math.sin(t * 0.8));
    ctx.lineWidth = 0.8;
    ctx.setLineDash([2, 5]);
    for (let x = -L.h; x < L.w + L.h; x += cell) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + L.h * 0.6, L.h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - L.h * 0.6, L.h); ctx.stroke();
    }
    ctx.restore();
  }
  function drawRoads(ctx, L, exodus) {
    PLATEAU_ROADS.forEach(function (road) {
      const A = L.pts[road.from];
      const B = L.pts[road.to];
      const C = roadControl(L, road.from, road.to, road.bend);
      let onRoute = false;
      if (exodus.inProgress) {
        for (let i = 0; i < exodus.routeIndices.length - 1; i += 1) {
          const a = exodus.routeIndices[i];
          const b = exodus.routeIndices[i + 1];
          if ((a === road.from && b === road.to) || (a === road.to && b === road.from)) onRoute = true;
        }
      }
      ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.quadraticCurveTo(C.x, C.y, B.x, B.y);
      ctx.strokeStyle = rgba(PALETTE.mesaShadow, 0.9);
      ctx.lineWidth = Math.max(3, L.r * 0.16);
      ctx.stroke();
      ctx.setLineDash([L.r * 0.12, L.r * 0.08]);
      ctx.strokeStyle = onRoute ? rgba(PALETTE.terracottaGlow, 0.85) : rgba(PALETTE.chalkRoad, 0.42);
      ctx.lineWidth = Math.max(1.2, L.r * 0.06);
      ctx.stroke();
      ctx.setLineDash([]);
    });
  }
  function hexPath(ctx, cx, cy, r, sq) {
    ctx.beginPath();
    for (let k = 0; k < 6; k += 1) {
      const a = Math.PI / 6 + k * Math.PI / 3;
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r * sq;
      if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
  function drawMesaBase(ctx, L, p, hovered) {
    const r = L.r;
    const depth = r * 0.42;
    ctx.fillStyle = PALETTE.mesaShadow;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + depth, r * 1.18, r * 1.18 * L.squash, 0, 0, Math.PI);
    ctx.lineTo(p.x - r * 1.18, p.y);
    ctx.ellipse(p.x, p.y, r * 1.18, r * 1.18 * L.squash, 0, Math.PI, 0, true);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(PALETTE.ochreMesa, 0.35);
    ctx.lineWidth = 0.8;
    for (let k = -10; k <= 10; k += 1) {
      const x = p.x + (k / 10) * r * 1.12;
      const top = p.y + Math.sqrt(Math.max(0, 1 - (k / 10.5) * (k / 10.5))) * r * 1.18 * L.squash;
      ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x + 1.5, top + depth * (0.5 + 0.4 * ((k * 7) % 3) / 2)); ctx.stroke();
    }
    ctx.fillStyle = mixColor(PALETTE.ochreMesa, PALETTE.plateauGrass, 0.35);
    ctx.beginPath(); ctx.ellipse(p.x, p.y, r * 1.18, r * 1.18 * L.squash, 0, 0, Math.PI * 2); ctx.fill();
    if (hovered) {
      ctx.strokeStyle = rgba(PALETTE.mercuryQuicksilver, 0.9);
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.ellipse(p.x, p.y, r * 1.3, r * 1.3 * L.squash, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  function roofSlots(r, sq) {
    const rnd = seeded(77);
    const out = [];
    for (let i = 0; i < 12; i += 1) {
      const a = (i / 12) * Math.PI * 2 + rnd() * 0.3;
      const d = r * (0.36 + (i % 2) * 0.2);
      out.push({ dx: Math.cos(a) * d, dy: Math.sin(a) * d * sq, s: r * (0.1 + rnd() * 0.05) });
    }
    return out;
  }

  /* ---------- hexagonal walled sister city ---------- */
  function drawCity(ctx, L, idx, warmth, inhabited, t, epoch, hovered) {
    const p = L.pts[idx];
    const r = L.r;
    const sq = L.squash;
    const wallFill = mixColor(PALETTE.scrubbedLime, PALETTE.terracottaGlow, warmth);
    const wallLine = mixColor(PALETTE.scrubbedMortar, "#7d2f1a", warmth);
    const roofFill = mixColor("#f4f0e6", PALETTE.terracottaActive, warmth);
    drawMesaBase(ctx, L, p, hovered);
    hexPath(ctx, p.x, p.y, r * 0.86, sq);
    ctx.fillStyle = mixColor("#d9d2c2", "#5a3322", warmth);
    ctx.fill();
    ctx.lineWidth = Math.max(2, r * 0.09);
    ctx.strokeStyle = wallFill;
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = wallLine;
    ctx.stroke();
    const roofs = roofSlots(r * 0.86, sq);
    roofs.forEach(function (rf) {
      const x = p.x + rf.dx;
      const y = p.y + rf.dy;
      ctx.fillStyle = roofFill;
      ctx.beginPath();
      ctx.moveTo(x - rf.s, y); ctx.lineTo(x, y - rf.s * 0.8); ctx.lineTo(x + rf.s, y);
      ctx.lineTo(x + rf.s, y + rf.s * 0.6); ctx.lineTo(x - rf.s, y + rf.s * 0.6);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = wallLine; ctx.lineWidth = 0.6; ctx.stroke();
    });
    ctx.fillStyle = mixColor("#efe9dc", "#d9a86a", warmth);
    ctx.beginPath(); ctx.ellipse(p.x, p.y + r * 0.05, r * 0.2, r * 0.2 * sq, 0, 0, Math.PI * 2); ctx.fill();
    if (warmth > 0.4) {
      const awn = ["#e0b13a", "#3f7f8c", "#b13d5a", "#6f8f3a"];
      for (let k = 0; k < 4; k += 1) {
        const a = k * Math.PI / 2 + 0.4;
        const ax = p.x + Math.cos(a) * r * 0.2;
        const ay = p.y + r * 0.05 + Math.sin(a) * r * 0.2 * sq;
        ctx.fillStyle = awn[k];
        ctx.globalAlpha = warmth;
        ctx.beginPath(); ctx.moveTo(ax - r * 0.06, ay); ctx.lineTo(ax + r * 0.06, ay); ctx.lineTo(ax, ay - r * 0.07);
        ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1;
      }
      for (let f = 0; f < 6; f += 1) {
        const ang = t * (0.6 + f * 0.13) + f;
        ctx.fillStyle = rgba("#2a1a10", 0.9 * warmth);
        ctx.fillRect(p.x + Math.cos(ang) * r * 0.13 - 1, p.y + r * 0.05 + Math.sin(ang) * r * 0.08 - 2, 2, 3);
      }
    }
    for (let k = 0; k < 6; k += 1) {
      const a = Math.PI / 6 + k * Math.PI / 3;
      const tx = p.x + Math.cos(a) * r * 0.86;
      const ty = p.y + Math.sin(a) * r * 0.86 * sq;
      ctx.fillStyle = wallFill;
      ctx.fillRect(tx - r * 0.07, ty - r * 0.2, r * 0.14, r * 0.2);
      ctx.strokeStyle = wallLine; ctx.lineWidth = 0.8;
      ctx.strokeRect(tx - r * 0.07, ty - r * 0.2, r * 0.14, r * 0.2);
    }
    const gx = p.x;
    const gy = p.y + r * 0.86 * sq;
    ctx.fillStyle = wallFill;
    ctx.fillRect(gx - r * 0.14, gy - r * 0.18, r * 0.28, r * 0.2);
    ctx.fillStyle = PALETTE.mesaShadow;
    ctx.beginPath(); ctx.arc(gx, gy - r * 0.02, r * 0.07, Math.PI, 0); ctx.lineTo(gx + r * 0.07, gy + r * 0.02);
    ctx.lineTo(gx - r * 0.07, gy + r * 0.02); ctx.closePath(); ctx.fill();
    ctx.fillStyle = wallFill;
    ctx.fillRect(p.x - r * 0.05, p.y - r * 0.5, r * 0.1, r * 0.42);
    ctx.fillStyle = roofFill;
    ctx.beginPath(); ctx.moveTo(p.x - r * 0.08, p.y - r * 0.5); ctx.lineTo(p.x, p.y - r * 0.78);
    ctx.lineTo(p.x + r * 0.08, p.y - r * 0.5); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = wallLine; ctx.stroke();
    if (warmth > 0.15) drawSmoke(ctx, p, r, roofs, t, warmth);
    if (inhabited && warmth > 0.9) drawYawnRings(ctx, p, r, roofs, t, epoch);
    const fs = Math.max(9, Math.round(r * 0.22));
    ctx.textAlign = "center";
    ctx.font = "600 " + fs + "px Georgia, serif";
    ctx.fillStyle = inhabited ? PALETTE.terracottaGlow : PALETTE.scrubbedLime;
    ctx.fillText(SISTER_CITIES[idx].name, p.x, p.y + r * 1.18 * sq + r * 0.42 + fs);
    ctx.font = Math.max(8, fs - 2) + "px Georgia, serif";
    ctx.fillStyle = inhabited ? rgba(PALETTE.terracottaGlow, 0.85) : rgba(PALETTE.scrubbedMortar, 0.9);
    ctx.fillText(inhabited ? "INHABITED · WEARY" : "EMPTY · SCRUBBED", p.x, p.y + r * 1.18 * sq + r * 0.42 + fs * 2.1);
  }
  function drawSmoke(ctx, p, r, roofs, t, warmth) {
    for (let c = 0; c < 4; c += 1) {
      const rf = roofs[c * 3];
      const bx = p.x + rf.dx;
      const by = p.y + rf.dy - rf.s;
      for (let k = 0; k < 6; k += 1) {
        const ph = (t * 0.32 + k / 6 + c * 0.17) % 1;
        const x = bx + Math.sin(ph * 6 + c + t * 0.7) * r * 0.12 * ph;
        const y = by - ph * r * 0.95;
        ctx.fillStyle = "rgba(205,198,186," + (0.32 * (1 - ph) * warmth).toFixed(3) + ")";
        ctx.beginPath(); ctx.arc(x, y, r * (0.03 + ph * 0.09), 0, Math.PI * 2); ctx.fill();
      }
    }
  }
  function drawYawnRings(ctx, p, r, roofs, t, epoch) {
    const ph = (t * 0.45) % 1;
    for (let k = 0; k < 3; k += 1) {
      const rf = roofs[(epoch * 5 + k * 4) % roofs.length];
      const x = p.x + rf.dx;
      const y = p.y + rf.dy - r * 0.3 - ph * r * 0.25;
      for (let ring = 0; ring < 2; ring += 1) {
        const rr = r * (0.08 + ((ph + ring * 0.5) % 1) * 0.22);
        ctx.strokeStyle = ring ? rgba("#e5c46a", 0.6 * (1 - ph)) : rgba(PALETTE.mercuryQuicksilver, 0.75 * (1 - ph));
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(x, y, rr, rr * 0.75, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = rgba(PALETTE.mercuryQuicksilver, 0.95);
      ctx.font = Math.max(9, Math.round(r * 0.2)) + "px serif";
      ctx.textAlign = "center";
      ctx.fillText("\u263F", x, y + r * 0.06);
    }
  }

  /* ---------- civic exodus caravan ---------- */
  function drawCaravan(ctx, L, exodus, t) {
    const N = 12;
    const sz = Math.max(4, L.r * 0.13);
    for (let k = 0; k < N; k += 1) {
      const s = clamp(exodus.progress * 1.35 - k * 0.032, 0, 1);
      const pt = sampleRoute(L, exodus.routeIndices, s);
      const bob = Math.sin(t * 9 + k) * sz * 0.12;
      ctx.save();
      ctx.translate(pt.x, pt.y + bob);
      ctx.rotate(pt.angle);
      const kind = k % 4;
      if (kind === 0) {
        ctx.fillStyle = "#6b4a2c"; ctx.fillRect(-sz, -sz * 0.5, sz * 1.4, sz * 0.8);
        ctx.fillStyle = PALETTE.chalkRoad; ctx.fillRect(-sz * 0.9, -sz * 0.9, sz * 1.2, sz * 0.45);
        ctx.fillStyle = "#2a1d12";
        ctx.beginPath(); ctx.arc(-sz * 0.6, sz * 0.35, sz * 0.25, 0, Math.PI * 2); ctx.arc(sz * 0.2, sz * 0.35, sz * 0.25, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#8a6a48"; ctx.beginPath(); ctx.ellipse(sz * 0.95, 0, sz * 0.45, sz * 0.28, 0, 0, Math.PI * 2); ctx.fill();
      } else if (kind === 1) {
        ctx.fillStyle = "#5c4a3a"; ctx.beginPath(); ctx.ellipse(0, 0, sz * 0.55, sz * 0.3, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = PALETTE.terracottaActive; ctx.fillRect(-sz * 0.35, -sz * 0.55, sz * 0.28, sz * 0.32);
        ctx.fillStyle = PALETTE.ochreMesa; ctx.fillRect(sz * 0.05, -sz * 0.55, sz * 0.28, sz * 0.32);
      } else if (kind === 2) {
        ctx.strokeStyle = "#3a2a1a"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, sz * 0.4); ctx.lineTo(0, -sz * 1.3); ctx.stroke();
        ctx.fillStyle = k % 8 === 2 ? PALETTE.terracottaGlow : PALETTE.mercuryCyan;
        ctx.beginPath(); ctx.moveTo(0, -sz * 1.3); ctx.lineTo(-sz * 0.9, -sz * 1.05 + Math.sin(t * 6 + k) * 2); ctx.lineTo(0, -sz * 0.8);
        ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = "#2a1a10";
        ctx.beginPath(); ctx.arc(0, -sz * 0.55, sz * 0.18, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-sz * 0.12, -sz * 0.4, sz * 0.24, sz * 0.6);
        ctx.fillRect(sz * 0.3, -sz * 0.35, sz * 0.18, sz * 0.5);
      }
      ctx.restore();
    }
  }

  /* ---------- casement window vista inset ---------- */
  function drawVista(ctx, kind, x, y, w, h, t) {
    const sky = ctx.createLinearGradient(0, y, 0, y + h);
    sky.addColorStop(0, kind === "cypress" ? "#d8c9b4" : "#e9c48e");
    sky.addColorStop(1, "#f3e3c4");
    ctx.fillStyle = sky; ctx.fillRect(x, y, w, h);
    const hz = y + h * 0.55;
    function poly(color, pts) {
      ctx.fillStyle = color; ctx.beginPath();
      pts.forEach(function (q, i) { if (i === 0) ctx.moveTo(x + q[0] * w, y + q[1] * h); else ctx.lineTo(x + q[0] * w, y + q[1] * h); });
      ctx.closePath(); ctx.fill();
    }
    if (kind === "gorge") {
      poly("#a2462a", [[0, 0.3], [0.38, 0.42], [0.42, 1], [0, 1]]);
      poly("#8b3a22", [[1, 0.25], [0.6, 0.4], [0.56, 1], [1, 1]]);
      ctx.strokeStyle = PALETTE.mercuryCyan; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(x + w * 0.5, y + h * 0.45);
      ctx.quadraticCurveTo(x + w * 0.42, y + h * 0.7, x + w * 0.52, y + h); ctx.stroke();
    } else if (kind === "viaduct") {
      poly("#9a8a5e", [[0, 0.6], [0.5, 0.52], [1, 0.6], [1, 1], [0, 1]]);
      ctx.fillStyle = "#cdbb94";
      ctx.fillRect(x, hz - h * 0.08, w, h * 0.05);
      ctx.fillStyle = "#e9d9b8";
      for (let i = 0; i < 7; i += 1) {
        ctx.beginPath(); ctx.arc(x + (i + 0.5) * w / 7, hz + h * 0.02, w / 18, Math.PI, 0); ctx.fill();
      }
      ctx.fillStyle = PALETTE.plateauGrass;
      for (let i = 0; i < 14; i += 1) { ctx.beginPath(); ctx.arc(x + (i % 7 + 0.3) * w / 7, y + h * (0.78 + Math.floor(i / 7) * 0.12), 2.2, 0, Math.PI * 2); ctx.fill(); }
    } else if (kind === "steppe") {
      poly("#efeae0", [[0, 0.62], [1, 0.58], [1, 1], [0, 1]]);
      poly("#d8cdb4", [[0.12, 0.62], [0.17, 0.46], [0.27, 0.46], [0.32, 0.61]]);
      poly("#cfc3a8", [[0.62, 0.59], [0.66, 0.5], [0.73, 0.5], [0.77, 0.59]]);
      ctx.strokeStyle = "rgba(120,110,90,0.4)"; ctx.lineWidth = 1;
      for (let i = 0; i < 4; i += 1) { ctx.beginPath(); ctx.moveTo(x + ((t * 0.05 + i * 0.27) % 1) * w, y + h * (0.2 + i * 0.07)); ctx.lineTo(x + ((t * 0.05 + i * 0.27) % 1) * w + w * 0.15, y + h * (0.2 + i * 0.07)); ctx.stroke(); }
    } else if (kind === "crossroads") {
      poly(PALETTE.plateauGrass, [[0, 0.5], [1, 0.5], [1, 1], [0, 1]]);
      ctx.strokeStyle = PALETTE.chalkRoad; ctx.lineWidth = 1.6;
      for (let i = 0; i < 6; i += 1) {
        const a = Math.PI * (0.05 + i * 0.18);
        ctx.beginPath(); ctx.moveTo(x + w * 0.5, y + h * 0.66);
        ctx.lineTo(x + w * 0.5 + Math.cos(a) * w * 0.7, y + h * 0.66 + Math.sin(a) * h * 0.5 - h * 0.05); ctx.stroke();
      }
      ctx.fillStyle = PALETTE.mercuryQuicksilver;
      ctx.beginPath(); ctx.ellipse(x + w * 0.5, y + h * 0.66, w * 0.09, h * 0.05, 0, 0, Math.PI * 2); ctx.fill();
    } else if (kind === "ravine") {
      poly("#e2d8c2", [[0, 0.35], [0.46, 1], [0, 1]]);
      poly("#d4c8ac", [[1, 0.3], [0.54, 1], [1, 1]]);
      poly("#9c9078", [[0.46, 1], [0.5, 0.62], [0.54, 1]]);
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      for (let i = 0; i < 3; i += 1) { ctx.beginPath(); ctx.ellipse(x + ((t * 0.03 + i * 0.35) % 1.2) * w, y + h * (0.15 + i * 0.08), w * 0.1, h * 0.04, 0, 0, Math.PI * 2); ctx.fill(); }
    } else if (kind === "cypress") {
      poly("#a88a5c", [[0.05, 0.62], [0.12, 0.42], [0.36, 0.42], [0.43, 0.62]]);
      poly("#9c7e52", [[0.57, 0.62], [0.64, 0.4], [0.88, 0.4], [0.95, 0.62]]);
      poly("#6f7a52", [[0, 0.62], [1, 0.62], [1, 1], [0, 1]]);
      ctx.fillStyle = "#2f3a22";
      [0.2, 0.28, 0.7, 0.8].forEach(function (cx, i) { ctx.beginPath(); ctx.moveTo(x + cx * w, y + h * (i < 2 ? 0.22 : 0.2)); ctx.lineTo(x + cx * w + 3, y + h * 0.42); ctx.lineTo(x + cx * w - 3, y + h * 0.42); ctx.closePath(); ctx.fill(); });
      ctx.fillStyle = "rgba(240,236,228," + (0.45 + 0.15 * Math.sin(t)).toFixed(3) + ")";
      ctx.fillRect(x, y + h * 0.6, w, h * 0.12);
    } else {
      ctx.fillStyle = "#f1cf72"; ctx.beginPath(); ctx.arc(x + w * 0.8, y + h * 0.2, h * 0.1, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 5; i += 1) {
        poly(i % 2 ? "#c8b48a" : "#b39a6c", [[0, 0.45 + i * 0.11], [1 - i * 0.08, 0.4 + i * 0.11], [1, 0.5 + i * 0.11], [1, 1], [0, 1]]);
      }
      ctx.fillStyle = PALETTE.plateauGrass;
      for (let i = 0; i < 8; i += 1) { ctx.beginPath(); ctx.arc(x + (0.08 + i * 0.1) * w, y + h * (0.52 + (i % 4) * 0.11), 2.2, 0, Math.PI * 2); ctx.fill(); }
    }
  }

  function drawWindowInset(ctx, L, city, t) {
    const iw = clamp(L.w * (L.portrait ? 0.34 : 0.17), 112, 230);
    const ih = iw * 0.6;
    const shutter = iw * 0.16;
    const x = 10 + shutter;
    const y = 10;
    ctx.save();
    ctx.fillStyle = "rgba(15,11,8,0.55)";
    ctx.fillRect(x - 4, y - 4, iw + 8, ih + 24);
    ctx.beginPath(); ctx.rect(x, y, iw, ih); ctx.clip();
    drawVista(ctx, city.vistaKind, x, y, iw, ih, t);
    ctx.restore();
    ctx.strokeStyle = "#5a3f28"; ctx.lineWidth = 4; ctx.strokeRect(x, y, iw, ih);
    ctx.strokeStyle = "#8a6440"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x + iw / 2, y); ctx.lineTo(x + iw / 2, y + ih * 0.12); ctx.stroke();
    [[x, -1], [x + iw, 1]].forEach(function (s) {
      ctx.fillStyle = "#6e4b2e";
      ctx.beginPath();
      ctx.moveTo(s[0], y); ctx.lineTo(s[0] + s[1] * shutter, y + ih * 0.08);
      ctx.lineTo(s[0] + s[1] * shutter, y + ih * 0.92); ctx.lineTo(s[0], y + ih); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#3e2a19"; ctx.lineWidth = 0.8;
      for (let k = 1; k < 6; k += 1) {
        ctx.beginPath(); ctx.moveTo(s[0], y + ih * k / 6); ctx.lineTo(s[0] + s[1] * shutter, y + ih * (0.08 + 0.84 * k / 6)); ctx.stroke();
      }
    });
    ctx.fillStyle = PALETTE.chalkRoad;
    ctx.font = Math.max(8, Math.round(iw * 0.058)) + "px Georgia, serif";
    ctx.textAlign = "left";
    const label = city.windowVista.length > 44 && iw < 150 ? city.windowVista.split(" & ")[0] : city.windowVista;
    ctx.fillText(label, x, y + ih + 14, iw);
  }

  /* ---------- engine ---------- */
  function createPlateauEngine(opts) {
    const options = opts || {};
    let reducedMotion = !!options.reducedMotion;
    let activeCityIndex = 0;
    let migrationEpoch = 0;
    let hoveredCityIndex = -1;
    let mercuryOverlay = true;
    let windowInsetOpen = true;
    let soundEnabled = false;
    let exodusState = { inProgress: false, fromIndex: 0, toIndex: 0, progress: 0, routeIndices: [0] };
    let clock = 0;
    const EXODUS_DURATION = 1.65;

    function getState() {
      return {
        activeCityIndex: activeCityIndex,
        activeCity: SISTER_CITIES[activeCityIndex],
        inhabitedCount: 1,
        emptyCount: 6,
        sisterCities: SISTER_CITIES.map(function (c) {
          return Object.assign({}, c, { isInhabited: c.index === activeCityIndex });
        }),
        exodusState: Object.assign({}, exodusState, { routeIndices: exodusState.routeIndices.slice() }),
        migrationEpoch: migrationEpoch,
        mercuryOverlay: mercuryOverlay,
        windowInsetOpen: windowInsetOpen,
        soundEnabled: soundEnabled,
        hoveredCityIndex: hoveredCityIndex,
        reducedMotion: reducedMotion
      };
    }
    function completeExodusNow() {
      if (exodusState.inProgress) {
        activeCityIndex = exodusState.toIndex;
        migrationEpoch += 1;
        exodusState.inProgress = false;
        exodusState.progress = 1;
        if (options.onMigrationComplete) {
          try {
            options.onMigrationComplete({
              fromIndex: exodusState.fromIndex,
              toIndex: activeCityIndex,
              migrationEpoch: migrationEpoch,
              activeCity: SISTER_CITIES[activeCityIndex]
            });
          } catch (err) { /* consumer errors must not break the plateau */ }
        }
      }
      return getState();
    }
    function playExodusCanon(fromIdx, toIdx, epoch) {
      const assignment = voiceAssignment(epoch);
      const result = { motif: CANON_MOTIF_HZ.slice(), voiceTimbres: assignment, fromIndex: fromIdx, toIndex: toIdx, epoch: epoch || 0 };
      const ac = getAudio();
      if (!ac) return result;
      try {
        if (ac.state === "suspended" && ac.resume) ac.resume();
        const t0 = ac.currentTime + 0.05;
        const noteDur = 0.34;
        for (let v = 0; v < 4; v += 1) {
          for (let n = 0; n < CANON_MOTIF_HZ.length; n += 1) {
            playVoice(ac, assignment[v], CANON_MOTIF_HZ[n], t0 + v * 0.42 + n * noteDur, noteDur);
          }
        }
        playYawnSighRaw(epoch, 0.05 + 3 * 0.42 + 4 * noteDur + 0.1);
      } catch (err) { /* silent fallback */ }
      return result;
    }
    function playYawnSigh(epoch) {
      return playYawnSighRaw(epoch === undefined ? migrationEpoch : epoch, 0.02);
    }
    function playRoutineTick(weariness) {
      const w = clamp(Number(weariness) || 0, 0, 1);
      const ac = getAudio();
      if (!ac || !soundEnabled) return { weariness: w };
      try {
        const t0 = ac.currentTime + 0.01;
        const o = ac.createOscillator();
        o.type = "triangle";
        o.frequency.setValueAtTime(880 - w * 420, t0);
        o.connect(envGain(ac, t0, 0.004, 0.08 + w * 0.06, 0.12));
        o.start(t0); o.stop(t0 + 0.25);
      } catch (err) { /* silent */ }
      return { weariness: w };
    }
    function startExodus(targetIndex) {
      if (exodusState.inProgress) completeExodusNow();
      let toIndex = targetIndex;
      if (typeof targetIndex !== "number" || !isFinite(targetIndex) || targetIndex < 0 || targetIndex > 6 || Math.floor(targetIndex) === activeCityIndex) {
        toIndex = (activeCityIndex + 1) % 7;
      }
      toIndex = Math.floor(toIndex);
      const routeIndices = findShortestRoadRoute(activeCityIndex, toIndex);
      exodusState = { inProgress: true, fromIndex: activeCityIndex, toIndex: toIndex, progress: 0, routeIndices: routeIndices };
      if (soundEnabled) playExodusCanon(activeCityIndex, toIndex, migrationEpoch + 1);
      if (reducedMotion) return completeExodusNow();
      return getState();
    }
    function step(dtSec, societyState) {
      const dt = clamp(Number(dtSec) || 0, 0, 0.25);
      clock += reducedMotion ? dt * 0.25 : dt;
      if (exodusState.inProgress) {
        exodusState.progress = Math.min(1, exodusState.progress + dt / EXODUS_DURATION);
        if (exodusState.progress >= 1) completeExodusNow();
      }
      return getState();
    }
    function warmthOf(i) {
      if (exodusState.inProgress) {
        const p = exodusState.progress;
        if (i === exodusState.fromIndex) return 1 - p;
        if (i === exodusState.toIndex) return p;
        return 0;
      }
      return i === activeCityIndex ? 1 : 0;
    }
    function render(ctx, width, height, societyState) {
      if (!ctx) return;
      const L = computeLayout(width, height);
      const wear = averageWeariness(societyState);
      ctx.save();
      drawGround(ctx, L, clock, wear);
      drawGroves(ctx, L);
      if (mercuryOverlay) drawMercuryBoard(ctx, L, clock);
      drawRoads(ctx, L, exodusState);
      const order = SISTER_CITIES.map(function (c) { return c.index; })
        .sort(function (a, b) { return SISTER_CITIES[a].ny - SISTER_CITIES[b].ny; });
      order.forEach(function (i) {
        drawCity(ctx, L, i, warmthOf(i), i === activeCityIndex, clock, migrationEpoch, i === hoveredCityIndex);
      });
      if (exodusState.inProgress) drawCaravan(ctx, L, exodusState, clock);
      if (windowInsetOpen) drawWindowInset(ctx, L, SISTER_CITIES[activeCityIndex], clock);
      ctx.restore();
    }
    function hitTest(normX, normY, width, height) {
      const L = computeLayout(width, height);
      const px = (Number(normX) || 0) * L.w;
      const py = (Number(normY) || 0) * L.h;
      let best = null;
      let bestD = Infinity;
      for (let i = 0; i < 7; i += 1) {
        const p = L.pts[i];
        const d = Math.hypot(px - p.x, (py - p.y) / 0.85);
        if (d < L.r * 1.3 && d < bestD) { bestD = d; best = i; }
      }
      if (best === null) return null;
      return { kind: "mesa", cityIndex: best, city: SISTER_CITIES[best], isInhabited: best === activeCityIndex };
    }
    function unlockAudio() {
      const ac = getAudio();
      if (ac && ac.state === "suspended" && ac.resume) {
        try { ac.resume(); } catch (err) { /* ignore */ }
      }
      return !!ac;
    }
    function setSoundEnabled(on) {
      soundEnabled = !!on;
      if (soundEnabled) unlockAudio();
      return getState();
    }
    function setHoveredCity(idx) {
      hoveredCityIndex = typeof idx === "number" && idx >= 0 && idx <= 6 ? Math.floor(idx) : -1;
      return getState();
    }
    function setMercuryOverlay(on) { mercuryOverlay = !!on; return getState(); }
    function setWindowInsetOpen(on) { windowInsetOpen = !!on; return getState(); }
    function setReducedMotion(on) {
      reducedMotion = !!on;
      if (reducedMotion && exodusState.inProgress) completeExodusNow();
      return getState();
    }
    function reset() {
      activeCityIndex = 0;
      migrationEpoch = 0;
      hoveredCityIndex = -1;
      mercuryOverlay = true;
      windowInsetOpen = true;
      exodusState = { inProgress: false, fromIndex: 0, toIndex: 0, progress: 0, routeIndices: [0] };
      clock = 0;
      return getState();
    }

    return {
      startExodus: startExodus,
      completeExodusNow: completeExodusNow,
      step: step,
      render: render,
      hitTest: hitTest,
      unlockAudio: unlockAudio,
      setSoundEnabled: setSoundEnabled,
      playExodusCanon: playExodusCanon,
      playYawnSigh: playYawnSigh,
      playRoutineTick: playRoutineTick,
      setHoveredCity: setHoveredCity,
      setMercuryOverlay: setMercuryOverlay,
      setWindowInsetOpen: setWindowInsetOpen,
      setReducedMotion: setReducedMotion,
      reset: reset,
      getState: getState
    };
  }

  const api = Object.freeze({
    PALETTE: PALETTE,
    SISTER_CITIES: SISTER_CITIES,
    PLATEAU_ROADS: PLATEAU_ROADS,
    CANON_MOTIF_HZ: CANON_MOTIF_HZ,
    VOICE_TIMBRES: VOICE_TIMBRES,
    findShortestRoadRoute: findShortestRoadRoute,
    voiceAssignment: voiceAssignment,
    createPlateauEngine: createPlateauEngine
  });
  globalThis.EutropiaPlateauCities = api;
  if (typeof window !== "undefined") window.EutropiaPlateauCities = api;
})();
