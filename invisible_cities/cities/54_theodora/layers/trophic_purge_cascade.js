(function (root) {
  'use strict';

  var PALETTE = Object.freeze({
    asepticCement: '#cbc8be',
    limestoneAsh: '#1c1d21',
    cryptObsidian: '#0e0d11',
    vellumOchre: '#d8be86',
    incunabulaVermilion: '#b83a28',
    linnaeusVerdigris: '#52796f',
    lapisMarginalia: '#2f4b7c'
  });

  var STAGE_KEYS = Object.freeze([
    'condors',
    'serpents',
    'spiders',
    'flies',
    'termites',
    'woodworms',
    'rat_clans',
    'aseptic_zero'
  ]);

  var CEMENT_CURVE = Object.freeze([0, 0.08, 0.18, 0.30, 0.46, 0.64, 0.88, 1]);

  var SPECIES_CHAIN = Object.freeze([
    Object.freeze({
      index: 0,
      id: 'condors',
      name: 'Condors',
      binomial: 'Vultur gryphus',
      buffonTome: 'Histoire Naturelle — Oiseaux I',
      linnaeusOrder: 'Accipitres',
      plagueDesc: 'Carrion-winged raptors wheeling in dark gyres above limestone parapets and open cisterns.',
      purgeAction: 'Slay the Condors of the Upper Air',
      causalTriggerFrom: 'primordial_sky',
      causalUnleashes: 'serpents',
      causalConsequence: 'Slaying condors removes aerial predation so serpents multiply unconstrained across courtyards and cisterns!',
      basePopulation: 140,
      spikePopulation: 420,
      callNumber: 'BUF-OIS-I · LIN-ACC-01',
      taxonomicEpitaph: 'Pressed into copperplate plumage tables; no broad shadow crosses Theodora’s noon sky.'
    }),
    Object.freeze({
      index: 1,
      id: 'serpents',
      name: 'Serpents',
      binomial: 'Coluber theodorae',
      buffonTome: 'Quadrupèdes Ovipares & Serpents',
      linnaeusOrder: 'Amphibia Serpentes',
      plagueDesc: 'Unchecked vipers and cistern colubrids coiling across sunlit flagstones, wells, and colonnade steps.',
      purgeAction: 'Exterminate the Courtyard Serpents',
      causalTriggerFrom: 'condors',
      causalUnleashes: 'spiders',
      causalConsequence: 'Exterminating serpents removes ground insectivores and lets spiders drape the colonnades in webs!',
      basePopulation: 280,
      spikePopulation: 1950,
      callNumber: 'BUF-SER-II · LIN-AMP-02',
      taxonomicEpitaph: 'Counted by ventral scutes in dry folio Latin while cistern rims are sealed in lime mortar.'
    }),
    Object.freeze({
      index: 2,
      id: 'spiders',
      name: 'Spiders',
      binomial: 'Araneus domesticus',
      buffonTome: 'Insectes & Aptères',
      linnaeusOrder: 'Insecta Aptera',
      plagueDesc: 'Pallid orb-weavers shrouding arcades, capitals, and loggias in radial curtains of silk.',
      purgeAction: 'Sweep & Burn the Colonnade Spiders',
      causalTriggerFrom: 'serpents',
      causalUnleashes: 'flies',
      causalConsequence: 'Wiping out spiders dismantles every silken snare and causes flies to blacken the sky!',
      basePopulation: 900,
      spikePopulation: 8400,
      callNumber: 'BUF-APT-III · LIN-INS-03',
      taxonomicEpitaph: 'Eight-eyed cephalothoraxes pinned on rag paper; colonnade joints pointed smooth with ash cement.'
    }),
    Object.freeze({
      index: 3,
      id: 'flies',
      name: 'Flies',
      binomial: 'Musca caliginosa',
      buffonTome: 'Diptères',
      linnaeusOrder: 'Insecta Diptera',
      plagueDesc: 'Dense droning swarms eclipsing daylight across piazzas, archways, and market vaults.',
      purgeAction: 'Fumigate the Blackened Sky of Flies',
      causalTriggerFrom: 'spiders',
      causalUnleashes: 'termites',
      causalConsequence: 'Fumigating the blackened sky of flies clears the air only to yield timber-devouring termites!',
      basePopulation: 4500,
      spikePopulation: 68000,
      callNumber: 'BUF-DIP-IV · LIN-DIP-04',
      taxonomicEpitaph: 'Wing venation cataloged under magnifying glass after sulfur smoke scoured the upper piazzas.'
    }),
    Object.freeze({
      index: 4,
      id: 'termites',
      name: 'Termites',
      binomial: 'Termes fatalis',
      buffonTome: 'Névroptères Sociaux',
      linnaeusOrder: 'Insecta Aptera — Termes',
      plagueDesc: 'Blind pale colonies hollowing roof trusses, shutters, and oak rafters from within.',
      purgeAction: 'Crush the Timber-Devouring Termites',
      causalTriggerFrom: 'flies',
      causalUnleashes: 'woodworms',
      causalConsequence: 'Crushing the termite nests leaves every surviving beam and lintel prey to woodworms!',
      basePopulation: 12000,
      spikePopulation: 145000,
      callNumber: 'BUF-NEV-V · LIN-TER-05',
      taxonomicEpitaph: 'Soldier mandibles drawn at tenfold scale while hollowed trusses are grouted with stone.'
    }),
    Object.freeze({
      index: 5,
      id: 'woodworms',
      name: 'Woodworms',
      binomial: 'Anobium pertinax',
      buffonTome: 'Coléoptères Xylophages',
      linnaeusOrder: 'Insecta Coleoptera',
      plagueDesc: 'Xylophage beetles ticking inside wainscoting and joists, raining pale wood-flour until citizens strip all timber.',
      purgeAction: 'Strip All Wood for Stone & Poured Cement',
      causalTriggerFrom: 'termites',
      causalUnleashes: 'rat_clans',
      causalConsequence: 'Stripping all wood for stone and poured cement drives poison-immune rat clans out of the sewers!',
      basePopulation: 18000,
      spikePopulation: 210000,
      callNumber: 'BUF-COL-VI · LIN-COL-06',
      taxonomicEpitaph: 'Elytra indexed beside the municipal decree banning every wooden beam, stair, and shutter.'
    }),
    Object.freeze({
      index: 6,
      id: 'rat_clans',
      name: 'Rat Clans',
      binomial: 'Mus decumanus invictus',
      buffonTome: 'Quadrupèdes VII',
      linnaeusOrder: 'Mammalia Glires',
      plagueDesc: 'Fierce poison-immune sewer clans surging across newly poured cement conduits and cistern grates.',
      purgeAction: 'Execute Violent Massacre of the Rat Clans',
      causalTriggerFrom: 'woodworms',
      causalUnleashes: 'aseptic_zero',
      causalConsequence: 'Violent massacre of poison-immune rat clans achieves aseptic solitude: Theodora stands sealed in cement with Buffon and Linnaeus locked away as library volumes.',
      basePopulation: 620,
      spikePopulation: 9600,
      callNumber: 'BUF-QUA-VII · LIN-GLI-07',
      taxonomicEpitaph: 'Final mammalian entry clasped behind brass locks; zero living fauna remain in Theodora.'
    })
  ]);

  function createRng(seed) {
    var s = (seed >>> 0) || 0x54484434;
    return function nextRand() {
      s = (s + 0x6d2b79f5) >>> 0;
      var t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function detectReducedMotion() {
    try {
      if (root && typeof root.matchMedia === 'function') {
        return Boolean(root.matchMedia('(prefers-reduced-motion: reduce)').matches);
      }
    } catch (_) {}
    return false;
  }

  function makeInitialEvent() {
    return Object.freeze({
      step: 0,
      type: 'INITIAL_INFESTATION',
      purgedId: null,
      purgedName: null,
      binomial: null,
      buffonTome: null,
      linnaeusOrder: null,
      unleashedId: 'condors',
      unleashedName: 'Condors',
      livingFaunaCount: 7,
      cementRatio: 0,
      summary: 'Condors wheel in dark gyres over Theodora’s limestone towers and open cisterns (7 living orders active).'
    });
  }

  var listeners = new Set();

  var state = {
    stageIndex: 0,
    muted: false,
    reducedMotion: detectReducedMotion(),
    consultedVolumeId: null,
    chronicle: [makeInitialEvent()],
    lastCausalEvent: null,
    simTime: 0,
    purgeFlash: 0,
    lastPurgedIndex: -1,
    particles: [],
    webs: [],
    purgeTraces: []
  };
  state.lastCausalEvent = state.chronicle[0];

  var audioCtx = null;
  var noiseBuffer = null;

  function ensureAudioContext() {
    if (state.muted) return null;
    try {
      var Ctor = root && (root.AudioContext || root.webkitAudioContext);
      if (!Ctor) return null;
      if (!audioCtx) {
        audioCtx = new Ctor();
      }
      if (audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
        audioCtx.resume().catch(function () {});
      }
      return audioCtx;
    } catch (_) {
      return null;
    }
  }

  function getNoiseBuffer(ctx) {
    if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) {
      return noiseBuffer;
    }
    var len = Math.max(1, Math.floor(ctx.sampleRate * 0.65));
    var buf = ctx.createBuffer(1, len, ctx.sampleRate);
    var data = buf.getChannelData(0);
    var rng = createRng(0x51a7e1);
    for (var i = 0; i < len; i++) {
      data[i] = rng() * 2 - 1;
    }
    noiseBuffer = buf;
    return buf;
  }

  function playPurgeAudio(speciesIdx) {
    var ctx = ensureAudioContext();
    if (!ctx) return;
    try {
      var now = ctx.currentTime;
      var master = ctx.createGain();
      master.gain.setValueAtTime(0.16, now);
      master.gain.exponentialRampToValueAtTime(0.0008, now + 0.62);
      master.connect(ctx.destination);

      var nSrc = ctx.createBufferSource();
      nSrc.buffer = getNoiseBuffer(ctx);
      var filt = ctx.createBiquadFilter();
      var nGain = ctx.createGain();

      var startFreqs = [660, 440, 1320, 220, 480, 1840, 920];
      var endFreqs = [175, 130, 520, 96, 112, 240, 110];
      var filterFreqs = [1100, 3200, 2400, 1500, 760, 1950, 1280];

      filt.type = speciesIdx === 1 || speciesIdx === 3 ? 'bandpass' : 'lowpass';
      filt.frequency.setValueAtTime(filterFreqs[speciesIdx] || 1400, now);
      filt.Q.setValueAtTime(speciesIdx === 1 ? 5.5 : 2.2, now);

      nGain.gain.setValueAtTime(0.45, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
      nSrc.connect(filt);
      filt.connect(nGain);
      nGain.connect(master);
      nSrc.start(now);
      nSrc.stop(now + 0.38);

      var osc = ctx.createOscillator();
      var oGain = ctx.createGain();
      osc.type = speciesIdx === 3 ? 'sawtooth' : (speciesIdx === 6 ? 'square' : 'triangle');
      osc.frequency.setValueAtTime(startFreqs[speciesIdx] || 520, now);
      osc.frequency.exponentialRampToValueAtTime(endFreqs[speciesIdx] || 140, now + 0.34);
      oGain.gain.setValueAtTime(0.55, now);
      oGain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
      osc.connect(oGain);
      oGain.connect(master);
      osc.start(now);
      osc.stop(now + 0.4);

      if (speciesIdx === 6) {
        var sealNotes = [220, 330, 660];
        for (var k = 0; k < sealNotes.length; k++) {
          var sOsc = ctx.createOscillator();
          var sGain = ctx.createGain();
          sOsc.type = 'sine';
          sOsc.frequency.setValueAtTime(sealNotes[k], now + 0.14);
          sGain.gain.setValueAtTime(0.001, now + 0.12);
          sGain.gain.linearRampToValueAtTime(0.18 / (k + 1), now + 0.2);
          sGain.gain.exponentialRampToValueAtTime(0.0008, now + 0.6);
          sOsc.connect(sGain);
          sGain.connect(master);
          sOsc.start(now + 0.12);
          sOsc.stop(now + 0.61);
        }
      }
    } catch (_) {}
  }

  function playBookClaspAudio(volumeIdx) {
    var ctx = ensureAudioContext();
    if (!ctx) return;
    try {
      var now = ctx.currentTime;
      var master = ctx.createGain();
      master.gain.setValueAtTime(0.13, now);
      master.gain.exponentialRampToValueAtTime(0.0008, now + 0.14);
      master.connect(ctx.destination);

      var clickOsc = ctx.createOscillator();
      clickOsc.type = 'triangle';
      var baseHz = 1320 + ((volumeIdx || 0) % 7) * 115;
      clickOsc.frequency.setValueAtTime(baseHz, now);
      clickOsc.frequency.exponentialRampToValueAtTime(420, now + 0.045);
      clickOsc.connect(master);
      clickOsc.start(now);
      clickOsc.stop(now + 0.05);

      var pageSrc = ctx.createBufferSource();
      pageSrc.buffer = getNoiseBuffer(ctx);
      var hp = ctx.createBiquadFilter();
      hp.type = 'bandpass';
      hp.frequency.setValueAtTime(2450, now);
      hp.Q.setValueAtTime(3.2, now);
      var pGain = ctx.createGain();
      pGain.gain.setValueAtTime(0.32, now + 0.01);
      pGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      pageSrc.connect(hp);
      hp.connect(pGain);
      pGain.connect(master);
      pageSrc.start(now + 0.01);
      pageSrc.stop(now + 0.1);
    } catch (_) {}
  }

  function seedSwarmForStage(stageIdx) {
    var rng = createRng(0x54484400 + stageIdx * 977);
    var items = [];
    var webs = [];
    var i;

    if (stageIdx === 0) {
      for (i = 0; i < 11; i++) {
        items.push({
          cx: 0.14 + (i / 10) * 0.72 + (rng() - 0.5) * 0.06,
          cy: 0.18 + (i % 3) * 0.16 + rng() * 0.08,
          rx: 0.055 + rng() * 0.075,
          ry: 0.028 + rng() * 0.04,
          angle: rng() * Math.PI * 2,
          speed: (0.32 + rng() * 0.28) * (i % 2 === 0 ? 1 : -1),
          span: 13 + rng() * 11,
          flapPhase: rng() * Math.PI * 2
        });
      }
    } else if (stageIdx === 1) {
      for (i = 0; i < 18; i++) {
        items.push({
          u: rng(),
          v: 0.70 + rng() * 0.27,
          dir: i % 2 === 0 ? 1 : -1,
          speed: 0.045 + rng() * 0.055,
          len: 24 + rng() * 20,
          wavePhase: rng() * Math.PI * 2,
          amp: 3.2 + rng() * 2.8,
          ochre: i % 3 === 0
        });
      }
    } else if (stageIdx === 2) {
      for (i = 0; i < 8; i++) {
        webs.push({
          u: 0.09 + (i / 7) * 0.82,
          v: 0.42 + (i % 2) * 0.22 + (rng() - 0.5) * 0.06,
          r: 20 + rng() * 14,
          spokes: 9 + (i % 4),
          rings: 4 + (i % 3)
        });
      }
      for (i = 0; i < 16; i++) {
        var w = webs[i % webs.length];
        items.push({
          webIdx: i % webs.length,
          u: w.u + (rng() - 0.5) * 0.05,
          v: w.v + 0.04 + rng() * 0.22,
          dropBase: 10 + rng() * 26,
          bobPhase: rng() * Math.PI * 2,
          bobSpeed: 1.1 + rng() * 1.2,
          size: 3.2 + rng() * 2.2
        });
      }
    } else if (stageIdx === 3) {
      for (i = 0; i < 145; i++) {
        var cluster = i % 4;
        var vxCenter = 0.18 + cluster * 0.21;
        var vyCenter = 0.28 + (cluster % 2) * 0.26;
        items.push({
          u: vxCenter + (rng() - 0.5) * 0.28,
          v: Math.max(0.05, Math.min(0.95, vyCenter + (rng() - 0.5) * 0.42)),
          cx: vxCenter,
          cy: vyCenter,
          orbitSpeed: (1.4 + rng() * 2.2) * (i % 2 === 0 ? 1 : -1),
          phase: rng() * Math.PI * 2,
          jitter: 0.02 + rng() * 0.06,
          size: 1.4 + rng() * 1.8
        });
      }
    } else if (stageIdx === 4) {
      for (i = 0; i < 64; i++) {
        var beamRow = i % 4;
        items.push({
          lane: beamRow,
          u: rng(),
          v: 0.12 + beamRow * 0.24 + (rng() - 0.5) * 0.03,
          dir: beamRow % 2 === 0 ? 1 : -1,
          speed: 0.038 + rng() * 0.045,
          soldier: i % 6 === 0,
          phase: rng() * Math.PI * 2
        });
      }
    } else if (stageIdx === 5) {
      for (i = 0; i < 82; i++) {
        items.push({
          u: 0.04 + rng() * 0.92,
          v: rng(),
          fallSpeed: 0.14 + rng() * 0.22,
          swayPhase: rng() * Math.PI * 2,
          isBeetle: i < 18,
          size: i < 18 ? (2.6 + rng() * 1.4) : (1.1 + rng() * 1.5)
        });
      }
    } else if (stageIdx === 6) {
      for (i = 0; i < 22; i++) {
        items.push({
          u: rng(),
          v: (rng() - 0.5) * 26,
          dir: i % 2 === 0 ? 1 : -1,
          speed: 0.09 + rng() * 0.11,
          stridePhase: rng() * Math.PI * 2,
          len: 11 + rng() * 6,
          alphaPack: i % 5 === 0
        });
      }
    } else {
      for (i = 0; i < 26; i++) {
        items.push({
          u: 0.05 + rng() * 0.90,
          v: 0.08 + rng() * 0.84,
          driftX: (rng() - 0.5) * 0.008,
          driftY: -0.004 - rng() * 0.008,
          size: 1.0 + rng() * 1.4,
          alpha: 0.14 + rng() * 0.18
        });
      }
    }

    state.particles = items;
    state.webs = webs;
  }

  function spawnPurgeTraces(purgedIdx) {
    var rng = createRng(0x9911 + purgedIdx * 313);
    var traces = [];
    var shelfU = 0.22 + (purgedIdx / 6) * 0.56;
    for (var i = 0; i < 18; i++) {
      traces.push({
        u0: 0.08 + rng() * 0.84,
        v0: 0.12 + rng() * 0.76,
        u1: shelfU + (rng() - 0.5) * 0.04,
        progress: 0,
        speed: 1.55 + rng() * 0.85
      });
    }
    state.purgeTraces = traces;
  }

  seedSwarmForStage(0);

  function step(dtSec) {
    var dt = Number.isFinite(dtSec) ? Math.max(0, Math.min(0.1, dtSec)) : 0.016;

    if (state.purgeFlash > 0) {
      state.purgeFlash = Math.max(0, state.purgeFlash - dt * 1.85);
    }
    if (state.purgeTraces.length > 0) {
      var activeTraces = [];
      for (var t = 0; t < state.purgeTraces.length; t++) {
        var tr = state.purgeTraces[t];
        tr.progress += dt * tr.speed;
        if (tr.progress < 1) {
          activeTraces.push(tr);
        }
      }
      state.purgeTraces = activeTraces;
    }

    if (state.reducedMotion || dt === 0) {
      return;
    }

    state.simTime += dt;
    var pts = state.particles;
    var st = state.stageIndex;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      if (st === 0) {
        p.angle += p.speed * dt;
        p.flapPhase += dt * 3.1;
      } else if (st === 1) {
        p.u += p.dir * p.speed * dt;
        if (p.u > 1.06) p.u = -0.06;
        if (p.u < -0.06) p.u = 1.06;
        p.wavePhase += dt * 5.8;
      } else if (st === 2) {
        p.bobPhase += dt * p.bobSpeed;
      } else if (st === 3) {
        p.phase += dt * p.orbitSpeed;
        p.u += Math.cos(p.phase * 1.7 + i) * p.jitter * dt * 2.6;
        p.v += Math.sin(p.phase * 2.1 + i) * p.jitter * dt * 2.6;
        if (p.u < 0.02) p.u = 0.98;
        if (p.u > 0.98) p.u = 0.02;
        if (p.v < 0.04) p.v = 0.92;
        if (p.v > 0.94) p.v = 0.06;
      } else if (st === 4) {
        p.u += p.dir * p.speed * dt;
        if (p.u > 1.03) p.u = -0.03;
        if (p.u < -0.03) p.u = 1.03;
        p.phase += dt * 8.0;
      } else if (st === 5) {
        if (p.isBeetle) {
          p.swayPhase += dt * 9.0;
        } else {
          p.v += p.fallSpeed * dt;
          p.swayPhase += dt * 2.4;
          if (p.v > 1.0) p.v -= 1.0;
        }
      } else if (st === 6) {
        p.u += p.dir * p.speed * dt;
        if (p.u > 1.05) p.u = -0.05;
        if (p.u < -0.05) p.u = 1.05;
        p.stridePhase += dt * 11.5;
      } else {
        p.u += p.driftX * dt;
        p.v += p.driftY * dt;
        if (p.u < 0.02) p.u = 0.98;
        if (p.u > 0.98) p.u = 0.02;
        if (p.v < 0.04) p.v = 0.94;
      }
    }
  }

  function parseBand(raw, h, fbTop, fbBottom) {
    var top = fbTop;
    var bottom = fbBottom;
    if (Array.isArray(raw) && raw.length >= 2) {
      if (Number.isFinite(raw[0])) top = raw[0];
      if (Number.isFinite(raw[1])) bottom = raw[1];
    } else if (raw && typeof raw === 'object') {
      if (Number.isFinite(raw.y0)) top = raw.y0;
      else if (Number.isFinite(raw.top)) top = raw.top;
      else if (Number.isFinite(raw.y)) top = raw.y;
      else if (Number.isFinite(raw.startY)) top = raw.startY;

      if (Number.isFinite(raw.y1)) bottom = raw.y1;
      else if (Number.isFinite(raw.bottom)) bottom = raw.bottom;
      else if (Number.isFinite(raw.h)) bottom = top + raw.h;
      else if (Number.isFinite(raw.height)) bottom = top + raw.height;
      else if (Number.isFinite(raw.endY)) bottom = raw.endY;
    }
    if (h > 2 && top >= 0 && bottom <= 1.001 && bottom > top) {
      top *= h;
      bottom *= h;
    }
    if (!(bottom > top)) {
      top = fbTop;
      bottom = fbBottom;
    }
    return { top: top, bottom: bottom, height: Math.max(1, bottom - top) };
  }

  function normalizeLayoutMetrics(width, height, layoutMetrics) {
    var m = layoutMetrics && typeof layoutMetrics === 'object' ? layoutMetrics : {};
    var sky = parseBand(m.skyBand, height, 0, height * 0.46);
    var nave = parseBand(m.naveBand, height, sky.bottom, height * 0.74);
    var crypt = parseBand(m.cryptBand, height, nave.bottom, height);
    var sewerY = sky.bottom - Math.min(14, sky.height * 0.06);
    if (Number.isFinite(m.sewerY)) {
      sewerY = (height > 2 && m.sewerY > 0 && m.sewerY <= 1.001) ? m.sewerY * height : m.sewerY;
    }
    return { width: width, height: height, skyBand: sky, naveBand: nave, cryptBand: crypt, sewerY: sewerY };
  }

  function drawCondors(ctx, lm) {
    var sky = lm.skyBand;
    var w = lm.width;
    var scale = Math.max(0.62, Math.min(1.18, w / 960));
    ctx.save();
    for (var i = 0; i < state.particles.length; i++) {
      var p = state.particles[i];
      var x = (p.cx + Math.cos(p.angle) * p.rx) * w;
      var y = sky.top + (p.cy + Math.sin(p.angle) * p.ry) * sky.height * 0.72;
      var bank = Math.sin(p.angle) * 0.22 * (p.speed >= 0 ? 1 : -1);
      var flap = Math.sin(p.flapPhase) * 3.6 * scale;
      var span = p.span * scale;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(bank);

      ctx.strokeStyle = 'rgba(203, 200, 190, 0.14)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 8 * scale, span * 0.9, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      ctx.strokeStyle = PALETTE.cryptObsidian;
      ctx.fillStyle = '#252329';
      ctx.lineWidth = 2.1 * scale;
      ctx.beginPath();
      ctx.moveTo(-span, -flap);
      ctx.quadraticCurveTo(-span * 0.45, -6.5 * scale - flap * 0.4, 0, 0);
      ctx.quadraticCurveTo(span * 0.45, -6.5 * scale - flap * 0.4, span, -flap);
      ctx.stroke();

      ctx.fillStyle = PALETTE.asepticCement;
      ctx.beginPath();
      ctx.arc(0, -0.6 * scale, 1.9 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = PALETTE.incunabulaVermilion;
      ctx.beginPath();
      ctx.arc(1.8 * scale * (p.speed >= 0 ? 1 : -1), -1.4 * scale, 1.1 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawSerpents(ctx, lm) {
    var sky = lm.skyBand;
    var w = lm.width;
    var scale = Math.max(0.68, Math.min(1.15, w / 960));
    ctx.save();
    for (var i = 0; i < state.particles.length; i++) {
      var p = state.particles[i];
      var hx = p.u * w;
      var hy = sky.top + p.v * sky.height;
      var segs = 9;
      var stepLen = (p.len * scale) / segs;

      ctx.strokeStyle = p.ochre ? PALETTE.vellumOchre : PALETTE.linnaeusVerdigris;
      ctx.lineWidth = 2.6 * scale;
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (var s = 0; s <= segs; s++) {
        var sx = hx - p.dir * s * stepLen;
        var sy = hy + Math.sin(p.wavePhase - s * 0.85) * p.amp * scale * (1 - s / (segs + 3));
        if (s === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      var headY = hy + Math.sin(p.wavePhase) * p.amp * scale;
      ctx.fillStyle = p.ochre ? '#e5cf99' : '#6fa093';
      ctx.beginPath();
      ctx.arc(hx, headY, 2.5 * scale, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = PALETTE.incunabulaVermilion;
      ctx.lineWidth = 0.9 * scale;
      ctx.beginPath();
      ctx.moveTo(hx + p.dir * 2.5 * scale, headY);
      ctx.lineTo(hx + p.dir * 6.2 * scale, headY - 1.2 * scale);
      ctx.moveTo(hx + p.dir * 4.5 * scale, headY - 0.6 * scale);
      ctx.lineTo(hx + p.dir * 6.2 * scale, headY + 1.3 * scale);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSpiders(ctx, lm) {
    var sky = lm.skyBand;
    var w = lm.width;
    var scale = Math.max(0.65, Math.min(1.15, w / 960));
    ctx.save();
    for (var i = 0; i < state.webs.length; i++) {
      var wb = state.webs[i];
      var cx = wb.u * w;
      var cy = sky.top + wb.v * sky.height;
      var rad = wb.r * scale;

      ctx.strokeStyle = 'rgba(203, 200, 190, 0.36)';
      ctx.lineWidth = 0.85;
      for (var sp = 0; sp < wb.spokes; sp++) {
        var ang = (sp / wb.spokes) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad);
        ctx.stroke();
      }
      for (var rg = 1; rg <= wb.rings; rg++) {
        var rr = (rg / wb.rings) * rad;
        ctx.beginPath();
        for (var sp2 = 0; sp2 <= wb.spokes; sp2++) {
          var a2 = (sp2 / wb.spokes) * Math.PI * 2;
          var px = cx + Math.cos(a2) * rr;
          var py = cy + Math.sin(a2) * rr;
          if (sp2 === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      }
    }

    for (var j = 0; j < state.particles.length; j++) {
      var p = state.particles[j];
      var sx = p.u * w;
      var anchorY = sky.top + (p.v - 0.08) * sky.height;
      var drop = (p.dropBase + Math.sin(p.bobPhase) * 6) * scale;
      var sy = anchorY + drop;
      var r = p.size * scale;

      ctx.strokeStyle = 'rgba(216, 190, 134, 0.42)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(sx, anchorY);
      ctx.lineTo(sx, sy);
      ctx.stroke();

      ctx.fillStyle = PALETTE.cryptObsidian;
      ctx.strokeStyle = PALETTE.vellumOchre;
      ctx.lineWidth = 0.95;
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      for (var lg = -1; lg <= 1; lg += 2) {
        for (var k = -1; k <= 1; k++) {
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + lg * r * 2.4, sy + k * r * 1.4);
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  }

  function drawFlies(ctx, lm) {
    var sky = lm.skyBand;
    var w = lm.width;
    ctx.save();
    ctx.fillStyle = 'rgba(14, 13, 17, 0.34)';
    ctx.fillRect(0, sky.top, w, sky.height);

    for (var i = 0; i < state.particles.length; i++) {
      var p = state.particles[i];
      var x = p.u * w;
      var y = sky.top + p.v * sky.height;
      var buzz = Math.sin(p.phase * 3.0) * 1.8;

      ctx.strokeStyle = 'rgba(203, 200, 190, 0.42)';
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(x - p.size * 1.9, y - 1.3 + buzz * 0.4);
      ctx.lineTo(x + p.size * 1.9, y - 1.3 - buzz * 0.4);
      ctx.stroke();

      ctx.fillStyle = PALETTE.cryptObsidian;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawTermites(ctx, lm) {
    var w = lm.width;
    var zoneTop = lm.skyBand.bottom - lm.skyBand.height * 0.22;
    var zoneH = lm.skyBand.height * 0.22 + lm.naveBand.height * 0.52;
    ctx.save();

    for (var r = 0; r < 4; r++) {
      var by = zoneTop + (0.12 + r * 0.24) * zoneH;
      ctx.strokeStyle = 'rgba(216, 190, 134, 0.28)';
      ctx.lineWidth = 4.2;
      ctx.beginPath();
      ctx.moveTo(w * 0.04, by);
      ctx.lineTo(w * 0.96, by);
      ctx.stroke();
    }

    for (var i = 0; i < state.particles.length; i++) {
      var p = state.particles[i];
      var x = p.u * w;
      var y = zoneTop + p.v * zoneH + Math.sin(p.phase) * 0.9;

      ctx.fillStyle = p.soldier ? PALETTE.incunabulaVermilion : PALETTE.vellumOchre;
      ctx.beginPath();
      ctx.ellipse(x, y, p.soldier ? 3.4 : 2.5, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ead7a7';
      ctx.beginPath();
      ctx.arc(x - p.dir * 2.6, y, 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawWoodworms(ctx, lm) {
    var w = lm.width;
    var zoneTop = lm.skyBand.top + lm.skyBand.height * 0.48;
    var zoneBottom = lm.naveBand.bottom;
    var zoneH = Math.max(20, zoneBottom - zoneTop);
    ctx.save();

    ctx.strokeStyle = 'rgba(203, 200, 190, 0.34)';
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(w * 0.05, lm.sewerY);
    ctx.lineTo(w * 0.95, lm.sewerY);
    ctx.stroke();
    ctx.setLineDash([]);

    for (var i = 0; i < state.particles.length; i++) {
      var p = state.particles[i];
      var x = p.u * w + Math.sin(p.swayPhase) * (p.isBeetle ? 1.2 : 4.5);
      var y = zoneTop + p.v * zoneH;
      if (p.isBeetle) {
        ctx.fillStyle = '#5c3d28';
        ctx.strokeStyle = PALETTE.vellumOchre;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else {
        ctx.fillStyle = 'rgba(216, 190, 134, 0.78)';
        ctx.fillRect(x - p.size * 0.5, y - p.size * 0.5, p.size, p.size * 1.4);
      }
    }
    ctx.restore();
  }

  function drawRatClans(ctx, lm) {
    var w = lm.width;
    var baseY = lm.sewerY;
    var scale = Math.max(0.68, Math.min(1.15, w / 960));
    ctx.save();

    for (var g = 0; g < 5; g++) {
      var gx = w * (0.14 + g * 0.18);
      ctx.fillStyle = 'rgba(82, 121, 111, 0.22)';
      ctx.beginPath();
      ctx.arc(gx, baseY - 4, 11 * scale, Math.PI, 0);
      ctx.fill();
    }

    for (var i = 0; i < state.particles.length; i++) {
      var p = state.particles[i];
      var x = p.u * w;
      var hop = Math.abs(Math.sin(p.stridePhase)) * 2.6 * scale;
      var y = baseY + p.v * 0.38 - hop;
      var bl = p.len * scale;

      ctx.strokeStyle = 'rgba(203, 200, 190, 0.55)';
      ctx.lineWidth = 1.3 * scale;
      ctx.beginPath();
      ctx.moveTo(x - p.dir * bl * 0.5, y + 1);
      ctx.quadraticCurveTo(x - p.dir * bl * 1.2, y - 4 * scale, x - p.dir * bl * 1.7, y + 1.5 * scale);
      ctx.stroke();

      ctx.fillStyle = p.alphaPack ? '#3a3c44' : '#262830';
      ctx.strokeStyle = PALETTE.asepticCement;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      ctx.ellipse(x, y, bl * 0.55, bl * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = PALETTE.incunabulaVermilion;
      ctx.beginPath();
      ctx.arc(x + p.dir * bl * 0.42, y - bl * 0.08, 1.2 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawAsepticZero(ctx, lm) {
    var w = lm.width;
    var h = lm.skyBand.height + lm.naveBand.height;
    ctx.save();
    ctx.strokeStyle = 'rgba(203, 200, 190, 0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, lm.sewerY);
    ctx.lineTo(w, lm.sewerY);
    ctx.stroke();

    for (var i = 0; i < state.particles.length; i++) {
      var p = state.particles[i];
      ctx.fillStyle = 'rgba(203, 200, 190, ' + p.alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(p.u * w, lm.skyBand.top + p.v * h, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawPurgeFlashAndTraces(ctx, lm) {
    if (state.purgeFlash <= 0 && state.purgeTraces.length === 0) return;
    var w = lm.width;
    var h = lm.height;
    ctx.save();
    if (state.purgeFlash > 0) {
      ctx.fillStyle = 'rgba(203, 200, 190, ' + (state.purgeFlash * 0.28).toFixed(3) + ')';
      ctx.fillRect(0, 0, w, h);
    }
    var targetY = lm.naveBand.top + lm.naveBand.height * 0.52;
    for (var i = 0; i < state.purgeTraces.length; i++) {
      var tr = state.purgeTraces[i];
      var t = Math.min(1, tr.progress);
      var sx = tr.u0 * w;
      var sy = lm.skyBand.top + tr.v0 * lm.skyBand.height;
      var ex = tr.u1 * w;
      var px = sx + (ex - sx) * t;
      var py = sy + (targetY - sy) * t - Math.sin(t * Math.PI) * 18;
      ctx.fillStyle = 'rgba(216, 190, 134, ' + ((1 - t) * 0.85).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(px, py, 2.2 * (1 - t * 0.4), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function renderOverlay(ctx, width, height, layoutMetrics) {
    if (!ctx || !(width > 0) || !(height > 0)) return;
    var lm = normalizeLayoutMetrics(width, height, layoutMetrics);
    ctx.save();
    var st = state.stageIndex;
    if (st === 0) drawCondors(ctx, lm);
    else if (st === 1) drawSerpents(ctx, lm);
    else if (st === 2) drawSpiders(ctx, lm);
    else if (st === 3) drawFlies(ctx, lm);
    else if (st === 4) drawTermites(ctx, lm);
    else if (st === 5) drawWoodworms(ctx, lm);
    else if (st === 6) drawRatClans(ctx, lm);
    else drawAsepticZero(ctx, lm);

    drawPurgeFlashAndTraces(ctx, lm);
    ctx.restore();
  }

  function buildVolumeEntry(idx) {
    var sp = SPECIES_CHAIN[idx];
    if (!sp) return null;
    var isShelved = idx < state.stageIndex;
    var allLocked = state.stageIndex >= SPECIES_CHAIN.length;
    return {
      index: sp.index,
      id: sp.id,
      speciesId: sp.id,
      name: sp.name,
      speciesName: sp.name,
      binomial: sp.binomial,
      title: sp.name + ' (' + sp.binomial + ')',
      buffonTome: sp.buffonTome,
      linnaeusOrder: sp.linnaeusOrder,
      callNumber: sp.callNumber,
      shelfSlot: sp.index + 1,
      shelved: isShelved,
      locked: isShelved,
      vaultSealed: allLocked,
      taxonomicEpitaph: sp.taxonomicEpitaph,
      causalConsequence: sp.causalConsequence
    };
  }

  function resolveSpeciesIndex(idOrIndex) {
    if (typeof idOrIndex === 'number' && Number.isInteger(idOrIndex)) {
      if (idOrIndex >= 0 && idOrIndex < SPECIES_CHAIN.length) return idOrIndex;
      return -1;
    }
    if (typeof idOrIndex === 'string') {
      var trimmed = idOrIndex.trim();
      if (/^[0-6]$/.test(trimmed)) return parseInt(trimmed, 10);
      var lower = trimmed.toLowerCase();
      for (var i = 0; i < SPECIES_CHAIN.length; i++) {
        if (SPECIES_CHAIN[i].id === lower || SPECIES_CHAIN[i].name.toLowerCase() === lower) {
          return i;
        }
      }
    }
    return -1;
  }

  function buildSpeciesSnapshot(idx) {
    var sp = SPECIES_CHAIN[idx];
    var status = 'DORMANT';
    var population = sp.basePopulation;
    var spiked = false;
    var shelved = false;

    if (idx < state.stageIndex) {
      status = 'EXTERMINATED';
      population = 0;
      spiked = false;
      shelved = true;
    } else if (idx === state.stageIndex && state.stageIndex < SPECIES_CHAIN.length) {
      status = 'INFESTING';
      population = sp.spikePopulation;
      spiked = true;
      shelved = false;
    }

    return {
      index: sp.index,
      id: sp.id,
      name: sp.name,
      binomial: sp.binomial,
      buffonTome: sp.buffonTome,
      linnaeusOrder: sp.linnaeusOrder,
      plagueDesc: sp.plagueDesc,
      purgeAction: sp.purgeAction,
      causalTriggerFrom: sp.causalTriggerFrom,
      causalUnleashes: sp.causalUnleashes,
      causalConsequence: sp.causalConsequence,
      basePopulation: sp.basePopulation,
      spikePopulation: sp.spikePopulation,
      callNumber: sp.callNumber,
      status: status,
      population: population,
      spiked: spiked,
      shelved: shelved
    };
  }

  function getState() {
    var total = SPECIES_CHAIN.length;
    var stIdx = state.stageIndex;
    var livingCount = Math.max(0, total - stIdx);
    var isAseptic = livingCount === 0;
    var speciesList = [];
    var shelvedList = [];
    var fullShelf = [];

    for (var i = 0; i < total; i++) {
      speciesList.push(buildSpeciesSnapshot(i));
      var vol = buildVolumeEntry(i);
      fullShelf.push(vol);
      if (i < stIdx) {
        shelvedList.push(vol);
      }
    }

    var activeSp = stIdx < total ? speciesList[stIdx] : null;
    var consultedIdx = state.consultedVolumeId !== null ? resolveSpeciesIndex(state.consultedVolumeId) : -1;
    var consultedVol = consultedIdx >= 0 ? fullShelf[consultedIdx] : null;

    return {
      stageIndex: stIdx,
      stageKey: STAGE_KEYS[stIdx] || 'aseptic_zero',
      activeSpeciesId: activeSp ? activeSp.id : null,
      activeSpecies: activeSp,
      phase: isAseptic ? 'ASEPTIC_SANCTUARY' : 'TROPHIC_CASCADE',
      livingFaunaCount: livingCount,
      exterminatedCount: stIdx,
      cementRatio: CEMENT_CURVE[stIdx] !== undefined ? CEMENT_CURVE[stIdx] : 1,
      asepticSanctuary: isAseptic,
      buffonLinnaeusLocked: isAseptic,
      species: speciesList,
      shelvedVolumes: shelvedList,
      libraryShelf: fullShelf,
      consultedVolumeId: consultedVol ? consultedVol.id : null,
      consultedVolume: consultedVol,
      lastCausalEvent: state.lastCausalEvent,
      chronicle: state.chronicle.slice(),
      muted: state.muted,
      reducedMotion: state.reducedMotion
    };
  }

  function notifyChange() {
    var snap = getState();
    listeners.forEach(function (fn) {
      try {
        fn(snap);
      } catch (_) {}
    });
    return snap;
  }

  function performPurgeAt(idx) {
    if (idx < 0 || idx >= SPECIES_CHAIN.length || idx !== state.stageIndex) {
      return getState();
    }
    var sp = SPECIES_CHAIN[idx];
    var nextIdx = idx + 1;
    var nextSp = nextIdx < SPECIES_CHAIN.length ? SPECIES_CHAIN[nextIdx] : null;

    state.stageIndex = nextIdx;
    state.lastPurgedIndex = idx;
    state.consultedVolumeId = sp.id;
    state.purgeFlash = 1.0;
    spawnPurgeTraces(idx);
    seedSwarmForStage(nextIdx);

    var livingCount = Math.max(0, SPECIES_CHAIN.length - nextIdx);
    var evt = Object.freeze({
      step: nextIdx,
      type: livingCount === 0 ? 'ASEPTIC_SANCTUARY_SEALED' : 'TROPHIC_PURGE',
      purgedId: sp.id,
      purgedName: sp.name,
      binomial: sp.binomial,
      buffonTome: sp.buffonTome,
      linnaeusOrder: sp.linnaeusOrder,
      unleashedId: nextSp ? nextSp.id : 'aseptic_zero',
      unleashedName: nextSp ? nextSp.name : 'Aseptic Sanctuary',
      livingFaunaCount: livingCount,
      cementRatio: CEMENT_CURVE[nextIdx],
      summary: sp.causalConsequence
    });

    state.chronicle.push(evt);
    state.lastCausalEvent = evt;

    if (!state.muted) {
      playPurgeAudio(idx);
    }
    return notifyChange();
  }

  function exterminateNext() {
    if (state.stageIndex >= SPECIES_CHAIN.length) {
      return getState();
    }
    return performPurgeAt(state.stageIndex);
  }

  function exterminateSpecies(idOrIndex) {
    if (idOrIndex === undefined || idOrIndex === null) {
      return exterminateNext();
    }
    if ((idOrIndex === 'aseptic_zero' || idOrIndex === 7) && state.stageIndex === SPECIES_CHAIN.length - 1) {
      return performPurgeAt(state.stageIndex);
    }
    var idx = resolveSpeciesIndex(idOrIndex);
    if (idx === state.stageIndex && state.stageIndex < SPECIES_CHAIN.length) {
      return performPurgeAt(idx);
    }
    return getState();
  }

  function consultShelf(idOrIndex) {
    var targetIdx;
    if (idOrIndex === undefined || idOrIndex === null) {
      targetIdx = state.stageIndex > 0 ? state.stageIndex - 1 : 0;
    } else {
      targetIdx = resolveSpeciesIndex(idOrIndex);
      if (targetIdx < 0) {
        targetIdx = state.stageIndex > 0 ? state.stageIndex - 1 : 0;
      }
    }
    var entry = buildVolumeEntry(targetIdx);
    state.consultedVolumeId = entry.id;
    if (!state.muted) {
      playBookClaspAudio(targetIdx);
    }
    notifyChange();
    return entry;
  }

  function reset() {
    state.stageIndex = 0;
    state.consultedVolumeId = null;
    state.chronicle = [makeInitialEvent()];
    state.lastCausalEvent = state.chronicle[0];
    state.purgeFlash = 0;
    state.lastPurgedIndex = -1;
    state.purgeTraces = [];
    seedSwarmForStage(0);
    return notifyChange();
  }

  function setMuted(flag) {
    state.muted = Boolean(flag);
    return notifyChange();
  }

  function isMuted() {
    return state.muted;
  }

  function unlockAudio() {
    ensureAudioContext();
    return !state.muted;
  }

  function setReducedMotion(flag) {
    state.reducedMotion = Boolean(flag);
    return notifyChange();
  }

  function onChange(fn) {
    if (typeof fn === 'function') {
      listeners.add(fn);
      return function unsubscribe() {
        listeners.delete(fn);
      };
    }
    return function noop() {};
  }

  function init(options) {
    var opts = options && typeof options === 'object' ? options : {};
    if (typeof opts.reducedMotion === 'boolean') {
      state.reducedMotion = opts.reducedMotion;
    }
    if (typeof opts.muted === 'boolean') {
      state.muted = opts.muted;
    }
    if (typeof opts.onChange === 'function') {
      listeners.add(opts.onChange);
    }
    if (!state.particles || state.particles.length === 0) {
      seedSwarmForStage(state.stageIndex);
    }
    return getState();
  }

  var api = Object.freeze({
    SPECIES_CHAIN: SPECIES_CHAIN,
    STAGE_KEYS: STAGE_KEYS,
    PALETTE: PALETTE,
    init: init,
    getState: getState,
    exterminateNext: exterminateNext,
    exterminateSpecies: exterminateSpecies,
    consultShelf: consultShelf,
    reset: reset,
    setMuted: setMuted,
    isMuted: isMuted,
    unlockAudio: unlockAudio,
    setReducedMotion: setReducedMotion,
    onChange: onChange,
    step: step,
    renderOverlay: renderOverlay
  });

  root.TheodoraTrophicPurge = api;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
