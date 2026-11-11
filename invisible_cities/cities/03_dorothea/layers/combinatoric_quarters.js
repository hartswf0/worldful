(function (global) {
  'use strict';

  var STYLE_ID = 'doro-act-scoped-styles';

  var MONOPOLIES = [
    'bergamot',
    'sturgeon roe',
    'astrolabes',
    'amethysts'
  ];

  var MONOPOLY_META = {
    'bergamot': {
      key: 'bergamot',
      code: 'BRG',
      title: 'Bergamot',
      subtitle: 'Amber-green citrus essence',
      color: '#c4d448',
      stroke: '#dfeb78',
      fillBg: 'rgba(196, 212, 72, 0.15)',
      weight: 4
    },
    'sturgeon roe': {
      key: 'sturgeon roe',
      code: 'ROE',
      title: 'Sturgeon Roe',
      subtitle: 'Obsidian-pearl caviar casks',
      color: '#9fb6cc',
      stroke: '#d4e3f0',
      fillBg: 'rgba(159, 182, 204, 0.16)',
      weight: 5
    },
    'astrolabes': {
      key: 'astrolabes',
      code: 'AST',
      title: 'Astrolabes',
      subtitle: 'Engraved brass celestial reckoners',
      color: '#e0b34c',
      stroke: '#f8d984',
      fillBg: 'rgba(224, 179, 76, 0.20)',
      weight: 7
    },
    'amethysts': {
      key: 'amethysts',
      code: 'AME',
      title: 'Amethysts',
      subtitle: 'Faceted violet quartz',
      color: '#b07ce8',
      stroke: '#d5b2fa',
      fillBg: 'rgba(176, 124, 232, 0.16)',
      weight: 6
    }
  };

  // Exact invertible 9x9 permutation matrix P in GL_9(Z):
  // Cycle decomposition: (0 4 8 1 5)(2 6 3 7), order = lcm(5, 4) = 20, det(P) = -1, diag(P) = 0.
  var SIGMA_P = [4, 5, 6, 7, 8, 0, 3, 2, 1];
  var SIGMA_P_INV = [5, 8, 7, 6, 0, 1, 2, 3, 4];

  // Canonical t = 0 exogamous marriage 9-cycle: (0 4 2 7 1 8 3 6 5), diag = 0.
  var BASE_MARRIAGE_T0 = [4, 8, 7, 6, 2, 0, 5, 1, 3];

  // Canonical t = 0 unique (primary, dowry) monopoly charters across Q1..Q9 (9 distinct ordered pairs).
  var BASE_CHARTERS_T0 = [
    ['bergamot', 'astrolabes'],
    ['astrolabes', 'amethysts'],
    ['sturgeon roe', 'bergamot'],
    ['amethysts', 'sturgeon roe'],
    ['astrolabes', 'bergamot'],
    ['bergamot', 'sturgeon roe'],
    ['sturgeon roe', 'astrolabes'],
    ['amethysts', 'bergamot'],
    ['astrolabes', 'sturgeon roe']
  ];

  // Canonical t = 0 gate state (true = drawbridge lowered / open; false = spring tensioned / raised).
  var BASE_GATES_T0 = [true, true, true, false, true, true, false];

  // Torsion vector k in GF(2)^7 for invertible affine gate evolution g(t+1) = B*g(t) xor k,
  // where B = I + S + S^2 (mod 2) and B^-1 = I + S^2 + S^3 + S^5 + S^6 (mod 2).
  var GATE_TORSION_VEC = [1, 0, 1, 0, 0, 1, 0];

  var ROMAN_GATES = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];

  // Plan geometry in 680x680 coordinate space:
  // Moat: 42..90 & 590..638; Curtain wall: 90..100 & 580..590;
  // Quarters: [100..244], [268..412], [436..580]; Canals: [244..268] (center 256), [412..436] (center 424).
  var PLAN_SIZE = 680;
  var QUARTER_BOUNDS = [
    { start: 100, end: 244, center: 172 },
    { start: 268, end: 412, center: 340 },
    { start: 436, end: 580, center: 508 }
  ];

  var TOWERS_META = [
    {
      id: 'NW',
      label: 'NW Aluminum Tower',
      x: 66,
      y: 66,
      azimuthDeg: 315,
      quarterIdx: 0,
      gateIndices: [0, 6],
      elevationM: 48.0
    },
    {
      id: 'NE',
      label: 'NE Aluminum Tower',
      x: 614,
      y: 66,
      azimuthDeg: 45,
      quarterIdx: 2,
      gateIndices: [1, 2],
      elevationM: 49.5
    },
    {
      id: 'SE',
      label: 'SE Aluminum Tower',
      x: 614,
      y: 614,
      azimuthDeg: 135,
      quarterIdx: 8,
      gateIndices: [3, 4],
      elevationM: 47.5
    },
    {
      id: 'SW',
      label: 'SW Aluminum Tower',
      x: 66,
      y: 614,
      azimuthDeg: 225,
      quarterIdx: 6,
      gateIndices: [5, 6],
      elevationM: 48.5
    }
  ];

  var GATES_META = [
    { index: 0, number: 1, id: 'Gate I', roman: 'I', side: 'North-West Sluice', wall: 'N', x: 256, y: 66, canalIds: [0] },
    { index: 1, number: 2, id: 'Gate II', roman: 'II', side: 'North-East Sluice', wall: 'N', x: 424, y: 66, canalIds: [1] },
    { index: 2, number: 3, id: 'Gate III', roman: 'III', side: 'East-North Lock', wall: 'E', x: 614, y: 256, canalIds: [2] },
    { index: 3, number: 4, id: 'Gate IV', roman: 'IV', side: 'East-South Lock', wall: 'E', x: 614, y: 424, canalIds: [3] },
    { index: 4, number: 5, id: 'Gate V', roman: 'V', side: 'South-East Causeway', wall: 'S', x: 424, y: 614, canalIds: [1] },
    { index: 5, number: 6, id: 'Gate VI', roman: 'VI', side: 'South-West Causeway', wall: 'S', x: 256, y: 614, canalIds: [0] },
    { index: 6, number: 7, id: 'Gate VII', roman: 'VII', side: 'West Caravan Bastion', wall: 'W', x: 66, y: 340, canalIds: [2, 3] }
  ];

  var CANALS_META = [
    { index: 0, id: 'canal-ns-west', axis: 'NS', label: 'West Verdigris Canal', pos: 256, gates: [0, 5, 6] },
    { index: 1, id: 'canal-ns-east', axis: 'NS', label: 'East Verdigris Canal', pos: 424, gates: [1, 4] },
    { index: 2, id: 'canal-ew-north', axis: 'EW', label: 'North Verdigris Canal', pos: 256, gates: [2, 6, 0] },
    { index: 3, id: 'canal-ew-south', axis: 'EW', label: 'South Verdigris Canal', pos: 424, gates: [3, 6, 5] }
  ];

  // Precompute deterministic 300-house & 700-chimney roof matrix for each quarter (100x3 + 200x2 = 700 chimneys).
  var QUARTER_ROOF_MATRICES = (function buildQuarterRoofMatrices() {
    var matrices = [];
    for (var q = 0; q < 9; q++) {
      var houses = [];
      for (var h = 0; h < 300; h++) {
        // gcd(37, 300) = 1 guarantees a strict bijection on 0..299:
        // exactly 100 houses have 3 flues (300) and 200 houses have 2 flues (400) => 700 chimneys.
        var u = (37 * h + 41 * q + 13) % 300;
        var flues = u < 100 ? 3 : 2;
        var rank = (53 * h + 19 * q + 7) % 300;
        houses.push({
          col: h % 20,
          row: Math.floor(h / 20),
          flues: flues,
          rank: rank,
          ridgeHorizontal: ((h + q) % 3) !== 0
        });
      }
      matrices.push(houses);
    }
    return matrices;
  })();

  function clampGeneration(val) {
    var n = Math.round(Number(val));
    if (!Number.isFinite(n)) return 0;
    if (n < -5) return -5;
    if (n > 5) return 5;
    return n;
  }

  // Compute P^t as a 9-element permutation array: out[i] = P^t(i).
  function getPermPower(t) {
    var perm = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    var steps = Math.abs(t);
    var stepMap = t >= 0 ? SIGMA_P : SIGMA_P_INV;
    for (var s = 0; s < steps; s++) {
      var next = new Array(9);
      for (var i = 0; i < 9; i++) {
        next[i] = stepMap[perm[i]];
      }
      perm = next;
    }
    return perm;
  }

  function invertPerm(perm) {
    var inv = new Array(perm.length);
    for (var i = 0; i < perm.length; i++) {
      inv[perm[i]] = i;
    }
    return inv;
  }

  // Transform canonical charters c(0) -> c(t) via invertible matrix P^t: c(t)[P^t(i)] = c(0)[i].
  function transformCharters(charters0, t) {
    var perm = getPermPower(t);
    var out = new Array(9);
    for (var i = 0; i < 9; i++) {
      out[perm[i]] = [charters0[i][0], charters0[i][1]];
    }
    return out;
  }

  // Inverse transform charters c(t) -> c(0) via P^{-t}.
  function untransformCharters(chartersT, t) {
    return transformCharters(chartersT, -t);
  }

  // Similarity transform M(t) = P^t * M(0) * (P^T)^t.
  // Because diag(M(0)) = 0, diag(M(t)) = 0 for ALL integers t (strict exogamy invariant!).
  function transformMarriageMap(marriage0, t) {
    var perm = getPermPower(t);
    var inv = invertPerm(perm);
    var out = new Array(9);
    for (var q = 0; q < 9; q++) {
      out[q] = perm[marriage0[inv[q]]];
    }
    return out;
  }

  function untransformMarriageMap(marriageT, t) {
    return transformMarriageMap(marriageT, -t);
  }

  // Forward GF(2)^7 gate step: g_next = (I + S + S^2)*g xor k.
  function stepGatesForward(bits) {
    var next = new Array(7);
    for (var i = 0; i < 7; i++) {
      var b = bits[i] ^ bits[(i + 1) % 7] ^ bits[(i + 2) % 7] ^ GATE_TORSION_VEC[i];
      next[i] = b & 1;
    }
    return next;
  }

  // Exact inverse GF(2)^7 gate step: g_prev = (I + S^2 + S^3 + S^5 + S^6)*(g xor k).
  function stepGatesBackward(bits) {
    var unxored = new Array(7);
    for (var j = 0; j < 7; j++) {
      unxored[j] = (bits[j] ^ GATE_TORSION_VEC[j]) & 1;
    }
    var prev = new Array(7);
    for (var i = 0; i < 7; i++) {
      var b =
        unxored[i] ^
        unxored[(i + 2) % 7] ^
        unxored[(i + 3) % 7] ^
        unxored[(i + 5) % 7] ^
        unxored[(i + 6) % 7];
      prev[i] = b & 1;
    }
    return prev;
  }

  function transformGates(gates0Bool, t) {
    var bits = new Array(7);
    for (var i = 0; i < 7; i++) bits[i] = gates0Bool[i] ? 1 : 0;
    if (t > 0) {
      for (var f = 0; f < t; f++) bits = stepGatesForward(bits);
    } else if (t < 0) {
      for (var b = 0; b < -t; b++) bits = stepGatesBackward(bits);
    }
    var out = new Array(7);
    for (var k = 0; k < 7; k++) out[k] = bits[k] === 1;
    return out;
  }

  function untransformGates(gatesTBool, t) {
    return transformGates(gatesTBool, -t);
  }

  // Update a 9-element derangement so marriage[qA] = qB (with qA !== qB) while keeping zero fixed points.
  function applyExogamousPairing(currentMarriage, qA, qB) {
    var next = currentMarriage.slice();
    if (next[qA] === qB) {
      return next;
    }
    var prevHolderOfB = -1;
    for (var i = 0; i < 9; i++) {
      if (next[i] === qB) {
        prevHolderOfB = i;
        break;
      }
    }
    var oldTargetOfA = next[qA];
    if (prevHolderOfB !== oldTargetOfA) {
      next[qA] = qB;
      next[prevHolderOfB] = oldTargetOfA;
      return next;
    }
    // Special 2-step case: qA -> u -> qB (so prevHolderOfB === oldTargetOfA === u).
    var u = prevHolderOfB;
    var swapIdx = -1;
    for (var w = 0; w < 9; w++) {
      if (w !== qA && w !== u && next[w] !== u) {
        swapIdx = w;
        break;
      }
    }
    next[qA] = qB;
    next[u] = next[swapIdx];
    next[swapIdx] = u;
    return next;
  }

  function exchangeMonopolyCharters(charters, qA, qB) {
    var next = new Array(9);
    for (var i = 0; i < 9; i++) next[i] = [charters[i][0], charters[i][1]];
    var pA = next[qA][0];
    var dA = next[qA][1];
    var pB = next[qB][0];
    var dB = next[qB][1];

    if (pA !== pB) {
      next[qA] = [pB, pA];
      next[qB] = [pA, pB];
    } else if (dA !== dB) {
      next[qA] = [dB, pA];
      next[qB] = [dA, pB];
    } else {
      var idxA = MONOPOLIES.indexOf(pA);
      var alt1 = MONOPOLIES[(idxA + 1) % 4];
      var alt2 = MONOPOLIES[(idxA + 2) % 4];
      next[qA] = [alt1, pA];
      next[qB] = [alt2, pB];
    }
    return next;
  }

  function parseGateIndex(gateInput) {
    if (typeof gateInput === 'string') {
      var trimmed = gateInput.trim().toUpperCase();
      var cleaned = trimmed.replace(/^GATE\s+/, '');
      var rIdx = ROMAN_GATES.indexOf(cleaned);
      if (rIdx !== -1) return rIdx;
      var parsed = parseInt(cleaned, 10);
      if (Number.isFinite(parsed)) {
        if (parsed >= 1 && parsed <= 7) return parsed - 1;
        if (parsed === 0) return 0;
      }
      return -1;
    }
    if (typeof gateInput === 'number' && Number.isFinite(gateInput)) {
      var n = Math.round(gateInput);
      if (n >= 0 && n <= 6) return n;
      if (n === 7) return 6;
    }
    return -1;
  }

  function parseQuarterPairArgs(qA, qB) {
    function parseSingle(val, zeroBasedHint) {
      if (typeof val === 'string') {
        var m = val.trim().toUpperCase().match(/^Q?([1-9])$/);
        if (m) return parseInt(m[1], 10) - 1;
        var nStr = parseInt(val.trim(), 10);
        if (Number.isFinite(nStr) && nStr >= 0 && nStr <= 8) return nStr;
        return -1;
      }
      if (typeof val === 'number' && Number.isFinite(val)) {
        var n = Math.round(val);
        if (zeroBasedHint) {
          return (n >= 0 && n <= 8) ? n : -1;
        }
        if (n >= 1 && n <= 9) return n - 1;
        if (n === 0) return 0;
      }
      return -1;
    }
    var zeroBased = (qA === 0 || qB === 0);
    return [parseSingle(qA, zeroBased), parseSingle(qB, zeroBased)];
  }

  function renderMonopolyGlyphPaths(monopolyKey) {
    if (monopolyKey === 'bergamot') {
      return (
        '<circle cx="12" cy="13" r="6.5" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<path d="M12 6.5 C12 3.5, 15.5 2.5, 17 4.5 C15 6, 13.2 6.5, 12 6.5 Z" fill="currentColor"/>' +
        '<path d="M12 7.5 L12 18.5 M7 13 L17 13 M8.5 9.5 L15.5 16.5 M15.5 9.5 L8.5 16.5" stroke="currentColor" stroke-width="0.9" opacity="0.75"/>'
      );
    }
    if (monopolyKey === 'sturgeon roe') {
      return (
        '<ellipse cx="12" cy="13" rx="8" ry="6" fill="none" stroke="currentColor" stroke-width="1.4"/>' +
        '<circle cx="9.2" cy="11.8" r="1.5" fill="currentColor"/>' +
        '<circle cx="12.5" cy="11.2" r="1.5" fill="currentColor"/>' +
        '<circle cx="15.2" cy="12.6" r="1.4" fill="currentColor"/>' +
        '<circle cx="10.6" cy="14.7" r="1.5" fill="currentColor"/>' +
        '<circle cx="13.8" cy="14.9" r="1.4" fill="currentColor"/>'
      );
    }
    if (monopolyKey === 'astrolabes') {
      return (
        '<circle cx="12" cy="13" r="7.2" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
        '<circle cx="12" cy="11.5" r="4.1" fill="none" stroke="currentColor" stroke-width="1"/>' +
        '<circle cx="12" cy="3.8" r="1.5" fill="none" stroke="currentColor" stroke-width="1.2"/>' +
        '<line x1="6.2" y1="16.8" x2="17.8" y2="9.2" stroke="currentColor" stroke-width="1.5"/>' +
        '<circle cx="12" cy="13" r="1.3" fill="currentColor"/>'
      );
    }
    return (
      '<polygon points="12,4.2 18.6,9.5 16.2,18.8 7.8,18.8 5.4,9.5" fill="none" stroke="currentColor" stroke-width="1.5"/>' +
      '<polygon points="12,7.6 15.4,10.6 14.1,15.8 9.9,15.8 8.6,10.6" fill="none" stroke="currentColor" stroke-width="1"/>' +
      '<line x1="12" y1="4.2" x2="12" y2="7.6" stroke="currentColor" stroke-width="1"/>' +
      '<line x1="18.6" y1="9.5" x2="15.4" y2="10.6" stroke="currentColor" stroke-width="1"/>' +
      '<line x1="5.4" y1="9.5" x2="8.6" y2="10.6" stroke="currentColor" stroke-width="1"/>'
    );
  }

  function injectScopedStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      'fortified-ledger.doro-act-root {',
      '  display: flex;',
      '  flex-direction: column;',
      '  width: 100%;',
      '  height: 100%;',
      '  min-height: 580px;',
      '  box-sizing: border-box;',
      '  padding: 10px 12px;',
      '  gap: 8px;',
      '  color: #dce6ec;',
      '  font-family: ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace;',
      '  font-variant-numeric: tabular-nums;',
      '  background:',
      '    repeating-linear-gradient(90deg, rgba(214,228,238,0.018) 0px, rgba(214,228,238,0.018) 1px, transparent 1px, transparent 4px),',
      '    radial-gradient(circle at 18% 14%, rgba(56, 178, 152, 0.12), transparent 52%),',
      '    radial-gradient(circle at 84% 82%, rgba(214, 172, 78, 0.09), transparent 48%),',
      '    linear-gradient(160deg, #10171c 0%, #162127 48%, #0e1519 100%);',
      '  border: 1px solid rgba(188, 206, 218, 0.28);',
      '  box-shadow: inset 0 1px 0 rgba(240, 248, 255, 0.14), inset 0 0 36px rgba(8, 14, 18, 0.75);',
      '  overflow-x: hidden;',
      '  overflow-y: auto;',
      '  position: relative;',
      '  user-select: none;',
      '}',
      'canal-lattice.doro-act-lattice, quarter-cell.doro-act-quarter, drawbridge-spring.doro-act-gate, monopoly-reckoner.doro-act-reckoner,',
      'fortified-ledger .doro-act-topbar, fortified-ledger .doro-act-workspace, fortified-ledger .doro-act-plate, fortified-ledger .doro-act-monopoly-tile {',
      '  box-sizing: border-box;',
      '}',
      '.doro-act-topbar {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  flex-wrap: wrap;',
      '  gap: 8px;',
      '  padding: 6px 10px;',
      '  background: linear-gradient(180deg, rgba(206,220,230,0.10) 0%, rgba(120,138,150,0.05) 100%);',
      '  border: 1px solid rgba(182, 202, 214, 0.25);',
      '  border-left: 3px solid #39bfa2;',
      '}',
      '.doro-act-title-block {',
      '  display: flex;',
      '  align-items: baseline;',
      '  gap: 10px;',
      '  flex-wrap: wrap;',
      '}',
      '.doro-act-city-name {',
      '  font-family: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif;',
      '  font-size: 16px;',
      '  font-weight: 700;',
      '  letter-spacing: 0.16em;',
      '  color: #eef5f9;',
      '  text-transform: uppercase;',
      '}',
      '.doro-act-subtitle {',
      '  font-size: 11px;',
      '  letter-spacing: 0.06em;',
      '  color: #84cfc0;',
      '}',
      '.doro-act-census-strip {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 6px;',
      '  flex-wrap: wrap;',
      '}',
      '.doro-act-badge {',
      '  padding: 3px 7px;',
      '  font-size: 10.5px;',
      '  letter-spacing: 0.04em;',
      '  color: #d7e5ec;',
      '  background: rgba(16, 26, 32, 0.78);',
      '  border: 1px solid rgba(154, 184, 198, 0.26);',
      '  white-space: nowrap;',
      '}',
      '.doro-act-badge-verdigris {',
      '  color: #8bf0d8;',
      '  border-color: rgba(66, 204, 174, 0.45);',
      '  background: rgba(16, 58, 50, 0.52);',
      '}',
      '.doro-act-badge-brass {',
      '  color: #f6d889;',
      '  border-color: rgba(224, 179, 76, 0.48);',
      '  background: rgba(66, 49, 16, 0.48);',
      '}',
      '.doro-act-workspace {',
      '  display: grid;',
      '  grid-template-columns: minmax(430px, 1.18fr) minmax(360px, 0.96fr);',
      '  gap: 10px;',
      '  flex: 1 1 auto;',
      '  min-height: 0;',
      '  align-items: stretch;',
      '}',
      '.doro-act-left-wing {',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 8px;',
      '  min-height: 0;',
      '  min-width: 0;',
      '}',
      'canal-lattice.doro-act-lattice {',
      '  position: relative;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  flex: 1 1 auto;',
      '  min-height: 360px;',
      '  background:',
      '    radial-gradient(circle at 50% 50%, rgba(25, 72, 63, 0.22), rgba(10, 16, 20, 0.88) 76%);',
      '  border: 1px solid rgba(168, 192, 206, 0.26);',
      '  padding: 6px;',
      '  overflow: hidden;',
      '}',
      '.doro-act-stage-square {',
      '  position: relative;',
      '  width: 100%;',
      '  max-width: 590px;',
      '  aspect-ratio: 1 / 1;',
      '  margin: 0 auto;',
      '}',
      '.doro-act-canvas {',
      '  position: absolute;',
      '  inset: 0;',
      '  width: 100%;',
      '  height: 100%;',
      '  display: block;',
      '  pointer-events: none;',
      '}',
      '.doro-act-plan-svg {',
      '  position: absolute;',
      '  inset: 0;',
      '  width: 100%;',
      '  height: 100%;',
      '  display: block;',
      '  overflow: visible;',
      '}',
      '.doro-act-svg-gate, .doro-act-svg-tower {',
      '  cursor: pointer;',
      '  outline: none;',
      '}',
      '.doro-act-svg-gate:focus-visible .doro-act-gate-ring,',
      '.doro-act-svg-tower:focus-visible .doro-act-tower-ring {',
      '  stroke: #f8d984;',
      '  stroke-width: 2.5;',
      '}',
      '.doro-act-quarters-layer {',
      '  position: absolute;',
      '  inset: 0;',
      '  pointer-events: none;',
      '}',
      'quarter-cell.doro-act-quarter {',
      '  position: absolute;',
      '  display: flex;',
      '  flex-direction: column;',
      '  justify-content: space-between;',
      '  pointer-events: auto;',
      '  cursor: pointer;',
      '  padding: 3px 4px;',
      '  border: 1px solid rgba(186, 210, 222, 0.26);',
      '  background: rgba(12, 20, 24, 0.14);',
      '  transition: border-color 140ms ease, box-shadow 140ms ease, background-color 140ms ease;',
      '  outline: none;',
      '}',
      'fortified-ledger[data-reduced-motion="true"] quarter-cell.doro-act-quarter,',
      'fortified-ledger[data-reduced-motion="true"] drawbridge-spring.doro-act-gate,',
      'fortified-ledger[data-reduced-motion="true"] .doro-act-astrolabe-alidade {',
      '  transition: none !important;',
      '}',
      'quarter-cell.doro-act-quarter:hover,',
      'quarter-cell.doro-act-quarter:focus-visible {',
      '  border-color: #7ef0d6;',
      '  box-shadow: inset 0 0 0 1px rgba(126, 240, 214, 0.55), 0 0 12px rgba(54, 184, 157, 0.32);',
      '}',
      'quarter-cell.doro-act-quarter[data-selected="true"] {',
      '  border-color: #f6d379;',
      '  box-shadow: inset 0 0 0 2px #f6d379, 0 0 16px rgba(246, 211, 121, 0.45);',
      '  background: rgba(224, 179, 76, 0.12);',
      '}',
      'quarter-cell.doro-act-quarter[data-astrolabe-highlight="true"] {',
      '  border-color: #f0c259;',
      '  box-shadow: inset 0 0 0 1.5px rgba(240, 194, 89, 0.8), 0 0 14px rgba(224, 179, 76, 0.36);',
      '}',
      'quarter-cell.doro-act-quarter[data-violation="true"] {',
      '  border-color: #ff7a6b;',
      '  box-shadow: inset 0 0 0 2px #ff7a6b, 0 0 16px rgba(255, 102, 86, 0.52);',
      '}',
      '.doro-act-q-head, .doro-act-q-foot {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 3px;',
      '  padding: 1px 3px;',
      '  background: rgba(10, 16, 20, 0.84);',
      '  border: 1px solid rgba(164, 188, 200, 0.22);',
      '  font-size: 9.5px;',
      '  line-height: 1.15;',
      '}',
      '.doro-act-q-id {',
      '  font-weight: 700;',
      '  color: #f1f7fb;',
      '  letter-spacing: 0.04em;',
      '}',
      '.doro-act-q-monopoly {',
      '  font-weight: 700;',
      '  letter-spacing: 0.04em;',
      '  padding: 0 3px;',
      '}',
      '.doro-act-q-census {',
      '  color: #b9ccd6;',
      '  font-size: 8.5px;',
      '  letter-spacing: -0.01em;',
      '}',
      '.doro-act-q-union {',
      '  color: #7debd2;',
      '  font-weight: 600;',
      '  font-size: 8.8px;',
      '}',
      '.doro-act-spring-rack {',
      '  display: grid;',
      '  grid-template-columns: repeat(7, minmax(0, 1fr));',
      '  gap: 5px;',
      '}',
      'drawbridge-spring.doro-act-gate {',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 2px;',
      '  padding: 5px 5px 4px;',
      '  background: linear-gradient(180deg, rgba(188,205,216,0.09), rgba(16,25,30,0.86));',
      '  border: 1px solid rgba(168, 190, 204, 0.26);',
      '  cursor: pointer;',
      '  outline: none;',
      '  transition: border-color 130ms ease, background-color 130ms ease;',
      '}',
      'drawbridge-spring.doro-act-gate[data-open="true"] {',
      '  border-bottom: 2px solid #3cd4b4;',
      '}',
      'drawbridge-spring.doro-act-gate[data-open="false"] {',
      '  border-bottom: 2px solid #e0a948;',
      '  background: linear-gradient(180deg, rgba(224,169,72,0.14), rgba(22,26,30,0.9));',
      '}',
      'drawbridge-spring.doro-act-gate:hover,',
      'drawbridge-spring.doro-act-gate:focus-visible {',
      '  border-color: #8cf2dc;',
      '}',
      '.doro-act-gate-top {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  font-size: 9.5px;',
      '  font-weight: 700;',
      '  color: #e9f2f7;',
      '}',
      '.doro-act-gate-key {',
      '  font-size: 8.5px;',
      '  padding: 0 3px;',
      '  color: #9bb3c2;',
      '  border: 1px solid rgba(155, 179, 194, 0.3);',
      '}',
      '.doro-act-coil-svg {',
      '  width: 100%;',
      '  height: 18px;',
      '  display: block;',
      '}',
      '.doro-act-gate-meta {',
      '  display: flex;',
      '  justify-content: space-between;',
      '  font-size: 8.5px;',
      '  color: #9ec0ce;',
      '}',
      'monopoly-reckoner.doro-act-reckoner {',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 8px;',
      '  min-height: 0;',
      '  min-width: 0;',
      '}',
      '.doro-act-plate {',
      '  padding: 8px 10px;',
      '  background: linear-gradient(180deg, rgba(198,214,224,0.07) 0%, rgba(14,22,27,0.88) 100%);',
      '  border: 1px solid rgba(170, 194, 208, 0.25);',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 6px;',
      '}',
      '.doro-act-plate-head {',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: space-between;',
      '  gap: 6px;',
      '  border-bottom: 1px solid rgba(154, 180, 194, 0.18);',
      '  padding-bottom: 4px;',
      '}',
      '.doro-act-plate-title {',
      '  font-size: 10.5px;',
      '  font-weight: 700;',
      '  letter-spacing: 0.1em;',
      '  text-transform: uppercase;',
      '  color: #dbe8ef;',
      '}',
      '.doro-act-plate-sub {',
      '  font-size: 9.5px;',
      '  color: #7fdac5;',
      '}',
      '.doro-act-gen-scrubber {',
      '  display: grid;',
      '  grid-template-columns: repeat(11, minmax(0, 1fr));',
      '  gap: 3px;',
      '}',
      '.doro-act-gen-step {',
      '  appearance: none;',
      '  background: rgba(13, 21, 26, 0.85);',
      '  color: #b7cad6;',
      '  border: 1px solid rgba(152, 178, 192, 0.26);',
      '  padding: 5px 0;',
      '  font-family: inherit;',
      '  font-size: 10px;',
      '  font-weight: 600;',
      '  cursor: pointer;',
      '  text-align: center;',
      '}',
      '.doro-act-gen-step:hover, .doro-act-gen-step:focus-visible {',
      '  border-color: #7eeed4;',
      '  color: #ffffff;',
      '  outline: none;',
      '}',
      '.doro-act-gen-step[data-epoch="present"] {',
      '  border-color: rgba(224, 179, 76, 0.5);',
      '}',
      '.doro-act-gen-step[data-active="true"] {',
      '  background: linear-gradient(180deg, #2ca88e, #196858);',
      '  color: #f4fffc;',
      '  border-color: #8af5dd;',
      '  font-weight: 700;',
      '}',
      '.doro-act-matrix-readout {',
      '  font-size: 9.5px;',
      '  color: #9eb7c4;',
      '  display: flex;',
      '  justify-content: space-between;',
      '  flex-wrap: wrap;',
      '  gap: 4px;',
      '}',
      '.doro-act-astrolabe-row {',
      '  display: grid;',
      '  grid-template-columns: 98px minmax(0, 1fr);',
      '  gap: 10px;',
      '  align-items: center;',
      '}',
      '.doro-act-astrolabe-dial {',
      '  width: 98px;',
      '  height: 98px;',
      '  cursor: pointer;',
      '  position: relative;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  border-radius: 50%;',
      '  background: radial-gradient(circle at 36% 32%, rgba(250, 222, 146, 0.25), rgba(44, 32, 10, 0.85) 72%);',
      '  border: 1px solid rgba(232, 188, 86, 0.62);',
      '  box-shadow: 0 0 18px rgba(224, 179, 76, 0.18), inset 0 0 12px rgba(248, 217, 132, 0.2);',
      '  outline: none;',
      '}',
      '.doro-act-astrolabe-dial:hover, .doro-act-astrolabe-dial:focus-visible {',
      '  border-color: #ffe399;',
      '  box-shadow: 0 0 22px rgba(240, 198, 96, 0.44), inset 0 0 14px rgba(255, 227, 153, 0.34);',
      '}',
      '.doro-act-astrolabe-alidade {',
      '  transform-origin: 50px 50px;',
      '  transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);',
      '}',
      '.doro-act-astrolabe-info {',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 5px;',
      '}',
      '.doro-act-astrolabe-trigger {',
      '  appearance: none;',
      '  align-self: flex-start;',
      '  padding: 5px 9px;',
      '  font-family: inherit;',
      '  font-size: 10px;',
      '  font-weight: 700;',
      '  letter-spacing: 0.06em;',
      '  color: #1c1404;',
      '  background: linear-gradient(180deg, #f5d47e 0%, #cf9d39 100%);',
      '  border: 1px solid #fbe4a4;',
      '  cursor: pointer;',
      '}',
      '.doro-act-astrolabe-trigger:hover, .doro-act-astrolabe-trigger:focus-visible {',
      '  background: linear-gradient(180deg, #ffe296 0%, #deb048 100%);',
      '  outline: none;',
      '}',
      '.doro-act-decree {',
      '  padding: 6px 8px;',
      '  font-size: 10px;',
      '  line-height: 1.35;',
      '  border-left: 3px solid #45ceb0;',
      '  background: rgba(18, 44, 40, 0.52);',
      '  color: #d4ece6;',
      '}',
      '.doro-act-decree[data-mode="violation"] {',
      '  border-left-color: #ff6e5e;',
      '  background: rgba(78, 22, 20, 0.65);',
      '  color: #ffd8d2;',
      '}',
      '.doro-act-decree[data-mode="selected"] {',
      '  border-left-color: #f2c65f;',
      '  background: rgba(66, 50, 14, 0.55);',
      '  color: #f9e6b3;',
      '}',
      '.doro-act-monopoly-grid {',
      '  display: grid;',
      '  grid-template-columns: repeat(2, minmax(0, 1fr));',
      '  gap: 5px;',
      '}',
      '.doro-act-monopoly-tile {',
      '  display: flex;',
      '  align-items: center;',
      '  gap: 7px;',
      '  padding: 5px 7px;',
      '  background: rgba(12, 20, 25, 0.82);',
      '  border: 1px solid rgba(158, 184, 198, 0.24);',
      '  cursor: pointer;',
      '  outline: none;',
      '}',
      '.doro-act-monopoly-tile:hover, .doro-act-monopoly-tile:focus-visible {',
      '  border-color: #9be8d7;',
      '}',
      '.doro-act-monopoly-tile[data-focused="true"] {',
      '  border-color: #f5d27a;',
      '  background: rgba(54, 42, 16, 0.52);',
      '}',
      '.doro-act-monopoly-icon {',
      '  width: 24px;',
      '  height: 24px;',
      '  flex: 0 0 24px;',
      '}',
      '.doro-act-monopoly-text {',
      '  min-width: 0;',
      '  flex: 1 1 auto;',
      '}',
      '.doro-act-monopoly-name {',
      '  font-size: 10px;',
      '  font-weight: 700;',
      '  text-transform: capitalize;',
      '  color: #edf5f9;',
      '}',
      '.doro-act-monopoly-holders {',
      '  font-size: 9px;',
      '  color: #9ab5c2;',
      '  white-space: nowrap;',
      '  overflow: hidden;',
      '  text-overflow: ellipsis;',
      '}',
      '.doro-act-ledger-scroll {',
      '  overflow-x: auto;',
      '}',
      'fortified-ledger .doro-act-ledger-table {',
      '  width: 100%;',
      '  border-collapse: collapse;',
      '  font-size: 9.5px;',
      '}',
      'fortified-ledger .doro-act-th {',
      '  text-align: left;',
      '  font-weight: 700;',
      '  color: #8fb0c0;',
      '  padding: 2px 4px;',
      '  border-bottom: 1px solid rgba(154, 180, 194, 0.25);',
      '}',
      'fortified-ledger .doro-act-td {',
      '  padding: 2.5px 4px;',
      '  border-bottom: 1px solid rgba(154, 180, 194, 0.10);',
      '  color: #d6e4ec;',
      '  white-space: nowrap;',
      '}',
      'fortified-ledger .doro-act-foot-td {',
      '  padding: 4px 4px 2.5px;',
      '  font-weight: 700;',
      '  color: #8cf0d8;',
      '  border-top: 1px solid rgba(66, 204, 174, 0.38);',
      '  white-space: nowrap;',
      '}',
      'fortified-ledger .doro-act-towers-strip {',
      '  display: grid;',
      '  grid-template-columns: repeat(4, minmax(0, 1fr));',
      '  gap: 4px;',
      '  margin-top: 2px;',
      '}',
      'fortified-ledger .doro-act-tower-chip {',
      '  padding: 4px 5px;',
      '  font-size: 8.8px;',
      '  background: linear-gradient(135deg, rgba(212,226,236,0.12), rgba(22,32,38,0.85));',
      '  border: 1px solid rgba(180, 200, 214, 0.28);',
      '  cursor: pointer;',
      '  color: #cfdde6;',
      '}',
      'fortified-ledger .doro-act-tower-chip[data-active="true"] {',
      '  border-color: #8cf0d8;',
      '  background: linear-gradient(135deg, rgba(64,196,168,0.22), rgba(20,36,38,0.9));',
      '}',
      'fortified-ledger.doro-act-compact .doro-act-workspace {',
      '  grid-template-columns: 1fr;',
      '}',
      'fortified-ledger.doro-act-compact .doro-act-spring-rack {',
      '  grid-template-columns: repeat(4, minmax(0, 1fr));',
      '}',
      '@media (max-width: 900px) {',
      '  fortified-ledger.doro-act-root .doro-act-workspace {',
      '    grid-template-columns: 1fr;',
      '  }',
      '  fortified-ledger.doro-act-root .doro-act-spring-rack {',
      '    grid-template-columns: repeat(4, minmax(0, 1fr));',
      '  }',
      '}',
      'fortified-ledger.doro-act-mobile .doro-act-workspace {',
      '  grid-template-columns: 1fr;',
      '}',
      'fortified-ledger.doro-act-mobile .doro-act-spring-rack {',
      '  grid-template-columns: repeat(4, minmax(0, 1fr));',
      '}',
      'fortified-ledger.doro-act-mobile .doro-act-monopoly-grid {',
      '  grid-template-columns: 1fr;',
      '}',
      'fortified-ledger.doro-act-mobile .doro-act-towers-strip {',
      '  grid-template-columns: repeat(2, minmax(0, 1fr));',
      '}',
      'fortified-ledger.doro-act-mobile .doro-act-q-census {',
      '  display: none;',
      '}'
    ].join('\n');
    document.head.appendChild(style);
  }

  // Active singleton mount state
  var activeInstance = null;

  function createActuaryInstance(containerEl, options) {
    var opts = options || {};
    injectScopedStyles();

    var mediaQuery =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    var manualReducedMotion = typeof opts.reducedMotion === 'boolean' ? opts.reducedMotion : null;
    var reducedMotion = manualReducedMotion !== null ? manualReducedMotion : Boolean(mediaQuery && mediaQuery.matches);

    // Canonical t = 0 state anchors (all Past/Future generations derive via invertible matrices P^t and B^t)
    var chartersAtZero = BASE_CHARTERS_T0.map(function (pair) { return [pair[0], pair[1]]; });
    var marriageAtZero = BASE_MARRIAGE_T0.slice();
    var gatesAtZero = BASE_GATES_T0.slice();

    var generation = clampGeneration(opts.initialGeneration !== undefined ? opts.initialGeneration : 0);
    var selectedQuarterIdx = null;
    var violationQuarterIdx = null;
    var focusedMonopoly = null;
    var focusedTowerId = 'NW';
    var customAlliancesForged = 0;
    var exogamyViolationsCount = 0;
    var lastViolation = null;
    var lastAllianceMsg = null;
    var astrolabeActivations = 0;
    var viewportWidth = Number(opts.width) || (containerEl && containerEl.clientWidth) || 1280;
    var viewportHeight = Number(opts.height) || (containerEl && containerEl.clientHeight) || 800;

    var animPhase = 0;
    var lastFrameTs = 0;
    var rafId = null;
    var destroyed = false;
    var resizeObserver = null;

    // Build DOM using bespoke custom elements
    var rootEl = document.createElement('fortified-ledger');
    rootEl.className = 'doro-act-root';
    rootEl.setAttribute('role', 'region');
    rootEl.setAttribute('aria-label', 'Dorothea Combinatoric Spatial Ledger');
    rootEl.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');

    rootEl.innerHTML = [
      '<div class="doro-act-topbar">',
      '  <div class="doro-act-title-block">',
      '    <span class="doro-act-city-name">Dorothea</span>',
      '    <span class="doro-act-subtitle">4 Aluminum Towers &middot; 7 Spring Drawbridges &middot; 4 Green Canals &middot; 9 Quarters</span>',
      '  </div>',
      '  <div class="doro-act-census-strip">',
      '    <span class="doro-act-badge">2,700 houses &middot; 6,300 chimneys</span>',
      '    <span class="doro-act-badge doro-act-badge-verdigris" data-ref="top-flux">Gates 5/7 &middot; Flux 78%</span>',
      '    <span class="doro-act-badge doro-act-badge-brass" data-ref="top-gen">Present (t = 0)</span>',
      '  </div>',
      '</div>',
      '<div class="doro-act-workspace">',
      '  <div class="doro-act-left-wing">',
      '    <canal-lattice class="doro-act-lattice">',
      '      <div class="doro-act-stage-square" data-ref="stage-square">',
      '        <canvas class="doro-act-canvas" data-ref="canvas"></canvas>',
      '        <svg class="doro-act-plan-svg" viewBox="0 0 680 680" data-ref="plan-svg" aria-label="Fortified Canal & Quarter Plan"></svg>',
      '        <div class="doro-act-quarters-layer" data-ref="quarters-layer"></div>',
      '      </div>',
      '    </canal-lattice>',
      '    <div class="doro-act-spring-rack" data-ref="spring-rack" role="group" aria-label="7 Spring-Operated Drawbridges"></div>',
      '  </div>',
      '  <monopoly-reckoner class="doro-act-reckoner">',
      '    <div class="doro-act-plate">',
      '      <div class="doro-act-plate-head">',
      '        <span class="doro-act-plate-title">Generation Reckoner (Past &middot; Present &middot; Future)</span>',
      '        <span class="doro-act-plate-sub" data-ref="gen-label">Present t = 0</span>',
      '      </div>',
      '      <div class="doro-act-gen-scrubber" data-ref="gen-scrubber" role="group" aria-label="Generation offset t from -5 to +5"></div>',
      '      <div class="doro-act-matrix-readout" data-ref="matrix-readout"></div>',
      '    </div>',
      '    <div class="doro-act-plate">',
      '      <div class="doro-act-plate-head">',
      '        <span class="doro-act-plate-title">Brass Astrolabe Monopoly Reckoner</span>',
      '        <span class="doro-act-plate-sub" data-ref="astrolabe-sub">Celestial Guild</span>',
      '      </div>',
      '      <div class="doro-act-astrolabe-row">',
      '        <div class="doro-act-astrolabe-dial" data-ref="astrolabe-dial" role="button" tabindex="0" aria-label="Activate Brass Astrolabe Monopoly Reckoner">',
      '          <svg viewBox="0 0 100 100" width="90" height="90">',
      '            <defs>',
      '              <linearGradient id="doro-act-brass-grad" x1="0%" y1="0%" x2="100%" y2="100%">',
      '                <stop offset="0%" stop-color="#fbe5a2"/>',
      '                <stop offset="50%" stop-color="#d4a23e"/>',
      '                <stop offset="100%" stop-color="#7c5918"/>',
      '              </linearGradient>',
      '            </defs>',
      '            <circle cx="50" cy="50" r="44" fill="none" stroke="url(#doro-act-brass-grad)" stroke-width="3"/>',
      '            <circle cx="50" cy="50" r="37" fill="none" stroke="#e9c166" stroke-width="0.9" stroke-dasharray="2 4"/>',
      '            <circle cx="50" cy="44" r="23" fill="none" stroke="#d8ab4c" stroke-width="1.3"/>',
      '            <circle cx="50" cy="39" r="13" fill="none" stroke="#c89a3d" stroke-width="1"/>',
      '            <line x1="6" y1="50" x2="94" y2="50" stroke="rgba(246,214,132,0.45)" stroke-width="0.8"/>',
      '            <line x1="50" y1="6" x2="50" y2="94" stroke="rgba(246,214,132,0.45)" stroke-width="0.8"/>',
      '            <g class="doro-act-astrolabe-alidade" data-ref="astrolabe-alidade">',
      '              <line x1="14" y1="50" x2="86" y2="50" stroke="#fff0be" stroke-width="2.4"/>',
      '              <polygon points="86,50 77,46.5 77,53.5" fill="#fff0be"/>',
      '              <polygon points="14,50 21,47.5 21,52.5" fill="#d8ab4c"/>',
      '              <circle cx="50" cy="50" r="4.2" fill="#fbe5a2" stroke="#5b3e0d" stroke-width="1.3"/>',
      '            </g>',
      '          </svg>',
      '        </div>',
      '        <div class="doro-act-astrolabe-info">',
      '          <div style="font-size:10px;color:#ebd6a3;line-height:1.35;" data-ref="astrolabe-copy"></div>',
      '          <button type="button" class="doro-act-astrolabe-trigger" data-ref="astrolabe-btn">RECKON ASTROLABES [A]</button>',
      '        </div>',
      '      </div>',
      '    </div>',
      '    <div class="doro-act-plate">',
      '      <div class="doro-act-plate-head">',
      '        <span class="doro-act-plate-title">Exogamous Marriages &amp; 4 Family Monopolies</span>',
      '        <span class="doro-act-plate-sub">Law: Q_a &ne; Q_b</span>',
      '      </div>',
      '      <div class="doro-act-decree" data-ref="decree" role="status" aria-live="polite"></div>',
      '      <div class="doro-act-monopoly-grid" data-ref="monopoly-grid"></div>',
      '    </div>',
      '    <div class="doro-act-plate">',
      '      <div class="doro-act-plate-head">',
      '        <span class="doro-act-plate-title">9-Quarter Ledger &amp; 4 Aluminum Towers</span>',
      '        <span class="doro-act-plate-sub">300 houses &middot; 700 chimneys / quarter</span>',
      '      </div>',
      '      <div class="doro-act-ledger-scroll">',
      '        <table class="doro-act-ledger-table">',
      '          <thead>',
      '            <tr><th class="doro-act-th">Qtr</th><th class="doro-act-th">Houses &middot; Chimneys</th><th class="doro-act-th">Lit</th><th class="doro-act-th">Weds</th><th class="doro-act-th">Monopoly (Dowry)</th></tr>',
      '          </thead>',
      '          <tbody data-ref="ledger-tbody"></tbody>',
      '          <tfoot>',
      '            <tr class="doro-act-ledger-foot" data-ref="ledger-tfoot"></tr>',
      '          </tfoot>',
      '        </table>',
      '      </div>',
      '      <div class="doro-act-towers-strip" data-ref="towers-strip"></div>',
      '    </div>',
      '  </monopoly-reckoner>',
      '</div>'
    ].join('\n');

    containerEl.innerHTML = '';
    containerEl.appendChild(rootEl);

    var refs = {};
    var refNodes = rootEl.querySelectorAll('[data-ref]');
    for (var r = 0; r < refNodes.length; r++) {
      refs[refNodes[r].getAttribute('data-ref')] = refNodes[r];
    }

    // Build 9 <quarter-cell> custom elements aligned to the 680x680 coordinate lattice
    var quarterCellEls = [];
    for (var q = 0; q < 9; q++) {
      var qRow = Math.floor(q / 3);
      var qCol = q % 3;
      var qCell = document.createElement('quarter-cell');
      qCell.className = 'doro-act-quarter';
      qCell.setAttribute('tabindex', '0');
      qCell.setAttribute('role', 'button');
      qCell.setAttribute('data-quarter-idx', String(q));
      qCell.style.left = ((QUARTER_BOUNDS[qCol].start / PLAN_SIZE) * 100).toFixed(4) + '%';
      qCell.style.top = ((QUARTER_BOUNDS[qRow].start / PLAN_SIZE) * 100).toFixed(4) + '%';
      qCell.style.width = ((144 / PLAN_SIZE) * 100).toFixed(4) + '%';
      qCell.style.height = ((144 / PLAN_SIZE) * 100).toFixed(4) + '%';
      qCell.innerHTML =
        '<div class="doro-act-q-head">' +
          '<span class="doro-act-q-id">Q' + (q + 1) + '</span>' +
          '<span class="doro-act-q-monopoly" data-q-monopoly></span>' +
        '</div>' +
        '<div class="doro-act-q-foot">' +
          '<span class="doro-act-q-census" title="300 houses · 700 chimneys">300H&middot;700C</span>' +
          '<span class="doro-act-q-union" data-q-union></span>' +
        '</div>';
      refs['quarters-layer'].appendChild(qCell);
      quarterCellEls.push(qCell);
    }

    // Build 7 <drawbridge-spring> custom elements
    var gateSpringEls = [];
    for (var g = 0; g < 7; g++) {
      var gEl = document.createElement('drawbridge-spring');
      gEl.className = 'doro-act-gate';
      gEl.setAttribute('tabindex', '0');
      gEl.setAttribute('role', 'button');
      gEl.setAttribute('data-gate-idx', String(g));
      gEl.innerHTML =
        '<div class="doro-act-gate-top">' +
          '<span>Gate ' + ROMAN_GATES[g] + '</span>' +
          '<span class="doro-act-gate-key">' + (g + 1) + '</span>' +
        '</div>' +
        '<svg class="doro-act-coil-svg" viewBox="0 0 84 18" data-gate-coil></svg>' +
        '<div class="doro-act-gate-meta">' +
          '<span data-gate-status></span>' +
          '<span data-gate-torque></span>' +
        '</div>';
      refs['spring-rack'].appendChild(gEl);
      gateSpringEls.push(gEl);
    }

    // Build 11 Generation Reckoner buttons (-5..+5)
    var genBtnEls = [];
    for (var genOffset = -5; genOffset <= 5; genOffset++) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'doro-act-gen-step';
      btn.setAttribute('data-gen', String(genOffset));
      btn.setAttribute('data-epoch', genOffset === 0 ? 'present' : (genOffset < 0 ? 'past' : 'future'));
      btn.textContent = genOffset > 0 ? '+' + genOffset : String(genOffset);
      btn.title = genOffset === 0
        ? 'Present (t = 0)'
        : (genOffset < 0 ? 'Past Generation t = ' + genOffset : 'Future Generation t = +' + genOffset);
      refs['gen-scrubber'].appendChild(btn);
      genBtnEls.push(btn);
    }

    // Build 4 Family Monopoly tiles
    var monopolyTileEls = {};
    for (var mIdx = 0; mIdx < MONOPOLIES.length; mIdx++) {
      var mKey = MONOPOLIES[mIdx];
      var mMeta = MONOPOLY_META[mKey];
      var tile = document.createElement('div');
      tile.className = 'doro-act-monopoly-tile';
      tile.setAttribute('tabindex', '0');
      tile.setAttribute('role', 'button');
      tile.setAttribute('data-monopoly', mKey);
      tile.innerHTML =
        '<svg class="doro-act-monopoly-icon" viewBox="0 0 24 24" style="color:' + mMeta.color + ';">' +
          renderMonopolyGlyphPaths(mKey) +
        '</svg>' +
        '<div class="doro-act-monopoly-text">' +
          '<div class="doro-act-monopoly-name" style="color:' + mMeta.stroke + ';">' + mKey + '</div>' +
          '<div class="doro-act-monopoly-holders" data-monopoly-holders></div>' +
        '</div>';
      refs['monopoly-grid'].appendChild(tile);
      monopolyTileEls[mKey] = tile;
    }

    function computeDerivedModel() {
      var t = generation;
      var perm = getPermPower(t);
      var invPerm = invertPerm(perm);
      var charters = transformCharters(chartersAtZero, t);
      var marriageMap = transformMarriageMap(marriageAtZero, t);
      var gatesOpen = transformGates(gatesAtZero, t);

      var inverseMarriage = new Array(9);
      for (var i = 0; i < 9; i++) inverseMarriage[marriageMap[i]] = i;

      var openGateCount = 0;
      var gatesData = [];
      for (var g = 0; g < 7; g++) {
        var meta = GATES_META[g];
        var isOpen = gatesOpen[g];
        if (isOpen) openGateCount++;
        var tensionKNm = isOpen ? (16 + ((g * 3 + Math.abs(t) * 2) % 7)) : (78 + ((g * 5 + Math.abs(t) * 3) % 14));
        var waterPct = isOpen ? (84 + ((g * 4 + (t + 5)) % 15)) : 8;
        var casks = isOpen ? (36 + ((g * 7 + (t + 5) * 3) % 24)) : 0;
        gatesData.push({
          index: g,
          number: g + 1,
          id: meta.id,
          roman: meta.roman,
          side: meta.side,
          wall: meta.wall,
          open: isOpen,
          drawbridgeState: isOpen ? 'lowered' : 'raised',
          springTensionKNm: tensionKNm,
          springCoilsActive: isOpen ? 5 : 8,
          waterAdmittancePct: waterPct,
          tradeFluxCasks: casks
        });
      }

      var canalsData = [];
      for (var c = 0; c < 4; c++) {
        var cMeta = CANALS_META[c];
        var sumPct = 0;
        for (var gi = 0; gi < cMeta.gates.length; gi++) {
          sumPct += gatesData[cMeta.gates[gi]].waterAdmittancePct;
        }
        var flowPct = Math.round(
          0.78 * (sumPct / cMeta.gates.length) + 0.22 * ((openGateCount / 7) * 100)
        );
        if (openGateCount === 0) flowPct = 12;
        var velocityKnots = Number(((flowPct / 100) * 2.9).toFixed(2));
        canalsData.push({
          id: cMeta.id,
          axis: cMeta.axis,
          label: cMeta.label,
          flowPct: flowPct,
          velocityKnots: velocityKnots
        });
      }

      var quartersData = [];
      var marriagesData = [];
      var monopolySummary = {};
      for (var mk = 0; mk < MONOPOLIES.length; mk++) {
        var key = MONOPOLIES[mk];
        monopolySummary[key] = {
          name: key,
          holders: [],
          dowryHolders: [],
          fluxIndex: 0
        };
      }

      var totalActiveChimneys = 0;
      for (var qIdx = 0; qIdx < 9; qIdx++) {
        var rRow = Math.floor(qIdx / 3);
        var rCol = qIdx % 3;
        var groomIdx = marriageMap[qIdx];
        var groomRow = Math.floor(groomIdx / 3);
        var groomCol = groomIdx % 3;
        var chordDist = Math.abs(rRow - groomRow) + Math.abs(rCol - groomCol);

        // Adjacent canal flows
        var adjCanals = [];
        if (rCol === 0 || rCol === 1) adjCanals.push(canalsData[0].flowPct);
        if (rCol === 1 || rCol === 2) adjCanals.push(canalsData[1].flowPct);
        if (rRow === 0 || rRow === 1) adjCanals.push(canalsData[2].flowPct);
        if (rRow === 1 || rRow === 2) adjCanals.push(canalsData[3].flowPct);
        var localCanalSum = 0;
        for (var ac = 0; ac < adjCanals.length; ac++) localCanalSum += adjCanals[ac];
        var canalFlowPct = Math.round(localCanalSum / adjCanals.length);

        var primaryM = charters[qIdx][0];
        var dowryM = charters[qIdx][1];
        var groomPrimaryM = charters[groomIdx][0];
        var mWeight = MONOPOLY_META[primaryM].weight + MONOPOLY_META[dowryM].weight;

        var lit = Math.min(
          692,
          Math.max(
            195,
            Math.round(
              240 +
                canalFlowPct * 2.55 +
                chordDist * 28 +
                mWeight * 9 +
                Math.min(60, customAlliancesForged * 12)
            )
          )
        );
        totalActiveChimneys += lit;

        var qCode = 'Q' + (qIdx + 1);
        var groomCode = 'Q' + (groomIdx + 1);
        var fromCode = 'Q' + (inverseMarriage[qIdx] + 1);

        monopolySummary[primaryM].holders.push(qCode);
        monopolySummary[dowryM].dowryHolders.push(qCode);
        monopolySummary[primaryM].fluxIndex += Math.round(canalFlowPct * 0.45 + chordDist * 9);

        quartersData.push({
          index: qIdx,
          number: qIdx + 1,
          id: qCode,
          row: rRow,
          col: rCol,
          houses: 300,
          chimneys: 700,
          activeChimneys: lit,
          monopoly: primaryM,
          dowryMonopoly: dowryM,
          marriesTo: groomCode,
          marriesToIndex: groomIdx,
          marriesFrom: fromCode,
          canalFlowPct: canalFlowPct
        });

        marriagesData.push({
          from: qCode,
          to: groomCode,
          fromIndex: qIdx,
          toIndex: groomIdx,
          brideMonopoly: primaryM,
          groomMonopoly: groomPrimaryM,
          exogamous: qIdx !== groomIdx
        });
      }

      var towersData = [];
      for (var tw = 0; tw < TOWERS_META.length; tw++) {
        var tMeta = TOWERS_META[tw];
        var gA = gatesData[tMeta.gateIndices[0]];
        var gB = gatesData[tMeta.gateIndices[1]];
        var springLoadKNm = Math.round((gA.springTensionKNm + gB.springTensionKNm) * 0.65 + 14);
        var moatHeadMeters = Number((2.35 + (openGateCount * 0.19) + (tw * 0.08)).toFixed(2));
        towersData.push({
          id: tMeta.id,
          label: tMeta.label,
          corner: tMeta.id,
          azimuthDeg: tMeta.azimuthDeg,
          elevationMeters: tMeta.elevationM,
          springLoadKNm: springLoadKNm,
          moatHeadMeters: moatHeadMeters,
          adjacentGates: [gA.id, gB.id],
          quarter: 'Q' + (tMeta.quarterIdx + 1)
        });
      }

      // Compute brass astrolabe alidade angle pointing toward primary astrolabe holder
      var astroHolders = monopolySummary['astrolabes'].holders;
      var primaryAstroIdx = astroHolders.length > 0 ? parseInt(astroHolders[0].slice(1), 10) - 1 : 4;
      var astRow = Math.floor(primaryAstroIdx / 3);
      var astCol = primaryAstroIdx % 3;
      var dx = (astCol - 1) * 60;
      var dy = (astRow - 1) * 60;
      var baseAngle = (dx === 0 && dy === 0) ? 38 : Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
      var alidadeDeg = ((baseAngle + t * 24 + astrolabeActivations * 45) % 360 + 360) % 360;

      var avgFlux = Math.round(
        (canalsData[0].flowPct + canalsData[1].flowPct + canalsData[2].flowPct + canalsData[3].flowPct) / 4
      );

      var epoch = t === 0 ? 'present' : (t < 0 ? 'past' : 'future');
      var epochLabel = t === 0
        ? 'Present (t = 0)'
        : (t < 0 ? 'Past (t = ' + t + ')' : 'Future (t = +' + t + ')');

      return {
        city: 'Dorothea',
        generation: t,
        epoch: epoch,
        epochLabel: epochLabel,
        reducedMotion: reducedMotion,
        totals: {
          towers: 4,
          gates: 7,
          openGates: openGateCount,
          canals: 4,
          quarters: 9,
          housesPerQuarter: 300,
          chimneysPerQuarter: 700,
          housesCitywide: 2700,
          chimneysCitywide: 6300,
          activeChimneysCitywide: totalActiveChimneys,
          canalFluxPct: avgFlux,
          exogamousMarriages: 9,
          customAlliancesForged: customAlliancesForged
        },
        towers: towersData,
        gates: gatesData,
        canals: canalsData,
        monopolies: MONOPOLIES.slice(),
        monopolySummary: monopolySummary,
        quarters: quartersData,
        marriages: marriagesData,
        matrixOperator: {
          dimension: 9,
          exponent: t,
          determinant: (Math.abs(t) % 2 === 1) ? -1 : 1,
          permutation: perm,
          inversePermutation: invPerm,
          gateExponent: t
        },
        exogamyLaw: {
          enforced: true,
          rule: 'Q_a != Q_b',
          violationsCount: exogamyViolationsCount,
          lastViolation: lastViolation ? {
            quarter: lastViolation.quarter,
            generation: lastViolation.generation,
            message: lastViolation.message
          } : null
        },
        astrolabe: {
          monopoly: 'astrolabes',
          holders: astroHolders.slice(),
          dowryHolders: monopolySummary['astrolabes'].dowryHolders.slice(),
          alidadeDeg: alidadeDeg,
          activations: astrolabeActivations
        },
        selectedQuarter: selectedQuarterIdx !== null ? 'Q' + (selectedQuarterIdx + 1) : null,
        focusedMonopoly: focusedMonopoly,
        focusedTower: focusedTowerId,
        viewport: {
          width: viewportWidth,
          height: viewportHeight
        }
      };
    }

    var currentSnapshot = computeDerivedModel();

    function buildSpringCoilSvgMarkup(isOpen) {
      // Helical spring compressed tightly when raised (!isOpen), extended cleanly when lowered (isOpen)
      var turns = isOpen ? 5 : 9;
      var xStart = isOpen ? 12 : 20;
      var xEnd = isOpen ? 72 : 64;
      var span = (xEnd - xStart) / (turns * 2);
      var d = 'M 3 9 L ' + xStart.toFixed(1) + ' 9 ';
      for (var i = 0; i < turns * 2; i++) {
        var x = xStart + (i + 0.5) * span;
        var y = (i % 2 === 0) ? 2.5 : 15.5;
        d += 'L ' + x.toFixed(1) + ' ' + y + ' ';
      }
      d += 'L ' + xEnd.toFixed(1) + ' 9 L 81 9';
      var stroke = isOpen ? '#55e3c4' : '#f2bc57';
      return (
        '<line x1="3" y1="9" x2="81" y2="9" stroke="rgba(180,200,214,0.22)" stroke-width="2"/>' +
        '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="1.65" stroke-linejoin="round"/>' +
        '<circle cx="4" cy="9" r="2.2" fill="#c7d5de"/>' +
        '<circle cx="80" cy="9" r="2.2" fill="#c7d5de"/>'
      );
    }

    function renderPlanSvg(snap) {
      var svgParts = [];

      svgParts.push(
        '<defs>' +
          '<linearGradient id="doro-act-alum-nw" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#f4f9fc"/>' +
            '<stop offset="48%" stop-color="#adbcc6"/>' +
            '<stop offset="100%" stop-color="#485660"/>' +
          '</linearGradient>' +
          '<linearGradient id="doro-act-alum-dark" x1="100%" y1="0%" x2="0%" y2="100%">' +
            '<stop offset="0%" stop-color="#84949f"/>' +
            '<stop offset="100%" stop-color="#222d34"/>' +
          '</linearGradient>' +
        '</defs>'
      );

      // Curtain wall beveled frame around the 9 quarters
      svgParts.push(
        '<rect x="92" y="92" width="496" height="496" fill="none" stroke="rgba(210,224,234,0.42)" stroke-width="2"/>' +
        '<rect x="42" y="42" width="596" height="596" fill="none" stroke="rgba(164,192,206,0.34)" stroke-width="1.5"/>'
      );

      // Exogamous marriage arcs across the 9 quarters (zero self-loops: Q_a != Q_b)
      for (var m = 0; m < snap.marriages.length; m++) {
        var mar = snap.marriages[m];
        var r1 = Math.floor(mar.fromIndex / 3);
        var c1 = mar.fromIndex % 3;
        var r2 = Math.floor(mar.toIndex / 3);
        var c2 = mar.toIndex % 3;
        var x1 = QUARTER_BOUNDS[c1].center;
        var y1 = QUARTER_BOUNDS[r1].center;
        var x2 = QUARTER_BOUNDS[c2].center;
        var y2 = QUARTER_BOUNDS[r2].center;

        var mx = (x1 + x2) * 0.5;
        var my = (y1 + y2) * 0.5;
        var vx = x2 - x1;
        var vy = y2 - y1;
        var len = Math.sqrt(vx * vx + vy * vy) || 1;
        var bend = 26 + (m % 3) * 8;
        var cx = mx - (vy / len) * bend;
        var cy = my + (vx / len) * bend;

        var mColor = MONOPOLY_META[mar.brideMonopoly].color;
        var isHighlighted =
          (selectedQuarterIdx !== null && (mar.fromIndex === selectedQuarterIdx || mar.toIndex === selectedQuarterIdx)) ||
          (focusedMonopoly && (mar.brideMonopoly === focusedMonopoly || mar.groomMonopoly === focusedMonopoly));

        var opacity = isHighlighted ? '0.92' : '0.46';
        var width = isHighlighted ? '2.4' : '1.35';

        svgParts.push(
          '<path d="M ' + x1 + ' ' + y1 + ' Q ' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ' ' + x2 + ' ' + y2 + '" ' +
            'fill="none" stroke="' + mColor + '" stroke-width="' + width + '" stroke-opacity="' + opacity + '" stroke-dasharray="5 3" pointer-events="none"/>'
        );
      }

      // 7 Gates with Spring-Operated Drawbridges around the perimeter moat
      for (var g = 0; g < snap.gates.length; g++) {
        var gate = snap.gates[g];
        var gMeta = GATES_META[g];
        var rot = 0;
        if (gMeta.wall === 'E') rot = 90;
        else if (gMeta.wall === 'S') rot = 180;
        else if (gMeta.wall === 'W') rot = 270;

        var leafLen = gate.open ? 46 : 16;
        var leafY = gate.open ? -23 : 6;
        var leafFill = gate.open ? 'rgba(64, 206, 174, 0.30)' : 'rgba(224, 170, 72, 0.36)';
        var leafStroke = gate.open ? '#7df2d8' : '#f5c463';

        // Visible bilateral mechanical torsion/helical springs flanking each drawbridge
        var springTurns = gate.open ? 4 : 7;
        var sTop = gate.open ? -16 : -2;
        var sBot = 20;
        var sSpan = (sBot - sTop) / (springTurns * 2);
        var leftCoil = 'M -17 ' + sBot + ' ';
        var rightCoil = 'M 17 ' + sBot + ' ';
        for (var st = 0; st < springTurns * 2; st++) {
          var sy = (sBot - (st + 0.5) * sSpan).toFixed(1);
          var lx = (st % 2 === 0) ? -21 : -13;
          var rx = (st % 2 === 0) ? 13 : 21;
          leftCoil += 'L ' + lx + ' ' + sy + ' ';
          rightCoil += 'L ' + rx + ' ' + sy + ' ';
        }

        var badgeOffsetY = gMeta.wall === 'S' ? 35 : (gMeta.wall === 'N' ? -35 : 0);
        var badgeOffsetX = gMeta.wall === 'E' ? 35 : (gMeta.wall === 'W' ? -35 : 0);

        svgParts.push(
          '<g class="doro-act-svg-gate" tabindex="0" role="button" data-svg-gate="' + g + '" ' +
            'aria-label="' + gate.id + ' (' + gate.drawbridgeState + ', spring ' + gate.springTensionKNm + ' kNm)">' +
            '<g transform="translate(' + gMeta.x + ',' + gMeta.y + ') rotate(' + rot + ')">' +
              '<rect class="doro-act-gate-ring" x="-25" y="-25" width="50" height="50" rx="3" fill="rgba(12,20,25,0.55)" stroke="rgba(182,204,218,0.36)" stroke-width="1.2"/>' +
              '<rect x="-11" y="' + leafY + '" width="22" height="' + leafLen + '" fill="' + leafFill + '" stroke="' + leafStroke + '" stroke-width="1.7"/>' +
              (gate.open
                ? '<line x1="-8" y1="-14" x2="8" y2="-14" stroke="#9ff7e3" stroke-width="1"/><line x1="-8" y1="-4" x2="8" y2="-4" stroke="#9ff7e3" stroke-width="1"/><line x1="-8" y1="6" x2="8" y2="6" stroke="#9ff7e3" stroke-width="1"/>'
                : '<line x1="-9" y1="8" x2="9" y2="20" stroke="#f8d280" stroke-width="1.3"/><line x1="9" y1="8" x2="-9" y2="20" stroke="#f8d280" stroke-width="1.3"/>') +
              '<path d="' + leftCoil + '" fill="none" stroke="' + leafStroke + '" stroke-width="1.45" stroke-linejoin="round"/>' +
              '<path d="' + rightCoil + '" fill="none" stroke="' + leafStroke + '" stroke-width="1.45" stroke-linejoin="round"/>' +
              '<circle cx="-17" cy="21" r="2.6" fill="#d9e4ec"/>' +
              '<circle cx="17" cy="21" r="2.6" fill="#d9e4ec"/>' +
            '</g>' +
            '<g transform="translate(' + (gMeta.x + badgeOffsetX) + ',' + (gMeta.y + badgeOffsetY) + ')">' +
              '<rect x="-15" y="-8" width="30" height="16" rx="2" fill="#0d161b" stroke="' + leafStroke + '" stroke-width="1"/>' +
              '<text x="0" y="3.5" text-anchor="middle" fill="#eef6fa" font-size="9.5" font-weight="700">' + gate.roman + '</text>' +
            '</g>' +
          '</g>'
        );
      }

      // 4 Aluminum Towers at fortified corners (NW, NE, SE, SW) with metallic specular facets
      for (var tw = 0; tw < snap.towers.length; tw++) {
        var tower = snap.towers[tw];
        var tMeta = TOWERS_META[tw];
        var isFocusedTower = tower.id === focusedTowerId;
        var ringStroke = isFocusedTower ? '#8af5dd' : 'rgba(218,232,242,0.55)';
        var tx = tMeta.x;
        var ty = tMeta.y;
        var calloutY = ty < 340 ? ty - 34 : ty + 40;

        svgParts.push(
          '<g class="doro-act-svg-tower" tabindex="0" role="button" data-svg-tower="' + tower.id + '" ' +
            'aria-label="' + tower.label + ': spring load ' + tower.springLoadKNm + ' kNm, moat head ' + tower.moatHeadMeters + 'm">' +
            '<g transform="translate(' + tx + ',' + ty + ')">' +
              '<circle class="doro-act-tower-ring" cx="0" cy="0" r="27" fill="rgba(14,22,28,0.85)" stroke="' + ringStroke + '" stroke-width="' + (isFocusedTower ? '2.2' : '1.3') + '"/>' +
              // 8-facet specular brushed aluminum spire
              '<polygon points="0,-23 16,-16 0,0" fill="#f2f8fc" stroke="#42515b" stroke-width="0.6"/>' +
              '<polygon points="16,-16 23,0 0,0" fill="#c8d5de" stroke="#42515b" stroke-width="0.6"/>' +
              '<polygon points="23,0 16,16 0,0" fill="#8fa0ac" stroke="#42515b" stroke-width="0.6"/>' +
              '<polygon points="16,16 0,23 0,0" fill="#5e6e7a" stroke="#42515b" stroke-width="0.6"/>' +
              '<polygon points="0,23 -16,16 0,0" fill="#3b4852" stroke="#42515b" stroke-width="0.6"/>' +
              '<polygon points="-16,16 -23,0 0,0" fill="#52626e" stroke="#42515b" stroke-width="0.6"/>' +
              '<polygon points="-23,0 -16,-16 0,0" fill="#9fb0bc" stroke="#42515b" stroke-width="0.6"/>' +
              '<polygon points="-16,-16 0,-23 0,0" fill="#dce7ef" stroke="#42515b" stroke-width="0.6"/>' +
              '<circle cx="0" cy="0" r="9.5" fill="url(#doro-act-alum-nw)" stroke="#243038" stroke-width="1.2"/>' +
              '<text x="0" y="3.5" text-anchor="middle" fill="#0e171d" font-size="9.2" font-weight="800">' + tower.id + '</text>' +
            '</g>' +
            '<g transform="translate(' + tx + ',' + calloutY + ')">' +
              '<rect x="-36" y="-8" width="72" height="15" rx="2" fill="rgba(11,18,23,0.9)" stroke="rgba(182,204,218,0.38)" stroke-width="0.9"/>' +
              '<text x="0" y="2.8" text-anchor="middle" fill="#cfe2ec" font-size="8.4">' + tower.springLoadKNm + 'kN&middot;' + tower.moatHeadMeters + 'm</text>' +
            '</g>' +
          '</g>'
        );
      }

      refs['plan-svg'].innerHTML = svgParts.join('');
    }

    function drawCanvasFrame(snap, phase) {
      var canvas = refs.canvas;
      var stage = refs['stage-square'];
      if (!canvas || !stage) return;

      var rect = stage.getBoundingClientRect();
      var cssW = Math.max(240, Math.round(rect.width || 520));
      var cssH = Math.max(240, Math.round(rect.height || cssW));
      var dpr = Math.min(2, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);
      var targetW = Math.round(cssW * dpr);
      var targetH = Math.round(cssH * dpr);

      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }

      var ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.save();
      ctx.scale(targetW / PLAN_SIZE, targetH / PLAN_SIZE);
      ctx.clearRect(0, 0, PLAN_SIZE, PLAN_SIZE);

      // Brushed aluminum plinth base
      var baseGrad = ctx.createLinearGradient(0, 0, PLAN_SIZE, PLAN_SIZE);
      baseGrad.addColorStop(0, '#17232a');
      baseGrad.addColorStop(0.5, '#111b21');
      baseGrad.addColorStop(1, '#0c1418');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, PLAN_SIZE, PLAN_SIZE);

      // Perimeter Moat (42..90 & 590..638)
      var openRatio = snap.totals.openGates / 7;
      var moatAlpha = (0.45 + openRatio * 0.35).toFixed(2);
      ctx.fillStyle = 'rgba(18, 86, 73, ' + moatAlpha + ')';
      ctx.fillRect(42, 42, 596, 48);
      ctx.fillRect(42, 590, 596, 48);
      ctx.fillRect(42, 90, 48, 500);
      ctx.fillRect(590, 90, 48, 500);

      // Animated/static moat circulation dashes
      ctx.strokeStyle = 'rgba(96, 232, 200, ' + (0.22 + openRatio * 0.38).toFixed(2) + ')';
      ctx.lineWidth = 1.4;
      ctx.setLineDash([10, 12]);
      ctx.lineDashOffset = reducedMotion ? 0 : -(phase * (18 + openRatio * 42));
      ctx.strokeRect(66, 66, 548, 548);
      ctx.setLineDash([]);

      // 4 Green Canals crossing the city (2 North-South at x=244..268 & 412..436, 2 East-West at y=244..268 & 412..436)
      var canalCoords = [
        { axis: 'NS', x: 244, y: 90, w: 24, h: 500, data: snap.canals[0] },
        { axis: 'NS', x: 412, y: 90, w: 24, h: 500, data: snap.canals[1] },
        { axis: 'EW', x: 90, y: 244, w: 500, h: 24, data: snap.canals[2] },
        { axis: 'EW', x: 90, y: 412, w: 500, h: 24, data: snap.canals[3] }
      ];

      for (var c = 0; c < canalCoords.length; c++) {
        var cc = canalCoords[c];
        var fNorm = cc.data.flowPct / 100;
        ctx.fillStyle = 'rgba(20, 98, 82, ' + (0.56 + fNorm * 0.34).toFixed(2) + ')';
        ctx.fillRect(cc.x, cc.y, cc.w, cc.h);

        ctx.strokeStyle = 'rgba(116, 244, 214, ' + (0.30 + fNorm * 0.55).toFixed(2) + ')';
        ctx.lineWidth = 1.3;
        ctx.setLineDash([8, 10]);
        ctx.lineDashOffset = reducedMotion ? 0 : -(phase * (14 + fNorm * 56));

        if (cc.axis === 'NS') {
          ctx.beginPath();
          ctx.moveTo(cc.x + 8, cc.y + 4);
          ctx.lineTo(cc.x + 8, cc.y + cc.h - 4);
          ctx.moveTo(cc.x + 16, cc.y + 4);
          ctx.lineTo(cc.x + 16, cc.y + cc.h - 4);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.moveTo(cc.x + 4, cc.y + 8);
          ctx.lineTo(cc.x + cc.w - 4, cc.y + 8);
          ctx.moveTo(cc.x + 4, cc.y + 16);
          ctx.lineTo(cc.x + cc.w - 4, cc.y + 16);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      // 4 Canal lock intersections
      var lockCenters = [256, 424];
      for (var lx = 0; lx < 2; lx++) {
        for (var ly = 0; ly < 2; ly++) {
          ctx.strokeStyle = 'rgba(182, 248, 232, 0.55)';
          ctx.lineWidth = 1.2;
          ctx.strokeRect(lockCenters[lx] - 11, lockCenters[ly] - 11, 22, 22);
        }
      }

      // Render each of the 9 Quarters: 300 micro-architectural houses & 700 chimney flues per quarter
      for (var q = 0; q < 9; q++) {
        var qData = snap.quarters[q];
        var qRow = Math.floor(q / 3);
        var qCol = q % 3;
        var qx = QUARTER_BOUNDS[qCol].start;
        var qy = QUARTER_BOUNDS[qRow].start;

        ctx.fillStyle = 'rgba(18, 28, 34, 0.92)';
        ctx.fillRect(qx, qy, 144, 144);

        var mAccent = MONOPOLY_META[qData.monopoly].color;
        var houses = QUARTER_ROOF_MATRICES[q];
        // Active threshold mapped from activeChimneys (out of 700) to house rank (out of 300)
        var litHouseThreshold = Math.round((qData.activeChimneys / 700) * 300);

        var padX = qx + 5.5;
        var padY = qy + 20.5;
        var stepX = 6.68;
        var stepY = 6.85;

        for (var h = 0; h < 300; h++) {
          var house = houses[h];
          var hx = padX + house.col * stepX;
          var hy = padY + house.row * stepY;
          var isLit = house.rank < litHouseThreshold;

          // Brushed metallic micro-roof plot
          ctx.fillStyle = isLit ? 'rgba(154, 178, 192, 0.30)' : 'rgba(92, 110, 122, 0.19)';
          ctx.fillRect(hx, hy, 5.1, 5.1);

          // Exact 2 or 3 chimney flues per house (100*3 + 200*2 = 700 chimneys!)
          ctx.fillStyle = isLit ? mAccent : 'rgba(176, 196, 208, 0.45)';
          if (house.flues === 3) {
            ctx.fillRect(hx + 0.6, hy + 0.8, 1.05, 1.05);
            ctx.fillRect(hx + 2.1, hy + 2.1, 1.05, 1.05);
            ctx.fillRect(hx + 3.5, hy + 3.4, 1.05, 1.05);
          } else {
            ctx.fillRect(hx + 0.9, hy + 1.1, 1.05, 1.05);
            ctx.fillRect(hx + 3.2, hy + 3.1, 1.05, 1.05);
          }

          // Subtle rising chimney plumes on a deterministic subset of lit hearths
          if (isLit && (h % 9 === 0)) {
            var drift = reducedMotion ? 0 : Math.sin(phase * 2.4 + h * 0.37 + q) * 1.6;
            var lift = reducedMotion ? 1.8 : ((phase * 8 + h * 1.3) % 5.5);
            ctx.fillStyle = 'rgba(182, 244, 228, 0.34)';
            ctx.beginPath();
            ctx.arc(hx + 2.5 + drift, hy + 1.5 - lift, 1.25, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
    }

    function updateDomFromSnapshot(snap) {
      refs['top-flux'].textContent =
        'Gates ' + snap.totals.openGates + '/7 \u00b7 Flux ' + snap.totals.canalFluxPct + '% \u00b7 Lit ' + snap.totals.activeChimneysCitywide + '/6,300';
      refs['top-gen'].textContent = snap.epochLabel;
      refs['gen-label'].textContent = snap.epochLabel;

      // Update 9 <quarter-cell> nodes
      for (var q = 0; q < 9; q++) {
        var qData = snap.quarters[q];
        var qEl = quarterCellEls[q];
        var mMeta = MONOPOLY_META[qData.monopoly];
        var mNode = qEl.querySelector('[data-q-monopoly]');
        var uNode = qEl.querySelector('[data-q-union]');
        mNode.textContent = mMeta.code;
        mNode.style.color = mMeta.stroke;
        mNode.style.backgroundColor = mMeta.fillBg;
        uNode.textContent = '\u2192' + qData.marriesTo;

        var isSel = selectedQuarterIdx === q;
        var isViol = violationQuarterIdx === q;
        var isAstroHi = focusedMonopoly === qData.monopoly;

        qEl.setAttribute('data-selected', isSel ? 'true' : 'false');
        qEl.setAttribute('data-violation', isViol ? 'true' : 'false');
        qEl.setAttribute('data-astrolabe-highlight', isAstroHi ? 'true' : 'false');
        qEl.setAttribute(
          'aria-label',
          qData.id + ': 300 houses, 700 chimneys (' + qData.activeChimneys + ' active), monopoly ' +
            qData.monopoly + ', daughters wed ' + qData.marriesTo
        );
      }

      // Update 7 <drawbridge-spring> nodes
      for (var g = 0; g < 7; g++) {
        var gate = snap.gates[g];
        var gEl = gateSpringEls[g];
        gEl.setAttribute('data-open', gate.open ? 'true' : 'false');
        gEl.setAttribute('aria-pressed', gate.open ? 'true' : 'false');
        gEl.setAttribute(
          'aria-label',
          gate.id + ': drawbridge ' + gate.drawbridgeState + ', spring ' + gate.springTensionKNm + ' kNm'
        );
        gEl.querySelector('[data-gate-coil]').innerHTML = buildSpringCoilSvgMarkup(gate.open);
        gEl.querySelector('[data-gate-status]').textContent = gate.open ? 'OPEN' : 'RAISED';
        gEl.querySelector('[data-gate-torque]').textContent = gate.springTensionKNm + 'kN';
      }

      // Update Generation Reckoner buttons & invertible matrix operator readout
      for (var gb = 0; gb < genBtnEls.length; gb++) {
        var gBtn = genBtnEls[gb];
        var val = parseInt(gBtn.getAttribute('data-gen'), 10);
        var active = val === snap.generation;
        gBtn.setAttribute('data-active', active ? 'true' : 'false');
        gBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
      }
      refs['matrix-readout'].innerHTML =
        '<span>Operator: <strong>P<sup>' + snap.generation + '</sup> &isin; GL<sub>9</sub>(&Zopf;)</strong>, det = ' +
          snap.matrixOperator.determinant + ', P<sup>&minus;1</sup> = P<sup>&top;</sup></span>' +
        '<span>&sigma;(t) = [' + snap.matrixOperator.permutation.map(function (idx) { return 'Q' + (idx + 1); }).join(',') + ']</span>';

      // Update Brass Astrolabe Dial & Copy
      refs['astrolabe-alidade'].style.transform = 'rotate(' + snap.astrolabe.alidadeDeg + 'deg)';
      refs['astrolabe-sub'].textContent = 'Alidade ' + snap.astrolabe.alidadeDeg + '\u00b0 \u00b7 Holders: ' + snap.astrolabe.holders.join(', ');
      refs['astrolabe-copy'].textContent =
        'Brass celestial reckoners held by ' + snap.astrolabe.holders.join(', ') +
        ' (dowries in ' + (snap.astrolabe.dowryHolders.join(', ') || 'none') +
        '). Click dial or press [A] to align azimuth & emit astrolabe focus.';

      // Update Exogamy Decree banner
      var decreeEl = refs.decree;
      if (violationQuarterIdx !== null && lastViolation) {
        decreeEl.setAttribute('data-mode', 'violation');
        decreeEl.textContent = lastViolation.message;
      } else if (selectedQuarterIdx !== null) {
        var selCode = 'Q' + (selectedQuarterIdx + 1);
        decreeEl.setAttribute('data-mode', 'selected');
        decreeEl.textContent =
          'BRIDE QUARTER ' + selCode + ' SELECTED (' + snap.quarters[selectedQuarterIdx].monopoly +
          ') \u2014 Select a distinct quarter Q_b \u2260 ' + selCode +
          ' to wed & exchange monopolies. Clicking ' + selCode + ' again triggers Dorothea\'s Exogamy Prohibition.';
      } else if (lastAllianceMsg) {
        decreeEl.setAttribute('data-mode', 'normal');
        decreeEl.textContent = lastAllianceMsg;
      } else {
        decreeEl.setAttribute('data-mode', 'normal');
        decreeEl.textContent =
          'LAW OF EXOGAMY (Q_a \u2260 Q_b): Nubile girls of each quarter marry youths ONLY of other quarters, exchanging hereditary monopolies.';
      }

      // Update 4 Monopoly tiles
      for (var mk = 0; mk < MONOPOLIES.length; mk++) {
        var mKey = MONOPOLIES[mk];
        var mTile = monopolyTileEls[mKey];
        var summary = snap.monopolySummary[mKey];
        mTile.setAttribute('data-focused', focusedMonopoly === mKey ? 'true' : 'false');
        mTile.querySelector('[data-monopoly-holders]').textContent =
          'Houses: ' + summary.holders.join(', ') + ' \u00b7 Flux ' + summary.fluxIndex;
      }

      // Update 9-Quarter Ledger Table
      var rowsHtml = [];
      for (var rq = 0; rq < 9; rq++) {
        var rqData = snap.quarters[rq];
        var rqMeta = MONOPOLY_META[rqData.monopoly];
        rowsHtml.push(
          '<tr>' +
            '<td class="doro-act-td"><strong>' + rqData.id + '</strong></td>' +
            '<td class="doro-act-td">300 houses &middot; 700 chimneys</td>' +
            '<td class="doro-act-td">' + rqData.activeChimneys + '</td>' +
            '<td class="doro-act-td" style="color:#86f0d7;">' + rqData.id + ' &rarr; ' + rqData.marriesTo + '</td>' +
            '<td class="doro-act-td" style="color:' + rqMeta.stroke + ';">' + rqData.monopoly + ' <span style="color:#8da6b5;">(' + rqData.dowryMonopoly + ')</span></td>' +
          '</tr>'
        );
      }
      refs['ledger-tbody'].innerHTML = rowsHtml.join('');
      refs['ledger-tfoot'].innerHTML =
        '<td class="doro-act-foot-td">CITY</td>' +
        '<td class="doro-act-foot-td">2,700 houses &middot; 6,300 chimneys</td>' +
        '<td class="doro-act-foot-td">' + snap.totals.activeChimneysCitywide + '</td>' +
        '<td class="doro-act-foot-td">9/9 exogamous</td>' +
        '<td class="doro-act-foot-td">4 monopolies</td>';

      // Update 4 Aluminum Towers strip
      var towerChips = [];
      for (var tw = 0; tw < snap.towers.length; tw++) {
        var tItem = snap.towers[tw];
        var tActive = tItem.id === focusedTowerId;
        towerChips.push(
          '<div class="doro-act-tower-chip" tabindex="0" role="button" data-tower-chip="' + tItem.id + '" data-active="' + (tActive ? 'true' : 'false') + '">' +
            '<strong>' + tItem.id + ' Tower</strong> &middot; ' + tItem.azimuthDeg + '&deg;<br>' +
            'Load ' + tItem.springLoadKNm + 'kNm &middot; ' + tItem.moatHeadMeters + 'm' +
          '</div>'
        );
      }
      refs['towers-strip'].innerHTML = towerChips.join('');

      renderPlanSvg(snap);
      drawCanvasFrame(snap, animPhase);
    }

    function emitStateChange() {
      if (typeof opts.onStateChange === 'function') {
        opts.onStateChange(cloneSnapshot(currentSnapshot));
      }
    }

    function refreshStateAndNotify(shouldNotify) {
      currentSnapshot = computeDerivedModel();
      updateDomFromSnapshot(currentSnapshot);
      if (shouldNotify) {
        emitStateChange();
      }
    }

    function cloneSnapshot(snap) {
      return JSON.parse(JSON.stringify(snap));
    }

    function triggerAstrolabeFocus() {
      astrolabeActivations += 1;
      focusedMonopoly = 'astrolabes';
      violationQuarterIdx = null;
      refreshStateAndNotify(true);
      if (typeof opts.onAstrolabeFocus === 'function') {
        opts.onAstrolabeFocus(cloneSnapshot(currentSnapshot));
      }
      return cloneSnapshot(currentSnapshot);
    }

    function setGeneration(offsetInt) {
      if (destroyed) return cloneSnapshot(currentSnapshot);
      generation = clampGeneration(offsetInt);
      selectedQuarterIdx = null;
      violationQuarterIdx = null;
      refreshStateAndNotify(true);
      return cloneSnapshot(currentSnapshot);
    }

    function toggleDrawbridge(gateIndex) {
      if (destroyed) return cloneSnapshot(currentSnapshot);
      var gIdx = parseGateIndex(gateIndex);
      if (gIdx < 0 || gIdx > 6) return cloneSnapshot(currentSnapshot);

      var gatesNow = transformGates(gatesAtZero, generation);
      gatesNow[gIdx] = !gatesNow[gIdx];
      gatesAtZero = untransformGates(gatesNow, generation);
      violationQuarterIdx = null;
      refreshStateAndNotify(true);
      return cloneSnapshot(currentSnapshot);
    }

    function pairQuarters(qA, qB) {
      if (destroyed) return cloneSnapshot(currentSnapshot);
      var parsed = parseQuarterPairArgs(qA, qB);
      var idxA = parsed[0];
      var idxB = parsed[1];
      if (idxA < 0 || idxA > 8 || idxB < 0 || idxB > 8) {
        return cloneSnapshot(currentSnapshot);
      }

      if (idxA === idxB) {
        var qCode = 'Q' + (idxA + 1);
        exogamyViolationsCount += 1;
        violationQuarterIdx = idxA;
        selectedQuarterIdx = null;
        lastViolation = {
          quarter: qCode,
          generation: generation,
          message:
            'EXOGAMY LAW ENFORCED (' + qCode + ' \u2260 ' + qCode + '): Intra-quarter marriage is forbidden in Dorothea! ' +
            'Nubile daughters of ' + qCode + ' may wed youths ONLY of other quarters (Q1\u2013Q9 excluding ' + qCode + ').'
        };
        refreshStateAndNotify(true);
        return cloneSnapshot(currentSnapshot);
      }

      // Valid exogamous marriage between two distinct quarters: exchange monopolies & update derangement!
      var chartersNow = transformCharters(chartersAtZero, generation);
      var marriageNow = transformMarriageMap(marriageAtZero, generation);

      var beforeA = chartersNow[idxA][0];
      var beforeB = chartersNow[idxB][0];

      var updatedCharters = exchangeMonopolyCharters(chartersNow, idxA, idxB);
      var updatedMarriage = applyExogamousPairing(marriageNow, idxA, idxB);

      var afterA = updatedCharters[idxA][0];
      var afterB = updatedCharters[idxB][0];

      chartersAtZero = untransformCharters(updatedCharters, generation);
      marriageAtZero = untransformMarriageMap(updatedMarriage, generation);

      customAlliancesForged += 1;
      selectedQuarterIdx = null;
      violationQuarterIdx = null;
      lastAllianceMsg =
        'COVENANT SEALED: Daughters of Q' + (idxA + 1) + ' wed youths of Q' + (idxB + 1) +
        ' \u00b7 Exchanged monopolies (' + beforeA + ' \u21c4 ' + beforeB +
        ' \u2192 Q' + (idxA + 1) + ':' + afterA + ', Q' + (idxB + 1) + ':' + afterB + ').';

      refreshStateAndNotify(true);
      return cloneSnapshot(currentSnapshot);
    }

    function handleQuarterClick(qIdx) {
      if (selectedQuarterIdx === null) {
        selectedQuarterIdx = qIdx;
        violationQuarterIdx = null;
        refreshStateAndNotify(true);
        return;
      }
      // Second click: if same quarter clicked twice, pairQuarters enforces Exogamy Law!
      pairQuarters(selectedQuarterIdx + 1, qIdx + 1);
    }

    function syncResponsiveClasses(w, h) {
      viewportWidth = Math.max(280, Math.round(Number(w) || 1280));
      viewportHeight = Math.max(320, Math.round(Number(h) || 800));
      rootEl.classList.toggle('doro-act-mobile', viewportWidth < 740);
      rootEl.classList.toggle('doro-act-compact', viewportWidth < 940);
    }

    function resize(width, height) {
      if (destroyed) return;
      syncResponsiveClasses(width, height);
      currentSnapshot.viewport = { width: viewportWidth, height: viewportHeight };
      drawCanvasFrame(currentSnapshot, animPhase);
    }

    function syncAnimationLoop() {
      if (rafId !== null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (!reducedMotion && !destroyed && typeof requestAnimationFrame === 'function') {
        lastFrameTs = 0;
        var tick = function (ts) {
          if (destroyed || reducedMotion) {
            rafId = null;
            return;
          }
          if (!lastFrameTs) lastFrameTs = ts;
          var dt = Math.min(0.06, Math.max(0, (ts - lastFrameTs) / 1000));
          lastFrameTs = ts;
          animPhase += dt;
          drawCanvasFrame(currentSnapshot, animPhase);
          rafId = requestAnimationFrame(tick);
        };
        rafId = requestAnimationFrame(tick);
      } else {
        drawCanvasFrame(currentSnapshot, animPhase);
      }
    }

    function setReducedMotion(flag) {
      if (destroyed) return;
      manualReducedMotion = Boolean(flag);
      reducedMotion = manualReducedMotion;
      rootEl.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
      refreshStateAndNotify(true);
      syncAnimationLoop();
    }

    // Delegated UI Click & Keyboard Activation Listeners
    function onRootClick(ev) {
      var target = ev.target;
      if (!target || !target.closest) return;

      var qCell = target.closest('quarter-cell[data-quarter-idx]');
      if (qCell) {
        handleQuarterClick(parseInt(qCell.getAttribute('data-quarter-idx'), 10));
        return;
      }

      var springGate = target.closest('drawbridge-spring[data-gate-idx]');
      if (springGate) {
        toggleDrawbridge(parseInt(springGate.getAttribute('data-gate-idx'), 10));
        return;
      }

      var svgGate = target.closest('[data-svg-gate]');
      if (svgGate) {
        toggleDrawbridge(parseInt(svgGate.getAttribute('data-svg-gate'), 10));
        return;
      }

      var svgTower = target.closest('[data-svg-tower]');
      if (svgTower) {
        focusedTowerId = svgTower.getAttribute('data-svg-tower');
        refreshStateAndNotify(true);
        return;
      }

      var towerChip = target.closest('[data-tower-chip]');
      if (towerChip) {
        focusedTowerId = towerChip.getAttribute('data-tower-chip');
        refreshStateAndNotify(true);
        return;
      }

      var genStep = target.closest('[data-gen]');
      if (genStep) {
        setGeneration(parseInt(genStep.getAttribute('data-gen'), 10));
        return;
      }

      var astroDial = target.closest('[data-ref="astrolabe-dial"]');
      var astroBtn = target.closest('[data-ref="astrolabe-btn"]');
      if (astroDial || astroBtn) {
        triggerAstrolabeFocus();
        return;
      }

      var monoTile = target.closest('[data-monopoly]');
      if (monoTile) {
        var mName = monoTile.getAttribute('data-monopoly');
        if (mName === 'astrolabes') {
          triggerAstrolabeFocus();
        } else {
          focusedMonopoly = focusedMonopoly === mName ? null : mName;
          refreshStateAndNotify(true);
        }
      }
    }

    function onRootKeyDown(ev) {
      var key = ev.key;
      var target = ev.target;

      // Activate focused role="button" elements with Enter or Space
      if ((key === 'Enter' || key === ' ') && target && target.tagName !== 'BUTTON') {
        if (
          target.matches &&
          target.matches(
            'quarter-cell, drawbridge-spring, [data-svg-gate], [data-svg-tower], [data-ref="astrolabe-dial"], [data-monopoly], [data-tower-chip]'
          )
        ) {
          ev.preventDefault();
          onRootClick({ target: target });
          return;
        }
      }

      // 2D Arrow navigation across the 3x3 quarter grid when a quarter-cell is focused
      if (target && target.matches && target.matches('quarter-cell[data-quarter-idx]')) {
        var curQ = parseInt(target.getAttribute('data-quarter-idx'), 10);
        var nextQ = null;
        if (key === 'ArrowRight') nextQ = (curQ + 1) % 9;
        else if (key === 'ArrowLeft') nextQ = (curQ + 8) % 9;
        else if (key === 'ArrowDown') nextQ = (curQ + 3) % 9;
        else if (key === 'ArrowUp') nextQ = (curQ + 6) % 9;
        if (nextQ !== null && quarterCellEls[nextQ]) {
          ev.preventDefault();
          quarterCellEls[nextQ].focus();
          return;
        }
      }
    }

    function onDocumentKeyDown(ev) {
      if (destroyed) return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      var activeTag = ev.target && ev.target.tagName ? ev.target.tagName.toUpperCase() : '';
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') return;

      var key = ev.key;
      if (key >= '1' && key <= '7') {
        ev.preventDefault();
        toggleDrawbridge(parseInt(key, 10) - 1);
        return;
      }
      if (key === 'a' || key === 'A') {
        ev.preventDefault();
        triggerAstrolabeFocus();
        return;
      }
      if (key === '[') {
        ev.preventDefault();
        setGeneration(generation - 1);
        return;
      }
      if (key === ']') {
        ev.preventDefault();
        setGeneration(generation + 1);
        return;
      }
      if (key === '0') {
        ev.preventDefault();
        setGeneration(0);
        return;
      }
      if (key === 'Escape' && selectedQuarterIdx !== null) {
        selectedQuarterIdx = null;
        refreshStateAndNotify(true);
      }
    }

    function onMediaChange(e) {
      if (manualReducedMotion === null) {
        reducedMotion = Boolean(e.matches);
        rootEl.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
        refreshStateAndNotify(true);
        syncAnimationLoop();
      }
    }

    rootEl.addEventListener('click', onRootClick);
    rootEl.addEventListener('keydown', onRootKeyDown);
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', onDocumentKeyDown);
    }
    if (mediaQuery) {
      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', onMediaChange);
      } else if (typeof mediaQuery.addListener === 'function') {
        mediaQuery.addListener(onMediaChange);
      }
    }

    if (typeof ResizeObserver === 'function') {
      resizeObserver = new ResizeObserver(function (entries) {
        if (destroyed || !entries || !entries.length) return;
        var cr = entries[0].contentRect;
        if (cr && cr.width > 0) {
          resize(cr.width, cr.height || viewportHeight);
        }
      });
      resizeObserver.observe(containerEl);
    }

    syncResponsiveClasses(viewportWidth, viewportHeight);
    updateDomFromSnapshot(currentSnapshot);
    syncAnimationLoop();

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      if (rafId !== null && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
      rootEl.removeEventListener('click', onRootClick);
      rootEl.removeEventListener('keydown', onRootKeyDown);
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', onDocumentKeyDown);
      }
      if (mediaQuery) {
        if (typeof mediaQuery.removeEventListener === 'function') {
          mediaQuery.removeEventListener('change', onMediaChange);
        } else if (typeof mediaQuery.removeListener === 'function') {
          mediaQuery.removeListener(onMediaChange);
        }
      }
      if (rootEl.parentNode) {
        rootEl.parentNode.removeChild(rootEl);
      }
    }

    return {
      setGeneration: setGeneration,
      toggleDrawbridge: toggleDrawbridge,
      pairQuarters: pairQuarters,
      setReducedMotion: setReducedMotion,
      resize: resize,
      getState: function () {
        return cloneSnapshot(currentSnapshot);
      },
      focusAstrolabe: triggerAstrolabeFocus,
      destroy: destroy
    };
  }

  var DorotheaActuary = {
    mount: function (containerEl, options) {
      var target = typeof containerEl === 'string' && typeof document !== 'undefined'
        ? document.querySelector(containerEl)
        : containerEl;
      if (!target) {
        throw new Error('DorotheaActuary.mount requires a valid container element.');
      }
      if (activeInstance) {
        activeInstance.destroy();
        activeInstance = null;
      }
      activeInstance = createActuaryInstance(target, options || {});
      return activeInstance;
    },
    setGeneration: function (offsetInt) {
      return activeInstance ? activeInstance.setGeneration(offsetInt) : null;
    },
    toggleDrawbridge: function (gateIndex) {
      return activeInstance ? activeInstance.toggleDrawbridge(gateIndex) : null;
    },
    pairQuarters: function (qA, qB) {
      return activeInstance ? activeInstance.pairQuarters(qA, qB) : null;
    },
    setReducedMotion: function (flag) {
      if (activeInstance) activeInstance.setReducedMotion(flag);
    },
    resize: function (width, height) {
      if (activeInstance) activeInstance.resize(width, height);
    },
    getState: function () {
      return activeInstance ? activeInstance.getState() : null;
    },
    destroy: function () {
      if (activeInstance) {
        activeInstance.destroy();
        activeInstance = null;
      }
    }
  };

  global.DorotheaActuary = DorotheaActuary;
})(typeof window !== 'undefined' ? window : globalThis);
