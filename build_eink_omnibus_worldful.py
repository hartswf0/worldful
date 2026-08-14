import json
import os
import re
from pathlib import Path

from update_readable_book import CHAPTERS
from enhance_books import PRAGMATIC_METADATA
from build_infinite_scroll_reader import coordinates
from build_terminal_master_worldful import EXHAUSTIVE_DEFINITIONS

roman_numerals = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", 
                  "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX",
                  "XXI", "XXII", "XXIII", "XXIV", "XXV", "XXVI", "XXVII", "XXVIII", "XXIX", "XXX",
                  "XXXI", "XXXII", "XXXIII"]

with open("c.md", "r", encoding="utf-8") as f: c_text = f.read()
with open("b.md", "r", encoding="utf-8") as f: b_text = f.read()
with open("e.md", "r", encoding="utf-8") as f: e_text = f.read()
with open("k.md", "r", encoding="utf-8") as f: k_text = f.read()
with open("d.md", "r", encoding="utf-8") as f: d_text = f.read()

def parse_world_section(text, wid):
    pat = rf'##\s+{wid}\.\s+([^\n]+)\n(.*?)(?=##\s+\d+\.|\Z)'
    m = re.search(pat, text, re.DOTALL)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    pat_alt = rf'#\s+WORLD\[{wid}\]\s+[—\-]\s+([^\n]+)\n(.*?)(?=#\s+WORLD\[\d+\]|\Z)'
    m_alt = re.search(pat_alt, text, re.DOTALL)
    if m_alt:
        return m_alt.group(1).strip(), m_alt.group(2).strip()
    return "", ""

def extract_b_specs(wid):
    title, body = parse_world_section(b_text, wid)
    if not body:
        return "", "", "", ""
    skeleton, assumptions, operational, change_test = "", "", "", ""
    sk_m = re.search(r'\*\*Theory skeleton\.\*\*(.*?)(?=\*\*Assumption ledger\.\*\*|\*\*Operational execution flow\.\*\*|\*\*Change test\.\*\*|\Z)', body, re.DOTALL)
    if sk_m: skeleton = sk_m.group(1).strip()
    as_m = re.search(r'\*\*Assumption ledger\.\*\*(.*?)(?=\*\*Operational execution flow\.\*\*|\*\*Change test\.\*\*|\Z)', body, re.DOTALL)
    if as_m: assumptions = as_m.group(1).strip()
    op_m = re.search(r'\*\*Operational execution flow\.\*\*(.*?)(?=\*\*Change test\.\*\*|\Z)', body, re.DOTALL)
    if op_m: operational = op_m.group(1).strip()
    ct_m = re.search(r'\*\*Change test\.\*\*(.*?)$', body, re.DOTALL)
    if ct_m: change_test = ct_m.group(1).strip()
    return skeleton, assumptions, operational, change_test

def extract_c_lineage(wid):
    title, body = parse_world_section(c_text, wid)
    if not body:
        return "", "", ""
    grounded, literature, code_math = "", "", ""
    g_m = re.search(r'\*\*Grounded ancestry\.\*\*(.*?)(?=\*\*Literature / theoretical lineage\.\*\*|\*\*Code/math lineage\.\*\*|\Z)', body, re.DOTALL)
    if g_m: grounded = g_m.group(1).strip()
    l_m = re.search(r'\*\*Literature / theoretical lineage\.\*\*(.*?)(?=\*\*Code/math lineage\.\*\*|\Z)', body, re.DOTALL)
    if l_m: literature = l_m.group(1).strip()
    c_m = re.search(r'\*\*Code/math lineage\.\*\*(.*?)$', body, re.DOTALL)
    if c_m: code_math = c_m.group(1).strip()
    return grounded, literature, code_math

def extract_e_ecology(wid):
    title, body = parse_world_section(e_text, wid)
    return body

def extract_k_geertzian(wid):
    title, body = parse_world_section(k_text, wid)
    return body

def extract_d_pragmatics(wid):
    title, body = parse_world_section(d_text, wid)
    return body

glossary_dict = {}
all_searchable_terms = set()

