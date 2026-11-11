/* OLINDA (City 45, VIII - Hidden Cities 1) - concentric cambium growth layer.
   Olinda grows like a tree trunk, one ring a year. The innermost city walks
   pinhead -> half_lemon -> mushroom -> soup_plate -> full_city; on reaching
   full size it presses every older city outward. Old walls are NEVER
   destroyed: they widen in radius and thin into stretched outer girdles,
   carrying their towers, churches, palaces and theaters along the arc,
   while a new pinhead Olinda nucleates at the center.
   Owner: olinda-ring-cambium. Classic browser IIFE on globalThis, no modules. */
globalThis.OlindaCambiumGrowth = (function () {
  "use strict";

  var PALETTE = {
    loamNight: "#14110c", barkUmber: "#3b2a1a", cambiumAmber: "#d9a441",
    sapwoodCream: "#efe1bf", brassLoupe: "#c8a24a", lensGlassCyan: "#9fd3d6",
    terracottaRoof: "#c0583a", gardenMoss: "#6f8f4a", poolTeal: "#3f8f9a",
    streamerCarmine: "#d23c4f", turfTrackGreen: "#5f9a3c", girdleSlate: "#8a8578"
  };
  var STAGES = ["pinhead", "half_lemon", "mushroom", "soup_plate", "full_city"];
  /* relative radii, as a fraction of min(w, h) */
  var STAGE_RADII = { pinhead: 0.004, half_lemon: 0.03, mushroom: 0.07, soup_plate: 0.14, full_city: 0.30 };
  var KINDS = ["tower", "church", "palace", "theater"];
  var FULL = STAGES.length - 1;   // growth clock value of a full-size city
  var KNEE = 0.45;                // radius where the logarithmic fold starts
  var LIMIT = 0.485;              // asymptote: every girdle stays on the canvas
  var CORE_GAP = 0.92;            // innermost may fill at most this share of its wall
  var TAU = Math.PI * 2;

  function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }
  function stageIndex(s) {
    if (typeof s === "number" && isFinite(s)) return clamp(Math.round(s), 0, FULL);
    return STAGES.indexOf(String(s));
  }
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hexToRgb(h) {
    var n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function mix(a, b, t, alpha) {
    var A = hexToRgb(a), B = hexToRgb(b);
    t = clamp(t, 0, 1);
    return "rgba(" + Math.round(A[0] + (B[0] - A[0]) * t) + "," +
      Math.round(A[1] + (B[1] - A[1]) * t) + "," +
      Math.round(A[2] + (B[2] - A[2]) * t) + "," + (alpha == null ? 1 : alpha) + ")";
  }

  /* Radius of a city whose growth clock is c. 0..4 walks the scale stages
     (geometric easing between them); past 4 the city is pressed outward on a
     logarithmic curve, so each older girdle is wider in radius but thinner. */
  function clockRadius(c) {
    if (!(c > 0)) return STAGE_RADII.pinhead;
    if (c < FULL) {
      var i = Math.floor(c), f = c - i;
      var r0 = STAGE_RADII[STAGES[i]], r1 = STAGE_RADII[STAGES[i + 1]];
      return r0 * Math.pow(r1 / r0, f);
    }
    return STAGE_RADII.full_city + pressed(c - FULL);
  }
  /* Outward pressure on walls older than full size: every year a wall widens,
     but by less and less (slow power falloff, gentler than a log squeeze in
     the outer band), bounded by LIMIT - full_city so all girdles stay on the
     canvas and a girdle's thickness keeps shrinking as its radius grows. */
  function pressed(x) {
    return (LIMIT - STAGE_RADII.full_city) * (1 - Math.pow(1 + x / 6, -0.5));
  }
  /* Final safety squeeze: anything past KNEE is folded logarithmically toward
     LIMIT (slope 1 at the knee, monotone), so no wall ever leaves the canvas. */
  function compress(r) {
    if (r <= KNEE) return r;
    var span = LIMIT - KNEE, x = (r - KNEE) / span, k = 0.6;
    return Math.min(LIMIT, KNEE + span * Math.log(1 + k * x) / k);
  }

  function makeBuildings(id) {
    var r = rng(4517 + id * 7919), n = 14 + Math.floor(r() * 9), out = [];
    var off = r() * TAU;
    for (var i = 0; i < n; i++) {
      out.push({
        kind: i < KINDS.length ? KINDS[(i + id) % KINDS.length] : KINDS[Math.floor(r() * KINDS.length)],
        angle: (off + (i + 0.15 + r() * 0.7) * (TAU / n)) % TAU,
        scale: 0.6 + r() * 0.4
      });
    }
    return out;
  }
  function countBuildings(list) {
    var c = { tower: 0, church: 0, palace: 0, theater: 0 };
    for (var i = 0; i < list.length; i++) c[list[i].kind] += 1;
    return c;
  }

  /* Draw one building in a polar frame: +x points radially outward, y runs
     along the arc. Tangential width scales with radius, radial height with
     the ring's thickness - so outer girdles show them stretched thin. */
  function drawBuilding(ctx, cx, cy, b, ra, rb, count, ink, accent) {
    var hgt = Math.max(0.6, (rb - ra) * b.scale);
    var share = b.kind === "tower" ? 0.3 : (b.kind === "church" ? 0.55 : (b.kind === "palace" ? 0.95 : 0.8));
    var hw = Math.max(0.6, (TAU / count) * 0.5 * share * ((ra + rb) / 2)) / 2;
    var x0 = ra;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(b.angle);
    ctx.fillStyle = ink;
    if (b.kind === "tower") {
      ctx.fillRect(x0, -hw, hgt * 0.72, hw * 2);
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(x0 + hgt * 0.72, -hw);
      ctx.lineTo(x0 + hgt, 0);
      ctx.lineTo(x0 + hgt * 0.72, hw);
      ctx.closePath();
      ctx.fill();
    } else if (b.kind === "church") {
      ctx.fillRect(x0, -hw, hgt * 0.58, hw * 2);
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.moveTo(x0 + hgt * 0.58, -hw);
      ctx.lineTo(x0 + hgt * 0.86, 0);
      ctx.lineTo(x0 + hgt * 0.58, hw);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(x0 + hgt * 0.86, -Math.max(0.3, hw * 0.06), hgt * 0.14, Math.max(0.6, hw * 0.12));
    } else if (b.kind === "palace") {
      ctx.fillRect(x0, -hw, hgt * 0.7, hw * 2);
      ctx.fillStyle = accent;
      for (var k = 0; k < 5; k++) {
        var y = -hw + (k + 0.25) * (hw * 2 / 5);
        ctx.fillRect(x0 + hgt * 0.7, y, hgt * 0.18, hw * 2 / 5 * 0.5);
      }
    } else {
      ctx.fillRect(x0, -hw, hgt * 0.55, hw * 2);
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.save();
      ctx.translate(x0 + hgt * 0.55, 0);
      ctx.scale((hgt * 0.42) / hw, 1);
      ctx.arc(0, 0, hw, -Math.PI / 2, Math.PI / 2, false);
      ctx.restore();
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  function annulus(ctx, cx, cy, r0, r1) {
    ctx.beginPath();
    ctx.arc(cx, cy, r1, 0, TAU, false);
    if (r0 > 0.25) {
      ctx.moveTo(cx + r0, cy);
      ctx.arc(cx, cy, r0, TAU, 0, true);
    }
  }

  function createCambium(opts) {
    opts = opts || {};
    var onYear = typeof opts.onYear === "function" ? opts.onYear : null;
    var onStage = typeof opts.onStage === "function" ? opts.onStage : null;
    var center = { nx: 0.5, ny: 0.5 };
    var gens, year, rings, nextId, time;
    var audio = { ctx: null, muted: !!opts.muted };

    function setCenter(nx, ny) {
      if (isFinite(nx)) center.nx = clamp(+nx, 0, 1);
      if (isFinite(ny)) center.ny = clamp(+ny, 0, 1);
      return { nx: center.nx, ny: center.ny };
    }
    if (opts.center) setCenter(opts.center.nx, opts.center.ny);

    /* clock: target growth clock; disp: eased clock used for drawing */
    function newGen(bornYear, clock) {
      var id = nextId++;
      return {
        id: id, bornYear: bornYear, stage: STAGES[Math.min(FULL, Math.floor(clock))],
        clock: clock, disp: clock, innerR: 0, outerR: 0, buildings: makeBuildings(id)
      };
    }
    /* gens[0] is the oldest (outermost) girdle; gens[n-1] the innermost city */
    function radiiFor(key) {
      var n = gens.length, res = new Array(n), prev = 0;
      var wall = n > 1 ? clockRadius(gens[n - 2][key]) : Infinity;
      for (var i = n - 1; i >= 0; i--) {
        var lin = clockRadius(gens[i][key]);
        if (i === n - 1) lin = Math.min(lin, wall * CORE_GAP);
        var o = compress(lin);
        if (o < prev + 1e-5) o = prev + 1e-5;
        res[i] = { inner: prev, outer: o };
        prev = o;
      }
      return res;
    }
    function layout() {
      var r = radiiFor("clock");
      for (var i = 0; i < gens.length; i++) {
        gens[i].innerR = r[i].inner;
        gens[i].outerR = r[i].outer;
      }
    }
    function innermost() { return gens[gens.length - 1]; }
    function roleOf(i) {
      var n = gens.length;
      return i === n - 1 ? "nucleus" : (i === n - 2 ? "core" : "girdle");
    }

    function reset() {
      gens = []; year = 0; rings = 1; nextId = 0; time = 0;
      gens.push(newGen(-FULL, FULL));   // the existing full-size Olinda
      gens.push(newGen(0, 0));          // pinhead nucleus at its center
      layout();
      return getState();
    }

    function advanceYear() {
      year += 1;
      rings += 1;
      var inner = innermost();
      for (var i = 0; i < gens.length - 1; i++) gens[i].clock += 1;  // pressed outward
      var si = Math.min(FULL, Math.max(0, stageIndex(inner.stage)) + 1);
      inner.stage = STAGES[si];
      inner.clock = si;
      if (si === FULL) gens.push(newGen(year, 0));   // a new pinhead blossoms
      layout();
      var st = getState();
      if (onStage) { try { onStage(st.innermostStage); } catch (e) { /* ignore */ } }
      if (onYear) { try { onYear(st); } catch (e2) { /* ignore */ } }
      return st;
    }

    /* Jump the innermost city to a stage (the weaver's 1-5 selector). Older
       girdles keep their clocks, so no wall ever moves inward or vanishes. */
    function setStage(stage) {
      var si = stageIndex(stage);
      if (si < 0) return getState();
      var inner = innermost();
      inner.stage = STAGES[si];
      inner.clock = si;
      layout();
      if (onStage) { try { onStage(inner.stage); } catch (e) { /* ignore */ } }
      return getState();
    }

    function getLineage() {
      var n = gens.length, out = [];
      for (var i = 0; i < n; i++) {
        var g = gens[i];
        out.push({
          id: g.id, bornYear: g.bornYear, stage: g.stage,
          ringIndex: n - 1 - i,           // 0 = innermost nucleus
          role: roleOf(i),
          innerR: g.innerR, outerR: g.outerR, thickness: g.outerR - g.innerR,
          buildingCounts: countBuildings(g.buildings)
        });
      }
      return out;
    }
    function getGenerations() {
      return gens.map(function (g) {
        return {
          id: g.id, bornYear: g.bornYear, stage: g.stage, innerR: g.innerR, outerR: g.outerR,
          buildings: g.buildings.map(function (b) { return { kind: b.kind, angle: b.angle }; })
        };
      });
    }
    function getState() {
      return {
        year: year,
        concentricRingsCount: rings,
        oldWallsDestroyed: false,
        innermostStage: innermost().stage,
        generationCount: gens.length,
        lineage: getLineage()
      };
    }
    function getCenter(w, h) {
      return { cx: center.nx * (w || 0), cy: center.ny * (h || 0), nx: center.nx, ny: center.ny };
    }
    function hitTest(nx, ny, w, h) {
      if (!w || !h) return null;
      var c = getCenter(w, h), m = Math.min(w, h);
      var d = Math.sqrt(Math.pow(nx * w - c.cx, 2) + Math.pow(ny * h - c.cy, 2)) / m;
      var R = radiiFor("disp"), lin = getLineage();
      for (var i = gens.length - 1; i >= 0; i--) {
        var r0 = i === gens.length - 1 ? 0 : R[i].inner;
        var r1 = Math.max(R[i].outer, i === gens.length - 1 ? 6 / m : 0);
        if (d >= r0 && d <= r1) return lin[i];
      }
      return null;
    }
    function step(dt, so) {
      dt = +dt || 0;
      if (dt > 5) dt = dt / 1000;        // tolerate milliseconds
      dt = clamp(dt, 0, 0.25);
      var reduced = !!(so && so.reducedMotion);
      if (!reduced) time += dt;
      var k = reduced ? 1 : 1 - Math.exp(-dt * 3.2);
      var moving = false;
      for (var i = 0; i < gens.length; i++) {
        var g = gens[i], diff = g.clock - g.disp;
        if (Math.abs(diff) < 1e-3) g.disp = g.clock;
        else { g.disp += diff * k; moving = true; }
      }
      return moving;
    }

    /* ---------- rendering: a tree-ring cross-section of Olinda ---------- */
    function drawBark(ctx, cx, cy, r, m) {
      var thick = Math.max(6, 0.02 * m), N = 144, seed = rng(97);
      ctx.beginPath();
      for (var i = 0; i <= N; i++) {
        var a = (i % N) / N * TAU;
        var rr = r + thick * (0.72 + 0.18 * Math.sin(a * 23) + 0.1 * Math.sin(a * 61 + 1.3) + 0.06 * seed());
        if (i === 0) ctx.moveTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
        else ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr);
      }
      ctx.closePath();
      ctx.moveTo(cx + r, cy);
      ctx.arc(cx, cy, r, TAU, 0, true);
      ctx.fillStyle = PALETTE.barkUmber;
      ctx.fill();
      ctx.strokeStyle = mix(PALETTE.barkUmber, PALETTE.loamNight, 0.5, 0.9);
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    function strokeCircle(ctx, cx, cy, r, style, lw) {
      if (r <= 0.3) return;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, TAU, false);
      ctx.strokeStyle = style;
      ctx.lineWidth = lw;
      ctx.stroke();
    }
    function drawGirdle(ctx, cx, cy, r0, r1, g, age) {
      var t = clamp(age / 12, 0, 1);
      var tone = 0.22 + 0.45 * t + (age % 2 ? 0.1 : 0);    // earlywood / latewood
      annulus(ctx, cx, cy, r0, r1);
      ctx.fillStyle = mix(PALETTE.sapwoodCream, PALETTE.barkUmber, tone);
      ctx.fill();
      var th = r1 - r0;
      if (th > 3) {                      // annual hairlines: four years per girdle
        for (var q = 1; q < 4; q++) strokeCircle(ctx, cx, cy, r0 + th * q / 4, mix(PALETTE.cambiumAmber, PALETTE.barkUmber, 0.3, 0.28), 0.6);
      }
      if (th >= 1.6) {
        var ink = mix(PALETTE.girdleSlate, PALETTE.barkUmber, 0.15 + 0.5 * t);
        var accent = mix(PALETTE.terracottaRoof, PALETTE.girdleSlate, 0.25 + 0.5 * t);
        var pad = Math.min(1.2, th * 0.12);
        for (var i = 0; i < g.buildings.length; i++) {
          drawBuilding(ctx, cx, cy, g.buildings[i], r0 + pad, r1 - pad, g.buildings.length, ink, accent);
        }
      }
      strokeCircle(ctx, cx, cy, r1, PALETTE.cambiumAmber, th > 4 ? 1.4 : 0.9);
    }
    function drawCore(ctx, cx, cy, r0, r1, g) {
      var r = rng(31 + g.id * 131);
      ctx.save();
      annulus(ctx, cx, cy, r0, r1);
      ctx.fillStyle = PALETTE.sapwoodCream;
      ctx.fill();
      ctx.clip();
      var sp = Math.max(6, r1 / 9), x, y;
      ctx.strokeStyle = mix(PALETTE.barkUmber, PALETTE.sapwoodCream, 0.55, 0.55);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (x = cx - r1; x <= cx + r1; x += sp) { ctx.moveTo(x, cy - r1); ctx.lineTo(x, cy + r1); }
      for (y = cy - r1; y <= cy + r1; y += sp) { ctx.moveTo(cx - r1, y); ctx.lineTo(cx + r1, y); }
      for (var a = 0; a < 8; a++) {      // radial avenues toward the old gates
        var an = a * TAU / 8 + 0.2;
        ctx.moveTo(cx + Math.cos(an) * r0, cy + Math.sin(an) * r0);
        ctx.lineTo(cx + Math.cos(an) * r1, cy + Math.sin(an) * r1);
      }
      ctx.stroke();
      var blocks = 70;
      for (var b = 0; b < blocks; b++) { // roofs, gardens, pools in the blocks
        var rr = r0 + (r1 - r0) * (0.08 + 0.84 * r()), aa = r() * TAU, kind = r();
        ctx.fillStyle = kind < 0.62 ? mix(PALETTE.terracottaRoof, PALETTE.sapwoodCream, 0.15, 0.8)
          : (kind < 0.88 ? mix(PALETTE.gardenMoss, PALETTE.sapwoodCream, 0.1, 0.75) : PALETTE.poolTeal);
        var s = sp * (0.25 + 0.3 * r());
        ctx.fillRect(cx + Math.cos(aa) * rr - s / 2, cy + Math.sin(aa) * rr - s / 2, s, s);
      }
      strokeCircle(ctx, cx, cy, (r0 + r1) / 2, mix(PALETTE.cambiumAmber, PALETTE.sapwoodCream, 0.4, 0.5), 1);
      var ra = r0 + (r1 - r0) * 0.62, rb = r1 - Math.max(1.5, (r1 - r0) * 0.06);
      for (var i = 0; i < g.buildings.length; i++) {
        drawBuilding(ctx, cx, cy, g.buildings[i], ra, rb, g.buildings.length,
          mix(PALETTE.girdleSlate, PALETTE.barkUmber, 0.1), PALETTE.terracottaRoof);
      }
      ctx.restore();
      strokeCircle(ctx, cx, cy, r1, PALETTE.cambiumAmber, 2.2);   // the living wall
    }
    function drawNucleus(ctx, cx, cy, r1, g) {
      var si = Math.max(0, stageIndex(g.stage));
      if (r1 > 2.5) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r1, 0, TAU, false);
        ctx.fillStyle = mix(PALETTE.sapwoodCream, PALETTE.cambiumAmber, 0.12);
        ctx.fill();
        if (r1 > 9) {
          ctx.clip();
          var sp = Math.max(3, r1 / (3 + si * 2)), r = rng(53 + g.id * 17);
          ctx.strokeStyle = mix(PALETTE.barkUmber, PALETTE.sapwoodCream, 0.5, 0.5);
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          for (var x = cx - r1; x <= cx + r1; x += sp) { ctx.moveTo(x, cy - r1); ctx.lineTo(x, cy + r1); }
          for (var y = cy - r1; y <= cy + r1; y += sp) { ctx.moveTo(cx - r1, y); ctx.lineTo(cx + r1, y); }
          ctx.stroke();
          for (var k = 0; k < 10 + si * 8; k++) {
            var rr = r1 * Math.sqrt(r()), aa = r() * TAU, s = sp * 0.4;
            ctx.fillStyle = k % 5 === 0 ? PALETTE.gardenMoss : PALETTE.terracottaRoof;
            ctx.fillRect(cx + Math.cos(aa) * rr - s / 2, cy + Math.sin(aa) * rr - s / 2, s, s);
          }
        }
        ctx.restore();
        strokeCircle(ctx, cx, cy, r1, PALETTE.cambiumAmber, 1.2);
      }
      var tw = 0.75 + 0.25 * Math.sin(time * 3.1);     // the pinhead glint
      var gr = Math.max(4, Math.min(14, r1 * 0.5 + 4));
      var grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, gr);
      grad.addColorStop(0, "rgba(255,250,232," + (0.95 * tw).toFixed(3) + ")");
      grad.addColorStop(0.35, mix(PALETTE.lensGlassCyan, PALETTE.sapwoodCream, 0.3, 0.6 * tw));
      grad.addColorStop(1, mix(PALETTE.lensGlassCyan, PALETTE.sapwoodCream, 0, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, gr, 0, TAU, false);
      ctx.fill();
      var L = gr * (1.2 + 0.3 * tw);
      ctx.strokeStyle = "rgba(255,250,232," + (0.7 * tw).toFixed(3) + ")";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(cx - L, cy); ctx.lineTo(cx + L, cy);
      ctx.moveTo(cx, cy - L); ctx.lineTo(cx, cy + L);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 1.4, 0, TAU, false);
      ctx.fillStyle = PALETTE.terracottaRoof;
      ctx.fill();
    }

    function render(ctx, w, h, ro) {
      if (!ctx || !(w > 0) || !(h > 0)) return;
      ro = ro || {};
      var c = getCenter(w, h);
      var cx = isFinite(ro.cx) ? +ro.cx : c.cx, cy = isFinite(ro.cy) ? +ro.cy : c.cy;
      var m = Math.min(w, h), R = radiiFor("disp"), n = gens.length, i;
      ctx.save();
      if (ro.background) { ctx.fillStyle = PALETTE.loamNight; ctx.fillRect(0, 0, w, h); }
      drawBark(ctx, cx, cy, R[0].outer * m, m);
      for (i = 0; i < n - 2; i++) drawGirdle(ctx, cx, cy, R[i].inner * m, R[i].outer * m, gens[i], n - 2 - i);
      if (n > 2) {                       // medullary rays across the pressed girdles
        var rIn = R[n - 2].outer * m, rOut = R[0].outer * m;
        ctx.strokeStyle = mix(PALETTE.cambiumAmber, PALETTE.sapwoodCream, 0.3, 0.14);
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        for (var k = 0; k < 28; k++) {
          var a = k * TAU / 28 + 0.05;
          ctx.moveTo(cx + Math.cos(a) * rIn, cy + Math.sin(a) * rIn);
          ctx.lineTo(cx + Math.cos(a) * rOut, cy + Math.sin(a) * rOut);
        }
        ctx.stroke();
      }
      if (n > 1) drawCore(ctx, cx, cy, R[n - 2].inner * m, R[n - 2].outer * m, gens[n - 2]);
      drawNucleus(ctx, cx, cy, R[n - 1].outer * m, gens[n - 1]);
      if (ro.highlightId != null) {
        for (i = 0; i < n; i++) {
          if (gens[i].id !== ro.highlightId) continue;
          var h0 = i === n - 1 ? 0 : R[i].inner * m, h1 = Math.max(R[i].outer * m, i === n - 1 ? 6 : 0);
          ctx.save();
          annulus(ctx, cx, cy, h0, h1);
          ctx.fillStyle = mix(PALETTE.brassLoupe, PALETTE.sapwoodCream, 0.2, 0.18);
          ctx.fill();
          ctx.shadowColor = PALETTE.brassLoupe;
          ctx.shadowBlur = 8;
          strokeCircle(ctx, cx, cy, h1, PALETTE.brassLoupe, 2.6);
          strokeCircle(ctx, cx, cy, h0, PALETTE.brassLoupe, 2.6);
          ctx.restore();
        }
      }
      ctx.restore();
    }

    /* ---------- optional WebAudio: a low woody resonance per ring ---------- */
    function unlockAudio() {
      try {
        if (!audio.ctx) {
          var AC = globalThis.AudioContext || globalThis.webkitAudioContext;
          if (!AC) return false;
          audio.ctx = new AC();
        }
        if (audio.ctx.state === "suspended" && audio.ctx.resume) audio.ctx.resume();
        return true;
      } catch (e) { return false; }
    }
    function setMuted(b) { audio.muted = !!b; return audio.muted; }
    function playRingGrowth(ringCount) {
      if (audio.muted || !audio.ctx) return false;
      try {
        var ac = audio.ctx, t = ac.currentTime;
        var rc = isFinite(ringCount) ? +ringCount : rings;
        var f = 58 + (rc % 9) * 3.5;
        var out = ac.createGain();
        out.gain.setValueAtTime(0.0001, t);
        out.gain.exponentialRampToValueAtTime(0.22, t + 0.03);
        out.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
        var lp = ac.createBiquadFilter();
        lp.type = "lowpass"; lp.frequency.value = 420; lp.Q.value = 4;
        lp.connect(out); out.connect(ac.destination);
        var mults = [1, 2.01, 2.76], levels = [0.8, 0.3, 0.15];
        for (var k = 0; k < 3; k++) {
          var o = ac.createOscillator(), g = ac.createGain();
          o.type = k ? "sine" : "triangle";
          o.frequency.setValueAtTime(f * mults[k], t);
          o.frequency.exponentialRampToValueAtTime(f * mults[k] * 0.97, t + 1.4);
          g.gain.value = levels[k];
          o.connect(g); g.connect(lp);
          o.start(t); o.stop(t + 1.7);
        }
        var len = Math.max(1, Math.floor(ac.sampleRate * 0.06));
        var buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
        for (var j = 0; j < len; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / len, 3);
        var src = ac.createBufferSource(), bp = ac.createBiquadFilter(), ng = ac.createGain();
        src.buffer = buf;
        bp.type = "bandpass"; bp.frequency.value = 190; bp.Q.value = 2.5;
        ng.gain.value = 0.5;
        src.connect(bp); bp.connect(ng); ng.connect(out);
        src.start(t);
        return true;
      } catch (e) { return false; }
    }

    reset();
    return {
      advanceYear: advanceYear,
      setStage: setStage,
      getLineage: getLineage,
      getGenerations: getGenerations,
      render: render,
      getCenter: getCenter,
      setCenter: setCenter,
      hitTest: hitTest,
      step: step,
      unlockAudio: unlockAudio,
      setMuted: setMuted,
      isMuted: function () { return audio.muted; },
      playRingGrowth: playRingGrowth,
      getState: getState,
      reset: reset
    };
  }

  return {
    PALETTE: PALETTE,
    STAGES: STAGES.slice(),
    STAGE_RADII: STAGE_RADII,
    BUILDING_KINDS: KINDS.slice(),
    createCambium: createCambium
  };
})();
