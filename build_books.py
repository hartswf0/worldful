import os
import glob
import re
from pathlib import Path

ROMAN_MAP = {
    'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5, 'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
    'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15, 'XVI': 16, 'XVII': 17, 'XVIII': 18,
    'XIX': 19, 'XX': 20, 'XXI': 21, 'XXII': 22, 'XXIII': 23, 'XXIV': 24, 'XXV': 25, 'XXVI': 26,
    'XXVII': 27, 'XXVIII': 28, 'XXIX': 29, 'XXX': 30, 'XXXI': 31, 'XXXII': 32, 'XXXIII': 33
}

CANONICAL_NAMES = {
    0: "THE CROSSING",
    1: "THE KINGDOM OF TURNED HEADS",
    2: "THE HOUSE WHOSE ROAD DISAPPEARED",
    3: "THE ARCHIPELAGO OF BORROWED MONSTERS",
    4: "THE VALLEY WHERE DANGERS ARRIVE EARLY",
    5: "THE REPUBLIC OF WOODEN KINGS",
    6: "THE PALACE OF THE PERFECT CAMERA",
    7: "THE CITY OF REQUIRED FIELDS",
    8: "THE MARSH OF ENFORCED LINES",
    9: "THE TWO GRIEFS",
    10: "THE COMMON BIRD",
    11: "THE COURT OF SHARDS",
    12: "THE INVISIBLE TOOL COUNTRY",
    13: "THE GIANT STATE",
    14: "THE ELEVATOR SCHOOL OF AUTHORSHIP",
    15: "THE CITY OF UNMEASURED ADJECTIVES",
    16: "THE ARCHIVE WITHOUT CONTEXT",
    17: "THE HIVE OF FORBIDDEN WORDS",
    18: "THE COUNTRY OF NEGATIVE ANIMALS",
    19: "THE EMPIRE BENEATH THE MAP",
    20: "THE SENTENCE WITH SKIN IN THE GAME",
    21: "THE SELF-FULFILLING VILLAGE",
    22: "THE SCHOOL OF COLLAPSING POTS",
    23: "THE MARKET OF DEAD METAPHORS",
    24: "THE CAVE OF THE SURVIVING SCRATCH",
    25: "THE GALLERY OF CAUSALLY DIFFERENT TWINS",
    26: "THE FORENSIC MUD",
    27: "THE MOUNTAIN THAT REFUSED TO JOIN THE STORY",
    28: "THE GREAT LISTENER",
    29: "THE HOUSE THAT LOOKED FINISHED",
    30: "THE REPUBLIC OF DEBTS",
    31: "THE FOUNDER WHO NEVER LIVED",
    32: "THE KING WHO BOWED",
    33: "THE RED BIRD WORLD — CONCLUSION AND META-WORLDTEXT"
}

# Import PRAGMATIC_METADATA from enhance_books
from enhance_books import PRAGMATIC_METADATA, build_global_glossary, build_pragmatic_compass

LAYER_ORDER = [
    ("y.md", "1. Narrative Fable", "Primary parable, dramatic dialogue, and narrative lore"),
    ("a.md", "2. Core Worldtext & World-Law", "Condensed worldtext and aphoristic law"),
    ("x.md", "3. Philosophical Essay (The Absent Thing)", "Theoretical treatise on lossy compression and detached consequence"),
    ("z.md", "4. Technological & Generative Essay", "Computational, algorithmic, and latent space perspectives"),
    ("b.md", "5. Complete 10-Part Theoretical & Operational Spec", "Initial interpretation, theory skeleton, assumption ledger, change tests, and implementation"),
    ("c.md", "6. Lineage Genome", "Parent lineage, carrier medium, epistemic debt, failure mode, and evolutionary vector"),
    ("d.md", "7. Structural Dynamics & Convergence", "Core mechanics and systemic convergence properties"),
    ("e.md", "8. Cybernetic Ecology of Description", "Information flows, metabolic costs, and niche construction"),
    ("f.md", "9. Dark Genealogy & Power Politics", "Critical analysis of institutional capture, rents, and exploitation"),
    ("g.md", "10. Institutional & Bureaucratic Dossier", "Satirical administrative governance, corporate titles, and formulary control"),
    ("j.md", "11. Thick Description Ethnography", "Geertzian field dossier on rites, taboos, and material culture"),
    ("i.md", "12. Batesonian Cultural System", "Double binds, cybernetic feedback, schismogenesis, and learning levels"),
    ("k.md", "13. Geertzian Symbolic System", "Webs of significance and symbolic choreography"),
    ("h.md", "14. 12-Prompt Parameter Matrix", "Systematic perturbation frames, constraints, and target metric levers"),
    ("GOT_396_completions_DeltaDelta.md", "15. 12 Executed Completions & Δ/ΔΔ Scoring", "Completed scenes, 8-dimensional scores, baseline deltas, and comparison shifts")
]

