import json
import os
import re
from pathlib import Path

# Load all chapters
chapters_data = []
svg_dir = Path("readable_book/assets/svgs")

for wid in range(34):
    slug_files = list(Path("readable_book").glob(f"{wid:02d}_*.md"))
    if not slug_files:
        continue
    c_path = slug_files[0]
    with open(c_path, 'r', encoding='utf-8') as f:
        md_text = f.read()
        
    svg_path = svg_dir / f"world_{wid:02d}.svg"
    svg_content = ""
    if svg_path.exists():
        with open(svg_path, 'r', encoding='utf-8') as sf:
            svg_content = sf.read()
            
    # Extract title and subtitle
    m_title = re.search(r'^#\s*\d+\.\s+([^\n]+)', md_text)
    title = m_title.group(1).strip() if m_title else f"World {wid}"
    
    m_sub = re.search(r'^###\s*\*([^*]+)\*', md_text, re.M)
    subtitle = m_sub.group(1).strip() if m_sub else ""
    
    # Roman numeral
    roman_numerals = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", 
                      "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
                      "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX",
                      "XXXI", "XXXII", "XXXIII"]
    roman = roman_numerals[wid] if wid < len(roman_numerals) else str(wid)

    chapters_data.append({
        "id": wid,
        "roman": roman,
        "title": title,
        "subtitle": subtitle,
        "content_md": md_text,
        "svg": svg_content
    })

# Load Glossary
from enhance_books import PRAGMATIC_METADATA
glossary_dict = {}
for wid, data in PRAGMATIC_METADATA.items():
    for term, definition in data.get("key_terms", {}).items():
        glossary_dict[term] = {
            "definition": definition,
            "world_id": wid,
            "world_title": data["title"]
        }

