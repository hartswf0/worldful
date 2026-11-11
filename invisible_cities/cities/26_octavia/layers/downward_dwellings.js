(function () {
  'use strict';

  const PALETTE = Object.freeze({
    abyssVoid: '#0b1017',
    chasmBed: '#141d29',
    graniteShadow: '#1d232c',
    graniteCrest: '#545d68',
    graniteHighlight: '#86909c',
    abyssMist: '#c9d6e3',
    cloudDrift: '#8fa4ba',
    hempOchre: '#c89b54',
    hempTaupe: '#9e7334',
    chainIron: '#3b434e',
    lanternAmber: '#f2b84b',
    gasGlow: '#ffd67c',
    trailingIvy: '#5e8c61',
    frayCrimson: '#c9534a',
    cedarHull: '#6d472b',
    cedarWarm: '#93623d',
    canvasSack: '#d2be96',
    copperRose: '#b97548',
    terracotta: '#b55d3d',
    linenLight: '#e4dfd3'
  });

  const DOWNWARD_STONES = Object.freeze([
    Object.freeze({
      index: 0, id: 'rope_ladders', hookIndex: 0, name: 'Rope Ladders',
      category: 'access', massKg: 18, cordLengthPx: 146, cordType: 'hemp',
      stoneInscription: 'Knotted hemp rungs drop straight into the empty air toward lower sack-doors.'
    }),
    Object.freeze({
      index: 1, id: 'sack_hammocks', hookIndex: 1, name: 'Hammock-Houses Like Sacks',
      category: 'dwelling', massKg: 64, cordLengthPx: 96, cordType: 'hemp',
      stoneInscription: 'Canvas-and-hemp dwellings stitched like sacks, cradling sleepers over 840 feet of void.'
    }),
    Object.freeze({
      index: 2, id: 'clothes_hangers', hookIndex: 2, name: 'Suspended Clothes Hangers',
      category: 'domestic', massKg: 12, cordLengthPx: 74, cordType: 'string',
      stoneInscription: 'A timber spar where shirts and linen dry briskly in chasm updrafts.'
    }),
    Object.freeze({
      index: 3, id: 'gondola_terraces', hookIndex: 3, name: 'Terraces Like Gondolas',
      category: 'dwelling', massKg: 72, cordLengthPx: 112, cordType: 'chain',
      stoneInscription: 'Curved cedar balconies slung like Venetian hulls beneath twin iron chains.'
    }),
    Object.freeze({
      index: 4, id: 'water_skins', hookIndex: 4, name: 'Skins of Water',
      category: 'provision', massKg: 34, cordLengthPx: 82, cordType: 'hemp',
      stoneInscription: 'Tarred goatskin cisterns cool in the mountain mist beneath the catwalk.'
    }),
    Object.freeze({
      index: 5, id: 'gas_jets', hookIndex: 5, name: 'Jets of Gas',
      category: 'utility', massKg: 19, cordLengthPx: 68, cordType: 'cable',
      stoneInscription: 'Flexible brass tubing feeds a steady blue-amber jet clear of hempen knots.'
    }),
    Object.freeze({
      index: 6, id: 'roasting_spits', hookIndex: 6, name: 'Suspended Spits',
      category: 'provision', massKg: 24, cordLengthPx: 88, cordType: 'chain',
      stoneInscription: 'An iron turnspit and drip-brazier hung on chain links where grease cannot scorch rope.'
    }),
    Object.freeze({
      index: 7, id: 'string_baskets', hookIndex: 7, name: 'Baskets on Strings',
      category: 'exchange', massKg: 15, cordLengthPx: 132, cordType: 'string',
      stoneInscription: 'Wicker parcels paid out on long twine from upper ties to lower hammocks.'
    }),
    Object.freeze({
      index: 8, id: 'dumb_waiters', hookIndex: 8, name: 'Abyss Dumb-Waiters',
      category: 'exchange', massKg: 38, cordLengthPx: 126, cordType: 'cable',
      stoneInscription: 'Counterweighted wooden lift-boxes shuttling bread and oil vertically through open air.'
    }),
    Object.freeze({
      index: 9, id: 'hanging_showers', hookIndex: 9, name: 'Suspended Showers',
      category: 'domestic', massKg: 28, cordLengthPx: 102, cordType: 'chain',
      stoneInscription: 'A perforated copper rose releasing silver droplets that fall hundreds of feet into cloud.'
    }),
    Object.freeze({
      index: 10, id: 'trapezes_and_rings', hookIndex: 10, name: 'Trapezes & Children’s Rings',
      category: 'play', massKg: 22, cordLengthPx: 118, cordType: 'hemp',
      stoneInscription: 'Children swing arc-to-arc over unmeasured emptiness without vertigo.'
    }),
    Object.freeze({
      index: 11, id: 'cable_cars', hookIndex: 11, name: 'Chasm Cable Cars',
      category: 'transit', massKg: 58, cordLengthPx: 92, cordType: 'cable',
      stoneInscription: 'A small timber gondola-car gliding along a taut traverse wire between spans.'
    }),
    Object.freeze({
      index: 12, id: 'abyss_chandeliers', hookIndex: 12, name: 'Pendant Chandeliers',
      category: 'illumination', massKg: 30, cordLengthPx: 108, cordType: 'chain',
      stoneInscription: 'Tiered iron candle-crowns hung beneath the web so night travelers read the abyss.'
    }),
    Object.freeze({
      index: 13, id: 'trailing_plant_pots', hookIndex: 13, name: 'Pots with Trailing Plants',
      category: 'flora', massKg: 20, cordLengthPx: 98, cordType: 'hemp',
      stoneInscription: 'Terracotta jars spilling long ivy runners downward toward drifting cloud.'
    })
  ]);

  const STARTER_INDICES = Object.freeze([0, 1, 3, 12]);
  const MAX_SAFE_LOAD_KG = 540;
  const FULL_SPAN_LIFESPAN_YEARS = 42.0;
  const OTHER_CITIES_UNCERTAINTY = 0.78;

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function resolveStoneIndex(idOrIndex) {
    if (typeof idOrIndex === 'number' && Number.isInteger(idOrIndex)) {
      return idOrIndex >= 0 && idOrIndex < DOWNWARD_STONES.length ? idOrIndex : -1;
    }
    if (typeof idOrIndex === 'string') {
      const trimmed = idOrIndex.trim();
      for (let i = 0; i < DOWNWARD_STONES.length; i += 1) {
        if (DOWNWARD_STONES[i].id === trimmed) return i;
      }
      if (/^\d+$/.test(trimmed)) {
        const parsed = Number(trimmed);
        return parsed >= 0 && parsed < DOWNWARD_STONES.length ? parsed : -1;
      }
    }
    return -1;
  }

  function pointToSegmentDist(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const lenSq = dx * dx + dy * dy;
    if (lenSq <= 0.0001) return Math.hypot(px - x1, py - y1);
    const t = clamp(((px - x1) * dx + (py - y1) * dy) / lenSq, 0, 1);
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  function resolveHookAnchor(hookIndex, hookPoints, width, height) {
    if (Array.isArray(hookPoints) && hookPoints.length > 0) {
      let hp = hookPoints[hookIndex];
      if (!hp || hp.hookIndex !== hookIndex) {
        for (let i = 0; i < hookPoints.length; i += 1) {
          if (hookPoints[i] && hookPoints[i].hookIndex === hookIndex) {
            hp = hookPoints[i];
            break;
          }
        }
      }
      if (hp && Number.isFinite(hp.x) && Number.isFinite(hp.y)) {
        return {
          x: hp.x,
          y: hp.y,
          vx: Number.isFinite(hp.vx) ? hp.vx : 0,
          vy: Number.isFinite(hp.vy) ? hp.vy : 0,
          tension: Number.isFinite(hp.tension) ? hp.tension : 0.35
        };
      }
    }
    const w = width > 0 ? width : 1280;
    const h = height > 0 ? height : 800;
    const u = hookIndex / 13;
    const normX = 0.17 + u * 0.66;
    const tierBand = (hookIndex % 3) * 0.028;
    const sag = Math.sin(Math.PI * u) * 0.085;
    return {
      x: normX * w,
      y: (0.28 + tierBand + sag) * h,
      vx: 0,
      vy: 0,
      tension: 0.35
    };
  }
  function computeCordScale(width, height) {
    const w = width > 0 ? width : 1280;
    const h = height > 0 ? height : 800;
    return clamp(Math.min(w / 1180, h / 740) * 0.42 + 0.60, 0.64, 1.06);
  }

  function createPendantSystem(opts = {}) {
    let reducedMotion = Boolean(opts && opts.reducedMotion);
    const onChange = opts && typeof opts.onChange === 'function' ? opts.onChange : null;
    const onUpwardCollapse = opts && typeof opts.onUpwardCollapse === 'function' ? opts.onUpwardCollapse : null;

    let lastWidth = 1280;
    let lastHeight = 800;
    let simTime = 0;
    let elapsedYears = 0;
    let extraBallastKg = 0;
    let upwardAttemptsCount = 0;
    let upwardToppledCount = 0;
    let activeStoneId = 'gondola_terraces';
    let cableCarT = 0.32;
    let cableCarDir = 1;
    let cableCarWorldX = 0;
    let cableCarWorldY = 0;
    let showerDrops = [];
    let activeFallDebris = [];

    const runtimeStones = DOWNWARD_STONES.map(function (spec, idx) {
      return {
        index: idx,
        isHung: false,
        theta: 0,
        omega: 0,
        prevVx: 0,
        deployScale: 1,
        anchorX: 0,
        anchorY: 0,
        x: 0,
        y: 0,
        phaseSeed: idx * 1.37 + 0.4
      };
    });

    function syncStoneGeometry(hookPoints, width, height) {
      const w = width > 0 ? width : lastWidth;
      const h = height > 0 ? height : lastHeight;
      const cScale = computeCordScale(w, h);
      for (let i = 0; i < DOWNWARD_STONES.length; i += 1) {
        const spec = DOWNWARD_STONES[i];
        const st = runtimeStones[i];
        const anc = resolveHookAnchor(spec.hookIndex, hookPoints, w, h);
        st.anchorX = anc.x;
        st.anchorY = anc.y;
        const len = spec.cordLengthPx * cScale * st.deployScale;
        st.x = anc.x + Math.sin(st.theta) * len;
        st.y = Math.min(h - 30, anc.y + Math.cos(st.theta) * len);
      }
    }

    function applyStarterDefaults() {
      simTime = 0;
      elapsedYears = 0;
      extraBallastKg = 0;
      upwardAttemptsCount = 0;
      upwardToppledCount = 0;
      activeStoneId = 'gondola_terraces';
      cableCarT = 0.32;
      cableCarDir = 1;
      showerDrops = [];
      activeFallDebris = [];
      for (let i = 0; i < runtimeStones.length; i += 1) {
        const st = runtimeStones[i];
        st.isHung = STARTER_INDICES.indexOf(i) !== -1;
        st.theta = 0;
        st.omega = 0;
        st.prevVx = 0;
        st.deployScale = 1;
      }
      syncStoneGeometry(null, lastWidth, lastHeight);
    }

    applyStarterDefaults();

    function getState() {
      let hungCount = 0;
      let stonesMassKg = 0;
      const stonesSnapshot = new Array(DOWNWARD_STONES.length);
      for (let i = 0; i < DOWNWARD_STONES.length; i += 1) {
        const spec = DOWNWARD_STONES[i];
        const st = runtimeStones[i];
        if (st.isHung) {
          hungCount += 1;
          stonesMassKg += spec.massKg;
        }
        stonesSnapshot[i] = {
          index: spec.index,
          id: spec.id,
          hookIndex: spec.hookIndex,
          name: spec.name,
          category: spec.category,
          massKg: spec.massKg,
          cordLengthPx: spec.cordLengthPx,
          cordType: spec.cordType,
          stoneInscription: spec.stoneInscription,
          isHung: st.isHung,
          swayDeg: +(st.theta * 180 / Math.PI).toFixed(2),
          x: +st.x.toFixed(1),
          y: +st.y.toFixed(1),
          anchorX: +st.anchorX.toFixed(1),
          anchorY: +st.anchorY.toFixed(1)
        };
      }
      const totalMassKg = +(stonesMassKg + extraBallastKg).toFixed(2);
      const netLoadRatio = +(totalMassKg / MAX_SAFE_LOAD_KG).toFixed(4);
      const overloaded = totalMassKg > MAX_SAFE_LOAD_KG;
      const knownSpanLifespanYears = +(Math.max(
        1.5,
        FULL_SPAN_LIFESPAN_YEARS - elapsedYears - netLoadRatio * 6.5
      )).toFixed(1);

      let civicSerenity;
      if (!overloaded) {
        civicSerenity = +(0.36 + (hungCount / 14) * 0.59).toFixed(4);
      } else {
        const excessRatio = (totalMassKg - MAX_SAFE_LOAD_KG) / MAX_SAFE_LOAD_KG;
        civicSerenity = +(clamp(0.30 - excessRatio * 0.38, 0.10, 0.30)).toFixed(4);
      }
      const existentialUncertainty = +(1 - civicSerenity).toFixed(4);
      const lessUncertainThanOtherCities = existentialUncertainty < OTHER_CITIES_UNCERTAINTY;

      let phaseLabel;
      if (overloaded) {
        phaseLabel = 'Overloaded Hemp Warning';
      } else if (hungCount === 0) {
        phaseLabel = 'Bare Spider-Web Span';
      } else if (hungCount <= 9) {
        phaseLabel = 'Measured Downward Settlement';
      } else {
        phaseLabel = 'Full Pendant Equilibrium — Finite & Serene';
      }

      return {
        stones: stonesSnapshot,
        hungCount: hungCount,
        totalStoneCatalog: 14,
        totalMassKg: totalMassKg,
        extraBallastKg: extraBallastKg,
        maxSafeLoadKg: MAX_SAFE_LOAD_KG,
        netLoadRatio: netLoadRatio,
        overloaded: overloaded,
        netFiniteLifespanKnown: true,
        fullSpanLifespanYears: FULL_SPAN_LIFESPAN_YEARS,
        knownSpanLifespanYears: knownSpanLifespanYears,
        elapsedYears: +elapsedYears.toFixed(1),
        civicSerenity: civicSerenity,
        existentialUncertainty: existentialUncertainty,
        otherCitiesUncertainty: OTHER_CITIES_UNCERTAINTY,
        lessUncertainThanOtherCities: lessUncertainThanOtherCities,
        upwardAttemptsCount: upwardAttemptsCount,
        upwardToppledCount: upwardToppledCount,
        standingUpwardStructures: 0,
        activeFallDebrisCount: activeFallDebris.length,
        activeStoneId: activeStoneId,
        phaseLabel: phaseLabel
      };
    }

    function emitChange(reason) {
      const snapshot = getState();
      if (onChange) onChange(snapshot, reason);
      return snapshot;
    }
    function getHookLoads() {
      let hungCount = 0;
      for (let i = 0; i < runtimeStones.length; i += 1) {
        if (runtimeStones[i].isHung) hungCount += 1;
      }
      const perHungExtra = hungCount > 0 ? extraBallastKg / hungCount : 0;
      const perHookFallback = hungCount === 0 && extraBallastKg > 0 ? extraBallastKg / 14 : 0;
      return DOWNWARD_STONES.map(function (spec, i) {
        const isHung = runtimeStones[i].isHung;
        const mass = isHung ? +(spec.massKg + perHungExtra).toFixed(2) : +perHookFallback.toFixed(2);
        return {
          hookIndex: spec.hookIndex,
          stoneId: spec.id,
          isHung: isHung,
          massKg: mass
        };
      });
    }

    function hangStone(idOrIndex) {
      let idx = -1;
      if (idOrIndex === undefined || idOrIndex === null) {
        for (let i = 0; i < runtimeStones.length; i += 1) {
          if (!runtimeStones[i].isHung) {
            idx = i;
            break;
          }
        }
      } else {
        idx = resolveStoneIndex(idOrIndex);
      }
      if (idx < 0) return getState();
      const st = runtimeStones[idx];
      st.isHung = true;
      st.deployScale = reducedMotion ? 1 : 0.42;
      if (!reducedMotion) {
        st.omega += (idx % 2 === 0 ? 1 : -1) * 0.42;
      }
      activeStoneId = DOWNWARD_STONES[idx].id;
      syncStoneGeometry(null, lastWidth, lastHeight);
      return emitChange('hangStone');
    }

    function unhangStone(idOrIndex) {
      const idx = resolveStoneIndex(idOrIndex);
      if (idx < 0) return getState();
      const st = runtimeStones[idx];
      st.isHung = false;
      st.theta = 0;
      st.omega = 0;
      if (activeStoneId === DOWNWARD_STONES[idx].id) {
        activeStoneId = null;
        for (let i = 0; i < runtimeStones.length; i += 1) {
          if (runtimeStones[i].isHung) {
            activeStoneId = DOWNWARD_STONES[i].id;
            break;
          }
        }
      }
      return emitChange('unhangStone');
    }

    function toggleStone(idOrIndex) {
      const idx = resolveStoneIndex(idOrIndex);
      if (idx < 0) return getState();
      return runtimeStones[idx].isHung ? unhangStone(idx) : hangStone(idx);
    }

    function hangAllStones() {
      extraBallastKg = 0;
      for (let i = 0; i < runtimeStones.length; i += 1) {
        const st = runtimeStones[i];
        if (!st.isHung && !reducedMotion) {
          st.deployScale = 0.55;
          st.omega = (i % 2 === 0 ? 1 : -1) * 0.28;
        }
        st.isHung = true;
      }
      activeStoneId = 'abyss_chandeliers';
      syncStoneGeometry(null, lastWidth, lastHeight);
      return emitChange('hangAllStones');
    }

    function clearAllStones() {
      extraBallastKg = 0;
      showerDrops = [];
      for (let i = 0; i < runtimeStones.length; i += 1) {
        runtimeStones[i].isHung = false;
        runtimeStones[i].theta = 0;
        runtimeStones[i].omega = 0;
      }
      activeStoneId = null;
      return emitChange('clearAllStones');
    }

    function attemptUpwardBuild(hookIndexOptional = 6) {
      const parsed = Number.isInteger(hookIndexOptional) ? hookIndexOptional : 6;
      const hIdx = clamp(parsed, 0, 13);
      upwardAttemptsCount += 1;
      upwardToppledCount += 1;
      const anc = runtimeStones[hIdx];
      const baseX = anc.anchorX || (0.17 + (hIdx / 13) * 0.66) * lastWidth;
      const baseY = anc.anchorY || 0.34 * lastHeight;
      const fallDir = (upwardAttemptsCount + hIdx) % 2 === 0 ? 1 : -1;

      for (let b = 0; b < 7; b += 1) {
        const courseOffset = 10 + b * 10.5;
        activeFallDebris.push({
          hookIndex: hIdx,
          baseX: baseX,
          baseY: baseY,
          courseOffset: courseOffset,
          x: baseX,
          y: baseY - courseOffset,
          vx: 0,
          vy: 0,
          rot: 0,
          vRot: fallDir * (1.9 + b * 0.42),
          tiltRad: 0.09 * fallDir,
          tiltVel: 2.35 * fallDir,
          fallDir: fallDir,
          stage: 'tilting',
          age: 0,
          w: b === 6 ? 15 : 23 - b * 1.3,
          h: b === 6 ? 12 : 9.5,
          isTimber: b === 2 || b === 5
        });
      }

      const result = {
        accepted: false,
        toppled: true,
        hookIndex: hIdx,
        reason: 'inverted_center_of_gravity_above_catenary',
        upwardAttemptsCount: upwardAttemptsCount,
        upwardToppledCount: upwardToppledCount,
        standingUpwardStructures: 0
      };
      if (onUpwardCollapse) onUpwardCollapse(result);
      emitChange('attemptUpwardBuild');
      return result;
    }

    function advanceSpanWear(yearsDelta = 3) {
      const d = Number.isFinite(Number(yearsDelta)) ? Math.max(0, Number(yearsDelta)) : 3;
      elapsedYears = clamp(elapsedYears + d, 0, 40.5);
      return emitChange('advanceSpanWear');
    }

    function renewHempStrands() {
      elapsedYears = 0;
      extraBallastKg = 0;
      return emitChange('renewHempStrands');
    }

    function addOverloadBallast(extraKg = 140) {
      const add = Number.isFinite(Number(extraKg)) ? Math.max(1, Number(extraKg)) : 140;
      extraBallastKg = +(extraBallastKg + add).toFixed(1);
      return emitChange('addOverloadBallast');
    }

    function shedOverloadBallast() {
      extraBallastKg = 0;
      return emitChange('shedOverloadBallast');
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      if (reducedMotion) {
        for (let i = 0; i < runtimeStones.length; i += 1) {
          runtimeStones[i].omega = 0;
          runtimeStones[i].deployScale = 1;
        }
      }
      return getState();
    }

    function reset() {
      applyStarterDefaults();
      return emitChange('reset');
    }
    function inspectAt(px, py, hookPoints) {
      if (Array.isArray(hookPoints) && hookPoints.length > 0) {
        syncStoneGeometry(hookPoints, lastWidth, lastHeight);
      }
      let bestIdx = -1;
      let bestDist = 32.001;
      for (let i = 0; i < runtimeStones.length; i += 1) {
        const st = runtimeStones[i];
        if (!st.isHung) continue;
        let d = Math.hypot(px - st.x, py - st.y);
        const cordD = pointToSegmentDist(px, py, st.anchorX, st.anchorY, st.x, st.y);
        if (cordD <= 15 && cordD + 8 < d) d = cordD + 8;
        if (i === 11 && cableCarWorldX > 0) {
          const carD = Math.hypot(px - cableCarWorldX, py - cableCarWorldY);
          if (carD < d) d = carD;
        }
        if (d <= 32 && d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      }
      if (bestIdx < 0) return null;
      const spec = DOWNWARD_STONES[bestIdx];
      const hit = runtimeStones[bestIdx];
      return {
        kind: 'pendant_stone', index: spec.index, id: spec.id, name: spec.name,
        category: spec.category, isHung: hit.isHung, massKg: spec.massKg,
        cordLengthPx: spec.cordLengthPx, swayDeg: +(hit.theta * 180 / Math.PI).toFixed(2),
        stoneInscription: spec.stoneInscription, x: +hit.x.toFixed(1), y: +hit.y.toFixed(1)
      };
    }

    function step(dtSec, hookPoints, env = {}) {
      const dt = clamp(Number(dtSec) || 0.016, 0, 0.05);
      const windKnots = Number.isFinite(env.windKnots) ? env.windKnots : 9;
      const w = env.width > 0 ? env.width : lastWidth;
      const h = env.height > 0 ? env.height : lastHeight;
      lastWidth = w;
      lastHeight = h;
      if (!reducedMotion) simTime += dt;
      const cScale = computeCordScale(w, h);

      for (let i = 0; i < DOWNWARD_STONES.length; i += 1) {
        const spec = DOWNWARD_STONES[i];
        const st = runtimeStones[i];
        const anc = resolveHookAnchor(spec.hookIndex, hookPoints, w, h);
        const axAccel = dt > 0.0005 ? (anc.vx - st.prevVx) / dt : 0;
        st.prevVx = anc.vx;
        st.anchorX = anc.x;
        st.anchorY = anc.y;
        if (!st.isHung) continue;

        if (reducedMotion) {
          st.deployScale = 1;
          st.omega = 0;
          st.theta = clamp(windKnots * 0.0042 * (26 / (spec.massKg + 18)), -0.22, 0.22);
        } else {
          st.deployScale += (1 - st.deployScale) * Math.min(1, dt * 7.5);
          const effLen = Math.max(48, spec.cordLengthPx * cScale);
          const gust = Math.sin(simTime * 1.65 + st.phaseSeed) * 0.38 + Math.sin(simTime * 3.1 + i) * 0.16;
          const windPush = (windKnots * 0.016 + gust * windKnots * 0.009) * (28 / (spec.massKg + 16));
          const grav = -(320 / effLen) * Math.sin(st.theta);
          const hookCouple = clamp(-axAccel * 0.0018, -1.8, 1.8) * Math.cos(st.theta);
          st.omega += (grav + windPush + hookCouple) * dt;
          st.omega *= Math.exp(-1.55 * dt);
          st.theta = clamp(st.theta + st.omega * dt, -0.62, 0.62);
        }
        const len = spec.cordLengthPx * cScale * st.deployScale;
        st.x = anc.x + Math.sin(st.theta) * len;
        st.y = Math.min(h - 30, anc.y + Math.cos(st.theta) * len);
      }

      if (!reducedMotion && runtimeStones[11].isHung) {
        cableCarT += cableCarDir * dt * 0.14;
        if (cableCarT >= 0.92) { cableCarT = 0.92; cableCarDir = -1; }
        if (cableCarT <= 0.08) { cableCarT = 0.08; cableCarDir = 1; }
      }
      if (runtimeStones[9].isHung && !reducedMotion) {
        if (showerDrops.length < 22) {
          showerDrops.push({
            x: runtimeStones[9].x + ( (showerDrops.length % 5) - 2 ) * 3.2,
            y: runtimeStones[9].y + 8,
            vy: 68 + (showerDrops.length % 4) * 14,
            age: 0
          });
        }
        for (let k = showerDrops.length - 1; k >= 0; k -= 1) {
          const dr = showerDrops[k];
          dr.age += dt;
          dr.y += dr.vy * dt;
          dr.x += windKnots * 0.35 * dt;
          if (dr.age > 1.25 || dr.y > h - 18) showerDrops.splice(k, 1);
        }
      } else if (!runtimeStones[9].isHung) {
        showerDrops.length = 0;
      }

      for (let dIdx = activeFallDebris.length - 1; dIdx >= 0; dIdx -= 1) {
        const d = activeFallDebris[dIdx];
        d.age += dt;
        if (d.stage === 'tilting') {
          const liveAnc = resolveHookAnchor(d.hookIndex, hookPoints, w, h);
          d.baseX = liveAnc.x;
          d.baseY = liveAnc.y;
          d.tiltVel += d.fallDir * 8.4 * Math.max(0.25, Math.abs(Math.sin(d.tiltRad))) * dt;
          d.tiltRad += d.tiltVel * dt;
          d.x = d.baseX + Math.sin(d.tiltRad) * d.courseOffset;
          d.y = d.baseY - Math.cos(d.tiltRad) * d.courseOffset;
          d.rot = d.tiltRad;
          if (Math.abs(d.tiltRad) >= 1.62) {
            d.stage = 'plummeting';
            d.vx = d.fallDir * (26 + d.courseOffset * 0.55);
            d.vy = 48 + d.courseOffset * 0.65;
          }
        } else {
          d.vy += 590 * dt;
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          if (!reducedMotion) d.rot += d.vRot * dt;
        }
        if (d.y > h + 90 || d.age > 3.6) activeFallDebris.splice(dIdx, 1);
      }
    }

    function drawCord(ctx, ax, ay, bx, by, cordType, overloaded) {
      ctx.save();
      ctx.beginPath();
      if (cordType === 'chain') {
        const steps = Math.max(5, Math.floor(Math.hypot(bx - ax, by - ay) / 9));
        ctx.strokeStyle = overloaded ? PALETTE.frayCrimson : PALETTE.chainIron;
        ctx.lineWidth = 2.1;
        for (let s = 0; s < steps; s += 1) {
          const mx = ax + (bx - ax) * ((s + 0.5) / steps);
          const my = ay + (by - ay) * ((s + 0.5) / steps);
          ctx.moveTo(mx + 2.2, my);
          ctx.arc(mx, my, 2.2, 0, Math.PI * 2);
        }
        ctx.stroke();
      } else {
        ctx.strokeStyle = overloaded ? PALETTE.frayCrimson :
          (cordType === 'cable' ? PALETTE.graniteHighlight :
          (cordType === 'string' ? PALETTE.linenLight : PALETTE.hempOchre));
        ctx.lineWidth = cordType === 'string' ? 1.1 : (cordType === 'cable' ? 1.6 : 2.2);
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
      ctx.restore();
    }
    function drawStoneBody(ctx, idx, st) {
      const p = simTime + st.phaseSeed;
      ctx.save();
      ctx.translate(st.x, st.y);
      ctx.rotate(st.theta * 0.65);

      if (idx === 0) {
        const tailSway = reducedMotion ? 2 : Math.sin(p * 2.1) * 6;
        ctx.strokeStyle = PALETTE.hempOchre;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-6, -4); ctx.quadraticCurveTo(-6 + tailSway * 0.4, 24, -6 + tailSway, 52);
        ctx.moveTo(6, -4); ctx.quadraticCurveTo(6 + tailSway * 0.4, 24, 6 + tailSway, 52);
        for (let r = 0; r < 7; r += 1) {
          const ry = r * 7.5;
          const rx = tailSway * (r / 7) * 0.85;
          ctx.moveTo(-6 + rx, ry); ctx.lineTo(6 + rx, ry);
        }
        ctx.stroke();
      } else if (idx === 1) {
        ctx.fillStyle = PALETTE.canvasSack;
        ctx.strokeStyle = PALETTE.hempTaupe;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.quadraticCurveTo(18, -2, 14, 16);
        ctx.quadraticCurveTo(0, 26, -14, 16);
        ctx.quadraticCurveTo(-18, -2, 0, -14);
        ctx.closePath();
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = PALETTE.lanternAmber;
        ctx.fillRect(-5, 1, 10, 6);
      } else if (idx === 2) {
        ctx.strokeStyle = PALETTE.cedarWarm;
        ctx.lineWidth = 2.6;
        ctx.beginPath(); ctx.moveTo(-20, 0); ctx.lineTo(20, 0); ctx.stroke();
        const tints = [PALETTE.linenLight, PALETTE.hempOchre, PALETTE.abyssMist, PALETTE.terracotta];
        for (let c = 0; c < 4; c += 1) {
          const cx = -14 + c * 9;
          const flap = reducedMotion ? 2 : Math.sin(p * 3.4 + c) * 4.5;
          ctx.fillStyle = tints[c];
          ctx.beginPath();
          ctx.moveTo(cx - 3, 1); ctx.lineTo(cx + 3, 1);
          ctx.lineTo(cx + 4 + flap, 16); ctx.lineTo(cx - 3 + flap, 15);
          ctx.closePath(); ctx.fill();
        }
      } else if (idx === 3) {
        ctx.fillStyle = PALETTE.cedarHull;
        ctx.strokeStyle = PALETTE.hempOchre;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-24, -4); ctx.quadraticCurveTo(0, 14, 24, -4);
        ctx.lineTo(18, 4); ctx.quadraticCurveTo(0, 18, -18, 4);
        ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = PALETTE.cedarWarm;
        ctx.beginPath();
        ctx.moveTo(-18, -4); ctx.lineTo(-18, -11); ctx.lineTo(18, -11); ctx.lineTo(18, -4);
        ctx.stroke();
        ctx.fillStyle = PALETTE.lanternAmber;
        ctx.beginPath(); ctx.arc(21, -7, 2.8, 0, Math.PI * 2); ctx.fill();
      } else if (idx === 4) {
        const offsets = [-8, 0, 8];
        for (let k = 0; k < 3; k += 1) {
          ctx.fillStyle = k === 1 ? PALETTE.cedarHull : PALETTE.graniteShadow;
          ctx.strokeStyle = PALETTE.hempOchre;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(offsets[k], 8 + (k % 2) * 4, 6.5, 0, Math.PI * 2);
          ctx.fill(); ctx.stroke();
        }
      } else if (idx === 5) {
        const flick = reducedMotion ? 1 : 0.85 + Math.sin(p * 9.5) * 0.22;
        ctx.strokeStyle = PALETTE.hempOchre;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, -8); ctx.lineTo(0, 4);
        ctx.moveTo(-9, 4); ctx.lineTo(9, 4);
        ctx.stroke();
        ctx.fillStyle = PALETTE.gasGlow;
        ctx.beginPath();
        ctx.arc(-9, -1, 4.2 * flick, 0, Math.PI * 2);
        ctx.arc(9, -1, 4.2 * flick, 0, Math.PI * 2);
        ctx.fill();
      } else if (idx === 6) {
        ctx.fillStyle = PALETTE.chainIron;
        ctx.beginPath(); ctx.arc(0, 8, 12, 0, Math.PI); ctx.fill();
        ctx.fillStyle = PALETTE.frayCrimson;
        ctx.fillRect(-8, 6, 16, 3);
        ctx.strokeStyle = PALETTE.graniteHighlight;
        ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-13, 0); ctx.lineTo(13, 0); ctx.stroke();
        ctx.fillStyle = PALETTE.cedarWarm;
        ctx.beginPath(); ctx.arc(0, 0, 4.5, 0, Math.PI * 2); ctx.fill();
      } else if (idx === 7) {
        const payOut = reducedMotion ? 12 : 12 + Math.sin(p * 1.9) * 10;
        ctx.strokeStyle = PALETTE.linenLight;
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(0, -4); ctx.lineTo(0, payOut); ctx.stroke();
        ctx.fillStyle = PALETTE.hempOchre;
        ctx.fillRect(-7, payOut, 14, 10);
        ctx.fillStyle = PALETTE.linenLight;
        ctx.fillRect(-5, payOut - 3, 10, 3);
      } else if (idx === 8) {
        const shutY = reducedMotion ? 6 : Math.sin(p * 1.5) * 15;
        ctx.strokeStyle = PALETTE.graniteHighlight;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-8, -18); ctx.lineTo(-8, 24);
        ctx.moveTo(8, -18); ctx.lineTo(8, 24);
        ctx.stroke();
        ctx.fillStyle = PALETTE.cedarWarm;
        ctx.fillRect(-7, shutY - 7, 11, 14);
        ctx.fillStyle = PALETTE.chainIron;
        ctx.fillRect(5, -shutY - 5, 4, 10);
      } else if (idx === 9) {
        ctx.fillStyle = PALETTE.copperRose;
        ctx.beginPath();
        ctx.moveTo(0, -6); ctx.lineTo(10, 4); ctx.lineTo(-10, 4);
        ctx.closePath(); ctx.fill();
        if (reducedMotion) {
          ctx.fillStyle = PALETTE.abyssMist;
          for (let d = 1; d <= 4; d += 1) {
            ctx.fillRect(-5 + (d % 3) * 5, 6 + d * 8, 1.8, 4);
          }
        }
      } else if (idx === 10) {
        const sw = reducedMotion ? 0.18 : Math.sin(p * 2.5) * 0.44;
        ctx.strokeStyle = PALETTE.cedarWarm;
        ctx.lineWidth = 2.4;
        ctx.beginPath(); ctx.moveTo(-14, 0); ctx.lineTo(14, 0); ctx.stroke();
        ctx.strokeStyle = PALETTE.hempOchre;
        ctx.lineWidth = 1.4;
        const rx = Math.sin(sw) * 18;
        const ry = Math.cos(sw) * 18;
        ctx.beginPath();
        ctx.moveTo(-7, 0); ctx.lineTo(-7 + rx, ry);
        ctx.moveTo(7, 0); ctx.lineTo(7 + rx, ry);
        ctx.arc(-7 + rx, ry + 3, 3, 0, Math.PI * 2);
        ctx.arc(7 + rx, ry + 3, 3, 0, Math.PI * 2);
        ctx.stroke();
      } else if (idx === 11) {
        ctx.fillStyle = PALETTE.chainIron;
        ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI * 2); ctx.fill();
      } else if (idx === 12) {
        ctx.strokeStyle = PALETTE.chainIron;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-16, 4); ctx.lineTo(16, 4);
        ctx.moveTo(-10, 12); ctx.lineTo(10, 12);
        ctx.stroke();
        ctx.fillStyle = PALETTE.gasGlow;
        for (let c = -2; c <= 2; c += 1) {
          ctx.beginPath(); ctx.arc(c * 7, 1, 2.4, 0, Math.PI * 2); ctx.fill();
        }
      } else if (idx === 13) {
        ctx.fillStyle = PALETTE.terracotta;
        ctx.beginPath();
        ctx.moveTo(-9, -3); ctx.lineTo(9, -3); ctx.lineTo(6, 10); ctx.lineTo(-6, 10);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = PALETTE.trailingIvy;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let v = -2; v <= 2; v += 1) {
          const sway = reducedMotion ? v * 1.5 : Math.sin(p * 2.0 + v) * 5;
          ctx.moveTo(v * 3, 8);
          ctx.quadraticCurveTo(v * 4 + sway, 24, v * 3 - sway * 0.6, 42 + Math.abs(v) * 4);
        }
        ctx.stroke();
      }
      ctx.restore();
    }
    function renderPendants(ctx, width, height, hookPoints, env = {}) {
      if (!ctx) return;
      const w = width > 0 ? width : lastWidth;
      const h = height > 0 ? height : lastHeight;
      lastWidth = w;
      lastHeight = h;
      syncStoneGeometry(hookPoints, w, h);

      let hungMass = 0;
      let sumMx = 0;
      let sumMy = 0;
      let sumAy = 0;
      let hungN = 0;
      for (let i = 0; i < DOWNWARD_STONES.length; i += 1) {
        if (runtimeStones[i].isHung) {
          const m = DOWNWARD_STONES[i].massKg;
          hungMass += m;
          sumMx += runtimeStones[i].x * m;
          sumMy += runtimeStones[i].y * m;
          sumAy += runtimeStones[i].anchorY;
          hungN += 1;
        }
      }
      const overloaded = hungMass + extraBallastKg > MAX_SAFE_LOAD_KG;

      if (hungN > 0 && hungMass > 0) {
        const cgX = sumMx / hungMass;
        const cgY = sumMy / hungMass;
        const topY = sumAy / hungN;
        ctx.save();
        ctx.strokeStyle = overloaded ? PALETTE.frayCrimson : 'rgba(242, 184, 75, 0.34)';
        ctx.fillStyle = overloaded ? PALETTE.frayCrimson : 'rgba(242, 184, 75, 0.62)';
        ctx.lineWidth = 1;
        if (ctx.setLineDash) ctx.setLineDash([3, 4]);
        ctx.beginPath();
        ctx.moveTo(cgX, topY);
        ctx.lineTo(cgX, cgY + 14);
        ctx.stroke();
        if (ctx.setLineDash) ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(cgX, cgY + 9);
        ctx.lineTo(cgX + 4.5, cgY + 15);
        ctx.lineTo(cgX, cgY + 21);
        ctx.lineTo(cgX - 4.5, cgY + 15);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      if (runtimeStones[11].isHung) {
        const p3 = runtimeStones[3].isHung
          ? { x: runtimeStones[3].x, y: runtimeStones[3].y - 10 }
          : resolveHookAnchor(3, hookPoints, w, h);
        const p11 = { x: runtimeStones[11].x, y: runtimeStones[11].y };
        const midX = (p3.x + p11.x) * 0.5;
        const midY = (p3.y + p11.y) * 0.5 + 22;
        const t = cableCarT;
        const omt = 1 - t;
        cableCarWorldX = omt * omt * p3.x + 2 * omt * t * midX + t * t * p11.x;
        cableCarWorldY = omt * omt * p3.y + 2 * omt * t * midY + t * t * p11.y;

        ctx.save();
        ctx.strokeStyle = PALETTE.graniteHighlight;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p3.x, p3.y);
        ctx.quadraticCurveTo(midX, midY, p11.x, p11.y);
        ctx.stroke();

        ctx.translate(cableCarWorldX, cableCarWorldY);
        ctx.fillStyle = PALETTE.chainIron;
        ctx.beginPath(); ctx.arc(0, -1, 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = PALETTE.hempOchre;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 8); ctx.stroke();
        ctx.fillStyle = PALETTE.cedarWarm;
        ctx.fillRect(-11, 8, 22, 13);
        ctx.fillStyle = PALETTE.lanternAmber;
        ctx.fillRect(-7, 10, 5, 5);
        ctx.fillRect(2, 10, 5, 5);
        ctx.restore();
      } else {
        cableCarWorldX = 0;
        cableCarWorldY = 0;
      }

      for (let i = 0; i < DOWNWARD_STONES.length; i += 1) {
        const spec = DOWNWARD_STONES[i];
        const st = runtimeStones[i];
        if (!st.isHung) continue;
        drawCord(ctx, st.anchorX, st.anchorY, st.x, st.y, spec.cordType, overloaded);
        if (spec.id === activeStoneId) {
          ctx.save();
          ctx.strokeStyle = 'rgba(242, 184, 75, 0.55)';
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(st.x, st.y + 6, 22, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        drawStoneBody(ctx, i, st);
      }

      if (showerDrops.length > 0) {
        ctx.save();
        ctx.fillStyle = PALETTE.abyssMist;
        for (let k = 0; k < showerDrops.length; k += 1) {
          const dr = showerDrops[k];
          ctx.fillRect(dr.x - 0.8, dr.y, 1.6, 4.2);
        }
        ctx.restore();
      }

      if (activeFallDebris.length > 0) {
        ctx.save();
        for (let dIdx = 0; dIdx < activeFallDebris.length; dIdx += 1) {
          const d = activeFallDebris[dIdx];
          ctx.save();
          ctx.translate(d.x, d.y);
          ctx.rotate(d.rot);
          ctx.fillStyle = d.isTimber ? PALETTE.cedarWarm : PALETTE.graniteCrest;
          ctx.strokeStyle = d.stage === 'tilting' ? PALETTE.frayCrimson : PALETTE.graniteHighlight;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.rect(-d.w * 0.5, -d.h * 0.5, d.w, d.h);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore();
      }
    }

    return {
      DOWNWARD_STONES: DOWNWARD_STONES,
      hangStone: hangStone,
      hangNextStone: function () { return hangStone(); },
      unhangStone: unhangStone,
      toggleStone: toggleStone,
      hangAllStones: hangAllStones,
      clearAllStones: clearAllStones,
      attemptUpwardBuild: attemptUpwardBuild,
      advanceSpanWear: advanceSpanWear,
      renewHempStrands: renewHempStrands,
      addOverloadBallast: addOverloadBallast,
      shedOverloadBallast: shedOverloadBallast,
      getHookLoads: getHookLoads,
      inspectAt: inspectAt,
      step: step,
      renderPendants: renderPendants,
      getState: getState,
      setReducedMotion: setReducedMotion,
      reset: reset
    };
  }

  const OctaviaPendantLife = Object.freeze({
    PALETTE: PALETTE,
    DOWNWARD_STONES: DOWNWARD_STONES,
    createPendantSystem: createPendantSystem
  });

  globalThis.OctaviaPendantLife = OctaviaPendantLife;
  if (typeof window !== 'undefined') {
    window.OctaviaPendantLife = OctaviaPendantLife;
  }
  if (typeof module === 'object' && module && module.exports) {
    module.exports = OctaviaPendantLife;
  }
})();
