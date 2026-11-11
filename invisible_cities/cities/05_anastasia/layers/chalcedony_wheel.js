/**
 * City 05: ANASTASIA (Cities & Desire 2)
 * Layer: window.AnastasiaChalcedonyWheel
 *
 * Interactive water-driven copper lapidary arbor, brass dop-stick & 24-tooth index tang,
 * four multi-band optical chalcedony quartzes (agate, onyx, chrysoprase, chalcedony),
 * engraved Eight-Hour Shift Horologium (I–VIII), procedural singing-quartz & escapement
 * WebAudio synthesis, and the agency-to-servitude physics converter (`transformAgency`).
 *
 * Contract quick-reference for weaver integration:
 * - Can be used either as a factory (`const yoke = AnastasiaChalcedonyWheel.create(opts)`)
 *   or directly as a singleton (`AnastasiaChalcedonyWheel.update(dt, sharedState)`).
 * - `cutStroke(amount = 1, angleHint)`: `amount` defaults to 1 facet (= 1/3 hour; 24 facets = 8 hours).
 *   Fractional strokes (e.g. `0.2`) smoothly grind partial facets.
 * - `transformAgency(rawPointer, dt, reducedMotion)` computes and returns `capturedGaze`
 *   (`{ x, y, nx, ny, radialFreedom, orbitalLock, servitude, hoursWorked, facetsCut, cityRadianceBoost }`).
 * - `update(dt, sharedState)` also synchronizes `servitude`, `hoursWorked`, `facetsCut`,
 *   `cityRadianceBoost`, `activeStone`, `isGrinding`, and `capturedGaze` onto `sharedState`.
 */