chapters_json = json.dumps(chapters_data, ensure_ascii=False)
glossary_json = json.dumps(glossary_dict, ensure_ascii=False)

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WORLDFUL — Atlas, Archive, Field Station</title>
  
  <!-- Google Fonts matching Brand Spec: Sentinel-like Serif, GT America-like Mono, Hand Script -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Cinzel:wght@500;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  
  <!-- Marked.js Markdown Parser -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

  <style>
    /* WORLDFUL BRAND SYSTEM COLOR PALETTE */
    :root {{
      --c-paper: #F2EFE9;
      --c-bone: #E8E0D6;
      --c-soot: #1E1E1E;
      --c-graphite: #55585A;
      --c-fog: #A9ABAD;
      --c-dirt: #7A756E;
      --c-red-bird: #9B1D1D;
      --c-stamp-border: rgba(155, 29, 29, 0.4);
      --c-grid-line: rgba(169, 171, 173, 0.35);

      --font-display: 'Playfair Display', 'Sentinel', 'Newsreader', serif;
      --font-serif: 'Newsreader', Georgia, serif;
      --font-mono: 'Space Mono', 'JetBrains Mono', monospace;
      --font-script: 'Caveat', cursive;
      --font-sans: 'Inter', sans-serif;
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}

    body {{
      background-color: var(--c-paper);
      color: var(--c-soot);
      font-family: var(--font-serif);
      font-size: 19px;
      line-height: 1.7;
      min-height: 100vh;
      overflow-x: hidden;
      background-image: 
        radial-gradient(var(--c-grid-line) 1px, transparent 0),
        linear-gradient(to right, var(--c-grid-line) 1px, transparent 1px),
        linear-gradient(to bottom, var(--c-grid-line) 1px, transparent 1px);
      background-size: 40px 40px, 200px 200px, 200px 200px;
      background-position: 0 0, 0 0, 0 0;
    }}

    /* Archival Framing Borders & Metadata Crosshairs */
    .crosshair-tl {{ position: fixed; top: 16px; left: 16px; width: 14px; height: 14px; pointer-events: none; z-index: 100; }}
    .crosshair-tr {{ position: fixed; top: 16px; right: 16px; width: 14px; height: 14px; pointer-events: none; z-index: 100; }}
    .crosshair-bl {{ position: fixed; bottom: 16px; left: 16px; width: 14px; height: 14px; pointer-events: none; z-index: 100; }}
    .crosshair-br {{ position: fixed; bottom: 16px; right: 16px; width: 14px; height: 14px; pointer-events: none; z-index: 100; }}

    .crosshair-svg {{ stroke: var(--c-red-bird); stroke-width: 1.2; fill: none; }}

    /* Layout */
    #app-container {{
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }}

    /* Global Header */
    header.brand-header {{
      border-bottom: 1px solid var(--c-fog);
      padding: 18px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(242, 239, 233, 0.92);
      backdrop-filter: blur(8px);
      position: sticky;
      top: 0;
      z-index: 90;
    }}

    .header-meta-left {{
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--c-graphite);
    }}
    .header-meta-left strong {{
      color: var(--c-soot);
      font-weight: 700;
    }}

    .brand-wordmark-title {{
      font-family: var(--font-display);
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 4px;
      color: var(--c-soot);
      text-transform: uppercase;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .header-nav {{
      display: flex;
      align-items: center;
      gap: 28px;
    }}

    .nav-btn {{
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--c-graphite);
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px 0;
      position: relative;
      transition: color 0.2s;
    }}
    .nav-btn:hover, .nav-btn.active {{
      color: var(--c-red-bird);
    }}
    .nav-btn.active::after {{
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--c-red-bird);
    }}

    /* Hero Section (Atlas & Field Station) */
    .hero-archive-stage {{
      padding: 48px 36px 40px 36px;
      max-width: 1300px;
      margin: 0 auto;
      width: 100%;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 48px;
      align-items: center;
      position: relative;
    }}

    .hero-left-column {{
      display: flex;
      flex-direction: column;
      gap: 20px;
    }}

    .hero-wordmark-mega {{
      font-family: var(--font-display);
      font-size: 88px;
      font-weight: 900;
      line-height: 0.9;
      letter-spacing: 8px;
      color: var(--c-soot);
      text-transform: uppercase;
      position: relative;
    }}

    .red-dash-bar {{
      width: 48px;
      height: 3px;
      background: var(--c-red-bird);
      margin-bottom: 8px;
    }}

    .hero-tagline-caps {{
      font-family: var(--font-mono);
      font-size: 15px;
      letter-spacing: 3px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--c-soot);
      line-height: 1.4;
    }}

    .hero-manifesto-quote {{
      font-family: var(--font-serif);
      font-size: 24px;
      line-height: 1.45;
      color: var(--c-soot);
      max-width: 480px;
    }}

    .hero-btn-enter {{
      display: inline-flex;
      align-items: center;
      gap: 14px;
      padding: 12px 28px;
      border: 1px solid var(--c-red-bird);
      background: var(--c-paper);
      color: var(--c-red-bird);
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      cursor: pointer;
      width: fit-content;
      margin-top: 12px;
      transition: all 0.2s;
    }}
    .hero-btn-enter:hover {{
      background: var(--c-red-bird);
      color: var(--c-paper);
    }}

    /* Hero Right Column: Archival Field Collage */
    .hero-right-collage {{
      position: relative;
      min-height: 380px;
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    /* Topographic contour map background */
    .topographic-bg {{
      position: absolute;
      right: 0;
      top: 0;
      width: 320px;
      height: 320px;
      opacity: 0.35;
      pointer-events: none;
    }}

    /* Field Note Card */
    .field-note-card {{
      background: var(--c-paper);
      border: 1px solid var(--c-fog);
      padding: 24px 28px;
      box-shadow: 2px 4px 14px rgba(0,0,0,0.06);
      max-width: 320px;
      position: relative;
      z-index: 5;
      transform: rotate(-1.5deg);
    }}
    .field-note-header {{
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--c-graphite);
      margin-bottom: 8px;
    }}
    .field-note-script {{
      font-family: var(--font-script);
      font-size: 25px;
      line-height: 1.25;
      color: var(--c-soot);
      margin-bottom: 12px;
    }}
    .field-note-date {{
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--c-dirt);
      letter-spacing: 1px;
    }}

    /* Archival Stamp WF */
    .archival-stamp {{
      position: absolute;
      bottom: 20px;
      right: 30px;
      width: 100px;
      height: 100px;
      border: 1.5px dashed var(--c-stamp-border);
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--c-red-bird);
      transform: rotate(12deg);
      pointer-events: none;
      z-index: 10;
    }}
    .stamp-text-arc {{
      font-family: var(--font-mono);
      font-size: 7.5px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      font-weight: 700;
    }}
    .stamp-monogram {{
      font-family: var(--font-display);
      font-size: 26px;
      font-weight: 900;
      line-height: 1;
      margin: 2px 0;
    }}

    /* Red Bird Emblem */
    .hero-red-bird {{
      position: absolute;
      top: -20px;
      right: 120px;
      width: 120px;
      height: 100px;
      z-index: 15;
      filter: drop-shadow(2px 6px 12px rgba(155, 29, 29, 0.15));
    }}

    /* Red Dashed Crossing Path */
    .crossing-path-svg {{
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
    }}

    /* Interactive Five-Phase Compression Engine (The Mouth / Model) */
    .mouth-engine-section {{
      background: var(--c-bone);
      border-top: 1px solid var(--c-fog);
      border-bottom: 1px solid var(--c-fog);
      padding: 36px;
      margin: 20px 0;
    }}
    .mouth-engine-container {{
      max-width: 1200px;
      margin: 0 auto;
    }}
    .mouth-title-bar {{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 24px;
    }}
    .mouth-heading {{
      font-family: var(--font-mono);
      font-size: 13px;
      letter-spacing: 3px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--c-soot);
    }}
    .mouth-stepper {{
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      margin-bottom: 24px;
    }}
    .mouth-step-card {{
      background: var(--c-paper);
      border: 1px solid var(--c-fog);
      padding: 14px 16px;
      cursor: pointer;
      transition: all 0.2s;
    }}
    .mouth-step-card.active {{
      border-color: var(--c-red-bird);
      box-shadow: 0 4px 12px rgba(155, 29, 29, 0.12);
    }}
    .step-num {{
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--c-red-bird);
      font-weight: 700;
    }}
    .step-name {{
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 4px 0;
    }}
    .step-desc {{
      font-family: var(--font-serif);
      font-size: 14px;
      color: var(--c-graphite);
      line-height: 1.35;
    }}

    /* Main Reader View / Dual Column */
    .reader-workspace {{
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      display: grid;
      grid-template-columns: 340px 1fr;
      min-height: calc(100vh - 80px);
      border-top: 1px solid var(--c-fog);
    }}

    /* Left Chapter / Plates Index */
    .plates-sidebar {{
      border-right: 1px solid var(--c-fog);
      background: var(--c-paper);
      overflow-y: auto;
      height: calc(100vh - 80px);
      position: sticky;
      top: 80px;
    }}

    .sidebar-filter-bar {{
      padding: 16px 20px;
      border-bottom: 1px solid var(--c-fog);
      background: var(--c-bone);
    }}
    .sidebar-search {{
      width: 100%;
      background: var(--c-paper);
      border: 1px solid var(--c-fog);
      padding: 8px 12px;
      font-family: var(--font-mono);
      font-size: 12px;
      outline: none;
      color: var(--c-soot);
    }}
    .sidebar-search:focus {{
      border-color: var(--c-red-bird);
    }}

    .plate-item {{
      padding: 16px 20px;
      border-bottom: 1px solid var(--c-grid-line);
      cursor: pointer;
      display: flex;
      gap: 14px;
      transition: all 0.15s;
    }}
    .plate-item:hover {{
      background: var(--c-bone);
    }}
    .plate-item.active {{
      background: var(--c-bone);
      border-left: 4px solid var(--c-red-bird);
    }}
    .plate-roman {{
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 700;
      color: var(--c-red-bird);
      min-width: 32px;
    }}
    .plate-title {{
      font-family: var(--font-sans);
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--c-soot);
      margin-bottom: 3px;
    }}
    .plate-subtitle {{
      font-family: var(--font-serif);
      font-size: 13px;
      font-style: italic;
      color: var(--c-graphite);
      line-height: 1.3;
    }}

    /* Right Article Reader Column */
    .article-reading-column {{
      padding: 60px 80px 140px 80px;
      background: var(--c-paper);
      overflow-y: auto;
    }}

    .article-plate-header {{
      border-bottom: 1px solid var(--c-fog);
      padding-bottom: 36px;
      margin-bottom: 48px;
      position: relative;
    }}

    .plate-top-metadata {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--c-dirt);
      margin-bottom: 20px;
    }}

    .plate-svg-emblem {{
      width: 140px;
      height: 140px;
      margin: 0 auto 28px auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }}
    .plate-svg-emblem svg {{
      width: 100%;
      height: 100%;
    }}

    .plate-h1 {{
      font-family: var(--font-display);
      font-size: 42px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--c-soot);
      margin-bottom: 12px;
      line-height: 1.1;
      text-align: center;
    }}

    .plate-h2-sub {{
      font-family: var(--font-serif);
      font-size: 24px;
      font-style: italic;
      color: var(--c-graphite);
      text-align: center;
      line-height: 1.4;
      max-width: 680px;
      margin: 0 auto;
    }}

    /* Prose Typography */
    .prose-body {{
      max-width: 720px;
      margin: 0 auto;
      font-family: var(--font-serif);
      font-size: 20px;
      line-height: 1.8;
      color: var(--c-soot);
    }}

    .prose-body h2 {{
      font-family: var(--font-sans);
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--c-soot);
      margin: 48px 0 18px 0;
      border-bottom: 1px solid var(--c-fog);
      padding-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    .prose-body h2::before {{
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background: var(--c-red-bird);
    }}

    .prose-body h3 {{
      font-family: var(--font-mono);
      font-size: 14px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--c-red-bird);
      margin: 32px 0 12px 0;
    }}

    .prose-body p {{
      margin-bottom: 26px;
    }}

    .prose-body blockquote {{
      border-left: 3px solid var(--c-red-bird);
      padding: 18px 24px;
      background: var(--c-bone);
      margin: 36px 0;
      font-style: italic;
      font-size: 22px;
      line-height: 1.6;
      color: var(--c-soot);
    }}

    .prose-body hr {{
      border: none;
      height: 1px;
      background: var(--c-fog);
      margin: 48px 0;
    }}

    .prose-body pre {{
      background: var(--c-soot) !important;
      color: var(--c-paper);
      padding: 22px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 13.5px;
      line-height: 1.65;
      overflow-x: auto;
      margin: 28px 0;
      border-left: 4px solid var(--c-red-bird);
    }}

    .prose-body code {{
      font-family: var(--font-mono);
      background: var(--c-bone);
      padding: 2px 6px;
      font-size: 0.85em;
      color: var(--c-red-bird);
    }}

    .prose-body pre code {{
      background: none;
      color: var(--c-paper);
      padding: 0;
    }}

    /* Concept Badge / Tooltip */
    .concept-chip {{
      display: inline-block;
      background: var(--c-bone);
      border: 1px solid var(--c-fog);
      padding: 4px 10px;
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 600;
      color: var(--c-red-bird);
      text-decoration: none;
      margin: 4px 4px 4px 0;
      cursor: pointer;
      transition: all 0.15s;
    }}
    .concept-chip:hover {{
      background: var(--c-red-bird);
      color: var(--c-paper);
      border-color: var(--c-red-bird);
    }}

    /* Floating Concept Modal */
    #brand-concept-modal {{
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 400px;
      background: var(--c-paper);
      border: 1px solid var(--c-red-bird);
      box-shadow: 4px 8px 24px rgba(0,0,0,0.15);
      padding: 24px;
      z-index: 150;
      display: none;
    }}

    /* Constellation Map View Modal */
    #brand-map-overlay {{
      position: fixed;
      inset: 0;
      background: rgba(242, 239, 233, 0.98);
      z-index: 300;
      display: none;
      flex-direction: column;
      padding: 40px;
      overflow-y: auto;
    }}
    .brand-map-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 20px;
      margin-top: 30px;
    }}
    .brand-map-card {{
      background: var(--c-bone);
      border: 1px solid var(--c-fog);
      padding: 20px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: all 0.2s;
    }}
    .brand-map-card:hover {{
      border-color: var(--c-red-bird);
      transform: translateY(-3px);
      box-shadow: 0 6px 18px rgba(155, 29, 29, 0.15);
    }}
    .brand-map-card-svg {{
      width: 80px;
      height: 80px;
      margin-bottom: 12px;
    }}

    /* Responsive */
    @media (max-width: 1024px) {{
      .hero-archive-stage {{ grid-template-columns: 1fr; }}
      .reader-workspace {{ grid-template-columns: 1fr; }}
      .plates-sidebar {{ height: auto; position: static; }}
      .article-reading-column {{ padding: 36px 24px; }}
    }}
  </style>
