import os
import re

source_file = "/Users/gaia/WORLDFUL/WAYS TO WRITE/builders-games.md"
output_dir = "/Users/gaia/WORLDFUL/WAYS TO WRITE/language_games"

os.makedirs(output_dir, exist_ok=True)

with open(source_file, "r", encoding="utf-8") as f:
    text = f.read()

lines = text.split("\n")

games = [
    ("01", "instruction", "INSTRUCTION"),
    ("02", "score", "SCORE"),
    ("03", "program", "PROGRAM"),
    ("04", "plan", "PLAN"),
    ("05", "query", "QUERY"),
    ("06", "probe", "PROBE"),
    ("07", "gesture", "GESTURE"),
    ("08", "commission", "COMMISSION"),
    ("09", "conversation", "CONVERSATION"),
    ("10", "edit", "EDIT"),
    ("11", "constraint", "CONSTRAINT"),
    ("12", "performance", "PERFORMANCE"),
]

# 1. Generate 00_overview_and_switchyard.md
overview_sections = [
    ("# The Polyphony of the Prompt: Ideal Types, Interactional Drift, and Ontological Tensions in Generative Systems", lines[0:14]),
    ("### Comparative Matrix of the Twelve Ideal Types", lines[134:141]),
    ("# The Switchyard & Interactional Drift", lines[660:775]),
    ("# Lineage Synthesis & The Lineage Graph", lines[1633:1756]),
    ("# Deck-Level Literature Thesis", lines[4428:4472]),
    ("# The Program Above the Twelve Programs", lines[6062:6210]),
    ("# Deck-Level Residual Human Theory", lines[7158:7320]),
    ("# The Fun Theory of the Whole Deck", lines[8372:8516]),
]

overview_content = "# THE LANGUAGE GAMES OF GENERATIVE SYSTEMS: OVERVIEW & SWITCHYARD\n\n"
overview_content += "> **Master Theoretical Framework from [`builders-games.md`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/builders-games.md)**  \n"
overview_content += "> Synthesis of the 12 Ideal Types, Ancestral Lineages, Computational Programs, Residual Human Element, and the Interactional Switchyard.\n\n---\n\n"

for title, sec_lines in overview_sections:
    overview_content += "\n".join(sec_lines).strip() + "\n\n---\n\n"

with open(os.path.join(output_dir, "00_overview_and_switchyard.md"), "w", encoding="utf-8") as f:
    f.write(overview_content)

print("Created 00_overview_and_switchyard.md")

