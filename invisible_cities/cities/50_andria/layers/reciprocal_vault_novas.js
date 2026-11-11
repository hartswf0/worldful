(function (global) {
  'use strict';

  var TWO_PI = Math.PI * 2;
  var DEG2RAD = Math.PI / 180;

  var PALETTE = {
    travertine: '#efe5cf',
    parchment: '#dfd0b0',
    terracotta: '#b55a38',
    bambooJade: '#4a7a5c',
    brass: '#c89b43',
    bronze: '#7a5821',
    lapis: '#0b1326',
    indigo: '#17284a',
    deepVoid: '#060b17',
    novaGold: '#ffd97d',
    nebulaCyan: '#72d1c6',
    inkIron: '#1c1813'
  };

  var LUMINOUS_STARS = [
    {
      star: 'Cepheids',
      raDeg: 40,
      decDeg: 54,
      poleR: 0.28,
      color: '#ffe8a3',
      glow: 'rgba(255, 224, 140, 0.46)',
      coupledId: 'bamboo_suspended_street',
      celestialId: 'star_cluster_nova',
      epithet: 'Pulsating Rite Cluster'
    },
    {
      star: 'Antares',
      raDeg: 136,
      decDeg: 18,
      poleR: 0.57,
      color: '#ff6e4a',
      glow: 'rgba(255, 102, 71, 0.50)',
      coupledId: 'shadow_theater_kennels',
      celestialId: 'nebula_condensed_planet',
      epithet: 'Crimson Supergiant of Mars Arc'
    },
    {
      star: 'Alpheratz',
      raDeg: 226,
      decDeg: 28,
      poleR: 0.51,
      color: '#c4e2ff',
      glow: 'rgba(162, 208, 255, 0.48)',
      coupledId: 'statue_of_thales',
      celestialId: 'saturn_ring_perturbation',
      epithet: 'Sapphire Beacon of the Mole'
    },
    {
      star: 'Capella',
      raDeg: 314,
      decDeg: 14,
      poleR: 0.63,
      color: '#ffd97d',
      glow: 'rgba(255, 217, 125, 0.48)',
      coupledId: 'gymnastics_toboggan_slide',
      celestialId: 'milky_way_expansion',
      epithet: 'Golden Binary of the Palaestra'
    }
  ];

  var CELESTIAL_NOVELTIES = [
    {
      id: 'bamboo_suspended_street',
      celestialId: 'star_cluster_nova',
      star: 'Cepheids',
      raDeg: 62,
      decDeg: 47,
      poleR: 0.36,
      title: 'Nova Explosion in Globular Cluster',
      dormantTitle: 'Dormant Globular Star Cluster',
      earthDistrict: 'Mercury-Venus Bamboo Crossing'
    },
    {
      id: 'shadow_theater_kennels',
      celestialId: 'nebula_condensed_planet',
      star: 'Antares',
      raDeg: 162,
      decDeg: 25,
      poleR: 0.46,
      title: 'Gaseous Nebula Condensing into Planet',
      dormantTitle: 'Uncondensed Cyan-Violet Nebula',
      earthDistrict: 'Mars Arc Shadow-Theater'
    },
    {
      id: 'statue_of_thales',
      celestialId: 'saturn_ring_perturbation',
      star: 'Alpheratz',
      raDeg: 252,
      decDeg: 20,
      poleR: 0.49,
      title: 'Orbital Perturbation in Saturn Rings',
      dormantTitle: 'Level Saturnian Ring Plane',
      earthDistrict: 'Jupiter Port Quay of Thales'
    },
    {
      id: 'gymnastics_toboggan_slide',
      celestialId: 'milky_way_expansion',
      star: 'Capella',
      raDeg: 338,
      decDeg: 32,
      poleR: 0.42,
      title: 'Curved Expansion of the Milky Way',
      dormantTitle: 'Straight Galactic River',
      earthDistrict: 'Saturn Terrace Gymnastics Slide'
    }
  ];

  var CONSTELLATION_CHORDS = [
    {
      id: 'bamboo_suspended_street',
      nodes: [[24, 0.22], [40, 0.28], [62, 0.36], [80, 0.27], [40, 0.28]]
    },
    {
      id: 'shadow_theater_kennels',
      nodes: [[118, 0.48], [136, 0.57], [162, 0.46], [180, 0.60], [136, 0.57]]
    },
    {
      id: 'statue_of_thales',
      nodes: [[208, 0.42], [226, 0.51], [252, 0.49], [268, 0.64], [226, 0.51]]
    },
    {
      id: 'gymnastics_toboggan_slide',
      nodes: [[296, 0.54], [314, 0.63], [338, 0.42], [352, 0.58], [314, 0.63]]
    }
  ];

  var FIELD_STARS = (function buildFieldStars() {
    var list = [];
    var seed = 50173;
    var tints = ['#eef4ff', '#ffdca8', '#cfe3ff', '#f7ecd5', '#9fd8d2'];
    for (var i = 0; i < 116; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      var u1 = (seed & 0xffff) / 65535;
      seed = (seed * 1664525 + 1013904223) >>> 0;
      var u2 = (seed & 0xffff) / 65535;
      seed = (seed * 1664525 + 1013904223) >>> 0;
      var u3 = (seed & 0xffff) / 65535;
      list.push({
        raDeg: u1 * 360,
        poleR: 0.06 + Math.sqrt(u2) * 0.89,
        mag: 0.55 + u3 * 1.55,
        tint: tints[i % tints.length],
        phase: u3 * TWO_PI
      });
    }
    return list;
  })();

  function clamp(v, lo, hi) {
    return v < lo ? lo : (v > hi ? hi : v);
  }

  function resolveLocus(rawKey) {
    if (!rawKey && rawKey !== 0) {
      return null;
    }
    var key = String(rawKey).trim();
    var lower = key.toLowerCase();
    for (var i = 0; i < CELESTIAL_NOVELTIES.length; i++) {
      var nov = CELESTIAL_NOVELTIES[i];
      if (nov.id === key || nov.celestialId === key ||
          nov.id.toLowerCase() === lower || nov.celestialId.toLowerCase() === lower) {
        return {
          kind: 'novelty',
          focusKey: nov.celestialId,
          id: nov.id,
          celestialId: nov.celestialId,
          star: nov.star,
          raDeg: nov.raDeg,
          decDeg: nov.decDeg,
          poleR: nov.poleR,
          label: nov.title
        };
      }
    }
    for (var j = 0; j < LUMINOUS_STARS.length; j++) {
      var st = LUMINOUS_STARS[j];
      if (st.star === key || st.star.toLowerCase() === lower) {
        return {
          kind: 'star',
          focusKey: st.star,
          id: st.coupledId,
          celestialId: st.celestialId,
          star: st.star,
          raDeg: st.raDeg,
          decDeg: st.decDeg,
          poleR: st.poleR,
          label: st.star + ' — ' + st.epithet
        };
      }
    }
    return null;
  }

  function computeGeometry(w, h, state) {
    var cx = w * 0.5;
    var cy = h * 0.5;
    var minDim = Math.min(w, h);
    var bezelOuter = Math.max(58, minDim * 0.455);
    var domeR = bezelOuter * (state.telescopeMode === 'ocular' ? 0.89 : 0.875);
    var vaultRad = state.siderealPhase * TWO_PI - Math.PI * 0.5;
    var zoom = state.telescopeMode === 'ocular' ? 2.32 : 1.0;
    return {
      w: w,
      h: h,
      cx: cx,
      cy: cy,
      bezelOuter: bezelOuter,
      domeR: domeR,
      vaultRad: vaultRad,
      zoom: zoom,
      aimX: state.aimX,
      aimY: state.aimY,
      ocular: state.telescopeMode === 'ocular'
    };
  }

  function unitSkyCoords(raDeg, poleR, vaultRad) {
    var ang = raDeg * DEG2RAD + vaultRad;
    return {
      ux: Math.cos(ang) * poleR,
      uy: Math.sin(ang) * poleR
    };
  }

  function projectSky(raDeg, poleR, geom) {
    var u = unitSkyCoords(raDeg, poleR, geom.vaultRad);
    if (geom.ocular) {
      return {
        x: geom.cx + (u.ux - geom.aimX) * geom.domeR * geom.zoom,
        y: geom.cy + (u.uy - geom.aimY) * geom.domeR * geom.zoom,
        scale: geom.zoom
      };
    }
    return {
      x: geom.cx + u.ux * geom.domeR,
      y: geom.cy + u.uy * geom.domeR,
      scale: 1.0
    };
  }

  function createSkyAudio() {
    var muted = true;
    var audioCtx = null;
    var droneGain = null;
    var droneStarted = false;

    function ensureContext() {
      if (audioCtx) {
        if (audioCtx.state === 'suspended') {
          try { audioCtx.resume(); } catch (_) {}
        }
        return audioCtx;
      }
      var Ctor = global.AudioContext || global.webkitAudioContext;
      if (!Ctor) {
        return null;
      }
      try {
        audioCtx = new Ctor();
        var filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 510;
        droneGain = audioCtx.createGain();
        droneGain.gain.value = 0.0001;
        filter.connect(droneGain);
        droneGain.connect(audioCtx.destination);
        var freqs = [196.0, 294.0, 441.0];
        for (var i = 0; i < freqs.length; i++) {
          var osc = audioCtx.createOscillator();
          var g = audioCtx.createGain();
          osc.type = i === 0 ? 'sine' : 'triangle';
          osc.frequency.value = freqs[i];
          g.gain.value = i === 0 ? 0.48 : (i === 1 ? 0.30 : 0.16);
          osc.connect(g);
          g.connect(filter);
          osc.start();
        }
        droneStarted = true;
      } catch (_) {
        audioCtx = null;
      }
      return audioCtx;
    }

    function voiceNote(freq, delay, dur, peak, type, slideFreq) {
      if (muted || !audioCtx) {
        return;
      }
      try {
        var now = audioCtx.currentTime + (delay || 0);
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        var lp = audioCtx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(2200, now);
        osc.type = type || 'sine';
        osc.frequency.setValueAtTime(freq, now);
        if (slideFreq) {
          osc.frequency.exponentialRampToValueAtTime(slideFreq, now + dur * 0.85);
        }
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(peak || 0.045, now + 0.024);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(lp);
        lp.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.04);
      } catch (_) {}
    }

    return {
      setMuted: function (flag) {
        muted = Boolean(flag);
        if (!muted) {
          var ac = ensureContext();
          if (ac && droneStarted && droneGain) {
            try {
              droneGain.gain.cancelScheduledValues(ac.currentTime);
              droneGain.gain.setTargetAtTime(0.018, ac.currentTime, 0.14);
            } catch (_) {}
          }
        } else if (audioCtx && droneGain) {
          try {
            droneGain.gain.cancelScheduledValues(audioCtx.currentTime);
            droneGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.08);
          } catch (_) {}
        }
        return muted;
      },
      toggleMute: function () {
        return this.setMuted(!muted);
      },
      isMuted: function () {
        return muted;
      },
      playPrudenceChord: function (weighed) {
        if (muted || !audioCtx) { return; }
        if (weighed) {
          voiceNote(293.66, 0.00, 0.55, 0.042, 'triangle');
          voiceNote(440.00, 0.05, 0.62, 0.038, 'sine');
          voiceNote(587.33, 0.11, 0.70, 0.032, 'sine');
        } else {
          voiceNote(392.00, 0.00, 0.32, 0.030, 'sine');
          voiceNote(440.00, 0.07, 0.34, 0.024, 'sine');
        }
      },
      playBlockedDissonance: function () {
        if (muted || !audioCtx) { return; }
        voiceNote(130.81, 0.00, 0.36, 0.055, 'triangle', 98.0);
        voiceNote(138.59, 0.02, 0.34, 0.042, 'sawtooth', 103.8);
      },
      playNoveltyTone: function (id) {
        if (muted || !audioCtx) { return; }
        var loc = resolveLocus(id);
        var cid = loc ? loc.celestialId : String(id || '');
        if (cid === 'star_cluster_nova') {
          voiceNote(587.33, 0.00, 0.75, 0.044, 'sine');
          voiceNote(880.00, 0.04, 0.80, 0.038, 'triangle');
          voiceNote(1174.66, 0.09, 0.88, 0.032, 'sine');
          voiceNote(1760.00, 0.14, 0.65, 0.022, 'sine');
        } else if (cid === 'nebula_condensed_planet') {
          voiceNote(220.00, 0.00, 0.85, 0.048, 'sine', 293.66);
          voiceNote(329.63, 0.06, 0.82, 0.036, 'triangle', 440.00);
        } else if (cid === 'saturn_ring_perturbation') {
          voiceNote(261.63, 0.00, 0.76, 0.042, 'triangle');
          voiceNote(392.00, 0.05, 0.80, 0.038, 'sine', 396.50);
          voiceNote(523.25, 0.12, 0.72, 0.028, 'sine');
        } else {
          var notes = [329.63, 392.00, 493.88, 587.33, 783.99];
          for (var k = 0; k < notes.length; k++) {
            voiceNote(notes[k], k * 0.055, 0.65, 0.032, 'sine');
          }
        }
      }
    };
  }

  function drawSkyScene(c, geom, state) {
    var w = geom.w, h = geom.h, cx = geom.cx, cy = geom.cy, r = geom.domeR;
    c.fillStyle = PALETTE.deepVoid;
    c.fillRect(0, 0, w, h);

    c.save();
    c.beginPath();
    c.arc(cx, cy, r, 0, TWO_PI);
    c.clip();

    var skyGrad = c.createRadialGradient(cx - r * 0.14, cy - r * 0.18, r * 0.04, cx, cy, r * 1.04);
    skyGrad.addColorStop(0, '#1c325c');
    skyGrad.addColorStop(0.55, PALETTE.indigo);
    skyGrad.addColorStop(1, PALETTE.lapis);
    c.fillStyle = skyGrad;
    c.fillRect(cx - r - 4, cy - r - 4, r * 2 + 8, r * 2 + 8);

    if (!geom.ocular) {
      c.strokeStyle = 'rgba(200, 155, 67, 0.20)';
      c.lineWidth = 0.9;
      for (var dr = 0.25; dr <= 0.76; dr += 0.25) {
        c.beginPath();
        c.arc(cx, cy, r * dr, 0, TWO_PI);
        c.stroke();
      }
      c.beginPath();
      c.moveTo(cx - r, cy); c.lineTo(cx + r, cy);
      c.moveTo(cx, cy - r); c.lineTo(cx, cy + r);
      c.stroke();
    }

    var mwProg = state.progressMap.milky_way_expansion || 0;
    for (var m = 0; m <= 26; m++) {
      var u = (m / 26) * 1.72 - 0.86;
      var bend = (0.04 + 0.34 * mwProg) * (1 - u * u);
      var lx = u * 0.88 - bend * 0.42;
      var ly = -u * 0.56 + bend * 0.92;
      var rotA = geom.vaultRad + 0.52;
      var wx = lx * Math.cos(rotA) - ly * Math.sin(rotA);
      var wy = lx * Math.sin(rotA) + ly * Math.cos(rotA);
      var px = geom.ocular ? cx + (wx - geom.aimX) * r * geom.zoom : cx + wx * r;
      var py = geom.ocular ? cy + (wy - geom.aimY) * r * geom.zoom : cy + wy * r;
      var bw = r * geom.zoom * (0.09 + 0.15 * mwProg) * (1.05 - 0.32 * Math.abs(u));
      var mg = c.createRadialGradient(px, py, bw * 0.06, px, py, bw);
      mg.addColorStop(0, mwProg > 0.05 ? 'rgba(255, 224, 150, ' + (0.10 + 0.26 * mwProg).toFixed(3) + ')' : 'rgba(155, 185, 230, 0.10)');
      mg.addColorStop(0.55, 'rgba(114, 209, 198, ' + (0.05 + 0.17 * mwProg).toFixed(3) + ')');
      mg.addColorStop(1, 'rgba(11, 19, 38, 0)');
      c.fillStyle = mg;
      c.beginPath();
      c.arc(px, py, bw, 0, TWO_PI);
      c.fill();
      if (mwProg > 0.08) {
        c.fillStyle = 'rgba(255, 245, 214, ' + (0.35 + 0.5 * mwProg).toFixed(2) + ')';
        c.fillRect(px + Math.sin(m * 2.3) * bw * 0.38, py + Math.cos(m * 1.7) * bw * 0.34, 1.8 * geom.zoom, 1.8 * geom.zoom);
      }
    }

    for (var s = 0; s < FIELD_STARS.length; s++) {
      var fs = FIELD_STARS[s];
      var fp = projectSky(fs.raDeg, fs.poleR, geom);
      var tw = state.reducedMotion ? 0.82 : (0.65 + 0.35 * Math.sin(state.time * 2.1 + fs.phase));
      c.globalAlpha = tw * 0.78;
      c.fillStyle = fs.tint;
      c.beginPath();
      c.arc(fp.x, fp.y, fs.mag * (geom.ocular ? 1.45 : 1.0), 0, TWO_PI);
      c.fill();
    }
    c.globalAlpha = 1;

    for (var ch = 0; ch < CONSTELLATION_CHORDS.length; ch++) {
      var grp = CONSTELLATION_CHORDS[ch];
      var isHi = state.focusedEarthId === grp.id || (state.activeMap[grp.id] === true);
      c.strokeStyle = isHi ? 'rgba(255, 217, 125, 0.58)' : 'rgba(114, 209, 198, 0.24)';
      c.lineWidth = isHi ? 1.4 : 0.9;
      c.beginPath();
      for (var n = 0; n < grp.nodes.length; n++) {
        var np = projectSky(grp.nodes[n][0], grp.nodes[n][1], geom);
        if (n === 0) { c.moveTo(np.x, np.y); } else { c.lineTo(np.x, np.y); }
      }
      c.stroke();
    }

    for (var ls = 0; ls < LUMINOUS_STARS.length; ls++) {
      var st = LUMINOUS_STARS[ls];
      var sp = projectSky(st.raDeg, st.poleR, geom);
      var pulse = st.star === 'Cepheids' && !state.reducedMotion ? (0.84 + 0.26 * Math.sin(state.time * 3.6)) : 1.0;
      var sr = (geom.ocular ? 6.2 : 4.2) * pulse;
      var sg = c.createRadialGradient(sp.x, sp.y, 0.5, sp.x, sp.y, sr * 4.2);
      sg.addColorStop(0, st.color);
      sg.addColorStop(0.35, st.glow);
      sg.addColorStop(1, 'rgba(11, 19, 38, 0)');
      c.fillStyle = sg;
      c.beginPath(); c.arc(sp.x, sp.y, sr * 4.2, 0, TWO_PI); c.fill();
      if (st.star === 'Cepheids') {
        var offs = [[0, 0], [-6, -4], [6, -3], [-4, 6], [5, 5]];
        c.fillStyle = st.color;
        for (var ci = 0; ci < offs.length; ci++) {
          c.beginPath();
          c.arc(sp.x + offs[ci][0] * pulse * sp.scale * 0.7, sp.y + offs[ci][1] * pulse * sp.scale * 0.7, sr * (ci === 0 ? 0.65 : 0.42), 0, TWO_PI);
          c.fill();
        }
      } else if (st.star === 'Capella') {
        var binA = state.time * 1.4;
        var sep = 3.4 * sp.scale;
        c.fillStyle = '#ffd97d';
        c.beginPath(); c.arc(sp.x - Math.cos(binA) * sep, sp.y - Math.sin(binA) * sep, sr * 0.68, 0, TWO_PI); c.fill();
        c.fillStyle = '#fff3cf';
        c.beginPath(); c.arc(sp.x + Math.cos(binA) * sep, sp.y + Math.sin(binA) * sep, sr * 0.52, 0, TWO_PI); c.fill();
      } else {
        c.strokeStyle = st.color;
        c.lineWidth = 1.1;
        c.beginPath();
        c.moveTo(sp.x - sr * 2.5, sp.y); c.lineTo(sp.x + sr * 2.5, sp.y);
        c.moveTo(sp.x, sp.y - sr * 2.5); c.lineTo(sp.x, sp.y + sr * 2.5);
        c.stroke();
        c.fillStyle = '#ffffff';
        c.beginPath(); c.arc(sp.x, sp.y, sr * 0.7, 0, TWO_PI); c.fill();
      }
      c.fillStyle = PALETTE.travertine;
      c.font = (geom.ocular ? '600 11px' : '600 10px') + ' Georgia, serif';
      c.fillText(st.star, sp.x + sr * 1.5 + 3, sp.y - sr * 0.8);
    }

    drawNoveltiesLayer(c, geom, state);
    c.restore();
    drawBezelAndReticle(c, geom, state);
  }

  function drawNoveltiesLayer(c, geom, state) {
    for (var i = 0; i < CELESTIAL_NOVELTIES.length; i++) {
      var nov = CELESTIAL_NOVELTIES[i];
      var pt = projectSky(nov.raDeg, nov.poleR, geom);
      var p = state.progressMap[nov.celestialId] || 0;
      var sc = pt.scale;
      c.save();
      c.translate(pt.x, pt.y);

      if (nov.celestialId === 'star_cluster_nova') {
        for (var k = 0; k < 12; k++) {
          var ca = k * 0.52 + 0.3;
          var cr = (4 + (k % 3) * 4.2 + p * 10) * sc;
          c.fillStyle = p > 0.1 ? '#fff6d6' : 'rgba(202, 222, 255, 0.65)';
          c.beginPath(); c.arc(Math.cos(ca) * cr, Math.sin(ca) * cr, (1.2 + p * 0.9) * sc, 0, TWO_PI); c.fill();
        }
        if (p > 0.02) {
          var nr = (18 + 26 * p) * sc;
          var ng = c.createRadialGradient(0, 0, 1, 0, 0, nr);
          ng.addColorStop(0, '#ffffff');
          ng.addColorStop(0.28, 'rgba(255, 217, 125, ' + (0.88 * p).toFixed(2) + ')');
          ng.addColorStop(0.68, 'rgba(255, 130, 62, ' + (0.42 * p).toFixed(2) + ')');
          ng.addColorStop(1, 'rgba(11, 19, 38, 0)');
          c.fillStyle = ng;
          c.beginPath(); c.arc(0, 0, nr, 0, TWO_PI); c.fill();
          c.strokeStyle = 'rgba(255, 232, 168, ' + (0.82 * p).toFixed(2) + ')';
          c.lineWidth = 1.5 * sc;
          c.beginPath(); c.arc(0, 0, (10 + 18 * p) * sc, 0, TWO_PI); c.stroke();
          c.strokeStyle = 'rgba(114, 209, 198, ' + (0.55 * p).toFixed(2) + ')';
          c.beginPath(); c.arc(0, 0, (16 + 24 * p) * sc, 0, TWO_PI); c.stroke();
          c.strokeStyle = '#fff9e2';
          for (var spk = 0; spk < 8; spk++) {
            var sa = spk * Math.PI * 0.25 + (state.reducedMotion ? 0 : state.time * 0.18);
            var sl = (spk % 2 === 0 ? 28 : 17) * p * sc;
            c.beginPath(); c.moveTo(-Math.cos(sa) * sl, -Math.sin(sa) * sl); c.lineTo(Math.cos(sa) * sl, Math.sin(sa) * sl); c.stroke();
          }
        }
      } else if (nov.celestialId === 'nebula_condensed_planet') {
        var cloudR = (24 - 11 * p) * sc;
        var cg = c.createRadialGradient(0, 0, 1, 0, 0, cloudR);
        cg.addColorStop(0, 'rgba(114, 209, 198, ' + (0.52 - 0.22 * p).toFixed(2) + ')');
        cg.addColorStop(0.55, 'rgba(128, 108, 218, ' + (0.34 - 0.16 * p).toFixed(2) + ')');
        cg.addColorStop(1, 'rgba(11, 19, 38, 0)');
        c.fillStyle = cg;
        c.beginPath(); c.arc(0, 0, cloudR, 0, TWO_PI); c.fill();
        if (p > 0.02) {
          c.strokeStyle = 'rgba(114, 209, 198, ' + (0.72 * p).toFixed(2) + ')';
          c.lineWidth = 1.3 * sc;
          for (var arm = 0; arm < 3; arm++) {
            c.beginPath();
            for (var stp = 0; stp <= 14; stp++) {
              var fr = stp / 14;
              var aa = arm * (TWO_PI / 3) + fr * 3.4 + (state.reducedMotion ? 0 : state.time * 1.1);
              var ar = (4 + (1 - fr) * 18) * sc;
              if (stp === 0) { c.moveTo(Math.cos(aa) * ar, Math.sin(aa) * ar); } else { c.lineTo(Math.cos(aa) * ar, Math.sin(aa) * ar); }
            }
            c.stroke();
          }
          var pr = (4.5 + 5.8 * p) * sc;
          c.fillStyle = '#e5b368';
          c.beginPath(); c.arc(0, 0, pr, 0, TWO_PI); c.fill();
          c.strokeStyle = PALETTE.terracotta;
          c.lineWidth = 1.6 * sc;
          c.beginPath(); c.moveTo(-pr * 0.9, -pr * 0.22); c.lineTo(pr * 0.9, -pr * 0.22); c.stroke();
          c.strokeStyle = PALETTE.travertine;
          c.beginPath(); c.moveTo(-pr * 0.85, pr * 0.28); c.lineTo(pr * 0.85, pr * 0.28); c.stroke();
          var ma = state.reducedMotion ? 0.7 : state.time * 2.0;
          c.fillStyle = '#fff5da';
          c.beginPath(); c.arc(Math.cos(ma) * pr * 2.0, Math.sin(ma) * pr * 1.15, 2.1 * sc, 0, TWO_PI); c.fill();
        }
      } else if (nov.celestialId === 'saturn_ring_perturbation') {
        var tilt = -0.18 + 0.64 * p + (p > 0.1 && !state.reducedMotion ? Math.sin(state.time * 2.6) * 0.06 : 0);
        c.save();
        c.rotate(tilt);
        c.strokeStyle = p > 0.05 ? PALETTE.novaGold : 'rgba(223, 208, 176, 0.68)';
        c.lineWidth = (1.8 + 0.8 * p) * sc;
        c.beginPath(); c.ellipse(0, 0, (15 + 5 * p) * sc, (4.8 + 2.4 * p) * sc, 0, 0, TWO_PI); c.stroke();
        c.strokeStyle = p > 0.05 ? 'rgba(114, 209, 198, 0.80)' : 'rgba(200, 155, 67, 0.45)';
        c.lineWidth = 1.1 * sc;
        c.beginPath(); c.ellipse(p * 2.5 * sc, 0, (20 + 7 * p) * sc, (6.5 + 3.2 * p) * sc, 0, 0, TWO_PI); c.stroke();
        c.fillStyle = '#dfc180';
        c.beginPath(); c.arc(0, 0, 5.4 * sc, 0, TWO_PI); c.fill();
        c.restore();
        var sx = (22 - 5 * p) * sc, sy = (-14 + 9 * p) * sc;
        c.fillStyle = p > 0.05 ? '#ffffff' : '#bcd8ff';
        c.beginPath(); c.arc(sx, sy, (2.2 + 2.0 * p) * sc, 0, TWO_PI); c.fill();
        if (p > 0.02) {
          c.strokeStyle = 'rgba(255, 217, 125, ' + (0.76 * p).toFixed(2) + ')';
          c.lineWidth = 1.2 * sc;
          c.beginPath(); c.arc(sx * 0.5, sy * 0.5, 13 * sc, 0.2, 2.7); c.stroke();
        }
      } else {
        c.strokeStyle = p > 0.05 ? 'rgba(255, 217, 125, 0.85)' : 'rgba(155, 185, 230, 0.38)';
        c.lineWidth = (1.1 + 1.2 * p) * sc;
        c.beginPath();
        c.moveTo(-18 * sc, 10 * sc);
        c.quadraticCurveTo(0, (-6 - 18 * p) * sc, 18 * sc, 10 * sc);
        c.stroke();
        if (p > 0.05) {
          c.fillStyle = 'rgba(255, 235, 178, ' + (0.8 * p).toFixed(2) + ')';
          for (var gb = -2; gb <= 2; gb++) {
            c.beginPath(); c.arc(gb * 6.5 * sc, (-3 - 7 * p + Math.abs(gb) * 3.5) * sc, (2.2 + p) * sc, 0, TWO_PI); c.fill();
          }
        }
      }
      c.restore();
    }
  }

  function drawBezelAndReticle(c, geom, state) {
    var cx = geom.cx, cy = geom.cy, r = geom.domeR, outer = geom.bezelOuter;
    var foc = resolveLocus(state.focusedId) || resolveLocus('Cepheids');
    var fp = projectSky(foc.raDeg, foc.poleR, geom);

    if (!geom.ocular) {
      c.save();
      c.strokeStyle = 'rgba(255, 217, 125, 0.52)';
      c.setLineDash([4, 4]);
      c.lineWidth = 1.2;
      c.beginPath();
      c.moveTo(0, cy);
      c.quadraticCurveTo(cx * 0.45, (cy + fp.y) * 0.5 - 18, fp.x, fp.y);
      c.stroke();
      c.restore();

      c.strokeStyle = PALETTE.novaGold;
      c.lineWidth = 1.4;
      c.beginPath(); c.arc(fp.x, fp.y, 13, 0, TWO_PI); c.stroke();
      c.beginPath();
      c.moveTo(fp.x - 19, fp.y); c.lineTo(fp.x - 9, fp.y);
      c.moveTo(fp.x + 9, fp.y); c.lineTo(fp.x + 19, fp.y);
      c.moveTo(fp.x, fp.y - 19); c.lineTo(fp.x, fp.y - 9);
      c.moveTo(fp.x, fp.y + 9); c.lineTo(fp.x, fp.y + 19);
      c.stroke();
    } else {
      var vig = c.createRadialGradient(cx, cy, r * 0.62, cx, cy, r);
      vig.addColorStop(0, 'rgba(6, 11, 23, 0)');
      vig.addColorStop(1, 'rgba(4, 8, 18, 0.78)');
      c.fillStyle = vig;
      c.beginPath(); c.arc(cx, cy, r, 0, TWO_PI); c.fill();
      c.strokeStyle = 'rgba(255, 217, 125, 0.62)';
      c.lineWidth = 1.0;
      c.beginPath();
      c.moveTo(cx - r * 0.86, cy); c.lineTo(cx + r * 0.86, cy);
      c.moveTo(cx, cy - r * 0.86); c.lineTo(cx, cy + r * 0.86);
      c.stroke();
      c.beginPath(); c.arc(cx, cy, 22, 0, TWO_PI); c.stroke();
    }

    c.strokeStyle = PALETTE.bronze;
    c.lineWidth = Math.max(6, outer - r);
    c.beginPath(); c.arc(cx, cy, (outer + r) * 0.5, 0, TWO_PI); c.stroke();
    c.strokeStyle = PALETTE.brass;
    c.lineWidth = 1.8;
    c.beginPath(); c.arc(cx, cy, outer, 0, TWO_PI); c.stroke();
    c.beginPath(); c.arc(cx, cy, r, 0, TWO_PI); c.stroke();

    for (var deg = 0; deg < 360; deg += 10) {
      var a = deg * DEG2RAD - Math.PI * 0.5;
      var rIn = deg % 30 === 0 ? r : r + (outer - r) * 0.42;
      c.strokeStyle = deg % 30 === 0 ? PALETTE.novaGold : PALETTE.brass;
      c.lineWidth = deg % 30 === 0 ? 1.4 : 0.8;
      c.beginPath();
      c.moveTo(cx + Math.cos(a) * rIn, cy + Math.sin(a) * rIn);
      c.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
      c.stroke();
    }

    c.fillStyle = PALETTE.travertine;
    c.font = '600 11px Georgia, serif';
    c.fillText((geom.ocular ? 'OCULAR · ' : 'VAULT · ') + foc.label, 12, 18);
    c.fillStyle = PALETTE.brass;
    c.font = '10px Georgia, serif';
    c.fillText('RA ' + state.raDeg.toFixed(0) + ' deg · DEC +' + state.decDeg.toFixed(0) + ' deg · Novelties ' + state.activeCount + '/4', 12, geom.h - 10);
  }

  function renderArchivalPlate(canvas, kind) {
    if (!canvas || typeof canvas.getContext !== 'function') { return false; }
    if (canvas.width < 220 || canvas.height < 150) {
      canvas.width = 560;
      canvas.height = 350;
    }
    var c = canvas.getContext('2d');
    if (!c) { return false; }
    var w = canvas.width, h = canvas.height;
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);

    if (kind === 'map') {
      var pg = c.createLinearGradient(0, 0, w, h);
      pg.addColorStop(0, PALETTE.travertine);
      pg.addColorStop(1, PALETTE.parchment);
      c.fillStyle = pg;
      c.fillRect(0, 0, w, h);
      c.strokeStyle = PALETTE.inkIron;
      c.lineWidth = 2;
      c.strokeRect(10, 10, w - 20, h - 20);
      c.strokeStyle = PALETTE.bronze;
      c.lineWidth = 1;
      c.strokeRect(15, 15, w - 30, h - 30);

      var lx = w * 0.30, rx = w * 0.70, my = h * 0.52, mr = Math.min(w * 0.19, h * 0.34);
      for (var o = 1; o <= 7; o++) {
        c.strokeStyle = o % 2 === 0 ? PALETTE.terracotta : PALETTE.bronze;
        c.beginPath();
        c.ellipse(lx, my, mr * (o / 7), mr * (o / 7) * 0.78, 0.22, 0, TWO_PI);
        c.stroke();
      }
      c.fillStyle = PALETTE.lapis;
      c.beginPath(); c.arc(rx, my, mr, 0, TWO_PI); c.fill();
      c.strokeStyle = PALETTE.brass;
      c.lineWidth = 2;
      c.beginPath(); c.arc(rx, my, mr + 5, 0, TWO_PI); c.stroke();
      for (var k = 0; k < 4; k++) {
        var ang = k * Math.PI * 0.5 + 0.55;
        var ex = lx + Math.cos(ang) * mr * 0.65, ey = my + Math.sin(ang) * mr * 0.52;
        var sx = rx + Math.cos(ang) * mr * 0.62, sy = my + Math.sin(ang) * mr * 0.62;
        c.fillStyle = PALETTE.novaGold;
        c.beginPath(); c.arc(sx, sy, 3.6, 0, TWO_PI); c.fill();
        c.fillStyle = PALETTE.terracotta;
        c.beginPath(); c.arc(ex, ey, 3.4, 0, TWO_PI); c.fill();
        c.strokeStyle = 'rgba(122, 88, 33, 0.55)';
        c.setLineDash([4, 3]);
        c.beginPath(); c.moveTo(ex, ey); c.quadraticCurveTo(w * 0.5, my - 36 + k * 22, sx, sy); c.stroke();
        c.setLineDash([]);
      }
      c.fillStyle = PALETTE.inkIron;
      c.font = 'bold 13px Georgia, serif';
      c.fillText('TABULA I · ANDRIA PLANIMETRIA & CELESTIAL CONCORDANCE', 26, 34);
    } else {
      var sg = c.createLinearGradient(0, 0, 0, h * 0.72);
      sg.addColorStop(0, PALETTE.lapis);
      sg.addColorStop(1, PALETTE.indigo);
      c.fillStyle = sg;
      c.fillRect(0, 0, w, h);
      c.strokeStyle = 'rgba(255, 217, 125, 0.35)';
      c.lineWidth = 18;
      c.beginPath(); c.moveTo(w * 0.08, h * 0.52); c.quadraticCurveTo(w * 0.48, h * 0.08, w * 0.92, h * 0.44); c.stroke();
      c.fillStyle = PALETTE.novaGold;
      c.beginPath(); c.arc(w * 0.28, h * 0.24, 14, 0, TWO_PI); c.fill();
      c.fillStyle = PALETTE.nebulaCyan;
      c.beginPath(); c.arc(w * 0.68, h * 0.26, 11, 0, TWO_PI); c.fill();

      c.fillStyle = PALETTE.parchment;
      c.fillRect(0, h * 0.68, w, h * 0.32);
      c.fillStyle = PALETTE.travertine;
      c.beginPath(); c.arc(w * 0.52, h * 0.68, h * 0.15, Math.PI, 0); c.fill();
      c.strokeStyle = PALETTE.brass;
      c.lineWidth = 4;
      c.beginPath(); c.moveTo(w * 0.54, h * 0.58); c.lineTo(w * 0.66, h * 0.43); c.stroke();
      c.strokeStyle = PALETTE.bambooJade;
      c.lineWidth = 2.5;
      c.beginPath(); c.arc(w * 0.22, h * 0.70, w * 0.11, Math.PI, 0); c.stroke();
      c.strokeStyle = PALETTE.brass;
      c.lineWidth = 2;
      c.strokeRect(10, 10, w - 20, h - 20);
      c.fillStyle = PALETTE.travertine;
      c.font = 'bold 13px Georgia, serif';
      c.fillText('TABULA II · SPECULA ASTRONOMICA ANDRIAE', 24, 32);
    }
    c.restore();
    return true;
  }

  function createController(opts) {
    var cfg = opts || {};
    var onSkyFocus = typeof cfg.onSkyFocus === 'function' ? cfg.onSkyFocus : null;
    var audio = createSkyAudio();
    var canvas = null, ctx = null, width = 520, height = 460, dpr = 1;
    var initLoc = resolveLocus('star_cluster_nova');

    var state = {
      telescopeMode: 'vault',
      focusedId: initLoc.focusKey,
      focusedEarthId: initLoc.id,
      focusedCelestialId: initLoc.celestialId,
      focusedStar: initLoc.star,
      raDeg: initLoc.raDeg,
      decDeg: initLoc.decDeg,
      siderealPhase: 0.12,
      reducedMotion: false,
      time: 0,
      activeCount: 0,
      activeMap: {},
      progressMap: {
        star_cluster_nova: 0,
        nebula_condensed_planet: 0,
        saturn_ring_perturbation: 0,
        milky_way_expansion: 0
      },
      aimX: 0,
      aimY: 0,
      targetAimX: 0,
      targetAimY: 0
    };

    function refreshAim(snap) {
      var loc = resolveLocus(state.focusedId) || initLoc;
      var u = unitSkyCoords(loc.raDeg, loc.poleR, state.siderealPhase * TWO_PI - Math.PI * 0.5);
      state.targetAimX = u.ux;
      state.targetAimY = u.uy;
      if (snap || state.reducedMotion) {
        state.aimX = u.ux;
        state.aimY = u.uy;
      } else {
        state.aimX += (u.ux - state.aimX) * 0.68;
        state.aimY += (u.uy - state.aimY) * 0.68;
      }
    }
    refreshAim(true);

    function recountActive() {
      var cnt = 0;
      for (var i = 0; i < CELESTIAL_NOVELTIES.length; i++) {
        if (state.activeMap[CELESTIAL_NOVELTIES[i].id]) { cnt++; }
      }
      state.activeCount = cnt;
    }

    var api = {
      attachCanvas: function (el) {
        canvas = el || null;
        ctx = canvas && typeof canvas.getContext === 'function' ? canvas.getContext('2d') : null;
        if (canvas) {
          var cw = canvas.clientWidth || canvas.width || width;
          var ch = canvas.clientHeight || canvas.height || height;
          api.resize(cw, ch, global.devicePixelRatio || 1);
        }
        api.render();
        return api;
      },
      resize: function (w, h, nextDpr) {
        width = Math.max(160, Number(w) || width);
        height = Math.max(160, Number(h) || height);
        dpr = clamp(Number(nextDpr) || 1, 1, 3);
        if (canvas) {
          canvas.width = Math.round(width * dpr);
          canvas.height = Math.round(height * dpr);
        }
        return api;
      },
      step: function (dt) {
        var stepDt = clamp(Number(dt) || 0.016, 0, 0.1);
        if (!state.reducedMotion) {
          state.time += stepDt;
          state.siderealPhase = (state.siderealPhase + stepDt * 0.008) % 1;
        }
        for (var i = 0; i < CELESTIAL_NOVELTIES.length; i++) {
          var nov = CELESTIAL_NOVELTIES[i];
          var target = state.activeMap[nov.id] ? 1 : 0;
          if (state.reducedMotion) {
            state.progressMap[nov.celestialId] = target;
          } else {
            var cur = state.progressMap[nov.celestialId] || 0;
            var next = cur + (target - cur) * Math.min(1, stepDt * 5.8);
            state.progressMap[nov.celestialId] = Math.abs(target - next) < 0.004 ? target : next;
          }
        }
        var loc = resolveLocus(state.focusedId) || initLoc;
        var u = unitSkyCoords(loc.raDeg, loc.poleR, state.siderealPhase * TWO_PI - Math.PI * 0.5);
        state.targetAimX = u.ux;
        state.targetAimY = u.uy;
        if (state.reducedMotion) {
          state.aimX = u.ux;
          state.aimY = u.uy;
        } else {
          var k = Math.min(1, stepDt * 8.5);
          state.aimX += (u.ux - state.aimX) * k;
          state.aimY += (u.uy - state.aimY) * k;
        }
        return api;
      },
      render: function (externalCtx) {
        var c = externalCtx || ctx;
        if (!c) { return api; }
        var rw = width, rh = height, rdpr = dpr;
        if (externalCtx && externalCtx !== ctx && externalCtx.canvas) {
          rw = externalCtx.canvas.width || width;
          rh = externalCtx.canvas.height || height;
          rdpr = 1;
        }
        c.save();
        c.setTransform(rdpr, 0, 0, rdpr, 0, 0);
        drawSkyScene(c, computeGeometry(rw, rh, state), state);
        c.restore();
        return api;
      }
    };
    return attachControlMethods(api, state, audio, onSkyFocus, refreshAim, recountActive, function () { return { w: width, h: height }; });
  }

  function attachControlMethods(api, state, audio, onSkyFocus, refreshAim, recountActive, getDims) {
    function setNoveltyInternal(loc, isAct, playSound) {
      var prev = Boolean(state.activeMap[loc.id]);
      var next = Boolean(isAct);
      state.activeMap[loc.id] = next;
      if (next) {
        state.progressMap[loc.celestialId] = state.reducedMotion ? 1 : Math.max(state.progressMap[loc.celestialId] || 0, 0.74);
        if (!prev) {
          api.focusLocus(loc.celestialId, false);
          if (playSound) { audio.playNoveltyTone(loc.celestialId); }
        }
      } else {
        state.progressMap[loc.celestialId] = 0;
      }
      recountActive();
    }

    api.triggerCelestialNovelty = function (idOrCelestialId, active) {
      var loc = resolveLocus(idOrCelestialId);
      if (!loc) { return { ok: false, active: false }; }
      var nextAct = active === undefined ? true : Boolean(active);
      setNoveltyInternal(loc, nextAct, nextAct);
      api.render();
      return {
        ok: true,
        id: loc.id,
        celestialId: loc.celestialId,
        active: nextAct,
        progress: state.progressMap[loc.celestialId]
      };
    };

    api.syncFromEarth = function (earthState) {
      if (!earthState || typeof earthState !== 'object') { return api.getState(); }
      var root = earthState.state && typeof earthState.state === 'object' ? earthState.state : earthState;
      if (typeof root.reducedMotion === 'boolean') { state.reducedMotion = root.reducedMotion; }
      if (typeof root.siderealPhase === 'number') {
        state.siderealPhase = ((root.siderealPhase % 1) + 1) % 1;
      } else if (typeof root.siderealDeg === 'number') {
        state.siderealPhase = (((root.siderealDeg % 360) + 360) % 360) / 360;
      }
      if (Array.isArray(root.enactedIds)) {
        for (var i = 0; i < CELESTIAL_NOVELTIES.length; i++) {
          var nv = CELESTIAL_NOVELTIES[i];
          var on = root.enactedIds.indexOf(nv.id) !== -1 || root.enactedIds.indexOf(nv.celestialId) !== -1;
          setNoveltyInternal(resolveLocus(nv.celestialId), on, true);
        }
      } else if (Array.isArray(root.innovations)) {
        for (var j = 0; j < root.innovations.length; j++) {
          var it = root.innovations[j];
          var iloc = resolveLocus(it && (it.id || it.celestialId));
          if (iloc) { setNoveltyInternal(iloc, Boolean(it.enacted), true); }
        }
      }
      if (typeof earthState.enacted === 'boolean' && (earthState.id || earthState.celestialId)) {
        var eloc = resolveLocus(earthState.id || earthState.celestialId);
        if (eloc) { setNoveltyInternal(eloc, earthState.enacted, true); }
      }
      var fKey = earthState.focusedId || root.focusedId || root.focusedStar;
      if (fKey) { api.focusLocus(fKey, false); }
      refreshAim(false);
      api.render();
      return api.getState();
    };

    api.setTelescopeMode = function (mode) {
      if (mode === 'toggle') {
        state.telescopeMode = state.telescopeMode === 'ocular' ? 'vault' : 'ocular';
      } else {
        state.telescopeMode = mode === 'ocular' ? 'ocular' : 'vault';
      }
      refreshAim(true);
      api.render();
      return state.telescopeMode;
    };

    api.focusLocus = function (idOrStar, notifyEarth) {
      var loc = resolveLocus(idOrStar);
      if (!loc) { return null; }
      var shouldNotify = notifyEarth === undefined ? true : Boolean(notifyEarth);
      state.focusedId = loc.focusKey;
      state.focusedEarthId = loc.id;
      state.focusedCelestialId = loc.celestialId;
      state.focusedStar = loc.star;
      state.raDeg = loc.raDeg;
      state.decDeg = loc.decDeg;
      refreshAim(state.telescopeMode === 'ocular');
      api.render();
      var payload = {
        bidirectionalCoupling: true,
        kind: loc.kind,
        id: loc.id,
        celestialId: loc.celestialId,
        star: loc.star,
        label: loc.label,
        raDeg: loc.raDeg,
        decDeg: loc.decDeg,
        source: 'sky'
      };
      if (shouldNotify && onSkyFocus) { onSkyFocus(payload); }
      return payload;
    };

    api.hitTest = function (nx, ny, hitOpts) {
      var dims = getDims();
      var xNorm = Number(nx), yNorm = Number(ny);
      if (!isFinite(xNorm) || !isFinite(yNorm)) { return null; }
      if (xNorm > 1.5 || yNorm > 1.5) { xNorm /= dims.w; yNorm /= dims.h; }
      var px = xNorm * dims.w, py = yNorm * dims.h;
      var geom = computeGeometry(dims.w, dims.h, state);
      var maxDist = Math.max(24, geom.domeR * (geom.ocular ? 0.25 : 0.14));
      var best = null, bestDist = maxDist;
      var keys = ['star_cluster_nova', 'nebula_condensed_planet', 'saturn_ring_perturbation', 'milky_way_expansion', 'Cepheids', 'Antares', 'Alpheratz', 'Capella'];
      for (var i = 0; i < keys.length; i++) {
        var loc = resolveLocus(keys[i]);
        var pt = projectSky(loc.raDeg, loc.poleR, geom);
        var d = Math.hypot(px - pt.x, py - pt.y);
        if (d <= bestDist) { bestDist = d; best = loc; }
      }
      if (!best) { return null; }
      if (!hitOpts || hitOpts.focus !== false) { api.focusLocus(best.focusKey, true); }
      return {
        hit: true,
        kind: best.kind,
        id: best.id,
        celestialId: best.celestialId,
        star: best.star,
        label: best.label,
        raDeg: best.raDeg,
        decDeg: best.decDeg
      };
    };

    api.renderArchivalPlate = renderArchivalPlate;
    api.setMuted = function (flag) { return audio.setMuted(flag); };
    api.toggleMute = function () { return audio.toggleMute(); };
    api.isMuted = function () { return audio.isMuted(); };
    api.playPrudenceChord = function (weighed) { audio.playPrudenceChord(weighed); };
    api.playBlockedDissonance = function () { audio.playBlockedDissonance(); };
    api.playNoveltyTone = function (id) { audio.playNoveltyTone(id); };

    api.setSiderealPhase = function (phase) {
      var p = Number(phase) || 0;
      state.siderealPhase = p > 1.5 ? (((p % 360) + 360) % 360) / 360 : ((p % 1) + 1) % 1;
      refreshAim(true);
      api.render();
      return state.siderealPhase;
    };

    api.setReducedMotion = function (flag) {
      state.reducedMotion = Boolean(flag);
      for (var i = 0; i < CELESTIAL_NOVELTIES.length; i++) {
        var nv = CELESTIAL_NOVELTIES[i];
        state.progressMap[nv.celestialId] = state.activeMap[nv.id] ? 1 : 0;
      }
      refreshAim(true);
      api.render();
      return state.reducedMotion;
    };

    api.resetAll = function () {
      for (var i = 0; i < CELESTIAL_NOVELTIES.length; i++) {
        var nv = CELESTIAL_NOVELTIES[i];
        state.activeMap[nv.id] = false;
        state.progressMap[nv.celestialId] = 0;
      }
      recountActive();
      api.render();
      return api.getState();
    };

    api.getState = function () {
      var activeNovelties = [], enactedIds = [], novelties = [];
      for (var i = 0; i < CELESTIAL_NOVELTIES.length; i++) {
        var nv = CELESTIAL_NOVELTIES[i];
        var on = Boolean(state.activeMap[nv.id]);
        if (on) { activeNovelties.push(nv.celestialId); enactedIds.push(nv.id); }
        novelties.push({
          id: nv.id,
          celestialId: nv.celestialId,
          star: nv.star,
          title: nv.title,
          active: on,
          progress: state.progressMap[nv.celestialId] || 0,
          raDeg: nv.raDeg,
          decDeg: nv.decDeg
        });
      }
      return {
        bidirectionalCoupling: true,
        telescopeMode: state.telescopeMode,
        focusedId: state.focusedId,
        focusedEarthId: state.focusedEarthId,
        focusedCelestialId: state.focusedCelestialId,
        focusedStar: state.focusedStar,
        activeNovelties: activeNovelties,
        enactedIds: enactedIds,
        noveltyProgress: Object.assign({}, state.progressMap),
        novelties: novelties,
        luminousStars: ['Antares', 'Alpheratz', 'Capella', 'Cepheids'],
        muted: audio.isMuted(),
        reducedMotion: state.reducedMotion,
        siderealPhase: state.siderealPhase,
        siderealDeg: Math.round(state.siderealPhase * 3600) / 10,
        raDeg: state.raDeg,
        decDeg: state.decDeg
      };
    };

    return api;
  }

  global.AndriaReciprocalSky = {
    CELESTIAL_NOVELTIES: CELESTIAL_NOVELTIES,
    LUMINOUS_STARS: LUMINOUS_STARS,
    CONSTELLATION_CHORDS: CONSTELLATION_CHORDS,
    createController: createController,
    renderArchivalPlate: renderArchivalPlate
  };
})(globalThis);
