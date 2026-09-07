import re
import json
import os

source_a = "/Users/gaia/WORLDFUL/WAYS TO WRITE/a.md"
dest_html = "/Users/gaia/WORLDFUL/WAYS TO WRITE/yellow_pages.html"
dest_root_html = "/Users/gaia/WORLDFUL/yellow_pages.html"

with open(source_a, "r", encoding="utf-8") as f:
    text = f.read()

lines = text.split("\n")
you_are_indices = [i for i, l in enumerate(lines) if re.match(r'^\s*(?:#+\s*)?[\"\'\`]*You are\b', l, re.I)]

def clean_title(t):
    t = re.sub(r'^[#\s*]+', '', t).strip()
    t = re.sub(r'[\*\_]+', '', t).strip()
    t = re.sub(r'^Markdown\s*', '', t).strip()
    return t

# Thinkers mapping
thinkers_rules = [
    ("Quentin Tarantino", [r"\bTarantino\b"]),
    ("Dolly Parton", [r"\bDolly\b", r"\bParton\b"]),
    ("Alex Lyon", [r"\bLyon\b", r"\bAlex Lyon\b"]),
    ("Joe Rogan", [r"\bRogan\b"]),
    ("Alan Monroe", [r"\bMonroe\b"]),
    ("Erving Goffman", [r"\bGoffman\b", r"\bFooting\b"]),
    ("Paul Grice", [r"\bGrice\b", r"\bMaxims\b"]),
    ("Harold Garfinkel", [r"\bGarfinkel\b", r"\bBreaching\b"]),
    ("Pierre Bourdieu", [r"\bBourdieu\b"]),
    ("Johari Window", [r"\bJohari\b"]),
    ("Charles Duhigg", [r"\bDuhigg\b"]),
    ("Colenso", [r"\bColenso\b"]),
    ("John Dufresne", [r"\bDufresne\b"]),
    ("Gattis", [r"\bGattis\b"]),
    ("Bolt", [r"\bBolt\b"]),
    ("John McPhee", [r"\bMcPhee\b", r"\bWood-Stacking\b"]),
    ("Russell Ackoff", [r"\bAckoff\b", r"\bDIKUW\b"]),
    ("Wendell Berry", [r"\bBerry\b", r"\bNative Hill\b", r"\bStanding by Words\b"]),
    ("Gregory Bateson", [r"\bBateson\b"]),
    ("Larry McEnerney", [r"\bMcEnerney\b"]),
    ("Swadia", [r"\bSwadia\b"]),
    ("Clifford Geertz", [r"\bGeertz\b", r"\bThick Description\b"]),
    ("André Leroi-Gourhan", [r"\bLeroi-Gourhan\b", r"\bChaîne Opératoire\b"]),
    ("Mirian", [r"\bMirian\b"]),
    ("Carl DiSalvo", [r"\bDiSalvo\b", r"\bAgonistic\b"]),
    ("Seymour Papert", [r"\bPapert\b", r"\bConstructionist\b"]),
    ("Peter Naur", [r"\bNaur\b", r"\bTheory-Building\b"]),
    ("Ian Bogost", [r"\bBogost\b", r"\bCarpentry\b"]),
    ("Steven Johnson", [r"\bJohnsonian\b", r"\bSteven Johnson\b"]),
    ("David Brooks", [r"\bBrooksian\b", r"\bDavid Brooks\b"]),
    ("Kevin Roose", [r"\bRoose\b"]),
    ("Homer", [r"\bHomeric\b", r"\bHomer\b"]),
    ("Niklas Luhmann", [r"\bLuhmann\b", r"\bZettelkasten\b", r"\bSlip-Box\b"]),
    ("Roland Barthes", [r"\bBarthes\b", r"\bSemioclasm\b", r"\bLexia\b"]),
    ("Watson Hartsoe", [r"\bHartsoe\b", r"\bTrain Yard\b", r"\bPOML\b"]),
    ("André Brock", [r"\bBrock\b", r"\bDistributed Blackness\b"]),
    ("Ian Bremmer", [r"\bBremmer\b"]),
    ("Malcolm Gladwell", [r"\bGladwell\b"]),
]

categories_rules = [
    ("Adversarial & Judo", [r"judo", r"clapback", r"tarantino", r"adversarial", r"counter-hegemonic", r"bad-faith", r"anti-interruption", r"forensic", r"condescension", r"therapy", r"deconstruction"]),
    ("Academic & Proposals", [r"proposal", r"dissertation", r"defense", r"monroe", r"psb", r"grant", r"academic", r"mcenerney", r"rehearsal", r"thesis", r"disciplinary"]),
    ("Presentation & Keynote", [r"keynote", r"speech", r"slide", r"supercommunicator", r"hook", r"clincher", r"pitch", r"spoken", r"vocal", r"funnel", r"acoustic", r"audience", r"ted"]),
    ("Narrative & Literature", [r"narrative", r"dufresne", r"gattis", r"trouble", r"story", r"mcphee", r"essayist", r"homer", r"brooks", r"johnson", r"poetic", r"fiction"]),
    ("Systems & Cybernetics", [r"cybernetic", r"luhmann", r"ackoff", r"bateson", r"systems", r"platform", r"zettelkasten", r"slip-box", r"complexity", r"second-order"]),
    ("Field & Material Tradecraft", [r"leroi-gourhan", r"archaeol", r"material", r"chaîne", r"carpentry", r"bogost", r"papert", r"naur", r"berry", r"agrarian"]),
    ("Spatial & Interface", [r"spatial", r"interface", r"hartsoe", r"terminal", r"poml", r"kinetic", r"visual", r"puppetry", r"desire-line"]),
]

