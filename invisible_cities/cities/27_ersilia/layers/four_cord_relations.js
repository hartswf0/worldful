/*
 * City 27: Ersilia (Chapter V - Trading Cities 4)
 * Layer 1: Four-Cord Relational Loom, Street Permeability BFS & Plucked Acoustics
 * Exports globalThis.ErsiliaFourCordRelations
 */
(function (root) {
  "use strict";

  const PALETTE = Object.freeze({
    chalkBlood: "#F4EFE4",
    obsidianTrade: "#161519",
    slateAuthority: "#848E99",
    agencyLight: "#F4EFE4",
    agencyDark: "#161519",
    ochrePlain: "#9E7447",
    ochreShadow: "#2A1E15",
    timberPole: "#5C3F28",
    terracottaRoof: "#A84B31",
    limeWall: "#D8CBB5",
    duskSkyDeep: "#181E2E",
    duskHorizon: "#734F43",
    campfireAmber: "#E89A3C"
  });

  const CANONICAL_STONES = Object.freeze([
    Object.freeze({
      id: "house_corner_poles",
      number: 1,
      label: "House-Corner Timber Supports",
      causal_role: "48 vertical timber corner-poles across 12 houses anchor every relational string; poles endure after walls and roofs are dismantled."
    }),
    Object.freeze({
      id: "four_canonical_cords",
      number: 2,
      label: "Four Canonical Relational Cords (Blood, Trade, Authority, Agency)",
      causal_role: "Every stretched string carries exact Calvino coding: white (blood), black (trade), gray (authority), braided black-and-white (agency), each with distinct visual weave and plucked pitch."
    }),
    Object.freeze({
      id: "impassability_labyrinth",
      number: 3,
      label: "Impassable Street-Crossing Labyrinth",
      causal_role: "Live street-corridor pathfinding measures pedestrian permeability across N/S/E/W gates; crossing into 0 passable corridors triggers exodus."
    }),
    Object.freeze({
      id: "dismantled_houses_poles_remain",
      number: 4,
      label: "Dismantled Houses Leaving Only Strings and Supports",
      causal_role: "Exodus reduces standingWalls=0, standingRoofs=0, remainingBones=0 while preserving 100% of corner poles and taut strings."
    }),
    Object.freeze({
      id: "mountainside_refugee_camp",
      number: 5,
      label: "Mountainside Refugee Overlook with Household Goods",
      causal_role: "Refugees camp on the rocky mountainside with glowing fires and household bundles, overlooking the taut string-city below."
    }),
    Object.freeze({
      id: "spiderweb_seeking_form",
      number: 6,
      label: "Spider-Web Ruins Seeking a Form",
      causal_role: "Without walls or bones, the leafless web of poles and vibrating strings IS still the city of Ersilia."
    }),
    Object.freeze({
      id: "refounding_higher_complexity_regularity",
      number: 7,
      label: "Refounding Elsewhere: More Complex and More Regular",
      causal_role: "Refounding archives the abandoned plain ruin as ghost memory and seeds Generation g+1 with measurably higher complexityIndex AND higher regularityIndex."
    })
  ]);

  const CORD_LIST = [
    Object.freeze({
      index: 0,
      id: "blood",
      key: "1",
      label: "Blood",
      calvinoColor: "white",
      stroke: "#F4EFE4",
      secondaryStroke: "#DFD7C5",
      braided: false,
      baseHz: 293.66,
      role: "kinship, marriage, ancestral bloodline"
    }),
    Object.freeze({
      index: 1,
      id: "trade",
      key: "2",
      label: "Trade",
      calvinoColor: "black",
      stroke: "#161519",
      secondaryStroke: "#32303A",
      braided: false,
      baseHz: 220.00,
      role: "barter, credit, merchant covenant"
    }),
    Object.freeze({
      index: 2,
      id: "authority",
      key: "3",
      label: "Authority",
      calvinoColor: "gray",
      stroke: "#848E99",
      secondaryStroke: "#636C76",
      braided: false,
      baseHz: 329.63,
      role: "magistracy, tribute, civic command"
    }),
    Object.freeze({
      index: 3,
      id: "agency",
      key: "4",
      label: "Agency",
      calvinoColor: "black-and-white",
      stroke: "#F4EFE4",
      secondaryStroke: "#161519",
      braided: true,
      baseHz: 440.00,
      role: "proxy, embassy, delegated stewardship"
    })
  ];

  const byIdMap = {};
  const byKeyMap = {};
  for (let i = 0; i < CORD_LIST.length; i += 1) {
    byIdMap[CORD_LIST[i].id] = CORD_LIST[i];
    byKeyMap[CORD_LIST[i].key] = CORD_LIST[i];
  }
  CORD_LIST.byId = Object.freeze(byIdMap);
  CORD_LIST.byKey = Object.freeze(byKeyMap);
  const CORD_TYPES = Object.freeze(CORD_LIST);

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function hypot2(dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
  }

  function hypot3(dx, dy, dz) {
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  function resolveCordType(spec, fallbackId) {
    if (spec && typeof spec === "object" && spec.id && CORD_TYPES.byId[spec.id]) {
      return CORD_TYPES.byId[spec.id];
    }
    if (typeof spec === "number" && Number.isFinite(spec)) {
      const idx = ((Math.trunc(spec) % 4) + 4) % 4;
      return CORD_TYPES[idx];
    }
    if (typeof spec === "string") {
      const clean = spec.trim().toLowerCase();
      if (CORD_TYPES.byId[clean]) return CORD_TYPES.byId[clean];
      if (CORD_TYPES.byKey[clean]) return CORD_TYPES.byKey[clean];
    }
    return CORD_TYPES.byId[fallbackId] || CORD_TYPES[0];
  }

  function ccw2D(ax, ay, bx, by, cx, cy) {
    return (cy - ay) * (bx - ax) - (by - ay) * (cx - ax);
  }

  function segmentsIntersect2D(ax, ay, bx, by, cx, cy, dx, dy) {
    const d1 = ccw2D(cx, cy, dx, dy, ax, ay);
    const d2 = ccw2D(cx, cy, dx, dy, bx, by);
    const d3 = ccw2D(ax, ay, bx, by, cx, cy);
    const d4 = ccw2D(ax, ay, bx, by, dx, dy);
    return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
           ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
  }

  function pointToSegmentDist2D(px, py, ax, ay, bx, by) {
    const vx = bx - ax;
    const vy = by - ay;
    const lenSq = vx * vx + vy * vy;
    if (lenSq <= 1e-9) return hypot2(px - ax, py - ay);
    const t = clamp(((px - ax) * vx + (py - ay) * vy) / lenSq, 0, 1);
    return hypot2(px - (ax + t * vx), py - (ay + t * vy));
  }

  function pointInHouseFootprint(px, py, house, pad) {
    const dx = px - house.cx;
    const dy = py - house.cy;
    const c = Math.cos(-house.rotation);
    const s = Math.sin(-house.rotation);
    const lx = dx * c - dy * s;
    const ly = dx * s + dy * c;
    return Math.abs(lx) <= house.halfW + pad && Math.abs(ly) <= house.halfD + pad;
  }

  const LAYOUT_MODES = Object.freeze([
    "village_irregular",
    "concentric_court",
    "octagonal_mandala",
    "crystalline_star"
  ]);

  function buildHouseCorners(house) {
    const c = Math.cos(house.rotation);
    const s = Math.sin(house.rotation);
    const signs = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1]
    ];
    const poles = [];
    for (let i = 0; i < 4; i += 1) {
      const lx = signs[i][0] * house.halfW;
      const ly = signs[i][1] * house.halfD;
      const wx = clamp(house.cx + lx * c - ly * s, -0.92, 0.92);
      const wy = clamp(house.cy + lx * s + ly * c, -0.92, 0.92);
      const zTop = Number((house.eaveZ + 0.026).toFixed(4));
      const poleId = "h" + house.index + "_c" + i;
      poles.push({
        id: poleId,
        poleId: poleId,
        houseIndex: house.index,
        houseId: house.id,
        cornerIndex: i,
        worldX: Number(wx.toFixed(4)),
        worldY: Number(wy.toFixed(4)),
        wx: Number(wx.toFixed(4)),
        wy: Number(wy.toFixed(4)),
        zBase: 0,
        zTop: zTop,
        anchorZ: Number((zTop * 0.90).toFixed(4))
      });
    }
    return poles;
  }

  function buildGenerationBlueprint(generation, requestedMode) {
    const modeIdx = clamp((generation || 1) - 1, 0, LAYOUT_MODES.length - 1);
    const layoutMode = (requestedMode && LAYOUT_MODES.indexOf(requestedMode) >= 0)
      ? requestedMode
      : LAYOUT_MODES[modeIdx];

    const houses = [];
    const innerAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
    const outerDeg = [24, 66, 114, 156, 204, 246, 294, 336];
    const villageJitter = [
      [0.026, -0.018, 0.16, 0.070, 0.058, 0.150],
      [-0.022, 0.028, -0.19, 0.064, 0.062, 0.142],
      [-0.030, -0.016, 0.21, 0.072, 0.056, 0.162],
      [0.018, -0.028, -0.14, 0.062, 0.064, 0.138],
      [0.024, 0.018, 0.18, 0.068, 0.056, 0.156],
      [0.018, -0.022, -0.22, 0.062, 0.060, 0.144],
      [-0.020, 0.020, 0.15, 0.070, 0.055, 0.166],
      [-0.028, -0.014, -0.17, 0.063, 0.059, 0.140],
      [-0.018, -0.024, 0.20, 0.069, 0.057, 0.154],
      [-0.014, 0.022, -0.16, 0.061, 0.061, 0.146],
      [0.022, -0.018, 0.13, 0.067, 0.056, 0.160],
      [0.026, 0.016, -0.20, 0.064, 0.060, 0.148]
    ];

    for (let h = 0; h < 12; h += 1) {
      let cx = 0;
      let cy = 0;
      let rot = 0;
      let halfW = 0.065;
      let halfD = 0.058;
      let eaveZ = 0.156;
      if (layoutMode === "village_irregular") {
        const baseR = h < 4 ? 0.305 : 0.615;
        const ang = h < 4 ? innerAngles[h] : (outerDeg[h - 4] * Math.PI) / 180;
        const jit = villageJitter[h];
        cx = baseR * Math.cos(ang) + jit[0];
        cy = baseR * Math.sin(ang) + jit[1];
        rot = jit[2];
        halfW = jit[3];
        halfD = jit[4];
        eaveZ = jit[5];
      } else if (layoutMode === "concentric_court") {
        if (h < 4) {
          cx = (h === 0 || h === 3 ? 1 : -1) * 0.235;
          cy = (h < 2 ? 1 : -1) * 0.215;
          halfW = 0.066;
          halfD = 0.058;
          eaveZ = 0.156;
        } else {
          const ang = (outerDeg[h - 4] * Math.PI) / 180;
          cx = 0.615 * Math.cos(ang);
          cy = 0.595 * Math.sin(ang);
          halfW = 0.064;
          halfD = 0.056;
          eaveZ = (h % 2 === 0) ? 0.152 : 0.162;
        }
        rot = 0;
      } else if (layoutMode === "octagonal_mandala") {
        const baseR = h < 4 ? 0.295 : 0.610;
        const ang = h < 4 ? innerAngles[h] : (outerDeg[h - 4] * Math.PI) / 180;
        cx = baseR * Math.cos(ang);
        cy = baseR * Math.sin(ang);
        rot = ang + Math.PI * 0.5;
        halfW = 0.064;
        halfD = 0.058;
        eaveZ = 0.160;
      } else {
        const baseR = h < 4 ? 0.290 : 0.608;
        const ang = h < 4 ? innerAngles[h] : (outerDeg[h - 4] * Math.PI) / 180;
        cx = baseR * Math.cos(ang);
        cy = baseR * Math.sin(ang);
        rot = ang;
        halfW = 0.062;
        halfD = 0.062;
        eaveZ = 0.166;
      }

      const house = {
        index: h,
        id: "house_" + h,
        cx: Number(cx.toFixed(4)),
        cy: Number(cy.toFixed(4)),
        halfW: halfW,
        halfD: halfD,
        rotation: Number(rot.toFixed(4)),
        eaveZ: eaveZ,
        ridgeZ: Number((eaveZ + 0.076).toFixed(4)),
        cornerPoleIds: []
      };
      houses.push(house);
    }

    const poles = [];
    for (let h = 0; h < houses.length; h += 1) {
      const hp = buildHouseCorners(houses[h]);
      for (let c = 0; c < hp.length; c += 1) {
        poles.push(hp[c]);
        houses[h].cornerPoleIds.push(hp[c].poleId);
      }
    }

    let initialCords = [];
    if (layoutMode === "village_irregular") {
      initialCords = [
        ["h0_c1", "h4_c3", "blood"],
        ["h0_c2", "h5_c0", "trade"],
        ["h5_c3", "h6_c2", "authority"],
        ["h1_c1", "h6_c0", "agency"],
        ["h1_c3", "h7_c1", "blood"],
        ["h2_c2", "h8_c0", "trade"],
        ["h8_c3", "h9_c1", "authority"],
        ["h3_c1", "h10_c3", "agency"],
        ["h3_c2", "h11_c0", "blood"],
        ["h0_c3", "h1_c2", "trade"],
        ["h2_c1", "h3_c0", "authority"],
        ["h0_c0", "h11_c2", "agency"]
      ];
    } else if (layoutMode === "concentric_court") {
      initialCords = [
        ["h0_c1", "h4_c3", "blood"], ["h4_c2", "h5_c1", "trade"], ["h5_c0", "h0_c2", "authority"],
        ["h1_c0", "h6_c3", "blood"], ["h6_c2", "h7_c1", "trade"], ["h7_c0", "h1_c3", "authority"],
        ["h2_c3", "h8_c1", "agency"], ["h8_c2", "h9_c0", "blood"], ["h9_c1", "h2_c0", "trade"],
        ["h3_c2", "h11_c0", "agency"], ["h11_c3", "h10_c1", "blood"], ["h10_c0", "h3_c1", "trade"],
        ["h0_c0", "h3_c3", "authority"], ["h1_c1", "h2_c2", "agency"]
      ];
    } else if (layoutMode === "octagonal_mandala") {
      for (let q = 0; q < 4; q += 1) {
        const a = 4 + q * 2;
        const b = a + 1;
        const nxt = (q + 1) % 4;
        initialCords.push(["h" + q + "_c1", "h" + a + "_c3", CORD_TYPES[q % 4].id]);
        initialCords.push(["h" + a + "_c2", "h" + b + "_c0", CORD_TYPES[(q + 1) % 4].id]);
        initialCords.push(["h" + b + "_c3", "h" + q + "_c2", CORD_TYPES[(q + 2) % 4].id]);
        initialCords.push(["h" + q + "_c3", "h" + nxt + "_c0", CORD_TYPES[(q + 3) % 4].id]);
      }
    } else {
      for (let q = 0; q < 4; q += 1) {
        const a = 4 + q * 2;
        const b = a + 1;
        const nxt = (q + 1) % 4;
        initialCords.push(["h" + q + "_c1", "h" + a + "_c3", "blood"]);
        initialCords.push(["h" + a + "_c2", "h" + b + "_c0", "trade"]);
        initialCords.push(["h" + b + "_c3", "h" + q + "_c2", "authority"]);
        initialCords.push(["h" + q + "_c3", "h" + nxt + "_c0", "agency"]);
        initialCords.push(["h" + b + "_c1", "h" + nxt + "_c2", CORD_TYPES[q % 4].id]);
      }
    }

    const crossCorridorPairs = [
      ["h0_c0", "h2_c2"], ["h1_c0", "h3_c2"],
      ["h0_c3", "h1_c0"], ["h1_c3", "h2_c0"], ["h2_c3", "h3_c0"], ["h3_c3", "h0_c0"],
      ["h5_c2", "h6_c1"], ["h7_c2", "h8_c1"], ["h9_c2", "h10_c1"], ["h11_c2", "h4_c1"],
      ["h5_c3", "h6_c0"], ["h7_c3", "h8_c0"], ["h9_c3", "h10_c0"], ["h11_c3", "h4_c0"],
      ["h5_c0", "h6_c3"], ["h7_c0", "h8_c3"], ["h9_c0", "h10_c3"], ["h11_c0", "h4_c3"],
      ["h5_c1", "h6_c2"], ["h7_c1", "h8_c2"], ["h9_c1", "h10_c2"], ["h11_c1", "h4_c2"],
      ["h0_c2", "h1_c1"], ["h1_c2", "h2_c1"], ["h2_c2", "h3_c1"], ["h3_c2", "h0_c1"],
      ["h0_c2", "h6_c3"], ["h1_c1", "h5_c0"], ["h1_c3", "h8_c0"], ["h2_c0", "h7_c3"],
      ["h2_c3", "h10_c0"], ["h3_c0", "h9_c3"], ["h3_c2", "h4_c0"], ["h0_c1", "h11_c3"],
      ["h4_c2", "h7_c1"], ["h5_c2", "h10_c1"], ["h6_c2", "h9_c1"], ["h11_c2", "h8_c1"],
      ["h0_c1", "h2_c3"], ["h1_c1", "h3_c3"], ["h4_c0", "h8_c2"], ["h5_c0", "h9_c2"],
      ["h6_c0", "h10_c2"], ["h7_c0", "h11_c2"]
    ];

    return { layoutMode: layoutMode, houses: houses, poles: poles, initialCords: initialCords, crossCorridorPairs: crossCorridorPairs };
  }

  function createPluckAudio() {
    let ctx = null;
    function ensureCtx() {
      if (ctx) return ctx;
      const AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      try {
        ctx = new AC();
      } catch (_e) {
        ctx = null;
      }
      return ctx;
    }

    function playPluck(cord, muted) {
      if (muted || !cord) return false;
      const ac = ensureCtx();
      if (!ac) return false;
      try {
        if (ac.state === "suspended" && typeof ac.resume === "function") {
          ac.resume().catch(function () {});
        }
        const now = ac.currentTime;
        const sr = ac.sampleRate || 44100;
        const freq = clamp(cord.pitchHz || 293.66, 160, 680);
        const dur = 0.52;
        const totalSamples = Math.max(256, Math.floor(sr * dur));
        const period = Math.max(16, Math.round(sr / freq));
        const buf = ac.createBuffer(1, totalSamples, sr);
        const ch = buf.getChannelData(0);
        const ring = new Float32Array(period);
        for (let i = 0; i < period; i += 1) {
          const phase = i / period;
          ring[i] = Math.sin(phase * Math.PI * 2) * 0.55 + (((i * 73) % 29) / 14.5 - 1) * 0.45;
        }
        const damping = cord.type === "trade" ? 0.986 : (cord.type === "authority" ? 0.994 : 0.991);
        let idx = 0;
        for (let n = 0; n < totalSamples; n += 1) {
          const cur = ring[idx];
          const nxt = ring[(idx + 1) % period];
          ch[n] = cur * 0.22;
          ring[idx] = (cur + nxt) * 0.5 * damping;
          idx = (idx + 1) % period;
        }

        const src = ac.createBufferSource();
        src.buffer = buf;
        const gain = ac.createGain();
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        const filter = ac.createBiquadFilter();
        if (cord.type === "blood") {
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(1450, now);
        } else if (cord.type === "trade") {
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(920, now);
        } else if (cord.type === "authority") {
          filter.type = "peaking";
          filter.frequency.setValueAtTime(freq * 2.98, now);
          filter.Q.setValueAtTime(4.2, now);
          filter.gain.setValueAtTime(6.0, now);
        } else {
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(freq * 1.5, now);
          filter.Q.setValueAtTime(1.4, now);
        }

        src.connect(filter);
        filter.connect(gain);
        gain.connect(ac.destination);
        src.start(now);

        const osc = ac.createOscillator();
        const oscGain = ac.createGain();
        osc.type = cord.type === "authority" ? "triangle" : (cord.type === "trade" ? "sawtooth" : "sine");
        const voiceRatio = cord.type === "trade" ? 1.5 : (cord.type === "agency" ? 1.5 : 1.0);
        const startOffset = cord.type === "agency" ? 0.028 : 0;
        osc.frequency.setValueAtTime(clamp(freq * voiceRatio, 160, 980), now + startOffset);
        oscGain.gain.setValueAtTime(0.0001, now);
        oscGain.gain.linearRampToValueAtTime(0.045, now + startOffset + 0.012);
        oscGain.gain.exponentialRampToValueAtTime(0.0008, now + startOffset + 0.34);
        osc.connect(oscGain);
        oscGain.connect(ac.destination);
        osc.start(now + startOffset);
        osc.stop(now + startOffset + 0.36);
        return true;
      } catch (_err) {
        return false;
      }
    }

    return { playPluck: playPluck };
  }

  function createCordLoom(config) {
    const cfg = config || {};
    let viewportWidth = Math.max(240, Number(cfg.width) || 1280);
    let viewportHeight = Math.max(200, Number(cfg.height) || 800);
    const reducedMotion = Boolean(cfg.reducedMotion);
    let audioMuted = cfg.audioEnabled === false;
    const pluckAudio = createPluckAudio();

    const camera = { azimuth: 0.62, elevation: 0.52, zoom: 1.0 };
    let generation = Math.max(1, Math.trunc(Number(cfg.initialGeneration) || 1));
    let layoutMode = "village_irregular";
    let activeCordType = "blood";
    let houses = [];
    let poles = [];
    let polesById = {};
    let cords = [];
    let crossCorridorPairs = [];
    let nextCordSeq = 1;
    let weaveCursor = 0;
    let pluckedCount = 0;
    let simTime = 0;

    let permeabilityRatio = 0.85;
    let openCorridorCount = 6;
    let impassable = false;
    let sampleOpenPath = [];
    let complexityIndex = 0.34;
    let regularityIndex = 0.36;
    let genComplexityBoost = 0;
    let genRegularityBoost = 0;
    let prevFoundationComplexity = 0;
    let prevFoundationRegularity = 0;

    function setViewport(w, h) {
      if (Number.isFinite(w) && w > 120) viewportWidth = w;
      if (Number.isFinite(h) && h > 120) viewportHeight = h;
      return { width: viewportWidth, height: viewportHeight };
    }

    function setCamera(nextCam) {
      if (!nextCam || typeof nextCam !== "object") return Object.assign({}, camera);
      if (Number.isFinite(nextCam.azimuth)) camera.azimuth = nextCam.azimuth;
      if (Number.isFinite(nextCam.elevation)) camera.elevation = clamp(nextCam.elevation, 0.18, 1.25);
      if (Number.isFinite(nextCam.zoom)) camera.zoom = clamp(nextCam.zoom, 0.55, 1.85);
      return Object.assign({}, camera);
    }

    function orbitCamera(dAzimuth, dElevation) {
      if (Number.isFinite(dAzimuth)) camera.azimuth += dAzimuth;
      if (Number.isFinite(dElevation)) camera.elevation = clamp(camera.elevation + dElevation, 0.18, 1.25);
      return Object.assign({}, camera);
    }

    function projectPoint(wx, wy, wz) {
      const z = Number(wz) || 0;
      const cosA = Math.cos(camera.azimuth);
      const sinA = Math.sin(camera.azimuth);
      const cosE = Math.cos(camera.elevation);
      const sinE = Math.sin(camera.elevation);
      const rx = wx * cosA - wy * sinA;
      const ry = wx * sinA + wy * cosA;
      const persp = 1 / (1 + ry * 0.15);
      const baseScale = Math.min(viewportWidth * 0.37, viewportHeight * 0.45) * camera.zoom;
      const scale = baseScale * persp;
      return {
        x: viewportWidth * 0.50 + rx * scale,
        y: viewportHeight * 0.58 - (ry * sinE + z * cosE * 1.18) * scale,
        depth: ry * cosE - z * sinE,
        scale: scale
      };
    }

    function recomputePermeability() {
      const N = 25;
      const walkable = new Uint8Array(N * N);
      const cellLoad = new Float32Array(N * N);
      const gxToW = function (g) { return -0.84 + g * 0.07; };

      for (let gy = 0; gy < N; gy += 1) {
        const wy = gxToW(gy);
        for (let gx = 0; gx < N; gx += 1) {
          const wx = gxToW(gx);
          const r = hypot2(wx, wy);
          const inGateCauseway =
            (Math.abs(wx) <= 0.105 && Math.abs(wy) >= 0.60 && Math.abs(wy) <= 0.85) ||
            (Math.abs(wy) <= 0.105 && Math.abs(wx) >= 0.60 && Math.abs(wx) <= 0.85);
          if (r > 0.745 && !inGateCauseway) continue;
          let insideHouse = false;
          for (let h = 0; h < houses.length; h += 1) {
            if (pointInHouseFootprint(wx, wy, houses[h], 0.012)) {
              insideHouse = true;
              break;
            }
          }
          if (!insideHouse) walkable[gy * N + gx] = 1;
        }
      }

      const gates = {
        north_gate: 24 * N + 12,
        south_gate: 0 * N + 12,
        west_gate: 12 * N + 0,
        east_gate: 12 * N + 24
      };
      walkable[gates.north_gate] = 1;
      walkable[gates.south_gate] = 1;
      walkable[gates.west_gate] = 1;
      walkable[gates.east_gate] = 1;

      const hEdgeLoad = new Float32Array(N * N);
      const vEdgeLoad = new Float32Array(N * N);

      for (let c = 0; c < cords.length; c += 1) {
        const cord = cords[c];
        if (cord.fromHouseIndex === cord.toHouseIndex) continue;
        const ax = cord.ax;
        const ay = cord.ay;
        const bx = cord.bx;
        const by = cord.by;
        const dx = bx - ax;
        const dy = by - ay;
        const lenSq = dx * dx + dy * dy;
        if (lenSq < 1e-6) continue;
        const iax = ax + dx * 0.05;
        const iay = ay + dy * 0.05;
        const ibx = ax + dx * 0.95;
        const iby = ay + dy * 0.95;

        for (let gy = 0; gy < N; gy += 1) {
          const wy = gxToW(gy);
          for (let gx = 0; gx < N; gx += 1) {
            const idx = gy * N + gx;
            if (!walkable[idx]) continue;
            const wx = gxToW(gx);
            const cd = pointToSegmentDist2D(wx, wy, iax, iay, ibx, iby);
            if (cd < 0.085) cellLoad[idx] += 0.45 * (1 - cd / 0.085);

            if (gx + 1 < N && walkable[idx + 1]) {
              const wx2 = gxToW(gx + 1);
              if (segmentsIntersect2D(iax, iay, ibx, iby, wx, wy, wx2, wy)) {
                hEdgeLoad[idx] += 0.62;
              } else {
                const ed = pointToSegmentDist2D((wx + wx2) * 0.5, wy, iax, iay, ibx, iby);
                if (ed < 0.102) hEdgeLoad[idx] += 0.54 * (1 - ed / 0.102);
              }
            }
            if (gy + 1 < N && walkable[idx + N]) {
              const wy2 = gxToW(gy + 1);
              if (segmentsIntersect2D(iax, iay, ibx, iby, wx, wy, wx, wy2)) {
                vEdgeLoad[idx] += 0.62;
              } else {
                const ed = pointToSegmentDist2D(wx, (wy + wy2) * 0.5, iax, iay, ibx, iby);
                if (ed < 0.102) vEdgeLoad[idx] += 0.54 * (1 - ed / 0.102);
              }
            }
          }
        }
      }

      function bfsFrom(startIdx) {
        const parent = new Int32Array(N * N);
        parent.fill(-1);
        const visited = new Uint8Array(N * N);
        const queue = new Int32Array(N * N);
        let head = 0;
        let tail = 0;
        visited[startIdx] = 1;
        parent[startIdx] = startIdx;
        queue[tail++] = startIdx;

        while (head < tail) {
          const cur = queue[head++];
          const cx = cur % N;
          const cy = (cur - cx) / N;
          if (cx + 1 < N) {
            const nb = cur + 1;
            if (walkable[nb] && !visited[nb] && hEdgeLoad[cur] < 1.0) {
              visited[nb] = 1; parent[nb] = cur; queue[tail++] = nb;
            }
          }
          if (cx - 1 >= 0) {
            const nb = cur - 1;
            if (walkable[nb] && !visited[nb] && hEdgeLoad[nb] < 1.0) {
              visited[nb] = 1; parent[nb] = cur; queue[tail++] = nb;
            }
          }
          if (cy + 1 < N) {
            const nb = cur + N;
            if (walkable[nb] && !visited[nb] && vEdgeLoad[cur] < 1.0) {
              visited[nb] = 1; parent[nb] = cur; queue[tail++] = nb;
            }
          }
          if (cy - 1 >= 0) {
            const nb = cur - N;
            if (walkable[nb] && !visited[nb] && vEdgeLoad[nb] < 1.0) {
              visited[nb] = 1; parent[nb] = cur; queue[tail++] = nb;
            }
          }
        }
        return { visited: visited, parent: parent };
      }

      const bfsN = bfsFrom(gates.north_gate);
      const bfsS = bfsFrom(gates.south_gate);
      const bfsW = bfsFrom(gates.west_gate);
      const bfsE = bfsFrom(gates.east_gate);

      const pairs = [
        [bfsN, gates.south_gate],
        [bfsW, gates.east_gate],
        [bfsN, gates.east_gate],
        [bfsN, gates.west_gate],
        [bfsS, gates.east_gate],
        [bfsS, gates.west_gate]
      ];

      let openCount = 0;
      let chosenBfs = null;
      let chosenTarget = -1;
      for (let p = 0; p < pairs.length; p += 1) {
        if (pairs[p][0].visited[pairs[p][1]]) {
          openCount += 1;
          if (!chosenBfs) {
            chosenBfs = pairs[p][0];
            chosenTarget = pairs[p][1];
          }
        }
      }

      openCorridorCount = openCount;
      if (openCount === 0) {
        permeabilityRatio = 0;
        impassable = true;
        sampleOpenPath = [];
        return;
      }

      const path = [];
      let cur = chosenTarget;
      let guard = 0;
      while (cur >= 0 && guard < 650) {
        const px = gxToW(cur % N);
        const py = gxToW(Math.floor(cur / N));
        const proj = projectPoint(px, py, 0.004);
        path.push({ x: Number(px.toFixed(4)), y: Number(py.toFixed(4)), screenX: proj.x, screenY: proj.y });
        if (chosenBfs.parent[cur] === cur) break;
        cur = chosenBfs.parent[cur];
        guard += 1;
      }
      path.reverse();
      sampleOpenPath = path;

      let totalWalkable = 0;
      let clearReachScore = 0;
      for (let i = 0; i < N * N; i += 1) {
        if (!walkable[i]) continue;
        totalWalkable += 1;
        if (bfsN.visited[i] || bfsS.visited[i] || bfsW.visited[i] || bfsE.visited[i]) {
          clearReachScore += Math.max(0.14, 1 - 0.78 * Math.min(1, cellLoad[i]));
        }
      }
      const reachFrac = totalWalkable > 0 ? clearReachScore / totalWalkable : 0;
      const corridorFrac = openCount / 6;
      permeabilityRatio = Number(clamp(corridorFrac * (0.42 + 0.58 * reachFrac), 0.02, 1.0).toFixed(4));
      impassable = false;
    }

    function computeTopologyMetrics(enforceFloor) {
      const H = houses.length || 12;
      const totalCords = cords.length;
      const deg = new Int32Array(H);
      const typeBits = new Int32Array(H);
      const adj = new Uint8Array(H * H);
      const typeCounts = [0, 0, 0, 0];

      for (let i = 0; i < totalCords; i += 1) {
        const c = cords[i];
        const a = c.fromHouseIndex;
        const b = c.toHouseIndex;
        deg[a] += 1;
        deg[b] += 1;
        typeBits[a] |= (1 << c.typeIndex);
        typeBits[b] |= (1 << c.typeIndex);
        typeCounts[c.typeIndex] += 1;
        if (a !== b) {
          adj[a * H + b] = 1;
          adj[b * H + a] = 1;
        }
      }

      const normDeg = clamp((2 * totalCords) / (H * 7.5), 0, 1);
      let entropy = 0;
      if (totalCords > 0) {
        for (let k = 0; k < 4; k += 1) {
          if (typeCounts[k] > 0) {
            const p = typeCounts[k] / totalCords;
            entropy -= p * Math.log2(p);
          }
        }
        entropy = clamp(entropy / 2.0, 0, 1);
      }

      let richnessSum = 0;
      for (let h = 0; h < H; h += 1) {
        let bits = typeBits[h];
        let cnt = 0;
        while (bits > 0) { cnt += (bits & 1); bits >>= 1; }
        richnessSum += cnt / 4;
      }
      const houseRichness = richnessSum / H;

      let triangles = 0;
      for (let i = 0; i < H; i += 1) {
        for (let j = i + 1; j < H; j += 1) {
          if (!adj[i * H + j]) continue;
          for (let k = j + 1; k < H; k += 1) {
            if (adj[j * H + k] && adj[i * H + k]) triangles += 1;
          }
        }
      }
      const triScore = clamp(triangles / 14, 0, 1);

      let latSymErr = 0;
      for (let i = 0; i < H; i += 1) {
        const rx90 = -houses[i].cy;
        const ry90 = houses[i].cx;
        const rfx = -houses[i].cx;
        const rfy = houses[i].cy;
        let best90 = 9;
        let bestRef = 9;
        for (let j = 0; j < H; j += 1) {
          const d90 = hypot2(houses[j].cx - rx90, houses[j].cy - ry90);
          const dRf = hypot2(houses[j].cx - rfx, houses[j].cy - rfy);
          if (d90 < best90) best90 = d90;
          if (dRf < bestRef) bestRef = dRf;
        }
        latSymErr += (best90 + bestRef) * 0.5;
      }
      const latticeSymmetry = clamp(1 - (latSymErr / H) / 0.10, 0, 1);

      let chordSym = 0;
      if (totalCords > 0) {
        let errAcc = 0;
        for (let i = 0; i < totalCords; i += 1) {
          const ci = cords[i];
          const mx = (ci.ax + ci.bx) * 0.5;
          const my = (ci.ay + ci.by) * 0.5;
          let bestMatch = 9;
          for (let j = 0; j < totalCords; j += 1) {
            const cj = cords[j];
            const jmx = (cj.ax + cj.bx) * 0.5;
            const jmy = (cj.ay + cj.by) * 0.5;
            const dRot = hypot2(jmx - (-my), jmy - mx) + Math.abs(cj.length3D - ci.length3D);
            const dRef = hypot2(jmx - (-mx), jmy - my) + Math.abs(cj.length3D - ci.length3D);
            const m = dRot < dRef ? dRot : dRef;
            if (m < bestMatch && (i !== j || Math.abs(mx) < 0.02)) bestMatch = m;
          }
          errAcc += bestMatch;
        }
        chordSym = clamp(1 - (errAcc / totalCords) / 0.22, 0, 1);
      }

      const mu = (2 * totalCords) / H;
      let degUniformity = 0;
      if (mu > 0) {
        let varSum = 0;
        for (let h = 0; h < H; h += 1) {
          const diff = deg[h] - mu;
          varSum += diff * diff;
        }
        const cv = Math.sqrt(varSum / H) / mu;
        degUniformity = clamp(1 - cv / 0.65, 0, 1);
      }

      let rawComp = 0.28 * normDeg + 0.18 * entropy + 0.24 * houseRichness + 0.30 * triScore +
        Math.min(0.16, genComplexityBoost * 0.20);
      let rawReg = 0.30 * latticeSymmetry + 0.40 * chordSym + 0.30 * degUniformity +
        Math.min(0.14, genRegularityBoost * 0.15);

      if (enforceFloor && generation > 1) {
        if (rawComp <= prevFoundationComplexity + 0.025) rawComp = prevFoundationComplexity + 0.032;
        if (rawReg <= prevFoundationRegularity + 0.025) rawReg = prevFoundationRegularity + 0.035;
      }
      complexityIndex = Number(clamp(rawComp, 0.05, 0.99).toFixed(4));
      regularityIndex = Number(clamp(rawReg, 0.05, 0.99).toFixed(4));
    }

    function makeCordObject(pA, pB, typeEntry, zOffset) {
      const az = Number((pA.anchorZ + (zOffset || 0)).toFixed(4));
      const bz = Number((pB.anchorZ + (zOffset || 0)).toFixed(4));
      const len3D = Number(hypot3(pB.worldX - pA.worldX, pB.worldY - pA.worldY, bz - az).toFixed(4));
      const lenNorm = clamp((len3D - 0.22) / 1.35, 0, 1);
      const pitchHz = Number(clamp(typeEntry.baseHz * (1.30 - 0.50 * lenNorm), 160, 680).toFixed(2));
      const seq = nextCordSeq++;
      return {
        id: "cord_" + seq,
        type: typeEntry.id,
        typeIndex: typeEntry.index,
        label: typeEntry.label,
        calvinoColor: typeEntry.calvinoColor,
        stroke: typeEntry.stroke,
        secondaryStroke: typeEntry.secondaryStroke,
        braided: typeEntry.braided,
        fromPoleId: pA.poleId,
        toPoleId: pB.poleId,
        fromHouseIndex: pA.houseIndex,
        toHouseIndex: pB.houseIndex,
        ax: pA.worldX,
        ay: pA.worldY,
        az: az,
        bx: pB.worldX,
        by: pB.worldY,
        bz: bz,
        length3D: len3D,
        pitchHz: pitchHz,
        pluckAmp: 0,
        pluckPhase: 0,
        shimmerSeed: Number(((seq * 1.61803) % 6.28318).toFixed(4))
      };
    }

    function findExistingPair(aId, bId) {
      let samePairCount = 0;
      let exactMatch = null;
      for (let i = 0; i < cords.length; i += 1) {
        const c = cords[i];
        if ((c.fromPoleId === aId && c.toPoleId === bId) || (c.fromPoleId === bId && c.toPoleId === aId)) {
          samePairCount += 1;
          exactMatch = c;
        }
      }
      return { count: samePairCount, cord: exactMatch };
    }

    function nextUnstretchedPair() {
      for (let k = 0; k < crossCorridorPairs.length; k += 1) {
        const cand = crossCorridorPairs[(weaveCursor + k) % crossCorridorPairs.length];
        if (findExistingPair(cand[0], cand[1]).count === 0) {
          weaveCursor = (weaveCursor + k + 1) % crossCorridorPairs.length;
          return cand;
        }
      }
      for (let i = 0; i < poles.length; i += 1) {
        for (let j = i + 4; j < poles.length; j += 1) {
          if (poles[i].houseIndex !== poles[j].houseIndex && findExistingPair(poles[i].poleId, poles[j].poleId).count === 0) {
            return [poles[i].poleId, poles[j].poleId];
          }
        }
      }
      return null;
    }

    let foundationComplexity = 0;
    let foundationRegularity = 0;

    function getCountsByType() {
      const counts = { blood: 0, trade: 0, authority: 0, agency: 0 };
      for (let i = 0; i < cords.length; i += 1) {
        counts[cords[i].type] = (counts[cords[i].type] || 0) + 1;
      }
      return counts;
    }

    function getSnapshot() {
      const countsByType = getCountsByType();
      const poleDegrees = {};
      const poleTypes = {};
      for (let i = 0; i < cords.length; i += 1) {
        const c = cords[i];
        poleDegrees[c.fromPoleId] = (poleDegrees[c.fromPoleId] || 0) + 1;
        poleDegrees[c.toPoleId] = (poleDegrees[c.toPoleId] || 0) + 1;
        if (!poleTypes[c.fromPoleId]) poleTypes[c.fromPoleId] = [];
        if (!poleTypes[c.toPoleId]) poleTypes[c.toPoleId] = [];
        if (poleTypes[c.fromPoleId].indexOf(c.type) < 0) poleTypes[c.fromPoleId].push(c.type);
        if (poleTypes[c.toPoleId].indexOf(c.type) < 0) poleTypes[c.toPoleId].push(c.type);
      }

      return {
        generation: generation,
        layoutMode: layoutMode,
        houseCount: houses.length,
        poleCount: poles.length,
        cordCount: cords.length,
        activeCordType: activeCordType,
        countsByType: countsByType,
        permeabilityRatio: permeabilityRatio,
        openCorridorCount: openCorridorCount,
        totalCorridorPairs: 6,
        impassable: impassable,
        complexityIndex: complexityIndex,
        regularityIndex: regularityIndex,
        pluckedCount: pluckedCount,
        audioMuted: audioMuted,
        camera: Object.assign({}, camera),
        houses: houses.map(function (h) { return Object.assign({}, h, { cornerPoleIds: h.cornerPoleIds.slice() }); }),
        poles: poles.map(function (p) {
          const topP = projectPoint(p.worldX, p.worldY, p.zTop);
          const baseP = projectPoint(p.worldX, p.worldY, 0);
          return Object.assign({}, p, {
            degree: poleDegrees[p.poleId] || 0,
            cordTypes: poleTypes[p.poleId] ? poleTypes[p.poleId].slice() : [],
            screenX: topP.x,
            screenY: topP.y,
            baseScreenX: baseP.x,
            baseScreenY: baseP.y
          });
        }),
        cords: cords.map(function (c) { return Object.assign({}, c); }),
        sampleOpenPath: sampleOpenPath.map(function (pt) { return Object.assign({}, pt); })
      };
    }

    function selectActiveCordType(idOrKeyOrIndex) {
      const entry = resolveCordType(idOrKeyOrIndex, activeCordType);
      activeCordType = entry.id;
      return entry;
    }

    function stretchCord(fromPoleId, toPoleId, cordTypeOptional) {
      let aId = fromPoleId;
      let bId = toPoleId;
      if (!aId || !bId) {
        const autoPair = nextUnstretchedPair();
        if (!autoPair) return { added: false, cord: null, snapshot: getSnapshot() };
        aId = autoPair[0];
        bId = autoPair[1];
      }
      const pA = polesById[aId];
      const pB = polesById[bId];
      if (!pA || !pB || pA.poleId === pB.poleId) {
        return { added: false, cord: null, snapshot: getSnapshot() };
      }
      const typeEntry = cordTypeOptional != null
        ? resolveCordType(cordTypeOptional, activeCordType)
        : CORD_TYPES.byId[activeCordType];

      for (let i = 0; i < cords.length; i += 1) {
        const ex = cords[i];
        const sameEnds = (ex.fromPoleId === pA.poleId && ex.toPoleId === pB.poleId) ||
                         (ex.fromPoleId === pB.poleId && ex.toPoleId === pA.poleId);
        if (sameEnds && ex.type === typeEntry.id) {
          ex.pluckAmp = reducedMotion ? 0.25 : 1.0;
          ex.pluckPhase = 0;
          pluckedCount += 1;
          pluckAudio.playPluck(ex, audioMuted);
          return { added: false, cord: ex, snapshot: getSnapshot() };
        }
      }

      const pairInfo = findExistingPair(pA.poleId, pB.poleId);
      const cord = makeCordObject(pA, pB, typeEntry, pairInfo.count * 0.014);
      cord.pluckAmp = reducedMotion ? 0.25 : 1.0;
      cord.pluckPhase = 0;
      cords.push(cord);
      pluckedCount += 1;
      pluckAudio.playPluck(cord, audioMuted);
      recomputePermeability();
      computeTopologyMetrics(false);
      return { added: true, cord: cord, snapshot: getSnapshot() };
    }

    function weaveBurst(count, preferredType) {
      const target = clamp(Math.trunc(Number(count) || 6), 1, 48);
      let addedCount = 0;
      let lastAdded = null;
      for (let k = 0; k < target; k += 1) {
        const pair = nextUnstretchedPair();
        if (!pair) break;
        const tEntry = preferredType != null
          ? resolveCordType(preferredType, activeCordType)
          : CORD_TYPES[(cords.length) % 4];
        const pA = polesById[pair[0]];
        const pB = polesById[pair[1]];
        if (!pA || !pB) continue;
        const c = makeCordObject(pA, pB, tEntry, 0);
        c.pluckAmp = reducedMotion ? 0.2 : 0.85;
        c.pluckPhase = (k * 0.7) % 6.28;
        cords.push(c);
        lastAdded = c;
        addedCount += 1;
        pluckedCount += 1;
        if (k < 2) pluckAudio.playPluck(c, audioMuted);
      }
      if (addedCount > 0 || lastAdded) {
        recomputePermeability();
        computeTopologyMetrics(false);
      }
      return getSnapshot();
    }

    function weaveToImpassable() {
      let guard = 0;
      let lastCord = null;
      while ((!impassable || permeabilityRatio > 0) && guard < 96) {
        const pair = nextUnstretchedPair();
        if (!pair) break;
        const tEntry = CORD_TYPES[cords.length % 4];
        const pA = polesById[pair[0]];
        const pB = polesById[pair[1]];
        if (pA && pB) {
          const c = makeCordObject(pA, pB, tEntry, 0);
          c.pluckAmp = reducedMotion ? 0.2 : 0.9;
          cords.push(c);
          lastCord = c;
          pluckedCount += 1;
          recomputePermeability();
        }
        guard += 1;
      }
      if (lastCord) pluckAudio.playPluck(lastCord, audioMuted);
      computeTopologyMetrics(false);
      return getSnapshot();
    }

    function pluckCordById(cordId) {
      for (let i = 0; i < cords.length; i += 1) {
        if (cords[i].id === cordId) {
          cords[i].pluckAmp = reducedMotion ? 0.3 : 1.0;
          cords[i].pluckPhase = 0;
          pluckedCount += 1;
          pluckAudio.playPluck(cords[i], audioMuted);
          return { plucked: true, cord: cords[i] };
        }
      }
      return { plucked: false, cord: null };
    }

    function pluckNearestCord(px, py, maxDistPx) {
      const limit = Number.isFinite(maxDistPx) ? maxDistPx : 28;
      let best = null;
      let bestDist = Infinity;
      for (let i = 0; i < cords.length; i += 1) {
        const c = cords[i];
        const p0 = projectPoint(c.ax, c.ay, c.az);
        const p1 = projectPoint(c.bx, c.by, c.bz);
        const pm = projectPoint((c.ax + c.bx) * 0.5, (c.ay + c.by) * 0.5, (c.az + c.bz) * 0.5 - 0.012 * c.length3D);
        const dA = pointToSegmentDist2D(px, py, p0.x, p0.y, pm.x, pm.y);
        const dB = pointToSegmentDist2D(px, py, pm.x, pm.y, p1.x, p1.y);
        const d = dA < dB ? dA : dB;
        if (d < bestDist) {
          bestDist = d;
          best = c;
        }
      }
      if (best && bestDist <= limit) {
        pluckCordById(best.id);
        return { plucked: true, cord: best, distancePx: Number(bestDist.toFixed(2)) };
      }
      return { plucked: false, cord: null, distancePx: Infinity };
    }

    function hitTestPole(px, py, maxDistPx) {
      const limit = Number.isFinite(maxDistPx) ? maxDistPx : 22;
      let best = null;
      let bestDist = Infinity;
      let bestTop = null;
      let bestBase = null;
      for (let i = 0; i < poles.length; i += 1) {
        const p = poles[i];
        const topP = projectPoint(p.worldX, p.worldY, p.zTop);
        const baseP = projectPoint(p.worldX, p.worldY, 0);
        const dShaft = pointToSegmentDist2D(px, py, baseP.x, baseP.y, topP.x, topP.y);
        const dTip = hypot2(px - topP.x, py - topP.y) * 0.85;
        const d = dTip < dShaft ? dTip : dShaft;
        if (d < bestDist) {
          bestDist = d;
          best = p;
          bestTop = topP;
          bestBase = baseP;
        }
      }
      if (best && bestDist <= limit) {
        return {
          id: best.id,
          poleId: best.poleId,
          houseIndex: best.houseIndex,
          houseId: best.houseId,
          cornerIndex: best.cornerIndex,
          worldX: best.worldX,
          worldY: best.worldY,
          zTop: best.zTop,
          anchorZ: best.anchorZ,
          screenX: bestTop.x,
          screenY: bestTop.y,
          baseScreenX: bestBase.x,
          baseScreenY: bestBase.y,
          distancePx: Number(bestDist.toFixed(2)),
          pole: best
        };
      }
      return null;
    }

    function setAudioMuted(flag) {
      audioMuted = Boolean(flag);
      return audioMuted;
    }

    function seedGenerationLayout(genSpec) {
      const spec = genSpec || {};
      if (foundationComplexity > 0) {
        prevFoundationComplexity = foundationComplexity;
        prevFoundationRegularity = foundationRegularity;
      }
      if (Number.isFinite(spec.generation) && spec.generation >= 1) {
        generation = Math.trunc(spec.generation);
      }
      genComplexityBoost = Number.isFinite(spec.complexityBoost) ? spec.complexityBoost : 0.14 * Math.max(0, generation - 1);
      genRegularityBoost = Number.isFinite(spec.regularityBoost) ? spec.regularityBoost : 0.16 * Math.max(0, generation - 1);

      const bp = buildGenerationBlueprint(generation, spec.layoutMode);
      layoutMode = bp.layoutMode;
      houses = bp.houses;
      poles = bp.poles;
      polesById = {};
      for (let i = 0; i < poles.length; i += 1) {
        polesById[poles[i].poleId] = poles[i];
      }
      crossCorridorPairs = bp.crossCorridorPairs;
      weaveCursor = 0;
      cords = [];
      for (let i = 0; i < bp.initialCords.length; i += 1) {
        const ic = bp.initialCords[i];
        const pA = polesById[ic[0]];
        const pB = polesById[ic[1]];
        const tEntry = resolveCordType(ic[2], "blood");
        if (pA && pB && pA.poleId !== pB.poleId) {
          cords.push(makeCordObject(pA, pB, tEntry, 0));
        }
      }
      recomputePermeability();
      computeTopologyMetrics(true);
      foundationComplexity = complexityIndex;
      foundationRegularity = regularityIndex;
      return getSnapshot();
    }

    function step(dtSec) {
      const dt = clamp(Number(dtSec) || 0.016, 0, 0.1);
      if (!reducedMotion) simTime += dt;
      const decay = reducedMotion ? Math.exp(-9.0 * dt) : Math.exp(-3.1 * dt);
      for (let i = 0; i < cords.length; i += 1) {
        const c = cords[i];
        if (c.pluckAmp > 0.002) {
          c.pluckAmp *= decay;
          c.pluckPhase += dt * (24 + (c.pitchHz || 300) * 0.048);
          if (c.pluckAmp <= 0.002) c.pluckAmp = 0;
        }
      }
    }

    function renderPlain(ctx, exodusState) {
      if (!ctx) return;
      const exo = exodusState || {};
      const w = viewportWidth;
      const h = viewportHeight;
      const dismantle = clamp(Number(exo.dismantleProgress) || 0, 0, 1);
      const wallAlpha = dismantle >= 0.999 ? 0 : clamp(1 - dismantle, 0, 1);
      const horizonY = h * 0.37;

      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, PALETTE.duskSkyDeep);
      skyGrad.addColorStop(0.58, "#352F42");
      skyGrad.addColorStop(1, PALETTE.duskHorizon);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, horizonY + 2);

      ctx.fillStyle = "rgba(244, 239, 228, 0.42)";
      for (let s = 0; s < 22; s += 1) {
        const sx = ((s * 173 + 41) % 997) / 997 * w;
        const sy = ((s * 97 + 19) % 419) / 419 * (horizonY * 0.68);
        ctx.fillRect(sx, sy, s % 3 === 0 ? 1.6 : 1.1, s % 3 === 0 ? 1.6 : 1.1);
      }

      ctx.beginPath();
      ctx.moveTo(0, horizonY + 2);
      ctx.lineTo(0, horizonY * 0.78);
      ctx.lineTo(w * 0.16, horizonY * 0.69);
      ctx.lineTo(w * 0.34, horizonY * 0.84);
      ctx.lineTo(w * 0.48, horizonY * 0.76);
      ctx.lineTo(w * 0.63, horizonY * 0.56);
      ctx.lineTo(w * 0.77, horizonY * 0.39);
      ctx.lineTo(w * 0.89, horizonY * 0.45);
      ctx.lineTo(w, horizonY * 0.31);
      ctx.lineTo(w, horizonY + 2);
      ctx.closePath();
      ctx.fillStyle = "#221A20";
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(w * 0.52, horizonY + 2);
      ctx.lineTo(w * 0.66, horizonY * 0.64);
      ctx.lineTo(w * 0.80, horizonY * 0.48);
      ctx.lineTo(w * 0.92, horizonY * 0.52);
      ctx.lineTo(w, horizonY * 0.40);
      ctx.lineTo(w, horizonY + 2);
      ctx.closePath();
      ctx.fillStyle = PALETTE.ochreShadow;
      ctx.fill();

      const plainGrad = ctx.createRadialGradient(w * 0.5, h * 0.61, h * 0.06, w * 0.5, h * 0.62, Math.max(w, h) * 0.62);
      plainGrad.addColorStop(0, PALETTE.ochrePlain);
      plainGrad.addColorStop(0.62, "#6E4E31");
      plainGrad.addColorStop(1, PALETTE.ochreShadow);
      ctx.fillStyle = plainGrad;
      ctx.fillRect(0, horizonY, w, h - horizonY);

      ctx.strokeStyle = "rgba(42, 30, 21, 0.36)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let k = 0; k <= 24; k += 1) {
        const ang = (k / 24) * Math.PI * 2;
        const ep = projectPoint(Math.cos(ang) * 0.76, Math.sin(ang) * 0.76, 0);
        if (k === 0) ctx.moveTo(ep.x, ep.y);
        else ctx.lineTo(ep.x, ep.y);
      }
      ctx.stroke();

      const gateCoords = [[0, 0.84], [0, -0.84], [-0.84, 0], [0.84, 0]];
      for (let g = 0; g < gateCoords.length; g += 1) {
        const gp = projectPoint(gateCoords[g][0], gateCoords[g][1], 0.01);
        ctx.fillStyle = impassable ? "rgba(168, 75, 49, 0.55)" : "rgba(244, 239, 228, 0.45)";
        ctx.beginPath();
        ctx.arc(gp.x, gp.y, 3.6, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!impassable && sampleOpenPath.length > 1) {
        ctx.fillStyle = "rgba(244, 239, 228, 0.42)";
        for (let i = 0; i < sampleOpenPath.length; i += 1) {
          const wp = projectPoint(sampleOpenPath[i].x, sampleOpenPath[i].y, 0.004);
          ctx.beginPath();
          ctx.arc(wp.x, wp.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.strokeStyle = "rgba(22, 21, 25, 0.22)";
      ctx.lineWidth = 1.1;
      for (let i = 0; i < cords.length; i += 1) {
        const sc = cords[i];
        const sa = projectPoint(sc.ax, sc.ay, 0);
        const sb = projectPoint(sc.bx, sc.by, 0);
        ctx.beginPath();
        ctx.moveTo(sa.x, sa.y);
        ctx.lineTo(sb.x, sb.y);
        ctx.stroke();
      }

      const items = [];
      for (let hIdx = 0; hIdx < houses.length; hIdx += 1) {
        const hs = houses[hIdx];
        const hc = projectPoint(hs.cx, hs.cy, hs.eaveZ * 0.5);
        if (wallAlpha > 0) items.push({ kind: "house", depth: hc.depth + 0.02, house: hs });
        items.push({ kind: "filament", depth: hc.depth - 0.005, house: hs });
      }
      for (let pIdx = 0; pIdx < poles.length; pIdx += 1) {
        const pl = poles[pIdx];
        const pc = projectPoint(pl.worldX, pl.worldY, pl.zTop * 0.5);
        items.push({ kind: "pole", depth: pc.depth, pole: pl });
      }
      for (let cIdx = 0; cIdx < cords.length; cIdx += 1) {
        const cd = cords[cIdx];
        const cc = projectPoint((cd.ax + cd.bx) * 0.5, (cd.ay + cd.by) * 0.5, (cd.az + cd.bz) * 0.5);
        items.push({ kind: "cord", depth: cc.depth - 0.015, cord: cd });
      }
      items.sort(function (a, b) { return b.depth - a.depth; });

      for (let it = 0; it < items.length; it += 1) {
        const entry = items[it];
        if (entry.kind === "house" && wallAlpha > 0) {
          const hs = entry.house;
          const cp = hs.cornerPoleIds.map(function (id) { return polesById[id]; });
          const drop = hs.eaveZ * wallAlpha;
          const rTop = hs.eaveZ + (hs.ridgeZ - hs.eaveZ) * wallAlpha;
          const bPts = cp.map(function (p) { return projectPoint(p.worldX, p.worldY, 0); });
          const ePts = cp.map(function (p) { return projectPoint(p.worldX, p.worldY, drop); });
          const r0 = projectPoint((cp[0].worldX + cp[3].worldX) * 0.5, (cp[0].worldY + cp[3].worldY) * 0.5, rTop);
          const r1 = projectPoint((cp[1].worldX + cp[2].worldX) * 0.5, (cp[1].worldY + cp[2].worldY) * 0.5, rTop);

          ctx.save();
          ctx.globalAlpha = wallAlpha;
          const faces = [
            { pts: [bPts[0], bPts[1], ePts[1], ePts[0]], col: PALETTE.limeWall, d: (bPts[0].depth + bPts[1].depth) * 0.5 },
            { pts: [bPts[1], bPts[2], ePts[2], ePts[1]], col: "#C4B69E", d: (bPts[1].depth + bPts[2].depth) * 0.5 },
            { pts: [bPts[2], bPts[3], ePts[3], ePts[2]], col: PALETTE.limeWall, d: (bPts[2].depth + bPts[3].depth) * 0.5 },
            { pts: [bPts[3], bPts[0], ePts[0], ePts[3]], col: "#B8AA92", d: (bPts[3].depth + bPts[0].depth) * 0.5 },
            { pts: [ePts[0], ePts[1], r1, r0], col: PALETTE.terracottaRoof, d: (ePts[0].depth + r0.depth) * 0.5 - 0.01 },
            { pts: [ePts[2], ePts[3], r0, r1], col: "#8C3B24", d: (ePts[2].depth + r1.depth) * 0.5 - 0.01 },
            { pts: [ePts[0], ePts[3], r0], col: "#CFC2AC", d: r0.depth - 0.005 },
            { pts: [ePts[1], ePts[2], r1], col: "#C2B49D", d: r1.depth - 0.005 }
          ];
          faces.sort(function (a, b) { return b.d - a.d; });
          ctx.strokeStyle = "rgba(42, 30, 21, 0.35)";
          ctx.lineWidth = 0.8;
          for (let f = 0; f < faces.length; f += 1) {
            const pts = faces[f].pts;
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let q = 1; q < pts.length; q += 1) ctx.lineTo(pts[q].x, pts[q].y);
            ctx.closePath();
            ctx.fillStyle = faces[f].col;
            ctx.fill();
            ctx.stroke();
          }
          ctx.restore();
        } else if (entry.kind === "filament") {
          const hs = entry.house;
          const cp = hs.cornerPoleIds.map(function (id) { return polesById[id]; });
          const tPts = cp.map(function (p) { return projectPoint(p.worldX, p.worldY, p.anchorZ); });
          const g0 = projectPoint((cp[0].worldX + cp[3].worldX) * 0.5, (cp[0].worldY + cp[3].worldY) * 0.5, hs.ridgeZ);
          const g1 = projectPoint((cp[1].worldX + cp[2].worldX) * 0.5, (cp[1].worldY + cp[2].worldY) * 0.5, hs.ridgeZ);
          ctx.strokeStyle = "rgba(244, 239, 228, " + (0.14 + 0.28 * dismantle).toFixed(3) + ")";
          ctx.lineWidth = 0.75;
          ctx.beginPath();
          ctx.moveTo(tPts[0].x, tPts[0].y);
          ctx.lineTo(tPts[1].x, tPts[1].y);
          ctx.lineTo(tPts[2].x, tPts[2].y);
          ctx.lineTo(tPts[3].x, tPts[3].y);
          ctx.closePath();
          ctx.moveTo(tPts[0].x, tPts[0].y); ctx.lineTo(g0.x, g0.y); ctx.lineTo(tPts[3].x, tPts[3].y);
          ctx.moveTo(tPts[1].x, tPts[1].y); ctx.lineTo(g1.x, g1.y); ctx.lineTo(tPts[2].x, tPts[2].y);
          ctx.moveTo(g0.x, g0.y); ctx.lineTo(g1.x, g1.y);
          ctx.stroke();
        } else if (entry.kind === "pole") {
          const pl = entry.pole;
          const bp = projectPoint(pl.worldX, pl.worldY, 0);
          const tp = projectPoint(pl.worldX, pl.worldY, pl.zTop);
          ctx.strokeStyle = PALETTE.timberPole;
          ctx.lineWidth = 3.1;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(bp.x, bp.y);
          ctx.lineTo(tp.x, tp.y);
          ctx.stroke();
          ctx.fillStyle = "#8C6544";
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, 1.9, 0, Math.PI * 2);
          ctx.fill();
        } else if (entry.kind === "cord") {
          const cd = entry.cord;
          const segs = cd.braided ? 18 : 12;
          const windAmp = reducedMotion ? 0 : Math.sin(simTime * 1.9 + cd.shimmerSeed) * 0.9;
          const vibAmp = cd.pluckAmp * Math.sin(cd.pluckPhase) * 7.2 + windAmp;
          const pts = [];
          for (let s = 0; s <= segs; s += 1) {
            const t = s / segs;
            const env = Math.sin(Math.PI * t);
            const sagZ = -0.011 * cd.length3D * env;
            const pr = projectPoint(cd.ax + (cd.bx - cd.ax) * t, cd.ay + (cd.by - cd.ay) * t, cd.az + (cd.bz - cd.az) * t + sagZ);
            pts.push({ x: pr.x + vibAmp * env * 0.35, y: pr.y - vibAmp * env });
          }
          if (cd.braided) {
            ctx.lineWidth = 2.5;
            for (let s = 0; s < segs; s += 1) {
              ctx.strokeStyle = s % 2 === 0 ? cd.stroke : cd.secondaryStroke;
              ctx.beginPath();
              ctx.moveTo(pts[s].x, pts[s].y);
              ctx.lineTo(pts[s + 1].x, pts[s + 1].y);
              ctx.stroke();
            }
          } else {
            if (cd.type === "trade") {
              ctx.strokeStyle = "rgba(216, 203, 181, 0.24)";
              ctx.lineWidth = 3.2;
              ctx.beginPath();
              ctx.moveTo(pts[0].x, pts[0].y);
              for (let s = 1; s <= segs; s += 1) ctx.lineTo(pts[s].x, pts[s].y);
              ctx.stroke();
            }
            ctx.strokeStyle = cd.stroke;
            ctx.lineWidth = cd.pluckAmp > 0.05 ? 2.5 : 1.95;
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let s = 1; s <= segs; s += 1) ctx.lineTo(pts[s].x, pts[s].y);
            ctx.stroke();
          }
        }
      }
    }

    seedGenerationLayout({ generation: generation });

    return {
      setViewport: setViewport,
      setCamera: setCamera,
      orbitCamera: orbitCamera,
      projectPoint: projectPoint,
      recomputePermeability: recomputePermeability,
      computeTopologyMetrics: computeTopologyMetrics,
      selectActiveCordType: selectActiveCordType,
      stretchCord: stretchCord,
      weaveBurst: weaveBurst,
      weaveToImpassable: weaveToImpassable,
      pluckCordById: pluckCordById,
      pluckNearestCord: pluckNearestCord,
      hitTestPole: hitTestPole,
      setAudioMuted: setAudioMuted,
      seedGenerationLayout: seedGenerationLayout,
      step: step,
      getSnapshot: getSnapshot,
      renderPlain: renderPlain
    };
  }

  const api = Object.freeze({
    PALETTE: PALETTE,
    CANONICAL_STONES: CANONICAL_STONES,
    CORD_TYPES: CORD_TYPES,
    LAYOUT_MODES: LAYOUT_MODES,
    createCordLoom: createCordLoom
  });

  root.ErsiliaFourCordRelations = api;
  if (typeof window !== "undefined") {
    window.ErsiliaFourCordRelations = api;
  }
  if (typeof module === "object" && module && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
