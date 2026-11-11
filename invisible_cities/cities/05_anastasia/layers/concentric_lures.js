/**
 * City 05: ANASTASIA (Cities & Desire 2)
 * Layer: window.AnastasiaConcentricLures
 *
 * Renders Anastasia's sensory panorama around the central water-driven lapidary basin:
 *  0. Concentric canals (6 rings), arched stone bridges, radial bronze lock-gates,
 *     uncut canal-bed quartzes (agate, onyx, chrysoprase, chalcedony), and liquid
 *     interference ripples that sharpen from warm twilight waves into coldly dazzling
 *     faceted chalcedony mirrors as servitude & cityRadianceBoost approach 1.
 *  1. Wind-kite sky (11 aerodynamic swallowtail, octagonal, and cellular-diamond silk kites)
 *     on catenary wind-tethers that dip playfully toward free un-yoked visitors
 *     (servitude < 0.35) and soar into untouchable municipal splendor as servitude -> 1.
 *  2. Seasoned cherry-wood hearth where a glazed golden pheasant roasts on a turning spit,
 *     lofting crimson embers and fragrant green-gold sweet marjoram motes in thermal spirals.
 *  3. Sunken turquoise-amber mosaic garden pool framed by cypresses where bathing figures
 *     beckon the free stranger with expanding luminous invitation ripples (servitude < 0.4)
 *     before turning inward into untouchable self-enjoyment as servitude -> 1.
 *  4. Enacts the Stifle Law via stifledCatalogIndex: -1 awakens all desires simultaneously;
 *     0..3 isolates a single cataloged desire while dimming and stiffening the rest into ash.
 */
