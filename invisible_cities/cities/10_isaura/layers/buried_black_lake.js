(function (root) {
  'use strict';

  var LEFT_EDGE = 0.17;
  var RIGHT_EDGE = 0.83;
  var CONTOUR_SPAN = RIGHT_EDGE - LEFT_EDGE;
  var BASE_LAKE_LEVEL_FRAC = 0.47;
  var DRY_STOP_FRAC = 0.34;
  var TWO_PI = Math.PI * 2;

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function safeSetLineDash(ctx, pattern) {
    if (ctx && typeof ctx.setLineDash === 'function') {
      ctx.setLineDash(pattern);
    }
  }

  function safeLinearGradient(ctx, x0, y0, x1, y1, stops, fallback) {
    if (ctx && typeof ctx.createLinearGradient === 'function') {
      var g = ctx.createLinearGradient(x0, y0, x1, y1);
      if (g && typeof g.addColorStop === 'function') {
        for (var i = 0; i < stops.length; i++) {
          g.addColorStop(stops[i][0], stops[i][1]);
        }
        return g;
      }
    }
    return fallback || (stops.length ? stops[0][1] : '#0b131c');
  }

  function safeRadialGradient(ctx, x0, y0, r0, x1, y1, r1, stops, fallback) {
    if (ctx && typeof ctx.createRadialGradient === 'function') {
      var g = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
      if (g && typeof g.addColorStop === 'function') {
        for (var i = 0; i < stops.length; i++) {
          g.addColorStop(stops[i][0], stops[i][1]);
        }
        return g;
      }
    }
    return fallback || (stops.length ? stops[0][1] : '#0b131c');
  }

  function drawRoundRectPath(ctx, x, y, w, h, r) {
    var rad = Math.max(0, Math.min(r, w * 0.5, h * 0.5));
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
    ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y);
    ctx.closePath();
  }

  function drawEllipsePath(ctx, cx, cy, rx, ry) {
    ctx.beginPath();
    if (typeof ctx.ellipse === 'function') {
      ctx.ellipse(cx, cy, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, TWO_PI);
    } else {
      var kx = rx * 0.55228475;
      var ky = ry * 0.55228475;
      ctx.moveTo(cx - rx, cy);
      ctx.bezierCurveTo(cx - rx, cy - ky, cx - kx, cy - ry, cx, cy - ry);
      ctx.bezierCurveTo(cx + kx, cy - ry, cx + rx, cy - ky, cx + rx, cy);
      ctx.bezierCurveTo(cx + rx, cy + ky, cx + kx, cy + ry, cx, cy + ry);
      ctx.bezierCurveTo(cx - kx, cy + ry, cx - rx, cy + ky, cx - rx, cy);
      ctx.closePath();
    }
  }

  function hash01(seed) {
    var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function buildPlanOutline(pointCount) {
    var count = pointCount || 64;
    var pts = [];
    for (var k = 0; k < count; k++) {
      var theta = (k / count) * TWO_PI;
      var c = Math.cos(theta);
      var s = Math.sin(theta);
      var s2 = s * s;

      // Tangential karst bays vanish at theta=0 and theta=PI so horizontal extent is strictly [0.17, 0.83]
      var du = s2 * (
        0.026 * Math.sin(3 * theta + 0.65) +
        0.015 * Math.cos(5 * theta - 0.42) +
        0.008 * Math.sin(8 * theta + 1.18)
      );
      var u = clamp(0.50 + 0.33 * c + du, LEFT_EDGE, RIGHT_EDGE);
      if (k === 0) u = RIGHT_EDGE;
      if (k === (count >> 1)) u = LEFT_EDGE;

      var radialV = 0.275 +
        0.052 * Math.cos(2 * theta - 0.48) +
        0.036 * Math.sin(3 * theta + 1.12) +
        0.022 * Math.cos(5 * theta + 1.95) +
        0.014 * Math.sin(7 * theta - 0.75);
      var camberV = 0.024 * s2 * Math.cos(2 * theta + 0.35);
      var v = clamp(0.50 + s * radialV + camberV, 0.14, 0.86);

      pts.push({ u: u, v: v });
    }
    return pts;
  }

  function computeKarstGeometry(xNorm) {
    var s = clamp((xNorm - LEFT_EDGE) / CONTOUR_SPAN, 0, 1);
    var dome = Math.sin(Math.PI * s);
    var domeSoft = Math.pow(dome, 0.72);

    // Arched calcareous rock sky: ~0.22 near vault crowns, tapering down to ~0.35 near 0.17 and 0.83
    var vaultRibs =
      0.012 * Math.cos(s * Math.PI * 6.0 + 0.4) +
      0.007 * Math.sin(s * Math.PI * 13.0 - 0.8) +
      0.004 * Math.cos(s * Math.PI * 23.0 + 1.3);
    var rockSkyFrac = clamp(0.348 - 0.118 * domeSoft + vaultRibs * (0.35 + 0.65 * dome), 0.22, 0.35);

    // Deep central abyss and 4 phreatic feeder channels (~0.82..0.95)
    var vent1 = Math.exp(-Math.pow((s - 0.16) / 0.065, 2));
    var vent2 = Math.exp(-Math.pow((s - 0.41) / 0.085, 2));
    var vent3 = Math.exp(-Math.pow((s - 0.64) / 0.080, 2));
    var vent4 = Math.exp(-Math.pow((s - 0.85) / 0.060, 2));
    var abyss = 0.824 +
      0.078 * Math.pow(dome, 0.85) +
      0.026 * vent1 +
      0.042 * vent2 +
      0.038 * vent3 +
      0.024 * vent4 +
      0.008 * Math.sin(s * Math.PI * 9.0 + 0.6);
    var cavernFloorFrac = clamp(abyss, 0.82, 0.95);

    // Submerged intake target inside the black lake (~0.65)
    var targetStopFrac = clamp(
      0.642 + 0.022 * dome + 0.007 * Math.cos(s * Math.PI * 5.0 - 0.3),
      0.63,
      0.68
    );

    // Rich surface botanical intensity strictly across [0.17, 0.83]
    var greenIntensity = clamp(
      0.67 + 0.26 * Math.pow(dome, 0.55) + 0.05 * (vent2 + vent3) + 0.02 * Math.sin(s * Math.PI * 8.0),
      0.65,
      1.0
    );

    return {
      s: s,
      rockSkyFrac: rockSkyFrac,
      lakeLevelFrac: BASE_LAKE_LEVEL_FRAC,
      cavernFloorFrac: cavernFloorFrac,
      targetStopFrac: targetStopFrac,
      greenIntensity: greenIntensity
    };
  }

  function createKarstDepths(config) {
    var cfg = config || {};
    var nodeCount = clamp(Math.floor(cfg.nodeCount || 96), 48, 256);
    var planOutline = buildPlanOutline(64);

    // 4 deep underground feeder streams (s in [0, 1] across the buried contour)
    var feeders = [
      { s: 0.16, freq: 1.45, phase: 0.30, amp: 0.72, entryU: 0.25, bottomU: 0.19 },
      { s: 0.41, freq: 1.92, phase: 1.85, amp: 1.00, entryU: 0.44, bottomU: 0.38 },
      { s: 0.64, freq: 1.63, phase: 3.40, amp: 0.94, entryU: 0.60, bottomU: 0.67 },
      { s: 0.85, freq: 2.18, phase: 4.90, amp: 0.70, entryU: 0.73, bottomU: 0.80 }
    ];

    // 1D coupled shallow-water grid across [0.17, 0.83]
    var eta = new Float64Array(nodeCount);
    var vel = new Float64Array(nodeCount);
    var acc = new Float64Array(nodeCount);
    var depthGrid = new Float64Array(nodeCount);
    var feederWeightGrid = new Float64Array(nodeCount);

    for (var i = 0; i < nodeCount; i++) {
      var sNode = i / (nodeCount - 1);
      var xNode = LEFT_EDGE + sNode * CONTOUR_SPAN;
      var geom = computeKarstGeometry(xNode);
      depthGrid[i] = geom.cavernFloorFrac - geom.lakeLevelFrac;

      var fw = 0;
      for (var f = 0; f < feeders.length; f++) {
        var ds = (sNode - feeders[f].s) / 0.075;
        fw += feeders[f].amp * Math.exp(-0.5 * ds * ds);
      }
      feederWeightGrid[i] = clamp(fw, 0, 1.35);

      // Seed initial living standing/travelling karst wave so t=0 already has natural lapping pressure
      eta[i] =
        0.16 * Math.sin(sNode * Math.PI * 3.0 + 0.55) +
        0.09 * Math.cos(sNode * Math.PI * 5.0 - 0.90) +
        0.05 * Math.sin(sNode * Math.PI * 2.0 + 1.40);
      vel[i] =
        0.22 * Math.cos(sNode * Math.PI * 3.0 + 0.55) -
        0.14 * Math.sin(sNode * Math.PI * 5.0 - 0.90);
    }

    var simTime = 0;
    var isReducedMotion = false;

    // Precomputed procedural stalactites along the calcareous rock sky
    var stalactites = [];
    var stalCount = 31;
    for (var stIdx = 0; stIdx < stalCount; stIdx++) {
      var stS = 0.03 + (stIdx / (stalCount - 1)) * 0.94 + (hash01(stIdx * 7.3 + 1.1) - 0.5) * 0.016;
      stS = clamp(stS, 0.02, 0.98);
      var stX = LEFT_EDGE + stS * CONTOUR_SPAN;
      var stGeom = computeKarstGeometry(stX);
      var lenFrac = 0.018 + 0.042 * hash01(stIdx * 13.7 + 4.2) * Math.sin(Math.PI * stS);
      stalactites.push({
        s: stS,
        xNorm: stX,
        baseFrac: stGeom.rockSkyFrac,
        lenFrac: lenFrac,
        halfWidthPx: 2.2 + 3.6 * hash01(stIdx * 5.9 + 2.7),
        dripPeriod: 3.1 + 4.4 * hash01(stIdx * 19.1 + 0.8),
        dripTimer: hash01(stIdx * 23.3 + 6.4) * 5.0
      });
    }

    // Falling cavern ceiling water-droplets and surface concentric ripples
    var droplets = [];
    var surfaceRipples = [];

    // Rising phreatic feeder stream particles
    var streamParticles = [];
    for (var sp = 0; sp < 28; sp++) {
      streamParticles.push({
        feederIndex: sp % feeders.length,
        progress: (sp / 28 + hash01(sp * 9.1)) % 1,
        speed: 0.22 + 0.20 * hash01(sp * 3.7 + 1.9),
        lateral: (hash01(sp * 11.3 + 5.1) - 0.5) * 0.8
      });
    }

    // Surface cypress trees & moss tufts strictly inside [0.17, 0.83]
    var cypresses = [];
    var cypCount = 20;
    for (var cy = 0; cy < cypCount; cy++) {
      var cyS = 0.025 + (cy / (cypCount - 1)) * 0.95 + (hash01(cy * 17.3 + 2.1) - 0.5) * 0.022;
      cyS = clamp(cyS, 0.015, 0.985);
      var cyX = LEFT_EDGE + cyS * CONTOUR_SPAN;
      var cyGeom = computeKarstGeometry(cyX);
      cypresses.push({
        xNorm: cyX,
        heightPx: 11 + 13 * hash01(cy * 29.7 + 0.4) * cyGeom.greenIntensity,
        widthPx: 2.6 + 2.1 * hash01(cy * 31.1 + 8.2),
        lean: (hash01(cy * 41.9 + 3.3) - 0.5) * 1.6,
        shade: hash01(cy * 13.1 + 7.7)
      });
    }

    // Embedded limestone fossils & karst fissures for stratigraphic richness
    var rockFossils = [];
    for (var rf = 0; rf < 22; rf++) {
      var fx = 0.03 + 0.94 * hash01(rf * 19.7 + 2.4);
      var fy = 0.07 + 0.82 * hash01(rf * 37.3 + 5.6);
      // Keep fossils in solid rock (outside the cavern interior)
      if (fx >= LEFT_EDGE - 0.01 && fx <= RIGHT_EDGE + 0.01) {
        var fg = computeKarstGeometry(clamp(fx, LEFT_EDGE, RIGHT_EDGE));
        if (fy > fg.rockSkyFrac - 0.03 && fy < fg.cavernFloorFrac + 0.03) {
          fy = 0.06 + (fg.rockSkyFrac - 0.09) * hash01(rf * 53.1 + 1.2);
        }
      }
      rockFossils.push({
        xNorm: fx,
        depthFrac: clamp(fy, 0.05, 0.92),
        radius: 3.0 + 4.2 * hash01(rf * 43.9 + 9.1),
        turns: 2.1 + 1.2 * hash01(rf * 11.7),
        angle: hash01(rf * 7.9) * TWO_PI
      });
    }

    function addSurfaceRipple(xNorm, strength) {
      if (xNorm < LEFT_EDGE || xNorm > RIGHT_EDGE) return;
      if (surfaceRipples.length > 28) {
        surfaceRipples.shift();
      }
      surfaceRipples.push({
        xNorm: xNorm,
        age: 0,
        maxAge: 1.5 + 0.8 * clamp(Math.abs(strength), 0.1, 1.5),
        strength: clamp(Math.abs(strength), 0.12, 1.4)
      });
    }

    function injectMicroPulse(xNorm, amp) {
      if (xNorm < LEFT_EDGE || xNorm > RIGHT_EDGE) return;
      var s = (xNorm - LEFT_EDGE) / CONTOUR_SPAN;
      var centerIdx = s * (nodeCount - 1);
      var rad = nodeCount * 0.028;
      var iMin = Math.max(0, Math.floor(centerIdx - rad * 2.5));
      var iMax = Math.min(nodeCount - 1, Math.ceil(centerIdx + rad * 2.5));
      for (var i = iMin; i <= iMax; i++) {
        var u = (i - centerIdx) / rad;
        var w = Math.exp(-0.5 * u * u);
        vel[i] = clamp(vel[i] - amp * w, -6.0, 6.0);
      }
    }

    function getContourBounds() {
      var copy = new Array(planOutline.length);
      for (var i = 0; i < planOutline.length; i++) {
        copy[i] = { u: planOutline[i].u, v: planOutline[i].v };
      }
      return {
        leftEdge: LEFT_EDGE,
        rightEdge: RIGHT_EDGE,
        planOutline: copy
      };
    }

    function probeAt(xNorm) {
      var x = Number.isFinite(xNorm) ? xNorm : -1;
      var inside = x >= LEFT_EDGE && x <= RIGHT_EDGE;
      if (!inside) {
        return {
          insideContour: false,
          hitLake: false,
          xNorm: x,
          greenIntensity: 0,
          rockSkyFrac: null,
          lakeLevelFrac: null,
          cavernFloorFrac: null,
          targetStopFrac: DRY_STOP_FRAC,
          stratumType: 'dry_calcareous_margin'
        };
      }
      var g = computeKarstGeometry(x);
      return {
        insideContour: true,
        hitLake: true,
        xNorm: x,
        rockSkyFrac: g.rockSkyFrac,
        lakeLevelFrac: g.lakeLevelFrac,
        cavernFloorFrac: g.cavernFloorFrac,
        targetStopFrac: g.targetStopFrac,
        greenIntensity: g.greenIntensity,
        stratumType: 'black_lake_karst'
      };
    }

    function disturbWave(xNorm, impulse) {
      var targetX = (xNorm === undefined || xNorm === null) ? 0.50 : xNorm;
      if (!Number.isFinite(targetX) || targetX < LEFT_EDGE || targetX > RIGHT_EDGE) {
        return false;
      }
      var imp = Number.isFinite(impulse) ? clamp(impulse, -3.0, 3.0) : 1.0;
      if (Math.abs(imp) < 1e-4) return false;

      var s = (targetX - LEFT_EDGE) / CONTOUR_SPAN;
      var sigma = 0.042;
      for (var i = 0; i < nodeCount; i++) {
        var sNode = i / (nodeCount - 1);
        var u = (sNode - s) / sigma;
        var u2 = u * u;
        if (u2 < 16.0) {
          var gauss = Math.exp(-0.5 * u2);
          var ricker = (1.0 - 0.68 * u2) * gauss;
          eta[i] = clamp(eta[i] - 0.36 * imp * ricker, -1.25, 1.25);
          vel[i] = clamp(vel[i] - 2.15 * imp * gauss, -6.5, 6.5);
        }
      }

      addSurfaceRipple(targetX, Math.abs(imp));

      // Dislodge nearby poised stalactite droplets on drill/pump shock
      if (!isReducedMotion && droplets.length < 24) {
        for (var st = 0; st < stalactites.length; st++) {
          var stObj = stalactites[st];
          if (Math.abs(stObj.xNorm - targetX) < 0.08 && droplets.length < 24) {
            droplets.push({
              xNorm: stObj.xNorm,
              depthFrac: stObj.baseFrac + stObj.lenFrac,
              velFrac: 0.04 + 0.05 * Math.abs(imp)
            });
          }
        }
      }
      return true;
    }

    function stepWaveSubstep(h, reducedMotion) {
      var dx = 1.0 / (nodeCount - 1);
      var baseSpeed = reducedMotion ? 0.14 : 0.42;
      var damp = reducedMotion ? 4.8 : 0.52;
      var springRestore = reducedMotion ? 3.2 : 1.65;
      var invDx2 = 1.0 / (dx * dx);

      for (var i = 0; i < nodeCount; i++) {
        var left = i === 0 ? eta[1] : eta[i - 1];
        var right = i === nodeCount - 1 ? eta[nodeCount - 2] : eta[i + 1];
        var laplacian = (left - 2.0 * eta[i] + right) * invDx2;

        // Bathymetry-modulated shallow-water celerity c^2 ~ g * H(x)
        var depthScale = depthGrid[i] / 0.42;
        var c2 = baseSpeed * baseSpeed * depthScale;

        // Persistent underground feeder stream harmonic inflow
        var sNode = i / (nodeCount - 1);
        var streamForce = 0;
        if (reducedMotion) {
          streamForce = 0.28 * Math.sin(simTime * 0.65 + sNode * Math.PI * 2.0);
        } else {
          for (var f = 0; f < feeders.length; f++) {
            var fd = feeders[f];
            var dist = (sNode - fd.s) / 0.068;
            if (dist * dist < 12.0) {
              streamForce += 0.92 * fd.amp * Math.exp(-0.5 * dist * dist) *
                Math.sin(simTime * fd.freq + fd.phase);
            }
          }
          // Gentle basin-wide seiche beneath the calcareous rock sky
          streamForce += 0.22 * Math.cos(simTime * 1.15) * Math.cos(sNode * Math.PI * 2.0);
        }

        acc[i] = c2 * laplacian - springRestore * eta[i] - damp * vel[i] + streamForce;
      }

      for (var j = 0; j < nodeCount; j++) {
        vel[j] = clamp(vel[j] + acc[j] * h, -6.5, 6.5);
        eta[j] = clamp(eta[j] + vel[j] * h, -1.25, 1.25);
      }
    }

    function step(dt, reducedMotion) {
      isReducedMotion = Boolean(reducedMotion);
      var safeDt = Number.isFinite(dt) ? clamp(dt, 0, 0.1) : 0.016;
      if (safeDt <= 0) return;

      var targetSub = 1.0 / 120.0;
      var steps = Math.max(1, Math.ceil(safeDt / targetSub));
      var h = safeDt / steps;
      for (var k = 0; k < steps; k++) {
        simTime += h;
        stepWaveSubstep(h, isReducedMotion);
      }

      // Advance feeder stream particles
      var streamRate = isReducedMotion ? 0.25 : 1.0;
      for (var sp = 0; sp < streamParticles.length; sp++) {
        var p = streamParticles[sp];
        p.progress = (p.progress + safeDt * p.speed * streamRate) % 1.0;
      }

      // Advance surface ripples
      for (var r = surfaceRipples.length - 1; r >= 0; r--) {
        surfaceRipples[r].age += safeDt * (isReducedMotion ? 0.5 : 1.0);
        if (surfaceRipples[r].age >= surfaceRipples[r].maxAge) {
          surfaceRipples.splice(r, 1);
        }
      }

      if (isReducedMotion) {
        droplets.length = 0;
        return;
      }

      // Stalactite droplet formation and release
      for (var st = 0; st < stalactites.length; st++) {
        var stItem = stalactites[st];
        stItem.dripTimer += safeDt;
        if (stItem.dripTimer >= stItem.dripPeriod) {
          stItem.dripTimer -= stItem.dripPeriod;
          if (droplets.length < 22) {
            droplets.push({
              xNorm: stItem.xNorm,
              depthFrac: stItem.baseFrac + stItem.lenFrac,
              velFrac: 0.02
            });
          }
        }
      }

      // Gravity fall of cavern droplets into the black lake
      for (var d = droplets.length - 1; d >= 0; d--) {
        var drop = droplets[d];
        drop.velFrac += 0.42 * safeDt;
        drop.depthFrac += drop.velFrac * safeDt;
        var surf = sampleWaveHeightFrac(drop.xNorm);
        if (drop.depthFrac >= surf) {
          injectMicroPulse(drop.xNorm, 0.28);
          addSurfaceRipple(drop.xNorm, 0.30);
          droplets.splice(d, 1);
        }
      }
    }

    function interpolateGrid(arr, xNorm) {
      var s = clamp((xNorm - LEFT_EDGE) / CONTOUR_SPAN, 0, 1);
      var pos = s * (nodeCount - 1);
      var idx = Math.floor(pos);
      if (idx >= nodeCount - 1) return arr[nodeCount - 1];
      var frac = pos - idx;
      return arr[idx] + (arr[idx + 1] - arr[idx]) * frac;
    }

    function sampleWaveHeightFrac(xNorm) {
      var e = clamp(interpolateGrid(eta, xNorm), -1, 1);
      var ampFrac = isReducedMotion ? 0.010 : 0.022;
      return BASE_LAKE_LEVEL_FRAC - e * ampFrac;
    }

    function sampleHydraulics(xNorm) {
      if (!Number.isFinite(xNorm) || xNorm < LEFT_EDGE || xNorm > RIGHT_EDGE) {
        return {
          insideContour: false,
          waveOffset: 0,
          upwardDrive: 0,
          streamFeed: 0,
          lakeDepthFrac: 0
        };
      }

      var rawEta = interpolateGrid(eta, xNorm);
      var rawVel = interpolateGrid(vel, xNorm);
      var baseFeedWeight = interpolateGrid(feederWeightGrid, xNorm);
      var geom = computeKarstGeometry(xNorm);

      var waveOffset = clamp(rawEta, -1, 1);
      var s = (xNorm - LEFT_EDGE) / CONTOUR_SPAN;

      // Dynamic underground stream feed at xNorm (0..1)
      var livePulse = 0;
      for (var f = 0; f < feeders.length; f++) {
        var fd = feeders[f];
        var ds = (s - fd.s) / 0.11;
        if (ds * ds < 12.0) {
          var osc = 0.5 + 0.5 * Math.sin(simTime * fd.freq + fd.phase);
          livePulse += fd.amp * Math.exp(-0.5 * ds * ds) * (0.55 + 0.45 * osc);
        }
      }
      var streamFeed = clamp(0.14 + 0.62 * livePulse + 0.16 * baseFeedWeight * 0.5, 0, 1);
      if (isReducedMotion) {
        streamFeed = clamp(0.24 + 0.35 * baseFeedWeight + 0.08 * Math.sin(simTime * 0.65), 0, 1);
      }

      var ampFrac = isReducedMotion ? 0.010 : 0.022;
      var effectiveLakeTop = geom.lakeLevelFrac - waveOffset * ampFrac;
      var lakeDepthFrac = clamp(geom.cavernFloorFrac - effectiveLakeTop, 0.25, 0.55);

      // Hydrostatic + dynamic wave surge driving upward machinery in [0.18, 1.0]
      var depthHead = (geom.cavernFloorFrac - geom.lakeLevelFrac) / 0.48; // ~0.73..1.0
      var crestBoost = Math.max(0, waveOffset) * 0.34 + Math.abs(waveOffset) * 0.10;
      var kineticBoost = Math.min(0.32, Math.abs(rawVel) * 0.12);
      var breath = isReducedMotion ? 0.06 * Math.sin(simTime * 0.65) : 0;
      var upwardDrive = clamp(
        0.22 + 0.20 * depthHead + 0.20 * streamFeed + crestBoost + kineticBoost + breath,
        0.18,
        1.0
      );

      return {
        insideContour: true,
        waveOffset: waveOffset,
        upwardDrive: upwardDrive,
        streamFeed: streamFeed,
        lakeDepthFrac: lakeDepthFrac
      };
    }

    function drawLimestoneOverburden(ctx, width, height, surfaceY, underH, theology) {
      var stops;
      if (theology === 'depths') {
        stops = [
          [0.0, '#13202a'],
          [0.35, '#0d1720'],
          [0.72, '#081018'],
          [1.0, '#04080e']
        ];
      } else if (theology === 'ascent') {
        stops = [
          [0.0, '#d2cbb8'],
          [0.28, '#bcb4a0'],
          [0.65, '#9d9583'],
          [1.0, '#7c7566']
        ];
      } else {
        stops = [
          [0.0, '#c8c0ac'],
          [0.26, '#a9a18e'],
          [0.60, '#7d7768'],
          [1.0, '#49473f']
        ];
      }

      ctx.fillStyle = safeLinearGradient(ctx, 0, surfaceY, 0, height, stops, stops[1][1]);
      ctx.fillRect(0, surfaceY, width, underH);

      // Stratified calcareous limestone bedding planes
      var strataCount = 9;
      for (var b = 1; b <= strataCount; b++) {
        var baseF = b / (strataCount + 0.6);
        ctx.beginPath();
        var segs = 48;
        for (var k = 0; k <= segs; k++) {
          var u = k / segs;
          var dip = 0.014 * Math.sin(u * Math.PI * 3.0 + b * 0.9) +
                    0.007 * Math.cos(u * Math.PI * 7.0 - b * 1.3);
          var y = surfaceY + clamp(baseF + dip, 0.02, 0.98) * underH;
          if (k === 0) ctx.moveTo(0, y);
          else ctx.lineTo(u * width, y);
        }
        if (theology === 'depths') {
          ctx.strokeStyle = 'rgba(110, 188, 210, 0.13)';
        } else if (theology === 'ascent') {
          ctx.strokeStyle = 'rgba(78, 72, 60, 0.28)';
        } else {
          ctx.strokeStyle = 'rgba(42, 38, 32, 0.26)';
        }
        ctx.lineWidth = 1;
        ctx.stroke();

        // Short vertical calcareous block joints along each bed
        var jointCount = 14;
        ctx.beginPath();
        for (var j = 0; j < jointCount; j++) {
          var ju = ((j + 0.35 * (b % 3)) / jointCount + 0.02 * hash01(b * 17 + j)) % 1.0;
          var jy = surfaceY + (baseF + 0.012 * Math.sin(ju * Math.PI * 3.0 + b * 0.9)) * underH;
          var jh = (underH / (strataCount + 1)) * (0.35 + 0.35 * hash01(b * 31 + j));
          ctx.moveTo(ju * width, jy);
          ctx.lineTo(ju * width + (hash01(j * 13 + b) - 0.5) * 3, jy + jh);
        }
        ctx.strokeStyle = theology === 'depths'
          ? 'rgba(110, 188, 210, 0.08)'
          : 'rgba(60, 55, 46, 0.16)';
        ctx.stroke();
      }

      // Outer dry calcareous flank vertical desiccation fissures (<0.17 and >0.83)
      var flankCracks = [0.03, 0.065, 0.105, 0.142, 0.858, 0.895, 0.935, 0.972];
      ctx.lineWidth = 1;
      ctx.strokeStyle = theology === 'depths'
        ? 'rgba(145, 165, 175, 0.16)'
        : 'rgba(72, 66, 55, 0.32)';
      for (var fc = 0; fc < flankCracks.length; fc++) {
        var cx = flankCracks[fc] * width;
        var maxF = 0.18 + 0.42 * hash01(fc * 29.1 + 3.0);
        ctx.beginPath();
        ctx.moveTo(cx, surfaceY + 2);
        var steps = 6;
        for (var cs = 1; cs <= steps; cs++) {
          var cf = (cs / steps) * maxF;
          var jitter = Math.sin(cs * 2.1 + fc) * 4.5;
          ctx.lineTo(cx + jitter, surfaceY + cf * underH);
        }
        ctx.stroke();
      }

      // Spiral calcareous micro-fossils (ammonites / nummulites)
      ctx.strokeStyle = theology === 'depths'
        ? 'rgba(128, 206, 224, 0.18)'
        : 'rgba(68, 62, 50, 0.24)';
      ctx.lineWidth = 0.9;
      for (var rf = 0; rf < rockFossils.length; rf++) {
        var fos = rockFossils[rf];
        if (theology !== 'ascent' && fos.xNorm >= LEFT_EDGE && fos.xNorm <= RIGHT_EDGE) {
          var gCheck = computeKarstGeometry(fos.xNorm);
          if (fos.depthFrac >= gCheck.rockSkyFrac - 0.02) continue;
        }
        var fxPx = fos.xNorm * width;
        var fyPx = surfaceY + fos.depthFrac * underH;
        ctx.beginPath();
        for (var a = 0; a <= 18; a++) {
          var t = a / 18;
          var ang = fos.angle + t * fos.turns * TWO_PI;
          var rad = t * fos.radius;
          var px = fxPx + Math.cos(ang) * rad;
          var py = fyPx + Math.sin(ang) * rad * 0.82;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }

      // In 'depths' lens, draw translucent capillary mist rising from the rock sky to the green border
      if (theology === 'depths') {
        var mistGrad = safeLinearGradient(
          ctx,
          0,
          surfaceY,
          0,
          surfaceY + 0.36 * underH,
          [
            [0.0, 'rgba(54, 185, 152, 0.18)'],
            [0.5, 'rgba(38, 156, 186, 0.10)'],
            [1.0, 'rgba(26, 132, 178, 0.22)']
          ],
          'rgba(40, 160, 175, 0.12)'
        );
        ctx.fillStyle = mistGrad;
        ctx.fillRect(LEFT_EDGE * width, surfaceY, CONTOUR_SPAN * width, 0.36 * underH);
      }
    }

    function traceCavernPolygon(ctx, width, surfaceY, underH) {
      var leftX = LEFT_EDGE * width;
      var rightX = RIGHT_EDGE * width;
      var gLeft = computeKarstGeometry(LEFT_EDGE);
      var gRight = computeKarstGeometry(RIGHT_EDGE);
      var sampleSteps = 72;

      ctx.beginPath();
      // Start at left rock-sky springer
      ctx.moveTo(leftX, surfaceY + gLeft.rockSkyFrac * underH);

      // Arched calcareous rock sky across [0.17, 0.83]
      for (var i = 1; i <= sampleSteps; i++) {
        var s = i / sampleSteps;
        var xN = LEFT_EDGE + s * CONTOUR_SPAN;
        var g = computeKarstGeometry(xN);
        ctx.lineTo(xN * width, surfaceY + g.rockSkyFrac * underH);
      }

      // Right vertical karst wall descending past targetStopFrac (~0.68) so entire [0.17, 0.83] hits water
      ctx.bezierCurveTo(
        rightX + 3,
        surfaceY + 0.50 * underH,
        rightX + 2,
        surfaceY + 0.70 * underH,
        rightX - 0.008 * width,
        surfaceY + gRight.cavernFloorFrac * underH
      );

      // Deep abyssal cavern floor from right to left
      for (var j = sampleSteps - 1; j >= 0; j--) {
        var sj = j / sampleSteps;
        var xNj = LEFT_EDGE + sj * CONTOUR_SPAN;
        var gj = computeKarstGeometry(xNj);
        var xFloor = xNj * width;
        if (j === 0) xFloor = leftX + 0.008 * width;
        ctx.lineTo(xFloor, surfaceY + gj.cavernFloorFrac * underH);
      }

      // Left vertical karst wall ascending back to rock-sky springer
      ctx.bezierCurveTo(
        leftX - 2,
        surfaceY + 0.70 * underH,
        leftX - 3,
        surfaceY + 0.50 * underH,
        leftX,
        surfaceY + gLeft.rockSkyFrac * underH
      );
      ctx.closePath();
    }

    function drawFeederStreamsAndVeins(ctx, width, height, surfaceY, underH, theology) {
      var isDepths = theology === 'depths';
      var veinPulse = isReducedMotion ? 0.65 : (0.62 + 0.38 * Math.sin(simTime * 1.8));

      // Deep feeder stream channels connecting bottom of frame into cavern floor
      for (var f = 0; f < feeders.length; f++) {
        var fd = feeders[f];
        var topXNorm = LEFT_EDGE + fd.s * CONTOUR_SPAN;
        var topGeom = computeKarstGeometry(topXNorm);
        var topX = topXNorm * width;
        var topY = surfaceY + (topGeom.cavernFloorFrac - 0.015) * underH;
        var botX = fd.bottomU * width;
        var botY = height + 4;
        var midX = lerp(botX, topX, 0.52) + Math.sin(f * 2.3 + 0.8) * (width * 0.022);
        var midY = lerp(botY, topY, 0.50);

        // Outer dark karst conduit throat
        ctx.beginPath();
        ctx.moveTo(botX - 11, botY);
        ctx.quadraticCurveTo(midX - 8, midY, topX - 7, topY);
        ctx.lineTo(topX + 7, topY);
        ctx.quadraticCurveTo(midX + 8, midY, botX + 11, botY);
        ctx.closePath();
        ctx.fillStyle = isDepths ? '#051521' : '#080e15';
        ctx.fill();

        // Glowing phreatic stream core
        ctx.beginPath();
        ctx.moveTo(botX, botY);
        ctx.quadraticCurveTo(midX, midY, topX, topY - 8);
        ctx.strokeStyle = isDepths
          ? 'rgba(72, 224, 238, ' + (0.48 * veinPulse + 0.25).toFixed(3) + ')'
          : 'rgba(64, 152, 182, 0.36)';
        ctx.lineWidth = isDepths ? 4.2 : 2.6;
        ctx.stroke();

        // Fine bright filament center
        ctx.strokeStyle = isDepths
          ? 'rgba(182, 248, 255, 0.72)'
          : 'rgba(130, 200, 220, 0.38)';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      // Rising phreatic water/mineral particles inside the feeder conduits
      for (var sp = 0; sp < streamParticles.length; sp++) {
        var pt = streamParticles[sp];
        var fdRef = feeders[pt.feederIndex];
        var t = pt.progress;
        var txNorm = LEFT_EDGE + fdRef.s * CONTOUR_SPAN;
        var tGeom = computeKarstGeometry(txNorm);
        var tx = txNorm * width;
        var ty = surfaceY + (tGeom.cavernFloorFrac - 0.025) * underH;
        var bx = fdRef.bottomU * width;
        var by = height;
        var mx = lerp(bx, tx, 0.52) + Math.sin(pt.feederIndex * 2.3 + 0.8) * (width * 0.022);
        var my = lerp(by, ty, 0.50);

        var omt = 1 - t;
        var px = omt * omt * bx + 2 * omt * t * mx + t * t * tx + pt.lateral * 5;
        var py = omt * omt * by + 2 * omt * t * my + t * t * ty;

        ctx.beginPath();
        ctx.arc(px, py, isDepths ? 2.1 : 1.5, 0, TWO_PI);
        ctx.fillStyle = isDepths
          ? 'rgba(145, 242, 252, ' + (0.35 + 0.55 * Math.sin(t * Math.PI)).toFixed(3) + ')'
          : 'rgba(108, 188, 210, ' + (0.20 + 0.35 * Math.sin(t * Math.PI)).toFixed(3) + ')';
        ctx.fill();
      }

      // Bioluminescent abyssal mineral veins branching along deep karst rock
      var veinAnchors = [0.22, 0.35, 0.51, 0.69, 0.79];
      ctx.lineWidth = isDepths ? 1.3 : 0.9;
      for (var v = 0; v < veinAnchors.length; v++) {
        var vu = veinAnchors[v];
        var vg = computeKarstGeometry(vu);
        var vx = vu * width;
        var vy = surfaceY + vg.cavernFloorFrac * underH;
        var glow = 0.22 + 0.28 * (0.5 + 0.5 * Math.sin(simTime * 1.4 + v * 1.7));
        ctx.strokeStyle = isDepths
          ? 'rgba(66, 218, 200, ' + (glow + 0.18).toFixed(3) + ')'
          : 'rgba(58, 146, 158, ' + (glow * 0.55).toFixed(3) + ')';
        ctx.beginPath();
        ctx.moveTo(vx, vy);
        ctx.lineTo(vx - 14 + v * 4, vy + underH * 0.045);
        ctx.lineTo(vx + 8 - v * 3, vy + underH * 0.09);
        ctx.stroke();
      }
    }

    function drawCavernAndBlackLake(ctx, width, height, surfaceY, underH, theology) {
      var isDepths = theology === 'depths';

      // Draw deep feeder streams entering from beneath cavern floor
      drawFeederStreamsAndVeins(ctx, width, height, surfaceY, underH, theology);

      ctx.save();
      traceCavernPolygon(ctx, width, surfaceY, underH);

      // Cavern interior background (calcareous rock sky airspace)
      var airStops = isDepths
        ? [
            [0.0, '#0d2332'],
            [0.36, '#071521'],
            [1.0, '#02070d']
          ]
        : [
            [0.0, '#141920'],
            [0.35, '#0b0f15'],
            [1.0, '#04060a']
          ];
      ctx.fillStyle = safeLinearGradient(
        ctx,
        0,
        surfaceY + 0.22 * underH,
        0,
        surfaceY + 0.95 * underH,
        airStops,
        '#080d14'
      );
      ctx.fill();
      ctx.clip();

      // Reflected wave caustics shimmering across the vaulted calcareous rock sky
      var causticBands = 18;
      for (var cb = 0; cb < causticBands; cb++) {
        var cs = (cb + 0.5) / causticBands;
        var cxN = LEFT_EDGE + cs * CONTOUR_SPAN;
        var cg = computeKarstGeometry(cxN);
        var localWave = interpolateGrid(eta, cxN);
        var cx = cxN * width + localWave * 9;
        var cy = surfaceY + (cg.rockSkyFrac + 0.018) * underH;
        var rx = (CONTOUR_SPAN * width / causticBands) * (0.65 + 0.45 * Math.abs(localWave));
        var ry = underH * 0.018;

        drawEllipsePath(ctx, cx, cy, rx, ry);
        ctx.fillStyle = isDepths
          ? 'rgba(92, 224, 240, ' + (0.08 + 0.14 * Math.abs(localWave)).toFixed(3) + ')'
          : 'rgba(145, 185, 210, ' + (0.04 + 0.08 * Math.abs(localWave)).toFixed(3) + ')';
        ctx.fill();
      }

      // Hanging calcareous stalactites along the rock sky vault
      for (var st = 0; st < stalactites.length; st++) {
        var sItem = stalactites[st];
        var sx = sItem.xNorm * width;
        var sy = surfaceY + (sItem.baseFrac - 0.004) * underH;
        var tipY = surfaceY + (sItem.baseFrac + sItem.lenFrac) * underH;
        var hw = sItem.halfWidthPx;

        ctx.beginPath();
        ctx.moveTo(sx - hw, sy);
        ctx.quadraticCurveTo(sx - hw * 0.35, (sy + tipY) * 0.5, sx, tipY);
        ctx.quadraticCurveTo(sx + hw * 0.35, (sy + tipY) * 0.5, sx + hw, sy);
        ctx.closePath();
        ctx.fillStyle = isDepths ? '#1d3a4b' : '#5e5a50';
        ctx.fill();
        ctx.strokeStyle = isDepths ? 'rgba(130, 220, 236, 0.32)' : 'rgba(198, 190, 172, 0.25)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Poised dew bead at stalactite tip
        var beadPulse = isReducedMotion ? 0.7 : clamp(sItem.dripTimer / sItem.dripPeriod, 0.2, 1.0);
        ctx.beginPath();
        ctx.arc(sx, tipY + 1.2, 1.1 * beadPulse, 0, TWO_PI);
        ctx.fillStyle = isDepths ? 'rgba(165, 244, 255, 0.82)' : 'rgba(188, 222, 238, 0.62)';
        ctx.fill();
      }

      // Falling cavern droplets
      for (var dr = 0; dr < droplets.length; dr++) {
        var drop = droplets[dr];
        var dx = drop.xNorm * width;
        var dy = surfaceY + drop.depthFrac * underH;
        ctx.beginPath();
        ctx.moveTo(dx, dy - 3.5);
        ctx.lineTo(dx - 1.3, dy);
        ctx.arc(dx, dy, 1.3, Math.PI, 0, true);
        ctx.closePath();
        ctx.fillStyle = isDepths ? 'rgba(175, 248, 255, 0.88)' : 'rgba(195, 226, 242, 0.72)';
        ctx.fill();
      }

      // Subterranean Black Lake body (from live 96-node shallow-water surface down to cavern floor)
      ctx.beginPath();
      for (var i = 0; i < nodeCount; i++) {
        var sN = i / (nodeCount - 1);
        var xWave = (LEFT_EDGE + sN * CONTOUR_SPAN) * width;
        var yWave = surfaceY + sampleWaveHeightFrac(LEFT_EDGE + sN * CONTOUR_SPAN) * underH;
        if (i === 0) ctx.moveTo(xWave - 4, yWave);
        else ctx.lineTo(xWave, yWave);
      }
      ctx.lineTo(RIGHT_EDGE * width + 6, surfaceY + 0.97 * underH);
      ctx.lineTo(LEFT_EDGE * width - 6, surfaceY + 0.97 * underH);
      ctx.closePath();

      var lakeStops = isDepths
        ? [
            [0.0, 'rgba(15, 52, 72, 0.95)'],
            [0.24, 'rgba(7, 27, 41, 0.97)'],
            [0.62, 'rgba(3, 12, 20, 0.99)'],
            [1.0, 'rgba(1, 5, 10, 1.0)']
          ]
        : [
            [0.0, 'rgba(13, 24, 36, 0.96)'],
            [0.25, 'rgba(6, 12, 19, 0.98)'],
            [0.65, 'rgba(3, 5, 9, 0.99)'],
            [1.0, 'rgba(1, 2, 4, 1.0)']
          ];
      ctx.fillStyle = safeLinearGradient(
        ctx,
        0,
        surfaceY + 0.45 * underH,
        0,
        surfaceY + 0.95 * underH,
        lakeStops,
        '#040910'
      );
      ctx.fill();

      // Submerged hydrostatic pressure contours & abyssal feeder plumes inside the black lake
      var contourLevels = [0.22, 0.46, 0.72];
      for (var cl = 0; cl < contourLevels.length; cl++) {
        var fracInLake = contourLevels[cl];
        ctx.beginPath();
        for (var m = 0; m < nodeCount; m += 2) {
          var sm = m / (nodeCount - 1);
          var xmNorm = LEFT_EDGE + sm * CONTOUR_SPAN;
          var gm = computeKarstGeometry(xmNorm);
          var topF = sampleWaveHeightFrac(xmNorm);
          var isoF = lerp(topF, gm.cavernFloorFrac, fracInLake) -
            (1 - fracInLake) * 0.008 * eta[m];
          var xm = xmNorm * width;
          var ym = surfaceY + isoF * underH;
          if (m === 0) ctx.moveTo(xm, ym);
          else ctx.lineTo(xm, ym);
        }
        ctx.strokeStyle = isDepths
          ? 'rgba(84, 214, 232, ' + (0.28 - cl * 0.06).toFixed(3) + ')'
          : 'rgba(92, 146, 178, ' + (0.16 - cl * 0.03).toFixed(3) + ')';
        ctx.lineWidth = 1.0;
        ctx.stroke();
      }

      // Luminous obsidian-silver wave crest meniscus along the lapping black lake surface
      ctx.beginPath();
      for (var w = 0; w < nodeCount; w++) {
        var sw = w / (nodeCount - 1);
        var xwNorm = LEFT_EDGE + sw * CONTOUR_SPAN;
        var xw = xwNorm * width;
        var yw = surfaceY + sampleWaveHeightFrac(xwNorm) * underH;
        if (w === 0) ctx.moveTo(xw, yw);
        else ctx.lineTo(xw, yw);
      }
      ctx.strokeStyle = isDepths ? 'rgba(130, 238, 250, 0.88)' : 'rgba(158, 198, 222, 0.68)';
      ctx.lineWidth = isDepths ? 2.2 : 1.6;
      ctx.stroke();

      // Secondary indigo-silver subsurface shimmer line
      ctx.beginPath();
      for (var w2 = 0; w2 < nodeCount; w2++) {
        var sw2 = w2 / (nodeCount - 1);
        var xwNorm2 = LEFT_EDGE + sw2 * CONTOUR_SPAN;
        var xw2 = xwNorm2 * width;
        var yw2 = surfaceY + sampleWaveHeightFrac(xwNorm2) * underH + 3.2;
        if (w2 === 0) ctx.moveTo(xw2, yw2);
        else ctx.lineTo(xw2, yw2);
      }
      ctx.strokeStyle = isDepths ? 'rgba(64, 186, 215, 0.45)' : 'rgba(92, 134, 168, 0.30)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Expanding concentric wave rings from disturbances & droplets
      for (var rp = 0; rp < surfaceRipples.length; rp++) {
        var rip = surfaceRipples[rp];
        var prog = rip.age / rip.maxAge;
        var alpha = (1 - prog) * (isDepths ? 0.62 : 0.44) * clamp(rip.strength, 0.2, 1.2);
        var rxPx = 6 + prog * width * 0.085;
        var ryPx = 1.5 + prog * 4.2;
        var rCx = rip.xNorm * width;
        var rCy = surfaceY + sampleWaveHeightFrac(rip.xNorm) * underH;
        drawEllipsePath(ctx, rCx, rCy, rxPx, ryPx);
        ctx.strokeStyle = isDepths
          ? 'rgba(155, 245, 255, ' + alpha.toFixed(3) + ')'
          : 'rgba(175, 214, 235, ' + alpha.toFixed(3) + ')';
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      ctx.restore();

      // Engraved calcareous rock-sky vault rim highlight
      ctx.save();
      traceCavernPolygon(ctx, width, surfaceY, underH);
      ctx.strokeStyle = isDepths ? 'rgba(98, 212, 232, 0.55)' : 'rgba(42, 39, 34, 0.75)';
      ctx.lineWidth = isDepths ? 1.8 : 1.4;
      ctx.stroke();
      ctx.restore();
    }

    function drawSurfaceBorderAndShelves(ctx, width, surfaceY, underH, theology) {
      var leftPx = LEFT_EDGE * width;
      var rightPx = RIGHT_EDGE * width;
      var isDepths = theology === 'depths';

      // 1. Stark, sun-bleached, arid fissured calcareous limestone shelves outside [0.17, 0.83]
      var shelfFill = isDepths ? '#2c353b' : '#e5decb';
      var shelfEdge = isDepths ? '#4d5b64' : '#9c9380';

      var drySpans = [
        [0, leftPx],
        [rightPx, width]
      ];
      for (var ds = 0; ds < drySpans.length; ds++) {
        var x0 = drySpans[ds][0];
        var x1 = drySpans[ds][1];
        var spanW = Math.max(0, x1 - x0);
        if (spanW <= 0.5) continue;

        ctx.fillStyle = shelfFill;
        ctx.fillRect(x0, surfaceY - 3, spanW, 7);
        ctx.strokeStyle = shelfEdge;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(x0, surfaceY - 3);
        ctx.lineTo(x1, surfaceY - 3);
        ctx.stroke();

        // Bleached karst clint/grike notches & dry scree stones
        var grikeCount = Math.max(4, Math.floor(spanW / 18));
        ctx.strokeStyle = isDepths ? 'rgba(15, 20, 24, 0.65)' : 'rgba(112, 104, 88, 0.60)';
        ctx.lineWidth = 1;
        for (var gk = 1; gk < grikeCount; gk++) {
          var gx = x0 + (gk / grikeCount) * spanW + (hash01(ds * 41 + gk) - 0.5) * 5;
          var gh = 4 + 5 * hash01(ds * 19 + gk * 3);
          ctx.beginPath();
          ctx.moveTo(gx, surfaceY - 3);
          ctx.lineTo(gx + (hash01(gk * 7) - 0.5) * 2, surfaceY - 3 + gh);
          ctx.stroke();
        }
      }

      // 2. Lush Emerald / Verdigris Botanical Green Border strictly across [0.17, 0.83]
      var turfSteps = 56;
      ctx.beginPath();
      ctx.moveTo(leftPx, surfaceY + 6);
      for (var t = 0; t <= turfSteps; t++) {
        var st = t / turfSteps;
        var ux = LEFT_EDGE + st * CONTOUR_SPAN;
        var g = computeKarstGeometry(ux);
        var mound = 3.2 + 3.4 * g.greenIntensity + 1.4 * Math.sin(st * Math.PI * 19.0 + 0.5);
        ctx.lineTo(ux * width, surfaceY - mound);
      }
      ctx.lineTo(rightPx, surfaceY + 6);
      // Organic moss root-hem along upper limestone
      for (var b = turfSteps; b >= 0; b--) {
        var sb = b / turfSteps;
        var uxb = LEFT_EDGE + sb * CONTOUR_SPAN;
        var rootDrop = 4.5 + 3.5 * Math.sin(sb * Math.PI * 15.0 + 1.1);
        ctx.lineTo(uxb * width, surfaceY + rootDrop);
      }
      ctx.closePath();

      var turfGrad = safeLinearGradient(
        ctx,
        leftPx,
        surfaceY - 7,
        leftPx,
        surfaceY + 8,
        isDepths
          ? [
              [0.0, '#38b588'],
              [0.55, '#1e7c5c'],
              [1.0, '#104436']
            ]
          : [
              [0.0, '#3ca374'],
              [0.55, '#246f4e'],
              [1.0, '#164632']
            ],
        '#267350'
      );
      ctx.fillStyle = turfGrad;
      ctx.fill();

      // Verdigris highlight along upper moss rim
      ctx.beginPath();
      for (var m = 0; m <= turfSteps; m++) {
        var sm = m / turfSteps;
        var uxm = LEFT_EDGE + sm * CONTOUR_SPAN;
        var gm = computeKarstGeometry(uxm);
        var my = surfaceY - (3.2 + 3.4 * gm.greenIntensity + 1.4 * Math.sin(sm * Math.PI * 19.0 + 0.5));
        if (m === 0) ctx.moveTo(uxm * width, my);
        else ctx.lineTo(uxm * width, my);
      }
      ctx.strokeStyle = isDepths ? 'rgba(116, 238, 190, 0.78)' : 'rgba(118, 206, 152, 0.72)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Slender Mediterranean cypress silhouettes along [0.17, 0.83]
      var swayBase = isReducedMotion ? 0 : Math.sin(simTime * 1.1) * 0.9;
      for (var cy = 0; cy < cypresses.length; cy++) {
        var tree = cypresses[cy];
        var tx = tree.xNorm * width;
        var scale = width < 520 ? 0.78 : 1.0;
        var th = tree.heightPx * scale;
        var tw = tree.widthPx * scale;
        var tipX = tx + tree.lean + swayBase * (0.5 + 0.5 * tree.shade);
        var baseY = surfaceY - 3;

        // Trunk
        ctx.strokeStyle = '#2d241c';
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(tx, baseY + 1);
        ctx.lineTo(tx, baseY - 2.5);
        ctx.stroke();

        // Flame-shaped cypress crown
        ctx.beginPath();
        ctx.moveTo(tx, baseY - 2);
        ctx.quadraticCurveTo(tx - tw * 1.15, baseY - th * 0.42, tipX, baseY - th);
        ctx.quadraticCurveTo(tx + tw * 1.15, baseY - th * 0.42, tx, baseY - 2);
        ctx.closePath();
        ctx.fillStyle = isDepths
          ? (tree.shade > 0.5 ? '#1c6d54' : '#145240')
          : (tree.shade > 0.5 ? '#1d563d' : '#143d2b');
        ctx.fill();
      }

      // 3. Carved limestone boundary cairns right at xNorm = 0.17 and xNorm = 0.83
      var cairnXs = [leftPx, rightPx];
      for (var cIdx = 0; cIdx < cairnXs.length; cIdx++) {
        var cx = cairnXs[cIdx];
        var tiers = [
          { w: 11, h: 4.5, dy: 0 },
          { w: 8.2, h: 4.0, dy: 4.5 },
          { w: 5.6, h: 3.6, dy: 8.5 },
          { w: 3.2, h: 3.0, dy: 12.1 }
        ];
        for (var tr = 0; tr < tiers.length; tr++) {
          var tier = tiers[tr];
          drawRoundRectPath(
            ctx,
            cx - tier.w * 0.5,
            surfaceY - 2 - tier.dy - tier.h,
            tier.w,
            tier.h,
            1.2
          );
          ctx.fillStyle = isDepths ? '#5c6e78' : '#d8d0bc';
          ctx.fill();
          ctx.strokeStyle = isDepths ? '#9ad8e4' : '#5b5346';
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }

    function drawSubterraneanShafts(ctx, width, surfaceY, underH, shafts, theology) {
      if (!shafts || !shafts.length) return;
      var isDepths = theology === 'depths';
      var isAscent = theology === 'ascent';
      var halfBore = shafts.length > 28 ? 2.1 : (width < 520 ? 2.9 : 3.9);

      for (var i = 0; i < shafts.length; i++) {
        var sh = shafts[i];
        if (!sh || !Number.isFinite(sh.xNorm)) continue;

        var pr = probeAt(sh.xNorm);
        var hitLake = typeof sh.hitLake === 'boolean' ? sh.hitLake : pr.insideContour;
        var targetF = Number.isFinite(sh.targetDepthFrac) ? sh.targetDepthFrac : pr.targetStopFrac;
        var curF = Number.isFinite(sh.currentDepthFrac)
          ? sh.currentDepthFrac
          : (Number.isFinite(sh.drillProgress) ? clamp(sh.drillProgress, 0, 1) * targetF : targetF);
        curF = clamp(curF, 0, 0.96);
        if (curF <= 0.002) continue;

        var sx = sh.xNorm * width;
        var bottomY = surfaceY + curF * underH;
        var pumpImp = Number.isFinite(sh.pumpImpulse) ? clamp(sh.pumpImpulse, 0, 2) : 0;

        // Masonry well-curb collar embedded in surface horizon
        ctx.fillStyle = hitLake
          ? (isDepths ? '#2f5e6e' : '#8b8372')
          : (isDepths ? '#444b50' : '#b8b09c');
        ctx.fillRect(sx - halfBore - 2.2, surfaceY - 2.5, (halfBore + 2.2) * 2, 5.5);

        if (hitLake && pr.insideContour) {
          var hyd = sampleHydraulics(sh.xNorm);
          var rockSkyY = surfaceY + pr.rockSkyFrac * underH;
          var waveY = surfaceY + sampleWaveHeightFrac(sh.xNorm) * underH;
          var rockBoreEnd = isAscent ? bottomY : Math.min(bottomY, rockSkyY + 2);

          // Bored limestone channel down to rock sky (or full depth in 'ascent' rock veil)
          ctx.fillStyle = isDepths ? 'rgba(6, 18, 28, 0.88)' : 'rgba(24, 26, 30, 0.86)';
          ctx.fillRect(sx - halfBore, surfaceY + 2, halfBore * 2, Math.max(0, rockBoreEnd - surfaceY - 2));

          ctx.strokeStyle = isDepths ? 'rgba(110, 216, 232, 0.45)' : 'rgba(68, 63, 54, 0.72)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(sx - halfBore, surfaceY + 2);
          ctx.lineTo(sx - halfBore, rockBoreEnd);
          ctx.moveTo(sx + halfBore, surfaceY + 2);
          ctx.lineTo(sx + halfBore, rockBoreEnd);
          ctx.stroke();

          // Standpipe piercing cavern airspace and black lake (when cavern is visible)
          if (!isAscent && bottomY > rockSkyY) {
            var pipeHalf = Math.max(1.6, halfBore * 0.72);
            ctx.fillStyle = 'rgba(18, 30, 40, 0.88)';
            ctx.fillRect(sx - pipeHalf, rockSkyY, pipeHalf * 2, bottomY - rockSkyY);
            ctx.strokeStyle = isDepths ? 'rgba(130, 226, 240, 0.62)' : 'rgba(150, 138, 112, 0.62)';
            ctx.lineWidth = 0.9;
            ctx.strokeRect(sx - pipeHalf, rockSkyY, pipeHalf * 2, bottomY - rockSkyY);
          }

          // Rising water column & animated silver-cyan hydraulic pulses once lake is reached
          var reachedWater = curF >= pr.lakeLevelFrac - 0.01;
          if (reachedWater) {
            var drive = clamp(hyd.upwardDrive + pumpImp * 0.35, 0.18, 1.2);
            var colHalf = Math.max(1.2, halfBore * 0.52);

            var waterGrad = safeLinearGradient(
              ctx,
              sx,
              bottomY,
              sx,
              surfaceY,
              [
                [0.0, 'rgba(38, 168, 202, ' + clamp(0.45 + drive * 0.35, 0.4, 0.92).toFixed(3) + ')'],
                [0.5, 'rgba(92, 218, 238, ' + clamp(0.50 + drive * 0.35, 0.45, 0.95).toFixed(3) + ')'],
                [1.0, 'rgba(176, 246, 255, ' + clamp(0.55 + drive * 0.35, 0.5, 0.98).toFixed(3) + ')']
              ],
              'rgba(98, 220, 240, 0.75)'
            );
            ctx.fillStyle = waterGrad;
            ctx.fillRect(sx - colHalf, surfaceY, colHalf * 2, bottomY - surfaceY);

            // Rising hydraulic water beads inside the bore
            var beadCount = 5;
            var speed = isReducedMotion ? 0.18 : (0.55 + drive * 1.15);
            for (var b = 0; b < beadCount; b++) {
              var phase = ((simTime * speed + b / beadCount + i * 0.17) % 1.0);
              var by = bottomY - phase * (bottomY - surfaceY);
              ctx.beginPath();
              ctx.arc(sx, by, Math.max(1.1, colHalf * 0.75), 0, TWO_PI);
              ctx.fillStyle = 'rgba(218, 252, 255, 0.88)';
              ctx.fill();
            }

            // Brass/iron perforated intake strainer submerged in the black lake
            var strainerW = halfBore * 2.3;
            var strainerH = 7.5;
            drawRoundRectPath(ctx, sx - strainerW * 0.5, bottomY - strainerH * 0.5, strainerW, strainerH, 2.0);
            ctx.fillStyle = isAscent ? '#9a7b42' : '#c69b4e';
            ctx.fill();
            ctx.strokeStyle = isDepths ? '#9ef2ff' : '#59431d';
            ctx.lineWidth = 0.9;
            ctx.stroke();

            // Suction halo & lake-surface meniscus ripple (in 'depths' & 'schism')
            if (!isAscent) {
              ctx.beginPath();
              ctx.arc(sx, bottomY, strainerW * (0.75 + 0.35 * drive), 0, TWO_PI);
              ctx.strokeStyle = isDepths
                ? 'rgba(120, 238, 252, 0.36)'
                : 'rgba(135, 205, 228, 0.24)';
              ctx.lineWidth = 1.0;
              ctx.stroke();

              drawEllipsePath(ctx, sx, waveY, halfBore * (2.2 + 1.4 * drive), 2.1);
              ctx.strokeStyle = isDepths
                ? 'rgba(165, 246, 255, 0.78)'
                : 'rgba(182, 218, 238, 0.58)';
              ctx.lineWidth = 1.1;
              ctx.stroke();
            }
          }
        } else {
          // DRY BORE OUTSIDE [0.17, 0.83]: stalls in solid dry calcareous limestone with zero water
          ctx.fillStyle = isDepths ? 'rgba(30, 34, 38, 0.82)' : 'rgba(74, 68, 58, 0.72)';
          ctx.fillRect(sx - halfBore, surfaceY + 2, halfBore * 2, Math.max(0, bottomY - surfaceY - 2));

          // Dry rotary score marks inside empty shaft
          ctx.strokeStyle = isDepths ? 'rgba(145, 152, 158, 0.30)' : 'rgba(218, 210, 192, 0.45)';
          ctx.lineWidth = 0.9;
          for (var tickY = surfaceY + 8; tickY < bottomY - 4; tickY += 7) {
            ctx.beginPath();
            ctx.moveTo(sx - halfBore + 0.8, tickY);
            ctx.lineTo(sx + halfBore - 0.8, tickY + 2.2);
            ctx.stroke();
          }

          // Fractured dry chalk/limestone rubble & radial stall cracks at bore termination
          var rays = [
            [-9, -3], [-11, 4], [-6, 9], [0, 10], [7, 8], [11, 3], [8, -4]
          ];
          ctx.strokeStyle = isDepths ? 'rgba(175, 165, 148, 0.45)' : 'rgba(86, 76, 62, 0.68)';
          ctx.lineWidth = 1.1;
          for (var ry = 0; ry < rays.length; ry++) {
            ctx.beginPath();
            ctx.moveTo(sx, bottomY);
            ctx.lineTo(sx + rays[ry][0], bottomY + rays[ry][1]);
            ctx.stroke();
          }

          // Compacted dry chalk plug & dust motes (zero water)
          var rubblePts = [
            [-2.2, -1.5, 1.8], [1.8, -1.0, 1.6], [0.0, 1.4, 2.0], [-3.0, 2.0, 1.4], [2.8, 2.2, 1.5]
          ];
          ctx.fillStyle = isDepths ? '#8d877a' : '#dfd7c3';
          for (var rb = 0; rb < rubblePts.length; rb++) {
            ctx.beginPath();
            ctx.arc(sx + rubblePts[rb][0], bottomY + rubblePts[rb][1], rubblePts[rb][2], 0, TWO_PI);
            ctx.fill();
          }
        }

        // Active rotary auger head if shaft is still sinking toward targetStopFrac
        if (curF < targetF - 0.006) {
          var spin = isReducedMotion ? 0 : simTime * 14.0;
          ctx.save();
          ctx.translate(sx, bottomY);
          ctx.beginPath();
          ctx.moveTo(-halfBore * 1.1, -4);
          ctx.lineTo(halfBore * 1.1, -4);
          ctx.lineTo(Math.sin(spin) * 1.5, 4.5);
          ctx.closePath();
          ctx.fillStyle = '#d4a857';
          ctx.fill();
          ctx.restore();
        }
      }
    }

    function drawCursorPlumbGuide(ctx, width, surfaceY, underH, cursorXNorm, theology) {
      if (!Number.isFinite(cursorXNorm)) return;
      var cx = clamp(cursorXNorm, 0, 1) * width;
      var pr = probeAt(cursorXNorm);
      var stopY = surfaceY + pr.targetStopFrac * underH;

      ctx.save();
      safeSetLineDash(ctx, [4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, surfaceY);
      ctx.lineTo(cx, stopY);
      ctx.strokeStyle = pr.insideContour
        ? (theology === 'depths' ? 'rgba(116, 238, 248, 0.34)' : 'rgba(54, 178, 148, 0.32)')
        : 'rgba(198, 104, 82, 0.34)';
      ctx.lineWidth = 1.0;
      ctx.stroke();
      safeSetLineDash(ctx, []);

      // Target stop reticle
      ctx.beginPath();
      ctx.arc(cx, stopY, 2.6, 0, TWO_PI);
      ctx.fillStyle = pr.insideContour ? 'rgba(92, 224, 238, 0.65)' : 'rgba(208, 114, 92, 0.65)';
      ctx.fill();
      ctx.restore();
    }

    function render(ctx, viewport, state) {
      if (!ctx || !viewport) return;
      var st = state || {};
      var width = viewport.width || 1280;
      var height = viewport.height || 800;
      var surfaceY = viewport.surfaceY != null ? viewport.surfaceY : Math.round(height * 0.52);
      var underH = Math.max(1, height - surfaceY);
      var theology = st.theology || 'schism';
      var shafts = Array.isArray(st.shafts) ? st.shafts : [];

      ctx.save();

      // 1. Stratified calcareous limestone overburden (full underground backdrop)
      drawLimestoneOverburden(ctx, width, height, surfaceY, underH, theology);

      // 2. Cavern vault, calcareous rock sky, underground feeder streams & black lake
      //    (Veiled beneath opaque rock strata in 'ascent' so only green border + shafts betray it)
      if (theology !== 'ascent') {
        drawCavernAndBlackLake(ctx, width, height, surfaceY, underH, theology);
      }

      // 3. Subterranean alignment plumb guide for active drill cursor
      if (Number.isFinite(st.cursorXNorm)) {
        drawCursorPlumbGuide(ctx, width, surfaceY, underH, st.cursorXNorm, theology);
      }

      // 4. Drilled vertical boreholes (wet lake-piercing shafts vs dry limestone stubs)
      drawSubterraneanShafts(ctx, width, surfaceY, underH, shafts, theology);

      // 5. Botanical Green Border along [0.17, 0.83] & stark bleached limestone shelves outside
      drawSurfaceBorderAndShelves(ctx, width, surfaceY, underH, theology);

      ctx.restore();
    }

    function samplePlanVerticalBounds(u) {
      // Find upper and lower v of planOutline at horizontal u inside [0.17, 0.83]
      var clampedU = clamp(u, LEFT_EDGE, RIGHT_EDGE);
      var vMin = 0.50;
      var vMax = 0.50;
      var found = false;
      for (var i = 0; i < planOutline.length; i++) {
        var a = planOutline[i];
        var b = planOutline[(i + 1) % planOutline.length];
        if ((a.u <= clampedU && b.u >= clampedU) || (b.u <= clampedU && a.u >= clampedU)) {
          var denom = b.u - a.u;
          var t = Math.abs(denom) < 1e-6 ? 0.5 : (clampedU - a.u) / denom;
          var vCross = a.v + (b.v - a.v) * clamp(t, 0, 1);
          if (!found) {
            vMin = vCross;
            vMax = vCross;
            found = true;
          } else {
            if (vCross < vMin) vMin = vCross;
            if (vCross > vMax) vMax = vCross;
          }
        }
      }
      return { vMin: vMin, vMax: vMax };
    }

    function renderPlanimeter(ctx, rect, state) {
      if (!ctx || !rect) return;
      var st = state || {};
      var rx = rect.x || 0;
      var ry = rect.y || 0;
      var rw = Math.max(40, rect.width || 220);
      var rh = Math.max(32, rect.height || 120);
      var theology = st.theology || 'schism';
      var isDepths = theology === 'depths';
      var isAscent = theology === 'ascent';
      var shafts = Array.isArray(st.shafts) ? st.shafts : [];

      var padX = Math.max(4, Math.round(rw * 0.04));
      var padY = Math.max(4, Math.round(rh * 0.06));
      var innerW = Math.max(10, rw - padX * 2);
      var innerH = Math.max(10, rh - padY * 2);

      function mapU(u) {
        return rx + padX + u * innerW;
      }
      function mapV(v) {
        return ry + padY + v * innerH;
      }

      ctx.save();
      drawRoundRectPath(ctx, rx, ry, rw, rh, 4);
      ctx.fillStyle = isDepths ? '#0c161f' : '#dfd8c6';
      ctx.fill();
      ctx.clip();

      // Subtle cartographic graticule & outer dry calcareous plateau texture
      ctx.strokeStyle = isDepths ? 'rgba(110, 175, 198, 0.10)' : 'rgba(92, 84, 70, 0.14)';
      ctx.lineWidth = 0.8;
      for (var gx = 1; gx < 6; gx++) {
        var xGrid = mapU(gx / 6);
        ctx.beginPath();
        ctx.moveTo(xGrid, ry);
        ctx.lineTo(xGrid, ry + rh);
        ctx.stroke();
      }
      for (var gy = 1; gy < 4; gy++) {
        var yGrid = mapV(gy / 4);
        ctx.beginPath();
        ctx.moveTo(rx, yGrid);
        ctx.lineTo(rx + rw, yGrid);
        ctx.stroke();
      }

      // Contour boundary ticks at u = 0.17 and u = 0.83
      safeSetLineDash(ctx, [2, 3]);
      ctx.strokeStyle = isDepths ? 'rgba(96, 214, 182, 0.35)' : 'rgba(42, 110, 78, 0.38)';
      ctx.beginPath();
      ctx.moveTo(mapU(LEFT_EDGE), ry);
      ctx.lineTo(mapU(LEFT_EDGE), ry + rh);
      ctx.moveTo(mapU(RIGHT_EDGE), ry);
      ctx.lineTo(mapU(RIGHT_EDGE), ry + rh);
      ctx.stroke();
      safeSetLineDash(ctx, []);

      // Trace organic buried lake polygon
      ctx.beginPath();
      for (var p = 0; p < planOutline.length; p++) {
        var pt = planOutline[p];
        var px = mapU(pt.u);
        var py = mapV(pt.v);
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Emerald green surface border repeating the buried lake's exact dark outline
      ctx.strokeStyle = isDepths ? '#36be8d' : '#267c56';
      ctx.lineWidth = Math.max(3.5, Math.min(6.5, rh * 0.055));
      ctx.stroke();

      // Fill interior of the buried black lake polygon
      if (isAscent) {
        ctx.fillStyle = 'rgba(46, 62, 68, 0.24)';
        ctx.fill();
      } else {
        var planGrad = safeRadialGradient(
          ctx,
          mapU(0.50),
          mapV(0.50),
          innerH * 0.04,
          mapU(0.50),
          mapV(0.50),
          innerW * 0.38,
          isDepths
            ? [
                [0.0, '#124058'],
                [0.55, '#071d2c'],
                [1.0, '#030b13']
              ]
            : [
                [0.0, '#122638'],
                [0.60, '#071019'],
                [1.0, '#020509']
              ],
          '#06121c'
        );
        ctx.fillStyle = planGrad;
        ctx.fill();
      }

      // Clip interior wave contours inside planOutline
      ctx.save();
      ctx.clip();
      if (!isAscent) {
        var bands = 9;
        for (var wb = 1; wb < bands; wb++) {
          var uBand = LEFT_EDGE + (wb / bands) * CONTOUR_SPAN;
          var eVal = interpolateGrid(eta, uBand);
          var xWave = mapU(uBand) + eVal * 3.5;
          ctx.beginPath();
          ctx.moveTo(xWave, ry + padY);
          ctx.lineTo(xWave, ry + rh - padY);
          ctx.strokeStyle = isDepths
            ? 'rgba(104, 228, 244, ' + (0.14 + 0.18 * Math.abs(eVal)).toFixed(3) + ')'
            : 'rgba(130, 178, 206, ' + (0.09 + 0.12 * Math.abs(eVal)).toFixed(3) + ')';
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }
      } else {
        // Subtle inferred karst hatching in 'ascent'
        ctx.strokeStyle = 'rgba(44, 62, 68, 0.22)';
        ctx.lineWidth = 0.8;
        for (var hIdx = -4; hIdx < 12; hIdx++) {
          ctx.beginPath();
          ctx.moveTo(rx + hIdx * 16, ry + rh);
          ctx.lineTo(rx + hIdx * 16 + rh, ry);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Crisp inner rim of green border + miniature cypress crown stipples
      ctx.beginPath();
      for (var p2 = 0; p2 < planOutline.length; p2++) {
        var pt2 = planOutline[p2];
        var px2 = mapU(pt2.u);
        var py2 = mapV(pt2.v);
        if (p2 === 0) ctx.moveTo(px2, py2);
        else ctx.lineTo(px2, py2);
      }
      ctx.closePath();
      ctx.strokeStyle = isDepths ? 'rgba(138, 245, 202, 0.85)' : 'rgba(64, 168, 116, 0.88)';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Transect horizontal center-chord reference
      ctx.strokeStyle = isDepths ? 'rgba(160, 210, 225, 0.18)' : 'rgba(60, 56, 48, 0.20)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(rx + padX, mapV(0.50));
      ctx.lineTo(rx + rw - padX, mapV(0.50));
      ctx.stroke();

      // Plotted wet (cyan/emerald) vs. dry (chalk-red) well dots
      for (var sIdx = 0; sIdx < shafts.length; sIdx++) {
        var sh = shafts[sIdx];
        if (!sh || !Number.isFinite(sh.xNorm)) continue;
        var pr = probeAt(sh.xNorm);
        var wet = typeof sh.hitLake === 'boolean' ? sh.hitLake : pr.insideContour;
        var wellSeed = Number.isFinite(sh.id) ? sh.id * 13.7 + sIdx : sIdx * 17.3 + 2.1;

        var wu = clamp(sh.xNorm, 0.02, 0.98);
        var wv;
        if (wet && pr.insideContour) {
          var vb = samplePlanVerticalBounds(wu);
          var spread = 0.22 + 0.56 * hash01(wellSeed);
          wv = lerp(vb.vMin, vb.vMax, spread);
        } else {
          wv = 0.22 + 0.56 * hash01(wellSeed + 5.4);
        }

        var wx = mapU(wu);
        var wy = mapV(wv);

        if (wet) {
          var hyd = sampleHydraulics(wu);
          ctx.beginPath();
          ctx.arc(wx, wy, 2.3 + hyd.upwardDrive * 1.4, 0, TWO_PI);
          ctx.fillStyle = isDepths ? 'rgba(84, 236, 248, 0.35)' : 'rgba(48, 196, 168, 0.32)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(wx, wy, 2.1, 0, TWO_PI);
          ctx.fillStyle = '#5ef0de';
          ctx.fill();
          ctx.strokeStyle = '#072830';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(wx, wy, 2.3, 0, TWO_PI);
          ctx.fillStyle = '#c85646';
          ctx.fill();
          ctx.strokeStyle = '#f2ead8';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Current cursorXNorm vertical transect line
      if (Number.isFinite(st.cursorXNorm)) {
        var curU = clamp(st.cursorXNorm, 0, 1);
        var curX = mapU(curU);
        var curInside = curU >= LEFT_EDGE && curU <= RIGHT_EDGE;

        ctx.beginPath();
        ctx.moveTo(curX, ry + 2);
        ctx.lineTo(curX, ry + rh - 2);
        ctx.strokeStyle = curInside
          ? (isDepths ? 'rgba(136, 246, 255, 0.88)' : 'rgba(34, 152, 116, 0.86)')
          : 'rgba(204, 88, 70, 0.86)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Small transect diamond marker at center chord
        var cyMid = mapV(0.50);
        ctx.beginPath();
        ctx.moveTo(curX, cyMid - 3.2);
        ctx.lineTo(curX + 3.0, cyMid);
        ctx.lineTo(curX, cyMid + 3.2);
        ctx.lineTo(curX - 3.0, cyMid);
        ctx.closePath();
        ctx.fillStyle = curInside ? '#7ef7dc' : '#df6c58';
        ctx.fill();
      }

      // Outer planimeter bezel stroke
      drawRoundRectPath(ctx, rx + 0.5, ry + 0.5, rw - 1, rh - 1, 4);
      ctx.strokeStyle = isDepths ? 'rgba(104, 198, 218, 0.45)' : 'rgba(86, 78, 64, 0.55)';
      ctx.lineWidth = 1.0;
      ctx.stroke();

      ctx.restore();
    }

    function inspectAt(px, py, viewport, state) {
      if (!viewport || !Number.isFinite(px) || !Number.isFinite(py)) return null;
      var width = viewport.width || 1280;
      var height = viewport.height || 800;
      var surfaceY = viewport.surfaceY != null ? viewport.surfaceY : Math.round(height * 0.52);
      if (py < surfaceY - 18 || py > height) return null;

      var xNorm = clamp(px / Math.max(1, width), 0, 1);
      var underH = Math.max(1, height - surfaceY);
      var depthFrac = (py - surfaceY) / underH;
      var pr = probeAt(xNorm);
      var theology = (state && state.theology) || 'schism';

      if (Math.abs(py - surfaceY) <= 18) {
        if (pr.insideContour) {
          return {
            stoneId: 'green_surface_border',
            label: 'Green Border Repeating the Buried Lake Outline',
            detail: 'Emerald karst turf and cypresses thrive strictly across [0.17, 0.83], repeating the invisible subterranean contour.',
            xNorm: xNorm,
            depthFrac: 0
          };
        }
        return {
          stoneId: 'thousand_wells',
          label: 'Bleached Dry Calcareous Margin',
          detail: 'Outside [0.17, 0.83], arid fissured limestone lies beyond the sunken lake; vertical bores strike only dry rock.',
          xNorm: xNorm,
          depthFrac: 0
        };
      }

      if (!pr.insideContour) {
        return {
          stoneId: 'thousand_wells',
          label: 'Solid Dry Calcareous Bedrock',
          detail: 'Unbroken fossiliferous limestone outside the lake contour; bores stall at 0.34 depth with zero water.',
          xNorm: xNorm,
          depthFrac: clamp(depthFrac, 0, 1)
        };
      }

      if (theology === 'ascent') {
        return {
          stoneId: 'calcareous_rock_sky',
          label: 'Veiled Subterranean Limestone Strata',
          detail: 'To the Gods of Ascent, the abyss is occluded beneath rock; only living water rising in the wells reveals it.',
          xNorm: xNorm,
          depthFrac: clamp(depthFrac, 0, 1)
        };
      }

      if (depthFrac < pr.rockSkyFrac + 0.04) {
        return {
          stoneId: 'calcareous_rock_sky',
          label: 'Calcareous Rock Sky',
          detail: 'Vaulted limestone cavern ceiling with stalactites enclosing the lapping wave beneath the city.',
          xNorm: xNorm,
          depthFrac: clamp(depthFrac, 0, 1)
        };
      }

      if (depthFrac >= pr.cavernFloorFrac - 0.03) {
        return {
          stoneId: 'religion_depths',
          label: 'First Religion: Gods of the Depths & Feeder Streams',
          detail: 'Deep phreatic streams feeding the subterranean black lake where the First Religion locates Isaura\'s gods.',
          xNorm: xNorm,
          depthFrac: clamp(depthFrac, 0, 1)
        };
      }

      return {
        stoneId: 'subterranean_black_lake',
        label: 'Subterranean Black Lake',
        detail: 'Enclosed obsidian pocket of lapping dark water whose wave pressure drives every sunlit motion above.',
        xNorm: xNorm,
        depthFrac: clamp(depthFrac, 0, 1)
      };
    }

    return {
      getContourBounds: getContourBounds,
      probeAt: probeAt,
      disturbWave: disturbWave,
      step: step,
      sampleHydraulics: sampleHydraulics,
      render: render,
      renderPlanimeter: renderPlanimeter,
      inspectAt: inspectAt
    };
  }

  var api = {
    createKarstDepths: createKarstDepths
  };

  root.IsauraKarstDepths = api;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
