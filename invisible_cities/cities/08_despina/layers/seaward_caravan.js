if (typeof window === "undefined") {
  globalThis.window = globalThis;
}

window.DespinaSeawardCaravan = (function () {
  "use strict";

  var HORIZON_RATIO = 0.55;

  var SPINE_SPEC = [
    { index: 0, id: "spine-0", u: 0.12, peakH: 0.13, width: 0.07, phase: 0.0 },
    { index: 1, id: "spine-1", u: 0.22, peakH: 0.22, width: 0.09, phase: 0.8 },
    { index: 2, id: "spine-2", u: 0.33, peakH: 0.31, width: 0.12, phase: 1.5 },
    { index: 3, id: "spine-3", u: 0.44, peakH: 0.19, width: 0.08, phase: 2.2 },
    { index: 4, id: "spine-4", u: 0.52, peakH: 0.24, width: 0.08, phase: 2.9 },
    { index: 5, id: "spine-5", u: 0.63, peakH: 0.33, width: 0.13, phase: 3.6 },
    { index: 6, id: "spine-6", u: 0.74, peakH: 0.21, width: 0.09, phase: 4.3 },
    { index: 7, id: "spine-7", u: 0.83, peakH: 0.17, width: 0.08, phase: 5.0 },
    { index: 8, id: "spine-8", u: 0.90, peakH: 0.11, width: 0.06, phase: 5.7 }
  ];

  var CHAMBER_SPEC = [
    { index: 0, id: "chamber-0", u: 0.23, v: 0.76, w: 0.23, h: 0.24 },
    { index: 1, id: "chamber-1", u: 0.50, v: 0.76, w: 0.23, h: 0.24 },
    { index: 2, id: "chamber-2", u: 0.77, v: 0.76, w: 0.23, h: 0.24 }
  ];

  var STONES = [
    {
      id: "camel-withers",
      label: "Camel's Withers",
      kind: "spine",
      anchorIndex: 1,
      inscription:
        "Through the shifting slate-silver salt haze on the coastline, the seafarer discerns the proud muscular arch of a camel's withers rising above the grey swells, poised to stride inland away from the desert of the sea."
    },
    {
      id: "anterior-spotted-hump",
      label: "Anterior Spotted Hump",
      kind: "spine",
      anchorIndex: 2,
      inscription:
        "Out of the marine vapor looms the fore-hump, richly dappled in warm ochre and ivory rosettes — and as inland desire deepens toward sanctuary, crowned with feathery date-palm fronds swaying above the salt horizon."
    },
    {
      id: "glittering-fringed-saddle",
      label: "Glittering Fringed Embroidered Saddle",
      kind: "spine",
      anchorIndex: 3,
      inscription:
        "Nestled between the two swaying humps dips an embroidered saddlecloth of crimson, lapis, and gold brocade, its swinging fringe of mirror-sequins and brass bells catching pale sunbeams through the sea vapor."
    },
    {
      id: "posterior-spotted-hump",
      label: "Posterior Swaying Spotted Hump",
      kind: "spine",
      anchorIndex: 5,
      inscription:
        "Advancing and swaying in stately counter-phase to the fore-hump, the tall dappled rear hump rocks with the slow dry cadence of a caravan leading far from the grey brine."
    },
    {
      id: "whitewashed-palace-walls",
      label: "Thick Whitewashed Palace Walls",
      kind: "spine",
      anchorIndex: 7,
      inscription:
        "Along the trailing flank of the horizon mirage, thick chalk-whitewashed palace walls, desert wind-catchers, and lime-plastered domes glow warm ivory against the cool twilight beyond the coast."
    },
    {
      id: "caravan-saddlebag-delicacies",
      label: "Wineskins, Candied Fruit, Date Wine & Tobacco",
      kind: "chamber",
      anchorIndex: 0,
      inscription:
        "Open woven caravan saddlebags reveal the dry inland abundance the sailor craves: taut dark leather wineskins, jewel-glazed candied fruit, sealed flasks of amber date wine, and fragrant bundles of cured golden-brown tobacco leaves."
    },
    {
      id: "palm-freshwater-oasis",
      label: "Palm-Tree Freshwater Oasis",
      kind: "chamber",
      anchorIndex: 1,
      inscription:
        "Where grey salt swells yield to sweet water, slender curved date-palm trunks and layered emerald frond shade overhang a serene turquoise-jade freshwater spring pool trembling with gentle concentric ripples."
    },
    {
      id: "whitewashed-veiled-court",
      label: "Tiled Court & Barefoot Veiled Dancing Girls",
      kind: "chamber",
      anchorIndex: 2,
      inscription:
        "Deep sculpted chalk-whitewashed palace archways open onto a courtyard of cobalt, turquoise, and terracotta geometric tiles, where barefoot girls dance with sinuous arms, half-hidden and half-revealed by drifting translucent veils."
    }
  ];

  var SPINE_AUX_LABELS = {
    0: "Poised Fore-Crest & Bridle Mist",
    4: "Embroidered Saddle Cantle & Tassels",
    6: "Laden Merchant Saddle-Packs",
    8: "Whitewashed Sanctuary Dome"
  };

  var SPINE_STONE_BY_INDEX = {};
  var CHAMBER_STONE_BY_INDEX = {};
  (function initLookupTables() {
    for (var i = 0; i < STONES.length; i++) {
      var st = STONES[i];
      if (st.kind === "spine") {
        SPINE_STONE_BY_INDEX[st.anchorIndex] = st;
      } else if (st.kind === "chamber") {
        CHAMBER_STONE_BY_INDEX[st.anchorIndex] = st;
      }
    }
  })();

  // Deterministic PRNG for precomputed painterly textures (zero Math.random per frame)
  function createRng(seed) {
    var s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  var HIDE_SPOTS = (function buildHideSpots() {
    var rng = createRng(8081972);
    var spots = [];
    // Anchor-bound spots for spine-1 (withers), spine-2 (fore-hump), spine-5 (aft-hump), and flank
    var groups = [
      { anchor: 1, count: 14, spreadX: 0.72, minY: 0.14, maxY: 0.88 },
      { anchor: 2, count: 26, spreadX: 0.78, minY: 0.09, maxY: 0.92 },
      { anchor: 5, count: 28, spreadX: 0.80, minY: 0.08, maxY: 0.92 },
      { anchor: 6, count: 10, spreadX: 0.65, minY: 0.25, maxY: 0.86 }
    ];
    for (var g = 0; g < groups.length; g++) {
      var grp = groups[g];
      for (var i = 0; i < grp.count; i++) {
        var fracY = grp.minY + (grp.maxY - grp.minY) * Math.pow(rng(), 0.85);
        var taper = Math.sin(Math.min(1, Math.max(0.08, fracY)) * Math.PI * 0.88);
        var relX = (rng() * 2 - 1) * grp.spreadX * (0.35 + 0.65 * taper);
        spots.push({
          anchor: grp.anchor,
          relX: relX,
          fracY: fracY,
          rx: 0.045 + rng() * 0.085,
          ry: 0.032 + rng() * 0.062,
          rot: (rng() - 0.5) * 1.1,
          tone: rng(),
          ringed: rng() > 0.42
        });
      }
    }
    return spots;
  })();

  var MIST_WISPS = (function buildMistWisps() {
    var rng = createRng(314159);
    var list = [];
    for (var i = 0; i < 24; i++) {
      list.push({
        u: rng(),
        vOff: (rng() - 0.42) * 0.18,
        w: 0.14 + rng() * 0.26,
        h: 0.012 + rng() * 0.028,
        speed: (0.008 + rng() * 0.018) * (rng() > 0.3 ? 1 : -0.7),
        phase: rng() * Math.PI * 2,
        alpha: 0.12 + rng() * 0.22
      });
    }
    return list;
  })();

  var SEA_FOAM_SPECS = (function buildSeaFoam() {
    var rng = createRng(271828);
    var list = [];
    for (var i = 0; i < 38; i++) {
      var depthFrac = Math.pow(rng(), 1.35);
      list.push({
        u: rng(),
        depthFrac: depthFrac,
        len: 0.04 + rng() * 0.13 * (0.4 + depthFrac),
        phase: rng() * Math.PI * 2,
        drift: (rng() - 0.5) * 0.016,
        bright: 0.35 + rng() * 0.65
      });
    }
    return list;
  })();

  var DUST_MOTES = (function buildDustMotes() {
    var rng = createRng(991133);
    var list = [];
    for (var i = 0; i < 34; i++) {
      list.push({
        u: 0.08 + rng() * 0.84,
        v: 0.14 + rng() * 0.46,
        r: 0.8 + rng() * 2.1,
        phase: rng() * Math.PI * 2,
        speedX: 0.012 + rng() * 0.025,
        speedY: 0.005 + rng() * 0.012
      });
    }
    return list;
  })();

  function clamp(v, lo, hi) {
    if (typeof v !== "number" || !isFinite(v)) return lo;
    return v < lo ? lo : v > hi ? hi : v;
  }

  function clamp01(v, fallback) {
    if (typeof v !== "number" || !isFinite(v)) {
      return fallback !== undefined ? fallback : 0;
    }
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(e0, e1, x) {
    var t = clamp01((x - e0) / (e1 - e0 || 1), 0);
    return t * t * (3 - 2 * t);
  }

  function lerpRgb(c1, c2, t) {
    var k = clamp01(t, 0);
    return [
      Math.round(c1[0] + (c2[0] - c1[0]) * k),
      Math.round(c1[1] + (c2[1] - c1[1]) * k),
      Math.round(c1[2] + (c2[2] - c1[2]) * k)
    ];
  }

  function rgbaStr(rgb, a) {
    var alpha = clamp01(a, 1);
    return "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + alpha.toFixed(4) + ")";
  }

  // Portable 4-segment cubic Bezier ellipse path (works in every browser & mock canvas)
  function addEllipsePath(ctx, cx, cy, rx, ry, rotation) {
    var k = 0.5522847498;
    var rot = rotation || 0;
    var cosR = Math.cos(rot);
    var sinR = Math.sin(rot);

    function tx(px, py) {
      return cx + px * cosR - py * sinR;
    }
    function ty(px, py) {
      return cy + px * sinR + py * cosR;
    }

    var ox = rx * k;
    var oy = ry * k;

    ctx.moveTo(tx(-rx, 0), ty(-rx, 0));
    ctx.bezierCurveTo(tx(-rx, -oy), ty(-rx, -oy), tx(-ox, -ry), ty(-ox, -ry), tx(0, -ry), ty(0, -ry));
    ctx.bezierCurveTo(tx(ox, -ry), ty(ox, -ry), tx(rx, -oy), ty(rx, -oy), tx(rx, 0), ty(rx, 0));
    ctx.bezierCurveTo(tx(rx, oy), ty(rx, oy), tx(ox, ry), ty(ox, ry), tx(0, ry), ty(0, ry));
    ctx.bezierCurveTo(tx(-ox, ry), ty(-ox, ry), tx(-rx, oy), ty(-rx, oy), tx(-rx, 0), ty(-rx, 0));
  }

  function matchesStone(ref, stone) {
    if (!ref || !stone) return false;
    var expectedAnchorId = (stone.kind === "spine" ? "spine-" : "chamber-") + stone.anchorIndex;
    if (typeof ref === "string") {
      return ref === stone.id || ref === expectedAnchorId || ref === stone.label;
    }
    if (typeof ref === "object") {
      if (ref.id && (ref.id === stone.id || ref.id === expectedAnchorId)) return true;
      if (ref.kind === stone.kind && ref.anchorIndex === stone.anchorIndex) return true;
    }
    return false;
  }

  function computeAnchors(width, height, state) {
    var w = typeof width === "number" && isFinite(width) ? width : 800;
    var h = typeof height === "number" && isFinite(height) ? height : 600;
    var st = state || {};
    var reduced = Boolean(st.reducedMotion);
    var motion = reduced ? 0 : 1;
    var t = typeof st.time === "number" && isFinite(st.time) ? st.time : 0;
    var subMode = clamp01(st.subMode, 0);
    var turb = clamp01(st.cuspTurbulence, 0);

    var horizonY = HORIZON_RATIO * h;
    var gait = t * 1.12;
    var spinePoints = [];

    for (var i = 0; i < SPINE_SPEC.length; i++) {
      var spec = SPINE_SPEC[i];
      var stone = SPINE_STONE_BY_INDEX[spec.index] || null;

      // Counter-phase rocking on the two spotted humps (spine-2 and spine-5)
      var humpCounter = spec.index === 2 ? 1 : spec.index === 5 ? -1 : 0;
      // Architectural palace anchors settle slightly calmer as subMode -> 1
      var archCalm = spec.index >= 7 ? 1 - 0.62 * subMode : 1;
      var turbMicro = 1 + 0.32 * turb;

      var dx =
        motion *
        archCalm *
        turbMicro *
        w *
        (0.0042 * Math.sin(gait + spec.phase) +
          0.0038 * humpCounter * Math.cos(gait * 0.92));

      var dy =
        motion *
        archCalm *
        turbMicro *
        h *
        (0.0078 * Math.sin(gait * 1.35 + spec.phase) +
          0.0052 * humpCounter * Math.sin(gait));

      spinePoints.push({
        id: spec.id,
        x: spec.u * w + dx,
        y: horizonY - spec.peakH * h + dy,
        baseY: horizonY,
        width: spec.width * w,
        stoneId: stone ? stone.id : null,
        label: stone ? stone.label : SPINE_AUX_LABELS[spec.index] || spec.id
      });
    }

    var chamberRects = [];
    for (var c = 0; c < CHAMBER_SPEC.length; c++) {
      var cSpec = CHAMBER_SPEC[c];
      var cStone = CHAMBER_STONE_BY_INDEX[cSpec.index] || null;
      var cw = cSpec.w * w;
      var ch = cSpec.h * h;
      var cx = cSpec.u * w;
      var cy = cSpec.v * h;

      chamberRects.push({
        id: cSpec.id,
        x: cx - cw * 0.5,
        y: cy - ch * 0.5,
        w: cw,
        h: ch,
        stoneId: cStone ? cStone.id : null,
        label: cStone ? cStone.label : cSpec.id
      });
    }

    return {
      horizonY: horizonY,
      spinePoints: spinePoints,
      chamberRects: chamberRects
    };
  }

  // Monotone cubic Hermite knots passing cleanly through every spinePoint
  function buildSpineSplineKnots(spinePoints, horizonY) {
    var p0 = spinePoints[0];
    var pLast = spinePoints[spinePoints.length - 1];
    var knots = [];

    knots.push({
      x: p0.x - p0.width * 1.35,
      y: horizonY
    });
    for (var i = 0; i < spinePoints.length; i++) {
      knots.push({
        x: spinePoints[i].x,
        y: spinePoints[i].y
      });
    }
    knots.push({
      x: pLast.x + pLast.width * 1.35,
      y: horizonY
    });

    var n = knots.length;
    var secants = [];
    for (var k = 0; k < n - 1; k++) {
      var dx = Math.max(1e-3, knots[k + 1].x - knots[k].x);
      secants.push((knots[k + 1].y - knots[k].y) / dx);
    }

    var tangents = new Array(n);
    tangents[0] = 0;
    tangents[n - 1] = 0;
    for (var j = 1; j < n - 1; j++) {
      var s0 = secants[j - 1];
      var s1 = secants[j];
      if (s0 * s1 <= 0) {
        // Exact horizontal tangent at hump peaks and saddle hollows — zero overshoot
        tangents[j] = 0;
      } else {
        tangents[j] = (s0 + s1) * 0.5;
        var limit = 2.6 * Math.min(Math.abs(s0), Math.abs(s1));
        if (Math.abs(tangents[j]) > limit) {
          tangents[j] = (tangents[j] < 0 ? -1 : 1) * limit;
        }
      }
    }

    return { knots: knots, tangents: tangents };
  }

  function traceSpineSilhouettePath(ctx, spline, horizonY) {
    var knots = spline.knots;
    var tangents = spline.tangents;
    ctx.beginPath();
    ctx.moveTo(knots[0].x, horizonY + 2);
    ctx.lineTo(knots[0].x, knots[0].y);
    for (var i = 0; i < knots.length - 1; i++) {
      var a = knots[i];
      var b = knots[i + 1];
      var h = b.x - a.x;
      var cp1x = a.x + h / 3;
      var cp1y = a.y + (tangents[i] * h) / 3;
      var cp2x = b.x - h / 3;
      var cp2y = b.y - (tangents[i + 1] * h) / 3;
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, b.x, b.y);
    }
    ctx.lineTo(knots[knots.length - 1].x, horizonY + 2);
    ctx.closePath();
  }

  function evaluateSpineYAtX(spline, x, horizonY) {
    var knots = spline.knots;
    var tangents = spline.tangents;
    if (x <= knots[0].x || x >= knots[knots.length - 1].x) {
      return horizonY;
    }
    for (var i = 0; i < knots.length - 1; i++) {
      var a = knots[i];
      var b = knots[i + 1];
      if (x >= a.x && x <= b.x) {
        var span = Math.max(1e-4, b.x - a.x);
        var t = (x - a.x) / span;
        var t2 = t * t;
        var t3 = t2 * t;
        var h00 = 2 * t3 - 3 * t2 + 1;
        var h10 = t3 - 2 * t2 + t;
        var h01 = -2 * t3 + 3 * t2;
        var h11 = t3 - t2;
        return h00 * a.y + h10 * span * tangents[i] + h01 * b.y + h11 * span * tangents[i + 1];
      }
    }
    return horizonY;
  }

  // Pointed desert / Moorish sanctuary keyhole arch path inside rect
  function traceSanctuaryArchPath(ctx, rx, ry, rw, rh, inset) {
    var pad = inset || 0;
    var x = rx + pad;
    var y = ry + pad;
    var w = Math.max(8, rw - pad * 2);
    var h = Math.max(8, rh - pad * 2);
    var cx = x + w * 0.5;
    var springY = y + h * 0.40;
    var pinchX = w * 0.035;
    var footY = y + h;
    var rCorner = Math.min(w, h) * 0.04;

    ctx.beginPath();
    ctx.moveTo(cx, y);
    // Right pointed ogee/horseshoe arch curve
    ctx.bezierCurveTo(
      cx + w * 0.28,
      y + h * 0.04,
      x + w + pinchX * 0.4,
      y + h * 0.20,
      x + w - pinchX,
      springY
    );
    ctx.quadraticCurveTo(x + w, springY + h * 0.08, x + w, springY + h * 0.16);
    ctx.lineTo(x + w, footY - rCorner);
    ctx.quadraticCurveTo(x + w, footY, x + w - rCorner, footY);
    ctx.lineTo(x + rCorner, footY);
    ctx.quadraticCurveTo(x, footY, x, footY - rCorner);
    ctx.lineTo(x, springY + h * 0.16);
    ctx.quadraticCurveTo(x, springY + h * 0.08, x + pinchX, springY);
    ctx.bezierCurveTo(
      x - pinchX * 0.4,
      y + h * 0.20,
      cx - w * 0.28,
      y + h * 0.04,
      cx,
      y
    );
    ctx.closePath();
  }

  function drawSkyAndSunbeams(ctx, width, height, horizonY, env) {
    var d = env.desireDepth;
    var sub = env.subMode;
    var turb = env.cuspTurbulence;
    var baseAlpha = env.baseAlpha;

    // Slate marine sky -> Caravan amber dusk (subMode=0) / Oasis turquoise-rose twilight (subMode=1)
    var seaTop = [62, 76, 91];
    var seaMid = [110, 127, 141];
    var seaHor = [185, 196, 203];

    var desTop = lerpRgb([38, 49, 78], [26, 54, 79], sub);
    var desMid = lerpRgb([178, 110, 68], [108, 114, 134], sub);
    var desHor = lerpRgb([238, 192, 122], [235, 195, 148], sub);

    var cTop = lerpRgb(seaTop, desTop, d);
    var cMid = lerpRgb(seaMid, desMid, d);
    var cHor = lerpRgb(seaHor, desHor, d);

    var skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, rgbaStr(cTop, 1));
    skyGrad.addColorStop(0.56, rgbaStr(cMid, 1));
    skyGrad.addColorStop(1, rgbaStr(cHor, 1));
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, horizonY + 2);

    // Veiled marine sun / oasis twilight luminary above the saddle
    var sunX = width * (0.47 + (env.pointerNormX - 0.5) * 0.06);
    var sunY = horizonY * (0.31 - d * 0.04);
    var sunR = Math.max(width, height) * (0.24 + 0.08 * d);
    var sunColor = lerpRgb([232, 238, 240], lerpRgb([255, 224, 152], [255, 234, 192], sub), d);

    var sunGlow = ctx.createRadialGradient(sunX, sunY, sunR * 0.03, sunX, sunY, sunR);
    sunGlow.addColorStop(0, rgbaStr(sunColor, 0.48 * env.presence));
    sunGlow.addColorStop(0.32, rgbaStr(sunColor, 0.19 * env.presence));
    sunGlow.addColorStop(1, rgbaStr(sunColor, 0));
    ctx.fillStyle = sunGlow;
    ctx.fillRect(0, 0, width, horizonY);

    // Soft coastal cloud strata / high desert dusk bands
    var bandCount = 5;
    for (var b = 0; b < bandCount; b++) {
      var bf = (b + 0.5) / bandCount;
      var by = horizonY * (0.14 + bf * 0.68);
      var drift = env.motion * Math.sin(env.time * 0.16 + b * 1.7) * width * 0.025;
      var bx = width * (0.18 + ((b * 0.27) % 0.65)) + drift;
      var bw = width * (0.28 + (b % 3) * 0.12);
      var bh = horizonY * (0.045 + (b % 2) * 0.025);
      var cloudRgb = lerpRgb([146, 160, 172], lerpRgb([216, 154, 108], [164, 168, 188], sub), d);

      ctx.save();
      ctx.globalAlpha = baseAlpha * (0.16 * (1 - 0.35 * d) + 0.06 * turb);
      ctx.fillStyle = rgbaStr(cloudRgb, 1);
      ctx.beginPath();
      addEllipsePath(ctx, bx, by, bw, bh, 0);
      ctx.fill();
      ctx.restore();
    }

    // Slanting pale sunbeams piercing coastal mist onto the glittering saddle (spine-3, spine-4)
    var saddleMidX = (env.anchors.spinePoints[3].x + env.anchors.spinePoints[4].x) * 0.5;
    var rayTargets = [
      env.anchors.spinePoints[2].x,
      saddleMidX - width * 0.02,
      saddleMidX + width * 0.025,
      env.anchors.spinePoints[5].x
    ];
    for (var r = 0; r < rayTargets.length; r++) {
      var tx = rayTargets[r];
      var raySpread = width * (r === 1 || r === 2 ? 0.045 : 0.032);
      var pulse = 0.82 + 0.18 * Math.sin(env.time * (env.motion ? 0.65 : 0) + r * 1.4);
      var rayGrad = ctx.createLinearGradient(sunX, sunY * 0.6, tx, horizonY);
      var rayRgb = lerpRgb([228, 236, 240], [255, 223, 154], d);
      var rayStrength = (r === 1 || r === 2 ? 0.16 : 0.09) * pulse * env.presence;
      rayGrad.addColorStop(0, rgbaStr(rayRgb, 0));
      rayGrad.addColorStop(0.35, rgbaStr(rayRgb, rayStrength));
      rayGrad.addColorStop(1, rgbaStr(rayRgb, rayStrength * 0.35));

      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(sunX - raySpread * 0.32, sunY * 0.55);
      ctx.lineTo(sunX + raySpread * 0.32, sunY * 0.55);
      ctx.lineTo(tx + raySpread, horizonY);
      ctx.lineTo(tx - raySpread, horizonY);
      ctx.closePath();
      ctx.fill();
    }

    // Fata Morgana horizon shimmer band along coastline
    var mirageH = height * (0.045 + 0.03 * turb);
    var mirageGrad = ctx.createLinearGradient(0, horizonY - mirageH, 0, horizonY + mirageH * 0.4);
    var mirageRgb = lerpRgb([214, 224, 230], lerpRgb([252, 214, 146], [238, 224, 196], sub), d);
    mirageGrad.addColorStop(0, rgbaStr(mirageRgb, 0));
    mirageGrad.addColorStop(0.65, rgbaStr(mirageRgb, 0.34 + 0.14 * turb));
    mirageGrad.addColorStop(1, rgbaStr(mirageRgb, 0.08));
    ctx.fillStyle = mirageGrad;
    ctx.fillRect(0, horizonY - mirageH, width, mirageH * 1.4);
  }

  function drawDistantDesertDunes(ctx, width, height, horizonY, env) {
    var d = env.desireDepth;
    if (d < 0.06) return;
    var sub = env.subMode;
    var duneAlpha = smoothstep(0.06, 0.75, d) * 0.48;
    var duneRgb = lerpRgb([164, 118, 78], [148, 128, 112], sub);

    ctx.save();
    ctx.globalAlpha = env.baseAlpha * duneAlpha;
    ctx.fillStyle = rgbaStr(duneRgb, 1);
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.bezierCurveTo(
      width * 0.16,
      horizonY - height * 0.045,
      width * 0.34,
      horizonY - height * 0.015,
      width * 0.52,
      horizonY - height * 0.052
    );
    ctx.bezierCurveTo(
      width * 0.70,
      horizonY - height * 0.02,
      width * 0.86,
      horizonY - height * 0.048,
      width,
      horizonY - height * 0.012
    );
    ctx.lineTo(width, horizonY + 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawPalmCrown(ctx, x, y, scaleRadius, swayPhase, env, alpha) {
    if (alpha <= 0.01) return;
    var baseAlpha = env.baseAlpha;
    var sway = env.motion * Math.sin(env.time * 1.05 + swayPhase) * 0.07;

    ctx.save();
    ctx.globalAlpha = baseAlpha * alpha;

    // Slender curved ringed trunk descending toward horizonY
    var trunkBaseX = x - scaleRadius * 0.14;
    var trunkBaseY = env.horizonY;
    var trunkTopX = x;
    var trunkTopY = y + scaleRadius * 0.16;

    ctx.strokeStyle = "rgba(96, 66, 40, 0.88)";
    ctx.lineWidth = Math.max(2.5, scaleRadius * 0.095);
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(trunkBaseX, trunkBaseY);
    ctx.quadraticCurveTo(x + scaleRadius * 0.12, (trunkBaseY + trunkTopY) * 0.5, trunkTopX, trunkTopY);
    ctx.stroke();

    // Hanging golden-amber date clusters under crown heart
    var dateColors = ["rgba(216, 152, 46, 0.92)", "rgba(186, 114, 34, 0.90)"];
    for (var dc = -1; dc <= 1; dc += 2) {
      ctx.fillStyle = dateColors[dc < 0 ? 0 : 1];
      for (var dd = 0; dd < 5; dd++) {
        var dx = trunkTopX + dc * scaleRadius * (0.07 + dd * 0.022);
        var dy = trunkTopY + scaleRadius * (0.06 + dd * 0.045);
        ctx.beginPath();
        addEllipsePath(ctx, dx, dy, scaleRadius * 0.028, scaleRadius * 0.036, 0.2 * dc);
        ctx.fill();
      }
    }

    // Feathery arching pinnate palm fronds crowning the peak
    var frondAngles = [-2.55, -2.15, -1.78, -1.42, -1.08, -0.72, -0.35, -2.85, -0.08];
    for (var f = 0; f < frondAngles.length; f++) {
      var ang = frondAngles[f] + sway * (0.7 + (f % 3) * 0.2);
      var len = scaleRadius * (0.78 + (f % 3) * 0.12);
      var droop = scaleRadius * 0.34;
      var endX = trunkTopX + Math.cos(ang) * len;
      var endY = trunkTopY + Math.sin(ang) * len * 0.62 + droop;
      var midX = trunkTopX + Math.cos(ang) * len * 0.55;
      var midY = trunkTopY + Math.sin(ang) * len * 0.45 - scaleRadius * 0.08;

      var sunlit = f % 2 === 0;
      ctx.strokeStyle = sunlit ? "rgba(74, 142, 92, 0.92)" : "rgba(36, 94, 66, 0.92)";
      ctx.lineWidth = Math.max(1.4, scaleRadius * 0.032);
      ctx.beginPath();
      ctx.moveTo(trunkTopX, trunkTopY);
      ctx.quadraticCurveTo(midX, midY, endX, endY);
      ctx.stroke();

      // Pinnate leaflets along frond spine
      ctx.lineWidth = Math.max(0.9, scaleRadius * 0.016);
      ctx.strokeStyle = sunlit ? "rgba(118, 178, 102, 0.82)" : "rgba(48, 116, 78, 0.80)";
      var steps = 8;
      for (var s = 1; s <= steps; s++) {
        var u = s / (steps + 1);
        var inv = 1 - u;
        var px = inv * inv * trunkTopX + 2 * inv * u * midX + u * u * endX;
        var py = inv * inv * trunkTopY + 2 * inv * u * midY + u * u * endY;
        var leafLen = scaleRadius * 0.16 * Math.sin(u * Math.PI);
        var side = endX >= trunkTopX ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + side * leafLen * 0.55, py + leafLen);
        ctx.moveTo(px, py);
        ctx.lineTo(px - side * leafLen * 0.25, py - leafLen * 0.55);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function drawHorizonSpine(ctx, width, height, spline, env) {
    var pts = env.anchors.spinePoints;
    var horizonY = env.horizonY;
    var d = env.desireDepth;
    var sub = env.subMode;
    var baseAlpha = env.baseAlpha;

    // 1. Clipped continuous camel / caravan / sanctuary horizon body
    ctx.save();
    traceSpineSilhouettePath(ctx, spline, horizonY);
    ctx.clip();

    // Base coat / mist gradient inside silhouette
    var topY = Math.min(pts[2].y, pts[5].y) - height * 0.02;
    var mistDark = [62, 77, 92];
    var mistLight = [96, 111, 125];
    var hideLight = lerpRgb([198, 142, 82], [176, 146, 108], sub * 0.55);
    var hideDark = lerpRgb([106, 68, 40], [88, 72, 62], sub * 0.55);

    var bodyTopRgb = lerpRgb(mistLight, hideLight, d);
    var bodyBotRgb = lerpRgb(mistDark, hideDark, d);

    var bodyGrad = ctx.createLinearGradient(0, topY, 0, horizonY);
    bodyGrad.addColorStop(0, rgbaStr(bodyTopRgb, 0.94));
    bodyGrad.addColorStop(0.58, rgbaStr(lerpRgb(bodyTopRgb, bodyBotRgb, 0.55), 0.96));
    bodyGrad.addColorStop(1, rgbaStr(bodyBotRgb, 0.98));
    ctx.fillStyle = bodyGrad;
    ctx.fillRect(0, topY - 10, width, horizonY - topY + 20);

    // Warm dorsal sun-rim illumination along camel's withers (spine-0, spine-1) and humps (spine-2, spine-5)
    var rimGrad = ctx.createLinearGradient(0, topY, 0, horizonY);
    var rimRgb = lerpRgb([196, 208, 218], [246, 208, 142], d);
    rimGrad.addColorStop(0, rgbaStr(rimRgb, 0.34 + 0.18 * d));
    rimGrad.addColorStop(0.38, rgbaStr(rimRgb, 0.08));
    rimGrad.addColorStop(1, rgbaStr(rimRgb, 0));
    ctx.fillStyle = rimGrad;
    ctx.fillRect(0, topY - 10, width, horizonY - topY + 12);

    // 2. Spotted hide rosettes on withers (spine-1) and swaying humps (spine-2, spine-5)
    // Visible faintly through coastline vapor at d=0, rich dappled pelage as d->1 (softening slightly as oasis subMode->1)
    var spotVisibility = (0.24 + 0.72 * d) * (1 - 0.35 * sub * d);
    for (var s = 0; s < HIDE_SPOTS.length; s++) {
      var sp = HIDE_SPOTS[s];
      var anchorPt = pts[sp.anchor];
      var spotX = anchorPt.x + sp.relX * anchorPt.width;
      var spotY = lerp(anchorPt.y, horizonY, sp.fracY);
      var rx = anchorPt.width * sp.rx;
      var ry = anchorPt.width * sp.ry;

      var darkSpot = lerpRgb([46, 58, 70], [82, 48, 26], d);
      var creamHalo = lerpRgb([130, 144, 156], [234, 198, 144], d);

      if (sp.ringed && d > 0.12) {
        ctx.fillStyle = rgbaStr(creamHalo, spotVisibility * 0.42);
        ctx.beginPath();
        addEllipsePath(ctx, spotX, spotY, rx * 1.32, ry * 1.32, sp.rot);
        ctx.fill();
      }
      ctx.fillStyle = rgbaStr(darkSpot, spotVisibility * (0.45 + 0.35 * sp.tone));
      ctx.beginPath();
      addEllipsePath(ctx, spotX, spotY, rx, ry, sp.rot);
      ctx.fill();
    }

    // 3. Withers crimson-and-brass harness strap (spine-0 .. spine-1)
    var p0 = pts[0];
    var p1 = pts[1];
    var harnessAlpha = 0.22 + 0.72 * d;
    ctx.strokeStyle = rgbaStr(lerpRgb([92, 98, 108], [164, 42, 38], d), harnessAlpha);
    ctx.lineWidth = Math.max(2, width * 0.0042);
    ctx.beginPath();
    ctx.moveTo(p0.x - p0.width * 0.32, lerp(p0.y, horizonY, 0.48));
    ctx.quadraticCurveTo(
      (p0.x + p1.x) * 0.5,
      lerp(p1.y, horizonY, 0.62),
      p1.x + p1.width * 0.45,
      lerp(p1.y, horizonY, 0.36)
    );
    ctx.stroke();

    // Gold harness stud medallions along withers
    ctx.fillStyle = rgbaStr(lerpRgb([188, 196, 202], [242, 198, 94], d), harnessAlpha);
    for (var hs = 0; hs < 5; hs++) {
      var hu = hs / 4;
      var hx = lerp(p0.x - p0.width * 0.25, p1.x + p1.width * 0.38, hu);
      var hy = lerp(lerp(p0.y, horizonY, 0.50), lerp(p1.y, horizonY, 0.38), hu) + Math.sin(hu * Math.PI) * height * 0.012;
      ctx.beginPath();
      ctx.arc(hx, hy, Math.max(1.5, width * 0.0022), 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Embroidered Saddlecloth draped between humps (spine-3, spine-4)
    var p2 = pts[2];
    var p3 = pts[3];
    var p4 = pts[4];
    var p5 = pts[5];
    var saddleLeft = lerp(p2.x, p3.x, 0.42);
    var saddleRight = lerp(p4.x, p5.x, 0.52);
    var saddleW = saddleRight - saddleLeft;
    var saddleBottom = horizonY - height * 0.028;
    var saddleAlpha = 0.30 + 0.68 * d;

    // Rich madder-crimson & lapis woven saddlecloth body
    var clothCrimson = lerpRgb([78, 84, 96], [158, 36, 44], d);
    var clothLapis = lerpRgb([64, 76, 92], [34, 68, 118], d);
    var clothGold = lerpRgb([188, 196, 200], [238, 192, 88], d);
    var clothTurq = lerpRgb([96, 114, 124], [46, 144, 138], d);

    ctx.fillStyle = rgbaStr(clothCrimson, saddleAlpha);
    ctx.beginPath();
    ctx.moveTo(saddleLeft, topY);
    ctx.lineTo(saddleRight, topY);
    ctx.lineTo(saddleRight - saddleW * 0.06, saddleBottom - height * 0.014);
    ctx.quadraticCurveTo(
      (saddleLeft + saddleRight) * 0.5,
      saddleBottom + height * 0.022,
      saddleLeft + saddleW * 0.06,
      saddleBottom - height * 0.014
    );
    ctx.closePath();
    ctx.fill();

    // Inner lapis & turquoise brocade panel
    ctx.fillStyle = rgbaStr(clothLapis, saddleAlpha * 0.92);
    ctx.beginPath();
    ctx.moveTo(saddleLeft + saddleW * 0.14, topY);
    ctx.lineTo(saddleRight - saddleW * 0.14, topY);
    ctx.lineTo(saddleRight - saddleW * 0.18, saddleBottom - height * 0.028);
    ctx.quadraticCurveTo(
      (saddleLeft + saddleRight) * 0.5,
      saddleBottom - height * 0.004,
      saddleLeft + saddleW * 0.18,
      saddleBottom - height * 0.028
    );
    ctx.closePath();
    ctx.fill();

    // Gold geometric diamond medallions across embroidered saddlecloth
    var medCount = 4;
    for (var m = 0; m < medCount; m++) {
      var mf = (m + 0.5) / medCount;
      var mx = lerp(saddleLeft + saddleW * 0.2, saddleRight - saddleW * 0.2, mf);
      var ridgeY = evaluateSpineYAtX(spline, mx, horizonY);
      var my = lerp(ridgeY, saddleBottom, 0.52);
      var mdx = saddleW * 0.055;
      var mdy = height * 0.022;

      ctx.strokeStyle = rgbaStr(clothGold, saddleAlpha * 0.95);
      ctx.lineWidth = Math.max(1.1, width * 0.0016);
      ctx.beginPath();
      ctx.moveTo(mx, my - mdy);
      ctx.lineTo(mx + mdx, my);
      ctx.lineTo(mx, my + mdy);
      ctx.lineTo(mx - mdx, my);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = rgbaStr(clothTurq, saddleAlpha * 0.85);
      ctx.beginPath();
      ctx.arc(mx, my, Math.max(1.4, mdx * 0.34), 0, Math.PI * 2);
      ctx.fill();
    }

    // Gold brocade trim along lower catenary edge of saddlecloth
    ctx.strokeStyle = rgbaStr(clothGold, saddleAlpha);
    ctx.lineWidth = Math.max(1.8, width * 0.0028);
    ctx.beginPath();
    ctx.moveTo(saddleLeft + saddleW * 0.06, saddleBottom - height * 0.014);
    ctx.quadraticCurveTo(
      (saddleLeft + saddleRight) * 0.5,
      saddleBottom + height * 0.022,
      saddleRight - saddleW * 0.06,
      saddleBottom - height * 0.014
    );
    ctx.stroke();

    // 5. Merchant Caravan Saddle-Packs along spine-6..spine-8 (rich when subMode near 0)
    var packStrength = d * (1 - 0.65 * sub);
    if (packStrength > 0.03) {
      var p6 = pts[6];
      var packLeft = p6.x - p6.width * 0.55;
      var packRight = pts[7].x + pts[7].width * 0.35;
      var packW = packRight - packLeft;
      var packTop = p6.y + height * 0.012;

      // Striped kilim bale & bound cedar spice chest
      ctx.fillStyle = rgbaStr([142, 54, 42], packStrength * 0.82);
      ctx.fillRect(packLeft, packTop, packW * 0.58, horizonY - packTop);

      var stripeColors = [
        [224, 174, 78],
        [38, 86, 118],
        [188, 76, 48],
        [236, 218, 178]
      ];
      for (var st = 0; st < 5; st++) {
        var sy = lerp(packTop + height * 0.015, horizonY - height * 0.02, st / 5);
        ctx.fillStyle = rgbaStr(stripeColors[st % stripeColors.length], packStrength * 0.78);
        ctx.fillRect(packLeft, sy, packW * 0.58, height * 0.011);
      }

      // Leather lashing cords
      ctx.strokeStyle = rgbaStr([58, 34, 20], packStrength * 0.85);
      ctx.lineWidth = Math.max(1.2, width * 0.0018);
      for (var lc = 0; lc < 3; lc++) {
        var lx = packLeft + packW * (0.12 + lc * 0.18);
        ctx.beginPath();
        ctx.moveTo(lx, packTop);
        ctx.lineTo(lx + packW * 0.05, horizonY);
        ctx.stroke();
      }
    }

    // 6. Thick Whitewashed Palace Walls, Wind-Catchers & Sanctuary Dome (spine-7, spine-8)
    // Present softly with desireDepth around spine-7 (Stone 5) and blossoms grandly as subMode -> 1
    var wallStrength = clamp01(d * (0.38 + 0.62 * sub) + 0.14 * sub, 0);
    if (wallStrength > 0.04) {
      var p7 = pts[7];
      var p8 = pts[8];
      var wallStart = lerp(pts[6].x + pts[6].width * 0.1, pts[6].x - pts[6].width * 0.35, sub);
      var wallEnd = p8.x + p8.width * 1.1;

      var chalkSun = lerpRgb([186, 194, 202], [247, 239, 224], d);
      var chalkShade = lerpRgb([118, 132, 148], [156, 168, 188], d);
      var lampWarm = [246, 188, 92];

      // Main battered whitewashed fortification wall mass
      var wTop = Math.min(p7.y, p8.y) - height * 0.01;
      ctx.fillStyle = rgbaStr(chalkSun, wallStrength * 0.94);
      ctx.fillRect(wallStart, wTop, wallEnd - wallStart, horizonY - wTop);

      // Thick wall reveal bevels (showing deep limestone/adobe wall thickness)
      var stepBlocks = [
        { x: wallStart, w: (p7.x - wallStart) * 0.85, shadeW: width * 0.012 },
        { x: p7.x - p7.width * 0.42, w: p7.width * 0.92, shadeW: width * 0.015 },
        { x: p8.x - p8.width * 0.48, w: p8.width * 1.05, shadeW: width * 0.012 }
      ];
      for (var sb = 0; sb < stepBlocks.length; sb++) {
        var blk = stepBlocks[sb];
        ctx.fillStyle = rgbaStr(chalkShade, wallStrength * 0.82);
        ctx.fillRect(blk.x + blk.w - blk.shadeW, wTop, blk.shadeW, horizonY - wTop);

        // Warm recessed keyhole windows in the thick walls
        var winX = blk.x + (blk.w - blk.shadeW) * 0.5;
        var winY = lerp(p7.y, horizonY, 0.48 + sb * 0.08);
        var winW = Math.max(4, width * 0.0085);
        var winH = Math.max(7, height * 0.024);

        // Deep whitewashed window reveal
        ctx.fillStyle = rgbaStr(chalkShade, wallStrength * 0.9);
        ctx.beginPath();
        ctx.arc(winX, winY, winW * 0.65, Math.PI, 0);
        ctx.lineTo(winX + winW * 0.65, winY + winH);
        ctx.lineTo(winX - winW * 0.65, winY + winH);
        ctx.closePath();
        ctx.fill();

        // Warm interior amber sanctuary glow
        ctx.fillStyle = rgbaStr(lampWarm, wallStrength * (0.55 + 0.35 * d));
        ctx.beginPath();
        ctx.arc(winX - winW * 0.12, winY + 1, winW * 0.44, Math.PI, 0);
        ctx.lineTo(winX + winW * 0.32, winY + winH);
        ctx.lineTo(winX - winW * 0.56, winY + winH);
        ctx.closePath();
        ctx.fill();
      }

      // Wind-catcher vertical cedar louvers at spine-7
      for (var lv = -1; lv <= 1; lv++) {
        var lvx = p7.x + lv * width * 0.0065;
        var lvy = p7.y + height * 0.022;
        ctx.fillStyle = rgbaStr([74, 58, 48], wallStrength * 0.78);
        ctx.fillRect(lvx - 1, lvy, Math.max(1.6, width * 0.0022), height * 0.032);
      }
    }

    ctx.restore(); // End clipped silhouette interior

    // 7. Unclipped Sanctuary Dome Finial & Wind-Catcher Cap (spine-7, spine-8) when oasis/palace rises
    if (wallStrength > 0.18) {
      var p7u = pts[7];
      var p8u = pts[8];
      ctx.save();
      ctx.globalAlpha = baseAlpha * wallStrength * 0.88;

      // Smooth lime-plastered dome cap over spine-8
      var domeRgb = lerpRgb([196, 204, 212], [250, 243, 230], d);
      ctx.fillStyle = rgbaStr(domeRgb, 1);
      ctx.beginPath();
      ctx.arc(p8u.x, p8u.y + p8u.width * 0.32, p8u.width * 0.36, Math.PI, 0);
      ctx.closePath();
      ctx.fill();

      // Golden brass crescent/spire finial on dome
      ctx.strokeStyle = rgbaStr([238, 194, 92], 0.9);
      ctx.lineWidth = Math.max(1.2, width * 0.0016);
      ctx.beginPath();
      ctx.moveTo(p8u.x, p8u.y + 2);
      ctx.lineTo(p8u.x, p8u.y - height * 0.018);
      ctx.stroke();

      // Flat chalk cornice over wind-catcher tower at spine-7
      ctx.fillStyle = rgbaStr(domeRgb, 0.95);
      ctx.fillRect(p7u.x - p7u.width * 0.28, p7u.y + 1, p7u.width * 0.56, height * 0.008);
      ctx.restore();
    }

    // 8. Carved Saddle Pommel & Cantle + Glittering Swinging Fringe (spine-3, spine-4)
    // Prominent even at desireDepth ~ 0 where pale sunbeams catch glittering fringe through sea vapor!
    drawGlitteringSaddleFringe(ctx, width, height, spline, env);

    // 9. Oasis Date-Palm Crowns emerging at spine-2 & spine-5 as subMode -> 1
    var palmAlpha = clamp01(d * smoothstep(0.12, 0.92, sub), 0);
    if (palmAlpha > 0.01) {
      drawPalmCrown(ctx, pts[2].x, pts[2].y, pts[2].width * 0.95, 0.4, env, palmAlpha);
      drawPalmCrown(ctx, pts[5].x, pts[5].y, pts[5].width * 1.02, 2.3, env, palmAlpha);
    }
  }

  function drawGlitteringSaddleFringe(ctx, width, height, spline, env) {
    var pts = env.anchors.spinePoints;
    var p2 = pts[2];
    var p3 = pts[3];
    var p4 = pts[4];
    var p5 = pts[5];
    var horizonY = env.horizonY;
    var d = env.desireDepth;

    var startX = lerp(p2.x, p3.x, 0.46);
    var endX = lerp(p4.x, p5.x, 0.48);
    var midX = (startX + endX) * 0.5;
    var startY = lerp(evaluateSpineYAtX(spline, startX, horizonY), horizonY, 0.56);
    var endY = lerp(evaluateSpineYAtX(spline, endX, horizonY), horizonY, 0.56);
    var sagY = horizonY - height * 0.012;

    // Carved brass-tipped saddle pommel (spine-3 edge) and cantle (spine-4 peak)
    ctx.save();
    var pommelGold = lerpRgb([208, 218, 224], [248, 206, 102], d);
    ctx.fillStyle = rgbaStr(pommelGold, 0.52 + 0.44 * d);
    ctx.beginPath();
    ctx.arc(p3.x, p3.y + 2, Math.max(2.2, width * 0.0032), 0, Math.PI * 2);
    ctx.arc(p4.x, p4.y + 2, Math.max(2.5, width * 0.0036), 0, Math.PI * 2);
    ctx.fill();

    // Swinging gold-thread tassels, mirror-sequins & brass bells along catenary curve
    var count = 21;
    for (var i = 0; i < count; i++) {
      var u = i / (count - 1);
      var inv = 1 - u;
      var bx = inv * inv * startX + 2 * inv * u * midX + u * u * endX;
      var by = inv * inv * startY + 2 * inv * u * sagY + u * u * endY;

      var swing =
        env.motion *
        Math.sin(env.time * 2.15 + i * 0.55) *
        width *
        (0.0032 + 0.002 * env.cuspTurbulence);
      var tasselLen = height * (0.022 + 0.012 * Math.sin(u * Math.PI) + (i % 2) * 0.005);
      var tipX = bx + swing;
      var tipY = Math.min(horizonY + height * 0.005, by + tasselLen);

      // Gold/crimson tassel cord
      var isBell = i % 4 === 2;
      var cordRgb = i % 3 === 0 ? lerpRgb([164, 174, 184], [196, 48, 52], d) : pommelGold;
      ctx.strokeStyle = rgbaStr(cordRgb, 0.42 + 0.52 * d);
      ctx.lineWidth = Math.max(1.0, width * 0.0014);
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();

      // Twinkling mirror-sequin / brass bell catching pale sunbeams even at d=0!
      var glintPhase = env.motion ? env.time * 2.9 + i * 1.37 : i * 1.37;
      var sparkle = Math.pow(0.5 + 0.5 * Math.sin(glintPhase), 3);
      var specR = Math.max(1.4, width * (isBell ? 0.0026 : 0.0020));

      var glintRgb = lerpRgb([238, 246, 252], [255, 232, 148], d);
      ctx.fillStyle = rgbaStr(glintRgb, 0.45 + 0.52 * sparkle);
      ctx.beginPath();
      ctx.arc(tipX, tipY, specR, 0, Math.PI * 2);
      ctx.fill();

      // Crisp 4-point specular star spark when sunbeam catches sequin
      if (sparkle > 0.58) {
        var starLen = specR * (2.1 + 1.4 * sparkle);
        ctx.strokeStyle = rgbaStr([255, 250, 228], (sparkle - 0.5) * 1.35);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tipX - starLen, tipY);
        ctx.lineTo(tipX + starLen, tipY);
        ctx.moveTo(tipX, tipY - starLen);
        ctx.lineTo(tipX, tipY + starLen);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawCoastlineHazeRibbons(ctx, width, height, horizonY, env) {
    var d = env.desireDepth;
    var turb = env.cuspTurbulence;
    var baseAlpha = env.baseAlpha;

    // Salt-haze wraps strongly around the horizon when d is near 0, parting gently toward pointer & desireDepth
    var hazeWeight = (1 - 0.64 * d) * (0.85 + 0.45 * turb);
    var mistCool = [176, 190, 200];
    var mistWarm = lerpRgb([232, 196, 146], [224, 212, 196], env.subMode);
    var mistRgb = lerpRgb(mistCool, mistWarm, d);

    for (var i = 0; i < MIST_WISPS.length; i++) {
      var wisp = MIST_WISPS[i];
      var uShift = (wisp.u + (env.motion ? env.time * wisp.speed * (1 + turb * 1.4) : 0)) % 1;
      if (uShift < 0) uShift += 1;
      var wx = uShift * width;
      var wy = horizonY + wisp.vOff * height;
      var ww = wisp.w * width * (1 + 0.25 * turb);
      var wh = wisp.h * height * (1 + 0.35 * turb);

      // Gentle parting of mist near the sailor's pointer gaze
      var distPtr = Math.hypot((wx / width) - env.pointerNormX, (wy / height) - env.pointerNormY);
      var pointerPart = env.hasPointer ? smoothstep(0.04, 0.24, distPtr) : 1;

      var alpha = wisp.alpha * hazeWeight * (0.45 + 0.55 * pointerPart);
      if (alpha < 0.01) continue;

      var grad = ctx.createRadialGradient(wx, wy, ww * 0.05, wx, wy, ww * 0.5);
      grad.addColorStop(0, rgbaStr(mistRgb, alpha));
      grad.addColorStop(0.6, rgbaStr(mistRgb, alpha * 0.45));
      grad.addColorStop(1, rgbaStr(mistRgb, 0));

      ctx.save();
      ctx.globalAlpha = baseAlpha;
      ctx.fillStyle = grad;
      ctx.beginPath();
      addEllipsePath(ctx, wx, wy, ww * 0.5, wh, 0);
      ctx.fill();
      ctx.restore();
    }

    // Golden mirage / salt-crystal motes shearing across the coastline
    var moteCount = DUST_MOTES.length;
    for (var m = 0; m < moteCount; m++) {
      var mote = DUST_MOTES[m];
      var mx = ((mote.u + (env.motion ? env.time * mote.speedX * (1 + turb * 1.8) : 0)) % 1) * width;
      var my = (mote.v + (env.motion ? Math.sin(env.time * 0.9 + mote.phase) * mote.speedY : 0)) * height;
      var twinkle = 0.45 + 0.55 * Math.sin((env.motion ? env.time * 2.2 : 0) + mote.phase);
      var moteAlpha = (0.14 + 0.26 * d + 0.28 * turb) * twinkle;
      var moteRgb = lerpRgb([224, 236, 244], [255, 224, 148], d);

      ctx.fillStyle = rgbaStr(moteRgb, moteAlpha);
      ctx.beginPath();
      ctx.arc(mx, my, mote.r * (1 + 0.3 * turb), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawSeaDesertAndReflections(ctx, width, height, horizonY, env) {
    var d = env.desireDepth;
    var sub = env.subMode;
    var turb = env.cuspTurbulence;
    var seaH = height - horizonY;

    // Grey-slate pelagic desert of the sea -> calm twilight caravan/oasis foreground
    var seaNearHor = lerpRgb([86, 102, 116], lerpRgb([144, 102, 68], [76, 106, 114], sub), d * 0.72);
    var seaMid = lerpRgb([52, 66, 80], lerpRgb([82, 58, 44], [42, 66, 78], sub), d * 0.76);
    var seaDeep = lerpRgb([28, 38, 49], lerpRgb([42, 30, 26], [24, 38, 48], sub), d * 0.8);

    var seaGrad = ctx.createLinearGradient(0, horizonY, 0, height);
    seaGrad.addColorStop(0, rgbaStr(seaNearHor, 1));
    seaGrad.addColorStop(0.45, rgbaStr(seaMid, 1));
    seaGrad.addColorStop(1, rgbaStr(seaDeep, 1));
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, horizonY, width, seaH + 2);

    // Watery vertical reflections of the camel humps, glittering saddle, and whitewashed walls
    var pts = env.anchors.spinePoints;
    for (var p = 1; p <= 7; p++) {
      var pt = pts[p];
      var peakRise = horizonY - pt.y;
      var reflLen = Math.min(seaH * 0.55, peakRise * 0.75);
      var isSaddle = p === 3 || p === 4;
      var isWall = p >= 7;
      var reflRgb = isSaddle
        ? lerpRgb([196, 206, 214], [244, 188, 92], d)
        : isWall
        ? lerpRgb([176, 188, 198], [242, 232, 212], d)
        : lerpRgb([44, 56, 68], [116, 82, 52], d);

      var rGrad = ctx.createLinearGradient(0, horizonY, 0, horizonY + reflLen);
      rGrad.addColorStop(0, rgbaStr(reflRgb, isSaddle ? 0.28 : 0.20));
      rGrad.addColorStop(1, rgbaStr(reflRgb, 0));
      ctx.fillStyle = rGrad;
      ctx.beginPath();
      addEllipsePath(ctx, pt.x, horizonY + reflLen * 0.35, pt.width * 0.52, reflLen * 0.55, 0);
      ctx.fill();
    }

    // Perspective pelagic sea swells across y > horizonY
    var swellRows = 16;
    var wavePresence = (1 - 0.52 * d) * (0.88 + 0.32 * turb);
    for (var r = 0; r < swellRows; r++) {
      var rf = r / (swellRows - 1);
      var persp = Math.pow(rf, 1.55);
      var wy = horizonY + seaH * (0.02 + 0.94 * persp);
      var amp = height * (0.002 + 0.007 * persp) * (1 + 0.65 * turb);
      var phase = (env.motion ? env.time * (0.85 + rf * 0.4) : 0) + r * 1.15;

      // Dark brine trough
      ctx.strokeStyle = rgbaStr([20, 30, 40], 0.26 * wavePresence * (0.4 + 0.6 * rf));
      ctx.lineWidth = Math.max(1, height * (0.002 + 0.006 * persp));
      ctx.beginPath();
      var segs = 12;
      for (var s = 0; s <= segs; s++) {
        var sx = (s / segs) * width;
        var sy = wy + Math.sin((s / segs) * Math.PI * 5 + phase) * amp;
        if (s === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Slate-silver crest sheen
      var crestRgb = lerpRgb([188, 202, 212], [238, 202, 146], d * 0.65);
      ctx.strokeStyle = rgbaStr(crestRgb, 0.22 * wavePresence * (1 - 0.3 * rf));
      ctx.lineWidth = Math.max(0.8, height * (0.0012 + 0.0025 * persp));
      ctx.beginPath();
      for (var s2 = 0; s2 <= segs; s2++) {
        var sx2 = (s2 / segs) * width;
        var sy2 = wy - amp * 0.45 + Math.sin((s2 / segs) * Math.PI * 5 + phase + 0.3) * amp * 0.85;
        if (s2 === 0) ctx.moveTo(sx2, sy2);
        else ctx.lineTo(sx2, sy2);
      }
      ctx.stroke();
    }

    // Salt-foam spindrift streaks on the swells
    for (var f = 0; f < SEA_FOAM_SPECS.length; f++) {
      var fm = SEA_FOAM_SPECS[f];
      var fy = horizonY + seaH * (0.04 + 0.92 * fm.depthFrac);
      var fu = (fm.u + (env.motion ? env.time * fm.drift * (1 + turb) : 0)) % 1;
      if (fu < 0) fu += 1;
      var fx = fu * width;
      var fw = fm.len * width * (1 + 0.35 * turb);
      var foamAlpha = (0.14 + 0.22 * turb) * fm.bright * (1 - 0.62 * d);
      if (foamAlpha < 0.01) continue;

      ctx.strokeStyle = rgbaStr([216, 228, 236], foamAlpha);
      ctx.lineWidth = Math.max(0.9, height * 0.0018 * (0.5 + fm.depthFrac));
      ctx.beginPath();
      ctx.moveTo(fx - fw * 0.5, fy);
      ctx.quadraticCurveTo(fx, fy - height * 0.003, fx + fw * 0.5, fy + height * 0.001);
      ctx.stroke();
    }
  }

  // Chamber 0 (u=0.23): Wineskins, candied fruit, date wine & tobacco leaves
  function paintChamberSaddlebags(ctx, rect, env) {
    var x = rect.x;
    var y = rect.y;
    var w = rect.w;
    var h = rect.h;

    // Warm woven caravan saddlebag (khorjin) backdrop
    var bgGrad = ctx.createLinearGradient(x, y, x, y + h);
    bgGrad.addColorStop(0, "rgba(74, 28, 26, 1)");
    bgGrad.addColorStop(0.55, "rgba(112, 44, 32, 1)");
    bgGrad.addColorStop(1, "rgba(56, 26, 20, 1)");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(x, y, w, h);

    // Woven kilim horizontal bands & geometric diamonds inside saddlebag
    var bandColors = [
      "rgba(186, 122, 52, 0.34)",
      "rgba(36, 76, 106, 0.38)",
      "rgba(218, 172, 84, 0.28)"
    ];
    for (var b = 0; b < 5; b++) {
      var by = y + h * (0.12 + b * 0.16);
      ctx.fillStyle = bandColors[b % bandColors.length];
      ctx.fillRect(x, by, w, h * 0.048);
    }

    // Warm golden caravan lantern glow from upper center
    var lamp = ctx.createRadialGradient(x + w * 0.52, y + h * 0.28, w * 0.04, x + w * 0.52, y + h * 0.45, w * 0.62);
    lamp.addColorStop(0, "rgba(255, 214, 132, 0.36)");
    lamp.addColorStop(1, "rgba(255, 180, 80, 0)");
    ctx.fillStyle = lamp;
    ctx.fillRect(x, y, w, h);

    // 1. Taut Dark Leather Wineskin (left side)
    var wsX = x + w * 0.27;
    var wsY = y + h * 0.58;
    ctx.save();
    var leatherGrad = ctx.createRadialGradient(wsX - w * 0.05, wsY - h * 0.08, w * 0.02, wsX, wsY, w * 0.26);
    leatherGrad.addColorStop(0, "rgba(116, 62, 38, 1)");
    leatherGrad.addColorStop(0.55, "rgba(58, 28, 18, 1)");
    leatherGrad.addColorStop(1, "rgba(28, 13, 9, 1)");
    ctx.fillStyle = leatherGrad;
    ctx.beginPath();
    ctx.moveTo(wsX - w * 0.03, y + h * 0.27);
    ctx.bezierCurveTo(wsX + w * 0.14, y + h * 0.34, wsX + w * 0.18, y + h * 0.72, wsX + w * 0.04, y + h * 0.84);
    ctx.bezierCurveTo(wsX - w * 0.16, y + h * 0.88, wsX - w * 0.21, y + h * 0.56, wsX - w * 0.09, y + h * 0.31);
    ctx.closePath();
    ctx.fill();

    // Taut leather specular highlight & stitched seam
    ctx.strokeStyle = "rgba(214, 152, 104, 0.48)";
    ctx.lineWidth = Math.max(1.2, w * 0.012);
    ctx.beginPath();
    ctx.moveTo(wsX - w * 0.06, y + h * 0.36);
    ctx.quadraticCurveTo(wsX - w * 0.13, y + h * 0.58, wsX - w * 0.04, y + h * 0.76);
    ctx.stroke();

    // Wooden spout & crimson cord neck
    ctx.fillStyle = "rgba(168, 114, 62, 1)";
    ctx.fillRect(wsX - w * 0.055, y + h * 0.21, w * 0.05, h * 0.07);
    ctx.strokeStyle = "rgba(198, 46, 48, 0.95)";
    ctx.lineWidth = Math.max(1.4, w * 0.014);
    ctx.beginPath();
    ctx.moveTo(wsX - w * 0.07, y + h * 0.28);
    ctx.lineTo(wsX + w * 0.01, y + h * 0.28);
    ctx.stroke();
    ctx.restore();

    // 2. Sealed Amber Date-Wine Flask / Amphora (upper right-center)
    var flX = x + w * 0.66;
    var flY = y + h * 0.50;
    var wineGrad = ctx.createRadialGradient(flX - w * 0.03, flY, w * 0.015, flX, flY + h * 0.04, w * 0.18);
    wineGrad.addColorStop(0, "rgba(255, 220, 112, 0.98)");
    wineGrad.addColorStop(0.5, "rgba(218, 128, 32, 0.96)");
    wineGrad.addColorStop(1, "rgba(118, 48, 14, 0.98)");
    ctx.fillStyle = wineGrad;
    ctx.beginPath();
    addEllipsePath(ctx, flX, flY + h * 0.06, w * 0.145, h * 0.18, 0);
    ctx.fill();

    // Slender flask neck + crimson wax seal + two amphora handles
    ctx.fillStyle = "rgba(196, 128, 54, 0.92)";
    ctx.fillRect(flX - w * 0.035, y + h * 0.23, w * 0.07, h * 0.16);
    ctx.fillStyle = "rgba(178, 38, 38, 0.98)";
    ctx.beginPath();
    addEllipsePath(ctx, flX, y + h * 0.23, w * 0.046, h * 0.028, 0);
    ctx.fill();

    ctx.strokeStyle = "rgba(232, 176, 92, 0.82)";
    ctx.lineWidth = Math.max(1.2, w * 0.012);
    ctx.beginPath();
    ctx.moveTo(flX - w * 0.035, y + h * 0.29);
    ctx.bezierCurveTo(flX - w * 0.14, y + h * 0.30, flX - w * 0.16, y + h * 0.44, flX - w * 0.11, y + h * 0.48);
    ctx.moveTo(flX + w * 0.035, y + h * 0.29);
    ctx.bezierCurveTo(flX + w * 0.14, y + h * 0.30, flX + w * 0.16, y + h * 0.44, flX + w * 0.11, y + h * 0.48);
    ctx.stroke();

    // Luminous date-wine liquid meniscus & glass caustic
    ctx.fillStyle = "rgba(255, 244, 190, 0.62)";
    ctx.beginPath();
    addEllipsePath(ctx, flX - w * 0.045, flY + h * 0.02, w * 0.032, h * 0.075, -0.25);
    ctx.fill();

    // 3. Fragrant Bundles of Cured Golden-Brown Tobacco Leaves (lower right)
    var tbX = x + w * 0.74;
    var tbY = y + h * 0.80;
    var leafAngles = [-0.65, -0.35, -0.08, 0.20, 0.48];
    var leafTones = [
      "rgba(154, 92, 34, 0.96)",
      "rgba(182, 118, 44, 0.96)",
      "rgba(132, 74, 26, 0.96)",
      "rgba(196, 134, 52, 0.95)",
      "rgba(144, 84, 30, 0.96)"
    ];
    for (var lf = 0; lf < leafAngles.length; lf++) {
      var la = leafAngles[lf];
      ctx.fillStyle = leafTones[lf];
      ctx.beginPath();
      addEllipsePath(ctx, tbX + lf * w * 0.012 - w * 0.03, tbY - h * 0.06, w * 0.052, h * 0.14, la);
      ctx.fill();

      // Golden central midrib vein
      ctx.strokeStyle = "rgba(234, 184, 98, 0.62)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tbX - w * 0.01, tbY + h * 0.05);
      ctx.lineTo(
        tbX - w * 0.01 + Math.sin(la) * w * 0.12,
        tbY - h * 0.17 + Math.abs(la) * h * 0.04
      );
      ctx.stroke();
    }
    // Hemp twine binding around tobacco sheaf
    ctx.strokeStyle = "rgba(228, 196, 134, 0.92)";
    ctx.lineWidth = Math.max(1.5, w * 0.015);
    ctx.beginPath();
    ctx.moveTo(tbX - w * 0.08, tbY + h * 0.01);
    ctx.lineTo(tbX + w * 0.06, tbY + h * 0.03);
    ctx.stroke();

    // Subtle rising warm aromatic wisp above cured tobacco
    var wispShift = env.motion ? Math.sin(env.time * 1.4) * w * 0.02 : 0;
    ctx.strokeStyle = "rgba(244, 214, 158, 0.24)";
    ctx.lineWidth = Math.max(1, w * 0.01);
    ctx.beginPath();
    ctx.moveTo(tbX, tbY - h * 0.18);
    ctx.bezierCurveTo(tbX - w * 0.04 + wispShift, tbY - h * 0.28, tbX + w * 0.05 - wispShift, tbY - h * 0.36, tbX + wispShift, tbY - h * 0.45);
    ctx.stroke();

    // 4. Jewel-like Glazed Candied Fruit in Hammered Brass Dish (foreground center)
    var dishX = x + w * 0.47;
    var dishY = y + h * 0.84;

    // Candied fruit jewels (ruby pomegranate/citron, emerald fig, amber apricot, topaz orange)
    var fruits = [
      { dx: -0.10, dy: -0.05, rx: 0.055, ry: 0.042, rot: -0.2, c: "rgba(214, 42, 62, 0.96)" },
      { dx: -0.03, dy: -0.08, rx: 0.052, ry: 0.044, rot: 0.1, c: "rgba(44, 158, 96, 0.96)" },
      { dx: 0.05, dy: -0.07, rx: 0.058, ry: 0.042, rot: 0.3, c: "rgba(242, 158, 38, 0.97)" },
      { dx: 0.11, dy: -0.04, rx: 0.048, ry: 0.038, rot: -0.3, c: "rgba(228, 84, 36, 0.96)" },
      { dx: 0.00, dy: -0.03, rx: 0.054, ry: 0.040, rot: 0.0, c: "rgba(248, 196, 56, 0.97)" }
    ];
    for (var fr = 0; fr < fruits.length; fr++) {
      var jf = fruits[fr];
      var fx = dishX + jf.dx * w;
      var fy = dishY + jf.dy * h;
      ctx.fillStyle = jf.c;
      ctx.beginPath();
      addEllipsePath(ctx, fx, fy, jf.rx * w, jf.ry * h, jf.rot);
      ctx.fill();

      // Sugar-glaze crystalline specular glint
      ctx.fillStyle = "rgba(255, 250, 232, 0.78)";
      ctx.beginPath();
      ctx.arc(fx - jf.rx * w * 0.28, fy - jf.ry * h * 0.28, Math.max(1.1, w * 0.011), 0, Math.PI * 2);
      ctx.fill();
    }

    // Hammered brass shallow bowl cradling the candied fruits
    var brassGrad = ctx.createLinearGradient(dishX - w * 0.18, dishY, dishX + w * 0.18, dishY);
    brassGrad.addColorStop(0, "rgba(148, 102, 34, 1)");
    brassGrad.addColorStop(0.5, "rgba(246, 206, 106, 1)");
    brassGrad.addColorStop(1, "rgba(136, 90, 28, 1)");
    ctx.fillStyle = brassGrad;
    ctx.beginPath();
    ctx.moveTo(dishX - w * 0.18, dishY - h * 0.02);
    ctx.quadraticCurveTo(dishX, dishY + h * 0.10, dishX + w * 0.18, dishY - h * 0.02);
    ctx.lineTo(dishX + w * 0.14, dishY + h * 0.04);
    ctx.quadraticCurveTo(dishX, dishY + h * 0.11, dishX - w * 0.14, dishY + h * 0.04);
    ctx.closePath();
    ctx.fill();
  }

  // Chamber 1 (u=0.50): Palm-tree freshwater oasis
  function paintChamberOasis(ctx, rect, env) {
    var x = rect.x;
    var y = rect.y;
    var w = rect.w;
    var h = rect.h;

    // Serene oasis twilight sky
    var sky = ctx.createLinearGradient(x, y, x, y + h * 0.56);
    sky.addColorStop(0, "rgba(26, 74, 96, 1)");
    sky.addColorStop(0.58, "rgba(84, 146, 148, 1)");
    sky.addColorStop(1, "rgba(238, 202, 148, 1)");
    ctx.fillStyle = sky;
    ctx.fillRect(x, y, w, h * 0.60);

    // Warm rose-ochre sandstone oasis banks
    ctx.fillStyle = "rgba(196, 142, 96, 1)";
    ctx.beginPath();
    ctx.moveTo(x, y + h * 0.52);
    ctx.quadraticCurveTo(x + w * 0.28, y + h * 0.45, x + w * 0.52, y + h * 0.53);
    ctx.quadraticCurveTo(x + w * 0.78, y + h * 0.46, x + w, y + h * 0.52);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fill();

    // Turquoise-jade freshwater spring pool
    var poolX = x + w * 0.50;
    var poolY = y + h * 0.75;
    var poolGrad = ctx.createRadialGradient(poolX, poolY - h * 0.03, w * 0.03, poolX, poolY, w * 0.48);
    poolGrad.addColorStop(0, "rgba(116, 232, 212, 1)");
    poolGrad.addColorStop(0.45, "rgba(32, 164, 158, 1)");
    poolGrad.addColorStop(0.85, "rgba(18, 98, 108, 1)");
    poolGrad.addColorStop(1, "rgba(24, 68, 78, 1)");
    ctx.fillStyle = poolGrad;
    ctx.beginPath();
    addEllipsePath(ctx, poolX, poolY, w * 0.45, h * 0.21, 0);
    ctx.fill();

    // Gentle concentric ripples on the freshwater spring
    var rippleCount = 4;
    for (var rp = 0; rp < rippleCount; rp++) {
      var prog = env.motion ? ((env.time * 0.28 + rp / rippleCount) % 1) : (rp + 0.35) / rippleCount;
      var rrx = w * (0.06 + prog * 0.35);
      var rry = h * (0.025 + prog * 0.14);
      var rAlpha = (1 - prog) * 0.58;
      ctx.strokeStyle = "rgba(208, 252, 244, " + rAlpha.toFixed(3) + ")";
      ctx.lineWidth = Math.max(0.9, w * 0.008);
      ctx.beginPath();
      addEllipsePath(ctx, poolX, poolY - h * 0.01, rrx, rry, 0);
      ctx.stroke();
    }

    // Lush emerald oasis reeds & bank moss framing the pool
    ctx.fillStyle = "rgba(36, 118, 78, 0.9)";
    for (var rd = 0; rd < 9; rd++) {
      var side = rd < 5 ? -1 : 1;
      var rxBase = poolX + side * w * (0.28 + (rd % 4) * 0.045);
      var ryBase = poolY + h * (0.04 + (rd % 3) * 0.03);
      ctx.beginPath();
      ctx.moveTo(rxBase - 2, ryBase);
      ctx.quadraticCurveTo(rxBase + side * 4, ryBase - h * 0.10, rxBase + side * 8, ryBase - h * 0.15);
      ctx.lineTo(rxBase + 2, ryBase);
      ctx.closePath();
      ctx.fill();
    }

    // Two slender curved date-palm trunks arching inward over the spring
    var sway = env.motion ? Math.sin(env.time * 0.95) * w * 0.018 : 0;
    var palms = [
      { bx: x + w * 0.14, by: y + h * 0.72, cx: x + w * 0.22, cy: y + h * 0.42, tx: x + w * 0.37 + sway, ty: y + h * 0.24 },
      { bx: x + w * 0.86, by: y + h * 0.70, cx: x + w * 0.79, cy: y + h * 0.44, tx: x + w * 0.65 + sway * 0.8, ty: y + h * 0.28 }
    ];

    for (var p = 0; p < palms.length; p++) {
      var pm = palms[p];
      ctx.strokeStyle = "rgba(92, 62, 36, 0.96)";
      ctx.lineWidth = Math.max(3, w * 0.036);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(pm.bx, pm.by);
      ctx.quadraticCurveTo(pm.cx, pm.cy, pm.tx, pm.ty);
      ctx.stroke();

      // Golden bark rings
      ctx.strokeStyle = "rgba(164, 118, 68, 0.55)";
      ctx.lineWidth = 1;
      for (var rg = 1; rg <= 6; rg++) {
        var u = rg / 7;
        var inv = 1 - u;
        var kx = inv * inv * pm.bx + 2 * inv * u * pm.cx + u * u * pm.tx;
        var ky = inv * inv * pm.by + 2 * inv * u * pm.cy + u * u * pm.ty;
        ctx.beginPath();
        ctx.moveTo(kx - w * 0.018, ky);
        ctx.lineTo(kx + w * 0.018, ky + 1.5);
        ctx.stroke();
      }

      // Golden date clusters
      ctx.fillStyle = "rgba(228, 164, 48, 0.95)";
      ctx.beginPath();
      addEllipsePath(ctx, pm.tx - w * 0.02, pm.ty + h * 0.035, w * 0.022, h * 0.032, 0.2);
      addEllipsePath(ctx, pm.tx + w * 0.02, pm.ty + h * 0.038, w * 0.022, h * 0.032, -0.2);
      ctx.fill();

      // Layered emerald & sunlit chartreuse palm frond canopy
      var angles = [-2.7, -2.2, -1.7, -1.2, -0.7, -0.25, 0.15];
      for (var a = 0; a < angles.length; a++) {
        var ang = angles[a];
        var flen = w * (0.22 + (a % 2) * 0.05);
        var fxEnd = pm.tx + Math.cos(ang) * flen;
        var fyEnd = pm.ty + Math.sin(ang) * flen * 0.65 + h * 0.09;
        var fxMid = pm.tx + Math.cos(ang) * flen * 0.52;
        var fyMid = pm.ty + Math.sin(ang) * flen * 0.45 - h * 0.03;

        ctx.strokeStyle = a % 2 === 0 ? "rgba(56, 152, 92, 0.94)" : "rgba(26, 98, 66, 0.94)";
        ctx.lineWidth = Math.max(1.5, w * 0.015);
        ctx.beginPath();
        ctx.moveTo(pm.tx, pm.ty);
        ctx.quadraticCurveTo(fxMid, fyMid, fxEnd, fyEnd);
        ctx.stroke();
      }
    }
  }

  // Chamber 2 (u=0.77): Thick whitewashed walls & tiled courts with barefoot veiled dancing girls
  function paintChamberVeiledCourt(ctx, rect, env) {
    var x = rect.x;
    var y = rect.y;
    var w = rect.w;
    var h = rect.h;

    // Deep indigo sanctuary dusk visible beyond inner whitewashed courtyard arch
    var nightGrad = ctx.createLinearGradient(x, y, x, y + h * 0.62);
    nightGrad.addColorStop(0, "rgba(24, 38, 72, 1)");
    nightGrad.addColorStop(0.65, "rgba(52, 72, 108, 1)");
    nightGrad.addColorStop(1, "rgba(196, 158, 118, 1)");
    ctx.fillStyle = nightGrad;
    ctx.fillRect(x, y, w, h * 0.62);

    // Thick Sculpted Chalk-Whitewashed Palace Walls & Deep Recessed Courtyard Arcade
    var floorY = y + h * 0.58;
    // Left & right thick chalk-whitewashed piers + arched soffit showing deep plaster thickness
    ctx.fillStyle = "rgba(246, 239, 226, 1)";
    ctx.fillRect(x, y, w * 0.22, floorY - y);
    ctx.fillRect(x + w * 0.78, y, w * 0.22, floorY - y);
    ctx.fillRect(x, y, w, h * 0.16);

    // Cool blue-limestone plaster thickness reveal (proving thick whitewashed walls!)
    ctx.fillStyle = "rgba(162, 176, 196, 1)";
    ctx.fillRect(x + w * 0.22, y + h * 0.14, w * 0.075, floorY - (y + h * 0.14));
    ctx.fillRect(x + w * 0.705, y + h * 0.14, w * 0.075, floorY - (y + h * 0.14));

    // Inner whitewashed horseshoe arch spandrel
    ctx.fillStyle = "rgba(238, 230, 214, 1)";
    ctx.beginPath();
    ctx.moveTo(x + w * 0.22, y + h * 0.14);
    ctx.lineTo(x + w * 0.78, y + h * 0.14);
    ctx.lineTo(x + w * 0.78, y + h * 0.36);
    ctx.arc(x + w * 0.50, y + h * 0.36, w * 0.28, 0, Math.PI, true);
    ctx.closePath();
    ctx.fill();

    // Warm sanctuary courtyard lantern glow
    var courtGlow = ctx.createRadialGradient(x + w * 0.5, y + h * 0.44, w * 0.03, x + w * 0.5, y + h * 0.55, w * 0.46);
    courtGlow.addColorStop(0, "rgba(255, 220, 152, 0.42)");
    courtGlow.addColorStop(1, "rgba(255, 190, 110, 0)");
    ctx.fillStyle = courtGlow;
    ctx.fillRect(x, y, w, h);

    // Intricate Cobalt, Turquoise & Terracotta Geometric Tiled Courtyard Floor (Zellij)
    ctx.fillStyle = "rgba(238, 228, 210, 1)";
    ctx.fillRect(x, floorY, w, y + h - floorY);

    // Zellij tile dado strip along base of whitewashed walls
    var dadoH = h * 0.055;
    ctx.fillStyle = "rgba(28, 72, 138, 0.92)";
    ctx.fillRect(x, floorY - dadoH, w * 0.295, dadoH);
    ctx.fillRect(x + w * 0.705, floorY - dadoH, w * 0.295, dadoH);

    // Perspective geometric zellij floor pattern (cobalt stars, turquoise diamonds, terracotta crosses)
    var rows = 5;
    var cols = 7;
    var tilePalette = [
      "rgba(28, 76, 148, 0.90)",    // Cobalt blue
      "rgba(38, 152, 148, 0.90)",   // Persian turquoise
      "rgba(188, 92, 54, 0.90)"     // Terracotta
    ];
    for (var r = 0; r < rows; r++) {
      var rf0 = Math.pow(r / rows, 1.22);
      var rf1 = Math.pow((r + 1) / rows, 1.22);
      var ty0 = floorY + (y + h - floorY) * rf0;
      var ty1 = floorY + (y + h - floorY) * rf1;
      var tyMid = (ty0 + ty1) * 0.5;
      var rowSpread = 1 + rf0 * 0.35;

      for (var c = -1; c <= cols; c++) {
        var normC = (c + 0.5) / cols - 0.5;
        var txMid = x + w * 0.5 + normC * w * rowSpread;
        var radX = (w / cols) * 0.42 * rowSpread;
        var radY = (ty1 - ty0) * 0.42;

        ctx.fillStyle = tilePalette[(r + c + 7) % tilePalette.length];
        ctx.beginPath();
        ctx.moveTo(txMid, tyMid - radY);
        ctx.lineTo(txMid + radX, tyMid);
        ctx.lineTo(txMid, tyMid + radY);
        ctx.lineTo(txMid - radX, tyMid);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Barefoot Veiled Dancing Girls (two graceful figures in depth, sinuous arms & translucent drifting veils)
    var dancers = [
      { cx: x + w * 0.43, footY: y + h * 0.85, scale: 1.0, phase: 0.0, veilRgb: [68, 198, 192], dressRgb: [192, 62, 82] },
      { cx: x + w * 0.63, footY: y + h * 0.78, scale: 0.84, phase: 2.1, veilRgb: [248, 198, 126], dressRgb: [52, 96, 158] }
    ];

    for (var dn = 0; dn < dancers.length; dn++) {
      var dSpec = dancers[dn];
      var sc = dSpec.scale;
      var cadence = env.motion ? env.time * 1.45 + dSpec.phase : dSpec.phase + 0.5;
      var swayX = Math.sin(cadence) * w * 0.022 * sc;
      var armWave = Math.cos(cadence * 1.15);

      var fx = dSpec.cx;
      var fy = dSpec.footY;
      var figH = h * 0.44 * sc;
      var headX = fx + swayX;
      var headY = fy - figH;
      var shoulderY = headY + figH * 0.16;
      var waistX = fx + swayX * 0.55;
      var waistY = headY + figH * 0.44;
      var ankleY = fy - figH * 0.07;

      // Soft reflection on polished zellij tiles
      ctx.fillStyle = "rgba(52, 34, 28, 0.18)";
      ctx.beginPath();
      addEllipsePath(ctx, fx, fy + h * 0.012, w * 0.065 * sc, h * 0.018 * sc, 0);
      ctx.fill();

      // Bare feet & ankles posed delicately in dance step on the cool tiles
      var skinWarm = "rgba(218, 158, 118, 0.96)";
      ctx.strokeStyle = skinWarm;
      ctx.lineWidth = Math.max(1.4, w * 0.016 * sc);
      ctx.lineCap = "round";
      ctx.beginPath();
      // Poised left bare foot (heel lifted slightly) & grounded right bare foot
      ctx.moveTo(fx - w * 0.022 * sc, ankleY);
      ctx.lineTo(fx - w * 0.042 * sc, fy);
      ctx.moveTo(fx + w * 0.020 * sc, ankleY);
      ctx.lineTo(fx + w * 0.036 * sc, fy - h * 0.008 * sc);
      ctx.stroke();

      // Tiny gold ankle bells (khalkhal)
      ctx.fillStyle = "rgba(248, 208, 102, 0.95)";
      ctx.beginPath();
      ctx.arc(fx - w * 0.026 * sc, ankleY + 1, Math.max(1, w * 0.009 * sc), 0, Math.PI * 2);
      ctx.arc(fx + w * 0.022 * sc, ankleY + 1, Math.max(1, w * 0.009 * sc), 0, Math.PI * 2);
      ctx.fill();

      // Flowing silk skirt & bodice (half-revealed warm silhouette)
      ctx.fillStyle = rgbaStr(dSpec.dressRgb, 0.88);
      ctx.beginPath();
      ctx.moveTo(headX - w * 0.026 * sc, shoulderY);
      ctx.lineTo(headX + w * 0.026 * sc, shoulderY);
      ctx.lineTo(waistX + w * 0.022 * sc, waistY);
      ctx.quadraticCurveTo(fx + w * 0.085 * sc + swayX, fy - figH * 0.22, fx + w * 0.055 * sc, ankleY);
      ctx.quadraticCurveTo(fx, ankleY + h * 0.016 * sc, fx - w * 0.058 * sc, ankleY);
      ctx.quadraticCurveTo(fx - w * 0.075 * sc + swayX, fy - figH * 0.22, waistX - w * 0.022 * sc, waistY);
      ctx.closePath();
      ctx.fill();

      // Head & flowing dark hair
      ctx.fillStyle = "rgba(38, 24, 26, 0.95)";
      ctx.beginPath();
      ctx.arc(headX - w * 0.008 * sc, headY + figH * 0.03, w * 0.034 * sc, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = skinWarm;
      ctx.beginPath();
      ctx.arc(headX, headY, w * 0.026 * sc, 0, Math.PI * 2);
      ctx.fill();

      // Sinuous graceful arms lifted in counter-curve
      var lHandX = headX - w * (0.095 + 0.025 * armWave) * sc;
      var lHandY = headY - figH * (0.08 + 0.06 * armWave);
      var rHandX = headX + w * (0.105 - 0.025 * armWave) * sc;
      var rHandY = shoulderY - figH * (0.06 - 0.08 * armWave);

      ctx.strokeStyle = skinWarm;
      ctx.lineWidth = Math.max(1.3, w * 0.014 * sc);
      ctx.beginPath();
      ctx.moveTo(headX - w * 0.024 * sc, shoulderY);
      ctx.bezierCurveTo(
        headX - w * 0.075 * sc,
        shoulderY + figH * 0.05,
        lHandX - w * 0.015 * sc,
        lHandY + figH * 0.10,
        lHandX,
        lHandY
      );
      ctx.moveTo(headX + w * 0.024 * sc, shoulderY);
      ctx.bezierCurveTo(
        headX + w * 0.075 * sc,
        shoulderY - figH * 0.04,
        rHandX - w * 0.02 * sc,
        rHandY - figH * 0.08,
        rHandX,
        rHandY
      );
      ctx.stroke();

      // Translucent drifting gossamer veils (half-hiding face & torso, billowing from lifted wrists)
      ctx.fillStyle = rgbaStr(dSpec.veilRgb, 0.44);
      ctx.beginPath();
      ctx.moveTo(lHandX, lHandY);
      ctx.bezierCurveTo(
        headX,
        headY - figH * 0.04,
        rHandX - w * 0.02 * sc,
        headY + figH * 0.08,
        rHandX,
        rHandY
      );
      ctx.bezierCurveTo(
        rHandX + w * 0.065 * sc + swayX,
        waistY + figH * 0.12,
        fx + w * 0.02 * sc,
        waistY + figH * 0.28,
        lHandX - w * 0.03 * sc - swayX,
        waistY + figH * 0.10
      );
      ctx.closePath();
      ctx.fill();

      // Second sheer pearl-white veil ribbon across lower face & shoulder
      ctx.fillStyle = "rgba(255, 248, 238, 0.48)";
      ctx.beginPath();
      ctx.moveTo(headX - w * 0.03 * sc, headY + figH * 0.01);
      ctx.quadraticCurveTo(headX + w * 0.035 * sc, headY + figH * 0.04, rHandX, rHandY);
      ctx.quadraticCurveTo(headX + w * 0.02 * sc, shoulderY + figH * 0.12, headX - w * 0.035 * sc, shoulderY + figH * 0.06);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawChambers(ctx, width, height, env) {
    var rects = env.anchors.chamberRects;
    var d = env.desireDepth;
    var sub = env.subMode;
    var baseAlpha = env.baseAlpha;

    // Even at d=0, faint submerged mirage arches glimmer beneath the grey swells (0.15 -> 0.98)
    var baseChamberAlpha = 0.15 + 0.83 * Math.pow(d, 0.78);

    for (var i = 0; i < rects.length; i++) {
      var rect = rects[i];
      // Subtle subMode emphasis: Caravan saddlebags glow slightly richer near sub=0; Oasis & Court near sub=1
      var subAccent = i === 0 ? 1 - 0.12 * sub : 0.90 + 0.10 * sub;
      var chAlpha = clamp01(baseChamberAlpha * subAccent, 0);

      // Soft outer sanctuary glow against sea-mist / twilight sand
      ctx.save();
      var cx = rect.x + rect.w * 0.5;
      var cy = rect.y + rect.h * 0.5;
      var glowR = Math.max(rect.w, rect.h) * 0.68;
      var haloRgb = lerpRgb([146, 166, 182], [238, 192, 118], d);
      var haloGrad = ctx.createRadialGradient(cx, cy, glowR * 0.25, cx, cy, glowR);
      haloGrad.addColorStop(0, rgbaStr(haloRgb, 0.22 * d));
      haloGrad.addColorStop(1, rgbaStr(haloRgb, 0));
      ctx.fillStyle = haloGrad;
      ctx.fillRect(rect.x - rect.w * 0.25, rect.y - rect.h * 0.2, rect.w * 1.5, rect.h * 1.4);

      // Clipped interior painting inside sculpted sanctuary arch
      ctx.globalAlpha = baseAlpha * chAlpha;
      traceSanctuaryArchPath(ctx, rect.x, rect.y, rect.w, rect.h, 2);
      ctx.clip();

      if (i === 0) {
        paintChamberSaddlebags(ctx, rect, env);
      } else if (i === 1) {
        paintChamberOasis(ctx, rect, env);
      } else {
        paintChamberVeiledCourt(ctx, rect, env);
      }

      // Cool slate sea-mist wash veiling the chamber when desireDepth is low
      if (d < 0.85) {
        ctx.fillStyle = rgbaStr([58, 74, 88], (1 - d) * 0.58);
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      }
      ctx.restore();

      // Double-beveled carved arch border
      ctx.save();
      ctx.globalAlpha = baseAlpha * (0.28 + 0.68 * d);
      var frameRgb = lerpRgb([164, 180, 194], [228, 188, 114], d);
      ctx.strokeStyle = rgbaStr(frameRgb, 0.9);
      ctx.lineWidth = Math.max(1.5, width * 0.0022);
      traceSanctuaryArchPath(ctx, rect.x, rect.y, rect.w, rect.h, 1.5);
      ctx.stroke();

      ctx.strokeStyle = rgbaStr([250, 236, 204], 0.42 * d);
      ctx.lineWidth = 1;
      traceSanctuaryArchPath(ctx, rect.x, rect.y, rect.w, rect.h, 5);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawStoneHighlights(ctx, width, height, spline, env) {
    var st = env.state;
    var hovered = st.hoveredStone;
    var selected = st.selectedStone;
    if (!hovered && !selected) return;

    var pulse = env.motion ? 0.5 + 0.5 * Math.sin(env.time * 3.1) : 0.7;

    for (var i = 0; i < STONES.length; i++) {
      var stone = STONES[i];
      var isSel = matchesStone(selected, stone);
      var isHov = matchesStone(hovered, stone);
      if (!isSel && !isHov) continue;

      var strength = isSel ? 0.95 : 0.68 + 0.22 * pulse;

      ctx.save();
      ctx.globalAlpha = env.baseAlpha;

      if (stone.kind === "spine") {
        var pt = env.anchors.spinePoints[stone.anchorIndex];
        var midY = lerp(pt.y, pt.baseY, 0.42);
        var rad = Math.max(pt.width * 0.85, height * 0.09);

        // Soft golden radial aura around the spine feature
        var aura = ctx.createRadialGradient(pt.x, midY, rad * 0.08, pt.x, midY, rad);
        aura.addColorStop(0, "rgba(255, 228, 146, " + (0.34 * strength).toFixed(3) + ")");
        aura.addColorStop(0.55, "rgba(244, 192, 92, " + (0.16 * strength).toFixed(3) + ")");
        aura.addColorStop(1, "rgba(244, 192, 92, 0)");
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(pt.x, midY, rad, 0, Math.PI * 2);
        ctx.fill();

        // Golden contour trace along the local horizon ridge
        ctx.strokeStyle = "rgba(255, 234, 162, " + (0.88 * strength).toFixed(3) + ")";
        ctx.lineWidth = isSel ? 2.4 : 1.8;
        ctx.beginPath();
        var segSteps = 18;
        var x0 = pt.x - pt.width * 0.65;
        var x1 = pt.x + pt.width * 0.65;
        for (var s = 0; s <= segSteps; s++) {
          var sx = lerp(x0, x1, s / segSteps);
          var sy = evaluateSpineYAtX(spline, sx, env.horizonY);
          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        // Delicate golden compass diamond marker poised above peak
        var mkY = pt.y - height * 0.024;
        var mkR = isSel ? 5.2 : 4.0;
        ctx.fillStyle = "rgba(255, 240, 184, " + (0.94 * strength).toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(pt.x, mkY - mkR);
        ctx.lineTo(pt.x + mkR * 0.75, mkY);
        ctx.lineTo(pt.x, mkY + mkR);
        ctx.lineTo(pt.x - mkR * 0.75, mkY);
        ctx.closePath();
        ctx.fill();
      } else {
        var rect = env.anchors.chamberRects[stone.anchorIndex];
        var cx = rect.x + rect.w * 0.5;
        var cy = rect.y + rect.h * 0.5;
        var rGlow = Math.max(rect.w, rect.h) * 0.72;

        var chAura = ctx.createRadialGradient(cx, cy, rGlow * 0.32, cx, cy, rGlow);
        chAura.addColorStop(0, "rgba(255, 224, 136, 0)");
        chAura.addColorStop(0.65, "rgba(255, 214, 118, " + (0.28 * strength).toFixed(3) + ")");
        chAura.addColorStop(1, "rgba(255, 214, 118, 0)");
        ctx.fillStyle = chAura;
        ctx.fillRect(rect.x - rect.w * 0.25, rect.y - rect.h * 0.25, rect.w * 1.5, rect.h * 1.5);

        ctx.strokeStyle = "rgba(255, 232, 152, " + (0.95 * strength).toFixed(3) + ")";
        ctx.lineWidth = isSel ? 2.8 : 2.1;
        traceSanctuaryArchPath(ctx, rect.x, rect.y, rect.w, rect.h, 0);
        ctx.stroke();

        if (isSel) {
          ctx.strokeStyle = "rgba(255, 248, 214, 0.75)";
          ctx.lineWidth = 1.2;
          traceSanctuaryArchPath(ctx, rect.x, rect.y, rect.w, rect.h, -4);
          ctx.stroke();
        }
      }

      ctx.restore();
    }
  }

  function render(ctx, width, height, state) {
    if (!ctx || !(width > 0) || !(height > 0)) return;
    var st = state || {};

    ctx.save();
    var baseAlpha = typeof ctx.globalAlpha === "number" ? ctx.globalAlpha : 1;

    var anchors = computeAnchors(width, height, st);
    var spline = buildSpineSplineKnots(anchors.spinePoints, anchors.horizonY);

    var hasPointer =
      typeof st.pointerX === "number" &&
      typeof st.pointerY === "number" &&
      isFinite(st.pointerX) &&
      isFinite(st.pointerY);
    var pNormX = 0.5;
    var pNormY = 0.45;
    if (hasPointer) {
      pNormX = st.pointerX > 1.05 ? st.pointerX / width : st.pointerX;
      pNormY = st.pointerY > 1.05 ? st.pointerY / height : st.pointerY;
      pNormX = clamp01(pNormX, 0.5);
      pNormY = clamp01(pNormY, 0.45);
    }

    var weightVal = st.weight === undefined ? 1 : clamp01(st.weight, 1);

    var env = {
      state: st,
      anchors: anchors,
      horizonY: anchors.horizonY,
      time: typeof st.time === "number" && isFinite(st.time) ? st.time : 0,
      desireDepth: clamp01(st.desireDepth, 0),
      subMode: clamp01(st.subMode, 0),
      weight: weightVal,
      presence: 0.84 + 0.16 * weightVal,
      cuspTurbulence: clamp01(st.cuspTurbulence, 0),
      motion: st.reducedMotion ? 0 : 1,
      hasPointer: hasPointer,
      pointerNormX: pNormX,
      pointerNormY: pNormY,
      baseAlpha: baseAlpha
    };

    drawSkyAndSunbeams(ctx, width, height, anchors.horizonY, env);
    drawDistantDesertDunes(ctx, width, height, anchors.horizonY, env);
    drawHorizonSpine(ctx, width, height, spline, env);
    drawSeaDesertAndReflections(ctx, width, height, anchors.horizonY, env);
    drawChambers(ctx, width, height, env);
    drawCoastlineHazeRibbons(ctx, width, height, anchors.horizonY, env);
    drawStoneHighlights(ctx, width, height, spline, env);

    ctx.restore();
  }

  function hitTest(normX, normY, width, height, state) {
    if (typeof normX !== "number" || typeof normY !== "number" || !isFinite(normX) || !isFinite(normY)) {
      return null;
    }
    var w = typeof width === "number" && width > 0 ? width : 800;
    var h = typeof height === "number" && height > 0 ? height : 600;

    var px = normX > 1.05 ? normX : normX * w;
    var py = normY > 1.05 ? normY : normY * h;

    var anchors = computeAnchors(w, h, state || {});

    // 1. Test Lower Caravan & Oasis Chambers
    for (var c = 0; c < anchors.chamberRects.length; c++) {
      var r = anchors.chamberRects[c];
      if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
        return CHAMBER_STONE_BY_INDEX[c] || null;
      }
    }

    // 2. Test Horizon Spine Stones
    var bestStone = null;
    var bestScore = Infinity;
    for (var i = 0; i < STONES.length; i++) {
      var st = STONES[i];
      if (st.kind !== "spine") continue;
      var pt = anchors.spinePoints[st.anchorIndex];
      if (!pt) continue;

      var halfW = Math.max(pt.width * 0.68, w * 0.038);
      var topY = pt.y - h * 0.035;
      var botY = pt.baseY + h * 0.02;

      if (px >= pt.x - halfW && px <= pt.x + halfW && py >= topY && py <= botY) {
        var centerY = lerp(pt.y, pt.baseY, 0.38);
        var normDist = Math.hypot((px - pt.x) / halfW, (py - centerY) / Math.max(12, botY - topY));
        if (normDist < bestScore) {
          bestScore = normDist;
          bestStone = st;
        }
      }
    }

    return bestStone;
  }

  // Procedural WebAudio synthesis for the 8 seaward caravan & oasis stones
  function makeNoiseBuffer(audioCtx, durationSec) {
    var rate = audioCtx.sampleRate || 44100;
    var length = Math.max(1, Math.floor(rate * durationSec));
    var buffer = audioCtx.createBuffer(1, length, rate);
    var data = buffer.getChannelData(0);
    var seed = 1357911;
    for (var i = 0; i < length; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      data[i] = (seed / 2147483648) - 1;
    }
    return buffer;
  }

  function triggerSound(audioCtx, masterGain, stoneId, state) {
    if (!audioCtx || typeof audioCtx.currentTime !== "number") return;
    try {
      var dest = masterGain || audioCtx.destination;
      if (!dest) return;

      var now = audioCtx.currentTime;
      var st = state || {};
      var sub = clamp01(st.subMode, 0);

      // Resolve canonical stone id
      var resolvedId = stoneId || "";
      for (var i = 0; i < STONES.length; i++) {
        if (matchesStone(stoneId, STONES[i])) {
          resolvedId = STONES[i].id;
          break;
        }
      }

      if (resolvedId === "glittering-fringed-saddle") {
        // Shimmering brass saddle-fringe bells & sequin chimes
        var bellFreqs = [1318.5, 1760.0, 2093.0, 2637.0, 3322.4];
        for (var b = 0; b < bellFreqs.length; b++) {
          var t0 = now + b * 0.028;
          var osc = audioCtx.createOscillator();
          var overtone = audioCtx.createOscillator();
          var gain = audioCtx.createGain();

          osc.type = "sine";
          overtone.type = "triangle";
          osc.frequency.setValueAtTime(bellFreqs[b], t0);
          overtone.frequency.setValueAtTime(bellFreqs[b] * 2.41, t0);

          gain.gain.setValueAtTime(0.0001, t0);
          gain.gain.exponentialRampToValueAtTime(0.055 / (1 + b * 0.18), t0 + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.52);

          osc.connect(gain);
          overtone.connect(gain);
          gain.connect(dest);

          osc.start(t0);
          overtone.start(t0);
          osc.stop(t0 + 0.55);
          overtone.stop(t0 + 0.55);
        }
      } else if (
        resolvedId === "camel-withers" ||
        resolvedId === "anterior-spotted-hump" ||
        resolvedId === "posterior-spotted-hump"
      ) {
        // Soft caravan stride frame-drum (doum / counter-phase tak) + palm/mist breath
        var isAft = resolvedId === "posterior-spotted-hump";
        var startFreq = resolvedId === "camel-withers" ? 116 : isAft ? 158 : 104;
        var endFreq = resolvedId === "camel-withers" ? 54 : isAft ? 74 : 48;

        var drum = audioCtx.createOscillator();
        var dGain = audioCtx.createGain();
        drum.type = "triangle";
        drum.frequency.setValueAtTime(startFreq, now);
        drum.frequency.exponentialRampToValueAtTime(endFreq, now + 0.26);

        dGain.gain.setValueAtTime(0.0001, now);
        dGain.gain.exponentialRampToValueAtTime(0.14, now + 0.012);
        dGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);

        drum.connect(dGain);
        dGain.connect(dest);
        drum.start(now);
        drum.stop(now + 0.38);

        // Soft rustle of leather harness or oasis palm fronds (modulated by subMode)
        if (audioCtx.createBuffer && audioCtx.createBiquadFilter) {
          var nSrc = audioCtx.createBufferSource();
          nSrc.buffer = makeNoiseBuffer(audioCtx, 0.28);
          var filt = audioCtx.createBiquadFilter();
          filt.type = "bandpass";
          filt.frequency.setValueAtTime(lerp(680, 1650, sub), now);
          filt.Q.setValueAtTime(2.4, now);
          var nGain = audioCtx.createGain();
          nGain.gain.setValueAtTime(0.0001, now);
          nGain.gain.exponentialRampToValueAtTime(0.032, now + 0.04);
          nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
          nSrc.connect(filt);
          filt.connect(nGain);
          nGain.connect(dest);
          nSrc.start(now);
          nSrc.stop(now + 0.28);
        }
      } else if (resolvedId === "whitewashed-palace-walls") {
        // Hollow limestone courtyard sanctuary chord & wind-catcher breath
        var wallNotes = [293.66, 440.0, 587.33];
        for (var w = 0; w < wallNotes.length; w++) {
          var wOsc = audioCtx.createOscillator();
          var wGain = audioCtx.createGain();
          wOsc.type = w === 0 ? "triangle" : "sine";
          wOsc.frequency.setValueAtTime(wallNotes[w], now + w * 0.02);
          wGain.gain.setValueAtTime(0.0001, now + w * 0.02);
          wGain.gain.exponentialRampToValueAtTime(0.045, now + w * 0.02 + 0.04);
          wGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.68);
          wOsc.connect(wGain);
          wGain.connect(dest);
          wOsc.start(now + w * 0.02);
          wOsc.stop(now + 0.70);
        }
      } else if (resolvedId === "caravan-saddlebag-delicacies") {
        // Dry cured tobacco leaf rustle + warm amber date-wine pour droplets
        if (audioCtx.createBuffer && audioCtx.createBiquadFilter) {
          var leafSrc = audioCtx.createBufferSource();
          leafSrc.buffer = makeNoiseBuffer(audioCtx, 0.24);
          var leafFilt = audioCtx.createBiquadFilter();
          leafFilt.type = "bandpass";
          leafFilt.frequency.setValueAtTime(2350, now);
          leafFilt.Q.setValueAtTime(1.8, now);
          var leafGain = audioCtx.createGain();
          leafGain.gain.setValueAtTime(0.0001, now);
          leafGain.gain.exponentialRampToValueAtTime(0.042, now + 0.025);
          leafGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
          leafSrc.connect(leafFilt);
          leafFilt.connect(leafGain);
          leafGain.connect(dest);
          leafSrc.start(now);
          leafSrc.stop(now + 0.24);
        }
        var drops = [390, 465, 545];
        for (var dr = 0; dr < drops.length; dr++) {
          var dt = now + 0.07 + dr * 0.065;
          var pOsc = audioCtx.createOscillator();
          var pGain = audioCtx.createGain();
          pOsc.type = "sine";
          pOsc.frequency.setValueAtTime(drops[dr], dt);
          pOsc.frequency.exponentialRampToValueAtTime(drops[dr] * 1.58, dt + 0.075);
          pGain.gain.setValueAtTime(0.0001, dt);
          pGain.gain.exponentialRampToValueAtTime(0.048, dt + 0.01);
          pGain.gain.exponentialRampToValueAtTime(0.0001, dt + 0.11);
          pOsc.connect(pGain);
          pGain.connect(dest);
          pOsc.start(dt);
          pOsc.stop(dt + 0.12);
        }
      } else if (resolvedId === "palm-freshwater-oasis") {
        // Freshwater oasis droplet chime + Hijaz water-harp shimmer
        var dropOsc = audioCtx.createOscillator();
        var dropGain = audioCtx.createGain();
        dropOsc.type = "sine";
        dropOsc.frequency.setValueAtTime(540, now);
        dropOsc.frequency.exponentialRampToValueAtTime(1120, now + 0.09);
        dropGain.gain.setValueAtTime(0.0001, now);
        dropGain.gain.exponentialRampToValueAtTime(0.075, now + 0.008);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        dropOsc.connect(dropGain);
        dropGain.connect(dest);
        dropOsc.start(now);
        dropOsc.stop(now + 0.20);

        var chimeNotes = [587.33, 739.99, 880.0, 1174.66];
        for (var c = 0; c < chimeNotes.length; c++) {
          var ct = now + 0.06 + c * 0.045;
          var cOsc = audioCtx.createOscillator();
          var cGain = audioCtx.createGain();
          cOsc.type = "sine";
          cOsc.frequency.setValueAtTime(chimeNotes[c], ct);
          cGain.gain.setValueAtTime(0.0001, ct);
          cGain.gain.exponentialRampToValueAtTime(0.036, ct + 0.012);
          cGain.gain.exponentialRampToValueAtTime(0.0001, ct + 0.48);
          cOsc.connect(cGain);
          cGain.connect(dest);
          cOsc.start(ct);
          cOsc.stop(ct + 0.50);
        }
      } else {
        // Modal Hijaz oud pluck & soft tambourine (riq) veil pulse (Chamber 2 & fallback)
        var oudNotes = [293.66, 370.0, 440.0];
        for (var n = 0; n < oudNotes.length; n++) {
          var nt = now + n * 0.055;
          var oud = audioCtx.createOscillator();
          var oudSymp = audioCtx.createOscillator();
          var oGain = audioCtx.createGain();
          oud.type = "sawtooth";
          oudSymp.type = "triangle";
          oud.frequency.setValueAtTime(oudNotes[n], nt);
          oudSymp.frequency.setValueAtTime(oudNotes[n] * 1.003, nt);

          if (audioCtx.createBiquadFilter) {
            var lp = audioCtx.createBiquadFilter();
            lp.type = "lowpass";
            lp.frequency.setValueAtTime(1900, nt);
            lp.frequency.exponentialRampToValueAtTime(520, nt + 0.36);
            oud.connect(lp);
            oudSymp.connect(lp);
            lp.connect(oGain);
          } else {
            oud.connect(oGain);
            oudSymp.connect(oGain);
          }

          oGain.gain.setValueAtTime(0.0001, nt);
          oGain.gain.exponentialRampToValueAtTime(0.052, nt + 0.008);
          oGain.gain.exponentialRampToValueAtTime(0.0001, nt + 0.42);
          oGain.connect(dest);

          oud.start(nt);
          oudSymp.start(nt);
          oud.stop(nt + 0.44);
          oudSymp.stop(nt + 0.44);
        }

        // Soft tambourine / zill veil shimmer
        if (audioCtx.createBuffer && audioCtx.createBiquadFilter) {
          var zSrc = audioCtx.createBufferSource();
          zSrc.buffer = makeNoiseBuffer(audioCtx, 0.18);
          var hp = audioCtx.createBiquadFilter();
          hp.type = "highpass";
          hp.frequency.setValueAtTime(5800, now + 0.03);
          var zGain = audioCtx.createGain();
          zGain.gain.setValueAtTime(0.0001, now + 0.03);
          zGain.gain.exponentialRampToValueAtTime(0.028, now + 0.045);
          zGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);
          zSrc.connect(hp);
          hp.connect(zGain);
          zGain.connect(dest);
          zSrc.start(now + 0.03);
          zSrc.stop(now + 0.20);
        }
      }
    } catch (_err) {
      // Safe no-op if audioCtx is closed or restricted
    }
  }

  return {
    id: "seaward_caravan",
    desertName: "Slate Coastline Haze",
    beholderName: "The Sailor",
    subModeLabels: ["Swaying Saddle & Caravan", "Palm Oasis & Veiled Court"],
    stones: STONES,
    computeAnchors: computeAnchors,
    render: render,
    hitTest: hitTest,
    triggerSound: triggerSound
  };
})();
