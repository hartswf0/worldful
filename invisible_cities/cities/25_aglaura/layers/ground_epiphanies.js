/**
 * Ground Aglaura — Colorless Street Openings & Unworded Liminal Epiphanies
 * Standalone ES6 IIFE module exposing globalThis.AglauraGroundEpiphanies
 */
(function (root) {
  "use strict";

  const PALETTE = Object.freeze({
    ironGallVoid: "#171514",
    gallStone: "#252220",
    colorlessFog: "#7d8082",
    chalkPlaster: "#c8c6be",
    parchmentChalk: "#ebe5d5",
    rubricOxide: "#8f3d2e",
    epiphanyGold: "#d8a648",
    epiphanyFlare: "#f6de92"
  });

  const CERTAIN_HOURS = Object.freeze([
    Object.freeze({
      id: "leaden_forenoon",
      index: 0,
      romanHour: "IX",
      hourLabel: "IX · Leaden Forenoon",
      isLiminalWindow: false,
      fogDensity: 0.88,
      skyTone: "#8b8d8e",
      groundNote: "Flat chalk overcast; unplanned sheds stand mute and characterless."
    }),
    Object.freeze({
      id: "chalk_midday",
      index: 1,
      romanHour: "XII",
      hourLabel: "XII · Chalk Midday",
      isLiminalWindow: false,
      fogDensity: 0.92,
      skyTone: "#9a9b98",
      groundNote: "Colorless, characterless Aglaura planted at random beneath vertical glare."
    }),
    Object.freeze({
      id: "oblique_vespers",
      index: 2,
      romanHour: "XVI",
      hourLabel: "XVI · Oblique Vespers",
      isLiminalWindow: true,
      fogDensity: 0.30,
      skyTone: "#524c46",
      groundNote: "Certain Hour I — low slant rays part the lime haze along quiet corners."
    }),
    Object.freeze({
      id: "suspended_gloaming",
      index: 3,
      romanHour: "XVIII",
      hourLabel: "XVIII · Suspended Gloaming",
      isLiminalWindow: true,
      fogDensity: 0.24,
      skyTone: "#3c3733",
      groundNote: "Certain Hour II — breathless twilight holds an unmistakable golden suspicion."
    }),
    Object.freeze({
      id: "ash_dusk",
      index: 4,
      romanHour: "XX",
      hourLabel: "XX · Ash Dusk",
      isLiminalWindow: false,
      fogDensity: 0.86,
      skyTone: "#4e4f50",
      groundNote: "Ashen murk returns the random plaster walls to ordinary obscurity."
    }),
    Object.freeze({
      id: "pale_daybreak",
      index: 5,
      romanHour: "V",
      hourLabel: "V · Pale Daybreak Cleft",
      isLiminalWindow: true,
      fogDensity: 0.28,
      skyTone: "#4b4642",
      groundNote: "Certain Hour III — pale amber cleft before habitual speech awakens."
    })
  ]);

  const STREET_OPENINGS = Object.freeze([
    Object.freeze({
      id: "aperture_chalk_alley",
      index: 0,
      name: "Slanted Chalk Alley",
      ordinaryAppearance: "Random lime shed walls leaning without plan beside a rutted chalk gutter.",
      epiphanyHintVisual: "Cathedral-narrow honeyed blade of light with revolving astrolabe dust-motes.",
      unwordableDraftSeed: "honeyed blade of light and revolving dust-motes between the chalk walls",
      coords: Object.freeze({ nx: 0.14, ny: 0.56 })
    }),
    Object.freeze({
      id: "aperture_cistern_arch",
      index: 1,
      name: "Sunken Cistern Archway",
      ordinaryAppearance: "Cracked plaster culvert beside grey weeds and stagnant kerbside runoff.",
      epiphanyHintVisual: "Twin inverted arches mirrored in still rainwater opening a subterranean pale-gold colonnade.",
      unwordableDraftSeed: "twin inverted arches opening a pale-gold colonnade beneath still rainwater",
      coords: Object.freeze({ nx: 0.29, ny: 0.65 })
    }),
    Object.freeze({
      id: "aperture_gable_cleft",
      index: 2,
      name: "Unmapped Gable Cleft",
      ordinaryAppearance: "Haphazard timber eaves colliding at awkward angles above a blind passage.",
      epiphanyHintVisual: "Airborne stair of gilded terrace-shadow ascending between blind gables.",
      unwordableDraftSeed: "airborne stair of gilded terrace-shadow ascending between blind gables",
      coords: Object.freeze({ nx: 0.44, ny: 0.46 })
    }),
    Object.freeze({
      id: "aperture_windless_court",
      index: 3,
      name: "Windless Plaster Court",
      ordinaryAppearance: "Drab trapezium of flaking stucco, patched mortar, and random drainpipes.",
      epiphanyHintVisual: "Pomegranate bough and quiet linen held in breathless amber equilibrium.",
      unwordableDraftSeed: "pomegranate bough and quiet linen held in breathless amber equilibrium",
      coords: Object.freeze({ nx: 0.59, ny: 0.63 })
    }),
    Object.freeze({
      id: "aperture_stairwell_bend",
      index: 4,
      name: "Crooked Stairwell Bend",
      ordinaryAppearance: "Uneven limestone risers ending abruptly at a blank mortar party wall.",
      epiphanyHintVisual: "Oblique twilight prism turning worn steps into translucent alabaster poised above a hidden garden.",
      unwordableDraftSeed: "worn steps turned into translucent alabaster poised above a hidden garden",
      coords: Object.freeze({ nx: 0.74, ny: 0.54 })
    }),
    Object.freeze({
      id: "aperture_roofline_gap",
      index: 5,
      name: "Westward Roofline Gap",
      ordinaryAppearance: "Colorless chimney pots scattered at random against a flat overcast.",
      epiphanyHintVisual: "Rare horizon fissure where distant domes of pure light briefly hover before words touch them.",
      unwordableDraftSeed: "distant domes of pure light hovering inside a westward horizon fissure",
      coords: Object.freeze({ nx: 0.88, ny: 0.40 })
    })
  ]);

  const RANDOM_SHEDS = Object.freeze(
    Array.from({ length: 20 }, (_, i) => {
      const seed = (i * 73 + 19) % 97;
      return Object.freeze({
        nx: (i / 20) * 0.96 + 0.01,
        nw: 0.048 + (seed % 7) * 0.008,
        nh: 0.22 + ((seed * 3) % 11) * 0.026,
        baseY: 0.76 + (i % 3) * 0.04,
        roofSkew: ((seed % 9) - 4) * 0.009,
        shade: i % 3 === 0 ? "#b8b6ae" : i % 3 === 1 ? "#919394" : "#6c6e70",
        hasPipe: seed % 2 === 0,
        flueOffset: (seed % 5) * 0.16 + 0.15
      });
    })
  );

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function round3(v) {
    return +Number(v).toFixed(3);
  }

  function rgba(hex, alpha) {
    const clean = hex.replace("#", "");
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return "rgba(" + r + "," + g + "," + b + "," + clamp(alpha, 0, 1).toFixed(3) + ")";
  }

  function cloneAperture(ap) {
    return {
      id: ap.id,
      index: ap.index,
      name: ap.name,
      ordinaryAppearance: ap.ordinaryAppearance,
      epiphanyHintVisual: ap.epiphanyHintVisual,
      unwordableDraftSeed: ap.unwordableDraftSeed,
      coords: { nx: ap.coords.nx, ny: ap.coords.ny },
      status: ap.status,
      peakLuminance: ap.peakLuminance,
      overwrittenByProverb: ap.overwrittenByProverb
    };
  }

  function makeInitialApertures() {
    return STREET_OPENINGS.map((opening) => ({
      id: opening.id,
      index: opening.index,
      name: opening.name,
      ordinaryAppearance: opening.ordinaryAppearance,
      epiphanyHintVisual: opening.epiphanyHintVisual,
      unwordableDraftSeed: opening.unwordableDraftSeed,
      coords: { nx: opening.coords.nx, ny: opening.coords.ny },
      status: "unseen",
      peakLuminance: 0,
      overwrittenByProverb: null
    }));
  }

  function createGroundEngine(opts = {}) {
    let hourIndex = 1;
    let selectedApertureId = "aperture_chalk_alley";
    let silentDwellSec = 0;
    let epiphanyIntensity = 0;
    let silentWitnessedCount = 0;
    let lostRecollectionsCount = 0;
    let groundSubstance = 0.24;
    let erasureFlash = 0;
    let reducedMotion = Boolean(opts.reducedMotion);
    let ambientPhase = 0;
    let apertures = makeInitialApertures();

    function getActiveAperture() {
      return apertures.find((a) => a.id === selectedApertureId) || apertures[0];
    }

    function recount() {
      silentWitnessedCount = apertures.filter((a) => a.status === "witnessed_silently").length;
      lostRecollectionsCount = apertures.filter((a) => a.status === "lost_for_lack_of_words").length;
      groundSubstance = Math.max(0.08, round3(0.24 - lostRecollectionsCount * 0.025));
    }

    function getState() {
      const currentHour = CERTAIN_HOURS[hourIndex];
      const active = getActiveAperture();
      return {
        hourIndex,
        currentHour,
        isCertainHour: currentHour.isLiminalWindow,
        hours: CERTAIN_HOURS,
        selectedApertureId,
        selectedAperture: cloneAperture(active),
        apertures: apertures.map(cloneAperture),
        silentDwellSec,
        epiphanyIntensity,
        hasMagnificentSuspicion: epiphanyIntensity >= 0.65,
        silentWitnessedCount,
        lostRecollectionsCount,
        groundSubstance,
        erasureFlash,
        reducedMotion,
        colorlessAndRandomAtOrdinaryHours: true,
        canSpeakOnlyOfSpokenAglaura: true
      };
    }

    function setHour(indexOrId) {
      let target = null;
      if (typeof indexOrId === "number" && Number.isInteger(indexOrId)) {
        target = CERTAIN_HOURS[clamp(indexOrId, 0, CERTAIN_HOURS.length - 1)];
      } else if (typeof indexOrId === "string") {
        const trimmed = indexOrId.trim();
        if (/^[0-5]$/.test(trimmed)) {
          target = CERTAIN_HOURS[Number(trimmed)];
        } else {
          const upper = trimmed.toUpperCase();
          target = CERTAIN_HOURS.find((h) => h.id === trimmed || h.romanHour === upper) || null;
        }
      }
      if (target) {
        hourIndex = target.index;
      }
      const currentHour = CERTAIN_HOURS[hourIndex];
      const active = getActiveAperture();
      if (!currentHour.isLiminalWindow || active.status === "lost_for_lack_of_words") {
        epiphanyIntensity = 0;
        silentDwellSec = 0;
      }
      return getState();
    }

    function seekCertainHour() {
      if (hourIndex < 2) {
        hourIndex = 2;
      } else if (hourIndex === 2) {
        hourIndex = 3;
      } else if (hourIndex === 3 || hourIndex === 4) {
        hourIndex = 5;
      } else {
        hourIndex = 2;
      }
      let active = getActiveAperture();
      if (active.status === "lost_for_lack_of_words") {
        for (let step = 1; step <= apertures.length; step++) {
          const candidate = apertures[(active.index + step) % apertures.length];
          if (candidate.status !== "lost_for_lack_of_words") {
            selectedApertureId = candidate.id;
            silentDwellSec = 0;
            epiphanyIntensity = 0;
            active = candidate;
            break;
          }
        }
      }
      if (active.status !== "lost_for_lack_of_words") {
        silentDwellSec = round3(Math.max(silentDwellSec, 0.45));
        epiphanyIntensity = round3(Math.min(1.0, silentDwellSec / 2.0));
        active.peakLuminance = round3(Math.max(active.peakLuminance, epiphanyIntensity));
        if (epiphanyIntensity >= 0.65 && active.status !== "witnessed_silently") {
          active.status = "witnessed_silently";
          recount();
        }
      } else {
        silentDwellSec = 0;
        epiphanyIntensity = 0;
      }
      return {
        currentHour: CERTAIN_HOURS[hourIndex],
        selectedAperture: cloneAperture(active)
      };
    }

    function selectAperture(idOrIndex) {
      let target = null;
      if (typeof idOrIndex === "number" && Number.isInteger(idOrIndex)) {
        target = apertures[clamp(idOrIndex, 0, apertures.length - 1)];
      } else if (typeof idOrIndex === "string") {
        const trimmed = idOrIndex.trim();
        if (/^[0-5]$/.test(trimmed)) {
          target = apertures[Number(trimmed)];
        } else {
          target = apertures.find((a) => a.id === trimmed) || null;
        }
      }
      if (!target) return getState();
      if (!(target.id === selectedApertureId && epiphanyIntensity > 0)) {
        selectedApertureId = target.id;
        silentDwellSec = 0;
        epiphanyIntensity = 0;
      }
      return getState();
    }

    function dwellSilently(seconds = 1.6, dwellOpts = {}) {
      const sec = Math.max(0, Number.isFinite(seconds) ? seconds : 1.6);
      if (!CERTAIN_HOURS[hourIndex].isLiminalWindow) {
        if (dwellOpts && dwellOpts.autoSeekHour === true) {
          seekCertainHour();
        } else {
          epiphanyIntensity = 0;
          silentDwellSec = 0;
          return getState();
        }
      }
      const active = getActiveAperture();
      if (active.status === "lost_for_lack_of_words") {
        epiphanyIntensity = 0;
        silentDwellSec = 0;
        return getState();
      }
      const prevIntensity = epiphanyIntensity;
      silentDwellSec = round3(Math.min(8.0, silentDwellSec + sec));
      epiphanyIntensity = round3(Math.min(1.0, silentDwellSec / 2.0));
      active.peakLuminance = round3(Math.max(active.peakLuminance, epiphanyIntensity));
      if (epiphanyIntensity >= 0.65) {
        active.status = "witnessed_silently";
        recount();
        const shouldNotify = prevIntensity < 0.65 || !(dwellOpts && dwellOpts.fromTick);
        if (shouldNotify && typeof opts.onEpiphanyBloom === "function") {
          opts.onEpiphanyBloom(cloneAperture(active), getState());
        }
      }
      return getState();
    }

    function disturbWithPendingWords() {
      silentDwellSec = round3(silentDwellSec * 0.45);
      epiphanyIntensity = round3(epiphanyIntensity * 0.45);
      if (epiphanyIntensity < 0.004) {
        epiphanyIntensity = 0;
        silentDwellSec = 0;
      }
      return getState();
    }

    function overwriteGlimpseWithSpeech(imprisonmentRecord) {
      const proverbText =
        typeof imprisonmentRecord === "string"
          ? imprisonmentRecord
          : (imprisonmentRecord &&
              (imprisonmentRecord.canonicalOutput || imprisonmentRecord.ancientProverb)) ||
            "In Aglaura nothing said of the city is true, yet only spoken Aglaura endures.";
      const active = getActiveAperture();
      let target = active;
      if (active.status === "lost_for_lack_of_words") {
        target =
          apertures.find((a) => a.status === "witnessed_silently") ||
          apertures.find((a) => a.status === "unseen") ||
          active;
      }
      const previousStatus = target.status;
      const erasedLuminance = round3(Math.max(epiphanyIntensity, target.peakLuminance));
      selectedApertureId = target.id;
      epiphanyIntensity = 0;
      silentDwellSec = 0;
      erasureFlash = 1.0;
      target.status = "lost_for_lack_of_words";
      target.overwrittenByProverb = proverbText;
      recount();

      const event = {
        apertureId: target.id,
        apertureIndex: target.index,
        apertureName: target.name,
        previousStatus,
        status: target.status,
        erasedVisualMemory: target.epiphanyHintVisual,
        overwrittenByProverb: proverbText,
        erasedLuminance,
        silentWitnessedCount,
        lostRecollectionsCount,
        groundSubstance
      };
      if (typeof opts.onMemoryErasedBySpeech === "function") {
        opts.onMemoryErasedBySpeech(event, getState());
      }
      return event;
    }

    function tick(dtSec, inputState = {}) {
      const dt = clamp(Number.isFinite(dtSec) ? dtSec : 0.016, 0, 0.25);
      if (!reducedMotion) {
        ambientPhase = (ambientPhase + dt) % 3600;
      }
      if (erasureFlash > 0) {
        erasureFlash = Math.max(0, round3(erasureFlash - dt * (reducedMotion ? 3.2 : 1.35)));
      }
      if (
        CERTAIN_HOURS[hourIndex].isLiminalWindow &&
        !inputState.isTyping &&
        !inputState.pointerMovingFast
      ) {
        dwellSilently(dt * 0.52, { fromTick: true });
      }
      return getState();
    }

    function hitTest(normX, normY, width, height) {
      if (!Number.isFinite(normX) || !Number.isFinite(normY)) return null;
      const nx = width && width > 1 && normX > 1 ? normX / width : normX;
      const ny = height && height > 1 && normY > 1 ? normY / height : normY;
      let best = null;
      let bestDist = 0.145;
      for (let i = 0; i < apertures.length; i++) {
        const ap = apertures[i];
        const d = Math.hypot(nx - ap.coords.nx, (ny - ap.coords.ny) * 0.82);
        if (d <= bestDist) {
          bestDist = d;
          best = ap;
        }
      }
      return best ? cloneAperture(best) : null;
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      if (reducedMotion && erasureFlash > 0.35) erasureFlash = 0.35;
      return reducedMotion;
    }

    function reset() {
      hourIndex = 1;
      selectedApertureId = "aperture_chalk_alley";
      silentDwellSec = 0;
      epiphanyIntensity = 0;
      silentWitnessedCount = 0;
      lostRecollectionsCount = 0;
      groundSubstance = 0.24;
      erasureFlash = 0;
      apertures = makeInitialApertures();
      return getState();
    }

    function renderGround(ctx, width, height, viewOpts = {}) {
      paintGroundScene(
        ctx,
        width,
        height,
        {
          currentHour: CERTAIN_HOURS[hourIndex],
          selectedApertureId,
          apertures,
          epiphanyIntensity,
          erasureFlash,
          reducedMotion,
          ambientPhase
        },
        viewOpts
      );
    }

    return {
      setHour,
      seekCertainHour,
      selectAperture,
      dwellSilently,
      disturbWithPendingWords,
      overwriteGlimpseWithSpeech,
      tick,
      renderGround,
      render: renderGround,
      hitTest,
      setReducedMotion,
      reset,
      getState
    };
  }

  function drawEpiphanyVista(ctx, cx, cy, pw, ph, apIndex, intensity, phase, reducedMotion) {
    const x0 = cx - pw * 0.5;
    const y0 = cy - ph * 0.5;
    const sway = reducedMotion ? 0 : Math.sin(phase * 1.4) * 0.04;
    ctx.save();
    ctx.beginPath();
    ctx.rect(x0, y0, pw, ph);
    ctx.clip();

    const bg = ctx.createLinearGradient(cx, y0, cx, y0 + ph);
    bg.addColorStop(0, rgba(PALETTE.epiphanyFlare, 0.35 + intensity * 0.55));
    bg.addColorStop(0.55, rgba(PALETTE.epiphanyGold, 0.3 + intensity * 0.52));
    bg.addColorStop(1, rgba(PALETTE.gallStone, 0.88));
    ctx.fillStyle = bg;
    ctx.fillRect(x0, y0, pw, ph);

    ctx.strokeStyle = rgba(PALETTE.epiphanyFlare, 0.55 + intensity * 0.42);
    ctx.fillStyle = rgba(PALETTE.epiphanyFlare, 0.48 + intensity * 0.45);
    ctx.lineWidth = Math.max(1, pw * 0.022);

    if (apIndex === 0) {
      ctx.fillStyle = rgba(PALETTE.gallStone, 0.78);
      ctx.fillRect(x0, y0, pw * 0.26, ph);
      ctx.fillRect(x0 + pw * 0.74, y0, pw * 0.26, ph);
      ctx.fillStyle = rgba(PALETTE.epiphanyFlare, 0.32 + intensity * 0.55);
      ctx.beginPath();
      ctx.moveTo(cx - pw * 0.14, y0);
      ctx.lineTo(cx + pw * 0.18, y0);
      ctx.lineTo(cx + pw * 0.26, y0 + ph);
      ctx.lineTo(cx - pw * 0.24, y0 + ph);
      ctx.closePath();
      ctx.fill();
      const rot = reducedMotion ? 0.4 : phase * 0.75;
      ctx.beginPath();
      ctx.arc(cx, cy - ph * 0.05, pw * 0.2, 0, Math.PI * 2);
      ctx.stroke();
      for (let m = 0; m < 5; m++) {
        const a = rot + m * 1.256;
        ctx.fillRect(cx + Math.cos(a) * pw * 0.16 - 1.5, cy + Math.sin(a) * ph * 0.16 - 1.5, 3, 3);
      }
    } else if (apIndex === 1) {
      const wy = cy + ph * 0.04;
      for (let s = -1; s <= 1; s += 2) {
        for (let k = 0; k < 2; k++) {
          const ax = cx + (k === 0 ? -pw * 0.2 : pw * 0.2);
          ctx.beginPath();
          ctx.arc(ax, wy, pw * 0.16, s < 0 ? Math.PI : 0, s < 0 ? 0 : Math.PI);
          ctx.stroke();
        }
      }
      ctx.strokeStyle = rgba(PALETTE.parchmentChalk, 0.75 * intensity);
      ctx.beginPath();
      ctx.moveTo(x0 + 4, wy);
      ctx.lineTo(x0 + pw - 4, wy);
      ctx.stroke();
    } else if (apIndex === 2) {
      ctx.fillStyle = rgba(PALETTE.gallStone, 0.76);
      ctx.beginPath();
      ctx.moveTo(x0, y0 + ph);
      ctx.lineTo(x0, y0 + ph * 0.18);
      ctx.lineTo(cx - pw * 0.08, y0 + ph);
      ctx.fill();
      ctx.fillStyle = rgba(PALETTE.epiphanyFlare, 0.5 + intensity * 0.45);
      for (let st = 0; st < 6; st++) {
        const sx = x0 + pw * (0.2 + st * 0.1);
        const sy = y0 + ph * (0.82 - st * 0.11);
        ctx.fillRect(sx, sy, pw * 0.24, Math.max(2, ph * 0.035));
      }
    } else if (apIndex === 3) {
      ctx.fillStyle = rgba(PALETTE.parchmentChalk, 0.42 + intensity * 0.45);
      ctx.fillRect(cx - pw * 0.26, cy - ph * 0.22, pw * (0.28 + sway), ph * 0.46);
      ctx.strokeStyle = rgba(PALETTE.epiphanyGold, 0.85);
      ctx.beginPath();
      ctx.moveTo(x0 + pw, cy - ph * 0.28);
      ctx.quadraticCurveTo(cx + pw * 0.05, cy - ph * 0.12, cx + pw * 0.02, cy + ph * 0.08);
      ctx.stroke();
      ctx.fillStyle = rgba(PALETTE.rubricOxide, 0.55 + intensity * 0.4);
      ctx.beginPath();
      ctx.arc(cx + pw * 0.05, cy + ph * 0.1, Math.max(3, pw * 0.075), 0, Math.PI * 2);
      ctx.fill();
    } else if (apIndex === 4) {
      for (let r = 0; r < 5; r++) {
        ctx.fillStyle = rgba(PALETTE.parchmentChalk, (0.35 + r * 0.1) * intensity);
        ctx.fillRect(x0 + pw * (0.14 + r * 0.08), y0 + ph * (0.78 - r * 0.1), pw * 0.44, ph * 0.06);
      }
      ctx.fillStyle = rgba(PALETTE.epiphanyFlare, 0.28 * intensity);
      ctx.beginPath();
      ctx.moveTo(x0 + pw, y0);
      ctx.lineTo(x0 + pw * 0.12, y0 + ph);
      ctx.lineTo(x0 + pw * 0.52, y0 + ph);
      ctx.closePath();
      ctx.fill();
    } else {
      for (let d = 0; d < 3; d++) {
        const dx = cx + (d - 1) * pw * 0.25;
        const dy = cy + ph * (0.12 - (d === 1 ? 0.08 : 0));
        const rad = pw * (d === 1 ? 0.16 : 0.11);
        ctx.beginPath();
        ctx.arc(dx, dy, rad, Math.PI, 0);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(dx, dy - rad);
        ctx.lineTo(dx, dy - rad - ph * 0.12);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function paintGroundScene(ctx, width, height, snap, viewOpts = {}) {
    if (!ctx || !(width > 0) || !(height > 0)) return;
    const hour = (snap && snap.currentHour) || CERTAIN_HOURS[1];
    const apertures = (snap && snap.apertures) || makeInitialApertures();
    const selectedId = (snap && snap.selectedApertureId) || apertures[0].id;
    const intensity = clamp((snap && snap.epiphanyIntensity) || 0, 0, 1);
    const flash = clamp((snap && snap.erasureFlash) || 0, 0, 1);
    const reduced = Boolean((snap && snap.reducedMotion) || viewOpts.reducedMotion);
    const phase = (snap && snap.ambientPhase) || 0;

    ctx.save();
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, hour.isLiminalWindow ? PALETTE.gallStone : PALETTE.colorlessFog);
    sky.addColorStop(0.58, hour.isLiminalWindow ? "#5f584e" : PALETTE.chalkPlaster);
    sky.addColorStop(1, PALETTE.gallStone);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < RANDOM_SHEDS.length; i++) {
      const sh = RANDOM_SHEDS[i];
      const sx = sh.nx * width;
      const sw = sh.nw * width;
      const sy = (sh.baseY - sh.nh) * height;
      const shH = sh.nh * height;
      ctx.fillStyle = sh.shade;
      ctx.beginPath();
      ctx.moveTo(sx, sy + sh.roofSkew * height);
      ctx.lineTo(sx + sw, sy - sh.roofSkew * height);
      ctx.lineTo(sx + sw, sy + shH);
      ctx.lineTo(sx, sy + shH);
      ctx.closePath();
      ctx.fill();
      if (sh.hasPipe) {
        ctx.strokeStyle = PALETTE.gallStone;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + sw * sh.flueOffset, sy - 7);
        ctx.lineTo(sx + sw * sh.flueOffset, sy + shH * 0.75);
        ctx.stroke();
      }
    }

    ctx.fillStyle = rgba(PALETTE.colorlessFog, hour.fogDensity * (1 - intensity * 0.52));
    ctx.fillRect(0, 0, width, height);

    const activeAp = apertures.find((a) => a.id === selectedId) || apertures[0];
    if (intensity > 0 && activeAp.status !== "lost_for_lack_of_words") {
      const gx = activeAp.coords.nx * width;
      const gy = activeAp.coords.ny * height;
      const halo = ctx.createRadialGradient(gx, gy, 4, gx, gy, Math.max(width, height) * 0.42);
      halo.addColorStop(0, rgba(PALETTE.epiphanyFlare, 0.46 * intensity));
      halo.addColorStop(0.45, rgba(PALETTE.epiphanyGold, 0.22 * intensity));
      halo.addColorStop(1, rgba(PALETTE.epiphanyGold, 0));
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, width, height);
    }

    const pw = clamp(width * 0.108, 38, 96);
    const ph = clamp(height * 0.29, 54, 132);

    for (let i = 0; i < apertures.length; i++) {
      const ap = apertures[i];
      const cx = ap.coords.nx * width;
      const cy = ap.coords.ny * height;
      const x0 = cx - pw * 0.5;
      const y0 = cy - ph * 0.5;
      const isSel = ap.id === selectedId;

      ctx.fillStyle = PALETTE.chalkPlaster;
      ctx.fillRect(x0 - 3, y0 - 3, pw + 6, ph + 6);
      ctx.fillStyle = ap.status === "lost_for_lack_of_words" ? PALETTE.ironGallVoid : "#696b6c";
      ctx.fillRect(x0, y0, pw, ph);

      if (ap.status === "lost_for_lack_of_words") {
        ctx.fillStyle = PALETTE.rubricOxide;
        for (let b = 0; b < 3; b++) {
          ctx.fillRect(x0 + 2, y0 + ph * (0.2 + b * 0.26), pw - 4, Math.max(5, ph * 0.1));
        }
        ctx.strokeStyle = rgba(PALETTE.parchmentChalk, 0.55);
        ctx.beginPath();
        ctx.moveTo(x0 + 3, y0 + 3);
        ctx.lineTo(x0 + pw - 3, y0 + ph - 3);
        ctx.stroke();
      } else if (isSel && intensity > 0) {
        drawEpiphanyVista(ctx, cx, cy, pw, ph, ap.index, intensity, phase, reduced);
      } else {
        ctx.strokeStyle = rgba(PALETTE.gallStone, 0.5);
        ctx.beginPath();
        ctx.moveTo(x0 + pw * 0.2, y0 + ph * 0.35);
        ctx.lineTo(x0 + pw * 0.82, y0 + ph * 0.42);
        ctx.moveTo(x0 + pw * 0.48, y0 + 4);
        ctx.lineTo(x0 + pw * 0.44, y0 + ph - 4);
        ctx.stroke();
      }

      ctx.lineWidth = isSel ? 2.2 : 1.1;
      ctx.strokeStyle =
        ap.status === "lost_for_lack_of_words"
          ? PALETTE.rubricOxide
          : isSel && intensity > 0
            ? PALETTE.epiphanyFlare
            : ap.status === "witnessed_silently"
              ? PALETTE.epiphanyGold
              : PALETTE.gallStone;
      ctx.strokeRect(x0 - 2, y0 - 2, pw + 4, ph + 4);

      ctx.fillStyle = PALETTE.ironGallVoid;
      ctx.fillRect(cx - 10, y0 + ph + 4, 20, 14);
      ctx.fillStyle = isSel ? PALETTE.epiphanyFlare : PALETTE.parchmentChalk;
      ctx.font = "600 10px Georgia, serif";
      ctx.textAlign = "center";
      ctx.fillText(String(i + 1), cx, y0 + ph + 14);
    }

    if (flash > 0) {
      ctx.fillStyle = rgba(PALETTE.rubricOxide, flash * 0.36);
      ctx.fillRect(0, 0, width, height);
    }
    ctx.restore();
  }

  const AglauraGroundEpiphanies = Object.freeze({
    PALETTE,
    CERTAIN_HOURS,
    STREET_OPENINGS,
    createGroundEngine,
    renderGround(ctx, width, height, engineOrState, viewOpts = {}) {
      if (engineOrState && typeof engineOrState.renderGround === "function") {
        engineOrState.renderGround(ctx, width, height, viewOpts);
      } else {
        paintGroundScene(ctx, width, height, engineOrState || null, viewOpts);
      }
    }
  });

  root.AglauraGroundEpiphanies = AglauraGroundEpiphanies;
  if (typeof window !== "undefined") {
    window.AglauraGroundEpiphanies = AglauraGroundEpiphanies;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
