import os
import sys
import json
import re
import markdown

sys.path.append(os.path.join(os.path.dirname(__file__)))
import completed_contractors_data as cdata

base_dir = "/Users/gaia/WORLDFUL"
games_dir = os.path.join(base_dir, "WAYS TO WRITE/language_games")

print("Starting compilation of completed thought essay containers and keynote presentations without emojis...")

# ---------------------------------------------------------
# HELPER: Render Contractor Dossier HTML (with completed prompt & test case)
# ---------------------------------------------------------
def render_contractor_dossier_html(c, game_num, game_name):
    completed_prompt = cdata.build_completed_prompt_payload(c, game_num, game_name)
    escaped_prompt = completed_prompt.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    
    return f"""
    <div class="contractor-dossier-card">
      <div class="contractor-header">
        <div class="contractor-num-badge">CONTRACTOR // PROMPT {c['num']}</div>
        <div class="contractor-specialty">{c['role']}</div>
      </div>
      <h3 class="contractor-title">{c['name']}</h3>
      
      <div class="contractor-spec-block">
        <span class="spec-label">ARCHITECTURAL VULNERABILITY TARGETED:</span>
        <span class="spec-value defect">{c['defect']}</span>
      </div>
      <div class="contractor-spec-block">
        <span class="spec-label">SCOPE OF WORK &amp; REMEDIATION ORDER:</span>
        <span class="spec-value">{c['work_order']}</span>
      </div>

      <!-- COMPLETED EXECUTABLE PROMPT PAYLOAD -->
      <div class="directive-box">
        <div class="directive-header">
          <span>COMPLETED SYSTEM INSTRUCTION PROMPT (READY TO RUN)</span>
          <button class="btn-copy-sm" onclick="copyPromptDirectives('{game_num}_{c['num']}')">[ COPY COMPLETE PROMPT ]</button>
        </div>
        <pre class="directive-code"><code>{escaped_prompt}</code></pre>
      </div>

      <!-- APPLIED FIELD TEST DEMONSTRATION -->
      <div class="field-test-box">
        <div class="field-test-header">APPLIED FIELD TEST VERIFICATION // GAME {game_num}</div>
        <div class="test-row">
          <span class="test-label">TARGET VULNERABILITY INPUT:</span>
          <code class="test-code input">{c['test_input']}</code>
        </div>
        <div class="test-row">
          <span class="test-label">CONTRACTOR PROCESSING TRACE:</span>
          <p class="test-trace">{c['test_trace']}</p>
        </div>
        <div class="test-row">
          <span class="test-label">HARDENED INVARIANT OUTPUT:</span>
          <code class="test-code output">{c['test_output']}</code>
        </div>
      </div>
    </div>
    """

