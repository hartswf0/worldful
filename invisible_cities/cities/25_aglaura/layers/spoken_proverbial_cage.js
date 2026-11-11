/*
 * Spoken Proverbial Architecture — Layer Module
 * Monumental calligraphic monolith of the spoken city, eight canonical proverbs
 * with historical inversions, deterministic word-imprisonment clamp, and WebAudio.
 */
(function (root) {
  "use strict";

  const PALETTE = Object.freeze({
    ironGallVoid: "#171514",
    gallStone: "#252220",
    colorlessFog: "#7d8082",
    chalkPlaster: "#c8c6be",
    parchmentChalk: "#ebe5d5",
    rubricOxide: "#8f3d2e",
    epiphanyGold: "#d8a648",
    epiphanyFlare: "#f6de92"
  });

  const CATEGORY_LABELS = Object.freeze({
    proverbial_virtue: "Proverbial Virtue",
    proverbial_fault: "Proverbial Fault",
    eccentricity: "Ancient Eccentricity",
    punctilious_rule: "Punctilious Rule"
  });

  const INVERSION_LABELS = Object.freeze({
    virtue_lost_merit: "Virtue Emptied of Merit",
    fault_lost_dishonor: "Fault Emptied of Dishonor",
    bizarre_became_usual: "Bizarre Turned Ordinary",
    normal_became_extravagance: "Plain Act Turned Extravagance"
  });

  const PROVERBIAL_CANON = Object.freeze([
    Object.freeze({
      id: "canon_1",
      index: 0,
      roman: "I",
      title: "Unlocked Granaries & Thrice-Weighed Grain",
      category: "proverbial_virtue",
      inversionKind: "virtue_lost_merit",
      categoryLabel: CATEGORY_LABELS.proverbial_virtue,
      inversionLabel: INVERSION_LABELS.virtue_lost_merit,
      ancientProverb: "In Aglaura no citizen locks a granary door, yet every grain of barley is weighed thrice before sundown.",
      ancientAttribution: "Ancient observers extolled an incorruptible civic honesty where open storehouses stood beside scrupulous triple-balanced scales at dusk.",
      presentInversion: "The timber granaries stand long empty while clerks weigh dry pocket-dust three times before closing—an antique virtue repeated by rote, devoid of merit.",
      keywords: ["grain", "barley", "door", "lock", "weigh", "sundown", "dusk", "dust", "gold", "golden", "shaft", "store"],
      sealCoord: Object.freeze({ nx: 0.16, ny: 0.27 }),
      chantRootHz: 146.83
    }),
    Object.freeze({
      id: "canon_2",
      index: 1,
      roman: "II",
      title: "Proud Magistrates Turned Away",
      category: "proverbial_fault",
      inversionKind: "fault_lost_dishonor",
      categoryLabel: CATEGORY_LABELS.proverbial_fault,
      inversionLabel: INVERSION_LABELS.fault_lost_dishonor,
      ancientProverb: "Beware Aglaura's proud magistrates, who turn their backs upon strangers until the third moon.",
      ancientAttribution: "Early chroniclers denounced the haughty municipal bench whose ceremonial disdain denied every newcomer greeting across three lunations.",
      presentInversion: "Minor registry clerks now stare distractedly sideways at blank plaster while stamping anyone's pass—ancestral pride flattened into torpor devoid of dishonor.",
      keywords: ["magistrate", "proud", "stranger", "moon", "back", "turn", "shadow", "night", "face", "gaze", "eye"],
      sealCoord: Object.freeze({ nx: 0.38, ny: 0.21 }),
      chantRootHz: 164.81
    }),
    Object.freeze({
      id: "canon_3",
      index: 2,
      roman: "III",
      title: "Oiled Paper Lanterns at High Noon",
      category: "eccentricity",
      inversionKind: "bizarre_became_usual",
      categoryLabel: CATEGORY_LABELS.eccentricity,
      inversionLabel: INVERSION_LABELS.bizarre_became_usual,
      ancientProverb: "Only in Aglaura do householders carry oiled paper lanterns at high noon to honour the eclipsed founders.",
      ancientAttribution: "Travelers once marveled at a bizarre solar-zenith procession bearing translucent oiled-paper spheres beneath blinding midday skies.",
      presentInversion: "Unlit stamped-tin lantern frames now hang by the dozen on every coat-hook and hallway peg as ordinary domestic clutter—the bizarre turned wholly usual.",
      keywords: ["lantern", "noon", "light", "sun", "ray", "gleam", "flare", "lamp", "glow", "amber", "paper", "bright"],
      sealCoord: Object.freeze({ nx: 0.62, ny: 0.21 }),
      chantRootHz: 174.61
    }),
    Object.freeze({
      id: "canon_4",
      index: 3,
      roman: "IV",
      title: "Seven Ancestors & Chalked Heels",
      category: "punctilious_rule",
      inversionKind: "normal_became_extravagance",
      categoryLabel: CATEGORY_LABELS.punctilious_rule,
      inversionLabel: INVERSION_LABELS.normal_became_extravagance,
      ancientProverb: "Whoever crosses an Aglauran threshold must first name seven ancestors and wipe chalk from both heels.",
      ancientAttribution: "Punctilious gate-decrees bound every threshold crossing to a liturgical roll of seven forebears and the brushing of street-lime from both boots.",
      presentInversion: "Mumbling seven slurred syllables on a mat is unthinking reflex, while stepping plainly indoors in silence is gawked at as scandalous extravagance.",
      keywords: ["threshold", "chalk", "heel", "step", "stair", "wall", "alley", "street", "opening", "arch", "stone", "cross"],
      sealCoord: Object.freeze({ nx: 0.84, ny: 0.27 }),
      chantRootHz: 196.00
    }),
    Object.freeze({
      id: "canon_5",
      index: 4,
      roman: "V",
      title: "Seven Winters of Silent Linen",
      category: "proverbial_virtue",
      inversionKind: "virtue_lost_merit",
      categoryLabel: CATEGORY_LABELS.proverbial_virtue,
      inversionLabel: INVERSION_LABELS.virtue_lost_merit,
      ancientProverb: "Aglaura's brides weave silent linen for seven winters so no quarrel may echo beneath the rafters.",
      ancientAttribution: "Envoys praised the austere domestic concord of households vowed to patient, wordless shuttle-craft through seven consecutive frosts.",
      presentInversion: "Automated basement looms clatter on timers while households bicker upstairs solely in stock proverbs—praised concord emptied of living merit.",
      keywords: ["weave", "silent", "silence", "linen", "winter", "rafter", "thread", "cloth", "hush", "still", "pale", "quiet"],
      sealCoord: Object.freeze({ nx: 0.18, ny: 0.71 }),
      chantRootHz: 220.00
    }),
    Object.freeze({
      id: "canon_6",
      index: 5,
      roman: "VI",
      title: "Feasting Debtor & Fasting Creditor",
      category: "proverbial_fault",
      inversionKind: "fault_lost_dishonor",
      categoryLabel: CATEGORY_LABELS.proverbial_fault,
      inversionLabel: INVERSION_LABELS.fault_lost_dishonor,
      ancientProverb: "An Aglauran debtor feasts on salted quails while his creditor fasts upon the porch.",
      ancientAttribution: "Moralists denounced a scandalous inversion of obligation that banqueted insolvents indoors while starving lenders on cold porch flagstones.",
      presentInversion: "Debtors and creditors sit side by side trading identical dry salt-biscuits over grey ledgers without shame—the notorious fault stripped of dishonor.",
      keywords: ["debtor", "creditor", "feast", "fast", "porch", "quail", "salt", "court", "terrace", "table", "bread"],
      sealCoord: Object.freeze({ nx: 0.39, ny: 0.77 }),
      chantRootHz: 246.94
    }),
    Object.freeze({
      id: "canon_7",
      index: 6,
      roman: "VII",
      title: "Tethered Storks of Roof Law",
      category: "eccentricity",
      inversionKind: "bizarre_became_usual",
      categoryLabel: CATEGORY_LABELS.eccentricity,
      inversionLabel: INVERSION_LABELS.bizarre_became_usual,
      ancientProverb: "Along Aglaura's roofs, tethered storks arbitrate boundary disputes by the fall of a single feather.",
      ancientAttribution: "Foreign legates recorded with wonder the eccentric rooftop augury whereby a drifting white plume adjudicated contested eaves and yards.",
      presentInversion: "Rusted tin stork weathervanes creak routinely above corrugated sheds and laundry lines—the once-bizarre oracle dulled into unremarkable habit.",
      keywords: ["roof", "stork", "feather", "sky", "spire", "dome", "wind", "air", "cloud", "vista", "horizon", "wing"],
      sealCoord: Object.freeze({ nx: 0.61, ny: 0.77 }),
      chantRootHz: 261.63
    }),
    Object.freeze({
      id: "canon_8",
      index: 7,
      roman: "VIII",
      title: "Even Bell-Strokes & Tallied Words",
      category: "punctilious_rule",
      inversionKind: "normal_became_extravagance",
      categoryLabel: CATEGORY_LABELS.punctilious_rule,
      inversionLabel: INVERSION_LABELS.normal_became_extravagance,
      ancientProverb: "No bell in Aglaura may ring an odd number of strokes, lest an uncounted word escape the walls.",
      ancientAttribution: "Belfry rubrics commanded strictly paired bronze chimes so every syllable uttered inside the ramparts stayed numbered and enclosed.",
      presentInversion: "Paired shop-buzzers click out of dull habit, whereas any spontaneous uncounted exclamation in an alley is condemned as reckless extravagance.",
      keywords: ["bell", "ring", "odd", "stroke", "word", "voice", "speak", "say", "name", "echo", "tower", "sound"],
      sealCoord: Object.freeze({ nx: 0.82, ny: 0.71 }),
      chantRootHz: 293.66
    })
  ]);

  function hashPhrase(str) {
    let h = 2166136261 >>> 0;
    const s = String(str || "");
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function tokenizeAttempt(text) {
    const cleaned = String(text || "").trim();
    const matches = cleaned.match(/[A-Za-z0-9'\u00C0-\u024F]+/g);
    if (matches && matches.length > 0) {
      return matches.slice(0, 32);
    }
    return [cleaned.slice(0, 24) || "gleam"];
  }

  function extractCanonLexicon(proverb) {
    const raw = String(proverb || "").match(/[A-Za-z']+/g) || ["Aglaura"];
    const filtered = raw.filter(function (w) {
      return w.length >= 4;
    });
    return filtered.length > 0 ? filtered : raw;
  }

  function matchCanonForUtterance(effectiveText, context) {
    const tokens = tokenizeAttempt(effectiveText).map(function (t) {
      return t.toLowerCase();
    });
    const hashSeed = hashPhrase(
      effectiveText.toLowerCase() + "|" + String((context && context.apertureId) || "")
    );
    let bestIdx = hashSeed % PROVERBIAL_CANON.length;
    let bestScore = 0;

    for (let i = 0; i < PROVERBIAL_CANON.length; i++) {
      const entry = PROVERBIAL_CANON[i];
      let score = 0;
      for (let t = 0; t < tokens.length; t++) {
        const tok = tokens[t];
        for (let k = 0; k < entry.keywords.length; k++) {
          const kw = entry.keywords[k];
          if (tok === kw || (tok.length >= 4 && (tok.indexOf(kw) === 0 || kw.indexOf(tok) === 0))) {
            score += tok === kw ? 3 : 2;
          }
        }
      }
      if (score > bestScore || (score > 0 && score === bestScore && ((hashSeed + i) % 2 === 0))) {
        bestScore = score;
        bestIdx = i;
      }
    }
    return PROVERBIAL_CANON[bestIdx];
  }

  function resolveCanonLookup(idOrIndex) {
    if (typeof idOrIndex === "number" && Number.isFinite(idOrIndex)) {
      const n = Math.trunc(idOrIndex);
      if (n >= 0 && n < PROVERBIAL_CANON.length) return PROVERBIAL_CANON[n];
      if (n === 8) return PROVERBIAL_CANON[7];
      return PROVERBIAL_CANON[((n % 8) + 8) % 8];
    }
    if (typeof idOrIndex === "string") {
      const s = idOrIndex.trim();
      const byId = PROVERBIAL_CANON.find(function (c) {
        return c.id.toLowerCase() === s.toLowerCase() || c.roman.toLowerCase() === s.toLowerCase();
      });
      if (byId) return byId;
      if (/^[1-8]$/.test(s)) return PROVERBIAL_CANON[ parseInt(s, 10) - 1 ];
      if (s === "0") return PROVERBIAL_CANON[0];
    }
    return PROVERBIAL_CANON[0];
  }

  function wrapCanvasLines(ctx, text, maxWidth) {
    const words = String(text || "").split(/\s+/).filter(Boolean);
    const lines = [];
    let current = "";
    for (let i = 0; i < words.length; i++) {
      const candidate = current ? current + " " + words[i] : words[i];
      if (ctx.measureText(candidate).width <= maxWidth || !current) {
        current = candidate;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    if (current) lines.push(current);
    return lines;
  }

  function createSpokenCageAudio() {
    let audioCtx = null;
    let noiseBuf = null;
    let muted = false;

    function ensureCtx() {
      if (muted) return null;
      try {
        const Ctor = root.AudioContext || root.webkitAudioContext;
        if (!Ctor) return null;
        if (!audioCtx) audioCtx = new Ctor();
        if (audioCtx.state === "suspended" && typeof audioCtx.resume === "function") {
          audioCtx.resume().catch(function () {});
        }
        if (!noiseBuf && audioCtx) {
          const len = Math.max(1024, Math.floor(audioCtx.sampleRate * 0.16));
          noiseBuf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
          const data = noiseBuf.getChannelData(0);
          for (let i = 0; i < len; i++) {
            data[i] = ((Math.sin(i * 12.9898) * 43758.5453) % 1) * 2 - 1;
          }
        }
        return audioCtx;
      } catch (_) {
        return null;
      }
    }

    function playChoralSnap(canonIndex) {
      const entry = resolveCanonLookup(typeof canonIndex === "number" ? canonIndex : 0);
      const rootHz = entry.chantRootHz || 164.81;
      const ctx = ensureCtx();
      if (!ctx) return { played: false, rootHz: rootHz };
      try {
        const now = ctx.currentTime;
        const master = ctx.createGain();
        master.gain.setValueAtTime(0.0001, now);
        master.gain.exponentialRampToValueAtTime(0.16, now + 0.05);
        master.gain.exponentialRampToValueAtTime(0.09, now + 0.36);
        master.gain.exponentialRampToValueAtTime(0.0001, now + 0.92);
        master.connect(ctx.destination);

        const f1 = ctx.createBiquadFilter();
        f1.type = "bandpass";
        f1.frequency.setValueAtTime(530, now);
        f1.Q.setValueAtTime(4.2, now);
        f1.connect(master);

        const f2 = ctx.createBiquadFilter();
        f2.type = "bandpass";
        f2.frequency.setValueAtTime(1090, now);
        f2.Q.setValueAtTime(5.0, now);
        f2.connect(master);

        const ratios = [0.5, 1.0, 1.004, 1.498];
        for (let i = 0; i < ratios.length; i++) {
          const osc = ctx.createOscillator();
          osc.type = i === 0 ? "triangle" : "sawtooth";
          osc.frequency.setValueAtTime(rootHz * ratios[i], now);
          osc.connect(f1);
          osc.connect(f2);
          osc.start(now);
          osc.stop(now + 0.95);
        }

        const latchOsc = ctx.createOscillator();
        const latchGain = ctx.createGain();
        latchOsc.type = "square";
        latchOsc.frequency.setValueAtTime(920, now + 0.01);
        latchOsc.frequency.exponentialRampToValueAtTime(280, now + 0.065);
        latchGain.gain.setValueAtTime(0.07, now + 0.01);
        latchGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
        latchOsc.connect(latchGain);
        latchGain.connect(ctx.destination);
        latchOsc.start(now + 0.01);
        latchOsc.stop(now + 0.075);

        const thudOsc = ctx.createOscillator();
        const thudGain = ctx.createGain();
        thudOsc.type = "sine";
        thudOsc.frequency.setValueAtTime(132, now + 0.055);
        thudOsc.frequency.exponentialRampToValueAtTime(44, now + 0.21);
        thudGain.gain.setValueAtTime(0.14, now + 0.055);
        thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        thudOsc.connect(thudGain);
        thudGain.connect(ctx.destination);
        thudOsc.start(now + 0.055);
        thudOsc.stop(now + 0.23);
        return { played: true, rootHz: rootHz };
      } catch (_) {
        return { played: false, rootHz: rootHz };
      }
    }

    function playIronGallSeal() {
      const ctx = ensureCtx();
      if (!ctx) return { played: false };
      try {
        const now = ctx.currentTime;
        if (noiseBuf) {
          const quill = ctx.createBufferSource();
          quill.buffer = noiseBuf;
          const bp = ctx.createBiquadFilter();
          bp.type = "bandpass";
          bp.frequency.setValueAtTime(2250, now);
          bp.Q.setValueAtTime(3.2, now);
          const qGain = ctx.createGain();
          qGain.gain.setValueAtTime(0.06, now);
          qGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
          quill.connect(bp);
          bp.connect(qGain);
          qGain.connect(ctx.destination);
          quill.start(now);
          quill.stop(now + 0.06);

          const vellum = ctx.createBufferSource();
          vellum.buffer = noiseBuf;
          const vFilter = ctx.createBiquadFilter();
          vFilter.type = "bandpass";
          vFilter.frequency.setValueAtTime(690, now + 0.02);
          vFilter.Q.setValueAtTime(1.8, now + 0.02);
          const vGain = ctx.createGain();
          vGain.gain.setValueAtTime(0.045, now + 0.02);
          vGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
          vellum.connect(vFilter);
          vFilter.connect(vGain);
          vGain.connect(ctx.destination);
          vellum.start(now + 0.02);
          vellum.stop(now + 0.12);
        }
        return { played: true };
      } catch (_) {
        return { played: false };
      }
    }

    function playTwilightGlimpseShimmer(intensity) {
      const ctx = ensureCtx();
      if (!ctx) return { played: false };
      try {
        const now = ctx.currentTime;
        const amp = Math.max(0.08, Math.min(1.0, Number(intensity) || 0.7)) * 0.055;
        const freqs = [880.0, 1318.51, 1760.0];
        for (let i = 0; i < freqs.length; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freqs[i], now + i * 0.035);
          gain.gain.setValueAtTime(0.0001, now + i * 0.035);
          gain.gain.exponentialRampToValueAtTime(amp / (i + 1), now + 0.11 + i * 0.035);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85 + i * 0.05);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.035);
          osc.stop(now + 0.92 + i * 0.05);
        }
        return { played: true };
      } catch (_) {
        return { played: false };
      }
    }

    return {
      unlock: function () {
        return Boolean(ensureCtx());
      },
      setMuted: function (flag) {
        muted = Boolean(flag);
        return muted;
      },
      toggleMute: function () {
        muted = !muted;
        if (!muted) ensureCtx();
        return muted;
      },
      isMuted: function () {
        return muted;
      },
      playChoralSnap: playChoralSnap,
      playIronGallSeal: playIronGallSeal,
      playTwilightGlimpseShimmer: playTwilightGlimpseShimmer
    };
  }

  function drawMonolithBackdrop(ctx, w, h, state) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, PALETTE.ironGallVoid);
    grad.addColorStop(0.52, PALETTE.gallStone);
    grad.addColorStop(1, PALETTE.ironGallVoid);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const pad = Math.max(8, Math.round(Math.min(w, h) * 0.026));
    ctx.strokeStyle = PALETTE.chalkPlaster;
    ctx.globalAlpha = 0.28;
    ctx.lineWidth = 1;
    ctx.strokeRect(pad, pad, w - pad * 2, h - pad * 2);
    ctx.strokeStyle = PALETTE.rubricOxide;
    ctx.globalAlpha = 0.55;
    ctx.strokeRect(pad + 4, pad + 4, w - (pad + 4) * 2, h - (pad + 4) * 2);
    ctx.globalAlpha = 1;

    const cx = w * 0.5;
    const cy = h * 0.49;
    const minDim = Math.min(w, h);
    const voices = state.repetitionChorusVoices;
    for (let r = 0; r < 3; r++) {
      const radius = minDim * (0.29 + r * 0.075);
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = r === 1 ? PALETTE.rubricOxide : PALETTE.colorlessFog;
      ctx.globalAlpha = 0.16 + state.clampAnim * 0.14;
      ctx.lineWidth = r === 1 ? 1.4 : 0.9;
      ctx.stroke();
    }
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(state.scrollPhase * 0.18);
    ctx.strokeStyle = PALETTE.parchmentChalk;
    ctx.globalAlpha = 0.13 + Math.min(0.14, state.imprisonedCount * 0.015);
    ctx.lineWidth = 1;
    for (let v = 0; v < voices; v++) {
      const ang = (v / voices) * Math.PI * 2;
      const r0 = minDim * 0.25;
      const r1 = minDim * 0.44;
      ctx.beginPath();
      ctx.moveTo(Math.cos(ang) * r0, Math.sin(ang) * r0);
      ctx.lineTo(Math.cos(ang) * r1, Math.sin(ang) * r1);
      ctx.stroke();
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawProverbialMonolith(ctx, w, h, state) {
    const mLeft = w * 0.10;
    const mWidth = w * 0.80;
    const courses = 8;
    const topY = h * 0.10;
    const totalH = h * 0.80;
    const courseH = totalH / courses;

    const towers = [0.16, 0.31, 0.50, 0.69, 0.84];
    for (let t = 0; t < towers.length; t++) {
      const tx = w * towers[t];
      const tw = w * (t === 2 ? 0.15 : 0.09);
      const th = h * (t === 2 ? 0.09 : 0.06);
      ctx.fillStyle = PALETTE.gallStone;
      ctx.strokeStyle = PALETTE.chalkPlaster;
      ctx.lineWidth = 1;
      ctx.fillRect(tx - tw * 0.5, topY - th * 0.45, tw, th);
      ctx.globalAlpha = 0.35;
      ctx.strokeRect(tx - tw * 0.5, topY - th * 0.45, tw, th);
      ctx.beginPath();
      ctx.arc(tx, topY - th * 0.45, tw * 0.36, Math.PI, 0);
      ctx.fillStyle = PALETTE.ironGallVoid;
      ctx.globalAlpha = 0.92;
      ctx.fill();
      ctx.strokeStyle = PALETTE.rubricOxide;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    ctx.save();
    ctx.beginPath();
    ctx.rect(mLeft, topY, mWidth, totalH);
    ctx.clip();

    const fontPx = Math.max(9, Math.round(Math.min(w, h) * 0.024));
    ctx.font = "600 " + fontPx + "px Georgia, 'Times New Roman', serif";
    ctx.textBaseline = "middle";

    for (let c = 0; c < courses; c++) {
      const cy = topY + c * courseH;
      const inset = (c === 0 || c === courses - 1) ? w * 0.03 : 0;
      const rowX = mLeft + inset;
      const rowW = mWidth - inset * 2;
      const isSelectedCourse = PROVERBIAL_CANON[c].id === state.selectedCanonId;

      ctx.fillStyle = isSelectedCourse ? "#302823" : (c % 2 === 0 ? PALETTE.gallStone : "#1e1b19");
      ctx.fillRect(rowX, cy + 1, rowW, courseH - 2);
      ctx.strokeStyle = isSelectedCourse ? PALETTE.epiphanyGold : PALETTE.chalkPlaster;
      ctx.globalAlpha = isSelectedCourse ? 0.65 : 0.24;
      ctx.lineWidth = isSelectedCourse ? 1.4 : 0.9;
      ctx.strokeRect(rowX, cy + 1, rowW, courseH - 2);

      const archCount = c % 2 === 0 ? 5 : 4;
      const archW = rowW / archCount;
      for (let a = 0; a < archCount; a++) {
        const ax = rowX + a * archW + archW * 0.5;
        ctx.beginPath();
        ctx.arc(ax, cy + courseH - 2, Math.min(archW * 0.34, courseH * 0.44), Math.PI, 0);
        ctx.fillStyle = PALETTE.ironGallVoid;
        ctx.globalAlpha = 0.68;
        ctx.fill();
        ctx.strokeStyle = PALETTE.rubricOxide;
        ctx.globalAlpha = 0.34;
        ctx.stroke();
      }

      const chantStrip = PROVERBIAL_CANON[c].roman + " · " + PROVERBIAL_CANON[c].ancientProverb + "   ";
      const dir = c % 2 === 0 ? -1 : 1;
      const shift = ((state.scrollPhase * 28 * dir + c * 47) % 260);
      ctx.fillStyle = isSelectedCourse ? PALETTE.parchmentChalk : PALETTE.chalkPlaster;
      ctx.globalAlpha = isSelectedCourse ? 0.88 : 0.42;
      ctx.fillText(chantStrip + chantStrip, rowX - 130 + shift, cy + courseH * 0.34);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }

  function drawCentralScrollAndPortcullis(ctx, w, h, selectedCanon, state) {
    const sx = w * 0.15;
    const sy = h * 0.37;
    const sw = w * 0.70;
    const sh = h * 0.24;
    const cx = w * 0.5;
    const cy = sy + sh * 0.5;

    for (let i = 0; i < PROVERBIAL_CANON.length; i++) {
      const c = PROVERBIAL_CANON[i];
      const active = c.id === selectedCanon.id;
      ctx.beginPath();
      ctx.moveTo(c.sealCoord.nx * w, c.sealCoord.ny * h);
      ctx.lineTo(cx + (c.sealCoord.nx - 0.5) * sw * 0.55, cy + (c.sealCoord.ny < 0.5 ? -sh * 0.48 : sh * 0.48));
      ctx.strokeStyle = active ? PALETTE.epiphanyGold : PALETTE.rubricOxide;
      ctx.globalAlpha = active ? 0.85 : 0.32;
      ctx.lineWidth = active ? 1.8 : 1.0;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = PALETTE.parchmentChalk;
    ctx.fillRect(sx, sy, sw, sh);
    ctx.fillStyle = PALETTE.chalkPlaster;
    ctx.fillRect(sx - 6, sy - 4, 8, sh + 8);
    ctx.fillRect(sx + sw - 2, sy - 4, 8, sh + 8);
    ctx.strokeStyle = PALETTE.rubricOxide;
    ctx.lineWidth = 2;
    ctx.strokeRect(sx, sy, sw, sh);
    ctx.strokeStyle = PALETTE.ironGallVoid;
    ctx.lineWidth = 1;
    ctx.strokeRect(sx + 4, sy + 4, sw - 8, sh - 8);

    const headPx = Math.max(9, Math.round(Math.min(w, h) * 0.024));
    ctx.font = "700 " + headPx + "px Georgia, 'Times New Roman', serif";
    ctx.fillStyle = PALETTE.rubricOxide;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const rubricHeader = "CANON " + selectedCanon.roman + " · " + selectedCanon.categoryLabel.toUpperCase() +
      " · SOLIDITY " + Math.round(state.spokenSolidity * 100) + "%";
    ctx.fillText(rubricHeader, cx, sy + 8);

    const bodyPx = Math.max(10, Math.round(Math.min(w, h) * 0.029));
    ctx.font = "italic " + bodyPx + "px Georgia, 'Times New Roman', serif";
    ctx.fillStyle = PALETTE.ironGallVoid;
    const lines = wrapCanvasLines(ctx, "\u201C" + selectedCanon.ancientProverb + "\u201D", sw - 28).slice(0, 3);
    const lineH = bodyPx * 1.28;
    const startY = sy + sh * 0.50 - ((lines.length - 1) * lineH) * 0.5;
    for (let l = 0; l < lines.length; l++) {
      ctx.fillText(lines[l], cx, startY + l * lineH - bodyPx * 0.35);
    }

    ctx.font = "600 " + Math.max(8, headPx - 1) + "px Georgia, serif";
    ctx.fillStyle = PALETTE.gallStone;
    ctx.globalAlpha = 0.78;
    ctx.fillText(selectedCanon.inversionLabel.toUpperCase() + " · CHORUS " + state.repetitionChorusVoices + " VOICES", cx, sy + sh - headPx - 7);
    ctx.globalAlpha = 1;

    if (state.clampAnim > 0.01) {
      const slam = Math.min(1, state.clampAnim * 1.35);
      const dropH = sh * slam;
      const barCount = 9;
      ctx.save();
      ctx.fillStyle = PALETTE.ironGallVoid;
      ctx.strokeStyle = PALETTE.rubricOxide;
      ctx.globalAlpha = 0.84 * Math.min(1, state.clampAnim + 0.25);
      for (let b = 0; b < barCount; b++) {
        const bx = sx + 14 + (b / (barCount - 1)) * (sw - 28);
        ctx.fillRect(bx - 2, sy, 4, dropH);
      }
      ctx.fillStyle = PALETTE.rubricOxide;
      ctx.fillRect(sx + 6, sy + dropH * 0.45, sw - 12, 3.5);
      ctx.fillRect(sx + 6, sy + Math.max(4, dropH - 6), sw - 12, 4);
      if (state.lastImprisonment && state.lastImprisonment.wordTokensMapped.length > 0) {
        const sample = state.lastImprisonment.wordTokensMapped.slice(0, 4).map(function (m) {
          return m.freeWord + " \u2192 " + m.clampedTo;
        }).join("  |  ");
        ctx.fillStyle = PALETTE.ironGallVoid;
        ctx.fillRect(sx + 16, cy - 11, sw - 32, 22);
        ctx.strokeStyle = PALETTE.epiphanyGold;
        ctx.strokeRect(sx + 16, cy - 11, sw - 32, 22);
        ctx.fillStyle = PALETTE.epiphanyFlare;
        ctx.font = "700 " + Math.max(9, headPx) + "px Georgia, serif";
        ctx.fillText(sample, cx, cy - headPx * 0.48);
      }
      ctx.restore();
    }
  }

  function drawRubricWaxSeals(ctx, w, h, state, viewOpts) {
    const baseR = Math.max(13, Math.min(w, h) * 0.052);
    const hoveredId = viewOpts && viewOpts.hoveredCanonId;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < PROVERBIAL_CANON.length; i++) {
      const c = PROVERBIAL_CANON[i];
      const x = c.sealCoord.nx * w;
      const y = c.sealCoord.ny * h;
      const isSel = c.id === state.selectedCanonId;
      const isHov = c.id === hoveredId;
      const r = baseR * (isSel ? 1.14 : (isHov ? 1.07 : 1.0));

      if (isSel) {
        ctx.beginPath();
        ctx.arc(x, y, r + 5 + state.clampAnim * 4, 0, Math.PI * 2);
        ctx.fillStyle = PALETTE.epiphanyGold;
        ctx.globalAlpha = 0.24 + state.clampAnim * 0.25;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      ctx.beginPath();
      const lobes = 12;
      for (let k = 0; k <= lobes; k++) {
        const a = (k / lobes) * Math.PI * 2;
        const rr = r * (k % 2 === 0 ? 1.04 : 0.92);
        const px = x + Math.cos(a) * rr;
        const py = y + Math.sin(a) * rr;
        if (k === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = isSel ? PALETTE.rubricOxide : "#6d2d22";
      ctx.fill();
      ctx.lineWidth = isSel ? 2.0 : 1.2;
      ctx.strokeStyle = isSel ? PALETTE.epiphanyFlare : PALETTE.chalkPlaster;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, r * 0.72, 0, Math.PI * 2);
      ctx.strokeStyle = isSel ? PALETTE.epiphanyGold : PALETTE.parchmentChalk;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = isSel ? PALETTE.epiphanyFlare : PALETTE.parchmentChalk;
      ctx.font = "700 " + Math.max(10, Math.round(r * 0.68)) + "px Georgia, 'Times New Roman', serif";
      ctx.fillText(c.roman, x, y + 0.5);
    }
  }

  function createCageEngine(opts) {
    const config = opts || {};
    const audio = createSpokenCageAudio();

    let spokenSolidity = 0.92;
    let haphazardOpinionSubstance = 0.19;
    let truthOnGround = 0.0;
    let nothingSaidIsTrueYetCompact = true;
    let selectedCanonId = "canon_1";
    let imprisonedCount = 0;
    let repetitionChorusVoices = 12;
    let clampAnim = 0;
    let lastImprisonment = null;
    let utteranceLedger = [];
    let scrollPhase = 0;
    let reducedMotion = Boolean(config.reducedMotion);

    function getSelectedCanon() {
      return resolveCanonLookup(selectedCanonId);
    }

    function getState() {
      return {
        spokenSolidity: spokenSolidity,
        haphazardOpinionSubstance: haphazardOpinionSubstance,
        truthOnGround: truthOnGround,
        nothingSaidIsTrueYetCompact: nothingSaidIsTrueYetCompact,
        selectedCanonId: selectedCanonId,
        selectedCanon: getSelectedCanon(),
        canonCount: 8,
        canon: PROVERBIAL_CANON,
        imprisonedCount: imprisonedCount,
        repetitionChorusVoices: repetitionChorusVoices,
        lastImprisonment: lastImprisonment,
        utteranceLedger: utteranceLedger.slice(),
        clampAnim: clampAnim,
        muted: audio.isMuted(),
        reducedMotion: reducedMotion
      };
    }

    function imprisonUtterance(rawText, context) {
      const ctxInfo = context || {};
      const trimmed = typeof rawText === "string" ? rawText.trim() : "";
      const fallbackSeed = String(ctxInfo.unwordableDraftSeed || "a rare gleam opening between colorless walls");
      const effectiveText = trimmed.length > 0 ? trimmed : fallbackSeed;

      const matchedCanon = matchCanonForUtterance(effectiveText, ctxInfo);
      const freeTokens = tokenizeAttempt(effectiveText);
      const canonWords = extractCanonLexicon(matchedCanon.ancientProverb);
      const wordTokensMapped = freeTokens.map(function (freeWord, idx) {
        return {
          freeWord: freeWord,
          clampedTo: canonWords[idx % canonWords.length]
        };
      });

      imprisonedCount += 1;
      spokenSolidity = Math.min(0.99, +(0.92 + imprisonedCount * 0.012).toFixed(3));
      repetitionChorusVoices += 2;
      selectedCanonId = matchedCanon.id;
      clampAnim = 1.0;

      const record = {
        id: "imprisonment_" + imprisonedCount,
        order: imprisonedCount,
        attemptedText: effectiveText,
        wasSeededFromSilence: trimmed.length === 0,
        apertureId: ctxInfo.apertureId || null,
        canonId: matchedCanon.id,
        canonIndex: matchedCanon.index,
        canonRoman: matchedCanon.roman,
        canonTitle: matchedCanon.title,
        category: matchedCanon.category,
        inversionKind: matchedCanon.inversionKind,
        canonicalOutput: matchedCanon.ancientProverb,
        ancientProverb: matchedCanon.ancientProverb,
        ancientAttribution: matchedCanon.ancientAttribution,
        presentInversion: matchedCanon.presentInversion,
        wordTokensMapped: wordTokensMapped,
        freeWordsSurvived: 0,
        obligedToRepeat: true,
        isVerbatimProverb: true,
        spokenSolidityAfter: spokenSolidity,
        repetitionChorusVoicesAfter: repetitionChorusVoices
      };

      lastImprisonment = record;
      utteranceLedger = [record].concat(utteranceLedger).slice(0, 24);
      audio.playChoralSnap(matchedCanon.index);

      if (typeof config.onWordsImprisoned === "function") {
        config.onWordsImprisoned(record, getState());
      }
      return record;
    }

    function selectCanon(idOrIndex) {
      const entry = resolveCanonLookup(idOrIndex);
      selectedCanonId = entry.id;
      audio.playIronGallSeal();
      if (typeof config.onCanonSelected === "function") {
        config.onCanonSelected(entry, getState());
      }
      return entry;
    }

    function tick(dtSec) {
      const dt = Math.max(0, Math.min(0.25, Number(dtSec) || 0));
      if (reducedMotion) {
        clampAnim = Math.max(0, +(clampAnim - dt * 2.2).toFixed(4));
      } else {
        scrollPhase = (scrollPhase + dt * 0.36) % 1000;
        clampAnim = Math.max(0, +(clampAnim - dt * 0.68).toFixed(4));
      }
      return { scrollPhase: scrollPhase, clampAnim: clampAnim };
    }

    function renderLattice(ctx, width, height, viewOpts) {
      if (!ctx || !(width > 0) || !(height > 0)) return;
      const vOpts = viewOpts || {};
      const renderState = {
        spokenSolidity: spokenSolidity,
        selectedCanonId: selectedCanonId,
        imprisonedCount: imprisonedCount,
        repetitionChorusVoices: repetitionChorusVoices,
        clampAnim: clampAnim,
        lastImprisonment: lastImprisonment,
        scrollPhase: reducedMotion || vOpts.reducedMotion ? 0 : scrollPhase
      };
      ctx.save();
      drawMonolithBackdrop(ctx, width, height, renderState);
      drawProverbialMonolith(ctx, width, height, renderState);
      drawCentralScrollAndPortcullis(ctx, width, height, getSelectedCanon(), renderState);
      drawRubricWaxSeals(ctx, width, height, renderState, vOpts);
      ctx.restore();
    }

    function hitTest(normX, normY) {
      const nx = Number(normX);
      const ny = Number(normY);
      if (Number.isFinite(nx) && Number.isFinite(ny)) {
        let nearest = null;
        let bestDist = 0.085;
        for (let i = 0; i < PROVERBIAL_CANON.length; i++) {
          const c = PROVERBIAL_CANON[i];
          const d = Math.hypot(nx - c.sealCoord.nx, ny - c.sealCoord.ny);
          if (d <= bestDist) {
            bestDist = d;
            nearest = c;
          }
        }
        if (nearest) {
          return {
            kind: "canon_seal",
            canonId: nearest.id,
            index: nearest.index,
            roman: nearest.roman,
            title: nearest.title,
            category: nearest.category,
            inversionKind: nearest.inversionKind,
            ancientProverb: nearest.ancientProverb,
            ancientAttribution: nearest.ancientAttribution,
            presentInversion: nearest.presentInversion
          };
        }
      }
      return { kind: "spoken_monolith" };
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      return reducedMotion;
    }

    function reset() {
      spokenSolidity = 0.92;
      haphazardOpinionSubstance = 0.19;
      truthOnGround = 0.0;
      nothingSaidIsTrueYetCompact = true;
      selectedCanonId = "canon_1";
      imprisonedCount = 0;
      repetitionChorusVoices = 12;
      clampAnim = 0;
      lastImprisonment = null;
      utteranceLedger = [];
      scrollPhase = 0;
      return getState();
    }

    return {
      imprisonUtterance: imprisonUtterance,
      selectCanon: selectCanon,
      tick: tick,
      renderLattice: renderLattice,
      hitTest: hitTest,
      audio: audio,
      setReducedMotion: setReducedMotion,
      reset: reset,
      getState: getState
    };
  }

  const AglauraSpokenCage = Object.freeze({
    PALETTE: PALETTE,
    CATEGORY_LABELS: CATEGORY_LABELS,
    INVERSION_LABELS: INVERSION_LABELS,
    PROVERBIAL_CANON: PROVERBIAL_CANON,
    createCageEngine: createCageEngine
  });

  root.AglauraSpokenCage = AglauraSpokenCage;
  if (typeof window !== "undefined") {
    window.AglauraSpokenCage = AglauraSpokenCage;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = AglauraSpokenCage;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
