(function (root) {
  "use strict";

  /* Zenobia (Thin Cities 2) — Multi-Altitude Bamboo & Oxidized-Zinc Stilted Trusswork */

  const PALETTE = Object.freeze({
    mesa_obsidian_umber: "#19110B",
    dry_ochre_terracotta: "#C47A45",
    baked_mesa_sienna: "#8F512B",
    bamboo_culm_gold: "#D6B162",
    bamboo_node_amber: "#9F7833",
    oxidized_zinc_slate: "#6E858E",
    weathered_zinc_mist: "#A9BEC5",
    silk_ribbon_vermilion: "#D8524B",
    silk_ribbon_saffron: "#E5A33B",
    plateau_parchment: "#F3EAD6"
  });

  const CANONICAL_STONES = Object.freeze([
    Object.freeze({
      id: "dry_terrain_pilings",
      label: "High Pilings Above Dry Terrain",
      causal_role: "Zenobia stands on very high pilings of varying heights over cracked, dry ochre mesa ground with zero marsh, tide, or floodwater below."
    }),
    Object.freeze({
      id: "bamboo_and_zinc_houses",
      label: "Houses of Bamboo and Oxidized Zinc",
      causal_role: "Light superstructures framed in golden split bamboo and corrugated oxidized-zinc sheets perched upon multi-tier stilts."
    }),
    Object.freeze({
      id: "crossing_platforms_and_balconies",
      label: "Platforms and Balconies Crossing on Stilts",
      causal_role: "Cantilevered decks and balconies at staggered altitudes overstepping and crossing one another in open sky."
    }),
    Object.freeze({
      id: "ladders_and_hanging_sidewalks",
      label: "Ladders and Swaying Hanging Sidewalks",
      causal_role: "Vertical bamboo rung-ladders and catenary rope-and-plank catwalks linking stilted platforms across airy chasms."
    }),
    Object.freeze({
      id: "cone_roofed_belvederes",
      label: "Cone-Roofed Belvederes",
      causal_role: "Conical zinc-and-bamboo belvedere pavilions crowning the highest stilts as windward lookouts."
    }),
    Object.freeze({
      id: "water_storage_barrels",
      label: "Elevated Barrels of Water Storage",
      causal_role: "Hooped timber-and-zinc cistern barrels hoisted onto upper platforms to hold precious water high above the arid plateau."
    }),
    Object.freeze({
      id: "pulleys_fish_poles_and_cranes",
      label: "Pulleys, Fish Poles, and Projecting Cranes",
      causal_role: "Rigged sheave pulleys, jib cranes, and long cantilevered bamboo fishing poles casting lines and baskets into dry air."
    }),
    Object.freeze({
      id: "weathervanes_and_ribbons",
      label: "Spinning Weathervanes and Fluttering Ribbons",
      causal_role: "Finial zinc weathervanes and silk ribbons streaming horizontally in the high plateau wind."
    }),
    Object.freeze({
      id: "forgotten_founding_motive",
      label: "Unremembered Motive of the Founders",
      causal_role: "Probing the baked mesa post-sockets reveals dry dust and zero flood-history; nobody remembers why the founders raised Zenobia on stilts."
    }),
    Object.freeze({
      id: "happy_life_desire_recombination",
      label: "Happy-Life Recombination & Desire-Form Taxonomy",
      causal_role: "Asked to imagine a happy life, any inhabitant or visitor inevitably recombines Zenobia's pilings, stairways, and hanging balconies—placing Zenobia among cities that give form to desires rather than cities erased by them."
    })
  ]);

  const CLUSTER_BLUEPRINTS = [
    { index: 0, name: "Westward Wind-Stilt", xNorm: 0.10, baseElev: 18, legs: 3, widthM: 6.4, belvedere: false, barrels: 1, crane: false, fishPole: 1, houseStyle: "split_bamboo", postDepth: 4.4 },
    { index: 1, name: "Saffron Cistern Perch", xNorm: 0.21, baseElev: 31, legs: 4, widthM: 7.4, belvedere: true, barrels: 2, crane: true, fishPole: 0, houseStyle: "zinc_gable", postDepth: 5.6 },
    { index: 2, name: "Cantilevered Reed Roost", xNorm: 0.33, baseElev: 22, legs: 3, widthM: 6.8, belvedere: false, barrels: 1, crane: false, fishPole: 1, houseStyle: "bamboo_veranda", postDepth: 4.8 },
    { index: 3, name: "High Zenith Belvedere", xNorm: 0.44, baseElev: 41, legs: 4, widthM: 8.0, belvedere: true, barrels: 2, crane: true, fishPole: 1, houseStyle: "twin_pavilion", postDepth: 6.5 },
    { index: 4, name: "Twin-Culm Joinery", xNorm: 0.56, baseElev: 26, legs: 3, widthM: 7.0, belvedere: false, barrels: 1, crane: true, fishPole: 1, houseStyle: "zinc_shed", postDepth: 5.1 },
    { index: 5, name: "Grand Spire Truss", xNorm: 0.68, baseElev: 45, legs: 4, widthM: 8.2, belvedere: true, barrels: 2, crane: true, fishPole: 1, houseStyle: "tiered_zinc", postDepth: 6.9 },
    { index: 6, name: "Lantern Balcony Deck", xNorm: 0.79, baseElev: 16, legs: 3, widthM: 6.2, belvedere: false, barrels: 1, crane: false, fishPole: 1, houseStyle: "split_bamboo", postDepth: 4.1 },
    { index: 7, name: "East Scarp Lookout", xNorm: 0.90, baseElev: 34, legs: 4, widthM: 7.2, belvedere: true, barrels: 1, crane: true, fishPole: 0, houseStyle: "zinc_gable", postDepth: 5.9 }
  ];

  const INITIAL_CATWALKS = [
    [0, 1, 0.84], [1, 2, 0.76], [1, 3, 0.92],
    [2, 4, 0.74], [3, 4, 0.86], [3, 5, 0.93],
    [4, 6, 0.78], [5, 6, 0.82], [5, 7, 0.90], [6, 7, 0.79]
  ];

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function makeRng(seed) {
    let s = (seed >>> 0) || 14021972;
    return function next() {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function createAudioEngine(initialMuted) {
    let muted = Boolean(initialMuted);
    let ctx = null;
    let noiseBuf = null;

    function ensureCtx() {
      if (muted) return null;
      const AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      if (!ctx) {
        try { ctx = new AC(); } catch (_e) { return null; }
      }
      if (ctx.state === "suspended") {
        try { ctx.resume(); } catch (_e) { /* unlocked on gesture */ }
      }
      if (!noiseBuf && ctx) {
        noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 1.2), ctx.sampleRate);
        const data = noiseBuf.getChannelData(0);
        let r = makeRng(9014);
        for (let i = 0; i < data.length; i++) data[i] = r() * 2 - 1;
      }
      return ctx;
    }

    function play(kind, strength) {
      const ac = ensureCtx();
      if (!ac) return false;
      const now = ac.currentTime;
      const amp = clamp(Number(strength) || 1, 0.25, 1.8);
      try {
        if (kind === "wind" || kind === "wind_gust") {
          const src = ac.createBufferSource();
          src.buffer = noiseBuf;
          const bp = ac.createBiquadFilter();
          bp.type = "bandpass";
          bp.Q.value = 3.2;
          bp.frequency.setValueAtTime(380, now);
          bp.frequency.exponentialRampToValueAtTime(860 * Math.min(1.4, amp), now + 0.35);
          bp.frequency.exponentialRampToValueAtTime(320, now + 0.95);
          const g = ac.createGain();
          g.gain.setValueAtTime(0.001, now);
          g.gain.linearRampToValueAtTime(0.055 * amp, now + 0.18);
          g.gain.exponentialRampToValueAtTime(0.0008, now + 0.98);
          src.connect(bp); bp.connect(g); g.connect(ac.destination);
          src.start(now); src.stop(now + 1.0);
        } else if (kind === "bamboo_creak" || kind === "creak") {
          for (let i = 0; i < 3; i++) {
            const t0 = now + i * 0.055;
            const osc = ac.createOscillator();
            osc.type = "triangle";
            osc.frequency.setValueAtTime(165 + i * 38, t0);
            osc.frequency.exponentialRampToValueAtTime(118 + i * 22, t0 + 0.075);
            const g = ac.createGain();
            g.gain.setValueAtTime(0.045 * amp, t0);
            g.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.08);
            osc.connect(g); g.connect(ac.destination);
            osc.start(t0); osc.stop(t0 + 0.085);
          }
        } else if (kind === "vane_tick" || kind === "vane") {
          const osc = ac.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(2480, now);
          osc.frequency.exponentialRampToValueAtTime(3620, now + 0.04);
          const g = ac.createGain();
          g.gain.setValueAtTime(0.032 * amp, now);
          g.gain.exponentialRampToValueAtTime(0.0006, now + 0.055);
          osc.connect(g); g.connect(ac.destination);
          osc.start(now); osc.stop(now + 0.06);
        } else if (kind === "pulley_ratchet" || kind === "pulley") {
          for (let i = 0; i < 4; i++) {
            const t0 = now + i * 0.048;
            const osc = ac.createOscillator();
            osc.type = "square";
            osc.frequency.setValueAtTime(520 + i * 95, t0);
            const g = ac.createGain();
            g.gain.setValueAtTime(0.024 * amp, t0);
            g.gain.exponentialRampToValueAtTime(0.0007, t0 + 0.035);
            osc.connect(g); g.connect(ac.destination);
            osc.start(t0); osc.stop(t0 + 0.04);
          }
        } else if (kind === "footing_knock" || kind === "footing") {
          const osc = ac.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(108, now);
          osc.frequency.exponentialRampToValueAtTime(48, now + 0.11);
          const g = ac.createGain();
          g.gain.setValueAtTime(0.075 * amp, now);
          g.gain.exponentialRampToValueAtTime(0.0008, now + 0.13);
          osc.connect(g); g.connect(ac.destination);
          osc.start(now); osc.stop(now + 0.14);
        } else {
          const notes = kind === "sublimate" ? [392, 493.88, 587.33, 783.99] : [440, 587.33, 659.25];
          notes.forEach(function (freq, idx) {
            const t0 = now + idx * 0.052;
            const osc = ac.createOscillator();
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, t0);
            const g = ac.createGain();
            g.gain.setValueAtTime(0.038 * amp, t0);
            g.gain.exponentialRampToValueAtTime(0.0007, t0 + 0.28);
            osc.connect(g); g.connect(ac.destination);
            osc.start(t0); osc.stop(t0 + 0.3);
          });
        }
        return true;
      } catch (_err) {
        return false;
      }
    }

    return {
      play: play,
      setMuted: function (m) { muted = Boolean(m); return muted; },
      toggleMute: function () { muted = !muted; if (!muted) ensureCtx(); return muted; },
      isMuted: function () { return muted; },
      unlock: ensureCtx,
      destroy: function () {
        if (ctx && typeof ctx.close === "function") {
          try { ctx.close(); } catch (_e) { /* ignore */ }
        }
        ctx = null;
      }
    };
  }

  function createTrusswork(opts) {
    const cfg = opts || {};
    let width = Math.max(240, Number(cfg.width) || 1280);
    let height = Math.max(240, Number(cfg.height) || 800);
    let dpr = Math.max(1, Number(cfg.dpr) || 1);
    const boundCanvas = cfg.canvas || null;

    let reducedMotion = Boolean(cfg.reducedMotion);
    if (cfg.reducedMotion === undefined && root.matchMedia) {
      try {
        reducedMotion = Boolean(root.matchMedia("(prefers-reduced-motion: reduce)").matches);
      } catch (_e) { /* ignore */ }
    }

    const audio = createAudioEngine(Boolean(cfg.muted));
    const seedBase = Number(cfg.seed) || 14021972;

    let timeSec = 0;
    let windSpeed = 1.0;
    let gustStrength = 0;
    let hoistAnim = 0;
    let vanePhase = 0;
    let elevateCursor = 0;
    let catwalkCursor = 0;
    let probeCursor = 0;
    let permutationGeneration = 0;
    let flatAttemptSublimated = false;
    let sublimatedFlatAttempts = 0;
    let flatGhostTimer = 0;
    let footingProbesCount = 0;
    let lastInspected = null;
    let lastFootingProbe = null;

    let clusters = [];
    let catwalks = [];
    let mesaCracks = [];
    let dustMotes = [];
    let geom = { mesaY: Math.round(height * 0.84), hitNodes: [], clusters: [], catwalks: [] };

    const unlockHandler = function () { audio.unlock(); };
    if (root.document && root.document.addEventListener) {
      root.document.addEventListener("pointerdown", unlockHandler, { passive: true });
      root.document.addEventListener("keydown", unlockHandler, { passive: true });
    }

    function initWorld() {
      const rng = makeRng(seedBase);
      timeSec = 0;
      windSpeed = 1.0;
      gustStrength = 0;
      hoistAnim = 0;
      vanePhase = 0.6;
      elevateCursor = 0;
      catwalkCursor = 0;
      probeCursor = 0;
      permutationGeneration = 0;
      flatAttemptSublimated = false;
      sublimatedFlatAttempts = 0;
      flatGhostTimer = 0;
      footingProbesCount = 0;
      lastInspected = null;
      lastFootingProbe = null;

      clusters = CLUSTER_BLUEPRINTS.map(function (bp, idx) {
        const high = bp.baseElev >= 30;
        return {
          index: bp.index,
          name: bp.name,
          xNorm: bp.xNorm,
          baselineMeters: bp.baseElev,
          elevationMeters: bp.baseElev,
          animOffsetMeters: 0,
          legs: bp.legs,
          widthMeters: bp.widthM,
          tierFracs: high ? [0.46, 0.72] : [0.56],
          cantileverLeftM: 3.4 + (idx % 3) * 1.4,
          cantileverRightM: 3.8 + ((idx + 1) % 3) * 1.3,
          hasBelvedere: bp.belvedere,
          barrelCount: bp.barrels,
          hasCrane: bp.crane,
          pulleyDropFrac: 0.24 + (idx % 3) * 0.07,
          fishPoleCount: bp.fishPole,
          fishPoleDir: idx < 4 ? -1 : 1,
          hasWeathervane: bp.belvedere || idx === 2 || idx === 4,
          ribbonCount: bp.belvedere ? 3 : 2,
          ladderCount: high ? 3 : 2,
          houseStyle: bp.houseStyle,
          postDepthMeters: bp.postDepth,
          swaySeed: rng() * Math.PI * 2
        };
      });

      catwalks = INITIAL_CATWALKS.map(function (pair, i) {
        return {
          id: "catwalk_" + i,
          fromIdx: pair[0],
          toIdx: pair[1],
          tierFrac: pair[2],
          sagMeters: 1.8 + Math.abs(pair[1] - pair[0]) * 0.85,
          phase: i * 0.73
        };
      });

      mesaCracks = [];
      for (let i = 0; i < 26; i++) {
        const x0 = 0.03 + (i / 25) * 0.94 + (rng() - 0.5) * 0.02;
        mesaCracks.push({
          xNorm: clamp(x0, 0.02, 0.98),
          dx1: (rng() - 0.5) * 0.045,
          dy1: 0.28 + rng() * 0.25,
          dx2: (rng() - 0.5) * 0.06,
          dy2: 0.58 + rng() * 0.36,
          branchX: (rng() - 0.5) * 0.035
        });
      }

      dustMotes = [];
      for (let i = 0; i < 34; i++) {
        dustMotes.push({
          xNorm: rng(),
          hFrac: rng() * 0.14,
          size: 1.0 + rng() * 1.8,
          speed: 0.012 + rng() * 0.024,
          alpha: 0.16 + rng() * 0.26
        });
      }

      rebuildGeometry();
    }

    function countCrossingCatwalks() {
      let crossings = 0;
      for (let i = 0; i < catwalks.length; i++) {
        const a = catwalks[i];
        const aLo = Math.min(a.fromIdx, a.toIdx);
        const aHi = Math.max(a.fromIdx, a.toIdx);
        for (let j = i + 1; j < catwalks.length; j++) {
          const b = catwalks[j];
          const bLo = Math.min(b.fromIdx, b.toIdx);
          const bHi = Math.max(b.fromIdx, b.toIdx);
          const overlap = Math.max(aLo, bLo) < Math.min(aHi, bHi);
          if (overlap && Math.abs(a.tierFrac - b.tierFrac) > 0.03) crossings++;
        }
      }
      return crossings;
    }

    function rebuildGeometry() {
      const mesaY = Math.round(height * 0.84);
      const topPad = Math.max(46, Math.round(height * 0.085));
      let maxElev = 46;
      for (let i = 0; i < clusters.length; i++) {
        const eff = clusters[i].elevationMeters + clusters[i].animOffsetMeters;
        if (eff > maxElev) maxElev = eff;
      }
      const scaleCeilingM = Math.max(62, maxElev + 14);
      const pxPerM = (mesaY - topPad) / scaleCeilingM;
      const horizScale = clamp(width / 1100, 0.42, 1.22);
      const hitNodes = [];

      const cGeoms = clusters.map(function (c) {
        const effElevM = Math.max(12, c.elevationMeters + c.animOffsetMeters);
        const swayAmp = reducedMotion ? 0 : (1.1 + windSpeed * 1.4 + gustStrength * 3.2) * (effElevM / 34);
        const swayPx = reducedMotion ? 0 : Math.sin(timeSec * 1.35 + c.swaySeed) * swayAmp;
        const baseX = c.xNorm * width;
        const deckX = baseX + swayPx;
        const deckY = mesaY - effElevM * pxPerM;
        const halfW = Math.max(15, (c.widthMeters * pxPerM * 0.52) * horizScale);
        const houseW = halfW * 1.62;
        const houseH = Math.max(18, Math.min(38, 7.6 * pxPerM));
        const roofPeakY = deckY - houseH - (c.hasBelvedere ? Math.max(24, 6.8 * pxPerM) : Math.max(9, 2.5 * pxPerM));

        /* Register inspectable stones for this cluster */
        hitNodes.push({
          id: "piling_" + c.index, stoneId: "dry_terrain_pilings", kind: "piling_shaft",
          label: c.name + " Seasoned Pilings", x: baseX, y: mesaY - 8, x2: deckX, y2: deckY,
          radius: 38, priority: 2, altitudeMeters: Number((effElevM * 0.5).toFixed(1)),
          material: "Seasoned ironwood-bamboo culms & rope cross-bracing",
          note: "High pilings (" + effElevM.toFixed(1) + "m) braced over parched ochre clay with zero water below.",
          clusterIdx: c.index
        });
        hitNodes.push({
          id: "socket_" + c.index, stoneId: "forgotten_founding_motive", kind: "mesa_footing",
          label: c.name + " Dry Post-Socket", x: baseX, y: mesaY + 8,
          radius: 42, priority: 5, altitudeMeters: 0,
          material: "Baked ochre-sienna clay & dry timber shoe",
          note: "Dry clay dust (" + c.postDepthMeters.toFixed(1) + "m deep), zero flood-marks; nobody remembers why the founders built on stilts.",
          clusterIdx: c.index
        });
        hitNodes.push({
          id: "house_" + c.index, stoneId: "bamboo_and_zinc_houses", kind: "bamboo_zinc_house",
          label: c.name + " Bamboo & Zinc House", x: deckX, y: deckY - houseH * 0.55,
          radius: 40, priority: 6, altitudeMeters: Number(effElevM.toFixed(1)),
          material: "Split golden bamboo lattice & corrugated oxidized zinc",
          note: "Light pavilion framed in woven bamboo and patinated zinc sheets perched at " + effElevM.toFixed(1) + "m.",
          clusterIdx: c.index
        });

        c.tierFracs.forEach(function (tf, ti) {
          const ty = mesaY - effElevM * tf * pxPerM;
          const balX = baseX + swayPx * tf + (ti % 2 === 0 ? -halfW * 1.45 : halfW * 1.45);
          hitNodes.push({
            id: "balcony_" + c.index + "_" + ti, stoneId: "crossing_platforms_and_balconies", kind: "crossing_balcony",
            label: c.name + " Cantilevered Balcony", x: balX, y: ty,
            radius: 38, priority: 7, altitudeMeters: Number((effElevM * tf).toFixed(1)),
            material: "Cantilevered timber joists & split-bamboo balustrade",
            note: "Staggered balcony jutting into thin air to overstep neighboring stilt decks.",
            clusterIdx: c.index
          });
        });

        hitNodes.push({
          id: "ladder_" + c.index, stoneId: "ladders_and_hanging_sidewalks", kind: "bamboo_ladder",
          label: c.name + " Rung Ladder", x: deckX - halfW * 0.75, y: deckY + Math.min(42, effElevM * 0.28 * pxPerM),
          radius: 36, priority: 6, altitudeMeters: Number((effElevM * 0.78).toFixed(1)),
          material: "Bound bamboo side-rails & lashed hardwood rungs",
          note: "Steep bamboo rung-ladder linking lower cantilevered landings to the upper deck.",
          clusterIdx: c.index
        });

        if (c.barrelCount > 0) {
          hitNodes.push({
            id: "barrel_" + c.index, stoneId: "water_storage_barrels", kind: "water_barrel",
            label: c.name + " Hoisted Cistern Barrels (" + c.barrelCount + ")",
            x: deckX + halfW * 0.92, y: deckY - 7,
            radius: 38, priority: 8, altitudeMeters: Number(effElevM.toFixed(1)),
            material: "Hooped cedar staves & oxidized-zinc bands",
            note: "All water in Zenobia is hoisted aloft into strapped platform barrels above the dry plateau.",
            clusterIdx: c.index
          });
        }

        if (c.hasBelvedere) {
          hitNodes.push({
            id: "belvedere_" + c.index, stoneId: "cone_roofed_belvederes", kind: "cone_belvedere",
            label: c.name + " Cone-Roofed Belvedere", x: deckX, y: deckY - houseH - 14,
            radius: 40, priority: 9, altitudeMeters: Number((effElevM + 5.5).toFixed(1)),
            material: "Conical oxidized-zinc roof over open bamboo colonnade",
            note: "High conical belvedere lookout crowning the stilt cluster in the plateau wind.",
            clusterIdx: c.index
          });
        }

        if (c.hasCrane || c.fishPoleCount > 0) {
          const jibDir = c.index % 2 === 0 ? -1 : 1;
          const rigX = deckX + jibDir * (halfW + 18 * horizScale);
          const rigY = deckY - houseH * 0.4 + 10;
          hitNodes.push({
            id: "rig_" + c.index, stoneId: "pulleys_fish_poles_and_cranes",
            kind: c.hasCrane ? "pulley_crane" : "fish_pole",
            label: c.name + (c.hasCrane ? " Jib Crane & Pulley" : " Air-Casting Fish Pole"),
            x: rigX, y: rigY, radius: 40, priority: 8, altitudeMeters: Number((effElevM - 1.5).toFixed(1)),
            material: "Whip-bamboo pole, iron sheave pulley & braided hemp line",
            note: "Projecting crane sheave and bamboo fishing pole casting lines and baskets into empty dry air.",
            clusterIdx: c.index
          });
        }

        if (c.hasWeathervane || c.ribbonCount > 0) {
          hitNodes.push({
            id: "vane_" + c.index, stoneId: "weathervanes_and_ribbons", kind: "weathervane_ribbon",
            label: c.name + " Zinc Weathervane & Silk Ribbons", x: deckX + 10, y: roofPeakY - 6,
            radius: 40, priority: 9, altitudeMeters: Number((effElevM + 7.2).toFixed(1)),
            material: "Finial oxidized zinc & vermilion-saffron silk streamers",
            note: "Spinning finial weathervane and bright silk ribbons streaming in the dry plateau wind.",
            clusterIdx: c.index
          });
        }

        return {
          cluster: c, effElevM: effElevM, baseX: baseX, deckX: deckX, deckY: deckY,
          swayPx: swayPx, halfW: halfW, houseW: houseW, houseH: houseH, roofPeakY: roofPeakY
        };
      });

      const cwGeoms = catwalks.map(function (cw) {
        const a = cGeoms[cw.fromIdx];
        const b = cGeoms[cw.toIdx];
        if (!a || !b) return null;
        const tf = clamp(cw.tierFrac, 0.45, 0.98);
        const x1 = a.baseX + a.swayPx * tf;
        const y1 = mesaY - a.effElevM * tf * pxPerM;
        const x2 = b.baseX + b.swayPx * tf;
        const y2 = mesaY - b.effElevM * tf * pxPerM;
        const swayMid = reducedMotion ? 0 : Math.sin(timeSec * 1.9 + cw.phase) * (1.8 + windSpeed * 1.6 + gustStrength * 3.8);
        const sagPx = cw.sagMeters * pxPerM + swayMid * 0.35;
        const mx = (x1 + x2) * 0.5;
        const my = (y1 + y2) * 0.5 + sagPx * 0.5;
        const midAlt = ((a.effElevM + b.effElevM) * 0.5 * tf) - cw.sagMeters * 0.5;

        hitNodes.push({
          id: cw.id, stoneId: "ladders_and_hanging_sidewalks", kind: "hanging_catwalk",
          label: "Hanging Sidewalk (" + a.cluster.name.split(" ")[0] + " – " + b.cluster.name.split(" ")[0] + ")",
          x: mx, y: my, x1: x1, y1: y1, x2: x2, y2: y2, sagPx: sagPx,
          radius: 38, priority: 7, altitudeMeters: Number(Math.max(8, midAlt).toFixed(1)),
          material: "Catenary hemp cables & lashed bamboo-plank footway",
          note: "Swaying hanging sidewalk spanning an airy chasm high above the cracked mesa.",
          clusterIdx: cw.fromIdx
        });

        return { cw: cw, x1: x1, y1: y1, x2: x2, y2: y2, sagPx: sagPx, mx: mx, my: my, swayMid: swayMid };
      }).filter(Boolean);

      geom = {
        mesaY: mesaY, topPad: topPad, pxPerM: pxPerM, horizScale: horizScale,
        scaleCeilingM: scaleCeilingM, clusters: cGeoms, catwalks: cwGeoms, hitNodes: hitNodes
      };
    }

    function pointToSegmentDist(px, py, x1, y1, x2, y2) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const lenSq = dx * dx + dy * dy;
      if (lenSq < 1e-4) return Math.hypot(px - x1, py - y1);
      const t = clamp(((px - x1) * dx + (py - y1) * dy) / lenSq, 0, 1);
      return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
    }

    function pointToCatenaryDist(px, py, x1, y1, x2, y2, sagPx) {
      let best = Infinity;
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const cx = x1 + (x2 - x1) * t;
        const cy = y1 + (y2 - y1) * t + 4 * t * (1 - t) * sagPx * 0.55;
        const d = Math.hypot(px - cx, py - cy);
        if (d < best) best = d;
      }
      return best;
    }

    function getState() {
      let baseSum = 0;
      let elevSum = 0;
      let minAlt = Infinity;
      let maxAlt = -Infinity;
      let ladders = 0;
      let belvederes = 0;
      let barrels = 0;
      let cranes = 0;
      let fishPoles = 0;
      let weathervanes = 0;
      let ribbons = 0;

      for (let i = 0; i < clusters.length; i++) {
        const c = clusters[i];
        baseSum += c.baselineMeters;
        elevSum += c.elevationMeters;
        if (c.elevationMeters < minAlt) minAlt = c.elevationMeters;
        if (c.elevationMeters > maxAlt) maxAlt = c.elevationMeters;
        ladders += c.ladderCount;
        if (c.hasBelvedere) belvederes++;
        barrels += c.barrelCount;
        if (c.hasCrane) cranes++;
        fishPoles += c.fishPoleCount;
        if (c.hasWeathervane) weathervanes++;
        ribbons += c.ribbonCount;
      }

      const baseMean = baseSum / clusters.length;
      const currMean = elevSum / clusters.length;
      return {
        width: width,
        height: height,
        dpr: dpr,
        mesaY: geom.mesaY,
        groundMoisture: 0,
        waterAtGround: false,
        floodMarksFound: 0,
        clusterCount: clusters.length,
        clusters: clusters.map(function (c) {
          return {
            index: c.index,
            name: c.name,
            xNorm: c.xNorm,
            baselineMeters: c.baselineMeters,
            elevationMeters: Number(c.elevationMeters.toFixed(2)),
            hasBelvedere: c.hasBelvedere,
            barrelCount: c.barrelCount,
            hasCrane: c.hasCrane,
            fishPoleCount: c.fishPoleCount,
            ribbonCount: c.ribbonCount,
            postDepthMeters: c.postDepthMeters
          };
        }),
        baselineAltitudeMeters: Number(baseMean.toFixed(2)),
        meanAltitudeMeters: Number(currMean.toFixed(2)),
        minAltitudeMeters: Number(minAlt.toFixed(2)),
        maxAltitudeMeters: Number(maxAlt.toFixed(2)),
        altitudeGainMeters: Number((currMean - baseMean).toFixed(2)),
        catwalkCount: catwalks.length,
        crossingCatwalkCount: countCrossingCatwalks(),
        ladderCount: ladders,
        belvedereCount: belvederes,
        barrelCount: barrels,
        elevatedWaterLiters: barrels * 180,
        pulleyCount: cranes + 2,
        craneCount: cranes,
        fishPoleCount: fishPoles,
        weathervaneCount: weathervanes,
        ribbonCount: ribbons,
        windSpeed: Number(windSpeed.toFixed(2)),
        gustStrength: Number(gustStrength.toFixed(2)),
        reducedMotion: reducedMotion,
        muted: audio.isMuted(),
        permutationGeneration: permutationGeneration,
        flatAttemptSublimated: flatAttemptSublimated,
        sublimatedFlatAttempts: sublimatedFlatAttempts,
        classification: "gives_form_to_desires",
        footingProbesCount: footingProbesCount,
        lastInspected: lastInspected,
        lastFootingProbe: lastFootingProbe,
        stonesPresent: CANONICAL_STONES.map(function (s) { return s.id; })
      };
    }

    function setViewport(w, h, nextDpr) {
      if (w && typeof w === "object") {
        width = Math.max(240, Number(w.width) || width);
        height = Math.max(240, Number(w.height) || height);
        dpr = Math.max(1, Number(w.dpr) || dpr);
      } else {
        if (Number(w) > 0) width = Math.max(240, Number(w));
        if (Number(h) > 0) height = Math.max(240, Number(h));
        if (Number(nextDpr) > 0) dpr = Math.max(1, Number(nextDpr));
      }
      rebuildGeometry();
      return getState();
    }

    function step(dt) {
      const safeDt = clamp(Number(dt) || 0.016, 0, 0.25);
      if (reducedMotion) {
        gustStrength = 0;
        hoistAnim = 0;
        for (let i = 0; i < clusters.length; i++) clusters[i].animOffsetMeters = 0;
        if (flatGhostTimer > 0) flatGhostTimer = Math.max(0, flatGhostTimer - safeDt);
        rebuildGeometry();
        return;
      }
      timeSec += safeDt;
      vanePhase += safeDt * (1.8 + windSpeed * 2.1 + gustStrength * 6.5);
      gustStrength = Math.max(0, gustStrength * Math.exp(-safeDt * 1.65) - safeDt * 0.02);
      hoistAnim = Math.max(0, hoistAnim - safeDt * 0.9);
      if (flatGhostTimer > 0) flatGhostTimer = Math.max(0, flatGhostTimer - safeDt);
      const decay = Math.exp(-safeDt * 5.2);
      for (let i = 0; i < clusters.length; i++) {
        clusters[i].animOffsetMeters *= decay;
        if (Math.abs(clusters[i].animOffsetMeters) < 0.02) clusters[i].animOffsetMeters = 0;
      }
      for (let i = 0; i < dustMotes.length; i++) {
        const m = dustMotes[i];
        m.xNorm += m.speed * (0.7 + windSpeed * 0.6 + gustStrength * 1.8) * safeDt;
        if (m.xNorm > 1.03) m.xNorm -= 1.06;
      }
      rebuildGeometry();
    }

    function probeMesaFooting(rawXNorm) {
      let xn;
      if (rawXNorm === undefined || rawXNorm === null || Number.isNaN(Number(rawXNorm))) {
        xn = clusters[probeCursor % clusters.length].xNorm;
        probeCursor++;
      } else {
        const n = Number(rawXNorm);
        xn = n > 1.05 ? clamp(n / width, 0.02, 0.98) : clamp(n, 0.02, 0.98);
      }
      let nearest = clusters[0];
      let bestDist = Infinity;
      for (let i = 0; i < clusters.length; i++) {
        const d = Math.abs(clusters[i].xNorm - xn);
        if (d < bestDist) { bestDist = d; nearest = clusters[i]; }
      }
      footingProbesCount++;
      const notes = [
        "Augur core from " + nearest.name + " socket (" + nearest.postDepthMeters.toFixed(1) + "m): bone-dry ochre clay, zero marsh silt, zero flood-marks. Nobody remembers why the founders raised Zenobia on high pilings.",
        "Dry terracotta dust sifts from the seasoned post-shoe (" + nearest.postDepthMeters.toFixed(1) + "m deep). Neither river nor tide ever touched this plateau; the founders' motive has vanished.",
        "Parched sienna hardpan (" + nearest.postDepthMeters.toFixed(1) + "m): 0% ground moisture, 0 flood strata. Why Zenobia climbed onto stilts over dry earth remains unremembered."
      ];
      const report = {
        id: "footing_socket_" + nearest.index,
        stoneId: "forgotten_founding_motive",
        kind: "mesa_footing",
        label: nearest.name + " Dry Post-Socket",
        xNorm: Number(nearest.xNorm.toFixed(3)),
        yNorm: Number((geom.mesaY / height).toFixed(3)),
        altitudeMeters: 0,
        groundMoisture: 0,
        waterAtGround: false,
        floodMarksFound: 0,
        postDepthMeters: nearest.postDepthMeters,
        material: "Baked ochre-sienna hardpan & seasoned ironwood post-shoe",
        note: notes[(footingProbesCount - 1) % notes.length]
      };
      lastFootingProbe = report;
      lastInspected = report;
      audio.play("footing_knock", 1.0);
      return report;
    }

    function inspectAt(px, py) {
      rebuildGeometry();
      const x = Number(px) || 0;
      const y = Number(py) || 0;
      if (y >= geom.mesaY - 12) {
        return probeMesaFooting(x / width);
      }
      let chosen = null;
      let bestScore = Infinity;
      for (let i = 0; i < geom.hitNodes.length; i++) {
        const node = geom.hitNodes[i];
        let d;
        if (node.kind === "piling_shaft") {
          d = pointToSegmentDist(x, y, node.x, node.y, node.x2, node.y2);
        } else if (node.kind === "hanging_catwalk") {
          d = pointToCatenaryDist(x, y, node.x1, node.y1, node.x2, node.y2, node.sagPx);
        } else {
          d = Math.hypot(x - node.x, y - node.y);
        }
        const limit = Math.max(38, node.radius || 38);
        if (d <= limit) {
          const score = d - (node.priority || 1) * 2.8;
          if (score < bestScore) { bestScore = score; chosen = node; }
        }
      }
      if (!chosen) return null;
      const soundMap = {
        weathervane_ribbon: "vane_tick",
        pulley_crane: "pulley_ratchet",
        fish_pole: "bamboo_creak",
        water_barrel: "pulley_ratchet",
        piling_shaft: "bamboo_creak",
        mesa_footing: "footing_knock"
      };
      audio.play(soundMap[chosen.kind] || "chime", 0.95);
      const res = {
        id: chosen.id,
        stoneId: chosen.stoneId,
        kind: chosen.kind,
        label: chosen.label,
        altitudeMeters: chosen.altitudeMeters,
        material: chosen.material,
        note: chosen.note,
        xNorm: Number(clamp(x / width, 0, 1).toFixed(3)),
        yNorm: Number(clamp(y / height, 0, 1).toFixed(3)),
        groundMoisture: 0,
        waterAtGround: false
      };
      lastInspected = res;
      return res;
    }

    function elevateCluster(clusterIdx, deltaMeters) {
      const delta = deltaMeters === undefined ? 4.5 : Number(deltaMeters) || 4.5;
      if (clusterIdx === undefined || clusterIdx === null || clusterIdx < 0 || clusterIdx >= clusters.length) {
        const i1 = elevateCursor % clusters.length;
        const i2 = (elevateCursor + 3) % clusters.length;
        elevateCursor++;
        [i1, i2].forEach(function (idx) {
          const prev = clusters[idx].elevationMeters;
          clusters[idx].elevationMeters = clamp(prev + delta, 14, 78);
          clusters[idx].animOffsetMeters = reducedMotion ? 0 : (prev - clusters[idx].elevationMeters);
          if (clusters[idx].elevationMeters >= 36) clusters[idx].hasBelvedere = true;
        });
      } else {
        const c = clusters[clusterIdx];
        const prev = c.elevationMeters;
        c.elevationMeters = clamp(prev + delta, 14, 78);
        c.animOffsetMeters = reducedMotion ? 0 : (prev - c.elevationMeters);
        if (c.elevationMeters >= 36) c.hasBelvedere = true;
      }
      rebuildGeometry();
      audio.play("bamboo_creak", 1.1);
      return getState();
    }

    function spanCatwalk(fromIdx, toIdx, tierFrac) {
      const candidatePairs = [
        [0, 2, 0.90], [2, 5, 0.88], [1, 4, 0.81], [4, 7, 0.89],
        [0, 3, 0.79], [2, 6, 0.85], [3, 6, 0.91], [1, 5, 0.77]
      ];
      let a = Number(fromIdx);
      let b = Number(toIdx);
      let tf = Number(tierFrac);
      if (Number.isNaN(a) || Number.isNaN(b) || a === b || a < 0 || b < 0 || a >= clusters.length || b >= clusters.length) {
        const pick = candidatePairs[catwalkCursor % candidatePairs.length];
        catwalkCursor++;
        a = pick[0];
        b = pick[1];
        tf = clamp(pick[2] + ((catwalkCursor % 3) - 1) * 0.04, 0.56, 0.95);
      } else {
        tf = Number.isNaN(tf) ? 0.84 : clamp(tf, 0.50, 0.96);
      }
      const cw = {
        id: "catwalk_" + catwalks.length + "_" + a + "_" + b,
        fromIdx: a,
        toIdx: b,
        tierFrac: tf,
        sagMeters: 1.7 + Math.abs(b - a) * 0.8,
        phase: catwalks.length * 0.91
      };
      catwalks.push(cw);
      if (catwalks.length > 22) catwalks.shift();
      rebuildGeometry();
      audio.play("bamboo_creak", 0.9);
      audio.play("chime", 0.85);
      return cw;
    }

    function hoistBarrels(count) {
      const add = Math.max(1, Number(count) || 2);
      for (let i = 0; i < add; i++) {
        const c = clusters[(elevateCursor + i * 3) % clusters.length];
        c.barrelCount = Math.min(6, c.barrelCount + 1);
      }
      elevateCursor++;
      hoistAnim = reducedMotion ? 0 : 1.0;
      rebuildGeometry();
      audio.play("pulley_ratchet", 1.15);
      return {
        barrelCount: getState().barrelCount,
        elevatedWaterLiters: getState().elevatedWaterLiters,
        groundMoisture: 0,
        waterAtGround: false
      };
    }

    function triggerGust(strength) {
      const s = clamp(Number(strength) || 1.15, 0.25, 2.4);
      windSpeed = clamp(0.9 + s * 0.55, 0.8, 2.6);
      gustStrength = reducedMotion ? 0 : s;
      rebuildGeometry();
      audio.play("wind_gust", s);
      audio.play("chime", 0.75 * s);
      return { windSpeed: windSpeed, gustStrength: gustStrength };
    }

    function applyDreamPermutation(permSpec) {
      const spec = permSpec || {};
      permutationGeneration = Number(spec.generation) || (permutationGeneration + 1);
      const isSublimatedFlat = Boolean(spec.rejectedFlatAttempt || spec.flatAttemptSublimated || spec.isFlatAttempt);
      if (isSublimatedFlat) {
        flatAttemptSublimated = true;
        sublimatedFlatAttempts++;
        flatGhostTimer = reducedMotion ? 1.2 : 2.8;
      }

      const targets = Array.isArray(spec.targetElevations) ? spec.targetElevations
        : (Array.isArray(spec.elevations) ? spec.elevations : null);
      for (let i = 0; i < clusters.length; i++) {
        const c = clusters[i];
        const prev = c.elevationMeters;
        let nextElev;
        if (targets && Number(targets[i]) > 0) {
          nextElev = Math.max(16, Number(targets[i]));
        } else {
          const boost = isSublimatedFlat ? (5.5 + (i % 3) * 2.2) : (3.5 + ((i + permutationGeneration) % 4) * 1.8);
          nextElev = clamp(Math.max(c.baselineMeters + boost, prev + 2.4), 16, 76);
        }
        c.elevationMeters = clamp(nextElev, 16, 78);
        c.animOffsetMeters = reducedMotion ? 0 : (prev - c.elevationMeters);
      }

      /* Guarantee meanAltitudeMeters strictly exceeds baselineAltitudeMeters */
      let sumNow = 0;
      let sumBase = 0;
      for (let i = 0; i < clusters.length; i++) {
        sumNow += clusters[i].elevationMeters;
        sumBase += clusters[i].baselineMeters;
      }
      if (sumNow <= sumBase + 8) {
        const lift = ((sumBase + 24) - sumNow) / clusters.length;
        for (let i = 0; i < clusters.length; i++) {
          clusters[i].elevationMeters = clamp(clusters[i].elevationMeters + lift, 16, 78);
        }
      }

      const belvBoost = Math.max(0, Number(spec.belvedereBoost) || (isSublimatedFlat ? 2 : 1));
      let addedBelv = 0;
      for (let i = 0; i < clusters.length && addedBelv < belvBoost; i++) {
        const idx = (i * 3 + permutationGeneration) % clusters.length;
        if (!clusters[idx].hasBelvedere) {
          clusters[idx].hasBelvedere = true;
          clusters[idx].hasWeathervane = true;
          addedBelv++;
        }
      }

      const bBoost = Math.max(0, Number(spec.barrelBoost) || 1);
      for (let i = 0; i < bBoost; i++) {
        const c = clusters[(i * 2 + permutationGeneration) % clusters.length];
        c.barrelCount = Math.min(6, c.barrelCount + 1);
      }

      if (Number(spec.ribbonDensity) > 0) {
        const rCount = clamp(Math.round(Number(spec.ribbonDensity) * 2.5), 2, 5);
        for (let i = 0; i < clusters.length; i++) {
          clusters[i].ribbonCount = Math.max(clusters[i].ribbonCount, rCount);
          if (i % 2 === 0) clusters[i].fishPoleCount = Math.max(1, clusters[i].fishPoleCount);
        }
      }

      const extra = Array.isArray(spec.extraCatwalks) ? spec.extraCatwalks : [];
      if (extra.length > 0) {
        catwalks = INITIAL_CATWALKS.map(function (pair, i) {
          return {
            id: "catwalk_base_" + i,
            fromIdx: pair[0], toIdx: pair[1], tierFrac: pair[2],
            sagMeters: 1.8 + Math.abs(pair[1] - pair[0]) * 0.85, phase: i * 0.73
          };
        });
        extra.forEach(function (entry, idx) {
          const f = Array.isArray(entry) ? entry[0] : entry.fromIdx;
          const t = Array.isArray(entry) ? entry[1] : entry.toIdx;
          const tf = Array.isArray(entry) ? entry[2] : entry.tierFrac;
          if (f >= 0 && t >= 0 && f < clusters.length && t < clusters.length && f !== t) {
            catwalks.push({
              id: "catwalk_perm_" + permutationGeneration + "_" + idx,
              fromIdx: f, toIdx: t, tierFrac: clamp(Number(tf) || 0.86, 0.52, 0.96),
              sagMeters: 1.7 + Math.abs(t - f) * 0.82, phase: (idx + 3) * 0.88
            });
          }
        });
      } else {
        spanCatwalk();
      }

      if (Number(spec.windSpeed) > 0) {
        windSpeed = clamp(Number(spec.windSpeed), 0.7, 2.6);
      }
      if (!reducedMotion) gustStrength = Math.max(gustStrength, 0.85);
      rebuildGeometry();
      audio.play(isSublimatedFlat ? "sublimate" : "chime", 1.15);
      return getState();
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      if (reducedMotion) {
        gustStrength = 0;
        hoistAnim = 0;
        for (let i = 0; i < clusters.length; i++) clusters[i].animOffsetMeters = 0;
      }
      rebuildGeometry();
      return reducedMotion;
    }

    function reset() {
      initWorld();
      audio.play("chime", 0.7);
      return getState();
    }

    function destroy() {
      if (root.document && root.document.removeEventListener) {
        root.document.removeEventListener("pointerdown", unlockHandler);
        root.document.removeEventListener("keydown", unlockHandler);
      }
      audio.destroy();
    }

    function drawPilingsAndBracing(ctx, cg, mesaY) {
      const c = cg.cluster;
      const legs = c.legs;
      const baseSpan = cg.halfW * 1.18;
      const topSpan = cg.halfW * 0.92;
      const legBottomX = [];
      const legTopX = [];

      for (let l = 0; l < legs; l++) {
        const frac = legs === 1 ? 0 : (l / (legs - 1)) * 2 - 1;
        legBottomX.push(cg.baseX + frac * baseSpan);
        legTopX.push(cg.deckX + frac * topSpan);
      }

      /* Diagonal X-bracing bays between outer pilings */
      const bays = Math.max(3, Math.round(cg.effElevM / 6.5));
      ctx.strokeStyle = PALETTE.bamboo_node_amber;
      ctx.lineWidth = Math.max(1.0, 1.35 * geom.horizScale);
      for (let b = 0; b < bays; b++) {
        const t0 = b / bays;
        const t1 = (b + 1) / bays;
        const y0 = mesaY - (mesaY - cg.deckY) * t0;
        const y1 = mesaY - (mesaY - cg.deckY) * t1;
        const lx0 = legBottomX[0] + (legTopX[0] - legBottomX[0]) * t0;
        const rx0 = legBottomX[legs - 1] + (legTopX[legs - 1] - legBottomX[legs - 1]) * t0;
        const lx1 = legBottomX[0] + (legTopX[0] - legBottomX[0]) * t1;
        const rx1 = legBottomX[legs - 1] + (legTopX[legs - 1] - legBottomX[legs - 1]) * t1;

        ctx.beginPath();
        ctx.moveTo(lx0, y0); ctx.lineTo(rx1, y1);
        ctx.moveTo(rx0, y0); ctx.lineTo(lx1, y1);
        ctx.stroke();

        if (b > 0) {
          ctx.beginPath();
          ctx.moveTo(lx0, y0); ctx.lineTo(rx0, y0);
          ctx.stroke();
        }
      }

      /* Main vertical/tapered bamboo-and-timber pilings with culm node rings */
      for (let l = 0; l < legs; l++) {
        const bx = legBottomX[l];
        const tx = legTopX[l];
        ctx.strokeStyle = l % 2 === 0 ? PALETTE.bamboo_culm_gold : PALETTE.bamboo_node_amber;
        ctx.lineWidth = Math.max(2.1, (l === 0 || l === legs - 1 ? 3.1 : 2.3) * geom.horizScale);
        ctx.beginPath();
        ctx.moveTo(bx, mesaY + 3);
        ctx.lineTo(tx, cg.deckY);
        ctx.stroke();

        /* Bamboo culm node lashings */
        ctx.strokeStyle = PALETTE.mesa_obsidian_umber;
        ctx.lineWidth = 1.1;
        for (let n = 1; n < bays * 2; n++) {
          const tn = n / (bays * 2);
          const nx = bx + (tx - bx) * tn;
          const ny = mesaY - (mesaY - cg.deckY) * tn;
          ctx.beginPath();
          ctx.moveTo(nx - 2.4, ny);
          ctx.lineTo(nx + 2.4, ny);
          ctx.stroke();
        }
      }
    }

    function drawBalconiesAndLadders(ctx, cg, mesaY) {
      const c = cg.cluster;
      const hs = geom.horizScale;

      /* Staggered intermediate crossing balconies */
      c.tierFracs.forEach(function (tf, ti) {
        const ty = mesaY - cg.effElevM * tf * geom.pxPerM;
        const cx = cg.baseX + cg.swayPx * tf;
        const jutL = (ti % 2 === 0 ? c.cantileverLeftM * 4.8 : c.cantileverRightM * 2.2) * hs;
        const jutR = (ti % 2 === 0 ? c.cantileverRightM * 2.4 : c.cantileverLeftM * 4.8) * hs;
        const xL = cx - cg.halfW - jutL;
        const xR = cx + cg.halfW + jutR;

        /* Knee-brace struts */
        ctx.strokeStyle = PALETTE.bamboo_node_amber;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(cx - cg.halfW * 0.7, ty + 14);
        ctx.lineTo(xL + 4, ty);
        ctx.moveTo(cx + cg.halfW * 0.7, ty + 14);
        ctx.lineTo(xR - 4, ty);
        ctx.stroke();

        /* Deck plank beam */
        ctx.fillStyle = PALETTE.bamboo_node_amber;
        ctx.fillRect(xL, ty - 2, xR - xL, 4);
        ctx.fillStyle = PALETTE.bamboo_culm_gold;
        ctx.fillRect(xL, ty - 2.5, xR - xL, 1.6);

        /* Open-air bamboo handrail & balusters */
        const railH = 8.5;
        ctx.strokeStyle = PALETTE.bamboo_culm_gold;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(xL, ty - railH);
        ctx.lineTo(xR, ty - railH);
        for (let bx = xL; bx <= xR; bx += Math.max(6, 8 * hs)) {
          ctx.moveTo(bx, ty - 2);
          ctx.lineTo(bx, ty - railH);
        }
        ctx.stroke();
      });

      /* Bamboo rung ladders linking staggered decks */
      const ladX = cg.deckX - cg.halfW * 0.72;
      const ladBottomY = Math.min(mesaY - 26, cg.deckY + cg.effElevM * 0.46 * geom.pxPerM);
      ctx.strokeStyle = PALETTE.bamboo_culm_gold;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(ladX - 3.2, cg.deckY - 4);
      ctx.lineTo(ladX - 5.0, ladBottomY);
      ctx.moveTo(ladX + 3.2, cg.deckY - 4);
      ctx.lineTo(ladX + 1.4, ladBottomY);
      for (let ry = cg.deckY; ry < ladBottomY; ry += 6.5) {
        const f = (ry - cg.deckY) / Math.max(1, ladBottomY - cg.deckY);
        const shift = -1.8 * f;
        ctx.moveTo(ladX - 3.2 + shift, ry);
        ctx.lineTo(ladX + 3.2 + shift, ry);
      }
      ctx.stroke();
    }

    function drawCatwalkSpan(ctx, cwG) {
      const steps = 18;
      const railOffset = 7.5;
      ctx.strokeStyle = PALETTE.bamboo_node_amber;
      ctx.lineWidth = 1.25;

      /* Upper handrail catenary */
      ctx.beginPath();
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = cwG.x1 + (cwG.x2 - cwG.x1) * t;
        const y = cwG.y1 + (cwG.y2 - cwG.y1) * t + 4 * t * (1 - t) * cwG.sagPx * 0.55 - railOffset;
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      /* Footway cable + vertical suspenders + bamboo planks */
      ctx.strokeStyle = PALETTE.bamboo_culm_gold;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const x = cwG.x1 + (cwG.x2 - cwG.x1) * t;
        const y = cwG.y1 + (cwG.y2 - cwG.y1) * t + 4 * t * (1 - t) * cwG.sagPx * 0.55;
        if (s === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.strokeStyle = PALETTE.plateau_parchment;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.0;
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        const x = cwG.x1 + (cwG.x2 - cwG.x1) * t;
        const y = cwG.y1 + (cwG.y2 - cwG.y1) * t + 4 * t * (1 - t) * cwG.sagPx * 0.55;
        ctx.beginPath();
        ctx.moveTo(x, y - railOffset);
        ctx.lineTo(x, y + 1.5);
        ctx.stroke();
        ctx.fillStyle = PALETTE.bamboo_culm_gold;
        ctx.fillRect(x - 2.2, y - 0.8, 4.4, 2.2);
      }
      ctx.globalAlpha = 1;
    }

    function drawSuperstructure(ctx, cg) {
      const c = cg.cluster;
      const hs = geom.horizScale;
      const dx = cg.deckX;
      const dy = cg.deckY;
      const deckSpan = cg.halfW * 1.45;

      /* Primary upper platform beam & railing */
      ctx.fillStyle = PALETTE.bamboo_node_amber;
      ctx.fillRect(dx - deckSpan, dy - 2.5, deckSpan * 2, 5);
      ctx.fillStyle = PALETTE.bamboo_culm_gold;
      ctx.fillRect(dx - deckSpan, dy - 3, deckSpan * 2, 2);

      /* Split-bamboo & oxidized-zinc house */
      const hw = cg.houseW;
      const hh = cg.houseH;
      const hx = dx - hw * 0.5;
      const hy = dy - hh - 2.5;
      ctx.fillStyle = PALETTE.bamboo_node_amber;
      ctx.fillRect(hx, hy, hw, hh);
      ctx.fillStyle = PALETTE.bamboo_culm_gold;
      for (let sx = hx + 2; sx < hx + hw - 2; sx += 4.2) {
        ctx.fillRect(sx, hy + 2, 2.2, hh - 4);
      }

      /* Louvered shutters & warm lantern pinpoints */
      const winW = Math.max(5, hw * 0.18);
      const winH = Math.max(6, hh * 0.34);
      ctx.fillStyle = PALETTE.oxidized_zinc_slate;
      ctx.fillRect(dx - winW - 3, hy + hh * 0.28, winW + 2, winH);
      ctx.fillStyle = PALETTE.silk_ribbon_saffron;
      ctx.fillRect(dx + 2, hy + hh * 0.28, winW, winH);
      ctx.fillStyle = PALETTE.plateau_parchment;
      ctx.fillRect(dx + 3.5, hy + hh * 0.33, Math.max(2, winW - 3), Math.max(2.5, winH - 3));

      /* Corrugated oxidized-zinc roof */
      const roofOver = 6 * hs;
      const peakH = Math.max(8, hh * 0.42);
      ctx.fillStyle = PALETTE.oxidized_zinc_slate;
      ctx.beginPath();
      ctx.moveTo(hx - roofOver, hy + 1);
      ctx.lineTo(dx, hy - peakH);
      ctx.lineTo(hx + hw + roofOver, hy + 1);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = PALETTE.weathered_zinc_mist;
      ctx.lineWidth = 1.1;
      for (let r = -3; r <= 3; r++) {
        ctx.beginPath();
        ctx.moveTo(dx + r * (hw * 0.16), hy + 1);
        ctx.lineTo(dx + r * (hw * 0.05), hy - peakH + Math.abs(r) * 1.4);
        ctx.stroke();
      }

      let finialBaseY = hy - peakH;

      /* Cone-roofed belvedere crowning upper stilts */
      if (c.hasBelvedere) {
        const belvW = hw * 0.62;
        const belvColH = Math.max(12, hh * 0.56);
        const belvBaseY = hy - peakH + 3;
        const belvTopY = belvBaseY - belvColH;
        const coneH = Math.max(14, hh * 0.68);
        ctx.strokeStyle = PALETTE.bamboo_culm_gold;
        ctx.lineWidth = 1.5;
        [-0.42, -0.14, 0.14, 0.42].forEach(function (f) {
          ctx.beginPath();
          ctx.moveTo(dx + belvW * f, belvBaseY);
          ctx.lineTo(dx + belvW * f * 0.88, belvTopY);
          ctx.stroke();
        });
        ctx.fillStyle = PALETTE.oxidized_zinc_slate;
        ctx.beginPath();
        ctx.moveTo(dx - belvW * 0.66, belvTopY + 1);
        ctx.lineTo(dx, belvTopY - coneH);
        ctx.lineTo(dx + belvW * 0.66, belvTopY + 1);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = PALETTE.weathered_zinc_mist;
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.moveTo(dx - belvW * 0.66, belvTopY + 1);
        ctx.lineTo(dx, belvTopY - coneH);
        ctx.lineTo(dx + belvW * 0.66, belvTopY + 1);
        ctx.stroke();
        finialBaseY = belvTopY - coneH;
      }

      /* Hooped barrels of elevated water storage */
      for (let b = 0; b < c.barrelCount; b++) {
        const side = b % 2 === 0 ? 1 : -1;
        const slot = Math.floor(b / 2);
        const bx = dx + side * (hw * 0.56 + 5 + slot * 8.5 * hs);
        const by = dy - 11.5;
        ctx.fillStyle = PALETTE.baked_mesa_sienna;
        ctx.fillRect(bx - 3.6, by, 7.2, 9.2);
        ctx.fillStyle = PALETTE.weathered_zinc_mist;
        ctx.fillRect(bx - 3.9, by + 1.8, 7.8, 1.3);
        ctx.fillRect(bx - 3.9, by + 6.2, 7.8, 1.3);
        /* Tiny elevated cistern meniscus glint */
        ctx.fillStyle = PALETTE.plateau_parchment;
        ctx.fillRect(bx - 1.2, by + 3.6, 2.4, 1.8);
      }

      /* Projecting jib crane, spoked pulley sheave & suspended basket */
      if (c.hasCrane) {
        const dir = c.index % 2 === 0 ? -1 : 1;
        const tipX = dx + dir * (deckSpan + 16 * hs);
        const tipY = hy + 3;
        ctx.strokeStyle = PALETTE.bamboo_culm_gold;
        ctx.lineWidth = 1.7;
        ctx.beginPath();
        ctx.moveTo(dx + dir * (hw * 0.4), dy - 4);
        ctx.lineTo(tipX, tipY);
        ctx.moveTo(dx + dir * (hw * 0.35), hy + 2);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        /* Pulley sheave wheel */
        ctx.strokeStyle = PALETTE.weathered_zinc_mist;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(tipX, tipY + 2.5, 3.4, 0, Math.PI * 2);
        ctx.stroke();

        const dropPx = Math.max(22, (c.pulleyDropFrac - hoistAnim * 0.14) * cg.effElevM * geom.pxPerM);
        const swing = reducedMotion ? 0 : Math.sin(timeSec * 2.1 + c.index) * (2.5 + gustStrength * 4);
        const baskX = tipX + swing;
        const baskY = Math.min(geom.mesaY - 22, tipY + 5 + dropPx);
        ctx.strokeStyle = PALETTE.plateau_parchment;
        ctx.lineWidth = 0.95;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY + 5.5);
        ctx.lineTo(baskX, baskY);
        ctx.stroke();
        ctx.fillStyle = PALETTE.bamboo_culm_gold;
        ctx.fillRect(baskX - 4.2, baskY, 8.4, 5.5);
      }

      /* Cantilevered bamboo fish poles casting lines into dry air */
      for (let fp = 0; fp < c.fishPoleCount; fp++) {
        const pDir = c.fishPoleDir * (fp % 2 === 0 ? 1 : -1);
        const px0 = dx + pDir * (deckSpan * 0.82);
        const py0 = dy - 5;
        const pxTip = px0 + pDir * (28 + fp * 10) * hs;
        const pyTip = py0 - 14 + (reducedMotion ? 0 : Math.sin(timeSec * 2.4 + c.index) * 2.2);
        ctx.strokeStyle = PALETTE.bamboo_culm_gold;
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.moveTo(px0, py0);
        ctx.quadraticCurveTo((px0 + pxTip) * 0.5, pyTip - 6, pxTip, pyTip);
        ctx.stroke();
        ctx.strokeStyle = PALETTE.plateau_parchment;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(pxTip, pyTip);
        ctx.lineTo(pxTip + (reducedMotion ? 0 : windSpeed * 3.5), pyTip + 28);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      /* Spinning zinc weathervanes & streaming vermilion/saffron silk ribbons */
      if (c.hasWeathervane) {
        const spinW = Math.cos(vanePhase + c.index * 1.1) * 7.5;
        ctx.strokeStyle = PALETTE.weathered_zinc_mist;
        ctx.lineWidth = 1.25;
        ctx.beginPath();
        ctx.moveTo(dx, finialBaseY + 2);
        ctx.lineTo(dx, finialBaseY - 11);
        ctx.moveTo(dx - spinW, finialBaseY - 8.5);
        ctx.lineTo(dx + spinW, finialBaseY - 8.5);
        ctx.stroke();
      }

      for (let r = 0; r < c.ribbonCount; r++) {
        const anchorX = dx + (r === 0 ? 0 : (r % 2 === 0 ? -hw * 0.45 : hw * 0.45));
        const anchorY = r === 0 ? finialBaseY - 5 : hy + 1;
        const len = (18 + r * 6 + windSpeed * 7 + gustStrength * 10) * hs;
        ctx.strokeStyle = r % 2 === 0 ? PALETTE.silk_ribbon_vermilion : PALETTE.silk_ribbon_saffron;
        ctx.lineWidth = 1.65;
        ctx.beginPath();
        ctx.moveTo(anchorX, anchorY);
        for (let seg = 1; seg <= 5; seg++) {
          const f = seg / 5;
          const flutter = reducedMotion ? (seg % 2 === 0 ? -1.4 : 1.4)
            : Math.sin(timeSec * 5.6 - seg * 1.1 + c.index + r) * (2.2 + gustStrength * 2.8) * f;
          ctx.lineTo(anchorX + len * f, anchorY + flutter - f * 1.5);
        }
        ctx.stroke();
      }
    }

    function render(ctxArg, wArg, hArg) {
      const ctx = ctxArg || (boundCanvas && boundCanvas.getContext ? boundCanvas.getContext("2d") : null);
      if (!ctx) return;
      if (Number(wArg) > 0 && Number(hArg) > 0 && (Math.abs(wArg - width) > 1 || Math.abs(hArg - height) > 1)) {
        width = Number(wArg);
        height = Number(hArg);
        rebuildGeometry();
      }
      const mesaY = geom.mesaY;

      ctx.save();
      /* 1. High arid plateau sky gradient */
      const skyGrad = ctx.createLinearGradient(0, 0, 0, mesaY);
      skyGrad.addColorStop(0, "#19110B");
      skyGrad.addColorStop(0.38, "#2C221A");
      skyGrad.addColorStop(0.76, "#5C3A23");
      skyGrad.addColorStop(1, "#9B6034");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, mesaY + 2);

      /* Thin plateau wind filaments */
      ctx.strokeStyle = PALETTE.plateau_parchment;
      ctx.globalAlpha = 0.055;
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const wy = mesaY * (0.14 + i * 0.13);
        const wx = ((reducedMotion ? 0 : timeSec * 22 * (i % 2 + 1)) + i * 190) % (width + 180) - 90;
        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.lineTo(wx + 140, wy - 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      /* 2. Sublimated Flat-Ground Chalk Ghost (when flat dream is rejected) */
      if (flatGhostTimer > 0) {
        const alpha = clamp(flatGhostTimer / 2.8, 0.12, 0.68);
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = PALETTE.plateau_parchment;
        ctx.setLineDash([4, 4]);
        ctx.lineWidth = 1.3;
        for (let i = 0; i < geom.clusters.length; i++) {
          const cg = geom.clusters[i];
          const bw = cg.houseW * 0.95;
          ctx.strokeRect(cg.baseX - bw * 0.5, mesaY - 18, bw, 18);
          ctx.beginPath();
          ctx.moveTo(cg.baseX, mesaY - 20);
          ctx.lineTo(cg.deckX, cg.deckY + 12);
          ctx.stroke();
        }
        ctx.restore();
      }

      /* 3. Pilings, cross-bracing, balconies, ladders & hanging catwalks */
      for (let i = 0; i < geom.clusters.length; i++) {
        drawPilingsAndBracing(ctx, geom.clusters[i], mesaY);
      }
      for (let i = 0; i < geom.clusters.length; i++) {
        drawBalconiesAndLadders(ctx, geom.clusters[i], mesaY);
      }
      for (let i = 0; i < geom.catwalks.length; i++) {
        drawCatwalkSpan(ctx, geom.catwalks[i]);
      }
      for (let i = 0; i < geom.clusters.length; i++) {
        drawSuperstructure(ctx, geom.clusters[i]);
      }

      /* 4. Strictly Dry Cracked Ochre/Terracotta Mesa Horizon (groundMoisture: 0) */
      const mesaGrad = ctx.createLinearGradient(0, mesaY, 0, height);
      mesaGrad.addColorStop(0, PALETTE.dry_ochre_terracotta);
      mesaGrad.addColorStop(0.26, PALETTE.baked_mesa_sienna);
      mesaGrad.addColorStop(1, PALETTE.mesa_obsidian_umber);
      ctx.fillStyle = mesaGrad;
      ctx.fillRect(0, mesaY, width, height - mesaY);

      ctx.strokeStyle = PALETTE.bamboo_culm_gold;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, mesaY);
      ctx.lineTo(width, mesaY);
      ctx.stroke();
      ctx.globalAlpha = 1;

      /* Desiccation cracks across baked earth */
      ctx.strokeStyle = PALETTE.mesa_obsidian_umber;
      ctx.lineWidth = 1.15;
      const mesaH = Math.max(24, height - mesaY);
      for (let i = 0; i < mesaCracks.length; i++) {
        const cr = mesaCracks[i];
        const x0 = cr.xNorm * width;
        const x1 = x0 + cr.dx1 * width;
        const y1 = mesaY + cr.dy1 * mesaH;
        const x2 = x1 + cr.dx2 * width;
        const y2 = mesaY + cr.dy2 * mesaH;
        ctx.beginPath();
        ctx.moveTo(x0, mesaY + 1);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1 + cr.branchX * width, y1 + mesaH * 0.18);
        ctx.stroke();
      }

      /* Dry post-sockets around piling footings */
      for (let i = 0; i < geom.clusters.length; i++) {
        const cg = geom.clusters[i];
        ctx.fillStyle = PALETTE.mesa_obsidian_umber;
        ctx.fillRect(cg.baseX - cg.halfW * 1.28, mesaY - 1.5, cg.halfW * 2.56, 4.5);
        ctx.strokeStyle = PALETTE.dry_ochre_terracotta;
        ctx.lineWidth = 1;
        ctx.strokeRect(cg.baseX - cg.halfW * 1.28, mesaY - 1.5, cg.halfW * 2.56, 4.5);
      }

      /* Drifting dry ochre dust motes above the mesa */
      ctx.fillStyle = PALETTE.plateau_parchment;
      for (let i = 0; i < dustMotes.length; i++) {
        const m = dustMotes[i];
        ctx.globalAlpha = m.alpha;
        ctx.fillRect(m.xNorm * width, mesaY - 3 - m.hFrac * height, m.size, m.size);
      }
      ctx.globalAlpha = 1;

      /* 5. Active inspection / footing augur reticle */
      if (lastInspected) {
        const rx = lastInspected.xNorm * width;
        const ry = lastInspected.yNorm * height;
        ctx.strokeStyle = PALETTE.silk_ribbon_saffron;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(rx, ry, 13, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    initWorld();

    return {
      getState: getState,
      setViewport: setViewport,
      step: step,
      render: render,
      inspectAt: inspectAt,
      probeMesaFooting: probeMesaFooting,
      elevateCluster: elevateCluster,
      spanCatwalk: spanCatwalk,
      hoistBarrels: hoistBarrels,
      triggerGust: triggerGust,
      applyDreamPermutation: applyDreamPermutation,
      setReducedMotion: setReducedMotion,
      setMuted: function (m) { return audio.setMuted(m); },
      toggleMute: function () { return audio.toggleMute(); },
      isMuted: function () { return audio.isMuted(); },
      playSound: function (kind, strength) { return audio.play(kind, strength); },
      reset: reset,
      destroy: destroy
    };
  }

  root.ZenobiaStiltedTrusswork = Object.freeze({
    PALETTE: PALETTE,
    CANONICAL_STONES: CANONICAL_STONES,
    createTrusswork: createTrusswork
  });
})(typeof globalThis !== "undefined" ? globalThis : window);
