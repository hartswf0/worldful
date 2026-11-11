if (typeof window === "undefined" && typeof globalThis !== "undefined") {
  globalThis.window = globalThis;
}

window.DespinaOverlandVessel = (function () {
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
      id: "overland_pinnacles",
      label: "Skyscraper Pinnacles",
      kind: "spine",
      anchorIndex: 2,
      inscription:
        "Across the parched ochre tableland, needle-sharp skyscraper pinnacles pierce the shimmering dust-glare, already stepping the tall masts and crossed yards of an outbound vessel."
    },
    {
      id: "overland_radar",
      label: "Radar Antennae",
      kind: "spine",
      anchorIndex: 1,
      inscription:
        "Open-lattice radar antennae sweep the dry stone horizon in measured arcs, their steel trusses tightening into foremast shrouds, crosstrees, and taut standing rigging."
    },
    {
      id: "overland_windsocks",
      label: "White-and-Red Windsocks",
      kind: "spine",
      anchorIndex: 3,
      inscription:
        "White-and-red striped windsocks snap horizontal in the hot plateau gusts, straining toward open water like departure pennants and staysails catching the first sea breeze."
    },
    {
      id: "overland_chimneys",
      label: "Smoke-Belching Chimneys",
      kind: "spine",
      anchorIndex: 4,
      inscription:
        "Tall brick-and-iron chimneys belch dark soot ribbons through the ochre mirage, pulsing with the stoked coal-draft of twin steamer funnels."
    },
    {
      id: "overland_vessel_heart",
      label: "Swelling Windjammer / Vibrating Iron Keel",
      kind: "spine",
      anchorIndex: 5,
      inscription:
        "At the skyline's crest the city becomes the ship that carries the traveller away from the desert: a windjammer with breeze swelling sheets not yet unfurled, or a steamboat whose boiler vibrates in the iron keel."
    },
    {
      id: "overland_cranes",
      label: "Dock Cranes & Foreign Merchandise",
      kind: "chamber",
      anchorIndex: 0,
      inscription:
        "Where fissured plateau stone gives way to deep harbor water, iron jib cranes swing banded wooden crates, stenciled bales, and terracotta amphorae onto the wet quay."
    },
    {
      id: "overland_taverns",
      label: "Tavern Flag-Crews Breaking Bottles",
      kind: "chamber",
      anchorIndex: 1,
      inscription:
        "Under lantern-lit port vaults strung with the ensigns of distant maritime nations, crews of foreign ships toast, clink, and hurl green and amber bottles into bright splinters."
    },
    {
      id: "overland_windows",
      label: "Lighted Ground-Floor Windows — Combing Hair",
      kind: "chamber",
      anchorIndex: 2,
      inscription:
        "Three warm ground-floor casements open through dark port masonry into the salt dusk, each framing a poised silhouette drawing a slow comb through long cascading hair."
    }
  ];

  var SPINE_FALLBACK_LABELS = {
    0: "Bowsprit Fore-Spire",
    6: "Mizzen Gaff Tower",
    7: "Quarterdeck Annex",
    8: "Stern Ensign Bastion"
  };

  var SPINE_STONE_MAP = {};
  var CHAMBER_STONE_MAP = {};
  (function buildMaps() {
    for (var i = 0; i < STONES.length; i++) {
      var st = STONES[i];
      if (st.kind === "spine") {
        SPINE_STONE_MAP[st.anchorIndex] = st;
      } else if (st.kind === "chamber") {
        CHAMBER_STONE_MAP[st.anchorIndex] = st;
      }
    }
  })();

  // Precomputed deterministic plateau fissure rays & dust motes
  var PLATEAU_FISSURES = (function () {
    var list = [];
    for (var i = 0; i < 26; i++) {
      var seed = (i * 73 + 19) % 97;
      var uTop = 0.04 + (i / 25) * 0.92 + ((seed % 11) - 5) * 0.004;
      var spread = (uTop - 0.5) * 1.65 + ((seed % 7) - 3) * 0.04;
      var uBot = 0.5 + spread;
      var jag = [];
      for (var s = 1; s <= 5; s++) {
        var frac = s / 6;
        var off = (((i * 31 + s * 17) % 19) - 9) * 0.006 * (0.4 + frac);
        jag.push({ t: frac, off: off });
      }
      list.push({
        uTop: uTop,
        uBot: uBot,
        jag: jag,
        weight: 0.6 + (seed % 5) * 0.22,
        crossAt: 0.22 + (seed % 6) * 0.12
      });
    }
    return list;
  })();

  var DUST_MOTES = (function () {
    var arr = [];
    for (var i = 0; i < 44; i++) {
      arr.push({
        u: ((i * 37 + 13) % 100) / 100,
        v: ((i * 53 + 7) % 100) / 100,
        r: 0.7 + (i % 4) * 0.55,
        speed: 0.012 + (i % 5) * 0.005,
        phase: i * 0.91
      });
    }
    return arr;
  })();

  function clamp01(v) {
    if (v !== v || v === undefined || v === null) return 0;
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(edge0, edge1, x) {
    var t = clamp01((x - edge0) / (edge1 - edge0));
    return t * t * (3 - 2 * t);
  }

  function mixRGB(c1, c2, t) {
    var k = clamp01(t);
    var r = Math.round(c1[0] + (c2[0] - c1[0]) * k);
    var g = Math.round(c1[1] + (c2[1] - c1[1]) * k);
    var b = Math.round(c1[2] + (c2[2] - c1[2]) * k);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  function mixRGBA(c1, c2, t, alpha) {
    var k = clamp01(t);
    var r = Math.round(c1[0] + (c2[0] - c1[0]) * k);
    var g = Math.round(c1[1] + (c2[1] - c1[1]) * k);
    var b = Math.round(c1[2] + (c2[2] - c1[2]) * k);
    var a = clamp01(alpha);
    return "rgba(" + r + "," + g + "," + b + "," + a.toFixed(3) + ")";
  }

  function normalizeState(state) {
    var s = state || {};
    return {
      time: typeof s.time === "number" && isFinite(s.time) ? s.time : 0,
      desireDepth: clamp01(s.desireDepth !== undefined ? s.desireDepth : 0.35),
      subMode: clamp01(s.subMode !== undefined ? s.subMode : 0.0),
      weight: clamp01(s.weight !== undefined ? s.weight : 1.0),
      cuspTurbulence: clamp01(s.cuspTurbulence !== undefined ? s.cuspTurbulence : 0.0),
      hoveredStone: s.hoveredStone || null,
      selectedStone: s.selectedStone || null,
      pointerX: typeof s.pointerX === "number" && isFinite(s.pointerX) ? s.pointerX : 0.5,
      pointerY: typeof s.pointerY === "number" && isFinite(s.pointerY) ? s.pointerY : 0.5,
      reducedMotion: Boolean(s.reducedMotion)
    };
  }

  function matchesStone(ref, stone, anchorId) {
    if (!ref || !stone) return false;
    if (typeof ref === "string") {
      return ref === stone.id || (anchorId && ref === anchorId);
    }
    if (typeof ref === "object") {
      if (ref.id && (ref.id === stone.id || ref.id === anchorId)) return true;
      if (ref.kind === stone.kind && ref.anchorIndex === stone.anchorIndex) return true;
    }
    return false;
  }

  function computeAnchors(width, height, state) {
    var w = Math.max(1, Number(width) || 1);
    var h = Math.max(1, Number(height) || 1);
    var st = normalizeState(state);
    var horizonY = HORIZON_RATIO * h;
    var motionScale = st.reducedMotion ? 0 : 1;

    var desire = st.desireDepth;
    var sub = st.subMode;
    var turb = st.cuspTurbulence;
    var t = st.time;

    // Windjammer slow swell roll (subMode -> 0) vs Iron-Keel boiler vibration (subMode -> 1)
    var windjammerWeight = (1 - sub) * desire * motionScale;
    var steamWeight = sub * desire * motionScale;

    var rollAngle =
      Math.sin(t * 1.15) * (0.0085 + turb * 0.004) * windjammerWeight;
    var heaveY =
      Math.cos(t * 0.92 + 0.4) * (h * 0.0032) * windjammerWeight;

    var spinePoints = [];
    for (var i = 0; i < SPINE_SPEC.length; i++) {
      var sp = SPINE_SPEC[i];
      var stone = SPINE_STONE_MAP[sp.index] || null;
      var rawX = sp.u * w;
      var peakPx = sp.peakH * h;

      var relU = sp.u - 0.52;
      var rollDx = -peakPx * Math.sin(rollAngle) * 0.65;
      var rollDy = relU * w * Math.sin(rollAngle) * 0.22 + heaveY;

      var boilerVibX =
        Math.sin(t * 43.0 + sp.phase * 3.1) * (1.35 + turb * 0.9) * steamWeight;
      var boilerVibY =
        Math.cos(t * 55.0 + sp.phase * 2.3) * (1.15 + turb * 0.8) * steamWeight;

      var baseVibY =
        heaveY * 0.55 +
        Math.cos(t * 55.0 + sp.phase) * 0.75 * steamWeight;

      spinePoints.push({
        id: sp.id,
        x: rawX + rollDx + boilerVibX,
        y: horizonY - peakPx + rollDy + boilerVibY,
        baseY: horizonY + baseVibY,
        width: sp.width * w,
        stoneId: stone ? stone.id : null,
        label: stone ? stone.label : SPINE_FALLBACK_LABELS[sp.index] || sp.id
      });
    }

    var chamberRects = [];
    for (var j = 0; j < CHAMBER_SPEC.length; j++) {
      var ch = CHAMBER_SPEC[j];
      var cStone = CHAMBER_STONE_MAP[ch.index] || null;
      var cw = ch.w * w;
      var chH = ch.h * h;
      var driftY =
        motionScale *
        desire *
        Math.sin(t * 1.05 + j * 1.7) *
        (h * 0.0016 * (1 - sub * 0.5));
      var rx = ch.u * w - cw * 0.5;
      var ry = ch.v * h - chH * 0.5 + driftY;

      chamberRects.push({
        id: ch.id,
        x: rx,
        y: ry,
        w: cw,
        h: chH,
        stoneId: cStone ? cStone.id : null,
        label: cStone ? cStone.label : ch.id
      });
    }

    return {
      horizonY: horizonY,
      spinePoints: spinePoints,
      chamberRects: chamberRects
    };
  }

  function drawSkyAndAtmosphere(ctx, w, h, horizonY, st, tAnim) {
    var d = st.desireDepth;
    var sub = st.subMode;
    var turb = st.cuspTurbulence;

    // Sky palette: parched burnt-ochre desert zenith -> maritime slate/Prussian trade-wind dusk
    var zenithDesert = [66, 41, 22];
    var zenithWindjammer = [28, 52, 68];
    var zenithSteamer = [23, 33, 44];
    var zenithHarbor = [
      lerp(zenithWindjammer[0], zenithSteamer[0], sub),
      lerp(zenithWindjammer[1], zenithSteamer[1], sub),
      lerp(zenithWindjammer[2], zenithSteamer[2], sub)
    ];

    var midDesert = [154, 102, 48];
    var midWindjammer = [84, 114, 124];
    var midSteamer = [78, 76, 82];
    var midHarbor = [
      lerp(midWindjammer[0], midSteamer[0], sub),
      lerp(midWindjammer[1], midSteamer[1], sub),
      lerp(midWindjammer[2], midSteamer[2], sub)
    ];

    var lowDesert = [218, 168, 98];
    var lowWindjammer = [214, 184, 132];
    var lowSteamer = [196, 134, 82];
    var lowHarbor = [
      lerp(lowWindjammer[0], lowSteamer[0], sub),
      lerp(lowWindjammer[1], lowSteamer[1], sub),
      lerp(lowWindjammer[2], lowSteamer[2], sub)
    ];

    var hazeDesert = [240, 214, 162];
    var hazeHarbor = [
      lerp(236, 222, sub),
      lerp(212, 168, sub),
      lerp(172, 118, sub)
    ];

    var skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0.0, mixRGB(zenithDesert, zenithHarbor, d * 0.88));
    skyGrad.addColorStop(0.46, mixRGB(midDesert, midHarbor, d * 0.82));
    skyGrad.addColorStop(0.82, mixRGB(lowDesert, lowHarbor, d * 0.75));
    skyGrad.addColorStop(1.0, mixRGB(hazeDesert, hazeHarbor, d * 0.68));
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizonY + 2);

    // Veiled desert sun / departure solar corona
    var pxOff = st.reducedMotion ? 0 : (st.pointerX - 0.5) * w * 0.012;
    var pyOff = st.reducedMotion ? 0 : (st.pointerY - 0.5) * h * 0.008;
    var sunX = w * 0.60 + pxOff;
    var sunY = horizonY * (0.38 + d * 0.08) + pyOff;
    var sunR = Math.min(w, h) * (0.28 + turb * 0.05);

    var sunGrad = ctx.createRadialGradient(sunX, sunY, sunR * 0.04, sunX, sunY, sunR);
    sunGrad.addColorStop(0.0, mixRGBA([255, 241, 202], [255, 232, 184], sub, 0.72 - d * 0.14));
    sunGrad.addColorStop(0.28, mixRGBA([238, 190, 114], [228, 162, 96], sub, 0.34));
    sunGrad.addColorStop(0.68, mixRGBA([196, 134, 66], [112, 128, 138], d, 0.12));
    sunGrad.addColorStop(1.0, "rgba(180,125,65,0)");
    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, w, horizonY);

    // Sweeping wind-strata & scirocco dust / trade-wind cirrus bands
    ctx.save();
    var bandCount = 7;
    for (var b = 0; b < bandCount; b++) {
      var by = horizonY * (0.14 + b * 0.115);
      var amp = h * (0.005 + (b % 3) * 0.003 + turb * 0.006);
      var phase = tAnim * (0.28 + b * 0.05 + turb * 0.35) + b * 1.3;
      ctx.beginPath();
      ctx.moveTo(0, by);
      for (var sx = 0; sx <= w; sx += Math.max(18, w / 36)) {
        var u = sx / w;
        var wy =
          by +
          Math.sin(u * 5.8 + phase) * amp +
          Math.cos(u * 11.2 - phase * 0.7) * amp * 0.45;
        ctx.lineTo(sx, wy);
      }
      ctx.lineTo(w, by + h * 0.028);
      ctx.lineTo(0, by + h * 0.022);
      ctx.closePath();
      var bandAlpha = (0.055 + turb * 0.035) * (0.7 + (b / bandCount) * 0.5);
      ctx.fillStyle = mixRGBA([235, 195, 130], [218, 228, 234], d * (1 - sub * 0.5), bandAlpha);
      ctx.fill();
    }
    ctx.restore();

    // Shimmering ochre heat-haze bands right above tableland horizon (strongest when desireDepth is low)
    var hazeStrength = (1 - d * 0.72) * (0.65 + turb * 0.35);
    if (hazeStrength > 0.04) {
      for (var hz = 0; hz < 5; hz++) {
        var hy = horizonY - (hz + 0.6) * (h * 0.011);
        var wav = Math.sin(tAnim * 2.6 + hz * 1.5) * (w * 0.012);
        ctx.fillStyle = "rgba(246, 220, 168," + (0.075 * hazeStrength * (1 - hz * 0.16)).toFixed(3) + ")";
        ctx.beginPath();
        ctx.moveTo(0, hy);
        for (var hx = 0; hx <= w; hx += Math.max(16, w / 40)) {
          var dy = Math.sin((hx + wav) * 0.045 + hz * 2.1 + tAnim * 3.4) * (1.8 + turb * 1.6);
          ctx.lineTo(hx, hy + dy);
        }
        ctx.lineTo(w, hy + h * 0.008);
        ctx.lineTo(0, hy + h * 0.008);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Drifting ochre dust motes / salt spray glints in sky
    for (var m = 0; m < DUST_MOTES.length; m++) {
      var mote = DUST_MOTES[m];
      var mu = (mote.u + tAnim * mote.speed * (1 + turb * 1.4)) % 1;
      if (mu < 0) mu += 1;
      var mv = mote.v * 0.94;
      var mx = mu * w;
      var my = mv * horizonY + Math.sin(tAnim * 1.3 + mote.phase) * 3.0;
      var mAlpha = (0.14 + 0.12 * Math.sin(tAnim * 1.9 + mote.phase)) * (0.6 + st.weight * 0.4);
      ctx.fillStyle = mixRGBA([245, 212, 152], [224, 240, 246], d * (1 - sub * 0.4), mAlpha);
      ctx.beginPath();
      ctx.arc(mx, my, mote.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawPlateauAndHarbor(ctx, w, h, horizonY, anchors, st, tAnim) {
    var d = st.desireDepth;
    var sub = st.subMode;
    var turb = st.cuspTurbulence;
    var groundH = h - horizonY;

    // 1. Parched Cracked Ochre Tableland Base
    var desertGrad = ctx.createLinearGradient(0, horizonY, 0, h);
    desertGrad.addColorStop(0.0, "#dfbc80");
    desertGrad.addColorStop(0.16, "#b98245");
    desertGrad.addColorStop(0.52, "#7f5025");
    desertGrad.addColorStop(1.0, "#35200f");
    ctx.fillStyle = desertGrad;
    ctx.fillRect(0, horizonY - 1, w, groundH + 2);

    // Plateau stone strata & cracked polygonal fissures (fade out as harbor water floods in)
    var stoneAlpha = clamp01(1.0 - smoothstep(0.18, 0.92, d));
    if (stoneAlpha > 0.01) {
      ctx.save();
      // Horizontal sedimentary tableland shelves
      for (var s = 0; s < 9; s++) {
        var frac = Math.pow((s + 1) / 9.5, 1.55);
        var sy = horizonY + frac * groundH;
        ctx.strokeStyle = "rgba(62, 36, 15," + (0.24 * stoneAlpha).toFixed(3) + ")";
        ctx.lineWidth = 0.8 + frac * 1.4;
        ctx.beginPath();
        ctx.moveTo(0, sy);
        for (var qx = 0; qx <= w; qx += Math.max(24, w / 28)) {
          var qy = sy + Math.sin(qx * 0.025 + s * 1.9) * (1.5 + frac * 3.2);
          ctx.lineTo(qx, qy);
        }
        ctx.stroke();
      }

      // Perspective-converging desert cracks & polygonal cross-fissures
      for (var f = 0; f < PLATEAU_FISSURES.length; f++) {
        var fis = PLATEAU_FISSURES[f];
        var x0 = fis.uTop * w;
        var x1 = fis.uBot * w;
        ctx.strokeStyle = "rgba(44, 24, 10," + (0.34 * stoneAlpha * fis.weight).toFixed(3) + ")";
        ctx.lineWidth = 0.7 + fis.weight * 0.65;
        ctx.beginPath();
        ctx.moveTo(x0, horizonY + 1);
        var prevX = x0;
        var prevY = horizonY + 1;
        for (var j = 0; j < fis.jag.length; j++) {
          var node = fis.jag[j];
          var ny = horizonY + Math.pow(node.t, 1.35) * groundH;
          var nx = lerp(x0, x1, Math.pow(node.t, 1.15)) + node.off * w;
          ctx.lineTo(nx, ny);
          if (j === 2 && f < PLATEAU_FISSURES.length - 1) {
            // Subtle lateral polygonal crack spur
            var spurX = nx + (f % 2 === 0 ? 1 : -1) * w * 0.028;
            var spurY = ny + groundH * 0.018;
            ctx.moveTo(nx, ny);
            ctx.lineTo(spurX, spurY);
            ctx.moveTo(nx, ny);
          }
          prevX = nx;
          prevY = ny;
        }
        ctx.lineTo(x1, h);
        ctx.stroke();

        // Sunlit rim beside fissure
        ctx.strokeStyle = "rgba(236, 198, 134," + (0.14 * stoneAlpha).toFixed(3) + ")";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(x0 + 1.2, horizonY + 2);
        ctx.lineTo(prevX + 1.5, prevY);
        ctx.stroke();
      }

      // Dry scirocco dust streaks skimming across plateau stones
      for (var ds = 0; ds < 5; ds++) {
        var du = ((ds * 0.23 + tAnim * 0.035) % 1.2) - 0.1;
        var dy = horizonY + (0.14 + ds * 0.17) * groundH;
        var dGrad = ctx.createLinearGradient(du * w - w * 0.16, dy, du * w + w * 0.16, dy);
        dGrad.addColorStop(0, "rgba(232,194,132,0)");
        dGrad.addColorStop(0.5, "rgba(232,194,132," + (0.13 * stoneAlpha * (1 + turb * 0.6)).toFixed(3) + ")");
        dGrad.addColorStop(1, "rgba(232,194,132,0)");
        ctx.fillStyle = dGrad;
        ctx.fillRect(0, dy - 5, w, 10);
      }
      ctx.restore();
    }

    // 2. Prussian / Slate-Teal Harbor Water (intensifies with state.desireDepth)
    var waterAlpha = smoothstep(0.06, 0.78, d);
    if (waterAlpha > 0.01) {
      ctx.save();
      var waterGrad = ctx.createLinearGradient(0, horizonY, 0, h);
      var topWater = mixRGB([34, 88, 106], [28, 56, 70], sub);
      var midWater = mixRGB([20, 62, 82], [18, 38, 50], sub);
      var deepWater = mixRGB([10, 34, 48], [9, 20, 28], sub);
      waterGrad.addColorStop(0.0, topWater);
      waterGrad.addColorStop(0.38, midWater);
      waterGrad.addColorStop(1.0, deepWater);

      ctx.globalAlpha *= waterAlpha;
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, horizonY, w, groundH + 2);

      // Vertical reflections of skyline sails / glowing boiler portholes
      for (var spIdx = 0; spIdx < anchors.spinePoints.length; spIdx++) {
        var sp = anchors.spinePoints[spIdx];
        var reflH = (horizonY - sp.y) * (0.62 + 0.18 * (1 - sub));
        var rGrad = ctx.createLinearGradient(sp.x, horizonY, sp.x, horizonY + reflH);
        if (sub < 0.55) {
          // Cream sail & mast reflection
          rGrad.addColorStop(0.0, mixRGBA([238, 224, 188], [180, 140, 92], sub * 1.6, 0.28 * d));
          rGrad.addColorStop(1.0, "rgba(20,60,78,0)");
        } else {
          // Warm furnace porthole & dark iron hull reflection
          rGrad.addColorStop(0.0, "rgba(235, 134, 52," + (0.30 * d * sub).toFixed(3) + ")");
          rGrad.addColorStop(0.45, "rgba(28, 36, 44," + (0.25 * d).toFixed(3) + ")");
          rGrad.addColorStop(1.0, "rgba(12,24,34,0)");
        }
        ctx.fillStyle = rGrad;
        ctx.fillRect(sp.x - sp.width * 0.42, horizonY, sp.width * 0.84, reflH);
      }

      // Windjammer swells (subMode near 0): broad breezy rolling harbor waves & whitecaps
      var swellStrength = (1 - sub * 0.7) * (0.5 + 0.5 * d);
      if (swellStrength > 0.05) {
        for (var wv = 0; wv < 16; wv++) {
          var wf = Math.pow((wv + 0.6) / 16.5, 1.45);
          var wy = horizonY + wf * groundH;
          var waveLen = w * (0.09 + wf * 0.14);
          var waveAmp = (1.1 + wf * 4.5) * (1 + turb * 0.5);
          ctx.strokeStyle = "rgba(186, 224, 232," + (0.16 * swellStrength * (1 - wf * 0.35)).toFixed(3) + ")";
          ctx.lineWidth = 0.8 + wf * 1.5;
          ctx.beginPath();
          for (var wx = 0; wx <= w; wx += Math.max(14, w / 48)) {
            var yOff =
              Math.sin((wx / waveLen) * Math.PI * 2 - tAnim * 1.8 + wv * 0.9) * waveAmp;
            if (wx === 0) ctx.moveTo(wx, wy + yOff);
            else ctx.lineTo(wx, wy + yOff);
          }
          ctx.stroke();
        }
      }

      // Steamboat Iron-Keel Boiler Vibration Ripples (subMode near 1): high-frequency standing capillary rings & horizontal keel tremor!
      if (sub > 0.08) {
        var vibAlpha = sub * d;
        var hullLeft = anchors.spinePoints[0].x - anchors.spinePoints[0].width * 0.4;
        var hullRight = anchors.spinePoints[8].x + anchors.spinePoints[8].width * 0.5;
        var hullCenter = (hullLeft + hullRight) * 0.5;
        var hullSpan = Math.max(40, hullRight - hullLeft);

        // Rapid concentric elliptical boiler-keel standing ripples
        for (var kr = 0; kr < 14; kr++) {
          var phaseShift = st.reducedMotion ? 0 : (tAnim * 4.2) % 1;
          var ringFrac = (kr + phaseShift) / 14;
          var rx = hullSpan * (0.36 + ringFrac * 0.36);
          var ry = groundH * (0.025 + ringFrac * 0.32);
          var rAlpha = (1 - ringFrac) * 0.34 * vibAlpha;
          ctx.strokeStyle = "rgba(196, 230, 238," + rAlpha.toFixed(3) + ")";
          ctx.lineWidth = 0.75 + (1 - ringFrac) * 0.9;
          ctx.beginPath();
          ctx.ellipse(hullCenter, horizonY + ry * 0.38, rx, ry, 0, 0.04 * Math.PI, 0.96 * Math.PI);
          ctx.stroke();
        }

        // High-frequency horizontal iron-keel shiver striations along waterline
        for (var vr = 0; vr < 11; vr++) {
          var vy = horizonY + (vr + 0.5) * (groundH * 0.015);
          var jit = st.reducedMotion ? 0 : Math.sin(tAnim * 55.0 + vr * 1.9) * 3.2 * sub;
          ctx.strokeStyle = "rgba(255, 198, 134," + (0.20 * vibAlpha * (1 - vr / 12)).toFixed(3) + ")";
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(hullLeft + jit, vy);
          ctx.lineTo(hullRight + jit, vy);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    // Horizon datum shimmer / shoreline foam seam
    var seamGrad = ctx.createLinearGradient(0, horizonY - 3, 0, horizonY + 5);
    seamGrad.addColorStop(0.0, mixRGBA([248, 224, 174], [214, 238, 242], d, 0.42));
    seamGrad.addColorStop(1.0, "rgba(0,0,0,0)");
    ctx.fillStyle = seamGrad;
    ctx.fillRect(0, horizonY - 3, w, 8);
  }

  function drawHorizonCuesAndVessel(ctx, w, h, horizonY, anchors, st, tAnim) {
    var pts = anchors.spinePoints;
    var d = st.desireDepth;
    var sub = st.subMode;
    var turb = st.cuspTurbulence;

    var archWeight = clamp01(1.0 - d * 0.48); // skyline cues stay legibly woven inside the vessel!
    var vesselWeight = smoothstep(0.08, 0.92, d);
    var windjammer = vesselWeight * (1 - sub);
    var steamboat = vesselWeight * sub;

    var p0 = pts[0];
    var p1 = pts[1];
    var p2 = pts[2];
    var p3 = pts[3];
    var p4 = pts[4];
    var p5 = pts[5];
    var p6 = pts[6];
    var p7 = pts[7];
    var p8 = pts[8];

    ctx.save();

    // =========================================================================
    // 1. DISTANT HORIZON ARCHITECTURAL CUES (Skyscrapers, Radar, Windsocks, Chimneys)
    // =========================================================================

    // Continuous distant sandstone/slate skyline plinth connecting spines
    ctx.fillStyle = mixRGBA([86, 56, 33], [32, 44, 54], d, 0.78);
    ctx.beginPath();
    ctx.moveTo(p0.x - p0.width * 0.5, horizonY);
    for (var idx = 0; idx < pts.length; idx++) {
      var sp = pts[idx];
      var shoulderH = (horizonY - sp.y) * (0.28 + (idx % 2) * 0.10);
      ctx.lineTo(sp.x - sp.width * 0.44, horizonY - shoulderH * archWeight);
      ctx.lineTo(sp.x + sp.width * 0.44, horizonY - shoulderH * archWeight * 0.88);
    }
    ctx.lineTo(p8.x + p8.width * 0.5, horizonY);
    ctx.closePath();
    ctx.fill();

    // SPINE 0, 6, 7, 8: Secondary horizon monoliths & port silos
    var auxIndices = [0, 6, 7, 8];
    for (var ai = 0; ai < auxIndices.length; ai++) {
      var ap = pts[auxIndices[ai]];
      var towerH = horizonY - ap.y;
      var tw = ap.width * 0.46;
      ctx.fillStyle = mixRGBA([96, 64, 38], [38, 50, 60], d, 0.82 * archWeight + 0.18);
      ctx.fillRect(ap.x - tw * 0.5, ap.y + towerH * 0.22, tw, towerH * 0.78);
      // Needle spire tip
      ctx.strokeStyle = mixRGBA([134, 92, 52], [182, 196, 206], d, 0.85);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(ap.x, ap.y + towerH * 0.22);
      ctx.lineTo(ap.x, ap.y);
      ctx.stroke();
    }

    // SPINE 2: SHARP SKYSCRAPER PINNACLES (stepped modernist spires + sunlit mullions)
    (function drawSkyscraperPinnacles() {
      var totalH = p2.baseY - p2.y;
      var bw = p2.width * 0.68;
      var bx = p2.x;
      var by = p2.baseY;

      // Left & right flanking needle towers
      var subTowers = [
        { ox: -bw * 0.34, wf: 0.28, hf: 0.68 },
        { ox: bw * 0.32, wf: 0.26, hf: 0.62 },
        { ox: 0, wf: 0.42, hf: 0.84 }
      ];
      for (var tIdx = 0; tIdx < subTowers.length; tIdx++) {
        var stw = subTowers[tIdx];
        var sw = bw * stw.wf;
        var sh = totalH * stw.hf;
        var sx = bx + stw.ox - sw * 0.5;
        var sy = by - sh;

        var bGrad = ctx.createLinearGradient(sx, sy, sx + sw, sy);
        bGrad.addColorStop(0.0, mixRGBA([72, 46, 28], [30, 44, 56], d, 0.92));
        bGrad.addColorStop(0.72, mixRGBA([116, 78, 44], [52, 70, 84], d, 0.92));
        bGrad.addColorStop(1.0, mixRGBA([198, 152, 88], [134, 156, 172], d, 0.88));
        ctx.fillStyle = bGrad;
        ctx.fillRect(sx, sy, sw, sh);

        // Stepped crown & razor pinnacle
        ctx.beginPath();
        ctx.moveTo(sx + sw * 0.12, sy);
        ctx.lineTo(sx + sw * 0.5, sy - totalH * 0.16);
        ctx.lineTo(sx + sw * 0.88, sy);
        ctx.closePath();
        ctx.fill();

        // Vertical sunlit glass-mullion slits
        ctx.strokeStyle = mixRGBA([242, 202, 134], [190, 214, 226], d, 0.32 * archWeight);
        ctx.lineWidth = 0.8;
        for (var m = 1; m <= 3; m++) {
          var mx = sx + (sw * m) / 4;
          ctx.beginPath();
          ctx.moveTo(mx, sy + 4);
          ctx.lineTo(mx, by - 2);
          ctx.stroke();
        }
      }

      // Main razor-needle finial reaching exact p2.y
      ctx.strokeStyle = mixRGBA([232, 188, 118], [218, 226, 232], d, 0.95);
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(bx, by - totalH * 0.84);
      ctx.lineTo(bx, p2.y);
      ctx.stroke();
    })();

    // SPINE 1: ROTATING / LATTICE RADAR ANTENNAE
    (function drawRadarTower() {
      var totalH = p1.baseY - p1.y;
      var baseW = p1.width * 0.42;
      var topW = p1.width * 0.10;
      var topY = p1.y + totalH * 0.16;

      ctx.strokeStyle = mixRGBA([92, 58, 34], [58, 78, 92], d, 0.92);
      ctx.lineWidth = 1.5;

      // Tapered steel lattice legs
      ctx.beginPath();
      ctx.moveTo(p1.x - baseW * 0.5, p1.baseY);
      ctx.lineTo(p1.x - topW * 0.5, topY);
      ctx.moveTo(p1.x + baseW * 0.5, p1.baseY);
      ctx.lineTo(p1.x + topW * 0.5, topY);
      ctx.stroke();

      // Diagonal X-bracing trusses (6 tiers)
      ctx.lineWidth = 1.0;
      var tiers = 6;
      for (var k = 0; k < tiers; k++) {
        var f0 = k / tiers;
        var f1 = (k + 1) / tiers;
        var y0 = lerp(p1.baseY, topY, f0);
        var y1 = lerp(p1.baseY, topY, f1);
        var hw0 = lerp(baseW * 0.5, topW * 0.5, f0);
        var hw1 = lerp(baseW * 0.5, topW * 0.5, f1);
        ctx.beginPath();
        ctx.moveTo(p1.x - hw0, y0);
        ctx.lineTo(p1.x + hw1, y1);
        ctx.moveTo(p1.x + hw0, y0);
        ctx.lineTo(p1.x - hw1, y1);
        ctx.moveTo(p1.x - hw1, y1);
        ctx.lineTo(p1.x + hw1, y1);
        ctx.stroke();
      }

      // Rotating parabolic mesh radar dish at p1.y
      var sweep = Math.cos(tAnim * 1.65);
      var dishW = Math.max(3.5, Math.abs(sweep) * p1.width * 0.34);
      var dishH = totalH * 0.15;
      var dishCY = p1.y + dishH * 0.55;

      ctx.strokeStyle = mixRGBA([224, 178, 108], [198, 222, 234], d, 0.92);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(p1.x, dishCY, dishW * 0.5, dishH * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Feed horn & beacon glint
      var hornDir = sweep >= 0 ? 1 : -1;
      ctx.beginPath();
      ctx.moveTo(p1.x, dishCY);
      ctx.lineTo(p1.x + hornDir * p1.width * 0.16, dishCY - 2);
      ctx.stroke();

      var glint = st.reducedMotion ? 0.65 : 0.45 + 0.5 * Math.max(0, Math.sin(tAnim * 3.3));
      ctx.fillStyle = "rgba(238, 92, 62," + (glint * 0.85).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    })();

    // SPINE 3: WHITE-AND-RED STRIPED WINDSOCKS
    (function drawWindsocks() {
      var mastH = p3.baseY - p3.y;
      ctx.strokeStyle = mixRGBA([102, 68, 38], [84, 102, 114], d, 0.92);
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.baseY);
      ctx.lineTo(p3.x, p3.y);
      // Secondary shorter anemometer mast beside it
      ctx.moveTo(p3.x - p3.width * 0.24, p3.baseY);
      ctx.lineTo(p3.x - p3.width * 0.24, p3.y + mastH * 0.28);
      ctx.stroke();

      // Draw two white-and-red 5-band conical windsocks snapping in the wind
      var socks = [
        { x: p3.x, y: p3.y + 4, len: p3.width * 0.72, mouthR: 5.5, phase: 0.0 },
        { x: p3.x - p3.width * 0.24, y: p3.y + mastH * 0.30, len: p3.width * 0.52, mouthR: 4.2, phase: 1.4 }
      ];
      for (var sIdx = 0; sIdx < socks.length; sIdx++) {
        var sk = socks[sIdx];
        var segs = 5;
        var prevX = sk.x + 3;
        var prevY = sk.y;
        var prevR = sk.mouthR;

        // Bridle lines from mast to hoop
        ctx.strokeStyle = "rgba(220,210,192,0.75)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(sk.x, sk.y);
        ctx.lineTo(prevX, prevY - prevR);
        ctx.moveTo(sk.x, sk.y);
        ctx.lineTo(prevX, prevY + prevR);
        ctx.stroke();

        for (var band = 0; band < segs; band++) {
          var t1 = (band + 1) / segs;
          var nextX = sk.x + 3 + sk.len * t1;
          var flutter =
            Math.sin(tAnim * (7.5 + turb * 5.0) - band * 0.95 + sk.phase) *
            (2.2 + band * 1.15) *
            (st.reducedMotion ? 0.25 : 1);
          var droop = t1 * t1 * 3.5;
          var nextY = sk.y + droop + flutter;
          var nextR = lerp(sk.mouthR, sk.mouthR * 0.32, t1);

          ctx.fillStyle = band % 2 === 0 ? "#d9412c" : "#f6efe2";
          ctx.beginPath();
          ctx.moveTo(prevX, prevY - prevR);
          ctx.lineTo(nextX, nextY - nextR);
          ctx.lineTo(nextX, nextY + nextR);
          ctx.lineTo(prevX, prevY + prevR);
          ctx.closePath();
          ctx.fill();

          prevX = nextX;
          prevY = nextY;
          prevR = nextR;
        }
      }
    })();

    // SPINE 4: SMOKE-BELCHING CHIMNEYS / TWIN STEAMER FUNNELS
    (function drawChimneysAndSmoke() {
      var chH = p4.baseY - p4.y;
      var rake = -sub * d * (p4.width * 0.14); // raked steamer funnels as subMode & desireDepth rise
      var stacks = [
        { ox: -p4.width * 0.18, hf: 1.0, wf: 0.22, phase: 0.0 },
        { ox: p4.width * 0.17, hf: 0.88, wf: 0.20, phase: 1.7 }
      ];

      for (var stIdx = 0; stIdx < stacks.length; stIdx++) {
        var sc = stacks[stIdx];
        var sh = chH * sc.hf;
        var sw = p4.width * sc.wf * (1 + steamboat * 0.38);
        var bx = p4.x + sc.ox;
        var tx = bx + rake * sc.hf;
        var ty = p4.baseY - sh;

        // Smoke / steam plume rising and drifting right across sky
        var puffCount = 11;
        for (var pf = puffCount - 1; pf >= 0; pf--) {
          var cycle = st.reducedMotion
            ? pf / puffCount
            : ((pf / puffCount + tAnim * (0.28 + steamboat * 0.24) + sc.phase * 0.1) % 1);
          var px =
            tx +
            Math.pow(cycle, 1.15) * w * (0.09 + turb * 0.05) +
            Math.sin(cycle * 8.0 + tAnim * 2.4 + sc.phase) * 5.0;
          var py = ty - Math.pow(cycle, 0.78) * (h * (0.11 + steamboat * 0.05));
          var pr = sw * (0.55 + cycle * (2.2 + steamboat * 0.9));
          var sootAlpha = (1 - cycle) * (0.28 + steamboat * 0.24);

          // Soot core + sunlit steam rim
          ctx.fillStyle = mixRGBA([72, 54, 42], [38, 40, 46], steamboat, sootAlpha);
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fill();

          if (steamboat > 0.15 && pf % 2 === 0) {
            ctx.fillStyle = "rgba(226, 224, 216," + (sootAlpha * 0.45 * steamboat).toFixed(3) + ")";
            ctx.beginPath();
            ctx.arc(px - pr * 0.22, py - pr * 0.2, pr * 0.62, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Stack / funnel body
        ctx.fillStyle = mixRGBA([98, 54, 34], [26, 29, 34], d * (0.45 + sub * 0.55), 0.95);
        ctx.beginPath();
        ctx.moveTo(bx - sw * 0.56, p4.baseY);
        ctx.lineTo(tx - sw * 0.44, ty);
        ctx.lineTo(tx + sw * 0.44, ty);
        ctx.lineTo(bx + sw * 0.56, p4.baseY);
        ctx.closePath();
        ctx.fill();

        // Steamer crimson-ochre company band & iron collar rings
        var bandY = lerp(ty, p4.baseY, 0.24);
        var bandX = lerp(tx, bx, 0.24);
        ctx.strokeStyle = mixRGBA([212, 152, 82], [198, 62, 42], steamboat, 0.92);
        ctx.lineWidth = 3.2 + steamboat * 2.4;
        ctx.beginPath();
        ctx.moveTo(bandX - sw * 0.47, bandY);
        ctx.lineTo(bandX + sw * 0.47, bandY);
        ctx.stroke();

        // Crown rim
        ctx.strokeStyle = "rgba(18, 20, 24, 0.9)";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(tx - sw * 0.5, ty);
        ctx.lineTo(tx + sw * 0.5, ty);
        ctx.stroke();
      }
    })();

    // SPINE 5: CENTRAL CITADEL / GRAIN ELEVATOR MASSIF (transfigures into Mainmast / Boiler Superstructure)
    (function drawCentralSpineCore() {
      var coreH = p5.baseY - p5.y;
      var cw = p5.width * 0.46;
      ctx.fillStyle = mixRGBA([88, 56, 32], [32, 42, 52], d, 0.88 * (1 - windjammer * 0.45));
      ctx.fillRect(p5.x - cw * 0.5, p5.baseY - coreH * 0.62, cw, coreH * 0.62);

      // Central tall mast / spire shaft to p5.y
      ctx.strokeStyle = mixRGBA([148, 102, 56], [216, 190, 140], windjammer, 0.95);
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(p5.x, p5.baseY);
      ctx.lineTo(p5.x, p5.y);
      ctx.stroke();
    })();

    // =========================================================================
    // 2. TRANSFIGURED VESSEL OF DESIRE (intensifies as state.desireDepth -> 1)
    // =========================================================================
    if (vesselWeight > 0.02) {
      var bowX = p0.x - p0.width * 0.55;
      var sternX = p8.x + p8.width * 0.42;
      var hullTopBow = p0.baseY - h * (0.044 + steamboat * 0.014);
      var hullTopMid = p4.baseY - h * (0.028 + steamboat * 0.018);
      var hullTopStern = p8.baseY - h * (0.038 + steamboat * 0.012);
      var keelWaterY = horizonY + h * (0.012 + steamboat * 0.008);

      // --- A. HULL ALONG HORIZON WATERLINE ---
      ctx.save();
      ctx.globalAlpha *= vesselWeight;

      // Hull body polygon (sleek clipper sheer for subMode->0, heavy vertical-prow iron steamer for subMode->1)
      var prowOverhang = lerp(w * 0.032, w * 0.008, sub);
      ctx.beginPath();
      ctx.moveTo(bowX - prowOverhang, hullTopBow - (1 - sub) * h * 0.012);
      ctx.quadraticCurveTo((bowX + sternX) * 0.46, hullTopMid, sternX + w * 0.01, hullTopStern);
      ctx.lineTo(sternX, keelWaterY);
      ctx.lineTo(bowX + w * 0.008, keelWaterY);
      ctx.closePath();

      var hullGrad = ctx.createLinearGradient(0, hullTopBow, 0, keelWaterY);
      hullGrad.addColorStop(0.0, mixRGB([54, 38, 26], [36, 42, 48], sub));
      hullGrad.addColorStop(0.68, mixRGB([34, 24, 18], [20, 24, 29], sub));
      hullGrad.addColorStop(1.0, mixRGB([112, 58, 34], [128, 42, 28], sub)); // copper sheathing / red-oxide iron keel!
      ctx.fillStyle = hullGrad;
      ctx.fill();

      // Windjammer gunport stripe & bowsprit (subMode near 0)
      if (windjammer > 0.04) {
        ctx.save();
        ctx.globalAlpha *= 1 - sub * 0.85;
        // Pale cream sheer-strake ribbon
        ctx.strokeStyle = "#ebd9b4";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(bowX - prowOverhang * 0.7, hullTopBow + 4);
        ctx.quadraticCurveTo((bowX + sternX) * 0.46, hullTopMid + 4, sternX, hullTopStern + 4);
        ctx.stroke();

        // Long tapered bowsprit & jibboom thrusting forward from bowX!
        var spritTipX = bowX - w * 0.068;
        var spritTipY = hullTopBow - h * 0.038;
        ctx.strokeStyle = "#c99f62";
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.moveTo(bowX + w * 0.01, hullTopBow + 2);
        ctx.lineTo(spritTipX, spritTipY);
        ctx.stroke();

        // Dolphin striker & bobstay cables
        ctx.strokeStyle = "rgba(218, 198, 162, 0.72)";
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.moveTo(bowX - w * 0.02, hullTopBow - h * 0.012);
        ctx.lineTo(bowX - w * 0.018, hullTopBow + h * 0.018);
        ctx.lineTo(spritTipX, spritTipY);
        ctx.lineTo(bowX + w * 0.005, keelWaterY - 2);
        ctx.stroke();
        ctx.restore();
      }

      // Steamboat Riveted Iron Hull Plates & Glowing Furnace Portholes (subMode near 1)
      if (steamboat > 0.04) {
        ctx.save();
        ctx.globalAlpha *= sub;
        var plateSeams = 14;
        ctx.strokeStyle = "rgba(92, 106, 118, 0.48)";
        ctx.lineWidth = 1.0;
        for (var ps = 1; ps < plateSeams; ps++) {
          var pu = ps / plateSeams;
          var px = lerp(bowX, sternX, pu);
          var pyTop = lerp(hullTopBow, hullTopStern, pu) + Math.sin(pu * Math.PI) * (hullTopMid - hullTopBow) * 0.85;
          ctx.beginPath();
          ctx.moveTo(px, pyTop);
          ctx.lineTo(px, keelWaterY);
          ctx.stroke();

          // Specular rivet dots along plate seam
          ctx.fillStyle = "rgba(168, 184, 196, 0.55)";
          ctx.fillRect(px - 2.2, pyTop + 3, 1.3, 1.3);
          ctx.fillRect(px + 1.2, (pyTop + keelWaterY) * 0.5, 1.3, 1.3);

          // Glowing amber-orange boiler furnace portholes along midships!
          if (ps >= 3 && ps <= 11) {
            var pulse = st.reducedMotion ? 0.85 : 0.68 + 0.32 * Math.sin(tAnim * 9.5 + ps * 1.1);
            var portY = lerp(pyTop, keelWaterY, 0.52);
            var glowR = 5.5;
            var pGlow = ctx.createRadialGradient(px + 6, portY, 0.5, px + 6, portY, glowR);
            pGlow.addColorStop(0.0, "rgba(255, 224, 132," + (0.95 * pulse).toFixed(3) + ")");
            pGlow.addColorStop(0.45, "rgba(236, 108, 32," + (0.65 * pulse).toFixed(3) + ")");
            pGlow.addColorStop(1.0, "rgba(236, 108, 32, 0)");
            ctx.fillStyle = pGlow;
            ctx.beginPath();
            ctx.arc(px + 6, portY, glowR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // --- B. WINDJAMMER SWELLING SAILS, SHROUDS & RATLINES (subMode near 0) ---
      if (windjammer > 0.03) {
        ctx.save();
        ctx.globalAlpha *= windjammer;

        // Square-rigged masts on spine-1, spine-2, spine-5, spine-6:
        // "breeze already swelling big cream/canvas sheets that are not yet unfurled"
        var sailMasts = [
          { pt: p1, tiers: [0.22, 0.54] },
          { pt: p2, tiers: [0.16, 0.44, 0.72] },
          { pt: p5, tiers: [0.14, 0.40, 0.68] },
          { pt: p6, tiers: [0.26, 0.58] }
        ];

        var spritTipX2 = bowX - w * 0.068;
        var spritTipY2 = hullTopBow - h * 0.038;

        // Fore-staysails & jibs running from p1 down to bowsprit!
        for (var jb = 0; jb < 3; jb++) {
          var stayTopY = lerp(p1.y + 8, p1.baseY - h * 0.07, jb * 0.34);
          var stayFootX = lerp(spritTipX2, bowX, jb * 0.38);
          var stayFootY = lerp(spritTipY2, hullTopBow, jb * 0.38);
          var belly = w * (0.022 + turb * 0.008) + Math.sin(tAnim * 2.4 + jb) * 3.0;

          ctx.fillStyle = jb % 2 === 0 ? "rgba(246, 233, 202, 0.88)" : "rgba(234, 216, 178, 0.84)";
          ctx.beginPath();
          ctx.moveTo(p1.x, stayTopY);
          ctx.quadraticCurveTo(
            (p1.x + stayFootX) * 0.5 - belly * 0.4,
            (stayTopY + stayFootY) * 0.52,
            stayFootX,
            stayFootY
          );
          ctx.quadraticCurveTo(
            stayFootX + w * 0.028,
            stayFootY - h * 0.012,
            p1.x - w * 0.012,
            stayTopY + h * 0.048
          );
          ctx.closePath();
          ctx.fill();
        }

        // Square-rigged yards & wind-bellied brailed canvas sheets
        for (var sm = 0; sm < sailMasts.length; sm++) {
          var mast = sailMasts[sm].pt;
          var mSpan = mast.baseY - mast.y;

          // Taut shrouds & ratlines down to hull gunwales
          var shroudSpread = mast.width * 0.36;
          ctx.strokeStyle = "rgba(210, 190, 152, 0.52)";
          ctx.lineWidth = 0.9;
          for (var shL = -2; shL <= 2; shL++) {
            if (shL === 0) continue;
            ctx.beginPath();
            ctx.moveTo(mast.x, mast.y + mSpan * 0.18);
            ctx.lineTo(mast.x + (shL / 2) * shroudSpread, hullTopMid + 2);
            ctx.stroke();
          }
          // Horizontal ratline rungs
          ctx.lineWidth = 0.65;
          for (var rl = 1; rl <= 7; rl++) {
            var rf = 0.24 + (rl / 8) * 0.68;
            var ry = lerp(mast.y, hullTopMid, rf);
            var rhw = shroudSpread * ((rf - 0.18) / 0.82);
            ctx.beginPath();
            ctx.moveTo(mast.x - rhw, ry);
            ctx.lineTo(mast.x + rhw, ry);
            ctx.stroke();
          }

          // Crossed yards + swelling canvas sheets (clewed up slightly at corners, bellying forward in breeze!)
          var tiers = sailMasts[sm].tiers;
          for (var tr = 0; tr < tiers.length; tr++) {
            var tf = tiers[tr];
            var yardY = mast.y + mSpan * tf;
            var yardW = mast.width * (0.62 + tr * 0.18);
            var sheetDrop = mSpan * (0.19 + tr * 0.025);
            var windBelly =
              (8.5 + tr * 3.5 + turb * 4.5) +
              (st.reducedMotion ? 0 : Math.sin(tAnim * 2.2 + sm * 1.1 + tr * 0.8) * 2.8);

            // Wooden/iron yardarm spar
            ctx.strokeStyle = "#caa266";
            ctx.lineWidth = 2.0;
            ctx.beginPath();
            ctx.moveTo(mast.x - yardW * 0.54, yardY);
            ctx.lineTo(mast.x + yardW * 0.54, yardY);
            ctx.stroke();

            // Billowing cream canvas sheet (not yet fully unfurled: clews brailed slightly inward with arched foot!)
            var sGrad = ctx.createLinearGradient(
              mast.x - yardW * 0.5,
              yardY,
              mast.x + yardW * 0.4,
              yardY + sheetDrop
            );
            sGrad.addColorStop(0.0, "#fbf1da");
            sGrad.addColorStop(0.62, "#ead5aa");
            sGrad.addColorStop(1.0, "#b89662");

            ctx.fillStyle = sGrad;
            ctx.beginPath();
            ctx.moveTo(mast.x - yardW * 0.48, yardY + 1);
            ctx.lineTo(mast.x + yardW * 0.48, yardY + 1);
            // Leeward billowing leech curving out with windBelly
            ctx.bezierCurveTo(
              mast.x + yardW * 0.55 + windBelly,
              yardY + sheetDrop * 0.45,
              mast.x + yardW * 0.46 + windBelly * 0.7,
              yardY + sheetDrop * 0.88,
              mast.x + yardW * 0.36,
              yardY + sheetDrop * 0.78
            );
            // Brailed bunt / foot arch ("not yet unfurled" tensioned by buntlines!)
            ctx.quadraticCurveTo(
              mast.x + windBelly * 0.55,
              yardY + sheetDrop * 1.06,
              mast.x - yardW * 0.34,
              yardY + sheetDrop * 0.76
            );
            ctx.quadraticCurveTo(
              mast.x - yardW * 0.40 + windBelly * 0.45,
              yardY + sheetDrop * 0.42,
              mast.x - yardW * 0.48,
              yardY + 1
            );
            ctx.closePath();
            ctx.fill();

            // Subtle vertical canvas seam lines & buntlines
            ctx.strokeStyle = "rgba(138, 104, 58, 0.32)";
            ctx.lineWidth = 0.75;
            for (var sl = -1; sl <= 1; sl++) {
              var sx0 = mast.x + sl * yardW * 0.18;
              ctx.beginPath();
              ctx.moveTo(sx0, yardY + 2);
              ctx.quadraticCurveTo(
                sx0 + windBelly * 0.55,
                yardY + sheetDrop * 0.52,
                sx0 * 0.98 + mast.x * 0.02,
                yardY + sheetDrop * 0.86
              );
              ctx.stroke();
            }
          }
        }

        // Midships staysail between spine-3 / spine-4 and spine-5
        ctx.fillStyle = "rgba(242, 226, 192, 0.76)";
        ctx.beginPath();
        ctx.moveTo(p5.x, p5.y + (p5.baseY - p5.y) * 0.18);
        ctx.quadraticCurveTo(
          (p5.x + p3.x) * 0.5 + 8,
          (p5.y + hullTopMid) * 0.58,
          p3.x,
          hullTopMid - 4
        );
        ctx.lineTo(p4.x + 8, hullTopMid - 2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      // --- C. INTER-SPINE STAYS, PENNANTS & ENSIGNS ---
      ctx.strokeStyle = mixRGBA([216, 194, 152], [134, 152, 166], sub, 0.62 * vesselWeight);
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      for (var c = 0; c < pts.length - 1; c++) {
        var a = pts[c];
        var b = pts[c + 1];
        ctx.moveTo(a.x, a.y + 4);
        ctx.quadraticCurveTo((a.x + b.x) * 0.5, Math.max(a.y, b.y) + h * 0.022, b.x, b.y + 8);
      }
      ctx.stroke();

      // Long snapping departure pennant at tallest crest (spine-5) & stern ensign (spine-8)
      var pennants = [
        { x: p5.x, y: p5.y, len: w * 0.055, color: "#d8482e" },
        { x: p2.x, y: p2.y, len: w * 0.038, color: "#e8b654" },
        { x: p8.x, y: p8.y, len: w * 0.032, color: "#c83b2b" }
      ];
      for (var pn = 0; pn < pennants.length; pn++) {
        var pen = pennants[pn];
        var fl = st.reducedMotion ? 2 : Math.sin(tAnim * 8.2 + pn * 1.9) * (4.5 + turb * 3.0);
        ctx.fillStyle = pen.color;
        ctx.beginPath();
        ctx.moveTo(pen.x, pen.y);
        ctx.quadraticCurveTo(pen.x + pen.len * 0.5, pen.y - 3 + fl * 0.6, pen.x + pen.len, pen.y + fl);
        ctx.quadraticCurveTo(pen.x + pen.len * 0.5, pen.y + 4 + fl * 0.5, pen.x, pen.y + 5);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  function drawChamber0Cranes(ctx, rect, d, sub, tAnim, reducedMotion) {
    var x = rect.x;
    var y = rect.y;
    var w = rect.w;
    var h = rect.h;

    // Deep maritime harbor dusk backdrop inside chamber
    var bg = ctx.createLinearGradient(x, y, x, y + h);
    bg.addColorStop(0.0, "#172d3b");
    bg.addColorStop(0.65, "#244354");
    bg.addColorStop(1.0, "#10212b");
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, w, h);

    // Warm warehouse lantern glow on right quay
    var qGlow = ctx.createRadialGradient(x + w * 0.76, y + h * 0.62, 2, x + w * 0.76, y + h * 0.62, w * 0.45);
    qGlow.addColorStop(0.0, "rgba(244, 186, 98, 0.42)");
    qGlow.addColorStop(1.0, "rgba(244, 186, 98, 0)");
    ctx.fillStyle = qGlow;
    ctx.fillRect(x, y, w, h);

    // Masonry harbor quay platform across lower third
    var quayY = y + h * 0.73;
    ctx.fillStyle = "#2b2622";
    ctx.fillRect(x + w * 0.30, quayY, w * 0.70, h * 0.27);
    ctx.fillStyle = "#6c5d4c";
    ctx.fillRect(x + w * 0.30, quayY, w * 0.70, 3.5);

    // Water channel on left with golden ripple glints
    ctx.fillStyle = "#0e2836";
    ctx.fillRect(x, quayY + 3, w * 0.32, h * 0.27);
    ctx.strokeStyle = "rgba(226, 188, 118, 0.45)";
    ctx.lineWidth = 1.0;
    for (var rp = 0; rp < 3; rp++) {
      var ry = quayY + 8 + rp * 7;
      ctx.beginPath();
      ctx.moveTo(x + 6, ry);
      ctx.lineTo(x + w * 0.27, ry);
      ctx.stroke();
    }

    // Iron Harbor Gantry & Luffing Jib Crane
    var pedX = x + w * 0.36;
    var pedTopY = quayY - h * 0.26;
    var jibTipX = x + w * 0.68;
    var jibTipY = y + h * 0.15;

    ctx.strokeStyle = "#8ca2b0";
    ctx.lineWidth = 2.0;
    // Gantry portal legs
    ctx.beginPath();
    ctx.moveTo(pedX - w * 0.08, quayY);
    ctx.lineTo(pedX - w * 0.03, pedTopY);
    ctx.lineTo(pedX + w * 0.05, pedTopY);
    ctx.lineTo(pedX + w * 0.09, quayY);
    ctx.stroke();

    // Operator cab
    ctx.fillStyle = "#32434f";
    ctx.fillRect(pedX - w * 0.04, pedTopY - h * 0.11, w * 0.10, h * 0.11);
    ctx.fillStyle = "#efc16d";
    ctx.fillRect(pedX + w * 0.01, pedTopY - h * 0.09, w * 0.038, h * 0.05);

    // Diagonal lattice jib boom + top tie-rod
    ctx.strokeStyle = "#a8bcc8";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(pedX + w * 0.02, pedTopY - h * 0.04);
    ctx.lineTo(jibTipX, jibTipY);
    ctx.moveTo(pedX - w * 0.02, pedTopY - h * 0.18);
    ctx.lineTo(pedX + w * 0.01, pedTopY - h * 0.04);
    ctx.moveTo(pedX - w * 0.02, pedTopY - h * 0.18);
    ctx.lineTo(jibTipX, jibTipY);
    ctx.stroke();

    // Lattice cross-ticks along jib
    ctx.lineWidth = 1.0;
    for (var lt = 1; lt <= 5; lt++) {
      var lf = lt / 6;
      var lx = lerp(pedX + w * 0.02, jibTipX, lf);
      var ly = lerp(pedTopY - h * 0.04, jibTipY, lf);
      ctx.beginPath();
      ctx.moveTo(lx, ly);
      ctx.lineTo(lx - 4, ly - 6);
      ctx.stroke();
    }

    // Sheave pulley wheel at jib tip
    ctx.beginPath();
    ctx.arc(jibTipX, jibTipY, 3.5, 0, Math.PI * 2);
    ctx.stroke();

    // Swinging hoist cable & banded foreign crate
    var swing = reducedMotion ? 0.06 : Math.sin(tAnim * 1.55) * 0.11;
    var cableLen = h * 0.30;
    var hookX = jibTipX + Math.sin(swing) * cableLen;
    var hookY = jibTipY + Math.cos(swing) * cableLen;

    ctx.strokeStyle = "#d9cbb0";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(jibTipX - 1.5, jibTipY);
    ctx.lineTo(hookX - 1.5, hookY);
    ctx.moveTo(jibTipX + 1.5, jibTipY);
    ctx.lineTo(hookX + 1.5, hookY);
    ctx.stroke();

    // Banded wooden crate suspended from crane hook
    ctx.save();
    ctx.translate(hookX, hookY + 2);
    ctx.rotate(swing * 0.65);
    var crW = w * 0.16;
    var crH = h * 0.14;
    ctx.fillStyle = "#b87f42";
    ctx.fillRect(-crW * 0.5, 0, crW, crH);
    ctx.strokeStyle = "#4d3118";
    ctx.lineWidth = 1.4;
    ctx.strokeRect(-crW * 0.5, 0, crW, crH);
    // Diagonal timber brace & stencil bars
    ctx.beginPath();
    ctx.moveTo(-crW * 0.5, 0);
    ctx.lineTo(crW * 0.5, crH);
    ctx.moveTo(crW * 0.5, 0);
    ctx.lineTo(-crW * 0.5, crH);
    ctx.stroke();
    ctx.restore();

    // Quay merchandise: stenciled cargo bales + terracotta amphorae!
    // Stacked bales
    var baleX = x + w * 0.49;
    ctx.fillStyle = "#c9ab78";
    ctx.fillRect(baleX, quayY - h * 0.12, w * 0.15, h * 0.12);
    ctx.fillStyle = "#dfc494";
    ctx.fillRect(baleX + w * 0.03, quayY - h * 0.21, w * 0.12, h * 0.09);
    ctx.strokeStyle = "#6e4e2a";
    ctx.lineWidth = 1.0;
    ctx.strokeRect(baleX, quayY - h * 0.12, w * 0.15, h * 0.12);

    // Two terracotta amphorae on right quay
    var amphPositions = [x + w * 0.75, x + w * 0.85];
    for (var am = 0; am < amphPositions.length; am++) {
      var ax = amphPositions[am];
      var ay = quayY - h * 0.09;
      var ar = w * 0.034;
      ctx.fillStyle = am === 0 ? "#c4653a" : "#ad522c";
      ctx.beginPath();
      ctx.ellipse(ax, ay, ar, h * 0.075, am === 1 ? 0.14 : -0.05, 0, Math.PI * 2);
      ctx.fill();
      // Amphora neck & twin handles
      ctx.fillRect(ax - ar * 0.35, ay - h * 0.12, ar * 0.7, h * 0.05);
      ctx.strokeStyle = "#df8a5c";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(ax - ar * 0.65, ay - h * 0.06, ar * 0.45, Math.PI * 0.5, Math.PI * 1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(ax + ar * 0.65, ay - h * 0.06, ar * 0.45, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.stroke();
    }
  }

  function drawChamber1Taverns(ctx, rect, d, sub, tAnim, reducedMotion) {
    var x = rect.x;
    var y = rect.y;
    var w = rect.w;
    var h = rect.h;

    // Warm smoky amber lantern-lit tavern vault interior
    var bg = ctx.createRadialGradient(
      x + w * 0.5,
      y + h * 0.46,
      w * 0.04,
      x + w * 0.5,
      y + h * 0.5,
      w * 0.68
    );
    bg.addColorStop(0.0, "#f5c26b");
    bg.addColorStop(0.48, "#b86828");
    bg.addColorStop(0.85, "#4d2614");
    bg.addColorStop(1.0, "#23120b");
    ctx.fillStyle = bg;
    ctx.fillRect(x, y, w, h);

    // Dark vaulted tavern masonry arch framing the top
    ctx.fillStyle = "#1d130e";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + h * 0.34);
    ctx.quadraticCurveTo(x + w * 0.5, y - h * 0.08, x, y + h * 0.34);
    ctx.closePath();
    ctx.fill();

    // Hanging wrought-iron lantern at center vault
    var lx = x + w * 0.5;
    var ly = y + h * 0.19;
    ctx.strokeStyle = "#2b1b12";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(lx, y + 2);
    ctx.lineTo(lx, ly - 5);
    ctx.stroke();
    ctx.fillStyle = "#fff1b8";
    ctx.beginPath();
    ctx.arc(lx, ly, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // Maritime flags of different nations strung across the tavern arch!
    var flags = [
      { u: 0.14, c1: "#1d4e89", c2: "#f4d35e", style: "cross" },
      { u: 0.30, c1: "#c83e2b", c2: "#f6efe2", style: "stripe" },
      { u: 0.46, c1: "#1f7a5c", c2: "#f2efe9", style: "tri" },
      { u: 0.64, c1: "#e09f3e", c2: "#223843", style: "diag" },
      { u: 0.80, c1: "#9e2a2b", c2: "#fff3b0", style: "swallow" }
    ];

    ctx.strokeStyle = "rgba(44, 24, 12, 0.75)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.08, y + h * 0.24);
    ctx.quadraticCurveTo(x + w * 0.5, y + h * 0.34, x + w * 0.92, y + h * 0.24);
    ctx.stroke();

    for (var fi = 0; fi < flags.length; fi++) {
      var fl = flags[fi];
      var fx = x + fl.u * w;
      var fy = y + h * (0.24 + Math.sin(fl.u * Math.PI) * 0.05);
      var fw = w * 0.105;
      var fh = h * 0.115;
      var sway = reducedMotion ? 0 : Math.sin(tAnim * 3.1 + fi * 1.2) * 2.0;

      ctx.save();
      ctx.translate(fx, fy);
      ctx.transform(1, 0, sway * 0.04, 1, 0, 0);
      ctx.fillStyle = fl.c1;
      if (fl.style === "swallow") {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(fw, 0);
        ctx.lineTo(fw * 0.72, fh * 0.5);
        ctx.lineTo(fw, fh);
        ctx.lineTo(0, fh);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, fw, fh);
      }

      ctx.fillStyle = fl.c2;
      if (fl.style === "cross") {
        ctx.fillRect(fw * 0.34, 0, fw * 0.2, fh);
        ctx.fillRect(0, fh * 0.38, fw, fh * 0.22);
      } else if (fl.style === "stripe") {
        ctx.fillRect(0, fh * 0.33, fw, fh * 0.33);
      } else if (fl.style === "tri") {
        ctx.fillRect(fw * 0.33, 0, fw * 0.34, fh);
      } else {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(fw, fh);
        ctx.lineTo(fw, fh * 0.65);
        ctx.lineTo(fw * 0.35, 0);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    // Trestle table & energetic flag-crew sailor silhouettes
    var tableY = y + h * 0.80;
    ctx.fillStyle = "#24130c";
    ctx.fillRect(x + w * 0.12, tableY, w * 0.76, h * 0.06);

    var crew = [
      { cx: x + w * 0.26, dir: 1, phase: 0.0 },
      { cx: x + w * 0.50, dir: -1, phase: 1.1 },
      { cx: x + w * 0.74, dir: -1, phase: 2.2 }
    ];

    var clinkPulse = reducedMotion ? 0.75 : (Math.sin(tAnim * 3.8) + 1) * 0.5;

    for (var ci = 0; ci < crew.length; ci++) {
      var cr = crew[ci];
      var lean = reducedMotion ? 0 : Math.sin(tAnim * 3.8 + cr.phase) * 3.2;
      var headX = cr.cx + lean;
      var headY = y + h * 0.60;

      ctx.fillStyle = "#1c0f09";
      // Torso silhouette
      ctx.beginPath();
      ctx.moveTo(cr.cx - w * 0.08, y + h);
      ctx.lineTo(headX - w * 0.065, headY + 8);
      ctx.lineTo(headX + w * 0.065, headY + 8);
      ctx.lineTo(cr.cx + w * 0.08, y + h);
      ctx.closePath();
      ctx.fill();

      // Head + sailor cap silhouette
      ctx.beginPath();
      ctx.arc(headX, headY, w * 0.042, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(headX - w * 0.052, headY - w * 0.046, w * 0.104, 3.2);

      // Raised toast arm holding green/amber glass bottle toward center!
      var armTargetX = x + w * (ci === 0 ? 0.44 : ci === 1 ? 0.48 : 0.57);
      var armTargetY = y + h * (0.46 + (1 - clinkPulse) * 0.05);
      ctx.strokeStyle = "#1c0f09";
      ctx.lineWidth = Math.max(3.2, w * 0.028);
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(headX + cr.dir * 3, headY + 11);
      ctx.lineTo(armTargetX, armTargetY + 8);
      ctx.stroke();

      // Emerald-green / amber bottle tilted at hand
      ctx.save();
      ctx.translate(armTargetX, armTargetY + 4);
      ctx.rotate(cr.dir * (0.42 + clinkPulse * 0.25));
      ctx.fillStyle = ci % 2 === 0 ? "#2f9e66" : "#d98a2b";
      ctx.fillRect(-3.2, -9, 6.4, 11);
      ctx.fillRect(-1.6, -15, 3.2, 6);
      ctx.restore();
    }

    // Shattering bottle glass shards & bright star-spark at toast collision point!
    var impactX = x + w * 0.49;
    var impactY = y + h * 0.43;
    var burst = reducedMotion ? 0.62 : (tAnim * 0.95) % 1;
    var shardAlpha = (1 - burst) * 0.92;

    // Bright clink starflash
    if (burst < 0.35 || reducedMotion) {
      ctx.strokeStyle = "rgba(255, 246, 200, 0.88)";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(impactX - 6, impactY);
      ctx.lineTo(impactX + 6, impactY);
      ctx.moveTo(impactX, impactY - 6);
      ctx.lineTo(impactX, impactY + 6);
      ctx.stroke();
    }

    // Flying green & amber glass splinters
    for (var sh = 0; sh < 9; sh++) {
      var ang = -Math.PI * 0.9 + (sh / 8) * Math.PI * 0.85;
      var dist = (4 + burst * w * 0.16) * (0.7 + (sh % 3) * 0.22);
      var grav = burst * burst * h * 0.18;
      var sx = impactX + Math.cos(ang) * dist;
      var sy = impactY + Math.sin(ang) * dist + grav;
      ctx.fillStyle =
        sh % 2 === 0
          ? "rgba(84, 224, 146," + shardAlpha.toFixed(3) + ")"
          : "rgba(255, 202, 98," + shardAlpha.toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(sx, sy - 2.6);
      ctx.lineTo(sx + 2.8, sy + 1.8);
      ctx.lineTo(sx - 2.2, sy + 2.2);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawChamber2Windows(ctx, rect, d, sub, tAnim, reducedMotion) {
    var x = rect.x;
    var y = rect.y;
    var w = rect.w;
    var h = rect.h;

    // Dark weathered port-masonry ground-floor wall
    var wallGrad = ctx.createLinearGradient(x, y, x, y + h);
    wallGrad.addColorStop(0.0, "#1c1a1e");
    wallGrad.addColorStop(0.76, "#272226");
    wallGrad.addColorStop(1.0, "#0f1e28"); // canal water lapping at ground-floor plinth
    ctx.fillStyle = wallGrad;
    ctx.fillRect(x, y, w, h);

    // Subtle horizontal stone ashlar courses
    ctx.strokeStyle = "rgba(92, 82, 76, 0.24)";
    ctx.lineWidth = 0.8;
    for (var row = 1; row <= 5; row++) {
      var ry = y + (row / 6) * h * 0.82;
      ctx.beginPath();
      ctx.moveTo(x, ry);
      ctx.lineTo(x + w, ry);
      ctx.stroke();
    }

    // Three warm amber-lit ground-floor casement windows side-by-side!
    var winW = w * 0.21;
    var winH = h * 0.58;
    var winY = y + h * 0.16;
    var centers = [x + w * 0.20, x + w * 0.50, x + w * 0.80];

    for (var wi = 0; wi < 3; wi++) {
      var cx = centers[wi];
      var wx = cx - winW * 0.5;

      // Water reflection of each warm ground-floor window below sill
      var rGrad = ctx.createLinearGradient(cx, y + h * 0.78, cx, y + h);
      rGrad.addColorStop(0.0, "rgba(244, 186, 94, 0.46)");
      rGrad.addColorStop(1.0, "rgba(244, 186, 94, 0.04)");
      ctx.fillStyle = rGrad;
      ctx.fillRect(wx + 2, y + h * 0.80, winW - 4, h * 0.20);

      // Folded-back wooden shutters flanking each casement
      ctx.fillStyle = "#2f241f";
      ctx.fillRect(wx - winW * 0.18, winY + 3, winW * 0.16, winH - 4);
      ctx.fillRect(wx + winW * 1.02, winY + 3, winW * 0.16, winH - 4);

      // Warm amber-honey lamp-lit interior inside arched casement
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(wx, winY + winH);
      ctx.lineTo(wx, winY + winW * 0.42);
      ctx.arc(cx, winY + winW * 0.42, winW * 0.5, Math.PI, 0);
      ctx.lineTo(wx + winW, winY + winH);
      ctx.closePath();
      ctx.clip();

      var wGlow = ctx.createLinearGradient(wx, winY, wx, winY + winH);
      wGlow.addColorStop(0.0, "#e28c38");
      wGlow.addColorStop(0.45, "#f8cf7a");
      wGlow.addColorStop(1.0, "#c46624");
      ctx.fillStyle = wGlow;
      ctx.fillRect(wx, winY, winW, winH);

      // Soft billowed sheer curtain on left edge
      var breeze = reducedMotion ? 2 : Math.sin(tAnim * 1.4 + wi * 0.9) * 2.5;
      ctx.fillStyle = "rgba(255, 244, 214, 0.34)";
      ctx.beginPath();
      ctx.moveTo(wx, winY);
      ctx.quadraticCurveTo(wx + winW * 0.30 + breeze, winY + winH * 0.48, wx + winW * 0.08, winY + winH);
      ctx.lineTo(wx, winY + winH);
      ctx.closePath();
      ctx.fill();

      // Poised silhouette of a woman drawing a comb rhythmically through long cascading hair!
      var strokeCycle = reducedMotion
        ? 0.42 + wi * 0.12
        : (Math.sin(tAnim * 1.35 + wi * 1.15) + 1) * 0.5;

      var headX = cx - winW * 0.06;
      var headY = winY + winH * 0.34;
      var headR = Math.max(3.6, winW * 0.145);

      ctx.fillStyle = "#22120d";
      // Head & graceful neck/shoulders
      ctx.beginPath();
      ctx.arc(headX, headY, headR, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(headX - winW * 0.28, winY + winH);
      ctx.quadraticCurveTo(headX - winW * 0.22, headY + headR * 1.6, headX - headR * 0.4, headY + headR * 0.9);
      ctx.lineTo(headX + headR * 0.5, headY + headR * 0.9);
      ctx.quadraticCurveTo(headX + winW * 0.22, headY + headR * 1.7, headX + winW * 0.24, winY + winH);
      ctx.closePath();
      ctx.fill();

      // Long cascading river of hair flowing down to the sill
      var hairSway = strokeCycle * 2.6;
      ctx.beginPath();
      ctx.moveTo(headX + headR * 0.3, headY - headR * 0.7);
      ctx.bezierCurveTo(
        headX + winW * 0.30,
        headY + winH * 0.14,
        headX + winW * 0.26 + hairSway,
        headY + winH * 0.38,
        headX + winW * 0.14 + hairSway,
        winY + winH - 3
      );
      ctx.lineTo(headX + winW * 0.01, winY + winH - 3);
      ctx.quadraticCurveTo(headX + headR * 0.4, headY + winH * 0.28, headX, headY);
      ctx.closePath();
      ctx.fill();

      // Fine golden backlit hair strands
      ctx.strokeStyle = "rgba(255, 224, 146, 0.55)";
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(headX + headR * 0.85, headY + 2);
      ctx.quadraticCurveTo(
        headX + winW * 0.28 + hairSway,
        headY + winH * 0.28,
        headX + winW * 0.16 + hairSway,
        winY + winH - 5
      );
      ctx.stroke();

      // Raised elbow & hand drawing comb downward along the cascading hair!
      var combY = lerp(headY + 1, winY + winH * 0.80, strokeCycle);
      var combX = headX + winW * 0.21 + hairSway * 0.6;
      var elbowX = headX + winW * 0.36;
      var elbowY = lerp(headY - 4, headY + winH * 0.18, strokeCycle * 0.6);

      ctx.strokeStyle = "#22120d";
      ctx.lineWidth = 2.4;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(headX + headR * 0.6, headY + headR * 1.4);
      ctx.lineTo(elbowX, elbowY);
      ctx.lineTo(combX, combY);
      ctx.stroke();

      // Glinting ivory/tortoiseshell comb teeth
      ctx.strokeStyle = "#fff1c2";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(combX - 4.5, combY);
      ctx.lineTo(combX + 2.5, combY + 1.2);
      ctx.stroke();

      ctx.restore();

      // Casement frame & stone sill
      ctx.strokeStyle = "#4c392d";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(wx, winY + winH);
      ctx.lineTo(wx, winY + winW * 0.42);
      ctx.arc(cx, winY + winW * 0.42, winW * 0.5, Math.PI, 0);
      ctx.lineTo(wx + winW, winY + winH);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = "#6e5c4e";
      ctx.fillRect(wx - 3, winY + winH - 1, winW + 6, 3.5);
    }
  }

  function drawChambers(ctx, anchors, st, tAnim) {
    var rects = anchors.chamberRects;
    var d = st.desireDepth;
    var sub = st.subMode;

    // Mirage-etched threshold at desireDepth=0, blooming into luminous harbor chambers as desireDepth->1
    var chamberOpacity = 0.15 + 0.85 * smoothstep(0.04, 0.84, d);

    for (var i = 0; i < rects.length; i++) {
      var r = rects[i];
      var stone = CHAMBER_STONE_MAP[i];
      var isHovered = matchesStone(st.hoveredStone, stone, r.id);
      var isSelected = matchesStone(st.selectedStone, stone, r.id);

      ctx.save();

      // Subtle mirage shadow / water reflection beneath chamber frame
      ctx.fillStyle = "rgba(8, 16, 22," + (0.32 * chamberOpacity).toFixed(3) + ")";
      ctx.fillRect(r.x + 3, r.y + 4, r.w, r.h);

      // Clip interior scene to chamberRect
      ctx.beginPath();
      ctx.rect(r.x, r.y, r.w, r.h);
      ctx.clip();

      ctx.globalAlpha *= chamberOpacity;
      if (i === 0) {
        drawChamber0Cranes(ctx, r, d, sub, tAnim, st.reducedMotion);
      } else if (i === 1) {
        drawChamber1Taverns(ctx, r, d, sub, tAnim, st.reducedMotion);
      } else {
        drawChamber2Windows(ctx, r, d, sub, tAnim, st.reducedMotion);
      }

      // Ochre desert veil over chambers when desireDepth is still near 0
      if (d < 0.45) {
        ctx.fillStyle = "rgba(176, 122, 62," + ((1 - d / 0.45) * 0.36).toFixed(3) + ")";
        ctx.fillRect(r.x, r.y, r.w, r.h);
      }

      ctx.restore();

      // Architectural brass-and-stone border frame
      ctx.save();
      ctx.strokeStyle = mixRGBA([182, 134, 74], [156, 178, 188], d * 0.65, 0.42 + chamberOpacity * 0.44);
      ctx.lineWidth = 1.3;
      ctx.strokeRect(r.x, r.y, r.w, r.h);

      // Golden highlight around hoveredStone / selectedStone
      if (isHovered || isSelected) {
        var pulse = st.reducedMotion ? 1 : 0.82 + 0.18 * Math.sin(tAnim * 3.4);
        var goldAlpha = (isSelected ? 0.92 : 0.72) * pulse;
        ctx.shadowColor = "rgba(248, 206, 114, 0.65)";
        ctx.shadowBlur = isSelected ? 14 : 9;
        ctx.strokeStyle = "rgba(250, 212, 124," + goldAlpha.toFixed(3) + ")";
        ctx.lineWidth = isSelected ? 2.4 : 1.8;
        ctx.strokeRect(r.x - 1.5, r.y - 1.5, r.w + 3, r.h + 3);

        // Corner astrolabe brackets
        ctx.shadowBlur = 0;
        var cb = Math.min(r.w, r.h) * 0.11;
        ctx.beginPath();
        // Top-left
        ctx.moveTo(r.x - 4, r.y + cb);
        ctx.lineTo(r.x - 4, r.y - 4);
        ctx.lineTo(r.x + cb, r.y - 4);
        // Top-right
        ctx.moveTo(r.x + r.w - cb, r.y - 4);
        ctx.lineTo(r.x + r.w + 4, r.y - 4);
        ctx.lineTo(r.x + r.w + 4, r.y + cb);
        // Bottom-left
        ctx.moveTo(r.x - 4, r.y + r.h - cb);
        ctx.lineTo(r.x - 4, r.y + r.h + 4);
        ctx.lineTo(r.x + cb, r.y + r.h + 4);
        // Bottom-right
        ctx.moveTo(r.x + r.w - cb, r.y + r.h + 4);
        ctx.lineTo(r.x + r.w + 4, r.y + r.h + 4);
        ctx.lineTo(r.x + r.w + 4, r.y + r.h - cb);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawSpineHighlights(ctx, anchors, st, tAnim) {
    for (var i = 0; i < anchors.spinePoints.length; i++) {
      var pt = anchors.spinePoints[i];
      var stone = SPINE_STONE_MAP[i];
      if (!stone) continue;

      var isHovered = matchesStone(st.hoveredStone, stone, pt.id);
      var isSelected = matchesStone(st.selectedStone, stone, pt.id);
      if (!isHovered && !isSelected) continue;

      ctx.save();
      var pulse = st.reducedMotion ? 1 : 0.82 + 0.18 * Math.sin(tAnim * 3.4);
      var alpha = (isSelected ? 0.90 : 0.68) * pulse;
      var midY = (pt.y + pt.baseY) * 0.5;
      var rx = Math.max(18, pt.width * 0.52);
      var ry = Math.max(20, (pt.baseY - pt.y) * 0.58);

      // Soft golden aura behind selected/hovered spine cue
      var aura = ctx.createRadialGradient(pt.x, midY, 2, pt.x, midY, Math.max(rx, ry) * 1.15);
      aura.addColorStop(0.0, "rgba(252, 214, 128," + (alpha * 0.28).toFixed(3) + ")");
      aura.addColorStop(1.0, "rgba(252, 214, 128, 0)");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(pt.x, midY, Math.max(rx, ry) * 1.15, 0, Math.PI * 2);
      ctx.fill();

      // Golden astrolabe frame & peak diamond
      ctx.strokeStyle = "rgba(250, 212, 124," + alpha.toFixed(3) + ")";
      ctx.lineWidth = isSelected ? 2.0 : 1.4;
      ctx.beginPath();
      ctx.ellipse(pt.x, midY, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();

      var dm = isSelected ? 5.5 : 4.2;
      ctx.fillStyle = "rgba(255, 232, 164," + alpha.toFixed(3) + ")";
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y - 10 - dm);
      ctx.lineTo(pt.x + dm, pt.y - 10);
      ctx.lineTo(pt.x, pt.y - 10 + dm);
      ctx.lineTo(pt.x - dm, pt.y - 10);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
  }

  function render(ctx, width, height, state) {
    if (!ctx || !(width > 0) || !(height > 0)) return;
    var st = normalizeState(state);
    var tAnim = st.reducedMotion ? 0 : st.time;
    var anchors = computeAnchors(width, height, st);

    ctx.save();
    try {
      drawSkyAndAtmosphere(ctx, width, height, anchors.horizonY, st, tAnim);
      drawPlateauAndHarbor(ctx, width, height, anchors.horizonY, anchors, st, tAnim);
      drawHorizonCuesAndVessel(ctx, width, height, anchors.horizonY, anchors, st, tAnim);
      drawChambers(ctx, anchors, st, tAnim);
      drawSpineHighlights(ctx, anchors, st, tAnim);
    } finally {
      ctx.restore();
    }
  }

  function hitTest(normX, normY, width, height, state) {
    var w = Math.max(1, Number(width) || 1);
    var h = Math.max(1, Number(height) || 1);
    if (typeof normX !== "number" || typeof normY !== "number" || !isFinite(normX) || !isFinite(normY)) {
      return null;
    }

    var px, py;
    if (normX >= 0 && normX <= 1 && normY >= 0 && normY <= 1) {
      px = normX * w;
      py = normY * h;
    } else if (normX > 1.5 || normY > 1.5) {
      if (normX < 0 || normY < 0 || normX > w || normY > h) return null;
      px = normX;
      py = normY;
    } else {
      return null;
    }

    var anchors = computeAnchors(w, h, state);

    // 1. Check Three Lower Waterfront Desire Chambers
    for (var i = 0; i < anchors.chamberRects.length; i++) {
      var r = anchors.chamberRects[i];
      if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) {
        return CHAMBER_STONE_MAP[i] || null;
      }
    }

    // 2. Check Horizon Spine Stones (spines 1..5)
    var bestStone = null;
    var bestScore = Infinity;
    var topPad = h * 0.045;
    var botPad = h * 0.032;

    for (var s = 0; s < anchors.spinePoints.length; s++) {
      var stone = SPINE_STONE_MAP[s];
      if (!stone) continue;
      var pt = anchors.spinePoints[s];
      var halfW = Math.max(pt.width * 0.56, 20);
      var minY = pt.y - topPad;
      var maxY = pt.baseY + botPad;

      if (px >= pt.x - halfW && px <= pt.x + halfW && py >= minY && py <= maxY) {
        var midY = (pt.y + pt.baseY) * 0.5;
        var halfH = Math.max(20, (maxY - minY) * 0.5);
        var nx = (px - pt.x) / halfW;
        var ny = (py - midY) / halfH;
        var score = nx * nx + ny * ny * 0.65;
        if (score < bestScore) {
          bestScore = score;
          bestStone = stone;
        }
      }
    }

    return bestStone;
  }

  function makeNoiseBuffer(audioCtx, durationSec) {
    var sr = audioCtx.sampleRate || 44100;
    var len = Math.max(64, Math.floor(sr * durationSec));
    var buf = audioCtx.createBuffer(1, len, sr);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) {
      // Deterministic pseudo-noise so synthesis is reproducible & click-free
      var x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      data[i] = (x - Math.floor(x)) * 2 - 1;
    }
    return buf;
  }

  function triggerSound(audioCtx, masterGain, stoneId, state) {
    if (!audioCtx || typeof audioCtx.createGain !== "function") return;
    var dest = masterGain || audioCtx.destination;
    if (!dest) return;

    try {
      var st = normalizeState(state);
      var now = audioCtx.currentTime || 0;
      var rawId = stoneId && typeof stoneId === "object" ? stoneId.id : String(stoneId || "");

      if (rawId === "overland_windsocks" || rawId === "spine-3") {
        // Windsock / sail canvas snap: crisp membrane thwack + bandpass canvas luff
        var noiseBuf = makeNoiseBuffer(audioCtx, 0.28);
        var nSrc = audioCtx.createBufferSource();
        nSrc.buffer = noiseBuf;
        var bp = audioCtx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.setValueAtTime(920, now);
        bp.frequency.exponentialRampToValueAtTime(310, now + 0.22);
        bp.Q.setValueAtTime(2.4, now);

        var nGain = audioCtx.createGain();
        nGain.gain.setValueAtTime(0.0001, now);
        nGain.gain.linearRampToValueAtTime(0.22, now + 0.012);
        nGain.gain.exponentialRampToValueAtTime(0.05, now + 0.08);
        nGain.gain.linearRampToValueAtTime(0.13, now + 0.12);
        nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);

        nSrc.connect(bp);
        bp.connect(nGain);
        nGain.connect(dest);
        nSrc.start(now);
        nSrc.stop(now + 0.27);

        var snapOsc = audioCtx.createOscillator();
        var snapGain = audioCtx.createGain();
        snapOsc.type = "triangle";
        snapOsc.frequency.setValueAtTime(148, now);
        snapOsc.frequency.exponentialRampToValueAtTime(56, now + 0.09);
        snapGain.gain.setValueAtTime(0.18, now);
        snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.10);
        snapOsc.connect(snapGain);
        snapGain.connect(dest);
        snapOsc.start(now);
        snapOsc.stop(now + 0.11);
      } else if (
        rawId === "overland_vessel_heart" ||
        rawId === "spine-5" ||
        rawId === "overland_chimneys" ||
        rawId === "spine-4"
      ) {
        // 55Hz Iron-Keel Boiler Throb (+ swelling canvas or steam chuff modulated by subMode)
        var sub = rawId === "overland_chimneys" || rawId === "spine-4" ? Math.max(0.65, st.subMode) : st.subMode;
        var dur = 0.62;

        var keelOsc = audioCtx.createOscillator();
        var harmOsc = audioCtx.createOscillator();
        var lp = audioCtx.createBiquadFilter();
        var bodyGain = audioCtx.createGain();

        keelOsc.type = sub > 0.4 ? "sawtooth" : "triangle";
        keelOsc.frequency.setValueAtTime(55.0, now);
        harmOsc.type = "sine";
        harmOsc.frequency.setValueAtTime(110.0, now);

        lp.type = "lowpass";
        lp.frequency.setValueAtTime(lerp(165, 240, sub), now);
        lp.Q.setValueAtTime(3.2, now);

        bodyGain.gain.setValueAtTime(0.0001, now);
        bodyGain.gain.linearRampToValueAtTime(0.20, now + 0.045);
        bodyGain.gain.setValueAtTime(0.16, now + 0.22);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

        // Boiler piston LFO tremor on gain
        if (typeof audioCtx.createOscillator === "function") {
          var lfo = audioCtx.createOscillator();
          var lfoGain = audioCtx.createGain();
          lfo.type = "sine";
          lfo.frequency.setValueAtTime(11.5, now);
          lfoGain.gain.setValueAtTime(0.055 * (0.4 + sub * 0.6), now);
          lfo.connect(lfoGain);
          lfoGain.connect(bodyGain.gain);
          lfo.start(now);
          lfo.stop(now + dur);
        }

        keelOsc.connect(lp);
        harmOsc.connect(lp);
        lp.connect(bodyGain);
        bodyGain.connect(dest);
        keelOsc.start(now);
        harmOsc.start(now);
        keelOsc.stop(now + dur + 0.02);
        harmOsc.stop(now + dur + 0.02);

        // Companion canvas swell or steam chuff
        var sBuf = makeNoiseBuffer(audioCtx, 0.36);
        var sSrc = audioCtx.createBufferSource();
        sSrc.buffer = sBuf;
        var sFilt = audioCtx.createBiquadFilter();
        sFilt.type = "bandpass";
        sFilt.frequency.setValueAtTime(sub > 0.45 ? 480 : 340, now);
        sFilt.Q.setValueAtTime(1.8, now);
        var sGain = audioCtx.createGain();
        sGain.gain.setValueAtTime(0.0001, now);
        sGain.gain.linearRampToValueAtTime(0.11, now + 0.05);
        sGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
        sSrc.connect(sFilt);
        sFilt.connect(sGain);
        sGain.connect(dest);
        sSrc.start(now);
        sSrc.stop(now + 0.35);
      } else if (rawId === "overland_cranes" || rawId === "chamber-0") {
        // Crane chain pulley: 5 metallic ratchet links + wooden cargo settle
        for (var c = 0; c < 5; c++) {
          var ct = now + c * 0.058;
          var linkOsc = audioCtx.createOscillator();
          var linkGain = audioCtx.createGain();
          linkOsc.type = "square";
          linkOsc.frequency.setValueAtTime(1760 + (c % 2) * 420 + c * 65, ct);
          linkOsc.frequency.exponentialRampToValueAtTime(680, ct + 0.038);
          linkGain.gain.setValueAtTime(0.0001, ct);
          linkGain.gain.linearRampToValueAtTime(0.085, ct + 0.004);
          linkGain.gain.exponentialRampToValueAtTime(0.0001, ct + 0.044);
          linkOsc.connect(linkGain);
          linkGain.connect(dest);
          linkOsc.start(ct);
          linkOsc.stop(ct + 0.048);
        }
        // Crate settle thud
        var thud = audioCtx.createOscillator();
        var thudG = audioCtx.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(92, now + 0.28);
        thud.frequency.exponentialRampToValueAtTime(44, now + 0.42);
        thudG.gain.setValueAtTime(0.0001, now + 0.28);
        thudG.gain.linearRampToValueAtTime(0.14, now + 0.29);
        thudG.gain.exponentialRampToValueAtTime(0.0001, now + 0.44);
        thud.connect(thudG);
        thudG.connect(dest);
        thud.start(now + 0.28);
        thud.stop(now + 0.45);
      } else if (rawId === "overland_taverns" || rawId === "chamber-1") {
        // Tavern bottle glass clink + sparkling green-glass splinters
        var clinkFreqs = [2280, 3140, 4560];
        for (var k = 0; k < clinkFreqs.length; k++) {
          var gOsc = audioCtx.createOscillator();
          var gGain = audioCtx.createGain();
          gOsc.type = "sine";
          gOsc.frequency.setValueAtTime(clinkFreqs[k], now);
          gGain.gain.setValueAtTime(0.0001, now);
          gGain.gain.linearRampToValueAtTime(0.11 / (k + 1), now + 0.003);
          gGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.20 - k * 0.03);
          gOsc.connect(gGain);
          gGain.connect(dest);
          gOsc.start(now);
          gOsc.stop(now + 0.22);
        }
        var shards = [3860, 4920, 5680, 4320];
        for (var sh = 0; sh < shards.length; sh++) {
          var stTime = now + 0.10 + sh * 0.036;
          var shOsc = audioCtx.createOscillator();
          var shGain = audioCtx.createGain();
          shOsc.type = "sine";
          shOsc.frequency.setValueAtTime(shards[sh], stTime);
          shGain.gain.setValueAtTime(0.0001, stTime);
          shGain.gain.linearRampToValueAtTime(0.045, stTime + 0.002);
          shGain.gain.exponentialRampToValueAtTime(0.0001, stTime + 0.075);
          shOsc.connect(shGain);
          shGain.connect(dest);
          shOsc.start(stTime);
          shOsc.stop(stTime + 0.08);
        }
      } else if (rawId === "overland_windows" || rawId === "chamber-2") {
        // Warm harp-like hair-comb glissando
        var notes = [293.66, 369.99, 440.0, 554.37, 659.25, 739.99];
        var warmFilter = audioCtx.createBiquadFilter();
        warmFilter.type = "lowpass";
        warmFilter.frequency.setValueAtTime(1650, now);
        warmFilter.connect(dest);

        for (var n = 0; n < notes.length; n++) {
          var nt = now + n * 0.055;
          var hOsc = audioCtx.createOscillator();
          var hGain = audioCtx.createGain();
          hOsc.type = "triangle";
          hOsc.frequency.setValueAtTime(notes[n], nt);
          hGain.gain.setValueAtTime(0.0001, nt);
          hGain.gain.linearRampToValueAtTime(0.095, nt + 0.012);
          hGain.gain.exponentialRampToValueAtTime(0.0001, nt + 0.42);
          hOsc.connect(hGain);
          hGain.connect(warmFilter);
          hOsc.start(nt);
          hOsc.stop(nt + 0.44);
        }
      } else if (rawId === "overland_radar" || rawId === "spine-1") {
        // Lattice radar steel ping + sweep harmonic
        var rOsc = audioCtx.createOscillator();
        var rGain = audioCtx.createGain();
        rOsc.type = "sine";
        rOsc.frequency.setValueAtTime(1318.5, now);
        rOsc.frequency.exponentialRampToValueAtTime(1290.0, now + 0.32);
        rGain.gain.setValueAtTime(0.0001, now);
        rGain.gain.linearRampToValueAtTime(0.11, now + 0.006);
        rGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
        rOsc.connect(rGain);
        rGain.connect(dest);
        rOsc.start(now);
        rOsc.stop(now + 0.35);
      } else {
        // Skyscraper pinnacles / taut rigging aeolian fifth
        var freqs = [440.0, 659.25];
        for (var f = 0; f < freqs.length; f++) {
          var pOsc = audioCtx.createOscillator();
          var pGain = audioCtx.createGain();
          pOsc.type = f === 0 ? "triangle" : "sine";
          pOsc.frequency.setValueAtTime(freqs[f], now);
          pGain.gain.setValueAtTime(0.0001, now);
          pGain.gain.linearRampToValueAtTime(0.085, now + 0.018);
          pGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
          pOsc.connect(pGain);
          pGain.connect(dest);
          pOsc.start(now);
          pOsc.stop(now + 0.40);
        }
      }
    } catch (_err) {
      // Safe no-op on restricted or mock audio contexts
    }
  }

  var api = {
    id: "overland_vessel",
    desertName: "Ochre Tableland",
    beholderName: "The Camel Driver",
    subModeLabels: ["Windjammer Swelling Sails", "Iron-Keel Steamboat"],
    stones: STONES,
    computeAnchors: computeAnchors,
    render: render,
    hitTest: hitTest,
    triggerSound: triggerSound
  };

  return api;
})();
