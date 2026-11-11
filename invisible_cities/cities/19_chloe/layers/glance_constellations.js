(function (root) {
  "use strict";

  const MAX_LOCK_DURATION_SEC = 1.0;

  const PALETTE = Object.freeze({
    slateAbyss: "#0d1218",
    slateRain: "#1b2532",
    wetFlagstone: "#283646",
    arcadeAshlar: "#46586c",
    rainMist: "#7d93a8",
    pearlVeil: "#ebe9e4",
    silkBlush: "#f3b8ad",
    coralSilk: "#e85d56",
    electricAmber: "#ffb338",
    prosaicLead: "#525860"
  });

  const REVERIE_MODES = Object.freeze([
    Object.freeze({
      id: "meetings",
      label: "Clandestine Meetings",
      glyph: "◈",
      hue: "#ebe9e4",
      fragment: "A secret stair behind wet cisterns, neither ever learning a name"
    }),
    Object.freeze({
      id: "conversations",
      label: "Unspoken Conversations",
      glyph: "⇌",
      hue: "#7d93a8",
      fragment: "A lifetime confessed in a half-second glance and carried onward"
    }),
    Object.freeze({
      id: "surprises",
      label: "Sudden Surprises",
      glyph: "✦",
      hue: "#ffb338",
      fragment: "An unmasked tremor beneath the dark portico arch"
    }),
    Object.freeze({
      id: "caresses",
      label: "Phantom Caresses",
      glyph: "≈",
      hue: "#f3b8ad",
      fragment: "Imagined fingers grazing rain-cooled coral silk without pausing"
    }),
    Object.freeze({
      id: "bites",
      label: "Fierce Bites",
      glyph: "⚡",
      hue: "#e85d56",
      fragment: "A sudden electric bite imagined in total chaste silence"
    })
  ]);

  const PROSAIC_ENTANGLEMENTS = Object.freeze([
    "pursuits",
    "pretenses",
    "misunderstandings",
    "clashes",
    "oppressions"
  ]);

  const FALLBACK_STRANGERS = [
    { index: 0, id: "girl_twirling_parasol", label: "Girl Twirling a Parasol", shortName: "Parasol Girl", eyeX: 165, eyeY: 420, x: 165, y: 455, feetY: 525, primaryHue: "#e85d56", accentHue: "#ebe9e4" },
    { index: 1, id: "veiled_woman_in_black", label: "Woman in Black with Veil", shortName: "Veiled Woman", eyeX: 275, eyeY: 432, x: 275, y: 468, feetY: 538, primaryHue: "#0d1218", accentHue: "#ebe9e4" },
    { index: 2, id: "tattooed_giant", label: "Tattooed Giant", shortName: "Tattooed Giant", eyeX: 390, eyeY: 392, x: 390, y: 442, feetY: 530, primaryHue: "#46586c", accentHue: "#ffb338" },
    { index: 3, id: "white_haired_young_man", label: "Young Man with White Hair", shortName: "White-Haired Youth", eyeX: 500, eyeY: 418, x: 500, y: 458, feetY: 534, primaryHue: "#ebe9e4", accentHue: "#7d93a8" },
    { index: 4, id: "female_dwarf", label: "Female Dwarf", shortName: "Female Dwarf", eyeX: 595, eyeY: 462, x: 595, y: 486, feetY: 542, primaryHue: "#ffb338", accentHue: "#e85d56" },
    { index: 5, id: "coral_twin_girls", label: "Two Twin Girls Dressed in Coral", shortName: "Coral Twins", eyeX: 700, eyeY: 426, x: 700, y: 464, feetY: 536, primaryHue: "#e85d56", accentHue: "#f3b8ad" },
    { index: 6, id: "blind_man_with_cheetah", label: "Blind Man with a Cheetah on a Chain", shortName: "Blind Man & Cheetah", eyeX: 810, eyeY: 414, x: 810, y: 456, feetY: 535, primaryHue: "#ffb338", accentHue: "#ebe9e4" },
    { index: 7, id: "courtesan_with_fan", label: "Courtesan with a Fan", shortName: "Courtesan", eyeX: 915, eyeY: 428, x: 915, y: 466, feetY: 540, primaryHue: "#f3b8ad", accentHue: "#e85d56" },
    { index: 8, id: "sleeping_ephebe", label: "Sleeping Ephebe", shortName: "Sleeping Ephebe", eyeX: 1020, eyeY: 438, x: 1020, y: 472, feetY: 532, primaryHue: "#7d93a8", accentHue: "#ebe9e4" },
    { index: 9, id: "fat_woman", label: "The Fat Woman", shortName: "Fat Woman", eyeX: 1120, eyeY: 422, x: 1120, y: 466, feetY: 542, primaryHue: "#ebe9e4", accentHue: "#ffb338" }
  ];

  const REVERIE_BY_ID = Object.create(null);
  for (let i = 0; i < REVERIE_MODES.length; i++) {
    REVERIE_BY_ID[REVERIE_MODES[i].id] = REVERIE_MODES[i];
  }

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function hypot2(ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function pointToSegDist(px, py, ax, ay, bx, by) {
    const vx = bx - ax;
    const vy = by - ay;
    const lenSq = vx * vx + vy * vy;
    if (lenSq < 1e-6) return hypot2(px, py, ax, ay);
    const t = clamp(((px - ax) * vx + (py - ay) * vy) / lenSq, 0, 1);
    return hypot2(px, py, ax + t * vx, ay + t * vy);
  }

  function hexToRgba(hex, alpha) {
    const a = clamp(alpha, 0, 1);
    if (typeof hex !== "string" || hex.length < 7 || hex[0] !== "#") {
      return "rgba(235, 233, 228, " + a.toFixed(3) + ")";
    }
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return "rgba(" + r + ", " + g + ", " + b + ", " + a.toFixed(3) + ")";
  }

  function makePairKey(idA, idB) {
    return idA < idB ? idA + "::" + idB : idB + "::" + idA;
  }

  function safeInvoke(fn, arg1, arg2, arg3) {
    if (typeof fn !== "function") return;
    try {
      fn(arg1, arg2, arg3);
    } catch (_) {
      /* callback error isolated */
    }
  }

  function orderCyclicByAngle(points) {
    if (points.length <= 2) return points.slice();
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < points.length; i++) {
      cx += points[i].ex;
      cy += points[i].ey;
    }
    cx /= points.length;
    cy /= points.length;
    return points
      .slice()
      .sort(function (a, b) {
        const angA = Math.atan2(a.ey - cy, a.ex - cx);
        const angB = Math.atan2(b.ey - cy, b.ex - cx);
        if (Math.abs(angA - angB) > 1e-4) return angA - angB;
        return a.ex - b.ex;
      });
  }

  function createConstellationEngine(opts) {
    const cfg = opts || {};
    const onEyeLock = cfg.onEyeLock || null;
    const onShapeFormed = cfg.onShapeFormed || null;
    const onCollapse = cfg.onCollapse || null;
    const onReset = cfg.onReset || null;

    let strangersCache = Array.isArray(cfg.strangers) && cfg.strangers.length >= 2
      ? cfg.strangers
      : FALLBACK_STRANGERS.slice();

    let chasteState = "chaste";
    let carouselRunning = true;
    let voluptuousVibration = 0.78;
    let maxObservedLockSec = 0.34;
    let combinationsWoven = 0;
    let greetingsExchanged = 0;
    let consummationCount = 0;
    let consummatedPair = null;
    let collapsedStory = null;
    let focusedReverieId = null;
    let rainIntensity = 0.72;
    let clockSec = 0;
    let uidSeq = 0;
    let reverieCursor = 0;
    let rngState = 0x51f15e2d;

    let activeArrows = [];
    let activeTriangles = [];
    let activeStars = [];
    let phantomEchoes = [];
    let shatterShards = [];
    let lastWhisper = REVERIE_MODES[0].fragment;

    const seenPairs = new Set();
    const recentPairCooldown = Object.create(null);
    const reverieCounts = {
      meetings: 0,
      conversations: 0,
      surprises: 0,
      caresses: 0,
      bites: 0
    };

    function nextRand() {
      rngState = (Math.imul(rngState, 1664525) + 1013904223) >>> 0;
      return rngState / 4294967296;
    }

    function getStrangerMap(list) {
      const src = Array.isArray(list) && list.length > 0 ? list : strangersCache;
      const map = Object.create(null);
      for (let i = 0; i < src.length; i++) {
        const s = src[i];
        if (s && s.id) map[s.id] = s;
      }
      return map;
    }

    function eyePoint(s, fallbackIdx) {
      if (!s) {
        const fb = FALLBACK_STRANGERS[(fallbackIdx || 0) % FALLBACK_STRANGERS.length];
        return { ex: fb.eyeX, ey: fb.eyeY, fx: fb.x, fy: fb.feetY || fb.y + 64 };
      }
      const ex = Number.isFinite(s.eyeX) ? s.eyeX : (Number.isFinite(s.x) ? s.x : 200);
      const ey = Number.isFinite(s.eyeY) ? s.eyeY : (Number.isFinite(s.y) ? s.y - 28 : 420);
      const fx = Number.isFinite(s.x) ? s.x : ex;
      const fy = Number.isFinite(s.feetY) ? s.feetY : (Number.isFinite(s.y) ? s.y + 44 : ey + 96);
      return { ex: ex, ey: ey, fx: fx, fy: fy };
    }

    function pickReverieMode(explicitId) {
      if (explicitId && REVERIE_BY_ID[explicitId]) {
        return REVERIE_BY_ID[explicitId];
      }
      if (focusedReverieId && REVERIE_BY_ID[focusedReverieId]) {
        if (nextRand() < 0.82) return REVERIE_BY_ID[focusedReverieId];
      }
      const mode = REVERIE_MODES[reverieCursor % REVERIE_MODES.length];
      reverieCursor = (reverieCursor + 1) % REVERIE_MODES.length;
      return mode;
    }

    function recordPair(idA, idB) {
      if (!idA || !idB || idA === idB) return;
      const key = makePairKey(idA, idB);
      seenPairs.add(key);
      recentPairCooldown[key] = clockSec;
    }

    function isCurrentlyPaired(idA, idB) {
      for (let i = 0; i < activeArrows.length; i++) {
        const lk = activeArrows[i];
        if ((lk.idA === idA && lk.idB === idB) || (lk.idA === idB && lk.idB === idA)) {
          return true;
        }
      }
      return false;
    }

    function createLockObject(idA, idB, explicitReverieId, initElapsed, fireCb) {
      if (!idA || !idB || idA === idB) return null;
      const sMap = getStrangerMap(strangersCache);
      const stA = sMap[idA] || null;
      const stB = sMap[idB] || null;
      const mode = pickReverieMode(explicitReverieId);
      const dur = clamp(0.72 + nextRand() * 0.28, 0.65, MAX_LOCK_DURATION_SEC);
      const el = clamp(Number.isFinite(initElapsed) ? initElapsed : 0, 0, dur - 0.04);
      if (el > maxObservedLockSec) {
        maxObservedLockSec = Math.min(MAX_LOCK_DURATION_SEC, el);
      }
      const lock = {
        id: "chl_lock_" + (++uidSeq),
        idA: idA,
        idB: idB,
        fromId: idA,
        toId: idB,
        index: stA && Number.isFinite(stA.index) ? stA.index : 0,
        indexA: stA && Number.isFinite(stA.index) ? stA.index : 0,
        indexB: stB && Number.isFinite(stB.index) ? stB.index : 1,
        reverieId: mode.id,
        reverieLabel: mode.label,
        glyph: mode.glyph,
        hue: mode.hue,
        fragment: mode.fragment,
        elapsedSec: el,
        durationSec: dur,
        alpha: 0.92
      };
      activeArrows.push(lock);
      recordPair(idA, idB);
      reverieCounts[mode.id] = (reverieCounts[mode.id] || 0) + 1;
      combinationsWoven += 1;
      lastWhisper = mode.fragment;
      if (fireCb) {
        safeInvoke(onEyeLock, lock, lock.indexA, voluptuousVibration);
      }
      return lock;
    }

    function createTriangleObject(ids3, explicitReverieId, initElapsed, fireCb) {
      if (!Array.isArray(ids3) || ids3.length < 3) return null;
      const uniq = [];
      for (let i = 0; i < ids3.length && uniq.length < 3; i++) {
        if (ids3[i] && uniq.indexOf(ids3[i]) === -1) uniq.push(ids3[i]);
      }
      if (uniq.length < 3) return null;
      const mode = pickReverieMode(explicitReverieId);
      const dur = 1.85 + nextRand() * 0.95;
      const tri = {
        id: "chl_tri_" + (++uidSeq),
        kind: "triangle",
        ids: uniq,
        reverieId: mode.id,
        reverieLabel: mode.label,
        glyph: mode.glyph,
        hue: mode.hue,
        fragment: mode.fragment,
        elapsedSec: clamp(initElapsed || 0, 0, dur * 0.5),
        durationSec: dur,
        alpha: 0.86
      };
      activeTriangles.push(tri);
      recordPair(uniq[0], uniq[1]);
      recordPair(uniq[1], uniq[2]);
      recordPair(uniq[2], uniq[0]);
      reverieCounts[mode.id] = (reverieCounts[mode.id] || 0) + 1;
      combinationsWoven += 1;
      if (fireCb) {
        safeInvoke(onShapeFormed, tri, "triangle", voluptuousVibration);
      }
      return tri;
    }

    function createStarObject(ids5, explicitReverieId, initElapsed, fireCb) {
      if (!Array.isArray(ids5) || ids5.length < 5) return null;
      const sMap = getStrangerMap(strangersCache);
      const pts = [];
      const seen = Object.create(null);
      for (let i = 0; i < ids5.length && pts.length < 5; i++) {
        const id = ids5[i];
        if (!id || seen[id]) continue;
        seen[id] = true;
        const ep = eyePoint(sMap[id], i);
        pts.push({ id: id, ex: ep.ex, ey: ep.ey });
      }
      if (pts.length < 5) return null;
      const ordered = orderCyclicByAngle(pts).map(function (p) { return p.id; });
      const mode = pickReverieMode(explicitReverieId || (nextRand() < 0.5 ? "surprises" : "bites"));
      const dur = 2.6 + nextRand() * 1.3;
      const star = {
        id: "chl_star_" + (++uidSeq),
        kind: "star",
        ids: ordered,
        reverieId: mode.id,
        reverieLabel: mode.label,
        glyph: mode.glyph,
        hue: mode.hue,
        fragment: mode.fragment,
        elapsedSec: clamp(initElapsed || 0, 0, dur * 0.45),
        durationSec: dur,
        alpha: 0.92
      };
      activeStars.push(star);
      for (let i = 0; i < 5; i++) {
        recordPair(ordered[i], ordered[(i + 2) % 5]);
      }
      reverieCounts[mode.id] = (reverieCounts[mode.id] || 0) + 1;
      combinationsWoven += 1;
      if (fireCb) {
        safeInvoke(onShapeFormed, star, "star", voluptuousVibration);
      }
      return star;
    }

    function pickFreshPartner(anchorId, avoidId) {
      let bestId = null;
      let bestScore = -1e9;
      for (let i = 0; i < strangersCache.length; i++) {
        const cand = strangersCache[i];
        if (!cand || !cand.id || cand.id === anchorId) continue;
        let score = nextRand() * 8;
        if (cand.id === avoidId) score -= 50;
        if (isCurrentlyPaired(anchorId, cand.id)) score -= 35;
        const key = makePairKey(anchorId, cand.id);
        if (!seenPairs.has(key)) score += 28;
        const lastT = recentPairCooldown[key];
        if (lastT !== undefined) score -= Math.max(0, 6 - (clockSec - lastT) * 2);
        if (score > bestScore) {
          bestScore = score;
          bestId = cand.id;
        }
      }
      return bestId;
    }

    function pickDistinctStrangerIds(count, requiredFirstId) {
      const out = [];
      const n = strangersCache.length;
      if (n === 0) return out;
      if (requiredFirstId) {
        for (let i = 0; i < n; i++) {
          if (strangersCache[i] && strangersCache[i].id === requiredFirstId) {
            out.push(requiredFirstId);
            break;
          }
        }
      }
      const start = Math.floor(nextRand() * n);
      const stride = n >= 7 ? 3 : 1;
      for (let k = 0; k < n * 2 && out.length < count; k++) {
        const s = strangersCache[(start + k * stride) % n];
        if (s && s.id && out.indexOf(s.id) === -1) out.push(s.id);
      }
      for (let i = 0; i < n && out.length < count; i++) {
        const s = strangersCache[i];
        if (s && s.id && out.indexOf(s.id) === -1) out.push(s.id);
      }
      return out;
    }

    function ensureChasteConstellations(fireCb) {
      if (chasteState !== "chaste") return;
      const n = strangersCache.length;
      if (n < 2) return;
      const targetArrows = Math.min(6, Math.max(4, Math.floor(4 + rainIntensity * 2.2)));
      let guard = 0;
      while (activeArrows.length < targetArrows && guard++ < 16) {
        const sA = strangersCache[(uidSeq + guard) % n];
        if (!sA || !sA.id) continue;
        const idB = pickFreshPartner(sA.id, null);
        if (idB) {
          const initEl = fireCb ? 0 : (activeArrows.length * 0.14) % 0.62;
          createLockObject(sA.id, idB, null, initEl, fireCb);
        }
      }
      if (activeArrows.length > 7) activeArrows.splice(0, activeArrows.length - 7);

      if (n >= 3) {
        while (activeTriangles.length < 2) {
          const seedLock = activeArrows[activeTriangles.length % activeArrows.length];
          const base = seedLock ? [seedLock.idA, seedLock.idB] : [];
          const more = pickDistinctStrangerIds(3, base[0]);
          for (let i = 0; i < more.length && base.length < 3; i++) {
            if (base.indexOf(more[i]) === -1) base.push(more[i]);
          }
          if (!createTriangleObject(base, null, fireCb ? 0 : 0.25, fireCb)) break;
        }
        if (activeTriangles.length > 3) activeTriangles.splice(0, activeTriangles.length - 3);
      }

      if (n >= 5 && activeStars.length < 1) {
        const ids5 = pickDistinctStrangerIds(5, null);
        createStarObject(ids5, null, fireCb ? 0 : 0.3, fireCb);
      }
      if (activeStars.length > 2) activeStars.splice(0, activeStars.length - 2);
    }

    function reconcileRosterIfChanged(strangers) {
      if (!Array.isArray(strangers) || strangers.length < 2) return;
      strangersCache = strangers;
      if (chasteState !== "chaste") return;
      const sMap = getStrangerMap(strangers);
      activeArrows = activeArrows.filter(function (lk) { return !!(sMap[lk.idA] && sMap[lk.idB]); });
      activeTriangles = activeTriangles.filter(function (tr) {
        return tr.ids.every(function (id) { return !!sMap[id]; });
      });
      activeStars = activeStars.filter(function (st) {
        return st.ids.every(function (id) { return !!sMap[id]; });
      });
      ensureChasteConstellations(false);
    }

    function step(dtSec, strangers, stepOpts) {
      const dt = Number.isFinite(dtSec) && dtSec >= 0 ? dtSec : 0.016;
      const sOpts = stepOpts || {};
      if (Number.isFinite(sOpts.rainIntensity)) {
        rainIntensity = clamp(sOpts.rainIntensity, 0.15, 1.0);
      }
      const reducedMotion = !!sOpts.reducedMotion;
      if (Array.isArray(strangers) && strangers.length >= 2) {
        reconcileRosterIfChanged(strangers);
      }
      if (!reducedMotion) clockSec += dt;

      if (chasteState === "chaste") {
        const sMap = getStrangerMap(strangersCache);
        const keptArrows = [];
        const fled = [];
        for (let i = 0; i < activeArrows.length; i++) {
          const lk = activeArrows[i];
          const limitSec = Math.min(MAX_LOCK_DURATION_SEC, lk.durationSec);
          const nextEl = lk.elapsedSec + dt;
          if (nextEl >= limitSec) {
            if (limitSec > maxObservedLockSec) maxObservedLockSec = limitSec;
            if (!reducedMotion && phantomEchoes.length < 10) {
              const pA = eyePoint(sMap[lk.idA], 0);
              const pB = eyePoint(sMap[lk.idB], 1);
              phantomEchoes.push({ x1: pA.ex, y1: pA.ey, x2: pB.ex, y2: pB.ey, hue: lk.hue, age: 0, ttl: 0.44 });
            }
            fled.push({ idA: lk.idA, oldB: lk.idB });
          } else {
            lk.elapsedSec = nextEl;
            if (nextEl > maxObservedLockSec) maxObservedLockSec = Math.min(MAX_LOCK_DURATION_SEC, nextEl);
            const prog = nextEl / limitSec;
            lk.alpha = clamp(0.28 + Math.sin(clamp(prog, 0.08, 0.94) * Math.PI) * 0.72, 0.28, 0.98);
            keptArrows.push(lk);
          }
        }
        activeArrows = keptArrows;
        for (let i = 0; i < fled.length && activeArrows.length < 6; i++) {
          const partner = pickFreshPartner(fled[i].idA, fled[i].oldB);
          if (partner) createLockObject(fled[i].idA, partner, null, 0, true);
        }

        activeTriangles = activeTriangles.filter(function (tr) {
          tr.elapsedSec += dt;
          const p = tr.elapsedSec / tr.durationSec;
          tr.alpha = clamp(0.25 + Math.sin(clamp(p, 0.1, 0.92) * Math.PI) * 0.72, 0.25, 0.95);
          return tr.elapsedSec < tr.durationSec;
        });
        activeStars = activeStars.filter(function (st) {
          st.elapsedSec += dt;
          const p = st.elapsedSec / st.durationSec;
          st.alpha = clamp(0.32 + Math.sin(clamp(p, 0.12, 0.9) * Math.PI) * 0.66, 0.32, 0.96);
          return st.elapsedSec < st.durationSec;
        });
        phantomEchoes = phantomEchoes.filter(function (ec) {
          ec.age += dt;
          return ec.age < ec.ttl;
        });

        ensureChasteConstellations(true);
        const eqVib = clamp(0.71 + 0.15 * rainIntensity + 0.012 * activeArrows.length + 0.02 * activeTriangles.length + 0.035 * activeStars.length, 0.72, 0.96);
        voluptuousVibration = clamp(voluptuousVibration + (eqVib - voluptuousVibration) * clamp(dt * 2.2, 0.04, 0.4), 0.70, 0.99);
      } else {
        voluptuousVibration = 0.0;
        activeArrows.length = 0;
        activeTriangles.length = 0;
        activeStars.length = 0;
        for (let i = 0; i < shatterShards.length; i++) {
          const sh = shatterShards[i];
          if (reducedMotion || sh.settled) {
            sh.y = sh.floorY;
            sh.settled = true;
          } else {
            sh.vy += 460 * dt;
            sh.x += sh.vx * dt;
            sh.y += sh.vy * dt;
            sh.angle += sh.vAngle * dt;
            if (sh.y >= sh.floorY) {
              sh.y = sh.floorY;
              sh.vx *= 0.25;
              sh.vy = 0;
              sh.settled = true;
            }
          }
        }
      }
      return getState();
    }

    function sparkGlance(idA, idB, reverieId) {
      if (chasteState !== "chaste" || strangersCache.length < 2) return null;
      const sMap = getStrangerMap(strangersCache);
      const realA = (idA && sMap[idA]) ? idA : strangersCache[0].id;
      const pA = eyePoint(sMap[realA], 0);
      let realB = (idB && sMap[idB] && idB !== realA) ? idB : null;
      if (!realB) {
        let bestDist = 1e9;
        let fallbackB = null;
        for (let i = 0; i < strangersCache.length; i++) {
          const cand = strangersCache[i];
          if (!cand || !cand.id || cand.id === realA) continue;
          if (!fallbackB) fallbackB = cand.id;
          const pC = eyePoint(cand, i);
          const d = hypot2(pA.ex, pA.ey, pC.ex, pC.ey);
          if (!isCurrentlyPaired(realA, cand.id) && d < bestDist) {
            bestDist = d;
            realB = cand.id;
          }
        }
        if (!realB) realB = fallbackB;
      }
      if (!realB) return null;
      if (activeArrows.length >= 7) activeArrows.shift();
      const lock = createLockObject(realA, realB, reverieId || focusedReverieId, 0, true);

      let thirdId = null;
      let bestThirdDist = 1e9;
      for (let i = 0; i < strangersCache.length; i++) {
        const cand = strangersCache[i];
        if (!cand || !cand.id || cand.id === realA || cand.id === realB) continue;
        const pC = eyePoint(cand, i);
        const d = hypot2(pA.ex, pA.ey, pC.ex, pC.ey);
        if (d < bestThirdDist) {
          bestThirdDist = d;
          thirdId = cand.id;
        }
      }
      if (thirdId) {
        if (activeTriangles.length >= 3) activeTriangles.shift();
        createTriangleObject([realA, realB, thirdId], lock ? lock.reverieId : reverieId, 0, true);
      }
      voluptuousVibration = Math.min(1, voluptuousVibration + 0.08);
      return lock;
    }

    function weaveStarBurst(anchorStrangerId) {
      if (chasteState !== "chaste" || strangersCache.length < 5) return null;
      const beforeWoven = combinationsWoven;
      const ids5 = pickDistinctStrangerIds(5, anchorStrangerId);
      if (ids5.length < 5) return null;
      if (activeStars.length >= 2) activeStars.shift();
      const star = createStarObject(ids5, focusedReverieId || "surprises", 0, true);
      if (!star) return null;

      const anchor = star.ids.indexOf(anchorStrangerId) !== -1 ? anchorStrangerId : star.ids[0];
      const others = star.ids.filter(function (id) { return id !== anchor; });
      while (activeTriangles.length > 1) activeTriangles.shift();
      createTriangleObject([anchor, others[0], others[2]], star.reverieId, 0, true);
      createTriangleObject([anchor, others[1], others[3]], focusedReverieId || "caresses", 0, true);

      const gained = combinationsWoven - beforeWoven;
      if (gained < 5) combinationsWoven += (5 - gained);
      voluptuousVibration = Math.max(0.94, Math.min(0.99, voluptuousVibration + 0.14));
      return star;
    }

    function setFocusedReverie(reverieIdOrNull) {
      if (reverieIdOrNull && REVERIE_BY_ID[reverieIdOrNull]) {
        focusedReverieId = reverieIdOrNull;
        lastWhisper = REVERIE_BY_ID[reverieIdOrNull].fragment;
        if (chasteState === "chaste" && strangersCache.length >= 2) {
          const hasMode = activeArrows.some(function (lk) { return lk.reverieId === focusedReverieId; });
          if (!hasMode) {
            if (activeArrows.length >= 7) activeArrows.shift();
            const a = strangersCache[0].id;
            const b = pickFreshPartner(a, null) || strangersCache[1].id;
            createLockObject(a, b, focusedReverieId, 0, true);
          }
        }
      } else {
        focusedReverieId = null;
      }
      return focusedReverieId;
    }

    function addChordShards(p1, p2, count) {
      const floorBase = Math.max(p1.fy, p2.fy);
      for (let k = 0; k < count; k++) {
        const t = (k + 0.5) / count;
        const sx = p1.ex + (p2.ex - p1.ex) * t + (nextRand() - 0.5) * 14;
        const sy = p1.ey + (p2.ey - p1.ey) * t + (nextRand() - 0.5) * 10;
        shatterShards.push({
          x: sx,
          y: sy,
          vx: (nextRand() - 0.5) * 76,
          vy: -24 + nextRand() * 68,
          len: 9 + nextRand() * 16,
          width: 1.2 + nextRand() * 1.6,
          angle: Math.atan2(p2.ey - p1.ey, p2.ex - p1.ex) + (nextRand() - 0.5) * 0.8,
          vAngle: (nextRand() - 0.5) * 4.4,
          floorY: floorBase + (nextRand() - 0.3) * 26,
          settled: false,
          shade: k % 2 === 0 ? PALETTE.prosaicLead : PALETTE.arcadeAshlar
        });
      }
    }

    function consummate(idA, idB) {
      const sMap = getStrangerMap(strangersCache);
      let finalA = (idA && sMap[idA]) ? idA : null;
      let finalB = (idB && sMap[idB] && idB !== finalA) ? idB : null;

      if (!finalA && !finalB) {
        let strongest = null;
        for (let i = 0; i < activeArrows.length; i++) {
          if (!strongest || activeArrows[i].alpha > strongest.alpha) strongest = activeArrows[i];
        }
        if (strongest) {
          finalA = strongest.idA;
          finalB = strongest.idB;
        }
      }
      if (!finalA) finalA = strangersCache[0] ? strangersCache[0].id : "girl_twirling_parasol";
      if (!finalB || finalB === finalA) {
        for (let i = 0; i < activeArrows.length; i++) {
          if (activeArrows[i].idA === finalA) { finalB = activeArrows[i].idB; break; }
          if (activeArrows[i].idB === finalA) { finalB = activeArrows[i].idA; break; }
        }
        if (!finalB || finalB === finalA) {
          finalB = (strangersCache[1] && strangersCache[1].id !== finalA)
            ? strangersCache[1].id
            : (strangersCache[0] ? strangersCache[0].id : "veiled_woman_in_black");
        }
      }

      shatterShards = [];
      for (let i = 0; i < activeArrows.length; i++) {
        addChordShards(eyePoint(sMap[activeArrows[i].idA], 0), eyePoint(sMap[activeArrows[i].idB], 1), 4);
      }
      for (let i = 0; i < activeTriangles.length; i++) {
        const ids = activeTriangles[i].ids;
        for (let e = 0; e < 3; e++) {
          addChordShards(eyePoint(sMap[ids[e]], e), eyePoint(sMap[ids[(e + 1) % 3]], e + 1), 3);
        }
      }
      for (let i = 0; i < activeStars.length; i++) {
        const ids = activeStars[i].ids;
        for (let e = 0; e < 5; e++) {
          addChordShards(eyePoint(sMap[ids[e]], e), eyePoint(sMap[ids[(e + 2) % 5]], e + 2), 3);
        }
      }
      if (shatterShards.length === 0) {
        addChordShards(eyePoint(sMap[finalA], 0), eyePoint(sMap[finalB], 1), 18);
      }

      chasteState = "collapsed";
      carouselRunning = false;
      greetingsExchanged = 1;
      consummationCount += 1;
      voluptuousVibration = 0.0;
      activeArrows = [];
      activeTriangles = [];
      activeStars = [];
      phantomEchoes = [];
      consummatedPair = [finalA, finalB];

      const stA = sMap[finalA];
      const stB = sMap[finalB];
      collapsedStory = {
        idA: finalA,
        idB: finalB,
        labelA: stA && stA.label ? stA.label : String(finalA),
        labelB: stB && stB.label ? stB.label : String(finalB),
        entanglements: PROSAIC_ENTANGLEMENTS.slice(),
        epitaph: "They spoke aloud: phantom hardened into person, and the carousel of fantasies stopped."
      };
      lastWhisper = collapsedStory.epitaph;
      safeInvoke(onCollapse, collapsedStory);
      return collapsedStory;
    }

    function resetByRain(strangersOptional) {
      if (Array.isArray(strangersOptional) && strangersOptional.length >= 2) {
        strangersCache = strangersOptional;
      }
      chasteState = "chaste";
      carouselRunning = true;
      greetingsExchanged = 0;
      consummatedPair = null;
      collapsedStory = null;
      shatterShards = [];
      phantomEchoes = [];
      activeArrows = [];
      activeTriangles = [];
      activeStars = [];
      voluptuousVibration = 0.76;
      ensureChasteConstellations(false);
      voluptuousVibration = 0.76;
      safeInvoke(onReset, getState());
      return getState();
    }

    function hitTestConstellation(px, py, strangers) {
      if (!Number.isFinite(px) || !Number.isFinite(py) || chasteState !== "chaste") {
        return null;
      }
      const list = Array.isArray(strangers) && strangers.length > 0 ? strangers : strangersCache;
      const sMap = getStrangerMap(list);

      function mapLabels(ids) {
        return ids.map(function (id) {
          const s = sMap[id];
          return s && s.label ? s.label : String(id);
        });
      }

      for (let i = activeStars.length - 1; i >= 0; i--) {
        const st = activeStars[i];
        let cx = 0;
        let cy = 0;
        for (let k = 0; k < st.ids.length; k++) {
          const ep = eyePoint(sMap[st.ids[k]], k);
          cx += ep.ex;
          cy += ep.ey;
        }
        cx /= st.ids.length;
        cy /= st.ids.length;
        if (hypot2(px, py, cx, cy) <= 28) {
          return {
            kind: "star",
            ids: st.ids.slice(),
            labels: mapLabels(st.ids),
            reverieId: st.reverieId,
            reverieLabel: st.reverieLabel,
            glyph: st.glyph,
            hue: st.hue,
            fragment: st.fragment,
            x: cx,
            y: cy
          };
        }
      }

      for (let i = activeTriangles.length - 1; i >= 0; i--) {
        const tr = activeTriangles[i];
        let cx = 0;
        let cy = 0;
        for (let k = 0; k < 3; k++) {
          const ep = eyePoint(sMap[tr.ids[k]], k);
          cx += ep.ex;
          cy += ep.ey;
        }
        cx /= 3;
        cy /= 3;
        if (hypot2(px, py, cx, cy) <= 28) {
          return {
            kind: "triangle",
            ids: tr.ids.slice(),
            labels: mapLabels(tr.ids),
            reverieId: tr.reverieId,
            reverieLabel: tr.reverieLabel,
            glyph: tr.glyph,
            hue: tr.hue,
            fragment: tr.fragment,
            x: cx,
            y: cy
          };
        }
      }

      let bestArrow = null;
      let bestDist = 28.0001;
      for (let i = 0; i < activeArrows.length; i++) {
        const lk = activeArrows[i];
        const pA = eyePoint(sMap[lk.idA], 0);
        const pB = eyePoint(sMap[lk.idB], 1);
        const mx = (pA.ex + pB.ex) * 0.5;
        const my = (pA.ey + pB.ey) * 0.5;
        const dMid = hypot2(px, py, mx, my);
        const dSeg = pointToSegDist(px, py, pA.ex, pA.ey, pB.ex, pB.ey);
        const effDist = dMid <= 28 ? dMid : (dSeg <= 12 ? 16 + dSeg : 999);
        if (effDist <= 28 && effDist < bestDist) {
          bestDist = effDist;
          bestArrow = {
            kind: "arrow",
            ids: [lk.idA, lk.idB],
            labels: mapLabels([lk.idA, lk.idB]),
            reverieId: lk.reverieId,
            reverieLabel: lk.reverieLabel,
            glyph: lk.glyph,
            hue: lk.hue,
            fragment: lk.fragment,
            x: mx,
            y: my
          };
        }
      }
      return bestArrow;
    }

    function drawGlyphMedallion(ctx, x, y, glyph, hue, alpha, radius) {
      const r = radius || 9.5;
      ctx.save();
      ctx.fillStyle = hexToRgba(PALETTE.slateAbyss, 0.84 * alpha);
      ctx.strokeStyle = hexToRgba(hue, 0.85 * alpha);
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = hexToRgba(hue, Math.min(1, alpha * 1.08));
      ctx.font = "600 11px ui-sans-serif, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(glyph, x, y + 0.5);
      ctx.restore();
    }

    function drawVertexAstrolabe(ctx, x, y, hue, alpha, phaseRad) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(phaseRad);
      ctx.strokeStyle = hexToRgba(hue, 0.72 * alpha);
      ctx.lineWidth = 1.05;
      ctx.beginPath();
      ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = hexToRgba(PALETTE.electricAmber, 0.44 * alpha);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, 11.5, 0, Math.PI * 2);
      for (let t = 0; t < 4; t++) {
        const ang = (t * Math.PI) / 2;
        ctx.moveTo(Math.cos(ang) * 9, Math.sin(ang) * 9);
        ctx.lineTo(Math.cos(ang) * 14, Math.sin(ang) * 14);
      }
      ctx.stroke();
      ctx.restore();
    }

    function drawStarCenterSeal(ctx, cx, cy, rOuter, hue, alpha, rotRad, glyph) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotRad);
      ctx.strokeStyle = hexToRgba(PALETTE.electricAmber, 0.65 * alpha);
      ctx.fillStyle = hexToRgba(PALETTE.coralSilk, 0.16 * alpha);
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const rr = i % 2 === 0 ? rOuter : rOuter * 0.42;
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        const px = Math.cos(a) * rr;
        const py = Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      drawGlyphMedallion(ctx, cx, cy, glyph, hue, alpha, 10.5);
    }

    function renderConstellations(ctx, strangers, renderOpts) {
      if (!ctx) return;
      const list = Array.isArray(strangers) && strangers.length > 0 ? strangers : strangersCache;
      const sMap = getStrangerMap(list);
      const rOpts = renderOpts || {};
      const reducedMotion = !!rOpts.reducedMotion;
      const rotBase = reducedMotion ? 0 : clockSec * 0.55;
      const canvasW = (Number.isFinite(rOpts.width) && rOpts.width > 0)
        ? rOpts.width
        : (ctx.canvas ? (ctx.canvas.clientWidth || ctx.canvas.width || 1280) : 1280);

      ctx.save();
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (chasteState === "chaste") {
        if (!reducedMotion && phantomEchoes.length > 0) {
          ctx.save();
          ctx.setLineDash([4, 6]);
          for (let i = 0; i < phantomEchoes.length; i++) {
            const ec = phantomEchoes[i];
            const fade = clamp(1 - ec.age / ec.ttl, 0, 1) * 0.34;
            ctx.strokeStyle = hexToRgba(ec.hue || PALETTE.pearlVeil, fade);
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(ec.x1, ec.y1);
            ctx.lineTo(ec.x2, ec.y2);
            ctx.stroke();
          }
          ctx.restore();
        }

        for (let i = 0; i < activeTriangles.length; i++) {
          const tr = activeTriangles[i];
          const p0 = eyePoint(sMap[tr.ids[0]], 0);
          const p1 = eyePoint(sMap[tr.ids[1]], 1);
          const p2 = eyePoint(sMap[tr.ids[2]], 2);
          const cx = (p0.ex + p1.ex + p2.ex) / 3;
          const cy = (p0.ey + p1.ey + p2.ey) / 3;
          const reflY = Math.max(p0.fy, p1.fy, p2.fy) + 18;

          ctx.fillStyle = hexToRgba(PALETTE.electricAmber, 0.06 * tr.alpha);
          ctx.beginPath();
          ctx.ellipse(cx, reflY, 54, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = hexToRgba(PALETTE.silkBlush, 0.095 * tr.alpha);
          ctx.strokeStyle = hexToRgba(PALETTE.electricAmber, 0.28 * tr.alpha);
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(p0.ex, p0.ey);
          ctx.lineTo(p1.ex, p1.ey);
          ctx.lineTo(p2.ex, p2.ey);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.strokeStyle = hexToRgba(tr.hue, 0.76 * tr.alpha);
          ctx.lineWidth = 1.15;
          ctx.stroke();

          ctx.strokeStyle = hexToRgba(PALETTE.pearlVeil, 0.42 * tr.alpha);
          ctx.lineWidth = 0.65;
          ctx.beginPath();
          const pts = [p0, p1, p2];
          for (let k = 0; k < 3; k++) {
            const ix = cx + (pts[k].ex - cx) * 0.88;
            const iy = cy + (pts[k].ey - cy) * 0.88;
            if (k === 0) ctx.moveTo(ix, iy);
            else ctx.lineTo(ix, iy);
          }
          ctx.closePath();
          ctx.stroke();
          drawGlyphMedallion(ctx, cx, cy, tr.glyph, tr.hue, tr.alpha, 8.6);
        }

        for (let i = 0; i < activeStars.length; i++) {
          const st = activeStars[i];
          const rawPts = [];
          let maxFy = 520;
          for (let k = 0; k < st.ids.length; k++) {
            const ep = eyePoint(sMap[st.ids[k]], k);
            rawPts.push(ep);
            if (ep.fy > maxFy) maxFy = ep.fy;
          }
          const v = orderCyclicByAngle(rawPts);
          if (v.length < 5) continue;
          let cx = 0;
          let cy = 0;
          for (let k = 0; k < 5; k++) { cx += v[k].ex; cy += v[k].ey; }
          cx /= 5;
          cy /= 5;

          ctx.fillStyle = hexToRgba(PALETTE.coralSilk, 0.085 * st.alpha);
          ctx.beginPath();
          ctx.ellipse(cx, maxFy + 22, 86, 11, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.save();
          ctx.setLineDash([3, 5]);
          ctx.strokeStyle = hexToRgba(PALETTE.electricAmber, 0.30 * st.alpha);
          ctx.lineWidth = 0.85;
          ctx.beginPath();
          for (let k = 0; k < 5; k++) {
            if (k === 0) ctx.moveTo(v[k].ex, v[k].ey);
            else ctx.lineTo(v[k].ex, v[k].ey);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.restore();

          const starOrder = [0, 2, 4, 1, 3];
          ctx.fillStyle = hexToRgba(PALETTE.coralSilk, 0.11 * st.alpha);
          ctx.strokeStyle = hexToRgba(PALETTE.coralSilk, 0.38 * st.alpha);
          ctx.lineWidth = 3.0;
          ctx.beginPath();
          for (let k = 0; k < 5; k++) {
            const pt = v[starOrder[k]];
            if (k === 0) ctx.moveTo(pt.ex, pt.ey);
            else ctx.lineTo(pt.ex, pt.ey);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.strokeStyle = hexToRgba(PALETTE.electricAmber, 0.88 * st.alpha);
          ctx.lineWidth = 1.35;
          ctx.stroke();

          for (let k = 0; k < 5; k++) {
            drawVertexAstrolabe(ctx, v[k].ex, v[k].ey, PALETTE.coralSilk, st.alpha, rotBase + k * 0.62);
          }
          drawStarCenterSeal(ctx, cx, cy, 17, st.hue, st.alpha, -rotBase * 0.7, st.glyph);
        }

        for (let i = 0; i < activeArrows.length; i++) {
          const lk = activeArrows[i];
          const pA = eyePoint(sMap[lk.idA], 0);
          const pB = eyePoint(sMap[lk.idB], 1);
          const dx = pB.ex - pA.ex;
          const dy = pB.ey - pA.ey;
          const len = Math.sqrt(dx * dx + dy * dy);
          if (len < 6) continue;
          const ux = dx / len;
          const uy = dy / len;
          const nx = -uy;
          const ny = ux;
          const off = (lk.indexA % 2 === 0 ? 1 : -1) * 3.2;
          const ax = pA.ex + nx * off;
          const ay = pA.ey + ny * off;
          const bx = pB.ex + nx * off - ux * 7.5;
          const by = pB.ey + ny * off - uy * 7.5;

          ctx.strokeStyle = hexToRgba(lk.hue, 0.25 * lk.alpha);
          ctx.lineWidth = 2.6;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.stroke();

          ctx.strokeStyle = hexToRgba(lk.hue, 0.90 * lk.alpha);
          ctx.lineWidth = 1.2;
          ctx.stroke();

          ctx.fillStyle = hexToRgba(lk.hue, 0.92 * lk.alpha);
          ctx.beginPath();
          ctx.moveTo(bx + ux * 2, by + uy * 2);
          ctx.lineTo(bx - ux * 7.5 + nx * 3.8, by - uy * 7.5 + ny * 3.8);
          ctx.lineTo(bx - ux * 5.2, by - uy * 5.2);
          ctx.lineTo(bx - ux * 7.5 - nx * 3.8, by - uy * 7.5 - ny * 3.8);
          ctx.closePath();
          ctx.fill();

          const prog = reducedMotion ? 0.5 : clamp(lk.elapsedSec / Math.max(0.1, lk.durationSec), 0, 1);
          const sx = ax + (bx - ax) * prog;
          const sy = ay + (by - ay) * prog;
          ctx.fillStyle = hexToRgba(PALETTE.pearlVeil, 0.95 * lk.alpha);
          ctx.beginPath();
          ctx.arc(sx, sy, 2.4, 0, Math.PI * 2);
          ctx.fill();

          drawGlyphMedallion(ctx, (ax + bx) * 0.5 + nx * 8, (ay + by) * 0.5 + ny * 8, lk.glyph, lk.hue, lk.alpha * 0.92, 7.8);
        }
      } else {
        for (let i = 0; i < shatterShards.length; i++) {
          const sh = shatterShards[i];
          ctx.save();
          ctx.translate(sh.x, sh.y);
          ctx.rotate(sh.angle);
          ctx.strokeStyle = hexToRgba(sh.shade, sh.settled ? 0.62 : 0.85);
          ctx.lineWidth = sh.width;
          ctx.beginPath();
          ctx.moveTo(-sh.len * 0.5, 0);
          ctx.lineTo(sh.len * 0.5, 0);
          ctx.stroke();
          ctx.restore();
        }
        if (consummatedPair && consummatedPair.length === 2) {
          const pA = eyePoint(sMap[consummatedPair[0]], 0);
          const pB = eyePoint(sMap[consummatedPair[1]], 1);
          ctx.strokeStyle = PALETTE.slateAbyss;
          ctx.lineWidth = 5.5;
          ctx.beginPath();
          ctx.moveTo(pA.ex, pA.ey);
          ctx.lineTo(pB.ex, pB.ey);
          ctx.stroke();

          ctx.save();
          ctx.setLineDash([8, 5]);
          ctx.strokeStyle = PALETTE.prosaicLead;
          ctx.lineWidth = 3.0;
          ctx.stroke();
          ctx.restore();

          const ends = [pA, pB];
          for (let e = 0; e < 2; e++) {
            ctx.strokeStyle = "#8a929b";
            ctx.fillStyle = hexToRgba(PALETTE.slateAbyss, 0.88);
            ctx.lineWidth = 1.8;
            ctx.strokeRect(ends[e].ex - 9, ends[e].ey - 9, 18, 18);
          }

          const bannerText = "PURSUITS · PRETENSES · MISUNDERSTANDINGS · CLASHES · OPPRESSIONS";
          const compact = canvasW < 520;
          ctx.font = compact ? "700 8.5px ui-monospace, monospace" : "700 10.5px ui-monospace, monospace";
          const tw = Math.min(canvasW - 20, ctx.measureText(bannerText).width + 20);
          const bx = clamp((pA.ex + pB.ex) * 0.5, tw * 0.5 + 10, canvasW - tw * 0.5 - 10);
          const by = Math.max(30, Math.min(pA.ey, pB.ey) - 28);
          ctx.fillStyle = hexToRgba(PALETTE.slateAbyss, 0.92);
          ctx.strokeStyle = PALETTE.prosaicLead;
          ctx.lineWidth = 1.4;
          ctx.fillRect(bx - tw * 0.5, by - 12, tw, 24);
          ctx.strokeRect(bx - tw * 0.5, by - 12, tw, 24);
          ctx.fillStyle = "#b8bfc7";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(bannerText, bx, by + 0.5, tw - 10);
        }
      }
      ctx.restore();
    }

    function getState() {
      const isCollapsed = chasteState === "collapsed";
      return {
        chasteState: chasteState,
        carouselRunning: carouselRunning,
        voluptuousVibration: isCollapsed ? 0 : Number(voluptuousVibration.toFixed(4)),
        activeLockCount: activeArrows.length,
        activeArrowCount: activeArrows.length,
        activeTriangleCount: activeTriangles.length,
        activeStarCount: activeStars.length,
        maxLockDurationSec: MAX_LOCK_DURATION_SEC,
        maxObservedLockSec: Math.min(MAX_LOCK_DURATION_SEC, Number(maxObservedLockSec.toFixed(4))),
        combinationsWoven: combinationsWoven,
        uniquePairsSeen: seenPairs.size,
        greetingsExchanged: greetingsExchanged,
        consummationCount: consummationCount,
        consummatedPair: consummatedPair ? consummatedPair.slice() : null,
        collapsedStory: collapsedStory ? Object.assign({}, collapsedStory, { entanglements: collapsedStory.entanglements.slice() }) : null,
        focusedReverieId: focusedReverieId,
        activeLocks: activeArrows.slice(),
        activeTriangles: activeTriangles.slice(),
        activeStars: activeStars.slice(),
        reverieCounts: Object.assign({}, reverieCounts),
        lastWhisper: lastWhisper
      };
    }

    ensureChasteConstellations(false);

    return {
      step: step,
      sparkGlance: sparkGlance,
      weaveStarBurst: weaveStarBurst,
      setFocusedReverie: setFocusedReverie,
      setReverieMode: setFocusedReverie,
      consummate: consummate,
      resetByRain: resetByRain,
      reset: resetByRain,
      hitTestConstellation: hitTestConstellation,
      renderConstellations: renderConstellations,
      getState: getState,
      getReverieModes: function () { return REVERIE_MODES; },
      getProsaicEntanglements: function () { return PROSAIC_ENTANGLEMENTS; }
    };
  }

  const API = Object.freeze({
    REVERIE_MODES: REVERIE_MODES,
    PROSAIC_ENTANGLEMENTS: PROSAIC_ENTANGLEMENTS,
    PALETTE: PALETTE,
    MAX_LOCK_DURATION_SEC: MAX_LOCK_DURATION_SEC,
    createConstellationEngine: createConstellationEngine
  });

  root.ChloeGlanceConstellations = API;
  if (typeof window !== "undefined") {
    window.ChloeGlanceConstellations = API;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
