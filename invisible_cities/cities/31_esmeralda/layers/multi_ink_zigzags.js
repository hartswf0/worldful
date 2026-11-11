/*
 * ESMERALDA :: Multi-Ink Zigzag Navigator (layers/multi_ink_zigzags.js)
 * City 31, Trading Cities 5. Owner: esmeralda-zigzag-nav.
 * Four colored inks that CAN be fixed on paper: emerald canals (liquid, evident),
 * vermilion stepped streets / cambered bridges / hanging streets (solid, evident),
 * violet rooftop leaps of cats, thieves and illicit lovers (solid, clandestine),
 * sepia sewers of rats and manhole smugglers (hidden, subterranean).
 * Every day the inhabitant takes a fresh zigzag: never the shortest line, never boredom.
 * Classic IIFE, no modules, no network.
 */
(function (root) {
  'use strict';

  var PALETTE = {
    vellum: '#F1E9D6', lagoon: '#0E1818', emerald: '#117A65', emeraldWake: '#22B59B',
    terracotta: '#C2492D', ochre: '#D97A3E', violet: '#7A3B8E', lampblack: '#191716',
    sepia: '#5E4128', gold: '#D8A428', filament: '#F5CF6B', ironGall: '#221E1B'
  };

  var INK_STRATA = [
    { id: 'canal_emerald', label: 'Emerald Canals', color: '#117A65', glow: '#22B59B',
      matter: 'liquid', visibility: 'evident', stretch: 'liquid', paperFixable: true, key: '1',
      detail: 'Boat canals and skiffs gliding under bridges: the liquid, evident stretches.' },
    { id: 'street_vermilion', label: 'Vermilion Stepped Streets', color: '#C2492D', glow: '#D97A3E',
      matter: 'solid', visibility: 'evident', stretch: 'dry', paperFixable: true, key: '2',
      detail: 'Planless stone steps, cambered bridges and hanging streets: solid, evident.' },
    { id: 'rooftop_violet', label: 'Violet Rooftop Leaps', color: '#7A3B8E', glow: '#B07CC6',
      matter: 'solid', visibility: 'clandestine', stretch: 'aerial', paperFixable: true, key: '3',
      detail: 'Discontinuous high leaps of cats, thieves and illicit lovers, ridgepole to balcony, along contorted gutters.' },
    { id: 'sewer_sepia', label: 'Sepia Sewers', color: '#5E4128', glow: '#8C6A48', shadow: '#191716',
      matter: 'liquid', visibility: 'hidden', stretch: 'hidden', paperFixable: true, key: '4',
      detail: 'Dark rat sewers; conspirators and smugglers peek from manholes with cheese wheels, contraband bales and gunpowder kegs.' }
  ];
  var INK_BY_ID = {};
  INK_STRATA.forEach(function (ink) { INK_BY_ID[ink.id] = ink; });
  var INK_IDS = INK_STRATA.map(function (ink) { return ink.id; });

  var CITY_LOCI = [
    { id: 'L0', name: 'Fondaco Water-Stair', u: 0.13, v: 0.62, z: 0, kind: 'canal_quay', pinnacle: false },
    { id: 'L1', name: 'Cambered Bridge of Scales', u: 0.25, v: 0.48, z: 5, kind: 'cambered_bridge', pinnacle: false },
    { id: 'L2', name: 'Cheese-Smuggler Manhole', u: 0.22, v: 0.76, z: -5, kind: 'sewer_manhole', cargo: 'wheels_of_cheese', pinnacle: false },
    { id: 'L3', name: 'Salt-Guild Pinnacle', u: 0.31, v: 0.24, z: 28, kind: 'pinnacle_spire', pinnacle: true },
    { id: 'L4', name: 'Cat-Gutter Ridgepole', u: 0.39, v: 0.36, z: 16, kind: 'cat_gutter', pinnacle: false },
    { id: 'L5', name: 'Emerald Basin Crossroads', u: 0.44, v: 0.57, z: 0, kind: 'canal_junction', pinnacle: false },
    { id: 'L6', name: 'Gunpowder-Keg Grate', u: 0.48, v: 0.80, z: -6, kind: 'sewer_manhole', cargo: 'gunpowder_kegs', pinnacle: false },
    { id: 'L7', name: 'Hanging Street of Dyers', u: 0.56, v: 0.44, z: 8, kind: 'hanging_street', pinnacle: false },
    { id: 'L8', name: 'Campanile of Swallows', u: 0.59, v: 0.20, z: 33, kind: 'pinnacle_spire', pinnacle: true },
    { id: 'L9', name: "Lovers' Wrought Balcony", u: 0.68, v: 0.34, z: 14, kind: 'lovers_balcony', pinnacle: false },
    { id: 'L10', name: 'Double-Arch Canal Lock', u: 0.69, v: 0.60, z: 0, kind: 'cambered_bridge', pinnacle: false },
    { id: 'L11', name: 'Customs Watch-Pinnacle', u: 0.82, v: 0.25, z: 30, kind: 'pinnacle_spire', pinnacle: true },
    { id: 'L12', name: 'Contraband Vault Manhole', u: 0.79, v: 0.77, z: -5, kind: 'sewer_manhole', cargo: 'contraband_bales', pinnacle: false },
    { id: 'L13', name: 'Seaward Stepped Mole', u: 0.88, v: 0.53, z: 3, kind: 'stepped_quay', pinnacle: false }
  ];
  var LOCUS_BY_ID = {};
  CITY_LOCI.forEach(function (n) { LOCUS_BY_ID[n.id] = n; });

  /* [a, b, kind, bend] grouped per ink; bend = lateral curvature of the drawn stroke */
  var RAW_SEGMENTS = {
    canal_emerald: [
      ['L0', 'L1', 'oar_canal', 0.10], ['L0', 'L5', 'oar_canal', -0.12], ['L1', 'L5', 'oar_canal', 0.08],
      ['L5', 'L10', 'oar_canal', 0.10], ['L10', 'L13', 'oar_canal', -0.10], ['L5', 'L7', 'skiff_cut', -0.14],
      ['L7', 'L10', 'skiff_cut', 0.12], ['L10', 'L12', 'oar_canal', -0.08], ['L12', 'L13', 'oar_canal', 0.10],
      ['L0', 'L2', 'skiff_cut', 0.16]
    ],
    street_vermilion: [
      ['L0', 'L1', 'stone_steps', -0.14], ['L1', 'L3', 'stone_steps', 0.12], ['L1', 'L4', 'cambered_bridge', -0.10],
      ['L3', 'L4', 'stone_steps', 0.10], ['L4', 'L7', 'hanging_street', 0.14], ['L7', 'L9', 'hanging_street', -0.12],
      ['L5', 'L7', 'cambered_bridge', 0.16], ['L7', 'L10', 'stone_steps', -0.16], ['L10', 'L13', 'cambered_bridge', 0.14],
      ['L9', 'L11', 'stone_steps', 0.10], ['L11', 'L13', 'stone_steps', -0.12], ['L1', 'L5', 'stone_steps', -0.12]
    ],
    rooftop_violet: [
      ['L3', 'L4', 'cat_gutter', -0.22], ['L4', 'L8', 'ridge_leap', 0.20], ['L8', 'L9', 'ridge_leap', -0.18],
      ['L9', 'L11', 'balcony_drop', -0.22], ['L4', 'L9', 'cat_gutter', 0.18], ['L1', 'L4', 'ridge_leap', 0.24],
      ['L7', 'L8', 'cat_gutter', 0.20], ['L11', 'L13', 'balcony_drop', 0.22], ['L3', 'L8', 'ridge_leap', -0.16]
    ],
    sewer_sepia: [
      ['L0', 'L2', 'rat_sewer', -0.18], ['L2', 'L5', 'rat_sewer', 0.14], ['L2', 'L6', 'rat_sewer', -0.10],
      ['L6', 'L12', 'rat_sewer', 0.12], ['L6', 'L10', 'rat_sewer', -0.14], ['L12', 'L13', 'rat_sewer', -0.16],
      ['L5', 'L6', 'rat_sewer', 0.18], ['L10', 'L12', 'rat_sewer', 0.16]
    ]
  };
  var ROUTE_SEGMENTS = [];
  INK_IDS.forEach(function (inkId) {
    var prefix = { canal_emerald: 'C', street_vermilion: 'S', rooftop_violet: 'R', sewer_sepia: 'W' }[inkId];
    RAW_SEGMENTS[inkId].forEach(function (s, i) {
      ROUTE_SEGMENTS.push({ id: prefix + i, a: s[0], b: s[1], ink: inkId, kind: s[2], bend: s[3] });
    });
  });
  var SEGMENT_BY_ID = {};
  ROUTE_SEGMENTS.forEach(function (s) { SEGMENT_BY_ID[s.id] = s; });

  function projectPoint(u, v, z, width, height, airspaceTilt) {
    var tilt = (typeof airspaceTilt === 'number' && isFinite(airspaceTilt)) ? airspaceTilt : 0.38;
    return { x: u * width, y: v * height - z * (0.45 + tilt * 1.15) };
  }

  function makeRng(seed) {
    var s = (seed >>> 0) || 0x9E3779B9;
    return function () {
      s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
      return (s >>> 0) / 4294967296;
    };
  }

  function buildAdjacency(activeSet) {
    var adj = {};
    CITY_LOCI.forEach(function (n) { adj[n.id] = []; });
    ROUTE_SEGMENTS.forEach(function (s) {
      if (!activeSet[s.ink]) return;
      adj[s.a].push({ seg: s, to: s.b });
      adj[s.b].push({ seg: s, to: s.a });
    });
    return adj;
  }

  var STORE_CAP = 6000;
  /* Exact count of loop-free (no repeated locus) itineraries; stores up to STORE_CAP of them. */
  function enumerateZigzags(activeSet, originId, destId) {
    var adj = buildAdjacency(activeSet);
    var out = { count: 0, paths: [] };
    if (!adj[originId] || !adj[destId] || originId === destId) return out;
    /* BFS hop distance: only itineraries within minHops+6 are kept as daily candidates (all are counted) */
    var dist = {}; dist[originId] = 0; var queue = [originId];
    while (queue.length) {
      var cur = queue.shift();
      adj[cur].forEach(function (e) { if (dist[e.to] === undefined) { dist[e.to] = dist[cur] + 1; queue.push(e.to); } });
    }
    if (dist[destId] === undefined) return out;
    out.minHops = dist[destId];
    var keepMax = out.minHops + 6;
    var onPath = {}; var stack = [];
    onPath[originId] = true;
    (function walk(node) {
      if (node === destId) {
        out.count++;
        if (stack.length <= keepMax && out.paths.length < STORE_CAP) out.paths.push(stack.slice());
        return;
      }
      var list = adj[node];
      for (var i = 0; i < list.length; i++) {
        var e = list[i];
        if (onPath[e.to]) continue;
        onPath[e.to] = true; stack.push(e.seg.id);
        walk(e.to);
        stack.pop(); onPath[e.to] = false;
      }
    })(originId);
    return out;
  }

  function pathInkSet(segIds) {
    var set = {};
    segIds.forEach(function (id) { set[SEGMENT_BY_ID[id].ink] = true; });
    return set;
  }

  /* ---------- Gesture-safe WebAudio: oar lap, stone steps, tin gutter / lute, manhole grate / keg thud ---------- */
  function createInkAudio(opts) {
    var ctx = null; var master = null; var muted = !!(opts && opts.muted);
    var unlocked = false;
    function AC() {
      try { return root.AudioContext || root.webkitAudioContext || null; } catch (e) { return null; }
    }
    function ensure() {
      if (ctx) return ctx;
      var Ctor = AC(); if (!Ctor) return null;
      try {
        ctx = new Ctor();
        master = ctx.createGain(); master.gain.value = muted ? 0 : 0.42;
        master.connect(ctx.destination);
      } catch (e) { ctx = null; master = null; }
      return ctx;
    }
    function live() { return !muted && unlocked && ensure() && master; }
    function tone(freq, t0, dur, type, peak, glideTo) {
      try {
        var o = ctx.createOscillator(); var g = ctx.createGain();
        o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t0);
        if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(peak || 0.2, t0 + Math.min(0.03, dur * 0.3));
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.05);
      } catch (e) { /* silent */ }
    }
    function noise(t0, dur, filterType, freq, q, peak) {
      try {
        var len = Math.max(1, Math.floor(ctx.sampleRate * dur));
        var buf = ctx.createBuffer(1, len, ctx.sampleRate); var d = buf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
        var src = ctx.createBufferSource(); src.buffer = buf;
        var f = ctx.createBiquadFilter(); f.type = filterType || 'bandpass';
        f.frequency.value = freq || 600; f.Q.value = q || 1;
        var g = ctx.createGain(); g.gain.setValueAtTime(peak || 0.25, t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        src.connect(f); f.connect(g); g.connect(master); src.start(t0); src.stop(t0 + dur + 0.05);
      } catch (e) { /* silent */ }
    }
    var VOICES = {
      canal_emerald: function (t) { /* oar dip and water lap */
        noise(t, 0.55, 'lowpass', 520, 0.8, 0.28); noise(t + 0.32, 0.45, 'bandpass', 380, 1.4, 0.16);
        tone(196, t, 0.7, 'sine', 0.08, 174);
      },
      street_vermilion: function (t) { /* three stone steps */
        for (var i = 0; i < 3; i++) { noise(t + i * 0.16, 0.09, 'bandpass', 1400 - i * 180, 3, 0.3); tone(220 - i * 18, t + i * 0.16, 0.12, 'triangle', 0.09); }
      },
      rooftop_violet: function (t) { /* tin gutter ping and lovers' lute */
        tone(1318, t, 0.35, 'square', 0.04, 1250); tone(587, t + 0.08, 0.9, 'triangle', 0.11);
        tone(740, t + 0.2, 0.8, 'triangle', 0.08); tone(880, t + 0.32, 0.7, 'triangle', 0.06);
      },
      sewer_sepia: function (t) { /* manhole grate scrape and gunpowder keg thud */
        noise(t, 0.4, 'highpass', 2400, 0.7, 0.12); tone(72, t + 0.18, 0.5, 'sine', 0.32, 44);
        noise(t + 0.18, 0.25, 'lowpass', 180, 1, 0.3);
      }
    };
    var api = {
      unlock: function () {
        try {
          unlocked = true; var c = ensure();
          if (c && c.state === 'suspended' && c.resume) c.resume();
        } catch (e) { /* silent */ }
        return unlocked;
      },
      setMuted: function (flag) {
        muted = !!flag;
        try { if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : 0.42, ctx.currentTime, 0.05); } catch (e) { /* silent */ }
        return muted;
      },
      toggleMute: function () { return api.setMuted(!muted); },
      isMuted: function () { return muted; },
      playInkDip: function (inkId) {
        if (!live()) return false;
        try { var t = ctx.currentTime + 0.01; (VOICES[inkId] || VOICES.canal_emerald)(t); } catch (e) { return false; }
        return true;
      },
      playStratumCue: function (kind) {
        if (!live()) return false;
        try {
          var t = ctx.currentTime + 0.01;
          if (kind === 'sewer_manhole') VOICES.sewer_sepia(t);
          else if (kind === 'lovers_balcony' || kind === 'cat_gutter' || kind === 'pinnacle_spire') VOICES.rooftop_violet(t);
          else if (kind === 'canal_quay' || kind === 'canal_junction') VOICES.canal_emerald(t);
          else VOICES.street_vermilion(t);
        } catch (e) { return false; }
        return true;
      },
      playItineraryChord: function (inkSequence) {
        if (!live()) return false;
        try {
          var t = ctx.currentTime + 0.01;
          var seq = (inkSequence && inkSequence.length) ? inkSequence.slice(0, 6) : INK_IDS;
          var roots = { canal_emerald: 261.6, street_vermilion: 329.6, rooftop_violet: 392.0, sewer_sepia: 196.0 };
          seq.forEach(function (ink, i) { tone(roots[ink] || 261.6, t + i * 0.11, 1.1, 'triangle', 0.07); });
          tone(130.8, t, 1.6, 'sine', 0.06);
        } catch (e) { return false; }
        return true;
      }
    };
    return api;
  }

  /* ---------- Navigator: the daily non-repeating combinatorial zigzag ---------- */
  var FOCUS_BY_KIND = {
    sewer_manhole: 'manhole_smuggler_peek', lovers_balcony: 'balcony_lovers', cambered_bridge: 'bridge_focus',
    hanging_street: 'bridge_focus', cat_gutter: 'cat_gutter_prowl', pinnacle_spire: 'pinnacle_ridge',
    canal_quay: 'skiff_mooring', canal_junction: 'skiff_mooring', stepped_quay: 'stone_steps'
  };

  function createZigzagNavigator(opts) {
    opts = opts || {};
    var audio = createInkAudio(opts);
    var S = {};

    function activeList() { return INK_IDS.filter(function (id) { return S.active[id]; }); }
    function enumeration() {
      var key = activeList().join(',') + '|' + S.originId + '>' + S.destId;
      if (!S.cache || S.cache.key !== key) {
        var r = enumerateZigzags(S.active, S.originId, S.destId);
        S.cache = { key: key, count: r.count, paths: r.paths, minHops: r.minHops };
      }
      return S.cache;
    }
    function signatureOf(segIds) { return S.originId + ':' + segIds.join('-'); }
    function describe(segIds) {
      var node = S.originId; var nodes = [node]; var segs = []; var inkSeq = [];
      var counts = { canal_emerald: 0, street_vermilion: 0, rooftop_violet: 0, sewer_sepia: 0, liquid: 0, dry: 0, aerial: 0, hidden: 0 };
      segIds.forEach(function (id) {
        var s = SEGMENT_BY_ID[id]; var to = s.a === node ? s.b : s.a;
        segs.push({ id: id, ink: s.ink, kind: s.kind, from: node, to: to, bend: s.a === node ? s.bend : -s.bend });
        counts[s.ink]++; counts[INK_BY_ID[s.ink].stretch]++;
        if (inkSeq[inkSeq.length - 1] !== s.ink) inkSeq.push(s.ink);
        node = to; nodes.push(node);
      });
      var inkSet = pathInkSet(segIds);
      return {
        signature: signatureOf(segIds), day: S.dayNumber, originId: S.originId, destId: S.destId,
        segments: segs, nodes: nodes, hops: segs.length, inkSequence: inkSeq,
        inkCount: Object.keys(inkSet).length, inks: Object.keys(inkSet), stretchCounts: counts
      };
    }
    function plot(mode) {
      var en = enumeration();
      if (!en.paths.length) { S.currentZigzag = null; S.travelT = 0; return null; }
      var activeCount = activeList().length;
      var minHops = typeof en.minHops === 'number' ? en.minHops : Infinity;
      if (!isFinite(minHops)) en.paths.forEach(function (p) { if (p.length < minHops) minHops = p.length; });
      var fresh = en.paths.filter(function (p) { return !S.visited[signatureOf(p)]; });
      var pool = fresh;
      function narrow(pred) { var f = pool.filter(pred); if (f.length) pool = f; }
      if (mode === 'liquid' || mode === 'dry' || mode === 'aerial' || mode === 'hidden') {
        narrow(function (p) { return p.some(function (id) { return INK_BY_ID[SEGMENT_BY_ID[id].ink].stretch === mode; }); });
      }
      if (mode !== 'any') {
        var need = Math.min(activeCount, mode === 'mixed' ? 3 : 2);
        narrow(function (p) { return Object.keys(pathInkSet(p)).length >= need; });
        narrow(function (p) { return p.length > minHops && p.length <= minHops + 3; }); /* neither shortest line nor endless */
      }
      var repeated = false;
      if (!pool.length) { pool = en.paths; repeated = true; }
      var chosen = pool[Math.floor(S.rng() * pool.length) % pool.length];
      var sig = signatureOf(chosen);
      if (repeated || S.visited[sig]) S.repeatedItinerariesCount++;
      else { S.visited[sig] = true; S.visitedCount++; S.uniqueZigzagsGenerated++; }
      S.currentZigzag = describe(chosen);
      S.travelT = S.reducedMotion ? S.currentZigzag.hops : 0;
      return S.currentZigzag;
    }
    function zigzagUsesInactive() {
      if (!S.currentZigzag) return true;
      if (S.currentZigzag.originId !== S.originId || S.currentZigzag.destId !== S.destId) return true;
      return S.currentZigzag.inks.some(function (id) { return !S.active[id]; });
    }

    function init() {
      S.rng = makeRng(typeof opts.seed === 'number' ? opts.seed : 31031);
      S.dayNumber = 1; S.active = {};
      INK_IDS.forEach(function (id) { S.active[id] = true; });
      S.originId = LOCUS_BY_ID[opts.originId] ? opts.originId : 'L0';
      S.destId = LOCUS_BY_ID[opts.destId] && opts.destId !== S.originId ? opts.destId : 'L13';
      S.visited = {}; S.visitedCount = 0; S.uniqueZigzagsGenerated = 0; S.repeatedItinerariesCount = 0;
      S.cache = null; S.inspectedLocus = null; S.peek = 0; S.dipFlash = {}; S.time = 0;
      S.reducedMotion = !!(S.reducedMotion || opts.reducedMotion);
      S.lastMode = 'mixed';
      plot('mixed');
    }

    function getState() {
      var en = enumeration(); var list = activeList();
      var z = S.currentZigzag;
      var counts = z ? Object.assign({}, z.stretchCounts) : { canal_emerald: 0, street_vermilion: 0, rooftop_violet: 0, sewer_sepia: 0, liquid: 0, dry: 0, aerial: 0, hidden: 0 };
      return {
        dayNumber: S.dayNumber, activeInks: list.slice(), activeInkCount: list.length,
        terrestrialFixedInkCount: INK_STRATA.filter(function (i) { return i.paperFixable; }).length,
        terrestrialPaperFixability: 1.0,
        combinatorialRouteCount: en.count,
        uniqueZigzagsGenerated: S.uniqueZigzagsGenerated, repeatedItinerariesCount: S.repeatedItinerariesCount,
        remainingFreshZigzags: Math.max(0, en.count - S.visitedCount),
        boredomIndex: list.length >= 2 ? 0 : 0.45,
        originId: S.originId, destId: S.destId,
        currentZigzag: z ? JSON.parse(JSON.stringify(z)) : null,
        stretchCounts: counts,
        inspectedLocus: S.inspectedLocus ? Object.assign({}, S.inspectedLocus) : null,
        muted: audio.isMuted(), reducedMotion: S.reducedMotion,
        renderError: S.lastRenderError || null
      };
    }

    function afterInkChange(inkId) {
      S.cache = null;
      if (zigzagUsesInactive()) plot(S.lastMode);
      S.dipFlash[inkId || 'all'] = 1;
      audio.playInkDip(inkId || 'canal_emerald');
      return getState();
    }

    var api = {
      audio: audio,
      INK_STRATA: INK_STRATA, CITY_LOCI: CITY_LOCI, ROUTE_SEGMENTS: ROUTE_SEGMENTS,
      nextDailyZigzag: function (mode) {
        mode = mode || 'mixed'; S.lastMode = mode;
        S.dayNumber++;
        var z = plot(mode);
        audio.playItineraryChord(z ? z.inkSequence : null);
        return getState();
      },
      toggleInkStratum: function (id) {
        if (!INK_BY_ID[id]) return getState();
        return api.setInkActive(id, !S.active[id]);
      },
      setInkActive: function (id, flag) {
        if (!INK_BY_ID[id]) return getState();
        flag = !!flag;
        if (!flag && S.active[id] && activeList().length <= 1) return getState(); /* keep at least one ink wet */
        S.active[id] = flag;
        return afterInkChange(id);
      },
      dipAllFourInks: function () {
        INK_IDS.forEach(function (id) { S.active[id] = true; S.dipFlash[id] = 1; });
        S.cache = null;
        if (zigzagUsesInactive()) plot(S.lastMode);
        audio.playItineraryChord(INK_IDS);
        return getState();
      },
      setEndpoints: function (originId, destId) {
        if (!LOCUS_BY_ID[originId] || !LOCUS_BY_ID[destId] || originId === destId) return getState();
        S.originId = originId; S.destId = destId; S.cache = null;
        plot(S.lastMode);
        return getState();
      },
      selectNode: function (nodeId) {
        var n = LOCUS_BY_ID[nodeId];
        if (!n) { S.inspectedLocus = null; return getState(); }
        var inks = {};
        ROUTE_SEGMENTS.forEach(function (s) { if (s.a === nodeId || s.b === nodeId) inks[s.ink] = true; });
        S.inspectedLocus = {
          id: n.id, name: n.name, kind: n.kind, cargo: n.cargo || null, z: n.z, pinnacle: n.pinnacle,
          focus: FOCUS_BY_KIND[n.kind] || 'stone_steps', incidentInks: Object.keys(inks),
          onCurrentZigzag: !!(S.currentZigzag && S.currentZigzag.nodes.indexOf(n.id) >= 0)
        };
        S.peek = 1;
        audio.playStratumCue(n.kind);
        return getState();
      },
      hitTest: function (normX, normY, width, height, airspaceTilt) {
        width = width || 1; height = height || 1;
        var px = normX * width, py = normY * height;
        var radius = Math.max(16, Math.min(width, height) * 0.045);
        var best = null, bestD = Infinity;
        CITY_LOCI.forEach(function (n) {
          var p = projectPoint(n.u, n.v, n.z, width, height, airspaceTilt);
          var d = Math.hypot(p.x - px, p.y - py);
          if (d < bestD) { bestD = d; best = n.id; }
        });
        return bestD <= radius ? best : null;
      },
      step: function (dtSec) {
        var dt = Math.max(0, Math.min(0.25, +dtSec || 0));
        var z = S.currentZigzag;
        if (S.reducedMotion) {
          if (z) S.travelT = z.hops;
          S.peek = S.peek > 0 ? 0.6 : 0; S.dipFlash = {};
          return;
        }
        S.time += dt;
        if (z) { S.travelT += dt * 0.55; if (S.travelT > z.hops + 1.2) S.travelT = 0; }
        S.peek = Math.max(0, S.peek - dt * 0.12);
        Object.keys(S.dipFlash).forEach(function (k) { S.dipFlash[k] = Math.max(0, S.dipFlash[k] - dt * 1.4); });
      },
      reset: function () { init(); return getState(); },
      setReducedMotion: function (flag) { S.reducedMotion = !!flag; if (S.reducedMotion && S.currentZigzag) S.travelT = S.currentZigzag.hops; return getState(); },
      getState: getState,
      renderMultiInkStrata: function (ctx, width, height, viewOpts) { renderStrata(ctx, width, height, viewOpts || {}, S); }
    };
    init();
    return api;
  }

  /* ---------- Canvas renderer: four inks on vellum over the lagoon ---------- */
  function segGeom(seg, from, to, w, h, tilt) {
    var a = LOCUS_BY_ID[from], b = LOCUS_BY_ID[to];
    var p0 = projectPoint(a.u, a.v, a.z, w, h, tilt), p2 = projectPoint(b.u, b.v, b.z, w, h, tilt);
    var dx = p2.x - p0.x, dy = p2.y - p0.y, len = Math.hypot(dx, dy) || 1;
    var bend = (seg.a === from ? seg.bend : -seg.bend);
    var c = { x: (p0.x + p2.x) / 2 - dy / len * bend * len, y: (p0.y + p2.y) / 2 + dx / len * bend * len };
    return { p0: p0, c: c, p2: p2 };
  }
  function qpt(g, t) {
    var m = 1 - t;
    return { x: m * m * g.p0.x + 2 * m * t * g.c.x + t * t * g.p2.x, y: m * m * g.p0.y + 2 * m * t * g.c.y + t * t * g.p2.y };
  }
  function strokeQ(ctx, g) { ctx.beginPath(); ctx.moveTo(g.p0.x, g.p0.y); ctx.quadraticCurveTo(g.c.x, g.c.y, g.p2.x, g.p2.y); ctx.stroke(); }

  function renderStrata(ctx, w, h, view, S) {
    if (!ctx || !w || !h) return;
    var tilt = typeof view.airspaceTilt === 'number' ? view.airspaceTilt : 0.38;
    var t = S.time, k = Math.max(0.6, Math.min(w, h) / 700);
    ctx.save();
    try {
      /* ground: vellum folio with abyssal lagoon along the seaward edge */
      ctx.fillStyle = PALETTE.vellum; ctx.fillRect(0, 0, w, h);
      var lg = ctx.createLinearGradient(w * 0.86, 0, w, 0);
      lg.addColorStop(0, 'rgba(14,24,24,0)'); lg.addColorStop(1, 'rgba(14,24,24,0.85)');
      ctx.fillStyle = lg; ctx.fillRect(w * 0.86, 0, w * 0.14, h);
      ctx.fillStyle = 'rgba(14,24,24,0.55)'; ctx.fillRect(0, h * 0.93, w, h * 0.07);
      /* terracotta blocks, deterministic */
      var br = makeRng(3131);
      for (var i = 0; i < 70; i++) {
        var bu = 0.06 + br() * 0.86, bv = 0.12 + br() * 0.76, bz = 2 + br() * 10;
        var near = CITY_LOCI.some(function (n) { return Math.abs(n.u - bu) < 0.035 && Math.abs(n.v - bv) < 0.05; });
        if (near) continue;
        var bp = projectPoint(bu, bv, bz, w, h, tilt), bw = (10 + br() * 18) * k, bh = (8 + br() * 12) * k;
        ctx.fillStyle = 'rgba(194,73,45,0.18)'; ctx.fillRect(bp.x - bw / 2, bp.y - bh / 2, bw, bh);
        ctx.fillStyle = 'rgba(217,122,62,0.28)';
        ctx.beginPath(); ctx.moveTo(bp.x - bw / 2, bp.y - bh / 2); ctx.lineTo(bp.x, bp.y - bh / 2 - 5 * k); ctx.lineTo(bp.x + bw / 2, bp.y - bh / 2); ctx.fill();
      }
      /* four ink networks */
      var order = ['sewer_sepia', 'canal_emerald', 'street_vermilion', 'rooftop_violet'];
      order.forEach(function (inkId) {
        var on = !!S.active[inkId], flash = S.dipFlash[inkId] || 0, ink = INK_BY_ID[inkId];
        ctx.globalAlpha = on ? (view.highlightInk && view.highlightInk !== inkId ? 0.35 : 0.9) : 0.07;
        ROUTE_SEGMENTS.forEach(function (s) {
          if (s.ink !== inkId) return;
          var g = segGeom(s, s.a, s.b, w, h, tilt);
          ctx.setLineDash([]); ctx.lineCap = 'round';
          if (inkId === 'canal_emerald') {
            ctx.strokeStyle = ink.color; ctx.lineWidth = (7 + flash * 4) * k; strokeQ(ctx, g);
            ctx.strokeStyle = PALETTE.emeraldWake; ctx.lineWidth = 1.2 * k; ctx.setLineDash([6 * k, 9 * k]);
            ctx.lineDashOffset = -t * 18; strokeQ(ctx, g);
          } else if (inkId === 'street_vermilion') {
            ctx.strokeStyle = ink.color; ctx.lineWidth = (3.2 + flash * 3) * k; strokeQ(ctx, g);
            ctx.strokeStyle = PALETTE.ochre; ctx.lineWidth = 1 * k;
            for (var q = 0.1; q < 0.95; q += 0.12) { var sp = qpt(g, q); ctx.beginPath(); ctx.moveTo(sp.x - 3 * k, sp.y - 3 * k); ctx.lineTo(sp.x + 3 * k, sp.y + 3 * k); ctx.stroke(); }
            if (s.kind === 'cambered_bridge' || s.kind === 'hanging_street') {
              var m = qpt(g, 0.5); ctx.strokeStyle = PALETTE.ironGall; ctx.lineWidth = 1.4 * k;
              ctx.beginPath(); ctx.arc(m.x, m.y + 4 * k, 7 * k, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
            }
          } else if (inkId === 'rooftop_violet') {
            ctx.strokeStyle = ink.color; ctx.lineWidth = (2.6 + flash * 3) * k; ctx.setLineDash([10 * k, 7 * k]); strokeQ(ctx, g);
          } else {
            ctx.strokeStyle = PALETTE.lampblack; ctx.lineWidth = (6 + flash * 3) * k; ctx.globalAlpha *= 0.5; strokeQ(ctx, g);
            ctx.globalAlpha = on ? 0.9 : 0.07; ctx.strokeStyle = ink.color; ctx.lineWidth = 2.4 * k; ctx.setLineDash([2 * k, 5 * k]); strokeQ(ctx, g);
            if (on) { var rp = qpt(g, (t * 0.25 + s.bend * 3 + 1) % 1); ctx.fillStyle = PALETTE.lampblack; ctx.beginPath(); ctx.ellipse(rp.x, rp.y, 3 * k, 1.8 * k, 0, 0, Math.PI * 2); ctx.fill(); }
          }
        });
      });
      ctx.globalAlpha = 1; ctx.setLineDash([]);
      /* skiffs on canals, cats on gutters */
      ROUTE_SEGMENTS.forEach(function (s, idx) {
        if (!S.active[s.ink]) return;
        var g = segGeom(s, s.a, s.b, w, h, tilt), ph = (t * 0.08 + idx * 0.37) % 1;
        if (s.ink === 'canal_emerald' && idx % 2 === 0) {
          var sk = qpt(g, ph), sk2 = qpt(g, Math.min(1, ph + 0.02)), ang = Math.atan2(sk2.y - sk.y, sk2.x - sk.x);
          ctx.save(); ctx.translate(sk.x, sk.y); ctx.rotate(ang); ctx.fillStyle = PALETTE.ironGall;
          ctx.beginPath(); ctx.moveTo(-8 * k, 0); ctx.quadraticCurveTo(0, 5 * k, 8 * k, 0); ctx.lineTo(-8 * k, 0); ctx.fill();
          ctx.strokeStyle = PALETTE.ochre; ctx.lineWidth = k; ctx.beginPath(); ctx.moveTo(2 * k, 0); ctx.lineTo(-4 * k, -7 * k); ctx.stroke(); ctx.restore();
        } else if (s.kind === 'cat_gutter') {
          var cp = qpt(g, 0.5 + 0.35 * Math.sin(t * 0.5 + idx)); ctx.fillStyle = PALETTE.lampblack;
          ctx.beginPath(); ctx.ellipse(cp.x, cp.y - 3 * k, 5 * k, 2.6 * k, 0, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(cp.x + 5 * k, cp.y - 5 * k, 2.2 * k, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.moveTo(cp.x + 4 * k, cp.y - 7 * k); ctx.lineTo(cp.x + 4.6 * k, cp.y - 9 * k); ctx.lineTo(cp.x + 5.6 * k, cp.y - 7 * k); ctx.fill();
          ctx.strokeStyle = PALETTE.lampblack; ctx.lineWidth = k; ctx.beginPath(); ctx.moveTo(cp.x - 5 * k, cp.y - 3 * k); ctx.quadraticCurveTo(cp.x - 9 * k, cp.y - 9 * k, cp.x - 7 * k, cp.y - 11 * k); ctx.stroke();
        }
      });
      drawLoci(ctx, w, h, tilt, k, S, view);
      drawZigzag(ctx, w, h, tilt, k, S);
    } catch (e) { S.lastRenderError = String(e && e.message || e); /* never let a frame throw */ }
    ctx.restore();
  }

  function drawCargo(ctx, cargo, x, y, k) {
    if (cargo === 'wheels_of_cheese') {
      ctx.fillStyle = PALETTE.gold; ctx.beginPath(); ctx.arc(x, y, 5 * k, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = PALETTE.filament; ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, 5 * k, -0.4, 0.4); ctx.fill();
      ctx.strokeStyle = PALETTE.sepia; ctx.lineWidth = 0.8 * k; ctx.beginPath(); ctx.arc(x, y, 5 * k, 0, Math.PI * 2); ctx.stroke();
    } else if (cargo === 'gunpowder_kegs') {
      ctx.fillStyle = PALETTE.sepia; ctx.beginPath(); ctx.ellipse(x, y, 4.4 * k, 6 * k, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = PALETTE.lampblack; ctx.lineWidth = 1.1 * k;
      ctx.beginPath(); ctx.moveTo(x - 4.2 * k, y - 2.5 * k); ctx.lineTo(x + 4.2 * k, y - 2.5 * k); ctx.moveTo(x - 4.2 * k, y + 2.5 * k); ctx.lineTo(x + 4.2 * k, y + 2.5 * k); ctx.stroke();
      ctx.fillStyle = PALETTE.terracotta; ctx.fillRect(x - 0.8 * k, y - 8.5 * k, 1.6 * k, 2.6 * k);
    } else {
      ctx.fillStyle = '#8C6A48'; ctx.fillRect(x - 5 * k, y - 4 * k, 10 * k, 8 * k);
      ctx.strokeStyle = PALETTE.lampblack; ctx.lineWidth = 0.9 * k;
      ctx.beginPath(); ctx.moveTo(x - 5 * k, y - 4 * k); ctx.lineTo(x + 5 * k, y + 4 * k); ctx.moveTo(x + 5 * k, y - 4 * k); ctx.lineTo(x - 5 * k, y + 4 * k); ctx.stroke();
    }
  }

  function drawLoci(ctx, w, h, tilt, k, S, view) {
    var insp = S.inspectedLocus ? S.inspectedLocus.id : null, t = S.time;
    CITY_LOCI.forEach(function (n, idx) {
      var p = projectPoint(n.u, n.v, n.z, w, h, tilt), base = projectPoint(n.u, n.v, 0, w, h, tilt);
      var focused = insp === n.id, lift = focused ? S.peek : 0;
      if (n.z > 0) { ctx.strokeStyle = 'rgba(34,30,27,0.25)'; ctx.lineWidth = k; ctx.setLineDash([2 * k, 3 * k]); ctx.beginPath(); ctx.moveTo(base.x, base.y); ctx.lineTo(p.x, p.y); ctx.stroke(); ctx.setLineDash([]); }
      ctx.fillStyle = PALETTE.ironGall; ctx.strokeStyle = PALETTE.ironGall; ctx.lineWidth = 1.4 * k;
      if (n.kind === 'pinnacle_spire') {
        ctx.fillStyle = PALETTE.terracotta; ctx.beginPath(); ctx.moveTo(p.x, p.y - 18 * k); ctx.lineTo(p.x - 5 * k, p.y + 4 * k); ctx.lineTo(p.x + 5 * k, p.y + 4 * k); ctx.fill(); ctx.stroke();
      } else if (n.kind === 'sewer_manhole') {
        ctx.fillStyle = PALETTE.lampblack; ctx.beginPath(); ctx.ellipse(p.x, p.y, 9 * k, 4.5 * k, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = PALETTE.sepia; ctx.beginPath(); ctx.moveTo(p.x - 7 * k, p.y); ctx.lineTo(p.x + 7 * k, p.y); ctx.moveTo(p.x, p.y - 4 * k); ctx.lineTo(p.x, p.y + 4 * k); ctx.stroke();
        /* conspirator / smuggler peeking from the manhole with cargo */
        var rise = (S.active.sewer_sepia ? 3 : 0) + lift * 10 + Math.max(0, Math.sin(t * 0.9 + idx)) * 2;
        if (rise > 0.5) {
          ctx.fillStyle = PALETTE.sepia; ctx.beginPath(); ctx.arc(p.x - 2 * k, p.y - rise * k, 4 * k, Math.PI, 0); ctx.fill();
          ctx.fillStyle = PALETTE.lampblack; ctx.fillRect(p.x - 7 * k, p.y - (rise + 3) * k, 10 * k, 1.6 * k);
          ctx.fillStyle = PALETTE.filament; ctx.fillRect(p.x - 3.5 * k, p.y - (rise - 1) * k, 1.2 * k, 1.2 * k); ctx.fillRect(p.x - 0.5 * k, p.y - (rise - 1) * k, 1.2 * k, 1.2 * k);
          drawCargo(ctx, n.cargo, p.x + 10 * k, p.y - (rise * 0.6 + 3) * k, k);
        }
      } else if (n.kind === 'lovers_balcony') {
        ctx.strokeStyle = PALETTE.ironGall; ctx.beginPath(); ctx.moveTo(p.x - 10 * k, p.y + 3 * k); ctx.lineTo(p.x + 10 * k, p.y + 3 * k); ctx.stroke();
        for (var b = -9; b <= 9; b += 3) { ctx.beginPath(); ctx.moveTo(p.x + b * k, p.y + 3 * k); ctx.lineTo(p.x + b * k, p.y - 2 * k); ctx.stroke(); }
        var lean = Math.sin(t * 0.7) * 1.2 + lift * 2;
        ctx.fillStyle = PALETTE.violet; ctx.beginPath(); ctx.arc(p.x - 3.5 * k + lean * k * 0.5, p.y - 9 * k, 2.5 * k, 0, Math.PI * 2); ctx.arc(p.x + 3.5 * k - lean * k * 0.5, p.y - 9 * k, 2.5 * k, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(p.x - 5.5 * k, p.y - 7 * k, 3.6 * k, 7 * k); ctx.fillRect(p.x + 1.9 * k, p.y - 7 * k, 3.6 * k, 7 * k);
        ctx.fillStyle = PALETTE.terracotta; ctx.beginPath(); ctx.arc(p.x - 1 * k, p.y - 15 * k, 1.5 * k, 0, Math.PI * 2); ctx.arc(p.x + 1 * k, p.y - 15 * k, 1.5 * k, 0, Math.PI * 2); ctx.fill();
      } else if (n.kind === 'cambered_bridge') {
        ctx.strokeStyle = PALETTE.terracotta; ctx.lineWidth = 3 * k; ctx.beginPath(); ctx.arc(p.x, p.y + 8 * k, 11 * k, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
      } else if (n.kind === 'hanging_street') {
        ctx.strokeStyle = PALETTE.ironGall; ctx.beginPath(); ctx.moveTo(p.x - 11 * k, p.y - 9 * k); ctx.lineTo(p.x - 9 * k, p.y); ctx.moveTo(p.x + 11 * k, p.y - 9 * k); ctx.lineTo(p.x + 9 * k, p.y); ctx.stroke();
        ctx.fillStyle = PALETTE.ochre; ctx.fillRect(p.x - 11 * k, p.y - 1.5 * k, 22 * k, 3 * k);
      } else if (n.kind === 'cat_gutter') {
        ctx.strokeStyle = PALETTE.ironGall; ctx.beginPath(); ctx.moveTo(p.x - 11 * k, p.y + 4 * k); ctx.lineTo(p.x, p.y - 6 * k); ctx.lineTo(p.x + 11 * k, p.y + 4 * k); ctx.stroke();
        ctx.strokeStyle = '#9A9A92'; ctx.beginPath(); ctx.moveTo(p.x - 11 * k, p.y + 6 * k); ctx.bezierCurveTo(p.x - 4 * k, p.y + 10 * k, p.x + 4 * k, p.y + 2 * k, p.x + 11 * k, p.y + 6 * k); ctx.stroke();
      } else {
        ctx.fillStyle = PALETTE.terracotta;
        for (var st = 0; st < 3; st++) ctx.fillRect(p.x - (8 - st * 2) * k, p.y + (2 - st * 3) * k, (16 - st * 4) * k, 2.6 * k);
      }
      if (focused) {
        ctx.strokeStyle = PALETTE.gold; ctx.lineWidth = 2 * k; ctx.beginPath(); ctx.arc(p.x, p.y - 2 * k, 16 * k + Math.sin(t * 3) * 2 * k, 0, Math.PI * 2); ctx.stroke();
      }
      if (view.showLabels !== false) {
        ctx.font = (focused ? 'bold ' : '') + Math.round(10 * k) + 'px Georgia, serif'; ctx.textAlign = 'center';
        ctx.fillStyle = PALETTE.ironGall; ctx.fillText(focused ? n.id + ' ' + n.name : n.id, p.x, p.y + 17 * k);
      }
    });
  }

  function drawZigzag(ctx, w, h, tilt, k, S) {
    var z = S.currentZigzag; if (!z) return;
    var pulse = 0.6 + 0.4 * Math.sin(S.time * 2.4);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    z.segments.forEach(function (sg) {
      var g = segGeom(SEGMENT_BY_ID[sg.id], sg.from, sg.to, w, h, tilt);
      ctx.globalAlpha = 0.35 * pulse; ctx.strokeStyle = PALETTE.filament; ctx.lineWidth = 12 * k; strokeQ(ctx, g);
      ctx.globalAlpha = 1; ctx.strokeStyle = INK_BY_ID[sg.ink].glow; ctx.lineWidth = 4 * k; strokeQ(ctx, g);
    });
    z.nodes.forEach(function (id, i) {
      var n = LOCUS_BY_ID[id], p = projectPoint(n.u, n.v, n.z, w, h, tilt);
      ctx.fillStyle = PALETTE.gold; ctx.strokeStyle = PALETTE.ironGall; ctx.lineWidth = 1.2 * k;
      ctx.beginPath(); ctx.arc(p.x + 11 * k, p.y - 11 * k, 7 * k, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = PALETTE.ironGall; ctx.font = 'bold ' + Math.round(9 * k) + 'px Georgia, serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(String(i), p.x + 11 * k, p.y - 11 * k); ctx.textBaseline = 'alphabetic';
    });
    var tt = Math.min(z.hops - 1e-6, Math.max(0, S.travelT)), si = Math.floor(tt), sg = z.segments[si];
    if (!sg) return;
    var tp = qpt(segGeom(SEGMENT_BY_ID[sg.id], sg.from, sg.to, w, h, tilt), tt - si);
    ctx.globalAlpha = 0.5; ctx.fillStyle = PALETTE.filament; ctx.beginPath(); ctx.arc(tp.x, tp.y, 11 * k, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1; ctx.fillStyle = INK_BY_ID[sg.ink].color; ctx.strokeStyle = PALETTE.vellum; ctx.lineWidth = 2 * k;
    ctx.beginPath(); ctx.arc(tp.x, tp.y, 5.5 * k, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }

  var EsmeraldaMultiInkZigzags = {
    PALETTE: PALETTE, INK_STRATA: INK_STRATA, CITY_LOCI: CITY_LOCI, ROUTE_SEGMENTS: ROUTE_SEGMENTS,
    projectPoint: projectPoint, enumerateZigzags: enumerateZigzags, createInkAudio: createInkAudio,
    createZigzagNavigator: createZigzagNavigator
  };
  root.EsmeraldaMultiInkZigzags = EsmeraldaMultiInkZigzags;
  if (typeof module !== 'undefined' && module.exports) module.exports = EsmeraldaMultiInkZigzags;
})(typeof globalThis !== 'undefined' ? globalThis : this);
