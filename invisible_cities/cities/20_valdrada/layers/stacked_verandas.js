/* City 20: Valdrada - Erect Cliffside Stacked Verandas Layer (above waterlineY) */
(function (root) {
  "use strict";

  var PALETTE = Object.freeze({
    obsidian_water: "#070B10",
    abyss_trench: "#0D151F",
    cold_limpid_slate: "#2A3D4F",
    chilled_mirror_cyan: "#9BD1E5",
    silverpoint_ice: "#DCEFF7",
    veranda_ivory: "#EDE6D6",
    travertine_warm: "#D6C7AE",
    amber_room_glow: "#E3A857",
    parapet_iron: "#1A232D",
    crimson_vein: "#8E1B28",
    clotted_tendon_black: "#2E070D",
    obsidianWater: "#070B10",
    abyssTrench: "#0D151F",
    coldLimpidSlate: "#2A3D4F",
    chilledMirrorCyan: "#9BD1E5",
    silverpointIce: "#DCEFF7",
    verandaIvory: "#EDE6D6",
    travertineWarm: "#D6C7AE",
    amberRoomGlow: "#E3A857",
    parapetIron: "#1A232D",
    crimsonVein: "#8E1B28",
    clottedTendonBlack: "#2E070D"
  });

  var CANONICAL_STONES = Object.freeze([
    Object.freeze({
      id: "ancient_lakeshore_foundation",
      stone: "built by the ancients on the shores of a lake",
      erectRole: "Stepped ancient limestone-and-slate cliff footings anchored directly at the horizontal waterline datum."
    }),
    Object.freeze({
      id: "stacked_veranda_houses",
      stone: "houses all verandas one above the other",
      erectRole: "Four tiered open-arcaded veranda stories stacked step-over-step up the cliffside with zero blind facades."
    }),
    Object.freeze({
      id: "railed_parapet_high_streets",
      stone: "high streets whose railed parapets look out over the water so the traveler arriving sees two cities: one erect above the lake, one reflected upside-down",
      erectRole: "Cantilevered high-street walkways with wrought-iron railed parapets where the arriving traveler leans over the abyss."
    }),
    Object.freeze({
      id: "illuminated_cutaway_interiors",
      stone: "insides of illuminated rooms: ceilings and floors, the perspective of hallways",
      erectRole: "Architectural section-cutaways exposing oil-lit coffered ceilings, tessellated floors, and receding one-point hallway perspectives."
    }),
    Object.freeze({
      id: "wardrobe_catoptric_mirrors",
      stone: "the mirrors of wardrobes",
      erectRole: "Hinged beveled wardrobe mirror inside an upper dressing veranda angled toward the open loggia."
    }),
    Object.freeze({
      id: "twining_naked_lovers",
      stone: "lovers twist their naked bodies skin-to-skin, seeking positions that yield to the eye the most pleasing forms and contours, or where light best gilds the skin",
      erectRole: "Upper alcove silhouettes twining beneath warm amber light, modulating posture self-consciously for the mirror's eye."
    }),
    Object.freeze({
      id: "dagger_black_neck_veins",
      stone: "murderers push the knife into the black veins of the neck, and more clotted blood pours out the more the blade presses in that slip between the tendons",
      erectRole: "Stark chiaroscuro inner corridor where a blade presses between neck tendons and clotted crimson-black blood spills across stone."
    })
  ]);

  var CHAMBER_SPECS = Object.freeze([
    Object.freeze({
      index: 0,
      id: "traveler_parapet",
      tierIndex: 1,
      stoneId: "railed_parapet_high_streets",
      erectWeight: 0.84,
      polarityHint: "DENIED",
      title: "Arriving Traveler's High-Street Parapet",
      gestureLabel: "Lean over wrought-iron rail to behold both cities",
      hasWardrobeMirror: false,
      hallwayDepth: 0.44,
      slotLeft: 0.04,
      slotWidth: 0.43,
      gazeU: 0.34,
      note: "Arriving traveler leans across the cantilevered wrought-iron rail above the lake, beholding erect verandas and chilled twin at once."
    }),
    Object.freeze({
      index: 1,
      id: "hallway_perspective",
      tierIndex: 0,
      stoneId: "illuminated_cutaway_interiors",
      erectWeight: 0.34,
      polarityHint: "INCREASED",
      title: "Coffered Hallway Perspective",
      gestureLabel: "Pace oil-lit tessellated corridor without forgetfulness",
      hasWardrobeMirror: false,
      hallwayDepth: 0.90,
      slotLeft: 0.05,
      slotWidth: 0.44,
      gazeU: 0.50,
      note: "Oil-lit section-cutaway exposing coffered ceiling ribs, tessellated floor tiles, and receding hallway perspective paced without forgetfulness."
    }),
    Object.freeze({
      index: 2,
      id: "wardrobe_chamber",
      tierIndex: 2,
      stoneId: "wardrobe_catoptric_mirrors",
      erectWeight: 0.31,
      polarityHint: "INCREASED",
      title: "Chamber of the Hinged Wardrobe Mirror",
      gestureLabel: "Angle beveled wardrobe mirror toward the open loggia",
      hasWardrobeMirror: true,
      hallwayDepth: 0.62,
      slotLeft: 0.22,
      slotWidth: 0.56,
      gazeU: 0.60,
      note: "Beveled hinged wardrobe mirror angled toward the open loggia casts a catoptric reflection cone down toward the lake surface."
    }),
    Object.freeze({
      index: 3,
      id: "merchant_scale_loggia",
      tierIndex: 1,
      stoneId: "stacked_veranda_houses",
      erectWeight: 0.91,
      polarityHint: "DENIED",
      title: "Magistrate's Golden Scale Veranda",
      gestureLabel: "Raise ceremonial scales in proud civic display",
      hasWardrobeMirror: false,
      hallwayDepth: 0.54,
      slotLeft: 0.53,
      slotWidth: 0.43,
      gazeU: 0.52,
      note: "Open-arcaded civic veranda where a robed magistrate raises golden balance scales in calculated display before the lake."
    }),
    Object.freeze({
      index: 4,
      id: "fleeting_glance_balcony",
      tierIndex: 0,
      stoneId: "ancient_lakeshore_foundation",
      erectWeight: 0.18,
      polarityHint: "INCREASED",
      title: "Ancient Cliffshore Column Balcony",
      gestureLabel: "Brush cold lakeshore limestone in a fleeting pause",
      hasWardrobeMirror: false,
      hallwayDepth: 0.48,
      slotLeft: 0.54,
      slotWidth: 0.41,
      gazeU: 0.62,
      note: "Low lakeshore loggia socketed into stepped ancient limestone footings where fingertips graze weathered stone."
    }),
    Object.freeze({
      index: 5,
      id: "lovers_alcove",
      tierIndex: 3,
      stoneId: "twining_naked_lovers",
      erectWeight: 0.44,
      polarityHint: "INCREASED",
      title: "Alcove of Twining Naked Lovers",
      gestureLabel: "Shift skin-to-skin pose where amber light gilds contour",
      hasWardrobeMirror: false,
      hallwayDepth: 0.64,
      slotLeft: 0.06,
      slotWidth: 0.42,
      gazeU: 0.48,
      note: "Upper amber-lit alcove where naked silhouettes twine skin-to-skin, modulating posture where light best gilds contour for the mirror."
    }),
    Object.freeze({
      index: 6,
      id: "crimson_vein_corridor",
      tierIndex: 3,
      stoneId: "dagger_black_neck_veins",
      erectWeight: 0.52,
      polarityHint: "INCREASED",
      title: "Corridor of the Knife & Black Neck Veins",
      gestureLabel: "Press blade into the tendon slip of black neck veins",
      hasWardrobeMirror: false,
      hallwayDepth: 0.78,
      slotLeft: 0.52,
      slotWidth: 0.42,
      gazeU: 0.56,
      note: "Chiaroscuro inner gallery where a knife presses into the tendon slip of black neck veins and clotted crimson spills across stone."
    })
  ]);

  var TIER_SPECS = Object.freeze([
    Object.freeze({ index: 0, label: "Tier I - Ancient Lakeshore Arcade", inset: 0.00, archCount: 7, cantileverRatio: 0.025 }),
    Object.freeze({ index: 1, label: "Tier II - Railed High-Street Promenade", inset: 0.015, archCount: 7, cantileverRatio: 0.042 }),
    Object.freeze({ index: 2, label: "Tier III - Catoptric Dressing Loggias", inset: 0.038, archCount: 6, cantileverRatio: 0.030 }),
    Object.freeze({ index: 3, label: "Tier IV - Upper Alcove & Chiaroscuro Crown", inset: 0.062, archCount: 6, cantileverRatio: 0.024 })
  ]);

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function round2(v) {
    return Math.round(v * 100) / 100;
  }

  function createVerandas(opts) {
    var cfg = opts || {};
    var width = Math.max(240, Math.round(Number(cfg.width) || 1280));
    var height = Math.max(200, Math.round(Number(cfg.height) || 800));
    var waterlineRatio = typeof cfg.waterlineRatio === "number" && cfg.waterlineRatio > 0.15 && cfg.waterlineRatio < 0.85
      ? cfg.waterlineRatio
      : 0.5;
    var waterlineY = Math.round(height * waterlineRatio);
    var reducedMotion = Boolean(cfg.reducedMotion);
    var destroyed = false;

    var activeChamberId = typeof cfg.initialChamberId === "string" ? cfg.initialChamberId : "traveler_parapet";
    var actCount = 0;
    var interceptCount = 0;
    var clockSec = 0;
    var globalCorrectionFlash = 0;
    var lastAct = null;

    var runtimeChambers = CHAMBER_SPECS.map(function (spec, idx) {
      return {
        id: spec.id,
        index: idx,
        tierIndex: spec.tierIndex,
        stoneId: spec.stoneId,
        title: spec.title,
        gestureLabel: spec.gestureLabel,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        distFromWaterPx: 0,
        ceilingCoffered: true,
        floorTiled: true,
        hallwayDepth: spec.hallwayDepth,
        hasWardrobeMirror: Boolean(spec.hasWardrobeMirror),
        wardrobeAngle: spec.hasWardrobeMirror ? 0.48 : 0,
        poseStep: 0,
        actIntensity: spec.id === activeChamberId ? 0.52 : 0.28,
        erectWeight: spec.erectWeight,
        polarityHint: spec.polarityHint,
        crimsonFlow: spec.id === "crimson_vein_corridor" ? 0.42 : 0,
        gazeX: 0,
        gazeY: 0,
        note: spec.note,
        correctionFlash: 0
      };
    });

    var cliffProfile = [];
    var tiers = [];

    function computeLayout() {
      waterlineY = Math.max(96, Math.round(height * waterlineRatio));
      var sideMargin = width < 560 ? Math.round(width * 0.045) : Math.round(width * 0.085);
      var spanW = Math.max(180, width - sideMargin * 2);
      var skyHeadroom = Math.max(16, Math.round(waterlineY * 0.11));
      var cliffFootH = Math.max(14, Math.round(waterlineY * 0.115));
      var usableStackH = Math.max(64, waterlineY - skyHeadroom - cliffFootH);
      var tierH = Math.max(16, Math.floor(usableStackH / 4));

      var stepRatios = [
        [0.00, 0.08, 0.36],
        [0.08, 0.22, 0.72],
        [0.22, 0.46, 1.00],
        [0.46, 0.56, 0.84],
        [0.56, 0.80, 1.00],
        [0.80, 0.92, 0.68],
        [0.92, 1.00, 0.34]
      ];
      var cliffLeft = Math.max(4, sideMargin - Math.round(spanW * 0.04));
      var cliffSpan = Math.min(width - cliffLeft * 2, spanW + Math.round(spanW * 0.08));
      cliffProfile = [{ x: cliffLeft, y: waterlineY, w: 0, h: 0, distFromWaterPx: 0, stoneId: "ancient_lakeshore_foundation" }];
      for (var s = 0; s < stepRatios.length; s++) {
        var r = stepRatios[s];
        var sx0 = Math.round(cliffLeft + cliffSpan * r[0]);
        var sx1 = Math.round(cliffLeft + cliffSpan * r[1]);
        var sh = Math.max(4, Math.round(cliffFootH * r[2]));
        var sy = waterlineY - sh;
        cliffProfile.push({ x: sx0, y: sy, w: Math.max(1, sx1 - sx0), h: sh, distFromWaterPx: 0, stoneId: "ancient_lakeshore_foundation" });
        cliffProfile.push({ x: sx1, y: sy, w: 0, h: sh, distFromWaterPx: 0, stoneId: "ancient_lakeshore_foundation" });
      }
      cliffProfile.push({ x: cliffLeft + cliffSpan, y: waterlineY, w: 0, h: 0, distFromWaterPx: 0, stoneId: "ancient_lakeshore_foundation" });

      var stackBottomY = waterlineY - cliffFootH;
      tiers = TIER_SPECS.map(function (ts, tIdx) {
        var insetPx = Math.round(spanW * ts.inset);
        var cantileverPx = Math.max(4, Math.round(spanW * ts.cantileverRatio));
        var tx = sideMargin + insetPx;
        var tw = Math.max(120, spanW - insetPx * 2);
        var ty = Math.max(4, stackBottomY - (tIdx + 1) * tierH);
        var parapetH = Math.max(5, Math.round(tierH * 0.20));
        return {
          index: tIdx,
          tierIndex: tIdx,
          id: "veranda_tier_" + tIdx,
          label: ts.label,
          stoneId: "stacked_veranda_houses",
          parapetStoneId: "railed_parapet_high_streets",
          x: tx,
          y: ty,
          w: tw,
          h: tierH,
          archCount: ts.archCount,
          parapetY: ty + tierH - parapetH,
          parapetH: parapetH,
          walkwayY: ty + tierH,
          cantileverPx: cantileverPx,
          distFromWaterPx: Math.max(0, waterlineY - (ty + tierH))
        };
      });

      for (var i = 0; i < runtimeChambers.length; i++) {
        var ch = runtimeChambers[i];
        var spec = CHAMBER_SPECS[i];
        var tier = tiers[spec.tierIndex];
        var padY = Math.max(2, Math.round(tier.h * 0.08));
        ch.x = Math.round(tier.x + tier.w * spec.slotLeft);
        ch.w = Math.max(36, Math.round(tier.w * spec.slotWidth));
        ch.y = tier.y + padY;
        ch.h = Math.max(12, tier.h - padY - 2);
        if (ch.y + ch.h > waterlineY - 2) {
          ch.h = Math.max(10, waterlineY - 2 - ch.y);
        }
        ch.distFromWaterPx = Math.max(0, Math.round(waterlineY - (ch.y + ch.h)));
        var poseShift = ((ch.poseStep % 4) - 1.5) * 0.028;
        var u = clamp(spec.gazeU + poseShift, 0.16, 0.84);
        ch.gazeX = Math.round(ch.x + ch.w * u);
        ch.gazeY = Math.min(waterlineY - 3, Math.round(ch.y + ch.h * (ch.id === "traveler_parapet" ? 0.62 : 0.56)));
      }
    }

    function findChamber(target) {
      if (typeof target === "number" && target >= 0 && target < runtimeChambers.length) {
        return runtimeChambers[Math.floor(target)];
      }
      var key = target && typeof target === "object" ? (target.chamberId || target.id) : target;
      if (typeof key === "string") {
        for (var i = 0; i < runtimeChambers.length; i++) {
          if (runtimeChambers[i].id === key || runtimeChambers[i].stoneId === key) {
            return runtimeChambers[i];
          }
        }
      }
      for (var j = 0; j < runtimeChambers.length; j++) {
        if (runtimeChambers[j].id === activeChamberId) {
          return runtimeChambers[j];
        }
      }
      return runtimeChambers[0];
    }

    function snapshotChamber(ch) {
      return {
        id: ch.id,
        index: ch.index,
        tierIndex: ch.tierIndex,
        stoneId: ch.stoneId,
        title: ch.title,
        gestureLabel: ch.gestureLabel,
        x: ch.x,
        y: ch.y,
        w: ch.w,
        h: ch.h,
        distFromWaterPx: ch.distFromWaterPx,
        ceilingCoffered: true,
        floorTiled: true,
        hallwayDepth: round2(ch.hallwayDepth),
        hasWardrobeMirror: ch.hasWardrobeMirror,
        wardrobeAngle: round2(ch.wardrobeAngle),
        poseStep: ch.poseStep,
        actIntensity: round2(ch.actIntensity),
        erectWeight: ch.erectWeight,
        polarityHint: ch.polarityHint,
        crimsonFlow: round2(ch.crimsonFlow),
        gazeX: ch.gazeX,
        gazeY: ch.gazeY,
        note: ch.note
      };
    }

    function getMirrorPacket() {
      return {
        width: width,
        height: height,
        waterlineY: waterlineY,
        activeChamberId: activeChamberId,
        actCount: actCount,
        chanceMomentsOccurred: 0,
        interceptCount: interceptCount,
        selfConsciousness: 1.0,
        cliffProfile: cliffProfile.map(function (pt) {
          return { x: pt.x, y: pt.y, w: pt.w, h: pt.h, distFromWaterPx: pt.distFromWaterPx, stoneId: pt.stoneId };
        }),
        tiers: tiers.map(function (t) {
          return Object.assign({}, t);
        }),
        chambers: runtimeChambers.map(snapshotChamber),
        lastAct: lastAct ? Object.assign({}, lastAct) : null
      };
    }

    function triggerAct(target) {
      if (destroyed) {
        return lastAct;
      }
      var ch = findChamber(target);
      activeChamberId = ch.id;
      actCount += 1;
      ch.poseStep += 1;
      ch.actIntensity = 1.0;

      for (var i = 0; i < runtimeChambers.length; i++) {
        if (runtimeChambers[i].id !== ch.id && runtimeChambers[i].actIntensity > 0.34) {
          runtimeChambers[i].actIntensity = Math.max(0.28, runtimeChambers[i].actIntensity * 0.78);
        }
      }

      if (ch.hasWardrobeMirror) {
        ch.wardrobeAngle = 0.36 + 0.11 * (ch.poseStep % 4);
      }
      if (ch.id === "crimson_vein_corridor") {
        ch.crimsonFlow = clamp(0.84 + 0.05 * (ch.poseStep % 4), 0, 1);
      }
      if (ch.id === "hallway_perspective") {
        ch.hallwayDepth = 0.88 + 0.03 * (ch.poseStep % 3);
      }

      computeLayout();

      lastAct = {
        actNumber: actCount,
        chamberId: ch.id,
        id: ch.id,
        index: ch.index,
        tierIndex: ch.tierIndex,
        stoneId: ch.stoneId,
        title: ch.title,
        gestureLabel: ch.gestureLabel,
        erectWeight: ch.erectWeight,
        polarityHint: ch.polarityHint,
        poseStep: ch.poseStep,
        actIntensity: round2(ch.actIntensity),
        wardrobeAngle: round2(ch.wardrobeAngle),
        crimsonFlow: round2(ch.crimsonFlow),
        gazeX: ch.gazeX,
        gazeY: ch.gazeY,
        distFromWaterPx: ch.distFromWaterPx,
        chanceMomentsOccurred: 0,
        selfConsciousness: 1.0
      };

      if (typeof cfg.onAct === "function") {
        cfg.onAct(Object.assign({}, lastAct), getMirrorPacket());
      }
      return Object.assign({}, lastAct);
    }

    function attemptChanceMoment(targetOpt) {
      var ch = findChamber(targetOpt);
      activeChamberId = ch.id;
      interceptCount += 1;
      ch.correctionFlash = 1.0;
      ch.actIntensity = Math.max(ch.actIntensity, 0.88);
      globalCorrectionFlash = 1.0;
      var outcome = {
        allowed: false,
        chanceMomentsOccurred: 0,
        interceptCount: interceptCount,
        selfConsciousness: 1.0,
        chamberId: ch.id,
        reason: "Awareness of the lake mirror intercepts the unguarded gesture immediately; zero chance or forgetfulness occurs."
      };
      if (typeof cfg.onIntercept === "function") {
        cfg.onIntercept(Object.assign({}, outcome), getMirrorPacket());
      }
      return outcome;
    }

    function inspectAt(px, py) {
      if (typeof px !== "number" || typeof py !== "number" || py < 0 || py > waterlineY) {
        return null;
      }
      for (var i = 0; i < runtimeChambers.length; i++) {
        var ch = runtimeChambers[i];
        if (px >= ch.x - 3 && px <= ch.x + ch.w + 3 && py >= ch.y - 2 && py <= ch.y + ch.h + 4) {
          var snap = snapshotChamber(ch);
          snap.hit = true;
          snap.kind = "chamber";
          snap.region = "erect";
          snap.chamberId = ch.id;
          return snap;
        }
      }
      for (var t = 0; t < tiers.length; t++) {
        var tr = tiers[t];
        if (px >= tr.x - tr.cantileverPx && px <= tr.x + tr.w + tr.cantileverPx && py >= tr.y && py <= tr.y + tr.h) {
          var fallbackCh = runtimeChambers[0];
          for (var k = 0; k < runtimeChambers.length; k++) {
            if (runtimeChambers[k].tierIndex === tr.index) {
              fallbackCh = runtimeChambers[k];
              if (Math.abs(( fallbackCh.x + fallbackCh.w * 0.5 ) - px) < tr.w * 0.28) {
                break;
              }
            }
          }
          return {
            hit: true,
            kind: "tier",
            region: "erect",
            tierIndex: tr.index,
            id: tr.id,
            chamberId: fallbackCh.id,
            stoneId: py >= tr.parapetY ? "railed_parapet_high_streets" : "stacked_veranda_houses",
            title: tr.label,
            x: tr.x,
            y: tr.y,
            w: tr.w,
            h: tr.h
          };
        }
      }
      for (var c = 0; c < cliffProfile.length; c++) {
        var cp = cliffProfile[c];
        if (cp.w > 0 && px >= cp.x && px <= cp.x + cp.w && py >= cp.y && py <= waterlineY) {
          return {
            hit: true,
            kind: "cliff",
            region: "erect",
            chamberId: "fleeting_glance_balcony",
            stoneId: "ancient_lakeshore_foundation",
            title: "Stepped Ancient Lakeshore Cliff",
            x: cp.x,
            y: cp.y,
            w: cp.w,
            h: cp.h
          };
        }
      }
      return null;
    }

    function step(dt) {
      if (destroyed) {
        return getMirrorPacket();
      }
      var raw = typeof dt === "number" && isFinite(dt) ? dt : 0.016;
      var dtSec = raw > 1.5 ? clamp(raw / 1000, 0, 0.1) : clamp(raw, 0, 0.1);
      if (!reducedMotion) {
        clockSec += dtSec;
      }
      globalCorrectionFlash = Math.max(0, globalCorrectionFlash - dtSec * 1.85);
      for (var i = 0; i < runtimeChambers.length; i++) {
        var ch = runtimeChambers[i];
        var floorVal = ch.id === activeChamberId ? 0.44 : 0.26;
        if (ch.actIntensity > floorVal) {
          ch.actIntensity = Math.max(floorVal, ch.actIntensity - dtSec * 0.42);
        }
        if (ch.correctionFlash > 0) {
          ch.correctionFlash = Math.max(0, ch.correctionFlash - dtSec * 1.85);
        }
        if (ch.id === "crimson_vein_corridor" && ch.crimsonFlow > 0.44) {
          ch.crimsonFlow = Math.max(0.44, ch.crimsonFlow - dtSec * 0.22);
        }
      }
      return getMirrorPacket();
    }

    function setViewport(nextW, nextH, nextRatio) {
      width = Math.max(240, Math.round(Number(nextW) || width));
      height = Math.max(200, Math.round(Number(nextH) || height));
      if (typeof nextRatio === "number" && nextRatio > 0.15 && nextRatio < 0.85) {
        waterlineRatio = nextRatio;
      }
      computeLayout();
      return { width: width, height: height, waterlineY: waterlineY };
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      return reducedMotion;
    }

    function reset() {
      activeChamberId = typeof cfg.initialChamberId === "string" ? cfg.initialChamberId : "traveler_parapet";
      actCount = 0;
      interceptCount = 0;
      clockSec = 0;
      globalCorrectionFlash = 0;
      lastAct = null;
      for (var i = 0; i < runtimeChambers.length; i++) {
        var ch = runtimeChambers[i];
        var spec = CHAMBER_SPECS[i];
        ch.poseStep = 0;
        ch.actIntensity = spec.id === activeChamberId ? 0.52 : 0.28;
        ch.wardrobeAngle = spec.hasWardrobeMirror ? 0.48 : 0;
        ch.crimsonFlow = spec.id === "crimson_vein_corridor" ? 0.42 : 0;
        ch.hallwayDepth = spec.hallwayDepth;
        ch.correctionFlash = 0;
      }
      computeLayout();
      return getMirrorPacket();
    }

    function getState() {
      var pkt = getMirrorPacket();
      pkt.reducedMotion = reducedMotion;
      pkt.waterlineRatio = waterlineRatio;
      pkt.chamberCount = runtimeChambers.length;
      pkt.tierCount = tiers.length;
      pkt.zeroForgetfulness = true;
      pkt.activeChamber = snapshotChamber(findChamber(activeChamberId));
      return pkt;
    }

    function destroy() {
      destroyed = true;
    }

    function drawSkyAndCliff(ctx) {
      var skyGrad = ctx.createLinearGradient(0, 0, 0, waterlineY);
      skyGrad.addColorStop(0, "#121C26");
      skyGrad.addColorStop(0.52, PALETTE.cold_limpid_slate);
      skyGrad.addColorStop(1, "#41596D");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, waterlineY);

      /* Distant alpine lake-basin ridges */
      ctx.fillStyle = "rgba(19, 29, 40, 0.62)";
      ctx.beginPath();
      ctx.moveTo(0, waterlineY);
      ctx.lineTo(0, Math.round(waterlineY * 0.64));
      ctx.lineTo(Math.round(width * 0.14), Math.round(waterlineY * 0.46));
      ctx.lineTo(Math.round(width * 0.28), Math.round(waterlineY * 0.58));
      ctx.lineTo(Math.round(width * 0.74), Math.round(waterlineY * 0.55));
      ctx.lineTo(Math.round(width * 0.88), Math.round(waterlineY * 0.43));
      ctx.lineTo(width, Math.round(waterlineY * 0.61));
      ctx.lineTo(width, waterlineY);
      ctx.closePath();
      ctx.fill();

      /* Rear stratified limestone-and-slate cliff escarpment behind stacked verandas */
      if (tiers.length > 0) {
        var baseT = tiers[0];
        var topT = tiers[tiers.length - 1];
        ctx.fillStyle = "#22313F";
        ctx.beginPath();
        ctx.moveTo(Math.max(0, baseT.x - 18), waterlineY);
        ctx.lineTo(Math.max(0, baseT.x - 10), baseT.y + Math.round(baseT.h * 0.35));
        ctx.lineTo(Math.max(0, topT.x - 8), topT.y - 8);
        ctx.lineTo(Math.round(width * 0.36), Math.max(4, topT.y - 16));
        ctx.lineTo(Math.round(width * 0.66), Math.max(4, topT.y - 14));
        ctx.lineTo(Math.min(width, topT.x + topT.w + 8), topT.y - 8);
        ctx.lineTo(Math.min(width, baseT.x + baseT.w + 10), baseT.y + Math.round(baseT.h * 0.35));
        ctx.lineTo(Math.min(width, baseT.x + baseT.w + 18), waterlineY);
        ctx.closePath();
        ctx.fill();
      }

      /* Stepped ancient lakeshore foundation anchored directly at waterlineY */
      for (var i = 0; i < cliffProfile.length; i++) {
        var stepBlk = cliffProfile[i];
        if (stepBlk.w <= 0 || stepBlk.h <= 0) {
          continue;
        }
        ctx.fillStyle = i % 4 === 1 ? "#59626A" : "#6D7275";
        ctx.fillRect(stepBlk.x, stepBlk.y, stepBlk.w, stepBlk.h);
        ctx.fillStyle = "#B8AE9E";
        ctx.fillRect(stepBlk.x, stepBlk.y, stepBlk.w, Math.min(3, stepBlk.h));
        ctx.strokeStyle = PALETTE.parapet_iron;
        ctx.lineWidth = 1;
        ctx.strokeRect(stepBlk.x + 0.5, stepBlk.y + 0.5, Math.max(1, stepBlk.w - 1), Math.max(1, stepBlk.h - 1));

        /* Dressed ancient ashlar course joints */
        var courseY = stepBlk.y + Math.round(stepBlk.h * 0.52);
        if (stepBlk.h >= 10) {
          ctx.beginPath();
          ctx.moveTo(stepBlk.x, courseY);
          ctx.lineTo(stepBlk.x + stepBlk.w, courseY);
          ctx.strokeStyle = "rgba(26, 35, 45, 0.55)";
          ctx.stroke();
        }
      }
    }

    function drawIronParapet(ctx, x, y, w, h) {
      ctx.fillStyle = PALETTE.travertine_warm;
      ctx.fillRect(x, y + h - 2, w, 2);
      ctx.strokeStyle = PALETTE.parapet_iron;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y);
      ctx.moveTo(x, y + h - 2);
      ctx.lineTo(x + w, y + h - 2);
      var balusterStep = Math.max(5, Math.round(w / Math.max(8, Math.floor(w / 7))));
      for (var bx = x + 2; bx <= x + w - 2; bx += balusterStep) {
        ctx.moveTo(bx, y);
        ctx.lineTo(bx, y + h - 2);
      }
      ctx.stroke();
    }

    function drawVerandaTiers(ctx) {
      for (var t = 0; t < tiers.length; t++) {
        var tr = tiers[t];
        /* Main travertine veranda story facade & cornice */
        ctx.fillStyle = t % 2 === 0 ? PALETTE.travertine_warm : PALETTE.veranda_ivory;
        ctx.fillRect(tr.x, tr.y, tr.w, tr.h);

        ctx.fillStyle = PALETTE.veranda_ivory;
        ctx.fillRect(tr.x - 3, tr.y, tr.w + 6, Math.max(3, Math.round(tr.h * 0.08)));

        /* Open colonnade arches across the full veranda tier */
        var bayW = tr.w / tr.archCount;
        for (var a = 0; a < tr.archCount; a++) {
          var ax = tr.x + a * bayW + bayW * 0.14;
          var aw = bayW * 0.72;
          var ay = tr.y + tr.h * 0.14;
          var ah = tr.h * 0.78;
          var archR = Math.min(aw * 0.5, ah * 0.38);

          ctx.fillStyle = "rgba(26, 35, 45, 0.74)";
          ctx.beginPath();
          ctx.moveTo(ax, ay + ah);
          ctx.lineTo(ax, ay + archR);
          ctx.arc(ax + aw * 0.5, ay + archR, aw * 0.5, Math.PI, 0, false);
          ctx.lineTo(ax + aw, ay + ah);
          ctx.closePath();
          ctx.fill();
        }

        /* Cantilevered high-street walkway slab & corbels overhanging the lake */
        var walkX = tr.x - tr.cantileverPx;
        var walkW = tr.w + tr.cantileverPx * 2;
        ctx.fillStyle = "#B8A88F";
        ctx.fillRect(walkX, tr.walkwayY - 3, walkW, 3);
        ctx.fillStyle = "#8C7D69";
        var corbelCount = Math.max(6, tr.archCount + 2);
        for (var c = 0; c <= corbelCount; c++) {
          var cx = Math.round(walkX + (walkW * c) / corbelCount);
          ctx.fillRect(cx - 2, tr.walkwayY, 4, 3);
        }

        /* Wrought-iron railed high-street parapet */
        drawIronParapet(ctx, walkX, tr.parapetY, walkW, tr.parapetH);
      }
    }

    function drawChamberCutawayShell(ctx, ch, isActive) {
      var shimmer = reducedMotion ? 0 : Math.sin(clockSec * 2.4 + ch.index * 1.1) * 0.04;
      var glowAlpha = clamp(0.32 + ch.actIntensity * 0.48 + shimmer, 0.22, 0.92);
      var isCrimson = ch.id === "crimson_vein_corridor";

      /* Interior shell base */
      ctx.fillStyle = isCrimson ? "#1B1318" : "#2D2219";
      ctx.fillRect(ch.x, ch.y, ch.w, ch.h);

      var roomGrad = ctx.createLinearGradient(ch.x, ch.y, ch.x, ch.y + ch.h);
      if (isCrimson) {
        roomGrad.addColorStop(0, "rgba(46, 7, 13, 0.88)");
        roomGrad.addColorStop(0.55, "rgba(142, 27, 40, " + round2(0.24 + ch.crimsonFlow * 0.34) + ")");
        roomGrad.addColorStop(1, "rgba(227, 168, 87, 0.22)");
      } else {
        roomGrad.addColorStop(0, "rgba(227, 168, 87, " + round2(glowAlpha * 0.75) + ")");
        roomGrad.addColorStop(0.6, "rgba(237, 230, 214, " + round2(glowAlpha * 0.42) + ")");
        roomGrad.addColorStop(1, "rgba(214, 199, 174, " + round2(glowAlpha * 0.58) + ")");
      }
      ctx.fillStyle = roomGrad;
      ctx.fillRect(ch.x + 1, ch.y + 1, Math.max(2, ch.w - 2), Math.max(2, ch.h - 2));

      var depthScale = clamp(0.26 + ch.hallwayDepth * 0.34, 0.30, 0.62);
      var innerW = ch.w * (1 - depthScale);
      var innerH = ch.h * (1 - depthScale * 0.78);
      var ix = ch.x + (ch.w - innerW) * 0.5;
      var iy = ch.y + (ch.h - innerH) * 0.46;

      /* Coffered ceiling ribs & recessed panels (ceilingCoffered: true) */
      var ribCount = 5;
      ctx.strokeStyle = isCrimson ? "rgba(214, 199, 174, 0.42)" : "rgba(120, 82, 40, 0.72)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var r = 0; r <= ribCount; r++) {
        var u = r / ribCount;
        ctx.moveTo(ch.x + ch.w * u, ch.y);
        ctx.lineTo(ix + innerW * u, iy);
      }
      ctx.moveTo(ch.x + ch.w * 0.08, (ch.y + iy) * 0.5);
      ctx.lineTo(ch.x + ch.w * 0.92, (ch.y + iy) * 0.5);
      ctx.stroke();

      /* Tessellated perspective floor tiles (floorTiled: true) */
      var tileCols = 6;
      ctx.strokeStyle = isCrimson ? "rgba(237, 230, 214, 0.34)" : "rgba(42, 61, 79, 0.58)";
      ctx.beginPath();
      for (var tc = 0; tc <= tileCols; tc++) {
        var tu = tc / tileCols;
        ctx.moveTo(ix + innerW * tu, iy + innerH);
        ctx.lineTo(ch.x + ch.w * tu, ch.y + ch.h);
      }
      var midFloorY = iy + innerH + (ch.y + ch.h - (iy + innerH)) * 0.48;
      ctx.moveTo(ch.x + ch.w * 0.06, midFloorY);
      ctx.lineTo(ch.x + ch.w * 0.94, midFloorY);
      ctx.stroke();

      /* Rear perspective wall frame */
      ctx.strokeStyle = isActive ? PALETTE.amber_room_glow : "rgba(237, 230, 214, 0.52)";
      ctx.strokeRect(ix, iy, innerW, innerH);
    }

    function drawChamberEnactment(ctx, ch, isActive) {
      var cx = ch.gazeX;
      var floorY = ch.y + ch.h - 3;
      var figH = Math.max(10, ch.h * 0.54);
      var headR = Math.max(2.2, figH * 0.13);

      if (ch.id === "traveler_parapet") {
        /* Cloaked arriving traveler leaning forward over wrought-iron rail */
        var lean = 3 + (ch.poseStep % 3) * 1.6;
        ctx.fillStyle = PALETTE.parapet_iron;
        ctx.beginPath();
        ctx.moveTo(cx - 5, floorY);
        ctx.lineTo(cx - 2 + lean * 0.5, floorY - figH * 0.72);
        ctx.lineTo(cx + 4 + lean, floorY - figH * 0.58);
        ctx.lineTo(cx + 2, floorY);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + lean, floorY - figH * 0.82, headR, 0, Math.PI * 2);
        ctx.fill();
      } else if (ch.id === "hallway_perspective") {
        /* Deep nested corridor arches, hanging oil lamp & pacing figure */
        for (var d = 1; d <= 3; d++) {
          var s = 1 - d * 0.19;
          var pw = ch.w * s;
          var ph = ch.h * (1 - d * 0.15);
          ctx.strokeStyle = "rgba(227, 168, 87, " + round2(0.55 - d * 0.1) + ")";
          ctx.strokeRect(ch.x + (ch.w - pw) * 0.5, ch.y + (ch.h - ph) * 0.45, pw, ph);
        }
        ctx.fillStyle = PALETTE.amber_room_glow;
        ctx.beginPath();
        ctx.arc(ch.x + ch.w * 0.5, ch.y + ch.h * 0.24, Math.max(2, ch.h * 0.06), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = PALETTE.parapet_iron;
        ctx.fillRect(cx - 2, floorY - figH * 0.68, 4, figH * 0.68);
        ctx.beginPath();
        ctx.arc(cx, floorY - figH * 0.78, headR, 0, Math.PI * 2);
        ctx.fill();
      } else if (ch.id === "wardrobe_chamber") {
        /* Carved wardrobe with beveled hinged mirror & catoptric cone to waterline */
        var wx = ch.x + ch.w * 0.20;
        var wy = ch.y + ch.h * 0.18;
        var ww = Math.max(10, ch.w * 0.16);
        var wh = ch.h * 0.74;
        ctx.fillStyle = "#3B281B";
        ctx.fillRect(wx, wy, ww, wh);
        var leafDx = Math.cos(ch.wardrobeAngle) * ww * 0.85;
        var leafDy = Math.sin(ch.wardrobeAngle) * wh * 0.16;
        ctx.fillStyle = PALETTE.silverpoint_ice;
        ctx.strokeStyle = PALETTE.chilled_mirror_cyan;
        ctx.beginPath();
        ctx.moveTo(wx + ww, wy + 2);
        ctx.lineTo(wx + ww + leafDx, wy + 2 + leafDy);
        ctx.lineTo(wx + ww + leafDx, wy + wh - 2 + leafDy);
        ctx.lineTo(wx + ww, wy + wh - 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        /* Catoptric beveled mirror cone angled out through the open loggia */
        ctx.fillStyle = "rgba(155, 209, 229, " + round2(0.18 + ch.actIntensity * 0.22) + ")";
        ctx.beginPath();
        ctx.moveTo(wx + ww + leafDx * 0.6, wy + wh * 0.3);
        ctx.lineTo(cx + 8, floorY);
        ctx.lineTo(cx - 10, floorY);
        ctx.closePath();
        ctx.fill();

        /* Citizen silhouette whose dorsal profile faces the wardrobe mirror */
        ctx.fillStyle = PALETTE.parapet_iron;
        ctx.fillRect(cx - 2.5, floorY - figH * 0.70, 5, figH * 0.70);
        ctx.beginPath();
        ctx.arc(cx, floorY - figH * 0.80, headR, 0, Math.PI * 2);
        ctx.fill();
      } else if (ch.id === "merchant_scale_loggia") {
        /* Magistrate raising ceremonial golden balance scales */
        ctx.fillStyle = PALETTE.parapet_iron;
        ctx.fillRect(cx - 3, floorY - figH * 0.72, 6, figH * 0.72);
        ctx.beginPath();
        ctx.arc(cx, floorY - figH * 0.82, headR, 0, Math.PI * 2);
        ctx.fill();
        var beamY = floorY - figH * (0.76 + (ch.poseStep % 3) * 0.05);
        var tilt = ((ch.poseStep % 3) - 1) * 2.2;
        ctx.strokeStyle = PALETTE.amber_room_glow;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(cx - 10, beamY - tilt);
        ctx.lineTo(cx + 10, beamY + tilt);
        ctx.stroke();
        ctx.fillStyle = "#F6D488";
        ctx.beginPath();
        ctx.arc(cx - 10, beamY - tilt + 5, 3, 0, Math.PI, false);
        ctx.arc(cx + 10, beamY + tilt + 5, 3, 0, Math.PI, false);
        ctx.fill();
      } else if (ch.id === "fleeting_glance_balcony") {
        /* Ancient limestone column shaft & citizen brushing cold stone */
        var colX = ch.x + ch.w * 0.74;
        ctx.fillStyle = "#B8AE9E";
        ctx.fillRect(colX - 3, ch.y + 3, 6, ch.h - 5);
        ctx.fillStyle = PALETTE.parapet_iron;
        ctx.fillRect(cx - 2.5, floorY - figH * 0.68, 5, figH * 0.68);
        ctx.beginPath();
        ctx.arc(cx, floorY - figH * 0.78, headR, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = PALETTE.parapet_iron;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(cx + 2, floorY - figH * 0.52);
        ctx.lineTo(colX - 2, floorY - figH * 0.50);
        ctx.stroke();
      } else if (ch.id === "lovers_alcove") {
        /* Amber-gilded twining silhouettes seeking contours for the mirror */
        var sway = ((ch.poseStep % 4) - 1.5) * 2.2;
        ctx.strokeStyle = PALETTE.amber_room_glow;
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.moveTo(cx - 6, floorY);
        ctx.quadraticCurveTo(cx - 2 + sway, floorY - figH * 0.45, cx + 3, floorY - figH * 0.72);
        ctx.moveTo(cx + 6, floorY);
        ctx.quadraticCurveTo(cx + 2 - sway, floorY - figH * 0.48, cx - 3, floorY - figH * 0.70);
        ctx.stroke();
        ctx.fillStyle = "#E8B76B";
        ctx.beginPath();
        ctx.arc(cx - 2.5, floorY - figH * 0.76, headR, 0, Math.PI * 2);
        ctx.arc(cx + 2.8, floorY - figH * 0.74, headR, 0, Math.PI * 2);
        ctx.fill();
      } else if (ch.id === "crimson_vein_corridor") {
        /* Stark chiaroscuro dagger pressing into black neck veins & crimson ribbon */
        ctx.fillStyle = PALETTE.clotted_tendon_black;
        ctx.fillRect(cx - 8, floorY - figH * 0.74, 5, figH * 0.74);
        ctx.fillRect(cx + 2, floorY - figH * 0.64, 5, figH * 0.64);
        ctx.beginPath();
        ctx.arc(cx - 5.5, floorY - figH * 0.82, headR, 0, Math.PI * 2);
        ctx.arc(cx + 4.5, floorY - figH * 0.72, headR, 0, Math.PI * 2);
        ctx.fill();

        /* Steel dagger blade into neck tendon slip */
        var neckX = cx + 3;
        var neckY = floorY - figH * 0.64;
        ctx.strokeStyle = PALETTE.silverpoint_ice;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(cx - 4, neckY - 3);
        ctx.lineTo(neckX + 2, neckY + 1);
        ctx.stroke();

        /* Clotted crimson-vein ribbon pouring proportional to crimsonFlow */
        var veinLen = Math.max(6, (waterlineY - neckY) * clamp(0.18 + ch.crimsonFlow * 0.28, 0.18, 0.46));
        ctx.strokeStyle = PALETTE.crimson_vein;
        ctx.lineWidth = 1.8 + ch.crimsonFlow * 1.6;
        ctx.beginPath();
        ctx.moveTo(neckX, neckY + 1);
        ctx.quadraticCurveTo(neckX + 3, neckY + veinLen * 0.5, neckX + 1, Math.min(floorY + 2, neckY + veinLen));
        ctx.stroke();
      }

      /* Open veranda framing arch, sill parapet & zero-chance posture reticle */
      ctx.strokeStyle = isActive ? PALETTE.amber_room_glow : PALETTE.veranda_ivory;
      ctx.lineWidth = isActive ? 1.8 : 1.1;
      ctx.strokeRect(ch.x + 0.5, ch.y + 0.5, Math.max(2, ch.w - 1), Math.max(2, ch.h - 1));
      drawIronParapet(ctx, ch.x + 2, ch.y + ch.h - Math.max(4, Math.round(ch.h * 0.18)), Math.max(4, ch.w - 4), Math.max(4, Math.round(ch.h * 0.18)));

      if (ch.correctionFlash > 0.02 || globalCorrectionFlash > 0.02) {
        var fAlpha = round2(Math.max(ch.correctionFlash, globalCorrectionFlash * 0.65));
        ctx.strokeStyle = "rgba(220, 239, 247, " + fAlpha + ")";
        ctx.lineWidth = 2;
        ctx.strokeRect(ch.x - 2, ch.y - 2, ch.w + 4, ch.h + 4);
      }

      /* Downward interlocked citizen sightline aimed at waterlineY */
      ctx.save();
      if (typeof ctx.setLineDash === "function") {
        ctx.setLineDash([3, 3]);
      }
      ctx.strokeStyle = isActive
        ? "rgba(227, 168, 87, 0.72)"
        : "rgba(220, 239, 247, 0.28)";
      ctx.lineWidth = isActive ? 1.3 : 0.9;
      ctx.beginPath();
      ctx.moveTo(ch.gazeX, ch.gazeY);
      ctx.lineTo(ch.gazeX, waterlineY);
      ctx.stroke();
      ctx.restore();
    }

    function render(ctx) {
      if (!ctx || destroyed) {
        return;
      }
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width, waterlineY);
      ctx.clip();

      drawSkyAndCliff(ctx);
      drawVerandaTiers(ctx);

      for (var i = 0; i < runtimeChambers.length; i++) {
        var ch = runtimeChambers[i];
        var isActive = ch.id === activeChamberId;
        drawChamberCutawayShell(ctx, ch, isActive);
        drawChamberEnactment(ctx, ch, isActive);
      }

      /* Crisp ancient lakeshore stone datum edge directly at waterlineY */
      ctx.fillStyle = PALETTE.veranda_ivory;
      ctx.fillRect(0, waterlineY - 1, width, 1);
      ctx.restore();
    }

    computeLayout();

    return {
      setViewport: setViewport,
      step: step,
      render: render,
      triggerAct: triggerAct,
      attemptChanceMoment: attemptChanceMoment,
      inspectAt: inspectAt,
      getMirrorPacket: getMirrorPacket,
      getState: getState,
      setReducedMotion: setReducedMotion,
      reset: reset,
      destroy: destroy
    };
  }

  var api = Object.freeze({
    PALETTE: PALETTE,
    CANONICAL_STONES: CANONICAL_STONES,
    CHAMBER_SPECS: CHAMBER_SPECS,
    createVerandas: createVerandas
  });

  root.ValdradaStackedVerandas = api;
})(typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : this);
