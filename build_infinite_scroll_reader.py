import json
import os
import re
from pathlib import Path

chapters_data = []
svg_dir = Path("readable_book/assets/svgs")
img_dir = Path("readable_book/assets/images")

roman_numerals = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", 
                  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
                  "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX",
                  "XXXI", "XXXII", "XXXIII"]

# Plate specific field coordinates
coordinates = [
    ("ELEV. 3350.0m", "LAT 34°05' N, LONG 118°24' W", "GLACIAL PASS"),
    ("ELEV. 1738.2m", "LAT 34°08' N, LONG 118°19' W", "VALLEY VISTA"),
    ("ELEV. 820.5m",  "LAT 34°12' N, LONG 118°14' W", "EASTERN MEADOW"),
    ("ELEV. 12.0m",   "LAT 34°18' N, LONG 118°08' W", "CORAL REEF ARCHIPELAGO"),
    ("ELEV. 2100.0m", "LAT 34°22' N, LONG 118°02' W", "AUTUMN WATERSHED"),
    ("ELEV. 450.0m",  "LAT 34°25' N, LONG 117°58' W", "COUNCIL CHAMBER"),
    ("ELEV. 620.0m",  "LAT 34°29' N, LONG 117°52' W", "OPTICAL CORRIDOR"),
    ("ELEV. 310.0m",  "LAT 34°33' N, LONG 117°46' W", "ARCHIVAL PAVILION"),
    ("ELEV. 5.0m",    "LAT 34°37' N, LONG 117°40' W", "SALT SILT ESTUARY"),
    ("ELEV. 95.0m",   "LAT 34°41' N, LONG 117°34' W", "HARBOR WORKSHOP"),
    ("ELEV. 180.0m",  "LAT 34°45' N, LONG 117°28' W", "COURTYARD WALL"),
    ("ELEV. 540.0m",  "LAT 34°49' N, LONG 117°22' W", "TERRACOTTA TRENCH"),
    ("ELEV. 730.0m",  "LAT 34°53' N, LONG 117°16' W", "CARPENTRY GUILD"),
    ("ELEV. 4200.0m", "LAT 34°57' N, LONG 117°10' W", "SUMMIT HEAD / SEA TOE"),
    ("ELEV. 1100.0m", "LAT 35°01' N, LONG 117°04' W", "PENTHOUSE ELEVATOR"),
    ("ELEV. 230.0m",  "LAT 35°05' N, LONG 116°58' W", "FLOUR SILO MATRIX"),
    ("ELEV. 880.0m",  "LAT 35°09' N, LONG 116°52' W", "BOX 402 VAULT"),
    ("ELEV. 1450.0m", "LAT 35°13' N, LONG 116°46' W", "HIVE CITADEL"),
    ("ELEV. 600.0m",  "LAT 35°17' N, LONG 116°40' W", "DEEP DUNE BASIN"),
    ("ELEV. 40.0m",   "LAT 35°21' N, LONG 116°34' W", "GOLDEN PARCHMENT SECTOR"),
    ("ELEV. 1250.0m", "LAT 35°25' N, LONG 116°28' W", "SNAKE BASKET SANCTUARY"),
    ("ELEV. 1670.0m", "LAT 35°29' N, LONG 116°22' W", "BLACKSMITH FORGE"),
    ("ELEV. 920.0m",  "LAT 35°33' N, LONG 116°16' W", "KILN FIRING PIT"),
    ("ELEV. 340.0m",  "LAT 35°37' N, LONG 116°10' W", "CURRENCY MARKET"),
    ("ELEV. -450.0m", "LAT 35°41' N, LONG 116°04' W", "RADIOACTIVE CORE VAULT"),
    ("ELEV. 510.0m",  "LAT 35°45' N, LONG 115°58' W", "TWIN GALLERY HALL"),
    ("ELEV. 195.0m",  "LAT 35°49' N, LONG 115°52' W", "BORDER RIVER FORD"),
    ("ELEV. 4800.0m", "LAT 35°53' N, LONG 115°46' W", "TECTONIC GRANITE SHEAR"),
    ("ELEV. 670.0m",  "LAT 35°57' N, LONG 115°40' W", "ACOUSTIC THRONE ROOM"),
    ("ELEV. 890.0m",  "LAT 36°01' N, LONG 115°34' W", "RAIN SEAM PEDIMENT"),
    ("ELEV. 120.0m",  "LAT 36°05' N, LONG 115°28' W", "CARPENTER GUILD COURT"),
    ("ELEV. 310.0m",  "LAT 36°09' N, LONG 115°22' W", "BRONZE STATUE VAULT"),
    ("ELEV. 780.0m",  "LAT 36°13' N, LONG 115°16' W", "HIGH COURT STONE FLOOR"),
    ("ELEV. 0.0m",    "LAT 36°17' N, LONG 115°10' W", "THE RED HORIZON GAP")
]

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
            
    m_title = re.search(r'^#\s*\d+\.\s+([^\n]+)', md_text)
    title = m_title.group(1).strip() if m_title else f"World {wid}"
    
    m_sub = re.search(r'^###\s*\*([^*]+)\*', md_text, re.M)
    subtitle = m_sub.group(1).strip() if m_sub else ""
    
    # Check if we have a custom generated photo image for this plate
    img_path = f"readable_book/assets/images/plate_{wid:02d}.jpg"
    has_photo = os.path.exists(img_path)
    
    coord_info = coordinates[wid] if wid < len(coordinates) else ("ELEV. 1000m", "LAT 34°N", "FIELD STATION")

    chapters_data.append({
        "id": wid,
        "roman": roman_numerals[wid],
        "title": title,
        "subtitle": subtitle,
        "content_md": md_text,
        "svg": svg_content,
        "has_photo": has_photo,
        "photo_src": f"readable_book/assets/images/plate_{wid:02d}.jpg" if has_photo else None,
        "coords": coord_info
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

html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WORLDFUL — Atlas, Archive, Field Station</title>
  
  <!-- Google Fonts matching Brand System -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Cinzel:wght@500;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  
  <!-- Marked.js for fast local Markdown parsing -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

  <style>
    /* BRAND SYSTEM PALETTE */
    :root {{
      --c-paper: #F2EFE9;
      --c-bone: #E8E0D6;
      --c-soot: #1E1E1E;
      --c-graphite: #55585A;
      --c-fog: #A9ABAD;
      --c-dirt: #7A756E;
      --c-red-bird: #9B1D1D;
      --c-stamp-border: rgba(155, 29, 29, 0.4);
      --c-grid-line: rgba(169, 171, 173, 0.3);

      --font-display: 'Playfair Display', 'Newsreader', Georgia, serif;
      --font-serif: 'Newsreader', Georgia, serif;
      --font-mono: 'Space Mono', 'JetBrains Mono', monospace;
      --font-script: 'Caveat', cursive;
      --font-sans: 'Inter', sans-serif;
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}

    html {{
      scroll-behavior: smooth;
    }}

    body {{
      background-color: var(--c-paper);
      color: var(--c-soot);
      font-family: var(--font-serif);
      font-size: 19px;
      line-height: 1.75;
      min-height: 100vh;
      overflow-x: hidden;
      background-image: 
        radial-gradient(var(--c-grid-line) 1px, transparent 0),
        linear-gradient(to right, var(--c-grid-line) 1px, transparent 1px),
        linear-gradient(to bottom, var(--c-grid-line) 1px, transparent 1px);
      background-size: 40px 40px, 200px 200px, 200px 200px;
    }}

    /* Global Reading Progress Bar */
    #progress-bar {{
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: var(--c-red-bird);
      width: 0%;
      z-index: 1000;
      transition: width 0.1s ease-out;
    }}

    /* Corner Framing Marks */
    .crosshair-tl {{ position: fixed; top: 12px; left: 12px; width: 14px; height: 14px; pointer-events: none; z-index: 100; }}
    .crosshair-tr {{ position: fixed; top: 12px; right: 12px; width: 14px; height: 14px; pointer-events: none; z-index: 100; }}
    .crosshair-bl {{ position: fixed; bottom: 12px; left: 12px; width: 14px; height: 14px; pointer-events: none; z-index: 100; }}
    .crosshair-br {{ position: fixed; bottom: 12px; right: 12px; width: 14px; height: 14px; pointer-events: none; z-index: 100; }}
    .crosshair-svg {{ stroke: var(--c-red-bird); stroke-width: 1.2; fill: none; }}

    /* Sticky Brand Top Header */
    header.brand-header {{
      border-bottom: 1px solid var(--c-fog);
      padding: 14px 36px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(242, 239, 233, 0.94);
      backdrop-filter: blur(8px);
      position: sticky;
      top: 0;
      z-index: 90;
    }}

    .header-left-cluster {{
      display: flex;
      align-items: center;
      gap: 20px;
    }}

    .brand-wordmark-link {{
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 4px;
      color: var(--c-soot);
      text-transform: uppercase;
      cursor: pointer;
      text-decoration: none;
    }}

    .active-plate-indicator {{
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--c-red-bird);
      font-weight: 700;
      border-left: 1px solid var(--c-fog);
      padding-left: 16px;
    }}

    .header-nav {{
      display: flex;
      align-items: center;
      gap: 24px;
    }}

    .nav-btn {{
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--c-graphite);
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px 0;
      transition: color 0.2s;
    }}
    .nav-btn:hover {{ color: var(--c-red-bird); }}

    /* Hero Section */
    .hero-archive-stage {{
      padding: 48px 36px 40px 36px;
      max-width: 1300px;
      margin: 0 auto;
      width: 100%;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 48px;
      align-items: center;
    }}

    .hero-wordmark-mega {{
      font-family: var(--font-display);
      font-size: 84px;
      font-weight: 900;
      line-height: 0.9;
      letter-spacing: 8px;
      color: var(--c-soot);
      text-transform: uppercase;
    }}
    .red-dash-bar {{
      width: 48px;
      height: 3px;
      background: var(--c-red-bird);
      margin-bottom: 12px;
    }}
    .hero-tagline-caps {{
      font-family: var(--font-mono);
      font-size: 14px;
      letter-spacing: 3px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--c-soot);
      line-height: 1.4;
      margin: 16px 0;
    }}
    .hero-manifesto-quote {{
      font-family: var(--font-serif);
      font-size: 22px;
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
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      cursor: pointer;
      width: fit-content;
      margin-top: 24px;
      transition: all 0.2s;
    }}
    .hero-btn-enter:hover {{
      background: var(--c-red-bird);
      color: var(--c-paper);
    }}

    .hero-right-collage {{
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }}
    .hero-archival-img {{
      width: 100%;
      max-width: 480px;
      border: 1px solid var(--c-fog);
      box-shadow: 4px 8px 24px rgba(0,0,0,0.1);
      transform: rotate(-1deg);
    }}

    /* Main Dual-Column Workspace */
    .infinite-workspace {{
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
      display: grid;
      grid-template-columns: 340px 1fr;
      border-top: 1px solid var(--c-fog);
      position: relative;
    }}

    /* Left Sticky Nav Sidebar */
    .sticky-plates-nav {{
      border-right: 1px solid var(--c-fog);
      background: var(--c-paper);
      height: calc(100vh - 65px);
      position: sticky;
      top: 65px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }}

    .sidebar-search-container {{
      padding: 14px 18px;
      border-bottom: 1px solid var(--c-fog);
      background: var(--c-bone);
    }}
    .sidebar-search-input {{
      width: 100%;
      background: var(--c-paper);
      border: 1px solid var(--c-fog);
      padding: 8px 12px;
      font-family: var(--font-mono);
      font-size: 11.5px;
      outline: none;
      color: var(--c-soot);
    }}
    .sidebar-search-input:focus {{ border-color: var(--c-red-bird); }}

    .sidebar-plates-scroll {{
      flex: 1;
      overflow-y: auto;
    }}

    .plate-nav-anchor {{
      padding: 14px 18px;
      border-bottom: 1px solid var(--c-grid-line);
      cursor: pointer;
      display: flex;
      gap: 12px;
      text-decoration: none;
      color: inherit;
      transition: all 0.15s;
    }}
    .plate-nav-anchor:hover {{
      background: var(--c-bone);
    }}
    .plate-nav-anchor.active {{
      background: var(--c-bone);
      border-left: 4px solid var(--c-red-bird);
    }}
    .nav-plate-roman {{
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--c-red-bird);
      min-width: 28px;
      padding-top: 2px;
    }}
    .nav-plate-title {{
      font-family: var(--font-sans);
      font-size: 12.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--c-soot);
      line-height: 1.25;
      margin-bottom: 2px;
    }}
    .nav-plate-sub {{
      font-family: var(--font-serif);
      font-size: 12px;
      font-style: italic;
      color: var(--c-graphite);
      line-height: 1.25;
    }}

    /* Right Infinite Stream Stream */
    .infinite-content-stream {{
      padding: 40px 70px 180px 70px;
      background: var(--c-paper);
    }}

    .world-plate-section {{
      padding-top: 50px;
      padding-bottom: 70px;
      border-bottom: 2px solid var(--c-fog);
      margin-bottom: 50px;
      position: relative;
    }}

    .plate-header-banner {{
      margin-bottom: 40px;
      text-align: center;
    }}

    .plate-meta-strip {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--c-dirt);
      margin-bottom: 24px;
      border-bottom: 1px solid var(--c-grid-line);
      padding-bottom: 8px;
    }}

    /* Archival Photo Plate Display */
    .plate-visual-hero {{
      margin: 0 auto 30px auto;
      max-width: 620px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }}
    .plate-photo-img {{
      width: 100%;
      border: 1px solid var(--c-fog);
      box-shadow: 2px 6px 18px rgba(0,0,0,0.08);
      margin-bottom: 14px;
    }}
    .plate-svg-box {{
      width: 120px;
      height: 120px;
      margin: 0 auto 16px auto;
    }}
    .plate-svg-box svg {{
      width: 100%;
      height: 100%;
    }}

    .plate-main-h1 {{
      font-family: var(--font-display);
      font-size: 40px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--c-soot);
      margin-bottom: 10px;
      line-height: 1.1;
    }}
    .plate-sub-h2 {{
      font-family: var(--font-serif);
      font-size: 23px;
      font-style: italic;
      color: var(--c-graphite);
      line-height: 1.4;
      max-width: 680px;
      margin: 0 auto;
    }}

    /* Prose Styling */
    .prose-stream {{
      max-width: 720px;
      margin: 0 auto;
      font-family: var(--font-serif);
      font-size: 20px;
      line-height: 1.8;
      color: var(--c-soot);
    }}

    .prose-stream h2 {{
      font-family: var(--font-sans);
      font-size: 17px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--c-soot);
      margin: 44px 0 16px 0;
      border-bottom: 1px solid var(--c-fog);
      padding-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    .prose-stream h2::before {{
      content: '';
      display: inline-block;
      width: 7px;
      height: 7px;
      background: var(--c-red-bird);
    }}

    .prose-stream h3 {{
      font-family: var(--font-mono);
      font-size: 13.5px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--c-red-bird);
      margin: 28px 0 10px 0;
    }}

    .prose-stream p {{
      margin-bottom: 24px;
    }}

    .prose-stream blockquote {{
      border-left: 3px solid var(--c-red-bird);
      padding: 16px 22px;
      background: var(--c-bone);
      margin: 32px 0;
      font-style: italic;
      font-size: 21px;
      line-height: 1.6;
    }}

    .prose-stream hr {{
      border: none;
      height: 1px;
      background: var(--c-fog);
      margin: 44px 0;
    }}

    .prose-stream pre {{
      background: var(--c-soot) !important;
      color: var(--c-paper);
      padding: 20px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 13px;
      line-height: 1.65;
      overflow-x: auto;
      margin: 26px 0;
      border-left: 4px solid var(--c-red-bird);
    }}
    .prose-stream code {{
      font-family: var(--font-mono);
      background: var(--c-bone);
      padding: 2px 5px;
      font-size: 0.85em;
      color: var(--c-red-bird);
    }}
    .prose-stream pre code {{
      background: none;
      color: var(--c-paper);
      padding: 0;
    }}

    /* Concept Tooltip Modal */
    #concept-modal-drawer {{
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 380px;
      background: var(--c-paper);
      border: 1px solid var(--c-red-bird);
      box-shadow: 4px 8px 24px rgba(0,0,0,0.15);
      padding: 20px;
      z-index: 200;
      display: none;
    }}

    /* Floating Jump-to-Next Pill */
    .floating-jump-pill {{
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--c-paper);
      border: 1px solid var(--c-red-bird);
      padding: 8px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 700;
      color: var(--c-soot);
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
      z-index: 80;
      cursor: pointer;
      transition: all 0.2s;
    }}
    .floating-jump-pill:hover {{
      background: var(--c-red-bird);
      color: var(--c-paper);
    }}

    /* Fullscreen Atlas Constellation */
    #atlas-modal-grid {{
      position: fixed;
      inset: 0;
      background: rgba(242, 239, 233, 0.98);
      z-index: 400;
      display: none;
      flex-direction: column;
      padding: 40px;
      overflow-y: auto;
    }}
    .atlas-grid-container {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 16px;
      margin-top: 30px;
    }}
    .atlas-grid-card {{
      background: var(--c-bone);
      border: 1px solid var(--c-fog);
      padding: 16px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: all 0.2s;
    }}
    .atlas-grid-card:hover {{
      border-color: var(--c-red-bird);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(155, 29, 29, 0.15);
    }}

    @media (max-width: 1024px) {{
      .hero-archive-stage {{ grid-template-columns: 1fr; }}
      .infinite-workspace {{ grid-template-columns: 1fr; }}
      .sticky-plates-nav {{ display: none; }}
      .infinite-content-stream {{ padding: 30px 20px; }}
    }}
  </style>