for term, definition in EXHAUSTIVE_DEFINITIONS.items():
    key = term.lower().strip()
    all_searchable_terms.add(term.title())
    glossary_dict[key] = {
        "name": term.title(),
        "definition": definition,
        "world_id": 0,
        "world_title": "WORLDFUL ARCHIVE",
        "category": "Operational First Principle"
    }

raw_bracket_terms = re.findall(r'<([a-zA-Z0-9_\-\s]{2,40})>', e_text + " " + b_text + " " + c_text)
for bt in set(raw_bracket_terms):
    clean = bt.strip()
    if clean and not clean.startswith('http') and not clean in ['symbol', 'mood/motivation', 'conception of order', 'aura of factuality', 'felt inevitability']:
        all_searchable_terms.add(clean)
        key = clean.lower()
        if key not in glossary_dict:
            glossary_dict[key] = {
                "name": f"<{clean}>",
                "definition": f"Ecological description species, formal ontological entity, and operational state operator in the WORLDFUL framework.",
                "world_id": 0,
                "world_title": "WORLDFUL ONTOLOGY",
                "category": "Ecological & State Spec"
            }

chapters_data = []

for wid in range(34):
    cdata = CHAPTERS[wid]
    img_path = f"readable_book/assets/images/plate_{wid:02d}.png"
    has_img = os.path.exists(img_path)
    
    grounded, literature, code_math = extract_c_lineage(wid)
    skeleton, assumptions, operational, change_test = extract_b_specs(wid)
    ecology = extract_e_ecology(wid)
    geertzian = extract_k_geertzian(wid)
    pragmatics = extract_d_pragmatics(wid)
    meta = PRAGMATIC_METADATA.get(wid, {})
    coord_info = coordinates[wid] if wid < len(coordinates) else ("ELEV. 1000m", "LAT 34°N", "FIELD STATION")

    for t in cdata.get("terms", []):
        key = t.lower().strip()
        all_searchable_terms.add(t.title())
        if key in glossary_dict:
            glossary_dict[key]["world_id"] = wid
            glossary_dict[key]["world_title"] = cdata["title"]

    fluid_prose = f"""{cdata['scene'].strip()}

{cdata['mechanism'].strip()}

{cdata['parasite'].strip()}

{cdata['modern'].strip()}
"""

    chapters_data.append({
        "id": wid,
        "roman": roman_numerals[wid],
        "title": cdata["title"],
        "subtitle": cdata["subtitle"],
        "aphorism": cdata["invariant"].strip(),
        "prose": fluid_prose,
        "terms": cdata.get("terms", []),
        "has_img": has_img,
        "img_src": img_path,
        "coords": coord_info,
        "thinkers": literature.strip(),
        "ancestry": grounded.strip(),
        "computational": code_math.strip(),
        "skeleton": skeleton.strip(),
        "assumptions": assumptions.strip(),
        "operational": operational.strip(),
        "change_test": change_test.strip(),
        "ecology": ecology.strip(),
        "geertzian": geertzian.strip(),
        "pragmatics": pragmatics.strip(),
        "core_problem": meta.get("core_problem", ""),
        "decision_rule": meta.get("decision_rule", "")
    })

chapters_json = json.dumps(chapters_data, ensure_ascii=False)
glossary_json = json.dumps(glossary_dict, ensure_ascii=False)
all_terms_json = json.dumps(sorted(list(all_searchable_terms), key=lambda x: -len(x)), ensure_ascii=False)

favicon_svg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23ebe6da'/%3E%3Ccircle cx='16' cy='16' r='14' fill='none' stroke='%239e2318' stroke-width='1.5' stroke-dasharray='3,2'/%3E%3Cpath d='M10 22 C14 14 20 12 24 10 C22 15 18 20 12 23 Z' fill='%239e2318'/%3E%3Ccircle cx='22' cy='11' r='1' fill='%23211d18'/%3E%3C/svg%3E"

print("Compiling Light E-Ink Marginalia Drawer & Typography...")

with open("index.html", "r", encoding="utf-8") as f:
    current_html = f.read()

