(function () {
  'use strict';

  var PALETTE = Object.freeze({
    abyssNight: '#090d18',
    indigoShadow: '#12192c',
    chalkMoonlight: '#eef2f7',
    lunarSilver: '#cbd7e6',
    leadMortar: '#5a6270',
    calcifiedSlag: '#363b45',
    fugitiveGold: '#e8c266',
    mortarOchre: '#9e8c6c'
  });

  var MODIFICATION_TYPES = Object.freeze([
    'dead_end_wall',
    'arcade_shifted',
    'stairway_reversed'
  ]);

  var CORNER_DEFAULTS = Object.freeze([
    Object.freeze({ id: 'turn_west_postern', index: 0, normX: 0.24, normY: 0.44, escapeAngle: -2.4 }),
    Object.freeze({ id: 'turn_lime_stair', index: 1, normX: 0.37, normY: 0.26, escapeAngle: -1.3 }),
    Object.freeze({ id: 'turn_well_arcade', index: 2, normX: 0.64, normY: 0.25, escapeAngle: -0.5 }),
    Object.freeze({ id: 'turn_cistern_bend', index: 3, normX: 0.77, normY: 0.45, escapeAngle: 0.35 }),
    Object.freeze({ id: 'turn_cypress_terrace', index: 4, normX: 0.71, normY: 0.71, escapeAngle: 1.15 }),
    Object.freeze({ id: 'turn_skein_narrows', index: 5, normX: 0.43, normY: 0.74, escapeAngle: 2.2 }),
    Object.freeze({ id: 'turn_gable_culdesac', index: 6, normX: 0.36, normY: 0.53, escapeAngle: 2.9 }),
    Object.freeze({ id: 'turn_zenith_passage', index: 7, normX: 0.56, normY: 0.47, escapeAngle: -0.9 })
  ]);

  var FOUNDER_NATIONS = Object.freeze([
    Object.freeze({
      id: 'tyrian_pilot',
      index: 0,
      nation: 'Tyrian Coast',
      role: 'founder',
      cornerId: 'turn_west_postern',
      modificationType: 'dead_end_wall',
      title: 'Transverse Limestone Blind Wall',
      ledgerNote: 'Rearranged the postern turn into a sheer wall so she could not slip seaward.'
    }),
    Object.freeze({
      id: 'persian_astrolabist',
      index: 1,
      nation: 'Isfahan Plateau',
      role: 'founder',
      cornerId: 'turn_lime_stair',
      modificationType: 'stairway_reversed',
      title: 'Reversed Dogleg Chalk Stair',
      ledgerNote: 'Inverted the ascending stairway to pitch back into an enclosed well-court.'
    }),
    Object.freeze({
      id: 'venetian_glassmaker',
      index: 2,
      nation: 'Lagoon Republic',
      role: 'founder',
      cornerId: 'turn_well_arcade',
      modificationType: 'arcade_shifted',
      title: 'Mortared Twin-Arch Arcade',
      ledgerNote: 'Bricked five moonlit arches shut with lead-gray ashlar blocks.'
    }),
    Object.freeze({
      id: 'maghrebi_geometer',
      index: 3,
      nation: 'Atlas Foothills',
      role: 'founder',
      cornerId: 'turn_cistern_bend',
      modificationType: 'dead_end_wall',
      title: 'Coiled Cistern Cul-de-Sac',
      ledgerNote: 'Bent the cistern lane inward upon itself with no outlet.'
    }),
    Object.freeze({
      id: 'anatolian_quarryman',
      index: 4,
      nation: 'Cappadocian Ridge',
      role: 'founder',
      cornerId: 'turn_cypress_terrace',
      modificationType: 'stairway_reversed',
      title: 'Sealed Terrace Lintel Stair',
      ledgerNote: 'Dropped heavy basalt-lead lintels across the upper terrace flight.'
    }),
    Object.freeze({
      id: 'iberian_horologist',
      index: 5,
      nation: 'Cordoban Watchtower',
      role: 'founder',
      cornerId: 'turn_skein_narrows',
      modificationType: 'arcade_shifted',
      title: 'Offset Colonnade Baffle',
      ledgerNote: 'Shifted the inner arcade pillars into an inescapable chicane.'
    }),
    Object.freeze({
      id: 'steppe_newcomers',
      index: 6,
      nation: 'Steppe New Arrivals',
      role: 'new_arrival',
      cornerId: 'turn_gable_culdesac',
      modificationType: 'arcade_shifted',
      title: 'Newcomer Shifted Gable Arcade',
      ledgerNote: 'Recognized something of the dream streets; shifted arcades to close the switchback.'
    }),
    Object.freeze({
      id: 'outland_latecomers',
      index: 7,
      nation: 'Outland Latecomers',
      role: 'new_arrival',
      cornerId: 'turn_zenith_passage',
      modificationType: 'dead_end_wall',
      title: 'Final Zenith Dead-End Wall',
      ledgerNote: 'Added a blank workaday wall at the last turn; nobody remembers the dream.'
    })
  ]);

  var NEW_ARRIVAL_PRIORITY = [6, 7, 0, 1, 2, 3, 4, 5];

  var LATECOMER_COHORTS = [
    { nation: 'Steppe New Arrivals', title: 'Interior Chicane Blind Wall' },
    { nation: 'Outland Latecomers', title: 'Workaday Cul-de-Sac Partition' },
    { nation: 'Caspian Masons', title: 'Bricked Cross-Alley Baffle' },
    { nation: 'Levantine Quarrymen', title: 'Sunken Stairwell Bulkhead' }
  ];

  function clamp01(v) {
    var n = Number(v);
    if (!Number.isFinite(n)) return 0;
    return n < 0 ? 0 : (n > 1 ? 1 : n);
  }

  function hashUnit(seed) {
    var x = Math.sin(seed * 127.1 + 311.7) * 43758.5453123;
    return x - Math.floor(x);
  }

  function createMasonryAudio(initialMuted) {
    var muted = Boolean(initialMuted);
    var ctx = null;
    var masterGain = null;
    var droneGain = null;
    var droneFilter = null;
    var noiseBuf = null;
    var lastEnclosure = 0;
    var lastCalc = 0;

    function buildNoiseBuffer(audioCtx) {
      var len = Math.max(1, Math.floor(audioCtx.sampleRate * 0.35));
      var buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      var data = buf.getChannelData(0);
      var s = 19731;
      for (var i = 0; i < len; i++) {
        s = (s * 16807) % 2147483647;
        data[i] = ((s / 2147483647) * 2 - 1) * Math.exp(-i / (len * 0.55));
      }
      return buf;
    }

    function initContext() {
      if (ctx) return ctx;
      try {
        var AC = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        masterGain = ctx.createGain();
        masterGain.gain.value = muted ? 0 : 0.85;
        masterGain.connect(ctx.destination);

        noiseBuf = buildNoiseBuffer(ctx);

        droneFilter = ctx.createBiquadFilter();
        droneFilter.type = 'lowpass';
        droneFilter.frequency.value = 140;
        droneFilter.Q.value = 1.2;

        droneGain = ctx.createGain();
        droneGain.gain.value = 0.0001;
        droneFilter.connect(droneGain);
        droneGain.connect(masterGain);

        var oscLow = ctx.createOscillator();
        oscLow.type = 'triangle';
        oscLow.frequency.value = 55.0;
        oscLow.connect(droneFilter);
        oscLow.start();

        var oscFifth = ctx.createOscillator();
        oscFifth.type = 'sawtooth';
        oscFifth.frequency.value = 82.5;
        var fifthTrim = ctx.createGain();
        fifthTrim.gain.value = 0.38;
        oscFifth.connect(fifthTrim);
        fifthTrim.connect(droneFilter);
        oscFifth.start();

        applyDroneLevel(lastEnclosure, lastCalc);
      } catch (_) {
        ctx = null;
      }
      return ctx;
    }

    function ensureReady(forceUnlock) {
      try {
        if (!ctx) {
          var canAuto = forceUnlock;
          if (!canAuto && typeof navigator !== 'undefined' && navigator.userActivation) {
            canAuto = Boolean(navigator.userActivation.hasBeenActive);
          }
          if (!canAuto) return null;
          initContext();
        }
        if (ctx && ctx.state === 'suspended') {
          var p = ctx.resume();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        }
      } catch (_) {}
      return ctx;
    }

    function applyDroneLevel(enclosure, calc) {
      lastEnclosure = clamp01(enclosure);
      lastCalc = clamp01(calc !== undefined ? calc : lastEnclosure);
      if (!ctx || !droneGain || !droneFilter) return;
      try {
        var now = ctx.currentTime;
        var target = (!muted && lastEnclosure > 0.01)
          ? (0.008 + lastEnclosure * 0.036 + lastCalc * 0.016)
          : 0.0001;
        droneGain.gain.setTargetAtTime(target, now, 0.18);
        droneFilter.frequency.setTargetAtTime(125 + lastEnclosure * 125, now, 0.22);
      } catch (_) {}
    }

    function triggerFootstepEcho(dreamMemoryArg) {
      if (muted) return;
      var ac = ensureReady(false);
      if (!ac || !masterGain) return;
      try {
        var dm = clamp01(dreamMemoryArg !== undefined ? dreamMemoryArg : 1);
        var now = ac.currentTime;
        var taps = dm > 0.25 ? [0, 0.115, 0.24] : [0, 0.13];
        for (var i = 0; i < taps.length; i++) {
          var t0 = now + taps[i];
          var fade = i === 2 ? dm * 0.42 : (i === 1 ? 0.78 : 1.0);
          var stepOsc = ac.createOscillator();
          var stepGain = ac.createGain();
          stepOsc.type = dm > 0.3 ? 'sine' : 'triangle';
          var baseHz = 185 + dm * 390 - i * 32;
          stepOsc.frequency.setValueAtTime(baseHz, t0);
          stepOsc.frequency.exponentialRampToValueAtTime(Math.max(72, baseHz * 0.46), t0 + 0.045 + dm * 0.05);
          stepGain.gain.setValueAtTime(0.0001, t0);
          stepGain.gain.linearRampToValueAtTime(0.065 * fade, t0 + 0.005);
          stepGain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.042 + dm * 0.085);
          stepOsc.connect(stepGain);
          stepGain.connect(masterGain);
          stepOsc.start(t0);
          stepOsc.stop(t0 + 0.15);
        }

        if (dm > 0.02) {
          var shimA = ac.createOscillator();
          var shimB = ac.createOscillator();
          var shimGain = ac.createGain();
          shimA.type = 'sine';
          shimB.type = 'sine';
          shimA.frequency.setValueAtTime(587.33, now + 0.01);
          shimB.frequency.setValueAtTime(880.0, now + 0.02);
          shimB.frequency.linearRampToValueAtTime(896.0, now + 0.34);
          shimGain.gain.setValueAtTime(0.0001, now + 0.01);
          shimGain.gain.linearRampToValueAtTime(0.036 * dm, now + 0.06);
          shimGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
          shimA.connect(shimGain);
          shimB.connect(shimGain);
          shimGain.connect(masterGain);
          shimA.start(now + 0.01);
          shimB.start(now + 0.02);
          shimA.stop(now + 0.38);
          shimB.stop(now + 0.38);
        }
      } catch (_) {}
    }

    function triggerMasonryStrike(enclosureArg, modType) {
      var er = clamp01(enclosureArg);
      applyDroneLevel(er, er);
      if (muted) return;
      var ac = ensureReady(false);
      if (!ac || !masterGain) return;
      try {
        var now = ac.currentTime;
        var thud = ac.createOscillator();
        var thudGain = ac.createGain();
        thud.type = 'triangle';
        var startHz = modType === 'stairway_reversed' ? 132 : (modType === 'arcade_shifted' ? 118 : 104);
        thud.frequency.setValueAtTime(startHz - er * 18, now);
        thud.frequency.exponentialRampToValueAtTime(42, now + 0.17);
        thudGain.gain.setValueAtTime(0.0001, now);
        thudGain.gain.linearRampToValueAtTime(0.14, now + 0.008);
        thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);
        thud.connect(thudGain);
        thudGain.connect(masterGain);
        thud.start(now);
        thud.stop(now + 0.21);

        if (noiseBuf) {
          var src = ac.createBufferSource();
          src.buffer = noiseBuf;
          var bp = ac.createBiquadFilter();
          bp.type = 'bandpass';
          bp.frequency.setValueAtTime(modType === 'arcade_shifted' ? 1240 : 920, now);
          bp.frequency.exponentialRampToValueAtTime(520, now + 0.14);
          bp.Q.value = 2.4;
          var scGain = ac.createGain();
          scGain.gain.setValueAtTime(0.0001, now + 0.012);
          scGain.gain.linearRampToValueAtTime(0.085, now + 0.025);
          scGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
          src.connect(bp);
          bp.connect(scGain);
          scGain.connect(masterGain);
          src.start(now + 0.01);
          src.stop(now + 0.17);
        }
      } catch (_) {}
    }

    return {
      unlockAudio: function () {
        var ac = ensureReady(true);
        applyDroneLevel(lastEnclosure, lastCalc);
        return Boolean(ac);
      },
      setMuted: function (m) {
        muted = Boolean(m);
        if (ctx && masterGain) {
          try {
            masterGain.gain.setTargetAtTime(muted ? 0 : 0.85, ctx.currentTime, 0.05);
          } catch (_) {}
        }
        applyDroneLevel(lastEnclosure, lastCalc);
        return muted;
      },
      toggleMute: function () {
        return this.setMuted(!muted);
      },
      isMuted: function () {
        return muted;
      },
      triggerFootstepEcho: triggerFootstepEcho,
      triggerMasonryStrike: triggerMasonryStrike,
      syncWorkadayDrone: applyDroneLevel,
      destroy: function () {
        if (ctx) {
          try { ctx.close(); } catch (_) {}
          ctx = null;
        }
      }
    };
  }

  function createTrapEngine(opts) {
    var options = opts && typeof opts === 'object' ? opts : {};
    var onWallsChanged = typeof options.onWallsChanged === 'function' ? options.onWallsChanged : null;
    var reducedMotion = Boolean(options.reducedMotion);
    var audio = createMasonryAudio(Boolean(options.muted));

    var blockedMap = new Map();
    var extraBaffles = [];
    var dustPuffs = [];
    var clock = 0;
    var builtCounter = 0;
    var extraDeadEnds = 0;
    var newArrivalWallsCount = 0;
    var masonryOpsCount = 0;
    var blockedCount = 0;
    var enclosureRatio = 0;
    var dreamMemory = 1;
    var workadayCalcification = 0;
    var phaseLabel = 'Open Moonlit Dream';
    var notifying = false;

    function resolveCorner(cornerIdOrIndex) {
      if (cornerIdOrIndex === null || cornerIdOrIndex === undefined) return null;
      if (typeof cornerIdOrIndex === 'object') {
        if (typeof cornerIdOrIndex.cornerId === 'string') return resolveCorner(cornerIdOrIndex.cornerId);
        if (typeof cornerIdOrIndex.id === 'string') return resolveCorner(cornerIdOrIndex.id);
        if (Number.isInteger(cornerIdOrIndex.index)) return resolveCorner(cornerIdOrIndex.index);
      }
      if (typeof cornerIdOrIndex === 'number' || (typeof cornerIdOrIndex === 'string' && /^[0-7]$/.test(cornerIdOrIndex))) {
        var idx = Number(cornerIdOrIndex);
        return CORNER_DEFAULTS[idx] || null;
      }
      if (typeof cornerIdOrIndex === 'string') {
        for (var i = 0; i < CORNER_DEFAULTS.length; i++) {
          if (CORNER_DEFAULTS[i].id === cornerIdOrIndex) return CORNER_DEFAULTS[i];
        }
      }
      return null;
    }

    function resolveFounder(founderIdOrIndex) {
      if (founderIdOrIndex === null || founderIdOrIndex === undefined) return null;
      if (typeof founderIdOrIndex === 'object' && founderIdOrIndex.nation) return founderIdOrIndex;
      if (typeof founderIdOrIndex === 'number' || (typeof founderIdOrIndex === 'string' && /^[0-7]$/.test(founderIdOrIndex))) {
        return FOUNDER_NATIONS[Number(founderIdOrIndex)] || null;
      }
      if (typeof founderIdOrIndex === 'string') {
        for (var i = 0; i < FOUNDER_NATIONS.length; i++) {
          if (FOUNDER_NATIONS[i].id === founderIdOrIndex || FOUNDER_NATIONS[i].cornerId === founderIdOrIndex) {
            return FOUNDER_NATIONS[i];
          }
        }
      }
      return null;
    }

    function recomputeMetrics() {
      blockedCount = blockedMap.size;
      enclosureRatio = +(blockedCount / 8).toFixed(4);
      dreamMemory = blockedCount >= 8 ? 0 : +(Math.pow(1 - enclosureRatio, 1.35)).toFixed(4);
      workadayCalcification = +(Math.min(
        1,
        enclosureRatio * 0.88 + Math.min(0.12, extraDeadEnds * 0.04) + (blockedCount === 8 ? 0.12 : 0)
      )).toFixed(4);
      if (blockedCount <= 0) {
        phaseLabel = 'Open Moonlit Dream';
      } else if (blockedCount <= 5) {
        phaseLabel = 'Founders Rearranging Walls';
      } else if (blockedCount <= 7) {
        phaseLabel = 'Calcifying Workspace';
      } else {
        phaseLabel = 'Ugly Workaday Trap \u2014 Total Amnesia';
      }
    }

    function spawnMortarDust(normX, normY, count) {
      if (reducedMotion) return;
      var n = count || 7;
      for (var i = 0; i < n && dustPuffs.length < 64; i++) {
        var seed = builtCounter * 17 + extraDeadEnds * 31 + i * 7;
        var ang = hashUnit(seed) * Math.PI * 2;
        var spd = 0.014 + hashUnit(seed + 1) * 0.028;
        dustPuffs.push({
          normX: normX + (hashUnit(seed + 2) - 0.5) * 0.02,
          normY: normY + (hashUnit(seed + 3) - 0.5) * 0.02,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 0.008,
          radiusNorm: 0.004 + hashUnit(seed + 4) * 0.007,
          alpha: 0.62
        });
      }
    }

    function addInteriorBaffle(modType, nation) {
      var seq = extraBaffles.length;
      var goldenAngle = seq * 2.399963 + 0.65;
      var ringRadius = 0.075 + ((seq * 0.043) % 0.175);
      var nx = +(0.5 + Math.cos(goldenAngle) * ringRadius * 1.12).toFixed(4);
      var ny = +(0.52 + Math.sin(goldenAngle) * ringRadius * 0.94).toFixed(4);
      if (extraBaffles.length < 28) {
        extraBaffles.push({
          id: 'baffle_' + (seq + 1),
          normX: nx,
          normY: ny,
          angle: goldenAngle + Math.PI * 0.5,
          modificationType: modType || 'dead_end_wall',
          nation: nation || 'Outland Latecomers',
          thickness: 1 + Math.floor(seq / 6),
          dropProgress: reducedMotion ? 1 : 0
        });
      }
      spawnMortarDust(nx, ny, 6);
    }

    function getBlockedRecords() {
      var list = [];
      for (var i = 0; i < CORNER_DEFAULTS.length; i++) {
        var rec = blockedMap.get(CORNER_DEFAULTS[i].id);
        if (rec) {
          list.push({
            cornerId: rec.cornerId,
            index: rec.index,
            founderId: rec.founderId,
            modificationType: rec.modificationType,
            nation: rec.nation,
            role: rec.role,
            title: rec.title,
            ledgerNote: rec.ledgerNote,
            thickness: rec.thickness
          });
        }
      }
      return list;
    }

    function getState() {
      var records = getBlockedRecords();
      return {
        founders: FOUNDER_NATIONS.slice(),
        blockedRecords: records,
        blockedCornerIds: records.map(function (r) { return r.cornerId; }),
        blockedCount: blockedCount,
        totalCorners: 8,
        enclosureRatio: enclosureRatio,
        dreamMemory: dreamMemory,
        workadayCalcification: workadayCalcification,
        extraDeadEnds: extraDeadEnds,
        newArrivalWallsCount: newArrivalWallsCount,
        masonryOpsCount: masonryOpsCount,
        phaseLabel: phaseLabel,
        firstFoundersBaffled: enclosureRatio >= 0.75,
        womanEverSeenAgain: false,
        muted: audio.isMuted()
      };
    }

    function notifyChanged() {
      if (!onWallsChanged || notifying) return;
      notifying = true;
      try {
        onWallsChanged(getState(), getBlockedRecords());
      } finally {
        notifying = false;
      }
    }

    function rearrangeCorner(cornerIdOrIndex, modTypeOptional, actorOptional) {
      var corner = resolveCorner(cornerIdOrIndex);
      if (!corner) return getState();
      var actor = resolveFounder(actorOptional) || FOUNDER_NATIONS[corner.index];
      var existing = blockedMap.get(corner.id);

      if (!existing) {
        var mod = MODIFICATION_TYPES.indexOf(modTypeOptional) >= 0 ? modTypeOptional : actor.modificationType;
        blockedMap.set(corner.id, {
          cornerId: corner.id,
          index: corner.index,
          founderId: actor.id,
          nation: actor.nation,
          role: actor.role,
          modificationType: mod,
          title: actor.title,
          ledgerNote: actor.ledgerNote,
          thickness: 1,
          dropProgress: reducedMotion ? 1 : 0,
          builtOrder: ++builtCounter
        });
        if (actor.role === 'new_arrival') newArrivalWallsCount += 1;
        spawnMortarDust(corner.normX, corner.normY, 8);
      } else {
        existing.thickness += 1;
        existing.dropProgress = reducedMotion ? 1 : 0.35;
        if (MODIFICATION_TYPES.indexOf(modTypeOptional) >= 0) {
          existing.modificationType = modTypeOptional;
        } else {
          var nextIdx = (MODIFICATION_TYPES.indexOf(existing.modificationType) + 1) % MODIFICATION_TYPES.length;
          existing.modificationType = MODIFICATION_TYPES[nextIdx];
        }
        extraDeadEnds += 1;
        if (actor && actor.role === 'new_arrival') newArrivalWallsCount += 1;
        addInteriorBaffle(existing.modificationType, actor.nation);
        spawnMortarDust(corner.normX, corner.normY, 6);
      }

      masonryOpsCount += 1;
      recomputeMetrics();
      var activeRec = blockedMap.get(corner.id);
      audio.triggerMasonryStrike(enclosureRatio, activeRec ? activeRec.modificationType : 'dead_end_wall');
      audio.syncWorkadayDrone(enclosureRatio, workadayCalcification);
      notifyChanged();
      return getState();
    }

    function invokeFounder(founderIdOrIndex) {
      var founder = resolveFounder(founderIdOrIndex) || FOUNDER_NATIONS[0];
      return rearrangeCorner(founder.cornerId, founder.modificationType, founder);
    }

    function summonNewArrivalWave() {
      var targetIdx = -1;
      for (var i = 0; i < NEW_ARRIVAL_PRIORITY.length; i++) {
        var cand = NEW_ARRIVAL_PRIORITY[i];
        if (!blockedMap.has(CORNER_DEFAULTS[cand].id)) {
          targetIdx = cand;
          break;
        }
      }
      if (targetIdx >= 0) {
        if (targetIdx === 6 || targetIdx === 7) return invokeFounder(targetIdx);
        var cohort = LATECOMER_COHORTS[newArrivalWallsCount % LATECOMER_COHORTS.length];
        var waveMod = MODIFICATION_TYPES[newArrivalWallsCount % MODIFICATION_TYPES.length];
        return rearrangeCorner(targetIdx, waveMod, {
          id: 'latecomer_wave_' + (newArrivalWallsCount + 1),
          index: targetIdx,
          nation: cohort.nation,
          role: 'new_arrival',
          cornerId: CORNER_DEFAULTS[targetIdx].id,
          modificationType: waveMod,
          title: cohort.title,
          ledgerNote: 'New arrivals recognized the dream streets and walled off another turn.'
        });
      }

      var overCohort = LATECOMER_COHORTS[newArrivalWallsCount % LATECOMER_COHORTS.length];
      var overMod = MODIFICATION_TYPES[extraDeadEnds % MODIFICATION_TYPES.length];
      extraDeadEnds += 1;
      newArrivalWallsCount += 1;
      masonryOpsCount += 1;
      var reinforceCorner = CORNER_DEFAULTS[(extraDeadEnds - 1) % CORNER_DEFAULTS.length];
      var rRec = blockedMap.get(reinforceCorner.id);
      if (rRec) rRec.thickness += 1;
      addInteriorBaffle(overMod, overCohort.nation);
      recomputeMetrics();
      audio.triggerMasonryStrike(enclosureRatio, overMod);
      audio.syncWorkadayDrone(enclosureRatio, workadayCalcification);
      notifyChanged();
      return getState();
    }

    function sealAllCorners() {
      for (var i = 0; i < CORNER_DEFAULTS.length; i++) {
        var c = CORNER_DEFAULTS[i];
        if (!blockedMap.has(c.id)) {
          var f = FOUNDER_NATIONS[i];
          blockedMap.set(c.id, {
            cornerId: c.id,
            index: i,
            founderId: f.id,
            nation: f.nation,
            role: f.role,
            modificationType: f.modificationType,
            title: f.title,
            ledgerNote: f.ledgerNote,
            thickness: 1,
            dropProgress: reducedMotion ? 1 : 0,
            builtOrder: ++builtCounter
          });
          if (f.role === 'new_arrival') newArrivalWallsCount += 1;
          masonryOpsCount += 1;
          spawnMortarDust(c.normX, c.normY, 5);
        }
      }
      recomputeMetrics();
      audio.triggerMasonryStrike(1, 'dead_end_wall');
      audio.syncWorkadayDrone(1, workadayCalcification);
      notifyChanged();
      return getState();
    }

    function reset() {
      blockedMap.clear();
      extraBaffles.length = 0;
      dustPuffs.length = 0;
      clock = 0;
      builtCounter = 0;
      extraDeadEnds = 0;
      newArrivalWallsCount = 0;
      masonryOpsCount = 0;
      recomputeMetrics();
      audio.syncWorkadayDrone(0, 0);
      notifyChanged();
      return getState();
    }

    function step(dtSec, reducedMotionArg) {
      var rm = typeof reducedMotionArg === 'object' && reducedMotionArg !== null
        ? Boolean(reducedMotionArg.reducedMotion)
        : (reducedMotionArg !== undefined ? Boolean(reducedMotionArg) : reducedMotion);
      var dt = Math.max(0, Math.min(0.1, Number(dtSec) || 0.016));
      if (rm) {
        dustPuffs.length = 0;
        blockedMap.forEach(function (rec) { rec.dropProgress = 1; });
        for (var b = 0; b < extraBaffles.length; b++) extraBaffles[b].dropProgress = 1;
        return;
      }
      clock += dt;
      blockedMap.forEach(function (rec) {
        if (rec.dropProgress < 1) rec.dropProgress = Math.min(1, rec.dropProgress + dt * 3.4);
      });
      for (var j = 0; j < extraBaffles.length; j++) {
        if (extraBaffles[j].dropProgress < 1) {
          extraBaffles[j].dropProgress = Math.min(1, extraBaffles[j].dropProgress + dt * 3.2);
        }
      }
      for (var k = dustPuffs.length - 1; k >= 0; k--) {
        var p = dustPuffs[k];
        p.normX += p.vx * dt;
        p.normY += p.vy * dt;
        p.alpha -= dt * 0.88;
        if (p.alpha <= 0.01) dustPuffs.splice(k, 1);
      }
    }

    function resolveCornerCoords(width, height, cornersWithPixelXY) {
      var byId = {};
      if (Array.isArray(cornersWithPixelXY)) {
        for (var i = 0; i < cornersWithPixelXY.length; i++) {
          var item = cornersWithPixelXY[i];
          if (item && (item.id || item.cornerId)) byId[item.id || item.cornerId] = item;
        }
      }
      var out = [];
      for (var j = 0; j < CORNER_DEFAULTS.length; j++) {
        var def = CORNER_DEFAULTS[j];
        var src = byId[def.id];
        var px = src && Number.isFinite(src.x) ? src.x : (src && Number.isFinite(src.normX) ? src.normX * width : def.normX * width);
        var py = src && Number.isFinite(src.y) ? src.y : (src && Number.isFinite(src.normY) ? src.normY * height : def.normY * height);
        var ang = src && Number.isFinite(src.escapeAngle) ? src.escapeAngle : def.escapeAngle;
        out.push({ id: def.id, index: j, x: px, y: py, escapeAngle: ang });
      }
      return out;
    }

    function drawMasonryGlyph(ctx, modType, u, thickness) {
      var extra = Math.min(3, Math.max(0, (thickness || 1) - 1));
      var w = u * (1.75 + extra * 0.16);
      var h = u * (0.72 + extra * 0.18);

      ctx.fillStyle = PALETTE.abyssNight;
      ctx.globalAlpha = 0.66;
      ctx.beginPath();
      ctx.moveTo(-w * 0.52, 0);
      ctx.lineTo(w * 0.52, 0);
      ctx.lineTo(w * 0.78, u * 1.45);
      ctx.lineTo(-w * 0.78, u * 1.45);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;

      if (modType === 'arcade_shifted') {
        ctx.fillStyle = PALETTE.calcifiedSlag;
        ctx.fillRect(-w * 0.52, -h * 0.55, w * 1.04, h * 0.95);
        for (var a = -1; a <= 1; a++) {
          var ax = a * (w * 0.31);
          ctx.fillStyle = PALETTE.abyssNight;
          ctx.beginPath();
          ctx.arc(ax, -h * 0.05, u * 0.2, Math.PI, 0, false);
          ctx.lineTo(ax + u * 0.2, h * 0.36);
          ctx.lineTo(ax - u * 0.2, h * 0.36);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = PALETTE.leadMortar;
          ctx.fillRect(ax - u * 0.17, -h * 0.06, u * 0.34, h * 0.38);
          ctx.strokeStyle = PALETTE.mortarOchre;
          ctx.lineWidth = 1;
          ctx.strokeRect(ax - u * 0.17, -h * 0.06, u * 0.34, h * 0.38);
        }
        ctx.fillStyle = PALETTE.leadMortar;
        ctx.fillRect(-w * 0.46, h * 0.32, w * 0.68, h * 0.34);
        ctx.strokeStyle = PALETTE.mortarOchre;
        ctx.strokeRect(-w * 0.52, -h * 0.55, w * 1.04, h * 0.95);
      } else if (modType === 'stairway_reversed') {
        ctx.fillStyle = PALETTE.abyssNight;
        ctx.fillRect(-w * 0.48, -h * 0.62, w * 0.96, h * 1.24);
        var steps = 5;
        for (var s = 0; s < steps; s++) {
          var sy = -h * 0.54 + (s / steps) * (h * 1.02);
          ctx.fillStyle = s % 2 === 0 ? PALETTE.leadMortar : PALETTE.calcifiedSlag;
          ctx.fillRect(-w * 0.42 + s * 1.2, sy, w * 0.84 - s * 2.4, (h * 0.96) / steps);
        }
        ctx.fillStyle = PALETTE.calcifiedSlag;
        ctx.fillRect(-w * 0.54, -h * 0.68, w * 1.08, h * 0.28);
        ctx.strokeStyle = PALETTE.mortarOchre;
        ctx.lineWidth = 1.25;
        ctx.strokeRect(-w * 0.48, -h * 0.62, w * 0.96, h * 1.24);
        ctx.beginPath();
        ctx.moveTo(0, h * 0.42);
        ctx.lineTo(0, -h * 0.26);
        ctx.moveTo(-u * 0.18, -h * 0.06);
        ctx.lineTo(0, -h * 0.28);
        ctx.lineTo(u * 0.18, -h * 0.06);
        ctx.stroke();
      } else {
        ctx.fillStyle = PALETTE.calcifiedSlag;
        ctx.fillRect(-w * 0.52, -h * 0.52, w * 1.04, h * 1.04);
        var rows = 3 + Math.min(2, extra);
        var rowH = (h * 1.04) / rows;
        ctx.strokeStyle = PALETTE.mortarOchre;
        ctx.lineWidth = 1;
        for (var r = 0; r < rows; r++) {
          var ry = -h * 0.52 + r * rowH;
          ctx.fillStyle = r % 2 === 0 ? PALETTE.leadMortar : PALETTE.calcifiedSlag;
          ctx.fillRect(-w * 0.5, ry + 0.8, w, rowH - 1.6);
          var joints = r % 2 === 0 ? [-0.18, 0.22] : [-0.32, 0.04, 0.34];
          for (var m = 0; m < joints.length; m++) {
            ctx.beginPath();
            ctx.moveTo(w * joints[m], ry);
            ctx.lineTo(w * joints[m], ry + rowH);
            ctx.stroke();
          }
        }
        ctx.strokeRect(-w * 0.52, -h * 0.52, w * 1.04, h * 1.04);
      }
    }

    function renderTrapMasonry(ctx, width, height, cornersWithPixelXY, env) {
      if (!ctx || !(width > 0) || !(height > 0)) return;
      if (blockedCount === 0 && extraBaffles.length === 0 && dustPuffs.length === 0) return;

      var e = env && typeof env === 'object' ? env : {};
      var er = e.enclosureRatio !== undefined ? clamp01(e.enclosureRatio) : enclosureRatio;
      var calc = e.workadayCalcification !== undefined ? clamp01(e.workadayCalcification) : workadayCalcification;
      var rm = e.reducedMotion !== undefined ? Boolean(e.reducedMotion) : reducedMotion;
      var coords = resolveCornerCoords(width, height, cornersWithPixelXY);
      var u = Math.max(11, Math.min(23, Math.min(width, height) * 0.029));

      ctx.save();
      if (calc > 0.02) {
        ctx.fillStyle = PALETTE.calcifiedSlag;
        ctx.globalAlpha = 0.05 + calc * 0.22;
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
      }

      var sealedPts = [];
      for (var i = 0; i < coords.length; i++) {
        if (blockedMap.has(coords[i].id)) sealedPts.push(coords[i]);
      }

      if (sealedPts.length >= 2) {
        ctx.save();
        ctx.strokeStyle = PALETTE.mortarOchre;
        ctx.globalAlpha = 0.16 + er * 0.24;
        ctx.lineWidth = 1.1;
        ctx.setLineDash([4, 5]);
        ctx.beginPath();
        for (var p = 0; p < sealedPts.length; p++) {
          var aPt = sealedPts[p];
          var bPt = sealedPts[(p + 1) % sealedPts.length];
          ctx.moveTo(aPt.x, aPt.y);
          ctx.lineTo(bPt.x, bPt.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        for (var cIdx = 0; cIdx < sealedPts.length; cIdx++) {
          var p0 = sealedPts[cIdx];
          var p1 = sealedPts[(cIdx + 1) % sealedPts.length];
          var rawPhase = rm ? 0.5 : ((clock * 0.28 + cIdx * 0.31) % 2);
          var t = rawPhase <= 1 ? rawPhase : (2 - rawPhase);
          var cx = p0.x + (p1.x - p0.x) * t;
          var cy = p0.y + (p1.y - p0.y) * t;
          ctx.fillStyle = PALETTE.mortarOchre;
          ctx.globalAlpha = 0.28 + calc * 0.42;
          ctx.fillRect(cx - 2.2, cy - 2.2, 4.4, 4.4);
        }
        ctx.restore();
      }

      for (var b = 0; b < extraBaffles.length; b++) {
        var baf = extraBaffles[b];
        ctx.save();
        var dropB = (1 - (baf.dropProgress !== undefined ? baf.dropProgress : 1)) * -7;
        ctx.translate(baf.normX * width, baf.normY * height + dropB);
        ctx.rotate(baf.angle);
        drawMasonryGlyph(ctx, baf.modificationType, u * 0.76, baf.thickness);
        ctx.restore();
      }

      for (var m = 0; m < coords.length; m++) {
        var c = coords[m];
        var rec = blockedMap.get(c.id);
        if (!rec) continue;
        ctx.save();
        var dropY = (1 - (rec.dropProgress !== undefined ? rec.dropProgress : 1)) * -9;
        ctx.translate(c.x, c.y + dropY);
        ctx.save();
        ctx.rotate(c.escapeAngle - Math.PI * 0.5);
        drawMasonryGlyph(ctx, rec.modificationType, u, rec.thickness);
        ctx.restore();

        ctx.strokeStyle = PALETTE.mortarOchre;
        ctx.globalAlpha = 0.72;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, u * 0.48);
        ctx.lineTo(0, u * 1.02);
        ctx.stroke();
        ctx.fillStyle = PALETTE.mortarOchre;
        ctx.beginPath();
        ctx.arc(0, u * 1.08, 2.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (!rm && dustPuffs.length > 0) {
        var minDim = Math.min(width, height);
        for (var d = 0; d < dustPuffs.length; d++) {
          var puff = dustPuffs[d];
          ctx.fillStyle = PALETTE.mortarOchre;
          ctx.globalAlpha = Math.max(0, puff.alpha * 0.55);
          ctx.beginPath();
          ctx.arc(puff.normX * width, puff.normY * height, puff.radiusNorm * minDim, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    return {
      rearrangeCorner: rearrangeCorner,
      invokeFounder: invokeFounder,
      summonNewArrivalWave: summonNewArrivalWave,
      sealAllCorners: sealAllCorners,
      getBlockedRecords: getBlockedRecords,
      step: step,
      renderTrapMasonry: renderTrapMasonry,
      unlockAudio: audio.unlockAudio,
      setMuted: audio.setMuted,
      toggleMute: audio.toggleMute,
      isMuted: audio.isMuted,
      triggerFootstepEcho: audio.triggerFootstepEcho,
      triggerMasonryStrike: audio.triggerMasonryStrike,
      syncWorkadayDrone: audio.syncWorkadayDrone,
      setReducedMotion: function (rm) { reducedMotion = Boolean(rm); },
      getState: getState,
      reset: reset,
      destroy: function () { audio.destroy(); }
    };
  }

  var API = Object.freeze({
    PALETTE: PALETTE,
    FOUNDER_NATIONS: FOUNDER_NATIONS,
    MODIFICATION_TYPES: MODIFICATION_TYPES,
    CORNER_DEFAULTS: CORNER_DEFAULTS,
    createTrapEngine: createTrapEngine
  });

  globalThis.ZobeideTrapCalcification = API;
  if (typeof window !== 'undefined') {
    window.ZobeideTrapCalcification = API;
  }
})();
