(function (root) {
  "use strict";

  var PALETTE = {
    sootDeep: "#141115",
    sootMid: "#1d1820",
    sootWarm: "#272028",
    stoneWarm: "#3b3235",
    porphyry: "#9c5248",
    porphyryDark: "#68322b",
    porphyryLight: "#c57468",
    pagodaAmber: "#d98a3c",
    pagodaDark: "#8f511c",
    pagodaLight: "#f0b265",
    bazaarStone: "#c9b79c",
    bazaarDark: "#857661",
    bazaarLight: "#e4d8c3",
    canalVerdigris: "#479399",
    canalDeep: "#1d464b",
    canalFoam: "#9ad4d8",
    middenOchre: "#9a8462",
    middenDark: "#5e4e37",
    middenShard: "#b86b4b",
    chalk: "#f2efe4",
    chalkDim: "rgba(242, 239, 228, 0.42)",
    bezantGilt: "#e5b94c",
    wolfFrost: "#9cb0ba",
    wheelIron: "#8f7a62",
    steppeGrass: "#4b5d52"
  };

  var SHELL_FORMS = [
    {
      id: "pyramid_roof",
      index: 0,
      label: "Pyramid Roof",
      expectedFunction: "Royal Palace & Throne Treasury",
      calvinoStone: "pyramid_roofs",
      roofHue: "#9c5248",
      anchorNorm: { x: 0.19, y: 0.265 },
      footprintNorm: { w: 0.27, h: 0.40 }
    },
    {
      id: "pagoda",
      index: 1,
      label: "Pine-Cone Pagoda",
      expectedFunction: "High Priests' Temple & Sanctuary",
      calvinoStone: "pine_cone_pagodas",
      roofHue: "#d98a3c",
      anchorNorm: { x: 0.50, y: 0.25 },
      footprintNorm: { w: 0.27, h: 0.41 }
    },
    {
      id: "covered_market",
      index: 2,
      label: "Covered Market",
      expectedFunction: "Grand Bazaar & Guild Arcade",
      calvinoStone: "covered_markets",
      roofHue: "#c9b79c",
      anchorNorm: { x: 0.81, y: 0.265 },
      footprintNorm: { w: 0.27, h: 0.40 }
    },
    {
      id: "canal",
      index: 3,
      label: "Scrawl of Canals",
      expectedFunction: "Embassy Quays & Irrigated Gardens",
      calvinoStone: "scrawl_of_canals",
      roofHue: "#479399",
      anchorNorm: { x: 0.305, y: 0.73 },
      footprintNorm: { w: 0.32, h: 0.395 }
    },
    {
      id: "rubbish_heap",
      index: 4,
      label: "Rubbish Heap",
      expectedFunction: "Outcast Midden & Slum Margin",
      calvinoStone: "rubbish_heaps",
      roofHue: "#9a8462",
      anchorNorm: { x: 0.695, y: 0.73 },
      footprintNorm: { w: 0.32, h: 0.395 }
    }
  ];

  var PORTRAIT_SLOTS = [
    { x: 0.045, y: 0.045, w: 0.435, h: 0.272 },
    { x: 0.520, y: 0.055, w: 0.435, h: 0.272 },
    { x: 0.045, y: 0.365, w: 0.435, h: 0.272 },
    { x: 0.520, y: 0.375, w: 0.435, h: 0.272 },
    { x: 0.155, y: 0.688, w: 0.690, h: 0.262 }
  ];

  var BOUNDARY_PRESETS = [
    {
      id: "sacred_profane",
      label: "Sacred / Profane",
      thesis: "Cordon Temple Pagoda & Pyramid sanctuary away from Bazaar & Midden",
      pointsNorm: [
        { x: 0.05, y: 0.49 },
        { x: 0.24, y: 0.48 },
        { x: 0.43, y: 0.50 },
        { x: 0.63, y: 0.46 },
        { x: 0.66, y: 0.24 },
        { x: 0.69, y: 0.06 }
      ]
    },
    {
      id: "royal_artisan",
      label: "Royal / Artisan",
      thesis: "Divide sovereign Pyramid & Embassy Quays from anvils, hearths & stalls",
      pointsNorm: [
        { x: 0.345, y: 0.05 },
        { x: 0.355, y: 0.28 },
        { x: 0.465, y: 0.49 },
        { x: 0.500, y: 0.72 },
        { x: 0.495, y: 0.95 }
      ]
    },
    {
      id: "pure_outcast",
      label: "Pure / Leprous",
      thesis: "Quarantine the Rubbish Heap & cots behind a lime-chalk cordon",
      pointsNorm: [
        { x: 0.50, y: 0.95 },
        { x: 0.50, y: 0.69 },
        { x: 0.57, y: 0.50 },
        { x: 0.77, y: 0.49 },
        { x: 0.96, y: 0.52 }
      ]
    },
    {
      id: "inside_outside",
      label: "Wheels / Wolves Perimeter",
      thesis: "Draw an outer city wall between the rumble of wheels and howl of wolves",
      pointsNorm: [
        { x: 0.035, y: 0.12 },
        { x: 0.500, y: 0.03 },
        { x: 0.965, y: 0.12 },
        { x: 0.965, y: 0.88 },
        { x: 0.500, y: 0.965 },
        { x: 0.035, y: 0.88 },
        { x: 0.035, y: 0.12 }
      ]
    }
  ];

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function makePoint(xn, yn) {
    var cx = clamp(Number(xn) || 0, 0, 1);
    var cy = clamp(Number(yn) || 0, 0, 1);
    return { xNorm: cx, yNorm: cy, x: cx, y: cy };
  }

  function distToSegmentSq(px, py, ax, ay, bx, by) {
    var dx = bx - ax;
    var dy = by - ay;
    var lenSq = dx * dx + dy * dy;
    var t = lenSq > 1e-9 ? clamp(((px - ax) * dx + (py - ay) * dy) / lenSq, 0, 1) : 0;
    var qx = ax + dx * t;
    var qy = ay + dy * t;
    var ex = px - qx;
    var ey = py - qy;
    return { d2: ex * ex + ey * ey, qx: qx, qy: qy };
  }

  function densifyPoints(rawPoints, targetSpacing) {
    var spacing = targetSpacing || 0.045;
    var out = [];
    if (!rawPoints || !rawPoints.length) return out;
    for (var i = 0; i < rawPoints.length; i++) {
      var cur = rawPoints[i];
      var cx = cur.xNorm !== undefined ? cur.xNorm : cur.x;
      var cy = cur.yNorm !== undefined ? cur.yNorm : cur.y;
      if (i === 0) {
        out.push(makePoint(cx, cy));
      } else {
        var prev = out[out.length - 1];
        var dist = Math.hypot(cx - prev.xNorm, cy - prev.yNorm);
        var steps = Math.max(1, Math.ceil(dist / spacing));
        for (var s = 1; s <= steps; s++) {
          var u = s / steps;
          out.push(makePoint(prev.xNorm + (cx - prev.xNorm) * u, prev.yNorm + (cy - prev.yNorm) * u));
        }
      }
    }
    return out;
  }

  function resolveAmbientHue(shellId, actAssignments) {
    if (!actAssignments) return null;
    if (Array.isArray(actAssignments)) {
      for (var i = 0; i < actAssignments.length; i++) {
        var a = actAssignments[i];
        if (a && a.currentShellId === shellId && a.hue) return a.hue;
      }
      return null;
    }
    var entry = actAssignments[shellId];
    if (!entry) return null;
    if (typeof entry === "string") return null;
    if (entry.primaryAct && entry.primaryAct.hue) return entry.primaryAct.hue;
    if (Array.isArray(entry.acts) && entry.acts[0] && entry.acts[0].hue) return entry.acts[0].hue;
    return null;
  }

  function createDeceptiveForms(config) {
    var cfg = config || {};
    var state = {
      width: Math.max(240, Number(cfg.width) || 1280),
      height: Math.max(240, Number(cfg.height) || 800),
      dpr: Math.max(1, Number(cfg.dpr) || 1),
      reducedMotion: Boolean(cfg.reducedMotion),
      time: 0,
      ripplePhase: 0,
      smokePhase: 0,
      selectedShellId: null,
      shells: [],
      doubtPulses: [0, 0, 0, 0, 0],
      activeChalkStrokes: [],
      currentStroke: null,
      strokeSeq: 0,
      recentDissolvedTraces: [],
      dustMotes: [],
      dissolvedBoundariesCount: 0,
      totalChalkAttempts: 0,
      travelerDoubt: 0.18,
      perimeterTumbleCount: 0,
      tumblePhase: 0,
      tumbleDir: { x: 1, y: -0.32 },
      toroidOffset: { x: 0, y: 0 },
      wheelWolfBlend: 0.35
    };

    function recomputeLayout() {
      var W = state.width;
      var H = state.height;
      var isPortrait = W < H * 0.94;
      state.shells = SHELL_FORMS.map(function (meta, idx) {
        var nx, ny, nw, nh;
        if (isPortrait) {
          var p = PORTRAIT_SLOTS[idx];
          nx = p.x;
          ny = p.y;
          nw = p.w;
          nh = p.h;
        } else {
          nw = meta.footprintNorm.w;
          nh = meta.footprintNorm.h;
          nx = meta.anchorNorm.x - nw * 0.5;
          ny = meta.anchorNorm.y - nh * 0.5;
        }
        var rx = Math.round(nx * W);
        var ry = Math.round(ny * H);
        var rw = Math.round(nw * W);
        var rh = Math.round(nh * H);
        var ix = Math.round(rx + rw * 0.08);
        var iy = Math.round(ry + rh * 0.36);
        var iw = Math.round(rw * 0.84);
        var ih = Math.round(rh * 0.56);
        return {
          id: meta.id,
          index: meta.index,
          label: meta.label,
          expectedFunction: meta.expectedFunction,
          calvinoStone: meta.calvinoStone,
          roofHue: meta.roofHue,
          anchorNorm: { x: meta.anchorNorm.x, y: meta.anchorNorm.y },
          footprintNorm: { w: meta.footprintNorm.w, h: meta.footprintNorm.h },
          xNorm: nx,
          yNorm: ny,
          wNorm: nw,
          hNorm: nh,
          x: rx,
          y: ry,
          w: rw,
          h: rh,
          cx: Math.round(rx + rw * 0.5),
          cy: Math.round(ry + rh * 0.5),
          interiorRect: { x: ix, y: iy, w: iw, h: ih },
          selected: state.selectedShellId === meta.id,
          doubtPulse: state.doubtPulses[idx] || 0
        };
      });
    }

    function spawnDust(xNorm, yNorm, count, hue, reduced) {
      if (reduced || state.dustMotes.length > 220) return;
      for (var i = 0; i < count; i++) {
        var ang = ((state.strokeSeq * 17 + i * 2.39996) % 6.28318);
        var spd = 0.014 + ((i * 7) % 11) * 0.003;
        state.dustMotes.push({
          xNorm: clamp(xNorm + Math.cos(ang) * 0.006, 0.01, 0.99),
          yNorm: clamp(yNorm + Math.sin(ang) * 0.006, 0.01, 0.99),
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 0.012,
          life: 1.0,
          size: 1.4 + (i % 3) * 0.9,
          hue: hue || PALETTE.chalk
        });
      }
    }

    function resize(width, height, dpr) {
      if (Number(width) > 40) state.width = Number(width);
      if (Number(height) > 40) state.height = Number(height);
      if (Number(dpr) > 0) state.dpr = Number(dpr);
      recomputeLayout();
      return state.shells;
    }

    function getShells() {
      return state.shells;
    }

    function hitTestShell(normX, normY) {
      var px = clamp(Number(normX) || 0, 0, 1) * state.width;
      var py = clamp(Number(normY) || 0, 0, 1) * state.height;
      for (var i = state.shells.length - 1; i >= 0; i--) {
        var s = state.shells[i];
        if (px >= s.x && px <= s.x + s.w && py >= s.y && py <= s.y + s.h) {
          return s;
        }
      }
      return null;
    }

    function setSelectedShell(shellIdOrNull) {
      state.selectedShellId = shellIdOrNull || null;
      for (var i = 0; i < state.shells.length; i++) {
        state.shells[i].selected = state.shells[i].id === state.selectedShellId;
      }
      return state.selectedShellId;
    }

    function beginChalkLine(normX, normY) {
      if (state.currentStroke) {
        state.currentStroke.drawing = false;
        state.currentStroke.completed = true;
      }
      state.strokeSeq += 1;
      state.totalChalkAttempts += 1;
      var pt = makePoint(normX, normY);
      var pts = [pt];
      var stroke = {
        id: "chalk_" + state.strokeSeq,
        presetId: null,
        label: "Custom Zoning Line",
        thesis: "Traveler's hand-drawn line attempting to partition Zoe",
        points: pts,
        pointsNorm: pts,
        integrity: 1.0,
        age: 0,
        idleDrawTime: 0,
        drawing: true,
        completed: false,
        breaches: [],
        seed: state.strokeSeq * 1.618
      };
      state.currentStroke = stroke;
      state.activeChalkStrokes.push(stroke);
      spawnDust(pt.xNorm, pt.yNorm, 3, PALETTE.chalk, state.reducedMotion);
      return stroke;
    }

    function extendChalkLine(normX, normY) {
      if (!state.currentStroke) {
        return beginChalkLine(normX, normY);
      }
      var stroke = state.currentStroke;
      stroke.idleDrawTime = 0;
      var pt = makePoint(normX, normY);
      var prev = stroke.points[stroke.points.length - 1];
      var dist = Math.hypot(pt.xNorm - prev.xNorm, pt.yNorm - prev.yNorm);
      if (dist >= 0.007) {
        var steps = Math.min(8, Math.max(1, Math.ceil(dist / 0.04)));
        for (var s = 1; s <= steps; s++) {
          var u = s / steps;
          stroke.points.push(makePoint(
            prev.xNorm + (pt.xNorm - prev.xNorm) * u,
            prev.yNorm + (pt.yNorm - prev.yNorm) * u
          ));
        }
        spawnDust(pt.xNorm, pt.yNorm, 1, PALETTE.chalk, state.reducedMotion);
      }
      return stroke;
    }

    function endChalkLine() {
      var stroke = state.currentStroke;
      if (!stroke) return null;
      if (stroke.points.length < 2) {
        var p0 = stroke.points[0];
        stroke.points.push(makePoint(p0.xNorm + 0.04, p0.yNorm + 0.015));
      }
      stroke.drawing = false;
      stroke.completed = true;
      state.currentStroke = null;
      return stroke;
    }

    function applyPresetChalk(presetId) {
      var chosen = BOUNDARY_PRESETS[0];
      for (var i = 0; i < BOUNDARY_PRESETS.length; i++) {
        if (BOUNDARY_PRESETS[i].id === presetId || i === presetId) {
          chosen = BOUNDARY_PRESETS[i];
          break;
        }
      }
      state.strokeSeq += 1;
      state.totalChalkAttempts += 1;
      var pts = densifyPoints(chosen.pointsNorm, 0.042);
      var stroke = {
        id: "chalk_" + state.strokeSeq,
        presetId: chosen.id,
        label: chosen.label,
        thesis: chosen.thesis,
        points: pts,
        pointsNorm: pts,
        integrity: 1.0,
        age: 0,
        idleDrawTime: 0,
        drawing: false,
        completed: true,
        breaches: [],
        seed: state.strokeSeq * 1.618
      };
      state.activeChalkStrokes.push(stroke);
      if (chosen.id === "inside_outside") {
        state.wheelWolfBlend = Math.max(state.wheelWolfBlend, 0.82);
      }
      for (var k = 0; k < pts.length; k += 4) {
        spawnDust(pts[k].xNorm, pts[k].yNorm, 2, PALETTE.chalk, state.reducedMotion);
      }
      return stroke;
    }

    function clearChalk() {
      state.activeChalkStrokes = [];
      state.currentStroke = null;
      state.recentDissolvedTraces = [];
      state.dustMotes = [];
    }

    function triggerPerimeterTumble(dirX, dirY) {
      var dx = Number(dirX);
      var dy = Number(dirY);
      if (!dx && !dy) {
        var cycle = state.perimeterTumbleCount % 4;
        dx = cycle === 0 ? 1 : cycle === 1 ? -1 : cycle === 2 ? 0.45 : -0.45;
        dy = cycle === 0 ? -0.32 : cycle === 1 ? 0.32 : cycle === 2 ? 1 : -1;
      }
      var mag = Math.hypot(dx, dy) || 1;
      state.tumbleDir = { x: dx / mag, y: dy / mag };
      state.perimeterTumbleCount += 1;
      state.tumblePhase = 1.0;
      state.wheelWolfBlend = 1.0;
      state.toroidOffset.x = (state.toroidOffset.x + state.tumbleDir.x * 0.27 + 10) % 1;
      state.toroidOffset.y = (state.toroidOffset.y + state.tumbleDir.y * 0.19 + 10) % 1;
      state.travelerDoubt = clamp(state.travelerDoubt + 0.12, 0, 1);
      for (var i = 0; i < state.shells.length; i++) {
        state.doubtPulses[i] = Math.max(state.doubtPulses[i], 0.85);
        state.shells[i].doubtPulse = state.doubtPulses[i];
      }
      if (typeof cfg.onPerimeterTumble === "function") {
        cfg.onPerimeterTumble(state.perimeterTumbleCount);
      }
      return state.perimeterTumbleCount;
    }

    function step(dt, bleedField, reducedMotion) {
      if (reducedMotion !== undefined) {
        state.reducedMotion = Boolean(reducedMotion);
      }
      var totalDt = clamp(Number(dt) >= 0 ? Number(dt) : 0.016, 0, 5.0);
      var steps = Math.max(1, Math.ceil(totalDt / 0.05));
      var subDt = totalDt / steps;
      var crossings = bleedField && Array.isArray(bleedField.activeCrossings) ? bleedField.activeCrossings : [];
      var flux = bleedField && typeof bleedField.fluxIntensity === "number"
        ? clamp(bleedField.fluxIntensity, 0, 1.8)
        : 0.24;

      for (var stepIdx = 0; stepIdx < steps; stepIdx++) {
        state.time += subDt;
        if (!state.reducedMotion) {
          state.ripplePhase += subDt * 1.65;
          state.smokePhase += subDt * 1.15;
          state.toroidOffset.x = (state.toroidOffset.x + state.tumbleDir.x * state.tumblePhase * subDt * 0.42 + 10) % 1;
          state.toroidOffset.y = (state.toroidOffset.y + state.tumbleDir.y * state.tumblePhase * subDt * 0.28 + 10) % 1;
        }
        state.tumblePhase = Math.max(0, state.tumblePhase - subDt * 0.62);
        var targetBlend = 0.34 + state.travelerDoubt * 0.24 + state.tumblePhase * 0.42;
        state.wheelWolfBlend += (clamp(targetBlend, 0.25, 1) - state.wheelWolfBlend) * Math.min(1, subDt * 3.2);

        for (var si = 0; si < state.shells.length; si++) {
          state.doubtPulses[si] = Math.max(0, state.doubtPulses[si] - subDt * 0.9);
          state.shells[si].doubtPulse = state.doubtPulses[si];
        }

        for (var idx = state.activeChalkStrokes.length - 1; idx >= 0; idx--) {
          var st = state.activeChalkStrokes[idx];
          st.age += subDt;
          if (st.drawing) {
            st.idleDrawTime += subDt;
            if (st.idleDrawTime > 0.55) {
              if (st.points.length < 2) {
                st.points.push(makePoint(st.points[0].xNorm + 0.04, st.points[0].yNorm + 0.015));
              }
              st.drawing = false;
              st.completed = true;
              if (state.currentStroke === st) state.currentStroke = null;
            }
          }

          var hitPressure = 0;
          for (var ci = 0; ci < crossings.length; ci++) {
            var cr = crossings[ci];
            if (!cr) continue;
            var cx = cr.xNorm !== undefined ? cr.xNorm : cr.x;
            var cy = cr.yNorm !== undefined ? cr.yNorm : cr.y;
            var bestD2 = 999;
            var bestQ = null;
            for (var pi = 0; pi < st.points.length - 1; pi++) {
              var a = st.points[pi];
              var b = st.points[pi + 1];
              var res = distToSegmentSq(cx, cy, a.xNorm, a.yNorm, b.xNorm, b.yNorm);
              if (res.d2 < bestD2) {
                bestD2 = res.d2;
                bestQ = res;
              }
            }
            if (bestD2 < 0.0169 && bestQ) {
              var prox = 1 - Math.sqrt(bestD2) / 0.13;
              hitPressure += prox * 0.65;
              if (st.breaches.length < 14) {
                st.breaches.push({
                  xNorm: bestQ.qx,
                  yNorm: bestQ.qy,
                  hue: cr.hue || PALETTE.bezantGilt,
                  actId: cr.actId || "",
                  life: 0.75
                });
              }
              if (!state.reducedMotion && ((ci + stepIdx) % 3 === 0)) {
                spawnDust(bestQ.qx, bestQ.qy, 1, cr.hue || PALETTE.bezantGilt, false);
              }
            }
          }

          for (var bi = st.breaches.length - 1; bi >= 0; bi--) {
            st.breaches[bi].life -= subDt * 1.4;
            if (st.breaches[bi].life <= 0) st.breaches.splice(bi, 1);
          }

          if (!st.drawing) {
            var baseRate = 1.0 / 2.75;
            var accel = clamp(1.0 + flux * 0.52 + hitPressure, 1.0, 2.5);
            st.integrity = Math.max(0, st.integrity - baseRate * accel * subDt);
            state.travelerDoubt = clamp(state.travelerDoubt + 0.022 * subDt, 0, 1);
            if (!state.reducedMotion && st.points.length > 1 && Math.sin(st.age * 23 + idx) > 0.65) {
              var pick = st.points[Math.floor((st.age * 19 + idx * 3) % st.points.length)];
              spawnDust(pick.xNorm, pick.yNorm, 1, PALETTE.chalk, false);
            }
            if (st.integrity <= 0.001) {
              state.recentDissolvedTraces.push({
                points: st.points.slice(0),
                alpha: 0.45,
                label: st.label
              });
              state.activeChalkStrokes.splice(idx, 1);
              state.dissolvedBoundariesCount += 1;
              state.travelerDoubt = clamp(state.travelerDoubt + 0.16, 0, 1.0);
              for (var sp = 0; sp < state.shells.length; sp++) {
                state.doubtPulses[sp] = Math.max(state.doubtPulses[sp], 0.65);
                state.shells[sp].doubtPulse = state.doubtPulses[sp];
              }
              for (var dp = 0; dp < st.points.length; dp += 3) {
                spawnDust(st.points[dp].xNorm, st.points[dp].yNorm, 2, PALETTE.bezantGilt, state.reducedMotion);
              }
              if (typeof cfg.onBoundaryDissolved === "function") {
                cfg.onBoundaryDissolved(st, state.dissolvedBoundariesCount);
              }
            }
          }
        }

        for (var ti = state.recentDissolvedTraces.length - 1; ti >= 0; ti--) {
          state.recentDissolvedTraces[ti].alpha -= subDt * 0.48;
          if (state.recentDissolvedTraces[ti].alpha <= 0.01) {
            state.recentDissolvedTraces.splice(ti, 1);
          }
        }

        for (var mi = state.dustMotes.length - 1; mi >= 0; mi--) {
          var m = state.dustMotes[mi];
          m.life -= subDt * 0.85;
          if (!state.reducedMotion) {
            m.xNorm += m.vx * subDt;
            m.yNorm += m.vy * subDt;
          }
          if (m.life <= 0) state.dustMotes.splice(mi, 1);
        }
      }
      return getState();
    }

    function getState() {
      var maxInt = 0;
      var minInt = 0;
      if (state.activeChalkStrokes.length > 0) {
        maxInt = 0;
        minInt = 1;
        for (var i = 0; i < state.activeChalkStrokes.length; i++) {
          var v = state.activeChalkStrokes[i].integrity;
          if (v > maxInt) maxInt = v;
          if (v < minInt) minInt = v;
        }
      }
      return {
        shells: state.shells,
        activeChalkStrokes: state.activeChalkStrokes,
        maxChalkIntegrity: maxInt,
        minChalkIntegrity: minInt,
        dissolvedBoundariesCount: state.dissolvedBoundariesCount,
        totalChalkAttempts: state.totalChalkAttempts,
        travelerDoubt: state.travelerDoubt,
        perimeterTumbleCount: state.perimeterTumbleCount,
        tumblePhase: state.tumblePhase,
        wheelWolfBlend: state.wheelWolfBlend,
        selectedShellId: state.selectedShellId
      };
    }

    function reset() {
      state.selectedShellId = null;
      state.activeChalkStrokes = [];
      state.currentStroke = null;
      state.recentDissolvedTraces = [];
      state.dustMotes = [];
      state.dissolvedBoundariesCount = 0;
      state.totalChalkAttempts = 0;
      state.travelerDoubt = 0.18;
      state.perimeterTumbleCount = 0;
      state.tumblePhase = 0;
      state.wheelWolfBlend = 0.35;
      state.toroidOffset = { x: 0, y: 0 };
      state.doubtPulses = [0, 0, 0, 0, 0];
      recomputeLayout();
      return getState();
    }

    function syncViewport(ctx, viewport) {
      var vw = viewport && (viewport.width || viewport.w);
      var vh = viewport && (viewport.height || viewport.h);
      if (!vw && ctx && ctx.canvas) vw = ctx.canvas.clientWidth || ctx.canvas.width;
      if (!vh && ctx && ctx.canvas) vh = ctx.canvas.clientHeight || ctx.canvas.height;
      if (vw && vh && (Math.abs(vw - state.width) > 1 || Math.abs(vh - state.height) > 1)) {
        resize(vw, vh, (viewport && viewport.dpr) || state.dpr);
      }
    }

    function drawPawprint(ctx, px, py, scale, angle, alpha) {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);
      ctx.fillStyle = "rgba(162, 182, 192, " + alpha.toFixed(3) + ")";
      ctx.beginPath();
      ctx.ellipse(0, 2 * scale, 3.2 * scale, 2.5 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      var toes = [[-3.3, -2.2], [-1.1, -3.6], [1.2, -3.6], [3.3, -2.2]];
      for (var i = 0; i < toes.length; i++) {
        ctx.beginPath();
        ctx.ellipse(toes[i][0] * scale, toes[i][1] * scale, 1.25 * scale, 1.7 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawContinuumAndPerimeter(ctx, W, H) {
      var bg = ctx.createRadialGradient(W * 0.5, H * 0.48, Math.min(W, H) * 0.08, W * 0.5, H * 0.5, Math.max(W, H) * 0.78);
      bg.addColorStop(0, "#241d25");
      bg.addColorStop(0.58, "#19151c");
      bg.addColorStop(1, PALETTE.sootDeep);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      var tileX = Math.max(44, Math.round(W / 14));
      var tileY = Math.max(36, Math.round(H / 11));
      var ox = (state.toroidOffset.x * tileX) % tileX;
      var oy = (state.toroidOffset.y * tileY) % tileY;
      ctx.strokeStyle = "rgba(201, 183, 156, 0.055)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var gx = -tileX + ox; gx < W + tileX; gx += tileX) {
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx + tileX * 0.18, H);
      }
      for (var gy = -tileY + oy; gy < H + tileY; gy += tileY) {
        ctx.moveTo(0, gy);
        ctx.lineTo(W, gy);
      }
      ctx.stroke();

      var blend = state.wheelWolfBlend;
      var seamPadX = Math.max(14, W * 0.026);
      var seamPadY = Math.max(12, H * 0.028);
      ctx.save();
      ctx.strokeStyle = "rgba(143, 122, 98, " + (0.22 + blend * 0.24).toFixed(3) + ")";
      ctx.lineWidth = 1.4;
      for (var r = 0; r < 2; r++) {
        var inset = r * 5.5;
        ctx.setLineDash([14, 7, 5, 8]);
        ctx.beginPath();
        ctx.roundRect
          ? ctx.roundRect(seamPadX + inset, seamPadY + inset, W - (seamPadX + inset) * 2, H - (seamPadY + inset) * 2, 18)
          : ctx.rect(seamPadX + inset, seamPadY + inset, W - (seamPadX + inset) * 2, H - (seamPadY + inset) * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      var pawCount = 16;
      for (var p = 0; p < pawCount; p++) {
        var u = ((p / pawCount) + state.toroidOffset.x * 0.6) % 1;
        var perim = u * 4;
        var px, py, ang;
        if (perim < 1) {
          px = W * (0.06 + perim * 0.88);
          py = seamPadY * 0.9 + Math.sin(p * 2.1) * 4;
          ang = 1.57;
        } else if (perim < 2) {
          px = W - seamPadX * 0.9 + Math.cos(p * 1.7) * 4;
          py = H * (0.08 + (perim - 1) * 0.84);
          ang = 3.14;
        } else if (perim < 3) {
          px = W * (0.94 - (perim - 2) * 0.88);
          py = H - seamPadY * 0.9 + Math.sin(p * 1.9) * 4;
          ang = -1.57;
        } else {
          px = seamPadX * 0.9 + Math.cos(p * 2.3) * 4;
          py = H * (0.92 - (perim - 3) * 0.84);
          ang = 0;
        }
        drawPawprint(ctx, px, py, 0.85, ang + 0.35, 0.20 + blend * 0.28);
        ctx.strokeStyle = "rgba(92, 118, 101, " + (0.24 + blend * 0.2).toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(px + 6, py + 4);
        ctx.lineTo(px + 9, py - 3);
        ctx.moveTo(px + 8, py + 4);
        ctx.lineTo(px + 13, py - 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawCanalScrawlAndGarrets(ctx, W, H) {
      var isPortrait = W < H * 0.94;
      var canalW = Math.max(12, Math.min(W, H) * 0.032);
      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      function traceCanalMain() {
        ctx.beginPath();
        if (isPortrait) {
          ctx.moveTo(0, H * 0.342);
          ctx.bezierCurveTo(W * 0.34, H * 0.315, W * 0.65, H * 0.375, W, H * 0.345);
          ctx.moveTo(W * 0.495, H * 0.03);
          ctx.bezierCurveTo(W * 0.51, H * 0.35, W * 0.48, H * 0.52, W * 0.72, H * 0.665);
          ctx.moveTo(0, H * 0.665);
          ctx.bezierCurveTo(W * 0.36, H * 0.648, W * 0.66, H * 0.682, W, H * 0.66);
        } else {
          ctx.moveTo(0, H * 0.50);
          ctx.bezierCurveTo(W * 0.26, H * 0.455, W * 0.44, H * 0.545, W * 0.66, H * 0.485);
          ctx.bezierCurveTo(W * 0.80, H * 0.455, W * 0.90, H * 0.515, W, H * 0.49);
          ctx.moveTo(W * 0.345, H * 0.03);
          ctx.bezierCurveTo(W * 0.335, H * 0.28, W * 0.355, H * 0.48, W * 0.305, H * 0.62);
          ctx.moveTo(W * 0.655, H * 0.04);
          ctx.bezierCurveTo(W * 0.665, H * 0.27, W * 0.505, H * 0.52, W * 0.50, H * 0.96);
        }
      }

      ctx.strokeStyle = "#5c5349";
      ctx.lineWidth = canalW + 5;
      traceCanalMain();
      ctx.stroke();

      ctx.strokeStyle = PALETTE.canalDeep;
      ctx.lineWidth = canalW;
      traceCanalMain();
      ctx.stroke();

      ctx.strokeStyle = "rgba(71, 147, 153, 0.58)";
      ctx.lineWidth = canalW * 0.52;
      ctx.setLineDash([16, 12]);
      ctx.lineDashOffset = -state.ripplePhase * 18;
      traceCanalMain();
      ctx.stroke();
      ctx.setLineDash([]);

      var bridges = isPortrait
        ? [[0.26, 0.34], [0.74, 0.355], [0.49, 0.665]]
        : [[0.345, 0.34], [0.49, 0.502], [0.655, 0.31], [0.50, 0.73]];
      for (var bi = 0; bi < bridges.length; bi++) {
        var bx = bridges[bi][0] * W;
        var by = bridges[bi][1] * H;
        ctx.fillStyle = "#8d7e6a";
        ctx.strokeStyle = "#2b2326";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.rect(bx - 9, by - 5, 18, 10);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = PALETTE.bazaarLight;
        ctx.beginPath();
        ctx.moveTo(bx - 9, by - 5);
        ctx.lineTo(bx + 9, by - 5);
        ctx.moveTo(bx - 9, by + 5);
        ctx.lineTo(bx + 9, by + 5);
        ctx.stroke();
      }

      var nodes = isPortrait
        ? [[0.495, 0.345], [0.10, 0.79], [0.90, 0.79]]
        : [[0.345, 0.485], [0.655, 0.485], [0.085, 0.69], [0.915, 0.69]];
      for (var ni = 0; ni < nodes.length; ni++) {
        var gx = nodes[ni][0] * W;
        var gy = nodes[ni][1] * H;
        /* Garret timber roof + skylight */
        ctx.fillStyle = "#3a2e2b";
        ctx.beginPath();
        ctx.moveTo(gx - 15, gy + 6);
        ctx.lineTo(gx - 5, gy - 9);
        ctx.lineTo(gx + 5, gy + 6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgba(235, 185, 92, 0.78)";
        ctx.fillRect(gx - 7, gy - 2, 4, 4);
        /* Golden haymow dome beside garret */
        ctx.fillStyle = "#b58e47";
        ctx.beginPath();
        ctx.arc(gx + 11, gy + 5, 7.5, Math.PI, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#dfc07c";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gx + 11, gy - 6);
        ctx.lineTo(gx + 11, gy + 5);
        ctx.stroke();
        /* Hearth smoke curl */
        var sw = Math.sin(state.smokePhase + ni * 1.7) * 3;
        ctx.strokeStyle = "rgba(226, 218, 206, 0.24)";
        ctx.beginPath();
        ctx.moveTo(gx - 5, gy - 9);
        ctx.quadraticCurveTo(gx - 5 + sw, gy - 16, gx - 2 - sw * 0.6, gy - 22);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawSingleShellBackdrop(ctx, s, ambientHue) {
      var ir = s.interiorRect;
      var roofTop = s.y;
      var roofBot = ir.y;
      var roofH = Math.max(18, roofBot - roofTop);

      ctx.save();
      /* Plinth shadow & outer masonry cheek walls */
      ctx.fillStyle = "rgba(8, 6, 10, 0.52)";
      ctx.fillRect(s.x + 4, ir.y + 4, s.w - 2, s.y + s.h - ir.y);

      ctx.fillStyle = "#2b2329";
      ctx.strokeStyle = "rgba(201, 183, 156, 0.24)";
      ctx.lineWidth = 1.2;
      ctx.fillRect(s.x + 2, ir.y - 3, s.w - 4, s.y + s.h - ir.y + 1);
      ctx.strokeRect(s.x + 2, ir.y - 3, s.w - 4, s.y + s.h - ir.y + 1);

      /* Warm recessed cutaway chamber (interiorRect) */
      var chGrad = ctx.createLinearGradient(ir.x, ir.y, ir.x, ir.y + ir.h);
      chGrad.addColorStop(0, "#171219");
      chGrad.addColorStop(0.55, "#221b24");
      chGrad.addColorStop(1, "#2c2329");
      ctx.fillStyle = chGrad;
      ctx.fillRect(ir.x, ir.y, ir.w, ir.h);

      var glowColor = ambientHue || s.roofHue;
      ctx.save();
      ctx.globalAlpha = 0.14;
      var glow = ctx.createRadialGradient(s.cx, ir.y + ir.h * 0.52, 4, s.cx, ir.y + ir.h * 0.52, ir.w * 0.56);
      glow.addColorStop(0, glowColor);
      glow.addColorStop(1, "rgba(20, 17, 21, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(ir.x, ir.y, ir.w, ir.h);
      ctx.restore();

      /* Subtle recessed masonry courses & center bay vault line */
      ctx.strokeStyle = "rgba(242, 239, 228, 0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ir.x, ir.y + ir.h * 0.5);
      ctx.lineTo(ir.x + ir.w, ir.y + ir.h * 0.5);
      ctx.moveTo(s.cx, ir.y + 4);
      ctx.lineTo(s.cx, ir.y + ir.h - 4);
      ctx.stroke();

      /* Outward Deceptive Architectural Roof by Canonical Stone */
      if (s.id === "pyramid_roof") {
        var tiers = 5;
        for (var t = 0; t < tiers; t++) {
          var u0 = t / tiers;
          var u1 = (t + 1) / tiers;
          var tw = s.w * (0.96 - u0 * 0.72);
          var ty = roofBot - u1 * roofH * 0.92;
          var th = (roofH * 0.92) / tiers + 1;
          var tx = s.cx - tw * 0.5;
          ctx.fillStyle = t % 2 === 0 ? PALETTE.porphyry : "#864239";
          ctx.fillRect(tx, ty, tw, th);
          ctx.fillStyle = PALETTE.porphyryDark;
          ctx.fillRect(tx + tw * 0.66, ty, tw * 0.34, th);
          ctx.strokeStyle = PALETTE.porphyryLight;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(tx + tw, ty);
          ctx.stroke();
        }
        ctx.fillStyle = PALETTE.bezantGilt;
        ctx.beginPath();
        ctx.moveTo(s.cx, roofTop + 1);
        ctx.lineTo(s.cx - 5, roofTop + 9);
        ctx.lineTo(s.cx + 5, roofTop + 9);
        ctx.closePath();
        ctx.fill();
      } else if (s.id === "pagoda") {
        var eaves = 4;
        for (var e = 0; e < eaves; e++) {
          var eu = e / eaves;
          var ew = s.w * (0.94 - eu * 0.54);
          var ey = roofBot - (e + 1) * (roofH * 0.84 / eaves);
          var eh = (roofH * 0.84 / eaves) + 2;
          ctx.fillStyle = e % 2 === 0 ? PALETTE.pagodaAmber : "#bf732c";
          ctx.beginPath();
          ctx.moveTo(s.cx - ew * 0.5 - 6, ey + eh - 3);
          ctx.quadraticCurveTo(s.cx - ew * 0.36, ey + eh, s.cx - ew * 0.28, ey);
          ctx.lineTo(s.cx + ew * 0.28, ey);
          ctx.quadraticCurveTo(s.cx + ew * 0.36, ey + eh, s.cx + ew * 0.5 + 6, ey + eh - 3);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = PALETTE.pagodaLight;
          ctx.stroke();
        }
        ctx.strokeStyle = PALETTE.bezantGilt;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(s.cx, roofTop);
        ctx.lineTo(s.cx, roofTop + roofH * 0.22);
        ctx.stroke();
      } else if (s.id === "covered_market") {
        var bays = 3;
        var bw = (s.w * 0.92) / bays;
        var bx0 = s.cx - s.w * 0.46;
        for (var b = 0; b < bays; b++) {
          var bcx = bx0 + bw * (b + 0.5);
          ctx.fillStyle = PALETTE.bazaarStone;
          ctx.beginPath();
          ctx.arc(bcx, roofBot - 4, bw * 0.48, Math.PI, 0);
          ctx.lineTo(bcx + bw * 0.5, roofBot);
          ctx.lineTo(bcx - bw * 0.5, roofBot);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = PALETTE.bazaarDark;
          ctx.stroke();
          /* Striped bazaar awning */
          var stripes = 4;
          var sw = bw / stripes;
          for (var st = 0; st < stripes; st++) {
            ctx.fillStyle = st % 2 === 0 ? PALETTE.porphyry : PALETTE.bazaarLight;
            ctx.fillRect(bx0 + b * bw + st * sw, roofBot - 6, sw - 0.5, 6);
          }
        }
      } else if (s.id === "canal") {
        ctx.fillStyle = "#3c585c";
        ctx.fillRect(s.x + s.w * 0.06, roofTop + roofH * 0.25, s.w * 0.88, roofH * 0.75);
        for (var ca = 0; ca < 2; ca++) {
          var acx = s.cx + (ca === 0 ? -s.w * 0.21 : s.w * 0.21);
          ctx.fillStyle = PALETTE.canalDeep;
          ctx.beginPath();
          ctx.arc(acx, roofBot, s.w * 0.16, Math.PI, 0);
          ctx.fill();
          ctx.strokeStyle = PALETTE.canalFoam;
          ctx.stroke();
        }
        /* Sluice steps & shimmering basin sill */
        ctx.fillStyle = PALETTE.canalVerdigris;
        ctx.fillRect(ir.x, ir.y + ir.h - 6, ir.w, 6);
        for (var sl = 0; sl < 4; sl++) {
          ctx.fillStyle = "#8a8072";
          ctx.fillRect(s.x + 4 + sl * 4, roofBot - 16 + sl * 4, 8, 4);
        }
      } else {
        /* Rubbish Heap: stratified amphora shards, slag & salvaged timber arch */
        ctx.fillStyle = PALETTE.middenDark;
        ctx.beginPath();
        ctx.moveTo(s.x + 4, roofBot);
        ctx.quadraticCurveTo(s.x + s.w * 0.24, roofTop + 4, s.cx, roofTop + 6);
        ctx.quadraticCurveTo(s.x + s.w * 0.78, roofTop + 2, s.x + s.w - 4, roofBot);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = PALETTE.middenOchre;
        ctx.beginPath();
        ctx.moveTo(s.x + 12, roofBot);
        ctx.quadraticCurveTo(s.cx - s.w * 0.15, roofTop + roofH * 0.34, s.x + s.w - 14, roofBot);
        ctx.closePath();
        ctx.fill();
        for (var sh = 0; sh < 7; sh++) {
          var sx = s.x + s.w * (0.16 + sh * 0.11);
          var sy = roofBot - 6 - ((sh * 13) % Math.max(8, Math.floor(roofH * 0.55)));
          ctx.strokeStyle = sh % 2 === 0 ? PALETTE.middenShard : PALETTE.bazaarStone;
          ctx.beginPath();
          ctx.arc(sx, sy, 4.5, 0.3, 2.7);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function renderBackdropAndShells(ctx, viewport, actAssignments) {
      if (!ctx) return;
      syncViewport(ctx, viewport);
      var W = state.width;
      var H = state.height;
      drawContinuumAndPerimeter(ctx, W, H);
      drawCanalScrawlAndGarrets(ctx, W, H);
      for (var i = 0; i < state.shells.length; i++) {
        var s = state.shells[i];
        var hue = resolveAmbientHue(s.id, actAssignments);
        drawSingleShellBackdrop(ctx, s, hue);
      }
    }

    function renderChalkAndForeframes(ctx, viewport) {
      if (!ctx) return;
      syncViewport(ctx, viewport);
      var W = state.width;
      var H = state.height;
      var ROMAN = ["I", "II", "III", "IV", "V"];

      ctx.save();
      /* 1. Cutaway architectural foreframes, sills & engraved shell cartouches */
      for (var i = 0; i < state.shells.length; i++) {
        var s = state.shells[i];
        var ir = s.interiorRect;

        /* Cutaway section columns & stone lintel/sill */
        ctx.fillStyle = "rgba(59, 50, 53, 0.92)";
        ctx.fillRect(ir.x - 4, ir.y - 2, 4, ir.h + 4);
        ctx.fillRect(ir.x + ir.w, ir.y - 2, 4, ir.h + 4);
        ctx.fillStyle = s.roofHue;
        ctx.fillRect(ir.x - 5, ir.y - 4, ir.w + 10, 3);
        ctx.fillStyle = "#5c5049";
        ctx.fillRect(ir.x - 6, ir.y + ir.h, ir.w + 12, 4);

        /* Compact architectural lintel nameplate above cutaway */
        var fontPx = Math.max(9, Math.min(11, Math.round(s.w * 0.042)));
        ctx.font = "600 " + fontPx + "px 'Iowan Old Style', 'Palatino', Georgia, serif";
        var tagText = ROMAN[i] + " · " + s.label.toUpperCase();
        var tw = Math.min(ir.w - 6, ctx.measureText ? ctx.measureText(tagText).width + 12 : 110);
        var tx = s.cx - tw * 0.5;
        var ty = ir.y - fontPx - 7;
        ctx.fillStyle = "rgba(20, 17, 21, 0.84)";
        ctx.fillRect(tx, ty, tw, fontPx + 4);
        ctx.strokeStyle = "rgba(229, 185, 76, 0.36)";
        ctx.lineWidth = 0.9;
        ctx.strokeRect(tx, ty, tw, fontPx + 4);
        ctx.fillStyle = PALETTE.chalk;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(tagText, s.cx, ty + (fontPx + 4) * 0.52);

        /* Selection reticle & traveler doubt pulse halo */
        if (s.selected || s.doubtPulse > 0.03) {
          var haloAlpha = s.selected ? 0.88 : s.doubtPulse * 0.45;
          ctx.strokeStyle = s.selected
            ? "rgba(229, 185, 76, " + haloAlpha.toFixed(3) + ")"
            : "rgba(242, 239, 228, " + haloAlpha.toFixed(3) + ")";
          ctx.lineWidth = s.selected ? 1.8 : 1.1;
          ctx.strokeRect(s.x - 2, s.y - 2, s.w + 4, s.h + 4);
        }
      }

      /* 2. Toroidal inside/outside perimeter fold wave */
      if (state.tumblePhase > 0.01) {
        var tp = state.tumblePhase;
        var pad = (1 - tp) * Math.min(W, H) * 0.18 + 8;
        ctx.strokeStyle = "rgba(229, 185, 76, " + (tp * 0.58).toFixed(3) + ")";
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 6]);
        ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);
        ctx.setLineDash([]);
        ctx.font = "italic 600 11px 'Iowan Old Style', Georgia, serif";
        ctx.fillStyle = "rgba(242, 239, 228, " + (tp * 0.85).toFixed(3) + ")";
        ctx.textAlign = "center";
        ctx.fillText("NO LINE BETWEEN WHEELS & WOLVES — ZOE TUMBLES INTO ZOE", W * 0.5, Math.max(18, H * 0.035));
      }

      /* 3. Faint chalk ghost scars from recently dissolved boundaries */
      for (var rt = 0; rt < state.recentDissolvedTraces.length; rt++) {
        var tr = state.recentDissolvedTraces[rt];
        if (!tr.points || tr.points.length < 2) continue;
        ctx.strokeStyle = "rgba(242, 239, 228, " + (tr.alpha * 0.45).toFixed(3) + ")";
        ctx.lineWidth = 1.2;
        ctx.setLineDash([3, 7]);
        ctx.beginPath();
        for (var rpi = 0; rpi < tr.points.length; rpi++) {
          var rpt = tr.points[rpi];
          if (rpi === 0) ctx.moveTo(rpt.xNorm * W, rpt.yNorm * H);
          else ctx.lineTo(rpt.xNorm * W, rpt.yNorm * H);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      /* 4. Active traveler zoning-chalk lines & fracture fissures */
      for (var si = 0; si < state.activeChalkStrokes.length; si++) {
        var st = state.activeChalkStrokes[si];
        var pts = st.points;
        if (!pts || pts.length < 2) continue;
        var integ = clamp(st.integrity, 0, 1);
        var frac = 1 - integ;

        for (var p = 0; p < pts.length - 1; p++) {
          /* Dissolve gaps widen deterministically as integrity drops */
          var segHash = Math.abs(Math.sin(st.seed * 7.1 + p * 1.93));
          if (integ < 0.88 && segHash > integ * 1.12) continue;

          var a = pts[p];
          var b = pts[p + 1];
          var jit = state.reducedMotion ? 0 : frac * 3.5 * Math.sin(p * 2.7 + st.age * 9);
          var ax = a.xNorm * W + jit;
          var ay = a.yNorm * H - jit * 0.7;
          var bx = b.xNorm * W - jit * 0.6;
          var by = b.yNorm * H + jit;

          ctx.strokeStyle = "rgba(242, 239, 228, " + (0.25 + integ * 0.72).toFixed(3) + ")";
          ctx.lineWidth = 1.4 + integ * 2.0;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();

          /* Plumb surveyor ticks & transverse fracture cracks */
          if (p % 2 === 0) {
            var mx = (ax + bx) * 0.5;
            var my = (ay + by) * 0.5;
            var ndx = -(by - ay);
            var ndy = bx - ax;
            var nl = Math.hypot(ndx, ndy) || 1;
            var tickLen = 4 + frac * 5;
            ctx.strokeStyle = frac > 0.45
              ? "rgba(229, 185, 76, " + (0.35 + integ * 0.5).toFixed(3) + ")"
              : "rgba(242, 239, 228, " + (0.35 + integ * 0.45).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(mx - (ndx / nl) * tickLen, my - (ndy / nl) * tickLen);
            ctx.lineTo(mx + (ndx / nl) * tickLen, my + (ndy / nl) * tickLen);
            ctx.stroke();
          }
        }

        /* Cross-bleed breach rings where acts pierce the chalk line */
        for (var bi = 0; bi < st.breaches.length; bi++) {
          var br = st.breaches[bi];
          var brx = br.xNorm * W;
          var bry = br.yNorm * H;
          var rad = 6 + (1 - br.life) * 14;
          ctx.strokeStyle = br.hue || PALETTE.bezantGilt;
          ctx.globalAlpha = clamp(br.life, 0, 1) * 0.82;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(brx, bry, rad, 0, Math.PI * 2);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        /* Midpoint chalk integrity badge */
        var mid = pts[Math.floor(pts.length * 0.5)];
        if (mid && integ > 0.04) {
          var pct = Math.round(integ * 100);
          var badge = (st.label || "ZONING CHALK").toUpperCase() + " · " + pct + "%";
          ctx.font = "600 10px 'SF Mono', 'Menlo', monospace";
          var bw = (ctx.measureText ? ctx.measureText(badge).width : 116) + 10;
          var mxp = clamp(mid.xNorm * W, bw * 0.5 + 6, W - bw * 0.5 - 6);
          var myp = clamp(mid.yNorm * H - 12, 16, H - 16);
          ctx.fillStyle = "rgba(20, 17, 21, " + (0.72 * integ + 0.15).toFixed(3) + ")";
          ctx.fillRect(mxp - bw * 0.5, myp - 8, bw, 16);
          ctx.strokeStyle = "rgba(242, 239, 228, " + (0.55 * integ).toFixed(3) + ")";
          ctx.lineWidth = 0.9;
          ctx.strokeRect(mxp - bw * 0.5, myp - 8, bw, 16);
          ctx.fillStyle = PALETTE.chalk;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(badge, mxp, myp);
        }
      }

      /* 5. Drifting chalk-dust motes */
      for (var dm = 0; dm < state.dustMotes.length; dm++) {
        var mote = state.dustMotes[dm];
        ctx.fillStyle = mote.hue || PALETTE.chalk;
        ctx.globalAlpha = clamp(mote.life, 0, 1) * 0.68;
        ctx.beginPath();
        ctx.arc(mote.xNorm * W, mote.yNorm * H, mote.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    recomputeLayout();

    return {
      SHELL_FORMS: SHELL_FORMS,
      BOUNDARY_PRESETS: BOUNDARY_PRESETS,
      getShells: getShells,
      resize: resize,
      hitTestShell: hitTestShell,
      setSelectedShell: setSelectedShell,
      beginChalkLine: beginChalkLine,
      extendChalkLine: extendChalkLine,
      endChalkLine: endChalkLine,
      applyPresetChalk: applyPresetChalk,
      clearChalk: clearChalk,
      triggerPerimeterTumble: triggerPerimeterTumble,
      step: step,
      getState: getState,
      reset: reset,
      renderBackdropAndShells: renderBackdropAndShells,
      renderChalkAndForeframes: renderChalkAndForeframes
    };
  }

  var api = {
    SHELL_FORMS: SHELL_FORMS,
    BOUNDARY_PRESETS: BOUNDARY_PRESETS,
    createDeceptiveForms: createDeceptiveForms
  };

  if (typeof globalThis !== "undefined") {
    globalThis.ZoeDeceptiveForms = api;
  }
  if (typeof window !== "undefined") {
    window.ZoeDeceptiveForms = api;
  }
  if (root) {
    root.ZoeDeceptiveForms = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
