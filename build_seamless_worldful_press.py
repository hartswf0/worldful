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
    
    # Fluid prose without repetitive headings
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

favicon_svg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23ede8df'/%3E%3Ccircle cx='16' cy='16' r='14' fill='none' stroke='%23a33427' stroke-width='1.5' stroke-dasharray='3,2'/%3E%3Cpath d='M10 22 C14 14 20 12 24 10 C22 15 18 20 12 23 Z' fill='%23a33427'/%3E%3Ccircle cx='22' cy='11' r='1' fill='%231f211f'/%3E%3C/svg%3E"

html_code = f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>WORLDFUL PRESS — Atlas, Archive, Field Station</title>
  
  <link rel="icon" type="image/svg+xml" href="{favicon_svg}">
  
  <!-- Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap" rel="stylesheet">
  
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

  <style>
    :root {{
      --ink:        #1f211f;
      --soft:       #5f5a52;
      --paper:      #ede8df;
      --paper-hi:   #f6f2e8;
      --paper-lo:   #ded8cb;
      --red:        #a33427;
      --hair:       rgba(44, 42, 37, 0.25);
      --hair-faint: rgba(44, 42, 37, 0.12);

      --font-display: "Playfair Display", "Didot", Georgia, serif;
      --font-serif:   "Newsreader", "Times New Roman", Georgia, serif;
      --font-mono:    "IBM Plex Mono", "Courier Prime", ui-monospace, monospace;
      --font-hand:    "Caveat", cursive, sans-serif;
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    
    html {{
      background: #d8d2c5;
      scroll-behavior: smooth;
      color: var(--ink);
    }}
    
    body {{
      font-family: var(--font-serif);
      background: var(--paper);
      color: var(--ink);
      min-height: 100vh;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      background-image: 
        radial-gradient(rgba(44,42,37,0.08) 1px, transparent 0),
        linear-gradient(to right, rgba(44,42,37,0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(44,42,37,0.04) 1px, transparent 1px);
      background-size: 32px 32px, 160px 160px, 160px 160px;
    }}

    /* Global Paper Pulp Texture */
    body::before {{
      content: "";
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 90;
      opacity: 0.35;
      mix-blend-mode: multiply;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
    }}

    /* Minimal Archival Scrollbar */
    ::-webkit-scrollbar {{ width: 6px; height: 6px; }}
    ::-webkit-scrollbar-track {{ background: var(--paper); border-left: 1px solid var(--hair-faint); }}
    ::-webkit-scrollbar-thumb {{ background: var(--soft); border-radius: 2px; }}
    ::-webkit-scrollbar-thumb:hover {{ background: var(--red); }}

    #progress-line {{
      position: fixed;
      top: 0; left: 0;
      height: 3px;
      background: var(--red);
      width: 0%;
      z-index: 1000;
      transition: width 0.1s ease-out;
    }}

    .sheet-canvas {{
      position: relative;
      max-width: 1480px;
      margin: 0 auto;
      background: var(--paper);
      box-shadow: 0 18px 60px rgba(30, 25, 18, 0.22);
      border-left: 1px solid var(--hair);
      border-right: 1px solid var(--hair);
      min-height: 100vh;
    }}

    /* Registration Crosses */
    .reg {{
      position: absolute;
      width: 22px;
      height: 22px;
      z-index: 22;
      opacity: .75;
      pointer-events: none;
    }}
    .reg::before, .reg::after {{
      content: "";
      position: absolute;
      background: #30302d;
    }}
    .reg::before {{ left: 10px; top: 0; width: 1px; height: 22px; }}
    .reg::after {{ left: 0; top: 10px; width: 22px; height: 1px; }}
    .reg i {{
      position: absolute;
      inset: 5px;
      border: 1px solid #30302d;
      border-radius: 50%;
    }}
    .reg.tl {{ left: 24px; top: 24px; }}
    .reg.tr {{ right: 24px; top: 24px; }}
    .reg.bl {{ left: 24px; bottom: 36px; }}
    .reg.br {{ right: 24px; bottom: 36px; }}

    .vert-coord {{
      position: absolute;
      left: 28px;
      top: 90px;
      z-index: 18;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-family: var(--font-mono);
      font-size: 8px;
      letter-spacing: .25em;
      color: var(--soft);
      text-transform: uppercase;
      user-select: none;
    }}
    .archive-id {{
      position: absolute;
      left: 28px;
      bottom: 120px;
      z-index: 18;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-family: var(--font-mono);
      font-size: 8px;
      letter-spacing: .22em;
      color: var(--soft);
      text-transform: uppercase;
      user-select: none;
    }}

    /* ============ HEADER NAVIGATION ============ */
    header.site-header {{
      position: sticky;
      top: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.2rem 3.6rem 1.2rem 5.4rem;
      background: rgba(237, 232, 223, 0.96);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--hair);
    }}

    .brand-group {{
      display: flex;
      flex-direction: column;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
    }}
    .brand-name {{
      font-family: var(--font-mono);
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: .22em;
      text-transform: uppercase;
    }}
    .brand-sub {{
      font-family: var(--font-mono);
      font-size: 8.5px;
      letter-spacing: .24em;
      color: var(--soft);
      text-transform: uppercase;
      margin-top: 3px;
    }}

    nav.site-nav {{
      display: flex;
      gap: 3.2rem;
    }}
    nav.site-nav a {{
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: .22em;
      text-transform: uppercase;
      color: var(--ink);
      text-decoration: none;
      position: relative;
      padding-bottom: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: color 0.15s;
    }}
    nav.site-nav a::after {{
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      height: 1.5px;
      width: 0;
      background: var(--red);
      transition: width .25s ease;
    }}
    nav.site-nav a:hover::after, nav.site-nav a.active::after {{
      width: 100%;
    }}
    nav.site-nav a:hover, nav.site-nav a.active {{
      color: var(--red);
    }}

    .search-btn {{
      display: flex;
      align-items: center;
      gap: 8px;
      background: none;
      border: 1px solid transparent;
      padding: 4px 8px;
      font-family: var(--font-mono);
      font-size: 9.5px;
      letter-spacing: .2em;
      text-transform: uppercase;
      color: var(--ink);
      cursor: pointer;
      transition: all 0.15s;
    }}
    .search-btn:hover {{
      border-color: var(--red);
      color: var(--red);
    }}
    .search-dot {{
      width: 5px;
      height: 5px;
      background: var(--red);
      border-radius: 50%;
    }}

    .view-panel {{
      display: none;
      position: relative;
      z-index: 10;
    }}
    .view-panel.active {{
      display: block;
    }}

    /* ============ HERO SECTION ============ */
    .hero-stage {{
      position: relative;
      padding: 2.5rem 3.6rem 3rem 5.4rem;
      min-height: 620px;
      display: grid;
      grid-template-columns: 1fr 1.1fr;
      gap: 40px;
      align-items: center;
    }}

    .hero-content {{
      position: relative;
      z-index: 6;
      max-width: 580px;
    }}
    h1.hero-h1 {{
      font-family: var(--font-display);
      font-weight: 700;
      font-size: clamp(3.6rem, 8.2vw, 6.8rem);
      letter-spacing: .04em;
      line-height: .92;
      color: var(--ink);
    }}
    .hero-tick {{
      width: 36px;
      height: 3px;
      background: var(--red);
      margin: 1.6rem 0 1.2rem;
    }}
    .hero-thesis {{
      font-family: var(--font-mono);
      font-size: clamp(.9rem, 1.4vw, 1.15rem);
      letter-spacing: .32em;
      line-height: 1.7;
      font-weight: 700;
      text-transform: uppercase;
    }}
    .hero-lede {{
      font-family: var(--font-serif);
      font-size: 1.22rem;
      line-height: 1.6;
      margin-top: 1.4rem;
      color: var(--ink);
    }}
    .hero-buttons {{
      display: flex;
      gap: 16px;
      margin-top: 2rem;
      flex-wrap: wrap;
    }}
    .cta-btn {{
      display: inline-flex;
      align-items: center;
      gap: 12px;
      padding: .85rem 1.6rem;
      border: 1.5px solid var(--red);
      color: var(--red);
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: .25em;
      text-transform: uppercase;
      text-decoration: none;
      background: rgba(255, 255, 255, 0.25);
      cursor: pointer;
      font-weight: 700;
      transition: all .2s ease;
    }}
    .cta-btn:hover {{
      background: var(--red);
      color: var(--paper-hi);
    }}
    .cta-btn.secondary {{
      border-color: var(--soft);
      color: var(--ink);
      background: none;
    }}
    .cta-btn.secondary:hover {{
      background: var(--ink);
      color: var(--paper-hi);
    }}

    /* HERO SPLASH PLATE: Organic Multiply Blend */
    .hero-plate-frame {{
      position: relative;
      width: 100%;
    }}
    .hero-plate-img {{
      width: 100%;
      display: block;
      mix-blend-mode: multiply;
      -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
      mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%);
      filter: contrast(105%) brightness(99%);
    }}

    /* ============ 34 WORLDS BOOK CARD GALLERY ============ */
    .worlds-gallery {{
      padding: 2.5rem 3.6rem 5rem 5.4rem;
      border-top: 1px solid var(--hair);
      margin: 1.5rem 2.2rem 0;
    }}
    .gallery-head {{
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2.2rem;
      flex-wrap: wrap;
      gap: 16px;
    }}
    .gallery-title-wrap {{
      display: flex;
      align-items: baseline;
      gap: 12px;
    }}
    .gallery-title-wrap h2 {{
      font-family: var(--font-mono);
      font-size: 1.1rem;
      letter-spacing: .32em;
      font-weight: 700;
      text-transform: uppercase;
    }}
    .gallery-title-wrap .mark {{
      color: var(--red);
      font-family: var(--font-mono);
      font-size: 1.2rem;
    }}
    .gallery-title-wrap em {{
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 1rem;
      color: var(--soft);
    }}

    .world-cards-grid {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.6rem;
    }}
    .world-book-card {{
      position: relative;
      border: 1px solid var(--hair);
      background: linear-gradient(165deg, rgba(255,255,255,.4), rgba(255,255,255,0) 40%), var(--paper-hi);
      padding: 1.2rem;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      transition: transform .25s ease, box-shadow .25s ease, border-color .25s;
      min-height: 380px;
      overflow: hidden;
    }}
    .world-book-card:hover {{
      transform: translateY(-4px);
      box-shadow: 0 12px 28px rgba(40, 32, 18, 0.2);
      border-color: var(--red);
    }}
    .card-meta-line {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-size: .65rem;
      letter-spacing: .15em;
      color: var(--soft);
      margin-bottom: 8px;
    }}
    .card-numeral {{
      font-family: var(--font-display);
      font-size: 2rem;
      line-height: 1;
      font-weight: 700;
      color: var(--ink);
    }}
    .card-plate-box {{
      width: 100%;
      flex: 1;
      border: 1px solid var(--hair-faint);
      overflow: hidden;
      background: var(--paper);
      margin: 10px 0 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }}
    .card-plate-img {{
      width: 100%;
      height: 100%;
      min-height: 190px;
      object-fit: cover;
      display: block;
      mix-blend-mode: multiply;
      filter: contrast(104%);
      transition: transform .3s ease;
    }}
    .world-book-card:hover .card-plate-img {{
      transform: scale(1.04);
    }}
    .card-bottom-sub {{
      font-family: var(--font-serif);
      font-size: .82rem;
      font-style: italic;
      color: var(--soft);
      line-height: 1.35;
      text-align: center;
    }}

    /* ============ NATIVE CONTINUOUS MONOGRAPH READER ============ */
    #reader-overlay-view {{
      display: none;
      position: fixed;
      inset: 0;
      z-index: 200;
      background: var(--paper);
      overflow-y: auto;
    }}
    .reader-header-bar {{
      position: sticky;
      top: 0;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 36px;
      background: rgba(237, 232, 223, 0.96);
      border-bottom: 1px solid var(--hair);
      backdrop-filter: blur(8px);
    }}
    .reader-layout {{
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 260px 1fr 340px;
      border-top: 1px solid var(--hair);
    }}
    .reader-nav-col {{
      border-right: 1px solid var(--hair);
      height: calc(100vh - 54px);
      position: sticky;
      top: 54px;
      overflow-y: auto;
      padding: 12px;
      background: var(--paper);
    }}
    .reader-main-col {{
      padding: 40px 50px 180px;
      background: var(--paper);
    }}
    .reader-rail-col {{
      border-left: 1px solid var(--hair);
      height: calc(100vh - 54px);
      position: sticky;
      top: 54px;
      overflow-y: auto;
      padding: 20px 18px;
      background: var(--paper);
    }}

    .monograph-world-block {{
      padding-bottom: 80px;
      margin-bottom: 70px;
      border-bottom: 1px solid var(--hair);
    }}
    .monograph-archival-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-size: .68rem;
      letter-spacing: .2em;
      color: var(--soft);
      text-transform: uppercase;
      border-bottom: 1px dashed var(--hair);
      padding-bottom: 8px;
      margin-bottom: 16px;
    }}
    
    /* HEROIC NATIVE PLATE: Placed prominently as the primary visual title & engraving */
    .monograph-hero-plate-box {{
      width: 100%;
      margin: 12px 0 24px;
      position: relative;
    }}
    .monograph-plate-image {{
      width: 100%;
      max-width: 960px;
      display: block;
      mix-blend-mode: multiply;
      -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%);
      mask-image: radial-gradient(ellipse at center, rgba(0,0,0,1) 88%, rgba(0,0,0,0) 100%);
      filter: contrast(106%) brightness(99%);
    }}

    .monograph-invariant-box {{
      background: var(--paper-hi);
      border-left: 3px solid var(--red);
      padding: 12px 18px;
      margin-bottom: 28px;
      font-family: var(--font-mono);
      font-size: .82rem;
      line-height: 1.55;
    }}
    .monograph-invariant-box strong {{
      color: var(--red);
      display: block;
      letter-spacing: .12em;
      font-size: .74rem;
      margin-bottom: 3px;
    }}

    .monograph-prose-text {{
      max-width: 800px;
      font-family: var(--font-serif);
      font-size: 1.16rem;
      line-height: 1.95;
      color: var(--ink);
      text-align: justify;
      hyphens: auto;
    }}
    .monograph-prose-text p {{
      margin-bottom: 22px;
      text-indent: 1.8em;
    }}
    .monograph-prose-text p:first-of-type {{
      text-indent: 0;
    }}
    .monograph-prose-text blockquote {{
      border-left: 3px solid var(--red);
      padding: 14px 20px;
      background: var(--paper-hi);
      margin: 28px 0;
      font-style: italic;
      font-size: 1.18rem;
      text-indent: 0;
    }}

    /* ============ OTHER CONTENT PANELS ============ */
    .content-page-panel {{
      padding: 3rem 5.4rem 5rem;
      max-width: 1100px;
      margin: 0 auto;
    }}
    .panel-title-h1 {{
      font-family: var(--font-display);
      font-size: 3.2rem;
      font-weight: 700;
      letter-spacing: .02em;
      margin-bottom: .8rem;
    }}
    .panel-intro-lede {{
      font-family: var(--font-serif);
      font-size: 1.3rem;
      line-height: 1.6;
      color: var(--soft);
      margin-bottom: 2.5rem;
    }}

    /* ============ SEARCH MODAL ============ */
    #search-modal-overlay {{
      display: none;
      position: fixed;
      inset: 0;
      z-index: 300;
      background: rgba(31, 33, 31, 0.65);
      backdrop-filter: blur(4px);
      align-items: flex-start;
      justify-content: center;
      padding-top: 10vh;
    }}
    .search-box-modal {{
      background: var(--paper);
      border: 1px solid var(--red);
      width: 90%;
      max-width: 680px;
      box-shadow: 0 20px 50px rgba(0,0,0,.35);
      padding: 24px;
    }}
    .search-input-field {{
      width: 100%;
      background: var(--paper-hi);
      border: 1px solid var(--soft);
      padding: 12px 16px;
      font-family: var(--font-mono);
      font-size: 1rem;
      outline: none;
      color: var(--ink);
    }}
    .search-input-field:focus {{
      border-color: var(--red);
    }}
    .search-results-list {{
      max-height: 420px;
      overflow-y: auto;
      margin-top: 16px;
    }}
    .search-item {{
      padding: 10px 14px;
      border-bottom: 1px solid var(--hair);
      cursor: pointer;
    }}
    .search-item:hover {{
      background: var(--paper-hi);
    }}

    /* ============ CONCEPT DEFINITION DRAWER ============ */
    #concept-pop-drawer {{
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 380px;
      background: var(--paper-hi);
      border: 1px solid var(--red);
      box-shadow: 4px 8px 24px rgba(0,0,0,.2);
      padding: 18px 22px;
      z-index: 400;
      display: none;
    }}

    /* ============ FOOTER ============ */
    footer.site-footer {{
      margin-top: 4rem;
      padding: 2rem 5.4rem;
      border-top: 1px solid var(--hair);
      display: flex;
      justify-content: space-between;
      font-family: var(--font-mono);
      font-size: .65rem;
      letter-spacing: .24em;
      color: var(--soft);
      text-transform: uppercase;
    }}

    @media (max-width: 1100px) {{
      .hero-stage {{ grid-template-columns: 1fr; }}
      .hero-plate-frame {{ display: none; }}
      .world-cards-grid {{ grid-template-columns: repeat(2, 1fr); }}
      .reader-rail-col {{ display: none; }}
      .reader-layout {{ grid-template-columns: 220px 1fr; }}
    }}
    @media (max-width: 760px) {{
      header.site-header {{ padding: 1rem 1.4rem; }}
      nav.site-nav {{ display: none; }}
      .hero-stage {{ padding: 2rem 1.4rem; }}
      .worlds-gallery {{ padding: 2rem 1.4rem; margin: 1rem; }}
      .world-cards-grid {{ grid-template-columns: 1fr; }}
      .reader-nav-col {{ display: none; }}
      .reader-main-col {{ padding: 20px 14px; }}
      .content-page-panel {{ padding: 2rem 1.4rem; }}
    }}
  </style>
