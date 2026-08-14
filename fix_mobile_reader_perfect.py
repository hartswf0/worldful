import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# Let's inspect and rewrite the mobile styles for the reader overlay
mobile_reader_css = """
  /* =========================================================
     MOBILE READER MASTER OVERHAUL (100% FULL WIDTH, ZERO VOID)
     ========================================================= */
  @media (max-width: 960px) {
    #reader-overlay-view {
      position: fixed; inset: 0; z-index: 200;
      background: var(--paper); overflow-y: auto;
      width: 100vw; max-width: 100vw;
    }
    
    /* Sleek Minimalist Mobile Reader Top Bar */
    .reader-header-bar {
      position: sticky; top: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 10px 16px; background: rgba(235, 230, 218, 0.98);
      border-bottom: 1px solid var(--hair); backdrop-filter: blur(8px);
      height: 52px; width: 100%;
    }
    .reader-header-bar .cta {
      margin: 0; padding: 6px 12px; font-size: .65rem; min-width: 0; letter-spacing: .15em;
    }
    #reader-top-plate-label {
      font-size: .72rem; font-weight: 700; color: var(--red);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 58vw;
      text-align: right;
    }
    .reader-header-bar > div:last-child {
      display: none !important;
    }

    /* Layout & Grid: Strictly 1-Column 100% Full Width */
    .reader-layout {
      display: block !important;
      width: 100% !important; max-width: 100% !important;
      margin: 0 !important; border-top: none;
    }
    .reader-nav-col {
      display: none !important;
    }
    .reader-main-col {
      display: block !important;
      width: 100% !important; max-width: 100% !important;
      padding: 20px 18px 140px !important;
      box-sizing: border-box !important;
    }

    .monograph-world-block {
      width: 100% !important; max-width: 100% !important;
      padding-bottom: 50px; margin-bottom: 50px;
      box-sizing: border-box !important;
    }

    /* Archival Coordinates Header (Clean 2-line flex layout) */
    .monograph-archival-header {
      display: flex; flex-direction: column; gap: 4px; align-items: flex-start;
      font-family: var(--mono); font-size: .62rem; letter-spacing: .12em;
      color: var(--ink-soft); line-height: 1.4;
      border-bottom: 1px dashed var(--hair); padding-bottom: 8px; margin-bottom: 16px;
    }

    /* Heroic Plate: 100% Full Width Edge-to-Edge */
    .monograph-hero-plate-box {
      width: 100% !important; max-width: 100% !important; margin: 12px 0 20px !important;
    }
    .monograph-plate-image {
      width: 100% !important; max-width: 100% !important; height: auto !important;
      display: block !important; border-radius: 2px;
      filter: contrast(116%) brightness(96%) grayscale(100%) sepia(14%) !important;
    }

    /* Full Width Aphorism Callout Card */
    .monograph-aphorism-card {
      width: 100% !important; max-width: 100% !important; box-sizing: border-box !important;
      font-size: 1.14rem !important; line-height: 1.6 !important;
      padding: 14px 18px !important; margin-bottom: 24px !important;
      border-left: 3px solid var(--red) !important; background: var(--paper-hi) !important;
    }

    /* Fluid Monograph Prose: Full Width, High-Legibility Typography */
    .monograph-prose-text {
      width: 100% !important; max-width: 100% !important;
      font-size: 1.12rem !important; line-height: 1.85 !important;
      color: var(--ink) !important; text-align: left !important;
      box-sizing: border-box !important;
    }
    .monograph-prose-text p {
      margin-bottom: 18px !important; text-indent: 1.2em !important;
    }
    .monograph-prose-text p:first-of-type {
      text-indent: 0 !important;
    }

    /* Full Width Slide-Out Marginalia Drawer */
    #side-marginalia-drawer {
      width: 100vw !important; max-width: 100vw !important; right: -100vw;
      top: 52px; height: calc(100vh - 52px);
      padding: 18px 16px 60px !important; box-sizing: border-box !important;
    }
  }
"""

# Replace in index.html and reader.html
# Find the start of @media (max-width:960px) in CSS
if "/* =========================================================" in html:
    html_fixed = re.sub(r'/\* =========================================================\s+MOBILE REFLOW.*?\}\s*</style>', mobile_reader_css + '\n</style>', html, flags=re.DOTALL)
else:
    html_fixed = html.replace('</style>', mobile_reader_css + '\n</style>')

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html_fixed)

with open("reader.html", "w", encoding="utf-8") as f:
    f.write(html_fixed)

# Also update the python generator script so future builds stay clean
with open("build_eink_omnibus_worldful.py", "r", encoding="utf-8") as f:
    gen_script = f.read()

# Update python generator script template
with open("build_aura_collage_worldful.py", "r", encoding="utf-8") as f:
    aura_script = f.read()

aura_script_fixed = re.sub(r'/\* =========================================================\s+MOBILE REFLOW.*?\}\s*</style>', mobile_reader_css + '\n</style>', aura_script, flags=re.DOTALL)
with open("build_aura_collage_worldful.py", "w", encoding="utf-8") as f:
    f.write(aura_script_fixed)

print("Mobile reader layout completely overhauled to 100% full width!")
