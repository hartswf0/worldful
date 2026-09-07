import os
import sys
import json
import re
import markdown

sys.path.append(os.path.dirname(__file__))
import completed_contractors_data as cdata

base_dir = "/Users/gaia/WORLDFUL"
games_dir = os.path.join(base_dir, "WAYS TO WRITE/language_games")

print("Rebuilding presentation.html with complete prompts, field test verifications, and zero emojis...")

# Extract game sections
def parse_game_sections(md_path):
    with open(md_path, 'r') as f:
        content = f.read()

    def get_section(title_pattern):
        m = re.search(r"## SECTION \d+: " + title_pattern + r"\n+(.*?)(?=\n## SECTION|\Z)", content, re.DOTALL)
        return m.group(1).strip() if m else ""

    sec1 = get_section(r"THE EMPIRICAL CARD.*")
    sec2 = get_section(r"THE CORE GAME SPECIFICATION.*")
    sec3 = get_section(r"ANCESTRAL LINEAGE.*")
    sec4 = get_section(r"FORMAL ECHO.*")
    sec5 = get_section(r"THEORY OF THE PROGRAM.*")
    sec6 = get_section(r"THE RESIDUAL HUMAN STAKE.*")
    sec7 = get_section(r"THE TWELVE GAMES COMPARATIVE MATRIX.*")
    return sec1, sec2, sec3, sec4, sec5, sec6, sec7

def md_to_html(md_text):
    return markdown.markdown(md_text, extensions=['extra', 'codehilite', 'tables'])

# Deck 00: Deep Play Keynote Deck
keynote_deck_00 = [
    {
        "slide_num": 1,
        "title": "DEEP PLAY AT THE APERTURE",
        "subtitle": "Large Language Games and the Operative Humanities",
        "type": "title",
        "content": """
            <div class="pres-plate-tag">[ MONOGRAPH KEYNOTE // WF-2026-DP ]</div>
            <h1 class="pres-title">Deep Play at the Aperture</h1>
            <div class="pres-subtitle">Large Language Games and the Operative Humanities</div>
            <div class="pres-meta-grid">
                <div class="pres-meta-cell">
                    <span class="label">AUTHOR</span>
                    <span class="val">Watson Hartsoe</span>
                </div>
                <div class="pres-meta-cell">
                    <span class="label">DATE</span>
                    <span class="val">September 7, 2026</span>
                </div>
                <div class="pres-meta-cell">
                    <span class="label">CORPUS</span>
                    <span class="val">elsewhere Research Portfolio</span>
                </div>
                <div class="pres-meta-cell">
                    <span class="label">PRIMARY THEOREM</span>
                    <span class="val">R = f(u, c, g) &mdash; The Game Governs Force</span>
                </div>
            </div>
        """
    },
    {
        "slide_num": 2,
        "title": "THE APERTURE ERROR",
        "subtitle": "One Rectangle, Twelve Incompatible Institutions",
        "type": "split",
        "content": """
            <div class="pres-split-grid">
                <div class="pres-col">
                    <div class="pres-section-label">THE GRAMMATICAL FALLACY</div>
                    <div class="pres-hero-quote">&ldquo;Draw a circle.&rdquo;</div>
                    <p class="pres-body-text">
                        A client commissioning an image. A programmer testing an agent. A researcher probing geometry.
                        An artist offering an open score. A teacher issuing an instruction. A performer making a timed move.
                    </p>
                    <p class="pres-body-text" style="color:var(--red); font-weight:700;">
                        The surface string is stable while the institution around it changes.
                    </p>
                </div>
                <div class="pres-col highlight-col">
                    <div class="pres-section-label">THE MATHEMATICAL FORMULATION</div>
                    <div class="pres-formula-box">
                        <div class="formula-line">Naive Model: R = f(u, c)</div>
                        <div class="formula-line active">Operative Reality: R = f(u, c, g)</div>
                    </div>
                    <p class="pres-body-text" style="margin-top: 14px;">
                        The universal chat box conceals <strong>g</strong> (the operative game).
                        The system is asked to infer the social, evidentiary, and architectural rules of the game from the prompt string alone.
                    </p>
                </div>
            </div>
        """
    },
    {
        "slide_num": 3,
        "title": "THE TWELVE IDEAL TYPES",
        "subtitle": "Diagnostic Exaggerations of Illocutionary Force",
        "type": "matrix",
        "content": """
            <div class="pres-twelve-grid">
                <div class="pres-game-pill"><span class="num">01</span><span class="name">INSTRUCTION</span><span class="sub">world &rarr; word</span></div>
                <div class="pres-game-pill"><span class="num">02</span><span class="name">SCORE</span><span class="sub">open realization</span></div>
                <div class="pres-game-pill"><span class="num">03</span><span class="name">PROGRAM</span><span class="sub">virtual machine</span></div>
                <div class="pres-game-pill"><span class="num">04</span><span class="name">PLAN</span><span class="sub">temporal action</span></div>
                <div class="pres-game-pill"><span class="num">05</span><span class="name">QUERY</span><span class="sub">provenance &amp; truth</span></div>
                <div class="pres-game-pill"><span class="num">06</span><span class="name">PROBE</span><span class="sub">epistemic boundary</span></div>
                <div class="pres-game-pill"><span class="num">07</span><span class="name">GESTURE</span><span class="sub">deictic coordinate</span></div>
                <div class="pres-game-pill"><span class="num">08</span><span class="name">COMMISSION</span><span class="sub">provenance &amp; taste</span></div>
                <div class="pres-game-pill"><span class="num">09</span><span class="name">CONVERSATION</span><span class="sub">turn-taking repair</span></div>
                <div class="pres-game-pill"><span class="num">10</span><span class="name">EDIT</span><span class="sub">delta conservation</span></div>
                <div class="pres-game-pill"><span class="num">11</span><span class="name">CONSTRAINT</span><span class="sub">negative capability</span></div>
                <div class="pres-game-pill"><span class="num">12</span><span class="name">PERFORMANCE</span><span class="sub">timed live witness</span></div>
            </div>
            <div class="pres-footer-note">
                Max Weber: Ideal types are deliberately one-sided diagnostic benchmarks to reveal when the same interface hosts incompatible criteria of success.
            </div>
        """
    },
    {
        "slide_num": 4,
        "title": "SIX BUILT CASES",
        "subtitle": "The elsewhere Research Portfolio (Hartsoe 2026)",
        "type": "grid",
        "content": """
            <div class="pres-six-cases-grid">
                <div class="pres-mini-case">
                    <div class="case-num">01</div>
                    <div class="case-name">LDRAW LEGO ARCHITECTURE</div>
                    <div class="case-desc">Spatial &amp; physical resistance. Plastic bricks refuse fluent rhetorical hallucination.</div>
                </div>
                <div class="pres-mini-case">
                    <div class="case-num">02</div>
                    <div class="case-name">LEGOS NARRATIVE STATE</div>
                    <div class="case-desc">The Blueberry Test. External graph state stores prevent sequential world drift.</div>
                </div>
                <div class="pres-mini-case">
                    <div class="case-num">03</div>
                    <div class="case-name">CENTAUR BOX MULTI-AGENT</div>
                    <div class="case-desc">Strategy before speech. Multi-agent dialogue with hidden planning and CA repair.</div>
                </div>
                <div class="pres-mini-case">
                    <div class="case-num">04</div>
                    <div class="case-name">CINEPROMPT PROCEDURAL FILM</div>
                    <div class="case-desc">Operative ekphrasis with Jay David Bolter. Description as real-time control surface.</div>
                </div>
                <div class="pres-mini-case">
                    <div class="case-num">05</div>
                    <div class="case-name">GROWING ENTANGLEMENTS</div>
                    <div class="case-desc">Aphoristic social models and agent-based historical simulation.</div>
                </div>
                <div class="pres-mini-case">
                    <div class="case-num">06</div>
                    <div class="case-name">THE MACHINERY OF MEANING</div>
                    <div class="case-desc">Procedural film engine exposing its own running state in real time.</div>
                </div>
            </div>
        """
    },
    {
        "slide_num": 5,
        "title": "THE OPERATIVE HUMANITIES",
        "subtitle": "Humanistic Critique Meeting Technical Execution Conditions",
        "type": "contrast",
        "content": """
            <div class="pres-split-grid">
                <div class="pres-col">
                    <div class="pres-section-label">ARMCHAIR CRITIQUE &amp; TECHNO-EUPHORIA</div>
                    <div class="pres-critique-box">
                        <strong>Techno-Enthusiasm:</strong> Accepts system claims at face value, celebrating statistical fluency without examining underlying epistemic fragility.
                    </div>
                    <div class="pres-critique-box" style="margin-top:14px;">
                        <strong>Armchair Cynicism:</strong> Dismisses computational media from a distance without understanding the technical architectures and failure modes.
                    </div>
                </div>
                <div class="pres-col highlight-col">
                    <div class="pres-section-label">THE OPERATIVE STANCE</div>
                    <div class="pres-manifesto-text">
                        The operative humanist <strong>builds the apparatus</strong>.
                        We construct the LDraw pipeline, the narrative graph, the conversational planner, and the procedural film engine.
                    </div>
                    <p class="pres-body-text" style="margin-top: 14px;">
                        The computer becomes an empirical hermeneutic instrument where theories of intention, authority, reference, and agency are tested against computational reality.
                    </p>
                </div>
            </div>
        """
    },
    {
        "slide_num": 6,
        "title": "THE GAME IN MOTION",
        "subtitle": "Infrastructure for Consequence",
        "type": "summary",
        "content": """
            <div class="pres-conclusion-box">
                <div class="pres-section-label">CENTRAL DISCIPLINARY FINDING</div>
                <div class="pres-hero-quote" style="font-size: 1.5rem; line-height: 1.4;">
                    &ldquo;Language games require infrastructure. A world needs state. A query needs evidence. An edit needs a delta. A constraint needs enforcement. A conversation needs sequence. A commission needs provenance. A probe needs controls. An instruction needs authority.&rdquo;
                </div>
                <p class="pres-body-text" style="margin-top: 18px;">
                    The fundamental unit of analysis is not the isolated prompt string. It is <strong>the language game in motion</strong>: words, roles, rules, state, apparatus, consequence, and the human capacity to say that the game has changed.
                </p>
                <div style="margin-top: 24px; display:flex; gap:16px;">
                    <a href="deep_play_at_the_aperture.html" class="btn-pres-step" style="text-decoration:none;">[ READ FULL MONOGRAPH ]</a>
                    <button class="btn-pres-step" onclick="selectGame('01')">[ EXPLORE GAME 01: INSTRUCTION &rarr; ]</button>
                </div>
            </div>
        """
    }
]

