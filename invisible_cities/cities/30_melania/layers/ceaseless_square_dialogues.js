/*
 * City 30: Melania (Chapter V - Cities & the Dead 1)
 * Layer 1: Ceaseless Square Dialogues, Scamozzi Proscenium & Polyphonic Voice-Register Synth
 */
(function (root) {
  'use strict';

  const PALETTE = Object.freeze({
    cypress_obsidian: '#0D1114',
    slate_pavement: '#182026',
    proscenium_ochre: '#C99244',
    gilded_ochre: '#E3B363',
    mask_ivory: '#F2EAD9',
    parchment_bone: '#D8CBB3',
    velvet_crimson: '#962230',
    curtain_scarlet: '#C43848',
    cypress_verdigris: '#2C4D42'
  });

  const ROLE_ORDER = Object.freeze([
    'braggart_soldier',
    'parasite',
    'young_wastrel',
    'prostitute',
    'miserly_father',
    'amorous_daughter',
    'foolish_servant',
    'procuress',
    'hypocrite',
    'astrologer',
    'confidante',
    'usurer',
    'fallen_princes'
  ]);

  const KNOT_ORDER = Object.freeze([
    'gloriosus_duet',
    'squander_duet',
    'dowry_duet',
    'intrigue_duet',
    'omen_trio',
    'exile_ledger'
  ]);

  const ARCHETYPE_CATALOG = Object.freeze([
    Object.freeze({ id: 'braggart_soldier', index: 0, knotId: 'gloriosus_duet', title: 'The Braggart Soldier', shortTitle: 'Braggart Soldier', nominalCount: 1, registerName: 'Baritone Brass', baseFreqHz: 130.8, formantHz: 620, waveType: 'sawtooth', costumeColor: '#C43848', propLabel: 'Plumed crimson cloak & raised sword', propKind: 'sword', defaultMortal: 'Ferrante Spada' }),
    Object.freeze({ id: 'parasite', index: 1, knotId: 'gloriosus_duet', title: 'The Parasite', shortTitle: 'Parasite', nominalCount: 1, registerName: 'Nasal Reed', baseFreqHz: 293.7, formantHz: 1480, waveType: 'sawtooth', costumeColor: '#C99244', propLabel: 'Motley flatterer & trencher', propKind: 'trencher', defaultMortal: 'Lelio Mosca' }),
    Object.freeze({ id: 'young_wastrel', index: 2, knotId: 'squander_duet', title: 'The Young Wastrel', shortTitle: 'Young Wastrel', nominalCount: 1, registerName: 'Lyric Tenor', baseFreqHz: 261.6, formantHz: 1120, waveType: 'triangle', costumeColor: '#2C4D42', propLabel: 'Emerald doublet & dice purse', propKind: 'dice', defaultMortal: 'Flavio Doria' }),
    Object.freeze({ id: 'prostitute', index: 3, knotId: 'squander_duet', title: 'The Prostitute', shortTitle: 'Prostitute', nominalCount: 1, registerName: 'Contralto', baseFreqHz: 220.0, formantHz: 860, waveType: 'triangle', costumeColor: '#E3B363', propLabel: 'Gilded damask & carnelian mirror', propKind: 'mirror', defaultMortal: 'Imperia Bellini' }),
    Object.freeze({ id: 'miserly_father', index: 4, knotId: 'dowry_duet', title: 'The Miserly Father', shortTitle: 'Miserly Father', nominalCount: 1, registerName: 'Bass', baseFreqHz: 98.0, formantHz: 460, waveType: 'sawtooth', costumeColor: '#6E4E2E', propLabel: 'Furred robe & padlocked strongbox', propKind: 'strongbox', defaultMortal: 'Pantaleone Bardi' }),
    Object.freeze({ id: 'amorous_daughter', index: 5, knotId: 'dowry_duet', title: 'The Amorous Daughter', shortTitle: 'Amorous Daughter', nominalCount: 1, registerName: 'Soprano', baseFreqHz: 523.3, formantHz: 1850, waveType: 'sine', costumeColor: '#F2EAD9', propLabel: 'Ivory veil & lattice rose', propKind: 'rose', defaultMortal: 'Lucinda Bardi' }),
    Object.freeze({ id: 'foolish_servant', index: 6, knotId: 'intrigue_duet', title: 'The Foolish Servant', shortTitle: 'Foolish Servant', nominalCount: 1, registerName: 'Buffo-Alto', baseFreqHz: 329.6, formantHz: 1340, waveType: 'square', costumeColor: '#B87B3E', propLabel: 'Jester bells & crumpled billet', propKind: 'billet', defaultMortal: 'Zanni Truffaldino' }),
    Object.freeze({ id: 'procuress', index: 7, knotId: 'intrigue_duet', title: 'The Procuress', shortTitle: 'Procuress', nominalCount: 1, registerName: 'Chest-Mezzo', baseFreqHz: 174.6, formantHz: 740, waveType: 'sawtooth', costumeColor: '#962230', propLabel: 'Hooded shawl & iron keys', propKind: 'keys', defaultMortal: 'Madonna Ruffiana' }),
    Object.freeze({ id: 'hypocrite', index: 8, knotId: 'omen_trio', title: 'The Hypocrite', shortTitle: 'Hypocrite', nominalCount: 1, registerName: 'Cello-Baritone', baseFreqHz: 146.8, formantHz: 680, waveType: 'triangle', costumeColor: '#3E4D56', propLabel: 'Rosary & sidelong mask', propKind: 'rosary', defaultMortal: 'Fra Tartuffo' }),
    Object.freeze({ id: 'astrologer', index: 9, knotId: 'omen_trio', title: 'The Astrologer', shortTitle: 'Astrologer', nominalCount: 1, registerName: 'Crystalline Overtone', baseFreqHz: 440.0, formantHz: 2100, waveType: 'sine', costumeColor: '#356354', propLabel: 'Star-chart & brass astrolabe', propKind: 'astrolabe', defaultMortal: 'Alvise Stellario' }),
    Object.freeze({ id: 'confidante', index: 10, knotId: 'omen_trio', title: 'The Confidante', shortTitle: 'Confidante', nominalCount: 1, registerName: 'Flute-Mezzo', baseFreqHz: 392.0, formantHz: 1620, waveType: 'sine', costumeColor: '#D8CBB3', propLabel: 'Pillar shadow & whispered fan', propKind: 'fan', defaultMortal: 'Corallina Veli' }),
    Object.freeze({ id: 'usurer', index: 11, knotId: 'exile_ledger', title: 'The Usurer', shortTitle: 'Usurer', nominalCount: 1, registerName: 'Harpsichord-Bass', baseFreqHz: 110.0, formantHz: 920, waveType: 'sawtooth', costumeColor: '#9B7438', propLabel: 'Pawn ledger & balance scales', propKind: 'scales', defaultMortal: 'Messer Scarpia' }),
    Object.freeze({ id: 'fallen_princes', index: 12, knotId: 'exile_ledger', title: 'A Hundred Thousand Fallen Princes', shortTitle: '100,000 Fallen Princes', nominalCount: 100000, registerName: 'Choral Fifths', baseFreqHz: 196.0, formantHz: 980, waveType: 'triangle', costumeColor: '#962230', propLabel: 'Tarnished coronets & threadbare ermine', propKind: 'coronet', defaultMortal: 'Prince Ottavio & Exiles' })
  ]);

  const ARCHETYPE_BY_ID = Object.freeze(
    ARCHETYPE_CATALOG.reduce(function (acc, item) {
      acc[item.id] = item;
      return acc;
    }, {})
  );

  const DIALOGUE_KNOTS = Object.freeze([
    Object.freeze({
      id: 'gloriosus_duet', index: 0, number: 1, roman: 'I',
      title: 'The Sword & the Trencher',
      roles: Object.freeze(['braggart_soldier', 'parasite']),
      anchor: Object.freeze({ rx: 0.35, ry: 0.81 }),
      exchanges: Object.freeze([
        Object.freeze({ speakerRoleId: 'braggart_soldier', listenerRoleId: 'parasite', text: 'See where this notch bit through seven siege-towers before mortar dried upon their parapets!', secularInflection: 'The notched blade claims a rusted hinge from an older garrison.' }),
        Object.freeze({ speakerRoleId: 'parasite', listenerRoleId: 'braggart_soldier', text: 'Eight towers, Captain—the eighth collapsed merely from the wind of your scabbard; pass the capon gravy.', secularInflection: 'A younger spoon polishes the platter while repeating the tally.' }),
        Object.freeze({ speakerRoleId: 'braggart_soldier', listenerRoleId: 'parasite', text: 'Had the river not begged quarter at my boot-sole, its eels would march in fetters under this arch!', secularInflection: 'The cistern runs dry yet remembers the boast word for word.' }),
        Object.freeze({ speakerRoleId: 'parasite', listenerRoleId: 'braggart_soldier', text: 'And what conqueror feeds his witnesses half so royally? Pour again before my applause grows hoarse!', secularInflection: 'Appetite outlives every general whose goblet it flatters.' }),
        Object.freeze({ speakerRoleId: 'braggart_soldier', listenerRoleId: 'parasite', text: 'Stand back three flagstones—when I rehearse the lunge at Oriolo, sparks singe the balustrade!', secularInflection: 'Fresh boots step into the hollow worn by the lunging heel.' })
      ])
    }),
    Object.freeze({
      id: 'squander_duet', index: 1, number: 2, roman: 'II',
      title: 'The Dice Purse & the Mirror',
      roles: Object.freeze(['young_wastrel', 'prostitute']),
      anchor: Object.freeze({ rx: 0.65, ry: 0.81 }),
      exchanges: Object.freeze([
        Object.freeze({ speakerRoleId: 'young_wastrel', listenerRoleId: 'prostitute', text: 'Take the olive groves east of the moat—tonight your wrists deserve heavier gold than my father’s seal!', secularInflection: 'The boundary stones shift owners while the vow keeps its cadence.' }),
        Object.freeze({ speakerRoleId: 'prostitute', listenerRoleId: 'young_wastrel', text: 'Promises chime sweetly in dusk light, my sparrow, yet only weighed florins unlatch the velvet stair.', secularInflection: 'Her carnelian glass catches a new chin beneath the same plume.' }),
        Object.freeze({ speakerRoleId: 'young_wastrel', listenerRoleId: 'prostitute', text: 'Three sixes on the bone before cockcrow, or I pawn the coach-horses down to their braided bridles!', secularInflection: 'The ivory dice outlast the fevered fingers casting them.' }),
        Object.freeze({ speakerRoleId: 'prostitute', listenerRoleId: 'young_wastrel', text: 'Keep one mule for daybreak, sweet spendthrift; fondness cools fast when the purse-strings hang slack.', secularInflection: 'The tariff endures across seven generations of breathless heirs.' }),
        Object.freeze({ speakerRoleId: 'young_wastrel', listenerRoleId: 'prostitute', text: 'Look into your glass—am I not richer squandering an estate at your knee than hoarding dust?', secularInflection: 'Another voice completes the wager mid-breath without a pause.' })
      ])
    }),
    Object.freeze({
      id: 'dowry_duet', index: 2, number: 3, roman: 'III',
      title: 'The Strongbox & the Lattice',
      roles: Object.freeze(['miserly_father', 'amorous_daughter']),
      anchor: Object.freeze({ rx: 0.20, ry: 0.67 }),
      exchanges: Object.freeze([
        Object.freeze({ speakerRoleId: 'miserly_father', listenerRoleId: 'amorous_daughter', text: 'Triple-turn the bolt and pinch that tallow wick—sighs at the casement burn good wax for penniless lutes!', secularInflection: 'Three padlocks rust and are oiled anew upon the same oak chest.' }),
        Object.freeze({ speakerRoleId: 'amorous_daughter', listenerRoleId: 'miserly_father', text: 'Father, the cypress dusk stifles me behind iron bars while every shadow under the arch speaks his name!', secularInflection: 'A younger throat inherits the sigh before its echo leaves the lintel.' }),
        Object.freeze({ speakerRoleId: 'miserly_father', listenerRoleId: 'amorous_daughter', text: 'Shadows bring neither salt nor rent; show me a suitor whose ledger weighs heavier than his ribcage!', secularInflection: 'Clipped ducats are recounted by steadier, narrower candlelight.' }),
        Object.freeze({ speakerRoleId: 'amorous_daughter', listenerRoleId: 'miserly_father', text: 'You lock coined metal till it turns verdigris, yet my April hours spill through the grating unspent!', secularInflection: 'A fresh rose replaces the dry petal between one heartbeat and the next.' }),
        Object.freeze({ speakerRoleId: 'miserly_father', listenerRoleId: 'amorous_daughter', text: 'Inward, girl! Even listening at the keyhole wears the brass ward down a grain each winter!', secularInflection: 'The iron ward thins imperceptibly toward an unbolted century.' })
      ])
    }),
    Object.freeze({
      id: 'intrigue_duet', index: 3, number: 4, roman: 'IV',
      title: 'The Crumpled Billet & the Keys',
      roles: Object.freeze(['foolish_servant', 'procuress']),
      anchor: Object.freeze({ rx: 0.80, ry: 0.67 }),
      exchanges: Object.freeze([
        Object.freeze({ speakerRoleId: 'foolish_servant', listenerRoleId: 'procuress', text: 'Psst, mother! Either this sealed billet goes to the third balcony or the apothecary—my cuff mixed both!', secularInflection: 'The misdirected letter arrives on cue across decades of intrigue.' }),
        Object.freeze({ speakerRoleId: 'procuress', listenerRoleId: 'foolish_servant', text: 'Still your jingling bells, simpleton; slip me two groats and every postern in the ward turns on greased hinges.', secularInflection: 'Her iron ring gains one key for every walled-up threshold.' }),
        Object.freeze({ speakerRoleId: 'foolish_servant', listenerRoleId: 'procuress', text: 'If my master catches my shadow near the wellhead, swear I came buying poultices for his gout!', secularInflection: 'The alibi leaps intact from breathless messenger to messenger.' }),
        Object.freeze({ speakerRoleId: 'procuress', listenerRoleId: 'foolish_servant', text: 'Hand me the wax and turn your jerkin inside out—night errands pay the runner last and the doorway first.', secularInflection: 'Each toll nudges the hidden assignation one step nearer daylight.' }),
        Object.freeze({ speakerRoleId: 'foolish_servant', listenerRoleId: 'procuress', text: 'Wait—was the silk ladder meant for moonrise, or after the watchman snores beneath the loggia?', secularInflection: 'The knotted cord sways across generations without touching stone.' })
      ])
    }),
    Object.freeze({
      id: 'omen_trio', index: 4, number: 5, roman: 'V',
      title: 'Rosary, Astrolabe & Whispered Fan',
      roles: Object.freeze(['hypocrite', 'astrologer', 'confidante']),
      anchor: Object.freeze({ rx: 0.31, ry: 0.49 }),
      exchanges: Object.freeze([
        Object.freeze({ speakerRoleId: 'hypocrite', listenerRoleId: 'astrologer', text: 'Heaven forbid I judge my neighbor’s revels, though I counted every masked litter slipping past the vestry.', secularInflection: 'Amber beads click onward, cataloging a new generation of faults.' }),
        Object.freeze({ speakerRoleId: 'astrologer', listenerRoleId: 'confidante', text: 'Saturn grazes the seventh house of covenants—when the brass ring aligns, buried pledges surface at noon.', secularInflection: 'Equinoctial precession inches the brass pointer toward conjunction.' }),
        Object.freeze({ speakerRoleId: 'confidante', listenerRoleId: 'hypocrite', text: 'Behind my pleated fan I heard both oaths: neither bride nor creditor guesses whose signet was pawned.', secularInflection: 'The pillar’s whisper ties threads whose first speakers lie under cypresses.' }),
        Object.freeze({ speakerRoleId: 'astrologer', listenerRoleId: 'hypocrite', text: 'Your rosary races my alidade, good brother, yet the slow eclipse spares neither pulpit nor balcony.', secularInflection: 'The star-chart registers a fractional tilt in the square’s alliances.' }),
        Object.freeze({ speakerRoleId: 'confidante', listenerRoleId: 'astrologer', text: 'Keep the aspect hushed till vespers—half the piazza still thinks last winter’s scandal was chance.', secularInflection: 'Centuries of rumor condense slowly toward an unspoken disclosure.' })
      ])
    }),
    Object.freeze({
      id: 'exile_ledger', index: 5, number: 6, roman: 'VI',
      title: 'The Scales & the Fallen Coronets',
      roles: Object.freeze(['usurer', 'fallen_princes']),
      anchor: Object.freeze({ rx: 0.70, ry: 0.49 }),
      exchanges: Object.freeze([
        Object.freeze({ speakerRoleId: 'usurer', listenerRoleId: 'fallen_princes', text: 'Lay the tarnished coronet upon the left pan; verdigris deducts three carats from your duchy’s memory.', secularInflection: 'Compound interest outlasts the principality whose crest guaranteed it.' }),
        Object.freeze({ speakerRoleId: 'fallen_princes', listenerRoleId: 'usurer', text: 'A hundred thousand of us line the colonnade, pledging threadbare ermine for one more dusk in the square!', secularInflection: 'Disinherited cousins swell the rank without breaking the hexameter.' }),
        Object.freeze({ speakerRoleId: 'usurer', listenerRoleId: 'fallen_princes', text: 'Pedigree weighs nothing on brass—countersign the margin where ninety-nine thousand kinsmen set their mark.', secularInflection: 'Folio after folio fills while the balance needle trembles by a hair.' }),
        Object.freeze({ speakerRoleId: 'fallen_princes', listenerRoleId: 'usurer', text: 'Weigh carefully, keeper of scales: our mortgaged charters predate the quarry that built your vault.', secularInflection: 'A hundred thousand voices converge imperceptibly upon a final reckoning.' }),
        Object.freeze({ speakerRoleId: 'usurer', listenerRoleId: 'fallen_princes', text: 'Next prince to the desk! Renew the bond at six percent, or yield the signet collar before candle-end.', secularInflection: 'A fresh taper replaces the stub and lights the same open column.' })
      ])
    })
  ]);

  const KNOT_BY_ID = Object.freeze(
    DIALOGUE_KNOTS.reduce(function (acc, knot) {
      acc[knot.id] = knot;
      return acc;
    }, {})
  );

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || '#F2EAD9').replace('#', '');
    const n = parseInt(clean, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return 'rgba(' + r + ',' + g + ',' + b + ',' + clamp(alpha, 0, 1).toFixed(3) + ')';
  }

  function quadPoint(x0, y0, cx, cy, x1, y1, t) {
    const mt = 1 - t;
    return {
      x: mt * mt * x0 + 2 * mt * t * cx + t * t * x1,
      y: mt * mt * y0 + 2 * mt * t * cy + t * t * y1
    };
  }

  function createVoiceSynth() {
    let audioCtx = null;

    function unlock() {
      try {
        if (!audioCtx) {
          const Ctor = root.AudioContext || root.webkitAudioContext;
          if (!Ctor) return false;
          audioCtx = new Ctor();
        }
        if (audioCtx && audioCtx.state === 'suspended' && typeof audioCtx.resume === 'function') {
          const p = audioCtx.resume();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        }
        return Boolean(audioCtx);
      } catch (_) {
        return false;
      }
    }

    function voiceGrain(freq, formantHz, waveType, startAt, dur, peakGain, detuneCents, glideToFreq) {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const formant = audioCtx.createBiquadFilter();
        const warmth = audioCtx.createBiquadFilter();
        const env = audioCtx.createGain();
        osc.type = waveType || 'triangle';
        osc.frequency.setValueAtTime(Math.max(55, freq), startAt);
        if (glideToFreq && glideToFreq > 40) {
          osc.frequency.exponentialRampToValueAtTime(glideToFreq, startAt + dur * 0.88);
        }
        if (detuneCents) osc.detune.setValueAtTime(detuneCents, startAt);

        formant.type = 'peaking';
        formant.frequency.setValueAtTime(clamp(formantHz || 900, 280, 3200), startAt);
        formant.Q.setValueAtTime(3.4, startAt);
        formant.gain.setValueAtTime(7.5, startAt);

        warmth.type = 'lowpass';
        warmth.frequency.setValueAtTime(clamp((formantHz || 900) * 1.85, 900, 4200), startAt);

        env.gain.setValueAtTime(0.0001, startAt);
        env.gain.linearRampToValueAtTime(peakGain, startAt + Math.min(0.028, dur * 0.25));
        env.gain.exponentialRampToValueAtTime(0.0001, startAt + dur);

        osc.connect(formant);
        formant.connect(warmth);
        warmth.connect(env);
        env.connect(audioCtx.destination);
        osc.start(startAt);
        osc.stop(startAt + dur + 0.015);
      } catch (_) {}
    }

    function speakRole(arch, mode, chorusSize, muted) {
      if (muted || !audioCtx || !arch) return false;
      const now = audioCtx.currentTime + 0.005;
      const f0 = arch.baseFreqHz || 220;
      const fm = arch.formantHz || 1000;
      const wt = arch.waveType || 'triangle';

      if (mode === 'chorus') {
        const count = clamp(chorusSize || 4, 2, 6);
        for (let i = 0; i < count; i++) {
          const ratio = (i % 3 === 2) ? 1.498 : 1.0;
          const detune = ((i / Math.max(1, count - 1)) - 0.5) * 38;
          voiceGrain(f0 * ratio, fm, wt, now + i * 0.016, 0.26, 0.036 / Math.sqrt(count * 0.6), detune, f0 * ratio * 1.02);
        }
        return true;
      }
      if (mode === 'concentrated_survivor') {
        voiceGrain(f0, fm, wt, now, 0.11, 0.042, -5, f0 * 1.03);
        voiceGrain(f0 * 1.98, fm * 1.32, 'sine', now + 0.105, 0.11, 0.038, 6, f0 * 1.88);
        voiceGrain(f0 * 1.498, fm * 1.12, wt, now + 0.21, 0.12, 0.035, 0, f0);
        return true;
      }
      voiceGrain(f0, fm, wt, now, 0.22, 0.042, 0, f0 * 1.025);
      if (arch.id === 'fallen_princes') {
        voiceGrain(f0 * 1.498, fm * 1.15, 'triangle', now + 0.018, 0.25, 0.030, 9, f0 * 1.498);
        voiceGrain(f0 * 0.5, fm * 0.75, 'sine', now, 0.26, 0.028, -7, f0 * 0.5);
      }
      return true;
    }

    function chimeTransition(kind, arch, muted) {
      if (muted || !audioCtx) return false;
      const now = audioCtx.currentTime + 0.005;
      const base = (arch && arch.baseFreqHz) ? arch.baseFreqHz : 196;
      const k = String(kind || 'cascade');
      if (k === 'death' || k === 'return_after_years' || k === 'strike') {
        voiceGrain(110.0, 520, 'sine', now, 0.48, 0.046, 0, 108.5);
        voiceGrain(261.6, 780, 'triangle', now + 0.01, 0.36, 0.024, 4, 258.0);
        voiceGrain(base, 980, 'triangle', now + 0.09, 0.24, 0.030, 0, base * 1.25);
        voiceGrain(587.3, 1760, 'sine', now + 0.17, 0.22, 0.032, 0, 784.0);
      } else if (k === 'chorus' || k === 'chorus_split') {
        [1.0, 1.25, 1.498, 2.0].forEach(function (r, idx) {
          voiceGrain(base * r, 1280, 'triangle', now + idx * 0.025, 0.30, 0.028, (idx - 1.5) * 9, base * r);
        });
      } else if (k === 'concentration') {
        voiceGrain(base * 2.0, 1500, 'sine', now, 0.30, 0.036, 12, base);
        voiceGrain(base * 1.5, 1150, 'triangle', now + 0.02, 0.30, 0.034, -12, base);
      } else {
        voiceGrain(440.0, 1520, 'sine', now, 0.18, 0.030, 0, 659.25);
      }
      return true;
    }

    return { unlock: unlock, speakRole: speakRole, chimeTransition: chimeTransition, hasContext: function () { return Boolean(audioCtx); } };
  }

  function computeLayout(rawW, rawH) {
    const w = Math.max(260, Number(rawW) || 800);
    const h = Math.max(200, Number(rawH) || 520);
    const unit = Math.min(w, h);
    const vx = w * 0.5;
    const vy = h * 0.27;
    const horizonY = h * 0.35;
    const apronY = h * 0.93;
    const trapTopHalfW = w * 0.33;
    const trapBotHalfW = w * 0.48;

    const necropolisLeft = { x: w * 0.14, y: h * 0.21 };
    const necropolisRight = { x: w * 0.86, y: h * 0.21 };
    const porticoLeft = { x: w * 0.065, y: h * 0.57 };
    const porticoRight = { x: w * 0.935, y: h * 0.57 };

    const knots = [];
    const knotById = {};
    const actors = [];
    const actorById = {};

    for (let k = 0; k < DIALOGUE_KNOTS.length; k++) {
      const kd = DIALOGUE_KNOTS[k];
      const cx = w * kd.anchor.rx;
      const cy = h * kd.anchor.ry;
      const depthT = clamp((cy - horizonY) / Math.max(1, apronY - horizonY), 0, 1);
      const pScale = lerp(0.76, 1.08, depthT) * clamp(unit / 480, 0.56, 1.24);
      const spreadX = clamp(w * (kd.roles.length === 3 ? 0.068 : 0.052), 18, 62);
      const knotZone = { id: kd.id, index: kd.index, roman: kd.roman, title: kd.title, cx: cx, cy: cy, rx: spreadX * 1.48, ry: Math.max(16, 22 * pScale), scale: pScale, roles: kd.roles };
      knots.push(knotZone);
      knotById[kd.id] = knotZone;

      for (let r = 0; r < kd.roles.length; r++) {
        const roleId = kd.roles[r];
        const arch = ARCHETYPE_BY_ID[roleId];
        let ax = cx;
        let ay = cy;
        let facing = 1;
        if (kd.roles.length === 2) {
          ax = cx + (r === 0 ? -spreadX : spreadX);
          facing = r === 0 ? 1 : -1;
        } else {
          ax = cx + (r === 0 ? -spreadX : (r === 1 ? 0 : spreadX));
          ay = cy + (r === 1 ? -12 * pScale : 4 * pScale);
          facing = r === 0 ? 1 : (r === 2 ? -1 : 0);
        }
        const actor = {
          roleId: roleId, knotId: kd.id, knotIndex: kd.index, arch: arch,
          x: ax, y: ay, headY: ay - 26 * pScale, scale: pScale, facing: facing,
          hitRadius: Math.max(17, 24 * pScale)
        };
        actors.push(actor);
        actorById[roleId] = actor;
      }
    }

    return {
      w: w, h: h, unit: unit, vx: vx, vy: vy, horizonY: horizonY, apronY: apronY,
      trapTopHalfW: trapTopHalfW, trapBotHalfW: trapBotHalfW,
      necropolisLeft: necropolisLeft, necropolisRight: necropolisRight,
      porticoLeft: porticoLeft, porticoRight: porticoRight,
      knots: knots, knotById: knotById, actors: actors, actorById: actorById
    };
  }

  function renderBackdropAndNecropolis(ctx, layout, cascadeState) {
    const w = layout.w;
    const h = layout.h;
    const hy = layout.horizonY;
    const sky = ctx.createLinearGradient(0, 0, 0, hy);
    sky.addColorStop(0, PALETTE.cypress_obsidian);
    sky.addColorStop(0.55, PALETTE.cypress_verdigris);
    sky.addColorStop(1, '#3D3526');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, hy + 4);

    const glow = ctx.createRadialGradient(layout.vx, layout.vy, 6, layout.vx, layout.vy, w * 0.34);
    glow.addColorStop(0, hexToRgba(PALETTE.gilded_ochre, 0.34));
    glow.addColorStop(0.55, hexToRgba(PALETTE.proscenium_ochre, 0.12));
    glow.addColorStop(1, 'rgba(13,17,20,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, hy + 10);

    const tombsCount = (cascadeState && Array.isArray(cascadeState.necropolisTombs))
      ? cascadeState.necropolisTombs.length
      : ((cascadeState && cascadeState.deathsCount) || 0);

    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 6; i++) {
        const tx = layout.vx + side * (w * (0.14 + i * 0.056));
        const baseH = h * (0.14 + (i % 3) * 0.032);
        const cyTop = hy - baseH;
        ctx.fillStyle = (i % 2 === 0) ? PALETTE.cypress_obsidian : '#162822';
        ctx.beginPath();
        ctx.moveTo(tx, cyTop);
        ctx.quadraticCurveTo(tx + 8, hy - baseH * 0.45, tx + 6, hy);
        ctx.lineTo(tx - 6, hy);
        ctx.quadraticCurveTo(tx - 8, hy - baseH * 0.45, tx, cyTop);
        ctx.closePath();
        ctx.fill();

        const sepX = tx + side * 9;
        const sepW = Math.max(8, w * 0.014);
        const sepH = Math.max(12, h * 0.036);
        ctx.fillStyle = hexToRgba(PALETTE.parchment_bone, 0.28);
        ctx.fillRect(sepX - sepW * 0.5, hy - sepH, sepW, sepH);
        if ((i + (side > 0 ? 3 : 0)) < Math.min(12, tombsCount + 2)) {
          ctx.fillStyle = hexToRgba(PALETTE.gilded_ochre, 0.72);
          ctx.beginPath();
          ctx.arc(sepX, hy - sepH * 0.45, 2.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const archW = w * 0.15;
    const archH = h * 0.20;
    ctx.fillStyle = PALETTE.slate_pavement;
    ctx.fillRect(layout.vx - archW * 0.65, hy - archH, archW * 1.3, archH);
    ctx.fillStyle = hexToRgba(PALETTE.gilded_ochre, 0.22);
    ctx.beginPath();
    ctx.arc(layout.vx, hy - archH * 0.36, archW * 0.34, Math.PI, 0);
    ctx.lineTo(layout.vx + archW * 0.34, hy);
    ctx.lineTo(layout.vx - archW * 0.34, hy);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = hexToRgba(PALETTE.proscenium_ochre, 0.55);
    ctx.lineWidth = 1.2;
    for (let k = -2; k <= 2; k++) {
      ctx.beginPath();
      ctx.moveTo(layout.vx, layout.vy + 10);
      ctx.lineTo(layout.vx + k * archW * 0.16, hy);
      ctx.stroke();
    }

    [layout.porticoLeft, layout.porticoRight].forEach(function (pt) {
      const pw = Math.max(18, w * 0.036);
      const ph = Math.max(34, h * 0.095);
      const pg = ctx.createRadialGradient(pt.x, pt.y, 2, pt.x, pt.y, ph * 0.85);
      pg.addColorStop(0, hexToRgba(PALETTE.gilded_ochre, 0.78));
      pg.addColorStop(0.55, hexToRgba(PALETTE.curtain_scarlet, 0.28));
      pg.addColorStop(1, 'rgba(13,17,20,0)');
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, ph * 0.85, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = PALETTE.proscenium_ochre;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y - ph * 0.2, pw * 0.46, Math.PI, 0);
      ctx.lineTo(pt.x + pw * 0.46, pt.y + ph * 0.36);
      ctx.lineTo(pt.x - pw * 0.46, pt.y + ph * 0.36);
      ctx.closePath();
      ctx.stroke();
    });
  }

  function renderCheckeredPiazza(ctx, layout, selectedKnotId) {
    const w = layout.w;
    const h = layout.h;
    const hy = layout.horizonY;
    const ay = layout.apronY;
    ctx.fillStyle = PALETTE.cypress_obsidian;
    ctx.fillRect(0, hy, w, h - hy);

    const rows = 8;
    const cols = 12;
    for (let r = 0; r < rows; r++) {
      const t0 = Math.pow(r / rows, 1.32);
      const t1 = Math.pow((r + 1) / rows, 1.32);
      const y0 = lerp(hy, ay, t0);
      const y1 = lerp(hy, ay, t1);
      const hw0 = lerp(layout.trapTopHalfW, layout.trapBotHalfW, t0);
      const hw1 = lerp(layout.trapTopHalfW, layout.trapBotHalfW, t1);
      for (let c = 0; c < cols; c++) {
        const u0 = (c / cols) * 2 - 1;
        const u1 = ((c + 1) / cols) * 2 - 1;
        ctx.beginPath();
        ctx.moveTo(layout.vx + u0 * hw0, y0);
        ctx.lineTo(layout.vx + u1 * hw0, y0);
        ctx.lineTo(layout.vx + u1 * hw1, y1);
        ctx.lineTo(layout.vx + u0 * hw1, y1);
        ctx.closePath();
        ctx.fillStyle = ((r + c) % 2 === 0)
          ? PALETTE.slate_pavement
          : hexToRgba(PALETTE.parchment_bone, lerp(0.11, 0.22, t1));
        ctx.fill();
      }
    }

    [0.30, 0.44].forEach(function (rxFactor, idx) {
      ctx.save();
      ctx.strokeStyle = hexToRgba(PALETTE.proscenium_ochre, idx === 0 ? 0.34 : 0.22);
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.ellipse(layout.vx, lerp(hy, ay, 0.56), w * rxFactor, (ay - hy) * (idx === 0 ? 0.28 : 0.42), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    for (let i = 0; i < layout.knots.length; i++) {
      const kz = layout.knots[i];
      const sel = kz.id === selectedKnotId;
      ctx.save();
      ctx.fillStyle = sel ? hexToRgba(PALETTE.gilded_ochre, 0.19) : hexToRgba(PALETTE.cypress_obsidian, 0.36);
      ctx.strokeStyle = sel ? PALETTE.gilded_ochre : hexToRgba(PALETTE.proscenium_ochre, 0.42);
      ctx.lineWidth = sel ? 2.0 : 1.1;
      ctx.beginPath();
      ctx.ellipse(kz.cx, kz.cy + 4 * kz.scale, kz.rx, kz.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = sel ? PALETTE.mask_ivory : hexToRgba(PALETTE.parchment_bone, 0.78);
      ctx.font = '600 ' + Math.round(clamp(10 * kz.scale, 8, 12)) + 'px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(kz.roman, kz.cx, kz.cy + kz.ry + Math.max(9, 10 * kz.scale));
      ctx.restore();
    }
  }

  function renderArchetypeProp(ctx, propKind, x, y, s, facing) {
    const dir = facing === 0 ? 1 : facing;
    const px = x + dir * 11 * s;
    const py = y - 15 * s;
    ctx.save();
    ctx.strokeStyle = PALETTE.gilded_ochre;
    ctx.fillStyle = PALETTE.mask_ivory;
    ctx.lineWidth = Math.max(1.2, 1.5 * s);
    if (propKind === 'sword') {
      ctx.beginPath(); ctx.moveTo(px, py + 4 * s); ctx.lineTo(px + dir * 8 * s, py - 16 * s); ctx.stroke();
    } else if (propKind === 'trencher') {
      ctx.beginPath(); ctx.ellipse(px + dir * 3 * s, py, 6 * s, 2.3 * s, 0, 0, Math.PI * 2); ctx.stroke();
    } else if (propKind === 'dice') {
      ctx.strokeRect(px - 3 * s, py - 3 * s, 6 * s, 6 * s);
    } else if (propKind === 'mirror') {
      ctx.fillStyle = PALETTE.curtain_scarlet;
      ctx.beginPath(); ctx.ellipse(px + dir * 2 * s, py - 3 * s, 3.6 * s, 5 * s, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    } else if (propKind === 'strongbox') {
      ctx.fillStyle = PALETTE.proscenium_ochre;
      ctx.fillRect(px - 5 * s, py - 2 * s, 9 * s, 6.5 * s); ctx.strokeRect(px - 5 * s, py - 2 * s, 9 * s, 6.5 * s);
    } else if (propKind === 'rose') {
      ctx.fillStyle = PALETTE.curtain_scarlet;
      ctx.beginPath(); ctx.arc(px + dir * 2 * s, py - 2 * s, 3.2 * s, 0, Math.PI * 2); ctx.fill();
    } else if (propKind === 'billet') {
      ctx.fillRect(px - 3 * s, py - 4 * s, 6.5 * s, 5 * s);
    } else if (propKind === 'keys' || propKind === 'astrolabe') {
      ctx.beginPath(); ctx.arc(px + dir * 2 * s, py, 4.4 * s, 0, Math.PI * 2); ctx.stroke();
    } else if (propKind === 'rosary') {
      ctx.beginPath(); ctx.moveTo(px, py - 3 * s); ctx.lineTo(px, py + 7 * s); ctx.stroke();
    } else if (propKind === 'fan') {
      ctx.beginPath(); ctx.moveTo(px, py + 2 * s); ctx.arc(px, py + 2 * s, 6 * s, -Math.PI * 0.85, -Math.PI * 0.15); ctx.closePath(); ctx.fill();
    } else if (propKind === 'scales') {
      ctx.beginPath(); ctx.moveTo(px - 6 * s, py - 3 * s); ctx.lineTo(px + 6 * s, py - 3 * s); ctx.stroke();
    } else if (propKind === 'coronet') {
      ctx.fillStyle = PALETTE.gilded_ochre;
      ctx.beginPath(); ctx.moveTo(x - 5 * s, y - 31 * s); ctx.lineTo(x - 3 * s, y - 36 * s); ctx.lineTo(x, y - 32 * s); ctx.lineTo(x + 3 * s, y - 36 * s); ctx.lineTo(x + 5 * s, y - 31 * s); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
  }

  function renderActorsTrailsAndProscenium(ctx, layout, state, cascadeState, utterances, uiOpts) {
    const rolesMap = (cascadeState && cascadeState.roles) || {};
    const speakerSet = {};
    for (let u = 0; u < utterances.length; u++) {
      speakerSet[utterances[u].speakerRoleId] = utterances[u];
    }

    const sortedActors = layout.actors.slice().sort(function (a, b) { return a.y - b.y; });
    for (let i = 0; i < sortedActors.length; i++) {
      const ac = sortedActors[i];
      const rs = rolesMap[ac.roleId] || {};
      const mode = rs.mode || 'single';
      const chorusSize = Math.max(1, Number(rs.chorusSize) || 1);
      const s = ac.scale;
      const isSelectedRole = ac.roleId === state.selectedRoleId;
      const isSpeaking = Boolean(speakerSet[ac.roleId]);

      if (ac.roleId === 'fallen_princes') {
        for (let p = 4; p >= 1; p--) {
          const gx = ac.x + p * 6.5 * s;
          const gy = ac.y - p * 4.8 * s;
          ctx.fillStyle = hexToRgba(PALETTE.velvet_crimson, 0.24 - p * 0.035);
          ctx.beginPath();
          ctx.arc(gx, gy - 16 * s, 5.5 * s, Math.PI, 0);
          ctx.lineTo(gx + 6 * s, gy);
          ctx.lineTo(gx - 6 * s, gy);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = hexToRgba(PALETTE.gilded_ochre, 0.45);
          ctx.fillRect(gx - 3.5 * s, gy - 23 * s, 7 * s, 2.2 * s);
        }
      }

      if (mode === 'chorus' && chorusSize > 1) {
        const copies = clamp(chorusSize, 2, 6);
        for (let c = copies - 1; c >= 1; c--) {
          const ang = ((c / copies) - 0.5) * 1.6;
          const ox = Math.sin(ang) * 14 * s;
          const oy = -Math.abs(Math.cos(ang)) * 7 * s;
          ctx.fillStyle = hexToRgba(ac.arch.costumeColor, 0.52);
          ctx.beginPath();
          ctx.moveTo(ac.x + ox - 7 * s, ac.y + oy);
          ctx.quadraticCurveTo(ac.x + ox, ac.y + oy - 24 * s, ac.x + ox + 7 * s, ac.y + oy);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = hexToRgba(PALETTE.mask_ivory, 0.78);
          ctx.beginPath();
          ctx.arc(ac.x + ox, ac.headY + oy + 2 * s, 3.8 * s, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (mode === 'concentrated_survivor') {
        ctx.save();
        ctx.strokeStyle = PALETTE.gilded_ochre;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(ac.x, ac.headY, 13 * s, 0, Math.PI * 2);
        ctx.stroke();
        [-1, 1].forEach(function (side) {
          ctx.fillStyle = side < 0 ? PALETTE.mask_ivory : PALETTE.gilded_ochre;
          ctx.beginPath();
          ctx.ellipse(ac.x + side * 11 * s, ac.headY - 3 * s, 3.4 * s, 4.5 * s, side * 0.25, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      if (isSpeaking || isSelectedRole) {
        ctx.save();
        ctx.strokeStyle = isSelectedRole ? PALETTE.mask_ivory : PALETTE.gilded_ochre;
        ctx.lineWidth = isSelectedRole ? 2.1 : 1.3;
        ctx.beginPath();
        ctx.ellipse(ac.x, ac.y + 1.5 * s, 12 * s, 4.6 * s, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = ac.arch.costumeColor;
      ctx.strokeStyle = PALETTE.cypress_obsidian;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(ac.x - 9.5 * s, ac.y);
      ctx.quadraticCurveTo(ac.x - 7 * s, ac.y - 21 * s, ac.x, ac.y - 23 * s);
      ctx.quadraticCurveTo(ac.x + 7 * s, ac.y - 21 * s, ac.x + 9.5 * s, ac.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = PALETTE.mask_ivory;
      ctx.beginPath();
      ctx.ellipse(ac.x, ac.headY, 4.8 * s, 6.0 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = PALETTE.cypress_obsidian;
      ctx.fillRect(ac.x - 2.6 * s, ac.headY - 1.4 * s, 1.8 * s, 1.2 * s);
      ctx.fillRect(ac.x + 0.8 * s, ac.headY - 1.4 * s, 1.8 * s, 1.2 * s);
      ctx.fillRect(ac.x - 1.6 * s, ac.headY + 2.0 * s, 3.2 * s, 1.1 * s);

      renderArchetypeProp(ctx, ac.arch.propKind, ac.x, ac.y, s, ac.facing);

      if (mode === 'chorus' && chorusSize > 1) {
        ctx.fillStyle = PALETTE.gilded_ochre;
        ctx.font = '700 ' + Math.round(clamp(9 * s, 8, 11)) + 'px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('x' + chorusSize, ac.x, ac.headY - 9 * s);
      } else if (ac.roleId === 'fallen_princes') {
        ctx.fillStyle = PALETTE.parchment_bone;
        ctx.font = '600 ' + Math.round(clamp(8.5 * s, 7, 10)) + 'px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('100k', ac.x + 12 * s, ac.headY - 9 * s);
      }
    }

    for (let u = 0; u < utterances.length; u++) {
      const utt = utterances[u];
      const sp = layout.actorById[utt.speakerRoleId];
      const ls = layout.actorById[utt.listenerRoleId];
      if (!sp || !ls) continue;
      const isFocus = utt.knotId === state.selectedKnotId;
      const pProg = state.reducedMotion ? 0.5 : state.beatProgress;
      const mx = (sp.x + ls.x) * 0.5;
      const my = Math.min(sp.headY, ls.headY) - (utt.isAntiphonalSelfDialogue ? 26 : 18) * sp.scale;

      ctx.save();
      ctx.strokeStyle = isFocus ? PALETTE.gilded_ochre : hexToRgba(PALETTE.mask_ivory, 0.46);
      ctx.lineWidth = isFocus ? 2.1 : 1.2;
      ctx.beginPath();
      ctx.moveTo(sp.x, sp.headY - 4 * sp.scale);
      ctx.quadraticCurveTo(mx, my, ls.x, ls.headY - 4 * ls.scale);
      ctx.stroke();

      const orb = quadPoint(sp.x, sp.headY - 4 * sp.scale, mx, my, ls.x, ls.headY - 4 * ls.scale, pProg);
      ctx.fillStyle = isFocus ? PALETTE.mask_ivory : PALETTE.gilded_ochre;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, isFocus ? 3.3 : 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const trails = (cascadeState && Array.isArray(cascadeState.activeTrails)) ? cascadeState.activeTrails : [];
    for (let t = 0; t < trails.length; t++) {
      const tr = trails[t] || {};
      const kind = String(tr.type || tr.kind || 'cascade_shift');
      const prog = state.reducedMotion ? 0.55 : clamp(Number(tr.progress != null ? tr.progress : tr.t) || 0.5, 0.04, 0.98);
      const targetId = tr.roleId || tr.toRoleId || tr.targetRoleId;
      const sourceId = tr.fromRoleId || tr.sourceRoleId || targetId;
      const dstActor = layout.actorById[targetId] || layout.actors[0];
      const srcActor = layout.actorById[sourceId] || dstActor;
      let x0 = srcActor.x, y0 = srcActor.headY, x1 = dstActor.x, y1 = dstActor.headY;
      let stroke = PALETTE.gilded_ochre;
      if (kind.indexOf('death') >= 0) {
        const nec = srcActor.x < layout.vx ? layout.necropolisLeft : layout.necropolisRight;
        x0 = dstActor.x; y0 = dstActor.headY; x1 = nec.x; y1 = nec.y;
        stroke = PALETTE.parchment_bone;
      } else if (kind.indexOf('birth') >= 0) {
        const por = dstActor.x < layout.vx ? layout.porticoLeft : layout.porticoRight;
        x0 = por.x; y0 = por.y; x1 = dstActor.x; y1 = dstActor.headY;
        stroke = PALETTE.curtain_scarlet;
      }
      const cx = (x0 + x1) * 0.5;
      const cy = Math.min(y0, y1) - 34;
      const headPt = quadPoint(x0, y0, cx, cy, x1, y1, prog);
      ctx.save();
      ctx.strokeStyle = hexToRgba(stroke, 1 - prog * 0.45);
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(cx, cy, x1, y1);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = stroke;
      ctx.beginPath();
      ctx.arc(headPt.x, headPt.y, 4.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const colW = Math.max(12, layout.w * 0.028);
    ctx.fillStyle = PALETTE.cypress_obsidian;
    ctx.fillRect(0, 0, colW, layout.h);
    ctx.fillRect(layout.w - colW, 0, colW, layout.h);
    ctx.fillRect(0, 0, layout.w, Math.max(10, layout.h * 0.032));
    ctx.strokeStyle = hexToRgba(PALETTE.proscenium_ochre, 0.65);
    ctx.lineWidth = 1.4;
    ctx.strokeRect(colW, Math.max(10, layout.h * 0.032), layout.w - colW * 2, layout.h - Math.max(12, layout.h * 0.04));

    ctx.fillStyle = PALETTE.velvet_crimson;
    [-1, 1].forEach(function (side) {
      const sx = side < 0 ? colW : layout.w - colW;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx - side * layout.w * 0.14, 0);
      ctx.quadraticCurveTo(sx - side * layout.w * 0.07, layout.h * 0.11, sx, layout.h * 0.15);
      ctx.closePath();
      ctx.fill();
    });

    const selActor = layout.actorById[state.selectedRoleId];
    if (selActor && (!uiOpts || uiOpts.showSelectedLabel !== false)) {
      const rs = rolesMap[selActor.roleId] || {};
      const label = selActor.arch.shortTitle + ' · ' + (rs.mortalName || selActor.arch.defaultMortal);
      ctx.save();
      ctx.font = '600 11px Georgia, serif';
      const tw = Math.min(layout.w - 36, ctx.measureText(label).width + 14);
      const lx = clamp(selActor.x, tw * 0.5 + colW + 4, layout.w - tw * 0.5 - colW - 4);
      const ly = Math.max(24, selActor.headY - 22 * selActor.scale);
      ctx.fillStyle = hexToRgba(PALETTE.cypress_obsidian, 0.88);
      ctx.strokeStyle = PALETTE.proscenium_ochre;
      ctx.lineWidth = 1;
      ctx.fillRect(lx - tw * 0.5, ly - 13, tw, 17);
      ctx.strokeRect(lx - tw * 0.5, ly - 13, tw, 17);
      ctx.fillStyle = PALETTE.mask_ivory;
      ctx.textAlign = 'center';
      ctx.fillText(label, lx, ly - 1);
      ctx.restore();
    }
  }

  function resolveKnot(knotIndexOrId, fallbackId) {
    if (typeof knotIndexOrId === 'string') {
      if (KNOT_BY_ID[knotIndexOrId]) return KNOT_BY_ID[knotIndexOrId];
      for (let i = 0; i < DIALOGUE_KNOTS.length; i++) {
        if (DIALOGUE_KNOTS[i].roman === knotIndexOrId) return DIALOGUE_KNOTS[i];
      }
      const parsed = parseInt(knotIndexOrId, 10);
      if (!isNaN(parsed)) knotIndexOrId = parsed;
    }
    if (typeof knotIndexOrId === 'number' && !isNaN(knotIndexOrId)) {
      const idx = knotIndexOrId === 6 ? 5 : clamp(Math.floor(knotIndexOrId), 0, DIALOGUE_KNOTS.length - 1);
      return DIALOGUE_KNOTS[idx];
    }
    return KNOT_BY_ID[fallbackId] || DIALOGUE_KNOTS[0];
  }

  function resolveRole(roleId, fallbackRoleId) {
    if (typeof roleId === 'number' && !isNaN(roleId)) {
      return ARCHETYPE_CATALOG[clamp(Math.floor(roleId), 0, ARCHETYPE_CATALOG.length - 1)];
    }
    if (typeof roleId === 'string' && ARCHETYPE_BY_ID[roleId]) {
      return ARCHETYPE_BY_ID[roleId];
    }
    return ARCHETYPE_BY_ID[fallbackRoleId] || ARCHETYPE_CATALOG[0];
  }

  function createSquareDialogues(opts) {
    const cfg = opts || {};
    const synth = createVoiceSynth();
    const beatDurationSec = Math.max(1.2, Number(cfg.beatDurationSec) || 3.4);

    const state = {
      width: Math.max(260, Number(cfg.width) || 820),
      height: Math.max(200, Number(cfg.height) || 520),
      selectedKnotId: KNOT_ORDER[0],
      selectedRoleId: ROLE_ORDER[0],
      beatCount: 1,
      beatProgress: 0.34,
      elapsedSec: 0,
      muted: Boolean(cfg.muted),
      audioUnlocked: false,
      reducedMotion: Boolean(cfg.reducedMotion),
      lastCascadeState: cfg.cascadeState || null
    };

    let cachedLayout = computeLayout(state.width, state.height);

    function setViewport(w, h) {
      state.width = Math.max(260, Number(w) || state.width);
      state.height = Math.max(200, Number(h) || state.height);
      cachedLayout = computeLayout(state.width, state.height);
      return { width: state.width, height: state.height };
    }

    function selectKnot(knotIndexOrId) {
      const knot = resolveKnot(knotIndexOrId, state.selectedKnotId);
      state.selectedKnotId = knot.id;
      if (knot.roles.indexOf(state.selectedRoleId) < 0) {
        state.selectedRoleId = knot.roles[0];
      }
      return knot;
    }

    function selectRole(roleId) {
      const arch = resolveRole(roleId, state.selectedRoleId);
      state.selectedRoleId = arch.id;
      state.selectedKnotId = arch.knotId;
      return arch;
    }

    function getActiveUtterance(knotId, cascadeState) {
      const cs = cascadeState || state.lastCascadeState;
      const knot = resolveKnot(knotId || state.selectedKnotId, state.selectedKnotId);
      const exIdx = (state.beatCount + knot.index) % knot.exchanges.length;
      const ex = knot.exchanges[exIdx];
      const spArch = ARCHETYPE_BY_ID[ex.speakerRoleId];
      const lsArch = ARCHETYPE_BY_ID[ex.listenerRoleId];
      const spRole = (cs && cs.roles && cs.roles[ex.speakerRoleId]) || null;
      const lsRole = (cs && cs.roles && cs.roles[ex.listenerRoleId]) || null;

      const spMode = (spRole && spRole.mode) || 'single';
      const lsMode = (lsRole && lsRole.mode) || 'single';
      const chorusSize = spMode === 'chorus' ? Math.max(2, Number(spRole && spRole.chorusSize) || 4) : 1;
      const mortalName = (spRole && spRole.mortalName) || spArch.defaultMortal;
      const listenerMortal = (lsRole && lsRole.mortalName) || lsArch.defaultMortal;
      const isAntiphonal = spMode === 'concentrated_survivor' || lsMode === 'concentrated_survivor';
      const fallenNominal = (cs && cs.fallenPrincesNominal) || 100000;
      const denouementProgress = (cs && typeof cs.denouementProgress === 'number') ? cs.denouementProgress : 0.012;

      let speakerDisplay = mortalName;
      let modeBadge = 'Single Mask';
      if (spMode === 'chorus') {
        speakerDisplay = 'Chorus of ' + chorusSize + ' (' + mortalName + ')';
        modeBadge = 'Chorus x' + chorusSize;
      } else if (isAntiphonal) {
        const soloName = spMode === 'concentrated_survivor' ? mortalName : listenerMortal;
        speakerDisplay = soloName + ' (Solitary Survivor)';
        modeBadge = '1 Survivor (Dual Mask)';
      } else if (ex.speakerRoleId === 'fallen_princes') {
        speakerDisplay = mortalName + ' (' + fallenNominal.toLocaleString() + ')';
        modeBadge = 'Choral Exiles';
      }

      return {
        knotId: knot.id,
        knotIndex: knot.index,
        knotNumber: knot.number,
        knotRoman: knot.roman,
        knotTitle: knot.title,
        beatNumber: state.beatCount,
        beatProgress: state.beatProgress,
        droppedBeats: 0,
        exchangeIndex: exIdx,
        speakerRoleId: ex.speakerRoleId,
        speakerTitle: spArch.title,
        speakerShortTitle: spArch.shortTitle,
        speakerMortalName: mortalName,
        speakerDisplay: speakerDisplay,
        speakerMode: spMode,
        chorusSize: chorusSize,
        chorusNames: (spRole && spRole.chorusNames) || [],
        speakerGeneration: (spRole && spRole.generation) || 1,
        previousRole: (spRole && spRole.previousRole) || null,
        listenerRoleId: ex.listenerRoleId,
        listenerTitle: lsArch.title,
        listenerShortTitle: lsArch.shortTitle,
        listenerMortalName: listenerMortal,
        modeBadge: modeBadge,
        isAntiphonalSelfDialogue: isAntiphonal,
        nominalCount: ex.speakerRoleId === 'fallen_princes' ? fallenNominal : spArch.nominalCount,
        text: ex.text,
        secularInflection: ex.secularInflection,
        denouementProgress: denouementProgress
      };
    }

    function getAllLiveUtterances(cascadeState) {
      const cs = cascadeState || state.lastCascadeState;
      return DIALOGUE_KNOTS.map(function (k) {
        return getActiveUtterance(k.id, cs);
      });
    }

    function syncCascade(cascadeState) {
      if (cascadeState) state.lastCascadeState = cascadeState;
      return getState();
    }

    function triggerVoiceExchange(knotId, cascadeState) {
      const utt = getActiveUtterance(knotId || state.selectedKnotId, cascadeState);
      const arch = ARCHETYPE_BY_ID[utt.speakerRoleId];
      const synthMode = utt.isAntiphonalSelfDialogue ? 'concentrated_survivor' : utt.speakerMode;
      return synth.speakRole(arch, synthMode, utt.chorusSize, state.muted);
    }

    function triggerTransitionChime(kind, roleId) {
      const arch = resolveRole(roleId || state.selectedRoleId, state.selectedRoleId);
      return synth.chimeTransition(kind, arch, state.muted);
    }

    function step(dtSec, cascadeState) {
      if (cascadeState) state.lastCascadeState = cascadeState;
      const dt = clamp(Number(dtSec) || 0, 0, 120);
      state.elapsedSec += dt;
      const nextProg = state.beatProgress + dt / beatDurationSec;
      if (nextProg >= 1) {
        const gained = Math.floor(nextProg);
        state.beatCount += gained;
        state.beatProgress = nextProg - gained;
        if (state.audioUnlocked && !state.muted) {
          triggerVoiceExchange(state.selectedKnotId, state.lastCascadeState);
        }
      } else {
        state.beatProgress = nextProg;
      }
      return getState();
    }

    function render(ctx, w, h, cascadeState, uiOpts) {
      if (!ctx) return;
      if (cascadeState) state.lastCascadeState = cascadeState;
      const rw = Math.max(260, Number(w) || state.width);
      const rh = Math.max(200, Number(h) || state.height);
      if (rw !== cachedLayout.w || rh !== cachedLayout.h) {
        state.width = rw;
        state.height = rh;
        cachedLayout = computeLayout(rw, rh);
      }
      const utterances = getAllLiveUtterances(state.lastCascadeState);
      renderBackdropAndNecropolis(ctx, cachedLayout, state.lastCascadeState);
      renderCheckeredPiazza(ctx, cachedLayout, state.selectedKnotId);
      renderActorsTrailsAndProscenium(ctx, cachedLayout, state, state.lastCascadeState, utterances, uiOpts);
    }

    function hitTest(x, y, w, h) {
      const lay = (w && h && (w !== cachedLayout.w || h !== cachedLayout.h)) ? computeLayout(w, h) : cachedLayout;
      let bestActor = null;
      let bestDist = Infinity;
      for (let i = 0; i < lay.actors.length; i++) {
        const ac = lay.actors[i];
        const cy = (ac.y + ac.headY) * 0.5;
        const d = Math.hypot(x - ac.x, y - cy);
        if (d <= ac.hitRadius * 1.15 && d < bestDist) {
          bestDist = d;
          bestActor = ac;
        }
      }
      if (bestActor) {
        return { type: 'role', roleId: bestActor.roleId, knotId: bestActor.knotId, knotIndex: bestActor.knotIndex, title: bestActor.arch.title };
      }
      for (let k = 0; k < lay.knots.length; k++) {
        const kz = lay.knots[k];
        const nx = (x - kz.cx) / Math.max(1, kz.rx * 1.15);
        const ny = (y - kz.cy) / Math.max(1, kz.ry * 1.65);
        if (nx * nx + ny * ny <= 1.0) {
          return { type: 'knot', knotId: kz.id, knotIndex: kz.index, roleId: kz.roles[0], title: kz.title };
        }
      }
      return null;
    }

    function unlockAudio() {
      state.audioUnlocked = synth.unlock();
      return state.audioUnlocked;
    }

    function setMuted(flag) {
      state.muted = Boolean(flag);
      if (!state.muted) unlockAudio();
      return state.muted;
    }

    function toggleMute() {
      return setMuted(!state.muted);
    }

    function isMuted() {
      return state.muted;
    }

    function setReducedMotion(flag) {
      state.reducedMotion = Boolean(flag);
      return state.reducedMotion;
    }

    function reset() {
      state.selectedKnotId = KNOT_ORDER[0];
      state.selectedRoleId = ROLE_ORDER[0];
      state.beatCount = 1;
      state.beatProgress = 0.34;
      state.elapsedSec = 0;
      state.lastCascadeState = null;
      return getState();
    }

    function getState() {
      return {
        width: state.width,
        height: state.height,
        selectedKnotId: state.selectedKnotId,
        selectedKnotIndex: KNOT_ORDER.indexOf(state.selectedKnotId),
        selectedRoleId: state.selectedRoleId,
        beatCount: state.beatCount,
        beatProgress: state.beatProgress,
        droppedBeats: 0,
        dialogueContinuity: 1.0,
        allSixKnotsActive: true,
        archetypeCount: ARCHETYPE_CATALOG.length,
        knotCount: DIALOGUE_KNOTS.length,
        fallenPrincesNominal: (state.lastCascadeState && state.lastCascadeState.fallenPrincesNominal) || 100000,
        muted: state.muted,
        audioUnlocked: state.audioUnlocked,
        reducedMotion: state.reducedMotion,
        elapsedSec: state.elapsedSec,
        activeUtterance: getActiveUtterance(state.selectedKnotId, state.lastCascadeState),
        utterances: getAllLiveUtterances(state.lastCascadeState)
      };
    }

    return {
      setViewport: setViewport,
      selectKnot: selectKnot,
      selectRole: selectRole,
      syncCascade: syncCascade,
      step: step,
      render: render,
      hitTest: hitTest,
      getActiveUtterance: getActiveUtterance,
      getAllLiveUtterances: getAllLiveUtterances,
      getState: getState,
      unlockAudio: unlockAudio,
      setMuted: setMuted,
      toggleMute: toggleMute,
      isMuted: isMuted,
      triggerVoiceExchange: triggerVoiceExchange,
      triggerTransitionChime: triggerTransitionChime,
      setReducedMotion: setReducedMotion,
      reset: reset
    };
  }

  const MelaniaSquareDialogues = Object.freeze({
    PALETTE: PALETTE,
    ROLE_ORDER: ROLE_ORDER,
    KNOT_ORDER: KNOT_ORDER,
    ARCHETYPE_CATALOG: ARCHETYPE_CATALOG,
    ARCHETYPE_BY_ID: ARCHETYPE_BY_ID,
    DIALOGUE_KNOTS: DIALOGUE_KNOTS,
    KNOT_BY_ID: KNOT_BY_ID,
    createSquareDialogues: createSquareDialogues
  });

  root.MelaniaSquareDialogues = MelaniaSquareDialogues;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MelaniaSquareDialogues;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
