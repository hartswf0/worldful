import json
import os
import re
from pathlib import Path

from update_readable_book import CHAPTERS
from enhance_books import PRAGMATIC_METADATA
from synthesize_master_edition import extract_lineage, extract_b_specs

roman_numerals = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", 
                  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
                  "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX",
                  "XXXI", "XXXII", "XXXIII"]

# Elevation and coordinate mock for place lines
from build_infinite_scroll_reader import coordinates

glossary_dict = {}
for wid, data in PRAGMATIC_METADATA.items():
    for term, definition in data.get("key_terms", {}).items():
        key = term.strip().lower()
        glossary_dict[key] = {
            "name": term,
            "definition": definition,
            "world_id": wid,
            "world_title": data["title"]
        }

for wid, cdata in CHAPTERS.items():
    for term in cdata.get("terms", []):
        key = term.strip().lower()
        if key not in glossary_dict:
            glossary_dict[key] = {
                "name": term,
                "definition": f"Core operational dynamic formulated in World {wid:02d}: {cdata['title']}.",
                "world_id": wid,
                "world_title": cdata["title"]
            }

chapters_data = []

for wid in range(34):
    cdata = CHAPTERS[wid]
    img_path = f"readable_book/assets/images/plate_{wid:02d}.png"
    has_img = os.path.exists(img_path)
    
    # Extract deep lineages from source documents
    grounded, literature, code_math = extract_lineage(wid)
    skeleton, assumptions, operational, change_test = extract_b_specs(wid)
    
    fluid_prose = f"""{cdata['scene'].strip()}

{cdata['mechanism'].strip()}

{cdata['parasite'].strip()}

{cdata['modern'].strip()}

> **{cdata['invariant'].strip()}**
"""

    meta = PRAGMATIC_METADATA.get(wid, {})
    coord_info = coordinates[wid] if wid < len(coordinates) else ("ELEV. 1000m", "LAT 34°N", "FIELD STATION")

    yaml_spec = f"""# FORMAL STATE MACHINE & SPECIFICATION
Theory_Skeleton:
  {skeleton.replace(chr(10), chr(10)+'  ')}

Operational_Execution_Flow:
  {operational.replace(chr(10), chr(10)+'  ')}

Invariant_Validation_Test:
  {change_test.replace(chr(10), chr(10)+'  ')}
"""

    chapters_data.append({
        "id": wid,
        "roman": roman_numerals[wid],
        "title": cdata["title"],
        "subtitle": cdata["subtitle"],
        "invariant": cdata["invariant"],
        "prose": fluid_prose,
        "terms": cdata.get("terms", []),
        "has_img": has_img,
        "img_src": img_path,
        "coords": coord_info,
        "grounded_ancestry": grounded,
        "literature_thinkers": literature,
        "computational_lineage": code_math,
        "yaml_spec": yaml_spec
    })

chapters_json = json.dumps(chapters_data, ensure_ascii=False)
glossary_json = json.dumps(glossary_dict, ensure_ascii=False)

favicon_svg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23F2EFE9'/%3E%3Ccircle cx='16' cy='16' r='14' fill='none' stroke='%239B1D1D' stroke-width='1.5' stroke-dasharray='3,2'/%3E%3Cpath d='M10 22 C14 14 20 12 24 10 C22 15 18 20 12 23 Z' fill='%239B1D1D'/%3E%3Ccircle cx='22' cy='11' r='1' fill='%231E1E1E'/%3E%3C/svg%3E"