# Build Game Data Objects
games_data = []
all_prompts_store = {}

for i in range(1, 13):
    num = f"{i:02d}"
    meta = cdata.CONTRACTORS_CONFIG[num]
    name = meta['name']
    md_path = os.path.join(games_dir, f"{num}_{name.lower()}.md")
    sec1, sec2, sec3, sec4, sec5, sec6, sec7 = parse_game_sections(md_path)

    # Format contractors
    formatted_contractors = []
    for c in meta['contractors']:
        full_payload = cdata.build_completed_prompt_payload(c, num, name)
        all_prompts_store[f"{num}_{c['num']}"] = full_payload
        formatted_contractors.append({
            "num": c["num"],
            "name": c["name"],
            "role": c["role"],
            "defect": c["defect"],
            "work_order": c["work_order"],
            "test_input": c["test_input"],
            "test_trace": c["test_trace"],
            "test_output": c["test_output"],
            "completed_prompt": full_payload
        })

    # Slides for this game
    slides = [
        {
            "slide_num": 1,
            "title": f"GAME {num} // {name}",
            "subtitle": f"{meta['latin']} &mdash; {meta['subtitle']}",
            "type": "title",
            "content": f"""
                <div class="pres-plate-tag">[ GAME {num} // OPERATIVE THOUGHT CONTAINER ]</div>
                <h1 class="pres-title">{name}</h1>
                <div class="pres-subtitle">{meta['latin']} &mdash; {meta['subtitle']}</div>
                <div class="pres-formula-box" style="margin:20px 0;">
                    <div class="formula-line active">{meta['formula']}</div>
                </div>
                <div class="pres-meta-grid">
                    <div class="pres-meta-cell">
                        <span class="label">HUMAN ROLE</span>
                        <span class="val">{meta['human_role']}</span>
                    </div>
                    <div class="pres-meta-cell">
                        <span class="label">MACHINE ROLE</span>
                        <span class="val">{meta['machine_role']}</span>
                    </div>
                    <div class="pres-meta-cell">
                        <span class="label">VALID MOVE</span>
                        <span class="val">{meta['valid_move']}</span>
                    </div>
                    <div class="pres-meta-cell">
                        <span class="label">SUCCESS CONDITION</span>
                        <span class="val">{meta['success_condition']}</span>
                    </div>
                </div>
            """
        },
        {
            "slide_num": 2,
            "title": "THE EMPIRICAL CARD",
            "subtitle": "Confirming Case vs Catastrophic Breakdown",
            "type": "split",
            "content": f"""
                <div class="pres-split-grid">
                    <div class="pres-col">
                        <div class="pres-section-label">CONFIRMING CASE</div>
                        <div class="pres-card-box">
                            {sec1[:550]}...
                        </div>
                    </div>
                    <div class="pres-col highlight-col">
                        <div class="pres-section-label">CATASTROPHIC BREAKDOWN</div>
                        <div class="pres-critique-box" style="border-left: 3px solid var(--red);">
                            <strong>FATAL TRAP: {meta['fatal_trap']}</strong><br><br>
                            {meta['contractors'][0]['test_input']}
                        </div>
                        <div class="pres-card-meta" style="margin-top:10px;">Sovereign Question: <strong>&ldquo;{meta['sovereign_question']}&rdquo;</strong></div>
                    </div>
                </div>
            """
        },
        {
            "slide_num": 3,
            "title": "ANCESTRAL LINEAGE & INVARIANT",
            "subtitle": "Historical Migration and Generative Rupture",
            "type": "prose",
            "content": f"""
                <div class="pres-lineage-container">
                    <div class="pres-section-label">INHERITED INVARIANT &amp; MIGRATION</div>
                    <div class="pres-lineage-body">
                        {md_to_html(sec3[:1100])}
                    </div>
                </div>
            """
        },
        {
            "slide_num": 4,
            "title": "THE CONTRACTOR GUILD",
            "subtitle": "Hired System Instructions from the 136 Canon",
            "type": "contractors",
            "content": f"""
                <div class="pres-contractors-grid">
                    <div class="pres-contractor-card">
                        <div class="pres-contractor-top">
                            <span class="pres-prompt-badge">PROMPT {meta['contractors'][0]['num']}</span>
                            <span class="pres-contractor-role">{meta['contractors'][0]['role']}</span>
                        </div>
                        <div class="pres-contractor-name">{meta['contractors'][0]['name']}</div>
                        <div class="pres-contractor-defect"><strong>TARGET DEFECT:</strong> {meta['contractors'][0]['defect']}</div>
                        <div class="pres-contractor-order"><strong>WORK ORDER:</strong> {meta['contractors'][0]['work_order']}</div>
                    </div>
                    <div class="pres-contractor-card">
                        <div class="pres-contractor-top">
                            <span class="pres-prompt-badge">PROMPT {meta['contractors'][1]['num']}</span>
                            <span class="pres-contractor-role">{meta['contractors'][1]['role']}</span>
                        </div>
                        <div class="pres-contractor-name">{meta['contractors'][1]['name']}</div>
                        <div class="pres-contractor-defect"><strong>TARGET DEFECT:</strong> {meta['contractors'][1]['defect']}</div>
                        <div class="pres-contractor-order"><strong>WORK ORDER:</strong> {meta['contractors'][1]['work_order']}</div>
                    </div>
                    <div class="pres-contractor-card">
                        <div class="pres-contractor-top">
                            <span class="pres-prompt-badge">PROMPT {meta['contractors'][2]['num']}</span>
                            <span class="pres-contractor-role">{meta['contractors'][2]['role']}</span>
                        </div>
                        <div class="pres-contractor-name">{meta['contractors'][2]['name']}</div>
                        <div class="pres-contractor-defect"><strong>TARGET DEFECT:</strong> {meta['contractors'][2]['defect']}</div>
                        <div class="pres-contractor-order"><strong>WORK ORDER:</strong> {meta['contractors'][2]['work_order']}</div>
                    </div>
                </div>
            """
        },
        {
            "slide_num": 5,
            "title": "COMPLETED CONTRACTOR WORK ORDER",
            "subtitle": f"Prompt {meta['contractors'][0]['num']}: {meta['contractors'][0]['name']}",
            "type": "order",
            "content": f"""
                <div class="pres-program-container" style="max-height: 520px; overflow-y: auto;">
                    <div class="pres-card-header" style="font-family: var(--mono); font-size: 11px; letter-spacing: 0.15em; color: var(--red); font-weight: 700; margin-bottom: 8px;">
                        COMPLETED WORK ORDER &amp; FIELD TEST // CONTRACTOR {meta['contractors'][0]['num']}
                    </div>
                    <div class="pres-program-body">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <span style="font-family: var(--mono); font-size: 12px; color: #ffd27d; font-weight: 700;">{meta['contractors'][0]['name']} &mdash; {meta['contractors'][0]['role']}</span>
                            <button class="btn-copy-sm" onclick="copyPromptDirectives('{num}_{meta['contractors'][0]['num']}')" style="background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); color: #f5f0e6; font-family: var(--mono); font-size: 10px; padding: 3px 8px; cursor: pointer;">[ COPY COMPLETE PROMPT ]</button>
                        </div>
                        <p style="font-size: 12.5px; color: #b0a898; margin: 4px 0;"><strong>Remediated Defect:</strong> <span style="color: #e07d72;">{meta['contractors'][0]['defect']}</span></p>
                        <p style="font-size: 12.5px; color: #d1c8b8; margin: 4px 0;"><strong>Operational Mandate:</strong> {meta['contractors'][0]['work_order']}</p>
                        
                        <div style="background: #110e0c; border: 1px solid #332d26; border-radius: 2px; margin: 10px 0; overflow: hidden;">
                            <div style="background: #0d0b09; padding: 4px 10px; font-family: var(--mono); font-size: 9.5px; color: #8c8374; display: flex; justify-content: space-between;">
                                <span>EXECUTABLE SYSTEM INSTRUCTION PAYLOAD (UNABRIDGED)</span>
                                <span>PROMPT {meta['contractors'][0]['num']}</span>
                            </div>
                            <pre style="margin: 0; padding: 10px 12px; font-family: var(--mono); font-size: 11px; line-height: 1.45; color: #e8dfcf; max-height: 150px; overflow-y: auto; white-space: pre-wrap;"><code>{cdata.build_completed_prompt_payload(meta['contractors'][0], num, meta['name']).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')}</code></pre>
                        </div>

                        <div style="background: #1c1815; padding: 10px 12px; border-left: 3px solid #7ee0a4; margin-top: 8px; font-family: var(--mono); font-size: 11.5px;">
                            <div style="color: #ffd27d; font-weight: 700; margin-bottom: 4px;">APPLIED FIELD TEST VERIFICATION:</div>
                            <div style="color: #e07d72; margin-bottom: 4px;"><strong>Target Input:</strong> <code>{meta['contractors'][0]['test_input']}</code></div>
                            <div style="color: #a39b8d; margin-bottom: 4px;"><strong>Processing Trace:</strong> {meta['contractors'][0]['test_trace']}</div>
                            <div style="color: #7ee0a4;"><strong>Hardened Output:</strong> <code>{meta['contractors'][0]['test_output']}</code></div>
                        </div>
                    </div>
                </div>
            """
        },
        {
            "slide_num": 6,
            "title": "THE RESIDUAL HUMAN STAKE",
            "subtitle": "What Cannot Be Delegated to the Aperture",
            "type": "stake",
            "content": f"""
                <div class="pres-stake-box">
                    <div class="pres-stake-badge">[ RESIDUAL HUMAN THEORY ]</div>
                    <div class="pres-stake-question">&ldquo;{meta['sovereign_question']}&rdquo;</div>
                    <div class="pres-stake-body">
                        {md_to_html(sec6[:900])}
                    </div>
                </div>
            """
        }
    ]

    games_data.append({
        "num": num,
        "name": name,
        "latin": meta['latin'],
        "subtitle": meta['subtitle'],
        "formula": meta['formula'],
        "human_role": meta['human_role'],
        "machine_role": meta['machine_role'],
        "valid_move": meta['valid_move'],
        "success_condition": meta['success_condition'],
        "sovereign_question": meta['sovereign_question'],
        "fatal_trap": meta['fatal_trap'],
        "contractors": formatted_contractors,
        "sec1_html": md_to_html(sec1),
        "sec2_html": md_to_html(sec2),
        "sec3_html": md_to_html(sec3),
        "sec4_html": md_to_html(sec4),
        "sec5_html": md_to_html(sec5),
        "sec6_html": md_to_html(sec6),
        "sec7_html": md_to_html(sec7),
        "slides": slides
    })

