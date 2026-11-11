/*
 * Stony Ground Acoustics & Nocturnal Bone-Conduction Engine for Argia
 * Medium: 100% packed clay, damp black loam, and limestone overburden (0% air).
 * All comments use block syntax; zero external URLs or generic air-reverb paths.
 */
(function (root) {
  'use strict';

  var ACOUSTIC_CONSTANTS = Object.freeze({
    AIR_FRACTION: 0,
    PACKED_EARTH_FRACTION: 1.0,
    CLAY_PWAVE_MPS: 1850,
    CLAY_SWAVE_MPS: 620,
    NIGHT_THRESHOLD: 0.65
  });

  var DEFAULT_BURIED_DOORS = Object.freeze([
    Object.freeze({
      id: 'west_colonnade_lintel',
      label: 'West Packed-Colonnade Threshold',
      normX: 0.21,
      normY: 0.56,
      depthMeters: 19.5
    }),
    Object.freeze({
      id: 'negative_stair_portal',
      label: 'Negative-Stair Vault Portal',
      normX: 0.42,
      normY: 0.68,
      depthMeters: 28.0
    }),
    Object.freeze({
      id: 'coffered_clay_cellar',
      label: 'Coffered Clay-Chamber Slab Door',
      normX: 0.64,
      normY: 0.76,
      depthMeters: 36.5
    }),
    Object.freeze({
      id: 'abyssal_limestone_gate',
      label: 'Deep Ashlar Seam Threshold',
      normX: 0.81,
      normY: 0.85,
      depthMeters: 44.5
    })
  ]);

  function clamp01(val) {
    var num = Number(val);
    if (!Number.isFinite(num)) {
      return 0;
    }
    if (num < 0) {
      return 0;
    }
    if (num > 1) {
      return 1;
    }
    return num;
  }

  function normalizePhase(norm01) {
    var num = Number(norm01);
    if (!Number.isFinite(num)) {
      return 0.5;
    }
    if (num === 1) {
      return 0;
    }
    var wrapped = ((num % 1) + 1) % 1;
    return Number(wrapped.toFixed(6));
  }

  function computeNightFactor(timeOfDay) {
    /* 0.0 is deep midnight (1.0), 0.5 is harsh barren noon (0.0) */
    var raw = 0.5 * (1 + Math.cos(timeOfDay * Math.PI * 2));
    return clamp01(Number(raw.toFixed(6)));
  }

  function roundTo(val, digits) {
    var factor = Math.pow(10, digits || 4);
    return Math.round(val * factor) / factor;
  }

  function nowMs() {
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      return Math.round(performance.now());
    }
    return Date.now();
  }

  function cloneDoor(door, idx) {
    var fallback = DEFAULT_BURIED_DOORS[idx % DEFAULT_BURIED_DOORS.length];
    var depth = Number(door && door.depthMeters);
    if (!Number.isFinite(depth) || depth <= 0) {
      depth = fallback.depthMeters;
    }
    return {
      id: String((door && door.id) || fallback.id),
      label: String((door && door.label) || fallback.label),
      normX: clamp01(door && door.normX !== undefined ? door.normX : fallback.normX),
      normY: clamp01(door && door.normY !== undefined ? door.normY : fallback.normY),
      depthMeters: roundTo(depth, 2)
    };
  }

  function normalizeDoorList(doors) {
    if (!Array.isArray(doors) || doors.length === 0) {
      return DEFAULT_BURIED_DOORS.map(function (d, i) {
        return cloneDoor(d, i);
      });
    }
    return doors.map(function (d, i) {
      return cloneDoor(d, i);
    });
  }

  function cloneSlamEvent(ev) {
    if (!ev) {
      return null;
    }
    return {
      doorId: ev.doorId,
      label: ev.label,
      depthMeters: ev.depthMeters,
      originNormX: ev.originNormX,
      originNormY: ev.originNormY,
      heardAtSurface: ev.heardAtSurface,
      reason: ev.reason,
      pWaveMs: ev.pWaveMs,
      sWaveMs: ev.sWaveMs,
      timestampMs: ev.timestampMs
    };
  }

  function hasGestureActivation() {
    if (typeof navigator === 'undefined') {
      return false;
    }
    if (navigator.userActivation && typeof navigator.userActivation.hasBeenActive === 'boolean') {
      return navigator.userActivation.hasBeenActive;
    }
    return true;
  }

  function nextSpontaneousIntervalSec(seqIndex) {
    /* Deterministic cadence inside 5.0..7.5 seconds while ear is pressed at night */
    var offset = ((seqIndex * 0.89) % 2.25);
    return roundTo(5.15 + offset, 2);
  }

  function createGroundAcoustics(config) {
    var cfg = config || {};
    var initialNight = Boolean(cfg.initialNight);
    var initialTimeOfDay = typeof cfg.initialTimeOfDay === 'number'
      ? normalizePhase(cfg.initialTimeOfDay)
      : (initialNight ? 0.0 : 0.5);

    var reducedMotion = Boolean(cfg.reducedMotion);
    var muted = Boolean(cfg.muted);
    var timeOfDay = initialTimeOfDay;
    var nightFactor = computeNightFactor(timeOfDay);
    var isNight = nightFactor >= ACOUSTIC_CONSTANTS.NIGHT_THRESHOLD;
    var earPressed = false;
    var earNormX = 0.5;

    var buriedDoors = normalizeDoorList(cfg.buriedDoors);
    var doorCursor = 0;
    var doorSlamCount = 0;
    var heardDoorSlamCount = 0;
    var lastDoorSlam = null;
    var activeWaves = [];
    var slamListeners = [];

    var elapsedSec = 0;
    var slamPulse = 0;
    var spontaneousSeq = 0;
    var spontaneousRemainingSec = nextSpontaneousIntervalSec(0);

    var audioCtx = null;
    var masterGain = null;
    var masterLowpass = null;
    var tremorBedGain = null;
    var tremorFilter = null;
    var shearNoiseBuffer = null;
    var audioUnlocked = false;

    function buildDeterministicBuffers(ctx) {
      var rate = ctx.sampleRate || 44100;
      var shearLen = Math.max(256, Math.floor(rate * 0.11));
      var shearBuf = ctx.createBuffer(1, shearLen, rate);
      var shearData = shearBuf.getChannelData(0);
      var seed = 42019;
      var prev = 0;
      var i;
      for (i = 0; i < shearLen; i += 1) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        var white = (seed / 2147483648) - 1.0;
        var env = Math.exp(-i / (shearLen * 0.28));
        prev = prev * 0.76 + white * 0.24;
        shearData[i] = prev * env * 0.9;
      }
      shearNoiseBuffer = shearBuf;

      var bedLen = Math.max(1024, Math.floor(rate * 2.4));
      var bedBuf = ctx.createBuffer(1, bedLen, rate);
      var bedData = bedBuf.getChannelData(0);
      var brown = 0;
      for (i = 0; i < bedLen; i += 1) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        var w = (seed / 2147483648) - 1.0;
        brown = (brown + 0.025 * w) / 1.025;
        var seamMod = 0.65 + 0.35 * Math.sin((i / bedLen) * Math.PI * 6);
        bedData[i] = brown * 2.6 * seamMod;
      }
      return bedBuf;
    }

    function syncTremorBed() {
      if (!audioCtx || !tremorBedGain || !masterGain) {
        return;
      }
      try {
        var t = audioCtx.currentTime;
        masterGain.gain.setTargetAtTime(muted ? 0 : 0.88, t, 0.02);
        var activeEar = Boolean(earPressed && !muted);
        var targetBed = activeEar ? (0.028 + 0.048 * nightFactor) : 0;
        tremorBedGain.gain.setTargetAtTime(targetBed, t, 0.045);
        if (tremorFilter) {
          tremorFilter.frequency.setTargetAtTime(104 + 34 * nightFactor, t, 0.06);
        }
      } catch (_err) {
        /* Silent fallback when audio graph is unavailable */
      }
    }

    function ensureAudioContext() {
      if (!hasGestureActivation()) {
        return false;
      }
      var Ctor = (root && (root.AudioContext || root.webkitAudioContext))
        || (typeof AudioContext !== 'undefined' ? AudioContext : null);
      if (!Ctor) {
        return false;
      }
      try {
        if (!audioCtx) {
          audioCtx = new Ctor();
          masterLowpass = audioCtx.createBiquadFilter();
          masterLowpass.type = 'lowpass';
          masterLowpass.frequency.value = 190;
          masterLowpass.Q.value = 0.86;

          masterGain = audioCtx.createGain();
          masterGain.gain.value = muted ? 0 : 0.88;
          masterLowpass.connect(masterGain);
          masterGain.connect(audioCtx.destination);

          var bedBuffer = buildDeterministicBuffers(audioCtx);
          tremorFilter = audioCtx.createBiquadFilter();
          tremorFilter.type = 'lowpass';
          tremorFilter.frequency.value = 124;
          tremorFilter.Q.value = 0.7;

          tremorBedGain = audioCtx.createGain();
          tremorBedGain.gain.value = 0;

          var bedSource = audioCtx.createBufferSource();
          bedSource.buffer = bedBuffer;
          bedSource.loop = true;

          var rootDrone = audioCtx.createOscillator();
          rootDrone.type = 'sine';
          rootDrone.frequency.value = 46;
          var rootDroneGain = audioCtx.createGain();
          rootDroneGain.gain.value = 0.22;

          bedSource.connect(tremorFilter);
          rootDrone.connect(rootDroneGain);
          rootDroneGain.connect(tremorFilter);
          tremorFilter.connect(tremorBedGain);
          tremorBedGain.connect(masterLowpass);

          bedSource.start(0);
          rootDrone.start(0);
        }
        if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
          var resumePromise = audioCtx.resume();
          if (resumePromise && typeof resumePromise.catch === 'function') {
            resumePromise.catch(function () {});
          }
        }
        audioUnlocked = true;
        syncTremorBed();
        return true;
      } catch (_err) {
        return false;
      }
    }

    function playNocturnalDoorSlamAudio(door, pWaveMs, sWaveMs) {
      if (muted || !earPressed || !isNight) {
        return;
      }
      if (!ensureAudioContext() || !audioCtx || !masterLowpass) {
        return;
      }
      try {
        var now = audioCtx.currentTime;
        var pDelaySec = Math.min(0.055, Math.max(0.004, pWaveMs / 1000));
        var tStart = now + pDelaySec;
        var depthNorm = clamp01((door.depthMeters - 16) / 34);
        var proximityGain = 1.0 - Math.min(0.28, Math.abs(door.normX - earNormX) * 0.36);

        /* Primary sub-clay P-wave compression thump (42Hz to 135Hz, zero air tail) */
        var pOsc = audioCtx.createOscillator();
        pOsc.type = 'sine';
        pOsc.frequency.setValueAtTime(135 - depthNorm * 16, tStart);
        pOsc.frequency.exponentialRampToValueAtTime(58, tStart + 0.085);
        pOsc.frequency.exponentialRampToValueAtTime(42, tStart + 0.42);

        var boneOsc = audioCtx.createOscillator();
        boneOsc.type = 'triangle';
        boneOsc.frequency.setValueAtTime(88 - depthNorm * 10, tStart);
        boneOsc.frequency.exponentialRampToValueAtTime(43, tStart + 0.36);

        var boneSubGain = audioCtx.createGain();
        boneSubGain.gain.value = 0.42;

        var thumpEnv = audioCtx.createGain();
        thumpEnv.gain.setValueAtTime(0.0001, tStart);
        thumpEnv.gain.linearRampToValueAtTime(0.56 * proximityGain, tStart + 0.007);
        thumpEnv.gain.exponentialRampToValueAtTime(0.0001, tStart + 0.46);

        pOsc.connect(thumpEnv);
        boneOsc.connect(boneSubGain);
        boneSubGain.connect(thumpEnv);
        thumpEnv.connect(masterLowpass);

        pOsc.start(tStart);
        boneOsc.start(tStart);
        pOsc.stop(tStart + 0.48);
        boneOsc.stop(tStart + 0.48);

        /* Secondary 90ms-delayed limestone shear knock routed into 190Hz lowpass */
        var shearExtra = Math.min(0.032, Math.max(0, (sWaveMs - pWaveMs) / 1000));
        var tShear = tStart + 0.090 + shearExtra;

        var shearBand = audioCtx.createBiquadFilter();
        shearBand.type = 'bandpass';
        shearBand.frequency.setValueAtTime(144 - depthNorm * 18, tShear);
        shearBand.Q.value = 1.95;
        shearBand.connect(masterLowpass);

        var shearOsc = audioCtx.createOscillator();
        shearOsc.type = 'triangle';
        shearOsc.frequency.setValueAtTime(126 - depthNorm * 12, tShear);
        shearOsc.frequency.exponentialRampToValueAtTime(48, tShear + 0.19);

        var shearEnv = audioCtx.createGain();
        shearEnv.gain.setValueAtTime(0.0001, tShear);
        shearEnv.gain.linearRampToValueAtTime(0.36 * proximityGain, tShear + 0.005);
        shearEnv.gain.exponentialRampToValueAtTime(0.0001, tShear + 0.22);

        shearOsc.connect(shearEnv);
        shearEnv.connect(shearBand);
        shearOsc.start(tShear);
        shearOsc.stop(tShear + 0.24);

        if (shearNoiseBuffer) {
          var gritSrc = audioCtx.createBufferSource();
          gritSrc.buffer = shearNoiseBuffer;
          var gritEnv = audioCtx.createGain();
          gritEnv.gain.setValueAtTime(0.28 * proximityGain, tShear);
          gritEnv.gain.exponentialRampToValueAtTime(0.0001, tShear + 0.11);
          gritSrc.connect(gritEnv);
          gritEnv.connect(shearBand);
          gritSrc.start(tShear);
          gritSrc.stop(tShear + 0.12);
        }
      } catch (_err) {
        /* Never emit console warnings in locked or headless environments */
      }
    }

    function refreshTimeDerived() {
      nightFactor = computeNightFactor(timeOfDay);
      isNight = Boolean(nightFactor >= ACOUSTIC_CONSTANTS.NIGHT_THRESHOLD);
    }

    function buildSeismicReading() {
      var earAtNight = Boolean(isNight && earPressed);
      var clayGain = earPressed
        ? roundTo(clamp01(0.38 + 0.52 * nightFactor + 0.10 * slamPulse), 4)
        : 0;
      var audibility = 0;
      if (earAtNight) {
        audibility = roundTo(clamp01(0.62 * nightFactor + 0.38 * slamPulse), 4);
      } else if (earPressed) {
        audibility = roundTo(clamp01(0.06 * nightFactor), 4);
      }
      var animFactor = reducedMotion ? 0 : 1;
      var coupling = earPressed ? (0.66 + 0.34 * nightFactor) : 0.16;
      var wormTremor = roundTo(clamp01(
        (0.24 + 0.09 * Math.sin(elapsedSec * 2.15 * animFactor + earNormX * 4.1)) * coupling
        + (earPressed ? 0.14 * slamPulse : 0)
      ), 4);
      var rootHum = roundTo(clamp01(
        (0.28 + 0.08 * Math.cos(elapsedSec * 1.35 * animFactor + 1.15)) * coupling
        + (earPressed ? 0.10 * slamPulse : 0)
      ), 4);

      var statusText = 'Barren stony ground — nothing of Argia is visible or audible above';
      if (earAtNight && slamPulse > 0.25) {
        statusText = 'Subterranean stone door slam conducted through packed clay';
      } else if (earAtNight) {
        statusText = 'Ear pressed to cold night stone — listening through packed clay';
      } else if (earPressed && !isNight) {
        statusText = 'Ear on sun-baked scree — barren daylight heat masks deep vaults';
      } else if (isNight && !earPressed) {
        statusText = 'Deserted night scree — press ear to stony ground to listen below';
      }

      return {
        surfaceAudibility: audibility,
        clayConductionGain: clayGain,
        wormCreviceTremor: wormTremor,
        rootTensionHum: rootHum,
        statusText: statusText
      };
    }

    function getState() {
      return {
        airFraction: ACOUSTIC_CONSTANTS.AIR_FRACTION,
        packedEarthFraction: ACOUSTIC_CONSTANTS.PACKED_EARTH_FRACTION,
        medium: 'packed_clay_and_limestone',
        timeOfDay: timeOfDay,
        nightFactor: nightFactor,
        isNight: isNight,
        earPressed: earPressed,
        earNormX: earNormX,
        earPressedAtNight: Boolean(isNight && earPressed),
        muted: muted,
        reducedMotion: reducedMotion,
        audioUnlocked: audioUnlocked,
        doorSlamCount: doorSlamCount,
        heardDoorSlamCount: heardDoorSlamCount,
        muffledDoorSlamCount: Math.max(0, doorSlamCount - heardDoorSlamCount),
        lastDoorSlam: cloneSlamEvent(lastDoorSlam),
        seismicReading: buildSeismicReading(),
        activeWaveCount: activeWaves.length,
        buriedDoors: buriedDoors.map(function (d, idx) {
          return cloneDoor(d, idx);
        })
      };
    }

    function setBuriedDoors(doors) {
      buriedDoors = normalizeDoorList(doors);
      doorCursor = 0;
      return buriedDoors.map(function (d, idx) { return cloneDoor(d, idx); });
    }

    function setTimeOfDay(norm01) {
      var wasEarAtNight = Boolean(isNight && earPressed);
      timeOfDay = normalizePhase(norm01);
      refreshTimeDerived();
      if (!wasEarAtNight && Boolean(isNight && earPressed)) {
        spontaneousRemainingSec = nextSpontaneousIntervalSec(spontaneousSeq);
      }
      syncTremorBed();
      return getState();
    }

    function setNight(flag) {
      return setTimeOfDay(Boolean(flag) ? 0.0 : 0.5);
    }

    function toggleNight() {
      return setNight(!isNight);
    }

    function pressEar(pressed, normX) {
      var wasEarAtNight = Boolean(isNight && earPressed);
      earPressed = Boolean(pressed);
      if (typeof normX === 'number' && Number.isFinite(normX)) {
        earNormX = roundTo(clamp01(normX), 4);
      }
      if (earPressed && !muted) {
        ensureAudioContext();
      }
      if (!wasEarAtNight && Boolean(isNight && earPressed)) {
        spontaneousRemainingSec = nextSpontaneousIntervalSec(spontaneousSeq);
      }
      syncTremorBed();
      return getState();
    }

    function toggleEar(normX) {
      return pressEar(!earPressed, normX);
    }

    function resolveDoor(doorIdOrIndex) {
      var count = buriedDoors.length;
      if (typeof doorIdOrIndex === 'number' && Number.isFinite(doorIdOrIndex)) {
        var idx = ((Math.floor(doorIdOrIndex) % count) + count) % count;
        return buriedDoors[idx];
      }
      if (typeof doorIdOrIndex === 'string' && doorIdOrIndex.length > 0) {
        var needle = doorIdOrIndex.toLowerCase();
        for (var i = 0; i < count; i += 1) {
          if (buriedDoors[i].id === doorIdOrIndex || buriedDoors[i].label.toLowerCase() === needle) {
            return buriedDoors[i];
          }
        }
      }
      var chosen = buriedDoors[doorCursor % count];
      doorCursor = (doorCursor + 1) % count;
      return chosen;
    }

    function triggerDoorSlam(doorIdOrIndex) {
      var door = resolveDoor(doorIdOrIndex);
      doorSlamCount += 1;
      var pWaveMs = roundTo((door.depthMeters / ACOUSTIC_CONSTANTS.CLAY_PWAVE_MPS) * 1000, 2);
      var sWaveMs = roundTo((door.depthMeters / ACOUSTIC_CONSTANTS.CLAY_SWAVE_MPS) * 1000, 2);
      var heardAtSurface = Boolean(isNight && earPressed);
      var reason = 'heard_through_night_stone';

      if (heardAtSurface) {
        heardDoorSlamCount += 1;
        slamPulse = 1.0;
        playNocturnalDoorSlamAudio(door, pWaveMs, sWaveMs);
      } else if (!isNight) {
        reason = 'masked_by_daylight_barren_heat';
        slamPulse = Math.max(slamPulse, 0.12);
      } else {
        reason = 'ear_not_pressed_to_stony_ground';
        slamPulse = Math.max(slamPulse, 0.16);
      }

      activeWaves.push({
        originNormX: door.normX,
        originNormY: door.normY,
        radiusNorm: reducedMotion ? 0.36 : 0.018,
        sWaveRadiusNorm: reducedMotion ? 0.21 : 0.008,
        intensity: 1.0,
        heardAtSurface: heardAtSurface,
        ageSec: 0,
        durationSec: reducedMotion ? 1.05 : 2.35
      });
      if (activeWaves.length > 10) {
        activeWaves.shift();
      }

      lastDoorSlam = {
        doorId: door.id,
        label: door.label,
        depthMeters: door.depthMeters,
        originNormX: door.normX,
        originNormY: door.normY,
        heardAtSurface: heardAtSurface,
        reason: reason,
        pWaveMs: pWaveMs,
        sWaveMs: sWaveMs,
        timestampMs: nowMs()
      };

      var snapEv = cloneSlamEvent(lastDoorSlam);
      for (var k = 0; k < slamListeners.length; k += 1) {
        try { slamListeners[k](cloneSlamEvent(snapEv), getState()); } catch (_err) { /* ignore */ }
      }
      return snapEv;
    }

    function unlockAudio() {
      return ensureAudioContext();
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      syncTremorBed();
      return getState();
    }

    function toggleMute() {
      return setMuted(!muted);
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      return getState();
    }

    function step(dtSec) {
      var totalDt = Math.max(0, Math.min(20.0, Number(dtSec) || 0));
      if (totalDt <= 0) {
        return getState();
      }
      var steps = Math.max(1, Math.ceil(totalDt / 0.1));
      var subDt = totalDt / steps;
      var spontaneousFired = false;

      for (var s = 0; s < steps; s += 1) {
        elapsedSec += subDt;
        slamPulse = Math.max(0, slamPulse - subDt * 0.72);
        var nextWaves = [];
        for (var i = 0; i < activeWaves.length; i += 1) {
          var w = activeWaves[i];
          w.ageSec += subDt;
          if (w.ageSec < w.durationSec) {
            if (!reducedMotion) {
              w.radiusNorm = roundTo(Math.min(1.35, w.radiusNorm + subDt * 0.58), 4);
              w.sWaveRadiusNorm = roundTo(Math.min(1.15, w.sWaveRadiusNorm + subDt * 0.31), 4);
            }
            var progress = clamp01(w.ageSec / w.durationSec);
            w.intensity = roundTo(Math.pow(1 - progress, 1.35), 4);
            if (w.intensity > 0.005) {
              nextWaves.push(w);
            }
          }
        }
        activeWaves = nextWaves;

        if (isNight && earPressed && !spontaneousFired) {
          spontaneousRemainingSec -= subDt;
          if (spontaneousRemainingSec <= 0) {
            spontaneousSeq += 1;
            spontaneousRemainingSec = nextSpontaneousIntervalSec(spontaneousSeq);
            spontaneousFired = true;
            triggerDoorSlam();
          }
        }
      }
      return getState();
    }

    function getActiveWaves() {
      return activeWaves.map(function (w) {
        return {
          originNormX: w.originNormX,
          originNormY: w.originNormY,
          radiusNorm: w.radiusNorm,
          sWaveRadiusNorm: w.sWaveRadiusNorm,
          intensity: w.intensity,
          heardAtSurface: w.heardAtSurface
        };
      });
    }

    function onDoorSlam(listenerFn) {
      if (typeof listenerFn !== 'function') {
        return function () {};
      }
      slamListeners.push(listenerFn);
      return function unsubscribe() {
        var idx = slamListeners.indexOf(listenerFn);
        if (idx >= 0) {
          slamListeners.splice(idx, 1);
        }
      };
    }

    function reset() {
      timeOfDay = initialTimeOfDay;
      refreshTimeDerived();
      earPressed = false;
      earNormX = 0.5;
      doorCursor = 0;
      doorSlamCount = 0;
      heardDoorSlamCount = 0;
      lastDoorSlam = null;
      activeWaves = [];
      elapsedSec = 0;
      slamPulse = 0;
      spontaneousSeq = 0;
      spontaneousRemainingSec = nextSpontaneousIntervalSec(0);
      syncTremorBed();
      return getState();
    }

    return {
      getState: getState,
      setBuriedDoors: setBuriedDoors,
      setTimeOfDay: setTimeOfDay,
      setNight: setNight,
      toggleNight: toggleNight,
      pressEar: pressEar,
      toggleEar: toggleEar,
      triggerDoorSlam: triggerDoorSlam,
      unlockAudio: unlockAudio,
      setMuted: setMuted,
      toggleMute: toggleMute,
      setReducedMotion: setReducedMotion,
      step: step,
      getActiveWaves: getActiveWaves,
      onDoorSlam: onDoorSlam,
      reset: reset
    };
  }

  var api = {
    ACOUSTIC_CONSTANTS: ACOUSTIC_CONSTANTS,
    DEFAULT_BURIED_DOORS: DEFAULT_BURIED_DOORS,
    createGroundAcoustics: createGroundAcoustics
  };

  if (root) {
    root.ArgiaGroundAcoustics = api;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.ArgiaGroundAcoustics = api;
  }
  if (typeof window !== 'undefined') {
    window.ArgiaGroundAcoustics = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
