(function () {
  'use strict';

  const PLOT_IDS = Object.freeze([
    'plot_porta_vecchia',
    'plot_cistern_lane',
    'plot_archway_step',
    'plot_campanile_court'
  ]);

  const PLOT_ADDRESSES = Object.freeze({
    plot_porta_vecchia: 'Via Porta Vecchia #4',
    plot_cistern_lane: 'Vicolo della Cisterna #11',
    plot_archway_step: "Salita dell'Arco #19",
    plot_campanile_court: 'Corte del Campanile #27'
  });

  const VOCAL_MODES = Object.freeze([
    'murmur',
    'interrupt',
    'huff',
    'banter',
    'stifled_laughter'
  ]);

  const DISCOURSE_AXES = Object.freeze([
    'present_critique',
    'future_dream'
  ]);

  const VESSELS = Object.freeze([
    Object.freeze({
      id: 'trunk',
      label: 'Banded Steamer Trunk',
      glyph: '▣',
      hue: '#d9b45b',
      note: 'Curled among folded linens and ancestor daguerreotypes during family relocations.'
    }),
    Object.freeze({
      id: 'coatrack',
      label: 'Hallway Coatrack',
      glyph: 'Ψ',
      hue: '#e6c675',
      note: 'Perched on turned walnut & brass hooks beside traveling cloaks.'
    }),
    Object.freeze({
      id: 'umbrella_stand',
      label: 'Umbrella Stand',
      glyph: '⌆',
      hue: '#c9a14a',
      note: 'Tucked among ferrule tips beside the newly rented apartment door.'
    }),
    Object.freeze({
      id: 'key_ring',
      label: 'Household Key-Ring',
      glyph: '⚷',
      hue: '#f0d48a',
      note: 'Swinging from brass and iron keys carried from paternal villa to tenement lock.'
    })
  ]);

  const VESSEL_IDS = Object.freeze(VESSELS.map(function (v) { return v.id; }));
  const VESSEL_BY_ID = Object.freeze(VESSELS.reduce(function (acc, v) {
    acc[v.id] = v;
    return acc;
  }, {}));

  function makeAncestor(name, role) {
    const obj = { name: name, role: role };
    Object.defineProperty(obj, 'toString', {
      value: function () { return this.name + ' (' + this.role + ')'; },
      enumerable: false
    });
    return Object.freeze(obj);
  }

  function cloneAncestors(list) {
    return list.map(function (a) {
      return makeAncestor(a.name, a.role);
    });
  }

  const LINEAGE_FAMILIES = Object.freeze([
    Object.freeze({
      id: 'fam_valenti',
      index: 0,
      familyName: 'Valenti Family',
      childName: 'Chiara Valenti',
      initialPlotIndex: 0,
      initialPlotId: 'plot_porta_vecchia',
      initialVessel: 'trunk',
      penatesCount: 5,
      ancestors: Object.freeze([
        makeAncestor('Nonna Aurelia Valenti', 'Silk Guild Archivist'),
        makeAncestor('Judge Corrado Valenti', 'Harbor Peace Syndic')
      ]),
      familyHonor: '1848 Quarantine Harbor Silver Seal',
      childCareerDream: 'Young Chiara as Civic Magistrate of Reformed Courts',
      initialAmbition: 0.52,
      essenceClaim: 'Leandra travels inside banded trunks where ancestral vows outlive demolished tufa walls.'
    }),
    Object.freeze({
      id: 'fam_bellini',
      index: 1,
      familyName: 'Bellini Family',
      childName: 'Matteo Bellini',
      initialPlotIndex: 1,
      initialPlotId: 'plot_cistern_lane',
      initialVessel: 'coatrack',
      penatesCount: 5,
      ancestors: Object.freeze([
        makeAncestor('Captain Livia Bellini', 'Meridian Astrolabe Maker'),
        makeAncestor('Maestro Ettore Bellini', 'Tower Clock Horologist')
      ]),
      familyHonor: 'Gilded Meridian Astrolabe Citation',
      childCareerDream: 'Young Matteo as Celestial Cartographer & Observatory Director',
      initialAmbition: 0.48,
      essenceClaim: 'Wherever our walnut coatrack stands in a rented vestibule, the true Leandra hangs its cloak.'
    }),
    Object.freeze({
      id: 'fam_neri',
      index: 2,
      familyName: 'Neri Family',
      childName: 'Lucilla Neri',
      initialPlotIndex: 2,
      initialPlotId: 'plot_archway_step',
      initialVessel: 'umbrella_stand',
      penatesCount: 5,
      ancestors: Object.freeze([
        makeAncestor('Signora Ortensia Neri', 'Commons Charter Scribe'),
        makeAncestor('Advocate Dario Neri', 'Water-Cistern Arbiter')
      ]),
      familyHonor: 'Parchment Charter of the Free Wells',
      childCareerDream: 'Young Lucilla as Constitutional Jurist of the Commune',
      initialAmbition: 0.55,
      essenceClaim: 'Stones crumble to mortar dust, yet Leandra steps dry-shod beside our brass umbrella stand.'
    }),
    Object.freeze({
      id: 'fam_castellani',
      index: 3,
      familyName: 'Castellani Family',
      childName: 'Tommaso Castellani',
      initialPlotIndex: 3,
      initialPlotId: 'plot_campanile_court',
      initialVessel: 'key_ring',
      penatesCount: 5,
      ancestors: Object.freeze([
        makeAncestor('Master Bruno Castellani', 'Vault Keystone Mason'),
        makeAncestor('Donna Irene Castellani', 'Fresco Tempera Restorer')
      ]),
      familyHonor: 'Campanile Arch Keystone Medallion',
      childCareerDream: 'Young Tommaso as Structural Architect of Light-Vaulted Arches',
      initialAmbition: 0.50,
      essenceClaim: 'Every lock turned by our ancestral key-ring carries the living city from doorway to doorway.'
    }),
    Object.freeze({
      id: 'fam_morosini',
      index: 4,
      familyName: 'Morosini Family',
      childName: 'Elena Morosini',
      initialPlotIndex: 0,
      initialPlotId: 'plot_porta_vecchia',
      initialVessel: 'trunk',
      penatesCount: 5,
      ancestors: Object.freeze([
        makeAncestor('Doctor Sabina Morosini', 'Lazaretto Botanist'),
        makeAncestor('Apothecary Giulio Morosini', 'Fever-Ward Herbalist')
      ]),
      familyHonor: 'Lazaretto Botanical Pharmacopoeia Laurels',
      childCareerDream: 'Young Elena as Chief Surgeon of the Maritime Amphitheater',
      initialAmbition: 0.46,
      essenceClaim: 'Cellar pipes only echo damp earth; Leandra breathes in the linen trunk of our healers.'
    }),
    Object.freeze({
      id: 'fam_grimaldi',
      index: 5,
      familyName: 'Grimaldi Family',
      childName: 'Lorenzo Grimaldi',
      initialPlotIndex: 1,
      initialPlotId: 'plot_cistern_lane',
      initialVessel: 'key_ring',
      penatesCount: 5,
      ancestors: Object.freeze([
        makeAncestor('Contralto Violante Grimaldi', 'Nocturne Lutist'),
        makeAncestor('Signor Cesare Grimaldi', 'Reed-Organ Voicer')
      ]),
      familyHonor: 'First Ebony Baton of the Municipal Choir',
      childCareerDream: 'Young Lorenzo as Symphony Conductor of the Nocturnal Hall',
      initialAmbition: 0.53,
      essenceClaim: 'When our brass keys chime in a new stairwell, Leandra retunes its true name to our lineage.'
    })
  ]);

  function composeUtteranceText(fam, vessel, vocalMode, axis, beatIndex) {
    const addr = PLOT_ADDRESSES[fam.currentPlotId] || fam.currentPlotId;
    const elder = fam.ancestors[beatIndex % fam.ancestors.length].name;
    const vName = vessel.label.toLowerCase();
    if (axis === 'present_critique') {
      if (vocalMode === 'murmur') {
        return 'From the ' + vName + ' at ' + addr + ', we murmur that thin concrete stairs and slamming doors disgrace ' + elder + '—yet our ' + fam.familyHonor + ' stays untarnished.';
      }
      if (vocalMode === 'interrupt') {
        return 'Hush, soot-tongued Lares in the stove flue! Before you boast of fifty rented kitchens, notice how carelessly today\'s tenants scuff the vestibule beside our ' + vName + '!';
      }
      if (vocalMode === 'huff') {
        return 'We huff inside the ' + vName + ': plaster partitions shrink every decade and street carts rattle all noon, as if Leandra were mere speculation in mortar!';
      }
      if (vocalMode === 'banter') {
        return 'Keep your rusty tin cans and damp cellar pipes, cousin Lares—while you gossip over boiling broth at ' + addr + ', our ' + vName + ' guards the manners this quarter forgot.';
      }
      return 'Stifled laughter ripples from our ' + vName + ': the Lares think pouring concrete seven stories high makes a city, while tenants scarce know their own stair landing!';
    }
    if (vocalMode === 'murmur') {
      return 'Nestled in the ' + vName + ', we murmur over sleeping ' + fam.childName + ': one day Leandra will shine through ' + fam.childCareerDream + '.';
    }
    if (vocalMode === 'interrupt') {
      return 'Let us interrupt your chimney-throat chatter—true Leandra goes wherever our key-rings and trunks go, carrying ' + elder + '\'s oath toward ' + fam.childCareerDream + '!';
    }
    if (vocalMode === 'huff') {
      return 'Huff if you like in your copper pots! When our luggage rolls to the next address, ' + fam.childCareerDream + ' will reshape the very courts above your cellar.';
    }
    if (vocalMode === 'banter') {
      return 'Wager a brass key against a soot-flue, neighbor Lares: long after this plaster peels, Leandra will salute ' + fam.childCareerDream + ' crowned with our ' + fam.familyHonor + '!';
    }
    return 'With ironic, stifled laughter inside the ' + vName + ', we picture pompous elders bowing when ' + fam.childCareerDream + ' proves Leandra follows the luggage, not the cellar!';
  }

  function resolvePlotIndex(plotIdOrIndex) {
    if (typeof plotIdOrIndex === 'number' && Number.isFinite(plotIdOrIndex)) {
      const idx = Math.floor(plotIdOrIndex);
      if (idx >= 0 && idx < PLOT_IDS.length) return idx;
    }
    if (typeof plotIdOrIndex === 'string') {
      const byId = PLOT_IDS.indexOf(plotIdOrIndex);
      if (byId !== -1) return byId;
      const parsed = parseInt(plotIdOrIndex, 10);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed < PLOT_IDS.length) return parsed;
    }
    return -1;
  }

  function easeInOutCubic(t) {
    const c = Math.max(0, Math.min(1, t));
    return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
  }

  function normalizePlotRects(plotRects, width, height) {
    const W = Number.isFinite(width) && width > 0 ? width : 880;
    const H = Number.isFinite(height) && height > 0 ? height : 480;
    if (Array.isArray(plotRects) && plotRects.length >= 4) {
      return plotRects.slice(0, 4).map(function (p, idx) {
        const px = Number.isFinite(p.x) ? p.x : idx * (W / 4) + 12;
        const py = Number.isFinite(p.y) ? p.y : H * 0.24;
        const pw = Number.isFinite(p.w) ? p.w : W / 4 - 24;
        const ph = Number.isFinite(p.h) ? p.h : H * 0.52;
        const streetY = Number.isFinite(p.streetY) ? p.streetY : py + ph;
        let floors = Array.isArray(p.floorRects) && p.floorRects.length > 0 ? p.floorRects : null;
        if (!floors) {
          const fh = Math.max(18, (ph - 8) / 2);
          floors = [0, 1].map(function (fi) {
            return {
              floorIndex: fi,
              x: px + 6,
              y: py + ph - (fi + 1) * fh,
              w: Math.max(24, pw - 12),
              h: fh - 2,
              trunkX: px + pw * 0.26,
              coatX: px + pw * 0.44,
              flueX: px + pw * 0.76
            };
          });
        }
        return {
          plotId: p.plotId || PLOT_IDS[idx],
          index: idx,
          x: px,
          y: py,
          w: pw,
          h: ph,
          streetY: streetY,
          floorRects: floors
        };
      });
    }
    const gap = Math.max(8, W * 0.02);
    const padX = Math.max(12, W * 0.03);
    const plotW = (W - padX * 2 - gap * 3) / 4;
    const streetY = H * 0.78;
    const plotH = H * 0.48;
    return PLOT_IDS.map(function (pid, idx) {
      const px = padX + idx * (plotW + gap);
      const py = streetY - plotH;
      const fh = (plotH - 8) / 2;
      return {
        plotId: pid,
        index: idx,
        x: px,
        y: py,
        w: plotW,
        h: plotH,
        streetY: streetY,
        floorRects: [0, 1].map(function (fi) {
          return {
            floorIndex: fi,
            x: px + 5,
            y: streetY - (fi + 1) * fh,
            w: plotW - 10,
            h: fh - 2,
            trunkX: px + plotW * 0.26,
            coatX: px + plotW * 0.44,
            flueX: px + plotW * 0.76
          };
        })
      };
    });
  }

  function createPenatesEngine(opts) {
    const config = opts || {};
    let reducedMotionFlag = Boolean(config.reducedMotion);
    let selectedFamilyId = LINEAGE_FAMILIES[0].id;
    let totalMigrations = 0;
    let waveCounter = 0;
    let shimmerPhase = 0;
    let lastAnchors = [];

    function createLiveFamilies() {
      return LINEAGE_FAMILIES.map(function (seed) {
        return {
          id: seed.id,
          index: seed.index,
          familyName: seed.familyName,
          childName: seed.childName,
          initialPlotId: seed.initialPlotId,
          initialVessel: seed.initialVessel,
          currentPlotId: seed.initialPlotId,
          currentPlotIndex: seed.initialPlotIndex,
          activeVessel: seed.initialVessel,
          vesselsCarried: VESSEL_IDS.slice(),
          penatesCount: 5,
          ancestors: cloneAncestors(seed.ancestors),
          familyHonor: seed.familyHonor,
          childCareerDream: seed.childCareerDream,
          essenceClaim: seed.essenceClaim,
          careerAmbitionLevel: seed.initialAmbition,
          migrationCount: 0,
          addressHistory: [seed.initialPlotId],
          genealogicalMemoryIntegrity: 1.0,
          penatesLostInTransit: 0,
          inTransit: false,
          transitFromPlotIndex: seed.initialPlotIndex,
          transitToPlotIndex: seed.initialPlotIndex,
          transitProgress: 1
        };
      });
    }

    let families = createLiveFamilies();

    function snapshotFamily(f) {
      return {
        id: f.id,
        index: f.index,
        familyName: f.familyName,
        childName: f.childName,
        initialPlotId: f.initialPlotId,
        initialVessel: f.initialVessel,
        currentPlotId: f.currentPlotId,
        currentPlotIndex: f.currentPlotIndex,
        activeVessel: f.activeVessel,
        vesselsCarried: f.vesselsCarried.slice(),
        penatesCount: f.penatesCount,
        ancestors: cloneAncestors(f.ancestors),
        familyHonor: f.familyHonor,
        childCareerDream: f.childCareerDream,
        essenceClaim: f.essenceClaim,
        careerAmbitionLevel: f.careerAmbitionLevel,
        migrationCount: f.migrationCount,
        addressHistory: f.addressHistory.slice(),
        genealogicalMemoryIntegrity: 1.0,
        penatesLostInTransit: 0,
        inTransit: f.inTransit,
        transitFromPlotIndex: f.transitFromPlotIndex,
        transitToPlotIndex: f.transitToPlotIndex,
        transitProgress: f.transitProgress
      };
    }

    function resolveFamily(familyIdOrIndex) {
      if (typeof familyIdOrIndex === 'number' && Number.isFinite(familyIdOrIndex)) {
        const idx = Math.floor(familyIdOrIndex);
        if (idx >= 0 && idx < families.length) return families[idx];
      }
      if (typeof familyIdOrIndex === 'string') {
        for (let i = 0; i < families.length; i += 1) {
          if (families[i].id === familyIdOrIndex || families[i].familyName === familyIdOrIndex) {
            return families[i];
          }
        }
        const parsed = parseInt(familyIdOrIndex, 10);
        if (!Number.isNaN(parsed) && parsed >= 0 && parsed < families.length) {
          return families[parsed];
        }
      }
      for (let j = 0; j < families.length; j += 1) {
        if (families[j].id === selectedFamilyId) return families[j];
      }
      return families[0];
    }

    function getFamilies() {
      return families.map(snapshotFamily);
    }

    function getFamiliesAtPlot(plotIdOrIndex) {
      const pIdx = resolvePlotIndex(plotIdOrIndex);
      if (pIdx === -1) return [];
      return families.filter(function (f) {
        return f.currentPlotIndex === pIdx;
      }).map(snapshotFamily);
    }

    function selectFamily(familyIdOrIndex) {
      const fam = resolveFamily(familyIdOrIndex);
      selectedFamilyId = fam.id;
      return snapshotFamily(fam);
    }

    function cycleVessel(familyIdOrIndex, explicitVesselId) {
      let fam;
      let nextVessel = explicitVesselId;
      if (explicitVesselId === undefined && typeof familyIdOrIndex === 'string' && VESSEL_BY_ID[familyIdOrIndex]) {
        fam = resolveFamily(selectedFamilyId);
        nextVessel = familyIdOrIndex;
      } else {
        fam = resolveFamily(familyIdOrIndex);
      }
      const prevVessel = fam.activeVessel;
      if (typeof nextVessel === 'string' && VESSEL_BY_ID[nextVessel]) {
        fam.activeVessel = nextVessel;
      } else {
        const curIdx = VESSEL_IDS.indexOf(fam.activeVessel);
        fam.activeVessel = VESSEL_IDS[(curIdx + 1) % VESSEL_IDS.length];
      }
      const snap = snapshotFamily(fam);
      if (typeof config.onVesselChange === 'function') {
        config.onVesselChange({ family: snap, previousVessel: prevVessel, vessel: fam.activeVessel });
      }
      return snap;
    }

    function relocateFamily(familyIdOrIndex, targetPlotIdOrIndex, vesselIdOptional) {
      const fam = resolveFamily(familyIdOrIndex);
      const fromPlotIndex = fam.currentPlotIndex;
      const fromPlotId = fam.currentPlotId;
      let targetIdx = resolvePlotIndex(targetPlotIdOrIndex);
      if (targetIdx === -1 || targetIdx === fromPlotIndex) {
        targetIdx = (fromPlotIndex + 1) % PLOT_IDS.length;
      }
      if (typeof vesselIdOptional === 'string' && VESSEL_BY_ID[vesselIdOptional]) {
        fam.activeVessel = vesselIdOptional;
      }
      fam.currentPlotIndex = targetIdx;
      fam.currentPlotId = PLOT_IDS[targetIdx];
      fam.addressHistory.push(fam.currentPlotId);
      fam.migrationCount += 1;
      totalMigrations += 1;
      fam.careerAmbitionLevel = +(Math.min(1, fam.careerAmbitionLevel + 0.12)).toFixed(3);
      fam.genealogicalMemoryIntegrity = 1.0;
      fam.penatesLostInTransit = 0;
      fam.transitFromPlotIndex = fromPlotIndex;
      fam.transitToPlotIndex = targetIdx;
      fam.inTransit = !reducedMotionFlag;
      fam.transitProgress = reducedMotionFlag ? 1 : 0;

      const snap = snapshotFamily(fam);
      const result = {
        family: snap,
        fromPlotId: fromPlotId,
        toPlotId: fam.currentPlotId,
        vessel: fam.activeVessel,
        totalMigrations: totalMigrations
      };
      if (typeof config.onRelocate === 'function') {
        config.onRelocate(result);
      }
      return result;
    }

    function emigrateWave(preferredTargetPlotIdOrIndex) {
      const prefIdx = resolvePlotIndex(preferredTargetPlotIdOrIndex);
      const primary = resolveFamily(selectedFamilyId);
      const chosen = [primary];
      for (let stepIdx = 1; chosen.length < 3 && stepIdx <= families.length; stepIdx += 1) {
        const cand = families[(primary.index + stepIdx + waveCounter) % families.length];
        if (chosen.indexOf(cand) === -1) chosen.push(cand);
      }
      waveCounter += 1;
      for (let k = 0; k < chosen.length; k += 1) {
        const f = chosen[k];
        const target = prefIdx !== -1
          ? (prefIdx + k) % PLOT_IDS.length
          : (f.currentPlotIndex + 1 + (k % 2)) % PLOT_IDS.length;
        relocateFamily(f.id, target);
      }
      return getState();
    }

    function flushTransits() {
      for (let i = 0; i < families.length; i += 1) {
        families[i].inTransit = false;
        families[i].transitProgress = 1;
      }
      return getState();
    }

    function step(dtSec, reducedMotion) {
      if (typeof reducedMotion === 'boolean') {
        reducedMotionFlag = reducedMotion;
      }
      const dt = Number.isFinite(dtSec) && dtSec > 0 ? Math.min(dtSec, 5.0) : 0.016;
      if (!reducedMotionFlag) {
        shimmerPhase = (shimmerPhase + dt * 2.35) % (Math.PI * 20);
      }
      for (let i = 0; i < families.length; i += 1) {
        const f = families[i];
        if (f.inTransit) {
          if (reducedMotionFlag) {
            f.transitProgress = 1;
            f.inTransit = false;
          } else {
            f.transitProgress = Math.min(1, f.transitProgress + dt / 1.1);
            if (f.transitProgress >= 1) {
              f.transitProgress = 1;
              f.inTransit = false;
            }
          }
        }
      }
    }

    function computeAnchors(normPlots) {
      const anchors = [];
      const perPlot = [[], [], [], []];
      for (let i = 0; i < families.length; i += 1) {
        const pIdx = Math.max(0, Math.min(3, families[i].currentPlotIndex));
        perPlot[pIdx].push(families[i]);
      }
      for (let p = 0; p < 4; p += 1) {
        const plot = normPlots[p];
        const list = perPlot[p];
        const floors = plot.floorRects;
        for (let k = 0; k < list.length; k += 1) {
          const fam = list[k];
          const fl = floors[k % floors.length];
          const tier = Math.floor(k / floors.length);
          let rx = (k % 2 === 0 && Number.isFinite(fl.trunkX))
            ? fl.trunkX
            : (Number.isFinite(fl.coatX) ? fl.coatX : fl.x + fl.w * 0.34);
          if (tier > 0) {
            const ratios = [0.22, 0.48, 0.66, 0.34];
            rx = fl.x + fl.w * ratios[(k + tier) % ratios.length];
          }
          if (Number.isFinite(fl.flueX) && Math.abs(rx - fl.flueX) < 11) {
            rx = rx < fl.flueX ? fl.flueX - 13 : fl.flueX + 13;
          }
          rx = Math.max(fl.x + 9, Math.min(fl.x + fl.w - 9, rx));
          const floorBaseY = fl.y + fl.h - 2;
          const sc = Math.max(7, Math.min(fl.h * 0.68, plot.w * 0.19, 17));
          const roomCenterY = floorBaseY - sc * 0.52;
          let cart = null;
          if (fam.inTransit && fam.transitProgress < 1) {
            const fp = normPlots[Math.max(0, Math.min(3, fam.transitFromPlotIndex))];
            const tp = normPlots[Math.max(0, Math.min(3, fam.transitToPlotIndex))];
            const sx = fp.x + fp.w * 0.5;
            const ex = tp.x + tp.w * 0.5;
            const sy = fp.streetY;
            const ey = tp.streetY;
            const ease = easeInOutCubic(fam.transitProgress);
            cart = {
              x: sx + (ex - sx) * ease,
              y: sy + (ey - sy) * ease - 3,
              fromX: sx,
              toX: ex,
              streetY: sy + (ey - sy) * 0.5,
              progress: fam.transitProgress
            };
          }
          anchors.push({
            family: fam,
            plotIndex: p,
            plotId: plot.plotId,
            x: rx,
            y: roomCenterY,
            baseY: floorBaseY,
            scale: sc,
            cart: cart
          });
        }
      }
      return anchors;
    }

    function drawVesselIcon(ctx, vesselId, cx, baseY, sc, hue, shimmer, isSelected) {
      ctx.save();
      if (isSelected) {
        ctx.strokeStyle = 'rgba(240, 212, 138, 0.72)';
        ctx.lineWidth = 1.1;
        ctx.strokeRect(cx - sc * 0.78, baseY - sc * 1.18, sc * 1.56, sc * 1.24);
      }
      if (vesselId === 'trunk') {
        const w = sc * 1.24, h = sc * 0.76, left = cx - w * 0.5, top = baseY - h;
        ctx.fillStyle = '#3b2b1f';
        ctx.fillRect(left, top, w, h);
        ctx.fillStyle = '#efe5d1';
        ctx.fillRect(left, top, w, Math.max(2, h * 0.22));
        ctx.fillStyle = hue;
        ctx.fillRect(left + w * 0.2, top, Math.max(1.6, w * 0.1), h);
        ctx.fillRect(left + w * 0.7, top, Math.max(1.6, w * 0.1), h);
        ctx.fillRect(cx - 1.8, top + h * 0.34, 3.6, 3.6);
      } else if (vesselId === 'coatrack') {
        const topY = baseY - sc * 1.12;
        ctx.strokeStyle = '#8b6843';
        ctx.lineWidth = Math.max(1.5, sc * 0.11);
        ctx.beginPath();
        ctx.moveTo(cx, baseY); ctx.lineTo(cx, topY);
        ctx.moveTo(cx - sc * 0.36, baseY); ctx.lineTo(cx, baseY - sc * 0.22); ctx.lineTo(cx + sc * 0.36, baseY);
        ctx.stroke();
        ctx.strokeStyle = hue;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(cx - sc * 0.2, topY + sc * 0.12, sc * 0.16, Math.PI * 0.2, Math.PI * 1.2);
        ctx.moveTo(cx, topY + sc * 0.12);
        ctx.arc(cx + sc * 0.2, topY + sc * 0.12, sc * 0.16, -Math.PI * 0.2, Math.PI * 0.8);
        ctx.stroke();
        ctx.fillStyle = 'rgba(239, 229, 209, 0.35)';
        ctx.beginPath();
        ctx.moveTo(cx + sc * 0.14, topY + sc * 0.2);
        ctx.lineTo(cx + sc * 0.36, baseY - sc * 0.22);
        ctx.lineTo(cx + sc * 0.05, baseY - sc * 0.25);
        ctx.closePath();
        ctx.fill();
      } else if (vesselId === 'umbrella_stand') {
        const sw = sc * 0.58, sh = sc * 0.74, sx = cx - sw * 0.5, sy = baseY - sh;
        ctx.fillStyle = 'rgba(38, 52, 77, 0.85)';
        ctx.fillRect(sx, sy, sw, sh);
        ctx.strokeStyle = hue;
        ctx.lineWidth = 1.4;
        ctx.strokeRect(sx, sy, sw, sh);
        ctx.strokeStyle = '#efe5d1';
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(cx - sw * 0.18, baseY - 2); ctx.lineTo(cx - sw * 0.42, sy - sc * 0.32);
        ctx.arc(cx - sw * 0.54, sy - sc * 0.32, sc * 0.1, 0, Math.PI, true);
        ctx.moveTo(cx + sw * 0.16, baseY - 2); ctx.lineTo(cx + sw * 0.38, sy - sc * 0.26);
        ctx.stroke();
      } else {
        const sway = Math.sin(shimmer) * 0.14;
        const ry = baseY - sc * 0.78;
        ctx.translate(cx, ry);
        ctx.rotate(sway);
        ctx.strokeStyle = hue;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, sc * 0.26, 0, Math.PI * 2);
        ctx.stroke();
        for (let k = -1; k <= 1; k += 1) {
          ctx.beginPath();
          ctx.moveTo(k * sc * 0.13, sc * 0.22);
          ctx.lineTo(k * sc * 0.18, sc * 0.62);
          ctx.lineTo(k * sc * 0.18 + 2.4, sc * 0.62);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawHandcart(ctx, cart, vesselHue, shimmer) {
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = 'rgba(217, 180, 91, 0.45)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cart.fromX, cart.streetY - 2);
      ctx.lineTo(cart.toX, cart.streetY - 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const dir = cart.toX >= cart.fromX ? 1 : -1;
      ctx.translate(cart.x, cart.y);
      ctx.strokeStyle = '#c9a14a';
      ctx.fillStyle = '#3b2b1f';
      ctx.lineWidth = 1.4;
      ctx.fillRect(-11, -9, 20, 4);
      ctx.beginPath();
      ctx.moveTo(-11 * dir, -7);
      ctx.lineTo(-17 * dir, -12);
      ctx.stroke();
      ctx.fillStyle = '#4a3525';
      ctx.fillRect(-9, -18, 12, 9);
      ctx.fillStyle = vesselHue;
      ctx.fillRect(-6, -18, 2, 9);
      ctx.fillRect(0, -18, 2, 9);
      ctx.strokeStyle = '#e6c675';
      ctx.beginPath();
      ctx.moveTo(5, -9); ctx.lineTo(5, -21);
      ctx.arc(5, -21, 2.5, 0, Math.PI, true);
      ctx.stroke();
      ctx.strokeStyle = '#f0d48a';
      ctx.beginPath();
      ctx.arc(0, -3.5, 4, 0, Math.PI * 2);
      const ang = cart.progress * Math.PI * 6 * dir + shimmer * 0.2;
      ctx.moveTo(Math.cos(ang) * 4, -3.5 + Math.sin(ang) * 4);
      ctx.lineTo(-Math.cos(ang) * 4, -3.5 - Math.sin(ang) * 4);
      ctx.stroke();
      ctx.restore();
    }

    function drawPenatesSpirits(ctx, cx, baseY, sc, reveal, quietude, ambition, shimmer, rm) {
      ctx.save();
      if (reveal <= 0.01) {
        const pulse = rm ? 0.42 : 0.26 + 0.22 * Math.sin(shimmer * 1.4 + cx * 0.05);
        ctx.fillStyle = 'rgba(240, 212, 138, ' + pulse.toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(cx - sc * 0.18, baseY - sc * 0.62, 1.25, 0, Math.PI * 2);
        ctx.arc(cx + sc * 0.22, baseY - sc * 0.78, 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }
      const alpha = Math.min(1, reveal);
      const haloR = sc * (0.62 + ambition * 0.22);
      const centerY = baseY - sc * 0.96;

      ctx.strokeStyle = 'rgba(217, 180, 91, ' + (alpha * 0.55).toFixed(3) + ')';
      ctx.lineWidth = 1.05;
      ctx.beginPath();
      ctx.arc(cx, centerY + 1, haloR, Math.PI * 0.72, Math.PI * 1.18);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, centerY + 1, haloR, -Math.PI * 0.18, Math.PI * 0.28);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(239, 229, 209, ' + (alpha * 0.68).toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(cx, centerY - 2, haloR * 0.72, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();

      const offsets = [-0.46, -0.22, 0, 0.22, 0.46];
      for (let i = 0; i < 5; i += 1) {
        const bob = rm ? 0 : Math.sin(shimmer * 1.8 + i * 1.3) * 1.2;
        const sx = cx + offsets[i] * sc * 0.95;
        const sy = baseY - sc * (0.86 + (i % 2) * 0.18) + bob;
        const figH = 4.6 + (i === 2 ? 1.6 : 0.6);
        ctx.fillStyle = 'rgba(240, 212, 138, ' + (alpha * 0.94).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(sx, sy - figH * 0.62, 1.35, 0, Math.PI * 2);
        ctx.moveTo(sx, sy - figH * 0.42);
        ctx.lineTo(sx - 1.7, sy + figH * 0.38);
        ctx.lineTo(sx + 1.7, sy + figH * 0.38);
        ctx.closePath();
        ctx.fill();
      }
      if (quietude >= 0.55) {
        ctx.strokeStyle = 'rgba(240, 212, 138, ' + (alpha * 0.38).toFixed(3) + ')';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.arc(cx, centerY - 3, haloR + 3, Math.PI * 1.22, Math.PI * 1.78);
        ctx.stroke();
      }
      ctx.restore();
    }

    function renderPenatesLayer(ctx, plotRects, renderOpts) {
      if (!ctx) return;
      const ro = renderOpts || {};
      const rm = typeof ro.reducedMotion === 'boolean' ? ro.reducedMotion : reducedMotionFlag;
      const quietude = Number.isFinite(ro.nightQuietude) ? ro.nightQuietude : 0.2;
      const selFamId = ro.selectedFamilyId || selectedFamilyId;
      const phase = Number.isFinite(ro.timeSec) && !rm ? ro.timeSec * 2.2 : shimmerPhase;
      const normPlots = normalizePlotRects(plotRects, ro.width, ro.height);
      const anchors = computeAnchors(normPlots);
      lastAnchors = anchors;

      const steth = ro.stethoscopePoint || ro.stethoscope || null;
      const stethActive = Boolean(steth && steth.active !== false && (Number.isFinite(steth.x) || Number.isFinite(steth.px)));
      const stethX = stethActive ? (Number.isFinite(steth.x) ? steth.x : steth.px) : -9999;
      const stethY = stethActive ? (Number.isFinite(steth.y) ? steth.y : steth.py) : -9999;
      const stethRad = steth && Number.isFinite(steth.radius) ? steth.radius : 88;

      for (let i = 0; i < anchors.length; i += 1) {
        const a = anchors[i];
        const fam = a.family;
        const vessel = VESSEL_BY_ID[fam.activeVessel] || VESSELS[0];
        const isSel = fam.id === selFamId;
        const dist = stethActive ? Math.hypot(a.x - stethX, a.y - stethY) : Infinity;
        const inSteth = dist <= stethRad;
        const nightRev = quietude >= 0.55 ? Math.min(1, 0.58 + (quietude - 0.55) / 0.45) : 0;
        const stethRev = inSteth ? Math.min(1, 0.55 + (stethRad - dist) / stethRad) : 0;
        const reveal = Math.max(nightRev, stethRev);

        if (a.cart) {
          drawHandcart(ctx, a.cart, vessel.hue, phase + i);
          const cDist = stethActive ? Math.hypot(a.cart.x - stethX, a.cart.y - stethY) : Infinity;
          const cRev = Math.max(nightRev, cDist <= stethRad ? 0.9 : 0);
          drawPenatesSpirits(ctx, a.cart.x, a.cart.y - 10, 9, cRev, quietude, fam.careerAmbitionLevel, phase + i, rm);
          ctx.save();
          ctx.globalAlpha = 0.42;
          drawVesselIcon(ctx, vessel.id, a.x, a.baseY, a.scale, vessel.hue, phase + i, isSel);
          ctx.restore();
        } else {
          drawVesselIcon(ctx, vessel.id, a.x, a.baseY, a.scale, vessel.hue, phase + i, isSel);
          drawPenatesSpirits(ctx, a.x, a.baseY, a.scale, reveal, quietude, fam.careerAmbitionLevel, phase + i, rm);
        }
      }
    }

    function hitTestPenates(px, py, plotRects) {
      if (!Number.isFinite(px) || !Number.isFinite(py)) return null;
      const anchors = Array.isArray(plotRects) && plotRects.length > 0
        ? computeAnchors(normalizePlotRects(plotRects))
        : lastAnchors;
      let best = null;
      let bestDist = 22;
      for (let i = 0; i < anchors.length; i += 1) {
        const a = anchors[i];
        const dRoom = Math.hypot(px - a.x, py - a.y);
        const dCart = a.cart ? Math.hypot(px - a.cart.x, py - (a.cart.y - 10)) : Infinity;
        const d = Math.min(dRoom, dCart);
        if (d <= bestDist) {
          bestDist = d;
          best = a;
        }
      }
      if (!best) return null;
      const fam = best.family;
      const vessel = VESSEL_BY_ID[fam.activeVessel] || VESSELS[0];
      return {
        kind: 'penates_vessel',
        species: 'penates',
        familyId: fam.id,
        familyName: fam.familyName,
        vesselId: vessel.id,
        vesselLabel: vessel.label,
        plotId: fam.currentPlotId,
        plotIndex: fam.currentPlotIndex,
        ancestors: cloneAncestors(fam.ancestors),
        familyHonor: fam.familyHonor,
        childCareerDream: fam.childCareerDream
      };
    }

    function getNocturnalUtterance(beatIndex, context) {
      const ctxObj = context || {};
      const b = Math.max(0, Math.floor(Number(beatIndex) || 0));
      const vocalMode = VOCAL_MODES.indexOf(ctxObj.vocalMode) !== -1
        ? ctxObj.vocalMode
        : VOCAL_MODES[b % VOCAL_MODES.length];
      const axisPattern = [0, 1, 1, 0];
      const axis = DISCOURSE_AXES.indexOf(ctxObj.axis) !== -1
        ? ctxObj.axis
        : DISCOURSE_AXES[axisPattern[b % axisPattern.length]];
      let fam = null;
      if (ctxObj.familyId !== undefined && ctxObj.familyId !== null) {
        fam = resolveFamily(ctxObj.familyId);
      } else if (ctxObj.plotId !== undefined && ctxObj.plotId !== null) {
        const pIdx = resolvePlotIndex(ctxObj.plotId);
        const onPlot = families.filter(function (f) { return f.currentPlotIndex === pIdx; });
        if (onPlot.length > 0) fam = onPlot[b % onPlot.length];
      }
      if (!fam) {
        fam = families[(b + Math.floor(b / 2)) % families.length];
      }
      const vessel = VESSEL_BY_ID[fam.activeVessel] || VESSELS[0];
      return {
        speaker: 'penates',
        familyId: fam.id,
        familyName: fam.familyName,
        vesselId: vessel.id,
        vesselLabel: vessel.label,
        nicheOrVessel: vessel.id,
        plotId: fam.currentPlotId,
        vocalMode: vocalMode,
        axis: axis,
        text: composeUtteranceText(fam, vessel, vocalMode, axis, b)
      };
    }

    function getState() {
      const counts = { trunk: 0, coatrack: 0, umbrella_stand: 0, key_ring: 0 };
      let penatesSum = 0;
      for (let i = 0; i < families.length; i += 1) {
        counts[families[i].activeVessel] = (counts[families[i].activeVessel] || 0) + 1;
        penatesSum += families[i].penatesCount;
      }
      return {
        selectedFamilyId: selectedFamilyId,
        totalPenatesCount: penatesSum,
        familyCount: families.length,
        totalMigrations: totalMigrations,
        penatesLostInTransit: 0,
        genealogicalMemoryIntegrity: 1.0,
        futureCareerDreamsActive: families.length,
        vesselTypes: VESSEL_IDS.slice(),
        vesselCounts: counts,
        families: getFamilies()
      };
    }

    function reset() {
      families = createLiveFamilies();
      selectedFamilyId = LINEAGE_FAMILIES[0].id;
      totalMigrations = 0;
      waveCounter = 0;
      shimmerPhase = 0;
      lastAnchors = [];
      return getState();
    }

    return {
      getFamilies: getFamilies,
      getFamiliesAtPlot: getFamiliesAtPlot,
      selectFamily: selectFamily,
      cycleVessel: cycleVessel,
      relocateFamily: relocateFamily,
      emigrateWave: emigrateWave,
      flushTransits: flushTransits,
      step: step,
      renderPenatesLayer: renderPenatesLayer,
      hitTestPenates: hitTestPenates,
      getNocturnalUtterance: getNocturnalUtterance,
      getState: getState,
      reset: reset
    };
  }

  const api = Object.freeze({
    PLOT_IDS: PLOT_IDS,
    PLOT_ADDRESSES: PLOT_ADDRESSES,
    VOCAL_MODES: VOCAL_MODES,
    DISCOURSE_AXES: DISCOURSE_AXES,
    VESSELS: VESSELS,
    LINEAGE_FAMILIES: LINEAGE_FAMILIES,
    createPenatesEngine: createPenatesEngine
  });

  globalThis.LeandraMigratingPenates = api;
  if (typeof window !== 'undefined' && window) {
    window.LeandraMigratingPenates = api;
  }
  if (typeof module === 'object' && module && module.exports) {
    module.exports = api;
  }
})();
