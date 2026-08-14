import json
import os
import re
from pathlib import Path

chapters_data = []
img_dir = Path("readable_book/assets/images")

roman_numerals = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", 
                  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
                  "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX",
                  "XXXI", "XXXII", "XXXIII"]

for wid in range(34):
    slug_files = list(Path("readable_book").glob(f"{wid:02d}_*.md"))
    if not slug_files:
        continue
    c_path = slug_files[0]
    with open(c_path, 'r', encoding='utf-8') as f:
        md_text = f.read()
        
    m_title = re.search(r'^#\s*\d+\.\s+([^\n]+)', md_text)
    title = m_title.group(1).strip() if m_title else f"World {wid}"
    
    m_sub = re.search(r'^###\s*\*([^*]+)\*', md_text, re.M)
    subtitle = m_sub.group(1).strip() if m_sub else ""
    
    # Check for plate image
    img_rel_path = f"readable_book/assets/images/plate_{wid:02d}.png"
    has_img = (Path(img_rel_path)).exists()

    chapters_data.append({
        "id": wid,
        "roman": roman_numerals[wid],
        "title": title,
        "subtitle": subtitle,
        "content_md": md_text,
        "has_img": has_img,
        "img_src": img_rel_path if has_img else None
    })

# Load Glossary
from enhance_books import PRAGMATIC_METADATA
glossary_dict = {}
for wid, data in PRAGMATIC_METADATA.items():
    for term, definition in data.get("key_terms", {}).items():
        # normalize term key for lookup
        term_clean = term.strip().lower()
        glossary_dict[term_clean] = {
            "name": term,
            "definition": definition,
            "world_id": wid,
            "world_title": data["title"]
        }

chapters_json = json.dumps(chapters_data, ensure_ascii=False)
glossary_json = json.dumps(glossary_dict, ensure_ascii=False)