</head>
<body>

  <!-- Archival Corner Crosshairs -->
  <div class="crosshair-tl">
    <svg class="crosshair-svg" viewBox="0 0 14 14"><line x1="7" y1="0" x2="7" y2="14"/><line x1="0" y1="7" x2="14" y2="7"/></svg>
  </div>
  <div class="crosshair-tr">
    <svg class="crosshair-svg" viewBox="0 0 14 14"><line x1="7" y1="0" x2="7" y2="14"/><line x1="0" y1="7" x2="14" y2="7"/></svg>
  </div>
  <div class="crosshair-bl">
    <svg class="crosshair-svg" viewBox="0 0 14 14"><line x1="7" y1="0" x2="7" y2="14"/><line x1="0" y1="7" x2="14" y2="7"/></svg>
  </div>
  <div class="crosshair-br">
    <svg class="crosshair-svg" viewBox="0 0 14 14"><line x1="7" y1="0" x2="7" y2="14"/><line x1="0" y1="7" x2="14" y2="7"/></svg>
  </div>

  <div id="app-container">
    
    <!-- Top Header -->
    <header class="brand-header">
      <div class="header-meta-left">
        <strong>WORLDFUL PRESS</strong> &bull; ATLAS, ARCHIVE, FIELD STATION &bull; VER 1.0
      </div>

      <div class="brand-wordmark-title" onclick="scrollToHero()">
        WORLDFUL
      </div>

      <nav class="header-nav">
        <button class="nav-btn active" onclick="scrollToReader()">WORLDS</button>
        <button class="nav-btn" onclick="openBrandMap()">ATLAS MAP</button>
        <button class="nav-btn" onclick="scrollToMouth()">MOUTH / MODEL</button>
        <button class="nav-btn" onclick="openGlossaryView()">INDEX</button>
      </nav>
    </header>

    <!-- Hero Archive / Field Station Stage -->
    <section class="hero-archive-stage" id="hero-stage">
      <div class="hero-left-column">
        <div class="red-dash-bar"></div>
        <div class="hero-wordmark-mega">WORLDFUL</div>
        <div class="hero-tagline-caps">THE WORLD DOES NOT FIT THROUGH THE MOUTH</div>
        <div class="hero-manifesto-quote">
          The world is full of more than I can say.<br>
          <em>This is what crossed.</em>
        </div>
        <button class="hero-btn-enter" onclick="scrollToReader()">
          ENTER A WORLD &rarr;
        </button>
      </div>

      <div class="hero-right-collage">
        <!-- Topographic contour map SVG background -->
        <svg class="topographic-bg" viewBox="0 0 200 200" fill="none" stroke="#7A756E" stroke-width="0.75">
          <ellipse cx="100" cy="100" rx="90" ry="60"/>
          <ellipse cx="100" cy="100" rx="75" ry="50"/>
          <ellipse cx="100" cy="100" rx="60" ry="40"/>
          <ellipse cx="100" cy="100" rx="45" ry="30"/>
          <ellipse cx="100" cy="100" rx="30" ry="20"/>
          <ellipse cx="100" cy="100" rx="15" ry="10"/>
        </svg>

        <!-- Red Dashed Path across Collage -->
        <svg class="crossing-path-svg" viewBox="0 0 400 300">
          <path d="M 30,220 Q 150,180 220,100 T 360,60" fill="none" stroke="#9B1D1D" stroke-width="1.8" stroke-dasharray="6,4"/>
          <circle cx="220" cy="100" r="3" fill="#9B1D1D"/>
        </svg>

        <!-- Red Bird Vector Illustration -->
        <svg class="hero-red-bird" viewBox="0 0 160 140" fill="none">
          <path d="M40,110 L120,70" stroke="#7A756E" stroke-width="3"/>
          <path d="M90,75 C95,50 115,40 135,42 C145,43 150,50 145,58 C135,70 120,80 95,85 Z" fill="#9B1D1D"/>
          <path d="M60,105 C70,90 95,80 120,75 C100,95 80,110 60,105 Z" fill="#7A1414"/>
          <circle cx="138" cy="48" r="2.5" fill="#1E1E1E"/>
          <polygon points="148,46 158,49 148,53" fill="#1E1E1E"/>
        </svg>

        <!-- Field Note Card -->
        <div class="field-note-card">
          <div class="field-note-header">FIELD NOTE &bull; 34.0522&deg; N, 118.2437&deg; W</div>
          <div class="field-note-script">
            Wind from the S.<br>
            Closed valley.<br>
            No names here.<br>
            Only crossings.
          </div>
          <div class="field-note-date">12. IV. 23 &bull; ARCHIVE NO. WF-23-A</div>
        </div>

        <!-- Circular WF Archival Stamp -->
        <div class="archival-stamp">
          <span class="stamp-text-arc">WORLDFUL PRESS</span>
          <span class="stamp-monogram">WF</span>
          <span class="stamp-text-arc">FIELD STATION</span>
        </div>
      </div>
    </section>

    <!-- The Mouth / Model Compression Engine (5-Phase Interactive Model) -->
    <section class="mouth-engine-section" id="mouth-section">
      <div class="mouth-engine-container">
        <div class="mouth-title-bar">
          <div>
            <div class="mouth-heading">CORE INTERACTION MODEL &bull; SITE AS THE 34TH FABLE</div>
            <p style="font-size: 15px; color: var(--c-graphite); font-style: italic; margin-top: 4px;">
              The website itself is a world. It compresses and releases. It cannot fully contain what it hosts. It must fail, beautifully.
            </p>
          </div>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--c-red-bird); font-weight: 700; letter-spacing: 2px;">
            ENTER &rarr; COMPRESS &rarr; CARRY &rarr; RELEASE
          </div>
        </div>

        <div class="mouth-stepper">
          <div class="mouth-step-card active" onclick="activateMouthStep(0)">
            <div class="step-num">01. ENTER</div>
            <div class="step-name">You Arrive</div>
            <div class="step-desc">The sensory world sprawling in complete uncompressed resolution.</div>
          </div>
          <div class="mouth-step-card" onclick="activateMouthStep(1)">
            <div class="step-num">02. OBSERVE</div>
            <div class="step-name">The World As It Is</div>
            <div class="step-desc">Notice gradients, mud, temperature, scars, and raw material resistance.</div>
          </div>
          <div class="mouth-step-card" onclick="activateMouthStep(2)">
            <div class="step-num">03. DESCRIBE</div>
            <div class="step-name">The Choice to Carry</div>
            <div class="step-desc">Select which single relation travels while dropping ninety-nine percent.</div>
          </div>
          <div class="mouth-step-card" onclick="activateMouthStep(3)">
            <div class="step-num">04. COMPRESS</div>
            <div class="step-name">The Mouth Makes Small</div>
            <div class="step-desc">Convert bodily encounter into portable sign, token, or prompt.</div>
          </div>
          <div class="mouth-step-card" onclick="activateMouthStep(4)">
            <div class="step-num">05. RELEASE</div>
            <div class="step-name">Aftereffects Set Loose</div>
            <div class="step-desc">Watch absent traces redirect living bodies across space and time.</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Reader Workspace (Dual Column) -->
    <main class="reader-workspace" id="reader-workspace">
      
      <!-- Left Column: Chapter / Plates Nav -->
      <aside class="plates-sidebar">
        <div class="sidebar-filter-bar">
          <input type="text" id="plate-search" class="sidebar-search" placeholder="Filter 33 Worlds, Thinkers, Concepts...">
        </div>
        <div id="plates-list-container">
          <!-- Plate list injected via JS -->
        </div>
      </aside>

      <!-- Right Column: Active Plate Reader -->
      <section class="article-reading-column">
        <div class="article-plate-header">
          <div class="plate-top-metadata">
            <span id="plate-meta-id">PLATE 01 &bull; ARCHIVE NO. WF-23-A</span>
            <span id="plate-meta-coords">ELEV. 1738.2m &bull; LAT 34&deg;05' N</span>
          </div>

          <div class="plate-svg-emblem" id="plate-svg-target">
            <!-- SVG Emblem injected by JS -->
          </div>

          <h1 class="plate-h1" id="plate-title-target">THE KINGDOM OF TURNED HEADS</h1>
          <div class="plate-h2-sub" id="plate-subtitle-target">The Politics of Deixis and the Monopoly of Attention</div>
        </div>

        <div class="prose-body" id="prose-content-target">
          <!-- Markdown parsed prose injected by JS -->
        </div>
      </section>

    </main>

  </div>

  <!-- Floating Concept Definition Popover -->
  <div id="brand-concept-modal">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
      <div id="modal-term-name" style="font-family: var(--font-mono); font-size: 13px; font-weight: 700; color: var(--c-red-bird); text-transform: uppercase;">TERM</div>
      <button onclick="closeConceptModal()" style="background: none; border: none; font-size: 18px; cursor: pointer; color: var(--c-graphite);">&times;</button>
    </div>
    <div id="modal-term-def" style="font-family: var(--font-serif); font-size: 16px; color: var(--c-soot); line-height: 1.5; margin-bottom: 14px;">
      Definition goes here.
    </div>
    <div style="font-family: var(--font-mono); font-size: 11px; color: var(--c-dirt); letter-spacing: 1px;">
      PORTABLE CONSEQUENCE &bull; WORLDFUL ATLAS
    </div>
  </div>

  <!-- Full Atlas Map Modal Overlay -->
  <div id="brand-map-overlay">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--c-fog); padding-bottom: 18px;">
      <div>
        <div style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; color: var(--c-red-bird); text-transform: uppercase;">CARTOGRAPHIC CONSTELLATION</div>
        <h2 style="font-family: var(--font-display); font-size: 32px; font-weight: 900; letter-spacing: 2px;">THE 33 WORLDS OF DESCRIPTION</h2>
      </div>
      <button onclick="closeBrandMap()" class="hero-btn-enter" style="margin: 0;">CLOSE ATLAS [ESC]</button>
    </div>
    
    <div class="brand-map-grid" id="brand-map-grid">
      <!-- Injected map cards -->
    </div>
  </div>

  <script>
    const CHAPTERS = {chapters_json};
    const GLOSSARY = {glossary_json};
    let currentChapterIndex = 1; // Start on World 1

    function init() {{
      renderPlatesList();
      renderBrandMapGrid();
      loadPlate(1);

      // Search
      document.getElementById('plate-search').addEventListener('input', (e) => {{
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.plate-item').forEach(item => {{
          item.style.display = item.innerText.toLowerCase().includes(q) ? 'flex' : 'none';
        }});
      }});

      // Keyboard
      document.addEventListener('keydown', (e) => {{
        if (e.key === 'ArrowRight' || e.key === 'j') {{
          if (currentChapterIndex < CHAPTERS.length - 1) loadPlate(currentChapterIndex + 1);
        }} else if (e.key === 'ArrowLeft' || e.key === 'k') {{
          if (currentChapterIndex > 0) loadPlate(currentChapterIndex - 1);
        }} else if (e.key === 'Escape') {{
          closeBrandMap();
          closeConceptModal();
        }}
      }});
    }}

    function renderPlatesList() {{
      const container = document.getElementById('plates-list-container');
      container.innerHTML = CHAPTERS.map(ch => `
        <div class="plate-item ${{ch.id === currentChapterIndex ? 'active' : ''}}" id="plate-nav-${{ch.id}}" onclick="loadPlate(${{ch.id}})">
          <div class="plate-roman">${{ch.roman}}</div>
          <div>
            <div class="plate-title">${{ch.title}}</div>
            <div class="plate-subtitle">${{ch.subtitle}}</div>
          </div>
        </div>
      `).join('');
    }}

    function renderBrandMapGrid() {{
      const container = document.getElementById('brand-map-grid');
      container.innerHTML = CHAPTERS.map(ch => `
        <div class="brand-map-card" onclick="loadPlate(${{ch.id}}); closeBrandMap();">
          <div class="brand-map-card-svg">${{ch.svg}}</div>
          <div style="font-family: var(--font-mono); font-size: 10px; color: var(--c-red-bird); font-weight: 700; margin-bottom: 4px;">PLATE ${{ch.roman}}</div>
          <div style="font-family: var(--font-sans); font-size: 13px; font-weight: 700; text-transform: uppercase;">${{ch.title}}</div>
          <div style="font-family: var(--font-serif); font-size: 12px; font-style: italic; color: var(--c-graphite); margin-top: 4px;">${{ch.subtitle}}</div>
        </div>
      `).join('');
    }}

    function loadPlate(id) {{
      currentChapterIndex = id;
      const ch = CHAPTERS.find(c => c.id === id);
      if (!ch) return;

      // Update active nav
      document.querySelectorAll('.plate-item').forEach(el => el.classList.remove('active'));
      const activeEl = document.getElementById(`plate-nav-${{id}}`);
      if (activeEl) activeEl.classList.add('active');

      // Update Header
      document.getElementById('plate-meta-id').innerText = `PLATE ${{ch.roman}} \u2022 ARCHIVE NO. WF-23-A`;
      document.getElementById('plate-svg-target').innerHTML = ch.svg;
      document.getElementById('plate-title-target').innerText = ch.title;
      document.getElementById('plate-subtitle-target').innerText = ch.subtitle;

      // Render Markdown prose
      let html = marked.parse(ch.content_md);
      
      // Inject interactive concept badges
      document.getElementById('prose-content-target').innerHTML = html;

      // Attach click listeners to concept chips
      document.querySelectorAll('.prose-body a').forEach(a => {{
        if (a.href.includes('#')) {{
          const term = a.innerText.replace(/[\[\]*]/g, '').trim();
          if (GLOSSARY[term]) {{
            a.onclick = (e) => {{
              e.preventDefault();
              showConcept(term);
            }};
          }}
        }}
      }});

      // Scroll reader
      document.querySelector('.article-reading-column').scrollTop = 0;
      scrollToReader();
    }}

    function showConcept(term) {{
      const def = GLOSSARY[term];
      if (!def) return;
      document.getElementById('modal-term-name').innerText = term;
      document.getElementById('modal-term-def').innerText = def.definition;
      document.getElementById('brand-concept-modal').style.display = 'block';
    }}

    function closeConceptModal() {{
      document.getElementById('brand-concept-modal').style.display = 'none';
    }}

    function openBrandMap() {{
      document.getElementById('brand-map-overlay').style.display = 'flex';
    }}

    function closeBrandMap() {{
      document.getElementById('brand-map-overlay').style.display = 'none';
    }}

    function scrollToReader() {{
      document.getElementById('reader-workspace').scrollIntoView({{ behavior: 'smooth' }});
    }}

    function scrollToHero() {{
      document.getElementById('hero-stage').scrollIntoView({{ behavior: 'smooth' }});
    }}

    function scrollToMouth() {{
      document.getElementById('mouth-section').scrollIntoView({{ behavior: 'smooth' }});
    }}

    function openGlossaryView() {{
      openBrandMap();
    }}

    function activateMouthStep(idx) {{
      document.querySelectorAll('.mouth-step-card').forEach((card, i) => {{
        if (i === idx) card.classList.add('active');
        else card.classList.remove('active');
      }});
    }}

    window.onload = init;
  </script>
</body>
</html>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_content)

with open("reader.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Generated brand-faithful WORLDFUL reader app in index.html ({len(html_content):,} bytes)")
