(function (global) {
  "use strict";

  const PALETTE = Object.freeze({
    graniteVoid: "#141619",
    ashlarDark: "#23272d",
    ironMuseum: "#2d353c",
    museumBrass: "#b59a6a",
    brassHighlight: "#dec596",
    brassShadow: "#6b5735",
    cobaltAbyss: "#0a1f3d",
    cobaltDeep: "#061326",
    sapphireModel: "#1d63b8",
    azureRefraction: "#4da6ff",
    medusaCyan: "#8ee8ff",
    crystalSpecular: "#e6f6ff"
  });

  const CANONICAL_GLOBES = Object.freeze([
    Object.freeze({
      id: "globe_medusa_canal",
      roomNumber: 1,
      romanRoom: "Room I",
      title: "Medusa Canal Pond",
      obsoletedByParcel: "basin_culvert",
      obsoletedStructure: "Granite Freight Culvert",
      epochConceived: 0,
      epochSealed: 1,
      status: "possible_no_longer",
      isToyInGlassGlobe: true,
      hasViewerReflection: true,
      calvinoDetail:
        "Imagining his reflection in the medusa pond that would have collected the waters of the canal (if it had not been dried up)..."
    }),
    Object.freeze({
      id: "globe_elephant_avenue",
      roomNumber: 2,
      romanRoom: "Room II",
      title: "High-Canopied Elephant Avenue",
      obsoletedByParcel: "avenue_viaduct",
      obsoletedStructure: "Low Iron-Girder Viaducts",
      epochConceived: 1,
      epochSealed: 2,
      status: "possible_no_longer",
      isToyInGlassGlobe: true,
      hasCanopySightline: true,
      calvinoDetail:
        "The view from the high canopied box along the avenue reserved for elephants (now banished from the city)..."
    }),
    Object.freeze({
      id: "globe_spiral_minaret",
      roomNumber: 3,
      romanRoom: "Room III",
      title: "Twisting Spiral Minaret",
      obsoletedByParcel: "skyline_bastion",
      obsoletedStructure: "Squat Basalt Flue-Bastions",
      epochConceived: 2,
      epochSealed: 3,
      status: "possible_no_longer",
      isToyInGlassGlobe: true,
      hasSpiralSlide: true,
      calvinoDetail:
        "The fun of sliding down the spiral, twisting minaret (which never found a pedestal from which to rise)."
    })
  ]);

  const MOTIF_CATALOG = Object.freeze([
    Object.freeze({
      id: "suspended_gondolas",
      label: "Suspended Glass Gondolas",
      shortLabel: "Glass Gondolas",
      category: "aerial",
      description: "Translucent cobalt cable-cars gliding between slender sapphire towers."
    }),
    Object.freeze({
      id: "lotus_amphitheater",
      label: "Tidal Lotus Amphitheater",
      shortLabel: "Lotus Amphitheater",
      category: "water",
      description: "Concentric azure tide-steps opening and closing with canal swells."
    }),
    Object.freeze({
      id: "wind_harp_terraces",
      label: "Aeolian Wind-Harp Terraces",
      shortLabel: "Wind-Harp Terraces",
      category: "acoustic",
      description: "Cantilevered glass colonnades strung with resonant cyan filaments."
    }),
    Object.freeze({
      id: "starlight_cistern",
      label: "Subterranean Starlight Cistern",
      shortLabel: "Starlight Cistern",
      category: "mirror",
      description: "Domed sapphire basin catching zenith constellations below street grade."
    }),
    Object.freeze({
      id: "peacock_arcade",
      label: "Lapis Peacock Bridge Arcade",
      shortLabel: "Peacock Arcade",
      category: "avenue",
      description: "Fan-vaulted lapis arches spanning ceremonial water boulevards."
    }),
    Object.freeze({
      id: "observatory_minaret",
      label: "Celestial Slide Spire",
      shortLabel: "Celestial Spire",
      category: "spire",
      description: "Helical cobalt observatory wrapped in a frictionless skyward chute."
    })
  ]);

  const PARCEL_COUNTERFACTUAL_SEEDS = Object.freeze({
    basin_culvert: ["starlight_cistern", "lotus_amphitheater"],
    avenue_viaduct: ["peacock_arcade", "suspended_gondolas"],
    skyline_bastion: ["observatory_minaret", "wind_harp_terraces"],
    north_aqueduct: ["lotus_amphitheater", "suspended_gondolas"],
    east_ashlar_terraces: ["wind_harp_terraces", "observatory_minaret"],
    south_dock_embankment: ["peacock_arcade", "starlight_cistern"],
    west_foundry_arcade: ["suspended_gondolas", "peacock_arcade"],
    inner_ring_parapet: ["observatory_minaret", "wind_harp_terraces"],
    cistern_vaults: ["starlight_cistern", "lotus_amphitheater"],
    quarry_ramparts: ["wind_harp_terraces", "suspended_gondolas"],
    clockwork_gatehouse: ["observatory_minaret", "peacock_arcade"],
    granite_causeway: ["peacock_arcade", "lotus_amphitheater"]
  });

  function clamp(v, lo, hi) {
    return v < lo ? lo : v > hi ? hi : v;
  }

  function toRoman(num) {
    const n = Math.max(1, Math.floor(num || 1));
    const table = [
      [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
      [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
    ];
    let rem = n;
    let out = "";
    for (let i = 0; i < table.length; i++) {
      while (rem >= table[i][0]) {
        out += table[i][1];
        rem -= table[i][0];
      }
    }
    return out;
  }

  function findMotif(motifId, fallbackIdx) {
    for (let i = 0; i < MOTIF_CATALOG.length; i++) {
      if (MOTIF_CATALOG[i].id === motifId) return MOTIF_CATALOG[i];
    }
    return MOTIF_CATALOG[Math.abs(fallbackIdx || 0) % MOTIF_CATALOG.length];
  }

  function cloneElement(el) {
    return {
      id: el.id,
      kind: el.kind,
      motifId: el.motifId,
      label: el.label,
      nx: el.nx,
      ny: el.ny,
      scale: el.scale,
      seed: el.seed
    };
  }

  function cloneGlobe(g) {
    const copy = Object.assign({}, g);
    if (Array.isArray(g.elements)) {
      copy.elements = g.elements.map(cloneElement);
    }
    return copy;
  }

  function cloneDraft(d) {
    return {
      epochConceived: d.epochConceived,
      title: d.title,
      status: d.status,
      elements: d.elements.map(cloneElement),
      strokeCount: d.strokeCount
    };
  }

  function createFreshDraft(epochConceived) {
    const ep = typeof epochConceived === "number" ? epochConceived : 3;
    return {
      epochConceived: ep,
      title: "Unsealed Blue Model (Epoch " + toRoman(ep + 1) + " Dream)",
      status: "imagined_as_possible",
      elements: [],
      strokeCount: 0
    };
  }

  function buildSealedTitle(elements, roomNumber) {
    if (!elements || elements.length === 0) {
      return "Miniature Blue Fedora " + toRoman(roomNumber);
    }
    const primary = findMotif(elements[0].motifId, 0);
    if (elements.length === 1) {
      return primary.label + " (Room " + toRoman(roomNumber) + ")";
    }
    const secondary = findMotif(elements[elements.length - 1].motifId, 1);
    if (secondary.id !== primary.id) {
      return primary.shortLabel + " & " + secondary.shortLabel;
    }
    return primary.label + " (" + elements.length + " Blue Strata)";
  }

  function drawVaultBackdropAndCradle(ctx, width, height, cx, cy, R, plaqueText, isWorkbench, sealFlash) {
    const bg = ctx.createRadialGradient(cx, cy - R * 0.15, R * 0.15, cx, cy, Math.max(width, height) * 0.78);
    bg.addColorStop(0, isWorkbench ? "#11284a" : "#0d2240");
    bg.addColorStop(0.55, "#171c23");
    bg.addColorStop(1, PALETTE.graniteVoid);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    // Cast-iron museum vault arch ribs & rivets
    ctx.save();
    ctx.strokeStyle = "rgba(92, 100, 112, 0.24)";
    ctx.lineWidth = 2;
    for (let k = -1; k <= 1; k += 2) {
      ctx.beginPath();
      ctx.arc(cx + k * R * 0.12, cy + R * 0.08, R * 1.24, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(181, 154, 106, 0.38)";
    for (let a = 0; a <= 10; a++) {
      const ang = Math.PI * (1.12 + (a / 10) * 0.76);
      ctx.beginPath();
      ctx.arc(cx + Math.cos(ang) * R * 1.24, cy + R * 0.08 + Math.sin(ang) * R * 1.24, 2.1, 0, Math.PI * 2);
      ctx.fill();
    }

    // Refracted cobalt caustic pool below the globe/plinth
    const poolY = cy + R * 1.07;
    const caustic = ctx.createRadialGradient(cx, poolY, R * 0.05, cx, poolY, R * 0.78);
    const alphaBoost = 0.28 + (sealFlash || 0) * 0.35;
    caustic.addColorStop(0, "rgba(142, 232, 255, " + alphaBoost.toFixed(2) + ")");
    caustic.addColorStop(0.45, "rgba(29, 99, 184, 0.20)");
    caustic.addColorStop(1, "rgba(10, 31, 61, 0)");
    ctx.fillStyle = caustic;
    ctx.beginPath();
    ctx.ellipse(cx, poolY, R * 0.76, R * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Riveted cast-iron pedestal & museum-brass meridian cradle
    const baseTop = cy + R * 0.96;
    ctx.fillStyle = PALETTE.ironMuseum;
    ctx.strokeStyle = PALETTE.museumBrass;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - R * 0.42, baseTop);
    ctx.lineTo(cx + R * 0.42, baseTop);
    ctx.lineTo(cx + R * 0.56, baseTop + R * 0.24);
    ctx.lineTo(cx - R * 0.56, baseTop + R * 0.24);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    if (!isWorkbench) {
      // Graduated brass meridian ring cradling crystal sphere
      ctx.strokeStyle = PALETTE.museumBrass;
      ctx.lineWidth = Math.max(3.5, R * 0.036);
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.045, -0.22, Math.PI + 0.22);
      ctx.stroke();

      ctx.strokeStyle = PALETTE.brassHighlight;
      ctx.lineWidth = 1;
      for (let i = 0; i <= 16; i++) {
        const ang = -0.18 + (i / 16) * (Math.PI + 0.36);
        const r0 = R * 1.025;
        const r1 = R * (i % 4 === 0 ? 1.08 : 1.055);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * r0, cy + Math.sin(ang) * r0);
        ctx.lineTo(cx + Math.cos(ang) * r1, cy + Math.sin(ang) * r1);
        ctx.stroke();
      }

      // Twin brass trunnion pivots
      for (let s = -1; s <= 1; s += 2) {
        const tx = cx + Math.cos(s > 0 ? -0.2 : Math.PI + 0.2) * R * 1.045;
        const ty = cy + Math.sin(s > 0 ? -0.2 : Math.PI + 0.2) * R * 1.045;
        ctx.fillStyle = PALETTE.brassHighlight;
        ctx.beginPath();
        ctx.arc(tx, ty, Math.max(4, R * 0.035), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Brass nameplate on pedestal
    const pw = R * 0.64;
    const ph = Math.max(15, R * 0.12);
    ctx.fillStyle = "#221d15";
    ctx.strokeStyle = PALETTE.museumBrass;
    ctx.lineWidth = 1.2;
    ctx.fillRect(cx - pw * 0.5, baseTop + R * 0.06, pw, ph);
    ctx.strokeRect(cx - pw * 0.5, baseTop + R * 0.06, pw, ph);
    ctx.fillStyle = PALETTE.brassHighlight;
    ctx.font = "600 " + Math.max(9, Math.round(R * 0.065)) + "px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(plaqueText, cx, baseTop + R * 0.06 + ph * 0.53);
    ctx.restore();
  }

  function drawCrystalSphereOptics(ctx, cx, cy, R, px, py, sealFlash) {
    ctx.save();
    // Fresnel cyan-cobalt inner rim refraction
    const rim = ctx.createRadialGradient(cx, cy, R * 0.68, cx, cy, R);
    rim.addColorStop(0, "rgba(10, 31, 61, 0)");
    rim.addColorStop(0.72, "rgba(77, 166, 255, 0.14)");
    rim.addColorStop(0.91, "rgba(142, 232, 255, 0.36)");
    rim.addColorStop(1, "rgba(230, 246, 255, 0.72)");
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fill();

    // Curved skylight specular meniscus (responds subtly to viewer angle)
    const sx = cx - R * 0.32 + (px - 0.5) * R * 0.08;
    const sy = cy - R * 0.34 + (py - 0.5) * R * 0.08;
    const spec = ctx.createRadialGradient(sx, sy, R * 0.02, sx, sy, R * 0.42);
    spec.addColorStop(0, "rgba(230, 246, 255, 0.62)");
    spec.addColorStop(0.45, "rgba(142, 232, 255, 0.18)");
    spec.addColorStop(1, "rgba(142, 232, 255, 0)");
    ctx.fillStyle = spec;
    ctx.beginPath();
    ctx.ellipse(sx, sy, R * 0.34, R * 0.18, -0.58, 0, Math.PI * 2);
    ctx.fill();

    // Crisp specular arc & lower-right caustic bounce
    ctx.strokeStyle = "rgba(230, 246, 255, 0.75)";
    ctx.lineWidth = Math.max(1.8, R * 0.016);
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.91, Math.PI * 1.12, Math.PI * 1.44);
    ctx.stroke();

    ctx.strokeStyle = "rgba(142, 232, 255, 0.42)";
    ctx.lineWidth = Math.max(1.4, R * 0.013);
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.93, Math.PI * 0.12, Math.PI * 0.38);
    ctx.stroke();

    // Outer glass shell stroke + crystallization sealFlash aura
    ctx.strokeStyle = PALETTE.crystalSpecular;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    if (sealFlash > 0.01) {
      ctx.fillStyle = "rgba(230, 246, 255, " + (sealFlash * 0.48).toFixed(3) + ")";
      ctx.beginPath();
      ctx.arc(cx, cy, R * (1 + (1 - sealFlash) * 0.08), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawRoom1MedusaCanal(ctx, cx, cy, R, t, px, py) {
    // Canal palaces & slender azure bridges along horizon
    const waterTop = cy - R * 0.04;
    ctx.fillStyle = "#113768";
    for (let i = -5; i <= 5; i++) {
      const bx = cx + i * R * 0.16;
      const bh = R * (0.24 + ((Math.abs(i * 7 + 3) % 5) * 0.05));
      ctx.fillRect(bx - R * 0.07, waterTop - bh, R * 0.13, bh);
      ctx.fillStyle = "rgba(142, 232, 255, 0.45)";
      ctx.fillRect(bx - R * 0.03, waterTop - bh + R * 0.05, R * 0.02, R * 0.05);
      ctx.fillStyle = "#113768";
    }

    // Canal pond water gradient
    const pond = ctx.createLinearGradient(cx, waterTop, cx, cy + R);
    pond.addColorStop(0, "#1d63b8");
    pond.addColorStop(0.45, "#0d3569");
    pond.addColorStop(1, "#06162e");
    ctx.fillStyle = pond;
    ctx.fillRect(cx - R, waterTop, R * 2, R * 1.1);

    // 3 slender arched blue canal bridges
    ctx.strokeStyle = PALETTE.azureRefraction;
    ctx.lineWidth = 2.2;
    for (let b = -1; b <= 1; b++) {
      const by = waterTop + (b + 1) * R * 0.09;
      ctx.beginPath();
      ctx.moveTo(cx - R * 0.68, by + R * 0.04);
      ctx.quadraticCurveTo(cx + b * R * 0.12, by - R * 0.11, cx + R * 0.68, by + R * 0.04);
      ctx.stroke();
    }

    // Rippled sapphire viewer reflection silhouette responding to (px, py)
    const rx = cx + (px - 0.5) * R * 0.56;
    const ry = cy + R * 0.26 + (py - 0.5) * R * 0.22;
    for (let band = -12; band <= 14; band++) {
      const y = ry + band * R * 0.024;
      if (y < waterTop + 4) continue;
      const wave = Math.sin(t * 2.4 + band * 0.75) * R * 0.018;
      const headFactor = Math.max(0, 1 - Math.pow((band + 6) / 6.2, 2));
      const shoulderFactor = band > -1 ? Math.max(0, 1 - Math.pow((band - 8) / 8.5, 2)) : 0;
      const halfW = R * (headFactor * 0.11 + shoulderFactor * 0.23);
      if (halfW > 1.5) {
        ctx.fillStyle = "rgba(142, 232, 255, 0.21)";
        ctx.fillRect(rx - halfW + wave, y, halfW * 2, R * 0.014);
      }
    }

    // 7 pulsing bioluminescent cyan medusas with trailing tentacles
    for (let m = 0; m < 7; m++) {
      const phase = t * 1.7 + m * 1.15;
      const pulse = 0.82 + Math.sin(phase * 1.6) * 0.18;
      const mx = cx + Math.sin(phase * 0.42 + m * 0.9) * R * (0.18 + (m % 3) * 0.2);
      const my = waterTop + R * (0.18 + ((m * 0.13 + Math.cos(phase * 0.35) * 0.05 + 1) % 0.68));
      const mr = R * (0.048 + (m % 3) * 0.012) * pulse;

      ctx.strokeStyle = "rgba(142, 232, 255, 0.55)";
      ctx.lineWidth = 1.1;
      for (let k = -2; k <= 2; k++) {
        ctx.beginPath();
        ctx.moveTo(mx + k * mr * 0.28, my + mr * 0.1);
        ctx.quadraticCurveTo(
          mx + k * mr * 0.36 + Math.sin(phase * 2 + k) * mr * 0.35,
          my + mr * 1.1,
          mx + k * mr * 0.22 + Math.cos(phase * 1.8 + k) * mr * 0.4,
          my + mr * 2.05
        );
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(142, 232, 255, 0.74)";
      ctx.beginPath();
      ctx.arc(mx, my, mr, Math.PI, 0);
      ctx.quadraticCurveTo(mx, my + mr * 0.28, mx - mr, my);
      ctx.fill();
    }
  }

  function drawRoom2ElephantAvenue(ctx, cx, cy, R, t, px, py) {
    const vanishY = cy - R * 0.22;
    // Perspective sapphire avenue pavement
    const road = ctx.createLinearGradient(cx, vanishY, cx, cy + R);
    road.addColorStop(0, "#154685");
    road.addColorStop(1, "#092145");
    ctx.fillStyle = road;
    ctx.beginPath();
    ctx.moveTo(cx - R * 0.14, vanishY);
    ctx.lineTo(cx + R * 0.14, vanishY);
    ctx.lineTo(cx + R * 0.86, cy + R * 0.92);
    ctx.lineTo(cx - R * 0.86, cy + R * 0.92);
    ctx.closePath();
    ctx.fill();

    // Flanking azure colonnades & elevated high-canopied observation boxes
    for (let side = -1; side <= 1; side += 2) {
      for (let d = 0; d < 4; d++) {
        const u = (d + 0.35) / 4;
        const x = cx + side * R * (0.18 + u * 0.56);
        const baseY = vanishY + u * R * 0.96;
        const colH = R * (0.24 + u * 0.34);
        ctx.fillStyle = "#164d94";
        ctx.fillRect(x - R * 0.045, baseY - colH, R * 0.09, colH);
        // High-canopied cobalt silk box jutting over the avenue
        const boxY = baseY - colH * 0.82;
        const boxX = x - side * R * 0.065;
        ctx.fillStyle = PALETTE.azureRefraction;
        ctx.fillRect(boxX - R * 0.045, boxY, R * 0.09, R * 0.065);
        ctx.fillStyle = PALETTE.medusaCyan;
        ctx.beginPath();
        ctx.moveTo(boxX - R * 0.06, boxY);
        ctx.lineTo(boxX, boxY - R * 0.055);
        ctx.lineTo(boxX + R * 0.06, boxY);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Golden-cyan sightline rays from foreground high-canopied box
    const canopyOriginX = cx - R * 0.48;
    const canopyOriginY = cy - R * 0.18;
    const targetX = cx + (px - 0.5) * R * 0.42;
    const targetY = cy + R * 0.34 + (py - 0.5) * R * 0.16;
    const ray = ctx.createLinearGradient(canopyOriginX, canopyOriginY, targetX, targetY);
    ray.addColorStop(0, "rgba(230, 246, 255, 0.38)");
    ray.addColorStop(1, "rgba(142, 232, 255, 0.03)");
    ctx.fillStyle = ray;
    ctx.beginPath();
    ctx.moveTo(canopyOriginX, canopyOriginY);
    ctx.lineTo(targetX - R * 0.22, targetY + R * 0.14);
    ctx.lineTo(targetX + R * 0.26, targetY + R * 0.08);
    ctx.closePath();
    ctx.fill();

    // Ceremonial miniature blue elephants processing down the boulevard
    for (let e = 0; e < 3; e++) {
      const prog = ((e * 0.33 + t * 0.075) % 1);
      const ey = vanishY + R * 0.12 + prog * R * 0.78;
      const ex = cx + Math.sin(prog * 5 + e) * R * 0.05;
      const sc = R * (0.045 + prog * 0.085);
      ctx.fillStyle = "#2d82e0";
      ctx.beginPath();
      ctx.ellipse(ex, ey, sc * 1.15, sc * 0.78, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(ex - sc * 0.85, ey + sc * 0.4, sc * 0.32, sc * 0.65);
      ctx.fillRect(ex + sc * 0.45, ey + sc * 0.4, sc * 0.32, sc * 0.65);
      // Trunk, cyan tusks & howdah
      ctx.strokeStyle = PALETTE.medusaCyan;
      ctx.lineWidth = Math.max(1.5, sc * 0.2);
      ctx.beginPath();
      ctx.moveTo(ex, ey + sc * 0.2);
      ctx.quadraticCurveTo(ex + sc * 0.55, ey + sc * 0.85, ex + sc * 0.25, ey + sc * 1.05);
      ctx.stroke();
      ctx.fillStyle = PALETTE.crystalSpecular;
      ctx.fillRect(ex - sc * 0.42, ey - sc * 1.12, sc * 0.84, sc * 0.42);
    }
  }

  function drawRoom3SpiralMinaret(ctx, cx, cy, R, t) {
    // Star-tiled azure court at base
    const courtY = cy + R * 0.54;
    ctx.fillStyle = "#0e315e";
    ctx.beginPath();
    ctx.ellipse(cx, courtY, R * 0.78, R * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(142, 232, 255, 0.45)";
    ctx.lineWidth = 1.2;
    for (let s = 0; s < 8; s++) {
      const a = (s / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, courtY);
      ctx.lineTo(cx + Math.cos(a) * R * 0.66, courtY + Math.sin(a) * R * 0.21);
      ctx.stroke();
    }

    // Tapered sapphire minaret shaft
    const apexY = cy - R * 0.74;
    const shaft = ctx.createLinearGradient(cx - R * 0.22, cy, cx + R * 0.22, cy);
    shaft.addColorStop(0, "#103a70");
    shaft.addColorStop(0.5, "#2878d4");
    shaft.addColorStop(1, "#0c2b54");
    ctx.fillStyle = shaft;
    ctx.beginPath();
    ctx.moveTo(cx - R * 0.035, apexY);
    ctx.lineTo(cx + R * 0.035, apexY);
    ctx.lineTo(cx + R * 0.24, courtY);
    ctx.lineTo(cx - R * 0.24, courtY);
    ctx.closePath();
    ctx.fill();

    // Twisting helical spiral chute wrapping 5.5 turns top-to-bottom
    ctx.strokeStyle = PALETTE.medusaCyan;
    ctx.lineWidth = Math.max(2.6, R * 0.028);
    ctx.beginPath();
    const steps = 90;
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      const ang = u * Math.PI * 11;
      const rad = R * (0.045 + u * 0.25);
      const sx = cx + Math.cos(ang) * rad;
      const sy = apexY + u * (courtY - apexY) + Math.sin(ang) * R * 0.03;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Tiny luminous citizens joyfully sliding down the spiral chute
    for (let p = 0; p < 6; p++) {
      const u = ((p / 6) + t * 0.16) % 1;
      const ang = u * Math.PI * 11;
      const rad = R * (0.045 + u * 0.25);
      const px0 = cx + Math.cos(ang) * rad;
      const py0 = apexY + u * (courtY - apexY) + Math.sin(ang) * R * 0.03;
      ctx.fillStyle = PALETTE.crystalSpecular;
      ctx.beginPath();
      ctx.arc(px0, py0, Math.max(2.4, R * 0.022), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawMotifGlyph(ctx, el, cx, cy, R, t) {
    const x = cx + (el.nx - 0.5) * R * 1.25;
    const y = cy + (el.ny - 0.5) * R * 1.15;
    const s = R * 0.14 * (el.scale || 1);
    ctx.save();
    ctx.strokeStyle = PALETTE.medusaCyan;
    ctx.fillStyle = "rgba(29, 99, 184, 0.78)";
    ctx.lineWidth = 1.6;

    if (el.motifId === "suspended_gondolas") {
      ctx.fillRect(x - s * 0.95, y - s * 0.7, s * 0.24, s * 1.1);
      ctx.fillRect(x + s * 0.71, y - s * 0.7, s * 0.24, s * 1.1);
      ctx.beginPath();
      ctx.moveTo(x - s * 0.83, y - s * 0.62);
      ctx.quadraticCurveTo(x, y - s * 0.15, x + s * 0.83, y - s * 0.62);
      ctx.stroke();
      const gx = x + Math.sin(t * 1.6 + el.seed) * s * 0.45;
      ctx.fillStyle = PALETTE.crystalSpecular;
      ctx.fillRect(gx - s * 0.16, y - s * 0.34, s * 0.32, s * 0.2);
    } else if (el.motifId === "lotus_amphitheater") {
      for (let r = 3; r >= 1; r--) {
        ctx.beginPath();
        ctx.ellipse(x, y + s * 0.1, s * 0.32 * r, s * 0.15 * r, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    } else if (el.motifId === "wind_harp_terraces") {
      ctx.fillRect(x - s * 0.75, y + s * 0.2, s * 1.5, s * 0.22);
      ctx.beginPath();
      ctx.moveTo(x - s * 0.7, y + s * 0.2);
      ctx.quadraticCurveTo(x, y - s * 0.85, x + s * 0.7, y - s * 0.35);
      ctx.stroke();
      for (let h = -3; h <= 3; h++) {
        ctx.beginPath();
        ctx.moveTo(x + h * s * 0.2, y + s * 0.2);
        ctx.lineTo(x + h * s * 0.2, y - s * (0.48 - Math.abs(h) * 0.06));
        ctx.stroke();
      }
    } else if (el.motifId === "starlight_cistern") {
      ctx.beginPath();
      ctx.arc(x, y + s * 0.15, s * 0.68, Math.PI, 0);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = PALETTE.crystalSpecular;
      for (let k = -1; k <= 1; k++) {
        ctx.fillRect(x + k * s * 0.24 - 1.5, y - s * 0.12 - Math.abs(k) * 3, 3, 3);
      }
    } else if (el.motifId === "peacock_arcade") {
      for (let a = -1; a <= 1; a++) {
        ctx.beginPath();
        ctx.arc(x + a * s * 0.48, y + s * 0.25, s * 0.24, Math.PI, 0);
        ctx.stroke();
      }
      ctx.fillRect(x - s * 0.8, y - s * 0.08, s * 1.6, s * 0.12);
    } else {
      // observatory_minaret or custom_spire_canal
      ctx.beginPath();
      ctx.moveTo(x, y - s * 0.95);
      ctx.lineTo(x + s * 0.32, y + s * 0.4);
      ctx.lineTo(x - s * 0.32, y + s * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawUserCrystalCity(ctx, globe, cx, cy, R, t) {
    const els = Array.isArray(globe.elements) ? globe.elements : [];
    // Faceted sapphire island plinth & ring canal inside sealed crystal
    ctx.fillStyle = "#0d2e5c";
    ctx.beginPath();
    ctx.ellipse(cx, cy + R * 0.28, R * 0.78, R * 0.42, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(77, 166, 255, 0.48)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Connecting luminous azure canal filaments between sculpted motifs
    if (els.length > 1) {
      ctx.strokeStyle = "rgba(142, 232, 255, 0.52)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      for (let i = 0; i < els.length; i++) {
        const ex = cx + (els[i].nx - 0.5) * R * 1.25;
        const ey = cy + (els[i].ny - 0.5) * R * 1.15;
        if (i === 0) ctx.moveTo(ex, ey);
        else ctx.lineTo(ex, ey);
      }
      ctx.stroke();
    }
    for (let i = 0; i < els.length; i++) {
      drawMotifGlyph(ctx, els[i], cx, cy, R, t);
    }
  }

  function drawOpenWorkbench(ctx, cx, cy, R, t, px, py, buildProgress, activeDraft) {
    const prog = clamp(Number(buildProgress) || 0, 0, 1);
    const tableY = cy + R * 0.28;

    // Open brass & slate modeling turntable with azure blueprint grid
    ctx.save();
    ctx.fillStyle = "#0b2140";
    ctx.strokeStyle = PALETTE.museumBrass;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cx, tableY, R * 0.88, R * 0.44, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "rgba(77, 166, 255, 0.34)";
    ctx.lineWidth = 1;
    for (let c = 1; c <= 3; c++) {
      ctx.beginPath();
      ctx.ellipse(cx, tableY, R * 0.26 * c, R * 0.13 * c, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let a = 0; a < 6; a++) {
      const ang = (a / 6) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx - Math.cos(ang) * R * 0.84, tableY - Math.sin(ang) * R * 0.41);
      ctx.lineTo(cx + Math.cos(ang) * R * 0.84, tableY + Math.sin(ang) * R * 0.41);
      ctx.stroke();
    }

    // Live sculpted activeDraft elements (or pulsing reticle invitation)
    const els = activeDraft.elements;
    if (els.length > 1) {
      ctx.strokeStyle = "rgba(142, 232, 255, 0.62)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i < els.length; i++) {
        const ex = cx + (els[i].nx - 0.5) * R * 1.25;
        const ey = cy + (els[i].ny - 0.5) * R * 1.15;
        if (i === 0) ctx.moveTo(ex, ey);
        else ctx.lineTo(ex, ey);
      }
      ctx.stroke();
    }
    for (let i = 0; i < els.length; i++) {
      drawMotifGlyph(ctx, els[i], cx, cy, R, t);
    }

    // Live sculpting cursor reticle
    const rx = cx + (px - 0.5) * R * 1.25;
    const ry = cy + (py - 0.5) * R * 1.15;
    ctx.strokeStyle = "rgba(230, 246, 255, 0.68)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(rx, ry, R * 0.09, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Ghostly descending crystal bell tracking gray-stone buildProgress (0..1)
    const dropOffset = -R * 0.58 * (1 - prog);
    const bellCy = cy + dropOffset;
    ctx.strokeStyle = prog > 0.65
      ? "rgba(230, 246, 255, " + (0.45 + prog * 0.45).toFixed(2) + ")"
      : "rgba(142, 232, 255, " + (0.24 + prog * 0.35).toFixed(2) + ")";
    ctx.lineWidth = 1.8 + prog * 1.4;
    ctx.setLineDash([7, 5]);
    ctx.beginPath();
    ctx.arc(cx, bellCy, R * 0.92, Math.PI * 1.02, Math.PI * 1.98);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, bellCy + R * 0.12, R * 0.9, R * 0.22, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function createGallery(opts) {
    const options = opts || {};
    let mode = "globe";
    let globes = CANONICAL_GLOBES.map(cloneGlobe);
    let selectedGlobeId = "globe_medusa_canal";
    let userCrystallizedCount = 0;
    let sealFlash = 0;
    let reducedMotion = Boolean(options.reducedMotion);
    let activeDraft = createFreshDraft(3);

    function findSelectedGlobe() {
      for (let i = 0; i < globes.length; i++) {
        if (globes[i].id === selectedGlobeId) return globes[i];
      }
      return globes[0];
    }

    function renderGlobeOculus(ctx, width, height, renderOpts) {
      if (!ctx || !(width > 0) || !(height > 0)) return;
      const ro = renderOpts || {};
      const isReduced = ro.reducedMotion !== undefined ? Boolean(ro.reducedMotion) : reducedMotion;
      const t = isReduced ? 8.4 : (Number(ro.timeMs) || 0) * 0.001;
      const px = Number.isFinite(ro.pointerX) ? clamp(ro.pointerX, 0, 1) : 0.5;
      const py = Number.isFinite(ro.pointerY) ? clamp(ro.pointerY, 0, 1) : 0.48;
      const cx = width * 0.5;
      const cy = height * 0.455;
      const R = Math.max(28, Math.min(width * 0.41, height * 0.375));
      const curGlobe = findSelectedGlobe();
      const plaque = mode === "workbench"
        ? "OPEN BLUE WORKBENCH"
        : "ROOM " + toRoman(curGlobe.roomNumber);

      drawVaultBackdropAndCradle(ctx, width, height, cx, cy, R, plaque, mode === "workbench", sealFlash);

      if (mode === "workbench") {
        drawOpenWorkbench(ctx, cx, cy, R, t, px, py, ro.buildProgress, activeDraft);
        return;
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.clip();

      const dome = ctx.createRadialGradient(cx, cy - R * 0.25, R * 0.08, cx, cy, R);
      dome.addColorStop(0, "#143d73");
      dome.addColorStop(0.65, PALETTE.cobaltAbyss);
      dome.addColorStop(1, PALETTE.cobaltDeep);
      ctx.fillStyle = dome;
      ctx.fillRect(cx - R, cy - R, R * 2, R * 2);

      if (curGlobe.id === "globe_medusa_canal") {
        drawRoom1MedusaCanal(ctx, cx, cy, R, t, px, py);
      } else if (curGlobe.id === "globe_elephant_avenue") {
        drawRoom2ElephantAvenue(ctx, cx, cy, R, t, px, py);
      } else if (curGlobe.id === "globe_spiral_minaret") {
        drawRoom3SpiralMinaret(ctx, cx, cy, R, t);
      } else {
        drawUserCrystalCity(ctx, curGlobe, cx, cy, R, t);
      }
      ctx.restore();

      drawCrystalSphereOptics(ctx, cx, cy, R, px, py, sealFlash);
      if (sealFlash > 0) {
        sealFlash = isReduced ? 0 : Math.max(0, +(sealFlash - 0.025).toFixed(3));
      }
    }

    function selectGlobe(idOrRoomNumber) {
      const asNum = Number(idOrRoomNumber);
      let found = null;
      for (let i = 0; i < globes.length; i++) {
        if (globes[i].id === idOrRoomNumber || (Number.isFinite(asNum) && globes[i].roomNumber === asNum)) {
          found = globes[i];
          break;
        }
      }
      if (!found) found = findSelectedGlobe();
      mode = "globe";
      selectedGlobeId = found.id;
      const snap = cloneGlobe(found);
      if (typeof options.onGlobeSelected === "function") {
        options.onGlobeSelected(snap, getState());
      }
      return snap;
    }

    function openWorkbench() {
      mode = "workbench";
      return cloneDraft(activeDraft);
    }

    function addBlueMotif(motifId, normX, normY) {
      mode = "workbench";
      const idx = activeDraft.elements.length;
      const motif = findMotif(motifId, idx);
      const goldenAng = idx * 2.39996 + 0.6;
      const rad = 0.12 + (idx % 4) * 0.055;
      const nx = Number.isFinite(normX) ? clamp(normX, 0.2, 0.8) : clamp(0.5 + Math.cos(goldenAng) * rad, 0.22, 0.78);
      const ny = Number.isFinite(normY) ? clamp(normY, 0.2, 0.8) : clamp(0.5 + Math.sin(goldenAng) * rad, 0.24, 0.76);
      activeDraft.elements.push({
        id: "motif_" + (activeDraft.strokeCount + 1),
        kind: "motif",
        motifId: motif.id,
        label: motif.label,
        nx: +nx.toFixed(3),
        ny: +ny.toFixed(3),
        scale: +(0.92 + (idx % 3) * 0.1).toFixed(2),
        seed: (idx * 37 + 11) % 100
      });
      activeDraft.strokeCount += 1;
      if (typeof options.onDraftEffort === "function") {
        options.onDraftEffort(0.28, cloneDraft(activeDraft));
      }
      return { activeDraft: cloneDraft(activeDraft), effortDelta: 0.28 };
    }

    function sculptStroke(normX, normY) {
      mode = "workbench";
      const nx = Number.isFinite(normX) ? clamp(normX, 0.18, 0.82) : 0.5;
      const ny = Number.isFinite(normY) ? clamp(normY, 0.18, 0.82) : 0.5;
      activeDraft.elements.push({
        id: "stroke_" + (activeDraft.strokeCount + 1),
        kind: "stroke",
        motifId: "custom_spire_canal",
        label: "Sculpted Azure Canal Spire",
        nx: +nx.toFixed(3),
        ny: +ny.toFixed(3),
        scale: 0.95,
        seed: Math.round((nx * 71 + ny * 89) * 10) % 100
      });
      activeDraft.strokeCount += 1;
      if (typeof options.onDraftEffort === "function") {
        options.onDraftEffort(0.18, cloneDraft(activeDraft));
      }
      return { activeDraft: cloneDraft(activeDraft), effortDelta: 0.18 };
    }

    function crystallizeOnMutation(mutationEvent) {
      const ev = mutationEvent || {};
      const parcelId = ev.parcelId || "north_aqueduct";
      const parcelName = ev.parcelName || ev.label || parcelId;
      const stoneStructure = ev.stoneStructure || "Heavy Gray Ashlar";
      const nextEpoch = typeof ev.epoch === "number" ? ev.epoch : activeDraft.epochConceived + 1;

      if (activeDraft.elements.length === 0) {
        const pair = PARCEL_COUNTERFACTUAL_SEEDS[parcelId] || ["suspended_gondolas", "lotus_amphitheater"];
        const m0 = findMotif(pair[0], 0);
        const m1 = findMotif(pair[1], 1);
        activeDraft.elements.push(
          { id: "seed_1", kind: "motif", motifId: m0.id, label: m0.label, nx: 0.39, ny: 0.53, scale: 1.0, seed: 17 },
          { id: "seed_2", kind: "motif", motifId: m1.id, label: m1.label, nx: 0.62, ny: 0.46, scale: 0.96, seed: 53 }
        );
      }

      const nextRoom = globes.length + 1;
      const sealedElements = activeDraft.elements.map(cloneElement);
      const newGlobe = {
        id: "globe_user_" + nextRoom,
        roomNumber: nextRoom,
        romanRoom: "Room " + toRoman(nextRoom),
        title: buildSealedTitle(sealedElements, nextRoom),
        epochConceived: activeDraft.epochConceived,
        epochSealed: nextEpoch,
        obsoletedByParcel: parcelId,
        obsoletedStructure: stoneStructure,
        calvinoDetail:
          "Conceived in Epoch " +
          activeDraft.epochConceived +
          ", rendered impossible the moment " +
          stoneStructure +
          " claimed " +
          parcelName +
          ".",
        status: "possible_no_longer",
        isToyInGlassGlobe: true,
        elements: sealedElements
      };

      globes.push(newGlobe);
      userCrystallizedCount += 1;
      mode = "globe";
      selectedGlobeId = newGlobe.id;
      sealFlash = 1.0;
      activeDraft = createFreshDraft(nextEpoch);
      return cloneGlobe(newGlobe);
    }

    function hitTestOculus(normX, normY) {
      const nx = Number.isFinite(normX) ? clamp(normX, 0, 1) : 0.5;
      const ny = Number.isFinite(normY) ? clamp(normY, 0, 1) : 0.5;
      const dx = nx - 0.5;
      const dy = ny - 0.455;
      const inside = Math.sqrt(dx * dx + dy * dy) <= 0.39;
      if (mode === "workbench") {
        return {
          hit: inside,
          kind: inside ? "workbench_plinth" : "vault_alcove",
          mode: "workbench",
          insideGlobe: inside,
          label: activeDraft.title,
          normX: nx,
          normY: ny
        };
      }
      const cur = findSelectedGlobe();
      return {
        hit: inside,
        kind: inside ? "crystal_interior" : "meridian_cradle",
        mode: "globe",
        insideGlobe: inside,
        globeId: cur.id,
        roomNumber: cur.roomNumber,
        label: cur.title,
        normX: nx,
        normY: ny
      };
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      return reducedMotion;
    }

    function resetToCanonical3() {
      mode = "globe";
      globes = CANONICAL_GLOBES.map(cloneGlobe);
      selectedGlobeId = "globe_medusa_canal";
      userCrystallizedCount = 0;
      sealFlash = 0;
      activeDraft = createFreshDraft(3);
      return getState();
    }

    function getMotifCatalog() {
      return MOTIF_CATALOG.map(function (m) { return Object.assign({}, m); });
    }

    function getState() {
      const cur = findSelectedGlobe();
      return {
        mode: mode,
        totalGlobes: globes.length,
        canonicalGlobesCount: 3,
        userCrystallizedCount: userCrystallizedCount,
        selectedGlobeId: selectedGlobeId,
        selectedGlobe: cloneGlobe(cur),
        globes: globes.map(cloneGlobe),
        activeDraft: cloneDraft(activeDraft),
        sealFlash: sealFlash,
        possibilityClaim: "What is imagined as possible and, a moment later, is possible no longer",
        equalAtlasClaim: true
      };
    }

    return {
      renderGlobeOculus: renderGlobeOculus,
      selectGlobe: selectGlobe,
      openWorkbench: openWorkbench,
      addBlueMotif: addBlueMotif,
      sculptStroke: sculptStroke,
      crystallizeOnMutation: crystallizeOnMutation,
      hitTestOculus: hitTestOculus,
      setReducedMotion: setReducedMotion,
      resetToCanonical3: resetToCanonical3,
      getMotifCatalog: getMotifCatalog,
      getState: getState
    };
  }

  const api = {
    PALETTE: PALETTE,
    CANONICAL_GLOBES: CANONICAL_GLOBES,
    MOTIF_CATALOG: MOTIF_CATALOG,
    createGallery: createGallery
  };

  global.FedoraCrystalGlobes = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