</head>
<body>

<div class="sheet-canvas">
  <div id="progress-line"></div>

  <!-- Registration Marks & Coordinates -->
  <div class="reg tl"><i></i></div>
  <div class="reg tr"><i></i></div>
  <div class="reg bl"><i></i></div>
  <div class="reg br"><i></i></div>

  <span class="vert-coord">23.9847&deg; N &bull; ATLAS STATION</span>
  <span class="archive-id">ARCHIVE NO. WF-23-A &bull; IV.23</span>

  <!-- ===== MASTER HEADER ===== -->
  <header class="site-header">
    <a class="brand-group" onclick="switchMainTab('worlds')">
      <div class="brand-name">WORLDFUL PRESS</div>
      <div class="brand-sub">ATLAS, ARCHIVE, FIELD STATION</div>
    </a>

    <nav class="site-nav" aria-label="Primary">
      <a onclick="switchMainTab('worlds')" id="nav-worlds" class="active">WORLDS</a>
      <a onclick="switchMainTab('crossings')" id="nav-crossings">CROSSINGS</a>
      <a onclick="switchMainTab('traces')" id="nav-traces">TRACES</a>
      <a onclick="switchMainTab('index')" id="nav-index">INDEX</a>
      <a onclick="switchMainTab('about')" id="nav-about">ABOUT</a>
    </nav>

    <button class="search-btn" type="button" onclick="openSearchModal()">
      SEARCH
      <svg width="13" height="13" viewBox="0 0 15 15" fill="none" stroke="currentColor" stroke-width="1.4">
        <circle cx="6.2" cy="6.2" r="4.6"/><line x1="9.8" y1="9.8" x2="14" y2="14"/>
      </svg>
      <span class="search-dot"></span>
    </button>
  </header>

  <!-- ==================== VIEW 1: WORLDS (HERO + CARDS) ==================== -->
  <div id="tab-worlds-view" class="view-panel active">

    <!-- HERO STAGE -->
    <section class="hero-stage">
      <div class="hero-content">
        <h1 class="hero-h1">WORLDFUL</h1>
        <div class="hero-tick"></div>
        <p class="hero-thesis">THE WORLD DOES NOT FIT THROUGH THE MOUTH</p>
        <p class="hero-lede">The world is full of more than I can say. This is what crossed.</p>
        <div class="hero-buttons">
          <button class="cta-btn" onclick="openReaderAtWorld(0)">
            ENTER STREAM &darr;
          </button>
          <a class="cta-btn secondary" href="#world-gallery-anchor">
            BROWSE 34 PLATES &rarr;
          </a>
        </div>
      </div>

      <!-- Real High-Res Archival Hero Splash Plate -->
      <div class="hero-plate-frame">
        <img src="readable_book/assets/images/splash_hero.png" alt="WORLDFUL Press Opening Archival Plate" class="hero-plate-img">
      </div>
    </section>

    <!-- 34 WORLDS CARD GALLERY -->
    <section class="worlds-gallery" id="world-gallery-anchor">
      <div class="gallery-head">
        <div class="gallery-title-wrap">
          <h2>WORLDS</h2><span class="mark">+</span>
          <em>Places imagined. Crossings remembered.</em>
        </div>
        <div style="font-family:var(--font-mono); font-size:.7rem; color:var(--soft); letter-spacing:.2em;">
          34 SURVEYED PLATES
        </div>
      </div>

      <div class="world-cards-grid" id="world-cards-target">
        <!-- 34 Real Book Cards Injected via JS -->
      </div>
    </section>
  </div>

  <!-- ==================== VIEW 2: CROSSINGS ==================== -->
  <div id="tab-crossings-view" class="view-panel">
    <div class="content-page-panel">
      <h1 class="panel-title-h1">THE FIVE CROSSINGS</h1>
      <p class="panel-intro-lede">How physical terrain passes through human mouths, marks, and systems of coordination.</p>
      
      <div style="display:grid; gap:24px; margin-top:30px;">
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:22px;">
          <h3 style="font-family:var(--font-mono); font-size:.95rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">01. ENTER &bull; THE UNCOMPRESSED ENCOUNTER</h3>
          <p style="font-size:1.05rem; line-height:1.75;">The physical world sprawling in raw sensory resolution: wolf tracks in the switchgrass, mud temperature, wind velocity, and unmeasured friction.</p>
        </div>
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:22px;">
          <h3 style="font-family:var(--font-mono); font-size:.95rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">02. OBSERVE &bull; MATERIAL RESISTANCE</h3>
          <p style="font-size:1.05rem; line-height:1.75;">The irreducible friction that resists flattery. Soil that refuses to obey the manifesto, isotopes in the bones, and tools that rust.</p>
        </div>
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:22px;">
          <h3 style="font-family:var(--font-mono); font-size:.95rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">03. DESCRIBE &bull; THE LOSSY CUT</h3>
          <p style="font-size:1.05rem; line-height:1.75;">Selecting which single relation will travel while dropping ninety-nine percent of the terrain. Description travels only by what it leaves behind.</p>
        </div>
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:22px;">
          <h3 style="font-family:var(--font-mono); font-size:.95rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">04. COMPRESS &bull; THE SIGN MACHINE</h3>
          <p style="font-size:1.05rem; line-height:1.75;">Transforming human bodily encounters into portable nouns, legal clauses, coordinate maps, database schemas, and model token weights.</p>
        </div>
        <div style="background:var(--paper-hi); border-left:3px solid var(--red); padding:22px;">
          <h3 style="font-family:var(--font-mono); font-size:.95rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">05. RELEASE &bull; PORTABLE CONSEQUENCE</h3>
          <p style="font-size:1.05rem; line-height:1.75;">The microscopic trace traveling across centuries and borders to direct armies, build cathedrals, or crash financial markets.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== VIEW 3: TRACES ==================== -->
  <div id="tab-traces-view" class="view-panel">
    <div class="content-page-panel">
      <h1 class="panel-title-h1">MATERIAL TRACES</h1>
      <p class="panel-intro-lede">Physical residues that anchor symbolic claims to material reality.</p>
      
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:20px;">
        <div style="border:1px solid var(--hair); background:var(--paper-hi); padding:20px;">
          <h4 style="font-family:var(--font-mono); font-size:.85rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">CANIS LUPUS TRACKS</h4>
          <p style="font-size:.95rem; line-height:1.65; color:var(--soft);">Six wet commas in the switchgrass that redirected a child's trajectory over the pass before speech began.</p>
        </div>
        <div style="border:1px solid var(--hair); background:var(--paper-hi); padding:20px;">
          <h4 style="font-family:var(--font-mono); font-size:.85rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">THE POINTING FINGER</h4>
          <p style="font-size:.95rem; line-height:1.65; color:var(--soft);">The root of deixis. Whoever captures joint attention owns the interpretive horizon of the room.</p>
        </div>
        <div style="border:1px solid var(--hair); background:var(--paper-hi); padding:20px;">
          <h4 style="font-family:var(--font-mono); font-size:.85rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">THE INVISIBLE HAMMER</h4>
          <p style="font-size:.95rem; line-height:1.65; color:var(--soft);">A working tool remains phenomenologically transparent; only when the steel fractures do we notice the tool.</p>
        </div>
        <div style="border:1px solid var(--hair); background:var(--paper-hi); padding:20px;">
          <h4 style="font-family:var(--font-mono); font-size:.85rem; color:var(--red); letter-spacing:.1em; margin-bottom:6px;">FORENSIC ISOTOPES</h4>
          <p style="font-size:.95rem; line-height:1.65; color:var(--soft);">Strontium ratios in the enamel that remember where the body actually drank, indifferent to the passport.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ==================== VIEW 4: INDEX ==================== -->
  <div id="tab-index-view" class="view-panel">
    <div class="content-page-panel">
      <h1 class="panel-title-h1">MASTER CONCEPT INDEX</h1>
      <p class="panel-intro-lede">102 Defined Operational Invariants and Theoretical Lineages.</p>
      
      <input type="text" id="index-search-input" placeholder="Filter terms (e.g. Deixis, Goodhart, Tacit Knowledge)..." 
             style="width:100%; background:var(--paper-hi); border:1px solid var(--soft); padding:10px 14px; font-family:var(--font-mono); font-size:.95rem; margin-bottom:24px; outline:none;">
      
      <div id="index-terms-target" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:16px;">
        <!-- Injected via JS -->
      </div>
    </div>
  </div>

  <!-- ==================== VIEW 5: ABOUT ==================== -->
  <div id="tab-about-view" class="view-panel">
    <div class="content-page-panel">
      <h1 class="panel-title-h1">ABOUT WORLDFUL</h1>
      <p class="panel-intro-lede">A Field Treatise on the Epistemic Tragedy of Description.</p>
      
      <div style="font-family:var(--font-serif); font-size:1.15rem; line-height:1.9; color:var(--ink);">
        <p style="margin-bottom:20px;">Human beings survive by converting vast physical realities into compact, portable tokens. A sentence keeps the wolf and drops the wind direction; keeps the danger and drops ten thousand blades of grass.</p>
        <p style="margin-bottom:20px;">The catastrophe begins when institutions forget that the sign was cut. They mistreat the dashboard for the territory, the legal definition for the human grief, and the database schema for the landscape.</p>
        <blockquote style="border-left:3px solid var(--red); padding:14px 20px; background:var(--paper-hi); margin:30px 0; font-style:italic;">
          "The world does not fit through the mouth. The world is full of more than I can say. This is what crossed."
        </blockquote>
      </div>
    </div>
  </div>

  <!-- ===== MASTER FOOTER ===== -->
  <footer class="site-footer">
    <span>WORLDFUL PRESS &bull; ATLAS, ARCHIVE, FIELD STATION</span>
    <span>34 PLATES &bull; SURVEYED IV.23 &bull; SHEET WF-23-A</span>
  </footer>
