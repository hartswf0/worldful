(function (root) {
  'use strict';

  const PALETTE = {
    saffronBazaar: '#e09f3e', muslinGold: '#f2cc6e', pistachioJade: '#8ea861', nutmegRusset: '#8c4a2f',
    poppySlate: '#4d4659', indigoNight: '#131829', harborUltramarine: '#1d354d',
    campfireAmber: '#eb6e2d', emberCrimson: '#b83a28', cottonParchment: '#f5ede0'
  };

  const TRIGGER_WORDS = [
    { id: 'wolf', word: 'wolf', key: '1', emberColor: '#eb6e2d' },
    { id: 'sister', word: 'sister', key: '2', emberColor: '#f2cc6e' },
    { id: 'hidden_treasure', word: 'hidden treasure', key: '3', emberColor: '#e09f3e' },
    { id: 'battle', word: 'battle', key: '4', emberColor: '#c94732' },
    { id: 'scabies', word: 'scabies', key: '5', emberColor: '#a88354' },
    { id: 'lovers', word: 'lovers', key: '6', emberColor: '#d96b82' }
  ];

  const DEFAULT_TURNINGS = ['Vernal Equinox', 'Summer Solstice', 'Autumnal Equinox', 'Winter Solstice'];

  const DEFAULT_NATIONS = [
    { index: 0, id: 'hormuz', name: 'Hormuz Strait', merchantName: 'Rashid al-Sirafi', routeType: 'sail', bannerColor: '#e09f3e' },
    { index: 1, id: 'samarkand', name: 'Samarkand Steppe', merchantName: 'Timur of Khiva', routeType: 'caravan', bannerColor: '#f2cc6e' },
    { index: 2, id: 'malabar', name: 'Malabar Coast', merchantName: 'Kesavan of Calicut', routeType: 'sail', bannerColor: '#8ea861' },
    { index: 3, id: 'bukhara', name: 'Sogdian Oasis', merchantName: 'Roxana of Bukhara', routeType: 'caravan', bannerColor: '#c94732' },
    { index: 4, id: 'aden', name: 'Aden Roadstead', merchantName: 'Tariq ibn Zayd', routeType: 'sail', bannerColor: '#eb6e2d' },
    { index: 5, id: 'khotan', name: 'Jade Gate of Khotan', merchantName: 'Shen of Khotan', routeType: 'caravan', bannerColor: '#a88354' },
    { index: 6, id: 'kilwa', name: 'Zanj Coral Isles', merchantName: 'Musa of Kilwa', routeType: 'sail', bannerColor: '#d96b82' }
  ];

  const MEMORY_CORPUS = {
    wolf: {
      nativeOrigin: 'High stone sheepfold at home, first November frost',
      nativeMemory: 'Gray frost on our cedar latch: a lean she-wolf paused below the dry vineyard wall, yellow eyes calm in lantern smoke before vanishing uphill.',
      merchantTales: [
        'Salt-marsh wolf of the reed delta, licking brine from stranded pearl skiffs while green phosphorescence clung to her wet ribs at moonset.',
        'White-pelted steppe leader pacing beside our felt wagons for nine nights, catching frozen mutton tallow tossed across blue snowdrift tracks.',
        'Red hill-wolf circling the cardamom drying mats at monsoon break, barking once like a bronze bell before leaping the swollen sluice.',
        'One-eyed canyon wolf nursing three cubs inside a tumbled watchtower cistern, warm breath steaming through cracked turquoise glaze at dawn.',
        'Basalt-black headland wolf trotting down to the frankincense jetty whenever yellow-striped dhows grounded, waiting patiently for dried shark offal.',
        'High-pass timber wolf trapped behind an avalanche screen, howling a clear fifth that shook loose icicles along our yak-hair pack ropes.',
        'Mangrove shadow-wolf with a notched ear, swimming silently between coral weirs while sleeping flamingos tucked their beaks beneath pink wings.'
      ]
    },
    sister: {
      nativeOrigin: 'Courtyard cistern at home, linen-washing noon',
      nativeMemory: 'My younger sister braiding wet rosemary into her dark plait beside our stone well, counting swallows through one squinted eye while sheets dried.',
      merchantTales: [
        'My twin sister diving six fathoms without a nose-clip, surfacing with two blistered pearl oysters and laughing salt foam across the gunwale.',
        'My eldest sister riding astride a two-humped lead camel, singing falconry verses while stitching silver coins along her felt bridal cuffs.',
        'My half-sister on the pepper coast grinding turmeric over wet granite, both palms stained bright saffron seven days after the boat race.',
        'My veiled sister tuning a mulberry-wood lute on our flat roof at dusk, dropping ripe mulberries into the baskets of passing water-carriers.',
        'My barefoot sister reading star altitudes through a brass quadrant on the sea-wall, naming every hidden reef before our old pilot woke.',
        'My quiet sister weaving raw gold thread into cloud-muslin by butter-lamp light, biting off knotted silk cleanly with her chipped front tooth.',
        'My tallest sister weighing cloves on the coral quay, balancing scarlet crab-eye seeds across tiny ivory pans without ever blinking.'
      ]
    },
    hidden_treasure: {
      nativeOrigin: 'Orchard retaining wall behind our cellar stairs',
      nativeMemory: 'Three tarnished silver groats and a carved almond-stone whistle sealed inside a clay oil cruet beneath the loose flagstone under our fig tree.',
      merchantTales: [
        'Forty green celadon bowls waxed inside bamboo pitch-casks, wedged beneath black brain-coral where only equinoctial neap tides bare the wreck ribs.',
        'A nomad belt of hammered ibex gold buried under seven blackened hearth-stones beside a bitter salt pan that blooms every twelfth spring.',
        'Uncut pigeon-blood spinels sewn inside hollow cinnamon quills, stacked openly in a customs shed where drowsy clerks smelled only bark dust.',
        'Two brass astrolabes and an indigo-dyer manual bricked inside the thirteenth spiral step of the leaning minaret outside the pistachio gate.',
        'Gray ambergris heavy as a sleeping calf wrapped in tarred yellow sailcloth, sunk beneath rusted chains in a cliff cove without wells.',
        'Nineteen bars of pale river electrum wedged inside a blue glacier crevasse, creeping three handspans down-valley each thaw toward the moraine.',
        'Tortoiseshell coffers packed with ancient aurei and whole nutmegs, resting dry inside a hollow baobab trunk sealed over by wild bees.'
      ]
    },
    battle: {
      nativeOrigin: 'Shallow gravel river-ford, late October rain',
      nativeMemory: 'Two parish militias shoving ash-wood pikes across muddy river reeds until cold rain soaked the powder horns and everyone trudged home shivering.',
      merchantTales: [
        'Grappling irons clattering across yellow-striped yards in red dust haze while clay naphtha pots hissed harmlessly into the choppy strait.',
        'Steppe horse-archers wheeling through bitter wormwood smoke at noon, bone-tipped whistling arrows splitting wicker shields without a single shouted word.',
        'Armored elephants knee-deep along flooded paddy embankments, bronze tusk-caps catching sheet lightning while monsoon thunder drowned every kettle drum.',
        'Night sappers counter-mining beneath mudbrick ramparts, ears pressed tight against brass basins until enemy pickaxes broke through into lamp smoke.',
        'Rowed galleys locked oar-to-oar off the white salt cape, lead sling-shot drumming wet rawhide canopies until the land breeze tore them apart.',
        'Mountain slingers holding a narrow shale ledge above the caravan gorge, levering round river boulders down through echoing mist until moonrise.',
        'Lagoon dhows dueling with long bamboo boarding-spears over turquoise shoals while silver needlefish leaped across the tangled steering sweeps.'
      ]
    },
    scabies: {
      nativeOrigin: 'Damp shearing-shed loft in wet April',
      nativeMemory: 'Red-speckled wrists caught from damp fleeces in spring, scrubbed raw by my grandmother with boiled walnut hulls, yellow sulfur tallow, and rainwater.',
      merchantTales: [
        'Fierce bunk-itch caught from damp coir rigging during forty windless days, cooled only when sailors plunged both arms into stinging brine barrels.',
        'Winter saddle-mange spreading from traded steppe ponies in snow quarters, smeared at twilight with warm birch tar and crushed juniper ash.',
        'Monsoon skin-fire stinging beneath wet cotton bales in the harbor godown, calmed with bitter neem-leaf paste beside smoky charcoal braziers.',
        'Dusty caravan rash between cramped fingers after tallying tarnished copper dirhams, washed clean at the steaming sulfur spring outside the wall.',
        'Red salt-blisters scratched sleeplessly beneath coarse wool cloaks on night watch, cured by rubbing halved limes and cedar soot before dawn.',
        'Prickling wool-mite rash under heavy sheepskin coats on the frosty pass, steamed away inside a river-pebble sweat tent scented with mugwort.',
        'Stubborn hold-itch carried in unwashed ginger sacks from outer atolls, scrubbed on white coral sand until trade winds dried every welt.'
      ]
    },
    lovers: {
      nativeOrigin: 'Stone hay-bridge behind the cooper lane',
      nativeMemory: 'Warm plum skin and crushed wild mint beneath our stone bridge at midnight, two breaths misting together while the watchman passed overhead.',
      merchantTales: [
        'Two pearl-sorters meeting behind upturned skiffs at dead low water, pressing salt-crusted palms together while slack yellow sails murmured above.',
        'A young caravan outrider and a felt-weaver whispering through a tent lattice in frost, trading hammered copper rings warm from their throats.',
        'Spice-weighers lingering inside the nutmeg loft after shutter-bolt, dark hair dusted with brown mace and wrists scented with crushed cardamom.',
        'Restless cousins sharing split pomegranates inside a dry qanat beneath the bazaar, counting donkey hooves rumbling across vaulted bricks overhead.',
        'A harbor pilot daughter and a foreign supercargo signaling with shuttered brass lanterns across black water on the eve of solstice tide.',
        'Two shivering muleteers wrapped inside one unbleached muslin bolt behind ginger packs, laughing into wool sleeves so sleeping camels stayed still.',
        'Night swimmers meeting on the outer lagoon sandbar under southern stars, tracing bright plankton rings around each other in warm surf.'
      ]
    }
  };

  function resolveNations(customNations) {
    const external = Array.isArray(customNations) && customNations.length === 7
      ? customNations
      : (root.EuphemiaBazaarLayer && Array.isArray(root.EuphemiaBazaarLayer.SEVEN_NATIONS) && root.EuphemiaBazaarLayer.SEVEN_NATIONS.length === 7
        ? root.EuphemiaBazaarLayer.SEVEN_NATIONS
        : null);
    return DEFAULT_NATIONS.map(function (base, idx) {
      const ext = external && external[idx] ? external[idx] : null;
      return {
        index: idx,
        id: (ext && ext.id) || base.id,
        name: (ext && ext.name) || base.name,
        merchantName: (ext && ext.merchantName) || base.merchantName,
        routeType: (ext && ext.routeType) || base.routeType,
        bannerColor: (ext && ext.bannerColor) || base.bannerColor
      };
    });
  }

  function resolveWordIndex(wordOrId) {
    if (wordOrId === null || wordOrId === undefined) return -1;
    const norm = String(wordOrId).trim().toLowerCase();
    const underscored = norm.replace(/\s+/g, '_');
    for (let i = 0; i < TRIGGER_WORDS.length; i += 1) {
      const spec = TRIGGER_WORDS[i];
      if (spec.id === norm || spec.id === underscored || spec.word === norm || spec.key === norm) {
        return i;
      }
    }
    return -1;
  }

  function createCampfireAudio(initialMuted) {
    let ctx = null, master = null, muted = Boolean(initialMuted);
    const MODAL_HZ = [146.83, 155.56, 185.0, 196.0, 220.0, 233.08, 261.63, 293.66];
    const HOME_HZ = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25];

    function ensureCtx() {
      if (ctx) return ctx;
      const AC = root.AudioContext || root.webkitAudioContext;
      if (!AC) return null;
      try {
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = muted ? 0 : 0.22;
        master.connect(ctx.destination);
      } catch (_err) { ctx = null; }
      return ctx;
    }

    function unlock() {
      const ac = ensureCtx();
      if (!ac) return false;
      if (ac.state === 'suspended' && typeof ac.resume === 'function') { try { ac.resume(); } catch (_err) {} }
      return true;
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      if (master && ctx) { try { master.gain.setTargetAtTime(muted ? 0 : 0.22, ctx.currentTime, 0.02); } catch (_err) {} }
      return muted;
    }

    function playChorus(wordIdx, nationIdx) {
      if (muted) return;
      const ac = ensureCtx();
      if (!ac || !master) return;
      try {
        if (ac.state === 'suspended' && ac.resume) ac.resume();
        const now = ac.currentTime;
        const crackleLen = Math.floor(ac.sampleRate * 0.28);
        const buf = ac.createBuffer(1, crackleLen, ac.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < crackleLen; i += 1) {
          data[i] = (Math.random() > 0.965 ? (Math.random() * 2 - 1) : (Math.random() * 2 - 1) * 0.05) * (1 - i / crackleLen);
        }
        const noise = ac.createBufferSource();
        noise.buffer = buf;
        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass'; bp.frequency.value = 1350 + wordIdx * 140; bp.Q.value = 2.4;
        const ng = ac.createGain();
        ng.gain.setValueAtTime(0.35, now); ng.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        noise.connect(bp); bp.connect(ng); ng.connect(master); noise.start(now);

        for (let n = 0; n < 7; n += 1) {
          const t0 = now + n * 0.038;
          const osc = ac.createOscillator(), og = ac.createGain(), flt = ac.createBiquadFilter();
          osc.type = n === nationIdx ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(MODAL_HZ[(wordIdx + n) % MODAL_HZ.length] * (n === nationIdx ? 2 : 1), t0);
          flt.type = 'lowpass'; flt.frequency.value = n === nationIdx ? 1480 : 920;
          og.gain.setValueAtTime(0.0001, t0);
          og.gain.linearRampToValueAtTime(n === nationIdx ? 0.14 : 0.055, t0 + 0.018);
          og.gain.exponentialRampToValueAtTime(0.0008, t0 + (n === nationIdx ? 0.62 : 0.34));
          osc.connect(flt); flt.connect(og); og.connect(master);
          osc.start(t0); osc.stop(t0 + (n === nationIdx ? 0.65 : 0.36));
        }
      } catch (_err) {}
    }

    function playRecall(wordIdx, isSwapped, nationIdx) {
      if (muted) return;
      const ac = ensureCtx();
      if (!ac || !master) return;
      try {
        if (ac.state === 'suspended' && ac.resume) ac.resume();
        const now = ac.currentTime;
        if (!isSwapped) {
          const base = HOME_HZ[wordIdx % HOME_HZ.length];
          [1, 1.5, 2].forEach(function (mult, idx) {
            const osc = ac.createOscillator(), g = ac.createGain();
            osc.type = idx === 0 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(base * mult, now + idx * 0.045);
            g.gain.setValueAtTime(0.0001, now + idx * 0.045);
            g.gain.linearRampToValueAtTime(0.11 / (idx + 1), now + idx * 0.045 + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0008, now + 0.55 + idx * 0.06);
            osc.connect(g); g.connect(master);
            osc.start(now + idx * 0.045); osc.stop(now + 0.65 + idx * 0.06);
          });
        } else {
          const ghost = ac.createOscillator(), gg = ac.createGain();
          ghost.type = 'sine'; ghost.frequency.setValueAtTime(HOME_HZ[wordIdx % HOME_HZ.length], now);
          gg.gain.setValueAtTime(0.05, now); gg.gain.exponentialRampToValueAtTime(0.0008, now + 0.14);
          ghost.connect(gg); gg.connect(master); ghost.start(now); ghost.stop(now + 0.16);

          const rootHz = MODAL_HZ[(wordIdx + (nationIdx || 0)) % MODAL_HZ.length] * 1.5;
          [1, 1.06, 1.26, 1.5].forEach(function (ratio, idx) {
            const osc = ac.createOscillator(), flt = ac.createBiquadFilter(), g = ac.createGain();
            osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
            osc.frequency.setValueAtTime(rootHz * ratio, now + 0.08 + idx * 0.035);
            flt.type = 'bandpass'; flt.frequency.value = 720 + idx * 340; flt.Q.value = 2.8;
            g.gain.setValueAtTime(0.0001, now + 0.08 + idx * 0.035);
            g.gain.linearRampToValueAtTime(0.12, now + 0.11 + idx * 0.035);
            g.gain.exponentialRampToValueAtTime(0.0008, now + 0.68 + idx * 0.04);
            osc.connect(flt); flt.connect(g); g.connect(master);
            osc.start(now + 0.08 + idx * 0.035); osc.stop(now + 0.74 + idx * 0.04);
          });
        }
      } catch (_err) {}
    }

    return { isMuted: function () { return muted; }, unlock: unlock, setMuted: setMuted, playChorus: playChorus, playRecall: playRecall };
  }
  function computeCampfireLayout(width, height) {
    const w = Math.max(240, width || 800);
    const h = Math.max(200, height || 500);
    const cx = w * 0.5;
    const cy = h * 0.53;
    const rx = Math.min(w * 0.37, h * 0.48);
    const ry = Math.min(h * 0.33, w * 0.28);
    const fires = [];
    for (let i = 0; i < 7; i += 1) {
      const ang = -Math.PI * 0.5 + (i * Math.PI * 2) / 7;
      const fx = cx + Math.cos(ang) * rx;
      const fy = cy + Math.sin(ang) * ry;
      const outX = Math.cos(ang);
      const outY = Math.sin(ang);
      const mx = fx + outX * Math.max(24, rx * 0.14);
      const my = fy + outY * Math.max(16, ry * 0.14);
      fires.push({ index: i, ang: ang, fx: fx, fy: fy, mx: mx, my: my });
    }
    const embers = [];
    const irx = rx * 0.42;
    const iry = ry * 0.42;
    for (let j = 0; j < 6; j += 1) {
      const eAng = -Math.PI * 0.5 + (j * Math.PI * 2) / 6;
      embers.push({
        index: j,
        wordId: TRIGGER_WORDS[j].id,
        ex: cx + Math.cos(eAng) * irx,
        ey: cy + Math.sin(eAng) * iry
      });
    }
    return { w: w, h: h, cx: cx, cy: cy, rx: rx, ry: ry, fires: fires, embers: embers };
  }

  function computeVoyageLayout(width, height) {
    const w = Math.max(240, width || 800);
    const h = Math.max(200, height || 500);
    const glyphs = [];
    for (let i = 0; i < 6; i += 1) {
      const t = (i + 0.5) / 6;
      const gx = w * (0.12 + t * 0.76);
      const arch = Math.sin(t * Math.PI);
      const gy = h * (0.44 - arch * 0.21) + (i % 2 === 0 ? -8 : 10);
      glyphs.push({ index: i, wordId: TRIGGER_WORDS[i].id, gx: gx, gy: gy });
    }
    return { w: w, h: h, horizonY: h * 0.68, glyphs: glyphs };
  }

  function createCampfireEngine(opts) {
    const options = opts || {};
    const audio = createCampfireAudio(Boolean(options.muted));
    let nations = resolveNations(options.nations);
    let time = 0;
    let totalTalesHeard = 0;
    let activeWordId = null;
    let activeChorus = [];
    let inspectedWordId = null;
    let inspectedEntry = null;
    let voyagePulse = { wordIndex: -1, alpha: 0 };

    const fireState = Array.from({ length: 7 }, function (_, idx) { return { phase: idx * 1.37, flare: 0 }; });
    const sparks = Array.from({ length: 42 }, function (_, idx) {
      return { fireIdx: idx % 7, u: (idx * 0.19) % 1, drift: ((idx % 5) - 2) * 0.35, speed: 0.38 + (idx % 7) * 0.07 };
    });
    let emberArcs = [];

    function createInitialSlots() {
      return TRIGGER_WORDS.map(function (spec) {
        const entry = MEMORY_CORPUS[spec.id];
        return {
          id: spec.id, word: spec.word, key: spec.key, emberColor: spec.emberColor,
          isSwapped: false, swapCount: 0, installedNationIndex: -1, bannerColor: PALETTE.cottonParchment,
          nativeText: entry.nativeMemory, nativeOrigin: entry.nativeOrigin,
          currentText: entry.nativeMemory, currentNarrator: 'Traveler (Own Memory)',
          currentNation: 'Native Homeland', turningSwapped: null, chorusEchoes: []
        };
      });
    }

    let slots = createInitialSlots();
    function countSwapped() {
      return slots.reduce(function (acc, s) { return acc + (s.isSwapped ? 1 : 0); }, 0);
    }

    function snapshotSlot(s) {
      return {
        id: s.id, word: s.word, key: s.key, emberColor: s.emberColor,
        isSwapped: s.isSwapped, swapCount: s.swapCount,
        nativeText: s.nativeText, nativeOrigin: s.nativeOrigin,
        nativeGhostText: s.isSwapped ? s.nativeText : null,
        currentText: s.currentText, currentNarrator: s.currentNarrator,
        currentNation: s.currentNation, turningSwapped: s.turningSwapped,
        chorusEchoes: s.chorusEchoes.slice()
      };
    }

    function getState() {
      const swappedCount = countSwapped();
      return {
        TRIGGER_WORDS: TRIGGER_WORDS.map(function (w) { return Object.assign({}, w); }),
        memorySlots: slots.map(snapshotSlot),
        swappedCount: swappedCount, intactCount: slots.length - swappedCount,
        totalTalesHeard: totalTalesHeard, activeWordId: activeWordId,
        activeChorus: activeChorus.slice(), inspectedWordId: inspectedWordId,
        inspectedEntry: inspectedEntry ? Object.assign({}, inspectedEntry) : null,
        muted: audio.isMuted()
      };
    }

    function speakWord(wordOrId, callOpts) {
      nations = resolveNations(options.nations);
      const wIdx = resolveWordIndex(wordOrId);
      const curSwapped = countSwapped();
      if (wIdx < 0) return { ok: false, id: null, word: null, swappedCount: curSwapped, intactCount: slots.length - curSwapped };
      const cOpts = callOpts || {};
      const tIdx = Number.isInteger(cOpts.turningIndex) ? ((cOpts.turningIndex % 4) + 4) % 4 : 0;
      const tLabel = cOpts.turningLabel || DEFAULT_TURNINGS[tIdx];
      const slot = slots[wIdx];
      const corpus = MEMORY_CORPUS[slot.id];

      let chosenIdx;
      if (slot.swapCount === 0 && Number.isInteger(cOpts.nationHintIndex) && cOpts.nationHintIndex >= 0 && cOpts.nationHintIndex < 7) {
        chosenIdx = cOpts.nationHintIndex;
      } else if (slot.swapCount === 0) {
        chosenIdx = (wIdx * 2 + tIdx) % 7;
      } else {
        chosenIdx = (slot.installedNationIndex + 1 + (tIdx % 2)) % 7;
        if (chosenIdx === slot.installedNationIndex) chosenIdx = (chosenIdx + 1) % 7;
      }

      const chorus = nations.map(function (nat, nIdx) {
        return {
          nationIndex: nIdx, nation: nat.name, narrator: nat.merchantName,
          routeType: nat.routeType, bannerColor: nat.bannerColor,
          wordId: slot.id, word: slot.word, text: corpus.merchantTales[nIdx],
          isInstalled: nIdx === chosenIdx
        };
      });

      const displacedText = slot.currentText;
      const installed = chorus[chosenIdx];
      slot.isSwapped = true;
      slot.swapCount += 1;
      slot.installedNationIndex = chosenIdx;
      slot.bannerColor = installed.bannerColor;
      slot.currentText = installed.text;
      slot.currentNarrator = installed.narrator;
      slot.currentNation = installed.nation;
      slot.turningSwapped = tLabel;
      slot.chorusEchoes = chorus;
      totalTalesHeard += 7;
      activeWordId = slot.id;
      activeChorus = chorus;

      for (let f = 0; f < 7; f += 1) {
        fireState[f].flare = f === chosenIdx ? 1.0 : 0.65;
        emberArcs.push({
          fromFire: f, toFire: (f + 1) % 7, wordIdx: wIdx, isPrimary: f === chosenIdx,
          color: f === chosenIdx ? slot.emberColor : nations[f].bannerColor,
          progress: 0, speed: f === chosenIdx ? 0.95 : 1.15 + (f % 3) * 0.14
        });
      }
      if (emberArcs.length > 28) emberArcs = emberArcs.slice(emberArcs.length - 28);
      audio.playChorus(wIdx, chosenIdx);
      if (inspectedWordId === slot.id) inspectedEntry = buildRecallEntry(slot, wIdx, 'campfire');

      const swappedCount = countSwapped();
      return {
        ok: true, id: slot.id, word: slot.word, chorus: chorus,
        displacedText: displacedText, installedText: slot.currentText,
        narrator: slot.currentNarrator, nation: slot.currentNation,
        turningSwapped: slot.turningSwapped, swapCount: slot.swapCount,
        swappedCount: swappedCount, intactCount: slots.length - swappedCount
      };
    }

    function buildRecallEntry(slot, wIdx, phase) {
      return {
        ok: true, id: slot.id, word: slot.word, key: slot.key, emberColor: slot.emberColor,
        phase: phase || 'voyage', isSwapped: slot.isSwapped, swapCount: slot.swapCount,
        provenance: slot.isSwapped ? 'swapped' : 'native',
        provenanceLabel: slot.isSwapped ? 'Foreign Merchant Memory' : 'Intact Native Memory',
        currentText: slot.currentText, recalledText: slot.currentText,
        nativeText: slot.nativeText, nativeOrigin: slot.nativeOrigin,
        nativeGhostText: slot.isSwapped ? slot.nativeText : null,
        currentNarrator: slot.currentNarrator, currentNation: slot.currentNation,
        turningSwapped: slot.turningSwapped, bannerColor: slot.bannerColor, slotIndex: wIdx
      };
    }

    function summonMemory(wordOrId, phase) {
      const wIdx = resolveWordIndex(wordOrId);
      if (wIdx < 0) return { ok: false, id: null, word: null };
      const slot = slots[wIdx];
      const entry = buildRecallEntry(slot, wIdx, phase);
      inspectedWordId = slot.id;
      inspectedEntry = entry;
      voyagePulse = { wordIndex: wIdx, alpha: 1.0 };
      audio.playRecall(wIdx, slot.isSwapped, slot.installedNationIndex);
      return entry;
    }

    function step(dt, env) {
      const reduced = Boolean(env && env.reducedMotion);
      const raw = typeof dt === 'number' && dt > 0 ? dt : 0.016;
      const dtSec = raw > 1.5 ? Math.min(raw / 1000, 0.1) : Math.min(raw, 0.1);
      time += reduced ? dtSec * 0.2 : dtSec;

      for (let i = 0; i < 7; i += 1) {
        fireState[i].flare = Math.max(0, fireState[i].flare - dtSec * (reduced ? 1.8 : 0.85));
      }
      if (!reduced) {
        for (let s = 0; s < sparks.length; s += 1) {
          sparks[s].u = (sparks[s].u + dtSec * sparks[s].speed) % 1;
        }
      }
      const nextArcs = [];
      for (let a = 0; a < emberArcs.length; a += 1) {
        const arc = emberArcs[a];
        arc.progress += dtSec * (reduced ? 2.4 : arc.speed);
        if (arc.progress < 1) nextArcs.push(arc);
      }
      emberArcs = nextArcs;
      if (voyagePulse.alpha > 0) {
        voyagePulse.alpha = Math.max(0, voyagePulse.alpha - dtSec * 0.75);
      }
    }

    function setMuted(flag) {
      return audio.setMuted(flag);
    }

    function unlockAudio() {
      return audio.unlock();
    }

    function reset() {
      slots = createInitialSlots();
      totalTalesHeard = 0;
      activeWordId = null;
      activeChorus = [];
      inspectedWordId = null;
      inspectedEntry = null;
      emberArcs = [];
      voyagePulse = { wordIndex: -1, alpha: 0 };
      for (let i = 0; i < 7; i += 1) fireState[i].flare = 0;
      return getState();
    }

    function drawCampfireScene(ctx, width, height, reduced) {
      nations = resolveNations(options.nations);
      const lay = computeCampfireLayout(width, height);
      ctx.save();
      ctx.fillStyle = 'rgba(19, 24, 41, 0.82)';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(242, 204, 110, 0.14)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(lay.cx, lay.cy, lay.rx * 1.06, lay.ry * 1.08, 0, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 7; i += 1) {
        const f = lay.fires[i];
        const nextF = lay.fires[(i + 1) % 7];
        ctx.strokeStyle = activeWordId ? 'rgba(235, 110, 45, 0.24)' : 'rgba(245, 237, 224, 0.08)';
        ctx.setLineDash([4, 5]);
        ctx.beginPath();
        ctx.moveTo(f.fx, f.fy);
        ctx.quadraticCurveTo(lay.cx, lay.cy, nextF.fx, nextF.fy);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      for (let i = 0; i < 7; i += 1) {
        const f = lay.fires[i];
        const nat = nations[i];
        const flk = reduced ? 0.5 : 0.5 + 0.5 * Math.sin(time * 6.2 + fireState[i].phase);
        const flare = fireState[i].flare;
        const glowR = (26 + flk * 7 + flare * 18) * Math.min(1.15, width / 640);

        ctx.save();
        ctx.translate(f.mx, f.my);
        ctx.rotate(f.ang + Math.PI * 0.5);
        ctx.fillStyle = nat.bannerColor || PALETTE.nutmegRusset;
        ctx.globalAlpha = 0.42;
        ctx.fillRect(-18, -7, 36, 14);
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = '#1b1d2e';
        ctx.beginPath();
        ctx.ellipse(-3, 0, 12, 4.5, -0.12, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(9, -3.5, 4.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(242, 204, 110, 0.55)';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        const grad = ctx.createRadialGradient(f.fx, f.fy, 2, f.fx, f.fy, glowR);
        grad.addColorStop(0, 'rgba(242, 204, 110, 0.88)');
        grad.addColorStop(0.45, 'rgba(235, 110, 45, 0.42)');
        grad.addColorStop(1, 'rgba(184, 58, 40, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(f.fx, f.fy, glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#52291b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(f.fx - 9, f.fy + 4);
        ctx.lineTo(f.fx + 9, f.fy - 2);
        ctx.moveTo(f.fx - 8, f.fy - 2);
        ctx.lineTo(f.fx + 8, f.fy + 4);
        ctx.stroke();

        const hFlame = 13 + flk * 6 + flare * 10;
        ctx.fillStyle = PALETTE.emberCrimson;
        ctx.beginPath();
        ctx.moveTo(f.fx - 7, f.fy + 2);
        ctx.quadraticCurveTo(f.fx - 3, f.fy - hFlame, f.fx, f.fy - hFlame * 1.15);
        ctx.quadraticCurveTo(f.fx + 4, f.fy - hFlame * 0.85, f.fx + 7, f.fy + 2);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = PALETTE.muslinGold;
        ctx.beginPath();
        ctx.moveTo(f.fx - 3.5, f.fy + 2);
        ctx.quadraticCurveTo(f.fx, f.fy - hFlame * 0.85, f.fx + 3.5, f.fy + 2);
        ctx.closePath();
        ctx.fill();
      }
      if (!reduced) {
        for (let s = 0; s < sparks.length; s += 1) {
          const sp = sparks[s];
          const f = lay.fires[sp.fireIdx];
          const sx = f.fx + Math.sin(time * 3 + s) * 7 + sp.drift * sp.u * 16;
          const sy = f.fy - 8 - sp.u * 34;
          ctx.fillStyle = sp.u < 0.45 ? PALETTE.muslinGold : PALETTE.campfireAmber;
          ctx.globalAlpha = Math.max(0, 1 - sp.u);
          ctx.beginPath();
          ctx.arc(sx, sy, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      for (let a = 0; a < emberArcs.length; a += 1) {
        const arc = emberArcs[a];
        const src = lay.fires[arc.fromFire];
        const dst = arc.isPrimary ? lay.embers[arc.wordIdx] : lay.fires[arc.toFire];
        const tx = arc.isPrimary ? dst.ex : dst.fx;
        const ty = arc.isPrimary ? dst.ey : dst.fy;
        const p = arc.progress;
        const ctrlX = (src.fx + tx) * 0.5;
        const ctrlY = Math.min(src.fy, ty) - (arc.isPrimary ? 48 : 28);
        const px = (1 - p) * (1 - p) * src.fx + 2 * (1 - p) * p * ctrlX + p * p * tx;
        const py = (1 - p) * (1 - p) * src.fy + 2 * (1 - p) * p * ctrlY + p * p * ty;

        ctx.strokeStyle = arc.color;
        ctx.globalAlpha = (1 - p * 0.65) * 0.85;
        ctx.lineWidth = arc.isPrimary ? 2.4 : 1.3;
        ctx.beginPath();
        ctx.moveTo(src.fx, src.fy - 6);
        ctx.quadraticCurveTo(ctrlX, ctrlY, px, py);
        ctx.stroke();

        ctx.fillStyle = PALETTE.muslinGold;
        ctx.beginPath();
        ctx.arc(px, py, arc.isPrimary ? 3.8 : 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (typeof ctx.fillText === 'function' && width >= 440) {
        ctx.font = '10px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(245, 237, 224, 0.62)';
        for (let i = 0; i < 7; i += 1) {
          ctx.fillText(nations[i].name, lay.fires[i].fx, lay.fires[i].fy + 20);
        }
      }
      for (let j = 0; j < 6; j += 1) {
        const em = lay.embers[j];
        const sl = slots[j];
        const r = activeWordId === sl.id ? 11 : 8.5;
        ctx.fillStyle = sl.isSwapped ? sl.emberColor : 'rgba(245, 237, 224, 0.22)';
        ctx.strokeStyle = sl.isSwapped ? PALETTE.muslinGold : 'rgba(245, 237, 224, 0.62)';
        ctx.lineWidth = activeWordId === sl.id ? 2.2 : 1.3;
        ctx.beginPath();
        ctx.arc(em.ex, em.ey, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        if (sl.isSwapped) {
          ctx.beginPath();
          ctx.arc(em.ex, em.ey, r + 3.5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(235, 110, 45, 0.55)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        if (typeof ctx.fillText === 'function') {
          ctx.font = '10px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = sl.isSwapped ? PALETTE.muslinGold : PALETTE.cottonParchment;
          ctx.fillText(sl.word, em.ex, em.ey + r + 12);
        }
      }
      ctx.restore();
    }

    function drawVoyageScene(ctx, width, height, reduced) {
      const lay = computeVoyageLayout(width, height);
      ctx.save();
      const sky = ctx.createLinearGradient(0, 0, 0, height);
      sky.addColorStop(0, '#0d1120');
      sky.addColorStop(0.66, PALETTE.indigoNight);
      sky.addColorStop(1, PALETTE.harborUltramarine);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, height);

      const glow = ctx.createRadialGradient(width * 0.14, lay.horizonY, 2, width * 0.14, lay.horizonY, width * 0.26);
      glow.addColorStop(0, 'rgba(235, 110, 45, 0.34)');
      glow.addColorStop(1, 'rgba(235, 110, 45, 0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(242, 204, 110, 0.22)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, lay.horizonY);
      ctx.lineTo(width, lay.horizonY);
      ctx.stroke();

      for (let i = 0; i < 6; i += 1) {
        const g = lay.glyphs[i];
        const sl = slots[i];
        const sel = inspectedWordId === sl.id;
        const tw = reduced ? 0 : Math.sin(time * 2.4 + i) * 1.5;

        if (sl.isSwapped) {
          ctx.strokeStyle = 'rgba(245, 237, 224, 0.22)';
          ctx.setLineDash([2, 3]);
          ctx.beginPath();
          ctx.arc(g.gx - 9, g.gy + 6, 10, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.strokeStyle = 'rgba(235, 110, 45, 0.32)';
          ctx.beginPath();
          ctx.moveTo(width * 0.14, lay.horizonY);
          ctx.quadraticCurveTo(g.gx * 0.6, g.gy + 36, g.gx, g.gy + tw);
          ctx.stroke();

          ctx.strokeStyle = sl.emberColor;
          ctx.fillStyle = sl.emberColor;
          ctx.lineWidth = sel ? 2.4 : 1.5;
          ctx.beginPath();
          for (let k = 0; k < 5; k += 1) {
            const a = -Math.PI * 0.5 + (k * Math.PI * 4) / 5;
            const px = g.gx + Math.cos(a) * (sel ? 14 : 11);
            const py = g.gy + tw + Math.sin(a) * (sel ? 14 : 11);
            if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(g.gx, g.gy + tw, 3.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = sel ? PALETTE.muslinGold : 'rgba(245, 237, 224, 0.72)';
          ctx.fillStyle = PALETTE.cottonParchment;
          ctx.lineWidth = sel ? 2.2 : 1.2;
          ctx.beginPath();
          ctx.arc(g.gx, g.gy + tw, sel ? 11 : 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(g.gx, g.gy + tw, 2.8, 0, Math.PI * 2);
          ctx.fill();
        }
        if (typeof ctx.fillText === 'function') {
          ctx.font = '10px Georgia, serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = sl.isSwapped ? PALETTE.muslinGold : PALETTE.cottonParchment;
          ctx.fillText(sl.word, g.gx, g.gy + tw + 22);
        }
      }
      ctx.restore();
    }

    function renderOverlay(ctx, width, height, env) {
      if (!ctx) return;
      const phase = (env && env.phase) || 'campfire';
      const reduced = Boolean(env && env.reducedMotion);
      if (phase === 'campfire') drawCampfireScene(ctx, width, height, reduced);
      else if (phase === 'voyage') drawVoyageScene(ctx, width, height, reduced);
    }

    function hitTest(x, y, width, height, phase) {
      const mode = phase || 'campfire';
      if (mode === 'campfire') {
        const lay = computeCampfireLayout(width, height);
        for (let j = 0; j < lay.embers.length; j += 1) {
          if (Math.hypot(x - lay.embers[j].ex, y - lay.embers[j].ey) <= 16) {
            return { type: 'ember', index: j, wordId: lay.embers[j].wordId };
          }
        }
        for (let i = 0; i < lay.fires.length; i += 1) {
          if (Math.hypot(x - lay.fires[i].fx, y - lay.fires[i].fy) <= 22) {
            return { type: 'fire', index: i, wordId: activeWordId };
          }
          if (Math.hypot(x - lay.fires[i].mx, y - lay.fires[i].my) <= 20) {
            return { type: 'merchant', index: i, wordId: activeWordId };
          }
        }
      } else if (mode === 'voyage') {
        const lay = computeVoyageLayout(width, height);
        for (let i = 0; i < lay.glyphs.length; i += 1) {
          if (Math.hypot(x - lay.glyphs[i].gx, y - lay.glyphs[i].gy) <= 20) {
            return { type: 'ember', index: i, wordId: lay.glyphs[i].wordId };
          }
        }
      }
      return { type: null, index: -1, wordId: null };
    }

    return {
      getState: getState, speakWord: speakWord, summonMemory: summonMemory,
      step: step, renderOverlay: renderOverlay, hitTest: hitTest,
      setMuted: setMuted, unlockAudio: unlockAudio, reset: reset
    };
  }

  const API = {
    TRIGGER_WORDS: TRIGGER_WORDS, MEMORY_CORPUS: MEMORY_CORPUS,
    DEFAULT_NATIONS: DEFAULT_NATIONS, createCampfireEngine: createCampfireEngine
  };
  if (typeof window !== 'undefined') window.EuphemiaCampfireLayer = API;
  root.EuphemiaCampfireLayer = API;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