def determine_thinker(text_blob):
    for name, pats in thinkers_rules:
        for pat in pats:
            if re.search(pat, text_blob, re.I):
                return name
    return "Strategic Rhetorician"

def determine_category(text_blob):
    for cat_name, pats in categories_rules:
        for pat in pats:
            if re.search(pat, text_blob, re.I):
                return cat_name
    return "Discourse Architecture"

prompts_list = []

# Add Foundational 1 & 2
f1_body = "\n".join(lines[79:123]).strip()
f2_body = "\n".join(lines[123:183]).strip()

prompts_list.append({
    "id": "F1",
    "num": "F1",
    "title": "The 5-Point Frame Breakdown & Boundary Protocol",
    "thinker": "Critical Discourse Group",
    "category": "Adversarial & Judo",
    "source_line": "a.md:L80-L123",
    "scope": "Foundational protocol for shutting down bad-faith interrogation, patronizing advice, or trap questioning with radical poise and zero apologetic padding.",
    "protocol": "[1. Call Out Frame] Don't answer trap; expose premise.\n[2. Return Accountability] Strip away false consensus / 'people say'.\n[3. Plain Facts] Deliver blunt truth with zero inflection.\n[4. Name Shift] Pivot back to agreed purpose.\n[5. Clean Exit] Revoke participation when boundaries are ignored.",
    "prompt": f1_body,
    "role": "Foundational Protocol: 5-Point Frame Breakdown & Boundary Enforcement",
    "tags": ["clapback", "boundaries", "bad-faith", "interrogation", "tarantino", "crowe", "lohan"]
})

prompts_list.append({
    "id": "F2",
    "num": "F2",
    "title": "Sociolinguistic Counter-Maneuver & Resistance Framework",
    "thinker": "Goffman, Grice, Garfinkel & Bourdieu",
    "category": "Adversarial & Judo",
    "source_line": "a.md:L124-L183",
    "scope": "Theoretical framework for diagnosing bad-faith structural traps (epistemic asymmetry, loaded presuppositions, double binds, scope creep) and deploying 4 counter-maneuvers.",
    "protocol": "[Mechanism 1: Metadiscursive Reframing] Critique the perlocutionary intent.\n[Mechanism 2: Stripping the Proxy Shield] Collapse distance between animator and principal.\n[Mechanism 3: Lexical Economy] Truncate turn-taking currency.\n[Mechanism 4: Interactional Revocation] Expose limits of institutional coercion.",
    "prompt": f2_body,
    "role": "Foundational Framework: Sociolinguistic Power Dynamics & Strategic Breaching",
    "tags": ["goffman", "footing", "grice", "garfinkel", "bourdieu", "symbolic violence", "defense"]
})

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
    
    combined_meta = f"{title} {' '.join(intro_lines)} {' '.join(phases)} {lines[start_idx]}"
    thinker = determine_thinker(combined_meta)
    cat = determine_category(combined_meta)
    
    # Extract tags
    words = re.findall(r'[A-Za-z]{4,}', f"{title} {thinker} {cat}")
    tags = list(set([w.lower() for w in words if w.lower() not in ["prompt", "engine", "operational", "system", "elite", "expert", "specializing", "take"]]))[:6]

    prompts_list.append({
        "id": f"P{idx_num + 1}",
        "num": f"{idx_num + 1:03d}",
        "title": title,
        "thinker": thinker,
        "category": cat,
        "source_line": f"a.md:L{start_idx + 1}-L{end_idx + 1}",
        "scope": "\n".join(intro_lines).strip(),
        "protocol": "\n".join(phases).strip(),
        "prompt": prompt_body,
        "role": lines[start_idx].strip(),
        "tags": tags
    })

print(f"Total directory entries built: {len(prompts_list)}")