</head>
<body>

  <div id="progress-bar"></div>

  <!-- Corner Precision Crosshairs -->
  <div class="crosshair-tl"><svg class="crosshair-svg" viewBox="0 0 14 14"><line x1="7" y1="0" x2="7" y2="14"/><line x1="0" y1="7" x2="14" y2="7"/></svg></div>
  <div class="crosshair-tr"><svg class="crosshair-svg" viewBox="0 0 14 14"><line x1="7" y1="0" x2="7" y2="14"/><line x1="0" y1="7" x2="14" y2="7"/></svg></div>
  <div class="crosshair-bl"><svg class="crosshair-svg" viewBox="0 0 14 14"><line x1="7" y1="0" x2="7" y2="14"/><line x1="0" y1="7" x2="14" y2="7"/></svg></div>
  <div class="crosshair-br"><svg class="crosshair-svg" viewBox="0 0 14 14"><line x1="7" y1="0" x2="7" y2="14"/><line x1="0" y1="7" x2="14" y2="7"/></svg></div>

  <!-- Sticky Global Header -->
  <header class="brand-header">
    <div class="header-left-cluster">
      <a href="#hero" class="brand-wordmark-link">WORLDFUL</a>
      <div class="active-plate-indicator" id="top-plate-indicator">
        PLATE 0 &bull; THE CROSSING
      </div>
    </div>

    <nav class="header-nav">
      <button class="nav-btn" onclick="openAtlasGrid()">ATLAS GRID</button>
      <button class="nav-btn" onclick="scrollToTop()">TOP</button>
      <button class="nav-btn" onclick="jumpToNextPlate()">NEXT PLATE &darr;</button>
    </nav>
  </header>

  <!-- Hero Archive Stage -->
  <section class="hero-archive-stage" id="hero">
    <div class="hero-left-column">
      <div class="red-dash-bar"></div>
      <div class="hero-wordmark-mega">WORLDFUL</div>
      <div class="hero-tagline-caps">THE WORLD DOES NOT FIT THROUGH THE MOUTH</div>
      <div class="hero-manifesto-quote">
        The world is full of more than I can say.<br>
        <em>This is what crossed.</em>
      </div>
      <button class="hero-btn-enter" onclick="scrollToStream()">
        ENTER THE INFINITE STREAM &darr;
      </button>
    </div>

    <div class="hero-right-collage">
      <img src="readable_book/assets/images/hero_plate.jpg" alt="WORLDFUL Archival Hero Plate" class="hero-archival-img">
    </div>
  </section>

  <!-- Continuous Infinite Scroll Workspace -->
  <main class="infinite-workspace" id="workspace">
    
    <!-- Left Sticky Navigation Sidebar -->
    <aside class="sticky-plates-nav">
      <div class="sidebar-search-container">
        <input type="text" id="stream-filter-input" class="sidebar-search-input" placeholder="Search 33 Worlds, Thinkers...">
      </div>
      <div class="sidebar-plates-scroll" id="sidebar-anchors-container">
        <!-- Anchors injected by JS -->
      </div>
    </aside>

    <!-- Right Continuous Infinite Stream -->
    <section class="infinite-content-stream" id="stream-container">
      <!-- 34 Plates rendered sequentially by JS -->
    </section>

  </main>

  <!-- Floating Jump Control -->
  <div class="floating-jump-pill" onclick="jumpToNextPlate()">
    <span>READ NEXT PLATE</span> &darr;
  </div>

  <!-- Concept Tooltip Popover -->
  <div id="concept-modal-drawer">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
      <div id="modal-term-header" style="font-family: var(--font-mono); font-size: 12px; font-weight: 700; color: var(--c-red-bird); text-transform: uppercase;">TERM</div>
      <button onclick="closeConceptModal()" style="background: none; border: none; font-size: 18px; cursor: pointer; color: var(--c-graphite);">&times;</button>
    </div>
    <div id="modal-term-body" style="font-family: var(--font-serif); font-size: 15.5px; color: var(--c-soot); line-height: 1.5; margin-bottom: 12px;">
      Definition.
    </div>
    <div style="font-family: var(--font-mono); font-size: 10px; color: var(--c-dirt); letter-spacing: 1px;">
      WORLDFUL ATLAS &bull; FIELD SPECIFICATION
    </div>
  </div>

  <!-- Full Atlas Grid Modal -->
  <div id="atlas-modal-grid">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--c-fog); padding-bottom: 14px;">
      <div>
        <div style="font-family: var(--font-mono); font-size: 11px; letter-spacing: 2px; color: var(--c-red-bird); text-transform: uppercase;">INDEX CONSTELLATION</div>
        <h2 style="font-family: var(--font-display); font-size: 28px; font-weight: 900; letter-spacing: 1px;">THE 33 WORLDS OF DESCRIPTION</h2>
      </div>
      <button onclick="closeAtlasGrid()" class="hero-btn-enter" style="margin: 0;">CLOSE [ESC]</button>
    </div>
    <div class="atlas-grid-container" id="atlas-cards-target">
      <!-- Grid cards injected by JS -->
    </div>
  </div>

  <script>
    const CHAPTERS = {chapters_json};
    const GLOSSARY = {glossary_json};
    let currentObservedIndex = 0;

    function init() {{
      renderSidebarAnchors();
      renderInfiniteStream();
      renderAtlasGrid();
      setupScrollSpy();
      setupProgressBar();

      // Search filter
      document.getElementById('stream-filter-input').addEventListener('input', (e) => {{
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.plate-nav-anchor').forEach(item => {{
          item.style.display = item.innerText.toLowerCase().includes(q) ? 'flex' : 'none';
        }});
      }});

      // Keyboard
      document.addEventListener('keydown', (e) => {{
        if (e.key === 'j' || e.key === 'ArrowDown') {{
          // Next plate
        }} else if (e.key === 'Escape') {{
          closeAtlasGrid();
          closeConceptModal();
        }}
      }});
    }}

    function renderSidebarAnchors() {{
      const container = document.getElementById('sidebar-anchors-container');
      container.innerHTML = CHAPTERS.map((ch, idx) => `
        <a href="#world-plate-${{ch.id}}" class="plate-nav-anchor ${{idx === 0 ? 'active' : ''}}" id="side-nav-${{ch.id}}">
          <div class="nav-plate-roman">${{ch.roman}}</div>
          <div>
            <div class="nav-plate-title">${{ch.title}}</div>
            <div class="nav-plate-sub">${{ch.subtitle}}</div>
          </div>
        </a>
      `).join('');
    }}

    function renderInfiniteStream() {{
      const stream = document.getElementById('stream-container');
      stream.innerHTML = CHAPTERS.map(ch => {{
        let parsed = marked.parse(ch.content_md);
        
        let visualHero = '';
        if (ch.has_photo && ch.photo_src) {{
          visualHero = `
            <div class="plate-visual-hero">
              <img src="${{ch.photo_src}}" alt="Plate ${{ch.roman}} Field Document" class="plate-photo-img">
            </div>
          `;
        }} else if (ch.svg) {{
          visualHero = `
            <div class="plate-svg-box">
              ${{ch.svg}}
            </div>
          `;
        }}

        return `
          <section class="world-plate-section" id="world-plate-${{ch.id}}" data-plate-id="${{ch.id}}" data-plate-title="${{ch.title}}" data-plate-roman="${{ch.roman}}">
            
            <div class="plate-header-banner">
              <div class="plate-meta-strip">
                <span>PLATE ${{ch.roman}} &bull; ARCHIVE NO. WF-23-${{String.fromCharCode(65 + (ch.id % 26))}}</span>
                <span>${{ch.coords[0]}} &bull; ${{ch.coords[1]}}</span>
              </div>

              ${{visualHero}}

              <h1 class="plate-main-h1">${{ch.title}}</h1>
              <div class="plate-sub-h2">${{ch.subtitle}}</div>
            </div>

            <div class="prose-stream">
              ${{parsed}}
            </div>

          </section>
        `;
      }}).join('');

      // Wire concept clicks
      document.querySelectorAll('.prose-stream a').forEach(a => {{
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
    }}

    function renderAtlasGrid() {{
      const grid = document.getElementById('atlas-cards-target');
      grid.innerHTML = CHAPTERS.map(ch => `
        <div class="atlas-grid-card" onclick="jumpToPlateId(${{ch.id}}); closeAtlasGrid();">
          <div style="width: 70px; height: 70px; margin-bottom: 8px;">${{ch.svg}}</div>
          <div style="font-family: var(--font-mono); font-size: 10px; color: var(--c-red-bird); font-weight: 700;">PLATE ${{ch.roman}}</div>
          <div style="font-family: var(--font-sans); font-size: 12px; font-weight: 700; text-transform: uppercase;">${{ch.title}}</div>
        </div>
      `).join('');
    }}

    function setupScrollSpy() {{
      const sections = document.querySelectorAll('.world-plate-section');
      const observer = new IntersectionObserver((entries) => {{
        entries.forEach(entry => {{
          if (entry.isIntersecting) {{
            const id = entry.target.getAttribute('data-plate-id');
            const title = entry.target.getAttribute('data-plate-title');
            const roman = entry.target.getAttribute('data-plate-roman');
            
            currentObservedIndex = parseInt(id);

            // Update top bar
            document.getElementById('top-plate-indicator').innerText = `PLATE ${{roman}} \u2022 ${{title}}`;

            // Update sidebar
            document.querySelectorAll('.plate-nav-anchor').forEach(a => a.classList.remove('active'));
            const activeNav = document.getElementById(`side-nav-${{id}}`);
            if (activeNav) {{
              activeNav.classList.add('active');
              // Ensure visible in sidebar viewport
              activeNav.scrollIntoView({{ block: 'nearest', behavior: 'smooth' }});
            }}
          }}
        }});
      }}, {{ rootMargin: "-20% 0px -70% 0px" }});

      sections.forEach(s => observer.observe(s));
    }}

    function setupProgressBar() {{
      window.addEventListener('scroll', () => {{
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('progress-bar').style.width = scrolled + "%";
      }});
    }}

    function showConcept(term) {{
      const item = GLOSSARY[term];
      if (!item) return;
      document.getElementById('modal-term-header').innerText = term;
      document.getElementById('modal-term-body').innerText = item.definition;
      document.getElementById('concept-modal-drawer').style.display = 'block';
    }}

    function closeConceptModal() {{
      document.getElementById('concept-modal-drawer').style.display = 'none';
    }}

    function openAtlasGrid() {{
      document.getElementById('atlas-modal-grid').style.display = 'flex';
    }}

    function closeAtlasGrid() {{
      document.getElementById('atlas-modal-grid').style.display = 'none';
    }}

    function jumpToPlateId(id) {{
      const target = document.getElementById(`world-plate-${{id}}`);
      if (target) target.scrollIntoView({{ behavior: 'smooth' }});
    }}

    function jumpToNextPlate() {{
      if (currentObservedIndex < CHAPTERS.length - 1) {{
        jumpToPlateId(currentObservedIndex + 1);
      }}
    }}

    function scrollToStream() {{
      document.getElementById('workspace').scrollIntoView({{ behavior: 'smooth' }});
    }}

    function scrollToTop() {{
      window.scrollTo({{ top: 0, behavior: 'smooth' }});
    }}

    window.onload = init;
  </script>
</body>
</html>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_template)

with open("reader.html", "w", encoding="utf-8") as f:
    f.write(html_template)

print(f"Generated seamless Infinite Scroll WORLDFUL Reader in index.html ({len(html_template):,} bytes)")
