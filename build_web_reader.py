import json
import os
import re
from pathlib import Path

# Load all chapter markdown files
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
    
    chapters_data.append({
        "id": wid,
        "title": title,
        "subtitle": subtitle,
        "content_md": md_text,
        "svg": svg_content
    })

# Load Master Glossary
glossary_path = Path("readable_book/34_master_glossary_and_index.md")
with open(glossary_path, 'r', encoding='utf-8') as gf:
    glossary_md = gf.read()

from enhance_books import PRAGMATIC_METADATA

print(f"Loaded {len(chapters_data)} chapters and Master Glossary. Building index.html...")

html_template = """<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WORLDFUL — The Absent Thing: 33 Worlds of Description, Distance, and Power</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap" rel="stylesheet">
  
  <!-- Marked.js for clean markdown parsing -->
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

  <style>
    :root {
      --bg-base: #0f1117;
      --bg-surface: #181b24;
      --bg-surface-hover: #222634;
      --bg-card: #1e2230;
      --border-subtle: #2a2f42;
      --border-accent: #d4af37;
      --text-main: #e2e8f0;
      --text-muted: #94a3b8;
      --text-faint: #64748b;
      --accent-gold: #d4af37;
      --accent-cyan: #88c0d0;
      --accent-red: #bf616a;
      --accent-green: #a3be8c;
      --font-body: 'Newsreader', serif;
      --font-ui: 'Inter', sans-serif;
      --font-title: 'Cinzel', serif;
      --font-code: 'JetBrains Mono', monospace;
      --content-max-width: 780px;
    }

    html.light {
      --bg-base: #f8fafc;
      --bg-surface: #ffffff;
      --bg-surface-hover: #f1f5f9;
      --bg-card: #f8fafc;
      --border-subtle: #e2e8f0;
      --border-accent: #b45309;
      --text-main: #1e293b;
      --text-muted: #475569;
      --text-faint: #94a3b8;
      --accent-gold: #b45309;
      --accent-cyan: #0284c7;
      --accent-red: #dc2626;
      --accent-green: #16a34a;
    }

    html.parchment {
      --bg-base: #f4ecd8;
      --bg-surface: #ede2c8;
      --bg-surface-hover: #e4d7b7;
      --bg-card: #fcf6e8;
      --border-subtle: #d3c4a4;
      --border-accent: #8c6d37;
      --text-main: #2c251e;
      --text-muted: #615343;
      --text-faint: #8c7b67;
      --accent-gold: #8c6d37;
      --accent-cyan: #3b6e8c;
      --accent-red: #a83a32;
      --accent-green: #5a7d45;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-base);
      color: var(--text-main);
      font-family: var(--font-body);
      font-size: 19px;
      line-height: 1.75;
      display: flex;
      height: 100vh;
      overflow: hidden;
      transition: background-color 0.25s ease, color 0.25s ease;
    }

    /* Layout Containers */
    #sidebar {
      width: 360px;
      min-width: 360px;
      background-color: var(--bg-surface);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      height: 100%;
      z-index: 50;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    #main-content {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      position: relative;
      scroll-behavior: smooth;
    }

    /* Top Bar Header */
    .top-header {
      position: sticky;
      top: 0;
      background-color: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 40;
      backdrop-filter: blur(10px);
    }

    .brand-title {
      font-family: var(--font-title);
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 1px;
      color: var(--accent-gold);
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    .brand-title span {
      font-family: var(--font-ui);
      font-size: 12px;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      font-weight: 500;
      border-left: 1px solid var(--border-subtle);
      padding-left: 10px;
    }

    .top-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .btn-icon {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      padding: 8px 12px;
      border-radius: 6px;
      font-family: var(--font-ui);
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .btn-icon:hover {
      background: var(--bg-surface-hover);
      color: var(--text-main);
      border-color: var(--accent-gold);
    }
    .btn-icon.active {
      background: var(--accent-gold);
      color: #0f1117;
      border-color: var(--accent-gold);
      font-weight: 600;
    }

    /* Sidebar Components */
    .sidebar-header {
      padding: 18px 20px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .search-box {
      width: 100%;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      padding: 10px 14px;
      border-radius: 6px;
      font-family: var(--font-ui);
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .search-box:focus {
      border-color: var(--accent-gold);
    }

    .sidebar-nav-tabs {
      display: flex;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--bg-surface);
    }
    .sidebar-tab {
      flex: 1;
      padding: 12px;
      text-align: center;
      font-family: var(--font-ui);
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }
    .sidebar-tab.active {
      color: var(--accent-gold);
      border-bottom-color: var(--accent-gold);
      background: var(--bg-card);
    }

    .sidebar-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 10px 0;
    }

    .chapter-nav-item {
      padding: 12px 20px;
      display: flex;
      gap: 14px;
      cursor: pointer;
      border-left: 3px solid transparent;
      transition: all 0.15s;
    }
    .chapter-nav-item:hover {
      background-color: var(--bg-surface-hover);
    }
    .chapter-nav-item.active {
      background-color: var(--bg-card);
      border-left-color: var(--accent-gold);
    }
    .chapter-nav-num {
      font-family: var(--font-code);
      font-size: 13px;
      color: var(--accent-gold);
      font-weight: 600;
      padding-top: 2px;
    }
    .chapter-nav-info {
      flex: 1;
    }
    .chapter-nav-title {
      font-family: var(--font-ui);
      font-size: 14px;
      font-weight: 600;
      color: var(--text-main);
      margin-bottom: 2px;
    }
    .chapter-nav-subtitle {
      font-family: var(--font-body);
      font-size: 13px;
      color: var(--text-muted);
      font-style: italic;
      line-height: 1.3;
    }

    /* Reading Canvas */
    .article-container {
      max-width: var(--content-max-width);
      width: 100%;
      margin: 0 auto;
      padding: 48px 24px 120px 24px;
    }

    .world-hero-header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 1px solid var(--border-subtle);
    }

    .world-svg-wrapper {
      width: 140px;
      height: 140px;
      margin: 0 auto 24px auto;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .world-svg-wrapper svg {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
    }

    .world-number-badge {
      font-family: var(--font-code);
      font-size: 13px;
      font-weight: 600;
      color: var(--accent-gold);
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .world-main-title {
      font-family: var(--font-title);
      font-size: 32px;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }

    .world-subtitle-text {
      font-family: var(--font-body);
      font-size: 21px;
      font-style: italic;
      color: var(--text-muted);
      line-height: 1.4;
    }

    /* Reader Typography & Prose */
    .reader-prose h2 {
      font-family: var(--font-ui);
      font-size: 20px;
      font-weight: 700;
      color: var(--accent-cyan);
      margin: 40px 0 16px 0;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 8px;
      letter-spacing: 0.3px;
    }

    .reader-prose h3 {
      font-family: var(--font-ui);
      font-size: 16px;
      font-weight: 600;
      color: var(--accent-gold);
      margin: 28px 0 12px 0;
    }

    .reader-prose p {
      margin-bottom: 22px;
    }

    .reader-prose blockquote {
      border-left: 3px solid var(--accent-gold);
      padding: 16px 20px;
      background: var(--bg-card);
      margin: 30px 0;
      font-style: italic;
      font-size: 20px;
      line-height: 1.6;
      border-radius: 0 8px 8px 0;
    }

    .reader-prose hr {
      border: none;
      height: 1px;
      background: var(--border-subtle);
      margin: 40px 0;
    }

    .reader-prose pre {
      background: #090a0f !important;
      border: 1px solid var(--border-subtle);
      padding: 18px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 24px 0;
      font-family: var(--font-code);
      font-size: 13.5px;
      line-height: 1.6;
      color: #e2e8f0;
    }

    .reader-prose code {
      font-family: var(--font-code);
      background: var(--bg-surface);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.88em;
      border: 1px solid var(--border-subtle);
    }

    .reader-prose pre code {
      background: none;
      padding: 0;
      border: none;
    }

    /* Interactive Concept Links */
    .concept-tag {
      color: var(--accent-gold);
      text-decoration: none;
      border-bottom: 1px dashed var(--accent-gold);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.15s;
    }
    .concept-tag:hover {
      background: rgba(212, 175, 55, 0.15);
      border-bottom-style: solid;
    }

    /* Concept Modal / Drawer */
    #concept-modal {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 380px;
      background: var(--bg-surface);
      border: 1px solid var(--accent-gold);
      border-radius: 10px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.5);
      padding: 20px;
      z-index: 100;
      display: none;
      animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .modal-title {
      font-family: var(--font-ui);
      font-size: 16px;
      font-weight: 700;
      color: var(--accent-gold);
    }
    .modal-close {
      cursor: pointer;
      color: var(--text-muted);
      font-size: 18px;
    }
    .modal-body {
      font-family: var(--font-body);
      font-size: 16px;
      color: var(--text-main);
      line-height: 1.5;
      margin-bottom: 14px;
    }

    /* Interactive World Map Modal */
    #map-modal {
      position: fixed;
      inset: 0;
      background: rgba(15, 17, 23, 0.95);
      z-index: 200;
      display: none;
      flex-direction: column;
      padding: 30px;
    }
    .map-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .map-title {
      font-family: var(--font-title);
      font-size: 24px;
      color: var(--accent-gold);
    }
    .map-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;
      overflow-y: auto;
      padding: 10px;
    }
    .map-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 14px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: all 0.2s;
    }
    .map-card:hover {
      border-color: var(--accent-gold);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.3);
    }
    .map-card-svg {
      width: 70px;
      height: 70px;
      margin-bottom: 10px;
    }
    .map-card-id {
      font-family: var(--font-code);
      font-size: 11px;
      color: var(--accent-gold);
    }
    .map-card-name {
      font-family: var(--font-ui);
      font-size: 13px;
      font-weight: 600;
      color: var(--text-main);
    }

    /* Responsive */
    @media (max-width: 900px) {
      #sidebar { position: absolute; left: -360px; }
      #sidebar.open { transform: translateX(360px); }
    }
  </style>
</head>
<body>

  <!-- Sidebar Drawer -->
  <aside id="sidebar">
    <div class="sidebar-header">
      <input type="text" id="chapter-search" class="search-box" placeholder="Search chapters, thinkers, terms...">
    </div>
    
    <div class="sidebar-nav-tabs">
      <div class="sidebar-tab active" onclick="switchSidebarTab('chapters')">33 WORLDS</div>
      <div class="sidebar-tab" onclick="switchSidebarTab('glossary')">GLOSSARY</div>
    </div>
    
    <div id="tab-chapters" class="sidebar-scroll">
      <!-- Chapter List injected via JS -->
    </div>
    
    <div id="tab-glossary" class="sidebar-scroll" style="display: none; padding: 16px;">
      <!-- Glossary List injected via JS -->
    </div>
  </aside>

  <!-- Main Content Viewer -->
  <main id="main-content">
    <header class="top-header">
      <a href="#" class="brand-title" onclick="openMap()">
        WORLDFUL <span>THE ABSENT THING</span>
      </a>
      
      <div class="top-controls">
        <button class="btn-icon" onclick="openMap()">
          CONSTELLATION MAP
        </button>
        <button class="btn-icon" id="theme-btn" onclick="cycleTheme()">
          THEME: DARK
        </button>
        <button class="btn-icon" onclick="toggleSidebar()">
          INDEX
        </button>
      </div>
    </header>

    <div class="article-container">
      <div id="article-render" class="reader-prose">
        <!-- Rendered Article -->
      </div>
    </div>
  </main>

  <!-- Concept Popup Modal -->
  <div id="concept-modal">
    <div class="modal-header">
      <div id="modal-term" class="modal-title">Term</div>
      <div class="modal-close" onclick="closeConceptModal()">&times;</div>
    </div>
    <div id="modal-def" class="modal-body">Definition</div>
    <button class="btn-icon" style="width: 100%; justify-content: center;" onclick="jumpToGlossary()">
      VIEW IN GLOSSARY
    </button>
  </div>

  <!-- Interactive World Map Modal -->
  <div id="map-modal">
    <div class="map-header">
      <div class="map-title">THE 33 WORLDS CONSTELLATION</div>
      <button class="btn-icon" onclick="closeMap()">CLOSE MAP [ESC]</button>
    </div>
    <div id="map-grid-container" class="map-grid">
      <!-- Map cards injected by JS -->
    </div>
  </div>

  <script>
    const CHAPTERS = __CHAPTERS_JSON__;
    const GLOSSARY_DATA = __GLOSSARY_JSON__;
    
    let currentChapterId = 0;
    let currentThemeIndex = 0;
    const themes = ['dark', 'parchment', 'light'];

    function init() {
      renderSidebar();
      renderGlossaryTab();
      renderMapGrid();
      loadChapter(0);
      
      // Keyboard shortcuts
      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'j') {
          if (currentChapterId < CHAPTERS.length - 1) loadChapter(currentChapterId + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'k') {
          if (currentChapterId > 0) loadChapter(currentChapterId - 1);
        } else if (e.key === 'Escape') {
          closeMap();
          closeConceptModal();
        } else if (e.key === 'm') {
          openMap();
        }
      });
      
      // Search listener
      document.getElementById('chapter-search').addEventListener('input', (e) => {
        filterContent(e.target.value.toLowerCase());
      });
    }

    function renderSidebar() {
      const container = document.getElementById('tab-chapters');
      container.innerHTML = CHAPTERS.map(ch => `
        <div class="chapter-nav-item ${ch.id === currentChapterId ? 'active' : ''}" id="nav-item-${ch.id}" onclick="loadChapter(${ch.id})">
          <div class="chapter-nav-num">${String(ch.id).padStart(2, '0')}</div>
          <div class="chapter-nav-info">
            <div class="chapter-nav-title">${ch.title}</div>
            <div class="chapter-nav-subtitle">${ch.subtitle}</div>
          </div>
        </div>
      `).join('');
    }

    function renderGlossaryTab() {
      const container = document.getElementById('tab-glossary');
      const terms = Object.keys(GLOSSARY_DATA).sort();
      container.innerHTML = terms.map(term => `
        <div style="margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <div style="font-family: var(--font-ui); font-weight: 700; color: var(--accent-gold); cursor: pointer;" onclick="showConcept('${term}')">
            ${term}
          </div>
          <div style="font-size: 14px; color: var(--text-muted); margin-top: 4px;">
            ${GLOSSARY_DATA[term].definition}
          </div>
        </div>
      `).join('');
    }

    function renderMapGrid() {
      const container = document.getElementById('map-grid-container');
      container.innerHTML = CHAPTERS.map(ch => `
        <div class="map-card" onclick="loadChapter(${ch.id}); closeMap();">
          <div class="map-card-svg">${ch.svg}</div>
          <div class="map-card-id">WORLD ${String(ch.id).padStart(2, '0')}</div>
          <div class="map-card-name">${ch.title}</div>
        </div>
      `).join('');
    }

    function loadChapter(id) {
      currentChapterId = id;
      const ch = CHAPTERS.find(c => c.id === id);
      if (!ch) return;

      // Update active state in sidebar
      document.querySelectorAll('.chapter-nav-item').forEach(el => el.classList.remove('active'));
      const activeNav = document.getElementById(`nav-item-${id}`);
      if (activeNav) activeNav.classList.add('active');

      const renderContainer = document.getElementById('article-render');
      
      // Clean up markdown text for marked
      let parsedHtml = marked.parse(ch.content_md);

      // Enhance concept tags with interactive clicks
      Object.keys(GLOSSARY_DATA).forEach(term => {
        const regex = new RegExp(`\\\\b(${term})\\\\b`, 'gi');
        // Replace in text without breaking HTML tags
        // Handled via custom click listeners
      });

      renderContainer.innerHTML = `
        <div class="world-hero-header">
          <div class="world-svg-wrapper">
            ${ch.svg}
          </div>
          <div class="world-number-badge">WORLD ${String(ch.id).padStart(2, '0')}</div>
          <h1 class="world-main-title">${ch.title}</h1>
          <div class="world-subtitle-text">${ch.subtitle}</div>
        </div>
        ${parsedHtml}
      `;

      // Scroll to top
      document.getElementById('main-content').scrollTop = 0;
    }

    function showConcept(term) {
      const data = GLOSSARY_DATA[term];
      if (!data) return;
      document.getElementById('modal-term').innerText = term;
      document.getElementById('modal-def').innerText = data.definition;
      document.getElementById('concept-modal').style.display = 'block';
    }

    function closeConceptModal() {
      document.getElementById('concept-modal').style.display = 'none';
    }

    function openMap() {
      document.getElementById('map-modal').style.display = 'flex';
    }

    function closeMap() {
      document.getElementById('map-modal').style.display = 'none';
    }

    function toggleSidebar() {
      document.getElementById('sidebar').classList.toggle('open');
    }

    function switchSidebarTab(tab) {
      document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
      if (tab === 'chapters') {
        event.target.classList.add('active');
        document.getElementById('tab-chapters').style.display = 'block';
        document.getElementById('tab-glossary').style.display = 'none';
      } else {
        event.target.classList.add('active');
        document.getElementById('tab-chapters').style.display = 'none';
        document.getElementById('tab-glossary').style.display = 'block';
      }
    }

    function cycleTheme() {
      currentThemeIndex = (currentThemeIndex + 1) % themes.length;
      const nextTheme = themes[currentThemeIndex];
      document.documentElement.className = nextTheme;
      document.getElementById('theme-btn').innerText = `THEME: ${nextTheme.toUpperCase()}`;
    }

    function filterContent(query) {
      document.querySelectorAll('.chapter-nav-item').forEach(item => {
        const text = item.innerText.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
      });
    }

    window.onload = init;
  </script>
</body>
</html>
"""

# Extract clean dictionary of glossary terms
glossary_dict = {}
for wid, data in PRAGMATIC_METADATA.items():
    for term, definition in data.get("key_terms", {}).items():
        glossary_dict[term] = {
            "definition": definition,
            "world_id": wid,
            "world_title": data["title"]
        }

# Inject JSON
chapters_json_str = json.dumps(chapters_data, ensure_ascii=False)
glossary_json_str = json.dumps(glossary_dict, ensure_ascii=False)

html_output = html_template.replace("__CHAPTERS_JSON__", chapters_json_str).replace("__GLOSSARY_JSON__", glossary_json_str)

output_html_path = Path("index.html")
with open(output_html_path, 'w', encoding='utf-8') as f:
    f.write(html_output)

# Also write to reader.html
with open(Path("reader.html"), 'w', encoding='utf-8') as f:
    f.write(html_output)

print(f"Generated standalone interactive reader: {output_html_path.name} ({os.path.getsize(output_html_path):,} bytes)")