# Build dedicated light e-ink drawer and rich formatting
eink_css = """
  /* ============ LIGHT E-INK SPECIMEN DRAWER ============ */
  #side-marginalia-drawer {
    position:fixed; top:54px; right:-580px; width:540px; height:calc(100vh - 54px);
    background:#faf7f0; color:#1f1c18; border-left:2px solid var(--red);
    box-shadow:-8px 0 36px rgba(40,32,18,.25); padding:26px 28px; z-index:350;
    overflow-y:auto; transition:right .35s cubic-bezier(0.16, 1, 0.3, 1);
    font-family:var(--serif);
  }
  #side-marginalia-drawer.open { right:0; }

  .eink-card-section {
    background:#f4efe4; border:1px solid #ddd5c2; padding:16px 18px;
    margin-top:16px; border-radius:3px; box-shadow:0 1px 3px rgba(0,0,0,0.04);
  }
  .eink-section-badge {
    display:flex; align-items:center; gap:8px;
    font-family:var(--mono); font-size:.7rem; color:var(--red); font-weight:700; letter-spacing:.14em;
    margin-bottom:10px; text-transform:uppercase; border-bottom:1px solid rgba(158, 35, 24, 0.2); padding-bottom:5px;
  }

  .eink-text-block {
    font-family:var(--serif); font-size:.96rem; line-height:1.75; color:#2a251e;
  }
  .eink-text-block p { margin-bottom:10px; }
  .eink-text-block strong { color:#14120f; font-weight:700; font-family:var(--serif); }
  .eink-text-block em { font-style:italic; }

  /* CODE & SPECIFICATION IN E-INK LIGHT STYLING */
  .eink-code-box {
    background:#ede6d6; border:1px solid #d4cab5; border-left:3px solid var(--red);
    padding:12px 14px; font-family:var(--mono); font-size:.78rem; line-height:1.6; color:#211d18;
    overflow-x:auto; border-radius:2px; margin-top:8px;
  }

  /* BEAUTIFULLY STYLED <SPECIES> & <TAG> BADGES */
  .eink-tag-badge {
    display:inline-block; font-family:var(--mono); font-size:.84em; font-weight:700;
    background:#e6ddcb; color:#872016; border:1px solid rgba(135,32,22,.28);
    padding:1px 6px; border-radius:3px; vertical-align:baseline; letter-spacing:.02em;
  }
  .eink-tag-badge:hover {
    background:var(--red); color:#fff; cursor:pointer;
  }
"""

