/*
 * City 04: ZAIRA (Cities & Memory 3)
 * Layer: relational_scars.js
 *
 * Epistemic Role:
 *   Interactive 2-point brass surveyor's proportional caliper physics,
 *   vernier geometry, radial/capsule sponge-expansion field deformPoint(x, y),
 *   and the 6 canonical Calvino spatial-to-historical relational spans forming
 *   Zaira's closed genealogical causal chain.
 *
 * Strict Anti-Spoiler Law (HG-1):
 *   - CHORD_CATALOG and all single-point / unlinked span measurements expose
 *     ZERO historical lore ("Static spatial measurement — tells nothing.").
 *   - Historical memory scars surface ONLY when a canonical 2-point span is
 *     actively measured via measurePair(idA, idB) / measureChord(...).
 */
(function (root) {
  "use strict";

  var LOGICAL_WIDTH = 1000;
  var LOGICAL_HEIGHT = 620;
  var CUBITS_PER_PX = 4.35 / 124.0; // Calibrated to A1(310,168)<->A2(310,292) = 124px = 4.35 cubits
  var MUTE_STATUS_TEXT = "Static spatial measurement — tells nothing.";

  var DEFAULT_ANCHORS = Object.freeze([
    Object.freeze({ id: "lamppost_crown", code: "A1", x: 310, y: 168, label: "Iron Lamppost Finial" }),
    Object.freeze({ id: "bastion_cobbles", code: "A2", x: 310, y: 292, label: "Bastion Plinth Cobbles" }),
    Object.freeze({ id: "opposite_railing", code: "A3", x: 525, y: 214, label: "Opposite Balcony Railing" }),
    Object.freeze({ id: "dawn_alley", code: "A4", x: 525, y: 368, label: "Lower Stair-Alley Landing" }),
    Object.freeze({ id: "tilted_gutter", code: "A5", x: 590, y: 132, label: "Zinc-Scaled Roof Guttering" }),
    Object.freeze({ id: "alcove_window", code: "A6", x: 562, y: 196, label: "Grated Casement Window" }),
    Object.freeze({ id: "sea_cape", code: "A7", x: 885, y: 176, label: "Headland Cape Horizon" }),
    Object.freeze({ id: "torn_fishnet", code: "A8", x: 215, y: 496, label: "Suspended Quay Fish Net" }),
    Object.freeze({ id: "dock_bollards", code: "A9", x: 365, y: 532, label: "Dock Mooring Bench" })
  ]);

  // Public mute catalog for UI chord pins [1]-[6] BEFORE unlocking — ZERO lore words!
  var CHORD_CATALOG = Object.freeze([
    Object.freeze({
      index: 0,
      keyDigit: "1",
      numeral: "I",
      id: "span_1",
      chord: "I · A1↔A2",
      codes: Object.freeze(["A1", "A2"]),
      pair: Object.freeze(["lamppost_crown", "bastion_cobbles"]),
      muteEndpoints: "A1 Lamppost Finial ↔ A2 Plinth Cobbles"
    }),
    Object.freeze({
      index: 1,
      keyDigit: "2",
      numeral: "II",
      id: "span_2",
      chord: "II · A1↔A3",
      codes: Object.freeze(["A1", "A3"]),
      pair: Object.freeze(["lamppost_crown", "opposite_railing"]),
      muteEndpoints: "A1 Lamppost Finial ↔ A3 Opposite Railing"
    }),
    Object.freeze({
      index: 2,
      keyDigit: "3",
      numeral: "III",
      id: "span_3",
      chord: "III · A3↔A4",
      codes: Object.freeze(["A3", "A4"]),
      pair: Object.freeze(["opposite_railing", "dawn_alley"]),
      muteEndpoints: "A3 Opposite Railing ↔ A4 Stair-Alley Landing"
    }),
    Object.freeze({
      index: 3,
      keyDigit: "4",
      numeral: "IV",
      id: "span_4",
      chord: "IV · A5↔A6",
      codes: Object.freeze(["A5", "A6"]),
      pair: Object.freeze(["tilted_gutter", "alcove_window"]),
      muteEndpoints: "A5 Zinc Roof Guttering ↔ A6 Casement Window"
    }),
    Object.freeze({
      index: 4,
      keyDigit: "5",
      numeral: "V",
      id: "span_5",
      chord: "V · A7↔A5",
      codes: Object.freeze(["A7", "A5"]),
      pair: Object.freeze(["sea_cape", "tilted_gutter"]),
      muteEndpoints: "A7 Headland Cape ↔ A5 Zinc Roof Guttering"
    }),
    Object.freeze({
      index: 5,
      keyDigit: "6",
      numeral: "VI",
      id: "span_6",
      chord: "VI · A8↔A9",
      codes: Object.freeze(["A8", "A9"]),
      pair: Object.freeze(["torn_fishnet", "dock_bollards"]),
      muteEndpoints: "A8 Quay Fish Net ↔ A9 Dock Mooring Bench"
    })
  ]);

  // Private canonical relational spans — NEVER exposed until unlocked via 2-point measurement.
  var PRIVATE_CANONICAL_SPANS = [
    {
      index: 0,
      id: "span_1",
      numeral: "I",
      chord: "I · A1↔A2",
      codes: ["A1", "A2"],
      pair: ["lamppost_crown", "bastion_cobbles"],
      cubits: 4.35,
      angleDeg: 90.0,
      measurement: "4.35 cubits vertical drop · 90°00' plumb",
      spatialPole: "Height of that iron lamppost above the bastion plinth cobbles (4.35 cubits vertical drop)",
      memoryEvent: "The distance from the ground of a hanged usurper's swaying feet.",
      motif: "swaying_pendulum_scratches",
      motifLabel: "Pendulum Plumb-Scratches",
      causalLinks: ["span_2", "span_6"],
      capsuleRadius: 185,
      radialPuff: 5.4,
      crestLift: 4.2,
      lateralPush: -1.8
    },
    {
      index: 1,
      id: "span_2",
      numeral: "II",
      chord: "II · A1↔A3",
      codes: ["A1", "A3"],
      pair: ["lamppost_crown", "opposite_railing"],
      cubits: 11.80,
      angleDeg: 12.1,
      measurement: "11.80 cubits catenary chord · 12°04' span",
      spatialPole: "Line strung from the iron lamppost across the stair-street to the balcony railing opposite (11.80 cubits catenary chord)",
      memoryEvent: "The festoons that marked the course of the queen's nuptial procession.",
      motif: "festoon_scroll_garlands",
      motifLabel: "Nuptial Festoon Scrolls",
      causalLinks: ["span_1", "span_3"],
      capsuleRadius: 210,
      radialPuff: 5.8,
      crestLift: 4.6,
      lateralPush: 0.9
    },
    {
      index: 2,
      id: "span_3",
      numeral: "III",
      chord: "III · A3↔A4",
      codes: ["A3", "A4"],
      pair: ["opposite_railing", "dawn_alley"],
      cubits: 5.60,
      angleDeg: 90.0,
      measurement: "5.60 cubits parapet drop · 90°00' descent",
      spatialPole: "Height of that wrought-iron balcony railing above the lower stair-alley landing (5.60 cubits parapet drop)",
      memoryEvent: "The leap of the adulterer who climbed over the railing at dawn.",
      motif: "dawn_vault_indentations",
      motifLabel: "Dawn Vault Indentations",
      causalLinks: ["span_2", "span_4"],
      capsuleRadius: 195,
      radialPuff: 5.6,
      crestLift: 4.1,
      lateralPush: 1.4
    },
    {
      index: 3,
      id: "span_4",
      numeral: "IV",
      chord: "IV · A5↔A6",
      codes: ["A5", "A6"],
      pair: ["tilted_gutter", "alcove_window"],
      cubits: 2.48,
      angleDeg: 14.33,
      measurement: "14°20' zinc eaves cant · 2.48 cubits slip-chord",
      spatialPole: "Tilt of the oxidized zinc guttering canted toward the grated casement (14°20' zinc eaves cant)",
      memoryEvent: "A cat's slip along the tilted guttering into the same window.",
      motif: "claw_tick_indentations",
      motifLabel: "Feline Claw-Tick Indentations",
      causalLinks: ["span_3", "span_5"],
      capsuleRadius: 175,
      radialPuff: 5.2,
      crestLift: 4.4,
      lateralPush: 1.6
    },
    {
      index: 4,
      id: "span_5",
      numeral: "V",
      chord: "V · A7↔A5",
      codes: ["A7", "A5"],
      pair: ["sea_cape", "tilted_gutter"],
      cubits: 640.0,
      angleDeg: 28.0,
      measurement: "640.0 cubits · 28° ballistic arc",
      spatialPole: "Firing range from the sea beyond the headland cape to the high zinc eaves (640.0 cubits · 28° ballistic arc)",
      memoryEvent: "The firing range of a gunboat which has suddenly appeared beyond the cape and the bomb that destroyed the guttering.",
      motif: "ballistic_shrapnel_scrolls",
      motifLabel: "Ballistic Shrapnel Scrolls",
      causalLinks: ["span_4", "span_6"],
      capsuleRadius: 235,
      radialPuff: 6.0,
      crestLift: 4.5,
      lateralPush: 2.1
    },
    {
      index: 5,
      id: "span_6",
      numeral: "VI",
      chord: "VI · A8↔A9",
      codes: ["A8", "A9"],
      pair: ["torn_fishnet", "dock_bollards"],
      cubits: 0.43,
      angleDeg: 13.5,
      measurement: "3 ragged tears: 0.42 · 0.37 · 0.51 cubits",
      spatialPole: "Rips in the suspended quay fish net (3 ragged tears: 0.42 · 0.37 · 0.51 cubits) beside the limestone dock mooring bench",
      memoryEvent: "The three old men seated on the dock mending nets and telling each other for the hundredth time the story of the gunboat of the usurper, who some say was the queen's illegitimate son, abandoned in his swaddling clothes there on the dock.",
      motif: "palm_lifeline_net_weft",
      motifLabel: "Chiromantic Net-Weft & Swaddling Creases",
      causalLinks: ["span_5", "span_1"],
      capsuleRadius: 195,
      radialPuff: 5.5,
      crestLift: 4.0,
      lateralPush: -2.0
    }
  ];

  var CLOSED_CAUSAL_SEAL_TEXT =
    "Closed Genealogical Sponge-Cycle: abandoned infant in swaddling clothes on the dock (VI) → " +
    "usurper's gunboat appearing beyond the cape to bomb the zinc guttering (V) → " +
    "cat slipping down the tilted guttering into the grated casement (IV) → " +
    "adulterer vaulting the opposite railing at dawn (III) → " +
    "queen's nuptial festoons strung from railing to lamppost (II) → " +
    "hanged usurper's swaying feet beneath that lamppost (I).";

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function roundTo(v, decimals) {
    var f = Math.pow(10, decimals);
    return Math.round(v * f) / f;
  }

  function pairKey(idA, idB) {
    return idA < idB ? idA + "::" + idB : idB + "::" + idA;
  }

  function normalizeAnchors(anchorsInput) {
    var list = [];
    var byId = Object.create(null);
    var byCode = Object.create(null);

    var rawList = null;
    if (Array.isArray(anchorsInput)) {
      rawList = anchorsInput;
    } else if (anchorsInput && Array.isArray(anchorsInput.anchors)) {
      rawList = anchorsInput.anchors;
    } else if (anchorsInput && typeof anchorsInput === "object") {
      rawList = [];
      var keys = Object.keys(anchorsInput);
      for (var k = 0; k < keys.length; k++) {
        var candidate = anchorsInput[keys[k]];
        if (candidate && typeof candidate === "object" && typeof candidate.id === "string") {
          rawList.push(candidate);
        }
      }
    }

    for (var i = 0; i < DEFAULT_ANCHORS.length; i++) {
      var def = DEFAULT_ANCHORS[i];
      var override = null;
      if (rawList) {
        for (var j = 0; j < rawList.length; j++) {
          var item = rawList[j];
          if (item && (item.id === def.id || item.code === def.code)) {
            override = item;
            break;
          }
        }
      }
      var normalized = {
        id: def.id,
        code: (override && override.code) || def.code,
        x: override && typeof override.x === "number" ? override.x : def.x,
        y: override && typeof override.y === "number" ? override.y : def.y,
        label: (override && override.label) || def.label
      };
      list.push(normalized);
      byId[normalized.id] = normalized;
      byCode[normalized.code.toUpperCase()] = normalized;
    }

    return { list: list, byId: byId, byCode: byCode };
  }

  // Safe Canvas2D helpers (graceful on both HiDPI browser contexts and minimal Node mocks)
  function setDashSafe(ctx, pattern) {
    if (ctx && typeof ctx.setLineDash === "function") {
      ctx.setLineDash(pattern);
    }
  }

  function makeLinearGrad(ctx, x0, y0, x1, y1, stops, fallback) {
    if (!ctx || typeof ctx.createLinearGradient !== "function") {
      return fallback;
    }
    var g = ctx.createLinearGradient(x0, y0, x1, y1);
    if (!g || typeof g.addColorStop !== "function") {
      return fallback;
    }
    for (var i = 0; i < stops.length; i++) {
      g.addColorStop(stops[i][0], stops[i][1]);
    }
    return g;
  }

  function makeRadialGrad(ctx, x0, y0, r0, x1, y1, r1, stops, fallback) {
    if (!ctx || typeof ctx.createRadialGradient !== "function") {
      return fallback;
    }
    var g = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    if (!g || typeof g.addColorStop !== "function") {
      return fallback;
    }
    for (var i = 0; i < stops.length; i++) {
      g.addColorStop(stops[i][0], stops[i][1]);
    }
    return g;
  }

  function roundedRectPath(ctx, x, y, w, h, r) {
    var rad = Math.min(r, w * 0.5, h * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
    ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y);
    ctx.closePath();
  }

  function drawEllipseSafe(ctx, cx, cy, rx, ry, rot) {
    if (typeof ctx.ellipse === "function") {
      ctx.ellipse(cx, cy, rx, ry, rot || 0, 0, Math.PI * 2);
    } else {
      ctx.save();
      ctx.translate(cx, cy);
      if (rot) ctx.rotate(rot);
      ctx.scale(rx, ry);
      ctx.arc(0, 0, 1, 0, Math.PI * 2);
      ctx.restore();
    }
  }

  function createEngine(anchorsInput) {
    var anchorStore = normalizeAnchors(anchorsInput);
    var anchors = anchorStore.list;
    var anchorById = anchorStore.byId;
    var anchorByCode = anchorStore.byCode;

    // Prebuild partner adjacency map (IDs ONLY — zero lore!) and canonical pair lookup
    var partnerMap = Object.create(null);
    for (var aIdx = 0; aIdx < anchors.length; aIdx++) {
      partnerMap[anchors[aIdx].id] = [];
    }

    var spanByKey = Object.create(null);
    var spanById = Object.create(null);
    var spanStates = [];

    for (var sIdx = 0; sIdx < PRIVATE_CANONICAL_SPANS.length; sIdx++) {
      var spec = PRIVATE_CANONICAL_SPANS[sIdx];
      var endA = anchorById[spec.pair[0]];
      var endB = anchorById[spec.pair[1]];
      var dx = endB.x - endA.x;
      var dy = endB.y - endA.y;
      var segLenSq = dx * dx + dy * dy;

      partnerMap[endA.id].push(endB.id);
      partnerMap[endB.id].push(endA.id);

      var runtimeSpan = {
        spec: spec,
        ax: endA.x,
        ay: endA.y,
        bx: endB.x,
        by: endB.y,
        mx: (endA.x + endB.x) * 0.5,
        my: (endA.y + endB.y) * 0.5,
        dx: dx,
        dy: dy,
        segLenSq: segLenSq > 1e-6 ? segLenSq : 1.0,
        unlocked: false,
        unlockSeq: 0,
        swellWeight: 0,
        swellVelocity: 0,
        flashPulse: 0
      };

      spanStates.push(runtimeSpan);
      spanById[spec.id] = runtimeSpan;
      spanByKey[pairKey(endA.id, endB.id)] = runtimeSpan;
    }

    var unlockCounter = 0;
    var hasAnySwell = false;
    var lastReducedMotion = false;
    var internalTime = 0;

    // Caliper instrument state
    var caliper = {
      pinnedAnchorId: null,
      secondAnchorId: null,
      activeSpanId: null,
      hoveredAnchorId: null,
      livePointer: null,
      unlinkedGlow: 0,
      lastMeasurement: null
    };

    function resolveAnchor(idOrCode) {
      if (!idOrCode || typeof idOrCode !== "string") return null;
      if (anchorById[idOrCode]) return anchorById[idOrCode];
      var upper = idOrCode.trim().toUpperCase();
      if (anchorByCode[upper]) return anchorByCode[upper];
      return null;
    }

    function computeRawMetrics(a, b) {
      var dx = b.x - a.x;
      var dy = b.y - a.y;
      var distPx = Math.hypot(dx, dy);
      var cubits = roundTo(distPx * CUBITS_PER_PX, 2);
      var rawDeg = Math.abs((Math.atan2(-dy, dx) * 180) / Math.PI);
      if (rawDeg > 90) rawDeg = 180 - rawDeg;
      var angleDeg = roundTo(rawDeg, 1);
      return { distPx: distPx, cubits: cubits, angleDeg: angleDeg };
    }

    function refreshHasAnySwell() {
      for (var i = 0; i < spanStates.length; i++) {
        if (spanStates[i].swellWeight > 1e-5 || spanStates[i].unlocked) {
          hasAnySwell = true;
          return;
        }
      }
      hasAnySwell = false;
    }

    // Core sponge-expansion field: O(1) identity at 0/6, smooth radial + capsule expansion up to ~22 px at 6/6.
    function deformPoint(x, y) {
      if (!hasAnySwell) {
        return { x: x, y: y, swell: 0 };
      }

      var totalWeight = 0;
      var ux = 0;
      var uy = 0;
      var localSwell = 0;

      for (var i = 0; i < spanStates.length; i++) {
        var st = spanStates[i];
        var w = st.swellWeight;
        if (w <= 1e-5) continue;

        totalWeight += w;
        var sp = st.spec;

        // Closest point Q on canonical segment A->B
        var px = x - st.ax;
        var py = y - st.ay;
        var t = (px * st.dx + py * st.dy) / st.segLenSq;
        if (t < 0) t = 0;
        else if (t > 1) t = 1;

        var qx = st.ax + t * st.dx;
        var qy = st.ay + t * st.dy;
        var rx = x - qx;
        var ry = y - qy;
        var distSq = rx * rx + ry * ry;
        var R = sp.capsuleRadius;
        var RSq = R * R;

        if (distSq < RSq) {
          var qNorm = 1 - distSq / RSq;
          var bell = qNorm * qNorm; // C1 Wendland-like bell: 1 on segment, 0 at d=R
          var regNorm = 1 / Math.sqrt(distSq + 1600); // Regularized radius (eps = 40px) prevents axis cusp

          // Smooth outward radial puff + buoyant upward sponge crest + subtle lateral breathe
          ux += w * bell * (sp.radialPuff * rx * regNorm + sp.lateralPush);
          uy += w * bell * (sp.radialPuff * ry * regNorm - sp.crestLift);

          var contrib = w * bell;
          if (contrib > localSwell) {
            localSwell = contrib;
          } else {
            localSwell += contrib * 0.28;
          }
        }
      }

      if (totalWeight <= 1e-5) {
        return { x: x, y: y, swell: 0 };
      }

      // Global marine-sponge bastion dome swell from foundation heart (440, 585)
      var meanSwell = totalWeight / 6;
      var gx = x - 440;
      var gy = y - 585;
      var gDistSq = gx * gx + gy * gy;
      var gFalloff = Math.exp(-gDistSq / (520 * 520));
      var gInv = 1 / Math.sqrt(gDistSq + 6400);

      ux += meanSwell * gFalloff * (7.2 * gx * gInv);
      uy += meanSwell * (gFalloff * (7.2 * gy * gInv) - 3.6 * (0.35 + 0.65 * gFalloff));

      // Smooth saturation cap keeping total displacement organically inside 18-24 logical px at 6/6
      var mag = Math.hypot(ux, uy);
      if (mag > 1e-6) {
        var maxCap = 23.6;
        var softMag = maxCap * Math.tanh(mag / maxCap);
        var scale = softMag / mag;
        ux *= scale;
        uy *= scale;
      }

      var swellOut = clamp(localSwell * 0.76 + meanSwell * 0.36, 0, 1);
      return {
        x: x + ux,
        y: y + uy,
        swell: swellOut
      };
    }

    function getPartnerHintIds(anchorId) {
      var a = resolveAnchor(anchorId);
      if (!a) return [];
      return partnerMap[a.id].slice();
    }

    function getUnlockedCount() {
      var c = 0;
      for (var i = 0; i < spanStates.length; i++) {
        if (spanStates[i].unlocked) c++;
      }
      return c;
    }

    function buildRevealedScar(st) {
      var sp = st.spec;
      var activeLinkedIds = [];
      var activeLinkedChords = [];
      for (var i = 0; i < sp.causalLinks.length; i++) {
        var neighborId = sp.causalLinks[i];
        var neighbor = spanById[neighborId];
        if (neighbor && neighbor.unlocked) {
          activeLinkedIds.push(neighborId);
          activeLinkedChords.push(neighbor.spec.chord);
        }
      }
      return {
        index: sp.index,
        id: sp.id,
        numeral: sp.numeral,
        chord: sp.chord,
        codes: sp.codes.slice(),
        pair: sp.pair.slice(),
        cubits: sp.cubits,
        angleDeg: sp.angleDeg,
        measurement: sp.measurement,
        spatialPole: sp.spatialPole,
        memoryEvent: sp.memoryEvent,
        motif: sp.motif,
        motifLabel: sp.motifLabel,
        causalLinks: sp.causalLinks.slice(),
        activeLinkedIds: activeLinkedIds,
        activeLinkedChords: activeLinkedChords,
        swellWeight: roundTo(st.swellWeight, 3),
        unlockOrder: st.unlockSeq
      };
    }

    function getRevealedScars() {
      var unlockedList = [];
      for (var i = 0; i < spanStates.length; i++) {
        if (spanStates[i].unlocked) {
          unlockedList.push(spanStates[i]);
        }
      }
      if (unlockedList.length === 0) {
        return [];
      }
      unlockedList.sort(function (a, b) {
        return a.unlockSeq - b.unlockSeq;
      });
      var out = [];
      for (var j = 0; j < unlockedList.length; j++) {
        out.push(buildRevealedScar(unlockedList[j]));
      }
      return out;
    }

    function getUnlockedSpanIds() {
      var ids = [];
      for (var i = 0; i < spanStates.length; i++) {
        if (spanStates[i].unlocked) ids.push(spanStates[i].spec.id);
      }
      return ids;
    }

    function isSpanUnlocked(spanId) {
      var st = spanById[spanId];
      return Boolean(st && st.unlocked);
    }

    function getClosedLoopSeal() {
      if (getUnlockedCount() < 6) {
        return null;
      }
      return {
        closed: true,
        chordRing: "I ↔ II ↔ III ↔ IV ↔ V ↔ VI ↔ I",
        inscription: CLOSED_CAUSAL_SEAL_TEXT
      };
    }

    function computePeakDisplacementSample() {
      if (!hasAnySwell) return 0;
      var peak = 0;
      for (var i = 0; i < anchors.length; i++) {
        var a = anchors[i];
        var da = deformPoint(a.x, a.y);
        var d1 = Math.hypot(da.x - a.x, da.y - a.y);
        if (d1 > peak) peak = d1;
      }
      for (var j = 0; j < spanStates.length; j++) {
        var st = spanStates[j];
        var dm = deformPoint(st.mx, st.my);
        var d2 = Math.hypot(dm.x - st.mx, dm.y - st.my);
        if (d2 > peak) peak = d2;
        var off = deformPoint(st.mx + 24, st.my - 28);
        var d3 = Math.hypot(off.x - (st.mx + 24), off.y - (st.my - 28));
        if (d3 > peak) peak = d3;
      }
      return roundTo(peak, 2);
    }

    function getSpongeMetrics() {
      var unlockedCount = 0;
      var weightSum = 0;
      for (var i = 0; i < spanStates.length; i++) {
        if (spanStates[i].unlocked) unlockedCount++;
        weightSum += spanStates[i].swellWeight;
      }
      var totalCount = 6;
      return {
        unlockedCount: unlockedCount,
        totalCount: totalCount,
        saturation: unlockedCount / totalCount,
        animatedSaturation: roundTo(weightSum / totalCount, 4),
        volumePct: roundTo(100 + unlockedCount * 11.4, 1),
        animatedVolumePct: roundTo(100 + weightSum * 11.4, 1),
        maxDisplacementPx: computePeakDisplacementSample(),
        closedCausalLoop: unlockedCount === totalCount
      };
    }

    function pinAnchor(id) {
      var a = resolveAnchor(id);
      if (!a) {
        caliper.pinnedAnchorId = null;
        caliper.secondAnchorId = null;
        caliper.activeSpanId = null;
        caliper.livePointer = null;
        var emptyRes = {
          matched: false,
          kind: "single_point",
          anchorId: null,
          cubits: 0,
          angleDeg: 0,
          muteStatus: MUTE_STATUS_TEXT
        };
        caliper.lastMeasurement = emptyRes;
        return emptyRes;
      }

      var defPos = deformPoint(a.x, a.y);
      caliper.pinnedAnchorId = a.id;
      caliper.secondAnchorId = null;
      caliper.activeSpanId = null;
      caliper.livePointer = { x: defPos.x, y: defPos.y };

      var res = {
        matched: false,
        kind: "single_point",
        anchorId: a.id,
        code: a.code,
        label: a.label,
        cubits: 0,
        angleDeg: 0,
        partnerHintIds: partnerMap[a.id].slice(),
        muteStatus: MUTE_STATUS_TEXT
      };
      caliper.lastMeasurement = res;
      return res;
    }

    function setLivePointer(x, y, hoveredAnchorId) {
      var hov = resolveAnchor(hoveredAnchorId);
      caliper.hoveredAnchorId = hov ? hov.id : null;
      if (typeof x === "number" && typeof y === "number") {
        caliper.livePointer = {
          x: clamp(x, 0, LOGICAL_WIDTH),
          y: clamp(y, 0, LOGICAL_HEIGHT)
        };
      }

      var cubits = 0;
      var angleDeg = 0;
      if (caliper.pinnedAnchorId && caliper.livePointer) {
        var pinA = anchorById[caliper.pinnedAnchorId];
        var targetPos = hov ? deformPoint(hov.x, hov.y) : caliper.livePointer;
        var pinPos = deformPoint(pinA.x, pinA.y);
        var dx = targetPos.x - pinPos.x;
        var dy = targetPos.y - pinPos.y;
        cubits = roundTo(Math.hypot(dx, dy) * CUBITS_PER_PX, 2);
        var rawDeg = Math.abs((Math.atan2(-dy, dx) * 180) / Math.PI);
        if (rawDeg > 90) rawDeg = 180 - rawDeg;
        angleDeg = roundTo(rawDeg, 1);
      }

      return {
        matched: false,
        hasPinnedJaw: Boolean(caliper.pinnedAnchorId),
        pinnedAnchorId: caliper.pinnedAnchorId,
        hoveredAnchorId: caliper.hoveredAnchorId,
        pointerX: caliper.livePointer ? caliper.livePointer.x : null,
        pointerY: caliper.livePointer ? caliper.livePointer.y : null,
        cubits: cubits,
        angleDeg: angleDeg,
        muteStatus: MUTE_STATUS_TEXT
      };
    }

    function liftCaliper() {
      caliper.pinnedAnchorId = null;
      caliper.secondAnchorId = null;
      caliper.activeSpanId = null;
      caliper.livePointer = null;
      caliper.unlinkedGlow = 0;
      caliper.lastMeasurement = null;
      return {
        matched: false,
        lifted: true,
        cubits: 0,
        angleDeg: 0,
        muteStatus: MUTE_STATUS_TEXT
      };
    }

    function measurePair(idA, idB) {
      var a = resolveAnchor(idA);
      var b = resolveAnchor(idB);

      // Single-point or self-pair -> strictly mute
      if (!a || !b || a.id === b.id) {
        var singleAnchor = a || b;
        caliper.pinnedAnchorId = singleAnchor ? singleAnchor.id : null;
        caliper.secondAnchorId = null;
        caliper.activeSpanId = null;
        if (singleAnchor) {
          var spPos = deformPoint(singleAnchor.x, singleAnchor.y);
          caliper.livePointer = { x: spPos.x, y: spPos.y };
        }
        var singleRes = {
          matched: false,
          kind: "single_point",
          anchorId: singleAnchor ? singleAnchor.id : null,
          pair: singleAnchor ? [singleAnchor.id, singleAnchor.id] : [],
          codes: singleAnchor ? [singleAnchor.code, singleAnchor.code] : [],
          cubits: 0,
          angleDeg: 0,
          muteStatus: MUTE_STATUS_TEXT
        };
        caliper.lastMeasurement = singleRes;
        return singleRes;
      }

      var key = pairKey(a.id, b.id);
      var matchedSpan = spanByKey[key];

      // Unlinked architectural pair -> strictly mute geometric metrics ONLY
      if (!matchedSpan) {
        var metrics = computeRawMetrics(a, b);
        caliper.pinnedAnchorId = a.id;
        caliper.secondAnchorId = b.id;
        caliper.activeSpanId = null;
        var defB = deformPoint(b.x, b.y);
        caliper.livePointer = { x: defB.x, y: defB.y };
        caliper.unlinkedGlow = 1.0;

        var unlinkedRes = {
          matched: false,
          kind: "unlinked_span",
          pair: [a.id, b.id],
          codes: [a.code, b.code],
          cubits: metrics.cubits,
          angleDeg: metrics.angleDeg,
          muteStatus: MUTE_STATUS_TEXT
        };
        caliper.lastMeasurement = unlinkedRes;
        return unlinkedRes;
      }

      // Canonical 2-point relational span unlocked!
      var newlyUnlocked = !matchedSpan.unlocked;
      if (newlyUnlocked) {
        matchedSpan.unlocked = true;
        unlockCounter += 1;
        matchedSpan.unlockSeq = unlockCounter;
        matchedSpan.swellWeight = lastReducedMotion ? 1.0 : Math.max(matchedSpan.swellWeight, 0.46);
        matchedSpan.swellVelocity = lastReducedMotion ? 0 : 2.2;
      }
      matchedSpan.flashPulse = 1.0;
      hasAnySwell = true;

      caliper.pinnedAnchorId = a.id;
      caliper.secondAnchorId = b.id;
      caliper.activeSpanId = matchedSpan.spec.id;
      caliper.unlinkedGlow = 0;
      var posB = deformPoint(b.x, b.y);
      caliper.livePointer = { x: posB.x, y: posB.y };

      var scarObj = buildRevealedScar(matchedSpan);
      var matchedRes = {
        matched: true,
        kind: "canonical_span",
        newlyUnlocked: newlyUnlocked,
        id: scarObj.id,
        numeral: scarObj.numeral,
        chord: scarObj.chord,
        codes: scarObj.codes,
        pair: scarObj.pair,
        cubits: scarObj.cubits,
        angleDeg: scarObj.angleDeg,
        measurement: scarObj.measurement,
        spatialPole: scarObj.spatialPole,
        memoryEvent: scarObj.memoryEvent,
        motif: scarObj.motif,
        motifLabel: scarObj.motifLabel,
        causalLinks: scarObj.causalLinks,
        activeLinkedIds: scarObj.activeLinkedIds,
        activeLinkedChords: scarObj.activeLinkedChords,
        scar: scarObj,
        spongeMetrics: getSpongeMetrics()
      };
      caliper.lastMeasurement = matchedRes;
      return matchedRes;
    }

    function measureChord(chordOrIndex) {
      var target = null;
      if (typeof chordOrIndex === "number") {
        target = CHORD_CATALOG[chordOrIndex] || null;
      } else if (typeof chordOrIndex === "string") {
        var trimmed = chordOrIndex.trim();
        for (var i = 0; i < CHORD_CATALOG.length; i++) {
          var entry = CHORD_CATALOG[i];
          if (
            entry.id === trimmed ||
            entry.chord === trimmed ||
            entry.keyDigit === trimmed ||
            entry.numeral === trimmed.toUpperCase()
          ) {
            target = entry;
            break;
          }
        }
      }
      if (!target) {
        return {
          matched: false,
          kind: "unlinked_span",
          cubits: 0,
          angleDeg: 0,
          muteStatus: MUTE_STATUS_TEXT
        };
      }
      return measurePair(target.pair[0], target.pair[1]);
    }

    function selectAnchor(id) {
      var a = resolveAnchor(id);
      if (!a) return liftCaliper();
      if (!caliper.pinnedAnchorId || caliper.secondAnchorId) {
        return pinAnchor(a.id);
      }
      return measurePair(caliper.pinnedAnchorId, a.id);
    }

    function step(dt, reducedMotion) {
      var safeDt = typeof dt === "number" && isFinite(dt) ? clamp(dt, 0, 0.1) : 1 / 60;
      lastReducedMotion = Boolean(reducedMotion);
      internalTime += safeDt;

      if (caliper.unlinkedGlow > 0) {
        caliper.unlinkedGlow = Math.max(0, caliper.unlinkedGlow - safeDt * 1.4);
      }

      // Damped marine-sponge harmonic spring (stiffness k = 28, damping c = 8.4)
      var stiffness = 28.0;
      var damping = 8.4;

      for (var i = 0; i < spanStates.length; i++) {
        var st = spanStates[i];
        var target = st.unlocked ? 1.0 : 0.0;

        if (st.flashPulse > 0) {
          st.flashPulse = Math.max(0, st.flashPulse - safeDt * 1.6);
        }

        if (lastReducedMotion) {
          st.swellWeight = target;
          st.swellVelocity = 0;
          continue;
        }

        var diff = target - st.swellWeight;
        if (Math.abs(diff) < 0.0005 && Math.abs(st.swellVelocity) < 0.001) {
          st.swellWeight = target;
          st.swellVelocity = 0;
        } else {
          var accel = diff * stiffness - st.swellVelocity * damping;
          st.swellVelocity += accel * safeDt;
          st.swellWeight = clamp(st.swellWeight + st.swellVelocity * safeDt, 0, 1.08);
          if (!st.unlocked && st.swellWeight < 0.001) {
            st.swellWeight = 0;
            st.swellVelocity = 0;
          }
        }
      }

      refreshHasAnySwell();
      return getSpongeMetrics();
    }

    function resetSponge() {
      for (var i = 0; i < spanStates.length; i++) {
        spanStates[i].unlocked = false;
        spanStates[i].unlockSeq = 0;
        spanStates[i].swellWeight = 0;
        spanStates[i].swellVelocity = 0;
        spanStates[i].flashPulse = 0;
      }
      unlockCounter = 0;
      hasAnySwell = false;
      liftCaliper();
      return getSpongeMetrics();
    }

    function getAnchorPosition(anchorId, useDeformed) {
      var a = resolveAnchor(anchorId);
      if (!a) return null;
      if (useDeformed === false) {
        return { id: a.id, code: a.code, x: a.x, y: a.y, label: a.label, swell: 0 };
      }
      var d = deformPoint(a.x, a.y);
      return { id: a.id, code: a.code, x: d.x, y: d.y, baseX: a.x, baseY: a.y, label: a.label, swell: d.swell };
    }

    function findNearestAnchor(x, y, maxRadius, useDeformed) {
      var limit = typeof maxRadius === "number" ? maxRadius : 28;
      var best = null;
      var bestDist = limit;
      for (var i = 0; i < anchors.length; i++) {
        var a = anchors[i];
        var pos = useDeformed === false ? { x: a.x, y: a.y, swell: 0 } : deformPoint(a.x, a.y);
        var dist = Math.hypot(x - pos.x, y - pos.y);
        if (dist <= bestDist) {
          bestDist = dist;
          best = {
            id: a.id,
            code: a.code,
            label: a.label,
            x: a.x,
            y: a.y,
            deformedX: pos.x,
            deformedY: pos.y,
            distance: dist
          };
        }
      }
      return best;
    }

    function getCaliperState() {
      return {
        pinnedAnchorId: caliper.pinnedAnchorId,
        secondAnchorId: caliper.secondAnchorId,
        activeSpanId: caliper.activeSpanId,
        hoveredAnchorId: caliper.hoveredAnchorId,
        livePointer: caliper.livePointer ? { x: caliper.livePointer.x, y: caliper.livePointer.y } : null,
        partnerHintIds: caliper.pinnedAnchorId ? partnerMap[caliper.pinnedAnchorId].slice() : [],
        isOpen: Boolean(caliper.pinnedAnchorId)
      };
    }

    // =========================================================================
    // BESPOKE RELATIONAL SCAR ETCHINGS (Lampblack / Iron-Gall Sepia / Verdigris)
    // =========================================================================

    function drawDeformedPolyline(ctx, pts) {
      if (!pts.length) return;
      var p0 = deformPoint(pts[0][0], pts[0][1]);
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      for (var i = 1; i < pts.length; i++) {
        var pi = deformPoint(pts[i][0], pts[i][1]);
        ctx.lineTo(pi.x, pi.y);
      }
      ctx.stroke();
    }

    function drawSampledCurve(ctx, sampleFn, steps) {
      var n = steps || 24;
      ctx.beginPath();
      for (var i = 0; i <= n; i++) {
        var u = i / n;
        var raw = sampleFn(u);
        var d = deformPoint(raw.x, raw.y);
        if (i === 0) ctx.moveTo(d.x, d.y);
        else ctx.lineTo(d.x, d.y);
      }
      ctx.stroke();
    }

    // Span 1: Swaying pendulum plumb-scratches beneath lamppost crown (310,168) -> cobbles (310,292)
    function renderEtchingSpan1(ctx, st, w, time, reducedMotion) {
      var sway = reducedMotion ? 0.06 : Math.sin(time * 1.45) * 0.14;
      var ax = st.ax;
      var ay = st.ay;

      ctx.save();
      // Vertical surveyor plumb drop & witness ticks (4.35 cubits)
      ctx.strokeStyle = "rgba(45, 106, 99, " + (0.55 * w) + ")";
      ctx.lineWidth = 1.1;
      setDashSafe(ctx, [4, 3]);
      drawDeformedPolyline(ctx, [
        [ax - 18, ay],
        [ax - 18, st.by]
      ]);
      setDashSafe(ctx, []);
      drawDeformedPolyline(ctx, [
        [ax - 23, ay],
        [ax - 13, ay]
      ]);
      drawDeformedPolyline(ctx, [
        [ax - 23, st.by],
        [ax - 13, st.by]
      ]);

      // Swaying cord hairlines (primary + ghosted pendulum extremes)
      var cordLen = 92;
      var angles = [-0.21, sway, 0.21];
      for (var k = 0; k < angles.length; k++) {
        var ang = angles[k];
        var isLive = k === 1;
        ctx.strokeStyle = isLive
          ? "rgba(28, 25, 23, " + (0.82 * w) + ")"
          : "rgba(74, 50, 31, " + (0.34 * w) + ")";
        ctx.lineWidth = isLive ? 1.4 : 0.85;
        var tx = ax + Math.sin(ang) * cordLen;
        var ty = ay + Math.cos(ang) * cordLen;
        drawSampledCurve(
          ctx,
          function (u) {
            return { x: ax + (tx - ax) * u, y: ay + (ty - ay) * u };
          },
          10
        );
      }

      // Concentric burin-scratched pendulum arcs where swaying feet grazed the air above plinth
      for (var rIdx = 0; rIdx < 6; rIdx++) {
        var rad = 84 + rIdx * 4.5;
        var spread = 0.28 - rIdx * 0.022;
        ctx.strokeStyle =
          rIdx % 2 === 0
            ? "rgba(28, 25, 23, " + ((0.68 - rIdx * 0.08) * w) + ")"
            : "rgba(74, 50, 31, " + ((0.56 - rIdx * 0.06) * w) + ")";
        ctx.lineWidth = rIdx === 2 ? 1.35 : 0.85;
        (function (radius, spAngle) {
          drawSampledCurve(
            ctx,
            function (u) {
              var theta = -spAngle + u * (spAngle * 2);
              return {
                x: ax + Math.sin(theta) * radius,
                y: ay + Math.cos(theta) * radius
              };
            },
            18
          );
        })(rad, spread);
      }

      // Twin boot-heel graze crescents hovering 30px above the plinth cobbles
      var footX = ax + Math.sin(sway) * 92;
      var footY = ay + Math.cos(sway) * 92;
      ctx.strokeStyle = "rgba(28, 25, 23, " + (0.78 * w) + ")";
      ctx.lineWidth = 1.25;
      drawDeformedPolyline(ctx, [
        [footX - 7, footY - 3],
        [footX - 3, footY + 3],
        [footX - 1, footY - 1]
      ]);
      drawDeformedPolyline(ctx, [
        [footX + 2, footY - 1],
        [footX + 5, footY + 4],
        [footX + 9, footY - 2]
      ]);
      ctx.restore();
    }

    // Span 2: Nuptial festoon scroll-garlands from lamppost (310,168) -> opposite railing (525,214)
    function renderEtchingSpan2(ctx, st, w, time, reducedMotion) {
      var breeze = reducedMotion ? 0 : Math.sin(time * 1.15) * 2.4;
      ctx.save();

      // Straight surveyor catenary chord datum
      ctx.strokeStyle = "rgba(45, 106, 99, " + (0.42 * w) + ")";
      ctx.lineWidth = 0.9;
      setDashSafe(ctx, [5, 4]);
      drawSampledCurve(
        ctx,
        function (u) {
          return {
            x: st.ax + (st.bx - st.ax) * u,
            y: st.ay + (st.by - st.ay) * u
          };
        },
        16
      );
      setDashSafe(ctx, []);

      // Three draped festoon swags + decorative laurel/ribbon rosettes
      var sags = [22, 35, 48];
      for (var s = 0; s < sags.length; s++) {
        var sag = sags[s];
        ctx.strokeStyle =
          s === 1
            ? "rgba(74, 50, 31, " + (0.85 * w) + ")"
            : "rgba(28, 25, 23, " + (0.58 * w) + ")";
        ctx.lineWidth = s === 1 ? 1.55 : 1.0;

        (function (sagVal) {
          drawSampledCurve(
            ctx,
            function (u) {
              var parabola = 4 * u * (1 - u);
              var harmonic = Math.sin(u * Math.PI * 3) * 2.6;
              return {
                x: st.ax + (st.bx - st.ax) * u + breeze * parabola * 0.4,
                y: st.ay + (st.by - st.ay) * u + sagVal * parabola + harmonic
              };
            },
            28
          );
        })(sag);
      }

      // Ribbon rosette knots & pendant scrolls along primary swag
      var knotFracs = [0.2, 0.5, 0.8];
      for (var k = 0; k < knotFracs.length; k++) {
        var u = knotFracs[k];
        var para = 4 * u * (1 - u);
        var kx = st.ax + (st.bx - st.ax) * u;
        var ky = st.ay + (st.by - st.ay) * u + 35 * para;
        var kd = deformPoint(kx, ky);

        ctx.fillStyle = "rgba(156, 98, 42, " + (0.78 * w) + ")";
        ctx.strokeStyle = "rgba(28, 25, 23, " + (0.78 * w) + ")";
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(kd.x, kd.y, 3.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Hanging ribbon scroll tails
        drawDeformedPolyline(ctx, [
          [kx - 1, ky + 3],
          [kx - 5, ky + 13],
          [kx - 2, ky + 18]
        ]);
        drawDeformedPolyline(ctx, [
          [kx + 1, ky + 3],
          [kx + 6, ky + 12],
          [kx + 3, ky + 17]
        ]);
      }
      ctx.restore();
    }

    // Span 3: Adulterer's dawn vault trajectory from opposite railing (525,214) -> alley landing (525,368)
    function renderEtchingSpan3(ctx, st, w, time, reducedMotion) {
      ctx.save();

      // Subtle dawn horizon rays etched behind balcony railing crest
      var crest = deformPoint(st.ax, st.ay);
      ctx.strokeStyle = "rgba(176, 122, 52, " + (0.48 * w) + ")";
      ctx.lineWidth = 0.9;
      for (var r = 0; r < 7; r++) {
        var aRay = -Math.PI + (r / 6) * Math.PI;
        ctx.beginPath();
        ctx.moveTo(crest.x + Math.cos(aRay) * 9, crest.y + Math.sin(aRay) * 9);
        ctx.lineTo(crest.x + Math.cos(aRay) * 22, crest.y + Math.sin(aRay) * 22);
        ctx.stroke();
      }

      // Parabolic vault over railing -> plunging arc to lower stair-alley
      ctx.strokeStyle = "rgba(28, 25, 23, " + (0.86 * w) + ")";
      ctx.lineWidth = 1.5;
      drawSampledCurve(
        ctx,
        function (u) {
          // Quadratic-cubic hybrid vault clearing top of railing toward left (-26px) then dropping to (525,368)
          var arcOut = Math.sin(u * Math.PI) * -28;
          var vaultLift = u < 0.25 ? -Math.sin((u / 0.25) * Math.PI) * 20 : 0;
          return {
            x: st.ax + arcOut,
            y: st.ay + (st.by - st.ay) * (u * u * 0.82 + u * 0.18) + vaultLift
          };
        },
        28
      );

      // Sequential burin indentation ticks along descent trajectory
      var pulsePhase = reducedMotion ? 0.5 : (time * 0.65) % 1;
      for (var m = 1; m <= 7; m++) {
        var um = m / 8;
        var mx = st.ax + Math.sin(um * Math.PI) * -28;
        var my = st.ay + (st.by - st.ay) * (um * um * 0.82 + um * 0.18);
        var boost = Math.abs(um - pulsePhase) < 0.16 ? 0.22 : 0;
        ctx.strokeStyle = "rgba(74, 50, 31, " + clamp((0.58 + boost) * w, 0, 1) + ")";
        ctx.lineWidth = 1.15;
        drawDeformedPolyline(ctx, [
          [mx - 6, my - 3],
          [mx, my + 3],
          [mx + 6, my - 2]
        ]);
      }

      // Stone landing impact shock-indentations on dawn_alley cobbles
      var land = deformPoint(st.bx, st.by);
      ctx.strokeStyle = "rgba(45, 106, 99, " + (0.72 * w) + ")";
      ctx.lineWidth = 1.15;
      ctx.beginPath();
      drawEllipseSafe(ctx, land.x, land.y + 2, 16, 5.5, 0);
      ctx.stroke();
      ctx.beginPath();
      drawEllipseSafe(ctx, land.x, land.y + 2, 9, 3, 0);
      ctx.stroke();

      ctx.restore();
    }

    // Span 4: Feline claw-tick indentations down tilted gutter (590,132) -> alcove window (562,196)
    function renderEtchingSpan4(ctx, st, w) {
      ctx.save();

      // 14°20' surveyor canted eaves wedge at tilted_gutter (590,132)
      var gPos = deformPoint(st.ax, st.ay);
      ctx.strokeStyle = "rgba(45, 106, 99, " + (0.72 * w) + ")";
      ctx.lineWidth = 1.05;
      ctx.beginPath();
      ctx.moveTo(gPos.x - 28, gPos.y);
      ctx.lineTo(gPos.x + 16, gPos.y);
      ctx.moveTo(gPos.x + 16, gPos.y);
      ctx.lineTo(gPos.x - 26, gPos.y + 11);
      ctx.stroke();

      // Sinuous slip-line from gutter lip curving smoothly into casement window grating
      ctx.strokeStyle = "rgba(74, 50, 31, " + (0.8 * w) + ")";
      ctx.lineWidth = 1.25;
      drawSampledCurve(
        ctx,
        function (u) {
          var curveS = Math.sin(u * Math.PI * 1.5) * 8;
          return {
            x: st.ax + (st.bx - st.ax) * u - curveS,
            y: st.ay + (st.by - st.ay) * u + Math.sin(u * Math.PI) * 5
          };
        },
        20
      );

      // Seven delicate 4-claw scratch quartets skittering down zinc scales into window
      ctx.strokeStyle = "rgba(28, 25, 23, " + (0.85 * w) + ")";
      ctx.lineWidth = 0.95;
      for (var stepIdx = 0; stepIdx < 6; stepIdx++) {
        var u = 0.12 + stepIdx * 0.15;
        var side = stepIdx % 2 === 0 ? -3.5 : 3.5;
        var cx = st.ax + (st.bx - st.ax) * u - Math.sin(u * Math.PI * 1.5) * 8 + side;
        var cy = st.ay + (st.by - st.ay) * u + Math.sin(u * Math.PI) * 5;
        for (var c = -1.5; c <= 1.5; c += 1.0) {
          drawDeformedPolyline(ctx, [
            [cx + c * 2.1, cy - 2.5],
            [cx + c * 2.1 - 1.6, cy + 3.2]
          ]);
        }
      }

      // Curled feline tail-scroll vanishing between casement bars at (562,196)
      drawSampledCurve(
        ctx,
        function (u) {
          var theta = u * Math.PI * 1.65;
          var r = (1 - u * 0.55) * 11;
          return {
            x: st.bx - 4 + Math.cos(theta) * r,
            y: st.by - 4 + Math.sin(theta) * r
          };
        },
        16
      );

      ctx.restore();
    }

    // Span 5: Offshore gunboat silhouette beyond cape (885,176) & 28° shell parabola -> shattered eaves (590,132)
    function renderEtchingSpan5(ctx, st, w, time, reducedMotion) {
      ctx.save();

      // Copperplate miniature gunboat silhouette suddenly appearing just beyond sea_cape (x ~ 914, y ~ 173)
      var gx = st.ax + 28;
      var gy = st.ay - 3;
      var gp = deformPoint(gx, gy);

      ctx.fillStyle = "rgba(28, 25, 23, " + (0.82 * w) + ")";
      ctx.strokeStyle = "rgba(28, 25, 23, " + (0.9 * w) + ")";
      ctx.lineWidth = 1.1;

      // Low ironclad hull
      ctx.beginPath();
      ctx.moveTo(gp.x - 18, gp.y);
      ctx.lineTo(gp.x + 17, gp.y);
      ctx.lineTo(gp.x + 13, gp.y + 5.5);
      ctx.lineTo(gp.x - 14, gp.y + 5.5);
      ctx.closePath();
      ctx.fill();

      // Superstructure, raked funnel & 28° elevated deck gun barrel aimed toward bastion
      ctx.beginPath();
      ctx.rect(gp.x - 5, gp.y - 5, 10, 5);
      ctx.fill();
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(gp.x + 2, gp.y - 5);
      ctx.lineTo(gp.x + 4, gp.y - 12);
      ctx.moveTo(gp.x - 7, gp.y - 2);
      ctx.lineTo(gp.x - 17, gp.y - 8);
      ctx.stroke();

      // Engraved smoke-scroll plume trailing seaward from funnel
      ctx.strokeStyle = "rgba(74, 50, 31, " + (0.55 * w) + ")";
      ctx.lineWidth = 0.95;
      drawSampledCurve(
        ctx,
        function (u) {
          return {
            x: gx + 4 + u * 26,
            y: gy - 12 - u * 9 + Math.sin(u * Math.PI * 3) * 2.5
          };
        },
        14
      );

      // Waterline ripples beneath hull
      ctx.strokeStyle = "rgba(45, 106, 99, " + (0.55 * w) + ")";
      drawDeformedPolyline(ctx, [
        [gx - 21, gy + 8],
        [gx + 20, gy + 8]
      ]);

      // High 28° ballistic shell parabola from gunboat muzzle to tilted_gutter (590,132)
      var startX = gx - 17;
      var startY = gy - 8;
      ctx.strokeStyle = "rgba(156, 72, 42, " + (0.82 * w) + ")";
      ctx.lineWidth = 1.45;
      setDashSafe(ctx, [6, 4]);
      drawSampledCurve(
        ctx,
        function (u) {
          var arcLift = 4 * u * (1 - u) * 86;
          return {
            x: startX + (st.bx - startX) * u,
            y: startY + (st.by - startY) * u - arcLift
          };
        },
        34
      );
      setDashSafe(ctx, []);

      // Animated / stationary shell reticle along ballistic parabola
      var uShell = reducedMotion ? 0.62 : (time * 0.28) % 1;
      var sx = startX + (st.bx - startX) * uShell;
      var sy = startY + (st.by - startY) * uShell - 4 * uShell * (1 - uShell) * 86;
      var sd = deformPoint(sx, sy);
      ctx.fillStyle = "rgba(168, 76, 38, " + (0.88 * w) + ")";
      ctx.beginPath();
      ctx.arc(sd.x, sd.y, 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Shrapnel burst rays & curled zinc-scale blast scrolls at shattered guttering (590,132)
      var hit = deformPoint(st.bx, st.by);
      ctx.strokeStyle = "rgba(28, 25, 23, " + (0.82 * w) + ")";
      ctx.lineWidth = 1.1;
      for (var bIdx = 0; bIdx < 8; bIdx++) {
        var theta = -Math.PI * 0.92 + (bIdx / 7) * Math.PI * 0.95;
        var rIn = 5;
        var rOut = bIdx % 2 === 0 ? 19 : 13;
        ctx.beginPath();
        ctx.moveTo(hit.x + Math.cos(theta) * rIn, hit.y + Math.sin(theta) * rIn);
        ctx.lineTo(hit.x + Math.cos(theta) * rOut, hit.y + Math.sin(theta) * rOut);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Span 6: 3 ragged fishnet tears (215,496) <-> 3 dock elders & swaddling bundle scroll (365,532)
    function renderEtchingSpan6(ctx, st, w, time, reducedMotion) {
      ctx.save();

      // Three ragged tear apertures at suspended quay fishnet (215,496)
      var tearOffsets = [
        [-16, -8, 9],
        [2, 3, 8],
        [17, -4, 10.5]
      ];
      ctx.strokeStyle = "rgba(28, 25, 23, " + (0.86 * w) + ")";
      ctx.lineWidth = 1.2;
      for (var tIdx = 0; tIdx < tearOffsets.length; tIdx++) {
        var to = tearOffsets[tIdx];
        var tx = st.ax + to[0];
        var ty = st.ay + to[1];
        var tr = to[2];
        drawDeformedPolyline(ctx, [
          [tx - tr, ty - 2],
          [tx - tr * 0.3, ty - tr * 0.65],
          [tx + tr * 0.4, ty - tr * 0.25],
          [tx + tr, ty + 2],
          [tx + tr * 0.25, ty + tr * 0.65],
          [tx - tr * 0.45, ty + tr * 0.3],
          [tx - tr, ty - 2]
        ]);
      }

      // Three interwoven chiromantic lifeline / net-mending threads to the 3 dock elders at (365,532)
      for (var eIdx = 0; eIdx < 3; eIdx++) {
        var startOff = tearOffsets[eIdx];
        var elderX = st.bx - 20 + eIdx * 20;
        var elderY = st.by - 4 + (eIdx === 1 ? -3 : 1);
        ctx.strokeStyle =
          eIdx === 1
            ? "rgba(45, 106, 99, " + (0.82 * w) + ")"
            : "rgba(74, 50, 31, " + (0.72 * w) + ")";
        ctx.lineWidth = eIdx === 1 ? 1.35 : 1.0;

        (function (sx0, sy0, ex0, ey0, idx) {
          drawSampledCurve(
            ctx,
            function (u) {
              var weave = Math.sin(u * Math.PI * 4 + idx * 1.3) * 5.5;
              return {
                x: sx0 + (ex0 - sx0) * u,
                y: sy0 + (ey0 - sy0) * u + weave + 4 * u * (1 - u) * 10
              };
            },
            26
          );
        })(st.ax + startOff[0], st.ay + startOff[1], elderX, elderY, eIdx);
      }

      // Etched swaddling-clothes spiral scroll & "hundredth retelling" concentric rings on dock bench
      var swaddleX = st.bx + 26;
      var swaddleY = st.by + 7;
      var swPos = deformPoint(swaddleX, swaddleY);
      ctx.strokeStyle = "rgba(156, 98, 42, " + (0.85 * w) + ")";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      drawEllipseSafe(ctx, swPos.x, swPos.y, 11, 5.2, -0.22);
      ctx.stroke();

      // Criss-cross swaddling band strokes inside bundle
      drawDeformedPolyline(ctx, [
        [swaddleX - 7, swaddleY - 3],
        [swaddleX + 5, swaddleY + 3]
      ]);
      drawDeformedPolyline(ctx, [
        [swaddleX - 4, swaddleY + 4],
        [swaddleX + 7, swaddleY - 2]
      ]);

      // Concentric oral-memory echo rings around dock mooring bench
      var rippleShift = reducedMotion ? 0 : (time * 0.35) % 1;
      var dockPos = deformPoint(st.bx, st.by);
      for (var ring = 0; ring < 3; ring++) {
        var rr = 16 + ((ring + rippleShift) % 3) * 11;
        ctx.strokeStyle = "rgba(45, 106, 99, " + ((0.46 - ring * 0.11) * w) + ")";
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        drawEllipseSafe(ctx, dockPos.x, dockPos.y + 3, rr * 1.45, rr * 0.42, 0);
        ctx.stroke();
      }

      ctx.restore();
    }

    function renderCausalFilaments(ctx, time, reducedMotion) {
      // Adjacent pairs around the 6-part closed genealogical loop: 0-1, 1-2, 2-3, 3-4, 4-5, 5-0
      var closedAll = getUnlockedCount() === 6;
      ctx.save();

      for (var i = 0; i < spanStates.length; i++) {
        var cur = spanStates[i];
        var nxt = spanStates[(i + 1) % spanStates.length];
        var linkWeight = Math.min(cur.swellWeight, nxt.swellWeight);
        if (linkWeight <= 0.02) continue;

        var p1 = deformPoint(cur.mx, cur.my);
        var p2 = deformPoint(nxt.mx, nxt.my);
        var cx = (p1.x + p2.x) * 0.5 + (p1.y - p2.y) * 0.14;
        var cy = (p1.y + p2.y) * 0.5 - 24;

        var pulse = closedAll && !reducedMotion ? 0.08 * Math.sin(time * 2.0 + i) : 0;
        var alpha = clamp((closedAll ? 0.68 : 0.46) * linkWeight + pulse, 0, 0.92);

        // Outer warm sepia glow + inner golden-brass filament
        ctx.strokeStyle = "rgba(196, 148, 62, " + alpha + ")";
        ctx.lineWidth = closedAll ? 2.0 : 1.35;
        setDashSafe(ctx, closedAll ? [] : [7, 4]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(cx, cy, p2.x, p2.y);
        ctx.stroke();
        setDashSafe(ctx, []);

        // Compass junction rosette at each span midpoint node
        ctx.fillStyle = "rgba(216, 172, 82, " + alpha + ")";
        ctx.strokeStyle = "rgba(44, 32, 16, " + alpha + ")";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, closedAll ? 4.2 : 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // When all 6/6 unlock, draw subtle central Genealogical Ring Astrolabe seal
      if (closedAll) {
        var sealCenter = deformPoint(478, 304);
        var rot = reducedMotion ? 0 : time * 0.08;
        ctx.save();
        ctx.translate(sealCenter.x, sealCenter.y);
        ctx.rotate(rot);
        ctx.strokeStyle = "rgba(188, 142, 56, 0.34)";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(0, 0, 34, 0, Math.PI * 2);
        ctx.stroke();
        setDashSafe(ctx, [3, 3]);
        ctx.beginPath();
        ctx.arc(0, 0, 27, 0, Math.PI * 2);
        ctx.stroke();
        setDashSafe(ctx, []);
        for (var spoke = 0; spoke < 6; spoke++) {
          var sa = (spoke * Math.PI) / 3;
          ctx.beginPath();
          ctx.moveTo(Math.cos(sa) * 22, Math.sin(sa) * 22);
          ctx.lineTo(Math.cos(sa) * 37, Math.sin(sa) * 37);
          ctx.stroke();
        }
        ctx.restore();
      }

      ctx.restore();
    }

    // =========================================================================
    // BRASS SURVEYOR'S PROPORTIONAL CALIPERS (Hinged Crown, Vernier Arc, Steel Tips)
    // =========================================================================

    function renderBrassCalipers(ctx, jawA, jawB, meta) {
      var ax = jawA.x;
      var ay = jawA.y;
      var bx = jawB.x;
      var by = jawB.y;
      var dx = bx - ax;
      var dy = by - ay;
      var spanPx = Math.hypot(dx, dy);

      // For single-anchor poise (spanPx < 4), slightly part steel tips over the anchor
      var isSinglePoint = spanPx < 4;
      var tipAx = isSinglePoint ? ax - 7 : ax;
      var tipAy = ay;
      var tipBx = isSinglePoint ? ax + 7 : bx;
      var tipBy = by;

      var effDx = tipBx - tipAx;
      var effDy = tipBy - tipAy;
      var effSpan = Math.hypot(effDx, effDy);
      var midX = (tipAx + tipBx) * 0.5;
      var midY = (tipAy + tipBy) * 0.5;

      // Choose perpendicular normal pointing upward on canvas (ny <= 0)
      var nx = effDy / effSpan;
      var ny = -effDx / effSpan;
      if (ny > 0) {
        nx = -nx;
        ny = -ny;
      }
      // Blend toward vertical skyward orientation so steep vertical spans still hold crown upright
      var upX = nx * 0.52;
      var upY = ny * 0.52 - 0.68;
      var upLen = Math.hypot(upX, upY) || 1;
      upX /= upLen;
      upY /= upLen;

      var legLen = clamp(effSpan * 0.68 + 86, 94, 248);
      var halfSpan = effSpan * 0.5;
      var crownDist = Math.sqrt(Math.max(58 * 58, legLen * legLen - halfSpan * halfSpan * 0.72));
      var hx = clamp(midX + upX * crownDist, 42, LOGICAL_WIDTH - 42);
      var hy = clamp(midY + upY * crownDist, 28, LOGICAL_HEIGHT - 60);

      ctx.save();

      // 1. Datum measurement witness chord between Jaw A and Jaw B
      if (!isSinglePoint) {
        ctx.save();
        ctx.strokeStyle = meta.isMatched
          ? "rgba(196, 148, 58, 0.88)"
          : "rgba(92, 108, 118, 0.72)";
        ctx.lineWidth = meta.isMatched ? 1.6 : 1.15;
        setDashSafe(ctx, meta.isMatched ? [6, 3] : [4, 4]);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
        setDashSafe(ctx, []);
        ctx.restore();
      }

      // 2. Graduated Brass Vernier Wing Sector Arc bridging the two legs
      var angA = Math.atan2(tipAy - hy, tipAx - hx);
      var angB = Math.atan2(tipBy - hy, tipBx - hx);
      var deltaAng = angB - angA;
      while (deltaAng > Math.PI) deltaAng -= Math.PI * 2;
      while (deltaAng < -Math.PI) deltaAng += Math.PI * 2;

      var arcRad = clamp(crownDist * 0.46, 36, 96);
      var startAng = deltaAng >= 0 ? angA - 0.08 : angB - 0.08;
      var endAng = deltaAng >= 0 ? angB + 0.08 : angA + 0.08;

      ctx.save();
      ctx.strokeStyle = "rgba(62, 44, 18, 0.85)";
      ctx.lineWidth = 7.5;
      ctx.beginPath();
      ctx.arc(hx, hy, arcRad, startAng, endAng);
      ctx.stroke();

      ctx.strokeStyle = makeLinearGrad(
        ctx,
        hx - arcRad,
        hy,
        hx + arcRad,
        hy + arcRad,
        [
          [0, "#e9cf84"],
          [0.5, "#c59840"],
          [1, "#8f6922"]
        ],
        "#c59840"
      );
      ctx.lineWidth = 5.2;
      ctx.beginPath();
      ctx.arc(hx, hy, arcRad, startAng, endAng);
      ctx.stroke();

      // Vernier degree/cubit graduation ticks along sector arc
      var tickSteps = 12;
      ctx.strokeStyle = "rgba(38, 26, 10, 0.82)";
      ctx.lineWidth = 0.85;
      for (var ti = 0; ti <= tickSteps; ti++) {
        var ta = startAng + ((endAng - startAng) * ti) / tickSteps;
        var innerT = arcRad - (ti % 3 === 0 ? 3.2 : 1.8);
        var outerT = arcRad + 2.6;
        ctx.beginPath();
        ctx.moveTo(hx + Math.cos(ta) * innerT, hy + Math.sin(ta) * innerT);
        ctx.lineTo(hx + Math.cos(ta) * outerT, hy + Math.sin(ta) * outerT);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Helper to draw one curved burnished-brass leg + blued-steel needle tip
      function drawCaliperLeg(tx, ty, bowSign) {
        var ldx = tx - hx;
        var ldy = ty - hy;
        var lLen = Math.hypot(ldx, ldy) || 1;
        var uxL = ldx / lLen;
        var uyL = ldy / lLen;
        var pxL = -uyL;
        var pyL = uxL;

        // Steel needle shoulder sits 22px above tip
        var needleLen = Math.min(24, lLen * 0.24);
        var sx = tx - uxL * needleLen;
        var sy = ty - uyL * needleLen;

        var ctrlX = (hx + sx) * 0.5 + pxL * bowSign * 11;
        var ctrlY = (hy + sy) * 0.5 + pyL * bowSign * 11;

        // Subtle shadow under leg
        ctx.save();
        ctx.strokeStyle = "rgba(18, 16, 14, 0.26)";
        ctx.lineWidth = 7.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(hx + 2, hy + 3);
        ctx.quadraticCurveTo(ctrlX + 2, ctrlY + 3, sx + 1.5, sy + 2.5);
        ctx.stroke();
        ctx.restore();

        // Tapered brass leg body polygon
        var wTop = 5.4;
        var wShoulder = 2.3;
        var brassGrad = makeLinearGrad(
          ctx,
          hx - 14,
          hy,
          sx + 14,
          sy,
          [
            [0, "#f5e3a4"],
            [0.38, "#cfa349"],
            [0.78, "#9d7426"],
            [1, "#ecd38a"]
          ],
          "#c99c42"
        );

        ctx.fillStyle = brassGrad;
        ctx.strokeStyle = "#3b290e";
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.moveTo(hx + pxL * wTop, hy + pyL * wTop);
        ctx.quadraticCurveTo(
          ctrlX + pxL * 4.2,
          ctrlY + pyL * 4.2,
          sx + pxL * wShoulder,
          sy + pyL * wShoulder
        );
        ctx.lineTo(sx - pxL * wShoulder, sy - pyL * wShoulder);
        ctx.quadraticCurveTo(
          ctrlX - pxL * 4.2,
          ctrlY - pyL * 4.2,
          hx - pxL * wTop,
          hy - pyL * wTop
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Tempered blued-steel needle tip
        ctx.fillStyle = makeLinearGrad(
          ctx,
          sx,
          sy,
          tx,
          ty,
          [
            [0, "#abb8c2"],
            [0.55, "#4c5b68"],
            [1, "#1e2730"]
          ],
          "#4c5b68"
        );
        ctx.strokeStyle = "#1b2229";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(sx + pxL * 2.0, sy + pyL * 2.0);
        ctx.lineTo(tx, ty);
        ctx.lineTo(sx - pxL * 2.0, sy - pyL * 2.0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Brass collar ferrule at steel-to-brass join
        ctx.fillStyle = "#e6c775";
        ctx.strokeStyle = "#3b290e";
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      drawCaliperLeg(tipAx, tipAy, -1);
      drawCaliperLeg(tipBx, tipBy, 1);

      // Knurled thumb-screw on right leg intersection with vernier arc
      var screwX = hx + Math.cos(angB) * arcRad;
      var screwY = hy + Math.sin(angB) * arcRad;
      ctx.fillStyle = "#ebd082";
      ctx.strokeStyle = "#3b290e";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(screwX, screwY, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 4. Hinged Crown Joint & Turned Surveyor Grip Finial
      var finialAng = Math.atan2(hy - midY, hx - midX);
      var finTipX = hx + Math.cos(finialAng) * 18;
      var finTipY = hy + Math.sin(finialAng) * 18;
      ctx.strokeStyle = "#3b290e";
      ctx.lineWidth = 4.6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(finTipX, finTipY);
      ctx.stroke();
      ctx.strokeStyle = "#deb962";
      ctx.lineWidth = 2.8;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(finTipX, finTipY);
      ctx.stroke();

      // Outer brass crown washer
      ctx.fillStyle = makeRadialGrad(
        ctx,
        hx - 2,
        hy - 2,
        1,
        hx,
        hy,
        10.5,
        [
          [0, "#fbf0c4"],
          [0.55, "#cca043"],
          [1, "#6b4c18"]
        ],
        "#cca043"
      );
      ctx.strokeStyle = "#2f200a";
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(hx, hy, 10.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Slotted steel pivot rivet
      ctx.fillStyle = "#56636e";
      ctx.beginPath();
      ctx.arc(hx, hy, 4.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = "#1c2329";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(hx - 3, hy - 1.5);
      ctx.lineTo(hx + 3, hy + 1.5);
      ctx.stroke();

      // 5. Precision Needle Reticles & Compact Mute/Chord Vernier Plate (ZERO lore words!)
      ctx.strokeStyle = meta.isMatched ? "rgba(196, 148, 58, 0.9)" : "rgba(45, 106, 99, 0.82)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(ax, ay, 5.5, 0, Math.PI * 2);
      ctx.stroke();
      if (!isSinglePoint) {
        ctx.beginPath();
        ctx.arc(bx, by, 5.5, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (meta.badgeText && typeof ctx.fillText === "function") {
        ctx.font = '600 10.5px "SFMono-Regular", Consolas, "Liberation Mono", monospace';
        var textW = ctx.measureText ? ctx.measureText(meta.badgeText).width : meta.badgeText.length * 6.4;
        var padX = 7;
        var boxW = textW + padX * 2;
        var boxH = 19;
        var bxPlate = clamp(midX - boxW * 0.5, 8, LOGICAL_WIDTH - boxW - 8);
        var byPlate = clamp(midY - 24, 8, LOGICAL_HEIGHT - boxH - 8);

        ctx.fillStyle = meta.isMatched ? "rgba(30, 24, 16, 0.88)" : "rgba(24, 30, 34, 0.84)";
        ctx.strokeStyle = meta.isMatched ? "rgba(208, 162, 72, 0.92)" : "rgba(126, 144, 154, 0.78)";
        ctx.lineWidth = 1.0;
        roundedRectPath(ctx, bxPlate, byPlate, boxW, boxH, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = meta.isMatched ? "#f4dfb0" : "#d7e0e4";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(meta.badgeText, bxPlate + boxW * 0.5, byPlate + boxH * 0.5 + 0.5);
      }

      ctx.restore();
    }

    function renderKeyboardFocusReticle(ctx, anchorId, time, reducedMotion) {
      var a = resolveAnchor(anchorId);
      if (!a) return;
      var p = deformPoint(a.x, a.y);
      var pulse = reducedMotion ? 0 : Math.sin(time * 3.4) * 1.8;
      var rad = 14.5 + pulse;

      ctx.save();
      ctx.strokeStyle = "rgba(218, 168, 68, 0.94)";
      ctx.lineWidth = 1.5;
      setDashSafe(ctx, [4, 3]);
      ctx.beginPath();
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.stroke();
      setDashSafe(ctx, []);
      ctx.restore();
    }

    // Main canvas overlay renderer for relational scars + causal loop + hinged brass calipers
    function renderCalipersAndScars(ctx, state, renderPalmChiromancy) {
      if (!ctx) return;
      var stObj = state && typeof state === "object" ? state : {};
      var time = typeof stObj.time === "number" ? stObj.time : internalTime;
      var reducedMotion =
        typeof stObj.reducedMotion === "boolean" ? stObj.reducedMotion : lastReducedMotion;

      var palmFn =
        typeof renderPalmChiromancy === "function"
          ? renderPalmChiromancy
          : typeof stObj.renderPalmChiromancy === "function"
          ? stObj.renderPalmChiromancy
          : root.ZairaMuteBastions && typeof root.ZairaMuteBastions.renderPalmChiromancy === "function"
          ? root.ZairaMuteBastions.renderPalmChiromancy
          : null;

      // 1. Golden-brass causal-chain filaments between adjacent unlocked spans
      renderCausalFilaments(ctx, time, reducedMotion);

      // 2. Unlocked relational memory scars: invoke palm chiromancy + bespoke ink etchings
      for (var i = 0; i < spanStates.length; i++) {
        var spanSt = spanStates[i];
        var w = spanSt.swellWeight;
        if (w <= 0.01) continue;

        if (palmFn) {
          ctx.save();
          palmFn(
            ctx,
            spanSt.ax,
            spanSt.ay,
            spanSt.bx,
            spanSt.by,
            spanSt.spec.motif,
            w,
            deformPoint,
            time,
            reducedMotion
          );
          ctx.restore();
        }

        switch (spanSt.spec.id) {
          case "span_1":
            renderEtchingSpan1(ctx, spanSt, w, time, reducedMotion);
            break;
          case "span_2":
            renderEtchingSpan2(ctx, spanSt, w, time, reducedMotion);
            break;
          case "span_3":
            renderEtchingSpan3(ctx, spanSt, w, time, reducedMotion);
            break;
          case "span_4":
            renderEtchingSpan4(ctx, spanSt, w);
            break;
          case "span_5":
            renderEtchingSpan5(ctx, spanSt, w, time, reducedMotion);
            break;
          case "span_6":
            renderEtchingSpan6(ctx, spanSt, w, time, reducedMotion);
            break;
        }
      }

      // 3. Optional keyboard focus reticle
      if (stObj.focusedAnchorId) {
        renderKeyboardFocusReticle(ctx, stObj.focusedAnchorId, time, reducedMotion);
      }

      // 4. Brass Surveyor's Proportional Calipers whenever Jaw A is pinned or a span is active
      var pinId =
        stObj.pinnedAnchorId !== undefined ? stObj.pinnedAnchorId : caliper.pinnedAnchorId;
      var secondId =
        stObj.secondAnchorId !== undefined ? stObj.secondAnchorId : caliper.secondAnchorId;
      var hovId =
        stObj.hoveredAnchorId !== undefined ? stObj.hoveredAnchorId : caliper.hoveredAnchorId;

      var anchorA = resolveAnchor(pinId);
      if (!anchorA) return;

      var jawA = deformPoint(anchorA.x, anchorA.y);
      var jawB = jawA;
      var badgeText = anchorA.code + " · DATUM";
      var isMatched = false;

      var anchorB = resolveAnchor(secondId);
      if (anchorB) {
        jawB = deformPoint(anchorB.x, anchorB.y);
        var activeSpan = spanByKey[pairKey(anchorA.id, anchorB.id)];
        if (activeSpan && activeSpan.unlocked) {
          isMatched = true;
          badgeText = activeSpan.spec.chord + " · " + activeSpan.spec.cubits + "c";
        } else {
          var rawM = computeRawMetrics(anchorA, anchorB);
          badgeText = anchorA.code + "↔" + anchorB.code + " · " + rawM.cubits + "c · MUTE";
        }
      } else {
        var ptr =
          stObj.livePointer ||
          stObj.pointer ||
          (typeof stObj.pointerX === "number" && typeof stObj.pointerY === "number"
            ? { x: stObj.pointerX, y: stObj.pointerY }
            : caliper.livePointer);
        var hovAnchor = resolveAnchor(hovId);
        if (hovAnchor && hovAnchor.id !== anchorA.id) {
          jawB = deformPoint(hovAnchor.x, hovAnchor.y);
          var hovDist = roundTo(Math.hypot(jawB.x - jawA.x, jawB.y - jawA.y) * CUBITS_PER_PX, 2);
          badgeText = anchorA.code + "→" + hovAnchor.code + " · " + hovDist + "c";
        } else if (ptr && typeof ptr.x === "number" && typeof ptr.y === "number") {
          jawB = { x: ptr.x, y: ptr.y };
          var dLive = Math.hypot(jawB.x - jawA.x, jawB.y - jawA.y);
          if (dLive >= 4) {
            badgeText = anchorA.code + " · " + roundTo(dLive * CUBITS_PER_PX, 2) + "c";
          }
        }
      }

      renderBrassCalipers(ctx, jawA, jawB, {
        isMatched: isMatched,
        badgeText: badgeText
      });
    }

    return {
      LOGICAL_WIDTH: LOGICAL_WIDTH,
      LOGICAL_HEIGHT: LOGICAL_HEIGHT,
      CHORD_CATALOG: CHORD_CATALOG,
      pinAnchor: pinAnchor,
      setLivePointer: setLivePointer,
      dragCaliperTo: setLivePointer,
      liftCaliper: liftCaliper,
      clearSelection: liftCaliper,
      selectAnchor: selectAnchor,
      measurePair: measurePair,
      measureChord: measureChord,
      getPartnerHintIds: getPartnerHintIds,
      getRevealedScars: getRevealedScars,
      getUnlockedSpanIds: getUnlockedSpanIds,
      isSpanUnlocked: isSpanUnlocked,
      getClosedLoopSeal: getClosedLoopSeal,
      step: step,
      deformPoint: deformPoint,
      getSpongeMetrics: getSpongeMetrics,
      resetSponge: resetSponge,
      getAnchorPosition: getAnchorPosition,
      findNearestAnchor: findNearestAnchor,
      getCaliperState: getCaliperState,
      renderCalipersAndScars: renderCalipersAndScars
    };
  }

  var API = Object.freeze({
    LOGICAL_WIDTH: LOGICAL_WIDTH,
    LOGICAL_HEIGHT: LOGICAL_HEIGHT,
    DEFAULT_ANCHORS: DEFAULT_ANCHORS,
    CHORD_CATALOG: CHORD_CATALOG,
    createEngine: createEngine
  });

  root.ZairaRelationalScars = API;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  }
})(typeof window !== "undefined" ? window : globalThis);
