(function (global) {
  'use strict';

  var HORIZON_MIN = 0.18;
  var HORIZON_MAX = 0.82;
  var HORIZON_DEFAULT = 0.50;
  var DESCEND_SEC = 0.9;
  var DEPOSIT_SEC = 0.3;
  var ASCEND_SEC = 0.9;
  var SOLE_AGENT = 'hooded_brothers';
  var LIVING_BLOCK_REASON = 'Only the Confraternity of the Hooded Brothers may cross the necropolis shaft.';
  var INITIAL_WHISPER = 'Sunlit guildhalls bustle above the travertine seam while yellow-parchment skeletons feast carefree in the vaults below.';

  var TRADES = [
    {
      id: 'banqueters',
      index: 0,
      label: 'Banqueters',
      relic: 'Loaded Banquet Table',
      motifs: ['Gilded Ossuary Trestle', 'Unending Fig & Wine Feast', 'Crowned Skull Symposium']
    },
    {
      id: 'trumpeters',
      index: 1,
      label: 'Trumpeters',
      relic: 'Gilded Brass Trumpet',
      motifs: ['Vaulted Brass Fanfare', 'Bell-Upward Horn Choir', 'Silent Gold Clarion']
    },
    {
      id: 'clockmakers',
      index: 2,
      label: 'Clockmakers',
      relic: 'Stopped Pendulum',
      motifs: ['Unpinned Escapement', 'Handless Marble Dial', 'Frozen Noon Chime']
    },
    {
      id: 'barbers',
      index: 3,
      label: 'Barbers',
      relic: 'Bone-Lather Brush',
      motifs: ['Cheekbone Silver Basin', 'Scented Parchment Pomade', 'Mirrored Jaw Razor']
    },
    {
      id: 'mezzo_sopranos',
      index: 4,
      label: 'Mezzo-Sopranos',
      relic: 'Unfinished Aria Score',
      motifs: ['Coda Beyond Breath', 'Vaulted Bel Canto Scroll', 'Perpetual Fermata']
    },
    {
      id: 'dancers',
      index: 5,
      label: 'Dancers',
      relic: 'Tufa Saltarello Arch',
      motifs: ['Weightless Rib Tarantella', 'Lantern Ring Whirl', 'Twin-Shadow Pavane']
    },
    {
      id: 'bank_tellers',
      index: 6,
      label: 'Bank Tellers',
      relic: 'Carefree Gilt Ledger',
      motifs: ['Forgiven Debt Abacus', 'Jubilee Coin Cascade', 'Unsealed Vault Counter']
    },
    {
      id: 'beauties',
      index: 7,
      label: 'Beauties',
      relic: 'Toothy Hand-Mirror',
      motifs: ['Lacquered Rib-Fan', 'Velvet Riband Grin', 'Twin-Gaze Silver Glass']
    }
  ];

  var TRADE_LORE = {
    banqueters: {
      singular: 'banqueter',
      whisper: 'Beneath vaulted tufa, dried banqueters raise gilt goblets around a table that never clears.'
    },
    trumpeters: {
      singular: 'trumpeter',
      whisper: 'Crowned in taut yellow skin, subterranean trumpeters lift brass bells toward the carved ceiling.'
    },
    clockmakers: {
      singular: 'clockmaker',
      whisper: 'Among tall cases below, parchment-dry clockmakers tend pendulums stilled forever at noon.'
    },
    barbers: {
      singular: 'barber',
      whisper: 'Bone-handled brushes lather dry yellow cheekbones before silver basins in the quiet arcade.'
    },
    mezzo_sopranos: {
      singular: 'mezzo-soprano',
      whisper: 'Mezzo-sopranos in velvet ribands sustain an aria unbound by mortal breath.'
    },
    dancers: {
      singular: 'dancer',
      whisper: 'Light ribs leap through the tufa saltarello arch beneath warm amber cressets.'
    },
    bank_tellers: {
      singular: 'bank teller',
      whisper: 'Behind unbolted counters, grinning tellers deal gilt coins from ledgers cleared of debt.'
    },
    beauties: {
      singular: 'beauty',
      whisper: 'Before hand-mirrors of burnished silver, toothy grins tilt beneath lacquered fans.'
    }
  };

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function roundMetric(val) {
    return Math.round(val * 10000) / 10000;
  }

  function normalizeHorizon(raw, fallback) {
    if (typeof raw !== 'number' || !Number.isFinite(raw)) {
      return fallback;
    }
    var val = raw;
    if (val > 2 && val <= 100) {
      val = val / 100;
    }
    return roundMetric(clamp(val, HORIZON_MIN, HORIZON_MAX));
  }

  function createInitialTrades() {
    var list = [];
    for (var i = 0; i < TRADES.length; i += 1) {
      var spec = TRADES[i];
      list.push({
        id: spec.id,
        index: spec.index,
        label: spec.label,
        relic: spec.relic,
        deadPractitioners: 3,
        innovatedLevel: 0,
        copiedAboveLevel: 0,
        latestMotif: null
      });
    }
    return list;
  }

  function cloneState(s) {
    return {
      year: s.year,
      horizonSplit: s.horizonSplit,
      selectedTrade: s.selectedTrade,
      soleCrossingAgent: s.soleCrossingAgent,
      livingDirectEntryAllowed: s.livingDirectEntryAllowed,
      livingEntryBlockedCount: s.livingEntryBlockedCount,
      processionsCompleted: s.processionsCompleted,
      shaftCarriage: {
        active: s.shaftCarriage.active,
        phase: s.shaftCarriage.phase,
        depth: s.shaftCarriage.depth,
        tradeId: s.shaftCarriage.tradeId,
        hoodedCount: s.shaftCarriage.hoodedCount,
        deadBrothersAmongHooded: s.shaftCarriage.deadBrothersAmongHooded
      },
      undergroundInnovations: s.undergroundInnovations,
      upperCopySyncs: s.upperCopySyncs,
      copiedInnovationsCount: s.copiedInnovationsCount,
      pendingInnovations: s.pendingInnovations.map(function (item) {
        return {
          id: item.id,
          year: item.year,
          tradeId: item.tradeId,
          motif: item.motif,
          copiedAbove: item.copiedAbove
        };
      }),
      mimesisScore: s.mimesisScore,
      mimesisDirection: s.mimesisDirection,
      hoodedDeadRatio: s.hoodedDeadRatio,
      twinVisualParity: s.twinVisualParity,
      whoIsAliveDistinguishable: s.whoIsAliveDistinguishable,
      lastWhisper: s.lastWhisper,
      trades: s.trades.map(function (t) {
        return {
          id: t.id,
          index: t.index,
          label: t.label,
          relic: t.relic,
          deadPractitioners: t.deadPractitioners,
          innovatedLevel: t.innovatedLevel,
          copiedAboveLevel: t.copiedAboveLevel,
          latestMotif: t.latestMotif
        };
      })
    };
  }

  function findTradeSpec(tradeIdOrIndex) {
    if (typeof tradeIdOrIndex === 'number' && Number.isInteger(tradeIdOrIndex)) {
      if (tradeIdOrIndex >= 0 && tradeIdOrIndex < TRADES.length) {
        return TRADES[tradeIdOrIndex];
      }
      return null;
    }
    if (typeof tradeIdOrIndex === 'string' && tradeIdOrIndex.length > 0) {
      for (var i = 0; i < TRADES.length; i += 1) {
        if (TRADES[i].id === tradeIdOrIndex) {
          return TRADES[i];
        }
      }
    }
    return null;
  }

  function createFreshState(horizonSplit, selectedTradeId) {
    return {
      year: 1,
      horizonSplit: horizonSplit,
      selectedTrade: selectedTradeId,
      soleCrossingAgent: SOLE_AGENT,
      livingDirectEntryAllowed: false,
      livingEntryBlockedCount: 0,
      processionsCompleted: 0,
      shaftCarriage: {
        active: false,
        phase: 'idle',
        depth: 0,
        tradeId: selectedTradeId,
        hoodedCount: 4,
        deadBrothersAmongHooded: 0
      },
      undergroundInnovations: 0,
      upperCopySyncs: 0,
      copiedInnovationsCount: 0,
      pendingInnovations: [],
      mimesisScore: 0,
      mimesisDirection: 'upper_to_lower',
      hoodedDeadRatio: 0,
      twinVisualParity: 0,
      whoIsAliveDistinguishable: true,
      lastWhisper: INITIAL_WHISPER,
      trades: createInitialTrades()
    };
  }

  function create(opts) {
    var options = opts && typeof opts === 'object' ? opts : {};
    var defaultSpec = findTradeSpec(options.selectedTrade) || TRADES[0];
    var defaultHorizon = normalizeHorizon(options.horizonSplit, HORIZON_DEFAULT);
    var state = createFreshState(defaultHorizon, defaultSpec.id);
    var listeners = [];
    var depositTimer = 0;
    var depositedInCurrentRun = false;

    if (typeof options.onChange === 'function') {
      listeners.push(options.onChange);
    }

    function getState() {
      return cloneState(state);
    }

    function notify() {
      var snap = cloneState(state);
      var copy = listeners.slice();
      for (var i = 0; i < copy.length; i += 1) {
        try {
          copy[i](snap);
        } catch (_err) {
          /* keep bridge resilient against listener exceptions */
        }
      }
      return snap;
    }

    function getTradeInternal(tradeIdOrIndex) {
      var spec = findTradeSpec(tradeIdOrIndex);
      var targetId = spec ? spec.id : state.selectedTrade;
      for (var i = 0; i < state.trades.length; i += 1) {
        if (state.trades[i].id === targetId) {
          return state.trades[i];
        }
      }
      return state.trades[0];
    }

    function pickNextInnovationTrade(explicitTradeId) {
      var explicitSpec = findTradeSpec(explicitTradeId);
      if (explicitSpec) {
        return getTradeInternal(explicitSpec.id);
      }
      var minLevel = Infinity;
      for (var i = 0; i < state.trades.length; i += 1) {
        if (state.trades[i].innovatedLevel < minLevel) {
          minLevel = state.trades[i].innovatedLevel;
        }
      }
      var selected = getTradeInternal(state.selectedTrade);
      if (selected.innovatedLevel <= minLevel) {
        return selected;
      }
      var startIdx = selected.index;
      for (var stepIdx = 1; stepIdx <= state.trades.length; stepIdx += 1) {
        var candidate = state.trades[(startIdx + stepIdx) % state.trades.length];
        if (candidate.innovatedLevel <= minLevel) {
          return candidate;
        }
      }
      return selected;
    }

    function recomputeCausalState() {
      var copiedCount = 0;
      var uncopiedCount = 0;
      for (var i = 0; i < state.pendingInnovations.length; i += 1) {
        if (state.pendingInnovations[i].copiedAbove) {
          copiedCount += 1;
        } else {
          uncopiedCount += 1;
        }
      }
      state.soleCrossingAgent = SOLE_AGENT;
      state.livingDirectEntryAllowed = false;
      state.copiedInnovationsCount = copiedCount;
      state.mimesisDirection = copiedCount >= 1 ? 'lower_to_upper' : 'upper_to_lower';
      var parity = Math.min(1, copiedCount / 3);
      state.mimesisScore = parity;
      state.twinVisualParity = parity;
      if (copiedCount >= 3) {
        state.hoodedDeadRatio = 1.0;
      } else {
        var rawRatio = copiedCount * 0.3 + uncopiedCount * 0.06 + state.processionsCompleted * 0.08;
        state.hoodedDeadRatio = roundMetric(Math.min(0.9, rawRatio));
      }
      state.shaftCarriage.hoodedCount = 4;
      state.shaftCarriage.deadBrothersAmongHooded = clamp(Math.round(state.hoodedDeadRatio * 4), 0, 4);
      state.whoIsAliveDistinguishable = !(copiedCount >= 3 && state.mimesisDirection === 'lower_to_upper');
    }

    function buildAscentWhisper(trade) {
      var lore = TRADE_LORE[trade.id] || TRADE_LORE.banqueters;
      if (state.hoodedDeadRatio >= 0.75) {
        return 'Pale skulls gleam beneath dark pointed cowls as four hooded brothers seat another ' + lore.singular + ' in the amber vault.';
      }
      return 'Four hooded brothers seat another dried ' + lore.singular + ' inside the ' + trade.label.toLowerCase() + ' vault and ascend the twin ropes.';
    }

    function finishActiveCarriageInternal() {
      if (!state.shaftCarriage.active) {
        return;
      }
      var trade = getTradeInternal(state.shaftCarriage.tradeId);
      if (!depositedInCurrentRun) {
        trade.deadPractitioners += 1;
        depositedInCurrentRun = true;
      }
      depositTimer = 0;
      depositedInCurrentRun = false;
      state.shaftCarriage.depth = 0;
      state.shaftCarriage.phase = 'idle';
      state.shaftCarriage.active = false;
      state.processionsCompleted += 1;
      recomputeCausalState();
      state.lastWhisper = buildAscentWhisper(trade);
    }

    function step(dtSec) {
      if (typeof dtSec !== 'number' || !Number.isFinite(dtSec) || dtSec <= 0 || !state.shaftCarriage.active) {
        return getState();
      }
      var rem = Math.min(dtSec, 10);
      var milestone = false;
      while (rem > 1e-9 && state.shaftCarriage.active) {
        var phase = state.shaftCarriage.phase;
        var trade = getTradeInternal(state.shaftCarriage.tradeId);
        if (phase === 'descending') {
          var needDown = (1 - state.shaftCarriage.depth) * DESCEND_SEC;
          if (rem < needDown) {
            state.shaftCarriage.depth = roundMetric(clamp(state.shaftCarriage.depth + rem / DESCEND_SEC, 0, 1));
            rem = 0;
          } else {
            rem -= needDown;
            state.shaftCarriage.depth = 1;
            state.shaftCarriage.phase = 'depositing';
            depositTimer = 0;
            if (!depositedInCurrentRun) {
              trade.deadPractitioners += 1;
              depositedInCurrentRun = true;
            }
            milestone = true;
          }
        } else if (phase === 'depositing') {
          if (!depositedInCurrentRun) {
            trade.deadPractitioners += 1;
            depositedInCurrentRun = true;
          }
          var needHold = DEPOSIT_SEC - depositTimer;
          if (rem < needHold) {
            depositTimer += rem;
            rem = 0;
          } else {
            rem -= needHold;
            depositTimer = DEPOSIT_SEC;
            state.shaftCarriage.phase = 'ascending';
            milestone = true;
          }
        } else if (phase === 'ascending') {
          var needUp = state.shaftCarriage.depth * ASCEND_SEC;
          if (rem < needUp) {
            state.shaftCarriage.depth = roundMetric(clamp(state.shaftCarriage.depth - rem / ASCEND_SEC, 0, 1));
            rem = 0;
          } else {
            rem = 0;
            depositTimer = 0;
            depositedInCurrentRun = false;
            state.shaftCarriage.depth = 0;
            state.shaftCarriage.phase = 'idle';
            state.shaftCarriage.active = false;
            state.processionsCompleted += 1;
            recomputeCausalState();
            state.lastWhisper = buildAscentWhisper(trade);
            milestone = true;
          }
        } else {
          state.shaftCarriage.active = false;
          state.shaftCarriage.phase = 'idle';
          rem = 0;
        }
      }
      return milestone ? notify() : getState();
    }

    function dispatchProcessionInternal(tradeId, instant) {
      var target = getTradeInternal(tradeId);
      if (state.shaftCarriage.active) {
        finishActiveCarriageInternal();
      }
      var lore = TRADE_LORE[target.id] || TRADE_LORE.banqueters;
      if (instant) {
        target.deadPractitioners += 1;
        state.processionsCompleted += 1;
        state.shaftCarriage.active = false;
        state.shaftCarriage.phase = 'idle';
        state.shaftCarriage.depth = 0;
        state.shaftCarriage.tradeId = target.id;
        depositTimer = 0;
        depositedInCurrentRun = false;
        recomputeCausalState();
        state.lastWhisper = buildAscentWhisper(target);
      } else {
        depositTimer = 0;
        depositedInCurrentRun = false;
        state.shaftCarriage.active = true;
        state.shaftCarriage.phase = 'descending';
        state.shaftCarriage.depth = 0;
        state.shaftCarriage.tradeId = target.id;
        recomputeCausalState();
        state.lastWhisper = 'Four hooded brothers lower a dried ' + lore.singular + ' toward the quiet vaults.';
      }
    }

    function dispatchProcession(tradeId, procOpts) {
      var instant = Boolean(procOpts && procOpts.instant === true);
      dispatchProcessionInternal(tradeId, instant);
      return notify();
    }

    function completeProcessionNow() {
      if (state.shaftCarriage.active) {
        finishActiveCarriageInternal();
        return notify();
      }
      return dispatchProcession(state.selectedTrade, { instant: true });
    }

    function attemptLivingEntry() {
      state.livingEntryBlockedCount += 1;
      state.lastWhisper = 'Stone portals bar the living stair; only the Confraternity of the Hooded Brothers may cross the necropolis shaft.';
      notify();
      return {
        allowed: false,
        agent: SOLE_AGENT,
        blockedCount: state.livingEntryBlockedCount,
        reason: LIVING_BLOCK_REASON
      };
    }

    function triggerUndergroundInnovationInternal(tradeId) {
      var trade = pickNextInnovationTrade(tradeId);
      var spec = findTradeSpec(trade.id) || TRADES[0];
      state.year += 1;
      state.undergroundInnovations += 1;
      trade.innovatedLevel += 1;
      var motif = spec.motifs[(trade.innovatedLevel - 1) % spec.motifs.length];
      trade.latestMotif = motif;
      state.pendingInnovations.push({
        id: state.undergroundInnovations,
        year: state.year,
        tradeId: trade.id,
        motif: motif,
        copiedAbove: false
      });
      recomputeCausalState();
      state.lastWhisper = 'Year ' + state.year + ': Down in the ' + trade.label + ' vault, the carefree dead fashion ' + motif + '.';
    }

    function triggerUndergroundInnovation(tradeId) {
      triggerUndergroundInnovationInternal(tradeId);
      return notify();
    }

    function syncUpperCopyInternal() {
      var allCopied = state.pendingInnovations.every(function (p) {
        return p.copiedAbove === true;
      });
      if (allCopied) {
        triggerUndergroundInnovationInternal();
      }
      var lastMotif = null;
      for (var i = 0; i < state.pendingInnovations.length; i += 1) {
        if (!state.pendingInnovations[i].copiedAbove) {
          state.pendingInnovations[i].copiedAbove = true;
          lastMotif = state.pendingInnovations[i].motif;
        }
      }
      for (var t = 0; t < state.trades.length; t += 1) {
        state.trades[t].copiedAboveLevel = state.trades[t].innovatedLevel;
      }
      state.upperCopySyncs += 1;
      recomputeCausalState();
      if (!state.whoIsAliveDistinguishable) {
        state.lastWhisper = 'Sunlit plazas now copy every subterranean remodel; beneath identical cowls and yellow grins, none can tell who lives and who is dead.';
      } else {
        state.lastWhisper = 'Sunlit masons take word from the hooded brothers and remodel the upper loggias after ' + (lastMotif || 'the crypt vaults') + '.';
      }
    }

    function syncUpperCopy() {
      syncUpperCopyInternal();
      return notify();
    }

    function advanceYearCycle(tradeId) {
      var target = pickNextInnovationTrade(tradeId);
      dispatchProcessionInternal(target.id, true);
      triggerUndergroundInnovationInternal(target.id);
      syncUpperCopyInternal();
      return notify();
    }

    function setHorizonSplit(ratio) {
      state.horizonSplit = normalizeHorizon(ratio, state.horizonSplit);
      return notify();
    }

    function selectTrade(tradeId) {
      var spec = findTradeSpec(tradeId);
      if (!spec) {
        return getState();
      }
      state.selectedTrade = spec.id;
      if (!state.shaftCarriage.active) {
        state.shaftCarriage.tradeId = spec.id;
      }
      var lore = TRADE_LORE[spec.id];
      if (lore) {
        state.lastWhisper = lore.whisper;
      }
      return notify();
    }

    function reset() {
      depositTimer = 0;
      depositedInCurrentRun = false;
      state = createFreshState(defaultHorizon, defaultSpec.id);
      return notify();
    }

    function onChange(fn) {
      if (typeof fn !== 'function') {
        return function () {};
      }
      listeners.push(fn);
      return function unsubscribe() {
        var idx = listeners.indexOf(fn);
        if (idx !== -1) {
          listeners.splice(idx, 1);
        }
      };
    }

    function getTrade(tradeId) {
      var target = getTradeInternal(tradeId);
      return {
        id: target.id,
        index: target.index,
        label: target.label,
        relic: target.relic,
        deadPractitioners: target.deadPractitioners,
        innovatedLevel: target.innovatedLevel,
        copiedAboveLevel: target.copiedAboveLevel,
        latestMotif: target.latestMotif
      };
    }

    return {
      TRADES: TRADES,
      getState: getState,
      getTrade: getTrade,
      step: step,
      dispatchProcession: dispatchProcession,
      completeProcessionNow: completeProcessionNow,
      attemptLivingEntry: attemptLivingEntry,
      triggerUndergroundInnovation: triggerUndergroundInnovation,
      syncUpperCopy: syncUpperCopy,
      advanceYearCycle: advanceYearCycle,
      setHorizonSplit: setHorizonSplit,
      selectTrade: selectTrade,
      reset: reset,
      onChange: onChange
    };
  }

  var api = {
    TRADES: TRADES,
    create: create
  };

  global.EusapiaHoodedBridge = api;
  if (typeof module !== 'undefined' && module && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : window);