# 2. Extract 12 individual game files
for num, slug, name in games:
    # Layer 1: Empirical Card
    l1_start = next((i for i, l in enumerate(lines) if re.search(r'###\s*​?Card\s+' + str(int(num)) + r':', l, re.I)), -1)
    l1_end = next((i for i in range(l1_start + 1, len(lines)) if re.match(r'###\s*​?Card\s+\d+:', lines[i]) or '### ​Comparative Matrix' in lines[i]), -1)
    
    # Layer 2: Core Game Specification
    l2_start = next((i for i, l in enumerate(lines[:700]) if re.search(r'(?:##|#)\s*' + num + r'\s*[—–-]\s*' + name, l, re.I)), -1)
    next_num = f"{int(num)+1:02d}"
    l2_end = next((i for i in range(l2_start + 1, 700) if re.search(r'(?:##|#)\s*' + next_num + r'\s*[—–-]', lines[i]) or '# THE IMPORTANT PART' in lines[i]), -1)
    
    # Layer 3: Lineage
    l3_start = next((i for i, l in enumerate(lines[700:1700], 700) if re.search(r'#\s*' + num + r'\s*[—–-]\s*' + name, l, re.I)), -1)
    l3_end = next((i for i in range(l3_start + 1, 1700) if re.search(r'#\s*' + next_num + r'\s*[—–-]', lines[i]) or '# THE LINEAGE GRAPH' in lines[i]), -1)
    
    # Layer 4: Formal Echo
    l4_start = next((i for i, l in enumerate(lines[1700:4450], 1700) if re.search(r'#\s*' + num + r'\s*[—–-]\s*' + name, l, re.I)), -1)
    l4_end = next((i for i in range(l4_start + 1, 4450) if re.search(r'#\s*' + next_num + r'\s*[—–-]', lines[i]) or '# The deck-level literature' in lines[i]), -1)
    
    # Layer 5: Theory of the Program
    l5_start = next((i for i, l in enumerate(lines[4450:6100], 4450) if re.search(r'#\s*' + num + r'\s*[—–-]\s*' + name, l, re.I)), -1)
    l5_end = next((i for i in range(l5_start + 1, 6100) if re.search(r'#\s*' + next_num + r'\s*[—–-]', lines[i]) or '# THE PROGRAM ABOVE' in lines[i]), -1)
    
    # Layer 6: Residual Human Theory
    l6_start = next((i for i, l in enumerate(lines[6200:7200], 6200) if re.search(r'#\s*' + num + r'\s*[—–-]\s*' + name, l, re.I)), -1)
    l6_end = next((i for i in range(l6_start + 1, 7200) if re.search(r'#\s*' + next_num + r'\s*[—–-]', lines[i]) or '# THE DECK-LEVEL THEORY' in lines[i]), -1)
    
    # Layer 7: Fun Theory
    if num == '01':
        l7_start = next((i for i, l in enumerate(lines[7300:7450], 7300) if '01 — INSTRUCTION' in l), -1)
        l7_end = next((i for i in range(l7_start + 1, 7450) if 'THE FU' in lines[i] or '# 02' in lines[i]), -1)
    elif num == '02':
        l7_start = next((i for i, l in enumerate(lines[7390:7500], 7390) if 'THE FU' in l or '02' in l), -1)
        l7_end = next((i for i in range(l7_start + 1, 7500) if '# 03' in lines[i]), -1)
    else:
        l7_start = next((i for i, l in enumerate(lines[7450:8400], 7450) if re.search(r'#\s*' + num + r'\s*[—–-]\s*' + name, l, re.I)), -1)
        if num == '12':
            l7_end = next((i for i in range(l7_start + 1, len(lines)) if '# THE FUN THEORY OF THE WHOLE' in lines[i]), -1)
        else:
            l7_end = next((i for i in range(l7_start + 1, min(len(lines), l7_start + 300)) if re.search(r'#\s*' + next_num + r'\s*[—–-]', lines[i]) or '# THE FUN THEORY' in lines[i]), -1)

    card_text = "\n".join(lines[l1_start:l1_end]).strip()
    spec_text = "\n".join(lines[l2_start:l2_end]).strip()
    lineage_text = "\n".join(lines[l3_start:l3_end]).strip()
    formal_text = "\n".join(lines[l4_start:l4_end]).strip()
    program_text = "\n".join(lines[l5_start:l5_end]).strip()
    human_text = "\n".join(lines[l6_start:l6_end]).strip()
    fun_text = "\n".join(lines[l7_start:l7_end]).strip()

    file_content = f"# LANGUAGE GAME {num}: {name}\n\n"
    file_content += f"> **Origin:** Extracted from [`WAYS TO WRITE/builders-games.md`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/builders-games.md)  \n"
    file_content += f"> **Part of:** The Twelve Language Games of Generative Systems  \n\n"
    file_content += "---\n\n"
    
    file_content += "## SECTION 1: THE EMPIRICAL CARD (CASE STUDIES & EPISTEMIC TRADE-OFFS)\n\n"
    file_content += card_text + "\n\n---\n\n"
    
    file_content += "## SECTION 2: THE CORE GAME SPECIFICATION\n\n"
    file_content += spec_text + "\n\n---\n\n"
    
    file_content += "## SECTION 3: ANCESTRAL LINEAGE & MIGRATION MAP\n\n"
    file_content += lineage_text + "\n\n---\n\n"
    
    file_content += "## SECTION 4: THE FORMAL ECHO & LITERATURE GROUNDING\n\n"
    file_content += formal_text + "\n\n---\n\n"
    
    file_content += "## SECTION 5: THEORY OF THE PROGRAM & COMPUTATIONAL ONTOLOGY\n\n"
    file_content += program_text + "\n\n---\n\n"
    
    file_content += "## SECTION 6: RESIDUAL HUMAN THEORY (THE IRREDUCIBLE STAKES)\n\n"
    file_content += human_text + "\n\n---\n\n"
    
    file_content += "## SECTION 7: PLAY DYNAMICS, PUZZLE & FUN THEORY\n\n"
    file_content += fun_text + "\n\n"

    target_path = os.path.join(output_dir, f"{num}_{slug}.md")
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(file_content)
        
    print(f"Created {num}_{slug}.md ({len(file_content)} bytes)")

print("Successfully partitioned builders-games.md into 12 game files + overview!")