def clean_pseudo_code(text):
    # Fix XML-like and angle bracket tags
    text = re.sub(r'\\<([^>]+)\\>', r'*\1*', text)
    text = re.sub(r'\\<([^>]+)>', r'*\1*', text)
    text = re.sub(r'<([^>]+)>', r'*\1*', text)
    
    # Fix heading tags like ## 1. *Initial Interpretation* -> ## 1. Initial Interpretation
    text = re.sub(r'## (\d+)\.\s*\*([^*]+)\*', r'## \1. \2', text)
    text = re.sub(r'# (\d+)\.\s*\*([^*]+)\*', r'# \1. \2', text)
    
    # Clean bracketed operations [leave-trace] -> `leave-trace`
    text = re.sub(r'\[([a-z0-9\-]+)\]', r'`\1`', text)
    
    # Clean assumptions ledger lines
    lines = text.splitlines()
    cleaned_lines = []
    for line in lines:
        l_str = line.strip()
        if l_str.startswith('*safe*'):
            cleaned_lines.append(line.replace('*safe*', '✓ **Confirmed Invariant:**'))
        elif l_str.startswith('*uncertain*'):
            cleaned_lines.append(line.replace('*uncertain*', '⚠️ **Open Uncertainty:**'))
        elif l_str.startswith('*requires-user-decision*'):
            cleaned_lines.append(line.replace('*requires-user-decision*', '❓ **Decision Lever:**'))
        else:
            cleaned_lines.append(line)
            
    return "\n".join(cleaned_lines)

def extract_file(f):
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    sections = {}
    meta_sections = []
    
    if f in ['GOT_396_completions_DeltaDelta.md', 'h.md']:
        chunks = re.split(r'(?=(?:^|\n)(?:#\s*WORLD\[\d+\]|WORLD\[\d+\]\s*:=|#\s*CROSS-WORLD))', content)
        for c in chunks:
            c = c.strip()
            if not c: continue
            m = re.search(r'WORLD\[(\d+)\](?:\s*:=\s*[\"|\']([^\"|\']+)[\"|\']|\s*—\s*([^\n]+))?', c)
            if m:
                wid = int(m.group(1))
                title = m.group(2) or m.group(3) or f'WORLD[{wid}]'
                sections[wid] = (title.strip(), c)
            elif 'CROSS-WORLD' in c:
                meta_sections.append(('Cross-World Analysis', c))
            elif c.startswith('# GOT —'):
                meta_sections.append(('Preface & Scoring Guide', c))
                
    elif f == 'b.md':
        chunks = re.split(r'(?=(?:^|\n)#\s*(?:\d+\.\s+|CONCLUSION))', content)
        for c in chunks:
            c = c.strip()
            if not c: continue
            m = re.match(r'^#\s*(\d+)\.\s+([^\n]+)', c)
            if m:
                wid = int(m.group(1))
                title = m.group(2).strip()
                sections[wid] = (title, c)
            elif re.match(r'^#\s*CONCLUSION', c):
                sections[33] = ('CONCLUSION. THE RED BIRD WORLD', c)
                
    elif f in ['c.md', 'd.md', 'g.md']:
        chunks = re.split(r'(?=(?:^|\n)#\s*(?:\d+\.\s+|CONCLUSION|UNIVERSAL|SATIRICAL))', content)
        for c in chunks:
            c = c.strip()
            if not c: continue
            m = re.match(r'^#\s*(\d+)\.\s+([^\n]+)', c)
            if m:
                wid = int(m.group(1))
                title = m.group(2).strip()
                sections[wid] = (title, c)
            elif re.match(r'^#\s*CONCLUSION', c):
                sections[33] = ('CONCLUSION', c)
            else:
                m_meta = re.match(r'^#\s*([^\n]+)', c)
                mtitle = m_meta.group(1).strip() if m_meta else 'Meta'
                meta_sections.append((mtitle, c))
                
    elif f in ['e.md', 'f.md', 'i.md', 'j.md', 'k.md']:
        chunks = re.split(r'(?=(?:^|\n)(?:##\s*\d+\.\s+|#\s+(?:THE\s+|DARK\s+|CULTURAL\s+|THICK\s+|GEERTZIAN\s+|META\s+|\d+\.\s+WORLDTEXT)))', content)
        for c in chunks:
            c = c.strip()
            if not c: continue
            m_h2 = re.match(r'^##\s*(\d+)\.\s+([^\n]+)', c)
            m_meta_h1 = re.match(r'^#\s*(?:33\.\s+WORLDTEXT|THE\s+RED\s+BIRD|META-SYSTEM|THE\s+GEERTZIAN\s+META|THE\s+DARKEST\s+READING)([^\n]*)', c)
            if m_h2:
                wid = int(m_h2.group(1))
                title = m_h2.group(2).strip()
                sections[wid] = (title, c)
            elif m_meta_h1:
                title = m_meta_h1.group(0).strip('# \n')
                sections[33] = (title, c)
            else:
                m_top = re.match(r'^#\s+([^\n]+)', c)
                if m_top:
                    meta_sections.append((m_top.group(1).strip(), c))
                    
    elif f in ['a.md', 'y.md', 'x.md', 'z.md']:
        chunks = re.split(r'(?=(?:^|\n)#\s+(?:INTRODUCTION|CONCLUSION|[IVXLCDM]+\b))', content)
        for c in chunks:
            c = c.strip()
            if not c: continue
            m_intro = re.match(r'^#\s+INTRODUCTION(?:\s*\n+##\s*([^\n]+))?', c)
            m_concl = re.match(r'^#\s+CONCLUSION(?:\s*\n+##\s*([^\n]+))?', c)
            m_rom = re.match(r'^#\s+([IVXLCDM]+)\b(?:\s*\n+##\s*([^\n]+))?', c)
            if m_intro:
                sub = m_intro.group(1) or 'THE CROSSING'
                sections[0] = (sub.strip(), c)
            elif m_concl:
                sub = m_concl.group(1) or 'THE RED BIRD WORLD'
                sections[33] = (sub.strip(), c)
            elif m_rom:
                rnum = m_rom.group(1)
                wid = ROMAN_MAP.get(rnum)
                sub = m_rom.group(2) or rnum
                if wid:
                    sections[wid] = (sub.strip(), c)
            else:
                meta_sections.append(('Title & Preface', c))
                
    return sections, meta_sections

