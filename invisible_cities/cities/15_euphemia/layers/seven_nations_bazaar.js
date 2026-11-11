/* City 15: Euphemia — Daytime Seven-Nations Bazaar, Brass Scales, Yellow-Striped Sails & Caravans */
(function (root) {
  'use strict';

  const PALETTE = {
    saffronBazaar: '#e09f3e',
    muslinGold: '#f2cc6e',
    pistachioJade: '#8ea861',
    nutmegRusset: '#8c4a2f',
    poppySlate: '#4d4659',
    indigoNight: '#131829',
    harborUltramarine: '#1d354d',
    campfireAmber: '#eb6e2d',
    emberCrimson: '#b83a28',
    cottonParchment: '#f5ede0'
  };

  const SOLAR_TURNINGS = [
    {
      id: 'vernal_equinox', index: 0, label: 'Vernal Equinox',
      seasonTag: 'Equal Day & Night · Spring Crossing',
      solarDeclinationDeg: 0, windBearing: 'ENE Monsoon Trade', skyTint: '#e6a64c',
      rates: { ginger: 1.06, cotton_bales: 0.94, pistachios: 1.22, poppy_seeds: 1.00, nutmeg: 1.10, golden_muslin: 1.14 }
    },
    {
      id: 'summer_solstice', index: 1, label: 'Summer Solstice',
      seasonTag: 'High Tropic Zenith · Longest Sun',
      solarDeclinationDeg: 23.4, windBearing: 'SSW Lagoon Breeze', skyTint: '#f2cc6e',
      rates: { ginger: 0.90, cotton_bales: 1.20, pistachios: 0.98, poppy_seeds: 1.24, nutmeg: 0.95, golden_muslin: 1.32 }
    },
    {
      id: 'autumnal_equinox', index: 2, label: 'Autumnal Equinox',
      seasonTag: 'Equal Day & Night · Harvest Balance',
      solarDeclinationDeg: 0, windBearing: 'WNW Steppe Drift', skyTint: '#d8843b',
      rates: { ginger: 1.24, cotton_bales: 1.04, pistachios: 0.92, poppy_seeds: 1.14, nutmeg: 1.26, golden_muslin: 1.02 }
    },
    {
      id: 'winter_solstice', index: 3, label: 'Winter Solstice',
      seasonTag: 'Southern Tropic Arc · Long Ember Night',
      solarDeclinationDeg: -23.4, windBearing: 'NNE Cold Sirocco', skyTint: '#b87a49',
      rates: { ginger: 1.34, cotton_bales: 1.15, pistachios: 1.18, poppy_seeds: 0.88, nutmeg: 1.35, golden_muslin: 0.96 }
    }
  ];

  const SIX_COMMODITIES = [
    { id: 'ginger', label: 'ginger', display: 'Ginger', unit: 'crates', baseValue: 12, color: '#d89236' },
    { id: 'cotton_bales', label: 'cotton bales', display: 'Cotton Bales', unit: 'bales', baseValue: 10, color: '#f5ede0' },
    { id: 'pistachios', label: 'pistachios', display: 'Pistachios', unit: 'sacks', baseValue: 15, color: '#8ea861' },
    { id: 'poppy_seeds', label: 'poppy seeds', display: 'Poppy Seeds', unit: 'amphorae', baseValue: 14, color: '#6b607a' },
    { id: 'nutmeg', label: 'nutmeg', display: 'Nutmeg', unit: 'casks', baseValue: 18, color: '#8c4a2f' },
    { id: 'golden_muslin', label: 'golden muslin', display: 'Golden Muslin', unit: 'bolts', baseValue: 22, color: '#f2cc6e' }
  ];

  const SEVEN_NATIONS = [
    {
      id: 'ormuz_shoals', index: 0, name: 'Salt-Reef Mariners of Ormuz',
      merchantName: 'Rashid al-Bahr', routeType: 'sail',
      specialtyId: 'ginger', cravesId: 'pistachios',
      berthLabel: 'West Pier I · Yellow-Striped Dhow', bannerColor: '#e09f3e'
    },
    {
      id: 'sogdian_pass', index: 1, name: 'High-Pass Drovers of Sogdiana',
      merchantName: 'Tarkhan of Samarkand', routeType: 'caravan',
      specialtyId: 'pistachios', cravesId: 'cotton_bales',
      berthLabel: 'East Arch I · Bactrian Camel Yard', bannerColor: '#8ea861'
    },
    {
      id: 'malabar_tide', index: 2, name: 'Monsoon Pilots of Malabar',
      merchantName: 'Devaki Nair', routeType: 'sail',
      specialtyId: 'cotton_bales', cravesId: 'poppy_seeds',
      berthLabel: 'Tide Mole II · Striped Lateen', bannerColor: '#f2cc6e'
    },
    {
      id: 'bactrian_steppe', index: 3, name: 'Red-Sand Caravaneers of Balkh',
      merchantName: 'Mirza Qasim', routeType: 'caravan',
      specialtyId: 'poppy_seeds', cravesId: 'nutmeg',
      berthLabel: 'East Arch II · Cistern Caravan', bannerColor: '#6b607a'
    },
    {
      id: 'banda_atolls', index: 4, name: 'Spice-Atoll Navigators of Banda',
      merchantName: 'Sulaiman Laut', routeType: 'sail',
      specialtyId: 'nutmeg', cravesId: 'golden_muslin',
      berthLabel: 'Lantern Jetty III · Saffron Lugger', bannerColor: '#8c4a2f'
    },
    {
      id: 'tigris_looms', index: 5, name: 'River-Loom Factors of Mosul',
      merchantName: 'Zaynab al-Mawsili', routeType: 'caravan',
      specialtyId: 'golden_muslin', cravesId: 'ginger',
      berthLabel: 'East Arch III · Silk Camel Train', bannerColor: '#eb6e2d'
    },
    {
      id: 'tyrian_sound', index: 6, name: 'Lighthouse Factors of Tyre',
      merchantName: 'Niketas of Tyre', routeType: 'sail',
      specialtyId: 'poppy_seeds', cravesId: 'cotton_bales',
      berthLabel: 'Outer Slip IV · Striped Felucca', bannerColor: '#b83a28'
    }
  ];

  function findCommodity(key) {
    if (typeof key === 'number') return SIX_COMMODITIES[((key % 6) + 6) % 6];
    const norm = String(key || '').trim().toLowerCase();
    return SIX_COMMODITIES.find(c => c.id === norm || c.label === norm || c.display.toLowerCase() === norm) || null;
  }

  function findNation(key) {
    if (typeof key === 'number') return SEVEN_NATIONS[((key % 7) + 7) % 7];
    const norm = String(key || '').trim().toLowerCase();
    return SEVEN_NATIONS.find(n => n.id === norm || n.name.toLowerCase() === norm) || null;
  }

  function findTurning(key) {
    if (typeof key === 'number') return SOLAR_TURNINGS[((key % 4) + 4) % 4];
    const norm = String(key || '').trim().toLowerCase();
    return SOLAR_TURNINGS.find(t => t.id === norm || t.label.toLowerCase() === norm) || null;
  }

  function createBazaarSynth(initialMuted) {
    let ctx = null;
    let noiseBuf = null;
    let muted = !!initialMuted;

    function ensureCtx() {
      if (muted) return null;
      try {
        if (!ctx) {
          const AC = root.AudioContext || root.webkitAudioContext;
          if (!AC) return null;
          ctx = new AC();
        }
        if (ctx.state === 'suspended') ctx.resume().catch(function () {});
        if (!noiseBuf && ctx) {
          noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.45), ctx.sampleRate);
          const d = noiseBuf.getChannelData(0);
          for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (d.length * 0.55));
        }
        return ctx;
      } catch (_err) {
        return null;
      }
    }

    function playScaleClink(pitchShift) {
      const ac = ensureCtx();
      if (!ac) return;
      try {
        const now = ac.currentTime;
        const mult = Math.max(0.75, Math.min(1.35, pitchShift || 1));
        [1180, 1795, 2680].forEach(function (freq, idx) {
          const osc = ac.createOscillator();
          const gain = ac.createGain();
          osc.type = idx === 1 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq * mult, now + idx * 0.018);
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(0.055 / (idx + 1), now + idx * 0.018 + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.34 + idx * 0.06);
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(now + idx * 0.018);
          osc.stop(now + 0.44 + idx * 0.06);
        });
      } catch (_e) {}
    }
    function playSailSnap() {
      const ac = ensureCtx();
      if (!ac || !noiseBuf) return;
      try {
        const now = ac.currentTime;
        const src = ac.createBufferSource();
        src.buffer = noiseBuf;
        const bp = ac.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.setValueAtTime(520, now);
        bp.frequency.exponentialRampToValueAtTime(1250, now + 0.14);
        bp.Q.value = 1.8;
        const g = ac.createGain();
        g.gain.setValueAtTime(0.08, now);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
        src.connect(bp);
        bp.connect(g);
        g.connect(ac.destination);
        src.start(now);

        const creak = ac.createOscillator();
        const cg = ac.createGain();
        creak.type = 'sawtooth';
        creak.frequency.setValueAtTime(155, now);
        creak.frequency.linearRampToValueAtTime(210, now + 0.16);
        cg.gain.setValueAtTime(0.018, now);
        cg.gain.exponentialRampToValueAtTime(0.0001, now + 0.20);
        creak.connect(cg);
        cg.connect(ac.destination);
        creak.start(now);
        creak.stop(now + 0.22);
      } catch (_e) {}
    }

    function playCaravanBells() {
      const ac = ensureCtx();
      if (!ac) return;
      try {
        const now = ac.currentTime;
        [0, 0.11].forEach(function (offset, stepIdx) {
          [615, 938, 1490].forEach(function (f, i) {
            const osc = ac.createOscillator();
            const g = ac.createGain();
            osc.type = i === 0 ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(f * (stepIdx ? 1.04 : 1), now + offset);
            g.gain.setValueAtTime(0.0001, now + offset);
            g.gain.exponentialRampToValueAtTime(0.045 / (i + 1), now + offset + 0.01);
            g.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.36);
            osc.connect(g);
            g.connect(ac.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.40);
          });
        });
      } catch (_e) {}
    }

    function playLagoonLap() {
      const ac = ensureCtx();
      if (!ac || !noiseBuf) return;
      try {
        const now = ac.currentTime;
        const src = ac.createBufferSource();
        src.buffer = noiseBuf;
        const lp = ac.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(360, now);
        const g = ac.createGain();
        g.gain.setValueAtTime(0.001, now);
        g.gain.linearRampToValueAtTime(0.045, now + 0.12);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
        src.connect(lp);
        lp.connect(g);
        g.connect(ac.destination);
        src.start(now);
      } catch (_e) {}
    }

    return {
      unlock: function () { return !!ensureCtx(); },
      setMuted: function (m) { muted = !!m; return muted; },
      isMuted: function () { return muted; },
      isReady: function () { return !!(ctx && ctx.state === 'running'); },
      playScaleClink: playScaleClink,
      playSailSnap: playSailSnap,
      playCaravanBells: playCaravanBells,
      playLagoonLap: playLagoonLap
    };
  }

  function defaultInventory() {
    return {
      ginger: 8,
      cotton_bales: 8,
      pistachios: 6,
      poppy_seeds: 6,
      nutmeg: 6,
      golden_muslin: 5
    };
  }

  function createBazaarEngine(opts) {
    const cfg = opts || {};
    const synth = createBazaarSynth(!!cfg.muted);

    let turningIndex = 0;
    let selectedNationIndex = 0;
    let offerId = 'ginger';
    let offerQty = 2;
    let requestId = 'pistachios';
    let inventory = defaultInventory();
    let ledger = [];
    let totalBarters = 0;
    let tradedCommodities = new Set();
    let tradedNations = new Set();
    let nationPulse = [0, 0, 0, 0, 0, 0, 0];
    let scaleTilt = 0;
    let scaleEquilibrium = 0;
    let scaleVelocity = 0;
    let clock = 0;
    let quote = null;

    function computeQuote() {
      const turning = SOLAR_TURNINGS[turningIndex];
      const nation = SEVEN_NATIONS[selectedNationIndex];
      const offerComm = findCommodity(offerId) || SIX_COMMODITIES[0];
      const reqComm = findCommodity(requestId) || SIX_COMMODITIES[2];
      const qty = Math.max(1, Math.min(12, Math.round(offerQty || 1)));

      const offerBonus = offerComm.id === nation.cravesId ? 1.26 : (offerComm.id === nation.specialtyId ? 0.86 : 1.0);
      const reqDiscount = reqComm.id === nation.specialtyId ? 0.82 : (reqComm.id === nation.cravesId ? 1.15 : 1.0);

      const offerUnitWorth = +(offerComm.baseValue * (turning.rates[offerComm.id] || 1) * offerBonus).toFixed(2);
      const requestUnitWorth = +(reqComm.baseValue * (turning.rates[reqComm.id] || 1) * reqDiscount).toFixed(2);
      const exchangeRatio = +(offerUnitWorth / requestUnitWorth).toFixed(2);
      const receivedQty = Math.max(1, Math.round(qty * exchangeRatio));

      const leftLoad = offerUnitWorth * qty;
      const rightLoad = requestUnitWorth * receivedQty;
      const diffNorm = (rightLoad - leftLoad) / Math.max(10, leftLoad + rightLoad);
      const unitAngle = Math.atan2(requestUnitWorth - offerUnitWorth, 32) * 0.55;
      scaleEquilibrium = Math.max(-0.36, Math.min(0.36, +(diffNorm * 0.75 + unitAngle).toFixed(4)));

      quote = {
        turningId: turning.id,
        turningLabel: turning.label,
        nationId: nation.id,
        nationName: nation.name,
        offerId: offerComm.id,
        offerLabel: offerComm.label,
        offerDisplay: offerComm.display,
        offerQty: qty,
        requestId: reqComm.id,
        requestLabel: reqComm.label,
        requestDisplay: reqComm.display,
        receivedQty: receivedQty,
        exchangeRatio: exchangeRatio,
        offerUnitWorth: offerUnitWorth,
        requestUnitWorth: requestUnitWorth,
        cravedMatch: offerComm.id === nation.cravesId,
        specialtyMatch: reqComm.id === nation.specialtyId
      };
      return quote;
    }
    function nudgeScale(impulse, pitch) {
      scaleVelocity += impulse;
      synth.playScaleClink(pitch || 1);
    }

    function setTurning(val) {
      const found = findTurning(val);
      if (!found) return computeQuote();
      turningIndex = found.index;
      const q = computeQuote();
      nudgeScale(found.solarDeclinationDeg >= 0 ? 0.85 : -0.85, 0.94 + turningIndex * 0.06);
      synth.playLagoonLap();
      return q;
    }

    function nextTurning() {
      return setTurning((turningIndex + 1) % SOLAR_TURNINGS.length);
    }

    function selectNation(val) {
      const found = findNation(val);
      if (!found) return SEVEN_NATIONS[selectedNationIndex];
      selectedNationIndex = found.index;
      nationPulse[selectedNationIndex] = 1.0;
      computeQuote();
      if (found.routeType === 'sail') synth.playSailSnap();
      else synth.playCaravanBells();
      scaleVelocity += (found.routeType === 'sail' ? -0.55 : 0.55);
      return found;
    }

    function setOffer(val, qtyOpt) {
      const found = findCommodity(val);
      if (found) {
        if (found.id === requestId) requestId = offerId;
        offerId = found.id;
      }
      if (typeof qtyOpt === 'number' && !Number.isNaN(qtyOpt)) {
        offerQty = Math.max(1, Math.min(12, Math.round(qtyOpt)));
      }
      const q = computeQuote();
      nudgeScale(-0.7, 0.96);
      return q;
    }

    function setRequest(val) {
      const found = findCommodity(val);
      if (found) {
        if (found.id === offerId) offerId = requestId;
        requestId = found.id;
      }
      const q = computeQuote();
      nudgeScale(0.7, 1.08);
      return q;
    }

    function weighPair(offerArg, reqArg, qtyArg) {
      if (offerArg && typeof offerArg === 'object') {
        if (offerArg.offerId) {
          const fo = findCommodity(offerArg.offerId);
          if (fo) offerId = fo.id;
        }
        if (offerArg.requestId) {
          const fr = findCommodity(offerArg.requestId);
          if (fr) requestId = fr.id;
        }
        if (typeof offerArg.qty === 'number') offerQty = Math.max(1, Math.min(12, Math.round(offerArg.qty)));
      } else {
        if (offerArg !== undefined && offerArg !== null) {
          const fo = findCommodity(offerArg);
          if (fo) offerId = fo.id;
        }
        if (reqArg !== undefined && reqArg !== null) {
          const fr = findCommodity(reqArg);
          if (fr) requestId = fr.id;
        }
        if (typeof qtyArg === 'number' && !Number.isNaN(qtyArg)) {
          offerQty = Math.max(1, Math.min(12, Math.round(qtyArg)));
        }
      }
      if (offerId === requestId) {
        const alt = SIX_COMMODITIES.find(function (c) { return c.id !== offerId; });
        if (alt) requestId = alt.id;
      }
      const q = computeQuote();
      nudgeScale(scaleEquilibrium >= 0 ? 1.15 : -1.15, 1.0 + q.exchangeRatio * 0.08);
      return q;
    }

    function executeBarter() {
      const q = computeQuote();
      const nation = SEVEN_NATIONS[selectedNationIndex];
      const turning = SOLAR_TURNINGS[turningIndex];
      const have = inventory[q.offerId] || 0;
      const spent = have > 0 ? Math.min(have, q.offerQty) : 0;
      const scaleFactor = have > 0 ? (spent / q.offerQty) : 0.5;
      const gained = Math.max(1, Math.round(q.receivedQty * scaleFactor));

      inventory[q.offerId] = Math.max(0, have - spent);
      inventory[q.requestId] = (inventory[q.requestId] || 0) + gained;

      totalBarters += 1;
      tradedCommodities.add(q.offerId);
      tradedCommodities.add(q.requestId);
      tradedNations.add(nation.id);
      nationPulse[nation.index] = 1.35;

      const receipt = {
        id: 'barter_' + totalBarters,
        stepNo: totalBarters,
        turningId: turning.id,
        turningLabel: turning.label,
        nationId: nation.id,
        nationName: nation.name,
        merchantName: nation.merchantName,
        routeType: nation.routeType,
        offerId: q.offerId,
        offerLabel: q.offerLabel,
        offerQty: spent > 0 ? spent : 1,
        requestId: q.requestId,
        requestLabel: q.requestLabel,
        receivedQty: gained,
        exchangeRatio: q.exchangeRatio,
        consignmentCredit: spent === 0
      };
      ledger.unshift(receipt);
      if (ledger.length > 24) ledger.length = 24;

      nudgeScale(q.exchangeRatio >= 1 ? 1.45 : -1.45, 1.14);
      if (nation.routeType === 'sail') synth.playSailSnap();
      else synth.playCaravanBells();

      return {
        ok: true,
        receipt: receipt,
        inventory: Object.assign({}, inventory),
        quote: computeQuote(),
        totalBarters: totalBarters
      };
    }

    function step(dt, env) {
      const clampedDt = Math.max(0.001, Math.min(0.1, Number(dt) || 0.016));
      const reduced = !!(env && env.reducedMotion);
      if (!reduced) clock += clampedDt;
      for (let i = 0; i < nationPulse.length; i++) {
        nationPulse[i] = reduced ? 0 : Math.max(0, nationPulse[i] - clampedDt * 0.85);
      }
      if (reduced) {
        scaleTilt = scaleEquilibrium;
        scaleVelocity = 0;
      } else {
        const accel = -26.0 * (scaleTilt - scaleEquilibrium) - 5.4 * scaleVelocity;
        scaleVelocity += accel * clampedDt;
        scaleTilt = Math.max(-0.48, Math.min(0.48, scaleTilt + scaleVelocity * clampedDt));
      }
    }

    function reset() {
      turningIndex = 0;
      selectedNationIndex = 0;
      offerId = 'ginger';
      offerQty = 2;
      requestId = 'pistachios';
      inventory = defaultInventory();
      ledger = [];
      totalBarters = 0;
      tradedCommodities = new Set();
      tradedNations = new Set();
      nationPulse = [0, 0, 0, 0, 0, 0, 0];
      scaleVelocity = 0;
      computeQuote();
      scaleTilt = scaleEquilibrium;
      return getState();
    }

    function getState() {
      if (!quote) computeQuote();
      return {
        SOLAR_TURNINGS: SOLAR_TURNINGS,
        SEVEN_NATIONS: SEVEN_NATIONS,
        SIX_COMMODITIES: SIX_COMMODITIES,
        turningIndex: turningIndex,
        turning: SOLAR_TURNINGS[turningIndex],
        selectedNationIndex: selectedNationIndex,
        selectedNation: SEVEN_NATIONS[selectedNationIndex],
        offerId: offerId,
        offerQty: offerQty,
        requestId: requestId,
        quote: Object.assign({}, quote),
        scaleTilt: scaleTilt,
        scaleEquilibrium: scaleEquilibrium,
        scaleVelocity: scaleVelocity,
        inventory: Object.assign({}, inventory),
        ledger: ledger.slice(),
        totalBarters: totalBarters,
        tradedCommodities: Array.from(tradedCommodities),
        tradedNations: Array.from(tradedNations),
        muted: synth.isMuted(),
        audioReady: synth.isReady()
      };
    }

    computeQuote();
    scaleTilt = scaleEquilibrium;
    function computeLayout(width, height, phase) {
      const w = Math.max(240, Number(width) || 800);
      const h = Math.max(200, Number(height) || 500);
      const p = phase || 'bazaar';
      const compact = w < 560;
      const hitBase = Math.max(26, Math.min(46, Math.min(w, h) * 0.068));

      const sailIndices = [0, 2, 4, 6];
      const caravanIndices = [1, 3, 5];
      const vessels = [];

      sailIndices.forEach(function (nIdx, sPos) {
        const nx = p === 'campfire'
          ? w * (0.085 + (sPos % 2) * 0.065)
          : w * (compact ? (0.12 + (sPos % 2) * 0.17) : (0.105 + (sPos % 2) * 0.145 + sPos * 0.018));
        const ny = p === 'campfire'
          ? h * (0.35 + sPos * 0.115)
          : h * (0.37 + sPos * 0.095);
        vessels.push({ nation: SEVEN_NATIONS[nIdx], x: nx, y: ny, hitR: hitBase, slot: sPos });
      });

      caravanIndices.forEach(function (nIdx, cPos) {
        const nx = p === 'campfire'
          ? w * (0.915 - (cPos % 2) * 0.065)
          : w * (compact ? (0.88 - (cPos % 2) * 0.16) : (0.885 - (cPos % 2) * 0.135 - cPos * 0.015));
        const ny = p === 'campfire'
          ? h * (0.39 + cPos * 0.13)
          : h * (0.40 + cPos * 0.118);
        vessels.push({ nation: SEVEN_NATIONS[nIdx], x: nx, y: ny, hitR: hitBase, slot: cPos });
      });

      const stalls = SIX_COMMODITIES.map(function (comm, i) {
        const sx = w * (0.115 + i * (0.77 / 5));
        const sy = h * 0.865;
        const sw = Math.max(36, Math.min(104, w * 0.118));
        const sh = Math.max(32, Math.min(58, h * 0.10));
        return { comm: comm, index: i, x: sx, y: sy, w: sw, h: sh };
      });

      const scaleX = w * 0.50;
      const fulcrumY = h * (compact ? 0.41 : 0.42);
      const baseY = h * 0.695;
      const beamHalf = Math.max(38, Math.min(96, w * 0.105));
      const chainLen = Math.max(32, Math.min(64, h * 0.115));
      const cosT = Math.cos(scaleTilt);
      const sinT = Math.sin(scaleTilt);

      return {
        w: w,
        h: h,
        compact: compact,
        vessels: vessels,
        stalls: stalls,
        scale: {
          x: scaleX,
          fulcrumY: fulcrumY,
          baseY: baseY,
          beamHalf: beamHalf,
          chainLen: chainLen,
          leftPanX: scaleX - beamHalf * cosT,
          leftPanY: fulcrumY - beamHalf * sinT + chainLen,
          rightPanX: scaleX + beamHalf * cosT,
          rightPanY: fulcrumY + beamHalf * sinT + chainLen
        }
      };
    }

    function hitTest(x, y, width, height, phase) {
      const p = phase || 'bazaar';
      const w = Math.max(240, Number(width) || 800);
      const h = Math.max(200, Number(height) || 500);

      if (p === 'voyage') {
        if (Math.hypot(x - w * 0.28, y - h * 0.62) <= Math.max(42, w * 0.085)) {
          return { type: 'sail', id: SEVEN_NATIONS[0].id, index: 0 };
        }
        if (Math.hypot(x - w * 0.74, y - h * 0.66) <= Math.max(42, w * 0.085)) {
          return { type: 'caravan', id: SEVEN_NATIONS[1].id, index: 1 };
        }
        return { type: null, id: null, index: -1 };
      }

      const layout = computeLayout(w, h, p);

      if (p === 'bazaar') {
        for (let i = 0; i < layout.stalls.length; i++) {
          const st = layout.stalls[i];
          if (Math.abs(x - st.x) <= st.w * 0.56 && Math.abs(y - st.y) <= st.h * 0.65) {
            return { type: 'commodity', id: st.comm.id, index: st.index };
          }
        }
        const sc = layout.scale;
        if (Math.hypot(x - sc.leftPanX, y - sc.leftPanY) <= 28) {
          const oc = findCommodity(offerId) || SIX_COMMODITIES[0];
          return { type: 'commodity', id: oc.id, index: SIX_COMMODITIES.indexOf(oc) };
        }
        if (Math.hypot(x - sc.rightPanX, y - sc.rightPanY) <= 28) {
          const rc = findCommodity(requestId) || SIX_COMMODITIES[2];
          return { type: 'commodity', id: rc.id, index: SIX_COMMODITIES.indexOf(rc) };
        }
      }

      for (let i = 0; i < layout.vessels.length; i++) {
        const v = layout.vessels[i];
        if (p === 'bazaar' && Math.abs(x - v.x) <= v.hitR * 0.95 && y >= v.y + v.hitR * 0.24 && y <= v.y + v.hitR * 0.92) {
          return { type: 'nation', id: v.nation.id, index: v.nation.index };
        }
        const dist = Math.hypot(x - v.x, y - (v.y - v.hitR * 0.14));
        if (dist <= v.hitR * (p === 'campfire' ? 0.82 : 0.98)) {
          return {
            type: v.nation.routeType === 'sail' ? 'sail' : 'caravan',
            id: v.nation.id,
            index: v.nation.index
          };
        }
      }

      return { type: null, id: null, index: -1 };
    }

    function drawYellowStripedBoat(ctx, v, nightMode, isSelected, pulse) {
      const sc = Math.max(0.68, Math.min(1.18, v.hitR / 36));
      const bob = Math.sin(clock * 2.1 + v.nation.index * 1.3) * (nightMode ? 1.2 : 2.6) + pulse * 3.5;
      ctx.save();
      ctx.translate(v.x, v.y + bob);
      ctx.scale(sc, sc);

      if (isSelected && !nightMode) {
        ctx.beginPath();
        ctx.ellipse(0, 6, 44, 16, 0, 0, Math.PI * 2);
        ctx.strokeStyle = PALETTE.muslinGold;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.strokeStyle = nightMode ? 'rgba(242,204,110,0.22)' : 'rgba(245,237,224,0.45)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-34, 14);
      ctx.quadraticCurveTo(0, 18, 34, 14);
      ctx.stroke();

      ctx.fillStyle = nightMode ? '#2b2024' : '#6e3924';
      ctx.beginPath();
      ctx.moveTo(-32, 2);
      ctx.lineTo(30, 0);
      ctx.lineTo(20, 13);
      ctx.lineTo(-22, 13);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = nightMode ? '#70583c' : PALETTE.saffronBazaar;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.strokeStyle = nightMode ? '#5c4b3b' : '#4a2618';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-2, 2);
      ctx.lineTo(-2, -46);
      ctx.moveTo(-24, -14);
      ctx.lineTo(22, -44);
      ctx.stroke();

      const billow = (nightMode ? 4 : 10) + pulse * 8;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(-22, -13);
      ctx.lineTo(20, -42);
      ctx.quadraticCurveTo(18 + billow, -16, 12, -2);
      ctx.closePath();
      ctx.clip();

      for (let st = -30; st < 36; st += 7) {
        ctx.fillStyle = (Math.floor((st + 30) / 7) % 2 === 0)
          ? (nightMode ? '#c8a24a' : '#ffd24c')
          : (nightMode ? '#4b3b36' : '#f7eed7');
        ctx.fillRect(st, -48, 7.4, 52);
      }
      ctx.restore();

      ctx.strokeStyle = nightMode ? 'rgba(242,204,110,0.45)' : '#b86f24';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-22, -13);
      ctx.lineTo(20, -42);
      ctx.quadraticCurveTo(18 + billow, -16, 12, -2);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = v.nation.bannerColor;
      ctx.beginPath();
      ctx.moveTo(-2, -46);
      ctx.lineTo(11, -43);
      ctx.lineTo(-2, -39);
      ctx.closePath();
      ctx.fill();

      if (!nightMode) {
        ctx.fillStyle = 'rgba(19,24,41,0.78)';
        ctx.fillRect(-26, 16, 52, 13);
        ctx.fillStyle = isSelected ? PALETTE.muslinGold : PALETTE.cottonParchment;
        ctx.font = '600 9px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('N' + (v.nation.index + 1) + ' · SAIL', 0, 25);
      }
      ctx.restore();
    }
    function drawCamelCaravan(ctx, v, nightMode, isSelected, pulse) {
      const sc = Math.max(0.68, Math.min(1.18, v.hitR / 36));
      const stride = nightMode ? 0 : Math.sin(clock * 2.6 + v.nation.index) * 1.8 - pulse * 5;
      ctx.save();
      ctx.translate(v.x + stride, v.y);
      ctx.scale(sc, sc);

      if (isSelected && !nightMode) {
        ctx.beginPath();
        ctx.ellipse(0, 8, 42, 15, 0, 0, Math.PI * 2);
        ctx.strokeStyle = PALETTE.muslinGold;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = nightMode ? 'rgba(12,14,24,0.55)' : 'rgba(92,51,34,0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 13, 30, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      const bodyFill = nightMode ? '#292233' : '#a86a38';
      ctx.fillStyle = bodyFill;
      ctx.strokeStyle = nightMode ? 'rgba(235,110,45,0.45)' : '#5c3419';
      ctx.lineWidth = 1.3;

      ctx.beginPath();
      ctx.moveTo(-22, 0);
      ctx.quadraticCurveTo(-15, -20, -6, -6);
      ctx.quadraticCurveTo(4, -22, 14, -4);
      ctx.lineTo(18, 3);
      ctx.lineTo(-18, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-19, -1);
      ctx.quadraticCurveTo(-29, -8, -28, -22);
      ctx.lineTo(-35, -24);
      ctx.lineTo(-36, -19);
      ctx.lineTo(-24, -15);
      ctx.strokeStyle = bodyFill;
      ctx.lineWidth = 5.2;
      ctx.lineCap = 'round';
      ctx.stroke();

      if (!nightMode) {
        const legSwing = Math.sin(clock * 3.2 + v.nation.index) * 2.5;
        ctx.strokeStyle = '#7c4b25';
        ctx.lineWidth = 2.6;
        [-14, -6, 7, 14].forEach(function (lx, li) {
          ctx.beginPath();
          ctx.moveTo(lx, 2);
          ctx.lineTo(lx + (li % 2 ? legSwing : -legSwing), 13);
          ctx.stroke();
        });
      }

      const spec = findCommodity(v.nation.specialtyId) || SIX_COMMODITIES[4];
      ctx.fillStyle = nightMode ? '#5e3d35' : spec.color;
      ctx.fillRect(-13, -15, 22, 9);
      ctx.strokeStyle = PALETTE.muslinGold;
      ctx.lineWidth = 1.1;
      ctx.strokeRect(-13, -15, 22, 9);

      ctx.fillStyle = PALETTE.muslinGold;
      ctx.beginPath();
      ctx.arc(-26, -12, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#6b4728';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(16, 4);
      ctx.lineTo(16, -34);
      ctx.stroke();
      ctx.fillStyle = v.nation.bannerColor;
      ctx.beginPath();
      ctx.moveTo(16, -34);
      ctx.lineTo(28, -30);
      ctx.lineTo(16, -25);
      ctx.closePath();
      ctx.fill();

      if (!nightMode) {
        ctx.fillStyle = 'rgba(19,24,41,0.78)';
        ctx.fillRect(-28, 16, 56, 13);
        ctx.fillStyle = isSelected ? PALETTE.muslinGold : PALETTE.cottonParchment;
        ctx.font = '600 9px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText('N' + (v.nation.index + 1) + ' · CAMEL', 0, 25);
      }
      ctx.restore();
    }

    function drawStallsAndBrassScale(ctx, layout) {
      const sc = layout.scale;
      const offerComm = findCommodity(offerId) || SIX_COMMODITIES[0];
      const reqComm = findCommodity(requestId) || SIX_COMMODITIES[2];

      ctx.save();
      ctx.fillStyle = '#5c3b1e';
      ctx.fillRect(sc.x - 28, sc.baseY - 6, 56, 10);
      ctx.strokeStyle = PALETTE.muslinGold;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(sc.x, sc.baseY - 6);
      ctx.lineTo(sc.x, sc.fulcrumY - 16);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(sc.x, sc.fulcrumY - 18, 9, Math.PI, 0);
      ctx.strokeStyle = PALETTE.saffronBazaar;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.translate(sc.x, sc.fulcrumY);
      ctx.rotate(scaleTilt);
      ctx.strokeStyle = PALETTE.muslinGold;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(-sc.beamHalf, 0);
      ctx.lineTo(sc.beamHalf, 0);
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -18);
      ctx.stroke();
      ctx.restore();

      [
        { px: sc.leftPanX, py: sc.leftPanY, bx: sc.x - sc.beamHalf * Math.cos(scaleTilt), by: sc.fulcrumY - sc.beamHalf * Math.sin(scaleTilt), comm: offerComm, tag: 'OFFER' },
        { px: sc.rightPanX, py: sc.rightPanY, bx: sc.x + sc.beamHalf * Math.cos(scaleTilt), by: sc.fulcrumY + sc.beamHalf * Math.sin(scaleTilt), comm: reqComm, tag: 'YIELD' }
      ].forEach(function (pan) {
        ctx.strokeStyle = 'rgba(242,204,110,0.82)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(pan.bx, pan.by);
        ctx.lineTo(pan.px - 16, pan.py);
        ctx.moveTo(pan.bx, pan.by);
        ctx.lineTo(pan.px + 16, pan.py);
        ctx.stroke();

        ctx.fillStyle = pan.comm.color;
        ctx.beginPath();
        ctx.arc(pan.px, pan.py - 3, 11, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = PALETTE.saffronBazaar;
        ctx.beginPath();
        ctx.ellipse(pan.px, pan.py, 20, 5.5, 0, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = PALETTE.cottonParchment;
        ctx.font = '600 8.5px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(pan.tag, pan.px, pan.py + 15);
      });
      ctx.restore();

      layout.stalls.forEach(function (st) {
        const active = st.comm.id === offerId || st.comm.id === requestId;
        ctx.save();
        ctx.translate(st.x, st.y);
        ctx.fillStyle = active ? 'rgba(35,28,38,0.92)' : 'rgba(24,22,34,0.82)';
        ctx.fillRect(-st.w * 0.5, -st.h * 0.5, st.w, st.h);
        ctx.strokeStyle = active ? PALETTE.muslinGold : 'rgba(224,159,62,0.48)';
        ctx.lineWidth = active ? 2 : 1.1;
        ctx.strokeRect(-st.w * 0.5, -st.h * 0.5, st.w, st.h);

        ctx.fillStyle = st.comm.color;
        ctx.fillRect(-st.w * 0.5, -st.h * 0.5, st.w, 6);
        ctx.beginPath();
        ctx.arc(0, -3, Math.min(9, st.h * 0.19), 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = PALETTE.cottonParchment;
        ctx.font = (layout.compact ? '600 8px' : '600 9.5px') + ' Georgia, serif';
        ctx.textAlign = 'center';
        ctx.fillText(st.comm.display, 0, st.h * 0.34);
        ctx.restore();
      });
    }
    function drawVoyageScene(ctx, w, h, env) {
      const swapped = Math.max(0, Math.min(6, Number(env && env.swappedCount) || 0));
      const sky = ctx.createLinearGradient(0, 0, 0, h * 0.62);
      sky.addColorStop(0, '#0b1020');
      sky.addColorStop(0.65, '#15233b');
      sky.addColorStop(1, swapped > 0 ? '#2b243c' : '#1d354d');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      const poleX = w * 0.5;
      const poleY = h * 0.24;
      const rot = clock * 0.08 + turningIndex * (Math.PI * 0.5);
      for (let s = 0; s < 34; s++) {
        const r = 22 + (s * 17) % Math.max(90, w * 0.36);
        const a = rot + s * 1.91;
        const sx = poleX + Math.cos(a) * r;
        const sy = poleY + Math.sin(a) * r * 0.48;
        if (sy > 0 && sy < h * 0.56) {
          ctx.fillStyle = s % 5 === 0 ? PALETTE.muslinGold : 'rgba(245,237,224,0.62)';
          ctx.fillRect(sx, sy, s % 5 === 0 ? 2.2 : 1.5, s % 5 === 0 ? 2.2 : 1.5);
        }
      }

      ctx.fillStyle = '#12263a';
      ctx.fillRect(0, h * 0.56, w * 0.56, h * 0.44);
      ctx.strokeStyle = swapped > 0 ? 'rgba(242,204,110,0.42)' : 'rgba(245,237,224,0.28)';
      for (let r = 0; r < 6; r++) {
        const wy = h * (0.62 + r * 0.055);
        ctx.beginPath();
        ctx.moveTo(w * 0.06, wy);
        ctx.quadraticCurveTo(w * 0.28, wy + Math.sin(clock * 1.8 + r) * 4, w * 0.50, wy);
        ctx.stroke();
      }

      ctx.fillStyle = '#1c1829';
      ctx.beginPath();
      ctx.moveTo(w * 0.44, h);
      ctx.quadraticCurveTo(w * 0.62, h * 0.54, w, h * 0.60);
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      drawYellowStripedBoat(ctx, { nation: SEVEN_NATIONS[0], x: w * 0.28, y: h * 0.63, hitR: 38 }, false, swapped > 0, 0.35);
      drawCamelCaravan(ctx, { nation: SEVEN_NATIONS[1], x: w * 0.74, y: h * 0.66, hitR: 38 }, false, swapped > 0, 0.2);

      const sway = Math.sin(clock * 1.5) * 5;
      ctx.strokeStyle = PALETTE.saffronBazaar;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.98 + sway * 0.4, 46, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    }

    function renderScene(ctx, width, height, env) {
      if (!ctx) return;
      const w = Math.max(240, Number(width) || 800);
      const h = Math.max(200, Number(height) || 500);
      const phase = (env && env.phase) || 'bazaar';

      ctx.save();
      ctx.clearRect(0, 0, w, h);

      if (phase === 'voyage') {
        drawVoyageScene(ctx, w, h, env);
        ctx.restore();
        return;
      }

      const night = phase === 'campfire';
      const turning = SOLAR_TURNINGS[turningIndex];
      const layout = computeLayout(w, h, phase);

      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.48);
      if (night) {
        skyGrad.addColorStop(0, '#0d1222');
        skyGrad.addColorStop(1, '#1c243b');
      } else {
        skyGrad.addColorStop(0, turning.skyTint);
        skyGrad.addColorStop(1, '#f4dfb8');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      const sunY = h * (0.16 - (turning.solarDeclinationDeg / 23.4) * 0.065);
      const sunX = w * (0.24 + turningIndex * 0.17);
      if (night) {
        for (let i = 0; i < 24; i++) {
          ctx.fillStyle = i % 4 === 0 ? PALETTE.muslinGold : 'rgba(245,237,224,0.55)';
          ctx.fillRect((i * 73) % w, (i * 29) % (h * 0.28), 1.8, 1.8);
        }
      } else {
        ctx.fillStyle = 'rgba(255,246,214,0.88)';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = night ? '#181d30' : '#c9883a';
      ctx.fillRect(0, h * 0.25, w, h * 0.12);
      const archCount = 7;
      const archW = w / archCount;
      for (let a = 0; a < archCount; a++) {
        ctx.fillStyle = night ? '#101424' : 'rgba(92,48,26,0.52)';
        ctx.beginPath();
        ctx.arc((a + 0.5) * archW, h * 0.35, archW * 0.32, Math.PI, 0);
        ctx.lineTo((a + 0.82) * archW, h * 0.37);
        ctx.lineTo((a + 0.18) * archW, h * 0.37);
        ctx.closePath();
        ctx.fill();
      }

      ctx.fillStyle = night ? '#14192b' : '#dfbe88';
      ctx.fillRect(0, h * 0.36, w, h * 0.64);

      ctx.fillStyle = night ? '#112236' : PALETTE.harborUltramarine;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.36);
      ctx.lineTo(w * (night ? 0.24 : 0.41), h * 0.36);
      ctx.lineTo(w * (night ? 0.19 : 0.35), h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      if (night) {
        const courtGrad = ctx.createRadialGradient(w * 0.5, h * 0.57, 18, w * 0.5, h * 0.57, Math.min(w, h) * 0.36);
        courtGrad.addColorStop(0, 'rgba(38,28,36,0.92)');
        courtGrad.addColorStop(1, 'rgba(19,24,41,0.96)');
        ctx.fillStyle = courtGrad;
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.57, w * 0.29, h * 0.24, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      layout.vessels.forEach(function (v) {
        const isSel = v.nation.index === selectedNationIndex;
        const p = nationPulse[v.nation.index] || 0;
        if (v.nation.routeType === 'sail') drawYellowStripedBoat(ctx, v, night, isSel, p);
        else drawCamelCaravan(ctx, v, night, isSel, p);
      });

      if (!night) {
        drawStallsAndBrassScale(ctx, layout);
      }

      ctx.restore();
    }

    return {
      getState: getState,
      setTurning: setTurning,
      nextTurning: nextTurning,
      selectNation: selectNation,
      setOffer: setOffer,
      setRequest: setRequest,
      weighPair: weighPair,
      executeBarter: executeBarter,
      step: step,
      renderScene: renderScene,
      hitTest: hitTest,
      setMuted: function (m) { return synth.setMuted(m); },
      unlockAudio: function () { return synth.unlock(); },
      reset: reset
    };
  }

  const api = {
    PALETTE: PALETTE,
    SOLAR_TURNINGS: SOLAR_TURNINGS,
    SEVEN_NATIONS: SEVEN_NATIONS,
    SIX_COMMODITIES: SIX_COMMODITIES,
    createBazaarEngine: createBazaarEngine
  };

  root.EuphemiaBazaarLayer = api;
  if (typeof window !== 'undefined') window.EuphemiaBazaarLayer = api;
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
