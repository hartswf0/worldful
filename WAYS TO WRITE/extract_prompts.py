import re
import os

source_file = "/Users/gaia/WORLDFUL/WAYS TO WRITE/a.md"
dest_file = "/Users/gaia/WORLDFUL/WAYS TO WRITE/system_instructions.md"

with open(source_file, "r", encoding="utf-8") as f:
    text = f.read()

lines = text.split("\n")
you_are_indices = [i for i, l in enumerate(lines) if re.match(r'^\s*(?:#+\s*)?[\"\'\`]*You are\b', l, re.I)]

def clean_title(t):
    t = re.sub(r'^[#\s*]+', '', t).strip()
    t = re.sub(r'[\*\_]+', '', t).strip()
    t = re.sub(r'^Markdown\s*', '', t).strip()
    return t

prompts_data = []

for idx_num, start_idx in enumerate(you_are_indices):
    next_start = you_are_indices[idx_num + 1] if idx_num + 1 < len(you_are_indices) else len(lines)
    prev_end = you_are_indices[idx_num - 1] if idx_num > 0 else 0
    lookback = max(prev_end, start_idx - 40)
    
    # 1. Title
    title = ""
    title_idx = -1
    for k in range(start_idx - 1, lookback - 1, -1):
        l = lines[k].strip()
        if l.startswith("Use this prompt") or l.startswith("Use this engine"):
            continue
        if re.search(r'(?:Prompt|Engine|Protocol|System|Tradecraft|Framework|Operational System|Masonry|Purge|Alignment|Audit|Clincher|Roadmap)\b', l, re.I) and not l.startswith("[Phase") and not l.startswith("Markdown") and len(l) < 130 and not "\t" in l:
            title = l
            title_idx = k
            break
        elif l.startswith("The ") and ("Prompt" in l or "Engine" in l or "Framework" in l):
            title = l
            title_idx = k
            break
            
    if not title:
        for k in range(start_idx - 1, max(lookback, start_idx - 8), -1):
            l = lines[k].strip()
            if l and l != "Markdown" and not l.startswith("#") and not l.startswith("[Phase") and not "\t" in l:
                title = l
                title_idx = k
                break
                
    title = clean_title(title)
    if not title or "Give a prompt" in title:
        m = re.match(r'You are (?:an?|the)?\s*([^,\.]+)', lines[start_idx].strip(), re.I)
        if m:
            title = m.group(1).strip().title() + " System Prompt"
        else:
            title = f"System Prompt {idx_num + 1}"

    # 2. Phases / Protocol
    phases = []
    phase_start = -1
    for k in range(lookback, start_idx):
        l = lines[k].strip()
        if re.match(r'^\[Phase \d+:', l):
            if phase_start == -1:
                phase_start = k
            phases.append(l)
        elif phase_start != -1 and l and not l == "Markdown" and k < start_idx:
            phases.append(l)
            
    # 3. Intro / Usage
    intro_lines = []
    if title_idx != -1:
        for k in range(title_idx + 1, start_idx):
            l = lines[k].strip()
            if l and l != "Markdown" and not re.match(r'^\[Phase \d+:', l) and (phase_start == -1 or k < phase_start):
                intro_lines.append(l)
                
    # 4. Prompt Body
    end_idx = None
    for j in range(start_idx, next_start):
        l_str = lines[j].strip()
        if re.match(r'^\[INSERT\b', l_str, re.I) or re.match(r'^Demonstration:', l_str) or re.match(r'^Example Input:', l_str) or re.match(r'^Raw Input:', l_str) or re.match(r'^Example Application:', l_str) or re.match(r'^### Demonstration\b', l_str) or re.match(r'^#### Demonstration\b', l_str):
            end_idx = j
            break
        elif l_str == "---" and j > start_idx + 8:
            end_idx = j
            break
    if end_idx is None:
        end_idx = next_start
        
    prompt_body = "\n".join(lines[start_idx:end_idx]).strip()
    
    prompts_data.append({
        "num": idx_num + 1,
        "title": title,
        "start_line": start_idx + 1,
        "end_line": end_idx + 1,
        "intro": "\n".join(intro_lines).strip(),
        "protocol": "\n".join(phases).strip(),
        "prompt_body": prompt_body
    })