def build_all_books(output_dir="books"):
    out_path = Path(output_dir)
    out_path.mkdir(exist_ok=True)
    
    files = sorted(glob.glob('*.md'))
    extracted = {}
    all_metas = []
    
    for f in files:
        sec, meta = extract_file(f)
        extracted[f] = sec
        for mtitle, mcontent in meta:
            all_metas.append((f, mtitle, mcontent))
            
    print(f"Loaded all {len(files)} markdown source files.")
    
    book_index = []
    
    # Generate World 00 through 33
    for wid in range(34):
        canonical_name = CANONICAL_NAMES.get(wid, f"WORLD {wid}")
        clean_slug = re.sub(r'[^a-zA-Z0-9]+', '_', canonical_name).strip('_').lower()
        filename = f"{wid:02d}_{clean_slug}.md"
        filepath = out_path / filename
        meta = PRAGMATIC_METADATA.get(wid, {})
        
        # Collect available layers for this world
        available_layers = []
        for src_file, layer_title, layer_desc in LAYER_ORDER:
            if src_file in extracted and wid in extracted[src_file]:
                sec_title, sec_content = extracted[src_file][wid]
                cleaned_sec = clean_pseudo_code(sec_content)
                available_layers.append((src_file, layer_title, layer_desc, sec_title, cleaned_sec))
                
        book_index.append((wid, canonical_name, filename, len(available_layers)))
        
        with open(filepath, 'w', encoding='utf-8') as out_f:
            # 1. Header
            out_f.write(f"# BOOK / WORLD {wid:02d}: {canonical_name}\n\n")
            out_f.write(f"> **Master Unified Dossier** compiling all narrative, philosophical, cybernetic, and operational resources from {len(available_layers)} distinct corpus layers.\n\n")
            out_f.write("---\n\n")
            
            # 2. Pragmatic Executive Brief (Prominent at top)
            out_f.write("## 🎯 PRAGMATIC EXECUTIVE BRIEF & CORE PURPOSE\n\n")
            out_f.write(f"> **The Human Dilemma:** {meta.get('human_question', 'How do we coordinate action across distance and abstraction?')}\n>\n")
            out_f.write(f"> **Core Purpose:** {meta.get('core_purpose', '')}\n>\n")
            out_f.write(f"> **The Golden Rule of Thumb:** {meta.get('rule_of_thumb', '')}\n\n")
            
            out_f.write("### 🌐 Real-World & Modern Applications\n")
            for parallel in meta.get("real_world_parallels", []):
                out_f.write(f"- {parallel}\n")
                
            out_f.write("\n### 🔑 Key Concepts & Terminology Glossary\n")
            for term, definition in meta.get("key_terms", {}).items():
                out_f.write(f"- **{term}:** {definition}\n")
                
            out_f.write(f"\n### ⚠️ Critical Trap & Failure Mode\n> **Warning:** {meta.get('traps', '')}\n\n")
            out_f.write("---\n\n")
            
            # 3. Table of Contents
            out_f.write("## 📑 TABLE OF CONTENTS\n\n")
            for idx, (src_file, layer_title, layer_desc, sec_title, _) in enumerate(available_layers, 1):
                clean_layer_slug = re.sub(r'[^a-zA-Z0-9]+', '-', layer_title).strip('-').lower()
                out_f.write(f"{idx}. [{layer_title} (`{src_file}`)](#{clean_layer_slug}) — *{sec_title}*\n")
            out_f.write("\n---\n\n")
            
            # 4. Content Layers
            for idx, (src_file, layer_title, layer_desc, sec_title, sec_content) in enumerate(available_layers, 1):
                out_f.write(f"## {layer_title}\n\n")
                out_f.write(f"**Source:** [`{src_file}`](file://./{src_file}) | **Section:** *{sec_title}*\n\n")
                out_f.write(f"*{layer_desc}*\n\n")
                out_f.write("---\n\n")
                out_f.write(sec_content.strip() + "\n\n")
                out_f.write("---\n\n")
                
        print(f"  [Built] {filepath.name} ({len(available_layers)} layers, {os.path.getsize(filepath):,} bytes)")

    # Build Global Meta & Cross-World Analyses File
    meta_filepath = out_path / "00_CORPUS_PREFACES_AND_META_ANALYSES.md"
    with open(meta_filepath, 'w', encoding='utf-8') as mf:
        mf.write("# CORPUS PREFACES, GENERAL FRAMEWORKS & CROSS-WORLD ANALYSES\n\n")
        mf.write("> This document gathers all non-world-specific prefaces, theoretical introductions, scoring protocols, universal templates, and cross-world findings across the corpus.\n\n")
        mf.write("---\n\n")
        for src_file, mtitle, mcontent in all_metas:
            mf.write(f"## [{src_file}] {mtitle}\n\n")
            mf.write(clean_pseudo_code(mcontent).strip() + "\n\n---\n\n")
            
    print(f"  [Built] {meta_filepath.name} ({len(all_metas)} meta sections, {os.path.getsize(meta_filepath):,} bytes)")
    
    # Build Master Index File
    index_filepath = out_path / "README.md"
    with open(index_filepath, 'w', encoding='utf-8') as idx_f:
        idx_f.write("# THE COMPLETE WORLDTEXT CORPUS — 33 BOOKS MASTER DIRECTORY\n\n")
        idx_f.write("Every book below is a unified master dossier containing all fables, philosophical essays, 10-part theoretical specs, lineage genomes, ecologies, dark genealogies, satirical profiles, Geertzian thick descriptions, Batesonian cybernetic systems, 12-prompt matrices, and 12 completions with delta scores.\n\n")
        idx_f.write("### Executive & Pragmatic Navigation Tools\n\n")
        idx_f.write("- 🧭 [**PRAGMATIC_COMPASS.md**](PRAGMATIC_COMPASS.md) — *Fast decision table mapping each book's core human dilemma and rule of thumb to real-world applications in Software, AI, UX, and Leadership.*\n")
        idx_f.write("- 📖 [**GLOSSARY_AND_CONCEPT_INDEX.md**](GLOSSARY_AND_CONCEPT_INDEX.md) — *Master index of 102 core technical, philosophical, and cybernetic terms with cross-links.*\n")
        idx_f.write("- ⚙️ [**00_CORPUS_PREFACES_AND_META_ANALYSES.md**](00_CORPUS_PREFACES_AND_META_ANALYSES.md) — *Scoring protocols, cross-world delta findings, dark lineage genealogies, and universal POML.*\n\n")
        idx_f.write("### The 33 Books / Worlds\n\n")
        idx_f.write("| ID | Book / World Title | Layers Included | File Link |\n")
        idx_f.write("| :---: | :--- | :---: | :--- |\n")
        for wid, cname, fname, num_layers in book_index:
            idx_f.write(f"| **{wid:02d}** | **{cname}** | {num_layers} layers | [{fname}]({fname}) |\n")
        idx_f.write("\n---\n")

    print(f"  [Built] {index_filepath.name} (Master Index)")
    
    # Build Glossary and Compass
    build_global_glossary(output_dir)
    build_pragmatic_compass(output_dir)

if __name__ == "__main__":
    build_all_books("books")