eink_drawer_html = """<!-- ==================== LIGHT E-INK MARGINALIA FIELD DRAWER (COMPLETE OMNIBUS) ==================== -->
<div id="side-marginalia-drawer">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--red); padding-bottom:12px; margin-bottom:16px;">
    <div>
      <div style="color:var(--red); font-weight:700; font-size:.92rem; letter-spacing:.12em; font-family:var(--mono);" id="drawer-term-name">TERM</div>
      <div style="font-size:.64rem; color:var(--ink-soft); letter-spacing:.18em; margin-top:2px; font-family:var(--mono);" id="drawer-term-category">[FIELD STATION SPECIMEN RECORD]</div>
    </div>
    <button onclick="closeSideMarginalia()" style="background:none; border:none; font-size:26px; cursor:pointer; color:var(--ink-soft); line-height:1;">&times;</button>
  </div>
  
  <!-- [00 :: CORE FIRST PRINCIPLE & DEFINITION] -->
  <div style="background:#f4efe4; padding:16px 18px; border-left:4px solid var(--red); font-size:1.02rem; line-height:1.7; color:var(--ink); margin-bottom:16px; font-family:var(--serif); font-style:italic;" id="drawer-term-desc">
    Definition.
  </div>

  <!-- [01 :: PHILOSOPHICAL LINEAGE & THINKERS] -->
  <div class="eink-card-section">
    <div class="eink-section-badge">
      [01 :: PHILOSOPHICAL LINEAGE & CITATION GENEALOGY (c.md)]
    </div>
    <div class="eink-text-block" id="drawer-thinkers-info">—</div>
  </div>

  <!-- [02 :: MATERIAL ANCESTRY & LIVED FIELD ROOTS] -->
  <div class="eink-card-section">
    <div class="eink-section-badge">
      [02 :: MATERIAL ANCESTRY & LIVED FIELD ROOTS (c.md)]
    </div>
    <div class="eink-text-block" id="drawer-ancestry-info">—</div>
  </div>

  <!-- [03 :: ECOLOGY OF DESCRIPTION & NATIVE SPECIES (e.md)] -->
  <div class="eink-card-section">
    <div class="eink-section-badge" style="color:#2b6b3e;">
      [03 :: ECOLOGY OF DESCRIPTION & NATIVE SPECIES (e.md)]
    </div>
    <div class="eink-text-block" id="drawer-ecology-info">—</div>
  </div>

  <!-- [04 :: GEERTZIAN CULTURAL SYSTEM & AURA OF FACTUALITY (k.md)] -->
  <div class="eink-card-section">
    <div class="eink-section-badge" style="color:#a65f12;">
      [04 :: GEERTZIAN CULTURAL SYSTEM & AURA OF FACTUALITY (k.md)]
    </div>
    <div class="eink-text-block" id="drawer-geertzian-info">—</div>
  </div>

  <!-- [05 :: COMPUTATIONAL ALGORITHM & STATE MODEL] -->
  <div class="eink-card-section">
    <div class="eink-section-badge">
      [05 :: COMPUTATIONAL ALGORITHM & STATE MODEL (c.md)]
    </div>
    <div class="eink-code-box" id="drawer-computational-info">—</div>
  </div>

  <!-- [06 :: FORMAL ONTOLOGY SKELETON & ASSUMPTIONS] -->
  <div class="eink-card-section">
    <div class="eink-section-badge" style="color:#b5651d;">
      [06 :: FORMAL ONTOLOGY SKELETON & ASSUMPTIONS (b.md)]
    </div>
    <div class="eink-code-box" id="drawer-skeleton-info">—</div>
    <div class="eink-text-block" style="margin-top:10px;" id="drawer-assumptions-info">—</div>
  </div>

  <!-- [07 :: OPERATIONAL EXECUTION TRACE] -->
  <div class="eink-card-section">
    <div class="eink-section-badge" style="color:#2b6b3e;">
      [07 :: OPERATIONAL EXECUTION TRACE (b.md)]
    </div>
    <div class="eink-code-box" style="border-left-color:#2b6b3e;" id="drawer-operational-info">—</div>
  </div>

  <!-- [08 :: INVARIANT VALIDATION ASSERTION] -->
  <div class="eink-card-section">
    <div class="eink-section-badge" style="color:var(--red);">
      [08 :: INVARIANT VALIDATION CHANGE TEST (b.md)]
    </div>
    <div class="eink-text-block" style="font-style:italic;" id="drawer-changetest-info">—</div>
  </div>
</div>"""

