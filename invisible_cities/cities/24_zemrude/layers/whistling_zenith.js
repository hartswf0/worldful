(function () {
  'use strict';

  const PALETTE = Object.freeze({
    linenSky: '#e8eef2',
    ceruleanVault: '#8bb8d6',
    sunlitLimestone: '#dfd3be',
    sillShadow: '#9e927f',
    curtainBleach: '#f7f9fb',
    fountainSilver: '#d8eef8',
    sprayPrism: '#ffffff',
    memoryAmber: '#d6a75c'
  });

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || '#ffffff').replace('#', '');
    const n = parseInt(clean.length === 3
      ? clean.split('').map(function (c) { return c + c; }).join('')
      : clean, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + clamp(alpha, 0, 1).toFixed(3) + ')';
  }

  function safeLinearGrad(ctx, x0, y0, x1, y1, stops, fallback) {
    if (ctx && typeof ctx.createLinearGradient === 'function') {
      const g = ctx.createLinearGradient(x0, y0, x1, y1);
      if (g && typeof g.addColorStop === 'function') {
        for (let i = 0; i < stops.length; i++) {
          g.addColorStop(stops[i][0], stops[i][1]);
        }
        return g;
      }
    }
    return fallback;
  }

  function computeHorizonNorm(gazeElevation) {
    const g = clamp(typeof gazeElevation === 'number' ? gazeElevation : 0.55, -1, 1);
    return 0.18 + (g + 1) * 0.37;
  }

  // Reference horizon at initial gazeElevation = 0.55 is 0.7535.
  // At gazeElevation = 0.55, projected (normX, normY) matches stone.(normX, normY) exactly.
  // As gazeElevation sinks below 0, Upper Zemrude recedes upward above the top of the frame.
  function projectUpperStone(stone, gazeElevation) {
    const g = clamp(typeof gazeElevation === 'number' ? gazeElevation : 0.55, -1, 1);
    const horizonNorm = computeHorizonNorm(g);
    const refHorizon = 0.7535;
    const heightAboveHorizon = refHorizon - stone.normY;
    const recedeBoost = g < 0.05 ? (0.05 - g) * 0.82 : 0;
    const converge = 1 - (g - 0.55) * 0.08;
    const px = 0.5 + (stone.normX - 0.5) * converge;
    const py = horizonNorm - heightAboveHorizon - recedeBoost;
    return { normX: px, normY: py, horizonNorm: horizonNorm };
  }

  const ZENITH_STONES = Object.freeze([
    Object.freeze({
      id: 'sill_1', category: 'window_sills', stratum: 'zenith', side: 'left', normX: 0.22, normY: 0.58,
      label: 'Acanthus-Corbelled Limestone Sill',
      detail: 'Seen steeply from below with nose tilted up: a cantilevered limestone soffit scored by sun and chisel, cradling a glazed basil pot.',
      echoText: 'Someone recalls how noon gilded the undersides of acanthus corbels high above the shadowed street.'
    }),
    Object.freeze({
      id: 'sill_2', category: 'window_sills', stratum: 'zenith', side: 'right', normX: 0.78, normY: 0.56,
      label: 'Sun-Warmed Terracotta Ledge',
      detail: 'A chamfered upper drip-moulding casting warm ochre reflected light upward across mud-cup swallow nests.',
      echoText: 'In dark puddles a warm amber line still traces the chamfered terracotta ledge and its nested eaves.'
    }),
    Object.freeze({
      id: 'sill_3', category: 'window_sills', stratum: 'zenith', side: 'left', normX: 0.28, normY: 0.43,
      label: 'Fluted Belvedere Sill',
      detail: 'Twin volute brackets thrusting into the sky canyon, bearing an unglazed pitcher whose wet rim catches cerulean light.',
      echoText: 'Faint in memory: twin stone volutes jutting into open air where a water pitcher gleamed at midday.'
    }),
    Object.freeze({
      id: 'sill_4', category: 'window_sills', stratum: 'zenith', side: 'right', normX: 0.72, normY: 0.41,
      label: 'Swallow-Eave Casement Sill',
      detail: 'Deeply undercut ogee limestone lip from which swallows launch across the bright gulf between cornices.',
      echoText: 'Those who look down only hear tell of the high ogee sill where swallows wheeled at a whistled note.'
    }),
    Object.freeze({
      id: 'sill_5', category: 'window_sills', stratum: 'zenith', side: 'left', normX: 0.16, normY: 0.66,
      label: 'Carved Rope-Mould Sill',
      detail: 'Braided limestone sill warm with sky-glare, iron shutter-dogs hooked open to welcome the whistling walker.',
      echoText: 'A braided stone profile shimmers briefly in gutter water like a half-forgotten upward glance.'
    }),
    Object.freeze({
      id: 'sill_6', category: 'window_sills', stratum: 'zenith', side: 'right', normX: 0.84, normY: 0.64,
      label: 'Citron-Pot Corner Corbel',
      detail: 'Projecting corner sill catching cross-breezes through glossy citron leaves silhouetted against pale linen sky.',
      echoText: 'Remembered from below: a corner corbel and bright leaves leaning out into unobstructed wind.'
    }),
    Object.freeze({
      id: 'curtain_1', category: 'flapping_curtains', stratum: 'zenith', side: 'left', normX: 0.25, normY: 0.50,
      label: 'Sun-Bleached Linen Casement Curtain',
      detail: 'Sheer ivory flax billowing outward from an open casement like a small sail filled by an upward whistle.',
      echoText: 'A white curve ripples on black water—ghost of a linen curtain bellied out into sunlit air.'
    }),
    Object.freeze({
      id: 'curtain_2', category: 'flapping_curtains', stratum: 'zenith', side: 'right', normX: 0.75, normY: 0.48,
      label: 'Cerulean-Ticked Mullion Drape',
      detail: 'Fine sky-striped cotton snapping gently over the upper sill, luminous and weightless against the vault.',
      echoText: 'Old walkers speak of striped mullion drapes that once snapped like pennants overhead.'
    }),
    Object.freeze({
      id: 'curtain_3', category: 'flapping_curtains', stratum: 'zenith', side: 'left', normX: 0.32, normY: 0.35,
      label: 'High Loggia Voile Curtain',
      detail: 'Translucent bleached gauze lifted nearly horizontal by warm updraughts rising toward the rooftops.',
      echoText: 'Like mist across a well-shaft, the remembered voile still lifts toward an unseen sky.'
    }),
    Object.freeze({
      id: 'curtain_4', category: 'flapping_curtains', stratum: 'zenith', side: 'right', normX: 0.68, normY: 0.34,
      label: 'Fringed Piano-Nobile Curtain',
      detail: 'Twin bleached panels parting at a high arched window as cool room-air meets the noon breeze.',
      echoText: 'A parted pair of pale curtains survives now chiefly in the testimony of sunken eyes.'
    }),
    Object.freeze({
      id: 'curtain_5', category: 'flapping_curtains', stratum: 'zenith', side: 'left', normX: 0.19, normY: 0.62,
      label: 'Laundress Sheer Valance',
      detail: 'Freshly spun linen catching golden sun along its rippling hem as wind gusts up the facade.',
      echoText: 'Even down among wet stones, a pale rippling hem recalls the wind-flapped upper casements.'
    }),
    Object.freeze({
      id: 'curtain_6', category: 'flapping_curtains', stratum: 'zenith', side: 'right', normX: 0.81, normY: 0.60,
      label: 'Breeze-Lifted Shutter Veil',
      detail: 'Delicate muslin streaming past open timber louvres, answering every cadence of a light-hearted whistle.',
      echoText: 'The muslin veil that answered a whistled tune lingers as a faint amber fold below.'
    }),
    Object.freeze({
      id: 'fountain_1', category: 'fountains', stratum: 'zenith', side: 'left', normX: 0.38, normY: 0.24,
      label: 'Loggia Shell-Basin Fountain',
      detail: 'Elevated marble shell basin flinging a silver parabolic water arc high against the cerulean vault.',
      echoText: 'Deep wells mirror an inverted silver parabola—echo of the loggia fountain overhead.'
    }),
    Object.freeze({
      id: 'fountain_2', category: 'fountains', stratum: 'zenith', side: 'right', normX: 0.62, normY: 0.25,
      label: 'Belvedere Lion-Spout Basin',
      detail: 'Rooftop parapet basin whose bright jet shatters into sunlit prism mist before falling back to stone.',
      echoText: 'Every drop dripping in cellars recalls by contrast the sunlit spray of the belvedere jet.'
    }),
    Object.freeze({
      id: 'fountain_3', category: 'fountains', stratum: 'zenith', side: 'left', normX: 0.46, normY: 0.16,
      label: 'Terrace Crown Water-Jet',
      detail: 'Highest rooftop plume cresting in open sky, scattering silver droplets across the beholder’s upward gaze.',
      echoText: 'Remembered from the abyss: a crown of bright water breaking into pure sky.'
    }),
    Object.freeze({
      id: 'fountain_4', category: 'fountains', stratum: 'zenith', side: 'right', normX: 0.55, normY: 0.30,
      label: 'Archway Spillway Fountain',
      detail: 'Bridged roof-terrace basin pouring twin translucent arcs that chime like spun glass in the wind.',
      echoText: 'Twin silver arcs shimmer inverted in dark water, heard of now only through memory.'
    })
  ]);

  function createZenithAudio(initialMuted) {
    let muted = Boolean(initialMuted);
    let ctx = null;
    let noiseBuffer = null;

    function ensureContext() {
      if (muted) return null;
      try {
        if (!ctx) {
          const AC = (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) ||
            globalThis.AudioContext || globalThis.webkitAudioContext;
          if (!AC) return null;
          ctx = new AC();
        }
        if (ctx && ctx.state === 'suspended' && typeof ctx.resume === 'function') {
          ctx.resume().catch(function () {});
        }
        return ctx;
      } catch (_err) {
        return null;
      }
    }

    function getNoiseBuffer(ac) {
      if (noiseBuffer) return noiseBuffer;
      try {
        const len = Math.floor(ac.sampleRate * 0.45);
        const buf = ac.createBuffer(1, len, ac.sampleRate);
        const ch = buf.getChannelData(0);
        let prev = 0;
        for (let i = 0; i < len; i++) {
          const white = Math.random() * 2 - 1;
          prev = (prev + 0.06 * white) / 1.06;
          ch[i] = white * 0.6 + prev * 0.4;
        }
        noiseBuffer = buf;
        return buf;
      } catch (_err) {
        return null;
      }
    }

    function unlock() {
      try {
        const ac = ensureContext();
        return Boolean(ac && ac.state === 'running');
      } catch (_err) {
        return false;
      }
    }

    function setMuted(val) {
      muted = Boolean(val);
      return muted;
    }

    function toggleMute() {
      muted = !muted;
      if (!muted) unlock();
      return muted;
    }

    function isMuted() {
      return muted;
    }

    function playWhistlePhrase(energy) {
      if (muted) return;
      try {
        const ac = ensureContext();
        if (!ac) return;
        const e = clamp(typeof energy === 'number' ? energy : 0.65, 0.2, 1);
        const now = ac.currentTime;
        const notes = [587.33, 739.99, 880.0, 987.77 + e * 120];
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[0], now);
        osc.frequency.exponentialRampToValueAtTime(notes[1], now + 0.11);
        osc.frequency.exponentialRampToValueAtTime(notes[2], now + 0.23);
        osc.frequency.exponentialRampToValueAtTime(notes[3], now + 0.39);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.045 + e * 0.025, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
        osc.connect(gain);
        gain.connect(ac.destination);
        osc.start(now);
        osc.stop(now + 0.50);

        const nb = getNoiseBuffer(ac);
        if (nb) {
          const src = ac.createBufferSource();
          const bp = ac.createBiquadFilter();
          const ng = ac.createGain();
          src.buffer = nb;
          bp.type = 'bandpass';
          bp.frequency.setValueAtTime(1750, now);
          bp.Q.setValueAtTime(6.0, now);
          ng.gain.setValueAtTime(0.0001, now);
          ng.gain.linearRampToValueAtTime(0.016, now + 0.04);
          ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
          src.connect(bp);
          bp.connect(ng);
          ng.connect(ac.destination);
          src.start(now);
          src.stop(now + 0.40);
        }
      } catch (_err) {}
    }

    function playSillResonance() {
      if (muted) return;
      try {
        const ac = ensureContext();
        if (!ac) return;
        const now = ac.currentTime;
        const freqs = [523.25, 783.99];
        for (let i = 0; i < freqs.length; i++) {
          const osc = ac.createOscillator();
          const g = ac.createGain();
          osc.type = i === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freqs[i], now);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.exponentialRampToValueAtTime(i === 0 ? 0.04 : 0.022, now + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.34);
          osc.connect(g);
          g.connect(ac.destination);
          osc.start(now);
          osc.stop(now + 0.36);
        }
      } catch (_err) {}
    }

    function playCurtainFlap() {
      if (muted) return;
      try {
        const ac = ensureContext();
        if (!ac) return;
        const nb = getNoiseBuffer(ac);
        if (!nb) return;
        const now = ac.currentTime;
        const src = ac.createBufferSource();
        const filt = ac.createBiquadFilter();
        const g = ac.createGain();
        src.buffer = nb;
        filt.type = 'bandpass';
        filt.frequency.setValueAtTime(420, now);
        filt.frequency.exponentialRampToValueAtTime(980, now + 0.14);
        filt.Q.setValueAtTime(1.8, now);
        g.gain.setValueAtTime(0.0001, now);
        g.gain.linearRampToValueAtTime(0.038, now + 0.05);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.30);
        src.connect(filt);
        filt.connect(g);
        g.connect(ac.destination);
        src.start(now);
        src.stop(now + 0.32);
      } catch (_err) {}
    }

    function playFountainSplash() {
      if (muted) return;
      try {
        const ac = ensureContext();
        if (!ac) return;
        const now = ac.currentTime;
        const nb = getNoiseBuffer(ac);
        if (nb) {
          const src = ac.createBufferSource();
          const hp = ac.createBiquadFilter();
          const g = ac.createGain();
          src.buffer = nb;
          hp.type = 'bandpass';
          hp.frequency.setValueAtTime(2400, now);
          hp.Q.setValueAtTime(2.5, now);
          g.gain.setValueAtTime(0.0001, now);
          g.gain.linearRampToValueAtTime(0.028, now + 0.03);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
          src.connect(hp);
          hp.connect(g);
          g.connect(ac.destination);
          src.start(now);
          src.stop(now + 0.30);
        }
        const drop = ac.createOscillator();
        const dg = ac.createGain();
        drop.type = 'sine';
        drop.frequency.setValueAtTime(1174.66, now + 0.03);
        drop.frequency.exponentialRampToValueAtTime(1567.98, now + 0.16);
        dg.gain.setValueAtTime(0.0001, now + 0.03);
        dg.gain.exponentialRampToValueAtTime(0.022, now + 0.05);
        dg.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
        drop.connect(dg);
        dg.connect(ac.destination);
        drop.start(now + 0.03);
        drop.stop(now + 0.25);
      } catch (_err) {}
    }

    function playRareAscentChord() {
      if (muted) return;
      try {
        const ac = ensureContext();
        if (!ac) return;
        const now = ac.currentTime;
        const chord = [587.33, 739.99, 880.0, 1174.66, 1318.51];
        for (let i = 0; i < chord.length; i++) {
          const osc = ac.createOscillator();
          const g = ac.createGain();
          const t0 = now + i * 0.055;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(chord[i], t0);
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.exponentialRampToValueAtTime(0.026, t0 + 0.06);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.75);
          osc.connect(g);
          g.connect(ac.destination);
          osc.start(t0);
          osc.stop(t0 + 0.78);
        }
      } catch (_err) {}
    }

    return {
      unlock: unlock,
      setMuted: setMuted,
      toggleMute: toggleMute,
      isMuted: isMuted,
      playWhistlePhrase: playWhistlePhrase,
      playSillResonance: playSillResonance,
      playCurtainFlap: playCurtainFlap,
      playFountainSplash: playFountainSplash,
      playRareAscentChord: playRareAscentChord
    };
  }

  const DISCOVERY_ORDER = [
    'sill_1', 'curtain_1', 'fountain_1',
    'sill_2', 'curtain_2', 'fountain_2',
    'sill_3', 'curtain_3', 'fountain_3',
    'sill_4', 'curtain_4', 'fountain_4',
    'sill_5', 'curtain_5', 'sill_6', 'curtain_6'
  ];

  const CATEGORY_ALIASES = {
    window_sills: 'window_sills',
    sill: 'window_sills',
    sills: 'window_sills',
    flapping_curtains: 'flapping_curtains',
    curtain: 'flapping_curtains',
    curtains: 'flapping_curtains',
    fountains: 'fountains',
    fountain: 'fountains'
  };

  function findStoneById(id) {
    for (let i = 0; i < ZENITH_STONES.length; i++) {
      if (ZENITH_STONES[i].id === id) return ZENITH_STONES[i];
    }
    return null;
  }

  function createZenithEngine(opts) {
    const options = opts || {};
    const audio = createZenithAudio(Boolean(options.muted));

    let whistleEnergy = 0.48;
    let windGust = 0.55;
    let whistleCount = 1;
    let timeSec = 0;
    let curtainPhase = 0;
    let whistleRipple = 0;
    let lastGazeElevation = 0.55;
    let lastInspectedId = 'sill_1';
    let refreshCursor = 0;
    let categoryCursors = { window_sills: 0, flapping_curtains: 0, fountains: 0 };
    let imprintedMemories = [];
    let droplets = [];

    function makeMemoryEntry(stone, clarity, day) {
      return {
        id: stone.id,
        category: stone.category,
        label: stone.label,
        detail: stone.detail,
        echoText: stone.echoText,
        normX: stone.normX,
        normY: stone.normY,
        side: stone.side || 'center',
        clarity: Number(clamp(clarity, 0.18, 1).toFixed(4)),
        dayImprinted: day
      };
    }

    function seedInitialMemories() {
      const initialIds = ['sill_1', 'curtain_1', 'fountain_1'];
      imprintedMemories = [];
      for (let i = 0; i < initialIds.length; i++) {
        const s = findStoneById(initialIds[i]);
        if (s) imprintedMemories.push(makeMemoryEntry(s, 0.92, 1));
      }
    }

    function seedDroplets() {
      droplets = [];
      const fountains = ZENITH_STONES.filter(function (s) { return s.category === 'fountains'; });
      for (let f = 0; f < fountains.length; f++) {
        for (let k = 0; k < 9; k++) {
          droplets.push({
            fountainId: fountains[f].id,
            fountainIdx: f,
            t: (k / 9 + f * 0.17) % 1,
            speed: 0.42 + (k % 3) * 0.11,
            spread: (k % 2 === 0 ? 1 : -1) * (0.018 + (k % 4) * 0.009),
            apex: 0.055 + (k % 3) * 0.018,
            radius: 1.3 + (k % 3) * 0.65
          });
        }
      }
    }

    seedInitialMemories();
    seedDroplets();

    function getAverageClarity() {
      if (!imprintedMemories.length) return 0;
      let sum = 0;
      for (let i = 0; i < imprintedMemories.length; i++) {
        sum += imprintedMemories[i].clarity;
      }
      return Number((sum / imprintedMemories.length).toFixed(4));
    }

    function upsertMemory(stone, clarity, day) {
      for (let i = 0; i < imprintedMemories.length; i++) {
        if (imprintedMemories[i].id === stone.id) {
          imprintedMemories[i].clarity = Number(clamp(clarity, 0.18, 1).toFixed(4));
          imprintedMemories[i].dayImprinted = day;
          return imprintedMemories[i];
        }
      }
      const entry = makeMemoryEntry(stone, clarity, day);
      imprintedMemories.push(entry);
      return entry;
    }

    function pickNextWhistleStone() {
      for (let i = 0; i < DISCOVERY_ORDER.length; i++) {
        const id = DISCOVERY_ORDER[i];
        let exists = false;
        for (let j = 0; j < imprintedMemories.length; j++) {
          if (imprintedMemories[j].id === id) {
            exists = true;
            break;
          }
        }
        if (!exists) return findStoneById(id);
      }
      let lowestIdx = 0;
      for (let i = 1; i < imprintedMemories.length; i++) {
        if (imprintedMemories[i].clarity < imprintedMemories[lowestIdx].clarity) {
          lowestIdx = i;
        }
      }
      const chosenId = imprintedMemories[lowestIdx]
        ? imprintedMemories[lowestIdx].id
        : DISCOVERY_ORDER[refreshCursor++ % DISCOVERY_ORDER.length];
      return findStoneById(chosenId) || ZENITH_STONES[0];
    }

    function whistle(intensity, currentDay) {
      const lift = typeof intensity === 'number' && !isNaN(intensity) ? clamp(intensity, 0.04, 1) : 0.36;
      const day = typeof currentDay === 'number' && currentDay >= 1 ? Math.floor(currentDay) : 1;
      whistleCount += 1;
      whistleEnergy = Number(Math.min(1, whistleEnergy + lift).toFixed(4));
      windGust = Number(Math.min(1, Math.max(windGust, 0.52) + lift * 0.65).toFixed(4));
      whistleRipple = 1;
      const stone = pickNextWhistleStone();
      if (stone) {
        upsertMemory(stone, 1.0, day);
        lastInspectedId = stone.id;
      }
      audio.playWhistlePhrase(whistleEnergy);
      audio.playFountainSplash();
      return {
        liftImpulse: lift,
        whistleEnergy: whistleEnergy,
        whistleCount: whistleCount,
        imprintedCount: imprintedMemories.length
      };
    }

    function inspectUpperStone(idOrCategory, currentDay) {
      const day = typeof currentDay === 'number' && currentDay >= 1 ? Math.floor(currentDay) : 1;
      let stone = typeof idOrCategory === 'string' ? findStoneById(idOrCategory) : null;
      if (!stone) {
        const cat = CATEGORY_ALIASES[String(idOrCategory || '')] || 'window_sills';
        const pool = ZENITH_STONES.filter(function (s) { return s.category === cat; });
        const idx = (categoryCursors[cat] || 0) % pool.length;
        categoryCursors[cat] = idx + 1;
        stone = pool[idx] || ZENITH_STONES[0];
      }
      const memory = upsertMemory(stone, 1.0, day);
      lastInspectedId = stone.id;
      if (stone.category === 'window_sills') {
        audio.playSillResonance();
      } else if (stone.category === 'flapping_curtains') {
        windGust = Number(Math.min(1, windGust + 0.18).toFixed(4));
        audio.playCurtainFlap();
      } else {
        whistleRipple = Math.max(whistleRipple, 0.65);
        audio.playFountainSplash();
      }
      return {
        stone: Object.assign({}, stone),
        memory: Object.assign({}, memory),
        imprintedCount: imprintedMemories.length
      };
    }

    function decayMemoriesOnSunkenDay(decayAmount) {
      const dec = typeof decayAmount === 'number' && !isNaN(decayAmount) ? Math.max(0, decayAmount) : 0.11;
      for (let i = 0; i < imprintedMemories.length; i++) {
        imprintedMemories[i].clarity = Number(Math.max(0.18, imprintedMemories[i].clarity - dec).toFixed(4));
      }
      return {
        imprintedCount: imprintedMemories.length,
        averageMemoryClarity: getAverageClarity()
      };
    }

    function step(dtSec, env) {
      const dt = clamp(typeof dtSec === 'number' && !isNaN(dtSec) ? dtSec : 0.016, 0, 0.12);
      const e = env || {};
      const gaze = typeof e.gazeElevation === 'number' ? clamp(e.gazeElevation, -1, 1) : lastGazeElevation;
      const illHumor = typeof e.encrustedIllHumor === 'number' ? clamp(e.encrustedIllHumor, 0, 1) : 0.08;
      const reduced = Boolean(e.reducedMotion);
      lastGazeElevation = gaze;

      const motionScale = reduced ? 0.14 : 1.0;
      timeSec += dt * motionScale;
      curtainPhase += dt * motionScale * (1.5 + windGust * 2.4);
      whistleRipple = Math.max(0, whistleRipple - dt * 0.85);

      const targetEnergy = gaze > 0.12 ? clamp(0.42 - illHumor * 0.16, 0.22, 0.52) : 0.18;
      whistleEnergy = Number(lerp(whistleEnergy, targetEnergy, Math.min(1, dt * 0.55)).toFixed(4));

      const breezeWave = 0.44 + 0.14 * Math.sin(timeSec * 0.9) + (gaze > 0 ? 0.08 : -0.08);
      windGust = Number(lerp(windGust, clamp(breezeWave + whistleEnergy * 0.22, 0.2, 0.95), Math.min(1, dt * 0.9)).toFixed(4));

      for (let i = 0; i < droplets.length; i++) {
        const d = droplets[i];
        d.t = (d.t + dt * motionScale * d.speed * (0.75 + whistleEnergy * 0.65)) % 1;
      }

      if (gaze > 0.22) {
        const refreshRate = dt * (0.08 + Math.max(0, gaze - 0.22) * 0.12);
        for (let i = 0; i < imprintedMemories.length; i++) {
          imprintedMemories[i].clarity = Number(Math.min(1, imprintedMemories[i].clarity + refreshRate).toFixed(4));
        }
      }
    }

    function renderZenith(ctx, width, height, view) {
      if (!ctx || width <= 0 || height <= 0) return;
      const v = view || {};
      const gaze = clamp(typeof v.gazeElevation === 'number' ? v.gazeElevation : lastGazeElevation, -1, 1);
      const illHumor = clamp(typeof v.encrustedIllHumor === 'number' ? v.encrustedIllHumor : 0.08, 0, 1);
      const t = typeof v.timeSec === 'number' ? v.timeSec : timeSec;
      const anim = v.reducedMotion ? 0.12 : 1.0;
      const horizonY = height * (0.18 + (gaze + 1) * 0.37);
      if (horizonY <= 1) return;

      const upperAlpha = clamp((gaze + 0.22) / 0.36, 0, 1);
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, width, Math.min(height, horizonY + 3));
      ctx.clip();

      const skyGrad = safeLinearGrad(ctx, 0, 0, 0, horizonY, [
        [0, PALETTE.ceruleanVault],
        [0.58, PALETTE.linenSky],
        [1, illHumor > 0.45 ? '#cfd6dc' : '#f2f5f7']
      ], PALETTE.linenSky);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, horizonY + 3);

      // Sunlit zenith shaft & whistle breath rings
      ctx.fillStyle = hexToRgba(PALETTE.sprayPrism, 0.22 * upperAlpha);
      ctx.beginPath();
      ctx.moveTo(width * 0.36, 0);
      ctx.lineTo(width * 0.68, 0);
      ctx.lineTo(width * 0.56, horizonY);
      ctx.lineTo(width * 0.24, horizonY);
      ctx.closePath();
      ctx.fill();

      if (upperAlpha > 0.05 && (whistleEnergy > 0.45 || whistleRipple > 0.02)) {
        const cx = width * 0.5;
        const cy = horizonY * 0.24;
        for (let r = 0; r < 3; r++) {
          const rad = (22 + r * 28 + ((t * 24 * anim) % 28)) * (0.8 + whistleEnergy * 0.5);
          ctx.strokeStyle = hexToRgba(PALETTE.sprayPrism, (0.24 - r * 0.06) * upperAlpha);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Worm's-eye foreshortened limestone palazzo walls converging toward zenith sky
      if (upperAlpha > 0.02) {
        const roofY = Math.max(-height * 0.35, horizonY - height * (0.66 + gaze * 0.18));
        const baseInset = 0.29 - gaze * 0.03;
        const roofInset = 0.41 + gaze * 0.02;

        for (let sideIdx = 0; sideIdx < 2; sideIdx++) {
          const isLeft = sideIdx === 0;
          const xEdge = isLeft ? 0 : width;
          const xBase = width * (isLeft ? baseInset : 1 - baseInset);
          const xRoof = width * (isLeft ? roofInset : 1 - roofInset);

          ctx.fillStyle = safeLinearGrad(ctx, xEdge, horizonY, xRoof, roofY, [
            [0, hexToRgba(PALETTE.sillShadow, 0.92 * upperAlpha)],
            [0.45, hexToRgba(PALETTE.sunlitLimestone, 0.96 * upperAlpha)],
            [1, hexToRgba('#ece3d2', 0.98 * upperAlpha)]
          ], PALETTE.sunlitLimestone);
          ctx.beginPath();
          ctx.moveTo(xEdge, horizonY + 3);
          ctx.lineTo(xBase, horizonY + 3);
          ctx.lineTo(xRoof, roofY);
          ctx.lineTo(xEdge, roofY);
          ctx.closePath();
          ctx.fill();

          // Projecting cornice soffit & foreshortened ashlar courses
          ctx.strokeStyle = hexToRgba(PALETTE.sillShadow, 0.55 * upperAlpha);
          ctx.lineWidth = 1.4;
          for (let c = 1; c <= 5; c++) {
            const u = c / 6;
            const cy = lerp(horizonY, roofY, u);
            const cxIn = lerp(xBase, xRoof, u);
            ctx.beginPath();
            ctx.moveTo(xEdge, cy);
            ctx.lineTo(cxIn, cy + (horizonY - roofY) * 0.035);
            ctx.stroke();
          }
          ctx.lineWidth = 3.2;
          ctx.strokeStyle = hexToRgba(PALETTE.sillShadow, 0.78 * upperAlpha);
          ctx.beginPath();
          ctx.moveTo(xBase, horizonY + 3);
          ctx.lineTo(xRoof, roofY);
          ctx.stroke();
        }
      }

      // Inspectable Upper Zemrude stones: sills, curtains, fountains
      for (let i = 0; i < ZENITH_STONES.length && upperAlpha > 0.03; i++) {
        const s = ZENITH_STONES[i];
        const proj = projectUpperStone(s, gaze);
        const sx = proj.normX * width;
        const sy = proj.normY * height;
        if (sy < -60 || sy > horizonY + 26) continue;
        const active = v.hoveredId === s.id || v.selectedId === s.id || lastInspectedId === s.id;
        const dir = s.side === 'right' ? -1 : 1;
        const sc = clamp(width / 1100, 0.62, 1.18);

        if (s.category === 'window_sills') {
          const w = 44 * sc;
          const h = 11 * sc;
          ctx.fillStyle = hexToRgba('#46505a', 0.68 * upperAlpha);
          ctx.fillRect(sx - w * 0.38, sy - 26 * sc, w * 0.76, 24 * sc);
          ctx.fillStyle = hexToRgba(PALETTE.sillShadow, 0.94 * upperAlpha);
          ctx.fillRect(sx - w * 0.5, sy, w, h * 0.65);
          ctx.fillStyle = hexToRgba(PALETTE.sunlitLimestone, 0.98 * upperAlpha);
          ctx.fillRect(sx - w * 0.54, sy - h * 0.45, w * 1.08, h * 0.55);
          // Carved corbels + terracotta pot & swallow silhouette
          ctx.fillStyle = hexToRgba(PALETTE.sillShadow, 0.88 * upperAlpha);
          ctx.fillRect(sx - w * 0.36, sy + h * 0.5, 6 * sc, 9 * sc);
          ctx.fillRect(sx + w * 0.24, sy + h * 0.5, 6 * sc, 9 * sc);
          ctx.fillStyle = hexToRgba('#b56c49', 0.9 * upperAlpha);
          ctx.beginPath();
          ctx.moveTo(sx - 6 * sc, sy - h * 0.45);
          ctx.lineTo(sx + 6 * sc, sy - h * 0.45);
          ctx.lineTo(sx + 8 * sc, sy - 14 * sc);
          ctx.lineTo(sx - 8 * sc, sy - 14 * sc);
          ctx.closePath();
          ctx.fill();
        } else if (s.category === 'flapping_curtains') {
          const billow = (14 + windGust * 22 + Math.sin(curtainPhase + i * 1.3) * 8 * anim) * sc * dir;
          ctx.fillStyle = hexToRgba('#3d4954', 0.62 * upperAlpha);
          ctx.fillRect(sx - 12 * sc, sy - 22 * sc, 24 * sc, 34 * sc);
          ctx.fillStyle = hexToRgba(PALETTE.curtainBleach, 0.86 * upperAlpha);
          ctx.strokeStyle = hexToRgba(PALETTE.ceruleanVault, 0.62 * upperAlpha);
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(sx - 8 * sc * dir, sy - 20 * sc);
          ctx.quadraticCurveTo(sx + billow, sy - 4 * sc, sx + billow * 0.85, sy + 16 * sc);
          ctx.quadraticCurveTo(sx + billow * 0.3, sy + 20 * sc, sx - 6 * sc * dir, sy + 12 * sc);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          // Elevated rooftop & loggia marble fountain + parabolic silver water arcs
          const bw = 34 * sc;
          ctx.fillStyle = hexToRgba(PALETTE.sunlitLimestone, 0.94 * upperAlpha);
          ctx.beginPath();
          ctx.arc(sx, sy + 4 * sc, bw * 0.48, 0, Math.PI, false);
          ctx.fill();
          const arcSpan = (30 + whistleEnergy * 22) * sc * (i % 2 === 0 ? 1 : -1);
          const arcApex = (32 + whistleEnergy * 24) * sc;
          ctx.strokeStyle = hexToRgba(PALETTE.fountainSilver, 0.92 * upperAlpha);
          ctx.lineWidth = 2.1 * sc;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.quadraticCurveTo(sx + arcSpan * 0.5, sy - arcApex, sx + arcSpan, sy + 8 * sc);
          ctx.stroke();
          for (let d = 0; d < droplets.length; d++) {
            const dr = droplets[d];
            if (dr.fountainId !== s.id) continue;
            const u = dr.t;
            const dx = sx + arcSpan * u + dr.spread * width * 0.15;
            const dy = sy - 4 * u * (1 - u) * arcApex + u * 8 * sc;
            ctx.fillStyle = hexToRgba(PALETTE.sprayPrism, (1 - u * 0.55) * upperAlpha);
            ctx.beginPath();
            ctx.arc(dx, dy, dr.radius * sc, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        if (active) {
          ctx.strokeStyle = hexToRgba(PALETTE.memoryAmber, 0.9 * upperAlpha);
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(sx, sy, 22 * sc, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    function renderMemoryEchoes(ctx, width, height, view) {
      if (!ctx || width <= 0 || height <= 0) return;
      const v = view || {};
      const gaze = clamp(typeof v.gazeElevation === 'number' ? v.gazeElevation : lastGazeElevation, -1, 1);
      if (gaze >= -0.05 || !imprintedMemories.length) return;

      const t = typeof v.timeSec === 'number' ? v.timeSec : timeSec;
      const anim = v.reducedMotion ? 0.12 : 1.0;
      const horizonY = height * (0.18 + (gaze + 1) * 0.37);
      const lowerSpan = Math.max(40, height - horizonY);
      const depthGain = clamp((-0.05 - gaze) / 0.48, 0.08, 1);
      const avgClarity = getAverageClarity();
      const baseAlpha = clamp((0.12 + 0.52 * avgClarity) * depthGain, 0.04, 0.72);
      const sc = clamp(width / 1100, 0.62, 1.15);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, Math.max(0, horizonY), width, lowerSpan);
      ctx.clip();

      // Subterranean well / puddle mirror sheen scaled by averageMemoryClarity
      const poolCenterY = horizonY + lowerSpan * (gaze <= -0.65 ? 0.72 : 0.54);
      ctx.strokeStyle = hexToRgba(PALETTE.memoryAmber, baseAlpha * 0.55);
      ctx.lineWidth = 1.1;
      for (let r = 0; r < 3; r++) {
        const rx = (88 + r * 54) * sc;
        ctx.beginPath();
        ctx.moveTo(width * 0.5 - rx, poolCenterY + r * 14 * sc);
        ctx.quadraticCurveTo(width * 0.5, poolCenterY + (r * 14 + 7) * sc, width * 0.5 + rx, poolCenterY + r * 14 * sc);
        ctx.stroke();
      }

      for (let i = 0; i < imprintedMemories.length; i++) {
        const m = imprintedMemories[i];
        const mAlpha = clamp(baseAlpha * (0.45 + 0.55 * m.clarity), 0.04, 0.76);
        const shimmer = Math.sin(t * 1.6 * anim + i * 1.7) * 4 * sc;
        const ex = width * (0.20 + m.normX * 0.60) + shimmer;
        const ey = horizonY + lowerSpan * (0.28 + (1 - m.normY) * 0.54);

        if (m.category === 'window_sills') {
          // Inverted amber corbel & sill outline reflected in dark gutter/well water
          ctx.strokeStyle = hexToRgba(PALETTE.memoryAmber, mAlpha);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(ex - 20 * sc, ey);
          ctx.lineTo(ex + 20 * sc, ey);
          ctx.moveTo(ex - 13 * sc, ey);
          ctx.lineTo(ex - 10 * sc, ey - 8 * sc);
          ctx.moveTo(ex + 13 * sc, ey);
          ctx.lineTo(ex + 10 * sc, ey - 8 * sc);
          ctx.stroke();
        } else if (m.category === 'flapping_curtains') {
          // Ghostly remembered curtain curve rippling on dark water
          const dir = m.side === 'right' ? -1 : 1;
          ctx.strokeStyle = hexToRgba(PALETTE.memoryAmber, mAlpha * 0.92);
          ctx.fillStyle = hexToRgba(PALETTE.fountainSilver, mAlpha * 0.24);
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.moveTo(ex, ey + 14 * sc);
          ctx.quadraticCurveTo(ex + 18 * sc * dir + shimmer * 0.5, ey, ex + 12 * sc * dir, ey - 14 * sc);
          ctx.quadraticCurveTo(ex + 3 * sc * dir, ey - 6 * sc, ex, ey + 14 * sc);
          ctx.fill();
          ctx.stroke();
        } else {
          // Inverted fountain silver parabola mirrored in well abyss
          const span = (26 + (i % 2) * 10) * sc * (i % 2 === 0 ? 1 : -1);
          ctx.strokeStyle = hexToRgba(PALETTE.fountainSilver, mAlpha);
          ctx.lineWidth = 1.7;
          ctx.beginPath();
          ctx.moveTo(ex - span * 0.5, ey - 6 * sc);
          ctx.quadraticCurveTo(ex, ey + 22 * sc, ex + span * 0.5, ey - 4 * sc);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    function hitTest(normX, normY, gazeElevation) {
      if (typeof normX !== 'number' || typeof normY !== 'number') return null;
      const gaze = typeof gazeElevation === 'number' ? clamp(gazeElevation, -1, 1) : lastGazeElevation;
      if (gaze <= -0.10) return null;
      const horizonNorm = computeHorizonNorm(gaze);
      if (normY > horizonNorm + 0.03) return null;

      let best = null;
      let bestDist = 0.068;
      for (let i = 0; i < ZENITH_STONES.length; i++) {
        const s = ZENITH_STONES[i];
        const proj = projectUpperStone(s, gaze);
        if (proj.normY < -0.04 || proj.normY > horizonNorm + 0.03) continue;
        const dx = normX - proj.normX;
        const dy = normY - proj.normY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= bestDist) {
          bestDist = dist;
          best = s;
        }
      }
      if (!best) return null;
      return {
        kind: 'zenith_stone',
        id: best.id,
        category: best.category,
        label: best.label,
        detail: best.detail,
        echoText: best.echoText
      };
    }

    function getState() {
      return {
        whistleEnergy: whistleEnergy,
        windGust: windGust,
        whistleCount: whistleCount,
        totalUpperStones: 16,
        countsByCategory: {
          window_sills: 6,
          flapping_curtains: 6,
          fountains: 4
        },
        imprintedMemories: imprintedMemories.map(function (m) { return Object.assign({}, m); }),
        imprintedCount: imprintedMemories.length,
        averageMemoryClarity: getAverageClarity(),
        muted: audio.isMuted()
      };
    }

    function reset() {
      whistleEnergy = 0.48;
      windGust = 0.55;
      whistleCount = 1;
      timeSec = 0;
      curtainPhase = 0;
      whistleRipple = 0;
      lastGazeElevation = 0.55;
      lastInspectedId = 'sill_1';
      refreshCursor = 0;
      categoryCursors = { window_sills: 0, flapping_curtains: 0, fountains: 0 };
      seedInitialMemories();
      seedDroplets();
      return getState();
    }

    return {
      PALETTE: PALETTE,
      ZENITH_STONES: ZENITH_STONES,
      whistle: whistle,
      inspectUpperStone: inspectUpperStone,
      decayMemoriesOnSunkenDay: decayMemoriesOnSunkenDay,
      step: step,
      renderZenith: renderZenith,
      renderMemoryEchoes: renderMemoryEchoes,
      hitTest: hitTest,
      audio: audio,
      reset: reset,
      getState: getState
    };
  }

  const api = Object.freeze({
    PALETTE: PALETTE,
    ZENITH_STONES: ZENITH_STONES,
    createZenithEngine: createZenithEngine
  });

  globalThis.ZemrudeWhistlingZenith = api;
  if (typeof window !== 'undefined') {
    window.ZemrudeWhistlingZenith = api;
  }
})();
