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

with open("c.md", "r", encoding="utf-8") as f:
    c_text = f.read()

with open("b.md", "r", encoding="utf-8") as f:
    b_text = f.read()

with open("e.md", "r", encoding="utf-8") as f:
    e_text = f.read()

with open("k.md", "r", encoding="utf-8") as f:
    k_text = f.read()

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

raw_bracket_terms = re.findall(r'<([a-zA-Z0-9_\-\s]{2,40})>', e_text + " " + b_text)
for bt in set(raw_bracket_terms):
    clean = bt.strip()
    if clean and not clean.startswith('http') and not clean in ['symbol', 'mood/motivation', 'conception of order', 'aura of factuality', 'felt inevitability']:
        all_searchable_terms.add(clean)
        key = clean.lower()
        if key not in glossary_dict:
            glossary_dict[key] = {
                "name": clean,
                "definition": f"Ecological description species and formal operator in the WORLDFUL ontological framework.",
                "world_id": 0,
                "world_title": "WORLDFUL ONTOLOGY",
                "category": "Ecological Species"
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
        "operational": operational.strip(),
        "change_test": change_test.strip(),
        "ecology": ecology.strip(),
        "geertzian": geertzian.strip(),
        "core_problem": meta.get("core_problem", ""),
        "decision_rule": meta.get("decision_rule", "")
    })

chapters_json = json.dumps(chapters_data, ensure_ascii=False)
glossary_json = json.dumps(glossary_dict, ensure_ascii=False)
all_terms_json = json.dumps(sorted(list(all_searchable_terms), key=lambda x: -len(x)), ensure_ascii=False)

favicon_svg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%23ebe6da'/%3E%3Ccircle cx='16' cy='16' r='14' fill='none' stroke='%239e2318' stroke-width='1.5' stroke-dasharray='3,2'/%3E%3Cpath d='M10 22 C14 14 20 12 24 10 C22 15 18 20 12 23 Z' fill='%239e2318'/%3E%3Ccircle cx='22' cy='11' r='1' fill='%23211d18'/%3E%3C/svg%3E"

# Read base HTML template from build_aura_collage_worldful.py
with open("build_aura_collage_worldful.py", "r", encoding="utf-8") as f:
    orig_src = f.read()

# Extract html_template string
html_template_m = re.search(r'html_template\s*=\s*"""(.*?)"""\s*\n\s*html_rendered', orig_src, re.DOTALL)
if not html_template_m:
    raise ValueError("Could not extract html_template")
html_template = html_template_m.group(1)

# Enriched Terminal Drawer with Ecology (e.md) and Geertzian Cultural Systems (k.md)
terminal_drawer_html = """<!-- ==================== AUTHENTIC MONOSPACE FIELD TERMINAL DRAWER (COMPLETE OMNIBUS) ==================== -->
<div id="side-marginalia-drawer">
  <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #4a443a; padding-bottom:12px; margin-bottom:16px;">
    <div>
      <div style="color:var(--red); font-weight:700; font-size:.85rem; letter-spacing:.12em;" id="drawer-term-name">TERM</div>
      <div style="font-size:.62rem; color:#8a8275; letter-spacing:.18em; margin-top:2px;" id="drawer-term-category">[FIELD TERMINAL :: ARCHIVE RECORD]</div>
    </div>
    <button onclick="closeSideMarginalia()" style="background:none; border:none; font-size:22px; cursor:pointer; color:#8a8275;">&times;</button>
  </div>
  
  <!-- [00 :: CORE FIRST PRINCIPLE & DEFINITION] -->
  <div style="background:#1f1c18; padding:14px; border-left:3px solid var(--red); font-size:.86rem; line-height:1.6; color:#ede6d8; margin-bottom:14px;" id="drawer-term-desc">
    Definition.
  </div>

  <!-- [01 :: PHILOSOPHICAL LINEAGE & THINKERS] -->
  <div class="terminal-card-section">
    <div class="terminal-section-badge">
      [01 :: PHILOSOPHICAL LINEAGE & THINKERS (c.md)]
    </div>
    <div style="font-size:.78rem; line-height:1.55; color:#c7beb0;" id="drawer-thinkers-info">—</div>
  </div>

  <!-- [02 :: MATERIAL ANCESTRY & LIVED FIELD ROOTS] -->
  <div class="terminal-card-section">
    <div class="terminal-section-badge">
      [02 :: MATERIAL ANCESTRY & LIVED FIELD ROOTS (c.md)]
    </div>
    <div style="font-size:.78rem; line-height:1.55; color:#c7beb0;" id="drawer-ancestry-info">—</div>
  </div>

  <!-- [03 :: ECOLOGY OF DESCRIPTION & NATIVE SPECIES (e.md)] -->
  <div class="terminal-card-section">
    <div class="terminal-section-badge" style="color:#72b07e;">
      [03 :: ECOLOGY OF DESCRIPTION & NATIVE SPECIES (e.md)]
    </div>
    <div style="font-size:.78rem; line-height:1.55; color:#c7beb0;" id="drawer-ecology-info">—</div>
  </div>

  <!-- [04 :: GEERTZIAN CULTURAL SYSTEM & AURA (k.md)] -->
  <div class="terminal-card-section">
    <div class="terminal-section-badge" style="color:#e0a353;">
      [04 :: GEERTZIAN CULTURAL SYSTEM & FELT INEVITABILITY (k.md)]
    </div>
    <div style="font-size:.78rem; line-height:1.55; color:#c7beb0;" id="drawer-geertzian-info">—</div>
  </div>

  <!-- [05 :: COMPUTATIONAL ALGORITHM & STATE MODEL] -->
  <div class="terminal-card-section">
    <div class="terminal-section-badge">
      [05 :: COMPUTATIONAL ALGORITHM & STATE MODEL (c.md)]
    </div>
    <div style="font-size:.74rem; line-height:1.5; color:#f0a85d;" id="drawer-computational-info">—</div>
  </div>

  <!-- [06 :: STATE MACHINE SKELETON & OPERATIONAL TRACE] -->
  <div class="terminal-card-section">
    <div class="terminal-section-badge" style="color:#f5ad62;">
      [06 :: ONTOLOGY SKELETON & OPERATIONAL TRACE (b.md)]
    </div>
    <div style="font-size:.73rem; line-height:1.5; margin-bottom:8px;" id="drawer-skeleton-info">—</div>
    <div style="font-size:.73rem; line-height:1.5; color:#8ad49a;" id="drawer-operational-info">—</div>
  </div>

  <!-- [07 :: INVARIANT VALIDATION ASSERTION] -->
  <div class="terminal-card-section">
    <div class="terminal-section-badge" style="color:#8ad49a;">
      [07 :: INVARIANT VALIDATION ASSERTION (b.md)]
    </div>
    <div style="font-size:.78rem; line-height:1.55; color:#ede6d8; font-style:italic;" id="drawer-changetest-info">—</div>
  </div>
</div>"""

