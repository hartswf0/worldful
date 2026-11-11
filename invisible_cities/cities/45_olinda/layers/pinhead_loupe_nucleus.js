/* OLINDA (City 45) - layers/pinhead_loupe_nucleus.js
 * Stone 1: "Go out into Olinda with a magnifying glass and seek carefully:
 * somewhere a point no bigger than the head of a pin, slightly enlarged,
 * reveals roofs, antennas, skylights, gardens, pools, streamers across
 * streets, kiosks in squares, and a horse-racing track."
 * Owner: olinda-lens-botanist. Classic browser IIFE on globalThis.
 */
globalThis.OlindaPinheadLoupe = (function () {
  'use strict';

  var PALETTE = {
    loamNight: '#14110c', barkUmber: '#3b2a1a', cambiumAmber: '#d9a441',
    sapwoodCream: '#efe1bf', brassLoupe: '#c8a24a', lensGlassCyan: '#9fd3d6',
    terracottaRoof: '#c0583a', gardenMoss: '#6f8f4a', poolTeal: '#3f8f9a',
    streamerCarmine: '#d23c4f', turfTrackGreen: '#5f9a3c', girdleSlate: '#8a8578'
  };
  var PINHEAD_FEATURES = ['roofs', 'antennas', 'skylights', 'gardens', 'pools',
    'street_streamers', 'square_kiosks', 'horse_racing_track'];
  /* Discovery thresholds (lens over nucleus + zoom >= threshold). All eight
   * are discovered by REVEAL_ZOOM; visual fade-in runs th*0.5 .. th*1.6. */
  var FEATURE_THRESHOLDS = {
    roofs: 4, gardens: 4.5, pools: 5, antennas: 5.5, skylights: 6,
    square_kiosks: 6.5, street_streamers: 7, horse_racing_track: 8
  };
  var ZOOM_MIN = 1, ZOOM_MAX = 64, REVEAL_ZOOM = 8;
  var OFFSET_GAIN = 1.5, COVER_FRACTION = 0.6, TAU = Math.PI * 2;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function clamp01(v) { return clamp(v, 0, 1); }
  function smooth(a, b, x) { var t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); }
  function num(v, d) { return (typeof v === 'number' && isFinite(v)) ? v : d; }
  function rgba(hex, a) {
    var n = parseInt(String(hex).replace('#', ''), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + clamp01(a).toFixed(3) + ')';
  }
  function hash2(i, j) { var s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s); }
  function mulberry32(seed) {
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- miniature city layout (unit disk, radius 1) ---------- */
  var TRACK = { x: 0.30, y: 0.30, rx: 0.40, ry: 0.22 };
  var SQUARES = [{ x: -0.40, y: -0.30, s: 0.15 }, { x: 0.32, y: -0.44, s: 0.12 }, { x: -0.46, y: 0.40, s: 0.11 }];
  var CELL = 0.22, STREET = 0.06;
  var COATS = ['#5a3a22', '#2a1d14', '#8b5a2b', '#d8c9a8', '#6b4a30', '#3a2a20', '#a0703f'];
  var SILKS = [PALETTE.streamerCarmine, PALETTE.lensGlassCyan, PALETTE.cambiumAmber, PALETTE.sapwoodCream,
    PALETTE.poolTeal, PALETTE.terracottaRoof, PALETTE.gardenMoss];

  function inTrack(x, y, m) {
    var dx = (x - TRACK.x) / (TRACK.rx + m), dy = (y - TRACK.y) / (TRACK.ry + m);
    return dx * dx + dy * dy < 1;
  }
  function inSquare(x, y, m) {
    for (var i = 0; i < SQUARES.length; i++) {
      var q = SQUARES[i];
      if (Math.abs(x - q.x) < q.s + m && Math.abs(y - q.y) < q.s + m) return true;
    }
    return false;
  }

  function buildCity() {
    var rnd = mulberry32(45045);
    var c = { buildings: [], gardens: [], pools: [], streamers: [], kiosks: [], horses: [] };
    var b = (CELL - STREET) / 2, gx, gy, i;
    for (gx = -5; gx <= 4; gx++) {
      for (gy = -5; gy <= 4; gy++) {
        var cx = (gx + 0.5) * CELL, cy = (gy + 0.5) * CELL;
        if (Math.sqrt(cx * cx + cy * cy) > 0.84) continue;
        if (inTrack(cx, cy, 0.07) || inSquare(cx, cy, 0.07)) continue;
        var r = rnd();
        if (r < 0.13) {
          var trees = [];
          for (i = 0; i < 5; i++) trees.push({ x: (rnd() - 0.5) * b * 1.5, y: (rnd() - 0.5) * b * 1.5, r: b * (0.16 + rnd() * 0.14) });
          c.gardens.push({ x: cx, y: cy, s: b, trees: trees });
        } else if (r < 0.22) {
          c.pools.push({ x: cx, y: cy, s: b, w: 0.55 + rnd() * 0.25, h: 0.35 + rnd() * 0.25 });
        } else {
          var nx = r < 0.6 ? 2 : 1, ny = (r < 0.45 || r > 0.85) ? 2 : 1;
          var bw = (2 * b) / nx, bh = (2 * b) / ny;
          for (var ix = 0; ix < nx; ix++) {
            for (var iy = 0; iy < ny; iy++) {
              c.buildings.push({
                x: cx - b + ix * bw + 0.006, y: cy - b + iy * bh + 0.006, w: bw - 0.012, h: bh - 0.012,
                shade: rnd(), sky: rnd() < 0.45, ant: rnd() < 0.35, antA: rnd() * TAU
              });
            }
          }
        }
      }
    }
    for (var k = -4; k <= 4; k++) {
      for (var j = -5; j <= 4; j++) {
        var along = (j + 0.5) * CELL, across = k * CELL;
        for (var o = 0; o < 2; o++) {
          var sx = o ? across : along, sy = o ? along : across;
          if (Math.sqrt(sx * sx + sy * sy) > 0.8 || inTrack(sx, sy, 0.05) || inSquare(sx, sy, 0.03)) continue;
          if (rnd() < 0.32) c.streamers.push({ x: sx, y: sy, horiz: !o, phase: rnd() * TAU });
        }
      }
    }
    SQUARES.forEach(function (q, qi) {
      var n = 2 + (qi === 0 ? 1 : 0);
      for (var m = 0; m < n; m++) {
        var a = (m / n) * TAU + qi;
        c.kiosks.push({ x: q.x + Math.cos(a) * q.s * 0.5, y: q.y + Math.sin(a) * q.s * 0.5,
          r: 0.028, rot: rnd() * TAU, silk: SILKS[(qi + m) % SILKS.length] });
      }
    });
    for (i = 0; i < 7; i++) {
      c.horses.push({ a0: (i / 7) * TAU * 0.35 + rnd() * 0.2, lane: 0.2 + (i % 4) * 0.2,
        speed: 0.5 + rnd() * 0.22, coat: COATS[i], silk: SILKS[i] });
    }
    return c;
  }
  var CITY = buildCity();

  /* ---------- miniature city drawing (unit space; u = one screen px) ---------- */
  function drawCity(ctx, S, alphaOf, motionT, glint) {
    var u = 1 / S, cityA = smooth(1.6, 5, alphaOf.zoom), i;
    ctx.save();
    ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.clip();
    if (cityA > 0.01) {
      ctx.globalAlpha = cityA;
      var g = ctx.createRadialGradient(0, 0, 0.1, 0, 0, 1);
      g.addColorStop(0, '#8a7350'); g.addColorStop(1, '#5e4a30');
      ctx.fillStyle = g; ctx.fillRect(-1, -1, 2, 2);
      ctx.fillStyle = rgba(PALETTE.sapwoodCream, 0.85);
      SQUARES.forEach(function (q) { ctx.fillRect(q.x - q.s, q.y - q.s, q.s * 2, q.s * 2); });
      ctx.strokeStyle = rgba(PALETTE.girdleSlate, 0.6); ctx.lineWidth = Math.max(u * 0.6, 0.004);
      SQUARES.forEach(function (q) { ctx.strokeRect(q.x - q.s * 0.92, q.y - q.s * 0.92, q.s * 1.84, q.s * 1.84); });
    }
    drawTrack(ctx, u, alphaOf.horse_racing_track * cityA, motionT);
    drawGreens(ctx, u, alphaOf.gardens * cityA, alphaOf.pools * cityA, glint);
    drawRoofs(ctx, u, alphaOf, cityA, motionT);
    drawKiosks(ctx, u, alphaOf.square_kiosks * cityA);
    drawStreamers(ctx, u, alphaOf.street_streamers * cityA, motionT);
    if (cityA > 0.01) {
      ctx.globalAlpha = cityA;
      ctx.strokeStyle = rgba(PALETTE.sapwoodCream, 0.8); ctx.lineWidth = Math.max(u * 1.2, 0.035);
      ctx.beginPath(); ctx.arc(0, 0, 0.975, 0, TAU); ctx.stroke();
      ctx.strokeStyle = rgba(PALETTE.barkUmber, 0.9); ctx.lineWidth = Math.max(u * 0.6, 0.01);
      ctx.beginPath(); ctx.arc(0, 0, 0.95, 0, TAU); ctx.stroke();
    }
    ctx.restore();
    /* unresolved bead: the pinhead before it blossoms into a city */
    var beadA = 1 - cityA * 0.92;
    if (beadA > 0.01) {
      ctx.save(); ctx.globalAlpha = beadA;
      var bg = ctx.createRadialGradient(-0.3, -0.3, 0.05, 0, 0, 1);
      bg.addColorStop(0, PALETTE.sapwoodCream); bg.addColorStop(0.45, PALETTE.cambiumAmber); bg.addColorStop(1, PALETTE.barkUmber);
      ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(0, 0, 1, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(PALETTE.barkUmber, 0.6); ctx.lineWidth = Math.max(u, 0.02);
      for (i = 1; i <= 3; i++) { ctx.beginPath(); ctx.arc(0, 0, i * 0.24, 0, TAU); ctx.stroke(); }
      ctx.restore();
    }
  }

  function drawTrack(ctx, u, a, t) {
    if (a <= 0.01) return;
    var T = TRACK, i;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(T.x, T.y);
    ctx.fillStyle = PALETTE.turfTrackGreen;
    ctx.beginPath(); ctx.ellipse(0, 0, T.rx, T.ry, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#c9a877';
    ctx.beginPath(); ctx.ellipse(0, 0, T.rx * 0.93, T.ry * 0.88, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = PALETTE.turfTrackGreen;
    ctx.beginPath(); ctx.ellipse(0, 0, T.rx * 0.7, T.ry * 0.52, 0, 0, TAU); ctx.fill();
    ctx.strokeStyle = rgba(PALETTE.sapwoodCream, 0.95); ctx.lineWidth = Math.max(u * 0.5, 0.004);
    ctx.beginPath(); ctx.ellipse(0, 0, T.rx * 0.93, T.ry * 0.88, 0, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(0, 0, T.rx * 0.7, T.ry * 0.52, 0, 0, TAU); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(T.rx * 0.7, 0); ctx.lineTo(T.rx * 0.93, 0); ctx.stroke();
    ctx.fillStyle = rgba(PALETTE.terracottaRoof, 0.9);
    ctx.fillRect(-T.rx * 0.25, -T.ry * 1.12, T.rx * 0.5, T.ry * 0.16);
    for (i = 0; i < CITY.horses.length; i++) {
      var h = CITY.horses[i], ang = h.a0 - t * h.speed;
      var k = 0.71 + h.lane * 0.2, rx = T.rx * k, ry = T.ry * (0.53 + h.lane * 0.33);
      var x = Math.cos(ang) * rx, y = Math.sin(ang) * ry;
      var dir = Math.atan2(-Math.cos(ang) * ry, Math.sin(ang) * rx);
      var L = 0.024;
      ctx.save(); ctx.translate(x, y); ctx.rotate(dir);
      if (L / u < 1.2) {
        ctx.fillStyle = h.coat; ctx.beginPath(); ctx.arc(0, 0, Math.max(L * 0.5, u * 0.6), 0, TAU); ctx.fill();
      } else {
        var gait = Math.sin(t * 14 + i * 1.7) * L * 0.25;
        ctx.strokeStyle = h.coat; ctx.lineWidth = L * 0.12;
        ctx.beginPath();
        ctx.moveTo(L * 0.3, 0); ctx.lineTo(L * 0.3 + gait, L * 0.42);
        ctx.moveTo(L * 0.3, 0); ctx.lineTo(L * 0.3 - gait, -L * 0.42);
        ctx.moveTo(-L * 0.3, 0); ctx.lineTo(-L * 0.3 - gait, L * 0.42);
        ctx.moveTo(-L * 0.3, 0); ctx.lineTo(-L * 0.3 + gait, -L * 0.42);
        ctx.stroke();
        ctx.fillStyle = h.coat;
        ctx.beginPath(); ctx.ellipse(0, 0, L * 0.5, L * 0.2, 0, 0, TAU); ctx.fill();
        ctx.beginPath(); ctx.ellipse(L * 0.62, 0, L * 0.18, L * 0.1, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = h.silk; ctx.beginPath(); ctx.arc(L * 0.05, 0, L * 0.16, 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  function drawGreens(ctx, u, ga, pa, glint) {
    var i, j;
    if (ga > 0.01) {
      ctx.save(); ctx.globalAlpha = ga;
      for (i = 0; i < CITY.gardens.length; i++) {
        var gd = CITY.gardens[i];
        ctx.fillStyle = PALETTE.gardenMoss; ctx.fillRect(gd.x - gd.s, gd.y - gd.s, gd.s * 2, gd.s * 2);
        for (j = 0; j < gd.trees.length; j++) {
          var tr = gd.trees[j];
          ctx.fillStyle = 'rgba(30,40,18,0.45)';
          ctx.beginPath(); ctx.arc(gd.x + tr.x + tr.r * 0.25, gd.y + tr.y + tr.r * 0.25, tr.r, 0, TAU); ctx.fill();
          ctx.fillStyle = j % 2 ? '#4f6e33' : '#86a85a';
          ctx.beginPath(); ctx.arc(gd.x + tr.x, gd.y + tr.y, tr.r, 0, TAU); ctx.fill();
        }
      }
      ctx.restore();
    }
    if (pa > 0.01) {
      ctx.save(); ctx.globalAlpha = pa;
      for (i = 0; i < CITY.pools.length; i++) {
        var p = CITY.pools[i], pw = p.s * 2 * p.w, ph = p.s * 2 * p.h;
        ctx.fillStyle = '#9aa77a'; ctx.fillRect(p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
        ctx.fillStyle = PALETTE.sapwoodCream; ctx.fillRect(p.x - pw / 2 - 0.008, p.y - ph / 2 - 0.008, pw + 0.016, ph + 0.016);
        ctx.fillStyle = PALETTE.poolTeal; ctx.fillRect(p.x - pw / 2, p.y - ph / 2, pw, ph);
        ctx.strokeStyle = rgba(PALETTE.lensGlassCyan, 0.5 + 0.4 * glint); ctx.lineWidth = Math.max(u * 0.5, 0.004);
        ctx.beginPath(); ctx.moveTo(p.x - pw * 0.35, p.y - ph * 0.15); ctx.lineTo(p.x + pw * 0.1, p.y - ph * 0.15);
        ctx.moveTo(p.x - pw * 0.1, p.y + ph * 0.15); ctx.lineTo(p.x + pw * 0.3, p.y + ph * 0.15); ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawRoofs(ctx, u, A, cityA, t) {
    var ra = A.roofs * cityA, sa = A.skylights * cityA, aa = A.antennas * cityA, i, b;
    var lw = Math.max(u * 0.5, 0.003);
    if (ra > 0.01) {
      ctx.save(); ctx.globalAlpha = ra;
      for (i = 0; i < CITY.buildings.length; i++) {
        b = CITY.buildings[i];
        ctx.fillStyle = 'rgba(20,17,12,0.35)'; ctx.fillRect(b.x + 0.008, b.y + 0.008, b.w, b.h);
        ctx.fillStyle = b.shade < 0.33 ? '#a94a30' : (b.shade < 0.66 ? PALETTE.terracottaRoof : '#d0704e');
        ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = 'rgba(70,28,18,0.7)'; ctx.lineWidth = lw;
        ctx.beginPath();
        if (b.w >= b.h) { ctx.moveTo(b.x + b.h * 0.3, b.y + b.h / 2); ctx.lineTo(b.x + b.w - b.h * 0.3, b.y + b.h / 2); }
        else { ctx.moveTo(b.x + b.w / 2, b.y + b.w * 0.3); ctx.lineTo(b.x + b.w / 2, b.y + b.h - b.w * 0.3); }
        ctx.stroke();
        if (u < 0.006) {
          ctx.strokeStyle = 'rgba(70,28,18,0.25)';
          ctx.beginPath();
          for (var s = 1; s < 5; s++) {
            if (b.w >= b.h) { ctx.moveTo(b.x + b.w * s / 5, b.y); ctx.lineTo(b.x + b.w * s / 5, b.y + b.h); }
            else { ctx.moveTo(b.x, b.y + b.h * s / 5); ctx.lineTo(b.x + b.w, b.y + b.h * s / 5); }
          }
          ctx.stroke();
        }
      }
      ctx.restore();
    }
    if (sa > 0.01) {
      ctx.save(); ctx.globalAlpha = sa;
      for (i = 0; i < CITY.buildings.length; i++) {
        b = CITY.buildings[i]; if (!b.sky) continue;
        var sw = Math.min(b.w, b.h) * 0.28, sx = b.x + b.w * 0.22, sy = b.y + b.h * 0.22;
        ctx.fillStyle = PALETTE.lensGlassCyan; ctx.fillRect(sx, sy, sw, sw);
        ctx.strokeStyle = rgba(PALETTE.sapwoodCream, 0.9); ctx.lineWidth = lw; ctx.strokeRect(sx, sy, sw, sw);
        ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(sx, sy, sw * 0.4, sw * 0.4);
      }
      ctx.restore();
    }
    if (aa > 0.01) {
      ctx.save(); ctx.globalAlpha = aa;
      ctx.strokeStyle = '#2a2018'; ctx.lineWidth = Math.max(u * 0.7, 0.003); ctx.lineCap = 'round';
      for (i = 0; i < CITY.buildings.length; i++) {
        b = CITY.buildings[i]; if (!b.ant) continue;
        var ax = b.x + b.w * 0.72, ay = b.y + b.h * 0.7, al = 0.05, ca = Math.cos(b.antA), sn = Math.sin(b.antA);
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + 0.03, ay - al);
        for (var c = 1; c <= 3; c++) {
          var px = ax + 0.03 * c / 3.5, py = ay - al * c / 3.5, cl = 0.022 * (1.2 - c * 0.25);
          ctx.moveTo(px - ca * cl, py - sn * cl); ctx.lineTo(px + ca * cl, py + sn * cl);
        }
        ctx.stroke();
        ctx.fillStyle = rgba(PALETTE.streamerCarmine, 0.5 + 0.5 * Math.sin(t * 3 + i));
        ctx.beginPath(); ctx.arc(ax + 0.03, ay - al, Math.max(u * 0.8, 0.005), 0, TAU); ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawKiosks(ctx, u, a) {
    if (a <= 0.01) return;
    ctx.save(); ctx.globalAlpha = a;
    for (var i = 0; i < CITY.kiosks.length; i++) {
      var k = CITY.kiosks[i];
      ctx.save(); ctx.translate(k.x, k.y); ctx.rotate(k.rot);
      ctx.fillStyle = 'rgba(20,17,12,0.3)'; ctx.beginPath(); ctx.arc(0.006, 0.006, k.r, 0, TAU); ctx.fill();
      for (var s = 0; s < 8; s++) {
        ctx.fillStyle = s % 2 ? PALETTE.sapwoodCream : k.silk;
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(s / 8 * TAU) * k.r, Math.sin(s / 8 * TAU) * k.r);
        ctx.lineTo(Math.cos((s + 1) / 8 * TAU) * k.r, Math.sin((s + 1) / 8 * TAU) * k.r);
        ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = PALETTE.brassLoupe; ctx.beginPath(); ctx.arc(0, 0, k.r * 0.18, 0, TAU); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawStreamers(ctx, u, a, t) {
    if (a <= 0.01) return;
    var span = STREET * 0.75, lw = Math.max(u * 0.5, 0.0025);
    ctx.save(); ctx.globalAlpha = a;
    for (var i = 0; i < CITY.streamers.length; i++) {
      var s = CITY.streamers[i];
      ctx.save(); ctx.translate(s.x, s.y); if (s.horiz) ctx.rotate(Math.PI / 2);
      var sag = 0.006 + 0.003 * Math.sin(t * 2.4 + s.phase);
      ctx.strokeStyle = rgba(PALETTE.sapwoodCream, 0.9); ctx.lineWidth = lw;
      ctx.beginPath(); ctx.moveTo(-span, 0); ctx.quadraticCurveTo(0, sag * 2, span, 0); ctx.stroke();
      for (var f = 0; f < 5; f++) {
        var fx = -span + (f + 0.5) * (2 * span / 5), fy = sag * (1 - Math.pow(fx / span, 2));
        var fl = 0.012 * (1 + 0.25 * Math.sin(t * 6 + s.phase + f));
        ctx.fillStyle = f % 2 ? PALETTE.cambiumAmber : PALETTE.streamerCarmine;
        ctx.beginPath(); ctx.moveTo(fx - 0.006, fy); ctx.lineTo(fx + 0.006, fy); ctx.lineTo(fx, fy + fl); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }

  /* ---------- lens drawing (screen space) ---------- */
  function magnification(z) { return Math.pow(z, 1.4); }

  function drawPinhead(ctx, x, y, glint) {
    ctx.save();
    var g = ctx.createRadialGradient(x, y, 0, x, y, 7);
    g.addColorStop(0, rgba(PALETTE.cambiumAmber, 0.45)); g.addColorStop(1, rgba(PALETTE.cambiumAmber, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill();
    ctx.fillStyle = PALETTE.sapwoodCream; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, TAU); ctx.fill();
    var L = 2.5 + 4 * glint;
    ctx.strokeStyle = 'rgba(255,248,225,' + (0.25 + 0.65 * glint).toFixed(3) + ')';
    ctx.lineWidth = 0.8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - L, y); ctx.lineTo(x + L, y); ctx.moveTo(x, y - L); ctx.lineTo(x, y + L); ctx.stroke();
    ctx.restore();
  }

  function roundedPath(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath();
  }

  function drawHandle(ctx, lx, ly, r) {
    ctx.save(); ctx.translate(lx, ly); ctx.rotate(Math.PI / 4);
    var x0 = r * 1.02, cw = r * 0.18, hw = r * 0.82, th = r * 0.2;
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; roundedPath(ctx, x0 + 6, -th / 2 + 6, cw + hw, th, th / 2); ctx.fill();
    var bg = ctx.createLinearGradient(0, -th / 2, 0, th / 2);
    bg.addColorStop(0, '#f0d58a'); bg.addColorStop(0.5, PALETTE.brassLoupe); bg.addColorStop(1, '#6e5320');
    ctx.fillStyle = bg; roundedPath(ctx, x0, -th * 0.38, cw, th * 0.76, th * 0.15); ctx.fill();
    var wg = ctx.createLinearGradient(0, -th / 2, 0, th / 2);
    wg.addColorStop(0, '#6b4a2c'); wg.addColorStop(0.45, PALETTE.barkUmber); wg.addColorStop(1, '#1d140c');
    ctx.fillStyle = wg; roundedPath(ctx, x0 + cw, -th / 2, hw, th, th / 2); ctx.fill();
    ctx.strokeStyle = 'rgba(239,225,191,0.18)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0 + cw + th * 0.4, -th * 0.28); ctx.lineTo(x0 + cw + hw - th * 0.5, -th * 0.28); ctx.stroke();
    ctx.restore();
  }

  function drawMagnified(ctx, st, lx, ly, nx, ny, r, alphaOf, glint) {
    var m = magnification(st.zoom), ndx = lx + (nx - lx) * OFFSET_GAIN, ndy = ly + (ny - ly) * OFFSET_GAIN;
    var bg = ctx.createRadialGradient(lx, ly, r * 0.1, lx, ly, r);
    bg.addColorStop(0, '#2a2117'); bg.addColorStop(1, PALETTE.loamNight);
    ctx.fillStyle = bg; ctx.fillRect(lx - r, ly - r, r * 2, r * 2);
    /* magnified loam grain, anchored to the nucleus */
    var gs = 12 * m, i0 = Math.floor((lx - r - ndx) / gs), i1 = Math.ceil((lx + r - ndx) / gs);
    var j0 = Math.floor((ly - r - ndy) / gs), j1 = Math.ceil((ly + r - ndy) / gs);
    if ((i1 - i0) * (j1 - j0) < 1600) {
      var sz = Math.max(0.6, 0.7 * Math.sqrt(m));
      for (var i = i0; i <= i1; i++) {
        for (var j = j0; j <= j1; j++) {
          var h = hash2(i, j);
          ctx.fillStyle = h < 0.5 ? 'rgba(239,225,191,0.10)' : 'rgba(217,164,65,0.12)';
          ctx.fillRect(ndx + (i + hash2(j, i)) * gs, ndy + (j + h) * gs, sz * (0.6 + h), sz * (0.6 + h));
        }
      }
    }
    var S = Math.max(1.4, r * 0.014) * m;
    if (S < 0.8) return;
    ctx.save(); ctx.translate(ndx, ndy);
    var halo = ctx.createRadialGradient(0, 0, S * 0.9, 0, 0, S * 1.35);
    halo.addColorStop(0, rgba(PALETTE.cambiumAmber, 0.35 * glint + 0.1)); halo.addColorStop(1, rgba(PALETTE.cambiumAmber, 0));
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(0, 0, S * 1.35, 0, TAU); ctx.fill();
    ctx.scale(S, S);
    drawCity(ctx, S, alphaOf, st.motionT, glint);
    ctx.restore();
  }

  function drawOptics(ctx, lx, ly, r) {
    ctx.fillStyle = rgba(PALETTE.lensGlassCyan, 0.06); ctx.fillRect(lx - r, ly - r, r * 2, r * 2);
    var v = ctx.createRadialGradient(lx, ly, r * 0.68, lx, ly, r);
    v.addColorStop(0, 'rgba(20,17,12,0)'); v.addColorStop(1, 'rgba(20,17,12,0.5)');
    ctx.fillStyle = v; ctx.fillRect(lx - r, ly - r, r * 2, r * 2);
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = 'rgba(210,60,79,0.28)'; ctx.beginPath(); ctx.arc(lx + 1.2, ly + 0.6, r - 2.5, 0, TAU); ctx.stroke();
    ctx.strokeStyle = rgba(PALETTE.lensGlassCyan, 0.35); ctx.beginPath(); ctx.arc(lx - 1.2, ly - 0.6, r - 2.5, 0, TAU); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = rgba(PALETTE.lensGlassCyan, 0.12);
    ctx.beginPath(); ctx.arc(lx, ly, r * 0.9, 0, TAU); ctx.stroke();
    ctx.lineCap = 'round'; ctx.lineWidth = Math.max(2, r * 0.06); ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.beginPath(); ctx.arc(lx, ly, r * 0.78, Math.PI * 1.08, Math.PI * 1.55); ctx.stroke();
    ctx.lineWidth = Math.max(1, r * 0.025); ctx.strokeStyle = 'rgba(255,255,255,0.16)';
    ctx.beginPath(); ctx.arc(lx, ly, r * 0.66, Math.PI * 1.15, Math.PI * 1.35); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath(); ctx.arc(lx - r * 0.42, ly - r * 0.5, Math.max(1.5, r * 0.035), 0, TAU); ctx.fill();
  }

  function drawRim(ctx, lx, ly, r, revealed) {
    var w = Math.max(4, r * 0.11);
    var g = ctx.createLinearGradient(lx - r, ly - r, lx + r, ly + r);
    g.addColorStop(0, '#f3dc96'); g.addColorStop(0.45, PALETTE.brassLoupe); g.addColorStop(1, '#5e4519');
    ctx.strokeStyle = g; ctx.lineWidth = w;
    ctx.beginPath(); ctx.arc(lx, ly, r + w / 2, 0, TAU); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(20,17,12,0.8)';
    ctx.beginPath(); ctx.arc(lx, ly, r, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,240,200,0.55)';
    ctx.beginPath(); ctx.arc(lx, ly, r + w, Math.PI * 0.95, Math.PI * 1.7); ctx.stroke();
    ctx.strokeStyle = 'rgba(59,42,26,0.55)';
    ctx.beginPath();
    for (var i = 0; i < 64; i++) {
      var a = i / 64 * TAU, c = Math.cos(a), s = Math.sin(a), k = i % 8 === 0 ? 0.75 : 0.4;
      ctx.moveTo(lx + c * (r + w * (1 - k)), ly + s * (r + w * (1 - k))); ctx.lineTo(lx + c * (r + w), ly + s * (r + w));
    }
    ctx.stroke();
    if (revealed) {
      ctx.strokeStyle = rgba(PALETTE.cambiumAmber, 0.7); ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(lx, ly, r + w + 3, 0, TAU); ctx.stroke();
    }
  }

  /* ---------- the loupe instance ---------- */
  var CHIME_BASE = [1046.5, 1174.66, 1318.51, 1567.98, 1760, 2093, 2349.32, 2637.02];

  function createLoupe(opts) {
    opts = opts || {};
    var st = { lensX: 0.62, lensY: 0.58, zoom: 1, nucleusX: 0.5, nucleusY: 0.5, revealed: false,
      muted: false, motionT: 0, glintT: 0 };
    var disc = {}, order = [], lastW = 1000, lastH = 1000, lastR = 150, lastChime = {};
    var audio = { ctx: null, master: null };
    var autoChime = opts.autoChime !== false;

    function call(fn, v) { if (typeof fn === 'function') { try { fn(v); } catch (e) { /* host error ignored */ } } }
    function lensRadiusPx(w, h, ro) {
      if (ro && typeof ro.lensRadius === 'number' && ro.lensRadius > 0) return ro.lensRadius;
      return clamp(Math.min(w, h) * 0.15, 40, 220);
    }
    function lensDistPx(nx, ny) {
      var dx = (nx - st.lensX) * lastW, dy = (ny - st.lensY) * lastH;
      return Math.sqrt(dx * dx + dy * dy);
    }
    function covered() { return lensDistPx(st.nucleusX, st.nucleusY) < lastR * COVER_FRACTION; }
    function alphaOf() {
      var A = { zoom: st.zoom };
      PINHEAD_FEATURES.forEach(function (f) { var th = FEATURE_THRESHOLDS[f]; A[f] = smooth(th * 0.5, th * 1.6, st.zoom); });
      return A;
    }
    function evaluate() {
      var cov = covered();
      st.revealed = cov && st.zoom >= REVEAL_ZOOM;
      if (!cov) return;
      var fresh = [];
      PINHEAD_FEATURES.forEach(function (f) {
        if (!disc[f] && st.zoom >= FEATURE_THRESHOLDS[f]) { disc[f] = true; order.push(f); fresh.push(f); }
      });
      fresh.forEach(function (f, i) {
        if (autoChime) chime(f, i * 0.11);
        call(opts.onDiscover, f);
      });
    }

    /* ---- WebAudio: crystalline optical / clockwork ---- */
    function unlockAudio() {
      try {
        if (!audio.ctx) {
          var AC = globalThis.AudioContext || globalThis.webkitAudioContext;
          if (!AC) return false;
          audio.ctx = new AC();
          audio.master = audio.ctx.createGain();
          audio.master.gain.value = st.muted ? 0 : 0.5;
          audio.master.connect(audio.ctx.destination);
        }
        if (audio.ctx.state === 'suspended' && audio.ctx.resume) audio.ctx.resume();
        return true;
      } catch (e) { return false; }
    }
    function ready() { return !!(audio.ctx && audio.master && !st.muted); }
    function setMuted(b) {
      st.muted = !!b;
      try { if (audio.master) audio.master.gain.setTargetAtTime(st.muted ? 0 : 0.5, audio.ctx.currentTime, 0.02); } catch (e) { /* noop */ }
    }
    function playFocusClick(z) {
      if (!ready()) return false;
      try {
        var ac = audio.ctx, t = ac.currentTime, zz = clamp(num(z, st.zoom), ZOOM_MIN, ZOOM_MAX);
        var f = 1400 * Math.pow(2, (Math.log(zz) / Math.LN2) / 3);
        var o = ac.createOscillator(), g = ac.createGain();
        o.type = 'triangle'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * 0.6, t + 0.04);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.22, t + 0.002);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
        o.connect(g); g.connect(audio.master); o.start(t); o.stop(t + 0.08);
        var len = Math.max(1, Math.floor(ac.sampleRate * 0.02)), buf = ac.createBuffer(1, len, ac.sampleRate);
        var d = buf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 4);
        var src = ac.createBufferSource(), bp = ac.createBiquadFilter(), ng = ac.createGain();
        src.buffer = buf; bp.type = 'bandpass'; bp.frequency.value = Math.min(f * 1.5, 12000); bp.Q.value = 6; ng.gain.value = 0.35;
        src.connect(bp); bp.connect(ng); ng.connect(audio.master); src.start(t);
        return true;
      } catch (e) { return false; }
    }
    function chime(featureId, delay) {
      if (!ready()) return false;
      var now = Date.now();
      if (lastChime[featureId] && now - lastChime[featureId] < 250) return false;
      lastChime[featureId] = now;
      try {
        var ac = audio.ctx, t = ac.currentTime + (delay || 0), idx = PINHEAD_FEATURES.indexOf(featureId);
        var base = CHIME_BASE[idx < 0 ? 0 : idx], ratios = [1, 2.76, 5.4, 8.93], gains = [0.2, 0.09, 0.045, 0.022];
        for (var k = 0; k < ratios.length; k++) {
          for (var dt = 0; dt < 2; dt++) {
            var o = ac.createOscillator(), g = ac.createGain(), dec = 1.6 / (k + 1) + 0.3;
            o.type = 'sine'; o.frequency.value = base * ratios[k] * (dt ? 1.003 : 1);
            g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(gains[k] * (dt ? 0.5 : 1), t + 0.004);
            g.gain.exponentialRampToValueAtTime(0.0001, t + dec);
            o.connect(g); g.connect(audio.master); o.start(t); o.stop(t + dec + 0.05);
          }
        }
        return true;
      } catch (e) { return false; }
    }

    /* ---- public API ---- */
    function setLensPosition(nx, ny) {
      st.lensX = clamp01(num(nx, st.lensX)); st.lensY = clamp01(num(ny, st.lensY)); evaluate();
    }
    function setZoom(z) {
      var nz = clamp(num(z, st.zoom), ZOOM_MIN, ZOOM_MAX), changed = nz !== st.zoom;
      st.zoom = nz; evaluate();
      if (changed) call(opts.onZoom, nz);
      return st.zoom;
    }
    function zoomBy(factor) { return setZoom(st.zoom * num(factor, 1)); }
    function setNucleus(nx, ny) {
      st.nucleusX = clamp01(num(nx, st.nucleusX)); st.nucleusY = clamp01(num(ny, st.nucleusY)); evaluate();
    }
    function hitLens(nx, ny) { return lensDistPx(num(nx, -9), num(ny, -9)) <= lastR * 1.05; }
    function step(dt, so) {
      dt = clamp(num(dt, 0), 0, 0.1);
      var reduced = !!(so && so.reducedMotion);
      st.glintT += reduced ? dt * 0.25 : dt;
      if (!reduced) st.motionT += dt;
      evaluate();
    }
    function glintValue() { return Math.pow(0.5 + 0.5 * Math.sin(st.glintT * 2.2), 3); }
    function render(ctx, w, h, ro) {
      if (!ctx || !(w > 0) || !(h > 0)) return;
      ro = ro || {};
      lastW = w; lastH = h; lastR = lensRadiusPx(w, h, ro);
      var r = lastR, lx = st.lensX * w, ly = st.lensY * h, nx = st.nucleusX * w, ny = st.nucleusY * h, gl = glintValue();
      ctx.save();
      drawPinhead(ctx, nx, ny, gl);
      if (ro.hidden !== true && ro.visible !== false) {
        drawHandle(ctx, lx, ly, r);
        ctx.save();
        ctx.beginPath(); ctx.arc(lx, ly, r, 0, TAU); ctx.clip();
        drawMagnified(ctx, st, lx, ly, nx, ny, r, alphaOf(), gl);
        drawOptics(ctx, lx, ly, r);
        ctx.restore();
        drawRim(ctx, lx, ly, r, st.revealed);
        if (ro.showLabel !== false) {
          ctx.font = '600 ' + Math.round(Math.max(10, r * 0.12)) + 'px Georgia, serif';
          ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
          ctx.fillStyle = 'rgba(20,17,12,0.7)';
          var label = '\u00d7' + (st.zoom < 10 ? st.zoom.toFixed(1) : Math.round(st.zoom)) + (st.revealed ? '  \u00b7  pinhead Olinda' : '');
          ctx.fillText(label, lx + 1, ly - r * 1.16 + 1);
          ctx.fillStyle = st.revealed ? PALETTE.cambiumAmber : PALETTE.sapwoodCream;
          ctx.fillText(label, lx, ly - r * 1.16);
        }
      }
      ctx.restore();
    }
    function getState() {
      return { lensX: st.lensX, lensY: st.lensY, zoom: st.zoom, nucleusX: st.nucleusX, nucleusY: st.nucleusY,
        isNucleusRevealed: st.revealed, discovered: order.slice(), muted: st.muted };
    }
    function reset() {
      st.lensX = 0.62; st.lensY = 0.58; st.nucleusX = 0.5; st.nucleusY = 0.5;
      st.motionT = 0; st.glintT = 0; st.revealed = false; disc = {}; order = [];
      var was = st.zoom; st.zoom = 1;
      if (was !== 1) call(opts.onZoom, 1);
    }

    return {
      setLensPosition: setLensPosition, setZoom: setZoom, zoomBy: zoomBy, setNucleus: setNucleus,
      getDiscovered: function () { return order.slice(); },
      isNucleusRevealed: function () { return st.revealed; },
      getFeatureAlpha: function (id) { var A = alphaOf(); return typeof A[id] === 'number' ? A[id] : 0; },
      getLensRadius: function () { return lastR; },
      render: render, hitLens: hitLens, step: step,
      unlockAudio: unlockAudio, setMuted: setMuted, isMuted: function () { return st.muted; },
      playFocusClick: playFocusClick, playDiscoveryChime: function (id) { return chime(id, 0); },
      getState: getState, reset: reset
    };
  }

  return {
    PALETTE: PALETTE, PINHEAD_FEATURES: PINHEAD_FEATURES.slice(), FEATURE_THRESHOLDS: FEATURE_THRESHOLDS,
    ZOOM_RANGE: [ZOOM_MIN, ZOOM_MAX], REVEAL_ZOOM: REVEAL_ZOOM, createLoupe: createLoupe
  };
})();
