(function () {
  'use strict';

  const PALETTE = {
    drainpipeLead: '#5f6b75',
    cobblestoneWet: '#2d353d',
    gutterSlate: '#1e242b',
    ironGrille: '#3b434c',
    scaleIridescence: '#8ab0ba',
    wastepaperSodden: '#9ca19a',
    encrustedWallFoot: '#3c473b',
    cellarMoss: '#354a3c',
    foundationBasalt: '#192026',
    wellAbyss: '#0b1014'
  };

  const STRATA_ORDER = ['zenith', 'threshold', 'pavement', 'cellars', 'foundations', 'wells'];

  const DIG_TARGETS = {
    threshold: 0.0,
    pavement: -0.30,
    cellars: -0.56,
    foundations: -0.75,
    wells: -0.93
  };

  const LOWER_STONES = [
    // Threshold (4): 2 drainpipes + 2 wall_foot_encrustation
    { id: 'drainpipe_1', category: 'drainpipes', stratum: 'threshold', side: 'left', normX: 0.085, bandT: -0.14, hitR: 0.065,
      label: 'Western Lead Drainpipe', detail: 'Fluted vertical lead pipe clamped with iron collars, drawing the eye inexorably down from the eaves into the kerb channel.', echoText: 'The eye slides down wet lead seams and forgets how to detach from the stones.' },
    { id: 'drainpipe_2', category: 'drainpipes', stratum: 'threshold', side: 'right', normX: 0.915, bandT: -0.14, hitR: 0.065,
      label: 'Eastern Lead Drainpipe', detail: 'Soldered rainwater conduit whose curved cast shoe spills roof-water across darkened flagstones.', echoText: 'Every drop descending the pipe rehearses the habit of looking down.' },
    { id: 'encrustation_1', category: 'wall_foot_encrustation', stratum: 'threshold', side: 'left', normX: 0.16, bandT: -0.02, hitR: 0.068,
      label: 'Saltpetre & Soot Plinth Crust', detail: 'Yesterday’s ill-humor encrusted at the damp foot of the western wall in a stubborn rind of street-splash and lichen.', echoText: 'Each repeated morning thickens the sour mineral crust along the base of the walls.' },
    { id: 'encrustation_2', category: 'wall_foot_encrustation', stratum: 'threshold', side: 'right', normX: 0.84, bandT: -0.02, hitR: 0.068,
      label: 'Mire-Stained Ashlar Base', detail: 'Darkened mortar joints where the heaviness of the day before clings to the lower courses of stone.', echoText: 'What seemed a passing mood yesterday hardens today at ankle height.' },

    // Surface Pavement (13): 3 gutters + 3 manhole_grilles + 4 fish_scales + 3 wastepaper
    { id: 'gutter_1', category: 'gutters', stratum: 'pavement', side: 'left', normX: 0.19, bandT: 0.34, hitR: 0.065,
      label: 'Western Kerb Gutter', detail: 'Grooved porphyry channel carrying grey wash-water and street grit along the sunken kerb.', echoText: 'Grey rills thread between worn cobbles toward the iron grates.' },
    { id: 'gutter_2', category: 'gutters', stratum: 'pavement', side: 'center', normX: 0.50, bandT: 0.52, hitR: 0.065,
      label: 'Central Crown Spillway', detail: 'Transverse slate depression where wheel-ruts pool cold rainwater across the middle of the lane.', echoText: 'Standing water holds only leaden sky and the shadow of a bowed head.' },
    { id: 'gutter_3', category: 'gutters', stratum: 'pavement', side: 'right', normX: 0.81, bandT: 0.36, hitR: 0.065,
      label: 'Eastern Runoff Trough', detail: 'Slick basalt gutter worn concave by decades of iron-shod heels and sweeping brooms.', echoText: 'Nothing hurries here except thin trickles seeking the lowest stone.' },
    { id: 'grille_1', category: 'manhole_grilles', stratum: 'pavement', side: 'left', normX: 0.25, bandT: 0.64, hitR: 0.066,
      label: 'Barred Sewer Grille', detail: 'Heavy cast-iron grating choked at the corners with wet grit, breathing cold air up from the drain.', echoText: 'Between iron bars, darkness answers the downward stare.' },
    { id: 'grille_2', category: 'manhole_grilles', stratum: 'pavement', side: 'center', normX: 0.52, bandT: 0.78, hitR: 0.068,
      label: 'Sunken Inspection Manhole', detail: 'Cross-hatched iron cover bruised shiny at its rivets by passing carts and lowered boots.', echoText: 'Under the barred iron lid, hollow water murmurs out of sight.' },
    { id: 'grille_3', category: 'manhole_grilles', stratum: 'pavement', side: 'right', normX: 0.76, bandT: 0.62, hitR: 0.066,
      label: 'Curbside Catch-Basin Grate', detail: 'Slotted iron mouth swallowing gutter suds and stray street sweepings into subterranean conduits.', echoText: 'A metallic ring lingers whenever a heel strikes the wet bars.' },
    { id: 'scale_1', category: 'fish_scales', stratum: 'pavement', side: 'left', normX: 0.33, bandT: 0.44, hitR: 0.058,
      label: 'Mullet Scale in Mortar Seam', detail: 'Discarded mother-of-pearl fish scale wedged upright between two wet cobbles, flashing cold teal.', echoText: 'Even in the mire, a stray scale catches an oblique nacreous glint.' },
    { id: 'scale_2', category: 'fish_scales', stratum: 'pavement', side: 'center', normX: 0.44, bandT: 0.67, hitR: 0.058,
      label: 'Cluster of Sardine Scales', detail: 'Four translucent silver-slate discs left from a morning basket, stuck like wet coins to dark stone.', echoText: 'Small cold mirrors scattered where fishmongers turned the corner.' },
    { id: 'scale_3', category: 'fish_scales', stratum: 'pavement', side: 'right', normX: 0.64, bandT: 0.48, hitR: 0.058,
      label: 'Brine- filmed Bream Scale', detail: 'Curled opalescent flake shimmering pale green and pewter beside the runoff seam.', echoText: 'A salt-stiffened speck of sea-light stranded in gutter slate.' },
    { id: 'scale_4', category: 'fish_scales', stratum: 'pavement', side: 'right', normX: 0.70, bandT: 0.82, hitR: 0.058,
      label: 'Iridescent Gill-Flake', detail: 'Faint rose-and-lead glimmer half-submerged in a film of rainwater near the eastern grate.', echoText: 'The lowered eye counts tiny cold gleams between the flags.' },
    { id: 'wastepaper_1', category: 'wastepaper', stratum: 'pavement', side: 'left', normX: 0.15, bandT: 0.74, hitR: 0.062,
      label: 'Sodden Wrapping Scrap', detail: 'Crumpled grey-white paper pulp flattened against the kerbstone, its ink bled into illegible clouds.', echoText: 'Yesterday’s news softens into grey fibre along the kerb.' },
    { id: 'wastepaper_2', category: 'wastepaper', stratum: 'pavement', side: 'center', normX: 0.59, bandT: 0.33, hitR: 0.062,
      label: 'Torn Ledger Leaf', detail: 'Folded corner of rag paper snagged on rough basalt, trembling gently in the trickle.', echoText: 'Sums and names dissolve alike once trampled into wet stone.' },
    { id: 'wastepaper_3', category: 'wastepaper', stratum: 'pavement', side: 'right', normX: 0.85, bandT: 0.70, hitR: 0.062,
      label: 'Pulped Handbill at Grate', detail: 'Waterlogged sheet pressed against the cast-iron bars like a pale sodden moth.', echoText: 'Caught at the grille, the sodden sheet dams a thread of runoff.' },

    // Subterranean (9): 3 cellars + 3 foundations + 3 wells
    { id: 'cellar_1', category: 'cellars', stratum: 'cellars', side: 'left', normX: 0.22, bandT: 0.50, hitR: 0.072,
      label: 'Moss-Vaulted Wine Cellar', detail: 'Low Roman-brick barrel vault furred with velvet green moss and weeping beads of cold nitre.', echoText: 'Once the gaze pierces the flags, damp brick vaults open beneath every step.' },
    { id: 'cellar_2', category: 'cellars', stratum: 'cellars', side: 'center', normX: 0.50, bandT: 0.54, hitR: 0.072,
      label: 'Cistern Under-Crypt', detail: 'Blind brick arcade beneath the thoroughfare where seepage ticks steadily onto sunken tiles.', echoText: 'In the airless vault, nobody speaks of curtains save by hearsay.' },
    { id: 'cellar_3', category: 'cellars', stratum: 'cellars', side: 'right', normX: 0.78, bandT: 0.50, hitR: 0.072,
      label: 'Salt-Cured Storage Vault', detail: 'Sweating masonry chamber banded with iron straps and pale mineral efflorescence.', echoText: 'The street overhead sounds only as muffled iron rims and heels.' },
    { id: 'foundation_1', category: 'foundations', stratum: 'foundations', side: 'left', normX: 0.23, bandT: 0.52, hitR: 0.074,
      label: 'Western Cyclopean Piling', detail: 'Immense unmortared basalt blocks wedged into black clay, bearing the silent weight of five storeys.', echoText: 'Down among the pilings, every airy sill above becomes sheer compressive load.' },
    { id: 'foundation_2', category: 'foundations', stratum: 'foundations', side: 'center', normX: 0.50, bandT: 0.55, hitR: 0.074,
      label: 'Keystone Plinth Pier', detail: 'Rusticated dark stone footing pinned with corroded iron cramps beneath the street axis.', echoText: 'The deeper the eye digs, the heavier the upper city presses down.' },
    { id: 'foundation_3', category: 'foundations', stratum: 'foundations', side: 'right', normX: 0.77, bandT: 0.52, hitR: 0.074,
      label: 'Eastern Basalt Footing', detail: 'Squared subterranean monoliths slick with groundwater seeping toward the lower water-table.', echoText: 'Cold basalt remembers neither breeze nor sunlit casement.' },
    { id: 'well_1', category: 'wells', stratum: 'wells', side: 'left', normX: 0.22, bandT: 0.56, hitR: 0.076,
      label: 'Western Phreatic Well-Shaft', detail: 'Cylindrical black masonry shaft dropping to still water where a ghostly memory of sky trembles.', echoText: 'At the bottom of the well, upper sunlit sills return only as a rumour on black water.' },
    { id: 'well_2', category: 'wells', stratum: 'wells', side: 'center', normX: 0.50, bandT: 0.60, hitR: 0.080,
      label: 'Abyssal Cistern Well', detail: 'Deepest subterranean water-mirror; those who stare here hear of fountains above chiefly from fellow rememberers.', echoText: 'Still black water holds the faintest amber ghost of a window no one lifts their head to verify.' },
    { id: 'well_3', category: 'wells', stratum: 'wells', side: 'right', normX: 0.78, bandT: 0.56, hitR: 0.076,
      label: 'Eastern Echoing Well', detail: 'Narrow stone throat plunging into the water-table, answering every drop with a long hollow ring.', echoText: 'From the well-bottom, upward reversal seems rare as water climbing stone.' }
  ];

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function computeHorizonRatio(gazeElevation) {
    return 0.18 + (clamp(gazeElevation, -1, 1) + 1) * 0.37;
  }

  function computeSectionLayout(gazeElevation) {
    const g = clamp(gazeElevation, -1, 1);
    const horizon = computeHorizonRatio(g);
    const lowerSpan = Math.max(0.06, 1 - horizon);
    if (g >= -0.35) {
      return {
        horizon,
        pavementBottom: 1.0,
        cellarsBottom: 1.0,
        foundationsBottom: 1.0,
        wellsBottom: 1.0,
        subAlpha: 0,
        cellarsAlpha: 0,
        foundationsAlpha: 0,
        wellsAlpha: 0
      };
    }
    const subT = clamp((-0.35 - g) / 0.65, 0, 1);
    const paveShare = 1 - 0.76 * subT;
    const pavementBottom = horizon + lowerSpan * paveShare;
    const rem = Math.max(0.001, 1 - pavementBottom);
    const cWeight = 1.0;
    const fWeight = clamp((-0.48 - g) / 0.24, 0, 1) * 1.08;
    const wWeight = clamp((-0.68 - g) / 0.24, 0, 1) * 1.32;
    const wSum = cWeight + fWeight + wWeight;
    const cellarsBottom = pavementBottom + rem * (cWeight / wSum);
    const foundationsBottom = cellarsBottom + rem * (fWeight / wSum);
    return {
      horizon,
      pavementBottom,
      cellarsBottom,
      foundationsBottom,
      wellsBottom: 1.0,
      subAlpha: clamp(subT * 1.5, 0, 1),
      cellarsAlpha: clamp((-0.35 - g) / 0.14, 0, 1),
      foundationsAlpha: clamp((-0.48 - g) / 0.16, 0, 1),
      wellsAlpha: clamp((-0.68 - g) / 0.16, 0, 1)
    };
  }

  function projectStoneNorm(stone, gazeElevation, illHumor) {
    const lay = computeSectionLayout(gazeElevation);
    const crustLift = 0.015 + clamp(illHumor || 0.08, 0, 1) * 0.045;
    if (stone.stratum === 'threshold') {
      const ny = stone.category === 'drainpipes'
        ? clamp(lay.horizon - 0.09, 0.08, 0.94)
        : clamp(lay.horizon - crustLift * 0.55, 0.10, 0.96);
      return { normX: stone.normX, normY: ny, visible: true };
    }
    if (stone.stratum === 'pavement') {
      const span = Math.max(0.04, lay.pavementBottom - lay.horizon);
      return { normX: stone.normX, normY: lay.horizon + span * stone.bandT, visible: lay.horizon < 0.96 };
    }
    if (stone.stratum === 'cellars') {
      const span = lay.cellarsBottom - lay.pavementBottom;
      return { normX: stone.normX, normY: lay.pavementBottom + span * stone.bandT, visible: lay.cellarsAlpha > 0.12 && span > 0.04 };
    }
    if (stone.stratum === 'foundations') {
      const span = lay.foundationsBottom - lay.cellarsBottom;
      return { normX: stone.normX, normY: lay.cellarsBottom + span * stone.bandT, visible: lay.foundationsAlpha > 0.12 && span > 0.04 };
    }
    const span = lay.wellsBottom - lay.foundationsBottom;
    return { normX: stone.normX, normY: lay.foundationsBottom + span * stone.bandT, visible: lay.wellsAlpha > 0.12 && span > 0.04 };
  }

  function createGutterAudio() {
    let ctx = null;
    let muted = false;
    let noiseBuf = null;

    function ensureContext() {
      if (muted) return null;
      try {
        if (!ctx) {
          const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
          if (!AC) return null;
          ctx = new AC();
        }
        if (ctx.state === 'suspended') {
          const p = ctx.resume();
          if (p && typeof p.catch === 'function') p.catch(function () {});
        }
        if (!noiseBuf && ctx) {
          const len = Math.max(2048, Math.floor(ctx.sampleRate * 0.35));
          noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
          const data = noiseBuf.getChannelData(0);
          for (let i = 0; i < len; i += 1) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / len);
          }
        }
        return ctx;
      } catch (_err) {
        return null;
      }
    }

    function unlock() {
      try {
        const c = ensureContext();
        return Boolean(c);
      } catch (_err) {
        return false;
      }
    }

    function setMuted(flag) {
      muted = Boolean(flag);
      return muted;
    }

    function toggleMute() {
      muted = !muted;
      return muted;
    }

    function isMuted() {
      return muted;
    }

    function playCobbleStep() {
      try {
        const c = ensureContext();
        if (!c) return;
        const now = c.currentTime;
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(108, now);
        osc.frequency.exponentialRampToValueAtTime(46, now + 0.13);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.11, now + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.16);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(now);
        osc.stop(now + 0.17);

        if (noiseBuf) {
          const src = c.createBufferSource();
          const bp = c.createBiquadFilter();
          const ng = c.createGain();
          src.buffer = noiseBuf;
          bp.type = 'bandpass';
          bp.frequency.setValueAtTime(620, now);
          bp.Q.setValueAtTime(1.8, now);
          ng.gain.setValueAtTime(0.045, now);
          ng.gain.exponentialRampToValueAtTime(0.0008, now + 0.09);
          src.connect(bp);
          bp.connect(ng);
          ng.connect(c.destination);
          src.start(now);
          src.stop(now + 0.10);
        }
      } catch (_err) {}
    }

    function playGutterTrickle() {
      try {
        const c = ensureContext();
        if (!c) return;
        const now = c.currentTime;
        const freqs = [920, 1180, 790];
        for (let i = 0; i < freqs.length; i += 1) {
          const t0 = now + i * 0.055;
          const osc = c.createOscillator();
          const g = c.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freqs[i], t0);
          osc.frequency.exponentialRampToValueAtTime(freqs[i] * 1.24, t0 + 0.06);
          g.gain.setValueAtTime(0.0008, t0);
          g.gain.linearRampToValueAtTime(0.036, t0 + 0.008);
          g.gain.exponentialRampToValueAtTime(0.0007, t0 + 0.075);
          osc.connect(g);
          g.connect(c.destination);
          osc.start(t0);
          osc.stop(t0 + 0.08);
        }
      } catch (_err) {}
    }

    function playManholeGrate() {
      try {
        const c = ensureContext();
        if (!c) return;
        const now = c.currentTime;
        const partials = [164, 249, 386];
        for (let i = 0; i < partials.length; i += 1) {
          const osc = c.createOscillator();
          const g = c.createGain();
          osc.type = i === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(partials[i], now);
          osc.frequency.exponentialRampToValueAtTime(partials[i] * 0.91, now + 0.24);
          g.gain.setValueAtTime(0.001, now);
          g.gain.linearRampToValueAtTime(0.055 / (i + 1), now + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0007, now + 0.26);
          osc.connect(g);
          g.connect(c.destination);
          osc.start(now);
          osc.stop(now + 0.28);
        }
      } catch (_err) {}
    }

    function playCellarDrip() {
      try {
        const c = ensureContext();
        if (!c) return;
        const now = c.currentTime;
        const delays = [0, 0.14];
        for (let i = 0; i < delays.length; i += 1) {
          const t0 = now + delays[i];
          const amp = i === 0 ? 0.065 : 0.024;
          const osc = c.createOscillator();
          const g = c.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(640, t0);
          osc.frequency.exponentialRampToValueAtTime(1090, t0 + 0.065);
          g.gain.setValueAtTime(0.0008, t0);
          g.gain.linearRampToValueAtTime(amp, t0 + 0.008);
          g.gain.exponentialRampToValueAtTime(0.0007, t0 + 0.12);
          osc.connect(g);
          g.connect(c.destination);
          osc.start(t0);
          osc.stop(t0 + 0.13);
        }
      } catch (_err) {}
    }

    function playWellEcho() {
      try {
        const c = ensureContext();
        if (!c) return;
        const now = c.currentTime;
        const tones = [65.4, 98.0, 293.7];
        for (let i = 0; i < tones.length; i += 1) {
          const osc = c.createOscillator();
          const g = c.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(tones[i], now + i * 0.03);
          osc.frequency.exponentialRampToValueAtTime(tones[i] * 0.985, now + 0.52);
          g.gain.setValueAtTime(0.0008, now + i * 0.03);
          g.gain.linearRampToValueAtTime(i === 2 ? 0.022 : 0.052, now + i * 0.03 + 0.04);
          g.gain.exponentialRampToValueAtTime(0.0007, now + 0.56);
          osc.connect(g);
          g.connect(c.destination);
          osc.start(now + i * 0.03);
          osc.stop(now + 0.58);
        }
      } catch (_err) {}
    }

    return {
      unlock,
      setMuted,
      toggleMute,
      isMuted,
      playCobbleStep,
      playGutterTrickle,
      playManholeGrate,
      playCellarDrip,
      playWellEcho
    };
  }

  const COUNTS_BY_CATEGORY = LOWER_STONES.reduce(function (acc, st) {
    acc[st.category] = (acc[st.category] || 0) + 1;
    return acc;
  }, {});

  function createGutterEngine(opts) {
    const options = opts || {};
    const audio = createGutterAudio();

    let consecutiveDays = 1;
    let gazeElevation = 0.55;
    let beholderPosture = 'whistling_upward';
    let currentStratum = 'zenith';
    let nailsDugIntoPalms = false;
    let encrustedIllHumor = 0.08;
    let liftResistance = 0.14;
    let autoHabitDrift = true;
    let rareReversalsCount = 0;
    let wasSunkInLower = false;
    let deepestStratumReached = 'zenith';
    let reducedMotion = Boolean(options.reducedMotion);
    let lastInspectedStoneId = null;
    let animTime = 0;

    const categoryCursors = {};
    const gutterRills = [
      { lane: 0.19, t: 0.08, speed: 0.24 },
      { lane: 0.19, t: 0.58, speed: 0.24 },
      { lane: 0.50, t: 0.31, speed: 0.18 },
      { lane: 0.81, t: 0.20, speed: 0.26 },
      { lane: 0.81, t: 0.72, speed: 0.26 }
    ];
    const nitreDrips = [
      { x: 0.22, fall: 0.12, rate: 0.42 },
      { x: 0.50, fall: 0.55, rate: 0.36 },
      { x: 0.78, fall: 0.81, rate: 0.46 }
    ];
    const wellRipples = [
      { x: 0.22, phase: 0.10, rate: 0.30 },
      { x: 0.50, phase: 0.48, rate: 0.25 },
      { x: 0.78, phase: 0.77, rate: 0.33 }
    ];

    function deriveStratumAndPosture(g) {
      if (g > 0.10) return { stratum: 'zenith', posture: 'whistling_upward' };
      if (g >= -0.10) return { stratum: 'threshold', posture: 'drainpipe_descent' };
      if (g > -0.45) return { stratum: 'pavement', posture: 'palms_clenched_gutter' };
      if (g > -0.65) return { stratum: 'cellars', posture: 'subterranean_digging' };
      if (g > -0.84) return { stratum: 'foundations', posture: 'subterranean_digging' };
      return { stratum: 'wells', posture: 'subterranean_digging' };
    }

    function getState() {
      const inclinationDeg = gazeElevation >= 0
        ? Math.round(gazeElevation * 650) / 10
        : Math.round(gazeElevation * 900) / 10;
      return {
        consecutiveDays: consecutiveDays,
        gazeElevation: Math.round(gazeElevation * 10000) / 10000,
        inclinationDeg: inclinationDeg,
        beholderPosture: beholderPosture,
        currentStratum: currentStratum,
        deepestStratumReached: deepestStratumReached,
        nailsDugIntoPalms: nailsDugIntoPalms,
        encrustedIllHumor: Math.round(encrustedIllHumor * 10000) / 10000,
        liftResistance: Math.round(liftResistance * 10000) / 10000,
        autoHabitDrift: autoHabitDrift,
        rareReversalsCount: rareReversalsCount,
        oneAspectTruer: false,
        bothFormsValid: true,
        upperHeardChieflyFromRememberersBelow: gazeElevation < -0.10,
        countsByCategory: Object.assign({}, COUNTS_BY_CATEGORY),
        stonesCount: LOWER_STONES.length,
        muted: audio.isMuted()
      };
    }

    function updateElevation(nextGaze, notify) {
      const prevStratum = currentStratum;
      gazeElevation = clamp(Number(nextGaze) || 0, -1.0, 1.0);
      const derived = deriveStratumAndPosture(gazeElevation);
      currentStratum = derived.stratum;
      beholderPosture = derived.posture;

      if (STRATA_ORDER.indexOf(currentStratum) > STRATA_ORDER.indexOf(deepestStratumReached)) {
        deepestStratumReached = currentStratum;
      }

      let rareAscentFired = false;
      if (gazeElevation <= -0.18) {
        wasSunkInLower = true;
        nailsDugIntoPalms = true;
      } else if (wasSunkInLower === true && gazeElevation >= 0.22) {
        rareReversalsCount += 1;
        wasSunkInLower = false;
        nailsDugIntoPalms = false;
        encrustedIllHumor = Math.max(0.05, encrustedIllHumor - 0.08);
        liftResistance = Math.min(0.78, 0.14 + encrustedIllHumor * 0.66);
        rareAscentFired = true;
      }

      if (notify) {
        if (currentStratum !== prevStratum && typeof options.onStratumChanged === 'function') {
          options.onStratumChanged(getState());
        }
        if (rareAscentFired && typeof options.onRareAscent === 'function') {
          options.onRareAscent(getState());
        }
      }
    }

    function playStoneSound(categoryOrStratum) {
      if (categoryOrStratum === 'wells') audio.playWellEcho();
      else if (categoryOrStratum === 'cellars') audio.playCellarDrip();
      else if (categoryOrStratum === 'manhole_grilles' || categoryOrStratum === 'foundations' || categoryOrStratum === 'pavement') audio.playManholeGrate();
      else if (categoryOrStratum === 'wall_foot_encrustation') audio.playCobbleStep();
      else audio.playGutterTrickle();
    }

    function tiltGaze(deltaElevation) {
      const d = Number(deltaElevation) || 0;
      let scaled = d;
      if (d > 0 && gazeElevation < 0.05) {
        scaled = d * (1 - liftResistance * 0.68);
      } else if (d < 0) {
        scaled = d * (1 + encrustedIllHumor * 0.40);
      }
      updateElevation(gazeElevation + scaled, true);
      return getState();
    }

    function setGazeDirect(targetElevation) {
      updateElevation(targetElevation, true);
      return getState();
    }

    function applyWhistleImpulse(impulse) {
      const imp = typeof impulse === 'number' ? impulse : 0.36;
      const gain = Math.max(0.14, imp * (1 - liftResistance * 0.60));
      updateElevation(gazeElevation + gain, true);
      return getState();
    }

    function clenchPalmsAndHangHead() {
      nailsDugIntoPalms = true;
      encrustedIllHumor = Math.min(0.95, encrustedIllHumor + 0.10);
      liftResistance = Math.min(0.78, 0.14 + encrustedIllHumor * 0.66);
      const nextG = gazeElevation > -0.30 ? -0.32 : gazeElevation - 0.22;
      updateElevation(nextG, true);
      audio.playManholeGrate();
      return getState();
    }

    function advanceSameStreetDay(days) {
      const d = Math.max(1, Number(days) || 1);
      consecutiveDays += d;
      encrustedIllHumor = Math.min(0.95, encrustedIllHumor + 0.15 * d);
      liftResistance = Math.min(0.78, 0.14 + encrustedIllHumor * 0.66);
      updateElevation(gazeElevation - 0.26 * d, true);
      audio.playCobbleStep();
      if (typeof options.onDayAdvanced === 'function') {
        options.onDayAdvanced(getState());
      }
      return getState();
    }

    function digSubterranean(targetStratum) {
      let key = targetStratum;
      if (!key || typeof DIG_TARGETS[key] !== 'number') {
        const idx = STRATA_ORDER.indexOf(currentStratum);
        key = STRATA_ORDER[Math.min(STRATA_ORDER.length - 1, Math.max(1, idx + 1))];
      }
      const targetG = DIG_TARGETS[key];
      updateElevation(targetG, true);
      playStoneSound(key);
      return getState();
    }

    function inspectLowerStone(idOrCategory) {
      let stone = LOWER_STONES.find(function (s) { return s.id === idOrCategory; });
      if (!stone) {
        const pool = LOWER_STONES.filter(function (s) {
          return s.category === idOrCategory || s.stratum === idOrCategory;
        });
        const list = pool.length ? pool : LOWER_STONES;
        const k = String(idOrCategory || 'all');
        const idx = categoryCursors[k] || 0;
        stone = list[idx % list.length];
        categoryCursors[k] = idx + 1;
      }
      lastInspectedStoneId = stone.id;
      const ceilings = { threshold: 0.06, pavement: -0.20, cellars: -0.50, foundations: -0.70, wells: -0.86 };
      if (gazeElevation > ceilings[stone.stratum]) {
        updateElevation(DIG_TARGETS[stone.stratum], true);
      }
      playStoneSound(stone.category);
      return { stone: Object.assign({}, stone), state: getState() };
    }

    function setAutoHabitDrift(flag) {
      autoHabitDrift = Boolean(flag);
      return getState();
    }

    function reset() {
      consecutiveDays = 1;
      gazeElevation = 0.55;
      beholderPosture = 'whistling_upward';
      currentStratum = 'zenith';
      nailsDugIntoPalms = false;
      encrustedIllHumor = 0.08;
      liftResistance = 0.14;
      autoHabitDrift = true;
      rareReversalsCount = 0;
      wasSunkInLower = false;
      deepestStratumReached = 'zenith';
      lastInspectedStoneId = null;
      Object.keys(categoryCursors).forEach(function (k) { delete categoryCursors[k]; });
      return getState();
    }

    function step(dtSec, env) {
      const dt = clamp(Number(dtSec) || 0, 0, 0.25);
      const e = env || {};
      if (typeof e.reducedMotion === 'boolean') reducedMotion = e.reducedMotion;
      if (autoHabitDrift && (Number(e.idleSec) || 0) > 1.8) {
        const pull = -0.025 * (1 + encrustedIllHumor * 1.4) * dt;
        updateElevation(gazeElevation + pull, true);
      }
      if (!reducedMotion && dt > 0) {
        animTime += dt;
        for (let i = 0; i < gutterRills.length; i += 1) {
          gutterRills[i].t = (gutterRills[i].t + gutterRills[i].speed * dt) % 1;
        }
        for (let i = 0; i < nitreDrips.length; i += 1) {
          nitreDrips[i].fall = (nitreDrips[i].fall + nitreDrips[i].rate * dt) % 1;
        }
        for (let i = 0; i < wellRipples.length; i += 1) {
          wellRipples[i].phase = (wellRipples[i].phase + wellRipples[i].rate * dt) % 1;
        }
      }
      return getState();
    }

    function hitTest(normX, normY, gazeElevationOverride) {
      const g = typeof gazeElevationOverride === 'number' ? gazeElevationOverride : gazeElevation;
      const nx = Number(normX);
      const ny = Number(normY);
      if (!Number.isFinite(nx) || !Number.isFinite(ny)) return null;
      let best = null;
      let bestDist = Infinity;
      let bestProj = null;
      for (let i = 0; i < LOWER_STONES.length; i += 1) {
        const st = LOWER_STONES[i];
        const proj = projectStoneNorm(st, g, encrustedIllHumor);
        if (!proj.visible) continue;
        const d = Math.hypot(nx - proj.normX, ny - proj.normY);
        if (d <= st.hitR && d < bestDist) {
          best = st;
          bestDist = d;
          bestProj = proj;
        }
      }
      return best ? Object.assign({}, best, { normX: bestProj.normX, normY: bestProj.normY }) : null;
    }

    function renderLower(ctx, width, height, view) {
      if (!ctx || width <= 0 || height <= 0) return;
      const v = view || {};
      const g = clamp(typeof v.gazeElevation === 'number' ? v.gazeElevation : gazeElevation, -1, 1);
      const ill = clamp(typeof v.encrustedIllHumor === 'number' ? v.encrustedIllHumor : encrustedIllHumor, 0, 1);
      const tSec = typeof v.timeSec === 'number' ? v.timeSec : animTime;
      const rm = typeof v.reducedMotion === 'boolean' ? v.reducedMotion : reducedMotion;
      const hoveredId = v.hoveredId || null;
      const selectedId = v.selectedId || lastInspectedStoneId;

      const horizonY = height * (0.18 + (g + 1) * 0.37);
      const lay = computeSectionLayout(g);
      const paveBotY = height * lay.pavementBottom;
      const cellBotY = height * lay.cellarsBottom;
      const foundBotY = height * lay.foundationsBottom;
      const paveSpan = Math.max(8, paveBotY - horizonY);

      ctx.save();
      if (lay.subAlpha > 0.01) {
        ctx.fillStyle = 'rgba(11,16,20,' + (lay.subAlpha * 0.48).toFixed(3) + ')';
        ctx.fillRect(0, 0, width, horizonY);
      }

      // Street surface & wet cobblestones
      const paveGrad = ctx.createLinearGradient(0, horizonY, 0, paveBotY);
      paveGrad.addColorStop(0, PALETTE.cobblestoneWet);
      paveGrad.addColorStop(0.55, PALETTE.gutterSlate);
      paveGrad.addColorStop(1, '#151a20');
      ctx.fillStyle = paveGrad;
      ctx.fillRect(0, horizonY, width, paveSpan + 1);

      const vpX = width * 0.5;
      const vpY = horizonY - height * 0.08;
      ctx.strokeStyle = 'rgba(14,18,23,0.68)';
      ctx.lineWidth = 1;
      for (let r = 1; r <= 8; r += 1) {
        const rt = Math.pow(r / 8, 1.38);
        const ry = horizonY + paveSpan * rt;
        ctx.beginPath();
        ctx.moveTo(0, ry);
        ctx.lineTo(width, ry);
        ctx.stroke();
      }
      for (let c = -5; c <= 5; c += 1) {
        const bx = vpX + (c / 5) * width * 0.62;
        const tx = vpX + (c / 5) * width * 0.34;
        ctx.beginPath();
        ctx.moveTo(tx, horizonY);
        ctx.lineTo(bx, paveBotY);
        ctx.stroke();
      }

      // Wall-foot encrustation & vertical lead drainpipes
      const crustH = height * (0.016 + ill * 0.056);
      ctx.fillStyle = PALETTE.encrustedWallFoot;
      ctx.globalAlpha = 0.58 + ill * 0.38;
      for (let side = 0; side < 2; side += 1) {
        const isL = side === 0;
        const wx = isL ? 0 : width * 0.70;
        const ww = width * 0.30;
        ctx.beginPath();
        ctx.moveTo(wx, horizonY + 4);
        for (let s = 0; s <= 8; s += 1) {
          const sx = wx + (s / 8) * ww;
          const jag = Math.sin(s * 2.1 + side) * crustH * 0.25;
          const taper = isL ? (1 - s / 9) : (0.1 + s / 9);
          ctx.lineTo(sx, horizonY - crustH * taper + jag);
        }
        ctx.lineTo(wx + ww, horizonY + 4);
        ctx.closePath();
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      const pipeW = Math.max(7, width * 0.013);
      const pipeXs = [width * 0.085, width * 0.915];
      for (let p = 0; p < 2; p += 1) {
        const px = pipeXs[p] - pipeW * 0.5;
        const shoeDir = p === 0 ? 1 : -1;
        ctx.fillStyle = PALETTE.drainpipeLead;
        ctx.fillRect(px, 0, pipeW, horizonY + paveSpan * 0.08);
        ctx.fillStyle = 'rgba(216,238,248,0.24)';
        ctx.fillRect(px + pipeW * 0.2, 0, pipeW * 0.22, horizonY + paveSpan * 0.06);
        ctx.fillStyle = PALETTE.ironGrille;
        for (let cy = 28; cy < horizonY; cy += 56) {
          ctx.fillRect(px - 3, cy, pipeW + 6, 4);
        }
        ctx.beginPath();
        ctx.moveTo(px, horizonY + paveSpan * 0.07);
        ctx.lineTo(px + pipeW + shoeDir * pipeW * 1.1, horizonY + paveSpan * 0.13);
        ctx.lineTo(px + shoeDir * pipeW * 0.9, horizonY + paveSpan * 0.15);
        ctx.closePath();
        ctx.fillStyle = PALETTE.drainpipeLead;
        ctx.fill();
      }

      // Gutters, runoff rills, manhole grilles, fish scales & wastepaper
      const lanes = [0.19, 0.50, 0.81];
      for (let i = 0; i < lanes.length; i += 1) {
        const gxTop = vpX + (lanes[i] - 0.5) * width * 0.68;
        const gxBot = width * lanes[i];
        ctx.strokeStyle = '#12171d';
        ctx.lineWidth = Math.max(6, width * 0.022);
        ctx.beginPath();
        ctx.moveTo(gxTop, horizonY);
        ctx.lineTo(gxBot, paveBotY);
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(138,176,186,0.42)';
      ctx.lineWidth = 1.6;
      for (let i = 0; i < gutterRills.length; i += 1) {
        const rill = gutterRills[i];
        const t0 = rill.t;
        const t1 = Math.min(1, t0 + 0.16);
        const x0 = (vpX + (rill.lane - 0.5) * width * 0.68) * (1 - t0) + (width * rill.lane) * t0;
        const x1 = (vpX + (rill.lane - 0.5) * width * 0.68) * (1 - t1) + (width * rill.lane) * t1;
        ctx.beginPath();
        ctx.moveTo(x0, horizonY + paveSpan * t0);
        ctx.lineTo(x1, horizonY + paveSpan * t1);
        ctx.stroke();
      }

      for (let i = 0; i < LOWER_STONES.length; i += 1) {
        const st = LOWER_STONES[i];
        if (st.stratum !== 'pavement') continue;
        const pr = projectStoneNorm(st, g, ill);
        const sx = pr.normX * width;
        const sy = pr.normY * height;
        if (st.category === 'manhole_grilles') {
          const gw = Math.max(26, width * 0.056);
          const gh = Math.max(10, paveSpan * 0.085);
          ctx.fillStyle = PALETTE.wellAbyss;
          ctx.fillRect(sx - gw * 0.5, sy - gh * 0.5, gw, gh);
          ctx.strokeStyle = PALETTE.ironGrille;
          ctx.lineWidth = 2;
          ctx.strokeRect(sx - gw * 0.5, sy - gh * 0.5, gw, gh);
          for (let b = 1; b < 6; b += 1) {
            const bx = sx - gw * 0.5 + (b / 6) * gw;
            ctx.beginPath();
            ctx.moveTo(bx, sy - gh * 0.5);
            ctx.lineTo(bx, sy + gh * 0.5);
            ctx.stroke();
          }
        } else if (st.category === 'fish_scales') {
          const glint = rm ? 0.75 : 0.52 + 0.42 * Math.sin(tSec * 2.7 + i * 1.9);
          ctx.fillStyle = PALETTE.scaleIridescence;
          ctx.globalAlpha = glint;
          for (let k = -1; k <= 1; k += 1) {
            ctx.beginPath();
            ctx.ellipse(sx + k * 6, sy + (k % 2) * 3, 4.2, 2.5, k * 0.4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        } else if (st.category === 'wastepaper') {
          ctx.fillStyle = PALETTE.wastepaperSodden;
          ctx.globalAlpha = 0.82;
          ctx.beginPath();
          ctx.moveTo(sx - 10, sy - 2);
          ctx.lineTo(sx + 2, sy - 6);
          ctx.lineTo(sx + 11, sy + 1);
          ctx.lineTo(sx - 3, sy + 6);
          ctx.closePath();
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }

      // Subterranean cutaway: Cellars, Foundations, Deep Wells
      if (lay.cellarsAlpha > 0.02 && cellBotY > paveBotY + 2) {
        const ch = cellBotY - paveBotY;
        ctx.fillStyle = '#171f1b';
        ctx.fillRect(0, paveBotY, width, ch + 1);
        const centers = [0.22, 0.50, 0.78];
        for (let vIdx = 0; vIdx < 3; vIdx += 1) {
          const cx = width * centers[vIdx];
          const vw = width * 0.22;
          ctx.fillStyle = '#0e1412';
          ctx.beginPath();
          ctx.moveTo(cx - vw * 0.5, cellBotY);
          ctx.lineTo(cx - vw * 0.5, paveBotY + ch * 0.42);
          ctx.quadraticCurveTo(cx, paveBotY + ch * 0.04, cx + vw * 0.5, paveBotY + ch * 0.42);
          ctx.lineTo(cx + vw * 0.5, cellBotY);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = PALETTE.cellarMoss;
          ctx.lineWidth = 3;
          ctx.stroke();
        }
        ctx.fillStyle = '#9ec4ca';
        for (let d = 0; d < nitreDrips.length; d += 1) {
          const dr = nitreDrips[d];
          ctx.beginPath();
          ctx.arc(width * dr.x, paveBotY + ch * (0.20 + dr.fall * 0.74), 2.1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (lay.foundationsAlpha > 0.02 && foundBotY > cellBotY + 2) {
        const fh = foundBotY - cellBotY;
        ctx.fillStyle = PALETTE.foundationBasalt;
        ctx.fillRect(0, cellBotY, width, fh + 1);
        ctx.strokeStyle = '#2b3640';
        ctx.lineWidth = 1.4;
        for (let row = 0; row < 3; row += 1) {
          const ry = cellBotY + (row / 3) * fh;
          const bh = fh / 3;
          for (let col = 0; col < 7; col += 1) {
            const ox = ((row % 2) * 0.07 + col * 0.15) * width;
            ctx.strokeRect(ox, ry + 1, width * 0.145, bh - 2);
          }
        }
      }

      if (lay.wellsAlpha > 0.02 && height > foundBotY + 2) {
        const wh = height - foundBotY;
        ctx.fillStyle = PALETTE.wellAbyss;
        ctx.fillRect(0, foundBotY, width, wh);
        const wxs = [0.22, 0.50, 0.78];
        for (let w = 0; w < 3; w += 1) {
          const wx = width * wxs[w];
          const sw = width * 0.13;
          const waterY = foundBotY + wh * 0.72;
          ctx.strokeStyle = '#25303a';
          ctx.lineWidth = 2;
          ctx.strokeRect(wx - sw * 0.5, foundBotY, sw, wh * 0.88);
          ctx.fillStyle = 'rgba(139,184,214,0.12)';
          ctx.beginPath();
          ctx.ellipse(wx, waterY, sw * 0.44, Math.max(5, wh * 0.11), 0, 0, Math.PI * 2);
          ctx.fill();
          const rp = wellRipples[w].phase;
          ctx.strokeStyle = 'rgba(214,167,92,' + (0.42 * (1 - rp)).toFixed(3) + ')';
          ctx.lineWidth = 1.3;
          ctx.beginPath();
          ctx.ellipse(wx, waterY, sw * (0.12 + rp * 0.30), Math.max(2, wh * 0.03 + rp * wh * 0.07), 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Active / hovered stone marker
      for (let i = 0; i < LOWER_STONES.length; i += 1) {
        const st = LOWER_STONES[i];
        if (st.id !== hoveredId && st.id !== selectedId) continue;
        const pr = projectStoneNorm(st, g, ill);
        if (!pr.visible) continue;
        ctx.strokeStyle = st.id === hoveredId ? '#d8eef8' : '#d6a75c';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(pr.normX * width, pr.normY * height, 13, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    return {
      getState: getState,
      tiltGaze: tiltGaze,
      setGazeDirect: setGazeDirect,
      applyWhistleImpulse: applyWhistleImpulse,
      clenchPalmsAndHangHead: clenchPalmsAndHangHead,
      advanceSameStreetDay: advanceSameStreetDay,
      digSubterranean: digSubterranean,
      inspectLowerStone: inspectLowerStone,
      step: step,
      renderLower: renderLower,
      hitTest: hitTest,
      setAutoHabitDrift: setAutoHabitDrift,
      reset: reset,
      audio: audio
    };
  }

  const api = {
    PALETTE: PALETTE,
    LOWER_STONES: LOWER_STONES,
    createGutterEngine: createGutterEngine
  };

  globalThis.ZemrudeSunkenGutters = api;
  if (typeof window !== 'undefined') {
    window.ZemrudeSunkenGutters = api;
  }
})();