# Now generate the HTML
json_data = json.dumps(prompts_list, indent=None)

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>THE YELLOW PROMPTS — Official Classified System Instructions Directory</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:ital,wght@0,400;0,600;0,700;1,400&family=Public+Sans:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
  
  <style>
    :root {{
      --yp-yellow: #fde84d;
      --yp-yellow-deep: #eed236;
      --yp-yellow-light: #fff280;
      --yp-cream: #fff9d6;
      --yp-black: #12110e;
      --yp-red: #c91818;
      --yp-red-deep: #9e0e0e;
      --yp-gray: #4a473f;
      --yp-border: #12110e;
      --yp-paper-shadow: rgba(18, 17, 14, 0.15);
      
      --font-display: 'Anton', Impact, 'Arial Narrow', sans-serif;
      --font-body: 'Public Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --font-mono: 'IBM Plex Mono', Menlo, Monaco, Consolas, monospace;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }}

    body {{
      background-color: var(--yp-yellow);
      background-image: 
        radial-gradient(rgba(18, 17, 14, 0.04) 1px, transparent 0),
        linear-gradient(to bottom, #fcee6d 0%, var(--yp-yellow) 100%);
      background-size: 8px 8px, 100% 100%;
      color: var(--yp-black);
      font-family: var(--font-body);
      line-height: 1.4;
      min-height: 100vh;
      overflow-x: hidden;
      padding-bottom: 90px;
    }}

    /* Vintage Newsprint Halftone Texture */
    .newsprint-overlay {{
      pointer-events: none;
      position: fixed;
      inset: 0;
      opacity: 0.25;
      background-image: radial-gradient(#12110e 0.75px, transparent 0.75px);
      background-size: 4px 4px;
      z-index: 999;
    }}

    /* TOP RUNNING GUIDE HEADER */
    .guide-header {{
      background: var(--yp-black);
      color: var(--yp-yellow);
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      padding: 6px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--yp-black);
      position: sticky;
      top: 0;
      z-index: 100;
    }}

    .guide-header .brand {{
      display: flex;
      align-items: center;
      gap: 6px;
    }}

    .guide-header .brand span.icon {{
      font-size: 14px;
    }}

    /* MAIN BANNER / MASTHEAD */
    .masthead {{
      padding: 14px 16px 10px;
      border-bottom: 3px double var(--yp-black);
      background: var(--yp-yellow);
    }}

    .masthead-top {{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid var(--yp-black);
      padding-bottom: 4px;
      margin-bottom: 6px;
    }}

    .masthead-vol {{
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }}

    .masthead-phone {{
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--yp-red);
      display: flex;
      align-items: center;
      gap: 4px;
    }}

    h1.title {{
      font-family: var(--font-display);
      font-size: clamp(34px, 9vw, 56px);
      line-height: 0.92;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: var(--yp-black);
      text-shadow: 2px 2px 0px var(--yp-yellow-light);
      margin: 4px 0 6px;
    }}

    .subtitle {{
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--yp-gray);
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      justify-content: space-between;
    }}

    .banner-slogan {{
      background: var(--yp-red);
      color: #fff;
      font-size: 10px;
      font-weight: 900;
      padding: 2px 6px;
      border-radius: 2px;
      letter-spacing: 0.5px;
    }}

    /* SEARCH & CONTROL SECTION */
    .controls-panel {{
      padding: 12px 16px 8px;
      background: var(--yp-cream);
      border-bottom: 2px solid var(--yp-black);
      box-shadow: 0 3px 6px var(--yp-paper-shadow);
      position: sticky;
      top: 31px;
      z-index: 90;
    }}

    .search-box-wrapper {{
      position: relative;
      margin-bottom: 10px;
    }}

    .search-icon {{
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
      color: var(--yp-black);
      pointer-events: none;
    }}

    input.search-input {{
      width: 100%;
      height: 46px;
      padding: 8px 40px 8px 38px;
      font-family: var(--font-body);
      font-size: 15px;
      font-weight: 700;
      background: #fff;
      color: var(--yp-black);
      border: 2px solid var(--yp-black);
      border-radius: 4px;
      box-shadow: 3px 3px 0px var(--yp-black);
      outline: none;
      transition: all 0.15s ease;
    }}

    input.search-input:focus {{
      box-shadow: 4px 4px 0px var(--yp-red);
      border-color: var(--yp-black);
    }}

    .search-clear {{
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--yp-black);
      color: #fff;
      border: none;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-size: 13px;
      font-weight: 900;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }}

    .category-pills {{
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 4px;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }}
    .category-pills::-webkit-scrollbar {{ display: none; }}

    button.pill {{
      flex-shrink: 0;
      background: #fff;
      color: var(--yp-black);
      border: 1.5px solid var(--yp-black);
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      cursor: pointer;
      box-shadow: 1.5px 1.5px 0px var(--yp-black);
      transition: all 0.1s ease;
    }}

    button.pill:active {{
      transform: translate(1px, 1px);
      box-shadow: 0.5px 0.5px 0px var(--yp-black);
    }}

    button.pill.active {{
      background: var(--yp-black);
      color: var(--yp-yellow);
      border-color: var(--yp-black);
    }}

    /* DIRECTORY METRICS BAR */
    .status-bar {{
      padding: 6px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      background: var(--yp-yellow-deep);
      border-bottom: 1.5px solid var(--yp-black);
    }}

    .view-toggle {{
      display: flex;
      gap: 4px;
    }}

    .view-toggle button {{
      background: #fff;
      border: 1px solid var(--yp-black);
      padding: 3px 8px;
      font-size: 10px;
      font-weight: 800;
      border-radius: 2px;
      cursor: pointer;
    }}

    .view-toggle button.active {{
      background: var(--yp-black);
      color: var(--yp-yellow);
    }}

    /* LISTINGS CONTAINER */
    .listings-container {{
      max-width: 900px;
      margin: 0 auto;
      padding: 10px 12px;
    }}

    /* COMPACT DIRECTORY VIEW (DEFAULT FOR MOBILE) */
    .directory-mode .listing-row {{
      background: #fffdf0;
      border: 1.5px solid var(--yp-black);
      border-radius: 3px;
      padding: 10px 12px;
      margin-bottom: 8px;
      box-shadow: 2px 2px 0px var(--yp-black);
      transition: transform 0.1s, box-shadow 0.1s;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }}

    .directory-mode .listing-row:active {{
      transform: translate(1px, 1px);
      box-shadow: 1px 1px 0px var(--yp-black);
    }}

    .listing-meta-top {{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}

    .listing-badge-group {{
      display: flex;
      align-items: center;
      gap: 6px;
    }}

    .badge-num {{
      font-family: var(--font-mono);
      background: var(--yp-black);
      color: var(--yp-yellow);
      font-size: 11px;
      font-weight: 900;
      padding: 2px 6px;
      border-radius: 2px;
    }}

    .badge-cat {{
      font-size: 9px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 2px 6px;
      background: var(--yp-yellow);
      border: 1px solid var(--yp-black);
      border-radius: 2px;
    }}

    .badge-thinker {{
      font-size: 10px;
      font-weight: 800;
      color: var(--yp-red-deep);
      display: flex;
      align-items: center;
      gap: 3px;
    }}

    .listing-title {{
      font-family: var(--font-body);
      font-size: 15px;
      font-weight: 900;
      line-height: 1.25;
      color: var(--yp-black);
      cursor: pointer;
    }}

    .listing-role-snippet {{
      font-family: var(--font-mono);
      font-size: 11px;
      color: var(--yp-gray);
      background: rgba(0,0,0,0.03);
      padding: 4px 6px;
      border-left: 2px solid var(--yp-black);
      border-radius: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }}

    .listing-actions {{
      display: flex;
      gap: 6px;
      margin-top: 4px;
    }}

    button.btn-copy-prompt {{
      flex: 1;
      height: 38px;
      background: var(--yp-yellow);
      color: var(--yp-black);
      border: 1.5px solid var(--yp-black);
      border-radius: 3px;
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      box-shadow: 2px 2px 0px var(--yp-black);
      transition: all 0.1s;
    }}

    button.btn-copy-prompt:active {{
      transform: translate(1px, 1px);
      box-shadow: 1px 1px 0px var(--yp-black);
    }}

    button.btn-copy-prompt.copied {{
      background: var(--yp-black);
      color: var(--yp-yellow);
    }}

    button.btn-view-card {{
      background: #fff;
      color: var(--yp-black);
      border: 1.5px solid var(--yp-black);
      border-radius: 3px;
      padding: 0 12px;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      box-shadow: 2px 2px 0px var(--yp-black);
    }}

    /* EXPANDED DISPLAY ADS VIEW */
    .cards-mode .listing-row {{
      background: #fffdf0;
      border: 2.5px solid var(--yp-black);
      border-radius: 4px;
      padding: 14px 14px 12px;
      margin-bottom: 16px;
      box-shadow: 4px 4px 0px var(--yp-black);
    }}

    .cards-mode .card-protocol-box {{
      background: var(--yp-cream);
      border: 1.5px dashed var(--yp-black);
      padding: 8px 10px;
      margin: 8px 0;
      font-family: var(--font-mono);
      font-size: 11px;
      line-height: 1.4;
      border-radius: 2px;
    }}

    .cards-mode .card-prompt-preview {{
      background: #fff;
      border: 1px solid var(--yp-black);
      padding: 8px 10px;
      font-family: var(--font-mono);
      font-size: 11px;
      max-height: 140px;
      overflow-y: auto;
      white-space: pre-wrap;
      border-radius: 2px;
      margin-bottom: 8px;
    }}

    /* FULL READING MODAL / SHEET (MOBILE FIRST) */
    .modal-backdrop {{
      position: fixed;
      inset: 0;
      background: rgba(18, 17, 14, 0.7);
      backdrop-filter: blur(3px);
      z-index: 1000;
      display: none;
      align-items: flex-end;
      justify-content: center;
    }}

    .modal-backdrop.open {{
      display: flex;
    }}

    .reader-sheet {{
      background: var(--yp-cream);
      width: 100%;
      max-width: 820px;
      max-height: 92vh;
      border: 3px solid var(--yp-black);
      border-bottom: none;
      border-radius: 12px 12px 0 0;
      display: flex;
      flex-direction: column;
      box-shadow: 0 -8px 24px rgba(0,0,0,0.3);
      animation: slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }}

    @keyframes slideUp {{
      from {{ transform: translateY(100%); }}
      to {{ transform: translateY(0); }}
    }}

    .sheet-handle-bar {{
      width: 100%;
      padding: 8px 0 4px;
      display: flex;
      justify-content: center;
      cursor: grab;
    }}

    .sheet-handle {{
      width: 44px;
      height: 5px;
      background: var(--yp-black);
      border-radius: 3px;
      opacity: 0.3;
    }}

    .sheet-header {{
      padding: 8px 16px 10px;
      border-bottom: 2px solid var(--yp-black);
      background: var(--yp-yellow);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 10px;
    }}

    .sheet-header-info h2 {{
      font-family: var(--font-display);
      font-size: 20px;
      line-height: 1.15;
      text-transform: uppercase;
      margin-top: 2px;
    }}

    .sheet-header-badges {{
      display: flex;
      gap: 6px;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 800;
    }}

    .btn-close-sheet {{
      background: var(--yp-black);
      color: #fff;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      font-size: 16px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
    }}

    .sheet-content {{
      padding: 14px 16px 80px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      font-size: 14px;
    }}

    .sheet-section-title {{
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 900;
      letter-spacing: 1px;
      text-transform: uppercase;
      background: var(--yp-black);
      color: var(--yp-yellow);
      display: inline-block;
      padding: 2px 6px;
      margin: 12px 0 6px;
      border-radius: 2px;
    }}

    .sheet-protocol-card {{
      background: #fff;
      border: 1.5px solid var(--yp-black);
      padding: 10px 12px;
      border-radius: 3px;
      font-family: var(--font-mono);
      font-size: 12px;
      white-space: pre-wrap;
      line-height: 1.45;
      box-shadow: 2px 2px 0px var(--yp-black);
    }}

    .sheet-prompt-box {{
      background: #fff;
      border: 2px solid var(--yp-black);
      border-radius: 4px;
      padding: 12px 14px;
      font-family: var(--font-mono);
      font-size: 12.5px;
      line-height: 1.5;
      white-space: pre-wrap;
      box-shadow: 3px 3px 0px var(--yp-black);
    }}

    .sheet-footer-actions {{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--yp-yellow);
      border-top: 2px solid var(--yp-black);
      padding: 10px 16px;
      display: flex;
      gap: 10px;
      box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
    }}

    .btn-sheet-copy {{
      flex: 2;
      height: 44px;
      background: var(--yp-red);
      color: #fff;
      border: 2px solid var(--yp-black);
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 900;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 3px 3px 0px var(--yp-black);
    }}

    .btn-sheet-copy.copied {{
      background: var(--yp-black);
      color: var(--yp-yellow);
    }}

    .btn-sheet-nav {{
      flex: 1;
      height: 44px;
      background: #fff;
      border: 2px solid var(--yp-black);
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 2px 2px 0px var(--yp-black);
    }}

    /* TOAST NOTIFICATION */
    .toast-pill {{
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: var(--yp-black);
      color: var(--yp-yellow);
      border: 2px solid var(--yp-yellow);
      font-family: var(--font-mono);
      font-size: 12px;
      font-weight: 900;
      padding: 10px 18px;
      border-radius: 30px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.4);
      z-index: 2000;
      opacity: 0;
      transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      pointer-events: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }}

    .toast-pill.show {{
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }}

    /* EMPTY STATE */
    .empty-state {{
      text-align: center;
      padding: 40px 16px;
      background: #fff;
      border: 2px dashed var(--yp-black);
      border-radius: 4px;
      margin: 20px 0;
    }}
    .empty-state h3 {{
      font-family: var(--font-display);
      font-size: 24px;
      margin-bottom: 6px;
    }}

    /* FLOATING BOTTOM BAR / OPERATOR HOTLINE */
    .floating-bar {{
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--yp-black);
      color: var(--yp-yellow);
      padding: 6px 12px;
      border-top: 2px solid var(--yp-yellow);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--font-mono);
      font-size: 11px;
      z-index: 80;
    }}

    .floating-bar a {{
      color: var(--yp-yellow);
      text-decoration: none;
      font-weight: 800;
      border-bottom: 1px dashed var(--yp-yellow);
    }}
  </style>
