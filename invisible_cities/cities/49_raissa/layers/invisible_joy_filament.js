/* City 49: Raissa — Invisible Causal Joy Filament Layer (Standalone Canvas2D + WebAudio IIFE) */
(function (root) {
  "use strict";

  var PALETTE = Object.freeze({
    grim_slate_night: "#13171d",
    soot_ash_wall: "#222933",
    zinc_counter_pewter: "#566373",
    rain_bruise_blue: "#39485a",
    parchment_vellum: "#efe3c4",
    filament_spun_gold: "#f4c552",
    filament_core_ivory: "#fff0b8",
    ragout_terracotta: "#c95b3c",
    francolin_speckle_amber: "#e29a2e"
  });

  var PHILOSOPHER_QUOTE =
    "Also in Raissa, city of sadness, there runs an invisible thread that binds one living being to another for a moment, then unravels, then is stretched again between moving points as it draws new and rapid patterns so that at every second the unhappy city contains a happy city unaware of its own existence.";

  var CHAIN_LINKS = Object.freeze([
    Object.freeze({
      index: 0,
      id: "laughing_child",
      shortLabel: "01 · Laughing Child",
      actor: "Child in a casement window",
      action: "Laughs aloud seeing the dog leap onto the shed below",
      stoneQuote: "In a window a child laughs at the sight of the dog jumping onto a shed.",
      causeArrow: "Laughs seeing the dog leap onto the shed ->",
      noteHz: 349.23
    }),
    Object.freeze({
      index: 1,
      id: "polenta_dog",
      shortLabel: "02 · Polenta Dog",
      actor: "Dog upon the zinc shed roof",
      action: "Jumps onto a shed to bite into a piece of fallen polenta",
      stoneQuote: "The dog has jumped onto a shed to bite into a piece of polenta that was dropped.",
      causeArrow: "Snaps up the polenta dropped from high scaffolding ->",
      noteHz: 392.00
    }),
    Object.freeze({
      index: 2,
      id: "merry_stonemason",
      shortLabel: "03 · Merry Stonemason",
      actor: "Young stonemason on the upper scaffolding",
      action: "Drops polenta in high spirits shouting \"Darling, let me dip into it!\"",
      stoneQuote: "A stonemason dropped the polenta from the scaffolding, shouting in high spirits to a young serving-maid: \"Darling, let me dip into it!\"",
      causeArrow: "Calls down merrily toward the steaming ragout ->",
      noteHz: 440.00
    }),
    Object.freeze({
      index: 3,
      id: "ragout_maid",
      shortLabel: "04 · Ragout Serving-Maid",
      actor: "Young serving-maid beneath the pergola",
      action: "Holds up a steaming terracotta dish of ragout under the pergola",
      stoneQuote: "Under the pergola a young serving-maid holds up a dish of ragout, happy to serve it to the umbrella-maker.",
      causeArrow: "Serves the celebratory meal to the umbrella-maker ->",
      noteHz: 493.88
    }),
    Object.freeze({
      index: 4,
      id: "umbrella_maker",
      shortLabel: "05 · Umbrella-Maker",
      actor: "Umbrella-maker at his shop counter",
      action: "Rejoices over the completed transaction of a white lace parasol",
      stoneQuote: "The umbrella-maker celebrates a fine transaction after crafting and selling a white lace parasol.",
      causeArrow: "Sold the white lace parasol for the rampart races ->",
      noteHz: 523.25
    }),
    Object.freeze({
      index: 5,
      id: "parasol_lady",
      shortLabel: "06 · Parasol Lady",
      actor: "Great lady along the rampart promenade",
      action: "Displays her white lace parasol proudly at the rampart races",
      stoneQuote: "A great lady displays the white lace parasol she bought to parade at the races along the ramparts.",
      causeArrow: "Wins the bright smile of a beloved officer ->",
      noteHz: 587.33
    }),
    Object.freeze({
      index: 6,
      id: "leaping_officer",
      shortLabel: "07 · Leaping Officer",
      actor: "Beloved cavalry officer in the saddle",
      action: "Smiles at her while taking the last barricade jump of the course",
      stoneQuote: "A beloved officer smiles at her in taking the last jump over the racecourse barricades.",
      causeArrow: "Spurs a racehorse made happier still in flight ->",
      noteHz: 659.25
    }),
    Object.freeze({
      index: 7,
      id: "flying_horse",
      shortLabel: "08 · Flying Horse",
      actor: "Happier horse vaulting the hurdles",
      action: "Flies over the obstacles seeing a francolin flying in the sky",
      stoneQuote: "Happy the man, happier still his horse, flying over the obstacles, seeing a francolin flying in the sky.",
      causeArrow: "Follows the wingbeat of the liberated bird ->",
      noteHz: 698.46
    }),
    Object.freeze({
      index: 8,
      id: "freed_francolin",
      shortLabel: "09 · Freed Francolin",
      actor: "Happy francolin bird above the garret",
      action: "Soars from its open cage after being liberated by a painter",
      stoneQuote: "Happy bird liberated from its cage by a painter happy to have painted it feather by feather.",
      causeArrow: "Immortalized feather by feather in red and yellow ->",
      noteHz: 783.99
    }),
    Object.freeze({
      index: 9,
      id: "parchment_illuminator",
      shortLabel: "10 · Parchment Illuminator",
      actor: "Illuminator at the philosopher's folio",
      action: "Paints the red-and-yellow speckled francolin feather on the parchment page",
      stoneQuote: "Painted feather by feather, speckled with red and yellow, in the illumination of that page where the philosopher writes of Raissa.",
      causeArrow: "Binds the hidden happy city inside unhappy Raissa",
      noteHz: 880.00
    })
  ]);

  var DEFAULT_ANCHOR_ZONES = Object.freeze([
    Object.freeze({ index: 0, id: "laughing_child", zoneLabel: "Casement Window", baseX: 0.11, baseY: 0.27, driftRadiusX: 0.026, driftRadiusY: 0.030 }),
    Object.freeze({ index: 1, id: "polenta_dog", zoneLabel: "Zinc Shed Roof", baseX: 0.20, baseY: 0.53, driftRadiusX: 0.030, driftRadiusY: 0.026 }),
    Object.freeze({ index: 2, id: "merry_stonemason", zoneLabel: "Scaffolding Top", baseX: 0.29, baseY: 0.21, driftRadiusX: 0.028, driftRadiusY: 0.028 }),
    Object.freeze({ index: 3, id: "ragout_maid", zoneLabel: "Courtyard Pergola", baseX: 0.38, baseY: 0.56, driftRadiusX: 0.028, driftRadiusY: 0.030 }),
    Object.freeze({ index: 4, id: "umbrella_maker", zoneLabel: "Umbrella Shop", baseX: 0.49, baseY: 0.63, driftRadiusX: 0.028, driftRadiusY: 0.028 }),
    Object.freeze({ index: 5, id: "parasol_lady", zoneLabel: "Rampart Promenade", baseX: 0.61, baseY: 0.34, driftRadiusX: 0.030, driftRadiusY: 0.028 }),
    Object.freeze({ index: 6, id: "leaping_officer", zoneLabel: "Barricade Jump", baseX: 0.71, baseY: 0.47, driftRadiusX: 0.030, driftRadiusY: 0.030 }),
    Object.freeze({ index: 7, id: "flying_horse", zoneLabel: "Sky Arch Hurdles", baseX: 0.78, baseY: 0.19, driftRadiusX: 0.032, driftRadiusY: 0.026 }),
    Object.freeze({ index: 8, id: "freed_francolin", zoneLabel: "Painter Garret", baseX: 0.86, baseY: 0.31, driftRadiusX: 0.028, driftRadiusY: 0.030 }),
    Object.freeze({ index: 9, id: "parchment_illuminator", zoneLabel: "Scriptorium Desk", baseX: 0.90, baseY: 0.64, driftRadiusX: 0.025, driftRadiusY: 0.028 })
  ]);

  var SEGMENT_ARCH_SIGNS = [1, -1, 1, 0.7, -0.8, 0.85, -1.15, -0.75, 0.9];

  function raiFilClamp(val, lo, hi) {
    return val < lo ? lo : val > hi ? hi : val;
  }

  function raiFilHash(seed) {
    var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function raiFilSafeEllipse(ctx, cx, cy, rx, ry, rot) {
    if (typeof ctx.ellipse === "function") {
      ctx.ellipse(cx, cy, Math.max(0.5, rx), Math.max(0.5, ry), rot || 0, 0, Math.PI * 2);
      return;
    }
    ctx.save();
    ctx.translate(cx, cy);
    if (rot) ctx.rotate(rot);
    ctx.scale(Math.max(0.5, rx), Math.max(0.5, ry));
    ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.restore();
  }

  function raiFilBuildCurveControls(ax, ay, bx, by, segIndex, archBias, curlExtra) {
    var dx = bx - ax;
    var dy = by - ay;
    var span = Math.sqrt(dx * dx + dy * dy) || 1;
    var sign = SEGMENT_ARCH_SIGNS[segIndex % 9] || 1;
    var sag = span * (0.19 + 0.08 * (archBias || 0)) * sign + (curlExtra || 0);
    var nx = (-dy / span) * sag * 0.28;
    var c1x = ax + dx * 0.32 + nx;
    var c1y = ay + dy * 0.32 + sag;
    var c2x = ax + dx * 0.68 + nx;
    var c2y = ay + dy * 0.68 + sag * 0.92;
    return { ax: ax, ay: ay, c1x: c1x, c1y: c1y, c2x: c2x, c2y: c2y, bx: bx, by: by };
  }

  function raiFilEvalCubic(seg, t) {
    var u = 1 - t;
    var tt = t * t;
    var uu = u * u;
    var uuu = uu * u;
    var ttt = tt * t;
    return {
      x: uuu * seg.ax + 3 * uu * t * seg.c1x + 3 * u * tt * seg.c2x + ttt * seg.bx,
      y: uuu * seg.ay + 3 * uu * t * seg.c1y + 3 * u * tt * seg.c2y + ttt * seg.by
    };
  }

  function raiFilEvalTangent(seg, t) {
    var u = 1 - t;
    var tx = 3 * u * u * (seg.c1x - seg.ax) + 6 * u * t * (seg.c2x - seg.c1x) + 3 * t * t * (seg.bx - seg.c2x);
    var ty = 3 * u * u * (seg.c1y - seg.ay) + 6 * u * t * (seg.c2y - seg.c1y) + 3 * t * t * (seg.by - seg.c2y);
    return Math.atan2(ty, tx);
  }

  function raiFilNormalizeAnchors(anchorZones) {
    var out = new Array(10);
    for (var i = 0; i < 10; i++) {
      var fb = DEFAULT_ANCHOR_ZONES[i];
      var src = anchorZones && anchorZones[i] ? anchorZones[i] : fb;
      var bx = typeof src.baseX === "number" ? src.baseX : (typeof src.x === "number" ? src.x : (typeof src.nx === "number" ? src.nx : fb.baseX));
      var by = typeof src.baseY === "number" ? src.baseY : (typeof src.y === "number" ? src.y : (typeof src.ny === "number" ? src.ny : fb.baseY));
      var rx = typeof src.driftRadiusX === "number" ? src.driftRadiusX : (typeof src.rx === "number" ? src.rx : fb.driftRadiusX);
      var ry = typeof src.driftRadiusY === "number" ? src.driftRadiusY : (typeof src.ry === "number" ? src.ry : fb.driftRadiusY);
      out[i] = {
        index: i,
        id: CHAIN_LINKS[i].id,
        zoneLabel: src.zoneLabel || src.label || src.title || fb.zoneLabel,
        baseX: raiFilClamp(bx, 0.06, 0.94),
        baseY: raiFilClamp(by, 0.09, 0.90),
        driftRadiusX: raiFilClamp(rx, 0.008, 0.055),
        driftRadiusY: raiFilClamp(ry, 0.008, 0.055)
      };
    }
    return out;
  }

  function raiFilCreateAudio(initialMuted) {
    var muted = Boolean(initialMuted);
    var actx = null;
    var noiseBuf = null;
    var lastPlayedAt = {};

    function ensureContext() {
      if (actx) {
        if (actx.state === "suspended" && typeof actx.resume === "function") {
          try { actx.resume(); } catch (e) { /* ignore suspended gesture guard */ }
        }
        return actx;
      }
      var Ctor = root.AudioContext || root.webkitAudioContext;
      if (!Ctor) return null;
      try {
        actx = new Ctor();
        var sr = actx.sampleRate || 44100;
        noiseBuf = actx.createBuffer(1, Math.floor(sr * 0.45), sr);
        var ch = noiseBuf.getChannelData(0);
        for (var i = 0; i < ch.length; i++) {
          ch[i] = (raiFilHash(i * 0.73 + 1.9) * 2 - 1) * 0.5;
        }
      } catch (err) {
        actx = null;
      }
      return actx;
    }

    function voiceHarpAndFlute(freq, delaySec, gainScale) {
      if (muted) return false;
      var ctx = ensureContext();
      if (!ctx || !freq) return false;
      try {
        var t0 = ctx.currentTime + (delaySec || 0);
        var amp = 0.055 * (gainScale || 1);

        var harpOsc = ctx.createOscillator();
        var harpHarm = ctx.createOscillator();
        var harpFilter = ctx.createBiquadFilter();
        var harpGain = ctx.createGain();
        harpOsc.type = "triangle";
        harpOsc.frequency.setValueAtTime(freq, t0);
        harpHarm.type = "sine";
        harpHarm.frequency.setValueAtTime(freq * 2, t0);
        harpFilter.type = "lowpass";
        harpFilter.frequency.setValueAtTime(Math.min(3400, freq * 5.2), t0);
        harpFilter.frequency.exponentialRampToValueAtTime(Math.max(420, freq * 1.4), t0 + 0.58);
        harpGain.gain.setValueAtTime(0.0001, t0);
        harpGain.gain.linearRampToValueAtTime(amp, t0 + 0.007);
        harpGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.64);
        harpOsc.connect(harpFilter);
        harpHarm.connect(harpFilter);
        harpFilter.connect(harpGain);
        harpGain.connect(ctx.destination);
        harpOsc.start(t0);
        harpHarm.start(t0);
        harpOsc.stop(t0 + 0.66);
        harpHarm.stop(t0 + 0.34);

        var fluteOsc = ctx.createOscillator();
        var fluteGain = ctx.createGain();
        fluteOsc.type = "sine";
        fluteOsc.frequency.setValueAtTime(freq, t0 + 0.018);
        fluteGain.gain.setValueAtTime(0.0001, t0 + 0.018);
        fluteGain.gain.linearRampToValueAtTime(amp * 0.46, t0 + 0.085);
        fluteGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.46);
        fluteOsc.connect(fluteGain);
        fluteGain.connect(ctx.destination);
        fluteOsc.start(t0 + 0.018);
        fluteOsc.stop(t0 + 0.48);

        if (noiseBuf) {
          var breath = ctx.createBufferSource();
          var bp = ctx.createBiquadFilter();
          var bg = ctx.createGain();
          breath.buffer = noiseBuf;
          bp.type = "bandpass";
          bp.frequency.setValueAtTime(Math.min(4800, freq * 2.02), t0 + 0.015);
          bp.Q.setValueAtTime(6.5, t0 + 0.015);
          bg.gain.setValueAtTime(0.0001, t0 + 0.015);
          bg.gain.linearRampToValueAtTime(amp * 0.16, t0 + 0.055);
          bg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.24);
          breath.connect(bp);
          bp.connect(bg);
          bg.connect(ctx.destination);
          breath.start(t0 + 0.015);
          breath.stop(t0 + 0.26);
        }
        return true;
      } catch (err) {
        return false;
      }
    }

    return {
      unlock: function () { return Boolean(ensureContext()); },
      isMuted: function () { return muted; },
      setMuted: function (nextMuted) {
        muted = Boolean(nextMuted);
        if (!muted) ensureContext();
        return muted;
      },
      playLinkNote: function (idx) {
        if (muted) return false;
        var cleanIdx = (((Math.round(Number(idx) || 0) % 10) + 10) % 10);
        var nowMs = Date.now();
        if (lastPlayedAt[cleanIdx] && nowMs - lastPlayedAt[cleanIdx] < 45) return true;
        lastPlayedAt[cleanIdx] = nowMs;
        return voiceHarpAndFlute(CHAIN_LINKS[cleanIdx].noteHz, 0, 1.0);
      },
      playRestretchShimmer: function (soft) {
        if (muted || (!actx && soft)) return false;
        var notes = [349.23, 440.00, 493.88, 659.25];
        var scale = soft ? 0.24 : 0.48;
        for (var i = 0; i < notes.length; i++) {
          voiceHarpAndFlute(notes[i], i * 0.036, scale);
        }
        return true;
      },
      playFreezeChime: function () {
        if (muted) return false;
        voiceHarpAndFlute(698.46, 0, 0.36);
        return voiceHarpAndFlute(1046.50, 0.03, 0.28);
      }
    };
  }

  function raiFilDrawNodeEmblem(ctx, idx, cx, cy, r, phase, focused) {
    ctx.save();
    ctx.translate(cx, cy);
    var s = r / 14;
    ctx.scale(s, s);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    var gold = focused ? PALETTE.filament_core_ivory : PALETTE.filament_spun_gold;
    var vellum = PALETTE.parchment_vellum;
    var red = PALETTE.ragout_terracotta;
    var amber = PALETTE.francolin_speckle_amber;
    var bob = Math.sin(phase * 2.4 + idx) * 0.7;

    if (idx === 0) {
      /* 0: Laughing child in casement window */
      ctx.strokeStyle = vellum;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(-6.5, 6.5); ctx.lineTo(-6.5, -2.5);
      ctx.arc(0, -2.5, 6.5, Math.PI, 0, false);
      ctx.lineTo(6.5, 6.5); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = gold;
      ctx.beginPath(); ctx.arc(0, 1.2 + bob * 0.4, 3.1, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = PALETTE.grim_slate_night; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.arc(0, 1.6 + bob * 0.4, 1.7, 0.15, Math.PI - 0.15, false); ctx.stroke();
      ctx.strokeStyle = PALETTE.filament_core_ivory; ctx.lineWidth = 1.15;
      for (var k0 = -1; k0 <= 1; k0++) {
        ctx.beginPath();
        ctx.moveTo(k0 * 3.2, -4.2); ctx.lineTo(k0 * 4.8, -7.2); ctx.stroke();
      }
    } else if (idx === 1) {
      /* 1: Dog jumping onto shed to bite fallen polenta */
      ctx.strokeStyle = PALETTE.zinc_counter_pewter; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-8, 6.2); ctx.lineTo(7.5, 2.8); ctx.stroke();
      ctx.fillStyle = amber;
      ctx.beginPath(); ctx.moveTo(3.2, -2.8); ctx.lineTo(7.4, -1.2); ctx.lineTo(4.1, 1.6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = gold; ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(-6.8, 3.8); ctx.quadraticCurveTo(-2.2, -3.5 + bob, 2.6, -0.8);
      ctx.moveTo(-5.2, 2.2); ctx.lineTo(-7.5, 0.2);
      ctx.moveTo(0.8, -1.2); ctx.lineTo(2.4, -3.6);
      ctx.stroke();
    } else if (idx === 2) {
      /* 2: Stonemason on scaffolding dropping polenta & calling down */
      ctx.strokeStyle = vellum; ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-7.5, -3.5); ctx.lineTo(7.5, -3.5);
      ctx.moveTo(-5.2, -7.5); ctx.lineTo(-5.2, 7.2);
      ctx.moveTo(5.2, -7.5); ctx.lineTo(5.2, 7.2);
      ctx.stroke();
      ctx.fillStyle = gold;
      ctx.beginPath(); ctx.moveTo(-2.5, -6.5); ctx.lineTo(2.2, -4.5); ctx.lineTo(-1.2, -1.5); ctx.closePath(); ctx.fill();
      ctx.fillStyle = amber;
      ctx.beginPath(); ctx.arc(0.8, 2.5 + Math.abs(bob), 2.1, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = PALETTE.filament_core_ivory; ctx.lineWidth = 1.05;
      ctx.beginPath(); ctx.arc(0.8, 4.2, 4.4, 0.25, Math.PI - 0.25, false); ctx.stroke();
    } else if (idx === 3) {
      /* 3: Serving-maid holding steaming ragout dish under pergola */
      ctx.strokeStyle = gold; ctx.lineWidth = 1.15;
      ctx.beginPath(); ctx.moveTo(-7.5, -6.2); ctx.lineTo(7.5, -6.2); ctx.stroke();
      ctx.fillStyle = red;
      ctx.beginPath();
      ctx.arc(0, 2.8, 5.4, 0, Math.PI, false); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = vellum; ctx.lineWidth = 1.15;
      for (var s3 = -1; s3 <= 1; s3++) {
        ctx.beginPath();
        ctx.moveTo(s3 * 3.1, 0.8);
        ctx.bezierCurveTo(s3 * 3.1 - 1.4, -1.6, s3 * 3.1 + 1.4, -3.2, s3 * 3.1, -5.0 + bob * 0.4);
        ctx.stroke();
      }
    } else if (idx === 4) {
      /* 4: Umbrella-maker's white lace parasol rosette */
      ctx.fillStyle = "rgba(239, 227, 196, 0.24)";
      ctx.strokeStyle = vellum; ctx.lineWidth = 1.25;
      ctx.beginPath(); ctx.arc(0, 0, 6.8, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = gold; ctx.lineWidth = 0.95;
      for (var r4 = 0; r4 < 8; r4++) {
        var a4 = (r4 * Math.PI) / 4 + phase * 0.12;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a4) * 6.6, Math.sin(a4) * 6.6); ctx.stroke();
      }
      ctx.fillStyle = PALETTE.filament_core_ivory;
      ctx.beginPath(); ctx.arc(0, 0, 1.6, 0, Math.PI * 2); ctx.fill();
    } else if (idx === 5) {
      /* 5: Great lady displaying white lace parasol at rampart races */
      ctx.strokeStyle = vellum; ctx.lineWidth = 1.35;
      ctx.beginPath(); ctx.arc(1.2, -1.8, 6.2, Math.PI * 1.06, Math.PI * 1.98, false); ctx.closePath();
      ctx.fillStyle = "rgba(239, 227, 196, 0.30)"; ctx.fill(); ctx.stroke();
      ctx.strokeStyle = gold; ctx.lineWidth = 1.25;
      ctx.beginPath(); ctx.moveTo(1.2, -1.8); ctx.lineTo(-2.2, 6.5); ctx.stroke();
      ctx.fillStyle = gold;
      ctx.beginPath(); ctx.arc(-2.6, 2.2, 1.9, 0, Math.PI * 2); ctx.fill();
    } else if (idx === 6) {
      /* 6: Beloved officer smiling at the last barricade jump */
      ctx.strokeStyle = red; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(-6.5, 6.2); ctx.lineTo(-6.5, 1.2); ctx.moveTo(6.5, 6.2); ctx.lineTo(6.5, 1.2);
      ctx.moveTo(-7.2, 2.6); ctx.lineTo(7.2, 2.6); ctx.stroke();
      ctx.strokeStyle = PALETTE.filament_core_ivory; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-6.2, 0.6); ctx.quadraticCurveTo(0, -8.4 + bob, 6.4, -0.5); ctx.stroke();
      ctx.fillStyle = gold;
      ctx.beginPath(); ctx.moveTo(0, -6.8); ctx.lineTo(2.8, -3.2); ctx.lineTo(-2.8, -3.2); ctx.closePath(); ctx.fill();
    } else if (idx === 7) {
      /* 7: Happier horse flying over obstacles */
      ctx.strokeStyle = vellum; ctx.lineWidth = 1.1;
      ctx.beginPath(); ctx.moveTo(-6.8, 5.8); ctx.lineTo(6.8, 5.8); ctx.stroke();
      ctx.strokeStyle = gold; ctx.lineWidth = 1.75;
      ctx.beginPath();
      ctx.moveTo(-6.8, 2.2); ctx.quadraticCurveTo(-1.5, -4.8 + bob, 4.8, -2.2);
      ctx.lineTo(7.2, -4.8);
      ctx.moveTo(3.5, -1.5); ctx.lineTo(7.2, 1.2);
      ctx.moveTo(-4.2, 0.8); ctx.lineTo(-7.4, 3.8);
      ctx.stroke();
    } else if (idx === 8) {
      /* 8: Liberated francolin soaring above open cage */
      ctx.strokeStyle = PALETTE.zinc_counter_pewter; ctx.lineWidth = 1.05;
      ctx.strokeRect(-6.8, 1.4, 5.2, 5.4);
      ctx.strokeStyle = gold; ctx.lineWidth = 1.55;
      ctx.beginPath();
      ctx.moveTo(-1.2, -1.4 + bob); ctx.quadraticCurveTo(2.2, -6.8, 6.8, -4.6);
      ctx.moveTo(-1.2, -1.4 + bob); ctx.quadraticCurveTo(-4.6, -5.8, -7.2, -2.8);
      ctx.stroke();
      ctx.fillStyle = red;
      ctx.beginPath(); ctx.arc(0.5, -1.6 + bob, 1.6, 0, Math.PI * 2); ctx.fill();
    } else {
      /* 9: Illuminator's parchment folio + speckled red-and-yellow feather */
      ctx.fillStyle = vellum;
      ctx.fillRect(-6.8, -4.6, 13.6, 9.6);
      ctx.strokeStyle = amber; ctx.lineWidth = 1.0;
      ctx.strokeRect(-6.8, -4.6, 13.6, 9.6);
      ctx.beginPath(); ctx.moveTo(0, -4.6); ctx.lineTo(0, 5.0); ctx.stroke();
      ctx.strokeStyle = red; ctx.lineWidth = 1.65;
      ctx.beginPath(); ctx.moveTo(-4.2, 3.2); ctx.quadraticCurveTo(0.8, -1.4, 5.4, -5.8); ctx.stroke();
      ctx.fillStyle = gold;
      ctx.beginPath(); ctx.arc(1.2, -1.2, 1.3, 0, Math.PI * 2); ctx.arc(3.4, -3.4, 1.1, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function raiFilPaintMedallion(ctx, width, height, snap, extraState) {
    if (!ctx || !(width > 0) || !(height > 0)) return;
    var w = width;
    var h = height;
    ctx.save();
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = PALETTE.grim_slate_night;
    ctx.fillRect(0, 0, w, h);

    var pad = Math.max(8, Math.min(w, h) * 0.065);
    var fx = pad;
    var fy = pad;
    var fw = Math.max(24, w - pad * 2);
    var fh = Math.max(24, h - pad * 2);

    /* Warm illuminated vellum folio */
    ctx.fillStyle = PALETTE.parchment_vellum;
    ctx.fillRect(fx, fy, fw, fh);
    ctx.strokeStyle = PALETTE.francolin_speckle_amber;
    ctx.lineWidth = 2;
    ctx.strokeRect(fx + 2, fy + 2, fw - 4, fh - 4);
    ctx.strokeStyle = "rgba(201, 91, 60, 0.34)";
    ctx.lineWidth = 1;
    ctx.strokeRect(fx + 7, fy + 7, fw - 14, fh - 14);

    /* Rubricated initial & faint manuscript lines */
    var initBox = Math.max(14, Math.min(fw, fh) * 0.17);
    ctx.fillStyle = PALETTE.ragout_terracotta;
    ctx.fillRect(fx + 12, fy + 12, initBox, initBox);
    ctx.strokeStyle = PALETTE.filament_spun_gold;
    ctx.strokeRect(fx + 13.5, fy + 13.5, initBox - 3, initBox - 3);
    ctx.fillStyle = PALETTE.filament_core_ivory;
    ctx.font = "bold " + Math.round(initBox * 0.68) + "px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("R", fx + 12 + initBox * 0.5, fy + 12 + initBox * 0.54);

    ctx.strokeStyle = "rgba(34, 41, 51, 0.20)";
    ctx.lineWidth = 1;
    for (var ln = 0; ln < 5; ln++) {
      var ly = fy + 15 + ln * (fh - 30) * 0.22;
      var lx0 = ln < 2 ? fx + 18 + initBox : fx + 14;
      ctx.beginPath(); ctx.moveTo(lx0, ly); ctx.lineTo(fx + fw - 14, ly); ctx.stroke();
    }

    /* Feather-by-feather red-and-yellow speckled francolin plume */
    var x0 = fx + fw * 0.18;
    var y0 = fy + fh * 0.80;
    var x1 = fx + fw * 0.84;
    var y1 = fy + fh * 0.20;
    var cxm = fx + fw * 0.48;
    var cym = fy + fh * 0.42;
    var barbCount = 26;

    for (var b = 2; b <= barbCount; b++) {
      var tb = b / (barbCount + 1);
      var ub = 1 - tb;
      var bx = ub * ub * x0 + 2 * ub * tb * cxm + tb * tb * x1;
      var by = ub * ub * y0 + 2 * ub * tb * cym + tb * tb * y1;
      var env = Math.sin(tb * Math.PI) * Math.min(fw, fh) * 0.21;
      var ang = Math.atan2(y1 - y0, x1 - x0);
      var barbColor = b % 3 === 0 ? PALETTE.ragout_terracotta : (b % 3 === 1 ? PALETTE.francolin_speckle_amber : "#39485a");
      ctx.strokeStyle = barbColor;
      ctx.lineWidth = Math.max(1.2, Math.min(fw, fh) * 0.014);
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(ang - 1.12) * env, by + Math.sin(ang - 1.12) * env);
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(ang + 1.05) * env * 0.88, by + Math.sin(ang + 1.05) * env * 0.88);
      ctx.stroke();

      /* Red and yellow speckles painted feather by feather */
      ctx.fillStyle = b % 2 === 0 ? PALETTE.filament_spun_gold : PALETTE.ragout_terracotta;
      ctx.beginPath();
      ctx.arc(bx + Math.cos(ang - 1.12) * env * 0.66, by + Math.sin(ang - 1.12) * env * 0.66, Math.max(1.3, env * 0.095), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = b % 2 === 0 ? PALETTE.ragout_terracotta : PALETTE.filament_core_ivory;
      ctx.beginPath();
      ctx.arc(bx + Math.cos(ang + 1.05) * env * 0.56, by + Math.sin(ang + 1.05) * env * 0.56, Math.max(1.2, env * 0.085), 0, Math.PI * 2);
      ctx.fill();
    }

    /* Ivory-gold quill shaft (rachis) */
    ctx.strokeStyle = PALETTE.soot_ash_wall;
    ctx.lineWidth = 2.6;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cxm, cym, x1, y1); ctx.stroke();
    ctx.strokeStyle = PALETTE.filament_spun_gold;
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(cxm, cym, x1, y1); ctx.stroke();

    /* 10-bead golden marginal filament indicator along bottom margin */
    var litIdx = (extraState && typeof extraState.traceIndex === "number")
      ? extraState.traceIndex
      : (snap.traceIndex !== null ? snap.traceIndex : snap.sparkActiveIndex);
    var byBead = fy + fh - 11;
    ctx.strokeStyle = "rgba(226, 154, 46, 0.55)";
    ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(fx + 16, byBead); ctx.lineTo(fx + fw - 16, byBead); ctx.stroke();
    for (var m = 0; m < 10; m++) {
      var mx = fx + 16 + (m / 9) * (fw - 32);
      var isLit = m === litIdx;
      ctx.fillStyle = isLit ? PALETTE.ragout_terracotta : PALETTE.filament_spun_gold;
      ctx.beginPath(); ctx.arc(mx, byBead, isLit ? 3.6 : 2.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  function raiFilRenderOverlay(ctx, width, height, model, extState) {
    if (!ctx || !(width > 0) || !(height > 0)) return;
    var w = width;
    var h = height;
    var minDim = Math.min(w, h);
    var uiScale = raiFilClamp(minDim / 760, 0.66, 1.18);
    var nodeRad = raiFilClamp(minDim * 0.022, 11.5, 17.5);
    var activeTrace = (extState && extState.traceIndex !== undefined) ? extState.traceIndex : model.traceIndex;
    var hoveredIdx = null;
    if (extState && typeof extState.hoveredNodeIndex === "number") hoveredIdx = extState.hoveredNodeIndex;
    else if (extState && typeof extState.hoveredJoyIndex === "number") hoveredIdx = extState.hoveredJoyIndex;
    var isFrozen = (extState && typeof extState.frozen === "boolean") ? extState.frozen : model.frozen;

    ctx.save();

    /* 1. Fading unraveled ghost skeins (dissolving over ~1.4s while new skein is already taut) */
    for (var g = 0; g < model.unravelingGhosts.length; g++) {
      var ghost = model.unravelingGhosts[g];
      var life = raiFilClamp(1 - ghost.ageSec / ghost.durationSec, 0, 1);
      if (life <= 0.01) continue;
      var driftUp = (1 - life) * h * 0.028;
      var curlExtra = (1 - life) * minDim * 0.045 * (ghost.gen % 2 === 0 ? 1 : -1);
      ctx.save();
      if (typeof ctx.setLineDash === "function") {
        ctx.setLineDash([6 * uiScale, (5 + (1 - life) * 9) * uiScale]);
      }
      ctx.strokeStyle = "rgba(244, 197, 82, " + (life * 0.42).toFixed(3) + ")";
      ctx.lineWidth = 1.6 * uiScale;
      for (var gs = 0; gs < 9; gs++) {
        var ga = ghost.nodes[gs];
        var gb = ghost.nodes[gs + 1];
        var gSeg = raiFilBuildCurveControls(
          ga.nx * w, ga.ny * h - driftUp,
          gb.nx * w, gb.ny * h - driftUp,
          gs, ghost.archBiases[gs], curlExtra
        );
        ctx.beginPath();
        ctx.moveTo(gSeg.ax, gSeg.ay);
        ctx.bezierCurveTo(gSeg.c1x, gSeg.c1y, gSeg.c2x, gSeg.c2y, gSeg.bx, gSeg.by);
        ctx.stroke();
      }
      if (typeof ctx.setLineDash === "function") ctx.setLineDash([]);
      /* Dissolving curl wisps at former vertices */
      ctx.strokeStyle = "rgba(239, 227, 196, " + (life * 0.34).toFixed(3) + ")";
      ctx.lineWidth = 1.0 * uiScale;
      for (var gv = 0; gv < 10; gv++) {
        var gn = ghost.nodes[gv];
        ctx.beginPath();
        ctx.arc(gn.nx * w, gn.ny * h - driftUp, (4 + (1 - life) * 11) * uiScale, 0, Math.PI * 1.45);
        ctx.stroke();
      }
      ctx.restore();
    }

    /* 2. Build screen-space Bezier segments for active 10-node thread */
    var nodes = model.activeNodes;
    var segs = new Array(9);
    for (var i = 0; i < 9; i++) {
      segs[i] = raiFilBuildCurveControls(
        nodes[i].nx * w, nodes[i].ny * h,
        nodes[i + 1].nx * w, nodes[i + 1].ny * h,
        i, nodes[i].archBias, 0
      );
    }

    /* 3. Three-pass luminous spun-gold catenary filament + directional causal chevrons */
    for (var s = 0; s < 9; s++) {
      var seg = segs[s];
      var segHighlighted = (activeTrace !== null && (s === activeTrace || s === activeTrace - 1)) ||
        (hoveredIdx !== null && (s === hoveredIdx || s === hoveredIdx - 1));

      ctx.strokeStyle = segHighlighted ? "rgba(255, 240, 184, 0.36)" : "rgba(244, 197, 82, 0.19)";
      ctx.lineWidth = (segHighlighted ? 8.2 : 5.8) * uiScale;
      ctx.beginPath();
      ctx.moveTo(seg.ax, seg.ay);
      ctx.bezierCurveTo(seg.c1x, seg.c1y, seg.c2x, seg.c2y, seg.bx, seg.by);
      ctx.stroke();

      ctx.strokeStyle = PALETTE.filament_spun_gold;
      ctx.lineWidth = (segHighlighted ? 3.1 : 2.15) * uiScale;
      ctx.beginPath();
      ctx.moveTo(seg.ax, seg.ay);
      ctx.bezierCurveTo(seg.c1x, seg.c1y, seg.c2x, seg.c2y, seg.bx, seg.by);
      ctx.stroke();

      ctx.strokeStyle = PALETTE.filament_core_ivory;
      ctx.lineWidth = (segHighlighted ? 1.45 : 0.9) * uiScale;
      ctx.beginPath();
      ctx.moveTo(seg.ax, seg.ay);
      ctx.bezierCurveTo(seg.c1x, seg.c1y, seg.c2x, seg.c2y, seg.bx, seg.by);
      ctx.stroke();

      /* Causal flow chevron at midpoint */
      var midPt = raiFilEvalCubic(seg, 0.53);
      var midAng = raiFilEvalTangent(seg, 0.53);
      var chev = 4.6 * uiScale;
      ctx.save();
      ctx.translate(midPt.x, midPt.y);
      ctx.rotate(midAng);
      ctx.strokeStyle = segHighlighted ? PALETTE.filament_core_ivory : PALETTE.filament_spun_gold;
      ctx.lineWidth = 1.4 * uiScale;
      ctx.beginPath();
      ctx.moveTo(-chev, -chev * 0.72);
      ctx.lineTo(chev * 0.55, 0);
      ctx.lineTo(-chev, chev * 0.72);
      ctx.stroke();
      ctx.restore();
    }

    /* 4. Darting causal sparks racing 0 -> 9 */
    for (var sp = 0; sp < 2; sp++) {
      var cursor = (model.sparkPhase + sp * 4.5) % 9;
      var segIdx = Math.min(8, Math.max(0, Math.floor(cursor)));
      var localT = cursor - segIdx;
      var sPt = raiFilEvalCubic(segs[segIdx], localT);
      var tailPt = raiFilEvalCubic(segs[segIdx], Math.max(0, localT - 0.085));

      ctx.strokeStyle = PALETTE.filament_core_ivory;
      ctx.lineWidth = 2.5 * uiScale;
      ctx.beginPath();
      ctx.moveTo(tailPt.x, tailPt.y);
      ctx.lineTo(sPt.x, sPt.y);
      ctx.stroke();

      ctx.fillStyle = "rgba(244, 197, 82, 0.34)";
      ctx.beginPath();
      ctx.arc(sPt.x, sPt.y, 7.6 * uiScale, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = PALETTE.filament_core_ivory;
      ctx.beginPath();
      ctx.arc(sPt.x, sPt.y, 3.1 * uiScale, 0, Math.PI * 2);
      ctx.fill();
    }

    /* 5. Bespoke 10-node medallions + spotlight ring */
    var focusNode = null;
    for (var n = 0; n < 10; n++) {
      var nd = nodes[n];
      var px = nd.nx * w;
      var py = nd.ny * h;
      var isTraced = activeTrace === n;
      var isHovered = hoveredIdx === n;
      var focused = isTraced || isHovered;
      if (focused) focusNode = { nd: nd, px: px, py: py };

      if (focused) {
        ctx.save();
        ctx.strokeStyle = PALETTE.filament_core_ivory;
        ctx.lineWidth = 1.8 * uiScale;
        ctx.beginPath();
        ctx.arc(px, py, nodeRad + 7.5 * uiScale, 0, Math.PI * 2);
        ctx.stroke();
        if (typeof ctx.setLineDash === "function") ctx.setLineDash([4 * uiScale, 4 * uiScale]);
        ctx.strokeStyle = PALETTE.filament_spun_gold;
        ctx.lineWidth = 1.2 * uiScale;
        ctx.beginPath();
        ctx.arc(px, py, nodeRad + 12.5 * uiScale, 0, Math.PI * 2);
        ctx.stroke();
        if (typeof ctx.setLineDash === "function") ctx.setLineDash([]);
        ctx.restore();
      }

      ctx.fillStyle = "rgba(19, 23, 29, 0.86)";
      ctx.beginPath();
      ctx.arc(px, py, nodeRad, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = focused ? PALETTE.filament_core_ivory : PALETTE.filament_spun_gold;
      ctx.lineWidth = (focused ? 2.2 : 1.5) * uiScale;
      ctx.beginPath();
      ctx.arc(px, py, nodeRad, 0, Math.PI * 2);
      ctx.stroke();

      raiFilDrawNodeEmblem(ctx, n, px, py, nodeRad, model.animClock, focused);

      /* Numeral pill 01..10 */
      var numStr = n < 9 ? "0" + (n + 1) : "10";
      var bx = px - nodeRad * 0.78;
      var by = py - nodeRad * 0.82;
      ctx.fillStyle = focused ? PALETTE.ragout_terracotta : PALETTE.soot_ash_wall;
      ctx.beginPath();
      ctx.arc(bx, by, Math.max(6.5, 7.2 * uiScale), 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PALETTE.filament_spun_gold;
      ctx.lineWidth = 0.9;
      ctx.stroke();
      ctx.fillStyle = PALETTE.filament_core_ivory;
      ctx.font = "bold " + Math.max(8, Math.round(8.6 * uiScale)) + "px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(numStr, bx, by + 0.5);
    }

    /* 6. Clamped spotlight callout tag + subtle shutter corner marks when frozen */
    if (focusNode) {
      var labelText = CHAIN_LINKS[focusNode.nd.index].shortLabel;
      ctx.font = "bold " + Math.max(10, Math.round(11 * uiScale)) + "px Georgia, serif";
      var tw = Math.min(w - 20, Math.max(118, labelText.length * 6.6 * uiScale + 18));
      var th = 22 * uiScale;
      var tx = raiFilClamp(focusNode.px - tw * 0.5, 10, w - tw - 10);
      var ty = focusNode.py > h * 0.24 ? focusNode.py - nodeRad - th - 14 * uiScale : focusNode.py + nodeRad + 14 * uiScale;
      ty = raiFilClamp(ty, 8, h - th - 8);
      ctx.fillStyle = "rgba(19, 23, 29, 0.92)";
      ctx.fillRect(tx, ty, tw, th);
      ctx.strokeStyle = PALETTE.filament_spun_gold;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(tx, ty, tw, th);
      ctx.fillStyle = PALETTE.filament_core_ivory;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labelText, tx + tw * 0.5, ty + th * 0.53);
    }

    if (isFrozen) {
      var arm = Math.max(14, 20 * uiScale);
      var m = 8;
      ctx.strokeStyle = PALETTE.filament_spun_gold;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(m, m + arm); ctx.lineTo(m, m); ctx.lineTo(m + arm, m);
      ctx.moveTo(w - m - arm, m); ctx.lineTo(w - m, m); ctx.lineTo(w - m, m + arm);
      ctx.moveTo(m, h - m - arm); ctx.lineTo(m, h - m); ctx.lineTo(m + arm, h - m);
      ctx.moveTo(w - m - arm, h - m); ctx.lineTo(w - m, h - m); ctx.lineTo(w - m, h - m - arm);
      ctx.stroke();
    }

    ctx.restore();
  }

  function create(options) {
    var opts = options || {};
    var CYCLE_PERIOD_SEC = 2.6;
    var GHOST_DURATION_SEC = 1.4;

    var anchors = raiFilNormalizeAnchors(opts.anchorZones);
    var audio = raiFilCreateAudio(Boolean(opts.muted));
    var reducedMotion = Boolean(opts.reducedMotion);
    var onChange = typeof opts.onChange === "function" ? opts.onChange : null;

    var timeSec = 0;
    var animClock = 0;
    var cycleElapsedSec = 0;
    var sparkPhase = 0;
    var patternGeneration = 1;
    var frozen = false;
    var frozenAtSec = null;
    var traceIndex = null;
    var unravelingGhosts = [];

    function computePatternNodes(gen, zoneList, clockSec) {
      var list = new Array(10);
      for (var i = 0; i < 10; i++) {
        var z = zoneList[i];
        var h1 = raiFilHash(gen * 31.7 + i * 13.3 + 0.7);
        var h2 = raiFilHash(gen * 53.9 + i * 19.1 + 2.3);
        var h3 = raiFilHash(gen * 71.3 + i * 7.9 + 5.1);
        var jumpX = (h1 * 2 - 1) * z.driftRadiusX * 0.72;
        var jumpY = (h2 * 2 - 1) * z.driftRadiusY * 0.72;
        var orbX = Math.cos(clockSec * (1.15 + h1 * 0.7) + h2 * 6.283) * z.driftRadiusX * 0.34;
        var orbY = Math.sin(clockSec * (1.05 + h2 * 0.7) + h1 * 6.283) * z.driftRadiusY * 0.34;
        list[i] = {
          index: i,
          id: CHAIN_LINKS[i].id,
          zoneLabel: z.zoneLabel,
          nx: raiFilClamp(z.baseX + jumpX + orbX, 0.048, 0.952),
          ny: raiFilClamp(z.baseY + jumpY + orbY, 0.075, 0.915),
          archBias: (h3 * 2 - 1)
        };
      }
      return list;
    }

    var activeNodes = computePatternNodes(patternGeneration, anchors, animClock);

    function notify() {
      if (onChange) {
        try { onChange(getSnapshot()); } catch (e) { /* safe callback */ }
      }
    }

    function snapshotGhostFromActive() {
      var gNodes = new Array(10);
      var biases = new Array(10);
      for (var i = 0; i < 10; i++) {
        gNodes[i] = { nx: activeNodes[i].nx, ny: activeNodes[i].ny };
        biases[i] = activeNodes[i].archBias;
      }
      unravelingGhosts.push({
        gen: patternGeneration,
        ageSec: 0,
        durationSec: GHOST_DURATION_SEC,
        nodes: gNodes,
        archBiases: biases
      });
      if (unravelingGhosts.length > 6) {
        unravelingGhosts.shift();
      }
    }

    function restretchImmediate(softAudio) {
      snapshotGhostFromActive();
      patternGeneration += 1;
      cycleElapsedSec = 0;
      activeNodes = computePatternNodes(patternGeneration, anchors, animClock);
      audio.playRestretchShimmer(Boolean(softAudio));
    }

    function getInvariants() {
      var count = activeNodes.length;
      return {
        overtSadnessConstant: true,
        invisibleThreadActiveEverySecond: count === 10,
        everySecondContainsHappyChain: count === 10,
        happyCityAwareOfItself: false,
        canonicalLinkCount: CHAIN_LINKS.length,
        activeLinkCount: count,
        patternGeneration: patternGeneration
      };
    }

    function getSnapshot() {
      var effectiveSec = frozen && frozenAtSec !== null ? frozenAtSec : timeSec;
      var sparkIdx = Math.min(9, Math.max(0, Math.round(sparkPhase * (9 / 8.999))));
      var nodeCopies = new Array(10);
      for (var i = 0; i < 10; i++) {
        var n = activeNodes[i];
        var meta = CHAIN_LINKS[i];
        nodeCopies[i] = {
          index: i,
          id: meta.id,
          nx: n.nx,
          ny: n.ny,
          zoneLabel: n.zoneLabel,
          shortLabel: meta.shortLabel,
          actor: meta.actor,
          action: meta.action,
          stoneQuote: meta.stoneQuote,
          causeArrow: meta.causeArrow,
          noteHz: meta.noteHz
        };
      }
      return {
        timeSec: effectiveSec,
        frozen: frozen,
        frozenAtSec: frozenAtSec,
        frozenAtMs: Math.round(effectiveSec * 1000),
        shutterProofLabel: (frozen ? "FROZEN t=" : "LIVE t=") + effectiveSec.toFixed(3) + "s · 10/10 LINKS ACTIVE",
        patternGeneration: patternGeneration,
        cycleElapsedSec: cycleElapsedSec,
        cyclePeriodSec: CYCLE_PERIOD_SEC,
        cycleProgress: cycleElapsedSec / CYCLE_PERIOD_SEC,
        activeLinkCount: activeNodes.length,
        unravelingGhostCount: unravelingGhosts.length,
        traceIndex: traceIndex,
        tracedLink: traceIndex !== null ? CHAIN_LINKS[traceIndex] : null,
        sparkPhase: sparkPhase,
        sparkActiveIndex: sparkIdx,
        muted: audio.isMuted(),
        reducedMotion: reducedMotion,
        nodes: nodeCopies,
        philosopherQuote: PHILOSOPHER_QUOTE,
        invariants: getInvariants()
      };
    }

    function step(dtSec, anchorZones) {
      if (anchorZones) {
        anchors = raiFilNormalizeAnchors(anchorZones);
      }
      var dt = raiFilClamp(Number(dtSec) || 0, 0, 0.5);
      if (!frozen && dt > 0) {
        timeSec += dt;
        for (var g = unravelingGhosts.length - 1; g >= 0; g--) {
          unravelingGhosts[g].ageSec += dt;
          if (unravelingGhosts[g].ageSec >= unravelingGhosts[g].durationSec) {
            unravelingGhosts.splice(g, 1);
          }
        }
        if (!reducedMotion) {
          animClock += dt;
          sparkPhase = (sparkPhase + dt * 5.2) % 9;
          cycleElapsedSec += dt;
          while (cycleElapsedSec >= CYCLE_PERIOD_SEC) {
            cycleElapsedSec -= CYCLE_PERIOD_SEC;
            snapshotGhostFromActive();
            patternGeneration += 1;
            audio.playRestretchShimmer(true);
          }
          activeNodes = computePatternNodes(patternGeneration, anchors, animClock);
        } else {
          activeNodes = computePatternNodes(patternGeneration, anchors, animClock);
        }
      } else if (anchorZones) {
        activeNodes = computePatternNodes(patternGeneration, anchors, animClock);
      }
      return getSnapshot();
    }

    function render(ctx, width, height, state) {
      if (state && typeof state.reducedMotion === "boolean") {
        reducedMotion = state.reducedMotion;
      }
      raiFilRenderOverlay(ctx, width, height, {
        activeNodes: activeNodes,
        unravelingGhosts: unravelingGhosts,
        sparkPhase: sparkPhase,
        animClock: animClock,
        traceIndex: traceIndex,
        frozen: frozen
      }, state);
    }

    function renderParchmentMedallion(ctx, width, height, state) {
      raiFilPaintMedallion(ctx, width, height, getSnapshot(), state);
    }

    function freezeAtNow() {
      frozen = true;
      frozenAtSec = timeSec;
      audio.playFreezeChime();
      notify();
      return getSnapshot();
    }

    function resumeFlow() {
      frozen = false;
      frozenAtSec = null;
      notify();
      return getSnapshot();
    }

    function unravelAndRestretchNow() {
      if (frozen) {
        animClock += 0.41;
        frozenAtSec = timeSec;
      }
      restretchImmediate(false);
      notify();
      return getSnapshot();
    }

    function setTraceIndex(idxOrNull) {
      if (idxOrNull === null || idxOrNull === undefined || idxOrNull === false || idxOrNull === -1) {
        traceIndex = null;
      } else {
        var parsed = Math.round(Number(idxOrNull));
        if (!isNaN(parsed)) {
          traceIndex = ((parsed % 10) + 10) % 10;
          audio.playLinkNote(traceIndex);
        }
      }
      notify();
      return getSnapshot();
    }

    function stepTrace(delta) {
      var stepBy = Math.trunc(Number(delta));
      if (!stepBy) stepBy = 1;
      if (traceIndex === null) {
        traceIndex = stepBy >= 0 ? 0 : 9;
      } else {
        traceIndex = (((traceIndex + stepBy) % 10) + 10) % 10;
      }
      audio.playLinkNote(traceIndex);
      notify();
      return getSnapshot();
    }

    function hitTestNode(nx, ny, width, height) {
      var w = width > 1 ? width : 1280;
      var h = height > 1 ? height : 800;
      var tx = Number(nx);
      var ty = Number(ny);
      if (isNaN(tx) || isNaN(ty)) return null;
      if ((tx > 1.05 || ty > 1.05) && w > 1 && h > 1) {
        tx = tx / w;
        ty = ty / h;
      }
      var px = tx * w;
      var py = ty * h;
      var hitRadius = raiFilClamp(Math.min(w, h) * 0.036, 20, 30);
      var best = null;
      var bestDist = hitRadius;
      for (var i = 0; i < 10; i++) {
        var nd = activeNodes[i];
        var dx = nd.nx * w - px;
        var dy = nd.ny * h - py;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= bestDist) {
          bestDist = dist;
          var meta = CHAIN_LINKS[i];
          best = {
            index: i,
            id: meta.id,
            nx: nd.nx,
            ny: nd.ny,
            px: nd.nx * w,
            py: nd.ny * h,
            zoneLabel: nd.zoneLabel,
            shortLabel: meta.shortLabel,
            actor: meta.actor,
            action: meta.action,
            stoneQuote: meta.stoneQuote,
            causeArrow: meta.causeArrow,
            noteHz: meta.noteHz,
            link: meta
          };
        }
      }
      return best;
    }

    return {
      CHAIN_LINKS: CHAIN_LINKS,
      PHILOSOPHER_QUOTE: PHILOSOPHER_QUOTE,
      PALETTE: PALETTE,
      step: step,
      render: render,
      renderParchmentMedallion: renderParchmentMedallion,
      freezeAtNow: freezeAtNow,
      resumeFlow: resumeFlow,
      isFrozen: function () { return frozen; },
      unravelAndRestretchNow: unravelAndRestretchNow,
      setTraceIndex: setTraceIndex,
      stepTrace: stepTrace,
      hitTestNode: hitTestNode,
      setMuted: function (b) { var res = audio.setMuted(b); notify(); return res; },
      isMuted: function () { return audio.isMuted(); },
      unlockAudio: function () { return audio.unlock(); },
      playLinkNote: function (idx) { return audio.playLinkNote(idx); },
      setReducedMotion: function (b) { reducedMotion = Boolean(b); notify(); return reducedMotion; },
      getSnapshot: getSnapshot,
      getInvariants: getInvariants
    };
  }

  var api = Object.freeze({
    CHAIN_LINKS: CHAIN_LINKS,
    PHILOSOPHER_QUOTE: PHILOSOPHER_QUOTE,
    PALETTE: PALETTE,
    DEFAULT_ANCHOR_ZONES: DEFAULT_ANCHOR_ZONES,
    create: create
  });

  root.RaissaJoyFilament = api;
  if (typeof window !== "undefined") {
    window.RaissaJoyFilament = api;
  }
  if (typeof module === "object" && module && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
