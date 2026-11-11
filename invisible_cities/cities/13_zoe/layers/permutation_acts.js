/*
 * City 13: ZOE (Chapter II - Cities & Signs 3)
 * Layer: layers/permutation_acts.js
 * Epistemic Partition: Nine simultaneous Calvino acts, dynamic cross-shell
 * derangement & chalk-piercing filaments, bespoke interior vignettes, and
 * polyphonic procedural WebAudio.
 */
(function (root) {
  "use strict";

  var SHELL_IDS = [
    "pyramid_roof",
    "pagoda",
    "covered_market",
    "canal",
    "rubbish_heap"
  ];

  var SHELL_META = {
    pyramid_roof: { label: "Pyramid Roof", expected: "Palace & Treasury", ax: 0.20, ay: 0.29 },
    pagoda: { label: "Pine-Cone Pagoda", expected: "High Priests Sanctuary", ax: 0.50, ay: 0.26 },
    covered_market: { label: "Covered Market", expected: "Grand Bazaar Arcade", ax: 0.80, ay: 0.29 },
    canal: { label: "Scrawl of Canals", expected: "Embassy Quays & Gardens", ax: 0.33, ay: 0.73 },
    rubbish_heap: { label: "Rubbish Heap", expected: "Outcast Midden", ax: 0.68, ay: 0.73 }
  };

  var ACTS = [
    {
      id: "sleeping",
      index: 0,
      label: "Sleeping",
      shortLabel: "SLEEP",
      symbol: "\u263D",
      naiveShellId: "rubbish_heap",
      hue: "#7d8cc4",
      summary: "Bolster mats & rhythmic nocturnal breathing"
    },
    {
      id: "tool_forging",
      index: 1,
      label: "Tool-Forging",
      shortLabel: "FORGE",
      symbol: "\u2692",
      naiveShellId: "covered_market",
      hue: "#e87a3d",
      summary: "White-hot iron on anvil, bellows & flying sparks"
    },
    {
      id: "cooking",
      index: 2,
      label: "Cooking",
      shortLabel: "COOK",
      symbol: "\u2668",
      naiveShellId: "rubbish_heap",
      hue: "#d99b38",
      summary: "Copper cauldron steam, hearth embers & saffron broth"
    },
    {
      id: "gold_counting",
      index: 3,
      label: "Gold-Counting",
      shortLabel: "GOLD",
      symbol: "\u2696",
      naiveShellId: "pyramid_roof",
      hue: "#ebd05b",
      summary: "Stacked bezants, brass assay balance & tally weights"
    },
    {
      id: "reigning",
      index: 4,
      label: "Reigning",
      shortLabel: "REIGN",
      symbol: "\u265B",
      naiveShellId: "pyramid_roof",
      hue: "#c95b78",
      summary: "Purple dais, scepter edict & kneeling envoys"
    },
    {
      id: "trading",
      index: 5,
      label: "Trading",
      shortLabel: "TRADE",
      symbol: "\u21C4",
      naiveShellId: "covered_market",
      hue: "#5ab899",
      summary: "Unrolled silk bales, spice measures & abacus beads"
    },
    {
      id: "consulting_oracles",
      index: 6,
      label: "Consulting Oracles",
      shortLabel: "ORACLE",
      symbol: "\u25C8",
      naiveShellId: "pagoda",
      hue: "#9e78d6",
      summary: "Smoking tripod cleft, cast bone lots & laurel vapor"
    },
    {
      id: "leprosarium_tending",
      index: 7,
      label: "Leprosarium Tending",
      shortLabel: "LEPROSY",
      symbol: "\u271A",
      naiveShellId: "rubbish_heap",
      hue: "#a3b899",
      summary: "Quarantine cots, linen bandages, salve bowls & bell"
    },
    {
      id: "odalisque_bathing",
      index: 8,
      label: "Odalisque Bathing",
      shortLabel: "BATHS",
      symbol: "\u2248",
      naiveShellId: "canal",
      hue: "#e38fb3",
      summary: "Marble steam-basin, rosewater ewers & silk veils"
    }
  ];

  var ACT_BY_ID = {};
  for (var ai = 0; ai < ACTS.length; ai++) {
    ACT_BY_ID[ACTS[ai].id] = ACTS[ai];
  }

  /* Canonical Calvino initial state: all 9 acts active, 0 in naive shell (1.0 incongruity) */
  var INITIAL_ASSIGNMENTS = {
    pyramid_roof: ["leprosarium_tending", "odalisque_bathing"],
    pagoda: ["tool_forging", "cooking"],
    covered_market: ["consulting_oracles", "sleeping"],
    canal: ["gold_counting", "reigning"],
    rubbish_heap: ["trading"]
  };

  /* Fallback guaranteed-valid full derangement bank (100% unexpected across all 5 solo rotations) */
  var FALLBACK_DERANGEMENTS = [
    {
      pyramid_roof: ["consulting_oracles"],
      pagoda: ["reigning", "odalisque_bathing"],
      covered_market: ["gold_counting", "leprosarium_tending"],
      canal: ["tool_forging", "sleeping"],
      rubbish_heap: ["trading", "cooking"]
    },
    {
      pyramid_roof: ["trading", "cooking"],
      pagoda: ["leprosarium_tending"],
      covered_market: ["reigning", "odalisque_bathing"],
      canal: ["consulting_oracles", "sleeping"],
      rubbish_heap: ["gold_counting", "tool_forging"]
    },
    {
      pyramid_roof: ["sleeping", "tool_forging"],
      pagoda: ["gold_counting", "trading"],
      covered_market: ["leprosarium_tending"],
      canal: ["cooking", "consulting_oracles"],
      rubbish_heap: ["reigning", "odalisque_bathing"]
    },
    {
      pyramid_roof: ["cooking", "trading"],
      pagoda: ["sleeping", "leprosarium_tending"],
      covered_market: ["odalisque_bathing", "gold_counting"],
      canal: ["tool_forging"],
      rubbish_heap: ["consulting_oracles", "reigning"]
    }
  ];
  /* Fix fallback[0] rubbish_heap cooking naive -> swap cooking with canal sleeping? Wait: sleeping naive is rubbish_heap too! Swap cooking with covered_market gold_counting! */
  FALLBACK_DERANGEMENTS[0].covered_market = ["cooking", "leprosarium_tending"];
  FALLBACK_DERANGEMENTS[0].rubbish_heap = ["trading", "gold_counting"];

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hexToRgba(hex, alpha) {
    var h = String(hex || "#e5b94c").replace("#", "");
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    var r = parseInt(h.slice(0, 2), 16) || 229;
    var g = parseInt(h.slice(2, 4), 16) || 185;
    var b = parseInt(h.slice(4, 6), 16) || 76;
    return "rgba(" + r + "," + g + "," + b + "," + clamp(alpha, 0, 1).toFixed(3) + ")";
  }

  function quadBezier(p0x, p0y, cx, cy, p1x, p1y, t) {
    var inv = 1 - t;
    return {
      x: inv * inv * p0x + 2 * inv * t * cx + t * t * p1x,
      y: inv * inv * p0y + 2 * inv * t * cy + t * t * p1y
    };
  }

  function segmentIntersection(ax, ay, bx, by, cx, cy, dx, dy) {
    var rpx = bx - ax;
    var rpy = by - ay;
    var spx = dx - cx;
    var spy = dy - cy;
    var denom = rpx * spy - rpy * spx;
    if (Math.abs(denom) < 1e-7) {
      return null;
    }
    var qpx = cx - ax;
    var qpy = cy - ay;
    var t = (qpx * spy - qpy * spx) / denom;
    var u = (qpx * rpy - qpy * rpx) / denom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return { x: ax + t * rpx, y: ay + t * rpy, t: t, u: u };
    }
    return null;
  }

  /* Polyphonic Procedural WebAudio Engine (zero external assets, headless-safe) */
  function createAudioEngine(initialMuted) {
    var muted = Boolean(initialMuted);
    var actx = null;
    var master = null;
    var noiseBuf = null;

    function ensureNoise(ctx) {
      if (noiseBuf) { return noiseBuf; }
      var len = Math.max(1, Math.floor(ctx.sampleRate * 0.6));
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      noiseBuf = buf;
      return noiseBuf;
    }

    function unlockAudio() {
      try {
        if (!actx) {
          var Ctor = root.AudioContext || root.webkitAudioContext;
          if (!Ctor) { return false; }
          actx = new Ctor();
          master = actx.createGain();
          master.gain.value = muted ? 0.0001 : 0.22;
          master.connect(actx.destination);
        }
        if (actx && actx.state === "suspended" && typeof actx.resume === "function") {
          actx.resume().catch(function () {});
        }
        return Boolean(actx);
      } catch (e) {
        return false;
      }
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      try {
        if (actx && master) {
          var now = actx.currentTime;
          master.gain.cancelScheduledValues(now);
          master.gain.setTargetAtTime(muted ? 0.0001 : 0.22, now, 0.025);
        }
      } catch (e) {}
      return muted;
    }

    function isMuted() {
      return muted;
    }

    function playTone(freq, type, dur, peak, delaySec, slideTo) {
      if (muted || !actx || !master) { return; }
      try {
        var t0 = actx.currentTime + (delaySec || 0);
        var osc = actx.createOscillator();
        var g = actx.createGain();
        osc.type = type || "sine";
        osc.frequency.setValueAtTime(Math.max(30, freq), t0);
        if (slideTo) {
          osc.frequency.exponentialRampToValueAtTime(Math.max(30, slideTo), t0 + dur * 0.88);
        }
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(peak || 0.14, t0 + Math.min(0.03, dur * 0.2));
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        osc.connect(g);
        g.connect(master);
        osc.start(t0);
        osc.stop(t0 + dur + 0.02);
      } catch (e) {}
    }

    function playFilteredNoise(filterType, freq, q, dur, peak, delaySec, slideTo) {
      if (muted || !actx || !master) { return; }
      try {
        var t0 = actx.currentTime + (delaySec || 0);
        var src = actx.createBufferSource();
        src.buffer = ensureNoise(actx);
        src.loop = true;
        var flt = actx.createBiquadFilter();
        flt.type = filterType || "bandpass";
        flt.frequency.setValueAtTime(freq, t0);
        if (slideTo) {
          flt.frequency.exponentialRampToValueAtTime(Math.max(40, slideTo), t0 + dur);
        }
        flt.Q.value = q || 3.0;
        var g = actx.createGain();
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.linearRampToValueAtTime(peak || 0.12, t0 + Math.min(0.03, dur * 0.22));
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        src.connect(flt);
        flt.connect(g);
        g.connect(master);
        src.start(t0);
        src.stop(t0 + dur + 0.02);
      } catch (e) {}
    }

    function triggerActVoice(actId, delayOffset) {
      if (muted || !actx || !master) { return; }
      var d = delayOffset || 0;
      if (actId === "sleeping") {
        playTone(174.6, "sine", 0.52, 0.11, d, 172.0);
        playTone(261.6, "triangle", 0.55, 0.07, d + 0.03, 258.0);
        playFilteredNoise("lowpass", 420, 1.4, 0.45, 0.05, d + 0.02, 260);
      } else if (actId === "tool_forging") {
        /* FM-style metallic anvil clang + high spark ping */
        try {
          var t0 = actx.currentTime + d;
          var car = actx.createOscillator();
          var mod = actx.createOscillator();
          var mg = actx.createGain();
          var cg = actx.createGain();
          car.frequency.setValueAtTime(690, t0);
          mod.frequency.setValueAtTime(690 * 2.76, t0);
          mg.gain.setValueAtTime(520, t0);
          mg.gain.exponentialRampToValueAtTime(8, t0 + 0.24);
          cg.gain.setValueAtTime(0.0001, t0);
          cg.gain.linearRampToValueAtTime(0.18, t0 + 0.006);
          cg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.30);
          mod.connect(mg);
          mg.connect(car.frequency);
          car.connect(cg);
          cg.connect(master);
          mod.start(t0);
          car.start(t0);
          mod.stop(t0 + 0.32);
          car.stop(t0 + 0.32);
        } catch (e) {}
        playTone(2480, "sine", 0.11, 0.06, d + 0.03, 3100);
      } else if (actId === "cooking") {
        playTone(293.7, "sine", 0.36, 0.11, d);
        playTone(440.0, "sine", 0.34, 0.08, d + 0.02);
        playTone(520, "sine", 0.09, 0.07, d + 0.05, 760);
        playTone(610, "sine", 0.08, 0.06, d + 0.14, 890);
      } else if (actId === "gold_counting") {
        playTone(1760, "sine", 0.28, 0.11, d);
        playTone(2637, "triangle", 0.24, 0.07, d + 0.045);
        playTone(3520, "sine", 0.18, 0.05, d + 0.09);
      } else if (actId === "reigning") {
        playTone(130.8, "sawtooth", 0.44, 0.08, d);
        playTone(196.0, "triangle", 0.44, 0.10, d + 0.02);
        playTone(329.6, "triangle", 0.40, 0.08, d + 0.05);
      } else if (actId === "trading") {
        playFilteredNoise("bandpass", 960, 9.0, 0.055, 0.15, d);
        playFilteredNoise("bandpass", 1220, 9.0, 0.055, 0.14, d + 0.055);
        playFilteredNoise("bandpass", 1490, 9.0, 0.060, 0.13, d + 0.11);
      } else if (actId === "consulting_oracles") {
        playTone(164.8, "triangle", 0.56, 0.10, d);
        playTone(174.6, "sine", 0.56, 0.09, d + 0.03);
        playTone(246.9, "sine", 0.52, 0.08, d + 0.06);
      } else if (actId === "leprosarium_tending") {
        playTone(784.0, "sine", 0.38, 0.12, d);
        playTone(1582.0, "sine", 0.26, 0.06, d + 0.01);
        playFilteredNoise("bandpass", 720, 6.0, 0.04, 0.09, d);
      } else {
        /* odalisque_bathing: pentatonic water-harp */
        playTone(370.0, "sine", 0.30, 0.09, d);
        playTone(440.0, "sine", 0.30, 0.09, d + 0.055);
        playTone(554.4, "triangle", 0.32, 0.08, d + 0.11);
        playTone(659.3, "sine", 0.34, 0.07, d + 0.165);
      }
    }

    function triggerChalkScratch() {
      playFilteredNoise("bandpass", 2350, 4.2, 0.085, 0.11, 0, 1780);
      playFilteredNoise("highpass", 3400, 1.8, 0.055, 0.06, 0.015);
    }

    function triggerDissolveChord() {
      playTone(293.66, "sine", 0.58, 0.08, 0, 311.1);
      playTone(440.00, "triangle", 0.62, 0.07, 0.04, 466.2);
      playTone(659.25, "sine", 0.66, 0.06, 0.08, 698.5);
      playTone(880.00, "sine", 0.70, 0.05, 0.12, 987.8);
    }

    function triggerPerimeterTumbleSound() {
      /* Wooden cartwheel rumble morphing into haunting steppe wolf-howl glissando */
      playFilteredNoise("lowpass", 135, 3.2, 0.52, 0.18, 0, 78);
      playTone(72, "triangle", 0.14, 0.14, 0.02, 54);
      playTone(78, "triangle", 0.14, 0.13, 0.16, 58);
      playTone(84, "triangle", 0.14, 0.12, 0.30, 62);
      if (!muted && actx && master) {
        try {
          var t0 = actx.currentTime + 0.28;
          var howl = actx.createOscillator();
          var lfo = actx.createOscillator();
          var lfoGain = actx.createGain();
          var flt = actx.createBiquadFilter();
          var hg = actx.createGain();
          howl.type = "triangle";
          howl.frequency.setValueAtTime(285, t0);
          howl.frequency.exponentialRampToValueAtTime(548, t0 + 0.34);
          howl.frequency.exponentialRampToValueAtTime(372, t0 + 0.92);
          lfo.frequency.setValueAtTime(5.6, t0);
          lfoGain.gain.setValueAtTime(9.5, t0);
          flt.type = "bandpass";
          flt.frequency.setValueAtTime(620, t0);
          flt.Q.value = 2.4;
          hg.gain.setValueAtTime(0.0001, t0);
          hg.gain.linearRampToValueAtTime(0.14, t0 + 0.22);
          hg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.96);
          lfo.connect(lfoGain);
          lfoGain.connect(howl.frequency);
          howl.connect(flt);
          flt.connect(hg);
          hg.connect(master);
          lfo.start(t0);
          howl.start(t0);
          lfo.stop(t0 + 0.98);
          howl.stop(t0 + 0.98);
        } catch (e) {}
      }
    }

    function triggerPermutationFlourish(actIds) {
      if (muted || !actx || !master) { return; }
      var picks = actIds && actIds.length ? actIds.slice(0, 3) : ["gold_counting", "consulting_oracles", "odalisque_bathing"];
      for (var i = 0; i < picks.length; i++) {
        triggerActVoice(picks[i], i * 0.065);
      }
    }

    return {
      unlockAudio: unlockAudio,
      setMuted: setMuted,
      isMuted: isMuted,
      triggerActVoice: triggerActVoice,
      triggerChalkScratch: triggerChalkScratch,
      triggerDissolveChord: triggerDissolveChord,
      triggerPerimeterTumbleSound: triggerPerimeterTumbleSound,
      triggerPermutationFlourish: triggerPermutationFlourish
    };
  }

  function cloneAssignments(src) {
    var out = {};
    for (var i = 0; i < SHELL_IDS.length; i++) {
      var sid = SHELL_IDS[i];
      out[sid] = (src[sid] || []).slice();
    }
    return out;
  }

  function locateAct(assignments, actId) {
    for (var i = 0; i < SHELL_IDS.length; i++) {
      var sid = SHELL_IDS[i];
      var arr = assignments[sid] || [];
      for (var s = 0; s < arr.length; s++) {
        if (arr[s] === actId) {
          return { shellId: sid, slot: s };
        }
      }
    }
    return { shellId: "rubbish_heap", slot: 0 };
  }

  function statsForAssignments(assignments) {
    var seen = {};
    var uniqueCount = 0;
    var unexpectedCount = 0;
    for (var i = 0; i < SHELL_IDS.length; i++) {
      var sid = SHELL_IDS[i];
      var arr = assignments[sid] || [];
      for (var s = 0; s < arr.length; s++) {
        var aid = arr[s];
        if (ACT_BY_ID[aid] && !seen[aid]) {
          seen[aid] = true;
          uniqueCount++;
          if (ACT_BY_ID[aid].naiveShellId !== sid) {
            unexpectedCount++;
          }
        }
      }
    }
    return {
      allNineActive: uniqueCount === 9,
      incongruityIndex: uniqueCount > 0 ? Number((unexpectedCount / 9).toFixed(4)) : 0
    };
  }

  function createPermutationActs(config) {
    var cfg = config || {};
    var audio = createAudioEngine(Boolean(cfg.muted));
    var assignments = cloneAssignments(INITIAL_ASSIGNMENTS);
    var permutationCount = 0;
    var fallbackCursor = 0;
    var timeSec = 0;
    var autoCycleTimer = 0;
    var chalkSpawnCooldown = 0;
    var lastCanvasW = 1280;
    var lastCanvasH = 800;
    var shellAnchors = {};
    var migrations = [];
    var actPulseBoost = {};

    for (var k = 0; k < SHELL_IDS.length; k++) {
      var initSid = SHELL_IDS[k];
      shellAnchors[initSid] = { x: SHELL_META[initSid].ax, y: SHELL_META[initSid].ay };
    }
    for (var m = 0; m < ACTS.length; m++) {
      actPulseBoost[ACTS[m].id] = 0;
    }

    function syncShellAnchors(shells, vw, vh) {
      if (!Array.isArray(shells) || shells.length === 0) { return; }
      var w = vw || lastCanvasW || 1280;
      var h = vh || lastCanvasH || 800;
      for (var i = 0; i < shells.length; i++) {
        var sh = shells[i];
        if (!sh || !sh.id || !shellAnchors[sh.id]) { continue; }
        var ir = sh.interiorRect;
        var px = typeof sh.cx === "number" ? sh.cx : (ir ? ir.x + ir.w * 0.5 : (sh.x || 0) + (sh.w || 0) * 0.5);
        var py = typeof sh.cy === "number" ? sh.cy : (ir ? ir.y + ir.h * 0.5 : (sh.y || 0) + (sh.h || 0) * 0.5);
        if (w > 1 && h > 1 && (px > 1.5 || py > 1.5)) {
          shellAnchors[sh.id] = { x: clamp(px / w, 0.04, 0.96), y: clamp(py / h, 0.05, 0.95) };
        } else if (px >= 0 && py >= 0) {
          shellAnchors[sh.id] = { x: clamp(px, 0.04, 0.96), y: clamp(py, 0.05, 0.95) };
        }
      }
    }

    function spawnMigrationArc(actId, fromShellId, toShellId, opts) {
      var o = opts || {};
      var act = ACT_BY_ID[actId] || ACTS[0];
      var a = o.fromNorm || shellAnchors[fromShellId] || { x: 0.25, y: 0.3 };
      var b = o.toNorm || shellAnchors[toShellId] || { x: 0.75, y: 0.7 };
      var mx = o.viaNorm ? o.viaNorm.x : (a.x + b.x) * 0.5 + (a.y - b.y) * 0.22;
      var my = o.viaNorm ? o.viaNorm.y : (a.y + b.y) * 0.5 - Math.abs(b.x - a.x) * 0.24 - 0.04;
      migrations.push({
        actId: act.id,
        symbol: act.symbol,
        hue: act.hue,
        ax: clamp(a.x, 0.02, 0.98),
        ay: clamp(a.y, 0.02, 0.98),
        cx: clamp(mx, 0.02, 0.98),
        cy: clamp(my, 0.02, 0.98),
        bx: clamp(b.x, 0.02, 0.98),
        by: clamp(b.y, 0.02, 0.98),
        age: 0,
        ttl: o.ttl || 1.65,
        isChalkSurge: Boolean(o.isChalkSurge),
        ambient: Boolean(o.ambient)
      });
      if (migrations.length > 42) {
        migrations.splice(0, migrations.length - 42);
      }
    }

    function seedAmbientFilaments() {
      migrations.length = 0;
      spawnMigrationArc("leprosarium_tending", "rubbish_heap", "pyramid_roof", { ttl: 2.8, ambient: true });
      spawnMigrationArc("tool_forging", "covered_market", "pagoda", { ttl: 3.1, ambient: true });
      spawnMigrationArc("gold_counting", "pyramid_roof", "canal", { ttl: 3.4, ambient: true });
    }
    seedAmbientFilaments();

    function buildActRecord(act) {
      var loc = locateAct(assignments, act.id);
      var boost = actPulseBoost[act.id] || 0;
      var wave = 0.62 + 0.24 * Math.sin(timeSec * 2.1 + act.index * 1.37);
      var level = Number(clamp(wave + boost * 0.35, 0.35, 1.0).toFixed(3));
      return {
        id: act.id,
        index: act.index,
        label: act.label,
        shortLabel: act.shortLabel,
        symbol: act.symbol,
        hue: act.hue,
        summary: act.summary,
        naiveShellId: act.naiveShellId,
        currentShellId: loc.shellId,
        slot: loc.slot,
        isUnexpected: loc.shellId !== act.naiveShellId,
        activityLevel: level
      };
    }

    function getActs() {
      var list = [];
      for (var i = 0; i < ACTS.length; i++) {
        list.push(buildActRecord(ACTS[i]));
      }
      return list;
    }

    function getShellOccupants(shellId) {
      var sid = SHELL_META[shellId] ? shellId : SHELL_IDS[0];
      var ids = assignments[sid] || [];
      var actObjs = [];
      for (var i = 0; i < ids.length; i++) {
        if (ACT_BY_ID[ids[i]]) {
          actObjs.push(buildActRecord(ACT_BY_ID[ids[i]]));
        }
      }
      var p = actObjs[0] || null;
      var s = actObjs[1] || null;
      var meta = SHELL_META[sid];
      var names = p ? (s ? p.label + " + " + s.label : p.label) : "Indivisible Flux";
      var caption = meta.label + " (expected " + meta.expected + ") hosts " + names;
      return {
        shellId: sid,
        primaryAct: p,
        secondaryAct: s,
        acts: actObjs,
        incongruityCaption: caption
      };
    }

    function findValidDerangement() {
      var prevSolo = "rubbish_heap";
      for (var i = 0; i < SHELL_IDS.length; i++) {
        if ((assignments[SHELL_IDS[i]] || []).length === 1) {
          prevSolo = SHELL_IDS[i];
          break;
        }
      }
      var candidateSolos = SHELL_IDS.filter(function (s) { return s !== prevSolo; });
      for (var attempt = 0; attempt < 80; attempt++) {
        var solo = candidateSolos[attempt % candidateSolos.length];
        var slots = [];
        for (var si = 0; si < SHELL_IDS.length; si++) {
          var shId = SHELL_IDS[si];
          slots.push(shId);
          if (shId !== solo) { slots.push(shId); }
        }
        var pool = ACTS.map(function (a) { return a.id; });
        for (var p = pool.length - 1; p > 0; p--) {
          var r = Math.floor(Math.random() * (p + 1));
          var tmp = pool[p];
          pool[p] = pool[r];
          pool[r] = tmp;
        }
        var ok = true;
        var moved = 0;
        var next = { pyramid_roof: [], pagoda: [], covered_market: [], canal: [], rubbish_heap: [] };
        for (var idx = 0; idx < 9; idx++) {
          var aid = pool[idx];
          var targetShell = slots[idx];
          if (ACT_BY_ID[aid].naiveShellId === targetShell) {
            ok = false;
            break;
          }
          if (locateAct(assignments, aid).shellId !== targetShell) {
            moved++;
          }
          next[targetShell].push(aid);
        }
        if (ok && moved >= 7) {
          return next;
        }
      }
      var fb = cloneAssignments(FALLBACK_DERANGEMENTS[fallbackCursor % FALLBACK_DERANGEMENTS.length]);
      fallbackCursor++;
      return fb;
    }

    function applyNewAssignments(next, playFlourish, reason) {
      var movedActs = [];
      for (var i = 0; i < ACTS.length; i++) {
        var aid = ACTS[i].id;
        var before = locateAct(assignments, aid).shellId;
        var after = locateAct(next, aid).shellId;
        if (before !== after) {
          movedActs.push(aid);
          actPulseBoost[aid] = 1.0;
          spawnMigrationArc(aid, before, after, { ttl: 1.75 });
        }
      }
      assignments = next;
      permutationCount++;
      autoCycleTimer = 0;
      if (playFlourish) {
        audio.triggerPermutationFlourish(movedActs);
      }
      if (typeof cfg.onPermute === "function") {
        try { cfg.onPermute(getState(), reason || "permute"); } catch (e) {}
      }
    }

    function permuteNow(reason) {
      var next = findValidDerangement();
      applyNewAssignments(next, true, reason || "manual");
      return getState();
    }

    function assignActToShell(actId, shellId) {
      if (!ACT_BY_ID[actId] || !SHELL_META[shellId]) {
        return getShellOccupants(shellId || SHELL_IDS[0]);
      }
      var cur = locateAct(assignments, actId);
      actPulseBoost[actId] = 1.0;
      if (cur.shellId === shellId) {
        var sameArr = assignments[shellId];
        if (sameArr.length === 2 && sameArr[1] === actId) {
          assignments[shellId] = [sameArr[1], sameArr[0]];
        }
        audio.triggerActVoice(actId);
        return getShellOccupants(shellId);
      }
      var next = cloneAssignments(assignments);
      var srcArr = next[cur.shellId];
      var dstArr = next[shellId];
      srcArr.splice(cur.slot, 1);

      if (dstArr.length === 1 && srcArr.length === 1) {
        /* Target had 1 act, source had 2: target becomes 2, source stays 1 — zero displaced acts! */
        dstArr.unshift(actId);
      } else {
        /* Swap one act out of target shell, avoiding naiveShellId when possible */
        var pickIdx = dstArr.length - 1;
        for (var di = dstArr.length - 1; di >= 0; di--) {
          if (ACT_BY_ID[dstArr[di]].naiveShellId !== cur.shellId) {
            pickIdx = di;
            break;
          }
        }
        var displaced = dstArr.splice(pickIdx, 1)[0];
        dstArr.unshift(actId);
        if (ACT_BY_ID[displaced].naiveShellId === cur.shellId) {
          /* 3-way unexpected rotation through an eligible middle shell */
          var routed = false;
          for (var mi = 0; mi < SHELL_IDS.length && !routed; mi++) {
            var mid = SHELL_IDS[mi];
            if (mid === shellId || mid === cur.shellId) { continue; }
            var mArr = next[mid];
            for (var mj = 0; mj < mArr.length; mj++) {
              var cand = mArr[mj];
              if (ACT_BY_ID[displaced].naiveShellId !== mid && ACT_BY_ID[cand].naiveShellId !== cur.shellId) {
                mArr[mj] = displaced;
                srcArr.push(cand);
                routed = true;
                break;
              }
            }
          }
          if (!routed) { srcArr.push(displaced); }
        } else {
          srcArr.push(displaced);
        }
      }
      /* Heal any previously pinned naive act elsewhere so Zoe never settles < 0.8889 incongruity */
      for (var hs = 0; hs < SHELL_IDS.length; hs++) {
        var hSid = SHELL_IDS[hs];
        var hArr = next[hSid];
        for (var hi = 0; hi < hArr.length; hi++) {
          var hAct = hArr[hi];
          if (hAct === actId || ACT_BY_ID[hAct].naiveShellId !== hSid) { continue; }
          var healed = false;
          for (var ts = 0; ts < SHELL_IDS.length && !healed; ts++) {
            var tSid = SHELL_IDS[ts];
            if (tSid === hSid) { continue; }
            var tArr = next[tSid];
            for (var ti = 0; ti < tArr.length; ti++) {
              var tAct = tArr[ti];
              if (tAct === actId) { continue; }
              if (ACT_BY_ID[hAct].naiveShellId !== tSid && ACT_BY_ID[tAct].naiveShellId !== hSid) {
                hArr[hi] = tAct;
                tArr[ti] = hAct;
                healed = true;
                break;
              }
            }
          }
        }
      }
      applyNewAssignments(next, false, "assign");
      audio.triggerActVoice(actId);
      return getShellOccupants(shellId);
    }

    function normPt(pt) {
      if (!pt) { return null; }
      var rawX = typeof pt.xNorm === "number" ? pt.xNorm : (typeof pt.nx === "number" ? pt.nx : pt.x);
      var rawY = typeof pt.yNorm === "number" ? pt.yNorm : (typeof pt.ny === "number" ? pt.ny : pt.y);
      if (typeof rawX !== "number" || typeof rawY !== "number") { return null; }
      if (rawX > 1.5 || rawY > 1.5) {
        return { x: clamp(rawX / (lastCanvasW || 1280), 0, 1), y: clamp(rawY / (lastCanvasH || 800), 0, 1) };
      }
      return { x: clamp(rawX, 0, 1), y: clamp(rawY, 0, 1) };
    }

    function extractChalkSegments(chalkStrokes) {
      var list = Array.isArray(chalkStrokes) ? chalkStrokes : (chalkStrokes ? [chalkStrokes] : []);
      var segs = [];
      for (var i = 0; i < list.length; i++) {
        var st = list[i];
        if (!st || (typeof st.integrity === "number" && st.integrity <= 0.001)) { continue; }
        var pts = st.points || st.pointsNorm || (Array.isArray(st) ? st : []);
        for (var j = 0; j < pts.length - 1; j++) {
          var a = normPt(pts[j]);
          var b = normPt(pts[j + 1]);
          if (a && b && (Math.abs(b.x - a.x) + Math.abs(b.y - a.y) > 0.003)) {
            segs.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y });
          }
        }
      }
      return segs;
    }

    function surgeAcrossChalk(chalkStrokes, shells) {
      syncShellAnchors(shells);
      var segs = extractChalkSegments(chalkStrokes);
      if (segs.length === 0) { return 0; }
      var spawned = 0;
      var stride = Math.max(1, Math.floor(segs.length / 4));
      for (var i = 0; i < segs.length && spawned < 6; i += stride) {
        var sg = segs[i];
        var mx = (sg.ax + sg.bx) * 0.5;
        var my = (sg.ay + sg.by) * 0.5;
        var dx = sg.bx - sg.ax;
        var dy = sg.by - sg.ay;
        var len = Math.hypot(dx, dy) || 1;
        var nx = -dy / len;
        var ny = dx / len;
        var sidePos = null;
        var sideNeg = null;
        for (var s = 0; s < SHELL_IDS.length; s++) {
          var sid = SHELL_IDS[s];
          var anc = shellAnchors[sid];
          var side = (anc.x - mx) * nx + (anc.y - my) * ny;
          if (side >= 0 && !sidePos) { sidePos = sid; }
          if (side < 0 && !sideNeg) { sideNeg = sid; }
        }
        var fromSid = sidePos || SHELL_IDS[spawned % SHELL_IDS.length];
        var toSid = sideNeg || SHELL_IDS[(spawned + 2) % SHELL_IDS.length];
        var actPick = (assignments[fromSid] && assignments[fromSid][0]) || ACTS[(spawned * 2) % ACTS.length].id;
        var span = 0.16;
        spawnMigrationArc(actPick, fromSid, toSid, {
          fromNorm: { x: clamp(mx + nx * span, 0.05, 0.95), y: clamp(my + ny * span, 0.06, 0.94) },
          viaNorm: { x: mx, y: my },
          toNorm: { x: clamp(mx - nx * span, 0.05, 0.95), y: clamp(my - ny * span, 0.06, 0.94) },
          ttl: 1.35,
          isChalkSurge: true
        });
        actPulseBoost[actPick] = 0.95;
        spawned++;
      }
      return spawned;
    }

    function autoCrossBleed() {
      /* Gentle autonomous unexpected swap between two shells */
      for (var tries = 0; tries < 25; tries++) {
        var sA = SHELL_IDS[Math.floor(Math.random() * SHELL_IDS.length)];
        var sB = SHELL_IDS[Math.floor(Math.random() * SHELL_IDS.length)];
        if (sA === sB) { continue; }
        var aList = assignments[sA];
        var bList = assignments[sB];
        var ia = Math.floor(Math.random() * aList.length);
        var ib = Math.floor(Math.random() * bList.length);
        var actA = aList[ia];
        var actB = bList[ib];
        if (ACT_BY_ID[actA].naiveShellId !== sB && ACT_BY_ID[actB].naiveShellId !== sA) {
          var next = cloneAssignments(assignments);
          next[sA][ia] = actB;
          next[sB][ib] = actA;
          applyNewAssignments(next, false, "auto_bleed");
          return;
        }
      }
      applyNewAssignments(findValidDerangement(), false, "auto_derange");
    }

    function step(dt, shells, chalkStrokes, reducedMotion) {
      var stepDt = clamp(typeof dt === "number" && isFinite(dt) ? dt : 0.016, 0, 0.2);
      var rm = Boolean(reducedMotion);
      timeSec += rm ? stepDt * 0.25 : stepDt;
      syncShellAnchors(shells);

      for (var pi = 0; pi < ACTS.length; pi++) {
        var pid = ACTS[pi].id;
        actPulseBoost[pid] = Math.max(0, (actPulseBoost[pid] || 0) - stepDt * 0.85);
      }

      for (var mi = migrations.length - 1; mi >= 0; mi--) {
        migrations[mi].age += stepDt;
        if (migrations[mi].age >= migrations[mi].ttl) {
          migrations.splice(mi, 1);
        }
      }

      if (!rm && migrations.length < 3) {
        var aIdx = Math.floor((timeSec * 1.7) % SHELL_IDS.length);
        var bIdx = (aIdx + 2) % SHELL_IDS.length;
        var sFrom = SHELL_IDS[aIdx];
        var sTo = SHELL_IDS[bIdx];
        var ambAct = (assignments[sFrom] && assignments[sFrom][0]) || ACTS[0].id;
        spawnMigrationArc(ambAct, sFrom, sTo, { ttl: 2.9, ambient: true });
      }

      if (!rm) {
        autoCycleTimer += stepDt;
        if (autoCycleTimer >= 7.0) {
          autoCycleTimer = 0;
          autoCrossBleed();
        }
      }

      var segs = extractChalkSegments(chalkStrokes);
      var activeCrossings = [];
      if (segs.length > 0) {
        chalkSpawnCooldown -= stepDt;
        if (chalkSpawnCooldown <= 0) {
          surgeAcrossChalk(chalkStrokes, shells);
          chalkSpawnCooldown = rm ? 0.65 : 0.28;
        }
        /* Intersect migration filaments + sample cross-bleed pressure along chalk */
        for (var m = 0; m < migrations.length && activeCrossings.length < 18; m++) {
          var mg = migrations[m];
          for (var g = 0; g < segs.length && activeCrossings.length < 18; g++) {
            var sg = segs[g];
            var hit = segmentIntersection(mg.ax, mg.ay, mg.bx, mg.by, sg.ax, sg.ay, sg.bx, sg.by) ||
                      segmentIntersection(mg.ax, mg.ay, mg.cx, mg.cy, sg.ax, sg.ay, sg.bx, sg.by);
            if (hit) {
              activeCrossings.push({
                xNorm: Number(clamp(hit.x, 0, 1).toFixed(4)),
                yNorm: Number(clamp(hit.y, 0, 1).toFixed(4)),
                actId: mg.actId,
                hue: mg.hue
              });
            }
          }
        }
        if (activeCrossings.length < 3) {
          for (var c = 0; c < Math.min(4, segs.length); c++) {
            var cs = segs[c];
            var pickAct = ACTS[(c + permutationCount) % ACTS.length];
            activeCrossings.push({
              xNorm: Number(((cs.ax + cs.bx) * 0.5).toFixed(4)),
              yNorm: Number(((cs.ay + cs.by) * 0.5).toFixed(4)),
              actId: pickAct.id,
              hue: pickAct.hue
            });
          }
        }
      } else {
        chalkSpawnCooldown = 0;
      }

      var st = statsForAssignments(assignments);
      var burstCount = 0;
      for (var bi = 0; bi < migrations.length; bi++) {
        if (!migrations[bi].ambient) { burstCount++; }
      }
      var flux = clamp(0.24 + burstCount * 0.085 + activeCrossings.length * 0.065, 0.20, 1.0);
      return {
        fluxIntensity: Number(flux.toFixed(3)),
        activeCrossings: activeCrossings,
        incongruityIndex: st.incongruityIndex,
        allNineActive: st.allNineActive,
        permutationCount: permutationCount
      };
    }

    function drawActVignette(ctx, actId, bx, by, bw, bh, t) {
      var badgeReserve = Math.min(18, Math.max(12, bh * 0.22));
      var sx = bx + 2;
      var sy = by + badgeReserve;
      var sw = Math.max(12, bw - 4);
      var sh = Math.max(12, bh - badgeReserve - 2);
      var cx = sx + sw * 0.5;
      var cy = sy + sh * 0.54;
      var u = Math.min(sw, sh);
      var lw = Math.max(1.0, u * 0.032);

      if (actId === "sleeping") {
        var breath = 0.5 + 0.5 * Math.sin(t * 1.7);
        /* Breathing moon-lantern */
        var lx = cx + sw * 0.24;
        var ly = sy + sh * 0.24;
        ctx.fillStyle = hexToRgba("#9aaef0", 0.16 + breath * 0.14);
        ctx.beginPath();
        ctx.arc(lx, ly, u * (0.20 + breath * 0.05), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#dce4ff";
        ctx.beginPath();
        ctx.arc(lx, ly, u * 0.09, 0.35, Math.PI * 1.75);
        ctx.arc(lx + u * 0.035, ly - u * 0.02, u * 0.075, Math.PI * 1.7, 0.4, true);
        ctx.fill();
        /* Woven bolster mat & sleeper */
        var my = sy + sh * 0.80;
        ctx.fillStyle = "#48527a";
        ctx.fillRect(cx - sw * 0.38, my, sw * 0.76, Math.max(3, u * 0.08));
        ctx.fillStyle = "#8a99cf";
        ctx.beginPath();
        ctx.ellipse(cx - sw * 0.25, my - u * 0.05, u * 0.10, u * 0.06, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#6776ad";
        ctx.beginPath();
        ctx.moveTo(cx - sw * 0.16, my);
        ctx.quadraticCurveTo(cx + sw * 0.04, my - u * (0.20 + breath * 0.06), cx + sw * 0.30, my);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = hexToRgba("#cad4ff", 0.45);
        ctx.lineWidth = lw * 0.8;
        ctx.beginPath();
        ctx.arc(cx - sw * 0.14, my - u * (0.22 + breath * 0.08), u * (0.06 + breath * 0.05), 0, Math.PI * 2);
        ctx.stroke();
      } else if (actId === "tool_forging") {
        var strike = Math.abs(Math.sin(t * 3.8));
        var baseY = sy + sh * 0.82;
        /* Bellows on left */
        ctx.fillStyle = "#6e4730";
        ctx.beginPath();
        ctx.moveTo(cx - sw * 0.40, baseY - u * (0.24 - strike * 0.07));
        ctx.lineTo(cx - sw * 0.16, baseY - u * 0.12);
        ctx.lineTo(cx - sw * 0.40, baseY - u * 0.04);
        ctx.closePath();
        ctx.fill();
        /* Oak block & horned iron anvil */
        ctx.fillStyle = "#4d3527";
        ctx.fillRect(cx - u * 0.13, baseY - u * 0.14, u * 0.28, u * 0.14);
        ctx.fillStyle = "#3a3f4a";
        ctx.beginPath();
        ctx.moveTo(cx - u * 0.27, baseY - u * 0.26);
        ctx.lineTo(cx + u * 0.24, baseY - u * 0.28);
        ctx.lineTo(cx + u * 0.16, baseY - u * 0.14);
        ctx.lineTo(cx - u * 0.13, baseY - u * 0.14);
        ctx.closePath();
        ctx.fill();
        /* White-hot iron & swinging hammer */
        ctx.strokeStyle = "#ffd685";
        ctx.lineWidth = Math.max(2, u * 0.055);
        ctx.beginPath();
        ctx.moveTo(cx - u * 0.12, baseY - u * 0.29);
        ctx.lineTo(cx + u * 0.11, baseY - u * 0.29);
        ctx.stroke();
        ctx.save();
        ctx.translate(cx + u * 0.22, baseY - u * 0.44);
        ctx.rotate(-0.65 + (1 - strike) * 0.72);
        ctx.strokeStyle = "#b58b61";
        ctx.lineWidth = lw * 1.2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-u * 0.24, -u * 0.04);
        ctx.stroke();
        ctx.fillStyle = "#6b7280";
        ctx.fillRect(-u * 0.29, -u * 0.11, u * 0.10, u * 0.15);
        ctx.restore();
        /* Flying forge sparks */
        for (var sp = 0; sp < 5; sp++) {
          var prog = ((t * 2.4 + sp * 0.21) % 1);
          var sxp = cx + Math.cos(0.6 + sp * 0.52) * u * 0.34 * prog;
          var syp = (baseY - u * 0.30) - Math.sin(0.7 + sp * 0.35) * u * 0.38 * prog;
          ctx.fillStyle = sp % 2 === 0 ? "#ffe394" : "#ff7b38";
          ctx.fillRect(sxp, syp, Math.max(1.5, u * 0.035), Math.max(1.5, u * 0.035));
        }
      } else if (actId === "cooking") {
        var cyBase = sy + sh * 0.84;
        /* Hearth embers */
        ctx.fillStyle = hexToRgba("#ff6629", 0.78 + 0.2 * Math.sin(t * 5.2));
        ctx.beginPath();
        ctx.ellipse(cx, cyBase - u * 0.04, u * 0.24, u * 0.06, 0, 0, Math.PI * 2);
        ctx.fill();
        /* Copper cauldron & saffron broth */
        ctx.fillStyle = "#a8582b";
        ctx.beginPath();
        ctx.arc(cx, cyBase - u * 0.25, u * 0.22, -0.15, Math.PI + 0.15, false);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#f2b844";
        ctx.beginPath();
        ctx.ellipse(cx, cyBase - u * 0.28, u * 0.20, u * 0.055, 0, 0, Math.PI * 2);
        ctx.fill();
        /* Rising steam curls */
        ctx.strokeStyle = hexToRgba("#f7ead2", 0.62);
        ctx.lineWidth = lw;
        for (var st = -1; st <= 1; st++) {
          var ox = cx + st * u * 0.11;
          var drift = Math.sin(t * 2.6 + st * 1.4) * u * 0.045;
          ctx.beginPath();
          ctx.moveTo(ox, cyBase - u * 0.36);
          ctx.quadraticCurveTo(ox + drift, cyBase - u * 0.50, ox - drift, cyBase - u * 0.64);
          ctx.stroke();
        }
      } else if (actId === "gold_counting") {
        var gBase = sy + sh * 0.84;
        ctx.fillStyle = "#2d3b34";
        ctx.fillRect(cx - sw * 0.40, gBase - u * 0.05, sw * 0.80, Math.max(3, u * 0.06));
        /* Stacked gold bezants */
        ctx.fillStyle = "#f0cf56";
        for (var col = 0; col < 3; col++) {
          var cnt = 3 + (col === 1 ? 2 : col);
          for (var c = 0; c < cnt; c++) {
            ctx.fillRect(cx - sw * 0.35 + col * u * 0.11, gBase - u * 0.09 - c * u * 0.048, u * 0.085, u * 0.034);
          }
        }
        /* Tilting brass assay balance */
        var bxMid = cx + sw * 0.10;
        var tilt = Math.sin(t * 2.1) * 0.17;
        ctx.strokeStyle = "#ebd05b";
        ctx.lineWidth = lw * 1.15;
        ctx.beginPath();
        ctx.moveTo(bxMid, gBase - u * 0.05);
        ctx.lineTo(bxMid, gBase - u * 0.54);
        ctx.stroke();
        var arm = u * 0.22;
        var lx2 = bxMid - Math.cos(tilt) * arm;
        var ly2 = (gBase - u * 0.50) - Math.sin(tilt) * arm;
        var rx2 = bxMid + Math.cos(tilt) * arm;
        var ry2 = (gBase - u * 0.50) + Math.sin(tilt) * arm;
        ctx.beginPath();
        ctx.moveTo(lx2, ly2);
        ctx.lineTo(rx2, ry2);
        ctx.stroke();
        ctx.fillStyle = "#d9b441";
        ctx.beginPath();
        ctx.arc(lx2, ly2 + u * 0.16, u * 0.075, 0, Math.PI, false);
        ctx.arc(rx2, ry2 + u * 0.16, u * 0.075, 0, Math.PI, false);
        ctx.fill();
      } else if (actId === "reigning") {
        var rBase = sy + sh * 0.84;
        /* Purple dais & canopy */
        ctx.fillStyle = "#6e2948";
        ctx.fillRect(cx - sw * 0.38, rBase - u * 0.12, sw * 0.44, u * 0.12);
        ctx.fillStyle = hexToRgba("#9c3d63", 0.55);
        ctx.beginPath();
        ctx.moveTo(cx - sw * 0.38, sy + sh * 0.10);
        ctx.lineTo(cx + sw * 0.04, sy + sh * 0.16);
        ctx.lineTo(cx - sw * 0.02, rBase - u * 0.12);
        ctx.lineTo(cx - sw * 0.38, rBase - u * 0.12);
        ctx.closePath();
        ctx.fill();
        /* Monarch with crown & scepter + kneeling envoy */
        var mx2 = cx - sw * 0.18;
        ctx.fillStyle = "#d46a89";
        ctx.fillRect(mx2 - u * 0.07, rBase - u * 0.42, u * 0.14, u * 0.30);
        ctx.beginPath();
        ctx.arc(mx2, rBase - u * 0.50, u * 0.065, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#f2cf5c";
        ctx.beginPath();
        ctx.moveTo(mx2 - u * 0.07, rBase - u * 0.55);
        ctx.lineTo(mx2 - u * 0.04, rBase - u * 0.65);
        ctx.lineTo(mx2, rBase - u * 0.58);
        ctx.lineTo(mx2 + u * 0.04, rBase - u * 0.65);
        ctx.lineTo(mx2 + u * 0.07, rBase - u * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#f2cf5c";
        ctx.lineWidth = lw * 1.1;
        ctx.beginPath();
        ctx.moveTo(mx2 + u * 0.05, rBase - u * 0.32);
        ctx.lineTo(cx + sw * 0.10, rBase - u * (0.50 + Math.sin(t * 2.0) * 0.04));
        ctx.stroke();
        ctx.fillStyle = "#a38d98";
        ctx.beginPath();
        ctx.ellipse(cx + sw * 0.22, rBase - u * 0.12, u * 0.10, u * 0.12, -0.35, 0, Math.PI * 2);
        ctx.fill();
      } else if (actId === "trading") {
        var tBase = sy + sh * 0.84;
        /* Unrolled silk bales */
        var silks = ["#c94f6d", "#45b09c", "#e0a943"];
        for (var sb = 0; sb < 3; sb++) {
          ctx.fillStyle = silks[sb];
          ctx.beginPath();
          ctx.ellipse(cx - sw * 0.28 + sb * u * 0.09, tBase - u * (0.14 + sb * 0.09), u * 0.11, u * 0.055, -0.25, 0, Math.PI * 2);
          ctx.fill();
        }
        /* Conical spice bowls */
        var spices = ["#d96538", "#e8bd43", "#9c3e54"];
        for (var spb = 0; spb < 3; spb++) {
          var bxp = cx - u * 0.05 + spb * u * 0.11;
          ctx.fillStyle = spices[spb];
          ctx.beginPath();
          ctx.moveTo(bxp - u * 0.05, tBase - u * 0.04);
          ctx.lineTo(bxp, tBase - u * 0.16);
          ctx.lineTo(bxp + u * 0.05, tBase - u * 0.04);
          ctx.closePath();
          ctx.fill();
        }
        /* Wooden abacus frame & sliding beads */
        var ax = cx + sw * 0.16;
        var ay = tBase - u * 0.46;
        var aw = u * 0.24;
        var ah = u * 0.36;
        ctx.strokeStyle = "#a67c52";
        ctx.lineWidth = lw * 1.1;
        ctx.strokeRect(ax, ay, aw, ah);
        for (var r = 1; r <= 3; r++) {
          var ry = ay + (ah * r) / 4;
          ctx.beginPath();
          ctx.moveTo(ax, ry);
          ctx.lineTo(ax + aw, ry);
          ctx.stroke();
          var shift = (0.5 + 0.35 * Math.sin(t * 2.5 + r * 1.7)) * (aw - u * 0.08);
          ctx.fillStyle = "#f0cf65";
          ctx.beginPath();
          ctx.arc(ax + u * 0.04 + shift, ry, u * 0.032, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        drawRemainingVignette(ctx, actId, cx, cy, sx, sy, sw, sh, u, lw, t);
      }
    }

    function drawRemainingVignette(ctx, actId, cx, cy, sx, sy, sw, sh, u, lw, t) {
      var base = sy + sh * 0.85;
      if (actId === "consulting_oracles") {
        /* Glowing volcanic cleft, bronze Delphic tripod, laurel vapor & cast bone lots */
        ctx.fillStyle = hexToRgba("#b68cf2", 0.42 + 0.2 * Math.sin(t * 3.1));
        ctx.beginPath();
        ctx.moveTo(cx - u * 0.22, base);
        ctx.lineTo(cx - u * 0.04, base - u * 0.11);
        ctx.lineTo(cx + u * 0.18, base);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#b89658";
        ctx.lineWidth = lw * 1.15;
        ctx.beginPath();
        ctx.moveTo(cx - u * 0.20, base);
        ctx.lineTo(cx - u * 0.08, base - u * 0.44);
        ctx.moveTo(cx + u * 0.20, base);
        ctx.lineTo(cx + u * 0.08, base - u * 0.44);
        ctx.moveTo(cx, base);
        ctx.lineTo(cx, base - u * 0.44);
        ctx.stroke();
        ctx.fillStyle = "#c9a461";
        ctx.beginPath();
        ctx.ellipse(cx, base - u * 0.46, u * 0.16, u * 0.055, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = hexToRgba("#dfd0ff", 0.65);
        ctx.beginPath();
        var vap = Math.sin(t * 2.2) * u * 0.07;
        ctx.moveTo(cx, base - u * 0.12);
        ctx.quadraticCurveTo(cx + vap, base - u * 0.38, cx - vap, base - u * 0.68);
        ctx.stroke();
        ctx.strokeStyle = "#ede6d5";
        for (var bl = 0; bl < 3; bl++) {
          var bx2 = cx + sw * 0.18 + bl * u * 0.05;
          ctx.beginPath();
          ctx.moveTo(bx2, base - u * 0.05);
          ctx.lineTo(bx2 + u * 0.07, base - u * (0.10 - bl * 0.02));
          ctx.stroke();
        }
      } else if (actId === "leprosarium_tending") {
        /* Quarantine cot, linen-bandaged figure, salve bowl & swinging clapper bell */
        ctx.strokeStyle = "#8c7558";
        ctx.lineWidth = lw * 1.15;
        ctx.beginPath();
        ctx.moveTo(cx - sw * 0.38, base - u * 0.16);
        ctx.lineTo(cx + sw * 0.16, base - u * 0.16);
        ctx.moveTo(cx - sw * 0.34, base - u * 0.16);
        ctx.lineTo(cx - sw * 0.34, base);
        ctx.moveTo(cx + sw * 0.12, base - u * 0.16);
        ctx.lineTo(cx + sw * 0.12, base);
        ctx.stroke();
        ctx.fillStyle = "#dce3d5";
        ctx.beginPath();
        ctx.arc(cx - sw * 0.25, base - u * 0.25, u * 0.065, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx - sw * 0.18, base - u * 0.26, sw * 0.28, u * 0.09);
        ctx.strokeStyle = "#8fa685";
        ctx.lineWidth = Math.max(1, lw * 0.75);
        ctx.beginPath();
        ctx.moveTo(cx - sw * 0.14, base - u * 0.26);
        ctx.lineTo(cx - sw * 0.10, base - u * 0.17);
        ctx.moveTo(cx - sw * 0.05, base - u * 0.26);
        ctx.lineTo(cx - sw * 0.01, base - u * 0.17);
        ctx.stroke();
        /* Salve bowl + bronze quarantine bell */
        ctx.fillStyle = "#b8c9ad";
        ctx.beginPath();
        ctx.arc(cx + sw * 0.28, base - u * 0.10, u * 0.075, 0, Math.PI, false);
        ctx.fill();
        var swing = Math.sin(t * 2.8) * 0.22;
        ctx.save();
        ctx.translate(cx + sw * 0.26, sy + sh * 0.14);
        ctx.rotate(swing);
        ctx.fillStyle = "#d4b259";
        ctx.beginPath();
        ctx.moveTo(-u * 0.08, u * 0.18);
        ctx.lineTo(0, 0);
        ctx.lineTo(u * 0.08, u * 0.18);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else {
        /* odalisque_bathing: fluted marble steam-basin, rosewater ewer & silk veils */
        ctx.fillStyle = hexToRgba("#e38fb3", 0.24);
        ctx.beginPath();
        ctx.moveTo(sx + sw * 0.06, sy + sh * 0.06);
        ctx.quadraticCurveTo(sx + sw * 0.20, cy, sx + sw * 0.08, base);
        ctx.lineTo(sx, base);
        ctx.lineTo(sx, sy + sh * 0.06);
        ctx.closePath();
        ctx.fill();
        /* Marble basin & rippling rose-turquoise water */
        ctx.fillStyle = "#e8dde2";
        ctx.fillRect(cx - sw * 0.30, base - u * 0.18, sw * 0.56, u * 0.14);
        ctx.fillStyle = "#6ec4c9";
        ctx.beginPath();
        ctx.ellipse(cx - sw * 0.02, base - u * 0.18, sw * 0.25, u * 0.055, 0, 0, Math.PI * 2);
        ctx.fill();
        /* Long-necked gilt rosewater ewer */
        var ex = cx + sw * 0.28;
        ctx.fillStyle = "#e3b368";
        ctx.beginPath();
        ctx.ellipse(ex, base - u * 0.18, u * 0.075, u * 0.11, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#e3b368";
        ctx.lineWidth = lw * 1.1;
        ctx.beginPath();
        ctx.moveTo(ex, base - u * 0.27);
        ctx.lineTo(ex - u * 0.09, base - u * 0.40);
        ctx.stroke();
        /* Hammam steam wisps */
        ctx.strokeStyle = hexToRgba("#ffe6f2", 0.58);
        for (var w = -1; w <= 1; w += 2) {
          var wx = cx - sw * 0.04 + w * u * 0.11;
          var sway = Math.sin(t * 2.0 + w) * u * 0.05;
          ctx.beginPath();
          ctx.moveTo(wx, base - u * 0.24);
          ctx.quadraticCurveTo(wx + sway, base - u * 0.44, wx - sway, base - u * 0.62);
          ctx.stroke();
        }
      }
    }

    function renderActs(ctx, viewport, shells) {
      if (!ctx) { return; }
      var vp = viewport || {};
      var vw = vp.width || vp.w || (ctx.canvas ? ctx.canvas.width : 1280);
      var vh = vp.height || vp.h || (ctx.canvas ? ctx.canvas.height : 800);
      lastCanvasW = vw;
      lastCanvasH = vh;
      syncShellAnchors(shells, vw, vh);

      /* 1. Render bespoke vignettes inside each shell's cutaway interiorRect */
      var shellList = Array.isArray(shells) && shells.length ? shells : [];
      for (var i = 0; i < shellList.length; i++) {
        var sh = shellList[i];
        if (!sh || !sh.id) { continue; }
        var ir = sh.interiorRect || { x: (sh.x || 0) + 8, y: (sh.y || 0) + 20, w: Math.max(40, (sh.w || 120) - 16), h: Math.max(32, (sh.h || 80) - 26) };
        var occ = assignments[sh.id] || [];
        if (occ.length === 0 || ir.w < 14 || ir.h < 14) { continue; }

        for (var slot = 0; slot < occ.length; slot++) {
          var act = ACT_BY_ID[occ[slot]];
          if (!act) { continue; }
          var bayW = occ.length === 2 ? (ir.w - 3) * 0.5 : ir.w;
          var bayX = occ.length === 2 ? ir.x + slot * (bayW + 3) : ir.x;
          var bayY = ir.y;
          var bayH = ir.h;

          ctx.save();
          ctx.beginPath();
          ctx.rect(bayX, bayY, bayW, bayH);
          ctx.clip();

          var grad = ctx.createRadialGradient(bayX + bayW * 0.5, bayY + bayH * 0.6, 2, bayX + bayW * 0.5, bayY + bayH * 0.55, Math.max(bayW, bayH) * 0.72);
          grad.addColorStop(0, hexToRgba(act.hue, 0.24));
          grad.addColorStop(1, "rgba(18,15,20,0.06)");
          ctx.fillStyle = grad;
          ctx.fillRect(bayX, bayY, bayW, bayH);

          drawActVignette(ctx, act.id, bayX, bayY, bayW, bayH, timeSec + slot * 0.9);

          /* Engraved glyph badge */
          var badgeH = Math.min(16, Math.max(11, bayH * 0.21));
          var showText = bayW >= 52;
          var badgeW = showText ? Math.min(bayW - 4, 62) : Math.min(bayW - 4, 20);
          ctx.fillStyle = "rgba(17,14,19,0.84)";
          ctx.fillRect(bayX + 2, bayY + 2, badgeW, badgeH);
          ctx.strokeStyle = hexToRgba(act.hue, 0.78);
          ctx.lineWidth = 1;
          ctx.strokeRect(bayX + 2, bayY + 2, badgeW, badgeH);
          ctx.fillStyle = act.hue;
          ctx.font = "600 " + Math.max(8, Math.round(badgeH * 0.68)) + "px 'SF Mono', Menlo, monospace";
          ctx.textBaseline = "middle";
          ctx.textAlign = showText ? "left" : "center";
          var labelTxt = showText ? (act.symbol + " " + act.shortLabel) : act.symbol;
          ctx.fillText(labelTxt, showText ? bayX + 5 : bayX + 2 + badgeW * 0.5, bayY + 2 + badgeH * 0.54);
          ctx.restore();
        }

        if (occ.length === 2) {
          ctx.save();
          ctx.strokeStyle = "rgba(229,185,76,0.34)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ir.x + ir.w * 0.5, ir.y + 3);
          ctx.lineTo(ir.x + ir.w * 0.5, ir.y + ir.h - 3);
          ctx.stroke();
          ctx.restore();
        }
      }

      /* 2. Render luminous indivisible life-filaments arcing between shells & piercing chalk */
      ctx.save();
      for (var m = 0; m < migrations.length; m++) {
        var mg = migrations[m];
        var p = clamp(mg.age / mg.ttl, 0, 1);
        var env = Math.sin(p * Math.PI);
        var alpha = mg.ambient ? env * 0.34 : env * (mg.isChalkSurge ? 0.92 : 0.78);
        if (alpha <= 0.02) { continue; }
        var x0 = mg.ax * vw, y0 = mg.ay * vh;
        var xc = mg.cx * vw, yc = mg.cy * vh;
        var x1 = mg.bx * vw, y1 = mg.by * vh;

        ctx.strokeStyle = hexToRgba(mg.hue, alpha);
        ctx.lineWidth = mg.isChalkSurge ? 2.4 : (mg.ambient ? 1.15 : 1.85);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(xc, yc, x1, y1);
        ctx.stroke();

        var head = quadBezier(x0, y0, xc, yc, x1, y1, p);
        ctx.fillStyle = hexToRgba(mg.hue, Math.min(1, alpha * 1.25));
        ctx.beginPath();
        ctx.arc(head.x, head.y, mg.isChalkSurge ? 4.2 : 3.0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function getState() {
      var st = statsForAssignments(assignments);
      return {
        permutationCount: permutationCount,
        incongruityIndex: st.incongruityIndex,
        allNineActive: st.allNineActive,
        shellAssignments: cloneAssignments(assignments),
        activeMigrationsCount: migrations.length,
        muted: audio.isMuted(),
        acts: getActs()
      };
    }

    function reset() {
      assignments = cloneAssignments(INITIAL_ASSIGNMENTS);
      permutationCount = 0;
      autoCycleTimer = 0;
      chalkSpawnCooldown = 0;
      for (var i = 0; i < ACTS.length; i++) {
        actPulseBoost[ACTS[i].id] = 0;
      }
      seedAmbientFilaments();
      return getState();
    }

    return {
      ACTS: ACTS,
      getActs: getActs,
      getShellOccupants: getShellOccupants,
      permuteNow: permuteNow,
      assignActToShell: assignActToShell,
      surgeAcrossChalk: surgeAcrossChalk,
      step: step,
      renderActs: renderActs,
      setMuted: audio.setMuted,
      isMuted: audio.isMuted,
      unlockAudio: audio.unlockAudio,
      triggerActVoice: audio.triggerActVoice,
      triggerChalkScratch: audio.triggerChalkScratch,
      triggerDissolveChord: audio.triggerDissolveChord,
      triggerPerimeterTumbleSound: audio.triggerPerimeterTumbleSound,
      getState: getState,
      reset: reset
    };
  }

  var api = {
    ACTS: ACTS,
    SHELL_IDS: SHELL_IDS,
    createPermutationActs: createPermutationActs
  };

  root.ZoePermutationActs = api;
  if (typeof window !== "undefined") {
    window.ZoePermutationActs = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
