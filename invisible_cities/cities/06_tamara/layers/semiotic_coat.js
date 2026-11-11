/* ==========================================================================
 * City 06: TAMARA (Chapter I — Cities & Signs 1)
 * Layer: layers/semiotic_coat.js
 * Global: window.TamaraSemioticCoat
 * Standalone classic JS IIFE — zero external URLs, zero ES module imports.
 * ========================================================================== */
(function (root) {
  "use strict";

  var PALETTE = Object.freeze({
    vellum_ground: "#f3ead8",
    aged_rag: "#e6d8be",
    woodblock_ink: "#171310",
    rubric_vermilion: "#a62c1e",
    gilt_ochre: "#986d24",
    horizon_chalk: "#efe6d2",
    vapor_slate: "#49525c"
  });

  var STATIONS = Object.freeze([
    {
      index: 0,
      id: "cantilevers",
      kind: "cantilevers",
      roman: "I",
      title: "Jutting Signboards",
      subtitle: "Iron-bracketed emblems jutting from the walls to name every trade",
      corridorQuote: "You walk for days among trees and among stones. Rarely does the eye light on a thing, and then only when it has recognized that thing as the sign of another thing: a print in the sand indicates the tiger's passage; a marsh announces a vein of water; the hibiscus flower, the end of winter. All the rest is silent and interchangeable; trees and stones are only what they are. Finally the journey leads to the city of Tamara. You penetrate it along streets thick with signboards jutting from the walls."
    },
    {
      index: 1,
      id: "heraldry",
      kind: "heraldry",
      roman: "II",
      title: "Statues & Shields",
      subtitle: "Effigies signifying only that something bears them as its sign",
      corridorQuote: "The eye does not see things but images of things that mean other things. Other signals warn of what is forbidden in a given place and what is lawful, while from niches and escutcheons statues and shields depict lions, dolphins, towers, stars: a sign that something—who knows what?—has as its sign a lion or a dolphin or a tower or a star."
    },
    {
      index: 2,
      id: "decrees",
      kind: "decrees",
      roman: "III",
      title: "Prohibitions & Permissions",
      subtitle: "Rubricated tablets warning what is forbidden and what is lawful",
      corridorQuote: "Other signals warn of what is forbidden in a given place (to enter the alley with wagons, to urinate behind the kiosk, to fish with your pole from the bridge) and what is lawful (watering zebras, playing bowls, burning relatives' corpses)."
    },
    {
      index: 3,
      id: "order",
      kind: "order",
      roman: "IV",
      title: "Temples & Unmarked Edifices",
      subtitle: "Gods identified by attributes; unmarked buildings read by form and rank",
      corridorQuote: "From the doors of the temples the gods' statues are seen, each portrayed with his attributes—the cornucopia, the hourglass, the medusa—so that the worshiper can recognize them and address his prayers correctly. If a building has no signboard or figure, its very form and the position it occupies in the city's order suffice to indicate its function: the palace, the prison, the mint, the Pythagorean school, the brothel."
    },
    {
      index: 4,
      id: "bazaar",
      kind: "bazaar",
      roman: "V",
      title: "Bazaar of Signifying Wares",
      subtitle: "Merchandise prized never in itself, only as signs of other things",
      corridorQuote: "The wares that the vendors display on their stalls are valuable not in themselves but as signs of other things: the embroidered headband stands for elegance; the gilded palanquin, power; the volumes of Averroes, learning; the ankle bracelet, voluptuousness. Your gaze scans the streets as if they were written pages: the city says everything you must think, makes you repeat her discourse."
    }
  ]);

  function escHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function hatchLines(x1, y1, x2, y2, step, stroke, width, opacity) {
    var out = [];
    var st = step || 5;
    for (var y = y1; y <= y2; y += st) {
      out.push(
        '<line x1="' + x1 + '" y1="' + y.toFixed(1) + '" x2="' + x2 + '" y2="' + y.toFixed(1) +
        '" stroke="' + (stroke || PALETTE.woodblock_ink) + '" stroke-width="' + (width || 0.75) +
        '" opacity="' + (opacity || 0.22) + '"/>'
      );
    }
    return out.join("");
  }

  function diagHatch(cx, cy, size, step, stroke, opacity) {
    var out = [];
    var half = size / 2;
    for (var d = -size; d <= size; d += (step || 6)) {
      var ax = Math.max(cx - half, cx - half + d);
      var ay = Math.min(cy + half, cy + half + d);
      var bx = Math.min(cx + half, cx + half + d);
      var by = Math.max(cy - half, cy - half + d);
      if (ax <= cx + half && bx >= cx - half) {
        out.push(
          '<line x1="' + ax.toFixed(1) + '" y1="' + ay.toFixed(1) + '" x2="' + bx.toFixed(1) + '" y2="' + by.toFixed(1) +
          '" stroke="' + (stroke || PALETTE.woodblock_ink) + '" stroke-width="0.7" opacity="' + (opacity || 0.16) + '"/>'
        );
      }
    }
    return out.join("");
  }

  function forbiddenSaltire() {
    return (
      '<g class="xylo-svg-interdict">' +
        '<circle cx="80" cy="78" r="50" fill="none" stroke="#a62c1e" stroke-width="5"/>' +
        '<circle cx="80" cy="78" r="45.5" fill="none" stroke="#171310" stroke-width="1"/>' +
        '<line x1="44" y1="42" x2="116" y2="114" stroke="#a62c1e" stroke-width="6.5" stroke-linecap="square"/>' +
        '<line x1="46" y1="40" x2="118" y2="112" stroke="#171310" stroke-width="1.1"/>' +
        '<rect x="44" y="124" width="72" height="14" fill="#a62c1e" stroke="#171310" stroke-width="1"/>' +
        '<text x="80" y="134" text-anchor="middle" fill="#f3ead8" font-family="Georgia,serif" font-size="8.5" font-weight="bold" letter-spacing="1.4">VETITUM</text>' +
      '</g>'
    );
  }

  function lawfulSeal() {
    return (
      '<g class="xylo-svg-licet">' +
        '<path d="M32,108 C24,90 26,64 38,48 M128,108 C136,90 134,64 122,48" fill="none" stroke="#986d24" stroke-width="2.6" stroke-dasharray="5,2"/>' +
        '<rect x="44" y="123" width="72" height="15" fill="#f3ead8" stroke="#986d24" stroke-width="1.8"/>' +
        '<rect x="46" y="125" width="68" height="11" fill="none" stroke="#171310" stroke-width="0.8"/>' +
        '<text x="80" y="133.5" text-anchor="middle" fill="#a62c1e" font-family="Georgia,serif" font-size="8.5" font-weight="bold" letter-spacing="1.8">LICET</text>' +
      '</g>'
    );
  }

  var MOTIF_RENDERERS = {
    pincers: function () {
      return (
        hatchLines(18, 22, 142, 134, 6, "#171310", 0.65, 0.14) +
        '<path d="M18,22 L142,22 M80,14 L80,26" stroke="#171310" stroke-width="2.5"/>' +
        '<circle cx="80" cy="24" r="5" fill="none" stroke="#986d24" stroke-width="2"/>' +
        /* Extracted molar held in jaws */
        '<path d="M71,44 C71,36 89,36 89,44 L88,55 L83,65 L80,56 L77,65 L72,55 Z" fill="#f3ead8" stroke="#171310" stroke-width="2.2"/>' +
        '<path d="M75,41 C78,44 82,44 85,41" fill="none" stroke="#a62c1e" stroke-width="1.5"/>' +
        /* Crossed iron dental forceps */
        '<path d="M70,45 C56,46 54,65 69,74 L112,130 C116,135 122,132 118,126 L77,72 C65,64 66,51 73,48 Z" fill="#171310"/>' +
        '<path d="M90,45 C104,46 106,65 91,74 L48,130 C44,135 38,132 42,126 L83,72 C95,64 94,51 87,48 Z" fill="#171310"/>' +
        '<circle cx="80" cy="73" r="5.5" fill="#986d24" stroke="#171310" stroke-width="1.8"/>' +
        '<circle cx="80" cy="73" r="1.8" fill="#171310"/>' +
        '<text x="80" y="145" text-anchor="middle" fill="#a62c1e" font-family="Georgia,serif" font-size="8" font-weight="bold" letter-spacing="1.3">DENTARIUS</text>'
      );
    },

    tankard: function () {
      return (
        hatchLines(20, 24, 140, 134, 5.5, "#171310", 0.65, 0.14) +
        /* Foam crown */
        '<path d="M46,48 C44,38 55,34 62,39 C67,31 82,31 87,39 C95,34 106,39 103,49 Z" fill="#f3ead8" stroke="#171310" stroke-width="2"/>' +
        /* Hinged pewter thumb-lid lifted slightly */
        '<path d="M45,45 L103,37 L106,42 L46,50 Z" fill="#986d24" stroke="#171310" stroke-width="1.8"/>' +
        '<path d="M104,39 L114,31 L117,36 L106,43 Z" fill="#171310"/>' +
        /* Handle */
        '<path d="M103,58 C126,58 128,106 105,108" fill="none" stroke="#171310" stroke-width="6.5"/>' +
        '<path d="M103,58 C126,58 128,106 105,108" fill="none" stroke="#986d24" stroke-width="2.2"/>' +
        /* Tankard stave body */
        '<polygon points="48,50 102,50 108,124 42,124" fill="#e6d8be" stroke="#171310" stroke-width="2.6"/>' +
        '<line x1="61" y1="50" x2="58" y2="124" stroke="#171310" stroke-width="1.2"/>' +
        '<line x1="75" y1="50" x2="75" y2="124" stroke="#171310" stroke-width="1.2"/>' +
        '<line x1="89" y1="50" x2="92" y2="124" stroke="#171310" stroke-width="1.2"/>' +
        /* Iron hoops */
        '<rect x="46" y="62" width="58" height="6" fill="#171310"/>' +
        '<rect x="43" y="106" width="64" height="7" fill="#171310"/>' +
        '<circle cx="75" cy="85" r="9" fill="#a62c1e" stroke="#171310" stroke-width="1.5"/>' +
        '<text x="80" y="145" text-anchor="middle" fill="#a62c1e" font-family="Georgia,serif" font-size="8" font-weight="bold" letter-spacing="1.3">TABERNA</text>'
      );
    },

    halberds: function () {
      return (
        hatchLines(20, 22, 140, 134, 6, "#171310", 0.65, 0.14) +
        /* Crossed shafts */
        '<line x1="36" y1="132" x2="118" y2="26" stroke="#171310" stroke-width="4.2"/>' +
        '<line x1="124" y1="132" x2="42" y2="26" stroke="#171310" stroke-width="4.2"/>' +
        /* Left-top halberd head */
        '<polygon points="42,26 33,15 47,22" fill="#171310"/>' +
        '<path d="M48,34 C30,40 24,56 38,66 L57,46 Z" fill="#e6d8be" stroke="#171310" stroke-width="2.2"/>' +
        '<path d="M51,38 L66,29 L59,45 Z" fill="#a62c1e" stroke="#171310" stroke-width="1.4"/>' +
        /* Right-top halberd head */
        '<polygon points="118,26 127,15 113,22" fill="#171310"/>' +
        '<path d="M112,34 C130,40 136,56 122,66 L103,46 Z" fill="#e6d8be" stroke="#171310" stroke-width="2.2"/>' +
        '<path d="M109,38 L94,29 L101,45 Z" fill="#a62c1e" stroke="#171310" stroke-width="1.4"/>' +
        /* Central garrison boss & tassels */
        '<circle cx="80" cy="79" r="11" fill="#986d24" stroke="#171310" stroke-width="2.2"/>' +
        '<circle cx="80" cy="79" r="4" fill="#a62c1e"/>' +
        '<path d="M74,89 L69,106 M86,89 L91,106" stroke="#a62c1e" stroke-width="2.4"/>' +
        '<text x="80" y="145" text-anchor="middle" fill="#a62c1e" font-family="Georgia,serif" font-size="8" font-weight="bold" letter-spacing="1.3">CASTRA</text>'
      );
    },

    scales: function () {
      return (
        hatchLines(20, 22, 140, 134, 6, "#171310", 0.65, 0.14) +
        /* Suspension column & plumb pointer */
        '<line x1="80" y1="18" x2="80" y2="126" stroke="#171310" stroke-width="3"/>' +
        '<polygon points="62,126 98,126 92,118 68,118" fill="#171310"/>' +
        '<path d="M73,32 L80,52 L87,32 Z" fill="none" stroke="#a62c1e" stroke-width="1.6"/>' +
        /* Balance beam */
        '<path d="M28,48 Q80,42 132,48" fill="none" stroke="#171310" stroke-width="3.6"/>' +
        '<circle cx="80" cy="45" r="4.8" fill="#986d24" stroke="#171310" stroke-width="1.6"/>' +
        /* Left pan & chains */
        '<line x1="32" y1="48" x2="20" y2="92" stroke="#171310" stroke-width="1.3"/>' +
        '<line x1="32" y1="48" x2="44" y2="92" stroke="#171310" stroke-width="1.3"/>' +
        '<path d="M16,92 Q32,107 48,92 Z" fill="#986d24" stroke="#171310" stroke-width="2"/>' +
        '<rect x="27" y="83" width="10" height="9" fill="#171310"/>' +
        /* Right pan & chains */
        '<line x1="128" y1="48" x2="116" y2="92" stroke="#171310" stroke-width="1.3"/>' +
        '<line x1="128" y1="48" x2="140" y2="92" stroke="#171310" stroke-width="1.3"/>' +
        '<path d="M112,92 Q128,107 144,92 Z" fill="#986d24" stroke="#171310" stroke-width="2"/>' +
        '<path d="M118,92 Q128,77 138,92 Z" fill="#a62c1e" stroke="#171310" stroke-width="1.2"/>' +
        '<text x="80" y="145" text-anchor="middle" fill="#a62c1e" font-family="Georgia,serif" font-size="8" font-weight="bold" letter-spacing="1.3">MACERIUS</text>'
      );
    },

    lion: function () {
      return (
        diagHatch(80, 78, 120, 6, "#171310", 0.14) +
        /* Escutcheon shield */
        '<path d="M34,24 L126,24 L126,76 C126,108 102,124 80,134 C58,124 34,108 34,76 Z" fill="#e6d8be" stroke="#171310" stroke-width="3"/>' +
        '<path d="M40,30 L120,30 L120,75 C120,102 99,117 80,126 C61,117 40,102 40,75 Z" fill="none" stroke="#986d24" stroke-width="1.4"/>' +
        /* Rampant heraldic lion silhouette */
        '<polygon points="65,42 70,35 75,41 80,34 85,41 88,36 87,45" fill="#986d24" stroke="#171310" stroke-width="1.2"/>' +
        '<path d="M68,46 C60,46 57,55 63,61 L51,68 L54,74 L66,69 L65,86 L54,106 L62,109 L73,92 L82,94 L89,111 L97,108 L89,88 C95,78 94,64 86,56 C90,51 87,44 79,45 Z" fill="#a62c1e" stroke="#171310" stroke-width="1.8"/>' +
        /* Forked tail */
        '<path d="M88,84 C106,82 110,56 98,46 C104,42 110,48 106,56" fill="none" stroke="#171310" stroke-width="2.4"/>' +
        /* Recursive mini-shield bearing lion mark */
        '<path d="M97,88 L113,88 L113,99 C113,105 105,110 105,110 C105,110 97,105 97,99 Z" fill="#f3ead8" stroke="#171310" stroke-width="1.4"/>' +
        '<circle cx="105" cy="97" r="3.2" fill="#a62c1e"/>' +
        '<text x="80" y="146" text-anchor="middle" fill="#171310" font-family="Georgia,serif" font-size="7.5" font-weight="bold" letter-spacing="1.1">SIGNUM LEONIS</text>'
      );
    },

    dolphin: function () {
      return (
        diagHatch(80, 78, 120, 6, "#171310", 0.14) +
        '<path d="M34,24 L126,24 L126,76 C126,108 102,124 80,134 C58,124 34,108 34,76 Z" fill="#e6d8be" stroke="#171310" stroke-width="3"/>' +
        /* Classical embowed heraldic dolphin */
        '<path d="M54,64 C52,44 78,34 96,46 C112,56 108,82 90,92 C78,99 74,107 84,113 L74,118 L68,109 L59,115 C61,102 68,92 80,86 C93,79 94,61 83,55 C72,49 62,56 64,66 L50,69 Z" fill="#171310"/>' +
        '<path d="M72,39 L78,30 L84,40 L91,33 L94,44" fill="#a62c1e" stroke="#171310" stroke-width="1.2"/>' +
        '<circle cx="61" cy="57" r="2.3" fill="#f3ead8"/>' +
        /* Engraved wave scrolls */
        '<path d="M45,98 Q56,92 66,98 T88,98 T110,98" fill="none" stroke="#986d24" stroke-width="1.8"/>' +
        /* Recursive mini-shield */
        '<path d="M98,29 L116,29 L116,42 C116,49 107,54 107,54 C107,54 98,49 98,42 Z" fill="#f3ead8" stroke="#171310" stroke-width="1.4"/>' +
        '<path d="M103,41 Q108,34 111,42 Q107,46 105,49" fill="none" stroke="#a62c1e" stroke-width="1.8"/>' +
        '<text x="80" y="146" text-anchor="middle" fill="#171310" font-family="Georgia,serif" font-size="7.5" font-weight="bold" letter-spacing="1.1">SIGNUM DELPHINI</text>'
      );
    },

    tower: function () {
      return (
        diagHatch(80, 78, 120, 6, "#171310", 0.14) +
        '<path d="M34,24 L126,24 L126,76 C126,108 102,124 80,134 C58,124 34,108 34,76 Z" fill="#e6d8be" stroke="#171310" stroke-width="3"/>' +
        /* Crenellated tower inside shield */
        '<polygon points="54,44 62,44 62,51 70,51 70,44 78,44 78,51 86,51 86,44 94,44 94,51 102,51 102,44 106,44 109,112 51,112" fill="#f3ead8" stroke="#171310" stroke-width="2.4"/>' +
        '<line x1="53" y1="64" x2="107" y2="64" stroke="#171310" stroke-width="1.4"/>' +
        '<line x1="52" y1="84" x2="108" y2="84" stroke="#171310" stroke-width="1.4"/>' +
        '<rect x="65" y="54" width="5" height="8" fill="#171310"/>' +
        '<rect x="90" y="54" width="5" height="8" fill="#171310"/>' +
        /* Portcullis arch */
        '<path d="M70,112 L70,94 A10,10 0 0,1 90,94 L90,112 Z" fill="#171310"/>' +
        '<line x1="76" y1="88" x2="76" y2="112" stroke="#986d24" stroke-width="1.2"/>' +
        '<line x1="84" y1="88" x2="84" y2="112" stroke="#986d24" stroke-width="1.2"/>' +
        /* Recursive banner on turret bearing mini tower */
        '<line x1="80" y1="28" x2="80" y2="44" stroke="#171310" stroke-width="1.8"/>' +
        '<polygon points="80,28 103,31 99,39 80,39" fill="#a62c1e" stroke="#171310" stroke-width="1.1"/>' +
        '<rect x="87" y="31" width="5" height="6" fill="#f3ead8"/>' +
        '<text x="80" y="146" text-anchor="middle" fill="#171310" font-family="Georgia,serif" font-size="7.5" font-weight="bold" letter-spacing="1.1">SIGNUM TURRIS</text>'
      );
    },

    star: function () {
      return (
        diagHatch(80, 78, 120, 6, "#171310", 0.14) +
        '<path d="M34,24 L126,24 L126,76 C126,108 102,124 80,134 C58,124 34,108 34,76 Z" fill="#e6d8be" stroke="#171310" stroke-width="3"/>' +
        /* Eight-pointed heraldic star */
        '<polygon points="80,33 88,63 118,55 96,77 118,99 88,91 80,121 72,91 42,99 64,77 42,55 72,63" fill="#986d24" stroke="#171310" stroke-width="2"/>' +
        '<polygon points="80,44 85,68 109,77 85,86 80,110 75,86 51,77 75,68" fill="#a62c1e" stroke="#171310" stroke-width="1.5"/>' +
        /* Recursive inner cartouche with miniature star */
        '<circle cx="80" cy="77" r="11" fill="#f3ead8" stroke="#171310" stroke-width="1.6"/>' +
        '<polygon points="80,68 82.5,74.5 89,77 82.5,79.5 80,86 77.5,79.5 71,77 77.5,74.5" fill="#171310"/>' +
        '<text x="80" y="146" text-anchor="middle" fill="#171310" font-family="Georgia,serif" font-size="7.5" font-weight="bold" letter-spacing="1.1">SIGNUM STELLAE</text>'
      );
    },

    no_wagons_alley: function () {
      return (
        hatchLines(22, 22, 138, 120, 6, "#171310", 0.65, 0.14) +
        /* Narrow stone alley walls & arch */
        '<path d="M32,116 L32,34 L54,48 L54,110 M128,116 L128,34 L106,48 L106,110" fill="none" stroke="#171310" stroke-width="2.4"/>' +
        '<path d="M32,42 A48,28 0 0,1 128,42" fill="none" stroke="#171310" stroke-width="2.6"/>' +
        /* Wagon box, shaft, and spoked cartwheel */
        '<rect x="46" y="64" width="54" height="22" fill="#e6d8be" stroke="#171310" stroke-width="2.2"/>' +
        '<line x1="100" y1="80" x2="122" y2="74" stroke="#171310" stroke-width="3"/>' +
        '<circle cx="72" cy="90" r="17" fill="#f3ead8" stroke="#171310" stroke-width="3"/>' +
        '<circle cx="72" cy="90" r="4" fill="#171310"/>' +
        '<line x1="72" y1="73" x2="72" y2="107" stroke="#171310" stroke-width="1.6"/>' +
        '<line x1="55" y1="90" x2="89" y2="90" stroke="#171310" stroke-width="1.6"/>' +
        '<line x1="60" y1="78" x2="84" y2="102" stroke="#171310" stroke-width="1.6"/>' +
        '<line x1="84" y1="78" x2="60" y2="102" stroke="#171310" stroke-width="1.6"/>' +
        forbiddenSaltire()
      );
    },

    no_urinate_kiosk: function () {
      return (
        hatchLines(22, 22, 138, 120, 6, "#171310", 0.65, 0.14) +
        /* Octagonal domed street kiosk */
        '<path d="M48,58 C48,38 92,38 92,58 Z" fill="#986d24" stroke="#171310" stroke-width="2.2"/>' +
        '<line x1="70" y1="34" x2="70" y2="43" stroke="#171310" stroke-width="2.4"/>' +
        '<rect x="44" y="58" width="52" height="5" fill="#171310"/>' +
        '<rect x="48" y="63" width="44" height="44" fill="#e6d8be" stroke="#171310" stroke-width="2.2"/>' +
        '<line x1="62" y1="63" x2="62" y2="107" stroke="#171310" stroke-width="1.4"/>' +
        '<line x1="78" y1="63" x2="78" y2="107" stroke="#171310" stroke-width="1.4"/>' +
        /* Behind-kiosk shadow corner & forbidden splash arc */
        '<polygon points="92,70 112,64 112,107 92,107" fill="#171310" opacity="0.25"/>' +
        '<path d="M114,76 Q100,82 96,104" fill="none" stroke="#171310" stroke-width="2.2" stroke-dasharray="3,2"/>' +
        '<ellipse cx="101" cy="107" rx="10" ry="3" fill="#171310"/>' +
        forbiddenSaltire()
      );
    },

    no_fishing_bridge: function () {
      return (
        hatchLines(22, 22, 138, 120, 6, "#171310", 0.65, 0.14) +
        /* Arched masonry bridge */
        '<path d="M32,84 L128,84 L128,98 Q80,70 32,98 Z" fill="#e6d8be" stroke="#171310" stroke-width="2.4"/>' +
        '<line x1="34" y1="78" x2="126" y2="78" stroke="#171310" stroke-width="2"/>' +
        /* River waves */
        '<path d="M36,106 Q50,101 64,106 T92,106 T122,106" fill="none" stroke="#171310" stroke-width="1.8"/>' +
        /* Angled fishing pole, line, and barbed hook */
        '<line x1="48" y1="78" x2="112" y2="38" stroke="#171310" stroke-width="3"/>' +
        '<line x1="112" y1="38" x2="112" y2="96" stroke="#171310" stroke-width="1.3"/>' +
        '<path d="M112,96 C112,104 103,104 104,97 L107,100" fill="none" stroke="#171310" stroke-width="2"/>' +
        forbiddenSaltire()
      );
    },

    water_zebras: function () {
      return (
        hatchLines(22, 22, 138, 120, 6, "#171310", 0.65, 0.14) +
        /* Civic stone water trough & spout */
        '<rect x="30" y="88" width="44" height="22" fill="#e6d8be" stroke="#171310" stroke-width="2.2"/>' +
        '<path d="M34,93 Q52,89 70,93" fill="none" stroke="#a62c1e" stroke-width="1.6"/>' +
        '<path d="M36,68 L48,68 L48,74 M46,74 Q48,82 46,90" fill="none" stroke="#171310" stroke-width="2"/>' +
        /* Striped zebra bowing head to trough */
        '<path d="M62,90 L70,66 L82,58 L84,65 L120,65 C126,65 128,74 126,84 L124,110 L118,110 L118,86 L92,86 L90,110 L84,110 L85,82 L72,92 Z" fill="#f3ead8" stroke="#171310" stroke-width="2.2"/>' +
        /* Bold woodcut zebra stripes */
        '<path d="M74,66 L80,76 M80,62 L87,78 M92,65 L90,85 M100,65 L98,85 M108,65 L107,85 M116,65 L117,85" stroke="#171310" stroke-width="2.8"/>' +
        lawfulSeal()
      );
    },

    play_bowls: function () {
      return (
        hatchLines(22, 22, 138, 120, 6, "#171310", 0.65, 0.14) +
        /* Perspective bowling alley court */
        '<polygon points="48,44 112,44 132,114 28,114" fill="#e6d8be" stroke="#171310" stroke-width="2"/>' +
        '<path d="M52,102 Q72,76 92,58" fill="none" stroke="#a62c1e" stroke-width="1.8" stroke-dasharray="4,3"/>' +
        /* Small target jack sphere */
        '<circle cx="96" cy="55" r="5" fill="#f3ead8" stroke="#171310" stroke-width="2"/>' +
        /* Biased wooden bowls with engraved bias rings */
        '<circle cx="52" cy="96" r="14" fill="#171310"/>' +
        '<circle cx="49" cy="93" r="6" fill="none" stroke="#986d24" stroke-width="1.8"/>' +
        '<circle cx="98" cy="88" r="12" fill="#171310"/>' +
        '<circle cx="95" cy="85" r="5" fill="none" stroke="#f3ead8" stroke-width="1.5"/>' +
        '<circle cx="73" cy="74" r="10" fill="#986d24" stroke="#171310" stroke-width="2"/>' +
        lawfulSeal()
      );
    },

    burn_corpses: function () {
      return (
        hatchLines(22, 22, 138, 120, 6, "#171310", 0.65, 0.14) +
        /* Stacked timber funerary pyre */
        '<rect x="36" y="102" width="88" height="8" fill="#171310"/>' +
        '<rect x="42" y="92" width="76" height="8" fill="#e6d8be" stroke="#171310" stroke-width="2"/>' +
        '<rect x="48" y="82" width="64" height="8" fill="#171310"/>' +
        /* Shrouded relative effigy atop bier */
        '<path d="M52,82 C52,72 64,71 72,74 L106,75 C110,76 110,82 106,82 Z" fill="#f3ead8" stroke="#171310" stroke-width="2"/>' +
        /* Engraved rising flame tongues */
        '<path d="M54,73 C48,56 62,48 58,34 C68,44 70,56 66,73 Z" fill="#a62c1e" stroke="#171310" stroke-width="1.5"/>' +
        '<path d="M76,73 C70,50 86,40 80,24 C94,38 92,55 88,73 Z" fill="#986d24" stroke="#171310" stroke-width="1.6"/>' +
        '<path d="M96,74 C92,58 106,50 102,36 C112,48 110,60 106,74 Z" fill="#a62c1e" stroke="#171310" stroke-width="1.5"/>' +
        lawfulSeal()
      );
    },

    cornucopia: function () {
      return (
        hatchLines(20, 22, 140, 134, 6, "#171310", 0.65, 0.14) +
        /* Temple portal pediment & columns */
        '<polygon points="24,42 80,18 136,42" fill="#e6d8be" stroke="#171310" stroke-width="2.4"/>' +
        '<rect x="30" y="42" width="10" height="88" fill="#f3ead8" stroke="#171310" stroke-width="2"/>' +
        '<rect x="120" y="42" width="10" height="88" fill="#f3ead8" stroke="#171310" stroke-width="2"/>' +
        /* Spiraled Cornucopia overflowing with fruit & grain */
        '<path d="M52,66 C52,50 76,48 84,62 C92,76 108,82 110,98 C112,110 96,116 90,104 C86,96 76,94 64,92 C52,90 52,76 52,66 Z" fill="#986d24" stroke="#171310" stroke-width="2.4"/>' +
        '<ellipse cx="58" cy="74" rx="11" ry="16" fill="#171310"/>' +
        '<circle cx="54" cy="68" r="6" fill="#a62c1e" stroke="#f3ead8" stroke-width="1"/>' +
        '<circle cx="62" cy="77" r="5.5" fill="#986d24" stroke="#f3ead8" stroke-width="1"/>' +
        '<circle cx="52" cy="82" r="5" fill="#f3ead8" stroke="#171310" stroke-width="1"/>' +
        '<path d="M48,62 L38,52 M54,59 L46,46" stroke="#986d24" stroke-width="2.2"/>' +
        '<text x="80" y="145" text-anchor="middle" fill="#a62c1e" font-family="Georgia,serif" font-size="7.8" font-weight="bold" letter-spacing="1.2">TEMPLUM: CORNUCOPIA</text>'
      );
    },

    hourglass: function () {
      return (
        hatchLines(20, 22, 140, 134, 6, "#171310", 0.65, 0.14) +
        '<polygon points="24,42 80,18 136,42" fill="#e6d8be" stroke="#171310" stroke-width="2.4"/>' +
        '<rect x="30" y="42" width="10" height="88" fill="#f3ead8" stroke="#171310" stroke-width="2"/>' +
        '<rect x="120" y="42" width="10" height="88" fill="#f3ead8" stroke="#171310" stroke-width="2"/>' +
        /* Divine Hourglass attribute */
        '<rect x="54" y="48" width="52" height="6" fill="#171310"/>' +
        '<rect x="54" y="116" width="52" height="6" fill="#171310"/>' +
        '<line x1="58" y1="54" x2="58" y2="116" stroke="#986d24" stroke-width="2.4"/>' +
        '<line x1="102" y1="54" x2="102" y2="116" stroke="#986d24" stroke-width="2.4"/>' +
        '<path d="M62,54 C62,74 77,82 80,85 C83,82 98,74 98,54 Z" fill="#f3ead8" stroke="#171310" stroke-width="2"/>' +
        '<path d="M62,116 C62,96 77,88 80,85 C83,88 98,96 98,116 Z" fill="#f3ead8" stroke="#171310" stroke-width="2"/>' +
        '<polygon points="68,68 92,68 80,83" fill="#986d24"/>' +
        '<line x1="80" y1="84" x2="80" y2="106" stroke="#a62c1e" stroke-width="1.8" stroke-dasharray="2,2"/>' +
        '<polygon points="65,115 95,115 80,103" fill="#986d24"/>' +
        '<text x="80" y="145" text-anchor="middle" fill="#a62c1e" font-family="Georgia,serif" font-size="7.8" font-weight="bold" letter-spacing="1.2">TEMPLUM: CLEPSYDRA</text>'
      );
    },

    medusa: function () {
      return (
        hatchLines(20, 22, 140, 134, 6, "#171310", 0.65, 0.14) +
        '<polygon points="24,42 80,18 136,42" fill="#e6d8be" stroke="#171310" stroke-width="2.4"/>' +
        '<rect x="30" y="42" width="10" height="88" fill="#f3ead8" stroke="#171310" stroke-width="2"/>' +
        '<rect x="120" y="42" width="10" height="88" fill="#f3ead8" stroke="#171310" stroke-width="2"/>' +
        /* Gorgoneion Medusa head & writhing snakes */
        '<path d="M64,66 C48,54 50,44 62,48 M96,66 C112,54 110,44 98,48 M60,78 C42,74 44,62 54,64 M100,78 C118,74 116,62 106,64 M62,92 C44,98 46,112 58,106 M98,92 C116,98 114,112 102,106 M72,58 C68,44 80,42 80,54 M88,58 C92,44 102,48 94,58" fill="none" stroke="#171310" stroke-width="3.2" stroke-linecap="round"/>' +
        '<circle cx="80" cy="82" r="20" fill="#e6d8be" stroke="#171310" stroke-width="2.4"/>' +
        '<ellipse cx="73" cy="78" rx="4" ry="2.6" fill="#a62c1e" stroke="#171310" stroke-width="1.2"/>' +
        '<ellipse cx="87" cy="78" rx="4" ry="2.6" fill="#a62c1e" stroke="#171310" stroke-width="1.2"/>' +
        '<path d="M72,91 Q80,97 88,91" fill="none" stroke="#171310" stroke-width="2.2"/>' +
        '<path d="M78,94 L80,101 L82,94 Z" fill="#a62c1e"/>' +
        '<text x="80" y="145" text-anchor="middle" fill="#a62c1e" font-family="Georgia,serif" font-size="7.8" font-weight="bold" letter-spacing="1.2">TEMPLUM: MEDUSA</text>'
      );
    },

    palace: function () {
      return (
        hatchLines(18, 20, 142, 130, 5, "#171310", 0.6, 0.12) +
        /* Sovereign unmarked Palace: architectural symmetry & rank I */
        '<rect x="24" y="38" width="112" height="88" fill="#e6d8be" stroke="#171310" stroke-width="2.6"/>' +
        '<polygon points="48,38 80,20 112,38" fill="#f3ead8" stroke="#171310" stroke-width="2.2"/>' +
        /* Balustrade crown */
        '<line x1="22" y1="38" x2="138" y2="38" stroke="#171310" stroke-width="3.5"/>' +
        '<line x1="24" y1="74" x2="136" y2="74" stroke="#986d24" stroke-width="2"/>' +
        /* Piano nobile arched windows */
        '<path d="M36,70 L36,52 A6,6 0 0,1 48,52 L48,70 Z M62,70 L62,50 A8,8 0 0,1 78,50 L78,70 Z M82,70 L82,50 A8,8 0 0,1 98,50 L98,70 Z M112,70 L112,52 A6,6 0 0,1 124,52 L124,70 Z" fill="#171310"/>' +
        /* Rusticated ashlar portal */
        '<path d="M66,126 L66,94 A14,14 0 0,1 94,94 L94,126 Z" fill="#171310"/>' +
        '<line x1="24" y1="90" x2="66" y2="90" stroke="#171310" stroke-width="1.2"/>' +
        '<line x1="94" y1="90" x2="136" y2="90" stroke="#171310" stroke-width="1.2"/>' +
        '<line x1="24" y1="108" x2="66" y2="108" stroke="#171310" stroke-width="1.2"/>' +
        '<line x1="94" y1="108" x2="136" y2="108" stroke="#171310" stroke-width="1.2"/>' +
        '<text x="80" y="145" text-anchor="middle" fill="#171310" font-family="Georgia,serif" font-size="7.5" font-weight="bold" letter-spacing="1.2">ORDO I · PALATIUM</text>'
      );
    },

    prison: function () {
      return (
        hatchLines(18, 20, 142, 130, 4, "#171310", 0.75, 0.22) +
        /* Battered cyclopean unmarked Prison wall */
        '<polygon points="34,30 126,30 136,126 24,126" fill="#e6d8be" stroke="#171310" stroke-width="3.2"/>' +
        hatchLines(30, 34, 130, 122, 6, "#171310", 1.0, 0.28) +
        /* Tiny high barred slits */
        '<rect x="46" y="44" width="14" height="14" fill="#171310"/>' +
        '<line x1="53" y1="44" x2="53" y2="58" stroke="#f3ead8" stroke-width="1.5"/>' +
        '<rect x="73" y="44" width="14" height="14" fill="#171310"/>' +
        '<line x1="80" y1="44" x2="80" y2="58" stroke="#f3ead8" stroke-width="1.5"/>' +
        '<rect x="100" y="44" width="14" height="14" fill="#171310"/>' +
        '<line x1="107" y1="44" x2="107" y2="58" stroke="#f3ead8" stroke-width="1.5"/>' +
        /* Low recessed iron-studded gate */
        '<rect x="68" y="96" width="24" height="30" fill="#171310"/>' +
        '<line x1="68" y1="106" x2="92" y2="106" stroke="#986d24" stroke-width="1.6"/>' +
        '<line x1="68" y1="116" x2="92" y2="116" stroke="#986d24" stroke-width="1.6"/>' +
        '<text x="80" y="145" text-anchor="middle" fill="#171310" font-family="Georgia,serif" font-size="7.5" font-weight="bold" letter-spacing="1.2">ORDO II · CARCER</text>'
      );
    },

    mint: function () {
      return (
        hatchLines(18, 20, 142, 130, 5, "#171310", 0.6, 0.14) +
        /* Twin smelting/assay chimneys */
        '<rect x="40" y="22" width="12" height="20" fill="#171310"/>' +
        '<rect x="108" y="22" width="12" height="20" fill="#171310"/>' +
        /* Fortified Mint treasury block */
        '<rect x="28" y="42" width="104" height="84" fill="#e6d8be" stroke="#171310" stroke-width="2.8"/>' +
        /* Diamond-bossed masonry & central round die-oculus */
        '<circle cx="80" cy="68" r="15" fill="#986d24" stroke="#171310" stroke-width="2.4"/>' +
        '<circle cx="80" cy="68" r="9" fill="none" stroke="#171310" stroke-width="1.4" stroke-dasharray="3,2"/>' +
        '<rect x="36" y="52" width="18" height="18" fill="none" stroke="#171310" stroke-width="1.5"/>' +
        '<rect x="106" y="52" width="18" height="18" fill="none" stroke="#171310" stroke-width="1.5"/>' +
        '<rect x="64" y="94" width="32" height="32" fill="#171310"/>' +
        '<circle cx="80" cy="110" r="6" fill="none" stroke="#986d24" stroke-width="1.8"/>' +
        '<text x="80" y="145" text-anchor="middle" fill="#171310" font-family="Georgia,serif" font-size="7.5" font-weight="bold" letter-spacing="1.2">ORDO III · MONETA</text>'
      );
    },

    pythagorean_school: function () {
      return (
        hatchLines(18, 20, 142, 130, 5.5, "#171310", 0.6, 0.12) +
        /* Harmonic pediment bearing the Tetractys (1+2+3+4 = 10 points) */
        '<polygon points="22,56 80,20 138,56" fill="#f3ead8" stroke="#171310" stroke-width="2.6"/>' +
        '<circle cx="80" cy="29" r="2.2" fill="#a62c1e"/>' +
        '<circle cx="75" cy="36" r="2.2" fill="#171310"/><circle cx="85" cy="36" r="2.2" fill="#171310"/>' +
        '<circle cx="70" cy="43" r="2.2" fill="#171310"/><circle cx="80" cy="43" r="2.2" fill="#171310"/><circle cx="90" cy="43" r="2.2" fill="#171310"/>' +
        '<circle cx="65" cy="50" r="2.2" fill="#986d24"/><circle cx="75" cy="50" r="2.2" fill="#986d24"/><circle cx="85" cy="50" r="2.2" fill="#986d24"/><circle cx="95" cy="50" r="2.2" fill="#986d24"/>' +
        /* Golden-ratio Doric peristyle */
        '<rect x="30" y="56" width="10" height="64" fill="#e6d8be" stroke="#171310" stroke-width="2"/>' +
        '<rect x="58" y="56" width="10" height="64" fill="#e6d8be" stroke="#171310" stroke-width="2"/>' +
        '<rect x="92" y="56" width="10" height="64" fill="#e6d8be" stroke="#171310" stroke-width="2"/>' +
        '<rect x="120" y="56" width="10" height="64" fill="#e6d8be" stroke="#171310" stroke-width="2"/>' +
        '<rect x="22" y="120" width="116" height="7" fill="#171310"/>' +
        '<text x="80" y="145" text-anchor="middle" fill="#171310" font-family="Georgia,serif" font-size="7.2" font-weight="bold" letter-spacing="1.0">ORDO IV · SCHOLA PYTH.</text>'
      );
    },

    brothel: function () {
      return (
        hatchLines(18, 20, 142, 130, 5.5, "#171310", 0.6, 0.14) +
        /* Overhanging shuttered jalousie house */
        '<rect x="34" y="76" width="92" height="50" fill="#e6d8be" stroke="#171310" stroke-width="2.2"/>' +
        '<rect x="26" y="34" width="108" height="44" fill="#f3ead8" stroke="#171310" stroke-width="2.4"/>' +
        /* Louvered shutters */
        '<rect x="38" y="42" width="24" height="28" fill="#e6d8be" stroke="#171310" stroke-width="1.8"/>' +
        '<line x1="38" y1="49" x2="62" y2="49" stroke="#171310" stroke-width="1.2"/>' +
        '<line x1="38" y1="56" x2="62" y2="56" stroke="#171310" stroke-width="1.2"/>' +
        '<line x1="38" y1="63" x2="62" y2="63" stroke="#171310" stroke-width="1.2"/>' +
        '<rect x="98" y="42" width="24" height="28" fill="#e6d8be" stroke="#171310" stroke-width="1.8"/>' +
        '<line x1="98" y1="49" x2="122" y2="49" stroke="#171310" stroke-width="1.2"/>' +
        '<line x1="98" y1="56" x2="122" y2="56" stroke="#171310" stroke-width="1.2"/>' +
        '<line x1="98" y1="63" x2="122" y2="63" stroke="#171310" stroke-width="1.2"/>' +
        /* Draped curtain doorway & scalloped awning */
        '<path d="M64,126 L64,86 L96,86 L96,126 Z" fill="#171310"/>' +
        '<path d="M64,86 C78,96 74,112 67,126 M96,86 C82,96 86,112 93,126" fill="none" stroke="#a62c1e" stroke-width="3.2"/>' +
        '<circle cx="80" cy="56" r="6" fill="#a62c1e" stroke="#171310" stroke-width="1.5"/>' +
        '<text x="80" y="145" text-anchor="middle" fill="#171310" font-family="Georgia,serif" font-size="7.5" font-weight="bold" letter-spacing="1.2">ORDO V · LUPANAR</text>'
      );
    },

    headband: function () {
      return (
        hatchLines(20, 22, 140, 130, 6, "#171310", 0.6, 0.13) +
        /* Velvet stall cushion */
        '<path d="M28,96 Q80,82 132,96 Q80,118 28,96 Z" fill="#e6d8be" stroke="#171310" stroke-width="2"/>' +
        /* Embroidered headband diadem */
        '<ellipse cx="80" cy="72" rx="44" ry="20" fill="none" stroke="#171310" stroke-width="9"/>' +
        '<ellipse cx="80" cy="72" rx="44" ry="20" fill="none" stroke="#986d24" stroke-width="5.5"/>' +
        '<ellipse cx="80" cy="72" rx="44" ry="20" fill="none" stroke="#a62c1e" stroke-width="2" stroke-dasharray="4,4"/>' +
        '<circle cx="80" cy="52" r="6.5" fill="#a62c1e" stroke="#171310" stroke-width="1.6"/>' +
        '<circle cx="58" cy="56" r="4" fill="#f3ead8" stroke="#171310" stroke-width="1.3"/>' +
        '<circle cx="102" cy="56" r="4" fill="#f3ead8" stroke="#171310" stroke-width="1.3"/>' +
        '<rect x="34" y="122" width="92" height="15" fill="#171310"/>' +
        '<text x="80" y="132.5" text-anchor="middle" fill="#f3ead8" font-family="Georgia,serif" font-size="8" font-weight="bold" letter-spacing="1.4">= ELEGANTIA</text>'
      );
    },

    palanquin: function () {
      return (
        hatchLines(20, 22, 140, 130, 6, "#171310", 0.6, 0.13) +
        /* Long carrying poles */
        '<line x1="16" y1="92" x2="144" y2="92" stroke="#171310" stroke-width="4"/>' +
        '<circle cx="18" cy="92" r="3.5" fill="#986d24" stroke="#171310" stroke-width="1.2"/>' +
        '<circle cx="142" cy="92" r="3.5" fill="#986d24" stroke="#171310" stroke-width="1.2"/>' +
        /* Gilded palanquin litter dome & curtains */
        '<path d="M46,54 C46,32 114,32 114,54 Z" fill="#986d24" stroke="#171310" stroke-width="2.4"/>' +
        '<polygon points="80,22 85,34 75,34" fill="#a62c1e" stroke="#171310" stroke-width="1.3"/>' +
        '<rect x="48" y="54" width="64" height="44" fill="#f3ead8" stroke="#171310" stroke-width="2.4"/>' +
        '<path d="M48,54 Q68,74 56,98 M112,54 Q92,74 104,98" fill="#a62c1e" stroke="#171310" stroke-width="1.8"/>' +
        '<rect x="44" y="98" width="72" height="7" fill="#986d24" stroke="#171310" stroke-width="1.8"/>' +
        '<rect x="34" y="122" width="92" height="15" fill="#171310"/>' +
        '<text x="80" y="132.5" text-anchor="middle" fill="#f3ead8" font-family="Georgia,serif" font-size="8" font-weight="bold" letter-spacing="1.4">= POTESTAS</text>'
      );
    },

    averroes: function () {
      return (
        hatchLines(20, 22, 140, 130, 6, "#171310", 0.6, 0.13) +
        /* Stacked folio volumes & open commentary tome of Averroes */
        '<rect x="34" y="94" width="92" height="12" fill="#986d24" stroke="#171310" stroke-width="2"/>' +
        '<rect x="38" y="82" width="84" height="12" fill="#e6d8be" stroke="#171310" stroke-width="2"/>' +
        /* Open volume on lectern */
        '<path d="M36,78 L36,40 Q58,34 80,44 Q102,34 124,40 L124,78 Q102,72 80,82 Q58,72 36,78 Z" fill="#f3ead8" stroke="#171310" stroke-width="2.4"/>' +
        '<line x1="80" y1="44" x2="80" y2="82" stroke="#171310" stroke-width="2"/>' +
        '<path d="M44,50 L72,52 M44,58 L72,60 M44,66 L72,68 M88,52 L116,50 M88,60 L116,58 M88,68 L116,66" stroke="#171310" stroke-width="1.4"/>' +
        '<rect x="44" y="46" width="8" height="8" fill="#a62c1e"/>' +
        '<rect x="34" y="122" width="92" height="15" fill="#171310"/>' +
        '<text x="80" y="132.5" text-anchor="middle" fill="#f3ead8" font-family="Georgia,serif" font-size="8" font-weight="bold" letter-spacing="1.4">= DOCTRINA</text>'
      );
    },

    anklet: function () {
      return (
        hatchLines(20, 22, 140, 130, 6, "#171310", 0.6, 0.13) +
        /* Gilt ankle bracelet ring with suspended chime bells */
        '<ellipse cx="80" cy="68" rx="38" ry="24" fill="none" stroke="#171310" stroke-width="7"/>' +
        '<ellipse cx="80" cy="68" rx="38" ry="24" fill="none" stroke="#986d24" stroke-width="4"/>' +
        /* Hanging charm bells */
        '<circle cx="50" cy="88" r="5.5" fill="#986d24" stroke="#171310" stroke-width="1.6"/>' +
        '<circle cx="65" cy="96" r="6" fill="#a62c1e" stroke="#171310" stroke-width="1.6"/>' +
        '<circle cx="80" cy="99" r="6.8" fill="#986d24" stroke="#171310" stroke-width="1.8"/>' +
        '<circle cx="95" cy="96" r="6" fill="#a62c1e" stroke="#171310" stroke-width="1.6"/>' +
        '<circle cx="110" cy="88" r="5.5" fill="#986d24" stroke="#171310" stroke-width="1.6"/>' +
        '<line x1="80" y1="97" x2="80" y2="105" stroke="#171310" stroke-width="1.4"/>' +
        '<rect x="34" y="122" width="92" height="15" fill="#171310"/>' +
        '<text x="80" y="132.5" text-anchor="middle" fill="#f3ead8" font-family="Georgia,serif" font-size="8" font-weight="bold" letter-spacing="1.2">= VOLUPTAS</text>'
      );
    }
  };

  function toRoman(num) {
    var n = Math.max(1, Math.floor(num));
    var map = [
      [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
      [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
    ];
    var out = "";
    for (var i = 0; i < map.length; i++) {
      while (n >= map[i][0]) {
        out += map[i][1];
        n -= map[i][0];
      }
    }
    return out;
  }

  function renderPeelOverlaySVG(item, depth) {
    var d = Math.max(0, Math.floor(depth || 0));
    if (d <= 0) return "";
    /* Torn parchment peel corner grows with depth, revealing NEVER raw stone/wood,
       only ruled rubricated codex taxonomy & notary seals underneath. */
    var span = Math.min(122, 42 + d * 18);
    var xCut = 152 - span;
    var yCut = 8 + span;
    var curlX = Math.max(14, xCut - 10);
    var curlY = Math.min(146, yCut - 12);
    var romanD = toRoman(d);
    var codeStr = "COD." + item.codePrefix + "." + romanD;

    var ruled = [];
    for (var ry = 18; ry < yCut - 4; ry += 9) {
      var startX = Math.max(xCut + 8, 152 - (ry - 8) * 0.94);
      if (startX < 146) {
        ruled.push(
          '<line x1="' + startX.toFixed(1) + '" y1="' + ry + '" x2="146" y2="' + ry +
          '" stroke="#a62c1e" stroke-width="0.9" stroke-dasharray="6,2" opacity="0.82"/>'
        );
      }
    }

    return (
      '<g class="xylo-svg-peel-stratum" data-peel-depth="' + d + '">' +
        /* Exposed sub-stratum sheet: ruled archival vellum with taxonomic seal, zero raw matter */
        '<polygon points="' + xCut + ',8 152,8 152,' + yCut + '" fill="#efe6d2" stroke="#171310" stroke-width="1.4"/>' +
        ruled.join("") +
        '<circle cx="132" cy="28" r="11" fill="none" stroke="#a62c1e" stroke-width="1.5"/>' +
        '<circle cx="132" cy="28" r="8" fill="none" stroke="#986d24" stroke-width="0.9" stroke-dasharray="2,1.5"/>' +
        '<text x="132" y="30.5" text-anchor="middle" fill="#171310" font-family="Georgia,serif" font-size="6.4" font-weight="bold">S·' + romanD + '</text>' +
        '<text x="147" y="' + Math.min(144, Math.max(46, Math.round(yCut * 0.56))) + '" text-anchor="end" fill="#171310" font-family="Georgia,serif" font-size="6.3" font-weight="bold">' + escHtml(codeStr) + '</text>' +
        '<text x="147" y="' + Math.min(151, Math.max(54, Math.round(yCut * 0.56) + 8)) + '" text-anchor="end" fill="#a62c1e" font-family="Georgia,serif" font-size="5.7">NON MATERIA</text>' +
        /* Rolled vellum underside flap & woodcut shadow */
        '<polygon points="' + xCut + ',8 ' + curlX + ',' + curlY + ' 152,' + yCut + '" fill="#e6d8be" stroke="#171310" stroke-width="1.6"/>' +
        '<line x1="' + (xCut + 2) + '" y1="14" x2="' + (curlX + 5) + '" y2="' + (curlY - 3) + '" stroke="#986d24" stroke-width="1.1"/>' +
      '</g>'
    );
  }

  function buildWoodcutSVG(item, peelDepth) {
    var d = Math.max(0, Math.floor(peelDepth || 0));
    var motifFn = MOTIF_RENDERERS[item.id];
    var motifMarkup = motifFn ? motifFn() : "";
    return (
      '<svg class="xylo-woodcut-svg" viewBox="0 0 160 160" role="img" aria-label="' + escHtml(item.title + " — " + item.shortSign) + '">' +
        '<rect x="2" y="2" width="156" height="156" fill="#f3ead8" stroke="#171310" stroke-width="3"/>' +
        '<rect x="7" y="7" width="146" height="146" fill="none" stroke="#171310" stroke-width="1.1"/>' +
        /* Corner woodblock registration ticks */
        '<path d="M7,16 L16,16 L16,7 M144,7 L144,16 L153,16 M7,144 L16,144 L16,153 M144,153 L144,144 L153,144" fill="none" stroke="#986d24" stroke-width="1.2"/>' +
        motifMarkup +
        renderPeelOverlaySVG(item, d) +
      '</svg>'
    );
  }

  var RAW_CATALOG = [
    /* ================= STATION 0: JUTTING SIGNBOARDS (4) ================= */
    {
      id: "pincers",
      codePrefix: "SGN.01",
      stationIndex: 0,
      stationId: "cantilevers",
      wallSide: "left",
      kind: "cantilevers",
      subkind: "signboard",
      title: "Iron Pincers",
      shortSign: "pincers -> tooth-drawer's house",
      signifies: "Indicates the tooth-drawer's house: forged iron forceps jutting from the lintel so pain itself is read as an appointment with the extractor's chair.",
      imperative: "Hold your jaw as you pass; do not hear a cry behind the shutter—read only the guild office of extraction.",
      guildCrossNote: "Registered under the Chirurgical Ironmongers' Roll; cross-indexed against the grocer's balance for alum-salt weight and the lawful pyre statute for unclaimed bone.",
      crossRefs: ["scales", "burn_corpses", "hourglass"]
    },
    {
      id: "tankard",
      codePrefix: "SGN.02",
      stationIndex: 0,
      stationId: "cantilevers",
      wallSide: "right",
      kind: "cantilevers",
      subkind: "signboard",
      title: "Pewter Tankard",
      shortSign: "tankard -> tavern",
      signifies: "Indicates the tavern: a hinged pewter measure suspended on chains, translating thirst into licensed civic conviviality.",
      imperative: "Do not smell sour wine or damp sawdust; recognize solely the municipal locus of metered libation.",
      guildCrossNote: "Stamped by the Wardens of Liquid Measure; bound directly to the rear-kiosk micturition interdict and the Garrison Barracks ration tally.",
      crossRefs: ["no_urinate_kiosk", "halberds", "scales"]
    },
    {
      id: "halberds",
      codePrefix: "SGN.03",
      stationIndex: 0,
      stationId: "cantilevers",
      wallSide: "left",
      kind: "cantilevers",
      subkind: "signboard",
      title: "Crossed Halberds",
      shortSign: "halberds -> barracks",
      signifies: "Indicates the barracks: crossed polearms jutting over the street to announce armed watch, muster rolls, and quartered pikemen.",
      imperative: "Straighten your stride beneath the iron crescent; perceive neither sweating recruits nor rust, only the emblem of civic coercion.",
      guildCrossNote: "Subordinated to the Sovereign Palace guard-order, the Crenellated Tower shield, and the Unmarked Prison gatehouse.",
      crossRefs: ["palace", "tower", "prison"]
    },
    {
      id: "scales",
      codePrefix: "SGN.04",
      stationIndex: 0,
      stationId: "cantilevers",
      wallSide: "right",
      kind: "cantilevers",
      subkind: "signboard",
      title: "Brass Scales",
      shortSign: "scales -> grocer's",
      signifies: "Indicates the grocer's shop: equal brass pans poised on an iron bracket, turning grain, pepper, and oil into calibrated equivalence.",
      imperative: "Read weight, never flavor; see every sack not as harvest of soil, but as an entry balanced against the Mint's standard.",
      guildCrossNote: "Calibrated annually at the Unmarked Mint; prohibited from receiving bulk carts through the Narrow Alley interdict.",
      crossRefs: ["mint", "no_wagons_alley", "cornucopia"]
    },

    /* ================= STATION 1: STATUES & SHIELDS (4) ================= */
    {
      id: "lion",
      codePrefix: "HRD.05",
      stationIndex: 1,
      stationId: "heraldry",
      wallSide: "left",
      kind: "heraldry",
      subkind: "shield_statue",
      title: "Statue & Shield of the Lion",
      shortSign: "lion -> sign that something has as its sign a lion",
      signifies: "A sign that something—who knows what?—has as its sign a lion: an effigy referring neither to beasts of the waste nor to courage, but to a second-order bearer of leonine heraldry.",
      imperative: "Do not picture tawny fur or desert fangs; bow before the unnamed institution whose sole disclosed predicate is that its emblem is a lion.",
      guildCrossNote: "Filed in the Armorial Cartulary beside the Gilded Palanquin of power and the Sovereign Palace archivolt.",
      crossRefs: ["palanquin", "palace", "tower"]
    },
    {
      id: "dolphin",
      codePrefix: "HRD.06",
      stationIndex: 1,
      stationId: "heraldry",
      wallSide: "right",
      kind: "heraldry",
      subkind: "shield_statue",
      title: "Statue & Shield of the Dolphin",
      shortSign: "dolphin -> sign that something has as its sign a dolphin",
      signifies: "A sign that something—who knows what?—has as its sign a dolphin: an embowed stone fish testifying only that an undisclosed confraternity seals its writs with a dolphin.",
      imperative: "Banish all thought of salt spray or open sea; register strictly that an unknown referent claims the dolphin as cipher.",
      guildCrossNote: "Cross-sealed with the Bridge Fishing Interdict and the Municipal Zebra-Watering Conduit ledger.",
      crossRefs: ["no_fishing_bridge", "water_zebras", "star"]
    },
    {
      id: "tower",
      codePrefix: "HRD.07",
      stationIndex: 1,
      stationId: "heraldry",
      wallSide: "left",
      kind: "heraldry",
      subkind: "shield_statue",
      title: "Statue & Shield of the Tower",
      shortSign: "tower -> sign that something has as its sign a tower",
      signifies: "A sign that something—who knows what?—has as its sign a tower: a carved turret upon a wall whose stones exist only to support the relief of a turret.",
      imperative: "Seek no stair within this wall; read the crenellated relief as proof that some unrevealed authority signifies itself by a tower.",
      guildCrossNote: "Indexed alongside the Barracks Halberds and the Battered Unmarked Prison masonry.",
      crossRefs: ["halberds", "prison", "lion"]
    },
    {
      id: "star",
      codePrefix: "HRD.08",
      stationIndex: 1,
      stationId: "heraldry",
      wallSide: "right",
      kind: "heraldry",
      subkind: "shield_statue",
      title: "Statue & Shield of the Star",
      shortSign: "star -> sign that something has as its sign a star",
      signifies: "A sign that something—who knows what?—has as its sign a star: an eight-rayed mullet pointing not skyward, but inward to the heraldic roll of stellar bearers.",
      imperative: "Do not lift your eyes toward night skies; construe the eight rays solely as the registered mark of that which bears a star.",
      guildCrossNote: "Collated with the Pythagorean School's geometric order and the Volumes of Averroes glosses.",
      crossRefs: ["pythagorean_school", "averroes", "dolphin"]
    },

    /* ================= STATION 2: PROHIBITIONS & PERMISSIONS (6) ================= */
    {
      id: "no_wagons_alley",
      codePrefix: "DEC.09",
      stationIndex: 2,
      stationId: "decrees",
      wallSide: "left",
      kind: "decrees",
      subkind: "prohibition",
      decreeType: "forbidden",
      title: "Interdict: Wagons in the Alley",
      shortSign: "forbidden: entering the alley with wagons",
      signifies: "Signals what is forbidden in this place: to enter the narrow alley with wagons, lest wooden hubs scrape the sign-coated pilasters.",
      imperative: "Halt every axle at the corner kerbs; read the narrow passage as an exclusion zone of wheel and draught.",
      guildCrossNote: "Enforced by the Castra Halberdiers; exempted only for hand-carried Gilded Palanquins of high office.",
      crossRefs: ["palanquin", "halberds", "scales"]
    },
    {
      id: "no_urinate_kiosk",
      codePrefix: "DEC.10",
      stationIndex: 2,
      stationId: "decrees",
      wallSide: "right",
      kind: "decrees",
      subkind: "prohibition",
      decreeType: "forbidden",
      title: "Interdict: Behind the Kiosk",
      shortSign: "forbidden: urinating behind the kiosk",
      signifies: "Signals what is forbidden in this place: to urinate behind the octagonal street kiosk, subjecting even bodily relief to cartographic prohibition.",
      imperative: "Check every impulse of the body in shadow; even the blind angle behind the lattice belongs to civic orthography.",
      guildCrossNote: "Appended to the Tavern Tankard excise roll and contrasted with the Lawful Zebra-Watering Basin.",
      crossRefs: ["tankard", "water_zebras", "prison"]
    },
    {
      id: "no_fishing_bridge",
      codePrefix: "DEC.11",
      stationIndex: 2,
      stationId: "decrees",
      wallSide: "left",
      kind: "decrees",
      subkind: "prohibition",
      decreeType: "forbidden",
      title: "Interdict: Pole-Fishing from Bridge",
      shortSign: "forbidden: fishing with your pole from the bridge",
      signifies: "Signals what is forbidden in this place: to fish with your pole from the parapet of the bridge over the canal.",
      imperative: "Do not peer into the current for silver scales; treat the parapet strictly as a line across which no reed pole may lean.",
      guildCrossNote: "Cross-filed under the Heraldic Dolphinwardens and the Grocer's Scales provision statute.",
      crossRefs: ["dolphin", "scales", "play_bowls"]
    },
    {
      id: "water_zebras",
      codePrefix: "DEC.12",
      stationIndex: 2,
      stationId: "decrees",
      wallSide: "right",
      kind: "decrees",
      subkind: "permission",
      decreeType: "lawful",
      title: "Charter: Watering Zebras",
      shortSign: "lawful: watering zebras",
      signifies: "Signals what is lawful in this place: watering zebras at the stone basin—rendering even the striped beast an authorized municipal ceremony.",
      imperative: "Recognize these black-and-white flanks not as untamed savanna life, but as sanctioned participants in Conduit Clause XII.",
      guildCrossNote: "Paired with the Kiosk Prohibition tablet and the Temple of the Cornucopia water-tithe.",
      crossRefs: ["no_urinate_kiosk", "cornucopia", "headband"]
    },
    {
      id: "play_bowls",
      codePrefix: "DEC.13",
      stationIndex: 2,
      stationId: "decrees",
      wallSide: "left",
      kind: "decrees",
      subkind: "permission",
      decreeType: "lawful",
      title: "Charter: Playing Bowls",
      shortSign: "lawful: playing bowls",
      signifies: "Signals what is lawful in this place: playing bowls within the chalked precinct, where leisure itself occurs only by rubricated license.",
      imperative: "Observe the curving wooden sphere not as idle play, but as obedient execution of Permitted Pastime IV.",
      guildCrossNote: "Geometrically audited by the Pythagorean School faculty and bounded by the Tavern precinct.",
      crossRefs: ["pythagorean_school", "tankard", "no_fishing_bridge"]
    },
    {
      id: "burn_corpses",
      codePrefix: "DEC.14",
      stationIndex: 2,
      stationId: "decrees",
      wallSide: "right",
      kind: "decrees",
      subkind: "permission",
      decreeType: "lawful",
      title: "Charter: Burning Relatives' Corpses",
      shortSign: "lawful: burning relatives' corpses",
      signifies: "Signals what is lawful in this place: burning relatives' corpses upon stacked pyres, subsuming grief and ash into civic taxonomy.",
      imperative: "Weep only according to kinship schedule; read rising smoke as a valid certificate of lineal cremation.",
      guildCrossNote: "Witnessed before the Temple Hourglass priesthood and the Medusa Gorgoneion ward.",
      crossRefs: ["hourglass", "medusa", "pincers"]
    },

    /* ================= STATION 3: TEMPLES (3) & UNMARKED EDIFICES (5) ================= */
    {
      id: "cornucopia",
      codePrefix: "TMP.15",
      stationIndex: 3,
      stationId: "order",
      wallSide: "left",
      kind: "order",
      subkind: "temple",
      title: "Temple Door: The Cornucopia",
      shortSign: "temple statue attribute -> cornucopia (address prayers correctly)",
      signifies: "Seen from the temple door: the god's statue portrayed with the cornucopia attribute so the worshiper can recognize the deity of abundance and address prayers without liturgical error.",
      imperative: "Inspect the spiraled horn before kneeling; misaddressed supplication is void in the celestial registry.",
      guildCrossNote: "Harmonized with the Grocer's Scales and the Lawful Zebra-Watering Conduit.",
      crossRefs: ["scales", "water_zebras", "hourglass"]
    },
    {
      id: "hourglass",
      codePrefix: "TMP.16",
      stationIndex: 3,
      stationId: "order",
      wallSide: "right",
      kind: "order",
      subkind: "temple",
      title: "Temple Door: The Hourglass",
      shortSign: "temple statue attribute -> hourglass (address prayers correctly)",
      signifies: "Seen from the temple door: the god's statue portrayed with the hourglass attribute so the worshiper recognizes the lord of measured duration and directs petitions accurately.",
      imperative: "Count the trickling gilt sand-bulbs first; speak only the formula prescribed for temporal reckoning.",
      guildCrossNote: "Conjoined with the Lawful Pyre precinct for relatives' corpses and the Volumes of Averroes on eternity.",
      crossRefs: ["burn_corpses", "averroes", "medusa"]
    },
    {
      id: "medusa",
      codePrefix: "TMP.17",
      stationIndex: 3,
      stationId: "order",
      wallSide: "left",
      kind: "order",
      subkind: "temple",
      title: "Temple Door: The Medusa",
      shortSign: "temple statue attribute -> medusa (address prayers correctly)",
      signifies: "Seen from the temple door: the deity's statue bearing the serpent-wreathed Medusa attribute so worshipers identify apotropaic dread and recite the exact propitiation.",
      imperative: "Read the coiled vipers as liturgical index, not monster; utter the ward-prayer assigned to Gorgon iconography.",
      guildCrossNote: "Aligned along the axis facing the Unmarked Prison wall and the Crenellated Tower shield.",
      crossRefs: ["prison", "tower", "cornucopia"]
    },
    {
      id: "palace",
      codePrefix: "EDF.18",
      stationIndex: 3,
      stationId: "order",
      wallSide: "right",
      kind: "order",
      subkind: "edifice",
      rankOrder: 1,
      title: "Unmarked Edifice: The Palace",
      shortSign: "no signboard -> form & rank I indicate the palace",
      signifies: "Bears neither signboard nor figure: its rusticated symmetry, piano nobile arcade, and supreme position in the city's spatial order suffice to indicate the Palace.",
      imperative: "Need no painted plaque here; deduce sovereign command solely from cornice height and axial primacy.",
      guildCrossNote: "Commands the Castra Halberds, the Lion Escutcheon, and the Gilded Palanquin of power.",
      crossRefs: ["palanquin", "lion", "halberds"]
    },
    {
      id: "prison",
      codePrefix: "EDF.19",
      stationIndex: 3,
      stationId: "order",
      wallSide: "left",
      kind: "order",
      subkind: "edifice",
      rankOrder: 2,
      title: "Unmarked Edifice: The Prison",
      shortSign: "no signboard -> form & rank II indicate the prison",
      signifies: "Bears neither signboard nor figure: its battered blind ashlar, high iron slits, and recessed position in the city's order suffice to indicate the Prison.",
      imperative: "Infer confinement from aperture scarcity alone; the wall's mute proportion is already its sentence.",
      guildCrossNote: "Receives violators of the Alley Wagon, Kiosk, and Bridge Fishing interdicts.",
      crossRefs: ["no_wagons_alley", "no_urinate_kiosk", "no_fishing_bridge"]
    },
    {
      id: "mint",
      codePrefix: "EDF.20",
      stationIndex: 3,
      stationId: "order",
      wallSide: "right",
      kind: "order",
      subkind: "edifice",
      rankOrder: 3,
      title: "Unmarked Edifice: The Mint",
      shortSign: "no signboard -> form & rank III indicate the mint",
      signifies: "Bears neither signboard nor figure: its bossed treasury masonry, twin assay flues, and fortified rank in the city's order suffice to indicate the Mint.",
      imperative: "Recognize stamped value in the blind vaulting itself, where metal becomes sign of sovereign measure.",
      guildCrossNote: "Governs the Grocer's Scales and underwrites every stall-ware valuation in the Bazaar.",
      crossRefs: ["scales", "palanquin", "headband"]
    },
    {
      id: "pythagorean_school",
      codePrefix: "EDF.21",
      stationIndex: 3,
      stationId: "order",
      wallSide: "left",
      kind: "order",
      subkind: "edifice",
      rankOrder: 4,
      title: "Unmarked Edifice: Pythagorean School",
      shortSign: "no signboard -> form & rank IV indicate the Pythagorean school",
      signifies: "Bears neither signboard nor figure: its harmonic column intervals, tetractys tympanum, and measured place in the city's order suffice to indicate the Pythagorean School.",
      imperative: "Count the ratios of intercolumniation; architecture here pronounces number without uttering a syllable.",
      guildCrossNote: "Corresponds with the Volumes of Averroes stall and the Eight-Rayed Star escutcheon.",
      crossRefs: ["averroes", "star", "play_bowls"]
    },
    {
      id: "brothel",
      codePrefix: "EDF.22",
      stationIndex: 3,
      stationId: "order",
      wallSide: "right",
      kind: "order",
      subkind: "edifice",
      rankOrder: 5,
      title: "Unmarked Edifice: The Brothel",
      shortSign: "no signboard -> form & rank V indicate the brothel",
      signifies: "Bears neither signboard nor figure: its overhanging louvered shutters, recessed side-lane rank, and veiled threshold suffice in the city's order to indicate the Brothel.",
      imperative: "Do not imagine secret intimacy behind the slats; even desire's house is a zoned grammatical slot in Tamara's syntax.",
      guildCrossNote: "Indexed alongside the Ankle Bracelet of voluptuousness and the Embroidered Headband of elegance.",
      crossRefs: ["anklet", "headband", "tankard"]
    },

    /* ================= STATION 4: VENDOR STALLS / BAZAAR (4) ================= */
    {
      id: "headband",
      codePrefix: "BZR.23",
      stationIndex: 4,
      stationId: "bazaar",
      wallSide: "left",
      kind: "bazaar",
      subkind: "ware",
      wareMeaning: "elegance",
      title: "Embroidered Headband",
      shortSign: "embroidered headband -> elegance",
      signifies: "Displayed on the vendor's stall not for silk thread or brow-warmth, but solely as the sign of elegance.",
      imperative: "Do not finger the stitchwork as cloth; price and covet strictly the social predicate ELEGANCE.",
      guildCrossNote: "Appraised by the Sumptuary Clerks alongside the Mint's gold-thread tariff and the Unmarked Brothel shutter-code.",
      crossRefs: ["mint", "anklet", "brothel"]
    },
    {
      id: "palanquin",
      codePrefix: "BZR.24",
      stationIndex: 4,
      stationId: "bazaar",
      wallSide: "right",
      kind: "bazaar",
      subkind: "ware",
      wareMeaning: "power",
      title: "Gilded Palanquin",
      shortSign: "gilded palanquin -> power",
      signifies: "Displayed on the vendor's stall not as conveyance for tired limbs, but solely as the sign of power.",
      imperative: "See neither cedar poles nor velvet cushions; bow to the portable ideogram POWER.",
      guildCrossNote: "Co-registered with the Unmarked Palace rank I facade, the Lion Shield, and the Alley Wagon exemption.",
      crossRefs: ["palace", "lion", "no_wagons_alley"]
    },
    {
      id: "averroes",
      codePrefix: "BZR.25",
      stationIndex: 4,
      stationId: "bazaar",
      wallSide: "left",
      kind: "bazaar",
      subkind: "ware",
      wareMeaning: "learning",
      title: "Volumes of Averroes",
      shortSign: "volumes of Averroes -> learning",
      signifies: "Displayed on the vendor's stall not to be opened in solitary doubt, but valued as the unmistakable sign of learning.",
      imperative: "Even the Commentator's pages are scanned here as emblems: possess the calfskin spine so passersby read LEARNING.",
      guildCrossNote: "Cross-cataloged with the Pythagorean School peristyle and the Temple Hourglass lectern.",
      crossRefs: ["pythagorean_school", "hourglass", "star"]
    },
    {
      id: "anklet",
      codePrefix: "BZR.26",
      stationIndex: 4,
      stationId: "bazaar",
      wallSide: "right",
      kind: "bazaar",
      subkind: "ware",
      wareMeaning: "voluptuousness",
      title: "Ankle Bracelet",
      shortSign: "ankle bracelet -> voluptuousness",
      signifies: "Displayed on the vendor's stall not for chime or hammered gilt, but valued exclusively as the sign of voluptuousness.",
      imperative: "Hear no living footstep in the bells; read only the ratified lexical token VOLUPTUOUSNESS before passing the city gate.",
      guildCrossNote: "Linked to the Unmarked Brothel's rank V louver-form and the Embroidered Headband's sumptuary table.",
      crossRefs: ["brothel", "headband", "palanquin"]
    }
  ];

  var CATALOG_BY_ID = Object.create(null);
  var CATALOG = RAW_CATALOG.map(function (entry, idx) {
    var item = Object.assign({}, entry, {
      catalogNumber: idx + 1,
      stationTitle: STATIONS[entry.stationIndex].title,
      renderWoodcutSVG: function (peelDepth) {
        return buildWoodcutSVG(item, peelDepth);
      }
    });
    Object.freeze(item.crossRefs);
    Object.freeze(item);
    CATALOG_BY_ID[item.id] = item;
    return item;
  });
  Object.freeze(CATALOG);

  var SCHOLASTIC_REGISTERS = [
    " Liber Signorum Municipalium",
    " Glossarium Ordinis Tamarensis",
    " Regestum Censorum & Rubricarum",
    " Cartularium Speculorum Urbanorum",
    " Index Sub-Corticalis Non-Substantiae",
    " Codex Relationum Perpetuarum"
  ];

  var SCHOLASTIC_AXIOMS = [
    "Beneath the scraped pigment appears no lime-mortar or timber grain—only a notarized parchment backing referring this lemma to three cognate ordinances.",
    "Prying deeper lifts a second vellum backing: what looked like wall-stone is stamped press-board embossed with guild cross-classifications.",
    "No raw matter inheres at this stratum; the chisel strikes only an older rubricated gloss dictating how the previous label must be pronounced.",
    "What Tamara conceals under her outer carapace of signs is never mute substance, life, or secret flesh, but a denser archive of taxonomic seals.",
    "Here the scraper meets an unbroken palimpsest of municipal cross-citations: every sign points sideways to sibling signs, never downward to things.",
    "Other cities may rot into clay or beam beneath their paint; Tamara yields solely nested colophons repeating the discourse you are already reciting."
  ];

  function getItem(id) {
    return CATALOG_BY_ID[id] || null;
  }

  function renderWoodcutSVG(id, peelDepth) {
    var item = CATALOG_BY_ID[id] || CATALOG[0];
    return buildWoodcutSVG(item, peelDepth || 0);
  }

  /* ========================================================================
   * RECURSIVE NON-MATERIAL PEEL ENGINE: peel(id, depth)
   * Law of Tamara: isRawMatter === false ALWAYS for every depth 0..infinity.
   * ======================================================================== */
  function peel(id, depth) {
    var item = CATALOG_BY_ID[id] || CATALOG[0];
    var d = Math.max(0, Math.floor(Number(depth) || 0));
    var roman = toRoman(Math.max(1, d));
    var sealCode = item.codePrefix + "::STRATUM-" + (d === 0 ? "0-FACIES" : roman);

    var crossRefObjects = item.crossRefs.map(function (cid) {
      var ref = CATALOG_BY_ID[cid];
      return ref
        ? { id: ref.id, title: ref.title, shortSign: ref.shortSign, stationIndex: ref.stationIndex }
        : { id: cid, title: cid, shortSign: cid, stationIndex: 0 };
    });

    if (d === 0) {
      return {
        id: item.id,
        title: item.title,
        depth: 0,
        isRawMatter: false,
        materialFound: null,
        stratumKind: "woodcut_emblem",
        stratumTitle: "Stratum 0 — Outer Woodcut Facade",
        rubricCode: sealCode,
        sealCode: sealCode,
        shortSign: item.shortSign,
        discourseText: "Outer emblem presented to the street: " + item.title + " (" + item.shortSign + "). Scan it as a written page; pry beneath if you seek what lies behind the sign.",
        text: "Outer emblem presented to the street: " + item.title + " (" + item.shortSign + ").",
        imperative: item.imperative,
        crossRefIds: item.crossRefs.slice(),
        crossRefs: crossRefObjects,
        discourseToken: item.id + "@0",
        svg: buildWoodcutSVG(item, 0)
      };
    }

    if (d === 1) {
      return {
        id: item.id,
        title: item.title,
        depth: 1,
        isRawMatter: false,
        materialFound: null,
        stratumKind: "primary_taxonomic_signification",
        stratumTitle: "Stratum I — Primary Taxonomic Signification",
        rubricCode: sealCode,
        sealCode: sealCode,
        shortSign: item.shortSign,
        discourseText: item.signifies + " Beneath the painted surface lies no raw wood or uncarved stone—only the municipal definition assigning its function.",
        text: item.signifies + " Beneath the painted surface lies no raw wood or uncarved stone—only the municipal definition assigning its function.",
        imperative: item.imperative,
        crossRefIds: item.crossRefs.slice(),
        crossRefs: crossRefObjects,
        discourseToken: item.id + "@1",
        svg: buildWoodcutSVG(item, 1)
      };
    }

    if (d === 2) {
      return {
        id: item.id,
        title: item.title,
        depth: 2,
        isRawMatter: false,
        materialFound: null,
        stratumKind: "prescriptive_imperative",
        stratumTitle: "Stratum II — Prescriptive Cognitive Imperative",
        rubricCode: sealCode,
        sealCode: sealCode,
        shortSign: item.shortSign,
        discourseText: "IMPERATIVE RUBRIC: " + item.imperative + " While you believe you are visiting Tamara, you are only recording the names with which she defines herself and all her parts.",
        text: "IMPERATIVE RUBRIC: " + item.imperative + " While you believe you are visiting Tamara, you are only recording the names with which she defines herself and all her parts.",
        imperative: item.imperative,
        crossRefIds: item.crossRefs.slice(),
        crossRefs: crossRefObjects,
        discourseToken: item.id + "@2",
        svg: buildWoodcutSVG(item, 2)
      };
    }

    if (d === 3) {
      var refNames = crossRefObjects.map(function (r) {
        return r.title + " [" + r.shortSign + "]";
      }).join("; ");
      return {
        id: item.id,
        title: item.title,
        depth: 3,
        isRawMatter: false,
        materialFound: null,
        stratumKind: "bureaucratic_guild_cross_reference",
        stratumTitle: "Stratum III — Guild & Censorial Cross-Reference",
        rubricCode: sealCode,
        sealCode: sealCode,
        shortSign: item.shortSign,
        discourseText: item.guildCrossNote + " Bound reciprocally to: " + refNames + ". Still zero raw substance—only lateral links across Tamara's coating of signs.",
        text: item.guildCrossNote + " Bound reciprocally to: " + refNames + ". Still zero raw substance—only lateral links across Tamara's coating of signs.",
        imperative: item.imperative,
        crossRefIds: item.crossRefs.slice(),
        crossRefs: crossRefObjects,
        discourseToken: item.id + "@3",
        svg: buildWoodcutSVG(item, 3)
      };
    }

    /* Depth >= 4: Infinite deterministic scholastic compounding */
    var regIdx = (item.catalogNumber + d * 3) % SCHOLASTIC_REGISTERS.length;
    var axIdx = (item.catalogNumber * 5 + d * 7) % SCHOLASTIC_AXIOMS.length;
    var secRefA = CATALOG[(item.catalogNumber + d * 4) % CATALOG.length];
    var secRefB = CATALOG[(item.catalogNumber + d * 9 + 3) % CATALOG.length];
    var compoundSeal =
      "SIG-" + item.codePrefix + "-D" + d + "-F" + ((item.catalogNumber * 17 + d * 31) % 997) +
      "->" + secRefA.codePrefix + "/" + secRefB.codePrefix;

    var compoundedRefs = [
      { id: secRefA.id, title: secRefA.title, shortSign: secRefA.shortSign, stationIndex: secRefA.stationIndex },
      { id: secRefB.id, title: secRefB.title, shortSign: secRefB.shortSign, stationIndex: secRefB.stationIndex },
      crossRefObjects[d % crossRefObjects.length]
    ];

    var scholText =
      "[" + SCHOLASTIC_REGISTERS[regIdx].trim() + ", Fol. " + (item.catalogNumber * 12 + d * 7) + "r, Seal " + compoundSeal + "] " +
      SCHOLASTIC_AXIOMS[axIdx] +
      " Cross-sealed to " + secRefA.title + " (" + secRefA.shortSign + ") and " + secRefB.title + " (" + secRefB.shortSign + "). " +
      "What the city really is beneath this thick coat of signs, what it contains or conceals, remains unsaid.";

    return {
      id: item.id,
      title: item.title,
      depth: d,
      isRawMatter: false,
      materialFound: null,
      stratumKind: "scholastic_recursive_codex",
      stratumTitle: "Stratum " + roman + " — Sub-Cortical Scholastic Seal",
      rubricCode: compoundSeal,
      sealCode: compoundSeal,
      shortSign: item.shortSign,
      discourseText: scholText,
      text: scholText,
      imperative: item.imperative,
      crossRefIds: compoundedRefs.map(function (r) { return r.id; }),
      crossRefs: compoundedRefs,
      discourseToken: item.id + "@" + d,
      svg: buildWoodcutSVG(item, d)
    };
  }

  /* ========================================================================
   * XYLOGRAPHIC STREET-CORRIDOR STYLES (exclusively xylo- selectors & custom tags)
   * ======================================================================== */
  var STYLE_ELEMENT_ID = "xylo-tamara-semiotic-coat-css";

  var CORRIDOR_CSS = [
    "corridor-perspective-well.xylo-corridor-well {",
    "  display: grid;",
    "  grid-template-rows: auto minmax(0, 1fr) auto;",
    "  width: 100%;",
    "  height: 100%;",
    "  min-height: 420px;",
    "  box-sizing: border-box;",
    "  position: relative;",
    "  overflow: hidden;",
    "  background: #f3ead8;",
    "  color: #171310;",
    "  border: 2px solid #171310;",
    "  font-family: 'Palatino Linotype', 'Book Antiqua', Baskerville, Georgia, serif;",
    "  user-select: none;",
    "}",
    "corridor-perspective-well.xylo-corridor-well *, corridor-perspective-well.xylo-corridor-well *::before, corridor-perspective-well.xylo-corridor-well *::after {",
    "  box-sizing: border-box;",
    "}",
    "xylo-corridor-nav.xylo-nav-bar {",
    "  display: flex;",
    "  flex-wrap: wrap;",
    "  align-items: center;",
    "  justify-content: space-between;",
    "  gap: 6px 10px;",
    "  padding: 7px 10px;",
    "  background: #e6d8be;",
    "  border-bottom: 2px solid #171310;",
    "  z-index: 3;",
    "}",
    ".xylo-station-pills {",
    "  display: flex;",
    "  flex-wrap: wrap;",
    "  gap: 4px;",
    "  align-items: center;",
    "}",
    ".xylo-station-step, .xylo-corridor-trigger {",
    "  appearance: none;",
    "  background: #f3ead8;",
    "  color: #171310;",
    "  border: 1.5px solid #171310;",
    "  padding: 4px 8px;",
    "  font-family: inherit;",
    "  font-size: 11.5px;",
    "  font-weight: 700;",
    "  letter-spacing: 0.04em;",
    "  cursor: pointer;",
    "  line-height: 1.2;",
    "  transition: background-color 140ms ease, color 140ms ease, transform 140ms ease;",
    "}",
    ".xylo-station-step:hover, .xylo-corridor-trigger:hover {",
    "  background: #171310;",
    "  color: #f3ead8;",
    "}",
    ".xylo-station-step:focus-visible, .xylo-corridor-trigger:focus-visible, cantilever-sign-plate.xylo-sign-plate:focus-visible {",
    "  outline: 2px solid #a62c1e;",
    "  outline-offset: 2px;",
    "}",
    ".xylo-station-step.xylo-is-active {",
    "  background: #a62c1e;",
    "  color: #f3ead8;",
    "  border-color: #171310;",
    "}",
    ".xylo-corridor-trigger.xylo-rubric-action {",
    "  background: #a62c1e;",
    "  color: #f3ead8;",
    "}",
    ".xylo-corridor-trigger.xylo-rubric-action:hover {",
    "  background: #171310;",
    "  color: #f3ead8;",
    "}",
    ".xylo-corridor-trigger.xylo-gate-action {",
    "  background: #986d24;",
    "  color: #f3ead8;",
    "}",
    ".xylo-nav-telemetry {",
    "  display: flex;",
    "  align-items: center;",
    "  gap: 8px;",
    "  font-size: 11.5px;",
    "  font-weight: 700;",
    "}",
    ".xylo-saturation-pill {",
    "  padding: 2px 7px;",
    "  background: #f3ead8;",
    "  border: 1px solid #171310;",
    "  color: #a62c1e;",
    "  white-space: nowrap;",
    "}",
    "xylo-perspective-arena.xylo-arena {",
    "  position: relative;",
    "  display: grid;",
    "  grid-template-columns: minmax(0, 1fr) minmax(84px, 16%) minmax(0, 1fr);",
    "  align-items: start;",
    "  gap: 8px;",
    "  padding: 10px 12px;",
    "  overflow-y: auto;",
    "  overflow-x: hidden;",
    "  min-height: 210px;",
    "}",
    ".xylo-perspective-backdrop {",
    "  position: absolute;",
    "  inset: 0;",
    "  width: 100%;",
    "  height: 100%;",
    "  pointer-events: none;",
    "  z-index: 0;",
    "}",
    "xylo-wall-rack.xylo-wall-col {",
    "  position: relative;",
    "  z-index: 2;",
    "  display: grid;",
    "  grid-template-columns: repeat(auto-fit, minmax(126px, 1fr));",
    "  gap: 8px;",
    "  align-content: start;",
    "}",
    "xylo-vanishing-aisle.xylo-aisle-center {",
    "  position: relative;",
    "  z-index: 2;",
    "  display: flex;",
    "  flex-direction: column;",
    "  align-items: center;",
    "  justify-content: space-between;",
    "  align-self: stretch;",
    "  text-align: center;",
    "  padding: 6px 2px;",
    "  pointer-events: none;",
    "}",
    ".xylo-aisle-badge {",
    "  background: rgba(243, 234, 216, 0.94);",
    "  border: 1.5px solid #171310;",
    "  padding: 4px 6px;",
    "  font-size: 10.5px;",
    "  line-height: 1.25;",
    "  pointer-events: auto;",
    "  max-width: 100%;",
    "}",
    ".xylo-aisle-gate-portal {",
    "  pointer-events: auto;",
    "  margin-top: auto;",
    "}",
    "cantilever-sign-plate.xylo-sign-plate {",
    "  display: flex;",
    "  flex-direction: column;",
    "  position: relative;",
    "  background: #f3ead8;",
    "  border: 2px solid #171310;",
    "  padding: 6px;",
    "  cursor: pointer;",
    "  box-shadow: 3px 3px 0 #171310;",
    "  transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;",
    "}",
    "corridor-perspective-well.xylo-reduced-motion cantilever-sign-plate.xylo-sign-plate,",
    "corridor-perspective-well.xylo-reduced-motion .xylo-station-step,",
    "corridor-perspective-well.xylo-reduced-motion .xylo-corridor-trigger {",
    "  transition: none !important;",
    "  animation: none !important;",
    "}",
    "cantilever-sign-plate.xylo-sign-plate:hover {",
    "  transform: translateY(-2px);",
    "  box-shadow: 4px 5px 0 #171310;",
    "}",
    "cantilever-sign-plate.xylo-sign-plate.xylo-is-selected {",
    "  border-color: #a62c1e;",
    "  box-shadow: 4px 4px 0 #a62c1e;",
    "  background: #efe6d2;",
    "}",
    "cantilever-sign-plate.xylo-sign-plate.xylo-peel-pulse {",
    "  animation: xyloPeelSnap 280ms ease;",
    "}",
    "@keyframes xyloPeelSnap {",
    "  0% { transform: scale(1); }",
    "  45% { transform: scale(0.97) rotate(-0.8deg); }",
    "  100% { transform: scale(1) rotate(0deg); }",
    "}",
    ".xylo-bracket-iron {",
    "  height: 5px;",
    "  background: repeating-linear-gradient(90deg, #171310 0 8px, #986d24 8px 11px);",
    "  margin: -6px -6px 5px -6px;",
    "  border-bottom: 1.5px solid #171310;",
    "}",
    ".xylo-plate-art {",
    "  width: 100%;",
    "  aspect-ratio: 1 / 1;",
    "  max-height: 126px;",
    "  display: flex;",
    "  align-items: center;",
    "  justify-content: center;",
    "  margin: 0 auto 4px auto;",
    "}",
    ".xylo-plate-art .xylo-woodcut-svg {",
    "  width: 100%;",
    "  height: 100%;",
    "  display: block;",
    "}",
    ".xylo-plate-caption {",
    "  font-size: 11.5px;",
    "  font-weight: 700;",
    "  line-height: 1.2;",
    "  color: #171310;",
    "}",
    ".xylo-plate-gloss {",
    "  font-size: 10px;",
    "  line-height: 1.22;",
    "  color: #a62c1e;",
    "  margin-top: 2px;",
    "}",
    ".xylo-plate-footer {",
    "  display: flex;",
    "  align-items: center;",
    "  justify-content: space-between;",
    "  gap: 4px;",
    "  margin-top: 5px;",
    "  padding-top: 4px;",
    "  border-top: 1px dashed #986d24;",
    "  font-size: 9.5px;",
    "  font-weight: 700;",
    "}",
    "xylo-torn-corner.xylo-torn-badge {",
    "  display: inline-block;",
    "  padding: 1px 5px;",
    "  background: #e6d8be;",
    "  border: 1px solid #171310;",
    "  color: #171310;",
    "}",
    "xylo-torn-corner.xylo-torn-badge.xylo-is-peeled {",
    "  background: #a62c1e;",
    "  color: #f3ead8;",
    "}",
    "peel-stratum-sheet.xylo-peel-sheet {",
    "  display: grid;",
    "  grid-template-columns: minmax(0, 1fr) auto;",
    "  gap: 8px 12px;",
    "  align-items: center;",
    "  padding: 8px 11px;",
    "  background: #e6d8be;",
    "  border-top: 2px solid #171310;",
    "  z-index: 3;",
    "}",
    ".xylo-stratum-meta {",
    "  display: flex;",
    "  flex-wrap: wrap;",
    "  align-items: baseline;",
    "  gap: 6px 10px;",
    "  font-size: 11px;",
    "}",
    ".xylo-stratum-rubric {",
    "  color: #a62c1e;",
    "  font-weight: 700;",
    "  letter-spacing: 0.04em;",
    "}",
    ".xylo-stratum-code {",
    "  font-family: 'Courier New', Courier, monospace;",
    "  font-size: 10.5px;",
    "  background: #f3ead8;",
    "  padding: 1px 5px;",
    "  border: 1px solid #171310;",
    "}",
    ".xylo-stratum-body {",
    "  font-size: 12px;",
    "  line-height: 1.35;",
    "  margin-top: 3px;",
    "  color: #171310;",
    "}",
    ".xylo-stratum-refs {",
    "  display: flex;",
    "  flex-wrap: wrap;",
    "  align-items: center;",
    "  gap: 4px;",
    "  margin-top: 5px;",
    "  font-size: 10.5px;",
    "}",
    ".xylo-ref-chip {",
    "  appearance: none;",
    "  background: #f3ead8;",
    "  color: #171310;",
    "  border: 1px solid #986d24;",
    "  padding: 1px 6px;",
    "  font-family: inherit;",
    "  font-size: 10px;",
    "  cursor: pointer;",
    "}",
    ".xylo-ref-chip:hover {",
    "  background: #986d24;",
    "  color: #f3ead8;",
    "}",
    ".xylo-stratum-actions {",
    "  display: flex;",
    "  flex-direction: column;",
    "  gap: 5px;",
    "  align-items: stretch;",
    "}",
    "@media (max-width: 720px) {",
    "  xylo-perspective-arena.xylo-arena {",
    "    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);",
    "    padding: 8px;",
    "    gap: 6px;",
    "  }",
    "  xylo-vanishing-aisle.xylo-aisle-center {",
    "    grid-column: 1 / -1;",
    "    order: -1;",
    "    flex-direction: row;",
    "    flex-wrap: wrap;",
    "    gap: 6px;",
    "    justify-content: space-between;",
    "    padding: 2px 0 4px 0;",
    "  }",
    "  xylo-wall-rack.xylo-wall-col {",
    "    grid-template-columns: minmax(0, 1fr);",
    "  }",
    "  .xylo-plate-art {",
    "    max-height: 98px;",
    "  }",
    "  peel-stratum-sheet.xylo-peel-sheet {",
    "    grid-template-columns: minmax(0, 1fr);",
    "    padding: 7px 9px;",
    "  }",
    "  .xylo-stratum-actions {",
    "    flex-direction: row;",
    "    flex-wrap: wrap;",
    "  }",
    "}"
  ].join("\n");

  function ensureCorridorStyles(doc) {
    if (!doc || !doc.head) return;
    if (doc.getElementById(STYLE_ELEMENT_ID)) return;
    var styleEl = doc.createElement("style");
    styleEl.id = STYLE_ELEMENT_ID;
    styleEl.textContent = CORRIDOR_CSS;
    doc.head.appendChild(styleEl);
  }

  function renderCorridorBackdropSVG(stationIndex, progress) {
    /* 1-point perspective woodcut street-corridor converging to the City Exit Gate */
    var p = Math.max(0, Math.min(1, Number(progress) || 0));
    var gateScale = (0.58 + p * 0.62).toFixed(3);
    var cobbleOffset = Math.round((p * 48) % 16);

    var perspectiveRays = [];
    var rays = [
      [0, 0, 445, 195],
      [0, 110, 445, 212],
      [0, 290, 445, 248],
      [0, 480, 445, 285],
      [1000, 0, 555, 195],
      [1000, 110, 555, 212],
      [1000, 290, 555, 248],
      [1000, 480, 555, 285]
    ];
    for (var i = 0; i < rays.length; i++) {
      var r = rays[i];
      perspectiveRays.push(
        '<line x1="' + r[0] + '" y1="' + r[1] + '" x2="' + r[2] + '" y2="' + r[3] +
        '" stroke="#171310" stroke-width="1.4" opacity="0.24"/>'
      );
    }

    /* Receding bracket/pilaster verticals along left and right corridor walls */
    var bays = [75, 175, 265, 345, 405];
    var bayLines = [];
    for (var b = 0; b < bays.length; b++) {
      var lx = bays[b];
      var rx = 1000 - lx;
      var topY = Math.round(lx * 0.438);
      var botY = Math.round(480 - lx * 0.438);
      bayLines.push(
        '<line x1="' + lx + '" y1="' + topY + '" x2="' + lx + '" y2="' + botY + '" stroke="#171310" stroke-width="1.3" opacity="0.22"/>' +
        '<line x1="' + lx + '" y1="' + (topY + 24) + '" x2="' + (lx + 34) + '" y2="' + (topY + 24) + '" stroke="#a62c1e" stroke-width="2" opacity="0.28"/>' +
        '<line x1="' + rx + '" y1="' + topY + '" x2="' + rx + '" y2="' + botY + '" stroke="#171310" stroke-width="1.3" opacity="0.22"/>' +
        '<line x1="' + rx + '" y1="' + (topY + 24) + '" x2="' + (rx - 34) + '" y2="' + (topY + 24) + '" stroke="#a62c1e" stroke-width="2" opacity="0.28"/>'
      );
    }

    var cobbles = [];
    for (var cy = 300 + cobbleOffset; cy < 478; cy += 22) {
      var spanX = (cy - 285) * 2.3;
      cobbles.push(
        '<line x1="' + (500 - spanX).toFixed(1) + '" y1="' + cy + '" x2="' + (500 + spanX).toFixed(1) + '" y2="' + cy +
        '" stroke="#986d24" stroke-width="1" opacity="0.25"/>'
      );
    }

    return (
      '<svg class="xylo-perspective-backdrop" viewBox="0 0 1000 480" preserveAspectRatio="none" aria-hidden="true">' +
        /* Open sky slit above receding street roofs */
        '<polygon points="0,0 1000,0 555,195 445,195" fill="#efe6d2"/>' +
        /* Left & right sign-coated perspective walls */
        '<polygon points="0,0 445,195 445,285 0,480" fill="#f3ead8"/>' +
        '<polygon points="1000,0 555,195 555,285 1000,480" fill="#f3ead8"/>' +
        /* Street pavement trapezoid */
        '<polygon points="445,285 555,285 1000,480 0,480" fill="#e6d8be" opacity="0.68"/>' +
        perspectiveRays.join("") +
        bayLines.join("") +
        cobbles.join("") +
        /* Vanishing-point City Gate Arch opening to the empty horizon */
        '<g transform="translate(500,242) scale(' + gateScale + ') translate(-500,-242)">' +
          '<rect x="438" y="182" width="124" height="108" fill="#e6d8be" stroke="#171310" stroke-width="2.6"/>' +
          '<path d="M458,290 L458,224 A42,42 0 0,1 542,224 L542,290 Z" fill="#efe6d2" stroke="#171310" stroke-width="2.2"/>' +
          '<text x="500" y="198" text-anchor="middle" fill="#a62c1e" font-family="Georgia,serif" font-size="11" font-weight="bold" letter-spacing="1.4">PORTA VACUA · ST.' + STATIONS[stationIndex].roman + '</text>' +
        '</g>' +
      '</svg>'
    );
  }

  /* ========================================================================
   * INTERACTIVE STREET-CORRIDOR MOUNT: mountCorridor(containerEl, opts)
   * ======================================================================== */
  function mountCorridor(containerEl, opts) {
    if (!containerEl) {
      throw new Error("TamaraSemioticCoat.mountCorridor requires a valid containerEl");
    }
    var options = opts || {};
    var doc = containerEl.ownerDocument || document;
    ensureCorridorStyles(doc);

    var stationIndex = typeof options.initialStation === "number"
      ? Math.max(0, Math.min(4, Math.floor(options.initialStation)))
      : 0;
    var progress = typeof options.initialProgress === "number"
      ? Math.max(0, Math.min(1, options.initialProgress))
      : stationIndex / 4;
    if (typeof options.initialProgress === "number" && typeof options.initialStation !== "number") {
      stationIndex = Math.min(4, Math.max(0, Math.round(progress * 4)));
    }

    var selectedId = (options.initialSelectedId && CATALOG_BY_ID[options.initialSelectedId])
      ? options.initialSelectedId
      : CATALOG[0].id;
    var reducedMotion = Boolean(options.reducedMotion);
    var exitedGate = false;
    var destroyed = false;
    var lastPeelAnimatedId = null;

    var peelDepths = Object.create(null);
    var recordedNames = new Set();
    var inspectedItems = new Set();
    var totalPeels = 0;

    for (var i = 0; i < CATALOG.length; i++) {
      peelDepths[CATALOG[i].id] = 0;
    }

    /* Record initial frontispiece item */
    inspectedItems.add(selectedId);
    recordedNames.add(selectedId + "@0");

    function computeSaturation() {
      /* Smoothly approaches 1.0 as visitor scans items and peels strata */
      var raw = (inspectedItems.size / 26) * 0.52 + Math.min(0.48, totalPeels * 0.03);
      return Number(Math.max(0, Math.min(1, raw)).toFixed(4));
    }

    function getState() {
      var st = STATIONS[stationIndex];
      var depthCopy = {};
      for (var k = 0; k < CATALOG.length; k++) {
        var cid = CATALOG[k].id;
        depthCopy[cid] = peelDepths[cid] || 0;
      }
      return {
        stationIndex: stationIndex,
        stationId: st.id,
        stationTitle: st.title,
        progress: Number(progress.toFixed(4)),
        selectedId: selectedId,
        selectedDepth: peelDepths[selectedId] || 0,
        peelDepths: depthCopy,
        totalPeels: totalPeels,
        recordedNames: new Set(recordedNames),
        recordedNamesCount: recordedNames.size,
        inspectedItemsCount: inspectedItems.size,
        discourseSaturation: computeSaturation(),
        reducedMotion: reducedMotion,
        exitedGate: exitedGate
      };
    }

    function notifyDiscourse() {
      var snap = getState();
      if (typeof options.onDiscourseChange === "function") options.onDiscourseChange(snap);
      if (typeof options.onStateChange === "function") options.onStateChange(snap);
    }

    function triggerExitGate() {
      exitedGate = true;
      var snap = getState();
      if (typeof options.onExitGate === "function") {
        options.onExitGate(snap);
      }
      notifyDiscourse();
    }

    /* Build bespoke xylographic custom element hierarchy */
    containerEl.innerHTML = "";
    var wellEl = doc.createElement("corridor-perspective-well");
    wellEl.className = "xylo-corridor-well" + (reducedMotion ? " xylo-reduced-motion" : "");
    wellEl.setAttribute("role", "region");
    wellEl.setAttribute("aria-label", "Tamara Street of Jutting Signs");

    var navEl = doc.createElement("xylo-corridor-nav");
    navEl.className = "xylo-nav-bar";

    var arenaEl = doc.createElement("xylo-perspective-arena");
    arenaEl.className = "xylo-arena";

    var sheetEl = doc.createElement("peel-stratum-sheet");
    sheetEl.className = "xylo-peel-sheet";
    sheetEl.setAttribute("aria-live", "polite");

    wellEl.appendChild(navEl);
    wellEl.appendChild(arenaEl);
    wellEl.appendChild(sheetEl);
    containerEl.appendChild(wellEl);

    function renderAll(focusSelectedPlate) {
      if (destroyed) return;
      var st = STATIONS[stationIndex];
      var satPct = Math.round(computeSaturation() * 100);

      /* 1. Render Top Station Navigation Rail */
      var stationButtons = STATIONS.map(function (s) {
        var activeCls = s.index === stationIndex ? " xylo-is-active" : "";
        return (
          '<button type="button" class="xylo-station-step' + activeCls +
          '" data-xylo-station="' + s.index + '" aria-pressed="' + (s.index === stationIndex ? "true" : "false") + '">' +
          escHtml(s.roman + ". " + s.title) +
          '</button>'
        );
      }).join("");

      var nextLabel = stationIndex < 4 ? "Advance ->" : "Exit Gate -> Sky";
      var nextCls = stationIndex < 4 ? "xylo-corridor-trigger" : "xylo-corridor-trigger xylo-gate-action";

      navEl.innerHTML =
        '<div class="xylo-station-pills">' +
          '<button type="button" class="xylo-corridor-trigger" data-xylo-step="-1" ' +
            (stationIndex === 0 ? "disabled" : "") + ' title="Previous Corridor Station">&lt; Back</button>' +
          stationButtons +
          '<button type="button" class="' + nextCls + '" data-xylo-step="1">' + escHtml(nextLabel) + '</button>' +
        '</div>' +
        '<div class="xylo-nav-telemetry">' +
          '<span class="xylo-saturation-pill" title="Recorded Tamaran Discourse Entries">' +
            'Discourse: ' + recordedNames.size + ' · Coat ' + satPct + '%' +
          '</span>' +
        '</div>';

      /* 2. Render 1-Point Perspective Corridor Arena + Left/Right Sign Racks */
      var stationItems = CATALOG.filter(function (it) {
        return it.stationIndex === stationIndex;
      });
      var leftItems = [];
      var rightItems = [];
      for (var m = 0; m < stationItems.length; m++) {
        if (stationItems[m].wallSide === "left") leftItems.push(stationItems[m]);
        else rightItems.push(stationItems[m]);
      }

      function renderPlateMarkup(item) {
        var d = peelDepths[item.id] || 0;
        var isSel = item.id === selectedId;
        var pulseCls = lastPeelAnimatedId === item.id ? " xylo-peel-pulse" : "";
        var badgeLabel = d === 0 ? " Facade · 0" : "Peeled · S" + toRoman(d);
        var subBadge = item.decreeType
          ? (item.decreeType === "forbidden" ? "FORBIDDEN" : "LAWFUL")
          : (item.subkind === "edifice" ? "UNMARKED · RANK " + item.rankOrder : item.codePrefix);

        return (
          '<cantilever-sign-plate class="xylo-sign-plate' + (isSel ? " xylo-is-selected" : "") + pulseCls + '"' +
            ' tabindex="0" role="button"' +
            ' data-xylo-item="' + escHtml(item.id) + '"' +
            ' aria-pressed="' + (isSel ? "true" : "false") + '"' +
            ' aria-label="' + escHtml(item.title + " (" + item.shortSign + "), peel depth " + d) + '">' +
            '<div class="xylo-bracket-iron" aria-hidden="true"></div>' +
            '<div class="xylo-plate-art">' + item.renderWoodcutSVG(d) + '</div>' +
            '<div class="xylo-plate-caption">' + escHtml(item.title) + '</div>' +
            '<div class="xylo-plate-gloss">' + escHtml(item.shortSign) + '</div>' +
            '<div class="xylo-plate-footer">' +
              '<span>' + escHtml(subBadge) + '</span>' +
              '<xylo-torn-corner class="xylo-torn-badge' + (d > 0 ? " xylo-is-peeled" : "") + '">' +
                escHtml(badgeLabel.trim()) +
              '</xylo-torn-corner>' +
            '</div>' +
          '</cantilever-sign-plate>'
        );
      }

      var gatePortalBtn = stationIndex === 4
        ? '<button type="button" class="xylo-corridor-trigger xylo-gate-action xylo-aisle-gate-portal" data-xylo-exit="1">' +
            'Pass Out Under Arch -> Empty Horizon' +
          '</button>'
        : '<button type="button" class="xylo-corridor-trigger xylo-aisle-gate-portal" data-xylo-step="1">' +
            'Walk Deeper (' + (stationIndex + 1) + '/5) ->' +
          '</button>';

      arenaEl.innerHTML =
        renderCorridorBackdropSVG(stationIndex, progress) +
        '<xylo-wall-rack class="xylo-wall-col xylo-wall-left">' +
          leftItems.map(renderPlateMarkup).join("") +
        '</xylo-wall-rack>' +
        '<xylo-vanishing-aisle class="xylo-aisle-center">' +
          '<div class="xylo-aisle-badge">' +
            '<strong>Station ' + escHtml(st.roman) + ': ' + escHtml(st.title) + '</strong><br/>' +
            '<span>' + escHtml(st.subtitle) + '</span>' +
          '</div>' +
          gatePortalBtn +
        '</xylo-vanishing-aisle>' +
        '<xylo-wall-rack class="xylo-wall-col xylo-wall-right">' +
          rightItems.map(renderPlateMarkup).join("") +
        '</xylo-wall-rack>';

      /* 3. Render Bottom Peel Stratum Inspection Sheet */
      var curDepth = peelDepths[selectedId] || 0;
      var peeled = peel(selectedId, curDepth);

      var refChipsHtml = peeled.crossRefs.map(function (ref) {
        return (
          '<button type="button" class="xylo-ref-chip" data-xylo-jump="' + escHtml(ref.id) + '">' +
            '-> ' + escHtml(ref.title) +
          '</button>'
        );
      }).join("");

      sheetEl.innerHTML =
        '<div class="xylo-stratum-content">' +
          '<div class="xylo-stratum-meta">' +
            '<span class="xylo-stratum-rubric">' + escHtml(peeled.title + " · " + peeled.stratumTitle) + '</span>' +
            '<span class="xylo-stratum-code">' + escHtml(peeled.sealCode) + '</span>' +
            '<span>Raw Matter Exposed: <strong>NONE (Taxonomic Discourse Only)</strong></span>' +
          '</div>' +
          '<div class="xylo-stratum-body">' + escHtml(peeled.discourseText) + '</div>' +
          '<div class="xylo-stratum-refs">' +
            '<span>Cross-Indexed Signs:</span>' + refChipsHtml +
          '</div>' +
        '</div>' +
        '<div class="xylo-stratum-actions">' +
          '<button type="button" class="xylo-corridor-trigger xylo-rubric-action" data-xylo-peel="' + escHtml(selectedId) + '">' +
            'Pry / Peel Beneath Sign (Stratum ' + (curDepth + 1) + ')' +
          '</button>' +
          (stationIndex === 4
            ? '<button type="button" class="xylo-corridor-trigger xylo-gate-action" data-xylo-exit="1">Leave Tamara -> Open Sky</button>'
            : '') +
        '</div>';

      lastPeelAnimatedId = null;

      if (focusSelectedPlate) {
        var plateToFocus = arenaEl.querySelector('[data-xylo-item="' + selectedId + '"]');
        if (plateToFocus && typeof plateToFocus.focus === "function") {
          plateToFocus.focus({ preventScroll: true });
        }
      }
    }

    function selectItem(id, internalOpts) {
      var item = CATALOG_BY_ID[id];
      if (!item) return null;
      var prevStation = stationIndex;
      selectedId = item.id;
      stationIndex = item.stationIndex;
      progress = stationIndex / 4;

      inspectedItems.add(item.id);
      var d = peelDepths[item.id] || 0;
      recordedNames.add(item.id + "@" + d);

      renderAll(Boolean(internalOpts && internalOpts.focusPlate));

      var res = peel(item.id, d);
      var snap = getState();
      if (prevStation !== stationIndex && typeof options.onStationChange === "function") {
        options.onStationChange(stationIndex, STATIONS[stationIndex], snap);
      }
      if (typeof options.onSelect === "function") options.onSelect(item, res, snap);
      if (typeof options.onItemSelected === "function") options.onItemSelected(item, res, snap);
      notifyDiscourse();
      return res;
    }

    function peelItem(id, explicitDepth) {
      var targetId = (id && CATALOG_BY_ID[id]) ? id : selectedId;
      var item = CATALOG_BY_ID[targetId];
      if (!item) return null;

      selectedId = item.id;
      stationIndex = item.stationIndex;
      progress = stationIndex / 4;

      var nextDepth = typeof explicitDepth === "number"
        ? Math.max(0, Math.floor(explicitDepth))
        : (peelDepths[item.id] || 0) + 1;

      peelDepths[item.id] = nextDepth;
      totalPeels += 1;
      inspectedItems.add(item.id);
      recordedNames.add(item.id + "@" + nextDepth);
      lastPeelAnimatedId = reducedMotion ? null : item.id;

      renderAll(false);

      var res = peel(item.id, nextDepth);
      var snap = getState();
      if (typeof options.onPeel === "function") options.onPeel(item, res, snap);
      if (typeof options.onItemPeeled === "function") options.onItemPeeled(item, res, snap);
      notifyDiscourse();
      return res;
    }

    function stepStation(delta) {
      var step = Math.trunc(Number(delta) || 0);
      if (step === 0) return getState();
      var target = stationIndex + step;
      if (target > 4) {
        stationIndex = 4;
        progress = 1;
        renderAll(false);
        triggerExitGate();
        return getState();
      }
      stationIndex = Math.max(0, Math.min(4, target));
      progress = stationIndex / 4;

      /* Ensure selected item reflects current station if user walked stations */
      var curItem = CATALOG_BY_ID[selectedId];
      if (!curItem || curItem.stationIndex !== stationIndex) {
        var firstInStation = CATALOG.find(function (it) { return it.stationIndex === stationIndex; });
        if (firstInStation) {
          selectedId = firstInStation.id;
          inspectedItems.add(selectedId);
          recordedNames.add(selectedId + "@" + (peelDepths[selectedId] || 0));
        }
      }

      renderAll(false);
      var snap = getState();
      if (typeof options.onStationChange === "function") {
        options.onStationChange(stationIndex, STATIONS[stationIndex], snap);
      }
      if (typeof options.onProgressChange === "function") {
        options.onProgressChange(progress, stationIndex, snap);
      }
      notifyDiscourse();
      return snap;
    }

    function setProgress(nextProg) {
      var raw = Number(nextProg);
      if (Number.isNaN(raw)) return getState();
      if (raw > 1.02) {
        progress = 1;
        stationIndex = 4;
        renderAll(false);
        triggerExitGate();
        return getState();
      }
      progress = Math.max(0, Math.min(1, raw));
      var newStation = Math.min(4, Math.max(0, Math.round(progress * 4)));
      var changed = newStation !== stationIndex;
      stationIndex = newStation;

      var curItem = CATALOG_BY_ID[selectedId];
      if (!curItem || curItem.stationIndex !== stationIndex) {
        var firstInStation = CATALOG.find(function (it) { return it.stationIndex === stationIndex; });
        if (firstInStation) {
          selectedId = firstInStation.id;
          inspectedItems.add(selectedId);
          recordedNames.add(selectedId + "@" + (peelDepths[selectedId] || 0));
        }
      }

      renderAll(false);
      var snap = getState();
      if (changed && typeof options.onStationChange === "function") {
        options.onStationChange(stationIndex, STATIONS[stationIndex], snap);
      }
      if (typeof options.onProgressChange === "function") {
        options.onProgressChange(progress, stationIndex, snap);
      }
      notifyDiscourse();
      return snap;
    }

    function setReducedMotion(flag) {
      reducedMotion = Boolean(flag);
      if (reducedMotion) wellEl.classList.add("xylo-reduced-motion");
      else wellEl.classList.remove("xylo-reduced-motion");
      return getState();
    }

    function reset() {
      stationIndex = 0;
      progress = 0;
      selectedId = CATALOG[0].id;
      exitedGate = false;
      totalPeels = 0;
      recordedNames.clear();
      inspectedItems.clear();
      for (var i = 0; i < CATALOG.length; i++) {
        peelDepths[CATALOG[i].id] = 0;
      }
      inspectedItems.add(selectedId);
      recordedNames.add(selectedId + "@0");
      renderAll(false);
      notifyDiscourse();
      return getState();
    }

    /* Delegated click interactions */
    function onWellClick(ev) {
      var target = ev.target;
      if (!target || typeof target.closest !== "function") return;

      var exitBtn = target.closest("[data-xylo-exit]");
      if (exitBtn) {
        ev.preventDefault();
        triggerExitGate();
        return;
      }

      var peelBtn = target.closest("[data-xylo-peel]");
      if (peelBtn) {
        ev.preventDefault();
        peelItem(peelBtn.getAttribute("data-xylo-peel"));
        return;
      }

      var jumpBtn = target.closest("[data-xylo-jump]");
      if (jumpBtn) {
        ev.preventDefault();
        selectItem(jumpBtn.getAttribute("data-xylo-jump"), { focusPlate: true });
        return;
      }

      var stBtn = target.closest("[data-xylo-station]");
      if (stBtn) {
        ev.preventDefault();
        var idx = Number(stBtn.getAttribute("data-xylo-station"));
        setProgress(idx / 4);
        return;
      }

      var stepBtn = target.closest("[data-xylo-step]");
      if (stepBtn) {
        ev.preventDefault();
        stepStation(Number(stepBtn.getAttribute("data-xylo-step")));
        return;
      }

      var plateEl = target.closest("cantilever-sign-plate[data-xylo-item]");
      if (plateEl) {
        ev.preventDefault();
        var itemId = plateEl.getAttribute("data-xylo-item");
        if (itemId === selectedId) {
          /* Clicking an already-selected sign plate peels deeper into its coating */
          peelItem(itemId);
        } else {
          selectItem(itemId, { focusPlate: true });
        }
      }
    }

    /* Keyboard support: Enter/Space on plates selects & peels; Left/Right/PageUp/PageDown walks corridor */
    function onWellKeyDown(ev) {
      var target = ev.target;
      var plateEl = target && typeof target.closest === "function"
        ? target.closest("cantilever-sign-plate[data-xylo-item]")
        : null;

      if (plateEl && (ev.key === "Enter" || ev.key === " ")) {
        ev.preventDefault();
        var itemId = plateEl.getAttribute("data-xylo-item");
        if (itemId === selectedId) {
          peelItem(itemId);
        } else {
          selectItem(itemId, { focusPlate: true });
        }
        return;
      }

      if (ev.key === "PageDown" || (ev.altKey && ev.key === "ArrowRight")) {
        ev.preventDefault();
        stepStation(1);
      } else if (ev.key === "PageUp" || (ev.altKey && ev.key === "ArrowLeft")) {
        ev.preventDefault();
        stepStation(-1);
      }
    }

    /* Wheel navigation along corridor stations when arena scroll is at boundary */
    var lastWheelStepAt = 0;
    function onWellWheel(ev) {
      var now = Date.now();
      if (now - lastWheelStepAt < 340) return;
      if (Math.abs(ev.deltaY) < 26) return;

      var atTop = arenaEl.scrollTop <= 1;
      var atBottom = arenaEl.scrollTop + arenaEl.clientHeight >= arenaEl.scrollHeight - 2;

      if (ev.deltaY > 0 && atBottom) {
        lastWheelStepAt = now;
        ev.preventDefault();
        stepStation(1);
      } else if (ev.deltaY < 0 && atTop && stationIndex > 0) {
        lastWheelStepAt = now;
        ev.preventDefault();
        stepStation(-1);
      }
    }

    wellEl.addEventListener("click", onWellClick);
    wellEl.addEventListener("keydown", onWellKeyDown);
    wellEl.addEventListener("wheel", onWellWheel, { passive: false });

    renderAll(false);

    function destroy() {
      if (destroyed) return;
      destroyed = true;
      wellEl.removeEventListener("click", onWellClick);
      wellEl.removeEventListener("keydown", onWellKeyDown);
      wellEl.removeEventListener("wheel", onWellWheel);
      containerEl.innerHTML = "";
    }

    return {
      setProgress: setProgress,
      stepStation: stepStation,
      selectItem: selectItem,
      peelItem: peelItem,
      getCatalog: function () { return CATALOG.slice(); },
      peel: peel,
      setReducedMotion: setReducedMotion,
      getState: getState,
      reset: reset,
      destroy: destroy
    };
  }

  var API = Object.freeze({
    PALETTE: PALETTE,
    STATIONS: STATIONS,
    CATALOG: CATALOG,
    getCatalog: function () { return CATALOG.slice(); },
    getItem: getItem,
    renderWoodcutSVG: renderWoodcutSVG,
    peel: peel,
    mountCorridor: mountCorridor
  });

  if (root) {
    root.TamaraSemioticCoat = API;
  }
  if (typeof window !== "undefined") {
    window.TamaraSemioticCoat = API;
  }
  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  }
})(typeof globalThis !== "undefined" ? globalThis : (typeof window !== "undefined" ? window : this));
