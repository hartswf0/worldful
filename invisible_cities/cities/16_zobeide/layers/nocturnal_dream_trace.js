(function initZobeideDreamTrace(root) {
  'use strict';

  const PALETTE = Object.freeze({
    abyssNight: '#090d18',
    indigoShadow: '#12192c',
    chalkMoonlight: '#eef2f7',
    lunarSilver: '#cbd7e6',
    leadMortar: '#5a6270',
    calcifiedSlag: '#363b45',
    fugitiveGold: '#e8c266',
    mortarOchre: '#9e8c6c'
  });

  const SKEIN_CORNERS = Object.freeze([
    Object.freeze({
      id: 'turn_west_postern',
      index: 0,
      label: 'Moonlit West Postern Turn',
      normX: 0.24,
      normY: 0.44,
      escapeAngle: -2.4,
      dreamFragment: 'She turned past the chalk postern into silver sea-wind.'
    }),
    Object.freeze({
      id: 'turn_lime_stair',
      index: 1,
      label: 'Winding Lime-Wash Stairway',
      normX: 0.37,
      normY: 0.26,
      escapeAngle: -1.3,
      dreamFragment: 'Long hair flashed above the steep whitewashed risers.'
    }),
    Object.freeze({
      id: 'turn_well_arcade',
      index: 2,
      label: 'Double-Shadowed Well Arcade',
      normX: 0.64,
      normY: 0.25,
      escapeAngle: -0.5,
      dreamFragment: 'Her bare heel vanished between twin moonlit arches.'
    }),
    Object.freeze({
      id: 'turn_cistern_bend',
      index: 3,
      label: 'White Cistern Hairpin',
      normX: 0.77,
      normY: 0.45,
      escapeAngle: 0.35,
      dreamFragment: 'Rippled moonlight caught her shoulder before the bend.'
    }),
    Object.freeze({
      id: 'turn_cypress_terrace',
      index: 4,
      label: 'Sloped Moon-Terrace Arch',
      normX: 0.71,
      normY: 0.71,
      escapeAngle: 1.15,
      dreamFragment: 'A streaming golden-amber ribbon slipped beneath the parapet.'
    }),
    Object.freeze({
      id: 'turn_skein_narrows',
      index: 5,
      label: 'Inner Skein Bottleneck',
      normX: 0.43,
      normY: 0.74,
      escapeAngle: 2.2,
      dreamFragment: 'Twisting streets coiled tight; at the turn, only night air remained.'
    }),
    Object.freeze({
      id: 'turn_gable_culdesac',
      index: 6,
      label: 'Chalk Gable Switchback',
      normX: 0.36,
      normY: 0.53,
      escapeAngle: 2.9,
      dreamFragment: 'Shadow swallowed the streaming hair-trace around the inner gable.'
    }),
    Object.freeze({
      id: 'turn_zenith_passage',
      index: 7,
      label: 'Lunar Zenith Passage',
      normX: 0.56,
      normY: 0.47,
      escapeAngle: -0.9,
      dreamFragment: 'At the heart of the coiled white skein she slipped away unseen.'
    })
  ]);

  // Coiled three-ring street skein around (0.50, 0.52): primary spiral 0..7 + cross-yarn coils
  const SKEIN_SEGMENTS = [
    { from: 0, to: 1, ring: 0, widthMul: 1.08, c1: [0.22, 0.31], c2: [0.29, 0.24], feature: 'stairs' },
    { from: 1, to: 2, ring: 0, widthMul: 1.05, c1: [0.46, 0.19], c2: [0.56, 0.19], feature: 'arcade' },
    { from: 2, to: 3, ring: 0, widthMul: 1.04, c1: [0.73, 0.27], c2: [0.79, 0.35], feature: 'cistern' },
    { from: 3, to: 4, ring: 0, widthMul: 1.04, c1: [0.80, 0.56], c2: [0.78, 0.65], feature: 'stairs' },
    { from: 4, to: 5, ring: 0, widthMul: 1.02, c1: [0.62, 0.80], c2: [0.51, 0.81], feature: 'skein' },
    { from: 5, to: 6, ring: 1, widthMul: 0.94, c1: [0.35, 0.70], c2: [0.31, 0.61], feature: 'gable' },
    { from: 6, to: 7, ring: 2, widthMul: 0.88, c1: [0.41, 0.44], c2: [0.49, 0.42], feature: 'zenith' },
    { from: 7, to: 2, ring: 1, widthMul: 0.84, c1: [0.62, 0.41], c2: [0.60, 0.32], feature: 'arcade' },
    { from: 5, to: 0, ring: 0, widthMul: 0.96, c1: [0.30, 0.72], c2: [0.19, 0.58], feature: 'postern' },
    { from: 6, to: 1, ring: 1, widthMul: 0.82, c1: [0.33, 0.41], c2: [0.34, 0.33], feature: 'stairs' },
    { from: 3, to: 7, ring: 1, widthMul: 0.80, c1: [0.70, 0.49], c2: [0.63, 0.51], feature: 'skein' },
    { from: 7, to: 4, ring: 1, widthMul: 0.80, c1: [0.59, 0.57], c2: [0.66, 0.64], feature: 'terrace' },
    { from: 7, to: 5, ring: 2, widthMul: 0.78, c1: [0.52, 0.58], c2: [0.47, 0.66], feature: 'skein' }
  ];

  // Terraced white limestone roof clusters nestled between coiled lanes around (0.50, 0.52)
  const ROOF_TERRACES = [
    { cx: 0.30, cy: 0.36, rx: 0.046, ry: 0.032, rot: -0.42, cornerIdx: 0, well: false },
    { cx: 0.49, cy: 0.25, rx: 0.056, ry: 0.028, rot: 0.08, cornerIdx: 1, well: true },
    { cx: 0.69, cy: 0.34, rx: 0.048, ry: 0.033, rot: 0.52, cornerIdx: 2, well: true },
    { cx: 0.73, cy: 0.58, rx: 0.045, ry: 0.036, rot: 1.18, cornerIdx: 3, well: false },
    { cx: 0.58, cy: 0.73, rx: 0.058, ry: 0.030, rot: -0.22, cornerIdx: 4, well: true },
    { cx: 0.33, cy: 0.64, rx: 0.047, ry: 0.032, rot: 0.64, cornerIdx: 5, well: false },
    { cx: 0.44, cy: 0.36, rx: 0.042, ry: 0.027, rot: -0.28, cornerIdx: 6, well: false },
    { cx: 0.64, cy: 0.54, rx: 0.041, ry: 0.028, rot: 0.35, cornerIdx: 7, well: true },
    { cx: 0.47, cy: 0.57, rx: 0.038, ry: 0.026, rot: -0.50, cornerIdx: 6, well: true },
    { cx: 0.52, cy: 0.46, rx: 0.032, ry: 0.022, rot: 0.18, cornerIdx: 7, well: false },
    { cx: 0.19, cy: 0.51, rx: 0.036, ry: 0.028, rot: -0.75, cornerIdx: 0, well: false },
    { cx: 0.82, cy: 0.49, rx: 0.034, ry: 0.028, rot: 0.82, cornerIdx: 3, well: false }
  ];

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function evalCubic(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y, t) {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;
    return {
      x: uuu * p0x + 3 * uu * t * p1x + 3 * u * tt * p2x + ttt * p3x,
      y: uuu * p0y + 3 * uu * t * p1y + 3 * u * tt * p2y + ttt * p3y
    };
  }

  function evalCubicTangent(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y, t) {
    const u = 1 - t;
    const dx = 3 * u * u * (p1x - p0x) + 6 * u * t * (p2x - p1x) + 3 * t * t * (p3x - p2x);
    const dy = 3 * u * u * (p1y - p0y) + 6 * u * t * (p2y - p1y) + 3 * t * t * (p3y - p2y);
    return Math.atan2(dy, dx);
  }

  function hexToRgb(hex) {
    const clean = String(hex || '#000000').replace('#', '');
    const n = parseInt(clean, 16) || 0;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function mixRgba(hexA, hexB, t, alpha) {
    const a = hexToRgb(hexA);
    const b = hexToRgb(hexB);
    const k = clamp(t, 0, 1);
    const r = Math.round(lerp(a.r, b.r, k));
    const g = Math.round(lerp(a.g, b.g, k));
    const bl = Math.round(lerp(a.b, b.b, k));
    return 'rgba(' + r + ',' + g + ',' + bl + ',' + clamp(alpha, 0, 1).toFixed(3) + ')';
  }

  function createStars() {
    const pts = [];
    for (let i = 0; i < 42; i++) {
      const s1 = Math.sin(i * 12.9898 + 1.7) * 43758.5453;
      const s2 = Math.sin(i * 78.233 + 4.3) * 19341.7219;
      const nx = s1 - Math.floor(s1);
      const ny = (s2 - Math.floor(s2)) * 0.42;
      pts.push({
        nx: 0.03 + nx * 0.94,
        ny: 0.03 + ny * 0.88,
        r: 0.7 + (i % 3) * 0.45,
        phase: i * 0.83
      });
    }
    return pts;
  }

  function createDreamTrace(opts) {
    const cfg = opts || {};
    let viewW = Math.max(1, Number(cfg.width) || 960);
    let viewH = Math.max(1, Number(cfg.height) || 640);
    let viewDpr = Math.max(1, Number(cfg.dpr) || 1);

    const cornerState = SKEIN_CORNERS.map(function mapCorner(c) {
      return {
        id: c.id,
        index: c.index,
        label: c.label,
        normX: c.normX,
        normY: c.normY,
        x: +(c.normX * viewW).toFixed(2),
        y: +(c.normY * viewH).toFixed(2),
        escapeAngle: c.escapeAngle,
        dreamFragment: c.dreamFragment,
        isBlocked: false,
        modificationType: null,
        approachPts: [],
        bendPts: []
      };
    });

    const stars = createStars();
    let skeinThreads = [];
    let terracePolys = [];
    let blockedCount = 0;
    let openEscapeRoutes = 8;
    let moonExposure = 1.0;
    let fugitiveVisibility = 1.0;
    let vanishCount = 1;
    let deadEndHits = 0;
    let activeCornerId = SKEIN_CORNERS[0].id;

    const shadowShutters = new Float64Array(8);
    const afterimages = [];
    const wallImpacts = [];
    let echoPulse = 0;
    let moonPhaseTime = 0;
    const ambientRunner = { segIdx: 0, t: 0.34, hairPhase: 0 };

    function resolveCorner(cornerIdOrIndex) {
      if (typeof cornerIdOrIndex === 'number' && Number.isFinite(cornerIdOrIndex)) {
        const idx = Math.trunc(cornerIdOrIndex);
        if (idx >= 0 && idx < cornerState.length) return cornerState[idx];
      }
      if (typeof cornerIdOrIndex === 'string') {
        const trimmed = cornerIdOrIndex.trim();
        if (/^[0-7]$/.test(trimmed)) return cornerState[Number(trimmed)];
        for (let i = 0; i < cornerState.length; i++) {
          if (cornerState[i].id === trimmed) return cornerState[i];
        }
      }
      return null;
    }

    function publicCornerDescriptor(c) {
      return {
        id: c.id,
        index: c.index,
        label: c.label,
        normX: c.normX,
        normY: c.normY,
        x: c.x,
        y: c.y,
        escapeAngle: c.escapeAngle,
        dreamFragment: c.dreamFragment,
        isBlocked: Boolean(c.isBlocked),
        modificationType: c.modificationType || null
      };
    }

    function recomputeMetrics() {
      let count = 0;
      for (let i = 0; i < cornerState.length; i++) {
        if (cornerState[i].isBlocked) count++;
      }
      blockedCount = count;
      openEscapeRoutes = 8 - blockedCount;
      moonExposure = blockedCount === 0
        ? 1.0
        : +(Math.max(0.06, 1.0 - blockedCount * 0.1175)).toFixed(4);
      fugitiveVisibility = blockedCount === 0
        ? 1.0
        : (blockedCount >= 8 ? 0.0 : +(Math.pow((8 - blockedCount) / 8, 1.2)).toFixed(4));
      if (blockedCount >= 8) {
        afterimages.length = 0;
        echoPulse = 0;
      } else {
        for (let i = afterimages.length - 1; i >= 0; i--) {
          if (cornerState[afterimages[i].cornerIndex].isBlocked) {
            afterimages.splice(i, 1);
          }
        }
      }
    }

    function resize(width, height, dpr) {
      viewW = Math.max(1, Number(width) || viewW || 960);
      viewH = Math.max(1, Number(height) || viewH || 640);
      if (dpr !== undefined && Number(dpr) > 0) viewDpr = Number(dpr);
      const minDim = Math.min(viewW, viewH);

      for (let i = 0; i < cornerState.length; i++) {
        const c = cornerState[i];
        c.x = +(c.normX * viewW).toFixed(2);
        c.y = +(c.normY * viewH).toFixed(2);
      }

      skeinThreads = SKEIN_SEGMENTS.map(function buildSeg(seg, idx) {
        const a = cornerState[seg.from];
        const b = cornerState[seg.to];
        const p1x = seg.c1[0] * viewW;
        const p1y = seg.c1[1] * viewH;
        const p2x = seg.c2[0] * viewW;
        const p2y = seg.c2[1] * viewH;
        const pts = [];
        const steps = 26;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const pt = evalCubic(a.x, a.y, p1x, p1y, p2x, p2y, b.x, b.y, t);
          const ang = evalCubicTangent(a.x, a.y, p1x, p1y, p2x, p2y, b.x, b.y, t);
          pts.push({ x: pt.x, y: pt.y, angle: ang, t: t });
        }
        return {
          index: idx,
          from: seg.from,
          to: seg.to,
          ring: seg.ring,
          feature: seg.feature,
          laneWidth: Math.max(8, minDim * 0.025 * seg.widthMul),
          p0x: a.x, p0y: a.y, p1x: p1x, p1y: p1y, p2x: p2x, p2y: p2y, p3x: b.x, p3y: b.y,
          pts: pts
        };
      });

      // Build smooth approach + vanishing corner bend trajectory for each of the 8 turns
      for (let i = 0; i < cornerState.length; i++) {
        const c = cornerState[i];
        const incomingIdx = i === 0 ? 8 : i - 1;
        const inSeg = skeinThreads[incomingIdx] || skeinThreads[0];
        const reach = Math.max(26, minDim * 0.072);
        const esc = c.escapeAngle;
        const bendCtrlX = c.x + Math.cos(esc - 0.55) * reach * 0.58;
        const bendCtrlY = c.y + Math.sin(esc - 0.55) * reach * 0.58;
        const bendEndX = c.x + Math.cos(esc) * reach;
        const bendEndY = c.y + Math.sin(esc) * reach;
        const curve = [];
        for (let s = 0; s <= 12; s++) {
          const st = 0.48 + (s / 12) * 0.52;
          const p = evalCubic(inSeg.p0x, inSeg.p0y, inSeg.p1x, inSeg.p1y, inSeg.p2x, inSeg.p2y, inSeg.p3x, inSeg.p3y, st);
          const ang = evalCubicTangent(inSeg.p0x, inSeg.p0y, inSeg.p1x, inSeg.p1y, inSeg.p2x, inSeg.p2y, inSeg.p3x, inSeg.p3y, st);
          curve.push({ x: p.x, y: p.y, angle: ang, vanishFade: 1.0 });
        }
        for (let s = 1; s <= 10; s++) {
          const bt = s / 10;
          const p = evalCubic(c.x, c.y, bendCtrlX, bendCtrlY, lerp(bendCtrlX, bendEndX, 0.6), lerp(bendCtrlY, bendEndY, 0.6), bendEndX, bendEndY, bt);
          const ang = evalCubicTangent(c.x, c.y, bendCtrlX, bendCtrlY, lerp(bendCtrlX, bendEndX, 0.6), lerp(bendCtrlY, bendEndY, 0.6), bendEndX, bendEndY, bt);
          curve.push({ x: p.x, y: p.y, angle: ang, vanishFade: Math.max(0, 1 - bt * 1.15) });
        }
        c.bendPts = curve;
      }

      terracePolys = ROOF_TERRACES.map(function buildRoof(r) {
        return {
          cx: r.cx * viewW,
          cy: r.cy * viewH,
          rx: r.rx * viewW,
          ry: r.ry * viewH,
          rot: r.rot,
          cornerIdx: r.cornerIdx,
          well: r.well
        };
      });

      return cornerState.map(publicCornerDescriptor);
    }

    resize(viewW, viewH, viewDpr);

    function getCorners(width, height) {
      if (typeof width === 'number' && width > 0 && typeof height === 'number' && height > 0) {
        if (Math.abs(width - viewW) > 0.5 || Math.abs(height - viewH) > 0.5) {
          resize(width, height, viewDpr);
        }
      }
      return cornerState.map(publicCornerDescriptor);
    }

    function syncTrapWalls(blockedMapOrArray) {
      for (let i = 0; i < cornerState.length; i++) {
        cornerState[i].isBlocked = false;
        cornerState[i].modificationType = null;
      }
      const src = (blockedMapOrArray && Array.isArray(blockedMapOrArray.blockedRecords))
        ? blockedMapOrArray.blockedRecords
        : blockedMapOrArray;

      if (Array.isArray(src)) {
        for (let i = 0; i < src.length; i++) {
          const item = src[i];
          if (item === null || item === undefined) continue;
          if (typeof item === 'string' || typeof item === 'number') {
            const c = resolveCorner(item);
            if (c) { c.isBlocked = true; c.modificationType = 'dead_end_wall'; }
          } else if (typeof item === 'object' && item.isBlocked !== false) {
            const key = item.cornerId !== undefined ? item.cornerId : (item.id !== undefined ? item.id : item.index);
            const c = resolveCorner(key);
            if (c) {
              c.isBlocked = true;
              c.modificationType = item.modificationType || item.modType || 'dead_end_wall';
            }
          }
        }
      } else if (src && typeof src === 'object') {
        const keys = Object.keys(src);
        for (let i = 0; i < keys.length; i++) {
          const val = src[keys[i]];
          if (!val || (typeof val === 'object' && val.isBlocked === false)) continue;
          const c = resolveCorner(keys[i]);
          if (c) {
            c.isBlocked = true;
            c.modificationType = typeof val === 'string' ? val : (val.modificationType || val.modType || 'dead_end_wall');
          }
        }
      }
      recomputeMetrics();
      return getState();
    }

    function pursueCorner(cornerIdOrIndex) {
      const c = resolveCorner(cornerIdOrIndex) || cornerState[0];
      activeCornerId = c.id;
      if (!c.isBlocked) {
        vanishCount += 1;
        afterimages.push({ cornerIndex: c.index, progress: 0.32, life: 1.0, phase: vanishCount * 1.31 });
        if (afterimages.length > 4) afterimages.shift();
        return {
          cornerId: c.id,
          index: c.index,
          label: c.label,
          dreamFragment: c.dreamFragment,
          vanished: true,
          blockedByWall: false,
          womanCaptured: false
        };
      }
      deadEndHits += 1;
      wallImpacts.push({ cornerIndex: c.index, life: 1.0 });
      if (wallImpacts.length > 4) wallImpacts.shift();
      return {
        cornerId: c.id,
        index: c.index,
        label: c.label,
        modificationType: c.modificationType,
        vanished: false,
        blockedByWall: true,
        womanCaptured: false
      };
    }

    function triggerDreamEcho(dreamMemory) {
      const mem = typeof dreamMemory === 'number' ? clamp(dreamMemory, 0, 1) : fugitiveVisibility;
      if (mem <= 0.01 || blockedCount >= 8) {
        echoPulse = 0;
        return { triggered: false, echoStrength: 0, womanCaptured: false };
      }
      echoPulse = Math.max(echoPulse, mem);
      let target = resolveCorner(activeCornerId);
      if (!target || target.isBlocked) {
        target = null;
        for (let i = 0; i < cornerState.length; i++) {
          if (!cornerState[i].isBlocked) { target = cornerState[i]; break; }
        }
      }
      if (target) {
        activeCornerId = target.id;
        afterimages.push({ cornerIndex: target.index, progress: 0.36, life: 0.9 * mem, phase: moonPhaseTime + 0.9 });
        if (afterimages.length > 4) afterimages.shift();
      }
      return { triggered: true, echoStrength: +mem.toFixed(4), activeCornerId: activeCornerId, womanCaptured: false };
    }

    function hitTestCorner(normX, normY) {
      let nx = Number(normX);
      let ny = Number(normY);
      if (!Number.isFinite(nx) || !Number.isFinite(ny)) return null;
      if (nx > 1.5 || ny > 1.5) { nx /= viewW; ny /= viewH; }
      let best = null;
      let bestDist = 0.075;
      for (let i = 0; i < cornerState.length; i++) {
        const d = Math.hypot(nx - cornerState[i].normX, ny - cornerState[i].normY);
        if (d <= bestDist) { bestDist = d; best = cornerState[i]; }
      }
      return best ? publicCornerDescriptor(best) : null;
    }

    function step(dtSec, env) {
      const dt = clamp(Number(dtSec) || 0.016, 0, 0.1);
      const reduced = Boolean(env && env.reducedMotion);
      const enc = (env && typeof env.enclosureRatio === 'number') ? env.enclosureRatio : (blockedCount / 8);
      const mem = (env && typeof env.dreamMemory === 'number') ? env.dreamMemory : fugitiveVisibility;
      for (let i = 0; i < 8; i++) {
        const tgt = cornerState[i].isBlocked ? 1 : 0;
        shadowShutters[i] = reduced ? tgt : lerp(shadowShutters[i], tgt, clamp(dt * 7.5, 0, 1));
      }
      for (let i = wallImpacts.length - 1; i >= 0; i--) {
        wallImpacts[i].life -= dt * (reduced ? 3.0 : 1.7);
        if (wallImpacts[i].life <= 0) wallImpacts.splice(i, 1);
      }
      if (enc >= 1.0 || mem <= 0.01 || blockedCount >= 8) {
        afterimages.length = 0;
        echoPulse = 0;
        return;
      }
      if (reduced) return;
      moonPhaseTime += dt;
      echoPulse = Math.max(0, echoPulse - dt * 0.75);
      for (let i = afterimages.length - 1; i >= 0; i--) {
        afterimages[i].progress = Math.min(1, afterimages[i].progress + dt * 0.95);
        afterimages[i].life -= dt * 0.65;
        if (afterimages[i].life <= 0) afterimages.splice(i, 1);
      }
      ambientRunner.hairPhase += dt * 5.4;
      ambientRunner.t += dt * (0.28 + 0.14 * mem);
      if (ambientRunner.t >= 1) {
        ambientRunner.t = 0;
        for (let stepTry = 1; stepTry <= 8; stepTry++) {
          const cand = (ambientRunner.segIdx + stepTry) % 8;
          const destIdx = SKEIN_SEGMENTS[cand].to;
          if (!cornerState[destIdx].isBlocked) { ambientRunner.segIdx = cand; break; }
        }
      }
    }

    function drawFugitiveFromBehind(ctx, px, py, heading, alpha, scale, hairPhase) {
      if (alpha <= 0.01) return;
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(heading);
      // Footstep ripple behind receding bare heel
      ctx.strokeStyle = mixRgba(PALETTE.lunarSilver, PALETTE.chalkMoonlight, 0.5, alpha * 0.48);
      ctx.lineWidth = Math.max(1, 1.1 * scale);
      ctx.beginPath();
      ctx.ellipse(-7.5 * scale, 0, 4.2 * scale, 2.1 * scale, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Receding bare back, shoulders & lifted heel (seen strictly FROM BEHIND fleeing toward +X)
      ctx.fillStyle = mixRgba(PALETTE.chalkMoonlight, PALETTE.lunarSilver, 0.25, alpha * 0.92);
      ctx.beginPath();
      ctx.ellipse(-2.8 * scale, 1.4 * scale, 3.1 * scale, 1.2 * scale, -0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(4.2 * scale, 0);
      ctx.bezierCurveTo(3.4 * scale, -3.4 * scale, -1.2 * scale, -3.1 * scale, -4.5 * scale, -1.4 * scale);
      ctx.lineTo(-4.5 * scale, 1.4 * scale);
      ctx.bezierCurveTo(-1.2 * scale, 3.1 * scale, 3.4 * scale, 3.4 * scale, 4.2 * scale, 0);
      ctx.closePath();
      ctx.fill();
      // Subtle spinal moonlight shadow proving rear-view orientation
      ctx.strokeStyle = mixRgba(PALETTE.indigoShadow, PALETTE.leadMortar, 0.3, alpha * 0.55);
      ctx.lineWidth = Math.max(0.8, 0.9 * scale);
      ctx.beginPath();
      ctx.moveTo(2.2 * scale, 0);
      ctx.lineTo(-3.6 * scale, 0);
      ctx.stroke();

      // Long streaming golden hair (#e8c266) trailing backward from crown in 5 sinuous strands
      for (let s = -2; s <= 2; s++) {
        const waveA = Math.sin(hairPhase + s * 0.85) * 2.8 * scale;
        const waveB = Math.cos(hairPhase * 1.15 + s * 1.1) * 4.6 * scale;
        const len = (16 + (2 - Math.abs(s)) * 3.5) * scale;
        ctx.strokeStyle = s === 0
          ? mixRgba(PALETTE.fugitiveGold, PALETTE.chalkMoonlight, 0.28, alpha * 0.96)
          : mixRgba(PALETTE.fugitiveGold, PALETTE.mortarOchre, Math.abs(s) * 0.14, alpha * 0.84);
        ctx.lineWidth = (s === 0 ? 1.9 : 1.35) * scale;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(3.6 * scale, s * 0.85 * scale);
        ctx.bezierCurveTo(
          -len * 0.32, (s * 1.6 * scale) + waveA,
          -len * 0.68, (s * 2.2 * scale) - waveB,
          -len, (s * 2.6 * scale) + waveA * 0.9
        );
        ctx.stroke();
      }
      ctx.restore();
    }

    function renderSkeinAndPursuit(ctx, width, height, env) {
      if (!ctx) return;
      const w = Math.max(1, Number(width) || viewW);
      const h = Math.max(1, Number(height) || viewH);
      if (Math.abs(w - viewW) > 0.5 || Math.abs(h - viewH) > 0.5) resize(w, h, viewDpr);
      const enc = (env && typeof env.enclosureRatio === 'number') ? clamp(env.enclosureRatio, 0, 1) : (blockedCount / 8);
      const mem = (env && typeof env.dreamMemory === 'number') ? clamp(env.dreamMemory, 0, 1) : fugitiveVisibility;
      const reduced = Boolean(env && env.reducedMotion);
      const minDim = Math.min(w, h);
      const figScale = clamp(minDim / 540, 0.72, 1.45);

      ctx.save();
      // 1. Deep desert night sky (#090d18)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, PALETTE.abyssNight);
      skyGrad.addColorStop(0.62, mixRgba(PALETTE.indigoShadow, PALETTE.abyssNight, 0.52, 1));
      skyGrad.addColorStop(1, PALETTE.abyssNight);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        const tw = reduced ? 0.65 : (0.5 + 0.5 * Math.sin(moonPhaseTime * 1.4 + st.phase));
        const stAlpha = (0.12 + 0.55 * moonExposure) * tw;
        ctx.fillStyle = mixRgba(PALETTE.chalkMoonlight, PALETTE.lunarSilver, 0.4, stAlpha);
        ctx.beginPath();
        ctx.arc(st.nx * w, st.ny * h, st.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. High moon & angled chalk-silver moonbeams
      const moonX = w * 0.145;
      const moonY = h * 0.135;
      const moonR = Math.max(15, minDim * 0.036);
      const haloR = moonR * (2.6 + 3.6 * moonExposure);
      const halo = ctx.createRadialGradient(moonX, moonY, moonR * 0.4, moonX, moonY, haloR);
      halo.addColorStop(0, mixRgba(PALETTE.chalkMoonlight, PALETTE.lunarSilver, 0.2, 0.42 * moonExposure + 0.06));
      halo.addColorStop(0.45, mixRgba(PALETTE.lunarSilver, PALETTE.indigoShadow, 0.45, 0.18 * moonExposure));
      halo.addColorStop(1, 'rgba(9,13,24,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(moonX, moonY, haloR, 0, Math.PI * 2);
      ctx.fill();

      for (let i = 0; i < cornerState.length; i++) {
        const c = cornerState[i];
        const shut = Math.max(shadowShutters[i], c.isBlocked ? 0.94 : 0);
        const beamOpen = (1 - shut) * moonExposure;
        if (beamOpen > 0.03) {
          const spread = minDim * 0.045;
          const beamGrad = ctx.createLinearGradient(moonX, moonY, c.x, c.y);
          beamGrad.addColorStop(0, mixRgba(PALETTE.chalkMoonlight, PALETTE.lunarSilver, 0.3, 0.09 * beamOpen));
          beamGrad.addColorStop(1, mixRgba(PALETTE.lunarSilver, PALETTE.indigoShadow, 0.6, 0.02 * beamOpen));
          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.moveTo(moonX, moonY);
          ctx.lineTo(c.x - spread, c.y + spread * 0.5);
          ctx.lineTo(c.x + spread, c.y - spread * 0.5);
          ctx.closePath();
          ctx.fill();
        }
      }

      ctx.fillStyle = mixRgba(PALETTE.chalkMoonlight, PALETTE.leadMortar, (1 - moonExposure) * 0.62, 0.96);
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fill();
      if (blockedCount > 0) {
        ctx.fillStyle = mixRgba(PALETTE.indigoShadow, PALETTE.abyssNight, 0.45, (1 - moonExposure) * 0.86);
        ctx.beginPath();
        ctx.arc(moonX + moonR * (1 - blockedCount / 9.2), moonY + moonR * 0.12, moonR * 1.02, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Terraced white limestone roofs nestled between coiled streets
      for (let i = 0; i < terracePolys.length; i++) {
        const rf = terracePolys[i];
        const localBlocked = cornerState[rf.cornerIdx].isBlocked ? 1 : shadowShutters[rf.cornerIdx];
        const chalkLit = clamp(moonExposure * (1 - localBlocked * 0.65), 0.06, 1);
        ctx.save();
        ctx.translate(rf.cx, rf.cy);
        ctx.rotate(rf.rot);
        ctx.fillStyle = PALETTE.indigoShadow;
        ctx.fillRect(-rf.rx + 4, -rf.ry + 5, rf.rx * 2, rf.ry * 2);
        ctx.fillStyle = mixRgba(PALETTE.calcifiedSlag, PALETTE.chalkMoonlight, chalkLit * 0.86, 0.92);
        ctx.strokeStyle = mixRgba(PALETTE.leadMortar, PALETTE.lunarSilver, chalkLit, 0.72);
        ctx.lineWidth = 1.1;
        ctx.fillRect(-rf.rx, -rf.ry, rf.rx * 2, rf.ry * 2);
        ctx.strokeRect(-rf.rx, -rf.ry, rf.rx * 2, rf.ry * 2);
        if (rf.well) {
          ctx.fillStyle = PALETTE.indigoShadow;
          ctx.fillRect(-rf.rx * 0.34, -rf.ry * 0.36, rf.rx * 0.68, rf.ry * 0.72);
        }
        ctx.restore();
      }

      // 4. Coiled three-ring white yarn street skein
      for (let i = 0; i < skeinThreads.length; i++) {
        const th = skeinThreads[i];
        const aShut = Math.max(shadowShutters[th.from], cornerState[th.from].isBlocked ? 0.94 : 0);
        const bShut = Math.max(shadowShutters[th.to], cornerState[th.to].isBlocked ? 0.94 : 0);
        const segLit = clamp(moonExposure * (1 - (aShut + bShut) * 0.42), 0.06, 1);

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(th.p0x, th.p0y);
        ctx.bezierCurveTo(th.p1x, th.p1y, th.p2x, th.p2y, th.p3x, th.p3y);
        ctx.strokeStyle = PALETTE.indigoShadow;
        ctx.lineWidth = th.laneWidth + 6.5;
        ctx.stroke();

        ctx.strokeStyle = mixRgba(PALETTE.calcifiedSlag, PALETTE.chalkMoonlight, segLit, 0.94);
        ctx.lineWidth = th.laneWidth;
        ctx.stroke();

        ctx.strokeStyle = mixRgba(PALETTE.indigoShadow, PALETTE.lunarSilver, segLit, 0.55);
        ctx.lineWidth = 1.25;
        ctx.stroke();

        if (th.feature === 'stairs' || th.feature === 'arcade') {
          ctx.strokeStyle = mixRgba(PALETTE.indigoShadow, PALETTE.chalkMoonlight, segLit * 0.75, 0.52);
          ctx.lineWidth = 1.3;
          for (let s = 4; s <= 22; s += 3) {
            const p = th.pts[s];
            const nx = -Math.sin(p.angle) * th.laneWidth * 0.44;
            const ny = Math.cos(p.angle) * th.laneWidth * 0.44;
            ctx.beginPath();
            ctx.moveTo(p.x - nx, p.y - ny);
            ctx.lineTo(p.x + nx, p.y + ny);
            ctx.stroke();
          }
        }
      }

      // 5. Indigo occlusion shadows (#12192c) slicing off moonlight at blocked turns
      for (let i = 0; i < cornerState.length; i++) {
        const c = cornerState[i];
        const shut = Math.max(shadowShutters[i], c.isBlocked ? 0.95 : 0);
        if (shut > 0.02) {
          const shR = minDim * (0.07 + 0.045 * shut);
          const shGrad = ctx.createRadialGradient(c.x, c.y, 2, c.x, c.y, shR);
          shGrad.addColorStop(0, mixRgba(PALETTE.indigoShadow, PALETTE.abyssNight, 0.45, 0.86 * shut));
          shGrad.addColorStop(0.68, mixRgba(PALETTE.indigoShadow, PALETTE.abyssNight, 0.25, 0.52 * shut));
          shGrad.addColorStop(1, 'rgba(18,25,44,0)');
          ctx.fillStyle = shGrad;
          ctx.beginPath();
          ctx.arc(c.x, c.y, shR, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 6. Fleeting nocturnal woman from behind & golden-hair traces (strict 0 at 100% enclosure or 0 memory)
      const canShowFugitive = enc < 1.0 && mem > 0.01 && fugitiveVisibility > 0 && blockedCount < 8;
      if (canShowFugitive) {
        const vis = clamp(fugitiveVisibility * mem + echoPulse * 0.25, 0, 1);
        const seg = skeinThreads[ambientRunner.segIdx];
        if (!reduced && seg && !cornerState[seg.to].isBlocked) {
          const idx = Math.min(seg.pts.length - 1, Math.floor(ambientRunner.t * (seg.pts.length - 1)));
          const rp = seg.pts[idx];
          const turnVanish = Math.sin(ambientRunner.t * Math.PI);
          drawFugitiveFromBehind(ctx, rp.x, rp.y, rp.angle, vis * turnVanish * 0.78, figScale * 0.92, ambientRunner.hairPhase);
        }

        for (let i = 0; i < afterimages.length; i++) {
          const ai = afterimages[i];
          const c = cornerState[ai.cornerIndex];
          if (c.isBlocked || !c.bendPts.length) continue;
          const headIdx = clamp(Math.floor(ai.progress * (c.bendPts.length - 1)), 2, c.bendPts.length - 1);
          const tailIdx = Math.max(0, headIdx - 8);
          ctx.strokeStyle = mixRgba(PALETTE.fugitiveGold, PALETTE.chalkMoonlight, 0.2, ai.life * vis * 0.85);
          ctx.lineWidth = 2.4 * figScale;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(c.bendPts[tailIdx].x, c.bendPts[tailIdx].y);
          for (let k = tailIdx + 1; k <= headIdx; k++) ctx.lineTo(c.bendPts[k].x, c.bendPts[k].y);
          ctx.stroke();
          const hp = c.bendPts[headIdx];
          drawFugitiveFromBehind(ctx, hp.x, hp.y, hp.angle, ai.life * vis * hp.vanishFade, figScale * 1.05, ai.phase + moonPhaseTime * 6);
        }
      }

      // 7. Vanishing corner rings & dead-end collision pulses
      for (let i = 0; i < cornerState.length; i++) {
        const c = cornerState[i];
        const isActive = c.id === activeCornerId;
        const r = (isActive ? 11.5 : 9.2) * figScale;
        ctx.beginPath();
        ctx.arc(c.x, c.y, r, 0, Math.PI * 2);
        ctx.fillStyle = c.isBlocked
          ? mixRgba(PALETTE.indigoShadow, PALETTE.calcifiedSlag, 0.5, 0.9)
          : mixRgba(PALETTE.indigoShadow, PALETTE.lunarSilver, 0.18, 0.74);
        ctx.fill();
        ctx.lineWidth = isActive ? 2.0 : 1.3;
        ctx.strokeStyle = c.isBlocked
          ? PALETTE.leadMortar
          : (isActive && canShowFugitive ? PALETTE.fugitiveGold : PALETTE.lunarSilver);
        ctx.stroke();

        ctx.fillStyle = c.isBlocked ? PALETTE.leadMortar : PALETTE.chalkMoonlight;
        ctx.font = '600 ' + Math.round(9.5 * figScale) + 'px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(i + 1), c.x, c.y + 0.5);
      }

      for (let i = 0; i < wallImpacts.length; i++) {
        const imp = wallImpacts[i];
        const c = cornerState[imp.cornerIndex];
        ctx.strokeStyle = mixRgba(PALETTE.leadMortar, PALETTE.chalkMoonlight, 0.25, imp.life * 0.8);
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(c.x, c.y, (12 + (1 - imp.life) * 18) * figScale, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function getState() {
      return {
        corners: cornerState.map(publicCornerDescriptor),
        blockedCount: blockedCount,
        totalCorners: 8,
        openEscapeRoutes: openEscapeRoutes,
        moonExposure: moonExposure,
        fugitiveVisibility: fugitiveVisibility,
        vanishCount: vanishCount,
        deadEndHits: deadEndHits,
        womanEverCaptured: false,
        sightingsSinceFounding: 0,
        activeCornerId: activeCornerId
      };
    }

    function reset() {
      for (let i = 0; i < cornerState.length; i++) {
        cornerState[i].isBlocked = false;
        cornerState[i].modificationType = null;
        shadowShutters[i] = 0;
      }
      blockedCount = 0;
      openEscapeRoutes = 8;
      moonExposure = 1.0;
      fugitiveVisibility = 1.0;
      vanishCount = 1;
      deadEndHits = 0;
      activeCornerId = SKEIN_CORNERS[0].id;
      afterimages.length = 0;
      wallImpacts.length = 0;
      echoPulse = 0;
      ambientRunner.segIdx = 0;
      ambientRunner.t = 0.34;
      return getState();
    }

    return {
      resize: resize,
      getCorners: getCorners,
      syncTrapWalls: syncTrapWalls,
      pursueCorner: pursueCorner,
      triggerDreamEcho: triggerDreamEcho,
      hitTestCorner: hitTestCorner,
      step: step,
      renderSkeinAndPursuit: renderSkeinAndPursuit,
      getState: getState,
      reset: reset
    };
  }

  const api = Object.freeze({
    SKEIN_CORNERS: SKEIN_CORNERS,
    PALETTE: PALETTE,
    createDreamTrace: createDreamTrace
  });

  root.ZobeideDreamTrace = api;
  if (typeof window !== 'undefined') {
    window.ZobeideDreamTrace = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