(function (global) {
  'use strict';

  const TAU = Math.PI * 2;
  const PI = Math.PI;

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smoothstep(e0, e1, x) {
    const t = clamp((x - e0) / (e1 - e0 || 1e-6), 0, 1);
    return t * t * (3 - 2 * t);
  }

  function angleDiff(a, b) {
    let d = (b - a) % TAU;
    if (d > PI) d -= TAU;
    if (d < -PI) d += TAU;
    return d;
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * Blends an RGB color toward muted slate-ash as domain vitality drops (Stifle Law).
   */
  function rgbaVital(r, g, b, alpha, vitality, radianceBoost) {
    const v = clamp(vitality, 0, 1);
    const boost = clamp(radianceBoost || 0, 0, 1) * v;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    const ashR = lum * 0.42 + 34;
    const ashG = lum * 0.43 + 36;
    const ashB = lum * 0.46 + 42;
    const satMix = smoothstep(0.08, 0.95, v);
    const rr = clamp(Math.round(lerp(ashR, r + boost * 22, satMix)), 0, 255);
    const gg = clamp(Math.round(lerp(ashG, g + boost * 18, satMix)), 0, 255);
    const bb = clamp(Math.round(lerp(ashB, b + boost * 20, satMix)), 0, 255);
    const aa = clamp(alpha * lerp(0.42, 1.0, satMix), 0, 1);
    return 'rgba(' + rr + ',' + gg + ',' + bb + ',' + aa.toFixed(3) + ')';
  }

  const KITE_PALETTES = {
    carnelian: {
      primary: [218, 76, 52],
      secondary: [246, 152, 98],
      trim: [255, 224, 168]
    },
    saffron: {
      primary: [232, 166, 38],
      secondary: [252, 222, 118],
      trim: [186, 68, 42]
    },
    chrysoprase: {
      primary: [44, 188, 134],
      secondary: [142, 238, 194],
      trim: [244, 214, 132]
    },
    lapis: {
      primary: [46, 104, 198],
      secondary: [120, 180, 246],
      trim: [244, 198, 108]
    }
  };

  const MINERAL_STONES = ['agate', 'onyx', 'chrysoprase', 'chalcedony'];

  const STONE_TINTS = {
    agate: { r: 226, g: 112, b: 68, accent: [248, 206, 154] },
    onyx: { r: 168, g: 184, b: 204, accent: [236, 242, 250] },
    chrysoprase: { r: 64, g: 214, b: 148, accent: [182, 252, 214] },
    chalcedony: { r: 138, g: 176, b: 238, accent: [216, 228, 255] }
  };

  function createLuresInstance(options) {
    const opts = options || {};
    const rng = mulberry32(opts.seed || 505091);

    // Fixed architectural azimuths carefully separated so zero features collide:
    // Hearth bastion in upper-left canal terrace; Garden Pool in lower-right terrace;
    // 4 radial hydraulic lock-gates at cardinal/intercardinal channels clear of both.
    const HEARTH_ANGLE = -2.36; // ~ -135 deg
    const POOL_ANGLE = 0.74;    // ~ +42 deg
    const LOCK_ANGLES = [-1.57, -0.82, 1.57, 2.32];

    const CANAL_COUNT = 6;

    // 9 arched Venetian-oriental bridges distributed across canal rings clear of locks, hearth & pool
    const bridges = [
      { ring: 0, angle: -0.25, widthFactor: 0.18, archTone: 0 },
      { ring: 1, angle: 0.22, widthFactor: 0.16, archTone: 1 },
      { ring: 1, angle: -1.92, widthFactor: 0.16, archTone: 0 },
      { ring: 2, angle: 1.18, widthFactor: 0.15, archTone: 1 },
      { ring: 2, angle: 2.82, widthFactor: 0.15, archTone: 0 },
      { ring: 3, angle: -0.44, widthFactor: 0.14, archTone: 1 },
      { ring: 3, angle: 1.92, widthFactor: 0.14, archTone: 0 },
      { ring: 4, angle: -1.20, widthFactor: 0.13, archTone: 1 },
      { ring: 5, angle: 0.12, widthFactor: 0.12, archTone: 0 }
    ];

    // 36 raw uncut mineral veins embedded along canal walls (9 per canonical stone)
    const mineralVeins = [];
    for (let i = 0; i < 36; i++) {
      const ring = i % CANAL_COUNT;
      const stone = MINERAL_STONES[i % 4];
      let angle = (i / 36) * TAU + (rng() - 0.5) * 0.11;
      // Nudge clear of hearth and pool alcoves on middle rings
      if (ring >= 2 && ring <= 4) {
        if (Math.abs(angleDiff(angle, HEARTH_ANGLE)) < 0.28) angle += 0.34;
        if (Math.abs(angleDiff(angle, POOL_ANGLE)) < 0.30) angle -= 0.36;
      }
      mineralVeins.push({
        ring: ring,
        stone: stone,
        angle: angle,
        edgeSide: i % 2 === 0 ? -1 : 1,
        sizeSeed: 0.72 + rng() * 0.58,
        phase: rng() * TAU,
        facets: 4 + Math.floor(rng() * 3)
      });
    }

    // Outer rooftop / colonnade blocks for subtle peripheral Venetian-oriental context
    const outerPavilions = [];
    for (let i = 0; i < 22; i++) {
      outerPavilions.push({
        angle: (i / 22) * TAU + (rng() - 0.5) * 0.12,
        radialDist: 1.04 + rng() * 0.26,
        span: 0.08 + rng() * 0.09,
        depth: 0.05 + rng() * 0.07,
        lantern: rng() > 0.38,
        phase: rng() * TAU
      });
    }

    // 11 aerodynamic silk/paper kites
    const kiteShapes = ['swallowtail', 'octagonal', 'cellular_diamond'];
    const kitePaletteKeys = ['carnelian', 'saffron', 'chrysoprase', 'lapis'];
    const kites = [];
    for (let i = 0; i < 11; i++) {
      const baseAngle = (i / 11) * TAU + (rng() - 0.5) * 0.18;
      const anchorRingFrac = 0.32 + (i % 4) * 0.21;
      kites.push({
        index: i,
        shape: kiteShapes[i % 3],
        paletteKey: kitePaletteKeys[i % 4],
        anchorAngle: baseAngle,
        anchorRingFrac: anchorRingFrac,
        orbitAngle: baseAngle + 0.14,
        orbitRadiusFrac: clamp(anchorRingFrac + 0.12, 0.28, 0.96),
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        heading: baseAngle + PI * 0.5,
        altitude: 0.42 + (i % 3) * 0.11,
        scaleSeed: 0.86 + rng() * 0.32,
        phase: rng() * TAU,
        orbitSpeed: (0.14 + rng() * 0.09) * (i % 2 === 0 ? 1 : -1),
        tailNodes: Array.from({ length: 7 }, () => ({ x: 0, y: 0 }))
      });
    }

    // Cherry-wood hearth particles: 15 crimson cherry-wood embers + 15 sweet marjoram herb motes
    const hearthParticles = [];
    for (let i = 0; i < 30; i++) {
      const isMarjoram = i >= 15;
      hearthParticles.push({
        kind: isMarjoram ? 'marjoram' : 'ember',
        progress: (i % 15) / 15,
        spiralRadius: 0.18 + rng() * 0.78,
        spiralDir: rng() > 0.5 ? 1 : -1,
        speed: (isMarjoram ? 0.24 : 0.34) + rng() * 0.16,
        phase: rng() * TAU,
        size: isMarjoram ? 2.4 + rng() * 1.6 : 1.5 + rng() * 1.6
      });
    }

    // Sunken garden pool cypresses & 3 graceful bathing figures
    const poolCypresses = [
      { angle: -2.55, dist: 1.12, scale: 1.05, phase: 0.4 },
      { angle: -1.78, dist: 1.15, scale: 0.92, phase: 1.7 },
      { angle: -0.95, dist: 1.10, scale: 0.98, phase: 3.1 },
      { angle: 1.85, dist: 1.14, scale: 1.02, phase: 4.3 },
      { angle: 2.68, dist: 1.11, scale: 0.88, phase: 5.5 }
    ];

    const bathers = [
      { baseAngle: -0.75, orbitR: 0.44, facing: 0, phase: 0.2, hairOrnament: 'saffron' },
      { baseAngle: 1.35, orbitR: 0.48, facing: 0, phase: 2.3, hairOrnament: 'chrysoprase' },
      { baseAngle: 3.25, orbitR: 0.40, facing: 0, phase: 4.4, hairOrnament: 'carnelian' }
    ];

    const invitationRipples = [];
    const canalRipples = [];

    const state = {
      width: 1280,
      height: 800,
      dpr: 1,
      time: 0,
      centerX: 640,
      centerY: 400,
      outerRadius: 368,
      wheelRadius: 128,
      servitude: 0,
      hoursWorked: 0,
      facetsCut: 0,
      cityRadianceBoost: 0,
      activeStone: 'chalcedony',
      stifledCatalogIndex: -1,
      isGrinding: false,
      reducedMotion: false,
      freePointer: { x: 640, y: 400, nx: 0, ny: 0, vx: 0, vy: 0, active: false },
      capturedGaze: { x: 640, y: 400, nx: 0, ny: 0, radialFreedom: 1, orbitalLock: 0 },
      // Smoothed vitality per desire domain: 0=canals, 1=kites, 2=pheasant_hearth, 3=garden_pool
      vitality: [1, 1, 1, 1],
      spitAngle: 0,
      rippleCooldown: 0,
      inviteCooldown: 0,
      initializedKites: false,
      lastPointerX: 640,
      lastPointerY: 400,
      // Telemetry readouts
      canalMirrorSharpness: 0,
      kiteAltitudeMean: 0.45,
      kitePointerAttraction: 1,
      batherInvitationStrength: 1,
      // WebAudio graph cache
      audio: null
    };

    function syncGeometryFromShared(sharedState) {
      if (!sharedState) return;
      if (typeof sharedState.width === 'number' && sharedState.width > 0) {
        state.width = sharedState.width;
      }
      if (typeof sharedState.height === 'number' && sharedState.height > 0) {
        state.height = sharedState.height;
      }
      const minDim = Math.min(state.width, state.height);
      state.centerX = typeof sharedState.centerX === 'number' ? sharedState.centerX : state.width * 0.5;
      state.centerY = typeof sharedState.centerY === 'number' ? sharedState.centerY : state.height * 0.5;
      state.outerRadius = typeof sharedState.outerRadius === 'number' && sharedState.outerRadius > 10
        ? sharedState.outerRadius
        : minDim * 0.46;
      state.wheelRadius = typeof sharedState.wheelRadius === 'number' && sharedState.wheelRadius > 6
        ? sharedState.wheelRadius
        : minDim * 0.16;

      state.servitude = clamp(Number(sharedState.servitude) || 0, 0, 1);
      state.hoursWorked = clamp(Number(sharedState.hoursWorked) || state.servitude * 8, 0, 8);
      state.facetsCut = clamp(Math.round(Number(sharedState.facetsCut) || 0), 0, 24);
      state.cityRadianceBoost = clamp(Number(sharedState.cityRadianceBoost) || 0, 0, 1);
      if (typeof sharedState.activeStone === 'string' && STONE_TINTS[sharedState.activeStone]) {
        state.activeStone = sharedState.activeStone;
      }
      if (typeof sharedState.stifledCatalogIndex === 'number') {
        state.stifledCatalogIndex = Math.trunc(sharedState.stifledCatalogIndex);
      } else {
        state.stifledCatalogIndex = -1;
      }
      state.isGrinding = Boolean(sharedState.isGrinding);
      state.reducedMotion = Boolean(sharedState.reducedMotion);

      if (sharedState.freePointer && typeof sharedState.freePointer === 'object') {
        state.freePointer = {
          x: typeof sharedState.freePointer.x === 'number' ? sharedState.freePointer.x : state.centerX,
          y: typeof sharedState.freePointer.y === 'number' ? sharedState.freePointer.y : state.centerY,
          nx: Number(sharedState.freePointer.nx) || 0,
          ny: Number(sharedState.freePointer.ny) || 0,
          vx: Number(sharedState.freePointer.vx) || 0,
          vy: Number(sharedState.freePointer.vy) || 0,
          active: Boolean(sharedState.freePointer.active)
        };
      }

      if (sharedState.capturedGaze && typeof sharedState.capturedGaze === 'object') {
        state.capturedGaze = {
          x: typeof sharedState.capturedGaze.x === 'number' ? sharedState.capturedGaze.x : state.centerX,
          y: typeof sharedState.capturedGaze.y === 'number' ? sharedState.capturedGaze.y : state.centerY,
          nx: Number(sharedState.capturedGaze.nx) || 0,
          ny: Number(sharedState.capturedGaze.ny) || 0,
          radialFreedom: typeof sharedState.capturedGaze.radialFreedom === 'number'
            ? clamp(sharedState.capturedGaze.radialFreedom, 0, 1)
            : clamp(1 - state.servitude, 0, 1),
          orbitalLock: typeof sharedState.capturedGaze.orbitalLock === 'number'
            ? clamp(sharedState.capturedGaze.orbitalLock, 0, 1)
            : state.servitude
        };
      } else {
        state.capturedGaze.radialFreedom = clamp(1 - state.servitude, 0, 1);
        state.capturedGaze.orbitalLock = state.servitude;
      }
    }

    function getCanalBand(ringIndex) {
      const innerStart = state.wheelRadius * 1.10;
      const outerEnd = state.outerRadius * 0.985;
      const span = Math.max(24, outerEnd - innerStart);
      const pitch = span / CANAL_COUNT;
      const r0 = innerStart + ringIndex * pitch + pitch * 0.11;
      const r1 = innerStart + (ringIndex + 1) * pitch - pitch * 0.13;
      return {
        r0: r0,
        r1: Math.max(r0 + 2, r1),
        mid: (r0 + r1) * 0.5,
        width: Math.max(2, r1 - r0),
        pitch: pitch
      };
    }

    function getHearthAnchor() {
      const annulus = Math.max(24, state.outerRadius - state.wheelRadius);
      const r = state.wheelRadius + annulus * 0.57;
      return {
        x: state.centerX + Math.cos(HEARTH_ANGLE) * r,
        y: state.centerY + Math.sin(HEARTH_ANGLE) * r,
        radius: clamp(annulus * 0.195, 15, 48),
        angle: HEARTH_ANGLE
      };
    }

    function getPoolAnchor() {
      const annulus = Math.max(24, state.outerRadius - state.wheelRadius);
      const r = state.wheelRadius + annulus * 0.59;
      return {
        x: state.centerX + Math.cos(POOL_ANGLE) * r,
        y: state.centerY + Math.sin(POOL_ANGLE) * r,
        radius: clamp(annulus * 0.225, 17, 56),
        angle: POOL_ANGLE
      };
    }

    function resize(width, height, dpr) {
      if (typeof width === 'number' && width > 0) state.width = width;
      if (typeof height === 'number' && height > 0) state.height = height;
      if (typeof dpr === 'number' && dpr > 0) state.dpr = dpr;
      const minDim = Math.min(state.width, state.height);
      state.centerX = state.width * 0.5;
      state.centerY = state.height * 0.5;
      state.outerRadius = minDim * 0.46;
      state.wheelRadius = minDim * 0.16;
      state.initializedKites = false;
    }

    function spawnCanalRipple(x, y, strength, sharp) {
      if (canalRipples.length >= 28) canalRipples.shift();
      const dx = x - state.centerX;
      const dy = y - state.centerY;
      const dist = Math.hypot(dx, dy);
      if (dist < state.wheelRadius * 1.04 || dist > state.outerRadius * 1.02) return;
      canalRipples.push({
        x: x,
        y: y,
        age: 0,
        maxAge: 1.5 + strength * 0.8,
        maxRadius: clamp((state.outerRadius - state.wheelRadius) * (0.14 + strength * 0.14), 12, 54),
        strength: clamp(strength, 0.2, 1),
        sharp: sharp
      });
    }

    function update(dt, sharedState) {
      const rawDt = typeof dt === 'number' && isFinite(dt) ? clamp(dt, 0, 0.1) : 0.016;
      syncGeometryFromShared(sharedState);

      if (sharedState && typeof sharedState.time === 'number' && isFinite(sharedState.time)) {
        state.time = sharedState.time;
      } else {
        state.time += rawDt;
      }

      const motionFactor = state.reducedMotion ? 0.08 : 1.0;
      const effDt = rawDt * motionFactor;

      // Update Stifle Law domain vitalities (-1 = all awaken at 1.0; 0..3 = selected 1.0, others stifled to 0.13)
      const cat = state.stifledCatalogIndex;
      const blendRate = clamp(rawDt * 9.5, 0.12, 1.0);
      for (let d = 0; d < 4; d++) {
        const target = cat < 0 ? 1.0 : (cat === d ? 1.0 : 0.13);
        state.vitality[d] = lerp(state.vitality[d], target, blendRate);
      }

      // Compute causal sharpness & servitude metrics
      state.canalMirrorSharpness = clamp(
        state.servitude * 0.68 + state.cityRadianceBoost * 0.32,
        0,
        1
      );

      // Update canal water interference ripples from capturedGaze & freePointer
      state.rippleCooldown -= rawDt;
      const gazeX = state.capturedGaze.x;
      const gazeY = state.capturedGaze.y;
      const ptrX = state.freePointer.active ? state.freePointer.x : gazeX;
      const ptrY = state.freePointer.active ? state.freePointer.y : gazeY;
      const moved = Math.hypot(ptrX - state.lastPointerX, ptrY - state.lastPointerY);
      state.lastPointerX = ptrX;
      state.lastPointerY = ptrY;

      if (!state.reducedMotion && state.rippleCooldown <= 0 && state.vitality[0] > 0.25) {
        const focusX = lerp(ptrX, gazeX, state.servitude * 0.85);
        const focusY = lerp(ptrY, gazeY, state.servitude * 0.85);
        if (moved > 2.2 || state.isGrinding) {
          spawnCanalRipple(focusX, focusY, clamp(0.45 + moved * 0.03, 0.4, 1.0), state.canalMirrorSharpness);
          state.rippleCooldown = 0.09;
        } else if (Math.sin(state.time * 3.1) > 0.92) {
          const ambientBand = getCanalBand(Math.floor((state.time * 1.7) % CANAL_COUNT));
          const ang = (state.time * 0.63) % TAU;
          spawnCanalRipple(
            state.centerX + Math.cos(ang) * ambientBand.mid,
            state.centerY + Math.sin(ang) * ambientBand.mid,
            0.35,
            state.canalMirrorSharpness
          );
          state.rippleCooldown = 0.28;
        }
      }

      for (let i = canalRipples.length - 1; i >= 0; i--) {
        canalRipples[i].age += rawDt * (state.reducedMotion ? 0.35 : 1.0);
        if (canalRipples[i].age >= canalRipples[i].maxAge) {
          canalRipples.splice(i, 1);
        }
      }

      // Update wind-kite aerodynamics & servitude law:
      // servitude < 0.35 -> kites dip & dance toward freePointer;
      // servitude -> 1.0 -> kites soar high in autonomous municipal splendor ignoring visitor.
      const kiteVital = state.vitality[1];
      const kiteMotion = effDt * lerp(0.12, 1.0, kiteVital);
      const pointerPull = smoothstep(0.35, 0.0, state.servitude) * smoothstep(0.2, 0.9, kiteVital);
      state.kitePointerAttraction = pointerPull;

      const annulus = Math.max(24, state.outerRadius - state.wheelRadius);
      let altSum = 0;

      for (let i = 0; i < kites.length; i++) {
        const k = kites[i];
        const anchorR = state.wheelRadius + annulus * k.anchorRingFrac;
        const ax = state.centerX + Math.cos(k.anchorAngle) * anchorR;
        const ay = state.centerY + Math.sin(k.anchorAngle) * anchorR;

        k.orbitAngle += k.orbitSpeed * kiteMotion * (1 + state.cityRadianceBoost * 0.35);

        // High servitude pushes kites outward & high into a self-sufficient municipal ring
        const loftyOrbitR = state.wheelRadius + annulus * lerp(k.orbitRadiusFrac, 0.92 + (i % 3) * 0.07, state.servitude);
        const figureEight = Math.sin(state.time * 0.9 + k.phase) * annulus * 0.07 * kiteVital * (1 - state.servitude * 0.45);
        let targetX = state.centerX + Math.cos(k.orbitAngle) * (loftyOrbitR + figureEight);
        let targetY = state.centerY + Math.sin(k.orbitAngle) * (loftyOrbitR + figureEight);

        // Playful swoop toward freePointer when un-yoked (servitude < 0.35)
        if (pointerPull > 0.01) {
          const pTargetX = state.freePointer.active ? state.freePointer.x : state.capturedGaze.x;
          const pTargetY = state.freePointer.active ? state.freePointer.y : state.capturedGaze.y;
          const dxP = pTargetX - ax;
          const dyP = pTargetY - ay;
          const distP = Math.hypot(dxP, dyP) || 1;
          const maxTether = annulus * 0.72;
          const clampedDist = Math.min(distP, maxTether);
          const danceOffsetAngle = Math.sin(state.time * 1.6 + k.phase) * 0.38;
          const dirAngle = Math.atan2(dyP, dxP) + danceOffsetAngle;
          const pullX = ax + Math.cos(dirAngle) * clampedDist;
          const pullY = ay + Math.sin(dirAngle) * clampedDist;
          const individualPull = pointerPull * (0.48 + 0.28 * Math.sin(k.phase + state.time * 0.7));
          targetX = lerp(targetX, pullX, clamp(individualPull, 0, 0.82));
          targetY = lerp(targetY, pullY, clamp(individualPull, 0, 0.82));
        }

        // Stifled kites droop closer to their mooring posts
        if (kiteVital < 0.5) {
          const stiffMix = smoothstep(0.5, 0.13, kiteVital);
          targetX = lerp(targetX, ax + Math.cos(k.anchorAngle) * annulus * 0.10, stiffMix * 0.65);
          targetY = lerp(targetY, ay + Math.sin(k.anchorAngle) * annulus * 0.10, stiffMix * 0.65);
        }

        if (!state.initializedKites) {
          k.x = targetX;
          k.y = targetY;
          for (let t = 0; t < k.tailNodes.length; t++) {
            k.tailNodes[t].x = targetX - Math.cos(k.heading) * (t + 1) * 6;
            k.tailNodes[t].y = targetY - Math.sin(k.heading) * (t + 1) * 6;
          }
        } else {
          const spring = clamp(rawDt * (state.reducedMotion ? 2.2 : 4.2), 0.02, 0.35);
          const nx = lerp(k.x, targetX, spring);
          const ny = lerp(k.y, targetY, spring);
          k.vx = (nx - k.x) / (rawDt || 0.016);
          k.vy = (ny - k.y) / (rawDt || 0.016);
          k.x = nx;
          k.y = ny;
          if (Math.hypot(k.vx, k.vy) > 1.5) {
            const desiredHeading = Math.atan2(k.vy, k.vx);
            k.heading += angleDiff(k.heading, desiredHeading) * clamp(rawDt * 5.0, 0.05, 0.35);
          } else {
            const tangent = k.orbitAngle + (k.orbitSpeed >= 0 ? PI * 0.5 : -PI * 0.5);
            k.heading += angleDiff(k.heading, tangent) * clamp(rawDt * 2.5, 0.02, 0.2);
          }
        }

        // Altitude: low playful dips when servitude < 0.35, soaring high as servitude -> 1
        const targetAlt = lerp(
          0.34 + 0.12 * Math.sin(state.time * 0.8 + k.phase),
          0.88 + (i % 3) * 0.04,
          smoothstep(0.15, 0.95, state.servitude)
        ) * lerp(0.38, 1.0, kiteVital);
        k.altitude = lerp(k.altitude, clamp(targetAlt, 0.15, 0.98), clamp(rawDt * 3.5, 0.05, 0.3));
        altSum += k.altitude;

        // Update fluttering silk tail chain
        const segLen = clamp(annulus * 0.032, 3.2, 8.5);
        let prevX = k.x - Math.cos(k.heading) * segLen * 0.9;
        let prevY = k.y - Math.sin(k.heading) * segLen * 0.9;
        for (let t = 0; t < k.tailNodes.length; t++) {
          const node = k.tailNodes[t];
          const flutterAmp = state.reducedMotion ? 0.15 : lerp(0.15, 1.8, kiteVital);
          const flutter = Math.sin(state.time * 7.2 - t * 0.85 + k.phase) * flutterAmp;
          const perpAngle = k.heading + PI * 0.5;
          const dx = node.x - prevX;
          const dy = node.y - prevY;
          const d = Math.hypot(dx, dy) || 1;
          node.x = prevX + (dx / d) * segLen + Math.cos(perpAngle) * flutter * 0.45;
          node.y = prevY + (dy / d) * segLen + Math.sin(perpAngle) * flutter * 0.45;
          prevX = node.x;
          prevY = node.y;
        }
      }
      state.initializedKites = true;
      state.kiteAltitudeMean = altSum / kites.length;

      // Update Cherry-Wood Hearth spit & thermal spirals (crimson embers + sweet marjoram)
      const hearthVital = state.vitality[2];
      state.spitAngle = (state.spitAngle + effDt * 0.85 * lerp(0.08, 1.0, hearthVital)) % TAU;
      for (let i = 0; i < hearthParticles.length; i++) {
        const p = hearthParticles[i];
        p.progress += effDt * p.speed * lerp(0.10, 1.0 + state.cityRadianceBoost * 0.35, hearthVital);
        if (p.progress >= 1) {
          p.progress -= 1;
        }
      }

      // Update Sunken Garden Pool bathers & invitation ripples:
      // servitude < 0.4 -> beckon visitor toward water with expanding invitation ripples;
      // servitude -> 1.0 -> turn inward into self-enjoyment while pool gleams brighter than ever.
      const poolVital = state.vitality[3];
      const poolAnchor = getPoolAnchor();
      const inviteStrength = smoothstep(0.40, 0.02, state.servitude) * smoothstep(0.2, 0.9, poolVital);
      state.batherInvitationStrength = inviteStrength;

      const visitorX = state.freePointer.active ? state.freePointer.x : state.capturedGaze.x;
      const visitorY = state.freePointer.active ? state.freePointer.y : state.capturedGaze.y;
      const angleToVisitor = Math.atan2(visitorY - poolAnchor.y, visitorX - poolAnchor.x);

      for (let i = 0; i < bathers.length; i++) {
        const b = bathers[i];
        const swimSpeed = effDt * (0.28 + i * 0.05) * lerp(0.08, 1.0, poolVital);
        b.baseAngle += swimSpeed * (state.servitude > 0.5 ? 1.15 : 0.65);
        const bx = poolAnchor.x + Math.cos(b.baseAngle) * poolAnchor.radius * b.orbitR;
        const by = poolAnchor.y + Math.sin(b.baseAngle) * poolAnchor.radius * b.orbitR;
        const inwardAngle = Math.atan2(poolAnchor.y - by, poolAnchor.x - bx);
        const outwardVisitorAngle = Math.atan2(visitorY - by, visitorX - bx);
        const targetFacing = inwardAngle + angleDiff(inwardAngle, outwardVisitorAngle) * inviteStrength;
        b.facing += angleDiff(b.facing, targetFacing) * clamp(rawDt * 4.0, 0.06, 0.35);
      }

      state.inviteCooldown -= rawDt;
      if (!state.reducedMotion && inviteStrength > 0.08 && state.inviteCooldown <= 0) {
        const sender = bathers[Math.floor((state.time * 1.9) % bathers.length)];
        const sx = poolAnchor.x + Math.cos(sender.baseAngle) * poolAnchor.radius * sender.orbitR;
        const sy = poolAnchor.y + Math.sin(sender.baseAngle) * poolAnchor.radius * sender.orbitR;
        if (invitationRipples.length >= 14) invitationRipples.shift();
        invitationRipples.push({
          x: sx,
          y: sy,
          dirAngle: angleToVisitor,
          age: 0,
          maxAge: 1.9,
          strength: inviteStrength
        });
        state.inviteCooldown = lerp(0.62, 0.28, inviteStrength);
      }

      for (let i = invitationRipples.length - 1; i >= 0; i--) {
        invitationRipples[i].age += rawDt * (state.reducedMotion ? 0.35 : 1.0);
        if (invitationRipples[i].age >= invitationRipples[i].maxAge) {
          invitationRipples.splice(i, 1);
        }
      }
    }

    // =========================================================================
    // RENDERING PASSES
    // =========================================================================

    function renderBackdrop(ctx) {
      const w = state.width;
      const h = state.height;
      const cx = state.centerX;
      const cy = state.centerY;
      const outerR = state.outerRadius;
      const radBoost = state.cityRadianceBoost;
      const allVital = state.stifledCatalogIndex < 0 ? 1.0 : 0.38;

      // Deep Venetian-oriental dusk lagoon wash
      const maxDim = Math.hypot(w, h) * 0.65;
      const bgGrad = ctx.createRadialGradient(cx, cy, state.wheelRadius * 0.4, cx, cy, maxDim);
      bgGrad.addColorStop(0, rgbaVital(34, 24, 38, 1, allVital, radBoost * 0.4));
      bgGrad.addColorStop(0.48, rgbaVital(20, 26, 40, 1, allVital, radBoost * 0.25));
      bgGrad.addColorStop(1, rgbaVital(9, 12, 20, 1, allVital, 0));
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle outer lagoon concentric ripples & architectural pavilion silhouettes outside outerRadius
      ctx.save();
      for (let rIdx = 1; rIdx <= 3; rIdx++) {
        const r = outerR * (1.06 + rIdx * 0.13);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, TAU);
        ctx.strokeStyle = rgbaVital(68, 106, 128, 0.13 - rIdx * 0.025, state.vitality[0], radBoost * 0.3);
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      for (let i = 0; i < outerPavilions.length; i++) {
        const pav = outerPavilions[i];
        const rIn = outerR * pav.radialDist;
        const rOut = outerR * (pav.radialDist + pav.depth);
        const a0 = pav.angle - pav.span * 0.5;
        const a1 = pav.angle + pav.span * 0.5;

        ctx.beginPath();
        ctx.arc(cx, cy, rOut, a0, a1);
        ctx.arc(cx, cy, rIn, a1, a0, true);
        ctx.closePath();
        ctx.fillStyle = rgbaVital(24, 22, 32, 0.68, allVital, radBoost * 0.15);
        ctx.fill();
        ctx.strokeStyle = rgbaVital(94, 78, 68, 0.24, allVital, radBoost * 0.2);
        ctx.lineWidth = 1;
        ctx.stroke();

        if (pav.lantern) {
          const la = (a0 + a1) * 0.5;
          const lx = cx + Math.cos(la) * (rIn + 2);
          const ly = cy + Math.sin(la) * (rIn + 2);
          const flicker = state.reducedMotion ? 0.85 : 0.75 + 0.25 * Math.sin(state.time * 2.3 + pav.phase);
          const lg = ctx.createRadialGradient(lx, ly, 0.5, lx, ly, 8 + radBoost * 5);
          lg.addColorStop(0, rgbaVital(252, 204, 124, 0.55 * flicker, allVital, radBoost));
          lg.addColorStop(1, 'rgba(252,204,124,0)');
          ctx.fillStyle = lg;
          ctx.beginPath();
          ctx.arc(lx, ly, 8 + radBoost * 5, 0, TAU);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    function renderCanalsAndMinerals(ctx) {
      const cx = state.centerX;
      const cy = state.centerY;
      const outerR = state.outerRadius;
      const wheelR = state.wheelRadius;
      const canalVital = state.vitality[0];
      const radBoost = state.cityRadianceBoost;
      const sharpness = state.canalMirrorSharpness;
      const stoneTint = STONE_TINTS[state.activeStone] || STONE_TINTS.chalcedony;

      ctx.save();

      // Carved stone terrace foundation spanning the city ring
      const cityDiskGrad = ctx.createRadialGradient(cx, cy, wheelR * 0.98, cx, cy, outerR * 1.02);
      cityDiskGrad.addColorStop(0, rgbaVital(52, 43, 40, 0.96, canalVital, radBoost * 0.2));
      cityDiskGrad.addColorStop(0.55, rgbaVital(44, 38, 38, 0.95, canalVital, radBoost * 0.2));
      cityDiskGrad.addColorStop(1, rgbaVital(31, 28, 34, 0.96, canalVital, radBoost * 0.15));
      ctx.beginPath();
      ctx.arc(cx, cy, outerR * 1.015, 0, TAU);
      ctx.arc(cx, cy, wheelR * 1.01, 0, TAU, true);
      ctx.fillStyle = cityDiskGrad;
      ctx.fill();

      const focusX = lerp(
        state.freePointer.active ? state.freePointer.x : state.capturedGaze.x,
        state.capturedGaze.x,
        state.servitude * 0.85
      );
      const focusY = lerp(
        state.freePointer.active ? state.freePointer.y : state.capturedGaze.y,
        state.capturedGaze.y,
        state.servitude * 0.85
      );
      const focusAngle = Math.atan2(focusY - cy, focusX - cx);

      // Render each of the 6 concentric water canals
      for (let i = 0; i < CANAL_COUNT; i++) {
        const band = getCanalBand(i);
        const ringFrac = i / (CANAL_COUNT - 1);

        // Base canal water ring: shifts from warm twilight teal-amber to brilliant crystal mirror
        const waterGrad = ctx.createRadialGradient(cx, cy, band.r0, cx, cy, band.r1);
        const baseR = lerp(18, 28 + stoneTint.r * 0.18, sharpness);
        const baseG = lerp(64, 96 + stoneTint.g * 0.22, sharpness);
        const baseB = lerp(84, 122 + stoneTint.b * 0.24, sharpness);
        waterGrad.addColorStop(0, rgbaVital(baseR * 0.72, baseG * 0.76, baseB * 0.80, 0.96, canalVital, radBoost * 0.35));
        waterGrad.addColorStop(0.5, rgbaVital(baseR, baseG, baseB, 0.97, canalVital, radBoost * 0.55));
        waterGrad.addColorStop(1, rgbaVital(baseR * 0.68, baseG * 0.72, baseB * 0.78, 0.96, canalVital, radBoost * 0.35));

        ctx.beginPath();
        ctx.arc(cx, cy, band.r1, 0, TAU);
        ctx.arc(cx, cy, band.r0, 0, TAU, true);
        ctx.fillStyle = waterGrad;
        ctx.fill();

        // Quay stone coping rims
        ctx.beginPath();
        ctx.arc(cx, cy, band.r0, 0, TAU);
        ctx.strokeStyle = rgbaVital(136, 114, 92, 0.52, canalVital, radBoost * 0.3);
        ctx.lineWidth = Math.max(1, band.width * 0.06);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, band.r1, 0, TAU);
        ctx.strokeStyle = rgbaVital(148, 124, 98, 0.58, canalVital, radBoost * 0.3);
        ctx.lineWidth = Math.max(1, band.width * 0.065);
        ctx.stroke();

        // REGIME A: Soft warm twilight liquid ripples (dominant at low servitude)
        const softAlpha = (1 - sharpness * 0.72) * lerp(0.15, 0.65, canalVital);
        if (softAlpha > 0.03) {
          const waveSegments = 18;
          for (let s = 0; s < waveSegments; s++) {
            const drift = state.reducedMotion ? 0 : state.time * (0.18 + (i % 2 === 0 ? 0.05 : -0.09));
            const aCenter = (s / waveSegments) * TAU + drift + i * 0.37;
            const proximityToGaze = Math.cos(angleDiff(aCenter, focusAngle));
            const warmLift = clamp(proximityToGaze * 0.5 + 0.5, 0, 1) * (1 - state.servitude);
            const span = 0.09 + warmLift * 0.07;
            const waveR = band.mid + Math.sin(s * 2.1 + state.time * (state.reducedMotion ? 0.2 : 1.7) + i) * band.width * 0.22;

            ctx.beginPath();
            ctx.arc(cx, cy, waveR, aCenter - span, aCenter + span);
            ctx.strokeStyle = rgbaVital(
              lerp(96, 242, warmLift),
              lerp(174, 188, warmLift),
              lerp(192, 128, warmLift),
              softAlpha * (0.45 + warmLift * 0.45),
              canalVital,
              radBoost * 0.3
            );
            ctx.lineWidth = Math.max(1, band.width * 0.11);
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }

        // REGIME B: Hyper-brilliant faceted chalcedony mirrors (rises with servitude & cityRadianceBoost)
        if (sharpness > 0.06) {
          const facetSymmetry = Math.max(12, (state.facetsCut || 6) * 2);
          const rot = (state.reducedMotion ? 0.04 : state.time * 0.14) * (i % 2 === 0 ? 1 : -1);
          for (let f = 0; f < facetSymmetry; f++) {
            const fa = (f / facetSymmetry) * TAU + rot + ringFrac * 0.22;
            const shimmer = 0.5 + 0.5 * Math.cos(fa * 3 - (state.reducedMotion ? 0 : state.time * 2.2) + i);
            if (shimmer < 0.36) continue;

            const halfChord = (TAU / facetSymmetry) * 0.34;
            const x1 = cx + Math.cos(fa - halfChord) * (band.r0 + band.width * 0.18);
            const y1 = cy + Math.sin(fa - halfChord) * (band.r0 + band.width * 0.18);
            const x2 = cx + Math.cos(fa) * (band.r1 - band.width * 0.14);
            const y2 = cy + Math.sin(fa) * (band.r1 - band.width * 0.14);
            const x3 = cx + Math.cos(fa + halfChord) * (band.r0 + band.width * 0.18);
            const y3 = cy + Math.sin(fa + halfChord) * (band.r0 + band.width * 0.18);
            const x4 = cx + Math.cos(fa) * (band.r0 + band.width * 0.06);
            const y4 = cy + Math.sin(fa) * (band.r0 + band.width * 0.06);

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.lineTo(x4, y4);
            ctx.closePath();

            const acc = stoneTint.accent;
            ctx.fillStyle = rgbaVital(
              acc[0],
              acc[1],
              acc[2],
              sharpness * shimmer * (0.28 + radBoost * 0.44),
              canalVital,
              radBoost
            );
            ctx.fill();

            if (sharpness > 0.45) {
              ctx.strokeStyle = rgbaVital(255, 252, 244, sharpness * shimmer * 0.55, canalVital, radBoost);
              ctx.lineWidth = 0.85;
              ctx.stroke();
            }
          }
        }
      }

      // Render uncut canal-bed quartzes (agate, onyx, chrysoprase, chalcedony veins along canal walls)
      for (let i = 0; i < mineralVeins.length; i++) {
        const v = mineralVeins[i];
        const band = getCanalBand(v.ring);
        const vr = v.edgeSide < 0 ? band.r0 + band.width * 0.18 : band.r1 - band.width * 0.18;
        const vx = cx + Math.cos(v.angle) * vr;
        const vy = cy + Math.sin(v.angle) * vr;
        const isResonant = v.stone === state.activeStone;
        const sz = clamp(band.width * 0.26 * v.sizeSeed, 2.4, 7.5) * (isResonant ? 1.24 : 1.0);
        const pulse = state.reducedMotion
          ? 0.85
          : 0.72 + 0.28 * Math.sin(state.time * (isResonant ? 3.4 : 1.6) + v.phase);

        ctx.save();
        ctx.translate(vx, vy);
        ctx.rotate(v.angle + v.phase * 0.25);

        if (isResonant && canalVital > 0.3) {
          const tint = STONE_TINTS[v.stone];
          const halo = ctx.createRadialGradient(0, 0, 0.5, 0, 0, sz * 2.5);
          halo.addColorStop(0, rgbaVital(tint.r, tint.g, tint.b, 0.46 * pulse, canalVital, radBoost));
          halo.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(0, 0, sz * 2.5, 0, TAU);
          ctx.fill();
        }

        // Polygonal raw crystal cluster
        ctx.beginPath();
        for (let p = 0; p < v.facets; p++) {
          const pa = (p / v.facets) * TAU;
          const pr = sz * (p % 2 === 0 ? 1.0 : 0.68);
          if (p === 0) ctx.moveTo(Math.cos(pa) * pr, Math.sin(pa) * pr);
          else ctx.lineTo(Math.cos(pa) * pr, Math.sin(pa) * pr);
        }
        ctx.closePath();

        if (v.stone === 'agate') {
          ctx.fillStyle = rgbaVital(214, 92, 52, 0.92, canalVital, radBoost);
          ctx.fill();
          ctx.strokeStyle = rgbaVital(252, 218, 168, 0.85 * pulse, canalVital, radBoost);
          ctx.lineWidth = Math.max(0.8, sz * 0.2);
          ctx.stroke();
        } else if (v.stone === 'onyx') {
          ctx.fillStyle = rgbaVital(22, 24, 30, 0.95, canalVital, radBoost * 0.2);
          ctx.fill();
          ctx.strokeStyle = rgbaVital(234, 240, 248, 0.88 * pulse, canalVital, radBoost);
          ctx.lineWidth = Math.max(0.85, sz * 0.22);
          ctx.stroke();
        } else if (v.stone === 'chrysoprase') {
          ctx.fillStyle = rgbaVital(46, 202, 134, 0.90, canalVital, radBoost);
          ctx.fill();
          ctx.strokeStyle = rgbaVital(192, 255, 220, 0.82 * pulse, canalVital, radBoost);
          ctx.lineWidth = Math.max(0.8, sz * 0.18);
          ctx.stroke();
        } else {
          // chalcedony
          ctx.fillStyle = rgbaVital(126, 166, 232, 0.90, canalVital, radBoost);
          ctx.fill();
          ctx.strokeStyle = rgbaVital(226, 236, 255, 0.85 * pulse, canalVital, radBoost);
          ctx.lineWidth = Math.max(0.8, sz * 0.18);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Render interactive liquid / faceted interference ripples on canals
      for (let i = 0; i < canalRipples.length; i++) {
        const rp = canalRipples[i];
        const t = rp.age / rp.maxAge;
        const r = lerp(2, rp.maxRadius, 1 - Math.pow(1 - t, 2));
        const alpha = (1 - t) * rp.strength * 0.62;

        ctx.save();
        ctx.translate(rp.x, rp.y);
        if (rp.sharp > 0.55) {
          // Crystalline octagonal ripple at high servitude
          ctx.beginPath();
          const sides = 8;
          for (let s = 0; s <= sides; s++) {
            const a = (s / sides) * TAU + t * 0.4;
            const px = Math.cos(a) * r;
            const py = Math.sin(a) * r;
            if (s === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = rgbaVital(232, 246, 255, alpha, canalVital, radBoost);
          ctx.lineWidth = 1.25;
          ctx.stroke();
        } else {
          // Soft warm twilight circular ripple
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, TAU);
          ctx.strokeStyle = rgbaVital(244, 206, 146, alpha, canalVital, radBoost * 0.4);
          ctx.lineWidth = 1.35;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Render 4 radial bronze-and-timber hydraulic lock-gates feeding the central lapidary wheel basin
      const innerBasinR = wheelR * 1.09;
      const outerCityR = outerR * 0.985;
      for (let i = 0; i < LOCK_ANGLES.length; i++) {
        const la = LOCK_ANGLES[i];
        const cosA = Math.cos(la);
        const sinA = Math.sin(la);
        const perpX = -sinA;
        const perpY = cosA;
        const halfCh = clamp((outerCityR - innerBasinR) * 0.022, 2.5, 5.5);

        // Radial sluice channel water feeding inward to central wheel
        ctx.beginPath();
        ctx.moveTo(cx + cosA * innerBasinR + perpX * halfCh, cy + sinA * innerBasinR + perpY * halfCh);
        ctx.lineTo(cx + cosA * outerCityR + perpX * halfCh, cy + sinA * outerCityR + perpY * halfCh);
        ctx.lineTo(cx + cosA * outerCityR - perpX * halfCh, cy + sinA * outerCityR - perpY * halfCh);
        ctx.lineTo(cx + cosA * innerBasinR - perpX * halfCh, cy + sinA * innerBasinR - perpY * halfCh);
        ctx.closePath();
        ctx.fillStyle = rgbaVital(26, 88, 108, 0.92, canalVital, radBoost * 0.45);
        ctx.fill();

        // Bronze lock-gate leaves at alternate rings + inward water spill threads
        for (let rIdx = 0; rIdx < CANAL_COUNT; rIdx += 2) {
          const b = getCanalBand(rIdx);
          const gateR = b.r0;
          const gx = cx + cosA * gateR;
          const gy = cy + sinA * gateR;
          const miterAngle = 0.28 + state.servitude * 0.16;

          ctx.strokeStyle = rgbaVital(198, 148, 76, 0.92, canalVital, radBoost * 0.4);
          ctx.lineWidth = Math.max(1.5, halfCh * 0.52);
          ctx.beginPath();
          ctx.moveTo(gx + perpX * halfCh * 1.35, gy + perpY * halfCh * 1.35);
          ctx.lineTo(gx + cosA * halfCh * miterAngle, gy + sinA * halfCh * miterAngle);
          ctx.lineTo(gx - perpX * halfCh * 1.35, gy - perpY * halfCh * 1.35);
          ctx.stroke();
        }

        // Animated hydraulic flow streak toward the wheel basin
        const flowPhase = state.reducedMotion ? 0.5 : (state.time * (0.55 + state.servitude * 0.85) + i * 0.25) % 1;
        const streakR = lerp(outerCityR * 0.92, innerBasinR * 1.04, flowPhase);
        ctx.beginPath();
        ctx.moveTo(cx + cosA * (streakR + 10), cy + sinA * (streakR + 10));
        ctx.lineTo(cx + cosA * streakR, cy + sinA * streakR);
        ctx.strokeStyle = rgbaVital(206, 244, 252, 0.58, canalVital, radBoost * 0.6);
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }

      // Render 9 arched Venetian-oriental stone bridges across concentric canals
      for (let i = 0; i < bridges.length; i++) {
        const br = bridges[i];
        const band = getCanalBand(br.ring);
        const rIn = band.r0 - band.width * 0.22;
        const rOut = band.r1 + band.width * 0.22;
        const halfArc = clamp((band.width * 0.62) / band.mid, 0.035, 0.085);

        ctx.save();
        // Curved water shadow under bridge arch
        const shOffset = 0.018;
        ctx.beginPath();
        ctx.arc(cx, cy, rOut - 1, br.angle - halfArc + shOffset, br.angle + halfArc + shOffset);
        ctx.arc(cx, cy, rIn + 1, br.angle + halfArc + shOffset, br.angle - halfArc + shOffset, true);
        ctx.closePath();
        ctx.fillStyle = 'rgba(6, 10, 18, 0.52)';
        ctx.fill();

        // Warm underside reflection glint on water
        const midAng = br.angle - shOffset * 0.8;
        ctx.beginPath();
        ctx.arc(cx, cy, band.mid, midAng - halfArc * 0.5, midAng + halfArc * 0.5);
        ctx.strokeStyle = rgbaVital(242, 188, 118, 0.34, canalVital, radBoost * 0.5);
        ctx.lineWidth = Math.max(1.2, band.width * 0.22);
        ctx.stroke();

        // Bridge stone deck
        ctx.beginPath();
        ctx.arc(cx, cy, rOut, br.angle - halfArc, br.angle + halfArc);
        ctx.arc(cx, cy, rIn, br.angle + halfArc, br.angle - halfArc, true);
        ctx.closePath();
        ctx.fillStyle = br.archTone === 0
          ? rgbaVital(178, 152, 124, 0.95, canalVital, radBoost * 0.3)
          : rgbaVital(158, 132, 108, 0.95, canalVital, radBoost * 0.3);
        ctx.fill();

        // Stepped parapet rails
        ctx.strokeStyle = rgbaVital(224, 198, 164, 0.85, canalVital, radBoost * 0.35);
        ctx.lineWidth = 1.25;
        ctx.stroke();

        // Transverse stone steps across bridge crown
        for (let st = -1; st <= 1; st++) {
          const sa = br.angle + st * halfArc * 0.48;
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(sa) * rIn, cy + Math.sin(sa) * rIn);
          ctx.lineTo(cx + Math.cos(sa) * rOut, cy + Math.sin(sa) * rOut);
          ctx.strokeStyle = rgbaVital(108, 88, 72, 0.55, canalVital, 0);
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
        ctx.restore();
      }

      // Central canal basin collar framing the inner wheelRadius cleanly
      const basinGrad = ctx.createRadialGradient(cx, cy, wheelR * 0.15, cx, cy, wheelR * 1.09);
      basinGrad.addColorStop(0, rgbaVital(9, 14, 22, 0.96, canalVital, 0));
      basinGrad.addColorStop(0.84, rgbaVital(14, 28, 38, 0.95, canalVital, radBoost * 0.25));
      basinGrad.addColorStop(1, rgbaVital(96, 82, 68, 0.92, canalVital, radBoost * 0.25));
      ctx.beginPath();
      ctx.arc(cx, cy, wheelR * 1.08, 0, TAU);
      ctx.fillStyle = basinGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, wheelR * 1.06, 0, TAU);
      ctx.strokeStyle = rgbaVital(176, 144, 104, 0.68, canalVital, radBoost * 0.4);
      ctx.lineWidth = 1.8;
      ctx.stroke();

      ctx.restore();
    }

    function renderPheasantHearth(ctx) {
      const anchor = getHearthAnchor();
      const hx = anchor.x;
      const hy = anchor.y;
      const R = anchor.radius;
      const vital = state.vitality[2];
      const radBoost = state.cityRadianceBoost;

      ctx.save();

      // Warm cherry-wood firelight spill onto surrounding stone quay & adjacent canals
      const flicker = state.reducedMotion
        ? 0.9
        : 0.84 + 0.16 * Math.sin(state.time * 6.7) * Math.cos(state.time * 4.1);
      const glowRadius = R * (2.25 + radBoost * 0.65) * lerp(0.35, 1.0, vital);
      const fireGlow = ctx.createRadialGradient(hx, hy, R * 0.12, hx, hy, glowRadius);
      fireGlow.addColorStop(0, rgbaVital(255, 146, 58, 0.48 * flicker, vital, radBoost));
      fireGlow.addColorStop(0.45, rgbaVital(214, 72, 36, 0.22 * flicker, vital, radBoost));
      fireGlow.addColorStop(1, 'rgba(214,72,36,0)');
      ctx.fillStyle = fireGlow;
      ctx.beginPath();
      ctx.arc(hx, hy, glowRadius, 0, TAU);
      ctx.fill();

      ctx.translate(hx, hy);

      // Vaulted semicircular terracotta & Istrian-stone hearth alcove terrace
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, TAU);
      ctx.fillStyle = rgbaVital(58, 38, 34, 0.96, vital, radBoost * 0.2);
      ctx.fill();
      ctx.strokeStyle = rgbaVital(188, 134, 92, 0.85, vital, radBoost * 0.35);
      ctx.lineWidth = Math.max(1.4, R * 0.075);
      ctx.stroke();

      // Inner sunken cherry-wood brazier pit
      ctx.beginPath();
      ctx.arc(0, R * 0.08, R * 0.72, 0, TAU);
      ctx.fillStyle = rgbaVital(28, 16, 16, 0.96, vital, 0);
      ctx.fill();
      ctx.strokeStyle = rgbaVital(132, 74, 52, 0.72, vital, radBoost * 0.25);
      ctx.lineWidth = Math.max(1, R * 0.045);
      ctx.stroke();

      // Seasoned cherry-wood logs stacked across the hearth bed
      const logAngles = [-0.32, 0.28, -0.04];
      for (let i = 0; i < logAngles.length; i++) {
        ctx.save();
        ctx.translate(0, R * 0.24 - i * R * 0.05);
        ctx.rotate(logAngles[i]);
        const lw = R * 0.92;
        const lh = Math.max(3, R * 0.15);
        const lr = lh * 0.45;
        ctx.fillStyle = rgbaVital(92, 36, 28, 0.96, vital, radBoost * 0.15);
        ctx.beginPath();
        ctx.moveTo(-lw * 0.5 + lr, -lh * 0.5);
        ctx.lineTo(lw * 0.5 - lr, -lh * 0.5);
        ctx.arc(lw * 0.5 - lr, 0, lr, -PI * 0.5, PI * 0.5);
        ctx.lineTo(-lw * 0.5 + lr, lh * 0.5);
        ctx.arc(-lw * 0.5 + lr, 0, lr, PI * 0.5, -PI * 0.5);
        ctx.closePath();
        ctx.fill();

        // Incandescent cherry-wood bark fissures
        ctx.strokeStyle = rgbaVital(252, 108, 44, 0.82 * flicker, vital, radBoost);
        ctx.lineWidth = Math.max(0.8, R * 0.03);
        ctx.beginPath();
        ctx.moveTo(-lw * 0.32, 0);
        ctx.lineTo(lw * 0.28, 0);
        ctx.stroke();
        ctx.restore();
      }

      // Dancing tongues of seasoned cherry-wood flame
      const flameHeightScale = lerp(0.18, 1.0 + radBoost * 0.28, vital) * flicker;
      const flameCount = 5;
      for (let f = 0; f < flameCount; f++) {
        const fx = (f - 2) * R * 0.16;
        const sway = state.reducedMotion ? 0 : Math.sin(state.time * 7.5 + f * 1.4) * R * 0.08;
        const fh = R * (0.48 + (2 - Math.abs(f - 2)) * 0.14) * flameHeightScale;
        const fw = R * 0.17;

        ctx.beginPath();
        ctx.moveTo(fx - fw, R * 0.20);
        ctx.quadraticCurveTo(fx - fw * 0.6 + sway * 0.5, R * 0.20 - fh * 0.6, fx + sway, R * 0.20 - fh);
        ctx.quadraticCurveTo(fx + fw * 0.6 + sway * 0.5, R * 0.20 - fh * 0.6, fx + fw, R * 0.20);
        ctx.closePath();
        ctx.fillStyle = f === 2
          ? rgbaVital(255, 216, 98, 0.86, vital, radBoost)
          : rgbaVital(236, 78, 38, 0.80, vital, radBoost);
        ctx.fill();
      }

      // Wrought-iron spit brackets & turning iron spit rod
      const spitY = -R * 0.08;
      ctx.strokeStyle = rgbaVital(148, 134, 124, 0.92, vital, 0);
      ctx.lineWidth = Math.max(1.3, R * 0.055);
      ctx.beginPath();
      ctx.moveTo(-R * 0.74, spitY);
      ctx.lineTo(R * 0.74, spitY);
      ctx.stroke();

      // Glazed GOLDEN PHEASANT roasting on the spit
      const turnBob = Math.sin(state.spitAngle) * R * 0.035;
      const turnProfile = 0.86 + 0.14 * Math.cos(state.spitAngle);
      ctx.save();
      ctx.translate(-R * 0.04, spitY + turnBob);

      // Sweeping golden pheasant tail plumes extending right
      ctx.beginPath();
      ctx.moveTo(R * 0.24, -R * 0.02);
      ctx.quadraticCurveTo(R * 0.54, -R * 0.22 * turnProfile, R * 0.72, -R * 0.10);
      ctx.quadraticCurveTo(R * 0.50, R * 0.04, R * 0.22, R * 0.05);
      ctx.closePath();
      ctx.fillStyle = rgbaVital(216, 132, 34, 0.95, vital, radBoost);
      ctx.fill();

      // Plump glazed pheasant body
      const bodyW = R * 0.36;
      const bodyH = R * 0.21 * turnProfile;
      const glazeGrad = ctx.createRadialGradient(-bodyW * 0.18, -bodyH * 0.28, R * 0.02, 0, 0, bodyW * 1.1);
      glazeGrad.addColorStop(0, rgbaVital(255, 232, 146, 0.98, vital, radBoost));
      glazeGrad.addColorStop(0.52, rgbaVital(232, 148, 36, 0.97, vital, radBoost));
      glazeGrad.addColorStop(1, rgbaVital(156, 68, 22, 0.96, vital, radBoost * 0.4));

      ctx.beginPath();
      ctx.ellipse(0, 0, bodyW, bodyH, -0.08, 0, TAU);
      ctx.fillStyle = glazeGrad;
      ctx.fill();
      ctx.strokeStyle = rgbaVital(255, 206, 112, 0.75, vital, radBoost);
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Tucked golden wing & drumstick contour
      ctx.beginPath();
      ctx.ellipse(R * 0.05, R * 0.03, bodyW * 0.52, bodyH * 0.52, 0.18, 0, PI * 1.25);
      ctx.strokeStyle = rgbaVital(138, 56, 18, 0.78, vital, 0);
      ctx.lineWidth = Math.max(1, R * 0.035);
      ctx.stroke();

      // Specular honey-amber glaze highlight + sprinkled sweet marjoram flecks on crust
      ctx.beginPath();
      ctx.ellipse(-bodyW * 0.22, -bodyH * 0.32, bodyW * 0.34, bodyH * 0.18, -0.15, 0, TAU);
      ctx.fillStyle = rgbaVital(255, 248, 204, 0.68, vital, radBoost);
      ctx.fill();

      const fleckOffsets = [[-0.12, -0.04], [0.06, -0.09], [0.16, 0.02], [-0.03, 0.07]];
      for (let m = 0; m < fleckOffsets.length; m++) {
        ctx.beginPath();
        ctx.arc(bodyW * fleckOffsets[m][0], bodyH * fleckOffsets[m][1] * 2.2, Math.max(1, R * 0.032), 0, TAU);
        ctx.fillStyle = rgbaVital(134, 188, 76, 0.92, vital, radBoost);
        ctx.fill();
      }
      ctx.restore();

      // Small brass sweet-marjoram mortar on hearth rim
      ctx.beginPath();
      ctx.arc(-R * 0.58, -R * 0.48, Math.max(2.6, R * 0.13), 0, TAU);
      ctx.fillStyle = rgbaVital(96, 146, 62, 0.92, vital, radBoost * 0.4);
      ctx.fill();
      ctx.strokeStyle = rgbaVital(216, 178, 96, 0.88, vital, radBoost * 0.4);
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Thermal spirals of glowing crimson cherry-wood embers & fragrant green-gold sweet marjoram motes
      const visitorPull = smoothstep(0.42, 0.0, state.servitude) * smoothstep(0.25, 0.9, vital);
      const ptrX = (state.freePointer.active ? state.freePointer.x : state.capturedGaze.x) - hx;
      const ptrY = (state.freePointer.active ? state.freePointer.y : state.capturedGaze.y) - hy;
      const ptrDist = Math.hypot(ptrX, ptrY) || 1;
      const driftTowardVisitorX = (ptrX / ptrDist) * R * 0.65 * visitorPull;
      const driftTowardVisitorY = (ptrY / ptrDist) * R * 0.65 * visitorPull;

      for (let i = 0; i < hearthParticles.length; i++) {
        const p = hearthParticles[i];
        const t = p.progress;
        const spiralTurns = t * TAU * 1.65 * p.spiralDir + p.phase;
        const spiralRad = R * (0.12 + t * 0.92 * p.spiralRadius);
        const px = Math.cos(spiralTurns) * spiralRad + driftTowardVisitorX * t;
        const py = -t * R * 1.45 + Math.sin(spiralTurns) * spiralRad * 0.55 + driftTowardVisitorY * t;
        const alpha = Math.sin(t * PI) * lerp(0.18, 0.95, vital);
        if (alpha <= 0.03) continue;

        const sz = Math.max(1.1, (p.size * R) / 34);
        if (p.kind === 'marjoram') {
          // Fragrant green-gold sweet marjoram leaf mote
          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(spiralTurns * 0.7);
          ctx.beginPath();
          ctx.ellipse(0, 0, sz * 1.45, sz * 0.78, 0, 0, TAU);
          ctx.fillStyle = rgbaVital(154, 212, 82, alpha, vital, radBoost);
          ctx.fill();
          ctx.restore();
        } else {
          // Glowing crimson-gold cherry-wood spark
          ctx.beginPath();
          ctx.arc(px, py, sz, 0, TAU);
          ctx.fillStyle = rgbaVital(255, 118, 52, alpha, vital, radBoost);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    function renderGardenPool(ctx) {
      const anchor = getPoolAnchor();
      const px = anchor.x;
      const py = anchor.y;
      const R = anchor.radius;
      const vital = state.vitality[3];
      const radBoost = state.cityRadianceBoost;

      ctx.save();

      // Luminous turquoise-amber garden reflection aura
      const poolAuraR = R * (2.0 + radBoost * 0.65) * lerp(0.35, 1.0, vital);
      const auraGrad = ctx.createRadialGradient(px, py, R * 0.2, px, py, poolAuraR);
      auraGrad.addColorStop(0, rgbaVital(48, 214, 198, 0.34 + radBoost * 0.22, vital, radBoost));
      auraGrad.addColorStop(0.55, rgbaVital(224, 168, 72, 0.14, vital, radBoost));
      auraGrad.addColorStop(1, 'rgba(48,214,198,0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(px, py, poolAuraR, 0, TAU);
      ctx.fill();

      ctx.translate(px, py);

      // Mosaic coping rim (turquoise, amber, lapis, ivory tesserae)
      const tileCount = 24;
      const outerCopingR = R * 1.04;
      const innerWaterR = R * 0.84;

      ctx.beginPath();
      ctx.arc(0, 0, outerCopingR, 0, TAU);
      ctx.fillStyle = rgbaVital(62, 52, 46, 0.96, vital, 0);
      ctx.fill();

      for (let t = 0; t < tileCount; t++) {
        const a0 = (t / tileCount) * TAU + 0.015;
        const a1 = ((t + 1) / tileCount) * TAU - 0.015;
        ctx.beginPath();
        ctx.arc(0, 0, outerCopingR * 0.99, a0, a1);
        ctx.arc(0, 0, innerWaterR, a1, a0, true);
        ctx.closePath();
        const mod = t % 3;
        if (mod === 0) ctx.fillStyle = rgbaVital(38, 178, 172, 0.92, vital, radBoost);
        else if (mod === 1) ctx.fillStyle = rgbaVital(228, 166, 68, 0.92, vital, radBoost);
        else ctx.fillStyle = rgbaVital(48, 98, 178, 0.90, vital, radBoost);
        ctx.fill();
      }

      // Sunken turquoise-amber pool water (gleams brighter than ever as servitude & cityRadianceBoost rise!)
      const poolGrad = ctx.createRadialGradient(-R * 0.14, -R * 0.14, R * 0.06, 0, 0, innerWaterR);
      poolGrad.addColorStop(0, rgbaVital(88, 238, 222, 0.97, vital, radBoost));
      poolGrad.addColorStop(0.62, rgbaVital(22, 164, 162, 0.97, vital, radBoost * 0.8));
      poolGrad.addColorStop(1, rgbaVital(14, 92, 108, 0.98, vital, radBoost * 0.5));
      ctx.beginPath();
      ctx.arc(0, 0, innerWaterR, 0, TAU);
      ctx.fillStyle = poolGrad;
      ctx.fill();

      // Submerged marble steps welcoming the visitor on the upper-left arc
      for (let st = 0; st < 3; st++) {
        const stepR = innerWaterR - st * R * 0.085;
        ctx.beginPath();
        ctx.arc(0, 0, stepR, -2.55 + st * 0.1, -1.55 - st * 0.1);
        ctx.strokeStyle = rgbaVital(242, 224, 182, (0.58 - st * 0.14), vital, radBoost * 0.4);
        ctx.lineWidth = Math.max(1.2, R * 0.06);
        ctx.stroke();
      }

      // Golden-turquoise subsurface caustics inside cistern
      const causticCount = 7;
      for (let c = 0; c < causticCount; c++) {
        const ca = (c / causticCount) * TAU + (state.reducedMotion ? 0 : state.time * 0.45);
        const cr = innerWaterR * (0.32 + (c % 3) * 0.18);
        ctx.beginPath();
        ctx.arc(
          Math.cos(ca) * cr * 0.45,
          Math.sin(ca) * cr * 0.45,
          R * (0.16 + (c % 2) * 0.08),
          ca,
          ca + 1.45
        );
        ctx.strokeStyle = rgbaVital(252, 228, 148, 0.34 + radBoost * 0.32, vital, radBoost);
        ctx.lineWidth = Math.max(0.9, R * 0.035);
        ctx.stroke();
      }

      // Render 3 graceful stylized bathing figures in the water
      const invite = state.batherInvitationStrength;
      for (let i = 0; i < bathers.length; i++) {
        const b = bathers[i];
        const bx = Math.cos(b.baseAngle) * R * b.orbitR;
        const by = Math.sin(b.baseAngle) * R * b.orbitR;
        const bScale = Math.max(3.2, R * 0.16);

        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(b.facing);

        // Submerged aquamarine water wake & rippling halo around shoulders
        ctx.beginPath();
        ctx.arc(0, 0, bScale * 1.45, 0, TAU);
        ctx.strokeStyle = rgbaVital(178, 252, 244, 0.48 + radBoost * 0.25, vital, radBoost);
        ctx.lineWidth = Math.max(0.85, bScale * 0.18);
        ctx.stroke();

        // Submerged shimmering silhouette trailing behind
        ctx.beginPath();
        ctx.ellipse(-bScale * 0.72, 0, bScale * 0.85, bScale * 0.46, 0, 0, TAU);
        ctx.fillStyle = rgbaVital(116, 212, 202, 0.42, vital, radBoost);
        ctx.fill();

        // Warm amber-sunlit shoulders
        ctx.beginPath();
        ctx.ellipse(0, 0, bScale * 0.52, bScale * 0.92, 0, 0, TAU);
        ctx.fillStyle = rgbaVital(234, 176, 132, 0.95, vital, radBoost * 0.35);
        ctx.fill();

        // Beckoning arm (extends gracefully outward toward stranger when servitude < 0.4;
        // curves inward in self-contained pleasure as servitude -> 1)
        const armReach = lerp(0.55, 1.42, invite);
        const armWave = state.reducedMotion ? 0 : Math.sin(state.time * 3.2 + b.phase) * 0.22 * invite;
        ctx.beginPath();
        ctx.moveTo(bScale * 0.12, bScale * 0.68);
        ctx.quadraticCurveTo(
          bScale * (0.65 * armReach),
          bScale * (0.55 - armWave),
          bScale * (1.15 * armReach),
          bScale * (0.12 - armWave * 1.3)
        );
        ctx.strokeStyle = rgbaVital(242, 188, 144, 0.94, vital, radBoost * 0.35);
        ctx.lineWidth = Math.max(1.2, bScale * 0.28);
        ctx.lineCap = 'round';
        ctx.stroke();

        // Flowing dark hair & jewel hairpin
        ctx.beginPath();
        ctx.arc(-bScale * 0.06, 0, bScale * 0.52, 0, TAU);
        ctx.fillStyle = rgbaVital(34, 24, 30, 0.96, vital, 0);
        ctx.fill();

        const ornamentPal = KITE_PALETTES[b.hairOrnament] || KITE_PALETTES.saffron;
        ctx.beginPath();
        ctx.arc(-bScale * 0.24, -bScale * 0.22, Math.max(1.0, bScale * 0.20), 0, TAU);
        ctx.fillStyle = rgbaVital(ornamentPal.primary[0], ornamentPal.primary[1], ornamentPal.primary[2], 0.95, vital, radBoost);
        ctx.fill();

        ctx.restore();
      }

      // Framed by 5 slender dark Mediterranean cypresses around outer mosaic rim
      for (let c = 0; c < poolCypresses.length; c++) {
        const cyTree = poolCypresses[c];
        const sway = state.reducedMotion ? 0 : Math.sin(state.time * 1.5 + cyTree.phase) * 0.03 * vital;
        const tx = Math.cos(cyTree.angle + sway) * R * cyTree.dist;
        const ty = Math.sin(cyTree.angle + sway) * R * cyTree.dist;
        const tr = Math.max(3.4, R * 0.165 * cyTree.scale);

        // Soft canopy shadow
        ctx.beginPath();
        ctx.arc(tx + 2, ty + 2, tr * 1.05, 0, TAU);
        ctx.fillStyle = 'rgba(6, 10, 16, 0.44)';
        ctx.fill();

        // Layered dark-jade cypress crown
        ctx.beginPath();
        ctx.arc(tx, ty, tr, 0, TAU);
        ctx.fillStyle = rgbaVital(24, 68, 56, 0.95, vital, radBoost * 0.25);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(tx - tr * 0.18, ty - tr * 0.18, tr * 0.58, 0, TAU);
        ctx.fillStyle = rgbaVital(48, 114, 88, 0.92, vital, radBoost * 0.35);
        ctx.fill();
      }

      ctx.restore();

      // Expanding luminous invitation ripples propagating toward freePointer when servitude < 0.4
      if (invitationRipples.length > 0 && vital > 0.2) {
        ctx.save();
        for (let i = 0; i < invitationRipples.length; i++) {
          const ir = invitationRipples[i];
          const t = ir.age / ir.maxAge;
          const ease = 1 - Math.pow(1 - t, 2);
          const travel = ease * R * 1.15;
          const rx = ir.x + Math.cos(ir.dirAngle) * travel;
          const ry = ir.y + Math.sin(ir.dirAngle) * travel;
          const rad = lerp(R * 0.18, R * 1.05, ease);
          const alpha = (1 - t) * ir.strength * 0.72;

          ctx.beginPath();
          ctx.arc(rx, ry, rad, ir.dirAngle - 1.05, ir.dirAngle + 1.05);
          ctx.strokeStyle = rgbaVital(148, 252, 236, alpha, vital, radBoost);
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(rx, ry, rad * 0.82, ir.dirAngle - 0.72, ir.dirAngle + 0.72);
          ctx.strokeStyle = rgbaVital(252, 218, 128, alpha * 0.78, vital, radBoost);
          ctx.lineWidth = 1.05;
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    function drawKiteCanopy(ctx, shape, size, palette, vital, radBoost) {
      const p1 = palette.primary;
      const p2 = palette.secondary;
      const tr = palette.trim;

      if (shape === 'swallowtail') {
        // Curved aerodynamic swallowtail silk kite
        ctx.beginPath();
        ctx.moveTo(size * 1.05, 0);
        ctx.quadraticCurveTo(size * 0.35, -size * 0.95, -size * 0.55, -size * 0.82);
        ctx.lineTo(-size * 0.22, -size * 0.12);
        ctx.lineTo(-size * 0.92, -size * 0.34);
        ctx.lineTo(-size * 0.48, 0);
        ctx.lineTo(-size * 0.92, size * 0.34);
        ctx.lineTo(-size * 0.22, size * 0.12);
        ctx.lineTo(-size * 0.55, size * 0.82);
        ctx.quadraticCurveTo(size * 0.35, size * 0.95, size * 1.05, 0);
        ctx.closePath();
        ctx.fillStyle = rgbaVital(p1[0], p1[1], p1[2], 0.92, vital, radBoost);
        ctx.fill();

        // Inner silk chevron inset
        ctx.beginPath();
        ctx.moveTo(size * 0.78, 0);
        ctx.lineTo(-size * 0.15, -size * 0.48);
        ctx.lineTo(-size * 0.02, 0);
        ctx.lineTo(-size * 0.15, size * 0.48);
        ctx.closePath();
        ctx.fillStyle = rgbaVital(p2[0], p2[1], p2[2], 0.88, vital, radBoost);
        ctx.fill();

        // Bamboo spars
        ctx.strokeStyle = rgbaVital(tr[0], tr[1], tr[2], 0.85, vital, radBoost);
        ctx.lineWidth = Math.max(0.85, size * 0.09);
        ctx.beginPath();
        ctx.moveTo(size * 1.02, 0);
        ctx.lineTo(-size * 0.48, 0);
        ctx.moveTo(size * 0.22, -size * 0.72);
        ctx.quadraticCurveTo(size * 0.42, 0, size * 0.22, size * 0.72);
        ctx.stroke();
      } else if (shape === 'octagonal') {
        // Venetian octagonal silk medallion kite
        ctx.beginPath();
        for (let s = 0; s < 8; s++) {
          const a = (s / 8) * TAU + PI / 8;
          const rx = Math.cos(a) * size * 0.88;
          const ry = Math.sin(a) * size * 0.78;
          if (s === 0) ctx.moveTo(rx, ry);
          else ctx.lineTo(rx, ry);
        }
        ctx.closePath();
        ctx.fillStyle = rgbaVital(p1[0], p1[1], p1[2], 0.92, vital, radBoost);
        ctx.fill();
        ctx.strokeStyle = rgbaVital(tr[0], tr[1], tr[2], 0.88, vital, radBoost);
        ctx.lineWidth = Math.max(0.9, size * 0.09);
        ctx.stroke();

        // Translucent sunlit silk center star
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.42, 0, TAU);
        ctx.fillStyle = rgbaVital(p2[0], p2[1], p2[2], 0.90, vital, radBoost);
        ctx.fill();

        // Radial bamboo cross-spars
        ctx.beginPath();
        ctx.moveTo(-size * 0.8, 0);
        ctx.lineTo(size * 0.8, 0);
        ctx.moveTo(0, -size * 0.72);
        ctx.lineTo(0, size * 0.72);
        ctx.stroke();
      } else {
        // Cellular winged diamond kite
        ctx.beginPath();
        ctx.moveTo(size * 1.05, 0);
        ctx.lineTo(size * 0.08, -size * 0.92);
        ctx.lineTo(-size * 0.88, 0);
        ctx.lineTo(size * 0.08, size * 0.92);
        ctx.closePath();
        ctx.fillStyle = rgbaVital(p1[0], p1[1], p1[2], 0.92, vital, radBoost);
        ctx.fill();

        // Twin cellular inner box diamond
        ctx.beginPath();
        ctx.moveTo(size * 0.52, 0);
        ctx.lineTo(size * 0.05, -size * 0.44);
        ctx.lineTo(-size * 0.42, 0);
        ctx.lineTo(size * 0.05, size * 0.44);
        ctx.closePath();
        ctx.fillStyle = rgbaVital(p2[0], p2[1], p2[2], 0.90, vital, radBoost);
        ctx.fill();

        ctx.strokeStyle = rgbaVital(tr[0], tr[1], tr[2], 0.88, vital, radBoost);
        ctx.lineWidth = Math.max(0.9, size * 0.09);
        ctx.stroke();
      }
    }

    function renderKites(ctx) {
      const cx = state.centerX;
      const cy = state.centerY;
      const annulus = Math.max(24, state.outerRadius - state.wheelRadius);
      const kiteVital = state.vitality[1];
      const radBoost = state.cityRadianceBoost;

      ctx.save();

      // Pass 1: Cast soft parallax kite shadows onto the canals & quays below
      for (let i = 0; i < kites.length; i++) {
        const k = kites[i];
        const shadowOffset = 8 + k.altitude * 28;
        const baseSize = clamp(annulus * 0.058 * k.scaleSeed, 6.5, 16.5);
        ctx.save();
        ctx.translate(k.x + shadowOffset * 0.7, k.y + shadowOffset);
        ctx.rotate(k.heading);
        ctx.beginPath();
        ctx.ellipse(0, 0, baseSize * 0.85, baseSize * 0.55, 0, 0, TAU);
        ctx.fillStyle = 'rgba(5, 8, 15, ' + (0.24 * (1 - k.altitude * 0.35)).toFixed(3) + ')';
        ctx.fill();
        ctx.restore();
      }

      // Pass 2: Catenary wind-tethers, fluttering silk tails & glowing silk kite canopies
      for (let i = 0; i < kites.length; i++) {
        const k = kites[i];
        const pal = KITE_PALETTES[k.paletteKey] || KITE_PALETTES.carnelian;
        const anchorR = state.wheelRadius + annulus * k.anchorRingFrac;
        const ax = cx + Math.cos(k.anchorAngle) * anchorR;
        const ay = cy + Math.sin(k.anchorAngle) * anchorR;

        // Mooring bollard pin on stone quay
        ctx.beginPath();
        ctx.arc(ax, ay, 1.8, 0, TAU);
        ctx.fillStyle = rgbaVital(214, 178, 118, 0.72, kiteVital, radBoost * 0.3);
        ctx.fill();

        // Catenary sagging silk tether line
        const midX = (ax + k.x) * 0.5;
        const midY = (ay + k.y) * 0.5;
        const sag = lerp(22, 6, k.altitude) * lerp(1.6, 0.85, kiteVital);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(midX + sag * 0.35, midY + sag, k.x, k.y);
        ctx.strokeStyle = rgbaVital(238, 224, 192, 0.36 + radBoost * 0.18, kiteVital, radBoost * 0.3);
        ctx.lineWidth = 0.95;
        ctx.stroke();

        // Fluttering silk tail ribbon + tiny bow-knots
        if (k.tailNodes.length > 0) {
          ctx.beginPath();
          ctx.moveTo(k.x, k.y);
          for (let t = 0; t < k.tailNodes.length; t++) {
            ctx.lineTo(k.tailNodes[t].x, k.tailNodes[t].y);
          }
          ctx.strokeStyle = rgbaVital(pal.secondary[0], pal.secondary[1], pal.secondary[2], 0.82, kiteVital, radBoost);
          ctx.lineWidth = 1.3;
          ctx.stroke();

          for (let t = 1; t < k.tailNodes.length; t += 2) {
            const tn = k.tailNodes[t];
            ctx.beginPath();
            ctx.arc(tn.x, tn.y, 1.6, 0, TAU);
            ctx.fillStyle = rgbaVital(pal.trim[0], pal.trim[1], pal.trim[2], 0.88, kiteVital, radBoost);
            ctx.fill();
          }
        }

        // Kite canopy scaled slightly by altitude parallax
        const size = clamp(annulus * 0.058 * k.scaleSeed, 6.8, 17.5) * (0.86 + k.altitude * 0.28);
        ctx.save();
        ctx.translate(k.x, k.y);
        ctx.rotate(k.heading);

        // Sunlit municipal radiance halo at high servitude / cityRadianceBoost
        if ((radBoost > 0.15 || state.kitePointerAttraction > 0.3) && kiteVital > 0.35) {
          const kGlow = ctx.createRadialGradient(0, 0, size * 0.15, 0, 0, size * 1.85);
          kGlow.addColorStop(
            0,
            rgbaVital(pal.secondary[0], pal.secondary[1], pal.secondary[2], 0.26 + radBoost * 0.26, kiteVital, radBoost)
          );
          kGlow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = kGlow;
          ctx.beginPath();
          ctx.arc(0, 0, size * 1.85, 0, TAU);
          ctx.fill();
        }

        drawKiteCanopy(ctx, k.shape, size, pal, kiteVital, radBoost);
        ctx.restore();
      }

      ctx.restore();
    }

    function renderDesireDispositionHalo(ctx) {
      const cx = state.centerX;
      const cy = state.centerY;
      const outerR = state.outerRadius;
      const cat = state.stifledCatalogIndex;
      const radBoost = state.cityRadianceBoost;

      ctx.save();
      if (cat < 0) {
        // Simultaneous awakening in Anastasia's heart: warm golden-chalcedony iris ring uniting all lures
        const pulse = state.reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(state.time * 1.3);
        ctx.beginPath();
        ctx.arc(cx, cy, outerR * 1.005, 0, TAU);
        ctx.strokeStyle = 'rgba(244, 202, 132, ' + (0.18 + pulse * 0.10 + radBoost * 0.22).toFixed(3) + ')';
        ctx.lineWidth = 1.6;
        ctx.stroke();
      } else {
        // Cataloged one-by-one: delicate taxonomist specimen reticle framing ONLY the isolated desire
        if (typeof ctx.setLineDash === 'function') ctx.setLineDash([5, 5]);
        ctx.strokeStyle = 'rgba(226, 204, 158, 0.52)';
        ctx.lineWidth = 1.25;
        if (cat === 0) {
          ctx.beginPath();
          ctx.arc(cx, cy, (state.wheelRadius * 1.12 + outerR * 0.98) * 0.5, 0, TAU);
          ctx.stroke();
        } else if (cat === 1) {
          ctx.beginPath();
          ctx.arc(cx, cy, outerR * 0.93, 0, TAU);
          ctx.stroke();
        } else if (cat === 2) {
          const ha = getHearthAnchor();
          ctx.beginPath();
          ctx.arc(ha.x, ha.y, ha.radius * 1.32, 0, TAU);
          ctx.stroke();
        } else if (cat === 3) {
          const pa = getPoolAnchor();
          ctx.beginPath();
          ctx.arc(pa.x, pa.y, pa.radius * 1.32, 0, TAU);
          ctx.stroke();
        }
        if (typeof ctx.setLineDash === 'function') ctx.setLineDash([]);
      }
      ctx.restore();
    }

    function render(ctx, sharedState) {
      if (!ctx) return;
      if (sharedState) {
        syncGeometryFromShared(sharedState);
        if (!state.initializedKites) {
          update(0.016, sharedState);
        }
      }

      ctx.save();
      renderBackdrop(ctx);
      renderCanalsAndMinerals(ctx);
      renderPheasantHearth(ctx);
      renderGardenPool(ctx);
      renderKites(ctx);
      renderDesireDispositionHalo(ctx);
      ctx.restore();
    }

    // =========================================================================
    // PROCEDURAL WEBAUDIO WORLD
    // =========================================================================

    function ensureAudioGraph(audioCtx, masterGain) {
      if (state.audio && state.audio.ctx === audioCtx && state.audio.target === masterGain) {
        return state.audio;
      }

      // Build soft pink-tinted noise buffer for canal water & cherry-wood hearth crackles
      const sampleRate = audioCtx.sampleRate || 44100;
      const bufLen = sampleRate * 2;
      const noiseBuf = audioCtx.createBuffer(1, bufLen, sampleRate);
      const data = noiseBuf.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufLen; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        data[i] = (b0 + b1 + b2 + white * 0.1848) * 0.14;
      }

      const layerBus = audioCtx.createGain();
      layerBus.gain.value = 0.65;
      layerBus.connect(masterGain);

      // 1. Canal water lapping & crystalline mirror shimmer
      const waterSrc = audioCtx.createBufferSource();
      waterSrc.buffer = noiseBuf;
      waterSrc.loop = true;

      const waterFilter = audioCtx.createBiquadFilter();
      waterFilter.type = 'bandpass';
      waterFilter.frequency.value = 420;
      waterFilter.Q.value = 2.2;

      const waterGain = audioCtx.createGain();
      waterGain.gain.value = 0.0;

      waterSrc.connect(waterFilter);
      waterFilter.connect(waterGain);
      waterGain.connect(layerBus);
      waterSrc.start();

      // 2. Tethered silk wind-kites aeolian harmonic fifths
      const kiteOscA = audioCtx.createOscillator();
      const kiteOscB = audioCtx.createOscillator();
      kiteOscA.type = 'sine';
      kiteOscB.type = 'triangle';
      kiteOscA.frequency.value = 293.66; // D4
      kiteOscB.frequency.value = 440.00; // A4

      const kiteFilter = audioCtx.createBiquadFilter();
      kiteFilter.type = 'lowpass';
      kiteFilter.frequency.value = 980;

      const kiteGain = audioCtx.createGain();
      kiteGain.gain.value = 0.0;

      kiteOscA.connect(kiteFilter);
      kiteOscB.connect(kiteFilter);
      kiteFilter.connect(kiteGain);
      kiteGain.connect(layerBus);
      kiteOscA.start();
      kiteOscB.start();

      state.audio = {
        ctx: audioCtx,
        target: masterGain,
        noiseBuf: noiseBuf,
        layerBus: layerBus,
        waterFilter: waterFilter,
        waterGain: waterGain,
        kiteOscA: kiteOscA,
        kiteOscB: kiteOscB,
        kiteFilter: kiteFilter,
        kiteGain: kiteGain,
        nextCrackleAt: 0,
        nextDropletAt: 0,
        dropletStep: 0
      };
      return state.audio;
    }

    function onAudioTick(audioCtx, masterGain, sharedState) {
      if (!audioCtx || !masterGain) return;
      if (audioCtx.state && audioCtx.state !== 'running') return;

      if (sharedState) {
        syncGeometryFromShared(sharedState);
      }

      let graph;
      try {
        graph = ensureAudioGraph(audioCtx, masterGain);
      } catch (_err) {
        return;
      }

      const now = audioCtx.currentTime;
      const canalVital = state.vitality[0];
      const kiteVital = state.vitality[1];
      const hearthVital = state.vitality[2];
      const poolVital = state.vitality[3];
      const serv = state.servitude;
      const rad = state.cityRadianceBoost;

      // Modulate canal water: soft low-Q lapping -> high-Q crystalline shimmer as servitude rises
      const waterFreq = lerp(360, 1180, state.canalMirrorSharpness) + Math.sin(now * 0.7) * 55;
      const waterQ = lerp(1.8, 7.5, state.canalMirrorSharpness);
      graph.waterFilter.frequency.setTargetAtTime(clamp(waterFreq, 180, 2400), now, 0.08);
      graph.waterFilter.Q.setTargetAtTime(waterQ, now, 0.08);
      graph.waterGain.gain.setTargetAtTime(0.055 * canalVital * (1 + rad * 0.3), now, 0.08);

      // Modulate silk kite aeolian drone: rises in pitch with altitude & servitude
      const basePitch = lerp(293.66, 392.00, state.kiteAltitudeMean);
      graph.kiteOscA.frequency.setTargetAtTime(basePitch, now, 0.10);
      graph.kiteOscB.frequency.setTargetAtTime(basePitch * 1.498, now, 0.10);
      graph.kiteFilter.frequency.setTargetAtTime(lerp(680, 1650, rad), now, 0.10);
      graph.kiteGain.gain.setTargetAtTime(0.024 * kiteVital * (0.75 + rad * 0.45), now, 0.10);

      // Granular cherry-wood hearth crackle pops
      if (hearthVital > 0.3 && now >= graph.nextCrackleAt) {
        graph.nextCrackleAt = now + 0.16 + Math.random() * 0.38;
        try {
          const popSrc = audioCtx.createBufferSource();
          popSrc.buffer = graph.noiseBuf;
          const popFilter = audioCtx.createBiquadFilter();
          popFilter.type = 'bandpass';
          popFilter.frequency.value = 1400 + Math.random() * 1900;
          popFilter.Q.value = 4.5;
          const popGain = audioCtx.createGain();
          const peak = 0.035 * hearthVital;
          popGain.gain.setValueAtTime(0.0001, now);
          popGain.gain.exponentialRampToValueAtTime(peak, now + 0.006);
          popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

          popSrc.connect(popFilter);
          popFilter.connect(popGain);
          popGain.connect(graph.layerBus);
          popSrc.start(now, Math.random() * 1.4, 0.06);
          popSrc.onended = function () {
            try {
              popSrc.disconnect();
              popFilter.disconnect();
              popGain.disconnect();
            } catch (_e) {}
          };
        } catch (_e) {}
      }

      // Sunken garden pool invitation water-bell droplets (warm beckoning when servitude < 0.4;
      // crystalline distant octaves as servitude -> 1)
      if (poolVital > 0.3 && now >= graph.nextDropletAt) {
        const interval = serv < 0.4 ? (0.42 + Math.random() * 0.45) : (0.85 + Math.random() * 0.75);
        graph.nextDropletAt = now + interval;
        const modalNotes = [369.99, 440.0, 554.37, 659.25, 739.99, 880.0];
        const note = modalNotes[graph.dropletStep % modalNotes.length] * (serv > 0.65 ? 2.0 : 1.0);
        graph.dropletStep++;

        try {
          const dropOsc = audioCtx.createOscillator();
          dropOsc.type = 'sine';
          dropOsc.frequency.setValueAtTime(note * 0.96, now);
          dropOsc.frequency.exponentialRampToValueAtTime(note, now + 0.04);

          const dropGain = audioCtx.createGain();
          const peak = (serv < 0.4 ? 0.028 : 0.016) * poolVital * (1 + rad * 0.25);
          dropGain.gain.setValueAtTime(0.0001, now);
          dropGain.gain.exponentialRampToValueAtTime(peak, now + 0.012);
          dropGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);

          dropOsc.connect(dropGain);
          dropGain.connect(graph.layerBus);
          dropOsc.start(now);
          dropOsc.stop(now + 0.30);
          dropOsc.onended = function () {
            try {
              dropOsc.disconnect();
              dropGain.disconnect();
            } catch (_e) {}
          };
        } catch (_e) {}
      }
    }

    function getTelemetry() {
      return {
        canalCount: CANAL_COUNT,
        bridgeCount: bridges.length,
        lockGateCount: LOCK_ANGLES.length,
        kiteCount: kites.length,
        batherCount: bathers.length,
        mineralVeins: {
          agate: 9,
          onyx: 9,
          chrysoprase: 9,
          chalcedony: 9,
          total: mineralVeins.length
        },
        activeStone: state.activeStone,
        stifledCatalogIndex: state.stifledCatalogIndex,
        simultaneousAwakening: state.stifledCatalogIndex < 0,
        domainVitality: {
          canals: Number(state.vitality[0].toFixed(3)),
          kites: Number(state.vitality[1].toFixed(3)),
          pheasant_hearth: Number(state.vitality[2].toFixed(3)),
          garden_pool: Number(state.vitality[3].toFixed(3))
        },
        servitude: Number(state.servitude.toFixed(3)),
        cityRadianceBoost: Number(state.cityRadianceBoost.toFixed(3)),
        canalMirrorSharpness: Number(state.canalMirrorSharpness.toFixed(3)),
        kiteAltitudeMean: Number(state.kiteAltitudeMean.toFixed(3)),
        kitePointerAttraction: Number(state.kitePointerAttraction.toFixed(3)),
        batherInvitationStrength: Number(state.batherInvitationStrength.toFixed(3)),
        activeRippleCount: canalRipples.length + invitationRipples.length,
        hearthEmberCount: 15,
        marjoramMoteCount: 15,
        reducedMotion: state.reducedMotion
      };
    }

    return {
      create: createLuresInstance,
      resize: resize,
      update: update,
      render: render,
      onAudioTick: onAudioTick,
      getTelemetry: getTelemetry
    };
  }

  // Expose both factory create(options) AND singleton top-level methods so either
  // invocation pattern in index.html works seamlessly.
  let defaultInstance = createLuresInstance();

  const api = {
    create: function (options) {
      defaultInstance = createLuresInstance(options);
      return defaultInstance;
    },
    resize: function (width, height, dpr) {
      return defaultInstance.resize(width, height, dpr);
    },
    update: function (dt, sharedState) {
      return defaultInstance.update(dt, sharedState);
    },
    render: function (ctx, sharedState) {
      return defaultInstance.render(ctx, sharedState);
    },
    onAudioTick: function (audioCtx, masterGain, sharedState) {
      return defaultInstance.onAudioTick(audioCtx, masterGain, sharedState);
    },
    getTelemetry: function () {
      return defaultInstance.getTelemetry();
    }
  };

  global.AnastasiaConcentricLures = api;
})(typeof window !== 'undefined' ? window : globalThis);
