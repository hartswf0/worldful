import os
import re
from pathlib import Path

# Load raw source files
with open('c.md', 'r', encoding='utf-8') as f:
    c_raw = f.read()

with open('b.md', 'r', encoding='utf-8') as f:
    b_raw = f.read()

# Parse c.md chunks
c_sections = {}
for chunk in re.split(r'(?=(?:^|\n)#\s*(?:\d+\.|CONCLUSION))', c_raw):
    chunk = chunk.strip()
    m = re.match(r'^#\s*(\d+)\.\s+([^—\n]+)', chunk)
    if m:
        wid = int(m.group(1))
        c_sections[wid] = chunk
    elif 'CONCLUSION' in chunk:
        c_sections[33] = chunk

# Parse b.md chunks
b_sections = {}
for chunk in re.split(r'(?=(?:^|\n)#\s*(?:\d+\.|CONCLUSION))', b_raw):
    chunk = chunk.strip()
    m = re.match(r'^#\s*(\d+)\.\s+([^\n]+)', chunk)
    if m:
        wid = int(m.group(1))
        b_sections[wid] = chunk
    elif 'CONCLUSION' in chunk:
        b_sections[33] = chunk

from update_readable_book import CHAPTERS, build_master_glossary

def clean_pseudo_code(text):
    text = re.sub(r'\\<([^>]+)\\>', r'\1', text)
    text = re.sub(r'\\<([^>]+)>', r'\1', text)
    text = re.sub(r'<([^>]+)>', r'\1', text)
    text = re.sub(r'\[([a-z0-9\-]+)\]', r'`\1`', text)
    return text

def extract_lineage(wid):
    raw = c_sections.get(wid, "")
    if not raw:
        return "", "", ""
    
    grounded = ""
    literature = ""
    code_math = ""
    
    m_ground = re.search(r'\*\*`?<Grounded-memory lineage>`?\*\*\s*(.+?)(?=\n\n\*\*`?<Literature|\Z)', raw, re.DOTALL | re.I)
    if m_ground:
        grounded = m_ground.group(1).strip()
        
    m_lit = re.search(r'\*\*`?<Literature lineage>`?\*\*\s*(.+?)(?=\n\n\*\*`?<Code/math|\Z)', raw, re.DOTALL | re.I)
    if m_lit:
        literature = m_lit.group(1).strip()
        
    m_code = re.search(r'\*\*`?<Code/math lineage>`?\*\*\s*(.+?)(?=\n\n#|\Z)', raw, re.DOTALL | re.I)
    if m_code:
        code_math = m_code.group(1).strip()
        
    return clean_pseudo_code(grounded), clean_pseudo_code(literature), clean_pseudo_code(code_math)

def extract_b_specs(wid):
    raw = b_sections.get(wid, "")
    if not raw:
        return "", "", "", ""
    
    m_skel = re.search(r'## 2\.\s*<Theory Skeleton>(.*?)(?=## 3\.|\Z)', raw, re.DOTALL | re.I)
    skeleton = m_skel.group(1).strip() if m_skel else ""
    
    m_assump = re.search(r'## 3\.\s*<Assumption Ledger>(.*?)(?=## 4\.|\Z)', raw, re.DOTALL | re.I)
    assumptions = m_assump.group(1).strip() if m_assump else ""
    
    m_op = re.search(r'## 4\.\s*<Operational Description>(.*?)(?=## 5\.|\Z)', raw, re.DOTALL | re.I)
    operational = m_op.group(1).strip() if m_op else ""
    
    m_test = re.search(r'## 6\.\s*<Change Test>(.*?)(?=## 7\.|\Z)', raw, re.DOTALL | re.I)
    change_test = m_test.group(1).strip() if m_test else ""
    
    return clean_pseudo_code(skeleton), clean_pseudo_code(assumptions), clean_pseudo_code(operational), clean_pseudo_code(change_test)

OUTPUT_DIR = Path("readable_book")