drawer_js_eink = """
  function formatEInkMarkdown(raw) {
    if (!raw) return '<span style="color:var(--ink-faint); font-style:italic;">—</span>';
    let formatted = marked.parse(raw);
    formatted = formatted.replace(/<([a-zA-Z0-9_\-\s]{2,40})>/g, '<span class="eink-tag-badge">&lt;$1&gt;</span>');
    return formatted;
  }

  function formatEInkCode(raw) {
    if (!raw) return '<span style="color:var(--ink-faint); font-style:italic;"># No formal model defined</span>';
    let lines = raw.split('\\n');
    return lines.map((line, idx) => {
      let l = line
        .replace(/<([a-zA-Z0-9_\-\s]{2,40})>/g, '<span style="color:#872016; font-weight:bold;">&lt;$1&gt;</span>')
        .replace(/`([^`]+)`/g, '<span style="color:#111; font-weight:bold;">$1</span>')
        .replace(/(\\[transforms into\\]|->|\\bproduces\\b|\\bcrosses\\b|\\bcreates\\b|\\bpersists\\b)/g, '<span style="color:#2b6b3e; font-weight:bold;">$1</span>')
        .replace(/(#.*$)/g, '<span style="color:#7d7567; font-style:italic;">$1</span>');
      return `<div style="display:flex; gap:8px;"><span style="color:#9e9483; user-select:none; width:16px; text-align:right; font-size:.7rem;">${idx+1}</span><span>${l}</span></div>`;
    }).join('');
  }

  function openConceptSideDrawer(rawTerm, wid) {
    const cleanKey = rawTerm.replace(/[<>]/g, '').toLowerCase().trim();
    let item = GLOSSARY[cleanKey];
    if (!item) {
      for (let k in GLOSSARY) {
        if (k.includes(cleanKey) || cleanKey.includes(k)) { item = GLOSSARY[k]; break; }
      }
    }

    const targetWid = (wid !== undefined ? wid : (item ? item.world_id : currentReaderId));
    const ch = CHAPTERS.find(c => c.id === targetWid);
    
    document.getElementById('drawer-term-name').innerText = item ? item.name : rawTerm;
    document.getElementById('drawer-term-category').innerText = `[FIELD STATION ARCHIVE :: WORLD ${targetWid} — ${ch ? ch.title : ''}]`;
    document.getElementById('drawer-term-desc').innerText = item ? item.definition : (ch ? `"${ch.aphorism}"` : "Operational field invariant under active investigation.");
    
    document.getElementById('drawer-thinkers-info').innerHTML = formatEInkMarkdown(ch ? ch.thinkers : "");
    document.getElementById('drawer-ancestry-info').innerHTML = formatEInkMarkdown(ch ? ch.ancestry : "");
    document.getElementById('drawer-ecology-info').innerHTML = formatEInkMarkdown(ch ? ch.ecology : "");
    document.getElementById('drawer-geertzian-info').innerHTML = formatEInkMarkdown(ch ? ch.geertzian : "");
    document.getElementById('drawer-computational-info').innerHTML = formatEInkCode(ch ? ch.computational : "");
    document.getElementById('drawer-skeleton-info').innerHTML = formatEInkCode(ch ? ch.skeleton : "");
    document.getElementById('drawer-assumptions-info').innerHTML = formatEInkMarkdown(ch ? ch.assumptions : "");
    document.getElementById('drawer-operational-info').innerHTML = formatEInkCode(ch ? ch.operational : "");
    document.getElementById('drawer-changetest-info').innerHTML = formatEInkMarkdown(ch ? ch.change_test : "");

    document.getElementById('side-marginalia-drawer').classList.add('open');
  }"""

# Generate full updated application
from build_aura_collage_worldful import html_template

full_html = html_template.replace("__FAVICON__", favicon_svg)
full_html = full_html.replace("__CHAPTERS_JSON__", chapters_json)
full_html = full_html.replace("__GLOSSARY_JSON__", glossary_json)
full_html = full_html.replace("__ALL_TERMS_JSON__", all_terms_json)

# Inject E-Ink CSS
full_html = full_html.replace("/* ============ AUTHENTIC MONOSPACE FIELD TERMINAL DRAWER ============ */", eink_css)

# Inject E-Ink Drawer
full_html = re.sub(r'<!-- ==================== AUTHENTIC MONOSPACE FIELD TERMINAL DRAWER.*?<!-- ==================== SEARCH MODAL ==================== -->', lambda m: eink_drawer_html + '\n\n<!-- ==================== SEARCH MODAL ==================== -->', full_html, flags=re.DOTALL)

# Inject E-Ink Drawer JS functions & scroll fix
full_html = re.sub(r'function formatCodeTerminal\(raw\) \{.*?function openConceptSideDrawer\(rawTerm, wid\) \{.*?\n  \}', lambda m: drawer_js_eink, full_html, flags=re.DOTALL)

# Also ensure openReaderAtWorld has instant scroll
from fix_reader_scroll import scroll_func
full_html = re.sub(r'function openReaderAtWorld\(id\) \{.*?\n  \}', lambda m: scroll_func, full_html, flags=re.DOTALL)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(full_html)

with open("reader.html", "w", encoding="utf-8") as f:
    f.write(full_html)

print(f"Successfully generated Light E-Ink WORLDFUL Press Application ({len(full_html):,} bytes)!")
