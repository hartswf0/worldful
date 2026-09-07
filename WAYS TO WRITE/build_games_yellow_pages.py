import os
import re
import json

games_dir = "/Users/gaia/WORLDFUL/WAYS TO WRITE/language_games"
output_master_html = "/Users/gaia/WORLDFUL/WAYS TO WRITE/games_yellow_pages.html"
output_root_html = "/Users/gaia/WORLDFUL/games_yellow_pages.html"

games_meta = [
    ("01", "instruction", "INSTRUCTION", "world → word", "principal", "executor", "Wittgenstein, Austin, Searle, Winograd"),
    ("02", "score", "SCORE", "score ↔ realization", "composer", "performer", "Sol LeWitt, Open Musical Form, Generative Art"),
    ("03", "program", "PROGRAM", "declaration ↔ execution", "language designer", "interpreter", "Jules White, In-Context Pattern Engineering"),
    ("04", "plan", "PLAN", "present → anticipated world", "strategist", "planner", "Lucy Suchman, SayCan, Long-Horizon Agents"),
    ("05", "query", "QUERY", "word → world", "inquirer", "retriever / reader", "Enterprise RAG, Schwartz Mata v. Avianca"),
    ("06", "probe", "PROBE", "perturbation → behavior", "investigator", "object of inquiry", "AI Red-Teaming, Mechanistic Interpretability"),
    ("07", "gesture", "GESTURE", "sign → present object", "pointer", "attender", "Multimodal HCI, Spatial Prompting, Deixis"),
    ("08", "commission", "COMMISSION", "brief → artifact", "patron / client", "producer", "US Copyright Office, Moffatt v. Air Canada"),
    ("09", "conversation", "CONVERSATION", "move ↔ countermove", "interlocutor", "responsive counterpart", "Donald Schön, Kevin Roose Bing Sydney"),
    ("10", "edit", "EDIT", "artifact₀ → Δ → artifact₁", "editor", "transformer", "Software Diffing, Inpainting, Contextual Drift"),
    ("11", "constraint", "CONSTRAINT", "possibility space → subset", "boundary setter", "constrained generator", "Grammar Decoding, Guidance, Outlines"),
    ("12", "performance", "PERFORMANCE", "event ↔ audience", "performer", "instrument / partner", "Prompt Battles, Live Theatrical Liveness"),
]

parsed_games = []

for num, slug, name, dir_fit, h_role, m_role, ancestral in games_meta:
    filepath = os.path.join(games_dir, f"{num}_{slug}.md")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Split into sections
    sections = content.split("\n## SECTION ")
    
    # Section 1: Empirical Card
    sec1 = sections[1] if len(sections) > 1 else ""
    # Section 2: Core Spec
    sec2 = sections[2] if len(sections) > 2 else ""
    # Section 3: Lineage
    sec3 = sections[3] if len(sections) > 3 else ""
    # Section 4: Formal Echo
    sec4 = sections[4] if len(sections) > 4 else ""
    # Section 5: Program Theory
    sec5 = sections[5] if len(sections) > 5 else ""
    # Section 6: Residual Human
    sec6 = sections[6] if len(sections) > 6 else ""
    # Section 7: Fun Theory
    sec7 = sections[7] if len(sections) > 7 else ""

    # Parse sovereign question
    sq_m = re.search(r'\*\*Sovereign question:\*\*\s*\n\*\*(.*?)\*\*', sec2)
    sovereign_question = sq_m.group(1).strip() if sq_m else ""

    # Parse drift trigger
    dt_m = re.search(r'\*\*Drift trigger:\*\*\s*\n(.*?)(?=\n\n|\n\*\*)', sec2, re.DOTALL)
    drift_trigger = dt_m.group(1).strip() if dt_m else ""

    # Parse trap
    trap_m = re.search(r'\*\*Characteristic trap:\*\*\s*\n\*\*(.*?)\*\*\.?\s*(.*?)(?=\n\n\*\*Counter-framing)', sec2, re.DOTALL)
    trap_name = trap_m.group(1).strip() if trap_m else ""
    trap_desc = trap_m.group(2).strip() if trap_m else ""

    # Parse counter-framing
    cf_m = re.search(r'\*\*Counter-framing strategy:\*\*\s*\n\*\*(.*?)\*\*\.?\s*(.*?)(?=\n\n\*\*Confirming case)', sec2, re.DOTALL)
    cf_name = cf_m.group(1).strip() if cf_m else ""
    cf_desc = cf_m.group(2).strip() if cf_m else ""

    # Parse confirming case
    cc_m = re.search(r'\*\*Confirming case:\*\*\s*\n(.*?)(?=\n\n\*\*Breakdown case)', sec2, re.DOTALL)
    confirming_case_short = cc_m.group(1).strip() if cc_m else ""

    # Parse breakdown case
    bc_m = re.search(r'\*\*Breakdown case:\*\*\s*\n(.*?)(?=\n\n\*\*What it makes visible)', sec2, re.DOTALL)
    breakdown_case_short = bc_m.group(1).strip() if bc_m else ""

    # Parse XML block
    xml_blocks = re.findall(r'```(?:xml|text)?\s*(<language-game.*?</language-game>)\s*```', sec5, re.DOTALL)
    xml_schema = xml_blocks[0].strip() if xml_blocks else ""

    # Lineage tags
    lt_m = re.search(r'`(#[a-zA-Z0-9_\-]+.*?)`', sec3)
    lineage_tags = lt_m.group(1).strip() if lt_m else ""

    # Human theory snippet
    ht_lines = [l.strip() for l in sec6.split("\n") if l.strip() and not l.startswith("#")]
    human_snippet = "\n\n".join(ht_lines[:4]) if ht_lines else ""

    # Fun theory snippet
    ft_lines = [l.strip() for l in sec7.split("\n") if l.strip() and not l.startswith("#")]
    fun_snippet = "\n\n".join(ft_lines[:4]) if ft_lines else ""

    game_obj = {
        "num": num,
        "slug": slug,
        "name": name,
        "title": f"GAME {num} — {name}",
        "direction_of_fit": dir_fit,
        "human_role": h_role,
        "machine_role": m_role,
        "ancestral": ancestral,
        "sovereign_question": sovereign_question,
        "drift_trigger": drift_trigger,
        "trap_name": trap_name,
        "trap_desc": trap_desc,
        "counter_framing_name": cf_name,
        "counter_framing_desc": cf_desc,
        "confirming_case_short": confirming_case_short,
        "breakdown_case_short": breakdown_case_short,
        "lineage_tags": lineage_tags,
        "xml_schema": xml_schema,
        "sec1_card": sec1.strip(),
        "sec2_spec": sec2.strip(),
        "sec3_lineage": sec3.strip(),
        "sec4_formal": sec4.strip(),
        "sec5_program": sec5.strip(),
        "sec6_human": sec6.strip(),
        "sec7_fun": sec7.strip(),
        "human_snippet": human_snippet,
        "fun_snippet": fun_snippet
    }
    parsed_games.append(game_obj)

