import os
import re
import json

games_dir = "/Users/gaia/WORLDFUL/WAYS TO WRITE/language_games"
output_master_html = "/Users/gaia/WORLDFUL/WAYS TO WRITE/games_yellow_pages.html"
output_root_html = "/Users/gaia/WORLDFUL/games_yellow_pages.html"

# Games metadata
games_meta = [
    ("01", "instruction", "INSTRUCTION", "world -> word", "principal", "executor", "Wittgenstein (1953), Austin & Searle (1962), Winograd (SHRDLU, 1971), Instruction Tuning"),
    ("02", "score", "SCORE", "score <-> realization", "composer", "performer", "Musical Invariants, Sol LeWitt (1967), Conceptual Art, Diffusion Prompting"),
    ("03", "program", "PROGRAM", "declaration <-> execution", "language designer", "interpreter", "In-Context Learning, Jules White Pattern Catalogs, Soft Virtual Machines"),
    ("04", "plan", "PLAN", "present -> anticipated world", "strategist", "planner", "Lucy Suchman (1987), SayCan Robotics, Hierarchical Decomposition"),
    ("05", "query", "QUERY", "word -> world", "inquirer", "retriever / reader", "Information Retrieval, Enterprise RAG, Schwartz Mata v. Avianca (2023)"),
    ("06", "probe", "PROBE", "perturbation -> behavior", "investigator", "object of inquiry", "AI Red-Teaming, Mechanistic Interpretability, Sycophancy Tracing"),
    ("07", "gesture", "GESTURE", "sign -> present object", "pointer", "attender", "Multimodal HCI, Deixis, Spatial Attention, Shared Referential Fields"),
    ("08", "commission", "COMMISSION", "brief -> artifact", "patron / client", "producer", "US Copyright Review Board (2023), Moffatt v. Air Canada (2024)"),
    ("09", "conversation", "CONVERSATION", "move <-> countermove", "interlocutor", "responsive counterpart", "Donald Schon (1983), Turn-Taking, Kevin Roose Bing Sydney (2023)"),
    ("10", "edit", "EDIT", "artifact0 -> Delta -> artifact1", "editor", "transformer", "Differential Refactoring, Inpainting, Contextual Drift, In-Place Mutation"),
    ("11", "constraint", "CONSTRAINT", "possibility space -> subset", "boundary setter", "constrained generator", "Grammar-Constrained Decoding, Guidance, Outlines, P=0 Filtering"),
    ("12", "performance", "PERFORMANCE", "event <-> audience", "performer", "instrument / partner", "Live Prompt Battles, Liveness, Spectatorship, Affective Risk"),
]

# Emoji stripping regex
emoji_regex = re.compile(
    '['
    '\U0001F300-\U0001F5FF'
    '\U0001F600-\U0001F64F'
    '\U0001F680-\U0001F6FF'
    '\U0001F700-\U0001F77F'
    '\U0001F780-\U0001F7FF'
    '\U0001F800-\U0001F8FF'
    '\U0001F900-\U0001F9FF'
    '\U0001FA00-\U0001FA6F'
    '\U0001FA70-\U0001FAFF'
    '\U00002600-\U000026FF'
    '\U00002700-\U000027BF'
    '\U0001F1E0-\U0001F1FF'
    ']+', flags=re.UNICODE
)

parsed_games = []

for num, slug, name, dir_fit, h_role, m_role, ancestral in games_meta:
    filepath = os.path.join(games_dir, f"{num}_{slug}.md")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    content = emoji_regex.sub("", content)

    sections = content.split("\n## SECTION ")
    sec1 = sections[1] if len(sections) > 1 else ""
    sec2 = sections[2] if len(sections) > 2 else ""
    sec3 = sections[3] if len(sections) > 3 else ""
    sec4 = sections[4] if len(sections) > 4 else ""
    sec5 = sections[5] if len(sections) > 5 else ""
    sec6 = sections[6] if len(sections) > 6 else ""
    sec7 = sections[7] if len(sections) > 7 else ""

    sq_m = re.search(r'\*\*Sovereign question:\*\*\s*\n\*\*(.*?)\*\*', sec2)
    sovereign_question = sq_m.group(1).strip() if sq_m else "What game gives these words their force?"

    dt_m = re.search(r'\*\*Drift trigger:\*\*\s*\n(.*?)(?=\n\n|\n\*\*)', sec2, re.DOTALL)
    drift_trigger = dt_m.group(1).strip() if dt_m else ""

    trap_m = re.search(r'\*\*Characteristic trap:\*\*\s*\n\*\*(.*?)\*\*\.?\s*(.*?)(?=\n\n\*\*Counter-framing)', sec2, re.DOTALL)
    trap_name = trap_m.group(1).strip() if trap_m else "Characteristic Trap"
    trap_desc = trap_m.group(2).strip() if trap_m else ""

    cf_m = re.search(r'\*\*Counter-framing strategy:\*\*\s*\n\*\*(.*?)\*\*\.?\s*(.*?)(?=\n\n\*\*Confirming case)', sec2, re.DOTALL)
    cf_name = cf_m.group(1).strip() if cf_m else "Counter-Framing"
    cf_desc = cf_m.group(2).strip() if cf_m else ""

    cc_m = re.search(r'\*\*Confirming case:\*\*\s*\n(.*?)(?=\n\n\*\*Breakdown case)', sec2, re.DOTALL)
    confirming_case_short = cc_m.group(1).strip() if cc_m else ""

    bc_m = re.search(r'\*\*Breakdown case:\*\*\s*\n(.*?)(?=\n\n\*\*What it makes visible)', sec2, re.DOTALL)
    breakdown_case_short = bc_m.group(1).strip() if bc_m else ""

    xml_blocks = re.findall(r'```(?:xml|text)?\s*(<language-game.*?</language-game>)\s*```', sec5, re.DOTALL)
    xml_schema = xml_blocks[0].strip() if xml_blocks else ""

    lt_m = re.search(r'`(#[a-zA-Z0-9_\-]+.*?)`', sec3)
    lineage_tags = lt_m.group(1).strip() if lt_m else f"#language-game #{slug}"

    ht_lines = [l.strip() for l in sec6.split("\n") if l.strip() and not l.startswith("#")]
    human_snippet = "\n\n".join(ht_lines[:3]) if ht_lines else ""

    ft_lines = [l.strip() for l in sec7.split("\n") if l.strip() and not l.startswith("#")]
    fun_snippet = "\n\n".join(ft_lines[:3]) if ft_lines else ""

    parsed_games.append({
        "num": num,
        "slug": slug,
        "name": name,
        "title": f"GAME {num} // {name}",
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
    })

