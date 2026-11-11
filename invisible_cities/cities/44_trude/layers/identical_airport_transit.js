/* City 44: Trude (Continuous Cities 2) — Identical Airport Transit Layer */
(function () {
  "use strict";

  var PALETTE = Object.freeze({
    asphalt_tarmac: "#1E2224",
    tin_warehouse_dark: "#3A4144",
    tin_roof_zinc: "#7E878A",
    suburb_yellowish_ochre: "#C8B868",
    suburb_ochre_shadow: "#9C8E47",
    suburb_greenish_lichen: "#6C8364",
    suburb_green_shadow: "#4B5E46",
    roundabout_marigold: "#D4953B",
    roundabout_geranium: "#C46238",
    placard_amber_ivory: "#F2E5BE",
    goblet_celadon_glass: "#9EB59E",
    overcast_continuum_sky: "#2B3130",
    overcast_horizon_olive: "#525949"
  });

  var INVARIANT_RUNWAY_SPEC = Object.freeze({
    runwayHeading: "27L",
    thresholdStripes: 8,
    towerHeightM: 42,
    hangarBays: 6,
    luggageCarts: 4,
    windsockDeg: 112.5,
    tarmacCrackSeed: 440802,
    taxiCabCount: 3
  });

  var RAW_DESTINATIONS = [
    [0, "TRD-01", "TRUDE CENTRAL", "Province Zero Continuum", 45.4642, 9.1900, 0, 0],
    [1, "OMA-TRD", "EPPLEY OMAHA", "Great Plains Basin", 41.3032, -95.8941, 303, 7784],
    [2, "IST-TRD", "YESILKOY ISTANBUL", "Marmara Littoral", 40.9769, 28.8146, 104, 1668],
    [3, "EZE-TRD", "EZEIZA PAMPAS", "Rio de la Plata Plain", -34.8222, -58.5358, 230, 11206],
    [4, "SYD-TRD", "MASCOT BOTANY", "Tasman Rim", -33.9399, 151.1753, 109, 16590],
    [5, "KEF-TRD", "KEFLAVIK LAVA", "Reykjanes Basalt", 63.9850, -22.6056, 326, 2882],
    [6, "SKD-TRD", "SAMARKAND STEPPE", "Zeravshan Valley", 39.7005, 66.9838, 79, 4652],
    [7, "ANC-TRD", "TED STEVENS NORTH", "Cook Inlet Subarctic", 61.1744, -149.9962, 346, 8175],
    [8, "SIN-TRD", "CHANGI STRAIT", "Malacca Equatorial", 1.3644, 103.9915, 95, 10265],
    [9, "CMN-TRD", "NOUASSEUR ATLAS", "Chaouia Atlantic", 33.3675, -7.5898, 232, 1966],
    [10, "USH-TRD", "MALVINAS TIERRA", "Beagle Channel South", -54.8433, -68.2958, 218, 13278],
    [11, "NBO-TRD", "EMBAKASI RIFT", "Athi Highland", -1.3192, 36.9278, 147, 5912],
    [12, "VVO-TRD", "KNEVICHI AMUR", "Sea of Japan Margin", 43.3990, 132.1480, 45, 8540],
    [13, "LIM-TRD", "CALLAO PACIFIC", "Rimac Coastal Fog", -12.0219, -77.1143, 256, 10724],
    [14, "BOM-TRD", "SAHAR MONSOON", "Salsette Estuary", 19.0896, 72.8656, 103, 6458],
    [15, "YUL-TRD", "DORVAL ST LAWRENCE", "Hochelaga Archipelago", 45.4706, -73.7408, 298, 5946],
    [16, "LIS-TRD", "PORTELA TAGUS", "Estremadura Mouth", 38.7756, -9.1354, 250, 1682],
    [17, "MNL-TRD", "NICHOLS BAY", "Luzon Archipelago", 14.5086, 121.0194, 78, 10412],
    [18, "DKR-TRD", "YOFF CAP-VERT", "Sahel Promontory", 14.7397, -17.4902, 223, 4218],
    [19, "AKL-TRD", "MANGERE HARBOUR", "Manukau Antipode", -37.0082, 174.7850, 72, 18524],
    [20, "WAW-TRD", "OKECIE VISTULA", "Mazovian Lowland", 52.1657, 20.9671, 47, 1144],
    [21, "CAI-TRD", "ALMAAZA NILE", "Heliopolis Delta", 30.1219, 31.4056, 126, 2592],
    [22, "JNB-TRD", "JAN SMUTS VELD", "Witwatersrand Ridge", -26.1367, 28.2411, 165, 8172],
    [23, "SCL-TRD", "PUDAHUEL ANDES", "Maipo Cordillera", -33.3930, -70.7858, 237, 11912]
  ];

  var DESTINATIONS = Object.freeze(
    RAW_DESTINATIONS.map(function (row) {
      return Object.freeze({
        index: row[0],
        code: row[1],
        placard: row[2],
        regionLabel: row[3],
        lat: row[4],
        lon: row[5],
        bearingDeg: row[6],
        kmFromOrigin: row[7]
      });
    })
  );

  var FLAP_CELL_COUNT = 18;
  var FLAP_ALPHABET = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-/";

  function createSeededRng(seed) {
    var s = (seed >>> 0) || 440802;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var sceneRng = createSeededRng(INVARIANT_RUNWAY_SPEC.tarmacCrackSeed);

  var SUBURB_BLOCKS = (function () {
    var blocks = [];
    var count = 34;
    for (var i = 0; i < count; i++) {
      var isYellow = (i + Math.floor(sceneRng() * 2)) % 2 === 0;
      blocks.push({
        nx: i / count,
        nw: 0.024 + sceneRng() * 0.014,
        nh: 0.028 + sceneRng() * 0.044,
        litColor: isYellow ? PALETTE.suburb_yellowish_ochre : PALETTE.suburb_greenish_lichen,
        shadeColor: isYellow ? PALETTE.suburb_ochre_shadow : PALETTE.suburb_green_shadow,
        roofTint: sceneRng() > 0.55 ? PALETTE.tin_roof_zinc : PALETTE.tin_warehouse_dark,
        rows: 2 + Math.floor(sceneRng() * 3)
      });
    }
    return blocks;
  })();

  var FACTORY_CHIMNEYS = (function () {
    var arr = [];
    var xs = [0.06, 0.14, 0.27, 0.74, 0.85, 0.93];
    for (var i = 0; i < xs.length; i++) {
      arr.push({
        nx: xs[i],
        nh: 0.065 + sceneRng() * 0.038,
        nw: 0.007 + sceneRng() * 0.003,
        plumeLen: 0.045 + sceneRng() * 0.035
      });
    }
    return arr;
  })();

  var SKID_MARKS = (function () {
    var marks = [];
    for (var i = 0; i < 38; i++) {
      marks.push({
        u0: 0.48 + sceneRng() * 0.42,
        len: 0.05 + sceneRng() * 0.14,
        vOff: (sceneRng() - 0.5) * 0.52,
        alpha: 0.22 + sceneRng() * 0.36,
        thick: 0.8 + sceneRng() * 1.9
      });
    }
    return marks;
  })();

  var TARMAC_CRACKS = (function () {
    var cracks = [];
    for (var i = 0; i < 16; i++) {
      var pts = [];
      var u = 0.08 + sceneRng() * 0.84;
      var v = -0.44 + sceneRng() * 0.88;
      for (var s = 0; s < 5; s++) {
        pts.push({ u: u, v: v });
        u += (sceneRng() - 0.35) * 0.045;
        v += (sceneRng() - 0.5) * 0.16;
      }
      cracks.push(pts);
    }
    return cracks;
  })();

  var CLOUD_BANKS = (function () {
    var banks = [];
    for (var i = 0; i < 26; i++) {
      banks.push({
        nx: sceneRng(),
        ny: 0.08 + sceneRng() * 0.82,
        rx: 0.11 + sceneRng() * 0.18,
        ry: 0.045 + sceneRng() * 0.075,
        speed: 0.14 + sceneRng() * 0.28,
        tone: i % 3
      });
    }
    return banks;
  })();

  function degToRad(d) {
    return (d * Math.PI) / 180;
  }

  function haversineKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = degToRad(lat2 - lat1);
    var dLon = degToRad(lon2 - lon1);
    var a =
      Math.sin(dLat * 0.5) * Math.sin(dLat * 0.5) +
      Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
      Math.sin(dLon * 0.5) * Math.sin(dLon * 0.5);
    var c = 2 * Math.atan2(Math.sqrt(Math.min(1, a)), Math.sqrt(Math.max(0, 1 - a)));
    return R * c;
  }

  function initialBearingDeg(lat1, lon1, lat2, lon2) {
    var p1 = degToRad(lat1);
    var p2 = degToRad(lat2);
    var dL = degToRad(lon2 - lon1);
    var y = Math.sin(dL) * Math.cos(p2);
    var x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dL);
    var brng = (Math.atan2(y, x) * 180) / Math.PI;
    return Math.round((brng + 360) % 360);
  }

  function padPlacard18(str) {
    var clean = String(str || "TRUDE CENTRAL").toUpperCase().slice(0, FLAP_CELL_COUNT);
    var padLeft = Math.floor((FLAP_CELL_COUNT - clean.length) * 0.5);
    var out = "";
    for (var i = 0; i < padLeft; i++) out += " ";
    out += clean;
    while (out.length < FLAP_CELL_COUNT) out += " ";
    return out;
  }

  function resolveTargetDestination(targetOrCoords, currentIndex, flightsTaken) {
    var n = DESTINATIONS.length;
    if (typeof targetOrCoords === "number" && Number.isFinite(targetOrCoords)) {
      var idx = ((Math.trunc(targetOrCoords) % n) + n) % n;
      return DESTINATIONS[idx];
    }
    if (
      targetOrCoords === undefined ||
      targetOrCoords === null ||
      targetOrCoords === "next" ||
      targetOrCoords === ""
    ) {
      return DESTINATIONS[(currentIndex + 1) % n];
    }
    if (targetOrCoords === "random") {
      var stepOffset = 1 + ((flightsTaken * 7 + 5) % (n - 1));
      return DESTINATIONS[(currentIndex + stepOffset) % n];
    }
    if (typeof targetOrCoords === "string") {
      var q = targetOrCoords.trim().toUpperCase();
      for (var i = 0; i < n; i++) {
        if (DESTINATIONS[i].code === q || DESTINATIONS[i].placard === q) {
          return DESTINATIONS[i];
        }
      }
      for (var j = 0; j < n; j++) {
        if (
          DESTINATIONS[j].code.indexOf(q) !== -1 ||
          DESTINATIONS[j].placard.indexOf(q) !== -1 ||
          DESTINATIONS[j].regionLabel.toUpperCase().indexOf(q) !== -1
        ) {
          return DESTINATIONS[j];
        }
      }
      var cleanCode = q.replace(/[^A-Z0-9-]/g, "").slice(0, 7) || "TRD-XX";
      return {
        index: (currentIndex + 1) % n,
        code: cleanCode.indexOf("-") !== -1 ? cleanCode : cleanCode.slice(0, 3) + "-TRD",
        placard: q.slice(0, FLAP_CELL_COUNT),
        regionLabel: "Custom Continuum Sector",
        lat: DESTINATIONS[(currentIndex + 1) % n].lat,
        lon: DESTINATIONS[(currentIndex + 1) % n].lon,
        bearingDeg: 90,
        kmFromOrigin: 6420
      };
    }
    if (typeof targetOrCoords === "object") {
      var lat = Number(targetOrCoords.lat);
      var lon = Number(targetOrCoords.lon);
      if (!Number.isFinite(lat)) lat = 0;
      if (!Number.isFinite(lon)) lon = 0;
      var origin = DESTINATIONS[0];
      var bestIdx = 0;
      var bestDist = Infinity;
      for (var k = 0; k < n; k++) {
        var d = haversineKm(lat, lon, DESTINATIONS[k].lat, DESTINATIONS[k].lon);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = k;
        }
      }
      var nearest = DESTINATIONS[bestIdx];
      var customPlacard = targetOrCoords.placard
        ? String(targetOrCoords.placard).trim().toUpperCase().slice(0, FLAP_CELL_COUNT)
        : nearest.placard;
      var customCode = targetOrCoords.code
        ? String(targetOrCoords.code).trim().toUpperCase().slice(0, 8)
        : (targetOrCoords.placard ? customPlacard.replace(/[^A-Z]/g, "X").slice(0, 3) + "-TRD" : nearest.code);
      return {
        index: bestIdx,
        code: customCode,
        placard: customPlacard,
        regionLabel: targetOrCoords.regionLabel ? String(targetOrCoords.regionLabel) : nearest.regionLabel,
        lat: lat,
        lon: lon,
        bearingDeg: initialBearingDeg(origin.lat, origin.lon, lat, lon),
        kmFromOrigin: Math.round(haversineKm(origin.lat, origin.lon, lat, lon))
      };
    }
    return DESTINATIONS[(currentIndex + 1) % n];
  }

  function createTransitAudio(initialMuted) {
    var muted = Boolean(initialMuted);
    var audioCtx = null;
    var masterGain = null;
    var noiseBuffer = null;

    function ensureCtx() {
      if (muted) return null;
      try {
        var Ctor = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!Ctor) return null;
        if (!audioCtx) {
          audioCtx = new Ctor();
          masterGain = audioCtx.createGain();
          masterGain.gain.value = muted ? 0 : 0.22;
          masterGain.connect(audioCtx.destination);
          var sampleRate = audioCtx.sampleRate || 44100;
          var len = Math.floor(sampleRate * 1.5);
          noiseBuffer = audioCtx.createBuffer(1, len, sampleRate);
          var data = noiseBuffer.getChannelData(0);
          var rng = createSeededRng(440802);
          for (var i = 0; i < len; i++) {
            data[i] = rng() * 2 - 1;
          }
        }
        if (audioCtx.state === "suspended") {
          audioCtx.resume().catch(function () {});
        }
        return audioCtx;
      } catch (_err) {
        return null;
      }
    }

    function playSplitFlapCascade(count) {
      if (muted) return false;
      var ctx = ensureCtx();
      if (!ctx || !masterGain || !noiseBuffer) return false;
      try {
        var clicks = Math.max(4, Math.min(22, Number(count) || 14));
        var now = ctx.currentTime;
        for (var i = 0; i < clicks; i++) {
          var t0 = now + i * 0.022;
          var src = ctx.createBufferSource();
          src.buffer = noiseBuffer;
          var bp = ctx.createBiquadFilter();
          bp.type = "bandpass";
          bp.frequency.setValueAtTime(1250 + (i % 5) * 210, t0);
          bp.Q.setValueAtTime(3.6, t0);
          var g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.exponentialRampToValueAtTime(0.18, t0 + 0.003);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.021);
          src.connect(bp);
          bp.connect(g);
          g.connect(masterGain);
          src.start(t0, (i * 0.05) % 1.1, 0.026);
          src.stop(t0 + 0.028);
        }
        return true;
      } catch (_err) {
        return false;
      }
    }

    function playJetTransit(durationSec) {
      if (muted) return false;
      var ctx = ensureCtx();
      if (!ctx || !masterGain || !noiseBuffer) return false;
      try {
        var dur = Math.max(0.22, Math.min(3.5, Number(durationSec) || 2.1));
        var now = ctx.currentTime;
        var src = ctx.createBufferSource();
        src.buffer = noiseBuffer;
        src.loop = true;
        var lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.setValueAtTime(240, now);
        lp.frequency.exponentialRampToValueAtTime(760, now + dur * 0.35);
        lp.frequency.exponentialRampToValueAtTime(290, now + dur);
        var noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.0001, now);
        noiseGain.gain.linearRampToValueAtTime(0.14, now + dur * 0.22);
        noiseGain.gain.linearRampToValueAtTime(0.09, now + dur * 0.75);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        src.connect(lp);
        lp.connect(noiseGain);
        noiseGain.connect(masterGain);
        src.start(now);
        src.stop(now + dur + 0.03);

        var oscA = ctx.createOscillator();
        var oscB = ctx.createOscillator();
        oscA.type = "sawtooth";
        oscB.type = "triangle";
        oscA.frequency.setValueAtTime(66, now);
        oscA.frequency.linearRampToValueAtTime(84, now + dur * 0.4);
        oscA.frequency.linearRampToValueAtTime(62, now + dur);
        oscB.frequency.setValueAtTime(99, now);
        oscB.frequency.linearRampToValueAtTime(126, now + dur * 0.4);
        oscB.frequency.linearRampToValueAtTime(93, now + dur);
        var droneFilter = ctx.createBiquadFilter();
        droneFilter.type = "lowpass";
        droneFilter.frequency.setValueAtTime(210, now);
        var droneGain = ctx.createGain();
        droneGain.gain.setValueAtTime(0.0001, now);
        droneGain.gain.linearRampToValueAtTime(0.09, now + dur * 0.2);
        droneGain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        oscA.connect(droneFilter);
        oscB.connect(droneFilter);
        droneFilter.connect(droneGain);
        droneGain.connect(masterGain);
        oscA.start(now);
        oscB.start(now);
        oscA.stop(now + dur + 0.03);
        oscB.stop(now + dur + 0.03);
        return true;
      } catch (_err) {
        return false;
      }
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      if (masterGain && audioCtx) {
        try {
          masterGain.gain.setValueAtTime(muted ? 0 : 0.22, audioCtx.currentTime);
        } catch (_err) {}
      }
      return muted;
    }

    return {
      unlockAudio: function () { return Boolean(ensureCtx()); },
      setMuted: setMuted,
      toggleMute: function () { return setMuted(!muted); },
      isMuted: function () { return muted; },
      playSplitFlapCascade: playSplitFlapCascade,
      playJetTransit: playJetTransit,
      destroy: function () {
        if (audioCtx) {
          try { audioCtx.close(); } catch (_err) {}
          audioCtx = null;
          masterGain = null;
        }
      }
    };
  }

  function computePlacardBounds(w, h) {
    var compact = w < 560;
    var pw = Math.round(w * (compact ? 0.84 : 0.48));
    var ph = Math.round(Math.max(82, Math.min(138, h * (compact ? 0.16 : 0.175))));
    var px = Math.round((w - pw) * 0.5);
    var py = Math.round(h * (compact ? 0.14 : 0.155));
    return { x: px, y: py, w: pw, h: ph };
  }

  function drawSkyAndSuburbContinuum(ctx, w, h) {
    var horizonY = h * 0.41;
    var skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
    skyGrad.addColorStop(0, PALETTE.overcast_continuum_sky);
    skyGrad.addColorStop(0.62, "#3C443E");
    skyGrad.addColorStop(1, PALETTE.overcast_horizon_olive);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, horizonY + 2);

    ctx.fillStyle = "rgba(200, 184, 104, 0.08)";
    for (var c = 0; c < 5; c++) {
      var bandY = h * (0.05 + c * 0.062);
      ctx.fillRect(0, bandY, w, h * 0.022);
    }

    for (var ch = 0; ch < FACTORY_CHIMNEYS.length; ch++) {
      var fc = FACTORY_CHIMNEYS[ch];
      var cx = fc.nx * w;
      var cw = Math.max(4, fc.nw * w);
      var chH = fc.nh * h;
      var topY = horizonY - chH;
      ctx.fillStyle = "rgba(158, 166, 152, 0.16)";
      ctx.beginPath();
      ctx.ellipse(cx + fc.plumeLen * w * 0.5, topY - 6, fc.plumeLen * w * 0.6, 7, -0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PALETTE.tin_warehouse_dark;
      ctx.fillRect(cx - cw * 0.5, topY, cw, chH);
      ctx.fillStyle = PALETTE.roundabout_geranium;
      ctx.fillRect(cx - cw * 0.5, topY + 3, cw, 3);
    }

    ctx.fillStyle = "#3E483D";
    ctx.fillRect(0, horizonY - 4, w, h * 0.19);

    for (var i = 0; i < SUBURB_BLOCKS.length; i++) {
      var b = SUBURB_BLOCKS[i];
      var bx = b.nx * w;
      var bw = Math.max(10, b.nw * w);
      var bh = b.nh * h;
      var by = horizonY - bh * 0.72;
      ctx.fillStyle = b.litColor;
      ctx.fillRect(bx, by, bw * 0.68, bh);
      ctx.fillStyle = b.shadeColor;
      ctx.fillRect(bx + bw * 0.68, by + 2, bw * 0.34, bh - 2);
      ctx.fillStyle = b.roofTint;
      ctx.fillRect(bx - 1, by - 3, bw + 2, 3.5);
      ctx.fillStyle = "rgba(30, 34, 36, 0.48)";
      for (var r = 0; r < b.rows; r++) {
        var wy = by + 5 + r * ((bh - 8) / Math.max(1, b.rows));
        ctx.fillRect(bx + 3, wy, Math.max(2, bw * 0.18), 2.5);
        ctx.fillRect(bx + bw * 0.34, wy, Math.max(2, bw * 0.18), 2.5);
      }
    }

    var rbX = w * 0.84;
    var rbY = h * 0.455;
    ctx.fillStyle = "#2A3032";
    ctx.beginPath();
    ctx.ellipse(rbX, rbY, w * 0.068, h * 0.019, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PALETTE.suburb_greenish_lichen;
    ctx.beginPath();
    ctx.ellipse(rbX, rbY, w * 0.041, h * 0.011, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PALETTE.roundabout_marigold;
    ctx.beginPath();
    ctx.ellipse(rbX, rbY, w * 0.024, h * 0.0065, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PALETTE.roundabout_geranium;
    ctx.beginPath();
    ctx.ellipse(rbX, rbY, w * 0.010, h * 0.0032, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawHangarsAndTower(ctx, w, h, clock, reducedMotion) {
    var apronTop = h * 0.435;
    var pb = computePlacardBounds(w, h);
    var hangarCount = INVARIANT_RUNWAY_SPEC.hangarBays;
    for (var i = 0; i < hangarCount; i++) {
      var side = i < 3 ? 0 : 1;
      var slot = i % 3;
      var hx = side === 0
        ? w * (0.025 + slot * 0.082)
        : w * (0.735 + slot * 0.082);
      var hw = w * 0.074;
      var hh = h * 0.082;
      var hy = apronTop + h * 0.012;
      ctx.fillStyle = PALETTE.tin_warehouse_dark;
      ctx.fillRect(hx, hy, hw, hh);
      ctx.fillStyle = PALETTE.tin_roof_zinc;
      ctx.beginPath();
      ctx.moveTo(hx - 3, hy + 2);
      ctx.quadraticCurveTo(hx + hw * 0.5, hy - hh * 0.38, hx + hw + 3, hy + 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(30, 34, 36, 0.42)";
      ctx.lineWidth = 1;
      for (var rib = 1; rib < 6; rib++) {
        var rx = hx + (hw * rib) / 6;
        ctx.beginPath();
        ctx.moveTo(rx, hy);
        ctx.lineTo(rx, hy + hh);
        ctx.stroke();
      }
      ctx.fillStyle = PALETTE.asphalt_tarmac;
      ctx.fillRect(hx + hw * 0.18, hy + hh * 0.34, hw * 0.64, hh * 0.66);
    }

    var tx = pb.x - w * 0.055;
    var tw = Math.max(22, w * 0.032);
    var towerTop = h * 0.165;
    var towerBase = apronTop + h * 0.085;
    ctx.fillStyle = "#565E5D";
    ctx.fillRect(tx, towerTop + h * 0.055, tw, towerBase - towerTop - h * 0.055);
    ctx.fillStyle = PALETTE.tin_warehouse_dark;
    ctx.beginPath();
    ctx.moveTo(tx - tw * 0.36, towerTop);
    ctx.lineTo(tx + tw * 1.36, towerTop);
    ctx.lineTo(tx + tw * 1.12, towerTop + h * 0.055);
    ctx.lineTo(tx - tw * 0.12, towerTop + h * 0.055);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = PALETTE.goblet_celadon_glass;
    ctx.fillRect(tx - tw * 0.18, towerTop + 5, tw * 1.36, h * 0.032);
    ctx.fillStyle = PALETTE.roundabout_geranium;
    ctx.beginPath();
    ctx.arc(tx + tw * 0.5, towerTop - 6, 3.2, 0, Math.PI * 2);
    ctx.fill();

    var termX = pb.x - w * 0.015;
    var termW = pb.w + w * 0.03;
    var termY = pb.y + pb.h;
    var termH = Math.max(36, apronTop + h * 0.095 - termY);
    ctx.fillStyle = "#454D4E";
    ctx.fillRect(termX, termY, termW, termH);
    ctx.fillStyle = PALETTE.tin_roof_zinc;
    ctx.fillRect(termX - 6, termY - 4, termW + 12, 6);
    var bays = 8;
    for (var g = 0; g < bays; g++) {
      var gx = termX + 8 + g * ((termW - 16) / bays);
      ctx.fillStyle = "rgba(158, 181, 158, 0.42)";
      ctx.fillRect(gx, termY + 8, (termW - 28) / bays, termH * 0.54);
    }

    var wsX = w * 0.275;
    var wsY = apronTop + h * 0.105;
    ctx.strokeStyle = PALETTE.tin_roof_zinc;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wsX, wsY);
    ctx.lineTo(wsX, wsY - 28);
    ctx.stroke();
    var flutter = reducedMotion ? 0 : Math.sin(clock * 4.2) * 0.06;
    var ang = ((INVARIANT_RUNWAY_SPEC.windsockDeg - 90) * Math.PI) / 180 + flutter;
    ctx.save();
    ctx.translate(wsX, wsY - 27);
    ctx.rotate(ang);
    for (var seg = 0; seg < 4; seg++) {
      ctx.fillStyle = seg % 2 === 0 ? PALETTE.roundabout_geranium : PALETTE.placard_amber_ivory;
      ctx.fillRect(seg * 5.5, -3.2 + seg * 0.4, 5.5, 6.4 - seg * 0.8);
    }
    ctx.restore();
  }

  function drawApronAndRunway27L(ctx, w, h, clock, reducedMotion) {
    var apronY = h * 0.525;
    var rwyTop = h * 0.615;
    ctx.fillStyle = "#262B2D";
    ctx.fillRect(0, apronY, w, rwyTop - apronY + 2);

    var cartBaseX = w * 0.34;
    var cartY = apronY + (rwyTop - apronY) * 0.46;
    for (var c = 0; c < INVARIANT_RUNWAY_SPEC.luggageCarts; c++) {
      var cx = cartBaseX + c * 26;
      ctx.fillStyle = PALETTE.tin_roof_zinc;
      ctx.fillRect(cx, cartY, 19, 7);
      ctx.fillStyle = c % 2 === 0 ? PALETTE.suburb_ochre_shadow : PALETTE.suburb_green_shadow;
      ctx.fillRect(cx + 3, cartY - 6, 13, 6);
      ctx.fillStyle = "#111416";
      ctx.fillRect(cx + 2, cartY + 7, 4, 3);
      ctx.fillRect(cx + 13, cartY + 7, 4, 3);
    }

    var cabBaseX = w * 0.56;
    var cabY = apronY + (rwyTop - apronY) * 0.38;
    for (var t = 0; t < INVARIANT_RUNWAY_SPEC.taxiCabCount; t++) {
      var kx = cabBaseX + t * 36;
      ctx.fillStyle = PALETTE.suburb_yellowish_ochre;
      ctx.fillRect(kx, cabY, 26, 8);
      ctx.fillRect(kx + 5, cabY - 5, 14, 5);
      ctx.fillStyle = PALETTE.roundabout_marigold;
      ctx.fillRect(kx + 9, cabY - 7, 6, 2);
      ctx.fillStyle = "#111416";
      ctx.fillRect(kx + 4, cabY + 8, 5, 3);
      ctx.fillRect(kx + 17, cabY + 8, 5, 3);
    }

    ctx.fillStyle = PALETTE.asphalt_tarmac;
    ctx.fillRect(0, rwyTop, w, h - rwyTop);
    ctx.fillStyle = "#2D3336";
    ctx.beginPath();
    ctx.moveTo(w * 0.04, rwyTop + 6);
    ctx.lineTo(w * 0.96, rwyTop + 6);
    ctx.lineTo(w * 1.04, h);
    ctx.lineTo(-w * 0.04, h);
    ctx.closePath();
    ctx.fill();

    var midY = rwyTop + (h - rwyTop) * 0.52;
    var halfSpan = (h - rwyTop) * 0.42;

    ctx.strokeStyle = "rgba(16, 19, 21, 0.55)";
    ctx.lineWidth = 1.1;
    for (var cr = 0; cr < TARMAC_CRACKS.length; cr++) {
      var pts = TARMAC_CRACKS[cr];
      ctx.beginPath();
      for (var p = 0; p < pts.length; p++) {
        var px = pts[p].u * w;
        var py = midY + pts[p].v * halfSpan;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    for (var sm = 0; sm < SKID_MARKS.length; sm++) {
      var m = SKID_MARKS[sm];
      ctx.strokeStyle = "rgba(14, 16, 18, " + m.alpha.toFixed(2) + ")";
      ctx.lineWidth = m.thick;
      ctx.beginPath();
      ctx.moveTo(m.u0 * w, midY + m.vOff * halfSpan);
      ctx.lineTo((m.u0 - m.len) * w, midY + m.vOff * halfSpan);
      ctx.stroke();
    }

    ctx.fillStyle = "#D8D0B8";
    for (var d = 0; d < 9; d++) {
      ctx.fillRect(w * (0.06 + d * 0.085), midY - 2.5, w * 0.048, 5);
    }

    var stripeCount = INVARIANT_RUNWAY_SPEC.thresholdStripes;
    var thX = w * 0.86;
    for (var s = 0; s < stripeCount; s++) {
      var frac = (s - (stripeCount - 1) * 0.5) / (stripeCount * 0.55);
      var sy = midY + frac * halfSpan * 0.88;
      ctx.fillStyle = "#DFD7BE";
      ctx.fillRect(thX, sy - 3, w * 0.075, 5.5);
    }

    ctx.save();
    ctx.translate(w * 0.80, midY);
    ctx.rotate(-Math.PI * 0.5);
    ctx.fillStyle = "#E5DEC6";
    ctx.font = "700 " + Math.max(14, Math.round(w * 0.021)) + "px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(INVARIANT_RUNWAY_SPEC.runwayHeading, 0, 0);
    ctx.restore();

    var pulseIdx = reducedMotion ? 2 : Math.floor(clock * 6) % 6;
    for (var st = 0; st < 6; st++) {
      var lx = w * (0.975 - st * 0.018);
      ctx.fillStyle = st === pulseIdx ? PALETTE.placard_amber_ivory : "rgba(212, 149, 59, 0.45)";
      ctx.beginPath();
      ctx.arc(lx, midY, st === pulseIdx ? 3.2 : 2.0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawClippedPlacardAndFlaps(ctx, w, h, placardStr, codeStr, flapCells) {
    var pb = computePlacardBounds(w, h);
    ctx.save();
    ctx.beginPath();
    ctx.rect(pb.x, pb.y, pb.w, pb.h);
    ctx.clip();

    ctx.strokeStyle = PALETTE.tin_roof_zinc;
    ctx.lineWidth = 2;
    for (var leg = 0; leg < 5; leg++) {
      var lx = pb.x + pb.w * (0.12 + leg * 0.19);
      ctx.beginPath();
      ctx.moveTo(lx, pb.y + pb.h * 0.48);
      ctx.lineTo(lx, pb.y + pb.h);
      ctx.stroke();
    }

    var signH = Math.round(pb.h * 0.54);
    ctx.fillStyle = "#171B1D";
    ctx.fillRect(pb.x + 2, pb.y + 2, pb.w - 4, signH);
    ctx.strokeStyle = PALETTE.roundabout_marigold;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pb.x + 3, pb.y + 3, pb.w - 6, signH - 2);

    var badgeW = Math.max(58, Math.round(pb.w * 0.19));
    ctx.fillStyle = PALETTE.roundabout_marigold;
    ctx.fillRect(pb.x + 8, pb.y + 8, badgeW, signH - 14);
    ctx.fillStyle = "#16191B";
    ctx.font = "700 " + Math.max(10, Math.round(signH * 0.30)) + "px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(codeStr || "TRD-01"), pb.x + 8 + badgeW * 0.5, pb.y + 2 + signH * 0.5);

    var titleAreaX = pb.x + 14 + badgeW;
    var titleAreaW = pb.w - badgeW - 22;
    var bigFontPx = Math.max(12, Math.min(Math.round(signH * 0.48), Math.floor((titleAreaW / Math.max(10, String(placardStr).length)) * 1.55)));
    ctx.fillStyle = PALETTE.placard_amber_ivory;
    ctx.font = "700 " + bigFontPx + "px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(placardStr || "TRUDE CENTRAL"), titleAreaX + titleAreaW * 0.5, pb.y + 2 + signH * 0.52);

    var boardY = pb.y + signH + 6;
    var boardH = Math.max(24, pb.h - signH - 8);
    ctx.fillStyle = "#101315";
    ctx.fillRect(pb.x + 4, boardY, pb.w - 8, boardH);
    ctx.strokeStyle = PALETTE.tin_roof_zinc;
    ctx.lineWidth = 1;
    ctx.strokeRect(pb.x + 4, boardY, pb.w - 8, boardH);

    var count = FLAP_CELL_COUNT;
    var padX = pb.x + 10;
    var availW = pb.w - 20;
    var cellStep = availW / count;
    var cellW = Math.max(6, cellStep - 2);
    var cellH = Math.max(16, boardH - 8);
    var cellY = boardY + (boardH - cellH) * 0.5;
    var cellFont = Math.max(9, Math.min(Math.round(cellH * 0.68), Math.round(cellW * 1.15)));

    ctx.font = "700 " + cellFont + "px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (var i = 0; i < count; i++) {
      var cell = flapCells && flapCells[i] ? flapCells[i] : { currentChar: " ", flipPhase: 0 };
      var cx = padX + i * cellStep;
      ctx.fillStyle = "#1D2225";
      ctx.fillRect(cx, cellY, cellW, cellH);

      var flipScale = cell.flipPhase > 0 ? Math.max(0.14, Math.abs(Math.cos(cell.flipPhase * Math.PI))) : 1;
      ctx.save();
      ctx.translate(cx + cellW * 0.5, cellY + cellH * 0.5);
      ctx.scale(1, flipScale);
      ctx.fillStyle = cell.flipPhase > 0 ? PALETTE.roundabout_marigold : PALETTE.placard_amber_ivory;
      ctx.fillText(cell.currentChar || " ", 0, 0.5);
      ctx.restore();

      ctx.fillStyle = "#0B0D0E";
      ctx.fillRect(cx, cellY + cellH * 0.5 - 0.6, cellW, 1.2);
    }

    ctx.restore();
  }

  function drawInFlightOverlay(ctx, w, h, info, clock) {
    var p = info.progress;
    var cloudAlpha = 0;
    if (info.phase === "takeoff") {
      cloudAlpha = Math.min(1, p / 0.30);
    } else if (info.phase === "cloud_cruise") {
      cloudAlpha = 1;
    } else if (info.phase === "touchdown") {
      cloudAlpha = Math.max(0, 1 - (p - 0.72) / 0.28);
    }

    ctx.save();
    if (cloudAlpha > 0.01) {
      ctx.fillStyle = "rgba(43, 49, 48, " + (cloudAlpha * 0.88).toFixed(3) + ")";
      ctx.fillRect(0, 0, w, h);

      for (var i = 0; i < CLOUD_BANKS.length; i++) {
        var cb = CLOUD_BANKS[i];
        var drift = info.reducedMotion ? 0 : (clock * cb.speed + p * 0.85) % 1.3;
        var nx = ((cb.nx - drift) % 1.3 + 1.3) % 1.3 - 0.15;
        var ny = cb.ny;
        var colors = [
          "rgba(108, 131, 100, ",
          "rgba(156, 142, 71, ",
          "rgba(126, 135, 138, "
        ];
        ctx.fillStyle = colors[cb.tone] + (cloudAlpha * 0.34).toFixed(3) + ")";
        ctx.beginPath();
        ctx.ellipse(nx * w, ny * h, cb.rx * w, cb.ry * h, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    var wingEnter = p < 0.22 ? p / 0.22 : (p > 0.82 ? Math.max(0, (1 - p) / 0.18) : 1);
    if (wingEnter > 0.02) {
      ctx.save();
      var bank = info.reducedMotion ? -0.05 : -0.09 * Math.sin(p * Math.PI);
      ctx.translate(w * 0.72, h * (1.06 - wingEnter * 0.28));
      ctx.rotate(bank);
      ctx.fillStyle = "#596265";
      ctx.beginPath();
      ctx.ellipse(-w * 0.08, h * 0.055, w * 0.065, h * 0.028, -0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#8C9699";
      ctx.beginPath();
      ctx.moveTo(w * 0.34, h * 0.12);
      ctx.lineTo(-w * 0.38, -h * 0.04);
      ctx.lineTo(-w * 0.42, h * 0.015);
      ctx.lineTo(w * 0.28, h * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#C7D0D2";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.34, h * 0.12);
      ctx.lineTo(-w * 0.38, -h * 0.04);
      ctx.stroke();
      ctx.fillStyle = PALETTE.roundabout_geranium;
      ctx.beginPath();
      ctx.arc(-w * 0.40, -h * 0.012, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    var hudW = Math.min(w * 0.88, 390);
    var hudH = 68;
    var hudX = (w - hudW) * 0.5;
    var hudY = h * 0.68;
    ctx.fillStyle = "rgba(22, 26, 28, 0.86)";
    ctx.fillRect(hudX, hudY, hudW, hudH);
    ctx.strokeStyle = PALETTE.roundabout_marigold;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(hudX, hudY, hudW, hudH);

    ctx.fillStyle = PALETTE.placard_amber_ivory;
    ctx.font = "700 12px monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    var legLabel = info.fromCode + " -> " + info.toCode + "  [" + info.phase.toUpperCase() + "]";
    ctx.fillText(legLabel, hudX + 12, hudY + 10);

    ctx.fillStyle = PALETTE.suburb_yellowish_ochre;
    ctx.font = "11px monospace";
    var coordStr =
      "VEC " + info.lat.toFixed(2) + ", " + info.lon.toFixed(2) +
      " | BRG " + info.bearingDeg + " DEG | " + info.kmFlown + "/" + info.legKm + " KM";
    ctx.fillText(coordStr, hudX + 12, hudY + 29);

    ctx.fillStyle = PALETTE.goblet_celadon_glass;
    ctx.fillText("RWY 27L SUBSTRATE VARIANCE: 0.00% (SOLE TRUDE)", hudX + 12, hudY + 47);
    ctx.restore();
  }

  function buildStaticFlapCells(placardStr) {
    var padded = padPlacard18(placardStr);
    var arr = [];
    for (var i = 0; i < FLAP_CELL_COUNT; i++) {
      var ch = padded.charAt(i);
      arr.push({
        currentChar: ch,
        targetChar: ch,
        flipPhase: 0,
        cyclesLeft: 0
      });
    }
    return arr;
  }

  function resolveOverridePlacardAndCode(overridePlacard, overrideCode, fallbackCode) {
    if (overridePlacard && typeof overridePlacard === "object") {
      return {
        placard: String(overridePlacard.placard || "TRUDE CENTRAL").toUpperCase(),
        code: String(overridePlacard.code || overrideCode || fallbackCode || "TRD-01").toUpperCase()
      };
    }
    var raw = String(overridePlacard || "TRUDE CENTRAL").trim().toUpperCase();
    for (var i = 0; i < DESTINATIONS.length; i++) {
      if (DESTINATIONS[i].placard === raw || DESTINATIONS[i].code === raw) {
        return {
          placard: DESTINATIONS[i].placard,
          code: overrideCode ? String(overrideCode).toUpperCase() : DESTINATIONS[i].code
        };
      }
    }
    return {
      placard: raw.slice(0, FLAP_CELL_COUNT),
      code: overrideCode ? String(overrideCode).toUpperCase() : String(fallbackCode || "TRD-01").toUpperCase()
    };
  }

  function createTransitEngine(opts) {
    var cfg = opts || {};
    var vpWidth = Math.max(64, Number(cfg.width) || 1280);
    var vpHeight = Math.max(64, Number(cfg.height) || 800);
    var reducedMotion = Boolean(cfg.reducedMotion);
    var onFlightLanded = typeof cfg.onFlightLanded === "function" ? cfg.onFlightLanded : null;
    var onPlacardFlip = typeof cfg.onPlacardFlip === "function" ? cfg.onPlacardFlip : null;

    var audio = createTransitAudio(Boolean(cfg.muted));
    var originDest = DESTINATIONS[0];
    var originIndex = 0;
    var currentIndex = 0;
    var currentDest = originDest;
    var airportPlacardCode = originDest.code;
    var airportPlacardLetters = originDest.placard;
    var regionLabel = originDest.regionLabel;
    var destinationLat = originDest.lat;
    var destinationLon = originDest.lon;
    var distanceFlownKm = 0;
    var totalDistanceKm = 0;
    var flightsTaken = 0;
    var flightPhase = "landed";
    var flightProgress = 0;
    var ambientClock = 0;
    var pendingFlight = null;
    var visitedCodes = new Set([originDest.code]);
    var flapCells = buildStaticFlapCells(originDest.placard);

    function settleFlapsTo(placardStr) {
      var padded = padPlacard18(placardStr);
      for (var i = 0; i < FLAP_CELL_COUNT; i++) {
        var ch = padded.charAt(i);
        flapCells[i].currentChar = ch;
        flapCells[i].targetChar = ch;
        flapCells[i].flipPhase = 0;
        flapCells[i].cyclesLeft = 0;
      }
    }

    function compareOriginVsCurrent() {
      return {
        originPlacardCode: originDest.code,
        currentPlacardCode: airportPlacardCode,
        originPlacardLetters: originDest.placard,
        currentPlacardLetters: airportPlacardLetters,
        placardChanged: originDest.code !== airportPlacardCode || originDest.placard !== airportPlacardLetters,
        runwayGeometryDiff: 0,
        hangarBayDiff: 0,
        windsockAngleDiff: 0,
        suburbHorizonDiff: 0,
        detailVarianceAcrossFlights: 0,
        structuralSimilarityPct: 100,
        departureEscapesTrude: false,
        onlyAirportNameChanges: true
      };
    }

    function getState() {
      return {
        originIndex: originIndex,
        currentIndex: currentIndex,
        originPlacardCode: originDest.code,
        airportPlacardCode: airportPlacardCode,
        airportPlacardLetters: airportPlacardLetters,
        regionLabel: regionLabel,
        destinationLat: destinationLat,
        destinationLon: destinationLon,
        distanceFlownKm: distanceFlownKm,
        totalDistanceKm: totalDistanceKm,
        flightsTaken: flightsTaken,
        uniquePlacardsVisited: visitedCodes.size,
        flightPhase: flightPhase,
        flightProgress: flightProgress,
        flapCells: flapCells.map(function (c) {
          return {
            currentChar: c.currentChar,
            targetChar: c.targetChar,
            flipPhase: c.flipPhase
          };
        }),
        departureEscapesTrude: false,
        detailVarianceAcrossFlights: 0,
        onlyAirportNameChanges: true,
        soleTrudeContinuum: true,
        runwayHeading: INVARIANT_RUNWAY_SPEC.runwayHeading,
        muted: audio.isMuted(),
        reducedMotion: reducedMotion,
        destinations: DESTINATIONS
      };
    }

    function startFlapCascadeTo(placardStr) {
      var padded = padPlacard18(placardStr);
      for (var i = 0; i < FLAP_CELL_COUNT; i++) {
        var nextCh = padded.charAt(i);
        flapCells[i].targetChar = nextCh;
        flapCells[i].cyclesLeft = flapCells[i].currentChar === nextCh ? 1 : (2 + (i % 4));
        flapCells[i].flipPhase = 0.08 + (i % 3) * 0.05;
      }
    }

    function advanceFlapDrums(dt) {
      var speed = reducedMotion ? 16 : 9.5;
      for (var i = 0; i < FLAP_CELL_COUNT; i++) {
        var c = flapCells[i];
        if (c.cyclesLeft > 0 || c.currentChar !== c.targetChar) {
          c.flipPhase += dt * speed;
          if (c.flipPhase >= 1) {
            c.flipPhase = 0;
            if (c.cyclesLeft > 1) {
              c.cyclesLeft -= 1;
              var pos = FLAP_ALPHABET.indexOf(c.currentChar);
              c.currentChar = FLAP_ALPHABET.charAt((pos + 3 + i) % FLAP_ALPHABET.length);
            } else {
              c.cyclesLeft = 0;
              c.currentChar = c.targetChar;
            }
          }
        } else {
          c.flipPhase = 0;
        }
      }
    }

    function completeFlightNow() {
      if (!pendingFlight) {
        settleFlapsTo(airportPlacardLetters);
        flightPhase = "landed";
        flightProgress = 0;
        return getState();
      }
      var prevCode = airportPlacardCode;
      var prevPlacard = airportPlacardLetters;
      var target = pendingFlight.target;
      if (!pendingFlight.cascadeTriggered) {
        audio.playSplitFlapCascade(14);
      }
      currentDest = target;
      currentIndex = typeof target.index === "number" ? target.index : currentIndex;
      airportPlacardCode = target.code;
      airportPlacardLetters = target.placard;
      regionLabel = target.regionLabel;
      destinationLat = target.lat;
      destinationLon = target.lon;
      distanceFlownKm = pendingFlight.legKm;
      totalDistanceKm += pendingFlight.legKm;
      flightsTaken += 1;
      visitedCodes.add(airportPlacardCode);
      settleFlapsTo(airportPlacardLetters);
      pendingFlight = null;
      flightPhase = "landed";
      flightProgress = 0;

      var flipPayload = {
        code: airportPlacardCode,
        placard: airportPlacardLetters,
        airportPlacardCode: airportPlacardCode,
        airportPlacardLetters: airportPlacardLetters,
        previousCode: prevCode,
        previousPlacard: prevPlacard,
        currentIndex: currentIndex,
        flightsTaken: flightsTaken
      };
      if (onPlacardFlip) {
        try { onPlacardFlip(flipPayload); } catch (_err) {}
      }
      if (onFlightLanded) {
        try { onFlightLanded(getState(), compareOriginVsCurrent()); } catch (_err) {}
      }
      return getState();
    }

    function bookEscapeFlight(targetOrCoords, flyOpts) {
      var fOpts = flyOpts || {};
      var target = resolveTargetDestination(targetOrCoords, currentIndex, flightsTaken);
      var legKm = Math.max(
        420,
        Math.round(haversineKm(currentDest.lat, currentDest.lon, target.lat, target.lon))
      );
      var brg = initialBearingDeg(currentDest.lat, currentDest.lon, target.lat, target.lon);
      var dur = reducedMotion ? 0.2 : (Number(fOpts.durationSec) > 0 ? Number(fOpts.durationSec) : 2.4);

      pendingFlight = {
        from: currentDest,
        target: target,
        legKm: legKm,
        bearingDeg: brg,
        durationSec: dur,
        cascadeTriggered: false
      };
      flightPhase = "takeoff";
      flightProgress = 0;
      distanceFlownKm = 0;

      audio.playJetTransit(fOpts.instant ? 0.28 : dur);

      if (fOpts.instant === true) {
        return completeFlightNow();
      }
      return getState();
    }

    function step(dtSec) {
      var dt = Math.max(0, Math.min(0.25, Number(dtSec) || 0.016));
      if (!reducedMotion) {
        ambientClock += dt;
      }
      if (pendingFlight) {
        flightProgress = Math.min(1, flightProgress + dt / pendingFlight.durationSec);
        distanceFlownKm = Math.round(pendingFlight.legKm * flightProgress);
        destinationLat = pendingFlight.from.lat + (pendingFlight.target.lat - pendingFlight.from.lat) * flightProgress;
        destinationLon = pendingFlight.from.lon + (pendingFlight.target.lon - pendingFlight.from.lon) * flightProgress;

        if (flightProgress < 0.30) {
          flightPhase = "takeoff";
        } else if (flightProgress < 0.72) {
          flightPhase = "cloud_cruise";
        } else {
          flightPhase = "touchdown";
        }

        if (flightProgress >= 0.54 && !pendingFlight.cascadeTriggered) {
          pendingFlight.cascadeTriggered = true;
          startFlapCascadeTo(pendingFlight.target.placard);
          audio.playSplitFlapCascade(16);
        }

        advanceFlapDrums(dt);

        if (flightProgress >= 1) {
          return completeFlightNow();
        }
      } else {
        advanceFlapDrums(dt);
      }
      return getState();
    }

    function renderAirport(ctx, width, height, params) {
      var w = Math.max(64, Number(width) || vpWidth);
      var h = Math.max(64, Number(height) || vpHeight);
      var p = params || {};
      if (!ctx) return computePlacardBounds(w, h);

      var clock = typeof p.timeSec === "number" ? p.timeSec : ambientClock;
      var hasOverride = p.overridePlacard !== undefined && p.overridePlacard !== null;

      ctx.save();
      drawSkyAndSuburbContinuum(ctx, w, h);
      drawHangarsAndTower(ctx, w, h, clock, reducedMotion);
      drawApronAndRunway27L(ctx, w, h, clock, reducedMotion);

      if (hasOverride) {
        var ov = resolveOverridePlacardAndCode(p.overridePlacard, p.overrideCode, airportPlacardCode);
        var ovCells = buildStaticFlapCells(ov.placard);
        drawClippedPlacardAndFlaps(ctx, w, h, ov.placard, ov.code, ovCells);
      } else {
        var displayPlacard = (pendingFlight && flightProgress >= 0.62)
          ? pendingFlight.target.placard
          : airportPlacardLetters;
        var displayCode = (pendingFlight && flightProgress >= 0.62)
          ? pendingFlight.target.code
          : airportPlacardCode;
        drawClippedPlacardAndFlaps(ctx, w, h, displayPlacard, displayCode, flapCells);

        if (flightPhase !== "landed" && pendingFlight) {
          drawInFlightOverlay(ctx, w, h, {
            phase: flightPhase,
            progress: flightProgress,
            fromCode: pendingFlight.from.code,
            toCode: pendingFlight.target.code,
            legKm: pendingFlight.legKm,
            kmFlown: distanceFlownKm,
            lat: destinationLat,
            lon: destinationLon,
            bearingDeg: pendingFlight.bearingDeg,
            reducedMotion: reducedMotion
          }, clock);
        }
      }
      ctx.restore();
      return computePlacardBounds(w, h);
    }

    return {
      bookEscapeFlight: bookEscapeFlight,
      completeFlightNow: completeFlightNow,
      step: step,
      renderAirport: renderAirport,
      compareOriginVsCurrent: compareOriginVsCurrent,
      getPlacardBounds: function (w, h) {
        return computePlacardBounds(Math.max(64, Number(w) || vpWidth), Math.max(64, Number(h) || vpHeight));
      },
      unlockAudio: audio.unlockAudio,
      setMuted: audio.setMuted,
      toggleMute: audio.toggleMute,
      isMuted: audio.isMuted,
      playSplitFlapCascade: audio.playSplitFlapCascade,
      playJetTransit: audio.playJetTransit,
      setViewport: function (w, h) {
        vpWidth = Math.max(64, Number(w) || vpWidth);
        vpHeight = Math.max(64, Number(h) || vpHeight);
      },
      setReducedMotion: function (flag) {
        reducedMotion = Boolean(flag);
      },
      getState: getState,
      destroy: function () {
        pendingFlight = null;
        audio.destroy();
      }
    };
  }

  var TrudeAirportTransit = Object.freeze({
    PALETTE: PALETTE,
    DESTINATIONS: DESTINATIONS,
    INVARIANT_RUNWAY_SPEC: INVARIANT_RUNWAY_SPEC,
    createTransitEngine: createTransitEngine
  });

  globalThis.TrudeAirportTransit = TrudeAirportTransit;
  if (typeof window !== "undefined") {
    window.TrudeAirportTransit = TrudeAirportTransit;
  }
})();
