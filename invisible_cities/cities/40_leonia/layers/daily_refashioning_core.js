/* City 40: Leonia — Daily Morning Refashioning & Angelic Street-Cleaner Core */
globalThis.LeoniaMorningCore = (function () {
  "use strict";

  const DECOMPOSITION_RATE = 0;

  const PALETTE = Object.freeze({
    dawn_gleam_ivory: "#f6f3ea",
    fresh_linen_cyan: "#d7eef2",
    soap_pearl_mint: "#9fd8cb",
    angelic_gold: "#d8ae5e",
    plastic_bag_obsidian: "#181b20",
    scarp_slate_cuirass: "#363b45",
    porcelain_cobalt: "#4d7498",
    rust_tin_ochre: "#b85d38",
    tire_ash_charcoal: "#23262d",
    cataclysm_crimson: "#c93b2b",
    ink_parchment: "#111318"
  });

  const RITE_PHASES = Object.freeze([
    "dawn_unwrapping",
    "curbside_bagging",
    "angelic_procession",
    "cleansed_gleam"
  ]);

  const MATERIAL_TIERS = Object.freeze([
    Object.freeze({ level: 1, numeral: "I", name: "Glazed Celluloid & Crisp Linen", massFactor: 1.0, gleamBoost: 0.0 }),
    Object.freeze({ level: 2, numeral: "II", name: "Vulcanized Polymer & Enamel", massFactor: 1.22, gleamBoost: 0.14 }),
    Object.freeze({ level: 3, numeral: "III", name: "Vitreous Resin & Soldered Tin", massFactor: 1.46, gleamBoost: 0.28 }),
    Object.freeze({ level: 4, numeral: "IV", name: "Impervious Fluoropolymer Weave", massFactor: 1.72, gleamBoost: 0.42 }),
    Object.freeze({ level: 5, numeral: "V", name: "Unburnable Eternal Synthetics", massFactor: 2.02, gleamBoost: 0.58 })
  ]);

  const MORNING_NOVELTIES = Object.freeze([
    Object.freeze({
      id: "fresh_sheets",
      index: 0,
      title: "Fresh Morning Sheets",
      freshState: "Crisp uncreased pearl-linen hung along radial dawn balconies",
      discardedYesterday: "Once-slept bedsheets knotted inside glossy black plastic",
      baseTonnes: 6.8,
      gleamColor: PALETTE.fresh_linen_cyan,
      ritualInscription: "Every sunrise Leonia wakes between immaculate sheets woven overnight, casting yesterday's linen to the curb."
    }),
    Object.freeze({
      id: "unwrapped_soap",
      index: 1,
      title: "Just-Unwrapped Soap",
      freshState: "Sharp-edged mint-pearl cake slit fresh from wax-sealed foil",
      discardedYesterday: "Half-lathered soap cakes and squeezed toothpaste tubes",
      baseTonnes: 5.4,
      gleamColor: PALETTE.soap_pearl_mint,
      ritualInscription: "Hands wash only with soap never touched before; recurrent impurity is sealed away before the foam cools."
    }),
    Object.freeze({
      id: "brand_new_attire",
      index: 2,
      title: "Brand-New Attire",
      freshState: "Unworn morning weave cut with factory lustre intact",
      discardedYesterday: "Yesterday's coats, collars, and rollerskates bagged whole",
      baseTonnes: 8.2,
      gleamColor: PALETTE.dawn_gleam_ivory,
      ritualInscription: "Citizens dress in brand-new clothing at every dawn, measuring opulence by how swiftly garments are expelled."
    }),
    Object.freeze({
      id: "unopened_tins_fridge",
      index: 3,
      title: "Unopened Tins & Latest Fridge",
      freshState: "Mirror-sealed tins lifted from this morning's cobalt refrigerator",
      discardedYesterday: "Punctured canisters, porcelain dinner services, and iron boilers",
      baseTonnes: 11.6,
      gleamColor: PALETTE.porcelain_cobalt,
      ritualInscription: "Unopened tins emerge from the latest refrigerator while yesterday's porcelain services wait in black shrouds."
    }),
    Object.freeze({
      id: "latest_model_radio",
      index: 4,
      title: "Latest-Model Radio Jingles",
      freshState: "Gilded polymer receiver chiming bright dawn commercial jingles",
      discardedYesterday: "Superseded radios, burned-out lightbulbs, and grand pianos",
      baseTonnes: 9.5,
      gleamColor: PALETTE.angelic_gold,
      ritualInscription: "Sparkling commercial jingles ring from the latest-model radio as silent street cleaners gather yesterday's pianos."
    })
  ]);

  const DISCARDED_REMAINS = Object.freeze([
    Object.freeze({
      id: "squeezed_toothpaste",
      label: "Squeezed Toothpaste Tubes",
      silhouetteKind: "toothpaste",
      relicType: "squeezed_toothpaste",
      baseMassTonnes: 2.8,
      sacerdotallySealed: true,
      description: "Flattened morning paste tubes coiled inside clean obsidian plastic."
    }),
    Object.freeze({
      id: "burned_lightbulbs",
      label: "Burned-Out Lightbulbs",
      silhouetteKind: "lightbulb",
      relicType: "burned_lightbulbs",
      baseMassTonnes: 3.4,
      sacerdotallySealed: true,
      description: "Darkened glass globes and unbroken tungsten stems awaiting the silent wagon."
    }),
    Object.freeze({
      id: "yesterday_newspapers",
      label: "Yesterday's Newspapers",
      silhouetteKind: "newspapers",
      relicType: "plastic_wrappings",
      baseMassTonnes: 4.6,
      sacerdotallySealed: true,
      description: "Day-old broadsheets sealed against memory in lustrous polymer sacks."
    }),
    Object.freeze({
      id: "tin_containers_wrappings",
      label: "Tin Containers & Wrappings",
      silhouetteKind: "containers",
      relicType: "plastic_wrappings",
      baseMassTonnes: 5.5,
      sacerdotallySealed: true,
      description: "Impervious canisters and synthetic foil resisting rot, rust, and flame."
    }),
    Object.freeze({
      id: "cast_iron_boilers",
      label: "Cast-Iron Boilers",
      silhouetteKind: "boiler",
      relicType: "cast_iron_boilers",
      baseMassTonnes: 7.4,
      sacerdotallySealed: true,
      description: "Riveted domestic boilers set whole upon the curb in heavy black shrouds."
    }),
    Object.freeze({
      id: "bound_encyclopedias",
      label: "Bound Encyclopedias",
      silhouetteKind: "encyclopedias",
      relicType: "bound_encyclopedias",
      baseMassTonnes: 6.2,
      sacerdotallySealed: true,
      description: "Complete gilded reference volumes superseded overnight, stacked square under taut film."
    }),
    Object.freeze({
      id: "grand_pianos",
      label: "Grand Pianos",
      silhouetteKind: "piano",
      relicType: "grand_pianos",
      baseMassTonnes: 8.6,
      sacerdotallySealed: true,
      description: "Three-legged concert pianos wrapped in clean black plastic along the radial boulevard."
    }),
    Object.freeze({
      id: "porcelain_services",
      label: "Porcelain Dinner Services",
      silhouetteKind: "porcelain",
      relicType: "porcelain_services",
      baseMassTonnes: 5.0,
      sacerdotallySealed: true,
      description: "Cobalt-rimmed tureens and thirty-six plates nested intact for angelic removal."
    })
  ]);

  const TAU = Math.PI * 2;
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function clamp01(v) { return clamp(Number.isFinite(v) ? v : 0, 0, 1); }
  function seededNoise(seed) {
    const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function createAudioEngine(initialMuted) {
    let muted = Boolean(initialMuted);
    let ctx = null;

    function ensureCtx() {
      if (muted) return null;
      if (ctx) {
        if (ctx.state === "suspended" && typeof ctx.resume === "function") {
          try { ctx.resume().catch(function () {}); } catch (_e) {}
        }
        return ctx;
      }
      const G = typeof globalThis !== "undefined" ? globalThis : {};
      const AC = G.AudioContext || G.webkitAudioContext;
      if (!AC) return null;
      try {
        ctx = new AC();
        if (ctx.state === "suspended" && typeof ctx.resume === "function") {
          ctx.resume().catch(function () {});
        }
      } catch (_e) {
        ctx = null;
      }
      return ctx;
    }

    function scheduleTone(ac, freq, startOffset, dur, peakGain, waveType) {
      try {
        const now = ac.currentTime + startOffset;
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = waveType || "sine";
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, peakGain), now + Math.min(0.035, dur * 0.25));
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now);
        osc.stop(now + dur + 0.02);
      } catch (_e) {}
    }

    return {
      setMuted: function (flag) {
        muted = Boolean(flag);
        if (muted && ctx && ctx.state === "running" && typeof ctx.suspend === "function") {
          try { ctx.suspend().catch(function () {}); } catch (_e) {}
        }
        return muted;
      },
      toggleMute: function () {
        return this.setMuted(!muted);
      },
      isMuted: function () {
        return muted;
      },
      playDawnChime: function (skillLevel) {
        const ac = ensureCtx();
        if (!ac) return false;
        const lvl = clamp(skillLevel || 1, 1, 5);
        const jingle = [523.25, 659.25, 783.99, 987.77, 1174.66 + lvl * 28];
        for (let i = 0; i < jingle.length; i++) {
          scheduleTone(ac, jingle[i], i * 0.065, 0.26, 0.045, i < 3 ? "triangle" : "sine");
        }
        scheduleTone(ac, 1567.98, 0.22, 0.34, 0.028, "sine");
        return true;
      },
      playAngelicRite: function () {
        const ac = ensureCtx();
        if (!ac) return false;
        const choir = [220.0, 329.63, 440.0, 659.25];
        for (let i = 0; i < choir.length; i++) {
          scheduleTone(ac, choir[i], 0.34 + i * 0.04, 0.68, 0.022, "sine");
        }
        return true;
      },
      playUpgradeShimmer: function (skillLevel) {
        const ac = ensureCtx();
        if (!ac) return false;
        const lvl = clamp(skillLevel || 1, 1, 5);
        const base = 440 * Math.pow(1.12, lvl - 1);
        const ratios = [1, 1.25, 1.5, 2.0];
        for (let i = 0; i < ratios.length; i++) {
          scheduleTone(ac, base * ratios[i], i * 0.045, 0.32, 0.036, "sine");
        }
        return true;
      },
      playCataclysmChord: function () {
        const ac = ensureCtx();
        if (!ac) return false;
        const cluster = [55.0, 61.74, 82.41, 116.54, 155.56, 233.08];
        for (let i = 0; i < cluster.length; i++) {
          scheduleTone(ac, cluster[i], i * 0.03, 0.95, i < 2 ? 0.07 : 0.035, i < 2 ? "sawtooth" : "triangle");
        }
        return true;
      }
    };
  }

  function buildNovelties(dayIndex, skillLevel) {
    const tier = MATERIAL_TIERS[clamp(skillLevel, 1, 5) - 1];
    return MORNING_NOVELTIES.map(function (n, idx) {
      return {
        id: n.id,
        index: n.index,
        title: n.title,
        freshState: n.freshState,
        discardedYesterday: n.discardedYesterday,
        baseTonnes: n.baseTonnes,
        currentTonnes: Number((n.baseTonnes * tier.massFactor).toFixed(2)),
        gleamColor: n.gleamColor,
        ritualInscription: n.ritualInscription,
        mintedDay: dayIndex,
        materialTierNumeral: tier.numeral,
        syntheticSheen: Number(Math.min(1, 0.42 + tier.gleamBoost).toFixed(2)),
        angleRad: -Math.PI * 0.5 + (idx * TAU) / MORNING_NOVELTIES.length
      };
    });
  }

  function buildSidewalkBags(dayIndex, skillLevel) {
    const tier = MATERIAL_TIERS[clamp(skillLevel, 1, 5) - 1];
    const count = 16 + clamp(skillLevel, 1, 5) * 2;
    const bags = [];
    for (let i = 0; i < count; i++) {
      const remain = DISCARDED_REMAINS[i % DISCARDED_REMAINS.length];
      const avenue = i % 8;
      const ringSlot = Math.floor(i / 8);
      const baseAngle = (avenue * TAU) / 8;
      const curbSide = (i % 2 === 0 ? 1 : -1) * (0.095 + ringSlot * 0.012);
      const radialFrac = clamp(0.35 + ringSlot * 0.21 + seededNoise(dayIndex * 19 + i * 7) * 0.08, 0.31, 0.85);
      bags.push({
        id: "bag_d" + dayIndex + "_" + i,
        remainId: remain.id,
        relicType: remain.relicType,
        label: remain.label,
        silhouetteKind: remain.silhouetteKind,
        description: remain.description,
        sacerdotallySealed: true,
        decompositionRate: 0,
        massTonnes: Number(((remain.baseMassTonnes * tier.massFactor) / 2.2).toFixed(2)),
        avenueIndex: avenue,
        angleRad: baseAngle + curbSide,
        radialFrac: radialFrac,
        sectionXFrac: -0.84 + ((i + 0.5) / count) * 1.68,
        scale: 0.88 + (remain.baseMassTonnes / 16)
      });
    }
    return bags;
  }

  function buildAngelicDustcarts(dayIndex, skillLevel) {
    const carts = [];
    for (let i = 0; i < 8; i++) {
      carts.push({
        id: "spazzino_" + (i + 1),
        avenueIndex: i,
        angleRad: (i * TAU) / 8,
        radialFrac: 0.28 + ((i * 0.09 + dayIndex * 0.07) % 0.56),
        speed: 0.14 + skillLevel * 0.015 + (i % 3) * 0.018,
        wingPhase: i * 0.8,
        bagLoad: 2 + (skillLevel > 3 ? 1 : 0)
      });
    }
    return carts;
  }

  function drawBagWithSilhouette(ctx, x, y, r, kind, sheenBoost, isSelected) {
    ctx.save();
    ctx.translate(x, y);
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.45, 0, TAU);
      ctx.strokeStyle = PALETTE.angelic_gold;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.moveTo(-r * 0.28, -r * 0.72);
    ctx.bezierCurveTo(-r * 1.05, -r * 0.45, -r * 1.08, r * 0.78, -r * 0.52, r * 0.92);
    ctx.lineTo(r * 0.55, r * 0.92);
    ctx.bezierCurveTo(r * 1.08, r * 0.76, r * 1.02, -r * 0.42, r * 0.28, -r * 0.72);
    ctx.closePath();
    ctx.fillStyle = PALETTE.plastic_bag_obsidian;
    ctx.fill();
    ctx.strokeStyle = "rgba(215, 238, 242, " + (0.34 + sheenBoost * 0.42).toFixed(2) + ")";
    ctx.lineWidth = 1.05;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-r * 0.16, -r * 0.72);
    ctx.lineTo(-r * 0.36, -r * 1.12);
    ctx.lineTo(0, -r * 0.84);
    ctx.lineTo(r * 0.36, -r * 1.12);
    ctx.lineTo(r * 0.16, -r * 0.72);
    ctx.fillStyle = PALETTE.plastic_bag_obsidian;
    ctx.fill();
    ctx.strokeStyle = PALETTE.angelic_gold;
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(-r * 0.24, -r * 0.72);
    ctx.lineTo(r * 0.24, -r * 0.72);
    ctx.stroke();

    ctx.strokeStyle = "rgba(246, 243, 234, 0.74)";
    ctx.lineWidth = Math.max(0.9, r * 0.11);
    ctx.beginPath();
    if (kind === "piano") {
      ctx.moveTo(-r * 0.52, r * 0.25);
      ctx.lineTo(-r * 0.52, -r * 0.22);
      ctx.quadraticCurveTo(r * 0.05, -r * 0.38, r * 0.52, r * 0.02);
      ctx.lineTo(r * 0.52, r * 0.25);
      ctx.closePath();
      ctx.moveTo(-r * 0.42, r * 0.25); ctx.lineTo(-r * 0.42, r * 0.62);
      ctx.moveTo(r * 0.38, r * 0.25); ctx.lineTo(r * 0.38, r * 0.62);
      ctx.moveTo(-r * 0.45, -r * 0.22); ctx.lineTo(r * 0.28, -r * 0.52);
    } else if (kind === "encyclopedias") {
      ctx.rect(-r * 0.48, -r * 0.36, r * 0.96, r * 0.24);
      ctx.rect(-r * 0.44, -r * 0.06, r * 0.88, r * 0.24);
      ctx.rect(-r * 0.50, r * 0.24, r * 1.00, r * 0.26);
    } else if (kind === "porcelain") {
      ctx.strokeStyle = "#8ab7dc";
      ctx.arc(0, r * 0.15, r * 0.42, Math.PI, 0);
      ctx.moveTo(-r * 0.56, r * 0.15); ctx.lineTo(r * 0.56, r * 0.15);
      ctx.moveTo(-r * 0.32, r * 0.48); ctx.lineTo(r * 0.32, r * 0.48);
    } else if (kind === "boiler") {
      ctx.rect(-r * 0.34, -r * 0.34, r * 0.68, r * 0.84);
      ctx.moveTo(0, -r * 0.34); ctx.lineTo(0, -r * 0.56);
    } else if (kind === "lightbulb") {
      ctx.arc(0, -r * 0.08, r * 0.34, 0, TAU);
      ctx.rect(-r * 0.16, r * 0.26, r * 0.32, r * 0.24);
    } else if (kind === "toothpaste") {
      ctx.moveTo(-r * 0.44, r * 0.36);
      ctx.quadraticCurveTo(-r * 0.1, -r * 0.38, r * 0.38, r * 0.08);
      ctx.rect(r * 0.34, -r * 0.02, r * 0.18, r * 0.18);
    } else if (kind === "containers") {
      ctx.rect(-r * 0.44, -r * 0.22, r * 0.38, r * 0.64);
      ctx.rect(r * 0.06, -r * 0.06, r * 0.38, r * 0.48);
    } else {
      ctx.rect(-r * 0.46, -r * 0.26, r * 0.92, r * 0.66);
      ctx.moveTo(-r * 0.32, -r * 0.04); ctx.lineTo(r * 0.32, -r * 0.04);
      ctx.moveTo(-r * 0.32, r * 0.18); ctx.lineTo(r * 0.32, r * 0.18);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawAngelicDustcart(ctx, x, y, angleRad, s, wingBeat) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angleRad);
    ctx.beginPath();
    ctx.arc(0, 0, s * 1.45, 0, TAU);
    ctx.fillStyle = "rgba(216, 174, 94, 0.18)";
    ctx.fill();

    const spread = s * (0.95 + Math.sin(wingBeat) * 0.12);
    ctx.fillStyle = PALETTE.angelic_gold;
    ctx.beginPath();
    ctx.moveTo(-s * 0.2, -s * 0.42);
    ctx.quadraticCurveTo(-s * 0.65, -spread * 1.18, s * 0.48, -spread * 0.88);
    ctx.quadraticCurveTo(s * 0.15, -s * 0.48, -s * 0.2, -s * 0.42);
    ctx.moveTo(-s * 0.2, s * 0.42);
    ctx.quadraticCurveTo(-s * 0.65, spread * 1.18, s * 0.48, spread * 0.88);
    ctx.quadraticCurveTo(s * 0.15, s * 0.48, -s * 0.2, s * 0.42);
    ctx.fill();

    ctx.fillStyle = PALETTE.dawn_gleam_ivory;
    ctx.strokeStyle = PALETTE.angelic_gold;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.rect(-s * 0.82, -s * 0.44, s * 1.56, s * 0.88);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = PALETTE.plastic_bag_obsidian;
    ctx.beginPath();
    ctx.arc(-s * 0.38, -s * 0.16, s * 0.21, 0, TAU);
    ctx.arc(-s * 0.38, s * 0.18, s * 0.21, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawNoveltyEmblem(ctx, x, y, r, nov, animTime, isSelected, gleamBoost) {
    ctx.save();
    ctx.translate(x, y);
    if (isSelected) {
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.34, 0, TAU);
      ctx.fillStyle = "rgba(216, 174, 94, 0.24)";
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.fillStyle = PALETTE.dawn_gleam_ivory;
    ctx.fill();
    ctx.strokeStyle = isSelected ? PALETTE.angelic_gold : nov.gleamColor;
    ctx.lineWidth = isSelected ? 2.4 : 1.7 + gleamBoost;
    ctx.stroke();

    ctx.strokeStyle = PALETTE.ink_parchment;
    ctx.fillStyle = nov.gleamColor;
    ctx.lineWidth = 1.2;
    const wave = Math.sin(animTime * 2.4 + nov.index) * r * 0.08;
    if (nov.id === "fresh_sheets") {
      ctx.fillRect(-r * 0.52, -r * 0.42, r * 0.46, r * 0.82 + wave);
      ctx.strokeRect(-r * 0.52, -r * 0.42, r * 0.46, r * 0.82 + wave);
      ctx.fillRect(r * 0.06, -r * 0.36, r * 0.46, r * 0.78 - wave);
      ctx.strokeRect(r * 0.06, -r * 0.36, r * 0.46, r * 0.78 - wave);
    } else if (nov.id === "unwrapped_soap") {
      ctx.fillRect(-r * 0.48, -r * 0.24, r * 0.96, r * 0.52);
      ctx.strokeRect(-r * 0.48, -r * 0.24, r * 0.96, r * 0.52);
      ctx.beginPath();
      ctx.arc(r * 0.28, -r * 0.44, r * 0.14, 0, TAU);
      ctx.stroke();
    } else if (nov.id === "brand_new_attire") {
      ctx.beginPath();
      ctx.moveTo(-r * 0.24, -r * 0.48); ctx.lineTo(r * 0.24, -r * 0.48);
      ctx.lineTo(r * 0.56, -r * 0.12); ctx.lineTo(r * 0.32, r * 0.04);
      ctx.lineTo(r * 0.32, r * 0.52); ctx.lineTo(-r * 0.32, r * 0.52);
      ctx.lineTo(-r * 0.32, r * 0.04); ctx.lineTo(-r * 0.56, -r * 0.12);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    } else if (nov.id === "unopened_tins_fridge") {
      ctx.fillRect(-r * 0.48, -r * 0.52, r * 0.56, r * 1.04);
      ctx.strokeRect(-r * 0.48, -r * 0.52, r * 0.56, r * 1.04);
      ctx.fillStyle = PALETTE.angelic_gold;
      ctx.fillRect(r * 0.18, -r * 0.08, r * 0.34, r * 0.56);
      ctx.strokeRect(r * 0.18, -r * 0.08, r * 0.34, r * 0.56);
    } else {
      ctx.fillRect(-r * 0.52, -r * 0.14, r * 0.88, r * 0.62);
      ctx.strokeRect(-r * 0.52, -r * 0.14, r * 0.88, r * 0.62);
      ctx.beginPath();
      ctx.arc(r * 0.22, -r * 0.24, r * 0.28, -Math.PI * 0.85, -Math.PI * 0.15);
      ctx.arc(r * 0.22, -r * 0.24, r * 0.46, -Math.PI * 0.85, -Math.PI * 0.15);
      ctx.stroke();
    }
    ctx.restore();
  }

  function createMorningCore(opts) {
    const cfg = opts || {};
    const audio = createAudioEngine(Boolean(cfg.muted));
    const onDawnExport = typeof cfg.onDawnExport === "function" ? cfg.onDawnExport : null;
    const onSelectItem = typeof cfg.onSelectItem === "function" ? cfg.onSelectItem : null;

    const state = {
      width: cfg.width || 1280,
      height: cfg.height || 800,
      dayIndex: 1,
      materialSkillLevel: 1,
      ritePhase: "cleansed_gleam",
      riteProgress: 1,
      effacedRatio: 0,
      reducedMotion: Boolean(cfg.reducedMotion),
      selectedNoveltyId: MORNING_NOVELTIES[0].id,
      time: 0,
      dawnFlash: 0,
      totalExportedTonnes: 0,
      lastExportPacket: null,
      novelties: buildNovelties(1, 1),
      sidewalkBags: buildSidewalkBags(1, 1),
      angelicDustcarts: buildAngelicDustcarts(1, 1)
    };

    function resolveBounds(coreBounds) {
      const cb = coreBounds || {};
      const w = cb.width || state.width || 1280;
      const h = cb.height || state.height || 800;
      if (typeof cb.effacedRatio === "number") state.effacedRatio = clamp01(cb.effacedRatio);
      return {
        width: w, height: h,
        cx: typeof cb.cx === "number" ? cb.cx : w * 0.5,
        cy: typeof cb.cy === "number" ? cb.cy : h * 0.5,
        coreRadius: Math.max(34, typeof cb.coreRadius === "number" ? cb.coreRadius : Math.min(w, h) * 0.23),
        crossSectionMode: Boolean(cb.crossSectionMode),
        basinFloorY: typeof cb.basinFloorY === "number" ? cb.basinFloorY : h * 0.76,
        basinHalfWidth: Math.max(30, typeof cb.basinHalfWidth === "number" ? cb.basinHalfWidth : w * 0.18),
        effaced: state.effacedRatio
      };
    }

    function renderPlan(ctx, b) {
      const R = b.coreRadius;
      const tier = MATERIAL_TIERS[state.materialSkillLevel - 1];
      ctx.save();
      ctx.beginPath();
      ctx.arc(b.cx, b.cy, R, 0, TAU);
      ctx.clip();

      const bg = ctx.createRadialGradient(b.cx, b.cy, R * 0.04, b.cx, b.cy, R);
      bg.addColorStop(0, PALETTE.dawn_gleam_ivory);
      bg.addColorStop(0.58, PALETTE.fresh_linen_cyan);
      bg.addColorStop(1, PALETTE.soap_pearl_mint);
      ctx.fillStyle = bg;
      ctx.fillRect(b.cx - R, b.cy - R, R * 2, R * 2);

      for (let k = 1; k <= 3; k++) {
        ctx.beginPath();
        ctx.arc(b.cx, b.cy, R * (0.24 * k + 0.12), 0, TAU);
        ctx.strokeStyle = k === 2 ? "rgba(77,116,152,0.28)" : "rgba(216,174,94,0.32)";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      for (let a = 0; a < 8; a++) {
        const ang = (a * TAU) / 8;
        ctx.save();
        ctx.translate(b.cx, b.cy);
        ctx.rotate(ang);
        ctx.fillStyle = "rgba(246,243,234,0.88)";
        ctx.fillRect(R * 0.15, -R * 0.045, R * 0.83, R * 0.09);
        ctx.fillStyle = PALETTE.fresh_linen_cyan;
        ctx.fillRect(R * 0.52, R * 0.09, R * 0.14, R * 0.045);
        ctx.restore();
      }

      const bagR = clamp(R * 0.056, 4.5, 11.5);
      for (let i = 0; i < state.sidewalkBags.length; i++) {
        const bag = state.sidewalkBags[i];
        const bx = b.cx + Math.cos(bag.angleRad) * R * bag.radialFrac;
        const by = b.cy + Math.sin(bag.angleRad) * R * bag.radialFrac;
        drawBagWithSilhouette(ctx, bx, by, bagR * bag.scale, bag.silhouetteKind, tier.gleamBoost, false);
      }
      const cartS = clamp(R * 0.055, 4.5, 10.5);
      for (let i = 0; i < state.angelicDustcarts.length; i++) {
        const c = state.angelicDustcarts[i];
        const cx2 = b.cx + Math.cos(c.angleRad) * R * c.radialFrac;
        const cy2 = b.cy + Math.sin(c.angleRad) * R * c.radialFrac;
        drawAngelicDustcart(ctx, cx2, cy2, c.angleRad, cartS, state.time * 4 + c.wingPhase);
      }
      const novR = clamp(R * 0.115, 8, 20);
      for (let i = 0; i < state.novelties.length; i++) {
        const n = state.novelties[i];
        const nx = b.cx + Math.cos(n.angleRad) * R * 0.43;
        const ny = b.cy + Math.sin(n.angleRad) * R * 0.43;
        drawNoveltyEmblem(ctx, nx, ny, novR, n, state.time, state.selectedNoveltyId === n.id, tier.gleamBoost);
      }

      ctx.beginPath();
      ctx.arc(b.cx, b.cy, R * 0.15, 0, TAU);
      ctx.fillStyle = PALETTE.dawn_gleam_ivory;
      ctx.fill();
      ctx.strokeStyle = PALETTE.angelic_gold;
      ctx.lineWidth = 2;
      ctx.stroke();

      if (b.effaced > 0.004) {
        const innerClear = Math.max(0, R * (1 - b.effaced * 1.05));
        ctx.beginPath();
        ctx.arc(b.cx, b.cy, R * 1.05, 0, TAU);
        if (innerClear > 1) ctx.arc(b.cx, b.cy, innerClear, 0, TAU, true);
        ctx.fillStyle = PALETTE.scarp_slate_cuirass;
        ctx.fill("evenodd");
        const debrisCount = Math.floor(28 * b.effaced);
        for (let d = 0; d < debrisCount; d++) {
          const da = seededNoise(d * 13.7 + 5) * TAU;
          const dr = innerClear + seededNoise(d * 29.3 + 2) * Math.max(4, R - innerClear);
          ctx.fillStyle = d % 3 === 0 ? PALETTE.rust_tin_ochre : (d % 3 === 1 ? PALETTE.tire_ash_charcoal : PALETTE.cataclysm_crimson);
          ctx.fillRect(b.cx + Math.cos(da) * dr - 4, b.cy + Math.sin(da) * dr - 3, 8, 5);
        }
      }
      ctx.restore();

      ctx.beginPath();
      ctx.arc(b.cx, b.cy, R, 0, TAU);
      ctx.strokeStyle = b.effaced > 0.6 ? PALETTE.cataclysm_crimson : PALETTE.angelic_gold;
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }

    function renderSection(ctx, b) {
      const hw = b.basinHalfWidth;
      const fy = b.basinFloorY;
      const maxH = Math.max(48, Math.min(b.height * 0.24, hw * 0.92));
      const tier = MATERIAL_TIERS[state.materialSkillLevel - 1];
      ctx.save();
      const sky = ctx.createLinearGradient(b.cx, fy - maxH * 1.2, b.cx, fy);
      sky.addColorStop(0, "rgba(215,238,242,0.16)");
      sky.addColorStop(1, "rgba(246,243,234,0.72)");
      ctx.fillStyle = sky;
      ctx.fillRect(b.cx - hw, fy - maxH * 1.15, hw * 2, maxH * 1.15);

      const towers = [-0.76, -0.50, -0.25, 0, 0.25, 0.50, 0.76];
      for (let i = 0; i < towers.length; i++) {
        const tx = b.cx + towers[i] * hw;
        const tw = hw * 0.15;
        const th = maxH * (i === 3 ? 0.96 : (i % 2 === 0 ? 0.68 : 0.82));
        ctx.fillStyle = PALETTE.dawn_gleam_ivory;
        ctx.strokeStyle = PALETTE.porcelain_cobalt;
        ctx.lineWidth = 1.2;
        ctx.fillRect(tx - tw * 0.5, fy - th, tw, th);
        ctx.strokeRect(tx - tw * 0.5, fy - th, tw, th);
        ctx.fillStyle = PALETTE.fresh_linen_cyan;
        ctx.fillRect(tx - tw * 0.36, fy - th * 0.68, tw * 0.72, th * 0.14);
      }
      const novR = clamp(hw * 0.085, 7, 15);
      for (let i = 0; i < state.novelties.length; i++) {
        const n = state.novelties[i];
        const nx = b.cx + (-0.68 + i * 0.34) * hw;
        drawNoveltyEmblem(ctx, nx, fy - maxH * 0.42, novR, n, state.time, state.selectedNoveltyId === n.id, tier.gleamBoost);
      }
      const bagR = clamp(hw * 0.046, 4, 9);
      for (let i = 0; i < Math.min(12, state.sidewalkBags.length); i++) {
        const bag = state.sidewalkBags[i];
        drawBagWithSilhouette(ctx, b.cx + bag.sectionXFrac * hw, fy - bagR * 0.85, bagR, bag.silhouetteKind, tier.gleamBoost, false);
      }
      drawAngelicDustcart(ctx, b.cx - hw * 0.62, fy - bagR * 1.1, Math.PI, bagR * 1.15, state.time * 4);
      drawAngelicDustcart(ctx, b.cx + hw * 0.62, fy - bagR * 1.1, 0, bagR * 1.15, state.time * 4 + 1.2);

      if (b.effaced > 0.004) {
        const buryH = maxH * 1.22 * b.effaced;
        ctx.fillStyle = PALETTE.scarp_slate_cuirass;
        ctx.beginPath();
        ctx.moveTo(b.cx - hw * 1.04, fy + 2);
        ctx.lineTo(b.cx - hw * 1.04, fy - buryH * 1.12);
        ctx.quadraticCurveTo(b.cx, fy - buryH * 0.82, b.cx + hw * 1.04, fy - buryH * 1.12);
        ctx.lineTo(b.cx + hw * 1.04, fy + 2);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }

    function breakNewDawn(callOpts) {
      const co = callOpts || {};
      state.dayIndex += 1;
      const tier = MATERIAL_TIERS[state.materialSkillLevel - 1];
      state.novelties = buildNovelties(state.dayIndex, state.materialSkillLevel);
      state.sidewalkBags = buildSidewalkBags(state.dayIndex, state.materialSkillLevel);
      state.angelicDustcarts = buildAngelicDustcarts(state.dayIndex, state.materialSkillLevel);

      let rawMass = 0;
      const relics = DISCARDED_REMAINS.map(function (rem) {
        const tonnes = Number((rem.baseMassTonnes * tier.massFactor * (1 + Math.min(0.28, state.dayIndex * 0.01))).toFixed(2));
        rawMass += tonnes;
        return {
          id: rem.id,
          relicType: rem.relicType,
          label: rem.label,
          silhouetteKind: rem.silhouetteKind,
          tonnes: tonnes,
          indestructibilityTier: state.materialSkillLevel,
          decompositionRate: 0,
          sacerdotallySealed: true
        };
      });
      const exportedTonnes = Number(rawMass.toFixed(2));
      state.totalExportedTonnes = Number((state.totalExportedTonnes + exportedTonnes).toFixed(2));
      state.ritePhase = state.reducedMotion ? "cleansed_gleam" : "dawn_unwrapping";
      state.riteProgress = state.reducedMotion ? 1 : 0;
      state.dawnFlash = state.reducedMotion ? 0 : 1;

      const exportPacket = {
        dayIndex: state.dayIndex,
        materialSkillLevel: state.materialSkillLevel,
        decompositionRate: 0,
        exportedTonnes: exportedTonnes,
        bagCount: state.sidewalkBags.length,
        sidewalkCleansed: true,
        joyOfExpelling: Math.min(1, 0.72 + state.materialSkillLevel * 0.05),
        relics: relics
      };
      state.lastExportPacket = exportPacket;

      if (!co.silentAudio) {
        audio.playDawnChime(state.materialSkillLevel);
        audio.playAngelicRite();
      }
      if (onDawnExport && !co.skipCallback) {
        onDawnExport(exportPacket);
      }
      return exportPacket;
    }

    function upgradeMaterialIndestructibility(targetLevel) {
      if (typeof targetLevel === "number" && Number.isFinite(targetLevel)) {
        state.materialSkillLevel = clamp(Math.round(targetLevel), 1, 5);
      } else {
        state.materialSkillLevel = (state.materialSkillLevel % 5) + 1;
      }
      state.novelties = buildNovelties(state.dayIndex, state.materialSkillLevel);
      state.sidewalkBags = buildSidewalkBags(state.dayIndex, state.materialSkillLevel);
      audio.playUpgradeShimmer(state.materialSkillLevel);
      const tier = MATERIAL_TIERS[state.materialSkillLevel - 1];
      return {
        materialSkillLevel: state.materialSkillLevel,
        materialTierName: tier.name,
        materialTierNumeral: tier.numeral,
        decompositionRate: 0
      };
    }

    function step(dt) {
      if (state.reducedMotion) return;
      let remaining = clamp(Number.isFinite(dt) ? dt : 0.016, 0, 5.0);
      while (remaining > 1e-6) {
        const sub = Math.min(remaining, 0.1);
        remaining -= sub;
        state.time += sub;
        state.dawnFlash = Math.max(0, state.dawnFlash - sub * 1.4);
        if (state.riteProgress < 1) {
          state.riteProgress = Math.min(1, state.riteProgress + sub * 0.42);
          if (state.riteProgress < 0.26) state.ritePhase = "dawn_unwrapping";
          else if (state.riteProgress < 0.54) state.ritePhase = "curbside_bagging";
          else if (state.riteProgress < 0.88) state.ritePhase = "angelic_procession";
          else state.ritePhase = "cleansed_gleam";
        }
        for (let i = 0; i < state.angelicDustcarts.length; i++) {
          const c = state.angelicDustcarts[i];
          c.radialFrac += sub * c.speed;
          if (c.radialFrac > 0.91) c.radialFrac = 0.24;
        }
      }
    }

    function selectNovelty(idOrIndex) {
      let found = null;
      if (typeof idOrIndex === "number") {
        found = state.novelties[clamp(Math.floor(idOrIndex), 0, state.novelties.length - 1)] || null;
      } else if (typeof idOrIndex === "string") {
        found = state.novelties.find(function (n) { return n.id === idOrIndex; }) || null;
      }
      if (!found) return null;
      state.selectedNoveltyId = found.id;
      const payload = Object.assign({ kind: "morning_novelty", decompositionRate: 0, dayIndex: state.dayIndex }, found);
      if (onSelectItem) onSelectItem(payload);
      return payload;
    }

    function inspectAt(x, y, coreBounds, triggerSelect) {
      const b = resolveBounds(coreBounds);
      if (b.crossSectionMode) {
        const maxH = Math.max(48, Math.min(b.height * 0.24, b.basinHalfWidth * 0.92));
        if (Math.abs(x - b.cx) > b.basinHalfWidth || y > b.basinFloorY + 14 || y < b.basinFloorY - maxH * 1.2) return null;
        for (let i = 0; i < state.novelties.length; i++) {
          const nx = b.cx + (-0.68 + i * 0.34) * b.basinHalfWidth;
          const ny = b.basinFloorY - maxH * 0.42;
          if (Math.hypot(x - nx, y - ny) <= 18) {
            const p = Object.assign({ kind: "morning_novelty", decompositionRate: 0 }, state.novelties[i]);
            if (triggerSelect && onSelectItem) onSelectItem(p);
            return p;
          }
        }
        const bagIdx = clamp(Math.floor(((x - (b.cx - b.basinHalfWidth)) / (b.basinHalfWidth * 2)) * 12), 0, state.sidewalkBags.length - 1);
        if (y >= b.basinFloorY - 24) {
          const hitBag = Object.assign({ kind: "curbside_bag" }, state.sidewalkBags[bagIdx]);
          if (triggerSelect && onSelectItem) onSelectItem(hitBag);
          return hitBag;
        }
        return { kind: "metropolis_core", id: "leonia_basin", label: "Sunken Refashioned Leonia", description: "Fragile morning towers nestled beneath rising indestructible ramparts.", dayIndex: state.dayIndex, decompositionRate: 0 };
      }

      const dist = Math.hypot(x - b.cx, y - b.cy);
      if (dist > b.coreRadius) return null;
      const R = b.coreRadius;
      for (let i = 0; i < state.novelties.length; i++) {
        const n = state.novelties[i];
        if (Math.hypot(x - (b.cx + Math.cos(n.angleRad) * R * 0.43), y - (b.cy + Math.sin(n.angleRad) * R * 0.43)) <= Math.max(14, R * 0.13)) {
          const p = Object.assign({ kind: "morning_novelty", decompositionRate: 0 }, n);
          if (triggerSelect && onSelectItem) onSelectItem(p);
          return p;
        }
      }
      for (let i = 0; i < state.angelicDustcarts.length; i++) {
        const c = state.angelicDustcarts[i];
        if (Math.hypot(x - (b.cx + Math.cos(c.angleRad) * R * c.radialFrac), y - (b.cy + Math.sin(c.angleRad) * R * c.radialFrac)) <= Math.max(11, R * 0.08)) {
          const p = { kind: "angelic_dustcart", id: c.id, label: "Angelic Street-Cleaner Wagon", description: "Welcomed like angels in silence, bearing yesterday's sealed bags outward to the crater scarp.", dayIndex: state.dayIndex, decompositionRate: 0 };
          if (triggerSelect && onSelectItem) onSelectItem(p);
          return p;
        }
      }
      for (let i = 0; i < state.sidewalkBags.length; i++) {
        const bag = state.sidewalkBags[i];
        if (Math.hypot(x - (b.cx + Math.cos(bag.angleRad) * R * bag.radialFrac), y - (b.cy + Math.sin(bag.angleRad) * R * bag.radialFrac)) <= Math.max(10, R * 0.075)) {
          const p = Object.assign({ kind: "curbside_bag" }, bag);
          if (triggerSelect && onSelectItem) onSelectItem(p);
          return p;
        }
      }
      return { kind: "metropolis_core", id: "leonia_rotunda", label: "Refashioned Center of Leonia", description: "Every morning Leonia wakes between fresh sheets while yesterday's city awaits the silent wagon in black plastic.", dayIndex: state.dayIndex, decompositionRate: 0 };
    }

    function getState() {
      const tier = MATERIAL_TIERS[state.materialSkillLevel - 1];
      return {
        dayIndex: state.dayIndex,
        materialSkillLevel: state.materialSkillLevel,
        materialTierName: tier.name,
        materialTierNumeral: tier.numeral,
        decompositionRate: 0,
        ritePhase: state.ritePhase,
        riteProgress: state.riteProgress,
        effacedRatio: state.effacedRatio,
        reducedMotion: state.reducedMotion,
        muted: audio.isMuted(),
        selectedNoveltyId: state.selectedNoveltyId,
        joyOfExpelling: Math.min(1, 0.72 + state.materialSkillLevel * 0.05),
        sidewalkCleansed: true,
        bagCount: state.sidewalkBags.length,
        totalExportedTonnes: state.totalExportedTonnes,
        lastExportPacket: state.lastExportPacket,
        novelties: state.novelties.slice(),
        sidewalkBags: state.sidewalkBags.slice(),
        angelicDustcarts: state.angelicDustcarts.slice()
      };
    }

    function reset() {
      state.dayIndex = 1;
      state.materialSkillLevel = 1;
      state.ritePhase = "cleansed_gleam";
      state.riteProgress = 1;
      state.effacedRatio = 0;
      state.dawnFlash = 0;
      state.totalExportedTonnes = 0;
      state.lastExportPacket = null;
      state.selectedNoveltyId = MORNING_NOVELTIES[0].id;
      state.novelties = buildNovelties(1, 1);
      state.sidewalkBags = buildSidewalkBags(1, 1);
      state.angelicDustcarts = buildAngelicDustcarts(1, 1);
      return getState();
    }

    return {
      breakNewDawn: breakNewDawn,
      upgradeMaterialIndestructibility: upgradeMaterialIndestructibility,
      step: step,
      render: function (ctx, coreBounds) {
        if (!ctx) return null;
        const b = resolveBounds(coreBounds);
        if (b.crossSectionMode) renderSection(ctx, b);
        else renderPlan(ctx, b);
        return b;
      },
      selectNovelty: selectNovelty,
      inspectAt: inspectAt,
      setEffacedRatio: function (r) { state.effacedRatio = clamp01(r); return state.effacedRatio; },
      setReducedMotion: function (flag) {
        state.reducedMotion = Boolean(flag);
        if (state.reducedMotion) { state.ritePhase = "cleansed_gleam"; state.riteProgress = 1; state.dawnFlash = 0; }
        return state.reducedMotion;
      },
      attemptDecay: function () { return { decayedTonnes: 0, decompositionRate: 0 }; },
      reset: reset,
      getState: getState,
      setMuted: function (flag) { return audio.setMuted(flag); },
      toggleMute: function () { return audio.toggleMute(); },
      isMuted: function () { return audio.isMuted(); },
      playDawnChime: function () { return audio.playDawnChime(state.materialSkillLevel); },
      playAngelicRite: function () { return audio.playAngelicRite(); },
      playUpgradeShimmer: function () { return audio.playUpgradeShimmer(state.materialSkillLevel); },
      playCataclysmChord: function () { return audio.playCataclysmChord(); }
    };
  }

  return Object.freeze({
    PALETTE: PALETTE,
    DECOMPOSITION_RATE: DECOMPOSITION_RATE,
    MORNING_NOVELTIES: MORNING_NOVELTIES,
    DISCARDED_REMAINS: DISCARDED_REMAINS,
    RITE_PHASES: RITE_PHASES,
    MATERIAL_TIERS: MATERIAL_TIERS,
    createMorningCore: createMorningCore
  });
})();

if (typeof window !== "undefined") {
  window.LeoniaMorningCore = globalThis.LeoniaMorningCore;
}