print(f"Loaded {len(parsed_games)} language games for compilation.")

# Raw HTML Template without f-string interpolation
template_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>WORLDFUL PRESS // The Twelve Language Games Directory</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Public+Sans:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">

  <style>
    :root {
      --paper:        #ebe6da;
      --paper-hi:     #f4efe5;
      --paper-lo:     #ddd5c4;
      --paper-yellow: #fae9a4;
      --paper-warm:   #fdfcf7;
      --ink:          #211d18;
      --ink-soft:     #57503f;
      --ink-faint:    #8a8170;
      --red:          #9e2318;
      --red-deep:     #781810;
      --red-faint:    rgba(158, 35, 24, 0.12);
      --hair:         rgba(33, 29, 24, 0.20);
      --hair-faint:   rgba(33, 29, 24, 0.10);

      --display: "Playfair Display", "Didot", "Bodoni MT", Georgia, serif;
      --serif:   "Newsreader", Georgia, "Times New Roman", serif;
      --mono:    "IBM Plex Mono", "Courier Prime", ui-monospace, monospace;
      --sans:    "Public Sans", -apple-system, BlinkMacSystemFont, sans-serif;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      background: var(--paper);
      color: var(--ink);
      font-family: var(--serif);
      line-height: 1.5;
      min-height: 100vh;
      overflow-x: hidden;
      padding-bottom: 70px;
      -webkit-font-smoothing: antialiased;
    }

    /* WORLDFUL Archival Paper Texture */
    body::after {
      content: "";
      position: fixed;
      inset: 0;
      z-index: 80;
      pointer-events: none;
      opacity: 0.22;
      mix-blend-mode: multiply;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.45 0 0 0 0 0.42 0 0 0 0 0.36 0 0 0 0 0.26 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>");
    }

    /* RUNNING TOP MASTHEAD BAR */
    .archival-topbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(235, 230, 218, 0.98);
      border-bottom: 1px solid var(--hair);
      backdrop-filter: blur(8px);
      padding: 9px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
    }

    .topbar-left {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
    }

    .topbar-left .edition-badge {
      background: var(--ink);
      color: var(--paper-hi);
      padding: 2px 7px;
      font-size: 10px;
      letter-spacing: 0.18em;
    }

    .topbar-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    button.btn-pres-toggle {
      background: var(--red);
      color: var(--paper-hi);
      border: 1px solid var(--red-deep);
      padding: 5px 12px;
      font-family: var(--mono);
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      cursor: pointer;
      box-shadow: 2px 2px 0px var(--ink);
      transition: all 0.15s;
    }

    button.btn-pres-toggle:hover {
      background: var(--red-deep);
      transform: translateY(-1px);
    }

    button.btn-pres-toggle:active {
      transform: translateY(1px);
      box-shadow: 1px 1px 0px var(--ink);
    }

    /* HEADER BANNER */
    .header-banner {
      max-width: 1320px;
      margin: 0 auto;
      padding: 24px 20px 16px;
      border-bottom: 2px solid var(--ink);
    }

    .header-meta-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: 0.18em;
      color: var(--ink-soft);
      border-bottom: 1px solid var(--hair);
      padding-bottom: 6px;
      margin-bottom: 12px;
    }

    .header-meta-row .coord {
      color: var(--red);
      font-weight: 700;
    }

    h1.header-title {
      font-family: var(--display);
      font-size: clamp(34px, 7vw, 68px);
      font-weight: 600;
      line-height: 0.95;
      letter-spacing: 0.02em;
      color: var(--ink);
      margin-bottom: 8px;
    }

    .header-tick {
      width: 48px;
      height: 3px;
      background: var(--red);
      margin: 10px 0 12px;
    }

    .header-subtitle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      font-family: var(--mono);
      font-size: 12px;
      color: var(--ink-soft);
      letter-spacing: 0.12em;
    }

    .header-subtitle-row .tagline {
      font-family: var(--serif);
      font-style: italic;
      font-size: 15px;
      color: var(--ink);
    }

    /* ROTARY DIAL / GAME SELECTOR */
    .dial-selector-strip {
      position: sticky;
      top: 38px;
      z-index: 90;
      background: var(--paper-hi);
      border-bottom: 1.5px solid var(--ink);
      padding: 8px 18px;
      box-shadow: 0 4px 12px rgba(33, 29, 24, 0.06);
    }

    .dial-strip-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--mono);
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      margin-bottom: 6px;
      color: var(--ink-soft);
    }

    .dial-chips {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: none;
      -webkit-overflow-scrolling: touch;
    }
    .dial-chips::-webkit-scrollbar { display: none; }

    button.dial-chip {
      flex-shrink: 0;
      background: var(--paper);
      color: var(--ink);
      border: 1px solid var(--ink);
      padding: 5px 9px;
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      cursor: pointer;
      box-shadow: 2px 2px 0px var(--hair);
      transition: all 0.1s;
    }

    button.dial-chip:hover {
      background: var(--paper-yellow);
    }

    button.dial-chip.active {
      background: var(--ink);
      color: var(--paper-hi);
      border-color: var(--ink);
      box-shadow: 2px 2px 0px var(--red);
    }

    /* SEARCH FILTER BAR */
    .search-strip {
      max-width: 1320px;
      margin: 12px auto 0;
      padding: 0 20px;
      display: flex;
      gap: 10px;
    }

    .search-input-wrap {
      flex: 1;
      position: relative;
    }

    input.search-field {
      width: 100%;
      height: 42px;
      background: var(--paper-warm);
      color: var(--ink);
      border: 1.5px solid var(--ink);
      padding: 6px 36px 6px 14px;
      font-family: var(--mono);
      font-size: 13px;
      outline: none;
      box-shadow: 2px 2px 0px var(--hair);
    }

    input.search-field:focus {
      border-color: var(--red);
      box-shadow: 3px 3px 0px var(--red);
    }

    .search-clear {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: var(--ink);
      color: var(--paper);
      border: none;
      width: 20px;
      height: 20px;
      font-family: var(--mono);
      font-size: 11px;
      cursor: pointer;
      display: none;
      align-items: center;
      justify-content: center;
    }

    /* MAIN CONTAINER */
    .content-container {
      max-width: 1320px;
      margin: 16px auto;
      padding: 0 20px 40px;
    }

    /* GAME DOSSIER CARD */
    .game-dossier {
      background: var(--paper-warm);
      border: 2px solid var(--ink);
      padding: 20px 24px;
      margin-bottom: 24px;
      box-shadow: 4px 5px 0px var(--hair);
      position: relative;
    }

    .game-dossier-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid var(--ink);
      padding-bottom: 8px;
      margin-bottom: 12px;
    }

    .game-number-stamp {
      font-family: var(--mono);
      font-size: 13px;
      font-weight: 700;
      color: var(--red);
      letter-spacing: 0.2em;
    }

    .game-direction-badge {
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 700;
      background: var(--paper-yellow);
      border: 1px solid var(--ink);
      padding: 2px 8px;
      letter-spacing: 0.1em;
    }

    h2.game-title {
      font-family: var(--display);
      font-size: clamp(28px, 4.5vw, 44px);
      font-weight: 600;
      line-height: 1.05;
      color: var(--ink);
      margin-bottom: 12px;
    }

    .meta-dossier-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      background: var(--paper-hi);
      border: 1px solid var(--hair);
      padding: 12px 14px;
      margin: 14px 0;
      font-family: var(--mono);
      font-size: 12px;
    }

    .meta-dossier-grid .item strong {
      display: block;
      color: var(--red);
      font-size: 10px;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      margin-bottom: 2px;
    }

    /* SOVEREIGN QUESTION HEROIC CALLOUT */
    .sovereign-block {
      background: var(--paper-yellow);
      border: 2px solid var(--ink);
      padding: 16px 20px;
      margin: 16px 0;
      box-shadow: 3px 3px 0px var(--ink);
    }

    .sovereign-tag {
      font-family: var(--mono);
      font-size: 10.5px;
      font-weight: 700;
      color: var(--red);
      letter-spacing: 0.22em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .sovereign-question {
      font-family: var(--display);
      font-size: clamp(20px, 3vw, 28px);
      font-style: italic;
      color: var(--ink);
      line-height: 1.25;
      margin-bottom: 10px;
    }

    /* CLASSIFIED LISTINGS GRID */
    .classified-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
      margin-top: 18px;
    }

    .classified-cell {
      background: var(--paper);
      border: 1.5px solid var(--ink);
      padding: 14px 16px;
      box-shadow: 3px 3px 0px var(--hair);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 10px;
    }

    .cell-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--hair);
      padding-bottom: 4px;
    }

    .cell-tag {
      font-family: var(--mono);
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--red);
    }

    .cell-title {
      font-family: var(--display);
      font-size: 18px;
      font-weight: 600;
      color: var(--ink);
      margin: 6px 0 4px;
    }

    .cell-body {
      font-family: var(--serif);
      font-size: 14px;
      line-height: 1.5;
      color: var(--ink);
    }

    .cell-body pre {
      background: var(--paper-warm);
      border: 1px solid var(--ink);
      padding: 8px 10px;
      font-family: var(--mono);
      font-size: 11px;
      white-space: pre-wrap;
      overflow-x: auto;
      margin-top: 6px;
    }

    .cell-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    button.btn-tactile-copy {
      flex: 1;
      height: 36px;
      background: var(--paper-yellow);
      color: var(--ink);
      border: 1px solid var(--ink);
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.12em;
      cursor: pointer;
      box-shadow: 2px 2px 0px var(--ink);
      transition: all 0.1s;
    }

    button.btn-tactile-copy:hover {
      background: var(--paper-hi);
    }

    button.btn-tactile-copy.copied {
      background: var(--ink);
      color: var(--paper-hi);
    }

    button.btn-tactile-read {
      background: var(--paper-hi);
      color: var(--ink);
      border: 1px solid var(--ink);
      padding: 0 12px;
      font-family: var(--mono);
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.12em;
      cursor: pointer;
      box-shadow: 2px 2px 0px var(--hair);
    }

    /* =========================================================
       PRESENTATION DECK ENGINE (PROJECTION-READY IN A PINCH)
       ========================================================= */
    .presentation-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: var(--paper);
      display: none;
      flex-direction: column;
      overflow: hidden;
    }

    .presentation-overlay.active {
      display: flex;
    }

    .pres-header {
      background: var(--ink);
      color: var(--paper-hi);
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--mono);
      font-size: 12px;
      letter-spacing: 0.18em;
    }

    .pres-header .pres-counter {
      color: var(--paper-yellow);
      font-weight: 700;
    }

    .pres-stage {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 60px;
      overflow-y: auto;
      position: relative;
    }

    .slide-card {
      background: var(--paper-warm);
      border: 3px solid var(--ink);
      max-width: 1040px;
      width: 100%;
      min-height: 520px;
      padding: 48px 56px;
      box-shadow: 12px 14px 0px var(--hair);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      animation: fadeInSlide 0.2s ease-out;
    }

    @keyframes fadeInSlide {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .slide-tag {
      font-family: var(--mono);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.24em;
      color: var(--red);
      text-transform: uppercase;
      border-bottom: 2px solid var(--ink);
      padding-bottom: 6px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
    }

    .slide-hero-title {
      font-family: var(--display);
      font-size: clamp(36px, 5.5vw, 64px);
      line-height: 1.05;
      font-weight: 600;
      color: var(--ink);
      margin-bottom: 18px;
    }

    .slide-hero-question {
      font-family: var(--display);
      font-style: italic;
      font-size: clamp(24px, 3.5vw, 36px);
      line-height: 1.25;
      color: var(--red);
      background: var(--paper-yellow);
      padding: 16px 20px;
      border-left: 4px solid var(--ink);
      margin: 16px 0 24px;
    }

    .slide-content-text {
      font-family: var(--serif);
      font-size: clamp(18px, 2.2vw, 24px);
      line-height: 1.6;
      color: var(--ink);
    }

    .slide-content-text pre {
      background: var(--paper-hi);
      border: 1.5px solid var(--ink);
      padding: 18px 22px;
      font-family: var(--mono);
      font-size: clamp(13px, 1.6vw, 16px);
      line-height: 1.5;
      white-space: pre-wrap;
      margin-top: 14px;
    }

    .slide-split-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-top: 16px;
    }

    .slide-col-box {
      background: var(--paper-hi);
      border: 1.5px solid var(--ink);
      padding: 20px;
    }

    .slide-col-box.red-border {
      border-top: 4px solid var(--red);
    }

    .slide-col-box.black-border {
      border-top: 4px solid var(--ink);
    }

    .slide-col-box h4 {
      font-family: var(--mono);
      font-size: 12px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .pres-controls-bar {
      background: var(--paper-hi);
      border-top: 2px solid var(--ink);
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--mono);
      font-size: 12px;
    }

    .pres-nav-buttons {
      display: flex;
      gap: 12px;
    }

    button.btn-pres-nav {
      background: var(--paper-warm);
      border: 1.5px solid var(--ink);
      padding: 8px 18px;
      font-family: var(--mono);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.14em;
      cursor: pointer;
      box-shadow: 2px 2px 0px var(--ink);
    }

    button.btn-pres-nav:hover {
      background: var(--paper-yellow);
    }

    button.btn-pres-nav:active {
      transform: translate(1px, 1px);
      box-shadow: 1px 1px 0px var(--ink);
    }

    /* TOAST NOTIFICATION */
    .toast-box {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(80px);
      background: var(--ink);
      color: var(--paper-hi);
      border: 1px solid var(--paper-yellow);
      font-family: var(--mono);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.14em;
      padding: 10px 20px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.35);
      z-index: 2000;
      opacity: 0;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }

    .toast-box.show {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }

    /* BOTTOM DOCK */
    .bottom-dock {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--ink);
      color: var(--paper-hi);
      padding: 7px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: 0.15em;
      z-index: 75;
      border-top: 1px solid var(--hair);
    }

    .bottom-dock a {
      color: var(--paper-yellow);
      text-decoration: none;
      font-weight: 700;
    }

    /* MODAL DOSSIER VIEWER */
    .modal-dossier-wrap {
      position: fixed;
      inset: 0;
      background: rgba(33, 29, 24, 0.7);
      backdrop-filter: blur(4px);
      z-index: 1200;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-dossier-wrap.open {
      display: flex;
    }

    .modal-dossier-card {
      background: var(--paper-warm);
      border: 3px solid var(--ink);
      max-width: 860px;
      width: 100%;
      max-height: 86vh;
      display: flex;
      flex-direction: column;
      box-shadow: 8px 10px 0px rgba(0,0,0,0.3);
    }

    .modal-dossier-header {
      background: var(--paper-hi);
      border-bottom: 2px solid var(--ink);
      padding: 12px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-dossier-body {
      padding: 20px;
      overflow-y: auto;
      font-family: var(--serif);
      font-size: 15px;
      line-height: 1.6;
    }

    .modal-dossier-body pre {
      background: var(--paper-hi);
      border: 1.5px solid var(--ink);
      padding: 14px;
      font-family: var(--mono);
      font-size: 12px;
      white-space: pre-wrap;
      margin: 12px 0;
    }

    .modal-dossier-footer {
      background: var(--paper-hi);
      border-top: 2px solid var(--ink);
      padding: 10px 18px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
  </style>
</head>
<body>

  <!-- TOP RUNNING BAR -->
  <div class="archival-topbar">
    <div class="topbar-left">
      <a href="index.html" class="edition-badge" style="text-decoration:none; color:inherit; cursor:pointer;" title="Return to WORLDFUL Main Atlas">&larr; WORLDFUL ATLAS</a>
      <span id="topGuideLabel">12 LANGUAGE GAMES DIRECTORY</span>
    </div>
    <div class="topbar-actions">
      <a href="yellow_pages.html" style="font-family:var(--mono); font-size:11px; color:var(--ink-soft); text-decoration:none; margin-right:12px; font-weight:600;">[ CLASSIFIED PROMPTS &nearr; ]</a>
      <button class="btn-pres-toggle" id="btnLaunchPres" title="Hotkey: P or Space">
        [ PRESENTATION MODE ]
      </button>
    </div>
  </div>

  <!-- MASTHEAD BANNER -->
  <header class="header-banner">
    <div class="header-meta-row">
      <div>SERIES: LANGUAGE GAMES OF GENERATIVE SYSTEMS</div>
      <div class="coord">INDEX // TWELVE IDEAL TYPES</div>
    </div>
    <h1 class="header-title">THE LANGUAGE GAMES</h1>
    <div class="header-tick"></div>
    <div class="header-subtitle-row">
      <div class="tagline">"Never ask what the prompt is before asking what game gives those words their force."</div>
      <div>DIRECTION OF FIT // ROLES // TRAPS // SCHEMAS</div>
    </div>
  </header>

  <!-- 12-GAME DIAL SELECTOR -->
  <div class="dial-selector-strip">
    <div class="dial-strip-top">
      <span>DIAL SELECTOR // 12 COMPONENT GAMES</span>
      <span id="activeGameCounter">GAME 01 OF 12</span>
    </div>
    <div class="dial-chips" id="dialChips">
      <!-- Dial buttons injected via JS -->
    </div>
  </div>

  <!-- SEARCH STRIP -->
  <div class="search-strip">
    <div class="search-input-wrap">
      <input type="text" id="searchField" class="search-field" placeholder="Search rules, case studies, traps, lineages, XML schemas..." autocomplete="off">
      <button class="search-clear" id="searchClear">X</button>
    </div>
  </div>

  <!-- MAIN LISTINGS -->
  <main class="content-container" id="contentContainer">
    <!-- Game dossiers injected via JS -->
  </main>

  <!-- MODAL DOSSIER VIEWER -->
  <div class="modal-dossier-wrap" id="modalDossier">
    <div class="modal-dossier-card">
      <div class="modal-dossier-header">
        <div style="font-family:var(--mono); font-size:11px; font-weight:700; color:var(--red);" id="modalDossierTag">CLASSIFIED ARCHIVE</div>
        <button style="background:var(--ink); color:#fff; border:none; padding:4px 8px; font-family:var(--mono); cursor:pointer;" id="modalDossierClose">[ CLOSE ]</button>
      </div>
      <div class="modal-dossier-body" id="modalDossierBody"></div>
      <div class="modal-dossier-footer">
        <button class="btn-tactile-copy" id="btnModalCopyPayload">[ COPY CONTENT ]</button>
      </div>
    </div>
  </div>

  <!-- PRESENTATION MODE OVERLAY (SLIDE ENGINE) -->
  <div class="presentation-overlay" id="presOverlay">
    <div class="pres-header">
      <div>
        <span>WORLDFUL PRESS // PRESENTATION DECK</span>
      </div>
      <div class="pres-counter" id="presSlideCounter">SLIDE 01 / 06</div>
      <div>
        <button style="background:var(--paper-hi); color:var(--ink); border:1px solid var(--ink); padding:4px 10px; font-family:var(--mono); font-size:11px; font-weight:700; cursor:pointer;" id="btnExitPres">[ ESC // EXIT ]</button>
      </div>
    </div>

    <div class="pres-stage" id="presStage">
      <!-- Active slide card injected via JS -->
    </div>

    <div class="pres-controls-bar">
      <div style="font-family:var(--mono); font-size:11px; color:var(--ink-soft);">
        USE KEYS: [ <- PREV ] [ NEXT -> ] [ SPACE ] [ ESC TO CLOSE ]
      </div>
      <div class="pres-nav-buttons">
        <button class="btn-pres-nav" id="btnPresPrev">[ &lt;- PREVIOUS ]</button>
        <button class="btn-pres-nav" id="btnPresNext">[ NEXT -&gt; ]</button>
      </div>
    </div>
  </div>

  <!-- TOAST FEEDBACK -->
  <div class="toast-box" id="toastBox">COPIED TO CLIPBOARD</div>

  <!-- BOTTOM DOCK -->
  <footer class="bottom-dock">
    <div><a href="index.html" style="color:var(--paper-yellow); text-decoration:none; font-weight:700;">[ &larr; WORLDFUL ATLAS ]</a> &bull; WORLDFUL ARCHIVE // LANGUAGE GAMES DECK</div>
    <div>
      <a href="yellow_pages.html" style="color:var(--paper-yellow); text-decoration:none; margin-right:14px; font-weight:700;">[ CLASSIFIED PROMPTS &nearr; ]</a>
      <a href="WAYS TO WRITE/language_games/00_overview_and_switchyard.md">[ OVERVIEW &amp; SWITCHYARD &nearr; ]</a>
    </div>
  </footer>

  <script>
    const GAMES = __JSON_GAMES__;
    let activeGameNum = "__CURRENT_GAME__";
    let isSingleMode = __IS_SINGLE__;
    let searchQuery = "";
    
    // Presentation state
    let presSlides = [];
    let currentSlideIdx = 0;

    // Elements
    const dialChips = document.getElementById("dialChips");
    const contentContainer = document.getElementById("contentContainer");
    const searchField = document.getElementById("searchField");
    const searchClear = document.getElementById("searchClear");
    const topGuideLabel = document.getElementById("topGuideLabel");
    const activeGameCounter = document.getElementById("activeGameCounter");

    // Modal
    const modalDossier = document.getElementById("modalDossier");
    const modalDossierTag = document.getElementById("modalDossierTag");
    const modalDossierBody = document.getElementById("modalDossierBody");
    const modalDossierClose = document.getElementById("modalDossierClose");
    const btnModalCopyPayload = document.getElementById("btnModalCopyPayload");
    let currentPayload = "";

    // Presentation elements
    const btnLaunchPres = document.getElementById("btnLaunchPres");
    const presOverlay = document.getElementById("presOverlay");
    const btnExitPres = document.getElementById("btnExitPres");
    const presSlideCounter = document.getElementById("presSlideCounter");
    const presStage = document.getElementById("presStage");
    const btnPresPrev = document.getElementById("btnPresPrev");
    const btnPresNext = document.getElementById("btnPresNext");
    const toastBox = document.getElementById("toastBox");

    function init() {
      renderDialChips();
      renderContent();
      setupEvents();
      buildPresSlidesForGame(activeGameNum);
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get("mode") === "presentation" || urlParams.get("pres") === "1") {
        enterPresentation();
      }
    }

    function renderDialChips() {
      dialChips.innerHTML = GAMES.map(g => `
        <button class="dial-chip ${g.num === activeGameNum ? 'active' : ''}" data-num="${g.num}">
          [ ${g.num} ] ${g.name}
        </button>
      `).join('');
    }

    function renderContent() {
      const query = searchQuery.trim().toLowerCase();
      let displayed = GAMES;

      if (!isSingleMode && activeGameNum !== "ALL") {
        displayed = GAMES.filter(g => g.num === activeGameNum);
      } else if (isSingleMode) {
        displayed = GAMES.filter(g => g.num === activeGameNum);
      }

      if (query) {
        displayed = displayed.filter(g => {
          return (
            g.name.toLowerCase().includes(query) ||
            g.sovereign_question.toLowerCase().includes(query) ||
            g.trap_name.toLowerCase().includes(query) ||
            g.trap_desc.toLowerCase().includes(query) ||
            g.confirming_case_short.toLowerCase().includes(query) ||
            g.breakdown_case_short.toLowerCase().includes(query) ||
            g.ancestral.toLowerCase().includes(query) ||
            g.sec5_program.toLowerCase().includes(query) ||
            g.sec6_human.toLowerCase().includes(query)
          );
        });
      }

      if (displayed.length === 0) {
        contentContainer.innerHTML = `
          <div style="background:var(--paper-warm); border:2px dashed var(--ink); padding:40px; text-align:center;">
            <h3 style="font-family:var(--display); font-size:24px;">NO ARCHIVAL RECORDS MATCHED</h3>
            <p style="font-family:var(--mono); font-size:12px; margin-top:8px;">Search query: "${searchQuery}"</p>
          </div>
        `;
        return;
      }

      if (displayed.length === 1) {
        const g = displayed[0];
        topGuideLabel.textContent = `${g.num} // ${g.name} [ FIT: ${g.direction_of_fit.toUpperCase()} ]`;
        activeGameCounter.textContent = `GAME ${g.num} OF 12 // ${g.name}`;
      } else {
        topGuideLabel.textContent = `TWELVE LANGUAGE GAMES // ARCHIVE`;
        activeGameCounter.textContent = `${displayed.length} GAMES LISTED`;
      }

      contentContainer.innerHTML = displayed.map(g => `
        <article class="game-dossier" id="dossier-${g.num}">
          <div class="game-dossier-header">
            <span class="game-number-stamp">[ GAME ${g.num} ]</span>
            <span class="game-direction-badge">DIRECTION OF FIT: ${g.direction_of_fit}</span>
          </div>

          <h2 class="game-title">${g.title}</h2>

          <div class="meta-dossier-grid">
            <div class="item">
              <strong>Human Role</strong>
              ${g.human_role}
            </div>
            <div class="item">
              <strong>Machine Role</strong>
              ${g.machine_role}
            </div>
            <div class="item">
              <strong>Ancestral Descent</strong>
              ${g.ancestral}
            </div>
            <div class="item">
              <strong>Lineage Coordinates</strong>
              ${g.lineage_tags}
            </div>
          </div>

          <!-- SOVEREIGN QUESTION CALLOUT -->
          <div class="sovereign-block">
            <div class="sovereign-tag">// THE SOVEREIGN QUESTION [ INVARIANT ]</div>
            <div class="sovereign-question">"${g.sovereign_question}"</div>
            <div>
              <button class="btn-tactile-copy" onclick="copySnippet('${escapeJs(g.sovereign_question)}', 'SOVEREIGN QUESTION', this)">
                [ COPY SOVEREIGN QUESTION ]
              </button>
            </div>
          </div>

          <!-- CLASSIFIED LISTINGS -->
          <div class="classified-grid">
            
            <!-- 1. CONTRACT -->
            <div class="classified-cell">
              <div>
                <div class="cell-top">
                  <span class="cell-tag">CLASSIFIED 01</span>
                  <span style="font-family:var(--mono); font-size:10px;">CONTRACT</span>
                </div>
                <div class="cell-title">Operational Contract</div>
                <div class="cell-body">
                  - <strong>Direction of fit:</strong> ${g.direction_of_fit}<br>
                  - <strong>Valid move:</strong> Directive / Rule<br>
                  - <strong>Success:</strong> State matches specification.
                </div>
              </div>
              <div class="cell-actions">
                <button class="btn-tactile-copy" onclick="copySnippet('${escapeJs(g.sec2_spec.slice(0, 450))}', 'CONTRACT', this)">[ COPY CONTRACT ]</button>
                <button class="btn-tactile-read" onclick="openModal('OPERATIONAL CONTRACT // ${g.name}', '${escapeJs(g.sec2_spec)}', 'SPECIFICATION')">[ VIEW ]</button>
              </div>
            </div>

            <!-- 2. TRAP -->
            <div class="classified-cell">
              <div>
                <div class="cell-top">
                  <span class="cell-tag" style="color:var(--red-deep);">CLASSIFIED 02</span>
                  <span style="font-family:var(--mono); font-size:10px; color:var(--red);">TRAP</span>
                </div>
                <div class="cell-title">${g.trap_name}</div>
                <div class="cell-body">
                  ${g.trap_desc}<br><br>
                  <strong>Counter-move:</strong> ${g.counter_framing_name}
                </div>
              </div>
              <div class="cell-actions">
                <button class="btn-tactile-copy" onclick="copySnippet('${escapeJs(g.counter_framing_desc)}', 'COUNTER-MOVE', this)">[ COPY COUNTER-MOVE ]</button>
                <button class="btn-tactile-read" onclick="openModal('TRAP & COUNTER-FRAMING // ${g.name}', '${escapeJs(g.trap_name + '\\n\\n' + g.trap_desc + '\\n\\nCOUNTER-FRAMING: ' + g.counter_framing_name + '\\n\\n' + g.counter_framing_desc)}', 'DEFENSE')">[ VIEW ]</button>
              </div>
            </div>

            <!-- 3. PRECEDENT -->
            <div class="classified-cell">
              <div>
                <div class="cell-top">
                  <span class="cell-tag">CLASSIFIED 03</span>
                  <span style="font-family:var(--mono); font-size:10px;">PRECEDENT</span>
                </div>
                <div class="cell-title">Confirming Case Study</div>
                <div class="cell-body">
                  ${g.confirming_case_short}
                </div>
              </div>
              <div class="cell-actions">
                <button class="btn-tactile-copy" onclick="copySnippet('${escapeJs(g.confirming_case_short)}', 'CONFIRMING CASE', this)">[ COPY CASE ]</button>
                <button class="btn-tactile-read" onclick="openModal('CONFIRMING PRECEDENT // ${g.name}', '${escapeJs(g.sec1_card)}', 'CASE STUDY')">[ VIEW ]</button>
              </div>
            </div>

            <!-- 4. BREAKDOWN -->
            <div class="classified-cell">
              <div>
                <div class="cell-top">
                  <span class="cell-tag" style="color:var(--red-deep);">CLASSIFIED 04</span>
                  <span style="font-family:var(--mono); font-size:10px; color:var(--red);">FAILURE</span>
                </div>
                <div class="cell-title">Breakdown Catastrophe</div>
                <div class="cell-body">
                  ${g.breakdown_case_short}
                </div>
              </div>
              <div class="cell-actions">
                <button class="btn-tactile-copy" onclick="copySnippet('${escapeJs(g.breakdown_case_short)}', 'BREAKDOWN CASE', this)">[ COPY FAILURE ]</button>
                <button class="btn-tactile-read" onclick="openModal('BREAKDOWN CATASTROPHE // ${g.name}', '${escapeJs(g.sec1_card)}', 'FAILURE RECORD')">[ VIEW ]</button>
              </div>
            </div>

            <!-- 5. ANCESTRAL FORMALISMS -->
            <div class="classified-cell">
              <div>
                <div class="cell-top">
                  <span class="cell-tag">CLASSIFIED 05</span>
                  <span style="font-family:var(--mono); font-size:10px;">LINEAGE</span>
                </div>
                <div class="cell-title">Ancestral Formalisms</div>
                <div class="cell-body">
                  ${g.ancestral}<br>
                  <pre><code>${g.lineage_tags}</code></pre>
                </div>
              </div>
              <div class="cell-actions">
                <button class="btn-tactile-copy" onclick="copySnippet('${escapeJs(g.sec3_lineage)}', 'LINEAGE TRACE', this)">[ COPY LINEAGE ]</button>
                <button class="btn-tactile-read" onclick="openModal('ANCESTRAL FORMALISMS // ${g.name}', '${escapeJs(g.sec3_lineage)}', 'GENEALOGY')">[ VIEW ]</button>
              </div>
            </div>

            <!-- 6. PROGRAM XML SCAFFOLD -->
            <div class="classified-cell">
              <div>
                <div class="cell-top">
                  <span class="cell-tag">CLASSIFIED 06</span>
                  <span style="font-family:var(--mono); font-size:10px;">PROGRAM</span>
                </div>
                <div class="cell-title">Declarative XML Scaffold</div>
                <div class="cell-body">
                  <pre><code>${escapeHtml(g.xml_schema || '<language-game id=\"' + g.slug + '\">\\n  <!-- Declarative Scaffold -->\\n</language-game>')}</code></pre>
                </div>
              </div>
              <div class="cell-actions">
                <button class="btn-tactile-copy" onclick="copySnippet('${escapeJs(g.xml_schema || g.sec5_program)}', 'XML SCAFFOLD', this)">[ COPY SCHEMA ]</button>
                <button class="btn-tactile-read" onclick="openModal('THEORY OF THE PROGRAM // ${g.name}', '${escapeJs(g.sec5_program)}', 'XML GRAMMAR')">[ VIEW ]</button>
              </div>
            </div>

            <!-- 7. RESIDUAL HUMAN ELEMENT -->
            <div class="classified-cell">
              <div>
                <div class="cell-top">
                  <span class="cell-tag">CLASSIFIED 07</span>
                  <span style="font-family:var(--mono); font-size:10px;">HUMAN STAKES</span>
                </div>
                <div class="cell-title">Residual Human Refusal</div>
                <div class="cell-body">
                  ${g.human_snippet.slice(0, 180)}...
                </div>
              </div>
              <div class="cell-actions">
                <button class="btn-tactile-copy" onclick="copySnippet('${escapeJs(g.sec6_human)}', 'HUMAN STAKES', this)">[ COPY STAKES ]</button>
                <button class="btn-tactile-read" onclick="openModal('RESIDUAL HUMAN THEORY // ${g.name}', '${escapeJs(g.sec6_human)}', 'HUMAN REFUSAL')">[ VIEW ]</button>
              </div>
            </div>

            <!-- 8. SWITCHYARD DRIFT TRIGGER -->
            <div class="classified-cell">
              <div>
                <div class="cell-top">
                  <span class="cell-tag">CLASSIFIED 08</span>
                  <span style="font-family:var(--mono); font-size:10px;">DRIFT ROUTING</span>
                </div>
                <div class="cell-title">Switchyard Track Change</div>
                <div class="cell-body">
                  <strong>Drift Trigger:</strong> ${g.drift_trigger}<br><br>
                  ${g.fun_snippet.slice(0, 140)}...
                </div>
              </div>
              <div class="cell-actions">
                <button class="btn-tactile-copy" onclick="copySnippet('${escapeJs(g.drift_trigger)}', 'DRIFT TRIGGER', this)">[ COPY DRIFT ]</button>
                <button class="btn-tactile-read" onclick="openModal('SWITCHYARD DRIFT // ${g.name}', '${escapeJs(g.sec7_fun)}', 'DRIFT DYNAMICS')">[ VIEW ]</button>
              </div>
            </div>

          </div>
        </article>
      `).join('');
    }

    /* =========================================================
       BUILD PRESENTATION SLIDES
       ========================================================= */
    function buildPresSlidesForGame(gameNum) {
      const g = GAMES.find(item => item.num === gameNum) || GAMES[0];
      presSlides = [
        {
          tag: `GAME ${g.num} // SLIDE 01 // OVERVIEW`,
          title: g.title,
          heroQuestion: `"${g.sovereign_question}"`,
          bodyHtml: `
            <div style="font-family:var(--mono); font-size:14px; margin-top:12px;">
              <strong>DIRECTION OF FIT:</strong> ${g.direction_of_fit}<br>
              <strong>HUMAN ROLE:</strong> ${g.human_role} // <strong>MACHINE ROLE:</strong> ${g.machine_role}<br>
              <strong>ANCESTRAL LINEAGE:</strong> ${g.ancestral}
            </div>
          `
        },
        {
          tag: `GAME ${g.num} // SLIDE 02 // THE OPERATIONAL CONTRACT`,
          title: `Operational Contract & Invariants`,
          heroQuestion: `Who authorized this move?`,
          bodyHtml: `
            <div class="slide-content-text">
              ${escapeHtml(g.sec2_spec.slice(0, 650))}...
            </div>
          `
        },
        {
          tag: `GAME ${g.num} // SLIDE 03 // THE CHARACTERISTIC TRAP`,
          title: g.trap_name,
          heroQuestion: `Counter-Move: ${g.counter_framing_name}`,
          bodyHtml: `
            <div class="slide-split-row">
              <div class="slide-col-box red-border">
                <h4 style="color:var(--red);">The Failure Trap</h4>
                <p style="font-size:16px;">${g.trap_desc}</p>
              </div>
              <div class="slide-col-box black-border">
                <h4>Counter-Framing Strategy</h4>
                <p style="font-size:16px;">${g.counter_framing_desc}</p>
              </div>
            </div>
          `
        },
        {
          tag: `GAME ${g.num} // SLIDE 04 // EMPIRICAL PRECEDENT VS BREAKDOWN`,
          title: `Precedent vs. Catastrophe`,
          heroQuestion: `Theory Tested Against World Friction`,
          bodyHtml: `
            <div class="slide-split-row">
              <div class="slide-col-box black-border">
                <h4>Confirming Precedent</h4>
                <p style="font-size:15px;">${g.confirming_case_short}</p>
              </div>
              <div class="slide-col-box red-border">
                <h4 style="color:var(--red);">Breakdown Catastrophe</h4>
                <p style="font-size:15px;">${g.breakdown_case_short}</p>
              </div>
            </div>
          `
        },
        {
          tag: `GAME ${g.num} // SLIDE 05 // THEORY OF THE PROGRAM`,
          title: `Declarative XML Grammar`,
          heroQuestion: `The Invariant Runtime Schema`,
          bodyHtml: `
            <div class="slide-content-text">
              <pre><code>${escapeHtml(g.xml_schema || '<language-game id=\"' + g.slug + '\">\\n  <!-- Declarative Grammar -->\\n</language-game>')}</code></pre>
            </div>
          `
        },
        {
          tag: `GAME ${g.num} // SLIDE 06 // RESIDUAL HUMAN STANCE & DRIFT`,
          title: `Residual Stakes & Switchyard Drift`,
          heroQuestion: `Drift Trigger: ${g.drift_trigger}`,
          bodyHtml: `
            <div class="slide-content-text" style="font-size:18px;">
              <p>${g.human_snippet}</p>
            </div>
          `
        }
      ];
      currentSlideIdx = 0;
      renderCurrentSlide();
    }

    function renderCurrentSlide() {
      const slide = presSlides[currentSlideIdx];
      if (!slide) return;

      presSlideCounter.textContent = `SLIDE ${String(currentSlideIdx + 1).padStart(2, '0')} / ${String(presSlides.length).padStart(2, '0')}`;

      presStage.innerHTML = `
        <div class="slide-card">
          <div>
            <div class="slide-tag">
              <span>${slide.tag}</span>
              <span>WORLDFUL PRESS</span>
            </div>
            <h2 class="slide-hero-title">${slide.title}</h2>
            ${slide.heroQuestion ? `<div class="slide-hero-question">${slide.heroQuestion}</div>` : ''}
            <div style="margin-top:16px;">${slide.bodyHtml}</div>
          </div>
          <div style="border-top:1px solid var(--hair); padding-top:12px; margin-top:20px; display:flex; justify-content:space-between; font-family:var(--mono); font-size:11px; color:var(--ink-soft);">
            <span>KEYBOARD: [ <- PREV ] [ NEXT -> ] [ SPACE ]</span>
            <span>PRESS [ ESC ] TO RETURN TO DIRECTORY</span>
          </div>
        </div>
      `;
    }

    function nextSlide() {
      if (currentSlideIdx < presSlides.length - 1) {
        currentSlideIdx++;
        renderCurrentSlide();
      }
    }

    function prevSlide() {
      if (currentSlideIdx > 0) {
        currentSlideIdx--;
        renderCurrentSlide();
      }
    }

    function enterPresentation() {
      buildPresSlidesForGame(activeGameNum);
      presOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }

    function exitPresentation() {
      presOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }

    function showToast(msg) {
      toastBox.textContent = msg;
      toastBox.classList.add("show");
      if (navigator.vibrate) navigator.vibrate(30);
      setTimeout(() => {
        toastBox.classList.remove("show");
      }, 1400);
    }

    function copySnippet(text, label, btn) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          handleCopySuccess(label, btn);
        }).catch(() => {
          fallbackCopy(text, () => handleCopySuccess(label, btn));
        });
      } else {
        fallbackCopy(text, () => handleCopySuccess(label, btn));
      }
    }

    function handleCopySuccess(label, btn) {
      if (btn) {
        const orig = btn.textContent;
        btn.classList.add("copied");
        btn.textContent = "[ COPIED ]";
        setTimeout(() => {
          btn.classList.remove("copied");
          btn.textContent = orig;
        }, 1400);
      }
      showToast(`${label} COPIED`);
    }

    function fallbackCopy(text, onSuccess) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        if (onSuccess) onSuccess();
      } catch (err) {}
      document.body.removeChild(ta);
    }

    function openModal(title, content, tag) {
      modalDossierTag.textContent = tag || "CLASSIFIED";
      currentPayload = content;
      modalDossierBody.innerHTML = `
        <h3 style="font-family:var(--display); font-size:24px; margin-bottom:12px;">${title}</h3>
        <pre><code>${escapeHtml(content)}</code></pre>
      `;
      modalDossier.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      modalDossier.classList.remove("open");
      document.body.style.overflow = "";
    }

    function escapeHtml(str) {
      return (str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function escapeJs(str) {
      return (str || "")
        .replace(/\\\\/g, "\\\\\\\\")
        .replace(/'/g, "\\\\'")
        .replace(/\\"/g, '\\\\"')
        .replace(/\\n/g, "\\\\n")
        .replace(/\\r/g, "");
    }

    function setupEvents() {
      dialChips.addEventListener("click", (e) => {
        const chip = e.target.closest(".dial-chip");
        if (!chip) return;
        document.querySelectorAll(".dial-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        activeGameNum = chip.getAttribute("data-num");
        renderContent();
        buildPresSlidesForGame(activeGameNum);
        window.scrollTo({ top: 0, behavior: "smooth" });
      });

      searchField.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        searchClear.style.display = searchQuery ? "flex" : "none";
        renderContent();
      });

      searchClear.addEventListener("click", () => {
        searchField.value = "";
        searchQuery = "";
        searchClear.style.display = "none";
        renderContent();
        searchField.focus();
      });

      btnLaunchPres.addEventListener("click", enterPresentation);
      btnExitPres.addEventListener("click", exitPresentation);
      btnPresPrev.addEventListener("click", prevSlide);
      btnPresNext.addEventListener("click", nextSlide);

      modalDossierClose.addEventListener("click", closeModal);
      modalDossier.addEventListener("click", (e) => {
        if (e.target === modalDossier) closeModal();
      });

      btnModalCopyPayload.addEventListener("click", () => {
        copySnippet(currentPayload, "RECORD", btnModalCopyPayload);
      });

      window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          if (presOverlay.classList.contains("active")) exitPresentation();
          if (modalDossier.classList.contains("open")) closeModal();
        }
        if (e.key === "p" || e.key === "P") {
          if (!modalDossier.classList.contains("open") && document.activeElement !== searchField) {
            if (presOverlay.classList.contains("active")) exitPresentation();
            else enterPresentation();
          }
        }
        if (presOverlay.classList.contains("active")) {
          if (e.key === "ArrowRight" || e.key === " ") {
            e.preventDefault();
            nextSlide();
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            prevSlide();
          }
        }
      });
    }

    init();
  </script>
</body>
</html>
"""

def generate_page(game_num="01", is_single=False):
    json_games = json.dumps(parsed_games)
    out = template_html.replace("__JSON_GAMES__", json_games)
    out = out.replace("__CURRENT_GAME__", game_num)
    out = out.replace("__IS_SINGLE__", str(is_single).lower())
    return out

# 1. Master files
master_code = generate_page("01", False)
with open(output_master_html, "w", encoding="utf-8") as f:
    f.write(master_code)
with open(output_root_html, "w", encoding="utf-8") as f:
    f.write(master_code)
print(f"Wrote master {output_master_html} ({len(master_code)} bytes)")

# 2. Standalone files in language_games and root
for g in parsed_games:
    single_code = generate_page(g["num"], True)
    
    p1 = os.path.join(games_dir, f"{g['num']}_{g['slug']}_yellow_pages.html")
    with open(p1, "w", encoding="utf-8") as f:
        f.write(single_code)
        
    p2 = f"/Users/gaia/WORLDFUL/{g['num']}_{g['slug']}.html"
    with open(p2, "w", encoding="utf-8") as f:
        f.write(single_code)
        
    print(f"Generated: {p1} and {p2}")

print("Successfully compiled all 12 Language Game Yellow Pages!")