# ---------------------------------------------------------
# PART 1: BUILD THE 12 STANDALONE GAME PAGES
# ---------------------------------------------------------
def build_standalone_game(num):
    meta = cdata.CONTRACTORS_CONFIG[num]
    name = meta['name']
    
    # Read game markdown file
    md_path = os.path.join(games_dir, f"{num}_{name.lower()}.md")
    with open(md_path, 'r') as f:
        raw_md = f.read()
    
    html_body = markdown.markdown(raw_md, extensions=['extra', 'codehilite', 'tables'])

    # Build Contractor Dossiers
    contractor_cards_html = ""
    prompts_store_dict = {}
    for c in meta['contractors']:
        contractor_cards_html += render_contractor_dossier_html(c, num, name)
        prompts_store_dict[f"{num}_{c['num']}"] = cdata.build_completed_prompt_payload(c, num, name)

    # Auxiliary Brigade
    aux_html = ""
    for aux_num in meta.get('auxiliary', []):
        aux_p = cdata.PROMPTS_DICT.get(aux_num, {'title': 'System Instruction'})
        aux_html += f"""
        <li class="aux-item">
          <span class="aux-badge">PROMPT {aux_num}</span>
          <span class="aux-title">{aux_p['title']}</span>
        </li>
        """

    # Precalculate next game url
    next_idx = int(num) + 1
    if next_idx <= 12:
        next_num_str = f"{next_idx:02d}"
        next_name = cdata.CONTRACTORS_CONFIG[next_num_str]['name'].lower()
        next_game_url = f"{next_num_str}_{next_name}.html"
    else:
        next_game_url = "deep_play_at_the_aperture.html"

    # Dropdown options
    dropdown_options = ""
    for i in range(1, 13):
        n_str = f"{i:02d}"
        g_meta = cdata.CONTRACTORS_CONFIG[n_str]
        g_name = g_meta['name']
        g_lower = g_name.lower()
        dropdown_options += f'<a href="{n_str}_{g_lower}.html">{n_str} // {g_name}</a>\n'

    prompts_store_json = json.dumps(prompts_store_dict)

    # Keynote Slides HTML (8 slides)
    slides_html = f"""
    <!-- SLIDE 1: TITLE & FORMULA -->
    <div class="slide active" data-slide="1">
      <div class="slide-badge">GAME {meta['num']} // OPERATIVE HUMANITIES MONOGRAPH</div>
      <h1 class="slide-title">{meta['name']}</h1>
      <div class="slide-subtitle">{meta['latin']} &mdash; {meta['subtitle']}</div>
      <div class="slide-card">
        <div class="formula-text">{meta['formula']}</div>
        <div class="formula-sub">The surface string is stable while the surrounding institution changes.</div>
      </div>
      <div class="slide-footer-row">
        <span>Direction of Fit: <strong>{meta['valid_move']}</strong></span>
        <span>Human: <strong>{meta['human_role']}</strong></span>
        <span>Synthetic: <strong>{meta['machine_role']}</strong></span>
      </div>
    </div>

    <!-- SLIDE 2: ILLOCUTIONARY SPEECH ACT -->
    <div class="slide" data-slide="2">
      <div class="slide-badge">THEORETICAL ARCHITECTURE</div>
      <h2 class="slide-title">The Speech Act &amp; Success Condition</h2>
      <div class="slide-grid-2">
        <div class="slide-panel">
          <h3>ILLOCUTIONARY SPECIFICATION</h3>
          <p><strong>Valid Move:</strong> {meta['valid_move']}</p>
          <p><strong>Success Condition:</strong> {meta['success_condition']}</p>
        </div>
        <div class="slide-panel danger">
          <h3>THE FATAL ARCHITECTURAL TRAP</h3>
          <p><strong>{meta['fatal_trap']}</strong></p>
          <p>When the interface treats all utterances as uniform strings, it forfeits the structural invariants required to keep this game alive.</p>
        </div>
      </div>
    </div>

    <!-- SLIDE 3: EMPIRICAL COLLAPSE -->
    <div class="slide" data-slide="3">
      <div class="slide-badge">EMPIRICAL AUTOPSY</div>
      <h2 class="slide-title">The Sovereign Question</h2>
      <div class="slide-hero-quote">
        "{meta['sovereign_question']}"
      </div>
      <div class="slide-body-box">
        <p>In the absence of an explicit operative apparatus, natural language prompting collapses into semantic laundering. Rhetorical plausibility impersonates valid computational state transitions.</p>
      </div>
    </div>

    <!-- SLIDE 4: THE CONTRACTOR GUILD -->
    <div class="slide" data-slide="4">
      <div class="slide-badge">THE CONTRACTOR GUILD</div>
      <h2 class="slide-title">Architectural Work Orders</h2>
      <div class="slide-contractor-list">
        <div class="slide-c-item">
          <span class="slide-c-num">P-{meta['contractors'][0]['num']}</span>
          <strong>{meta['contractors'][0]['name']}</strong>: {meta['contractors'][0]['role']}
        </div>
        <div class="slide-c-item">
          <span class="slide-c-num">P-{meta['contractors'][1]['num']}</span>
          <strong>{meta['contractors'][1]['name']}</strong>: {meta['contractors'][1]['role']}
        </div>
        <div class="slide-c-item">
          <span class="slide-c-num">P-{meta['contractors'][2]['num']}</span>
          <strong>{meta['contractors'][2]['name']}</strong>: {meta['contractors'][2]['role']}
        </div>
      </div>
    </div>

    <!-- SLIDE 5: LEAD CONTRACTOR 1 COMPLETED PROMPT DIRECTIVE -->
    <div class="slide" data-slide="5">
      <div class="slide-badge">CONTRACTOR WORK ORDER // PROMPT {meta['contractors'][0]['num']}</div>
      <h2 class="slide-title">{meta['contractors'][0]['name']}</h2>
      <div class="slide-panel">
        <p><strong>Defect Remediated:</strong> {meta['contractors'][0]['defect']}</p>
        <p><strong>Operative Work Order:</strong> {meta['contractors'][0]['work_order']}</p>
        <div style="margin-top:12px; font-family:var(--mono); font-size:13px; color:#ffd27d;">
          Test Input: <code>{meta['contractors'][0]['test_input']}</code><br>
          Hardened Output: <code>{meta['contractors'][0]['test_output']}</code>
        </div>
      </div>
    </div>

    <!-- SLIDE 6: LEAD CONTRACTOR 2 COMPLETED PROMPT DIRECTIVE -->
    <div class="slide" data-slide="6">
      <div class="slide-badge">CONTRACTOR WORK ORDER // PROMPT {meta['contractors'][1]['num']}</div>
      <h2 class="slide-title">{meta['contractors'][1]['name']}</h2>
      <div class="slide-panel">
        <p><strong>Defect Remediated:</strong> {meta['contractors'][1]['defect']}</p>
        <p><strong>Operative Work Order:</strong> {meta['contractors'][1]['work_order']}</p>
        <div style="margin-top:12px; font-family:var(--mono); font-size:13px; color:#ffd27d;">
          Test Input: <code>{meta['contractors'][1]['test_input']}</code><br>
          Hardened Output: <code>{meta['contractors'][1]['test_output']}</code>
        </div>
      </div>
    </div>

    <!-- SLIDE 7: RESIDUAL HUMAN THEORY -->
    <div class="slide" data-slide="7">
      <div class="slide-badge">FIELD METHOD &amp; ETHNOGRAPHY</div>
      <h2 class="slide-title">Residual Human Theory</h2>
      <div class="slide-body-box">
        <p>No amount of prompt scaffolding or schema externalization eliminates human interpretation. Semantic authority, aesthetic judgment, and moral responsibility remain non-computable human commitments.</p>
        <p style="margin-top:14px; font-style:italic; color:var(--red);">The operative humanities moves humanities inquiry directly into the execution conditions that make language consequential.</p>
      </div>
    </div>

    <!-- SLIDE 8: SUMMARY & NAVIGATION -->
    <div class="slide" data-slide="8">
      <div class="slide-badge">SEQUENCE COMPLETE</div>
      <h2 class="slide-title">Operative Invariant Restored</h2>
      <p style="font-size:18px; line-height:1.6; margin-bottom:24px;">
        You have surveyed Game {meta['num']} ({meta['name']}). Review the full thought essay container below or proceed to the next language game.
      </p>
      <div style="display:flex; gap:16px;">
        <button class="btn-action highlight" onclick="togglePresentationMode()">[ RETURN TO ESSAY CONTAINER ]</button>
        <a href="{next_game_url}" class="btn-action">NEXT GAME &rarr;</a>
      </div>
    </div>
    """

    full_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
  <title>GAME {meta['num']}: {meta['name']} — Thought Essay Container &amp; Presentation</title>
  <meta name="description" content="{meta['subtitle']}. Part of The Twelve Language Games of Generative Systems by Watson Hartsoe.">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&family=Public+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">

  <style>
    :root {{
      --paper:        #f4efe5;
      --paper-hi:     #fdfbf7;
      --paper-lo:     #eae3d2;
      --paper-card:   #fcfaf5;
      --ink:          #1a1714;
      --ink-soft:     #4d463a;
      --ink-faint:    #807664;
      --red:          #9e2318;
      --red-deep:     #781810;
      --red-faint:    rgba(158, 35, 24, 0.08);
      --hair:         rgba(26, 23, 20, 0.18);
      --hair-faint:   rgba(26, 23, 20, 0.08);

      --display: "Playfair Display", Georgia, serif;
      --serif:   "Newsreader", Georgia, serif;
      --mono:    "IBM Plex Mono", monospace;
      --sans:    "Public Sans", -apple-system, sans-serif;
    }}

    * {{ box-sizing: border-box; margin: 0; padding: 0; }}

    body {{
      background: var(--paper);
      color: var(--ink);
      font-family: var(--serif);
      line-height: 1.68;
      font-size: 18.5px;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }}

    /* Archival Texture */
    body::before {{
      content: "";
      position: fixed;
      inset: 0;
      z-index: 1000;
      pointer-events: none;
      opacity: 0.22;
      mix-blend-mode: multiply;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0.45 0 0 0 0 0.42 0 0 0 0 0.36 0 0 0 0 0.26 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>");
    }}

    /* TOPBAR */
    .topbar {{
      position: sticky;
      top: 0;
      z-index: 500;
      background: rgba(244, 239, 229, 0.96);
      backdrop-filter: blur(10px);
      border-bottom: 1.5px solid var(--hair);
      padding: 10px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--mono);
      font-size: 11.5px;
      letter-spacing: 0.12em;
    }}
    .topbar a {{ color: var(--ink); text-decoration: none; }}
    .topbar a:hover {{ color: var(--red); }}

    .brand-group {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .back-btn {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
      border: 1px solid var(--hair);
      padding: 4px 10px;
      background: var(--paper-hi);
    }}
    .badge-game {{
      background: var(--ink);
      color: var(--paper-hi);
      padding: 3px 8px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.15em;
    }}

    .top-actions {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .btn-action {{
      background: var(--paper-hi);
      border: 1px solid var(--hair);
      color: var(--ink);
      padding: 5px 12px;
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s;
      text-decoration: none;
    }}
    .btn-action:hover {{
      background: var(--ink);
      color: var(--paper-hi);
      border-color: var(--ink);
    }}
    .btn-action.highlight {{
      background: var(--red);
      color: #fff;
      border-color: var(--red-deep);
    }}
    .btn-action.highlight:hover {{
      background: var(--red-deep);
    }}

    /* DROPDOWN */
    .dropdown {{ position: relative; display: inline-block; }}
    .dropdown-content {{
      display: none;
      position: absolute;
      right: 0;
      top: 100%;
      background: var(--paper-hi);
      border: 1.5px solid var(--ink);
      box-shadow: 4px 4px 0 var(--hair);
      min-width: 240px;
      z-index: 600;
      max-height: 480px;
      overflow-y: auto;
    }}
    .dropdown:hover .dropdown-content {{ display: block; }}
    .dropdown-content a {{
      display: block;
      padding: 8px 14px;
      font-family: var(--mono);
      font-size: 11px;
      border-bottom: 1px solid var(--hair-faint);
    }}
    .dropdown-content a:hover {{ background: var(--red-faint); color: var(--red); }}

    /* MAIN CONTAINER */
    .essay-container {{
      max-width: 960px;
      margin: 0 auto;
      padding: 48px 24px 100px;
    }}

    /* ESSAY HEADER BLOCK */
    .game-header {{
      margin-bottom: 48px;
      padding-bottom: 32px;
      border-bottom: 2px solid var(--ink);
    }}
    .game-vol {{
      font-family: var(--mono);
      font-size: 11.5px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--red);
      font-weight: 700;
      margin-bottom: 12px;
    }}
    .game-title {{
      font-family: var(--display);
      font-size: 46px;
      font-weight: 900;
      line-height: 1.1;
      color: var(--ink);
      margin-bottom: 12px;
    }}
    .game-motto {{
      font-family: var(--serif);
      font-size: 24px;
      font-style: italic;
      color: var(--ink-soft);
      margin-bottom: 20px;
    }}
    .formula-banner {{
      background: #211d18;
      color: #faf6ed;
      padding: 16px 22px;
      border-radius: 3px;
      font-family: var(--mono);
      font-size: 15px;
      box-shadow: 3px 3px 0 var(--red);
      margin: 20px 0;
    }}

    /* SPEC STRIP */
    .spec-strip {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      background: var(--paper-card);
      border: 1px solid var(--hair);
      padding: 16px;
      margin-top: 24px;
      font-family: var(--sans);
      font-size: 13px;
    }}
    .spec-item strong {{
      display: block;
      font-family: var(--mono);
      font-size: 10px;
      color: var(--ink-faint);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 4px;
    }}

    /* PROSE SECTIONS */
    .prose-section {{ margin-bottom: 60px; }}
    .prose-section h2 {{
      font-family: var(--display);
      font-size: 28px;
      font-weight: 800;
      color: var(--ink);
      margin-bottom: 22px;
      padding-bottom: 8px;
      border-bottom: 1.5px solid var(--hair);
    }}
    .prose-section h3 {{
      font-family: var(--display);
      font-size: 22px;
      margin: 28px 0 14px;
    }}
    .prose-section p {{
      margin-bottom: 20px;
      text-align: justify;
      hyphens: auto;
    }}

    /* CONTRACTOR GUILD SECTION */
    .contractor-guild-block {{
      background: var(--paper-card);
      border: 2px solid var(--ink);
      padding: 36px 32px;
      margin: 54px 0;
      box-shadow: 6px 6px 0 var(--hair);
    }}
    .guild-badge-row {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      border-bottom: 1.5px solid var(--ink);
      padding-bottom: 14px;
    }}
    .guild-title {{
      font-family: var(--display);
      font-size: 26px;
      font-weight: 800;
    }}
    .guild-count {{
      font-family: var(--mono);
      font-size: 11px;
      background: var(--ink);
      color: #fff;
      padding: 3px 9px;
      letter-spacing: 0.12em;
    }}

    /* CONTRACTOR DOSSIER CARDS */
    .contractor-dossier-card {{
      background: var(--paper-hi);
      border: 1.5px solid var(--ink);
      padding: 24px;
      margin-bottom: 28px;
      box-shadow: 3px 3px 0 var(--hair-faint);
    }}
    .contractor-header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }}
    .contractor-num-badge {{
      font-family: var(--mono);
      font-size: 11px;
      font-weight: 700;
      background: var(--red);
      color: #fff;
      padding: 2px 8px;
      letter-spacing: 0.12em;
    }}
    .contractor-specialty {{
      font-family: var(--mono);
      font-size: 11px;
      color: var(--ink-faint);
    }}
    .contractor-title {{
      font-family: var(--display);
      font-size: 21px;
      font-weight: 700;
      margin-bottom: 14px;
    }}
    .contractor-spec-block {{
      margin-bottom: 10px;
      font-size: 14.5px;
      line-height: 1.5;
    }}
    .spec-label {{
      font-family: var(--mono);
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--ink-soft);
      display: block;
      margin-bottom: 2px;
    }}
    .spec-value.defect {{
      color: var(--red-deep);
      font-weight: 600;
    }}

    /* DIRECTIVE EXCERPT CODE BLOCK */
    .directive-box {{
      margin-top: 18px;
      background: #211d18;
      border: 1px solid #332d26;
      border-radius: 2px;
      overflow: hidden;
    }}
    .directive-header {{
      background: #181512;
      padding: 8px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--mono);
      font-size: 10px;
      letter-spacing: 0.12em;
      color: #b0a898;
    }}
    .btn-copy-sm {{
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.25);
      color: #f5f0e6;
      font-family: var(--mono);
      font-size: 10px;
      padding: 3px 8px;
      cursor: pointer;
      transition: all 0.15s;
    }}
    .btn-copy-sm:hover {{
      background: var(--red);
      border-color: var(--red);
      color: #fff;
    }}
    .directive-code {{
      padding: 16px;
      font-family: var(--mono);
      font-size: 12.5px;
      line-height: 1.55;
      color: #e8dfcf;
      overflow-x: auto;
      max-height: 380px;
      white-space: pre-wrap;
    }}

    /* FIELD TEST BOX */
    .field-test-box {{
      margin-top: 16px;
      background: var(--paper-lo);
      border: 1px solid var(--hair);
      padding: 14px 16px;
      font-size: 13.5px;
    }}
    .field-test-header {{
      font-family: var(--mono);
      font-size: 10px;
      font-weight: 700;
      color: var(--red-deep);
      letter-spacing: 0.15em;
      margin-bottom: 8px;
    }}
    .test-row {{ margin-bottom: 8px; }}
    .test-label {{
      font-family: var(--mono);
      font-size: 9.5px;
      color: var(--ink-faint);
      display: block;
      margin-bottom: 2px;
      letter-spacing: 0.08em;
    }}
    .test-code {{
      font-family: var(--mono);
      font-size: 12px;
      display: block;
      padding: 4px 8px;
      background: var(--paper-hi);
      border: 1px solid var(--hair-faint);
    }}
    .test-code.input {{ color: var(--red-deep); }}
    .test-code.output {{ color: #185e3a; font-weight: 600; }}
    .test-trace {{ font-size: 13px; color: var(--ink-soft); margin-bottom: 0; }}

    /* AUXILIARY BRIGADE LIST */
    .aux-brigade-section {{
      margin-top: 36px;
      border-top: 1px dashed var(--hair);
      padding-top: 24px;
    }}
    .aux-title-heading {{
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      margin-bottom: 14px;
      color: var(--ink-soft);
    }}
    .aux-list {{
      list-style: none;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 10px;
    }}
    .aux-item {{
      background: var(--paper-hi);
      border: 1px solid var(--hair-faint);
      padding: 8px 12px;
      font-family: var(--sans);
      font-size: 12.5px;
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    .aux-badge {{
      font-family: var(--mono);
      font-size: 9.5px;
      background: var(--ink);
      color: #fff;
      padding: 2px 6px;
      font-weight: 600;
    }}

    /* PRESENTATION MODAL / FULLSCREEN MODE */
    #presModal {{
      display: none;
      position: fixed;
      inset: 0;
      z-index: 2000;
      background: #110e0c;
      color: #f7f3ea;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px 36px;
    }}
    #presModal.active {{ display: flex; }}

    .pres-topbar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: var(--mono);
      font-size: 12px;
      letter-spacing: 0.15em;
      color: #a39b8d;
      border-bottom: 1px solid rgba(255,255,255,0.12);
      padding-bottom: 14px;
    }}
    .pres-exit-btn {{
      background: var(--red);
      color: #fff;
      border: none;
      padding: 6px 14px;
      font-family: var(--mono);
      font-size: 11px;
      cursor: pointer;
      font-weight: 700;
      letter-spacing: 0.15em;
    }}

    /* SLIDE STAGE (16:9 CONTAINER) */
    .slide-stage {{
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0;
    }}
    .slide {{
      display: none;
      width: 100%;
      max-width: 1100px;
      aspect-ratio: 16 / 9;
      background: #1b1714;
      border: 1.5px solid rgba(255,255,255,0.15);
      box-shadow: 0 12px 36px rgba(0,0,0,0.6);
      padding: 48px 56px;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
    }}
    .slide.active {{ display: flex; }}

    .slide-badge {{
      font-family: var(--mono);
      font-size: 11px;
      letter-spacing: 0.22em;
      color: #e07d72;
      text-transform: uppercase;
      font-weight: 700;
    }}
    .slide-title {{
      font-family: var(--display);
      font-size: 44px;
      line-height: 1.15;
      font-weight: 900;
      color: #fdfbf7;
    }}
    .slide-subtitle {{
      font-family: var(--serif);
      font-size: 22px;
      font-style: italic;
      color: #c9c1b3;
      margin-top: 8px;
    }}
    .slide-card {{
      background: #241f1b;
      border-left: 4px solid var(--red);
      padding: 20px 24px;
      margin: 18px 0;
    }}
    .formula-text {{
      font-family: var(--mono);
      font-size: 20px;
      color: #ffd27d;
      margin-bottom: 8px;
    }}
    .formula-sub {{
      font-size: 15px;
      color: #b0a898;
    }}
    .slide-footer-row {{
      display: flex;
      justify-content: space-between;
      font-family: var(--mono);
      font-size: 12px;
      color: #8c8374;
      border-top: 1px solid rgba(255,255,255,0.1);
      padding-top: 14px;
    }}
    .slide-grid-2 {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin: 20px 0;
    }}
    .slide-panel {{
      background: #241f1b;
      padding: 20px;
      border: 1px solid rgba(255,255,255,0.08);
      font-size: 16px;
    }}
    .slide-panel.danger {{
      border-left: 3px solid var(--red);
      background: rgba(158, 35, 24, 0.12);
    }}
    .slide-hero-quote {{
      font-family: var(--serif);
      font-size: 32px;
      font-style: italic;
      line-height: 1.35;
      color: #ffd27d;
      margin: 24px 0;
      border-left: 4px solid var(--red);
      padding-left: 20px;
    }}
    .slide-body-box {{
      font-size: 18px;
      color: #d1c8b8;
      line-height: 1.6;
    }}
    .slide-contractor-list {{
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 18px 0;
    }}
    .slide-c-item {{
      background: #241f1b;
      padding: 12px 16px;
      border-left: 3px solid var(--red);
      font-size: 15px;
    }}
    .slide-c-num {{
      font-family: var(--mono);
      color: #e07d72;
      font-weight: 700;
      margin-right: 8px;
    }}

    /* PRES CONTROLS */
    .pres-controls {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(255,255,255,0.12);
      padding-top: 14px;
      font-family: var(--mono);
    }}
    .pres-nav-btn {{
      background: rgba(255,255,255,0.12);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.25);
      padding: 6px 16px;
      cursor: pointer;
      font-family: var(--mono);
      font-size: 12px;
    }}
    .pres-nav-btn:hover {{ background: var(--red); border-color: var(--red); }}
    .slide-counter {{ color: #a39b8d; font-size: 12px; }}

    /* TOAST */
    #toast {{
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--ink);
      color: #fff;
      padding: 10px 18px;
      font-family: var(--mono);
      font-size: 12px;
      border-radius: 2px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.25s;
      z-index: 3000;
    }}
    #toast.show {{ transform: translateY(0); opacity: 1; }}

    @media (max-width: 800px) {{
      .game-title {{ font-size: 32px; }}
      .slide {{ padding: 24px; aspect-ratio: auto; min-height: 420px; }}
      .slide-title {{ font-size: 28px; }}
      .slide-grid-2 {{ grid-template-columns: 1fr; }}
    }}
  </style>
