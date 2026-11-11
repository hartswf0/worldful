(function (root) {
  'use strict';

  var CELL_SIZE = 160;

  var PALETTE = Object.freeze({
    broth_ground: '#e6e0d2',
    chalk_haze: '#efeae0',
    cabbage_dust: '#7b8c72',
    zinc_shed: '#8d9699',
    wheel_rust: '#9c4f35',
    toll_ochre: '#b58d47',
    cinder_ink: '#262421',
    plaster_tooth: '#cfc6b4'
  });

  var CANONICAL_STONES = Object.freeze([
    Object.freeze({
      id: 'low_backs_turned',
      label: 'Low buildings with backs turned',
      detail: 'Shallow plaster structures facing away from the chalk road, exposing blank rear walls and drainpipes.'
    }),
    Object.freeze({
      id: 'plank_fences',
      label: 'Plank fences',
      detail: 'Weather-bleached uneven timber palings bordering dusty lots that neither enclose nor exclude.'
    }),
    Object.freeze({
      id: 'corrugated_iron_sheds',
      label: 'Corrugated-iron sheds',
      detail: 'Ribbed zinc lean-tos and storage sheds rattling faintly in the flat plain wind.'
    }),
    Object.freeze({
      id: 'cabbage_patches',
      label: 'Patches of cabbages',
      detail: 'Dusty pale-jade cabbage rows planted in chalky soil directly between warehouses and fences.'
    }),
    Object.freeze({
      id: 'cemeteries',
      label: 'Cemeteries',
      detail: 'Scattered burial plots of tilted limestone markers and dry weeds recurring hours apart.'
    }),
    Object.freeze({
      id: 'snaggle_toothed_walls',
      label: 'Snaggle-toothed walls',
      detail: 'Shallow facades, very tall beside very low like a snaggle-toothed comb, falsely promising a thickening center.'
    }),
    Object.freeze({
      id: 'rusty_carnival_wheel',
      label: 'Rusty carnival wheel',
      detail: 'Skeletal oxidized Ferris wheel and low-hanging fairground frame stranded in an empty gravel lot.'
    }),
    Object.freeze({
      id: 'tollbooths',
      label: 'Stray tollbooths',
      detail: 'Isolated booths with peeling striped arms standing across tracks where no city wall or gate exists.'
    }),
    Object.freeze({
      id: 'workshops',
      label: 'Workshops',
      detail: 'Vulcanizers, scrap-metal sheds, oil drums, and intermittent weld sparks along unnamed crossroads.'
    }),
    Object.freeze({
      id: 'shambles',
      label: 'Shambles',
      detail: 'Bleached concrete market shambles with iron hooks and shallow runnels at the edge of vacant lots.'
    })
  ]);

  var STONE_BY_ID = Object.create(null);
  var STONE_IDS = [];
  for (var i = 0; i < CANONICAL_STONES.length; i += 1) {
    STONE_BY_ID[CANONICAL_STONES[i].id] = CANONICAL_STONES[i];
    STONE_IDS.push(CANONICAL_STONES[i].id);
  }
  Object.freeze(STONE_IDS);

  /* Nine primary residues (0..8) cover every 3x3 cell window; stone 9 ('plank_fences')
     weaves through alternating cells as companion edging so every 3x3 window anywhere
     on the infinite plain contains all 10 canonical stones without walls or gates. */
  var PRIMARY_RING_IDS = [
    'low_backs_turned',
    'corrugated_iron_sheds',
    'cabbage_patches',
    'cemeteries',
    'snaggle_toothed_walls',
    'rusty_carnival_wheel',
    'tollbooths',
    'workshops',
    'shambles'
  ];

  var COMPANION_POOL_IDS = [
    'plank_fences',
    'low_backs_turned',
    'cabbage_patches',
    'corrugated_iron_sheds',
    'plank_fences',
    'workshops',
    'shambles'
  ];

  function posMod(n, m) {
    var r = n % m;
    return r < 0 ? r + m : r;
  }

  function hash2D(ix, iy, salt) {
    var h = (ix * 374761393) ^ (iy * 668265263) ^ ((salt || 0) * 1442695041);
    h = (h ^ (h >>> 13)) * 1274126177;
    return (h ^ (h >>> 16)) >>> 0;
  }

  function hashUnit(ix, iy, salt) {
    return (hash2D(ix, iy, salt) & 0x00ffffff) / 0x01000000;
  }

  function getCellData(cx, cy) {
    var baseX = cx * CELL_SIZE;
    var baseY = cy * CELL_SIZE;
    var rx = posMod(cx, 3);
    var ry = posMod(cy, 3);
    var primaryStoneId = PRIMARY_RING_IDS[ry * 3 + rx];
    var primaryMeta = STONE_BY_ID[primaryStoneId];

    var u0 = hashUnit(cx, cy, 11);
    var v0 = hashUnit(cx, cy, 23);
    var px0 = baseX + 34 + u0 * (CELL_SIZE - 68);
    var py0 = baseY + 34 + v0 * (CELL_SIZE - 68);

    var parcels = [
      {
        parcelId: cx + ':' + cy + ':0',
        id: primaryStoneId,
        label: primaryMeta.label,
        detail: primaryMeta.detail,
        x: px0,
        y: py0,
        scale: 0.88 + hashUnit(cx, cy, 37) * 0.28,
        variant: hash2D(cx, cy, 41) & 7,
        skew: (hashUnit(cx, cy, 53) - 0.5) * 0.24,
        isPrimary: true
      }
    ];

    var needPlank = posMod(cx + cy, 2) === 0;
    var hasExtra = needPlank || hashUnit(cx, cy, 67) < 0.52;
    if (hasExtra) {
      var compId = needPlank
        ? 'plank_fences'
        : COMPANION_POOL_IDS[hash2D(cx, cy, 71) % COMPANION_POOL_IDS.length];
      if (compId === primaryStoneId) {
        compId = 'plank_fences';
      }
      var compMeta = STONE_BY_ID[compId];
      var quadX = u0 > 0.5 ? 24 + hashUnit(cx, cy, 79) * 36 : CELL_SIZE - 60 + hashUnit(cx, cy, 79) * 34;
      var quadY = v0 > 0.5 ? 24 + hashUnit(cx, cy, 83) * 36 : CELL_SIZE - 60 + hashUnit(cx, cy, 83) * 34;
      parcels.push({
        parcelId: cx + ':' + cy + ':1',
        id: compId,
        label: compMeta.label,
        detail: compMeta.detail,
        x: baseX + quadX,
        y: baseY + quadY,
        scale: 0.78 + hashUnit(cx, cy, 89) * 0.24,
        variant: hash2D(cx, cy, 97) & 7,
        skew: (hashUnit(cx, cy, 101) - 0.5) * 0.28,
        isPrimary: false
      });
    }

    var poleX = baseX + 14 + hashUnit(cx, cy, 109) * 26;
    var poleY = baseY + 14 + hashUnit(cx, cy, 113) * 26;
    var hasCrossTrack = posMod(cx * 3 + cy, 2) === 0;

    return {
      cx: cx,
      cy: cy,
      parcels: parcels,
      poleX: poleX,
      poleY: poleY,
      hasCrossTrack: hasCrossTrack,
      roadJitterY: (hashUnit(cx, cy, 127) - 0.5) * 22,
      roadJitterX: (hashUnit(cx, cy, 131) - 0.5) * 22
    };
  }

  function formatLimboSectorCode(worldX, worldY) {
    var sx = Math.floor((Number(worldX) || 0) / (CELL_SIZE * 3));
    var sy = Math.floor((Number(worldY) || 0) / (CELL_SIZE * 3));
    var ew = sx >= 0 ? 'E' + String(sx).padStart(2, '0') : 'W' + String(-sx).padStart(2, '0');
    var ns = sy >= 0 ? 'S' + String(sy).padStart(2, '0') : 'N' + String(-sy).padStart(2, '0');
    var lot = (hash2D(sx, sy, 313) % 89) + 10;
    return 'LIMBO-' + ns + '·' + ew + '-L' + lot;
  }

  function sampleSurroundings(worldX, worldY, radius) {
    var wx = Number(worldX) || 0;
    var wy = Number(worldY) || 0;
    var r = typeof radius === 'number' && radius > 0 ? radius : 480;
    var searchR = Math.max(r, 560);

    var minCx = Math.floor((wx - searchR) / CELL_SIZE) - 1;
    var maxCx = Math.floor((wx + searchR) / CELL_SIZE) + 1;
    var minCy = Math.floor((wy - searchR) / CELL_SIZE) - 1;
    var maxCy = Math.floor((wy + searchR) / CELL_SIZE) + 1;

    var countsByType = Object.create(null);
    for (var s = 0; s < STONE_IDS.length; s += 1) {
      countsByType[STONE_IDS[s]] = 0;
    }

    var nearbyStones = [];
    var nearestTollboothDist = Infinity;

    for (var cy = minCy; cy <= maxCy; cy += 1) {
      for (var cx = minCx; cx <= maxCx; cx += 1) {
        var cell = getCellData(cx, cy);
        for (var p = 0; p < cell.parcels.length; p += 1) {
          var item = cell.parcels[p];
          var d = Math.hypot(item.x - wx, item.y - wy);
          if (item.id === 'tollbooths' && d < nearestTollboothDist) {
            nearestTollboothDist = d;
          }
          if (d <= r) {
            countsByType[item.id] = (countsByType[item.id] || 0) + 1;
            nearbyStones.push({
              id: item.id,
              parcelId: item.parcelId,
              label: item.label,
              dist: Math.round(d * 10) / 10,
              x: Math.round(item.x * 10) / 10,
              y: Math.round(item.y * 10) / 10,
              detail: item.detail
            });
          }
        }
      }
    }

    nearbyStones.sort(function (a, b) {
      return a.dist - b.dist;
    });

    var areaCells = Math.max(1, (Math.PI * r * r) / (CELL_SIZE * CELL_SIZE));
    var rawDensity = nearbyStones.length / (areaCells * 3.8);
    var localDensity = Math.round(Math.max(0.24, Math.min(0.46, rawDensity)) * 1000) / 1000;

    return {
      nearbyStones: nearbyStones,
      countsByType: countsByType,
      totalVisibleParcels: nearbyStones.length,
      localDensity: localDensity,
      wallsOrGatesCount: 0,
      limboSectorCode: formatLimboSectorCode(wx, wy),
      nearestTollboothDist: Number.isFinite(nearestTollboothDist)
        ? Math.round(nearestTollboothDist * 10) / 10
        : 240,
      rustyWheelVisible: countsByType.rusty_carnival_wheel > 0
    };
  }

  function findNearestWrinkleBearing(worldX, worldY, opts) {
    var wx = Number(worldX) || 0;
    var wy = Number(worldY) || 0;
    var minDist = 44;
    var excludeMap = null;
    if (typeof opts === 'number') {
      minDist = opts;
    } else if (opts && typeof opts === 'object') {
      if (typeof opts.minDist === 'number') minDist = opts.minDist;
      if (Array.isArray(opts.exclude)) {
        excludeMap = Object.create(null);
        for (var e = 0; e < opts.exclude.length; e += 1) {
          excludeMap[String(opts.exclude[e])] = true;
        }
      }
    }

    var baseCx = Math.floor(wx / CELL_SIZE);
    var baseCy = Math.floor(wy / CELL_SIZE);
    var candidates = [];

    for (var dy = -4; dy <= 4; dy += 1) {
      for (var dx = -4; dx <= 4; dx += 1) {
        var cell = getCellData(baseCx + dx, baseCy + dy);
        for (var p = 0; p < cell.parcels.length; p += 1) {
          var parcel = cell.parcels[p];
          if (parcel.id === 'snaggle_toothed_walls') {
            var dist = Math.hypot(parcel.x - wx, parcel.y - wy);
            candidates.push({
              parcelId: parcel.parcelId,
              targetX: Math.round(parcel.x * 10) / 10,
              targetY: Math.round(parcel.y * 10) / 10,
              distance: Math.round(dist * 10) / 10,
              bearingRad: Math.atan2(parcel.y - wy, parcel.x - wx),
              label: parcel.label
            });
          }
        }
      }
    }

    candidates.sort(function (a, b) {
      return a.distance - b.distance;
    });

    var chosen = null;
    for (var c = 0; c < candidates.length; c += 1) {
      var cand = candidates[c];
      if (cand.distance > minDist && (!excludeMap || !excludeMap[cand.parcelId])) {
        chosen = cand;
        break;
      }
    }
    if (!chosen) {
      chosen = candidates[0] || {
        parcelId: '0:0:0',
        targetX: wx + 220,
        targetY: wy - 90,
        distance: 237.7,
        bearingRad: Math.atan2(-90, 220),
        label: 'Snaggle-toothed walls'
      };
    }

    return {
      bearingRad: chosen.bearingRad,
      targetX: chosen.targetX,
      targetY: chosen.targetY,
      distance: chosen.distance,
      parcelId: chosen.parcelId,
      label: chosen.label,
      candidates: candidates.slice(0, 5)
    };
  }

  function createOutskirtsAudio() {
    var muted = true;
    var ctx = null;
    var windGain = null;
    var windFilter = null;
    var noiseBuffer = null;
    var windStarted = false;
    var rattleCooldown = 2.4;
    var creakCooldown = 4.2;

    function ensureContext() {
      if (ctx) return ctx;
      var AudioCtor = root && (root.AudioContext || root.webkitAudioContext);
      if (!AudioCtor) return null;
      try {
        ctx = new AudioCtor();
        var sampleRate = ctx.sampleRate || 44100;
        var length = Math.floor(sampleRate * 2.0);
        noiseBuffer = ctx.createBuffer(1, length, sampleRate);
        var ch = noiseBuffer.getChannelData(0);
        var last = 0;
        for (var i = 0; i < length; i += 1) {
          var white = Math.random() * 2 - 1;
          last = (last + 0.06 * white) / 1.06;
          ch[i] = last * 1.9;
        }
      } catch (err) {
        ctx = null;
      }
      return ctx;
    }

    function ensureWindLoop() {
      if (!ctx || windStarted || !noiseBuffer) return;
      try {
        var src = ctx.createBufferSource();
        src.buffer = noiseBuffer;
        src.loop = true;

        windFilter = ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.value = 390;
        windFilter.Q.value = 1.4;

        windGain = ctx.createGain();
        windGain.gain.value = muted ? 0.0 : 0.024;

        src.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(ctx.destination);
        src.start(0);
        windStarted = true;
      } catch (err) {
        windStarted = false;
      }
    }

    function syncWindGain() {
      if (!ctx || !windGain) return;
      try {
        var now = ctx.currentTime;
        windGain.gain.cancelScheduledValues(now);
        windGain.gain.setTargetAtTime(muted ? 0.0 : 0.024, now, 0.12);
      } catch (err) {
        /* safe no-op */
      }
    }

    function unlockAudio() {
      var c = ensureContext();
      if (!c) return false;
      try {
        if (c.state === 'suspended' && typeof c.resume === 'function') {
          c.resume().catch(function () {});
        }
        ensureWindLoop();
        syncWindGain();
        return true;
      } catch (err) {
        return false;
      }
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      if (!muted) {
        unlockAudio();
      } else {
        syncWindGain();
      }
      return muted;
    }

    function isMuted() {
      return muted;
    }

    function toggleMute() {
      return setMuted(!muted);
    }

    function playTinRattle(gainAmt) {
      if (muted || !ctx || !noiseBuffer) return;
      try {
        var now = ctx.currentTime;
        var src = ctx.createBufferSource();
        src.buffer = noiseBuffer;
        var bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(1180 + Math.random() * 420, now);
        bp.Q.value = 9.5;
        var g = ctx.createGain();
        var peak = gainAmt || 0.016;
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(peak, now + 0.018);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);
        src.connect(bp);
        bp.connect(g);
        g.connect(ctx.destination);
        src.start(now);
        src.stop(now + 0.21);
      } catch (err) {}
    }

    function playRustyWheelCreak(gainAmt) {
      if (muted || !ctx) return;
      try {
        var now = ctx.currentTime;
        var osc = ctx.createOscillator();
        var lfo = ctx.createOscillator();
        var lfoGain = ctx.createGain();
        var bp = ctx.createBiquadFilter();
        var g = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(152, now);
        osc.frequency.linearRampToValueAtTime(171, now + 0.34);
        osc.frequency.linearRampToValueAtTime(144, now + 0.68);

        lfo.type = 'sine';
        lfo.frequency.value = 6.5;
        lfoGain.gain.value = 9.0;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);

        bp.type = 'bandpass';
        bp.frequency.value = 640;
        bp.Q.value = 6.2;

        var peak = gainAmt || 0.014;
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(peak, now + 0.14);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);

        osc.connect(bp);
        bp.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        lfo.start(now);
        osc.stop(now + 0.75);
        lfo.stop(now + 0.75);
      } catch (err) {}
    }

    return {
      unlockAudio: unlockAudio,
      setMuted: setMuted,
      isMuted: isMuted,
      toggleMute: toggleMute,
      playTinRattle: playTinRattle,
      playRustyWheelCreak: playRustyWheelCreak,
      getContext: function () { return ctx; },
      getNoiseBuffer: function () { return noiseBuffer; },
      stepAmbient: function (dt, reducedMotion, rustyWheelDist, t) {
        if (muted || !ctx || reducedMotion) return;
        if (windFilter) {
          try {
            windFilter.frequency.value = 370 + Math.sin(t * 0.43) * 85;
          } catch (err) {}
        }
        rattleCooldown -= dt;
        if (rattleCooldown <= 0) {
          rattleCooldown = 2.8 + Math.random() * 3.6;
          playTinRattle(0.013);
        }
        creakCooldown -= dt;
        if (creakCooldown <= 0) {
          creakCooldown = 4.6 + Math.random() * 4.4;
          var prox = Math.max(0.25, Math.min(1.0, 260 / Math.max(80, rustyWheelDist || 220)));
          playRustyWheelCreak(0.014 * prox);
        }
      }
    };
  }

  function attachAudioTriggers(audio) {
    function triggerStepPulse() {
      if (audio.isMuted()) return;
      var ctx = audio.getContext();
      var noise = audio.getNoiseBuffer();
      if (!ctx || !noise) return;
      try {
        var now = ctx.currentTime;
        var src = ctx.createBufferSource();
        src.buffer = noise;
        var bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 880 + Math.random() * 180;
        bp.Q.value = 2.6;
        var g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.022, now + 0.008);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.068);
        src.connect(bp);
        bp.connect(g);
        g.connect(ctx.destination);
        src.start(now);
        src.stop(now + 0.075);
      } catch (err) {}
    }

    function triggerTollboothSound() {
      if (audio.isMuted()) return;
      var ctx = audio.getContext();
      if (!ctx) return;
      try {
        var now = ctx.currentTime;
        var freqs = [392, 587.3, 831];
        for (var i = 0; i < freqs.length; i += 1) {
          var osc = ctx.createOscillator();
          var g = ctx.createGain();
          osc.type = i === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freqs[i], now);
          osc.frequency.exponentialRampToValueAtTime(freqs[i] * 0.96, now + 0.36);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.linearRampToValueAtTime(0.02 / (i + 1), now + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
          osc.connect(g);
          g.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.41);
        }
      } catch (err) {}
    }

    function triggerGestureSound(gestureKind) {
      if (audio.isMuted()) return;
      var ctx = audio.getContext();
      if (!ctx) return;
      try {
        var now = ctx.currentTime;
        var notes;
        if (gestureKind === 'ahead') {
          notes = [293.66, 392.0];
        } else if (gestureKind === 'behind') {
          notes = [392.0, 261.63];
        } else if (gestureKind === 'left') {
          notes = [329.63, 311.13];
        } else if (gestureKind === 'right') {
          notes = [311.13, 349.23];
        } else {
          notes = [261.63, 293.66, 329.63, 369.99, 415.3];
          audio.playRustyWheelCreak(0.011);
        }
        for (var n = 0; n < notes.length; n += 1) {
          var t0 = now + n * 0.065;
          var osc = ctx.createOscillator();
          var flt = ctx.createBiquadFilter();
          var g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(notes[n], t0);
          flt.type = 'lowpass';
          flt.frequency.value = 1100;
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.linearRampToValueAtTime(0.022, t0 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.28);
          osc.connect(flt);
          flt.connect(g);
          g.connect(ctx.destination);
          osc.start(t0);
          osc.stop(t0 + 0.31);
        }
      } catch (err) {}
    }

    audio.triggerStepPulse = triggerStepPulse;
    audio.triggerTollboothSound = triggerTollboothSound;
    audio.triggerGestureSound = triggerGestureSound;
    return audio;
  }

  function drawParcelEarlyFive(ctx, id, s, v, animT, reducedMotion) {
    var ink = PALETTE.cinder_ink;
    if (id === 'low_backs_turned') {
      var w = (36 + (v % 3) * 6) * s;
      var h = (17 + (v % 2) * 4) * s;
      ctx.fillStyle = 'rgba(38,36,33,0.12)';
      ctx.fillRect(-w * 0.46, 2 * s, w * 1.04, 6 * s);
      ctx.fillStyle = PALETTE.plaster_tooth;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.1;
      ctx.fillRect(-w * 0.5, -h, w, h + 3 * s);
      ctx.strokeRect(-w * 0.5, -h, w, h + 3 * s);
      ctx.fillStyle = '#ddd6c6';
      ctx.beginPath();
      ctx.moveTo(-w * 0.53, -h);
      ctx.lineTo(-w * 0.42, -h - 6 * s);
      ctx.lineTo(w * 0.56, -h - 6 * s);
      ctx.lineTo(w * 0.5, -h);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      /* Blank rear wall drainpipe & high slit vent */
      var pipeX = -w * 0.24 + (v % 3) * 8 * s;
      ctx.strokeStyle = PALETTE.zinc_shed;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(pipeX, -h);
      ctx.lineTo(pipeX, 3 * s);
      ctx.stroke();
      ctx.fillStyle = 'rgba(123,140,114,0.34)';
      ctx.fillRect(pipeX - 3 * s, -2 * s, 6 * s, 5 * s);
      ctx.fillStyle = ink;
      ctx.fillRect(w * 0.16, -h + 4 * s, 5 * s, 2.2 * s);
      /* Laundry cord behind building */
      var sway = reducedMotion ? 0 : Math.sin(animT * 2.1 + v) * 1.4 * s;
      ctx.strokeStyle = 'rgba(38,36,33,0.55)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(w * 0.5, -h * 0.65);
      ctx.quadraticCurveTo(w * 0.72, -h * 0.42, w * 0.92, -h * 0.62);
      ctx.stroke();
      ctx.fillStyle = PALETTE.chalk_haze;
      ctx.fillRect(w * 0.61 + sway * 0.3, -h * 0.54, 4.5 * s, 6 * s);
      ctx.fillStyle = '#d4cbb8';
      ctx.fillRect(w * 0.74 + sway * 0.4, -h * 0.55, 4 * s, 5 * s);
      return true;
    }

    if (id === 'plank_fences') {
      var span = 42 * s;
      ctx.strokeStyle = 'rgba(38,36,33,0.35)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(-span * 0.5, -5 * s);
      ctx.lineTo(span * 0.5, -4 * s);
      ctx.moveTo(-span * 0.5, -2 * s);
      ctx.lineTo(span * 0.5, -1.5 * s);
      ctx.stroke();
      for (var p = 0; p < 9; p += 1) {
        if ((p + v) % 5 === 2) continue;
        var px = -span * 0.48 + p * (span / 8.4);
        var ph = (8 + ((p * 3 + v) % 5) * 1.8) * s;
        var tilt = (((p + v) % 3) - 1) * 0.08;
        ctx.save();
        ctx.translate(px, 2 * s);
        ctx.rotate(tilt);
        ctx.fillStyle = p % 2 === 0 ? '#c8bfa9' : '#b7ae98';
        ctx.strokeStyle = ink;
        ctx.lineWidth = 0.85;
        ctx.fillRect(-1.8 * s, -ph, 3.5 * s, ph);
        ctx.strokeRect(-1.8 * s, -ph, 3.5 * s, ph);
        ctx.restore();
      }
      return true;
    }

    if (id === 'corrugated_iron_sheds') {
      var jitter = reducedMotion ? 0 : Math.sin(animT * 14 + v * 2.3) * 0.35 * s;
      var sw = 34 * s;
      var sh = 15 * s;
      ctx.fillStyle = 'rgba(38,36,33,0.13)';
      ctx.fillRect(-sw * 0.48, 2 * s, sw * 1.05, 5 * s);
      ctx.save();
      ctx.translate(jitter, 0);
      ctx.fillStyle = PALETTE.zinc_shed;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.0;
      ctx.fillRect(-sw * 0.5, -sh, sw, sh + 2 * s);
      ctx.strokeRect(-sw * 0.5, -sh, sw, sh + 2 * s);
      ctx.strokeStyle = 'rgba(38,36,33,0.42)';
      ctx.lineWidth = 0.75;
      for (var rx = -sw * 0.44; rx < sw * 0.46; rx += 3.6 * s) {
        ctx.beginPath();
        ctx.moveTo(rx, -sh);
        ctx.lineTo(rx, 2 * s);
        ctx.stroke();
      }
      ctx.fillStyle = '#a4adb0';
      ctx.beginPath();
      ctx.moveTo(-sw * 0.55, -sh);
      ctx.lineTo(-sw * 0.4, -sh - 5 * s);
      ctx.lineTo(sw * 0.56, -sh - 3 * s);
      ctx.lineTo(sw * 0.52, -sh + 1.5 * s);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = ink;
      ctx.stroke();
      ctx.fillStyle = 'rgba(156,79,53,0.45)';
      ctx.fillRect(-sw * 0.15, -sh * 0.55, 7 * s, 4 * s);
      ctx.restore();
      return true;
    }

    return false;
  }

  function drawStoneParcel(ctx, parcel, sx, sy, scale, animT, reducedMotion, distFromTraveler) {
    var s = scale * (parcel.scale || 1);
    var v = parcel.variant || 0;
    var id = parcel.id;
    var ink = PALETTE.cinder_ink;

    ctx.save();
    ctx.translate(sx, sy);

    if (drawParcelEarlyFive(ctx, id, s, v, animT, reducedMotion)) {
      ctx.restore();
      return;
    }

    if (id === 'cabbage_patches') {
      var cw = 40 * s;
      var ch = 18 * s;
      ctx.fillStyle = '#dad3c2';
      ctx.fillRect(-cw * 0.5, -ch * 0.6, cw, ch);
      ctx.strokeStyle = 'rgba(38,36,33,0.32)';
      ctx.lineWidth = 0.8;
      for (var row = 0; row < 3; row += 1) {
        var ry = -ch * 0.42 + row * 5.6 * s;
        ctx.beginPath();
        ctx.moveTo(-cw * 0.46, ry);
        ctx.lineTo(cw * 0.46, ry);
        ctx.stroke();
        for (var col = 0; col < 5; col += 1) {
          var cx = -cw * 0.36 + col * 7.2 * s + (row % 2) * 1.8 * s;
          ctx.fillStyle = PALETTE.cabbage_dust;
          ctx.beginPath();
          ctx.arc(cx, ry - 0.8 * s, 2.7 * s, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = ink;
          ctx.lineWidth = 0.65;
          ctx.stroke();
          ctx.fillStyle = '#9cab91';
          ctx.beginPath();
          ctx.arc(cx - 0.5 * s, ry - 1.2 * s, 1.1 * s, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      return;
    }

    if (id === 'cemeteries') {
      var gw = 38 * s;
      var gh = 16 * s;
      ctx.strokeStyle = 'rgba(38,36,33,0.45)';
      ctx.lineWidth = 0.9;
      ctx.setLineDash([4 * s, 3 * s]);
      ctx.strokeRect(-gw * 0.5, -gh * 0.55, gw, gh);
      ctx.setLineDash([]);
      for (var m = 0; m < 6; m += 1) {
        var mx = -gw * 0.36 + (m % 3) * 13 * s + (m > 2 ? 3 * s : -2 * s);
        var my = m < 3 ? -gh * 0.2 : gh * 0.25;
        var mTilt = (((m + v) % 5) - 2) * 0.11;
        ctx.save();
        ctx.translate(mx, my);
        ctx.rotate(mTilt);
        ctx.fillStyle = 'rgba(38,36,33,0.14)';
        ctx.fillRect(0, -1 * s, 6 * s, 2.2 * s);
        ctx.fillStyle = '#e3ddd0';
        ctx.strokeStyle = ink;
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(-2.4 * s, -8.5 * s, 4.8 * s, 8.5 * s, [2 * s, 2 * s, 0, 0]) : ctx.rect(-2.4 * s, -8.5 * s, 4.8 * s, 8.5 * s);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }
      ctx.strokeStyle = PALETTE.cabbage_dust;
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.moveTo(-gw * 0.42, gh * 0.3);
      ctx.lineTo(-gw * 0.46, gh * 0.08);
      ctx.moveTo(gw * 0.38, -gh * 0.1);
      ctx.lineTo(gw * 0.44, -gh * 0.32);
      ctx.stroke();
      ctx.restore();
      return;
    }

    if (id === 'snaggle_toothed_walls') {
      var mirageAlpha = Math.max(0, Math.min(1, ((distFromTraveler || 180) - 70) / 140));
      var heights = [31, 11, 27, 9, 34, 13];
      var totalW = 46 * s;
      if (mirageAlpha > 0.04) {
        ctx.fillStyle = 'rgba(191,182,164,' + (0.34 * mirageAlpha).toFixed(3) + ')';
        ctx.fillRect(-totalW * 0.54, -36 * s, totalW * 1.08, 34 * s);
      } else {
        /* Approached closely: false center thins into timber props behind shallow comb */
        ctx.strokeStyle = 'rgba(38,36,33,0.55)';
        ctx.lineWidth = 0.9;
        for (var b = -2; b <= 2; b += 1) {
          ctx.beginPath();
          ctx.moveTo(b * 8 * s, -18 * s);
          ctx.lineTo(b * 8 * s + 7 * s, 2 * s);
          ctx.stroke();
        }
      }
      var toothW = totalW / heights.length;
      for (var t = 0; t < heights.length; t += 1) {
        var th = heights[(t + v) % heights.length] * s;
        var tx = -totalW * 0.5 + t * toothW;
        ctx.fillStyle = t % 2 === 0 ? PALETTE.plaster_tooth : '#dfd8c7';
        ctx.strokeStyle = ink;
        ctx.lineWidth = 1.0;
        ctx.fillRect(tx, -th, toothW - 0.8 * s, th + 2 * s);
        ctx.strokeRect(tx, -th, toothW - 0.8 * s, th + 2 * s);
        if (th > 20 * s) {
          ctx.fillStyle = 'rgba(38,36,33,0.25)';
          ctx.fillRect(tx + 2 * s, -th + 5 * s, 2.4 * s, 4.2 * s);
        }
      }
      ctx.restore();
      return;
    }

    if (id === 'rusty_carnival_wheel') {
      var rad = 22 * s;
      var hubY = -rad - 8 * s;
      var creakAngle = reducedMotion ? 0.18 : Math.sin(animT * 0.55 + v) * 0.16 + animT * 0.05;
      ctx.fillStyle = 'rgba(38,36,33,0.09)';
      ctx.beginPath();
      ctx.ellipse(0, 3 * s, 24 * s, 6 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PALETTE.wheel_rust;
      ctx.lineWidth = 1.35;
      ctx.beginPath();
      ctx.arc(0, hubY, rad, 0, Math.PI * 2);
      ctx.arc(0, hubY, rad * 0.62, 0, Math.PI * 2);
      ctx.stroke();
      for (var sp = 0; sp < 8; sp += 1) {
        var ang = creakAngle + (sp * Math.PI) / 4;
        var gx = Math.cos(ang) * rad;
        var gy = hubY + Math.sin(ang) * rad;
        ctx.strokeStyle = 'rgba(156,79,53,0.78)';
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.moveTo(0, hubY);
        ctx.lineTo(gx, gy);
        ctx.stroke();
        ctx.fillStyle = sp % 2 === 0 ? PALETTE.wheel_rust : PALETTE.toll_ochre;
        ctx.fillRect(gx - 2.2 * s, gy, 4.4 * s, 3.4 * s);
      }
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-13 * s, 3 * s);
      ctx.lineTo(0, hubY);
      ctx.lineTo(13 * s, 3 * s);
      ctx.stroke();
      ctx.restore();
      return;
    }

    drawParcelFinalThree(ctx, id, s, v, animT, reducedMotion);
    ctx.restore();
  }

  function drawParcelFinalThree(ctx, id, s, v, animT, reducedMotion) {
    var ink = PALETTE.cinder_ink;

    if (id === 'tollbooths') {
      ctx.fillStyle = 'rgba(38,36,33,0.12)';
      ctx.fillRect(-10 * s, 2 * s, 26 * s, 4 * s);
      ctx.fillStyle = PALETTE.toll_ochre;
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.05;
      ctx.fillRect(-9 * s, -16 * s, 11 * s, 18 * s);
      ctx.strokeRect(-9 * s, -16 * s, 11 * s, 18 * s);
      ctx.fillStyle = PALETTE.chalk_haze;
      ctx.fillRect(-7 * s, -13 * s, 7 * s, 5.5 * s);
      ctx.strokeRect(-7 * s, -13 * s, 7 * s, 5.5 * s);
      ctx.fillStyle = PALETTE.zinc_shed;
      ctx.fillRect(-10.5 * s, -18.5 * s, 14 * s, 2.8 * s);
      ctx.strokeRect(-10.5 * s, -18.5 * s, 14 * s, 2.8 * s);
      /* Striped barrier arm guarding no wall and no gate */
      var armTilt = -0.16 + ((v % 3) - 1) * 0.08;
      ctx.save();
      ctx.translate(2 * s, -7 * s);
      ctx.rotate(armTilt);
      for (var seg = 0; seg < 6; seg += 1) {
        ctx.fillStyle = seg % 2 === 0 ? PALETTE.wheel_rust : PALETTE.chalk_haze;
        ctx.fillRect(seg * 4.2 * s, -1.3 * s, 4.2 * s, 2.5 * s);
      }
      ctx.strokeStyle = ink;
      ctx.lineWidth = 0.75;
      ctx.strokeRect(0, -1.3 * s, 25.2 * s, 2.5 * s);
      ctx.restore();
      return;
    }

    if (id === 'workshops') {
      var ww = 30 * s;
      var wh = 13 * s;
      ctx.fillStyle = '#999e9c';
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.0;
      ctx.fillRect(-ww * 0.5, -wh, ww * 0.72, wh + 2 * s);
      ctx.strokeRect(-ww * 0.5, -wh, ww * 0.72, wh + 2 * s);
      ctx.fillStyle = ink;
      ctx.fillRect(-ww * 0.36, -wh * 0.65, ww * 0.34, wh * 0.8);
      /* Oil drums & vulcanizer tire stack */
      ctx.fillStyle = PALETTE.toll_ochre;
      ctx.fillRect(ww * 0.28, -6 * s, 5 * s, 8 * s);
      ctx.strokeRect(ww * 0.28, -6 * s, 5 * s, 8 * s);
      ctx.fillStyle = PALETTE.zinc_shed;
      ctx.fillRect(ww * 0.44, -5 * s, 4.5 * s, 7 * s);
      ctx.strokeRect(ww * 0.44, -5 * s, 4.5 * s, 7 * s);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.ellipse(-ww * 0.6, 0, 4 * s, 1.8 * s, 0, 0, Math.PI * 2);
      ctx.ellipse(-ww * 0.6, -2.2 * s, 4 * s, 1.8 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
      /* Intermittent weld spark */
      var sparkPulse = reducedMotion ? 0.45 : Math.sin(animT * 9.5 + v * 3.7) * Math.sin(animT * 3.1 + v);
      if (sparkPulse > 0.38) {
        ctx.fillStyle = '#fff8dc';
        ctx.beginPath();
        ctx.arc(-ww * 0.19, -wh * 0.22, 2.6 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = PALETTE.toll_ochre;
        ctx.lineWidth = 0.9;
        for (var r = 0; r < 4; r += 1) {
          var sa = (r * Math.PI) / 2 + 0.4;
          ctx.beginPath();
          ctx.moveTo(-ww * 0.19, -wh * 0.22);
          ctx.lineTo(-ww * 0.19 + Math.cos(sa) * 5.2 * s, -wh * 0.22 + Math.sin(sa) * 5.2 * s);
          ctx.stroke();
        }
      }
      return;
    }

    if (id === 'shambles') {
      var mw = 36 * s;
      ctx.fillStyle = '#e0dbd0';
      ctx.strokeStyle = ink;
      ctx.lineWidth = 0.95;
      ctx.fillRect(-mw * 0.5, -2 * s, mw, 6 * s);
      ctx.strokeRect(-mw * 0.5, -2 * s, mw, 6 * s);
      /* Shallow concrete drainage runnels */
      ctx.strokeStyle = 'rgba(156,79,53,0.42)';
      ctx.beginPath();
      ctx.moveTo(-mw * 0.42, 1 * s);
      ctx.lineTo(mw * 0.42, 1.8 * s);
      ctx.stroke();
      /* Concrete posts & iron hook beam */
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-mw * 0.42, -1 * s);
      ctx.lineTo(-mw * 0.42, -15 * s);
      ctx.lineTo(mw * 0.42, -15 * s);
      ctx.lineTo(mw * 0.42, -1 * s);
      ctx.moveTo(0, -1 * s);
      ctx.lineTo(0, -15 * s);
      ctx.stroke();
      ctx.lineWidth = 0.85;
      for (var hk = -3; hk <= 3; hk += 1) {
        if (hk === 0) continue;
        var hx = hk * 4.4 * s;
        ctx.beginPath();
        ctx.moveTo(hx, -15 * s);
        ctx.lineTo(hx, -10.5 * s);
        ctx.arc(hx + 1.1 * s, -10.5 * s, 1.1 * s, Math.PI, 0, true);
        ctx.stroke();
      }
    }
  }

  function renderPlateFallback(targetCanvas, kind) {
    if (!targetCanvas || typeof targetCanvas.getContext !== 'function') return false;
    var w = targetCanvas.width;
    var h = targetCanvas.height;
    if (!w || w < 60 || (w === 300 && h === 150)) {
      var rect = typeof targetCanvas.getBoundingClientRect === 'function'
        ? targetCanvas.getBoundingClientRect()
        : null;
      w = rect && rect.width > 80 ? Math.round(rect.width) : 640;
      h = rect && rect.height > 80 ? Math.round(rect.height) : 420;
      targetCanvas.width = w;
      targetCanvas.height = h;
    }
    var ctx = targetCanvas.getContext('2d');
    if (!ctx) return false;

    ctx.save();
    var grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, PALETTE.chalk_haze);
    grad.addColorStop(1, PALETTE.broth_ground);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = PALETTE.cinder_ink;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(8, 8, w - 16, h - 16);
    ctx.lineWidth = 0.6;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    if (kind === 'map') {
      paintArchivalMapPlate(ctx, w, h);
    } else {
      paintArchivalVistaPlate(ctx, w, h);
    }
    ctx.restore();
    return true;
  }

  function paintArchivalMapPlate(ctx, w, h) {
    var cx = w * 0.5;
    var cy = h * 0.52;
    ctx.strokeStyle = 'rgba(38,36,33,0.16)';
    ctx.lineWidth = 0.7;
    for (var gx = 36; gx < w - 28; gx += 48) {
      ctx.beginPath();
      ctx.moveTo(gx, 22);
      ctx.lineTo(gx, h - 22);
      ctx.stroke();
    }
    for (var gy = 34; gy < h - 26; gy += 44) {
      ctx.beginPath();
      ctx.moveTo(22, gy);
      ctx.lineTo(w - 22, gy);
      ctx.stroke();
    }

    /* Concentric limbo dispersion rings without walls or center */
    var maxR = Math.min(w, h) * 0.36;
    for (var ring = 1; ring <= 3; ring += 1) {
      ctx.strokeStyle = 'rgba(156,79,53,0.34)';
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, (maxR * ring) / 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    /* Scatter all 10 canonical stones across outer suburb quadrants */
    for (var i = 0; i < CANONICAL_STONES.length; i += 1) {
      var ang = (i / CANONICAL_STONES.length) * Math.PI * 2 + 0.25;
      var dist = maxR * (0.52 + (i % 3) * 0.23);
      var px = cx + Math.cos(ang) * dist * 1.18;
      var py = cy + Math.sin(ang) * dist * 0.86;
      drawStoneParcel(
        ctx,
        { id: CANONICAL_STONES[i].id, scale: 0.72, variant: i },
        px,
        py,
        Math.min(1.0, w / 640),
        1.2,
        true,
        180
      );
    }

    /* Opposing 360-degree gesture vectors canceling at null center */
    for (var a = 0; a < 8; a += 1) {
      var theta = (a * Math.PI) / 4 + 0.18;
      var r0 = 16;
      var r1 = maxR * 0.44;
      ctx.strokeStyle = a % 2 === 0 ? PALETTE.wheel_rust : PALETTE.toll_ochre;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(theta) * r0, cy + Math.sin(theta) * r0);
      ctx.lineTo(cx + Math.cos(theta) * r1, cy + Math.sin(theta) * r1);
      ctx.stroke();
    }
    ctx.strokeStyle = PALETTE.cinder_ink;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(cx, cy, 11, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = PALETTE.cinder_ink;
    ctx.font = '600 ' + Math.max(10, Math.round(w * 0.019)) + 'px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SURVEY PLATE I · BOUNDLESS DILUTED SUBURB DISPERSION', 22, 30);
    ctx.font = Math.max(9, Math.round(w * 0.016)) + 'px monospace';
    ctx.fillText('WALLS: 0 · GATES: 0 · CENTER LOCATABLE: FALSE · RESULTANT VECTOR -> 0.00', 22, h - 20);
  }

  function paintArchivalVistaPlate(ctx, w, h) {
    var horizonY = Math.round(h * 0.44);
    ctx.fillStyle = '#ddd6c5';
    ctx.fillRect(14, horizonY, w - 28, h - horizonY - 14);

    /* Distant pale haze & telegraph line */
    ctx.strokeStyle = 'rgba(38,36,33,0.38)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(16, horizonY);
    ctx.lineTo(w - 16, horizonY);
    ctx.stroke();

    for (var p = 0; p < 5; p += 1) {
      var poleX = w * (0.14 + p * 0.19);
      ctx.strokeStyle = PALETTE.cinder_ink;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(poleX, horizonY + 14);
      ctx.lineTo(poleX, horizonY - 26);
      ctx.stroke();
      if (p > 0) {
        var prevX = w * (0.14 + (p - 1) * 0.19);
        ctx.strokeStyle = 'rgba(38,36,33,0.45)';
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(prevX, horizonY - 23);
        ctx.quadraticCurveTo((prevX + poleX) * 0.5, horizonY - 12, poleX, horizonY - 23);
        ctx.stroke();
      }
    }

    /* Chalk track receding across plain */
    ctx.fillStyle = PALETTE.chalk_haze;
    ctx.beginPath();
    ctx.moveTo(w * 0.46, horizonY);
    ctx.lineTo(w * 0.53, horizonY);
    ctx.lineTo(w * 0.74, h - 14);
    ctx.lineTo(w * 0.24, h - 14);
    ctx.closePath();
    ctx.fill();

    var k = Math.min(1.35, w / 520);
    drawStoneParcel(ctx, { id: 'snaggle_toothed_walls', scale: 1.15, variant: 1 }, w * 0.26, horizonY + 8, k, 1.5, true, 220);
    drawStoneParcel(ctx, { id: 'rusty_carnival_wheel', scale: 1.38, variant: 2 }, w * 0.72, horizonY + 18, k, 1.5, true, 160);
    drawStoneParcel(ctx, { id: 'corrugated_iron_sheds', scale: 1.05, variant: 3 }, w * 0.18, h * 0.64, k, 1.5, true, 110);
    drawStoneParcel(ctx, { id: 'low_backs_turned', scale: 1.05, variant: 0 }, w * 0.83, h * 0.63, k, 1.5, true, 110);
    drawStoneParcel(ctx, { id: 'shambles', scale: 1.0, variant: 2 }, w * 0.34, h * 0.71, k, 1.5, true, 90);
    drawStoneParcel(ctx, { id: 'tollbooths', scale: 1.18, variant: 1 }, w * 0.56, h * 0.73, k, 1.5, true, 80);
    drawStoneParcel(ctx, { id: 'cabbage_patches', scale: 1.15, variant: 4 }, w * 0.22, h * 0.83, k, 1.5, true, 70);
    drawStoneParcel(ctx, { id: 'plank_fences', scale: 1.1, variant: 2 }, w * 0.79, h * 0.83, k, 1.5, true, 70);

    ctx.fillStyle = PALETTE.cinder_ink;
    ctx.font = '600 ' + Math.max(10, Math.round(w * 0.019)) + 'px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('SURVEY PLATE II · ELEVATION OF THE UNWALLED OUTSKIRTS', 22, 30);
    ctx.font = Math.max(9, Math.round(w * 0.016)) + 'px monospace';
    ctx.fillText('RUSTY CARNIVAL WHEEL · SNAGGLE-TOOTHED COMB · CABBAGES · STRAY TOLLBOOTH', 22, h - 20);
  }

  function drawHorizonAndPlainTracks(ctx, viewW, viewH, horizonY, state, proj, cells) {
    var skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY + 18);
    skyGrad.addColorStop(0, PALETTE.chalk_haze);
    skyGrad.addColorStop(1, PALETTE.broth_ground);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, viewW, horizonY + 18);

    ctx.fillStyle = PALETTE.broth_ground;
    ctx.fillRect(0, horizonY, viewW, viewH - horizonY);

    /* Distant false-density mirage combs along the pale horizon (never walls or gates) */
    var parallax = ((state.worldX * 0.14) % 180 + 180) % 180;
    ctx.fillStyle = 'rgba(191,183,166,0.42)';
    for (var hx = -180 + (180 - parallax); hx < viewW + 180; hx += 90) {
      var seed = Math.abs(Math.round((hx + parallax + state.worldX * 0.14) / 90));
      for (var t = 0; t < 5; t += 1) {
        var th = 4 + ((seed * 7 + t * 11) % 13);
        ctx.fillRect(hx + t * 6.5, horizonY - th, 5.2, th);
      }
      if (seed % 3 === 0) {
        ctx.strokeStyle = 'rgba(156,79,53,0.26)';
        ctx.lineWidth = 0.85;
        ctx.beginPath();
        ctx.arc(hx + 52, horizonY - 8, 9, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = 'rgba(38,36,33,0.22)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(viewW, horizonY);
    ctx.stroke();

    /* Infinite dusty chalk tracks across cells */
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, horizonY, viewW, viewH - horizonY);
    ctx.clip();

    for (var i = 0; i < cells.length; i += 1) {
      var c = cells[i];
      var x0 = c.cx * CELL_SIZE;
      var y0 = c.cy * CELL_SIZE + CELL_SIZE * 0.5 + c.roadJitterY;
      var x1 = (c.cx + 1) * CELL_SIZE;
      var y1 = c.cy * CELL_SIZE + CELL_SIZE * 0.5 + getCellData(c.cx + 1, c.cy).roadJitterY;
      var pA = proj(x0, y0);
      var pB = proj(x1, y1);
      ctx.strokeStyle = 'rgba(239,234,224,0.78)';
      ctx.lineWidth = Math.max(4, 9 * pA.scale);
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y);
      ctx.lineTo(pB.x, pB.y);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(38,36,33,0.14)';
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(pA.x, pA.y - 2 * pA.scale);
      ctx.lineTo(pB.x, pB.y - 2 * pB.scale);
      ctx.stroke();

      if (c.hasCrossTrack) {
        var vx0 = c.cx * CELL_SIZE + CELL_SIZE * 0.5 + c.roadJitterX;
        var vy0 = c.cy * CELL_SIZE;
        var vx1 = c.cx * CELL_SIZE + CELL_SIZE * 0.5 + getCellData(c.cx, c.cy + 1).roadJitterX;
        var vy1 = (c.cy + 1) * CELL_SIZE;
        var vA = proj(vx0, vy0);
        var vB = proj(vx1, vy1);
        ctx.strokeStyle = 'rgba(239,234,224,0.62)';
        ctx.lineWidth = Math.max(3, 6.5 * vA.scale);
        ctx.beginPath();
        ctx.moveTo(vA.x, vA.y);
        ctx.lineTo(vB.x, vB.y);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawGestureRaysAndTraveler(ctx, centerX, centerY, state, proj, animT, reducedMotion) {
    /* Wake footsteps */
    var wake = state.wakeTrail;
    for (var w = 0; w < wake.length; w += 1) {
      var wp = proj(wake[w].x, wake[w].y);
      var alpha = ((w + 1) / (wake.length + 1)) * 0.34;
      ctx.fillStyle = 'rgba(38,36,33,' + alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(wp.x, wp.y, 1.9 * wp.scale, 0, Math.PI * 2);
      ctx.fill();
    }

    /* Mode topological guide line */
    if (state.mode === 'seek_center') {
      var wr = findNearestWrinkleBearing(state.worldX, state.worldY);
      var tp = proj(wr.targetX, wr.targetY);
      ctx.save();
      ctx.strokeStyle = 'rgba(181,141,71,0.62)';
      ctx.lineWidth = 1.25;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(tp.x, tp.y);
      ctx.stroke();
      ctx.restore();
    } else if (state.mode === 'seek_outside') {
      var ex = centerX + Math.cos(state.bearingRad) * 140;
      var ey = centerY + Math.sin(state.bearingRad) * 106;
      ctx.save();
      ctx.strokeStyle = 'rgba(123,140,114,0.68)';
      ctx.lineWidth = 1.3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.restore();
    }

    /* Contradictory passerby gesture rays & 360-degree sweeps */
    var rays = Array.isArray(state.gestureRays) ? state.gestureRays : [];
    var startIdx = Math.max(0, rays.length - 10);
    for (var r = startIdx; r < rays.length; r += 1) {
      var ray = rays[r];
      if (!ray) continue;
      var weight = 0.25 + ((r - startIdx + 1) / Math.max(1, rays.length - startIdx)) * 0.5;
      var isSweep = Boolean(ray.isSweep360 || ray.gestureType === 'sweep_360' || ray.type === 'sweep_360');
      if (isSweep) {
        ctx.save();
        ctx.strokeStyle = 'rgba(156,79,53,' + (weight * 0.65).toFixed(3) + ')';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, 54, 40, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else {
        var ang = typeof ray.angleRad === 'number' ? ray.angleRad : (Number(ray.angle) || 0);
        var len = 78 + (r % 3) * 18;
        var rx = centerX + Math.cos(ang) * len;
        var ry = centerY + Math.sin(ang) * len * 0.76;
        ctx.strokeStyle = 'rgba(156,79,53,' + (weight * 0.78).toFixed(3) + ')';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(ang) * 14, centerY + Math.sin(ang) * 11);
        ctx.lineTo(rx, ry);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - Math.cos(ang - 0.35) * 6.5, ry - Math.sin(ang - 0.35) * 5.5);
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - Math.cos(ang + 0.35) * 6.5, ry - Math.sin(ang + 0.35) * 5.5);
        ctx.stroke();
      }
    }

    /* Central traveler figure + bearing indicator */
    var bob = reducedMotion || state.speed <= 0.01 ? 0 : Math.sin(animT * 7.2) * 1.2;
    ctx.strokeStyle = 'rgba(38,36,33,0.34)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + 3, 13, 9.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    var dirX = centerX + Math.cos(state.bearingRad) * 20;
    var dirY = centerY + Math.sin(state.bearingRad) * 15;
    ctx.strokeStyle = PALETTE.cinder_ink;
    ctx.lineWidth = 1.35;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY + 2);
    ctx.lineTo(dirX, dirY);
    ctx.stroke();

    ctx.fillStyle = PALETTE.cinder_ink;
    ctx.beginPath();
    ctx.moveTo(centerX - 4.2, centerY + 3 + bob);
    ctx.lineTo(centerX + 4.2, centerY + 3 + bob);
    ctx.lineTo(centerX + 2.2, centerY - 9 + bob);
    ctx.lineTo(centerX - 2.2, centerY - 9 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX, centerY - 12.2 + bob, 2.9, 0, Math.PI * 2);
    ctx.fill();

    /* Roadside witness silhouette when activeWitness is present */
    if (state.activeWitness) {
      var wAng = typeof state.activeWitness.angleRad === 'number' ? state.activeWitness.angleRad : state.bearingRad + 2.2;
      var wx = centerX + 24;
      var wy = centerY - 6;
      ctx.fillStyle = PALETTE.wheel_rust;
      ctx.fillRect(wx - 2.4, wy - 8, 4.8, 9);
      ctx.beginPath();
      ctx.arc(wx, wy - 10.5, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PALETTE.wheel_rust;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(wx, wy - 6);
      ctx.lineTo(wx + Math.cos(wAng) * 11, wy - 6 + Math.sin(wAng) * 8.5);
      ctx.stroke();
    }
  }

  function create(canvas, opts) {
    var options = opts || {};
    var mediaReduce = Boolean(
      root &&
      typeof root.matchMedia === 'function' &&
      root.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    var reducedMotion = typeof options.reducedMotion === 'boolean' ? options.reducedMotion : mediaReduce;
    var viewW = (canvas && canvas.width) ? canvas.width : 800;
    var viewH = (canvas && canvas.height) ? canvas.height : 520;
    var dpr = 1;
    var animT = 0;
    var stepAccumDist = 0;
    var lastTollParcelId = '';
    var audio = attachAudioTriggers(createOutskirtsAudio());
    if (options.muted === false) {
      audio.setMuted(false);
    }

    var state = {
      worldX: Number(options.worldX) || 0,
      worldY: Number(options.worldY) || 0,
      bearingRad: typeof options.bearingRad === 'number' ? options.bearingRad : -0.35,
      speed: 0,
      hoursWalked: 0.4,
      gestureRays: [],
      activeWitness: null,
      mode: 'walk',
      wakeTrail: []
    };

    var lastProjections = [];

    function getMetrics(w, h) {
      var cw = w || viewW || 800;
      var ch = h || viewH || 520;
      var worldScale = Math.max(0.52, Math.min(1.06, Math.min(cw / 620, ch / 460)));
      return {
        w: cw,
        h: ch,
        centerX: cw * 0.5,
        centerY: ch * 0.55,
        horizonY: Math.round(ch * 0.14),
        worldScale: worldScale,
        yCompress: 0.76
      };
    }

    function projectPoint(wx, wy, m) {
      var met = m || getMetrics();
      var dx = (wx - state.worldX) * met.worldScale;
      var dy = (wy - state.worldY) * met.worldScale * met.yCompress;
      var depthFactor = Math.max(0.74, Math.min(1.18, 1 + dy / Math.max(240, met.h * 1.45)));
      return {
        x: met.centerX + dx * depthFactor,
        y: met.centerY + dy,
        scale: met.worldScale * depthFactor
      };
    }

    function screenToWorld(px, py) {
      var met = getMetrics();
      var dy = py - met.centerY;
      var depthFactor = Math.max(0.74, Math.min(1.18, 1 + dy / Math.max(240, met.h * 1.45)));
      var wx = state.worldX + (px - met.centerX) / (met.worldScale * depthFactor);
      var wy = state.worldY + dy / (met.worldScale * met.yCompress);
      return { x: wx, y: wy };
    }

    function screenToBearing(px, py) {
      var met = getMetrics();
      return Math.atan2((py - met.centerY) / met.yCompress, px - met.centerX);
    }

    function resize(width, height, nextDpr) {
      viewW = Math.max(64, Math.round(Number(width) || 800));
      viewH = Math.max(64, Math.round(Number(height) || 520));
      dpr = Math.max(1, Math.min(3, Number(nextDpr) || 1));
      if (canvas) {
        canvas.width = Math.round(viewW * dpr);
        canvas.height = Math.round(viewH * dpr);
      }
    }

    function step(dt, nextState) {
      var safeDt = Math.max(0, Math.min(0.25, Number(dt) || 0));
      var prevX = state.worldX;
      var prevY = state.worldY;

      if (nextState && typeof nextState === 'object') {
        if (typeof nextState.worldX === 'number') state.worldX = nextState.worldX;
        if (typeof nextState.worldY === 'number') state.worldY = nextState.worldY;
        if (typeof nextState.bearingRad === 'number') state.bearingRad = nextState.bearingRad;
        if (typeof nextState.speed === 'number') state.speed = nextState.speed;
        if (typeof nextState.hoursWalked === 'number') state.hoursWalked = nextState.hoursWalked;
        if (Array.isArray(nextState.gestureRays)) state.gestureRays = nextState.gestureRays;
        if ('activeWitness' in nextState) state.activeWitness = nextState.activeWitness;
        if (typeof nextState.mode === 'string') state.mode = nextState.mode;
      }

      if (!reducedMotion) {
        animT += safeDt;
      }

      var moved = Math.hypot(state.worldX - prevX, state.worldY - prevY);
      if (moved > 0.01 && moved < 900) {
        stepAccumDist += moved;
        var lastWake = state.wakeTrail[state.wakeTrail.length - 1];
        if (!lastWake || Math.hypot(state.worldX - lastWake.x, state.worldY - lastWake.y) >= 18) {
          state.wakeTrail.push({ x: state.worldX, y: state.worldY });
          if (state.wakeTrail.length > 26) state.wakeTrail.shift();
        }
        if (stepAccumDist >= 56) {
          stepAccumDist = stepAccumDist % 56;
          audio.triggerStepPulse();
        }
      }

      var cx = Math.floor(state.worldX / CELL_SIZE);
      var cy = Math.floor(state.worldY / CELL_SIZE);
      var cell = getCellData(cx, cy);
      var wheelDist = 240;
      for (var p = 0; p < cell.parcels.length; p += 1) {
        var par = cell.parcels[p];
        var d = Math.hypot(par.x - state.worldX, par.y - state.worldY);
        if (par.id === 'rusty_carnival_wheel') wheelDist = d;
        if (par.id === 'tollbooths' && d < 42 && lastTollParcelId !== par.parcelId) {
          lastTollParcelId = par.parcelId;
          audio.triggerTollboothSound();
        }
      }
      audio.stepAmbient(safeDt, reducedMotion, wheelDist, animT);
    }

    function render(overrideCtx, overrideW, overrideH) {
      var ctx = overrideCtx || (canvas && typeof canvas.getContext === 'function' ? canvas.getContext('2d') : null);
      if (!ctx) return;
      var met = getMetrics(overrideW, overrideH);

      ctx.save();
      if (!overrideCtx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      var spanX = Math.ceil(met.w / (met.worldScale * CELL_SIZE)) + 2;
      var spanY = Math.ceil(met.h / (met.worldScale * met.yCompress * CELL_SIZE)) + 2;
      var baseCx = Math.floor(state.worldX / CELL_SIZE);
      var baseCy = Math.floor(state.worldY / CELL_SIZE);
      var cells = [];
      var drawables = [];

      for (var dy = -spanY; dy <= spanY; dy += 1) {
        for (var dx = -spanX; dx <= spanX; dx += 1) {
          var cell = getCellData(baseCx + dx, baseCy + dy);
          cells.push(cell);
          for (var i = 0; i < cell.parcels.length; i += 1) {
            var par = cell.parcels[i];
            var pt = projectPoint(par.x, par.y, met);
            if (pt.x > -70 && pt.x < met.w + 70 && pt.y > met.horizonY + 4 && pt.y < met.h + 55) {
              drawables.push({
                parcel: par,
                sx: pt.x,
                sy: pt.y,
                scale: pt.scale,
                dist: Math.hypot(par.x - state.worldX, par.y - state.worldY)
              });
            }
          }
        }
      }

      drawHorizonAndPlainTracks(
        ctx,
        met.w,
        met.h,
        met.horizonY,
        state,
        function (wx, wy) { return projectPoint(wx, wy, met); },
        cells
      );

      /* Telegraph poles & sagging wires */
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, met.horizonY, met.w, met.h - met.horizonY);
      ctx.clip();
      for (var cIdx = 0; cIdx < cells.length; cIdx += 1) {
        var c0 = cells[cIdx];
        var cNext = getCellData(c0.cx + 1, c0.cy);
        var u0 = projectPoint(c0.poleX, c0.poleY, met);
        var u1 = projectPoint(cNext.poleX, cNext.poleY, met);
        if (u0.y > met.horizonY + 2 && u0.y < met.h + 20) {
          ctx.strokeStyle = 'rgba(38,36,33,0.52)';
          ctx.lineWidth = 1.05;
          ctx.beginPath();
          ctx.moveTo(u0.x, u0.y);
          ctx.lineTo(u0.x, u0.y - 16 * u0.scale);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(38,36,33,0.28)';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(u0.x, u0.y - 15 * u0.scale);
          ctx.quadraticCurveTo((u0.x + u1.x) * 0.5, (u0.y + u1.y) * 0.5 - 8 * u0.scale, u1.x, u1.y - 15 * u1.scale);
          ctx.stroke();
        }
      }

      drawables.sort(function (a, b) { return a.sy - b.sy; });
      for (var dIdx = 0; dIdx < drawables.length; dIdx += 1) {
        var dr = drawables[dIdx];
        drawStoneParcel(ctx, dr.parcel, dr.sx, dr.sy, dr.scale, animT, reducedMotion, dr.dist);
      }
      lastProjections = drawables;

      drawGestureRaysAndTraveler(
        ctx,
        met.centerX,
        met.centerY,
        state,
        function (wx, wy) { return projectPoint(wx, wy, met); },
        animT,
        reducedMotion
      );
      ctx.restore();

      /* Diegetic plain survey watermark */
      ctx.fillStyle = 'rgba(38,36,33,0.58)';
      ctx.font = '10px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(formatLimboSectorCode(state.worldX, state.worldY) + ' · WALLS / GATES: 0', 10, met.h - 10);
      ctx.restore();
    }

    function hitTest(px, py) {
      var best = null;
      var bestDist = 30;
      for (var i = 0; i < lastProjections.length; i += 1) {
        var item = lastProjections[i];
        var d = Math.hypot(px - item.sx, py - (item.sy - 8 * item.scale));
        if (d < bestDist) {
          bestDist = d;
          best = item.parcel;
        }
      }
      return best;
    }

    return {
      CANONICAL_STONES: CANONICAL_STONES,
      PALETTE: PALETTE,
      resize: resize,
      step: step,
      render: render,
      sampleSurroundings: function (wx, wy, radius) {
        return sampleSurroundings(
          typeof wx === 'number' ? wx : state.worldX,
          typeof wy === 'number' ? wy : state.worldY,
          radius
        );
      },
      findNearestWrinkleBearing: function (wx, wy, findOpts) {
        return findNearestWrinkleBearing(
          typeof wx === 'number' ? wx : state.worldX,
          typeof wy === 'number' ? wy : state.worldY,
          findOpts
        );
      },
      renderPlateFallback: renderPlateFallback,
      setReducedMotion: function (flag) { reducedMotion = Boolean(flag); },
      isReducedMotion: function () { return reducedMotion; },
      setMuted: audio.setMuted,
      isMuted: audio.isMuted,
      toggleMute: audio.toggleMute,
      unlockAudio: audio.unlockAudio,
      triggerGestureSound: audio.triggerGestureSound,
      triggerTollboothSound: audio.triggerTollboothSound,
      triggerStepPulse: audio.triggerStepPulse,
      worldToScreen: function (wx, wy) { return projectPoint(wx, wy); },
      screenToWorld: screenToWorld,
      screenToBearing: screenToBearing,
      hitTest: hitTest,
      getState: function () {
        return {
          worldX: state.worldX,
          worldY: state.worldY,
          bearingRad: state.bearingRad,
          speed: state.speed,
          hoursWalked: state.hoursWalked,
          mode: state.mode,
          reducedMotion: reducedMotion,
          muted: audio.isMuted(),
          width: viewW,
          height: viewH,
          dpr: dpr,
          wallsOrGatesCount: 0,
          limboSectorCode: formatLimboSectorCode(state.worldX, state.worldY),
          wakeLength: state.wakeTrail.length
        };
      }
    };
  }

  root.PenthesileaDilutedOutskirts = Object.freeze({
    CANONICAL_STONES: CANONICAL_STONES,
    PALETTE: PALETTE,
    CELL_SIZE: CELL_SIZE,
    create: create,
    sampleSurroundings: sampleSurroundings,
    findNearestWrinkleBearing: findNearestWrinkleBearing,
    renderPlateFallback: renderPlateFallback
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