print(f"Extracted rich metadata for all {len(parsed_games)} language games.")

# Helper to generate the HTML template
def generate_html(current_game_num="ALL"):
    json_games = json.dumps(parsed_games)
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>LANGUAGE GAMES YELLOW PAGES — The 12 Ideal Types of Generative Systems</title>
  
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:ital,wght@0,400;0,600;0,700;1,400&family=Public+Sans:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">

  <style>
    :root {{
      --yp-yellow: #fde84d;
      --yp-yellow-deep: #e8ca28;
      --yp-yellow-light: #fff280;
      --yp-cream: #fffdf2;
      --yp-black: #12110e;
      --yp-red: #c91818;
      --yp-red-deep: #990d0d;
      --yp-gray: #4a473f;
      --yp-border: #12110e;
      --yp-paper-shadow: rgba(18, 17, 14, 0.16);

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

    .newsprint-overlay {{
      pointer-events: none;
      position: fixed;
      inset: 0;
      opacity: 0.22;
      background-image: radial-gradient(#12110e 0.75px, transparent 0.75px);
      background-size: 4px 4px;
      z-index: 999;
    }}

    /* RUNNING TOP GUIDE */
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
      position: sticky;
      top: 0;
      z-index: 100;
    }}

    .brand-title {{
      display: flex;
      align-items: center;
      gap: 6px;
    }}

    /* MASTHEAD */
    .masthead {{
      padding: 14px 16px 10px;
      border-bottom: 3px double var(--yp-black);
      background: var(--yp-yellow);
    }}

    .masthead-meta {{
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid var(--yp-black);
      padding-bottom: 4px;
      margin-bottom: 6px;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 800;
    }}

    .masthead-meta .dial-info {{
      color: var(--yp-red);
    }}

    h1.main-title {{
      font-family: var(--font-display);
      font-size: clamp(32px, 8.5vw, 54px);
      line-height: 0.92;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 4px 0 6px;
      text-shadow: 2px 2px 0px var(--yp-yellow-light);
    }}

    .subtitle-row {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      color: var(--yp-gray);
      flex-wrap: wrap;
      gap: 6px;
    }}

    .badge-slogan {{
      background: var(--yp-red);
      color: #fff;
      font-size: 10px;
      font-weight: 900;
      padding: 2px 6px;
      border-radius: 2px;
    }}

    /* 12-GAME ROTARY SELECTOR TABS */
    .rotary-nav-wrapper {{
      background: var(--yp-cream);
      border-bottom: 2px solid var(--yp-black);
      padding: 8px 12px;
      position: sticky;
      top: 31px;
      z-index: 90;
      box-shadow: 0 3px 6px var(--yp-paper-shadow);
    }}

    .rotary-label {{
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}

    .rotary-chips {{
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }}
    .rotary-chips::-webkit-scrollbar {{ display: none; }}

    button.game-chip {{
      flex-shrink: 0;
      background: #fff;
      color: var(--yp-black);
      border: 1.5px solid var(--yp-black);
      padding: 5px 9px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 2px 2px 0px var(--yp-black);
      transition: all 0.1s;
      display: flex;
      align-items: center;
      gap: 4px;
    }}

    button.game-chip:active {{
      transform: translate(1px, 1px);
      box-shadow: 1px 1px 0px var(--yp-black);
    }}

    button.game-chip.active {{
      background: var(--yp-black);
      color: var(--yp-yellow);
    }}

    /* SEARCH BAR */
    .search-wrapper {{
      padding: 8px 12px 10px;
      background: var(--yp-yellow-deep);
      border-bottom: 2px solid var(--yp-black);
      display: flex;
      gap: 8px;
    }}

    .search-box {{
      flex: 1;
      position: relative;
    }}

    .search-box input {{
      width: 100%;
      height: 40px;
      padding: 6px 36px 6px 34px;
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 700;
      background: #fff;
      color: var(--yp-black);
      border: 2px solid var(--yp-black);
      border-radius: 4px;
      box-shadow: 2px 2px 0px var(--yp-black);
      outline: none;
    }}

    .search-icon {{
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      font-size: 14px;
    }}

    .search-clear-btn {{
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--yp-black);
      color: #fff;
      border: none;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 900;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }}

    /* MAIN CONTAINER */
    .main-container {{
      max-width: 960px;
      margin: 0 auto;
      padding: 12px 12px 40px;
    }}

    /* GAME CLASSIFIED DOSSIER BANNER */
    .game-banner {{
      background: #fffdf0;
      border: 3px solid var(--yp-black);
      border-radius: 6px;
      padding: 14px 16px;
      margin-bottom: 16px;
      box-shadow: 4px 4px 0px var(--yp-black);
    }}

    .game-banner-top {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
      border-bottom: 2px solid var(--yp-black);
      padding-bottom: 4px;
    }}

    .game-badge-num {{
      font-family: var(--font-mono);
      background: var(--yp-black);
      color: var(--yp-yellow);
      font-size: 13px;
      font-weight: 900;
      padding: 2px 8px;
      border-radius: 2px;
    }}

    .game-banner-title {{
      font-family: var(--font-display);
      font-size: clamp(26px, 6vw, 38px);
      line-height: 1;
      text-transform: uppercase;
      margin: 6px 0 8px;
    }}

    .game-metrics-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 8px;
      margin: 10px 0;
      background: var(--yp-cream);
      border: 1.5px solid var(--yp-black);
      padding: 8px 10px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 11px;
    }}

    .metric-item strong {{
      color: var(--yp-red);
      text-transform: uppercase;
      display: block;
      font-size: 9.5px;
      letter-spacing: 0.5px;
    }}

    /* SOVEREIGN QUESTION CALLOUT */
    .sovereign-card {{
      background: var(--yp-yellow);
      border: 2px solid var(--yp-black);
      border-radius: 4px;
      padding: 10px 14px;
      margin: 12px 0 6px;
      box-shadow: 3px 3px 0px var(--yp-black);
    }}

    .sovereign-header {{
      font-family: var(--font-mono);
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 1px;
      color: var(--yp-red-deep);
      text-transform: uppercase;
      margin-bottom: 2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}

    .sovereign-text {{
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 900;
      line-height: 1.25;
      color: var(--yp-black);
    }}

    /* CLASSIFIED AD SECTIONS (INDIVIDUAL ENTRIES) */
    .classified-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 12px;
      margin-top: 14px;
    }}

    .classified-card {{
      background: #fffdf0;
      border: 2px solid var(--yp-black);
      border-radius: 4px;
      padding: 12px;
      box-shadow: 3px 3px 0px var(--yp-black);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 8px;
    }}

    .classified-tag {{
      font-family: var(--font-mono);
      font-size: 9.5px;
      font-weight: 900;
      letter-spacing: 0.8px;
      text-transform: uppercase;
      background: var(--yp-black);
      color: var(--yp-yellow);
      display: inline-block;
      padding: 2px 6px;
      border-radius: 2px;
      align-self: flex-start;
    }}

    .classified-title {{
      font-family: var(--font-body);
      font-size: 15px;
      font-weight: 900;
      color: var(--yp-black);
      margin-top: 2px;
    }}

    .classified-content {{
      font-size: 12.5px;
      line-height: 1.45;
      color: var(--yp-black);
    }}

    .classified-content pre, .classified-content code {{
      font-family: var(--font-mono);
      font-size: 11px;
      background: rgba(0,0,0,0.04);
      padding: 2px 4px;
      border-radius: 2px;
      white-space: pre-wrap;
    }}

    .classified-actions {{
      display: flex;
      gap: 6px;
      margin-top: 6px;
    }}

    button.btn-copy-entry {{
      flex: 1;
      height: 36px;
      background: var(--yp-yellow);
      color: var(--yp-black);
      border: 1.5px solid var(--yp-black);
      border-radius: 3px;
      font-family: var(--font-mono);
      font-size: 11.5px;
      font-weight: 900;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      box-shadow: 2px 2px 0px var(--yp-black);
      transition: all 0.1s;
    }}

    button.btn-copy-entry:active {{
      transform: translate(1px, 1px);
      box-shadow: 1px 1px 0px var(--yp-black);
    }}

    button.btn-copy-entry.copied {{
      background: var(--yp-black);
      color: var(--yp-yellow);
    }}

    button.btn-read-entry {{
      background: #fff;
      border: 1.5px solid var(--yp-black);
      border-radius: 3px;
      padding: 0 10px;
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
      box-shadow: 2px 2px 0px var(--yp-black);
    }}

    /* FULL READER MODAL */
    .modal-backdrop {{
      position: fixed;
      inset: 0;
      background: rgba(18, 17, 14, 0.72);
      backdrop-filter: blur(3px);
      z-index: 1000;
      display: none;
      align-items: flex-end;
      justify-content: center;
    }}

    .modal-backdrop.open {{
      display: flex;
    }}

    .modal-sheet {{
      background: var(--yp-cream);
      width: 100%;
      max-width: 840px;
      max-height: 90vh;
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

    .sheet-header-title h2 {{
      font-family: var(--font-display);
      font-size: 22px;
      text-transform: uppercase;
      line-height: 1.1;
    }}

    .btn-close-modal {{
      background: var(--yp-black);
      color: #fff;
      border: none;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      font-size: 15px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
    }}

    .sheet-body {{
      padding: 16px 16px 80px;
      overflow-y: auto;
      font-size: 13.5px;
      line-height: 1.5;
    }}

    .sheet-body pre {{
      background: #fff;
      border: 2px solid var(--yp-black);
      padding: 12px;
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 11.5px;
      white-space: pre-wrap;
      margin: 10px 0;
      box-shadow: 2px 2px 0px var(--yp-black);
    }}

    .sheet-footer {{
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

    .btn-sheet-copy-full {{
      flex: 1;
      height: 44px;
      background: var(--yp-red);
      color: #fff;
      border: 2px solid var(--yp-black);
      border-radius: 4px;
      font-family: var(--font-mono);
      font-size: 13.5px;
      font-weight: 900;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 3px 3px 0px var(--yp-black);
    }}

    .btn-sheet-copy-full.copied {{
      background: var(--yp-black);
      color: var(--yp-yellow);
    }}

    /* TOAST */
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

    /* FOOTER BAR */
    .bottom-bar {{
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

    .bottom-bar a {{
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
    <div class="brand-title">
      <span>☎</span>
      <span>YELLOW PAGES: LANGUAGE GAMES</span>
    </div>
    <div id="guideWord">01. INSTRUCTION — 12. PERFORMANCE</div>
  </div>

  <!-- MASTHEAD -->
  <header class="masthead">
    <div class="masthead-meta">
      <div>VOL. II • THE 12 LANGUAGE GAMES DIRECTORY</div>
      <div class="dial-info">☎ TOLL FREE: 1-800-DIAL-GAME</div>
    </div>
    <h1 class="main-title">THE GAME YELLOW PAGES</h1>
    <div class="subtitle-row">
      <span>12 Ideal Types • Lineages • Scaffolds • Residual Stakes</span>
      <span class="badge-slogan">☞ REFUSE THE GRAMMATICAL SEDUCTION</span>
    </div>
  </header>

  <!-- 12-GAME ROTARY SELECTOR TABS -->
  <div class="rotary-nav-wrapper">
    <div class="rotary-label">
      <span>SELECT LANGUAGE GAME (DIAL 01 TO 12):</span>
      <span id="activeGameCounter">GAME 01 OF 12</span>
    </div>
    <div class="rotary-chips" id="rotaryChips">
      <!-- Injected via JS -->
    </div>
  </div>

  <!-- SEARCH BAR -->
  <div class="search-wrapper">
    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input type="text" id="searchInput" placeholder="Search rules, case studies, traps, lineages, XML tags..." autocomplete="off">
      <button class="search-clear-btn" id="searchClear">✕</button>
    </div>
  </div>

  <!-- MAIN LISTINGS CONTAINER -->
  <main class="main-container" id="mainContainer">
    <!-- Rendered via JS -->
  </main>

  <!-- MODAL VIEWER -->
  <div class="modal-backdrop" id="modalBackdrop">
    <div class="modal-sheet">
      <div class="sheet-handle-bar"><div class="sheet-handle"></div></div>
      <div class="sheet-header">
        <div class="sheet-header-title">
          <div id="modalTag" style="font-family:var(--font-mono); font-size:10px; font-weight:800; color:var(--yp-red);">CLASSIFIED</div>
          <h2 id="modalTitle">ENTRY TITLE</h2>
        </div>
        <button class="btn-close-modal" id="modalClose">✕</button>
      </div>
      <div class="sheet-body" id="modalBody"></div>
      <div class="sheet-footer">
        <button class="btn-sheet-copy-full" id="btnModalCopy">
          <span>☎</span>
          <span id="modalCopyText">COPY ENTRY</span>
        </button>
      </div>
    </div>
  </div>

  <!-- TOAST -->
  <div class="toast-pill" id="toastPill">
    <span>☎</span>
    <span id="toastText">COPIED TO CLIPBOARD!</span>
  </div>

  <!-- BOTTOM BAR -->
  <div class="bottom-bar">
    <div><strong>LANGUAGE GAMES DIRECTORY</strong> • 12 IDEAL TYPES</div>
    <div><a href="language_games/00_overview_and_switchyard.md">OPEN SWITCHYARD OVERVIEW ↗</a></div>
  </div>

  <script>
    const GAMES = {json_games};
    let activeGameNum = "{current_game_num}";
    let filterQuery = "";
    
    // Elements
    const rotaryChips = document.getElementById("rotaryChips");
    const mainContainer = document.getElementById("mainContainer");
    const searchInput = document.getElementById("searchInput");
    const searchClear = document.getElementById("searchClear");
    const guideWord = document.getElementById("guideWord");
    const activeGameCounter = document.getElementById("activeGameCounter");
    
    // Modal elements
    const modalBackdrop = document.getElementById("modalBackdrop");
    const modalTag = document.getElementById("modalTag");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const modalClose = document.getElementById("modalClose");
    const btnModalCopy = document.getElementById("btnModalCopy");
    const modalCopyText = document.getElementById("modalCopyText");
    const toastPill = document.getElementById("toastPill");
    const toastText = document.getElementById("toastText");

    let currentModalCopyPayload = "";

    function init() {{
      renderRotaryChips();
      renderActiveGame();
      setupEvents();
    }}

    function renderRotaryChips() {{
      rotaryChips.innerHTML = GAMES.map(g => `
        <button class="game-chip ${{g.num === activeGameNum ? 'active' : ''}}" data-num="${{g.num}}">
          <span>☎ ${{g.num}}</span>
          <span>${{g.name}}</span>
        </button>
      `).join('');
    }}

    function renderActiveGame() {{
      const query = filterQuery.toLowerCase().trim();
      let gamesToShow = GAMES;

      if (activeGameNum !== "ALL") {{
        gamesToShow = GAMES.filter(g => g.num === activeGameNum);
      }}

      if (query) {{
        gamesToShow = GAMES.filter(g => {{
          return (
            g.name.toLowerCase().includes(query) ||
            g.sovereign_question.toLowerCase().includes(query) ||
            g.trap_name.toLowerCase().includes(query) ||
            g.trap_desc.toLowerCase().includes(query) ||
            g.confirming_case_short.toLowerCase().includes(query) ||
            g.breakdown_case_short.toLowerCase().includes(query) ||
            g.ancestral.toLowerCase().includes(query) ||
            g.lineage_tags.toLowerCase().includes(query) ||
            g.sec1_card.toLowerCase().includes(query) ||
            g.sec5_program.toLowerCase().includes(query) ||
            g.sec6_human.toLowerCase().includes(query)
          );
        }});
      }}

      if (gamesToShow.length === 0) {{
        mainContainer.innerHTML = `
          <div style="background:#fff; border:2px dashed #000; padding:40px 20px; text-align:center; border-radius:4px;">
            <h3 style="font-family:var(--font-display); font-size:24px;">NO CLASSIFIEDS FOUND FOR "${{filterQuery}}"</h3>
            <p style="margin-top:6px; font-size:13px;">Check search terms or switch game tabs.</p>
          </div>
        `;
        return;
      }}

      if (activeGameNum !== "ALL" && gamesToShow.length === 1) {{
        const g = gamesToShow[0];
        guideWord.textContent = `${{g.num}}. ${{g.name}} — DIRECTION: ${{g.direction_of_fit.toUpperCase()}}`;
        activeGameCounter.textContent = `GAME ${{g.num}} OF 12 • ${{g.name}}`;
      }} else {{
        guideWord.textContent = `01. INSTRUCTION — 12. PERFORMANCE`;
        activeGameCounter.textContent = `${{gamesToShow.length}} OF 12 GAMES LISTED`;
      }}

      mainContainer.innerHTML = gamesToShow.map(g => `
        <article class="game-banner" id="game-${{g.num}}">
          <div class="game-banner-top">
            <span class="game-badge-num">☎ GAME ${{g.num}}</span>
            <span style="font-family:var(--font-mono); font-size:10.5px; font-weight:900; color:var(--yp-red);">
              FIT: ${{g.direction_of_fit}}
            </span>
          </div>

          <h2 class="game-banner-title">${{g.title}}</h2>

          <div class="game-metrics-grid">
            <div class="metric-item">
              <strong>Human Role</strong>
              ${{g.human_role}}
            </div>
            <div class="metric-item">
              <strong>Machine Role</strong>
              ${{g.machine_role}}
            </div>
            <div class="metric-item">
              <strong>Ancestral Lineage</strong>
              ${{g.ancestral}}
            </div>
            <div class="metric-item">
              <strong>Tags</strong>
              ${{g.lineage_tags || '#language-game'}}
            </div>
          </div>

          <div class="sovereign-card">
            <div class="sovereign-header">
              <span>★ THE SOVEREIGN QUESTION</span>
              <span>INVARIANT</span>
            </div>
            <div class="sovereign-text">"${{g.sovereign_question}}"</div>
            <div style="margin-top:8px;">
              <button class="btn-copy-entry" onclick="copySnippet('${{escapeJs(g.sovereign_question)}}', 'SOVEREIGN QUESTION', this)">
                <span>☎</span> COPY QUESTION
              </button>
            </div>
          </div>

          <!-- CLASSIFIED LISTINGS -->
          <div class="classified-grid">
            
            <!-- 1. CORE CONTRACT -->
            <div class="classified-card">
              <div>
                <span class="classified-tag">CLASSIFIED 01 • CONTRACT</span>
                <div class="classified-title">Operational Game Contract</div>
                <div class="classified-content" style="margin-top:6px;">
                  • <strong>Direction of Fit:</strong> ${{g.direction_of_fit}}<br>
                  • <strong>Human Role:</strong> ${{g.human_role}}<br>
                  • <strong>Machine Role:</strong> ${{g.machine_role}}
                </div>
              </div>
              <div class="classified-actions">
                <button class="btn-copy-entry" onclick="copySnippet('${{escapeJs(g.sec2_spec.slice(0, 500))}}', 'GAME CONTRACT', this)">
                  <span>☎</span> COPY CONTRACT
                </button>
                <button class="btn-read-entry" onclick="openModal('CONTRACT: ${{g.name}}', '${{escapeJs(g.sec2_spec)}}', 'SPECIFICATION')">
                  READ 📖
                </button>
              </div>
            </div>

            <!-- 2. CHARACTERISTIC TRAP & COUNTER-FRAMING -->
            <div class="classified-card">
              <div>
                <span class="classified-tag" style="background:var(--yp-red); color:#fff;">CLASSIFIED 02 • TRAP</span>
                <div class="classified-title">${{g.trap_name}}</div>
                <div class="classified-content" style="margin-top:6px;">
                  ${{g.trap_desc}}<br><br>
                  <strong>Counter-Framing:</strong> ${{g.counter_framing_name}}
                </div>
              </div>
              <div class="classified-actions">
                <button class="btn-copy-entry" onclick="copySnippet('${{escapeJs(g.counter_framing_desc)}}', 'COUNTER-FRAMING', this)">
                  <span>☎</span> COPY COUNTER-MOVE
                </button>
                <button class="btn-read-entry" onclick="openModal('TRAP & COUNTER-FRAMING', '${{escapeJs('TRAP: ' + g.trap_name + '\\n\\n' + g.trap_desc + '\\n\\nCOUNTER-FRAMING: ' + g.counter_framing_name + '\\n\\n' + g.counter_framing_desc)}}', 'TACTICAL DEFENSE')">
                  READ 📖
                </button>
              </div>
            </div>

            <!-- 3. CONFIRMING CASE -->
            <div class="classified-card">
              <div>
                <span class="classified-tag">CLASSIFIED 03 • PRECEDENT</span>
                <div class="classified-title">Confirming Case Study</div>
                <div class="classified-content" style="margin-top:6px;">
                  ${{g.confirming_case_short}}
                </div>
              </div>
              <div class="classified-actions">
                <button class="btn-copy-entry" onclick="copySnippet('${{escapeJs(g.confirming_case_short)}}', 'CONFIRMING CASE', this)">
                  <span>☎</span> COPY CASE
                </button>
                <button class="btn-read-entry" onclick="openModal('CONFIRMING CASE: ${{g.name}}', '${{escapeJs(g.sec1_card)}}', 'EMPIRICAL CARD')">
                  CARD 📖
                </button>
              </div>
            </div>

            <!-- 4. BREAKDOWN CASE -->
            <div class="classified-card">
              <div>
                <span class="classified-tag" style="background:var(--yp-red-deep); color:#fff;">CLASSIFIED 04 • CATASTROPHE</span>
                <div class="classified-title">Breakdown & Failure Mode</div>
                <div class="classified-content" style="margin-top:6px;">
                  ${{g.breakdown_case_short}}
                </div>
              </div>
              <div class="classified-actions">
                <button class="btn-copy-entry" onclick="copySnippet('${{escapeJs(g.breakdown_case_short)}}', 'BREAKDOWN CASE', this)">
                  <span>☎</span> COPY FAILURE
                </button>
                <button class="btn-read-entry" onclick="openModal('BREAKDOWN CASE: ${{g.name}}', '${{escapeJs(g.sec1_card)}}', 'EMPIRICAL FAILURE')">
                  CARD 📖
                </button>
              </div>
            </div>

            <!-- 5. ANCESTRAL LINEAGE -->
            <div class="classified-card">
              <div>
                <span class="classified-tag">CLASSIFIED 05 • LINEAGE</span>
                <div class="classified-title">Ancestral Formalisms</div>
                <div class="classified-content" style="margin-top:6px;">
                  ${{g.ancestral}}<br>
                  <code style="display:inline-block; margin-top:4px;">${{g.lineage_tags}}</code>
                </div>
              </div>
              <div class="classified-actions">
                <button class="btn-copy-entry" onclick="copySnippet('${{escapeJs(g.sec3_lineage)}}', 'LINEAGE', this)">
                  <span>☎</span> COPY LINEAGE
                </button>
                <button class="btn-read-entry" onclick="openModal('LINEAGE DESCENT: ${{g.name}}', '${{escapeJs(g.sec3_lineage)}}', 'ANCESTRAL FORMALISMS')">
                  READ 📖
                </button>
              </div>
            </div>

            <!-- 6. PROGRAM XML SCAFFOLD -->
            <div class="classified-card">
              <div>
                <span class="classified-tag">CLASSIFIED 06 • PROGRAM</span>
                <div class="classified-title">Declarative XML Scaffold</div>
                <div class="classified-content" style="margin-top:6px;">
                  <pre><code>${{escapeHtml(g.xml_schema || '<language-game id=\"' + g.slug + '\">\\n  <!-- Declarative Scaffold -->\\n</language-game>')}}</code></pre>
                </div>
              </div>
              <div class="classified-actions">
                <button class="btn-copy-entry" onclick="copySnippet('${{escapeJs(g.xml_schema || g.sec5_program)}}', 'XML SCAFFOLD', this)">
                  <span>☎</span> COPY XML
                </button>
                <button class="btn-read-entry" onclick="openModal('THEORY OF THE PROGRAM: ${{g.name}}', '${{escapeJs(g.sec5_program)}}', 'COMPUTATIONAL SCHEMA')">
                  SCHEMA 📖
                </button>
              </div>
            </div>

            <!-- 7. RESIDUAL HUMAN ELEMENT -->
            <div class="classified-card">
              <div>
                <span class="classified-tag">CLASSIFIED 07 • HUMAN STAKES</span>
                <div class="classified-title">The Residual Human Stance</div>
                <div class="classified-content" style="margin-top:6px;">
                  ${{g.human_snippet.slice(0, 180)}}...
                </div>
              </div>
              <div class="classified-actions">
                <button class="btn-copy-entry" onclick="copySnippet('${{escapeJs(g.sec6_human)}}', 'HUMAN STAKES', this)">
                  <span>☎</span> COPY STAKES
                </button>
                <button class="btn-read-entry" onclick="openModal('RESIDUAL HUMAN THEORY: ${{g.name}}', '${{escapeJs(g.sec6_human)}}', 'HUMAN REFUSAL')">
                  READ 📖
                </button>
              </div>
            </div>

            <!-- 8. PLAY MECHANICS / FUN -->
            <div class="classified-card">
              <div>
                <span class="classified-tag">CLASSIFIED 08 • PLAY MECHANICS</span>
                <div class="classified-title">The Cognitive Puzzle & Drift</div>
                <div class="classified-content" style="margin-top:6px;">
                  <strong>Drift Trigger:</strong> ${{g.drift_trigger}}<br><br>
                  ${{g.fun_snippet.slice(0, 140)}}...
                </div>
              </div>
              <div class="classified-actions">
                <button class="btn-copy-entry" onclick="copySnippet('${{escapeJs(g.drift_trigger)}}', 'DRIFT TRIGGER', this)">
                  <span>☎</span> COPY DRIFT
                </button>
                <button class="btn-read-entry" onclick="openModal('PLAY DYNAMICS & DRIFT: ${{g.name}}', '${{escapeJs(g.sec7_fun)}}', 'FUN THEORY')">
                  READ 📖
                </button>
              </div>
            </div>

          </div>
        </article>
      `).join('');
    }}

    function escapeHtml(str) {{
      return (str || '')
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }}

    function escapeJs(str) {{
      return (str || '')
        .replace(/\\\\/g, "\\\\\\\\")
        .replace(/'/g, "\\\\'")
        .replace(/\\"/g, '\\\\"')
        .replace(/\\n/g, "\\\\n")
        .replace(/\\r/g, "");
    }}

    function showToast(msg) {{
      toastText.textContent = msg;
      toastPill.classList.add('show');
      if (navigator.vibrate) navigator.vibrate(40);
      setTimeout(() => {{
        toastPill.classList.remove('show');
      }}, 1500);
    }}

    function copySnippet(text, label, btn) {{
      if (navigator.clipboard && navigator.clipboard.writeText) {{
        navigator.clipboard.writeText(text).then(() => {{
          handleCopySuccess(label, btn);
        }}).catch(() => {{
          fallbackCopy(text, () => handleCopySuccess(label, btn));
        }});
      }} else {{
        fallbackCopy(text, () => handleCopySuccess(label, btn));
      }}
    }}

    function handleCopySuccess(label, btn) {{
      if (btn) {{
        const orig = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = '✔ COPIED!';
        setTimeout(() => {{
          btn.classList.remove('copied');
          btn.innerHTML = orig;
        }}, 1400);
      }}
      showToast(`${{label}} COPIED TO CLIPBOARD!`);
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
        alert('Copy error');
      }}
      document.body.removeChild(ta);
    }}

    function openModal(title, content, tag) {{
      modalTitle.textContent = title;
      modalTag.textContent = tag || 'CLASSIFIED';
      currentModalCopyPayload = content;
      modalBody.innerHTML = `<pre><code>${{escapeHtml(content)}}</code></pre>`;
      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }}

    function closeModal() {{
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }}

    function setupEvents() {{
      rotaryChips.addEventListener('click', (e) => {{
        const chip = e.target.closest('.game-chip');
        if (!chip) return;
        document.querySelectorAll('.game-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeGameNum = chip.getAttribute('data-num');
        renderActiveGame();
        window.scrollTo({{ top: 0, behavior: 'smooth' }});
      }});

      searchInput.addEventListener('input', (e) => {{
        filterQuery = e.target.value;
        searchClear.style.display = filterQuery ? 'flex' : 'none';
        renderActiveGame();
      }});

      searchClear.addEventListener('click', () => {{
        searchInput.value = '';
        filterQuery = '';
        searchClear.style.display = 'none';
        renderActiveGame();
        searchInput.focus();
      }});

      modalClose.addEventListener('click', closeModal);
      modalBackdrop.addEventListener('click', (e) => {{
        if (e.target === modalBackdrop) closeModal();
      }});

      btnModalCopy.addEventListener('click', () => {{
        copySnippet(currentModalCopyPayload, 'FULL DOSSIER', btnModalCopy);
      }});

      window.addEventListener('keydown', (e) => {{
        if (e.key === 'Escape') closeModal();
      }});
    }}

    init();
  </script>
</body>
</html>
"""
    return html

# 1. Build Master games_yellow_pages.html
master_html = generate_html("01")
with open(output_master_html, "w", encoding="utf-8") as f:
    f.write(master_html)
with open(output_root_html, "w", encoding="utf-8") as f:
    f.write(master_html)
print(f"Generated master {output_master_html} ({len(master_html)} bytes)")

# 2. Build 12 Standalone Game Yellow Pages
for g in parsed_games:
    single_html = generate_html(g["num"])
    single_path = os.path.join(games_dir, f"{g['num']}_{g['slug']}_yellow_pages.html")
    with open(single_path, "w", encoding="utf-8") as f:
        f.write(single_html)
    print(f"Generated standalone Yellow Pages for Game {g['num']}: {single_path}")

print("All Game Yellow Pages generated successfully!")