# Foundational beginnings (lines 80-123 and 124-183)
beginning_instructions_1 = "\n".join(lines[79:123]).strip()
beginning_instructions_2 = "\n".join(lines[123:183]).strip()

with open(dest_file, "w", encoding="utf-8") as out:
    out.write("# SYSTEM INSTRUCTIONS & OPERATIONAL ENGINES CATALOG\n\n")
    out.write("> **Extracted from [`WAYS TO WRITE/a.md`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/a.md)**  \n")
    out.write("> Complete compilation of all 2 foundational rhetorical protocols and 136 standalone system instruction prompts extracted cleanly from the model completions in `a.md`, stripping out sample completions and demonstrative examples while preserving the operational tradecraft protocols, roles, directives, and output specifications.\n\n")
    out.write("---\n\n")
    
    out.write("## TABLE OF CONTENTS\n\n")
    out.write("### Part I: Foundational Frameworks & Boundary Protocols (Document Origin)\n")
    out.write("- [Foundational Protocol 1: The 5-Point Frame Breakdown & Boundary Enforcement Protocol](#foundational-protocol-1)\n")
    out.write("- [Foundational Protocol 2: Critical Sociolinguistic Counter-Maneuvers & Theoretical Lenses (Goffman, Grice, Garfinkel, Bourdieu)](#foundational-protocol-2)\n\n")
    
    out.write("### Part II: The 136 Extracted System Instruction Prompts\n\n")
    for p in prompts_data:
        anchor = f"prompt-{p['num']:03d}"
        out.write(f"- [{p['num']:03d}. {p['title']}](#{anchor})\n")
    out.write("\n---\n\n")
    
    # Part I
    out.write("## PART I: FOUNDATIONAL FRAMEWORKS & BOUNDARY PROTOCOLS\n\n")
    out.write("<a id='foundational-protocol-1'></a>\n\n")
    out.write("### Foundational Protocol 1: The 5-Point Frame Breakdown & Boundary Enforcement Protocol\n\n")
    out.write("*(Origin: [`WAYS TO WRITE/a.md:L80-L123`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/a.md#L80-L123))*\n\n")
    out.write(beginning_instructions_1 + "\n\n")
    out.write("---\n\n")
    
    out.write("<a id='foundational-protocol-2'></a>\n\n")
    out.write("### Foundational Protocol 2: Critical Sociolinguistic Counter-Maneuvers & Theoretical Lenses\n\n")
    out.write("*(Origin: [`WAYS TO WRITE/a.md:L124-L183`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/a.md#L124-L183))*\n\n")
    out.write(beginning_instructions_2 + "\n\n")
    out.write("---\n\n")
    
    # Part II
    out.write("## PART II: THE 136 EXTRACTED SYSTEM INSTRUCTION PROMPTS\n\n")
    for p in prompts_data:
        anchor = f"prompt-{p['num']:03d}"
        out.write(f"<a id='{anchor}'></a>\n\n")
        out.write(f"### {p['num']:03d}. {p['title']}\n\n")
        out.write(f"**Source Line:** [`WAYS TO WRITE/a.md:L{p['start_line']}-L{p['end_line']}`](file:///Users/gaia/WORLDFUL/WAYS%20TO%20WRITE/a.md#L{p['start_line']}-L{p['end_line']})  \n\n")
        
        if p["intro"]:
            out.write(f"**Operational Scope:**  \n{p['intro']}\n\n")
            
        if p["protocol"]:
            out.write(f"**Operational Tradecraft Protocol:**  \n```text\n{p['protocol']}\n```\n\n")
            
        out.write("**System Instruction Prompt:**\n\n")
        out.write("```markdown\n")
        out.write(p["prompt_body"] + "\n")
        out.write("```\n\n")
        out.write("---\n\n")

print(f"Successfully processed {len(prompts_data)} prompts into {dest_file}")