def build_master_edition():
    print("Synthesizing Master Edition with deep theoretical apparatus, formal codeblocks, and thinker citations...")
    
    for wid in range(34):
        cdata = CHAPTERS[wid]
        slug = re.sub(r'[^a-zA-Z0-9]+', '_', cdata['title']).strip('_').lower()
        filename = f"{wid:02d}_{slug}.md"
        filepath = OUTPUT_DIR / filename
        
        grounded, literature, code_math = extract_lineage(wid)
        skeleton, assumptions, operational, change_test = extract_b_specs(wid)
        
        prev_link = f"[{CHAPTERS[wid-1]['title']}](file://./{wid-1:02d}_{re.sub(r'[^a-zA-Z0-9]+', '_', CHAPTERS[wid-1]['title']).strip('_').lower()}.md)" if wid > 0 else "*(Start of Book)*"
        next_link = f"[{CHAPTERS[wid+1]['title']}](file://./{wid+1:02d}_{re.sub(r'[^a-zA-Z0-9]+', '_', CHAPTERS[wid+1]['title']).strip('_').lower()}.md)" if wid < 33 else "[Master Glossary](file://./34_master_glossary_and_index.md)"
        
        with open(filepath, 'w', encoding='utf-8') as f:
            # 1. Header & Navigation
            f.write(f"# {wid:02d}. {cdata['title']}\n")
            f.write(f"### *{cdata['subtitle']}*\n\n")
            f.write(f"**Navigation:** ⬅️ Prev: {prev_link} | 📖 [Table of Contents](file://./README.md) | 📚 [Master Glossary](file://./34_master_glossary_and_index.md) | ➡️ Next: {next_link}\n\n")
            f.write("---\n\n")
            
            # 2. The Narrative Essay (Beats I - V)
            f.write(f"## I. {cdata['beat1_title']}\n\n")
            f.write(cdata['scene'].strip() + "\n\n")
            f.write("---\n\n")
            
            f.write(f"## II. {cdata['beat2_title']}\n\n")
            f.write(cdata['mechanism'].strip() + "\n\n")
            f.write("---\n\n")
            
            f.write(f"## III. {cdata['beat3_title']}\n\n")
            f.write(cdata['parasite'].strip() + "\n\n")
            f.write("---\n\n")
            
            f.write(f"## IV. {cdata['beat4_title']}\n\n")
            f.write(cdata['modern'].strip() + "\n\n")
            f.write("---\n\n")
            
            f.write(f"## V. {cdata['beat5_title']}\n\n")
            f.write(f"> **{cdata['invariant']}**\n\n")
            f.write("---\n\n")
            
            # 3. Deep Theoretical Apparatus & Thinkers Lineage
            f.write("## VI. Theoretical Lineage & Intellectual Lineage\n\n")
            if grounded:
                f.write(f"### 🏺 Lived Historical & Material Ancestry\n\n{grounded}\n\n")
            if literature:
                f.write(f"### 📚 Philosophical & Sociological Thinkers\n\n{literature}\n\n")
            if code_math:
                f.write(f"### ⚙️ Computational & Cybernetic Lineage\n\n{code_math}\n\n")
            f.write("---\n\n")
            
            # 4. Formal Operational Architecture & Code Specification (Codeblocks)
            f.write("## VII. Formal Operational Architecture & Invariants\n\n")
            f.write("```yaml\n# FORMAL SPECIFICATION & STATE TRANSITIONS\n")
            if skeleton:
                f.write(f"Theory_Skeleton:\n  {skeleton.replace(chr(10), chr(10)+'  ')}\n\n")
            if operational:
                f.write(f"Operational_Execution_Flow:\n  {operational.replace(chr(10), chr(10)+'  ')}\n\n")
            if change_test:
                f.write(f"Invariant_Validation_Test:\n  {change_test.replace(chr(10), chr(10)+'  ')}\n")
            f.write("```\n\n")
            f.write("---\n\n")
            
            # 5. Core Concepts in this World with links
            f.write("### 🔑 Core Concepts Defined in This Chapter\n\n")
            for term in cdata['terms']:
                term_slug = re.sub(r'[^a-zA-Z0-9]+', '-', term).strip('-').lower()
                f.write(f"- [**{term}**](file://./34_master_glossary_and_index.md#{term_slug})\n")
            f.write("\n")
            
        print(f"  [Master Chapter Synthesized] {filename}")

    # Build Glossary
    glossary_filepath = OUTPUT_DIR / "34_master_glossary_and_index.md"
    all_terms = build_master_glossary(glossary_filepath)
    
    # Build Master Book Volume
    build_complete_master_volume(all_terms)
    print("Master Edition Synthesis Complete!")