html_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WORLDFUL — The Absent Thing (Typewriter Field Monograph)</title>
  
  <!-- Typewriter & Archival Typography -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  
  <!-- Markdown parser -->
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
      --c-grid-line: rgba(169, 171, 173, 0.25);

      --font-typewriter: 'Courier Prime', 'Space Mono', monospace;
      --font-display: 'Playfair Display', 'Newsreader', Georgia, serif;
      --font-serif: 'Newsreader', 'Courier Prime', Georgia, serif;
      --font-mono: 'Space Mono', 'Courier Prime', monospace;
      --font-script: 'Caveat', cursive;
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}

    html {{
      scroll-behavior: smooth;
    }}

    /* CUSTOM SLEEK TYPEWRITER SCROLLBAR */
    ::-webkit-scrollbar {{
      width: 7px;
      height: 7px;
    }}
    ::-webkit-scrollbar-track {{
      background: var(--c-paper);
      border-left: 1px solid var(--c-fog);
    }}
    ::-webkit-scrollbar-thumb {{
      background: var(--c-fog);
      border-radius: 2px;
    }}
    ::-webkit-scrollbar-thumb:hover {{
      background: var(--c-red-bird);
    }}

    body {{
      background-color: var(--c-paper);
      color: var(--c-soot);
      font-family: var(--font-typewriter);
      font-size: 17px;
      line-height: 1.8;
      min-height: 100vh;
      overflow-x: hidden;
      background-image: 
        radial-gradient(var(--c-grid-line) 1px, transparent 0),
        linear-gradient(to right, var(--c-grid-line) 1px, transparent 1px),
        linear-gradient(to bottom, var(--c-grid-line) 1px, transparent 1px);
      background-size: 32px 32px, 160px 160px, 160px 160px;
    }}

    /* Top Reading Progress Bar */
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

    /* Fixed Archival Header */
    header.field-header {{
      border-bottom: 1px solid var(--c-fog);
      padding: 12px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(242, 239, 233, 0.96);
      backdrop-filter: blur(6px);
      position: sticky;
      top: 0;
      z-index: 100;
    }}

    .field-brand {{
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 900;
      letter-spacing: 3px;
      color: var(--c-soot);
      text-transform: uppercase;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 12px;
    }}

    .field-current-plate {{
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--c-red-bird);
      font-weight: 700;
      border-left: 1px solid var(--c-fog);
      padding-left: 14px;
    }}

    .field-controls {{
      display: flex;
      align-items: center;
      gap: 20px;
    }}

    .field-btn {{
      font-family: var(--font-mono);
      font-size: 11px;
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

    /* Layout Workspace */
    .field-workspace {{
      max-width: 1350px;
      margin: 0 auto;
      width: 100%;
      display: grid;
      grid-template-columns: 280px 1fr;
      border-top: 1px solid var(--c-fog);
    }}

    /* Left Slim Index Sidebar */
    .field-sidebar {{
      border-right: 1px solid var(--c-fog);
      background: var(--c-paper);
      height: calc(100vh - 55px);
      position: sticky;
      top: 55px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }}

    .sidebar-filter-wrap {{
      padding: 12px 14px;
      border-bottom: 1px solid var(--c-fog);
      background: var(--c-bone);
    }}
    .sidebar-filter-input {{
      width: 100%;
      background: var(--c-paper);
      border: 1px solid var(--c-fog);
      padding: 6px 10px;
      font-family: var(--font-mono);
      font-size: 11px;
      outline: none;
      color: var(--c-soot);
    }}
    .sidebar-filter-input:focus {{ border-color: var(--c-red-bird); }}

    .sidebar-nav-scroll {{
      flex: 1;
      overflow-y: auto;
    }}

    .sidebar-plate-link {{
      padding: 10px 14px;
      border-bottom: 1px solid var(--c-grid-line);
      cursor: pointer;
      display: flex;
      gap: 10px;
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
      font-size: 10.5px;
      font-weight: 700;
      color: var(--c-red-bird);
      min-width: 24px;
    }}
    .sidebar-title {{
      font-family: var(--font-typewriter);
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      line-height: 1.25;
      color: var(--c-soot);
    }}

    /* Main Fluid Text Field Stream */
    .field-stream-main {{
      padding: 30px 60px 160px 60px;
      background: var(--c-paper);
    }}

    .world-monograph-section {{
      padding-top: 40px;
      padding-bottom: 80px;
      border-bottom: 1px solid var(--c-fog);
      margin-bottom: 60px;
    }}

    .monograph-plate-header {{
      margin-bottom: 32px;
      text-align: left;
      border-bottom: 1px dashed var(--c-fog);
      padding-bottom: 24px;
    }}

    .monograph-meta-row {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--c-dirt);
      margin-bottom: 16px;
    }}

    .monograph-img-plate {{
      width: 100%;
      max-width: 820px;
      margin: 18px 0 24px 0;
      border: 1px solid var(--c-fog);
      box-shadow: 2px 4px 14px rgba(0,0,0,0.06);
    }}

    .monograph-h1 {{
      font-family: var(--font-display);
      font-size: 36px;
      font-weight: 900;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--c-soot);
      margin-bottom: 6px;
      line-height: 1.15;
    }}

    .monograph-sub {{
      font-family: var(--font-typewriter);
      font-size: 16px;
      font-style: italic;
      color: var(--c-graphite);
      line-height: 1.4;
    }}

    /* Fluid Typewritten Text Body */
    .typewriter-prose {{
      max-width: 800px;
      font-family: var(--font-typewriter);
      font-size: 16.5px;
      line-height: 1.85;
      color: var(--c-soot);
      text-rendering: optimizeLegibility;
    }}

    .typewriter-prose h2 {{
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: var(--c-red-bird);
      margin: 36px 0 14px 0;
      border-bottom: 1px solid var(--c-fog);
      padding-bottom: 4px;
    }}

    .typewriter-prose h3 {{
      font-family: var(--font-mono);
      font-size: 12.5px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--c-soot);
      margin: 24px 0 8px 0;
      font-weight: 700;
    }}

    .typewriter-prose p {{
      margin-bottom: 22px;
      text-align: justify;
      hyphens: auto;
    }}

    .typewriter-prose blockquote {{
      border-left: 3px solid var(--c-red-bird);
      padding: 14px 20px;
      background: var(--c-bone);
      margin: 28px 0;
      font-style: italic;
      font-size: 17px;
      line-height: 1.65;
    }}

    .typewriter-prose pre {{
      background: var(--c-soot) !important;
      color: var(--c-paper);
      padding: 18px;
      border-radius: 2px;
      font-family: var(--font-mono);
      font-size: 12.5px;
      line-height: 1.6;
      overflow-x: auto;
      margin: 24px 0;
      border-left: 3px solid var(--c-red-bird);
    }}
    .typewriter-prose code {{
      font-family: var(--font-mono);
      background: var(--c-bone);
      padding: 1px 4px;
      font-size: 0.9em;
      color: var(--c-red-bird);
    }}
    .typewriter-prose pre code {{
      background: none;
      color: var(--c-paper);
      padding: 0;
    }}

    .typewriter-prose hr {{
      border: none;
      height: 1px;
      background: var(--c-fog);
      margin: 36px 0;
    }}

    .typewriter-prose a {{
      color: var(--c-red-bird);
      text-decoration: underline;
      text-decoration-style: dashed;
      cursor: pointer;
      transition: all 0.1s;
    }}
    .typewriter-prose a:hover {{
      background: var(--c-bone);
      text-decoration-style: solid;
    }}

    /* Safe Concept Popover Drawer */
    #safe-concept-drawer {{
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 400px;
      background: var(--c-paper);
      border: 1px solid var(--c-red-bird);
      box-shadow: 4px 8px 24px rgba(0,0,0,0.15);
      padding: 20px 24px;
      z-index: 200;
      display: none;
    }}
    .drawer-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--c-fog);
      padding-bottom: 8px;
      margin-bottom: 10px;
    }}
    .drawer-title {{
      font-family: var(--font-mono);
      font-size: 13px;
      font-weight: 700;
      color: var(--c-red-bird);
      text-transform: uppercase;
      letter-spacing: 1px;
    }}
    .drawer-close {{
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: var(--c-graphite);
    }}
    .drawer-body {{
      font-family: var(--font-typewriter);
      font-size: 14.5px;
      line-height: 1.5;
      color: var(--c-soot);
      margin-bottom: 12px;
    }}

    /* Full-Screen Atlas Index Overlay */
    #full-atlas-overlay {{
      position: fixed;
      inset: 0;
      background: rgba(242, 239, 233, 0.98);
      z-index: 500;
      display: none;
      flex-direction: column;
      padding: 36px;
      overflow-y: auto;
    }}
    .atlas-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
      margin-top: 24px;
    }}
    .atlas-card {{
      background: var(--c-bone);
      border: 1px solid var(--c-fog);
      padding: 14px;
      cursor: pointer;
      transition: all 0.15s;
    }}
    .atlas-card:hover {{
      border-color: var(--c-red-bird);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(155, 29, 29, 0.15);
    }}

    @media (max-width: 900px) {{
      .field-workspace {{ grid-template-columns: 1fr; }}
      .field-sidebar {{ display: none; }}
      .field-stream-main {{ padding: 20px; }}
    }}
  </style>