</div>

<!-- ==================== CONTINUOUS MONOGRAPH READER MODAL ==================== -->
<div id="reader-overlay-view">
  <div class="reader-header-bar">
    <div style="display:flex; align-items:center; gap:16px;">
      <button class="cta-btn" onclick="closeReaderModal()" style="padding:6px 14px; font-size:.68rem;">
        &larr; BACK TO ATLAS
      </button>
      <div style="font-family:var(--font-mono); font-size:.75rem; font-weight:700; color:var(--red);" id="reader-top-plate-label">
        PLATE 0 &bull; THE CROSSING
      </div>
    </div>
    <div style="font-family:var(--font-mono); font-size:.65rem; color:var(--soft); letter-spacing:.2em;">
      TYPEWRITER FIELD MONOGRAPH
    </div>
  </div>

  <div class="reader-layout">
    <!-- Left Navigation Column -->
    <aside class="reader-nav-col" id="reader-nav-target">
      <!-- Injected via JS -->
    </aside>

    <!-- Center Main Prose Column -->
    <main class="reader-main-col" id="reader-main-target">
      <!-- 34 Articles Injected via JS -->
    </main>

    <!-- Right Marginalia Rail Column -->
    <aside class="reader-rail-col">
      <div style="border-bottom:1px dashed var(--hair); padding-bottom:14px; margin-bottom:16px;">
        <div style="font-family:var(--font-mono); font-size:.7rem; color:var(--red); font-weight:700; letter-spacing:.15em;">PHILOSOPHICAL THINKERS</div>
        <div style="font-family:var(--font-serif); font-size:.9rem; color:var(--soft); margin-top:6px;" id="reader-rail-thinkers">—</div>
      </div>
      <div style="border-bottom:1px dashed var(--hair); padding-bottom:14px; margin-bottom:16px;">
        <div style="font-family:var(--font-mono); font-size:.7rem; color:var(--red); font-weight:700; letter-spacing:.15em;">MATERIAL ANCESTRY</div>
        <div style="font-family:var(--font-serif); font-size:.9rem; color:var(--soft); margin-top:6px;" id="reader-rail-ancestry">—</div>
      </div>
      <div>
        <div style="font-family:var(--font-mono); font-size:.7rem; color:var(--red); font-weight:700; letter-spacing:.15em;">FORMAL STATE MODEL</div>
        <pre style="background:var(--paper-hi); padding:8px; font-family:var(--font-mono); font-size:.7rem; border-left:2px solid var(--red); white-space:pre-wrap; margin-top:6px;" id="reader-rail-yaml"># State Model Active</pre>
      </div>
    </aside>
  </div>
