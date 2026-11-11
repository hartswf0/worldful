(function () {
  'use strict';

  const PALETTE = Object.freeze({
    nightSlate: '#0d131f',
    wallSlate: '#172235',
    mortarAsh: '#26344d',
    copperPot: '#c86d3b',
    hearthEmber: '#e24c2c',
    keyBrass: '#d9b45b',
    trunkLinen: '#efe5d1',
    tinPatina: '#7e90a4',
    rustCan: '#b56542'
  });

  const PLOT_SITES = Object.freeze([
    { id: 'plot_porta_vecchia', index: 0, address: 'Via Porta Vecchia #4', foundationId: 'tufa_foundation_I', villaName: 'Casa Vecchia Portal' },
    { id: 'plot_cistern_lane', index: 1, address: 'Vicolo della Cisterna #11', foundationId: 'tufa_foundation_II', villaName: 'Villa del Pozzo' },
    { id: 'plot_archway_step', index: 2, address: "Salita dell'Arco #19", foundationId: 'tufa_foundation_III', villaName: 'Palazzetto dell’Arco' },
    { id: 'plot_campanile_court', index: 3, address: 'Corte del Campanile #27', foundationId: 'tufa_foundation_IV', villaName: 'Domus Campanile' }
  ]);

  const LARES_NICHES = Object.freeze([
    { id: 'kitchen_pots', label: 'Copper Kitchen Pots', glyph: '⏣', hue: '#c86d3b', note: 'Crouched beneath simmering copper lids and pot-racks.' },
    { id: 'stove_flues', label: 'Warm Stove Flues', glyph: '⌇', hue: '#e24c2c', note: 'Nested inside soot-warm chimney throats rising floor to floor.' },
    { id: 'cellar_pipes', label: 'Cellar Pipes', glyph: '╬', hue: '#7e90a4', note: 'Whispering along damp subterranean lead and iron foundation pipes.' },
    { id: 'rusty_tin_cans', label: 'Rusty Tin Cans', glyph: '⌸', hue: '#b56542', note: 'Tucked in oxidized pantry & cellar tin canisters.' }
  ]);

  const VOCAL_MODES = Object.freeze(['murmur', 'interrupt', 'huff', 'banter', 'stifled_laughter']);
  const DISCOURSE_AXES = Object.freeze(['present_critique', 'future_dream']);

  const STAGE_SPECS = Object.freeze({
    villa_1: { buildingStage: 'villa_1', stageLabel: '1-Family Villa', familyCapacity: 1, floors: 2, laresCount: 4, perNiche: 1, gossipChannels: 2 },
    walkup_12: { buildingStage: 'walkup_12', stageLabel: '12-Family Walkup', familyCapacity: 12, floors: 4, laresCount: 20, perNiche: 5, gossipChannels: 10 },
    tenement_50: { buildingStage: 'tenement_50', stageLabel: '50-Family Block', familyCapacity: 50, floors: 7, laresCount: 64, perNiche: 16, gossipChannels: 28 }
  });

  const LARES_CORPUS = {
    present_critique: [
      { niche: 'kitchen_pots', villa: 'Under this single copper lid at {addr}, they salt the broth too hastily and let the Penates brag from the hallway coatrack.', tenement: 'Fifty saucepans hiss at once above {addr}, yet half these new tenants burn the garlic while suitcase-guest Penates give themselves airs!' },
      { niche: 'stove_flues', villa: 'Up the soot-warm flue of {addr} comes word: the parlor plaster is cracking while temporary lodgers polish old family medals.', tenement: 'From cellar elbow to seventh-floor attic flue at {addr}, sixty-four of us trade gossip on cramped partitions and slamming tenement doors.' },
      { niche: 'cellar_pipes', villa: 'Down along the damp lead pipes of {addr}, we hear moving carts rattle past—families come and go, only the tufa stone stays Leandra.', tenement: 'Twenty-eight pipe-runs thrum beneath {addr}: fifty families flush and quarrel overhead, mere passing guests upon our ancient bedrock!' },
      { niche: 'rusty_tin_cans', villa: 'Tucked in oxidized cellar tins at {addr}, we chuckle at those trunk-riding Penates claiming their baggage is the city.', tenement: 'Inside stacked pantry tins across seven floors of {addr}, we stifle laughter at thin concrete stairs and pompous key-ring spirits.' }
    ],
    future_dream: [
      { niche: 'stove_flues', villa: 'Even when they tear this villa down at {addr}, our flue-spirits will multiply into fifty hearths and sing a taller Leandra into being.', tenement: 'Listen up the seven-story chimney throat of {addr}: tomorrow Leandra will link rooftop bake-ovens and skyward loggias over our same tufa root!' },
      { niche: 'kitchen_pots', villa: 'Beneath simmering copper lids at {addr}, we dream of a grander banquet hall rising from this exact threshold.', tenement: 'Sixteen pot-spirits gleaming at {addr} foresee fifty kitchens sharing one saffron feast when future Leandra learns true neighborly craft.' },
      { niche: 'cellar_pipes', villa: 'Our subterranean iron pipes at {addr} already hum with the fountains and cisterns Leandra will build next century.', tenement: 'Deep in {addr} bedrock, our foundation pipes dream of luminous subterranean thermal vaults warming a hundred unborn households here.' },
      { niche: 'rusty_tin_cans', villa: 'From rusty cellar canisters at {addr}, we guard the seed-spices of the city Leandra has not yet dared to become.', tenement: 'Out of oxidized tin cans at {addr}, we whisper of rooftop citrus terraces crowning all fifty flats—for we, rooted in the lot, are true Leandra!' }
    ]
  };

  const FALLBACK_PENATES_CORPUS = {
    present_critique: [
      { vessel: 'coatrack', text: 'Huff! Perched on the walnut coatrack, we watch today’s cramped landings—these cellar soot-sprites mistake damp mortar for civic pedigree!' },
      { vessel: 'trunk', text: 'From folded linen inside our banded trunk, we interrupt: modern plaster peels in a season, whereas our remembered ancestors gave Leandra its name!' },
      { vessel: 'umbrella_stand', text: 'Down by the umbrella stand ferrules, we trade dry banter on dripping tenement stairs and noisy pot-lids claiming ownership of our house.' }
    ],
    future_dream: [
      { vessel: 'key_ring', text: 'Swinging from brass key-rings, we laugh softly—the children sleeping here will become Leandra’s future magistrates and celestial cartographers wherever we move!' },
      { vessel: 'trunk', text: 'Curled in the steamer trunk, we carry the true Leandra forward: young heirs who will redesign every arch and courthouse of tomorrow’s city!' },
      { vessel: 'coatrack', text: 'High on the coatrack hooks, we murmur of honors yet to come—scholarships, symphonies, and bridges traveling with our lineage across every street!' }
    ]
  };

  let activeHearthRef = null;

  function buildBaselinePlotModels() {
    return PLOT_SITES.map(function (site) {
      return {
        id: site.id,
        index: site.index,
        address: site.address,
        foundationId: site.foundationId,
        villaName: site.villaName,
        buildingStage: 'villa_1',
        stageLabel: STAGE_SPECS.villa_1.stageLabel,
        familyCapacity: 1,
        floors: 2,
        laresCount: 4,
        nicheBreakdown: { kitchen_pots: 1, stove_flues: 1, cellar_pipes: 1, rusty_tin_cans: 1 },
        gossipChannels: 2,
        demolitionCount: 0,
        siteIdentityPreserved: true,
        dustPulse: 0
      };
    });
  }

  function computePlotRectsFromPlots(width, height, plotsInput) {
    const W = Math.max(260, Number(width) || 960);
    const H = Math.max(220, Number(height) || 540);
    const plots = Array.isArray(plotsInput) && plotsInput.length === 4 ? plotsInput : buildBaselinePlotModels();
    const padX = Math.max(8, Math.round(W * 0.026));
    const gapX = Math.max(6, Math.round(W * 0.016));
    const plotW = (W - padX * 2 - gapX * 3) / 4;
    const streetY = Math.round(H * 0.765);
    const cellarY = streetY + 6;
    const cellarH = Math.max(32, Math.round(H * 0.165));

    return plots.map(function (p, idx) {
      const x = +(padX + idx * (plotW + gapX)).toFixed(2);
      const w = +plotW.toFixed(2);
      const heightRatio = p.buildingStage === 'tenement_50' ? 0.615 : (p.buildingStage === 'walkup_12' ? 0.43 : 0.255);
      const roofPeak = p.buildingStage === 'tenement_50' ? Math.round(H * 0.038) : Math.round(H * 0.058);
      const h = Math.max(54, Math.round(H * heightRatio));
      const y = streetY - h;
      const roofY = y - roofPeak;
      const floors = p.floors || 2;
      const floorH = h / floors;
      const flueX = +(x + w * 0.68).toFixed(2);
      const wallPad = Math.max(3, Math.min(8, w * 0.055));
      const floorRects = [];

      for (let f = 0; f < floors; f++) {
        const fy = +(streetY - (f + 1) * floorH).toFixed(2);
        const fx = +(x + wallPad).toFixed(2);
        const fw = +(w - wallPad * 2).toFixed(2);
        floorRects.push({
          floorIndex: f,
          x: fx,
          y: fy,
          w: fw,
          h: +floorH.toFixed(2),
          coatX: +(fx + fw * 0.18).toFixed(2),
          trunkX: +(fx + fw * 0.36).toFixed(2),
          potX: +(fx + fw * 0.56).toFixed(2),
          flueX: flueX
        });
      }

      const midFloor = floorRects[Math.min(floors - 1, Math.floor(floors / 2))] || floorRects[0];
      const groundFloor = floorRects[0];
      const nicheAnchors = [
        { id: 'kitchen_pots', label: 'Copper Kitchen Pots', x: groundFloor.potX, y: +(groundFloor.y + groundFloor.h * 0.46).toFixed(2), floorIndex: 0 },
        { id: 'stove_flues', label: 'Warm Stove Flues', x: flueX, y: +(midFloor.y + midFloor.h * 0.5).toFixed(2), floorIndex: midFloor.floorIndex },
        { id: 'cellar_pipes', label: 'Cellar Pipes', x: +(x + w * 0.36).toFixed(2), y: +(cellarY + cellarH * 0.44).toFixed(2), floorIndex: -1 },
        { id: 'rusty_tin_cans', label: 'Rusty Tin Cans', x: +(x + w * 0.72).toFixed(2), y: +(cellarY + cellarH * 0.68).toFixed(2), floorIndex: -1 }
      ];

      return {
        x: x, y: y, w: w, h: h,
        roofY: roofY, streetY: streetY, cellarY: cellarY, cellarH: cellarH, flueX: flueX,
        plotId: p.id, id: p.id, index: idx, address: p.address,
        foundationId: p.foundationId, villaName: p.villaName,
        buildingStage: p.buildingStage, familyCapacity: p.familyCapacity,
        floors: floors, laresCount: p.laresCount, gossipChannels: p.gossipChannels,
        floorRects: floorRects, nicheAnchors: nicheAnchors
      };
    });
  }

  function createHearthAudio(initialMuted) {
    let muted = Boolean(initialMuted);
    let ctx = null;
    let bedNodes = null;

    function ensureContext() {
      if (muted) return null;
      try {
        const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!AC) return null;
        if (!ctx) ctx = new AC();
        if (ctx.state === 'suspended' && typeof ctx.resume === 'function') {
          ctx.resume().catch(function () {});
        }
        return ctx;
      } catch (_) {
        return null;
      }
    }

    function unlockAudio() {
      const c = ensureContext();
      return Boolean(c && c.state === 'running');
    }

    function syncNocturnalMurmurBed(quietude) {
      try {
        if (!ctx || muted) {
          if (bedNodes) bedNodes.gain.gain.setTargetAtTime(0.0001, ctx ? ctx.currentTime : 0, 0.08);
          return;
        }
        const q = Math.max(0, Math.min(1, Number(quietude) || 0));
        if (!bedNodes && q >= 0.55) {
          const len = Math.floor(ctx.sampleRate * 1.5);
          const buf = ctx.createBuffer(1, len, ctx.sampleRate);
          const data = buf.getChannelData(0);
          let last = 0;
          for (let i = 0; i < len; i++) {
            const white = Math.random() * 2 - 1;
            last = (last + 0.04 * white) / 1.04;
            data[i] = last * 1.8;
          }
          const src = ctx.createBufferSource();
          src.buffer = buf;
          src.loop = true;
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 265;
          filter.Q.value = 3.2;
          const gain = ctx.createGain();
          gain.gain.value = 0.0001;
          src.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          src.start();
          bedNodes = { src: src, filter: filter, gain: gain };
        }
        if (bedNodes) {
          const target = q >= 0.55 ? 0.006 + (q - 0.55) * 0.032 : 0.0001;
          bedNodes.filter.frequency.setTargetAtTime(220 + q * 110, ctx.currentTime, 0.12);
          bedNodes.gain.gain.setTargetAtTime(target, ctx.currentTime, 0.14);
        }
      } catch (_) {}
    }

    function setMuted(val) {
      muted = Boolean(val);
      syncNocturnalMurmurBed(0);
      return muted;
    }

    function toggleMute() {
      return setMuted(!muted);
    }

    function isMuted() {
      return muted;
    }

    function playDialogueCadence(speaker, vocalMode, quietude) {
      try {
        const c = ensureContext();
        if (!c || c.state !== 'running') return;
        const q = Math.max(0.2, Math.min(1, Number(quietude) || 0.75));
        const now = c.currentTime;
        const isPenates = speaker === 'penates';
        const base = isPenates ? 660 : 235;
        const pattern = vocalMode === 'interrupt' ? [1.0, 1.32]
          : vocalMode === 'huff' ? [1.14, 0.82]
          : vocalMode === 'banter' ? [1.0, 1.18, 1.08]
          : vocalMode === 'stifled_laughter' ? [1.05, 1.16, 1.09, 1.22]
          : [1.0, 1.06];
        const dur = vocalMode === 'stifled_laughter' ? 0.042 : (vocalMode === 'interrupt' ? 0.05 : 0.085);

        pattern.forEach(function (mult, idx) {
          const t0 = now + idx * (dur + 0.018);
          const osc = c.createOscillator();
          const flt = c.createBiquadFilter();
          const g = c.createGain();
          osc.type = isPenates ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(base * mult, t0);
          if (vocalMode === 'huff') osc.frequency.exponentialRampToValueAtTime(base * 0.74, t0 + dur);
          flt.type = 'bandpass';
          flt.frequency.value = isPenates ? 1180 : 380;
          flt.Q.value = isPenates ? 4.2 : 5.5;
          const amp = (0.012 + q * 0.018) * (isPenates ? 0.85 : 1.05);
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.exponentialRampToValueAtTime(amp, t0 + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
          osc.connect(flt);
          flt.connect(g);
          g.connect(c.destination);
          osc.start(t0);
          osc.stop(t0 + dur + 0.015);
        });
      } catch (_) {}
    }

    function playDemolitionRebuild(isTenement50) {
      try {
        const c = ensureContext();
        if (!c || c.state !== 'running') return;
        const now = c.currentTime;
        const notes = isTenement50 ? [110, 165, 220, 293.66, 392] : [146.8, 220, 261.6];
        notes.forEach(function (hz, i) {
          const t0 = now + i * 0.055;
          const osc = c.createOscillator();
          const g = c.createGain();
          osc.type = i === 0 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(hz, t0);
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.exponentialRampToValueAtTime(i === 0 ? 0.03 : 0.022, t0 + 0.015);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
          osc.connect(g);
          g.connect(c.destination);
          osc.start(t0);
          osc.stop(t0 + 0.18);
        });
      } catch (_) {}
    }

    function playMigrationLatch(vesselId) {
      try {
        const c = ensureContext();
        if (!c || c.state !== 'running') return;
        const now = c.currentTime;
        const freqs = vesselId === 'key_ring' ? [1046, 1318] : vesselId === 'coatrack' ? [392, 523] : vesselId === 'umbrella_stand' ? [587, 784] : [262, 440];
        freqs.forEach(function (hz, idx) {
          const t0 = now + idx * 0.045;
          const osc = c.createOscillator();
          const g = c.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(hz, t0);
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.exponentialRampToValueAtTime(0.02, t0 + 0.008);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09);
          osc.connect(g);
          g.connect(c.destination);
          osc.start(t0);
          osc.stop(t0 + 0.1);
        });
      } catch (_) {}
    }

    return {
      unlockAudio: unlockAudio,
      setMuted: setMuted,
      toggleMute: toggleMute,
      isMuted: isMuted,
      playDialogueCadence: playDialogueCadence,
      playDemolitionRebuild: playDemolitionRebuild,
      playMigrationLatch: playMigrationLatch,
      syncNocturnalMurmurBed: syncNocturnalMurmurBed
    };
  }

  function createHearthEngine(opts) {
    const options = opts || {};
    const audio = createHearthAudio(options.muted);
    let reducedMotion = Boolean(options.reducedMotion);
    let plots = buildBaselinePlotModels();
    let selectedPlotIndex = 0;
    let totalDemolitions = 0;
    let nightQuietude = 0.22;
    let dialogueCount = 0;
    let dialogueFeed = [];
    let vocalModeCounts = { murmur: 0, interrupt: 0, huff: 0, banter: 0, stifled_laughter: 0 };
    let discourseAxisCounts = { present_critique: 0, future_dream: 0 };
    let stethoscope = {
      active: false, x: -999, y: -999, radius: 88,
      plotIndex: -1, plotId: null, floorIndex: -1, nicheId: null, nicheLabel: null
    };
    let clockSec = 0;
    let dialogueTimer = 0;
    let lastWidth = 960;
    let lastHeight = 540;
    let cachedPenatesEngine = null;

    const flueEmbers = Array.from({ length: 20 }, function (_, i) {
      return { plotIndex: i % 4, phase: (i * 0.19) % 1, drift: (i % 3 - 1) * 0.35 };
    });
    const gossipPulses = Array.from({ length: 24 }, function (_, i) {
      return { plotIndex: i % 4, progress: (i * 0.13) % 1, speed: 0.26 + (i % 5) * 0.06, upward: i % 2 === 0, lane: i % 4 };
    });

    function resolvePlotIndex(plotIdOrIndex) {
      if (typeof plotIdOrIndex === 'number' && Number.isFinite(plotIdOrIndex)) {
        return Math.max(0, Math.min(3, Math.floor(plotIdOrIndex)));
      }
      if (typeof plotIdOrIndex === 'string') {
        const byId = plots.findIndex(function (p) { return p.id === plotIdOrIndex; });
        if (byId >= 0) return byId;
        const asNum = Number(plotIdOrIndex);
        if (Number.isFinite(asNum) && plotIdOrIndex.trim() !== '') {
          return Math.max(0, Math.min(3, Math.floor(asNum)));
        }
      }
      return selectedPlotIndex;
    }

    function getPlotSnapshot(p) {
      return {
        id: p.id,
        plotId: p.id,
        index: p.index,
        address: p.address,
        foundationId: p.foundationId,
        villaName: p.villaName,
        buildingStage: p.buildingStage,
        stageLabel: p.stageLabel,
        familyCapacity: p.familyCapacity,
        floors: p.floors,
        laresCount: p.laresCount,
        nicheBreakdown: Object.assign({}, p.nicheBreakdown),
        gossipChannels: p.gossipChannels,
        demolitionCount: p.demolitionCount,
        laresSiteDepartures: 0,
        siteIdentityPreserved: true
      };
    }

    function getPlotRects(width, height) {
      if (Number(width) > 0) lastWidth = Number(width);
      if (Number(height) > 0) lastHeight = Number(height);
      return computePlotRectsFromPlots(lastWidth, lastHeight, plots);
    }

    function applyStageToPlot(idx, stageKey) {
      const spec = STAGE_SPECS[stageKey] || STAGE_SPECS.tenement_50;
      const p = plots[idx];
      p.buildingStage = spec.buildingStage;
      p.stageLabel = spec.stageLabel;
      p.familyCapacity = spec.familyCapacity;
      p.floors = spec.floors;
      p.laresCount = spec.laresCount;
      p.nicheBreakdown = {
        kitchen_pots: spec.perNiche,
        stove_flues: spec.perNiche,
        cellar_pipes: spec.perNiche,
        rusty_tin_cans: spec.perNiche
      };
      p.gossipChannels = spec.gossipChannels;
      p.siteIdentityPreserved = true;
      p.dustPulse = reducedMotion ? 0.25 : 1.0;
      return p;
    }

    function setPlotStage(plotIdOrIndex, stage) {
      const idx = resolvePlotIndex(plotIdOrIndex);
      const p = applyStageToPlot(idx, stage);
      audio.playDemolitionRebuild(p.buildingStage === 'tenement_50');
      if (typeof options.onDemolishRebuild === 'function') {
        options.onDemolishRebuild(getPlotSnapshot(p), getState());
      }
      return getPlotSnapshot(p);
    }

    function demolishTo50FamilyBlock(plotIdOrIndex) {
      const idx = resolvePlotIndex(plotIdOrIndex);
      const p = plots[idx];
      p.demolitionCount += 1;
      totalDemolitions += 1;
      applyStageToPlot(idx, 'tenement_50');
      audio.playDemolitionRebuild(true);
      if (typeof options.onDemolishRebuild === 'function') {
        options.onDemolishRebuild(getPlotSnapshot(p), getState());
      }
      return getPlotSnapshot(p);
    }

    function demolishAllToTenements() {
      for (let i = 0; i < plots.length; i++) {
        plots[i].demolitionCount += 1;
        totalDemolitions += 1;
        applyStageToPlot(i, 'tenement_50');
      }
      audio.playDemolitionRebuild(true);
      if (typeof options.onDemolishRebuild === 'function') {
        options.onDemolishRebuild(getPlotSnapshot(plots[selectedPlotIndex]), getState());
      }
      return getState();
    }

    function selectPlot(plotIdOrIndex) {
      selectedPlotIndex = resolvePlotIndex(plotIdOrIndex);
      return getPlotSnapshot(plots[selectedPlotIndex]);
    }

    function chooseNextVocalMode(preferred, beatIdx) {
      if (beatIdx < 6) {
        const missing = VOCAL_MODES.find(function (m) { return vocalModeCounts[m] === 0; });
        if (missing && (beatIdx >= 4 || !preferred || vocalModeCounts[preferred] > 0)) return missing;
      }
      if (preferred && VOCAL_MODES.indexOf(preferred) >= 0) return preferred;
      return VOCAL_MODES[beatIdx % VOCAL_MODES.length];
    }

    function chooseNextAxis(preferred, beatIdx) {
      if (beatIdx < 6) {
        const missingAx = DISCOURSE_AXES.find(function (a) { return discourseAxisCounts[a] === 0; });
        if (missingAx && (beatIdx >= 3 || !preferred || discourseAxisCounts[preferred] > 0)) return missingAx;
      }
      if (preferred && DISCOURSE_AXES.indexOf(preferred) >= 0) return preferred;
      return DISCOURSE_AXES[beatIdx % DISCOURSE_AXES.length];
    }

    function advanceDialogueExchange(penatesEngineOptional, silentAudio) {
      if (penatesEngineOptional) cachedPenatesEngine = penatesEngineOptional;
      const beatIdx = dialogueCount;
      const speaker = beatIdx % 2 === 0 ? 'lares' : 'penates';
      const plot = plots[(selectedPlotIndex + Math.floor(beatIdx / 2)) % 4];
      let nicheOrVessel = 'stove_flues';
      let glyph = '⌇';
      let vocalMode = VOCAL_MODES[beatIdx % VOCAL_MODES.length];
      let axis = DISCOURSE_AXES[beatIdx % DISCOURSE_AXES.length];
      let text = '';

      if (speaker === 'lares') {
        axis = chooseNextAxis(DISCOURSE_AXES[(beatIdx >> 1) % 2], beatIdx);
        vocalMode = chooseNextVocalMode(VOCAL_MODES[beatIdx % 5], beatIdx);
        const bank = LARES_CORPUS[axis];
        const tpl = bank[Math.floor(beatIdx / 2) % bank.length];
        nicheOrVessel = tpl.niche;
        const nicheMeta = LARES_NICHES.find(function (n) { return n.id === nicheOrVessel; }) || LARES_NICHES[0];
        glyph = nicheMeta.glyph;
        const raw = plot.buildingStage === 'tenement_50' ? tpl.tenement : tpl.villa;
        text = raw.replace(/\{addr\}/g, plot.address);
      } else {
        const ext = cachedPenatesEngine && typeof cachedPenatesEngine.getNocturnalUtterance === 'function'
          ? cachedPenatesEngine.getNocturnalUtterance(beatIdx, { plotId: plot.id, nightQuietude: nightQuietude })
          : null;
        if (ext && ext.text) {
          nicheOrVessel = ext.vesselId || ext.nicheOrVessel || 'trunk';
          vocalMode = chooseNextVocalMode(ext.vocalMode, beatIdx);
          axis = chooseNextAxis(ext.axis, beatIdx);
          text = ext.text;
        } else {
          axis = chooseNextAxis(DISCOURSE_AXES[beatIdx % 2], beatIdx);
          vocalMode = chooseNextVocalMode(VOCAL_MODES[beatIdx % 5], beatIdx);
          const pBank = FALLBACK_PENATES_CORPUS[axis];
          const item = pBank[Math.floor(beatIdx / 2) % pBank.length];
          nicheOrVessel = item.vessel;
          text = item.text;
        }
        glyph = nicheOrVessel === 'coatrack' ? 'Ψ' : nicheOrVessel === 'umbrella_stand' ? '⌆' : nicheOrVessel === 'key_ring' ? '⚷' : '▣';
      }

      dialogueCount += 1;
      vocalModeCounts[vocalMode] = (vocalModeCounts[vocalMode] || 0) + 1;
      discourseAxisCounts[axis] = (discourseAxisCounts[axis] || 0) + 1;
      const entry = {
        id: 'beat_' + dialogueCount,
        beatIndex: beatIdx,
        speaker: speaker,
        plotId: plot.id,
        plotAddress: plot.address,
        nicheOrVessel: nicheOrVessel,
        glyph: glyph,
        vocalMode: vocalMode,
        axis: axis,
        text: text,
        trueEssenceWinner: null
      };
      dialogueFeed.push(entry);
      if (dialogueFeed.length > 36) dialogueFeed.shift();
      if (!silentAudio) audio.playDialogueCadence(speaker, vocalMode, nightQuietude);
      if (typeof options.onDialogueBeat === 'function') options.onDialogueBeat(entry);
      return entry;
    }

    function setNightQuietude(val0to1, penatesEngineOptional) {
      if (penatesEngineOptional) cachedPenatesEngine = penatesEngineOptional;
      const wasListening = nightQuietude >= 0.55;
      const clamped = Math.max(0, Math.min(1, Number(val0to1) || 0));
      nightQuietude = +clamped.toFixed(3);
      const nowListening = nightQuietude >= 0.55;
      audio.syncNocturnalMurmurBed(nightQuietude);

      if (nowListening && (!wasListening || dialogueCount < 6)) {
        for (let i = 0; i < 6; i++) {
          advanceDialogueExchange(cachedPenatesEngine, i > 0);
        }
        while (VOCAL_MODES.some(function (m) { return vocalModeCounts[m] === 0; }) ||
               DISCOURSE_AXES.some(function (a) { return discourseAxisCounts[a] === 0; })) {
          advanceDialogueExchange(cachedPenatesEngine, true);
        }
      }
      if (typeof options.onQuietudeChange === 'function') {
        options.onQuietudeChange(nightQuietude, getState());
      }
      return getState();
    }

    function toggleNightListening(penatesEngineOptional) {
      const target = nightQuietude >= 0.55 ? 0.18 : 0.92;
      return setNightQuietude(target, penatesEngineOptional);
    }

    function getNicheGossipSnippet(plot, nicheId) {
      const multi = plot.buildingStage === 'tenement_50';
      if (nicheId === 'kitchen_pots') {
        return multi
          ? '16 pot-Lares compare fifty simmering ragu pots above ' + plot.address + '; Penates are mere passing boarders.'
          : 'A copper-pot Lar critiques the villa soup and eyes the newcomer trunk in ' + plot.address + '.';
      }
      if (nicheId === 'stove_flues') {
        return multi
          ? '16 flue-Lares relay cellar-to-attic whispers across 7 floors (' + plot.gossipChannels + ' channels).'
          : 'Soot-warm flue Lar carries hearth sighs from ground kitchen to upper chamber.';
      }
      if (nicheId === 'cellar_pipes') {
        return multi
          ? '16 pipe-Lares hum along tufa bedrock (' + plot.foundationId + '), unchanged despite fifty flats overhead.'
          : 'Subterranean pipe Lar guards ' + plot.foundationId + ' beneath the quiet garden villa.';
      }
      return multi
        ? '16 tin-can Lares stifle ironic laughter in oxidized pantry canisters across ' + plot.address + '.'
        : 'Rusty tin-can Lar hoards old spice-scents in the cool cellar alcove of ' + plot.address + '.';
    }

    function hitTestLares(px, py, width, height) {
      if (!Number.isFinite(px) || !Number.isFinite(py)) return null;
      const rects = getPlotRects(width, height);
      for (let i = 0; i < rects.length; i++) {
        const r = rects[i];
        const p = plots[i];
        for (let j = 0; j < r.nicheAnchors.length; j++) {
          const na = r.nicheAnchors[j];
          const dx = px - na.x;
          const dy = py - na.y;
          if (dx * dx + dy * dy <= 24 * 24) {
            return {
              kind: 'lares_niche',
              species: 'lares',
              plotId: p.id,
              plotIndex: p.index,
              nicheId: na.id,
              nicheLabel: na.label,
              buildingStage: p.buildingStage,
              familyCapacity: p.familyCapacity,
              laresCount: p.laresCount,
              gossipSnippet: getNicheGossipSnippet(p, na.id)
            };
          }
        }
        for (let f = 0; f < r.floorRects.length; f++) {
          const fr = r.floorRects[f];
          const fMidY = fr.y + fr.h * 0.52;
          if (Math.hypot(px - fr.potX, py - fMidY) <= 16) {
            return {
              kind: 'lares_niche', species: 'lares', plotId: p.id, plotIndex: p.index,
              nicheId: 'kitchen_pots', nicheLabel: 'Copper Kitchen Pots',
              buildingStage: p.buildingStage, familyCapacity: p.familyCapacity,
              laresCount: p.laresCount, gossipSnippet: getNicheGossipSnippet(p, 'kitchen_pots')
            };
          }
          if (Math.abs(px - fr.flueX) <= 11 && py >= fr.y && py <= fr.y + fr.h) {
            return {
              kind: 'lares_niche', species: 'lares', plotId: p.id, plotIndex: p.index,
              nicheId: 'stove_flues', nicheLabel: 'Warm Stove Flues',
              buildingStage: p.buildingStage, familyCapacity: p.familyCapacity,
              laresCount: p.laresCount, gossipSnippet: getNicheGossipSnippet(p, 'stove_flues')
            };
          }
        }
      }
      for (let i = 0; i < rects.length; i++) {
        const r = rects[i];
        const p = plots[i];
        if (px >= r.x && px <= r.x + r.w && py >= r.roofY - 12 && py <= r.cellarY + r.cellarH + 10) {
          return {
            kind: 'plot_lot',
            plotId: p.id,
            plotIndex: p.index,
            buildingStage: p.buildingStage,
            familyCapacity: p.familyCapacity
          };
        }
      }
      return null;
    }

    function setStethoscopePoint(px, py, width, height) {
      if (px == null || py == null || !Number.isFinite(px) || !Number.isFinite(py) || px < -100 || py < -100) {
        stethoscope = {
          active: false, x: -999, y: -999, radius: 88,
          plotIndex: -1, plotId: null, floorIndex: -1, nicheId: null, nicheLabel: null
        };
        return Object.assign({}, stethoscope);
      }
      const rects = getPlotRects(width, height);
      const hit = hitTestLares(px, py, width, height);
      let fIdx = -1;
      let pIdx = hit ? hit.plotIndex : -1;
      if (pIdx >= 0 && rects[pIdx]) {
        const r = rects[pIdx];
        for (let f = 0; f < r.floorRects.length; f++) {
          const fr = r.floorRects[f];
          if (py >= fr.y && py <= fr.y + fr.h) { fIdx = f; break; }
        }
      }
      stethoscope = {
        active: true,
        x: +px.toFixed(1),
        y: +py.toFixed(1),
        radius: 88,
        plotIndex: pIdx,
        plotId: pIdx >= 0 ? plots[pIdx].id : null,
        floorIndex: fIdx,
        nicheId: hit && hit.kind === 'lares_niche' ? hit.nicheId : null,
        nicheLabel: hit && hit.kind === 'lares_niche' ? hit.nicheLabel : null
      };
      return Object.assign({}, stethoscope);
    }

    function step(dtSec, penatesEngineOptional, rmFlag) {
      if (penatesEngineOptional) cachedPenatesEngine = penatesEngineOptional;
      if (typeof rmFlag === 'boolean') reducedMotion = rmFlag;
      const dt = Math.max(0, Math.min(0.12, Number(dtSec) || 0.016));
      const motionScale = reducedMotion ? 0.15 : 1.0;
      clockSec += dt * motionScale;

      for (let i = 0; i < plots.length; i++) {
        if (plots[i].dustPulse > 0) {
          plots[i].dustPulse = Math.max(0, plots[i].dustPulse - dt * (reducedMotion ? 2.5 : 0.85));
        }
      }
      for (let i = 0; i < flueEmbers.length; i++) {
        flueEmbers[i].phase = (flueEmbers[i].phase + dt * 0.34 * motionScale) % 1;
      }
      for (let i = 0; i < gossipPulses.length; i++) {
        gossipPulses[i].progress = (gossipPulses[i].progress + dt * gossipPulses[i].speed * motionScale) % 1;
      }
      if (nightQuietude >= 0.55) {
        dialogueTimer += dt;
        if (dialogueTimer >= 2.2) {
          dialogueTimer = 0;
          advanceDialogueExchange(cachedPenatesEngine, false);
        }
      } else {
        dialogueTimer = 0;
      }
    }

    function visibilityAt(px, py) {
      let vis = nightQuietude >= 0.55 ? Math.min(1, 0.45 + (nightQuietude - 0.55) * 1.25) : 0;
      if (stethoscope.active) {
        const d = Math.hypot(px - stethoscope.x, py - stethoscope.y);
        if (d <= stethoscope.radius) {
          vis = Math.max(vis, Math.min(1, 1.08 - (d / stethoscope.radius) * 0.55));
        }
      }
      return vis;
    }

    function drawLarSpirit(ctx, sx, sy, vis, hue, phase, rm) {
      if (vis <= 0.05) {
        ctx.fillStyle = 'rgba(200, 109, 59, 0.28)';
        ctx.fillRect(sx - 0.8, sy - 0.8, 1.6, 1.6);
        return;
      }
      ctx.save();
      const pulse = rm ? 0.5 : 0.5 + 0.5 * Math.sin(phase * 6.283);
      const sz = 2.4 + vis * 2.6;
      ctx.strokeStyle = hue;
      ctx.globalAlpha = vis * (0.28 + pulse * 0.28);
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(sx, sy, sz + 2.2 + pulse * 3.2, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = Math.min(1, 0.55 + vis * 0.45);
      ctx.fillStyle = hue;
      ctx.beginPath();
      ctx.moveTo(sx, sy - sz * 1.15);
      ctx.lineTo(sx + sz * 0.72, sy + sz * 0.65);
      ctx.lineTo(sx - sz * 0.72, sy + sz * 0.65);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = PALETTE.trunkLinen;
      ctx.beginPath();
      ctx.arc(sx, sy - sz * 0.25, Math.max(1.0, sz * 0.28), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function renderCutaway(ctx, width, height, renderOpts) {
      if (!ctx) return;
      const W = Math.max(260, Number(width) || lastWidth);
      const H = Math.max(220, Number(height) || lastHeight);
      const ro = renderOpts || {};
      const selIdx = typeof ro.selectedPlotIndex === 'number' ? ro.selectedPlotIndex : selectedPlotIndex;
      const t = typeof ro.timeSec === 'number' ? ro.timeSec : clockSec;
      const rm = typeof ro.reducedMotion === 'boolean' ? ro.reducedMotion : reducedMotion;
      const rects = getPlotRects(W, H);
      const streetY = rects[0].streetY;

      ctx.save();
      const skyGrad = ctx.createLinearGradient(0, 0, 0, streetY);
      skyGrad.addColorStop(0, nightQuietude >= 0.55 ? '#060a12' : PALETTE.nightSlate);
      skyGrad.addColorStop(1, nightQuietude >= 0.55 ? '#111b2d' : '#1b2840');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      const starAlpha = 0.22 + nightQuietude * 0.62;
      ctx.fillStyle = PALETTE.trunkLinen;
      for (let s = 0; s < 26; s++) {
        const sx = ((s * 137.5) % (W - 20)) + 10;
        const sy = ((s * 61.3) % Math.max(40, streetY * 0.48)) + 8;
        const tw = rm ? 1 : (0.65 + 0.35 * Math.sin(t * 1.9 + s));
        ctx.globalAlpha = starAlpha * tw;
        ctx.fillRect(sx, sy, s % 4 === 0 ? 2 : 1.3, s % 4 === 0 ? 2 : 1.3);
      }
      ctx.globalAlpha = 0.45 + nightQuietude * 0.45;
      ctx.fillStyle = PALETTE.trunkLinen;
      ctx.beginPath();
      ctx.arc(W * 0.88, H * 0.085, Math.max(9, Math.min(16, W * 0.014)), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = nightQuietude >= 0.55 ? '#070c15' : PALETTE.nightSlate;
      ctx.beginPath();
      ctx.arc(W * 0.88 + 4.5, H * 0.085 - 2, Math.max(8, Math.min(14.5, W * 0.013)), 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.fillStyle = '#090e17';
      ctx.fillRect(0, streetY, W, H - streetY);
      ctx.fillStyle = PALETTE.mortarAsh;
      ctx.fillRect(0, streetY - 2, W, 7);
      ctx.strokeStyle = 'rgba(239, 229, 209, 0.14)';
      ctx.lineWidth = 1;
      for (let cx = 8; cx < W; cx += 22) {
        ctx.strokeRect(cx, streetY - 1, 16, 4);
      }

      for (let i = 0; i < rects.length; i++) {
        const r = rects[i];
        const p = plots[i];
        const isSel = i === selIdx;
        const isTenement = p.buildingStage === 'tenement_50';

        ctx.fillStyle = '#101826';
        ctx.strokeStyle = isSel ? PALETTE.copperPot : PALETTE.mortarAsh;
        ctx.lineWidth = isSel ? 1.8 : 1.1;
        ctx.fillRect(r.x + 2, r.cellarY, r.w - 4, r.cellarH);
        ctx.strokeRect(r.x + 2, r.cellarY, r.w - 4, r.cellarH);

        ctx.strokeStyle = PALETTE.tinPatina;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.moveTo(r.x + 7, r.cellarY + r.cellarH * 0.42);
        ctx.lineTo(r.flueX, r.cellarY + r.cellarH * 0.42);
        ctx.lineTo(r.flueX, r.cellarY + 2);
        ctx.stroke();

        const canCount = isTenement ? 5 : 2;
        for (let c = 0; c < canCount; c++) {
          const canX = r.x + r.w * 0.62 + c * Math.min(9, r.w * 0.065);
          const canY = r.cellarY + r.cellarH * 0.62;
          ctx.fillStyle = PALETTE.rustCan;
          ctx.fillRect(canX, canY, 5.5, 7.5);
          ctx.fillStyle = PALETTE.tinPatina;
          ctx.fillRect(canX, canY, 5.5, 1.6);
        }

        ctx.fillStyle = PALETTE.wallSlate;
        ctx.fillRect(r.x, r.y, r.w, r.h);
        ctx.strokeStyle = isSel ? PALETTE.keyBrass : PALETTE.mortarAsh;
        ctx.lineWidth = isSel ? 2 : 1.2;
        ctx.strokeRect(r.x, r.y, r.w, r.h);

        ctx.fillStyle = '#8b3f29';
        ctx.beginPath();
        ctx.moveTo(r.x - 3, r.y);
        ctx.lineTo(r.x + r.w * 0.5, r.roofY);
        ctx.lineTo(r.x + r.w + 3, r.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = PALETTE.copperPot;
        ctx.lineWidth = 1.1;
        ctx.stroke();

        ctx.fillStyle = '#2a1d21';
        ctx.fillRect(r.flueX - 4.5, r.roofY - 8, 9, r.cellarY + r.cellarH * 0.42 - (r.roofY - 8));
        ctx.strokeStyle = 'rgba(226, 76, 44, 0.42)';
        ctx.lineWidth = 1;
        ctx.strokeRect(r.flueX - 4.5, r.roofY - 8, 9, r.h + ( r.y - r.roofY ) + 14);

        for (let f = 0; f < r.floorRects.length; f++) {
          const fr = r.floorRects[f];
          ctx.fillStyle = f % 2 === 0 ? '#1b273c' : '#182336';
          ctx.fillRect(fr.x, fr.y + 1.5, fr.w, Math.max(4, fr.h - 2.5));
          ctx.fillStyle = PALETTE.mortarAsh;
          ctx.fillRect(r.x, fr.y, r.w, 1.8);

          if (isTenement) {
            ctx.strokeStyle = 'rgba(38, 52, 77, 0.85)';
            ctx.beginPath();
            ctx.moveTo(fr.x + fr.w * 0.45, fr.y + 2);
            ctx.lineTo(fr.x + fr.w * 0.45, fr.y + fr.h);
            ctx.stroke();
          }

          const hearthY = fr.y + fr.h - 6;
          ctx.fillStyle = PALETTE.hearthEmber;
          ctx.globalAlpha = 0.58 + 0.25 * Math.sin(t * 3.1 + i + f);
          ctx.fillRect(fr.flueX - 3.2, hearthY - 2, 6.4, 4.5);
          ctx.globalAlpha = 1;

          const potsToDraw = isTenement ? 2 : 1;
          for (let pk = 0; pk < potsToDraw; pk++) {
            const px = fr.potX + pk * 7.5 - (isTenement ? 3 : 0);
            const py = fr.y + fr.h * 0.52;
            ctx.fillStyle = PALETTE.copperPot;
            ctx.beginPath();
            ctx.arc(px, py, Math.max(2.3, Math.min(4.2, fr.h * 0.16)), 0, Math.PI, false);
            ctx.fill();
            ctx.fillStyle = PALETTE.keyBrass;
            ctx.fillRect(px - 3, py - 1.4, 6, 1.3);
            drawLarSpirit(ctx, px, py - 2.5, visibilityAt(px, py), PALETTE.copperPot, t * 0.7 + f * 0.23 + pk, rm);
          }
          drawLarSpirit(ctx, fr.flueX, fr.y + fr.h * 0.42, visibilityAt(fr.flueX, fr.y + fr.h * 0.42), PALETTE.hearthEmber, t * 0.85 + f * 0.31, rm);
        }

        const gossipDensity = isTenement ? 6 : 2;
        for (let gp = 0; gp < gossipDensity; gp++) {
          const pulse = gossipPulses[(i * 6 + gp) % gossipPulses.length];
          const spanTop = r.y + 6;
          const spanBot = r.cellarY + r.cellarH * 0.42;
          const gy = pulse.upward ? spanBot - pulse.progress * (spanBot - spanTop) : spanTop + pulse.progress * (spanBot - spanTop);
          ctx.fillStyle = gp % 2 === 0 ? PALETTE.hearthEmber : PALETTE.copperPot;
          ctx.globalAlpha = 0.38 + nightQuietude * 0.52;
          ctx.beginPath();
          ctx.arc(r.flueX + (gp % 2 === 0 ? -1.5 : 1.5), gy, isTenement ? 2.1 : 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        }

        drawLarSpirit(ctx, r.nicheAnchors[2].x, r.nicheAnchors[2].y, visibilityAt(r.nicheAnchors[2].x, r.nicheAnchors[2].y), PALETTE.tinPatina, t * 0.6 + i, rm);
        drawLarSpirit(ctx, r.nicheAnchors[3].x, r.nicheAnchors[3].y, visibilityAt(r.nicheAnchors[3].x, r.nicheAnchors[3].y), PALETTE.rustCan, t * 0.75 + i, rm);

        if (p.dustPulse > 0.01) {
          ctx.fillStyle = 'rgba(239, 229, 209, ' + (p.dustPulse * 0.34).toFixed(3) + ')';
          ctx.fillRect(r.x - 4, r.y - 4, r.w + 8, r.h + 8);
        }

        ctx.fillStyle = 'rgba(239, 229, 209, 0.78)';
        ctx.font = Math.max(9, Math.min(11, Math.round(W * 0.0095))) + 'px Georgia, serif';
        ctx.textAlign = 'center';
        const badge = (i + 1) + ' · ' + (isTenement ? '50-Fam (' + p.laresCount + ' Lares)' : p.buildingStage === 'walkup_12' ? '12-Fam' : '1-Fam Villa');
        ctx.fillText(badge, r.x + r.w * 0.5, r.cellarY + r.cellarH + 13);
      }

      for (let e = 0; e < flueEmbers.length; e++) {
        const em = flueEmbers[e];
        const r = rects[em.plotIndex];
        const ey = r.roofY - 8 - em.phase * 22;
        const ex = r.flueX + Math.sin(em.phase * 5 + e) * 4;
        ctx.fillStyle = PALETTE.hearthEmber;
        ctx.globalAlpha = (1 - em.phase) * 0.65;
        ctx.beginPath();
        ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (stethoscope.active) {
        ctx.strokeStyle = PALETTE.keyBrass;
        ctx.lineWidth = 1.6;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.arc(stethoscope.x, stethoscope.y, stethoscope.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(217, 180, 91, 0.09)';
        ctx.fill();
        ctx.strokeStyle = PALETTE.copperPot;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(stethoscope.x, stethoscope.y, 18, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    function getState() {
      let tenement50Count = 0;
      let totalFamilyCapacity = 0;
      let laresTotalCount = 0;
      let totalGossipChannels = 0;
      const nicheCounts = { kitchen_pots: 0, stove_flues: 0, cellar_pipes: 0, rusty_tin_cans: 0 };

      const plotSnaps = plots.map(function (p) {
        if (p.buildingStage === 'tenement_50') tenement50Count += 1;
        totalFamilyCapacity += p.familyCapacity;
        laresTotalCount += p.laresCount;
        totalGossipChannels += p.gossipChannels;
        nicheCounts.kitchen_pots += p.nicheBreakdown.kitchen_pots;
        nicheCounts.stove_flues += p.nicheBreakdown.stove_flues;
        nicheCounts.cellar_pipes += p.nicheBreakdown.cellar_pipes;
        nicheCounts.rusty_tin_cans += p.nicheBreakdown.rusty_tin_cans;
        return getPlotSnapshot(p);
      });

      return {
        plots: plotSnaps,
        selectedPlotIndex: selectedPlotIndex,
        totalPlotCount: 4,
        tenement50Count: tenement50Count,
        totalFamilyCapacity: totalFamilyCapacity,
        totalDemolitions: totalDemolitions,
        laresTotalCount: laresTotalCount,
        laresSiteDepartures: 0,
        siteIdentityPreserved: true,
        nicheTypes: ['kitchen_pots', 'stove_flues', 'cellar_pipes', 'rusty_tin_cans'],
        nicheCounts: nicheCounts,
        totalGossipChannels: totalGossipChannels,
        nightQuietude: nightQuietude,
        isNocturnalListening: nightQuietude >= 0.55,
        dialogueCount: dialogueCount,
        dialogueFeed: dialogueFeed.slice(),
        vocalModeCounts: Object.assign({}, vocalModeCounts),
        discourseAxisCounts: Object.assign({}, discourseAxisCounts),
        trueEssenceWinner: null,
        bothClaimTrueLeandra: true,
        stethoscope: Object.assign({}, stethoscope),
        muted: audio.isMuted()
      };
    }

    function reset() {
      plots = buildBaselinePlotModels();
      selectedPlotIndex = 0;
      totalDemolitions = 0;
      nightQuietude = 0.22;
      dialogueCount = 0;
      dialogueFeed = [];
      vocalModeCounts = { murmur: 0, interrupt: 0, huff: 0, banter: 0, stifled_laughter: 0 };
      discourseAxisCounts = { present_critique: 0, future_dream: 0 };
      dialogueTimer = 0;
      stethoscope = {
        active: false, x: -999, y: -999, radius: 88,
        plotIndex: -1, plotId: null, floorIndex: -1, nicheId: null, nicheLabel: null
      };
      audio.syncNocturnalMurmurBed(nightQuietude);
      return getState();
    }

    const hearth = {
      getPlotRects: getPlotRects,
      demolishTo50FamilyBlock: demolishTo50FamilyBlock,
      setPlotStage: setPlotStage,
      demolishAllToTenements: demolishAllToTenements,
      selectPlot: selectPlot,
      setNightQuietude: setNightQuietude,
      toggleNightListening: toggleNightListening,
      setStethoscopePoint: setStethoscopePoint,
      advanceDialogueExchange: advanceDialogueExchange,
      step: step,
      renderCutaway: renderCutaway,
      hitTestLares: hitTestLares,
      unlockAudio: audio.unlockAudio,
      setMuted: audio.setMuted,
      toggleMute: audio.toggleMute,
      isMuted: audio.isMuted,
      playDialogueCadence: audio.playDialogueCadence,
      playDemolitionRebuild: audio.playDemolitionRebuild,
      playMigrationLatch: audio.playMigrationLatch,
      syncNocturnalMurmurBed: audio.syncNocturnalMurmurBed,
      getState: getState,
      reset: reset
    };

    activeHearthRef = hearth;
    return hearth;
  }

  const LeandraSiteboundLares = {
    PALETTE: PALETTE,
    PLOT_SITES: PLOT_SITES,
    LARES_NICHES: LARES_NICHES,
    VOCAL_MODES: VOCAL_MODES,
    DISCOURSE_AXES: DISCOURSE_AXES,
    getPlotRects: function (width, height, plotsOptional) {
      if (activeHearthRef && !plotsOptional) return activeHearthRef.getPlotRects(width, height);
      return computePlotRectsFromPlots(width, height, plotsOptional);
    },
    createHearthEngine: createHearthEngine
  };

  globalThis.LeandraSiteboundLares = LeandraSiteboundLares;
  if (typeof window !== 'undefined') {
    window.LeandraSiteboundLares = LeandraSiteboundLares;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeandraSiteboundLares;
  }
})();