</head>
<body>

  <!-- TOP MASTHEAD BAR -->
  <header class="topbar">
    <div class="brand-group">
      <a href="index.html#section-language-games" class="back-btn">&larr; WORLDFUL ATLAS</a>
      <span class="badge-game">GAME {meta['num']} // {meta['name']}</span>
    </div>
    <div class="top-actions">
      <a href="deep_play_at_the_aperture.html" class="btn-action">[ FULL MONOGRAPH ]</a>
      <button class="btn-action highlight" onclick="togglePresentationMode()">[ KEYNOTE SLIDES (16:9) ]</button>
      <div class="dropdown">
        <button class="btn-action">[ SWITCH GAME ▾ ]</button>
        <div class="dropdown-content">
          {dropdown_options}
        </div>
      </div>
    </div>
  </header>

  <!-- THOUGHT ESSAY CONTAINER -->
  <main class="essay-container" id="essayContainer">

    <!-- HEADER BLOCK -->
    <header class="game-header">
      <div class="game-vol">THE TWELVE LANGUAGE GAMES // ARCHETYPE {meta['roman']}</div>
      <h1 class="game-title">{meta['name']}</h1>
      <div class="game-motto">{meta['latin']} &mdash; {meta['subtitle']}</div>
      
      <div class="formula-banner">
        <strong>OPERATIVE FORMULATION:</strong><br>
        <code>{meta['formula']}</code>
      </div>

      <div class="spec-strip">
        <div class="spec-item">
          <strong>Human Role</strong>
          {meta['human_role']}
        </div>
        <div class="spec-item">
          <strong>Machine Role</strong>
          {meta['machine_role']}
        </div>
        <div class="spec-item">
          <strong>Valid Move</strong>
          {meta['valid_move']}
        </div>
        <div class="spec-item">
          <strong>Fatal Trap</strong>
          <span style="color:var(--red); font-weight:600;">{meta['fatal_trap']}</span>
        </div>
      </div>
    </header>

    <!-- PROSE SECTIONS -->
    <article class="prose-section">
      {html_body}
    </article>

    <!-- CONTRACTOR GUILD DOSSIER BLOCK -->
    <section class="contractor-guild-block">
      <div class="guild-badge-row">
        <h2 class="guild-title">The Contractor Guild: Completed System Instructions</h2>
        <span class="guild-count">5 PRIMARY CONTRACTORS FULLY SPECIFIED</span>
      </div>
      <p style="font-size:16px; margin-bottom:28px; color:var(--ink-soft);">
        Each language game possesses specific structural vulnerabilities where foundational models experience drift, hallucination, or unauthorized privilege elevation. Below are the completed, executable system instruction work orders from the 136-prompt canon, tailored and verified for <strong>Game {meta['num']} ({meta['name']})</strong>:
      </p>

      <!-- PRIMARY CONTRACTOR CARDS WITH FULL COMPLETED PROMPTS & TEST CASES -->
      {contractor_cards_html}

      <!-- AUXILIARY BRIGADE REGISTRY -->
      <div class="aux-brigade-section">
        <div class="aux-title-heading">Complementary Contractors Assigned from the 136 Canon</div>
        <ul class="aux-list">
          {aux_html}
        </ul>
      </div>
    </section>

    <!-- FOOTER -->
    <footer style="margin-top:60px; padding-top:24px; border-top:1.5px solid var(--hair); display:flex; justify-content:space-between; font-family:var(--mono); font-size:11.5px; color:var(--ink-faint);">
      <div>WORLDFUL PRESS // ARCHETYPE {meta['roman']}: {meta['name']}</div>
      <div>WATSON HARTSOE &middot; SEPTEMBER 7, 2026</div>
      <div><a href="deep_play_at_the_aperture.html" style="color:var(--red); text-decoration:none;">MONOGRAPH HOME &uarr;</a></div>
    </footer>

  </main>

  <!-- PRESENTATION FULLSCREEN MODAL (16:9) -->
  <div id="presModal">
    <div class="pres-topbar">
      <span>GAME {meta['num']} // KEYNOTE PRESENTATION // {meta['name']}</span>
      <button class="pres-exit-btn" onclick="togglePresentationMode()">[ EXIT TO ESSAY ]</button>
    </div>

    <div class="slide-stage">
      {slides_html}
    </div>

    <div class="pres-controls">
      <button class="pres-nav-btn" onclick="prevSlide()">&larr; PREVIOUS</button>
      <span class="slide-counter" id="slideCounter">SLIDE 1 / 8</span>
      <button class="pres-nav-btn" onclick="nextSlide()">NEXT &rarr;</button>
    </div>
  </div>

  <!-- TOAST -->
  <div id="toast">Prompt copied to clipboard!</div>

  <script>
    let currentSlide = 1;
    const totalSlides = 8;

    function togglePresentationMode() {{
      const modal = document.getElementById('presModal');
      modal.classList.toggle('active');
    }}

    function showSlide(n) {{
      const slides = document.querySelectorAll('.slide');
      if (n > totalSlides) n = totalSlides;
      if (n < 1) n = 1;
      currentSlide = n;
      slides.forEach(s => s.classList.remove('active'));
      const activeSlide = document.querySelector(`.slide[data-slide="${{n}}"]`);
      if (activeSlide) activeSlide.classList.add('active');
      document.getElementById('slideCounter').innerText = `SLIDE ${{currentSlide}} / ${{totalSlides}}`;
    }}

    function nextSlide() {{
      if (currentSlide < totalSlides) showSlide(currentSlide + 1);
    }}

    function prevSlide() {{
      if (currentSlide > 1) showSlide(currentSlide - 1);
    }}

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {{
      const modal = document.getElementById('presModal');
      if (!modal.classList.contains('active')) {{
        if (e.key === 'p' || e.key === 'P') togglePresentationMode();
        return;
      }}
      if (e.key === 'ArrowRight' || e.key === ' ') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'Escape') togglePresentationMode();
    }});

    // Completed Prompts Store (pre-serialized JSON)
    const PROMPTS_STORE = {prompts_store_json};

    function copyPromptDirectives(key) {{
      const text = PROMPTS_STORE[key] || "Prompt text unavailable.";
      navigator.clipboard.writeText(text).then(() => {{
        const toast = document.getElementById('toast');
        toast.innerText = `Completed Contractor Prompt copied!`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
      }});
    }}
  </script>