</div>

<!-- ==================== SEARCH MODAL ==================== -->
<div id="search-modal-overlay" onclick="handleSearchOverlayClick(event)">
  <div class="search-box-modal" onclick="event.stopPropagation()">
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
      <span style="font-family:var(--font-mono); font-size:.75rem; color:var(--red); font-weight:700; letter-spacing:.2em;">ATLAS SEARCH DISPATCH</span>
      <span style="font-family:var(--font-mono); font-size:.65rem; color:var(--soft);">[ESC TO CLOSE]</span>
    </div>
    <input type="text" id="global-search-box" class="search-input-field" placeholder="Search worlds, concepts, thinkers, or invariants...">
    <div class="search-results-list" id="search-results-target">
      <!-- Injected via JS -->
    </div>
  </div>
</div>

<!-- ==================== CONCEPT DEFINITION DRAWER ==================== -->
<div id="concept-pop-drawer">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--hair); padding-bottom:6px; margin-bottom:8px;">
    <div style="font-family:var(--font-mono); font-size:.8rem; color:var(--red); font-weight:700;" id="pop-term-title">TERM</div>
    <button onclick="closeConceptDrawer()" style="background:none; border:none; font-size:18px; cursor:pointer; color:var(--soft);">&times;</button>
  </div>
  <div style="font-family:var(--font-serif); font-size:.95rem; line-height:1.55; color:var(--ink);" id="pop-term-body">
    Definition.
  </div>
