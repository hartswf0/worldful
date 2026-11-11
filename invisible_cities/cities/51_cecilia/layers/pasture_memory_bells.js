(function (root) {
  "use strict";

  /*
   * City 51: Cecilia (Continuous Cities 4)
   * Layer: pasture_memory_bells.js
   * Goatherd, Horned Flock, Named Pastures, Curb Wastepaper Cans & Traffic Island Recognition
   */

  var PASTURE_PALETTE = {
    lowSageSilver: "#8fa882",
    sageLeafDeep: "#526b49",
    thymeSlope: "#7b9468",
    windFennelOchre: "#ccb274",
    bronzeBellBright: "#cf9b46",
    bellTarnished: "#7e6c4e",
    youthFleece: "#efe9dc",
    mangyHide: "#8a8072",
    wastepaperBuff: "#dfd8ca",
    curbCanTin: "#666d74",
    recognitionHalo: "#b7e3c0"
  };
  Object.defineProperty(PASTURE_PALETTE, "curbCan Tin", {
    value: "#666d74",
    enumerable: false,
    configurable: false,
    writable: false
  });
  Object.freeze(PASTURE_PALETTE);

  var CANONICAL_PASTURES = Object.freeze([
    Object.freeze({
      id: "meadow_of_the_low_sage",
      stoneId: "meadow_of_the_low_sage",
      name: "Meadow of the Low Sage",
      botanical: "Salvia humilis",
      nx: 0.50,
      ny: 0.54,
      rx: 0.068,
      ry: 0.046,
      noteHz: 293.66,
      youthDesc: "Warm hollow of fragrant silver-green low sage beyond the south tollgate.",
      islandDesc: "Central asphalt roundabout traffic island where dusty low sage still sprouts through cracked concrete seams."
    }),
    Object.freeze({
      id: "goats_slope",
      stoneId: "goats_slope",
      name: "The Goat's Slope",
      botanical: "Thymus & Cytisus",
      nx: 0.24,
      ny: 0.33,
      rx: 0.056,
      ry: 0.038,
      noteHz: 349.23,
      youthDesc: "Steep limestone scree of wild thyme and yellow broom.",
      islandDesc: "Viaduct ramp splitter median holding stubborn wild-thyme roots beneath concrete curbs."
    }),
    Object.freeze({
      id: "crossroads_of_the_wind",
      stoneId: "crossroads_of_the_wind",
      name: "The Crossroads of the Wind",
      botanical: "Foeniculum & Stipa",
      nx: 0.77,
      ny: 0.36,
      rx: 0.058,
      ry: 0.039,
      noteHz: 392.00,
      youthDesc: "Open four-breeze upland saddle of feathergrass.",
      islandDesc: "Six-lane overpass island swept by exhaust drafts over buried feathergrass turf."
    })
  ]);

  var FLOCK_STONES = Object.freeze([
    Object.freeze({
      id: "barefoot_youth_pasture_names",
      label: "Barefoot Goatherd of Named Pastures",
      summary: "First encounter: barefoot youth driving nimble jingling goats who knows every pasture around the walls by name."
    }),
    Object.freeze({
      id: "leafless_nameless_interval",
      label: "Leafless Interval & Watchmen Gates",
      summary: "Paved streets without leaves where goats startle at corners until watchmen and toll-collectors usher the herd outside."
    }),
    Object.freeze({
      id: "meadow_of_the_low_sage",
      label: "Meadow of the Low Sage",
      summary: "Fragrant silver-green sage hollow remembered from youth, later trapped and recognized inside a rotary traffic island."
    }),
    Object.freeze({
      id: "goats_slope",
      label: "The Goat's Slope",
      summary: "Steep limestone thyme and yellow-broom pasture swallowed beneath continuous viaduct ramps and tenements."
    }),
    Object.freeze({
      id: "crossroads_of_the_wind",
      label: "The Crossroads of the Wind",
      summary: "Upland four-breeze feathergrass saddle overtaken by a six-lane arterial overpass median."
    }),
    Object.freeze({
      id: "endless_identical_streets",
      label: "Boundless Mingled Streets",
      summary: "Decades of walking from one identical street into another without ever finding an outside beyond the avenues."
    }),
    Object.freeze({
      id: "mangy_wastepaper_goats",
      label: "Ragged Graybeard & Wastepaper Goats",
      summary: "Aged graybeard herding gaunt, mangy goats that tug and chew crumpled wastepaper from municipal curb cans."
    }),
    Object.freeze({
      id: "traffic_island_recognition",
      label: "Grass on the Traffic Island",
      summary: "Halting at a concrete traffic island where the goats recognize the grass of the Meadow of the Low Sage."
    })
  ]);

  var CEC_CURB_CANS = Object.freeze([
    Object.freeze({ id: "curb_can_south_west", nx: 0.39, ny: 0.60, tilt: -0.06, paperSheets: 3 }),
    Object.freeze({ id: "curb_can_south_east", nx: 0.61, ny: 0.59, tilt: 0.05, paperSheets: 4 }),
    Object.freeze({ id: "curb_can_northwest_curb", nx: 0.16, ny: 0.40, tilt: -0.04, paperSheets: 3 }),
    Object.freeze({ id: "curb_can_viaduct_foot", nx: 0.33, ny: 0.27, tilt: 0.07, paperSheets: 2 }),
    Object.freeze({ id: "curb_can_overpass_west", nx: 0.68, ny: 0.30, tilt: -0.05, paperSheets: 3 }),
    Object.freeze({ id: "curb_can_overpass_east", nx: 0.85, ny: 0.43, tilt: 0.04, paperSheets: 4 })
  ]);

  var CEC_GOAT_PROFILES = Object.freeze([
    Object.freeze({ idx: 0, angle: 0.15, radius: 0.46, hornSweep: 1.08, bellRatio: 1.00, facing: 1 }),
    Object.freeze({ idx: 1, angle: 1.52, radius: 0.52, hornSweep: 0.94, bellRatio: 1.12, facing: -1 }),
    Object.freeze({ idx: 2, angle: 2.95, radius: 0.48, hornSweep: 1.02, bellRatio: 0.89, facing: 1 }),
    Object.freeze({ idx: 3, angle: 4.48, radius: 0.54, hornSweep: 0.90, bellRatio: 1.19, facing: -1 }),
    Object.freeze({ idx: 4, angle: 0.84, radius: 0.78, hornSweep: 0.98, bellRatio: 1.25, facing: 1 }),
    Object.freeze({ idx: 5, angle: 2.28, radius: 0.82, hornSweep: 0.86, bellRatio: 0.95, facing: -1 }),
    Object.freeze({ idx: 6, angle: 3.76, radius: 0.76, hornSweep: 1.05, bellRatio: 1.33, facing: 1 })
  ]);

  function cecFlockClamp(val, lo, hi) {
    var num = Number(val);
    if (!Number.isFinite(num)) return lo;
    return num < lo ? lo : (num > hi ? hi : num);
  }

  function cecFlockLerp(a, b, t) {
    return a + (b - a) * t;
  }

  function cecFlockDist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function cecFlockFindPasture(pastureId) {
    for (var i = 0; i < CANONICAL_PASTURES.length; i++) {
      if (CANONICAL_PASTURES[i].id === pastureId) return CANONICAL_PASTURES[i];
    }
    return CANONICAL_PASTURES[0];
  }

  function cecFlockDeriveMorphology(era) {
    if (era < 0.55) {
      return {
        goatherdAge: "barefoot_youth",
        goatCondition: "nimble_horned",
        goatCount: 7,
        curbCansVisible: false
      };
    }
    if (era < 0.88) {
      return {
        goatherdAge: "weathering_herdsman",
        goatCondition: "dust_weary",
        goatCount: 5,
        curbCansVisible: era >= 0.65
      };
    }
    return {
      goatherdAge: "ragged_graybeard",
      goatCondition: "gaunt_mangy",
      goatCount: 4,
      curbCansVisible: true
    };
  }

  function cecFlockBuildUtterance(st) {
    var p = cecFlockFindPasture(st.activePastureId);
    if (st.scatterTimer > 0.05 && st.eraProgress < 0.88) {
      return "Where the goats are frightened at the street corners and scatter, watchmen and toll-collectors drive us out again into the named pastures.";
    }
    if (st.eraProgress >= 0.88) {
      if (st.stoppedAtTrafficIsland) {
        if (st.recognizedTrafficIslandId === "meadow_of_the_low_sage" || st.meadowOfLowSageRecognized) {
          return "The places have mingled... Here, once upon a time, there must have been the Meadow of the Low Sage. My goats recognize the grass on the traffic island.";
        }
        if (st.recognizedTrafficIslandId === "goats_slope") {
          return "The places have mingled... Beneath this concrete viaduct median, wild thyme breaks the curb seam where The Goat's Slope once rose.";
        }
        return "The places have mingled... Across this six-lane overpass island, my goats scent buried feathergrass from The Crossroads of the Wind.";
      }
      if (st.grazingMode === "wastepaper") {
        return "Gaunt and mangy, my remaining goats tug crumpled wastepaper from municipal curb cans along streets we can never leave.";
      }
      return "That cannot be! One cannot leave any more—the places have mingled, and Cecilia is everywhere.";
    }
    if (st.eraProgress >= 0.55) {
      if (st.grazingMode === "wastepaper" && st.eraProgress >= 0.65) {
        return "Along the encroaching curbs tin receptacles spill dry wastepaper; my dust-weary goats chew paper scraps where meadow edges vanished.";
      }
      return "New tenements swallow the old tollgates year by year; asphalt narrows every trail toward " + p.name + ".";
    }
    if (p.id === "goats_slope") {
      return "Ask me every pasture around the walls: this thyme-and-broom limestone ridge is The Goat's Slope; cities have no name.";
    }
    if (p.id === "crossroads_of_the_wind") {
      return "Here four breezes comb upland feathergrass at The Crossroads of the Wind; paved streets are only leafless intervals between pastures.";
    }
    return "I know all the pastures: this silver-green hollow is the Meadow of the Low Sage. Cities are leafless places separating one pasture from another.";
  }

  function cecBellCreateAudioEngine() {
    var audioCtx = null;

    function ensureCtx() {
      if (audioCtx) return audioCtx;
      try {
        var Ctor = root.AudioContext || root.webkitAudioContext;
        if (typeof Ctor === "function") audioCtx = new Ctor();
      } catch (err) {
        audioCtx = null;
      }
      return audioCtx;
    }

    function unlock() {
      var ctx = ensureCtx();
      if (!ctx) return false;
      try {
        if (ctx.state === "suspended" && typeof ctx.resume === "function") {
          ctx.resume();
        }
        return true;
      } catch (err) {
        return false;
      }
    }

    function strikeBellTone(freqHz, tarnished, delaySec, gainPeak, durSec) {
      var ctx = ensureCtx();
      if (!ctx) return;
      try {
        var now = ctx.currentTime + (delaySec || 0);
        var partials = tarnished ? [1.0, 1.96, 2.84] : [1.0, 2.02, 2.98, 4.17];
        for (var i = 0; i < partials.length; i++) {
          var osc = ctx.createOscillator();
          var g = ctx.createGain();
          osc.type = i === 0 ? "triangle" : "sine";
          osc.frequency.setValueAtTime(freqHz * partials[i], now);
          var amp = (gainPeak || 0.06) / (1 + i * 1.45);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.exponentialRampToValueAtTime(Math.max(0.0002, amp), now + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0001, now + (durSec || 0.75) / (1 + i * 0.35));
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + (durSec || 0.75) + 0.04);
        }
      } catch (err) {
        /* Headless environment without audio sink */
      }
    }

    function playPaperAndTin() {
      var ctx = ensureCtx();
      if (!ctx) return;
      try {
        var now = ctx.currentTime;
        var len = Math.max(256, Math.floor(ctx.sampleRate * 0.16));
        var buf = ctx.createBuffer(1, len, ctx.sampleRate);
        var ch = buf.getChannelData(0);
        for (var i = 0; i < len; i++) {
          ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.38));
        }
        var src = ctx.createBufferSource();
        var flt = ctx.createBiquadFilter();
        var g = ctx.createGain();
        src.buffer = buf;
        flt.type = "bandpass";
        flt.frequency.setValueAtTime(1680, now);
        flt.Q.setValueAtTime(1.8, now);
        g.gain.setValueAtTime(0.055, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
        src.connect(flt);
        flt.connect(g);
        g.connect(ctx.destination);
        src.start(now);
        strikeBellTone(186.0, true, 0.03, 0.038, 0.28);
      } catch (err) {
        /* Safe fallback */
      }
    }

    return {
      unlock: unlock,
      strikeBellTone: strikeBellTone,
      playPaperAndTin: playPaperAndTin
    };
  }

  function cecFlockDrawPastureTufts(ctx, pNode, st, botanicalXRay, sc) {
    var p = pNode.pasture;
    var x = pNode.x;
    var y = pNode.y;
    var rx = pNode.rxPx;
    var ry = pNode.ryPx;
    var era = st.eraProgress;
    var isRec = st.stoppedAtTrafficIsland && st.recognizedTrafficIslandId === p.id;
    var lushness = cecFlockClamp(1 - era * 0.92, 0.12, 1.0);
    var sway = st.reducedMotion ? 0 : Math.sin(st.walkPhase * 0.65 + p.nx * 7.0) * 2.2 * sc;

    ctx.save();
    if (era < 0.62) {
      var meadowAlpha = cecFlockClamp((0.66 - era) * 0.58, 0.04, 0.36);
      ctx.fillStyle = p.id === "meadow_of_the_low_sage"
        ? PASTURE_PALETTE.lowSageSilver
        : (p.id === "goats_slope" ? PASTURE_PALETTE.thymeSlope : PASTURE_PALETTE.windFennelOchre);
      ctx.globalAlpha = meadowAlpha;
      ctx.beginPath();
      ctx.ellipse(x, y, rx * (1.05 + lushness * 0.45), ry * (1.05 + lushness * 0.45), 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (botanicalXRay || isRec) {
      ctx.globalAlpha = isRec ? 0.78 : 0.55;
      ctx.strokeStyle = PASTURE_PALETTE.recognitionHalo;
      ctx.lineWidth = 1.3 * sc;
      for (var r = 0; r < 8; r++) {
        var ang = (r / 8) * Math.PI * 2 + 0.25;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.quadraticCurveTo(
          x + Math.cos(ang + 0.22) * rx * 0.55,
          y + Math.sin(ang + 0.22) * ry * 0.55,
          x + Math.cos(ang) * rx * 0.96,
          y + Math.sin(ang) * ry * 0.96
        );
        ctx.stroke();
      }
    }

    if (era >= 0.72) {
      ctx.globalAlpha = 0.68;
      ctx.strokeStyle = "#3c4044";
      ctx.lineWidth = 1.15 * sc;
      for (var c = 0; c < 3; c++) {
        var ca = c * 2.05 + 0.4;
        ctx.beginPath();
        ctx.moveTo(x - Math.cos(ca) * rx * 0.48, y - Math.sin(ca) * ry * 0.48);
        ctx.lineTo(x + Math.sin(ca) * 4 * sc, y - Math.cos(ca) * 3 * sc);
        ctx.lineTo(x + Math.cos(ca) * rx * 0.52, y + Math.sin(ca) * ry * 0.52);
        ctx.stroke();
      }
    }

    var tuftCount = era >= 0.88 ? 5 : (era >= 0.55 ? 7 : 11);
    for (var t = 0; t < tuftCount; t++) {
      var ta = t * 2.39996;
      var distFrac = era >= 0.88 ? (0.14 + (t % 3) * 0.20) : (0.16 + (t / tuftCount) * 0.95);
      var tx = x + Math.cos(ta) * rx * distFrac;
      var ty = y + Math.sin(ta) * ry * distFrac;
      var bladeH = (era >= 0.88 ? 7.5 : 11.5) * sc * (isRec || botanicalXRay ? 1.28 : 1.0);

      ctx.globalAlpha = isRec || botanicalXRay ? 0.98 : (era >= 0.88 ? 0.86 : 0.92);
      for (var b = -2; b <= 2; b++) {
        ctx.strokeStyle = (b % 2 === 0)
          ? (p.id === "meadow_of_the_low_sage" ? PASTURE_PALETTE.lowSageSilver : (p.id === "goats_slope" ? PASTURE_PALETTE.thymeSlope : PASTURE_PALETTE.windFennelOchre))
          : PASTURE_PALETTE.sageLeafDeep;
        ctx.lineWidth = (p.id === "meadow_of_the_low_sage" ? 2.2 : 1.6) * sc;
        ctx.beginPath();
        ctx.moveTo(tx, ty + 2 * sc);
        ctx.quadraticCurveTo(
          tx + b * 2.4 * sc + sway * 0.4,
          ty - bladeH * 0.55,
          tx + b * 3.6 * sc + sway,
          ty - bladeH
        );
        ctx.stroke();
      }
      if (p.id === "goats_slope" || isRec || botanicalXRay) {
        ctx.fillStyle = isRec ? PASTURE_PALETTE.recognitionHalo : PASTURE_PALETTE.windFennelOchre;
        ctx.beginPath();
        ctx.arc(tx + sway * 0.6, ty - bladeH - 1.5 * sc, 1.8 * sc, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function cecBellDrawResonanceRings(ctx, x, y, rx, ry, st, sc) {
    ctx.save();
    var phase = st.reducedMotion ? 0.35 : (st.recognitionPulse % 1);
    for (var k = 0; k < 3; k++) {
      var frac = st.reducedMotion ? (1.06 + k * 0.22) : (1.0 + ((phase + k / 3) % 1) * 0.72);
      var alpha = st.reducedMotion ? (0.62 - k * 0.16) : (0.72 * (1 - ((phase + k / 3) % 1)));
      ctx.globalAlpha = cecFlockClamp(alpha, 0.08, 0.78);
      ctx.strokeStyle = k === 1 ? PASTURE_PALETTE.bronzeBellBright : PASTURE_PALETTE.recognitionHalo;
      ctx.lineWidth = (2.1 - k * 0.4) * sc;
      ctx.beginPath();
      ctx.ellipse(x, y, rx * frac, ry * frac, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function cecFlockDrawCurbCan(ctx, canNode, isActiveCan, sc) {
    var cx = canNode.x;
    var cy = canNode.y;
    var cw = 13 * sc;
    var ch = 17 * sc;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(canNode.tilt);

    ctx.fillStyle = "rgba(18, 20, 22, 0.34)";
    ctx.beginPath();
    ctx.ellipse(2 * sc, ch * 0.52, cw * 0.72, 3.6 * sc, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = PASTURE_PALETTE.curbCanTin;
    ctx.strokeStyle = "#3f454b";
    ctx.lineWidth = 1.1 * sc;
    ctx.beginPath();
    ctx.rect(-cw * 0.5, -ch * 0.5, cw, ch);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#889098";
    ctx.lineWidth = 0.8 * sc;
    for (var rib = -1; rib <= 1; rib++) {
      ctx.beginPath();
      ctx.moveTo(rib * 3.3 * sc, -ch * 0.42);
      ctx.lineTo(rib * 3.3 * sc, ch * 0.44);
      ctx.stroke();
    }

    for (var s = 0; s < canNode.paperSheets; s++) {
      var px = (s - 1) * 3.6 * sc;
      var py = -ch * 0.56 - (s % 2) * 2.4 * sc;
      ctx.fillStyle = PASTURE_PALETTE.wastepaperBuff;
      ctx.strokeStyle = "#9c9484";
      ctx.lineWidth = 0.75 * sc;
      ctx.beginPath();
      ctx.moveTo(px - 3.4 * sc, py + 2.6 * sc);
      ctx.lineTo(px - 1.2 * sc, py - 3.2 * sc);
      ctx.lineTo(px + 3.8 * sc, py - 1.4 * sc);
      ctx.lineTo(px + 2.2 * sc, py + 3.2 * sc);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.fillStyle = "#565d64";
    ctx.beginPath();
    ctx.ellipse(cw * 0.28, -ch * 0.52, cw * 0.54, 2.4 * sc, 0.34, 0, Math.PI * 2);
    ctx.fill();

    if (isActiveCan) {
      ctx.strokeStyle = PASTURE_PALETTE.wastepaperBuff;
      ctx.lineWidth = 1.2 * sc;
      ctx.beginPath();
      ctx.arc(0, 0, cw * 1.15, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  function cecFlockDrawGoat(ctx, gNode, st, sc) {
    var prof = gNode.prof;
    var era = st.eraProgress;
    var mangy = era >= 0.88;
    var weary = era >= 0.55 && era < 0.88;
    var dir = gNode.dir;
    var stride = st.reducedMotion ? 0 : Math.sin(st.walkPhase * 2.2 + prof.idx * 1.4) * (st.stoppedAtTrafficIsland ? 0.4 : 2.1) * sc;
    var headDrop = gNode.muzzleDown ? 5.6 * sc : (st.scatterTimer > 0.05 ? -3.4 * sc : 0.6 * sc);

    ctx.save();
    ctx.translate(gNode.x, gNode.y);
    ctx.scale(dir, 1);

    ctx.fillStyle = "rgba(18, 20, 22, 0.28)";
    ctx.beginPath();
    ctx.ellipse(0, 10.5 * sc, 11.5 * sc, 3.2 * sc, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = mangy ? "#595248" : "#6e6353";
    ctx.lineWidth = (mangy ? 1.4 : 1.75) * sc;
    ctx.beginPath();
    ctx.moveTo(-6.5 * sc, 2 * sc);
    ctx.lineTo(-7.5 * sc - stride, 10.2 * sc);
    ctx.moveTo(-3.2 * sc, 2.5 * sc);
    ctx.lineTo(-2.6 * sc + stride, 10.2 * sc);
    ctx.moveTo(4.2 * sc, 2.5 * sc);
    ctx.lineTo(3.8 * sc - stride * 0.8, 10.2 * sc);
    ctx.moveTo(7.2 * sc, 2 * sc);
    ctx.lineTo(8.4 * sc + stride * 0.8, 10.2 * sc);
    ctx.stroke();

    ctx.fillStyle = mangy
      ? PASTURE_PALETTE.mangyHide
      : (weary ? "#c2b9aa" : PASTURE_PALETTE.youthFleece);
    ctx.strokeStyle = mangy ? "#4a443b" : "#877c6b";
    ctx.lineWidth = 1.05 * sc;
    ctx.beginPath();
    if (mangy) {
      ctx.moveTo(-9.5 * sc, -1.2 * sc);
      ctx.lineTo(-2.5 * sc, -4.4 * sc);
      ctx.lineTo(6.8 * sc, -3.2 * sc);
      ctx.lineTo(9.2 * sc, 1.4 * sc);
      ctx.lineTo(3.2 * sc, 3.1 * sc);
      ctx.lineTo(-7.8 * sc, 3.6 * sc);
      ctx.closePath();
    } else {
      ctx.ellipse(0, 0, 9.8 * sc, 5.4 * sc, -0.05, 0, Math.PI * 2);
    }
    ctx.fill();
    ctx.stroke();

    if (mangy) {
      ctx.strokeStyle = "#564e44";
      ctx.lineWidth = 0.85 * sc;
      for (var rb = -1; rb <= 1; rb++) {
        ctx.beginPath();
        ctx.arc(rb * 2.5 * sc, -0.4 * sc, 3.1 * sc, -0.9, 0.9);
        ctx.stroke();
      }
      ctx.fillStyle = "#665e52";
      ctx.beginPath();
      ctx.arc(-3.6 * sc, -1.3 * sc, 1.5 * sc, 0, Math.PI * 2);
      ctx.fill();
    }

    var hx = 10.2 * sc;
    var hy = -4.8 * sc + headDrop;
    ctx.strokeStyle = mangy ? PASTURE_PALETTE.mangyHide : (weary ? "#c2b9aa" : PASTURE_PALETTE.youthFleece);
    ctx.lineWidth = (mangy ? 2.6 : 3.5) * sc;
    ctx.beginPath();
    ctx.moveTo(6.8 * sc, -1.8 * sc);
    ctx.lineTo(hx, hy);
    ctx.stroke();

    ctx.fillStyle = mangy ? PASTURE_PALETTE.mangyHide : PASTURE_PALETTE.youthFleece;
    ctx.beginPath();
    ctx.ellipse(hx + 2.2 * sc, hy + 0.6 * sc, 3.8 * sc, 2.3 * sc, 0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = mangy ? PASTURE_PALETTE.bellTarnished : "#9c8767";
    ctx.lineWidth = 1.35 * sc;
    ctx.beginPath();
    ctx.moveTo(hx + 0.4 * sc, hy - 1.2 * sc);
    ctx.quadraticCurveTo(
      hx - 3.6 * sc * prof.hornSweep,
      hy - 7.8 * sc * prof.hornSweep,
      hx - 7.2 * sc * prof.hornSweep,
      hy - 4.8 * sc
    );
    ctx.stroke();

    var bx = 8.4 * sc;
    var by = -0.2 * sc + headDrop * 0.55;
    ctx.fillStyle = mangy ? PASTURE_PALETTE.bellTarnished : PASTURE_PALETTE.bronzeBellBright;
    ctx.beginPath();
    ctx.arc(bx, by, 2.2 * sc, 0, Math.PI * 2);
    ctx.fill();

    if (st.bellResonance > 0.08 || (st.stoppedAtTrafficIsland && mangy)) {
      ctx.strokeStyle = st.stoppedAtTrafficIsland ? PASTURE_PALETTE.recognitionHalo : PASTURE_PALETTE.bronzeBellBright;
      ctx.lineWidth = 0.9 * sc;
      ctx.beginPath();
      ctx.arc(bx + 1.2 * sc, by + 1.0 * sc, (3.8 + st.bellResonance * 3.5) * sc, -0.7, 1.3);
      ctx.stroke();
    }

    if (st.grazingMode === "wastepaper" && era >= 0.65) {
      ctx.fillStyle = PASTURE_PALETTE.wastepaperBuff;
      ctx.beginPath();
      ctx.moveTo(hx + 4.8 * sc, hy + 1.2 * sc);
      ctx.lineTo(hx + 9.2 * sc, hy - 0.5 * sc);
      ctx.lineTo(hx + 8.1 * sc, hy + 4.0 * sc);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function cecFlockDrawGoatherd(ctx, gx, gy, wx, wy, st, sc) {
    var graybeard = st.eraProgress >= 0.88;
    var weary = st.eraProgress >= 0.55 && st.eraProgress < 0.88;
    ctx.save();
    ctx.translate(gx, gy);

    ctx.fillStyle = "rgba(18, 20, 22, 0.32)";
    ctx.beginPath();
    ctx.ellipse(0, 16 * sc, 10 * sc, 3.2 * sc, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = graybeard ? "#8f8578" : "#c79e79";
    ctx.lineWidth = 2.0 * sc;
    ctx.beginPath();
    ctx.moveTo(-2.5 * sc, 6 * sc);
    ctx.lineTo(-3.2 * sc, 15.5 * sc);
    ctx.moveTo(2.5 * sc, 6 * sc);
    ctx.lineTo(3.2 * sc, 15.5 * sc);
    ctx.stroke();

    ctx.fillStyle = graybeard ? "#656058" : (weary ? "#8c7f6c" : "#b99c74");
    ctx.beginPath();
    if (graybeard) {
      ctx.moveTo(-7.2 * sc, 8.5 * sc);
      ctx.lineTo(-4.6 * sc, -8.2 * sc);
      ctx.lineTo(5.8 * sc, -6.4 * sc);
      ctx.lineTo(7.4 * sc, 9.2 * sc);
      ctx.lineTo(2.5 * sc, 7.2 * sc);
      ctx.lineTo(-1.8 * sc, 9.6 * sc);
    } else {
      ctx.moveTo(-6.2 * sc, 7.0 * sc);
      ctx.lineTo(-4.4 * sc, -10.5 * sc);
      ctx.lineTo(4.6 * sc, -10.5 * sc);
      ctx.lineTo(6.2 * sc, 7.0 * sc);
    }
    ctx.closePath();
    ctx.fill();

    var headX = graybeard ? 2.6 * sc : 0;
    var headY = (graybeard ? -11.4 : -14.5) * sc;
    ctx.fillStyle = graybeard ? "#b8ad9e" : "#cfa57e";
    ctx.beginPath();
    ctx.arc(headX, headY, 4.1 * sc, 0, Math.PI * 2);
    ctx.fill();

    if (graybeard) {
      ctx.fillStyle = PASTURE_PALETTE.wastepaperBuff;
      ctx.beginPath();
      ctx.moveTo(headX - 1.2 * sc, headY + 2.0 * sc);
      ctx.lineTo(headX + 4.8 * sc, headY + 2.2 * sc);
      ctx.lineTo(headX + 2.4 * sc, headY + 10.2 * sc);
      ctx.closePath();
      ctx.fill();
    }

    ctx.strokeStyle = graybeard ? "#594c3c" : "#7c5c38";
    ctx.lineWidth = 1.8 * sc;
    ctx.beginPath();
    ctx.moveTo(7.8 * sc, 15.8 * sc);
    ctx.lineTo(6.2 * sc, -16.5 * sc);
    if (!graybeard) {
      ctx.arc(8.6 * sc, -16.5 * sc, 2.4 * sc, Math.PI, Math.PI * 0.15, false);
    }
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(wx, wy);
    ctx.globalAlpha = 0.82;
    ctx.fillStyle = "#3f464e";
    ctx.beginPath();
    ctx.moveTo(-4.8 * sc, 13 * sc);
    ctx.lineTo(-3.2 * sc, -7.5 * sc);
    ctx.lineTo(3.4 * sc, -7.5 * sc);
    ctx.lineTo(4.8 * sc, 13 * sc);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#bea082";
    ctx.beginPath();
    ctx.arc(0, -11.2 * sc, 3.4 * sc, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function createPastureFlock(opts) {
    var cfg = opts || {};
    var initialWidth = Number(cfg.width) > 0 ? Number(cfg.width) : 1280;
    var initialHeight = Number(cfg.height) > 0 ? Number(cfg.height) : 800;
    var initialReduced = Boolean(cfg.reducedMotion);
    var initialEraVal = cfg.initialEra !== undefined ? cecFlockClamp(cfg.initialEra, 0, 1) : 0.15;
    var audio = cecBellCreateAudioEngine();

    var st = {
      width: initialWidth,
      height: initialHeight,
      eraProgress: initialEraVal,
      activePastureId: "meadow_of_the_low_sage",
      stoppedAtTrafficIsland: false,
      recognizedTrafficIslandId: null,
      meadowOfLowSageRecognized: false,
      wastepaperCroppedCount: 0,
      scatteredAtCornerCount: 0,
      bellResonance: 0.24,
      soundEnabled: false,
      reducedMotion: initialReduced,
      grazingMode: "pasture",
      activeCanIndex: 0,
      scatterTimer: 0,
      recognitionPulse: 0,
      walkPhase: 0,
      streetXRayHint: false,
      herdPos: { nx: 0.50, ny: 0.54 },
      targetPos: { nx: 0.50, ny: 0.54 },
      utterance: ""
    };
    st.utterance = cecFlockBuildUtterance(st);

    function cecFlockComputeActorLayout(w, h) {
      var vw = Number(w) > 0 ? Number(w) : st.width;
      var vh = Number(h) > 0 ? Number(h) : st.height;
      var sc = cecFlockClamp(Math.min(vw, vh) / 760, 0.64, 1.18);
      var morph = cecFlockDeriveMorphology(st.eraProgress);
      var hx = st.herdPos.nx * vw;
      var hy = st.herdPos.ny * vh;

      var pastures = [];
      for (var pIdx = 0; pIdx < CANONICAL_PASTURES.length; pIdx++) {
        var cp = CANONICAL_PASTURES[pIdx];
        pastures.push({
          pasture: cp,
          x: cp.nx * vw,
          y: cp.ny * vh,
          rxPx: Math.max(24, cp.rx * vw),
          ryPx: Math.max(17, cp.ry * vh)
        });
      }

      var cans = [];
      if (morph.curbCansVisible) {
        for (var cIdx = 0; cIdx < CEC_CURB_CANS.length; cIdx++) {
          var cc = CEC_CURB_CANS[cIdx];
          cans.push({
            id: cc.id,
            idx: cIdx,
            x: cc.nx * vw,
            y: cc.ny * vh,
            tilt: cc.tilt,
            paperSheets: cc.paperSheets
          });
        }
      }

      var spread = st.stoppedAtTrafficIsland
        ? 22 * sc
        : (st.grazingMode === "wastepaper" ? 19 * sc : 31 * sc);
      if (st.scatterTimer > 0) {
        spread += 24 * sc * st.scatterTimer;
      }

      var goats = [];
      for (var g = 0; g < morph.goatCount; g++) {
        var prof = CEC_GOAT_PROFILES[g];
        var ang = prof.angle + (st.reducedMotion || st.stoppedAtTrafficIsland ? 0 : Math.sin(st.walkPhase * 0.4 + g) * 0.08);
        var rad = spread * (st.stoppedAtTrafficIsland ? 0.92 : prof.radius + 0.36);
        var gx = hx + Math.cos(ang) * rad;
        var gy = hy + Math.sin(ang) * rad * 0.72;
        var dir = gx <= hx ? 1 : -1;
        if (st.scatterTimer > 0.1) dir = gx >= hx ? 1 : -1;
        goats.push({
          id: "goat_" + g,
          idx: g,
          x: gx,
          y: gy,
          dir: dir,
          prof: prof,
          muzzleDown: st.stoppedAtTrafficIsland || st.grazingMode === "wastepaper" || st.eraProgress < 0.55
        });
      }

      return {
        vw: vw,
        vh: vh,
        sc: sc,
        morph: morph,
        goatherd: { x: hx - 42 * sc, y: hy + 7 * sc },
        wayfarer: { x: hx + 46 * sc, y: hy + 11 * sc },
        goats: goats,
        cans: cans,
        pastures: pastures
      };
    }

    function getState() {
      var morph = cecFlockDeriveMorphology(st.eraProgress);
      var ap = cecFlockFindPasture(st.activePastureId);
      return {
        eraProgress: Number(st.eraProgress.toFixed(4)),
        goatherdAge: morph.goatherdAge,
        goatCondition: morph.goatCondition,
        goatCount: morph.goatCount,
        activePastureId: st.activePastureId,
        activePastureName: ap.name,
        activeBotanical: ap.botanical,
        bellNoteHz: ap.noteHz,
        stoppedAtTrafficIsland: st.stoppedAtTrafficIsland,
        recognizedTrafficIslandId: st.recognizedTrafficIslandId,
        meadowOfLowSageRecognized: st.meadowOfLowSageRecognized,
        wastepaperCroppedCount: st.wastepaperCroppedCount,
        scatteredAtCornerCount: st.scatteredAtCornerCount,
        curbCansVisible: morph.curbCansVisible,
        grazingMode: st.grazingMode,
        herdAnchor: { nx: Number(st.herdPos.nx.toFixed(4)), ny: Number(st.herdPos.ny.toFixed(4)) },
        bellResonance: Number(cecFlockClamp(st.bellResonance, 0, 1).toFixed(4)),
        utterance: st.utterance,
        soundEnabled: st.soundEnabled,
        reducedMotion: st.reducedMotion
      };
    }

    function notifyChange() {
      if (typeof cfg.onStateChange === "function") {
        cfg.onStateChange(getState());
      }
    }

    function playBronzeBell(mode) {
      if (!st.soundEnabled) return;
      var ap = cecFlockFindPasture(st.activePastureId);
      var base = ap.noteHz || 293.66;
      var tarnished = mode === "tarnished" || st.eraProgress >= 0.88;
      if (mode === "startle") {
        audio.strikeBellTone(base * 1.12, tarnished, 0.00, 0.055, 0.36);
        audio.strikeBellTone(base * 1.33, tarnished, 0.06, 0.048, 0.34);
        audio.strikeBellTone(base * 0.94, tarnished, 0.12, 0.045, 0.40);
        return;
      }
      if (mode === "wastepaper") {
        audio.playPaperAndTin();
        return;
      }
      audio.strikeBellTone(base, tarnished, 0.0, 0.065, tarnished ? 0.55 : 0.85);
    }

    function playTrafficIslandRecognitionChord() {
      if (!st.soundEnabled) return;
      audio.strikeBellTone(293.66, false, 0.00, 0.068, 1.15);
      audio.strikeBellTone(349.23, false, 0.09, 0.056, 1.10);
      audio.strikeBellTone(440.00, false, 0.18, 0.050, 1.20);
      audio.strikeBellTone(587.33, false, 0.28, 0.036, 1.25);
    }

    function unlockAudio() {
      return audio.unlock();
    }

    function setSoundEnabled(flag) {
      st.soundEnabled = Boolean(flag);
      if (st.soundEnabled) audio.unlock();
      notifyChange();
      return st.soundEnabled;
    }

    function toggleAudio() {
      return setSoundEnabled(!st.soundEnabled);
    }

    function setViewport(w, h) {
      if (Number(w) > 0) st.width = Number(w);
      if (Number(h) > 0) st.height = Number(h);
      return getState();
    }

    function setReducedMotion(flag) {
      st.reducedMotion = Boolean(flag);
      if (st.reducedMotion) {
        st.herdPos.nx = st.targetPos.nx;
        st.herdPos.ny = st.targetPos.ny;
        st.scatterTimer = 0;
      }
      notifyChange();
      return getState();
    }

    function setEraProgress(v) {
      var prevEra = st.eraProgress;
      st.eraProgress = cecFlockClamp(v, 0, 1);
      var ap = cecFlockFindPasture(st.activePastureId);
      if (st.eraProgress < 0.88) {
        st.stoppedAtTrafficIsland = false;
        st.recognizedTrafficIslandId = null;
        st.meadowOfLowSageRecognized = false;
        if (st.eraProgress < 0.65 && st.grazingMode === "wastepaper") {
          st.grazingMode = "pasture";
          st.targetPos = { nx: ap.nx, ny: ap.ny };
          st.herdPos = { nx: ap.nx, ny: ap.ny };
        }
      } else if (prevEra < 0.88 && !st.stoppedAtTrafficIsland && st.grazingMode === "pasture") {
        var laneX = cecFlockClamp(ap.nx - 0.065, 0.12, 0.88);
        var laneY = cecFlockClamp(ap.ny + 0.045, 0.14, 0.86);
        st.targetPos = { nx: laneX, ny: laneY };
        st.herdPos = { nx: laneX, ny: laneY };
      }
      st.utterance = cecFlockBuildUtterance(st);
      notifyChange();
      return getState();
    }

    function driveFlockToPastureOrIsland(targetId) {
      var p = cecFlockFindPasture(targetId || "meadow_of_the_low_sage");
      st.activePastureId = p.id;
      st.scatterTimer = 0;
      st.targetPos = { nx: p.nx, ny: p.ny };
      st.herdPos = { nx: p.nx, ny: p.ny };
      if (st.eraProgress >= 0.88) {
        st.grazingMode = "island_tuft";
        st.stoppedAtTrafficIsland = true;
        st.recognizedTrafficIslandId = p.id;
        if (p.id === "meadow_of_the_low_sage") {
          st.meadowOfLowSageRecognized = true;
        }
        st.bellResonance = 1.0;
        playTrafficIslandRecognitionChord();
      } else {
        st.grazingMode = "pasture";
        st.stoppedAtTrafficIsland = false;
        st.recognizedTrafficIslandId = null;
        st.meadowOfLowSageRecognized = false;
        st.bellResonance = 0.78;
        playBronzeBell(st.eraProgress >= 0.55 ? "weary" : "youth");
      }
      st.utterance = cecFlockBuildUtterance(st);
      notifyChange();
      return getState();
    }

    function cropCurbWastepaper() {
      if (st.eraProgress >= 0.65) {
        var canIdx = st.activeCanIndex % CEC_CURB_CANS.length;
        var can = CEC_CURB_CANS[canIdx];
        st.activeCanIndex = (canIdx + 1) % CEC_CURB_CANS.length;
        st.grazingMode = "wastepaper";
        st.stoppedAtTrafficIsland = false;
        st.wastepaperCroppedCount += 1;
        st.targetPos = { nx: can.nx, ny: can.ny };
        st.herdPos = { nx: can.nx, ny: can.ny };
        st.bellResonance = 0.54;
        st.utterance = cecFlockBuildUtterance(st);
        playBronzeBell("wastepaper");
      } else {
        st.utterance = "Out in the green meadows no municipal curb cans stand; my nimble goats browse living sage and thyme.";
      }
      notifyChange();
      return getState();
    }

    function startleAtStreetCorner() {
      st.scatteredAtCornerCount += 1;
      st.scatterTimer = st.reducedMotion ? 0.45 : 1.0;
      st.bellResonance = 0.92;
      st.utterance = cecFlockBuildUtterance(st);
      playBronzeBell("startle");
      notifyChange();
      return getState();
    }

    function step(dtSec, streetState) {
      var dt = cecFlockClamp(dtSec, 0, 0.25);
      if (streetState && typeof streetState === "object") {
        st.streetXRayHint = Boolean(streetState.botanicalXRay);
      }
      if (st.reducedMotion) {
        st.herdPos.nx = st.targetPos.nx;
        st.herdPos.ny = st.targetPos.ny;
        st.bellResonance = st.stoppedAtTrafficIsland ? 0.85 : 0.20;
        return getState();
      }
      st.walkPhase += dt * 3.1;
      st.recognitionPulse = (st.recognitionPulse + dt * 0.48) % 1;
      var ease = cecFlockClamp(dt * 4.5, 0, 1);
      st.herdPos.nx = cecFlockLerp(st.herdPos.nx, st.targetPos.nx, ease);
      st.herdPos.ny = cecFlockLerp(st.herdPos.ny, st.targetPos.ny, ease);
      st.scatterTimer = Math.max(0, st.scatterTimer - dt * 0.65);
      var floorRes = st.stoppedAtTrafficIsland ? 0.42 : 0.12;
      st.bellResonance = Math.max(floorRes, st.bellResonance - dt * 0.36);
      return getState();
    }

    function render(ctx, w, h, renderOpts) {
      if (!ctx) return;
      var ro = renderOpts || {};
      var xRay = Boolean(ro.botanicalXRay || st.streetXRayHint);
      var layout = cecFlockComputeActorLayout(w, h);
      var sc = layout.sc;

      ctx.save();
      for (var pIdx = 0; pIdx < layout.pastures.length; pIdx++) {
        var pNode = layout.pastures[pIdx];
        cecFlockDrawPastureTufts(ctx, pNode, st, xRay, sc);
        if (st.stoppedAtTrafficIsland && st.recognizedTrafficIslandId === pNode.pasture.id) {
          cecBellDrawResonanceRings(ctx, pNode.x, pNode.y, pNode.rxPx, pNode.ryPx, st, sc);
        }
      }

      var activeCan = (st.grazingMode === "wastepaper" && layout.cans.length > 0)
        ? ((st.activeCanIndex + layout.cans.length - 1) % layout.cans.length)
        : -1;
      for (var cIdx = 0; cIdx < layout.cans.length; cIdx++) {
        cecFlockDrawCurbCan(ctx, layout.cans[cIdx], cIdx === activeCan, sc);
      }

      cecFlockDrawGoatherd(ctx, layout.goatherd.x, layout.goatherd.y, layout.wayfarer.x, layout.wayfarer.y, st, sc);

      for (var gIdx = 0; gIdx < layout.goats.length; gIdx++) {
        cecFlockDrawGoat(ctx, layout.goats[gIdx], st, sc);
      }
      ctx.restore();
    }

    function inspectAt(px, py, w, h) {
      var layout = cecFlockComputeActorLayout(w, h);
      var best = null;
      var bestDist = 38.0001;

      var ghDist = cecFlockDist(px, py, layout.goatherd.x, layout.goatherd.y);
      if (ghDist <= 38 && ghDist < bestDist) {
        bestDist = ghDist;
        var isOld = st.eraProgress >= 0.88;
        var isMid = st.eraProgress >= 0.55 && st.eraProgress < 0.88;
        best = {
          id: isOld ? "goatherd_graybeard" : (isMid ? "goatherd_weathering" : "goatherd_youth"),
          stoneId: isOld
            ? (st.stoppedAtTrafficIsland ? "traffic_island_recognition" : "mangy_wastepaper_goats")
            : "barefoot_youth_pasture_names",
          title: isOld ? "Ragged Graybeard Goatherd" : (isMid ? "Weathering Herdsman" : "Barefoot Goatherd of Named Pastures"),
          category: "goatherd",
          detail: st.utterance
        };
      }

      for (var g = 0; g < layout.goats.length; g++) {
        var gn = layout.goats[g];
        var gd = cecFlockDist(px, py, gn.x, gn.y);
        if (gd <= 38 && gd < bestDist) {
          bestDist = gd;
          var mangy = st.eraProgress >= 0.88;
          best = {
            id: gn.id,
            stoneId: st.scatterTimer > 0.05
              ? "leafless_nameless_interval"
              : (mangy ? (st.stoppedAtTrafficIsland ? "traffic_island_recognition" : "mangy_wastepaper_goats") : "barefoot_youth_pasture_names"),
            title: mangy
              ? (st.stoppedAtTrafficIsland ? "Gaunt Goat Recognizing Island Sage" : "Gaunt Mangy Curb-Goat")
              : "Nimble Horned Bell-Goat",
            category: "flock",
            detail: mangy
              ? (st.stoppedAtTrafficIsland
                ? "Angular-ribbed goat lowering its muzzle to recognize surviving low sage inside the concrete traffic island."
                : "Gaunt urban goat with tarnished bronze bell cropping crumpled wastepaper along endless avenues.")
              : "Sleek Mediterranean horned goat wearing a bright bronze bell across named upland pastures."
          };
        }
      }

      for (var c = 0; c < layout.cans.length; c++) {
        var cn = layout.cans[c];
        var cd = cecFlockDist(px, py, cn.x, cn.y);
        if (cd <= 38 && cd < bestDist) {
          bestDist = cd;
          best = {
            id: cn.id,
            stoneId: "mangy_wastepaper_goats",
            title: "Municipal Curb Can & Wastepaper",
            category: "curb_wastepaper",
            detail: "Corrugated tin curb receptacle overflowing with crumpled buff wastepaper cropped by the aged herdsman's goats."
          };
        }
      }

      for (var p = 0; p < layout.pastures.length; p++) {
        var pn = layout.pastures[p];
        var pd = cecFlockDist(px, py, pn.x, pn.y);
        if (pd <= 38 && pd < bestDist) {
          bestDist = pd;
          var cp = pn.pasture;
          var recSage = st.eraProgress >= 0.88 && st.stoppedAtTrafficIsland && cp.id === "meadow_of_the_low_sage";
          best = {
            id: cp.id,
            stoneId: recSage ? "traffic_island_recognition" : cp.stoneId,
            title: cp.name,
            category: st.eraProgress >= 0.88 ? "traffic_island_tuft" : "named_pasture",
            detail: st.eraProgress >= 0.88 ? cp.islandDesc : cp.youthDesc
          };
        }
      }

      return best;
    }

    function reset() {
      st.eraProgress = initialEraVal;
      st.activePastureId = "meadow_of_the_low_sage";
      st.stoppedAtTrafficIsland = false;
      st.recognizedTrafficIslandId = null;
      st.meadowOfLowSageRecognized = false;
      st.wastepaperCroppedCount = 0;
      st.scatteredAtCornerCount = 0;
      st.bellResonance = 0.24;
      st.grazingMode = "pasture";
      st.activeCanIndex = 0;
      st.scatterTimer = 0;
      st.recognitionPulse = 0;
      st.walkPhase = 0;
      st.herdPos = { nx: 0.50, ny: 0.54 };
      st.targetPos = { nx: 0.50, ny: 0.54 };
      st.utterance = cecFlockBuildUtterance(st);
      notifyChange();
      return getState();
    }

    return {
      getState: getState,
      setViewport: setViewport,
      setReducedMotion: setReducedMotion,
      setEraProgress: setEraProgress,
      driveFlockToPastureOrIsland: driveFlockToPastureOrIsland,
      cropCurbWastepaper: cropCurbWastepaper,
      startleAtStreetCorner: startleAtStreetCorner,
      step: step,
      render: render,
      inspectAt: inspectAt,
      unlockAudio: unlockAudio,
      setSoundEnabled: setSoundEnabled,
      toggleAudio: toggleAudio,
      playBronzeBell: playBronzeBell,
      playTrafficIslandRecognitionChord: playTrafficIslandRecognitionChord,
      reset: reset
    };
  }

  var api = Object.freeze({
    PASTURE_PALETTE: PASTURE_PALETTE,
    CANONICAL_PASTURES: CANONICAL_PASTURES,
    FLOCK_STONES: FLOCK_STONES,
    createPastureFlock: createPastureFlock
  });

  root.CeciliaPastureBells = api;
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