def build_complete_master_volume(all_terms):
    master_path = Path("THE_ABSENT_THING_COMPLETE_BOOK.md")
    print(f"Compiling complete master book to {master_path.name}...")
    
    with open(master_path, 'w', encoding='utf-8') as mf:
        mf.write("# THE ABSENT THING\n")
        mf.write("## 33 Worlds of Description, Distance, and Power\n\n")
        mf.write("> *What is not here can still put weight on what happens here.*\n\n")
        mf.write("---\n\n")
        mf.write("## 📑 TABLE OF CONTENTS\n\n")
        
        for wid in range(34):
            cdata = CHAPTERS[wid]
            clean_title = f"{wid:02d}. {cdata['title']}"
            anchor = re.sub(r'[^a-zA-Z0-9\- ]', '', clean_title).strip().lower().replace(' ', '-')
            mf.write(f"{wid:02d}. [**{cdata['title']}**](#{anchor}) — *{cdata['subtitle']}*\n")
            
        mf.write("34. [**MASTER GLOSSARY & CONCEPT INDEX**](#34-master-glossary--concept-index) — *Alphabetical index of 102 core concepts*\n")
        mf.write("\n---\n\n")
        
        for wid in range(34):
            cdata = CHAPTERS[wid]
            clean_title = f"{wid:02d}. {cdata['title']}"
            anchor = re.sub(r'[^a-zA-Z0-9\- ]', '', clean_title).strip().lower().replace(' ', '-')
            
            grounded, literature, code_math = extract_lineage(wid)
            skeleton, assumptions, operational, change_test = extract_b_specs(wid)
            
            mf.write(f"# <a id=\"{anchor}\"></a>{wid:02d}. {cdata['title']}\n")
            mf.write(f"### *{cdata['subtitle']}*\n\n")
            mf.write(f"[🔝 Back to Table of Contents](#-table-of-contents) | [📚 Jump to Glossary](#34-master-glossary--concept-index)\n\n")
            mf.write("---\n\n")
            
            mf.write(f"## I. {cdata['beat1_title']}\n\n")
            mf.write(cdata['scene'].strip() + "\n\n")
            mf.write("---\n\n")
            
            mf.write(f"## II. {cdata['beat2_title']}\n\n")
            mf.write(cdata['mechanism'].strip() + "\n\n")
            mf.write("---\n\n")
            
            mf.write(f"## III. {cdata['beat3_title']}\n\n")
            mf.write(cdata['parasite'].strip() + "\n\n")
            mf.write("---\n\n")
            
            mf.write(f"## IV. {cdata['beat4_title']}\n\n")
            mf.write(cdata['modern'].strip() + "\n\n")
            mf.write("---\n\n")
            
            mf.write(f"## V. {cdata['beat5_title']}\n\n")
            mf.write(f"> **{cdata['invariant']}**\n\n")
            mf.write("---\n\n")
            
            mf.write("## VI. Theoretical Lineage & Thinkers\n\n")
            if grounded:
                mf.write(f"### 🏺 Lived Historical & Material Ancestry\n\n{grounded}\n\n")
            if literature:
                mf.write(f"### 📚 Philosophical & Sociological Thinkers\n\n{literature}\n\n")
            if code_math:
                mf.write(f"### ⚙️ Computational & Cybernetic Lineage\n\n{code_math}\n\n")
            mf.write("---\n\n")
            
            mf.write("## VII. Formal Operational Architecture & Invariants\n\n")
            mf.write("```yaml\n# FORMAL SPECIFICATION & STATE TRANSITIONS\n")
            if skeleton:
                mf.write(f"Theory_Skeleton:\n  {skeleton.replace(chr(10), chr(10)+'  ')}\n\n")
            if operational:
                mf.write(f"Operational_Execution_Flow:\n  {operational.replace(chr(10), chr(10)+'  ')}\n\n")
            if change_test:
                mf.write(f"Invariant_Validation_Test:\n  {change_test.replace(chr(10), chr(10)+'  ')}\n")
            mf.write("```\n\n")
            mf.write("---\n\n")
            
            mf.write("### 🔑 Key Concepts in This Chapter\n\n")
            for term in cdata['terms']:
                term_slug = re.sub(r'[^a-zA-Z0-9]+', '-', term).strip('-').lower()
                mf.write(f"- [**{term}**](#{term_slug})\n")
            mf.write("\n\n---\n\n")
            
        # Append Master Glossary
        mf.write("# 34. MASTER GLOSSARY & CONCEPT INDEX\n\n")
        mf.write("> An alphabetical index of all core philosophical, cybernetic, sociological, and computational terms with direct chapter anchors.\n\n---\n\n")
        
        for term in sorted(all_terms.keys()):
            tdata = all_terms[term]
            term_slug = re.sub(r'[^a-zA-Z0-9]+', '-', term).strip('-').lower()
            mf.write(f"### <a id=\"{term_slug}\"></a>`{term}`\n\n")
            mf.write(f"**Definition:** {tdata['definition']}\n\n")
            mf.write("**Referenced In:**\n")
            for wid, title, _, anchor in tdata['chapters']:
                mf.write(f"- [World {wid:02d}: {title}]({anchor})\n")
            mf.write("\n---\n\n")

if __name__ == "__main__":
    build_master_edition()