</div>

<script>
  const CHAPTERS = {chapters_json};
  const GLOSSARY = {glossary_json};
  let currentReaderId = 0;

  function init() {{
    renderCardsGallery();
    renderMonographReader();
    renderReaderNav();
    renderIndexView();
    setupSearchEngine();
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

  /* ============ TAB ROUTING ============ */
  function switchMainTab(tabKey) {{
    document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('nav.site-nav a').forEach(a => a.classList.remove('active'));

    const targetPanel = document.getElementById(`tab-${{tabKey}}-view`);
    if (targetPanel) targetPanel.classList.add('active');

    const targetNav = document.getElementById(`nav-${{tabKey}}`);
    if (targetNav) targetNav.classList.add('active');

    window.scrollTo({{ top: 0, behavior: 'smooth' }});
  }}

  /* ============ RENDER CARDS (MAIN GALLERY) ============ */
  function renderCardsGallery() {{
    const container = document.getElementById('world-cards-target');
    container.innerHTML = CHAPTERS.map(ch => `
      <div class="world-book-card" onclick="openReaderAtWorld(${{ch.id}})">
        <div class="card-meta-line">
          <span>PLATE ${{ch.roman}}</span>
          <span>WF-23-${{String.fromCharCode(65 + (ch.id % 26))}}</span>
        </div>
        <div class="card-plate-box">
          <img src="${{ch.img_src}}" alt="Plate ${{ch.roman}} Field Lithograph" class="card-plate-img" loading="lazy">
        </div>
        <div class="card-bottom-sub">${{ch.subtitle}}</div>
      </div>
    `).join('');
  }}

  /* ============ RENDER NATIVE MONOGRAPH READER ============ */
  function renderMonographReader() {{
    const stream = document.getElementById('reader-main-target');
    stream.innerHTML = CHAPTERS.map(ch => {{
      let parsed = marked.parse(ch.prose);
      return `
        <article class="monograph-world-block" id="monograph-block-${{ch.id}}" data-id="${{ch.id}}">
          
          <div class="monograph-archival-header">
            <span>PLATE ${{ch.roman}} &bull; ARCHIVE NO. WF-23-${{String.fromCharCode(65 + (ch.id % 26))}}</span>
            <span>${{ch.coords[0]}} &bull; ${{ch.coords[1]}}</span>
          </div>

          <!-- HEROIC NATIVE LITHOGRAPH: Takes full space and serves as primary visual title -->
          <div class="monograph-hero-plate-box">
            <img src="${{ch.img_src}}" alt="Plate ${{ch.roman}} Archival Field Document" class="monograph-plate-image" loading="lazy">
          </div>

          <div class="monograph-invariant-box">
            <strong>SYSTEM INVARIANT:</strong>
            ${{ch.invariant}}
          </div>

          <div class="monograph-prose-text">
            ${{parsed}}
          </div>

          <div style="margin-top:24px; display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
            <span style="font-family:var(--font-mono); font-size:.65rem; color:var(--soft); letter-spacing:.15em;">CONCEPTS:</span>
            ${{ch.terms.map(t => `
              <button onclick="showConceptDefinition('${{t.replace(/'/g, "\\\\\\'")}}')" style="background:var(--paper-hi); border:1px solid var(--hair); padding:3px 8px; font-family:var(--font-mono); font-size:.72rem; color:var(--red); cursor:pointer;">
                ${{t}}
              </button>
            `).join('')}}
          </div>
        </article>
      `;
    }}).join('');
  }}

  function renderReaderNav() {{
    const bar = document.getElementById('reader-nav-target');
    bar.innerHTML = CHAPTERS.map(ch => `
      <div onclick="jumpReaderToId(${{ch.id}})" style="padding:8px 10px; border-bottom:1px solid var(--hair); cursor:pointer; display:flex; gap:8px;" id="reader-side-link-${{ch.id}}">
        <span style="font-family:var(--font-mono); font-size:.7rem; font-weight:700; color:var(--red); min-width:22px;">${{ch.roman}}</span>
        <span style="font-family:var(--font-mono); font-size:.7rem; font-weight:700; text-transform:uppercase;">${{ch.title}}</span>
      </div>
    `).join('');
  }}

  function renderIndexView() {{
    const container = document.getElementById('index-terms-target');
    const searchInput = document.getElementById('index-search-input');

    function updateIndex(q = '') {{
      const keys = Object.keys(GLOSSARY).sort();
      const filtered = keys.filter(k => k.includes(q.toLowerCase()) || GLOSSARY[k].definition.toLowerCase().includes(q.toLowerCase()));
      container.innerHTML = filtered.map(k => {{
        const item = GLOSSARY[k];
        return `
          <div style="background:var(--paper-hi); border:1px solid var(--hair); padding:16px; cursor:pointer;" onclick="openReaderAtWorld(${{item.world_id}})">
            <div style="font-family:var(--font-mono); font-size:.8rem; font-weight:700; color:var(--red); margin-bottom:4px;">${{item.name}}</div>
            <div style="font-family:var(--font-serif); font-size:.92rem; line-height:1.55; color:var(--ink);">${{item.definition}}</div>
            <div style="font-family:var(--font-mono); font-size:.65rem; color:var(--soft); margin-top:8px;">FORMULATED IN: WORLD ${{item.world_id}} &bull; ${{item.world_title}} &rarr;</div>
          </div>
        `;
      }}).join('');
    }}

    updateIndex();
    searchInput.addEventListener('input', (e) => updateIndex(e.target.value));
  }}

  /* ============ READER ACTIONS ============ */
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
    const target = document.getElementById(`monograph-block-${{id}}`);
    if (target) {{
      target.scrollIntoView({{ behavior: 'smooth' }});
      updateReaderRail(id);
    }}
  }}

  function updateReaderRail(id) {{
    const ch = CHAPTERS.find(c => c.id === id);
    if (!ch) return;
    document.getElementById('reader-top-plate-label').innerText = `PLATE ${{ch.roman}} \u2022 ${{ch.title}}`;
    document.getElementById('reader-rail-thinkers').innerText = ch.thinkers || 'Field station notes under review.';
    document.getElementById('reader-rail-ancestry').innerText = ch.ancestry || 'Lived practices and material traces.';
    document.getElementById('reader-rail-yaml').innerText = ch.yaml_spec || '# Spec active';

    document.querySelectorAll('#reader-nav-target > div').forEach(d => d.style.background = 'none');
    const activeSide = document.getElementById(`reader-side-link-${{id}}`);
    if (activeSide) {{
      activeSide.style.background = 'var(--paper-hi)';
      activeSide.scrollIntoView({{ block: 'nearest', behavior: 'smooth' }});
    }}
  }}

  function setupReaderScrollSpy() {{
    const blocks = document.querySelectorAll('.monograph-world-block');
    const observer = new IntersectionObserver((entries) => {{
      entries.forEach(entry => {{
        if (entry.isIntersecting) {{
          const id = parseInt(entry.target.getAttribute('data-id'));
          updateReaderRail(id);
        }}
      }});
    }}, {{ rootMargin: "-15% 0px -75% 0px" }});
    blocks.forEach(b => observer.observe(b));
  }}

  /* ============ SEARCH ENGINE ============ */
  function setupSearchEngine() {{
    const input = document.getElementById('global-search-box');
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
            type: 'Concept Principle',
            title: item.name,
            snippet: item.definition,
            action: () => {{ closeSearchModal(); showConceptDefinition(item.name); }}
          }});
        }}
      }}

      target.innerHTML = results.slice(0, 10).map((r, i) => `
        <div class="search-item" onclick="executeSearchAction(${{i}})">
          <div style="font-family:var(--font-mono); font-size:.65rem; color:var(--soft);">${{r.type}}</div>
          <div style="font-family:var(--font-mono); font-size:.85rem; font-weight:700; color:var(--red);">${{r.title}}</div>
          <div style="font-family:var(--font-serif); font-size:.9rem; color:var(--soft); margin-top:4px;">${{r.snippet}}</div>
        </div>
      `).join('');

      window._searchResults = results;
    }});
  }}

  function executeSearchAction(idx) {{
    if (window._searchResults && window._searchResults[idx]) {{
      window._searchResults[idx].action();
    }}
  }}

  function openSearchModal() {{
    document.getElementById('search-modal-overlay').style.display = 'flex';
    document.getElementById('global-search-box').focus();
  }}

  function closeSearchModal() {{
    document.getElementById('search-modal-overlay').style.display = 'none';
  }}

  function handleSearchOverlayClick(e) {{
    if (e.target.id === 'search-modal-overlay') closeSearchModal();
  }}

  /* ============ CONCEPT DEFINITIONS ============ */
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

print(f"Generated Seamless Heroic WORLDFUL Press App in index.html ({len(html_code):,} bytes)")