</body>
</html>
"""

    # Save root file
    filename_root = f"{num}_{name.lower()}.html"
    with open(os.path.join(base_dir, filename_root), 'w') as f:
        f.write(full_html)
    print(f"Generated {filename_root} in root")

    # Mirror in WAYS TO WRITE/language_games/
    filename_mirror = os.path.join(games_dir, f"{num}_{name.lower()}.html")
    with open(filename_mirror, 'w') as f:
        f.write(full_html)

    # Overwrite alias
    filename_alias = os.path.join(games_dir, f"{num}_{name.lower()}_yellow_pages.html")
    with open(filename_alias, 'w') as f:
        f.write(full_html)

# Build all 12 standalone games
for i in range(1, 13):
    build_standalone_game(f"{i:02d}")

print("All 12 standalone games compiled successfully.")

# ---------------------------------------------------------
# PART 2: BUILD PRESENTATION.HTML (MASTER APP) WITHOUT EMOJIS & WITH COMPLETED PROMPTS
# ---------------------------------------------------------
print("Updating presentation.html master application...")

# Re-run build_presentation_app logic with completed prompts
# Let's inspect presentation.html and update it cleanly
with open(os.path.join(base_dir, "WAYS TO WRITE/build_presentation_app.py"), "r") as f:
    pres_script = f.read()

# Remove all emojis in presentation script
pres_script = pres_script.replace('📖 THOUGHT ESSAY', '[ THOUGHT ESSAY ]')
pres_script = pres_script.replace('🖥️ KEYNOTE DECK', '[ KEYNOTE DECK ]')
pres_script = pres_script.replace('★ KEYNOTE: DEEP PLAY AT THE APERTURE', '[ KEYNOTE ] DEEP PLAY AT THE APERTURE')
pres_script = pres_script.replace('📜 FULL MONOGRAPH (DEEP PLAY)', '[ MONOGRAPH ] DEEP PLAY')
pres_script = pres_script.replace('📖 READ THOUGHT ESSAYS', 'READ THOUGHT ESSAYS ->')
pres_script = pres_script.replace('🖥️ LAUNCH KEYNOTE DECK', 'LAUNCH KEYNOTE DECK ->')
pres_script = pres_script.replace('★ DEEP PLAY TOUR', '[ TOUR ] DEEP PLAY')

# Save updated script
with open(os.path.join(base_dir, "WAYS TO WRITE/build_presentation_app.py"), "w") as f:
    f.write(pres_script)

print("Saved updated build_presentation_app.py.")
