/*
 * City 30: Melania (Chapter V - Cities & the Dead 1)
 * Layer: layers/mortality_role_cascade.js
 * Mortality Role-Cascade, Chorus Split, Solitary Concentration & Secular Denouement Engine.
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

  const ROLE_DEFINITIONS = Object.freeze([
    {
      roleId: 'braggart_soldier', index: 0, title: 'Braggart Soldier', shortTitle: 'Soldier',
      knotId: 'gloriosus_duet', partnerRoleId: 'parasite', chainKey: 'A',
      initialName: 'Ferrante Spavento', initialAge: 46,
      cradlePortico: 'West Portico of Drums', sepulcherSector: 'North-West Cypress Niche', sectorAngle: 0.24
    },
    {
      roleId: 'parasite', index: 1, title: 'Parasite', shortTitle: 'Parasite',
      knotId: 'gloriosus_duet', partnerRoleId: 'braggart_soldier', chainKey: 'A',
      initialName: 'Zanni Mosca', initialAge: 31,
      cradlePortico: 'West Portico of Drums', sepulcherSector: 'North Cypress Niche', sectorAngle: 0.72
    },
    {
      roleId: 'young_wastrel', index: 2, title: 'Young Wastrel', shortTitle: 'Wastrel',
      knotId: 'squander_duet', partnerRoleId: 'prostitute', chainKey: 'C',
      initialName: 'Florindo Corner', initialAge: 19,
      cradlePortico: 'East Portico of Dice', sepulcherSector: 'North-East Cypress Niche', sectorAngle: 1.20
    },
    {
      roleId: 'prostitute', index: 3, title: 'Prostitute', shortTitle: 'Prostitute',
      knotId: 'squander_duet', partnerRoleId: 'young_wastrel', chainKey: 'B',
      initialName: 'Imperia Bellincioni', initialAge: 29,
      cradlePortico: 'South Portico of Veils', sepulcherSector: 'East Cypress Niche', sectorAngle: 1.68
    },
    {
      roleId: 'miserly_father', index: 4, title: 'Miserly Father', shortTitle: 'Father',
      knotId: 'dowry_duet', partnerRoleId: 'amorous_daughter', chainKey: 'C',
      initialName: 'Pantalone Grimani', initialAge: 58,
      cradlePortico: 'East Portico of Dice', sepulcherSector: 'South-East Cypress Niche', sectorAngle: 2.16
    },
    {
      roleId: 'amorous_daughter', index: 5, title: 'Amorous Daughter', shortTitle: 'Daughter',
      knotId: 'dowry_duet', partnerRoleId: 'miserly_father', chainKey: 'B',
      initialName: 'Isabella Querini', initialAge: 17,
      cradlePortico: 'South Portico of Veils', sepulcherSector: 'South Cypress Niche', sectorAngle: 2.64
    },
    {
      roleId: 'foolish_servant', index: 6, title: 'Foolish Servant', shortTitle: 'Servant',
      knotId: 'intrigue_duet', partnerRoleId: 'procuress', chainKey: 'A',
      initialName: 'Arlecchino Baffo', initialAge: 18,
      cradlePortico: 'West Portico of Drums', sepulcherSector: 'South-West Cypress Niche', sectorAngle: 3.12
    },
    {
      roleId: 'procuress', index: 7, title: 'Procuress', shortTitle: 'Procuress',
      knotId: 'intrigue_duet', partnerRoleId: 'foolish_servant', chainKey: 'B',
      initialName: 'Celestina Morosini', initialAge: 52,
      cradlePortico: 'South Portico of Veils', sepulcherSector: 'West Cypress Niche', sectorAngle: 3.60
    },
    {
      roleId: 'hypocrite', index: 8, title: 'Hypocrite', shortTitle: 'Hypocrite',
      knotId: 'omen_trio', partnerRoleId: 'astrologer', chainKey: 'C',
      initialName: 'Tartuffo Loredan', initialAge: 34,
      cradlePortico: 'East Portico of Dice', sepulcherSector: 'Inner Cypress Ambulatory', sectorAngle: 4.08
    },
    {
      roleId: 'astrologer', index: 9, title: 'Astrologer', shortTitle: 'Astrologer',
      knotId: 'omen_trio', partnerRoleId: 'confidante', chainKey: 'C',
      initialName: 'Albumasar Barbaro', initialAge: 72,
      cradlePortico: 'East Portico of Dice', sepulcherSector: 'Zenith Cypress Vault', sectorAngle: 4.56
    },
    {
      roleId: 'confidante', index: 10, title: 'Confidante', shortTitle: 'Confidante',
      knotId: 'omen_trio', partnerRoleId: 'hypocrite', chainKey: 'B',
      initialName: 'Colombina Foscari', initialAge: 67,
      cradlePortico: 'South Portico of Veils', sepulcherSector: 'Whispering Cypress Vault', sectorAngle: 5.04
    },
    {
      roleId: 'usurer', index: 11, title: 'Usurer', shortTitle: 'Usurer',
      knotId: 'exile_ledger', partnerRoleId: 'fallen_princes', chainKey: 'C',
      initialName: 'Shylock Vendramin', initialAge: 64,
      cradlePortico: 'East Portico of Dice', sepulcherSector: 'Scale-Bearer Sepulcher', sectorAngle: 5.52
    },
    {
      roleId: 'fallen_princes', index: 12, title: 'A Hundred Thousand Fallen Princes', shortTitle: 'Fallen Princes',
      knotId: 'exile_ledger', partnerRoleId: 'usurer', chainKey: 'A',
      initialName: 'Paleologus & Exiled Peers', initialAge: 61,
      cradlePortico: 'West Portico of Drums', sepulcherSector: 'Coroneted Ossuary Ring', sectorAngle: 6.00
    }
  ].map(function (d) { return Object.freeze(d); }));

  const ROLE_META_BY_ID = (function () {
    const map = {};
    for (let i = 0; i < ROLE_DEFINITIONS.length; i++) {
      map[ROLE_DEFINITIONS[i].roleId] = ROLE_DEFINITIONS[i];
    }
    return Object.freeze(map);
  })();

  const CASCADE_CHAINS = (function () {
    const chainA = Object.freeze({
      id: 'chain_a',
      key: 'A',
      label: 'Lineage A: Servant -> Parasite -> Braggart Soldier -> Fallen Princes',
      cradlePortico: 'West Portico of Drums',
      entryRole: 'foolish_servant',
      elderRole: 'fallen_princes',
      roles: Object.freeze(['foolish_servant', 'parasite', 'braggart_soldier', 'fallen_princes'])
    });
    const chainB = Object.freeze({
      id: 'chain_b',
      key: 'B',
      label: 'Lineage B: Amorous Daughter -> Prostitute -> Procuress -> Confidante',
      cradlePortico: 'South Portico of Veils',
      entryRole: 'amorous_daughter',
      elderRole: 'confidante',
      roles: Object.freeze(['amorous_daughter', 'prostitute', 'procuress', 'confidante'])
    });
    const chainC = Object.freeze({
      id: 'chain_c',
      key: 'C',
      label: 'Lineage C: Young Wastrel -> Hypocrite -> Miserly Father -> Usurer -> Astrologer',
      cradlePortico: 'East Portico of Dice',
      entryRole: 'young_wastrel',
      elderRole: 'astrologer',
      roles: Object.freeze(['young_wastrel', 'hypocrite', 'miserly_father', 'usurer', 'astrologer'])
    });
    const list = [chainA, chainB, chainC];
    const byRole = {};
    for (let c = 0; c < list.length; c++) {
      const ch = list[c];
      for (let s = 0; s < ch.roles.length; s++) {
        byRole[ch.roles[s]] = Object.freeze({
          chain: ch,
          chainKey: ch.key,
          stageIndex: s,
          entryRole: ch.entryRole,
          predecessorRole: s > 0 ? ch.roles[s - 1] : null,
          successorRole: s + 1 < ch.roles.length ? ch.roles[s + 1] : null
        });
      }
    }
    Object.defineProperties(list, {
      A: { value: chainA, enumerable: false },
      B: { value: chainB, enumerable: false },
      C: { value: chainC, enumerable: false },
      byKey: { value: Object.freeze({ A: chainA, B: chainB, C: chainC }), enumerable: false },
      byRole: { value: Object.freeze(byRole), enumerable: false }
    });
    return Object.freeze(list);
  })();

  const SECULAR_EPOCHS = Object.freeze([
    Object.freeze({
      index: 0,
      minProgress: 0.00,
      title: 'Epoch I · Primeval Entanglement of the Masks',
      plotShift: 'Sword-boasts, locked strongboxes, and pawned coronets hold their opening balance across the checkered Scamozzi flags.'
    }),
    Object.freeze({
      index: 1,
      minProgress: 0.09,
      title: 'Epoch II · Complicity at the Thresholds',
      plotShift: 'Former servants inheriting the Parasite trencher tilt flattery toward mockery while Procuress and Confidante trade iron keys.'
    }),
    Object.freeze({
      index: 2,
      minProgress: 0.22,
      title: 'Epoch III · Inversion of Dowry and Ledger',
      plotShift: 'Wastrels aged into Miserly Fathers recognize their own old IOUs on the Usurer scales beside the Fallen Princes.'
    }),
    Object.freeze({
      index: 3,
      minProgress: 0.40,
      title: 'Epoch IV · Polyphonic Fracture of the Square',
      plotShift: 'Recruited choruses multiply single boasts into antiphonal litigation beneath the Astrologer brass quadrant.'
    }),
    Object.freeze({
      index: 4,
      minProgress: 0.60,
      title: 'Epoch V · Ventriloquy of the Solitary Survivors',
      plotShift: 'Concentrated survivors answer their own accusations in twin registers as the Cypress Necropolis outweighs the living ring.'
    }),
    Object.freeze({
      index: 5,
      minProgress: 0.80,
      title: 'Epoch VI · Horizon of the Unspoken Denouement',
      plotShift: 'Every duet leans within a breath of final revelation, forever handed mid-syllable to the next newborn entering from the portico.'
    })
  ]);

  const GIVEN_NAMES_BY_CHAIN = Object.freeze({
    A: Object.freeze([
      'Trivellino', 'Scapino', 'Brighella', 'Capitano', 'Ruzzante', 'Pedrolino',
      'Mezzetino', 'Beltrame', 'Gradasso', 'Rodomonte', 'ruggiero', 'Astolfo',
      'Tancredi', 'Galeazzo', 'Sigismondo', 'Ludovico'
    ].map(function (n) { return n.charAt(0).toUpperCase() + n.slice(1); })),
    B: Object.freeze([
      'Lavinia', 'Flaminia', 'Vittoria', 'Aurelia', 'Smeraldina', 'Ortensia',
      'Lucinda', 'Beatrice', 'Clarice', 'Rosalba', 'Diamante', 'Camilla',
      'Veronica', 'Tullia', 'Ginevra', 'Lucrezia'
    ]),
    C: Object.freeze([
      'Lelio', 'Ottavio', 'Orazio', 'Valerio', 'Leandro', 'Cintio',
      'Fabrizio', 'Girolamo', 'Anselmo', 'Cassandro', 'Uberto', 'Cosimo',
      'Bartolomeo', 'Niccolo', 'Taddeo', 'Prospero'
    ])
  });

  const MELANIAN_HOUSES = Object.freeze([
    'Contarini', 'Dandolo', 'Mocenigo', 'Tiepolo', 'Pisani', 'Priuli',
    'Trevisan', 'Marcello', 'Giustinian', 'Venier', 'Malipiero', 'Zeno',
    'Dolfin', 'Bragadin', 'Sagredo', 'Navagero', 'Soranzo', 'Michiel'
  ]);

  const EPITAPH_PHRASES = Object.freeze([
    'Yielded the mask mid-breath without dropping a syllable.',
    'Carried a warm boast into the cold cypress arcade.',
    'Left the sentence hanging on the square for younger lips.',
    'Laid down the costume at dusk while the cue rang on.',
    'Entombed beneath dark cypresses as a survivor took the mark.',
    'Passed from checkered stone to marble niche between two words.'
  ]);

  function computeCentury(year) {
    return Math.max(1, Math.floor((Math.max(1, year) - 1) / 100) + 1);
  }

  function resolveEpoch(progress) {
    for (let i = SECULAR_EPOCHS.length - 1; i >= 0; i--) {
      if (progress >= SECULAR_EPOCHS[i].minProgress) {
        return SECULAR_EPOCHS[i];
      }
    }
    return SECULAR_EPOCHS[0];
  }

  function cloneRole(r) {
    return {
      roleId: r.roleId,
      id: r.roleId,
      index: r.index,
      title: r.title,
      shortTitle: r.shortTitle,
      knotId: r.knotId,
      chainKey: r.chainKey,
      mortalName: r.mortalName,
      generation: r.generation,
      age: r.age,
      birthYear: r.birthYear,
      mode: r.mode,
      chorusSize: r.chorusSize,
      chorusNames: r.chorusNames.slice(),
      absorbedPartnerRole: r.absorbedPartnerRole,
      previousRole: r.previousRole,
      previousRoleTitle: r.previousRoleTitle,
      timesReplaced: r.timesReplaced,
      lastEventYear: r.lastEventYear,
      nominalCount: r.nominalCount
    };
  }

  function cloneTrail(tr) {
    return {
      id: tr.id,
      type: tr.type,
      kind: tr.kind,
      roleId: tr.roleId,
      fromRoleId: tr.fromRoleId,
      toRoleId: tr.toRoleId,
      sourceZone: tr.sourceZone,
      targetZone: tr.targetZone,
      angleRad: tr.angleRad,
      color: tr.color,
      label: tr.label,
      progress: tr.progress,
      t: tr.progress,
      durationSec: tr.durationSec
    };
  }

  function createMortalityCascade(opts) {
    const config = opts || {};
    const initialYear = typeof config.initialYear === 'number' ? Math.max(1, Math.round(config.initialYear)) : 1;
    const initialDenouement = typeof config.initialDenouement === 'number' ? config.initialDenouement : 0.012;
    const maxTombs = 512;
    const maxTransitions = 36;
    const maxTrails = 54;

    const state = {
      year: initialYear,
      decadesElapsed: 0,
      deathsCount: 0,
      birthsCount: 0,
      cascadesCount: 0,
      chorusSplitsCount: 0,
      concentrationsCount: 0,
      returnAfterYearsCount: 0,
      fallenPrincesNominal: 100000,
      denouementProgress: initialDenouement,
      citizenSeq: 0,
      tombSeq: 0,
      trailSeq: 0,
      transitionSeq: 0,
      rolesMap: {},
      necropolisTombs: [],
      recentTransitions: [],
      activeTrails: []
    };

    function mintCitizenName(chainKey) {
      const pool = GIVEN_NAMES_BY_CHAIN[chainKey] || GIVEN_NAMES_BY_CHAIN.A;
      const idx = state.citizenSeq++;
      const given = pool[idx % pool.length];
      const house = MELANIAN_HOUSES[(idx * 5 + pool.length) % MELANIAN_HOUSES.length];
      const cycle = Math.floor(idx / (pool.length * MELANIAN_HOUSES.length));
      return cycle > 0 ? given + ' ' + house + ' ' + (cycle + 1) : given + ' ' + house;
    }

    function nudgeDenouement(decayFactor) {
      const prev = state.denouementProgress;
      let next = 1 - (1 - prev) * decayFactor;
      if (next <= prev && prev < 0.988) {
        next = prev + 0.0001;
      }
      state.denouementProgress = Math.min(0.988, next);
    }

    function spawnTrail(spec) {
      const kind = spec.type;
      state.activeTrails.push({
        id: 'trail_' + (++state.trailSeq),
        type: kind,
        kind: kind,
        roleId: spec.roleId,
        fromRoleId: spec.fromRoleId || null,
        toRoleId: spec.toRoleId || null,
        sourceZone: spec.sourceZone || 'piazza',
        targetZone: spec.targetZone || 'piazza',
        angleRad: typeof spec.angleRad === 'number' ? spec.angleRad : 0,
        color: spec.color || PALETTE.gilded_ochre,
        label: spec.label || '',
        progress: 0,
        t: 0,
        durationSec: spec.durationSec || 2.0
      });
      if (state.activeTrails.length > maxTrails) {
        state.activeTrails.splice(0, state.activeTrails.length - maxTrails);
      }
    }

    function inscribeTomb(role, mortalName, cause, succeededBy, succeededFromRole) {
      const meta = ROLE_META_BY_ID[role.roleId];
      const tombId = 'tomb_' + (++state.tombSeq);
      const epitaph = EPITAPH_PHRASES[(state.tombSeq - 1) % EPITAPH_PHRASES.length];
      const tomb = {
        tombId: tombId,
        roleId: role.roleId,
        roleTitle: role.title,
        knotId: role.knotId,
        mortalName: mortalName,
        ageAtDeath: role.age,
        birthYear: role.birthYear,
        deathYear: state.year,
        generation: role.generation,
        cause: cause,
        epitaph: epitaph,
        sepulcherSector: meta.sepulcherSector,
        succeededBy: succeededBy,
        succeededFromRole: succeededFromRole
      };
      state.deathsCount += 1;
      state.necropolisTombs.unshift(tomb);
      if (state.necropolisTombs.length > maxTombs) {
        state.necropolisTombs.length = maxTombs;
      }
      return tomb;
    }


    function pushTransition(entry) {
      const record = Object.assign({
        id: 'tr_' + (++state.transitionSeq),
        year: state.year,
        century: computeCentury(state.year),
        droppedBeats: 0,
        dialogueContinuity: 1.0
      }, entry);
      state.recentTransitions.unshift(record);
      if (state.recentTransitions.length > maxTransitions) {
        state.recentTransitions.length = maxTransitions;
      }
      return record;
    }

    function syncFallenPrincesNominal() {
      if (state.rolesMap.fallen_princes) {
        state.rolesMap.fallen_princes.nominalCount = state.fallenPrincesNominal;
      }
    }

    function initYearOneCast() {
      state.year = initialYear;
      state.decadesElapsed = 0;
      state.deathsCount = 0;
      state.birthsCount = 0;
      state.cascadesCount = 0;
      state.chorusSplitsCount = 0;
      state.concentrationsCount = 0;
      state.returnAfterYearsCount = 0;
      state.fallenPrincesNominal = 100000;
      state.denouementProgress = initialDenouement;
      state.citizenSeq = 0;
      state.tombSeq = 0;
      state.trailSeq = 0;
      state.transitionSeq = 0;
      state.rolesMap = {};
      state.necropolisTombs = [];
      state.recentTransitions = [];
      state.activeTrails = [];

      for (let i = 0; i < ROLE_DEFINITIONS.length; i++) {
        const def = ROLE_DEFINITIONS[i];
        state.rolesMap[def.roleId] = {
          roleId: def.roleId,
          index: def.index,
          title: def.title,
          shortTitle: def.shortTitle,
          knotId: def.knotId,
          chainKey: def.chainKey,
          mortalName: def.initialName,
          generation: 1,
          age: def.initialAge,
          birthYear: initialYear - def.initialAge,
          mode: 'single',
          chorusSize: 1,
          chorusNames: [def.initialName],
          absorbedPartnerRole: null,
          previousRole: null,
          previousRoleTitle: 'Origin Cast',
          timesReplaced: 0,
          lastEventYear: initialYear,
          nominalCount: def.roleId === 'fallen_princes' ? 100000 : 1
        };
      }
    }

    function executeLineageCascade(rawRoleId, cause) {
      const targetRoleId = ROLE_META_BY_ID[rawRoleId] ? rawRoleId : 'braggart_soldier';
      const lineage = CASCADE_CHAINS.byRole[targetRoleId];
      const chainRoles = lineage.chain.roles;
      const stageIdx = lineage.stageIndex;
      const entryRoleId = chainRoles[0];
      const targetMeta = ROLE_META_BY_ID[targetRoleId];
      const entryMeta = ROLE_META_BY_ID[entryRoleId];

      const newbornName = mintCitizenName(lineage.chainKey);
      const predRoleId = stageIdx > 0 ? chainRoles[stageIdx - 1] : 'birth_portico';
      const immediateSuccessorName = stageIdx > 0 ? state.rolesMap[chainRoles[stageIdx - 1]].mortalName : newbornName;

      const deadRole = state.rolesMap[targetRoleId];
      const deceasedNames = (deadRole.mode === 'chorus' && deadRole.chorusNames.length > 0)
        ? deadRole.chorusNames.slice()
        : [deadRole.mortalName];
      const tombsAdded = [];
      for (let d = 0; d < deceasedNames.length; d++) {
        tombsAdded.push(inscribeTomb(deadRole, deceasedNames[d], cause, immediateSuccessorName, predRoleId));
      }

      spawnTrail({
        type: 'death_to_necropolis',
        roleId: targetRoleId,
        fromRoleId: targetRoleId,
        toRoleId: null,
        sourceZone: 'piazza',
        targetZone: 'cypress_necropolis',
        angleRad: targetMeta.sectorAngle,
        color: PALETTE.parchment_bone,
        label: deceasedNames[0] + ' -> Cypress Necropolis',
        durationSec: 2.1
      });

      const cascadeSteps = [];
      for (let s = stageIdx; s >= 1; s--) {
        const toId = chainRoles[s];
        const fromId = chainRoles[s - 1];
        const dst = state.rolesMap[toId];
        const src = state.rolesMap[fromId];
        const carryChorus = src.mode === 'chorus' && src.chorusNames.length > 1;
        dst.mortalName = src.mortalName;
        dst.mode = carryChorus ? 'chorus' : 'single';
        dst.chorusSize = carryChorus ? src.chorusSize : 1;
        dst.chorusNames = carryChorus ? src.chorusNames.slice() : [src.mortalName];
        dst.absorbedPartnerRole = null;
        dst.age = src.age;
        dst.birthYear = src.birthYear;
        dst.previousRole = fromId;
        dst.previousRoleTitle = ROLE_META_BY_ID[fromId].title;
        dst.generation += 1;
        dst.timesReplaced += 1;
        dst.lastEventYear = state.year;

        cascadeSteps.push({
          fromRoleId: fromId,
          fromTitle: ROLE_META_BY_ID[fromId].title,
          toRoleId: toId,
          toTitle: dst.title,
          mortalName: dst.mortalName
        });

        spawnTrail({
          type: 'cascade_shift',
          roleId: toId,
          fromRoleId: fromId,
          toRoleId: toId,
          sourceZone: 'piazza',
          targetZone: 'piazza',
          angleRad: ROLE_META_BY_ID[toId].sectorAngle,
          color: PALETTE.gilded_ochre,
          label: ROLE_META_BY_ID[fromId].shortTitle + ' -> ' + dst.shortTitle,
          durationSec: 1.9
        });
      }

      if (stageIdx === 0) {
        spawnTrail({
          type: 'cascade_shift',
          roleId: entryRoleId,
          fromRoleId: entryRoleId,
          toRoleId: entryRoleId,
          sourceZone: 'birth_portico',
          targetZone: 'piazza',
          angleRad: entryMeta.sectorAngle,
          color: PALETTE.gilded_ochre,
          label: 'Portico -> ' + entryMeta.shortTitle,
          durationSec: 1.8
        });
      }

      const entry = state.rolesMap[entryRoleId];
      entry.mortalName = newbornName;
      entry.mode = 'single';
      entry.chorusSize = 1;
      entry.chorusNames = [newbornName];
      entry.absorbedPartnerRole = null;
      entry.age = 0;
      entry.birthYear = state.year;
      entry.previousRole = 'birth_portico';
      entry.previousRoleTitle = entryMeta.cradlePortico;
      entry.generation += 1;
      entry.timesReplaced += 1;
      entry.lastEventYear = state.year;

      state.birthsCount += 1;
      state.cascadesCount += Math.max(1, stageIdx);
      if (targetRoleId === 'fallen_princes') {
        state.fallenPrincesNominal += 4;
      }
      syncFallenPrincesNominal();

      spawnTrail({
        type: 'birth_from_cradle',
        roleId: entryRoleId,
        fromRoleId: null,
        toRoleId: entryRoleId,
        sourceZone: 'birth_portico',
        targetZone: 'piazza',
        angleRad: entryMeta.sectorAngle,
        color: PALETTE.mask_ivory,
        label: newbornName + ' -> ' + entry.shortTitle,
        durationSec: 2.2
      });

      return {
        roleId: targetRoleId,
        roleTitle: deadRole.title,
        deceasedNames: deceasedNames,
        tombsAdded: tombsAdded,
        cascadeSteps: cascadeSteps,
        entryRoleId: entryRoleId,
        entryRoleTitle: entry.title,
        newbornName: newbornName
      };
    }


    function ageAllLiving(yearsDelta) {
      for (let i = 0; i < ROLE_ORDER.length; i++) {
        state.rolesMap[ROLE_ORDER[i]].age += yearsDelta;
      }
    }

    function pickOldestRoleId(excludeRoleId) {
      let bestId = ROLE_ORDER[0];
      let bestAge = -1;
      for (let i = 0; i < ROLE_ORDER.length; i++) {
        const rid = ROLE_ORDER[i];
        if (rid === excludeRoleId) continue;
        const r = state.rolesMap[rid];
        if (r.age > bestAge) {
          bestAge = r.age;
          bestId = rid;
        }
      }
      return bestId;
    }

    function getState() {
      const roles = {};
      const rolesList = [];
      for (let i = 0; i < ROLE_ORDER.length; i++) {
        const rid = ROLE_ORDER[i];
        const snap = cloneRole(state.rolesMap[rid]);
        roles[rid] = snap;
        rolesList.push(snap);
      }
      const epoch = resolveEpoch(state.denouementProgress);
      return {
        year: state.year,
        century: computeCentury(state.year),
        decadesElapsed: state.decadesElapsed,
        deathsCount: state.deathsCount,
        birthsCount: state.birthsCount,
        cascadesCount: state.cascadesCount,
        chorusSplitsCount: state.chorusSplitsCount,
        concentrationsCount: state.concentrationsCount,
        returnAfterYearsCount: state.returnAfterYearsCount,
        fallenPrincesNominal: state.fallenPrincesNominal,
        droppedBeats: 0,
        dialogueContinuity: 1.0,
        denouementProgress: state.denouementProgress,
        denouementPercent: Math.round(state.denouementProgress * 10000) / 100,
        denouementEpochIndex: epoch.index,
        denouementEpochTitle: epoch.title,
        denouementPlotShift: epoch.plotShift,
        roles: roles,
        rolesList: rolesList,
        necropolisTombs: state.necropolisTombs.map(function (tb) { return Object.assign({}, tb); }),
        recentTransitions: state.recentTransitions.map(function (tr) { return Object.assign({}, tr); }),
        activeTrails: state.activeTrails.map(cloneTrail)
      };
    }

    function getRoleState(roleId) {
      const r = state.rolesMap[roleId];
      return r ? cloneRole(r) : null;
    }

    function strikeMortalDead(roleId) {
      const res = executeLineageCascade(roleId, 'mortal_stroke');
      nudgeDenouement(0.984);
      const stepHint = res.cascadeSteps.length > 0
        ? res.cascadeSteps[0].fromTitle + ' stepped into ' + res.roleTitle
        : 'Portico newborn assumed ' + res.roleTitle;
      return pushTransition({
        kind: 'mortal_cascade',
        roleId: res.roleId,
        roleTitle: res.roleTitle,
        deceasedNames: res.deceasedNames,
        cascadeSteps: res.cascadeSteps,
        entryRoleId: res.entryRoleId,
        entryRoleTitle: res.entryRoleTitle,
        newbornName: res.newbornName,
        denouementProgress: state.denouementProgress,
        summary: 'Yr ' + state.year + ' · ' + res.deceasedNames[0] + ' (' + res.roleTitle + ') entombed; ' + stepHint + '; ' + res.newbornName + ' born.'
      });
    }

    function returnAfterYears(years) {
      const span = Math.max(1, Math.round(Number(years) || 18));
      state.year += span;
      state.returnAfterYearsCount += 1;
      ageAllLiving(span);
      const trio = ['parasite', 'prostitute', 'miserly_father'];
      const deceasedNames = [];
      const newborns = [];
      const allSteps = [];
      for (let i = 0; i < trio.length; i++) {
        const res = executeLineageCascade(trio[i], 'return_after_years');
        for (let d = 0; d < res.deceasedNames.length; d++) deceasedNames.push(res.deceasedNames[d]);
        newborns.push(res.newbornName);
        for (let s = 0; s < res.cascadeSteps.length; s++) allSteps.push(res.cascadeSteps[s]);
      }
      state.fallenPrincesNominal += Math.max(3, Math.floor(span / 5));
      syncFallenPrincesNominal();
      nudgeDenouement(0.956);
      return pushTransition({
        kind: 'return_after_years',
        yearsElapsed: span,
        roleId: 'parasite',
        roleTitle: 'Parasite, Prostitute & Miserly Father',
        deceasedRoles: trio.slice(),
        deceasedNames: deceasedNames,
        cascadeSteps: allSteps,
        newbornsEntered: newborns,
        newbornName: newborns.join(', '),
        denouementProgress: state.denouementProgress,
        summary: 'Yr ' + state.year + ' (+' + span + 'y) · Parasite, Prostitute & Miserly Father dead in the cypresses; 3 survivors cascaded, 3 newborns entered.'
      });
    }

    function advanceDecade() {
      state.year += 10;
      state.decadesElapsed += 1;
      ageAllLiving(10);
      const firstId = pickOldestRoleId(null);
      const r1 = executeLineageCascade(firstId, 'decade_senescence');
      const secondId = pickOldestRoleId(firstId);
      const r2 = executeLineageCascade(secondId, 'decade_senescence');
      state.fallenPrincesNominal += 2;
      syncFallenPrincesNominal();
      nudgeDenouement(0.968);
      return pushTransition({
        kind: 'advance_decade',
        roleId: firstId,
        roleTitle: r1.roleTitle + ' & ' + r2.roleTitle,
        deceasedRoles: [firstId, secondId],
        deceasedNames: r1.deceasedNames.concat(r2.deceasedNames),
        cascadeSteps: r1.cascadeSteps.concat(r2.cascadeSteps),
        newbornName: r1.newbornName + ', ' + r2.newbornName,
        denouementProgress: state.denouementProgress,
        summary: 'Yr ' + state.year + ' (+10y) · Elders of ' + r1.roleTitle + ' & ' + r2.roleTitle + ' passed to Necropolis; lineages renewed.'
      });
    }

    function splitRoleToChorus(roleId, count) {
      const targetId = ROLE_META_BY_ID[roleId] ? roleId : 'parasite';
      const n = Math.max(2, Math.min(8, Math.round(Number(count) || 4)));
      const meta = ROLE_META_BY_ID[targetId];
      const role = state.rolesMap[targetId];
      const prevHolders = (role.mode === 'chorus' && role.chorusNames.length > 0) ? role.chorusNames.slice() : [role.mortalName];
      const chorusNames = [];
      for (let k = 0; k < n; k++) {
        chorusNames.push(mintCitizenName(meta.chainKey));
      }
      for (let d = 0; d < prevHolders.length; d++) {
        inscribeTomb(role, prevHolders[d], 'chorus_dissolution', chorusNames[0] + ' Chorus', 'birth_portico');
      }
      role.mode = 'chorus';
      role.chorusSize = n;
      role.chorusNames = chorusNames;
      role.mortalName = chorusNames[0] + ' + ' + (n - 1) + ' Chorus';
      role.absorbedPartnerRole = null;
      role.previousRole = 'birth_portico';
      role.previousRoleTitle = 'Portico Chorus (' + n + ')';
      role.age = 19;
      role.birthYear = state.year - 19;
      role.generation += 1;
      role.timesReplaced += 1;
      role.lastEventYear = state.year;
      state.birthsCount += n;
      state.chorusSplitsCount += 1;
      spawnTrail({
        type: 'death_to_necropolis', roleId: targetId, fromRoleId: targetId, toRoleId: null,
        sourceZone: 'piazza', targetZone: 'cypress_necropolis', angleRad: meta.sectorAngle,
        color: PALETTE.parchment_bone, label: prevHolders[0] + ' -> Necropolis', durationSec: 1.9
      });
      spawnTrail({
        type: 'chorus_split', roleId: targetId, fromRoleId: targetId, toRoleId: targetId,
        sourceZone: 'birth_portico', targetZone: 'piazza', angleRad: meta.sectorAngle,
        color: PALETTE.curtain_scarlet, label: role.shortTitle + ' x' + n + ' Chorus', durationSec: 2.1
      });
      nudgeDenouement(0.982);
      return pushTransition({
        kind: 'chorus_split', roleId: targetId, roleTitle: role.title,
        deceasedNames: prevHolders, cascadeSteps: [], newbornName: chorusNames.join(', '),
        chorusSize: n, denouementProgress: state.denouementProgress,
        summary: 'Yr ' + state.year + ' · ' + role.title + ' multiplied 1-to-' + n + ' polyphonic Chorus (' + chorusNames[0] + ' +' + (n - 1) + ').'
      });
    }


    function concentrateToSurvivor(roleId) {
      const targetId = ROLE_META_BY_ID[roleId] ? roleId : 'parasite';
      const meta = ROLE_META_BY_ID[targetId];
      const partnerId = meta.partnerRoleId;
      const role = state.rolesMap[targetId];
      const wasChorus = role.mode === 'chorus' && role.chorusNames.length > 1;
      const survivorName = wasChorus ? role.chorusNames[0] : role.mortalName;
      const departed = [];
      if (wasChorus) {
        for (let i = 1; i < role.chorusNames.length; i++) {
          departed.push(role.chorusNames[i]);
          inscribeTomb(role, role.chorusNames[i], 'chorus_concentration', survivorName, targetId);
        }
      }
      role.mode = 'concentrated_survivor';
      role.chorusSize = 1;
      role.chorusNames = [survivorName];
      role.mortalName = survivorName;
      role.absorbedPartnerRole = partnerId;
      role.previousRole = wasChorus ? targetId : partnerId;
      role.previousRoleTitle = wasChorus ? 'Concentrated Chorus' : ROLE_META_BY_ID[partnerId].title;
      role.generation += 1;
      role.timesReplaced += 1;
      role.lastEventYear = state.year;
      state.concentrationsCount += 1;
      spawnTrail({
        type: 'concentration',
        roleId: targetId,
        fromRoleId: partnerId,
        toRoleId: targetId,
        sourceZone: 'piazza',
        targetZone: 'piazza',
        angleRad: meta.sectorAngle,
        color: PALETTE.proscenium_ochre,
        label: survivorName + ' (Solitary Survivor)',
        durationSec: 2.0
      });
      nudgeDenouement(0.980);
      return pushTransition({
        kind: 'concentration',
        roleId: targetId,
        roleTitle: role.title,
        deceasedNames: departed,
        cascadeSteps: [],
        newbornName: survivorName,
        absorbedPartnerRole: partnerId,
        denouementProgress: state.denouementProgress,
        summary: 'Yr ' + state.year + ' · ' + role.title + ' concentrated into solitary survivor ' + survivorName + ' carrying twin voices.'
      });
    }

    function step(dtSec) {
      const dt = Math.max(0, Number(dtSec) || 0);
      if (dt <= 0 || state.activeTrails.length === 0) return state.activeTrails.length;
      for (let i = state.activeTrails.length - 1; i >= 0; i--) {
        const tr = state.activeTrails[i];
        tr.progress += dt / Math.max(0.2, tr.durationSec || 2.0);
        tr.t = Math.min(1, tr.progress);
        if (tr.progress >= 1) {
          state.activeTrails.splice(i, 1);
        }
      }
      return state.activeTrails.length;
    }

    function reset() {
      initYearOneCast();
      return getState();
    }

    initYearOneCast();

    return {
      getState: getState,
      getRoleState: getRoleState,
      strikeMortalDead: strikeMortalDead,
      returnAfterYears: returnAfterYears,
      advanceDecade: advanceDecade,
      splitRoleToChorus: splitRoleToChorus,
      concentrateToSurvivor: concentrateToSurvivor,
      step: step,
      reset: reset
    };
  }

  const MelaniaMortalityCascade = Object.freeze({
    PALETTE: PALETTE,
    ROLE_ORDER: ROLE_ORDER,
    KNOT_ORDER: KNOT_ORDER,
    ROLE_DEFINITIONS: ROLE_DEFINITIONS,
    ROLE_META_BY_ID: ROLE_META_BY_ID,
    CASCADE_CHAINS: CASCADE_CHAINS,
    SECULAR_EPOCHS: SECULAR_EPOCHS,
    createMortalityCascade: createMortalityCascade
  });

  root.MelaniaMortalityCascade = MelaniaMortalityCascade;
  if (typeof window !== 'undefined') {
    window.MelaniaMortalityCascade = MelaniaMortalityCascade;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = MelaniaMortalityCascade;
  }
})(typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this));