drawer_js = """  function openConceptSideDrawer(rawTerm, wid) {
    const key = rawTerm.toLowerCase().trim();
    let item = GLOSSARY[key];
    if (!item) {
      for (let k in GLOSSARY) {
        if (k.includes(key) || key.includes(k)) { item = GLOSSARY[k]; break; }
      }
    }

    const targetWid = (wid !== undefined ? wid : (item ? item.world_id : currentReaderId));
    const ch = CHAPTERS.find(c => c.id === targetWid);
    
    document.getElementById('drawer-term-name').innerText = item ? item.name : rawTerm;
    document.getElementById('drawer-term-category').innerText = `[FIELD TERMINAL :: WORLD ${targetWid} — ${ch ? ch.title : ''}]`;
    document.getElementById('drawer-term-desc').innerText = item ? item.definition : (ch ? `"${ch.aphorism}"` : "Operational field invariant under active investigation.");
    
    document.getElementById('drawer-thinkers-info').innerText = ch ? (ch.thinkers || "Field station citation lineages.") : "—";
    document.getElementById('drawer-ancestry-info').innerText = ch ? (ch.ancestry || "Material lived practices.") : "—";
    document.getElementById('drawer-ecology-info').innerText = ch ? (ch.ecology || "Descriptive ecology and native species.") : "—";
    document.getElementById('drawer-geertzian-info').innerText = ch ? (ch.geertzian || "Cultural system transformation and aura of factuality.") : "—";
    document.getElementById('drawer-computational-info').innerHTML = formatCodeTerminal(ch ? ch.computational : "");
    document.getElementById('drawer-skeleton-info').innerHTML = formatCodeTerminal(ch ? ch.skeleton : "");
    document.getElementById('drawer-operational-info').innerHTML = formatCodeTerminal(ch ? ch.operational : "");
    document.getElementById('drawer-changetest-info').innerText = ch ? (ch.change_test || "Validation assertion active.") : "—";

    document.getElementById('side-marginalia-drawer').classList.add('open');
  }"""

full_html = html_template.replace("__FAVICON__", favicon_svg)
full_html = full_html.replace("__CHAPTERS_JSON__", chapters_json)
full_html = full_html.replace("__GLOSSARY_JSON__", glossary_json)
full_html = full_html.replace("__ALL_TERMS_JSON__", all_terms_json)

# Inject the enriched 7-section terminal drawer
full_html = re.sub(r'<!-- ==================== AUTHENTIC MONOSPACE FIELD TERMINAL DRAWER ==================== -->.*?<!-- ==================== SEARCH MODAL ==================== -->', terminal_drawer_html + '\n\n<!-- ==================== SEARCH MODAL ==================== -->', full_html, flags=re.DOTALL)

# Inject enriched JS drawer handler
full_html = re.sub(r'function openConceptSideDrawer\(rawTerm, wid\) \{.*?\n  \}', drawer_js, full_html, flags=re.DOTALL)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(full_html)

with open("reader.html", "w", encoding="utf-8") as f:
    f.write(full_html)

print(f"Successfully compiled Complete Omnibus WORLDFUL Press Application ({len(full_html):,} bytes)!")