</head>
<body>

  <div id="progress-line"></div>

  <!-- Header -->
  <header class="field-header">
    <div style="display: flex; align-items: center; gap: 16px;">
      <a href="#world-00" class="field-brand">WORLDFUL</a>
      <div class="field-current-plate" id="active-plate-label">
        PLATE 0 &bull; THE CROSSING
      </div>
    </div>

    <nav class="field-controls">
      <button class="field-btn" onclick="openAtlasOverlay()">ATLAS INDEX</button>
      <button class="field-btn" onclick="jumpToNext()">NEXT PLATE &darr;</button>
    </nav>
  </header>

  <!-- Workspace -->
  <main class="field-workspace">

    <!-- Left Sticky Sidebar -->
    <aside class="field-sidebar">
      <div class="sidebar-filter-wrap">
        <input type="text" id="filter-input" class="sidebar-filter-input" placeholder="Search 33 Plates...">
      </div>
      <div class="sidebar-nav-scroll" id="sidebar-nav-container">
        <!-- Injected via JS -->
      </div>
    </aside>

    <!-- Main Infinite Content Stream -->
    <section class="field-stream-main" id="monograph-stream">
      <!-- 34 Plates Injected via JS -->
    </section>

  </main>

  <!-- Interactive Concept Modal Drawer (Safely intercepts all clicks) -->
  <div id="safe-concept-drawer">
    <div class="drawer-header">
      <div class="drawer-title" id="drawer-term-name">TERM</div>
      <button class="drawer-close" onclick="closeConceptDrawer()">&times;</button>
    </div>
    <div class="drawer-body" id="drawer-term-desc">
      Definition.
    </div>
    <div style="font-family: var(--font-mono); font-size: 10.5px; color: var(--c-dirt); letter-spacing: 1px;">
      WORLDFUL FIELD SPECIFICATION &bull; PORTABLE CONSEQUENCE
    </div>
  </div>

  <!-- Atlas Modal -->
  <div id="full-atlas-overlay">
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--c-fog); padding-bottom: 12px;">
      <div>
        <div style="font-family: var(--font-mono); font-size: 11px; color: var(--c-red-bird); font-weight: 700; letter-spacing: 2px;">ATLAS CONSTELLATION</div>
        <h2 style="font-family: var(--font-display); font-size: 26px; font-weight: 900;">THE 33 WORLDS OF DESCRIPTION</h2>
      </div>
      <button class="field-btn" onclick="closeAtlasOverlay()" style="font-size: 14px;">CLOSE [ESC]</button>
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
      renderMonographStream();
      renderAtlasCards();
      setupScrollSpy();
      setupProgressBar();
      setupGlobalLinkInterceptor();

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

    function renderMonographStream() {{
      const stream = document.getElementById('monograph-stream');
      stream.innerHTML = CHAPTERS.map(ch => {{
        let parsed = marked.parse(ch.content_md);

        let imgTag = '';
        if (ch.has_img && ch.img_src) {{
          imgTag = `<img src="${{ch.img_src}}" alt="Plate ${{ch.roman}} Field Document" class="monograph-img-plate" loading="lazy">`;
        }}

        return `
          <article class="world-monograph-section" id="world-${{String(ch.id).padStart(2, '0')}}" data-id="${{ch.id}}" data-title="${{ch.title}}" data-roman="${{ch.roman}}">
            
            <div class="monograph-plate-header">
              <div class="monograph-meta-row">
                <span>PLATE ${{ch.roman}} &bull; ARCHIVE NO. WF-23-${{String.fromCharCode(65 + (ch.id % 26))}}</span>
                <span>WORLDFUL FIELD STATION</span>
              </div>

              ${{imgTag}}

              <h1 class="monograph-h1">${{ch.title}}</h1>
              <div class="monograph-sub">${{ch.subtitle}}</div>
            </div>

            <div class="typewriter-prose">
              ${{parsed}}
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

    function setupScrollSpy() {{
      const sections = document.querySelectorAll('.world-monograph-section');
      const observer = new IntersectionObserver((entries) => {{
        entries.forEach(entry => {{
          if (entry.isIntersecting) {{
            const id = entry.target.getAttribute('data-id');
            const title = entry.target.getAttribute('data-title');
            const roman = entry.target.getAttribute('data-roman');
            currentObservedId = parseInt(id);

            // Update top bar
            document.getElementById('active-plate-label').innerText = `PLATE ${{roman}} \u2022 ${{title}}`;

            // Update sidebar
            document.querySelectorAll('.sidebar-plate-link').forEach(a => a.classList.remove('active'));
            const activeLink = document.getElementById(`side-link-${{id}}`);
            if (activeLink) {{
              activeLink.classList.add('active');
              activeLink.scrollIntoView({{ block: 'nearest', behavior: 'smooth' }});
            }}
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

    /* Global link interceptor to prevent ERR_INVALID_URL and show popovers */
    function setupGlobalLinkInterceptor() {{
      document.addEventListener('click', (e) => {{
        const target = e.target.closest('a');
        if (!target) return;
        
        const href = target.getAttribute('href');
        const text = target.innerText.replace(/[\[\]*#]/g, '').trim().toLowerCase();

        // If it matches a glossary term
        if (GLOSSARY[text]) {{
          e.preventDefault();
          showConceptDrawer(text);
          return;
        }}

        // If it starts with #
        if (href && href.startsWith('#')) {{
          const cleanAnchor = href.replace('#', '').toLowerCase();
          if (GLOSSARY[cleanAnchor]) {{
            e.preventDefault();
            showConceptDrawer(cleanAnchor);
            return;
          }}
          // If it's a world jump
          if (href.startsWith('#world-')) {{
            return; // let browser scroll
          }}
        }}

        // If it's a file:// link, intercept and prevent error
        if (href && (href.startsWith('file://') || href.includes('.md'))) {{
          e.preventDefault();
          if (GLOSSARY[text]) {{
            showConceptDrawer(text);
          }}
        }}
      }});
    }}

    function showConceptDrawer(termKey) {{
      const item = GLOSSARY[termKey];
      if (!item) return;
      document.getElementById('drawer-term-name').innerText = item.name;
      document.getElementById('drawer-term-desc').innerText = item.definition;
      document.getElementById('safe-concept-drawer').style.display = 'block';
    }}

    function closeConceptDrawer() {{
      document.getElementById('safe-concept-drawer').style.display = 'none';
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

    window.onload = init;
  </script>
</body>
</html>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_code)

with open("reader.html", "w", encoding="utf-8") as f:
    f.write(html_code)

print(f"Generated Typewriter Monograph Reader in index.html and reader.html ({len(html_code):,} bytes)")
