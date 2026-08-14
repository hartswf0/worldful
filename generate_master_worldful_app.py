import json
import os
import re
from pathlib import Path

from update_readable_book import CHAPTERS
from enhance_books import PRAGMATIC_METADATA
from synthesize_master_edition import extract_lineage, extract_b_specs
from build_infinite_scroll_reader import coordinates

roman_numerals = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", 
                  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
                  "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX",
                  "XXXI", "XXXII", "XXXIII"]

# Master Glossary
glossary_dict = {}
for wid, data in PRAGMATIC_METADATA.items():
    for term, definition in data.get("key_terms", {}).items():
        key = term.strip().lower()
        glossary_dict[key] = {
            "name": term,
            "definition": definition,
            "world_id": wid,
            "world_title": data["title"],
            "category": "Core Principle"
        }

for wid, cdata in CHAPTERS.items():
    for term in cdata.get("terms", []):
        key = term.strip().lower()
        if key not in glossary_dict:
            glossary_dict[key] = {
                "name": term,
                "definition": f"Core operational dynamic formulated in World {wid:02d}: {cdata['title']}.",
                "world_id": wid,
                "world_title": cdata["title"],
                "category": "Operational Invariant"
            }

chapters_data = []

for wid in range(34):
    cdata = CHAPTERS[wid]
    img_path = f"readable_book/assets/images/plate_{wid:02d}.png"
    has_img = os.path.exists(img_path)
    
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

    yaml_spec = f"""# FORMAL STATE MACHINE
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
        "thinkers": literature,
        "ancestry": grounded,
        "computational": code_math,
        "yaml_spec": yaml_spec,
        "core_problem": meta.get("core_problem", ""),
        "decision_rule": meta.get("decision_rule", "")
    })

chapters_json = json.dumps(chapters_data, ensure_ascii=False)
glossary_json = json.dumps(glossary_dict, ensure_ascii=False)

favicon_svg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23ebe6da'/%3E%3Ccircle cx='16' cy='16' r='14' fill='none' stroke='%239e2318' stroke-width='1.5' stroke-dasharray='3,2'/%3E%3Cpath d='M10 22 C14 14 20 12 24 10 C22 15 18 20 12 23 Z' fill='%239e2318'/%3E%3Ccircle cx='22' cy='11' r='1' fill='%23211d18'/%3E%3C/svg%3E"

html_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>WORLDFUL PRESS — Atlas, Archive, Field Station</title>
  
  <link rel="icon" type="image/svg+xml" href="{favicon_svg}">
  
  <!-- Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap" rel="stylesheet">
  
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

  <style>
    /* ============ TOKENS ============ */
    :root {{
      --paper:      #ebe6da;
      --paper-hi:   #f2eee4;
      --paper-lo:   #ddd5c4;
      --scrap:      #d9cfba;
      --scrap-2:    #cfc3aa;
      --ink:        #211d18;
      --ink-soft:   #57503f;
      --ink-faint:  #8a8170;
      --red:        #9e2318;
      --red-soft:   #b03a2c;
      --tape:       rgba(201,181,138,.55);
      --hair:       rgba(33,29,24,.22);

      --display: "Playfair Display", "Didot", "Georgia", serif;
      --serif:   "Newsreader", "Georgia", "Times New Roman", serif;
      --mono:    "IBM Plex Mono", "Courier Prime", monospace;
      --hand:    "Caveat", cursive, sans-serif;
    }}

    * {{ margin:0; padding:0; box-sizing:border-box; }}
    html {{ background:#b9b0a0; scroll-behavior: smooth; }}
    body {{
      font-family:var(--serif);
      color:var(--ink);
      background:var(--paper);
      min-height:100vh;
      overflow-x:hidden;
    }}

    /* Paper grain */
    body::after {{
      content:""; position:fixed; inset:0; z-index:90; pointer-events:none;
      opacity:.45; mix-blend-mode:multiply;
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.45 0 0 0 0 0.42 0 0 0 0 0.36 0 0 0 0.28 0'/></filter><rect width='240' height='240' filter='url(%23n)'/></svg>");
    }}
    /* Soft vignette */
    body::before {{
      content:""; position:fixed; inset:0; z-index:89; pointer-events:none;
      background:radial-gradient(120% 120% at 50% 40%, transparent 60%, rgba(60,50,35,.15) 100%);
    }}

    /* Scrollbar */
    ::-webkit-scrollbar {{ width: 6px; height: 6px; }}
    ::-webkit-scrollbar-track {{ background: var(--paper); border-left: 1px solid var(--hair); }}
    ::-webkit-scrollbar-thumb {{ background: var(--ink-faint); border-radius: 2px; }}
    ::-webkit-scrollbar-thumb:hover {{ background: var(--red); }}

    .sheet {{
      position:relative;
      max-width:1480px;
      margin:0 auto;
      background:
        radial-gradient(90% 60% at 70% 10%, rgba(255,255,255,.35), transparent 60%),
        var(--paper);
      box-shadow:0 0 60px rgba(40,32,20,.35);
      min-height: 100vh;
    }}

    /* Reading Progress Line */
    #progress-line {{
      position: fixed;
      top: 0; left: 0; height: 3px;
      background: var(--red);
      width: 0%; z-index: 1000;
      transition: width 0.1s ease-out;
    }}

    /* Margin apparatus */
    .marginalia {{ position:absolute; inset:0; pointer-events:none; z-index:5; }}
    .m-vert {{
      position:absolute; font-family:var(--mono); font-size:.62rem;
      letter-spacing:.28em; color:var(--ink-soft);
      writing-mode:vertical-rl; transform:rotate(180deg);
    }}
    .m-vert.coord {{ left:1.1rem; top:6rem; }}
    .m-vert.archive {{ left:1.1rem; bottom:16rem; }}
    .cross {{ position:absolute; width:26px; height:26px; }}
    .cross::before,.cross::after {{ content:""; position:absolute; background:var(--ink-soft); }}
    .cross::before {{ left:50%; top:0; width:1px; height:100%; }}
    .cross::after {{ top:50%; left:0; height:1px; width:100%; }}
    .cross i {{ position:absolute; inset:6px; border:1px solid var(--ink-soft); border-radius:50%; }}
    .cross.red::before,.cross.red::after {{ background:var(--red); }}
    .cross.tl {{ left:2rem; top:4.4rem; }}
    .cross.bl {{ left:2rem; bottom:22rem; }}
    .plus {{ position:absolute; color:var(--red); font-family:var(--mono); font-size:1.15rem; }}
    .plus.p1 {{ right:24%; top:7%; }}
    .plus.p2 {{ right:2.2%; bottom:26%; }}

    /* ============ HEADER ============ */
    header.site-header {{
      position:sticky; top:0; z-index:100;
      display:flex; align-items:center; justify-content:space-between;
      padding:1.2rem 3.4rem 1.2rem 5.2rem;
      background: rgba(235, 230, 218, 0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--hair);
    }}
    .brand {{ text-decoration:none; color:inherit; }}
    .brand .name {{
      font-family:var(--mono); font-size:.78rem; font-weight:700; letter-spacing:.22em;
    }}
    .brand .sub {{
      font-family:var(--mono); font-size:.56rem; letter-spacing:.24em; color:var(--ink-soft); margin-top:.2rem;
    }}
    nav.main-nav {{ display:flex; gap:2.6rem; }}
    nav.main-nav a {{
      font-family:var(--mono); font-size:.68rem; letter-spacing:.24em;
      color:var(--ink); text-decoration:none; position:relative; padding-bottom:.25rem;
      cursor:pointer;
    }}
    nav.main-nav a::after {{
      content:""; position:absolute; left:0; bottom:0; height:1px; width:0;
      background:var(--red); transition:width .25s ease;
    }}
    nav.main-nav a.active::after, nav.main-nav a:hover::after {{ width:100%; }}

    .search-btn {{
      display:flex; align-items:center; gap:.55rem; font-family:var(--mono);
      font-size:.66rem; letter-spacing:.22em; color:var(--ink); background:none; border:none; cursor:pointer;
      padding: 4px 8px; border: 1px solid transparent;
    }}
    .search-btn:hover {{ border-color: var(--red); color: var(--red); }}
    .search-btn .dot {{ width:6px; height:6px; border-radius:50%; background:var(--red); margin-left:.4rem; }}

    /* ============ VIEWS CONTAINER ============ */
    .view-section {{ display:none; position:relative; z-index:10; }}
    .view-section.active {{ display:block; }}

    /* ============ HERO SECTION ============ */
    .hero {{
      position:relative;
      padding:2.2rem 3.4rem 2rem 5.2rem;
      min-height:640px;
    }}
    h1.hero-title {{
      font-family:var(--display);
      font-weight:700;
      font-size:clamp(4rem, 11vw, 9.5rem);
      letter-spacing:.04em;
      line-height:.92;
      color:var(--ink);
    }}
    .tick {{ width:34px; height:3px; background:var(--red); margin:1.6rem 0 1.2rem; }}
    .thesis {{
      font-family:var(--mono); font-size:clamp(.95rem,1.7vw,1.3rem);
      letter-spacing:.32em; line-height:1.7; font-weight:700; max-width:34ch;
    }}
    .lede {{
      font-family:var(--serif); font-size:1.25rem; line-height:1.6;
      margin-top:1.6rem; max-width:28ch; color:var(--ink);
    }}
    .hero-ctas {{ display:flex; gap:16px; margin-top:2rem; flex-wrap:wrap; }}
    .cta {{
      display:inline-flex; align-items:center; gap:1.2rem;
      padding:.9rem 1.8rem;
      border:1.5px solid var(--red); color:var(--red);
      font-family:var(--mono); font-size:.76rem; letter-spacing:.28em;
      text-decoration:none; background:rgba(255,255,255,.2);
      cursor:pointer; transition:all .2s ease;
    }}
    .cta:hover {{ background:var(--red); color:var(--paper-hi); }}
    .cta.secondary {{
      border-color: var(--ink-soft); color: var(--ink); background: none;
    }}
    .cta.secondary:hover {{ background: var(--ink); color: var(--paper-hi); }}

    .hero-left {{ max-width:620px; position:relative; z-index:6; }}

    /* ACTUAL HERO SPLASH IMAGE EMBEDDED WITH ORGANIC BLEND */
    .hero-splash-card {{
      position:absolute; right:3.4rem; top:2rem; width:52%; max-width:680px;
      z-index:4;
    }}
    .hero-splash-img {{
      width:100%; display:block;
      mix-blend-mode: multiply;
      -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 84%, rgba(0,0,0,0) 100%);
      mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 84%, rgba(0,0,0,0) 100%);
      filter: contrast(104%) brightness(98%);
    }}

    /* ============ 33 WORLDS GRID ============ */
    .worlds-section {{
      padding:2rem 3.4rem 4rem 5.2rem;
      border-top:1px solid var(--hair);
      margin:2rem 2.2rem 0 2.2rem;
    }}
    .section-header-row {{
      display:flex; align-items:baseline; justify-content:space-between; flex-wrap:wrap; gap:1.4rem;
      margin-bottom:2rem;
    }}
    .section-title-wrap {{ display:flex; align-items:baseline; gap:1rem; }}
    .section-title-wrap h2 {{
      font-family:var(--mono); font-size:1.1rem; letter-spacing:.32em; font-weight:700;
    }}
    .section-title-wrap .mark {{ color:var(--red); font-family:var(--mono); font-size:1.2rem; }}
    .section-title-wrap em {{
      font-family:var(--serif); font-style:italic; font-size:.95rem; color:var(--ink-soft);
    }}

    .world-grid {{
      display:grid; grid-template-columns:repeat(4, 1fr); gap:1.6rem;
    }}
    .world-card {{
      position:relative; border:1px solid var(--hair);
      background:
        linear-gradient(165deg, rgba(255,255,255,.35), rgba(255,255,255,0) 40%),
        var(--paper-hi);
      padding:1.4rem 1.4rem 1.2rem; overflow:hidden; min-height:360px;
      text-decoration:none; color:var(--ink); display:flex; flex-direction:column;
      cursor:pointer; transition:transform .25s ease, box-shadow .25s ease, border-color .25s;
    }}
    .world-card:hover {{
      transform:translateY(-4px);
      box-shadow:0 12px 28px rgba(40,32,18,.2);
      border-color:var(--red);
    }}
    .world-card .numeral {{
      font-family:var(--display); font-size:2.8rem; line-height:1; font-weight:700;
    }}
    .world-card .num-tick {{ width:24px; height:2px; background:var(--red); margin:.6rem 0 .7rem; }}
    .world-card h3 {{
      font-family:var(--mono); font-size:.74rem; letter-spacing:.18em; line-height:1.7; font-weight:700;
      text-transform:uppercase; margin-bottom:.4rem;
    }}
    .world-card .card-sub {{
      font-family:var(--serif); font-size:.84rem; font-style:italic; color:var(--ink-soft); line-height:1.4;
      margin-bottom:1rem;
    }}
    .world-card .card-art {{
      margin-top:auto; width:100%; border:1px solid var(--hair);
      mix-blend-mode:multiply; overflow:hidden;
    }}
    .world-card .card-art img {{
      width:100%; height:130px; object-fit:cover; display:block;
      filter:contrast(102%);
    }}

    /* ============ CONTINUOUS MONOGRAPH READER MODAL / FULL VIEW ============ */
    #reader-overlay-view {{
      display:none; position:fixed; inset:0; z-index:200;
      background:var(--paper); overflow-y:auto;
    }}
    .reader-top-bar {{
      position:sticky; top:0; z-index:10;
      display:flex; justify-content:space-between; align-items:center;
      padding:12px 32px; background:rgba(235, 230, 218, 0.96);
      border-bottom:1px solid var(--hair); backdrop-filter:blur(8px);
    }}
    .reader-workspace {{
      max-width:1380px; margin:0 auto;
      display:grid; grid-template-columns:260px 1fr 320px;
      border-top:1px solid var(--hair);
    }}
    .reader-sidebar {{
      border-right:1px solid var(--hair);
      height:calc(100vh - 52px); position:sticky; top:52px;
      overflow-y:auto; padding:12px;
    }}
    .reader-main-stream {{
      padding:40px 60px 160px;
    }}
    .reader-marginalia {{
      border-left:1px solid var(--hair);
      height:calc(100vh - 52px); position:sticky; top:52px;
      overflow-y:auto; padding:20px 16px;
    }}

    .monograph-article {{
      padding-bottom:80px; margin-bottom:60px; border-bottom:1px solid var(--hair);
    }}
    .monograph-plate-img {{
      width:100%; max-width:800px; margin:20px 0;
      mix-blend-mode:multiply;
      -webkit-mask-image:radial-gradient(ellipse at center, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
      mask-image:radial-gradient(ellipse at center, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
    }}
    .monograph-prose {{
      max-width:760px; font-family:var(--serif); font-size:1.15rem; line-height:1.85; color:var(--ink);
    }}
    .monograph-prose p {{ margin-bottom:20px; text-indent:1.8em; }}
    .monograph-prose p:first-of-type {{ text-indent:0; }}
    .monograph-prose blockquote {{
      border-left:3px solid var(--red); padding:12px 18px; background:var(--paper-hi);
      margin:24px 0; font-style:italic; font-size:1.1rem;
    }}

    /* ============ CROSSINGS, TRACES, INDEX, ABOUT SECTIONS ============ */
    .content-panel-page {{
      padding:3rem 5.2rem 5rem;
      max-width:1100px; margin:0 auto;
    }}
    .panel-h1 {{
      font-family:var(--display); font-size:3.2rem; font-weight:700; margin-bottom:1rem;
    }}
    .panel-lede {{
      font-family:var(--serif); font-size:1.3rem; line-height:1.6; color:var(--ink-soft); margin-bottom:2.5rem;
    }}

    /* Search Modal Overlay */
    #search-modal-overlay {{
      display:none; position:fixed; inset:0; z-index:300;
      background:rgba(33,29,24,.6); backdrop-filter:blur(4px);
      align-items:flex-start; justify-content:center; padding-top:10vh;
    }}
    .search-dialog {{
      background:var(--paper); border:1px solid var(--red);
      width:90%; max-width:680px; box-shadow:0 20px 50px rgba(0,0,0,.4);
      padding:24px;
    }}
    .search-input-box {{
      width:100%; background:var(--paper-hi); border:1px solid var(--ink-faint);
      padding:12px 16px; font-family:var(--mono); font-size:1rem; outline:none; color:var(--ink);
    }}
    .search-input-box:focus {{ border-color:var(--red); }}
    .search-results-list {{
      max-height:400px; overflow-y:auto; margin-top:16px;
    }}
    .search-res-item {{
      padding:10px 12px; border-bottom:1px solid var(--hair); cursor:pointer;
    }}
    .search-res-item:hover {{ background:var(--paper-hi); }}
    .search-res-title {{
      font-family:var(--mono); font-size:.85rem; font-weight:700; color:var(--red);
    }}
    .search-res-snippet {{
      font-family:var(--serif); font-size:.9rem; color:var(--ink-soft); margin-top:4px;
    }}

    /* Safe Concept Drawer */
    #concept-pop-drawer {{
      position:fixed; bottom:24px; right:24px; width:380px;
      background:var(--paper-hi); border:1px solid var(--red);
      box-shadow:4px 8px 24px rgba(0,0,0,.2); padding:18px 22px; z-index:400; display:none;
    }}

    footer.site-footer {{
      margin-top:4rem; padding:2rem 5.2rem; border-top:1px solid var(--hair);
      display:flex; justify-content:space-between; font-family:var(--mono); font-size:.62rem;
      letter-spacing:.24em; color:var(--ink-soft);
    }}

    @media (max-width:1100px) {{
      .hero-splash-card {{ display:none; }}
      .world-grid {{ grid-template-columns:repeat(2, 1fr); }}
      .reader-marginalia {{ display:none; }}
      .reader-workspace {{ grid-template-columns:220px 1fr; }}
    }}
    @media (max-width:760px) {{
      header.site-header {{ padding:1rem 1.4rem; }}
      nav.main-nav {{ display:none; }}
      .hero {{ padding:2rem 1.4rem; }}
      .worlds-section {{ padding:2rem 1.4rem; margin:1rem; }}
      .world-grid {{ grid-template-columns:1fr; }}
      .reader-sidebar {{ display:none; }}
      .reader-main-stream {{ padding:20px 14px; }}
      .content-panel-page {{ padding:2rem 1.4rem; }}
    }}
  </style>
</head>
<body>

<div class="sheet">
  <div id="progress-line"></div>

  <!-- Margin apparatus -->
  <div class="marginalia" aria-hidden="true">
    <span class="m-vert coord">23.9847&deg; N</span>
    <span class="m-vert archive">ARCHIVE NO. WF-23-A</span>
    <span class="cross tl"><i></i></span>
    <span class="cross bl"><i></i></span>
    <span class="plus p1">+</span>
    <span class="plus p2">+</span>
  </div>

  <!-- ===== HEADER ===== -->
  <header class="site-header">
    <a class="brand" onclick="switchTab('worlds')">
      <div class="name">WORLDFUL PRESS</div>
      <div class="sub">ATLAS, ARCHIVE, FIELD STATION</div>
    </a>
    <nav class="main-nav" aria-label="Primary">
      <a onclick="switchTab('worlds')" id="nav-worlds" class="active">WORLDS</a>
      <a onclick="switchTab('crossings')" id="nav-crossings">CROSSINGS</a>
      <a onclick="switchTab('traces')" id="nav-traces">TRACES</a>
      <a onclick="switchTab('index')" id="nav-index">INDEX</a>
      <a onclick="switchTab('about')" id="nav-about">ABOUT</a>
    </nav>
    <button class="search-btn" type="button" onclick="openSearchModal()">
      SEARCH
      <svg width="14" height="14" viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.4">
        <circle cx="6.2" cy="6.2" r="4.6"/><line x1="9.8" y1="9.8" x2="14" y2="14"/>
      </svg>
      <span class="dot"></span>
    </button>
  </header>

  <!-- ==================== TAB 1: WORLDS (HERO + GRID) ==================== -->
  <div id="tab-worlds-view" class="view-section active">

    <!-- HERO -->
    <section class="hero">
      <div class="hero-left">
        <h1 class="hero-title">WORLDFUL</h1>
        <div class="tick"></div>
        <p class="thesis">THE WORLD DOES NOT FIT THROUGH THE MOUTH</p>
        <p class="lede">The world is full of more than I can say. This is what crossed.</p>
        <div class="hero-ctas">
          <button class="cta" onclick="openReaderAtWorld(0)">
            ENTER STREAM &darr;
          </button>
          <a class="cta secondary" href="#world-grid-anchor">
            BROWSE 33 WORLDS &rarr;
          </a>
        </div>
      </div>

      <!-- Real Book Hero Splash Image -->
      <div class="hero-splash-card">
        <img src="readable_book/assets/images/splash_hero.png" alt="WORLDFUL Atlas Archival Hero Plate" class="hero-splash-img">
      </div>
    </section>

    <!-- WORLDS GRID -->
    <section class="worlds-section" id="world-grid-anchor">
      <div class="section-header-row">
        <div class="section-title-wrap">
          <h2>WORLDS</h2><span class="mark">+</span>
          <em>Places imagined. Crossings remembered.</em>
        </div>
        <div style="font-family:var(--mono); font-size:.7rem; color:var(--ink-soft); letter-spacing:.2em;">
          34 SURVEYED PLATES
        </div>
      </div>

      <div class="world-grid" id="worlds-grid-container">
        <!-- 34 Real Book Cards Injected via JS -->
      </div>
    </section>
  </div>

  <!-- ==================== TAB 2: CROSSINGS ==================== -->
  <div id="tab-crossings-view" class="view-section">
    <div class="content-panel-page">
      <h1 class="panel-h1">THE FIVE CROSSINGS</h1>
      <p class="panel-lede">How physical terrain passes through human mouths, marks, and systems of coordination.</p>
      
      <div style="display:grid; gap:24px; margin-top:30px;">
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:20px;">
          <h3 style="font-family:var(--mono); font-size:1rem; color:var(--red); margin-bottom:6px;">01. ENTER &bull; THE UNCOMPRESSED ENCOUNTER</h3>
          <p style="font-size:1.05rem; line-height:1.7;">The physical world sprawling in raw sensory resolution: wolf tracks in the switchgrass, mud temperature, wind velocity, and unmeasured friction.</p>
        </div>
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:20px;">
          <h3 style="font-family:var(--mono); font-size:1rem; color:var(--red); margin-bottom:6px;">02. OBSERVE &bull; MATERIAL RESISTANCE</h3>
          <p style="font-size:1.05rem; line-height:1.7;">The irreducible friction that resists flattery. Soil that refuses to obey the manifesto, isotopes in the bones, and tools that rust.</p>
        </div>
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:20px;">
          <h3 style="font-family:var(--mono); font-size:1rem; color:var(--red); margin-bottom:6px;">03. DESCRIBE &bull; THE LOSSY CUT</h3>
          <p style="font-size:1.05rem; line-height:1.7;">Selecting which single relation will travel while dropping ninety-nine percent of the terrain. Description travels only by what it leaves behind.</p>
        </div>
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:20px;">
          <h3 style="font-family:var(--mono); font-size:1rem; color:var(--red); margin-bottom:6px;">04. COMPRESS &bull; THE SIGN MACHINE</h3>
          <p style="font-size:1.05rem; line-height:1.7;">Transforming human bodily gestures into portable nouns, legal clauses, coordinate maps, database schemas, and model token weights.</p>
        </div>
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:20px;">
          <h3 style="font-family:var(--mono); font-size:1rem; color:var(--red); margin-bottom:6px;">05. RELEASE &bull; PORTABLE CONSEQUENCE</h3>
          <p style="font-size:1.05rem; line-height:1.7;">The microscopic trace traveling across centuries and borders to direct armies, build cathedrals, or crash financial markets.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== TAB 3: TRACES ==================== -->
  <div id="tab-traces-view" class="view-section">
    <div class="content-panel-page">
      <h1 class="panel-h1">MATERIAL TRACES</h1>
      <p class="panel-lede">Physical residues that anchor symbolic claims to material reality.</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
        <div style="border:1px solid var(--hair); background:var(--paper-hi); padding:20px;">
          <h4 style="font-family:var(--mono); font-size:.85rem; color:var(--red); margin-bottom:6px;">CANIS LUPUS TRACKS</h4>
          <p style="font-size:.95rem; line-height:1.6; color:var(--ink-soft);">Six wet commas in the switchgrass that redirected a child's trajectory over the pass before speech began.</p>
        </div>
        <div style="border:1px solid var(--hair); background:var(--paper-hi); padding:20px;">
          <h4 style="font-family:var(--mono); font-size:.85rem; color:var(--red); margin-bottom:6px;">THE POINTING FINGER</h4>
          <p style="font-size:.95rem; line-height:1.6; color:var(--ink-soft);">The root of deixis. Whoever captures joint attention owns the interpretive horizon of the room.</p>
        </div>
        <div style="border:1px solid var(--hair); background:var(--paper-hi); padding:20px;">
          <h4 style="font-family:var(--mono); font-size:.85rem; color:var(--red); margin-bottom:6px;">THE INVISIBLE HAMMER</h4>
          <p style="font-size:.95rem; line-height:1.6; color:var(--ink-soft);">A working tool remains phenomenologically transparent; only when the steel fractures do we notice the tool.</p>
        </div>
        <div style="border:1px solid var(--hair); background:var(--paper-hi); padding:20px;">
          <h4 style="font-family:var(--mono); font-size:.85rem; color:var(--red); margin-bottom:6px;">FORENSIC ISOTOPES</h4>
          <p style="font-size:.95rem; line-height:1.6; color:var(--ink-soft);">Strontium ratios in the enamel that remember where the body actually drank, indifferent to the passport.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== TAB 4: INDEX ==================== -->
  <div id="tab-index-view" class="view-section">
    <div class="content-panel-page">
      <h1 class="panel-h1">MASTER CONCEPT INDEX</h1>
      <p class="panel-lede">102 Defined Operational Invariants and Theoretical Lineages.</p>
      
      <input type="text" id="index-search-box" placeholder="Filter terms (e.g. Deixis, Goodhart, Tacit Knowledge)..." 
             style="width:100%; background:var(--paper-hi); border:1px solid var(--ink-faint); padding:10px 14px; font-family:var(--mono); font-size:.95rem; margin-bottom:24px; outline:none;">
      
      <div id="index-terms-list" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:16px;">
        <!-- Injected via JS -->
      </div>
    </div>
  </div>

  <!-- ==================== TAB 5: ABOUT ==================== -->
  <div id="tab-about-view" class="view-section">
    <div class="content-panel-page">
      <h1 class="panel-h1">ABOUT WORLDFUL</h1>
      <p class="panel-lede">A Field Treatise on the Epistemic Tragedy of Description.</p>
      <div style="font-family:var(--serif); font-size:1.15rem; line-height:1.9; color:var(--ink);">
        <p style="margin-bottom:20px;">Human beings survive by converting vast physical realities into compact, portable tokens. A sentence keeps the wolf and drops the wind direction; keeps the danger and drops ten thousand blades of grass.</p>
        <p style="margin-bottom:20px;">The catastrophe begins when institutions forget that the sign was cut. They mistreat the dashboard for the territory, the legal definition for the human grief, and the database schema for the landscape.</p>
        <blockquote style="border-left:3px solid var(--red); padding:14px 20px; background:var(--paper-hi); margin:30px 0; font-style:italic;">
          "The world does not fit through the mouth. The world is full of more than I can say. This is what crossed."
        </blockquote>
      </div>
    </div>
  </div>

  <!-- ===== FOOTER ===== -->
  <footer class="site-footer">
    <span>WORLDFUL PRESS &bull; ATLAS, ARCHIVE, FIELD STATION</span>
    <span>34 PLATES &bull; SURVEYED IV.23 &bull; WF-23-A</span>
  </footer>
</div>

<!-- ==================== FULL MONOGRAPH READER MODAL ==================== -->
<div id="reader-overlay-view">
  <div class="reader-top-bar">
    <div style="display:flex; align-items:center; gap:16px;">
      <button class="cta" onclick="closeReaderModal()" style="padding:6px 14px; font-size:.65rem;">
        &larr; BACK TO ATLAS
      </button>
      <div style="font-family:var(--mono); font-size:.75rem; font-weight:700; color:var(--red);" id="reader-top-plate-name">
        PLATE 0 &bull; THE CROSSING
      </div>
    </div>
    <div style="font-family:var(--mono); font-size:.65rem; color:var(--ink-soft); letter-spacing:.2em;">
      TYPEWRITER FIELD DISPATCH
    </div>
  </div>

  <div class="reader-workspace">
    <!-- Left Navigation List -->
    <aside class="reader-sidebar" id="reader-sidebar-list">
      <!-- Injected via JS -->
    </aside>

    <!-- Center Main Prose Stream -->
    <main class="reader-main-stream" id="reader-articles-stream">
      <!-- 34 Articles Injected via JS -->
    </main>

    <!-- Right Marginalia Rail -->
    <aside class="reader-marginalia" id="reader-marginalia-pane">
      <div style="border-bottom:1px dashed var(--hair); padding-bottom:14px; margin-bottom:16px;">
        <div style="font-family:var(--mono); font-size:.7rem; color:var(--red); font-weight:700; letter-spacing:.15em;">PHILOSOPHICAL THINKERS</div>
        <div style="font-family:var(--serif); font-size:.9rem; color:var(--ink-soft); margin-top:6px;" id="reader-pane-thinkers">—</div>
      </div>
      <div style="border-bottom:1px dashed var(--hair); padding-bottom:14px; margin-bottom:16px;">
        <div style="font-family:var(--mono); font-size:.7rem; color:var(--red); font-weight:700; letter-spacing:.15em;">MATERIAL ANCESTRY</div>
        <div style="font-family:var(--serif); font-size:.9rem; color:var(--ink-soft); margin-top:6px;" id="reader-pane-ancestry">—</div>
      </div>
      <div>
        <div style="font-family:var(--mono); font-size:.7rem; color:var(--red); font-weight:700; letter-spacing:.15em;">FORMAL STATE SPEC</div>
        <pre style="background:var(--paper-hi); padding:8px; font-family:var(--mono); font-size:.7rem; border-left:2px solid var(--red); white-space:pre-wrap; margin-top:6px;" id="reader-pane-yaml"># Formal Model</pre>
      </div>
    </aside>
  </div>
</div>

<!-- ==================== SEARCH OVERLAY ==================== -->
<div id="search-modal-overlay" onclick="handleSearchOverlayClick(event)">
  <div class="search-dialog" onclick="event.stopPropagation()">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <span style="font-family:var(--mono); font-size:.75rem; color:var(--red); font-weight:700; letter-spacing:.2em;">ATLAS SEARCH DISPATCH</span>
      <span style="font-family:var(--mono); font-size:.65rem; color:var(--ink-soft);">[ESC TO CLOSE]</span>
    </div>
    <input type="text" id="global-search-input" class="search-input-box" placeholder="Search worlds, concepts, thinkers, or invariants...">
    <div class="search-results-list" id="search-results-target">
      <!-- Injected via JS -->
    </div>
  </div>
</div>

<!-- ==================== CONCEPT POPOVER DRAWER ==================== -->
<div id="concept-pop-drawer">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--hair); padding-bottom:6px; margin-bottom:8px;">
    <div style="font-family:var(--mono); font-size:.8rem; color:var(--red); font-weight:700;" id="pop-term-title">TERM</div>
    <button onclick="closeConceptDrawer()" style="background:none; border:none; font-size:18px; cursor:pointer; color:var(--ink-soft);">&times;</button>
  </div>
  <div style="font-family:var(--serif); font-size:.95rem; line-height:1.5; color:var(--ink);" id="pop-term-body">
    Definition.
  </div>
</div>

<script>
  const CHAPTERS = {chapters_json};
  const GLOSSARY = {glossary_json};
  let currentReaderId = 0;

  function init() {{
    renderWorldsGrid();
    renderReaderArticles();
    renderReaderSidebar();
    renderIndexTab();
    setupSearch();
    setupProgressBar();

    document.addEventListener('keydown', (e) => {{
      if (e.key === 'Escape') {{
        closeSearchModal();
        closeConceptDrawer();
      }}
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {{
        e.preventDefault();
        openSearchModal();
      }}
    }});
  }}

  /* ============ TAB NAVIGATION ============ */
  function switchTab(tabName) {{
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('nav.main-nav a').forEach(a => a.classList.remove('active'));

    const targetSec = document.getElementById(`tab-${{tabName}}-view`);
    if (targetSec) targetSec.classList.add('active');

    const navLink = document.getElementById(`nav-${{tabName}}`);
    if (navLink) navLink.classList.add('active');

    window.scrollTo({{ top: 0, behavior: 'smooth' }});
  }}

  /* ============ RENDER WORLDS GRID ============ */
  function renderWorldsGrid() {{
    const container = document.getElementById('worlds-grid-container');
    container.innerHTML = CHAPTERS.map(ch => `
      <div class="world-card" onclick="openReaderAtWorld(${{ch.id}})">
        <div class="numeral">${{ch.roman}}</div>
        <div class="num-tick"></div>
        <h3>${{ch.title}}</h3>
        <div class="card-sub">${{ch.subtitle}}</div>
        <div class="card-art">
          <img src="${{ch.img_src}}" alt="Plate ${{ch.roman}} Archival Plate" loading="lazy">
        </div>
      </div>
    `).join('');
  }}

  /* ============ RENDER READER ARTICLES ============ */
  function renderReaderArticles() {{
    const stream = document.getElementById('reader-articles-stream');
    stream.innerHTML = CHAPTERS.map(ch => {{
      let parsed = marked.parse(ch.prose);
      return `
        <article class="monograph-article" id="monograph-plate-${{ch.id}}" data-id="${{ch.id}}">
          <div style="font-family:var(--mono); font-size:.7rem; color:var(--ink-soft); letter-spacing:.2em; margin-bottom:6px;">
            PLATE ${{ch.roman}} &bull; ${{ch.coords[0]}} &bull; ARCHIVE NO. WF-23-${{String.fromCharCode(65 + (ch.id % 26))}}
          </div>
          <h1 style="font-family:var(--display); font-size:2.8rem; font-weight:700; text-transform:uppercase; margin-bottom:4px;">
            ${{ch.title}}
          </h1>
          <div style="font-family:var(--serif); font-size:1.15rem; font-style:italic; color:var(--ink-soft); margin-bottom:20px;">
            ${{ch.subtitle}}
          </div>

          <img src="${{ch.img_src}}" alt="Plate ${{ch.roman}} Field Document" class="monograph-plate-img" loading="lazy">

          <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:10px 14px; margin-bottom:24px; font-family:var(--mono); font-size:.8rem;">
            <strong style="color:var(--red); display:block; margin-bottom:2px; letter-spacing:.1em;">SYSTEM INVARIANT:</strong>
            ${{ch.invariant}}
          </div>

          <div class="monograph-prose">
            ${{parsed}}
          </div>

          <div style="margin-top:24px; display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
            <span style="font-family:var(--mono); font-size:.65rem; color:var(--ink-soft); letter-spacing:.15em;">CONCEPTS:</span>
            ${{ch.terms.map(t => `
              <button onclick="showConceptDefinition('${{t.replace(/'/g, "\\\\\\'")}}')" style="background:var(--paper-hi); border:1px solid var(--hair); padding:3px 8px; font-family:var(--mono); font-size:.75rem; color:var(--red); cursor:pointer;">
                ${{t}}
              </button>
            `).join('')}}
          </div>
        </article>
      `;
    }}).join('');
  }}

  /* ============ RENDER READER SIDEBAR ============ */
  function renderReaderSidebar() {{
    const bar = document.getElementById('reader-sidebar-list');
    bar.innerHTML = CHAPTERS.map(ch => `
      <div onclick="jumpReaderToId(${{ch.id}})" style="padding:8px 10px; border-bottom:1px solid var(--hair); cursor:pointer; display:flex; gap:8px;" id="reader-side-link-${{ch.id}}">
        <span style="font-family:var(--mono); font-size:.7rem; font-weight:700; color:var(--red); min-width:20px;">${{ch.roman}}</span>
        <span style="font-family:var(--mono); font-size:.7rem; font-weight:700; text-transform:uppercase;">${{ch.title}}</span>
      </div>
    `).join('');
  }}

  /* ============ RENDER INDEX TAB ============ */
  function renderIndexTab() {{
    const container = document.getElementById('index-terms-list');
    const searchInput = document.getElementById('index-search-box');

    function updateList(filterText = '') {{
      const keys = Object.keys(GLOSSARY).sort();
      const filtered = keys.filter(k => k.includes(filterText.toLowerCase()) || GLOSSARY[k].definition.toLowerCase().includes(filterText.toLowerCase()));
      container.innerHTML = filtered.map(k => {{
        const item = GLOSSARY[k];
        return `
          <div style="background:var(--paper-hi); border:1px solid var(--hair); padding:16px; cursor:pointer;" onclick="openReaderAtWorld(${{item.world_id}})">
            <div style="font-family:var(--mono); font-size:.8rem; font-weight:700; color:var(--red); margin-bottom:4px;">${{item.name}}</div>
            <div style="font-family:var(--serif); font-size:.9rem; line-height:1.5; color:var(--ink);">${{item.definition}}</div>
            <div style="font-family:var(--mono); font-size:.65rem; color:var(--ink-soft); margin-top:8px;">FORMULATED IN: WORLD ${{item.world_id}} &bull; ${{item.world_title}} &rarr;</div>
          </div>
        `;
      }}).join('');
    }}

    updateList();
    searchInput.addEventListener('input', (e) => updateList(e.target.value));
  }}

  /* ============ READER MODAL LOGIC ============ */
  function openReaderAtWorld(id) {{
    document.getElementById('reader-overlay-view').style.display = 'block';
    jumpReaderToId(id);
    setupReaderScrollSpy();
  }}

  function closeReaderModal() {{
    document.getElementById('reader-overlay-view').style.display = 'none';
  }}

  function jumpReaderToId(id) {{
    currentReaderId = id;
    const target = document.getElementById(`monograph-plate-${{id}}`);
    if (target) {{
      target.scrollIntoView({{ behavior: 'smooth' }});
      updateReaderMarginalia(id);
    }}
  }}

  function updateReaderMarginalia(id) {{
    const ch = CHAPTERS.find(c => c.id === id);
    if (!ch) return;
    document.getElementById('reader-top-plate-name').innerText = `PLATE ${{ch.roman}} \u2022 ${{ch.title}}`;
    document.getElementById('reader-pane-thinkers').innerText = ch.thinkers || 'Field station notes under review.';
    document.getElementById('reader-pane-ancestry').innerText = ch.ancestry || 'Lived practices and material traces.';
    document.getElementById('reader-pane-yaml').innerText = ch.yaml_spec || '# Spec active';

    document.querySelectorAll('#reader-sidebar-list > div').forEach(d => d.style.background = 'none');
    const activeSide = document.getElementById(`reader-side-link-${{id}}`);
    if (activeSide) {{
      activeSide.style.background = 'var(--paper-hi)';
      activeSide.scrollIntoView({{ block: 'nearest', behavior: 'smooth' }});
    }}
  }}

  function setupReaderScrollSpy() {{
    const articles = document.querySelectorAll('.monograph-article');
    const observer = new IntersectionObserver((entries) => {{
      entries.forEach(entry => {{
        if (entry.isIntersecting) {{
          const id = parseInt(entry.target.getAttribute('data-id'));
          updateReaderMarginalia(id);
        }}
      }});
    }}, {{ rootMargin: "-15% 0px -75% 0px" }});
    articles.forEach(a => observer.observe(a));
  }}

  /* ============ SEARCH SYSTEM ============ */
  function setupSearch() {{
    const input = document.getElementById('global-search-input');
    const target = document.getElementById('search-results-target');

    input.addEventListener('input', (e) => {{
      const q = e.target.value.toLowerCase().trim();
      if (!q) {{ target.innerHTML = ''; return; }}

      let results = [];
      CHAPTERS.forEach(ch => {{
        if (ch.title.toLowerCase().includes(q) || ch.subtitle.toLowerCase().includes(q) || ch.invariant.toLowerCase().includes(q) || (ch.thinkers && ch.thinkers.toLowerCase().includes(q))) {{
          results.push({{
            type: 'World Plate',
            title: `Plate ${{ch.roman}}: ${{ch.title}}`,
            snippet: ch.subtitle || ch.invariant,
            action: () => {{ closeSearchModal(); openReaderAtWorld(ch.id); }}
          }});
        }}
      }});

      for (let k in GLOSSARY) {{
        const item = GLOSSARY[k];
        if (k.includes(q) || item.definition.toLowerCase().includes(q)) {{
          results.push({{
            type: 'Concept Term',
            title: item.name,
            snippet: item.definition,
            action: () => {{ closeSearchModal(); showConceptDefinition(item.name); }}
          }});
        }}
      }}

      target.innerHTML = results.slice(0, 10).map((r, i) => `
        <div class="search-res-item" onclick="executeSearchAction(${{i}})">
          <div style="font-family:var(--mono); font-size:.65rem; color:var(--ink-soft);">${{r.type}}</div>
          <div class="search-res-title">${{r.title}}</div>
          <div class="search-res-snippet">${{r.snippet}}</div>
        </div>
      `).join('');

      window._currentSearchResults = results;
    }});
  }}

  function executeSearchAction(idx) {{
    if (window._currentSearchResults && window._currentSearchResults[idx]) {{
      window._currentSearchResults[idx].action();
    }}
  }}

  function openSearchModal() {{
    document.getElementById('search-modal-overlay').style.display = 'flex';
    document.getElementById('global-search-input').focus();
  }}

  function closeSearchModal() {{
    document.getElementById('search-modal-overlay').style.display = 'none';
  }}

  function handleSearchOverlayClick(e) {{
    if (e.target.id === 'search-modal-overlay') closeSearchModal();
  }}

  /* ============ CONCEPT POPOVER ============ */
  function showConceptDefinition(rawTerm) {{
    const key = rawTerm.toLowerCase().trim();
    let item = GLOSSARY[key];
    if (!item) {{
      for (let k in GLOSSARY) {{
        if (k.includes(key) || key.includes(k)) {{ item = GLOSSARY[k]; break; }}
      }}
    }}
    document.getElementById('pop-term-title').innerText = item ? item.name : rawTerm;
    document.getElementById('pop-term-body').innerText = item ? item.definition : "Operational definition in the WORLDFUL archive.";
    document.getElementById('concept-pop-drawer').style.display = 'block';
  }}

  function closeConceptDrawer() {{
    document.getElementById('concept-pop-drawer').style.display = 'none';
  }}

  function setupProgressBar() {{
    window.addEventListener('scroll', () => {{
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.getElementById('progress-line').style.width = scrolled + "%";
    }});
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

print(f"Generated Complete Master WORLDFUL Press App in index.html and reader.html ({len(html_code):,} bytes)")
