import os
from pathlib import Path

SVG_DIR = Path("readable_book/assets/svgs")
SVG_DIR.mkdir(parents=True, exist_ok=True)

# 34 bespoke, minimalist, architectural vector SVGs
# Styled with sleek geometric lines, gold/cyan/charcoal palettes, and precise symbolic geometry.

SVG_DESIGNS = {
    0: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <defs><linearGradient id="g0" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#d4af37"/><stop offset="100%" stop-color="#4a3b10"/></linearGradient></defs>
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2" stroke-dasharray="4,4"/>
  <path d="M40,160 Q100,140 160,40" fill="none" stroke="#3b4252" stroke-width="3"/>
  <path d="M40,160 Q70,90 140,70" fill="none" stroke="url(#g0)" stroke-width="3" stroke-dasharray="6,3"/>
  <!-- Paw tracks as commas -->
  <path d="M60,145 C62,142 66,140 68,144 C70,148 65,152 61,154 C58,155 57,150 60,145 Z" fill="url(#g0)"/>
  <path d="M85,120 C87,117 91,115 93,119 C95,123 90,127 86,129 C83,130 82,125 85,120 Z" fill="url(#g0)"/>
  <path d="M110,95 C112,92 116,90 118,94 C120,98 115,102 111,104 C108,105 107,100 110,95 Z" fill="url(#g0)"/>
  <!-- Compass pointer -->
  <line x1="100" y1="100" x2="150" y2="50" stroke="#88c0d0" stroke-width="2"/>
  <polygon points="150,50 140,54 146,60" fill="#88c0d0"/>
  <circle cx="100" cy="100" r="4" fill="#d4af37"/>
</svg>''',

    1: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <defs><radialGradient id="g1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#88c0d0" stop-opacity="0.8"/><stop offset="100%" stop-color="#88c0d0" stop-opacity="0"/></radialGradient></defs>
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <circle cx="45" cy="140" r="12" fill="#2e3440" stroke="#d8dee9" stroke-width="2"/>
  <line x1="45" y1="140" x2="160" y2="55" stroke="#d4af37" stroke-width="3"/>
  <!-- Target ray angle -->
  <polygon points="160,55 145,60 155,70" fill="#d4af37"/>
  <!-- Smoke cone at target -->
  <circle cx="160" cy="55" r="25" fill="url(#g1)"/>
  <circle cx="160" cy="55" r="4" fill="#eceff4"/>
  <!-- Eye lines turning -->
  <path d="M55,130 A30,30 0 0,1 80,110" fill="none" stroke="#81a1c1" stroke-width="2" stroke-dasharray="2,2"/>
</svg>''',

    2: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- House outline with oversized bay window -->
  <rect x="70" y="70" width="70" height="70" fill="none" stroke="#d8dee9" stroke-width="2"/>
  <polygon points="65,70 105,40 145,70" fill="none" stroke="#d8dee9" stroke-width="2"/>
  <!-- Vanished road dashed line -->
  <path d="M30,170 C60,140 140,110 180,60" fill="none" stroke="#d4af37" stroke-width="2" stroke-dasharray="6,4"/>
  <!-- 3 empty meat hooks inside house -->
  <path d="M85,85 C85,92 90,95 90,90" fill="none" stroke="#88c0d0" stroke-width="2"/>
  <path d="M100,85 C100,92 105,95 105,90" fill="none" stroke="#88c0d0" stroke-width="2"/>
  <path d="M115,85 C115,92 120,95 120,90" fill="none" stroke="#88c0d0" stroke-width="2"/>
</svg>''',

    3: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Three archipelago nodes -->
  <circle cx="50" cy="80" r="16" fill="#2e3440" stroke="#d4af37" stroke-width="2"/>
  <circle cx="150" cy="70" r="16" fill="#2e3440" stroke="#88c0d0" stroke-width="2"/>
  <circle cx="100" cy="150" r="16" fill="#2e3440" stroke="#a3be8c" stroke-width="2"/>
  <!-- Reticulated horizontal transfer arcs -->
  <path d="M65,80 Q100,50 135,70" fill="none" stroke="#d4af37" stroke-width="2" stroke-dasharray="4,2"/>
  <path d="M145,85 Q135,125 110,140" fill="none" stroke="#88c0d0" stroke-width="2" stroke-dasharray="4,2"/>
  <path d="M90,140 Q65,120 55,95" fill="none" stroke="#a3be8c" stroke-width="2" stroke-dasharray="4,2"/>
  <!-- Mutating creature glyphs in nodes -->
  <circle cx="50" cy="80" r="4" fill="#d4af37"/>
  <circle cx="150" cy="70" r="4" fill="#88c0d0"/>
  <circle cx="100" cy="150" r="4" fill="#a3be8c"/>
</svg>''',

    4: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Central rehearsal campfire circle -->
  <circle cx="100" cy="100" r="30" fill="#bf616a" fill-opacity="0.2" stroke="#bf616a" stroke-width="2"/>
  <polygon points="100,85 108,105 92,105" fill="#d08770"/>
  <!-- Surrounding observer perimeter -->
  <circle cx="100" cy="50" r="6" fill="#88c0d0"/>
  <circle cx="145" cy="75" r="6" fill="#88c0d0"/>
  <circle cx="145" cy="125" r="6" fill="#88c0d0"/>
  <circle cx="100" cy="150" r="6" fill="#88c0d0"/>
  <circle cx="55" cy="125" r="6" fill="#88c0d0"/>
  <circle cx="55" cy="75" r="6" fill="#88c0d0"/>
  <!-- Tiger shadow simulation wavefront -->
  <path d="M40,40 Q100,60 160,40" fill="none" stroke="#d4af37" stroke-width="2" stroke-dasharray="5,5"/>
</svg>''',

    5: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Gridded chessboard matrix -->
  <rect x="55" y="55" width="90" height="90" fill="none" stroke="#4c566a" stroke-width="2"/>
  <line x1="85" y1="55" x2="85" y2="145" stroke="#4c566a" stroke-width="1"/>
  <line x1="115" y1="55" x2="115" y2="145" stroke="#4c566a" stroke-width="1"/>
  <line x1="55" y1="85" x2="145" y2="85" stroke="#4c566a" stroke-width="1"/>
  <line x1="55" y1="115" x2="145" y2="115" stroke="#4c566a" stroke-width="1"/>
  <!-- The Wooden King piece with glowing crown -->
  <rect x="92" y="92" width="16" height="16" fill="#d4af37"/>
  <polygon points="90,92 100,78 110,92" fill="#ebcb8b"/>
  <circle cx="100" cy="76" r="3" fill="#88c0d0"/>
</svg>''',

    6: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Camera lens concentric aperture -->
  <circle cx="100" cy="100" r="50" fill="none" stroke="#88c0d0" stroke-width="2"/>
  <circle cx="100" cy="100" r="35" fill="none" stroke="#81a1c1" stroke-width="1" stroke-dasharray="3,3"/>
  <circle cx="100" cy="100" r="18" fill="#2e3440" stroke="#d4af37" stroke-width="2"/>
  <!-- Eyelid wink vector missing the iris -->
  <path d="M60,100 Q100,60 140,100" fill="none" stroke="#eceff4" stroke-width="2"/>
  <path d="M60,100 Q100,140 140,100" fill="none" stroke="#eceff4" stroke-width="2"/>
  <!-- Telemetry crosshairs -->
  <line x1="100" y1="30" x2="100" y2="170" stroke="#4c566a" stroke-width="1"/>
  <line x1="30" y1="100" x2="170" y2="100" stroke="#4c566a" stroke-width="1"/>
</svg>''',

    7: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Form fields / database table -->
  <rect x="50" y="50" width="100" height="22" rx="4" fill="none" stroke="#88c0d0" stroke-width="2"/>
  <rect x="50" y="80" width="100" height="22" rx="4" fill="none" stroke="#88c0d0" stroke-width="2"/>
  <rect x="50" y="110" width="100" height="22" rx="4" fill="none" stroke="#bf616a" stroke-width="2"/>
  <!-- Required field asterisk in red box -->
  <text x="58" y="66" fill="#88c0d0" font-family="monospace" font-size="12">NAME</text>
  <text x="58" y="96" fill="#88c0d0" font-family="monospace" font-size="12">CAUSE</text>
  <text x="58" y="126" fill="#bf616a" font-family="monospace" font-size="12">[REJECTED]</text>
  <!-- Outside biological entity rejected -->
  <circle cx="165" cy="120" r="6" fill="#d08770"/>
  <line x1="155" y1="120" x2="175" y2="120" stroke="#bf616a" stroke-width="2"/>
</svg>''',

    8: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Fluid organic mud waves -->
  <path d="M30,80 C60,110 80,60 120,90 C150,110 170,80 180,95" fill="none" stroke="#a3be8c" stroke-width="3"/>
  <path d="M20,120 C60,140 90,110 130,135 C160,150 180,120 190,130" fill="none" stroke="#8fbcbb" stroke-width="3"/>
  <!-- Rigid geometric red surveyor line -->
  <line x1="100" y1="30" x2="100" y2="170" stroke="#bf616a" stroke-width="3"/>
  <!-- Surveyor stakes driven into mud -->
  <polygon points="97,60 103,60 100,75" fill="#d4af37"/>
  <polygon points="97,110 103,110 100,125" fill="#d4af37"/>
</svg>''',

    9: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Two mismatched balance plates -->
  <line x1="50" y1="90" x2="150" y2="110" stroke="#d8dee9" stroke-width="3"/>
  <circle cx="100" cy="100" r="6" fill="#d4af37"/>
  <!-- Left plate: intricate organic tear/shuttle -->
  <path d="M40,110 C40,130 60,130 60,110 C60,90 50,75 50,75 C50,75 40,90 40,110 Z" fill="#b48ead" stroke="#b48ead" stroke-width="1"/>
  <!-- Right plate: cold standard copper coins -->
  <circle cx="150" cy="125" r="10" fill="#d08770" stroke="#ebcb8b" stroke-width="2"/>
  <circle cx="150" cy="115" r="10" fill="#d08770" stroke="#ebcb8b" stroke-width="2"/>
</svg>''',

    10: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Two observers with divergent sightlines -->
  <circle cx="50" cy="150" r="8" fill="#5e81ac"/>
  <circle cx="150" cy="150" r="8" fill="#88c0d0"/>
  <!-- Trajectory of thrown stone -->
  <path d="M50,145 Q90,70 100,60" fill="none" stroke="#d4af37" stroke-width="2" stroke-dasharray="4,3"/>
  <!-- The Red Bird taking flight from wall -->
  <path d="M100,55 C90,45 80,40 70,45 C85,55 95,55 100,55 C105,55 115,55 130,45 C120,40 110,45 100,55 Z" fill="#bf616a"/>
  <!-- Wall base -->
  <line x1="70" y1="75" x2="130" y2="75" stroke="#4c566a" stroke-width="4"/>
</svg>''',

    11: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Broken ceramic shards stitched into false sphere -->
  <circle cx="100" cy="100" r="50" fill="none" stroke="#4c566a" stroke-width="1" stroke-dasharray="4,4"/>
  <!-- Genuine shards in blue -->
  <path d="M70,80 Q85,60 105,65 Q95,90 70,80 Z" fill="#81a1c1"/>
  <path d="M120,95 Q140,110 135,130 Q115,115 120,95 Z" fill="#81a1c1"/>
  <path d="M65,120 Q80,140 100,135 Q90,115 65,120 Z" fill="#81a1c1"/>
  <!-- Golden plaster glue filling gaps -->
  <path d="M105,65 Q120,80 120,95" fill="none" stroke="#d4af37" stroke-width="3"/>
  <path d="M100,135 Q105,115 95,90" fill="none" stroke="#d4af37" stroke-width="3"/>
</svg>''',

    12: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Hammer with snapped wooden handle -->
  <polygon points="110,50 150,60 145,80 105,70" fill="#d8dee9" stroke="#4c566a" stroke-width="2"/>
  <!-- Upper handle fragment -->
  <polygon points="120,72 130,75 115,110 105,107" fill="#d08770"/>
  <!-- Snapped jagged break -->
  <path d="M105,107 L115,110 L108,118 L118,122 L105,130" fill="none" stroke="#bf616a" stroke-width="2"/>
  <!-- Lower handle fragment falling -->
  <polygon points="105,130 118,133 80,175 67,172" fill="#d08770"/>
</svg>''',

    13: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Vast nerve spine spanning diagonal -->
  <line x1="40" y1="40" x2="160" y2="160" stroke="#4c566a" stroke-width="6"/>
  <!-- Pulse packet traveling with high latency -->
  <circle cx="70" cy="70" r="10" fill="#d4af37"/>
  <circle cx="100" cy="100" r="6" fill="#88c0d0" stroke-dasharray="2,2"/>
  <circle cx="130" cy="130" r="4" fill="#4c566a"/>
  <!-- Head in mountain, toe in sea -->
  <circle cx="40" cy="40" r="16" fill="#2e3440" stroke="#88c0d0" stroke-width="2"/>
  <circle cx="160" cy="160" r="16" fill="#2e3440" stroke="#bf616a" stroke-width="2"/>
</svg>''',

    14: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Complex wide waveform compressed into single dot -->
  <path d="M30,100 Q45,30 60,100 T90,100 T120,100" fill="none" stroke="#81a1c1" stroke-width="2"/>
  <!-- Compression funnel -->
  <polygon points="120,60 160,95 160,105 120,140" fill="#4c566a" fill-opacity="0.3" stroke="#d8dee9" stroke-width="1"/>
  <!-- Output soundbite pill -->
  <rect x="155" y="93" width="25" height="14" rx="7" fill="#d4af37"/>
</svg>''',

    15: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Dial meter at 1000% maximum gauge -->
  <path d="M50,130 A60,60 0 1,1 150,130" fill="none" stroke="#4c566a" stroke-width="8"/>
  <path d="M50,130 A60,60 0 0,1 145,115" fill="none" stroke="#a3be8c" stroke-width="8"/>
  <!-- Needle pinned past redline -->
  <line x1="100" y1="120" x2="155" y2="110" stroke="#bf616a" stroke-width="3"/>
  <circle cx="100" cy="120" r="8" fill="#d8dee9"/>
  <!-- Rotten loaf / sawdust icon below -->
  <ellipse cx="100" cy="155" rx="20" ry="8" fill="#d08770" stroke="#4c566a" stroke-width="1"/>
</svg>''',

    16: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Floating document without author/shadow/provenance -->
  <rect x="65" y="55" width="70" height="90" rx="3" fill="#2e3440" stroke="#d8dee9" stroke-width="2"/>
  <line x1="75" y1="75" x2="125" y2="75" stroke="#eceff4" stroke-width="2"/>
  <line x1="75" y1="90" x2="125" y2="90" stroke="#eceff4" stroke-width="2"/>
  <line x1="75" y1="105" x2="105" y2="105" stroke="#eceff4" stroke-width="2"/>
  <!-- Severed chain links -->
  <circle cx="100" cy="35" r="6" fill="none" stroke="#bf616a" stroke-width="2"/>
  <line x1="100" y1="41" x2="100" y2="52" stroke="#bf616a" stroke-width="2" stroke-dasharray="2,2"/>
</svg>''',

    17: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Hive hexagonal grid with prohibited central cell -->
  <polygon points="100,50 130,68 130,102 100,120 70,102 70,68" fill="none" stroke="#d4af37" stroke-width="2"/>
  <polygon points="100,50 130,68 130,102 100,120 70,102 70,68" fill="#bf616a" fill-opacity="0.3"/>
  <line x1="75" y1="75" x2="125" y2="115" stroke="#bf616a" stroke-width="3"/>
  <!-- Subterranean tunnel leaking around prohibition -->
  <path d="M40,140 Q100,170 160,140" fill="none" stroke="#88c0d0" stroke-width="3"/>
  <circle cx="160" cy="140" r="5" fill="#88c0d0"/>
</svg>''',

    18: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Outer positive noise shapes carving an empty animal silhouette in the center -->
  <rect x="40" y="40" width="120" height="120" fill="#2e3440" stroke="#4c566a" stroke-width="2"/>
  <path d="M70,120 C70,90 90,80 100,80 C110,80 130,90 130,120 Z" fill="#0f1117"/>
  <circle cx="100" cy="70" r="14" fill="#0f1117"/>
  <!-- Clean negative space glowing -->
  <circle cx="100" cy="100" r="3" fill="#d4af37"/>
</svg>''',

    19: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Upper golden map layer -->
  <polygon points="40,70 160,50 170,110 50,130" fill="#d4af37" fill-opacity="0.2" stroke="#d4af37" stroke-width="2"/>
  <!-- Desiccated cracked ground beneath -->
  <path d="M50,150 L80,135 L100,165 L130,140 L160,160" fill="none" stroke="#bf616a" stroke-width="2"/>
  <circle cx="100" cy="165" r="4" fill="#bf616a"/>
</svg>''',

    20: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Wicker basket perimeter -->
  <circle cx="100" cy="100" r="55" fill="none" stroke="#d08770" stroke-width="4" stroke-dasharray="6,4"/>
  <!-- Coiled pit viper ready to strike -->
  <path d="M80,120 Q100,70 120,110 Q110,130 95,125" fill="none" stroke="#a3be8c" stroke-width="4"/>
  <polygon points="120,95 130,85 135,100" fill="#a3be8c"/>
  <circle cx="128" cy="92" r="2" fill="#bf616a"/>
</svg>''',

    21: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Infinity / Möbius loop of bidirectional feedback -->
  <path d="M60,100 C60,75 80,75 100,100 C120,125 140,125 140,100 C140,75 120,75 100,100 C80,125 60,125 60,100 Z" fill="none" stroke="#88c0d0" stroke-width="3"/>
  <polygon points="105,95 100,100 105,105" fill="#d4af37"/>
</svg>''',

    22: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Rotating potter wheel base -->
  <ellipse cx="100" cy="150" rx="60" ry="18" fill="#2e3440" stroke="#4c566a" stroke-width="2"/>
  <!-- Clay vessel being shaped by thumb -->
  <path d="M75,140 Q80,100 70,80 Q100,85 130,80 Q120,100 125,140 Z" fill="#d08770" stroke="#d4af37" stroke-width="2"/>
  <!-- Thumb contact pressure point -->
  <circle cx="70" cy="80" r="6" fill="#88c0d0"/>
</svg>''',

    23: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Stone coin with relief carving of ox horns -->
  <circle cx="100" cy="100" r="50" fill="#2e3440" stroke="#d4af37" stroke-width="3"/>
  <path d="M70,90 Q100,60 130,90" fill="none" stroke="#d4af37" stroke-width="4"/>
  <circle cx="100" cy="115" r="8" fill="#4c566a"/>
</svg>''',

    24: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Trefoil radiation warning symbol on rock -->
  <circle cx="100" cy="100" r="14" fill="#d4af37"/>
  <path d="M100,80 L88,58 A48,48 0 0,1 112,58 Z" fill="#d4af37"/>
  <path d="M117,110 L139,122 A48,48 0 0,1 127,143 Z" fill="#d4af37"/>
  <path d="M83,110 L61,122 A48,48 0 0,0 73,143 Z" fill="#d4af37"/>
</svg>''',

    25: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Frame A: Solid historical anchor lineage -->
  <rect x="35" y="60" width="55" height="70" fill="#2e3440" stroke="#88c0d0" stroke-width="2"/>
  <line x1="62" y1="35" x2="62" y2="60" stroke="#88c0d0" stroke-width="2"/>
  <!-- Frame B: Unanchored synthetic clone -->
  <rect x="110" y="60" width="55" height="70" fill="#2e3440" stroke="#bf616a" stroke-width="2" stroke-dasharray="4,2"/>
  <line x1="137" y1="35" x2="137" y2="60" stroke="#bf616a" stroke-width="2" stroke-dasharray="2,2"/>
  <!-- Identical dot inside both -->
  <circle cx="62" cy="95" r="8" fill="#d4af37"/>
  <circle cx="137" cy="95" r="8" fill="#d4af37"/>
</svg>''',

    26: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Geological strata sediment layers -->
  <path d="M40,70 Q100,85 160,65" stroke="#d4af37" stroke-width="4" fill="none"/>
  <path d="M40,100 Q100,115 160,95" stroke="#a3be8c" stroke-width="4" fill="none"/>
  <path d="M40,130 Q100,145 160,125" stroke="#88c0d0" stroke-width="4" fill="none"/>
  <!-- Tire tread stamping through the layers -->
  <line x1="90" y1="50" x2="110" y2="150" stroke="#eceff4" stroke-width="3" stroke-dasharray="6,4"/>
</svg>''',

    27: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Massive granite pyramid mountain -->
  <polygon points="100,45 165,155 35,155" fill="#2e3440" stroke="#d8dee9" stroke-width="2"/>
  <!-- Tectonic shear fracture line -->
  <path d="M100,45 L115,100 L95,125 L110,155" fill="none" stroke="#bf616a" stroke-width="2"/>
</svg>''',

    28: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Acoustic ear capturing soundwaves and prefills -->
  <path d="M70,70 A40,40 0 1,1 110,140 A20,20 0 0,1 100,120" fill="none" stroke="#88c0d0" stroke-width="3"/>
  <!-- Predictive autocomplete beam emerging -->
  <line x1="100" y1="120" x2="160" y2="80" stroke="#d4af37" stroke-width="2" stroke-dasharray="4,2"/>
  <polygon points="160,80 150,83 155,90" fill="#d4af37"/>
</svg>''',

    29: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Finished palace pediment with open roof seam -->
  <polygon points="100,50 160,80 40,80" fill="#2e3440" stroke="#d4af37" stroke-width="2"/>
  <!-- Missing flashing gap -->
  <circle cx="100" cy="50" r="4" fill="#bf616a"/>
  <!-- Downward pouring rain vectors into drywall -->
  <line x1="100" y1="55" x2="100" y2="130" stroke="#88c0d0" stroke-width="3" stroke-dasharray="4,2"/>
  <rect x="60" y="80" width="80" height="60" fill="none" stroke="#4c566a" stroke-width="2"/>
</svg>''',

    30: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Four-legged chair with broken front leg -->
  <line x1="70" y1="90" x2="130" y2="90" stroke="#d8dee9" stroke-width="3"/>
  <line x1="70" y1="50" x2="70" y2="140" stroke="#d8dee9" stroke-width="3"/>
  <line x1="130" y1="90" x2="130" y2="115" stroke="#bf616a" stroke-width="3"/>
  <!-- Debt ledger balance seal -->
  <circle cx="130" cy="135" r="8" fill="#d4af37"/>
</svg>''',

    31: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Hollow bronze statue silhouette with glowing empty core -->
  <polygon points="100,45 125,75 115,145 85,145 75,75" fill="none" stroke="#d4af37" stroke-width="2"/>
  <!-- Empty pedestal -->
  <rect x="60" y="145" width="80" height="15" fill="#4c566a"/>
  <!-- Phantom question mark in chest -->
  <circle cx="100" cy="85" r="10" fill="#2e3440" stroke="#88c0d0" stroke-width="1" stroke-dasharray="2,2"/>
</svg>''',

    32: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Golden crown set on stone floor below blindfold -->
  <polygon points="70,135 75,120 85,130 100,110 115,130 125,120 130,135" fill="#d4af37"/>
  <!-- Magistrate blindfold hanging above -->
  <rect x="65" y="70" width="70" height="16" rx="4" fill="#d8dee9"/>
  <line x1="50" y1="78" x2="150" y2="78" stroke="#d8dee9" stroke-width="2"/>
</svg>''',

    33: '''<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="world-svg">
  <defs><radialGradient id="g33" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#bf616a"/><stop offset="100%" stop-color="#bf616a" stop-opacity="0"/></radialGradient></defs>
  <circle cx="100" cy="100" r="88" fill="none" stroke="#2a2e37" stroke-width="2"/>
  <!-- Two cranial silhouettes with shared waveform -->
  <path d="M40,110 C40,80 60,60 80,75 C70,110 50,130 40,110 Z" fill="none" stroke="#88c0d0" stroke-width="2"/>
  <path d="M160,110 C160,80 140,60 120,75 C130,110 150,130 160,110 Z" fill="none" stroke="#88c0d0" stroke-width="2"/>
  <!-- Red Bird ascending in center gap -->
  <circle cx="100" cy="85" r="28" fill="url(#g33)"/>
  <path d="M100,80 C90,68 75,65 65,72 C80,82 95,82 100,80 C105,82 120,82 135,72 C125,65 110,68 100,80 Z" fill="#bf616a"/>
</svg>'''
}

for wid, svg_code in SVG_DESIGNS.items():
    filename = f"world_{wid:02d}.svg"
    with open(SVG_DIR / filename, 'w', encoding='utf-8') as f:
        f.write(svg_code.strip())
        
print(f"Generated all {len(SVG_DESIGNS)} bespoke geometric SVGs in {SVG_DIR}/")