(function (root) {
  'use strict';

  const TWO_PI = Math.PI * 2;
  const HALF_PI = Math.PI * 0.5;
  const TOTAL_HOURS = 8;
  const FACETS_PER_HOUR = 3;
  const TOTAL_FACETS = TOTAL_HOURS * FACETS_PER_HOUR; // 24
  const ROMAN_HOURS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const STONE_IDS = ['agate', 'onyx', 'chrysoprase', 'chalcedony'];

  const STONE_CATALOG = {
    agate: {
      id: 'agate',
      label: 'Fortification Agate',
      epithet: 'Carnelian, honey amber & milky quartz fortifications',
      aspectX: 1.0,
      aspectY: 1.0,
      outerMidScale: 0.94,
      midRadius: 0.56,
      midStarRadius: 0.65,
      tableRadius: 0.25,
      baseFreq: 293.66, // D4 warm amber resonance
      fifthFreq: 440.0,
      rayRgb: [236, 132, 62],
      accentHex: '#e67a38',
      slurryRgb: [232, 148, 86],
      rindFill: 'rgba(116, 62, 42, 0.72)',
      rindStroke: 'rgba(235, 184, 142, 0.34)',
      ridgeRgb: [255, 232, 198]
    },
    onyx: {
      id: 'onyx',
      label: 'Sardonyx & Black Onyx',
      epithet: 'Parallel jet-black & porcelain strata with razor speculars',
      aspectX: 1.04,
      aspectY: 0.94,
      outerMidScale: 0.92,
      midRadius: 0.58,
      midStarRadius: 0.63,
      tableRadius: 0.28,
      baseFreq: 277.18, // C#4 obsidian tension
      fifthFreq: 554.37,
      rayRgb: [228, 224, 218],
      accentHex: '#dfd9ce',
      slurryRgb: [215, 212, 208],
      rindFill: 'rgba(34, 36, 44, 0.78)',
      rindStroke: 'rgba(214, 210, 204, 0.32)',
      ridgeRgb: [255, 255, 255]
    },
    chrysoprase: {
      id: 'chrysoprase',
      label: 'Apple-Jade Chrysoprase',
      epithet: 'Luminous nickel-chalcedony subsurface emerald glow',
      aspectX: 1.03,
      aspectY: 0.97,
      outerMidScale: 0.985,
      midRadius: 0.55,
      midStarRadius: 0.66,
      tableRadius: 0.24,
      baseFreq: 349.23, // F4 luminous jade lydian
      fifthFreq: 523.25,
      rayRgb: [110, 232, 152],
      accentHex: '#63df90',
      slurryRgb: [130, 238, 168],
      rindFill: 'rgba(46, 86, 66, 0.68)',
      rindStroke: 'rgba(176, 242, 198, 0.34)',
      ridgeRgb: [224, 255, 234]
    },
    chalcedony: {
      id: 'chalcedony',
      label: 'Iris Blue Chalcedony',
      epithet: 'Opalescent periwinkle-violet iris translucency',
      aspectX: 1.0,
      aspectY: 1.0,
      outerMidScale: 0.995,
      midRadius: 0.54,
      midStarRadius: 0.67,
      tableRadius: 0.23,
      baseFreq: 392.0, // G4 ethereal iris harmonic
      fifthFreq: 587.33,
      rayRgb: [148, 174, 255],
      accentHex: '#92adff',
      slurryRgb: [168, 188, 255],
      rindFill: 'rgba(58, 66, 98, 0.68)',
      rindStroke: 'rgba(196, 210, 255, 0.35)',
      ridgeRgb: [232, 240, 255]
    }
  };

  // Modal crystal chime scale ratios (Venetian-oriental luminous modes)
  const CRYSTAL_MODAL_RATIOS = [1.0, 1.125, 1.25, 1.40625, 1.5, 1.6875, 1.875, 2.0];

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function normalizeAngleDelta(a) {
    let d = a % TWO_PI;
    if (d > Math.PI) d -= TWO_PI;
    if (d < -Math.PI) d += TWO_PI;
    return d;
  }

  function resolveStoneId(stoneInput) {
    if (typeof stoneInput === 'number' && Number.isFinite(stoneInput)) {
      const idx = Math.round(stoneInput);
      if (idx >= 1 && idx <= 4) return STONE_IDS[idx - 1];
      return STONE_IDS[((idx % 4) + 4) % 4];
    }
    if (typeof stoneInput === 'string') {
      const clean = stoneInput.trim().toLowerCase();
      if (STONE_CATALOG[clean]) return clean;
      for (let i = 0; i < STONE_IDS.length; i++) {
        if (clean.indexOf(STONE_IDS[i]) !== -1) return STONE_IDS[i];
      }
    }
    return null;
  }

  /**
   * Builds a 100% watertight 24-facet manifold mesh for a given stone profile:
   * - Facets 0..7:   8 Outer Pavilion / Girdle Bezel Facets
   * - Facets 8..15:  8 Middle Crown Kite Main Facets
   * - Facets 16..23: 8 Inner Star & Table Heart Facets
   */
  function buildStoneFacetBlueprint(spec) {
    const O = new Array(8);
    const OM = new Array(8);
    const M = new Array(8);
    const MS = new Array(8);
    const T = new Array(8);
    const C = { x: 0, y: 0 };

    for (let k = 0; k < 8; k++) {
      const th = (k / 8) * TWO_PI;
      const thHalf = ((k + 0.5) / 8) * TWO_PI;
      O[k] = {
        x: Math.cos(th) * spec.aspectX,
        y: Math.sin(th) * spec.aspectY
      };
      OM[k] = {
        x: Math.cos(thHalf) * spec.outerMidScale * spec.aspectX,
        y: Math.sin(thHalf) * spec.outerMidScale * spec.aspectY
      };
      M[k] = {
        x: Math.cos(th) * spec.midRadius * spec.aspectX,
        y: Math.sin(th) * spec.midRadius * spec.aspectY
      };
      MS[k] = {
        x: Math.cos(thHalf) * spec.midStarRadius * spec.aspectX,
        y: Math.sin(thHalf) * spec.midStarRadius * spec.aspectY
      };
      T[k] = {
        x: Math.cos(thHalf) * spec.tableRadius * spec.aspectX,
        y: Math.sin(thHalf) * spec.tableRadius * spec.aspectY
      };
    }

    const perimeter = [];
    for (let k = 0; k < 8; k++) {
      perimeter.push(O[k], OM[k]);
    }

    const facets = new Array(TOTAL_FACETS);

    function makeFacet(index, tier, poly, normalAngle, tilt) {
      let cx = 0;
      let cy = 0;
      for (let i = 0; i < poly.length; i++) {
        cx += poly[i].x;
        cy += poly[i].y;
      }
      cx /= poly.length;
      cy /= poly.length;
      const sinT = Math.sin(tilt);
      const cosT = Math.cos(tilt);
      return {
        index,
        tier,
        poly,
        cx,
        cy,
        normalAngle,
        nx: Math.cos(normalAngle) * sinT,
        ny: Math.sin(normalAngle) * sinT,
        nz: cosT
      };
    }

    // Tier 0: 8 Outer Pavilion / Girdle Bezels (facets 0..7)
    for (let k = 0; k < 8; k++) {
      const kn = (k + 1) % 8;
      const midAng = ((k + 0.5) / 8) * TWO_PI;
      facets[k] = makeFacet(
        k,
        0,
        [M[k], O[k], OM[k], O[kn], M[kn], MS[k]],
        midAng,
        0.64
      );
    }

    // Tier 1: 8 Middle Crown Main Kites (facets 8..15)
    for (let k = 0; k < 8; k++) {
      const kn = (k + 1) % 8;
      const midAng = ((k + 0.5) / 8) * TWO_PI;
      facets[8 + k] = makeFacet(
        8 + k,
        1,
        [T[k], M[k], MS[k], M[kn]],
        midAng,
        0.38
      );
    }

    // Tier 2: 8 Inner Star & Table Facets (facets 16..23)
    for (let k = 0; k < 8; k++) {
      const kp = (k + 7) % 8;
      const midAng = (k / 8) * TWO_PI;
      facets[16 + k] = makeFacet(
        16 + k,
        2,
        [C, T[kp], M[k], T[k]],
        midAng,
        0.16
      );
    }

    return { perimeter, facets };
  }

  const BLUEPRINTS = {
    agate: buildStoneFacetBlueprint(STONE_CATALOG.agate),
    onyx: buildStoneFacetBlueprint(STONE_CATALOG.onyx),
    chrysoprase: buildStoneFacetBlueprint(STONE_CATALOG.chrysoprase),
    chalcedony: buildStoneFacetBlueprint(STONE_CATALOG.chalcedony)
  };

  function createWheelInstance(initialOptions) {
    const opts = initialOptions || {};
    const initW = Number.isFinite(opts.width) && opts.width > 0 ? opts.width : 1280;
    const initH = Number.isFinite(opts.height) && opts.height > 0 ? opts.height : 800;

    // Fixed particle pool for wet diamond/carborundum mist sparks (zero GC churn)
    const MAX_MIST = 76;
    const mistPool = new Array(MAX_MIST);
    for (let i = 0; i < MAX_MIST; i++) {
      mistPool[i] = {
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 1,
        size: 1.5,
        kind: 0, // 0 = water-slurry mist, 1 = mineral spark
        r: 220,
        g: 235,
        b: 255
      };
    }

    // Cooling water droplet pool from swan-neck dripper
    const MAX_DROPS = 6;
    const waterDrops = new Array(MAX_DROPS);
    for (let i = 0; i < MAX_DROPS; i++) {
      waterDrops[i] = { active: false, prog: 0, speed: 1.4 };
    }

    const state = {
      time: 0,
      width: initW,
      height: initH,
      dpr: Number.isFinite(opts.dpr) && opts.dpr > 0 ? opts.dpr : 1,
      centerX: initW * 0.5,
      centerY: initH * 0.5,
      outerRadius: Math.min(initW, initH) * 0.46,
      wheelRadius: Math.min(initW, initH) * 0.16,

      activeStone: resolveStoneId(opts.activeStone) || 'agate',
      lastSyncedStone: resolveStoneId(opts.activeStone) || 'agate',
      hoursWorked: 0,
      servitude: 0,
      facetsCut: 0,
      facetPartial: 0,
      cityRadianceBoost: 0,
      radialFreedom: 1.0,
      orbitalLock: 0.0,
      stifledCatalogIndex: -1,
      reducedMotion: Boolean(opts.reducedMotion),

      // Mechanical rotation & cadence state
      wheelAngle: 0,
      wheelOmega: 1.35, // base water-wheel spindle rad/s
      spinDirection: 1,
      cadencePhase: 0,
      grindOrbitAngle: -Math.PI * 0.24,
      cadenceSteppedInFrame: false,
      dopPolishSweep: 0,
      escapementKick: 0,
      facetFlash: 0,
      hourFlash: 0,
      releaseFlash: 0,
      dripTimer: 0,

      // Grinding & pointer state
      isGrinding: false,
      pointerDownOnWheel: false,
      pointerHoverNearWheel: false,
      grindEnergy: 0,
      strokeMomentum: 0,
      lastPointerAngle: 0,
      lastPointerX: initW * 0.5,
      lastPointerY: initH * 0.5,
      hasLastPointer: false,

      freePointer: {
        x: initW * 0.5,
        y: initH * 0.5,
        nx: 0,
        ny: 0,
        vx: 0,
        vy: 0,
        active: false
      },
      capturedGaze: {
        x: initW * 0.5,
        y: initH * 0.5,
        nx: 0,
        ny: 0,
        radialFreedom: 1.0,
        orbitalLock: 0.0
      },
      lastStrainPx: 0,
      mistCursor: 0,

      stonesCutHistory: {
        agate: 0,
        onyx: 0,
        chrysoprase: 0,
        chalcedony: 0
      },

      // Pending procedural WebAudio triggers (capped so muted sessions never backlog)
      pendingFacetChimes: [],
      pendingHourBells: [],
      pendingStoneClick: false,
      pendingReleaseChord: false
    };

    // Per-AudioContext persistent nodes
    const audioGraphMap = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
    let fallbackAudioGraph = null;

    function syncDimensions(w, h, dpr, sharedState) {
      if (Number.isFinite(w) && w > 0) state.width = w;
      if (Number.isFinite(h) && h > 0) state.height = h;
      if (Number.isFinite(dpr) && dpr > 0) state.dpr = dpr;

      if (sharedState && typeof sharedState === 'object') {
        state.centerX = Number.isFinite(sharedState.centerX) ? sharedState.centerX : state.width * 0.5;
        state.centerY = Number.isFinite(sharedState.centerY) ? sharedState.centerY : state.height * 0.5;
        state.outerRadius = Number.isFinite(sharedState.outerRadius) && sharedState.outerRadius > 0
          ? sharedState.outerRadius
          : Math.min(state.width, state.height) * 0.46;
        state.wheelRadius = Number.isFinite(sharedState.wheelRadius) && sharedState.wheelRadius > 0
          ? sharedState.wheelRadius
          : Math.min(state.width, state.height) * 0.16;
      } else {
        state.centerX = state.width * 0.5;
        state.centerY = state.height * 0.5;
        state.outerRadius = Math.min(state.width, state.height) * 0.46;
        state.wheelRadius = Math.min(state.width, state.height) * 0.16;
      }
    }

    function recomputeDerivedState() {
      state.hoursWorked = clamp(state.hoursWorked, 0, TOTAL_HOURS);
      const s = clamp01(state.hoursWorked / TOTAL_HOURS);
      state.servitude = s;

      const exactFacets = s * TOTAL_FACETS;
      const cut = Math.min(TOTAL_FACETS, Math.floor(exactFacets + 1e-9));
      state.facetsCut = cut;
      state.facetPartial = cut >= TOTAL_FACETS ? 1 : clamp01(exactFacets - cut);

      // Treacherous Inversion Curves:
      // s = 0 -> radialFreedom = 1.0, orbitalLock = 0.0, cityRadianceBoost = 0.0
      // s = 1 -> radialFreedom = 0.06, orbitalLock = 1.0, cityRadianceBoost = 1.0
      if (s <= 0) {
        state.radialFreedom = 1.0;
        state.orbitalLock = 0.0;
        state.cityRadianceBoost = 0.0;
      } else if (s >= 1) {
        state.radialFreedom = 0.06;
        state.orbitalLock = 1.0;
        state.cityRadianceBoost = 1.0;
      } else {
        state.radialFreedom = 1.0 - 0.94 * (0.65 * s + 0.35 * s * s);
        state.orbitalLock = clamp01(s * (1.28 - 0.28 * s));
        state.cityRadianceBoost = clamp01(0.76 * Math.pow(s, 0.84) + 0.24 * (cut / TOTAL_FACETS));
      }
    }

    function queueFacetChime(facetNumber) {
      if (state.pendingFacetChimes.length >= 2) {
        state.pendingFacetChimes.shift();
      }
      state.pendingFacetChimes.push(facetNumber);
    }

    function queueHourBell(hourNumber) {
      if (state.pendingHourBells.length >= 2) {
        state.pendingHourBells.shift();
      }
      state.pendingHourBells.push(hourNumber);
    }

    function advanceShiftByHours(deltaHours, silentBulk) {
      if (!Number.isFinite(deltaHours) || deltaHours <= 0) return;
      if (state.hoursWorked >= TOTAL_HOURS) {
        // Still allow lively wheel spin & spark feedback at full 8-hour shift
        state.grindEnergy = clamp01(state.grindEnergy + 0.35);
        return;
      }

      const prevHours = state.hoursWorked;
      const prevFacets = state.facetsCut;
      const prevWholeHours = Math.min(TOTAL_HOURS, Math.floor(prevHours + 1e-9));

      state.hoursWorked = clamp(prevHours + deltaHours, 0, TOTAL_HOURS);
      recomputeDerivedState();

      const newFacets = state.facetsCut;
      const newWholeHours = Math.min(TOTAL_HOURS, Math.floor(state.hoursWorked + 1e-9));

      if (newFacets > prevFacets) {
        const gained = newFacets - prevFacets;
        state.stonesCutHistory[state.activeStone] =
          (state.stonesCutHistory[state.activeStone] || 0) + gained;
        state.escapementKick = 1.0;
        state.facetFlash = 1.0;
        if (silentBulk) {
          queueFacetChime(newFacets);
        } else {
          const startF = Math.max(prevFacets + 1, newFacets - 1);
          for (let f = startF; f <= newFacets; f++) {
            queueFacetChime(f);
          }
        }
      }

      if (newWholeHours > prevWholeHours) {
        state.hourFlash = 1.0;
        state.escapementKick = 1.25;
        queueHourBell(newWholeHours);
      }
    }

    function spawnMistParticles(count, contactX, contactY, tangentAngle) {
      if (state.reducedMotion) return;
      const spec = STONE_CATALOG[state.activeStone] || STONE_CATALOG.agate;
      const wheelR = state.wheelRadius;
      const baseSpeed = Math.max(28, wheelR * 0.72) * (0.65 + 0.65 * state.grindEnergy);

      for (let i = 0; i < count; i++) {
        const p = mistPool[state.mistCursor];
        state.mistCursor = (state.mistCursor + 1) % MAX_MIST;

        const spread = (Math.random() - 0.5) * 0.85;
        const ang = tangentAngle + spread;
        const spd = baseSpeed * (0.45 + Math.random() * 0.95);
        const isSpark = Math.random() < 0.42;

        p.active = true;
        p.x = contactX + (Math.random() - 0.5) * wheelR * 0.1;
        p.y = contactY + (Math.random() - 0.5) * wheelR * 0.1;
        p.vx = Math.cos(ang) * spd;
        p.vy = Math.sin(ang) * spd;
        p.maxLife = isSpark ? 0.28 + Math.random() * 0.26 : 0.42 + Math.random() * 0.36;
        p.life = p.maxLife;
        p.size = isSpark ? 1.1 + Math.random() * 1.6 : 1.8 + Math.random() * 2.6;
        p.kind = isSpark ? 1 : 0;
        if (isSpark) {
          p.r = spec.slurryRgb[0];
          p.g = spec.slurryRgb[1];
          p.b = spec.slurryRgb[2];
        } else {
          p.r = 212;
          p.g = 232;
          p.b = 244;
        }
      }
    }

    function stepCadenceClock(dt, reducedMotion) {
      const safeDt = clamp(Number.isFinite(dt) ? dt : 1 / 60, 0.0001, 0.1);
      if (reducedMotion) {
        state.cadencePhase = (state.cadencePhase + safeDt * 0.25) % TWO_PI;
        // Steady gentle locus around the grinding contact point without rapid spin
        const targetAngle = -Math.PI * 0.24 + (state.facetsCut / TOTAL_FACETS) * 0.45;
        state.grindOrbitAngle = targetAngle + Math.sin(state.cadencePhase) * 0.06;
      } else {
        const lock = state.orbitalLock;
        const cadenceRate = 1.65 + 2.35 * lock + (state.isGrinding ? 1.1 : 0);
        state.cadencePhase = (state.cadencePhase + safeDt * cadenceRate) % (TWO_PI * 12);
        // Hypnotic orbital grinding cadence around the copper lap's cutting track
        state.grindOrbitAngle =
          (state.grindOrbitAngle + safeDt * (1.25 + 2.65 * lock) * state.spinDirection) % TWO_PI;
      }
    }

    function computeNormalizedCoords(capX, capY, rawPointer) {
      const w = Math.max(1, state.width);
      const h = Math.max(1, state.height);
      const cx = state.centerX;
      const cy = state.centerY;
      const outerR = Math.max(1, state.outerRadius);

      if (rawPointer && Number.isFinite(rawPointer.nx) && Number.isFinite(rawPointer.ny)) {
        if (state.servitude <= 0) {
          return { nx: rawPointer.nx, ny: rawPointer.ny };
        }
        const rx = Number.isFinite(rawPointer.x) ? rawPointer.x : cx;
        const ry = Number.isFinite(rawPointer.y) ? rawPointer.y : cy;

        // Detect caller's normalization convention ([0,1] viewport vs [-1,1] half-size vs outerRadius)
        const err01 = Math.abs(rawPointer.nx - rx / w) + Math.abs(rawPointer.ny - ry / h);
        const errHalf =
          Math.abs(rawPointer.nx - (rx - cx) / (w * 0.5)) +
          Math.abs(rawPointer.ny - (ry - cy) / (h * 0.5));
        const errOuter =
          Math.abs(rawPointer.nx - (rx - cx) / outerR) +
          Math.abs(rawPointer.ny - (ry - cy) / outerR);

        if (err01 <= errHalf && err01 <= errOuter && err01 < 0.05) {
          return { nx: capX / w, ny: capY / h };
        }
        if (errHalf <= errOuter && errHalf < 0.05) {
          return { nx: (capX - cx) / (w * 0.5), ny: (capY - cy) / (h * 0.5) };
        }
        if (errOuter < 0.05) {
          return { nx: (capX - cx) / outerR, ny: (capY - cy) / outerR };
        }
      }

      return {
        nx: clamp((capX - cx) / outerR, -2, 2),
        ny: clamp((capY - cy) / outerR, -2, 2)
      };
    }

    // =========================================================================
    // PUBLIC API METHODS
    // =========================================================================

    function resize(width, height, dpr) {
      syncDimensions(width, height, dpr, null);
      recomputeDerivedState();
    }

    function setStone(stoneId) {
      const resolved = resolveStoneId(stoneId);
      if (!resolved) return state.activeStone;
      if (resolved !== state.activeStone) {
        state.activeStone = resolved;
        state.lastSyncedStone = resolved;
        state.pendingStoneClick = true;
        state.facetFlash = Math.max(state.facetFlash, 0.55);
      } else {
        state.lastSyncedStone = resolved;
      }
      return state.activeStone;
    }

    function cutStroke(amount, angleHint) {
      // Default `amount` = 1 facet (1/3 hour; 24 facets = 8 hours)
      const facetUnits = amount === undefined || amount === null
        ? 1.0
        : Math.abs(Number(amount) || 0);
      if (facetUnits <= 0) return getTelemetry();

      if (typeof amount === 'number' && amount < 0 && angleHint === undefined) {
        state.spinDirection = -1;
      } else if (Number.isFinite(angleHint)) {
        state.grindOrbitAngle = angleHint;
      }

      const deltaHours = facetUnits / FACETS_PER_HOUR;
      state.strokeMomentum = clamp(state.strokeMomentum + clamp(facetUnits * 0.65, 0.18, 1.4), 0, 2.2);
      state.grindEnergy = clamp01(state.grindEnergy + clamp(facetUnits * 0.55, 0.22, 1.0));
      state.isGrinding = true;

      advanceShiftByHours(deltaHours, facetUnits > 2.5);

      const contactAngle = -Math.PI * 0.24 + state.dopPolishSweep;
      const contactR = state.wheelRadius * 0.52;
      const contactX = state.centerX + Math.cos(contactAngle) * contactR;
      const contactY = state.centerY + Math.sin(contactAngle) * contactR;
      const tangentAngle = contactAngle + HALF_PI * state.spinDirection;
      spawnMistParticles(Math.min(14, Math.max(3, Math.round(facetUnits * 7))), contactX, contactY, tangentAngle);

      return getTelemetry();
    }

    function setHour(targetHour) {
      const numeric = Number(targetHour);
      if (!Number.isFinite(numeric)) return getTelemetry();
      const clamped = clamp(numeric, 0, TOTAL_HOURS);

      if (clamped <= 0) {
        return resetShift();
      }

      const prevHours = state.hoursWorked;
      const prevFacets = state.facetsCut;
      const prevWhole = Math.min(TOTAL_HOURS, Math.floor(prevHours + 1e-9));

      state.hoursWorked = clamped;
      recomputeDerivedState();

      if (state.facetsCut > prevFacets) {
        state.facetFlash = 0.9;
        state.escapementKick = 1.0;
        queueFacetChime(state.facetsCut);
      }
      const nowWhole = Math.min(TOTAL_HOURS, Math.floor(state.hoursWorked + 1e-9));
      if (nowWhole > prevWhole) {
        state.hourFlash = 1.0;
        queueHourBell(nowWhole);
      }
      return getTelemetry();
    }

    function resetShift() {
      const hadProgress = state.hoursWorked > 0.01;
      state.hoursWorked = 0;
      state.servitude = 0;
      state.facetsCut = 0;
      state.facetPartial = 0;
      state.cityRadianceBoost = 0;
      state.radialFreedom = 1.0;
      state.orbitalLock = 0.0;
      state.isGrinding = false;
      state.pointerDownOnWheel = false;
      state.grindEnergy = 0;
      state.strokeMomentum = 0;
      state.lastStrainPx = 0;
      if (hadProgress) {
        state.releaseFlash = 1.0;
        state.pendingReleaseChord = true;
      }

      // Immediately restore un-yoked free gaze
      state.capturedGaze = {
        x: state.freePointer.x,
        y: state.freePointer.y,
        nx: state.freePointer.nx,
        ny: state.freePointer.ny,
        radialFreedom: 1.0,
        orbitalLock: 0.0
      };

      return getTelemetry();
    }

    function handlePointer(type, x, y, eventMeta) {
      const kind = String(type || '').toLowerCase();
      const px = Number.isFinite(x) ? x : state.freePointer.x;
      const py = Number.isFinite(y) ? y : state.freePointer.y;
      const meta = eventMeta || {};

      const dx = px - state.centerX;
      const dy = py - state.centerY;
      const dist = Math.hypot(dx, dy);
      const angle = Math.atan2(dy, dx);
      const engageRadius = state.wheelRadius * 1.44;
      const nearWheel = dist <= engageRadius;

      state.pointerHoverNearWheel = nearWheel;
      state.freePointer.x = px;
      state.freePointer.y = py;
      state.freePointer.active = true;

      if (kind === 'down' || kind === 'pointerdown' || kind === 'mousedown' || kind === 'touchstart') {
        // Engage wheel if pressing near/on the arbor OR when heavily yoked (capturedGaze already on wheel)
        const capDist = Math.hypot(
          state.capturedGaze.x - state.centerX,
          state.capturedGaze.y - state.centerY
        );
        if (nearWheel || (state.servitude >= 0.45 && capDist <= engageRadius)) {
          state.pointerDownOnWheel = true;
          state.isGrinding = true;
          state.lastPointerAngle = angle;
          state.lastPointerX = px;
          state.lastPointerY = py;
          state.hasLastPointer = true;
          // Initial tactile bite on the copper lap
          cutStroke(0.18, angle);
          return true;
        }
        return false;
      }

      if (kind === 'move' || kind === 'pointermove' || kind === 'mousemove' || kind === 'touchmove') {
        const buttonsPressed = typeof meta.buttons === 'number' ? meta.buttons > 0 : state.pointerDownOnWheel;
        if (!buttonsPressed && meta.buttons === 0) {
          state.pointerDownOnWheel = false;
        }

        if (state.pointerDownOnWheel) {
          if (state.hasLastPointer) {
            const dAngle = normalizeAngleDelta(angle - state.lastPointerAngle);
            const moveDist = Math.hypot(px - state.lastPointerX, py - state.lastPointerY);
            if (Math.abs(dAngle) > 0.002) {
              state.spinDirection = dAngle >= 0 ? 1 : -1;
            }
            // Circular drag + tangential lapidary scrub converts motion into cut facets
            const angularFacets = Math.abs(dAngle) / (Math.PI * 0.46);
            const scrubFacets = moveDist / Math.max(48, state.wheelRadius * 1.75) * 0.35;
            const strokeAmount = clamp(angularFacets + scrubFacets, 0, 0.95);
            if (strokeAmount > 0.004) {
              cutStroke(strokeAmount, angle);
            }
          }
          state.lastPointerAngle = angle;
          state.lastPointerX = px;
          state.lastPointerY = py;
          state.hasLastPointer = true;
          return true;
        }
        return false;
      }

      if (
        kind === 'up' ||
        kind === 'pointerup' ||
        kind === 'mouseup' ||
        kind === 'touchend' ||
        kind === 'cancel' ||
        kind === 'pointercancel' ||
        kind === 'leave' ||
        kind === 'pointerleave'
      ) {
        state.pointerDownOnWheel = false;
        state.hasLastPointer = false;
        if (kind === 'leave' || kind === 'pointerleave') {
          state.pointerHoverNearWheel = false;
        }
        return false;
      }

      if (kind === 'wheel' || kind === 'mousewheel') {
        const dyWheel = Number.isFinite(meta.deltaY)
          ? meta.deltaY
          : Number.isFinite(meta.wheelDelta)
            ? -meta.wheelDelta
            : 0;
        const dxWheel = Number.isFinite(meta.deltaX) ? meta.deltaX : 0;
        const mag = Math.hypot(dxWheel, dyWheel);
        if (mag > 0.2) {
          state.spinDirection = (dyWheel || dxWheel) >= 0 ? 1 : -1;
          const wheelStroke = clamp(mag / 105, 0.08, 0.75);
          cutStroke(wheelStroke, nearWheel ? angle : undefined);
          return true;
        }
      }

      return false;
    }

    function transformAgency(rawPointer, dt, reducedMotion) {
      const rm = reducedMotion !== undefined ? Boolean(reducedMotion) : state.reducedMotion;
      state.reducedMotion = rm;

      if (!state.cadenceSteppedInFrame && Number.isFinite(dt) && dt > 0) {
        stepCadenceClock(dt, rm);
        state.cadenceSteppedInFrame = true;
      }

      recomputeDerivedState();

      const cx = state.centerX;
      const cy = state.centerY;
      const wheelR = state.wheelRadius;

      const rawX = rawPointer && Number.isFinite(rawPointer.x) ? rawPointer.x : cx;
      const rawY = rawPointer && Number.isFinite(rawPointer.y) ? rawPointer.y : cy;

      state.freePointer.x = rawX;
      state.freePointer.y = rawY;
      if (rawPointer && typeof rawPointer.active === 'boolean') {
        state.freePointer.active = rawPointer.active;
      }

      let capX = rawX;
      let capY = rawY;

      if (state.servitude > 0) {
        const dx = rawX - cx;
        const dy = rawY - cy;
        const rOrbit =
          wheelR * (0.68 + (rm ? 0 : 0.055 * Math.sin(state.cadencePhase * 3.0)));
        const grindX = cx + Math.cos(state.grindOrbitAngle) * rOrbit;
        const grindY = cy + Math.sin(state.grindOrbitAngle) * rOrbit;

        // Smooth C-infinity pull from center-free roaming (s=0) into rhythmic grinding orbit (s=1)
        const lock = state.orbitalLock;
        const anchorX = cx * (1 - lock) + grindX * lock;
        const anchorY = cy * (1 - lock) + grindY * lock;
        capX = anchorX + dx * state.radialFreedom;
        capY = anchorY + dy * state.radialFreedom;
      }

      const norm = computeNormalizedCoords(capX, capY, rawPointer);
      if (rawPointer && Number.isFinite(rawPointer.nx) && Number.isFinite(rawPointer.ny)) {
        state.freePointer.nx = rawPointer.nx;
        state.freePointer.ny = rawPointer.ny;
      } else {
        const rawNorm = computeNormalizedCoords(rawX, rawY, null);
        state.freePointer.nx = rawNorm.nx;
        state.freePointer.ny = rawNorm.ny;
      }

      state.lastStrainPx = Math.hypot(rawX - capX, rawY - capY);

      const captured = {
        x: capX,
        y: capY,
        nx: norm.nx,
        ny: norm.ny,
        radialFreedom: state.radialFreedom,
        orbitalLock: state.orbitalLock,
        servitude: state.servitude,
        hoursWorked: state.hoursWorked,
        facetsCut: state.facetsCut,
        cityRadianceBoost: state.cityRadianceBoost
      };

      state.capturedGaze = captured;
      return captured;
    }

    function update(dt, sharedState) {
      const safeDt = clamp(Number.isFinite(dt) ? dt : 1 / 60, 0.0001, 0.1);
      state.time += safeDt;

      if (sharedState && typeof sharedState === 'object') {
        syncDimensions(sharedState.width, sharedState.height, state.dpr, sharedState);
        if (typeof sharedState.reducedMotion === 'boolean') {
          state.reducedMotion = sharedState.reducedMotion;
        }
        if (Number.isFinite(sharedState.stifledCatalogIndex)) {
          state.stifledCatalogIndex = Math.trunc(sharedState.stifledCatalogIndex);
        }
        // Adopt direct external activeStone mutation if weaver altered sharedState.activeStone
        if (
          typeof sharedState.activeStone === 'string' &&
          sharedState.activeStone !== state.lastSyncedStone &&
          STONE_CATALOG[sharedState.activeStone]
        ) {
          setStone(sharedState.activeStone);
        }
      }

      if (!state.cadenceSteppedInFrame) {
        stepCadenceClock(safeDt, state.reducedMotion);
      }
      state.cadenceSteppedInFrame = false;

      // Continuous hold-grinding while pointer is held down on the wheel
      if (state.pointerDownOnWheel) {
        const holdFacetRate = 1.45; // facets per second while holding against spinning copper lap
        advanceShiftByHours((holdFacetRate * safeDt) / FACETS_PER_HOUR, false);
        state.grindEnergy = clamp01(state.grindEnergy + safeDt * 3.5);
        state.strokeMomentum = clamp(state.strokeMomentum + safeDt * 2.2, 0, 2.2);
      } else {
        state.strokeMomentum = Math.max(0, state.strokeMomentum - safeDt * 3.2);
        state.grindEnergy = Math.max(0, state.grindEnergy - safeDt * 2.6);
      }

      state.isGrinding = state.pointerDownOnWheel || state.strokeMomentum > 0.06;

      // Spin the water-driven copper lapidary disc
      const baseSpin = state.reducedMotion ? 0.28 : 1.35 + 1.65 * state.servitude;
      const grindBoost = state.reducedMotion ? 0.15 * state.grindEnergy : 5.4 * state.grindEnergy;
      state.wheelOmega = baseSpin + grindBoost;
      state.wheelAngle = (state.wheelAngle + state.wheelOmega * safeDt * state.spinDirection) % TWO_PI;

      // Subtle back-and-forth polishing sweep of the brass dop-stick across the lap track
      if (state.reducedMotion) {
        state.dopPolishSweep = 0;
      } else {
        const sweepAmp = state.isGrinding ? 0.085 : 0.025 + 0.035 * state.servitude;
        state.dopPolishSweep = Math.sin(state.time * (state.isGrinding ? 6.2 : 2.1)) * sweepAmp;
      }

      // Decay visual impulses
      state.escapementKick = Math.max(0, state.escapementKick - safeDt * 4.2);
      state.facetFlash = Math.max(0, state.facetFlash - safeDt * 2.8);
      state.hourFlash = Math.max(0, state.hourFlash - safeDt * 1.6);
      state.releaseFlash = Math.max(0, state.releaseFlash - safeDt * 1.8);

      // Continuous wet slurry mist while grinding
      if (state.isGrinding && !state.reducedMotion) {
        const contactAngle = -Math.PI * 0.24 + state.dopPolishSweep;
        const contactR = state.wheelRadius * 0.52;
        const contactX = state.centerX + Math.cos(contactAngle) * contactR;
        const contactY = state.centerY + Math.sin(contactAngle) * contactR;
        const tangentAngle = contactAngle + HALF_PI * state.spinDirection;
        if (Math.random() < clamp01(0.45 + state.grindEnergy * 0.55)) {
          spawnMistParticles(2, contactX, contactY, tangentAngle);
        }
      }

      // Update mist particles
      for (let i = 0; i < MAX_MIST; i++) {
        const p = mistPool[i];
        if (!p.active) continue;
        p.life -= safeDt;
        if (p.life <= 0) {
          p.active = false;
          continue;
        }
        p.x += p.vx * safeDt;
        p.y += p.vy * safeDt;
        p.vx *= 1 - safeDt * 2.4;
        p.vy *= 1 - safeDt * 2.4;
      }

      // Update cooling canal-water droplets from dripper nozzle
      if (!state.reducedMotion) {
        state.dripTimer += safeDt * (state.isGrinding ? 2.6 : 1.1);
        if (state.dripTimer >= 1.0) {
          state.dripTimer -= 1.0;
          for (let i = 0; i < MAX_DROPS; i++) {
            if (!waterDrops[i].active) {
              waterDrops[i].active = true;
              waterDrops[i].prog = 0;
              waterDrops[i].speed = 1.6 + Math.random() * 0.5;
              break;
            }
          }
        }
        for (let i = 0; i < MAX_DROPS; i++) {
          const d = waterDrops[i];
          if (!d.active) continue;
          d.prog += safeDt * d.speed;
          if (d.prog >= 1) d.active = false;
        }
      }

      // Synchronize agency & sharedState fields
      const rawPtr = sharedState && sharedState.freePointer ? sharedState.freePointer : state.freePointer;
      state.cadenceSteppedInFrame = true;
      const captured = transformAgency(rawPtr, 0, state.reducedMotion);
      state.cadenceSteppedInFrame = false;

      if (sharedState && typeof sharedState === 'object') {
        sharedState.servitude = state.servitude;
        sharedState.hoursWorked = state.hoursWorked;
        sharedState.facetsCut = state.facetsCut;
        sharedState.cityRadianceBoost = state.cityRadianceBoost;
        sharedState.activeStone = state.activeStone;
        sharedState.isGrinding = state.isGrinding;
        sharedState.capturedGaze = captured;
        state.lastSyncedStone = state.activeStone;
      }
    }

    // =========================================================================
    // RENDERING HELPERS
    // =========================================================================

    function renderMineralInterior(ctx, stoneId, rGem) {
      if (stoneId === 'agate') {
        // Warm translucent concentric fortification bands (carnelian, honey amber, milky quartz)
        const bandColors = [
          '#5e160d',
          '#b83318',
          '#df5826',
          '#f5efe2',
          '#e89c38',
          '#c9401d',
          '#f2ba52',
          '#fcf5e8'
        ];
        const bandRadii = [1.06, 0.92, 0.79, 0.68, 0.57, 0.44, 0.31, 0.18];

        for (let b = 0; b < bandColors.length; b++) {
          const br = rGem * bandRadii[b];
          ctx.beginPath();
          for (let v = 0; v < 16; v++) {
            const ang = (v / 16) * TWO_PI + 0.12;
            const fortMod = v % 2 === 0 ? 1.0 : 0.91 + 0.03 * Math.sin(v * 1.7 + b);
            const vx = Math.cos(ang) * br * fortMod;
            const vy = Math.sin(ang) * br * fortMod;
            if (v === 0) ctx.moveTo(vx, vy);
            else ctx.lineTo(vx, vy);
          }
          ctx.closePath();
          ctx.fillStyle = bandColors[b];
          ctx.fill();

          ctx.strokeStyle = b % 2 === 0 ? 'rgba(255, 238, 210, 0.38)' : 'rgba(92, 22, 10, 0.35)';
          ctx.lineWidth = Math.max(0.6, rGem * 0.018);
          ctx.stroke();
        }

        // Translucent warm amber subsurface glow
        const glow = ctx.createRadialGradient(-rGem * 0.18, -rGem * 0.2, rGem * 0.04, 0, 0, rGem);
        glow.addColorStop(0, 'rgba(255, 250, 232, 0.65)');
        glow.addColorStop(0.45, 'rgba(244, 152, 56, 0.26)');
        glow.addColorStop(1, 'rgba(72, 16, 8, 0.32)');
        ctx.fillStyle = glow;
        ctx.fillRect(-rGem * 1.2, -rGem * 1.2, rGem * 2.4, rGem * 2.4);
        return;
      }

      if (stoneId === 'onyx') {
        // Dramatic parallel jet-black & porcelain sardonyx strata
        ctx.save();
        ctx.rotate(-0.34);
        const span = rGem * 1.25;
        ctx.fillStyle = '#090b10';
        ctx.fillRect(-span, -span, span * 2, span * 2);

        const strata = [
          { y: -0.92, h: 0.13, color: '#eae5dc' },
          { y: -0.79, h: 0.05, color: '#9e3219' },
          { y: -0.46, h: 0.16, color: '#f5f2eb' },
          { y: -0.30, h: 0.04, color: '#b53f20' },
          { y: -0.04, h: 0.07, color: '#dcd6cb' },
          { y: 0.24, h: 0.18, color: '#f4f0e8' },
          { y: 0.42, h: 0.05, color: '#8f2912' },
          { y: 0.72, h: 0.11, color: '#e6e0d5' }
        ];
        for (let i = 0; i < strata.length; i++) {
          const st = strata[i];
          ctx.fillStyle = st.color;
          ctx.fillRect(-span, st.y * rGem, span * 2, st.h * rGem);
        }

        // Razor-sharp diagonal specular reflection plane across jet-black onyx
        const specShift = state.reducedMotion
          ? -0.12 * rGem
          : Math.sin(state.wheelAngle * 0.75) * rGem * 0.28;
        const razor = ctx.createLinearGradient(
          specShift - rGem * 0.28,
          -span,
          specShift + rGem * 0.28,
          span
        );
        razor.addColorStop(0, 'rgba(255, 255, 255, 0)');
        razor.addColorStop(0.46, 'rgba(255, 255, 255, 0.06)');
        razor.addColorStop(0.5, 'rgba(255, 255, 255, 0.52)');
        razor.addColorStop(0.54, 'rgba(255, 255, 255, 0.08)');
        razor.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = razor;
        ctx.fillRect(-span, -span, span * 2, span * 2);
        ctx.restore();
        return;
      }

      if (stoneId === 'chrysoprase') {
        // Luminous apple-jade translucent nickel-chalcedony glow
        const jadeGrad = ctx.createRadialGradient(
          -rGem * 0.2,
          -rGem * 0.22,
          rGem * 0.05,
          0,
          0,
          rGem * 1.08
        );
        jadeGrad.addColorStop(0, '#d8ffe2');
        jadeGrad.addColorStop(0.28, '#7cf0a2');
        jadeGrad.addColorStop(0.64, '#279e60');
        jadeGrad.addColorStop(1, '#0d472e');
        ctx.fillStyle = jadeGrad;
        ctx.fillRect(-rGem * 1.2, -rGem * 1.2, rGem * 2.4, rGem * 2.4);

        // Translucent cloudy nickel-silicate inclusions
        for (let c = 0; c < 5; c++) {
          const ca = c * 1.26 + 0.4;
          const cr = rGem * (0.28 + (c % 3) * 0.16);
          const gx = Math.cos(ca) * cr;
          const gy = Math.sin(ca) * cr;
          const cloud = ctx.createRadialGradient(gx, gy, 0, gx, gy, rGem * 0.36);
          cloud.addColorStop(0, 'rgba(202, 255, 216, 0.34)');
          cloud.addColorStop(1, 'rgba(18, 108, 66, 0)');
          ctx.fillStyle = cloud;
          ctx.beginPath();
          ctx.arc(gx, gy, rGem * 0.36, 0, TWO_PI);
          ctx.fill();
        }

        // Delicate warm golden-limonite matrix veins near girdle
        ctx.strokeStyle = 'rgba(216, 174, 88, 0.38)';
        ctx.lineWidth = Math.max(0.7, rGem * 0.022);
        ctx.beginPath();
        ctx.moveTo(-rGem * 0.88, rGem * 0.24);
        ctx.quadraticCurveTo(-rGem * 0.52, rGem * 0.38, -rGem * 0.34, rGem * 0.78);
        ctx.moveTo(rGem * 0.76, -rGem * 0.42);
        ctx.quadraticCurveTo(rGem * 0.48, -rGem * 0.26, rGem * 0.62, rGem * 0.12);
        ctx.stroke();
        return;
      }

      // Default / 'chalcedony': opalescent blue-violet iris translucency
      const irisBase = ctx.createRadialGradient(
        -rGem * 0.15,
        -rGem * 0.18,
        rGem * 0.04,
        0,
        0,
        rGem * 1.06
      );
      irisBase.addColorStop(0, '#eef4ff');
      irisBase.addColorStop(0.32, '#9cbaff');
      irisBase.addColorStop(0.68, '#7a68d6');
      irisBase.addColorStop(1, '#2a3366');
      ctx.fillStyle = irisBase;
      ctx.fillRect(-rGem * 1.2, -rGem * 1.2, rGem * 2.4, rGem * 2.4);

      // Opalescent concentric iris diffraction rings
      for (let ring = 1; ring <= 4; ring++) {
        ctx.beginPath();
        ctx.arc(0, 0, rGem * (ring * 0.21), 0, TWO_PI);
        ctx.strokeStyle =
          ring % 2 === 0
            ? 'rgba(156, 238, 255, 0.34)'
            : 'rgba(232, 178, 255, 0.32)';
        ctx.lineWidth = Math.max(1.0, rGem * 0.045);
        ctx.stroke();
      }

      // Spectral iris sheen lobe
      const irisAngle = state.reducedMotion ? 0.6 : state.wheelAngle * 0.45;
      const ix = Math.cos(irisAngle) * rGem * 0.28;
      const iy = Math.sin(irisAngle) * rGem * 0.28;
      const sheen = ctx.createRadialGradient(ix, iy, 0, ix, iy, rGem * 0.58);
      sheen.addColorStop(0, 'rgba(255, 224, 252, 0.48)');
      sheen.addColorStop(0.5, 'rgba(130, 228, 255, 0.24)');
      sheen.addColorStop(1, 'rgba(90, 108, 210, 0)');
      ctx.fillStyle = sheen;
      ctx.fillRect(-rGem * 1.2, -rGem * 1.2, rGem * 2.4, rGem * 2.4);
    }

    function renderSplendorRays(ctx, cx, cy, wheelR, outerR, spec) {
      if (state.facetsCut <= 0 && state.cityRadianceBoost <= 0.005) return;

      const stifleDim = state.stifledCatalogIndex >= 0 ? 0.52 : 1.0;
      const boost = state.cityRadianceBoost * stifleDim;
      if (boost <= 0.004) return;

      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      // Soft ambient crystalline halo expanding from the lapidary wheel into the canals
      const haloR = lerp(wheelR * 1.25, outerR * 0.96, state.cityRadianceBoost);
      const [rr, rg, rb] = spec.rayRgb;
      const halo = ctx.createRadialGradient(cx, cy, wheelR * 0.72, cx, cy, haloR);
      halo.addColorStop(0, `rgba(${rr}, ${rg}, ${rb}, ${(0.18 * boost).toFixed(3)})`);
      halo.addColorStop(0.45, `rgba(${rr}, ${rg}, ${rb}, ${(0.075 * boost).toFixed(3)})`);
      halo.addColorStop(1, `rgba(${rr}, ${rg}, ${rb}, 0)`);
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, haloR, 0, TWO_PI);
      ctx.fill();

      // Individual refractive prism rays for each completed facet (1..24)
      const raySpin = state.reducedMotion ? 0.12 : state.time * 0.08;
      const maxRayLen = lerp(wheelR * 1.4, outerR * 0.92, state.cityRadianceBoost);
      for (let f = 0; f < state.facetsCut; f++) {
        const baseA = (f / TOTAL_FACETS) * TWO_PI - HALF_PI + raySpin * (f % 2 === 0 ? 1 : -0.6);
        const halfSpread = 0.022 + (f % 3) * 0.008;
        const innerR = wheelR * 0.96;
        const len = maxRayLen * (0.76 + 0.24 * ((f * 7) % 5) / 4);
        const alpha = (0.022 + 0.036 * boost) * (f === state.facetsCut - 1 ? 1 + state.facetFlash * 0.9 : 1);

        const rGrad = ctx.createLinearGradient(
          cx + Math.cos(baseA) * innerR,
          cy + Math.sin(baseA) * innerR,
          cx + Math.cos(baseA) * len,
          cy + Math.sin(baseA) * len
        );
        rGrad.addColorStop(0, `rgba(${rr}, ${rg}, ${rb}, ${alpha.toFixed(3)})`);
        rGrad.addColorStop(1, `rgba(${rr}, ${rg}, ${rb}, 0)`);

        ctx.fillStyle = rGrad;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(baseA - halfSpread) * innerR, cy + Math.sin(baseA - halfSpread) * innerR);
        ctx.lineTo(cx + Math.cos(baseA - halfSpread * 1.8) * len, cy + Math.sin(baseA - halfSpread * 1.8) * len);
        ctx.lineTo(cx + Math.cos(baseA + halfSpread * 1.8) * len, cy + Math.sin(baseA + halfSpread * 1.8) * len);
        ctx.lineTo(cx + Math.cos(baseA + halfSpread) * innerR, cy + Math.sin(baseA + halfSpread) * innerR);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();
    }

    function renderHorologiumAndBasin(ctx, cx, cy, R, spec) {
      ctx.save();
      ctx.translate(cx, cy);

      // 1. Stone canal-well shadow & submerged bronze turbine paddles (water-driven wheel!)
      const wellShadow = ctx.createRadialGradient(0, 0, R * 0.85, 0, 0, R * 1.13);
      wellShadow.addColorStop(0, 'rgba(8, 10, 14, 0.82)');
      wellShadow.addColorStop(0.75, 'rgba(12, 18, 24, 0.52)');
      wellShadow.addColorStop(1, 'rgba(12, 18, 24, 0)');
      ctx.fillStyle = wellShadow;
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.13, 0, TWO_PI);
      ctx.fill();

      // 16 submerged water-turbine blades driven by Anastasia's concentric canals
      const paddleCount = 16;
      const turbineRot = -state.wheelAngle * 0.32;
      ctx.save();
      ctx.rotate(turbineRot);
      ctx.fillStyle = 'rgba(148, 108, 62, 0.46)';
      ctx.strokeStyle = 'rgba(222, 178, 110, 0.32)';
      ctx.lineWidth = Math.max(0.8, R * 0.01);
      for (let i = 0; i < paddleCount; i++) {
        const a = (i / paddleCount) * TWO_PI;
        ctx.save();
        ctx.rotate(a);
        ctx.beginPath();
        ctx.moveTo(R * 0.99, -R * 0.025);
        ctx.lineTo(R * 1.065, -R * 0.012);
        ctx.lineTo(R * 1.065, R * 0.03);
        ctx.lineTo(R * 0.99, R * 0.02);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      // 2. Engraved Eight-Hour Shift Horologium Ring (I–VIII)
      const outerRim = R * 1.01;
      const innerRim = R * 0.82;

      const bezelGrad = ctx.createRadialGradient(0, 0, innerRim, 0, 0, outerRim);
      bezelGrad.addColorStop(0, '#1d1612');
      bezelGrad.addColorStop(0.5, '#2b2018');
      bezelGrad.addColorStop(1, '#17110d');
      ctx.fillStyle = bezelGrad;
      ctx.beginPath();
      ctx.arc(0, 0, outerRim, 0, TWO_PI);
      ctx.arc(0, 0, innerRim, 0, TWO_PI, true);
      ctx.closePath();
      ctx.fill();

      // Continuous shift progress arc inside the Horologium track
      if (state.servitude > 0.001) {
        const startA = -HALF_PI;
        const endA = startA + state.servitude * TWO_PI;
        const [rr, rg, rb] = spec.rayRgb;
        ctx.beginPath();
        ctx.arc(0, 0, (innerRim + outerRim) * 0.5, startA, endA);
        ctx.strokeStyle = `rgba(${rr}, ${rg}, ${rb}, ${(0.28 + 0.25 * state.hourFlash).toFixed(3)})`;
        ctx.lineWidth = (outerRim - innerRim) * 0.86;
        ctx.stroke();
      }

      // Brass inner & outer bezel fillets
      ctx.strokeStyle = '#c89b54';
      ctx.lineWidth = Math.max(1.2, R * 0.016);
      ctx.beginPath();
      ctx.arc(0, 0, outerRim, 0, TWO_PI);
      ctx.stroke();

      ctx.strokeStyle = '#9e7334';
      ctx.lineWidth = Math.max(1.0, R * 0.014);
      ctx.beginPath();
      ctx.arc(0, 0, innerRim, 0, TWO_PI);
      ctx.stroke();

      // 24 Facet Escapement Teeth + 8 Hour Dividers & Roman Numerals (I..VIII)
      for (let t = 0; t < TOTAL_FACETS; t++) {
        const toothA = -HALF_PI + (t / TOTAL_FACETS) * TWO_PI;
        const isHourBoundary = t % FACETS_PER_HOUR === 0;
        const isCut = t < state.facetsCut;

        const r0 = innerRim;
        const r1 = isHourBoundary ? outerRim : innerRim + (outerRim - innerRim) * 0.32;
        ctx.beginPath();
        ctx.moveTo(Math.cos(toothA) * r0, Math.sin(toothA) * r0);
        ctx.lineTo(Math.cos(toothA) * r1, Math.sin(toothA) * r1);
        ctx.strokeStyle = isHourBoundary
          ? 'rgba(226, 184, 112, 0.78)'
          : isCut
            ? 'rgba(248, 218, 152, 0.72)'
            : 'rgba(142, 108, 66, 0.42)';
        ctx.lineWidth = isHourBoundary ? Math.max(1.1, R * 0.015) : Math.max(0.75, R * 0.01);
        ctx.stroke();

        // Facet jewel pip at midpoint of each 1/24th sector
        const pipA = toothA + (TWO_PI / TOTAL_FACETS) * 0.5;
        const pipR = innerRim + (outerRim - innerRim) * 0.2;
        ctx.beginPath();
        ctx.arc(Math.cos(pipA) * pipR, Math.sin(pipA) * pipR, Math.max(1.1, R * 0.015), 0, TWO_PI);
        if (isCut) {
          ctx.fillStyle = spec.accentHex;
          ctx.fill();
        } else if (t === state.facetsCut && state.servitude < 1) {
          ctx.fillStyle = `rgba(255, 224, 156, ${(0.35 + 0.6 * state.facetPartial).toFixed(2)})`;
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(110, 84, 52, 0.38)';
          ctx.fill();
        }
      }

      // Roman Numerals I..VIII centered in each of the 8 Hour sectors
      const fontPx = Math.max(8.5, R * 0.095);
      ctx.font = `600 ${fontPx.toFixed(1)}px Georgia, "Times New Roman", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const labelR = innerRim + (outerRim - innerRim) * 0.63;
      const completedWholeHours = Math.floor(state.hoursWorked + 1e-9);
      const activeHourIdx = Math.min(7, Math.floor(state.hoursWorked));

      for (let h = 0; h < TOTAL_HOURS; h++) {
        const midA = -HALF_PI + ((h + 0.5) / TOTAL_HOURS) * TWO_PI;
        const lx = Math.cos(midA) * labelR;
        const ly = Math.sin(midA) * labelR;

        ctx.save();
        ctx.translate(lx, ly);
        // Keep numerals upright on both top and bottom halves of the dial
        let textRot = midA + HALF_PI;
        if (Math.sin(midA) > 0.25) {
          textRot += Math.PI;
        }
        ctx.rotate(textRot);

        if (h < completedWholeHours) {
          ctx.fillStyle = '#ffe5a3';
        } else if (h === activeHourIdx && state.hoursWorked > 0) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = 'rgba(196, 158, 106, 0.68)';
        }
        ctx.fillText(ROMAN_HOURS[h], 0, 0);
        ctx.restore();
      }

      // 3. Top Brass Horological Escapement Anchor Pawl (at 12 o'clock)
      ctx.save();
      ctx.translate(0, -outerRim * 0.99);
      const pawlTilt = (state.reducedMotion ? 0 : Math.sin(state.wheelAngle * 3) * 0.04) + state.escapementKick * 0.18;
      ctx.rotate(pawlTilt);
      ctx.fillStyle = '#d8aa5e';
      ctx.strokeStyle = '#593b16';
      ctx.lineWidth = Math.max(0.9, R * 0.012);
      ctx.beginPath();
      ctx.moveTo(-R * 0.11, -R * 0.03);
      ctx.lineTo(R * 0.11, -R * 0.03);
      ctx.lineTo(R * 0.075, R * 0.065);
      ctx.lineTo(0, R * 0.025);
      ctx.lineTo(-R * 0.075, R * 0.065);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Ruby escapement pivot jewel
      ctx.beginPath();
      ctx.arc(0, -R * 0.005, Math.max(2.0, R * 0.026), 0, TWO_PI);
      ctx.fillStyle = state.escapementKick > 0.1 ? '#ff5964' : '#b82535';
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }

    function renderCopperLapDisc(ctx, cx, cy, R, spec) {
      const discR = R * 0.815;
      ctx.save();
      ctx.translate(cx, cy);

      // Base turned-copper lapidary plate
      const copperGrad = ctx.createRadialGradient(-discR * 0.18, -discR * 0.18, discR * 0.06, 0, 0, discR);
      copperGrad.addColorStop(0, '#d88254');
      copperGrad.addColorStop(0.38, '#9e4c2c');
      copperGrad.addColorStop(0.76, '#692d19');
      copperGrad.addColorStop(1, '#3b170c');
      ctx.fillStyle = copperGrad;
      ctx.beginPath();
      ctx.arc(0, 0, discR, 0, TWO_PI);
      ctx.fill();

      // Rotating anisotropic metallic copper specular lobes + diamond slurry tracks
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, discR, 0, TWO_PI);
      ctx.clip();
      ctx.rotate(state.wheelAngle);

      for (let lobe = 0; lobe < 2; lobe++) {
        ctx.save();
        ctx.rotate(lobe * Math.PI);
        const sheen = ctx.createLinearGradient(-discR, -discR * 0.35, discR, discR * 0.35);
        sheen.addColorStop(0, 'rgba(255, 196, 152, 0)');
        sheen.addColorStop(0.44, 'rgba(255, 198, 156, 0.04)');
        sheen.addColorStop(0.5, 'rgba(255, 226, 196, 0.24)');
        sheen.addColorStop(0.56, 'rgba(182, 224, 242, 0.08)');
        sheen.addColorStop(1, 'rgba(255, 196, 152, 0)');
        ctx.fillStyle = sheen;
        ctx.fillRect(-discR, -discR, discR * 2, discR * 2);
        ctx.restore();
      }

      // Radial lapidary dress-marks on the copper plate
      ctx.strokeStyle = 'rgba(255, 214, 184, 0.09)';
      ctx.lineWidth = Math.max(0.6, R * 0.008);
      for (let s = 0; s < 12; s++) {
        const sa = (s / 12) * TWO_PI;
        ctx.beginPath();
        ctx.moveTo(Math.cos(sa) * discR * 0.2, Math.sin(sa) * discR * 0.2);
        ctx.lineTo(Math.cos(sa) * discR * 0.96, Math.sin(sa) * discR * 0.96);
        ctx.stroke();
      }
      ctx.restore();

      // Concentric diamond/carborundum charging grooves & mineral-stained polishing track
      const [sr, sg, sb] = spec.slurryRgb;
      for (let g = 1; g <= 9; g++) {
        const gr = discR * (0.2 + g * 0.082);
        ctx.beginPath();
        ctx.arc(0, 0, gr, 0, TWO_PI);
        const inGrindZone = g >= 4 && g <= 8;
        ctx.strokeStyle = inGrindZone
          ? `rgba(${sr}, ${sg}, ${sb}, ${(0.12 + 0.22 * state.servitude + 0.18 * state.grindEnergy).toFixed(3)})`
          : 'rgba(244, 186, 142, 0.14)';
        ctx.lineWidth = inGrindZone ? Math.max(0.9, R * 0.013) : Math.max(0.6, R * 0.007);
        ctx.stroke();
      }

      // Swan-neck brass water-dripper spout (upper-left rim) cooling the copper wheel
      const spoutBaseX = -R * 0.78;
      const spoutBaseY = -R * 0.56;
      const tipX = -R * 0.44;
      const tipY = -R * 0.36;
      ctx.strokeStyle = '#c89b52';
      ctx.lineWidth = Math.max(1.8, R * 0.026);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(spoutBaseX, spoutBaseY);
      ctx.quadraticCurveTo(-R * 0.66, -R * 0.66, tipX, tipY);
      ctx.stroke();

      for (let i = 0; i < MAX_DROPS; i++) {
        const d = waterDrops[i];
        if (!d.active) continue;
        const dx = lerp(tipX, tipX + R * 0.08, d.prog);
        const dy = lerp(tipY, tipY + R * 0.16, d.prog * d.prog);
        ctx.beginPath();
        ctx.arc(dx, dy, Math.max(1.2, R * 0.018) * (1 - d.prog * 0.35), 0, TWO_PI);
        ctx.fillStyle = `rgba(186, 236, 255, ${(0.78 * (1 - d.prog)).toFixed(2)})`;
        ctx.fill();
      }

      // Central Brass Arbor Spindle & Drive-Belt Pulley
      const pulleyR = R * 0.15;
      const spindleGrad = ctx.createRadialGradient(-pulleyR * 0.25, -pulleyR * 0.25, 1, 0, 0, pulleyR);
      spindleGrad.addColorStop(0, '#fff0c2');
      spindleGrad.addColorStop(0.55, '#c99642');
      spindleGrad.addColorStop(1, '#5e3d14');
      ctx.fillStyle = spindleGrad;
      ctx.beginPath();
      ctx.arc(0, 0, pulleyR, 0, TWO_PI);
      ctx.fill();
      ctx.strokeStyle = '#3c240a';
      ctx.lineWidth = Math.max(1.0, R * 0.014);
      ctx.stroke();

      // Rotating keyway pin inside arbor nut
      ctx.save();
      ctx.rotate(state.wheelAngle);
      ctx.strokeStyle = 'rgba(62, 36, 12, 0.78)';
      ctx.lineWidth = Math.max(1.1, R * 0.016);
      ctx.beginPath();
      ctx.moveTo(-pulleyR * 0.58, 0);
      ctx.lineTo(pulleyR * 0.58, 0);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    }

    function renderDopAndChalcedonyGem(ctx, cx, cy, R, spec) {
      const blueprint = BLUEPRINTS[state.activeStone] || BLUEPRINTS.agate;
      const contactAngle = -Math.PI * 0.24 + state.dopPolishSweep;
      const gemDist = R * 0.36;
      const gemX = cx + Math.cos(contactAngle) * gemDist;
      const gemY = cy + Math.sin(contactAngle) * gemDist;
      const gemR = R * 0.335;

      // Brass Tang Post anchored on lower-right bench quadrant
      const postX = cx + R * 0.94;
      const postY = cy + R * 0.62;

      // Angled dop-collet shoulder on lower-right edge of the stone (leaves all 24 crown facets unobstructed!)
      const gripAngle = Math.atan2(postY - gemY, postX - gemX);
      const gripX = gemX + Math.cos(gripAngle) * (gemR * 0.92);
      const gripY = gemY + Math.sin(gripAngle) * (gemR * 0.92);

      // 1. Triboluminescent frictional contact arc on copper lap beneath active stone edge
      if (state.isGrinding || state.servitude > 0) {
        const glowStrength = clamp01(0.2 + state.grindEnergy * 0.8 + state.facetFlash * 0.5);
        const [sr, sg, sb] = spec.slurryRgb;
        const contactGlow = ctx.createRadialGradient(gemX, gemY, gemR * 0.3, gemX, gemY, gemR * 1.42);
        contactGlow.addColorStop(0, `rgba(255, 248, 232, ${(0.38 * glowStrength).toFixed(3)})`);
        contactGlow.addColorStop(0.55, `rgba(${sr}, ${sg}, ${sb}, ${(0.28 * glowStrength).toFixed(3)})`);
        contactGlow.addColorStop(1, `rgba(${sr}, ${sg}, ${sb}, 0)`);
        ctx.fillStyle = contactGlow;
        ctx.beginPath();
        ctx.arc(gemX, gemY, gemR * 1.42, 0, TWO_PI);
        ctx.fill();
      }

      // 2. Wet diamond/carborundum mist sparks (suppressed in reducedMotion)
      if (!state.reducedMotion) {
        for (let i = 0; i < MAX_MIST; i++) {
          const p = mistPool[i];
          if (!p.active) continue;
          const alpha = clamp01(p.life / p.maxLife) * (p.kind === 1 ? 0.92 : 0.55);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, TWO_PI);
          ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      // 3. The Four-Mineral 24-Facet Gemstone
      const dopIndexRot = (state.facetsCut / TOTAL_FACETS) * TWO_PI;
      ctx.save();
      ctx.translate(gemX, gemY);

      // Soft contact shadow onto the copper wheel
      ctx.fillStyle = 'rgba(14, 6, 4, 0.45)';
      ctx.beginPath();
      ctx.arc(R * 0.025, R * 0.032, gemR * 1.02, 0, TWO_PI);
      ctx.fill();

      ctx.rotate(dopIndexRot);

      // Build girdle silhouette path
      ctx.beginPath();
      const perim = blueprint.perimeter;
      for (let i = 0; i < perim.length; i++) {
        const px = perim[i].x * gemR;
        const py = perim[i].y * gemR;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();

      // Clip to gemstone girdle & render mineral optical strata
      ctx.save();
      ctx.clip();
      renderMineralInterior(ctx, state.activeStone, gemR);

      // Overhead Venetian sky + cherry-hearth fill light vector (in stone-local space)
      const lightWorldA = -Math.PI * 0.68 + (state.reducedMotion ? 0 : Math.sin(state.time * 0.7) * 0.18);
      const localLightA = lightWorldA - dopIndexRot;
      const lx = Math.cos(localLightA) * 0.58;
      const ly = Math.sin(localLightA) * 0.58;
      const lz = 0.814;

      const [rr, rg, rb] = spec.ridgeRgb;

      // Render all 24 Crown & Pavilion Facets
      for (let f = 0; f < TOTAL_FACETS; f++) {
        const facet = blueprint.facets[f];
        const poly = facet.poly;

        ctx.beginPath();
        for (let v = 0; v < poly.length; v++) {
          const vx = poly[v].x * gemR;
          const vy = poly[v].y * gemR;
          if (v === 0) ctx.moveTo(vx, vy);
          else ctx.lineTo(vx, vy);
        }
        ctx.closePath();

        if (f < state.facetsCut) {
          // Polished crystal facet: crisp optical Fresnel speculars & clear window into strata
          const ndotl = clamp01(facet.nx * lx + facet.ny * ly + facet.nz * lz);
          const specPow = Math.pow(ndotl, state.activeStone === 'onyx' ? 14 : 8);
          const flash = f === state.facetsCut - 1 ? state.facetFlash * 0.45 : 0;
          const specAlpha = clamp01(specPow * (0.46 + 0.24 * state.cityRadianceBoost) + flash);

          if (specAlpha > 0.015) {
            ctx.fillStyle = `rgba(255, 255, 255, ${specAlpha.toFixed(3)})`;
            ctx.fill();
          } else if (ndotl < 0.42) {
            ctx.fillStyle = `rgba(8, 12, 22, ${((0.42 - ndotl) * 0.28).toFixed(3)})`;
            ctx.fill();
          }

          ctx.strokeStyle = `rgba(${rr}, ${rg}, ${rb}, ${(0.48 + 0.32 * specPow).toFixed(3)})`;
          ctx.lineWidth = Math.max(0.65, gemR * 0.024);
          ctx.stroke();
        } else if (f === state.facetsCut && state.facetsCut < TOTAL_FACETS) {
          // Active facet currently pressed against carborundum/copper lap
          const prog = state.facetPartial;
          ctx.fillStyle = spec.rindFill;
          ctx.globalAlpha = 1 - prog * 0.82;
          ctx.fill();
          ctx.globalAlpha = 1;

          // Active grinding bevel highlight
          ctx.strokeStyle = `rgba(255, 236, 178, ${(0.55 + 0.4 * state.grindEnergy).toFixed(2)})`;
          ctx.lineWidth = Math.max(1.0, gemR * 0.036);
          ctx.stroke();
        } else {
          // Uncut waxy/frosted mineral cortex
          ctx.fillStyle = spec.rindFill;
          ctx.fill();
          ctx.strokeStyle = spec.rindStroke;
          ctx.lineWidth = Math.max(0.5, gemR * 0.018);
          ctx.stroke();
        }
      }
      ctx.restore();

      // Crisp outer girdle bevel outline
      ctx.beginPath();
      for (let i = 0; i < perim.length; i++) {
        const px = perim[i].x * gemR;
        const py = perim[i].y * gemR;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = state.facetsCut >= 8 ? spec.accentHex : 'rgba(218, 186, 138, 0.55)';
      ctx.lineWidth = Math.max(1.1, gemR * 0.038);
      ctx.stroke();

      ctx.restore();

      // 4. Brass Dop-Stick, Shellac Cradle & 24-Tooth Index Tang
      ctx.save();

      // Brass quadrant post on arbor rim
      ctx.beginPath();
      ctx.arc(postX, postY, Math.max(4.5, R * 0.075), 0, TWO_PI);
      ctx.fillStyle = '#8b6126';
      ctx.fill();
      ctx.strokeStyle = '#e5ba72';
      ctx.lineWidth = Math.max(1.1, R * 0.016);
      ctx.stroke();

      // Turned brass dop-stick shaft from post to stone collet shoulder
      ctx.strokeStyle = '#472d0e';
      ctx.lineWidth = Math.max(3.6, R * 0.064);
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(postX, postY);
      ctx.lineTo(gripX, gripY);
      ctx.stroke();

      ctx.strokeStyle = '#d8a958';
      ctx.lineWidth = Math.max(2.2, R * 0.042);
      ctx.beginPath();
      ctx.moveTo(postX, postY);
      ctx.lineTo(gripX, gripY);
      ctx.stroke();

      // Warm garnet-brown dopping wax/collet jaw clasping the stone's girdle shoulder
      ctx.save();
      ctx.translate(gripX, gripY);
      ctx.rotate(gripAngle);
      ctx.fillStyle = '#5c2314';
      ctx.strokeStyle = '#e2b368';
      ctx.lineWidth = Math.max(0.9, R * 0.013);
      ctx.beginPath();
      ctx.arc(0, 0, Math.max(3.2, R * 0.055), -1.2, 1.2, true);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 24-Tooth Brass Index Wheel (Tang Gear) mounted midway on the dop-stick
      const gearX = lerp(gripX, postX, 0.56);
      const gearY = lerp(gripY, postY, 0.56);
      const gearR = Math.max(6.5, R * 0.115);

      ctx.save();
      ctx.translate(gearX, gearY);
      ctx.rotate(dopIndexRot);

      ctx.fillStyle = '#b9873a';
      ctx.strokeStyle = '#3b240b';
      ctx.lineWidth = Math.max(0.8, R * 0.011);
      ctx.beginPath();
      for (let t = 0; t < TOTAL_FACETS; t++) {
        const a0 = (t / TOTAL_FACETS) * TWO_PI;
        const a1 = ((t + 0.5) / TOTAL_FACETS) * TWO_PI;
        const rOuter = gearR * 1.14;
        const rInner = gearR * 0.88;
        if (t === 0) ctx.moveTo(Math.cos(a0) * rOuter, Math.sin(a0) * rOuter);
        else ctx.lineTo(Math.cos(a0) * rOuter, Math.sin(a0) * rOuter);
        ctx.lineTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Index reference scribe mark on the 24-index wheel
      ctx.strokeStyle = '#fff3c4';
      ctx.lineWidth = Math.max(1.0, R * 0.015);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(gearR * 0.85, 0);
      ctx.stroke();
      ctx.restore();

      // Spring-loaded index latch pin clicking into the 24-tooth wheel
      ctx.strokeStyle = '#ffe29e';
      ctx.lineWidth = Math.max(1.1, R * 0.016);
      ctx.beginPath();
      ctx.moveTo(postX, postY);
      ctx.lineTo(gearX + gearR * 0.72, gearY - gearR * 0.68);
      ctx.stroke();

      ctx.restore();
    }

    function renderDesireYokeFilaments(ctx, cx, cy, R, spec) {
      const rawX = state.freePointer.x;
      const rawY = state.freePointer.y;
      const capX = state.capturedGaze.x;
      const capY = state.capturedGaze.y;
      const pulleyR = R * 0.15;
      const [rr, rg, rb] = spec.rayRgb;

      ctx.save();

      // Dawn Release shatter ripple when resetShift() breaks the yoke
      if (state.releaseFlash > 0.01) {
        const relR = R * (0.6 + (1 - state.releaseFlash) * 2.4);
        ctx.beginPath();
        ctx.arc(cx, cy, relR, 0, TWO_PI);
        ctx.strokeStyle = `rgba(255, 240, 198, ${(state.releaseFlash * 0.65).toFixed(3)})`;
        ctx.lineWidth = Math.max(1.5, R * 0.025);
        ctx.stroke();
      }

      // Un-yoked Hour 0 state: delicate weightless breath ring at freePointer
      if (state.servitude <= 0.002) {
        if (state.freePointer.active) {
          ctx.beginPath();
          ctx.arc(rawX, rawY, Math.max(5, R * 0.065), 0, TWO_PI);
          ctx.strokeStyle = 'rgba(255, 236, 196, 0.42)';
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
        ctx.restore();
        return;
      }

      // Compute tangent wrap point onto central brass arbor drive pulley
      const dxP = capX - cx;
      const dyP = capY - cy;
      const distP = Math.max(pulleyR * 1.05, Math.hypot(dxP, dyP));
      const baseAng = Math.atan2(dyP, dxP);
      const tangOffset = Math.acos(clamp(pulleyR / distP, -1, 1)) * state.spinDirection;
      const wrapAng = baseAng + tangOffset;
      const wrapX = cx + Math.cos(wrapAng) * pulleyR;
      const wrapY = cy + Math.sin(wrapAng) * pulleyR;

      const strainDist = Math.hypot(rawX - capX, rawY - capY);
      const yokeAlpha = clamp01(0.22 + 0.68 * state.servitude);

      // Helical drive-belt wrap around the central spindle pulley
      ctx.beginPath();
      ctx.arc(cx, cy, pulleyR * 1.04, 0, TWO_PI);
      ctx.strokeStyle = `rgba(${rr}, ${rg}, ${rb}, ${(0.35 + 0.45 * state.orbitalLock).toFixed(3)})`;
      ctx.lineWidth = Math.max(1.2, R * 0.02);
      ctx.stroke();

      // 1. Ghost reticle at rawPointer (the living desire whose free form is being drained)
      if (strainDist > 3) {
        const ghostAlpha = clamp01((1 - state.servitude * 0.55) * 0.52);
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(rawX, rawY, Math.max(5, R * 0.07), 0, TWO_PI);
        ctx.strokeStyle = `rgba(255, 232, 196, ${ghostAlpha.toFixed(3)})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Taut translucent desire-yoke filaments bending freePointer -> capturedGaze -> spindle drive belt
      const strandCount = 3;
      const perpAngle = Math.atan2(capY - rawY, capX - rawX) + HALF_PI;

      for (let s = 0; s < strandCount; s++) {
        const offsetIdx = s - 1; // -1, 0, +1
        const vib = state.reducedMotion
          ? 0
          : Math.sin(state.time * (9 + s * 3.5) + s * 1.9) *
            Math.min(7, strainDist * 0.045) *
            (0.4 + 0.6 * state.orbitalLock);
        const spread = offsetIdx * Math.min(9, 2.5 + strainDist * 0.04) + vib;

        const midX = (rawX + capX) * 0.5 + Math.cos(perpAngle) * spread;
        const midY = (rawY + capY) * 0.5 + Math.sin(perpAngle) * spread;

        const beltCtrlX = lerp(capX, wrapX, 0.55) + Math.cos(wrapAng + HALF_PI * state.spinDirection) * R * (0.14 + 0.04 * offsetIdx);
        const beltCtrlY = lerp(capY, wrapY, 0.55) + Math.sin(wrapAng + HALF_PI * state.spinDirection) * R * (0.14 + 0.04 * offsetIdx);

        const grad = ctx.createLinearGradient(rawX, rawY, wrapX, wrapY);
        const aOuter = (yokeAlpha * (s === 1 ? 0.58 : 0.28)).toFixed(3);
        const aInner = (yokeAlpha * (s === 1 ? 0.88 : 0.44)).toFixed(3);
        grad.addColorStop(0, `rgba(255, 226, 178, ${aOuter})`);
        grad.addColorStop(0.65, `rgba(${rr}, ${rg}, ${rb}, ${aInner})`);
        grad.addColorStop(1, `rgba(236, 188, 108, ${aInner})`);

        ctx.beginPath();
        ctx.moveTo(rawX, rawY);
        ctx.quadraticCurveTo(midX, midY, capX, capY);
        ctx.quadraticCurveTo(beltCtrlX, beltCtrlY, wrapX, wrapY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s === 1 ? Math.max(1.3, R * 0.019) : Math.max(0.75, R * 0.011);
        ctx.stroke();
      }

      // 3. Desire-torque beads streaming along the taut filament into the wheel's spindle
      const beadCount = 4;
      for (let b = 0; b < beadCount; b++) {
        const tFlow = state.reducedMotion
          ? (b + 0.5) / beadCount
          : ((state.time * (0.55 + 0.85 * state.servitude) + b / beadCount) % 1);
        let bx;
        let by;
        if (tFlow < 0.65) {
          const u = tFlow / 0.65;
          bx = lerp(rawX, capX, u);
          by = lerp(rawY, capY, u);
        } else {
          const u = (tFlow - 0.65) / 0.35;
          bx = lerp(capX, wrapX, u);
          by = lerp(capY, wrapY, u);
        }
        ctx.beginPath();
        ctx.arc(bx, by, Math.max(1.4, R * 0.022), 0, TWO_PI);
        ctx.fillStyle = `rgba(255, 240, 200, ${(0.35 + 0.5 * state.servitude).toFixed(3)})`;
        ctx.fill();
      }

      // 4. Captive Gaze Escapement Collet at `capturedGaze`
      const colletR = lerp(Math.max(9, R * 0.12), Math.max(4.5, R * 0.062), state.orbitalLock);
      ctx.beginPath();
      ctx.arc(capX, capY, colletR, 0, TWO_PI);
      ctx.strokeStyle = `rgba(${rr}, ${rg}, ${rb}, ${(0.52 + 0.42 * state.orbitalLock).toFixed(3)})`;
      ctx.lineWidth = Math.max(1.2, R * 0.018);
      ctx.stroke();

      // 8 locking escapement ticks tightening around the captive gaze
      if (state.orbitalLock > 0.12) {
        const tickLen = colletR * 0.38 * state.orbitalLock;
        ctx.strokeStyle = `rgba(244, 204, 128, ${(0.75 * state.orbitalLock).toFixed(3)})`;
        ctx.lineWidth = 1.0;
        for (let k = 0; k < 8; k++) {
          const ka = (k / 8) * TWO_PI + (state.reducedMotion ? 0 : state.wheelAngle * 0.5);
          ctx.beginPath();
          ctx.moveTo(capX + Math.cos(ka) * (colletR - tickLen), capY + Math.sin(ka) * (colletR - tickLen));
          ctx.lineTo(capX + Math.cos(ka) * (colletR + tickLen * 0.5), capY + Math.sin(ka) * (colletR + tickLen * 0.5));
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    function render(ctx, sharedState) {
      if (!ctx || typeof ctx.save !== 'function') return;

      if (sharedState && typeof sharedState === 'object') {
        syncDimensions(sharedState.width, sharedState.height, state.dpr, sharedState);
        if (typeof sharedState.reducedMotion === 'boolean') {
          state.reducedMotion = sharedState.reducedMotion;
        }
      }

      const cx = state.centerX;
      const cy = state.centerY;
      const R = Math.max(24, state.wheelRadius);
      const outerR = Math.max(R * 1.5, state.outerRadius);
      const spec = STONE_CATALOG[state.activeStone] || STONE_CATALOG.agate;

      ctx.save();
      renderSplendorRays(ctx, cx, cy, R, outerR, spec);
      renderHorologiumAndBasin(ctx, cx, cy, R, spec);
      renderCopperLapDisc(ctx, cx, cy, R, spec);
      renderDopAndChalcedonyGem(ctx, cx, cy, R, spec);
      renderDesireYokeFilaments(ctx, cx, cy, R, spec);
      ctx.restore();
    }

    // =========================================================================
    // PROCEDURAL WEBAUDIO SYNTHESIS
    // =========================================================================

    function getOrCreateAudioGraph(audioCtx, masterGain) {
      if (audioGraphMap && audioGraphMap.has(audioCtx)) {
        const cached = audioGraphMap.get(audioCtx);
        if (cached.masterGain !== masterGain) {
          try {
            cached.bus.disconnect();
            cached.bus.connect(masterGain);
            cached.masterGain = masterGain;
          } catch (_) {
            // Ignore transient routing errors
          }
        }
        return cached;
      }
      if (!audioGraphMap && fallbackAudioGraph && fallbackAudioGraph.ctx === audioCtx) {
        return fallbackAudioGraph;
      }

      const bus = audioCtx.createGain();
      bus.gain.value = 1.0;
      bus.connect(masterGain);

      // Continuous 1.5s pink/velvet wet carborundum slurry noise loop
      const sampleRate = audioCtx.sampleRate || 44100;
      const len = Math.floor(sampleRate * 1.5);
      const noiseBuf = audioCtx.createBuffer(1, len, sampleRate);
      const data = noiseBuf.getChannelData(0);
      let b0 = 0;
      let b1 = 0;
      let b2 = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.997 * b0 + white * 0.029;
        b1 = 0.985 * b1 + white * 0.032;
        b2 = 0.950 * b2 + white * 0.048;
        data[i] = clamp((b0 + b1 + b2 + white * 0.018) * 0.55, -1, 1);
      }

      const noiseSrc = audioCtx.createBufferSource();
      noiseSrc.buffer = noiseBuf;
      noiseSrc.loop = true;

      const singFilterA = audioCtx.createBiquadFilter();
      singFilterA.type = 'bandpass';
      singFilterA.frequency.value = 587.33;
      singFilterA.Q.value = 18;

      const singFilterB = audioCtx.createBiquadFilter();
      singFilterB.type = 'bandpass';
      singFilterB.frequency.value = 880.0;
      singFilterB.Q.value = 24;

      const frictionGain = audioCtx.createGain();
      frictionGain.gain.value = 0.0001;

      noiseSrc.connect(singFilterA);
      noiseSrc.connect(singFilterB);
      singFilterA.connect(frictionGain);
      singFilterB.connect(frictionGain);
      frictionGain.connect(bus);

      // Singing quartz-on-copper harmonic oscillator
      const singOsc = audioCtx.createOscillator();
      singOsc.type = 'sine';
      singOsc.frequency.value = 293.66;

      const singOscGain = audioCtx.createGain();
      singOscGain.gain.value = 0.0001;
      singOsc.connect(singOscGain);
      singOscGain.connect(bus);

      noiseSrc.start();
      singOsc.start();

      const graph = {
        ctx: audioCtx,
        masterGain,
        bus,
        singFilterA,
        singFilterB,
        frictionGain,
        singOsc,
        singOscGain
      };

      if (audioGraphMap) {
        audioGraphMap.set(audioCtx, graph);
      } else {
        fallbackAudioGraph = graph;
      }
      return graph;
    }

    function triggerCrystalFacetChime(audioCtx, bus, now, facetNum, spec) {
      const idx = Math.max(0, facetNum - 1);
      const degree = CRYSTAL_MODAL_RATIOS[idx % CRYSTAL_MODAL_RATIOS.length];
      const octaveMul = 1 + Math.floor(idx / 8) * 0.5;
      const f0 = spec.baseFreq * 2 * degree * octaveMul;

      const partials = [
        { mul: 1.0, amp: 0.065, dur: 0.52 },
        { mul: 2.756, amp: 0.028, dur: 0.34 }
      ];

      for (let i = 0; i < partials.length; i++) {
        const p = partials[i];
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(clamp(f0 * p.mul, 180, 7200), now);

        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(p.amp, now + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, now + p.dur);

        osc.connect(g);
        g.connect(bus);
        osc.onended = function () {
          try {
            osc.disconnect();
            g.disconnect();
          } catch (_) {}
        };
        osc.start(now);
        osc.stop(now + p.dur + 0.02);
      }
    }

    function triggerBrassEscapementBell(audioCtx, bus, now, hourNum) {
      // 1. Crisp mechanical brass anchor ratchet click
      const clickOsc = audioCtx.createOscillator();
      const clickGain = audioCtx.createGain();
      clickOsc.type = 'triangle';
      clickOsc.frequency.setValueAtTime(1920, now);
      clickOsc.frequency.exponentialRampToValueAtTime(680, now + 0.022);
      clickGain.gain.setValueAtTime(0.055, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);
      clickOsc.connect(clickGain);
      clickGain.connect(bus);
      clickOsc.onended = function () {
        try {
          clickOsc.disconnect();
          clickGain.disconnect();
        } catch (_) {}
      };
      clickOsc.start(now);
      clickOsc.stop(now + 0.032);

      // 2. Resonant Venetian bronze horologium bell (+32ms after ratchet lock)
      const bellStart = now + 0.032;
      const bellBase = 220 * Math.pow(2, ((hourNum - 1) % 8) / 12);
      const bellPartials = [
        { mul: 0.5, amp: 0.032, dur: 1.35 },
        { mul: 1.0, amp: 0.072, dur: 1.25 },
        { mul: 1.504, amp: 0.038, dur: 0.85 },
        { mul: 2.41, amp: 0.02, dur: 0.55 }
      ];

      for (let i = 0; i < bellPartials.length; i++) {
        const bp = bellPartials[i];
        const osc = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(bellBase * bp.mul, bellStart);

        g.gain.setValueAtTime(0.0001, bellStart);
        g.gain.linearRampToValueAtTime(bp.amp, bellStart + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, bellStart + bp.dur);

        osc.connect(g);
        g.connect(bus);
        osc.onended = function () {
          try {
            osc.disconnect();
            g.disconnect();
          } catch (_) {}
        };
        osc.start(bellStart);
        osc.stop(bellStart + bp.dur + 0.03);
      }
    }

    function onAudioTick(audioCtx, masterGain, sharedState) {
      if (!audioCtx || !masterGain || audioCtx.state !== 'running') return;

      let graph;
      try {
        graph = getOrCreateAudioGraph(audioCtx, masterGain);
      } catch (_) {
        return;
      }

      const now = audioCtx.currentTime;
      const spec = STONE_CATALOG[state.activeStone] || STONE_CATALOG.agate;
      const grindActive = sharedState && typeof sharedState.isGrinding === 'boolean'
        ? sharedState.isGrinding
        : state.isGrinding;

      // Modulate continuous quartz-on-copper singing filter
      const pitchLift = 1 + 0.24 * state.servitude + 0.06 * state.grindEnergy;
      const fA = clamp(spec.baseFreq * 2 * pitchLift, 220, 4800);
      const fB = clamp(spec.fifthFreq * 2 * pitchLift, 330, 6400);

      graph.singFilterA.frequency.setTargetAtTime(fA, now, 0.06);
      graph.singFilterB.frequency.setTargetAtTime(fB, now, 0.06);
      graph.singOsc.frequency.setTargetAtTime(spec.baseFreq * pitchLift, now, 0.06);

      const targetFriction = grindActive
        ? 0.028 + 0.046 * state.grindEnergy
        : 0.0015 + 0.0045 * state.servitude;
      const targetSing = grindActive
        ? 0.012 + 0.022 * state.grindEnergy
        : 0.0004 + 0.0028 * state.servitude;

      graph.frictionGain.gain.setTargetAtTime(targetFriction, now, 0.05);
      graph.singOscGain.gain.setTargetAtTime(targetSing, now, 0.06);

      // Drain completed facet crystal chimes
      while (state.pendingFacetChimes.length > 0) {
        const fNum = state.pendingFacetChimes.shift();
        triggerCrystalFacetChime(audioCtx, graph.bus, now, fNum, spec);
      }

      // Drain completed Hour brass escapement bells
      while (state.pendingHourBells.length > 0) {
        const hNum = state.pendingHourBells.shift();
        triggerBrassEscapementBell(audioCtx, graph.bus, now, hNum);
      }

      // Subtle mineral blank swap click
      if (state.pendingStoneClick) {
        state.pendingStoneClick = false;
        triggerCrystalFacetChime(audioCtx, graph.bus, now, 1, spec);
      }

      // Dawn unshackling open chord on resetShift()
      if (state.pendingReleaseChord) {
        state.pendingReleaseChord = false;
        const notes = [293.66, 440.0, 587.33];
        for (let i = 0; i < notes.length; i++) {
          const osc = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(notes[i], now + i * 0.03);
          g.gain.setValueAtTime(0.0001, now + i * 0.03);
          g.gain.linearRampToValueAtTime(0.032, now + i * 0.03 + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.03 + 0.65);
          osc.connect(g);
          g.connect(graph.bus);
          osc.onended = function () {
            try {
              osc.disconnect();
              g.disconnect();
            } catch (_) {}
          };
          osc.start(now + i * 0.03);
          osc.stop(now + i * 0.03 + 0.68);
        }
      }
    }

    function getTelemetry() {
      const completedHours = Math.min(TOTAL_HOURS, Math.floor(state.hoursWorked + 1e-9));
      const spec = STONE_CATALOG[state.activeStone] || STONE_CATALOG.agate;
      return {
        activeStone: state.activeStone,
        activeStoneLabel: spec.label,
        activeStoneEpithet: spec.epithet,
        availableStones: STONE_IDS.slice(),
        hoursWorked: Number(state.hoursWorked.toFixed(4)),
        completedHours,
        currentHourRoman: completedHours > 0 ? ROMAN_HOURS[completedHours - 1] : '0',
        nextHourRoman: completedHours < TOTAL_HOURS ? ROMAN_HOURS[completedHours] : 'VIII',
        servitude: Number(state.servitude.toFixed(4)),
        facetsCut: state.facetsCut,
        totalFacets: TOTAL_FACETS,
        facetPartial: Number(state.facetPartial.toFixed(4)),
        cityRadianceBoost: Number(state.cityRadianceBoost.toFixed(4)),
        radialFreedom: Number(state.radialFreedom.toFixed(4)),
        orbitalLock: Number(state.orbitalLock.toFixed(4)),
        isGrinding: state.isGrinding,
        wheelRpm: Number(((state.wheelOmega * 60) / TWO_PI).toFixed(1)),
        indexTooth: state.facetsCut % TOTAL_FACETS,
        yokeStrainPx: Number(state.lastStrainPx.toFixed(2)),
        stonesCutHistory: {
          agate: state.stonesCutHistory.agate,
          onyx: state.stonesCutHistory.onyx,
          chrysoprase: state.stonesCutHistory.chrysoprase,
          chalcedony: state.stonesCutHistory.chalcedony
        },
        capturedGaze: {
          x: Number(state.capturedGaze.x.toFixed(2)),
          y: Number(state.capturedGaze.y.toFixed(2)),
          nx: Number(state.capturedGaze.nx.toFixed(4)),
          ny: Number(state.capturedGaze.ny.toFixed(4)),
          radialFreedom: Number(state.radialFreedom.toFixed(4)),
          orbitalLock: Number(state.orbitalLock.toFixed(4))
        }
      };
    }

    recomputeDerivedState();

    const instance = {
      STONES: STONE_IDS.slice(),
      ROMAN_HOURS: ROMAN_HOURS.slice(),
      STONE_CATALOG,
      resize,
      setStone,
      cutStroke,
      setHour,
      resetShift,
      handlePointer,
      transformAgency,
      update,
      render,
      onAudioTick,
      getTelemetry
    };
    instance.create = function (optsOverride) {
      return createAndActivate(optsOverride);
    };

    return instance;
  }

  let activeInstance = createWheelInstance();

  function createAndActivate(options) {
    activeInstance = createWheelInstance(options);
    return activeInstance;
  }

  const AnastasiaChalcedonyWheel = {
    STONES: STONE_IDS.slice(),
    ROMAN_HOURS: ROMAN_HOURS.slice(),
    STONE_CATALOG,
    create(options) {
      return createAndActivate(options);
    },
    resize(width, height, dpr) {
      return activeInstance.resize(width, height, dpr);
    },
    setStone(stoneId) {
      return activeInstance.setStone(stoneId);
    },
    cutStroke(amount, angleHint) {
      return activeInstance.cutStroke(amount, angleHint);
    },
    setHour(targetHour) {
      return activeInstance.setHour(targetHour);
    },
    resetShift() {
      return activeInstance.resetShift();
    },
    handlePointer(type, x, y, eventMeta) {
      return activeInstance.handlePointer(type, x, y, eventMeta);
    },
    transformAgency(rawPointer, dt, reducedMotion) {
      return activeInstance.transformAgency(rawPointer, dt, reducedMotion);
    },
    update(dt, sharedState) {
      return activeInstance.update(dt, sharedState);
    },
    render(ctx, sharedState) {
      return activeInstance.render(ctx, sharedState);
    },
    onAudioTick(audioCtx, masterGain, sharedState) {
      return activeInstance.onAudioTick(audioCtx, masterGain, sharedState);
    },
    getTelemetry() {
      return activeInstance.getTelemetry();
    }
  };

  root.AnastasiaChalcedonyWheel = AnastasiaChalcedonyWheel;
  if (typeof window !== 'undefined') {
    window.AnastasiaChalcedonyWheel = AnastasiaChalcedonyWheel;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnastasiaChalcedonyWheel;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this);