html_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>WORLDFUL — Atlas, Archive, Field Station</title>
  
  <link rel="icon" type="image/svg+xml" href="{favicon_svg}">
  
  <!-- Archival Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

  <style>
    :root {{
      --c-paper: #EDE8DF;
      --c-paper-light: #F4EFE6;
      --c-bone: #E2DBD0;
      --c-soot: #1C1B1A;
      --c-graphite: #4E4F51;
      --c-fog: #A6A49F;
      --c-dirt: #756F68;
      --c-red-bird: #9B1D1D;
      --c-stamp-border: rgba(155, 29, 29, 0.4);
      --c-grid-line: rgba(166, 164, 159, 0.2);

      --font-typewriter: 'Courier Prime', 'Space Mono', monospace;
      --font-display: 'Playfair Display', 'Newsreader', Georgia, serif;
      --font-serif: 'Newsreader', Georgia, serif;
      --font-mono: 'Space Mono', 'Courier Prime', monospace;
      --font-script: 'Caveat', cursive;
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}

    html {{ scroll-behavior: smooth; }}

    /* MINIMAL TYPEWRITER SCROLLBAR */
    ::-webkit-scrollbar {{ width: 6px; height: 6px; }}
    ::-webkit-scrollbar-track {{ background: var(--c-paper); border-left: 1px solid var(--c-grid-line); }}
    ::-webkit-scrollbar-thumb {{ background: var(--c-fog); border-radius: 2px; }}
    ::-webkit-scrollbar-thumb:hover {{ background: var(--c-red-bird); }}

    body {{
      background-color: var(--c-paper);
      color: var(--c-soot);
      font-family: var(--font-typewriter);
      font-size: 16.5px;
      line-height: 1.85;
      min-height: 100vh;
      overflow-x: hidden;
      background-image: 
        radial-gradient(var(--c-grid-line) 1px, transparent 0),
        linear-gradient(to right, var(--c-grid-line) 1px, transparent 1px),
        linear-gradient(to bottom, var(--c-grid-line) 1px, transparent 1px);
      background-size: 32px 32px, 160px 160px, 160px 160px;
    }}

    /* Reading Progress Line */
    #progress-line {{
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: var(--c-red-bird);
      width: 0%;
      z-index: 1000;
      transition: width 0.1s ease-out;
    }}

    /* Global Header */
    header.field-header {{
      border-bottom: 1px solid var(--c-fog);
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(237, 232, 223, 0.96);
      backdrop-filter: blur(8px);
      position: sticky;
      top: 0;
      z-index: 100;
    }}

    .field-brand {{
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 3px;
      color: var(--c-soot);
      text-transform: uppercase;
      text-decoration: none;
    }}

    .field-current-plate {{
      font-family: var(--font-mono);
      font-size: 10.5px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--c-red-bird);
      font-weight: 700;
      border-left: 1px solid var(--c-fog);
      padding-left: 14px;
    }}

    .field-controls {{
      display: flex;
      align-items: center;
      gap: 16px;
    }}

    .field-btn {{
      font-family: var(--font-mono);
      font-size: 10.5px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--c-graphite);
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px 0;
      transition: color 0.15s;
    }}
    .field-btn:hover {{ color: var(--c-red-bird); }}

    /* Opening Splash Stage */
    .splash-hero-stage {{
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px 20px 36px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }}
    .splash-hero-img {{
      width: 100%;
      max-width: 1050px;
      mix-blend-mode: multiply;
      -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%);
      mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%);
      margin-bottom: 20px;
    }}
    .splash-enter-btn {{
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 24px;
      border: 1px solid var(--c-red-bird);
      background: var(--c-paper);
      color: var(--c-red-bird);
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.15s;
    }}
    .splash-enter-btn:hover {{
      background: var(--c-red-bird);
      color: var(--c-paper);
    }}

    /* Main Workspace Layout */
    .field-workspace {{
      max-width: 1440px;
      margin: 0 auto;
      width: 100%;
      display: grid;
      grid-template-columns: 260px 1fr 340px;
      border-top: 1px solid var(--c-fog);
      position: relative;
    }}

    /* Left Sticky Nav Sidebar */
    .field-sidebar {{
      border-right: 1px solid var(--c-fog);
      background: var(--c-paper);
      height: calc(100vh - 50px);
      position: sticky;
      top: 50px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }}

    .sidebar-filter-wrap {{
      padding: 10px 12px;
      border-bottom: 1px solid var(--c-fog);
      background: var(--c-bone);
    }}
    .sidebar-filter-input {{
      width: 100%;
      background: var(--c-paper);
      border: 1px solid var(--c-fog);
      padding: 6px 8px;
      font-family: var(--font-mono);
      font-size: 10.5px;
      outline: none;
      color: var(--c-soot);
    }}

    .sidebar-nav-scroll {{
      flex: 1;
      overflow-y: auto;
    }}

    .sidebar-plate-link {{
      padding: 8px 12px;
      border-bottom: 1px solid var(--c-grid-line);
      cursor: pointer;
      display: flex;
      gap: 8px;
      text-decoration: none;
      color: inherit;
      transition: all 0.1s;
    }}
    .sidebar-plate-link:hover {{ background: var(--c-bone); }}
    .sidebar-plate-link.active {{
      background: var(--c-bone);
      border-left: 3px solid var(--c-red-bird);
    }}
    .sidebar-roman {{
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 700;
      color: var(--c-red-bird);
      min-width: 22px;
    }}
    .sidebar-title {{
      font-family: var(--font-typewriter);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      line-height: 1.2;
    }}

    /* Middle Fluid Monograph Stream */
    .field-stream-main {{
      padding: 30px 48px 160px 48px;
      background: var(--c-paper);
      position: relative;
    }}

    /* Continuous Cartographic Place Line in Gutter */
    .place-line-track {{
      position: absolute;
      left: 16px;
      top: 0;
      bottom: 0;
      width: 1px;
      background: var(--c-grid-line);
    }}

    .world-monograph-section {{
      padding-top: 36px;
      padding-bottom: 80px;
      border-bottom: 1px solid var(--c-fog);
      margin-bottom: 50px;
      position: relative;
    }}

    /* Cartographic Place Ticker */
    .place-ticker {{
      position: absolute;
      left: -38px;
      top: 42px;
      font-family: var(--font-mono);
      font-size: 9.5px;
      letter-spacing: 1.5px;
      color: var(--c-dirt);
      text-transform: uppercase;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      user-select: none;
    }}

    .plate-clean-header {{
      margin-bottom: 20px;
      border-bottom: 1px solid var(--c-fog);
      padding-bottom: 12px;
    }}
    .plate-clean-meta {{
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--c-dirt);
      margin-bottom: 6px;
    }}
    .plate-clean-h1 {{
      font-family: var(--font-display);
      font-size: 32px;
      font-weight: 900;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--c-soot);
      margin-bottom: 2px;
      line-height: 1.15;
    }}
    .plate-clean-sub {{
      font-family: var(--font-typewriter);
      font-size: 14.5px;
      font-style: italic;
      color: var(--c-graphite);
    }}

    /* ORGANIC IMAGE BLEND: Merged directly into the paper fibers */
    .monograph-img-plate {{
      width: 100%;
      max-width: 820px;
      margin: 16px 0 24px 0;
      mix-blend-mode: multiply;
      -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
      mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
      filter: contrast(102%) brightness(98%);
    }}

    .system-invariant-box {{
      background: var(--c-bone);
      border-left: 3px solid var(--c-red-bird);
      padding: 10px 16px;
      margin-bottom: 24px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--c-soot);
      line-height: 1.5;
    }}
    .system-invariant-box strong {{
      color: var(--c-red-bird);
      text-transform: uppercase;
      letter-spacing: 1px;
      font-size: 10.5px;
      display: block;
      margin-bottom: 2px;
    }}

    /* Fluid Typewritten Text Body */
    .fluid-story-body {{
      max-width: 760px;
      font-family: var(--font-typewriter);
      font-size: 16px;
      line-height: 1.85;
      color: var(--c-soot);
      text-align: justify;
      hyphens: auto;
    }}
    .fluid-story-body p {{
      margin-bottom: 20px;
      text-indent: 1.6em;
    }}
    .fluid-story-body p:first-of-type {{
      text-indent: 0;
    }}
    .fluid-story-body blockquote {{
      border-left: 3px solid var(--c-red-bird);
      padding: 12px 18px;
      background: var(--c-bone);
      margin: 24px 0;
      font-style: italic;
      text-indent: 0;
      font-size: 16.5px;
    }}

    .plate-concepts-row {{
      margin-top: 30px;
      padding-top: 14px;
      border-top: 1px dashed var(--c-fog);
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
    }}
    .concepts-label {{
      font-family: var(--font-mono);
      font-size: 9.5px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--c-dirt);
      margin-right: 4px;
    }}
    .concept-tag-btn {{
      background: var(--c-bone);
      border: 1px solid var(--c-fog);
      padding: 3px 8px;
      font-family: var(--font-mono);
      font-size: 10.5px;
      color: var(--c-red-bird);
      cursor: pointer;
      text-transform: uppercase;
      transition: all 0.15s;
    }}
    .concept-tag-btn:hover {{
      background: var(--c-red-bird);
      color: var(--c-paper);
      border-color: var(--c-red-bird);
    }}

    /* Right Sticky Marginalia & Field Dossier Rail */
    .field-marginalia-rail {{
      border-left: 1px solid var(--c-fog);
      background: var(--c-paper);
      height: calc(100vh - 50px);
      position: sticky;
      top: 50px;
      overflow-y: auto;
      padding: 20px 18px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }}

    .marginalia-block {{
      border-bottom: 1px dashed var(--c-fog);
      padding-bottom: 16px;
    }}
    .marginalia-header {{
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--c-red-bird);
      font-weight: 700;
      margin-bottom: 6px;
    }}
    .marginalia-content {{
      font-family: var(--font-typewriter);
      font-size: 12.5px;
      line-height: 1.5;
      color: var(--c-graphite);
    }}
    .marginalia-spec-code {{
      font-family: var(--font-mono);
      font-size: 11px;
      background: var(--c-bone);
      padding: 8px;
      border-left: 2px solid var(--c-red-bird);
      overflow-x: auto;
      white-space: pre-wrap;
      color: var(--c-soot);
      margin-top: 6px;
    }}

    /* Mobile Place Navigation & Bottom Sheet */
    .mobile-controls-bar {{
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(237, 232, 223, 0.98);
      border-top: 1px solid var(--c-fog);
      padding: 10px 16px;
      z-index: 120;
      justify-content: space-between;
      align-items: center;
      backdrop-filter: blur(8px);
    }}

    /* Floating Safe Concept Drawer */
    #concept-modal-drawer {{
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 380px;
      background: var(--c-paper);
      border: 1px solid var(--c-red-bird);
      box-shadow: 4px 8px 24px rgba(0,0,0,0.18);
      padding: 18px 22px;
      z-index: 250;
      display: none;
    }}
    .drawer-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--c-fog);
      padding-bottom: 6px;
      margin-bottom: 10px;
    }}
    .drawer-title {{
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 700;
      color: var(--c-red-bird);
      text-transform: uppercase;
      letter-spacing: 1px;
    }}
    .drawer-close {{
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: var(--c-graphite);
    }}
    .drawer-body {{
      font-family: var(--font-typewriter);
      font-size: 13.5px;
      line-height: 1.55;
      color: var(--c-soot);
    }}

    /* Full Atlas Overlay */
    #full-atlas-overlay {{
      position: fixed;
      inset: 0;
      background: rgba(237, 232, 223, 0.98);
      z-index: 500;
      display: none;
      flex-direction: column;
      padding: 30px;
      overflow-y: auto;
    }}
    .atlas-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 14px;
      margin-top: 20px;
    }}
    .atlas-card {{
      background: var(--c-bone);
      border: 1px solid var(--c-fog);
      padding: 12px;
      cursor: pointer;
      transition: all 0.15s;
    }}
    .atlas-card:hover {{
      border-color: var(--c-red-bird);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(155, 29, 29, 0.15);
    }}

    /* RESPONSIVE BREAKPOINTS (Mobile & Tablet) */
    @media (max-width: 1200px) {{
      .field-workspace {{ grid-template-columns: 240px 1fr; }}
      .field-marginalia-rail {{ display: none; }}
    }}

    @media (max-width: 800px) {{
      .field-workspace {{ grid-template-columns: 1fr; }}
      .field-sidebar {{ display: none; }}
      .field-stream-main {{ padding: 20px 16px 80px 24px; }}
      .place-ticker {{ display: none; }}
      .mobile-controls-bar {{ display: flex; }}
      .plate-clean-h1 {{ font-size: 26px; }}
      .fluid-story-body {{ font-size: 15.5px; line-height: 1.75; }}
      #concept-modal-drawer {{
        left: 16px;
        right: 16px;
        bottom: 60px;
        width: auto;
      }}
    }}
  </style>