print("Compiled all 12 game data bundles with completed prompts.")

# Build HTML string for presentation.html
games_json_str = json.dumps(games_data)
keynote_json_str = json.dumps(keynote_deck_00)
all_prompts_json_str = json.dumps(all_prompts_store)

presentation_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>The Twelve Language Games: Thought Essay Containers &amp; Keynote Engine</title>
  <meta name="description" content="Operational thought essay containers, completed contractor guilds, and 16:9 keynote engine for the 12 language games of generative systems.">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Public+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">

  <style>
    :root {{
      --paper:        #ebe6da;
      --paper-hi:     #f4efe5;
      --paper-lo:     #ddd5c4;
      --paper-warm:   #fdfcf7;
      --paper-dark:   #181512;
      --ink:          #211d18;
      --ink-soft:     #57503f;
      --ink-faint:    #8a8170;
      --red:          #9e2318;
      --red-deep:     #781810;
      --hair:         rgba(33, 29, 24, 0.20);
      --hair-faint:   rgba(33, 29, 24, 0.10);

      --display: "Playfair Display", Georgia, serif;
      --serif:   "Newsreader", Georgia, serif;
      --mono:    "IBM Plex Mono", "Courier Prime", monospace;
      --sans:    "Public Sans", -apple-system, sans-serif;
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}

    body {{
      background: var(--paper);
      color: var(--ink);
      font-family: var(--serif);
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
      min-height: 100vh;
    }}

    /* Archival Grain */
    body::after {{
      content: "";
      position: fixed; inset: 0; z-index: 999; pointer-events: none; opacity: 0.18; mix-blend-mode: multiply;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.45 0 0 0 0 0.42 0 0 0 0 0.36 0 0 0 0 0.26 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>");
    }}

    /* TOP BAR */
    .top-bar {{
      position: sticky; top: 0; z-index: 500;
      background: rgba(235, 230, 218, 0.98); backdrop-filter: blur(8px);
      border-bottom: 1.5px solid var(--hair); padding: 8px 18px;
      display: flex; justify-content: space-between; align-items: center;
      font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em;
    }}
    .top-left {{ display: flex; align-items: center; gap: 14px; }}
    .brand-link {{ color: var(--ink); text-decoration: none; font-weight: 700; }}
    .brand-link:hover {{ color: var(--red); }}
    .series-label {{ color: var(--ink-faint); font-size: 10px; text-transform: uppercase; }}

    .mode-toggles {{ display: flex; gap: 6px; }}
    .btn-mode {{
      background: var(--paper-hi); border: 1.5px solid var(--ink); color: var(--ink);
      padding: 5px 12px; font-family: var(--mono); font-size: 10.5px; font-weight: 700;
      letter-spacing: 0.1em; cursor: pointer; transition: all 0.15s ease;
    }}
    .btn-mode.active {{ background: var(--ink); color: #fff; }}
    .btn-mode.accent-red.active {{ background: var(--red); border-color: var(--red-deep); color: #fff; }}

    /* DIAL SWITCHER */
    .dial-bar {{
      background: var(--paper-lo); border-bottom: 1px solid var(--hair);
      padding: 6px 16px; display: flex; gap: 6px; overflow-x: auto;
      white-space: nowrap; scrollbar-width: none;
    }}
    .dial-bar::-webkit-scrollbar {{ display: none; }}
    .dial-btn {{
      background: var(--paper-hi); border: 1px solid var(--hair); color: var(--ink-soft);
      padding: 5px 12px; font-family: var(--mono); font-size: 10.5px; font-weight: 600;
      letter-spacing: 0.1em; cursor: pointer; transition: all 0.15s ease; flex-shrink: 0;
    }}
    .dial-btn:hover {{ background: var(--paper-warm); color: var(--ink); }}
    .dial-btn.active {{ background: var(--ink); color: #fff; border-color: var(--ink); }}
    .dial-btn.keynote-btn.active {{ background: var(--red); color: #fff; border-color: var(--red-deep); }}

    /* MAIN CONTAINER */
    .main-stage {{ max-width: 1240px; margin: 0 auto; padding: 28px 18px 80px; }}

    /* VIEW 1: THOUGHT ESSAY CONTAINER */
    .essay-container {{ display: block; }}
    .essay-masthead {{
      background: var(--paper-hi); border: 1.5px solid var(--ink);
      padding: 32px 36px; margin-bottom: 28px; box-shadow: 4px 4px 0 var(--hair);
    }}
    .essay-meta-row {{
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;
      font-family: var(--mono); font-size: 11px; letter-spacing: 0.15em; color: var(--red); font-weight: 700;
    }}
    .essay-title {{
      font-family: var(--display); font-size: 2.8rem; font-weight: 900; line-height: 1.1;
      color: var(--ink); margin-bottom: 8px;
    }}
    .essay-subtitle {{
      font-family: var(--serif); font-size: 1.25rem; font-style: italic; color: var(--ink-soft);
      margin-bottom: 20px;
    }}
    .essay-core-matrix {{
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;
      background: var(--paper-warm); border: 1px solid var(--hair); padding: 16px; margin-top: 20px;
    }}
    .matrix-cell .lbl {{
      font-family: var(--mono); font-size: 9px; text-transform: uppercase; letter-spacing: 0.15em;
      color: var(--ink-faint); display: block; margin-bottom: 2px;
    }}
    .matrix-cell .val {{
      font-family: var(--sans); font-size: 12.5px; font-weight: 700; color: var(--ink);
    }}

    /* CONTRACTOR GUILD IN ESSAY */
    .contractor-guild-section {{
      background: var(--paper-lo); border: 1.5px solid var(--ink);
      padding: 24px; margin-bottom: 32px; box-shadow: 4px 4px 0 var(--hair);
    }}
    .contractor-guild-header {{
      display: flex; justify-content: space-between; align-items: baseline; flex-wrap: wrap; gap: 10px; margin-bottom: 18px;
    }}
    .contractor-guild-header h3 {{
      font-family: var(--mono); font-size: 13px; font-weight: 700; letter-spacing: 0.2em; color: var(--ink);
    }}
    .contractor-guild-header span {{
      font-family: var(--mono); font-size: 11px; color: var(--red); font-weight: 700;
    }}
    .contractor-cards-grid {{
      display: grid; grid-template-columns: 1fr; gap: 20px;
    }}
    .contractor-card {{
      background: var(--paper-warm); border: 1.5px solid var(--ink); padding: 22px;
      display: flex; flex-direction: column; border-radius: 2px; box-shadow: 3px 3px 0 var(--hair-faint);
    }}
    .contractor-badge-row {{
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
    }}
    .contractor-prompt-tag {{
      font-family: var(--mono); font-size: 10.5px; font-weight: 700; color: #fff;
      background: var(--red); padding: 2px 7px; border-radius: 2px;
    }}
    .contractor-role-tag {{
      font-family: var(--mono); font-size: 10.5px; font-weight: 700; color: var(--ink-soft);
      letter-spacing: 0.1em; text-transform: uppercase;
    }}
    .contractor-title {{
      font-family: var(--display); font-size: 1.35rem; font-weight: 700; color: var(--ink);
      line-height: 1.25; margin-bottom: 12px;
    }}
    .contractor-block {{
      font-family: var(--sans); font-size: 13.5px; line-height: 1.5; color: var(--ink-soft); margin-bottom: 10px;
    }}
    .contractor-block strong {{ color: var(--ink); }}

    .essay-prose-block {{
      background: var(--paper-hi); border: 1.5px solid var(--ink);
      padding: 40px 48px; box-shadow: 4px 4px 0 var(--hair);
    }}
    .essay-prose-block h2 {{
      font-family: var(--mono); font-size: 13px; font-weight: 700; letter-spacing: 0.2em;
      color: var(--red); border-bottom: 1.5px solid var(--ink); padding-bottom: 6px;
      margin: 32px 0 16px; text-transform: uppercase;
    }}
    .essay-prose-block h2:first-of-type {{ margin-top: 0; }}
    .essay-prose-block p {{
      font-family: var(--serif); font-size: 17.5px; line-height: 1.65; color: var(--ink);
      margin-bottom: 16px; text-align: justify;
    }}

    /* VIEW 2: KEYNOTE PRESENTATION (16:9) */
    .presentation-view {{ display: none; }}
    .pres-stage-card {{
      background: var(--paper-dark); color: #fdfbf7; border: 2px solid var(--ink);
      padding: 36px 44px; min-height: 600px; display: flex; flex-direction: column;
      justify-content: space-between; box-shadow: 8px 8px 0 var(--hair); position: relative;
    }}
    .pres-top-meta {{
      display: flex; justify-content: space-between; align-items: center;
      font-family: var(--mono); font-size: 11px; letter-spacing: 0.18em; color: #a39b8d;
      border-bottom: 1px solid rgba(255,255,255,0.12); padding-bottom: 12px;
    }}
    .pres-plate-tag {{
      font-family: var(--mono); font-size: 11px; letter-spacing: 0.22em; color: #e07d72;
      font-weight: 700; text-transform: uppercase; margin-bottom: 10px;
    }}
    .pres-title {{
      font-family: var(--display); font-size: 3.2rem; font-weight: 900; line-height: 1.1;
      color: #fdfbf7; margin-bottom: 8px;
    }}
    .pres-subtitle {{
      font-family: var(--serif); font-size: 1.4rem; font-style: italic; color: #c9c1b3; margin-bottom: 24px;
    }}
    .pres-formula-box {{
      background: #241f1b; border-left: 4px solid var(--red); padding: 16px 20px; margin: 18px 0;
    }}
    .formula-line {{ font-family: var(--mono); font-size: 16px; color: #ffd27d; }}
    .formula-line.active {{ color: #7ee0a4; font-weight: 700; font-size: 18px; }}

    .pres-meta-grid {{
      display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px;
      border-top: 1px solid rgba(255,255,255,0.1); padding-top: 18px; margin-top: 18px;
    }}
    .pres-meta-cell .label {{
      font-family: var(--mono); font-size: 9.5px; letter-spacing: 0.15em; color: #8c8374; display: block; margin-bottom: 2px;
    }}
    .pres-meta-cell .val {{
      font-family: var(--sans); font-size: 13px; font-weight: 700; color: #fdfbf7;
    }}

    .pres-split-grid {{
      display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin: 18px 0;
    }}
    .pres-section-label {{
      font-family: var(--mono); font-size: 10px; letter-spacing: 0.2em; color: #e07d72;
      font-weight: 700; text-transform: uppercase; margin-bottom: 8px;
    }}
    .pres-hero-quote {{
      font-family: var(--serif); font-size: 1.8rem; font-style: italic; color: #ffd27d;
      line-height: 1.3; margin: 12px 0; border-left: 3px solid var(--red); padding-left: 14px;
    }}
    .pres-body-text {{
      font-family: var(--sans); font-size: 14.5px; line-height: 1.55; color: #d1c8b8;
    }}

    .pres-contractors-grid {{
      display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; margin: 18px 0;
    }}
    .pres-contractor-card {{
      background: #241f1b; border: 1px solid rgba(255,255,255,0.12); padding: 18px;
    }}
    .pres-contractor-top {{
      display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
    }}
    .pres-prompt-badge {{
      background: var(--red); color: #fff; font-family: var(--mono); font-size: 10px; font-weight: 700; padding: 2px 6px;
    }}
    .pres-contractor-role {{
      font-family: var(--mono); font-size: 9.5px; color: #b0a898; letter-spacing: 0.1em;
    }}
    .pres-contractor-name {{
      font-family: var(--display); font-size: 1.15rem; font-weight: 700; color: #fdfbf7; margin-bottom: 8px;
    }}
    .pres-contractor-defect {{
      font-family: var(--sans); font-size: 12px; color: #e07d72; line-height: 1.4; margin-bottom: 6px;
    }}
    .pres-contractor-order {{
      font-family: var(--sans); font-size: 12px; color: #d1c8b8; line-height: 1.4;
    }}

    .pres-six-cases-grid {{
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
    }}
    @media (max-width: 800px) {{ .pres-six-cases-grid {{ grid-template-columns: 1fr; }} }}
    .pres-mini-case {{
      background: #241f1b; border: 1px solid rgba(255,255,255,0.1); padding: 14px;
    }}
    .pres-mini-case .case-num {{
      font-family: var(--display); font-size: 1.5rem; color: var(--red); font-weight: 700; line-height: 1;
    }}
    .pres-mini-case .case-name {{
      font-family: var(--mono); font-size: 11px; font-weight: 700; color: #fdfbf7; margin: 4px 0 6px;
    }}
    .pres-mini-case .case-desc {{
      font-family: var(--serif); font-size: 12.5px; line-height: 1.4; color: #b0a898;
    }}

    .pres-twelve-grid {{
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 18px 0;
    }}
    .pres-game-pill {{
      background: #241f1b; border: 1px solid rgba(255,255,255,0.1); padding: 10px; display: flex; flex-direction: column;
    }}
    .pres-game-pill .num {{ font-family: var(--mono); font-size: 10px; color: var(--red); font-weight: 700; }}
    .pres-game-pill .name {{ font-family: var(--mono); font-size: 11.5px; font-weight: 700; color: #fdfbf7; }}
    .pres-game-pill .sub {{ font-family: var(--serif); font-size: 11px; color: #8c8374; font-style: italic; }}

    /* PRES CONTROLS BAR */
    .pres-bottom-bar {{
      margin-top: 18px; display: flex; justify-content: space-between; align-items: center;
      font-family: var(--mono); font-size: 11px;
    }}
    .pres-nav-btns {{ display: flex; gap: 8px; }}
    .btn-pres-step {{
      background: var(--paper-hi); border: 1.5px solid var(--ink); color: var(--ink);
      padding: 8px 18px; font-family: var(--mono); font-size: 11px; font-weight: 700;
      cursor: pointer; transition: all 0.15s ease;
    }}
    .btn-pres-step:hover {{ background: var(--ink); color: #fff; }}

    /* FOOTER DOCK */
    .global-footer-dock {{
      background: var(--paper-dark); color: #ece5d8; padding: 24px;
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap;
      gap: 16px; font-family: var(--mono); font-size: 11px;
    }}
    .global-footer-dock a {{ color: #fae9a4; text-decoration: none; font-weight: 700; }}
    .global-footer-dock a:hover {{ text-decoration: underline; }}

    /* TOAST */
    #toast {{
      position: fixed; bottom: 24px; right: 24px; background: var(--ink); color: #fff;
      padding: 10px 18px; font-family: var(--mono); font-size: 12px; border-radius: 2px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25); transform: translateY(100px); opacity: 0;
      transition: all 0.25s; z-index: 3000;
    }}
    #toast.show {{ transform: translateY(0); opacity: 1; }}

    @media (max-width: 800px) {{
      .pres-split-grid {{ grid-template-columns: 1fr; }}
      .pres-title {{ font-size: 2.2rem; }}
      .essay-title {{ font-size: 2.1rem; }}
      .essay-prose-block {{ padding: 24px 20px; }}
    }}
  </style>
</head>
<body>

  <!-- TOP RUNNING BAR -->
  <header class="top-bar">
    <div class="top-left">
      <a href="index.html#section-language-games" class="brand-link" title="Return to WORLDFUL Atlas">&larr; WORLDFUL ATLAS</a>
      <a href="deep_play_at_the_aperture.html" class="brand-link" style="color:var(--red); font-weight:700; border-left:1px solid var(--hair); padding-left:10px;">[ MONOGRAPH ] DEEP PLAY</a>
      <span class="series-label">THE 12 LANGUAGE GAMES // THOUGHT CONTAINERS</span>
    </div>

    <div class="mode-toggles">
      <button class="btn-mode active" id="btnModeEssay" onclick="switchViewMode('essay')">
        [ THOUGHT ESSAY ]
      </button>
      <button class="btn-mode accent-red" id="btnModePres" onclick="switchViewMode('presentation')">
        [ KEYNOTE DECK ]
      </button>
    </div>
  </header>

  <!-- DIAL SWITCHER -->
  <nav class="dial-bar" id="dialBar">
    <button class="dial-btn keynote-btn active" data-id="00" onclick="selectGame('00')">
      [ KEYNOTE ] DEEP PLAY AT THE APERTURE
    </button>
  </nav>

  <!-- MAIN STAGE -->
  <main class="main-stage">

    <!-- VIEW 1: THOUGHT ESSAY CONTAINER -->
    <article class="essay-container" id="essayView"></article>

    <!-- VIEW 2: KEYNOTE PRESENTATION DECK -->
    <section class="presentation-view" id="presView">
      <div class="pres-stage-card" id="presStageCard">
        <div class="pres-top-meta">
          <span id="presTopDeckLabel">DECK 00 // DEEP PLAY AT THE APERTURE</span>
          <span id="presSlideCounter">SLIDE 01 / 06</span>
        </div>

        <div class="pres-slide-body" id="presSlideBody"></div>

        <div class="pres-bottom-bar">
          <div class="pres-nav-btns">
            <button class="btn-pres-step" onclick="prevSlide()">&larr; PREV</button>
            <button class="btn-pres-step" onclick="nextSlide()">NEXT &rarr;</button>
          </div>
          <div style="color:#8c8374; font-family:var(--mono); font-size:11px;">
            USE ARROW KEYS &larr; / &rarr; &bull; ESC TO RETURN TO ESSAY
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- FOOTER DOCK -->
  <footer class="global-footer-dock">
    <div>WORLDFUL PRESS // OPERATIVE HUMANITIES MONOGRAPH SERIES</div>
    <div>WATSON HARTSOE &middot; SEPTEMBER 7, 2026</div>
    <div>
      <a href="index.html#section-language-games">&larr; RETURN TO WORLDFUL ATLAS</a> &bull;
      <a href="deep_play_at_the_aperture.html">[ READ MONOGRAPH ]</a>
    </div>
  </footer>

  <!-- TOAST -->
  <div id="toast">Prompt copied to clipboard!</div>

  <script>
    const GAMES_DATA = {games_json_str};
    const KEYNOTE_DECK_00 = {keynote_json_str};
    const PROMPTS_STORE = {all_prompts_json_str};

    let currentSelectedId = "00";
    let currentViewMode = "essay"; // "essay" or "presentation"
    let currentSlideIndex = 0;

    function init() {{
      renderDialButtons();
      renderActiveContent();
      setupKeyboardControls();

      // Check URL parameters
      const params = new URLSearchParams(window.location.search);
      const gameParam = params.get('game');
      const modeParam = params.get('mode');

      if (gameParam && (gameParam === '00' || GAMES_DATA.some(g => g.num === gameParam))) {{
        selectGame(gameParam);
      }}
      if (modeParam === 'presentation') {{
        switchViewMode('presentation');
      }}
    }}

    function renderDialButtons() {{
      const dialBar = document.getElementById("dialBar");
      const gameButtons = GAMES_DATA.map(g => `
        <button class="dial-btn" data-id="${{g.num}}" onclick="selectGame('${{g.num}}')">
          [ ${{g.num}} ] ${{g.name}}
        </button>
      `).join('');
      dialBar.innerHTML = `
        <button class="dial-btn keynote-btn active" data-id="00" onclick="selectGame('00')">
          [ KEYNOTE ] DEEP PLAY AT THE APERTURE
        </button>
        ${{gameButtons}}
      `;
    }}

    function switchViewMode(mode) {{
      currentViewMode = mode;
      document.getElementById("btnModeEssay").classList.toggle("active", mode === "essay");
      document.getElementById("btnModePres").classList.toggle("active", mode === "presentation");

      document.getElementById("essayView").style.display = mode === "essay" ? "block" : "none";
      document.getElementById("presView").style.display = mode === "presentation" ? "block" : "none";

      if (mode === "presentation") {{
        currentSlideIndex = 0;
        renderSlide();
      }}
    }}

    function selectGame(id) {{
      currentSelectedId = id;
      document.querySelectorAll(".dial-btn").forEach(btn => {{
        btn.classList.toggle("active", btn.getAttribute("data-id") === id);
      }});
      currentSlideIndex = 0;
      renderActiveContent();
    }}

    function getActiveSlides() {{
      if (currentSelectedId === "00") return KEYNOTE_DECK_00;
      const game = GAMES_DATA.find(g => g.num === currentSelectedId);
      return game ? game.slides : KEYNOTE_DECK_00;
    }}

    function renderActiveContent() {{
      if (currentViewMode === "essay") {{
        renderEssayView();
      }} else {{
        renderSlide();
      }}
    }}

    function renderEssayView() {{
      const essayContainer = document.getElementById("essayView");

      if (currentSelectedId === "00") {{
        // Render Keynote Monograph Summary
        essayContainer.innerHTML = `
          <div class="essay-masthead">
            <div class="essay-meta-row">
              <span>FOUNDATIONAL DISSERTATION MONOGRAPH // WF-2026-DP</span>
              <span>WATSON HARTSOE &bull; SEPTEMBER 7, 2026</span>
            </div>
            <h1 class="essay-title">Deep Play at the Aperture</h1>
            <div class="essay-subtitle">Large Language Games and the Operative Humanities</div>
            <p style="font-size: 1.15rem; font-style: italic; line-height: 1.6; color: var(--ink-soft); margin-top: 14px;">
              Generative interfaces compress historically distinct language practices into a single textual aperture.
              This monograph argues that the resulting category error produces systematic technical failures because systems are asked to infer the operative force of language while interfaces hide the surrounding game.
            </p>
            <div style="margin-top: 24px; display:flex; gap:14px; flex-wrap:wrap;">
              <a href="deep_play_at_the_aperture.html" class="btn-pres-step" style="text-decoration:none; background:var(--red); color:#fff; border-color:var(--red-deep);">
                [ READ COMPLETE 11-PAGE MONOGRAPH ] &rarr;
              </a>
              <button class="btn-pres-step" onclick="switchViewMode('presentation')">
                [ LAUNCH MONOGRAPH KEYNOTE DECK ]
              </button>
            </div>
          </div>
        `;
        return;
      }}

      // Render Individual Game Thought Container
      const g = GAMES_DATA.find(item => item.num === currentSelectedId);
      if (!g) return;

      essayContainer.innerHTML = `
        <div class="essay-masthead">
          <div class="essay-meta-row">
            <span>LANGUAGE GAME ${{g.num}} // THOUGHT ESSAY CONTAINER</span>
            <span>DIRECTIONS: ${{g.valid_move}}</span>
          </div>
          <h1 class="essay-title">${{g.name}}</h1>
          <div class="essay-subtitle">${{g.latin}} &mdash; ${{g.subtitle}}</div>

          <div class="pres-formula-box" style="margin: 16px 0;">
            <div class="formula-line active">${{g.formula}}</div>
          </div>

          <div class="essay-core-matrix">
            <div class="matrix-cell">
              <span class="lbl">HUMAN ROLE</span>
              <span class="val">${{g.human_role}}</span>
            </div>
            <div class="matrix-cell">
              <span class="lbl">MACHINE ROLE</span>
              <span class="val">${{g.machine_role}}</span>
            </div>
            <div class="matrix-cell">
              <span class="lbl">VALID MOVE</span>
              <span class="val">${{g.valid_move}}</span>
            </div>
            <div class="matrix-cell">
              <span class="lbl">FATAL TRAP</span>
              <span class="val" style="color:var(--red);">${{g.fatal_trap}}</span>
            </div>
          </div>
        </div>

        <!-- THE CONTRACTOR GUILD -->
        <div class="contractor-guild-section">
          <div class="contractor-guild-header">
            <h3>THE CONTRACTOR GUILD // COMPLETED SYSTEM INSTRUCTIONS</h3>
            <span>5 PRIMARY CONTRACTORS FULLY SPECIFIED</span>
          </div>
          <div class="contractor-cards-grid">
            ${{g.contractors.map(c => `
              <div class="contractor-card">
                <div class="contractor-badge-row">
                  <span class="contractor-prompt-tag">PROMPT ${{c.num}}</span>
                  <span class="contractor-role-tag">${{c.role}}</span>
                </div>
                <div class="contractor-title">${{c.name}}</div>
                <div class="contractor-block"><strong>ARCHITECTURAL VULNERABILITY:</strong> <span style="color:var(--red); font-weight:600;">${{c.defect}}</span></div>
                <div class="contractor-block"><strong>SCOPE OF WORK:</strong> ${{c.work_order}}</div>
                
                <!-- COMPLETED EXECUTABLE PROMPT -->
                <div class="directive-box" style="margin-top:14px; background:#181512; border:1px solid #332d26; border-radius:2px; overflow:hidden;">
                  <div class="directive-header" style="background:#110e0c; padding:6px 12px; display:flex; justify-content:space-between; align-items:center; font-family:var(--mono); font-size:9.5px; color:#b0a898;">
                    <span>COMPLETED SYSTEM INSTRUCTION PROMPT (READY TO RUN)</span>
                    <button class="btn-copy-sm" onclick="copyPromptDirectives('${{g.num}}_${{c.num}}')" style="background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); color:#f5f0e6; font-family:var(--mono); font-size:9px; padding:2px 7px; cursor:pointer;">[ COPY COMPLETE PROMPT ]</button>
                  </div>
                  <pre class="directive-code" style="padding:12px; font-family:var(--mono); font-size:11.5px; line-height:1.5; color:#e8dfcf; overflow-x:auto; max-height:260px; white-space:pre-wrap; margin:0;"><code>${{c.completed_prompt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}}</code></pre>
                </div>

                <!-- APPLIED FIELD TEST VERIFICATION -->
                <div class="field-test-box" style="margin-top:12px; background:var(--paper-lo); border:1px solid var(--hair); padding:10px 12px; font-size:12.5px;">
                  <div style="font-family:var(--mono); font-size:9px; font-weight:700; color:var(--red); letter-spacing:0.12em; margin-bottom:6px;">APPLIED FIELD TEST VERIFICATION // GAME ${{g.num}}</div>
                  <div style="margin-bottom:6px;"><span style="font-family:var(--mono); font-size:9px; color:var(--ink-faint); display:block;">TARGET INPUT:</span><code style="font-family:var(--mono); font-size:11px; color:var(--red); display:block; background:var(--paper-hi); padding:3px 6px;">${{c.test_input}}</code></div>
                  <div style="margin-bottom:6px;"><span style="font-family:var(--mono); font-size:9px; color:var(--ink-faint); display:block;">CONTRACTOR PROCESSING:</span><p style="font-size:12px; margin:0; color:var(--ink-soft);">${{c.test_trace}}</p></div>
                  <div><span style="font-family:var(--mono); font-size:9px; color:var(--ink-faint); display:block;">HARDENED OUTPUT:</span><code style="font-family:var(--mono); font-size:11px; color:#185e3a; font-weight:600; display:block; background:var(--paper-hi); padding:3px 6px;">${{c.test_output}}</code></div>
                </div>
              </div>
            `).join('')}}
          </div>
        </div>

        <!-- FULL UNABRIDGED ESSAY SECTIONS 1 - 7 -->
        <div class="essay-prose-block">
          <h2>01 // THE EMPIRICAL CARD &amp; EPISTEMIC TRADE-OFFS</h2>
          ${{g.sec1_html}}

          <h2>02 // CORE GAME SPECIFICATION</h2>
          ${{g.sec2_html}}

          <h2>03 // ANCESTRAL LINEAGE &amp; MIGRATION MAP</h2>
          ${{g.sec3_html}}

          <h2>04 // FORMAL ECHO &amp; LITERATURE GROUNDING</h2>
          ${{g.sec4_html}}

          <h2>05 // THEORY OF THE PROGRAM &amp; COMPUTATIONAL ONTOLOGY</h2>
          ${{g.sec5_html}}

          <h2>06 // THE RESIDUAL HUMAN STAKE</h2>
          ${{g.sec6_html}}

          <h2>07 // COMPARATIVE MATRIX</h2>
          ${{g.sec7_html}}
        </div>
      `;
    }}

    function renderSlide() {{
      const slides = getActiveSlides();
      if (currentSlideIndex >= slides.length) currentSlideIndex = 0;
      if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;

      const s = slides[currentSlideIndex];
      const topLabel = currentSelectedId === "00" 
        ? "DECK 00 // DEEP PLAY AT THE APERTURE" 
        : `GAME ${{currentSelectedId}} // ${{GAMES_DATA.find(g => g.num === currentSelectedId)?.name || ''}}`;

      document.getElementById("presTopDeckLabel").textContent = topLabel;
      document.getElementById("presSlideCounter").textContent = `SLIDE 0${{s.slide_num}} / 0${{slides.length}}`;
      document.getElementById("presSlideBody").innerHTML = s.content;
    }}

    function nextSlide() {{
      const slides = getActiveSlides();
      if (currentSlideIndex < slides.length - 1) {{
        currentSlideIndex++;
        renderSlide();
      }}
    }}

    function prevSlide() {{
      if (currentSlideIndex > 0) {{
        currentSlideIndex--;
        renderSlide();
      }}
    }}

    function setupKeyboardControls() {{
      window.addEventListener('keydown', (e) => {{
        if (currentViewMode === "presentation") {{
          if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
          if (e.key === 'ArrowLeft') prevSlide();
          if (e.key === 'Escape') switchViewMode('essay');
        }}
      }});
    }}

    function copyPromptDirectives(key) {{
      const text = PROMPTS_STORE[key] || "Prompt payload unavailable.";
      navigator.clipboard.writeText(text).then(() => {{
        const toast = document.getElementById('toast');
        toast.innerText = "Completed Contractor Prompt copied to clipboard!";
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
      }});
    }}

    window.onload = init;
  </script>
</body>
</html>
"""

# Write presentation.html to root
with open(os.path.join(base_dir, "presentation.html"), "w") as f:
    f.write(presentation_html)
print("Wrote presentation.html in root.")

# Mirror to WAYS TO WRITE/
with open(os.path.join(base_dir, "WAYS TO WRITE/presentation.html"), "w") as f:
    f.write(presentation_html)
print("Mirrored WAYS TO WRITE/presentation.html.")

print("All presentations and thought essay containers updated successfully!")
