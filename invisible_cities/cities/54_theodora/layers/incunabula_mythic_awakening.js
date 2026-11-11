(function (root) {
  'use strict';

  var PALETTE = Object.freeze({
    asepticCement: '#cbc8be',
    cementShadow: '#8e8b82',
    warmLimestone: '#8b7961',
    cedarTimber: '#6d4c35',
    limestoneAsh: '#1c1d21',
    nocturneSky: '#111622',
    cryptObsidian: '#0e0d11',
    vellumOchre: '#d8be86',
    vellumAged: '#bfa065',
    incunabulaVermilion: '#b83a28',
    linnaeusVerdigris: '#52796f',
    lapisMarginalia: '#2f4b7c',
    gildedLeaf: '#e5c158',
    ivoryHorn: '#f3efe4'
  });

  var VALID_ZONES = Object.freeze(['city_sanctum', 'library_nave', 'basement_crypt']);

  var MYTHIC_BEASTS = Object.freeze([
    Object.freeze({
      id: 'sphinxes',
      name: 'Sphinxes',
      rubric: 'Sphinx Leo-Virgo',
      folioCode: 'Incunabulum I · Fol. 4r',
      latinEpigraph: 'Ungues leonis in caemento sterili dum cives somniant figuntur.',
      anatomicalKey: 'Enigmatic crowned human visage, lapis-and-gold hawk pinions, and tawny lioness haunches unsheathing stone-scoring claws.',
      reclamationAct: "Planting lions' claws squarely on Theodora's aseptic cement pavement as citizens dream.",
      zone: 'city_sanctum',
      nx: 0.17,
      tier: 'pavement',
      accent: '#d8be86'
    }),
    Object.freeze({
      id: 'griffons',
      name: 'Griffons',
      rubric: 'Gryps Auratus',
      folioCode: 'Incunabulum I · Fol. 11v',
      latinEpigraph: 'Rostrum aquilae super fastigia pura circumvolat custodiens aurum noctis.',
      anatomicalKey: 'Curved aquiline beak, pricked lynx ears, burnished gold-feathered forequarters, and leonine hindquarters.',
      reclamationAct: 'Eagle-beaked, lion-flanked guardians wheeling over sterilized parapets and moonlit towers.',
      zone: 'city_sanctum',
      nx: 0.28,
      tier: 'parapet',
      accent: '#e5c158'
    }),
    Object.freeze({
      id: 'chimeras',
      name: 'Chimeras',
      rubric: 'Chimaera Tricorpor',
      folioCode: 'Incunabulum II · Fol. 19r',
      latinEpigraph: 'Prima leo, postrema draco, media capra flammas per porticus fundit.',
      anatomicalKey: 'Triple-bodied marvel: roaring lion forepart, dorsal fire-breathing goat head, and venomous serpent tail.',
      reclamationAct: 'Lion-goat-serpent fire-breather prowling sterilized arcades where spiderwebs once hung.',
      zone: 'city_sanctum',
      nx: 0.45,
      tier: 'arcade',
      accent: '#b83a28'
    }),
    Object.freeze({
      id: 'dragons',
      name: 'Dragons',
      rubric: 'Draco Bibliothecae',
      folioCode: 'Incunabulum II · Fol. 27v',
      latinEpigraph: 'Spira coccinea ex hypogaeo scandit codicesque clausos halitu solvit.',
      anatomicalKey: 'Vermilion-scaled serpentine coils, ribbed bat-membrane wings, horned crest, and sulfur-gold jaws.',
      reclamationAct: 'Vermilion-scaled coils ascending the spiral stair from basement crypt past the locked nave.',
      zone: 'basement_crypt',
      nx: 0.19,
      tier: 'stair',
      accent: '#b83a28'
    }),
    Object.freeze({
      id: 'hircocervi',
      name: 'Hircocervi',
      rubric: 'Hircocervus Logicae',
      folioCode: 'Incunabulum III · Fol. 33r',
      latinEpigraph: 'Animal syllogismi, dimidium hircus dimidium cervus, super coronides salit.',
      anatomicalKey: 'Bearded caprine forequarters and cloven hooves fused to twelve-tine stag antlers and fleet haunches.',
      reclamationAct: 'Half-goat, half-stag paradoxical beast of logic bounding across poured-cement cornices.',
      zone: 'library_nave',
      nx: 0.56,
      tier: 'cornice',
      accent: '#52796f'
    }),
    Object.freeze({
      id: 'harpies',
      name: 'Harpies',
      rubric: 'Harpyia Nocturna',
      folioCode: 'Incunabulum III · Fol. 41v',
      latinEpigraph: 'Ubi vultures occisi sunt, ibi ungues aenei virginum alatarum resident.',
      anatomicalKey: 'Pale nocturnal maiden countenance, storm-feathered dark pinions, and curved brazen talons.',
      reclamationAct: 'Brazen talons perching high on cement gables where slain condors once nested.',
      zone: 'city_sanctum',
      nx: 0.72,
      tier: 'gable',
      accent: '#2f4b7c'
    }),
    Object.freeze({
      id: 'hydras',
      name: 'Hydras',
      rubric: 'Hydra Septiceps',
      folioCode: 'Incunabulum IV · Fol. 48r',
      latinEpigraph: 'Septem colla ex clathris cisternarum signatis pullulant inexstinguibilia.',
      anatomicalKey: 'Coiled amphibious trunk sprouting seven crowned serpentine necks that multiply at severance.',
      reclamationAct: 'Seven regenerating necks rising out of sealed cistern grates and sterilized sewer vaults.',
      zone: 'city_sanctum',
      nx: 0.62,
      tier: 'cistern',
      accent: '#52796f'
    }),
    Object.freeze({
      id: 'unicorns',
      name: 'Unicorns',
      rubric: 'Monoceros Indomitus',
      folioCode: 'Incunabulum IV · Fol. 56v',
      latinEpigraph: 'Cornu tortile album per plateas caementicias indomitum currit.',
      anatomicalKey: 'Milk-white courser with lion tail, cloven hooves, and three-cubit spiraled ivory alicorn.',
      reclamationAct: 'Fierce spiral-horned white courser galloping down scrubbed cement avenues under sleeping towers.',
      zone: 'city_sanctum',
      nx: 0.87,
      tier: 'avenue',
      accent: '#f3efe4'
    }),
    Object.freeze({
      id: 'basilisks',
      name: 'Basilisks',
      rubric: 'Basiliscus Regulus',
      folioCode: 'Incunabulum V · Fol. 64r',
      latinEpigraph: 'Regulus coronatus visu solo bases lapideas in salem vertit.',
      anatomicalKey: 'Crowned cockerel crest with natural gold diadem, thorny wings, and hooked serpent tail.',
      reclamationAct: 'Crowned cock-serpent sovereign petrifying library and piazza plinths with its gaze.',
      zone: 'library_nave',
      nx: 0.81,
      tier: 'plinth',
      accent: '#e5c158'
    })
  ]);

  var BEAST_BY_KEY = (function () {
    var map = Object.create(null);
    var singulars = {
      sphinx: 'sphinxes', griffon: 'griffons', griffin: 'griffons',
      chimera: 'chimeras', dragon: 'dragons', hircocervus: 'hircocervi',
      harpy: 'harpies', hydra: 'hydras', unicorn: 'unicorns', basilisk: 'basilisks'
    };
    for (var i = 0; i < MYTHIC_BEASTS.length; i++) {
      var b = MYTHIC_BEASTS[i];
      map[b.id] = b;
      map[b.name.toLowerCase()] = b;
      map[String(i)] = b;
    }
    var keys = Object.keys(singulars);
    for (var k = 0; k < keys.length; k++) {
      map[keys[k]] = map[singulars[keys[k]]];
    }
    return map;
  })();

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hexToRgb(hex) {
    var clean = String(hex || '#000000').replace('#', '');
    var n = parseInt(clean, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function mixHex(c1, c2, t) {
    var u = clamp(t, 0, 1);
    var a = hexToRgb(c1);
    var b = hexToRgb(c2);
    return 'rgb(' + Math.round(lerp(a.r, b.r, u)) + ',' +
      Math.round(lerp(a.g, b.g, u)) + ',' + Math.round(lerp(a.b, b.b, u)) + ')';
  }

  function roundRectPath(ctx, x, y, w, h, r) {
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

  var state = {
    livingFaunaCount: 7,
    cementRatio: 0,
    exterminatedCount: 0,
    shelvedCount: 0,
    consultedVolumeIndex: -1,
    buffonLinnaeusLocked: false,
    cryptUnlocked: false,
    mythicBestiaryAwakened: false,
    awakenedCount: 0,
    awakenedIds: [],
    inspectedBeastId: 'sphinxes',
    focusZone: 'city_sanctum',
    muted: false,
    reducedMotion: false,
    timeSec: 0,
    spotlightPulse: 0,
    awakeningFlash: 0,
    latestHitboxes: []
  };

  var listeners = [];
  var emitting = false;
  var audioCtx = null;

  var clouds = [
    { x: 0.14, y: 0.09, w: 0.22, speed: 0.008 },
    { x: 0.53, y: 0.06, w: 0.28, speed: 0.005 },
    { x: 0.84, y: 0.12, w: 0.19, speed: 0.007 }
  ];

  var marginaliaMotes = (function () {
    var arr = [];
    var glyphs = ['§', '¶', '✦', '✠', '☽', '♌', '♑', '🐉', '⚜'];
    for (var i = 0; i < 22; i++) {
      arr.push({
        u: (i * 0.137 + 0.07) % 0.86 + 0.07,
        v: (i * 0.29) % 1,
        speed: 0.045 + (i % 5) * 0.012,
        phase: i * 0.83,
        glyph: glyphs[i % 7]
      });
    }
    return arr;
  })();

  function emitChange() {
    if (emitting) return;
    emitting = true;
    try {
      var snap = getState();
      for (var i = 0; i < listeners.length; i++) {
        if (typeof listeners[i] === 'function') {
          listeners[i](snap);
        }
      }
    } finally {
      emitting = false;
    }
  }

  function ensureAudio() {
    if (state.muted) return null;
    if (audioCtx) {
      if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
        try { audioCtx.resume(); } catch (_) {}
      }
      return audioCtx;
    }
    var Ctor = root.AudioContext || root.webkitAudioContext;
    if (!Ctor) return null;
    try {
      audioCtx = new Ctor();
      if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
        audioCtx.resume();
      }
    } catch (_) {
      audioCtx = null;
    }
    return audioCtx;
  }

  function playVellumRustle(ac, now, dur, freq, gainPeak) {
    try {
      var len = Math.max(256, Math.floor(ac.sampleRate * dur));
      var buf = ac.createBuffer(1, len, ac.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) {
        var env = Math.sin(Math.PI * (i / len));
        data[i] = (Math.random() * 2 - 1) * env;
      }
      var src = ac.createBufferSource();
      src.buffer = buf;
      var filt = ac.createBiquadFilter();
      filt.type = 'bandpass';
      filt.frequency.setValueAtTime(freq || 1400, now);
      filt.Q.setValueAtTime(1.8, now);
      var g = ac.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(gainPeak || 0.05, now + dur * 0.25);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      src.connect(filt);
      filt.connect(g);
      g.connect(ac.destination);
      src.start(now);
      src.stop(now + dur + 0.02);
    } catch (_) {}
  }

  function playTone(ac, type, f0, f1, start, dur, peak) {
    try {
      var osc = ac.createOscillator();
      var g = ac.createGain();
      osc.type = type || 'triangle';
      osc.frequency.setValueAtTime(Math.max(24, f0), start);
      if (f1 && f1 !== f0) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(24, f1), start + dur);
      }
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(peak || 0.05, start + Math.min(0.06, dur * 0.25));
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
      osc.connect(g);
      g.connect(ac.destination);
      osc.start(start);
      osc.stop(start + dur + 0.02);
    } catch (_) {}
  }

  function playVaultChord() {
    var ac = ensureAudio();
    if (!ac) return;
    var now = ac.currentTime;
    playVellumRustle(ac, now, 0.26, 1150, 0.055);
    var notes = [73.42, 110.0, 146.83, 220.0, 261.63];
    for (var i = 0; i < notes.length; i++) {
      playTone(ac, i < 2 ? 'sawtooth' : 'triangle', notes[i], notes[i] * 0.996, now + i * 0.04, 0.72, 0.026);
    }
  }

  function playAwakeningFanfare() {
    var ac = ensureAudio();
    if (!ac) return;
    var now = ac.currentTime;
    playVellumRustle(ac, now, 0.38, 950, 0.06);
    var chord = [65.41, 98.0, 146.83, 196.0, 293.66, 440.0];
    for (var i = 0; i < chord.length; i++) {
      playTone(ac, i < 2 ? 'sawtooth' : 'sine', chord[i] * 0.96, chord[i], now + i * 0.055, 0.95, 0.025);
    }
  }

  function playBeastSignature(beastId) {
    var ac = ensureAudio();
    if (!ac) return;
    var now = ac.currentTime;
    playVellumRustle(ac, now, 0.18, 1550, 0.04);
    if (beastId === 'sphinxes') {
      playTone(ac, 'sawtooth', 78, 54, now + 0.02, 0.48, 0.045);
      playVellumRustle(ac, now + 0.08, 0.14, 2400, 0.05);
      playTone(ac, 'triangle', 220, 330, now + 0.12, 0.42, 0.028);
    } else if (beastId === 'griffons') {
      playVellumRustle(ac, now + 0.04, 0.15, 480, 0.06);
      playVellumRustle(ac, now + 0.20, 0.15, 520, 0.055);
      playTone(ac, 'sawtooth', 1180, 740, now + 0.08, 0.34, 0.03);
    } else if (beastId === 'chimeras') {
      playTone(ac, 'sawtooth', 68, 49, now + 0.01, 0.52, 0.05);
      playTone(ac, 'square', 294, 312, now + 0.10, 0.28, 0.022);
      playVellumRustle(ac, now + 0.15, 0.28, 3100, 0.05);
    } else if (beastId === 'dragons') {
      playTone(ac, 'sawtooth', 72, 144, now + 0.02, 0.55, 0.045);
      playTone(ac, 'triangle', 108, 216, now + 0.10, 0.48, 0.03);
      playVellumRustle(ac, now + 0.18, 0.24, 900, 0.055);
    } else if (beastId === 'hircocervi') {
      playTone(ac, 'triangle', 330, 466.16, now + 0.02, 0.20, 0.036);
      playTone(ac, 'sine', 495, 659.25, now + 0.16, 0.32, 0.034);
    } else if (beastId === 'harpies') {
      playVellumRustle(ac, now + 0.03, 0.22, 620, 0.05);
      playTone(ac, 'sine', 880, 622.25, now + 0.06, 0.40, 0.032);
      playTone(ac, 'triangle', 1480, 1396, now + 0.14, 0.22, 0.022);
    } else if (beastId === 'hydras') {
      for (var h = 0; h < 7; h++) {
        playTone(ac, 'sawtooth', 140 + h * 36, 165 + h * 38, now + h * 0.04, 0.22, 0.016);
      }
      playVellumRustle(ac, now + 0.08, 0.30, 3600, 0.04);
    } else if (beastId === 'unicorns') {
      var harm = [523.25, 659.25, 783.99, 1046.5];
      for (var u = 0; u < harm.length; u++) {
        playTone(ac, 'sine', harm[u], harm[u] * 1.005, now + u * 0.055, 0.46, 0.03);
      }
    } else {
      playVellumRustle(ac, now + 0.02, 0.32, 4200, 0.055);
      playTone(ac, 'sine', 1567.98, 1560, now + 0.08, 0.44, 0.028);
      playTone(ac, 'triangle', 2349.32, 2340, now + 0.12, 0.38, 0.02);
    }
  }

  function resolveBeast(keyOrIndex) {
    if (keyOrIndex === undefined || keyOrIndex === null) {
      return BEAST_BY_KEY[state.inspectedBeastId] || MYTHIC_BEASTS[0];
    }
    var k = String(keyOrIndex).trim().toLowerCase();
    return BEAST_BY_KEY[k] || null;
  }

  var VOLUME_IDS = ['condors', 'serpents', 'spiders', 'flies', 'termites', 'woodworms', 'rat_clans'];

  function applyTrophicInternal(trophicState, silent) {
    if (!trophicState || typeof trophicState !== 'object') return false;
    var prevAwakened = state.mythicBestiaryAwakened;
    var prevLiving = state.livingFaunaCount;
    var prevShelved = state.shelvedCount;
    var prevConsulted = state.consultedVolumeIndex;

    if (typeof trophicState.livingFaunaCount === 'number' && !isNaN(trophicState.livingFaunaCount)) {
      state.livingFaunaCount = Math.max(0, Math.round(trophicState.livingFaunaCount));
    }
    state.exterminatedCount = typeof trophicState.exterminatedCount === 'number'
      ? clamp(Math.round(trophicState.exterminatedCount), 0, 7)
      : clamp(7 - state.livingFaunaCount, 0, 7);
    state.cementRatio = typeof trophicState.cementRatio === 'number'
      ? clamp(trophicState.cementRatio, 0, 1)
      : clamp(state.exterminatedCount / 7, 0, 1);
    state.shelvedCount = Array.isArray(trophicState.shelvedVolumes)
      ? clamp(trophicState.shelvedVolumes.length, 0, 7)
      : state.exterminatedCount;
    if (trophicState.consultedVolumeId) {
      state.consultedVolumeIndex = VOLUME_IDS.indexOf(String(trophicState.consultedVolumeId));
    } else if (typeof trophicState.consultedVolume === 'object' && trophicState.consultedVolume && trophicState.consultedVolume.id) {
      state.consultedVolumeIndex = VOLUME_IDS.indexOf(String(trophicState.consultedVolume.id));
    }

    var isZero = state.livingFaunaCount === 0;
    state.buffonLinnaeusLocked = isZero || Boolean(trophicState.buffonLinnaeusLocked && isZero);
    if (isZero) {
      state.cryptUnlocked = true;
      state.mythicBestiaryAwakened = true;
      state.awakenedCount = MYTHIC_BEASTS.length;
      state.awakenedIds = MYTHIC_BEASTS.map(function (b) { return b.id; });
      if (!prevAwakened) {
        state.awakeningFlash = 1.0;
        if (!silent) playAwakeningFanfare();
      }
    } else {
      state.cryptUnlocked = false;
      state.mythicBestiaryAwakened = false;
      state.awakenedCount = 0;
      state.awakenedIds = [];
      state.awakeningFlash = 0;
    }

    var changed = (prevAwakened !== state.mythicBestiaryAwakened) ||
      (prevLiving !== state.livingFaunaCount) ||
      (prevShelved !== state.shelvedCount) ||
      (prevConsulted !== state.consultedVolumeIndex);
    if (changed && !silent) {
      emitChange();
    }
    return changed;
  }

  function formatBeastRecord(beast) {
    if (!beast) return null;
    return {
      id: beast.id,
      name: beast.name,
      rubric: beast.rubric,
      folioCode: beast.folioCode,
      latinEpigraph: beast.latinEpigraph,
      anatomicalKey: beast.anatomicalKey,
      reclamationAct: beast.reclamationAct,
      zone: beast.zone,
      accent: beast.accent,
      awakened: state.mythicBestiaryAwakened,
      inspected: state.inspectedBeastId === beast.id
    };
  }

  function getState() {
    var beastsSnap = MYTHIC_BEASTS.map(formatBeastRecord);
    var inspected = formatBeastRecord(resolveBeast(state.inspectedBeastId));
    return {
      cryptUnlocked: state.cryptUnlocked,
      mythicBestiaryAwakened: state.mythicBestiaryAwakened,
      awakenedCount: state.awakenedCount,
      awakenedIds: state.awakenedIds.slice(),
      beasts: beastsSnap,
      inspectedBeastId: state.inspectedBeastId,
      inspectedBeast: inspected,
      focusZone: state.focusZone,
      livingFaunaCount: state.livingFaunaCount,
      cementRatio: state.cementRatio,
      muted: state.muted,
      reducedMotion: state.reducedMotion
    };
  }

  function init(options) {
    var opts = options || {};
    if (typeof opts.reducedMotion === 'boolean') state.reducedMotion = opts.reducedMotion;
    if (typeof opts.muted === 'boolean') state.muted = opts.muted;
    if (typeof opts.onChange === 'function') {
      if (listeners.indexOf(opts.onChange) === -1) listeners.push(opts.onChange);
    }
    if (opts.trophicState) applyTrophicInternal(opts.trophicState, true);
    return getState();
  }

  function syncTrophicState(trophicState) {
    applyTrophicInternal(trophicState, false);
    return getState();
  }

  function descendToCrypt() {
    state.focusZone = 'basement_crypt';
    playVaultChord();
    emitChange();
    return getState();
  }

  function setFocusZone(zone) {
    var z = String(zone || '').trim().toLowerCase();
    if (VALID_ZONES.indexOf(z) !== -1) {
      state.focusZone = z;
      emitChange();
    }
    return getState();
  }

  function inspectBeast(beastId) {
    var beast = resolveBeast(beastId);
    if (!beast) beast = MYTHIC_BEASTS[0];
    state.inspectedBeastId = beast.id;
    state.spotlightPulse = 1.0;
    playBeastSignature(beast.id);
    emitChange();
    return formatBeastRecord(beast);
  }

  function hitTestBeast(px, py) {
    if (!state.mythicBestiaryAwakened || typeof px !== 'number' || typeof py !== 'number') {
      return null;
    }
    var boxes = state.latestHitboxes;
    var bestId = null;
    var bestDist = Infinity;
    for (var i = 0; i < boxes.length; i++) {
      var hb = boxes[i];
      if (px >= hb.x && px <= hb.x + hb.w && py >= hb.y && py <= hb.y + hb.h) {
        var dx = px - hb.cx;
        var dy = py - hb.cy;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < bestDist) {
          bestDist = d;
          bestId = hb.id;
        }
      }
    }
    return bestId;
  }

  function setMuted(flag) {
    state.muted = Boolean(flag);
    emitChange();
    return state.muted;
  }

  function isMuted() {
    return state.muted;
  }

  function setReducedMotion(flag) {
    state.reducedMotion = Boolean(flag);
    emitChange();
    return state.reducedMotion;
  }

  function reset() {
    state.livingFaunaCount = 7;
    state.cementRatio = 0;
    state.exterminatedCount = 0;
    state.shelvedCount = 0;
    state.consultedVolumeIndex = -1;
    state.buffonLinnaeusLocked = false;
    state.cryptUnlocked = false;
    state.mythicBestiaryAwakened = false;
    state.awakenedCount = 0;
    state.awakenedIds = [];
    state.inspectedBeastId = 'sphinxes';
    state.focusZone = 'city_sanctum';
    state.spotlightPulse = 0;
    state.awakeningFlash = 0;
    state.latestHitboxes = [];
    emitChange();
    return getState();
  }

  function onChange(fn) {
    if (typeof fn === 'function' && listeners.indexOf(fn) === -1) {
      listeners.push(fn);
    }
    return function unsubscribe() {
      var idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  function step(dtSec, trophicState) {
    if (trophicState) applyTrophicInternal(trophicState, false);
    var dt = clamp(typeof dtSec === 'number' && !isNaN(dtSec) ? dtSec : 0.016, 0, 0.2);
    state.spotlightPulse = Math.max(0, state.spotlightPulse - dt * 0.85);
    state.awakeningFlash = Math.max(0, state.awakeningFlash - dt * 0.65);
    if (state.reducedMotion) return;
    state.timeSec += dt;
    for (var i = 0; i < clouds.length; i++) {
      clouds[i].x += clouds[i].speed * dt;
      if (clouds[i].x - clouds[i].w > 1.08) clouds[i].x = -clouds[i].w;
    }
    if (state.mythicBestiaryAwakened) {
      for (var m = 0; m < marginaliaMotes.length; m++) {
        marginaliaMotes[m].v = (marginaliaMotes[m].v + marginaliaMotes[m].speed * dt) % 1;
      }
    }
  }

  function makeBand(top, bottom, width) {
    var h = Math.max(1, bottom - top);
    return {
      x: 0,
      y: top,
      top: top,
      bottom: bottom,
      w: width,
      width: width,
      h: h,
      height: h,
      cy: top + h * 0.5,
      floorY: bottom - Math.max(4, h * 0.08)
    };
  }

  function computeBands(width, height) {
    var w = Math.max(120, width || 800);
    var h = Math.max(120, height || 600);
    var skyBottom = Math.round(h * 0.46);
    var naveBottom = Math.round(h * 0.74);
    var skyBand = makeBand(0, skyBottom, w);
    var naveBand = makeBand(skyBottom, naveBottom, w);
    var cryptBand = makeBand(naveBottom, h, w);
    var sewerY = skyBottom - Math.max(5, Math.round(h * 0.018));
    return {
      skyBand: skyBand,
      naveBand: naveBand,
      cryptBand: cryptBand,
      sewerY: sewerY
    };
  }

  function drawBeastFigure(ctx, beastId, cx, cy, s, phase, folioMode) {
    ctx.save();
    ctx.translate(cx, cy);
    var bob = Math.sin(phase) * (s * 0.04);
    var wing = Math.sin(phase * 1.7) * 0.14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (beastId === 'sphinxes') {
      if (!folioMode) {
        ctx.strokeStyle = PALETTE.incunabulaVermilion;
        ctx.lineWidth = Math.max(1.3, s * 0.055);
        for (var g = -1; g <= 1; g++) {
          ctx.beginPath();
          ctx.moveTo(s * 0.30, s * 0.38 + g * s * 0.06);
          ctx.lineTo(s * 0.68, s * 0.44 + g * s * 0.07);
          ctx.stroke();
        }
      }
      ctx.fillStyle = PALETTE.vellumOchre;
      ctx.strokeStyle = '#241a12';
      ctx.lineWidth = Math.max(1.2, s * 0.05);
      ctx.beginPath();
      ctx.ellipse(-s * 0.12, s * 0.14, s * 0.38, s * 0.20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.12, s * 0.26);
      ctx.lineTo(s * 0.50, s * 0.36);
      ctx.lineTo(s * 0.48, s * 0.43);
      ctx.lineTo(s * 0.05, s * 0.34);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = PALETTE.incunabulaVermilion;
      for (var c = 0; c < 3; c++) {
        ctx.beginPath();
        ctx.moveTo(s * 0.47 + c * s * 0.04, s * 0.36);
        ctx.lineTo(s * 0.56 + c * s * 0.04, s * 0.44);
        ctx.stroke();
      }
      ctx.save();
      ctx.rotate(-0.18 + wing * 0.5);
      ctx.fillStyle = PALETTE.lapisMarginalia;
      ctx.strokeStyle = PALETTE.gildedLeaf;
      ctx.beginPath();
      ctx.moveTo(-s * 0.05, s * 0.04);
      ctx.quadraticCurveTo(-s * 0.48, -s * 0.56, -s * 0.62, -s * 0.14);
      ctx.quadraticCurveTo(-s * 0.32, s * 0.08, -s * 0.05, s * 0.04);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = PALETTE.ivoryHorn;
      ctx.strokeStyle = '#241a12';
      ctx.beginPath();
      ctx.arc(s * 0.26, -s * 0.14, s * 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = PALETTE.gildedLeaf;
      ctx.beginPath();
      ctx.moveTo(s * 0.13, -s * 0.26);
      ctx.lineTo(s * 0.20, -s * 0.42);
      ctx.lineTo(s * 0.27, -s * 0.30);
      ctx.lineTo(s * 0.35, -s * 0.42);
      ctx.lineTo(s * 0.39, -s * 0.25);
      ctx.closePath();
      ctx.fill();
    } else if (beastId === 'griffons') {
      ctx.translate(0, bob);
      ctx.fillStyle = PALETTE.gildedLeaf;
      ctx.strokeStyle = '#241a12';
      ctx.lineWidth = Math.max(1.2, s * 0.05);
      ctx.beginPath();
      ctx.ellipse(-s * 0.06, s * 0.08, s * 0.34, s * 0.17, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.save();
      ctx.rotate(wing);
      ctx.fillStyle = PALETTE.vellumOchre;
      ctx.beginPath();
      ctx.moveTo(-s * 0.05, 0);
      ctx.quadraticCurveTo(-s * 0.35, -s * 0.68, s * 0.18, -s * 0.52);
      ctx.quadraticCurveTo(s * 0.08, -s * 0.16, -s * 0.05, 0);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = PALETTE.ivoryHorn;
      ctx.beginPath();
      ctx.arc(s * 0.28, -s * 0.12, s * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = PALETTE.incunabulaVermilion;
      ctx.beginPath();
      ctx.moveTo(s * 0.40, -s * 0.16);
      ctx.quadraticCurveTo(s * 0.60, -s * 0.12, s * 0.48, -s * 0.01);
      ctx.lineTo(s * 0.38, -s * 0.06);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(s * 0.20, -s * 0.24);
      ctx.lineTo(s * 0.15, -s * 0.42);
      ctx.lineTo(s * 0.28, -s * 0.26);
      ctx.closePath();
      ctx.fill();
    } else if (beastId === 'chimeras') {
      ctx.fillStyle = '#c4864b';
      ctx.strokeStyle = '#241a12';
      ctx.lineWidth = Math.max(1.2, s * 0.05);
      ctx.beginPath();
      ctx.ellipse(-s * 0.05, s * 0.12, s * 0.36, s * 0.19, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = PALETTE.incunabulaVermilion;
      ctx.beginPath();
      ctx.arc(s * 0.28, -s * 0.02, s * 0.21, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PALETTE.vellumOchre;
      ctx.beginPath();
      ctx.arc(s * 0.32, -s * 0.03, s * 0.14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#d9d4c7';
      ctx.beginPath();
      ctx.arc(-s * 0.06, -s * 0.16, s * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = PALETTE.gildedLeaf;
      ctx.beginPath();
      ctx.moveTo(-s * 0.10, -s * 0.26);
      ctx.quadraticCurveTo(-s * 0.28, -s * 0.48, -s * 0.36, -s * 0.34);
      ctx.stroke();
      ctx.fillStyle = PALETTE.incunabulaVermilion;
      ctx.beginPath();
      ctx.moveTo(s * 0.06, -s * 0.18);
      ctx.quadraticCurveTo(s * 0.38, -s * 0.44, s * 0.56 + bob * 1.4, -s * 0.28);
      ctx.quadraticCurveTo(s * 0.34, -s * 0.12, s * 0.06, -s * 0.14);
      ctx.fill();
      ctx.strokeStyle = PALETTE.linnaeusVerdigris;
      ctx.lineWidth = Math.max(1.8, s * 0.07);
      ctx.beginPath();
      ctx.moveTo(-s * 0.38, s * 0.10);
      ctx.bezierCurveTo(-s * 0.64, -s * 0.06, -s * 0.68, -s * 0.36, -s * 0.44, -s * 0.38);
      ctx.stroke();
    } else if (beastId === 'dragons') {
      ctx.strokeStyle = PALETTE.incunabulaVermilion;
      ctx.lineWidth = Math.max(2.4, s * 0.14);
      ctx.beginPath();
      ctx.moveTo(-s * 0.24, s * 0.48);
      ctx.bezierCurveTo(s * 0.34, s * 0.28, -s * 0.38, -s * 0.02, s * 0.20, -s * 0.26 + bob);
      ctx.stroke();
      ctx.strokeStyle = PALETTE.gildedLeaf;
      ctx.lineWidth = Math.max(1.1, s * 0.04);
      ctx.stroke();
      ctx.fillStyle = '#7a1f16';
      ctx.beginPath();
      ctx.moveTo(-s * 0.02, -s * 0.06);
      ctx.lineTo(-s * 0.54, -s * 0.36 + wing * s * 0.5);
      ctx.lineTo(-s * 0.30, s * 0.04);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = PALETTE.incunabulaVermilion;
      ctx.beginPath();
      ctx.moveTo(s * 0.16, -s * 0.36 + bob);
      ctx.lineTo(s * 0.48, -s * 0.30 + bob);
      ctx.lineTo(s * 0.38, -s * 0.16 + bob);
      ctx.lineTo(s * 0.14, -s * 0.20 + bob);
      ctx.closePath();
      ctx.fill();
    } else if (beastId === 'hircocervi') {
      ctx.translate(0, -Math.abs(bob) * 1.2);
      ctx.fillStyle = PALETTE.linnaeusVerdigris;
      ctx.strokeStyle = '#1b2421';
      ctx.lineWidth = Math.max(1.2, s * 0.05);
      ctx.beginPath();
      ctx.ellipse(-s * 0.14, s * 0.08, s * 0.24, s * 0.16, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = PALETTE.vellumOchre;
      ctx.beginPath();
      ctx.ellipse(s * 0.12, s * 0.04, s * 0.22, s * 0.16, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s * 0.28, -s * 0.16, s * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = PALETTE.ivoryHorn;
      ctx.beginPath();
      ctx.moveTo(s * 0.25, -s * 0.26);
      ctx.quadraticCurveTo(s * 0.08, -s * 0.48, -s * 0.06, -s * 0.38);
      ctx.moveTo(s * 0.30, -s * 0.26);
      ctx.lineTo(s * 0.38, -s * 0.54);
      ctx.moveTo(s * 0.34, -s * 0.40);
      ctx.lineTo(s * 0.48, -s * 0.44);
      ctx.moveTo(s * 0.36, -s * 0.48);
      ctx.lineTo(s * 0.26, -s * 0.56);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawBeastFigure6to9(ctx, beastId, cx, cy, s, phase, folioMode) {
    ctx.save();
    ctx.translate(cx, cy);
    var bob = Math.sin(phase) * (s * 0.04);
    var wing = Math.sin(phase * 1.8) * 0.15;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (beastId === 'harpies') {
      ctx.fillStyle = PALETTE.lapisMarginalia;
      ctx.strokeStyle = '#141a26';
      ctx.lineWidth = Math.max(1.2, s * 0.05);
      ctx.beginPath();
      ctx.moveTo(-s * 0.08, 0);
      ctx.quadraticCurveTo(-s * 0.56, -s * 0.42 + wing * s * 0.4, -s * 0.42, s * 0.18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.08, 0);
      ctx.quadraticCurveTo(s * 0.56, -s * 0.42 - wing * s * 0.4, s * 0.42, s * 0.18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#3b4a68';
      ctx.beginPath();
      ctx.ellipse(0, s * 0.08, s * 0.18, s * 0.24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = PALETTE.ivoryHorn;
      ctx.beginPath();
      ctx.arc(0, -s * 0.20, s * 0.13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = PALETTE.gildedLeaf;
      ctx.lineWidth = Math.max(1.6, s * 0.06);
      for (var t = -1; t <= 1; t += 2) {
        ctx.beginPath();
        ctx.moveTo(t * s * 0.08, s * 0.28);
        ctx.lineTo(t * s * 0.18, s * 0.44);
        ctx.lineTo(t * s * 0.04, s * 0.42);
        ctx.stroke();
      }
    } else if (beastId === 'hydras') {
      ctx.fillStyle = PALETTE.linnaeusVerdigris;
      ctx.strokeStyle = '#132420';
      ctx.lineWidth = Math.max(1.2, s * 0.045);
      ctx.beginPath();
      ctx.ellipse(0, s * 0.30, s * 0.30, s * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (var n = 0; n < 7; n++) {
        var ang = -1.15 + (n / 6) * 2.3;
        var sway = Math.sin(phase * 1.4 + n * 0.8) * s * 0.05;
        var hx = Math.sin(ang) * s * 0.46 + sway;
        var hy = -Math.cos(ang * 0.55) * s * 0.46 + s * 0.12;
        ctx.strokeStyle = n % 2 === 0 ? PALETTE.linnaeusVerdigris : '#3c6359';
        ctx.lineWidth = Math.max(1.8, s * 0.075);
        ctx.beginPath();
        ctx.moveTo((n - 3) * s * 0.05, s * 0.26);
        ctx.quadraticCurveTo(hx * 0.45, s * 0.02, hx, hy);
        ctx.stroke();
        ctx.fillStyle = PALETTE.incunabulaVermilion;
        ctx.beginPath();
        ctx.arc(hx, hy, Math.max(2.2, s * 0.065), 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (beastId === 'unicorns') {
      ctx.translate(0, -Math.abs(bob));
      ctx.fillStyle = PALETTE.ivoryHorn;
      ctx.strokeStyle = '#2c2b29';
      ctx.lineWidth = Math.max(1.2, s * 0.048);
      ctx.beginPath();
      ctx.ellipse(-s * 0.08, s * 0.10, s * 0.30, s * 0.16, -0.28, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.08, 0);
      ctx.lineTo(s * 0.24, -s * 0.24);
      ctx.lineTo(s * 0.38, -s * 0.16);
      ctx.lineTo(s * 0.20, s * 0.08);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = PALETTE.gildedLeaf;
      ctx.lineWidth = Math.max(1.8, s * 0.06);
      ctx.beginPath();
      ctx.moveTo(s * 0.32, -s * 0.22);
      ctx.lineTo(s * 0.68, -s * 0.52);
      ctx.stroke();
      ctx.strokeStyle = PALETTE.vellumOchre;
      ctx.lineWidth = Math.max(1.2, s * 0.04);
      ctx.beginPath();
      ctx.moveTo(-s * 0.34, s * 0.16);
      ctx.quadraticCurveTo(-s * 0.58, s * 0.02, -s * 0.48, s * 0.34);
      ctx.moveTo(s * 0.14, s * 0.18);
      ctx.lineTo(s * 0.36, s * 0.40);
      ctx.moveTo(-s * 0.22, s * 0.22);
      ctx.lineTo(-s * 0.30, s * 0.44);
      ctx.stroke();
    } else if (beastId === 'basilisks') {
      if (!folioMode) {
        ctx.strokeStyle = 'rgba(229,193,88,0.45)';
        ctx.lineWidth = 1.2;
        for (var r = 0; r < 3; r++) {
          ctx.beginPath();
          ctx.moveTo(s * 0.28, -s * 0.16);
          ctx.lineTo(s * 0.66, -s * 0.02 + r * s * 0.12);
          ctx.stroke();
        }
      }
      ctx.strokeStyle = PALETTE.linnaeusVerdigris;
      ctx.lineWidth = Math.max(2.2, s * 0.10);
      ctx.beginPath();
      ctx.moveTo(0, s * 0.16);
      ctx.bezierCurveTo(-s * 0.42, s * 0.36, -s * 0.54, -s * 0.10, -s * 0.26, -s * 0.18);
      ctx.stroke();
      ctx.fillStyle = PALETTE.incunabulaVermilion;
      ctx.strokeStyle = '#241a12';
      ctx.lineWidth = Math.max(1.2, s * 0.048);
      ctx.beginPath();
      ctx.ellipse(s * 0.08, s * 0.06, s * 0.22, s * 0.16, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s * 0.22, -s * 0.16, s * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = PALETTE.gildedLeaf;
      ctx.beginPath();
      ctx.moveTo(s * 0.12, -s * 0.26);
      ctx.lineTo(s * 0.16, -s * 0.42);
      ctx.lineTo(s * 0.23, -s * 0.30);
      ctx.lineTo(s * 0.30, -s * 0.42);
      ctx.lineTo(s * 0.33, -s * 0.25);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawMythicBeast(ctx, beast, cx, cy, s, phase, isInspected, folioMode) {
    if (isInspected && !folioMode) {
      ctx.save();
      var pulseR = s * (0.82 + state.spotlightPulse * 0.22 + Math.sin(phase * 2) * 0.04);
      var grad = ctx.createRadialGradient(cx, cy, s * 0.12, cx, cy, pulseR);
      grad.addColorStop(0, 'rgba(229, 193, 88, 0.42)');
      grad.addColorStop(0.65, 'rgba(184, 58, 40, 0.18)');
      grad.addColorStop(1, 'rgba(184, 58, 40, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PALETTE.gildedLeaf;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
    var firstFive = ['sphinxes', 'griffons', 'chimeras', 'dragons', 'hircocervi'];
    if (firstFive.indexOf(beast.id) !== -1) {
      drawBeastFigure(ctx, beast.id, cx, cy, s, phase, folioMode);
    } else {
      drawBeastFigure6to9(ctx, beast.id, cx, cy, s, phase, folioMode);
    }
  }

  function drawCitySanctum(ctx, skyBand, sewerY) {
    var w = skyBand.w;
    var h = skyBand.h;
    var cem = state.cementRatio;
    var awakened = state.mythicBestiaryAwakened;

    var skyGrad = ctx.createLinearGradient(0, 0, 0, skyBand.bottom);
    skyGrad.addColorStop(0, mixHex('#0d121d', '#1c2028', cem * 0.6));
    skyGrad.addColorStop(0.65, mixHex('#182236', '#2c3038', cem * 0.7));
    skyGrad.addColorStop(1, mixHex('#29282b', '#494948', cem * 0.8));
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, skyBand.bottom);

    var moonX = w * 0.82;
    var moonY = h * 0.21;
    var moonR = Math.max(12, Math.min(w, h) * 0.09);
    var halo = ctx.createRadialGradient(moonX, moonY, moonR * 0.3, moonX, moonY, moonR * 2.8);
    halo.addColorStop(0, awakened ? 'rgba(229,193,88,0.34)' : 'rgba(216,220,228,0.26)');
    halo.addColorStop(1, 'rgba(216,220,228,0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR * 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = awakened ? '#efe2bd' : '#e3e4e0';
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(203, 200, 190, 0.09)';
    for (var ci = 0; ci < clouds.length; ci++) {
      var cl = clouds[ci];
      ctx.beginPath();
      ctx.ellipse(cl.x * w, cl.y * skyBand.bottom * 2.1, cl.w * w * 0.5, h * 0.045, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    var wallCol = mixHex(PALETTE.warmLimestone, PALETTE.asepticCement, cem);
    var wallDark = mixHex('#584c3d', PALETTE.cementShadow, cem);
    var roofCol = mixHex(PALETTE.cedarTimber, '#9f9d95', cem);
    var paveTop = sewerY - Math.max(12, h * 0.085);

    var towers = [
      { x: 0.04, w: 0.13, th: 0.62, gable: false },
      { x: 0.19, w: 0.15, th: 0.72, gable: true },
      { x: 0.37, w: 0.20, th: 0.56, gable: false },
      { x: 0.60, w: 0.18, th: 0.76, gable: true },
      { x: 0.80, w: 0.16, th: 0.60, gable: false }
    ];
    for (var ti = 0; ti < towers.length; ti++) {
      var tw = towers[ti];
      var tx = tw.x * w;
      var tWidth = tw.w * w;
      var ty = paveTop - tw.th * h * 0.72;
      ctx.fillStyle = ti % 2 === 0 ? wallDark : wallCol;
      ctx.fillRect(tx, ty, tWidth, paveTop - ty);
      ctx.fillStyle = roofCol;
      if (tw.gable) {
        ctx.beginPath();
        ctx.moveTo(tx - 4, ty);
        ctx.lineTo(tx + tWidth * 0.5, ty - h * 0.12);
        ctx.lineTo(tx + tWidth + 4, ty);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(tx - 3, ty - 5, tWidth + 6, 6);
      }

      var winY = ty + Math.max(8, (paveTop - ty) * 0.22);
      for (var wi = 0; wi < 2; wi++) {
        var wx = tx + tWidth * (0.22 + wi * 0.38);
        var ww = Math.max(8, tWidth * 0.18);
        var wh = Math.max(10, h * 0.08);
        ctx.fillStyle = awakened ? '#1b2740' : '#3a2d1b';
        ctx.fillRect(wx, winY, ww, wh);
        if (awakened) {
          ctx.fillStyle = PALETTE.vellumOchre;
          ctx.beginPath();
          ctx.ellipse(wx + ww * 0.5, winY + wh * 0.78, ww * 0.36, 2.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(229,193,88,0.45)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(wx + ww * 0.5, winY + wh * 0.55);
          ctx.quadraticCurveTo(wx + ww * 0.8, winY - 6, wx + ww * 0.4, winY - 14);
          ctx.stroke();
        } else {
          ctx.fillStyle = 'rgba(216,190,134,0.28)';
          ctx.fillRect(wx + 2, winY + 2, ww - 4, wh - 4);
        }
      }
    }

    var bays = w < 520 ? 5 : 7;
    var bayW = (w * 0.92) / bays;
    var colTop = paveTop - h * 0.28;
    ctx.fillStyle = wallCol;
    ctx.fillRect(w * 0.04, colTop, w * 0.92, h * 0.055);
    if (cem < 0.85) {
      ctx.strokeStyle = mixHex(PALETTE.cedarTimber, PALETTE.asepticCement, cem);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(w * 0.04, colTop + 3);
      ctx.lineTo(w * 0.96, colTop + 3);
      ctx.stroke();
    }
    for (var bi = 0; bi < bays; bi++) {
      var bx = w * 0.04 + bi * bayW;
      ctx.fillStyle = '#15171d';
      ctx.beginPath();
      ctx.moveTo(bx + bayW * 0.16, paveTop);
      ctx.lineTo(bx + bayW * 0.16, colTop + h * 0.12);
      ctx.arc(bx + bayW * 0.5, colTop + h * 0.12, bayW * 0.34, Math.PI, 0, false);
      ctx.lineTo(bx + bayW * 0.84, paveTop);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = wallCol;
      ctx.fillRect(bx, colTop + h * 0.05, bayW * 0.16, paveTop - (colTop + h * 0.05));
    }
    ctx.fillStyle = wallCol;
    ctx.fillRect(w * 0.96 - bayW * 0.14, colTop + h * 0.05, bayW * 0.14, paveTop - (colTop + h * 0.05));

    ctx.fillStyle = mixHex('#756a5b', PALETTE.asepticCement, cem);
    ctx.fillRect(0, paveTop, w, skyBand.bottom - paveTop);
    ctx.strokeStyle = mixHex('#4b4338', '#98958d', cem);
    ctx.lineWidth = 1;
    for (var sl = 1; sl < 9; sl++) {
      var sx = (sl / 9) * w;
      ctx.beginPath();
      ctx.moveTo(sx, paveTop);
      ctx.lineTo(w * 0.5 + (sx - w * 0.5) * 1.18, skyBand.bottom);
      ctx.stroke();
    }

    var grates = [0.31, 0.62, 0.84];
    for (var gi = 0; gi < grates.length; gi++) {
      var gx = grates[gi] * w - 16;
      ctx.fillStyle = '#141519';
      ctx.fillRect(gx, sewerY - 3, 32, 6);
      ctx.strokeStyle = cem > 0.9 ? PALETTE.asepticCement : '#5f6368';
      for (var gb = 0; gb <= 4; gb++) {
        ctx.beginPath();
        ctx.moveTo(gx + gb * 8, sewerY - 3);
        ctx.lineTo(gx + gb * 8, sewerY + 3);
        ctx.stroke();
      }
    }
  }

  function drawLibraryNave(ctx, naveBand) {
    var w = naveBand.w;
    var h = naveBand.h;
    var top = naveBand.top;
    var cem = state.cementRatio;
    var awakened = state.mythicBestiaryAwakened;

    ctx.fillStyle = mixHex('#201e1d', '#24252a', cem);
    ctx.fillRect(0, top, w, h);

    ctx.strokeStyle = mixHex('#5d5142', PALETTE.asepticCement, cem);
    ctx.lineWidth = 3;
    ctx.strokeRect(1.5, top + 1.5, w - 3, h - 3);

    for (var v = 0; v < 4; v++) {
      var vx = (v + 0.5) * (w / 4);
      ctx.strokeStyle = 'rgba(203,200,190,0.16)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(vx, top + h * 0.58, w * 0.13, Math.PI, 0, false);
      ctx.stroke();
    }

    var stairX = w * 0.15;
    ctx.fillStyle = '#121217';
    ctx.fillRect(stairX - 24, top + h * 0.16, 48, h * 0.84);
    for (var st = 0; st < 6; st++) {
      var sy = top + h * (0.24 + st * 0.12);
      ctx.fillStyle = mixHex('#6f6354', PALETTE.asepticCement, cem);
      ctx.fillRect(stairX - 20 + (st % 2) * 8, sy, 32, 4);
    }

    var shelfW = Math.min(w * 0.44, 340);
    var shelfX = w * 0.5 - shelfW * 0.5;
    var shelfY = top + h * 0.15;
    var shelfH = h * 0.72;
    ctx.fillStyle = '#14151a';
    ctx.strokeStyle = mixHex(PALETTE.cedarTimber, PALETTE.asepticCement, cem);
    ctx.lineWidth = 2.2;
    ctx.fillRect(shelfX, shelfY, shelfW, shelfH);
    ctx.strokeRect(shelfX, shelfY, shelfW, shelfH);

    var slotW = (shelfW - 18) / 7;
    var shelvedN = clamp(Math.max(state.shelvedCount, state.exterminatedCount), 0, 7);
    for (var i = 0; i < 7; i++) {
      var bx = shelfX + 9 + i * slotW + 2;
      var bw = Math.max(8, slotW - 4);
      var by = shelfY + shelfH * 0.16;
      var bh = shelfH * 0.76;
      var isShelved = i < shelvedN;
      var isConsulted = state.consultedVolumeIndex === i;
      ctx.fillStyle = isShelved
        ? (i % 2 === 0 ? PALETTE.linnaeusVerdigris : '#3f6359')
        : '#23242b';
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = isConsulted ? PALETTE.gildedLeaf : (isShelved ? PALETTE.vellumOchre : '#383942');
      ctx.lineWidth = isConsulted ? 2 : 1;
      ctx.strokeRect(bx, by, bw, bh);
      if (isShelved) {
        ctx.fillStyle = PALETTE.gildedLeaf;
        ctx.fillRect(bx + 2, by + bh * 0.18, bw - 4, 2);
        ctx.fillRect(bx + 2, by + bh * 0.72, bw - 4, 2);
      }
    }

    if (state.buffonLinnaeusLocked || awakened) {
      ctx.fillStyle = PALETTE.gildedLeaf;
      ctx.fillRect(shelfX - 4, shelfY + shelfH * 0.52, shelfW + 8, 4);
      ctx.fillStyle = PALETTE.incunabulaVermilion;
      ctx.beginPath();
      ctx.arc(shelfX + shelfW * 0.5, shelfY + shelfH * 0.54, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    var deskX = w * 0.77;
    var deskY = top + h * 0.66;
    ctx.fillStyle = mixHex('#66543f', PALETTE.asepticCement, cem);
    ctx.fillRect(deskX - 28, deskY, 56, 5);
    ctx.fillRect(deskX - 22, deskY + 5, 5, h * 0.22);
    ctx.fillRect(deskX + 17, deskY + 5, 5, h * 0.22);
    if (awakened) {
      ctx.fillStyle = PALETTE.vellumOchre;
      ctx.beginPath();
      ctx.arc(deskX - 4, deskY - 6, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PALETTE.lapisMarginalia;
      ctx.fillRect(deskX - 16, deskY - 3, 22, 4);
    }
  }

  function drawBasementCrypt(ctx, cryptBand) {
    var w = cryptBand.w;
    var h = cryptBand.h;
    var top = cryptBand.top;
    var awakened = state.mythicBestiaryAwakened;

    var bg = ctx.createLinearGradient(0, top, 0, cryptBand.bottom);
    bg.addColorStop(0, PALETTE.cryptObsidian);
    bg.addColorStop(1, awakened ? '#1b1214' : '#08080b');
    ctx.fillStyle = bg;
    ctx.fillRect(0, top, w, h);

    var stairX = w * 0.15;
    for (var s = 0; s < 5; s++) {
      var sy = top + h * (0.14 + s * 0.16);
      ctx.fillStyle = '#4e4c49';
      ctx.fillRect(stairX - 20 + (s % 2) * 10, sy, 30, 5);
    }

    for (var f = 0; f < 5; f++) {
      var fx = w * (0.30 + f * 0.15);
      var fy = top + h * 0.64;
      ctx.fillStyle = '#2d2a27';
      ctx.fillRect(fx - 5, fy, 10, h * 0.28);
      ctx.fillRect(fx - 16, fy - 4, 32, 5);

      if (awakened) {
        var glowR = Math.max(24, h * 0.42);
        var fg = ctx.createRadialGradient(fx, fy - 12, 3, fx, fy - 12, glowR);
        fg.addColorStop(0, 'rgba(229,193,88,0.52)');
        fg.addColorStop(0.55, 'rgba(184,58,40,0.22)');
        fg.addColorStop(1, 'rgba(184,58,40,0)');
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.arc(fx, fy - 12, glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = PALETTE.vellumOchre;
        ctx.strokeStyle = PALETTE.incunabulaVermilion;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(fx, fy - 5);
        ctx.lineTo(fx - 18, fy - 17);
        ctx.lineTo(fx - 16, fy - 27);
        ctx.lineTo(fx, fy - 16);
        ctx.lineTo(fx + 16, fy - 27);
        ctx.lineTo(fx + 18, fy - 17);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = '#3a2b22';
        ctx.strokeStyle = '#626266';
        ctx.lineWidth = 1.3;
        ctx.fillRect(fx - 13, fy - 13, 26, 9);
        ctx.strokeRect(fx - 13, fy - 13, 26, 9);
        ctx.fillStyle = '#7c7b78';
        ctx.fillRect(fx - 3, fy - 9, 6, 7);
      }
    }

    if (awakened) {
      ctx.save();
      ctx.font = '600 11px Georgia, serif';
      for (var m = 0; m < marginaliaMotes.length; m++) {
        var mote = marginaliaMotes[m];
        var mx = mote.u * w;
        var my = cryptBand.bottom - mote.v * (cryptBand.bottom * 0.92);
        ctx.fillStyle = m % 2 === 0 ? 'rgba(229,193,88,0.62)' : 'rgba(184,58,40,0.58)';
        ctx.fillText(mote.glyph, mx, my);
      }
      ctx.restore();
    }
  }

  function computeBeastAnchor(beast, bands) {
    var w = bands.skyBand.w;
    var sky = bands.skyBand;
    var nave = bands.naveBand;
    var crypt = bands.cryptBand;
    var x = beast.nx * w;
    var y = sky.bottom - sky.h * 0.14;
    if (beast.tier === 'pavement') y = bands.sewerY - sky.h * 0.10;
    else if (beast.tier === 'parapet') y = sky.top + sky.h * 0.27;
    else if (beast.tier === 'arcade') y = bands.sewerY - sky.h * 0.13;
    else if (beast.tier === 'stair') y = crypt.top - nave.h * 0.06;
    else if (beast.tier === 'cornice') y = nave.top + nave.h * 0.14;
    else if (beast.tier === 'gable') y = sky.top + sky.h * 0.25;
    else if (beast.tier === 'cistern') y = bands.sewerY - sky.h * 0.11;
    else if (beast.tier === 'avenue') y = bands.sewerY - sky.h * 0.12;
    else if (beast.tier === 'plinth') y = nave.bottom - nave.h * 0.22;
    return { x: x, y: y };
  }

  function renderScene(ctx, width, height, trophicState) {
    if (trophicState) applyTrophicInternal(trophicState, true);
    var w = Math.max(120, Math.round(width || (ctx && ctx.canvas && ctx.canvas.width) || 800));
    var h = Math.max(120, Math.round(height || (ctx && ctx.canvas && ctx.canvas.height) || 600));
    var bands = computeBands(w, h);
    if (!ctx) {
      return {
        skyBand: bands.skyBand,
        naveBand: bands.naveBand,
        cryptBand: bands.cryptBand,
        sewerY: bands.sewerY,
        beastHitboxes: []
      };
    }

    ctx.save();
    ctx.clearRect(0, 0, w, h);
    drawCitySanctum(ctx, bands.skyBand, bands.sewerY);
    drawLibraryNave(ctx, bands.naveBand);
    drawBasementCrypt(ctx, bands.cryptBand);

    var focusMap = {
      city_sanctum: bands.skyBand,
      library_nave: bands.naveBand,
      basement_crypt: bands.cryptBand
    };
    var activeBand = focusMap[state.focusZone] || bands.skyBand;
    ctx.strokeStyle = state.mythicBestiaryAwakened
      ? 'rgba(229, 193, 88, 0.55)'
      : 'rgba(203, 200, 190, 0.32)';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, activeBand.top + 2, w - 4, activeBand.h - 4);

    var hitboxes = [];
    if (state.mythicBestiaryAwakened) {
      var baseScale = clamp(Math.min(w / 18, h / 13), 18, 42);
      for (var i = 0; i < MYTHIC_BEASTS.length; i++) {
        var beast = MYTHIC_BEASTS[i];
        var pt = computeBeastAnchor(beast, bands);
        var isInsp = state.inspectedBeastId === beast.id;
        var sc = isInsp ? baseScale * 1.18 : baseScale;
        drawMythicBeast(ctx, beast, pt.x, pt.y, sc, state.timeSec * 2.1 + i * 0.7, isInsp, false);
        var pad = Math.max(20, sc * 0.78);
        hitboxes.push({
          id: beast.id,
          name: beast.name,
          rubric: beast.rubric,
          zone: beast.zone,
          cx: pt.x,
          cy: pt.y,
          r: pad,
          x: pt.x - pad,
          y: pt.y - pad,
          w: pad * 2,
          h: pad * 2
        });
        if (isInsp) {
          ctx.save();
          ctx.font = '700 10px Georgia, serif';
          var tag = beast.rubric.toUpperCase();
          var tw = Math.min(w - 16, Math.max(88, tag.length * 6.4 + 14));
          var lx = clamp(pt.x - tw * 0.5, 6, w - tw - 6);
          var ly = clamp(pt.y + sc * 0.56, 8, h - 22);
          ctx.fillStyle = 'rgba(14, 13, 17, 0.88)';
          ctx.strokeStyle = PALETTE.gildedLeaf;
          ctx.lineWidth = 1.2;
          roundRectPath(ctx, lx, ly, tw, 17, 3);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = PALETTE.vellumOchre;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(tag, lx + tw * 0.5, ly + 8.5);
          ctx.restore();
        }
      }
    }

    if (state.awakeningFlash > 0.01) {
      ctx.fillStyle = 'rgba(229, 193, 88, ' + (state.awakeningFlash * 0.24).toFixed(3) + ')';
      ctx.fillRect(0, 0, w, h);
    }

    ctx.restore();
    state.latestHitboxes = hitboxes;
    return {
      skyBand: bands.skyBand,
      naveBand: bands.naveBand,
      cryptBand: bands.cryptBand,
      sewerY: bands.sewerY,
      beastHitboxes: hitboxes.slice()
    };
  }

  function renderFolioMedallion(ctx, width, height, beastId) {
    if (!ctx) return;
    var w = Math.max(80, Math.round(width || (ctx.canvas && ctx.canvas.width) || 260));
    var h = Math.max(80, Math.round(height || (ctx.canvas && ctx.canvas.height) || 220));
    var beast = resolveBeast(beastId) || MYTHIC_BEASTS[0];
    var awakened = state.mythicBestiaryAwakened;

    ctx.save();
    ctx.clearRect(0, 0, w, h);
    var vg = ctx.createLinearGradient(0, 0, w, h);
    vg.addColorStop(0, awakened ? '#e6cf99' : '#9c8a66');
    vg.addColorStop(0.5, awakened ? PALETTE.vellumOchre : '#877657');
    vg.addColorStop(1, awakened ? PALETTE.vellumAged : '#6c5d43');
    ctx.fillStyle = vg;
    roundRectPath(ctx, 2, 2, w - 4, h - 4, 6);
    ctx.fill();

    ctx.strokeStyle = PALETTE.incunabulaVermilion;
    ctx.lineWidth = 2;
    roundRectPath(ctx, 7, 7, w - 14, h - 14, 4);
    ctx.stroke();
    ctx.strokeStyle = PALETTE.lapisMarginalia;
    ctx.lineWidth = 1;
    roundRectPath(ctx, 11, 11, w - 22, h - 22, 3);
    ctx.stroke();

    var corners = [[13, 13], [w - 13, 13], [13, h - 13], [w - 13, h - 13]];
    ctx.fillStyle = awakened ? PALETTE.gildedLeaf : '#5b5344';
    for (var c = 0; c < corners.length; c++) {
      ctx.beginPath();
      ctx.arc(corners[c][0], corners[c][1], 4, 0, Math.PI * 2);
      ctx.fill();
    }

    var cx = w * 0.5;
    var cy = h * 0.50;
    var r = Math.min(w, h) * 0.29;
    ctx.fillStyle = awakened ? PALETTE.lapisMarginalia : '#242936';
    ctx.strokeStyle = awakened ? PALETTE.gildedLeaf : '#6d6552';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    drawMythicBeast(ctx, beast, cx, cy, r * 0.92, state.timeSec * 1.6, false, true);

    ctx.textAlign = 'center';
    ctx.fillStyle = PALETTE.incunabulaVermilion;
    ctx.font = '700 ' + Math.max(9, Math.round(h * 0.058)) + 'px Georgia, serif';
    ctx.fillText(beast.rubric.toUpperCase(), cx, 24);
    ctx.fillStyle = '#251c14';
    ctx.font = 'italic ' + Math.max(8, Math.round(h * 0.048)) + 'px Georgia, serif';
    ctx.fillText(beast.folioCode + (awakened ? ' · OPEN' : ' · CHAINED'), cx, h - 16);
    ctx.restore();
  }

  function renderArchivalPlatePreview(ctx, width, height, plateKind, trophicState) {
    if (!ctx) return;
    if (trophicState) applyTrophicInternal(trophicState, true);
    var w = Math.max(120, Math.round(width || (ctx.canvas && ctx.canvas.width) || 360));
    var h = Math.max(90, Math.round(height || (ctx.canvas && ctx.canvas.height) || 240));
    var kind = String(plateKind || 'map').toLowerCase();
    var isMap = kind.indexOf('map') !== -1;
    var awakened = state.mythicBestiaryAwakened;

    ctx.save();
    ctx.clearRect(0, 0, w, h);
    var bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#dcd4c0');
    bg.addColorStop(1, '#c5bba3');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(28, 29, 33, 0.10)';
    ctx.lineWidth = 1;
    for (var hl = 0; hl < w + h; hl += 9) {
      ctx.beginPath();
      ctx.moveTo(hl, 0);
      ctx.lineTo(0, hl);
      ctx.stroke();
    }

    ctx.strokeStyle = PALETTE.limestoneAsh;
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, w - 12, h - 12);
    ctx.lineWidth = 0.9;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    if (isMap) {
      var cx = w * 0.5;
      var cy = h * 0.52;
      var rad = Math.min(w, h) * 0.34;
      ctx.strokeStyle = PALETTE.limestoneAsh;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (var s = 0; s <= 8; s++) {
        var a = (s / 8) * Math.PI * 2 + Math.PI / 8;
        var px = cx + Math.cos(a) * rad;
        var py = cy + Math.sin(a) * rad * 0.86;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.lineWidth = 1;
      for (var rv = 0; rv < 8; rv++) {
        var ra = (rv / 8) * Math.PI * 2 + Math.PI / 8;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ra) * rad, cy + Math.sin(ra) * rad * 0.86);
        ctx.stroke();
      }

      ctx.fillStyle = PALETTE.lapisMarginalia;
      ctx.beginPath();
      ctx.arc(cx, cy, rad * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = PALETTE.gildedLeaf;
      ctx.stroke();

      for (var bi = 0; bi < MYTHIC_BEASTS.length; bi++) {
        var ba = (bi / MYTHIC_BEASTS.length) * Math.PI * 2 - Math.PI * 0.5;
        var bx = cx + Math.cos(ba) * rad * 0.62;
        var by = cy + Math.sin(ba) * rad * 0.54;
        ctx.fillStyle = awakened ? PALETTE.incunabulaVermilion : PALETTE.linnaeusVerdigris;
        ctx.beginPath();
        ctx.arc(bx, by, 3.6, 0, Math.PI * 2);
        ctx.fill();
      }

      var rx = w - 34;
      var ry = 34;
      ctx.strokeStyle = PALETTE.incunabulaVermilion;
      ctx.beginPath();
      ctx.moveTo(rx, ry - 12);
      ctx.lineTo(rx + 4, ry);
      ctx.lineTo(rx, ry + 12);
      ctx.lineTo(rx - 4, ry);
      ctx.closePath();
      ctx.stroke();
    } else {
      var m = 18;
      var usableH = h - m * 2 - 16;
      var y1 = m + 12 + usableH * 0.42;
      var y2 = m + 12 + usableH * 0.72;
      ctx.strokeStyle = PALETTE.limestoneAsh;
      ctx.lineWidth = 1.4;
      ctx.strokeRect(m, m + 12, w - m * 2, usableH);
      ctx.beginPath();
      ctx.moveTo(m, y1);
      ctx.lineTo(w - m, y1);
      ctx.moveTo(m, y2);
      ctx.lineTo(w - m, y2);
      ctx.stroke();

      for (var ar = 0; ar < 5; ar++) {
        var ax = m + 14 + ar * ((w - m * 2 - 28) / 5);
        var aw = (w - m * 2 - 28) / 5 - 6;
        ctx.beginPath();
        ctx.arc(ax + aw * 0.5, y1 - 14, aw * 0.4, Math.PI, 0, false);
        ctx.stroke();
      }
      for (var sp = 0; sp < 7; sp++) {
        ctx.fillStyle = sp < state.exterminatedCount || awakened ? PALETTE.linnaeusVerdigris : '#8c8473';
        ctx.fillRect(w * 0.34 + sp * ((w * 0.32) / 7), y1 + 8, (w * 0.32) / 7 - 3, y2 - y1 - 16);
      }
      drawMythicBeast(ctx, MYTHIC_BEASTS[0], w * 0.28, y1 - 16, Math.min(w, h) * 0.11, 0, false, true);
      drawMythicBeast(ctx, MYTHIC_BEASTS[3], w * 0.72, y2 + (h - m - y2) * 0.45, Math.min(w, h) * 0.11, 0, false, true);
    }

    ctx.fillStyle = PALETTE.limestoneAsh;
    ctx.textAlign = 'center';
    ctx.font = '700 ' + Math.max(9, Math.round(h * 0.048)) + 'px Georgia, serif';
    ctx.fillText(
      isMap ? 'ICHNOGRAPHIA THEODORAE · SURVEY ARCHIVE' : 'SECTIO SANCTUARII ET HYPOGAEI · VISION ARCHIVE',
      w * 0.5,
      22
    );
    ctx.restore();
  }

  var api = Object.freeze({
    MYTHIC_BEASTS: MYTHIC_BEASTS,
    PALETTE: PALETTE,
    init: init,
    syncTrophicState: syncTrophicState,
    descendToCrypt: descendToCrypt,
    setFocusZone: setFocusZone,
    inspectBeast: inspectBeast,
    hitTestBeast: hitTestBeast,
    setMuted: setMuted,
    isMuted: isMuted,
    setReducedMotion: setReducedMotion,
    reset: reset,
    onChange: onChange,
    step: step,
    renderScene: renderScene,
    renderFolioMedallion: renderFolioMedallion,
    renderArchivalPlatePreview: renderArchivalPlatePreview,
    getState: getState
  });

  root.TheodoraMythicBestiary = api;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
