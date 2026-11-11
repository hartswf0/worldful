/*
 * City 12: FEDORA (Chapter II - Cities & Desire 4)
 * Layer: Indispensable Gray Stone Metropolis & Central Metal Building
 * Exports: window.FedoraStoneNecessity
 */
(function (globalScope) {
  "use strict";

  const PALETTE = Object.freeze({
    graniteVoid: "#141619",
    ashlarDark: "#23272d",
    quarrySlate: "#3a404a",
    mortarGray: "#5c6470",
    chiseledStone: "#9aa3b0",
    ironMuseum: "#2d353c",
    museumBrass: "#b59a6a",
    cobaltPinpoint: "#4da6ff"
  });

  const MUSEUM_CENTER = Object.freeze({ nx: 0.5, ny: 0.48, hitRadius: 0.122 });

  const PARCEL_BLUEPRINTS = [
    {
      id: "basin_culvert",
      parcelName: "Central Canal Basin",
      stoneStructure: "Granite Freight Culvert",
      mutated: true,
      mutatedEpoch: 1,
      archKind: "culvert",
      supersededDesireHint: "Dried and paved over the central medusa canal basin",
      nx: 0.50,
      ny: 0.68,
      polygon: [[0.40, 0.60], [0.60, 0.60], [0.63, 0.75], [0.37, 0.75]]
    },
    {
      id: "avenue_viaduct",
      parcelName: "Grand Ceremonial Boulevard",
      stoneStructure: "Low Iron-Girder Viaducts",
      mutated: true,
      mutatedEpoch: 2,
      archKind: "viaduct",
      supersededDesireHint: "Narrowed and bridged the boulevard, banishing ceremonial elephants",
      nx: 0.29,
      ny: 0.49,
      polygon: [[0.20, 0.41], [0.37, 0.42], [0.37, 0.57], [0.20, 0.57]]
    },
    {
      id: "skyline_bastion",
      parcelName: "Northwest Pedestal Ridge",
      stoneStructure: "Squat Basalt Flue-Bastions",
      mutated: true,
      mutatedEpoch: 3,
      archKind: "bastion",
      supersededDesireHint: "Claimed every ridge foundation where spiral minarets might have risen",
      nx: 0.26,
      ny: 0.22,
      polygon: [[0.14, 0.13], [0.38, 0.12], [0.37, 0.30], [0.16, 0.31]]
    },
    {
      id: "north_aqueduct",
      parcelName: "North Gorge Cascade",
      stoneStructure: "Monolithic Sluice Aqueduct",
      mutated: false,
      mutatedEpoch: null,
      archKind: "aqueduct",
      supersededDesireHint: "Channeled the open glass-gondola gorge into a sealed granite conduit",
      nx: 0.68,
      ny: 0.20,
      polygon: [[0.58, 0.11], [0.82, 0.13], [0.79, 0.28], [0.59, 0.28]]
    },
    {
      id: "east_ashlar_terraces",
      parcelName: "East Hillside Terraces",
      stoneStructure: "Stepped Ashlar Retaining Tiers",
      mutated: false,
      mutatedEpoch: null,
      archKind: "terraces",
      supersededDesireHint: "Buried the acoustic wind-harp slopes beneath windowless retaining masonry",
      nx: 0.86,
      ny: 0.37,
      polygon: [[0.78, 0.29], [0.95, 0.30], [0.95, 0.47], [0.79, 0.46]]
    },
    {
      id: "south_dock_embankment",
      parcelName: "South Lagoon Landing",
      stoneStructure: "Dressed-Granite Breakwater Quays",
      mutated: false,
      mutatedEpoch: null,
      archKind: "embankment",
      supersededDesireHint: "Filled the tidal lotus amphitheater with heavy freight breakwater caissons",
      nx: 0.67,
      ny: 0.84,
      polygon: [[0.54, 0.77], [0.80, 0.77], [0.82, 0.92], [0.53, 0.92]]
    },
    {
      id: "west_foundry_arcade",
      parcelName: "Southwest Dyers' Colonnade",
      stoneStructure: "Buttressed Slag-Stone Arcade",
      mutated: false,
      mutatedEpoch: null,
      archKind: "arcade",
      supersededDesireHint: "Walled the open silk colonnades inside thick load-bearing foundry piers",
      nx: 0.15,
      ny: 0.69,
      polygon: [[0.05, 0.60], [0.24, 0.60], [0.23, 0.79], [0.06, 0.79]]
    },
    {
      id: "inner_ring_parapet",
      parcelName: "Inner Museum Esplanade",
      stoneStructure: "Crenellated Granite Curtain-Parapet",
      mutated: false,
      mutatedEpoch: null,
      archKind: "parapet",
      supersededDesireHint: "Severed the open promenade around the rotunda with a gray stone curtain wall",
      nx: 0.49,
      ny: 0.26,
      polygon: [[0.39, 0.18], [0.58, 0.18], [0.59, 0.33], [0.39, 0.33]]
    },
    {
      id: "cistern_vaults",
      parcelName: "East Mirror Cisterns",
      stoneStructure: "Blind Ashlar Cistern Vaults",
      mutated: false,
      mutatedEpoch: null,
      archKind: "cistern",
      supersededDesireHint: "Capped the starlight-reflecting subterranean wells under heavy flagstones",
      nx: 0.70,
      ny: 0.49,
      polygon: [[0.63, 0.41], [0.78, 0.41], [0.78, 0.57], [0.63, 0.57]]
    },
    {
      id: "quarry_ramparts",
      parcelName: "Southeast Limestone Bluffs",
      stoneStructure: "Cyclopean Quarry Ramparts",
      mutated: false,
      mutatedEpoch: null,
      archKind: "ramparts",
      supersededDesireHint: "Carved the peacock-arcade gardens into sheer dressed-stone quarry faces",
      nx: 0.84,
      ny: 0.66,
      polygon: [[0.73, 0.59], [0.94, 0.58], [0.94, 0.75], [0.75, 0.75]]
    },
    {
      id: "clockwork_gatehouse",
      parcelName: "Western Caravan Arch",
      stoneStructure: "Counterweighted Portcullis Gatehouse",
      mutated: false,
      mutatedEpoch: null,
      archKind: "gatehouse",
      supersededDesireHint: "Replaced the celestial chimes arch with an iron-grated customs bastion",
      nx: 0.11,
      ny: 0.42,
      polygon: [[0.04, 0.33], [0.19, 0.33], [0.19, 0.54], [0.04, 0.54]]
    },
    {
      id: "granite_causeway",
      parcelName: "Southwest Reed Shallows",
      stoneStructure: "Paved Tolling Causeway",
      mutated: false,
      mutatedEpoch: null,
      archKind: "causeway",
      supersededDesireHint: "Crushed the floating reed pavilions beneath an eight-lane stone causeway",
      nx: 0.34,
      ny: 0.84,
      polygon: [[0.24, 0.77], [0.49, 0.77], [0.48, 0.92], [0.21, 0.92]]
    }
  ];

  function clonePolygon(poly) {
    return poly.map(function (pt) { return [pt[0], pt[1]]; });
  }

  function buildParcelRecord(bp) {
    return {
      id: bp.id,
      parcelId: bp.id,
      parcelName: bp.parcelName,
      label: bp.mutated ? bp.stoneStructure : bp.parcelName,
      stoneStructure: bp.stoneStructure,
      mutated: Boolean(bp.mutated),
      mutatedEpoch: bp.mutatedEpoch,
      strataLevel: bp.mutated ? 1 : 0,
      archKind: bp.archKind,
      supersededDesireHint: bp.supersededDesireHint,
      nx: bp.nx,
      ny: bp.ny,
      polygon: clonePolygon(bp.polygon)
    };
  }

  const PARCELS = Object.freeze(
    PARCEL_BLUEPRINTS.map(function (bp) {
      return Object.freeze(buildParcelRecord(bp));
    })
  );

  function toRoman(num) {
    const n = Math.max(1, Math.floor(num || 1));
    const pairs = [
      [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
      [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
    ];
    let rem = n;
    let out = "";
    for (let i = 0; i < pairs.length; i += 1) {
      while (rem >= pairs[i][0]) {
        out += pairs[i][1];
        rem -= pairs[i][0];
      }
    }
    return out;
  }

  function pointInPolygon(nx, ny, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1];
      const xj = poly[j][0], yj = poly[j][1];
      const intersect = ((yi > ny) !== (yj > ny)) &&
        (nx < ((xj - xi) * (ny - yi)) / ((yj - yi) || 1e-7) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function createStoneAudio() {
    let ctx = null;
    let muted = false;

    function ensureContext() {
      if (muted) return null;
      try {
        if (!ctx) {
          const Ctor = globalScope.AudioContext || globalScope.webkitAudioContext;
          if (!Ctor) return null;
          ctx = new Ctor();
        }
        if (ctx && ctx.state === "suspended" && typeof ctx.resume === "function") {
          const p = ctx.resume();
          if (p && typeof p.catch === "function") p.catch(function () {});
        }
        return ctx;
      } catch (_err) {
        return null;
      }
    }

    function unlock() {
      try {
        const c = ensureContext();
        return Boolean(c);
      } catch (_err) {
        return false;
      }
    }

    function playStoneQuarry() {
      if (muted) return;
      try {
        const c = ensureContext();
        if (!c) return;
        const now = c.currentTime;
        /* Sub-bass granite thud */
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(94, now);
        osc.frequency.exponentialRampToValueAtTime(34, now + 0.34);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.014);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(now);
        osc.stop(now + 0.4);

        /* Flint chisel strike click */
        const clickOsc = c.createOscillator();
        const clickFilter = c.createBiquadFilter();
        const clickGain = c.createGain();
        clickOsc.type = "square";
        clickOsc.frequency.setValueAtTime(1920, now);
        clickOsc.frequency.exponentialRampToValueAtTime(620, now + 0.045);
        clickFilter.type = "bandpass";
        clickFilter.frequency.setValueAtTime(1650, now);
        clickFilter.Q.setValueAtTime(3.2, now);
        clickGain.gain.setValueAtTime(0.09, now);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
        clickOsc.connect(clickFilter);
        clickFilter.connect(clickGain);
        clickGain.connect(c.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.06);
      } catch (_err) { /* headless guard */ }
    }

    function playIronRivet() {
      if (muted) return;
      try {
        const c = ensureContext();
        if (!c) return;
        const now = c.currentTime;
        const partials = [226, 358, 594, 912];
        for (let i = 0; i < partials.length; i += 1) {
          const osc = c.createOscillator();
          const gain = c.createGain();
          osc.type = i % 2 === 0 ? "sine" : "triangle";
          osc.frequency.setValueAtTime(partials[i], now);
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.065 / (i + 1), now + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42 - i * 0.06);
          osc.connect(gain);
          gain.connect(c.destination);
          osc.start(now);
          osc.stop(now + 0.45);
        }
      } catch (_err) { /* headless guard */ }
    }

    function playCrystalSeal(roomNum) {
      if (muted) return;
      try {
        const c = ensureContext();
        if (!c) return;
        const now = c.currentTime;
        const idx = Math.max(1, Number(roomNum) || 4);
        const root = 523.25 * (1 + ((idx - 1) % 6) * 0.055);
        const ratios = [1, 1.498, 2.0, 2.756];
        for (let i = 0; i < ratios.length; i += 1) {
          const osc = c.createOscillator();
          const gain = c.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(root * ratios[i], now + i * 0.022);
          gain.gain.setValueAtTime(0.0001, now + i * 0.022);
          gain.gain.linearRampToValueAtTime(0.075 / (i + 1), now + i * 0.022 + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);
          osc.connect(gain);
          gain.connect(c.destination);
          osc.start(now + i * 0.022);
          osc.stop(now + 0.88);
        }
      } catch (_err) { /* headless guard */ }
    }

    function playGlobeTone(globeId) {
      if (muted) return;
      try {
        const c = ensureContext();
        if (!c) return;
        const now = c.currentTime;
        const key = String(globeId || "");
        if (key.indexOf("medusa") >= 0 || key === "1") {
          /* Watery medusa pond pulse */
          [293.66, 296.8, 440.0].forEach(function (freq, idx) {
            const o = c.createOscillator();
            const g = c.createGain();
            o.type = "sine";
            o.frequency.setValueAtTime(freq, now);
            o.frequency.linearRampToValueAtTime(freq * 1.012, now + 0.35);
            g.gain.setValueAtTime(0.0001, now);
            g.gain.linearRampToValueAtTime(0.055 / (idx + 1), now + 0.14);
            g.gain.exponentialRampToValueAtTime(0.0001, now + 0.68);
            o.connect(g);
            g.connect(c.destination);
            o.start(now);
            o.stop(now + 0.72);
          });
        } else if (key.indexOf("elephant") >= 0 || key === "2") {
          /* Low brass-wood elephant avenue cadence */
          [110.0, 164.81, 220.0].forEach(function (freq, idx) {
            const o = c.createOscillator();
            const g = c.createGain();
            o.type = idx === 1 ? "sawtooth" : "triangle";
            const flt = c.createBiquadFilter();
            flt.type = "lowpass";
            flt.frequency.setValueAtTime(540, now);
            o.frequency.setValueAtTime(freq, now + idx * 0.08);
            g.gain.setValueAtTime(0.0001, now + idx * 0.08);
            g.gain.linearRampToValueAtTime(0.05, now + idx * 0.08 + 0.04);
            g.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);
            o.connect(flt);
            flt.connect(g);
            g.connect(c.destination);
            o.start(now + idx * 0.08);
            o.stop(now + 0.66);
          });
        } else if (key.indexOf("spiral") >= 0 || key.indexOf("minaret") >= 0 || key === "3") {
          /* Descending helical minaret glissando */
          const o = c.createOscillator();
          const g = c.createGain();
          o.type = "sine";
          o.frequency.setValueAtTime(880, now);
          o.frequency.exponentialRampToValueAtTime(293.66, now + 0.56);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.linearRampToValueAtTime(0.07, now + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
          o.connect(g);
          g.connect(c.destination);
          o.start(now);
          o.stop(now + 0.64);
        } else {
          playCrystalSeal(4);
        }
      } catch (_err) { /* headless guard */ }
    }

    return {
      unlock: unlock,
      setMuted: function (flag) { muted = Boolean(flag); return muted; },
      toggleMute: function () { muted = !muted; return muted; },
      isMuted: function () { return muted; },
      playStoneQuarry: playStoneQuarry,
      playIronRivet: playIronRivet,
      playCrystalSeal: playCrystalSeal,
      playGlobeTone: playGlobeTone
    };
  }

  function drawIsoBlock(ctx, x, y, bw, bd, bh, topCol, leftCol, rightCol, strokeCol) {
    const hw = bw * 0.5;
    const hd = bd * 0.28;
    /* Top face */
    ctx.beginPath();
    ctx.moveTo(x, y - bh - hd);
    ctx.lineTo(x + hw, y - bh);
    ctx.lineTo(x, y - bh + hd);
    ctx.lineTo(x - hw, y - bh);
    ctx.closePath();
    ctx.fillStyle = topCol;
    ctx.fill();
    if (strokeCol) { ctx.strokeStyle = strokeCol; ctx.lineWidth = 0.85; ctx.stroke(); }
    /* Left face */
    ctx.beginPath();
    ctx.moveTo(x - hw, y - bh);
    ctx.lineTo(x, y - bh + hd);
    ctx.lineTo(x, y + hd);
    ctx.lineTo(x - hw, y);
    ctx.closePath();
    ctx.fillStyle = leftCol;
    ctx.fill();
    if (strokeCol) { ctx.stroke(); }
    /* Right face */
    ctx.beginPath();
    ctx.moveTo(x, y - bh + hd);
    ctx.lineTo(x + hw, y - bh);
    ctx.lineTo(x + hw, y);
    ctx.lineTo(x, y + hd);
    ctx.closePath();
    ctx.fillStyle = rightCol;
    ctx.fill();
    if (strokeCol) { ctx.stroke(); }
  }

  function drawStoneMonument(ctx, cx, cy, unit, parcel) {
    const strata = Math.max(1, parcel.strataLevel || 1);
    const extraH = Math.min(4, strata - 1) * unit * 0.14;
    const k = parcel.archKind;
    const topC = PALETTE.chiseledStone;
    const midC = PALETTE.mortarGray;
    const darkC = PALETTE.quarrySlate;
    const deepC = PALETTE.ashlarDark;
    const seamC = PALETTE.graniteVoid;

    /* Base ashlar plinth */
    drawIsoBlock(ctx, cx, cy + unit * 0.18, unit * 1.65, unit * 1.25, unit * 0.22 + extraH * 0.4, midC, darkC, deepC, seamC);

    if (k === "culvert") {
      /* Sunken paved freight culvert with twin granite retaining walls & dry iron grates */
      drawIsoBlock(ctx, cx - unit * 0.42, cy + unit * 0.08, unit * 0.55, unit * 0.95, unit * 0.34 + extraH, topC, midC, darkC, seamC);
      drawIsoBlock(ctx, cx + unit * 0.42, cy + unit * 0.08, unit * 0.55, unit * 0.95, unit * 0.34 + extraH, topC, midC, darkC, seamC);
      ctx.strokeStyle = PALETTE.ironMuseum;
      ctx.lineWidth = 1.4;
      for (let i = -2; i <= 2; i += 1) {
        ctx.beginPath();
        ctx.moveTo(cx - unit * 0.22, cy - unit * 0.04 + i * unit * 0.09);
        ctx.lineTo(cx + unit * 0.22, cy - unit * 0.04 + i * unit * 0.09);
        ctx.stroke();
      }
    } else if (k === "viaduct") {
      /* Low iron-girder viaducts on thick granite piers */
      drawIsoBlock(ctx, cx - unit * 0.45, cy + unit * 0.08, unit * 0.38, unit * 0.48, unit * 0.46 + extraH, midC, darkC, deepC, seamC);
      drawIsoBlock(ctx, cx + unit * 0.45, cy + unit * 0.08, unit * 0.38, unit * 0.48, unit * 0.46 + extraH, midC, darkC, deepC, seamC);
      drawIsoBlock(ctx, cx, cy - unit * 0.26 - extraH * 0.6, unit * 1.48, unit * 0.52, unit * 0.16, topC, PALETTE.ironMuseum, deepC, seamC);
    } else if (k === "bastion") {
      /* Three squat basalt flue-bastions claiming minaret foundations */
      drawIsoBlock(ctx, cx - unit * 0.42, cy + unit * 0.06, unit * 0.46, unit * 0.46, unit * 0.54 + extraH, midC, darkC, deepC, seamC);
      drawIsoBlock(ctx, cx + unit * 0.38, cy + unit * 0.08, unit * 0.46, unit * 0.46, unit * 0.48 + extraH, midC, darkC, deepC, seamC);
      drawIsoBlock(ctx, cx - unit * 0.02, cy - unit * 0.04, unit * 0.56, unit * 0.56, unit * 0.68 + extraH, topC, midC, darkC, seamC);
    } else if (k === "aqueduct" || k === "arcade") {
      /* Multi-pier monolithic stone arcade / sluice conduit */
      for (let i = -1; i <= 1; i += 1) {
        drawIsoBlock(ctx, cx + i * unit * 0.46, cy + unit * 0.1, unit * 0.32, unit * 0.44, unit * 0.52 + extraH, midC, darkC, deepC, seamC);
      }
      drawIsoBlock(ctx, cx, cy - unit * 0.34 - extraH * 0.8, unit * 1.46, unit * 0.48, unit * 0.2, topC, midC, darkC, seamC);
    } else if (k === "terraces" || k === "ramparts") {
      /* Stepped cyclopean ashlar tiers */
      drawIsoBlock(ctx, cx, cy + unit * 0.12, unit * 1.4, unit * 0.96, unit * 0.3 + extraH * 0.5, midC, darkC, deepC, seamC);
      drawIsoBlock(ctx, cx + unit * 0.08, cy - unit * 0.08, unit * 1.02, unit * 0.68, unit * 0.32 + extraH * 0.7, topC, midC, darkC, seamC);
      drawIsoBlock(ctx, cx + unit * 0.14, cy - unit * 0.28, unit * 0.62, unit * 0.44, unit * 0.28 + extraH, topC, midC, darkC, seamC);
    } else {
      /* Gatehouse, parapet, cistern, embankment, causeway heavy ashlar massing */
      drawIsoBlock(ctx, cx - unit * 0.34, cy + unit * 0.06, unit * 0.58, unit * 0.62, unit * 0.5 + extraH, topC, midC, darkC, seamC);
      drawIsoBlock(ctx, cx + unit * 0.34, cy + unit * 0.06, unit * 0.58, unit * 0.62, unit * 0.5 + extraH, topC, midC, darkC, seamC);
      drawIsoBlock(ctx, cx, cy + unit * 0.02, unit * 0.68, unit * 0.5, unit * 0.36 + extraH * 0.8, midC, darkC, deepC, seamC);
    }
  }

  function drawQuarryScaffold(ctx, cx, cy, unit, progress, timeMs, effReduced) {
    const p = Math.max(0, Math.min(1, Number(progress) || 0));
    const sway = effReduced ? 0 : Math.sin((timeMs || 0) * 0.0028) * 0.08;
    const mastH = unit * (0.68 + p * 0.34);

    /* Rising unfinished stone foundation course */
    if (p > 0.04) {
      drawIsoBlock(
        ctx, cx, cy + unit * 0.14,
        unit * (0.9 + p * 0.6), unit * (0.7 + p * 0.4), unit * (0.08 + p * 0.36),
        PALETTE.mortarGray, PALETTE.quarrySlate, PALETTE.ashlarDark, PALETTE.graniteVoid
      );
    }

    /* Timber & iron scaffold frame */
    ctx.save();
    ctx.strokeStyle = PALETTE.museumBrass;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(cx - unit * 0.45, cy + unit * 0.16);
    ctx.lineTo(cx - unit * 0.45, cy - mastH * 0.62);
    ctx.moveTo(cx + unit * 0.45, cy + unit * 0.16);
    ctx.lineTo(cx + unit * 0.45, cy - mastH * 0.62);
    ctx.moveTo(cx - unit * 0.48, cy - mastH * 0.34);
    ctx.lineTo(cx + unit * 0.48, cy - mastH * 0.34);
    /* Central quarry crane mast & jib */
    ctx.moveTo(cx, cy + unit * 0.12);
    ctx.lineTo(cx, cy - mastH);
    const jibX = cx + unit * (0.56 + sway);
    const jibY = cy - mastH - unit * 0.14;
    ctx.lineTo(jibX, jibY);
    /* Suspended granite ashlar block */
    const dropY = jibY + unit * (0.28 + (1 - p) * 0.22);
    ctx.moveTo(jibX, jibY);
    ctx.lineTo(jibX, dropY);
    ctx.stroke();

    drawIsoBlock(
      ctx, jibX, dropY + unit * 0.1,
      unit * 0.3, unit * 0.24, unit * 0.16,
      PALETTE.chiseledStone, PALETTE.mortarGray, PALETTE.quarrySlate, PALETTE.graniteVoid
    );
    ctx.restore();
  }

  function drawCentralMetalBuilding(ctx, w, h, roomCount, isHovered, timeMs, effReduced) {
    const cx = MUSEUM_CENTER.nx * w;
    const cy = MUSEUM_CENTER.ny * h;
    const R = Math.min(w, h) * 0.108;
    const rooms = Math.max(3, Math.floor(roomCount || 3));
    const extraWings = Math.min(8, Math.max(0, rooms - 3));
    const pulse = effReduced ? 0.85 : 0.78 + 0.22 * Math.sin((timeMs || 0) * 0.0032);

    ctx.save();
    /* Outer stone & brass octagonal courtyard apron */
    ctx.beginPath();
    for (let i = 0; i < 8; i += 1) {
      const ang = (i * Math.PI) / 4 + Math.PI / 8;
      const px = cx + Math.cos(ang) * R * 1.32;
      const py = cy + Math.sin(ang) * R * 0.96;
      if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = PALETTE.ashlarDark;
    ctx.fill();
    ctx.strokeStyle = isHovered ? PALETTE.museumBrass : PALETTE.mortarGray;
    ctx.lineWidth = isHovered ? 2.2 : 1.2;
    ctx.stroke();

    /* Expanding radial cast-iron museum wings (grow with superseded futures) */
    const totalSpokes = Math.min(12, 4 + extraWings);
    for (let s = 0; s < totalSpokes; s += 1) {
      const ang = -Math.PI / 2 + (s * Math.PI * 2) / totalSpokes;
      const wingLen = R * (0.86 + Math.min(0.36, Math.max(0, rooms - 3) * 0.032));
      const wx = cx + Math.cos(ang) * wingLen;
      const wy = cy + Math.sin(ang) * wingLen * 0.74;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(wx, wy);
      ctx.strokeStyle = PALETTE.ironMuseum;
      ctx.lineWidth = Math.max(5, R * 0.22);
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.strokeStyle = PALETTE.museumBrass;
      ctx.lineWidth = 1.0;
      ctx.stroke();
    }

    /* Cast-iron rotunda drum */
    ctx.beginPath();
    ctx.ellipse(cx, cy + R * 0.06, R * 0.82, R * 0.58, 0, 0, Math.PI * 2);
    ctx.fillStyle = PALETTE.ironMuseum;
    ctx.fill();
    ctx.strokeStyle = PALETTE.museumBrass;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    /* Ribbed riveted cast-iron dome */
    const domeY = cy - R * 0.16;
    const grad = ctx.createRadialGradient(cx - R * 0.2, domeY - R * 0.22, R * 0.06, cx, domeY, R * 0.78);
    grad.addColorStop(0, "#4b5864");
    grad.addColorStop(0.65, PALETTE.ironMuseum);
    grad.addColorStop(1, PALETTE.graniteVoid);
    ctx.beginPath();
    ctx.ellipse(cx, domeY, R * 0.72, R * 0.52, 0, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = PALETTE.museumBrass;
    ctx.lineWidth = 1.25;
    ctx.stroke();

    /* Riveted meridian dome ribs */
    ctx.strokeStyle = "rgba(181, 154, 106, 0.42)";
    ctx.lineWidth = 0.9;
    for (let r = 0; r < 6; r += 1) {
      const a = (r * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(cx - Math.cos(a) * R * 0.7, domeY - Math.sin(a) * R * 0.48);
      ctx.quadraticCurveTo(cx, domeY - R * 0.34, cx + Math.cos(a) * R * 0.7, domeY + Math.sin(a) * R * 0.48);
      ctx.stroke();
    }

    /* Glowing cobalt-blue crystal globe oculus windows (1 crystal globe in every room) */
    const visibleOculi = Math.min(rooms, 36);
    for (let idx = 0; idx < visibleOculi; idx += 1) {
      const ring = idx < 6 ? 0 : (idx < 16 ? 1 : 2);
      const countInRing = ring === 0 ? Math.min(rooms, 6) : (ring === 1 ? Math.min(rooms - 6, 10) : visibleOculi - 16);
      const posInRing = ring === 0 ? idx : (ring === 1 ? idx - 6 : idx - 16);
      const ang = -Math.PI / 2 + (posInRing * Math.PI * 2) / Math.max(1, countInRing);
      const rad = ring === 0 ? R * 0.46 : (ring === 1 ? R * 0.88 : R * 1.14);
      const ox = cx + Math.cos(ang) * rad;
      const oy = (ring === 0 ? domeY : cy) + Math.sin(ang) * rad * 0.72;
      const dotR = Math.max(2.4, R * (ring === 0 ? 0.088 : 0.068));

      /* Cobalt aura */
      ctx.beginPath();
      ctx.arc(ox, oy, dotR * 2.3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(77, 166, 255, " + (0.24 * pulse).toFixed(3) + ")";
      ctx.fill();
      /* Sapphire crystal window */
      ctx.beginPath();
      ctx.arc(ox, oy, dotR, 0, Math.PI * 2);
      ctx.fillStyle = PALETTE.cobaltPinpoint;
      ctx.fill();
      /* Specular pinpoint */
      ctx.beginPath();
      ctx.arc(ox - dotR * 0.28, oy - dotR * 0.28, dotR * 0.38, 0, Math.PI * 2);
      ctx.fillStyle = "#e6f6ff";
      ctx.fill();
    }

    /* Central brass lantern finial */
    ctx.beginPath();
    ctx.arc(cx, domeY - R * 0.14, Math.max(3, R * 0.11), 0, Math.PI * 2);
    ctx.fillStyle = PALETTE.museumBrass;
    ctx.fill();
    ctx.restore();
  }

  function renderPanorama(ctx, width, height, stateSnap, viewOpts) {
    if (!ctx || width <= 0 || height <= 0) return;
    const vo = viewOpts || {};
    const timeMs = typeof vo.timeMs === "number" ? vo.timeMs : 0;
    const hoveredId = vo.hoveredParcelId || null;
    const globeParcelId = vo.selectedGlobeParcelId || null;
    const roomCount = typeof vo.museumRoomCount === "number"
      ? Math.max(3, vo.museumRoomCount)
      : stateSnap.museumRoomCount;
    const buildProg = typeof vo.buildProgress === "number"
      ? vo.buildProgress
      : stateSnap.activeBuildProgress;
    const effReduced = typeof vo.reducedMotion === "boolean"
      ? vo.reducedMotion
      : stateSnap.reducedMotion;
    const unit = Math.max(16, Math.min(width, height) * 0.068);
    const mcx = MUSEUM_CENTER.nx * width;
    const mcy = MUSEUM_CENTER.ny * height;

    ctx.save();
    /* 1. Atmospheric slate-granite quarry backdrop */
    const bg = ctx.createLinearGradient(0, 0, 0, height);
    bg.addColorStop(0, PALETTE.graniteVoid);
    bg.addColorStop(0.55, "#191d22");
    bg.addColorStop(1, PALETTE.ashlarDark);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    /* Oblique architectural surveyor grid & concentric datum rings */
    ctx.strokeStyle = "rgba(92, 100, 112, 0.16)";
    ctx.lineWidth = 1;
    for (let ring = 1; ring <= 4; ring += 1) {
      ctx.beginPath();
      ctx.ellipse(mcx, mcy, width * 0.11 * ring, height * 0.088 * ring, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    /* 2. Radial stone arteries connecting parcels to Central Metal Building */
    stateSnap.parcels.forEach(function (p) {
      const px = p.nx * width;
      const py = p.ny * height;
      ctx.beginPath();
      ctx.moveTo(mcx, mcy);
      ctx.lineTo(px, py);
      ctx.strokeStyle = p.mutated ? "rgba(154, 163, 176, 0.28)" : "rgba(77, 166, 255, 0.14)";
      ctx.lineWidth = p.mutated ? 3.2 : 1.4;
      ctx.stroke();
    });

    /* 3. Parcel ground plates */
    const nextId = stateSnap.nextTargetId;
    stateSnap.parcels.forEach(function (p) {
      const isHov = hoveredId === p.id;
      const isGlobeSite = globeParcelId === p.id;
      ctx.beginPath();
      p.polygon.forEach(function (pt, idx) {
        const vx = pt[0] * width;
        const vy = pt[1] * height;
        if (idx === 0) ctx.moveTo(vx, vy); else ctx.lineTo(vx, vy);
      });
      ctx.closePath();
      ctx.fillStyle = p.mutated ? PALETTE.ashlarDark : "rgba(22, 38, 56, 0.56)";
      ctx.fill();

      if (isGlobeSite) {
        ctx.strokeStyle = PALETTE.cobaltPinpoint;
        ctx.lineWidth = 2.2;
        ctx.setLineDash([5, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = isHov ? PALETTE.museumBrass : (p.mutated ? PALETTE.mortarGray : "rgba(77, 166, 255, 0.34)");
        ctx.lineWidth = isHov ? 2.0 : 1.05;
        ctx.stroke();
      }
    });

    /* 4. Depth-sorted isometric structures + Central Metal Building */
    const drawQueue = stateSnap.parcels.map(function (p) {
      return { kind: "parcel", ny: p.ny, parcel: p };
    });
    drawQueue.push({ kind: "museum", ny: MUSEUM_CENTER.ny });
    drawQueue.sort(function (a, b) { return a.ny - b.ny; });

    drawQueue.forEach(function (item) {
      if (item.kind === "museum") {
        drawCentralMetalBuilding(
          ctx, width, height, roomCount,
          hoveredId === "central_metal_museum", timeMs, effReduced
        );
        return;
      }
      const p = item.parcel;
      const cx = p.nx * width;
      const cy = p.ny * height;
      if (p.mutated) {
        drawStoneMonument(ctx, cx, cy, unit, p);
      } else if (p.id === nextId) {
        drawQuarryScaffold(ctx, cx, cy, unit, buildProg, timeMs, effReduced);
      } else {
        /* Delicate azure pre-stone contour hinting at unsealed possibility */
        ctx.beginPath();
        ctx.ellipse(cx, cy + unit * 0.08, unit * 0.55, unit * 0.28, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(77, 166, 255, 0.42)";
        ctx.lineWidth = 1.1;
        ctx.stroke();
      }

      /* Spectral blue phantom reticle where selected crystal globe's dream was crushed */
      if (globeParcelId === p.id) {
        ctx.save();
        ctx.strokeStyle = PALETTE.cobaltPinpoint;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(cx, cy - unit * 0.12, unit * 0.92, unit * 0.48, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - unit * 0.95);
        ctx.lineTo(cx, cy - unit * 0.22);
        ctx.stroke();
        ctx.restore();
      }
    });

    /* 5. Recent stone mutation shockwaves */
    stateSnap.shockwaves.forEach(function (sw) {
      const age = effReduced ? 0.45 : Math.max(0, Math.min(1, (timeMs - sw.bornAt) / 1350));
      if (age >= 1) return;
      const sx = sw.nx * width;
      const sy = sw.ny * height;
      ctx.beginPath();
      ctx.ellipse(sx, sy, unit * (0.6 + age * 2.1), unit * (0.36 + age * 1.25), 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(154, 163, 176, " + ((1 - age) * 0.7).toFixed(3) + ")";
      ctx.lineWidth = 2.0 * (1 - age * 0.5);
      ctx.stroke();
    });
    ctx.restore();
  }

  function createEngine(opts) {
    const options = opts || {};
    const onStoneMutated = typeof options.onStoneMutated === "function"
      ? options.onStoneMutated
      : null;

    let epoch = 3;
    let mutatedCount = 3;
    let stoneDensity = 0.42;
    let activeBuildProgress = 0;
    let autoMutate = false;
    let museumRoomCount = 3;
    let reducedMotion = Boolean(options.reducedMotion);
    let lastMutation = null;
    let lastRenderTimeMs = 0;
    let parcels = PARCEL_BLUEPRINTS.map(buildParcelRecord);
    let shockwaves = [];

    const audio = createStoneAudio();

    function getNextUnmutated() {
      for (let i = 0; i < parcels.length; i += 1) {
        if (!parcels[i].mutated) return parcels[i];
      }
      return null;
    }

    function snapshotParcel(p) {
      return {
        id: p.id,
        parcelId: p.id,
        parcelName: p.parcelName,
        label: p.label,
        stoneStructure: p.stoneStructure,
        mutated: p.mutated,
        mutatedEpoch: p.mutatedEpoch,
        strataLevel: p.strataLevel,
        supersededDesireHint: p.supersededDesireHint,
        nx: p.nx,
        ny: p.ny,
        polygon: clonePolygon(p.polygon)
      };
    }

    function getState() {
      const mutatedIds = [];
      for (let i = 0; i < parcels.length; i += 1) {
        if (parcels[i].mutated) mutatedIds.push(parcels[i].id);
      }
      const nextTarget = getNextUnmutated() || parcels[(epoch - 3) % parcels.length];
      return {
        epoch: epoch,
        stoneDensity: stoneDensity,
        activeBuildProgress: activeBuildProgress,
        autoMutate: autoMutate,
        reducedMotion: reducedMotion,
        mutatedCount: mutatedCount,
        totalParcels: 12,
        nextTargetParcelId: nextTarget ? nextTarget.id : null,
        mutatedParcelIds: mutatedIds,
        parcels: parcels.map(snapshotParcel),
        centralMetalBuilding: {
          roomCount: museumRoomCount,
          material: "riveted_cast_iron",
          globeInEveryRoom: true,
          nx: MUSEUM_CENTER.nx,
          ny: MUSEUM_CENTER.ny
        },
        lastMutation: lastMutation ? Object.assign({}, lastMutation) : null,
        necessityClaim: "What is accepted as necessary when it is not yet so",
        muted: audio.isMuted()
      };
    }

    function performMutation(targetParcel, reason) {
      epoch += 1;
      const target = targetParcel || getNextUnmutated() || parcels[(epoch - 4) % parcels.length];
      if (!target.mutated) {
        target.mutated = true;
        target.mutatedEpoch = epoch;
        target.strataLevel = 1;
        target.label = target.stoneStructure;
      } else {
        target.strataLevel = (target.strataLevel || 1) + 1;
        target.label = target.stoneStructure + " (Stratum " + toRoman(target.strataLevel) + ")";
      }

      mutatedCount = parcels.filter(function (p) { return p.mutated; }).length;
      stoneDensity = Number(
        Math.min(0.98, 0.42 + mutatedCount * 0.05 + (epoch - 3) * 0.015).toFixed(4)
      );
      activeBuildProgress = 0;
      museumRoomCount += 1;

      shockwaves.push({ nx: target.nx, ny: target.ny, bornAt: lastRenderTimeMs });
      if (shockwaves.length > 6) shockwaves.shift();

      audio.playStoneQuarry();

      const structureName = target.strataLevel > 1
        ? target.stoneStructure + " (Stratum " + toRoman(target.strataLevel) + ")"
        : target.stoneStructure;

      const mutationEvent = {
        epoch: epoch,
        reason: reason || "urban-necessity",
        parcelId: target.id,
        parcelName: target.parcelName,
        stoneStructure: structureName,
        supersededDesireHint: target.supersededDesireHint,
        stoneDensity: stoneDensity
      };
      lastMutation = mutationEvent;

      if (onStoneMutated) {
        onStoneMutated(mutationEvent, getState());
      }
      return mutationEvent;
    }

    function advanceMutation(reason) {
      return performMutation(getNextUnmutated(), reason || "urban-necessity");
    }

    function quarryParcel(parcelId) {
      const found = parcels.find(function (p) { return p.id === parcelId; });
      const target = (found && !found.mutated)
        ? found
        : (getNextUnmutated() || found || parcels[(epoch - 3) % parcels.length]);
      return performMutation(target, "quarry-parcel");
    }

    function tickConstruction(dtSec, effortDelta) {
      const dt = Math.max(0, Number(dtSec) || 0);
      const effort = Math.max(0, Number(effortDelta) || 0);
      activeBuildProgress += effort + (autoMutate ? dt * 0.16 : 0);
      if (activeBuildProgress >= 1.0) {
        return advanceMutation("while-constructing-model");
      }
      return null;
    }

    function syncRoomCount(n) {
      museumRoomCount = Math.max(3, Math.floor(Number(n) || 3));
      return museumRoomCount;
    }

    function hitTest(normX, normY) {
      const nx = Number(normX) || 0;
      const ny = Number(normY) || 0;
      const distCenter = Math.hypot(nx - MUSEUM_CENTER.nx, (ny - MUSEUM_CENTER.ny) * 1.15);
      if (distCenter <= MUSEUM_CENTER.hitRadius) {
        return {
          kind: "central_metal_museum",
          id: "central_metal_museum",
          label: "Central Metal Building (Fedora's Museum)",
          roomCount: museumRoomCount
        };
      }
      let match = null;
      for (let i = 0; i < parcels.length; i += 1) {
        if (pointInPolygon(nx, ny, parcels[i].polygon)) {
          match = parcels[i];
          break;
        }
      }
      if (!match) {
        let bestD = Infinity;
        for (let j = 0; j < parcels.length; j += 1) {
          const d = Math.hypot(nx - parcels[j].nx, ny - parcels[j].ny);
          if (d < bestD) {
            bestD = d;
            match = parcels[j];
          }
        }
      }
      return {
        kind: "parcel",
        id: match.id,
        parcelId: match.id,
        parcelName: match.parcelName,
        label: match.label,
        mutated: match.mutated,
        mutatedEpoch: match.mutatedEpoch,
        stoneStructure: match.stoneStructure,
        supersededDesireHint: match.supersededDesireHint
      };
    }

    function resetToEpoch3() {
      epoch = 3;
      mutatedCount = 3;
      stoneDensity = 0.42;
      activeBuildProgress = 0;
      autoMutate = false;
      museumRoomCount = 3;
      lastMutation = null;
      shockwaves = [];
      parcels = PARCEL_BLUEPRINTS.map(buildParcelRecord);
      return getState();
    }

    function render(ctx, width, height, viewOpts) {
      if (viewOpts && typeof viewOpts.timeMs === "number") {
        lastRenderTimeMs = viewOpts.timeMs;
      }
      const nextTarget = getNextUnmutated() || parcels[(epoch - 3) % parcels.length];
      renderPanorama(ctx, width, height, {
        parcels: parcels,
        museumRoomCount: museumRoomCount,
        activeBuildProgress: activeBuildProgress,
        reducedMotion: reducedMotion,
        nextTargetId: nextTarget ? nextTarget.id : null,
        shockwaves: shockwaves
      }, viewOpts);
    }

    return {
      PALETTE: PALETTE,
      PARCELS: PARCELS,
      audio: audio,
      render: render,
      advanceMutation: advanceMutation,
      quarryParcel: quarryParcel,
      tickConstruction: tickConstruction,
      syncRoomCount: syncRoomCount,
      hitTest: hitTest,
      setAutoMutate: function (flag) { autoMutate = Boolean(flag); return autoMutate; },
      toggleAutoMutate: function () { autoMutate = !autoMutate; return autoMutate; },
      setReducedMotion: function (flag) { reducedMotion = Boolean(flag); return reducedMotion; },
      resetToEpoch3: resetToEpoch3,
      getState: getState
    };
  }

  const FedoraStoneNecessity = Object.freeze({
    PALETTE: PALETTE,
    PARCELS: PARCELS,
    createEngine: createEngine
  });

  globalScope.FedoraStoneNecessity = FedoraStoneNecessity;
  if (typeof window !== "undefined") {
    window.FedoraStoneNecessity = FedoraStoneNecessity;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = FedoraStoneNecessity;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
