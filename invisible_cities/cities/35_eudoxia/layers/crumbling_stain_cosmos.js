/*
 * City 35: Eudoxia (Chapter VI - Cities and the Sky 1)
 * Layer: Crumbling Stain & Reversible Starry Cosmos
 * Self-contained classic IIFE attaching globalThis.EudoxiaCrumblingStainCosmos
 */
(function () {
  "use strict";

  const LOCUS_IDS = [
    "mule_narrows",
    "soot_arch",
    "fish_steps",
    "blind_culdesac",
    "oracle_sanctuary",
    "landslide_ravine",
    "upper_hovels",
    "fire_cistern",
    "scream_threshold"
  ];

  const STAIN_PALETTE = {
    lampblackDust: "#0d0b10",
    sootStone: "#19151e",
    crumblingOcher: "#8c6d4e",
    crimsonThread: "#b92938",
    lapisIndigo: "#1b3474",
    magentaKnot: "#b9338a",
    goldSelvedge: "#d8a84c",
    parchmentWarp: "#eadcc3",
    emberScream: "#e85d35"
  };

  const THREAD_HEX = {
    crimson: "#b92938",
    indigo: "#1b3474",
    magenta: "#b9338a"
  };

  const STAIN_LOCI = [
    {
      index: 0, id: "mule_narrows", carpetTitle: "Crimson Warp Gate",
      streetTitle: "Alley of Packed Mules", u: 0.24, v: 0.80, xNorm: 0.20, yNorm: 0.84,
      threadColor: "crimson", hex: "#b92938", oudHz: 220.0,
      constellationName: "Equus Sarcinarius", stoneFeature: "packed_mules",
      orbitalEccentricity: 0.42,
      sensoryCaption: "Twin-panniered pack mules wedge between crooked basalt walls amid shoving, rope-creak, and dust."
    },
    {
      index: 1, id: "soot_arch", carpetTitle: "Northern Lapis Octagram",
      streetTitle: "Lintels of Black Smoke", u: 0.50, v: 0.22, xNorm: 0.31, yNorm: 0.29,
      threadColor: "indigo", hex: "#1b3474", oudHz: 247.5,
      constellationName: "Fumus Niger", stoneFeature: "smoke_and_fish",
      orbitalEccentricity: 0.36,
      sensoryCaption: "Low stone vaulting smeared with greasy lampblack soot rising from tallow vats and alley hearths."
    },
    {
      index: 2, id: "fish_steps", carpetTitle: "Magenta Spiral Volute",
      streetTitle: "Brine & Fish-Smell Stairs", u: 0.24, v: 0.34, xNorm: 0.16, yNorm: 0.52,
      threadColor: "magenta", hex: "#b9338a", oudHz: 275.0,
      constellationName: "Pisces Salis", stoneFeature: "smoke_and_fish",
      orbitalEccentricity: 0.48,
      sensoryCaption: "Slick uneven risers glistening with salt-brine runoff beneath racks of gutted silver anchovies."
    },
    {
      index: 3, id: "blind_culdesac", carpetTitle: "Locked Lozenge Enclosure",
      streetTitle: "Dead-End Hovel Court", u: 0.76, v: 0.34, xNorm: 0.79, yNorm: 0.24,
      threadColor: "magenta", hex: "#b9338a", oudHz: 293.33,
      constellationName: "Clausura Caeca", stoneFeature: "winding_alleys",
      orbitalEccentricity: 0.54,
      sensoryCaption: "A blind masonry spur where leaning upper stories choke off the sky and turn back the lost traveler."
    },
    {
      index: 4, id: "oracle_sanctuary", carpetTitle: "Central Twelve-Ray Medallion",
      streetTitle: "Sanctuary of the Preserved Loom", u: 0.50, v: 0.50, xNorm: 0.51, yNorm: 0.53,
      threadColor: "crimson", hex: "#b92938", oudHz: 330.0,
      constellationName: "Axis Augurii", stoneFeature: "preserved_carpet",
      orbitalEccentricity: 0.18,
      sensoryCaption: "Quiet stone cell amid the crooked press where the symmetrical crimson, indigo, and magenta carpet hangs."
    },
    {
      index: 5, id: "landslide_ravine", carpetTitle: "Diagonal Crimson-Gold Fret",
      streetTitle: "Scarp of Crumbling Walls & Landslides", u: 0.76, v: 0.62, xNorm: 0.66, yNorm: 0.64,
      threadColor: "crimson", hex: "#b92938", oudHz: 366.67,
      constellationName: "Ruina Lapidum", stoneFeature: "crumbling_landslides",
      orbitalEccentricity: 0.51,
      sensoryCaption: "Fractured retaining walls spilling rubble and ocher dust as upper houses slump onto lower roofs."
    },
    {
      index: 6, id: "upper_hovels", carpetTitle: "Twin Indigo Cartouche",
      streetTitle: "Stacked Slope Hovels", u: 0.24, v: 0.58, xNorm: 0.44, yNorm: 0.17,
      threadColor: "indigo", hex: "#1b3474", oudHz: 412.5,
      constellationName: "Tuguria Superna", stoneFeature: "winding_alleys",
      orbitalEccentricity: 0.46,
      sensoryCaption: "Timber-propped mud and stone hovels piled roof-upon-roof up the steep northern escarpment."
    },
    {
      index: 7, id: "fire_cistern", carpetTitle: "Southern Octagram Rosette",
      streetTitle: "Brazier Alley of Night Fires", u: 0.50, v: 0.78, xNorm: 0.58, yNorm: 0.82,
      threadColor: "crimson", hex: "#b92938", oudHz: 440.0,
      constellationName: "Fornax Noctis", stoneFeature: "fires_and_screams",
      orbitalEccentricity: 0.39,
      sensoryCaption: "Cracked dry cistern ringed by iron night-braziers spitting orange embers against charred lintels."
    },
    {
      index: 8, id: "scream_threshold", carpetTitle: "Magenta Fringe Selvedge",
      streetTitle: "Darkness of Night Screams", u: 0.76, v: 0.80, xNorm: 0.85, yNorm: 0.76,
      threadColor: "magenta", hex: "#b9338a", oudHz: 495.0,
      constellationName: "Clamor Tenebrarum", stoneFeature: "fires_and_screams",
      orbitalEccentricity: 0.58,
      sensoryCaption: "Unlit outer alley mouth where sudden cries echo off jagged corners and vanish into black night."
    }
  ];

  const LOCUS_BY_ID = Object.create(null);
  for (let i = 0; i < STAIN_LOCI.length; i++) {
    LOCUS_BY_ID[STAIN_LOCI[i].id] = STAIN_LOCI[i];
  }

  const ORACLE_VERDICTS = {
    carpet_cosmos: {
      mode: "carpet_cosmos",
      divineObject: "symmetrical_carpet",
      approximateObject: "shapeless_stain",
      oracleSatisfied: true,
      headline: "Augurs' Reading: The Symmetrical Carpet Holds the Starry Orbits",
      verdictText: "The carpet's crimson, indigo, and magenta geometry reflects the divine sky; crooked Eudoxia is merely an incomplete human blotch."
    },
    stain_cosmos: {
      mode: "stain_cosmos",
      divineObject: "shapeless_stain",
      approximateObject: "symmetrical_carpet",
      oracleSatisfied: true,
      headline: "Opposite Conclusion: The Shapeless Stain Is the True Map of the Universe",
      verdictText: "Eudoxia itself—spreading shapelessly with crooked streets, crumbling houses, dust clouds, fires, and screams in the darkness—is the true starry sky and world orbits!"
    }
  };

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }
  function dist(ax, ay, bx, by) {
    return Math.hypot(bx - ax, by - ay);
  }
  function mulberry32(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6d2b79f5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hexToRgba(hex, alpha) {
    const clean = hex.charAt(0) === "#" ? hex.slice(1) : hex;
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + clamp(alpha, 0, 1).toFixed(3) + ")";
  }

  // Asymmetric ink-and-soot spreading contour ("a stain that spreads shapelessly")
  const STAIN_CONTOUR = [
    [0.42, 0.07], [0.51, 0.10], [0.60, 0.08], [0.68, 0.14], [0.78, 0.11],
    [0.88, 0.18], [0.85, 0.28], [0.92, 0.36], [0.84, 0.45], [0.89, 0.56],
    [0.86, 0.65], [0.94, 0.74], [0.91, 0.84], [0.81, 0.88], [0.73, 0.85],
    [0.65, 0.92], [0.54, 0.90], [0.45, 0.94], [0.35, 0.89], [0.24, 0.93],
    [0.12, 0.90], [0.09, 0.80], [0.14, 0.71], [0.07, 0.62], [0.08, 0.49],
    [0.14, 0.41], [0.09, 0.31], [0.18, 0.23], [0.27, 0.20], [0.33, 0.12]
  ];

  const INK_SPLATTERS = [
    { x: 0.37, y: 0.06, rx: 0.028, ry: 0.016, rot: -0.4 },
    { x: 0.84, y: 0.12, rx: 0.024, ry: 0.015, rot: 0.5 },
    { x: 0.94, y: 0.50, rx: 0.022, ry: 0.032, rot: 0.2 },
    { x: 0.92, y: 0.88, rx: 0.026, ry: 0.018, rot: -0.6 },
    { x: 0.07, y: 0.74, rx: 0.021, ry: 0.029, rot: 0.3 },
    { x: 0.08, y: 0.25, rx: 0.025, ry: 0.016, rot: -0.5 },
    { x: 0.50, y: 0.95, rx: 0.030, ry: 0.013, rot: 0.1 }
  ];

  // Blind dead-end alley spurs jutting from crooked streets
  const DEAD_END_SPURS = [
    { anchorId: "mule_narrows", pts: [[0.20, 0.84], [0.13, 0.87], [0.16, 0.91]] },
    { anchorId: "soot_arch", pts: [[0.31, 0.29], [0.23, 0.26], [0.25, 0.21]] },
    { anchorId: "fish_steps", pts: [[0.16, 0.52], [0.10, 0.56], [0.12, 0.62]] },
    { anchorId: "blind_culdesac", pts: [[0.79, 0.24], [0.86, 0.21], [0.83, 0.16]] },
    { anchorId: "oracle_sanctuary", pts: [[0.51, 0.53], [0.44, 0.49], [0.47, 0.43]] },
    { anchorId: "landslide_ravine", pts: [[0.66, 0.64], [0.74, 0.62], [0.72, 0.56]] },
    { anchorId: "upper_hovels", pts: [[0.44, 0.17], [0.51, 0.12], [0.56, 0.16]] },
    { anchorId: "fire_cistern", pts: [[0.58, 0.82], [0.52, 0.88], [0.47, 0.85]] },
    { anchorId: "scream_threshold", pts: [[0.85, 0.76], [0.90, 0.81], [0.86, 0.85]] }
  ];

  // Crooked winding alleyways connecting all 9 quarters via zigzags & steep steps
  const ALLEY_EDGES = [
    { a: "mule_narrows", b: "fish_steps", steps: 3, mules: 2, pts: [[0.20, 0.84], [0.13, 0.77], [0.25, 0.71], [0.12, 0.63], [0.23, 0.57], [0.16, 0.52]] },
    { a: "mule_narrows", b: "fire_cistern", steps: 1, mules: 2, pts: [[0.20, 0.84], [0.28, 0.90], [0.35, 0.76], [0.44, 0.89], [0.51, 0.76], [0.58, 0.82]] },
    { a: "mule_narrows", b: "oracle_sanctuary", steps: 2, mules: 2, pts: [[0.20, 0.84], [0.28, 0.79], [0.23, 0.67], [0.37, 0.70], [0.33, 0.56], [0.45, 0.61], [0.51, 0.53]] },
    { a: "fish_steps", b: "soot_arch", steps: 4, mules: 1, pts: [[0.16, 0.52], [0.11, 0.44], [0.24, 0.43], [0.18, 0.34], [0.28, 0.36], [0.31, 0.29]] },
    { a: "fish_steps", b: "oracle_sanctuary", steps: 2, mules: 1, pts: [[0.16, 0.52], [0.23, 0.46], [0.29, 0.59], [0.38, 0.45], [0.43, 0.58], [0.51, 0.53]] },
    { a: "soot_arch", b: "upper_hovels", steps: 4, mules: 0, pts: [[0.31, 0.29], [0.26, 0.22], [0.37, 0.25], [0.35, 0.14], [0.42, 0.21], [0.44, 0.17]] },
    { a: "soot_arch", b: "oracle_sanctuary", steps: 2, mules: 1, pts: [[0.31, 0.29], [0.39, 0.31], [0.33, 0.41], [0.47, 0.39], [0.43, 0.49], [0.51, 0.53]] },
    { a: "upper_hovels", b: "blind_culdesac", steps: 3, mules: 0, pts: [[0.44, 0.17], [0.52, 0.12], [0.58, 0.25], [0.66, 0.14], [0.72, 0.27], [0.79, 0.24]] },
    { a: "upper_hovels", b: "oracle_sanctuary", steps: 3, mules: 1, pts: [[0.44, 0.17], [0.50, 0.24], [0.41, 0.31], [0.55, 0.37], [0.45, 0.45], [0.51, 0.53]] },
    { a: "blind_culdesac", b: "oracle_sanctuary", steps: 2, mules: 1, pts: [[0.79, 0.24], [0.74, 0.34], [0.62, 0.28], [0.67, 0.43], [0.56, 0.41], [0.51, 0.53]] },
    { a: "blind_culdesac", b: "landslide_ravine", steps: 3, mules: 0, pts: [[0.79, 0.24], [0.85, 0.34], [0.72, 0.41], [0.82, 0.51], [0.69, 0.55], [0.66, 0.64]] },
    { a: "oracle_sanctuary", b: "landslide_ravine", steps: 3, mules: 1, pts: [[0.51, 0.53], [0.58, 0.49], [0.53, 0.61], [0.64, 0.55], [0.59, 0.66], [0.66, 0.64]] },
    { a: "oracle_sanctuary", b: "fire_cistern", steps: 2, mules: 2, pts: [[0.51, 0.53], [0.46, 0.62], [0.60, 0.66], [0.48, 0.74], [0.62, 0.77], [0.58, 0.82]] },
    { a: "landslide_ravine", b: "fire_cistern", steps: 2, mules: 1, pts: [[0.66, 0.64], [0.73, 0.69], [0.59, 0.72], [0.69, 0.79], [0.58, 0.82]] },
    { a: "landslide_ravine", b: "scream_threshold", steps: 2, mules: 0, pts: [[0.66, 0.64], [0.74, 0.59], [0.70, 0.73], [0.82, 0.65], [0.77, 0.78], [0.85, 0.76]] },
    { a: "fire_cistern", b: "scream_threshold", steps: 1, mules: 1, pts: [[0.58, 0.82], [0.65, 0.88], [0.71, 0.75], [0.77, 0.87], [0.82, 0.78], [0.85, 0.76]] }
  ];

  function polylineLength(pts) {
    let sum = 0;
    for (let i = 1; i < pts.length; i++) {
      sum += dist(pts[i - 1].xNorm, pts[i - 1].yNorm, pts[i].xNorm, pts[i].yNorm);
    }
    return sum;
  }

  function computeCrookedRoute(fromId, toId) {
    const start = LOCUS_BY_ID[fromId] || STAIN_LOCI[0];
    const goal = LOCUS_BY_ID[toId] || STAIN_LOCI[4];
    const adj = Object.create(null);
    for (let i = 0; i < LOCUS_IDS.length; i++) adj[LOCUS_IDS[i]] = [];
    for (let i = 0; i < ALLEY_EDGES.length; i++) {
      const e = ALLEY_EDGES[i];
      let len = 0;
      for (let k = 1; k < e.pts.length; k++) {
        len += dist(e.pts[k - 1][0], e.pts[k - 1][1], e.pts[k][0], e.pts[k][1]);
      }
      adj[e.a].push({ to: e.b, edge: e, forward: true, weight: len });
      adj[e.b].push({ to: e.a, edge: e, forward: false, weight: len });
    }

    const best = Object.create(null);
    const prev = Object.create(null);
    const used = Object.create(null);
    for (let i = 0; i < LOCUS_IDS.length; i++) best[LOCUS_IDS[i]] = Infinity;
    best[start.id] = 0;

    for (let iter = 0; iter < LOCUS_IDS.length; iter++) {
      let cur = null;
      for (let i = 0; i < LOCUS_IDS.length; i++) {
        const id = LOCUS_IDS[i];
        if (!used[id] && (cur === null || best[id] < best[cur])) cur = id;
      }
      if (!cur || cur === goal.id) break;
      used[cur] = true;
      const list = adj[cur];
      for (let j = 0; j < list.length; j++) {
        const hop = list[j];
        const cand = best[cur] + hop.weight;
        if (cand < best[hop.to]) {
          best[hop.to] = cand;
          prev[hop.to] = { node: cur, hop: hop };
        }
      }
    }

    const crookedPoints = [];
    let stepClimbs = 0;
    let deadEndDetours = 1;
    let muleBottlenecks = 0;
    const nodeChain = [goal.id];
    if (start.id !== goal.id) {
      let walk = goal.id;
      const hops = [];
      while (walk !== start.id && prev[walk]) {
        hops.push(prev[walk].hop);
        walk = prev[walk].node;
        nodeChain.push(walk);
      }
      hops.reverse();
      nodeChain.reverse();
      for (let h = 0; h < hops.length; h++) {
        const hop = hops[h];
        stepClimbs += hop.edge.steps;
        muleBottlenecks += hop.edge.mules;
        const pts = hop.forward ? hop.edge.pts : hop.edge.pts.slice().reverse();
        for (let p = (h === 0 ? 0 : 1); p < pts.length; p++) {
          crookedPoints.push({ xNorm: pts[p][0], yNorm: pts[p][1] });
        }
      }
    } else {
      crookedPoints.push({ xNorm: start.xNorm, yNorm: start.yNorm });
      stepClimbs = 2;
      muleBottlenecks = 1;
    }

    // Splice wrong-turn dead-end spur detour ("easy to lose your way... distracted by the bustle")
    const spurAnchor = nodeChain[Math.floor(nodeChain.length / 2)] || start.id;
    for (let s = 0; s < DEAD_END_SPURS.length; s++) {
      const spur = DEAD_END_SPURS[s];
      if (spur.anchorId === spurAnchor) {
        const anchorLoc = LOCUS_BY_ID[spurAnchor];
        let insertIdx = 0;
        let bestD = Infinity;
        for (let k = 0; k < crookedPoints.length; k++) {
          const d = dist(crookedPoints[k].xNorm, crookedPoints[k].yNorm, anchorLoc.xNorm, anchorLoc.yNorm);
          if (d < bestD) { bestD = d; insertIdx = k; }
        }
        crookedPoints.splice(insertIdx + 1, 0,
          { xNorm: spur.pts[1][0], yNorm: spur.pts[1][1] },
          { xNorm: spur.pts[2][0], yNorm: spur.pts[2][1] },
          { xNorm: spur.pts[1][0], yNorm: spur.pts[1][1] },
          { xNorm: anchorLoc.xNorm, yNorm: anchorLoc.yNorm }
        );
        break;
      }
    }

    const straightDistance = Math.max(0.08, dist(start.xNorm, start.yNorm, goal.xNorm, goal.yNorm));
    let crookedLength = polylineLength(crookedPoints);
    while (crookedLength / straightDistance < 1.68) {
      const endSpur = DEAD_END_SPURS[goal.index];
      const n = crookedPoints.length - 1;
      crookedPoints.splice(n, 0,
        { xNorm: endSpur.pts[1][0], yNorm: endSpur.pts[1][1] },
        { xNorm: endSpur.pts[2][0], yNorm: endSpur.pts[2][1] },
        { xNorm: endSpur.pts[1][0], yNorm: endSpur.pts[1][1] }
      );
      deadEndDetours += 1;
      crookedLength = polylineLength(crookedPoints);
    }

    const tortuosityRatio = Number((crookedLength / straightDistance).toFixed(3));
    return {
      fromId: start.id,
      toId: goal.id,
      threadColor: start.threadColor,
      hex: THREAD_HEX[start.threadColor] || STAIN_PALETTE.crimsonThread,
      crookedPoints: crookedPoints,
      stepClimbs: Math.max(1, stepClimbs),
      deadEndDetours: Math.max(1, deadEndDetours),
      muleBottlenecks: Math.max(1, muleBottlenecks),
      crookedLength: Number(crookedLength.toFixed(4)),
      straightDistance: Number(straightDistance.toFixed(4)),
      tortuosityRatio: tortuosityRatio
    };
  }

  function buildHovels() {
    const rng = mulberry32(35017);
    const list = [];
    for (let i = 0; i < 40; i++) {
      const anchor = STAIN_LOCI[i % STAIN_LOCI.length];
      const ang = rng() * Math.PI * 2;
      const rad = 0.028 + rng() * 0.095;
      const xNorm = clamp(anchor.xNorm + Math.cos(ang) * rad, 0.13, 0.88);
      const yNorm = clamp(anchor.yNorm + Math.sin(ang) * rad, 0.12, 0.88);
      list.push({
        id: "hovel_" + i,
        nearLocusId: anchor.id,
        xNorm: xNorm,
        yNorm: yNorm,
        wNorm: 0.022 + rng() * 0.020,
        hNorm: 0.018 + rng() * 0.022,
        tiers: (anchor.id === "upper_hovels" || anchor.id === "landslide_ravine") ? (2 + (i % 2)) : (1 + (i % 2)),
        tiltRad: (rng() - 0.5) * 0.34,
        slumpOffset: 0,
        litWindow: rng() > 0.52,
        shade: 0.75 + rng() * 0.45
      });
    }
    return list;
  }

  function sampleEdgePoint(edge, t01) {
    const pts = edge.pts;
    const segCount = pts.length - 1;
    const scaled = clamp(t01, 0, 0.9999) * segCount;
    const idx = Math.floor(scaled);
    const frac = scaled - idx;
    const ax = pts[idx][0], ay = pts[idx][1];
    const bx = pts[idx + 1][0], by = pts[idx + 1][1];
    return {
      xNorm: lerp(ax, bx, frac),
      yNorm: lerp(ay, by, frac),
      heading: Math.atan2(by - ay, bx - ax)
    };
  }

  function buildMules() {
    const edgePool = [0, 0, 1, 2, 2, 4, 12, 13];
    const pannierColors = ["#b92938", "#d8a84c", "#8c6d4e", "#b9338a", "#eadcc3", "#1b3474"];
    const mules = [];
    for (let i = 0; i < 8; i++) {
      const eIdx = edgePool[i];
      const t = 0.14 + ((i * 0.23) % 0.72);
      const pt = sampleEdgePoint(ALLEY_EDGES[eIdx], t);
      mules.push({
        id: "mule_" + i,
        edgeIdx: eIdx,
        t: t,
        dir: (i % 2 === 0) ? 1 : -1,
        speed: 0.055 + (i % 3) * 0.018,
        jostlePhase: i * 1.15,
        bottlenecked: (i < 2),
        pannierA: pannierColors[i % pannierColors.length],
        pannierB: pannierColors[(i + 2) % pannierColors.length],
        xNorm: pt.xNorm,
        yNorm: pt.yNorm,
        heading: pt.heading
      });
    }
    return mules;
  }

  function buildSmokeStains() {
    const seeds = [
      { x: 0.31, y: 0.29, r: 0.068, drift: 0.0 },
      { x: 0.27, y: 0.25, r: 0.052, drift: 1.4 },
      { x: 0.36, y: 0.33, r: 0.048, drift: 2.7 },
      { x: 0.58, y: 0.80, r: 0.058, drift: 0.9 },
      { x: 0.44, y: 0.19, r: 0.045, drift: 3.6 },
      { x: 0.21, y: 0.81, r: 0.046, drift: 4.5 },
      { x: 0.78, y: 0.26, r: 0.044, drift: 5.2 }
    ];
    return seeds.map(function (s, idx) {
      return { id: "smoke_" + idx, xNorm: s.x, yNorm: s.y, radiusNorm: s.r, phase: s.drift };
    });
  }

  function buildFishBrineDrifts() {
    return [
      { id: "fish_0", xNorm: 0.16, yNorm: 0.52, spanNorm: 0.052, angle: -0.28, fishCount: 5, phase: 0.2 },
      { id: "fish_1", xNorm: 0.19, yNorm: 0.46, spanNorm: 0.046, angle: 0.22, fishCount: 4, phase: 1.7 },
      { id: "fish_2", xNorm: 0.15, yNorm: 0.59, spanNorm: 0.048, angle: -0.18, fishCount: 5, phase: 3.1 },
      { id: "fish_3", xNorm: 0.22, yNorm: 0.65, spanNorm: 0.042, angle: 0.31, fishCount: 4, phase: 4.4 }
    ];
  }

  function buildStarField() {
    const rng = mulberry32(99351);
    const tones = ["#eadcc3", "#d8a84c", "#b9338a", "#7ea4ff", "#ff8e72"];
    const stars = [];
    for (let i = 0; i < 115; i++) {
      stars.push({
        xNorm: 0.11 + rng() * 0.78,
        yNorm: 0.10 + rng() * 0.80,
        size: 0.7 + rng() * 1.9,
        color: tones[i % tones.length],
        phase: rng() * Math.PI * 2
      });
    }
    return stars;
  }

  function buildWorldOrbits() {
    const fx = 0.48, fy = 0.50;
    return STAIN_LOCI.map(function (loc, idx) {
      const dx = loc.xNorm - fx;
      const dy = loc.yNorm - fy;
      const rL = Math.max(0.058, Math.hypot(dx, dy));
      const thetaL = Math.atan2(dy, dx);
      const ecc = loc.orbitalEccentricity;
      const omega = thetaL + Math.PI + ((idx % 2 === 0) ? -0.32 : 0.32);
      const semiLatus = rL * (1 + ecc * Math.cos(thetaL - omega));
      return {
        locusId: loc.id,
        constellationName: loc.constellationName,
        hex: loc.hex,
        fx: fx,
        fy: fy,
        eccentricity: ecc,
        omega: omega,
        semiLatus: semiLatus,
        planetAngle: thetaL + idx * 0.45,
        angularRate: 0.22 + (8 - idx) * 0.028
      };
    });
  }

  function playAlleyFoley(audioCtx, kind, muted) {
    if (!audioCtx || muted) return false;
    try {
      if (audioCtx.state === "suspended" && typeof audioCtx.resume === "function") {
        audioCtx.resume().catch(function () {});
      }
      const now = audioCtx.currentTime;
      const mode = String(kind || "landslide").toLowerCase();

      if (mode.indexOf("landslide") >= 0) {
        const len = Math.floor(audioCtx.sampleRate * 0.55);
        const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / len);
        const src = audioCtx.createBufferSource();
        src.buffer = buf;
        const lp = audioCtx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.setValueAtTime(195, now);
        lp.frequency.exponentialRampToValueAtTime(65, now + 0.52);
        const g = audioCtx.createGain();
        g.gain.setValueAtTime(0.22, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.54);
        src.connect(lp); lp.connect(g); g.connect(audioCtx.destination);
        src.start(now);
        for (let c = 0; c < 4; c++) {
          const osc = audioCtx.createOscillator();
          const cg = audioCtx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(340 + c * 145, now + c * 0.08);
          osc.frequency.exponentialRampToValueAtTime(110, now + c * 0.08 + 0.055);
          cg.gain.setValueAtTime(0.08, now + c * 0.08);
          cg.gain.exponentialRampToValueAtTime(0.001, now + c * 0.08 + 0.06);
          osc.connect(cg); cg.connect(audioCtx.destination);
          osc.start(now + c * 0.08);
          osc.stop(now + c * 0.08 + 0.065);
        }
        return true;
      }

      if (mode.indexOf("scream") >= 0 || mode.indexOf("fire") >= 0) {
        const freqs = [587.33, 622.25];
        for (let k = 0; k < 2; k++) {
          const osc = audioCtx.createOscillator();
          const bp = audioCtx.createBiquadFilter();
          const g = audioCtx.createGain();
          osc.type = k === 0 ? "sawtooth" : "triangle";
          osc.frequency.setValueAtTime(freqs[k], now);
          osc.frequency.exponentialRampToValueAtTime(freqs[k] * 0.66, now + 0.44);
          bp.type = "bandpass";
          bp.frequency.setValueAtTime(920, now);
          bp.Q.setValueAtTime(4.5, now);
          g.gain.setValueAtTime(0.001, now);
          g.gain.linearRampToValueAtTime(0.085, now + 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.46);
          osc.connect(bp); bp.connect(g); g.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.48);
        }
        return true;
      }

      // Default: "mules" wooden pack-frame creak & cobblestone hoof clops
      for (let h = 0; h < 4; h++) {
        const t0 = now + h * 0.085;
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = h === 1 ? "sawtooth" : "sine";
        osc.frequency.setValueAtTime(h === 1 ? 285 : (540 + (h % 2) * 150), t0);
        osc.frequency.exponentialRampToValueAtTime(160, t0 + 0.055);
        g.gain.setValueAtTime(0.09, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.06);
        osc.connect(g); g.connect(audioCtx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.065);
      }
      return true;
    } catch (_err) {
      return false;
    }
  }

  function traceStainContour(ctx, w, h) {
    const n = STAIN_CONTOUR.length;
    ctx.beginPath();
    const firstMidX = (STAIN_CONTOUR[n - 1][0] + STAIN_CONTOUR[0][0]) * 0.5 * w;
    const firstMidY = (STAIN_CONTOUR[n - 1][1] + STAIN_CONTOUR[0][1]) * 0.5 * h;
    ctx.moveTo(firstMidX, firstMidY);
    for (let i = 0; i < n; i++) {
      const cur = STAIN_CONTOUR[i];
      const nxt = STAIN_CONTOUR[(i + 1) % n];
      const midX = (cur[0] + nxt[0]) * 0.5 * w;
      const midY = (cur[1] + nxt[1]) * 0.5 * h;
      ctx.quadraticCurveTo(cur[0] * w, cur[1] * h, midX, midY);
    }
    ctx.closePath();
  }

  function renderStainScene(ctx, w, h, st) {
    ctx.save();
    const sky = st.oracleAngle;
    const minDim = Math.min(w, h);

    // Sanctuary slate ground outside the spreading blotch
    ctx.fillStyle = STAIN_PALETTE.lampblackDust;
    ctx.fillRect(0, 0, w, h);

    // Outer ink splatters / cosmic nebula droplets
    for (let i = 0; i < INK_SPLATTERS.length; i++) {
      const sp = INK_SPLATTERS[i];
      ctx.save();
      ctx.translate(sp.x * w, sp.y * h);
      ctx.rotate(sp.rot);
      ctx.beginPath();
      ctx.ellipse(0, 0, sp.rx * w, sp.ry * h, 0, 0, Math.PI * 2);
      ctx.fillStyle = sky > 0.2
        ? hexToRgba(i % 2 === 0 ? STAIN_PALETTE.lapisIndigo : STAIN_PALETTE.magentaKnot, 0.25 + sky * 0.35)
        : "rgba(25,21,30,0.88)";
      ctx.fill();
      ctx.restore();
    }

    // Main shapeless stain silhouette + interior clip
    ctx.save();
    traceStainContour(ctx, w, h);
    const bgGrad = ctx.createRadialGradient(w * 0.49, h * 0.51, minDim * 0.04, w * 0.50, h * 0.52, minDim * 0.52);
    bgGrad.addColorStop(0, sky > 0.05 ? hexToRgba("#1d1b38", 0.55 + sky * 0.4) : "#221c22");
    bgGrad.addColorStop(0.6, sky > 0.05 ? hexToRgba("#141225", 0.75 + sky * 0.2) : STAIN_PALETTE.sootStone);
    bgGrad.addColorStop(1, "#0b0910");
    ctx.fillStyle = bgGrad;
    ctx.fill();
    ctx.clip();

    // Deep-space nebula lobes & twinkling stars when Oracle pivots toward stain_cosmos
    if (sky > 0.02) {
      const lobes = [
        { x: 0.32, y: 0.30, r: 0.26, c: STAIN_PALETTE.lapisIndigo },
        { x: 0.68, y: 0.63, r: 0.28, c: STAIN_PALETTE.crimsonThread },
        { x: 0.77, y: 0.28, r: 0.22, c: STAIN_PALETTE.magentaKnot },
        { x: 0.22, y: 0.76, r: 0.24, c: STAIN_PALETTE.goldSelvedge }
      ];
      for (let i = 0; i < lobes.length; i++) {
        const lb = lobes[i];
        const ng = ctx.createRadialGradient(lb.x * w, lb.y * h, 2, lb.x * w, lb.y * h, lb.r * minDim);
        ng.addColorStop(0, hexToRgba(lb.c, 0.30 * sky));
        ng.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = ng;
        ctx.fillRect(0, 0, w, h);
      }
      for (let i = 0; i < st.starField.length; i++) {
        const star = st.starField[i];
        const tw = 0.55 + 0.45 * Math.sin(st.time * 2.1 + star.phase);
        ctx.fillStyle = hexToRgba(star.color, clamp(sky * tw * 0.95, 0, 1));
        ctx.beginPath();
        ctx.arc(star.xNorm * w, star.yNorm * h, star.size * (0.7 + sky * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Crooked winding alleys & uneven stone step treads
    for (let i = 0; i < ALLEY_EDGES.length; i++) {
      const e = ALLEY_EDGES[i];
      ctx.beginPath();
      for (let p = 0; p < e.pts.length; p++) {
        const px = e.pts[p][0] * w, py = e.pts[p][1] * h;
        if (p === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = "rgba(8,6,11,0.92)";
      ctx.lineWidth = Math.max(4, minDim * 0.014);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.strokeStyle = hexToRgba(STAIN_PALETTE.crumblingOcher, 0.42 - sky * 0.12);
      ctx.lineWidth = Math.max(1.4, minDim * 0.0045);
      ctx.stroke();

      if (e.steps > 0) {
        const stepTotal = e.steps * 4;
        for (let s = 1; s < stepTotal; s++) {
          const smp = sampleEdgePoint(e, s / stepTotal);
          const nx = -Math.sin(smp.heading) * minDim * 0.007;
          const ny = Math.cos(smp.heading) * minDim * 0.007;
          ctx.beginPath();
          ctx.moveTo(smp.xNorm * w - nx, smp.yNorm * h - ny);
          ctx.lineTo(smp.xNorm * w + nx, smp.yNorm * h + ny);
          ctx.strokeStyle = "rgba(234,220,195,0.28)";
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      }
    }

    // Blind dead-end spurs
    for (let i = 0; i < DEAD_END_SPURS.length; i++) {
      const sp = DEAD_END_SPURS[i].pts;
      ctx.beginPath();
      ctx.moveTo(sp[0][0] * w, sp[0][1] * h);
      ctx.lineTo(sp[1][0] * w, sp[1][1] * h);
      ctx.lineTo(sp[2][0] * w, sp[2][1] * h);
      ctx.strokeStyle = "rgba(140,109,78,0.38)";
      ctx.lineWidth = Math.max(2, minDim * 0.006);
      ctx.stroke();
      ctx.fillStyle = "#5a4232";
      ctx.fillRect(sp[2][0] * w - 3, sp[2][1] * h - 3, 6, 6);
    }

    // Stacked leaning hovels ("houses crumbling one upon another")
    for (let i = 0; i < st.hovels.length; i++) {
      const hv = st.hovels[i];
      const hw = hv.wNorm * w, hh = hv.hNorm * h;
      ctx.save();
      ctx.translate(hv.xNorm * w, (hv.yNorm + hv.slumpOffset) * h);
      ctx.rotate(hv.tiltRad + hv.slumpOffset * 3.2);
      for (let t = 0; t < hv.tiers; t++) {
        const ty = -t * hh * 0.68;
        const tw = hw * (1 - t * 0.14);
        ctx.fillStyle = hexToRgba("#3b2e26", 0.84 - sky * 0.18);
        ctx.strokeStyle = hexToRgba(STAIN_PALETTE.crumblingOcher, 0.55);
        ctx.lineWidth = 1;
        ctx.fillRect(-tw * 0.5, ty - hh * 0.5, tw, hh * 0.72);
        ctx.strokeRect(-tw * 0.5, ty - hh * 0.5, tw, hh * 0.72);
        if (hv.litWindow && t === hv.tiers - 1) {
          ctx.fillStyle = hexToRgba(STAIN_PALETTE.emberScream, 0.65 + 0.25 * Math.sin(st.time * 3 + i));
          ctx.fillRect(-1.6, ty - hh * 0.22, 3.2, 3.6);
        }
      }
      ctx.restore();
    }

    // Silver fish racks & shimmering salt-brine vapor on western stairs
    for (let i = 0; i < st.fishBrineDrifts.length; i++) {
      const fb = st.fishBrineDrifts[i];
      const cx = fb.xNorm * w, cy = fb.yNorm * h;
      const half = fb.spanNorm * minDim * 0.5;
      const dx = Math.cos(fb.angle) * half, dy = Math.sin(fb.angle) * half;
      ctx.beginPath();
      ctx.moveTo(cx - dx, cy - dy);
      ctx.lineTo(cx + dx, cy + dy);
      ctx.strokeStyle = "rgba(216,168,76,0.52)";
      ctx.lineWidth = 1;
      ctx.stroke();
      for (let f = 0; f < fb.fishCount; f++) {
        const u = (f + 0.5) / fb.fishCount;
        const fx = lerp(cx - dx, cx + dx, u);
        const fy = lerp(cy - dy, cy + dy, u);
        ctx.fillStyle = "rgba(210,228,242,0.78)";
        ctx.beginPath();
        ctx.ellipse(fx, fy + 3.5, 1.5, 3.6, 0.12 * Math.sin(st.time * 2.4 + f), 0, Math.PI * 2);
        ctx.fill();
      }
      const vapX = cx + Math.sin(st.time * 1.3 + fb.phase) * 6;
      const vapY = cy - ((st.time * 9 + i * 7) % 18);
      ctx.fillStyle = "rgba(155,215,225,0.18)";
      ctx.beginPath();
      ctx.arc(vapX, vapY, minDim * 0.018, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore(); // end interior clip phase 1
    ctx.restore();
  }

  function renderOverlaysAndCosmos(ctx, w, h, st) {
    ctx.save();
    const sky = st.oracleAngle;
    const minDim = Math.min(w, h);

    // Stain perimeter crust -> glowing deep-space nebula veil as oracleAngle -> 1
    traceStainContour(ctx, w, h);
    ctx.strokeStyle = sky > 0.05
      ? hexToRgba(STAIN_PALETTE.magentaKnot, 0.30 + sky * 0.55)
      : "rgba(140,109,78,0.45)";
    ctx.lineWidth = sky > 0.05 ? (2.2 + sky * 3.2) : 1.8;
    ctx.stroke();
    if (sky > 0.15) {
      ctx.strokeStyle = hexToRgba(STAIN_PALETTE.goldSelvedge, sky * 0.42);
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    // Packed mules with twin panniers jostling in narrow passages
    for (let i = 0; i < st.mules.length; i++) {
      const m = st.mules[i];
      const wobble = Math.sin(st.time * 7.5 + m.jostlePhase) * (1.2 + st.jostleBoost * 3.4);
      ctx.save();
      ctx.translate(m.xNorm * w, m.yNorm * h);
      ctx.rotate(m.heading + wobble * 0.08);
      if (m.bottlenecked || st.jostleBoost > 0.15) {
        ctx.beginPath();
        ctx.arc(0, 0, 7 + st.jostleBoost * 5, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(STAIN_PALETTE.goldSelvedge, 0.28 + st.jostleBoost * 0.45);
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      ctx.fillStyle = m.pannierA;
      ctx.fillRect(-3.5, -5.2, 5.2, 2.8);
      ctx.fillStyle = m.pannierB;
      ctx.fillRect(-3.5, 2.4, 5.2, 2.8);
      ctx.fillStyle = "#70533b";
      ctx.beginPath();
      ctx.ellipse(0, 0, 5.2, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#eadcc3";
      ctx.fillRect(4.0, -1.6, 2.2, 1.1);
      ctx.fillRect(4.0, 0.5, 2.2, 1.1);
      ctx.restore();
    }

    // Black smoke stains -> dark coal-sack nebulae rimmed with starlight
    for (let i = 0; i < st.smokeStains.length; i++) {
      const sm = st.smokeStains[i];
      const driftX = Math.sin(st.time * 0.9 + sm.phase) * minDim * 0.012;
      const driftY = -((st.time * 5 + i * 9) % 16);
      const sx = sm.xNorm * w + driftX;
      const sy = sm.yNorm * h + driftY * 0.45;
      const sr = sm.radiusNorm * minDim;
      const sg = ctx.createRadialGradient(sx, sy, sr * 0.12, sx, sy, sr);
      sg.addColorStop(0, "rgba(7,5,10,0.82)");
      sg.addColorStop(0.68, sky > 0.1 ? hexToRgba(STAIN_PALETTE.lapisIndigo, 0.34 * sky) : "rgba(20,16,24,0.42)");
      sg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = sg;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Landslide tumbling stones & dust clouds -> luminous galactic dust lanes
    for (let i = 0; i < st.dustClouds.length; i++) {
      const dc = st.dustClouds[i];
      const dx = dc.xNorm * w, dy = dc.yNorm * h, dr = dc.radiusNorm * minDim;
      const dg = ctx.createRadialGradient(dx, dy, dr * 0.1, dx, dy, dr);
      dg.addColorStop(0, sky > 0.15
        ? hexToRgba(STAIN_PALETTE.goldSelvedge, dc.alpha * (0.45 + sky * 0.45))
        : hexToRgba(STAIN_PALETTE.crumblingOcher, dc.alpha * 0.72));
      dg.addColorStop(0.6, sky > 0.15
        ? hexToRgba(STAIN_PALETTE.magentaKnot, dc.alpha * 0.36 * sky)
        : hexToRgba("#bda17e", dc.alpha * 0.35));
      dg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = dg;
      ctx.beginPath();
      ctx.arc(dx, dy, dr, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < st.landslides.length; i++) {
      const rk = st.landslides[i];
      ctx.save();
      ctx.translate(rk.xNorm * w, rk.yNorm * h);
      ctx.rotate(rk.rot);
      ctx.fillStyle = hexToRgba(STAIN_PALETTE.crumblingOcher, clamp(rk.life, 0.2, 0.95));
      ctx.fillRect(-rk.size * 0.5, -rk.size * 0.4, rk.size, rk.size * 0.8);
      ctx.restore();
    }

    // Fires & screams in the darkness -> red-giant/supernova cores & pulsar shockwaves
    for (let i = 0; i < st.fires.length; i++) {
      const fr = st.fires[i];
      const fx = fr.xNorm * w, fy = fr.yNorm * h;
      const pulse = 0.78 + 0.28 * Math.sin(st.time * 9.5 + i * 2.1);
      const rad = (fr.radiusNorm * minDim) * pulse * (1 + sky * 0.45);
      const fg = ctx.createRadialGradient(fx, fy, 1.5, fx, fy, rad);
      fg.addColorStop(0, "#fff2cf");
      fg.addColorStop(0.35, hexToRgba(STAIN_PALETTE.emberScream, fr.intensity));
      fg.addColorStop(0.75, hexToRgba(STAIN_PALETTE.crimsonThread, fr.intensity * 0.55));
      fg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.arc(fx, fy, rad, 0, Math.PI * 2);
      ctx.fill();
      if (sky > 0.25) {
        ctx.strokeStyle = hexToRgba("#ffdca2", sky * 0.7);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(fx - rad * 0.9, fy); ctx.lineTo(fx + rad * 0.9, fy);
        ctx.moveTo(fx, fy - rad * 0.9); ctx.lineTo(fx, fy + rad * 0.9);
        ctx.stroke();
      }
    }

    for (let i = 0; i < st.screams.length; i++) {
      const sc = st.screams[i];
      const sx = sc.xNorm * w, sy = sc.yNorm * h;
      const sr = sc.radiusNorm * minDim;
      ctx.beginPath();
      const segs = 18;
      for (let k = 0; k <= segs; k++) {
        const a = sc.startAngle + (k / segs) * sc.arcSpan;
        const jag = (k % 2 === 0 ? 1 : -1) * (3.5 + sky * 2.5) * sc.alpha;
        const px = sx + Math.cos(a) * (sr + jag);
        const py = sy + Math.sin(a) * (sr + jag);
        if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = sky > 0.25
        ? hexToRgba(STAIN_PALETTE.magentaKnot, sc.alpha * 0.95)
        : hexToRgba(STAIN_PALETTE.emberScream, sc.alpha * 0.92);
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    // Eccentric Keplerian world-orbits revolving directly through all 9 crooked loci
    if (sky > 0.03) {
      for (let i = 0; i < st.worldOrbits.length; i++) {
        const orb = st.worldOrbits[i];
        const steps = 64;
        ctx.beginPath();
        for (let k = 0; k <= steps; k++) {
          const th = (k / steps) * Math.PI * 2;
          const r = orb.semiLatus / (1 + orb.eccentricity * Math.cos(th - orb.omega));
          const ox = (orb.fx + r * Math.cos(th)) * w;
          const oy = (orb.fy + r * Math.sin(th)) * h;
          if (k === 0) ctx.moveTo(ox, oy); else ctx.lineTo(ox, oy);
        }
        ctx.strokeStyle = hexToRgba(orb.hex, sky * (st.selectedLocusId === orb.locusId ? 0.85 : 0.44));
        ctx.lineWidth = st.selectedLocusId === orb.locusId ? 1.8 : 1.05;
        ctx.stroke();

        const pr = orb.semiLatus / (1 + orb.eccentricity * Math.cos(orb.planetAngle - orb.omega));
        const px = (orb.fx + pr * Math.cos(orb.planetAngle)) * w;
        const py = (orb.fy + pr * Math.sin(orb.planetAngle)) * h;
        ctx.fillStyle = hexToRgba(STAIN_PALETTE.parchmentWarp, sky * 0.95);
        ctx.beginPath();
        ctx.arc(px, py, 2.8 + (st.selectedLocusId === orb.locusId ? 1.5 : 0), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Active homeomorphic crooked route pre-image
    if (st.route && st.route.crookedPoints.length > 1) {
      const pts = st.route.crookedPoints;
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const rx = pts[i].xNorm * w, ry = pts[i].yNorm * h;
        if (i === 0) ctx.moveTo(rx, ry); else ctx.lineTo(rx, ry);
      }
      ctx.strokeStyle = hexToRgba(st.route.hex, 0.85);
      ctx.lineWidth = Math.max(2.6, minDim * 0.0065);
      ctx.lineJoin = "round";
      ctx.stroke();
      ctx.setLineDash([5, 4]);
      ctx.lineDashOffset = -st.time * 18;
      ctx.strokeStyle = STAIN_PALETTE.goldSelvedge;
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function renderLociMarkers(ctx, w, h, st) {
    ctx.save();
    const sky = st.oracleAngle;
    const compact = w < 420;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < STAIN_LOCI.length; i++) {
      const loc = STAIN_LOCI[i];
      const lx = loc.xNorm * w, ly = loc.yNorm * h;
      const isSel = st.selectedLocusId === loc.id;
      const isHov = st.hoveredLocusId === loc.id;
      const r = isSel ? 9.5 : (isHov ? 8.2 : 6.8);

      if (isSel || isHov) {
        ctx.beginPath();
        ctx.arc(lx, ly, r + 5 + Math.sin(st.time * 4) * 1.4, 0, Math.PI * 2);
        ctx.strokeStyle = hexToRgba(STAIN_PALETTE.goldSelvedge, isSel ? 0.92 : 0.6);
        ctx.lineWidth = 1.6;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(lx, ly, r, 0, Math.PI * 2);
      ctx.fillStyle = loc.hex;
      ctx.fill();
      ctx.strokeStyle = isSel ? STAIN_PALETTE.parchmentWarp : STAIN_PALETTE.goldSelvedge;
      ctx.lineWidth = isSel ? 2.0 : 1.2;
      ctx.stroke();

      ctx.fillStyle = "#fff8eb";
      ctx.font = "bold 9.5px Georgia, serif";
      ctx.fillText(String(loc.index + 1), lx, ly + 0.5);

      if (!compact || isSel || isHov || sky > 0.45) {
        const label = sky >= 0.5 ? loc.constellationName : loc.streetTitle;
        ctx.font = (isSel ? "bold " : "") + (compact ? "9px" : "10px") + " Georgia, serif";
        const tw = ctx.measureText(label).width + 8;
        const labelY = ly + (loc.yNorm > 0.78 ? -16 : 16);
        const labelX = clamp(lx, tw * 0.5 + 4, w - tw * 0.5 - 4);
        ctx.fillStyle = "rgba(13,11,16,0.82)";
        ctx.fillRect(labelX - tw * 0.5, labelY - 7, tw, 14);
        ctx.fillStyle = sky >= 0.5 ? STAIN_PALETTE.goldSelvedge : STAIN_PALETTE.parchmentWarp;
        ctx.fillText(label, labelX, labelY + 0.5);
      }
    }
    ctx.restore();
  }

  function resolveLocusId(idOrIndex) {
    if (typeof idOrIndex === "number" && STAIN_LOCI[idOrIndex]) return STAIN_LOCI[idOrIndex].id;
    if (typeof idOrIndex === "string" && LOCUS_BY_ID[idOrIndex]) return idOrIndex;
    return null;
  }

  function createStainCosmos(opts) {
    const cfg = opts || {};
    const st = {
      time: 0,
      oracleAngle: 0.0,
      cosmosMode: "carpet_cosmos",
      selectedLocusId: resolveLocusId(cfg.initialLocusId) || "mule_narrows",
      hoveredLocusId: null,
      reducedMotion: Boolean(cfg.reducedMotion),
      muted: Boolean(cfg.muted),
      audioCtx: cfg.audioCtx || null,
      jostleBoost: 0,
      landslideCount: 0,
      screamCount: 0,
      fireFlareCount: 0,
      muleJostleCount: 0,
      hovels: [],
      mules: [],
      smokeStains: [],
      fishBrineDrifts: [],
      starField: buildStarField(),
      worldOrbits: buildWorldOrbits(),
      landslides: [],
      dustClouds: [],
      fires: [],
      screams: [],
      route: null,
      lastWidth: 520,
      lastHeight: 520
    };

    function seedBaselineScene() {
      st.hovels = buildHovels();
      st.mules = buildMules();
      st.smokeStains = buildSmokeStains();
      st.fishBrineDrifts = buildFishBrineDrifts();
      st.worldOrbits = buildWorldOrbits();
      st.landslides = [
        { xNorm: 0.65, yNorm: 0.63, vx: 0.008, vy: 0.012, size: 5.5, rot: 0.3, life: 0.85 },
        { xNorm: 0.68, yNorm: 0.66, vx: -0.006, vy: 0.014, size: 4.5, rot: -0.5, life: 0.80 }
      ];
      st.dustClouds = [
        { xNorm: 0.66, yNorm: 0.64, radiusNorm: 0.058, alpha: 0.62, grow: 0.004, permanent: true },
        { xNorm: 0.45, yNorm: 0.19, radiusNorm: 0.042, alpha: 0.45, grow: 0.003, permanent: true }
      ];
      st.fires = [
        { xNorm: 0.58, yNorm: 0.82, radiusNorm: 0.042, intensity: 0.82, permanent: true },
        { xNorm: 0.83, yNorm: 0.75, radiusNorm: 0.032, intensity: 0.68, permanent: true },
        { xNorm: 0.32, yNorm: 0.30, radiusNorm: 0.026, intensity: 0.54, permanent: true }
      ];
      st.screams = [
        { xNorm: 0.85, yNorm: 0.76, radiusNorm: 0.038, startAngle: 2.2, arcSpan: 1.9, alpha: 0.68, permanent: true }
      ];
      st.route = computeCrookedRoute("mule_narrows", "oracle_sanctuary");
    }

    function triggerLandslide(locusId) {
      const target = LOCUS_BY_ID[resolveLocusId(locusId) || "landslide_ravine"];
      st.landslideCount += 1;
      for (let i = 0; i < st.hovels.length; i++) {
        if (dist(st.hovels[i].xNorm, st.hovels[i].yNorm, target.xNorm, target.yNorm) < 0.16) {
          st.hovels[i].slumpOffset = Math.min(0.024, st.hovels[i].slumpOffset + 0.009);
        }
      }
      for (let r = 0; r < 6; r++) {
        st.landslides.push({
          xNorm: target.xNorm + (r - 2.5) * 0.014,
          yNorm: target.yNorm - 0.015,
          vx: (r % 2 === 0 ? 1 : -1) * 0.016,
          vy: 0.028 + r * 0.006,
          size: 4 + (r % 3) * 2,
          rot: r * 0.7,
          life: 1.0
        });
      }
      st.dustClouds.push(
        { xNorm: target.xNorm, yNorm: target.yNorm, radiusNorm: 0.036, alpha: 0.92, grow: 0.032, permanent: false },
        { xNorm: target.xNorm + 0.025, yNorm: target.yNorm + 0.018, radiusNorm: 0.028, alpha: 0.84, grow: 0.026, permanent: false }
      );
      if (st.audioCtx) playAlleyFoley(st.audioCtx, "landslide", st.muted);
      if (typeof cfg.onHazardEvent === "function") {
        cfg.onHazardEvent({ kind: "landslide", locusId: target.id, landslideCount: st.landslideCount });
      }
      return { locusId: target.id, landslideCount: st.landslideCount };
    }

    function triggerScreamAndFire(locusId) {
      const target = LOCUS_BY_ID[resolveLocusId(locusId) || "scream_threshold"];
      const fireLoc = LOCUS_BY_ID[resolveLocusId(locusId) || "fire_cistern"];
      st.screamCount += 1;
      st.fireFlareCount += 1;
      st.fires.push({ xNorm: fireLoc.xNorm, yNorm: fireLoc.yNorm, radiusNorm: 0.056, intensity: 0.98, life: 1.0, permanent: false });
      for (let a = 0; a < 3; a++) {
        st.screams.push({
          xNorm: target.xNorm,
          yNorm: target.yNorm,
          radiusNorm: 0.024 + a * 0.018,
          startAngle: 1.9 + a * 0.45,
          arcSpan: 2.1,
          alpha: 0.96,
          permanent: false
        });
      }
      if (st.audioCtx) playAlleyFoley(st.audioCtx, "scream_fire", st.muted);
      if (typeof cfg.onHazardEvent === "function") {
        cfg.onHazardEvent({ kind: "scream_fire", locusId: target.id, screamCount: st.screamCount, fireFlareCount: st.fireFlareCount });
      }
      return { locusId: target.id, screamCount: st.screamCount, fireFlareCount: st.fireFlareCount };
    }

    function jostleMules() {
      st.muleJostleCount += 1;
      st.jostleBoost = 1.0;
      for (let i = 0; i < st.mules.length; i++) {
        st.mules[i].bottlenecked = true;
        st.mules[i].dir *= (i % 3 === 0 ? -1 : 1);
      }
      if (st.audioCtx) playAlleyFoley(st.audioCtx, "mules", st.muted);
      if (typeof cfg.onHazardEvent === "function") {
        cfg.onHazardEvent({ kind: "mules", locusId: "mule_narrows", muleJostleCount: st.muleJostleCount });
      }
      return { muleJostleCount: st.muleJostleCount };
    }

    function setHomeomorphicRoute(fromId, toId) {
      st.route = computeCrookedRoute(fromId, toId);
      return st.route;
    }

    function setOracleAngle(angle01) {
      const nextAngle = clamp(Number(angle01) || 0, 0, 1);
      const prevMode = st.cosmosMode;
      st.oracleAngle = nextAngle;
      st.cosmosMode = nextAngle >= 0.5 ? "stain_cosmos" : "carpet_cosmos";
      if (st.cosmosMode !== prevMode && typeof cfg.onCosmosFlip === "function") {
        cfg.onCosmosFlip({
          oracleAngle: st.oracleAngle,
          cosmosMode: st.cosmosMode,
          verdict: ORACLE_VERDICTS[st.cosmosMode]
        });
      }
      return ORACLE_VERDICTS[st.cosmosMode];
    }

    function setCosmosMode(mode) {
      if (typeof mode === "number") return setOracleAngle(mode);
      return setOracleAngle(mode === "stain_cosmos" ? 1.0 : 0.0);
    }

    function verifyBothCosmologies() {
      const verdict = ORACLE_VERDICTS[st.cosmosMode];
      return {
        carpetCosmosValid: Boolean(ORACLE_VERDICTS.carpet_cosmos.oracleSatisfied && STAIN_LOCI.length === 9),
        stainCosmosValid: Boolean(ORACLE_VERDICTS.stain_cosmos.oracleSatisfied && st.worldOrbits.length === 9),
        oracleSatisfiedInBoth: Boolean(ORACLE_VERDICTS.carpet_cosmos.oracleSatisfied && ORACLE_VERDICTS.stain_cosmos.oracleSatisfied),
        bijectionCount: STAIN_LOCI.length,
        activeCosmosMode: st.cosmosMode,
        oracleAngle: st.oracleAngle,
        divineObject: verdict.divineObject,
        approximateObject: verdict.approximateObject,
        headline: verdict.headline,
        verdictText: verdict.verdictText
      };
    }

    function selectLocus(locusId, selectOpts) {
      const resolved = resolveLocusId(locusId);
      if (!resolved) return null;
      st.selectedLocusId = resolved;
      const loc = LOCUS_BY_ID[resolved];
      if (!(selectOpts && selectOpts.silent) && typeof cfg.onSelectLocus === "function") {
        cfg.onSelectLocus(loc);
      }
      return loc;
    }

    function hoverLocus(locusIdOrNull) {
      st.hoveredLocusId = locusIdOrNull === null || locusIdOrNull === undefined
        ? null
        : resolveLocusId(locusIdOrNull);
      return st.hoveredLocusId ? LOCUS_BY_ID[st.hoveredLocusId] : null;
    }

    function step(dtSec, stepOpts) {
      const dt = clamp(Number(dtSec) || 0.016, 0, 0.1);
      const reduced = Boolean((stepOpts && stepOpts.reducedMotion !== undefined) ? stepOpts.reducedMotion : st.reducedMotion);
      st.jostleBoost = Math.max(0, st.jostleBoost - dt * 0.85);
      if (!reduced) {
        st.time += dt;
        for (let i = 0; i < st.mules.length; i++) {
          const m = st.mules[i];
          const edge = ALLEY_EDGES[m.edgeIdx];
          m.t += m.dir * m.speed * (1 + st.jostleBoost * 1.4) * dt;
          if (m.t > 0.94) { m.t = 0.94; m.dir = -1; }
          if (m.t < 0.06) { m.t = 0.06; m.dir = 1; }
          const pt = sampleEdgePoint(edge, m.t);
          m.xNorm = pt.xNorm;
          m.yNorm = pt.yNorm;
          m.heading = m.dir > 0 ? pt.heading : (pt.heading + Math.PI);
          m.bottlenecked = false;
          for (let j = 0; j < i; j++) {
            if (dist(m.xNorm, m.yNorm, st.mules[j].xNorm, st.mules[j].yNorm) < 0.048) {
              m.bottlenecked = true;
              st.mules[j].bottlenecked = true;
            }
          }
        }
        for (let i = 0; i < st.worldOrbits.length; i++) {
          const orb = st.worldOrbits[i];
          const r = orb.semiLatus / (1 + orb.eccentricity * Math.cos(orb.planetAngle - orb.omega));
          orb.planetAngle = (orb.planetAngle + (orb.angularRate * 0.04 / Math.max(0.02, r * r)) * dt) % (Math.PI * 2);
          orb.omega += 0.018 * dt;
        }
      }

      for (let i = st.landslides.length - 1; i >= 0; i--) {
        const rk = st.landslides[i];
        if (i >= 2) {
          if (!reduced) {
            rk.xNorm += rk.vx * dt;
            rk.yNorm += rk.vy * dt;
            rk.rot += 1.8 * dt;
          }
          rk.life -= dt * 0.55;
          if (rk.life <= 0) st.landslides.splice(i, 1);
        }
      }
      for (let i = st.dustClouds.length - 1; i >= 0; i--) {
        const dc = st.dustClouds[i];
        if (!dc.permanent) {
          dc.radiusNorm += dc.grow * dt;
          dc.alpha -= dt * 0.36;
          if (dc.alpha <= 0.02) st.dustClouds.splice(i, 1);
        }
      }
      for (let i = st.fires.length - 1; i >= 0; i--) {
        const fr = st.fires[i];
        if (!fr.permanent) {
          fr.life -= dt * 0.48;
          fr.intensity = Math.max(0, fr.life);
          if (fr.life <= 0.02) st.fires.splice(i, 1);
        }
      }
      for (let i = st.screams.length - 1; i >= 0; i--) {
        const sc = st.screams[i];
        if (!sc.permanent) {
          sc.radiusNorm += 0.065 * dt;
          sc.alpha -= dt * 0.52;
          if (sc.alpha <= 0.02) st.screams.splice(i, 1);
        }
      }
    }

    function render(ctx, width, height, renderOpts) {
      if (!ctx || !(width > 0) || !(height > 0)) return;
      st.lastWidth = width;
      st.lastHeight = height;
      if (renderOpts && typeof renderOpts.oracleAngle === "number") {
        setOracleAngle(renderOpts.oracleAngle);
      }
      ctx.save();
      renderStainScene(ctx, width, height, st);
      renderOverlaysAndCosmos(ctx, width, height, st);
      renderLociMarkers(ctx, width, height, st);
      ctx.restore();
    }

    function hitTest(normX, normY, width, height) {
      const w = width > 1 ? width : st.lastWidth;
      const h = height > 1 ? height : st.lastHeight;
      const nx = (normX > 1.05 && w > 1) ? (normX / w) : normX;
      const ny = (normY > 1.05 && h > 1) ? (normY / h) : normY;
      let best = null;
      let bestNormDist = Infinity;
      for (let i = 0; i < STAIN_LOCI.length; i++) {
        const loc = STAIN_LOCI[i];
        const nd = dist(nx, ny, loc.xNorm, loc.yNorm);
        const pxDist = Math.hypot((nx - loc.xNorm) * w, (ny - loc.yNorm) * h);
        if ((nd <= 0.072 || pxDist <= 28) && nd < bestNormDist) {
          bestNormDist = nd;
          best = { id: loc.id, index: loc.index, locus: loc, distance: Number(nd.toFixed(4)) };
        }
      }
      return best;
    }

    function getState() {
      return {
        selectedLocusId: st.selectedLocusId,
        selectedLocus: LOCUS_BY_ID[st.selectedLocusId],
        hoveredLocusId: st.hoveredLocusId,
        oracleAngle: st.oracleAngle,
        cosmosMode: st.cosmosMode,
        oracleVerdict: ORACLE_VERDICTS[st.cosmosMode],
        bijectionCount: STAIN_LOCI.length,
        route: st.route,
        tortuosityRatio: st.route ? st.route.tortuosityRatio : 0,
        muleCount: st.mules.length,
        hovelCount: st.hovels.length,
        smokeStainCount: st.smokeStains.length,
        fishBrineCount: st.fishBrineDrifts.length,
        worldOrbitCount: st.worldOrbits.length,
        landslideCount: st.landslideCount,
        screamCount: st.screamCount,
        fireFlareCount: st.fireFlareCount,
        muleJostleCount: st.muleJostleCount,
        muted: st.muted,
        reducedMotion: st.reducedMotion,
        cosmologyVerification: verifyBothCosmologies()
      };
    }

    function reset() {
      st.time = 0;
      st.oracleAngle = 0.0;
      st.cosmosMode = "carpet_cosmos";
      st.selectedLocusId = resolveLocusId(cfg.initialLocusId) || "mule_narrows";
      st.hoveredLocusId = null;
      st.jostleBoost = 0;
      st.landslideCount = 0;
      st.screamCount = 0;
      st.fireFlareCount = 0;
      st.muleJostleCount = 0;
      seedBaselineScene();
      return getState();
    }

    seedBaselineScene();

    return {
      LOCUS_IDS: LOCUS_IDS,
      STAIN_LOCI: STAIN_LOCI,
      ORACLE_VERDICTS: ORACLE_VERDICTS,
      triggerLandslide: triggerLandslide,
      triggerScreamAndFire: triggerScreamAndFire,
      jostleMules: jostleMules,
      setHomeomorphicRoute: setHomeomorphicRoute,
      traceRoute: setHomeomorphicRoute,
      setOracleAngle: setOracleAngle,
      setCosmosMode: setCosmosMode,
      getOracleVerdict: function () { return ORACLE_VERDICTS[st.cosmosMode]; },
      verifyBothCosmologies: verifyBothCosmologies,
      playAlleyFoley: function (audioCtx, kind, muted) {
        return playAlleyFoley(audioCtx || st.audioCtx, kind, muted !== undefined ? muted : st.muted);
      },
      setAudioContext: function (ctx) { st.audioCtx = ctx || null; },
      setMuted: function (flag) { st.muted = Boolean(flag); return st.muted; },
      isMuted: function () { return st.muted; },
      setReducedMotion: function (flag) { st.reducedMotion = Boolean(flag); return st.reducedMotion; },
      selectLocus: selectLocus,
      hoverLocus: hoverLocus,
      step: step,
      render: render,
      hitTest: hitTest,
      getState: getState,
      reset: reset
    };
  }

  const api = {
    LOCUS_IDS: LOCUS_IDS,
    STAIN_PALETTE: STAIN_PALETTE,
    STAIN_LOCI: STAIN_LOCI,
    ORACLE_VERDICTS: ORACLE_VERDICTS,
    playAlleyFoley: playAlleyFoley,
    createStainCosmos: createStainCosmos
  };

  globalThis.EudoxiaCrumblingStainCosmos = api;
  if (typeof window !== "undefined") {
    window.EudoxiaCrumblingStainCosmos = api;
  }
})();
