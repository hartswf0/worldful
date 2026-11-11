/* City 22: Sophronia — Eastern Nomadic Metropolis of Stone, Marble & Cement */
(function (root) {
  "use strict";

  const PALETTE = Object.freeze({
    nightBedrock: "#18130f",
    emptyOchre: "#cfa368",
    ochreDust: "#e4c493",
    carnivalVermilion: "#d93b2b",
    giltSpoke: "#e8b948",
    tentIvory: "#f3e7cf",
    cementAsh: "#767c82",
    carraraMarble: "#e7e2d8",
    stoneMortar: "#9da1a4",
    trailerIron: "#2b3036"
  });

  const ANNUAL_ITINERARY = Object.freeze([
    Object.freeze({
      id: "complete_life",
      range: Object.freeze([0, 0.02]),
      label: "Complete Life — Marble, Stone & Cement Metropolis Seated",
      monthsRemaining: 0
    }),
    Object.freeze({
      id: "rigging_dismantlement",
      range: Object.freeze([0.02, 0.85]),
      label: "Annual Rigging — Unbolting Pediments, Lowering Stone Walls & Pylons",
      monthsRemaining: 0
    }),
    Object.freeze({
      id: "flatbed_staging",
      range: Object.freeze([0.85, 0.90]),
      label: "Flatbed Caravan Loaded — Ten Heavy Institutions Strapped on Trailers",
      monthsRemaining: 8
    }),
    Object.freeze({
      id: "ochre_sojourn_wait",
      range: Object.freeze([0.90, 1.0]),
      label: "Caravan Departed — Vacant Ochre Half-City Counting Months Until Return",
      monthsRemaining: 8
    })
  ]);

  const RAW_INSTITUTIONS = [
    {
      id: "bank",
      label: "The Bank",
      shortLabel: "Bank",
      material: "marble pediment & bronze vault ashlar",
      structuralParts: ["marble_pediment", "stone_walls", "bronze_vault"],
      trailerSlot: 1,
      nx: 0.560, ny: 0.710, wNorm: 0.072, hNorm: 0.118
    },
    {
      id: "factories",
      label: "The Factories",
      shortLabel: "Factories",
      material: "cement sawtooth bays & brick flues",
      structuralParts: ["cement_pylons", "sawtooth_trusses", "flue_stacks"],
      trailerSlot: 2,
      nx: 0.840, ny: 0.495, wNorm: 0.078, hNorm: 0.138
    },
    {
      id: "palaces",
      label: "The Palaces",
      shortLabel: "Palaces",
      material: "rusticated stone walls & cornices",
      structuralParts: ["stone_walls", "marble_cornice", "loggia_arches"],
      trailerSlot: 3,
      nx: 0.565, ny: 0.500, wNorm: 0.076, hNorm: 0.130
    },
    {
      id: "slaughterhouse",
      label: "The Slaughterhouse",
      shortLabel: "Slaughterhouse",
      material: "dressed stone arches & iron gantries",
      structuralParts: ["stone_walls", "dressed_arch", "iron_gantries"],
      trailerSlot: 4,
      nx: 0.812, ny: 0.712, wNorm: 0.076, hNorm: 0.114
    },
    {
      id: "school",
      label: "The School",
      shortLabel: "School",
      material: "pedimented limestone hall & belfry",
      structuralParts: ["marble_pediment", "stone_walls", "belfry_gable"],
      trailerSlot: 5,
      nx: 0.645, ny: 0.710, wNorm: 0.072, hNorm: 0.124
    },
    {
      id: "ministry",
      label: "The Ministry",
      shortLabel: "Ministry",
      material: "monumental marble portico & columns",
      structuralParts: ["marble_pediment", "corinthian_columns", "stone_walls"],
      trailerSlot: 6,
      nx: 0.655, ny: 0.492, wNorm: 0.088, hNorm: 0.150
    },
    {
      id: "monument",
      label: "The Monument",
      shortLabel: "Monument",
      material: "carved marble plinth & civic bronze",
      structuralParts: ["marble_pediment", "carved_plinth", "civic_statue"],
      trailerSlot: 7,
      nx: 0.728, ny: 0.718, wNorm: 0.058, hNorm: 0.128
    },
    {
      id: "docks",
      label: "The Docks",
      shortLabel: "Docks",
      material: "cement pylons, quay walls & cranes",
      structuralParts: ["cement_pylons", "quay_blocks", "portal_crane"],
      trailerSlot: 8,
      nx: 0.908, ny: 0.716, wNorm: 0.082, hNorm: 0.128
    },
    {
      id: "petroleum_refinery",
      label: "The Petroleum Refinery",
      shortLabel: "Refinery",
      material: "fractionating towers & cement pylons",
      structuralParts: ["cement_pylons", "cracking_towers", "pipe_manifolds"],
      trailerSlot: 9,
      nx: 0.925, ny: 0.500, wNorm: 0.070, hNorm: 0.158
    },
    {
      id: "hospital",
      label: "The Hospital",
      shortLabel: "Hospital",
      material: "marble-faced pavilion & stone wings",
      structuralParts: ["marble_pediment", "stone_walls", "pavilion_wings"],
      trailerSlot: 10,
      nx: 0.750, ny: 0.500, wNorm: 0.080, hNorm: 0.132
    }
  ];

  const INSTITUTIONS = Object.freeze(
    RAW_INSTITUTIONS.map(function (entry, idx) {
      const rigStart = +(idx * 0.068).toFixed(4);
      const rigEnd = +(rigStart + 0.208).toFixed(4);
      return Object.freeze({
        id: entry.id,
        label: entry.label,
        shortLabel: entry.shortLabel,
        material: entry.material,
        structuralParts: Object.freeze(entry.structuralParts.slice()),
        trailerSlot: entry.trailerSlot,
        nx: entry.nx,
        ny: entry.ny,
        wNorm: entry.wNorm,
        hNorm: entry.hNorm,
        permanent: false,
        dismantleable: true,
        rigStart: rigStart,
        rigEnd: rigEnd
      });
    })
  );

  function clamp(min, max, val) {
    const n = Number(val);
    if (!Number.isFinite(n)) return min;
    return n < min ? min : n > max ? max : n;
  }

  function resolvePhaseLabel(progress, caravanDeparted, monthsRemaining, dismantledCount) {
    if (caravanDeparted) {
      return "Caravan Departed — Vacant Ochre Lots (" + monthsRemaining + " mo remaining)";
    }
    if (dismantledCount === 10 || progress >= 0.85) {
      return ANNUAL_ITINERARY[2].label;
    }
    if (dismantledCount > 0 || progress >= 0.02) {
      return ANNUAL_ITINERARY[1].label;
    }
    return ANNUAL_ITINERARY[0].label;
  }

  function createRiggingAudio() {
    let ctx = null;
    let muted = false;

    function ensureContext() {
      if (muted) return null;
      try {
        if (!ctx) {
          const Ctor = root.AudioContext || root.webkitAudioContext;
          if (!Ctor) return null;
          ctx = new Ctor();
        }
        if (ctx && ctx.state === "suspended" && typeof ctx.resume === "function") {
          ctx.resume().catch(function () {});
        }
        return ctx;
      } catch (_err) {
        return null;
      }
    }

    function unlock() {
      return Boolean(ensureContext());
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      return muted;
    }

    function toggleMute() {
      muted = !muted;
      return muted;
    }

    function isMuted() {
      return muted;
    }

    function playUnboltAndLoad(slotIndex) {
      const ac = ensureContext();
      if (!ac) return;
      try {
        const now = ac.currentTime;
        const slotShift = ((Number(slotIndex) || 1) - 1) * 9;
        [0, 0.055].forEach(function (offset, idx) {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(640 + idx * 130 + slotShift, now + offset);
          osc.frequency.exponentialRampToValueAtTime(260, now + offset + 0.042);
          gain.gain.setValueAtTime(0.0001, now + offset);
          gain.gain.linearRampToValueAtTime(0.065, now + offset + 0.006);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.045);
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(now + offset);
          osc.stop(now + offset + 0.05);
        });
        const pulley = ac.createOscillator();
        const pGain = ac.createGain();
        pulley.type = "sine";
        pulley.frequency.setValueAtTime(340 + slotShift * 0.5, now + 0.09);
        pulley.frequency.linearRampToValueAtTime(195, now + 0.24);
        pGain.gain.setValueAtTime(0.0001, now + 0.09);
        pGain.gain.linearRampToValueAtTime(0.045, now + 0.12);
        pGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        pulley.connect(pGain);
        pGain.connect(ac.destination);
        pulley.start(now + 0.09);
        pulley.stop(now + 0.26);

        const thud = ac.createOscillator();
        const tGain = ac.createGain();
        thud.type = "sine";
        thud.frequency.setValueAtTime(104, now + 0.22);
        thud.frequency.exponentialRampToValueAtTime(42, now + 0.42);
        tGain.gain.setValueAtTime(0.0001, now + 0.22);
        tGain.gain.linearRampToValueAtTime(0.11, now + 0.235);
        tGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.44);
        thud.connect(tGain);
        tGain.connect(ac.destination);
        thud.start(now + 0.22);
        thud.stop(now + 0.45);
      } catch (_err) {}
    }

    function playCaravanDeparture() {
      const ac = ensureContext();
      if (!ac) return;
      try {
        const now = ac.currentTime;
        [56, 84].forEach(function (freq, idx) {
          const osc = ac.createOscillator();
          const filt = ac.createBiquadFilter();
          const gain = ac.createGain();
          osc.type = idx === 0 ? "sawtooth" : "triangle";
          osc.frequency.setValueAtTime(freq, now);
          osc.frequency.linearRampToValueAtTime(freq * 0.82, now + 0.72);
          filt.type = "lowpass";
          filt.frequency.setValueAtTime(210, now);
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.075, now + 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);
          osc.connect(filt);
          filt.connect(gain);
          gain.connect(ac.destination);
          osc.start(now);
          osc.stop(now + 0.78);
        });
      } catch (_err) {}
    }

    function playCaravanReturn() {
      const ac = ensureContext();
      if (!ac) return;
      try {
        const now = ac.currentTime;
        [130.81, 196.0, 293.66, 329.63, 392.0].forEach(function (freq, idx) {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          const t0 = now + idx * 0.055;
          osc.type = idx < 2 ? "triangle" : "sine";
          osc.frequency.setValueAtTime(freq, t0);
          gain.gain.setValueAtTime(0.0001, t0);
          gain.gain.linearRampToValueAtTime(0.055, t0 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.48);
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(t0);
          osc.stop(t0 + 0.5);
        });
      } catch (_err) {}
    }

    return {
      unlock: unlock,
      setMuted: setMuted,
      toggleMute: toggleMute,
      isMuted: isMuted,
      playUnboltAndLoad: playUnboltAndLoad,
      playCaravanDeparture: playCaravanDeparture,
      playCaravanReturn: playCaravanReturn
    };
  }

  function createRiggingEngine(opts) {
    const options = opts || {};
    const onStateChange = typeof options.onStateChange === "function" ? options.onStateChange : null;
    const audio = createRiggingAudio();

    let decampmentProgress = 0;
    let caravanDeparted = false;
    let caravanOffset = 0;
    let monthsRemaining = 0;
    let daysRemaining = 0;
    let autoCycle = false;
    let reducedMotion = Boolean(options.reducedMotion);
    let wheelAngle = 0;
    let hoistPhase = 0;
    let dustPhase = 0;
    let autoMonthAccum = 0;

    const items = INSTITUTIONS.map(function (inst) {
      return {
        id: inst.id,
        label: inst.label,
        shortLabel: inst.shortLabel,
        material: inst.material,
        structuralParts: inst.structuralParts,
        trailerSlot: inst.trailerSlot,
        nx: inst.nx,
        ny: inst.ny,
        wNorm: inst.wNorm,
        hNorm: inst.hNorm,
        permanent: false,
        dismantleable: true,
        rigStart: inst.rigStart,
        rigEnd: inst.rigEnd,
        dismantleRatio: 0,
        stage: "erected"
      };
    });

    function countLoaded() {
      let c = 0;
      for (let i = 0; i < items.length; i++) {
        if (items[i].stage === "loaded_on_trailer") c++;
      }
      return c;
    }

    function getState() {
      let erectedCount = 0;
      let dismantledCount = 0;
      let unboltedPedimentsCount = 0;
      let loweredWallsCount = 0;
      let unboltedPylonsCount = 0;
      const snapshotItems = items.map(function (it) {
        if (it.stage === "erected") erectedCount++;
        if (it.stage === "loaded_on_trailer") dismantledCount++;
        if (it.dismantleRatio >= 0.35 && (it.structuralParts.indexOf("marble_pediment") !== -1 || it.structuralParts.indexOf("marble_cornice") !== -1)) {
          unboltedPedimentsCount++;
        }
        if (it.dismantleRatio >= 0.65 && (it.structuralParts.indexOf("stone_walls") !== -1 || it.structuralParts.indexOf("quay_blocks") !== -1)) {
          loweredWallsCount++;
        }
        if (it.dismantleRatio >= 0.80 && it.structuralParts.indexOf("cement_pylons") !== -1) {
          unboltedPylonsCount++;
        }
        return {
          id: it.id,
          label: it.label,
          shortLabel: it.shortLabel,
          material: it.material,
          structuralParts: it.structuralParts.slice(),
          trailerSlot: it.trailerSlot,
          nx: it.nx,
          ny: it.ny,
          wNorm: it.wNorm,
          hNorm: it.hNorm,
          permanent: false,
          dismantleable: true,
          dismantleRatio: it.dismantleRatio,
          stage: it.stage
        };
      });
      return {
        decampmentProgress: decampmentProgress,
        phaseLabel: resolvePhaseLabel(decampmentProgress, caravanDeparted, monthsRemaining, dismantledCount),
        erectedCount: erectedCount,
        dismantledCount: dismantledCount,
        loadedTrailerCount: dismantledCount,
        totalInstitutions: 10,
        caravanDeparted: caravanDeparted,
        caravanOffset: caravanOffset,
        monthsRemaining: monthsRemaining,
        daysRemaining: daysRemaining,
        autoCycle: autoCycle,
        reducedMotion: reducedMotion,
        muted: audio.isMuted(),
        unboltedPedimentsCount: unboltedPedimentsCount,
        loweredWallsCount: loweredWallsCount,
        unboltedPylonsCount: unboltedPylonsCount,
        institutions: snapshotItems
      };
    }

    function emitChange() {
      const snap = getState();
      if (onStateChange) onStateChange(snap);
      return snap;
    }

    function setDecampmentProgress(p) {
      decampmentProgress = +clamp(0, 1, p).toFixed(4);
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        if (decampmentProgress >= 0.85 || decampmentProgress >= it.rigEnd) {
          it.dismantleRatio = 1;
          it.stage = "loaded_on_trailer";
        } else if (decampmentProgress <= 0 || decampmentProgress <= it.rigStart) {
          it.dismantleRatio = 0;
          it.stage = "erected";
        } else {
          it.dismantleRatio = +((decampmentProgress - it.rigStart) / (it.rigEnd - it.rigStart)).toFixed(4);
          it.stage = "rigging";
        }
      }
      if (decampmentProgress >= 0.90) {
        const wasDeparted = caravanDeparted;
        caravanDeparted = true;
        caravanOffset = +clamp(0.22, 1, (decampmentProgress - 0.90) / 0.10).toFixed(4);
        if (!wasDeparted || monthsRemaining <= 0) {
          monthsRemaining = 8;
          daysRemaining = 240;
        }
      } else {
        caravanDeparted = false;
        caravanOffset = 0;
        monthsRemaining = 0;
        daysRemaining = 0;
      }
      return emitChange();
    }

    function dismantleInstitution(id) {
      let target = null;
      for (let i = 0; i < items.length; i++) {
        if (items[i].id === id) { target = items[i]; break; }
      }
      if (!target) {
        const cur = countLoaded();
        return { ok: false, id: id || null, label: null, trailerSlot: null, dismantledCount: cur, loadedTrailerCount: cur, caravanDeparted: caravanDeparted, monthsRemaining: monthsRemaining, daysRemaining: daysRemaining };
      }
      target.dismantleRatio = 1;
      target.stage = "loaded_on_trailer";
      const loadedCount = countLoaded();
      decampmentProgress = loadedCount < 10 ? +(loadedCount * 0.082).toFixed(4) : 0.92;
      if (loadedCount >= 10) {
        caravanDeparted = true;
        caravanOffset = Math.max(caravanOffset, reducedMotion ? 0.82 : 0.32);
        if (monthsRemaining <= 0) {
          monthsRemaining = 8;
          daysRemaining = 240;
        }
      }
      audio.playUnboltAndLoad(target.trailerSlot);
      emitChange();
      return {
        ok: true,
        id: target.id,
        label: target.label,
        trailerSlot: target.trailerSlot,
        dismantledCount: loadedCount,
        loadedTrailerCount: loadedCount,
        caravanDeparted: caravanDeparted,
        monthsRemaining: monthsRemaining,
        daysRemaining: daysRemaining
      };
    }

    function unboltNext() {
      for (let i = 0; i < items.length; i++) {
        if (items[i].stage !== "loaded_on_trailer") {
          return dismantleInstitution(items[i].id);
        }
      }
      return { ok: false, id: null, label: null, trailerSlot: null, dismantledCount: 10, loadedTrailerCount: 10, caravanDeparted: caravanDeparted, monthsRemaining: monthsRemaining, daysRemaining: daysRemaining };
    }

    function departCaravan() {
      for (let i = 0; i < items.length; i++) {
        items[i].dismantleRatio = 1;
        items[i].stage = "loaded_on_trailer";
      }
      decampmentProgress = 1.0;
      caravanDeparted = true;
      caravanOffset = reducedMotion ? 0.88 : Math.max(caravanOffset, 0.35);
      monthsRemaining = 8;
      daysRemaining = 240;
      audio.playCaravanDeparture();
      return emitChange();
    }

    function returnCaravan() {
      for (let i = 0; i < items.length; i++) {
        items[i].dismantleRatio = 0;
        items[i].stage = "erected";
      }
      decampmentProgress = 0;
      caravanDeparted = false;
      caravanOffset = 0;
      monthsRemaining = 0;
      daysRemaining = 0;
      autoMonthAccum = 0;
      audio.playCaravanReturn();
      return emitChange();
    }

    function advanceWaitMonth(months) {
      const m = Math.max(1, Math.round(Number(months) || 1));
      if (countLoaded() < 10) {
        departCaravan();
        return { monthsRemaining: monthsRemaining, daysRemaining: daysRemaining, caravanReturned: false, canReturn: false, state: getState() };
      }
      if (!caravanDeparted) {
        caravanDeparted = true;
        decampmentProgress = 1.0;
        monthsRemaining = 8;
        daysRemaining = 240;
      }
      monthsRemaining = Math.max(0, monthsRemaining - m);
      daysRemaining = Math.max(0, daysRemaining - m * 30);
      caravanOffset = +clamp(0, 1, caravanOffset + 0.08 * m).toFixed(4);
      if (monthsRemaining === 0) {
        const snap = returnCaravan();
        return { monthsRemaining: 0, daysRemaining: 0, caravanReturned: true, canReturn: false, state: snap };
      }
      const snap = emitChange();
      return { monthsRemaining: monthsRemaining, daysRemaining: daysRemaining, caravanReturned: false, canReturn: monthsRemaining <= 1, state: snap };
    }

    function setAutoCycle(flag) { autoCycle = Boolean(flag); autoMonthAccum = 0; return emitChange(); }
    function setReducedMotion(flag) { reducedMotion = Boolean(flag); return emitChange(); }
    function reset() {
      autoCycle = false;
      autoMonthAccum = 0;
      for (let i = 0; i < items.length; i++) { items[i].dismantleRatio = 0; items[i].stage = "erected"; }
      decampmentProgress = 0; caravanDeparted = false; caravanOffset = 0; monthsRemaining = 0; daysRemaining = 0;
      return emitChange();
    }

    function step(dtSec) {
      const dt = clamp(0, 0.1, Number(dtSec) || 0.016);
      if (!reducedMotion) {
        hoistPhase += dt * 2.5;
        dustPhase += dt * 1.7;
        if (caravanDeparted && caravanOffset < 1) {
          caravanOffset = +clamp(0, 1, caravanOffset + dt * 0.20).toFixed(4);
          wheelAngle += dt * 5.0;
        }
      }
      if (autoCycle) {
        if (!caravanDeparted) {
          setDecampmentProgress(decampmentProgress + dt * 0.095);
        } else {
          autoMonthAccum += dt;
          if (autoMonthAccum >= 0.85) {
            autoMonthAccum = 0;
            advanceWaitMonth(1);
          }
        }
      }
    }

    function trailerBoxNorm(slotIdx) {
      const baseX = 0.528 + slotIdx * 0.044 + caravanOffset * 0.25;
      return { x: baseX, y: 0.832, w: 0.038, h: 0.056 };
    }

    function hitTest(normX, normY) {
      if (!Number.isFinite(normX) || !Number.isFinite(normY) || normX < 0.50) return null;
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const tb = trailerBoxNorm(it.trailerSlot - 1);
        const onTrailer = Math.abs(normX - tb.x) <= tb.w * 0.56 && Math.abs(normY - tb.y) <= tb.h * 0.65;
        const onLot = Math.abs(normX - it.nx) <= it.wNorm * 0.58 && normY >= it.ny - it.hNorm * 1.08 && normY <= it.ny + 0.026;
        if (onTrailer || onLot) {
          return { half: "institutions", id: it.id, label: it.label, material: it.material, stage: it.stage, dismantleRatio: it.dismantleRatio, trailerSlot: it.trailerSlot, dismantleable: true };
        }
      }
      return null;
    }

    function drawBuildingOrLot(ctx, it, width, height, isActive) {
      const cx = it.nx * width, by = it.ny * height, w = it.wNorm * width, h = it.hNorm * height, r = it.dismantleRatio;
      const x0 = cx - w * 0.5;
      if (r >= 1) {
        ctx.fillStyle = "rgba(207,163,104,0.28)";
        ctx.strokeStyle = isActive ? PALETTE.giltSpoke : PALETTE.emptyOchre;
        ctx.lineWidth = isActive ? 2 : 1.1;
        ctx.fillRect(x0, by - h * 0.16, w, h * 0.18);
        ctx.strokeRect(x0, by - h * 0.16, w, h * 0.18);
        for (let s = 0; s < 4; s++) {
          const sx = x0 + (s + 0.5) * (w / 4);
          ctx.fillStyle = PALETTE.trailerIron;
          ctx.fillRect(sx - 2, by - 4, 4, 4);
        }
        ctx.fillStyle = PALETTE.ochreDust;
        ctx.font = "600 " + Math.max(8, Math.round(width * 0.0068)) + "px monospace";
        ctx.textAlign = "center";
        ctx.fillText("VACANT LOT #" + it.trailerSlot, cx, by - h * 0.04);
        if (!reducedMotion) {
          const drift = Math.sin(dustPhase + it.trailerSlot) * 6;
          ctx.fillStyle = "rgba(228,196,147,0.22)";
          ctx.beginPath(); ctx.ellipse(cx + drift, by - h * 0.10, w * 0.36, 4, 0, 0, Math.PI * 2); ctx.fill();
        }
        return;
      }
      const sway = reducedMotion ? 0 : Math.sin(hoistPhase + it.trailerSlot) * 2.2;
      const pedLift = r > 0 ? clamp(0, 1, r / 0.45) * h * 0.34 : 0;
      const wallShift = r > 0.30 ? clamp(0, 1, (r - 0.30) / 0.42) * h * 0.14 : 0;
      const pylonLift = r > 0.65 ? clamp(0, 1, (r - 0.65) / 0.35) * h * 0.10 : 0;
      const hasCement = it.structuralParts.indexOf("cement_pylons") !== -1;

      ctx.fillStyle = hasCement ? PALETTE.cementAsh : PALETTE.stoneMortar;
      for (let p = 0; p < 3; p++) {
        ctx.fillRect(x0 + p * (w * 0.38) + w * 0.05, by - h * 0.16 - pylonLift, w * 0.14, h * 0.16);
      }
      const bodyY = by - h * 0.68 + wallShift * 0.35;
      const bodyH = h * 0.52;
      if (it.id === "ministry") {
        ctx.fillStyle = PALETTE.stoneMortar; ctx.fillRect(x0 + w * 0.08, bodyY, w * 0.84, bodyH);
        ctx.fillStyle = PALETTE.carraraMarble;
        for (let c = 0; c < 6; c++) ctx.fillRect(x0 + w * (0.08 + c * 0.155), bodyY, w * 0.065, bodyH);
      } else if (it.id === "petroleum_refinery") {
        ctx.fillStyle = PALETTE.cementAsh;
        ctx.fillRect(x0 + w * 0.14, by - h * 0.90 - pedLift * 0.5, w * 0.24, h * 0.74);
        ctx.fillRect(x0 + w * 0.54, by - h * 0.80 - pedLift * 0.4, w * 0.26, h * 0.64);
        ctx.strokeStyle = PALETTE.ochreDust; ctx.lineWidth = 1.6;
        ctx.strokeRect(x0 + w * 0.38, by - h * 0.62, w * 0.16, h * 0.26);
      } else if (it.id === "factories") {
        ctx.fillStyle = PALETTE.cementAsh; ctx.fillRect(x0, bodyY + bodyH * 0.18, w, bodyH * 0.82);
        ctx.fillRect(x0 + w * 0.76, by - h * 0.96 - pedLift * 0.4, w * 0.11, h * 0.45);
        for (let t = 0; t < 3; t++) {
          ctx.beginPath(); ctx.moveTo(x0 + t * (w / 3), bodyY + bodyH * 0.18 - pedLift);
          ctx.lineTo(x0 + (t + 0.8) * (w / 3), bodyY - h * 0.08 - pedLift);
          ctx.lineTo(x0 + (t + 1) * (w / 3), bodyY + bodyH * 0.18 - pedLift); ctx.fill();
        }
      } else if (it.id === "docks") {
        ctx.fillStyle = PALETTE.cementAsh; ctx.fillRect(x0, by - h * 0.44, w, h * 0.28);
        ctx.strokeStyle = PALETTE.carraraMarble; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x0 + w * 0.22, by - h * 0.44); ctx.lineTo(x0 + w * 0.48, by - h * 0.92 - pedLift * 0.5);
        ctx.lineTo(x0 + w * 0.92, by - h * 0.78 - pedLift * 0.5); ctx.stroke();
      } else if (it.id === "monument") {
        ctx.fillStyle = PALETTE.carraraMarble; ctx.fillRect(cx - w * 0.26, by - h * 0.62, w * 0.52, h * 0.46);
        ctx.fillStyle = PALETTE.giltSpoke; ctx.beginPath(); ctx.arc(cx, by - h * 0.78 - pedLift * 0.7, w * 0.15, 0, Math.PI * 2); ctx.fill();
      } else {
        if (it.id === "hospital") {
          ctx.fillStyle = PALETTE.stoneMortar; ctx.fillRect(x0 - w * 0.06, bodyY + bodyH * 0.22, w * 1.12, bodyH * 0.78);
          ctx.fillStyle = PALETTE.carraraMarble; ctx.fillRect(cx - w * 0.26, bodyY, w * 0.52, bodyH);
          ctx.fillStyle = PALETTE.carnivalVermilion;
          ctx.fillRect(cx - 2, bodyY + bodyH * 0.28, 4, 10); ctx.fillRect(cx - 5, bodyY + bodyH * 0.28 + 3, 10, 4);
        } else {
          ctx.fillStyle = PALETTE.stoneMortar;
          ctx.fillRect(x0, bodyY, w, bodyH);
        }
        if (it.id === "bank") {
          ctx.strokeStyle = PALETTE.giltSpoke; ctx.lineWidth = 1.8;
          ctx.beginPath(); ctx.arc(cx, bodyY + bodyH * 0.55, Math.min(w, bodyH) * 0.22, 0, Math.PI * 2); ctx.stroke();
        } else if (it.id === "palaces" || it.id === "slaughterhouse") {
          ctx.fillStyle = PALETTE.nightBedrock;
          const arches = it.id === "palaces" ? 3 : 1;
          for (let a = 0; a < arches; a++) ctx.fillRect(x0 + (a + 0.25) * (w / arches), bodyY + bodyH * 0.38, (w / arches) * 0.5, bodyH * 0.62);
          if (it.id === "slaughterhouse") {
            ctx.strokeStyle = PALETTE.trailerIron; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.moveTo(x0 + 4, bodyY + bodyH * 0.25); ctx.lineTo(x0 + w - 4, bodyY + bodyH * 0.25); ctx.stroke();
          }
        } else if (it.id === "school") {
          ctx.fillStyle = PALETTE.carraraMarble; ctx.fillRect(cx - w * 0.14, bodyY - h * 0.22 - pedLift, w * 0.28, h * 0.22);
          ctx.fillStyle = PALETTE.giltSpoke; ctx.beginPath(); ctx.arc(cx, bodyY - h * 0.10 - pedLift, 2.5, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (it.structuralParts.indexOf("marble_pediment") !== -1) {
        const py = bodyY - pedLift + (r > 0 ? sway * 0.4 : 0);
        ctx.fillStyle = PALETTE.carraraMarble;
        ctx.beginPath(); ctx.moveTo(x0 - 2, py); ctx.lineTo(cx, py - h * 0.24); ctx.lineTo(x0 + w + 2, py); ctx.closePath(); ctx.fill();
      } else if (it.structuralParts.indexOf("marble_cornice") !== -1) {
        const cy = bodyY - pedLift + (r > 0 ? sway * 0.4 : 0);
        ctx.fillStyle = PALETTE.carraraMarble; ctx.fillRect(x0 - 3, cy - h * 0.08, w + 6, h * 0.08);
      }
      if (r > 0 && r < 1) {
        const craneTopX = cx + w * 0.34 + sway, craneTopY = by - h * 1.18;
        ctx.strokeStyle = PALETTE.trailerIron; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(x0 + w * 0.55, by); ctx.lineTo(craneTopX, craneTopY); ctx.lineTo(x0 + w + 7, by); ctx.stroke();
        ctx.strokeStyle = PALETTE.giltSpoke; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(craneTopX, craneTopY); ctx.lineTo(cx, bodyY - pedLift - h * 0.12); ctx.stroke();
      }
      if (isActive) {
        ctx.strokeStyle = PALETTE.giltSpoke; ctx.lineWidth = 1.6;
        ctx.strokeRect(x0 - 3, by - h * 1.04, w + 6, h * 1.06);
      }
      ctx.fillStyle = PALETTE.carraraMarble;
      ctx.font = "600 " + Math.max(8, Math.round(width * 0.0072)) + "px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(it.shortLabel, cx, by + 11);
    }

    function renderInstitutionsAndTrailers(ctx, width, height, viewOpts) {
      if (!ctx || width <= 0 || height <= 0) return;
      const vOpts = viewOpts || {};
      const activeId = vOpts.selectedId || vOpts.hoveredId || null;
      const halfX = Math.round(width * 0.50);
      ctx.save();
      ctx.beginPath(); ctx.rect(halfX, 0, width - halfX, height); ctx.clip();
      const grad = ctx.createLinearGradient(0, height * 0.42, 0, height);
      grad.addColorStop(0, "rgba(38,29,21,0.78)");
      grad.addColorStop(0.55, "rgba(72,53,35,0.92)");
      grad.addColorStop(1, PALETTE.nightBedrock);
      ctx.fillStyle = grad; ctx.fillRect(halfX, height * 0.36, width - halfX, height * 0.64);
      ctx.strokeStyle = "rgba(232,185,72,0.45)"; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(halfX + 0.5, 0); ctx.lineTo(halfX + 0.5, height); ctx.stroke(); ctx.setLineDash([]);

      for (let i = 0; i < items.length; i++) {
        if (items[i].ny < 0.60) drawBuildingOrLot(ctx, items[i], width, height, items[i].id === activeId);
      }
      for (let i = 0; i < items.length; i++) {
        if (items[i].ny >= 0.60) drawBuildingOrLot(ctx, items[i], width, height, items[i].id === activeId);
      }

      const hwyY = height * 0.805, hwyH = height * 0.068;
      ctx.fillStyle = "rgba(24,19,15,0.88)"; ctx.fillRect(halfX, hwyY, width - halfX, hwyH);
      ctx.strokeStyle = PALETTE.emptyOchre; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(halfX, hwyY); ctx.lineTo(width, hwyY); ctx.stroke();

      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const tb = trailerBoxNorm(it.trailerSlot - 1);
        const tx = tb.x * width - (tb.w * width) * 0.5, ty = tb.y * height, tw = tb.w * width, th = tb.h * height * 0.44;
        if (tx > width + 20) continue;
        if (caravanDeparted) {
          ctx.fillStyle = "rgba(228,196,147,0.26)";
          ctx.beginPath(); ctx.arc(tx - 6, ty + 2, th * 0.75, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = PALETTE.trailerIron;
        ctx.strokeStyle = it.id === activeId ? PALETTE.giltSpoke : PALETTE.stoneMortar;
        ctx.lineWidth = it.id === activeId ? 1.8 : 1;
        ctx.fillRect(tx, ty - th * 0.5, tw, th); ctx.strokeRect(tx, ty - th * 0.5, tw, th);
        [0.20, 0.36, 0.68, 0.84].forEach(function (wf) {
          const wx = tx + tw * wf, wy = ty + th * 0.56, wr = Math.max(2.6, th * 0.30);
          ctx.fillStyle = PALETTE.cementAsh; ctx.beginPath(); ctx.arc(wx, wy, wr, 0, Math.PI * 2); ctx.fill();
          ctx.strokeStyle = PALETTE.nightBedrock; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(wx - Math.cos(wheelAngle) * wr, wy - Math.sin(wheelAngle) * wr);
          ctx.lineTo(wx + Math.cos(wheelAngle) * wr, wy + Math.sin(wheelAngle) * wr); ctx.stroke();
        });
        if (it.dismantleRatio >= 0.25) {
          const isCementCargo = it.structuralParts.indexOf("cement_pylons") !== -1;
          if (isCementCargo) {
            ctx.fillStyle = PALETTE.cementAsh;
            ctx.fillRect(tx + 3, ty - th * 1.18, tw - 6, th * 0.65);
          } else {
            ctx.fillStyle = PALETTE.carraraMarble;
            ctx.beginPath(); ctx.moveTo(tx + 3, ty - th * 0.5); ctx.lineTo(tx + tw * 0.45, ty - th * 1.30); ctx.lineTo(tx + tw * 0.85, ty - th * 0.5); ctx.fill();
            ctx.fillStyle = PALETTE.stoneMortar; ctx.fillRect(tx + tw * 0.62, ty - th * 1.05, tw * 0.28, th * 0.55);
          }
          ctx.strokeStyle = PALETTE.carnivalVermilion; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(tx + tw * 0.32, ty - th * 1.15); ctx.lineTo(tx + tw * 0.32, ty + th * 0.4);
          ctx.moveTo(tx + tw * 0.70, ty - th * 1.05); ctx.lineTo(tx + tw * 0.70, ty + th * 0.4); ctx.stroke();
        }
        ctx.fillStyle = PALETTE.tentIvory;
        ctx.font = "600 " + Math.max(7, Math.round(width * 0.0058)) + "px monospace";
        ctx.textAlign = "center";
        ctx.fillText("TRL-" + (it.trailerSlot < 10 ? "0" + it.trailerSlot : it.trailerSlot), tx + tw * 0.5, ty + 3);
      }
      ctx.restore();
    }

    return {
      PALETTE: PALETTE,
      INSTITUTIONS: INSTITUTIONS,
      ANNUAL_ITINERARY: ANNUAL_ITINERARY,
      audio: audio,
      setDecampmentProgress: setDecampmentProgress,
      dismantleInstitution: dismantleInstitution,
      unboltInstitution: dismantleInstitution,
      unboltNext: unboltNext,
      unboltNextInstitution: unboltNext,
      departCaravan: departCaravan,
      advanceWaitMonth: advanceWaitMonth,
      returnCaravan: returnCaravan,
      step: step,
      renderInstitutionsAndTrailers: renderInstitutionsAndTrailers,
      hitTest: hitTest,
      setAutoCycle: setAutoCycle,
      setReducedMotion: setReducedMotion,
      reset: reset,
      getState: getState
    };
  }

  root.SophroniaTemporaryInstitutions = Object.freeze({
    PALETTE: PALETTE,
    INSTITUTIONS: INSTITUTIONS,
    ANNUAL_ITINERARY: ANNUAL_ITINERARY,
    createRiggingEngine: createRiggingEngine
  });
})(typeof window !== "undefined" ? window : globalThis);