</head>
<body>

  <div class="newsprint-overlay"></div>

  <!-- GUIDE HEADER -->
  <div class="guide-header">
    <div class="brand">
      <a href="index.html" style="color:var(--yp-yellow); text-decoration:none; font-weight:700; border-right:1px solid rgba(253,232,77,0.4); padding-right:10px; margin-right:6px;" title="Return to WORLDFUL Main Atlas">&larr; WORLDFUL ATLAS</a>
      <a href="games_yellow_pages.html" style="color:var(--yp-yellow); text-decoration:none; font-weight:700; border-right:1px solid rgba(253,232,77,0.4); padding-right:10px; margin-right:6px;" title="Open 12 Language Games Directory">12 LANGUAGE GAMES &nearr;</a>
      <span class="icon">[ TEL ]</span>
      <span>YELLOW PAGES PROMPT DIRECTORY</span>
    </div>
    <div id="guideWord">001. ADVERSARIAL — 136. HARTSOE</div>
  </div>

  <!-- MASTHEAD -->
  <header class="masthead">
    <div class="masthead-top">
      <div class="masthead-vol">VOL. I • CLASSIFIED SYSTEM INSTRUCTIONS</div>
      <div class="masthead-phone"><span>[ TEL ] DIAL:</span> 1-800-PROMPTS</div>
    </div>
    <h1 class="title">THE YELLOW PROMPTS</h1>
    <div class="subtitle">
      <span>138 Master Engines & Protocols</span>
      <span class="banner-slogan">-> LET YOUR FINGERS DO THE COPYING</span>
    </div>
  </header>

  <!-- STICKY CONTROLS -->
  <div class="controls-panel">
    <div class="search-box-wrapper">
      <span class="search-icon">[ SEARCH ]</span>
      <input type="text" id="searchInput" class="search-input" placeholder="Search by name, thinker, keyword, prompt text..." autocomplete="off" spellcheck="false">
      <button id="clearSearch" class="search-clear">X</button>
    </div>
    
    <div class="category-pills" id="categoryPills">
      <button class="pill active" data-cat="ALL">ALL (138)</button>
      <button class="pill" data-cat="Adversarial & Judo">[ JUDO ] ADVERSARIAL & JUDO</button>
      <button class="pill" data-cat="Academic & Proposals">[ ACAD ] ACADEMIC & PROPOSALS</button>
      <button class="pill" data-cat="Presentation & Keynote">[ VOICE ] PRESENTATION & KEYNOTE</button>
      <button class="pill" data-cat="Narrative & Literature">[ TEXT ] NARRATIVE & LITERATURE</button>
      <button class="pill" data-cat="Systems & Cybernetics">[ SYSTEM ] SYSTEMS & CYBERNETICS</button>
      <button class="pill" data-cat="Field & Material Tradecraft">[ CRAFT ] MATERIAL TRADECRAFT</button>
      <button class="pill" data-cat="Spatial & Interface">[ UI ] SPATIAL & INTERFACE</button>
    </div>
  </div>

  <!-- STATUS & VIEW TOGGLE -->
  <div class="status-bar">
    <div id="listingCount">138 LISTINGS FOUND</div>
    <div class="view-toggle">
      <button id="btnCompactView" class="active">COMPACT DIRECTORY</button>
      <button id="btnCardsView">DISPLAY ADS</button>
    </div>
  </div>

  <!-- MAIN LISTINGS -->
  <main class="listings-container directory-mode" id="listingsContainer">
    <!-- Populated via Javascript -->
  </main>

  <!-- EMPTY STATE -->
  <div class="listings-container" id="emptyState" style="display:none;">
    <div class="empty-state">
      <h3>NO CLASSIFIEDS FOUND</h3>
      <p>No system instruction matched your query. Check spelling or clear filters.</p>
    </div>
  </div>

  <!-- FULL READER MODAL (MOBILE FIRST SHEET) -->
  <div class="modal-backdrop" id="readerModal">
    <div class="reader-sheet">
      <div class="sheet-handle-bar">
        <div class="sheet-handle"></div>
      </div>
      <div class="sheet-header">
        <div class="sheet-header-info">
          <div class="sheet-header-badges">
            <span class="badge-num" id="modalNum">001</span>
            <span class="badge-cat" id="modalCat">CATEGORY</span>
            <span class="badge-thinker" id="modalThinker">THINKER</span>
          </div>
          <h2 id="modalTitle">PROMPT TITLE</h2>
        </div>
        <button class="btn-close-sheet" id="btnCloseModal">X</button>
      </div>
      
      <div class="sheet-content">
        <div id="modalScopeWrap" style="margin-bottom:12px;">
          <div class="sheet-section-title">OPERATIONAL SCOPE</div>
          <p id="modalScope" style="font-size:13px; margin-top:4px; font-weight:600;"></p>
        </div>

        <div id="modalProtocolWrap" style="margin-bottom:12px;">
          <div class="sheet-section-title">OPERATIONAL TRADECRAFT PROTOCOL</div>
          <div class="sheet-protocol-card" id="modalProtocol"></div>
        </div>

        <div class="sheet-section-title">SYSTEM INSTRUCTION PROMPT</div>
        <div class="sheet-prompt-box" id="modalPrompt"></div>
      </div>

      <div class="sheet-footer-actions">
        <button class="btn-sheet-nav" id="btnPrevPrompt">◀ PREV</button>
        <button class="btn-sheet-copy" id="btnModalCopy">
          <span>[ TEL ]</span>
          <span id="modalCopyText">COPY PROMPT</span>
        </button>
        <button class="btn-sheet-nav" id="btnNextPrompt">NEXT ▶</button>
      </div>
    </div>
  </div>

  <!-- TOAST FEEDBACK -->
  <div class="toast-pill" id="toastPill">
    <span>[ TEL ]</span>
    <span id="toastMsg">COPIED TO CLIPBOARD!</span>
  </div>

  <!-- FLOATING BOTTOM BAR -->
  <div class="floating-bar">
    <div><strong>THE YELLOW PAGES</strong> • LOCAL DIRECTORY</div>
    <div><a href="system_instructions.md">OPEN MARKDOWN CATALOG ↗</a></div>
  </div>

  <script>
    // Embedded Data
    const PROMPTS = {json_data};
    
    let currentFilter = 'ALL';
    let searchQuery = '';
    let isCompact = true;
    let currentModalIndex = 0;
    let filteredList = [...PROMPTS];

    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    const categoryPills = document.getElementById('categoryPills');
    const listingsContainer = document.getElementById('listingsContainer');
    const emptyState = document.getElementById('emptyState');
    const listingCount = document.getElementById('listingCount');
    const btnCompactView = document.getElementById('btnCompactView');
    const btnCardsView = document.getElementById('btnCardsView');
    const readerModal = document.getElementById('readerModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const toastPill = document.getElementById('toastPill');
    const toastMsg = document.getElementById('toastMsg');
    const guideWord = document.getElementById('guideWord');

    // Modal elements
    const modalNum = document.getElementById('modalNum');
    const modalCat = document.getElementById('modalCat');
    const modalThinker = document.getElementById('modalThinker');
    const modalTitle = document.getElementById('modalTitle');
    const modalScopeWrap = document.getElementById('modalScopeWrap');
    const modalScope = document.getElementById('modalScope');
    const modalProtocolWrap = document.getElementById('modalProtocolWrap');
    const modalProtocol = document.getElementById('modalProtocol');
    const modalPrompt = document.getElementById('modalPrompt');
    const btnModalCopy = document.getElementById('btnModalCopy');
    const modalCopyText = document.getElementById('modalCopyText');
    const btnPrevPrompt = document.getElementById('btnPrevPrompt');
    const btnNextPrompt = document.getElementById('btnNextPrompt');

    function renderListings() {{
      const query = searchQuery.trim().toLowerCase();
      
      filteredList = PROMPTS.filter(p => {{
        const matchesCat = (currentFilter === 'ALL') || (p.category === currentFilter);
        if (!matchesCat) return false;
        if (!query) return true;

        return (
          p.num.toLowerCase().includes(query) ||
          p.title.toLowerCase().includes(query) ||
          p.thinker.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.scope.toLowerCase().includes(query) ||
          p.protocol.toLowerCase().includes(query) ||
          p.prompt.toLowerCase().includes(query) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(query)))
        );
      }});

      listingCount.textContent = `${{filteredList.length}} LISTINGS FOUND`;

      if (filteredList.length === 0) {{
        listingsContainer.style.display = 'none';
        emptyState.style.display = 'block';
        guideWord.textContent = 'NO RESULTS';
        return;
      }}

      listingsContainer.style.display = 'block';
      emptyState.style.display = 'none';

      // Update guide words
      const first = filteredList[0];
      const last = filteredList[filteredList.length - 1];
      guideWord.textContent = `${{first.num}}. ${{first.thinker.toUpperCase()}} — ${{last.num}}. ${{last.thinker.toUpperCase()}}`;

      listingsContainer.innerHTML = filteredList.map((item, idx) => {{
        if (isCompact) {{
          return `
            <div class="listing-row" data-id="${{item.id}}">
              <div class="listing-meta-top">
                <div class="listing-badge-group">
                  <span class="badge-num">[ TEL ] ${{item.num}}</span>
                  <span class="badge-cat">${{item.category}}</span>
                </div>
                <div class="badge-thinker">* ${{item.thinker}}</div>
              </div>
              <div class="listing-title" onclick="openReaderByIndex(${{idx}})">
                ${{item.title}}
              </div>
              <div class="listing-role-snippet">
                ${{item.role}}
              </div>
              <div class="listing-actions">
                <button class="btn-copy-prompt" onclick="copyPromptDirect('${{item.id}}', this, event)">
                  <span>[ TEL ]</span> COPY PROMPT
                </button>
                <button class="btn-view-card" onclick="openReaderByIndex(${{idx}})">
                  READ [ TEXT ]
                </button>
              </div>
            </div>
          `;
        }} else {{
          // Cards Mode
          return `
            <div class="listing-row" data-id="${{item.id}}">
              <div class="listing-meta-top">
                <div class="listing-badge-group">
                  <span class="badge-num">[ TEL ] ${{item.num}}</span>
                  <span class="badge-cat">${{item.category}}</span>
                </div>
                <div class="badge-thinker">* ${{item.thinker}}</div>
              </div>
              <div class="listing-title" onclick="openReaderByIndex(${{idx}})" style="font-size:17px; margin-top:4px;">
                ${{item.title}}
              </div>
              ${{item.scope ? `<p style="font-size:12px; margin:4px 0 6px; font-weight:600;">${{item.scope}}</p>` : ''}}
              ${{item.protocol ? `
                <div class="card-protocol-box">
                  <strong>TRADECRAFT PROTOCOL:</strong><br>${{escapeHtml(item.protocol)}}
                </div>
              ` : ''}}
              <div class="card-prompt-preview">${{escapeHtml(item.prompt.slice(0, 300))}}...</div>
              <div class="listing-actions">
                <button class="btn-copy-prompt" onclick="copyPromptDirect('${{item.id}}', this, event)">
                  <span>[ TEL ]</span> COPY FULL PROMPT
                </button>
                <button class="btn-view-card" onclick="openReaderByIndex(${{idx}})">
                  FULL VIEW [ TEXT ]
                </button>
              </div>
            </div>
          `;
        }}
      }}).join('');
    }}

    function escapeHtml(str) {{
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }}

    function showToast(msg) {{
      toastMsg.textContent = msg;
      toastPill.classList.add('show');
      if (navigator.vibrate) navigator.vibrate(40);
      setTimeout(() => {{
        toastPill.classList.remove('show');
      }}, 1600);
    }}

    function copyTextToClipboard(text, onSuccess) {{
      if (navigator.clipboard && navigator.clipboard.writeText) {{
        navigator.clipboard.writeText(text).then(onSuccess).catch(() => {{
          fallbackCopy(text, onSuccess);
        }});
      }} else {{
        fallbackCopy(text, onSuccess);
      }}
    }}

    function fallbackCopy(text, onSuccess) {{
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {{
        document.execCommand('copy');
        if (onSuccess) onSuccess();
      }} catch (err) {{
        alert('Copy failed: ' + err);
      }}
      document.body.removeChild(ta);
    }}

    function copyPromptDirect(id, btn, event) {{
      if (event) event.stopPropagation();
      const item = PROMPTS.find(p => p.id === id);
      if (!item) return;

      copyTextToClipboard(item.prompt, () => {{
        const origText = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = '[ OK ] COPIED!';
        showToast(`COPIED PROMPT #${{item.num}}!`);
        setTimeout(() => {{
          btn.classList.remove('copied');
          btn.innerHTML = origText;
        }}, 1400);
      }});
    }}

    function openReaderByIndex(idx) {{
      currentModalIndex = idx;
      const item = filteredList[idx];
      if (!item) return;

      modalNum.textContent = item.num;
      modalCat.textContent = item.category;
      modalThinker.textContent = `* ${{item.thinker}}`;
      modalTitle.textContent = item.title;

      if (item.scope) {{
        modalScopeWrap.style.display = 'block';
        modalScope.textContent = item.scope;
      }} else {{
        modalScopeWrap.style.display = 'none';
      }}

      if (item.protocol) {{
        modalProtocolWrap.style.display = 'block';
        modalProtocol.textContent = item.protocol;
      }} else {{
        modalProtocolWrap.style.display = 'none';
      }}

      modalPrompt.textContent = item.prompt;

      readerModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }}

    function closeModal() {{
      readerModal.classList.remove('open');
      document.body.style.overflow = '';
    }}

    // Event listeners
    searchInput.addEventListener('input', (e) => {{
      searchQuery = e.target.value;
      clearSearch.style.display = searchQuery ? 'flex' : 'none';
      renderListings();
    }});

    clearSearch.addEventListener('click', () => {{
      searchInput.value = '';
      searchQuery = '';
      clearSearch.style.display = 'none';
      searchInput.focus();
      renderListings();
    }});

    categoryPills.addEventListener('click', (e) => {{
      const btn = e.target.closest('button.pill');
      if (!btn) return;
      document.querySelectorAll('button.pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-cat');
      renderListings();
    }});

    btnCompactView.addEventListener('click', () => {{
      isCompact = true;
      btnCompactView.classList.add('active');
      btnCardsView.classList.remove('active');
      listingsContainer.className = 'listings-container directory-mode';
      renderListings();
    }});

    btnCardsView.addEventListener('click', () => {{
      isCompact = false;
      btnCardsView.classList.add('active');
      btnCompactView.classList.remove('active');
      listingsContainer.className = 'listings-container cards-mode';
      renderListings();
    }});

    btnCloseModal.addEventListener('click', closeModal);
    readerModal.addEventListener('click', (e) => {{
      if (e.target === readerModal) closeModal();
    }});

    btnModalCopy.addEventListener('click', () => {{
      const item = filteredList[currentModalIndex];
      if (!item) return;
      copyTextToClipboard(item.prompt, () => {{
        btnModalCopy.classList.add('copied');
        modalCopyText.textContent = '[ OK ] COPIED TO CLIPBOARD!';
        showToast(`PROMPT #${{item.num}} COPIED!`);
        setTimeout(() => {{
          btnModalCopy.classList.remove('copied');
          modalCopyText.textContent = 'COPY PROMPT';
        }}, 1400);
      }});
    }});

    btnPrevPrompt.addEventListener('click', () => {{
      if (currentModalIndex > 0) {{
        openReaderByIndex(currentModalIndex - 1);
      }}
    }});

    btnNextPrompt.addEventListener('click', () => {{
      if (currentModalIndex < filteredList.length - 1) {{
        openReaderByIndex(currentModalIndex + 1);
      }}
    }});

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {{
      if (e.key === 'Escape') closeModal();
      if (readerModal.classList.contains('open')) {{
        if (e.key === 'ArrowLeft' && currentModalIndex > 0) openReaderByIndex(currentModalIndex - 1);
        if (e.key === 'ArrowRight' && currentModalIndex < filteredList.length - 1) openReaderByIndex(currentModalIndex + 1);
      }}
    }});

    // Initial render
    renderListings();
  </script>
</body>
</html>
"""

with open(dest_html, "w", encoding="utf-8") as f:
    f.write(html_content)

# Also copy to root yellow_pages.html with corrected relative link
with open(dest_root_html, "w", encoding="utf-8") as f:
    f.write(html_content.replace('href="system_instructions.md"', 'href="WAYS TO WRITE/system_instructions.md"'))

print(f"Generated Yellow Pages web app at {dest_html} ({len(html_content)} bytes)")
