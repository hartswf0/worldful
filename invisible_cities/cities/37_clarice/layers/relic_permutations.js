(function (root) {
  "use strict";

  function deepFreeze(obj) {
    if (!obj || typeof obj !== "object" || Object.isFrozen(obj)) return obj;
    Object.freeze(obj);
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i += 1) {
      deepFreeze(obj[keys[i]]);
    }
    return obj;
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  const PALETTE = deepFreeze({
    chrysalis_soot: "#120f11",
    basalt_vault: "#1b1619",
    opus_sectile: "#272024",
    pentelic_marble: "#ece5d5",
    limewash_patina: "#cfc4ae",
    gilded_cornice: "#d8a24a",
    candle_crystal: "#f0c978",
    brocade_crimson: "#9b3b48",
    wrought_rust: "#7d5338",
    basil_shoot: "#5c8754",
    vitrine_glass: "#74969e"
  });

  const ERA_REGIMES = deepFreeze([
    { index: 0, key: "court_splendor", label: "Sumptuous Court", shortLabel: "Court", accent: "#d8a24a" },
    { index: 1, key: "beggar_salvage", label: "Beggar-Clarice Chrysalis", shortLabel: "Beggar", accent: "#7d5338" },
    { index: 2, key: "museum_veneration", label: "Museum of Fragments", shortLabel: "Museum", accent: "#74969e" },
    { index: 3, key: "butterfly_surge", label: "Butterfly Bricolage Surge", shortLabel: "Butterfly", accent: "#5c8754" }
  ]);

  const RELIC_IDS = deepFreeze([
    "silk_brocade_curtains",
    "marble_funerary_urns",
    "wrought_harem_gratings",
    "corinthian_capitals",
    "velvet_bell_jars",
    "silver_soup_tureens",
    "gilded_cornices",
    "crystal_chandeliers",
    "dwarf_palm_tubs"
  ]);

  function makeRoles(r0, r1, r2, r3) {
    return [
      { roleIndex: 0, regimeKey: "court_splendor", label: r0[0], vignetteNote: r0[1], reverence: r0[2], utility: r0[3] },
      { roleIndex: 1, regimeKey: "beggar_salvage", label: r1[0], vignetteNote: r1[1], reverence: r1[2], utility: r1[3] },
      { roleIndex: 2, regimeKey: "museum_veneration", label: r2[0], vignetteNote: r2[1], reverence: r2[2], utility: r2[3] },
      { roleIndex: 3, regimeKey: "butterfly_surge", label: r3[0], vignetteNote: r3[1], reverence: r3[2], utility: r3[3] }
    ];
  }

  const RELIC_CATALOG = deepFreeze([
    {
      index: 0,
      id: "silk_brocade_curtains",
      keyNum: 1,
      title: "Silk & Brocade Curtains",
      shortTitle: "Brocade Curtains",
      shardMass: 14,
      material: "silk",
      xNorm: 0.17,
      yNorm: 0.30,
      roles: makeRoles(
        ["Embroidered silk & brocade palace curtains", "Crimson weave and gold cords framing tall palace loggias.", 0.86, 0.48],
        ["Brocade bedsheets & knotted pauper bundles", "Torn brocade knotted around meager household salvage.", 0.12, 0.92],
        ["Bundle-scraps enshrined in glass cases of the Museum of Fragments", "Humble knotted rags venerated behind beveled glass.", 0.96, 0.08],
        ["Patchwork brocade canopies shading rooftop loggias", "Stitched silk triangles billowing above sunlit terraces.", 0.66, 0.84]
      )
    },
    {
      index: 1,
      id: "marble_funerary_urns",
      keyNum: 2,
      title: "Marble Funerary Urns",
      shortTitle: "Funerary Urns",
      shardMass: 13,
      material: "marble",
      xNorm: 0.81,
      yNorm: 0.55,
      roles: makeRoles(
        ["Carved Pentelic marble funerary urns on mausoleum plinths", "Garlanded ash vessels elevated on stepped marble tombs.", 0.90, 0.36],
        ["Broken marble funerary urns planted with kitchen basil", "Fractured Pentelic bellies brimming with fragrant green basil.", 0.16, 0.94],
        ["Calibrated funerary urn shards in the Museum of Fragments", "Rim fragments suspended in brass calipers above glass plinths.", 0.97, 0.07],
        ["Whitewashed marble urns wedged as column pedestals", "Limewashed urns bearing the weight of resited portico shafts.", 0.64, 0.86]
      )
    },
    {
      index: 2,
      id: "wrought_harem_gratings",
      keyNum: 3,
      title: "Wrought-Iron Harem Gratings",
      shortTitle: "Harem Gratings",
      shardMass: 12,
      material: "iron",
      xNorm: 0.19,
      yNorm: 0.58,
      roles: makeRoles(
        ["Filigreed wrought-iron harem window gratings", "Lacework iron screens veiling upper palace casements.", 0.82, 0.54],
        ["Sooty iron skillets roasting cat-meat on fires of inlaid wood", "Horizontal iron scrollwork searing meat over gilt kindling embers.", 0.09, 0.97],
        ["Catalogued iron scrollwork hung in the Museum gallery", "Numbered iron arabesques spotlit against dark gallery stone.", 0.94, 0.09],
        ["Regilded harem gratings training rooftop melon vines", "Gilt-brushed filigree trellises heavy with striped melons.", 0.68, 0.85]
      )
    },
    {
      index: 3,
      id: "corinthian_capitals",
      keyNum: 4,
      title: "Corinthian Marble Capitals",
      shortTitle: "Corinthian Capitals",
      shardMass: 16,
      material: "marble",
      xNorm: 0.50,
      yNorm: 0.56,
      roles: makeRoles(
        ["Fluted Corinthian marble capitals crowning portico columns", "Crisp Pentelic acanthus leaves and volutes upholding temple beams.", 0.91, 0.52],
        ["Toppled Corinthian capitals forgotten in muddy chicken runs", "Hens pecking grain amid toppled volutes and straw wire mesh.", 0.11, 0.88],
        ["Velvet-plinth specimens in the Museum of Capitals", "Chipped capitals enthroned on crimson velvet under museum lamps.", 0.99, 0.06],
        ["Upside-down Corinthian capitals propping glass-roofed sheds & melons", "Inverted acanthus crowns supporting glazed shed rafters beside melons.", 0.69, 0.87]
      )
    },
    {
      index: 4,
      id: "velvet_bell_jars",
      keyNum: 5,
      title: "Velvet-Cushioned Bell Jars",
      shortTitle: "Velvet Bell Jars",
      shardMass: 10,
      material: "glass",
      xNorm: 0.26,
      yNorm: 0.81,
      roles: makeRoles(
        ["Velvet-cushioned parlor bell jars housing gilt curiosities", "Blown glass domes shielding gilded parlor automata on velvet.", 0.85, 0.42],
        ["Inverted cellar bell jars shielding dry crusts from rats", "Domes clapped onto cellar flagstones to foil prowling rats.", 0.14, 0.93],
        ["Reliquary bell jars encasing shards of earlier bell jars", "Intact museum domes enshrining splinters of shattered predecessors.", 0.98, 0.07],
        ["Sun-warmed cloches forcing citron grafts on terrace parapets", "Dew-misted glass cloches nursing grafted citron shoots.", 0.65, 0.83]
      )
    },
    {
      index: 5,
      id: "silver_soup_tureens",
      keyNum: 6,
      title: "Silver Banquet Soup Tureens",
      shortTitle: "Silver Tureens",
      shardMass: 11,
      material: "silver",
      xNorm: 0.54,
      yNorm: 0.82,
      roles: makeRoles(
        ["Repousse silver banquet soup tureens", "Chased silver vessels steaming on ceremonial linen tables.", 0.87, 0.50],
        ["Dented tarnished tureens catching roof-drip rainwater", "Battered silver bellies ringing with cold vault leaks.", 0.13, 0.95],
        ["Spotlit ritual vessels in the Museum of Fragments", "Tarnish-stabilized tureens revered as enigmatic cult bowls.", 0.95, 0.08],
        ["Chilled pomegranate-ice centerpieces on marble tables", "Frost-rimmed silver bowls heaped with ruby pomegranate ice.", 0.71, 0.82]
      )
    },
    {
      index: 6,
      id: "gilded_cornices",
      keyNum: 7,
      title: "Gilded Cedar Cornices",
      shortTitle: "Gilded Cornices",
      shardMass: 11,
      material: "wood_gilt",
      xNorm: 0.79,
      yNorm: 0.26,
      roles: makeRoles(
        ["Gilded & inlaid cedar ceiling cornices", "Gold-leafed dentil friezes crowning coffered palace halls.", 0.84, 0.46],
        ["Splintered inlaid kindling feeding alley skillet-fires", "Snapped cedar marquetry blazing beneath blackened iron skillets.", 0.08, 0.96],
        ["Half-charred gilt frieze splinters under beveled Museum glass", "Scorched gold-leaf fragments conserved on velvet mounts.", 0.95, 0.06],
        ["Asymmetric gilded cornices spliced onto new arch lintels", "Mismatched gilt moldings clamped boldly across limestone arches.", 0.67, 0.80]
      )
    },
    {
      index: 7,
      id: "crystal_chandeliers",
      keyNum: 8,
      title: "Rock-Crystal Chandeliers",
      shortTitle: "Crystal Chandeliers",
      shardMass: 11,
      material: "glass",
      xNorm: 0.48,
      yNorm: 0.22,
      roles: makeRoles(
        ["Tiered rock-crystal ballroom chandeliers", "Blazing candle tiers multiplying light through cut crystal drops.", 0.89, 0.47],
        ["Unstrung crystal prism-beads bartered in rubble alleys", "Loose teardrop prisms traded as small change amid ruins.", 0.15, 0.90],
        ["Numbered crystal teardrops suspended in Museum vitrines", "Catalogued prisms hung on silk threads in quiet glass cases.", 0.96, 0.08],
        ["Refracting prism clusters hung beneath glass-roofed sheds", "Salvaged crystal clusters scattering rainbows across melon beds.", 0.72, 0.81]
      )
    },
    {
      index: 8,
      id: "dwarf_palm_tubs",
      keyNum: 9,
      title: "Dwarf-Palm Marble Tubs",
      shortTitle: "Dwarf-Palm Tubs",
      shardMass: 10,
      material: "marble",
      xNorm: 0.81,
      yNorm: 0.81,
      roles: makeRoles(
        ["Bronze-hooped tubs holding parlor dwarf palms", "Hoop-bound tubs framing symmetrical parlor fan palms.", 0.81, 0.49],
        ["Cracked palm tubs serving as beggar-alley wash troughs", "Leaking stone tubs brimming with grey suds and wrung rags.", 0.13, 0.94],
        ["Roped-off terracotta palm tubs in the Museum vestibule", "Stanchion-guarded tubs displayed at the Museum threshold.", 0.93, 0.10],
        ["Repainted palm tubs cradling inverted marble capitals", "Striped tubs wedging overturned marble volutes as terrace seats.", 0.66, 0.84]
      )
    }
  ]);

  const CONSERVED_SHARD_MASS = 108;

  const DEFAULT_OPENING_ROLES = Object.freeze({
    silk_brocade_curtains: 2,
    marble_funerary_urns: 1,
    wrought_harem_gratings: 1,
    corinthian_capitals: 1,
    velvet_bell_jars: 2,
    silver_soup_tureens: 1,
    gilded_cornices: 3,
    crystal_chandeliers: 2,
    dwarf_palm_tubs: 3
  });

  function createAudioEngine(initialMuted) {
    let muted = Boolean(initialMuted);
    let audioCtx = null;

    function ensureContext() {
      if (muted) return null;
      if (audioCtx) {
        if (audioCtx.state === "suspended" && typeof audioCtx.resume === "function") {
          try { audioCtx.resume(); } catch (_) { /* ignore */ }
        }
        return audioCtx;
      }
      const Ctor = (root && (root.AudioContext || root.webkitAudioContext)) || null;
      if (!Ctor) return null;
      try {
        audioCtx = new Ctor();
        if (audioCtx.state === "suspended" && typeof audioCtx.resume === "function") {
          audioCtx.resume();
        }
      } catch (_) {
        audioCtx = null;
      }
      return audioCtx;
    }

    function scheduleVoice(ctx, freq, wave, gainPeak, durSec, delaySec, ratio2) {
      const t0 = ctx.currentTime + (delaySec || 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = wave;
      osc.frequency.setValueAtTime(Math.max(55, freq), t0);
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.001, gainPeak), t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + durSec);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + durSec + 0.02);

      if (ratio2) {
        const osc2 = ctx.createOscillator();
        const g2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(Math.max(65, freq * ratio2), t0);
        g2.gain.setValueAtTime(0.0001, t0);
        g2.gain.exponentialRampToValueAtTime(Math.max(0.0008, gainPeak * 0.45), t0 + 0.008);
        g2.gain.exponentialRampToValueAtTime(0.0001, t0 + durSec * 0.8);
        osc2.connect(g2);
        g2.connect(ctx.destination);
        osc2.start(t0);
        osc2.stop(t0 + durSec + 0.02);
      }
    }

    function playSilkRustle(ctx, baseFreq, durSec) {
      const len = Math.max(256, Math.floor(ctx.sampleRate * durSec));
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const ch = buf.getChannelData(0);
      let seed = 19371;
      for (let i = 0; i < len; i += 1) {
        seed = (seed * 16807) % 2147483647;
        const env = Math.sin((Math.PI * i) / len);
        ch[i] = (((seed / 2147483647) * 2) - 1) * env * 0.35;
      }
      const src = ctx.createBufferSource();
      const flt = ctx.createBiquadFilter();
      const gain = ctx.createGain();
      src.buffer = buf;
      flt.type = "bandpass";
      flt.frequency.setValueAtTime(baseFreq * 3.1, ctx.currentTime);
      flt.Q.setValueAtTime(2.6, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      src.connect(flt);
      flt.connect(gain);
      gain.connect(ctx.destination);
      src.start();
    }

    function playRelicTone(material, roleIndex) {
      const ctx = ensureContext();
      if (!ctx) return false;
      const rIdx = clamp(Number(roleIndex) || 0, 0, 3);
      const roleMul = [1.0, 0.78, 1.34, 1.18][rIdx];
      try {
        if (material === "silk") {
          playSilkRustle(ctx, 320 * roleMul, 0.22);
          scheduleVoice(ctx, 293.66 * roleMul, "sine", 0.03, 0.24, 0.01, 1.5);
        } else if (material === "iron") {
          scheduleVoice(ctx, 196.0 * roleMul, "triangle", 0.055, 0.28, 0, 1.414);
          scheduleVoice(ctx, 196.0 * roleMul * 2.76, "square", 0.018, 0.14, 0.005, 0);
        } else if (material === "silver") {
          scheduleVoice(ctx, 523.25 * roleMul, "sine", 0.05, 0.46, 0, 2.02);
          scheduleVoice(ctx, 523.25 * roleMul * 3.01, "sine", 0.02, 0.32, 0.015, 0);
        } else if (material === "wood_gilt") {
          scheduleVoice(ctx, 246.94 * roleMul, "triangle", 0.06, 0.19, 0, 3.0);
        } else if (material === "glass") {
          scheduleVoice(ctx, 783.99 * roleMul, "sine", 0.045, 0.44, 0, 2.51);
        } else {
          scheduleVoice(ctx, 349.23 * roleMul, "triangle", 0.055, 0.34, 0, 1.58);
        }
        return true;
      } catch (_) {
        return false;
      }
    }

    function playCycleChord(kind) {
      const ctx = ensureContext();
      if (!ctx) return false;
      const k = String(kind || "");
      let notes = [261.63, 329.63, 392.0, 523.25];
      let wave = "triangle";
      if (k.indexOf("plague") !== -1 || k.indexOf("beggar") !== -1) {
        notes = [220.0, 207.65, 164.81, 146.83];
        wave = "sawtooth";
      } else if (k.indexOf("museum") !== -1) {
        notes = [349.23, 466.16, 622.25, 880.0];
        wave = "sine";
      } else if (k.indexOf("butterfly") !== -1) {
        notes = [293.66, 369.99, 440.0, 587.33, 739.99];
        wave = "triangle";
      }
      try {
        for (let i = 0; i < notes.length; i += 1) {
          scheduleVoice(ctx, notes[i], wave, 0.036, 0.42, i * 0.055, 2.0);
        }
        return true;
      } catch (_) {
        return false;
      }
    }

    function playShuffleRattle() {
      const ctx = ensureContext();
      if (!ctx) return false;
      const clicks = [415, 352, 512, 388, 468];
      try {
        for (let i = 0; i < clicks.length; i += 1) {
          scheduleVoice(ctx, clicks[i], "triangle", 0.038, 0.085, i * 0.028, 2.37);
        }
        return true;
      } catch (_) {
        return false;
      }
    }

    return {
      setMuted(flag) { muted = Boolean(flag); return muted; },
      isMuted() { return muted; },
      toggleMute() { muted = !muted; if (!muted) ensureContext(); return muted; },
      unlock() { return Boolean(ensureContext()); },
      playRelicTone,
      playCycleChord,
      playShuffleRattle
    };
  }

  function createRelicStage(opts) {
    const config = opts || {};
    let clock = 0;
    let pulseLevel = 0;
    let currentPhase = "palimpsest_equilibrium";

    const embers = [];
    for (let i = 0; i < 14; i += 1) {
      embers.push({ u: ((i * 37) % 100) / 100, v: ((i * 53) % 100) / 100, spd: 0.35 + (i % 5) * 0.11 });
    }
    const smokeWisps = [];
    for (let i = 0; i < 8; i += 1) {
      smokeWisps.push({ u: (i / 8), drift: ((i % 2 === 0) ? 1 : -1) * (0.18 + (i % 3) * 0.07) });
    }
    const vitrineMotes = [];
    for (let i = 0; i < 18; i += 1) {
      vitrineMotes.push({ x: ((i * 61 + 17) % 100) / 100, y: ((i * 43 + 9) % 100) / 100, r: 0.9 + (i % 3) * 0.55 });
    }

    function getLayout(width, height) {
      const w = Number(width) > 0 ? Number(width) : 800;
      const h = Number(height) > 0 ? Number(height) : 520;
      const minDim = Math.min(w, h);
      const hitRadius = clamp(minDim * 0.094, 22, 54);
      const stations = RELIC_CATALOG.map(function (item) {
        return {
          index: item.index,
          id: item.id,
          keyNum: item.keyNum,
          title: item.title,
          shortTitle: item.shortTitle,
          x: Math.round(item.xNorm * w * 10) / 10,
          y: Math.round(item.yNorm * h * 10) / 10,
          xNorm: item.xNorm,
          yNorm: item.yNorm,
          hitRadius: hitRadius,
          material: item.material,
          shardMass: item.shardMass
        };
      });
      return { width: w, height: h, stations: stations };
    }

    function hitTest(px, py, width, height, isTouch) {
      const layout = getLayout(width, height);
      const pad = isTouch ? 12 : 3;
      let best = null;
      let bestDist = Infinity;
      for (let i = 0; i < layout.stations.length; i += 1) {
        const st = layout.stations[i];
        const dx = px - st.x;
        const dy = py - st.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d <= st.hitRadius + pad && d < bestDist) {
          best = st;
          bestDist = d;
        }
      }
      return best;
    }

    function step(dtSec, params) {
      const p = params || {};
      if (p.phase) currentPhase = String(p.phase);
      const reduced = p.reducedMotion !== undefined ? Boolean(p.reducedMotion) : Boolean(config.reducedMotion);
      if (Number(p.transitionPulse) > pulseLevel) {
        pulseLevel = clamp(Number(p.transitionPulse), 0, 1);
      }
      if (reduced) {
        pulseLevel = 0;
        return;
      }
      const dt = clamp(Number(dtSec) || 0.016, 0, 0.1);
      clock += dt;
      pulseLevel = Math.max(0, pulseLevel - dt * 1.35);
      for (let i = 0; i < embers.length; i += 1) {
        embers[i].v = (embers[i].v + dt * embers[i].spd) % 1;
      }
      for (let i = 0; i < smokeWisps.length; i += 1) {
        smokeWisps[i].u = (smokeWisps[i].u + dt * 0.24) % 1;
      }
      for (let i = 0; i < vitrineMotes.length; i += 1) {
        vitrineMotes[i].y = (vitrineMotes[i].y + dt * 0.028) % 1;
        vitrineMotes[i].x = (vitrineMotes[i].x + Math.sin(clock * 0.7 + i) * dt * 0.008 + 1) % 1;
      }
    }

    function resolveRoleIndex(id, params) {
      const p = params || {};
      if (p.relicRoleMap && p.relicRoleMap[id] !== undefined) {
        return clamp(Number(p.relicRoleMap[id]) || 0, 0, 3);
      }
      if (Array.isArray(p.relicStates)) {
        for (let i = 0; i < p.relicStates.length; i += 1) {
          if (p.relicStates[i] && p.relicStates[i].id === id) {
            return clamp(Number(p.relicStates[i].roleIndex) || 0, 0, 3);
          }
        }
      }
      return DEFAULT_OPENING_ROLES[id] !== undefined ? DEFAULT_OPENING_ROLES[id] : 0;
    }

    function drawBackdrop(ctx, w, h, phase) {
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, PALETTE.chrysalis_soot);
      bg.addColorStop(0.52, PALETTE.basalt_vault);
      bg.addColorStop(1, PALETTE.opus_sectile);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const yUpper = h * 0.39;
      const yLower = h * 0.69;
      const yCrypt = h * 0.92;
      const ph = String(phase || currentPhase);
      const beamColor = ph.indexOf("museum") !== -1 ? "rgba(116,150,158,0.13)"
        : ph.indexOf("butterfly") !== -1 ? "rgba(240,201,120,0.14)"
        : ph.indexOf("plague") !== -1 ? "rgba(125,83,56,0.11)" : "rgba(216,162,74,0.09)";

      const bays = [[0.04, 0.32], [0.34, 0.63], [0.65, 0.96]];
      for (let b = 0; b < bays.length; b += 1) {
        const x0 = w * bays[b][0];
        const x1 = w * bays[b][1];
        const xm = (x0 + x1) * 0.5;
        const bw = x1 - x0;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x0, yUpper);
        ctx.lineTo(x0, h * 0.13);
        ctx.quadraticCurveTo(xm, h * 0.02, x1, h * 0.13);
        ctx.lineTo(x1, yUpper);
        ctx.closePath();
        ctx.fillStyle = "rgba(18,15,17,0.52)";
        ctx.fill();
        ctx.strokeStyle = "rgba(207,196,174,0.18)";
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(xm - bw * 0.16, h * 0.06);
        ctx.lineTo(xm + bw * 0.12, h * 0.06);
        ctx.lineTo(xm + bw * 0.36, yLower);
        ctx.lineTo(xm - bw * 0.28, yLower);
        ctx.closePath();
        ctx.fillStyle = beamColor;
        ctx.fill();
        ctx.restore();
      }

      ctx.fillStyle = "rgba(207,196,174,0.14)";
      ctx.fillRect(w * 0.02, yUpper - 4, w * 0.96, 7);
      ctx.fillStyle = "rgba(216,162,74,0.22)";
      ctx.fillRect(w * 0.02, yUpper - 4, w * 0.96, 2);

      for (let p = 0; p < 4; p += 1) {
        const px = w * (0.03 + p * 0.31);
        ctx.fillStyle = "rgba(236,229,213,0.08)";
        ctx.fillRect(px - 5, yUpper + 3, 10, yLower - yUpper - 6);
      }

      ctx.fillStyle = "rgba(39,32,36,0.88)";
      ctx.fillRect(0, yLower, w, yCrypt - yLower);
      ctx.strokeStyle = "rgba(207,196,174,0.14)";
      ctx.lineWidth = 1;
      const stepX = Math.max(26, w * 0.055);
      for (let x = 0; x < w + stepX; x += stepX) {
        ctx.beginPath();
        ctx.moveTo(x, yLower);
        ctx.lineTo(x - stepX * 0.6, yCrypt);
        ctx.moveTo(x - stepX * 0.6, yLower);
        ctx.lineTo(x, yCrypt);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(18,15,17,0.92)";
      ctx.fillRect(0, yCrypt, w, h - yCrypt);
      ctx.strokeStyle = "rgba(125,83,56,0.35)";
      ctx.beginPath();
      ctx.moveTo(0, yCrypt);
      ctx.lineTo(w, yCrypt);
      ctx.stroke();
      for (let s = 0; s < 7; s += 1) {
        const sx = w * (0.08 + s * 0.14);
        ctx.strokeStyle = s % 2 === 0 ? "rgba(236,229,213,0.18)" : "rgba(216,162,74,0.18)";
        ctx.beginPath();
        ctx.arc(sx, yCrypt + (h - yCrypt) * 0.55, 7 + (s % 3) * 3, 0.2, Math.PI * 1.25);
        ctx.stroke();
      }
    }

    function drawVitrineBox(ctx, r, accent) {
      ctx.fillStyle = "rgba(116,150,158,0.13)";
      ctx.strokeStyle = accent || PALETTE.vitrine_glass;
      ctx.lineWidth = 1.4;
      ctx.fillRect(-r * 0.68, -r * 0.68, r * 1.36, r * 1.24);
      ctx.strokeRect(-r * 0.68, -r * 0.68, r * 1.36, r * 1.24);
      ctx.strokeStyle = "rgba(240,201,120,0.38)";
      ctx.beginPath();
      ctx.moveTo(-r * 0.52, -r * 0.56);
      ctx.lineTo(-r * 0.22, -r * 0.26);
      ctx.stroke();
      ctx.fillStyle = PALETTE.opus_sectile;
      ctx.fillRect(-r * 0.74, r * 0.54, r * 1.48, r * 0.18);
      ctx.fillStyle = PALETTE.gilded_cornice;
      ctx.fillRect(-r * 0.18, r * 0.59, r * 0.36, r * 0.07);
    }

    function drawSilkCurtains(ctx, r, role, sway) {
      if (role === 0) {
        ctx.strokeStyle = PALETTE.gilded_cornice;
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(-r * 0.72, -r * 0.62); ctx.lineTo(r * 0.72, -r * 0.62); ctx.stroke();
        for (let side = -1; side <= 1; side += 2) {
          ctx.fillStyle = PALETTE.brocade_crimson;
          ctx.beginPath();
          ctx.moveTo(side * r * 0.06, -r * 0.6);
          ctx.lineTo(side * r * 0.65, -r * 0.6);
          ctx.quadraticCurveTo(side * r * 0.42, r * 0.05, side * r * 0.62, r * 0.62);
          ctx.lineTo(side * r * 0.24, r * 0.62);
          ctx.quadraticCurveTo(side * r * 0.36, -r * 0.02, side * r * 0.06, -r * 0.6);
          ctx.fill();
          ctx.strokeStyle = PALETTE.gilded_cornice;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      } else if (role === 1) {
        ctx.strokeStyle = PALETTE.wrought_rust;
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(-r * 0.65, r * 0.45); ctx.lineTo(r * 0.58, -r * 0.55); ctx.stroke();
        ctx.fillStyle = PALETTE.brocade_crimson;
        ctx.beginPath(); ctx.arc(r * 0.14, r * 0.08, r * 0.36, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = PALETTE.gilded_cornice;
        ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(-r * 0.06, -r * 0.22); ctx.lineTo(r * 0.28, -r * 0.34); ctx.stroke();
        ctx.fillStyle = "rgba(155,59,72,0.72)";
        ctx.fillRect(-r * 0.62, -r * 0.28, r * 0.42, r * 0.52);
      } else if (role === 2) {
        drawVitrineBox(ctx, r);
        ctx.fillStyle = PALETTE.brocade_crimson;
        ctx.beginPath();
        ctx.moveTo(-r * 0.36, -r * 0.28); ctx.lineTo(r * 0.32, -r * 0.22);
        ctx.lineTo(r * 0.26, r * 0.28); ctx.lineTo(-r * 0.32, r * 0.22);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = PALETTE.gilded_cornice;
        ctx.strokeRect(-r * 0.22, -r * 0.12, r * 0.42, r * 0.24);
      } else {
        ctx.strokeStyle = PALETTE.limewash_patina;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-r * 0.62, r * 0.58); ctx.lineTo(-r * 0.62, -r * 0.42);
        ctx.moveTo(r * 0.62, r * 0.58); ctx.lineTo(r * 0.62, -r * 0.34);
        ctx.stroke();
        for (let k = 0; k < 4; k += 1) {
          ctx.fillStyle = k % 2 === 0 ? PALETTE.brocade_crimson : PALETTE.gilded_cornice;
          const x0 = -r * 0.62 + k * r * 0.31;
          ctx.beginPath();
          ctx.moveTo(x0, -r * 0.42 + k * 2);
          ctx.lineTo(x0 + r * 0.32, -r * 0.36 + k * 2);
          ctx.quadraticCurveTo(x0 + r * 0.16, -r * 0.1 + sway * 5, x0, -r * 0.14);
          ctx.closePath(); ctx.fill();
        }
      }
    }

    function drawFuneraryUrns(ctx, r, role, sway) {
      if (role === 0) {
        ctx.fillStyle = PALETTE.limewash_patina;
        ctx.fillRect(-r * 0.46, r * 0.36, r * 0.92, r * 0.24);
        ctx.fillStyle = PALETTE.pentelic_marble;
        ctx.beginPath();
        ctx.ellipse(0, -r * 0.02, r * 0.34, r * 0.42, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(-r * 0.22, -r * 0.56, r * 0.44, r * 0.14);
        ctx.strokeStyle = PALETTE.gilded_cornice;
        ctx.beginPath(); ctx.arc(0, -r * 0.04, r * 0.24, 0.2, Math.PI - 0.2); ctx.stroke();
      } else if (role === 1) {
        ctx.fillStyle = PALETTE.pentelic_marble;
        ctx.beginPath();
        ctx.moveTo(-r * 0.36, -r * 0.04); ctx.lineTo(-r * 0.12, r * 0.08);
        ctx.lineTo(r * 0.14, -r * 0.08); ctx.lineTo(r * 0.36, r * 0.02);
        ctx.quadraticCurveTo(r * 0.32, r * 0.54, 0, r * 0.56);
        ctx.quadraticCurveTo(-r * 0.32, r * 0.54, -r * 0.36, -r * 0.04);
        ctx.fill();
        for (let b = -2; b <= 2; b += 1) {
          const bx = b * r * 0.13 + sway * 4;
          ctx.strokeStyle = PALETTE.basil_shoot;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(b * r * 0.07, 0); ctx.quadraticCurveTo(bx, -r * 0.28, bx * 1.2, -r * 0.52); ctx.stroke();
          ctx.fillStyle = PALETTE.basil_shoot;
          ctx.beginPath(); ctx.ellipse(bx * 1.15, -r * 0.48, r * 0.11, r * 0.06, b * 0.3, 0, Math.PI * 2); ctx.fill();
        }
      } else if (role === 2) {
        drawVitrineBox(ctx, r);
        ctx.strokeStyle = PALETTE.gilded_cornice;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, r * 0.52); ctx.lineTo(0, -r * 0.38);
        ctx.moveTo(-r * 0.26, -r * 0.14); ctx.lineTo(r * 0.26, -r * 0.14);
        ctx.stroke();
        ctx.fillStyle = PALETTE.pentelic_marble;
        ctx.beginPath(); ctx.arc(0, -r * 0.08, r * 0.25, -0.5, 2.2); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = PALETTE.limewash_patina;
        ctx.fillRect(-r * 0.22, -r * 0.68, r * 0.44, r * 0.66);
        ctx.fillStyle = PALETTE.pentelic_marble;
        ctx.beginPath(); ctx.ellipse(0, r * 0.26, r * 0.34, r * 0.28, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(-r * 0.38, -r * 0.04, r * 0.76, r * 0.09);
      }
    }

    function drawHaremGratings(ctx, r, role, sway) {
      if (role === 0) {
        ctx.fillStyle = "rgba(240,201,120,0.22)";
        ctx.beginPath();
        ctx.moveTo(-r * 0.48, r * 0.54); ctx.lineTo(-r * 0.48, -r * 0.15);
        ctx.quadraticCurveTo(0, -r * 0.68, r * 0.48, -r * 0.15);
        ctx.lineTo(r * 0.48, r * 0.54); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = PALETTE.wrought_rust;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        for (let g = -2; g <= 2; g += 1) {
          ctx.beginPath();
          ctx.moveTo(g * r * 0.18, -r * 0.36 + Math.abs(g) * r * 0.09);
          ctx.lineTo(g * r * 0.18, r * 0.52);
          ctx.stroke();
        }
      } else if (role === 1) {
        ctx.strokeStyle = PALETTE.gilded_cornice;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(-r * 0.42, r * 0.54); ctx.lineTo(r * 0.38, r * 0.34);
        ctx.moveTo(-r * 0.35, r * 0.34); ctx.lineTo(r * 0.44, r * 0.54);
        ctx.stroke();
        ctx.fillStyle = "rgba(216,162,74,0.68)";
        ctx.beginPath(); ctx.arc(0, r * 0.38, r * 0.22, Math.PI, 0); ctx.fill();
        ctx.strokeStyle = "#3c2b24";
        ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(-r * 0.62, r * 0.16); ctx.lineTo(r * 0.62, r * 0.16); ctx.stroke();
        ctx.fillStyle = PALETTE.brocade_crimson;
        ctx.fillRect(-r * 0.32, r * 0.04, r * 0.62, r * 0.11);
        for (let i = 0; i < 5; i += 1) {
          const e = embers[i];
          ctx.fillStyle = PALETTE.candle_crystal;
          ctx.fillRect((e.u - 0.5) * r * 0.8, r * 0.32 - e.v * r * 0.72, 2.3, 2.3);
        }
        for (let wIdx = 0; wIdx < 4; wIdx += 1) {
          const sw = smokeWisps[wIdx];
          ctx.fillStyle = "rgba(207,196,174," + (0.26 * (1 - sw.u)).toFixed(2) + ")";
          ctx.beginPath();
          ctx.arc(sw.drift * r * 0.9 * sw.u, -sw.u * r * 0.75, r * (0.09 + sw.u * 0.18), 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (role === 2) {
        drawVitrineBox(ctx, r);
        ctx.strokeStyle = PALETTE.wrought_rust;
        ctx.lineWidth = 1.6;
        ctx.strokeRect(-r * 0.42, -r * 0.42, r * 0.84, r * 0.76);
        ctx.beginPath(); ctx.arc(0, -r * 0.04, r * 0.28, 0, Math.PI * 2); ctx.stroke();
      } else {
        ctx.strokeStyle = PALETTE.gilded_cornice;
        ctx.lineWidth = 1.6;
        for (let i = -2; i <= 2; i += 1) {
          ctx.beginPath();
          ctx.moveTo(i * r * 0.22, -r * 0.54); ctx.lineTo(i * r * 0.22, r * 0.54);
          ctx.moveTo(-r * 0.52, i * r * 0.22); ctx.lineTo(r * 0.52, i * r * 0.22);
          ctx.stroke();
        }
        ctx.strokeStyle = PALETTE.basil_shoot;
        ctx.lineWidth = 2.2;
        ctx.beginPath(); ctx.moveTo(-r * 0.45, r * 0.52); ctx.bezierCurveTo(-r * 0.1, 0, r * 0.2, -r * 0.2, r * 0.4 + sway * 4, -r * 0.48); ctx.stroke();
        ctx.fillStyle = PALETTE.basil_shoot;
        ctx.beginPath(); ctx.ellipse(r * 0.16, r * 0.14, r * 0.19, r * 0.14, 0.2, 0, Math.PI * 2); ctx.fill();
      }
    }

    function drawCapitalShape(ctx, r, upsideDown) {
      ctx.save();
      if (upsideDown) ctx.scale(1, -1);
      ctx.fillStyle = PALETTE.gilded_cornice;
      ctx.fillRect(-r * 0.56, -r * 0.48, r * 1.12, r * 0.12);
      ctx.fillStyle = PALETTE.pentelic_marble;
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, -r * 0.36); ctx.lineTo(r * 0.5, -r * 0.36);
      ctx.lineTo(r * 0.34, r * 0.42); ctx.lineTo(-r * 0.34, r * 0.42);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = PALETTE.limewash_patina;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(-r * 0.42, -r * 0.26, r * 0.13, 0, Math.PI * 1.75);
      ctx.moveTo(r * 0.55, -r * 0.26);
      ctx.arc(r * 0.42, -r * 0.26, r * 0.13, 0, Math.PI * 1.75);
      ctx.stroke();
      for (let a = -1; a <= 1; a += 1) {
        ctx.beginPath();
        ctx.arc(a * r * 0.2, r * 0.16, r * 0.14, Math.PI, 0);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawCorinthianCapitals(ctx, r, role, peck) {
      if (role === 0) {
        ctx.fillStyle = PALETTE.limewash_patina;
        ctx.fillRect(-r * 0.3, r * 0.36, r * 0.6, r * 0.34);
        drawCapitalShape(ctx, r * 0.95, false);
      } else if (role === 1) {
        ctx.fillStyle = "rgba(125,83,56,0.45)";
        ctx.beginPath(); ctx.ellipse(0, r * 0.42, r * 0.82, r * 0.24, 0, 0, Math.PI * 2); ctx.fill();
        ctx.save(); ctx.translate(-r * 0.08, r * 0.1); ctx.rotate(0.56);
        drawCapitalShape(ctx, r * 0.78, false);
        ctx.restore();
        ctx.strokeStyle = "rgba(207,196,174,0.34)";
        ctx.lineWidth = 1;
        for (let m = -3; m <= 3; m += 1) {
          ctx.beginPath(); ctx.moveTo(m * r * 0.24, -r * 0.2); ctx.lineTo(m * r * 0.24, r * 0.58); ctx.stroke();
        }
        for (let hIdx = 0; hIdx < 2; hIdx += 1) {
          const hx = hIdx === 0 ? r * 0.46 : -r * 0.52;
          const dir = hIdx === 0 ? -1 : 1;
          const dip = Math.abs(Math.sin(peck + hIdx * 1.7)) * r * 0.16;
          ctx.fillStyle = hIdx === 0 ? PALETTE.pentelic_marble : PALETTE.wrought_rust;
          ctx.beginPath(); ctx.ellipse(hx, r * 0.32, r * 0.16, r * 0.12, 0, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(hx + dir * r * 0.15, r * 0.24 + dip, r * 0.07, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = PALETTE.brocade_crimson;
          ctx.fillRect(hx + dir * r * 0.13, r * 0.15 + dip, 4, 4);
        }
      } else if (role === 2) {
        ctx.fillStyle = "rgba(240,201,120,0.16)";
        ctx.beginPath(); ctx.moveTo(-r * 0.25, -r * 0.82); ctx.lineTo(r * 0.25, -r * 0.82);
        ctx.lineTo(r * 0.72, r * 0.58); ctx.lineTo(-r * 0.72, r * 0.58); ctx.closePath(); ctx.fill();
        drawVitrineBox(ctx, r * 1.05, PALETTE.vitrine_glass);
        ctx.fillStyle = PALETTE.brocade_crimson;
        ctx.fillRect(-r * 0.52, r * 0.34, r * 1.04, r * 0.22);
        ctx.save(); ctx.translate(0, -r * 0.02);
        drawCapitalShape(ctx, r * 0.76, false);
        ctx.restore();
      } else {
        ctx.strokeStyle = PALETTE.vitrine_glass;
        ctx.fillStyle = "rgba(116,150,158,0.24)";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-r * 0.82, -r * 0.58); ctx.lineTo(r * 0.82, -r * 0.32);
        ctx.lineTo(r * 0.82, -r * 0.2); ctx.lineTo(-r * 0.82, -r * 0.46); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.save(); ctx.translate(0, r * 0.14);
        drawCapitalShape(ctx, r * 0.82, true);
        ctx.restore();
        for (let m = -1; m <= 1; m += 2) {
          ctx.fillStyle = PALETTE.basil_shoot;
          ctx.beginPath(); ctx.ellipse(m * r * 0.54, r * 0.45, r * 0.2, r * 0.14, 0, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = PALETTE.candle_crystal;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(m * r * 0.38, r * 0.45); ctx.lineTo(m * r * 0.7, r * 0.45); ctx.stroke();
        }
      }
    }

    function drawVelvetBellJars(ctx, r, role) {
      if (role === 0) {
        ctx.fillStyle = PALETTE.brocade_crimson;
        ctx.fillRect(-r * 0.46, r * 0.36, r * 0.92, r * 0.16);
        ctx.fillStyle = PALETTE.gilded_cornice;
        ctx.beginPath(); ctx.arc(0, r * 0.12, r * 0.16, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(116,150,158,0.22)";
        ctx.strokeStyle = PALETTE.vitrine_glass;
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(0, -r * 0.04, r * 0.38, Math.PI, 0);
        ctx.lineTo(r * 0.38, r * 0.36); ctx.lineTo(-r * 0.38, r * 0.36); ctx.closePath();
        ctx.fill(); ctx.stroke();
      } else if (role === 1) {
        ctx.fillStyle = PALETTE.gilded_cornice;
        ctx.fillRect(-r * 0.2, r * 0.24, r * 0.38, r * 0.14);
        ctx.fillStyle = "rgba(116,150,158,0.25)";
        ctx.strokeStyle = PALETTE.vitrine_glass;
        ctx.beginPath(); ctx.arc(0, r * 0.06, r * 0.36, Math.PI, 0);
        ctx.lineTo(r * 0.36, r * 0.42); ctx.lineTo(-r * 0.36, r * 0.42); ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#594842";
        ctx.beginPath(); ctx.ellipse(r * 0.54, r * 0.38, r * 0.15, r * 0.08, 0, 0, Math.PI * 2); ctx.fill();
      } else if (role === 2) {
        drawVitrineBox(ctx, r);
        ctx.strokeStyle = PALETTE.vitrine_glass;
        ctx.beginPath(); ctx.arc(0, -r * 0.02, r * 0.32, Math.PI, 0);
        ctx.lineTo(r * 0.32, r * 0.38); ctx.lineTo(-r * 0.32, r * 0.38); ctx.closePath(); ctx.stroke();
        ctx.fillStyle = PALETTE.vitrine_glass;
        ctx.beginPath(); ctx.moveTo(-r * 0.16, r * 0.28); ctx.lineTo(0, -r * 0.04); ctx.lineTo(r * 0.18, r * 0.26); ctx.closePath(); ctx.fill();
      } else {
        ctx.fillStyle = PALETTE.limewash_patina;
        ctx.fillRect(-r * 0.44, r * 0.3, r * 0.88, r * 0.26);
        ctx.fillStyle = PALETTE.basil_shoot;
        ctx.beginPath(); ctx.arc(-r * 0.06, r * 0.08, r * 0.18, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = PALETTE.candle_crystal;
        ctx.beginPath(); ctx.arc(r * 0.1, r * 0.04, r * 0.09, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = PALETTE.vitrine_glass;
        ctx.fillStyle = "rgba(240,201,120,0.14)";
        ctx.beginPath(); ctx.arc(0, 0, r * 0.36, Math.PI, 0);
        ctx.lineTo(r * 0.36, r * 0.3); ctx.lineTo(-r * 0.36, r * 0.3); ctx.closePath();
        ctx.fill(); ctx.stroke();
      }
    }

    function drawSilverTureens(ctx, r, role, ripple) {
      ctx.fillStyle = role === 1 ? "#8c8984" : PALETTE.pentelic_marble;
      ctx.beginPath(); ctx.ellipse(0, r * 0.16, r * 0.46, r * 0.24, 0, 0, Math.PI); ctx.fill();
      ctx.fillRect(-r * 0.22, r * 0.38, r * 0.44, r * 0.09);
      if (role === 0) {
        ctx.beginPath(); ctx.ellipse(0, r * 0.14, r * 0.44, r * 0.18, 0, Math.PI, 0); ctx.fill();
        ctx.fillStyle = PALETTE.candle_crystal;
        ctx.beginPath(); ctx.arc(0, -r * 0.08, r * 0.07, 0, Math.PI * 2); ctx.fill();
      } else if (role === 1) {
        ctx.strokeStyle = PALETTE.vitrine_glass;
        ctx.lineWidth = 1.4;
        const dropY = -r * 0.52 + (ripple % 1) * r * 0.62;
        ctx.beginPath(); ctx.moveTo(0, dropY); ctx.lineTo(0, dropY + 7); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, r * 0.15, r * 0.14 + (ripple % 1) * r * 0.22, r * 0.06, 0, 0, Math.PI * 2); ctx.stroke();
      } else if (role === 2) {
        drawVitrineBox(ctx, r);
        ctx.fillStyle = PALETTE.pentelic_marble;
        ctx.beginPath(); ctx.ellipse(0, r * 0.16, r * 0.38, r * 0.2, 0, 0, Math.PI * 2); ctx.fill();
      } else {
        for (let p = -2; p <= 2; p += 1) {
          ctx.fillStyle = p % 2 === 0 ? PALETTE.brocade_crimson : "#e5dde0";
          ctx.beginPath(); ctx.arc(p * r * 0.13, r * 0.06 - (1 - Math.abs(p) * 0.3) * r * 0.12, r * 0.11, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    function drawGildedCornices(ctx, r, role) {
      if (role === 0) {
        ctx.fillStyle = PALETTE.gilded_cornice;
        ctx.fillRect(-r * 0.68, -r * 0.24, r * 1.36, r * 0.22);
        ctx.fillStyle = PALETTE.wrought_rust;
        for (let d = -5; d <= 5; d += 1) {
          ctx.fillRect(d * r * 0.11 - 2, -r * 0.02, 5, r * 0.12);
        }
      } else if (role === 1) {
        for (let k = -2; k <= 2; k += 1) {
          ctx.save(); ctx.rotate(k * 0.28);
          ctx.fillStyle = k % 2 === 0 ? PALETTE.gilded_cornice : PALETTE.wrought_rust;
          ctx.fillRect(-r * 0.52, r * 0.1, r * 1.04, r * 0.11);
          ctx.restore();
        }
        ctx.fillStyle = PALETTE.brocade_crimson;
        ctx.beginPath(); ctx.arc(0, r * 0.14, r * 0.2, Math.PI, 0); ctx.fill();
      } else if (role === 2) {
        drawVitrineBox(ctx, r);
        ctx.fillStyle = PALETTE.gilded_cornice;
        ctx.beginPath();
        ctx.moveTo(-r * 0.44, -r * 0.12); ctx.lineTo(r * 0.36, -r * 0.08);
        ctx.lineTo(r * 0.22, r * 0.14); ctx.lineTo(-r * 0.44, r * 0.12); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#261e1c";
        ctx.fillRect(r * 0.14, -r * 0.09, r * 0.22, r * 0.21);
      } else {
        ctx.strokeStyle = PALETTE.pentelic_marble;
        ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(0, r * 0.48, r * 0.56, Math.PI, 0); ctx.stroke();
        ctx.save(); ctx.translate(-r * 0.24, -r * 0.14); ctx.rotate(-0.18);
        ctx.fillStyle = PALETTE.gilded_cornice; ctx.fillRect(-r * 0.36, -r * 0.1, r * 0.72, r * 0.16);
        ctx.restore();
        ctx.save(); ctx.translate(r * 0.26, -r * 0.08); ctx.rotate(0.24);
        ctx.fillStyle = PALETTE.gilded_cornice; ctx.fillRect(-r * 0.34, -r * 0.1, r * 0.68, r * 0.15);
        ctx.restore();
      }
    }

    function drawCrystalChandeliers(ctx, r, role) {
      if (role === 0) {
        ctx.strokeStyle = PALETTE.gilded_cornice;
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(0, -r * 0.68); ctx.lineTo(0, r * 0.12); ctx.stroke();
        for (let t = 0; t < 2; t += 1) {
          const wTier = r * (0.58 - t * 0.2);
          const yTier = -r * 0.16 + t * r * 0.24;
          ctx.beginPath(); ctx.moveTo(-wTier, yTier); ctx.lineTo(wTier, yTier); ctx.stroke();
          for (let c = -2; c <= 2; c += 1) {
            ctx.fillStyle = PALETTE.candle_crystal;
            ctx.beginPath(); ctx.arc(c * wTier * 0.45, yTier + r * 0.1, 3.2, 0, Math.PI * 2); ctx.fill();
          }
        }
      } else if (role === 1) {
        ctx.fillStyle = "rgba(125,83,56,0.5)";
        ctx.fillRect(-r * 0.54, r * 0.14, r * 1.08, r * 0.34);
        for (let b = 0; b < 7; b += 1) {
          ctx.fillStyle = b % 2 === 0 ? PALETTE.candle_crystal : PALETTE.vitrine_glass;
          ctx.beginPath();
          ctx.arc(-r * 0.38 + b * r * 0.13, r * (0.25 + (b % 2) * 0.09), 3.6, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (role === 2) {
        drawVitrineBox(ctx, r);
        for (let p = -2; p <= 2; p += 1) {
          const px = p * r * 0.18;
          const py = -r * 0.1 + Math.abs(p) * r * 0.1;
          ctx.strokeStyle = "rgba(236,229,213,0.4)";
          ctx.beginPath(); ctx.moveTo(px, -r * 0.64); ctx.lineTo(px, py); ctx.stroke();
          ctx.fillStyle = PALETTE.candle_crystal;
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - 4, py + 9); ctx.lineTo(px + 4, py + 9); ctx.closePath(); ctx.fill();
        }
      } else {
        ctx.strokeStyle = PALETTE.vitrine_glass;
        ctx.beginPath(); ctx.moveTo(-r * 0.68, -r * 0.48); ctx.lineTo(r * 0.68, -r * 0.3); ctx.stroke();
        for (let c = -2; c <= 2; c += 1) {
          ctx.strokeStyle = c % 2 === 0 ? "rgba(240,201,120,0.38)" : "rgba(92,135,84,0.38)";
          ctx.beginPath(); ctx.moveTo(c * r * 0.14, -r * 0.12); ctx.lineTo(c * r * 0.34, r * 0.52); ctx.stroke();
          ctx.fillStyle = PALETTE.candle_crystal;
          ctx.beginPath(); ctx.arc(c * r * 0.14, -r * 0.12, 3.8, 0, Math.PI * 2); ctx.fill();
        }
      }
    }

    function drawDwarfPalmTubs(ctx, r, role, sway) {
      ctx.fillStyle = role === 3 ? PALETTE.brocade_crimson : PALETTE.limewash_patina;
      ctx.beginPath();
      ctx.moveTo(-r * 0.44, r * 0.02); ctx.lineTo(r * 0.44, r * 0.02);
      ctx.lineTo(r * 0.34, r * 0.52); ctx.lineTo(-r * 0.34, r * 0.52); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = PALETTE.gilded_cornice;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-r * 0.41, r * 0.18); ctx.lineTo(r * 0.41, r * 0.18); ctx.stroke();
      if (role === 0) {
        ctx.strokeStyle = PALETTE.basil_shoot;
        ctx.lineWidth = 2.2;
        for (let f = -2; f <= 2; f += 1) {
          ctx.beginPath(); ctx.moveTo(0, r * 0.02);
          ctx.quadraticCurveTo(f * r * 0.22 + sway * 3, -r * 0.38, f * r * 0.36 + sway * 5, -r * 0.22);
          ctx.stroke();
        }
      } else if (role === 1) {
        ctx.fillStyle = "rgba(116,150,158,0.65)";
        ctx.fillRect(-r * 0.38, r * 0.04, r * 0.76, r * 0.1);
        ctx.fillStyle = PALETTE.brocade_crimson;
        ctx.fillRect(r * 0.16, r * 0.02, r * 0.22, r * 0.28);
      } else if (role === 2) {
        ctx.strokeStyle = PALETTE.brocade_crimson;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-r * 0.62, r * 0.16); ctx.quadraticCurveTo(0, r * 0.34, r * 0.62, r * 0.16); ctx.stroke();
        ctx.fillStyle = PALETTE.gilded_cornice;
        ctx.fillRect(-r * 0.65, r * 0.08, 4, r * 0.46);
        ctx.fillRect(r * 0.61, r * 0.08, 4, r * 0.46);
      } else {
        ctx.save(); ctx.translate(0, -r * 0.14);
        drawCapitalShape(ctx, r * 0.52, true);
        ctx.restore();
      }
    }

    function renderStage(ctx, width, height, params) {
      const p = params || {};
      const layout = getLayout(width, height);
      if (!ctx) return layout.stations;
      const w = layout.width;
      const h = layout.height;
      const reduced = p.reducedMotion !== undefined ? Boolean(p.reducedMotion) : Boolean(config.reducedMotion);
      const t = reduced ? 0 : clock;
      const sway = reduced ? 0 : Math.sin(t * 1.9);
      const peck = reduced ? 0.6 : t * 5.2;

      ctx.save();
      drawBackdrop(ctx, w, h, p.phase);

      for (let m = 0; m < vitrineMotes.length; m += 1) {
        const mt = vitrineMotes[m];
        ctx.fillStyle = "rgba(240,201,120,0.22)";
        ctx.beginPath(); ctx.arc(mt.x * w, mt.y * h * 0.88, mt.r, 0, Math.PI * 2); ctx.fill();
      }

      const outStations = [];
      for (let i = 0; i < layout.stations.length; i += 1) {
        const st = layout.stations[i];
        const role = resolveRoleIndex(st.id, p);
        const regime = ERA_REGIMES[role] || ERA_REGIMES[0];
        const isHover = p.hoveredId === st.id;
        const isSel = p.selectedId === st.id;
        const r = st.hitRadius;

        ctx.save();
        ctx.translate(st.x, st.y);

        const aura = ctx.createRadialGradient(0, 0, r * 0.12, 0, 0, r * 1.18);
        aura.addColorStop(0, isSel ? "rgba(240,201,120,0.24)" : "rgba(236,229,213,0.07)");
        aura.addColorStop(1, "rgba(18,15,17,0)");
        ctx.fillStyle = aura;
        ctx.beginPath(); ctx.arc(0, 0, r * 1.18, 0, Math.PI * 2); ctx.fill();

        if (isSel || isHover || pulseLevel > 0.05) {
          ctx.strokeStyle = isSel ? PALETTE.candle_crystal : regime.accent;
          ctx.lineWidth = isSel ? 2.2 : 1.4;
          ctx.beginPath(); ctx.arc(0, 0, r * (isSel ? 1.04 : 0.96), 0, Math.PI * 2); ctx.stroke();
        }

        if (st.id === "silk_brocade_curtains") drawSilkCurtains(ctx, r, role, sway);
        else if (st.id === "marble_funerary_urns") drawFuneraryUrns(ctx, r, role, sway);
        else if (st.id === "wrought_harem_gratings") drawHaremGratings(ctx, r, role, sway);
        else if (st.id === "corinthian_capitals") drawCorinthianCapitals(ctx, r, role, peck);
        else if (st.id === "velvet_bell_jars") drawVelvetBellJars(ctx, r, role);
        else if (st.id === "silver_soup_tureens") drawSilverTureens(ctx, r, role, t * 0.85);
        else if (st.id === "gilded_cornices") drawGildedCornices(ctx, r, role);
        else if (st.id === "crystal_chandeliers") drawCrystalChandeliers(ctx, r, role);
        else drawDwarfPalmTubs(ctx, r, role, sway);

        const badgeText = w >= 620 ? ("[" + st.keyNum + "] " + regime.shortLabel) : ("[" + st.keyNum + "]");
        ctx.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
        const bw = ctx.measureText(badgeText).width + 10;
        const bx = -r * 0.88;
        const by = -r * 0.92;
        ctx.fillStyle = "rgba(18,15,17,0.88)";
        ctx.strokeStyle = isSel ? PALETTE.candle_crystal : regime.accent;
        ctx.lineWidth = 1.1;
        ctx.fillRect(bx, by, bw, 16);
        ctx.strokeRect(bx, by, bw, 16);
        ctx.fillStyle = PALETTE.pentelic_marble;
        ctx.textBaseline = "middle";
        ctx.fillText(badgeText, bx + 5, by + 8.5);

        ctx.restore();
        outStations.push(Object.assign({}, st, { roleIndex: role, regimeKey: regime.key }));
      }
      ctx.restore();
      return outStations;
    }

    return {
      ERA_REGIMES: ERA_REGIMES,
      RELIC_IDS: RELIC_IDS,
      RELIC_CATALOG: RELIC_CATALOG,
      getLayout: getLayout,
      step: step,
      renderStage: renderStage,
      hitTest: hitTest,
      createAudioEngine: createAudioEngine
    };
  }

  const api = Object.freeze({
    PALETTE: PALETTE,
    CONSERVED_SHARD_MASS: CONSERVED_SHARD_MASS,
    ERA_REGIMES: ERA_REGIMES,
    RELIC_IDS: RELIC_IDS,
    RELIC_CATALOG: RELIC_CATALOG,
    createAudioEngine: createAudioEngine,
    createRelicStage: createRelicStage
  });

  root.ClariceRelicPermutations = api;
  if (typeof window !== "undefined") {
    window.ClariceRelicPermutations = api;
  }
  if (typeof module === "object" && module && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