</head>
<body>

  <div id="progress-line"></div>

  <!-- Global Field Header -->
  <header class="field-header">
    <div style="display: flex; align-items: center; gap: 14px;">
      <a href="#splash" class="field-brand">WORLDFUL</a>
      <div class="field-current-plate" id="active-plate-label">
        PLATE 0 &bull; THE CROSSING
      </div>
    </div>

    <nav class="field-controls">
      <button class="field-btn" onclick="openAtlasOverlay()">ATLAS INDEX</button>
      <button class="field-btn" onclick="jumpToNext()">NEXT PLATE &darr;</button>
    </nav>
  </header>

  <!-- Opening Splash Stage -->
  <section class="splash-hero-stage" id="splash">
    <img src="readable_book/assets/images/splash_hero.png" alt="WORLDFUL Atlas Field Station Opening Plate" class="splash-hero-img">
    <button class="splash-enter-btn" onclick="scrollToStream()">
      ENTER THE ARCHIVE STREAM &darr;
    </button>
  </section>

  <!-- Main Tri-Column Workspace -->
  <main class="field-workspace" id="stream-workspace">

    <!-- Left Sticky Nav Sidebar -->
    <aside class="field-sidebar">
      <div class="sidebar-filter-wrap">
        <input type="text" id="filter-input" class="sidebar-filter-input" placeholder="Search 33 Plates...">
      </div>
      <div class="sidebar-nav-scroll" id="sidebar-nav-container">
        <!-- Injected via JS -->
      </div>
    </aside>

    <!-- Center Infinite Monograph Stream with Place Lines -->
    <section class="field-stream-main" id="monograph-stream">
      <div class="place-line-track"></div>
      <!-- 34 Fluid Plates Injected via JS -->
    </section>

    <!-- Right Sticky Marginalia & Lineage Rail -->
    <aside class="field-marginalia-rail" id="marginalia-rail">
      <div class="marginalia-block">
        <div class="marginalia-header">ACTIVE PLATE DOSSIER</div>
        <div class="marginalia-content" id="rail-plate-info">
          Select or scroll to a plate to view field notes, thinkers, and formal system state specifications.
        </div>
      </div>

      <div class="marginalia-block">
        <div class="marginalia-header">PHILOSOPHICAL THINKERS</div>
        <div class="marginalia-content" id="rail-thinkers-info">
          —
        </div>
      </div>

      <div class="marginalia-block">
        <div class="marginalia-header">MATERIAL & LIVED ANCESTRY</div>
        <div class="marginalia-content" id="rail-grounded-info">
          —
        </div>
      </div>

      <div class="marginalia-block">
        <div class="marginalia-header">FORMAL STATE MODEL</div>
        <div class="marginalia-spec-code" id="rail-spec-code">
          # Ready for plate inspection
        </div>
      </div>
    </aside>

  </main>

  <!-- Mobile Bottom Controls -->
  <div class="mobile-controls-bar">
    <button class="field-btn" onclick="openAtlasOverlay()">ATLAS INDEX</button>
    <div style="font-family: var(--font-mono); font-size: 10px; color: var(--c-red-bird); font-weight: 700;" id="mobile-plate-label">PLATE 0</div>
    <button class="field-btn" onclick="jumpToNext()">NEXT &darr;</button>
  </div>

  <!-- Safe Concept Modal Drawer -->
  <div id="concept-modal-drawer">
    <div class="drawer-header">
      <div class="drawer-title" id="drawer-term-name">TERM</div>
      <button class="drawer-close" onclick="closeConceptDrawer()">&times;</button>
    </div>
    <div class="drawer-body" id="drawer-term-desc">
      Definition.
    </div>
  </div>

  <!-- Full Atlas Index Overlay -->
  <div id="full-atlas-overlay">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--c-fog); padding-bottom: 12px;">
      <div>
        <div style="font-family: var(--font-mono); font-size: 10.5px; color: var(--c-red-bird); font-weight: 700; letter-spacing: 2px;">ATLAS CONSTELLATION</div>
        <h2 style="font-family: var(--font-display); font-size: 24px; font-weight: 900;">THE 33 WORLDS OF DESCRIPTION</h2>
      </div>
      <button class="field-btn" onclick="closeAtlasOverlay()" style="font-size: 13px;">CLOSE [ESC]</button>
    </div>

    <div class="atlas-grid" id="atlas-cards-target">
      <!-- Grid injected via JS -->
    </div>
  </div>

  <script>
    const CHAPTERS = {chapters_json};
    const GLOSSARY = {glossary_json};
    let currentObservedId = 0;

    function init() {{
      renderSidebarLinks();
      renderFluidMonographStream();
      renderAtlasCards();
      setupScrollSpy();
      setupProgressBar();
      updateMarginaliaRail(0);

      // Search
      document.getElementById('filter-input').addEventListener('input', (e) => {{
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.sidebar-plate-link').forEach(item => {{
          item.style.display = item.innerText.toLowerCase().includes(q) ? 'flex' : 'none';
        }});
      }});

      // Keyboard
      document.addEventListener('keydown', (e) => {{
        if (e.key === 'Escape') {{
          closeAtlasOverlay();
          closeConceptDrawer();
        }}
      }});
    }}

    function renderSidebarLinks() {{
      const container = document.getElementById('sidebar-nav-container');
      container.innerHTML = CHAPTERS.map((ch, idx) => `
        <a href="#world-${{String(ch.id).padStart(2, '0')}}" class="sidebar-plate-link ${{idx === 0 ? 'active' : ''}}" id="side-link-${{ch.id}}">
          <div class="sidebar-roman">${{ch.roman}}</div>
          <div class="sidebar-title">${{ch.title}}</div>
        </a>
      `).join('');
    }}

    function renderFluidMonographStream() {{
      const stream = document.getElementById('monograph-stream');
      stream.innerHTML = CHAPTERS.map(ch => {{
        let parsed = marked.parse(ch.prose);

        let imgTag = '';
        if (ch.has_img && ch.img_src) {{
          imgTag = `<img src="${{ch.img_src}}" alt="Plate ${{ch.roman}} Field Document" class="monograph-img-plate" loading="lazy">`;
        }}

        let conceptBtns = ch.terms.map(t => `
          <button class="concept-tag-btn" onclick="openConcept('${{t.replace(/'/g, "\\\\\\'")}}')">${{t}}</button>
        `).join('');

        return `
          <article class="world-monograph-section" id="world-${{String(ch.id).padStart(2, '0')}}" data-id="${{ch.id}}" data-title="${{ch.title}}" data-roman="${{ch.roman}}">
            
            <div class="place-ticker">${{ch.coords[0]}} &bull; ${{ch.coords[1]}}</div>

            <div class="plate-clean-header">
              <div class="plate-clean-meta">PLATE ${{ch.roman}} &bull; ARCHIVE NO. WF-23-${{String.fromCharCode(65 + (ch.id % 26))}} &bull; ${{ch.coords[2]}}</div>
              <h1 class="plate-clean-h1">${{ch.title}}</h1>
              <div class="plate-clean-sub">${{ch.subtitle}}</div>
            </div>

            ${{imgTag}}

            <div class="system-invariant-box">
              <strong>Governing Law / System Invariant:</strong>
              ${{ch.invariant}}
            </div>

            <div class="fluid-story-body">
              ${{parsed}}
            </div>

            <div class="plate-concepts-row">
              <span class="concepts-label">Core Concepts:</span>
              ${{conceptBtns}}
            </div>

          </article>
        `;
      }}).join('');
    }}

    function renderAtlasCards() {{
      const grid = document.getElementById('atlas-cards-target');
      grid.innerHTML = CHAPTERS.map(ch => `
        <div class="atlas-card" onclick="jumpToWorldId(${{ch.id}}); closeAtlasOverlay();">
          <div style="font-family: var(--font-mono); font-size: 10px; color: var(--c-red-bird); font-weight: 700;">PLATE ${{ch.roman}}</div>
          <div style="font-family: var(--font-mono); font-size: 12px; font-weight: 700; text-transform: uppercase; margin: 4px 0;">${{ch.title}}</div>
          <div style="font-family: var(--font-typewriter); font-size: 11px; font-style: italic; color: var(--c-graphite);">${{ch.subtitle}}</div>
        </div>
      `).join('');
    }}

    function updateMarginaliaRail(wid) {{
      const ch = CHAPTERS.find(c => c.id === wid);
      if (!ch) return;
      
      const railPlate = document.getElementById('rail-plate-info');
      const railThinkers = document.getElementById('rail-thinkers-info');
      const railGrounded = document.getElementById('rail-grounded-info');
      const railSpec = document.getElementById('rail-spec-code');

      if (railPlate) railPlate.innerText = `PLATE ${{ch.roman}}: ${{ch.title}} (${{ch.coords[0]}}, ${{ch.coords[1]}})`;
      if (railThinkers) railThinkers.innerText = ch.literature_thinkers || "Field station observational notes under review.";
      if (railGrounded) railGrounded.innerText = ch.grounded_ancestry || "Lived practice and historical memory traces.";
      if (railSpec) railSpec.innerText = ch.yaml_spec || "# Formal invariant active";
    }}

    function setupScrollSpy() {{
      const sections = document.querySelectorAll('.world-monograph-section');
      const observer = new IntersectionObserver((entries) => {{
        entries.forEach(entry => {{
          if (entry.isIntersecting) {{
            const id = entry.target.getAttribute('data-id');
            const title = entry.target.getAttribute('data-title');
            const roman = entry.target.getAttribute('data-roman');
            currentObservedId = parseInt(id);

            document.getElementById('active-plate-label').innerText = `PLATE ${{roman}} \u2022 ${{title}}`;
            const mobileLabel = document.getElementById('mobile-plate-label');
            if (mobileLabel) mobileLabel.innerText = `PLATE ${{roman}}`;

            document.querySelectorAll('.sidebar-plate-link').forEach(a => a.classList.remove('active'));
            const activeLink = document.getElementById(`side-link-${{id}}`);
            if (activeLink) {{
              activeLink.classList.add('active');
              activeLink.scrollIntoView({{ block: 'nearest', behavior: 'smooth' }});
            }}

            updateMarginaliaRail(currentObservedId);
          }}
        }});
      }}, {{ rootMargin: "-15% 0px -75% 0px" }});

      sections.forEach(s => observer.observe(s));
    }}

    function setupProgressBar() {{
      window.addEventListener('scroll', () => {{
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('progress-line').style.width = scrolled + "%";
      }});
    }}

    function openConcept(rawTerm) {{
      const cleanKey = rawTerm.trim().toLowerCase();
      let item = GLOSSARY[cleanKey];
      if (!item) {{
        for (let k in GLOSSARY) {{
          if (k.includes(cleanKey) || cleanKey.includes(k)) {{
            item = GLOSSARY[k];
            break;
          }}
        }}
      }}
      
      const termName = item ? item.name : rawTerm;
      const termDef = item ? item.definition : "Operational definition under field investigation in the WORLDFUL archive.";
      
      document.getElementById('drawer-term-name').innerText = termName;
      document.getElementById('drawer-term-desc').innerText = termDef;
      document.getElementById('concept-modal-drawer').style.display = 'block';
    }}

    function closeConceptDrawer() {{
      document.getElementById('concept-modal-drawer').style.display = 'none';
    }}

    function openAtlasOverlay() {{
      document.getElementById('full-atlas-overlay').style.display = 'flex';
    }}

    function closeAtlasOverlay() {{
      document.getElementById('full-atlas-overlay').style.display = 'none';
    }}

    function jumpToWorldId(id) {{
      const target = document.getElementById(`world-${{String(id).padStart(2, '0')}}`);
      if (target) target.scrollIntoView({{ behavior: 'smooth' }});
    }}

    function jumpToNext() {{
      if (currentObservedId < CHAPTERS.length - 1) {{
        jumpToWorldId(currentObservedId + 1);
      }}
    }}

    function scrollToStream() {{
      document.getElementById('stream-workspace').scrollIntoView({{ behavior: 'smooth' }});
    }}

    window.onload = init;
  </script>
</body>
</html>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_code)

with open("reader.html", "w", encoding="utf-8") as f:
    f.write(html_code)

print(f"Generated Organic Blended Reader with Marginalia Rail and Place Lines in index.html ({len(html_code):,} bytes)")
